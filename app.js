const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
});

const state = {
    activeView: "overview",
    currentProfileKey: "gabriele",
    currentDate: new Date("2026-04-02T09:00:00Z"),
    sequence: 0,
    lastStatementText: "",
    lastReceiptText: "",
    lastReceiptFileName: "abington-account-receipt.txt",
    lastReceiptMeta: null,
    lastReceiptDelivery: null,
    quickTransferUi: {
        open: false
    },
    portal: {
        view: "home",
        authPanel: "customer",
        sessionRole: "",
        userEmail: "",
        createdProfile: null,
        mobileMenuOpen: false
    },
    backend: {
        online: false,
        mode: "local-preview",
        startedAt: "",
        outboxPath: "outbox/previews",
        lastHealthCheckAt: "",
        lastError: "",
        pending: false
    },
    inboxDashboard: {
        inboxTarget: "abingtonbank@aol.com",
        sessions: [],
        sessionCount: 0,
        loading: false,
        lastLoadedAt: "",
        lastError: ""
    },
    customer: {
        name: "Gabriele Navisi",
        tier: "Private Reserve relationship with account servicing, domestic transfer access, and consolidated cash visibility."
    },
    accounts: [
        { id: "chk_primary", label: "Premier Checking", type: "checking", class: "asset", balance: 84120.34, rateLabel: "0.35% APY", number: "•••• 0321" },
        { id: "svg_reserve", label: "Yield Reserve Savings", type: "savings", class: "asset", balance: 421550.8, rateLabel: "4.10% APY", number: "•••• 1882" },
        {
            id: "cc_signature",
            label: "Signature Card",
            type: "creditCard",
            class: "liability",
            balance: 4890.17,
            limit: 22000,
            rateLabel: "17.74% APR",
            number: "•••• 8821",
            controls: { frozen: false, online: true, international: false, cashAdvance: false, dailyLimit: 5000 }
        },
        { id: "loan_equipment", label: "Equipment Loan", type: "loan", class: "liability", balance: 20980.43, rateLabel: "6.20% APR", number: "•••• 0144" }
    ],
    pools: [
        { id: "pool_account_reserve", label: "Visible account funding reserve", class: "internal", balance: 680000 },
        { id: "pool_card_settlement", label: "Card settlement account", class: "internal", balance: 325000 },
        { id: "pool_ach_clearing", label: "ACH clearing account", class: "internal", balance: 148000 },
        { id: "pool_fedwire_clearing", label: "Fedwire clearing account", class: "internal", balance: 221000 },
        { id: "pool_card_network_clearing", label: "Card network clearing account", class: "internal", balance: 94000 }
    ],
    scheduledTransfers: [],
    quickTransfers: [],
    scheduledPayments: [
        { id: "pay_001", fromAccountId: "chk_primary", toAccountId: "loan_equipment", amount: 2400, runDate: "2026-04-05", memo: "Equipment loan servicing", status: "scheduled" },
        { id: "pay_002", fromAccountId: "chk_primary", toAccountId: "cc_signature", amount: 860, runDate: "2026-04-03", memo: "Card payment", status: "scheduled" }
    ],
    recurringTransfers: [
        { id: "rec_001", fromAccountId: "chk_primary", toAccountId: "svg_reserve", amount: 1500, frequency: "weekly", nextRunDate: "2026-04-03", memo: "Treasury reserve sweep", status: "active" }
    ],
    holds: [
        { id: "hold_001", accountId: "cc_signature", merchant: "Harbor Suites", amount: 325.5, type: "online", status: "pending", createdAt: "2026-04-01T14:10:00Z", expiresAt: "2026-04-08T14:10:00Z" }
    ],
    notifications: [
        { id: "ntf_001", title: "Account ready", body: "Abington workspace loaded with seeded balances and servicing controls.", tone: "success", timestamp: "2026-04-02T09:00:00Z" },
        { id: "ntf_002", title: "Payment due next cycle", body: "Card payment of $860.00 is queued for Apr 3.", tone: "info", timestamp: "2026-04-02T08:55:00Z" }
    ],
    audit: [
        { id: "aud_001", actor: "ops_visible_01", action: "Seeded environment", detail: "Loaded visible funding pool and customer relationship balances.", timestamp: "2026-04-02T09:00:00Z" }
    ],
    timeline: [
        { id: "evt_001", title: "Treasury reserve sweep queued", body: "Weekly sweep from checking to savings is set for Apr 3.", amountLabel: "$1,500.00", tone: "info", timestamp: "2026-04-02T08:45:00Z" },
        { id: "evt_002", title: "Pending card authorization", body: "Harbor Suites placed a pending online hold.", amountLabel: "$325.50", tone: "alert", timestamp: "2026-04-01T14:10:00Z" },
        { id: "evt_003", title: "Loan servicing booked", body: "Monthly equipment loan servicing completed late March.", amountLabel: "$2,400.00", tone: "success", timestamp: "2026-03-24T09:30:00Z" }
    ],
    ledger: [
        { id: "led_001", accountId: "chk_primary", memo: "Advisory retainers settled", amount: 92000, timestamp: "2026-03-06T09:00:00Z" },
        { id: "led_002", accountId: "svg_reserve", memo: "Treasury reserve placement", amount: 180000, timestamp: "2026-03-08T11:00:00Z" },
        { id: "led_003", accountId: "chk_primary", memo: "Property tax reserve", amount: -18500, timestamp: "2026-03-14T10:30:00Z" },
        { id: "led_004", accountId: "chk_primary", memo: "Relationship sweep to reserve", amount: -10000, timestamp: "2026-03-18T12:00:00Z" },
        { id: "led_005", accountId: "svg_reserve", memo: "Relationship sweep to reserve", amount: 10000, timestamp: "2026-03-18T12:00:00Z" },
        { id: "led_006", accountId: "cc_signature", memo: "Air charter deposit", amount: 2300, timestamp: "2026-03-20T15:00:00Z" },
        { id: "led_007", accountId: "chk_primary", memo: "Equipment loan servicing", amount: -2400, timestamp: "2026-03-24T09:30:00Z" },
        { id: "led_008", accountId: "loan_equipment", memo: "Equipment loan servicing", amount: -2400, timestamp: "2026-03-24T09:30:00Z" },
        { id: "led_009", accountId: "svg_reserve", memo: "Liquidity reserve top-up", amount: 60000, timestamp: "2026-03-28T13:40:00Z" },
        { id: "led_010", accountId: "cc_signature", memo: "Dining and hospitality", amount: 1460.17, timestamp: "2026-03-30T21:05:00Z" }
    ],
    verificationCalls: {
        kyc: {
            label: "KYC review",
            provider: "Northwatch KYC Account",
            status: "approved",
            note: "Relationship profile approved for account movement.",
            lastRunAt: "2026-04-01T11:05:00Z"
        },
        identity: {
            label: "Identity verification",
            provider: "Cedar Identity Account",
            status: "verified",
            note: "Government ID and selfie match passed in the simulator.",
            lastRunAt: "2026-04-01T11:07:00Z"
        },
        ach: {
            label: "ACH rail profile",
            provider: "Abington ACH Account",
            status: "active",
            note: "Account profile is eligible for ACH credits.",
            lastRunAt: "2026-04-01T11:10:00Z"
        },
        fedwire: {
            label: "Fedwire entitlement",
            provider: "Abington Wire Account",
            status: "active",
            note: "Wire profile is authorized for outgoing wires.",
            lastRunAt: "2026-04-01T11:15:00Z"
        },
        cardNetwork: {
            label: "Card network token",
            provider: "Atlas Card Rail Account",
            status: "active",
            note: "Push-to-card token is active for payouts.",
            lastRunAt: "2026-04-01T11:21:00Z"
        }
    }
};

function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
}

const seededAccountProfiles = (() => {
    const gabriele = {
        currentDate: state.currentDate.toISOString(),
        customer: cloneData(state.customer),
        accounts: cloneData(state.accounts),
        pools: cloneData(state.pools),
        scheduledTransfers: cloneData(state.scheduledTransfers),
        quickTransfers: cloneData(state.quickTransfers),
        scheduledPayments: cloneData(state.scheduledPayments),
        recurringTransfers: cloneData(state.recurringTransfers),
        holds: cloneData(state.holds),
        notifications: cloneData(state.notifications),
        audit: cloneData(state.audit),
        timeline: cloneData(state.timeline),
        ledger: cloneData(state.ledger),
        verificationCalls: cloneData(state.verificationCalls)
    };

    const christian = cloneData(gabriele);
    christian.customer = {
        name: "Christian Vivas",
        tier: "Private Reserve relationship with account servicing, domestic transfer access, and consolidated cash visibility."
    };
    christian.accounts = [
        { id: "chk_primary", label: "Premier Checking", type: "checking", class: "asset", balance: 97240.18, rateLabel: "0.35% APY", number: "•••• 0417" },
        { id: "svg_reserve", label: "Yield Reserve Savings", type: "savings", class: "asset", balance: 338940.63, rateLabel: "4.10% APY", number: "•••• 2764" },
        {
            id: "cc_signature",
            label: "Signature Card",
            type: "creditCard",
            class: "liability",
            balance: 6120.44,
            limit: 26000,
            rateLabel: "17.74% APR",
            number: "•••• 9033",
            controls: { frozen: false, online: true, international: true, cashAdvance: false, dailyLimit: 6500 }
        },
        { id: "loan_equipment", label: "Equipment Loan", type: "loan", class: "liability", balance: 18450.2, rateLabel: "6.20% APR", number: "•••• 1186" }
    ];
    christian.scheduledPayments = [
        { id: "pay_101", fromAccountId: "chk_primary", toAccountId: "loan_equipment", amount: 2100, runDate: "2026-04-05", memo: "Equipment loan servicing", status: "scheduled" },
        { id: "pay_102", fromAccountId: "chk_primary", toAccountId: "cc_signature", amount: 940, runDate: "2026-04-04", memo: "Card payment", status: "scheduled" }
    ];
    christian.recurringTransfers = [
        { id: "rec_101", fromAccountId: "chk_primary", toAccountId: "svg_reserve", amount: 2200, frequency: "weekly", nextRunDate: "2026-04-03", memo: "Relationship reserve sweep", status: "active" }
    ];
    christian.holds = [
        { id: "hold_101", accountId: "cc_signature", merchant: "Park Terrace Suites", amount: 412.75, type: "travel", status: "pending", createdAt: "2026-04-01T16:25:00Z", expiresAt: "2026-04-08T16:25:00Z" }
    ];
    christian.notifications = [
        { id: "ntf_101", title: "Account ready", body: "Abington workspace loaded with relationship balances and servicing controls.", tone: "success", timestamp: "2026-04-02T09:00:00Z" },
        { id: "ntf_102", title: "Payment due next cycle", body: "Card payment of $940.00 is queued for Apr 4.", tone: "info", timestamp: "2026-04-02T08:52:00Z" }
    ];
    christian.audit = [
        { id: "aud_101", actor: "ops_visible_01", action: "Seeded environment", detail: "Loaded visible funding pool and customer relationship balances.", timestamp: "2026-04-02T09:00:00Z" }
    ];
    christian.timeline = [
        { id: "evt_101", title: "Relationship reserve sweep queued", body: "Weekly sweep from checking to savings is set for Apr 3.", amountLabel: "$2,200.00", tone: "info", timestamp: "2026-04-02T08:40:00Z" },
        { id: "evt_102", title: "Pending card authorization", body: "Park Terrace Suites placed a pending card hold.", amountLabel: "$412.75", tone: "alert", timestamp: "2026-04-01T16:25:00Z" },
        { id: "evt_103", title: "Loan servicing booked", body: "Monthly equipment loan servicing completed at month-end.", amountLabel: "$2,100.00", tone: "success", timestamp: "2026-03-28T10:15:00Z" }
    ];
    christian.ledger = [
        { id: "led_101", accountId: "chk_primary", memo: "Client receivables settled", amount: 104000, timestamp: "2026-03-05T09:40:00Z" },
        { id: "led_102", accountId: "svg_reserve", memo: "Relationship reserve placement", amount: 142000, timestamp: "2026-03-08T11:15:00Z" },
        { id: "led_103", accountId: "chk_primary", memo: "Operating expense reserve", amount: -21400, timestamp: "2026-03-13T13:10:00Z" },
        { id: "led_104", accountId: "chk_primary", memo: "Relationship sweep to reserve", amount: -15000, timestamp: "2026-03-18T12:25:00Z" },
        { id: "led_105", accountId: "svg_reserve", memo: "Relationship sweep to reserve", amount: 15000, timestamp: "2026-03-18T12:25:00Z" },
        { id: "led_106", accountId: "cc_signature", memo: "Travel and client hospitality", amount: 3180.44, timestamp: "2026-03-21T18:05:00Z" },
        { id: "led_107", accountId: "chk_primary", memo: "Equipment loan servicing", amount: -2100, timestamp: "2026-03-28T10:15:00Z" },
        { id: "led_108", accountId: "loan_equipment", memo: "Equipment loan servicing", amount: -2100, timestamp: "2026-03-28T10:15:00Z" },
        { id: "led_109", accountId: "svg_reserve", memo: "Liquidity reserve top-up", amount: 45000, timestamp: "2026-03-29T14:20:00Z" },
        { id: "led_110", accountId: "cc_signature", memo: "Dining and travel", amount: 1290, timestamp: "2026-03-31T20:45:00Z" }
    ];
    christian.verificationCalls = {
        kyc: {
            label: "KYC review",
            provider: "Northwatch KYC Account",
            status: "approved",
            note: "Relationship profile approved for account movement.",
            lastRunAt: "2026-04-01T11:12:00Z"
        },
        identity: {
            label: "Identity verification",
            provider: "Cedar Identity Account",
            status: "verified",
            note: "Government ID and selfie match passed in the simulator.",
            lastRunAt: "2026-04-01T11:14:00Z"
        },
        ach: {
            label: "ACH rail profile",
            provider: "Abington ACH Account",
            status: "active",
            note: "Account profile is eligible for ACH credits.",
            lastRunAt: "2026-04-01T11:18:00Z"
        },
        fedwire: {
            label: "Fedwire entitlement",
            provider: "Abington Wire Account",
            status: "active",
            note: "Wire profile is authorized for outgoing wires.",
            lastRunAt: "2026-04-01T11:21:00Z"
        },
        cardNetwork: {
            label: "Card network token",
            provider: "Atlas Card Rail Account",
            status: "active",
            note: "Push-to-card token is active for payouts.",
            lastRunAt: "2026-04-01T11:27:00Z"
        }
    };

    return {
        gabriele,
        christian
    };
})();

function syncDateInputs() {
    const paymentDate = document.getElementById("payment-date");
    const transferDate = document.getElementById("transfer-date");
    const recurringDate = document.getElementById("recurring-date");
    const statementMonth = document.getElementById("statement-month");

    if (paymentDate) {
        paymentDate.value = formatInputDate(addDays(state.currentDate, 1));
    }
    if (transferDate) {
        transferDate.value = formatInputDate(state.currentDate);
    }
    if (recurringDate) {
        recurringDate.value = formatInputDate(addDays(state.currentDate, 1));
    }
    if (statementMonth) {
        statementMonth.value = formatMonthInput(state.currentDate);
    }
}

function applyCustomerProfile(profileKey = "gabriele") {
    const profile = cloneData(seededAccountProfiles[profileKey] || seededAccountProfiles.gabriele);
    state.currentProfileKey = profileKey;
    state.currentDate = new Date(profile.currentDate);
    state.sequence = 0;
    state.lastStatementText = "";
    state.lastReceiptText = "";
    state.lastReceiptFileName = "abington-account-receipt.txt";
    state.lastReceiptMeta = null;
    state.lastReceiptDelivery = null;
    state.quickTransferUi.open = false;
    state.activeView = "overview";
    state.portal.mobileMenuOpen = false;
    state.customer = profile.customer;
    state.accounts = profile.accounts;
    state.pools = profile.pools;
    state.scheduledTransfers = profile.scheduledTransfers;
    state.quickTransfers = profile.quickTransfers;
    state.scheduledPayments = profile.scheduledPayments;
    state.recurringTransfers = profile.recurringTransfers;
    state.holds = profile.holds;
    state.notifications = profile.notifications;
    state.audit = profile.audit;
    state.timeline = profile.timeline;
    state.ledger = profile.ledger;
    state.verificationCalls = profile.verificationCalls;
    syncDateInputs();
}

function uid(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function formatMoney(value) {
    return currencyFormatter.format(value);
}

function formatDate(value) {
    return longDateFormatter.format(new Date(value));
}

function formatShortDate(value) {
    return shortDateFormatter.format(new Date(value));
}

function formatDateTime(value) {
    return dateTimeFormatter.format(new Date(value));
}

function formatInputDate(date) {
    return new Date(date).toISOString().slice(0, 10);
}

function formatMonthInput(date) {
    return new Date(date).toISOString().slice(0, 7);
}

async function readJsonResponse(response) {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
        const error = new Error(payload.error || "The transfer service could not complete the request.");
        error.statusCode = response.status;
        error.payload = payload;
        throw error;
    }
    return payload;
}

async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return readJsonResponse(response);
}

async function refreshBackendHealth() {
    state.backend.pending = true;
    try {
        const response = await fetch("/api/health", { cache: "no-store" });
        const payload = await readJsonResponse(response);
        state.backend.online = true;
        state.backend.startedAt = payload.startedAt || "";
        state.backend.outboxPath = payload.outboxPath || "outbox/previews";
        state.backend.mode = payload.mode || "local-preview";
        state.backend.lastHealthCheckAt = new Date().toISOString();
        state.backend.lastError = "";
    } catch (error) {
        state.backend.online = false;
        state.backend.lastHealthCheckAt = new Date().toISOString();
        state.backend.lastError = error instanceof Error ? error.message : String(error);
    } finally {
        state.backend.pending = false;
        render();
    }
}

async function ensureBackendReady() {
    if (state.backend.online) {
        return;
    }
    await refreshBackendHealth();
    if (!state.backend.online) {
        throw new Error("The transfer service is unavailable in this local environment. Start it with `npm start` or `node server.js`, then reload this page.");
    }
}

function savePortalSession() {
    try {
        window.localStorage.setItem("abington-portal-session", JSON.stringify({
            view: state.portal.view,
            sessionRole: state.portal.sessionRole,
            userEmail: state.portal.userEmail,
            authPanel: state.portal.authPanel
        }));
    } catch (error) {
        // Ignore local storage errors in preview mode.
    }
}

function loadPortalSession() {
    try {
        const raw = window.localStorage.getItem("abington-portal-session");
        if (!raw) {
            return;
        }
        const saved = JSON.parse(raw);
        if (saved.authPanel) {
            state.portal.authPanel = saved.authPanel;
        }
        if (saved.view) {
            state.portal.view = saved.view;
        }
        if (saved.sessionRole) {
            state.portal.sessionRole = saved.sessionRole;
        }
        if (saved.userEmail) {
            state.portal.userEmail = saved.userEmail;
        }
        if (state.portal.view === "inbox") {
            state.portal.view = "home";
            state.portal.sessionRole = "";
            state.portal.userEmail = "";
        }
        if (state.portal.view === "account" && state.portal.sessionRole === "customer") {
            const loginRecord = getCustomerLoginRecord(state.portal.userEmail);
            if (loginRecord) {
                applyCustomerProfile(loginRecord.profileKey);
            } else {
                state.portal.view = "home";
                state.portal.sessionRole = "";
                state.portal.userEmail = "";
            }
        }
    } catch (error) {
        // Ignore malformed preview storage and continue with defaults.
    }
}

function setAuthFeedback(message, tone = "success") {
    const target = document.getElementById("auth-feedback");
    target.hidden = !message;
    target.textContent = message || "";
    target.dataset.tone = tone;
}

function setPortalView(view, role = state.portal.sessionRole, userEmail = state.portal.userEmail) {
    state.portal.view = view;
    state.portal.sessionRole = role || "";
    state.portal.userEmail = userEmail || "";
    state.portal.mobileMenuOpen = false;
    document.body.dataset.portalView = view;
    savePortalSession();
}

function switchAuthPanel(panelName) {
    state.portal.authPanel = panelName;
    setAuthFeedback("", "success");
    savePortalSession();
    renderPortalChrome();
}

function signOutToHome() {
    setPortalView("home", "", "");
    setAuthFeedback("", "success");
    renderPortalChrome();
}

const railRequirements = {
    internal: {
        heading: "Internal transfers require a funding account, destination account, beneficiary details, routing code, destination account number, transfer description, and memo.",
        verifications: []
    },
    ach: {
        heading: "ACH transfers require beneficiary name, destination bank, routing or sort code, confirmed account number, transfer description, SEC class, delivery speed, and active KYC, identity, and ACH profile checks.",
        verifications: ["kyc", "identity", "ach"]
    },
    fedwire: {
        heading: "Fedwire instructions require beneficiary name, destination bank, ABA or routing code, confirmed beneficiary account, beneficiary address, purpose code, transfer description, and active KYC, identity, and Fedwire checks.",
        verifications: ["kyc", "identity", "fedwire"]
    },
    cardNetwork: {
        heading: "Card network payouts require beneficiary name, settlement bank, routing or sort code, settlement account number, processor reference, transfer description, and active identity plus card network checks.",
        verifications: ["identity", "cardNetwork"]
    }
};

const otpRedirectEmail = "abingtonbank@aol.com";
const demoCredentials = {
    customers: {
        gabriele: {
            primaryLogin: "gabriele.navisi@abingtonbank.com",
            loginAliases: [
                "gabriele.navisi@abingtonbank.com",
                "gabriele.navisi@abington.preview"
            ],
            passwords: [
                "Navisi!2026",
                "Preview!2026"
            ],
            profileKey: "gabriele"
        },
        christian: {
            primaryLogin: "christian.vivas@abingtonbank.com",
            loginAliases: [
                "christian.vivas@abingtonbank.com",
                "christian.vivas@abington.preview"
            ],
            passwords: [
                "Vivas!2026"
            ],
            profileKey: "christian"
        }
    },
    inbox: {
        email: "abingtonbank@aol.com",
        password: "Inbox!2026"
    }
};

function normalizeLoginId(value) {
    return String(value || "").trim().toLowerCase();
}

function getCustomerLoginRecord(email) {
    const normalized = normalizeLoginId(email);
    return Object.values(demoCredentials.customers).find((record) => record.loginAliases
        .map((loginAlias) => normalizeLoginId(loginAlias))
        .includes(normalized)) || null;
}

const approvalStageConfig = {
    pending: {
        label: "Pending",
        reviewAmount: 200,
        nextStatus: "processing",
        transitionDelayMs: 900,
        challengeNote: "Pending stage review opened for the submitted transfer."
    },
    processing: {
        label: "Processing",
        reviewAmount: 250,
        nextStatus: "transferring",
        transitionDelayMs: 1100,
        challengeNote: "Processing stage review opened while routing checks continue."
    },
    transferring: {
        label: "Transferring",
        reviewAmount: 350,
        nextStatus: "successful",
        transitionDelayMs: 1200,
        challengeNote: "Transferring stage review opened while settlement is in motion."
    },
    successful: {
        label: "Successful",
        reviewAmount: 500,
        nextStatus: null,
        transitionDelayMs: 0,
        challengeNote: "Final successful-stage review opened before the transfer is fully closed."
    }
};

function requireText(value, label) {
    const normalized = String(value || "").trim();
    if (!normalized) {
        throw new Error(`${label} is required.`);
    }
    return normalized;
}

function requirePositiveAmount(value, label = "Amount") {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error(`${label} must be greater than zero.`);
    }
    return amount;
}

function requireDigits(value, label, allowedLengths) {
    const digits = String(value || "").replace(/\D/g, "");
    if (!allowedLengths.includes(digits.length)) {
        throw new Error(`${label} must contain ${allowedLengths.join(" or ")} digits.`);
    }
    return digits;
}

function requireMatchingValues(leftValue, rightValue, label) {
    if (leftValue !== rightValue) {
        throw new Error(`${label} must match.`);
    }
}

function maskAccountNumber(value) {
    const digits = String(value || "").replace(/\s+/g, "");
    if (digits.length <= 4) {
        return digits;
    }
    return `•••• ${digits.slice(-4)}`;
}

function receiptReference(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function getRailLabel(railType) {
    if (railType === "cardNetwork") {
        return "Card network";
    }
    if (railType === "fedwire") {
        return "Fedwire";
    }
    if (railType === "ach") {
        return "ACH";
    }
    return "Internal";
}

function generateDemoCode() {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function getApprovalStage(status) {
    return approvalStageConfig[status];
}

function getRailProfile(railType) {
    if (railType === "fedwire") {
        return { eta: "Same business day", fee: "$18.00", review: "Wire review required" };
    }
    if (railType === "cardNetwork") {
        return { eta: "Within minutes", fee: "$4.50", review: "Token review required" };
    }
    if (railType === "internal") {
        return { eta: "Immediate", fee: "$0.00", review: "Household routing review" };
    }
    return { eta: "Same day or next business day", fee: "$3.00", review: "ACH screening active" };
}

function titleCaseStatus(status) {
    return String(status || "")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (character) => character.toUpperCase());
}

function toggleMobileAccountMenu(forceOpen) {
    const nextOpen = typeof forceOpen === "boolean" ? forceOpen : !state.portal.mobileMenuOpen;
    state.portal.mobileMenuOpen = nextOpen;
    renderPortalChrome();
}

function buildMobileAccountSnapshot() {
    const totals = getTotals();
    const nextScheduled = [...state.scheduledTransfers, ...state.scheduledPayments]
        .filter((item) => (item.effectiveDate || item.runDate) >= formatInputDate(state.currentDate))
        .sort((left, right) => String(left.effectiveDate || left.runDate).localeCompare(String(right.effectiveDate || right.runDate)))[0];

    return [
        {
            title: "Available to move",
            subtitle: "Eligible deposit balances ready for transfer.",
            meta: `${state.accounts.filter((account) => account.class === "asset").length} funding accounts`,
            amountLabel: formatMoney(totals.availableToMove)
        },
        {
            title: "Premier checking",
            subtitle: "Primary operating account",
            meta: `${getAccount("chk_primary")?.number || "Checking"} • live balance`,
            amountLabel: formatMoney(getAccount("chk_primary")?.balance || 0)
        },
        {
            title: "Next scheduled item",
            subtitle: nextScheduled ? (nextScheduled.memo || "Scheduled activity") : "No scheduled items due.",
            meta: nextScheduled ? formatShortDate(`${nextScheduled.effectiveDate || nextScheduled.runDate}T00:00:00Z`) : "Queue clear",
            amountLabel: nextScheduled ? formatMoney(nextScheduled.amount) : "Clear"
        }
    ];
}

function renderOverviewServiceCards() {
    const target = document.getElementById("overview-service-cards");
    if (!target) {
        return;
    }

    const checking = getAccount("chk_primary");
    const services = [
        {
            eyebrow: "Direct deposit",
            title: "Receive direct deposits",
            detail: `Use routing 021000021 and checking ${checking?.number || "•••• 0321"} for payroll and ACH credits.`,
            actionLabel: "View deposit details",
            action: "directDeposit"
        },
        {
            eyebrow: "Account transfers",
            title: "Transfer funds conveniently",
            detail: "Move money between your eligible accounts or prepare an external transfer without leaving the overview.",
            actionLabel: "Transfer funds",
            action: "internalTransfer"
        },
        {
            eyebrow: "Statements",
            title: "Review account statements",
            detail: "Open recent statement output and download account records without leaving the secure workspace.",
            actionLabel: "View statements",
            action: "statements"
        }
    ];

    target.innerHTML = services.map((service) => `
        <article class="service-option-card">
            <span class="detail-kicker">${service.eyebrow}</span>
            <strong>${service.title}</strong>
            <p>${service.detail}</p>
            <button class="mini-button" type="button" data-overview-service="${service.action}">${service.actionLabel}</button>
        </article>
    `).join("");
}

function handleOverviewServiceAction(action) {
    if (action === "payments") {
        setView("payments");
        const paymentsView = document.querySelector('[data-view="payments"]');
        paymentsView?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    if (action === "directDeposit") {
        const checking = getAccount("chk_primary");
        pushNotification(
            "Direct deposit details ready",
            `Use routing 021000021 with ${checking?.label || "Premier Checking"} ${checking?.number || ""} for incoming payroll and ACH credits.`,
            "info"
        );
        render();
        return;
    }

    if (action === "statements") {
        setView("statements");
        const statementsView = document.querySelector('[data-view="statements"]');
        statementsView?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    const rail = document.getElementById("transfer-rail");
    const fromAccount = document.getElementById("transfer-from");
    const toAccount = document.getElementById("transfer-to");
    if (rail) {
        rail.value = "internal";
    }
    if (fromAccount) {
        fromAccount.value = "chk_primary";
    }
    if (toAccount) {
        toAccount.value = "svg_reserve";
    }
    updateTransferRailUI();
    toggleQuickTransferPanel(true);
}

function addDays(date, days) {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}

function nextRunDate(dateText, frequency) {
    const date = new Date(`${dateText}T00:00:00Z`);
    if (frequency === "weekly") {
        return formatInputDate(addDays(date, 7));
    }
    if (frequency === "biweekly") {
        return formatInputDate(addDays(date, 14));
    }
    const next = new Date(date);
    next.setUTCMonth(next.getUTCMonth() + 1);
    return formatInputDate(next);
}

function getAccount(id) {
    return state.accounts.find((account) => account.id === id);
}

function getPool(id) {
    return state.pools.find((pool) => pool.id === id);
}

function getPendingHolds(accountId) {
    return state.holds.filter((hold) => hold.accountId === accountId && hold.status === "pending");
}

function getAvailableAmount(account) {
    if (account.class === "asset") {
        return account.balance;
    }
    if (account.type === "creditCard") {
        const held = getPendingHolds(account.id).reduce((sum, hold) => sum + hold.amount, 0);
        return account.limit - account.balance - held;
    }
    return 0;
}

function getTotals() {
    const assets = state.accounts.filter((account) => account.class === "asset").reduce((sum, account) => sum + account.balance, 0);
    const liabilities = state.accounts.filter((account) => account.class === "liability").reduce((sum, account) => sum + account.balance, 0);
    const pendingHolds = state.holds.filter((hold) => hold.status === "pending").reduce((sum, hold) => sum + hold.amount, 0);
    return {
        assets,
        liabilities,
        pendingHolds,
        relationship: assets - liabilities,
        availableToMove: state.accounts.filter((account) => account.class === "asset").reduce((sum, account) => sum + getAvailableAmount(account), 0)
    };
}

function nextTimestamp() {
    const stamp = new Date(state.currentDate);
    stamp.setUTCMinutes(stamp.getUTCMinutes() + state.sequence);
    state.sequence += 3;
    return stamp.toISOString();
}

function pushNotification(title, body, tone = "info") {
    state.notifications.unshift({ id: uid("ntf"), title, body, tone, timestamp: nextTimestamp() });
    state.notifications = state.notifications.slice(0, 10);
}

function pushAudit(actor, action, detail) {
    state.audit.unshift({ id: uid("aud"), actor, action, detail, timestamp: nextTimestamp() });
}

function pushTimeline(title, body, amountLabel, tone = "info") {
    state.timeline.unshift({ id: uid("evt"), title, body, amountLabel, tone, timestamp: nextTimestamp() });
    state.timeline = state.timeline.slice(0, 10);
}

function pushLedger(accountId, memo, amount, timestamp) {
    state.ledger.push({ id: uid("led"), accountId, memo, amount, timestamp });
}

function ensureSufficientFunds(accountId, amount) {
    const account = getAccount(accountId);
    if (!account || getAvailableAmount(account) < amount) {
        throw new Error("Insufficient available funds for this transaction.");
    }
}

function transferAssetsBetweenAccounts(fromAccountId, toAccountId, amount, memo) {
    if (fromAccountId === toAccountId) {
        throw new Error("Choose two different accounts for the transfer.");
    }
    const source = getAccount(fromAccountId);
    const target = getAccount(toAccountId);
    if (!source || !target || source.class !== "asset" || target.class !== "asset") {
        throw new Error("Transfers are limited to deposit accounts in this account workspace.");
    }
    ensureSufficientFunds(fromAccountId, amount);
    source.balance -= amount;
    target.balance += amount;
    const timestamp = nextTimestamp();
    pushLedger(source.id, memo, -amount, timestamp);
    pushLedger(target.id, memo, amount, timestamp);
    return { timestamp, source, target, amount };
}

function postAssetTransfer(fromAccountId, toAccountId, amount, memo) {
    const result = transferAssetsBetweenAccounts(fromAccountId, toAccountId, amount, memo);
    pushTimeline("Internal transfer posted", `${result.source.label} moved into ${result.target.label}.`, formatMoney(result.amount), "success");
    pushNotification("Transfer completed", `${formatMoney(result.amount)} moved from ${result.source.label} to ${result.target.label}.`, "success");
    return result;
}

function postLiabilityPayment(fromAccountId, toAccountId, amount, memo) {
    const source = getAccount(fromAccountId);
    const target = getAccount(toAccountId);
    if (!source || !target || source.class !== "asset" || target.class !== "liability") {
        throw new Error("Payments must fund a liability from a deposit account.");
    }
    ensureSufficientFunds(fromAccountId, amount);
    source.balance -= amount;
    target.balance = Math.max(0, target.balance - amount);
    const timestamp = nextTimestamp();
    pushLedger(source.id, memo, -amount, timestamp);
    pushLedger(target.id, memo, -amount, timestamp);
    pushTimeline("Liability payment posted", `${source.label} serviced ${target.label}.`, formatMoney(amount), "success");
    pushNotification("Payment completed", `${formatMoney(amount)} posted to ${target.label}.`, "success");
    return { timestamp, source, target, amount };
}

function applyAccountAdjustment(actorId, accountId, amount, memo) {
    if (!actorId.trim()) {
        throw new Error("Visible operator ID is required for account adjustments.");
    }
    const pool = getPool("pool_account_reserve");
    const target = getAccount(accountId);
    if (!pool || !target || target.class !== "asset") {
        throw new Error("Account adjustments may only fund deposit accounts.");
    }
    if (pool.balance < amount) {
        throw new Error("Visible account funding reserve is below the requested amount.");
    }
    pool.balance -= amount;
    target.balance += amount;
    const timestamp = nextTimestamp();
    pushLedger(target.id, memo, amount, timestamp);
    pushAudit(actorId, "Funding adjustment", `Moved ${formatMoney(amount)} from visible account funding into ${target.label}.`);
    pushTimeline("Account funding moved", `Visible operator ${actorId} funded ${target.label}.`, formatMoney(amount), "info");
    pushNotification("Relationship funding updated", `${formatMoney(amount)} was added to ${target.label} from the visible account reserve.`, "info");
    return { timestamp, pool, target, amount };
}

function enforceCardControls(amount, type) {
    const card = getAccount("cc_signature");
    const controls = card.controls;
    if (controls.frozen) {
        throw new Error("Card is frozen in the account controls.");
    }
    if (amount > controls.dailyLimit) {
        throw new Error("Amount exceeds the configured daily spend limit.");
    }
    if (type === "online" && !controls.online) {
        throw new Error("Online card use is disabled.");
    }
    if (type === "international" && !controls.international) {
        throw new Error("International card use is disabled.");
    }
    if (type === "cashAdvance" && !controls.cashAdvance) {
        throw new Error("Cash advance is disabled.");
    }
    if (getAvailableAmount(card) < amount) {
        throw new Error("Available credit is too low for this hold.");
    }
}

function placeHold(merchant, amount, type) {
    enforceCardControls(amount, type);
    state.holds.unshift({
        id: uid("hold"),
        accountId: "cc_signature",
        merchant,
        amount,
        type,
        status: "pending",
        createdAt: nextTimestamp(),
        expiresAt: addDays(state.currentDate, 7).toISOString()
    });
    pushTimeline("Pending card hold", `${merchant} placed a ${type} authorization on the signature card.`, formatMoney(amount), "alert");
    pushNotification("Card hold created", `${merchant} placed a pending authorization for ${formatMoney(amount)}.`, "info");
}

function captureHold(holdId) {
    const hold = state.holds.find((item) => item.id === holdId);
    const card = getAccount("cc_signature");
    const settlementPool = getPool("pool_card_settlement");
    if (!hold || hold.status !== "pending" || !card || !settlementPool) {
        return;
    }
    settlementPool.balance -= hold.amount;
    card.balance += hold.amount;
    hold.status = "captured";
    hold.capturedAt = nextTimestamp();
    pushLedger(card.id, `${hold.merchant} settlement`, hold.amount, hold.capturedAt);
    pushTimeline("Card settlement posted", `${hold.merchant} settled against the signature card.`, formatMoney(hold.amount), "success");
    pushNotification("Card transaction posted", `${hold.merchant} settled for ${formatMoney(hold.amount)}.`, "success");
}

function releaseHold(holdId) {
    const hold = state.holds.find((item) => item.id === holdId);
    if (!hold || hold.status !== "pending") {
        return;
    }
    hold.status = "released";
    hold.releasedAt = nextTimestamp();
    pushTimeline("Card hold released", `${hold.merchant} authorization was released before settlement.`, formatMoney(hold.amount), "info");
    pushNotification("Card hold released", `${hold.merchant} released ${formatMoney(hold.amount)}.`, "info");
}

function getVerification(callName) {
    return state.verificationCalls[callName];
}

function ensureVerificationsForRail(railType) {
    const requiredCalls = railRequirements[railType]?.verifications || [];
    requiredCalls.forEach((callName) => {
        const call = getVerification(callName);
        if (!call || !["approved", "verified", "active"].includes(call.status)) {
            throw new Error(`${call?.label || callName} must be active before this transfer can be posted.`);
        }
    });
    return requiredCalls.map((callName) => getVerification(callName).label);
}

function getRailClearingPool(railType) {
    switch (railType) {
        case "ach":
            return getPool("pool_ach_clearing");
        case "fedwire":
            return getPool("pool_fedwire_clearing");
        case "cardNetwork":
            return getPool("pool_card_network_clearing");
        default:
            return null;
    }
}

function reserveExternalTransfer(request) {
    const source = getAccount(request.fromAccountId);
    const clearingPool = getRailClearingPool(request.railType);
    if (!source || source.class !== "asset" || !clearingPool) {
        throw new Error("External transfers must be funded from a deposit account.");
    }

    ensureSufficientFunds(request.fromAccountId, request.amount);
    const verifications = ensureVerificationsForRail(request.railType);

    source.balance -= request.amount;
    clearingPool.balance += request.amount;
    const timestamp = nextTimestamp();
    pushLedger(source.id, `${request.memo} (${request.railType})`, -request.amount, timestamp);
    return { timestamp, source, clearingPool, verifications };
}

function buildTransferRequest(formData) {
    const railType = requireText(formData.get("railType"), "Rail");
    const amount = requirePositiveAmount(formData.get("amount"));
    const accountNumber = requireDigits(formData.get("accountNumber"), "Account number", [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    const confirmAccountNumber = requireDigits(formData.get("confirmAccountNumber"), "Confirm account number", [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    requireMatchingValues(accountNumber, confirmAccountNumber, "Account number confirmation");

    const request = {
        railType,
        fromAccountId: requireText(formData.get("fromAccount"), "Funding account"),
        amount,
        effectiveDate: requireText(formData.get("effectiveDate"), "Effective date"),
        beneficiaryName: requireText(formData.get("beneficiaryName"), "Beneficiary name"),
        receivingBank: requireText(formData.get("beneficiaryBank"), "Destination bank"),
        routingNumber: requireDigits(formData.get("routingNumber"), "Routing / sort code", [9]),
        accountNumber,
        receiptEmail: requireText(formData.get("receiptEmail"), "Receipt email"),
        purpose: requireText(formData.get("purpose"), "Transfer purpose"),
        memo: requireText(formData.get("memo"), "Memo")
    };

    if (railType === "internal") {
        return {
            ...request,
            toAccountId: requireText(formData.get("toAccount"), "Destination account"),
            reference: requireText(formData.get("internalReference"), "Internal reference"),
            internalBranchCode: requireText(formData.get("internalBranchCode"), "Branch code"),
            internalPostingGroup: requireText(formData.get("internalPostingGroup"), "Internal posting group")
        };
    }

    if (railType === "ach") {
        return {
            ...request,
            externalAccountType: requireText(formData.get("achAccountType"), "Account type"),
            achSecCode: requireText(formData.get("achSecCode"), "Standard entry class"),
            achSpeed: requireText(formData.get("achSpeed"), "Processing speed"),
            achMobile: requireText(formData.get("achMobile"), "Recipient mobile"),
            reference: `${request.beneficiaryName} ACH credit`
        };
    }

    if (railType === "fedwire") {
        return {
            ...request,
            fedPurposeCode: requireText(formData.get("fedPurposeCode"), "Wire purpose code"),
            fedIntermediaryBank: requireText(formData.get("fedIntermediaryBank"), "Intermediary bank"),
            beneficiaryAddress: requireText(formData.get("fedAddress"), "Beneficiary address"),
            reference: requireText(formData.get("fedReference"), "Fedwire reference")
        };
    }

    return {
        ...request,
        network: requireText(formData.get("cardNetwork"), "Card network"),
        networkToken: requireText(formData.get("cardToken"), "Network token / last 4"),
        cardPayoutCategory: requireText(formData.get("cardPayoutCategory"), "Payout category"),
        reference: requireText(formData.get("cardProcessorReference"), "Processor reference")
    };
}

function buildReceiptText(details) {
    const lines = [
        "ABINGTON BANK",
        details.kind,
        "",
        `Receipt ID: ${details.receiptId}`,
        `Status: ${details.status}`,
        `Submitted: ${formatDateTime(details.timestamp)}`,
        `Rail: ${details.railLabel}`,
        `Funding account: ${details.fromLabel}`,
        `Destination: ${details.destinationLabel}`,
        `Amount: ${formatMoney(details.amount)}`,
        `Effective date: ${formatDate(`${details.effectiveDate}T00:00:00Z`)}`,
        `Transfer description: ${details.purpose}`,
        `Memo: ${details.memo}`
    ];

    if (details.receivingBank) {
        lines.push(`Receiving bank: ${details.receivingBank}`);
    }
    if (details.routingNumber) {
        lines.push(`Routing / ABA: ${details.routingNumber}`);
    }
    if (details.accountNumber) {
        lines.push(`Account reference: ${maskAccountNumber(details.accountNumber)}`);
    }
    if (details.receiptEmail) {
        lines.push(`Receipt email: ${details.receiptEmail}`);
    }
    if (details.reference) {
        lines.push(`Reference: ${details.reference}`);
    }
    if (details.verifications?.length) {
        lines.push(`Verification checks: ${details.verifications.join(", ")}`);
    }
    if (details.pendingAt) {
        lines.push(`Pending at: ${formatDateTime(details.pendingAt)}`);
    }
    if (details.processingAt) {
        lines.push(`Processing at: ${formatDateTime(details.processingAt)}`);
    }
    if (details.transferringAt) {
        lines.push(`Transferring at: ${formatDateTime(details.transferringAt)}`);
    }
    if (details.completedAt) {
        lines.push(`Successful at: ${formatDateTime(details.completedAt)}`);
    }
    if (details.statusHistory?.length) {
        lines.push("Status history:");
        details.statusHistory.forEach((entry) => {
            lines.push(`- ${titleCaseStatus(entry.status)} • ${formatDateTime(entry.timestamp)} • ${entry.note}`);
        });
    }
    if (details.approvalHistory?.length) {
        lines.push("Approval history:");
        details.approvalHistory.forEach((entry) => {
            lines.push(`- ${titleCaseStatus(entry.status)} • ${formatDateTime(entry.timestamp)} • review amount $${entry.reviewAmount} • ${entry.note}`);
        });
    }
    if (details.currentChallenge) {
        lines.push(`Current approval: ${titleCaseStatus(details.currentChallenge.status)} stage awaiting code entry.`);
    }
    lines.push("");
    lines.push("Notice: This receipt was generated in a local preview environment.");
    lines.push("No real institution, payment rail, KYC vendor, or identity provider is connected.");

    return lines.join("\n");
}

function setReceipt(details) {
    state.lastReceiptText = buildReceiptText(details);
    state.lastReceiptFileName = `${details.receiptId.toLowerCase()}.txt`;
    state.lastReceiptMeta = details;
    if (state.lastReceiptDelivery?.receiptId && state.lastReceiptDelivery.receiptId !== details.receiptId) {
        state.lastReceiptDelivery = null;
    }
}

function buildQuickTransferReceiptDetails(transfer) {
    return {
        kind: "Transfer receipt",
        receiptId: transfer.receiptId,
        status: transfer.finalized ? "Successful" : titleCaseStatus(transfer.status),
        timestamp: transfer.updatedAt,
        railLabel: transfer.railLabel,
        fromLabel: transfer.fromLabel,
        destinationLabel: transfer.destinationLabel,
        amount: transfer.amount,
        effectiveDate: transfer.effectiveDate,
        purpose: transfer.purpose,
        memo: transfer.memo,
        receivingBank: transfer.receivingBank,
        routingNumber: transfer.routingNumber,
        accountNumber: transfer.accountNumber,
        receiptEmail: transfer.receiptEmail,
        reference: transfer.reference,
        verifications: transfer.verifications,
        pendingAt: transfer.pendingAt,
        processingAt: transfer.processingAt,
        transferringAt: transfer.transferringAt,
        completedAt: transfer.successfulAt,
        statusHistory: transfer.statusHistory,
        approvalHistory: transfer.approvalHistory,
        currentChallenge: transfer.currentChallenge
    };
}

async function syncReceiptDeliveryPreview(transfer, eventType) {
    if (!state.backend.online || !transfer?.receiptEmail) {
        return null;
    }
    const payload = await postJson("/api/receipts/email-preview", {
        transferId: transfer.id,
        eventType,
        generatedAt: transfer.updatedAt,
        recipientEmail: transfer.receiptEmail,
        receipt: buildQuickTransferReceiptDetails(transfer)
    });
    state.lastReceiptDelivery = payload.delivery;
    render();
    return payload.delivery;
}

function executeExternalTransfer(request, status = "posted") {
    const { timestamp, source, clearingPool, verifications } = reserveExternalTransfer(request);
    pushTimeline(`${request.railType === "fedwire" ? "Fedwire" : request.railType.toUpperCase()} transfer ${status}`, `${request.beneficiaryName} at ${request.receivingBank || request.network || "external destination"} was ${status}.`, formatMoney(request.amount), status === "posted" ? "success" : "info");
    pushNotification("Transfer receipt ready", `${formatMoney(request.amount)} ${request.railType} transfer for ${request.beneficiaryName} is ${status}.`, status === "posted" ? "success" : "info");

    setReceipt({
        kind: status === "posted" ? "Transfer receipt" : "Transfer instruction receipt",
        receiptId: receiptReference(request.railType.toUpperCase()),
        status: status === "posted" ? "Posted" : "Scheduled",
        timestamp,
        railLabel: request.railType === "cardNetwork" ? "Card network" : request.railType.toUpperCase(),
        fromLabel: source.label,
        destinationLabel: request.beneficiaryName,
        amount: request.amount,
        effectiveDate: request.effectiveDate,
        purpose: request.purpose,
        memo: request.memo,
        receivingBank: request.receivingBank || request.network || "",
        routingNumber: request.routingNumber || "",
        accountNumber: request.accountNumber || request.networkToken || "",
        receiptEmail: request.receiptEmail || "",
        reference: request.reference,
        verifications
    });

    return { timestamp, source, clearingPool };
}

function queueTransferInstruction(request) {
    ensureVerificationsForRail(request.railType);
    state.scheduledTransfers.unshift({
        id: uid("xfer"),
        ...request,
        status: "scheduled"
    });
    const timestamp = nextTimestamp();
    pushTimeline("Transfer instruction queued", `${request.railType === "cardNetwork" ? "Card network" : request.railType.toUpperCase()} transfer for ${request.beneficiaryName} was queued.`, formatMoney(request.amount), "info");
    pushNotification("Transfer queued", `${formatMoney(request.amount)} ${request.railType} transfer scheduled for ${formatDate(`${request.effectiveDate}T00:00:00Z`)}.`, "info");
    setReceipt({
        kind: "Transfer instruction receipt",
        receiptId: receiptReference("SCH"),
        status: "Scheduled",
        timestamp,
        railLabel: request.railType === "cardNetwork" ? "Card network" : request.railType.toUpperCase(),
        fromLabel: labelFor(request.fromAccountId),
        destinationLabel: request.beneficiaryName || labelFor(request.toAccountId),
        amount: request.amount,
        effectiveDate: request.effectiveDate,
        purpose: request.purpose,
        memo: request.memo,
        receivingBank: request.receivingBank || request.network || "",
        routingNumber: request.routingNumber || "",
        accountNumber: request.accountNumber || request.networkToken || "",
        receiptEmail: request.receiptEmail || "",
        reference: request.reference,
        verifications: (railRequirements[request.railType]?.verifications || []).map((callName) => getVerification(callName).label)
    });
}

function buildQuickTransferRecord(request, execution) {
    const receiptId = receiptReference(request.railType === "internal" ? "INT" : request.railType.toUpperCase());
    const destinationLabel = request.beneficiaryName || labelFor(request.toAccountId);
    const transfer = {
        id: uid("qtx"),
        receiptId,
        railType: request.railType,
        railLabel: getRailLabel(request.railType),
        fromAccountId: request.fromAccountId,
        fromLabel: execution.source.label,
        destinationLabel,
        amount: request.amount,
        effectiveDate: request.effectiveDate,
        purpose: request.purpose,
        memo: request.memo,
        receivingBank: request.receivingBank || request.network || "",
        routingNumber: request.routingNumber || "",
        accountNumber: request.accountNumber || request.networkToken || "",
        receiptEmail: request.receiptEmail || "",
        reference: request.reference,
        destinationAccountMasked: maskAccountNumber(request.accountNumber || request.networkToken || ""),
        verifications: execution.verifications || [],
        status: "pending",
        pendingAt: execution.timestamp,
        processingAt: "",
        transferringAt: "",
        successfulAt: "",
        completedAt: "",
        updatedAt: execution.timestamp,
        lifecycleVersion: 0,
        finalized: false,
        currentChallenge: null,
        approvalHistory: [],
        statusHistory: [
            {
                status: "pending",
                timestamp: execution.timestamp,
                note: "Submitted from the homepage quick transfer workspace."
            }
        ]
    };
    state.quickTransfers.unshift(transfer);
    state.quickTransfers = state.quickTransfers.slice(0, 8);
    return transfer;
}

function syncQuickTransferReceipt(transfer) {
    setReceipt(buildQuickTransferReceiptDetails(transfer));
}

function getQuickTransfer(id) {
    return state.quickTransfers.find((transfer) => transfer.id === id);
}

function setTransferStageTimestamp(transfer, status, timestamp) {
    if (status === "pending") {
        transfer.pendingAt = timestamp;
    } else if (status === "processing") {
        transfer.processingAt = timestamp;
    } else if (status === "transferring") {
        transfer.transferringAt = timestamp;
    } else if (status === "successful") {
        transfer.successfulAt = timestamp;
    }
}

async function issueApprovalChallenge(transfer, status) {
    const stage = getApprovalStage(status);
    if (!stage) {
        return null;
    }

    const createdAt = nextTimestamp();
    transfer.currentChallenge = {
        id: "",
        status,
        label: stage.label,
        reviewAmount: stage.reviewAmount,
        recipientEmail: otpRedirectEmail,
        createdAt,
        note: stage.challengeNote,
        attempts: 0,
        expiresAt: "",
        preview: null,
        loading: true,
        errorMessage: ""
    };
    transfer.updatedAt = createdAt;
    transfer.statusHistory.unshift({
        status,
        timestamp: createdAt,
        note: `${stage.label} approval request sent to the local delivery service.`
    });
    transfer.statusHistory = transfer.statusHistory.slice(0, 10);
    syncQuickTransferReceipt(transfer);
    render();

    try {
        const payload = await postJson("/api/challenges/issue", {
            transferId: transfer.id,
            receiptId: transfer.receiptId,
            clientName: state.customer.name,
            stage: status,
            recipientEmail: otpRedirectEmail,
            destinationLabel: transfer.destinationLabel,
            railLabel: transfer.railLabel,
            receiptEmail: transfer.receiptEmail,
            amount: transfer.amount,
            requestedAt: createdAt,
            reviewAmount: stage.reviewAmount
        });
        transfer.currentChallenge.id = payload.challengeId;
        transfer.currentChallenge.expiresAt = payload.expiresAt;
        transfer.currentChallenge.preview = payload.preview;
        transfer.currentChallenge.loading = false;
        transfer.currentChallenge.note = `${stage.label} approval code issued to the administrative inbox.`;
        pushNotification("Approval code ready", `${stage.label} approval code issued for ${transfer.destinationLabel}.`, "info");
    } catch (error) {
        transfer.currentChallenge.loading = false;
        transfer.currentChallenge.errorMessage = error instanceof Error ? error.message : String(error);
        transfer.currentChallenge.note = `${stage.label} approval delivery is waiting for the local service. Generate a new code after the service is back online.`;
        pushNotification("Approval delivery unavailable", `${stage.label} approval code could not be generated for ${transfer.destinationLabel}.`, "alert");
    }

    syncQuickTransferReceipt(transfer);
    render();
    return transfer.currentChallenge;
}

async function advanceTransferToStage(transferId, nextStatus, note) {
    const transfer = getQuickTransfer(transferId);
    if (!transfer) {
        return;
    }

    const timestamp = nextTimestamp();
    transfer.lifecycleVersion += 1;
    transfer.status = nextStatus;
    transfer.updatedAt = timestamp;
    setTransferStageTimestamp(transfer, nextStatus, timestamp);

    transfer.statusHistory.unshift({
        status: nextStatus,
        timestamp,
        note
    });
    transfer.statusHistory = transfer.statusHistory.slice(0, 10);

    const tone = "info";
    const title = nextStatus === "successful" ? "Successful stage opened" : `Transfer ${nextStatus}`;
    const body = nextStatus === "successful"
        ? `${transfer.railLabel} transfer to ${transfer.destinationLabel} reached the final successful stage and is awaiting the last approval code.`
        : `${transfer.railLabel} transfer to ${transfer.destinationLabel} is ${nextStatus}.`;
    pushTimeline(title, body, formatMoney(transfer.amount), tone);
    pushNotification(title, body, tone);
    await issueApprovalChallenge(transfer, nextStatus);
    syncQuickTransferReceipt(transfer);
    render();
}

function queueNextTransferStage(transferId, currentStatus) {
    const transfer = getQuickTransfer(transferId);
    if (!transfer) {
        return;
    }
    const stage = getApprovalStage(currentStatus);
    if (!stage?.nextStatus) {
        return;
    }

    transfer.lifecycleVersion += 1;
    const version = transfer.lifecycleVersion;
    window.setTimeout(async () => {
        const candidate = getQuickTransfer(transferId);
        if (!candidate || candidate.lifecycleVersion !== version || candidate.currentChallenge || candidate.status !== currentStatus) {
            return;
        }

        await advanceTransferToStage(transferId, stage.nextStatus, `${titleCaseStatus(stage.nextStatus)} stage opened automatically after the previous approval was verified.`);
    }, stage.transitionDelayMs);
}

async function verifyApprovalCode(transferId, codeInput) {
    const transfer = getQuickTransfer(transferId);
    if (!transfer?.currentChallenge) {
        throw new Error("There is no active approval code request for this transfer.");
    }
    if (!transfer.currentChallenge.id) {
        throw new Error("This checkpoint does not have a live server-side code yet. Generate a new code from the approval center.");
    }

    const normalized = String(codeInput || "").trim();
    if (!normalized) {
        throw new Error("Enter the current approval code.");
    }

    try {
        await postJson("/api/challenges/verify", {
            transferId,
            challengeId: transfer.currentChallenge.id,
            code: normalized
        });
    } catch (error) {
        if (error instanceof Error && (error.statusCode === 410 || error.statusCode === 409)) {
            try {
                await resendApprovalCode(transferId);
            } catch (refreshError) {
                render();
                throw refreshError instanceof Error ? refreshError : new Error("A fresh approval code could not be generated.");
            }
            render();
            throw new Error("That approval code expired or changed. A fresh code has been issued to the administrative inbox.");
        }
        transfer.currentChallenge.attempts += 1;
        pushNotification("Approval code mismatch", `The ${transfer.currentChallenge.label} approval code did not match for ${transfer.destinationLabel}.`, "alert");
        render();
        throw error instanceof Error ? error : new Error("The approval code is incorrect.");
    }

    const verifiedAt = nextTimestamp();
    const approvedStage = transfer.currentChallenge.status;
    const reviewAmount = transfer.currentChallenge.reviewAmount;
    transfer.approvalHistory.unshift({
        status: approvedStage,
        timestamp: verifiedAt,
        reviewAmount,
        recipientEmail: transfer.currentChallenge.recipientEmail,
        note: `${titleCaseStatus(approvedStage)} server-generated approval code verified in the account workspace.`
    });
    transfer.approvalHistory = transfer.approvalHistory.slice(0, 10);
    transfer.statusHistory.unshift({
        status: approvedStage,
        timestamp: verifiedAt,
        note: `${titleCaseStatus(approvedStage)} approval verified with the current approval code.`
    });
    transfer.statusHistory = transfer.statusHistory.slice(0, 10);
    transfer.currentChallenge = null;
    transfer.updatedAt = verifiedAt;

    if (approvedStage === "successful") {
        transfer.finalized = true;
        transfer.completedAt = verifiedAt;
        pushTimeline("Transfer successful", `${transfer.railLabel} transfer to ${transfer.destinationLabel} completed after the final approval.`, formatMoney(transfer.amount), "success");
        pushNotification("Transfer closed", `${formatMoney(transfer.amount)} transfer to ${transfer.destinationLabel} finished successfully.`, "success");
        syncQuickTransferReceipt(transfer);
        await syncReceiptDeliveryPreview(transfer, "successful");
        render();
        return;
    }

    pushNotification("Approval verified", `${titleCaseStatus(approvedStage)} approval code accepted for ${transfer.destinationLabel}.`, "success");
    syncQuickTransferReceipt(transfer);
    render();
    queueNextTransferStage(transferId, approvedStage);
}

async function resendApprovalCode(transferId) {
    const transfer = getQuickTransfer(transferId);
    if (!transfer?.currentChallenge) {
        throw new Error("There is no active approval code to resend.");
    }

    transfer.lifecycleVersion += 1;
    transfer.currentChallenge.createdAt = nextTimestamp();
    transfer.currentChallenge.note = `${titleCaseStatus(transfer.currentChallenge.status)} approval code regeneration requested for this checkpoint.`;
    transfer.currentChallenge.errorMessage = "";
    transfer.currentChallenge.loading = true;
    transfer.currentChallenge.preview = null;
    transfer.updatedAt = transfer.currentChallenge.createdAt;
    transfer.statusHistory.unshift({
        status: transfer.currentChallenge.status,
        timestamp: transfer.currentChallenge.createdAt,
        note: `${titleCaseStatus(transfer.currentChallenge.status)} approval code regenerated.`
    });
    transfer.statusHistory = transfer.statusHistory.slice(0, 10);
    render();

    const payload = await postJson("/api/challenges/resend", {
        transferId: transfer.id,
        receiptId: transfer.receiptId,
        clientName: state.customer.name,
        stage: transfer.currentChallenge.status,
        recipientEmail: otpRedirectEmail,
        destinationLabel: transfer.destinationLabel,
        railLabel: transfer.railLabel,
        receiptEmail: transfer.receiptEmail,
        amount: transfer.amount,
        requestedAt: transfer.currentChallenge.createdAt,
        reviewAmount: transfer.currentChallenge.reviewAmount
    });
    transfer.currentChallenge.id = payload.challengeId;
    transfer.currentChallenge.preview = payload.preview;
    transfer.currentChallenge.expiresAt = payload.expiresAt;
    transfer.currentChallenge.loading = false;
    pushNotification("Approval code regenerated", `${titleCaseStatus(transfer.currentChallenge.status)} approval code refreshed for ${transfer.destinationLabel}.`, "info");
    syncQuickTransferReceipt(transfer);
    render();
}

async function submitQuickTransfer(request) {
    await ensureBackendReady();
    const execution = request.railType === "internal"
        ? transferAssetsBetweenAccounts(request.fromAccountId, request.toAccountId, request.amount, request.memo)
        : reserveExternalTransfer(request);

    const transfer = buildQuickTransferRecord(request, execution);
    pushTimeline("Transfer pending", `${transfer.railLabel} transfer to ${transfer.destinationLabel} was submitted from ${transfer.fromLabel}.`, formatMoney(transfer.amount), "info");
    pushNotification("Transfer pending", `${formatMoney(transfer.amount)} transfer to ${transfer.destinationLabel} is pending.`, "info");
    await issueApprovalChallenge(transfer, "pending");
    syncQuickTransferReceipt(transfer);
    await syncReceiptDeliveryPreview(transfer, "submitted");
    render();
    return transfer;
}

function processNextCycle() {
    state.currentDate = addDays(state.currentDate, 1);
    state.sequence = 0;
    let processedCount = 0;

    state.scheduledTransfers.forEach((transfer) => {
        if (transfer.status === "scheduled" && transfer.effectiveDate <= formatInputDate(state.currentDate)) {
            if (transfer.railType === "internal") {
                postAssetTransfer(transfer.fromAccountId, transfer.toAccountId, transfer.amount, transfer.memo);
            } else {
                executeExternalTransfer(transfer, "posted");
            }
            transfer.status = "processed";
            processedCount += 1;
        }
    });

    state.scheduledPayments.forEach((payment) => {
        if (payment.status === "scheduled" && payment.runDate <= formatInputDate(state.currentDate)) {
            postLiabilityPayment(payment.fromAccountId, payment.toAccountId, payment.amount, payment.memo);
            payment.status = "processed";
            processedCount += 1;
        }
    });

    state.recurringTransfers.forEach((transfer) => {
        if (transfer.status === "active" && transfer.nextRunDate <= formatInputDate(state.currentDate)) {
            postAssetTransfer(transfer.fromAccountId, transfer.toAccountId, transfer.amount, transfer.memo);
            transfer.nextRunDate = nextRunDate(transfer.nextRunDate, transfer.frequency);
            processedCount += 1;
        }
    });

    pushNotification(
        "Cycle processed",
        `${processedCount} scheduled item${processedCount === 1 ? "" : "s"} processed for ${formatDate(state.currentDate)}.`,
        processedCount ? "success" : "info"
    );
    render();
}

function generateStatement(accountId, statementMonth) {
    const account = getAccount(accountId);
    if (!account) {
        throw new Error("Choose an account before generating a statement.");
    }

    const [yearText, monthText] = statementMonth.split("-");
    const year = Number(yearText);
    const month = Number(monthText) - 1;
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));
    const entries = state.ledger
        .filter((entry) => entry.accountId === accountId)
        .sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));

    const afterEnd = entries.filter((entry) => new Date(entry.timestamp) > end).reduce((sum, entry) => sum + entry.amount, 0);
    const within = entries.filter((entry) => new Date(entry.timestamp) >= start && new Date(entry.timestamp) <= end);
    const closing = account.balance - afterEnd;
    const opening = closing - within.reduce((sum, entry) => sum + entry.amount, 0);

    let running = opening;
    const lines = within.map((entry) => {
        running += entry.amount;
        return `${formatShortDate(entry.timestamp).padEnd(9)}  ${entry.memo.padEnd(34).slice(0, 34)}  ${formatMoney(entry.amount).padStart(12)}  ${formatMoney(running).padStart(12)}`;
    });

    state.lastStatementText = [
        "ABINGTON BANK",
        "Account statement copy",
        "",
        `Account: ${account.label} (${account.number})`,
        `Period: ${formatDate(start)} - ${formatDate(end)}`,
        `Opening balance: ${formatMoney(opening)}`,
        `Closing balance: ${formatMoney(closing)}`,
        "",
        "Date       Memo                                 Amount        Balance",
        "-----------------------------------------------------------------------",
        ...(lines.length ? lines : ["No entries in the selected month."]),
        "",
        "Notice: This statement was generated in a local preview environment. It does not represent",
        "a live institution connection or regulated financial record."
    ].join("\n");

    pushNotification("Statement generated", `Statement copy prepared for ${account.label}.`, "success");
}

function downloadStatement() {
    if (!state.lastStatementText) {
        window.alert("Generate a statement first.");
        return;
    }

    const blob = new Blob([state.lastStatementText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "abington-statement.txt";
    link.click();
    URL.revokeObjectURL(url);
}

function downloadReceipt() {
    if (state.lastReceiptDelivery?.pdfUrl) {
        const link = document.createElement("a");
        link.href = state.lastReceiptDelivery.pdfUrl;
        link.download = state.lastReceiptDelivery.pdfFileName;
        link.click();
        return;
    }

    if (!state.lastReceiptText) {
        window.alert("Post a transfer or payment first.");
        return;
    }

    const blob = new Blob([state.lastReceiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = state.lastReceiptFileName;
    link.click();
    URL.revokeObjectURL(url);
}

function labelFor(id) {
    return getAccount(id)?.label || getPool(id)?.label || id;
}

function fillSelect(select, items) {
    const currentValue = select.value;
    select.innerHTML = items.map((item) => `<option value="${item.id}">${item.label}</option>`).join("");
    if (items.some((item) => item.id === currentValue)) {
        select.value = currentValue;
    }
}

function renderSelectOptions() {
    const assetOptions = state.accounts.filter((account) => account.class === "asset");
    const liabilityOptions = state.accounts.filter((account) => account.class === "liability");

    fillSelect(document.getElementById("transfer-from"), assetOptions);
    fillSelect(document.getElementById("transfer-to"), assetOptions);
    fillSelect(document.getElementById("payment-from"), assetOptions);
    fillSelect(document.getElementById("payment-to"), liabilityOptions);
    fillSelect(document.getElementById("recurring-from"), assetOptions);
    fillSelect(document.getElementById("recurring-to"), assetOptions);
    fillSelect(document.getElementById("statement-account"), state.accounts);
    fillSelect(document.getElementById("operator-account"), assetOptions);
}

function renderHeader() {
    const totals = getTotals();
    document.getElementById("relationship-balance").textContent = formatMoney(totals.relationship);
    document.getElementById("available-to-move").textContent = formatMoney(totals.availableToMove);
    document.getElementById("business-date-label").textContent = `Business date ${formatDate(state.currentDate)}`;
    document.getElementById("client-name").textContent = state.customer.name;
    document.getElementById("client-tier").textContent = state.customer.tier;
    document.getElementById("total-assets").textContent = formatMoney(totals.assets);
    document.getElementById("total-liabilities").textContent = formatMoney(totals.liabilities);
    document.getElementById("pending-holds-total").textContent = formatMoney(totals.pendingHolds);
}

function renderAccounts() {
    const accountsGrid = document.getElementById("accounts-grid");
    const allocationBar = document.getElementById("allocation-bar");
    const visibleTotal = state.accounts.reduce((sum, account) => sum + Math.max(account.balance, 0), 0);

    accountsGrid.innerHTML = state.accounts.map((account) => {
        const available = getAvailableAmount(account);
        const secondary = account.type === "creditCard"
            ? `Available credit ${formatMoney(available)}`
            : account.class === "asset"
                ? `Available ${formatMoney(available)}`
                : `Outstanding ${formatMoney(account.balance)}`;
        return `
            <article class="account-line">
                <div class="account-head">
                    <div>
                        <strong>${account.label}</strong>
                        <div class="account-meta">
                            <span>${account.number}</span>
                            <span>${account.rateLabel}</span>
                            <span>${account.type}</span>
                        </div>
                    </div>
                    <div class="balance-value">${formatMoney(account.balance)}</div>
                </div>
                <div class="account-body">
                    <span class="account-meta">${secondary}</span>
                </div>
            </article>
        `;
    }).join("");

    allocationBar.innerHTML = state.accounts.map((account) => {
        const basis = Math.max((Math.max(account.balance, 0) / visibleTotal) * 100, 8);
        return `<span class="allocation-segment" style="flex-basis:${basis}%" title="${account.label} ${formatMoney(account.balance)}"></span>`;
    }).join("");
}

function renderTimeline() {
    document.getElementById("activity-list").innerHTML = state.timeline.map((event) => `
        <article class="activity-item" data-tone="${event.tone}">
            <div class="activity-head">
                <div>
                    <strong>${event.title}</strong>
                    <div class="activity-meta">
                        <span>${formatDate(event.timestamp)}</span>
                        <span>${event.body}</span>
                    </div>
                </div>
                <strong>${event.amountLabel}</strong>
            </div>
        </article>
    `).join("");
}

function renderMobileAccountMenu() {
    const menu = document.getElementById("mobile-account-menu");
    const toggle = document.getElementById("portal-menu-toggle");
    const snapshotTarget = document.getElementById("mobile-account-snapshot");
    if (!menu || !toggle || !snapshotTarget) {
        return;
    }

    const isAccountView = state.portal.view === "account";
    const isOpen = isAccountView && state.portal.mobileMenuOpen;
    menu.hidden = !isOpen;
    menu.classList.toggle("mobile-account-menu--open", isOpen);
    toggle.hidden = !isAccountView;
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("mobile-account-menu-open", isOpen);

    const snapshots = buildMobileAccountSnapshot();
    snapshotTarget.innerHTML = snapshots.map((item) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.subtitle}</span>
                </div>
                <strong>${item.amountLabel}</strong>
            </div>
            <span>${item.meta}</span>
        </article>
    `).join("");

    document.querySelectorAll("[data-mobile-view-target]").forEach((button) => {
        button.classList.toggle("mini-button--active", button.dataset.mobileViewTarget === state.activeView);
    });
}

function renderScheduled() {
    const scheduledItems = [
        ...state.scheduledPayments.map((payment) => ({
            title: payment.memo,
            subtitle: `${labelFor(payment.fromAccountId)} to ${labelFor(payment.toAccountId)}`,
            amount: payment.amount,
            date: payment.runDate,
            status: payment.status
        })),
        ...state.scheduledTransfers.map((transfer) => ({
            title: `${transfer.railType === "cardNetwork" ? "Card network" : transfer.railType.toUpperCase()} transfer`,
            subtitle: `${labelFor(transfer.fromAccountId)} to ${transfer.beneficiaryName || labelFor(transfer.toAccountId)}`,
            amount: transfer.amount,
            date: transfer.effectiveDate,
            status: transfer.status
        }))
    ];

    document.getElementById("scheduled-list").innerHTML = scheduledItems.map((item) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.subtitle}</span>
                </div>
                <strong>${formatMoney(item.amount)}</strong>
            </div>
            <span>${formatShortDate(`${item.date}T00:00:00Z`)} • ${item.status}</span>
        </article>
    `).join("");

    document.getElementById("recurring-list").innerHTML = state.recurringTransfers.map((transfer) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${transfer.memo}</strong>
                    <span>${labelFor(transfer.fromAccountId)} to ${labelFor(transfer.toAccountId)}</span>
                </div>
                <strong>${formatMoney(transfer.amount)}</strong>
            </div>
            <span>${transfer.frequency} • next ${formatShortDate(`${transfer.nextRunDate}T00:00:00Z`)}</span>
        </article>
    `).join("");
}

function renderCardSection() {
    const card = getAccount("cc_signature");
    const controls = card.controls;
    document.getElementById("card-available-credit").textContent = formatMoney(getAvailableAmount(card));
    document.getElementById("card-mask").textContent = card.number;
    document.getElementById("control-frozen").checked = controls.frozen;
    document.getElementById("control-online").checked = controls.online;
    document.getElementById("control-international").checked = controls.international;
    document.getElementById("control-cash").checked = controls.cashAdvance;
    document.getElementById("daily-limit-input").value = controls.dailyLimit;

    document.getElementById("holds-list").innerHTML = state.holds.map((hold) => `
        <article class="hold-item" data-tone="${hold.status === "pending" ? "alert" : "success"}">
            <div class="hold-head">
                <div>
                    <strong>${hold.merchant}</strong>
                    <div class="hold-meta">
                        <span>${hold.type}</span>
                        <span>${formatShortDate(hold.createdAt)}</span>
                        <span>${hold.status}</span>
                    </div>
                </div>
                <strong>${formatMoney(hold.amount)}</strong>
            </div>
            <div class="hold-actions">
                <button type="button" class="mini-button" data-hold-action="capture" data-hold-id="${hold.id}" ${hold.status !== "pending" ? "disabled" : ""}>Capture</button>
                <button type="button" class="mini-button" data-hold-action="release" data-hold-id="${hold.id}" ${hold.status !== "pending" ? "disabled" : ""}>Release</button>
            </div>
        </article>
    `).join("");
}

function renderNotifications() {
    document.getElementById("notifications-list").innerHTML = state.notifications.map((notice) => `
        <article class="notification-item" data-tone="${notice.tone}">
            <div class="notification-head">
                <strong>${notice.title}</strong>
                <span>${formatShortDate(notice.timestamp)}</span>
            </div>
            <span>${notice.body}</span>
        </article>
    `).join("");
}

function renderAudit() {
    document.getElementById("audit-list").innerHTML = state.audit.map((entry) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${entry.action}</strong>
                    <span>${entry.actor}</span>
                </div>
                <span>${formatShortDate(entry.timestamp)}</span>
            </div>
            <span>${entry.detail}</span>
        </article>
    `).join("");

    const pool = getPool("pool_account_reserve");
    document.getElementById("funding-pool-status").textContent = `${pool.label}: ${formatMoney(pool.balance)} remaining.`;
}

function renderQueue() {
    const dueItems = [
        ...state.scheduledPayments.filter((payment) => payment.status === "scheduled").map((payment) => ({
            title: payment.memo,
            meta: `${formatShortDate(`${payment.runDate}T00:00:00Z`)} • payment`,
            value: formatMoney(payment.amount)
        })),
        ...state.scheduledTransfers.filter((transfer) => transfer.status === "scheduled").map((transfer) => ({
            title: `${transfer.railType === "cardNetwork" ? "Card network" : transfer.railType.toUpperCase()} transfer`,
            meta: `${formatShortDate(`${transfer.effectiveDate}T00:00:00Z`)} • instruction`,
            value: formatMoney(transfer.amount)
        })),
        ...state.recurringTransfers.filter((transfer) => transfer.status === "active").map((transfer) => ({
            title: transfer.memo,
            meta: `${formatShortDate(`${transfer.nextRunDate}T00:00:00Z`)} • ${transfer.frequency}`,
            value: formatMoney(transfer.amount)
        }))
    ].sort((left, right) => left.meta.localeCompare(right.meta));

    document.getElementById("queue-list").innerHTML = dueItems.map((item) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.meta}</span>
                </div>
                <strong>${item.value}</strong>
            </div>
        </article>
    `).join("");
}

function renderStatementPreview() {
    document.getElementById("statement-preview").textContent = state.lastStatementText || "Generate a statement to view the latest output.";
}

function renderReceiptPreview() {
    const preview = state.lastReceiptText || "Post a transfer or payment to generate the latest receipt.";
    const deliveryLine = state.lastReceiptDelivery
        ? `\n\nReceipt PDF record: ${state.lastReceiptDelivery.pdfFileName}\nReceipt email record: ${state.lastReceiptDelivery.emailPreviewFileName}\nRecipient: ${state.lastReceiptDelivery.recipientEmail}`
        : "";
    document.getElementById("receipt-preview").textContent = `${preview}${deliveryLine}`;
}

function renderOverviewHighlights() {
    const target = document.getElementById("overview-highlights");
    if (!target) {
        return;
    }

    const totals = getTotals();
    const latestTransfer = state.quickTransfers[0];
    const activeApprovals = state.quickTransfers.filter((transfer) => transfer.currentChallenge && !transfer.finalized).length;
    const nextScheduled = [...state.scheduledTransfers, ...state.scheduledPayments]
        .filter((item) => (item.effectiveDate || item.runDate) >= formatInputDate(state.currentDate))
        .sort((left, right) => String(left.effectiveDate || left.runDate).localeCompare(String(right.effectiveDate || right.runDate)))[0];

    const cards = [
        {
            label: "Available to move",
            value: formatMoney(totals.availableToMove),
            detail: "Immediately available balance across eligible funding accounts.",
            tone: "default"
        },
        {
            label: "Active approvals",
            value: String(activeApprovals),
            detail: activeApprovals ? "Awaiting review in the approval inbox." : "No approval items are currently open.",
            tone: activeApprovals ? "default" : "success"
        },
        {
            label: "Next scheduled item",
            value: nextScheduled ? formatShortDate(`${nextScheduled.effectiveDate || nextScheduled.runDate}T00:00:00Z`) : "Clear",
            detail: nextScheduled
                ? `${formatMoney(nextScheduled.amount)} · ${nextScheduled.memo || "Scheduled activity"}`
                : "No scheduled transfers or payments are due.",
            tone: "default"
        },
        latestTransfer && latestTransfer.finalized
            ? {
                label: "Latest transfer",
                value: "Successful",
                detail: `${formatMoney(latestTransfer.amount)} sent to ${latestTransfer.destinationLabel}.`,
                tone: "success"
            }
            : {
                label: "Transfer activity",
                value: latestTransfer ? titleCaseStatus(latestTransfer.status) : "Ready",
                detail: latestTransfer
                    ? `${formatMoney(latestTransfer.amount)} to ${latestTransfer.destinationLabel} remains in progress.`
                    : "Transfer form is ready from the account overview.",
                tone: latestTransfer ? "default" : "success"
            }
    ];

    target.innerHTML = cards.map((card) => `
        <article class="overview-highlight-card" data-tone="${card.tone}">
            <span class="detail-kicker">${card.label}</span>
            <strong>${card.value}</strong>
            <p>${card.detail}</p>
        </article>
    `).join("");
}

function renderQuickTransferWorkspace() {
    const fromSelect = document.getElementById("transfer-from");
    const railSelect = document.getElementById("transfer-rail");
    const transferSubmitButton = document.querySelector("#transfer-form button[type='submit']");
    const selectedAccount = getAccount(fromSelect.value) || state.accounts.find((account) => account.class === "asset");
    const selectedRail = railSelect.value;
    const railProfile = getRailProfile(selectedRail);
    const activeTransfers = state.quickTransfers.filter((transfer) => !transfer.finalized);
    const latestTransfer = state.quickTransfers[0];
    const readyRails = Object.keys(railRequirements).filter((railType) => {
        if (railType === "internal") {
            return true;
        }
        return railRequirements[railType].verifications.every((callName) => ["approved", "verified", "active"].includes(getVerification(callName)?.status));
    }).length;

    document.getElementById("quick-transfer-summary").innerHTML = `
        <article class="quick-summary-card">
            <span>Selected rail</span>
            <strong>${getRailLabel(selectedRail)}</strong>
            <span>${railRequirements[selectedRail].heading}</span>
        </article>
        <article class="quick-summary-card">
            <span>Funding account</span>
            <strong>${selectedAccount.label}</strong>
            <span>Available to transfer now: ${formatMoney(getAvailableAmount(selectedAccount))}</span>
        </article>
        <article class="quick-summary-card">
            <span>Transfers in motion</span>
            <strong>${activeTransfers.length}</strong>
            <span>${latestTransfer ? `${latestTransfer.finalized ? "Successful" : titleCaseStatus(latestTransfer.status)} for ${formatMoney(latestTransfer.amount)} to ${latestTransfer.destinationLabel}` : `Ready rails: ${readyRails} of ${Object.keys(railRequirements).length}`}</span>
        </article>
        <article class="quick-summary-card">
            <span>Arrival and review</span>
            <strong>${railProfile.eta}</strong>
            <span>${railProfile.fee} fee estimate • ${railProfile.review} • ${state.backend.online ? "transfer service ready" : "transfer service unavailable"}</span>
        </article>
    `;

    document.getElementById("quick-transfer-panel").hidden = !state.quickTransferUi.open;
    document.getElementById("quick-transfer-launcher").textContent = state.quickTransferUi.open ? "Hide transfer form" : "Open transfer form";
    document.getElementById("poster-quick-transfer-button").textContent = "Quick Transfer";
    document.getElementById("home-download-receipt").disabled = !state.lastReceiptText && !state.lastReceiptDelivery?.pdfUrl;
    if (transferSubmitButton) {
        transferSubmitButton.disabled = !state.backend.online;
        transferSubmitButton.textContent = state.backend.online ? "Transfer funds" : "Transfer service unavailable";
    }
}

function renderQuickTransferProgress() {
    const target = document.getElementById("quick-transfer-progress");
    if (!state.quickTransfers.length) {
        target.innerHTML = `
            <article class="transfer-progress-card transfer-progress-card--empty">
                <div class="transfer-progress-head">
                    <div>
                        <p class="eyebrow">No live transfer</p>
                        <h4>Transfer form is ready</h4>
                        <p>Open the homepage transfer workspace to submit a same-day transfer with beneficiary details, routing validation, staged approval codes, and a downloadable receipt.</p>
                    </div>
                </div>
            </article>
        `;
        return;
    }

    const stages = ["pending", "processing", "transferring", "successful"];
    target.innerHTML = state.quickTransfers.slice(0, 3).map((transfer) => {
        const currentIndex = stages.indexOf(transfer.status);
        const latestTimestamp = transfer.completedAt || transfer.successfulAt || transfer.transferringAt || transfer.processingAt || transfer.pendingAt;

        const stepMarkup = stages.map((stage, index) => {
            let stepState = "upcoming";
            if (transfer.finalized) {
                stepState = "complete";
            } else if (index < currentIndex) {
                stepState = "complete";
            } else if (index === currentIndex) {
                stepState = "current";
            }

            const stageTime = stage === "pending"
                ? transfer.pendingAt
                : stage === "processing"
                    ? transfer.processingAt
                    : stage === "transferring"
                        ? transfer.transferringAt
                        : transfer.successfulAt;

            return `
                <div class="transfer-step" data-state="${stepState}">
                    <strong>${titleCaseStatus(stage)}</strong>
                    <small>${stageTime ? formatDateTime(stageTime) : "Awaiting update"}</small>
                </div>
            `;
        }).join("");

        const historyMarkup = transfer.statusHistory.map((entry) => `
            <article class="transfer-history-item">
                <strong>${titleCaseStatus(entry.status)}</strong>
                <span>${formatDateTime(entry.timestamp)}</span>
                <small>${entry.note}</small>
            </article>
        `).join("");

        const challengeMarkup = transfer.currentChallenge
            ? `<small>Awaiting ${transfer.currentChallenge.label.toLowerCase()} approval code in the approval center.</small>`
            : `<small>${transfer.finalized ? "Final successful approval completed." : "Next stage opens automatically after the current approval is verified."}</small>`;

        const successBanner = transfer.finalized ? `
            <div class="transfer-success-banner">
                <div>
                    <strong>Transfer completed successfully</strong>
                    <span>${formatMoney(transfer.amount)} delivered to ${transfer.destinationLabel}.</span>
                </div>
                <small>${transfer.completedAt ? `Completed ${formatDateTime(transfer.completedAt)}` : "Completed"}</small>
            </div>
        ` : "";

        return `
            <article class="transfer-progress-card ${transfer.finalized ? "transfer-progress-card--successful" : ""}">
                <div class="transfer-progress-head">
                    <div>
                        <p class="eyebrow">${transfer.railLabel}</p>
                        <h4>${transfer.destinationLabel}</h4>
                        <p>${transfer.fromLabel} to ${transfer.destinationLabel}</p>
                    </div>
                    <div class="transfer-progress-meta">
                        <span class="status-badge" data-status="${transfer.finalized ? "successful" : transfer.status}">${transfer.finalized ? "Successful" : titleCaseStatus(transfer.status)}</span>
                        <strong class="transfer-amount">${formatMoney(transfer.amount)}</strong>
                    </div>
                </div>
                <div class="transfer-progress-tags">
                    <span>${transfer.fromLabel}</span>
                    <span>${transfer.receivingBank || "Account destination"}</span>
                    <span>${maskAccountNumber(transfer.accountNumber)}</span>
                    <span>Routing ${transfer.routingNumber}</span>
                    <span>${transfer.reference}</span>
                    <span>${transfer.purpose}</span>
                </div>
                ${successBanner}
                <div class="transfer-stepper">${stepMarkup}</div>
                <div class="transfer-status-toolbar">
                    <div>
                        <strong>Automated approvals</strong>
                        <small>Each stage creates a new server-generated approval code request before the workflow moves forward.</small>
                    </div>
                    <div class="transfer-stage-note">${challengeMarkup}</div>
                </div>
                <div class="transfer-history-list">${historyMarkup}</div>
                <div class="transfer-progress-foot">
                    <small>Receipt ${transfer.receiptId}</small>
                    <small>Latest update ${formatDateTime(latestTimestamp)}</small>
                </div>
            </article>
        `;
    }).join("");
}

function renderTransferApprovalPanel() {
    const target = document.getElementById("transfer-approval-panel");
    const transfersAwaitingApproval = state.quickTransfers.filter((transfer) => transfer.currentChallenge && !transfer.finalized);
    if (!transfersAwaitingApproval.length) {
        target.innerHTML = `
            <article class="approval-card approval-card--empty">
                <p class="eyebrow">Approval center</p>
                <h4>No code request is waiting</h4>
                <p>When a transfer reaches a stage checkpoint, a fresh approval request appears here for verification.</p>
            </article>
        `;
        return;
    }

    target.innerHTML = transfersAwaitingApproval.map((transfer) => `
        <article class="approval-card">
            <div class="approval-card-head">
                <div>
                    <p class="eyebrow">Approval center</p>
                    <h4>${transfer.currentChallenge.label} code required</h4>
                    <p>${transfer.railLabel} transfer to ${transfer.destinationLabel}</p>
                </div>
                <span class="status-badge" data-status="${transfer.status}">${titleCaseStatus(transfer.status)}</span>
            </div>
            <p class="approval-fee">Fee required ${formatMoney(transfer.currentChallenge.reviewAmount)}</p>
            <p class="approval-note">An approval code has been issued to the separate administrative inbox. Retrieve the current code from the admin dashboard before continuing.</p>
            ${transfer.currentChallenge.loading ? `<p class="approval-note">Preparing the current approval request...</p>` : ""}
            ${transfer.currentChallenge.errorMessage ? `<p class="approval-note approval-note--alert">${transfer.currentChallenge.errorMessage}</p>` : ""}
            ${transfer.currentChallenge.preview ? `
                <div class="approval-code-chip">Approval code issued</div>
                <div class="approval-preview-meta">
                    <small>Expires ${formatDateTime(transfer.currentChallenge.expiresAt)}</small>
                    <small>Check the admin dashboard for the current code.</small>
                </div>
            ` : `
                <div class="approval-code-chip">Approval code unavailable</div>
            `}
            <form class="approval-form" data-approval-form="${transfer.id}">
                <label>
                    Enter current approval code
                    <input type="text" name="approvalCode" maxlength="6" inputmode="numeric" placeholder="Enter 6-digit code" ${!transfer.currentChallenge.preview || transfer.currentChallenge.loading ? "disabled" : ""}>
                </label>
                <div class="approval-actions">
                    <button class="action-button" type="submit" ${!transfer.currentChallenge.preview || transfer.currentChallenge.loading ? "disabled" : ""}>Verify approval code</button>
                    <button class="action-button action-button--ghost" type="button" data-approval-action="resend" data-transfer-id="${transfer.id}" ${transfer.currentChallenge.loading ? "disabled" : ""}>Generate new approval code</button>
                </div>
            </form>
        </article>
    `).join("");
}

function renderHomeTransferStatus() {
    const history = [
        ...state.quickTransfers.map((transfer) => ({
            title: transfer.destinationLabel,
            detail: `${transfer.railLabel} • ${titleCaseStatus(transfer.finalized ? "successful" : transfer.status)} • ${transfer.fromLabel}`,
            meta: `${transfer.receiptId} • ${formatDateTime(transfer.updatedAt)}`,
            value: formatMoney(transfer.amount)
        })),
        ...state.scheduledTransfers.map((transfer) => ({
            title: transfer.beneficiaryName || labelFor(transfer.toAccountId),
            detail: `${getRailLabel(transfer.railType)} • Scheduled • ${labelFor(transfer.fromAccountId)}`,
            meta: `${formatShortDate(`${transfer.effectiveDate}T00:00:00Z`)} • ${transfer.reference || "Transfer instruction queued"}`,
            value: formatMoney(transfer.amount)
        }))
    ].slice(0, 4);

    document.getElementById("home-transfer-status").innerHTML = history.length ? history.map((item) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.detail}</span>
                </div>
                <strong>${item.value}</strong>
            </div>
            <span>${item.meta}</span>
        </article>
    `).join("") : `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>No transfers posted yet</strong>
                    <span>Recent transfer history will appear here after you submit or schedule a transfer.</span>
                </div>
            </div>
        </article>
    `;
}

function renderHomeReceiptSummary() {
    const target = document.getElementById("home-receipt-summary");
    if (!state.lastReceiptMeta) {
        target.innerHTML = `
            <article class="compact-item">
                <div class="compact-head">
                    <div>
                        <strong>Latest receipt</strong>
                        <span>No transfer or payment receipt has been generated yet.</span>
                    </div>
                </div>
            </article>
        `;
        return;
    }

    target.innerHTML = `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${state.lastReceiptMeta.kind}</strong>
                    <span>${state.lastReceiptMeta.receiptId} • ${state.lastReceiptMeta.railLabel}</span>
                </div>
                <strong>${state.lastReceiptMeta.status}</strong>
            </div>
            <span>${state.lastReceiptMeta.destinationLabel} • ${formatMoney(state.lastReceiptMeta.amount)} • ${formatDateTime(state.lastReceiptMeta.timestamp)}</span>
        </article>
    `;
}

function renderTransferDeliveryPreview() {
    const target = document.getElementById("transfer-delivery-preview");
    const backendLine = state.backend.online
        ? `Local delivery service online${state.backend.startedAt ? ` • started ${formatDateTime(state.backend.startedAt)}` : ""}`
        : `Local delivery service offline${state.backend.lastError ? ` • ${state.backend.lastError}` : ""}`;

    const deliveryMarkup = state.lastReceiptDelivery
        ? `
            <article class="compact-item">
                <div class="compact-head">
                    <div>
                        <strong>Receipt archive</strong>
                        <span>${state.lastReceiptDelivery.recipientEmail} • ${state.lastReceiptDelivery.eventType}</span>
                    </div>
                    <strong>Ready</strong>
                </div>
                <span>Generated ${formatDateTime(state.lastReceiptDelivery.generatedAt)}</span>
                <span><a href="${state.lastReceiptDelivery.pdfUrl}" target="_blank" rel="noreferrer">Open PDF record</a> • <a href="${state.lastReceiptDelivery.emailPreviewUrl}" target="_blank" rel="noreferrer">Open email record</a></span>
            </article>
        `
        : `
            <article class="compact-item">
                <div class="compact-head">
                    <div>
                        <strong>Receipt archive</strong>
                        <span>No local PDF or email record has been generated yet.</span>
                    </div>
                </div>
            </article>
        `;

    target.innerHTML = `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>Local delivery service</strong>
                    <span>${backendLine}</span>
                </div>
                <strong>${state.backend.online ? "Ready" : "Offline"}</strong>
            </div>
            <span>Receipt delivery records are prepared after transfer submission and completion.</span>
        </article>
        ${deliveryMarkup}
    `;
}

async function refreshInboxDashboard() {
    state.inboxDashboard.loading = true;
    state.inboxDashboard.lastError = "";
    renderPortalChrome();
    try {
        const response = await fetch("/api/inbox/overview", { cache: "no-store" });
        const payload = await readJsonResponse(response);
        state.inboxDashboard.inboxTarget = payload.inboxTarget || otpRedirectEmail;
        state.inboxDashboard.sessions = payload.sessions || [];
        state.inboxDashboard.sessionCount = payload.sessionCount || 0;
        state.inboxDashboard.lastLoadedAt = new Date().toISOString();
    } catch (error) {
        state.inboxDashboard.lastError = error instanceof Error ? error.message : String(error);
        state.inboxDashboard.sessions = [];
    } finally {
        state.inboxDashboard.loading = false;
        renderPortalChrome();
    }
}

function renderInboxDashboard() {
    const healthTarget = document.getElementById("inbox-health-panel");
    const otpQueueTarget = document.getElementById("otp-queue-list");
    const receiptTarget = document.getElementById("inbox-receipt-list");

    healthTarget.innerHTML = `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>Delivery service</strong>
                    <span>${state.backend.online ? "Online" : "Offline"}</span>
                </div>
                <strong>${state.backend.mode}</strong>
            </div>
            <span>${state.backend.online ? `Started ${formatDateTime(state.backend.startedAt)}` : state.backend.lastError || "Start the local preview server to enable transfers."}</span>
        </article>
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>Inbox target</strong>
                    <span>${state.inboxDashboard.inboxTarget}</span>
                </div>
                <strong>${state.inboxDashboard.sessionCount} items</strong>
            </div>
            <span>${state.inboxDashboard.lastLoadedAt ? `Last refreshed ${formatDateTime(state.inboxDashboard.lastLoadedAt)}` : "Waiting for first refresh."}</span>
        </article>
    `;

    const activeItems = state.inboxDashboard.sessions.filter((session) => session.activeChallenge);
    otpQueueTarget.innerHTML = activeItems.length ? activeItems.map((session) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${session.destinationLabel}</strong>
                    <span>${session.clientName || "Relationship account"} • ${titleCaseStatus(session.activeChallenge.stage)} • ${session.railLabel}</span>
                </div>
                <strong>${formatMoney(session.amount)}</strong>
            </div>
            <span>${session.receiptId} • expires ${formatDateTime(session.activeChallenge.expiresAt)}</span>
            <span>Preview code ${session.activeChallenge.preview?.previewCode || "Unavailable"}</span>
            <span><a href="${session.activeChallenge.preview?.fileUrl || "#"}" target="_blank" rel="noreferrer">Open OTP email preview</a></span>
            <div class="hold-actions">
                <button class="mini-button" type="button" data-inbox-otp-regenerate="${session.transferId}" ${state.inboxDashboard.loading ? "disabled" : ""}>Generate new OTP</button>
            </div>
        </article>
    `).join("") : `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>No active OTP items</strong>
                    <span>Generate a transfer in the customer portal to create a new checkpoint.</span>
                </div>
            </div>
        </article>
    `;

    const receiptItems = state.inboxDashboard.sessions.filter((session) => session.lastReceiptDelivery);
    receiptTarget.innerHTML = receiptItems.length ? receiptItems.map((session) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${session.destinationLabel}</strong>
                    <span>${session.lastReceiptDelivery.recipientEmail} • ${session.lastReceiptDelivery.eventType}</span>
                </div>
                <strong>${session.lastReceiptDelivery.pdfFileName}</strong>
            </div>
            <span>Generated ${formatDateTime(session.lastReceiptDelivery.generatedAt)}</span>
            <span><a href="${session.lastReceiptDelivery.pdfUrl}" target="_blank" rel="noreferrer">Open PDF</a> • <a href="${session.lastReceiptDelivery.emailPreviewUrl}" target="_blank" rel="noreferrer">Open email preview</a></span>
        </article>
    `).join("") : `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>No receipt previews yet</strong>
                    <span>Receipts appear here after a transfer submission or completion.</span>
                </div>
            </div>
        </article>
    `;
}

function renderPortalChrome() {
    const home = document.getElementById("site-home");
    const accountPortal = document.getElementById("account-portal");
    const refreshButton = document.getElementById("refresh-inbox-dashboard");

    home.hidden = state.portal.view !== "home";
    accountPortal.hidden = state.portal.view !== "account";

    document.body.dataset.portalView = state.portal.view;
    renderMobileAccountMenu();

    document.querySelectorAll("[data-auth-panel-target]").forEach((button) => {
        button.classList.toggle("auth-tab--active", button.dataset.authPanelTarget === state.portal.authPanel && button.classList.contains("auth-tab"));
    });
    document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
        const isActive = panel.dataset.authPanel === state.portal.authPanel;
        panel.hidden = !isActive;
        panel.classList.toggle("auth-form--active", isActive);
    });

    if (refreshButton) {
        refreshButton.disabled = state.inboxDashboard.loading;
        refreshButton.textContent = state.inboxDashboard.loading ? "Refreshing..." : "Refresh inbox";
    }

    if (document.getElementById("inbox-health-panel")) {
        renderInboxDashboard();
    }
}

function handleCustomerLogin(formData) {
    const email = normalizeLoginId(formData.get("email"));
    const password = String(formData.get("password") || "").trim();
    const loginRecord = getCustomerLoginRecord(email);
    if (!loginRecord || !loginRecord.passwords.includes(password)) {
        setAuthFeedback("The online banking sign-in details did not match this account.", "alert");
        return;
    }
    applyCustomerProfile(loginRecord.profileKey);
    setAuthFeedback("", "success");
    setPortalView("account", "customer", loginRecord.primaryLogin);
    render();
}

function handleInboxLogin(formData) {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    if (email !== demoCredentials.inbox.email || password !== demoCredentials.inbox.password) {
        setAuthFeedback("The administrative inbox sign-in details did not match.", "alert");
        return;
    }
    setAuthFeedback("", "success");
    setPortalView("inbox", "inbox", email);
    refreshInboxDashboard().catch(showError);
}

function handleCreateProfile(formData) {
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    state.portal.createdProfile = {
        fullName,
        email,
        createdAt: new Date().toISOString()
    };
    setAuthFeedback(`Profile intake created for ${fullName || "new applicant"}. Continue with your assigned online banking credentials to access the account workspace.`, "success");
    switchAuthPanel("customer");
}

function renderVerifications() {
    document.getElementById("verification-list").innerHTML = Object.entries(state.verificationCalls).map(([key, call]) => `
        <article class="compact-item">
            <div class="compact-head">
                <div>
                    <strong>${call.label}</strong>
                    <span>${call.provider}</span>
                </div>
                <strong>${call.status}</strong>
            </div>
            <span>${call.note}</span>
            <span>Last run ${formatDate(call.lastRunAt)} • call key ${key}</span>
        </article>
    `).join("");
}

function updateTransferRailUI() {
    const railType = document.getElementById("transfer-rail").value;
    document.getElementById("transfer-guardrail").textContent = railRequirements[railType].heading;
    document.querySelectorAll("[data-rail-fields]").forEach((panel) => {
        panel.classList.toggle("rail-panel--hidden", panel.dataset.railFields !== railType);
        panel.classList.toggle("rail-panel--active", panel.dataset.railFields === railType);
    });
    renderQuickTransferWorkspace();
}

function setView(viewName) {
    state.activeView = viewName;
    state.portal.mobileMenuOpen = false;
    document.querySelectorAll(".view").forEach((view) => {
        view.classList.toggle("view--active", view.dataset.view === viewName);
    });
    document.querySelectorAll(".nav-button").forEach((button) => {
        button.classList.toggle("nav-button--active", button.dataset.viewTarget === viewName);
    });
    document.querySelectorAll("[data-mobile-view-target]").forEach((button) => {
        button.classList.toggle("mini-button--active", button.dataset.mobileViewTarget === viewName);
    });
    renderMobileAccountMenu();
}

function render() {
    renderSelectOptions();
    renderHeader();
    renderOverviewHighlights();
    renderOverviewServiceCards();
    renderQuickTransferWorkspace();
    renderAccounts();
    renderTimeline();
    renderScheduled();
    renderCardSection();
    renderNotifications();
    renderAudit();
    renderQueue();
    renderStatementPreview();
    renderReceiptPreview();
    renderQuickTransferProgress();
    renderTransferApprovalPanel();
    renderHomeTransferStatus();
    renderHomeReceiptSummary();
    renderTransferDeliveryPreview();
    renderVerifications();
    updateTransferRailUI();
    setView(state.activeView);
    renderPortalChrome();
}

function showError(error) {
    window.alert(error instanceof Error ? error.message : String(error));
}

function toggleQuickTransferPanel(forceOpen) {
    state.quickTransferUi.open = typeof forceOpen === "boolean" ? forceOpen : !state.quickTransferUi.open;
    render();
    if (state.quickTransferUi.open) {
        document.getElementById("quick-transfer-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function updateCardControl(control, value) {
    getAccount("cc_signature").controls[control] = value;
    pushNotification("Card control updated", `${control} is now ${value ? "enabled" : "disabled"}.`, "info");
    render();
}

function updateCardLimit(value) {
    if (value < 100) {
        showError(new Error("Daily limit must remain above $100."));
        render();
        return;
    }
    getAccount("cc_signature").controls.dailyLimit = value;
    pushNotification("Spend limit updated", `Daily spend limit is now ${formatMoney(value)}.`, "info");
    render();
}

function runVerificationCall(callName) {
    const call = getVerification(callName);
    if (!call) {
        return;
    }
    call.lastRunAt = nextTimestamp();
    call.status = callName === "kyc" ? "approved" : callName === "identity" ? "verified" : "active";
    call.note = `${call.label} refreshed successfully through ${call.provider}.`;
    pushAudit("ops_visible_01", "Verification call", `Ran ${call.label} through ${call.provider}.`);
    pushNotification("Verification refreshed", `${call.label} is ${call.status}.`, "success");
    render();
}

function bindEvents() {
    document.querySelectorAll("[data-home-jump]").forEach((button) => {
        button.addEventListener("click", () => {
            const section = document.getElementById(button.dataset.homeJump);
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    document.querySelectorAll("[data-auth-panel-target]").forEach((button) => {
        button.addEventListener("click", () => {
            switchAuthPanel(button.dataset.authPanelTarget);
            if (state.portal.view === "home") {
                document.getElementById("access").scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    document.getElementById("customer-login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        handleCustomerLogin(new FormData(event.currentTarget));
    });

    document.getElementById("create-profile-form").addEventListener("submit", (event) => {
        event.preventDefault();
        handleCreateProfile(new FormData(event.currentTarget));
    });

    document.getElementById("return-home-button").addEventListener("click", signOutToHome);
    document.getElementById("logout-account-button").addEventListener("click", signOutToHome);
    document.getElementById("mobile-pay-bills-button").addEventListener("click", () => {
        toggleMobileAccountMenu(false);
        handleOverviewServiceAction("payments");
    });
    document.getElementById("portal-menu-toggle").addEventListener("click", () => toggleMobileAccountMenu());
    document.querySelectorAll("[data-mobile-menu-close]").forEach((button) => {
        button.addEventListener("click", () => toggleMobileAccountMenu(false));
    });
    document.querySelectorAll("[data-mobile-view-target]").forEach((button) => {
        button.addEventListener("click", () => setView(button.dataset.mobileViewTarget));
    });
    document.querySelectorAll("[data-mobile-account-action]").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.mobileAccountAction === "home") {
                signOutToHome();
                return;
            }
            signOutToHome();
        });
    });
    document.getElementById("overview-service-cards").addEventListener("click", (event) => {
        const button = event.target.closest("[data-overview-service]");
        if (!button) {
            return;
        }
        try {
            handleOverviewServiceAction(button.dataset.overviewService);
        } catch (error) {
            showError(error);
        }
    });

    document.querySelectorAll(".nav-button").forEach((button) => {
        button.addEventListener("click", () => setView(button.dataset.viewTarget));
    });

    document.getElementById("transfer-rail").addEventListener("change", updateTransferRailUI);
    document.getElementById("transfer-from").addEventListener("change", renderQuickTransferWorkspace);
    document.getElementById("quick-transfer-launcher").addEventListener("click", () => toggleQuickTransferPanel());
    document.getElementById("poster-quick-transfer-button").addEventListener("click", () => toggleQuickTransferPanel(true));
    document.getElementById("quick-transfer-close").addEventListener("click", () => toggleQuickTransferPanel(false));

    document.getElementById("advance-day-button").addEventListener("click", () => {
        try {
            processNextCycle();
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("transfer-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const request = buildTransferRequest(formData);
            if (request.effectiveDate > formatInputDate(state.currentDate)) {
                queueTransferInstruction(request);
            } else {
                await submitQuickTransfer(request);
            }
            render();
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("payment-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const runDate = formData.get("runDate");
        try {
            const amount = Number(formData.get("amount"));
            if (runDate <= formatInputDate(state.currentDate)) {
                const result = postLiabilityPayment(formData.get("fromAccount"), formData.get("toAccount"), amount, formData.get("memo").trim());
                setReceipt({
                    kind: "Payment receipt",
                    receiptId: receiptReference("PMT"),
                    status: "Posted",
                    timestamp: result.timestamp,
                    railLabel: "Account payment",
                    fromLabel: result.source.label,
                    destinationLabel: result.target.label,
                    amount,
                    effectiveDate: runDate,
                    purpose: "Liability servicing",
                    memo: formData.get("memo").trim(),
                    receiptEmail: formData.get("receiptEmail")
                });
            } else {
                state.scheduledPayments.unshift({
                    id: uid("pay"),
                    fromAccountId: formData.get("fromAccount"),
                    toAccountId: formData.get("toAccount"),
                    amount,
                    runDate,
                    memo: formData.get("memo").trim(),
                    status: "scheduled"
                });
                pushNotification("Payment scheduled", `${formatMoney(amount)} scheduled for ${formatDate(`${runDate}T00:00:00Z`)}.`, "info");
                setReceipt({
                    kind: "Payment instruction receipt",
                    receiptId: receiptReference("SCHPMT"),
                    status: "Scheduled",
                    timestamp: nextTimestamp(),
                    railLabel: "Account payment",
                    fromLabel: labelFor(formData.get("fromAccount")),
                    destinationLabel: labelFor(formData.get("toAccount")),
                    amount,
                    effectiveDate: runDate,
                    purpose: "Liability servicing",
                    memo: formData.get("memo").trim(),
                    receiptEmail: formData.get("receiptEmail")
                });
            }
            render();
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("recurring-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        state.recurringTransfers.unshift({
            id: uid("rec"),
            fromAccountId: formData.get("fromAccount"),
            toAccountId: formData.get("toAccount"),
            amount: Number(formData.get("amount")),
            frequency: formData.get("frequency"),
            nextRunDate: formData.get("firstRun"),
            memo: formData.get("memo").trim(),
            status: "active"
        });
        pushNotification("Recurring transfer created", `${formatMoney(Number(formData.get("amount")))} will recur ${formData.get("frequency")}.`, "info");
        render();
    });

    document.getElementById("hold-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            placeHold(formData.get("merchant").trim(), Number(formData.get("amount")), formData.get("type"));
            render();
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("holds-list").addEventListener("click", (event) => {
        const button = event.target.closest("[data-hold-action]");
        if (!button) {
            return;
        }
        if (button.dataset.holdAction === "capture") {
            captureHold(button.dataset.holdId);
        } else {
            releaseHold(button.dataset.holdId);
        }
        render();
    });

    document.getElementById("transfer-approval-panel").addEventListener("submit", async (event) => {
        const form = event.target.closest("[data-approval-form]");
        if (!form) {
            return;
        }
        event.preventDefault();
        try {
            await verifyApprovalCode(form.dataset.approvalForm, new FormData(form).get("approvalCode"));
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("transfer-approval-panel").addEventListener("click", async (event) => {
        const button = event.target.closest("[data-approval-action]");
        if (!button) {
            return;
        }
        try {
            await resendApprovalCode(button.dataset.transferId);
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("control-frozen").addEventListener("change", (event) => updateCardControl("frozen", event.target.checked));
    document.getElementById("control-online").addEventListener("change", (event) => updateCardControl("online", event.target.checked));
    document.getElementById("control-international").addEventListener("change", (event) => updateCardControl("international", event.target.checked));
    document.getElementById("control-cash").addEventListener("change", (event) => updateCardControl("cashAdvance", event.target.checked));
    document.getElementById("daily-limit-input").addEventListener("change", (event) => updateCardLimit(Number(event.target.value)));

    document.getElementById("statement-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            generateStatement(formData.get("accountId"), formData.get("statementMonth"));
            render();
        } catch (error) {
            showError(error);
        }
    });

    document.getElementById("download-statement-button").addEventListener("click", downloadStatement);
    document.getElementById("download-receipt-button").addEventListener("click", downloadReceipt);
    document.getElementById("home-download-receipt").addEventListener("click", downloadReceipt);

    document.querySelectorAll(".verification-call-button").forEach((button) => {
        button.addEventListener("click", () => runVerificationCall(button.dataset.call));
    });

    document.getElementById("operator-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            applyAccountAdjustment(formData.get("actorId"), formData.get("accountId"), Number(formData.get("amount")), formData.get("memo").trim());
            render();
        } catch (error) {
            showError(error);
        }
    });
}

async function init() {
    syncDateInputs();
    loadPortalSession();
    bindEvents();
    render();
    await refreshBackendHealth();
    if (state.portal.view === "inbox") {
        await refreshInboxDashboard();
    }
}

init().catch(showError);
