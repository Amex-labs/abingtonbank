const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8080);
const ROOT_DIR = __dirname;
const IS_VERCEL = Boolean(process.env.VERCEL);
const WRITABLE_ROOT = IS_VERCEL ? path.join("/tmp", "abington-banking-web") : ROOT_DIR;
const OUTBOX_DIR = path.join(WRITABLE_ROOT, "outbox");
const PREVIEW_ROOT = path.join(OUTBOX_DIR, "previews");
const EMAIL_PREVIEW_DIR = path.join(PREVIEW_ROOT, "email");
const OTP_EMAIL_PREVIEW_DIR = path.join(EMAIL_PREVIEW_DIR, "otp");
const PDF_PREVIEW_DIR = path.join(PREVIEW_ROOT, "pdf");
const AUDIT_DIR = path.join(OUTBOX_DIR, "audit");
const AUDIT_LOG = path.join(AUDIT_DIR, "server-audit.log");
const OTP_TTL_MS = 30 * 60 * 1000;
const STARTED_AT = new Date().toISOString();

const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
});

const transferSessions = new Map();

ensureDirectories([
    OUTBOX_DIR,
    PREVIEW_ROOT,
    EMAIL_PREVIEW_DIR,
    OTP_EMAIL_PREVIEW_DIR,
    PDF_PREVIEW_DIR,
    AUDIT_DIR
]);

function ensureDirectories(directories) {
    directories.forEach((directory) => {
        fs.mkdirSync(directory, { recursive: true });
    });
}

function uid(prefix) {
    return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function sanitizeFilePart(value) {
    return String(value || "file")
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "file";
}

function formatMoney(value) {
    return moneyFormatter.format(Number(value || 0));
}

function formatDateTime(value) {
    return dateFormatter.format(new Date(value));
}

function titleCaseStatus(status) {
    return String(status || "")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) => character.toUpperCase());
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapePdfText(value) {
    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/\r/g, "")
        .replace(/\n/g, " ");
}

function buildPdfFromLines(lines) {
    const printableLines = lines.slice(0, 42);
    const stream = [
        "BT",
        "/F1 11 Tf",
        "50 760 Td",
        "14 TL",
        ...printableLines.flatMap((line, index) => {
            const escaped = escapePdfText(line);
            return index === 0 ? [`(${escaped}) Tj`] : ["T*", `(${escaped}) Tj`];
        }),
        "ET"
    ].join("\n");

    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`
    ];

    let body = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
        offsets.push(Buffer.byteLength(body, "utf8"));
        body += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = Buffer.byteLength(body, "utf8");
    body += `xref\n0 ${objects.length + 1}\n`;
    body += "0000000000 65535 f \n";
    for (let index = 1; index <= objects.length; index += 1) {
        body += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
    }
    body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return Buffer.from(body, "utf8");
}

function apiHeaders(extraHeaders = {}) {
    return {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        ...extraHeaders
    };
}

function sanitizeJsonpCallback(value) {
    const callback = String(value || "").trim();
    return /^[A-Za-z_$][0-9A-Za-z_$]*(?:\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback) ? callback : "";
}

function jsonResponse(response, statusCode, payload) {
    response.writeHead(statusCode, apiHeaders({
        "Content-Type": "application/json; charset=utf-8"
    }));
    response.end(JSON.stringify(payload));
}

function jsonpResponse(response, statusCode, callbackName, payload) {
    const safeCallback = sanitizeJsonpCallback(callbackName);
    if (!safeCallback) {
        jsonResponse(response, 400, { ok: false, error: "Invalid callback name." });
        return;
    }
    response.writeHead(statusCode, apiHeaders({
        "Content-Type": "application/javascript; charset=utf-8",
        "X-Content-Type-Options": "nosniff"
    }));
    response.end(`typeof ${safeCallback} === "function" && ${safeCallback}(${JSON.stringify(payload)});`);
}

function apiResponse(response, statusCode, payload, callbackName = "") {
    if (callbackName) {
        jsonpResponse(response, statusCode, callbackName, payload);
        return;
    }
    jsonResponse(response, statusCode, payload);
}

function fileResponse(response, filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const contentType = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".txt": "text/plain; charset=utf-8",
        ".pdf": "application/pdf"
    }[extension] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            jsonResponse(response, 404, { ok: false, error: "File not found." });
            return;
        }
        response.writeHead(200, {
            "Content-Type": contentType,
            "Cache-Control": extension === ".pdf" ? "no-store" : "public, max-age=60"
        });
        response.end(content);
    });
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let rawBody = "";
        request.on("data", (chunk) => {
            rawBody += chunk;
            if (rawBody.length > 1_000_000) {
                reject(new Error("Request body too large."));
                request.destroy();
            }
        });
        request.on("end", () => {
            try {
                resolve(rawBody ? JSON.parse(rawBody) : {});
            } catch (error) {
                reject(new Error("Invalid JSON payload."));
            }
        });
        request.on("error", reject);
    });
}

function writeAudit(action, detail, metadata = {}) {
    const entry = {
        id: uid("audit"),
        action,
        detail,
        metadata,
        timestamp: new Date().toISOString()
    };
    fs.appendFileSync(AUDIT_LOG, `${JSON.stringify(entry)}\n`, "utf8");
    return entry;
}

function writePreviewFile(directory, fileName, content) {
    const fullPath = path.join(directory, fileName);
    fs.writeFileSync(fullPath, content);
    return fullPath;
}

function toPreviewUrl(fullPath) {
    const relative = path.relative(PREVIEW_ROOT, fullPath).split(path.sep).join("/");
    return `/__preview__/${relative}`;
}

function getTransferSession(transferId, defaults = {}) {
    if (!transferSessions.has(transferId)) {
        transferSessions.set(transferId, {
            transferId,
            receiptId: defaults.receiptId || "",
            clientName: defaults.clientName || "",
            destinationLabel: defaults.destinationLabel || "",
            receiptEmail: defaults.receiptEmail || "",
            railLabel: defaults.railLabel || "",
            approvalRecipient: defaults.approvalRecipient || "",
            amount: defaults.amount || 0,
            lastChallengeStage: defaults.lastChallengeStage || "",
            lastReviewAmount: defaults.lastReviewAmount || 0,
            challenges: [],
            lastReceiptDelivery: null
        });
    }
    const session = transferSessions.get(transferId);
    if (defaults.receiptId) {
        session.receiptId = defaults.receiptId;
    }
    if (defaults.clientName) {
        session.clientName = defaults.clientName;
    }
    if (defaults.destinationLabel) {
        session.destinationLabel = defaults.destinationLabel;
    }
    if (defaults.receiptEmail) {
        session.receiptEmail = defaults.receiptEmail;
    }
    if (defaults.railLabel) {
        session.railLabel = defaults.railLabel;
    }
    if (defaults.approvalRecipient) {
        session.approvalRecipient = defaults.approvalRecipient;
    }
    if (typeof defaults.amount === "number" && defaults.amount > 0) {
        session.amount = defaults.amount;
    }
    if (defaults.lastChallengeStage) {
        session.lastChallengeStage = defaults.lastChallengeStage;
    }
    if (typeof defaults.lastReviewAmount === "number" && defaults.lastReviewAmount > 0) {
        session.lastReviewAmount = defaults.lastReviewAmount;
    }
    return session;
}

function buildOtpEmailPreview(payload, challenge, code) {
    const previewFileName = `${sanitizeFilePart(payload.receiptId || payload.transferId)}-${payload.stage}-${Date.now()}.html`;
    const previewContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OTP Email Preview ${escapeHtml(payload.receiptId || payload.transferId)}</title>
</head>
<body style="margin:0;padding:32px;background:#071017;color:#edf1f3;font-family:Segoe UI,Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;border:1px solid rgba(214,176,110,.25);border-radius:24px;padding:28px;background:#0b1620;">
        <p style="margin:0 0 10px;color:#d6b06e;letter-spacing:.18em;text-transform:uppercase;font-size:12px;">Local OTP email preview</p>
        <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:32px;">Abington Banking approval code</h1>
        <p style="margin:0 0 24px;color:#96a5af;">This preview simulates an OTP email redirected to a fixed local inbox. No real email was sent.</p>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:24px;">
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Inbox target</strong>
                <span style="color:#96a5af;">${escapeHtml(payload.recipientEmail)}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Stage</strong>
                <span style="color:#96a5af;">${escapeHtml(titleCaseStatus(payload.stage))}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Customer</strong>
                <span style="color:#96a5af;">${escapeHtml(payload.clientName || "Relationship account")}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Transfer</strong>
                <span style="color:#96a5af;">${escapeHtml(payload.destinationLabel)}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Amount</strong>
                <span style="color:#96a5af;">${escapeHtml(formatMoney(payload.amount))}</span>
            </div>
        </div>
        <div style="margin:0 0 20px;padding:18px;border-radius:18px;background:#101c27;">
            <p style="margin:0 0 8px;color:#96a5af;">Current preview code</p>
            <strong style="font-size:32px;letter-spacing:.16em;">${escapeHtml(code)}</strong>
        </div>
        <p style="margin:0 0 8px;"><strong>Generated:</strong> ${escapeHtml(challenge.createdAt)}</p>
        <p style="margin:0;"><strong>Expires:</strong> ${escapeHtml(challenge.expiresAt)}</p>
    </div>
</body>
</html>`;

    const fullPath = writePreviewFile(OTP_EMAIL_PREVIEW_DIR, previewFileName, previewContent);
    return {
        channel: "otp-email-local-preview",
        target: payload.recipientEmail,
        fileName: previewFileName,
        fileUrl: toPreviewUrl(fullPath),
        previewCode: code,
        createdAt: challenge.createdAt,
        expiresAt: challenge.expiresAt
    };
}

function buildReceiptLines(receipt) {
    const lines = [
        "ABINGTON BANKING",
        receipt.kind || "Transfer receipt",
        "",
        `Receipt ID: ${receipt.receiptId}`,
        `Status: ${receipt.status}`,
        `Submitted: ${formatDateTime(receipt.timestamp)}`,
        `Rail: ${receipt.railLabel}`,
        `Funding account: ${receipt.fromLabel}`,
        `Destination: ${receipt.destinationLabel}`,
        `Amount: ${formatMoney(receipt.amount)}`,
        `Effective date: ${receipt.effectiveDate}`,
        `Transfer description: ${receipt.purpose}`,
        `Memo: ${receipt.memo}`
    ];

    if (receipt.receivingBank) {
        lines.push(`Receiving bank: ${receipt.receivingBank}`);
    }
    if (receipt.routingNumber) {
        lines.push(`Routing / ABA: ${receipt.routingNumber}`);
    }
    if (receipt.accountNumber) {
        lines.push(`Account reference: ${receipt.accountNumber}`);
    }
    if (receipt.reference) {
        lines.push(`Reference: ${receipt.reference}`);
    }
    if (receipt.receiptEmail) {
        lines.push(`Receipt email: ${receipt.receiptEmail}`);
    }
    if (Array.isArray(receipt.statusHistory) && receipt.statusHistory.length) {
        lines.push("");
        lines.push("Status history:");
        receipt.statusHistory.slice(0, 10).forEach((entry) => {
            lines.push(`- ${titleCaseStatus(entry.status)} | ${formatDateTime(entry.timestamp)} | ${entry.note}`);
        });
    }
    if (Array.isArray(receipt.approvalHistory) && receipt.approvalHistory.length) {
        lines.push("");
        lines.push("Approval history:");
        receipt.approvalHistory.slice(0, 10).forEach((entry) => {
            lines.push(`- ${titleCaseStatus(entry.status)} | ${formatDateTime(entry.timestamp)} | review amount $${entry.reviewAmount}`);
        });
    }
    lines.push("");
    lines.push("Notice: This receipt is generated by a fictional local preview environment.");
    return lines;
}

function buildReceiptEmailHtml(receipt, delivery) {
    const historyMarkup = (receipt.statusHistory || [])
        .slice(0, 8)
        .map((entry) => `<li><strong>${escapeHtml(titleCaseStatus(entry.status))}</strong> <span>${escapeHtml(formatDateTime(entry.timestamp))}</span><br>${escapeHtml(entry.note)}</li>`)
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Receipt Preview ${escapeHtml(receipt.receiptId)}</title>
</head>
<body style="margin:0;padding:32px;background:#071017;color:#edf1f3;font-family:Segoe UI,Arial,sans-serif;">
    <div style="max-width:720px;margin:0 auto;border:1px solid rgba(214,176,110,.25);border-radius:24px;padding:28px;background:#0b1620;">
        <p style="margin:0 0 10px;color:#d6b06e;letter-spacing:.18em;text-transform:uppercase;font-size:12px;">Local email preview</p>
        <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:32px;">Abington Banking receipt notice</h1>
        <p style="margin:0 0 24px;color:#96a5af;">This file simulates a receipt email in local preview mode. No real email was sent.</p>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:24px;">
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Recipient</strong>
                <span style="color:#96a5af;">${escapeHtml(delivery.recipientEmail)}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Attachment</strong>
                <span style="color:#96a5af;">${escapeHtml(delivery.pdfFileName)}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Amount</strong>
                <span style="color:#96a5af;">${escapeHtml(formatMoney(receipt.amount))}</span>
            </div>
            <div style="padding:16px;border-radius:18px;background:#101c27;">
                <strong style="display:block;">Status</strong>
                <span style="color:#96a5af;">${escapeHtml(receipt.status)}</span>
            </div>
        </div>
        <p style="margin:0 0 8px;"><strong>Receipt ID:</strong> ${escapeHtml(receipt.receiptId)}</p>
        <p style="margin:0 0 8px;"><strong>Destination:</strong> ${escapeHtml(receipt.destinationLabel)}</p>
        <p style="margin:0 0 8px;"><strong>Rail:</strong> ${escapeHtml(receipt.railLabel)}</p>
        <p style="margin:0 0 20px;"><strong>PDF preview:</strong> <a href="${escapeHtml(delivery.pdfUrl)}" style="color:#d6b06e;">${escapeHtml(delivery.pdfUrl)}</a></p>
        <h2 style="font-family:Georgia,serif;">Recent progress</h2>
        <ol style="padding-left:20px;color:#96a5af;">${historyMarkup || "<li>No status history recorded.</li>"}</ol>
    </div>
</body>
</html>`;
}

function createChallenge(payload, options = {}) {
    const session = getTransferSession(payload.transferId, {
        receiptId: payload.receiptId,
        clientName: payload.clientName,
        destinationLabel: payload.destinationLabel,
        receiptEmail: payload.receiptEmail,
        railLabel: payload.railLabel,
        approvalRecipient: payload.recipientEmail,
        amount: payload.amount,
        lastChallengeStage: payload.stage,
        lastReviewAmount: payload.reviewAmount
    });

    const code = `${crypto.randomInt(100000, 1000000)}`;
    const salt = crypto.randomBytes(8).toString("hex");
    const challengeId = uid("otp");
    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(new Date(issuedAt).getTime() + OTP_TTL_MS).toISOString();
    const challenge = {
        id: challengeId,
        stage: payload.stage,
        salt,
        codeHash: crypto.createHash("sha256").update(`${code}:${salt}`).digest("hex"),
        createdAt: issuedAt,
        expiresAt,
        reviewAmount: payload.reviewAmount,
        attempts: 0,
        resolvedAt: "",
        preview: null
    };

    challenge.preview = buildOtpEmailPreview(payload, challenge, code);
    session.activeChallenge = challenge;
    session.amount = payload.amount;
    session.lastChallengeStage = payload.stage;
    session.lastReviewAmount = payload.reviewAmount;
    session.challenges.unshift({
        id: challenge.id,
        stage: challenge.stage,
        createdAt: challenge.createdAt,
        expiresAt: challenge.expiresAt,
        previewFileName: challenge.preview.fileName
    });

    writeAudit(options.resend ? "challenge.resent" : "challenge.issued", `Issued ${payload.stage} approval code for ${payload.transferId}.`, {
        transferId: payload.transferId,
        receiptId: payload.receiptId,
        clientName: payload.clientName,
        stage: payload.stage,
        previewFileName: challenge.preview.fileName,
        recipient: payload.recipientEmail
    });

    return {
        challengeId: challenge.id,
        issuedAt: challenge.createdAt,
        expiresAt: challenge.expiresAt,
        preview: challenge.preview
    };
}

function verifyChallenge(payload) {
    const session = transferSessions.get(payload.transferId);
    if (!session?.activeChallenge) {
        return { ok: false, statusCode: 404, error: "No active challenge was found for this transfer." };
    }
    const challenge = session.activeChallenge;
    if (challenge.id !== payload.challengeId) {
        return { ok: false, statusCode: 409, error: "The active approval changed. Refresh the approval code and try again." };
    }
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
        session.activeChallenge = null;
        return { ok: false, statusCode: 410, error: "The current approval code expired. Generate a new approval code and try again." };
    }

    const attemptedHash = crypto.createHash("sha256").update(`${String(payload.code || "").trim()}:${challenge.salt}`).digest("hex");
    if (attemptedHash !== challenge.codeHash) {
        challenge.attempts += 1;
        writeAudit("challenge.failed", `Approval code mismatch for ${payload.transferId}.`, {
            transferId: payload.transferId,
            challengeId: challenge.id,
            stage: challenge.stage,
            attempts: challenge.attempts
        });
        return { ok: false, statusCode: 422, error: "The approval code did not match." };
    }

    challenge.resolvedAt = new Date().toISOString();
    session.activeChallenge = null;
    writeAudit("challenge.verified", `Approval code verified for ${payload.transferId}.`, {
        transferId: payload.transferId,
        challengeId: challenge.id,
        stage: challenge.stage,
        verifiedAt: challenge.resolvedAt
    });
    return {
        ok: true,
        statusCode: 200,
        verifiedAt: challenge.resolvedAt
    };
}

function createReceiptDelivery(payload) {
    const session = getTransferSession(payload.transferId, {
        receiptId: payload.receipt?.receiptId,
        destinationLabel: payload.receipt?.destinationLabel,
        receiptEmail: payload.recipientEmail || payload.receipt?.receiptEmail,
        railLabel: payload.receipt?.railLabel
    });

    const receipt = payload.receipt || {};
    const receiptLines = buildReceiptLines(receipt);
    const safeBaseName = `${sanitizeFilePart(receipt.receiptId || payload.transferId)}-${sanitizeFilePart(payload.eventType || "update")}-${Date.now()}`;
    const pdfFileName = `${safeBaseName}.pdf`;
    const pdfPath = path.join(PDF_PREVIEW_DIR, pdfFileName);
    fs.writeFileSync(pdfPath, buildPdfFromLines(receiptLines));

    const delivery = {
        receiptId: receipt.receiptId,
        recipientEmail: payload.recipientEmail || receipt.receiptEmail,
        eventType: payload.eventType || "submitted",
        generatedAt: payload.generatedAt || new Date().toISOString(),
        pdfFileName,
        pdfUrl: toPreviewUrl(pdfPath)
    };

    const emailFileName = `${safeBaseName}.html`;
    const emailPath = path.join(EMAIL_PREVIEW_DIR, emailFileName);
    fs.writeFileSync(emailPath, buildReceiptEmailHtml(receipt, delivery), "utf8");

    session.lastReceiptDelivery = {
        ...delivery,
        emailPreviewFileName: emailFileName,
        emailPreviewUrl: toPreviewUrl(emailPath)
    };

    writeAudit("receipt.preview.created", `Receipt preview prepared for ${payload.transferId}.`, {
        transferId: payload.transferId,
        receiptId: receipt.receiptId,
        eventType: payload.eventType,
        recipientEmail: delivery.recipientEmail,
        pdfFileName,
        emailPreviewFileName: emailFileName
    });

    return session.lastReceiptDelivery;
}

function listInboxOverview() {
    const sessions = Array.from(transferSessions.values())
        .map((session) => ({
            transferId: session.transferId,
            receiptId: session.receiptId,
            clientName: session.clientName,
            destinationLabel: session.destinationLabel,
            railLabel: session.railLabel,
            receiptEmail: session.receiptEmail,
            approvalRecipient: session.approvalRecipient,
            amount: session.amount,
            activeChallenge: session.activeChallenge
                ? {
                    id: session.activeChallenge.id,
                    stage: session.activeChallenge.stage,
                    createdAt: session.activeChallenge.createdAt,
                    expiresAt: session.activeChallenge.expiresAt,
                    reviewAmount: session.activeChallenge.reviewAmount,
                    preview: session.activeChallenge.preview
                }
                : null,
            challengeHistory: session.challenges.slice(0, 8),
            lastReceiptDelivery: session.lastReceiptDelivery
        }))
        .sort((left, right) => {
            const leftTime = left.activeChallenge?.createdAt || left.lastReceiptDelivery?.generatedAt || "";
            const rightTime = right.activeChallenge?.createdAt || right.lastReceiptDelivery?.generatedAt || "";
            return rightTime.localeCompare(leftTime);
        });

    return {
        inboxTarget: "abingtonbank@aol.com",
        serverStartedAt: STARTED_AT,
        sessionCount: sessions.length,
        sessions
    };
}

function regenerateInboxOtp(transferId) {
    const session = transferSessions.get(transferId);
    if (!session) {
        return { ok: false, statusCode: 404, error: "No transfer session was found for this inbox item." };
    }

    const stage = session.activeChallenge?.stage || session.lastChallengeStage;
    if (!stage) {
        return { ok: false, statusCode: 409, error: "There is no approval stage available to regenerate for this transfer." };
    }

    const result = createChallenge({
        transferId: session.transferId,
        receiptId: session.receiptId,
        clientName: session.clientName,
        stage,
        recipientEmail: session.approvalRecipient || "abingtonbank@aol.com",
        destinationLabel: session.destinationLabel,
        railLabel: session.railLabel,
        receiptEmail: session.receiptEmail,
        amount: session.amount,
        requestedAt: new Date().toISOString(),
        reviewAmount: session.activeChallenge?.reviewAmount || session.lastReviewAmount || 0
    }, { resend: true });

    return {
        ok: true,
        statusCode: 200,
        challenge: result
    };
}

function routeApi(request, response, url) {
    const pathname = url.pathname;
    const callbackName = sanitizeJsonpCallback(url.searchParams.get("callback"));

    if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
        response.writeHead(204, apiHeaders());
        response.end();
        return true;
    }

    if (request.method === "GET" && pathname === "/api/health") {
        apiResponse(response, 200, {
            ok: true,
            mode: "local-preview",
            startedAt: STARTED_AT,
            channels: ["otp-email-preview", "receipt-pdf-preview", "email-preview"],
            outboxPath: "outbox/previews"
        }, callbackName);
        return true;
    }

    if (request.method === "GET" && pathname === "/api/inbox/overview") {
        apiResponse(response, 200, {
            ok: true,
            ...listInboxOverview()
        }, callbackName);
        return true;
    }

    if (request.method === "GET" && pathname === "/api/inbox/regenerate-otp") {
        const result = regenerateInboxOtp(url.searchParams.get("transferId"));
        apiResponse(response, result.statusCode, result, callbackName);
        return true;
    }

    if (request.method === "POST" && pathname === "/api/challenges/issue") {
        readJsonBody(request)
            .then((payload) => {
                jsonResponse(response, 200, { ok: true, ...createChallenge(payload) });
            })
            .catch((error) => jsonResponse(response, 400, { ok: false, error: error.message }));
        return true;
    }

    if (request.method === "POST" && pathname === "/api/challenges/resend") {
        readJsonBody(request)
            .then((payload) => {
                jsonResponse(response, 200, { ok: true, ...createChallenge(payload, { resend: true }) });
            })
            .catch((error) => jsonResponse(response, 400, { ok: false, error: error.message }));
        return true;
    }

    if (request.method === "POST" && pathname === "/api/challenges/verify") {
        readJsonBody(request)
            .then((payload) => {
                const result = verifyChallenge(payload);
                jsonResponse(response, result.statusCode, result);
            })
            .catch((error) => jsonResponse(response, 400, { ok: false, error: error.message }));
        return true;
    }

    if (request.method === "POST" && pathname === "/api/inbox/regenerate-otp") {
        readJsonBody(request)
            .then((payload) => {
                const result = regenerateInboxOtp(payload.transferId);
                jsonResponse(response, result.statusCode, result);
            })
            .catch((error) => jsonResponse(response, 400, { ok: false, error: error.message }));
        return true;
    }

    if (request.method === "POST" && pathname === "/api/receipts/email-preview") {
        readJsonBody(request)
            .then((payload) => {
                jsonResponse(response, 200, { ok: true, delivery: createReceiptDelivery(payload) });
            })
            .catch((error) => jsonResponse(response, 400, { ok: false, error: error.message }));
        return true;
    }

    return false;
}

function resolveStaticPath(pathname) {
    if (pathname === "/") {
        return path.join(ROOT_DIR, "index.html");
    }
    if (pathname === "/admin" || pathname === "/approval-inbox") {
        return path.join(ROOT_DIR, "admin.html");
    }
    if (pathname.startsWith("/__preview__/")) {
        const previewRelative = pathname.replace("/__preview__/", "");
        const fullPath = path.join(PREVIEW_ROOT, previewRelative);
        if (!fullPath.startsWith(PREVIEW_ROOT)) {
            return null;
        }
        return fullPath;
    }
    const cleanPath = pathname.replace(/^\/+/, "");
    const fullPath = path.join(ROOT_DIR, cleanPath);
    if (!fullPath.startsWith(ROOT_DIR)) {
        return null;
    }
    return fullPath;
}

function handleRequest(request, response) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (routeApi(request, response, url)) {
        return;
    }

    const filePath = resolveStaticPath(url.pathname);
    if (!filePath) {
        jsonResponse(response, 404, { ok: false, error: "Not found." });
        return;
    }
    fileResponse(response, filePath);
}

module.exports = handleRequest;

if (require.main === module) {
    const server = http.createServer(handleRequest);
    server.listen(PORT, () => {
        console.log(`Abington Banking local preview server running at http://127.0.0.1:${PORT}`);
        console.log(`Outbox preview files are written to ${OUTBOX_DIR}`);
    });
}
