
// @from(Ln 108591, Col 0)
function GF9(q, K) {
    switch (q) {
        case "free":
            return K === "oauth" ? "Fast mode requires a paid subscription" : "Fast mode unavailable during evaluation. Please purchase credits.";
        case "preference":
            return "Fast mode has been disabled by your organization";
        case "extra_usage_disabled":
            return "Fast mode requires extra usage billing · /extra-usage to enable";
        case "network_error":
            return "Fast mode unavailable due to network connectivity issues";
        case "unknown":
            return "Fast mode is currently unavailable"
    }
}
// @from(Ln 108606, Col 0)
function ST6() {
    if (!q5()) return "Fast mode is not available";
    let q = u8("tengu_penguins_off", null);
    if (q !== null) return E(`Fast mode unavailable: ${q}`), q;
    if (I7() && tB6() && !aG()) {
        if (!E1("flagSettings")?.fastMode) return E("Fast mode unavailable: Fast mode is not available in the Agent SDK"), "Fast mode is not available in the Agent SDK"
    }
    if (pq() !== "firstParty") return E("Fast mode unavailable: Fast mode is not available on Bedrock, Vertex, Foundry, or Claude Platform on AWS"), "Fast mode is not available on Bedrock, Vertex, Foundry, or Claude Platform on AWS";
    if (Lv.status === "disabled" && !av1()) {
        if (Lv.reason === "network_error" || Lv.reason === "unknown") {
            if (S6(process.env.CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS)) return null
        }
        let K = o7() !== null ? "oauth" : "api-key",
            _ = GF9(Lv.reason, K);
        return E(`Fast mode unavailable: ${_}`), _
    }
    return null
}
// @from(Ln 108625, Col 0)
function $n6() {
    return "claude-opus-4-6" + (YX() ? "[1m]" : "")
}
// @from(Ln 108629, Col 0)
function sv1(q) {
    if (!q5()) return !1;
    if (!AM()) return !1;
    if (!zX(q)) return !1;
    let K = v7();
    if (K.fastModePerSessionOptIn) return !1;
    return K.fastMode === !0
}
// @from(Ln 108638, Col 0)
function zX(q) {
    if (!q5()) return !1;
    let K = q ?? hv();
    return K5(K).toLowerCase().includes("opus-4-6")
}
// @from(Ln 108644, Col 0)
function tv1() {
    if (RT6.status === "cooldown" && Date.now() >= RT6.resetAt) {
        if (q5() && !ov1) E("Fast mode cooldown expired, re-enabling fast mode"), ov1 = !0, NZq.emit();
        RT6 = {
            status: "active"
        }
    }
    return RT6
}
// @from(Ln 108654, Col 0)
function LZq(q, K) {
    if (!q5()) return;
    RT6 = {
        status: "cooldown",
        resetAt: q,
        reason: K
    }, ov1 = !1;
    let _ = q - Date.now();
    E(`Fast mode cooldown triggered (${K}), duration ${Math.round(_/1000)}s`), d("tengu_fast_mode_fallback_triggered", {
        cooldown_duration_ms: _,
        cooldown_reason: K
    }), kZq.emit(q, K)
}
// @from(Ln 108668, Col 0)
function zw6() {
    RT6 = {
        status: "active"
    }
}
// @from(Ln 108674, Col 0)
function hZq() {
    if (Lv.status === "disabled") return;
    Lv = {
        status: "disabled",
        reason: "preference"
    }, P7("userSettings", {
        fastMode: void 0
    }), d8((q) => ({
        ...q,
        penguinModeOrgEnabled: !1
    })), ev1.emit(!1)
}
// @from(Ln 108687, Col 0)
function vF9(q) {
    switch (q) {
        case "out_of_credits":
            return "Fast mode disabled · extra usage credits exhausted";
        case "org_level_disabled":
        case "org_service_level_disabled":
            return "Fast mode disabled · extra usage disabled by your organization";
        case "org_level_disabled_until":
            return "Fast mode disabled · extra usage spending cap reached";
        case "member_level_disabled":
            return "Fast mode disabled · extra usage disabled for your account";
        case "seat_tier_level_disabled":
        case "seat_tier_zero_credit_limit":
        case "member_zero_credit_limit":
            return "Fast mode disabled · extra usage not available for your plan";
        case "overage_not_provisioned":
        case "no_limits_configured":
            return "Fast mode requires extra usage billing · /extra-usage to enable";
        default:
            return "Fast mode disabled · extra usage not available"
    }
}
// @from(Ln 108710, Col 0)
function TF9(q) {
    return q === "org_level_disabled_until" || q === "out_of_credits"
}
// @from(Ln 108714, Col 0)
function CZq(q) {
    let K = vF9(q);
    if (E(`Fast mode overage rejection: ${q??"unknown"} — ${K}`), d("tengu_fast_mode_overage_rejected", {
            overage_disabled_reason: q ?? "unknown"
        }), !TF9(q)) P7("userSettings", {
        fastMode: void 0
    }), d8((_) => ({
        ..._,
        penguinModeOrgEnabled: !1
    }));
    RZq.emit(K)
}
// @from(Ln 108727, Col 0)
function fQ() {
    return tv1().status === "cooldown"
}
// @from(Ln 108731, Col 0)
function yE(q, K) {
    let _ = q5() && AM() && !!K && zX(q);
    if (_ && fQ()) return "cooldown";
    if (_) return "on";
    return "off"
}
// @from(Ln 108737, Col 0)
async function VF9(q) {
    let K = `${r7().BASE_API_URL}/api/claude_code_penguin_mode`,
        _ = "accessToken" in q ? {
            Authorization: `Bearer ${q.accessToken}`,
            "anthropic-beta": eJ
        } : {
            "x-api-key": q.apiKey
        };
    return (await Z1.get(K, {
        headers: _
    })).data
}
// @from(Ln 108750, Col 0)
function qT1() {
    if (!q5()) return;
    if (Lv.status !== "pending") return;
    if (av1()) {
        Lv = {
            status: "enabled"
        };
        return
    }
    let q = !1,
        K = H8().penguinModeOrgEnabled === !0;
    Lv = q || K ? {
        status: "enabled"
    } : {
        status: "disabled",
        reason: "unknown"
    }
}
// @from(Ln 108768, Col 0)
async function FZ8() {
    if (o3()) return;
    if (!q5()) return;
    if (av1()) {
        Lv = {
            status: "enabled"
        };
        return
    }
    if (wn6) return E("Fast mode prefetch in progress, returning in-flight promise"), wn6;
    let q = FV();
    if (!(o7()?.accessToken && AD()) && !q) {
        Lv = H8().penguinModeOrgEnabled === !0 ? {
            status: "enabled"
        } : {
            status: "disabled",
            reason: "preference"
        };
        return
    }
    let _ = Date.now();
    if (_ - VZq < kF9) {
        E("Skipping fast mode prefetch, fetched recently");
        return
    }
    VZq = _;
    let z = async () => {
        let A = o7(),
            O = A?.accessToken && AD() ? {
                accessToken: A.accessToken
            } : q ? {
                apiKey: q
            } : null;
        if (!O) throw Error("No auth available");
        return VF9(O)
    };
    async function Y() {
        try {
            let A;
            try {
                A = await z()
            } catch (w) {
                if (Z1.isAxiosError(w) && (w.response?.status === 401 || w.response?.status === 403 && typeof w.response?.data === "string" && w.response.data.includes("OAuth token has been revoked"))) {
                    let j = o7()?.accessToken;
                    if (j) await $B(j), A = await z();
                    else throw w
                } else throw w
            }
            let O = Lv.status !== "pending" ? Lv.status === "enabled" : H8().penguinModeOrgEnabled;
            if (Lv = A.enabled ? {
                    status: "enabled"
                } : {
                    status: "disabled",
                    reason: A.disabled_reason ?? "preference"
                }, O !== A.enabled) {
                if (!A.enabled) P7("userSettings", {
                    fastMode: void 0
                });
                d8((w) => ({
                    ...w,
                    penguinModeOrgEnabled: A.enabled
                })), ev1.emit(A.enabled)
            }
            E(`Org fast mode: ${A.enabled?"enabled":`disabled (${A.disabled_reason??"preference"})`}`)
        } catch (A) {
            Lv = H8().penguinModeOrgEnabled === !0 ? {
                status: "enabled"
            } : {
                status: "disabled",
                reason: "network_error"
            }, E(`Failed to fetch org fast mode status, defaulting to ${Lv.status==="enabled"?"enabled (cached)":"disabled (network_error)"}: ${A}`, {
                level: "error"
            }), d("tengu_org_penguin_mode_fetch_failed", {})
        } finally {
            wn6 = null
        }
    }
    return wn6 = Y(), wn6
}
// @from(Ln 108847, Col 4)
wB = "Opus 4.6"
// @from(Ln 108848, Col 4)
RT6
// @from(Ln 108848, Col 9)
ov1 = !1
// @from(Ln 108849, Col 4)
kZq
// @from(Ln 108849, Col 9)
NZq
// @from(Ln 108849, Col 14)
EZq
// @from(Ln 108849, Col 19)
yZq
// @from(Ln 108849, Col 24)
RZq
// @from(Ln 108849, Col 29)
SZq
// @from(Ln 108849, Col 34)
Lv
// @from(Ln 108849, Col 38)
ev1
// @from(Ln 108849, Col 43)
bZq
// @from(Ln 108849, Col 48)
kF9 = 30000
// @from(Ln 108850, Col 4)
VZq = 0
// @from(Ln 108851, Col 4)
wn6 = null
// @from(Ln 108852, Col 4)
zf = L(() => {
    CK();
    z3();
    B1();
    y8();
    C8();
    T7();
    h1();
    K8();
    Q8();
    Sq();
    x9();
    G$();
    a1();
    nH();
    RT6 = {
        status: "active"
    }, kZq = l5(), NZq = l5(), EZq = kZq.subscribe, yZq = NZq.subscribe;
    RZq = l5(), SZq = RZq.subscribe;
    Lv = {
        status: "pending"
    }, ev1 = l5(), bZq = ev1.subscribe
})
// @from(Ln 108876, Col 0)
function CT6(q) {
    if (q5() && q) return NF9;
    return jB
}
// @from(Ln 108881, Col 0)
function yF9(q, K) {
    return K.input_tokens / 1e6 * q.inputTokens + K.output_tokens / 1e6 * q.outputTokens + (K.cache_read_input_tokens ?? 0) / 1e6 * q.promptCacheReadTokens + (K.cache_creation_input_tokens ?? 0) / 1e6 * q.promptCacheWriteTokens + (K.server_tool_use?.web_search_requests ?? 0) * q.webSearchRequests
}
// @from(Ln 108885, Col 0)
function LF9(q, K) {
    let _ = o5(q);
    if (_ === AX(qZ8.firstParty)) {
        let O = K.speed === "fast";
        return CT6(O)
    }
    let z = gZ8[_];
    if (z) return z;
    let Y = H8().additionalModelCostsCache,
        A = Y?.[q] ?? Y?.[_];
    if (A) return A;
    return hF9(q, _), gZ8[o5(hv())] ?? EF9
}
// @from(Ln 108899, Col 0)
function hF9(q, K) {
    d("tengu_unknown_model_cost", {
        model: q,
        shortName: K
    }), BO8()
}
// @from(Ln 108906, Col 0)
function qq6(q, K) {
    let _ = LF9(q, K);
    return yF9(_, K)
}
// @from(Ln 108911, Col 0)
function UZ8(q, K) {
    let _ = {
        input_tokens: K.inputTokens,
        output_tokens: K.outputTokens,
        cache_read_input_tokens: K.cacheReadInputTokens,
        cache_creation_input_tokens: K.cacheCreationInputTokens
    };
    return qq6(q, _)
}
// @from(Ln 108921, Col 0)
function xZq(q) {
    if (Number.isInteger(q)) return `$${q}`;
    return `$${q.toFixed(2)}`
}
// @from(Ln 108926, Col 0)
function Yf(q) {
    return `${xZq(q.inputTokens)}/${xZq(q.outputTokens)} per Mtok`
}
// @from(Ln 108929, Col 4)
GQ
// @from(Ln 108929, Col 8)
IZq
// @from(Ln 108929, Col 13)
jB
// @from(Ln 108929, Col 17)
NF9
// @from(Ln 108929, Col 22)
KT1
// @from(Ln 108929, Col 27)
_T1
// @from(Ln 108929, Col 32)
EF9
// @from(Ln 108929, Col 37)
gZ8
// @from(Ln 108930, Col 4)
fo = L(() => {
    C8();
    y8();
    h1();
    zf();
    i76();
    Sq();
    GQ = {
        inputTokens: 3,
        outputTokens: 15,
        promptCacheWriteTokens: 3.75,
        promptCacheReadTokens: 0.3,
        webSearchRequests: 0.01
    }, IZq = {
        inputTokens: 15,
        outputTokens: 75,
        promptCacheWriteTokens: 18.75,
        promptCacheReadTokens: 1.5,
        webSearchRequests: 0.01
    }, jB = {
        inputTokens: 5,
        outputTokens: 25,
        promptCacheWriteTokens: 6.25,
        promptCacheReadTokens: 0.5,
        webSearchRequests: 0.01
    }, NF9 = {
        inputTokens: 30,
        outputTokens: 150,
        promptCacheWriteTokens: 37.5,
        promptCacheReadTokens: 3,
        webSearchRequests: 0.01
    }, KT1 = {
        inputTokens: 0.8,
        outputTokens: 4,
        promptCacheWriteTokens: 1,
        promptCacheReadTokens: 0.08,
        webSearchRequests: 0.01
    }, _T1 = {
        inputTokens: 1,
        outputTokens: 5,
        promptCacheWriteTokens: 1.25,
        promptCacheReadTokens: 0.1,
        webSearchRequests: 0.01
    }, EF9 = jB;
    gZ8 = {
        [AX(Cf1.firstParty)]: KT1,
        [AX(bf1.firstParty)]: _T1,
        [AX(Sf1.firstParty)]: GQ,
        [AX(Rf1.firstParty)]: GQ,
        [AX(If1.firstParty)]: GQ,
        [AX(xf1.firstParty)]: GQ,
        [AX(uf1.firstParty)]: GQ,
        [AX(mf1.firstParty)]: IZq,
        [AX(Bf1.firstParty)]: IZq,
        [AX(pf1.firstParty)]: jB,
        [AX(qZ8.firstParty)]: jB,
        [AX(Ff1.firstParty)]: jB
    }
})
// @from(Ln 108990, Col 0)
function Go(q) {
    return Yw6.includes(q)
}
// @from(Ln 108994, Col 0)
function bT6(q) {
    return RF9.includes(q)
}
// @from(Ln 108997, Col 4)
Yw6
// @from(Ln 108997, Col 9)
RF9
// @from(Ln 108998, Col 4)
IT6 = L(() => {
    Yw6 = ["sonnet", "opus", "haiku", "best", "sonnet[1m]", "opus[1m]", "opusplan"];
    RF9 = ["sonnet", "opus", "haiku"]
})
// @from(Ln 109003, Col 0)
function SF9(q, K) {
    if (q.includes(K)) return !0;
    if (Go(q)) return K5(q).toLowerCase().includes(K);
    return !1
}
// @from(Ln 109009, Col 0)
function uZq(q, K) {
    if (!q.startsWith(K)) return !1;
    return q.length === K.length || q[K.length] === "-"
}
// @from(Ln 109014, Col 0)
function CF9(q, K) {
    let _ = Go(q) ? K5(q).toLowerCase() : q;
    if (uZq(_, K)) return !0;
    if (!K.startsWith("claude-") && uZq(_, `claude-${K}`)) return !0;
    return !1
}
// @from(Ln 109021, Col 0)
function mZq(q, K) {
    for (let _ of K) {
        if (bT6(_)) continue;
        let z = _.indexOf(q);
        if (z === -1) continue;
        let Y = z + q.length;
        if (Y === _.length || _[Y] === "-") return !0
    }
    return !1
}
// @from(Ln 109032, Col 0)
function Kq6(q) {
    let K = y7() || {},
        {
            availableModels: _
        } = K;
    if (!_) return !0;
    if (_.length === 0) return !1;
    let z = _.map((w) => w.trim().toLowerCase()),
        Y = q.trim().toLowerCase();
    if (Y.startsWith("anthropic.") && z.includes(Y)) return !0;
    let O = zZ8(q).trim().toLowerCase();
    if (z.includes(O)) {
        if (!bT6(O) || !mZq(O, z)) return !0
    }
    for (let w of z)
        if (bT6(w) && !mZq(w, z) && SF9(O, w)) return !0;
    if (Go(O)) {
        let w = K5(O).toLowerCase();
        if (z.includes(w)) return !0
    }
    for (let w of z)
        if (!bT6(w) && Go(w)) {
            if (K5(w).toLowerCase() === O) return !0
        } for (let w of z)
        if (!bT6(w) && !Go(w)) {
            if (CF9(O, w)) return !0
        } return !1
}
// @from(Ln 109060, Col 4)
jn6 = L(() => {
    a1();
    IT6();
    Sq();
    jQ()
})
// @from(Ln 109066, Col 4)
cZ8 = {}
// @from(Ln 109101, Col 0)
function OM() {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || xT6()
}
// @from(Ln 109105, Col 0)
function Aw6(q) {
    let K = o5(q);
    return K === "claude-opus-4" || K === "claude-opus-4-1" || K === "claude-opus-4-5" || K === "claude-opus-4-6" || K === "claude-opus-4-7"
}
// @from(Ln 109110, Col 0)
function Ub() {
    let q, K = qm();
    if (K !== void 0) q = K;
    else {
        let _ = y7() || {};
        q = process.env.ANTHROPIC_MODEL || _.model || void 0
    }
    if (q && !Kq6(q)) return;
    return q
}
// @from(Ln 109121, Col 0)
function G5() {
    let q = Ub();
    if (q !== void 0 && q !== null) return K5(q);
    return ZP()
}
// @from(Ln 109127, Col 0)
function BZq() {
    return LE()
}
// @from(Ln 109131, Col 0)
function LE() {
    if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (!KA()) return ZO()[vQ];
    return ZO().opus47
}
// @from(Ln 109137, Col 0)
function Af() {
    if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    if (!KA()) return ZO()[TQ];
    return ZO().sonnet46
}
// @from(Ln 109143, Col 0)
function xT6() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return ZO()[VQ]
}
// @from(Ln 109148, Col 0)
function bF9(q) {
    return Af() + (DP(q) ? "[1m]" : "")
}
// @from(Ln 109152, Col 0)
function HB(q) {
    let {
        permissionMode: K,
        mainLoopModel: _,
        exceeds200kTokens: z = !1
    } = q;
    if (Ub() === "opusplan" && K === "plan" && !z) return LE();
    if (Ub() === "haiku" && K === "plan") return Af();
    return _
}
// @from(Ln 109163, Col 0)
function hv() {
    if (ch()) return LE() + (YX() ? "[1m]" : "");
    if (Yq6()) return LE() + (YX() ? "[1m]" : "");
    return Af()
}
// @from(Ln 109169, Col 0)
function ZP() {
    return K5(hv())
}
// @from(Ln 109173, Col 0)
function AX(q) {
    if (q = q.toLowerCase(), q.includes("claude-opus-4-7")) return "claude-opus-4-7";
    if (q.includes("claude-opus-4-6")) return "claude-opus-4-6";
    if (q.includes("claude-opus-4-5")) return "claude-opus-4-5";
    if (q.includes("claude-opus-4-1")) return "claude-opus-4-1";
    if (q.includes("claude-opus-4")) return "claude-opus-4";
    if (q.includes("claude-sonnet-4-6")) return "claude-sonnet-4-6";
    if (q.includes("claude-sonnet-4-5")) return "claude-sonnet-4-5";
    if (q.includes("claude-sonnet-4")) return "claude-sonnet-4";
    if (q.includes("claude-haiku-4-5")) return "claude-haiku-4-5";
    if (q.includes("claude-3-7-sonnet")) return "claude-3-7-sonnet";
    if (q.includes("claude-3-5-sonnet")) return "claude-3-5-sonnet";
    if (q.includes("claude-3-5-haiku")) return "claude-3-5-haiku";
    if (q.includes("claude-3-opus")) return "claude-3-opus";
    if (q.includes("claude-3-sonnet")) return "claude-3-sonnet";
    if (q.includes("claude-3-haiku")) return "claude-3-haiku";
    return q.replace(/-\d{8}$/, "")
}
// @from(Ln 109192, Col 0)
function o5(q) {
    return AX(zZ8(q))
}
// @from(Ln 109196, Col 0)
function uT6(q = !1) {
    if (ch() || Yq6()) {
        if (YX()) return "Opus 4.7 with 1M context · Most capable for complex work";
        return "Opus 4.7 · Most capable for complex work"
    }
    return "Sonnet 4.6 · Best for everyday tasks"
}
// @from(Ln 109204, Col 0)
function Hn6(q) {
    if (q === "opusplan") return "Opus in plan mode, else Sonnet";
    return YJ(K5(q))
}
// @from(Ln 109209, Col 0)
function QZ8(q) {
    if (pq() !== "firstParty") return "";
    let K = Yf(CT6(q));
    return ` ·${q?` (${B16})`:""} ${K}`
}
// @from(Ln 109215, Col 0)
function YX() {
    if (zq6() || JB() || pq() !== "firstParty") return !1;
    if (i7() && MK() === null) return !1;
    return !0
}
// @from(Ln 109221, Col 0)
function Jn6(q) {
    if (q === "opusplan") return "Opus Plan";
    if (Go(q)) return zv(q);
    return YJ(q)
}
// @from(Ln 109227, Col 0)
function _q6(q) {
    let K = q.endsWith("[1m]") ? " (1M context)" : "";
    switch (o5(q)) {
        case "claude-opus-4-7":
            return "Opus 4.7" + K;
        case "claude-opus-4-6":
            return "Opus 4.6" + K;
        case "claude-opus-4-5":
            return "Opus 4.5" + K;
        case "claude-opus-4-1":
            return "Opus 4.1" + K;
        case "claude-opus-4":
            return "Opus 4" + K;
        case "claude-sonnet-4-6":
            return "Sonnet 4.6" + K;
        case "claude-sonnet-4-5":
            return "Sonnet 4.5" + K;
        case "claude-sonnet-4":
            return "Sonnet 4" + K;
        case "claude-3-7-sonnet":
            return "Sonnet 3.7";
        case "claude-3-5-sonnet":
            return "Sonnet 3.5";
        case "claude-haiku-4-5":
            return "Haiku 4.5" + K;
        case "claude-3-5-haiku":
            return "Haiku 3.5";
        default:
            return null
    }
}
// @from(Ln 109259, Col 0)
function YJ(q) {
    let K = _q6(q);
    if (K) return K;
    return q
}
// @from(Ln 109265, Col 0)
function zT1(q) {
    let K = _q6(q);
    if (K) return `Claude ${K}`;
    return `Claude (${q})`
}
// @from(Ln 109271, Col 0)
function K5(q) {
    let K = q.trim(),
        _ = K.toLowerCase(),
        z = DP(_),
        Y = z ? _.replace(/\[1m]$/i, "").trim() : _;
    if (Go(Y)) switch (Y) {
        case "opusplan":
            return Af() + (z ? "[1m]" : "");
        case "sonnet":
            return Af() + (z ? "[1m]" : "");
        case "haiku":
            return xT6() + (z ? "[1m]" : "");
        case "opus":
            return LE() + (z ? "[1m]" : "");
        case "best":
            return BZq();
        default:
    }
    if (KA() && xF9(Y) && dZ8()) return LE() + (z ? "[1m]" : "");
    if (z) return K.replace(/\[1m\]$/i, "").trim() + "[1m]";
    return K
}
// @from(Ln 109294, Col 0)
function Xn6(q, K) {
    if (DP(q) || !DP(K)) return q;
    if (vo(K5(q))) return q + "[1m]";
    return q
}
// @from(Ln 109300, Col 0)
function xF9(q) {
    return IF9.includes(q)
}
// @from(Ln 109304, Col 0)
function dZ8() {
    return !S6(process.env.CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP)
}
// @from(Ln 109308, Col 0)
function hE(q) {
    if (q === null) {
        if (i7()) return `Default (${uT6()})`;
        return `Default (${ZP()})`
    }
    let K = K5(q);
    return q === K ? K : `${q} (${K})`
}
// @from(Ln 109317, Col 0)
function xW(q) {
    if (pq() === "foundry") return;
    let K = q.toLowerCase().includes("[1m]"),
        _ = o5(q);
    if (_.includes("claude-opus-4-7")) return K ? "Opus 4.7 (1M context)" : "Opus 4.7";
    if (_.includes("claude-opus-4-6")) return K ? "Opus 4.6 (1M context)" : "Opus 4.6";
    if (_.includes("claude-opus-4-5")) return "Opus 4.5";
    if (_.includes("claude-opus-4-1")) return "Opus 4.1";
    if (_.includes("claude-opus-4")) return "Opus 4";
    if (_.includes("claude-sonnet-4-6")) return K ? "Sonnet 4.6 (1M context)" : "Sonnet 4.6";
    if (_.includes("claude-sonnet-4-5")) return K ? "Sonnet 4.5 (1M context)" : "Sonnet 4.5";
    if (_.includes("claude-sonnet-4")) return K ? "Sonnet 4 (1M context)" : "Sonnet 4";
    if (_.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
    if (_.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
    if (_.includes("claude-haiku-4-5")) return "Haiku 4.5";
    if (_.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
    return
}
// @from(Ln 109336, Col 0)
function Of(q) {
    return q.replace(/\[(1|2)m\]/gi, "")
}
// @from(Ln 109339, Col 4)
vQ = "opus46"
// @from(Ln 109340, Col 4)
TQ = "sonnet45"
// @from(Ln 109341, Col 4)
VQ = "haiku45"
// @from(Ln 109342, Col 4)
IF9
// @from(Ln 109343, Col 4)
Sq = L(() => {
    y8();
    T7();
    AJ();
    Q8();
    jQ();
    fo();
    a1();
    x9();
    A3();
    jn6();
    IT6();
    IF9 = ["claude-opus-4-20250514", "claude-opus-4-1-20250805", "claude-opus-4-0", "claude-opus-4-1"]
})
// @from(Ln 109358, Col 0)
function mT6(q) {
    if (q <= 1) return !1;
    try {
        return process.kill(q, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 109366, Col 0)
async function pZq(q, K = 10) {
    if (process.platform === "win32") {
        let Y = `
      $pid = ${String(q)}
      $ancestors = @()
      for ($i = 0; $i -lt ${K}; $i++) {
        $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
        if (-not $proc -or -not $proc.ParentProcessId -or $proc.ParentProcessId -eq 0) { break }
        $pid = $proc.ParentProcessId
        $ancestors += $pid
      }
      $ancestors -join ','
    `.trim(),
            A = await M7("powershell.exe", ["-NoProfile", "-Command", Y], {
                timeout: 3000
            });
        if (A.code !== 0 || !A.stdout?.trim()) return [];
        return A.stdout.trim().split(",").filter(Boolean).map((O) => parseInt(O, 10)).filter((O) => !isNaN(O))
    }
    let _ = `pid=${String(q)}; for i in $(seq 1 ${K}); do ppid=$(ps -o ppid= -p $pid 2>/dev/null | tr -d ' '); if [ -z "$ppid" ] || [ "$ppid" = "0" ] || [ "$ppid" = "1" ]; then break; fi; echo $ppid; pid=$ppid; done`,
        z = await M7("sh", ["-c", _], {
            timeout: 3000
        });
    if (z.code !== 0 || !z.stdout?.trim()) return [];
    return z.stdout.trim().split(`
`).filter(Boolean).map((Y) => parseInt(Y, 10)).filter((Y) => !isNaN(Y))
}
// @from(Ln 109394, Col 0)
function FZq(q) {
    try {
        let K = String(q),
            _ = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${K}\\").CommandLine"` : `ps -o command= -p ${K}`,
            z = oC(_, {
                timeout: 1000
            });
        return z ? z.trim() : null
    } catch {
        return null
    }
}
// @from(Ln 109406, Col 0)
async function gZq(q, K = 10) {
    if (process.platform === "win32") {
        let Y = `
      $currentPid = ${String(q)}
      $commands = @()
      for ($i = 0; $i -lt ${K}; $i++) {
        $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$currentPid" -ErrorAction SilentlyContinue
        if (-not $proc) { break }
        if ($proc.CommandLine) { $commands += $proc.CommandLine }
        if (-not $proc.ParentProcessId -or $proc.ParentProcessId -eq 0) { break }
        $currentPid = $proc.ParentProcessId
      }
      $commands -join [char]0
    `.trim(),
            A = await M7("powershell.exe", ["-NoProfile", "-Command", Y], {
                timeout: 3000
            });
        if (A.code !== 0 || !A.stdout?.trim()) return [];
        return A.stdout.split("\x00").filter(Boolean)
    }
    let _ = `currentpid=${String(q)}; for i in $(seq 1 ${K}); do cmd=$(ps -o command= -p $currentpid 2>/dev/null); if [ -n "$cmd" ]; then printf '%s\\0' "$cmd"; fi; ppid=$(ps -o ppid= -p $currentpid 2>/dev/null | tr -d ' '); if [ -z "$ppid" ] || [ "$ppid" = "0" ] || [ "$ppid" = "1" ]; then break; fi; currentpid=$ppid; done`,
        z = await M7("sh", ["-c", _], {
            timeout: 3000
        });
    if (z.code !== 0 || !z.stdout?.trim()) return [];
    return z.stdout.split("\x00").filter(Boolean)
}
// @from(Ln 109433, Col 4)
Ow6 = L(() => {
    Q4()
})
// @from(Ln 109440, Col 0)
function uW() {
    return YT1.getStore()
}
// @from(Ln 109444, Col 0)
function lZ8(q, K) {
    return YT1.run(q, K)
}
// @from(Ln 109448, Col 0)
function $D() {
    return YT1.getStore() !== void 0
}
// @from(Ln 109452, Col 0)
function nZ8(q) {
    return {
        ...q,
        isInProcess: !0
    }
}
// @from(Ln 109458, Col 4)
YT1
// @from(Ln 109459, Col 4)
Rv = L(() => {
    YT1 = new uF9
})
// @from(Ln 109462, Col 4)
wT1 = {}
// @from(Ln 109484, Col 0)
function kQ() {
    let q = uW();
    if (q) return q.parentSessionId;
    return lh?.parentSessionId
}
// @from(Ln 109490, Col 0)
function mF9(q) {
    lh = q
}
// @from(Ln 109494, Col 0)
function BF9() {
    lh = null
}
// @from(Ln 109498, Col 0)
function Mn6() {
    return lh
}
// @from(Ln 109502, Col 0)
function mW() {
    let q = uW();
    if (q) return q.agentId;
    return lh?.agentId
}
// @from(Ln 109508, Col 0)
function T_() {
    let q = uW();
    if (q) return q.agentName;
    return lh?.agentName
}
// @from(Ln 109514, Col 0)
function Z9(q) {
    let K = uW();
    if (K) return K.teamName;
    if (lh?.teamName) return lh.teamName;
    return q?.teamName
}
// @from(Ln 109521, Col 0)
function Lz() {
    if (uW()) return !0;
    return !!(lh?.agentId && lh?.teamName)
}
// @from(Ln 109526, Col 0)
function KH() {
    let q = uW();
    if (q) return q.color;
    return lh?.color
}
// @from(Ln 109532, Col 0)
function Pn6() {
    let q = uW();
    if (q) return q.planModeRequired;
    if (lh !== null) return lh.planModeRequired;
    return S6(process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED)
}
// @from(Ln 109539, Col 0)
function Sv(q) {
    if (!q?.leadAgentId) return !1;
    let K = mW(),
        _ = q.leadAgentId;
    if (K === _) return !0;
    if (!K) return !0;
    return !1
}
// @from(Ln 109548, Col 0)
function iZ8(q) {
    for (let K of Object.values(q.tasks))
        if (K.type === "in_process_teammate" && K.status === "running") return !0;
    return !1
}
// @from(Ln 109554, Col 0)
function AT1(q) {
    for (let K of Object.values(q.tasks))
        if (K.type === "in_process_teammate" && K.status === "running" && !K.isIdle) return !0;
    return !1
}
// @from(Ln 109560, Col 0)
function OT1(q, K) {
    let _ = [];
    for (let [z, Y] of Object.entries(K.tasks))
        if (Y.type === "in_process_teammate" && Y.status === "running" && !Y.isIdle) _.push(z);
    if (_.length === 0) return Promise.resolve();
    return new Promise((z) => {
        let Y = _.length,
            A = () => {
                if (Y--, Y === 0) z()
            };
        q((O) => {
            let w = {
                ...O.tasks
            };
            for (let $ of _) {
                let j = w[$];
                if (j && j.type === "in_process_teammate")
                    if (j.isIdle) A();
                    else w[$] = {
                        ...j,
                        onIdleCallbacks: [...j.onIdleCallbacks ?? [], A]
                    }
            }
            return {
                ...O,
                tasks: w
            }
        })
    })
}
// @from(Ln 109590, Col 4)
lh = null
// @from(Ln 109591, Col 4)
zY = L(() => {
    Rv();
    Q8();
    Rv()
})
// @from(Ln 109608, Col 0)
function $T1() {
    return rZ8(A7(), "sessions")
}
// @from(Ln 109612, Col 0)
function oZ8() {
    return
}
// @from(Ln 109616, Col 0)
function BT6() {
    return oZ8() === "bg"
}
// @from(Ln 109619, Col 0)
async function lZq() {
    if (mW() != null) return !1;
    let q = oZ8() ?? "interactive",
        K = $T1(),
        _ = rZ8(K, `${process.pid}.json`);
    eq(async () => {
        try {
            await dZq(_)
        } catch {}
    });
    try {
        return await FF9(K, {
            recursive: !0,
            mode: 448
        }), await pF9(K, 448), await cZq(_, I6({
            pid: process.pid,
            sessionId: I8(),
            cwd: Y7(),
            startedAt: Date.now(),
            kind: q,
            entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT,
            ...{},
            ...{}
        })), N61((z) => {
            jT1({
                sessionId: z
            })
        }), !0
    } catch (z) {
        return E(`[concurrentSessions] register failed: ${b6(z)}`), !1
    }
}
// @from(Ln 109651, Col 0)
async function jT1(q) {
    let K = rZ8($T1(), `${process.pid}.json`),
        _ = QZq.then(async () => {
            try {
                let z = n8(await UF9(K, "utf8"));
                await cZq(K, I6({
                    ...z,
                    ...q
                }))
            } catch (z) {
                E(`[concurrentSessions] updatePidFile failed: ${b6(z)}`)
            }
        });
    QZq = _, await _
}
// @from(Ln 109666, Col 0)
async function NQ(q) {
    if (!q) return;
    await jT1({
        name: q
    })
}
// @from(Ln 109672, Col 0)
async function nZq(q) {
    await jT1({
        bridgeSessionId: q
    })
}
// @from(Ln 109677, Col 0)
async function aZ8() {
    let q = $T1(),
        K;
    try {
        K = await gF9(q)
    } catch (z) {
        if (!D5(z)) E(`[concurrentSessions] readdir failed: ${b6(z)}`);
        return 0
    }
    let _ = 0;
    for (let z of K) {
        if (!/^\d+\.json$/.test(z)) continue;
        let Y = parseInt(z.slice(0, -5), 10);
        if (Y === process.pid) {
            _++;
            continue
        }
        if (mT6(Y)) _++;
        else if (y1() !== "wsl") dZq(rZ8(q, z)).catch(() => {})
    }
    return _
}
// @from(Ln 109699, Col 4)
QZq
// @from(Ln 109700, Col 4)
wf = L(() => {
    y8();
    R9();
    K8();
    Q8();
    m8();
    Ow6();
    NK();
    e8();
    zY();
    QZq = Promise.resolve()
})
// @from(Ln 109712, Col 4)
JT1 = p((nHO, tZ8) => {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var iZq, rZq, oZq, aZq, sZq, tZq, eZq, qfq, Kfq, sZ8, HT1, _fq, zfq, pT6, Yfq, Afq, Ofq, wfq, $fq, jfq, Hfq, Jfq, Xfq;
    (function(q) {
        var K = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(z) {
            q(_(K, _(z)))
        });
        else if (typeof tZ8 === "object" && typeof nHO === "object") q(_(K, _(nHO)));
        else q(_(K));

        function _(z, Y) {
            if (z !== K)
                if (typeof Object.create === "function") Object.defineProperty(z, "__esModule", {
                    value: !0
                });
                else z.__esModule = !0;
            return function(A, O) {
                return z[A] = Y ? Y(A, O) : O
            }
        }
    })(function(q) {
        var K = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(_, z) {
            _.__proto__ = z
        } || function(_, z) {
            for (var Y in z)
                if (z.hasOwnProperty(Y)) _[Y] = z[Y]
        };
        iZq = function(_, z) {
            K(_, z);

            function Y() {
                this.constructor = _
            }
            _.prototype = z === null ? Object.create(z) : (Y.prototype = z.prototype, new Y)
        }, rZq = Object.assign || function(_) {
            for (var z, Y = 1, A = arguments.length; Y < A; Y++) {
                z = arguments[Y];
                for (var O in z)
                    if (Object.prototype.hasOwnProperty.call(z, O)) _[O] = z[O]
            }
            return _
        }, oZq = function(_, z) {
            var Y = {};
            for (var A in _)
                if (Object.prototype.hasOwnProperty.call(_, A) && z.indexOf(A) < 0) Y[A] = _[A];
            if (_ != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var O = 0, A = Object.getOwnPropertySymbols(_); O < A.length; O++)
                    if (z.indexOf(A[O]) < 0 && Object.prototype.propertyIsEnumerable.call(_, A[O])) Y[A[O]] = _[A[O]]
            }
            return Y
        }, aZq = function(_, z, Y, A) {
            var O = arguments.length,
                w = O < 3 ? z : A === null ? A = Object.getOwnPropertyDescriptor(z, Y) : A,
                $;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") w = Reflect.decorate(_, z, Y, A);
            else
                for (var j = _.length - 1; j >= 0; j--)
                    if ($ = _[j]) w = (O < 3 ? $(w) : O > 3 ? $(z, Y, w) : $(z, Y)) || w;
            return O > 3 && w && Object.defineProperty(z, Y, w), w
        }, sZq = function(_, z) {
            return function(Y, A) {
                z(Y, A, _)
            }
        }, tZq = function(_, z) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(_, z)
        }, eZq = function(_, z, Y, A) {
            function O(w) {
                return w instanceof Y ? w : new Y(function($) {
                    $(w)
                })
            }
            return new(Y || (Y = Promise))(function(w, $) {
                function j(X) {
                    try {
                        J(A.next(X))
                    } catch (M) {
                        $(M)
                    }
                }

                function H(X) {
                    try {
                        J(A.throw(X))
                    } catch (M) {
                        $(M)
                    }
                }

                function J(X) {
                    X.done ? w(X.value) : O(X.value).then(j, H)
                }
                J((A = A.apply(_, z || [])).next())
            })
        }, qfq = function(_, z) {
            var Y = {
                    label: 0,
                    sent: function() {
                        if (w[0] & 1) throw w[1];
                        return w[1]
                    },
                    trys: [],
                    ops: []
                },
                A, O, w, $;
            return $ = {
                next: j(0),
                throw: j(1),
                return: j(2)
            }, typeof Symbol === "function" && ($[Symbol.iterator] = function() {
                return this
            }), $;

            function j(J) {
                return function(X) {
                    return H([J, X])
                }
            }

            function H(J) {
                if (A) throw TypeError("Generator is already executing.");
                while (Y) try {
                    if (A = 1, O && (w = J[0] & 2 ? O.return : J[0] ? O.throw || ((w = O.return) && w.call(O), 0) : O.next) && !(w = w.call(O, J[1])).done) return w;
                    if (O = 0, w) J = [J[0] & 2, w.value];
                    switch (J[0]) {
                        case 0:
                        case 1:
                            w = J;
                            break;
                        case 4:
                            return Y.label++, {
                                value: J[1],
                                done: !1
                            };
                        case 5:
                            Y.label++, O = J[1], J = [0];
                            continue;
                        case 7:
                            J = Y.ops.pop(), Y.trys.pop();
                            continue;
                        default:
                            if ((w = Y.trys, !(w = w.length > 0 && w[w.length - 1])) && (J[0] === 6 || J[0] === 2)) {
                                Y = 0;
                                continue
                            }
                            if (J[0] === 3 && (!w || J[1] > w[0] && J[1] < w[3])) {
                                Y.label = J[1];
                                break
                            }
                            if (J[0] === 6 && Y.label < w[1]) {
                                Y.label = w[1], w = J;
                                break
                            }
                            if (w && Y.label < w[2]) {
                                Y.label = w[2], Y.ops.push(J);
                                break
                            }
                            if (w[2]) Y.ops.pop();
                            Y.trys.pop();
                            continue
                    }
                    J = z.call(_, Y)
                } catch (X) {
                    J = [6, X], O = 0
                } finally {
                    A = w = 0
                }
                if (J[0] & 5) throw J[1];
                return {
                    value: J[0] ? J[1] : void 0,
                    done: !0
                }
            }
        }, Xfq = function(_, z, Y, A) {
            if (A === void 0) A = Y;
            _[A] = z[Y]
        }, Kfq = function(_, z) {
            for (var Y in _)
                if (Y !== "default" && !z.hasOwnProperty(Y)) z[Y] = _[Y]
        }, sZ8 = function(_) {
            var z = typeof Symbol === "function" && Symbol.iterator,
                Y = z && _[z],
                A = 0;
            if (Y) return Y.call(_);
            if (_ && typeof _.length === "number") return {
                next: function() {
                    if (_ && A >= _.length) _ = void 0;
                    return {
                        value: _ && _[A++],
                        done: !_
                    }
                }
            };
            throw TypeError(z ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, HT1 = function(_, z) {
            var Y = typeof Symbol === "function" && _[Symbol.iterator];
            if (!Y) return _;
            var A = Y.call(_),
                O, w = [],
                $;
            try {
                while ((z === void 0 || z-- > 0) && !(O = A.next()).done) w.push(O.value)
            } catch (j) {
                $ = {
                    error: j
                }
            } finally {
                try {
                    if (O && !O.done && (Y = A.return)) Y.call(A)
                } finally {
                    if ($) throw $.error
                }
            }
            return w
        }, _fq = function() {
            for (var _ = [], z = 0; z < arguments.length; z++) _ = _.concat(HT1(arguments[z]));
            return _
        }, zfq = function() {
            for (var _ = 0, z = 0, Y = arguments.length; z < Y; z++) _ += arguments[z].length;
            for (var A = Array(_), O = 0, z = 0; z < Y; z++)
                for (var w = arguments[z], $ = 0, j = w.length; $ < j; $++, O++) A[O] = w[$];
            return A
        }, pT6 = function(_) {
            return this instanceof pT6 ? (this.v = _, this) : new pT6(_)
        }, Yfq = function(_, z, Y) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var A = Y.apply(_, z || []),
                O, w = [];
            return O = {}, $("next"), $("throw"), $("return"), O[Symbol.asyncIterator] = function() {
                return this
            }, O;

            function $(P) {
                if (A[P]) O[P] = function(W) {
                    return new Promise(function(D, Z) {
                        w.push([P, W, D, Z]) > 1 || j(P, W)
                    })
                }
            }

            function j(P, W) {
                try {
                    H(A[P](W))
                } catch (D) {
                    M(w[0][3], D)
                }
            }

            function H(P) {
                P.value instanceof pT6 ? Promise.resolve(P.value.v).then(J, X) : M(w[0][2], P)
            }

            function J(P) {
                j("next", P)
            }

            function X(P) {
                j("throw", P)
            }

            function M(P, W) {
                if (P(W), w.shift(), w.length) j(w[0][0], w[0][1])
            }
        }, Afq = function(_) {
            var z, Y;
            return z = {}, A("next"), A("throw", function(O) {
                throw O
            }), A("return"), z[Symbol.iterator] = function() {
                return this
            }, z;

            function A(O, w) {
                z[O] = _[O] ? function($) {
                    return (Y = !Y) ? {
                        value: pT6(_[O]($)),
                        done: O === "return"
                    } : w ? w($) : $
                } : w
            }
        }, Ofq = function(_) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var z = _[Symbol.asyncIterator],
                Y;
            return z ? z.call(_) : (_ = typeof sZ8 === "function" ? sZ8(_) : _[Symbol.iterator](), Y = {}, A("next"), A("throw"), A("return"), Y[Symbol.asyncIterator] = function() {
                return this
            }, Y);

            function A(w) {
                Y[w] = _[w] && function($) {
                    return new Promise(function(j, H) {
                        $ = _[w]($), O(j, H, $.done, $.value)
                    })
                }
            }

            function O(w, $, j, H) {
                Promise.resolve(H).then(function(J) {
                    w({
                        value: J,
                        done: j
                    })
                }, $)
            }
        }, wfq = function(_, z) {
            if (Object.defineProperty) Object.defineProperty(_, "raw", {
                value: z
            });
            else _.raw = z;
            return _
        }, $fq = function(_) {
            if (_ && _.__esModule) return _;
            var z = {};
            if (_ != null) {
                for (var Y in _)
                    if (Object.hasOwnProperty.call(_, Y)) z[Y] = _[Y]
            }
            return z.default = _, z
        }, jfq = function(_) {
            return _ && _.__esModule ? _ : {
                default: _
            }
        }, Hfq = function(_, z) {
            if (!z.has(_)) throw TypeError("attempted to get private field on non-instance");
            return z.get(_)
        }, Jfq = function(_, z, Y) {
            if (!z.has(_)) throw TypeError("attempted to set private field on non-instance");
            return z.set(_, Y), Y
        }, q("__extends", iZq), q("__assign", rZq), q("__rest", oZq), q("__decorate", aZq), q("__param", sZq), q("__metadata", tZq), q("__awaiter", eZq), q("__generator", qfq), q("__exportStar", Kfq), q("__createBinding", Xfq), q("__values", sZ8), q("__read", HT1), q("__spread", _fq), q("__spreadArrays", zfq), q("__await", pT6), q("__asyncGenerator", Yfq), q("__asyncDelegator", Afq), q("__asyncValues", Ofq), q("__makeTemplateObject", wfq), q("__importStar", $fq), q("__importDefault", jfq), q("__classPrivateFieldGet", Hfq), q("__classPrivateFieldSet", Jfq)
    })
})
// @from(Ln 110058, Col 4)
XT1 = p((Mfq) => {
    Object.defineProperty(Mfq, "__esModule", {
        value: !0
    });
    Mfq.MAX_HASHABLE_LENGTH = Mfq.INIT = Mfq.KEY = Mfq.DIGEST_LENGTH = Mfq.BLOCK_SIZE = void 0;
    Mfq.BLOCK_SIZE = 64;
    Mfq.DIGEST_LENGTH = 32;
    Mfq.KEY = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
    Mfq.INIT = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    Mfq.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1
})
// @from(Ln 110069, Col 4)
Zfq = p((Wfq) => {
    Object.defineProperty(Wfq, "__esModule", {
        value: !0
    });
    Wfq.RawSha256 = void 0;
    var Qb = XT1(),
        nF9 = function() {
            function q() {
                this.state = Int32Array.from(Qb.INIT), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1
            }
            return q.prototype.update = function(K) {
                if (this.finished) throw Error("Attempted to update an already finished hash.");
                var _ = 0,
                    z = K.byteLength;
                if (this.bytesHashed += z, this.bytesHashed * 8 > Qb.MAX_HASHABLE_LENGTH) throw Error("Cannot hash more than 2^53 - 1 bits");
                while (z > 0)
                    if (this.buffer[this.bufferLength++] = K[_++], z--, this.bufferLength === Qb.BLOCK_SIZE) this.hashBuffer(), this.bufferLength = 0
            }, q.prototype.digest = function() {
                if (!this.finished) {
                    var K = this.bytesHashed * 8,
                        _ = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength),
                        z = this.bufferLength;
                    if (_.setUint8(this.bufferLength++, 128), z % Qb.BLOCK_SIZE >= Qb.BLOCK_SIZE - 8) {
                        for (var Y = this.bufferLength; Y < Qb.BLOCK_SIZE; Y++) _.setUint8(Y, 0);
                        this.hashBuffer(), this.bufferLength = 0
                    }
                    for (var Y = this.bufferLength; Y < Qb.BLOCK_SIZE - 8; Y++) _.setUint8(Y, 0);
                    _.setUint32(Qb.BLOCK_SIZE - 8, Math.floor(K / 4294967296), !0), _.setUint32(Qb.BLOCK_SIZE - 4, K), this.hashBuffer(), this.finished = !0
                }
                var A = new Uint8Array(Qb.DIGEST_LENGTH);
                for (var Y = 0; Y < 8; Y++) A[Y * 4] = this.state[Y] >>> 24 & 255, A[Y * 4 + 1] = this.state[Y] >>> 16 & 255, A[Y * 4 + 2] = this.state[Y] >>> 8 & 255, A[Y * 4 + 3] = this.state[Y] >>> 0 & 255;
                return A
            }, q.prototype.hashBuffer = function() {
                var K = this,
                    _ = K.buffer,
                    z = K.state,
                    Y = z[0],
                    A = z[1],
                    O = z[2],
                    w = z[3],
                    $ = z[4],
                    j = z[5],
                    H = z[6],
                    J = z[7];
                for (var X = 0; X < Qb.BLOCK_SIZE; X++) {
                    if (X < 16) this.temp[X] = (_[X * 4] & 255) << 24 | (_[X * 4 + 1] & 255) << 16 | (_[X * 4 + 2] & 255) << 8 | _[X * 4 + 3] & 255;
                    else {
                        var M = this.temp[X - 2],
                            P = (M >>> 17 | M << 15) ^ (M >>> 19 | M << 13) ^ M >>> 10;
                        M = this.temp[X - 15];
                        var W = (M >>> 7 | M << 25) ^ (M >>> 18 | M << 14) ^ M >>> 3;
                        this.temp[X] = (P + this.temp[X - 7] | 0) + (W + this.temp[X - 16] | 0)
                    }
                    var D = ((($ >>> 6 | $ << 26) ^ ($ >>> 11 | $ << 21) ^ ($ >>> 25 | $ << 7)) + ($ & j ^ ~$ & H) | 0) + (J + (Qb.KEY[X] + this.temp[X] | 0) | 0) | 0,
                        Z = ((Y >>> 2 | Y << 30) ^ (Y >>> 13 | Y << 19) ^ (Y >>> 22 | Y << 10)) + (Y & A ^ Y & O ^ A & O) | 0;
                    J = H, H = j, j = $, $ = w + D | 0, w = O, O = A, A = Y, Y = D + Z | 0
                }
                z[0] += Y, z[1] += A, z[2] += O, z[3] += w, z[4] += $, z[5] += j, z[6] += H, z[7] += J
            }, q
        }();
    Wfq.RawSha256 = nF9
})
// @from(Ln 110131, Col 4)
vfq = p((ffq) => {
    Object.defineProperty(ffq, "__esModule", {
        value: !0
    });
    ffq.toUtf8 = ffq.fromUtf8 = void 0;
    var iF9 = (q) => {
        let K = [];
        for (let _ = 0, z = q.length; _ < z; _++) {
            let Y = q.charCodeAt(_);
            if (Y < 128) K.push(Y);
            else if (Y < 2048) K.push(Y >> 6 | 192, Y & 63 | 128);
            else if (_ + 1 < q.length && (Y & 64512) === 55296 && (q.charCodeAt(_ + 1) & 64512) === 56320) {
                let A = 65536 + ((Y & 1023) << 10) + (q.charCodeAt(++_) & 1023);
                K.push(A >> 18 | 240, A >> 12 & 63 | 128, A >> 6 & 63 | 128, A & 63 | 128)
            } else K.push(Y >> 12 | 224, Y >> 6 & 63 | 128, Y & 63 | 128)
        }
        return Uint8Array.from(K)
    };
    ffq.fromUtf8 = iF9;
    var rF9 = (q) => {
        let K = "";
        for (let _ = 0, z = q.length; _ < z; _++) {
            let Y = q[_];
            if (Y < 128) K += String.fromCharCode(Y);
            else if (192 <= Y && Y < 224) {
                let A = q[++_];
                K += String.fromCharCode((Y & 31) << 6 | A & 63)
            } else if (240 <= Y && Y < 365) {
                let O = "%" + [Y, q[++_], q[++_], q[++_]].map((w) => w.toString(16)).join("%");
                K += decodeURIComponent(O)
            } else K += String.fromCharCode((Y & 15) << 12 | (q[++_] & 63) << 6 | q[++_] & 63)
        }
        return K
    };
    ffq.toUtf8 = rF9
})
// @from(Ln 110167, Col 4)
kfq = p((Tfq) => {
    Object.defineProperty(Tfq, "__esModule", {
        value: !0
    });
    Tfq.toUtf8 = Tfq.fromUtf8 = void 0;

    function aF9(q) {
        return new TextEncoder().encode(q)
    }
    Tfq.fromUtf8 = aF9;

    function sF9(q) {
        return new TextDecoder("utf-8").decode(q)
    }
    Tfq.toUtf8 = sF9
})
// @from(Ln 110183, Col 4)
MT1 = p((yfq) => {
    Object.defineProperty(yfq, "__esModule", {
        value: !0
    });
    yfq.toUtf8 = yfq.fromUtf8 = void 0;
    var Nfq = vfq(),
        Efq = kfq(),
        eF9 = (q) => typeof TextEncoder === "function" ? (0, Efq.fromUtf8)(q) : (0, Nfq.fromUtf8)(q);
    yfq.fromUtf8 = eF9;
    var qg9 = (q) => typeof TextDecoder === "function" ? (0, Efq.toUtf8)(q) : (0, Nfq.toUtf8)(q);
    yfq.toUtf8 = qg9
})
// @from(Ln 110195, Col 4)
Sfq = p((hfq) => {
    Object.defineProperty(hfq, "__esModule", {
        value: !0
    });
    hfq.convertToBuffer = void 0;
    var _g9 = MT1(),
        zg9 = typeof Buffer < "u" && Buffer.from ? function(q) {
            return Buffer.from(q, "utf8")
        } : _g9.fromUtf8;

    function Yg9(q) {
        if (q instanceof Uint8Array) return q;
        if (typeof q === "string") return zg9(q);
        if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(q)
    }
    hfq.convertToBuffer = Yg9
})
// @from(Ln 110213, Col 4)
Ifq = p((Cfq) => {
    Object.defineProperty(Cfq, "__esModule", {
        value: !0
    });
    Cfq.isEmptyData = void 0;

    function Ag9(q) {
        if (typeof q === "string") return q.length === 0;
        return q.byteLength === 0
    }
    Cfq.isEmptyData = Ag9
})
// @from(Ln 110225, Col 4)
mfq = p((xfq) => {
    Object.defineProperty(xfq, "__esModule", {
        value: !0
    });
    xfq.numToUint8 = void 0;

    function Og9(q) {
        return new Uint8Array([(q & 4278190080) >> 24, (q & 16711680) >> 16, (q & 65280) >> 8, q & 255])
    }
    xfq.numToUint8 = Og9
})
// @from(Ln 110236, Col 4)
Ffq = p((Bfq) => {
    Object.defineProperty(Bfq, "__esModule", {
        value: !0
    });
    Bfq.uint32ArrayFrom = void 0;

    function wg9(q) {
        if (!Uint32Array.from) {
            var K = new Uint32Array(q.length),
                _ = 0;
            while (_ < q.length) K[_] = q[_], _ += 1;
            return K
        }
        return Uint32Array.from(q)
    }
    Bfq.uint32ArrayFrom = wg9
})
// @from(Ln 110253, Col 4)
gfq = p((FT6) => {
    Object.defineProperty(FT6, "__esModule", {
        value: !0
    });
    FT6.uint32ArrayFrom = FT6.numToUint8 = FT6.isEmptyData = FT6.convertToBuffer = void 0;
    var $g9 = Sfq();
    Object.defineProperty(FT6, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return $g9.convertToBuffer
        }
    });
    var jg9 = Ifq();
    Object.defineProperty(FT6, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return jg9.isEmptyData
        }
    });
    var Hg9 = mfq();
    Object.defineProperty(FT6, "numToUint8", {
        enumerable: !0,
        get: function() {
            return Hg9.numToUint8
        }
    });
    var Jg9 = Ffq();
    Object.defineProperty(FT6, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return Jg9.uint32ArrayFrom
        }
    })
})
// @from(Ln 110287, Col 4)
cfq = p((Qfq) => {
    Object.defineProperty(Qfq, "__esModule", {
        value: !0
    });
    Qfq.Sha256 = void 0;
    var Ufq = JT1(),
        qf8 = XT1(),
        eZ8 = Zfq(),
        PT1 = gfq(),
        Mg9 = function() {
            function q(K) {
                this.secret = K, this.hash = new eZ8.RawSha256, this.reset()
            }
            return q.prototype.update = function(K) {
                if ((0, PT1.isEmptyData)(K) || this.error) return;
                try {
                    this.hash.update((0, PT1.convertToBuffer)(K))
                } catch (_) {
                    this.error = _
                }
            }, q.prototype.digestSync = function() {
                if (this.error) throw this.error;
                if (this.outer) {
                    if (!this.outer.finished) this.outer.update(this.hash.digest());
                    return this.outer.digest()
                }
                return this.hash.digest()
            }, q.prototype.digest = function() {
                return Ufq.__awaiter(this, void 0, void 0, function() {
                    return Ufq.__generator(this, function(K) {
                        return [2, this.digestSync()]
                    })
                })
            }, q.prototype.reset = function() {
                if (this.hash = new eZ8.RawSha256, this.secret) {
                    this.outer = new eZ8.RawSha256;
                    var K = Pg9(this.secret),
                        _ = new Uint8Array(qf8.BLOCK_SIZE);
                    _.set(K);
                    for (var z = 0; z < qf8.BLOCK_SIZE; z++) K[z] ^= 54, _[z] ^= 92;
                    this.hash.update(K), this.outer.update(_);
                    for (var z = 0; z < K.byteLength; z++) K[z] = 0
                }
            }, q
        }();
    Qfq.Sha256 = Mg9;

    function Pg9(q) {
        var K = (0, PT1.convertToBuffer)(q);
        if (K.byteLength > qf8.BLOCK_SIZE) {
            var _ = new eZ8.RawSha256;
            _.update(K), K = _.digest()
        }
        var z = new Uint8Array(qf8.BLOCK_SIZE);
        return z.set(K), z
    }
})
// @from(Ln 110344, Col 4)
Kf8 = p((WT1) => {
    Object.defineProperty(WT1, "__esModule", {
        value: !0
    });
    var Wg9 = JT1();
    Wg9.__exportStar(cfq(), WT1)
})
// @from(Ln 110351, Col 4)
DT1 = p(($JO, efq) => {
    var {
        defineProperty: _f8,
        getOwnPropertyDescriptor: Dg9,
        getOwnPropertyNames: Zg9
    } = Object, fg9 = Object.prototype.hasOwnProperty, zf8 = (q, K) => _f8(q, "name", {
        value: K,
        configurable: !0
    }), Gg9 = (q, K) => {
        for (var _ in K) _f8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, vg9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of Zg9(K))
                if (!fg9.call(q, Y) && Y !== _) _f8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Dg9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Tg9 = (q) => vg9(_f8({}, "__esModule", {
        value: !0
    }), q), lfq = {};
    Gg9(lfq, {
        AlgorithmId: () => ofq,
        EndpointURLScheme: () => rfq,
        FieldPosition: () => afq,
        HttpApiKeyAuthLocation: () => ifq,
        HttpAuthLocation: () => nfq,
        IniSectionType: () => sfq,
        RequestHandlerProtocol: () => tfq,
        SMITHY_CONTEXT_KEY: () => yg9,
        getDefaultClientConfiguration: () => Ng9,
        resolveDefaultRuntimeConfig: () => Eg9
    });
    efq.exports = Tg9(lfq);
    var nfq = ((q) => {
            return q.HEADER = "header", q.QUERY = "query", q
        })(nfq || {}),
        ifq = ((q) => {
            return q.HEADER = "header", q.QUERY = "query", q
        })(ifq || {}),
        rfq = ((q) => {
            return q.HTTP = "http", q.HTTPS = "https", q
        })(rfq || {}),
        ofq = ((q) => {
            return q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256", q
        })(ofq || {}),
        Vg9 = zf8((q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => "sha256",
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => "md5",
                checksumConstructor: () => q.md5
            });
            return {
                _checksumAlgorithms: K,
                addChecksumAlgorithm(_) {
                    this._checksumAlgorithms.push(_)
                },
                checksumAlgorithms() {
                    return this._checksumAlgorithms
                }
            }
        }, "getChecksumConfiguration"),
        kg9 = zf8((q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        }, "resolveChecksumRuntimeConfig"),
        Ng9 = zf8((q) => {
            return {
                ...Vg9(q)
            }
        }, "getDefaultClientConfiguration"),
        Eg9 = zf8((q) => {
            return {
                ...kg9(q)
            }
        }, "resolveDefaultRuntimeConfig"),
        afq = ((q) => {
            return q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER", q
        })(afq || {}),
        yg9 = "__smithy_context",
        sfq = ((q) => {
            return q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services", q
        })(sfq || {}),
        tfq = ((q) => {
            return q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0", q
        })(tfq || {})
})
// @from(Ln 110448, Col 4)
Wn6 = p((jJO, wGq) => {
    var {
        defineProperty: Yf8,
        getOwnPropertyDescriptor: Lg9,
        getOwnPropertyNames: hg9
    } = Object, Rg9 = Object.prototype.hasOwnProperty, Aq6 = (q, K) => Yf8(q, "name", {
        value: K,
        configurable: !0
    }), Sg9 = (q, K) => {
        for (var _ in K) Yf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Cg9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of hg9(K))
                if (!Rg9.call(q, Y) && Y !== _) Yf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = Lg9(K, Y)) || z.enumerable
                })
        }
        return q
    }, bg9 = (q) => Cg9(Yf8({}, "__esModule", {
        value: !0
    }), q), qGq = {};
    Sg9(qGq, {
        Field: () => mg9,
        Fields: () => Bg9,
        HttpRequest: () => pg9,
        HttpResponse: () => Fg9,
        getHttpHandlerExtensionConfiguration: () => Ig9,
        isValidHostname: () => OGq,
        resolveHttpHandlerRuntimeConfig: () => xg9
    });
    wGq.exports = bg9(qGq);
    var Ig9 = Aq6((q) => {
            let K = q.httpHandler;
            return {
                setHttpHandler(_) {
                    K = _
                },
                httpHandler() {
                    return K
                },
                updateHttpClientConfig(_, z) {
                    K.updateHttpClientConfig(_, z)
                },
                httpHandlerConfigs() {
                    return K.httpHandlerConfigs()
                }
            }
        }, "getHttpHandlerExtensionConfiguration"),
        xg9 = Aq6((q) => {
            return {
                httpHandler: q.httpHandler()
            }
        }, "resolveHttpHandlerRuntimeConfig"),
        ug9 = DT1(),
        KGq = class {
            constructor({
                name: K,
                kind: _ = ug9.FieldPosition.HEADER,
                values: z = []
            }) {
                this.name = K, this.kind = _, this.values = z
            }
            add(K) {
                this.values.push(K)
            }
            set(K) {
                this.values = K
            }
            remove(K) {
                this.values = this.values.filter((_) => _ !== K)
            }
            toString() {
                return this.values.map((K) => K.includes(",") || K.includes(" ") ? `"${K}"` : K).join(", ")
            }
            get() {
                return this.values
            }
        };
    Aq6(KGq, "Field");
    var mg9 = KGq,
        _Gq = class {
            constructor({
                fields: K = [],
                encoding: _ = "utf-8"
            }) {
                this.entries = {}, K.forEach(this.setField.bind(this)), this.encoding = _
            }
            setField(K) {
                this.entries[K.name.toLowerCase()] = K
            }
            getField(K) {
                return this.entries[K.toLowerCase()]
            }
            removeField(K) {
                delete this.entries[K.toLowerCase()]
            }
            getByType(K) {
                return Object.values(this.entries).filter((_) => _.kind === K)
            }
        };
    Aq6(_Gq, "Fields");
    var Bg9 = _Gq,
        zGq = class q {
            constructor(K) {
                this.method = K.method || "GET", this.hostname = K.hostname || "localhost", this.port = K.port, this.query = K.query || {}, this.headers = K.headers || {}, this.body = K.body, this.protocol = K.protocol ? K.protocol.slice(-1) !== ":" ? `${K.protocol}:` : K.protocol : "https:", this.path = K.path ? K.path.charAt(0) !== "/" ? `/${K.path}` : K.path : "/", this.username = K.username, this.password = K.password, this.fragment = K.fragment
            }
            static isInstance(K) {
                if (!K) return !1;
                let _ = K;
                return "method" in _ && "protocol" in _ && "hostname" in _ && "path" in _ && typeof _.query === "object" && typeof _.headers === "object"
            }
            clone() {
                let K = new q({
                    ...this,
                    headers: {
                        ...this.headers
                    }
                });
                if (K.query) K.query = YGq(K.query);
                return K
            }
        };
    Aq6(zGq, "HttpRequest");
    var pg9 = zGq;

    function YGq(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    Aq6(YGq, "cloneQuery");
    var AGq = class {
        constructor(K) {
            this.statusCode = K.statusCode, this.reason = K.reason, this.headers = K.headers || {}, this.body = K.body
        }
        static isInstance(K) {
            if (!K) return !1;
            let _ = K;
            return typeof _.statusCode === "number" && typeof _.headers === "object"
        }
    };
    Aq6(AGq, "HttpResponse");
    var Fg9 = AGq;

    function OGq(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    Aq6(OGq, "isValidHostname")
})
// @from(Ln 110605, Col 4)
ZGq = p((HJO, DGq) => {
    var {
        defineProperty: Af8,
        getOwnPropertyDescriptor: gg9,
        getOwnPropertyNames: Ug9
    } = Object, Qg9 = Object.prototype.hasOwnProperty, Of8 = (q, K) => Af8(q, "name", {
        value: K,
        configurable: !0
    }), dg9 = (q, K) => {
        for (var _ in K) Af8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, cg9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of Ug9(K))
                if (!Qg9.call(q, Y) && Y !== _) Af8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = gg9(K, Y)) || z.enumerable
                })
        }
        return q
    }, lg9 = (q) => cg9(Af8({}, "__esModule", {
        value: !0
    }), q), $Gq = {};
    dg9($Gq, {
        AlgorithmId: () => XGq,
        EndpointURLScheme: () => JGq,
        FieldPosition: () => MGq,
        HttpApiKeyAuthLocation: () => HGq,
        HttpAuthLocation: () => jGq,
        IniSectionType: () => PGq,
        RequestHandlerProtocol: () => WGq,
        SMITHY_CONTEXT_KEY: () => ag9,
        getDefaultClientConfiguration: () => rg9,
        resolveDefaultRuntimeConfig: () => og9
    });
    DGq.exports = lg9($Gq);
    var jGq = ((q) => {
            return q.HEADER = "header", q.QUERY = "query", q
        })(jGq || {}),
        HGq = ((q) => {
            return q.HEADER = "header", q.QUERY = "query", q
        })(HGq || {}),
        JGq = ((q) => {
            return q.HTTP = "http", q.HTTPS = "https", q
        })(JGq || {}),
        XGq = ((q) => {
            return q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256", q
        })(XGq || {}),
        ng9 = Of8((q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => "sha256",
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => "md5",
                checksumConstructor: () => q.md5
            });
            return {
                _checksumAlgorithms: K,
                addChecksumAlgorithm(_) {
                    this._checksumAlgorithms.push(_)
                },
                checksumAlgorithms() {
                    return this._checksumAlgorithms
                }
            }
        }, "getChecksumConfiguration"),
        ig9 = Of8((q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        }, "resolveChecksumRuntimeConfig"),
        rg9 = Of8((q) => {
            return {
                ...ng9(q)
            }
        }, "getDefaultClientConfiguration"),
        og9 = Of8((q) => {
            return {
                ...ig9(q)
            }
        }, "resolveDefaultRuntimeConfig"),
        MGq = ((q) => {
            return q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER", q
        })(MGq || {}),
        ag9 = "__smithy_context",
        PGq = ((q) => {
            return q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services", q
        })(PGq || {}),
        WGq = ((q) => {
            return q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0", q
        })(WGq || {})
})
// @from(Ln 110702, Col 4)
VGq = p((JJO, TGq) => {
    var {
        defineProperty: wf8,
        getOwnPropertyDescriptor: sg9,
        getOwnPropertyNames: tg9
    } = Object, eg9 = Object.prototype.hasOwnProperty, GGq = (q, K) => wf8(q, "name", {
        value: K,
        configurable: !0
    }), qU9 = (q, K) => {
        for (var _ in K) wf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, KU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of tg9(K))
                if (!eg9.call(q, Y) && Y !== _) wf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = sg9(K, Y)) || z.enumerable
                })
        }
        return q
    }, _U9 = (q) => KU9(wf8({}, "__esModule", {
        value: !0
    }), q), vGq = {};
    qU9(vGq, {
        getSmithyContext: () => zU9,
        normalizeProvider: () => YU9
    });
    TGq.exports = _U9(vGq);
    var fGq = ZGq(),
        zU9 = GGq((q) => q[fGq.SMITHY_CONTEXT_KEY] || (q[fGq.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
        YU9 = GGq((q) => {
            if (typeof q === "function") return q;
            let K = Promise.resolve(q);
            return () => K
        }, "normalizeProvider")
})
// @from(Ln 110740, Col 4)
ZT1 = p((XJO, NGq) => {
    var {
        defineProperty: $f8,
        getOwnPropertyDescriptor: AU9,
        getOwnPropertyNames: OU9
    } = Object, wU9 = Object.prototype.hasOwnProperty, $U9 = (q, K) => $f8(q, "name", {
        value: K,
        configurable: !0
    }), jU9 = (q, K) => {
        for (var _ in K) $f8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, HU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of OU9(K))
                if (!wU9.call(q, Y) && Y !== _) $f8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = AU9(K, Y)) || z.enumerable
                })
        }
        return q
    }, JU9 = (q) => HU9($f8({}, "__esModule", {
        value: !0
    }), q), kGq = {};
    jU9(kGq, {
        isArrayBuffer: () => XU9
    });
    NGq.exports = JU9(kGq);
    var XU9 = $U9((q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 110771, Col 4)
hGq = p((MJO, LGq) => {
    var {
        defineProperty: jf8,
        getOwnPropertyDescriptor: MU9,
        getOwnPropertyNames: PU9
    } = Object, WU9 = Object.prototype.hasOwnProperty, EGq = (q, K) => jf8(q, "name", {
        value: K,
        configurable: !0
    }), DU9 = (q, K) => {
        for (var _ in K) jf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, ZU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of PU9(K))
                if (!WU9.call(q, Y) && Y !== _) jf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = MU9(K, Y)) || z.enumerable
                })
        }
        return q
    }, fU9 = (q) => ZU9(jf8({}, "__esModule", {
        value: !0
    }), q), yGq = {};
    DU9(yGq, {
        fromArrayBuffer: () => vU9,
        fromString: () => TU9
    });
    LGq.exports = fU9(yGq);
    var GU9 = ZT1(),
        fT1 = d6("buffer"),
        vU9 = EGq((q, K = 0, _ = q.byteLength - K) => {
            if (!(0, GU9.isArrayBuffer)(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return fT1.Buffer.from(q, K, _)
        }, "fromArrayBuffer"),
        TU9 = EGq((q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? fT1.Buffer.from(q, K) : fT1.Buffer.from(q)
        }, "fromString")
})
// @from(Ln 110812, Col 4)
Dn6 = p((PJO, bGq) => {
    var {
        defineProperty: Hf8,
        getOwnPropertyDescriptor: VU9,
        getOwnPropertyNames: kU9
    } = Object, NU9 = Object.prototype.hasOwnProperty, GT1 = (q, K) => Hf8(q, "name", {
        value: K,
        configurable: !0
    }), EU9 = (q, K) => {
        for (var _ in K) Hf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, yU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of kU9(K))
                if (!NU9.call(q, Y) && Y !== _) Hf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = VU9(K, Y)) || z.enumerable
                })
        }
        return q
    }, LU9 = (q) => yU9(Hf8({}, "__esModule", {
        value: !0
    }), q), RGq = {};
    EU9(RGq, {
        fromUtf8: () => CGq,
        toUint8Array: () => hU9,
        toUtf8: () => RU9
    });
    bGq.exports = LU9(RGq);
    var SGq = hGq(),
        CGq = GT1((q) => {
            let K = (0, SGq.fromString)(q, "utf8");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        hU9 = GT1((q) => {
            if (typeof q === "string") return CGq(q);
            if (ArrayBuffer.isView(q)) return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(q)
        }, "toUint8Array"),
        RU9 = GT1((q) => {
            if (typeof q === "string") return q;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, SGq.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 110859, Col 4)
FGq = p((WJO, pGq) => {
    var {
        defineProperty: Jf8,
        getOwnPropertyDescriptor: SU9,
        getOwnPropertyNames: CU9
    } = Object, bU9 = Object.prototype.hasOwnProperty, IGq = (q, K) => Jf8(q, "name", {
        value: K,
        configurable: !0
    }), IU9 = (q, K) => {
        for (var _ in K) Jf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, xU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of CU9(K))
                if (!bU9.call(q, Y) && Y !== _) Jf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = SU9(K, Y)) || z.enumerable
                })
        }
        return q
    }, uU9 = (q) => xU9(Jf8({}, "__esModule", {
        value: !0
    }), q), xGq = {};
    IU9(xGq, {
        fromHex: () => mGq,
        toHex: () => BGq
    });
    pGq.exports = uU9(xGq);
    var uGq = {},
        vT1 = {};
    for (let q = 0; q < 256; q++) {
        let K = q.toString(16).toLowerCase();
        if (K.length === 1) K = `0${K}`;
        uGq[q] = K, vT1[K] = q
    }

    function mGq(q) {
        if (q.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let K = new Uint8Array(q.length / 2);
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = q.slice(_, _ + 2).toLowerCase();
            if (z in vT1) K[_ / 2] = vT1[z];
            else throw Error(`Cannot decode unrecognized sequence ${z} as hexadecimal`)
        }
        return K
    }
    IGq(mGq, "fromHex");

    function BGq(q) {
        let K = "";
        for (let _ = 0; _ < q.byteLength; _++) K += uGq[q[_]];
        return K
    }
    IGq(BGq, "toHex")
})
// @from(Ln 110916, Col 4)
dGq = p((DJO, QGq) => {
    var {
        defineProperty: Xf8,
        getOwnPropertyDescriptor: mU9,
        getOwnPropertyNames: BU9
    } = Object, pU9 = Object.prototype.hasOwnProperty, TT1 = (q, K) => Xf8(q, "name", {
        value: K,
        configurable: !0
    }), FU9 = (q, K) => {
        for (var _ in K) Xf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, gU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of BU9(K))
                if (!pU9.call(q, Y) && Y !== _) Xf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = mU9(K, Y)) || z.enumerable
                })
        }
        return q
    }, UU9 = (q) => gU9(Xf8({}, "__esModule", {
        value: !0
    }), q), gGq = {};
    FU9(gGq, {
        escapeUri: () => UGq,
        escapeUriPath: () => dU9
    });
    QGq.exports = UU9(gGq);
    var UGq = TT1((q) => encodeURIComponent(q).replace(/[!'()*]/g, QU9), "escapeUri"),
        QU9 = TT1((q) => `%${q.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        dU9 = TT1((q) => q.split("/").map(UGq).join("/"), "escapeUriPath")
})
// @from(Ln 110950, Col 4)
ff8 = p((ZJO, $vq) => {
    var {
        defineProperty: Zf8,
        getOwnPropertyDescriptor: cU9,
        getOwnPropertyNames: lU9
    } = Object, nU9 = Object.prototype.hasOwnProperty, fP = (q, K) => Zf8(q, "name", {
        value: K,
        configurable: !0
    }), iU9 = (q, K) => {
        for (var _ in K) Zf8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, rU9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of lU9(K))
                if (!nU9.call(q, Y) && Y !== _) Zf8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = cU9(K, Y)) || z.enumerable
                })
        }
        return q
    }, oU9 = (q) => rU9(Zf8({}, "__esModule", {
        value: !0
    }), q), rGq = {};
    iU9(rGq, {
        SignatureV4: () => VQ9,
        clearCredentialCache: () => XQ9,
        createScope: () => Wf8,
        getCanonicalHeaders: () => ET1,
        getCanonicalQuery: () => _vq,
        getPayloadHash: () => Df8,
        getSigningKey: () => Kvq,
        moveHeadersToQuery: () => Ovq,
        prepareRequest: () => LT1
    });
    $vq.exports = oU9(rGq);
    var cGq = VGq(),
        VT1 = Dn6(),
        aU9 = "X-Amz-Algorithm",
        sU9 = "X-Amz-Credential",
        oGq = "X-Amz-Date",
        tU9 = "X-Amz-SignedHeaders",
        eU9 = "X-Amz-Expires",
        aGq = "X-Amz-Signature",
        sGq = "X-Amz-Security-Token",
        tGq = "authorization",
        eGq = oGq.toLowerCase(),
        qQ9 = "date",
        KQ9 = [tGq, eGq, qQ9],
        _Q9 = aGq.toLowerCase(),
        NT1 = "x-amz-content-sha256",
        zQ9 = sGq.toLowerCase(),
        YQ9 = {
            authorization: !0,
            "cache-control": !0,
            connection: !0,
            expect: !0,
            from: !0,
            "keep-alive": !0,
            "max-forwards": !0,
            pragma: !0,
            referer: !0,
            te: !0,
            trailer: !0,
            "transfer-encoding": !0,
            upgrade: !0,
            "user-agent": !0,
            "x-amzn-trace-id": !0
        },
        AQ9 = /^proxy-/,
        OQ9 = /^sec-/,
        kT1 = "AWS4-HMAC-SHA256",
        wQ9 = "AWS4-HMAC-SHA256-PAYLOAD",
        $Q9 = "UNSIGNED-PAYLOAD",
        jQ9 = 50,
        qvq = "aws4_request",
        HQ9 = 604800,
        Oq6 = FGq(),
        JQ9 = Dn6(),
        gT6 = {},
        Pf8 = [],
        Wf8 = fP((q, K, _) => `${q}/${K}/${_}/${qvq}`, "createScope"),
        Kvq = fP(async (q, K, _, z, Y) => {
            let A = await lGq(q, K.secretAccessKey, K.accessKeyId),
                O = `${_}:${z}:${Y}:${(0,Oq6.toHex)(A)}:${K.sessionToken}`;
            if (O in gT6) return gT6[O];
            Pf8.push(O);
            while (Pf8.length > jQ9) delete gT6[Pf8.shift()];
            let w = `AWS4${K.secretAccessKey}`;
            for (let $ of [_, z, Y, qvq]) w = await lGq(q, w, $);
            return gT6[O] = w
        }, "getSigningKey"),
        XQ9 = fP(() => {
            Pf8.length = 0, Object.keys(gT6).forEach((q) => {
                delete gT6[q]
            })
        }, "clearCredentialCache"),
        lGq = fP((q, K, _) => {
            let z = new q(K);
            return z.update((0, JQ9.toUint8Array)(_)), z.digest()
        }, "hmac"),
        ET1 = fP(({
            headers: q
        }, K, _) => {
            let z = {};
            for (let Y of Object.keys(q).sort()) {
                if (q[Y] == null) continue;
                let A = Y.toLowerCase();
                if (A in YQ9 || (K == null ? void 0 : K.has(A)) || AQ9.test(A) || OQ9.test(A)) {
                    if (!_ || _ && !_.has(A)) continue
                }
                z[A] = q[Y].trim().replace(/\s+/g, " ")
            }
            return z
        }, "getCanonicalHeaders"),
        Zn6 = dGq(),
        _vq = fP(({
            query: q = {}
        }) => {
            let K = [],
                _ = {};
            for (let z of Object.keys(q).sort()) {
                if (z.toLowerCase() === _Q9) continue;
                K.push(z);
                let Y = q[z];
                if (typeof Y === "string") _[z] = `${(0,Zn6.escapeUri)(z)}=${(0,Zn6.escapeUri)(Y)}`;
                else if (Array.isArray(Y)) _[z] = Y.slice(0).reduce((A, O) => A.concat([`${(0,Zn6.escapeUri)(z)}=${(0,Zn6.escapeUri)(O)}`]), []).sort().join("&")
            }
            return K.map((z) => _[z]).filter((z) => z).join("&")
        }, "getCanonicalQuery"),
        MQ9 = ZT1(),
        PQ9 = Dn6(),
        Df8 = fP(async ({
            headers: q,
            body: K
        }, _) => {
            for (let z of Object.keys(q))
                if (z.toLowerCase() === NT1) return q[z];
            if (K == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            else if (typeof K === "string" || ArrayBuffer.isView(K) || (0, MQ9.isArrayBuffer)(K)) {
                let z = new _;
                return z.update((0, PQ9.toUint8Array)(K)), (0, Oq6.toHex)(await z.digest())
            }
            return $Q9
        }, "getPayloadHash"),
        nGq = Dn6(),
        zvq = class {
            format(K) {
                let _ = [];
                for (let A of Object.keys(K)) {
                    let O = (0, nGq.fromUtf8)(A);
                    _.push(Uint8Array.from([O.byteLength]), O, this.formatHeaderValue(K[A]))
                }
                let z = new Uint8Array(_.reduce((A, O) => A + O.byteLength, 0)),
                    Y = 0;
                for (let A of _) z.set(A, Y), Y += A.byteLength;
                return z
            }
            formatHeaderValue(K) {
                switch (K.type) {
                    case "boolean":
                        return Uint8Array.from([K.value ? 0 : 1]);
                    case "byte":
                        return Uint8Array.from([2, K.value]);
                    case "short":
                        let _ = new DataView(new ArrayBuffer(3));
                        return _.setUint8(0, 3), _.setInt16(1, K.value, !1), new Uint8Array(_.buffer);
                    case "integer":
                        let z = new DataView(new ArrayBuffer(5));
                        return z.setUint8(0, 4), z.setInt32(1, K.value, !1), new Uint8Array(z.buffer);
                    case "long":
                        let Y = new Uint8Array(9);
                        return Y[0] = 5, Y.set(K.value.bytes, 1), Y;
                    case "binary":
                        let A = new DataView(new ArrayBuffer(3 + K.value.byteLength));
                        A.setUint8(0, 6), A.setUint16(1, K.value.byteLength, !1);
                        let O = new Uint8Array(A.buffer);
                        return O.set(K.value, 3), O;
                    case "string":
                        let w = (0, nGq.fromUtf8)(K.value),
                            $ = new DataView(new ArrayBuffer(3 + w.byteLength));
                        $.setUint8(0, 7), $.setUint16(1, w.byteLength, !1);
                        let j = new Uint8Array($.buffer);
                        return j.set(w, 3), j;
                    case "timestamp":
                        let H = new Uint8Array(9);
                        return H[0] = 8, H.set(ZQ9.fromNumber(K.value.valueOf()).bytes, 1), H;
                    case "uuid":
                        if (!DQ9.test(K.value)) throw Error(`Invalid UUID received: ${K.value}`);
                        let J = new Uint8Array(17);
                        return J[0] = 9, J.set((0, Oq6.fromHex)(K.value.replace(/\-/g, "")), 1), J
                }
            }
        };
    fP(zvq, "HeaderFormatter");
    var WQ9 = zvq,
        DQ9 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
        Yvq = class q {
            constructor(K) {
                if (this.bytes = K, K.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
            }
            static fromNumber(K) {
                if (K > 9223372036854776000 || K < -9223372036854776000) throw Error(`${K} is too large (or, if negative, too small) to represent as an Int64`);
                let _ = new Uint8Array(8);
                for (let z = 7, Y = Math.abs(Math.round(K)); z > -1 && Y > 0; z--, Y /= 256) _[z] = Y;
                if (K < 0) yT1(_);
                return new q(_)
            }
            valueOf() {
                let K = this.bytes.slice(0),
                    _ = K[0] & 128;
                if (_) yT1(K);
                return parseInt((0, Oq6.toHex)(K), 16) * (_ ? -1 : 1)
            }
            toString() {
                return String(this.valueOf())
            }
        };
    fP(Yvq, "Int64");
    var ZQ9 = Yvq;

    function yT1(q) {
        for (let K = 0; K < 8; K++) q[K] ^= 255;
        for (let K = 7; K > -1; K--)
            if (q[K]++, q[K] !== 0) break
    }
    fP(yT1, "negate");
    var fQ9 = fP((q, K) => {
            q = q.toLowerCase();
            for (let _ of Object.keys(K))
                if (q === _.toLowerCase()) return !0;
            return !1
        }, "hasHeader"),
        Avq = fP(({
            headers: q,
            query: K,
            ..._
        }) => ({
            ..._,
            headers: {
                ...q
            },
            query: K ? GQ9(K) : void 0
        }), "cloneRequest"),
        GQ9 = fP((q) => Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {}), "cloneQuery"),
        Ovq = fP((q, K = {}) => {
            var _;
            let {
                headers: z,
                query: Y = {}
            } = typeof q.clone === "function" ? q.clone() : Avq(q);
            for (let A of Object.keys(z)) {
                let O = A.toLowerCase();
                if (O.slice(0, 6) === "x-amz-" && !((_ = K.unhoistableHeaders) == null ? void 0 : _.has(O))) Y[A] = z[A], delete z[A]
            }
            return {
                ...q,
                headers: z,
                query: Y
            }
        }, "moveHeadersToQuery"),
        LT1 = fP((q) => {
            q = typeof q.clone === "function" ? q.clone() : Avq(q);
            for (let K of Object.keys(q.headers))
                if (KQ9.indexOf(K.toLowerCase()) > -1) delete q.headers[K];
            return q
        }, "prepareRequest"),
        vQ9 = fP((q) => TQ9(q).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
        TQ9 = fP((q) => {
            if (typeof q === "number") return new Date(q * 1000);
            if (typeof q === "string") {
                if (Number(q)) return new Date(Number(q) * 1000);
                return new Date(q)
            }
            return q
        }, "toDate"),
        wvq = class {
            constructor({
                applyChecksum: K,
                credentials: _,
                region: z,
                service: Y,
                sha256: A,
                uriEscapePath: O = !0
            }) {
                this.headerFormatter = new WQ9, this.service = Y, this.sha256 = A, this.uriEscapePath = O, this.applyChecksum = typeof K === "boolean" ? K : !0, this.regionProvider = (0, cGq.normalizeProvider)(z), this.credentialProvider = (0, cGq.normalizeProvider)(_)
            }
            async presign(K, _ = {}) {
                let {
                    signingDate: z = new Date,
                    expiresIn: Y = 3600,
                    unsignableHeaders: A,
                    unhoistableHeaders: O,
                    signableHeaders: w,
                    signingRegion: $,
                    signingService: j
                } = _, H = await this.credentialProvider();
                this.validateResolvedCredentials(H);
                let J = $ ?? await this.regionProvider(),
                    {
                        longDate: X,
                        shortDate: M
                    } = Mf8(z);
                if (Y > HQ9) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
                let P = Wf8(M, J, j ?? this.service),
                    W = Ovq(LT1(K), {
                        unhoistableHeaders: O
                    });
                if (H.sessionToken) W.query[sGq] = H.sessionToken;
                W.query[aU9] = kT1, W.query[sU9] = `${H.accessKeyId}/${P}`, W.query[oGq] = X, W.query[eU9] = Y.toString(10);
                let D = ET1(W, A, w);
                return W.query[tU9] = iGq(D), W.query[aGq] = await this.getSignature(X, P, this.getSigningKey(H, J, M, j), this.createCanonicalRequest(W, D, await Df8(K, this.sha256))), W
            }
            async sign(K, _) {
                if (typeof K === "string") return this.signString(K, _);
                else if (K.headers && K.payload) return this.signEvent(K, _);
                else if (K.message) return this.signMessage(K, _);
                else return this.signRequest(K, _)
            }
            async signEvent({
                headers: K,
                payload: _
            }, {
                signingDate: z = new Date,
                priorSignature: Y,
                signingRegion: A,
                signingService: O
            }) {
                let w = A ?? await this.regionProvider(),
                    {
                        shortDate: $,
                        longDate: j
                    } = Mf8(z),
                    H = Wf8($, w, O ?? this.service),
                    J = await Df8({
                        headers: {},
                        body: _
                    }, this.sha256),
                    X = new this.sha256;
                X.update(K);
                let M = (0, Oq6.toHex)(await X.digest()),
                    P = [wQ9, j, H, Y, M, J].join(`
`);
                return this.signString(P, {
                    signingDate: z,
                    signingRegion: w,
                    signingService: O
                })
            }
            async signMessage(K, {
                signingDate: _ = new Date,
                signingRegion: z,
                signingService: Y
            }) {
                return this.signEvent({
                    headers: this.headerFormatter.format(K.message.headers),
                    payload: K.message.body
                }, {
                    signingDate: _,
                    signingRegion: z,
                    signingService: Y,
                    priorSignature: K.priorSignature
                }).then((O) => {
                    return {
                        message: K.message,
                        signature: O
                    }
                })
            }
            async signString(K, {
                signingDate: _ = new Date,
                signingRegion: z,
                signingService: Y
            } = {}) {
                let A = await this.credentialProvider();
                this.validateResolvedCredentials(A);
                let O = z ?? await this.regionProvider(),
                    {
                        shortDate: w
                    } = Mf8(_),
                    $ = new this.sha256(await this.getSigningKey(A, O, w, Y));
                return $.update((0, VT1.toUint8Array)(K)), (0, Oq6.toHex)(await $.digest())
            }
            async signRequest(K, {
                signingDate: _ = new Date,
                signableHeaders: z,
                unsignableHeaders: Y,
                signingRegion: A,
                signingService: O
            } = {}) {
                let w = await this.credentialProvider();
                this.validateResolvedCredentials(w);
                let $ = A ?? await this.regionProvider(),
                    j = LT1(K),
                    {
                        longDate: H,
                        shortDate: J
                    } = Mf8(_),
                    X = Wf8(J, $, O ?? this.service);
                if (j.headers[eGq] = H, w.sessionToken) j.headers[zQ9] = w.sessionToken;
                let M = await Df8(j, this.sha256);
                if (!fQ9(NT1, j.headers) && this.applyChecksum) j.headers[NT1] = M;
                let P = ET1(j, Y, z),
                    W = await this.getSignature(H, X, this.getSigningKey(w, $, J, O), this.createCanonicalRequest(j, P, M));
                return j.headers[tGq] = `${kT1} Credential=${w.accessKeyId}/${X}, SignedHeaders=${iGq(P)}, Signature=${W}`, j
            }
            createCanonicalRequest(K, _, z) {
                let Y = Object.keys(_).sort();
                return `${K.method}
${this.getCanonicalPath(K)}
${_vq(K)}
${Y.map((A)=>`${A}:${_[A]}`).join(`
`)}

${Y.join(";")}
${z}`
            }
            async createStringToSign(K, _, z) {
                let Y = new this.sha256;
                Y.update((0, VT1.toUint8Array)(z));
                let A = await Y.digest();
                return `${kT1}
${K}
${_}
${(0,Oq6.toHex)(A)}`
            }
            getCanonicalPath({
                path: K
            }) {
                if (this.uriEscapePath) {
                    let _ = [];
                    for (let A of K.split("/")) {
                        if ((A == null ? void 0 : A.length) === 0) continue;
                        if (A === ".") continue;
                        if (A === "..") _.pop();
                        else _.push(A)
                    }
                    let z = `${(K==null?void 0:K.startsWith("/"))?"/":""}${_.join("/")}${_.length>0&&(K==null?void 0:K.endsWith("/"))?"/":""}`;
                    return (0, Zn6.escapeUri)(z).replace(/%2F/g, "/")
                }
                return K
            }
            async getSignature(K, _, z, Y) {
                let A = await this.createStringToSign(K, _, Y),
                    O = new this.sha256(await z);
                return O.update((0, VT1.toUint8Array)(A)), (0, Oq6.toHex)(await O.digest())
            }
            getSigningKey(K, _, z, Y) {
                return Kvq(this.sha256, K, z, _, Y || this.service)
            }
            validateResolvedCredentials(K) {
                if (typeof K !== "object" || typeof K.accessKeyId !== "string" || typeof K.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
            }
        };
    fP(wvq, "SignatureV4");
    var VQ9 = wvq,
        Mf8 = fP((q) => {
            let K = vQ9(q).replace(/[\-:]/g, "");
            return {
                longDate: K,
                shortDate: K.slice(0, 8)
            }
        }, "formatDate"),
        iGq = fP((q) => Object.keys(q).sort().join(";"), "getCanonicalHeaderList")
})
// @from(Ln 111423, Col 4)
jvq
// @from(Ln 111423, Col 9)
Hvq
// @from(Ln 111423, Col 14)
Jvq
// @from(Ln 111423, Col 19)
Xvq
// @from(Ln 111423, Col 24)
NQ9 = () => Promise.resolve().then(() => K6(LT6(), 1)).then(({
        fromNodeProviderChain: q
    }) => q({
        clientConfig: {
            requestHandler: new Hvq.FetchHttpHandler({
                requestInit: (K) => {
                    return {
                        ...K
                    }
                }
            })
        }
    })).catch((q) => {
        throw Error(`Failed to import '@aws-sdk/credential-providers'.You can provide a custom \`providerChainResolver\` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': \`new AnthropicBedrock({ providerChainResolver })\` Original error: ${q.message}`)
    })
// @from(Ln 111438, Col 4)
Mvq = async (q, K) => {
        kQ9(q.method, "Expected request method property to be set");
        let _;
        if (K.awsAccessKey && K.awsSecretKey) _ = {
            accessKeyId: K.awsAccessKey,
            secretAccessKey: K.awsSecretKey,
            ...K.awsSessionToken != null && {
                sessionToken: K.awsSessionToken
            }
        };
        else _ = await (await (K.providerChainResolver ? K.providerChainResolver() : NQ9()))();
        let z = new Xvq.SignatureV4({
                service: "bedrock",
                region: K.regionName,
                credentials: _,
                sha256: jvq.Sha256
            }),
            Y = new URL(K.url),
            A = !q.headers ? {} : (Symbol.iterator in q.headers) ? Object.fromEntries(Array.from(q.headers).map(($) => [...$])) : {
                ...q.headers
            };
        delete A.connection, A.host = Y.hostname;
        let O = new Jvq.HttpRequest({
            method: q.method.toUpperCase(),
            protocol: Y.protocol,
            path: Y.pathname,
            headers: A,
            body: q.body
        });
        return (await z.sign(O)).headers
    }
// @from(Ln 111469, Col 4)
Pvq = L(() => {
    jvq = K6(Kf8(), 1), Hvq = K6(DO6(), 1), Jvq = K6(Wn6(), 1), Xvq = K6(ff8(), 1)
})