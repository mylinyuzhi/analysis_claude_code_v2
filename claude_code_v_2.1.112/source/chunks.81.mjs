
// @from(Ln 213783, Col 0)
function xF1(q, K) {
    let _ = LM4(q, K);
    if (_ && _.severity === "error") return _.message;
    return null
}
// @from(Ln 213789, Col 0)
function uF1(q, K) {
    let _ = LM4(q, K);
    if (_ && _.severity === "warning") return _.message;
    return null
}
// @from(Ln 213795, Col 0)
function o8z(q, K) {
    let _ = q.resetsAt,
        z = _ ? Q86(_, !0) : void 0,
        Y = q.overageResetsAt ? Q86(q.overageResetsAt, !0) : void 0,
        A = z ? ` · resets ${z}` : "";
    if (q.overageStatus === "rejected") {
        let O = "";
        if (_ && q.overageResetsAt)
            if (_ < q.overageResetsAt) O = ` · resets ${z}`;
            else O = ` · resets ${Y}`;
        else if (z) O = ` · resets ${z}`;
        else if (Y) O = ` · resets ${Y}`;
        if (q.overageDisabledReason === "out_of_credits") return `You're out of extra usage${O}`;
        return Hy6("limit", O, K)
    }
    if (q.rateLimitType === "seven_day_sonnet") {
        let O = MK();
        return Hy6(O === "pro" || O === "enterprise" ? "weekly limit" : "Sonnet limit", A, K)
    }
    if (q.rateLimitType === "seven_day_opus") return Hy6("Opus limit", A, K);
    if (q.rateLimitType === "seven_day") return Hy6("weekly limit", A, K);
    if (q.rateLimitType === "five_hour") return Hy6("session limit", A, K);
    return Hy6("usage limit", A, K)
}
// @from(Ln 213820, Col 0)
function a8z(q) {
    let K = null;
    switch (q.rateLimitType) {
        case "seven_day":
            K = "weekly limit";
            break;
        case "five_hour":
            K = "session limit";
            break;
        case "seven_day_opus":
            K = "Opus limit";
            break;
        case "seven_day_sonnet":
            K = "Sonnet limit";
            break;
        case "overage":
            K = "extra usage";
            break;
        case void 0:
            return null
    }
    let _ = q.utilization ? Math.floor(q.utilization * 100) : void 0,
        z = q.resetsAt ? Q86(q.resetsAt, !0) : void 0,
        Y = s8z(q.rateLimitType);
    if (_ && z) {
        let O = `You've used ${_}% of your ${K} · resets ${z}`;
        return Y ? `${O} · ${Y}` : O
    }
    if (_) {
        let O = `You've used ${_}% of your ${K}`;
        return Y ? `${O} · ${Y}` : O
    }
    if (q.rateLimitType === "overage") K += " limit";
    if (z) {
        let O = `Approaching ${K} · resets ${z}`;
        return Y ? `${O} · ${Y}` : O
    }
    let A = `Approaching ${K}`;
    return Y ? `${A} · ${Y}` : A
}
// @from(Ln 213861, Col 0)
function s8z(q) {
    let K = MK(),
        _ = k_()?.hasExtraUsageEnabled === !0;
    if (q === "five_hour") {
        if (K === "team" || K === "enterprise") {
            if (!_ && Lk6()) return "/extra-usage to request more";
            return null
        }
        if (K === "pro" || K === "max") return "/upgrade to keep using Claude Code"
    }
    if (q === "overage") {
        if (K === "team" || K === "enterprise") {
            if (!_ && Lk6()) return "/extra-usage to request more"
        }
    }
    return null
}
// @from(Ln 213879, Col 0)
function hM4(q, K, _) {
    if (!u8("tengu_garnet_plover", !1)) return null;
    if (MK() !== "pro") return null;
    if (q.rateLimitType !== "seven_day") return null;
    if (K.includes("opus")) return {
        lever: "model",
        text: "try /model sonnet · ~2× runway"
    };
    let z = $y6(K, _);
    if (z === "high" || z === "xhigh" || z === "max") return {
        lever: "effort",
        text: "try /effort medium"
    };
    return null
}
// @from(Ln 213895, Col 0)
function mF1(q) {
    let K = q.resetsAt ? Q86(q.resetsAt, !0) : "",
        _ = "";
    if (q.rateLimitType === "five_hour") _ = "session limit";
    else if (q.rateLimitType === "seven_day") _ = "weekly limit";
    else if (q.rateLimitType === "seven_day_opus") _ = "Opus limit";
    else if (q.rateLimitType === "seven_day_sonnet") {
        let Y = MK();
        _ = Y === "pro" || Y === "enterprise" ? "weekly limit" : "Sonnet limit"
    }
    if (!_) return "Now using extra usage";
    return `You're now using extra usage${K?` · Your ${_} resets ${K}`:""}`
}
// @from(Ln 213909, Col 0)
function Hy6(q, K, _) {
    return `You've hit your ${q}${K}`
}
// @from(Ln 213912, Col 4)
r8z
// @from(Ln 213913, Col 4)
Jy6 = L(() => {
    T7();
    HQ();
    hf();
    c7();
    B1();
    r8z = ["You've hit your", "You've used", "You're now using extra usage", "You're close to", "You're out of extra usage"]
})
// @from(Ln 213922, Col 0)
function RM4(q) {
    return q1z[q] || q
}
// @from(Ln 213926, Col 0)
function K1z(q, K) {
    let _ = Date.now() / 1000,
        z = q - K,
        Y = _ - z;
    return Math.max(0, Math.min(1, Y / K))
}
// @from(Ln 213933, Col 0)
function yh8(q) {
    let K = q.headers?.get?.("anthropic-ratelimit-unified-representative-claim"),
        _ = q.headers?.get?.("anthropic-ratelimit-unified-overage-status");
    if (!K && !_) return null;
    let z = {
            status: "rejected",
            unifiedRateLimitFallbackAvailable: !1,
            isUsingOverage: !1
        },
        Y = q.headers?.get?.("anthropic-ratelimit-unified-reset");
    if (Y) z.resetsAt = Number(Y);
    if (K) z.rateLimitType = K;
    if (_) z.overageStatus = _;
    let A = q.headers?.get?.("anthropic-ratelimit-unified-overage-reset");
    if (A) z.overageResetsAt = Number(A);
    let O = q.headers?.get?.("anthropic-ratelimit-unified-overage-disabled-reason");
    if (O) z.overageDisabledReason = O;
    return z
}
// @from(Ln 213953, Col 0)
function pF1() {
    return Eh8
}
// @from(Ln 213957, Col 0)
function SM4(q) {
    let K = {};
    for (let [_, z] of [
            ["five_hour", "5h"],
            ["seven_day", "7d"]
        ]) {
        let Y = q.get(`anthropic-ratelimit-unified-${z}-utilization`),
            A = q.get(`anthropic-ratelimit-unified-${z}-reset`);
        if (Y !== null && A !== null) K[_] = {
            utilization: Number(Y),
            resets_at: Number(A)
        }
    }
    return K
}
// @from(Ln 213973, Col 0)
function BF1(q) {
    Zk = q, ZK6.forEach((_) => _(q));
    let K = Math.round((q.resetsAt ? q.resetsAt - Date.now() / 1000 : 0) / 3600);
    d("tengu_claudeai_limits_status_changed", {
        status: q.status,
        unifiedRateLimitFallbackAvailable: q.unifiedRateLimitFallbackAvailable,
        hoursTillReset: K
    })
}
// @from(Ln 213982, Col 0)
async function _1z() {
    let q = OM(),
        K = await qR({
            maxRetries: 0,
            model: q,
            source: "quota_check"
        }),
        _ = [{
            role: "user",
            content: "quota"
        }],
        z = KR(q);
    return K.beta.messages.create({
        model: q,
        max_tokens: 1,
        messages: _,
        metadata: fK6(),
        ...z.length > 0 && {
            betas: z
        }
    }).asResponse()
}
// @from(Ln 214004, Col 0)
async function CM4() {
    if (o3()) return;
    if (!Oy6(i7())) return;
    if (I7()) return;
    try {
        let q = await _1z();
        FF1(q.headers)
    } catch (q) {
        if (q instanceof vq) Lh8(q)
    }
}
// @from(Ln 214016, Col 0)
function z1z(q, K) {
    for (let [_, z] of Object.entries(e8z)) {
        let Y = q.get(`anthropic-ratelimit-unified-${_}-surpassed-threshold`);
        if (Y !== null) {
            let A = q.get(`anthropic-ratelimit-unified-${_}-utilization`),
                O = q.get(`anthropic-ratelimit-unified-${_}-reset`),
                w = A ? Number(A) : void 0;
            return {
                status: "allowed_warning",
                resetsAt: O ? Number(O) : void 0,
                rateLimitType: z,
                utilization: w,
                unifiedRateLimitFallbackAvailable: K,
                isUsingOverage: !1,
                surpassedThreshold: Number(Y)
            }
        }
    }
    return null
}
// @from(Ln 214037, Col 0)
function Y1z(q, K, _) {
    let {
        rateLimitType: z,
        claimAbbrev: Y,
        windowSeconds: A,
        thresholds: O
    } = K, w = q.get(`anthropic-ratelimit-unified-${Y}-utilization`), $ = q.get(`anthropic-ratelimit-unified-${Y}-reset`);
    if (w === null || $ === null) return null;
    let j = Number(w),
        H = Number($),
        J = K1z(H, A);
    if (!O.some((M) => j >= M.utilization && J <= M.timePct)) return null;
    return {
        status: "allowed_warning",
        resetsAt: H,
        rateLimitType: z,
        utilization: j,
        unifiedRateLimitFallbackAvailable: _,
        isUsingOverage: !1
    }
}
// @from(Ln 214059, Col 0)
function A1z(q, K) {
    let _ = z1z(q, K);
    if (_) return _;
    for (let z of t8z) {
        let Y = Y1z(q, z, K);
        if (Y) return Y
    }
    return null
}
// @from(Ln 214069, Col 0)
function bM4(q) {
    let K = q.get("anthropic-ratelimit-unified-status") || "allowed",
        _ = q.get("anthropic-ratelimit-unified-reset"),
        z = _ ? Number(_) : void 0,
        Y = q.get("anthropic-ratelimit-unified-fallback") === "available",
        A = q.get("anthropic-ratelimit-unified-representative-claim"),
        O = q.get("anthropic-ratelimit-unified-overage-status"),
        w = q.get("anthropic-ratelimit-unified-overage-reset"),
        $ = w ? Number(w) : void 0,
        j = q.get("anthropic-ratelimit-unified-overage-disabled-reason"),
        H = q.get("anthropic-ratelimit-unified-upgrade-paths"),
        J = H ? H.split(",").map((P) => P.trim()) : void 0,
        X = K === "rejected" && (O === "allowed" || O === "allowed_warning"),
        M = K;
    if (K === "allowed" || K === "allowed_warning") {
        let P = A1z(q, Y);
        if (P) return {
            ...P,
            ...J && {
                upgradePaths: J
            }
        };
        M = "allowed"
    }
    return {
        status: M,
        resetsAt: z,
        unifiedRateLimitFallbackAvailable: Y,
        ...A && {
            rateLimitType: A
        },
        ...O && {
            overageStatus: O
        },
        ...$ && {
            overageResetsAt: $
        },
        ...j && {
            overageDisabledReason: j
        },
        ...J && {
            upgradePaths: J
        },
        isUsingOverage: X
    }
}
// @from(Ln 214116, Col 0)
function IM4(q) {
    let K = q.get("anthropic-ratelimit-unified-overage-disabled-reason") ?? null;
    if (H8().cachedExtraUsageDisabledReason !== K) d8((z) => ({
        ...z,
        cachedExtraUsageDisabledReason: K
    }))
}
// @from(Ln 214124, Col 0)
function FF1(q) {
    let K = i7();
    if (!Oy6(K)) {
        if (Eh8 = {}, Zk.status !== "allowed" || Zk.resetsAt) BF1({
            status: "allowed",
            unifiedRateLimitFallbackAvailable: !1,
            isUsingOverage: !1
        });
        return
    }
    let _ = SF1(q);
    Eh8 = SM4(_);
    let z = bM4(_);
    if (IM4(_), !f$(Zk, z)) BF1(z)
}
// @from(Ln 214140, Col 0)
function Lh8(q) {
    if (!Oy6(i7()) || q.status !== 429) return;
    try {
        let K = {
            ...Zk
        };
        if (q.headers) {
            let _ = SF1(q.headers);
            Eh8 = SM4(_), K = bM4(_), IM4(_)
        }
        if (K.status = "rejected", !f$(Zk, K)) BF1(K)
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 214155, Col 4)
t8z
// @from(Ln 214155, Col 9)
e8z
// @from(Ln 214155, Col 14)
q1z
// @from(Ln 214155, Col 19)
Zk
// @from(Ln 214155, Col 23)
Eh8
// @from(Ln 214155, Col 28)
ZK6
// @from(Ln 214156, Col 4)
dI = L(() => {
    eG();
    JU();
    y8();
    T7();
    pv();
    h1();
    U8();
    Sq();
    G$();
    C8();
    O2();
    Pk6();
    St6();
    Jy6();
    t8z = [{
        rateLimitType: "five_hour",
        claimAbbrev: "5h",
        windowSeconds: 18000,
        thresholds: [{
            utilization: 0.9,
            timePct: 0.72
        }]
    }, {
        rateLimitType: "seven_day",
        claimAbbrev: "7d",
        windowSeconds: 604800,
        thresholds: [{
            utilization: 0.75,
            timePct: 0.6
        }, {
            utilization: 0.5,
            timePct: 0.35
        }, {
            utilization: 0.25,
            timePct: 0.15
        }]
    }], e8z = {
        "5h": "five_hour",
        "7d": "seven_day",
        overage: "overage"
    }, q1z = {
        five_hour: "session limit",
        seven_day: "weekly limit",
        seven_day_opus: "Opus limit",
        seven_day_sonnet: "Sonnet limit",
        overage: "extra usage limit"
    };
    Zk = {
        status: "allowed",
        unifiedRateLimitFallbackAvailable: !1,
        isUsingOverage: !1
    }, Eh8 = {};
    ZK6 = new Set
})
// @from(Ln 214212, Col 0)
function Zp(q) {
    if (!q || typeof q !== "object") return null;
    let K = q,
        _ = 5,
        z = 0;
    while (K && z < _) {
        if (K instanceof Error && "code" in K && typeof K.code === "string") {
            let Y = K.code,
                A = O1z.has(Y);
            return {
                code: Y,
                message: K.message,
                isSSLError: A
            }
        }
        if (K instanceof Error && "cause" in K && K.cause !== K) K = K.cause, z++;
        else break
    }
    return null
}
// @from(Ln 214233, Col 0)
function xM4(q) {
    let K = Zp(q);
    return K !== null && w1z.has(K.code)
}
// @from(Ln 214238, Col 0)
function GK6(q) {
    let K = Zp(q);
    if (!K?.isSSLError) return null;
    return `SSL certificate error (${K.code}). If you are behind a corporate proxy or TLS-intercepting firewall, set NODE_EXTRA_CA_CERTS to your CA bundle path, or ask IT to allowlist *.anthropic.com. Run /doctor for details.`
}
// @from(Ln 214244, Col 0)
function gF1(q) {
    if (q.includes("<!DOCTYPE html") || q.includes("<html")) {
        let K = q.match(/<title>([^<]+)<\/title>/);
        if (K && K[1]) return K[1].trim();
        return ""
    }
    return q
}
// @from(Ln 214253, Col 0)
function $1z(q) {
    let K = q.message;
    if (!K) return "";
    return gF1(K)
}
// @from(Ln 214259, Col 0)
function j1z(q) {
    return typeof q === "object" && q !== null && "error" in q && typeof q.error === "object" && q.error !== null
}
// @from(Ln 214263, Col 0)
function H1z(q) {
    if (!j1z(q)) return null;
    let _ = q.error,
        z = _?.error?.message;
    if (typeof z === "string" && z.length > 0) {
        let A = gF1(z);
        if (A.length > 0) return A
    }
    let Y = _?.message;
    if (typeof Y === "string" && Y.length > 0) {
        let A = gF1(Y);
        if (A.length > 0) return A
    }
    return null
}
// @from(Ln 214279, Col 0)
function fj6(q) {
    let K = Zp(q);
    if (K) {
        let {
            code: z,
            isSSLError: Y
        } = K;
        if (z === "ETIMEDOUT") return "Request timed out. Check your internet connection and proxy settings";
        if (Y) switch (z) {
            case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
            case "UNABLE_TO_GET_ISSUER_CERT":
            case "UNABLE_TO_GET_ISSUER_CERT_LOCALLY":
                return "Unable to connect to API: SSL certificate verification failed. Check your proxy or corporate SSL certificates";
            case "CERT_HAS_EXPIRED":
                return "Unable to connect to API: SSL certificate has expired";
            case "CERT_REVOKED":
                return "Unable to connect to API: SSL certificate has been revoked";
            case "DEPTH_ZERO_SELF_SIGNED_CERT":
            case "SELF_SIGNED_CERT_IN_CHAIN":
                return "Unable to connect to API: Self-signed certificate detected. Check your proxy or corporate SSL certificates";
            case "ERR_TLS_CERT_ALTNAME_INVALID":
            case "HOSTNAME_MISMATCH":
                return "Unable to connect to API: SSL certificate hostname mismatch";
            case "CERT_NOT_YET_VALID":
                return "Unable to connect to API: SSL certificate is not yet valid";
            default:
                return `Unable to connect to API: SSL error (${z})`
        }
    }
    if (q.message === "Connection error.") {
        if (K?.code) return `Unable to connect to API (${K.code})`;
        return "Unable to connect to API. Check your internet connection"
    }
    if (!q.message) return H1z(q) ?? `API error (status ${q.status??"unknown"})`;
    let _ = $1z(q);
    return _ !== q.message && _.length > 0 ? _ : q.message
}
// @from(Ln 214316, Col 4)
O1z
// @from(Ln 214316, Col 9)
w1z
// @from(Ln 214317, Col 4)
Ws = L(() => {
    O1z = new Set(["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "CERT_SIGNATURE_FAILURE", "CERT_NOT_YET_VALID", "CERT_HAS_EXPIRED", "CERT_REVOKED", "CERT_REJECTED", "CERT_UNTRUSTED", "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN", "CERT_CHAIN_TOO_LONG", "PATH_LENGTH_EXCEEDED", "ERR_TLS_CERT_ALTNAME_INVALID", "HOSTNAME_MISMATCH", "ERR_TLS_HANDSHAKE_TIMEOUT", "ERR_SSL_WRONG_VERSION_NUMBER", "ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC"]), w1z = new Set(["ECONNREFUSED", "ConnectionRefused", "ENOTFOUND", "ENETUNREACH", "ENETDOWN", "EHOSTUNREACH", "EHOSTDOWN", "EAI_AGAIN", "FailedToOpenSocket"])
})
// @from(Ln 214321, Col 0)
function fp(q) {
    return q.startsWith(mP) || q.startsWith(`Please run /login · ${mP}`)
}
// @from(Ln 214325, Col 0)
function vj6(q) {
    if (!q.isApiErrorMessage) return !1;
    let K = q.message.content;
    if (!Array.isArray(K)) return !1;
    return K.some((_) => _.type === "text" && _.text.startsWith(cI))
}
// @from(Ln 214332, Col 0)
function UF1(q) {
    let K = q.match(/prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i);
    return {
        actualTokens: K ? parseInt(K[1], 10) : void 0,
        limitTokens: K ? parseInt(K[2], 10) : void 0
    }
}
// @from(Ln 214340, Col 0)
function Rh8(q) {
    if (!vj6(q) || !q.errorDetails) return;
    let {
        actualTokens: K,
        limitTokens: _
    } = UF1(q.errorDetails);
    if (K === void 0 || _ === void 0) return;
    let z = K - _;
    return z > 0 ? z : void 0
}
// @from(Ln 214351, Col 0)
function X1z(q) {
    return q.includes("image exceeds") && q.includes("maximum") || q.includes("image dimensions exceed") && q.includes("many-image") || /maximum of \d+ PDF pages/.test(q) || q.includes("request_too_large")
}
// @from(Ln 214355, Col 0)
function Sh8(q) {
    return q.isApiErrorMessage === !0 && q.errorDetails !== void 0 && X1z(q.errorDetails)
}
// @from(Ln 214359, Col 0)
function cF1() {
    let q = `max ${N24} pages, ${o4(ys6)}`;
    return I7() ? `PDF too large (${q}). Try reading the file a different way (e.g., extract text with pdftotext).` : `PDF too large (${q}). Double press esc to go back and try again, or use pdftotext to convert to text first.`
}
// @from(Ln 214364, Col 0)
function lF1() {
    return I7() ? "PDF is password protected. Try using a CLI tool to extract or convert the PDF." : "PDF is password protected. Please double press esc to edit your message and try again."
}
// @from(Ln 214368, Col 0)
function nF1() {
    return I7() ? "The PDF file was not valid. Try converting it to text first (e.g., pdftotext)." : "The PDF file was not valid. Double press esc to go back and try again with a different file."
}
// @from(Ln 214372, Col 0)
function hh8() {
    return I7() ? "Image was too large. Try resizing the image or using a different approach." : "Image was too large. Double press esc to go back and try again with a smaller image."
}
// @from(Ln 214376, Col 0)
function iF1() {
    let q = `max ${o4(k24)}`;
    return I7() ? `Request too large (${q}). Try with a smaller file.` : `Request too large (${q}). Double press esc to go back and try with a smaller file.`
}
// @from(Ln 214381, Col 0)
function P1z() {
    return I7() ? "Your account does not have access to Claude. Please login again or contact your administrator." : xh8
}
// @from(Ln 214385, Col 0)
function W1z() {
    return I7() ? "Your organization does not have access to Claude. Please login again or contact your administrator." : M1z
}
// @from(Ln 214389, Col 0)
function BM4() {
    return S6(process.env.CLAUDE_CODE_REMOTE)
}
// @from(Ln 214393, Col 0)
function D1z(q, K, _) {
    try {
        let z = -1;
        for (let w = 0; w < _.length; w++) {
            let $ = _[w];
            if (!$) continue;
            let j = $.message.content;
            if (Array.isArray(j)) {
                for (let H of j)
                    if (H.type === "tool_use" && "id" in H && H.id === q) {
                        z = w;
                        break
                    }
            }
            if (z !== -1) break
        }
        let Y = -1;
        for (let w = 0; w < K.length; w++) {
            let $ = K[w];
            if (!$) continue;
            if ($.type === "assistant" && "message" in $) {
                let j = $.message.content;
                if (Array.isArray(j)) {
                    for (let H of j)
                        if (H.type === "tool_use" && "id" in H && H.id === q) {
                            Y = w;
                            break
                        }
                }
            }
            if (Y !== -1) break
        }
        let A = [];
        for (let w = z + 1; w < _.length; w++) {
            let $ = _[w];
            if (!$) continue;
            let j = $.message.content;
            if (Array.isArray(j))
                for (let H of j) {
                    let J = $.message.role;
                    if (H.type === "tool_use" && "id" in H) A.push(`${J}:tool_use:${H.id}`);
                    else if (H.type === "tool_result" && "tool_use_id" in H) A.push(`${J}:tool_result:${H.tool_use_id}`);
                    else if (H.type === "text") A.push(`${J}:text`);
                    else if (H.type === "thinking") A.push(`${J}:thinking`);
                    else if (H.type === "image") A.push(`${J}:image`);
                    else A.push(`${J}:${H.type}`)
                } else if (typeof j === "string") A.push(`${$.message.role}:string_content`)
        }
        let O = [];
        for (let w = Y + 1; w < K.length; w++) {
            let $ = K[w];
            if (!$) continue;
            switch ($.type) {
                case "user":
                case "assistant": {
                    if ("message" in $) {
                        let j = $.message.content;
                        if (Array.isArray(j))
                            for (let H of j) {
                                let J = $.message.role;
                                if (H.type === "tool_use" && "id" in H) O.push(`${J}:tool_use:${H.id}`);
                                else if (H.type === "tool_result" && "tool_use_id" in H) O.push(`${J}:tool_result:${H.tool_use_id}`);
                                else if (H.type === "text") O.push(`${J}:text`);
                                else if (H.type === "thinking") O.push(`${J}:thinking`);
                                else if (H.type === "image") O.push(`${J}:image`);
                                else O.push(`${J}:${H.type}`)
                            } else if (typeof j === "string") O.push(`${$.message.role}:string_content`)
                    }
                    break
                }
                case "attachment":
                    if ("attachment" in $) O.push(`attachment:${$.attachment.type}`);
                    break;
                case "system":
                    if ("subtype" in $) O.push(`system:${$.subtype}`);
                    break;
                case "progress":
                    if ("progress" in $ && $.progress && typeof $.progress === "object" && "type" in $.progress) O.push(`progress:${$.progress.type??"unknown"}`);
                    else O.push("progress:unknown");
                    break
            }
        }
        d("tengu_tool_use_tool_result_mismatch_error", {
            toolUseId: q,
            normalizedSequence: A.join(", "),
            preNormalizedSequence: O.join(", "),
            normalizedMessageCount: _.length,
            originalMessageCount: K.length,
            normalizedToolUseIndex: z,
            originalToolUseIndex: Y
        })
    } catch (z) {}
}
// @from(Ln 214487, Col 0)
function rF1(q) {
    return !!hT6 && q instanceof vq && q.status === 400 && q.message.includes(hT6) && q.message.includes("anthropic-beta")
}
// @from(Ln 214491, Col 0)
function mh8(q, K, _) {
    let z = Z1z(q, K, _);
    if (q instanceof vq && typeof q.status === "number") z.apiErrorStatus = q.status;
    return z
}
// @from(Ln 214497, Col 0)
function Z1z(q, K, _) {
    if (q instanceof ng || q instanceof bZ && q.message.toLowerCase().includes("timeout")) return _9({
        content: uh8,
        error: "unknown"
    });
    if (q instanceof Ay6 || q instanceof xd) return _9({
        content: hh8()
    });
    if (q instanceof Error && q.message.includes(Gj6)) return _9({
        content: Gj6,
        error: "rate_limit"
    });
    if (q instanceof vq && q.status === 429) {
        let Y = Oy6(i7()),
            A = yh8(q);
        if (Y && A) {
            let J = xF1(A, K);
            if (J) return _9({
                content: J,
                error: "rate_limit"
            });
            return _9({
                content: Tj6,
                error: "rate_limit"
            })
        }
        if (Y && q.message.includes("Extra usage is required for long context")) {
            let J = I7() ? "enable extra usage at claude.ai/settings/usage, or use --model to switch to standard context" : "run /extra-usage to enable, or /model to switch to standard context";
            return _9({
                content: `${mP}: Extra usage is required for 1M context · ${J}`,
                error: "rate_limit"
            })
        }
        let O = q.message.replace(/^429\s+/, ""),
            w;
        try {
            let J = n8(O),
                X = J?.error?.message ?? J?.message;
            if (typeof X === "string") w = X
        } catch {}
        let $ = w || O,
            j = Y ? "Server is temporarily limiting requests (not your usage limit)" : "Request rejected (429)",
            H = KA() ? `this may be a temporary capacity issue — check ${mM4}` : "this may be a temporary capacity issue";
        return _9({
            content: `${mP}: ${j} · ${$||H}`,
            error: "rate_limit"
        })
    }
    if (q instanceof Error && q.message.toLowerCase().includes("prompt is too long")) return _9({
        content: cI,
        error: "invalid_request",
        errorDetails: q.message
    });
    if (q instanceof Error && /maximum of \d+ PDF pages/.test(q.message)) return _9({
        content: cF1(),
        error: "invalid_request",
        errorDetails: q.message
    });
    if (q instanceof Error && q.message.includes("The PDF specified is password protected")) return _9({
        content: lF1(),
        error: "invalid_request"
    });
    if (q instanceof Error && q.message.includes("The PDF specified was not valid")) return _9({
        content: nF1(),
        error: "invalid_request"
    });
    if (q instanceof vq && q.status === 400 && q.message.includes("image exceeds") && q.message.includes("maximum")) return _9({
        content: hh8(),
        errorDetails: q.message
    });
    if (q instanceof vq && q.status === 400 && q.message.includes("image dimensions exceed") && q.message.includes("many-image")) return _9({
        content: I7() ? "An image in the conversation exceeds the dimension limit for many-image requests (2000px). Start a new session with fewer images." : "An image in the conversation exceeds the dimension limit for many-image requests (2000px). Run /compact to remove old images from context, or start a new session.",
        error: "invalid_request",
        errorDetails: q.message
    });
    if (rF1(q)) return _9({
        content: "Auto mode is unavailable for your plan",
        error: "invalid_request"
    });
    if (q instanceof vq && q.status === 413) {
        if (q.message.toLowerCase().includes("context window")) return _9({
            content: cI,
            error: "invalid_request",
            errorDetails: q.message
        });
        return _9({
            content: iF1(),
            error: "invalid_request",
            errorDetails: `request_too_large: ${q.message}`
        })
    }
    if (q instanceof vq && q.status === 400 && q.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) {
        if (_?.messages && _?.messagesForAPI) {
            let Y = q.message.match(/toolu_[a-zA-Z0-9]+/),
                A = Y ? Y[0] : null;
            if (A) D1z(A, _.messages, _.messagesForAPI)
        } {
            let A = I7() ? "" : " Run /rewind to recover the conversation.";
            return _9({
                content: "API Error: 400 due to tool use concurrency issues." + A,
                error: "invalid_request"
            })
        }
    }
    if (q instanceof vq && q.status === 400 && q.message.includes("unexpected `tool_use_id` found in `tool_result`")) d("tengu_unexpected_tool_result", {});
    if (q instanceof vq && q.status === 400 && q.message.includes("`tool_use` ids must be unique")) {
        d("tengu_duplicate_tool_use_id", {});
        let Y = I7() ? "" : " Run /rewind to recover the conversation.";
        return _9({
            content: `API Error: 400 duplicate tool_use ID in conversation history.${Y}`,
            error: "invalid_request",
            errorDetails: q.message
        })
    }
    if (i7() && q instanceof vq && q.status === 400 && q.message.toLowerCase().includes("invalid model name") && (Aw6(K) || K === "opus")) return _9({
        content: "Claude Opus is not available with the Claude Pro plan. If you have updated your subscription plan recently, run /logout and /login for the plan to take effect.",
        error: "invalid_request"
    });
    if (q instanceof Error && q.message.includes("Your credit balance is too low")) return _9({
        content: Ch8,
        error: "billing_error"
    });
    if (q instanceof vq && q.status === 400 && q.message.toLowerCase().includes("organization has been disabled")) {
        let {
            source: Y
        } = Vw();
        if (Y === "ANTHROPIC_API_KEY" && process.env.ANTHROPIC_API_KEY && !i7()) {
            let A = o7()?.accessToken != null;
            return _9({
                error: "invalid_request",
                content: A ? QF1 : dF1
            })
        }
    }
    if (q instanceof Error && q.message.toLowerCase().includes("x-api-key")) {
        if (BM4()) return _9({
            error: "authentication_failed",
            content: uM4
        });
        let {
            source: Y
        } = Vw();
        return _9({
            error: "authentication_failed",
            content: Y === "ANTHROPIC_API_KEY" || Y === "apiKeyHelper" ? Ih8 : bh8
        })
    }
    if (q instanceof vq && q.status === 403 && q.message.includes("OAuth token has been revoked")) return _9({
        error: "authentication_failed",
        content: P1z()
    });
    if (q instanceof vq && (q.status === 401 || q.status === 403) && q.message.includes("OAuth authentication is currently not allowed for this organization")) return _9({
        error: "authentication_failed",
        content: W1z()
    });
    if (q instanceof vq && (q.status === 401 || q.status === 403)) {
        if (BM4()) return _9({
            error: "authentication_failed",
            content: uM4
        });
        return _9({
            error: "authentication_failed",
            content: I7() ? `Failed to authenticate. ${mP}: ${q.message}` : `Please run /login · ${mP}: ${q.message}`
        })
    }
    if (S6(process.env.CLAUDE_CODE_USE_BEDROCK) && q instanceof Error && q.message.toLowerCase().includes("model id")) {
        let Y = I7() ? "--model" : "/model",
            A = pM4(K);
        return _9({
            content: A ? `${mP} (${K}): ${q.message}. Try ${Y} to switch to ${A}.` : `${mP} (${K}): ${q.message}. Run ${Y} to pick a different model.`,
            error: "invalid_request"
        })
    }
    if (q instanceof vq && q.status === 404) {
        let Y = I7() ? "--model" : "/model",
            A = pM4(K);
        return _9({
            content: A ? `The model ${K} is not available on your ${pq()} deployment. Try ${Y} to switch to ${A}, or ask your admin to enable this model.` : `There's an issue with the selected model (${K}). It may not exist or you may not have access to it. Run ${Y} to pick a different model.`,
            error: "invalid_request"
        })
    }
    let z = KA() ? ` · check ${mM4}` : "";
    if (q instanceof Error && q.message.includes(ut6)) return _9({
        content: `${mP}: ${ut6}${z}`,
        error: "server_error"
    });
    if (q instanceof vq && typeof q.status === "number" && q.status >= 500) return _9({
        content: `${mP}: ${fj6(q)}${z}`,
        error: "server_error"
    });
    if (q instanceof bZ) return _9({
        content: `${mP}: ${fj6(q)}`,
        error: "unknown"
    });
    if (q instanceof Error) return _9({
        content: `${mP}: ${q.message}`,
        error: "unknown"
    });
    return _9({
        content: mP,
        error: "unknown"
    })
}
// @from(Ln 214701, Col 0)
function pM4(q) {
    if (KA()) return;
    let K = q.toLowerCase();
    if (K.includes("opus-4-7") || K.includes("opus_4_7")) return ZO().opus41;
    if (K.includes("opus-4-6") || K.includes("opus_4_6")) return ZO().opus41;
    if (K.includes("opus-4-5") || K.includes("opus_4_5")) return ZO().opus41;
    if (K.includes("sonnet-4-6") || K.includes("sonnet_4_6")) return ZO().sonnet45;
    if (K.includes("sonnet-4-5") || K.includes("sonnet_4_5")) return ZO().sonnet40;
    return
}
// @from(Ln 214712, Col 0)
function Bh8(q) {
    if (q instanceof Error && q.message === "Request was aborted.") return "aborted";
    if (q instanceof ng || q instanceof bZ && q.message.toLowerCase().includes("timeout")) return "api_timeout";
    if (q instanceof Error && q.message.includes(ut6)) return "repeated_529";
    if (q instanceof Error && q.message.includes(Gj6)) return "capacity_off_switch";
    if (q instanceof vq && q.status === 429) return "rate_limit";
    if (q instanceof vq && (q.status === 529 || q.message?.includes('"type":"overloaded_error"'))) return "server_overload";
    if (q instanceof Error && q.message.toLowerCase().includes(cI.toLowerCase())) return "prompt_too_long";
    if (q instanceof Error && /maximum of \d+ PDF pages/.test(q.message)) return "pdf_too_large";
    if (q instanceof Error && q.message.includes("The PDF specified is password protected")) return "pdf_password_protected";
    if (q instanceof vq && q.status === 400 && q.message.includes("image exceeds") && q.message.includes("maximum")) return "image_too_large";
    if (q instanceof vq && q.status === 400 && q.message.includes("image dimensions exceed") && q.message.includes("many-image")) return "image_too_large";
    if (q instanceof vq && q.status === 413) return q.message.toLowerCase().includes("context window") ? "prompt_too_long" : "request_too_large";
    if (q instanceof vq && q.status === 400 && q.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) return "tool_use_mismatch";
    if (q instanceof vq && q.status === 400 && q.message.includes("unexpected `tool_use_id` found in `tool_result`")) return "unexpected_tool_result";
    if (q instanceof vq && q.status === 400 && q.message.includes("`tool_use` ids must be unique")) return "duplicate_tool_use_id";
    if (q instanceof vq && q.status === 400 && q.message.toLowerCase().includes("invalid model name")) return "invalid_model";
    if (q instanceof Error && q.message.toLowerCase().includes(Ch8.toLowerCase())) return "credit_balance_low";
    if (q instanceof Error && q.message.toLowerCase().includes("x-api-key")) return "invalid_api_key";
    if (q instanceof vq && q.status === 403 && q.message.includes("OAuth token has been revoked")) return "token_revoked";
    if (q instanceof vq && (q.status === 401 || q.status === 403) && q.message.includes("OAuth authentication is currently not allowed for this organization")) return "oauth_org_not_allowed";
    if (q instanceof vq && (q.status === 401 || q.status === 403)) return "auth_error";
    if (S6(process.env.CLAUDE_CODE_USE_BEDROCK) && q instanceof Error && q.message.toLowerCase().includes("model id")) return "bedrock_model_access";
    if (q instanceof vq) {
        let K = q.status;
        if (K >= 500) return "server_error";
        if (K >= 400) return "client_error"
    }
    if (q instanceof bZ) {
        if (Zp(q)?.isSSLError) return "ssl_cert_error";
        return "connection_error"
    }
    return "unknown"
}
// @from(Ln 214747, Col 0)
function FM4(q) {
    if (q.status === 529 || q.message?.includes('"type":"overloaded_error"')) return "rate_limit";
    if (q.status === 429) return "rate_limit";
    if (q.status === 401 || q.status === 403) return "authentication_failed";
    if (q.status !== void 0 && q.status >= 408) return "server_error";
    return "unknown"
}
// @from(Ln 214755, Col 0)
function gM4(q, K, _) {
    if (q !== "refusal") return;
    let z = _?.type === "refusal" ? _.explanation?.trimEnd() ?? null : null;
    d("tengu_refusal_api_response", {
        has_explanation: Boolean(z)
    });
    let Y = 400,
        A = z && z.length > Y ? z.slice(0, Y).trimEnd() + "…" : z,
        O = A ? ` ${A}${/[.!?…]$/.test(A)?"":"."}` : "",
        w = `${mP}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup).${O} `,
        $ = I7() ? "Try rephrasing the request or attempting a different approach." : "Please double press esc to edit your last message or start a new session for Claude Code to assist with a different task.",
        j = w + $;
    return _9({
        content: j + (K !== "claude-sonnet-4-20250514" ? " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." : ""),
        error: "invalid_request"
    })
}
// @from(Ln 214772, Col 4)
mP = "API Error"
// @from(Ln 214773, Col 4)
cI = "Prompt is too long"
// @from(Ln 214774, Col 4)
Ch8 = "Credit balance is too low"
// @from(Ln 214775, Col 4)
bh8 = "Not logged in · Please run /login"
// @from(Ln 214776, Col 4)
Ih8 = "Invalid API key · Fix external API key"
// @from(Ln 214777, Col 4)
QF1 = "Your ANTHROPIC_API_KEY belongs to a disabled organization · Unset the environment variable to use your subscription instead"
// @from(Ln 214778, Col 4)
dF1 = "Your ANTHROPIC_API_KEY belongs to a disabled organization · Update or unset the environment variable"
// @from(Ln 214779, Col 4)
xh8 = "OAuth token revoked · Please run /login"
// @from(Ln 214780, Col 4)
uM4 = "Authentication error · This may be a temporary network issue, please try again"
// @from(Ln 214781, Col 4)
mM4 = "status.claude.com"
// @from(Ln 214782, Col 4)
ut6 = "Repeated 529 Overloaded errors"
// @from(Ln 214783, Col 4)
Gj6 = "Opus is experiencing high load, please use /model to switch to Sonnet"
// @from(Ln 214784, Col 4)
uh8 = "Request timed out"
// @from(Ln 214785, Col 4)
M1z = "Your account does not have access to Claude Code. Please run /login."
// @from(Ln 214786, Col 4)
rv = L(() => {
    eG();
    e76();
    T7();
    _7();
    Sq();
    jQ();
    x9();
    y8();
    _s();
    Q8();
    c7();
    CI();
    Th8();
    e8();
    C8();
    dI();
    St6();
    Ws()
})
// @from(Ln 214807, Col 0)
function sK(q) {
    return q
}
// @from(Ln 214811, Col 0)
function UM4(q) {
    let {
        toolName: K,
        policySpec: _,
        eventName: z,
        querySource: Y,
        preCheck: A
    } = q, O = aX((w, $, j) => {
        let H = G1z(w, $, j, K, _, z, Y, A);
        return H.catch(() => {
            if (O.cache.get(w) === H) O.cache.delete(w)
        }), H
    }, (w) => w, 200);
    return O
}
// @from(Ln 214827, Col 0)
function QM4(q, K) {
    let _ = aX((z, Y, A) => {
        let O = v1z(z, Y, A, q, K);
        return O.catch(() => {
            if (_.cache.get(z) === O) _.cache.delete(z)
        }), O
    }, (z) => z, 200);
    return _
}
// @from(Ln 214836, Col 0)
async function G1z(q, K, _, z, Y, A, O, w) {
    if (w) {
        let J = w(q);
        if (J !== null) return J
    }
    let $, j = Date.now(),
        H = null;
    try {
        $ = setTimeout((W, D) => {
            let Z = `[${W}Tool] Pre-flight check is taking longer than expected. Run with ANTHROPIC_LOG=debug to check for failed or slow API requests.`;
            if (D) process.stderr.write(I6({
                level: "warn",
                message: Z
            }) + `
`);
            else console.warn(Y8.yellow(`⚠️  ${Z}`))
        }, 1e4, z, _);
        let J = u8("tengu_cork_m4q", !1),
            X = await ov({
                systemPrompt: sK(J ? [`Your task is to process ${z} commands that an AI coding agent wants to run.

${Y}`] : [`Your task is to process ${z} commands that an AI coding agent wants to run.

This policy spec defines how to determine the prefix of a ${z} command:`]),
                userPrompt: J ? `Command: ${q}` : `${Y}

Command: ${q}`,
                signal: K,
                options: {
                    enablePromptCaching: J,
                    querySource: O,
                    agents: [],
                    isNonInteractiveSession: _,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            });
        clearTimeout($);
        let M = Date.now() - j,
            P = typeof X.message.content === "string" ? X.message.content : Array.isArray(X.message.content) ? X.message.content.find((W) => W.type === "text")?.text ?? "none" : "none";
        if (fp(P)) d(A, {
            success: !1,
            error: "API error",
            durationMs: M
        }), H = null;
        else if (P === "command_injection_detected") d(A, {
            success: !1,
            error: "command_injection_detected",
            durationMs: M
        }), H = {
            commandPrefix: null
        };
        else if (P === "git" || f1z.has(P.toLowerCase())) d(A, {
            success: !1,
            error: "dangerous_shell_prefix",
            durationMs: M
        }), H = {
            commandPrefix: null
        };
        else if (P === "none") d(A, {
            success: !1,
            error: 'prefix "none"',
            durationMs: M
        }), H = {
            commandPrefix: null
        };
        else if (!q.startsWith(P)) d(A, {
            success: !1,
            error: "command did not start with prefix",
            durationMs: M
        }), H = {
            commandPrefix: null
        };
        else d(A, {
            success: !0,
            durationMs: M
        }), H = {
            commandPrefix: P
        };
        return H
    } catch (J) {
        throw clearTimeout($), J
    }
}
// @from(Ln 214920, Col 0)
async function v1z(q, K, _, z, Y) {
    let A = await Y(q),
        [O, ...w] = await Promise.all([z(q, K, _), ...A.map(async (j) => ({
            subcommand: j,
            prefix: await z(j, K, _)
        }))]);
    if (!O) return null;
    let $ = w.reduce((j, {
        subcommand: H,
        prefix: J
    }) => {
        if (J) j.set(H, J);
        return j
    }, new Map);
    return {
        ...O,
        subcommandPrefixes: $
    }
}
// @from(Ln 214939, Col 4)
f1z
// @from(Ln 214940, Col 4)
dM4 = L(() => {
    Y3();
    B1();
    C8();
    O2();
    rv();
    Lm();
    e8();
    f1z = new Set(["sh", "bash", "zsh", "fish", "csh", "tcsh", "ksh", "dash", "cmd", "cmd.exe", "powershell", "powershell.exe", "pwsh", "pwsh.exe", "bash.exe"])
})
// @from(Ln 214951, Col 0)
function vs() {
    return T1z
}
// @from(Ln 214955, Col 0)
function k1z(q) {
    return {
        src: q,
        len: q.length,
        i: 0,
        b: 0,
        heredocs: [],
        byteTable: null
    }
}
// @from(Ln 214966, Col 0)
function k8(q) {
    let K = q.src.charCodeAt(q.i);
    if (q.i++, K < 128) q.b++;
    else if (K < 2048) q.b += 2;
    else if (K >= 55296 && K <= 56319) q.b += 4, q.i++;
    else q.b += 3
}
// @from(Ln 214974, Col 0)
function q1(q, K = 0) {
    return q.i + K < q.len ? q.src[q.i + K] : ""
}
// @from(Ln 214978, Col 0)
function sM4(q, K) {
    if (q.byteTable) return q.byteTable[K];
    let _ = new Uint32Array(q.len + 1),
        z = 0,
        Y = 0;
    while (Y < q.len) {
        _[Y] = z;
        let A = q.src.charCodeAt(Y);
        if (A < 128) z++, Y++;
        else if (A < 2048) z += 2, Y++;
        else if (A >= 55296 && A <= 56319) _[Y + 1] = z + 2, z += 4, Y += 2;
        else z += 3, Y++
    }
    return _[q.len] = z, q.byteTable = _, _[K]
}
// @from(Ln 214994, Col 0)
function tM4(q) {
    return q >= "a" && q <= "z" || q >= "A" && q <= "Z" || q >= "0" && q <= "9" || q === "_" || q === "/" || q === "." || q === "-" || q === "+" || q === ":" || q === "@" || q === "%" || q === "," || q === "~" || q === "^" || q === "?" || q === "*" || q === "!" || q === "=" || q === "[" || q === "]"
}
// @from(Ln 214998, Col 0)
function N1z(q) {
    return tM4(q) || q === "\\"
}
// @from(Ln 215002, Col 0)
function vk(q) {
    return q >= "a" && q <= "z" || q >= "A" && q <= "Z" || q === "_"
}
// @from(Ln 215006, Col 0)
function rd(q) {
    return vk(q) || q >= "0" && q <= "9"
}
// @from(Ln 215010, Col 0)
function WH(q) {
    return q >= "0" && q <= "9"
}
// @from(Ln 215014, Col 0)
function E1z(q) {
    return WH(q) || q >= "a" && q <= "f" || q >= "A" && q <= "F"
}
// @from(Ln 215018, Col 0)
function y1z(q) {
    return rd(q) || q === "@"
}
// @from(Ln 215022, Col 0)
function L1z(q) {
    return q !== "" && q !== " " && q !== "\t" && q !== `
` && q !== "<" && q !== ">" && q !== "|" && q !== "&" && q !== ";" && q !== "(" && q !== ")" && q !== "'" && q !== '"' && q !== "`" && q !== "\\"
}
// @from(Ln 215027, Col 0)
function oq(q) {
    while (q.i < q.len) {
        let K = q.src[q.i];
        if (K === " " || K === "\t" || K === "\r") k8(q);
        else if (K === "\\") {
            let _ = q.src[q.i + 1];
            if (_ === `
` || _ === "\r" && q.src[q.i + 2] === `
`) {
                if (k8(q), k8(q), _ === "\r") k8(q)
            } else if (_ === " " || _ === "\t") k8(q), k8(q);
            else break
        } else break
    }
}
// @from(Ln 215043, Col 0)
function a9(q, K = "arg") {
    oq(q);
    let _ = q.b;
    if (q.i >= q.len) return {
        type: "EOF",
        value: "",
        start: _,
        end: _
    };
    let z = q.src[q.i],
        Y = q1(q, 1),
        A = q1(q, 2);
    if (z === `
`) return k8(q), {
        type: "NEWLINE",
        value: `
`,
        start: _,
        end: q.b
    };
    if (z === "#") {
        let O = q.i;
        while (q.i < q.len && q.src[q.i] !== `
`) k8(q);
        return {
            type: "COMMENT",
            value: q.src.slice(O, q.i),
            start: _,
            end: q.b
        }
    }
    if (z === "&" && Y === "&") return k8(q), k8(q), {
        type: "OP",
        value: "&&",
        start: _,
        end: q.b
    };
    if (z === "|" && Y === "|") return k8(q), k8(q), {
        type: "OP",
        value: "||",
        start: _,
        end: q.b
    };
    if (z === "|" && Y === "&") return k8(q), k8(q), {
        type: "OP",
        value: "|&",
        start: _,
        end: q.b
    };
    if (z === ";" && Y === ";" && A === "&") return k8(q), k8(q), k8(q), {
        type: "OP",
        value: ";;&",
        start: _,
        end: q.b
    };
    if (z === ";" && Y === ";") return k8(q), k8(q), {
        type: "OP",
        value: ";;",
        start: _,
        end: q.b
    };
    if (z === ";" && Y === "&") return k8(q), k8(q), {
        type: "OP",
        value: ";&",
        start: _,
        end: q.b
    };
    if (z === ">" && Y === ">") return k8(q), k8(q), {
        type: "OP",
        value: ">>",
        start: _,
        end: q.b
    };
    if (z === ">" && Y === "&" && A === "-") return k8(q), k8(q), k8(q), {
        type: "OP",
        value: ">&-",
        start: _,
        end: q.b
    };
    if (z === ">" && Y === "&") return k8(q), k8(q), {
        type: "OP",
        value: ">&",
        start: _,
        end: q.b
    };
    if (z === ">" && Y === "|") return k8(q), k8(q), {
        type: "OP",
        value: ">|",
        start: _,
        end: q.b
    };
    if (z === "&" && Y === ">" && A === ">") return k8(q), k8(q), k8(q), {
        type: "OP",
        value: "&>>",
        start: _,
        end: q.b
    };
    if (z === "&" && Y === ">") return k8(q), k8(q), {
        type: "OP",
        value: "&>",
        start: _,
        end: q.b
    };
    if (z === "<" && Y === "<" && A === "<") return k8(q), k8(q), k8(q), {
        type: "OP",
        value: "<<<",
        start: _,
        end: q.b
    };
    if (z === "<" && Y === "<" && A === "-") return k8(q), k8(q), k8(q), {
        type: "OP",
        value: "<<-",
        start: _,
        end: q.b
    };
    if (z === "<" && Y === "<") return k8(q), k8(q), {
        type: "OP",
        value: "<<",
        start: _,
        end: q.b
    };
    if (z === "<" && Y === "&" && A === "-") return k8(q), k8(q), k8(q), {
        type: "OP",
        value: "<&-",
        start: _,
        end: q.b
    };
    if (z === "<" && Y === "&") return k8(q), k8(q), {
        type: "OP",
        value: "<&",
        start: _,
        end: q.b
    };
    if (z === "<" && Y === "(") return k8(q), k8(q), {
        type: "LT_PAREN",
        value: "<(",
        start: _,
        end: q.b
    };
    if (z === ">" && Y === "(") return k8(q), k8(q), {
        type: "GT_PAREN",
        value: ">(",
        start: _,
        end: q.b
    };
    if (z === "(" && Y === "(") return k8(q), k8(q), {
        type: "OP",
        value: "((",
        start: _,
        end: q.b
    };
    if (z === ")" && Y === ")") return k8(q), k8(q), {
        type: "OP",
        value: "))",
        start: _,
        end: q.b
    };
    if (z === "|" || z === "&" || z === ";" || z === ">" || z === "<") return k8(q), {
        type: "OP",
        value: z,
        start: _,
        end: q.b
    };
    if (z === "(" || z === ")") return k8(q), {
        type: "OP",
        value: z,
        start: _,
        end: q.b
    };
    if (K === "cmd") {
        if (z === "[" && Y === "[") return k8(q), k8(q), {
            type: "OP",
            value: "[[",
            start: _,
            end: q.b
        };
        if (z === "[") return k8(q), {
            type: "OP",
            value: "[",
            start: _,
            end: q.b
        };
        if (z === "{" && (Y === " " || Y === "\t" || Y === `
`)) return k8(q), {
            type: "OP",
            value: "{",
            start: _,
            end: q.b
        };
        if (z === "}") return k8(q), {
            type: "OP",
            value: "}",
            start: _,
            end: q.b
        };
        if (z === "!" && (Y === " " || Y === "\t")) return k8(q), {
            type: "OP",
            value: "!",
            start: _,
            end: q.b
        }
    }
    if (z === '"') return k8(q), {
        type: "DQUOTE",
        value: '"',
        start: _,
        end: q.b
    };
    if (z === "'") {
        let O = q.i;
        k8(q);
        while (q.i < q.len && q.src[q.i] !== "'") k8(q);
        if (q.i < q.len) k8(q);
        return {
            type: "SQUOTE",
            value: q.src.slice(O, q.i),
            start: _,
            end: q.b
        }
    }
    if (z === "$") {
        if (Y === "(" && A === "(") return k8(q), k8(q), k8(q), {
            type: "DOLLAR_DPAREN",
            value: "$((",
            start: _,
            end: q.b
        };
        if (Y === "(") return k8(q), k8(q), {
            type: "DOLLAR_PAREN",
            value: "$(",
            start: _,
            end: q.b
        };
        if (Y === "{") return k8(q), k8(q), {
            type: "DOLLAR_BRACE",
            value: "${",
            start: _,
            end: q.b
        };
        if (Y === "'") {
            let O = q.i;
            k8(q), k8(q);
            while (q.i < q.len && q.src[q.i] !== "'") {
                if (q.src[q.i] === "\\" && q.i + 1 < q.len) k8(q);
                k8(q)
            }
            if (q.i < q.len) k8(q);
            return {
                type: "ANSI_C",
                value: q.src.slice(O, q.i),
                start: _,
                end: q.b
            }
        }
        return k8(q), {
            type: "DOLLAR",
            value: "$",
            start: _,
            end: q.b
        }
    }
    if (z === "`") return k8(q), {
        type: "BACKTICK",
        value: "`",
        start: _,
        end: q.b
    };
    if (WH(z)) {
        let O = q.i;
        while (O < q.len && WH(q.src[O])) O++;
        let w = O < q.len ? q.src[O] : "";
        if (w === ">" || w === "<") {
            let $ = q.i;
            while (q.i < O) k8(q);
            return {
                type: "WORD",
                value: q.src.slice($, q.i),
                start: _,
                end: q.b
            }
        }
    }
    if (N1z(z) || z === "{" || z === "}") {
        let O = q.i;
        while (q.i < q.len) {
            let w = q.src[q.i];
            if (w === "\\") {
                if (q.i + 1 >= q.len) break;
                if (q.src[q.i + 1] === `
`) {
                    k8(q), k8(q);
                    continue
                }
                k8(q), k8(q);
                continue
            }
            if (!tM4(w) && w !== "{" && w !== "}") break;
            k8(q)
        }
        if (q.i > O) {
            let w = q.src.slice(O, q.i);
            if (/^-?\d+$/.test(w)) return {
                type: "NUMBER",
                value: w,
                start: _,
                end: q.b
            };
            return {
                type: "WORD",
                value: w,
                start: _,
                end: q.b
            }
        }
    }
    return k8(q), {
        type: "WORD",
        value: z,
        start: _,
        end: q.b
    }
}
// @from(Ln 215366, Col 0)
function h1z(q, K) {
    let _ = k1z(q),
        z = R1z(q),
        Y = {
            L: _,
            src: q,
            srcBytes: z,
            isAscii: z === q.length,
            nodeCount: 0,
            deadline: performance.now() + (K ?? 50),
            aborted: !1,
            inBacktick: 0,
            stopToken: null
        };
    try {
        let A = C1z(Y);
        if (Y.aborted) return null;
        return A
    } catch {
        return null
    }
}
// @from(Ln 215389, Col 0)
function R1z(q) {
    let K = 0;
    for (let _ = 0; _ < q.length; _++) {
        let z = q.charCodeAt(_);
        if (z < 128) K++;
        else if (z < 2048) K += 2;
        else if (z >= 55296 && z <= 56319) K += 4, _++;
        else K += 3
    }
    return K
}
// @from(Ln 215401, Col 0)
function S1z(q) {
    if (q.nodeCount++, q.nodeCount > 50000) throw q.aborted = !0, Error("budget");
    if ((q.nodeCount & 127) === 0 && performance.now() > q.deadline) throw q.aborted = !0, Error("timeout")
}
// @from(Ln 215406, Col 0)
function r8(q, K, _, z, Y) {
    return S1z(q), {
        type: K,
        text: Vj6(q, _, z),
        startIndex: _,
        endIndex: z,
        children: Y
    }
}
// @from(Ln 215416, Col 0)
function Vj6(q, K, _) {
    if (q.isAscii) return q.src.slice(K, _);
    let z = q.L;
    if (!z.byteTable) sM4(z, 0);
    let Y = z.byteTable,
        A = 0,
        O = q.src.length;
    while (A < O) {
        let $ = A + O >>> 1;
        if (Y[$] < K) A = $ + 1;
        else O = $
    }
    let w = A;
    A = w, O = q.src.length;
    while (A < O) {
        let $ = A + O >>> 1;
        if (Y[$] < _) A = $ + 1;
        else O = $
    }
    return q.src.slice(w, A)
}
// @from(Ln 215438, Col 0)
function j3(q, K, _) {
    return r8(q, K, _.start, _.end, [])
}
// @from(Ln 215442, Col 0)
function C1z(q) {
    let K = [];
    oq(q.L);
    while (!0) {
        let Y = AA(q.L);
        if (a9(q.L, "cmd").type === "NEWLINE") {
            oq(q.L);
            continue
        }
        H3(q.L, Y);
        break
    }
    let _ = q.L.b;
    while (q.L.i < q.L.len) {
        let Y = AA(q.L),
            A = a9(q.L, "cmd");
        if (A.type === "EOF") break;
        if (A.type === "NEWLINE") continue;
        if (A.type === "COMMENT") {
            K.push(j3(q, "comment", A));
            continue
        }
        H3(q.L, Y);
        let O = fk(q, null);
        for (let w of O) K.push(w);
        if (O.length === 0) {
            let w = a9(q.L, "cmd");
            if (w.type === "EOF") break;
            if (w.type === "OP" && w.value === ";;" && K.length > 0) continue;
            K.push(r8(q, "ERROR", w.start, w.end, []))
        }
    }
    let z = K.length > 0 ? q.srcBytes : _;
    return r8(q, "program", _, z, K)
}
// @from(Ln 215478, Col 0)
function AA(q) {
    return q.b * 65536 + q.i
}
// @from(Ln 215482, Col 0)
function H3(q, K) {
    q.i = K & 65535, q.b = K >>> 16
}
// @from(Ln 215486, Col 0)
function fk(q, K) {
    let _ = [];
    while (!0) {
        oq(q.L);
        let z = AA(q.L),
            Y = a9(q.L, "cmd");
        if (Y.type === "EOF") {
            H3(q.L, z);
            break
        }
        if (Y.type === "NEWLINE") {
            if (q.L.heredocs.length > 0) oF1(q);
            continue
        }
        if (Y.type === "COMMENT") {
            _.push(j3(q, "comment", Y));
            continue
        }
        if (K && Y.type === "OP" && Y.value === K) {
            H3(q.L, z);
            break
        }
        if (Y.type === "OP" && (Y.value === ")" || Y.value === "}" || Y.value === ";;" || Y.value === ";&" || Y.value === ";;&" || Y.value === "))" || Y.value === "]]" || Y.value === "]")) {
            H3(q.L, z);
            break
        }
        if (Y.type === "BACKTICK" && q.inBacktick > 0) {
            H3(q.L, z);
            break
        }
        if (Y.type === "WORD" && (Y.value === "then" || Y.value === "elif" || Y.value === "else" || Y.value === "fi" || Y.value === "do" || Y.value === "done" || Y.value === "esac")) {
            H3(q.L, z);
            break
        }
        H3(q.L, z);
        let A = eM4(q);
        if (!A) break;
        _.push(A), oq(q.L);
        let O = AA(q.L),
            w = a9(q.L, "cmd");
        if (w.type === "OP" && (w.value === ";" || w.value === "&")) {
            let $ = AA(q.L),
                j = a9(q.L, "cmd");
            if (H3(q.L, $), _.push(j3(q, w.value, w)), j.type === "EOF" || j.type === "OP" && (j.value === ")" || j.value === "}" || j.value === ";;" || j.value === ";&" || j.value === ";;&") || j.type === "WORD" && (j.value === "then" || j.value === "elif" || j.value === "else" || j.value === "fi" || j.value === "do" || j.value === "done" || j.value === "esac")) continue
        } else if (w.type === "NEWLINE") {
            if (q.L.heredocs.length > 0) oF1(q);
            continue
        } else H3(q.L, O)
    }
    return _
}
// @from(Ln 215538, Col 0)
function eM4(q) {
    let K = cM4(q);
    if (!K) return null;
    while (!0) {
        let _ = AA(q.L),
            z = a9(q.L, "cmd");
        if (z.type === "OP" && (z.value === "&&" || z.value === "||")) {
            let Y = j3(q, z.value, z);
            Zs(q);
            let A = cM4(q);
            if (!A) {
                K = r8(q, "list", K.startIndex, Y.endIndex, [K, Y]);
                break
            }
            if (A.type === "redirected_statement" && A.children.length >= 2) {
                let O = A.children[0],
                    w = A.children.slice(1),
                    $ = r8(q, "list", K.startIndex, O.endIndex, [K, Y, O]),
                    j = w.at(-1);
                K = r8(q, "redirected_statement", $.startIndex, j.endIndex, [$, ...w])
            } else K = r8(q, "list", K.startIndex, A.endIndex, [K, Y, A])
        } else {
            H3(q.L, _);
            break
        }
    }
    return K
}
// @from(Ln 215567, Col 0)
function Zs(q) {
    while (!0) {
        let K = AA(q.L);
        if (a9(q.L, "cmd").type !== "NEWLINE") {
            H3(q.L, K);
            break
        }
    }
}
// @from(Ln 215577, Col 0)
function cM4(q) {
    let K = vK6(q);
    if (!K) return null;
    let _ = [K];
    while (!0) {
        let Y = AA(q.L),
            A = a9(q.L, "cmd");
        if (A.type === "OP" && (A.value === "|" || A.value === "|&")) {
            let O = j3(q, A.value, A);
            Zs(q);
            let w = vK6(q);
            if (!w) {
                _.push(O);
                break
            }
            if (w.type === "redirected_statement" && w.children.length >= 2 && _.length >= 1) {
                let $ = w.children[0],
                    j = w.children.slice(1),
                    H = [..._, O, $],
                    J = r8(q, "pipeline", H[0].startIndex, $.endIndex, H),
                    X = j.at(-1),
                    M = r8(q, "redirected_statement", J.startIndex, X.endIndex, [J, ...j]);
                _.length = 0, _.push(M), K = M;
                continue
            }
            _.push(O, w)
        } else {
            H3(q.L, Y);
            break
        }
    }
    if (_.length === 1) return _[0];
    let z = _.at(-1);
    return r8(q, "pipeline", _[0].startIndex, z.endIndex, _)
}
// @from(Ln 215613, Col 0)
function vK6(q) {
    oq(q.L);
    let K = AA(q.L),
        _ = a9(q.L, "cmd");
    if (_.type === "EOF") return H3(q.L, K), null;
    if (_.type === "OP" && _.value === "!") {
        let z = j3(q, "!", _),
            Y = vK6(q);
        if (!Y) return H3(q.L, K), null;
        if (Y.type === "redirected_statement" && Y.children.length >= 2) {
            let A = Y.children[0],
                O = Y.children.slice(1),
                w = r8(q, "negated_command", z.startIndex, A.endIndex, [z, A]),
                $ = O.at(-1);
            return r8(q, "redirected_statement", w.startIndex, $.endIndex, [w, ...O])
        }
        return r8(q, "negated_command", z.startIndex, Y.endIndex, [z, Y])
    }
    if (_.type === "OP" && _.value === "(") {
        let z = j3(q, "(", _),
            Y = fk(q, ")"),
            A = a9(q.L, "cmd"),
            O = A.type === "OP" && A.value === ")" ? j3(q, ")", A) : r8(q, ")", z.endIndex, z.endIndex, []),
            w = r8(q, "subshell", z.startIndex, O.endIndex, [z, ...Y, O]);
        return Ds(q, w)
    }
    if (_.type === "OP" && _.value === "((") {
        let z = j3(q, "((", _),
            Y = Bt6(q, "))", "var"),
            A = a9(q.L, "cmd"),
            O = A.value === "))" ? j3(q, "))", A) : r8(q, "))", z.endIndex, z.endIndex, []);
        return r8(q, "compound_statement", z.startIndex, O.endIndex, [z, ...Y, O])
    }
    if (_.type === "OP" && _.value === "{") {
        let z = j3(q, "{", _),
            Y = fk(q, "}"),
            A = a9(q.L, "cmd"),
            O = A.type === "OP" && A.value === "}" ? j3(q, "}", A) : r8(q, "}", z.endIndex, z.endIndex, []),
            w = r8(q, "compound_statement", z.startIndex, O.endIndex, [z, ...Y, O]);
        return Ds(q, w)
    }
    if (_.type === "OP" && (_.value === "[" || _.value === "[[")) {
        let z = j3(q, _.value, _),
            Y = _.value === "[" ? "]" : "]]",
            A = AA(q.L),
            O = iM4(q, Y);
        if (oq(q.L), _.value === "[" && q1(q.L) !== "]") {
            H3(q.L, A);
            let H = q.stopToken;
            q.stopToken = "]";
            let J = vK6(q);
            if (q.stopToken = H, J && J.type === "redirected_statement") O = J;
            else H3(q.L, A), O = iM4(q, Y);
            oq(q.L)
        }
        let w = a9(q.L, "arg"),
            $;
        if (w.value === Y) $ = j3(q, Y, w);
        else $ = r8(q, Y, z.endIndex, z.endIndex, []);
        let j = O ? [z, O, $] : [z, $];
        return r8(q, "test_command", z.startIndex, $.endIndex, j)
    }
    if (_.type === "WORD") {
        if (_.value === "if") return Ds(q, Q1z(q, _), !0);
        if (_.value === "while" || _.value === "until") return Ds(q, d1z(q, _), !0);
        if (_.value === "for") return Ds(q, nM4(q, _), !0);
        if (_.value === "select") return Ds(q, nM4(q, _), !0);
        if (_.value === "case") return Ds(q, c1z(q, _), !0);
        if (_.value === "function") return r1z(q, _);
        if (V1z.has(_.value)) return Ds(q, o1z(q, _));
        if (_.value === "unset" || _.value === "unsetenv") return Ds(q, a1z(q, _))
    }
    return H3(q.L, K), b1z(q)
}
// @from(Ln 215688, Col 0)
function b1z(q) {
    let K = q.L.b,
        _ = [],
        z = [];
    while (!0) {
        oq(q.L);
        let Z = qP4(q);
        if (Z) {
            _.push(Z);
            continue
        }
        let G = Fh8(q);
        if (G) {
            z.push(G);
            continue
        }
        break
    }
    oq(q.L);
    let Y = AA(q.L),
        A = a9(q.L, "cmd");
    if (A.type === "EOF" || A.type === "NEWLINE" || A.type === "COMMENT" || A.type === "OP" && A.value !== "{" && A.value !== "[" && A.value !== "[[" || A.type === "WORD" && qg1.has(A.value) && A.value !== "in") {
        if (H3(q.L, Y), _.length === 1 && z.length === 0) return _[0];
        if (z.length > 0 && _.length === 0) {
            let Z = z.at(-1);
            return r8(q, "redirected_statement", z[0].startIndex, Z.endIndex, z)
        }
        if (_.length > 1 && z.length === 0) {
            let Z = _.at(-1);
            return r8(q, "variable_assignments", _[0].startIndex, Z.endIndex, _)
        }
        if (_.length > 0 || z.length > 0) {
            let Z = [..._, ...z],
                G = Z.at(-1);
            return r8(q, "command", K, G.endIndex, Z)
        }
        return null
    }
    H3(q.L, Y);
    let O = AA(q.L),
        w = Gk(q, "cmd");
    if (w && w.type === "word") {
        if (oq(q.L), q1(q.L) === "(" && q1(q.L, 1) === ")") {
            let Z = a9(q.L, "cmd"),
                G = a9(q.L, "cmd"),
                f = j3(q, "(", Z),
                v = j3(q, ")", G);
            oq(q.L), Zs(q);
            let V = vK6(q);
            if (V) {
                let k = [V];
                if (V.type === "redirected_statement" && V.children.length >= 2 && V.children[0].type === "compound_statement") k = V.children;
                let N = k.at(-1);
                return r8(q, "function_definition", w.startIndex, N.endIndex, [w, f, v, ...k])
            }
        }
    }
    H3(q.L, O);
    let $ = Gk(q, "cmd");
    if (!$) {
        if (_.length === 1) return _[0];
        return null
    }
    let j = r8(q, "command_name", $.startIndex, $.endIndex, [$]),
        H = [],
        J = [],
        X = null;
    while (!0) {
        oq(q.L);
        let Z = Fh8(q, !0);
        if (Z) {
            if (Z.type === "heredoc_redirect") X = Z;
            else if (Z.type === "herestring_redirect") H.push(Z);
            else J.push(Z);
            continue
        }
        if (J.length > 0) break;
        if (q.stopToken === "]" && q1(q.L) === "]") break;
        let G = AA(q.L),
            f = a9(q.L, "arg");
        if (f.type === "EOF" || f.type === "NEWLINE" || f.type === "COMMENT" || f.type === "OP" && (f.value === "|" || f.value === "|&" || f.value === "&&" || f.value === "||" || f.value === ";" || f.value === ";;" || f.value === ";&" || f.value === ";;&" || f.value === "&" || f.value === ")" || f.value === "}" || f.value === "))")) {
            H3(q.L, G);
            break
        }
        H3(q.L, G);
        let v = Gk(q, "arg");
        if (!v) {
            if (q1(q.L) === "(") {
                let V = a9(q.L, "cmd"),
                    k = j3(q, "(", V),
                    N = fk(q, ")"),
                    R = a9(q.L, "cmd"),
                    h = R.type === "OP" && R.value === ")" ? j3(q, ")", R) : r8(q, ")", k.endIndex, k.endIndex, []);
                H.push(r8(q, "subshell", k.startIndex, h.endIndex, [k, ...N, h]));
                continue
            }
            break
        }
        if (v.type === "word" && v.text === "=") {
            H.push(r8(q, "ERROR", v.startIndex, v.endIndex, [v]));
            continue
        }
        if ((v.type === "word" || v.type === "concatenation") && q1(q.L) === "(" && q.L.b === v.endIndex) {
            H.push(r8(q, "ERROR", v.startIndex, v.endIndex, [v]));
            continue
        }
        H.push(v)
    }
    let M = [..._, ...z, j, ...H],
        P = M.length > 0 ? M.at(-1).endIndex : j.endIndex,
        W = M[0].startIndex,
        D = r8(q, "command", W, P, M);
    if (X) {
        oF1(q);
        let Z = q.L.heredocs.shift();
        if (Z && X.children.length >= 2) {
            let v = r8(q, "heredoc_body", Z.bodyStart, Z.bodyEnd, Z.quoted ? [] : u1z(q, Z.bodyStart, Z.bodyEnd)),
                V = r8(q, "heredoc_end", Z.endStart, Z.endEnd, []);
            X.children.push(v, V), X.endIndex = Z.endEnd, X.text = Vj6(q, X.startIndex, Z.endEnd)
        }
        let G = [...z, X, ...J],
            f = z.length > 0 ? Math.min(D.startIndex, z[0].startIndex) : D.startIndex;
        return r8(q, "redirected_statement", f, X.endIndex, [D, ...G])
    }
    if (J.length > 0) {
        let Z = J.at(-1);
        return r8(q, "redirected_statement", D.startIndex, Z.endIndex, [D, ...J])
    }
    return D
}
// @from(Ln 215819, Col 0)
function Ds(q, K, _ = !1) {
    let z = [];
    while (!0) {
        oq(q.L);
        let A = AA(q.L),
            O = Fh8(q);
        if (!O) break;
        if (O.type === "herestring_redirect" && !_) {
            H3(q.L, A);
            break
        }
        z.push(O)
    }
    if (z.length === 0) return K;
    let Y = z.at(-1);
    return r8(q, "redirected_statement", K.startIndex, Y.endIndex, [K, ...z])
}
// @from(Ln 215837, Col 0)
function qP4(q) {
    let K = AA(q.L);
    oq(q.L);
    let _ = q.L.b;
    if (!vk(q1(q.L))) return H3(q.L, K), null;
    while (rd(q1(q.L))) k8(q.L);
    let z = q.L.b,
        Y = z;
    if (q1(q.L) === "[") {
        k8(q.L);
        let D = 1;
        while (q.L.i < q.L.len && D > 0) {
            let Z = q1(q.L);
            if (Z === "[") D++;
            else if (Z === "]") D--;
            k8(q.L)
        }
        Y = q.L.b
    }
    let A = q1(q.L),
        O = q1(q.L, 1),
        w;
    if (A === "=" && O !== "=") w = "=";
    else if (A === "+" && O === "=") w = "+=";
    else return H3(q.L, K), null;
    let $ = r8(q, "variable_name", _, z, []),
        j = $;
    if (Y > z) {
        let D = r8(q, "[", z, z + 1, []),
            Z = x1z(q, z + 1, Y - 1),
            G = r8(q, "]", Y - 1, Y, []);
        j = r8(q, "subscript", _, Y, [$, D, Z, G])
    }
    let H = q.L.b;
    if (k8(q.L), w === "+=") k8(q.L);
    let J = q.L.b,
        X = r8(q, w, H, J, []),
        M = null;
    if (q1(q.L) === "(") {
        let D = a9(q.L, "cmd"),
            Z = j3(q, "(", D),
            G = [Z];
        while (!0) {
            if (oq(q.L), q1(q.L) === ")") break;
            let V = Gk(q, "arg");
            if (!V) break;
            G.push(V)
        }
        let f = a9(q.L, "cmd"),
            v = f.value === ")" ? j3(q, ")", f) : r8(q, ")", Z.endIndex, Z.endIndex, []);
        G.push(v), M = r8(q, "array", Z.startIndex, v.endIndex, G)
    } else {
        let D = q1(q.L);
        if (D && D !== " " && D !== "\t" && D !== `
` && D !== ";" && D !== "&" && D !== "|" && D !== ")" && D !== "}") M = Gk(q, "arg")
    }
    let P = M ? [j, X, M] : [j, X],
        W = M ? M.endIndex : J;
    return r8(q, "variable_assignment", _, W, P)
}
// @from(Ln 215898, Col 0)
function I1z(q) {
    oq(q.L);
    let K = q1(q.L);
    if ((K === "@" || K === "*") && q1(q.L, 1) === "]") {
        let _ = q.L.b;
        return k8(q.L), r8(q, "word", _, q.L.b, [])
    }
    if (K === "(" && q1(q.L, 1) === "(") {
        let _ = q.L.b;
        k8(q.L), k8(q.L);
        let z = r8(q, "((", _, q.L.b, []),
            Y = gh8(q, "))", "var");
        oq(q.L);
        let A;
        if (q1(q.L) === ")" && q1(q.L, 1) === ")") {
            let w = q.L.b;
            k8(q.L), k8(q.L), A = r8(q, "))", w, q.L.b, [])
        } else A = r8(q, "))", q.L.b, q.L.b, []);
        let O = Y ? [z, Y, A] : [z, A];
        return r8(q, "compound_statement", z.startIndex, A.endIndex, O)
    }
    return gh8(q, "]", "word")
}
// @from(Ln 215922, Col 0)
function x1z(q, K, _) {
    let z = Vj6(q, K, _);
    if (/^\d+$/.test(z)) return r8(q, "number", K, _, []);
    if (/^\$([a-zA-Z_]\w*)$/.exec(z)) {
        let A = r8(q, "$", K, K + 1, []),
            O = r8(q, "variable_name", K + 1, _, []);
        return r8(q, "simple_expansion", K, _, [A, O])
    }
    if (z.length === 2 && z[0] === "$" && Xy6.has(z[1])) {
        let A = r8(q, "$", K, K + 1, []),
            O = r8(q, "special_variable_name", K + 1, _, []);
        return r8(q, "simple_expansion", K, _, [A, O])
    }
    return r8(q, "word", K, _, [])
}
// @from(Ln 215938, Col 0)
function lM4(q) {
    let K = q1(q.L);
    if (K === "" || K === `
`) return !1;
    if (K === "|" || K === "&" || K === ";" || K === "(" || K === ")") return !1;
    if (K === "<" || K === ">") return q1(q.L, 1) === "(";
    if (WH(K)) {
        let _ = q.L.i;
        while (_ < q.L.len && WH(q.L.src[_])) _++;
        let z = _ < q.L.len ? q.L.src[_] : "";
        if (z === ">" || z === "<") return !1
    }
    if (K === "}") return !1;
    if (q.stopToken === "]" && K === "]") return !1;
    return !0
}
// @from(Ln 215955, Col 0)
function Fh8(q, K = !1) {
    let _ = AA(q.L);
    oq(q.L);
    let z = null;
    if (WH(q1(q.L))) {
        let O = q.L.b,
            w = q.L.i;
        while (w < q.L.len && WH(q.L.src[w])) w++;
        let $ = w < q.L.len ? q.L.src[w] : "";
        if ($ === ">" || $ === "<") {
            while (q.L.i < w) k8(q.L);
            z = r8(q, "file_descriptor", O, q.L.b, [])
        }
    }
    let Y = a9(q.L, "arg");
    if (Y.type !== "OP") return H3(q.L, _), null;
    let A = Y.value;
    if (A === "<<<") {
        let O = j3(q, "<<<", Y);
        oq(q.L);
        let w = Gk(q, "arg"),
            $ = w ? w.endIndex : O.endIndex,
            j = w ? [O, w] : [O];
        return r8(q, "herestring_redirect", z ? z.startIndex : O.startIndex, $, z ? [z, ...j] : j)
    }
    if (A === "<<" || A === "<<-") {
        let O = j3(q, A, Y);
        oq(q.L);
        let w = q.L.b,
            $ = !1,
            j = "",
            H = q1(q.L);
        if (H === "'" || H === '"') {
            $ = !0, k8(q.L);
            while (q.L.i < q.L.len && q1(q.L) !== H) j += q1(q.L), k8(q.L);
            if (q.L.i < q.L.len) k8(q.L)
        } else if (H === "\\") {
            if ($ = !0, k8(q.L), q.L.i < q.L.len && q1(q.L) !== `
`) j += q1(q.L), k8(q.L);
            while (q.L.i < q.L.len && rd(q1(q.L))) j += q1(q.L), k8(q.L)
        } else
            while (q.L.i < q.L.len && L1z(q1(q.L))) j += q1(q.L), k8(q.L);
        let J = q.L.b,
            X = r8(q, "heredoc_start", w, J, []);
        q.L.heredocs.push({
            delim: j,
            stripTabs: A === "<<-",
            quoted: $,
            bodyStart: 0,
            bodyEnd: 0,
            endStart: 0,
            endEnd: 0
        });
        let M = z ? [z, O, X] : [O, X],
            P = z ? z.startIndex : O.startIndex;
        while (!0) {
            oq(q.L);
            let W = q1(q.L);
            if (W === `
` || W === "" || q.L.i >= q.L.len) break;
            if (W === ">" || W === "<" || WH(W)) {
                let G = AA(q.L),
                    f = Fh8(q);
                if (f && f.type === "file_redirect") {
                    M.push(f);
                    continue
                }
                H3(q.L, G)
            }
            if (W === "|" && q1(q.L, 1) !== "|") {
                k8(q.L), oq(q.L);
                let G = [];
                while (!0) {
                    let f = vK6(q);
                    if (!f) break;
                    if (G.push(f), oq(q.L), q1(q.L) === "|" && q1(q.L, 1) !== "|") {
                        let v = q.L.b;
                        k8(q.L), G.push(r8(q, "|", v, q.L.b, [])), oq(q.L);
                        continue
                    }
                    break
                }
                if (G.length > 0) {
                    let f = G.at(-1);
                    M.push(r8(q, "pipeline", G[0].startIndex, f.endIndex, G))
                }
                continue
            }
            if (W === "&" && q1(q.L, 1) === "&" || W === "|" && q1(q.L, 1) === "|") {
                k8(q.L), k8(q.L), oq(q.L);
                let G = vK6(q);
                if (G) M.push(G);
                continue
            }
            if (W === "&" || W === ";" || W === "(" || W === ")") {
                let G = q.L.b;
                while (q.L.i < q.L.len && q1(q.L) !== `
`) k8(q.L);
                M.push(r8(q, "ERROR", G, q.L.b, []));
                break
            }
            let D = Gk(q, "arg");
            if (D) {
                M.push(D);
                continue
            }
            let Z = q.L.b;
            while (q.L.i < q.L.len && q1(q.L) !== `
`) k8(q.L);
            if (q.L.b > Z) M.push(r8(q, "ERROR", Z, q.L.b, []));
            break
        }
        return r8(q, "heredoc_redirect", P, q.L.b, M)
    }
    if (A === "<&-" || A === ">&-") {
        let O = j3(q, A, Y),
            w = [];
        if (z) w.push(z);
        w.push(O), oq(q.L);
        let $ = AA(q.L),
            j = lM4(q) ? Gk(q, "arg") : null;
        if (j) w.push(j);
        else H3(q.L, $);
        let H = z ? z.startIndex : O.startIndex,
            J = j ? j.endIndex : O.endIndex;
        return r8(q, "file_redirect", H, J, w)
    }
    if (A === ">" || A === ">>" || A === ">&" || A === ">|" || A === "&>" || A === "&>>" || A === "<" || A === "<&") {
        let O = j3(q, A, Y),
            w = [];
        if (z) w.push(z);
        w.push(O);
        let $ = O.endIndex,
            j = 0;
        while (!0) {
            if (oq(q.L), !lM4(q)) break;
            if (!K && j >= 1) break;
            let J = q1(q.L),
                X = q1(q.L, 1),
                M = null;
            if ((J === "<" || J === ">") && X === "(") M = Kg1(q);
            else M = Gk(q, "arg");
            if (!M) break;
            w.push(M), $ = M.endIndex, j++
        }
        let H = z ? z.startIndex : O.startIndex;
        return r8(q, "file_redirect", H, $, w)
    }
    return H3(q.L, _), null
}
// @from(Ln 216106, Col 0)
function Kg1(q) {
    let K = q1(q.L);
    if (K !== "<" && K !== ">" || q1(q.L, 1) !== "(") return null;
    let _ = q.L.b;
    k8(q.L), k8(q.L);
    let z = r8(q, K + "(", _, q.L.b, []),
        Y = fk(q, ")");
    oq(q.L);
    let A;
    if (q1(q.L) === ")") {
        let O = q.L.b;
        k8(q.L), A = r8(q, ")", O, q.L.b, [])
    } else A = r8(q, ")", q.L.b, q.L.b, []);
    return r8(q, "process_substitution", _, A.endIndex, [z, ...Y, A])
}
// @from(Ln 216122, Col 0)
function oF1(q) {
    while (q.L.i < q.L.len && q.L.src[q.L.i] !== `
`) k8(q.L);
    if (q.L.i < q.L.len) k8(q.L);
    for (let K of q.L.heredocs) {
        K.bodyStart = q.L.b;
        let _ = K.delim.length;
        while (q.L.i < q.L.len) {
            let z = q.L.i,
                Y = q.L.b,
                A = z;
            if (K.stripTabs)
                while (A < q.L.len && q.L.src[A] === "\t") A++;
            if (q.L.src.startsWith(K.delim, A) && (A + _ >= q.L.len || q.L.src[A + _] === `
` || q.L.src[A + _] === "\r")) {
                K.bodyEnd = Y;
                while (q.L.i < A) k8(q.L);
                K.endStart = q.L.b;
                for (let O = 0; O < _; O++) k8(q.L);
                if (K.endEnd = q.L.b, q.L.i < q.L.len && q.L.src[q.L.i] === `
`) k8(q.L);
                return
            }
            while (q.L.i < q.L.len && q.L.src[q.L.i] !== `
`) k8(q.L);
            if (q.L.i < q.L.len) k8(q.L)
        }
        K.bodyEnd = q.L.b, K.endStart = q.L.b, K.endEnd = q.L.b
    }
}
// @from(Ln 216153, Col 0)
function u1z(q, K, _) {
    let z = AA(q.L);
    m1z(q, K);
    let Y = [],
        A = q.L.b,
        O = !1;
    while (q.L.b < _) {
        let w = q1(q.L);
        if (w === "\\") {
            let $ = q1(q.L, 1);
            if ($ === "$" || $ === "`" || $ === "\\") {
                k8(q.L), k8(q.L);
                continue
            }
            k8(q.L);
            continue
        }
        if (w === "$" || w === "`") {
            let $ = q.L.b,
                j = Gs(q);
            if (j && (j.type === "simple_expansion" || j.type === "expansion" || j.type === "command_substitution" || j.type === "arithmetic_expansion")) {
                if (O && $ > A) Y.push(r8(q, "heredoc_content", A, $, []));
                Y.push(j), A = q.L.b, O = !0
            }
            continue
        }
        k8(q.L)
    }
    if (O) Y.push(r8(q, "heredoc_content", A, _, []));
    return H3(q.L, z), Y
}
// @from(Ln 216185, Col 0)
function m1z(q, K) {
    if (!q.L.byteTable) sM4(q.L, 0);
    let _ = q.L.byteTable,
        z = 0,
        Y = q.src.length;
    while (z < Y) {
        let A = z + Y >>> 1;
        if (_[A] < K) z = A + 1;
        else Y = A
    }
    q.L.i = z, q.L.b = K
}
// @from(Ln 216198, Col 0)
function Gk(q, K) {
    oq(q.L);
    let _ = [];
    while (q.L.i < q.L.len) {
        let A = q1(q.L);
        if (A === " " || A === "\t" || A === `
` || A === "\r" || A === "" || A === "|" || A === "&" || A === ";" || A === "(" || A === ")") break;
        if (A === "<" || A === ">") {
            if (q1(q.L, 1) === "(") {
                let w = Kg1(q);
                if (w) _.push(w);
                continue
            }
            break
        }
        if (A === '"') {
            _.push(fs(q));
            continue
        }
        if (A === "'") {
            let w = a9(q.L, "arg");
            _.push(j3(q, "raw_string", w));
            continue
        }
        if (A === "$") {
            let w = q1(q.L, 1);
            if (w === "'") {
                let j = a9(q.L, "arg");
                _.push(j3(q, "ansi_c_string", j));
                continue
            }
            if (w === '"') {
                let j = {
                    type: "DOLLAR",
                    value: "$",
                    start: q.L.b,
                    end: q.L.b + 1
                };
                k8(q.L), _.push(j3(q, "$", j)), _.push(fs(q));
                continue
            }
            if (w === "`") {
                k8(q.L);
                continue
            }
            let $ = Gs(q);
            if ($) _.push($);
            continue
        }
        if (A === "`") {
            if (q.inBacktick > 0) break;
            let w = _g1(q);
            if (w) _.push(w);
            continue
        }
        if (A === "{") {
            let w = p1z(q);
            if (w) {
                _.push(w);
                continue
            }
            let $ = q1(q.L, 1);
            if ($ === ";" || $ === "|" || $ === "&" || $ === `
` || $ === "" || $ === ")" || $ === " " || $ === "\t") {
                let H = q.L.b;
                k8(q.L), _.push(r8(q, "word", H, q.L.b, []));
                continue
            }
            let j = F1z(q);
            if (j) {
                for (let H of j) _.push(H);
                continue
            }
        }
        if (A === "}") {
            let w = q.L.b;
            k8(q.L), _.push(r8(q, "word", w, q.L.b, []));
            continue
        }
        if (A === "[" || A === "]") {
            let w = q.L.b;
            k8(q.L), _.push(r8(q, "word", w, q.L.b, []));
            continue
        }
        let O = B1z(q);
        if (!O) break;
        if (O.type === "word" && /^-?(0x)?[0-9]+#$/.test(O.text) && q1(q.L) === "$" && (q1(q.L, 1) === "{" || q1(q.L, 1) === "(")) {
            let w = Gs(q);
            if (w) {
                _.push(r8(q, "number", O.startIndex, w.endIndex, [w]));
                continue
            }
        }
        _.push(O)
    }
    if (_.length === 0) return null;
    if (_.length === 1) return _[0];
    let z = _[0],
        Y = _.at(-1);
    return r8(q, "concatenation", z.startIndex, Y.endIndex, _)
}
// @from(Ln 216300, Col 0)
function B1z(q) {
    let K = q.L.b,
        _ = q.L.i;
    while (q.L.i < q.L.len) {
        let A = q1(q.L);
        if (A === "\\") {
            if (q.L.i + 1 >= q.L.len) break;
            let O = q.L.src[q.L.i + 1];
            if (O === `
` || O === "\r" && q.L.src[q.L.i + 2] === `
`) break;
            k8(q.L), k8(q.L);
            continue
        }
        if (A === " " || A === "\t" || A === `
` || A === "\r" || A === "" || A === "|" || A === "&" || A === ";" || A === "(" || A === ")" || A === "<" || A === ">" || A === '"' || A === "'" || A === "$" || A === "`" || A === "{" || A === "}" || A === "[" || A === "]") break;
        k8(q.L)
    }
    if (q.L.b === K) return null;
    let z = q.src.slice(_, q.L.i),
        Y = /^-?\d+$/.test(z) ? "number" : "word";
    return r8(q, Y, K, q.L.b, [])
}
// @from(Ln 216324, Col 0)
function p1z(q) {
    let K = AA(q.L);
    if (q1(q.L) !== "{") return null;
    let _ = q.L.b;
    k8(q.L);
    let z = q.L.b,
        Y = q.L.b;
    while (WH(q1(q.L)) || vk(q1(q.L))) k8(q.L);
    let A = q.L.b;
    if (A === Y || q1(q.L) !== "." || q1(q.L, 1) !== ".") return H3(q.L, K), null;
    let O = q.L.b;
    k8(q.L), k8(q.L);
    let w = q.L.b,
        $ = q.L.b;
    while (WH(q1(q.L)) || vk(q1(q.L))) k8(q.L);
    let j = q.L.b;
    if (j === $ || q1(q.L) !== "}") return H3(q.L, K), null;
    let H = q.L.b;
    k8(q.L);
    let J = q.L.b,
        X = Vj6(q, Y, A),
        M = Vj6(q, $, j),
        P = /^\d+$/.test(X),
        W = /^\d+$/.test(M);
    if (P !== W) return H3(q.L, K), null;
    if (!P && (X.length !== 1 || M.length !== 1)) return H3(q.L, K), null;
    let D = P ? "number" : "word",
        Z = W ? "number" : "word";
    return r8(q, "brace_expression", _, J, [r8(q, "{", _, z, []), r8(q, D, Y, A, []), r8(q, "..", O, w, []), r8(q, Z, $, j, []), r8(q, "}", H, J, [])])
}
// @from(Ln 216355, Col 0)
function F1z(q) {
    if (q1(q.L) !== "{") return null;
    let K = q.L.b;
    k8(q.L);
    let _ = q.L.b,
        z = [r8(q, "word", K, _, [])];
    while (q.L.i < q.L.len) {
        let Y = q1(q.L);
        if (Y === "}" || Y === `
` || Y === ";" || Y === "|" || Y === "&" || Y === " " || Y === "\t" || Y === "<" || Y === ">" || Y === "(" || Y === ")") break;
        if (Y === "[" || Y === "]") {
            let w = q.L.b;
            k8(q.L), z.push(r8(q, "word", w, q.L.b, []));
            continue
        }
        let A = q.L.b;
        while (q.L.i < q.L.len) {
            let w = q1(q.L);
            if (w === "}" || w === `
` || w === ";" || w === "|" || w === "&" || w === " " || w === "\t" || w === "<" || w === ">" || w === "(" || w === ")" || w === "[" || w === "]") break;
            k8(q.L)
        }
        let O = q.L.b;
        if (O > A) {
            let w = Vj6(q, A, O),
                $ = /^-?\d+$/.test(w) ? "number" : "word";
            z.push(r8(q, $, A, O, []))
        } else break
    }
    if (q1(q.L) === "}") {
        let Y = q.L.b;
        k8(q.L), z.push(r8(q, "word", Y, q.L.b, []))
    }
    return z
}
// @from(Ln 216391, Col 0)
function fs(q) {
    let K = q.L.b;
    k8(q.L);
    let _ = q.L.b,
        Y = [r8(q, '"', K, _, [])],
        A = q.L.b,
        O = q.L.i,
        w = () => {
            if (q.L.b > A) {
                let j = q.src.slice(O, q.L.i);
                if (!/^[ \t]+$/.test(j)) Y.push(r8(q, "string_content", A, q.L.b, []))
            }
        };
    while (q.L.i < q.L.len) {
        let j = q1(q.L);
        if (j === '"') break;
        if (j === "\\" && q.L.i + 1 < q.L.len) {
            k8(q.L), k8(q.L);
            continue
        }
        if (j === `
`) {
            w(), k8(q.L), A = q.L.b, O = q.L.i;
            continue
        }
        if (j === "$") {
            let H = q1(q.L, 1);
            if (H === "(" || H === "{" || vk(H) || Xy6.has(H) || WH(H)) {
                w();
                let J = Gs(q);
                if (J) Y.push(J);
                A = q.L.b, O = q.L.i;
                continue
            }
            if (H !== '"' && H !== "") {
                w();
                let J = q.L.b;
                k8(q.L), Y.push(r8(q, "$", J, q.L.b, [])), A = q.L.b, O = q.L.i;
                continue
            }
        }
        if (j === "`") {
            w();
            let H = _g1(q);
            if (H) Y.push(H);
            A = q.L.b, O = q.L.i;
            continue
        }
        k8(q.L)
    }
    w();
    let $;
    if (q1(q.L) === '"') {
        let j = q.L.b;
        k8(q.L), $ = r8(q, '"', j, q.L.b, [])
    } else $ = r8(q, '"', q.L.b, q.L.b, []);
    return Y.push($), r8(q, "string", K, $.endIndex, Y)
}
// @from(Ln 216450, Col 0)
function Gs(q) {
    let K = q1(q.L, 1),
        _ = q.L.b;
    if (K === "(" && q1(q.L, 2) === "(") {
        k8(q.L), k8(q.L), k8(q.L);
        let O = r8(q, "$((", _, q.L.b, []),
            w = Bt6(q, "))", "var");
        oq(q.L);
        let $;
        if (q1(q.L) === ")" && q1(q.L, 1) === ")") {
            let j = q.L.b;
            k8(q.L), k8(q.L), $ = r8(q, "))", j, q.L.b, [])
        } else $ = r8(q, "))", q.L.b, q.L.b, []);
        return r8(q, "arithmetic_expansion", _, $.endIndex, [O, ...w, $])
    }
    if (K === "[") {
        k8(q.L), k8(q.L);
        let O = r8(q, "$[", _, q.L.b, []),
            w = Bt6(q, "]", "var");
        oq(q.L);
        let $;
        if (q1(q.L) === "]") {
            let j = q.L.b;
            k8(q.L), $ = r8(q, "]", j, q.L.b, [])
        } else $ = r8(q, "]", q.L.b, q.L.b, []);
        return r8(q, "arithmetic_expansion", _, $.endIndex, [O, ...w, $])
    }
    if (K === "(") {
        k8(q.L), k8(q.L);
        let O = r8(q, "$(", _, q.L.b, []),
            w = fk(q, ")");
        oq(q.L);
        let $;
        if (q1(q.L) === ")") {
            let j = q.L.b;
            k8(q.L), $ = r8(q, ")", j, q.L.b, [])
        } else $ = r8(q, ")", q.L.b, q.L.b, []);
        if (w.length === 1 && w[0].type === "redirected_statement" && w[0].children.length === 1 && w[0].children[0].type === "file_redirect") w = w[0].children;
        return r8(q, "command_substitution", _, $.endIndex, [O, ...w, $])
    }
    if (K === "{") {
        k8(q.L), k8(q.L);
        let O = r8(q, "${", _, q.L.b, []),
            w = g1z(q),
            $;
        if (q1(q.L) === "}") {
            let j = q.L.b;
            k8(q.L), $ = r8(q, "}", j, q.L.b, [])
        } else $ = r8(q, "}", q.L.b, q.L.b, []);
        return r8(q, "expansion", _, $.endIndex, [O, ...w, $])
    }
    k8(q.L);
    let z = q.L.b,
        Y = r8(q, "$", _, z, []),
        A = q1(q.L);
    if (A === "_" && !rd(q1(q.L, 1))) {
        let O = q.L.b;
        k8(q.L);
        let w = r8(q, "special_variable_name", O, q.L.b, []);
        return r8(q, "simple_expansion", _, q.L.b, [Y, w])
    }
    if (vk(A)) {
        let O = q.L.b;
        while (rd(q1(q.L))) k8(q.L);
        let w = r8(q, "variable_name", O, q.L.b, []);
        return r8(q, "simple_expansion", _, q.L.b, [Y, w])
    }
    if (WH(A)) {
        let O = q.L.b;
        k8(q.L);
        let w = r8(q, "variable_name", O, q.L.b, []);
        return r8(q, "simple_expansion", _, q.L.b, [Y, w])
    }
    if (Xy6.has(A)) {
        let O = q.L.b;
        k8(q.L);
        let w = r8(q, "special_variable_name", O, q.L.b, []);
        return r8(q, "simple_expansion", _, q.L.b, [Y, w])
    }
    return Y
}
// @from(Ln 216532, Col 0)
function g1z(q) {
    let K = [];
    oq(q.L);
    {
        let A = q1(q.L),
            O = q1(q.L, 1);
        if (A === "#" && O === "!" && q1(q.L, 2) === "}") return k8(q.L), k8(q.L), K;
        if (A === "!" && O === "#") {
            let w = 2;
            if (q1(q.L, w) === "#") w++;
            if (q1(q.L, w) === " ") w++;
            if (q1(q.L, w) === "}") {
                while (w-- > 0) k8(q.L);
                return K
            }
        }
    }
    if (q1(q.L) === "#") {
        let A = q.L.b;
        k8(q.L), K.push(r8(q, "#", A, q.L.b, []))
    }
    let _ = q1(q.L);
    if ((_ === "!" || _ === "=" || _ === "~") && (vk(q1(q.L, 1)) || WH(q1(q.L, 1)))) {
        let A = q.L.b;
        k8(q.L), K.push(r8(q, _, A, q.L.b, []))
    }
    if (oq(q.L), vk(q1(q.L))) {
        let A = q.L.b;
        while (rd(q1(q.L))) k8(q.L);
        K.push(r8(q, "variable_name", A, q.L.b, []))
    } else if (WH(q1(q.L))) {
        let A = q.L.b;
        while (WH(q1(q.L))) k8(q.L);
        K.push(r8(q, "variable_name", A, q.L.b, []))
    } else if (Xy6.has(q1(q.L))) {
        let A = q.L.b;
        k8(q.L), K.push(r8(q, "special_variable_name", A, q.L.b, []))
    }
    if (q1(q.L) === "[") {
        let A = K.at(-1),
            O = q.L.b;
        k8(q.L);
        let w = r8(q, "[", O, q.L.b, []),
            $ = I1z(q);
        oq(q.L);
        let j = q.L.b;
        if (q1(q.L) === "]") k8(q.L);
        let H = r8(q, "]", j, q.L.b, []);
        if (A) {
            let J = $ ? [A, w, $, H] : [A, w, H];
            K[K.length - 1] = r8(q, "subscript", A.startIndex, q.L.b, J)
        }
    }
    oq(q.L);
    let z = q1(q.L);
    if ((z === "*" || z === "@") && q1(q.L, 1) === "}") {
        let A = q.L.b;
        return k8(q.L), K.push(r8(q, z, A, q.L.b, [])), K
    }
    if (z === "@" && vk(q1(q.L, 1))) {
        let A = q.L.b;
        k8(q.L), K.push(r8(q, "@", A, q.L.b, []));
        while (rd(q1(q.L))) k8(q.L);
        return K
    }
    let Y = q1(q.L);
    if (Y === ":") {
        let A = q1(q.L, 1);
        if (A === `
` || A === "}") {
            k8(q.L);
            while (q1(q.L) === `
`) k8(q.L);
            return K
        }
        if (A !== "-" && A !== "=" && A !== "?" && A !== "+") {
            k8(q.L), oq(q.L);
            let O = q1(q.L),
                w;
            if (O === "-" && WH(q1(q.L, 1))) {
                let $ = q.L.b;
                k8(q.L);
                while (WH(q1(q.L))) k8(q.L);
                w = r8(q, "number", $, q.L.b, [])
            } else w = gh8(q, ":}", "var");
            if (w) K.push(w);
            if (oq(q.L), q1(q.L) === ":") {
                k8(q.L), oq(q.L);
                let $ = q1(q.L),
                    j;
                if ($ === "-" && WH(q1(q.L, 1))) {
                    let H = q.L.b;
                    k8(q.L);
                    while (WH(q1(q.L))) k8(q.L);
                    j = r8(q, "number", H, q.L.b, [])
                } else j = gh8(q, "}", "var");
                if (j) K.push(j)
            }
            return K
        }
    }
    if (Y === ":" || Y === "#" || Y === "%" || Y === "/" || Y === "^" || Y === "," || Y === "-" || Y === "=" || Y === "?" || Y === "+") {
        let A = q.L.b,
            O = q1(q.L, 1),
            w = Y;
        if (Y === ":" && (O === "-" || O === "=" || O === "?" || O === "+")) k8(q.L), k8(q.L), w = Y + O;
        else if ((Y === "#" || Y === "%" || Y === "/" || Y === "^" || Y === ",") && O === Y) k8(q.L), k8(q.L), w = Y + Y;
        else k8(q.L);
        K.push(r8(q, w, A, q.L.b, []));
        let $ = w === "#" || w === "##" || w === "%" || w === "%%" || w === "/" || w === "//" || w === "^" || w === "^^" || w === "," || w === ",,";
        if (w === "/" || w === "//") {
            let j = q1(q.L);
            if (j === "#" || j === "%") {
                let H = q.L.b;
                k8(q.L), K.push(r8(q, j, H, q.L.b, []))
            }
            if (q1(q.L) === '"') {
                K.push(fs(q));
                let H = ph8(q, "regex", !0);
                if (H) K.push(H)
            } else {
                let H = ph8(q, "regex", !0);
                if (H) K.push(H)
            }
            if (q1(q.L) === "/") {
                let H = q.L.b;
                k8(q.L), K.push(r8(q, "/", H, q.L.b, []));
                let J = ph8(q, "replword", !1);
                if (J)
                    if (J.type === "concatenation" && J.children.length === 2 && J.children[0].type === "command_substitution") K.push(J.children[0]), K.push(J.children[1]);
                    else K.push(J)
            }
        } else if (w === "#" || w === "##" || w === "%" || w === "%%")
            for (let j of U1z(q)) K.push(j);
        else {
            let j = ph8(q, $ ? "regex" : "word", !1);
            if (j) K.push(j)
        }
    }
    return K
}