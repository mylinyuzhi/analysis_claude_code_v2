
// @from(Ln 231008, Col 0)
function xZ4(q) {
    return {
        seenIds: new Set(q.seenIds),
        replacements: new Map(q.replacements)
    }
}
// @from(Ln 231015, Col 0)
function uZ4(q, K) {
    if (!u8("tengu_hawthorn_steeple", !1)) return;
    if (q) return XS8(q, K ?? []);
    return te6()
}
// @from(Ln 231021, Col 0)
function Y3z(q) {
    return typeof q === "string" && (q.startsWith(CZ4) || q === q3z)
}
// @from(Ln 231025, Col 0)
function mZ4(q) {
    return Array.isArray(q) && q.some((K) => typeof K === "object" && ("type" in K) && K.type === "image")
}
// @from(Ln 231029, Col 0)
function BZ4(q) {
    if (typeof q === "string") return q.length;
    return q.reduce((K, _) => K + (_.type === "text" ? _.text.length : 0), 0)
}
// @from(Ln 231034, Col 0)
function A3z(q) {
    let K = new Map;
    for (let _ of q) {
        if (_.type !== "assistant") continue;
        let z = _.message.content;
        if (!Array.isArray(z)) continue;
        for (let Y of z)
            if (Y.type === "tool_use") K.set(Y.id, Y.name)
    }
    return K
}
// @from(Ln 231046, Col 0)
function O3z(q) {
    if (q.type !== "user" || !Array.isArray(q.message.content)) return [];
    return q.message.content.flatMap((K) => {
        if (K.type !== "tool_result" || !K.content) return [];
        if (Y3z(K.content)) return [];
        if (mZ4(K.content)) return [];
        return [{
            toolUseId: K.tool_use_id,
            content: K.content,
            size: BZ4(K.content)
        }]
    })
}
// @from(Ln 231060, Col 0)
function pZ4(q) {
    let K = [],
        _ = [],
        z = () => {
            if (_.length > 0) K.push(_);
            _ = []
        },
        Y = new Set;
    for (let A of q)
        if (A.type === "user") _.push(...O3z(A));
        else if (A.type === "assistant") {
        if (!Y.has(A.message.id)) z(), Y.add(A.message.id)
    }
    return z(), K
}
// @from(Ln 231076, Col 0)
function w3z(q, K) {
    return q.reduce((_, z) => {
        let Y = K.replacements.get(z.toolUseId);
        if (Y !== void 0) _.mustReapply.push({
            ...z,
            replacement: Y
        });
        else if (K.seenIds.has(z.toolUseId)) _.frozen.push(z);
        else _.fresh.push(z);
        return _
    }, {
        mustReapply: [],
        frozen: [],
        fresh: []
    })
}
// @from(Ln 231093, Col 0)
function $3z(q, K, _) {
    let z = [...q].sort((O, w) => w.size - O.size),
        Y = [],
        A = K + q.reduce((O, w) => O + w.size, 0);
    for (let O of z) {
        if (A <= _) break;
        Y.push(O), A -= O.size
    }
    return Y
}
// @from(Ln 231104, Col 0)
function j3z(q, K) {
    return q.map((_) => {
        if (_.type !== "user" || !Array.isArray(_.message.content)) return _;
        let z = _.message.content;
        if (!z.some((A) => A.type === "tool_result" && K.has(A.tool_use_id))) return _;
        return {
            ..._,
            message: {
                ..._.message,
                content: z.map((A) => {
                    if (A.type !== "tool_result") return A;
                    let O = K.get(A.tool_use_id);
                    return O === void 0 ? A : {
                        ...A,
                        content: O
                    }
                })
            }
        }
    })
}
// @from(Ln 231125, Col 0)
async function H3z(q) {
    let K = await _L6(q.content, q.toolUseId);
    if (YL6(K)) return null;
    return {
        content: lK6(K),
        originalSize: K.originalSize
    }
}
// @from(Ln 231133, Col 0)
async function J3z(q, K, _ = new Set) {
    let z = pZ4(q),
        Y = _.size > 0 ? A3z(q) : void 0,
        A = (P) => Y !== void 0 && _.has(Y.get(P) ?? ""),
        O = BP4,
        w = new Map,
        $ = [],
        j = 0,
        H = 0;
    for (let P of z) {
        let {
            mustReapply: W,
            frozen: D,
            fresh: Z
        } = w3z(P, K);
        if (W.forEach((R) => w.set(R.toolUseId, R.replacement)), j += W.length, Z.length === 0) {
            P.forEach((R) => K.seenIds.add(R.toolUseId));
            continue
        }
        Z.filter((R) => A(R.toolUseId)).forEach((R) => K.seenIds.add(R.toolUseId));
        let f = Z.filter((R) => !A(R.toolUseId)),
            v = D.reduce((R, h) => R + h.size, 0),
            V = f.reduce((R, h) => R + h.size, 0),
            k = v + V > O ? $3z(f, v, O) : [],
            N = new Set(k.map((R) => R.toolUseId));
        if (P.filter((R) => !N.has(R.toolUseId)).forEach((R) => K.seenIds.add(R.toolUseId)), k.length === 0) continue;
        H++, $.push(...k)
    }
    if (w.size === 0 && $.length === 0) return {
        messages: q,
        newlyReplaced: []
    };
    let J = await Promise.all($.map(async (P) => [P, await H3z(P)])),
        X = [],
        M = 0;
    for (let [P, W] of J) {
        if (K.seenIds.add(P.toolUseId), W === null) continue;
        M += P.size, w.set(P.toolUseId, W.content), K.replacements.set(P.toolUseId, W.content), X.push({
            kind: "tool-result",
            toolUseId: P.toolUseId,
            replacement: W.content
        }), d("tengu_tool_result_persisted_message_budget", {
            originalSizeBytes: W.originalSize,
            persistedSizeBytes: W.content.length,
            estimatedOriginalTokens: Math.ceil(W.originalSize / et6),
            estimatedPersistedTokens: Math.ceil(W.content.length / et6)
        })
    }
    if (w.size === 0) return {
        messages: q,
        newlyReplaced: []
    };
    if (X.length > 0) E(`Per-message budget: persisted ${X.length} tool results across ${H} over-budget message(s), shed ~${o4(M)}, ${j} re-applied`), d("tengu_message_level_tool_result_budget_enforced", {
        resultsPersisted: X.length,
        messagesOverBudget: H,
        replacedSizeBytes: M,
        reapplied: j
    });
    return {
        messages: j3z(q, w),
        newlyReplaced: X
    }
}
// @from(Ln 231196, Col 0)
async function FZ4(q, K, _, z) {
    if (!K) return q;
    let Y = await J3z(q, K, z);
    if (Y.newlyReplaced.length > 0) _?.(Y.newlyReplaced);
    return Y.messages
}
// @from(Ln 231203, Col 0)
function XS8(q, K, _) {
    let z = te6(),
        Y = new Set(pZ4(q).flat().map((A) => A.toolUseId));
    for (let A of Y) z.seenIds.add(A);
    for (let A of K)
        if (A.kind === "tool-result" && Y.has(A.toolUseId)) z.replacements.set(A.toolUseId, A.replacement);
    if (_) {
        for (let [A, O] of _)
            if (Y.has(A) && !z.replacements.has(A)) z.replacements.set(A, O)
    }
    return z
}
// @from(Ln 231216, Col 0)
function gZ4(q, K, _) {
    if (!q) return;
    return XS8(K, _, q.replacements)
}
// @from(Ln 231221, Col 0)
function X3z(q) {
    let K = q;
    if (K.code) switch (K.code) {
        case "ENOENT":
            return `Directory not found: ${K.path??"unknown path"}`;
        case "EACCES":
            return `Permission denied: ${K.path??"unknown path"}`;
        case "ENOSPC":
            return "No space left on device";
        case "EROFS":
            return "Read-only file system";
        case "EMFILE":
            return "Too many open files";
        case "EEXIST":
            return `File already exists: ${K.path??"unknown path"}`;
        default:
            return `${K.code}: ${K.message}`
    }
    return q.message
}
// @from(Ln 231241, Col 4)
JQ1 = "tool-results"
// @from(Ln 231242, Col 4)
CZ4 = "<persisted-output>"
// @from(Ln 231243, Col 4)
e5z = "</persisted-output>"
// @from(Ln 231244, Col 4)
q3z = "[Old tool result content cleared]"
// @from(Ln 231245, Col 4)
K3z = "tengu_satin_quoll"
// @from(Ln 231246, Col 4)
KL6 = 2000
// @from(Ln 231247, Col 4)
ND = L(() => {
    y8();
    B1();
    C8();
    q2();
    K8();
    m8();
    c7();
    U8();
    hm();
    e8()
})
// @from(Ln 231260, Col 0)
function ee6(q, K) {
    if (!q.includes("<claude-code-hint")) return {
        hints: [],
        stripped: q
    };
    let _ = f3z(K),
        z = [],
        Y = q.replace(W3z, (O) => {
            let w = Z3z(O),
                $ = Number(w.v),
                j = w.type,
                H = w.value;
            if (!M3z.has($)) return E(`[claudeCodeHints] dropped hint with unsupported v=${w.v}`), "";
            if (!j || !P3z.has(j)) return E(`[claudeCodeHints] dropped hint with unsupported type=${j}`), "";
            if (!H) return E("[claudeCodeHints] dropped hint with empty value"), "";
            return z.push({
                v: $,
                type: j,
                value: H,
                sourceCommand: _
            }), ""
        }),
        A = z.length > 0 || Y !== q ? Y.replace(/\n{3,}/g, `

`) : Y;
    return {
        hints: z,
        stripped: A
    }
}
// @from(Ln 231291, Col 0)
function Z3z(q) {
    let K = {};
    for (let _ of q.matchAll(D3z)) K[_[1]] = _[2] ?? _[3] ?? "";
    return K
}
// @from(Ln 231297, Col 0)
function f3z(q) {
    let K = q.trim(),
        _ = K.search(/\s/);
    return _ === -1 ? K : K.slice(0, _)
}
// @from(Ln 231303, Col 0)
function dZ4(q) {
    if (XQ1) return;
    MS8 = q, QZ4()
}
// @from(Ln 231308, Col 0)
function cZ4() {
    if (MS8 !== null) MS8 = null, QZ4()
}
// @from(Ln 231312, Col 0)
function lZ4() {
    XQ1 = !0
}
// @from(Ln 231316, Col 0)
function MQ1() {
    return MS8
}
// @from(Ln 231320, Col 0)
function iZ4() {
    return XQ1
}
// @from(Ln 231323, Col 4)
M3z
// @from(Ln 231323, Col 9)
P3z
// @from(Ln 231323, Col 14)
W3z
// @from(Ln 231323, Col 19)
D3z
// @from(Ln 231323, Col 24)
MS8 = null
// @from(Ln 231324, Col 4)
XQ1 = !1
// @from(Ln 231325, Col 4)
UZ4
// @from(Ln 231325, Col 9)
QZ4
// @from(Ln 231325, Col 14)
nZ4
// @from(Ln 231326, Col 4)
q68 = L(() => {
    K8();
    nH();
    M3z = new Set([1]), P3z = new Set(["plugin"]), W3z = /^[ \t]*<claude-code-hint\s+([^>]*?)\s*\/>[ \t]*$/gm, D3z = /(\w+)=(?:"([^"]*)"|([^\s/>]+))/g;
    UZ4 = l5(), QZ4 = UZ4.emit;
    nZ4 = UZ4.subscribe
})
// @from(Ln 231346, Col 0)
function E3z() {
    if (qp6()) return rZ4;
    if (S6(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS)) return rZ4;
    return N3z
}
// @from(Ln 231352, Col 0)
function gP() {
    let q = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
    if (q) return kK6(q);
    return PQ1(A7(), E3z())
}
// @from(Ln 231358, Col 0)
function nK6() {
    let q = process.env.CLAUDE_CODE_PLUGIN_SEED_DIR;
    if (!q) return [];
    return q.split(k3z).filter(Boolean).map(kK6)
}
// @from(Ln 231364, Col 0)
function y3z(q) {
    return q.replace(/[^a-zA-Z0-9\-_]/g, "-")
}
// @from(Ln 231368, Col 0)
function K68(q) {
    return PQ1(gP(), "data", y3z(q))
}
// @from(Ln 231372, Col 0)
function Is(q) {
    let K = K68(q);
    return G3z(K, {
        recursive: !0
    }), K
}
// @from(Ln 231378, Col 0)
async function oZ4(q) {
    let K = K68(q),
        _ = 0,
        z = async (Y) => {
            for (let A of await v3z(Y, {
                    withFileTypes: !0
                })) {
                let O = PQ1(Y, A.name);
                if (A.isDirectory()) await z(O);
                else try {
                    _ += (await V3z(O)).size
                } catch {}
            }
        };
    try {
        await z(K)
    } catch (Y) {
        if (D5(Y)) return null;
        throw Y
    }
    if (_ === 0) return null;
    return {
        bytes: _,
        human: o4(_)
    }
}
// @from(Ln 231404, Col 0)
async function PS8(q) {
    let K = K68(q);
    try {
        await T3z(K, {
            recursive: !0,
            force: !0
        })
    } catch (_) {
        E(`Failed to delete plugin data dir ${K}: ${b6(_)}`, {
            level: "warn"
        })
    }
}
// @from(Ln 231417, Col 4)
N3z = "plugins"
// @from(Ln 231418, Col 4)
rZ4 = "cowork_plugins"
// @from(Ln 231419, Col 4)
Jy = L(() => {
    y8();
    K8();
    Q8();
    m8();
    c7();
    Gy6()
})
// @from(Ln 231431, Col 0)
function ej6() {
    let q = {};
    for (let K of tG())
        for (let _ of sZ4) {
            let {
                settings: z
            } = hr(aZ4(K, ".claude", _));
            if (!z?.enabledPlugins) continue;
            Object.assign(q, z.enabledPlugins)
        }
    return q
}
// @from(Ln 231444, Col 0)
function tZ4() {
    let q = {};
    for (let K of tG())
        for (let _ of sZ4) {
            let {
                settings: z
            } = hr(aZ4(K, ".claude", _));
            if (!z?.extraKnownMarketplaces) continue;
            Object.assign(q, z.extraKnownMarketplaces)
        }
    return q
}
// @from(Ln 231456, Col 4)
sZ4
// @from(Ln 231457, Col 4)
WS8 = L(() => {
    y8();
    a1();
    sZ4 = ["settings.json", "settings.local.json"]
})
// @from(Ln 231463, Col 0)
function eZ4(q) {
    return q.type === "dependency-unsatisfied" || q.type === "dependency-version-unsatisfied"
}
// @from(Ln 231467, Col 0)
function GH(q) {
    switch (q.type) {
        case "generic-error":
            return q.error;
        case "path-not-found":
            return `Path not found: ${q.path} (${q.component})`;
        case "path-traversal":
            return `Path escapes plugin directory: ${q.path} (${q.component})`;
        case "git-auth-failed":
            return `Git authentication failed (${q.authType}): ${q.gitUrl}`;
        case "git-timeout":
            return `Git ${q.operation} timeout: ${q.gitUrl}`;
        case "network-error":
            return `Network error: ${q.url}${q.details?` - ${q.details}`:""}`;
        case "manifest-parse-error":
            return `Manifest parse error: ${q.parseError}`;
        case "manifest-validation-error":
            return `Manifest validation failed: ${q.validationErrors.join(", ")}`;
        case "plugin-not-found":
            return `Plugin ${q.pluginId} not found in marketplace ${q.marketplace}`;
        case "marketplace-not-found":
            return `Marketplace ${q.marketplace} not found`;
        case "marketplace-load-failed":
            return `Marketplace ${q.marketplace} failed to load: ${q.reason}`;
        case "mcp-config-invalid":
            return `MCP server ${q.serverName} invalid: ${q.validationError}`;
        case "mcp-server-suppressed-duplicate": {
            let K = q.duplicateOf.startsWith("plugin:") ? `server provided by plugin "${q.duplicateOf.split(":")[1]??"?"}"` : `already-configured "${q.duplicateOf}"`;
            return `MCP server "${q.serverName}" skipped — same command/URL as ${K}`
        }
        case "hook-load-failed":
            return `Hook load failed: ${q.reason}`;
        case "component-load-failed":
            return `${q.component} load failed from ${q.path}: ${q.reason}`;
        case "mcpb-download-failed":
            return `Failed to download MCPB from ${q.url}: ${q.reason}`;
        case "mcpb-extract-failed":
            return `Failed to extract MCPB ${q.mcpbPath}: ${q.reason}`;
        case "mcpb-invalid-manifest":
            return `MCPB manifest invalid at ${q.mcpbPath}: ${q.validationError}`;
        case "lsp-config-invalid":
            return `Plugin "${q.plugin}" has invalid LSP server config for "${q.serverName}": ${q.validationError}`;
        case "lsp-server-start-failed":
            return `Plugin "${q.plugin}" failed to start LSP server "${q.serverName}": ${q.reason}`;
        case "lsp-server-crashed":
            if (q.signal) return `Plugin "${q.plugin}" LSP server "${q.serverName}" crashed with signal ${q.signal}`;
            return `Plugin "${q.plugin}" LSP server "${q.serverName}" crashed with exit code ${q.exitCode??"unknown"}`;
        case "lsp-request-timeout":
            return `Plugin "${q.plugin}" LSP server "${q.serverName}" timed out on ${q.method} request after ${q.timeoutMs}ms`;
        case "lsp-request-failed":
            return `Plugin "${q.plugin}" LSP server "${q.serverName}" ${q.method} request failed: ${q.error}`;
        case "marketplace-blocked-by-policy":
            if (q.blockedByBlocklist) return `Marketplace '${q.marketplace}' is blocked by enterprise policy`;
            return `Marketplace '${q.marketplace}' is not in the allowed marketplace list`;
        case "dependency-unsatisfied": {
            let K = q.reason === "not-enabled" ? "disabled — enable it or remove the dependency" : "not found in any configured marketplace";
            return `Dependency "${q.dependency}" is ${K}`
        }
        case "dependency-version-unsatisfied":
            return `Requires "${q.dependency}" ${q.required}, installed ${q.installed??"version unknown"}`;
        case "plugin-cache-miss":
            return `Plugin "${q.plugin}" not cached at ${q.installPath} — run /plugins to refresh`
    }
}
// @from(Ln 231532, Col 0)
function qf4(q) {
    return q.endsWith(`@${_68}`)
}
// @from(Ln 231536, Col 0)
function Kf4(q) {
    return WQ1.get(q)
}
// @from(Ln 231540, Col 0)
function DQ1() {
    let q = y7(),
        K = [],
        _ = [];
    for (let [z, Y] of WQ1) {
        if (Y.isAvailable && !Y.isAvailable()) continue;
        let A = `${z}@${_68}`,
            O = q?.enabledPlugins?.[A],
            w = O !== void 0 ? O === !0 : Y.defaultEnabled ?? !0,
            $ = {
                name: z,
                manifest: {
                    name: z,
                    description: Y.description,
                    version: Y.version
                },
                path: _68,
                source: A,
                repository: A,
                enabled: w,
                isBuiltin: !0,
                hooksConfig: Y.hooks,
                mcpServers: Y.mcpServers
            };
        if (w) K.push($);
        else _.push($)
    }
    return {
        enabled: K,
        disabled: _
    }
}
// @from(Ln 231573, Col 0)
function _f4() {
    let {
        enabled: q
    } = DQ1(), K = [];
    for (let _ of q) {
        let z = WQ1.get(_.name);
        if (!z?.skills) continue;
        for (let Y of z.skills) K.push(L3z(Y))
    }
    return K
}
// @from(Ln 231585, Col 0)
function L3z(q) {
    return {
        type: "prompt",
        name: q.name,
        description: q.description,
        hasUserSpecifiedDescription: !0,
        allowedTools: q.allowedTools ?? [],
        argumentHint: q.argumentHint,
        whenToUse: q.whenToUse,
        model: q.model,
        disableModelInvocation: q.disableModelInvocation ?? !1,
        userInvocable: q.userInvocable ?? !0,
        contentLength: 0,
        source: "bundled",
        loadedFrom: "bundled",
        hooks: q.hooks,
        context: q.context,
        agent: q.agent,
        isEnabled: q.isEnabled ?? (() => !0),
        isHidden: !(q.userInvocable ?? !0),
        progressMessage: "running",
        getPromptForCommand: q.getPromptForCommand
    }
}
// @from(Ln 231609, Col 4)
WQ1
// @from(Ln 231609, Col 9)
_68 = "builtin"
// @from(Ln 231610, Col 4)
z68 = L(() => {
    a1();
    WQ1 = new Map
})
// @from(Ln 231615, Col 0)
function Z4(q) {
    if (q.includes("@")) {
        let K = q.split("@");
        return {
            name: K[0] || "",
            marketplace: K[1]
        }
    }
    return {
        name: q
    }
}
// @from(Ln 231628, Col 0)
function eI(q) {
    return q !== void 0 && vU.has(q.toLowerCase())
}
// @from(Ln 231632, Col 0)
function jc(q) {
    if (q === "managed") throw Error("Cannot install plugins to managed scope");
    return h3z[q]
}
// @from(Ln 231637, Col 0)
function zf4(q) {
    return ZQ1[q]
}
// @from(Ln 231640, Col 4)
ZQ1
// @from(Ln 231640, Col 9)
h3z
// @from(Ln 231641, Col 4)
aW = L(() => {
    Hv();
    ZQ1 = {
        policySettings: "managed",
        userSettings: "user",
        projectSettings: "project",
        localSettings: "local",
        flagSettings: "flag"
    };
    h3z = {
        user: "userSettings",
        project: "projectSettings",
        local: "localSettings"
    }
})
// @from(Ln 231657, Col 0)
function Af4(q) {
    if (q === null || typeof q !== "object") return;
    let K = "dependencies" in q ? q.dependencies : void 0;
    if (!Array.isArray(K)) return;
    let _ = new Map;
    for (let z of K) {
        if (z === null || typeof z !== "object") continue;
        let Y = "name" in z ? z.name : void 0;
        if (typeof Y !== "string" || Y.length === 0) continue;
        let A = "version" in z && typeof z.version === "string" ? z.version : void 0,
            O = "sha" in z && typeof z.sha === "string" ? z.sha : void 0;
        if (A === void 0 && O === void 0) continue;
        let w = "marketplace" in z && typeof z.marketplace === "string" ? z.marketplace : void 0,
            $ = w ? `${Y}@${w}` : Y;
        _.set($, {
            version: A,
            sha: O
        })
    }
    return _.size > 0 ? _ : void 0
}
// @from(Ln 231679, Col 0)
function Hc(q, K) {
    if (Z4(q).marketplace) return q;
    let _ = Z4(K).marketplace;
    if (!_ || _ === R3z) return q;
    return `${q}@${_}`
}
// @from(Ln 231686, Col 0)
function fQ1(q) {
    return E(`intersectConstraints: ${q} — treating as too complex`, {
        level: "warn"
    }), {
        ok: !1,
        reason: "too-complex"
    }
}
// @from(Ln 231695, Col 0)
function Of4(q) {
    if (q.length === 0) return {
        ok: !0,
        range: "*"
    };
    let K = 0;
    for (let O of q) K += O.length;
    if (K > Yf4) return fQ1(`total input ${K} chars > ${Yf4}`);
    let _ = [];
    for (let O of q) {
        let w = qx.validRange(O);
        if (w === null) return {
            ok: !1,
            reason: "invalid"
        };
        _.push(w.split("||").map(($) => $.trim()).filter(Boolean))
    }
    let z = _[0] ?? [];
    if (z.length > DS8) return fQ1(`${z.length} conjuncts after 1/${q.length} inputs > ${DS8}`);
    for (let O = 1; O < _.length; O++) {
        let w = _[O] ?? [],
            $ = z.length * w.length;
        if ($ > DS8) return fQ1(`${$} conjuncts after ${O+1}/${q.length} inputs > ${DS8}`);
        let j = [];
        for (let H of z)
            for (let J of w) j.push(`${H} ${J}`);
        z = j
    }
    let Y = z.filter((O) => {
        let w = qx.validRange(O);
        return w !== null && qx.minVersion(w) !== null
    });
    if (Y.length === 0) return {
        ok: !1,
        reason: "disjoint"
    };
    let A = qx.validRange(Y.join(" || "));
    return A === null ? {
        ok: !1,
        reason: "disjoint"
    } : {
        ok: !0,
        range: A
    }
}
// @from(Ln 231741, Col 0)
function ZS8(q) {
    return MO(q).replace(S3z, "")
}
// @from(Ln 231745, Col 0)
function wf4(q) {
    if (q.length <= GQ1) return q;
    return `${q.slice(0,GQ1)}… (+${q.length-GQ1} chars)`
}
// @from(Ln 231750, Col 0)
function fS8(q, K, _, z) {
    let Y = wf4(ZS8(_.join(", "))),
        A = ZS8(K);
    switch (z) {
        case "disjoint":
            return `${q} "${A}" has conflicting version requirements (no version satisfies all of: ${Y})`;
        case "too-complex":
            return `${q} "${A}" has version requirements too complex to intersect — simplify the ranges: ${Y}`;
        case "invalid":
            return `${q} "${A}" has an invalid version requirement among: ${Y}`
    }
}
// @from(Ln 231763, Col 0)
function GS8(q, K, _) {
    let z = wf4(ZS8(_));
    return `${q} "${ZS8(K)}" has no git tag satisfying ${z}`
}
// @from(Ln 231768, Col 0)
function $f4(q, K) {
    let _ = [];
    for (let z of K) {
        if (!z.depConstraints) continue;
        for (let [Y, A] of z.depConstraints)
            if (Hc(Y, z.source) === q) {
                _.push({
                    plugin: z,
                    constraint: A
                });
                break
            }
    }
    return _
}
// @from(Ln 231783, Col 0)
async function jf4(q, K, _, z = new Set) {
    let Y = Z4(q).marketplace,
        A = [],
        O = new Set,
        w = [];
    async function $(H, J) {
        if (H !== q && _.has(H)) return null;
        let X = Z4(H).marketplace;
        if (X !== Y && !(X && z.has(X))) return {
            ok: !1,
            reason: "cross-marketplace",
            dependency: H,
            requiredBy: J
        };
        if (w.includes(H)) return {
            ok: !1,
            reason: "cycle",
            chain: [...w, H]
        };
        if (O.has(H)) return null;
        O.add(H);
        let M = await K(H);
        if (!M) return {
            ok: !1,
            reason: "not-found",
            missing: H,
            requiredBy: J
        };
        w.push(H);
        for (let P of M.dependencies ?? []) {
            let W = Hc(P, H),
                D = await $(W, H);
            if (D) return D
        }
        return w.pop(), A.push(H), null
    }
    let j = await $(q, q);
    if (j) return j;
    return {
        ok: !0,
        closure: A
    }
}
// @from(Ln 231827, Col 0)
function Hf4(q) {
    let K = new Set(q.map((j) => j.source)),
        _ = new Set(q.filter((j) => j.enabled).map((j) => j.source)),
        z = new Map(q.map((j) => [j.source, j])),
        Y = new Set(q.map((j) => Z4(j.source).name)),
        A = new Map;
    for (let j of _) {
        let H = Z4(j).name;
        A.set(H, (A.get(H) ?? 0) + 1)
    }
    let O = [],
        w = !0;
    while (w) {
        w = !1;
        for (let j of q) {
            if (!_.has(j.source)) continue;
            for (let H of j.manifest.dependencies ?? []) {
                let J = Hc(H, j.source),
                    X = !Z4(J).marketplace,
                    M = X ? (A.get(J) ?? 0) > 0 : _.has(J),
                    P;
                if (!M) P = {
                    type: "dependency-unsatisfied",
                    source: j.source,
                    plugin: j.name,
                    dependency: J,
                    reason: (X ? Y.has(J) : K.has(J)) ? "not-enabled" : "not-found"
                };
                else if (!X) {
                    let W = j.depConstraints?.get(H)?.version;
                    if (W !== void 0) {
                        let D = z.get(J),
                            Z = D?.resolvedVersion ?? D?.manifest.version,
                            G = qx.valid(Z) ?? qx.coerce(Z)?.version;
                        if (G === void 0 || !qx.satisfies(G, W)) P = {
                            type: "dependency-version-unsatisfied",
                            source: j.source,
                            plugin: j.name,
                            dependency: J,
                            required: W,
                            installed: Z
                        }
                    }
                }
                if (P) {
                    _.delete(j.source);
                    let W = A.get(j.name) ?? 0;
                    if (W <= 1) A.delete(j.name);
                    else A.set(j.name, W - 1);
                    O.push(P), w = !0;
                    break
                }
            }
        }
    }
    return {
        demoted: new Set(q.filter((j) => j.enabled && !_.has(j.source)).map((j) => j.source)),
        errors: O
    }
}
// @from(Ln 231888, Col 0)
function vQ1(q, K) {
    let {
        name: _
    } = Z4(q);
    return K.filter((z) => z.enabled && z.source !== q && (z.manifest.dependencies ?? []).some((Y) => {
        let A = Hc(Y, z.source);
        return Z4(A).marketplace ? A === q : A === _
    })).map((z) => z.name)
}
// @from(Ln 231898, Col 0)
function Jf4(q) {
    return new Set(Object.entries(E1(q)?.enabledPlugins ?? {}).filter(([, K]) => K === !0 || Array.isArray(K)).map(([K]) => K))
}
// @from(Ln 231902, Col 0)
function Xf4(q) {
    if (q.length === 0) return "";
    let K = q.length,
        _ = 5,
        z = q.map((A) => Z4(A).name),
        Y = z.length <= _ ? z.join(", ") : `${z.slice(0,_).join(", ")}, …`;
    return ` (+ ${K} ${O7(K,"dependency","dependencies")}: ${Y})`
}
// @from(Ln 231911, Col 0)
function TQ1(q) {
    if (!q || q.length === 0) return "";
    return ` — warning: required by ${q.join(", ")}`
}
// @from(Ln 231915, Col 4)
qx
// @from(Ln 231915, Col 8)
R3z = "inline"
// @from(Ln 231916, Col 4)
DS8 = 1024
// @from(Ln 231917, Col 4)
Yf4 = 4096
// @from(Ln 231918, Col 4)
GQ1 = 200
// @from(Ln 231919, Col 4)
S3z
// @from(Ln 231920, Col 4)
vS8 = L(() => {
    mN();
    K8();
    a1();
    aW();
    qx = K6(Pd(), 1);
    S3z = /[\x00-\x08\x0b-\x1f\x7f]/g
})
// @from(Ln 231928, Col 4)
AL6
// @from(Ln 231928, Col 9)
WM = "claude-plugins-official"
// @from(Ln 231929, Col 4)
qH6 = L(() => {
    AL6 = {
        source: "github",
        repo: "anthropics/claude-plugins-official"
    }
})
// @from(Ln 231936, Col 0)
function b3z(q) {
    let K, _ = /^[^@/]+@([^:/]+):/.exec(q);
    if (_) K = _[1];
    else try {
        K = new URL(q).hostname
    } catch {
        return "unknown"
    }
    let z = K.toLowerCase();
    return C3z.has(z) ? z : "other"
}
// @from(Ln 231948, Col 0)
function I3z(q) {
    return q.includes(`anthropics/${WM}`)
}
// @from(Ln 231952, Col 0)
function ED(q, K, _, z, Y) {
    d("tengu_plugin_remote_fetch", {
        source: q,
        host: K ? b3z(K) : "unknown",
        is_official: K ? I3z(K) : !1,
        outcome: _,
        duration_ms: Math.round(z),
        ...Y && {
            error_kind: Y
        }
    })
}
// @from(Ln 231965, Col 0)
function Kx(q) {
    let K = String(q?.message ?? q);
    if (/ENOTFOUND|ECONNREFUSED|EAI_AGAIN|Could not resolve host|Connection refused/i.test(K)) return "dns_or_refused";
    if (/ETIMEDOUT|timed out|timeout/i.test(K)) return "timeout";
    if (/ECONNRESET|socket hang up|Connection reset by peer|remote end hung up/i.test(K)) return "conn_reset";
    if (/403|401|authentication|permission denied/i.test(K)) return "auth";
    if (/404|not found|repository not found/i.test(K)) return "not_found";
    if (/certificate|SSL|TLS|unable to get local issuer/i.test(K)) return "tls";
    if (/Invalid response format|Invalid marketplace schema/i.test(K)) return "invalid_schema";
    return "other"
}
// @from(Ln 231976, Col 4)
C3z
// @from(Ln 231977, Col 4)
Y68 = L(() => {
    C8();
    qH6();
    C3z = new Set(["github.com", "raw.githubusercontent.com", "objects.githubusercontent.com", "gist.githubusercontent.com", "gitlab.com", "bitbucket.org", "codeberg.org", "dev.azure.com", "ssh.dev.azure.com", "storage.googleapis.com"])
})
// @from(Ln 231982, Col 0)
async function x3z(q) {
    try {
        return !!await oA(q)
    } catch {
        return !1
    }
}
// @from(Ln 231990, Col 0)
function Mf4() {
    KH6.cache?.set?.(void 0, Promise.resolve(!1))
}
// @from(Ln 231993, Col 4)
KH6
// @from(Ln 231994, Col 4)
TS8 = L(() => {
    U4();
    n0();
    KH6 = P1(async () => {
        return x3z("git")
    })
})
// @from(Ln 232001, Col 4)
IR
// @from(Ln 232001, Col 8)
hp
// @from(Ln 232002, Col 4)
A68 = L(() => {
    IR = {
        GIT_TERMINAL_PROMPT: "0",
        GIT_ASKPASS: ""
    }, hp = ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes"]
})
// @from(Ln 232009, Col 0)
function Xy() {
    let q = E1("policySettings")?.enabledPlugins;
    if (!q) return null;
    let K = new Set;
    for (let [_, z] of Object.entries(q)) {
        if (typeof z !== "boolean" || !_.includes("@")) continue;
        let Y = i5(_, "@");
        if (Y) K.add(Y)
    }
    return K.size > 0 ? K : null
}
// @from(Ln 232021, Col 0)
function OL6() {
    let q = E1("policySettings")?.enabledPlugins;
    if (!q) return null;
    let K = new Set;
    for (let [_, z] of Object.entries(q))
        if (z === !0 && _.includes("@")) K.add(_);
    return K.size > 0 ? K : null
}
// @from(Ln 232029, Col 4)
iK6 = L(() => {
    a1()
})
// @from(Ln 232033, Col 0)
function wL6(q, K) {
    let z = q.slice(0, 2).map((O) => {
            let w = O.reason || O.error || "unknown error";
            return K ? `${O.name} (${w})` : O.name
        }).join(K ? "; " : ", "),
        Y = q.length - 2,
        A = Y > 0 ? ` and ${Y} more` : "";
    return `${z}${A}`
}
// @from(Ln 232043, Col 0)
function O68(q) {
    switch (q.source) {
        case "github":
            return q.repo;
        case "url":
            return q.url;
        case "git":
            return q.url;
        case "directory":
            return q.path;
        case "file":
            return q.path;
        case "settings":
            return `settings:${q.name}`;
        default:
            return "Unknown source"
    }
}
// @from(Ln 232062, Col 0)
function Jc(q, K) {
    return `${q}@${K}`
}
// @from(Ln 232065, Col 0)
async function Rp(q) {
    let K = [],
        _ = [];
    for (let [z, Y] of Object.entries(q)) {
        if (!_H6(Y.source)) continue;
        let A = null;
        try {
            A = await xf(z)
        } catch (O) {
            let w = O instanceof Error ? O.message : String(O);
            _.push({
                name: z,
                error: w
            }), j6(r1(O))
        }
        K.push({
            name: z,
            config: Y,
            data: A
        })
    }
    return {
        marketplaces: K,
        failures: _
    }
}
// @from(Ln 232092, Col 0)
function $L6(q, K) {
    if (q.length === 0) return null;
    if (K > 0) return {
        type: "warning",
        message: q.length === 1 ? `Warning: Failed to load marketplace '${q[0].name}': ${q[0].error}` : `Warning: Failed to load ${q.length} marketplaces: ${u3z(q)}`
    };
    return {
        type: "error",
        message: `Failed to load all marketplaces. Errors: ${m3z(q)}`
    }
}
// @from(Ln 232104, Col 0)
function u3z(q) {
    return q.map((K) => K.name).join(", ")
}
// @from(Ln 232108, Col 0)
function m3z(q) {
    return q.map((K) => `${K.name}: ${K.error}`).join("; ")
}
// @from(Ln 232112, Col 0)
function oK6() {
    let q = E1("policySettings");
    if (!q?.strictKnownMarketplaces) return null;
    return q.strictKnownMarketplaces
}
// @from(Ln 232118, Col 0)
function VQ1() {
    let q = E1("policySettings");
    if (!q?.blockedMarketplaces) return null;
    return q.blockedMarketplaces
}
// @from(Ln 232124, Col 0)
function Wf4() {
    return E1("policySettings")?.pluginTrustMessage
}
// @from(Ln 232128, Col 0)
function B3z(q, K) {
    if (q.source !== K.source) return !1;
    switch (q.source) {
        case "url":
            return q.url === K.url;
        case "github":
            return q.repo === K.repo && (q.ref || void 0) === (K.ref || void 0) && (q.path || void 0) === (K.path || void 0);
        case "git":
            return q.url === K.url && (q.ref || void 0) === (K.ref || void 0) && (q.path || void 0) === (K.path || void 0);
        case "npm":
            return q.package === K.package;
        case "file":
            return q.path === K.path;
        case "directory":
            return q.path === K.path;
        case "settings":
            return q.name === K.name && f$(q.plugins, K.plugins);
        default:
            return !1
    }
}
// @from(Ln 232150, Col 0)
function kQ1(q) {
    switch (q.source) {
        case "github":
            return "github.com";
        case "git": {
            let K = q.url.match(/^[^@]+@([^:]+):/);
            if (K?.[1]) return K[1];
            try {
                return new URL(q.url).hostname
            } catch {
                return null
            }
        }
        case "url":
            try {
                return new URL(q.url).hostname
            } catch {
                return null
            }
        default:
            return null
    }
}
// @from(Ln 232174, Col 0)
function p3z(q, K) {
    let _ = kQ1(q);
    if (!_) return !1;
    try {
        return new RegExp(K.hostPattern).test(_)
    } catch {
        return j6(Error(`Invalid hostPattern regex: ${K.hostPattern}`)), !1
    }
}
// @from(Ln 232184, Col 0)
function F3z(q, K) {
    if (q.source !== "file" && q.source !== "directory") return !1;
    try {
        return new RegExp(K.pathPattern).test(q.path)
    } catch {
        return j6(Error(`Invalid pathPattern regex: ${K.pathPattern}`)), !1
    }
}
// @from(Ln 232193, Col 0)
function Df4() {
    let q = oK6();
    if (!q) return [];
    return q.filter((K) => K.source === "hostPattern").map((K) => K.hostPattern)
}
// @from(Ln 232199, Col 0)
function Pf4(q) {
    let K = q.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/);
    if (K && K[1]) return K[1];
    let _ = q.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/);
    if (_ && _[1]) return _[1];
    return null
}
// @from(Ln 232207, Col 0)
function rK6(q, K) {
    if (!q) return !0;
    return (q || void 0) === (K || void 0)
}
// @from(Ln 232212, Col 0)
function g3z(q, K) {
    if (q.source === K.source) switch (q.source) {
        case "github": {
            let _ = K;
            if (q.repo !== _.repo) return !1;
            return rK6(_.ref, q.ref) && rK6(_.path, q.path)
        }
        case "git": {
            let _ = K;
            if (q.url !== _.url) return !1;
            return rK6(_.ref, q.ref) && rK6(_.path, q.path)
        }
        case "url":
            return q.url === K.url;
        case "npm":
            return q.package === K.package;
        case "file":
            return q.path === K.path;
        case "directory":
            return q.path === K.path;
        case "settings":
            return q.name === K.name;
        default:
            return !1
    }
    if (q.source === "git" && K.source === "github") {
        if (Pf4(q.url) === K.repo) return rK6(K.ref, q.ref) && rK6(K.path, q.path)
    }
    if (q.source === "github" && K.source === "git") {
        if (Pf4(K.url) === q.repo) return rK6(K.ref, q.ref) && rK6(K.path, q.path)
    }
    return !1
}
// @from(Ln 232246, Col 0)
function w68(q) {
    let K = VQ1();
    if (K === null) return !1;
    return K.some((_) => g3z(q, _))
}
// @from(Ln 232252, Col 0)
function _H6(q) {
    if (w68(q)) return !1;
    let K = oK6();
    if (K === null) return !0;
    return K.some((_) => {
        if (_.source === "hostPattern") return p3z(q, _);
        if (_.source === "pathPattern") return F3z(q, _);
        return B3z(q, _)
    })
}
// @from(Ln 232263, Col 0)
function zH6(q) {
    switch (q.source) {
        case "github":
            return `github:${q.repo}${q.ref?`@${q.ref}`:""}`;
        case "url":
            return q.url;
        case "git":
            return `git:${q.url}${q.ref?`@${q.ref}`:""}`;
        case "npm":
            return `npm:${q.package}`;
        case "file":
            return `file:${q.path}`;
        case "directory":
            return `dir:${q.path}`;
        case "hostPattern":
            return `hostPattern:${q.hostPattern}`;
        case "pathPattern":
            return `pathPattern:${q.pathPattern}`;
        case "settings":
            return `settings:${q.name} (${q.plugins.length} ${O7(q.plugins.length,"plugin")})`;
        default:
            return "unknown source"
    }
}
// @from(Ln 232287, Col 0)
async function Zf4({
    configuredMarketplaceCount: q,
    failedMarketplaceCount: K
}) {
    if (!await KH6()) return "git-not-installed";
    let z = oK6();
    if (z !== null) {
        if (z.length === 0) return "all-blocked-by-policy";
        if (q === 0) return "policy-restricts-sources"
    }
    if (q === 0) return "no-marketplaces-configured";
    if (K > 0 && K === q) return "all-marketplaces-failed";
    return "all-plugins-installed"
}
// @from(Ln 232301, Col 4)
Xc = L(() => {
    JU();
    m8();
    U8();
    a1();
    TS8();
    m$()
})
// @from(Ln 232312, Col 0)
async function VS8(q) {
    let K;
    try {
        K = await U3z(q)
    } catch (z) {
        if (D5(z)) return {
            ran: !1
        };
        throw z
    }
    let _ = new Set(K);
    if (!_.has("package.json")) return {
        ran: !1
    };
    for (let z of d3z) {
        if (!_.has(z.lockfile)) continue;
        E(`Installing plugin dependencies: ${z.command} ${z.args.join(" ")} in ${q}`);
        let Y = await M7(z.command, z.args, {
            cwd: q,
            timeout: Q3z
        });
        if (Y.code !== 0) return {
            ran: !0,
            error: `Plugin dependency install failed (${z.command}): ${Y.stderr||Y.stdout||Y.error||"no output"}`.slice(0, 500)
        };
        return E(`Plugin dependency install succeeded (${z.command}) in ${q}`), {
            ran: !0
        }
    }
    if (_.has("yarn.lock") || _.has("pnpm-lock.yaml")) return {
        ran: !1,
        error: "Skipped: yarn/pnpm lockfiles are not supported (resolution-time hooks bypass --ignore-scripts). Use bun or npm."
    };
    return {
        ran: !1
    }
}
// @from(Ln 232349, Col 4)
Q3z = 60000
// @from(Ln 232350, Col 4)
d3z
// @from(Ln 232351, Col 4)
NQ1 = L(() => {
    K8();
    m8();
    Q4();
    d3z = [{
        lockfile: "bun.lock",
        command: "bun",
        args: ["install", "--frozen-lockfile", "--ignore-scripts"]
    }, {
        lockfile: "bun.lockb",
        command: "bun",
        args: ["install", "--frozen-lockfile", "--ignore-scripts"]
    }, {
        lockfile: "npm-shrinkwrap.json",
        command: "npm",
        args: ["ci", "--ignore-scripts"]
    }, {
        lockfile: "package-lock.json",
        command: "npm",
        args: ["ci", "--ignore-scripts"]
    }]
})
// @from(Ln 232374, Col 0)
function c3z(q) {
    let K = BigInt(58),
        _ = Array(22).fill("1"),
        z = 21,
        Y = q;
    while (Y > 0n) {
        let A = Number(Y % K);
        _[z] = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" [A], Y = Y / K, z--
    }
    return _.join("")
}
// @from(Ln 232386, Col 0)
function l3z(q) {
    let K = q.replaceAll("-", "");
    if (K.length !== 32) throw Error(`Invalid UUID hex length: ${K.length}`);
    return BigInt("0x" + K)
}
// @from(Ln 232392, Col 0)
function ff4(q, K) {
    let _ = l3z(K);
    return `${q}_01${c3z(_)}`
}
// @from(Ln 232397, Col 0)
function EQ1(q) {
    let K = n3z[q],
        _ = process.env[q];
    if (_ === void 0) return K;
    return S6(_)
}
// @from(Ln 232404, Col 0)
function jL6() {
    let q = $I(),
        K = I8(),
        _ = {
            "user.id": q
        };
    if (EQ1("OTEL_METRICS_INCLUDE_SESSION_ID")) _["session.id"] = K;
    if (EQ1("OTEL_METRICS_INCLUDE_VERSION")) _["app.version"] = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION;
    let z = k_();
    if (z) {
        let {
            organizationUuid: Y,
            emailAddress: A,
            accountUuid: O
        } = z;
        if (Y) _["organization.id"] = Y;
        if (A) _["user.email"] = A;
        if (O && EQ1("OTEL_METRICS_INCLUDE_ACCOUNT_UUID")) _["user.account_uuid"] = O, _["user.account_id"] = process.env.CLAUDE_CODE_ACCOUNT_TAGGED_ID || ff4("user", O)
    }
    if (UE.terminal) _["terminal.type"] = UE.terminal;
    return _
}
// @from(Ln 232433, Col 4)
n3z
// @from(Ln 232434, Col 4)
kS8 = L(() => {
    y8();
    T7();
    h1();
    w46();
    Q8();
    n3z = {
        OTEL_METRICS_INCLUDE_SESSION_ID: !0,
        OTEL_METRICS_INCLUDE_VERSION: !1,
        OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
    }
})
// @from(Ln 232447, Col 0)
function r3z() {
    return S6(process.env.OTEL_LOG_USER_PROMPTS)
}
// @from(Ln 232451, Col 0)
function NS8(q) {
    return r3z() ? q : "<REDACTED>"
}
// @from(Ln 232454, Col 0)
async function Xz(q, K = {}) {
    let _ = z81();
    if (!_) {
        if (!Gf4) Gf4 = !0, E(`[3P telemetry] Event dropped (no event logger initialized): ${q}`, {
            level: "warn"
        });
        return
    }
    let z = {
            ...jL6(),
            "event.name": q,
            "event.timestamp": new Date().toISOString(),
            "event.sequence": i3z++
        },
        Y = $p6();
    if (Y) z["prompt.id"] = Y;
    let A = process.env.CLAUDE_CODE_WORKSPACE_HOST_PATHS;
    if (A) z["workspace.host_paths"] = A.split("|");
    for (let [O, w] of Object.entries(K))
        if (w !== void 0) z[O] = w;
    _.emit({
        body: `claude_code.${q}`,
        attributes: z
    })
}
// @from(Ln 232480, Col 0)
function aK6(q) {
    Xz("compaction", {
        trigger: q.trigger,
        success: String(q.success),
        duration_ms: String(Math.round(q.durationMs)),
        ...q.preTokens !== void 0 && {
            pre_tokens: String(q.preTokens)
        },
        ...q.postTokens !== void 0 && {
            post_tokens: String(q.postTokens)
        },
        ...q.error && {
            error: q.error
        }
    })
}
// @from(Ln 232496, Col 4)
i3z = 0
// @from(Ln 232497, Col 4)
Gf4 = !1
// @from(Ln 232498, Col 4)
uf = L(() => {
    y8();
    K8();
    Q8();
    kS8()
})
// @from(Ln 232511, Col 0)
function t3z(q, K) {
    let _ = K ? `${q}@${K.toLowerCase()}` : q;
    return o3z("sha256").update(_ + s3z).digest("hex").slice(0, 16)
}
// @from(Ln 232516, Col 0)
function e3z(q, K, _) {
    if (K === a3z) return "default-bundle";
    if (eI(K)) return "official";
    if (_?.has(q)) return "org";
    return "user-local"
}
// @from(Ln 232523, Col 0)
function xs(q, K, _, z) {
    return {
        ...q && {
            skill_source: q
        },
        ...K && {
            skill_loaded_from: K
        },
        ..._ && {
            skill_kind: _
        },
        ...z && {
            skill_created_by: z
        }
    }
}
// @from(Ln 232540, Col 0)
function q9z(q, K, _) {
    if (q.isBuiltin) return "default-enable";
    if (K?.has(q.name)) return "org-policy";
    if (_.some((z) => q.path.startsWith(z.endsWith(vf4) ? z : z + vf4))) return "seed-mount";
    return "user-install"
}
// @from(Ln 232547, Col 0)
function xR(q, K, _ = null) {
    let z = e3z(q, K, _),
        Y = z === "official" || z === "default-bundle";
    return {
        plugin_id_hash: t3z(q, K),
        plugin_scope: z,
        plugin_name_redacted: Y ? q : "third-party",
        marketplace_name_redacted: Y && K ? K : "third-party",
        is_official_plugin: Y
    }
}
// @from(Ln 232559, Col 0)
function YH6(q, K = null) {
    let {
        marketplace: _
    } = Z4(q.repository);
    return xR(q.pluginManifest.name, _, K)
}
// @from(Ln 232566, Col 0)
function Tf4(q, K, _) {
    for (let z of q) {
        let {
            marketplace: Y
        } = Z4(z.repository);
        d("tengu_plugin_enabled_for_session", {
            _PROTO_plugin_name: z.name,
            ...Y && {
                _PROTO_marketplace_name: Y
            },
            ...xR(z.name, Y, K),
            enabled_via: q9z(z, K, _),
            skill_path_count: (z.skillsPath ? 1 : 0) + (z.skillsPaths?.length ?? 0),
            command_path_count: (z.commandsPath ? 1 : 0) + (z.commandsPaths?.length ?? 0),
            agent_path_count: (z.agentsPath ? 1 : 0) + (z.agentsPaths?.length ?? 0),
            has_mcp: z.mcpServers !== void 0,
            has_lsp: z.lspServers !== void 0,
            has_hooks: z.hooksConfig !== void 0,
            has_settings: z.settings !== void 0,
            ...z.settings && {
                settings_keys: Object.keys(z.settings).sort().join(",")
            },
            ...z.manifest.version && {
                version: z.manifest.version
            }
        })
    }
}
// @from(Ln 232595, Col 0)
function Vf4(q) {
    let K = String(q?.message ?? q);
    if (/ENOTFOUND|ECONNREFUSED|EAI_AGAIN|ETIMEDOUT|ECONNRESET|network|Could not resolve|Connection refused|timed out/i.test(K)) return "network";
    if (/\b404\b|not found|does not exist|no such plugin/i.test(K)) return "not-found";
    if (/\b40[13]\b|EACCES|EPERM|permission denied|unauthorized/i.test(K)) return "permission";
    if (/invalid|malformed|schema|validation|parse error/i.test(K)) return "validation";
    return "unknown"
}
// @from(Ln 232604, Col 0)
function kf4(q, K) {
    for (let _ of q) {
        let {
            name: z,
            marketplace: Y
        } = Z4(_.source), A = "plugin" in _ && _.plugin ? _.plugin : z;
        d("tengu_plugin_load_failed", {
            error_category: _.type,
            _PROTO_plugin_name: A,
            ...Y && {
                _PROTO_marketplace_name: Y
            },
            ...xR(A, Y, K)
        })
    }
}
// @from(Ln 232620, Col 4)
a3z = "builtin"
// @from(Ln 232621, Col 4)
s3z = "claude-plugin-telemetry-v1"
// @from(Ln 232622, Col 4)
sK6 = L(() => {
    C8();
    aW()
})
// @from(Ln 232627, Col 0)
function Rk(q) {
    return E1("policySettings")?.enabledPlugins?.[q] === !1
}
// @from(Ln 232630, Col 4)
AH6 = L(() => {
    a1()
})
// @from(Ln 232636, Col 0)
async function us(q, K, _, z, Y, A) {
    if (_?.version) return E(`Using manifest version for ${q}: ${_.version}`), _.version;
    if (Y) return E(`Using provided version for ${q}: ${Y}`), Y;
    if (A) {
        let O = A.substring(0, 12);
        if (typeof K === "object" && K.source === "git-subdir") {
            let w = K.path.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/+$/, ""),
                $ = K9z("sha256").update(w).digest("hex").substring(0, 8),
                j = `${O}-${$}`;
            return E(`Using git-subdir SHA+path version for ${q}: ${j} (path=${w})`), j
        }
        return E(`Using pre-resolved git SHA for ${q}: ${O}`), O
    }
    if (z) {
        let O = await _9z(z);
        if (O) {
            let w = O.substring(0, 12);
            return E(`Using git SHA for ${q}: ${w}`), w
        }
    }
    return E(`No version found for ${q}, using 'unknown'`), "unknown"
}
// @from(Ln 232659, Col 0)
function _9z(q) {
    return ZQ6(q)
}
// @from(Ln 232663, Col 0)
function Ef4(q) {
    if (typeof q === "string") return null;
    switch (q.source) {
        case "github":
            return Nf4(q.repo);
        case "url":
            return q.url;
        case "git-subdir":
            return /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(q.url) ? Nf4(q.url) : q.url;
        default:
            return null
    }
}
// @from(Ln 232677, Col 0)
function Nf4(q) {
    return S6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${q}.git` : `git@github.com:${q}.git`
}
// @from(Ln 232680, Col 0)
async function yf4(q, K, _, z) {
    if (!z9z(q)) return E(`resolveVersionRange: rejected unsafe URL ${q}`), null;
    let Y = z?.get(q);
    if (Y === void 0) Y = w1("git", [...hp, "ls-remote", "--tags", "--", q], {
        env: {
            ...process.env,
            ...IR
        }
    }).then((H) => H.code !== 0 ? Promise.reject(Error(`ls-remote exit ${H.code}`)) : H.stdout), z?.set(q, Y);
    let A;
    try {
        A = await Y
    } catch (H) {
        return E(`resolveVersionRange: ls-remote failed for ${q}: ${H instanceof Error?H.message:String(H)}`), null
    }
    let O = `${K}--v`,
        w = new Map;
    for (let H of A.split(`
`)) {
        let J = H.indexOf("\t");
        if (J === -1) continue;
        let X = H.slice(0, J),
            M = H.slice(J + 1);
        if (!M.startsWith("refs/tags/")) continue;
        let P = M.slice(10),
            W = P.endsWith("^{}");
        if (W) P = P.slice(0, -3);
        if (!P.startsWith(O)) continue;
        let D = ES8.clean(P.slice(O.length));
        if (D === null) continue;
        if (!W && w.has(P)) continue;
        w.set(P, {
            version: D,
            ref: P,
            sha: X
        })
    }
    if (w.size === 0) return null;
    let $ = [...w.values()],
        j = ES8.maxSatisfying($.map((H) => H.version), _);
    if (j === null) return null;
    return $.find((H) => H.version === j) ?? null
}
// @from(Ln 232724, Col 0)
function z9z(q) {
    if (/^git@[a-zA-Z0-9.-]+:/.test(q)) return !0;
    try {
        return ["https:", "http:", "file:"].includes(new URL(q).protocol)
    } catch {
        return !1
    }
}
// @from(Ln 232732, Col 4)
ES8
// @from(Ln 232733, Col 4)
yS8 = L(() => {
    K8();
    Q8();
    Q4();
    sC();
    A68();
    ES8 = K6(Pd(), 1)
})
// @from(Ln 232741, Col 4)
sQ1 = {}
// @from(Ln 232797, Col 0)
function wH6(q, K) {
    if (typeof q == "function") K = q, q = {};
    return this.ondata = K, q
}
// @from(Ln 232802, Col 0)
function rf4(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return vL6(q, K, [GL6], function(z) {
        return K56(P68(z.data[0], z.data[1]))
    }, 0, _)
}
// @from(Ln 232810, Col 0)
function P68(q, K) {
    return OH6(q, K || {}, 0, 0)
}
// @from(Ln 232814, Col 0)
function lQ1(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return vL6(q, K, [fL6], function(z) {
        return K56(VL6(z.data[0], pQ1(z.data[1])))
    }, 1, _)
}
// @from(Ln 232822, Col 0)
function VL6(q, K) {
    return X68(q, {
        i: 2
    }, K && K.out, K && K.dictionary)
}
// @from(Ln 232828, Col 0)
function J9z(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return vL6(q, K, [GL6, Qf4, function() {
        return [CQ1]
    }], function(z) {
        return K56(CQ1(z.data[0], z.data[1]))
    }, 2, _)
}
// @from(Ln 232838, Col 0)
function CQ1(q, K) {
    if (!K) K = {};
    var _ = ZL6(),
        z = q.length;
    _.p(q);
    var Y = OH6(q, K, UQ1(K), 8),
        A = Y.length;
    return FQ1(Y, K), VO(Y, A - 8, _.d()), VO(Y, A - 4, z), Y
}
// @from(Ln 232848, Col 0)
function af4(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return vL6(q, K, [fL6, df4, function() {
        return [uS8]
    }], function(z) {
        return K56(uS8(z.data[0], z.data[1]))
    }, 3, _)
}
// @from(Ln 232858, Col 0)
function uS8(q, K) {
    var _ = gQ1(q);
    if (_ + 8 > q.length) z5(6, "invalid gzip data");
    return X68(q.subarray(_, -8), {
        i: 2
    }, K && K.out || new $_(nf4(q)), K && K.dictionary)
}
// @from(Ln 232866, Col 0)
function M9z(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return vL6(q, K, [GL6, cf4, function() {
        return [IQ1]
    }], function(z) {
        return K56(IQ1(z.data[0], z.data[1]))
    }, 4, _)
}
// @from(Ln 232876, Col 0)
function IQ1(q, K) {
    if (!K) K = {};
    var _ = FS8();
    _.p(q);
    var z = OH6(q, K, K.dictionary ? 6 : 2, 4);
    return QQ1(z, K), VO(z, z.length - 4, _.d()), z
}
// @from(Ln 232884, Col 0)
function tf4(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return vL6(q, K, [fL6, lf4, function() {
        return [BS8]
    }], function(z) {
        return K56(BS8(z.data[0], pQ1(z.data[1])))
    }, 5, _)
}
// @from(Ln 232894, Col 0)
function BS8(q, K) {
    return X68(q.subarray(dQ1(q, K && K.dictionary), -4), {
        i: 2
    }, K && K.out, K && K.dictionary)
}
// @from(Ln 232900, Col 0)
function W9z(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    return q[0] == 31 && q[1] == 139 && q[2] == 8 ? af4(q, K, _) : (q[0] & 15) != 8 || q[0] >> 4 > 7 || (q[0] << 8 | q[1]) % 31 ? lQ1(q, K, _) : tf4(q, K, _)
}
// @from(Ln 232906, Col 0)
function D9z(q, K) {
    return q[0] == 31 && q[1] == 139 && q[2] == 8 ? uS8(q, K) : (q[0] & 15) != 8 || q[0] >> 4 > 7 || (q[0] << 8 | q[1]) % 31 ? VL6(q, K) : BS8(q, K)
}
// @from(Ln 232910, Col 0)
function q56(q, K) {
    if (K) {
        var _ = new $_(q.length);
        for (var z = 0; z < q.length; ++z) _[z] = q.charCodeAt(z);
        return _
    }
    if (hf4) return hf4.encode(q);
    var Y = q.length,
        A = new $_(q.length + (q.length >> 1)),
        O = 0,
        w = function(H) {
            A[O++] = H
        };
    for (var z = 0; z < Y; ++z) {
        if (O + 5 > A.length) {
            var $ = new $_(O + 8 + (Y - z << 1));
            $.set(A), A = $
        }
        var j = q.charCodeAt(z);
        if (j < 128 || K) w(j);
        else if (j < 2048) w(192 | j >> 6), w(128 | j & 63);
        else if (j > 55295 && j < 57344) j = 65536 + (j & 1047552) | q.charCodeAt(++z) & 1023, w(240 | j >> 18), w(128 | j >> 12 & 63), w(128 | j >> 6 & 63), w(128 | j & 63);
        else w(224 | j >> 12), w(128 | j >> 6 & 63), w(128 | j & 63)
    }
    return Yx(A, 0, O)
}
// @from(Ln 232937, Col 0)
function iQ1(q, K) {
    if (K) {
        var _ = "";
        for (var z = 0; z < q.length; z += 16384) _ += String.fromCharCode.apply(null, q.subarray(z, z + 16384));
        return _
    } else if (uQ1) return uQ1.decode(q);
    else {
        var Y = qG4(q),
            A = Y.s,
            _ = Y.r;
        if (_.length) z5(8);
        return A
    }
}
// @from(Ln 232952, Col 0)
function V9z(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    var z = {};
    nQ1(q, "", z, K);
    var Y = Object.keys(z),
        A = Y.length,
        O = 0,
        w = 0,
        $ = A,
        j = Array(A),
        H = [],
        J = function() {
            for (var D = 0; D < H.length; ++D) H[D]()
        },
        X = function(D, Z) {
            pS8(function() {
                _(D, Z)
            })
        };
    pS8(function() {
        X = _
    });
    var M = function() {
        var D = new $_(w + 22),
            Z = O,
            G = w - O;
        w = 0;
        for (var f = 0; f < $; ++f) {
            var v = j[f];
            try {
                var V = v.c.length;
                ML6(D, w, v, v.f, v.u, V);
                var k = 30 + v.f.length + eK6(v.extra),
                    N = w + k;
                D.set(v.c, N), ML6(D, O, v, v.f, v.u, V, w, v.m), O += 16 + k + (v.m ? v.m.length : 0), w = N + V
            } catch (R) {
                return X(R, null)
            }
        }
        rQ1(D, O, j.length, G, Z), X(null, D)
    };
    if (!A) M();
    var P = function(D) {
        var Z = Y[D],
            G = z[Z],
            f = G[0],
            v = G[1],
            V = ZL6(),
            k = f.length;
        V.p(f);
        var N = q56(Z),
            R = N.length,
            h = v.comment,
            C = h && q56(h),
            x = C && C.length,
            B = eK6(v.extra),
            m = v.level == 0 ? 0 : 8,
            S = function(F, U) {
                if (F) J(), X(F, null);
                else {
                    var g = U.length;
                    if (j[D] = M68(v, {
                            size: k,
                            crc: V.d(),
                            c: U,
                            f: N,
                            m: C,
                            u: R != Z.length || C && h.length != x,
                            compression: m
                        }), O += 30 + R + B + g, w += 76 + 2 * (R + B) + (x || 0) + g, !--A) M()
                }
            };
        if (R > 65535) S(z5(11, 0, 1), null);
        if (!m) S(null, f);
        else if (k < 160000) try {
            S(null, P68(f, v))
        } catch (F) {
            S(F, null)
        } else H.push(rf4(f, v, S))
    };
    for (var W = 0; W < $; ++W) P(W);
    return J
}
// @from(Ln 233037, Col 0)
function oQ1(q, K) {
    if (!K) K = {};
    var _ = {},
        z = [];
    nQ1(q, "", _, K);
    var Y = 0,
        A = 0;
    for (var O in _) {
        var w = _[O],
            $ = w[0],
            j = w[1],
            H = j.level == 0 ? 0 : 8,
            J = q56(O),
            X = J.length,
            M = j.comment,
            P = M && q56(M),
            W = P && P.length,
            D = eK6(j.extra);
        if (X > 65535) z5(11);
        var Z = H ? P68($, j) : $,
            G = Z.length,
            f = ZL6();
        f.p($), z.push(M68(j, {
            size: $.length,
            crc: f.d(),
            c: Z,
            f: J,
            m: P,
            u: X != O.length || P && M.length != W,
            o: Y,
            compression: H
        })), Y += 30 + X + D + G, A += 76 + 2 * (X + D) + (W || 0) + G
    }
    var v = new $_(A + 22),
        V = Y,
        k = A - Y;
    for (var N = 0; N < z.length; ++N) {
        var J = z[N];
        ML6(v, J.o, J, J.f, J.u, J.c.length);
        var R = 30 + J.f.length + eK6(J.extra);
        v.set(J.c, J.o + R), ML6(v, Y, J, J.f, J.u, J.c.length, J.o, J.m), Y += 16 + R + (J.m ? J.m.length : 0)
    }
    return rQ1(v, Y, z.length, k, V), v
}
// @from(Ln 233082, Col 0)
function y9z(q, K, _) {
    if (!_) _ = K, K = {};
    if (typeof _ != "function") z5(7);
    var z = [],
        Y = function() {
            for (var D = 0; D < z.length; ++D) z[D]()
        },
        A = {},
        O = function(D, Z) {
            pS8(function() {
                _(D, Z)
            })
        };
    pS8(function() {
        O = _
    });
    var w = q.length - 22;
    for (; DM(q, w) != 101010256; --w)
        if (!w || q.length - w > 65558) return O(z5(13, 0, 1), null), Y;
    var $ = Sk(q, w + 8);
    if ($) {
        var j = $,
            H = DM(q, w + 16),
            J = H == 4294967295 || j == 65535;
        if (J) {
            var X = DM(q, w - 12);
            if (J = DM(q, X) == 101075792, J) j = $ = DM(q, X + 32), H = DM(q, X + 48)
        }
        var M = K && K.filter,
            P = function(D) {
                var Z = zG4(q, H, J),
                    G = Z[0],
                    f = Z[1],
                    v = Z[2],
                    V = Z[3],
                    k = Z[4],
                    N = Z[5],
                    R = _G4(q, N);
                H = k;
                var h = function(x, B) {
                    if (x) Y(), O(x, null);
                    else {
                        if (B) A[V] = B;
                        if (!--$) O(null, A)
                    }
                };
                if (!M || M({
                        name: V,
                        size: f,
                        originalSize: v,
                        compression: G
                    }))
                    if (!G) h(null, Yx(q, R, R + f));
                    else if (G == 8) {
                    var C = q.subarray(R, R + f);
                    if (v < 524288 || f > 0.8 * v) try {
                        h(null, VL6(C, {
                            out: new $_(v)
                        }))
                    } catch (x) {
                        h(x, null)
                    } else z.push(lQ1(C, {
                        size: v
                    }, h))
                } else h(z5(14, "unknown compression type " + G, 1), null);
                else h(null, null)
            };
        for (var W = 0; W < j; ++W) P(W)
    } else O(null, {});
    return Y
}
// @from(Ln 233154, Col 0)
function aQ1(q, K) {
    var _ = {},
        z = q.length - 22;
    for (; DM(q, z) != 101010256; --z)
        if (!z || q.length - z > 65558) z5(13);
    var Y = Sk(q, z + 8);
    if (!Y) return {};
    var A = DM(q, z + 16),
        O = A == 4294967295 || Y == 65535;
    if (O) {
        var w = DM(q, z - 12);
        if (O = DM(q, w) == 101075792, O) Y = DM(q, w + 32), A = DM(q, w + 48)
    }
    var $ = K && K.filter;
    for (var j = 0; j < Y; ++j) {
        var H = zG4(q, A, O),
            J = H[0],
            X = H[1],
            M = H[2],
            P = H[3],
            W = H[4],
            D = H[5],
            Z = _G4(q, D);
        if (A = W, !$ || $({
                name: P,
                size: X,
                originalSize: M,
                compression: J
            }))
            if (!J) _[P] = Yx(q, Z, Z + X);
            else if (J == 8) _[P] = VL6(q.subarray(Z, Z + X), {
            out: new $_(M)
        });
        else z5(14, "unknown compression type " + J)
    }
    return _
}
// @from(Ln 233191, Col 4)
A9z
// @from(Ln 233191, Col 9)
hS8
// @from(Ln 233191, Col 14)
O9z = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global"
// @from(Ln 233192, Col 4)
w9z
// @from(Ln 233192, Col 9)
$_
// @from(Ln 233192, Col 13)
Ck
// @from(Ln 233192, Col 17)
J68
// @from(Ln 233192, Col 22)
PL6
// @from(Ln 233192, Col 27)
WL6
// @from(Ln 233192, Col 32)
$68
// @from(Ln 233192, Col 37)
Rf4 = function(q, K) {
        var _ = new Ck(31);
        for (var z = 0; z < 31; ++z) _[z] = K += 1 << q[z - 1];
        var Y = new J68(_[30]);
        for (var z = 1; z < 30; ++z)
            for (var A = _[z]; A < _[z + 1]; ++A) Y[A] = A - _[z] << 5 | z;
        return {
            b: _,
            r: Y
        }
    }
// @from(Ln 233203, Col 4)
Sf4
// @from(Ln 233203, Col 9)
mQ1
// @from(Ln 233203, Col 14)
bS8
// @from(Ln 233203, Col 19)
Cf4
// @from(Ln 233203, Col 24)
bf4
// @from(Ln 233203, Col 29)
LQ1
// @from(Ln 233203, Col 34)
j68
// @from(Ln 233203, Col 39)
Mc
// @from(Ln 233203, Col 43)
xz
// @from(Ln 233203, Col 47)
zx = function(q, K, _) {
        var z = q.length,
            Y = 0,
            A = new Ck(K);
        for (; Y < z; ++Y)
            if (q[Y]) ++A[q[Y] - 1];
        var O = new Ck(K);
        for (Y = 1; Y < K; ++Y) O[Y] = O[Y - 1] + A[Y - 1] << 1;
        var w;
        if (_) {
            w = new Ck(1 << K);
            var $ = 15 - K;
            for (Y = 0; Y < z; ++Y)
                if (q[Y]) {
                    var j = Y << 4 | q[Y],
                        H = K - q[Y],
                        J = O[q[Y] - 1]++ << H;
                    for (var X = J | (1 << H) - 1; J <= X; ++J) w[j68[J] >> $] = j
                }
        } else {
            w = new Ck(z);
            for (Y = 0; Y < z; ++Y)
                if (q[Y]) w[Y] = j68[O[q[Y] - 1]++] >> 15 - q[Y]
        }
        return w
    }
// @from(Ln 233229, Col 4)
ms
// @from(Ln 233229, Col 24)
XL6
// @from(Ln 233229, Col 33)
If4
// @from(Ln 233229, Col 38)
xf4
// @from(Ln 233229, Col 43)
uf4
// @from(Ln 233229, Col 48)
mf4
// @from(Ln 233229, Col 53)
RS8 = function(q) {
        var K = q[0];
        for (var _ = 1; _ < q.length; ++_)
            if (q[_] > K) K = q[_];
        return K
    }
// @from(Ln 233235, Col 4)
_x = function(q, K, _) {
        var z = K / 8 | 0;
        return (q[z] | q[z + 1] << 8) >> (K & 7) & _
    }
// @from(Ln 233239, Col 4)
SS8 = function(q, K) {
        var _ = K / 8 | 0;
        return (q[_] | q[_ + 1] << 8 | q[_ + 2] << 16) >> (K & 7)
    }
// @from(Ln 233243, Col 4)
DL6 = function(q) {
        return (q + 7) / 8 | 0
    }
// @from(Ln 233246, Col 4)
Yx = function(q, K, _) {
        if (K == null || K < 0) K = 0;
        if (_ == null || _ > q.length) _ = q.length;
        return new $_(q.subarray(K, _))
    }
// @from(Ln 233251, Col 4)
$9z
// @from(Ln 233251, Col 9)
Bf4
// @from(Ln 233251, Col 14)
z5 = function(q, K, _) {
        var z = Error(K || Bf4[q]);
        if (z.code = q, Error.captureStackTrace) Error.captureStackTrace(z, z5);
        if (!_) throw z;
        return z
    }
// @from(Ln 233257, Col 4)
X68 = function(q, K, _, z) {
        var Y = q.length,
            A = z ? z.length : 0;
        if (!Y || K.f && !K.l) return _ || new $_(0);
        var O = !_,
            w = O || K.i != 2,
            $ = K.i;
        if (O) _ = new $_(Y * 3);
        var j = function(_6) {
                var r = _.length;
                if (_6 > r) {
                    var t = new $_(Math.max(r * 2, _6));
                    t.set(_), _ = t
                }
            },
            H = K.f || 0,
            J = K.p || 0,
            X = K.b || 0,
            M = K.l,
            P = K.d,
            W = K.m,
            D = K.n,
            Z = Y * 8;
        do {
            if (!M) {
                H = _x(q, J, 1);
                var G = _x(q, J + 1, 3);
                if (J += 3, !G) {
                    var f = DL6(J) + 4,
                        v = q[f - 4] | q[f - 3] << 8,
                        V = f + v;
                    if (V > Y) {
                        if ($) z5(0);
                        break
                    }
                    if (w) j(X + v);
                    _.set(q.subarray(f, V), X), K.b = X += v, K.p = J = V * 8, K.f = H;
                    continue
                } else if (G == 1) M = xf4, P = mf4, W = 9, D = 5;
                else if (G == 2) {
                    var k = _x(q, J, 31) + 257,
                        N = _x(q, J + 10, 15) + 4,
                        R = k + _x(q, J + 5, 31) + 1;
                    J += 14;
                    var h = new $_(R),
                        C = new $_(19);
                    for (var x = 0; x < N; ++x) C[$68[x]] = _x(q, J + x * 3, 7);
                    J += N * 3;
                    var B = RS8(C),
                        m = (1 << B) - 1,
                        S = zx(C, B, 1);
                    for (var x = 0; x < R;) {
                        var F = S[_x(q, J, m)];
                        J += F & 15;
                        var f = F >> 4;
                        if (f < 16) h[x++] = f;
                        else {
                            var U = 0,
                                g = 0;
                            if (f == 16) g = 3 + _x(q, J, 3), J += 2, U = h[x - 1];
                            else if (f == 17) g = 3 + _x(q, J, 7), J += 3;
                            else if (f == 18) g = 11 + _x(q, J, 127), J += 7;
                            while (g--) h[x++] = U
                        }
                    }
                    var c = h.subarray(0, k),
                        n = h.subarray(k);
                    W = RS8(c), D = RS8(n), M = zx(c, W, 1), P = zx(n, D, 1)
                } else z5(1);
                if (J > Z) {
                    if ($) z5(0);
                    break
                }
            }
            if (w) j(X + 131072);
            var l = (1 << W) - 1,
                z6 = (1 << D) - 1,
                A6 = J;
            for (;; A6 = J) {
                var U = M[SS8(q, J) & l],
                    e = U >> 4;
                if (J += U & 15, J > Z) {
                    if ($) z5(0);
                    break
                }
                if (!U) z5(2);
                if (e < 256) _[X++] = e;
                else if (e == 256) {
                    A6 = J, M = null;
                    break
                } else {
                    var i = e - 254;
                    if (e > 264) {
                        var x = e - 257,
                            O6 = PL6[x];
                        i = _x(q, J, (1 << O6) - 1) + mQ1[x], J += O6
                    }
                    var J6 = P[SS8(q, J) & z6],
                        $6 = J6 >> 4;
                    if (!J6) z5(3);
                    J += J6 & 15;
                    var n = bf4[$6];
                    if ($6 > 3) {
                        var O6 = WL6[$6];
                        n += SS8(q, J) & (1 << O6) - 1, J += O6
                    }
                    if (J > Z) {
                        if ($) z5(0);
                        break
                    }
                    if (w) j(X + 131072);
                    var H6 = X + i;
                    if (X < n) {
                        var q6 = A - n,
                            o = Math.min(n, H6);
                        if (q6 + X < 0) z5(3);
                        for (; X < o; ++X) _[X] = z[q6 + X]
                    }
                    for (; X < H6; ++X) _[X] = _[X - n]
                }
            }
            if (K.l = M, K.p = A6, K.b = X, K.f = H, M) H = 1, K.m = W, K.d = P, K.n = D
        } while (!H);
        return X != _.length && O ? Yx(_, 0, X) : _.subarray(0, X)
    }
// @from(Ln 233382, Col 4)
Pc = function(q, K, _) {
        _ <<= K & 7;
        var z = K / 8 | 0;
        q[z] |= _, q[z + 1] |= _ >> 8
    }
// @from(Ln 233387, Col 4)
HL6 = function(q, K, _) {
        _ <<= K & 7;
        var z = K / 8 | 0;
        q[z] |= _, q[z + 1] |= _ >> 8, q[z + 2] |= _ >> 16
    }
// @from(Ln 233392, Col 4)
CS8 = function(q, K) {
        var _ = [];
        for (var z = 0; z < q.length; ++z)
            if (q[z]) _.push({
                s: z,
                f: q[z]
            });
        var Y = _.length,
            A = _.slice();
        if (!Y) return {
            t: tK6,
            l: 0
        };
        if (Y == 1) {
            var O = new $_(_[0].s + 1);
            return O[_[0].s] = 1, {
                t: O,
                l: 1
            }
        }
        _.sort(function(V, k) {
            return V.f - k.f
        }), _.push({
            s: -1,
            f: 25001
        });
        var w = _[0],
            $ = _[1],
            j = 0,
            H = 1,
            J = 2;
        _[0] = {
            s: -1,
            f: w.f + $.f,
            l: w,
            r: $
        };
        while (H != Y - 1) w = _[_[j].f < _[J].f ? j++ : J++], $ = _[j != H && _[j].f < _[J].f ? j++ : J++], _[H++] = {
            s: -1,
            f: w.f + $.f,
            l: w,
            r: $
        };
        var X = A[0].s;
        for (var z = 1; z < Y; ++z)
            if (A[z].s > X) X = A[z].s;
        var M = new Ck(X + 1),
            P = IS8(_[H - 1], M, 0);
        if (P > K) {
            var z = 0,
                W = 0,
                D = P - K,
                Z = 1 << D;
            A.sort(function(k, N) {
                return M[N.s] - M[k.s] || k.f - N.f
            });
            for (; z < Y; ++z) {
                var G = A[z].s;
                if (M[G] > K) W += Z - (1 << P - M[G]), M[G] = K;
                else break
            }
            W >>= D;
            while (W > 0) {
                var f = A[z].s;
                if (M[f] < K) W -= 1 << K - M[f]++ - 1;
                else ++z
            }
            for (; z >= 0 && W; --z) {
                var v = A[z].s;
                if (M[v] == K) --M[v], ++W
            }
            P = K
        }
        return {
            t: new $_(M),
            l: P
        }
    }
// @from(Ln 233470, Col 4)
IS8 = function(q, K, _) {
        return q.s == -1 ? Math.max(IS8(q.l, K, _ + 1), IS8(q.r, K, _ + 1)) : K[q.s] = _
    }
// @from(Ln 233473, Col 4)
hQ1 = function(q) {
        var K = q.length;
        while (K && !q[--K]);
        var _ = new Ck(++K),
            z = 0,
            Y = q[0],
            A = 1,
            O = function($) {
                _[z++] = $
            };
        for (var w = 1; w <= K; ++w)
            if (q[w] == Y && w != K) ++A;
            else {
                if (!Y && A > 2) {
                    for (; A > 138; A -= 138) O(32754);
                    if (A > 2) O(A > 10 ? A - 11 << 5 | 28690 : A - 3 << 5 | 12305), A = 0
                } else if (A > 3) {
                    O(Y), --A;
                    for (; A > 6; A -= 6) O(8304);
                    if (A > 2) O(A - 3 << 5 | 8208), A = 0
                }
                while (A--) O(Y);
                A = 1, Y = q[w]
            } return {
            c: _.subarray(0, z),
            n: K
        }
    }
// @from(Ln 233501, Col 4)
JL6 = function(q, K) {
        var _ = 0;
        for (var z = 0; z < K.length; ++z) _ += q[z] * K[z];
        return _
    }
// @from(Ln 233506, Col 4)
BQ1 = function(q, K, _) {
        var z = _.length,
            Y = DL6(K + 2);
        q[Y] = z & 255, q[Y + 1] = z >> 8, q[Y + 2] = q[Y] ^ 255, q[Y + 3] = q[Y + 1] ^ 255;
        for (var A = 0; A < z; ++A) q[Y + A + 4] = _[A];
        return (Y + 4 + z) * 8
    }
// @from(Ln 233513, Col 4)
RQ1 = function(q, K, _, z, Y, A, O, w, $, j, H) {
        Pc(K, H++, _), ++Y[256];
        var J = CS8(Y, 15),
            X = J.t,
            M = J.l,
            P = CS8(A, 15),
            W = P.t,
            D = P.l,
            Z = hQ1(X),
            G = Z.c,
            f = Z.n,
            v = hQ1(W),
            V = v.c,
            k = v.n,
            N = new Ck(19);
        for (var R = 0; R < G.length; ++R) ++N[G[R] & 31];
        for (var R = 0; R < V.length; ++R) ++N[V[R] & 31];
        var h = CS8(N, 7),
            C = h.t,
            x = h.l,
            B = 19;
        for (; B > 4 && !C[$68[B - 1]]; --B);
        var m = j + 5 << 3,
            S = JL6(Y, ms) + JL6(A, XL6) + O,
            F = JL6(Y, X) + JL6(A, W) + O + 14 + 3 * B + JL6(N, C) + 2 * N[16] + 3 * N[17] + 7 * N[18];
        if ($ >= 0 && m <= S && m <= F) return BQ1(K, H, q.subarray($, $ + j));
        var U, g, c, n;
        if (Pc(K, H, 1 + (F < S)), H += 2, F < S) {
            U = zx(X, M, 0), g = X, c = zx(W, D, 0), n = W;
            var l = zx(C, x, 0);
            Pc(K, H, f - 257), Pc(K, H + 5, k - 1), Pc(K, H + 10, B - 4), H += 14;
            for (var R = 0; R < B; ++R) Pc(K, H + 3 * R, C[$68[R]]);
            H += 3 * B;
            var z6 = [G, V];
            for (var A6 = 0; A6 < 2; ++A6) {
                var e = z6[A6];
                for (var R = 0; R < e.length; ++R) {
                    var i = e[R] & 31;
                    if (Pc(K, H, l[i]), H += C[i], i > 15) Pc(K, H, e[R] >> 5 & 127), H += e[R] >> 12
                }
            }
        } else U = If4, g = ms, c = uf4, n = XL6;
        for (var R = 0; R < w; ++R) {
            var O6 = z[R];
            if (O6 > 255) {
                var i = O6 >> 18 & 31;
                if (HL6(K, H, U[i + 257]), H += g[i + 257], i > 7) Pc(K, H, O6 >> 23 & 31), H += PL6[i];
                var J6 = O6 & 31;
                if (HL6(K, H, c[J6]), H += n[J6], J6 > 3) HL6(K, H, O6 >> 5 & 8191), H += WL6[J6]
            } else HL6(K, H, U[O6]), H += g[O6]
        }
        return HL6(K, H, U[256]), H + g[256]
    }
// @from(Ln 233566, Col 4)
pf4
// @from(Ln 233566, Col 9)
tK6
// @from(Ln 233566, Col 14)
Ff4 = function(q, K, _, z, Y, A) {
        var O = A.z || q.length,
            w = new $_(z + O + 5 * (1 + Math.ceil(O / 7000)) + Y),
            $ = w.subarray(z, w.length - Y),
            j = A.l,
            H = (A.r || 0) & 7;
        if (K) {
            if (H) $[0] = A.r >> 3;
            var J = pf4[K - 1],
                X = J >> 13,
                M = J & 8191,
                P = (1 << _) - 1,
                W = A.p || new Ck(32768),
                D = A.h || new Ck(P + 1),
                Z = Math.ceil(_ / 3),
                G = 2 * Z,
                f = function(Y6) {
                    return (q[Y6] ^ q[Y6 + 1] << Z ^ q[Y6 + 2] << G) & P
                },
                v = new J68(25000),
                V = new Ck(288),
                k = new Ck(32),
                N = 0,
                R = 0,
                h = A.i || 0,
                C = 0,
                x = A.w || 0,
                B = 0;
            for (; h + 2 < O; ++h) {
                var m = f(h),
                    S = h & 32767,
                    F = D[m];
                if (W[S] = F, D[m] = S, x <= h) {
                    var U = O - h;
                    if ((N > 7000 || C > 24576) && (U > 423 || !j)) {
                        H = RQ1(q, $, 0, v, V, k, R, C, B, h - B, H), C = N = R = 0, B = h;
                        for (var g = 0; g < 286; ++g) V[g] = 0;
                        for (var g = 0; g < 30; ++g) k[g] = 0
                    }
                    var c = 2,
                        n = 0,
                        l = M,
                        z6 = S - F & 32767;
                    if (U > 2 && m == f(h - z6)) {
                        var A6 = Math.min(X, U) - 1,
                            e = Math.min(32767, h),
                            i = Math.min(258, U);
                        while (z6 <= e && --l && S != F) {
                            if (q[h + c] == q[h + c - z6]) {
                                var O6 = 0;
                                for (; O6 < i && q[h + O6] == q[h + O6 - z6]; ++O6);
                                if (O6 > c) {
                                    if (c = O6, n = z6, O6 > A6) break;
                                    var J6 = Math.min(z6, O6 - 2),
                                        $6 = 0;
                                    for (var g = 0; g < J6; ++g) {
                                        var H6 = h - z6 + g & 32767,
                                            q6 = W[H6],
                                            o = H6 - q6 & 32767;
                                        if (o > $6) $6 = o, F = H6
                                    }
                                }
                            }
                            S = F, F = W[S], z6 += S - F & 32767
                        }
                    }
                    if (n) {
                        v[C++] = 268435456 | bS8[c] << 18 | LQ1[n];
                        var _6 = bS8[c] & 31,
                            r = LQ1[n] & 31;
                        R += PL6[_6] + WL6[r], ++V[257 + _6], ++k[r], x = h + c, ++N
                    } else v[C++] = q[h], ++V[q[h]]
                }
            }
            for (h = Math.max(h, x); h < O; ++h) v[C++] = q[h], ++V[q[h]];
            if (H = RQ1(q, $, j, v, V, k, R, C, B, h - B, H), !j) A.r = H & 7 | $[H / 8 | 0] << 3, H -= 7, A.h = D, A.p = W, A.i = h, A.w = x
        } else {
            for (var h = A.w || 0; h < O + j; h += 65535) {
                var t = h + 65535;
                if (t >= O) $[H / 8 | 0] = j, t = O;
                H = BQ1($, H + 1, q.subarray(h, t))
            }
            A.i = O
        }
        return Yx(w, 0, z + DL6(H) + Y)
    }
// @from(Ln 233652, Col 4)
gf4
// @from(Ln 233652, Col 9)
ZL6 = function() {
        var q = -1;
        return {
            p: function(K) {
                var _ = q;
                for (var z = 0; z < K.length; ++z) _ = gf4[_ & 255 ^ K[z]] ^ _ >>> 8;
                q = _
            },
            d: function() {
                return ~q
            }
        }
    }
// @from(Ln 233665, Col 4)
FS8 = function() {
        var q = 1,
            K = 0;
        return {
            p: function(_) {
                var z = q,
                    Y = K,
                    A = _.length | 0;
                for (var O = 0; O != A;) {
                    var w = Math.min(O + 2655, A);
                    for (; O < w; ++O) Y += z += _[O];
                    z = (z & 65535) + 15 * (z >> 16), Y = (Y & 65535) + 15 * (Y >> 16)
                }
                q = z, K = Y
            },
            d: function() {
                return q %= 65521, K %= 65521, (q & 255) << 24 | (q & 65280) << 8 | (K & 255) << 8 | K >> 8
            }
        }
    }
// @from(Ln 233685, Col 4)
OH6 = function(q, K, _, z, Y) {
        if (!Y) {
            if (Y = {
                    l: 1
                }, K.dictionary) {
                var A = K.dictionary.subarray(-32768),
                    O = new $_(A.length + q.length);
                O.set(A), O.set(q, A.length), q = O, Y.w = A.length
            }
        }
        return Ff4(q, K.level == null ? 6 : K.level, K.mem == null ? Y.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(q.length))) * 1.5) : 20 : 12 + K.mem, _, z, Y)
    }
// @from(Ln 233697, Col 4)
M68 = function(q, K) {
        var _ = {};
        for (var z in q) _[z] = q[z];
        for (var z in K) _[z] = K[z];
        return _
    }
// @from(Ln 233703, Col 4)
Lf4 = function(q, K, _) {
        var z = q(),
            Y = q.toString(),
            A = Y.slice(Y.indexOf("[") + 1, Y.lastIndexOf("]")).replace(/\s+/g, "").split(",");
        for (var O = 0; O < z.length; ++O) {
            var w = z[O],
                $ = A[O];
            if (typeof w == "function") {
                K += ";" + $ + "=";
                var j = w.toString();
                if (w.prototype)
                    if (j.indexOf("[native code]") != -1) {
                        var H = j.indexOf(" ", 8) + 1;
                        K += j.slice(H, j.indexOf("(", H))
                    } else {
                        K += j;
                        for (var J in w.prototype) K += ";" + $ + ".prototype." + J + "=" + w.prototype[J].toString()
                    }
                else K += j
            } else _[$] = w
        }
        return K
    }
// @from(Ln 233726, Col 4)
LS8
// @from(Ln 233726, Col 9)
j9z = function(q) {
        var K = [];
        for (var _ in q)
            if (q[_].buffer) K.push((q[_] = new q[_].constructor(q[_])).buffer);
        return K
    }
// @from(Ln 233732, Col 4)
Uf4 = function(q, K, _, z) {
        if (!LS8[_]) {
            var Y = "",
                A = {},
                O = q.length - 1;
            for (var w = 0; w < O; ++w) Y = Lf4(q[w], Y, A);
            LS8[_] = {
                c: Lf4(q[O], Y, A),
                e: A
            }
        }
        var $ = M68({}, LS8[_].e);
        return w9z(LS8[_].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + K.toString() + "}", _, $, j9z($), z)
    }
// @from(Ln 233746, Col 4)
fL6 = function() {
        return [$_, Ck, J68, PL6, WL6, $68, mQ1, bf4, xf4, mf4, j68, Bf4, zx, RS8, _x, SS8, DL6, Yx, z5, X68, VL6, K56, pQ1]
    }
// @from(Ln 233749, Col 4)
GL6 = function() {
        return [$_, Ck, J68, PL6, WL6, $68, bS8, LQ1, If4, ms, uf4, XL6, j68, pf4, tK6, zx, Pc, HL6, CS8, IS8, hQ1, JL6, BQ1, RQ1, DL6, Yx, Ff4, OH6, P68, K56]
    }
// @from(Ln 233752, Col 4)
Qf4 = function() {
        return [FQ1, UQ1, VO, ZL6, gf4]
    }
// @from(Ln 233755, Col 4)
df4 = function() {
        return [gQ1, nf4]
    }
// @from(Ln 233758, Col 4)
cf4 = function() {
        return [QQ1, VO, FS8]
    }
// @from(Ln 233761, Col 4)
lf4 = function() {
        return [dQ1]
    }
// @from(Ln 233764, Col 4)
K56 = function(q) {
        return postMessage(q, [q.buffer])
    }
// @from(Ln 233767, Col 4)
pQ1 = function(q) {
        return q && {
            out: q.size && new $_(q.size),
            dictionary: q.dictionary
        }
    }
// @from(Ln 233773, Col 4)
vL6 = function(q, K, _, z, Y, A) {
        var O = Uf4(_, z, Y, function(w, $) {
            O.terminate(), A(w, $)
        });
        return O.postMessage([q, K], K.consume ? [q.buffer] : []),
            function() {
                O.terminate()
            }
    }
// @from(Ln 233782, Col 4)
Ox = function(q) {
        return q.ondata = function(K, _) {
                return postMessage([K, _], [K.buffer])
            },
            function(K) {
                if (K.data.length) q.push(K.data[0], K.data[1]), postMessage([K.data[0].length]);
                else q.flush()
            }
    }
// @from(Ln 233791, Col 4)
TL6 = function(q, K, _, z, Y, A, O) {
        var w, $ = Uf4(q, z, Y, function(j, H) {
            if (j) $.terminate(), K.ondata.call(K, j);
            else if (!Array.isArray(H)) O(H);
            else if (H.length == 1) {
                if (K.queuedSize -= H[0], K.ondrain) K.ondrain(H[0])
            } else {
                if (H[1]) $.terminate();
                K.ondata.call(K, j, H[0], H[1])
            }
        });
        if ($.postMessage(_), K.queuedSize = 0, K.push = function(j, H) {
                if (!K.ondata) z5(5);
                if (w) K.ondata(z5(4, 0, 1), null, !!H);
                K.queuedSize += j.length, $.postMessage([j, w = H], [j.buffer])
            }, K.terminate = function() {
                $.terminate()
            }, A) K.flush = function() {
            $.postMessage([])
        }
    }
// @from(Ln 233812, Col 4)
Sk = function(q, K) {
        return q[K] | q[K + 1] << 8
    }
// @from(Ln 233815, Col 4)
DM = function(q, K) {
        return (q[K] | q[K + 1] << 8 | q[K + 2] << 16 | q[K + 3] << 24) >>> 0
    }
// @from(Ln 233818, Col 4)
yQ1 = function(q, K) {
        return DM(q, K) + DM(q, K + 4) * 4294967296
    }
// @from(Ln 233821, Col 4)
VO = function(q, K, _) {
        for (; _; ++K) q[K] = _, _ >>>= 8
    }
// @from(Ln 233824, Col 4)
FQ1 = function(q, K) {
        var _ = K.filename;
        if (q[0] = 31, q[1] = 139, q[2] = 8, q[8] = K.level < 2 ? 4 : K.level == 9 ? 2 : 0, q[9] = 3, K.mtime != 0) VO(q, 4, Math.floor(new Date(K.mtime || Date.now()) / 1000));
        if (_) {
            q[3] = 8;
            for (var z = 0; z <= _.length; ++z) q[z + 10] = _.charCodeAt(z)
        }
    }
// @from(Ln 233832, Col 4)
gQ1 = function(q) {
        if (q[0] != 31 || q[1] != 139 || q[2] != 8) z5(6, "invalid gzip data");
        var K = q[3],
            _ = 10;
        if (K & 4) _ += (q[10] | q[11] << 8) + 2;
        for (var z = (K >> 3 & 1) + (K >> 4 & 1); z > 0; z -= !q[_++]);
        return _ + (K & 2)
    }
// @from(Ln 233840, Col 4)
nf4 = function(q) {
        var K = q.length;
        return (q[K - 4] | q[K - 3] << 8 | q[K - 2] << 16 | q[K - 1] << 24) >>> 0
    }
// @from(Ln 233844, Col 4)
UQ1 = function(q) {
        return 10 + (q.filename ? q.filename.length + 1 : 0)
    }
// @from(Ln 233847, Col 4)
QQ1 = function(q, K) {
        var _ = K.level,
            z = _ == 0 ? 0 : _ < 6 ? 1 : _ == 9 ? 3 : 2;
        if (q[0] = 120, q[1] = z << 6 | (K.dictionary && 32), q[1] |= 31 - (q[0] << 8 | q[1]) % 31, K.dictionary) {
            var Y = FS8();
            Y.p(K.dictionary), VO(q, 2, Y.d())
        }
    }
// @from(Ln 233855, Col 4)
dQ1 = function(q, K) {
        if ((q[0] & 15) != 8 || q[0] >> 4 > 7 || (q[0] << 8 | q[1]) % 31) z5(6, "invalid zlib data");
        if ((q[1] >> 5 & 1) == +!K) z5(6, "invalid zlib data: " + (q[1] & 32 ? "need" : "unexpected") + " dictionary");
        return (q[1] >> 3 & 4) + 2
    }
// @from(Ln 233860, Col 4)
Ax
// @from(Ln 233860, Col 8)
if4
// @from(Ln 233860, Col 13)
My
// @from(Ln 233860, Col 17)
cQ1
// @from(Ln 233860, Col 22)
SQ1
// @from(Ln 233860, Col 27)
H9z
// @from(Ln 233860, Col 32)
xS8
// @from(Ln 233860, Col 37)
of4
// @from(Ln 233860, Col 42)
bQ1
// @from(Ln 233860, Col 47)
X9z
// @from(Ln 233860, Col 52)
mS8
// @from(Ln 233860, Col 57)
sf4
// @from(Ln 233860, Col 62)
xQ1
// @from(Ln 233860, Col 67)
P9z
// @from(Ln 233860, Col 72)
nQ1 = function(q, K, _, z) {
        for (var Y in q) {
            var A = q[Y],
                O = K + Y,
                w = z;
            if (Array.isArray(A)) w = M68(z, A[1]), A = A[0];
            if (A instanceof $_) _[O] = [A, w];
            else _[O += "/"] = [new $_(0), w], nQ1(A, O, _, z)
        }
    }
// @from(Ln 233870, Col 4)
hf4
// @from(Ln 233870, Col 9)
uQ1
// @from(Ln 233870, Col 14)
ef4 = 0
// @from(Ln 233871, Col 4)
qG4 = function(q) {
        for (var K = "", _ = 0;;) {
            var z = q[_++],
                Y = (z > 127) + (z > 223) + (z > 239);
            if (_ + Y > q.length) return {
                s: K,
                r: Yx(q, _ - 1)
            };
            if (!Y) K += String.fromCharCode(z);
            else if (Y == 3) z = ((z & 15) << 18 | (q[_++] & 63) << 12 | (q[_++] & 63) << 6 | q[_++] & 63) - 65536, K += String.fromCharCode(55296 | z >> 10, 56320 | z & 1023);
            else if (Y & 1) K += String.fromCharCode((z & 31) << 6 | q[_++] & 63);
            else K += String.fromCharCode((z & 15) << 12 | (q[_++] & 63) << 6 | q[_++] & 63)
        }
    }
// @from(Ln 233885, Col 4)
Z9z
// @from(Ln 233885, Col 9)
f9z
// @from(Ln 233885, Col 14)
KG4 = function(q) {
        return q == 1 ? 3 : q < 6 ? 2 : q == 9 ? 1 : 0
    }
// @from(Ln 233888, Col 4)
_G4 = function(q, K) {
        return K + 30 + Sk(q, K + 26) + Sk(q, K + 28)
    }
// @from(Ln 233891, Col 4)
zG4 = function(q, K, _) {
        var z = Sk(q, K + 28),
            Y = iQ1(q.subarray(K + 46, K + 46 + z), !(Sk(q, K + 8) & 2048)),
            A = K + 46 + z,
            O = DM(q, K + 20),
            w = _ && O == 4294967295 ? YG4(q, A) : [O, DM(q, K + 24), DM(q, K + 42)],
            $ = w[0],
            j = w[1],
            H = w[2];
        return [Sk(q, K + 10), $, j, Y, A + Sk(q, K + 30) + Sk(q, K + 32), H]
    }
// @from(Ln 233902, Col 4)
YG4 = function(q, K) {
        for (; Sk(q, K) != 1; K += 4 + Sk(q, K + 2));
        return [yQ1(q, K + 12), yQ1(q, K + 4), yQ1(q, K + 20)]
    }
// @from(Ln 233906, Col 4)
eK6 = function(q) {
        var K = 0;
        if (q)
            for (var _ in q) {
                var z = q[_].length;
                if (z > 65535) z5(9);
                K += z + 4
            }
        return K
    }
// @from(Ln 233916, Col 4)
ML6 = function(q, K, _, z, Y, A, O, w) {
        var $ = z.length,
            j = _.extra,
            H = w && w.length,
            J = eK6(j);
        if (VO(q, K, O != null ? 33639248 : 67324752), K += 4, O != null) q[K++] = 20, q[K++] = _.os;
        q[K] = 20, K += 2, q[K++] = _.flag << 1 | (A < 0 && 8), q[K++] = Y && 8, q[K++] = _.compression & 255, q[K++] = _.compression >> 8;
        var X = new Date(_.mtime == null ? Date.now() : _.mtime),
            M = X.getFullYear() - 1980;
        if (M < 0 || M > 119) z5(10);
        if (VO(q, K, M << 25 | X.getMonth() + 1 << 21 | X.getDate() << 16 | X.getHours() << 11 | X.getMinutes() << 5 | X.getSeconds() >> 1), K += 4, A != -1) VO(q, K, _.crc), VO(q, K + 4, A < 0 ? -A - 2 : A), VO(q, K + 8, _.size);
        if (VO(q, K + 12, $), VO(q, K + 14, J), K += 16, O != null) VO(q, K, H), VO(q, K + 6, _.attrs), VO(q, K + 10, O), K += 14;
        if (q.set(z, K), K += $, J)
            for (var P in j) {
                var W = j[P],
                    D = W.length;
                VO(q, K, +P), VO(q, K + 2, D), q.set(W, K + 4), K += 4 + D
            }
        if (H) q.set(w, K), K += H;
        return K
    }
// @from(Ln 233937, Col 4)
rQ1 = function(q, K, _, z, Y) {
        VO(q, K, 101010256), VO(q, K + 8, _), VO(q, K + 10, _), VO(q, K + 12, z), VO(q, K + 16, Y)
    }
// @from(Ln 233940, Col 4)
H68
// @from(Ln 233940, Col 9)
G9z
// @from(Ln 233940, Col 14)
v9z
// @from(Ln 233940, Col 19)
T9z
// @from(Ln 233940, Col 24)
AG4
// @from(Ln 233940, Col 29)
k9z
// @from(Ln 233940, Col 34)
N9z
// @from(Ln 233940, Col 39)
E9z
// @from(Ln 233940, Col 44)
pS8