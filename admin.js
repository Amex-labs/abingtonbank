const adminState = {
    authenticated: false,
    loading: false,
    backend: null,
    inbox: null,
    pollHandle: null
};

const adminSessionKey = "abington-admin-session";

const adminCredential = {
    email: "abingtonbank@aol.com",
    password: "Inbox!2026"
};

async function adminReadJson(response) {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
        throw new Error(payload.error || "The administrative service could not complete the request.");
    }
    return payload;
}

function adminFormatMoney(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
    }).format(Number(value || 0));
}

function adminFormatDateTime(value) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(new Date(value));
}

function adminTitleCase(value) {
    return String(value || "")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) => character.toUpperCase());
}

function setAdminFeedback(message, tone = "alert") {
    const target = document.getElementById("admin-login-feedback");
    target.hidden = !message;
    target.textContent = message || "";
    target.dataset.tone = tone;
}

function saveAdminSession() {
    try {
        window.sessionStorage.setItem(adminSessionKey, JSON.stringify({
            authenticated: adminState.authenticated
        }));
    } catch (error) {
        // Ignore storage errors in local preview mode.
    }
}

function loadAdminSession() {
    try {
        const raw = window.sessionStorage.getItem(adminSessionKey);
        if (!raw) {
            return;
        }
        const saved = JSON.parse(raw);
        adminState.authenticated = Boolean(saved.authenticated);
    } catch (error) {
        // Ignore malformed stored sessions.
    }
}

function bindPasswordToggles() {
    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
        if (button.dataset.passwordToggleBound === "true") {
            return;
        }
        const field = button.closest(".password-field");
        const input = field?.querySelector("input");
        const label = button.querySelector("[data-password-toggle-text]");
        if (!input) {
            return;
        }

        const setVisible = (visible) => {
            input.type = visible ? "text" : "password";
            button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
            button.setAttribute("aria-pressed", String(visible));
            if (label) {
                label.textContent = visible ? "Hide" : "Show";
            }
        };

        setVisible(false);
        button.addEventListener("click", () => {
            setVisible(input.type === "password");
        });
        button.dataset.passwordToggleBound = "true";
    });
}

function setAdminView() {
    document.getElementById("admin-login").hidden = adminState.authenticated;
    document.getElementById("admin-dashboard").hidden = !adminState.authenticated;
    const refreshButton = document.getElementById("admin-refresh-button");
    if (refreshButton) {
        refreshButton.disabled = adminState.loading;
        refreshButton.textContent = adminState.loading ? "Refreshing..." : "Refresh inbox";
    }
    saveAdminSession();
}

function startAdminPolling() {
    stopAdminPolling();
    adminState.pollHandle = window.setInterval(() => {
        if (!adminState.authenticated || adminState.loading) {
            return;
        }
        refreshAdminDashboard().catch(() => {
            // Keep polling quiet; visible failures already render in the dashboard.
        });
    }, 5000);
}

function stopAdminPolling() {
    if (adminState.pollHandle) {
        window.clearInterval(adminState.pollHandle);
        adminState.pollHandle = null;
    }
}

async function refreshAdminDashboard() {
    adminState.loading = true;
    setAdminView();
    try {
        const [healthResponse, inboxResponse] = await Promise.all([
            fetch("/api/health", { cache: "no-store" }),
            fetch("/api/inbox/overview", { cache: "no-store" })
        ]);
        adminState.backend = await adminReadJson(healthResponse);
        adminState.inbox = await adminReadJson(inboxResponse);
        renderAdminDashboard();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        renderAdminError(message);
    } finally {
        adminState.loading = false;
        setAdminView();
    }
}

function renderAdminError(message) {
    document.getElementById("admin-health-panel").innerHTML = `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>Service unavailable</strong>
                    <span>${message}</span>
                </div>
            </div>
        </article>
    `;
    document.getElementById("admin-otp-queue").innerHTML = "";
    document.getElementById("admin-receipt-list").innerHTML = "";
}

function renderAdminDashboard() {
    const backend = adminState.backend || {};
    const inbox = adminState.inbox || { sessions: [], sessionCount: 0, inboxTarget: adminCredential.email };
    const activeItems = (inbox.sessions || []).filter((session) => session.activeChallenge);
    const receiptItems = (inbox.sessions || []).filter((session) => session.lastReceiptDelivery);

    document.getElementById("admin-health-panel").innerHTML = `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>Delivery service</strong>
                    <span>${backend.mode || "local-preview"}</span>
                </div>
                <strong>${backend.ok ? "Online" : "Offline"}</strong>
            </div>
            <span>${backend.startedAt ? `Started ${adminFormatDateTime(backend.startedAt)}` : "No startup timestamp available."}</span>
        </article>
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>Inbox target</strong>
                    <span>${inbox.inboxTarget}</span>
                </div>
                <strong>${inbox.sessionCount || 0} sessions</strong>
            </div>
            <span>${inbox.serverStartedAt ? `Session service active since ${adminFormatDateTime(inbox.serverStartedAt)}` : "Waiting for activity."}</span>
        </article>
    `;

    document.getElementById("admin-otp-queue").innerHTML = activeItems.length ? activeItems.map((session) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${session.destinationLabel}</strong>
                    <span>${adminTitleCase(session.activeChallenge.stage)} • ${session.railLabel}</span>
                </div>
                <strong>${adminFormatMoney(session.amount)}</strong>
            </div>
            <span>${session.receiptId} • Expires ${adminFormatDateTime(session.activeChallenge.expiresAt)}</span>
            <span>Approval code ${session.activeChallenge.preview?.previewCode || "Unavailable"}</span>
            <span><a href="${session.activeChallenge.preview?.fileUrl || "#"}" target="_blank" rel="noreferrer">Open approval email record</a></span>
            <div class="hold-actions">
                <button class="mini-button" type="button" data-admin-regenerate="${session.transferId}">Generate new approval code</button>
            </div>
        </article>
    `).join("") : `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>No active approvals</strong>
                    <span>New approval requests will appear here when a transfer reaches a checkpoint.</span>
                </div>
            </div>
        </article>
    `;

    document.getElementById("admin-receipt-list").innerHTML = receiptItems.length ? receiptItems.map((session) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${session.destinationLabel}</strong>
                    <span>${session.lastReceiptDelivery.recipientEmail} • ${session.lastReceiptDelivery.eventType}</span>
                </div>
                <strong>${session.lastReceiptDelivery.pdfFileName}</strong>
            </div>
            <span>Generated ${adminFormatDateTime(session.lastReceiptDelivery.generatedAt)}</span>
            <span><a href="${session.lastReceiptDelivery.pdfUrl}" target="_blank" rel="noreferrer">Open PDF</a> • <a href="${session.lastReceiptDelivery.emailPreviewUrl}" target="_blank" rel="noreferrer">Open email preview</a></span>
        </article>
    `).join("") : `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>No receipt artifacts</strong>
                    <span>Receipt delivery artifacts appear here after transfer submission or completion.</span>
                </div>
            </div>
        </article>
    `;
}

function bindAdminEvents() {
    document.getElementById("admin-login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "").trim().toLowerCase();
        const password = String(formData.get("password") || "").trim();
        if (email !== adminCredential.email || password !== adminCredential.password) {
            setAdminFeedback("The administrative credential did not match.", "alert");
            return;
        }
        setAdminFeedback("", "success");
        adminState.authenticated = true;
        setAdminView();
        startAdminPolling();
        refreshAdminDashboard().catch((error) => setAdminFeedback(error instanceof Error ? error.message : String(error), "alert"));
    });

    document.getElementById("admin-refresh-button").addEventListener("click", () => {
        refreshAdminDashboard().catch((error) => setAdminFeedback(error instanceof Error ? error.message : String(error), "alert"));
    });

    document.getElementById("admin-logout-button").addEventListener("click", () => {
        adminState.authenticated = false;
        stopAdminPolling();
        setAdminFeedback("", "success");
        setAdminView();
    });

    document.getElementById("admin-otp-queue").addEventListener("click", async (event) => {
        const button = event.target.closest("[data-admin-regenerate]");
        if (!button) {
            return;
        }
        try {
            await fetch("/api/inbox/regenerate-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    transferId: button.dataset.adminRegenerate
                })
            }).then(adminReadJson);
            await refreshAdminDashboard();
        } catch (error) {
            setAdminFeedback(error instanceof Error ? error.message : String(error), "alert");
        }
    });
}

function initAdmin() {
    loadAdminSession();
    bindPasswordToggles();
    bindAdminEvents();
    setAdminView();
    if (adminState.authenticated) {
        startAdminPolling();
        refreshAdminDashboard().catch((error) => setAdminFeedback(error instanceof Error ? error.message : String(error), "alert"));
    }
}

initAdmin();
