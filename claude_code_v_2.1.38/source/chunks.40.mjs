
// @from(Ln 105649, Col 0)
function Cn() {
    if (process.env.ANTHROPIC_AUTH_TOKEN) return {
        source: "ANTHROPIC_AUTH_TOKEN",
        hasToken: !0
    };
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
        source: "CLAUDE_CODE_OAUTH_TOKEN",
        hasToken: !0
    };
    if (rs1()) return {
        source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
        hasToken: !0
    };
    if (_R1()) return {
        source: "apiKeyHelper",
        hasToken: !0
    };
    let K = a4();
    if (bQ(K?.scopes) && K?.accessToken) return {
        source: "claude.ai",
        hasToken: !0
    };
    return {
        source: "none",
        hasToken: !1
    }
}
// @from(Ln 105677, Col 0)
function Mk() {
    let {
        key: A
    } = yO();
    return A
}
// @from(Ln 105684, Col 0)
function ol8() {
    let {
        key: A,
        source: q
    } = yO({
        skipRetrievingKeyFromApiKeyHelper: !0
    });
    return A !== null && q !== "none"
}
// @from(Ln 105694, Col 0)
function yO(A = {}) {
    if (_N1() && process.env.ANTHROPIC_API_KEY) return {
        key: process.env.ANTHROPIC_API_KEY,
        source: "ANTHROPIC_API_KEY"
    };
    if (J6(!1)) {
        let Y = BF6();
        if (Y) return {
            key: Y,
            source: "ANTHROPIC_API_KEY"
        };
        if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
        if (process.env.ANTHROPIC_API_KEY) return {
            key: process.env.ANTHROPIC_API_KEY,
            source: "ANTHROPIC_API_KEY"
        };
        return {
            key: null,
            source: "none"
        }
    }
    if (process.env.ANTHROPIC_API_KEY && f6().customApiKeyResponses?.approved?.includes(cT(process.env.ANTHROPIC_API_KEY))) return {
        key: process.env.ANTHROPIC_API_KEY,
        source: "ANTHROPIC_API_KEY"
    };
    let q = BF6();
    if (q) return {
        key: q,
        source: "ANTHROPIC_API_KEY"
    };
    if (A.skipRetrievingKeyFromApiKeyHelper) {
        if (_R1()) return {
            key: null,
            source: "apiKeyHelper"
        }
    } else {
        let Y = JR1(w4());
        if (Y) return {
            key: Y,
            source: "apiKeyHelper"
        }
    }
    let K = XR1();
    if (K) return K;
    return {
        key: null,
        source: "none"
    }
}
// @from(Ln 105744, Col 0)
function _R1() {
    return (C8() || {}).apiKeyHelper
}
// @from(Ln 105748, Col 0)
function al8() {
    let A = _R1();
    if (!A) return !1;
    let q = y7("projectSettings"),
        K = y7("localSettings");
    return q?.apiKeyHelper === A || K?.apiKeyHelper === A
}
// @from(Ln 105756, Col 0)
function y1A() {
    return (C8() || {}).awsAuthRefresh
}
// @from(Ln 105760, Col 0)
function sl8() {
    let A = y1A();
    if (!A) return !1;
    let q = y7("projectSettings"),
        K = y7("localSettings");
    return q?.awsAuthRefresh === A || K?.awsAuthRefresh === A
}
// @from(Ln 105768, Col 0)
function C1A() {
    return (C8() || {}).awsCredentialExport
}
// @from(Ln 105772, Col 0)
function tl8() {
    let A = C1A();
    if (!A) return !1;
    let q = y7("projectSettings"),
        K = y7("localSettings");
    return q?.awsCredentialExport === A || K?.awsCredentialExport === A
}
// @from(Ln 105780, Col 0)
function B95() {
    let A = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
    if (A) {
        let q = parseInt(A, 10);
        if (!Number.isNaN(q) && q >= 0) return q;
        h(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${A}`, {
            level: "error"
        })
    }
    return u95
}
// @from(Ln 105792, Col 0)
function i86() {
    JR1.cache.clear()
}
// @from(Ln 105796, Col 0)
function el8(A) {
    if (_R1()) {
        if (al8()) {
            if (!$H(!0)) return
        }
    }
    JR1(A)
}
// @from(Ln 105804, Col 0)
async function F95() {
    let A = y1A();
    if (!A) return !1;
    if (sl8()) {
        if (!$H(!0) && !w4()) {
            let K = Error(`Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.FEEDBACK_CHANNEL}.`);
            return Yk("awsAuthRefresh invoked before trust check", K), c("tengu_awsAuthRefresh_missing_trust", {}), !1
        }
    }
    try {
        return h("Fetching AWS caller identity for AWS auth refresh command"), await Yn6(), h("Fetched AWS caller identity, skipping AWS auth refresh command"), !1
    } catch {
        return Q95(A)
    }
}
// @from(Ln 105820, Col 0)
function Q95(A) {
    h("Running AWS auth refresh command");
    let q = lT.getInstance();
    return q.startAuthentication(), new Promise((K) => {
        let Y = b95(A);
        Y.stdout.on("data", (z) => {
            let w = z.toString().trim();
            if (w) q.addOutput(w), h(w, {
                level: "debug"
            })
        }), Y.stderr.on("data", (z) => {
            let w = z.toString().trim();
            if (w) q.setError(w), h(w, {
                level: "error"
            })
        }), Y.on("close", (z) => {
            if (z === 0) h("AWS auth refresh completed successfully"), q.endAuthentication(!0), K(!0);
            else {
                let w = H6.red("Error running awsAuthRefresh (in settings or ~/.claude.json):");
                console.error(w), q.endAuthentication(!1), K(!1)
            }
        })
    })
}
// @from(Ln 105844, Col 0)
async function g95() {
    let A = C1A();
    if (!A) return null;
    if (tl8()) {
        if (!$H(!0) && !w4()) {
            let K = Error(`Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.FEEDBACK_CHANNEL}.`);
            return Yk("awsCredentialExport invoked before trust check", K), c("tengu_awsCredentialExport_missing_trust", {}), null
        }
    }
    try {
        return h("Fetching AWS caller identity for credential export command"), await Yn6(), h("Fetched AWS caller identity, skipping AWS credential export command"), null
    } catch {
        try {
            h("Running AWS credential export command");
            let q = await XY(A, {
                shell: !0,
                reject: !1
            });
            if (q.exitCode !== 0 || !q.stdout) throw Error("awsCredentialExport did not return a valid value");
            let K = _A(q.stdout.trim());
            if (!DR8(K)) throw Error("awsCredentialExport did not return valid AWS STS output structure");
            return h("AWS credentials retrieved from awsCredentialExport"), {
                accessKeyId: K.Credentials.AccessKeyId,
                secretAccessKey: K.Credentials.SecretAccessKey,
                sessionToken: K.Credentials.SessionToken
            }
        } catch (q) {
            let K = H6.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
            if (q instanceof Error) console.error(K, q.message);
            else console.error(K, q);
            return null
        }
    }
}
// @from(Ln 105879, Col 0)
function n86() {
    T81.cache.clear()
}
// @from(Ln 105883, Col 0)
function Ai8() {
    let A = y1A(),
        q = C1A();
    if (!A && !q) return;
    if (sl8() || tl8()) {
        if (!$H(!0) && !w4()) return
    }
    T81(), HH()
}
// @from(Ln 105893, Col 0)
function U95(A) {
    return /^[a-zA-Z0-9-_]+$/.test(A)
}
// @from(Ln 105896, Col 0)
async function G$8(A) {
    if (!U95(A)) throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
    await Ki8();
    let q = !1;
    if (process.platform === "darwin") try {
        let Y = xQ(),
            z = XH1(),
            w = Buffer.from(A, "utf-8").toString("hex"),
            H = `add-generic-password -U -a "${z}" -s "${Y}" -X "${w}"
`;
        await XY("security", ["-i"], {
            input: H,
            reject: !1
        }), c("tengu_api_key_saved_to_keychain", {}), q = !0
    } catch (Y) {
        K1(Y), c("tengu_api_key_keychain_error", {
            error: Y.message
        }), c("tengu_api_key_saved_to_config", {})
    } else c("tengu_api_key_saved_to_config", {});
    let K = cT(A);
    jA((Y) => {
        let z = Y.customApiKeyResponses?.approved ?? [];
        return {
            ...Y,
            primaryApiKey: q ? Y.primaryApiKey : A,
            customApiKeyResponses: {
                ...Y.customApiKeyResponses,
                approved: z.includes(K) ? z : [...z, K],
                rejected: Y.customApiKeyResponses?.rejected ?? []
            }
        }
    }), XR1.cache.clear?.()
}
// @from(Ln 105929, Col 0)
async function qi8() {
    await Ki8(), jA((A) => ({
        ...A,
        primaryApiKey: void 0
    })), XR1.cache.clear?.()
}
// @from(Ln 105935, Col 0)
async function Ki8() {
    try {
        await il8()
    } catch (A) {
        K1(A)
    }
}
// @from(Ln 105943, Col 0)
function DR1(A) {
    if (!bQ(A.scopes)) return c("tengu_oauth_tokens_not_claude_ai", {}), {
        success: !0
    };
    if (!A.refreshToken || !A.expiresAt) return c("tengu_oauth_tokens_inference_only", {}), {
        success: !0
    };
    let q = T0(),
        K = q.name;
    try {
        let Y = q.read() || {};
        Y.claudeAiOauth = {
            accessToken: A.accessToken,
            refreshToken: A.refreshToken,
            expiresAt: A.expiresAt,
            scopes: A.scopes,
            subscriptionType: A.subscriptionType,
            rateLimitTier: A.rateLimitTier
        };
        let z = q.update(Y);
        if (z.success) c("tengu_oauth_tokens_saved", {
            storageBackend: K
        });
        else c("tengu_oauth_tokens_save_failed", {
            storageBackend: K
        });
        return a4.cache?.clear?.(), At1(), z
    } catch (Y) {
        return K1(Y), c("tengu_oauth_tokens_save_exception", {
            storageBackend: K,
            error: Y.message
        }), {
            success: !1,
            warning: "Failed to save OAuth tokens"
        }
    }
}
// @from(Ln 105981, Col 0)
function p95() {
    a4.cache?.clear?.(), Ri()
}
// @from(Ln 105984, Col 0)
async function EO1(A) {
    p95();
    let q = a4();
    if (!q?.refreshToken) return !1;
    if (q.accessToken !== A) return c("tengu_oauth_401_recovered_from_keychain", {}), !0;
    return XM(0, !0)
}
// @from(Ln 105991, Col 0)
async function L1A() {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN || rs1()) return a4();
    try {
        let K = (await T0().readAsync())?.claudeAiOauth;
        if (!K?.accessToken) return null;
        return K
    } catch (A) {
        return K1(A), null
    }
}
// @from(Ln 106002, Col 0)
function XM(A = 0, q = !1) {
    if (A === 0 && !q) {
        if (OR1) return OR1;
        return OR1 = R1A(A, q).finally(() => {
            OR1 = null
        }), OR1
    }
    return R1A(A, q)
}
// @from(Ln 106011, Col 0)
async function R1A(A, q) {
    let Y = a4();
    if (!q) {
        if (!Y?.refreshToken || !uQ(Y.expiresAt)) return !1
    }
    if (!Y?.refreshToken) return !1;
    if (!bQ(Y.scopes)) return !1;
    a4.cache?.clear?.(), Ri();
    let z = await L1A();
    if (!z?.refreshToken || !uQ(z.expiresAt)) return !1;
    let w = O8();
    b1().mkdirSync(w);
    let $;
    try {
        c("tengu_oauth_token_refresh_lock_acquiring", {}), $ = await rl8.lock(w), c("tengu_oauth_token_refresh_lock_acquired", {})
    } catch (O) {
        if (O.code === "ELOCKED") {
            if (A < 5) return c("tengu_oauth_token_refresh_lock_retry", {
                retryCount: A + 1
            }), await new Promise((_) => setTimeout(_, 1000 + Math.random() * 1000)), R1A(A + 1, q);
            return c("tengu_oauth_token_refresh_lock_retry_limit_reached", {
                maxRetries: 5
            }), !1
        }
        return K1(O), c("tengu_oauth_token_refresh_lock_error", {
            error: O.message
        }), !1
    }
    try {
        a4.cache?.clear?.(), Ri();
        let O = await L1A();
        if (!O?.refreshToken || !uQ(O.expiresAt)) return c("tengu_oauth_token_refresh_race_resolved", {}), !1;
        c("tengu_oauth_token_refresh_starting", {});
        let _ = await j$8(O.refreshToken);
        return DR1(_), a4.cache?.clear?.(), Ri(), !0
    } catch (O) {
        K1(O instanceof Error ? O : Error(String(O))), a4.cache?.clear?.(), Ri();
        let _ = await L1A();
        if (_ && !uQ(_.expiresAt)) return c("tengu_oauth_token_refresh_race_recovered", {}), !0;
        return !1
    } finally {
        c("tengu_oauth_token_refresh_lock_releasing", {}), await $(), c("tengu_oauth_token_refresh_lock_released", {})
    }
}
// @from(Ln 106056, Col 0)
function i8() {
    if (!MV()) return !1;
    return bQ(a4()?.scopes)
}
// @from(Ln 106061, Col 0)
function Yi8() {
    if (J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !1;
    if (i8()) return !1;
    return !0
}
// @from(Ln 106067, Col 0)
function u3() {
    return MV() ? f6().oauthAccount : void 0
}
// @from(Ln 106071, Col 0)
function dC() {
    let q = u3()?.billingType;
    if (!i8() || !q) return !1;
    if (q !== "stripe_subscription" && q !== "stripe_subscription_contracted" && q !== "apple_subscription" && q !== "google_play_subscription") return !1;
    return !0
}
// @from(Ln 106078, Col 0)
function tk() {
    let A = dK();
    return A === "max" || A === "enterprise" || A === "team" || A === "pro" || A === null
}
// @from(Ln 106083, Col 0)
function dK() {
    if (T$8()) return N$8();
    if (!MV()) return null;
    let A = a4();
    if (!A) return null;
    return A.subscriptionType ?? null
}
// @from(Ln 106091, Col 0)
function Sn() {
    if (!MV()) return null;
    let A = a4();
    if (!A) return null;
    return A.rateLimitTier ?? null
}
// @from(Ln 106098, Col 0)
function S1A() {
    switch (dK()) {
        case "enterprise":
            return "Claude Enterprise";
        case "team":
            return "Claude Team";
        case "max":
            return "Claude Max";
        case "pro":
            return "Claude Pro";
        default:
            return "Claude API"
    }
}
// @from(Ln 106113, Col 0)
function cC() {
    return !!(J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY))
}
// @from(Ln 106117, Col 0)
function zi8() {
    return (C8() || {}).otelHeadersHelper
}
// @from(Ln 106121, Col 0)
function d95() {
    let A = zi8();
    if (!A) return !1;
    let q = y7("projectSettings"),
        K = y7("localSettings");
    return q?.otelHeadersHelper === A || K?.otelHeadersHelper === A
}
// @from(Ln 106129, Col 0)
function wi8() {
    let A = zi8();
    if (!A) return {};
    let q = parseInt(process.env.CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS || c95.toString());
    if (l86 && Date.now() - nl8 < q) return l86;
    if (d95()) {
        if (!$H(!0)) return {}
    }
    try {
        let K = Qf(A, {
            timeout: 30000
        })?.toString().trim();
        if (!K) throw Error("otelHeadersHelper did not return a valid value");
        let Y = _A(K);
        if (typeof Y !== "object" || Y === null || Array.isArray(Y)) throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
        for (let [z, w] of Object.entries(Y))
            if (typeof w !== "string") throw Error(`otelHeadersHelper returned non-string value for key "${z}": ${typeof w}`);
        return l86 = Y, nl8 = Date.now(), l86
    } catch (K) {
        throw K1(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${K instanceof Error?K.message:String(K)}`)), K
    }
}
// @from(Ln 106152, Col 0)
function l95(A) {
    return A === "max" || A === "pro"
}
// @from(Ln 106156, Col 0)
function jR1() {
    let A = dK();
    return i8() && A !== null && l95(A)
}
// @from(Ln 106161, Col 0)
function r86() {
    if (E4() !== "firstParty") return;
    let {
        source: q
    } = Cn(), K = {};
    if (q === "CLAUDE_CODE_OAUTH_TOKEN" || q === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR") K.tokenSource = q;
    else if (i8()) K.subscription = S1A();
    else K.tokenSource = q;
    let {
        key: Y,
        source: z
    } = yO();
    if (Y) K.apiKeySource = z;
    if (q === "claude.ai" || z === "/login managed key") {
        let H = u3()?.organizationName;
        if (H) K.organization = H
    }
    let w = u3()?.emailAddress;
    if ((q === "claude.ai" || z === "/login managed key") && w) K.email = w;
    return K
}
// @from(Ln 106182, Col 4)
rl8
// @from(Ln 106182, Col 9)
u95 = 300000
// @from(Ln 106183, Col 4)
JR1
// @from(Ln 106183, Col 9)
m95 = 3600000
// @from(Ln 106184, Col 4)
T81
// @from(Ln 106184, Col 9)
XR1
// @from(Ln 106184, Col 14)
a4
// @from(Ln 106184, Col 18)
OR1 = null
// @from(Ln 106185, Col 4)
l86 = null
// @from(Ln 106186, Col 4)
nl8 = 0
// @from(Ln 106187, Col 4)
c95 = 1740000
// @from(Ln 106188, Col 4)
J7 = v(() => {
    cA();
    p8();
    tq();
    Bf();
    zq();
    Rw1();
    y6();
    Z6();
    q3();
    ns1();
    X$8();
    Pk();
    gF6();
    Wk();
    _8();
    hA();
    Uv1();
    B6();
    zn6();
    u6();
    UH();
    c86();
    $R1();
    m6();
    rl8 = o(NQ(), 1);
    JR1 = aI6((A) => {
        let q = _R1();
        if (!q) return null;
        if (al8()) {
            if (!$H(!0) && !A) {
                let Y = Error(`Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.FEEDBACK_CHANNEL}.`);
                Yk("apiKeyHelper invoked before trust check", Y), c("tengu_apiKeyHelper_missing_trust11", {})
            }
        }
        try {
            let K = Qf(q)?.toString().trim();
            if (!K) throw Error("apiKeyHelper did not return a valid value");
            return K
        } catch (K) {
            let Y = H6.red("Error getting API key from apiKeyHelper (in settings or ~/.claude.json):");
            if (K instanceof Error && "stderr" in K) console.error(Y, String(K.stderr));
            else if (K instanceof Error) console.error(Y, K.message);
            else console.error(Y, K);
            return " "
        }
    }, B95());
    T81 = aI6(async () => {
        let A = await F95(),
            q = await g95();
        if (A || q) await jR8();
        return q
    }, m95);
    XR1 = KA(() => {
        if (process.platform === "darwin") {
            let q = xQ();
            try {
                let K = Qf(`security find-generic-password -a $USER -w -s "${q}"`);
                if (K) return {
                    key: K,
                    source: "/login managed key"
                }
            } catch (K) {
                K1(K)
            }
        }
        let A = f6();
        if (!A.primaryApiKey) return null;
        return {
            key: A.primaryApiKey,
            source: "/login managed key"
        }
    });
    a4 = KA(() => {
        if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
            accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
        let A = rs1();
        if (A) return {
            accessToken: A,
            refreshToken: null,
            expiresAt: null,
            scopes: ["user:inference"],
            subscriptionType: null,
            rateLimitTier: null
        };
        try {
            let Y = T0().read()?.claudeAiOauth;
            if (!Y?.accessToken) return null;
            return Y
        } catch (q) {
            return K1(q), null
        }
    })
})
// @from(Ln 106292, Col 0)
function h1A() {
    return kO1
}
// @from(Ln 106296, Col 0)
function LO1(A) {
    kO1 = A
}
// @from(Ln 106300, Col 0)
function MR1() {
    return i95(O8(), n95)
}
// @from(Ln 106304, Col 0)
function ob() {
    if (E4() !== "firstParty") return !1;
    if (!OH1()) return !1;
    try {
        let {
            key: q
        } = yO({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return !0
    } catch {}
    let A = a4();
    if (!A?.accessToken) return !1;
    if (!A.scopes?.includes(Fx)) return !1;
    if (A.subscriptionType !== "enterprise" && A.subscriptionType !== "team") return !1;
    return !0
}
// @from(Ln 106322, Col 0)
function I1A() {
    try {
        let A = MR1(),
            q = $J(A),
            K = j9(q, !1);
        if (!K || typeof K !== "object" || Array.isArray(K)) return null;
        return K
    } catch {
        return null
    }
}
// @from(Ln 106334, Col 0)
function o86() {
    if (!ob()) return null;
    if (kO1) return kO1;
    let A = I1A();
    if (A) return kO1 = A, A;
    return null
}
// @from(Ln 106342, Col 0)
function Hi8() {
    kO1 = null
}
// @from(Ln 106345, Col 4)
n95 = "remote-settings.json"
// @from(Ln 106346, Col 4)
kO1 = null
// @from(Ln 106347, Col 4)
x1A = v(() => {
    hA();
    UH();
    J7();
    Uz();
    wq();
    AH()
})
// @from(Ln 106364, Col 0)
function _i8() {
    if (eA() !== "windows") return !1;
    if ($i8("C:\\Program Files\\ClaudeCode")) return !1;
    return $i8("C:\\ProgramData\\ClaudeCode\\managed-settings.json")
}
// @from(Ln 106370, Col 0)
function Ji8() {
    return WR1(df(), "managed-settings.json")
}
// @from(Ln 106374, Col 0)
function Xi8(A, q) {
    if (typeof A === "object" && A && "code" in A && A.code === "ENOENT") h(`Broken symlink or missing file encountered for settings.json at path: ${q}`);
    else K1(A instanceof Error ? A : Error(String(A)))
}
// @from(Ln 106379, Col 0)
function a86(A) {
    let q = b1();
    if (!q.existsSync(A)) return {
        settings: null,
        errors: []
    };
    try {
        let {
            resolvedPath: K
        } = QH(q, A), Y = $J(K);
        if (Y.trim() === "") return {
            settings: {},
            errors: []
        };
        let z = j9(Y, !1),
            w = Dk.safeParse(z);
        if (!w.success) return {
            settings: null,
            errors: Bs1(w.error, A)
        };
        return {
            settings: w.data,
            errors: []
        }
    } catch (K) {
        return Xi8(K, A), {
            settings: null,
            errors: []
        }
    }
}
// @from(Ln 106411, Col 0)
function RO1(A) {
    switch (A) {
        case "userSettings":
            return PR1(O8());
        case "policySettings":
        case "projectSettings":
        case "localSettings":
            return PR1(y8());
        case "flagSettings": {
            let q = Il();
            return q ? Oi8(PR1(q)) : PR1(y8())
        }
    }
}
// @from(Ln 106426, Col 0)
function r95() {
    if (JN1() || J6(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS)) return "cowork_settings.json";
    return "settings.json"
}
// @from(Ln 106431, Col 0)
function Vw(A) {
    switch (A) {
        case "userSettings":
            return WR1(RO1(A), r95());
        case "projectSettings":
        case "localSettings":
            return WR1(RO1(A), yO1(A));
        case "policySettings":
            return Ji8();
        case "flagSettings":
            return Il()
    }
}
// @from(Ln 106445, Col 0)
function yO1(A) {
    switch (A) {
        case "projectSettings":
            return WR1(".claude", "settings.json");
        case "localSettings":
            return WR1(".claude", "settings.local.json")
    }
}
// @from(Ln 106454, Col 0)
function y7(A) {
    if (A === "policySettings") {
        let Y = o86();
        if (Y && Object.keys(Y).length > 0) return Y
    }
    let q = Vw(A);
    if (!q) return null;
    let {
        settings: K
    } = a86(q);
    return K
}
// @from(Ln 106467, Col 0)
function Di8() {
    let A = o86();
    if (A && Object.keys(A).length > 0) return "remote";
    let q = Ji8(),
        {
            settings: K
        } = a86(q);
    if (K && Object.keys(K).length > 0) return "local";
    return null
}
// @from(Ln 106478, Col 0)
function Z7(A, q) {
    if (A === "policySettings" || A === "flagSettings") return {
        error: null
    };
    let K = Vw(A);
    if (!K) return {
        error: null
    };
    try {
        let Y = Oi8(K);
        if (!b1().existsSync(Y)) b1().mkdirSync(Y);
        let z = y7(A);
        if (!z && b1().existsSync(K)) {
            let H = $J(K),
                $ = j9(H);
            if ($ === null) return {
                error: Error(`Invalid JSON syntax in settings file at ${K}`)
            };
            if ($ && typeof $ === "object") z = $, h(`Using raw settings from ${K} due to validation failure`)
        }
        let w = kN1(z || {}, q, (H, $, O, _) => {
            if ($ === void 0 && _ && typeof O === "string") {
                delete _[O];
                return
            }
            if (Array.isArray($)) return $;
            return
        });
        if (zX.markInternalWrite(A), ek(K, Q1(w, null, 2) + `
`), GO(), A === "localSettings") JF6(yO1("localSettings"), y8())
    } catch (Y) {
        let z = Error(`Failed to read raw settings from ${K}: ${Y}`);
        return K1(z), {
            error: z
        }
    }
    return {
        error: null
    }
}
// @from(Ln 106519, Col 0)
function o95(A, q) {
    let K = [...A, ...q];
    return Array.from(new Set(K))
}
// @from(Ln 106524, Col 0)
function b1A(A, q) {
    if (Array.isArray(A) && Array.isArray(q)) return o95(A, q);
    return
}
// @from(Ln 106529, Col 0)
function ji8(A) {
    let q = Dk.strip().parse(A),
        K = ["permissions", "sandbox", "hooks"],
        Y = [],
        z = {
            permissions: new Set(["allow", "deny", "ask", "defaultMode", "disableBypassPermissionsMode", "additionalDirectories"]),
            sandbox: new Set(["network", "ignoreViolations", "excludedCommands", "autoAllowBashIfSandboxed", "enableWeakerNestedSandbox"]),
            hooks: new Set(["PreToolUse", "PostToolUse", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStop", "PreCompact", "TeammateIdle", "TaskCompleted"])
        };
    for (let w of Object.keys(q))
        if (K.includes(w) && q[w] && typeof q[w] === "object") {
            let H = q[w],
                $ = z[w];
            if ($) {
                for (let O of Object.keys(H))
                    if ($.has(O)) Y.push(`${w}.${O}`)
            }
        } else Y.push(w);
    return Y.sort()
}
// @from(Ln 106550, Col 0)
function a95() {
    if (u1A) return {
        settings: {},
        errors: []
    };
    let A = Date.now();
    H8("info", "settings_load_started"), u1A = !0;
    try {
        let q = {},
            K = [],
            Y = new Set,
            z = new Set;
        for (let w of Ei()) {
            if (w === "policySettings") {
                let J = o86();
                if (J && Object.keys(J).length > 0) {
                    let X = Dk.safeParse(J);
                    if (X.success) q = kN1(q, X.data, b1A);
                    else {
                        let D = Bs1(X.error, "remote managed settings");
                        for (let j of D) {
                            let M = `${j.file}:${j.path}:${j.message}`;
                            if (!Y.has(M)) Y.add(M), K.push(j)
                        }
                    }
                } else {
                    let X = Vw(w);
                    if (X) {
                        let {
                            settings: D,
                            errors: j
                        } = a86(X);
                        for (let M of j) {
                            let P = `${M.file}:${M.path}:${M.message}`;
                            if (!Y.has(P)) Y.add(P), K.push(M)
                        }
                        if (D) q = kN1(q, D, b1A)
                    }
                }
                continue
            }
            let H = Vw(w);
            if (!H) continue;
            let $ = PR1(H);
            if (z.has($)) continue;
            z.add($);
            let {
                settings: O,
                errors: _
            } = a86(H);
            for (let J of _) {
                let X = `${J.file}:${J.path}:${J.message}`;
                if (!Y.has(X)) Y.add(X), K.push(J)
            }
            if (O) q = kN1(q, O, b1A)
        }
        return H8("info", "settings_load_completed", {
            duration_ms: Date.now() - A,
            source_count: z.size,
            error_count: K.length
        }), {
            settings: q,
            errors: K
        }
    } finally {
        u1A = !1
    }
}
// @from(Ln 106619, Col 0)
function l4() {
    let {
        settings: A
    } = E81();
    return A || {}
}
// @from(Ln 106626, Col 0)
function E81() {
    let A = FcA();
    if (A !== null) return A;
    let q = a95();
    return QcA(q), q
}
// @from(Ln 106633, Col 0)
function Mi8(A) {
    for (let q of Ei()) {
        if (q === "policySettings") continue;
        let K = Vw(q);
        if (!K) continue;
        try {
            let {
                resolvedPath: Y
            } = QH(b1(), K), z = $J(Y);
            if (!z.trim()) continue;
            let w = j9(z, !1);
            if (w && typeof w === "object" && A in w) return !0
        } catch (Y) {
            Xi8(Y, K)
        }
    }
    return !1
}
// @from(Ln 106651, Col 4)
u1A = !1
// @from(Ln 106652, Col 4)
C8
// @from(Ln 106653, Col 4)
p8 = v(() => {
    hnA();
    wq();
    _8();
    AH();
    y6();
    Z6();
    f0();
    x3();
    E$();
    hQ();
    B6();
    XF6();
    hA();
    PF6();
    $A1();
    IQ();
    x1A();
    m6();
    C8 = l4
})
// @from(Ln 106674, Col 4)
kY = R((wY5) => {
    var B1A = Symbol.for("yaml.alias"),
        Pi8 = Symbol.for("yaml.document"),
        s86 = Symbol.for("yaml.map"),
        Wi8 = Symbol.for("yaml.pair"),
        m1A = Symbol.for("yaml.scalar"),
        t86 = Symbol.for("yaml.seq"),
        Eg = Symbol.for("yaml.node.type"),
        t95 = (A) => !!A && typeof A === "object" && A[Eg] === B1A,
        e95 = (A) => !!A && typeof A === "object" && A[Eg] === Pi8,
        AY5 = (A) => !!A && typeof A === "object" && A[Eg] === s86,
        qY5 = (A) => !!A && typeof A === "object" && A[Eg] === Wi8,
        Gi8 = (A) => !!A && typeof A === "object" && A[Eg] === m1A,
        KY5 = (A) => !!A && typeof A === "object" && A[Eg] === t86;

    function Zi8(A) {
        if (A && typeof A === "object") switch (A[Eg]) {
            case s86:
            case t86:
                return !0
        }
        return !1
    }

    function YY5(A) {
        if (A && typeof A === "object") switch (A[Eg]) {
            case B1A:
            case s86:
            case m1A:
            case t86:
                return !0
        }
        return !1
    }
    var zY5 = (A) => (Gi8(A) || Zi8(A)) && !!A.anchor;
    wY5.ALIAS = B1A;
    wY5.DOC = Pi8;
    wY5.MAP = s86;
    wY5.NODE_TYPE = Eg;
    wY5.PAIR = Wi8;
    wY5.SCALAR = m1A;
    wY5.SEQ = t86;
    wY5.hasAnchor = zY5;
    wY5.isAlias = t95;
    wY5.isCollection = Zi8;
    wY5.isDocument = e95;
    wY5.isMap = AY5;
    wY5.isNode = YY5;
    wY5.isPair = qY5;
    wY5.isScalar = Gi8;
    wY5.isSeq = KY5
})
// @from(Ln 106726, Col 4)
GR1 = R((TY5) => {
    var RD = kY(),
        PV = Symbol("break visit"),
        fi8 = Symbol("skip children"),
        ab = Symbol("remove node");

    function e86(A, q) {
        let K = Vi8(q);
        if (RD.isDocument(A)) {
            if (CO1(null, A.contents, K, Object.freeze([A])) === ab) A.contents = null
        } else CO1(null, A, K, Object.freeze([]))
    }
    e86.BREAK = PV;
    e86.SKIP = fi8;
    e86.REMOVE = ab;

    function CO1(A, q, K, Y) {
        let z = Ni8(A, q, K, Y);
        if (RD.isNode(z) || RD.isPair(z)) return Ti8(A, Y, z), CO1(A, z, K, Y);
        if (typeof z !== "symbol") {
            if (RD.isCollection(q)) {
                Y = Object.freeze(Y.concat(q));
                for (let w = 0; w < q.items.length; ++w) {
                    let H = CO1(w, q.items[w], K, Y);
                    if (typeof H === "number") w = H - 1;
                    else if (H === PV) return PV;
                    else if (H === ab) q.items.splice(w, 1), w -= 1
                }
            } else if (RD.isPair(q)) {
                Y = Object.freeze(Y.concat(q));
                let w = CO1("key", q.key, K, Y);
                if (w === PV) return PV;
                else if (w === ab) q.key = null;
                let H = CO1("value", q.value, K, Y);
                if (H === PV) return PV;
                else if (H === ab) q.value = null
            }
        }
        return z
    }
    async function A76(A, q) {
        let K = Vi8(q);
        if (RD.isDocument(A)) {
            if (await SO1(null, A.contents, K, Object.freeze([A])) === ab) A.contents = null
        } else await SO1(null, A, K, Object.freeze([]))
    }
    A76.BREAK = PV;
    A76.SKIP = fi8;
    A76.REMOVE = ab;
    async function SO1(A, q, K, Y) {
        let z = await Ni8(A, q, K, Y);
        if (RD.isNode(z) || RD.isPair(z)) return Ti8(A, Y, z), SO1(A, z, K, Y);
        if (typeof z !== "symbol") {
            if (RD.isCollection(q)) {
                Y = Object.freeze(Y.concat(q));
                for (let w = 0; w < q.items.length; ++w) {
                    let H = await SO1(w, q.items[w], K, Y);
                    if (typeof H === "number") w = H - 1;
                    else if (H === PV) return PV;
                    else if (H === ab) q.items.splice(w, 1), w -= 1
                }
            } else if (RD.isPair(q)) {
                Y = Object.freeze(Y.concat(q));
                let w = await SO1("key", q.key, K, Y);
                if (w === PV) return PV;
                else if (w === ab) q.key = null;
                let H = await SO1("value", q.value, K, Y);
                if (H === PV) return PV;
                else if (H === ab) q.value = null
            }
        }
        return z
    }

    function Vi8(A) {
        if (typeof A === "object" && (A.Collection || A.Node || A.Value)) return Object.assign({
            Alias: A.Node,
            Map: A.Node,
            Scalar: A.Node,
            Seq: A.Node
        }, A.Value && {
            Map: A.Value,
            Scalar: A.Value,
            Seq: A.Value
        }, A.Collection && {
            Map: A.Collection,
            Seq: A.Collection
        }, A);
        return A
    }

    function Ni8(A, q, K, Y) {
        if (typeof K === "function") return K(A, q, Y);
        if (RD.isMap(q)) return K.Map?.(A, q, Y);
        if (RD.isSeq(q)) return K.Seq?.(A, q, Y);
        if (RD.isPair(q)) return K.Pair?.(A, q, Y);
        if (RD.isScalar(q)) return K.Scalar?.(A, q, Y);
        if (RD.isAlias(q)) return K.Alias?.(A, q, Y);
        return
    }

    function Ti8(A, q, K) {
        let Y = q[q.length - 1];
        if (RD.isCollection(Y)) Y.items[A] = K;
        else if (RD.isPair(Y))
            if (A === "key") Y.key = K;
            else Y.value = K;
        else if (RD.isDocument(Y)) Y.contents = K;
        else {
            let z = RD.isAlias(Y) ? "alias" : "scalar";
            throw Error(`Cannot replace node with ${z} parent`)
        }
    }
    TY5.visit = e86;
    TY5.visitAsync = A76
})
// @from(Ln 106842, Col 4)
F1A = R((yY5) => {
    var vi8 = kY(),
        kY5 = GR1(),
        LY5 = {
            "!": "%21",
            ",": "%2C",
            "[": "%5B",
            "]": "%5D",
            "{": "%7B",
            "}": "%7D"
        },
        RY5 = (A) => A.replace(/[!,[\]{}]/g, (q) => LY5[q]);
    class AL {
        constructor(A, q) {
            this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, AL.defaultYaml, A), this.tags = Object.assign({}, AL.defaultTags, q)
        }
        clone() {
            let A = new AL(this.yaml, this.tags);
            return A.docStart = this.docStart, A
        }
        atDocument() {
            let A = new AL(this.yaml, this.tags);
            switch (this.yaml.version) {
                case "1.1":
                    this.atNextDocument = !0;
                    break;
                case "1.2":
                    this.atNextDocument = !1, this.yaml = {
                        explicit: AL.defaultYaml.explicit,
                        version: "1.2"
                    }, this.tags = Object.assign({}, AL.defaultTags);
                    break
            }
            return A
        }
        add(A, q) {
            if (this.atNextDocument) this.yaml = {
                explicit: AL.defaultYaml.explicit,
                version: "1.1"
            }, this.tags = Object.assign({}, AL.defaultTags), this.atNextDocument = !1;
            let K = A.trim().split(/[ \t]+/),
                Y = K.shift();
            switch (Y) {
                case "%TAG": {
                    if (K.length !== 2) {
                        if (q(0, "%TAG directive should contain exactly two parts"), K.length < 2) return !1
                    }
                    let [z, w] = K;
                    return this.tags[z] = w, !0
                }
                case "%YAML": {
                    if (this.yaml.explicit = !0, K.length !== 1) return q(0, "%YAML directive should contain exactly one part"), !1;
                    let [z] = K;
                    if (z === "1.1" || z === "1.2") return this.yaml.version = z, !0;
                    else {
                        let w = /^\d+\.\d+$/.test(z);
                        return q(6, `Unsupported YAML version ${z}`, w), !1
                    }
                }
                default:
                    return q(0, `Unknown directive ${Y}`, !0), !1
            }
        }
        tagName(A, q) {
            if (A === "!") return "!";
            if (A[0] !== "!") return q(`Not a valid tag: ${A}`), null;
            if (A[1] === "<") {
                let w = A.slice(2, -1);
                if (w === "!" || w === "!!") return q(`Verbatim tags aren't resolved, so ${A} is invalid.`), null;
                if (A[A.length - 1] !== ">") q("Verbatim tags must end with a >");
                return w
            }
            let [, K, Y] = A.match(/^(.*!)([^!]*)$/s);
            if (!Y) q(`The ${A} tag has no suffix`);
            let z = this.tags[K];
            if (z) try {
                return z + decodeURIComponent(Y)
            } catch (w) {
                return q(String(w)), null
            }
            if (K === "!") return A;
            return q(`Could not resolve tag: ${A}`), null
        }
        tagString(A) {
            for (let [q, K] of Object.entries(this.tags))
                if (A.startsWith(K)) return q + RY5(A.substring(K.length));
            return A[0] === "!" ? A : `!<${A}>`
        }
        toString(A) {
            let q = this.yaml.explicit ? [`%YAML ${this.yaml.version||"1.2"}`] : [],
                K = Object.entries(this.tags),
                Y;
            if (A && K.length > 0 && vi8.isNode(A.contents)) {
                let z = {};
                kY5.visit(A.contents, (w, H) => {
                    if (vi8.isNode(H) && H.tag) z[H.tag] = !0
                }), Y = Object.keys(z)
            } else Y = [];
            for (let [z, w] of K) {
                if (z === "!!" && w === "tag:yaml.org,2002:") continue;
                if (!A || Y.some((H) => H.startsWith(w))) q.push(`%TAG ${z} ${w}`)
            }
            return q.join(`
`)
        }
    }
    AL.defaultYaml = {
        explicit: !1,
        version: "1.2"
    };
    AL.defaultTags = {
        "!!": "tag:yaml.org,2002:"
    };
    yY5.Directives = AL
})
// @from(Ln 106957, Col 4)
q76 = R((xY5) => {
    var Ei8 = kY(),
        SY5 = GR1();

    function hY5(A) {
        if (/[\x00-\x19\s,[\]{}]/.test(A)) {
            let K = `Anchor must not contain whitespace or control characters: ${JSON.stringify(A)}`;
            throw Error(K)
        }
        return !0
    }

    function ki8(A) {
        let q = new Set;
        return SY5.visit(A, {
            Value(K, Y) {
                if (Y.anchor) q.add(Y.anchor)
            }
        }), q
    }

    function Li8(A, q) {
        for (let K = 1;; ++K) {
            let Y = `${A}${K}`;
            if (!q.has(Y)) return Y
        }
    }

    function IY5(A, q) {
        let K = [],
            Y = new Map,
            z = null;
        return {
            onAnchor: (w) => {
                K.push(w), z ?? (z = ki8(A));
                let H = Li8(q, z);
                return z.add(H), H
            },
            setAnchors: () => {
                for (let w of K) {
                    let H = Y.get(w);
                    if (typeof H === "object" && H.anchor && (Ei8.isScalar(H.node) || Ei8.isCollection(H.node))) H.node.anchor = H.anchor;
                    else {
                        let $ = Error("Failed to resolve repeated object (this should not happen)");
                        throw $.source = w, $
                    }
                }
            },
            sourceObjects: Y
        }
    }
    xY5.anchorIsValid = hY5;
    xY5.anchorNames = ki8;
    xY5.createNodeAnchors = IY5;
    xY5.findNewAnchor = Li8
})
// @from(Ln 107013, Col 4)
Q1A = R((FY5) => {
    function ZR1(A, q, K, Y) {
        if (Y && typeof Y === "object")
            if (Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; ++z) {
                    let H = Y[z],
                        $ = ZR1(A, Y, String(z), H);
                    if ($ === void 0) delete Y[z];
                    else if ($ !== H) Y[z] = $
                } else if (Y instanceof Map)
                    for (let z of Array.from(Y.keys())) {
                        let w = Y.get(z),
                            H = ZR1(A, Y, z, w);
                        if (H === void 0) Y.delete(z);
                        else if (H !== w) Y.set(z, H)
                    } else if (Y instanceof Set)
                        for (let z of Array.from(Y)) {
                            let w = ZR1(A, Y, z, z);
                            if (w === void 0) Y.delete(z);
                            else if (w !== z) Y.delete(z), Y.add(w)
                        } else
                            for (let [z, w] of Object.entries(Y)) {
                                let H = ZR1(A, Y, z, w);
                                if (H === void 0) delete Y[z];
                                else if (H !== w) Y[z] = H
                            }
        return A.call(q, K, Y)
    }
    FY5.applyReviver = ZR1
})
// @from(Ln 107043, Col 4)
hn = R((UY5) => {
    var gY5 = kY();

    function Ri8(A, q, K) {
        if (Array.isArray(A)) return A.map((Y, z) => Ri8(Y, String(z), K));
        if (A && typeof A.toJSON === "function") {
            if (!K || !gY5.hasAnchor(A)) return A.toJSON(q, K);
            let Y = {
                aliasCount: 0,
                count: 1,
                res: void 0
            };
            K.anchors.set(A, Y), K.onCreate = (w) => {
                Y.res = w, delete K.onCreate
            };
            let z = A.toJSON(q, K);
            if (K.onCreate) K.onCreate(z);
            return z
        }
        if (typeof A === "bigint" && !K?.keep) return Number(A);
        return A
    }
    UY5.toJS = Ri8
})
// @from(Ln 107067, Col 4)
K76 = R((lY5) => {
    var dY5 = Q1A(),
        yi8 = kY(),
        cY5 = hn();
    class Ci8 {
        constructor(A) {
            Object.defineProperty(this, yi8.NODE_TYPE, {
                value: A
            })
        }
        clone() {
            let A = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            if (this.range) A.range = this.range.slice();
            return A
        }
        toJS(A, {
            mapAsMap: q,
            maxAliasCount: K,
            onAnchor: Y,
            reviver: z
        } = {}) {
            if (!yi8.isDocument(A)) throw TypeError("A document argument is required");
            let w = {
                    anchors: new Map,
                    doc: A,
                    keep: !0,
                    mapAsMap: q === !0,
                    mapKeyWarned: !1,
                    maxAliasCount: typeof K === "number" ? K : 100
                },
                H = cY5.toJS(this, "", w);
            if (typeof Y === "function")
                for (let {
                        count: $,
                        res: O
                    }
                    of w.anchors.values()) Y(O, $);
            return typeof z === "function" ? dY5.applyReviver(z, {
                "": H
            }, "", H) : H
        }
    }
    lY5.NodeBase = Ci8
})
// @from(Ln 107111, Col 4)
fR1 = R((sY5) => {
    var nY5 = q76(),
        rY5 = GR1(),
        hO1 = kY(),
        oY5 = K76(),
        aY5 = hn();
    class Si8 extends oY5.NodeBase {
        constructor(A) {
            super(hO1.ALIAS);
            this.source = A, Object.defineProperty(this, "tag", {
                set() {
                    throw Error("Alias nodes cannot have tags")
                }
            })
        }
        resolve(A, q) {
            let K;
            if (q?.aliasResolveCache) K = q.aliasResolveCache;
            else if (K = [], rY5.visit(A, {
                    Node: (z, w) => {
                        if (hO1.isAlias(w) || hO1.hasAnchor(w)) K.push(w)
                    }
                }), q) q.aliasResolveCache = K;
            let Y = void 0;
            for (let z of K) {
                if (z === this) break;
                if (z.anchor === this.source) Y = z
            }
            return Y
        }
        toJSON(A, q) {
            if (!q) return {
                source: this.source
            };
            let {
                anchors: K,
                doc: Y,
                maxAliasCount: z
            } = q, w = this.resolve(Y, q);
            if (!w) {
                let $ = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw ReferenceError($)
            }
            let H = K.get(w);
            if (!H) aY5.toJS(w, null, q), H = K.get(w);
            if (!H || H.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
            if (z >= 0) {
                if (H.count += 1, H.aliasCount === 0) H.aliasCount = Y76(Y, w, K);
                if (H.count * H.aliasCount > z) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack")
            }
            return H.res
        }
        toString(A, q, K) {
            let Y = `*${this.source}`;
            if (A) {
                if (nY5.anchorIsValid(this.source), A.options.verifyAliasOrder && !A.anchors.has(this.source)) {
                    let z = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                    throw Error(z)
                }
                if (A.implicitKey) return `${Y} `
            }
            return Y
        }
    }

    function Y76(A, q, K) {
        if (hO1.isAlias(q)) {
            let Y = q.resolve(A),
                z = K && Y && K.get(Y);
            return z ? z.count * z.aliasCount : 0
        } else if (hO1.isCollection(q)) {
            let Y = 0;
            for (let z of q.items) {
                let w = Y76(A, z, K);
                if (w > Y) Y = w
            }
            return Y
        } else if (hO1.isPair(q)) {
            let Y = Y76(A, q.key, K),
                z = Y76(A, q.value, K);
            return Math.max(Y, z)
        }
        return 1
    }
    sY5.Alias = Si8
})
// @from(Ln 107197, Col 4)
MX = R((Yz5) => {
    var eY5 = kY(),
        Az5 = K76(),
        qz5 = hn(),
        Kz5 = (A) => !A || typeof A !== "function" && typeof A !== "object";
    class k81 extends Az5.NodeBase {
        constructor(A) {
            super(eY5.SCALAR);
            this.value = A
        }
        toJSON(A, q) {
            return q?.keep ? this.value : qz5.toJS(this.value, A, q)
        }
        toString() {
            return String(this.value)
        }
    }
    k81.BLOCK_FOLDED = "BLOCK_FOLDED";
    k81.BLOCK_LITERAL = "BLOCK_LITERAL";
    k81.PLAIN = "PLAIN";
    k81.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    k81.QUOTE_SINGLE = "QUOTE_SINGLE";
    Yz5.Scalar = k81;
    Yz5.isScalarValue = Kz5
})
// @from(Ln 107222, Col 4)
VR1 = R((Jz5) => {
    var Hz5 = fR1(),
        L81 = kY(),
        hi8 = MX(),
        $z5 = "tag:yaml.org,2002:";

    function Oz5(A, q, K) {
        if (q) {
            let Y = K.filter((w) => w.tag === q),
                z = Y.find((w) => !w.format) ?? Y[0];
            if (!z) throw Error(`Tag ${q} not found`);
            return z
        }
        return K.find((Y) => Y.identify?.(A) && !Y.format)
    }

    function _z5(A, q, K) {
        if (L81.isDocument(A)) A = A.contents;
        if (L81.isNode(A)) return A;
        if (L81.isPair(A)) {
            let X = K.schema[L81.MAP].createNode?.(K.schema, null, K);
            return X.items.push(A), X
        }
        if (A instanceof String || A instanceof Number || A instanceof Boolean || typeof BigInt < "u" && A instanceof BigInt) A = A.valueOf();
        let {
            aliasDuplicateObjects: Y,
            onAnchor: z,
            onTagObj: w,
            schema: H,
            sourceObjects: $
        } = K, O = void 0;
        if (Y && A && typeof A === "object")
            if (O = $.get(A), O) return O.anchor ?? (O.anchor = z(A)), new Hz5.Alias(O.anchor);
            else O = {
                anchor: null,
                node: null
            }, $.set(A, O);
        if (q?.startsWith("!!")) q = $z5 + q.slice(2);
        let _ = Oz5(A, q, H.tags);
        if (!_) {
            if (A && typeof A.toJSON === "function") A = A.toJSON();
            if (!A || typeof A !== "object") {
                let X = new hi8.Scalar(A);
                if (O) O.node = X;
                return X
            }
            _ = A instanceof Map ? H[L81.MAP] : (Symbol.iterator in Object(A)) ? H[L81.SEQ] : H[L81.MAP]
        }
        if (w) w(_), delete K.onTagObj;
        let J = _?.createNode ? _.createNode(K.schema, A, K) : typeof _?.nodeClass?.from === "function" ? _.nodeClass.from(K.schema, A, K) : new hi8.Scalar(A);
        if (q) J.tag = q;
        else if (!_.default) J.tag = _.tag;
        if (O) O.node = J;
        return J
    }
    Jz5.createNode = _z5
})
// @from(Ln 107279, Col 4)
z76 = R((Mz5) => {
    var Dz5 = VR1(),
        sb = kY(),
        jz5 = K76();

    function g1A(A, q, K) {
        let Y = K;
        for (let z = q.length - 1; z >= 0; --z) {
            let w = q[z];
            if (typeof w === "number" && Number.isInteger(w) && w >= 0) {
                let H = [];
                H[w] = Y, Y = H
            } else Y = new Map([
                [w, Y]
            ])
        }
        return Dz5.createNode(Y, void 0, {
            aliasDuplicateObjects: !1,
            keepUndefined: !1,
            onAnchor: () => {
                throw Error("This should not happen, please report a bug.")
            },
            schema: A,
            sourceObjects: new Map
        })
    }
    var Ii8 = (A) => A == null || typeof A === "object" && !!A[Symbol.iterator]().next().done;
    class xi8 extends jz5.NodeBase {
        constructor(A, q) {
            super(A);
            Object.defineProperty(this, "schema", {
                value: q,
                configurable: !0,
                enumerable: !1,
                writable: !0
            })
        }
        clone(A) {
            let q = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            if (A) q.schema = A;
            if (q.items = q.items.map((K) => sb.isNode(K) || sb.isPair(K) ? K.clone(A) : K), this.range) q.range = this.range.slice();
            return q
        }
        addIn(A, q) {
            if (Ii8(A)) this.add(q);
            else {
                let [K, ...Y] = A, z = this.get(K, !0);
                if (sb.isCollection(z)) z.addIn(Y, q);
                else if (z === void 0 && this.schema) this.set(K, g1A(this.schema, Y, q));
                else throw Error(`Expected YAML collection at ${K}. Remaining path: ${Y}`)
            }
        }
        deleteIn(A) {
            let [q, ...K] = A;
            if (K.length === 0) return this.delete(q);
            let Y = this.get(q, !0);
            if (sb.isCollection(Y)) return Y.deleteIn(K);
            else throw Error(`Expected YAML collection at ${q}. Remaining path: ${K}`)
        }
        getIn(A, q) {
            let [K, ...Y] = A, z = this.get(K, !0);
            if (Y.length === 0) return !q && sb.isScalar(z) ? z.value : z;
            else return sb.isCollection(z) ? z.getIn(Y, q) : void 0
        }
        hasAllNullValues(A) {
            return this.items.every((q) => {
                if (!sb.isPair(q)) return !1;
                let K = q.value;
                return K == null || A && sb.isScalar(K) && K.value == null && !K.commentBefore && !K.comment && !K.tag
            })
        }
        hasIn(A) {
            let [q, ...K] = A;
            if (K.length === 0) return this.has(q);
            let Y = this.get(q, !0);
            return sb.isCollection(Y) ? Y.hasIn(K) : !1
        }
        setIn(A, q) {
            let [K, ...Y] = A;
            if (Y.length === 0) this.set(K, q);
            else {
                let z = this.get(K, !0);
                if (sb.isCollection(z)) z.setIn(Y, q);
                else if (z === void 0 && this.schema) this.set(K, g1A(this.schema, Y, q));
                else throw Error(`Expected YAML collection at ${K}. Remaining path: ${Y}`)
            }
        }
    }
    Mz5.Collection = xi8;
    Mz5.collectionFromPath = g1A;
    Mz5.isEmptyPath = Ii8
})
// @from(Ln 107371, Col 4)
NR1 = R((Vz5) => {
    var Zz5 = (A) => A.replace(/^(?!$)(?: $)?/gm, "#");

    function U1A(A, q) {
        if (/^\n+$/.test(A)) return A.substring(1);
        return q ? A.replace(/^(?! *$)/gm, q) : A
    }
    var fz5 = (A, q, K) => A.endsWith(`
`) ? U1A(K, q) : K.includes(`
`) ? `
` + U1A(K, q) : (A.endsWith(" ") ? "" : " ") + K;
    Vz5.indentComment = U1A;
    Vz5.lineComment = fz5;
    Vz5.stringifyComment = Zz5
})
// @from(Ln 107386, Col 4)
ui8 = R((kz5) => {
    function Ez5(A, q, K = "flow", {
        indentAtStart: Y,
        lineWidth: z = 80,
        minContentWidth: w = 20,
        onFold: H,
        onOverflow: $
    } = {}) {
        if (!z || z < 0) return A;
        if (z < w) w = 0;
        let O = Math.max(1 + w, 1 + z - q.length);
        if (A.length <= O) return A;
        let _ = [],
            J = {},
            X = z - q.length;
        if (typeof Y === "number")
            if (Y > z - Math.max(2, w)) _.push(0);
            else X = z - Y;
        let D = void 0,
            j = void 0,
            M = !1,
            P = -1,
            W = -1,
            G = -1;
        if (K === "block") {
            if (P = bi8(A, P, q.length), P !== -1) X = P + O
        }
        for (let Z; Z = A[P += 1];) {
            if (K === "quoted" && Z === "\\") {
                switch (W = P, A[P + 1]) {
                    case "x":
                        P += 3;
                        break;
                    case "u":
                        P += 5;
                        break;
                    case "U":
                        P += 9;
                        break;
                    default:
                        P += 1
                }
                G = P
            }
            if (Z === `
`) {
                if (K === "block") P = bi8(A, P, q.length);
                X = P + q.length + O, D = void 0
            } else {
                if (Z === " " && j && j !== " " && j !== `
` && j !== "\t") {
                    let N = A[P + 1];
                    if (N && N !== " " && N !== `
` && N !== "\t") D = P
                }
                if (P >= X)
                    if (D) _.push(D), X = D + O, D = void 0;
                    else if (K === "quoted") {
                    while (j === " " || j === "\t") j = Z, Z = A[P += 1], M = !0;
                    let N = P > G + 1 ? P - 2 : W - 1;
                    if (J[N]) return A;
                    _.push(N), J[N] = !0, X = N + O, D = void 0
                } else M = !0
            }
            j = Z
        }
        if (M && $) $();
        if (_.length === 0) return A;
        if (H) H();
        let f = A.slice(0, _[0]);
        for (let Z = 0; Z < _.length; ++Z) {
            let N = _[Z],
                T = _[Z + 1] || A.length;
            if (N === 0) f = `
${q}${A.slice(0,T)}`;
            else {
                if (K === "quoted" && J[N]) f += `${A[N]}\\`;
                f += `
${q}${A.slice(N+1,T)}`
            }
        }
        return f
    }

    function bi8(A, q, K) {
        let Y = q,
            z = q + 1,
            w = A[z];
        while (w === " " || w === "\t")
            if (q < z + K) w = A[++q];
            else {
                do w = A[++q]; while (w && w !== `
`);
                Y = q, z = q + 1, w = A[z]
            } return Y
    }
    kz5.FOLD_BLOCK = "block";
    kz5.FOLD_FLOW = "flow";
    kz5.FOLD_QUOTED = "quoted";
    kz5.foldFlowLines = Ez5
})
// @from(Ln 107487, Col 4)
vR1 = R((xz5) => {
    var lC = MX(),
        In = ui8(),
        H76 = (A, q) => ({
            indentAtStart: q ? A.indent.length : A.indentAtStart,
            lineWidth: A.options.lineWidth,
            minContentWidth: A.options.minContentWidth
        }),
        $76 = (A) => /^(%|---|\.\.\.)/m.test(A);

    function Sz5(A, q, K) {
        if (!q || q < 0) return !1;
        let Y = q - K,
            z = A.length;
        if (z <= Y) return !1;
        for (let w = 0, H = 0; w < z; ++w)
            if (A[w] === `
`) {
                if (w - H > Y) return !0;
                if (H = w + 1, z - H <= Y) return !1
            } return !0
    }

    function TR1(A, q) {
        let K = JSON.stringify(A);
        if (q.options.doubleQuotedAsJSON) return K;
        let {
            implicitKey: Y
        } = q, z = q.options.doubleQuotedMinMultiLineLength, w = q.indent || ($76(A) ? "  " : ""), H = "", $ = 0;
        for (let O = 0, _ = K[O]; _; _ = K[++O]) {
            if (_ === " " && K[O + 1] === "\\" && K[O + 2] === "n") H += K.slice($, O) + "\\ ", O += 1, $ = O, _ = "\\";
            if (_ === "\\") switch (K[O + 1]) {
                case "u": {
                    H += K.slice($, O);
                    let J = K.substr(O + 2, 4);
                    switch (J) {
                        case "0000":
                            H += "\\0";
                            break;
                        case "0007":
                            H += "\\a";
                            break;
                        case "000b":
                            H += "\\v";
                            break;
                        case "001b":
                            H += "\\e";
                            break;
                        case "0085":
                            H += "\\N";
                            break;
                        case "00a0":
                            H += "\\_";
                            break;
                        case "2028":
                            H += "\\L";
                            break;
                        case "2029":
                            H += "\\P";
                            break;
                        default:
                            if (J.substr(0, 2) === "00") H += "\\x" + J.substr(2);
                            else H += K.substr(O, 6)
                    }
                    O += 5, $ = O + 1
                }
                break;
                case "n":
                    if (Y || K[O + 2] === '"' || K.length < z) O += 1;
                    else {
                        H += K.slice($, O) + `

`;
                        while (K[O + 2] === "\\" && K[O + 3] === "n" && K[O + 4] !== '"') H += `
`, O += 2;
                        if (H += w, K[O + 2] === " ") H += "\\";
                        O += 1, $ = O + 1
                    }
                    break;
                default:
                    O += 1
            }
        }
        return H = $ ? H + K.slice($) : K, Y ? H : In.foldFlowLines(H, w, In.FOLD_QUOTED, H76(q, !1))
    }

    function p1A(A, q) {
        if (q.options.singleQuote === !1 || q.implicitKey && A.includes(`
`) || /[ \t]\n|\n[ \t]/.test(A)) return TR1(A, q);
        let K = q.indent || ($76(A) ? "  " : ""),
            Y = "'" + A.replace(/'/g, "''").replace(/\n+/g, `$&
${K}`) + "'";
        return q.implicitKey ? Y : In.foldFlowLines(Y, K, In.FOLD_FLOW, H76(q, !1))
    }

    function IO1(A, q) {
        let {
            singleQuote: K
        } = q.options, Y;
        if (K === !1) Y = TR1;
        else {
            let z = A.includes('"'),
                w = A.includes("'");
            if (z && !w) Y = p1A;
            else if (w && !z) Y = TR1;
            else Y = K ? p1A : TR1
        }
        return Y(A, q)
    }
    var d1A;
    try {
        d1A = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g")
    } catch {
        d1A = /\n+(?!\n|$)/g
    }

    function w76({
        comment: A,
        type: q,
        value: K
    }, Y, z, w) {
        let {
            blockQuote: H,
            commentString: $,
            lineWidth: O
        } = Y.options;
        if (!H || /\n[\t ]+$/.test(K)) return IO1(K, Y);
        let _ = Y.indent || (Y.forceBlockIndent || $76(K) ? "  " : ""),
            J = H === "literal" ? !0 : H === "folded" || q === lC.Scalar.BLOCK_FOLDED ? !1 : q === lC.Scalar.BLOCK_LITERAL ? !0 : !Sz5(K, O, _.length);
        if (!K) return J ? `|
` : `>
`;
        let X, D;
        for (D = K.length; D > 0; --D) {
            let T = K[D - 1];
            if (T !== `
` && T !== "\t" && T !== " ") break
        }
        let j = K.substring(D),
            M = j.indexOf(`
`);
        if (M === -1) X = "-";
        else if (K === j || M !== j.length - 1) {
            if (X = "+", w) w()
        } else X = "";
        if (j) {
            if (K = K.slice(0, -j.length), j[j.length - 1] === `
`) j = j.slice(0, -1);
            j = j.replace(d1A, `$&${_}`)
        }
        let P = !1,
            W, G = -1;
        for (W = 0; W < K.length; ++W) {
            let T = K[W];
            if (T === " ") P = !0;
            else if (T === `
`) G = W;
            else break
        }
        let f = K.substring(0, G < W ? G + 1 : W);
        if (f) K = K.substring(f.length), f = f.replace(/\n+/g, `$&${_}`);
        let N = (P ? _ ? "2" : "1" : "") + X;
        if (A) {
            if (N += " " + $(A.replace(/ ?[\r\n]+/g, " ")), z) z()
        }
        if (!J) {
            let T = K.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${_}`),
                k = !1,
                y = H76(Y, !0);
            if (H !== "folded" && q !== lC.Scalar.BLOCK_FOLDED) y.onOverflow = () => {
                k = !0
            };
            let B = In.foldFlowLines(`${f}${T}${j}`, _, In.FOLD_BLOCK, y);
            if (!k) return `>${N}
${_}${B}`
        }
        return K = K.replace(/\n+/g, `$&${_}`), `|${N}
${_}${f}${K}${j}`
    }

    function hz5(A, q, K, Y) {
        let {
            type: z,
            value: w
        } = A, {
            actualString: H,
            implicitKey: $,
            indent: O,
            indentStep: _,
            inFlow: J
        } = q;
        if ($ && w.includes(`
`) || J && /[[\]{},]/.test(w)) return IO1(w, q);
        if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(w)) return $ || J || !w.includes(`
`) ? IO1(w, q) : w76(A, q, K, Y);
        if (!$ && !J && z !== lC.Scalar.PLAIN && w.includes(`
`)) return w76(A, q, K, Y);
        if ($76(w)) {
            if (O === "") return q.forceBlockIndent = !0, w76(A, q, K, Y);
            else if ($ && O === _) return IO1(w, q)
        }
        let X = w.replace(/\n+/g, `$&
${O}`);
        if (H) {
            let D = (P) => P.default && P.tag !== "tag:yaml.org,2002:str" && P.test?.test(X),
                {
                    compat: j,
                    tags: M
                } = q.doc.schema;
            if (M.some(D) || j?.some(D)) return IO1(w, q)
        }
        return $ ? X : In.foldFlowLines(X, O, In.FOLD_FLOW, H76(q, !1))
    }

    function Iz5(A, q, K, Y) {
        let {
            implicitKey: z,
            inFlow: w
        } = q, H = typeof A.value === "string" ? A : Object.assign({}, A, {
            value: String(A.value)
        }), {
            type: $
        } = A;
        if ($ !== lC.Scalar.QUOTE_DOUBLE) {
            if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(H.value)) $ = lC.Scalar.QUOTE_DOUBLE
        }
        let O = (J) => {
                switch (J) {
                    case lC.Scalar.BLOCK_FOLDED:
                    case lC.Scalar.BLOCK_LITERAL:
                        return z || w ? IO1(H.value, q) : w76(H, q, K, Y);
                    case lC.Scalar.QUOTE_DOUBLE:
                        return TR1(H.value, q);
                    case lC.Scalar.QUOTE_SINGLE:
                        return p1A(H.value, q);
                    case lC.Scalar.PLAIN:
                        return hz5(H, q, K, Y);
                    default:
                        return null
                }
            },
            _ = O($);
        if (_ === null) {
            let {
                defaultKeyType: J,
                defaultStringType: X
            } = q.options, D = z && J || X;
            if (_ = O(D), _ === null) throw Error(`Unsupported default string type ${D}`)
        }
        return _
    }
    xz5.stringifyString = Iz5
})
// @from(Ln 107744, Col 4)
ER1 = R((pz5) => {
    var uz5 = q76(),
        xn = kY(),
        Bz5 = NR1(),
        mz5 = vR1();

    function Fz5(A, q) {
        let K = Object.assign({
                blockQuote: !0,
                commentString: Bz5.stringifyComment,
                defaultKeyType: null,
                defaultStringType: "PLAIN",
                directives: null,
                doubleQuotedAsJSON: !1,
                doubleQuotedMinMultiLineLength: 40,
                falseStr: "false",
                flowCollectionPadding: !0,
                indentSeq: !0,
                lineWidth: 80,
                minContentWidth: 20,
                nullStr: "null",
                simpleKeys: !1,
                singleQuote: null,
                trueStr: "true",
                verifyAliasOrder: !0
            }, A.schema.toStringOptions, q),
            Y;
        switch (K.collectionStyle) {
            case "block":
                Y = !1;
                break;
            case "flow":
                Y = !0;
                break;
            default:
                Y = null
        }
        return {
            anchors: new Set,
            doc: A,
            flowCollectionPadding: K.flowCollectionPadding ? " " : "",
            indent: "",
            indentStep: typeof K.indent === "number" ? " ".repeat(K.indent) : "  ",
            inFlow: Y,
            options: K
        }
    }

    function Qz5(A, q) {
        if (q.tag) {
            let z = A.filter((w) => w.tag === q.tag);
            if (z.length > 0) return z.find((w) => w.format === q.format) ?? z[0]
        }
        let K = void 0,
            Y;
        if (xn.isScalar(q)) {
            Y = q.value;
            let z = A.filter((w) => w.identify?.(Y));
            if (z.length > 1) {
                let w = z.filter((H) => H.test);
                if (w.length > 0) z = w
            }
            K = z.find((w) => w.format === q.format) ?? z.find((w) => !w.format)
        } else Y = q, K = A.find((z) => z.nodeClass && Y instanceof z.nodeClass);
        if (!K) {
            let z = Y?.constructor?.name ?? (Y === null ? "null" : typeof Y);
            throw Error(`Tag not resolved for ${z} value`)
        }
        return K
    }

    function gz5(A, q, {
        anchors: K,
        doc: Y
    }) {
        if (!Y.directives) return "";
        let z = [],
            w = (xn.isScalar(A) || xn.isCollection(A)) && A.anchor;
        if (w && uz5.anchorIsValid(w)) K.add(w), z.push(`&${w}`);
        let H = A.tag ?? (q.default ? null : q.tag);
        if (H) z.push(Y.directives.tagString(H));
        return z.join(" ")
    }

    function Uz5(A, q, K, Y) {
        if (xn.isPair(A)) return A.toString(q, K, Y);
        if (xn.isAlias(A)) {
            if (q.doc.directives) return A.toString(q);
            if (q.resolvedAliases?.has(A)) throw TypeError("Cannot stringify circular structure without alias nodes");
            else {
                if (q.resolvedAliases) q.resolvedAliases.add(A);
                else q.resolvedAliases = new Set([A]);
                A = A.resolve(q.doc)
            }
        }
        let z = void 0,
            w = xn.isNode(A) ? A : q.doc.createNode(A, {
                onTagObj: (O) => z = O
            });
        z ?? (z = Qz5(q.doc.schema.tags, w));
        let H = gz5(w, z, q);
        if (H.length > 0) q.indentAtStart = (q.indentAtStart ?? 0) + H.length + 1;
        let $ = typeof z.stringify === "function" ? z.stringify(w, q, K, Y) : xn.isScalar(w) ? mz5.stringifyString(w, q, K, Y) : w.toString(q, K, Y);
        if (!H) return $;
        return xn.isScalar(w) || $[0] === "{" || $[0] === "[" ? `${H} ${$}` : `${H}
${q.indent}${$}`
    }
    pz5.createStringifyContext = Fz5;
    pz5.stringify = Uz5
})
// @from(Ln 107854, Col 4)
Fi8 = R((iz5) => {
    var kg = kY(),
        Bi8 = MX(),
        mi8 = ER1(),
        kR1 = NR1();

    function lz5({
        key: A,
        value: q
    }, K, Y, z) {
        let {
            allNullValues: w,
            doc: H,
            indent: $,
            indentStep: O,
            options: {
                commentString: _,
                indentSeq: J,
                simpleKeys: X
            }
        } = K, D = kg.isNode(A) && A.comment || null;
        if (X) {
            if (D) throw Error("With simple keys, key nodes cannot have comments");
            if (kg.isCollection(A) || !kg.isNode(A) && typeof A === "object") throw Error("With simple keys, collection cannot be used as a key value")
        }
        let j = !X && (!A || D && q == null && !K.inFlow || kg.isCollection(A) || (kg.isScalar(A) ? A.type === Bi8.Scalar.BLOCK_FOLDED || A.type === Bi8.Scalar.BLOCK_LITERAL : typeof A === "object"));
        K = Object.assign({}, K, {
            allNullValues: !1,
            implicitKey: !j && (X || !w),
            indent: $ + O
        });
        let M = !1,
            P = !1,
            W = mi8.stringify(A, K, () => M = !0, () => P = !0);
        if (!j && !K.inFlow && W.length > 1024) {
            if (X) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
            j = !0
        }
        if (K.inFlow) {
            if (w || q == null) {
                if (M && Y) Y();
                return W === "" ? "?" : j ? `? ${W}` : W
            }
        } else if (w && !X || q == null && j) {
            if (W = `? ${W}`, D && !M) W += kR1.lineComment(W, K.indent, _(D));
            else if (P && z) z();
            return W
        }
        if (M) D = null;
        if (j) {
            if (D) W += kR1.lineComment(W, K.indent, _(D));
            W = `? ${W}
${$}:`
        } else if (W = `${W}:`, D) W += kR1.lineComment(W, K.indent, _(D));
        let G, f, Z;
        if (kg.isNode(q)) G = !!q.spaceBefore, f = q.commentBefore, Z = q.comment;
        else if (G = !1, f = null, Z = null, q && typeof q === "object") q = H.createNode(q);
        if (K.implicitKey = !1, !j && !D && kg.isScalar(q)) K.indentAtStart = W.length + 1;
        if (P = !1, !J && O.length >= 2 && !K.inFlow && !j && kg.isSeq(q) && !q.flow && !q.tag && !q.anchor) K.indent = K.indent.substring(2);
        let N = !1,
            T = mi8.stringify(q, K, () => N = !0, () => P = !0),
            k = " ";
        if (D || G || f) {
            if (k = G ? `
` : "", f) {
                let y = _(f);
                k += `
${kR1.indentComment(y,K.indent)}`
            }
            if (T === "" && !K.inFlow) {
                if (k === `
`) k = `

`
            } else k += `
${K.indent}`
        } else if (!j && kg.isCollection(q)) {
            let y = T[0],
                B = T.indexOf(`
`),
                S = B !== -1,
                m = K.inFlow ?? q.flow ?? q.items.length === 0;
            if (S || !m) {
                let b = !1;
                if (S && (y === "&" || y === "!")) {
                    let g = T.indexOf(" ");
                    if (y === "&" && g !== -1 && g < B && T[g + 1] === "!") g = T.indexOf(" ", g + 1);
                    if (g === -1 || B < g) b = !0
                }
                if (!b) k = `
${K.indent}`
            }
        } else if (T === "" || T[0] === `
`) k = "";
        if (W += k + T, K.inFlow) {
            if (N && Y) Y()
        } else if (Z && !N) W += kR1.lineComment(W, K.indent, _(Z));
        else if (P && z) z();
        return W
    }
    iz5.stringifyPair = lz5
})
// @from(Ln 107956, Col 4)
c1A = R((az5) => {
    var Qi8 = h1("process");

    function rz5(A, ...q) {
        if (A === "debug") console.log(...q)
    }

    function oz5(A, q) {
        if (A === "debug" || A === "warn")
            if (typeof Qi8.emitWarning === "function") Qi8.emitWarning(q);
            else console.warn(q)
    }
    az5.debug = rz5;
    az5.warn = oz5
})
// @from(Ln 107971, Col 4)
J76 = R((A25) => {
    var LR1 = kY(),
        gi8 = MX(),
        O76 = "<<",
        _76 = {
            identify: (A) => A === O76 || typeof A === "symbol" && A.description === O76,
            default: "key",
            tag: "tag:yaml.org,2002:merge",
            test: /^<<$/,
            resolve: () => Object.assign(new gi8.Scalar(Symbol(O76)), {
                addToJSMap: Ui8
            }),
            stringify: () => O76
        },
        ez5 = (A, q) => (_76.identify(q) || LR1.isScalar(q) && (!q.type || q.type === gi8.Scalar.PLAIN) && _76.identify(q.value)) && A?.doc.schema.tags.some((K) => K.tag === _76.tag && K.default);

    function Ui8(A, q, K) {
        if (K = A && LR1.isAlias(K) ? K.resolve(A.doc) : K, LR1.isSeq(K))
            for (let Y of K.items) l1A(A, q, Y);
        else if (Array.isArray(K))
            for (let Y of K) l1A(A, q, Y);
        else l1A(A, q, K)
    }

    function l1A(A, q, K) {
        let Y = A && LR1.isAlias(K) ? K.resolve(A.doc) : K;
        if (!LR1.isMap(Y)) throw Error("Merge sources must be maps or map aliases");
        let z = Y.toJSON(null, A, Map);
        for (let [w, H] of z)
            if (q instanceof Map) {
                if (!q.has(w)) q.set(w, H)
            } else if (q instanceof Set) q.add(w);
        else if (!Object.prototype.hasOwnProperty.call(q, w)) Object.defineProperty(q, w, {
            value: H,
            writable: !0,
            enumerable: !0,
            configurable: !0
        });
        return q
    }
    A25.addMergeToJSMap = Ui8;
    A25.isMergeKey = ez5;
    A25.merge = _76
})
// @from(Ln 108015, Col 4)
n1A = R((O25) => {
    var z25 = c1A(),
        pi8 = J76(),
        w25 = ER1(),
        di8 = kY(),
        i1A = hn();

    function H25(A, q, {
        key: K,
        value: Y
    }) {
        if (di8.isNode(K) && K.addToJSMap) K.addToJSMap(A, q, Y);
        else if (pi8.isMergeKey(A, K)) pi8.addMergeToJSMap(A, q, Y);
        else {
            let z = i1A.toJS(K, "", A);
            if (q instanceof Map) q.set(z, i1A.toJS(Y, z, A));
            else if (q instanceof Set) q.add(z);
            else {
                let w = $25(K, z, A),
                    H = i1A.toJS(Y, w, A);
                if (w in q) Object.defineProperty(q, w, {
                    value: H,
                    writable: !0,
                    enumerable: !0,
                    configurable: !0
                });
                else q[w] = H
            }
        }
        return q
    }

    function $25(A, q, K) {
        if (q === null) return "";
        if (typeof q !== "object") return String(q);
        if (di8.isNode(A) && K?.doc) {
            let Y = w25.createStringifyContext(K.doc, {});
            Y.anchors = new Set;
            for (let w of K.anchors.keys()) Y.anchors.add(w.anchor);
            Y.inFlow = !0, Y.inStringifyKey = !0;
            let z = A.toString(Y);
            if (!K.mapKeyWarned) {
                let w = JSON.stringify(z);
                if (w.length > 40) w = w.substring(0, 36) + '..."';
                z25.warn(K.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${w}. Set mapAsMap: true to use object keys.`), K.mapKeyWarned = !0
            }
            return z
        }
        return JSON.stringify(q)
    }
    O25.addPairToJSMap = H25
})
// @from(Ln 108067, Col 4)
bn = R((j25) => {
    var ci8 = VR1(),
        J25 = Fi8(),
        X25 = n1A(),
        X76 = kY();

    function D25(A, q, K) {
        let Y = ci8.createNode(A, void 0, K),
            z = ci8.createNode(q, void 0, K);
        return new D76(Y, z)
    }
    class D76 {
        constructor(A, q = null) {
            Object.defineProperty(this, X76.NODE_TYPE, {
                value: X76.PAIR
            }), this.key = A, this.value = q
        }
        clone(A) {
            let {
                key: q,
                value: K
            } = this;
            if (X76.isNode(q)) q = q.clone(A);
            if (X76.isNode(K)) K = K.clone(A);
            return new D76(q, K)
        }
        toJSON(A, q) {
            let K = q?.mapAsMap ? new Map : {};
            return X25.addPairToJSMap(q, K, this)
        }
        toString(A, q, K) {
            return A?.doc ? J25.stringifyPair(this, A, q, K) : JSON.stringify(this)
        }
    }
    j25.Pair = D76;
    j25.createPair = D25
})
// @from(Ln 108104, Col 4)
r1A = R((f25) => {
    var R81 = kY(),
        li8 = ER1(),
        j76 = NR1();

    function W25(A, q, K) {
        return (q.inFlow ?? A.flow ? Z25 : G25)(A, q, K)
    }

    function G25({
        comment: A,
        items: q
    }, K, {
        blockItemPrefix: Y,
        flowChars: z,
        itemIndent: w,
        onChompKeep: H,
        onComment: $
    }) {
        let {
            indent: O,
            options: {
                commentString: _
            }
        } = K, J = Object.assign({}, K, {
            indent: w,
            type: null
        }), X = !1, D = [];
        for (let M = 0; M < q.length; ++M) {
            let P = q[M],
                W = null;
            if (R81.isNode(P)) {
                if (!X && P.spaceBefore) D.push("");
                if (M76(K, D, P.commentBefore, X), P.comment) W = P.comment
            } else if (R81.isPair(P)) {
                let f = R81.isNode(P.key) ? P.key : null;
                if (f) {
                    if (!X && f.spaceBefore) D.push("");
                    M76(K, D, f.commentBefore, X)
                }
            }
            X = !1;
            let G = li8.stringify(P, J, () => W = null, () => X = !0);
            if (W) G += j76.lineComment(G, w, _(W));
            if (X && W) X = !1;
            D.push(Y + G)
        }
        let j;
        if (D.length === 0) j = z.start + z.end;
        else {
            j = D[0];
            for (let M = 1; M < D.length; ++M) {
                let P = D[M];
                j += P ? `
${O}${P}` : `
`
            }
        }
        if (A) {
            if (j += `
` + j76.indentComment(_(A), O), $) $()
        } else if (X && H) H();
        return j
    }

    function Z25({
        items: A
    }, q, {
        flowChars: K,
        itemIndent: Y
    }) {
        let {
            indent: z,
            indentStep: w,
            flowCollectionPadding: H,
            options: {
                commentString: $
            }
        } = q;
        Y += w;
        let O = Object.assign({}, q, {
                indent: Y,
                inFlow: !0,
                type: null
            }),
            _ = !1,
            J = 0,
            X = [];
        for (let M = 0; M < A.length; ++M) {
            let P = A[M],
                W = null;
            if (R81.isNode(P)) {
                if (P.spaceBefore) X.push("");
                if (M76(q, X, P.commentBefore, !1), P.comment) W = P.comment
            } else if (R81.isPair(P)) {
                let f = R81.isNode(P.key) ? P.key : null;
                if (f) {
                    if (f.spaceBefore) X.push("");
                    if (M76(q, X, f.commentBefore, !1), f.comment) _ = !0
                }
                let Z = R81.isNode(P.value) ? P.value : null;
                if (Z) {
                    if (Z.comment) W = Z.comment;
                    if (Z.commentBefore) _ = !0
                } else if (P.value == null && f?.comment) W = f.comment
            }
            if (W) _ = !0;
            let G = li8.stringify(P, O, () => W = null);
            if (M < A.length - 1) G += ",";
            if (W) G += j76.lineComment(G, Y, $(W));
            if (!_ && (X.length > J || G.includes(`
`))) _ = !0;
            X.push(G), J = X.length
        }
        let {
            start: D,
            end: j
        } = K;
        if (X.length === 0) return D + j;
        else {
            if (!_) {
                let M = X.reduce((P, W) => P + W.length + 2, 2);
                _ = q.options.lineWidth > 0 && M > q.options.lineWidth
            }
            if (_) {
                let M = D;
                for (let P of X) M += P ? `
${w}${z}${P}` : `
`;
                return `${M}
${z}${j}`
            } else return `${D}${H}${X.join(" ")}${H}${j}`
        }
    }

    function M76({
        indent: A,
        options: {
            commentString: q
        }
    }, K, Y, z) {
        if (Y && z) Y = Y.replace(/^\n+/, "");
        if (Y) {
            let w = j76.indentComment(q(Y), A);
            K.push(w.trimStart())
        }
    }
    f25.stringifyCollection = W25
})
// @from(Ln 108253, Col 4)
Bn = R((k25) => {
    var N25 = r1A(),
        T25 = n1A(),
        v25 = z76(),
        un = kY(),
        P76 = bn(),
        E25 = MX();

    function RR1(A, q) {
        let K = un.isScalar(q) ? q.value : q;
        for (let Y of A)
            if (un.isPair(Y)) {
                if (Y.key === q || Y.key === K) return Y;
                if (un.isScalar(Y.key) && Y.key.value === K) return Y
            } return
    }
    class ii8 extends v25.Collection {
        static get tagName() {
            return "tag:yaml.org,2002:map"
        }
        constructor(A) {
            super(un.MAP, A);
            this.items = []
        }
        static from(A, q, K) {
            let {
                keepUndefined: Y,
                replacer: z
            } = K, w = new this(A), H = ($, O) => {
                if (typeof z === "function") O = z.call(q, $, O);
                else if (Array.isArray(z) && !z.includes($)) return;
                if (O !== void 0 || Y) w.items.push(P76.createPair($, O, K))
            };
            if (q instanceof Map)
                for (let [$, O] of q) H($, O);
            else if (q && typeof q === "object")
                for (let $ of Object.keys(q)) H($, q[$]);
            if (typeof A.sortMapEntries === "function") w.items.sort(A.sortMapEntries);
            return w
        }
        add(A, q) {
            let K;
            if (un.isPair(A)) K = A;
            else if (!A || typeof A !== "object" || !("key" in A)) K = new P76.Pair(A, A?.value);
            else K = new P76.Pair(A.key, A.value);
            let Y = RR1(this.items, K.key),
                z = this.schema?.sortMapEntries;
            if (Y) {
                if (!q) throw Error(`Key ${K.key} already set`);
                if (un.isScalar(Y.value) && E25.isScalarValue(K.value)) Y.value.value = K.value;
                else Y.value = K.value
            } else if (z) {
                let w = this.items.findIndex((H) => z(K, H) < 0);
                if (w === -1) this.items.push(K);
                else this.items.splice(w, 0, K)
            } else this.items.push(K)
        }
        delete(A) {
            let q = RR1(this.items, A);
            if (!q) return !1;
            return this.items.splice(this.items.indexOf(q), 1).length > 0
        }
        get(A, q) {
            let Y = RR1(this.items, A)?.value;
            return (!q && un.isScalar(Y) ? Y.value : Y) ?? void 0
        }
        has(A) {
            return !!RR1(this.items, A)
        }
        set(A, q) {
            this.add(new P76.Pair(A, q), !0)
        }
        toJSON(A, q, K) {
            let Y = K ? new K : q?.mapAsMap ? new Map : {};
            if (q?.onCreate) q.onCreate(Y);
            for (let z of this.items) T25.addPairToJSMap(q, Y, z);
            return Y
        }
        toString(A, q, K) {
            if (!A) return JSON.stringify(this);
            for (let Y of this.items)
                if (!un.isPair(Y)) throw Error(`Map items must all be pairs; found ${JSON.stringify(Y)} instead`);
            if (!A.allNullValues && this.hasAllNullValues(!1)) A = Object.assign({}, A, {
                allNullValues: !0
            });
            return N25.stringifyCollection(this, A, {
                blockItemPrefix: "",
                flowChars: {
                    start: "{",
                    end: "}"
                },
                itemIndent: A.indent || "",
                onChompKeep: K,
                onComment: q
            })
        }
    }
    k25.YAMLMap = ii8;
    k25.findPair = RR1
})
// @from(Ln 108353, Col 4)
xO1 = R((S25) => {
    var y25 = kY(),
        ni8 = Bn(),
        C25 = {
            collection: "map",
            default: !0,
            nodeClass: ni8.YAMLMap,
            tag: "tag:yaml.org,2002:map",
            resolve(A, q) {
                if (!y25.isMap(A)) q("Expected a mapping for this tag");
                return A
            },
            createNode: (A, q, K) => ni8.YAMLMap.from(A, q, K)
        };
    S25.map = C25
})
// @from(Ln 108369, Col 4)
mn = R((m25) => {
    var I25 = VR1(),
        x25 = r1A(),
        b25 = z76(),
        G76 = kY(),
        u25 = MX(),
        B25 = hn();
    class ri8 extends b25.Collection {
        static get tagName() {
            return "tag:yaml.org,2002:seq"
        }
        constructor(A) {
            super(G76.SEQ, A);
            this.items = []
        }
        add(A) {
            this.items.push(A)
        }
        delete(A) {
            let q = W76(A);
            if (typeof q !== "number") return !1;
            return this.items.splice(q, 1).length > 0
        }
        get(A, q) {
            let K = W76(A);
            if (typeof K !== "number") return;
            let Y = this.items[K];
            return !q && G76.isScalar(Y) ? Y.value : Y
        }
        has(A) {
            let q = W76(A);
            return typeof q === "number" && q < this.items.length
        }
        set(A, q) {
            let K = W76(A);
            if (typeof K !== "number") throw Error(`Expected a valid index, not ${A}.`);
            let Y = this.items[K];
            if (G76.isScalar(Y) && u25.isScalarValue(q)) Y.value = q;
            else this.items[K] = q
        }
        toJSON(A, q) {
            let K = [];
            if (q?.onCreate) q.onCreate(K);
            let Y = 0;
            for (let z of this.items) K.push(B25.toJS(z, String(Y++), q));
            return K
        }
        toString(A, q, K) {
            if (!A) return JSON.stringify(this);
            return x25.stringifyCollection(this, A, {
                blockItemPrefix: "- ",
                flowChars: {
                    start: "[",
                    end: "]"
                },
                itemIndent: (A.indent || "") + "  ",
                onChompKeep: K,
                onComment: q
            })
        }
        static from(A, q, K) {
            let {
                replacer: Y
            } = K, z = new this(A);
            if (q && Symbol.iterator in Object(q)) {
                let w = 0;
                for (let H of q) {
                    if (typeof Y === "function") {
                        let $ = q instanceof Set ? H : String(w++);
                        H = Y.call(q, $, H)
                    }
                    z.items.push(I25.createNode(H, void 0, K))
                }
            }
            return z
        }
    }

    function W76(A) {
        let q = G76.isScalar(A) ? A.value : A;
        if (q && typeof q === "string") q = Number(q);
        return typeof q === "number" && Number.isInteger(q) && q >= 0 ? q : null
    }
    m25.YAMLSeq = ri8
})
// @from(Ln 108454, Col 4)
bO1 = R((U25) => {
    var Q25 = kY(),
        oi8 = mn(),
        g25 = {
            collection: "seq",
            default: !0,
            nodeClass: oi8.YAMLSeq,
            tag: "tag:yaml.org,2002:seq",
            resolve(A, q) {
                if (!Q25.isSeq(A)) q("Expected a sequence for this tag");
                return A
            },
            createNode: (A, q, K) => oi8.YAMLSeq.from(A, q, K)
        };
    U25.seq = g25
})
// @from(Ln 108470, Col 4)
yR1 = R((l25) => {
    var d25 = vR1(),
        c25 = {
            identify: (A) => typeof A === "string",
            default: !0,
            tag: "tag:yaml.org,2002:str",
            resolve: (A) => A,
            stringify(A, q, K, Y) {
                return q = Object.assign({
                    actualString: !0
                }, q), d25.stringifyString(A, q, K, Y)
            }
        };
    l25.string = c25
})
// @from(Ln 108485, Col 4)
Z76 = R((n25) => {
    var ai8 = MX(),
        si8 = {
            identify: (A) => A == null,
            createNode: () => new ai8.Scalar(null),
            default: !0,
            tag: "tag:yaml.org,2002:null",
            test: /^(?:~|[Nn]ull|NULL)?$/,
            resolve: () => new ai8.Scalar(null),
            stringify: ({
                source: A
            }, q) => typeof A === "string" && si8.test.test(A) ? A : q.options.nullStr
        };
    n25.nullTag = si8
})
// @from(Ln 108500, Col 4)
o1A = R((a25) => {
    var o25 = MX(),
        ti8 = {
            identify: (A) => typeof A === "boolean",
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
            resolve: (A) => new o25.Scalar(A[0] === "t" || A[0] === "T"),
            stringify({
                source: A,
                value: q
            }, K) {
                if (A && ti8.test.test(A)) {
                    let Y = A[0] === "t" || A[0] === "T";
                    if (q === Y) return A
                }
                return q ? K.options.trueStr : K.options.falseStr
            }
        };
    a25.boolTag = ti8
})
// @from(Ln 108521, Col 4)
uO1 = R((e25) => {
    function t25({
        format: A,
        minFractionDigits: q,
        tag: K,
        value: Y
    }) {
        if (typeof Y === "bigint") return String(Y);
        let z = typeof Y === "number" ? Y : Number(Y);
        if (!isFinite(z)) return isNaN(z) ? ".nan" : z < 0 ? "-.inf" : ".inf";
        let w = JSON.stringify(Y);
        if (!A && q && (!K || K === "tag:yaml.org,2002:float") && /^\d/.test(w)) {
            let H = w.indexOf(".");
            if (H < 0) H = w.length, w += ".";
            let $ = q - (w.length - H - 1);
            while ($-- > 0) w += "0"
        }
        return w
    }
    e25.stringifyNumber = t25
})
// @from(Ln 108542, Col 4)
s1A = R((ww5) => {
    var qw5 = MX(),
        a1A = uO1(),
        Kw5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
            resolve: (A) => A.slice(-3).toLowerCase() === "nan" ? NaN : A[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            stringify: a1A.stringifyNumber
        },
        Yw5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "EXP",
            test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
            resolve: (A) => parseFloat(A),
            stringify(A) {
                let q = Number(A.value);
                return isFinite(q) ? q.toExponential() : a1A.stringifyNumber(A)
            }
        },
        zw5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
            resolve(A) {
                let q = new qw5.Scalar(parseFloat(A)),
                    K = A.indexOf(".");
                if (K !== -1 && A[A.length - 1] === "0") q.minFractionDigits = A.length - K - 1;
                return q
            },
            stringify: a1A.stringifyNumber
        };
    ww5.float = zw5;
    ww5.floatExp = Yw5;
    ww5.floatNaN = Kw5
})
// @from(Ln 108582, Col 4)
e1A = R((Dw5) => {
    var ei8 = uO1(),
        f76 = (A) => typeof A === "bigint" || Number.isInteger(A),
        t1A = (A, q, K, {
            intAsBigInt: Y
        }) => Y ? BigInt(A) : parseInt(A.substring(q), K);

    function An8(A, q, K) {
        let {
            value: Y
        } = A;
        if (f76(Y) && Y >= 0) return K + Y.toString(q);
        return ei8.stringifyNumber(A)
    }
    var _w5 = {
            identify: (A) => f76(A) && A >= 0,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "OCT",
            test: /^0o[0-7]+$/,
            resolve: (A, q, K) => t1A(A, 2, 8, K),
            stringify: (A) => An8(A, 8, "0o")
        },
        Jw5 = {
            identify: f76,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^[-+]?[0-9]+$/,
            resolve: (A, q, K) => t1A(A, 0, 10, K),
            stringify: ei8.stringifyNumber
        },
        Xw5 = {
            identify: (A) => f76(A) && A >= 0,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "HEX",
            test: /^0x[0-9a-fA-F]+$/,
            resolve: (A, q, K) => t1A(A, 2, 16, K),
            stringify: (A) => An8(A, 16, "0x")
        };
    Dw5.int = Jw5;
    Dw5.intHex = Xw5;
    Dw5.intOct = _w5
})
// @from(Ln 108626, Col 4)
qn8 = R((Tw5) => {
    var Ww5 = xO1(),
        Gw5 = Z76(),
        Zw5 = bO1(),
        fw5 = yR1(),
        Vw5 = o1A(),
        A6A = s1A(),
        q6A = e1A(),
        Nw5 = [Ww5.map, Zw5.seq, fw5.string, Gw5.nullTag, Vw5.boolTag, q6A.intOct, q6A.int, q6A.intHex, A6A.floatNaN, A6A.floatExp, A6A.float];
    Tw5.schema = Nw5
})
// @from(Ln 108637, Col 4)
Yn8 = R((Sw5) => {
    var Ew5 = MX(),
        kw5 = xO1(),
        Lw5 = bO1();

    function Kn8(A) {
        return typeof A === "bigint" || Number.isInteger(A)
    }
    var V76 = ({
            value: A
        }) => JSON.stringify(A),
        Rw5 = [{
            identify: (A) => typeof A === "string",
            default: !0,
            tag: "tag:yaml.org,2002:str",
            resolve: (A) => A,
            stringify: V76
        }, {
            identify: (A) => A == null,
            createNode: () => new Ew5.Scalar(null),
            default: !0,
            tag: "tag:yaml.org,2002:null",
            test: /^null$/,
            resolve: () => null,
            stringify: V76
        }, {
            identify: (A) => typeof A === "boolean",
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^true$|^false$/,
            resolve: (A) => A === "true",
            stringify: V76
        }, {
            identify: Kn8,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^-?(?:0|[1-9][0-9]*)$/,
            resolve: (A, q, {
                intAsBigInt: K
            }) => K ? BigInt(A) : parseInt(A, 10),
            stringify: ({
                value: A
            }) => Kn8(A) ? A.toString() : JSON.stringify(A)
        }, {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
            resolve: (A) => parseFloat(A),
            stringify: V76
        }],
        yw5 = {
            default: !0,
            tag: "",
            test: /^/,
            resolve(A, q) {
                return q(`Unresolved plain scalar ${JSON.stringify(A)}`), A
            }
        },
        Cw5 = [kw5.map, Lw5.seq].concat(Rw5, yw5);
    Sw5.schema = Cw5
})
// @from(Ln 108699, Col 4)
Y6A = R((bw5) => {
    var CR1 = h1("buffer"),
        K6A = MX(),
        Iw5 = vR1(),
        xw5 = {
            identify: (A) => A instanceof Uint8Array,
            default: !1,
            tag: "tag:yaml.org,2002:binary",
            resolve(A, q) {
                if (typeof CR1.Buffer === "function") return CR1.Buffer.from(A, "base64");
                else if (typeof atob === "function") {
                    let K = atob(A.replace(/[\n\r]/g, "")),
                        Y = new Uint8Array(K.length);
                    for (let z = 0; z < K.length; ++z) Y[z] = K.charCodeAt(z);
                    return Y
                } else return q("This environment does not support reading binary tags; either Buffer or atob is required"), A
            },
            stringify({
                comment: A,
                type: q,
                value: K
            }, Y, z, w) {
                if (!K) return "";
                let H = K,
                    $;
                if (typeof CR1.Buffer === "function") $ = H instanceof CR1.Buffer ? H.toString("base64") : CR1.Buffer.from(H.buffer).toString("base64");
                else if (typeof btoa === "function") {
                    let O = "";
                    for (let _ = 0; _ < H.length; ++_) O += String.fromCharCode(H[_]);
                    $ = btoa(O)
                } else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
                if (q ?? (q = K6A.Scalar.BLOCK_LITERAL), q !== K6A.Scalar.QUOTE_DOUBLE) {
                    let O = Math.max(Y.options.lineWidth - Y.indent.length, Y.options.minContentWidth),
                        _ = Math.ceil($.length / O),
                        J = Array(_);
                    for (let X = 0, D = 0; X < _; ++X, D += O) J[X] = $.substr(D, O);
                    $ = J.join(q === K6A.Scalar.BLOCK_LITERAL ? `
` : " ")
                }
                return Iw5.stringifyString({
                    comment: A,
                    type: q,
                    value: $
                }, Y, z, w)
            }
        };
    bw5.binary = xw5
})