
// @from(Ln 218360, Col 0)
function oD9(A, q) {
    if (A.source === q.source) switch (A.source) {
        case "github": {
            let K = q;
            if (A.repo !== K.repo) return !1;
            return Ja(K.ref, A.ref) && Ja(K.path, A.path)
        }
        case "git": {
            let K = q;
            if (A.url !== K.url) return !1;
            return Ja(K.ref, A.ref) && Ja(K.path, A.path)
        }
        case "url":
            return A.url === q.url;
        case "npm":
            return A.package === q.package;
        case "file":
            return A.path === q.path;
        case "directory":
            return A.path === q.path;
        default:
            return !1
    }
    if (A.source === "git" && q.source === "github") {
        if (qb7(A.url) === q.repo) return Ja(q.ref, A.ref) && Ja(q.path, A.path)
    }
    if (A.source === "github" && q.source === "git") {
        if (qb7(q.url) === A.repo) return Ja(q.ref, A.ref) && Ja(q.path, A.path)
    }
    return !1
}
// @from(Ln 218392, Col 0)
function nb1(A) {
    let q = iD9();
    if (q === null) return !1;
    return q.some((K) => oD9(A, K))
}
// @from(Ln 218398, Col 0)
function Fq1(A) {
    if (nb1(A)) return !1;
    let q = mq1();
    if (q === null) return !0;
    return q.some((K) => {
        if (K.source === "hostPattern") return rD9(A, K);
        return nD9(A, K)
    })
}
// @from(Ln 218408, Col 0)
function o01(A) {
    switch (A.source) {
        case "github":
            return `github:${A.repo}${A.ref?`@${A.ref}`:""}`;
        case "url":
            return A.url;
        case "git":
            return `git:${A.url}${A.ref?`@${A.ref}`:""}`;
        case "npm":
            return `npm:${A.package}`;
        case "file":
            return `file:${A.path}`;
        case "directory":
            return `dir:${A.path}`;
        case "hostPattern":
            return `hostPattern:${A.hostPattern}`;
        default:
            return "unknown source"
    }
}
// @from(Ln 218428, Col 0)
async function Yb7({
    configuredMarketplaceCount: A,
    failedMarketplaceCount: q
}) {
    if (!await h$6()) return "git-not-installed";
    let Y = mq1();
    if (Y !== null) {
        if (Y.length === 0) return "all-blocked-by-policy";
        if (A === 0) return "policy-restricts-sources"
    }
    if (A === 0) return "no-marketplaces-configured";
    if (q > 0 && q === A) return "all-marketplaces-failed";
    return "all-plugins-installed"
}
// @from(Ln 218442, Col 4)
Xa = v(() => {
    p$();
    y6();
    p8();
    TXA()
})
// @from(Ln 218449, Col 0)
function Da(A) {
    if (A.includes("@")) {
        let q = A.split("@");
        return {
            name: q[0] || "",
            marketplace: q[1]
        }
    }
    return {
        name: A
    }
}
// @from(Ln 218462, Col 0)
function kB(A) {
    if (A === "managed") throw Error("Cannot install plugins to managed scope");
    return aD9[A]
}
// @from(Ln 218467, Col 0)
function zb7(A) {
    return EXA[A]
}
// @from(Ln 218470, Col 4)
EXA
// @from(Ln 218470, Col 9)
aD9
// @from(Ln 218471, Col 4)
Qq1 = v(() => {
    EXA = {
        policySettings: "managed",
        userSettings: "user",
        projectSettings: "project",
        localSettings: "local",
        flagSettings: "flag"
    };
    aD9 = {
        user: "userSettings",
        project: "projectSettings",
        local: "localSettings"
    }
})
// @from(Ln 218490, Col 0)
function rb1() {
    return gq1(Lv(), "installed_plugins.json")
}
// @from(Ln 218494, Col 0)
function sD9() {
    return gq1(Lv(), "installed_plugins_v2.json")
}
// @from(Ln 218498, Col 0)
function tD9() {
    if (kXA) return;
    let A = b1(),
        q = rb1(),
        K = sD9();
    try {
        let Y = A.existsSync(K),
            z = A.existsSync(q);
        if (Y) {
            A.renameSync(K, q), h("Renamed installed_plugins_v2.json to installed_plugins.json");
            let w = uM();
            wb7(w)
        } else if (z) {
            let w = A.readFileSync(q, {
                    encoding: "utf-8"
                }),
                H = _A(w);
            if ((typeof H?.version === "number" ? H.version : 1) === 1) {
                let O = Sv1.parse(H),
                    _ = yXA(O);
                c8(q, Q1(_, null, 2), {
                    encoding: "utf-8",
                    flush: !0
                }), h(`Converted installed_plugins.json from V1 to V2 format (${Object.keys(O.plugins).length} plugins)`), wb7(_)
            }
        }
        kXA = !0
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        h(`Failed to migrate plugin files: ${z}`, {
            level: "error"
        }), K1(Y instanceof Error ? Y : Error(`Failed to migrate plugin files: ${z}`)), kXA = !0
    }
}
// @from(Ln 218533, Col 0)
function wb7(A) {
    let q = b1(),
        K = Uq1();
    if (!q.existsSync(K)) return;
    try {
        let Y = new Set;
        for (let w of Object.values(A.plugins))
            for (let H of w) Y.add(H.installPath);
        let z = q.readdirSync(K);
        for (let w of z) {
            if (!w.isDirectory()) continue;
            let H = w.name,
                $ = gq1(K, H);
            if (q.readdirSync($).some((J) => {
                    if (!J.isDirectory()) return !1;
                    let X = gq1($, J.name);
                    return q.readdirSync(X).some((j) => j.isDirectory())
                })) continue;
            if (!Y.has($)) q.rmSync($, {
                recursive: !0,
                force: !0
            }), h(`Cleaned up legacy cache directory: ${H}`)
        }
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        h(`Failed to clean up legacy cache: ${z}`, {
            level: "warn"
        })
    }
}
// @from(Ln 218564, Col 0)
function RXA() {
    let A = b1(),
        q = rb1();
    if (!A.existsSync(q)) return null;
    let K = A.readFileSync(q, {
            encoding: "utf-8"
        }),
        Y = _A(K);
    return {
        version: typeof Y?.version === "number" ? Y.version : 1,
        data: Y
    }
}
// @from(Ln 218578, Col 0)
function yXA(A) {
    let q = {};
    for (let [K, Y] of Object.entries(A.plugins)) {
        let z = RB(K, Y.version);
        q[K] = [{
            scope: "user",
            installPath: z,
            version: Y.version,
            installedAt: Y.installedAt,
            lastUpdated: Y.lastUpdated,
            gitCommitSha: Y.gitCommitSha
        }]
    }
    return {
        version: 2,
        plugins: q
    }
}
// @from(Ln 218597, Col 0)
function uM() {
    if (LB !== null) return LB;
    let A = rb1();
    try {
        let q = RXA();
        if (q) {
            if (q.version === 2) {
                let z = hv1.parse(q.data);
                return LB = z, h(`Loaded ${Object.keys(z.plugins).length} installed plugins from ${A}`), z
            }
            let K = Sv1.parse(q.data),
                Y = yXA(K);
            return LB = Y, h(`Loaded and converted ${Object.keys(K.plugins).length} plugins from V1 format`), Y
        }
        return h("installed_plugins.json doesn't exist, returning empty V2 object"), LB = {
            version: 2,
            plugins: {}
        }, LB
    } catch (q) {
        let K = q instanceof Error ? q.message : String(q);
        return h(`Failed to load installed_plugins.json: ${K}. Starting with empty state.`, {
            level: "error"
        }), K1(q instanceof Error ? q : Error(`Failed to load installed_plugins.json: ${K}`)), LB = {
            version: 2,
            plugins: {}
        }, LB
    }
}
// @from(Ln 218626, Col 0)
function x$6(A) {
    let q = b1(),
        K = rb1();
    try {
        let Y = Lv();
        if (!q.existsSync(Y)) q.mkdirSync(Y);
        let z = Q1(A, null, 2);
        c8(K, z, {
            encoding: "utf-8",
            flush: !0
        }), LB = A, h(`Saved ${Object.keys(A.plugins).length} installed plugins to ${K}`)
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        throw K1(Y instanceof Error ? Y : Error(`Failed to save installed_plugins.json: ${z}`)), Y
    }
}
// @from(Ln 218643, Col 0)
function $b7(A, q, K) {
    let Y = uM(),
        z = Y.plugins[A];
    if (!z) return;
    if (Y.plugins[A] = z.filter((w) => !(w.scope === q && w.projectPath === K)), Y.plugins[A].length === 0) delete Y.plugins[A];
    x$6(Y), h(`Removed installation for ${A} at scope ${q}`)
}
// @from(Ln 218651, Col 0)
function CXA() {
    if (LXA === null) LXA = uM();
    return LXA
}
// @from(Ln 218656, Col 0)
function ja() {
    try {
        let A = RXA();
        if (A) {
            if (A.version === 2) return hv1.parse(A.data);
            let q = Sv1.parse(A.data);
            return yXA(q)
        }
        return {
            version: 2,
            plugins: {}
        }
    } catch (A) {
        let q = A instanceof Error ? A.message : String(A);
        return h(`Failed to load installed plugins from disk: ${q}`, {
            level: "error"
        }), {
            version: 2,
            plugins: {}
        }
    }
}
// @from(Ln 218679, Col 0)
function Ob7(A, q, K, Y, z) {
    let w = ja(),
        H = w.plugins[A];
    if (!H) {
        h(`Cannot update ${A} on disk: plugin not found in installed plugins`);
        return
    }
    let $ = H.find((O) => O.scope === q && O.projectPath === K);
    if ($) {
        $.installPath = Y, $.version = z, $.lastUpdated = new Date().toISOString();
        let O = rb1();
        c8(O, Q1(w, null, 2), {
            encoding: "utf-8",
            flush: !0
        }), LB = null, h(`Updated ${A} on disk to version ${z} at ${Y}`)
    } else h(`Cannot update ${A} on disk: no installation for scope ${q}`)
}
// @from(Ln 218696, Col 0)
async function SXA() {
    tD9();
    try {
        await IXA()
    } catch (q) {
        K1(q instanceof Error ? q : Error(String(q)))
    }
    let A = CXA();
    h(`Initialized versioned plugins system with ${Object.keys(A.plugins).length} plugins`)
}
// @from(Ln 218707, Col 0)
function eD9(A) {
    let K = uM().plugins[A];
    if (!K || K.length === 0) return;
    let Y = K[0];
    if (!Y) return;
    return {
        version: Y.version || "unknown",
        installedAt: Y.installedAt || new Date().toISOString(),
        lastUpdated: Y.lastUpdated,
        installPath: Y.installPath,
        gitCommitSha: Y.gitCommitSha
    }
}
// @from(Ln 218721, Col 0)
function _b7(A) {
    if (!A) return [];
    let q = uM(),
        K = `@${A}`,
        Y = new Set,
        z = !1;
    for (let w of Object.keys(q.plugins)) {
        if (!w.endsWith(K)) continue;
        for (let H of q.plugins[w] ?? [])
            if (H.installPath) Y.add(H.installPath);
        delete q.plugins[w], z = !0, h(`Removed installed plugin for marketplace removal: ${w}`)
    }
    if (z) x$6(q);
    return Array.from(Y)
}
// @from(Ln 218737, Col 0)
function BM(A) {
    return eD9(A) !== void 0
}
// @from(Ln 218741, Col 0)
function hXA(A, q, K = "user", Y) {
    let z = uM(),
        w = {
            scope: K,
            installPath: q.installPath,
            version: q.version,
            installedAt: q.installedAt,
            lastUpdated: q.lastUpdated,
            gitCommitSha: q.gitCommitSha,
            ...Y && {
                projectPath: Y
            }
        },
        H = z.plugins[A] || [],
        $ = H.findIndex((_) => _.scope === K && _.projectPath === Y),
        O = $ >= 0;
    if (O) H[$] = w;
    else H.push(w);
    z.plugins[A] = H, x$6(z), h(`${O?"Updated":"Added"} installed plugin: ${A} (scope: ${K})`)
}
// @from(Ln 218761, Col 0)
async function I$6(A) {
    return await bv1(A) ?? void 0
}
// @from(Ln 218765, Col 0)
function Hb7(A, q) {
    let K = b1(),
        Y = gq1(A, ".claude-plugin", "plugin.json");
    if (!K.existsSync(Y)) return "unknown";
    try {
        let z = K.readFileSync(Y, {
            encoding: "utf-8"
        });
        return _A(z).version || "unknown"
    } catch {
        return h(`Could not read version from manifest for ${q}`), "unknown"
    }
}
// @from(Ln 218778, Col 0)
async function IXA() {
    let q = C8().enabledPlugins || {};
    if (Object.keys(q).length === 0) return;
    let K = RXA(),
        Y = K !== null;
    if (Y && K?.version === 2 && K) {
        let j = hv1.safeParse(K.data);
        if (j?.success) {
            let M = j.data.plugins;
            if (Object.keys(q).filter((W) => W.includes("@")).every((W) => {
                    let G = M[W];
                    return G && G.length > 0
                })) {
                h("All plugins already exist, skipping migration");
                return
            }
        }
    }
    h(Y ? "Syncing installed_plugins.json with enabledPlugins from all settings.json files" : "Creating installed_plugins.json from settings.json files");
    let w = b1(),
        H = new Date().toISOString(),
        $ = h6(),
        O = new Map,
        _ = ["userSettings", "projectSettings", "localSettings"];
    for (let j of _) {
        let P = y7(j)?.enabledPlugins || {};
        for (let W of Object.keys(P)) {
            if (!W.includes("@")) continue;
            let G = zb7(j);
            O.set(W, {
                scope: G,
                projectPath: G === "user" ? void 0 : $
            })
        }
    }
    let J = {};
    if (Y) J = {
        ...uM().plugins
    };
    let X = 0,
        D = 0;
    for (let [j, M] of O) {
        let P = J[j];
        if (P && P.length > 0) {
            let W = P[0];
            if (W && (W.scope !== M.scope || W.projectPath !== M.projectPath)) {
                if (W.scope = M.scope, M.projectPath) W.projectPath = M.projectPath;
                else delete W.projectPath;
                W.lastUpdated = H, X++, h(`Updated ${j} scope to ${M.scope} (settings.json is source of truth)`)
            }
        } else {
            let W = j.split("@"),
                G = W[0];
            if (!G || W.length !== 2) continue;
            try {
                h(`Looking up plugin ${j} in marketplace ${W[1]}`);
                let f = await a0(j);
                if (!f) {
                    h(`Plugin ${j} not found in any marketplace, skipping`);
                    continue
                }
                let {
                    entry: Z,
                    marketplaceInstallLocation: N
                } = f, T, k = "unknown", y = void 0;
                if (typeof Z.source === "string") T = gq1(N, Z.source), k = Hb7(T, j), y = await I$6(T);
                else {
                    let B = Uq1(),
                        S = G.replace(/[^a-zA-Z0-9-_]/g, "-"),
                        m = gq1(B, S);
                    if (!w.existsSync(m)) {
                        h(`External plugin ${j} not in cache, skipping`);
                        continue
                    }
                    T = m, k = Hb7(m, j), y = await I$6(m)
                }
                if (k === "unknown" && Z.version) k = Z.version;
                if (k === "unknown" && y) k = y.substring(0, 12);
                J[j] = [{
                    scope: M.scope,
                    installPath: RB(j, k),
                    version: k,
                    installedAt: H,
                    lastUpdated: H,
                    gitCommitSha: y,
                    ...M.projectPath && {
                        projectPath: M.projectPath
                    }
                }], D++, h(`Added ${j} with scope ${M.scope}`)
            } catch (f) {
                h(`Failed to add plugin ${j}: ${f}`)
            }
        }
    }
    if (!Y || X > 0 || D > 0) x$6({
        version: 2,
        plugins: J
    }), h(`Sync completed: ${D} added, ${X} updated in installed_plugins.json`)
}
// @from(Ln 218877, Col 4)
kXA = !1
// @from(Ln 218878, Col 4)
LB = null
// @from(Ln 218879, Col 4)
LXA = null
// @from(Ln 218880, Col 4)
mM = v(() => {
    _8();
    m6();
    Z6();
    y6();
    lb1();
    N0();
    m6();
    p8();
    Qq1();
    N7();
    VJ();
    YH1();
    p$()
})
// @from(Ln 218896, Col 0)
function TZ(A) {
    switch (A.type) {
        case "generic-error":
            return A.error;
        case "path-not-found":
            return `Path not found: ${A.path} (${A.component})`;
        case "git-auth-failed":
            return `Git authentication failed (${A.authType}): ${A.gitUrl}`;
        case "git-timeout":
            return `Git ${A.operation} timeout: ${A.gitUrl}`;
        case "network-error":
            return `Network error: ${A.url}${A.details?` - ${A.details}`:""}`;
        case "manifest-parse-error":
            return `Manifest parse error: ${A.parseError}`;
        case "manifest-validation-error":
            return `Manifest validation failed: ${A.validationErrors.join(", ")}`;
        case "plugin-not-found":
            return `Plugin ${A.pluginId} not found in marketplace ${A.marketplace}`;
        case "marketplace-not-found":
            return `Marketplace ${A.marketplace} not found`;
        case "marketplace-load-failed":
            return `Marketplace ${A.marketplace} failed to load: ${A.reason}`;
        case "repository-scan-failed":
            return `Repository scan failed: ${A.reason}`;
        case "mcp-config-invalid":
            return `MCP server ${A.serverName} invalid: ${A.validationError}`;
        case "hook-load-failed":
            return `Hook load failed: ${A.reason}`;
        case "component-load-failed":
            return `${A.component} load failed from ${A.path}: ${A.reason}`;
        case "mcpb-download-failed":
            return `Failed to download MCPB from ${A.url}: ${A.reason}`;
        case "mcpb-extract-failed":
            return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
        case "mcpb-invalid-manifest":
            return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
        case "lsp-config-invalid":
            return `Plugin "${A.plugin}" has invalid LSP server config for "${A.serverName}": ${A.validationError}`;
        case "lsp-server-start-failed":
            return `Plugin "${A.plugin}" failed to start LSP server "${A.serverName}": ${A.reason}`;
        case "lsp-server-crashed":
            if (A.signal) return `Plugin "${A.plugin}" LSP server "${A.serverName}" crashed with signal ${A.signal}`;
            return `Plugin "${A.plugin}" LSP server "${A.serverName}" crashed with exit code ${A.exitCode??"unknown"}`;
        case "lsp-request-timeout":
            return `Plugin "${A.plugin}" LSP server "${A.serverName}" timed out on ${A.method} request after ${A.timeoutMs}ms`;
        case "lsp-request-failed":
            return `Plugin "${A.plugin}" LSP server "${A.serverName}" ${A.method} request failed: ${A.error}`;
        case "marketplace-blocked-by-policy":
            if (A.blockedByBlocklist) return `Marketplace '${A.marketplace}' is blocked by enterprise policy`;
            return `Marketplace '${A.marketplace}' is not in the allowed marketplace list`
    }
}
// @from(Ln 218951, Col 0)
async function Ma(A, q, K) {
    let Y = A;
    return await Promise.all([...A.matchAll(q09), ...A.matchAll(K09)].map(async (z) => {
        let w = z[1]?.trim();
        if (w) try {
            let H = await uX(qq, {
                command: w
            }, q, qR({
                content: []
            }), "");
            if (H.behavior !== "allow") throw h(`Bash command permission check failed for command in ${K}: ${w}. Error: ${H.message}`), new cx(`Bash command permission check failed for pattern "${z[0]}": ${H.message||"Permission denied"}`);
            let {
                data: $
            } = await qq.call({
                command: w
            }, q), O = await S$6(qq, $, A09()), _ = typeof O.content === "string" ? O.content : Jb7($.stdout, $.stderr);
            Y = Y.replace(z[0], _)
        } catch (H) {
            if (H instanceof cx) throw H;
            Y09(H, z[0])
        }
    })), Y
}
// @from(Ln 218975, Col 0)
function Jb7(A, q, K = !1) {
    let Y = [];
    if (A.trim()) Y.push(A.trim());
    if (q.trim())
        if (K) Y.push(`[stderr: ${q.trim()}]`);
        else Y.push(`[stderr]
${q.trim()}`);
    return Y.join(K ? " " : `
`)
}
// @from(Ln 218986, Col 0)
function Y09(A, q, K = !1) {
    if (A instanceof DC) {
        if (A.interrupted) throw new cx(`Bash command interrupted for pattern "${q}": [Command interrupted]`);
        let w = Jb7(A.stdout, A.stderr, K);
        throw new cx(`Bash command failed for pattern "${q}": ${w}`)
    }
    let Y = A instanceof Error ? A.message : String(A),
        z = K ? `[Error: ${Y}]` : `[Error]
${Y}`;
    throw new cx(z)
}
// @from(Ln 218997, Col 4)
q09
// @from(Ln 218997, Col 9)
K09
// @from(Ln 218998, Col 4)
a01 = v(() => {
    i0();
    qH();
    Z6();
    PJ();
    N8();
    Pp();
    q09 = /```!\s*\n?([\s\S]*?)\n?```/g, K09 = /(?<!\w|\$)!`([^`]+)`/g
})
// @from(Ln 219007, Col 4)
Xb7
// @from(Ln 219007, Col 9)
z09
// @from(Ln 219007, Col 14)
w09
// @from(Ln 219007, Col 19)
H09
// @from(Ln 219007, Col 24)
$09
// @from(Ln 219007, Col 29)
O09
// @from(Ln 219007, Col 34)
_09
// @from(Ln 219007, Col 39)
J09
// @from(Ln 219007, Col 44)
X09
// @from(Ln 219007, Col 49)
D09
// @from(Ln 219007, Col 54)
D$w
// @from(Ln 219007, Col 59)
b$6
// @from(Ln 219007, Col 64)
j$w
// @from(Ln 219008, Col 4)
ob1 = v(() => {
    R_1();
    Xb7 = qv({
        command: g8(),
        args: N_(g8()).optional(),
        env: zS(g8(), g8()).optional()
    }), z09 = qv({
        name: g8(),
        email: g8().email().optional(),
        url: g8().url().optional()
    }), w09 = qv({
        type: g8(),
        url: g8().url()
    }), H09 = Xb7.partial(), $09 = Xb7.extend({
        platform_overrides: zS(g8(), H09).optional()
    }), O09 = qv({
        type: wS(["python", "node", "binary"]),
        entry_point: g8(),
        mcp_config: $09
    }), _09 = qv({
        claude_desktop: g8().optional(),
        platforms: N_(wS(["darwin", "win32", "linux"])).optional(),
        runtimes: qv({
            python: g8().optional(),
            node: g8().optional()
        }).optional()
    }).passthrough(), J09 = qv({
        name: g8(),
        description: g8().optional()
    }), X09 = qv({
        name: g8(),
        description: g8().optional(),
        arguments: N_(g8()).optional(),
        text: g8()
    }), D09 = qv({
        type: wS(["string", "number", "boolean", "directory", "file"]),
        title: g8(),
        description: g8(),
        required: u0().optional(),
        default: a81([g8(), _L(), u0(), N_(g8())]).optional(),
        multiple: u0().optional(),
        sensitive: u0().optional(),
        min: _L().optional(),
        max: _L().optional()
    }), D$w = zS(g8(), a81([g8(), _L(), u0(), N_(g8())])), b$6 = qv({
        $schema: g8().optional(),
        dxt_version: g8().optional().describe("@deprecated Use manifest_version instead"),
        manifest_version: g8().optional(),
        name: g8(),
        display_name: g8().optional(),
        version: g8(),
        description: g8(),
        long_description: g8().optional(),
        author: z09,
        repository: w09.optional(),
        homepage: g8().url().optional(),
        documentation: g8().url().optional(),
        support: g8().url().optional(),
        icon: g8().optional(),
        screenshots: N_(g8()).optional(),
        server: O09,
        tools: N_(J09).optional(),
        tools_generated: u0().optional(),
        prompts: N_(X09).optional(),
        prompts_generated: u0().optional(),
        keywords: N_(g8()).optional(),
        license: g8().optional(),
        privacy_policies: N_(g8()).optional(),
        compatibility: _09.optional(),
        user_config: zS(g8(), D09).optional()
    }).refine((A) => !!(A.dxt_version || A.manifest_version), {
        message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
    }), j$w = qv({
        status: wS(["signed", "unsigned", "self-signed"]),
        publisher: g8().optional(),
        issuer: g8().optional(),
        valid_from: g8().optional(),
        valid_to: g8().optional(),
        fingerprint: g8().optional()
    })
})
// @from(Ln 219089, Col 4)
xXA = v(() => {
    ob1()
})
// @from(Ln 219096, Col 0)
function R09(A, q) {
    return k09(A, {
        i: 2
    }, q && q.out, q && q.dictionary)
}
// @from(Ln 219102, Col 0)
function S09(A, q) {
    if (q) {
        var K = "";
        for (var Y = 0; Y < A.length; Y += 16384) K += String.fromCharCode.apply(null, A.subarray(Y, Y + 16384));
        return K
    } else if (FXA) return FXA.decode(A);
    else {
        var z = C09(A),
            w = z.s,
            K = z.r;
        if (K.length) KR(8);
        return w
    }
}
// @from(Ln 219117, Col 0)
function fb7(A, q) {
    var K = {},
        Y = A.length - 22;
    for (; Dh(A, Y) != 101010256; --Y)
        if (!Y || A.length - Y > 65558) KR(13);
    var z = CB(A, Y + 8);
    if (!z) return {};
    var w = Dh(A, Y + 16),
        H = w == 4294967295 || z == 65535;
    if (H) {
        var $ = Dh(A, Y - 12);
        if (H = Dh(A, $) == 101075792, H) z = Dh(A, $ + 32), w = Dh(A, $ + 48)
    }
    var O = q && q.filter;
    for (var _ = 0; _ < z; ++_) {
        var J = I09(A, w, H),
            X = J[0],
            D = J[1],
            j = J[2],
            M = J[3],
            P = J[4],
            W = J[5],
            G = h09(A, W);
        if (w = P, !O || O({
                name: M,
                size: D,
                originalSize: j,
                compression: X
            }))
            if (!X) K[M] = QXA(A, G, G + D);
            else if (X == 8) K[M] = R09(A.subarray(G, G + D), {
            out: new Rv(j)
        });
        else KR(14, "unknown compression type " + X)
    }
    return K
}
// @from(Ln 219154, Col 4)
P09
// @from(Ln 219154, Col 9)
W09
// @from(Ln 219154, Col 14)
Rv
// @from(Ln 219154, Col 18)
s01
// @from(Ln 219154, Col 23)
G09
// @from(Ln 219154, Col 28)
Db7
// @from(Ln 219154, Col 33)
jb7
// @from(Ln 219154, Col 38)
Z09
// @from(Ln 219154, Col 43)
Mb7 = function(A, q) {
        var K = new s01(31);
        for (var Y = 0; Y < 31; ++Y) K[Y] = q += 1 << A[Y - 1];
        var z = new G09(K[30]);
        for (var Y = 1; Y < 30; ++Y)
            for (var w = K[Y]; w < K[Y + 1]; ++w) z[w] = w - K[Y] << 5 | Y;
        return {
            b: K,
            r: z
        }
    }
// @from(Ln 219165, Col 4)
Pb7
// @from(Ln 219165, Col 9)
Wb7
// @from(Ln 219165, Col 14)
f09
// @from(Ln 219165, Col 19)
Gb7
// @from(Ln 219165, Col 24)
V09
// @from(Ln 219165, Col 29)
Z$w
// @from(Ln 219165, Col 34)
mXA
// @from(Ln 219165, Col 39)
yB
// @from(Ln 219165, Col 43)
B9
// @from(Ln 219165, Col 47)
ab1 = function(A, q, K) {
        var Y = A.length,
            z = 0,
            w = new s01(q);
        for (; z < Y; ++z)
            if (A[z]) ++w[A[z] - 1];
        var H = new s01(q);
        for (z = 1; z < q; ++z) H[z] = H[z - 1] + w[z - 1] << 1;
        var $;
        if (K) {
            $ = new s01(1 << q);
            var O = 15 - q;
            for (z = 0; z < Y; ++z)
                if (A[z]) {
                    var _ = z << 4 | A[z],
                        J = q - A[z],
                        X = H[A[z] - 1]++ << J;
                    for (var D = X | (1 << J) - 1; X <= D; ++X) $[mXA[X] >> O] = _
                }
        } else {
            $ = new s01(Y);
            for (z = 0; z < Y; ++z)
                if (A[z]) $[z] = mXA[H[A[z] - 1]++] >> 15 - A[z]
        }
        return $
    }
// @from(Ln 219191, Col 4)
sb1
// @from(Ln 219191, Col 25)
Zb7
// @from(Ln 219191, Col 34)
N09
// @from(Ln 219191, Col 39)
T09
// @from(Ln 219191, Col 44)
bXA = function(A) {
        var q = A[0];
        for (var K = 1; K < A.length; ++K)
            if (A[K] > q) q = A[K];
        return q
    }
// @from(Ln 219197, Col 4)
Xh = function(A, q, K) {
        var Y = q / 8 | 0;
        return (A[Y] | A[Y + 1] << 8) >> (q & 7) & K
    }
// @from(Ln 219201, Col 4)
uXA = function(A, q) {
        var K = q / 8 | 0;
        return (A[K] | A[K + 1] << 8 | A[K + 2] << 16) >> (q & 7)
    }
// @from(Ln 219205, Col 4)
v09 = function(A) {
        return (A + 7) / 8 | 0
    }
// @from(Ln 219208, Col 4)
QXA = function(A, q, K) {
        if (q == null || q < 0) q = 0;
        if (K == null || K > A.length) K = A.length;
        return new Rv(A.subarray(q, K))
    }
// @from(Ln 219213, Col 4)
E09
// @from(Ln 219213, Col 9)
KR = function(A, q, K) {
        var Y = Error(q || E09[A]);
        if (Y.code = A, Error.captureStackTrace) Error.captureStackTrace(Y, KR);
        if (!K) throw Y;
        return Y
    }
// @from(Ln 219219, Col 4)
k09 = function(A, q, K, Y) {
        var z = A.length,
            w = Y ? Y.length : 0;
        if (!z || q.f && !q.l) return K || new Rv(0);
        var H = !K,
            $ = H || q.i != 2,
            O = q.i;
        if (H) K = new Rv(z * 3);
        var _ = function(M1) {
                var z1 = K.length;
                if (M1 > z1) {
                    var Y1 = new Rv(Math.max(z1 * 2, M1));
                    Y1.set(K), K = Y1
                }
            },
            J = q.f || 0,
            X = q.p || 0,
            D = q.b || 0,
            j = q.l,
            M = q.d,
            P = q.m,
            W = q.n,
            G = z * 8;
        do {
            if (!j) {
                J = Xh(A, X, 1);
                var f = Xh(A, X + 1, 3);
                if (X += 3, !f) {
                    var Z = v09(X) + 4,
                        N = A[Z - 4] | A[Z - 3] << 8,
                        T = Z + N;
                    if (T > z) {
                        if (O) KR(0);
                        break
                    }
                    if ($) _(D + N);
                    K.set(A.subarray(Z, T), D), q.b = D += N, q.p = X = T * 8, q.f = J;
                    continue
                } else if (f == 1) j = N09, M = T09, P = 9, W = 5;
                else if (f == 2) {
                    var k = Xh(A, X, 31) + 257,
                        y = Xh(A, X + 10, 15) + 4,
                        B = k + Xh(A, X + 5, 31) + 1;
                    X += 14;
                    var S = new Rv(B),
                        m = new Rv(19);
                    for (var b = 0; b < y; ++b) m[Z09[b]] = Xh(A, X + b * 3, 7);
                    X += y * 3;
                    var g = bXA(m),
                        U = (1 << g) - 1,
                        x = ab1(m, g, 1);
                    for (var b = 0; b < B;) {
                        var p = x[Xh(A, X, U)];
                        X += p & 15;
                        var Z = p >> 4;
                        if (Z < 16) S[b++] = Z;
                        else {
                            var l = 0,
                                r = 0;
                            if (Z == 16) r = 3 + Xh(A, X, 3), X += 2, l = S[b - 1];
                            else if (Z == 17) r = 3 + Xh(A, X, 7), X += 3;
                            else if (Z == 18) r = 11 + Xh(A, X, 127), X += 7;
                            while (r--) S[b++] = l
                        }
                    }
                    var s = S.subarray(0, k),
                        O1 = S.subarray(k);
                    P = bXA(s), W = bXA(O1), j = ab1(s, P, 1), M = ab1(O1, W, 1)
                } else KR(1);
                if (X > G) {
                    if (O) KR(0);
                    break
                }
            }
            if ($) _(D + 131072);
            var T1 = (1 << P) - 1,
                N1 = (1 << W) - 1,
                j1 = X;
            for (;; j1 = X) {
                var l = j[uXA(A, X) & T1],
                    q1 = l >> 4;
                if (X += l & 15, X > G) {
                    if (O) KR(0);
                    break
                }
                if (!l) KR(2);
                if (q1 < 256) K[D++] = q1;
                else if (q1 == 256) {
                    j1 = X, j = null;
                    break
                } else {
                    var t = q1 - 254;
                    if (q1 > 264) {
                        var b = q1 - 257,
                            J1 = Db7[b];
                        t = Xh(A, X, (1 << J1) - 1) + Wb7[b], X += J1
                    }
                    var D1 = M[uXA(A, X) & N1],
                        Z1 = D1 >> 4;
                    if (!D1) KR(3);
                    X += D1 & 15;
                    var O1 = V09[Z1];
                    if (Z1 > 3) {
                        var J1 = jb7[Z1];
                        O1 += uXA(A, X) & (1 << J1) - 1, X += J1
                    }
                    if (X > G) {
                        if (O) KR(0);
                        break
                    }
                    if ($) _(D + 131072);
                    var E1 = D + t;
                    if (D < O1) {
                        var a = w - O1,
                            A1 = Math.min(O1, E1);
                        if (a + D < 0) KR(3);
                        for (; D < A1; ++D) K[D] = Y[a + D]
                    }
                    for (; D < E1; ++D) K[D] = K[D - O1]
                }
            }
            if (q.l = j, q.p = j1, q.b = D, q.f = J, j) J = 1, q.m = P, q.d = M, q.n = W
        } while (!J);
        return D != K.length && H ? QXA(K, 0, D) : K.subarray(0, D)
    }
// @from(Ln 219344, Col 4)
L09
// @from(Ln 219344, Col 9)
CB = function(A, q) {
        return A[q] | A[q + 1] << 8
    }
// @from(Ln 219347, Col 4)
Dh = function(A, q) {
        return (A[q] | A[q + 1] << 8 | A[q + 2] << 16 | A[q + 3] << 24) >>> 0
    }
// @from(Ln 219350, Col 4)
BXA = function(A, q) {
        return Dh(A, q) + Dh(A, q + 4) * 4294967296
    }
// @from(Ln 219353, Col 4)
FXA
// @from(Ln 219353, Col 9)
y09 = 0
// @from(Ln 219354, Col 4)
C09 = function(A) {
        for (var q = "", K = 0;;) {
            var Y = A[K++],
                z = (Y > 127) + (Y > 223) + (Y > 239);
            if (K + z > A.length) return {
                s: q,
                r: QXA(A, K - 1)
            };
            if (!z) q += String.fromCharCode(Y);
            else if (z == 3) Y = ((Y & 15) << 18 | (A[K++] & 63) << 12 | (A[K++] & 63) << 6 | A[K++] & 63) - 65536, q += String.fromCharCode(55296 | Y >> 10, 56320 | Y & 1023);
            else if (z & 1) q += String.fromCharCode((Y & 31) << 6 | A[K++] & 63);
            else q += String.fromCharCode((Y & 15) << 12 | (A[K++] & 63) << 6 | A[K++] & 63)
        }
    }
// @from(Ln 219368, Col 4)
h09 = function(A, q) {
        return q + 30 + CB(A, q + 26) + CB(A, q + 28)
    }
// @from(Ln 219371, Col 4)
I09 = function(A, q, K) {
        var Y = CB(A, q + 28),
            z = S09(A.subarray(q + 46, q + 46 + Y), !(CB(A, q + 8) & 2048)),
            w = q + 46 + Y,
            H = Dh(A, q + 20),
            $ = K && H == 4294967295 ? x09(A, w) : [H, Dh(A, q + 24), Dh(A, q + 42)],
            O = $[0],
            _ = $[1],
            J = $[2];
        return [CB(A, q + 10), O, _, z, w + CB(A, q + 30) + CB(A, q + 32), J]
    }
// @from(Ln 219382, Col 4)
x09 = function(A, q) {
        for (; CB(A, q) != 1; q += 4 + CB(A, q + 2));
        return [BXA(A, q + 12), BXA(A, q + 4), BXA(A, q + 20)]
    }
// @from(Ln 219386, Col 4)
Vb7 = v(() => {
    P09 = M09("/");
    try {
        W09 = P09("worker_threads").Worker
    } catch (A) {}
    Rv = Uint8Array, s01 = Uint16Array, G09 = Int32Array, Db7 = new Rv([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), jb7 = new Rv([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), Z09 = new Rv([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Pb7 = Mb7(Db7, 2), Wb7 = Pb7.b, f09 = Pb7.r;
    Wb7[28] = 258, f09[258] = 28;
    Gb7 = Mb7(jb7, 0), V09 = Gb7.b, Z$w = Gb7.r, mXA = new s01(32768);
    for (B9 = 0; B9 < 32768; ++B9) yB = (B9 & 43690) >> 1 | (B9 & 21845) << 1, yB = (yB & 52428) >> 2 | (yB & 13107) << 2, yB = (yB & 61680) >> 4 | (yB & 3855) << 4, mXA[B9] = ((yB & 65280) >> 8 | (yB & 255) << 8) >> 1;
    sb1 = new Rv(288);
    for (B9 = 0; B9 < 144; ++B9) sb1[B9] = 8;
    for (B9 = 144; B9 < 256; ++B9) sb1[B9] = 9;
    for (B9 = 256; B9 < 280; ++B9) sb1[B9] = 7;
    for (B9 = 280; B9 < 288; ++B9) sb1[B9] = 8;
    Zb7 = new Rv(32);
    for (B9 = 0; B9 < 32; ++B9) Zb7[B9] = 5;
    N09 = ab1(sb1, 9, 1), T09 = ab1(Zb7, 5, 1), E09 = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], L09 = new Rv(0);
    FXA = typeof TextDecoder < "u" && new TextDecoder;
    try {
        FXA.decode(L09, {
            stream: !0
        }), y09 = 1
    } catch (A) {}
})
// @from(Ln 219410, Col 4)
Aj1 = R((V$w, m$6) => {
    function vb7(A) {
        return Array.isArray(A) ? A : [A]
    }
    var b09 = void 0,
        UXA = "",
        Nb7 = " ",
        gXA = "\\",
        u09 = /^\s+$/,
        B09 = /(?:[^\\]|^)\\$/,
        m09 = /^\\!/,
        F09 = /^\\#/,
        Q09 = /\r?\n/g,
        g09 = /^\.{0,2}\/|^\.{1,2}$/,
        U09 = /\/$/,
        t01 = "/",
        Eb7 = "node-ignore";
    if (typeof Symbol < "u") Eb7 = Symbol.for("node-ignore");
    var kb7 = Eb7,
        e01 = (A, q, K) => {
            return Object.defineProperty(A, q, {
                value: K
            }), K
        },
        p09 = /([0-z])-([0-z])/g,
        Lb7 = () => !1,
        d09 = (A) => A.replace(p09, (q, K, Y) => K.charCodeAt(0) <= Y.charCodeAt(0) ? q : UXA),
        c09 = (A) => {
            let {
                length: q
            } = A;
            return A.slice(0, q - q % 2)
        },
        l09 = [
            [/^\uFEFF/, () => UXA],
            [/((?:\\\\)*?)(\\?\s+)$/, (A, q, K) => q + (K.indexOf("\\") === 0 ? Nb7 : UXA)],
            [/(\\+?)\s/g, (A, q) => {
                let {
                    length: K
                } = q;
                return q.slice(0, K - K % 2) + Nb7
            }],
            [/[\\$.|*+(){^]/g, (A) => `\\${A}`],
            [/(?!\\)\?/g, () => "[^/]"],
            [/^\//, () => "^"],
            [/\//g, () => "\\/"],
            [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"],
            [/^(?=[^^])/, function() {
                return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^"
            }],
            [/\\\/\\\*\\\*(?=\\\/|$)/g, (A, q, K) => q + 6 < K.length ? "(?:\\/[^\\/]+)*" : "\\/.+"],
            [/(^|[^\\]+)(\\\*)+(?=.+)/g, (A, q, K) => {
                let Y = K.replace(/\\\*/g, "[^\\/]*");
                return q + Y
            }],
            [/\\\\\\(?=[$.|*+(){^])/g, () => gXA],
            [/\\\\/g, () => gXA],
            [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (A, q, K, Y, z) => q === gXA ? `\\[${K}${c09(Y)}${z}` : z === "]" ? Y.length % 2 === 0 ? `[${d09(K)}${Y}]` : "[]" : "[]"],
            [/(?:[^*])$/, (A) => /\/$/.test(A) ? `${A}$` : `${A}(?=$|\\/$)`]
        ],
        i09 = /(^|\\\/)?\\\*$/,
        tb1 = "regex",
        u$6 = "checkRegex",
        Tb7 = "_",
        n09 = {
            [tb1](A, q) {
                return `${q?`${q}[^/]+`:"[^/]*"}(?=$|\\/$)`
            },
            [u$6](A, q) {
                return `${q?`${q}[^/]*`:"[^/]*"}(?=$|\\/$)`
            }
        },
        r09 = (A) => l09.reduce((q, [K, Y]) => q.replace(K, Y.bind(A)), A),
        B$6 = (A) => typeof A === "string",
        o09 = (A) => A && B$6(A) && !u09.test(A) && !B09.test(A) && A.indexOf("#") !== 0,
        a09 = (A) => A.split(Q09).filter(Boolean);
    class Rb7 {
        constructor(A, q, K, Y, z, w) {
            this.pattern = A, this.mark = q, this.negative = z, e01(this, "body", K), e01(this, "ignoreCase", Y), e01(this, "regexPrefix", w)
        }
        get regex() {
            let A = Tb7 + tb1;
            if (this[A]) return this[A];
            return this._make(tb1, A)
        }
        get checkRegex() {
            let A = Tb7 + u$6;
            if (this[A]) return this[A];
            return this._make(u$6, A)
        }
        _make(A, q) {
            let K = this.regexPrefix.replace(i09, n09[A]),
                Y = this.ignoreCase ? new RegExp(K, "i") : new RegExp(K);
            return e01(this, q, Y)
        }
    }
    var s09 = ({
        pattern: A,
        mark: q
    }, K) => {
        let Y = !1,
            z = A;
        if (z.indexOf("!") === 0) Y = !0, z = z.substr(1);
        z = z.replace(m09, "!").replace(F09, "#");
        let w = r09(z);
        return new Rb7(A, q, z, K, Y, w)
    };
    class yb7 {
        constructor(A) {
            this._ignoreCase = A, this._rules = []
        }
        _add(A) {
            if (A && A[kb7]) {
                this._rules = this._rules.concat(A._rules._rules), this._added = !0;
                return
            }
            if (B$6(A)) A = {
                pattern: A
            };
            if (o09(A.pattern)) {
                let q = s09(A, this._ignoreCase);
                this._added = !0, this._rules.push(q)
            }
        }
        add(A) {
            return this._added = !1, vb7(B$6(A) ? a09(A) : A).forEach(this._add, this), this._added
        }
        test(A, q, K) {
            let Y = !1,
                z = !1,
                w;
            this._rules.forEach(($) => {
                let {
                    negative: O
                } = $;
                if (z === O && Y !== z || O && !Y && !z && !q) return;
                if (!$[K].test(A)) return;
                Y = !O, z = O, w = O ? b09 : $
            });
            let H = {
                ignored: Y,
                unignored: z
            };
            if (w) H.rule = w;
            return H
        }
    }
    var t09 = (A, q) => {
            throw new q(A)
        },
        Gp = (A, q, K) => {
            if (!B$6(A)) return K(`path must be a string, but got \`${q}\``, TypeError);
            if (!A) return K("path must not be empty", TypeError);
            if (Gp.isNotRelative(A)) return K(`path should be a \`path.relative()\`d string, but got "${q}"`, RangeError);
            return !0
        },
        Cb7 = (A) => g09.test(A);
    Gp.isNotRelative = Cb7;
    Gp.convert = (A) => A;
    class Sb7 {
        constructor({
            ignorecase: A = !0,
            ignoreCase: q = A,
            allowRelativePaths: K = !1
        } = {}) {
            e01(this, kb7, !0), this._rules = new yb7(q), this._strictPathCheck = !K, this._initCache()
        }
        _initCache() {
            this._ignoreCache = Object.create(null), this._testCache = Object.create(null)
        }
        add(A) {
            if (this._rules.add(A)) this._initCache();
            return this
        }
        addPattern(A) {
            return this.add(A)
        }
        _test(A, q, K, Y) {
            let z = A && Gp.convert(A);
            return Gp(z, A, this._strictPathCheck ? t09 : Lb7), this._t(z, q, K, Y)
        }
        checkIgnore(A) {
            if (!U09.test(A)) return this.test(A);
            let q = A.split(t01).filter(Boolean);
            if (q.pop(), q.length) {
                let K = this._t(q.join(t01) + t01, this._testCache, !0, q);
                if (K.ignored) return K
            }
            return this._rules.test(A, !1, u$6)
        }
        _t(A, q, K, Y) {
            if (A in q) return q[A];
            if (!Y) Y = A.split(t01).filter(Boolean);
            if (Y.pop(), !Y.length) return q[A] = this._rules.test(A, K, tb1);
            let z = this._t(Y.join(t01) + t01, q, K, Y);
            return q[A] = z.ignored ? z : this._rules.test(A, K, tb1)
        }
        ignores(A) {
            return this._test(A, this._ignoreCache, !1).ignored
        }
        createFilter() {
            return (A) => !this.ignores(A)
        }
        filter(A) {
            return vb7(A).filter(this.createFilter())
        }
        test(A) {
            return this._test(A, this._testCache, !0)
        }
    }
    var pXA = (A) => new Sb7(A),
        e09 = (A) => Gp(A && Gp.convert(A), A, Lb7),
        hb7 = () => {
            let A = (K) => /^\\\\\?\\/.test(K) || /["<>|\u0000-\u001F]+/u.test(K) ? K : K.replace(/\\/g, "/");
            Gp.convert = A;
            let q = /^[a-z]:\//i;
            Gp.isNotRelative = (K) => q.test(K) || Cb7(K)
        };
    if (typeof process < "u" && process.platform === "win32") hb7();
    m$6.exports = pXA;
    pXA.default = pXA;
    m$6.exports.isPathValid = e09;
    e01(m$6.exports, Symbol.for("setupWindows"), hb7)
})
// @from(Ln 219634, Col 4)
Aj9
// @from(Ln 219635, Col 4)
dXA = v(() => {
    Aj9 = o(Aj1(), 1)
})
// @from(Ln 219638, Col 4)
fH = R((qj9) => {
    qj9.fromCallback = function(A) {
        return Object.defineProperty(function(...q) {
            if (typeof q[q.length - 1] === "function") A.apply(this, q);
            else return new Promise((K, Y) => {
                q.push((z, w) => z != null ? Y(z) : K(w)), A.apply(this, q)
            })
        }, "name", {
            value: A.name
        })
    };
    qj9.fromPromise = function(A) {
        return Object.defineProperty(function(...q) {
            let K = q[q.length - 1];
            if (typeof K !== "function") return A.apply(this, q);
            else q.pop(), A.apply(this, q).then((Y) => K(null, Y), K)
        }, "name", {
            value: A.name
        })
    }
})
// @from(Ln 219659, Col 4)
pq1 = R((cXA) => {
    var Ib7 = fH().fromCallback,
        rV = cz(),
        zj9 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
            return typeof rV[A] === "function"
        });
    Object.assign(cXA, rV);
    zj9.forEach((A) => {
        cXA[A] = Ib7(rV[A])
    });
    cXA.exists = function(A, q) {
        if (typeof q === "function") return rV.exists(A, q);
        return new Promise((K) => {
            return rV.exists(A, K)
        })
    };
    cXA.read = function(A, q, K, Y, z, w) {
        if (typeof w === "function") return rV.read(A, q, K, Y, z, w);
        return new Promise((H, $) => {
            rV.read(A, q, K, Y, z, (O, _, J) => {
                if (O) return $(O);
                H({
                    bytesRead: _,
                    buffer: J
                })
            })
        })
    };
    cXA.write = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return rV.write(A, q, ...K);
        return new Promise((Y, z) => {
            rV.write(A, q, ...K, (w, H, $) => {
                if (w) return z(w);
                Y({
                    bytesWritten: H,
                    buffer: $
                })
            })
        })
    };
    if (typeof rV.writev === "function") cXA.writev = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return rV.writev(A, q, ...K);
        return new Promise((Y, z) => {
            rV.writev(A, q, ...K, (w, H, $) => {
                if (w) return z(w);
                Y({
                    bytesWritten: H,
                    buffers: $
                })
            })
        })
    };
    if (typeof rV.realpath.native === "function") cXA.realpath.native = Ib7(rV.realpath.native);
    else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 219714, Col 4)
bb7 = R((_j9, xb7) => {
    var Oj9 = h1("path");
    _j9.checkPath = function(q) {
        if (process.platform === "win32") {
            if (/[<>:"|?*]/.test(q.replace(Oj9.parse(q).root, ""))) {
                let Y = Error(`Path contains invalid characters: ${q}`);
                throw Y.code = "EINVAL", Y
            }
        }
    }
})
// @from(Ln 219725, Col 4)
Fb7 = R((Xj9, lXA) => {
    var ub7 = pq1(),
        {
            checkPath: Bb7
        } = bb7(),
        mb7 = (A) => {
            let q = {
                mode: 511
            };
            if (typeof A === "number") return A;
            return {
                ...q,
                ...A
            }.mode
        };
    Xj9.makeDir = async (A, q) => {
        return Bb7(A), ub7.mkdir(A, {
            mode: mb7(q),
            recursive: !0
        })
    };
    Xj9.makeDirSync = (A, q) => {
        return Bb7(A), ub7.mkdirSync(A, {
            mode: mb7(q),
            recursive: !0
        })
    }
})
// @from(Ln 219753, Col 4)
jh = R((L$w, Qb7) => {
    var Mj9 = fH().fromPromise,
        {
            makeDir: Pj9,
            makeDirSync: iXA
        } = Fb7(),
        nXA = Mj9(Pj9);
    Qb7.exports = {
        mkdirs: nXA,
        mkdirsSync: iXA,
        mkdirp: nXA,
        mkdirpSync: iXA,
        ensureDir: nXA,
        ensureDirSync: iXA
    }
})
// @from(Ln 219769, Col 4)
Pa = R((R$w, Ub7) => {
    var Wj9 = fH().fromPromise,
        gb7 = pq1();

    function Gj9(A) {
        return gb7.access(A).then(() => !0).catch(() => !1)
    }
    Ub7.exports = {
        pathExists: Wj9(Gj9),
        pathExistsSync: gb7.existsSync
    }
})
// @from(Ln 219781, Col 4)
rXA = R((y$w, pb7) => {
    var qj1 = cz();

    function Zj9(A, q, K, Y) {
        qj1.open(A, "r+", (z, w) => {
            if (z) return Y(z);
            qj1.futimes(w, q, K, (H) => {
                qj1.close(w, ($) => {
                    if (Y) Y(H || $)
                })
            })
        })
    }

    function fj9(A, q, K) {
        let Y = qj1.openSync(A, "r+");
        return qj1.futimesSync(Y, q, K), qj1.closeSync(Y)
    }
    pb7.exports = {
        utimesMillis: Zj9,
        utimesMillisSync: fj9
    }
})
// @from(Ln 219804, Col 4)
dq1 = R((C$w, lb7) => {
    var Kj1 = pq1(),
        s0 = h1("path"),
        Vj9 = h1("util");

    function Nj9(A, q, K) {
        let Y = K.dereference ? (z) => Kj1.stat(z, {
            bigint: !0
        }) : (z) => Kj1.lstat(z, {
            bigint: !0
        });
        return Promise.all([Y(A), Y(q).catch((z) => {
            if (z.code === "ENOENT") return null;
            throw z
        })]).then(([z, w]) => ({
            srcStat: z,
            destStat: w
        }))
    }

    function Tj9(A, q, K) {
        let Y, z = K.dereference ? (H) => Kj1.statSync(H, {
                bigint: !0
            }) : (H) => Kj1.lstatSync(H, {
                bigint: !0
            }),
            w = z(A);
        try {
            Y = z(q)
        } catch (H) {
            if (H.code === "ENOENT") return {
                srcStat: w,
                destStat: null
            };
            throw H
        }
        return {
            srcStat: w,
            destStat: Y
        }
    }

    function vj9(A, q, K, Y, z) {
        Vj9.callbackify(Nj9)(A, q, Y, (w, H) => {
            if (w) return z(w);
            let {
                srcStat: $,
                destStat: O
            } = H;
            if (O) {
                if (eb1($, O)) {
                    let _ = s0.basename(A),
                        J = s0.basename(q);
                    if (K === "move" && _ !== J && _.toLowerCase() === J.toLowerCase()) return z(null, {
                        srcStat: $,
                        destStat: O,
                        isChangingCase: !0
                    });
                    return z(Error("Source and destination must not be the same."))
                }
                if ($.isDirectory() && !O.isDirectory()) return z(Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`));
                if (!$.isDirectory() && O.isDirectory()) return z(Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`))
            }
            if ($.isDirectory() && oXA(A, q)) return z(Error(F$6(A, q, K)));
            return z(null, {
                srcStat: $,
                destStat: O
            })
        })
    }

    function Ej9(A, q, K, Y) {
        let {
            srcStat: z,
            destStat: w
        } = Tj9(A, q, Y);
        if (w) {
            if (eb1(z, w)) {
                let H = s0.basename(A),
                    $ = s0.basename(q);
                if (K === "move" && H !== $ && H.toLowerCase() === $.toLowerCase()) return {
                    srcStat: z,
                    destStat: w,
                    isChangingCase: !0
                };
                throw Error("Source and destination must not be the same.")
            }
            if (z.isDirectory() && !w.isDirectory()) throw Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`);
            if (!z.isDirectory() && w.isDirectory()) throw Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`)
        }
        if (z.isDirectory() && oXA(A, q)) throw Error(F$6(A, q, K));
        return {
            srcStat: z,
            destStat: w
        }
    }

    function db7(A, q, K, Y, z) {
        let w = s0.resolve(s0.dirname(A)),
            H = s0.resolve(s0.dirname(K));
        if (H === w || H === s0.parse(H).root) return z();
        Kj1.stat(H, {
            bigint: !0
        }, ($, O) => {
            if ($) {
                if ($.code === "ENOENT") return z();
                return z($)
            }
            if (eb1(q, O)) return z(Error(F$6(A, K, Y)));
            return db7(A, q, H, Y, z)
        })
    }

    function cb7(A, q, K, Y) {
        let z = s0.resolve(s0.dirname(A)),
            w = s0.resolve(s0.dirname(K));
        if (w === z || w === s0.parse(w).root) return;
        let H;
        try {
            H = Kj1.statSync(w, {
                bigint: !0
            })
        } catch ($) {
            if ($.code === "ENOENT") return;
            throw $
        }
        if (eb1(q, H)) throw Error(F$6(A, K, Y));
        return cb7(A, q, w, Y)
    }

    function eb1(A, q) {
        return q.ino && q.dev && q.ino === A.ino && q.dev === A.dev
    }

    function oXA(A, q) {
        let K = s0.resolve(A).split(s0.sep).filter((z) => z),
            Y = s0.resolve(q).split(s0.sep).filter((z) => z);
        return K.reduce((z, w, H) => z && Y[H] === w, !0)
    }

    function F$6(A, q, K) {
        return `Cannot ${K} '${A}' to a subdirectory of itself, '${q}'.`
    }
    lb7.exports = {
        checkPaths: vj9,
        checkPathsSync: Ej9,
        checkParentPaths: db7,
        checkParentPathsSync: cb7,
        isSrcSubdir: oXA,
        areIdentical: eb1
    }
})
// @from(Ln 219956, Col 4)
eb7 = R((S$w, tb7) => {
    var oV = cz(),
        Au1 = h1("path"),
        kj9 = jh().mkdirs,
        Lj9 = Pa().pathExists,
        Rj9 = rXA().utimesMillis,
        qu1 = dq1();

    function yj9(A, q, K, Y) {
        if (typeof K === "function" && !Y) Y = K, K = {};
        else if (typeof K === "function") K = {
            filter: K
        };
        if (Y = Y || function() {}, K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0001");
        qu1.checkPaths(A, q, "copy", K, (z, w) => {
            if (z) return Y(z);
            let {
                srcStat: H,
                destStat: $
            } = w;
            qu1.checkParentPaths(A, H, q, "copy", (O) => {
                if (O) return Y(O);
                if (K.filter) return rb7(ib7, $, A, q, K, Y);
                return ib7($, A, q, K, Y)
            })
        })
    }

    function ib7(A, q, K, Y, z) {
        let w = Au1.dirname(K);
        Lj9(w, (H, $) => {
            if (H) return z(H);
            if ($) return Q$6(A, q, K, Y, z);
            kj9(w, (O) => {
                if (O) return z(O);
                return Q$6(A, q, K, Y, z)
            })
        })
    }

    function rb7(A, q, K, Y, z, w) {
        Promise.resolve(z.filter(K, Y)).then((H) => {
            if (H) return A(q, K, Y, z, w);
            return w()
        }, (H) => w(H))
    }

    function Cj9(A, q, K, Y, z) {
        if (Y.filter) return rb7(Q$6, A, q, K, Y, z);
        return Q$6(A, q, K, Y, z)
    }

    function Q$6(A, q, K, Y, z) {
        (Y.dereference ? oV.stat : oV.lstat)(q, (H, $) => {
            if (H) return z(H);
            if ($.isDirectory()) return Bj9($, A, q, K, Y, z);
            else if ($.isFile() || $.isCharacterDevice() || $.isBlockDevice()) return Sj9($, A, q, K, Y, z);
            else if ($.isSymbolicLink()) return Qj9(A, q, K, Y, z);
            else if ($.isSocket()) return z(Error(`Cannot copy a socket file: ${q}`));
            else if ($.isFIFO()) return z(Error(`Cannot copy a FIFO pipe: ${q}`));
            return z(Error(`Unknown file: ${q}`))
        })
    }

    function Sj9(A, q, K, Y, z, w) {
        if (!q) return ob7(A, K, Y, z, w);
        return hj9(A, K, Y, z, w)
    }

    function hj9(A, q, K, Y, z) {
        if (Y.overwrite) oV.unlink(K, (w) => {
            if (w) return z(w);
            return ob7(A, q, K, Y, z)
        });
        else if (Y.errorOnExist) return z(Error(`'${K}' already exists`));
        else return z()
    }

    function ob7(A, q, K, Y, z) {
        oV.copyFile(q, K, (w) => {
            if (w) return z(w);
            if (Y.preserveTimestamps) return Ij9(A.mode, q, K, z);
            return g$6(K, A.mode, z)
        })
    }

    function Ij9(A, q, K, Y) {
        if (xj9(A)) return bj9(K, A, (z) => {
            if (z) return Y(z);
            return nb7(A, q, K, Y)
        });
        return nb7(A, q, K, Y)
    }

    function xj9(A) {
        return (A & 128) === 0
    }

    function bj9(A, q, K) {
        return g$6(A, q | 128, K)
    }

    function nb7(A, q, K, Y) {
        uj9(q, K, (z) => {
            if (z) return Y(z);
            return g$6(K, A, Y)
        })
    }

    function g$6(A, q, K) {
        return oV.chmod(A, q, K)
    }

    function uj9(A, q, K) {
        oV.stat(A, (Y, z) => {
            if (Y) return K(Y);
            return Rj9(q, z.atime, z.mtime, K)
        })
    }

    function Bj9(A, q, K, Y, z, w) {
        if (!q) return mj9(A.mode, K, Y, z, w);
        return ab7(K, Y, z, w)
    }

    function mj9(A, q, K, Y, z) {
        oV.mkdir(K, (w) => {
            if (w) return z(w);
            ab7(q, K, Y, (H) => {
                if (H) return z(H);
                return g$6(K, A, z)
            })
        })
    }

    function ab7(A, q, K, Y) {
        oV.readdir(A, (z, w) => {
            if (z) return Y(z);
            return sb7(w, A, q, K, Y)
        })
    }

    function sb7(A, q, K, Y, z) {
        let w = A.pop();
        if (!w) return z();
        return Fj9(A, w, q, K, Y, z)
    }

    function Fj9(A, q, K, Y, z, w) {
        let H = Au1.join(K, q),
            $ = Au1.join(Y, q);
        qu1.checkPaths(H, $, "copy", z, (O, _) => {
            if (O) return w(O);
            let {
                destStat: J
            } = _;
            Cj9(J, H, $, z, (X) => {
                if (X) return w(X);
                return sb7(A, K, Y, z, w)
            })
        })
    }

    function Qj9(A, q, K, Y, z) {
        oV.readlink(q, (w, H) => {
            if (w) return z(w);
            if (Y.dereference) H = Au1.resolve(process.cwd(), H);
            if (!A) return oV.symlink(H, K, z);
            else oV.readlink(K, ($, O) => {
                if ($) {
                    if ($.code === "EINVAL" || $.code === "UNKNOWN") return oV.symlink(H, K, z);
                    return z($)
                }
                if (Y.dereference) O = Au1.resolve(process.cwd(), O);
                if (qu1.isSrcSubdir(H, O)) return z(Error(`Cannot copy '${H}' to a subdirectory of itself, '${O}'.`));
                if (A.isDirectory() && qu1.isSrcSubdir(O, H)) return z(Error(`Cannot overwrite '${O}' with '${H}'.`));
                return gj9(H, K, z)
            })
        })
    }

    function gj9(A, q, K) {
        oV.unlink(q, (Y) => {
            if (Y) return K(Y);
            return oV.symlink(A, q, K)
        })
    }
    tb7.exports = yj9
})
// @from(Ln 220147, Col 4)
zu7 = R((h$w, Yu7) => {
    var hW = cz(),
        Ku1 = h1("path"),
        Uj9 = jh().mkdirsSync,
        pj9 = rXA().utimesMillisSync,
        Yu1 = dq1();

    function dj9(A, q, K) {
        if (typeof K === "function") K = {
            filter: K
        };
        if (K = K || {}, K.clobber = "clobber" in K ? !!K.clobber : !0, K.overwrite = "overwrite" in K ? !!K.overwrite : K.clobber, K.preserveTimestamps && process.arch === "ia32") process.emitWarning(`Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`, "Warning", "fs-extra-WARN0002");
        let {
            srcStat: Y,
            destStat: z
        } = Yu1.checkPathsSync(A, q, "copy", K);
        return Yu1.checkParentPathsSync(A, Y, q, "copy"), cj9(z, A, q, K)
    }

    function cj9(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        let z = Ku1.dirname(K);
        if (!hW.existsSync(z)) Uj9(z);
        return Au7(A, q, K, Y)
    }

    function lj9(A, q, K, Y) {
        if (Y.filter && !Y.filter(q, K)) return;
        return Au7(A, q, K, Y)
    }

    function Au7(A, q, K, Y) {
        let w = (Y.dereference ? hW.statSync : hW.lstatSync)(q);
        if (w.isDirectory()) return tj9(w, A, q, K, Y);
        else if (w.isFile() || w.isCharacterDevice() || w.isBlockDevice()) return ij9(w, A, q, K, Y);
        else if (w.isSymbolicLink()) return qM9(A, q, K, Y);
        else if (w.isSocket()) throw Error(`Cannot copy a socket file: ${q}`);
        else if (w.isFIFO()) throw Error(`Cannot copy a FIFO pipe: ${q}`);
        throw Error(`Unknown file: ${q}`)
    }

    function ij9(A, q, K, Y, z) {
        if (!q) return qu7(A, K, Y, z);
        return nj9(A, K, Y, z)
    }

    function nj9(A, q, K, Y) {
        if (Y.overwrite) return hW.unlinkSync(K), qu7(A, q, K, Y);
        else if (Y.errorOnExist) throw Error(`'${K}' already exists`)
    }

    function qu7(A, q, K, Y) {
        if (hW.copyFileSync(q, K), Y.preserveTimestamps) rj9(A.mode, q, K);
        return aXA(K, A.mode)
    }

    function rj9(A, q, K) {
        if (oj9(A)) aj9(K, A);
        return sj9(q, K)
    }

    function oj9(A) {
        return (A & 128) === 0
    }

    function aj9(A, q) {
        return aXA(A, q | 128)
    }

    function aXA(A, q) {
        return hW.chmodSync(A, q)
    }

    function sj9(A, q) {
        let K = hW.statSync(A);
        return pj9(q, K.atime, K.mtime)
    }

    function tj9(A, q, K, Y, z) {
        if (!q) return ej9(A.mode, K, Y, z);
        return Ku7(K, Y, z)
    }

    function ej9(A, q, K, Y) {
        return hW.mkdirSync(K), Ku7(q, K, Y), aXA(K, A)
    }

    function Ku7(A, q, K) {
        hW.readdirSync(A).forEach((Y) => AM9(Y, A, q, K))
    }

    function AM9(A, q, K, Y) {
        let z = Ku1.join(q, A),
            w = Ku1.join(K, A),
            {
                destStat: H
            } = Yu1.checkPathsSync(z, w, "copy", Y);
        return lj9(H, z, w, Y)
    }

    function qM9(A, q, K, Y) {
        let z = hW.readlinkSync(q);
        if (Y.dereference) z = Ku1.resolve(process.cwd(), z);
        if (!A) return hW.symlinkSync(z, K);
        else {
            let w;
            try {
                w = hW.readlinkSync(K)
            } catch (H) {
                if (H.code === "EINVAL" || H.code === "UNKNOWN") return hW.symlinkSync(z, K);
                throw H
            }
            if (Y.dereference) w = Ku1.resolve(process.cwd(), w);
            if (Yu1.isSrcSubdir(z, w)) throw Error(`Cannot copy '${z}' to a subdirectory of itself, '${w}'.`);
            if (hW.statSync(K).isDirectory() && Yu1.isSrcSubdir(w, z)) throw Error(`Cannot overwrite '${w}' with '${z}'.`);
            return KM9(z, K)
        }
    }

    function KM9(A, q) {
        return hW.unlinkSync(q), hW.symlinkSync(A, q)
    }
    Yu7.exports = dj9
})
// @from(Ln 220273, Col 4)
U$6 = R((I$w, wu7) => {
    var YM9 = fH().fromCallback;
    wu7.exports = {
        copy: YM9(eb7()),
        copySync: zu7()
    }
})
// @from(Ln 220280, Col 4)
Mu7 = R((x$w, ju7) => {
    var Hu7 = cz(),
        Ju7 = h1("path"),
        Sw = h1("assert"),
        zu1 = process.platform === "win32";

    function Xu7(A) {
        ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"].forEach((K) => {
            A[K] = A[K] || Hu7[K], K = K + "Sync", A[K] = A[K] || Hu7[K]
        }), A.maxBusyTries = A.maxBusyTries || 3
    }

    function sXA(A, q, K) {
        let Y = 0;
        if (typeof q === "function") K = q, q = {};
        Sw(A, "rimraf: missing path"), Sw.strictEqual(typeof A, "string", "rimraf: path should be a string"), Sw.strictEqual(typeof K, "function", "rimraf: callback function required"), Sw(q, "rimraf: invalid options argument provided"), Sw.strictEqual(typeof q, "object", "rimraf: options should be object"), Xu7(q), $u7(A, q, function z(w) {
            if (w) {
                if ((w.code === "EBUSY" || w.code === "ENOTEMPTY" || w.code === "EPERM") && Y < q.maxBusyTries) {
                    Y++;
                    let H = Y * 100;
                    return setTimeout(() => $u7(A, q, z), H)
                }
                if (w.code === "ENOENT") w = null
            }
            K(w)
        })
    }

    function $u7(A, q, K) {
        Sw(A), Sw(q), Sw(typeof K === "function"), q.lstat(A, (Y, z) => {
            if (Y && Y.code === "ENOENT") return K(null);
            if (Y && Y.code === "EPERM" && zu1) return Ou7(A, q, Y, K);
            if (z && z.isDirectory()) return p$6(A, q, Y, K);
            q.unlink(A, (w) => {
                if (w) {
                    if (w.code === "ENOENT") return K(null);
                    if (w.code === "EPERM") return zu1 ? Ou7(A, q, w, K) : p$6(A, q, w, K);
                    if (w.code === "EISDIR") return p$6(A, q, w, K)
                }
                return K(w)
            })
        })
    }

    function Ou7(A, q, K, Y) {
        Sw(A), Sw(q), Sw(typeof Y === "function"), q.chmod(A, 438, (z) => {
            if (z) Y(z.code === "ENOENT" ? null : K);
            else q.stat(A, (w, H) => {
                if (w) Y(w.code === "ENOENT" ? null : K);
                else if (H.isDirectory()) p$6(A, q, K, Y);
                else q.unlink(A, Y)
            })
        })
    }

    function _u7(A, q, K) {
        let Y;
        Sw(A), Sw(q);
        try {
            q.chmodSync(A, 438)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else throw K
        }
        try {
            Y = q.statSync(A)
        } catch (z) {
            if (z.code === "ENOENT") return;
            else throw K
        }
        if (Y.isDirectory()) d$6(A, q, K);
        else q.unlinkSync(A)
    }

    function p$6(A, q, K, Y) {
        Sw(A), Sw(q), Sw(typeof Y === "function"), q.rmdir(A, (z) => {
            if (z && (z.code === "ENOTEMPTY" || z.code === "EEXIST" || z.code === "EPERM")) zM9(A, q, Y);
            else if (z && z.code === "ENOTDIR") Y(K);
            else Y(z)
        })
    }

    function zM9(A, q, K) {
        Sw(A), Sw(q), Sw(typeof K === "function"), q.readdir(A, (Y, z) => {
            if (Y) return K(Y);
            let w = z.length,
                H;
            if (w === 0) return q.rmdir(A, K);
            z.forEach(($) => {
                sXA(Ju7.join(A, $), q, (O) => {
                    if (H) return;
                    if (O) return K(H = O);
                    if (--w === 0) q.rmdir(A, K)
                })
            })
        })
    }

    function Du7(A, q) {
        let K;
        q = q || {}, Xu7(q), Sw(A, "rimraf: missing path"), Sw.strictEqual(typeof A, "string", "rimraf: path should be a string"), Sw(q, "rimraf: missing options"), Sw.strictEqual(typeof q, "object", "rimraf: options should be object");
        try {
            K = q.lstatSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            if (Y.code === "EPERM" && zu1) _u7(A, q, Y)
        }
        try {
            if (K && K.isDirectory()) d$6(A, q, null);
            else q.unlinkSync(A)
        } catch (Y) {
            if (Y.code === "ENOENT") return;
            else if (Y.code === "EPERM") return zu1 ? _u7(A, q, Y) : d$6(A, q, Y);
            else if (Y.code !== "EISDIR") throw Y;
            d$6(A, q, Y)
        }
    }

    function d$6(A, q, K) {
        Sw(A), Sw(q);
        try {
            q.rmdirSync(A)
        } catch (Y) {
            if (Y.code === "ENOTDIR") throw K;
            else if (Y.code === "ENOTEMPTY" || Y.code === "EEXIST" || Y.code === "EPERM") wM9(A, q);
            else if (Y.code !== "ENOENT") throw Y
        }
    }

    function wM9(A, q) {
        if (Sw(A), Sw(q), q.readdirSync(A).forEach((K) => Du7(Ju7.join(A, K), q)), zu1) {
            let K = Date.now();
            do try {
                return q.rmdirSync(A, q)
            } catch {}
            while (Date.now() - K < 500)
        } else return q.rmdirSync(A, q)
    }
    ju7.exports = sXA;
    sXA.sync = Du7
})
// @from(Ln 220421, Col 4)
wu1 = R((b$w, Wu7) => {
    var c$6 = cz(),
        HM9 = fH().fromCallback,
        Pu7 = Mu7();

    function $M9(A, q) {
        if (c$6.rm) return c$6.rm(A, {
            recursive: !0,
            force: !0
        }, q);
        Pu7(A, q)
    }

    function OM9(A) {
        if (c$6.rmSync) return c$6.rmSync(A, {
            recursive: !0,
            force: !0
        });
        Pu7.sync(A)
    }
    Wu7.exports = {
        remove: HM9($M9),
        removeSync: OM9
    }
})
// @from(Ln 220446, Col 4)
Eu7 = R((u$w, vu7) => {
    var _M9 = fH().fromPromise,
        fu7 = pq1(),
        Vu7 = h1("path"),
        Nu7 = jh(),
        Tu7 = wu1(),
        Gu7 = _M9(async function(q) {
            let K;
            try {
                K = await fu7.readdir(q)
            } catch {
                return Nu7.mkdirs(q)
            }
            return Promise.all(K.map((Y) => Tu7.remove(Vu7.join(q, Y))))
        });

    function Zu7(A) {
        let q;
        try {
            q = fu7.readdirSync(A)
        } catch {
            return Nu7.mkdirsSync(A)
        }
        q.forEach((K) => {
            K = Vu7.join(A, K), Tu7.removeSync(K)
        })
    }
    vu7.exports = {
        emptyDirSync: Zu7,
        emptydirSync: Zu7,
        emptyDir: Gu7,
        emptydir: Gu7
    }
})
// @from(Ln 220480, Col 4)
yu7 = R((B$w, Ru7) => {
    var JM9 = fH().fromCallback,
        ku7 = h1("path"),
        Wa = cz(),
        Lu7 = jh();

    function XM9(A, q) {
        function K() {
            Wa.writeFile(A, "", (Y) => {
                if (Y) return q(Y);
                q()
            })
        }
        Wa.stat(A, (Y, z) => {
            if (!Y && z.isFile()) return q();
            let w = ku7.dirname(A);
            Wa.stat(w, (H, $) => {
                if (H) {
                    if (H.code === "ENOENT") return Lu7.mkdirs(w, (O) => {
                        if (O) return q(O);
                        K()
                    });
                    return q(H)
                }
                if ($.isDirectory()) K();
                else Wa.readdir(w, (O) => {
                    if (O) return q(O)
                })
            })
        })
    }

    function DM9(A) {
        let q;
        try {
            q = Wa.statSync(A)
        } catch {}
        if (q && q.isFile()) return;
        let K = ku7.dirname(A);
        try {
            if (!Wa.statSync(K).isDirectory()) Wa.readdirSync(K)
        } catch (Y) {
            if (Y && Y.code === "ENOENT") Lu7.mkdirsSync(K);
            else throw Y
        }
        Wa.writeFileSync(A, "")
    }
    Ru7.exports = {
        createFile: JM9(XM9),
        createFileSync: DM9
    }
})
// @from(Ln 220532, Col 4)
xu7 = R((m$w, Iu7) => {
    var jM9 = fH().fromCallback,
        Cu7 = h1("path"),
        Ga = cz(),
        Su7 = jh(),
        MM9 = Pa().pathExists,
        {
            areIdentical: hu7
        } = dq1();

    function PM9(A, q, K) {
        function Y(z, w) {
            Ga.link(z, w, (H) => {
                if (H) return K(H);
                K(null)
            })
        }
        Ga.lstat(q, (z, w) => {
            Ga.lstat(A, (H, $) => {
                if (H) return H.message = H.message.replace("lstat", "ensureLink"), K(H);
                if (w && hu7($, w)) return K(null);
                let O = Cu7.dirname(q);
                MM9(O, (_, J) => {
                    if (_) return K(_);
                    if (J) return Y(A, q);
                    Su7.mkdirs(O, (X) => {
                        if (X) return K(X);
                        Y(A, q)
                    })
                })
            })
        })
    }

    function WM9(A, q) {
        let K;
        try {
            K = Ga.lstatSync(q)
        } catch {}
        try {
            let w = Ga.lstatSync(A);
            if (K && hu7(w, K)) return
        } catch (w) {
            throw w.message = w.message.replace("lstat", "ensureLink"), w
        }
        let Y = Cu7.dirname(q);
        if (Ga.existsSync(Y)) return Ga.linkSync(A, q);
        return Su7.mkdirsSync(Y), Ga.linkSync(A, q)
    }
    Iu7.exports = {
        createLink: jM9(PM9),
        createLinkSync: WM9
    }
})
// @from(Ln 220586, Col 4)
uu7 = R((F$w, bu7) => {
    var Za = h1("path"),
        Hu1 = cz(),
        GM9 = Pa().pathExists;

    function ZM9(A, q, K) {
        if (Za.isAbsolute(A)) return Hu1.lstat(A, (Y) => {
            if (Y) return Y.message = Y.message.replace("lstat", "ensureSymlink"), K(Y);
            return K(null, {
                toCwd: A,
                toDst: A
            })
        });
        else {
            let Y = Za.dirname(q),
                z = Za.join(Y, A);
            return GM9(z, (w, H) => {
                if (w) return K(w);
                if (H) return K(null, {
                    toCwd: z,
                    toDst: A
                });
                else return Hu1.lstat(A, ($) => {
                    if ($) return $.message = $.message.replace("lstat", "ensureSymlink"), K($);
                    return K(null, {
                        toCwd: A,
                        toDst: Za.relative(Y, A)
                    })
                })
            })
        }
    }

    function fM9(A, q) {
        let K;
        if (Za.isAbsolute(A)) {
            if (K = Hu1.existsSync(A), !K) throw Error("absolute srcpath does not exist");
            return {
                toCwd: A,
                toDst: A
            }
        } else {
            let Y = Za.dirname(q),
                z = Za.join(Y, A);
            if (K = Hu1.existsSync(z), K) return {
                toCwd: z,
                toDst: A
            };
            else {
                if (K = Hu1.existsSync(A), !K) throw Error("relative srcpath does not exist");
                return {
                    toCwd: A,
                    toDst: Za.relative(Y, A)
                }
            }
        }
    }
    bu7.exports = {
        symlinkPaths: ZM9,
        symlinkPathsSync: fM9
    }
})
// @from(Ln 220648, Col 4)
Fu7 = R((Q$w, mu7) => {
    var Bu7 = cz();

    function VM9(A, q, K) {
        if (K = typeof q === "function" ? q : K, q = typeof q === "function" ? !1 : q, q) return K(null, q);
        Bu7.lstat(A, (Y, z) => {
            if (Y) return K(null, "file");
            q = z && z.isDirectory() ? "dir" : "file", K(null, q)
        })
    }

    function NM9(A, q) {
        let K;
        if (q) return q;
        try {
            K = Bu7.lstatSync(A)
        } catch {
            return "file"
        }
        return K && K.isDirectory() ? "dir" : "file"
    }
    mu7.exports = {
        symlinkType: VM9,
        symlinkTypeSync: NM9
    }
})
// @from(Ln 220674, Col 4)
iu7 = R((g$w, lu7) => {
    var TM9 = fH().fromCallback,
        gu7 = h1("path"),
        Mh = pq1(),
        Uu7 = jh(),
        vM9 = Uu7.mkdirs,
        EM9 = Uu7.mkdirsSync,
        pu7 = uu7(),
        kM9 = pu7.symlinkPaths,
        LM9 = pu7.symlinkPathsSync,
        du7 = Fu7(),
        RM9 = du7.symlinkType,
        yM9 = du7.symlinkTypeSync,
        CM9 = Pa().pathExists,
        {
            areIdentical: cu7
        } = dq1();

    function SM9(A, q, K, Y) {
        Y = typeof K === "function" ? K : Y, K = typeof K === "function" ? !1 : K, Mh.lstat(q, (z, w) => {
            if (!z && w.isSymbolicLink()) Promise.all([Mh.stat(A), Mh.stat(q)]).then(([H, $]) => {
                if (cu7(H, $)) return Y(null);
                Qu7(A, q, K, Y)
            });
            else Qu7(A, q, K, Y)
        })
    }

    function Qu7(A, q, K, Y) {
        kM9(A, q, (z, w) => {
            if (z) return Y(z);
            A = w.toDst, RM9(w.toCwd, K, (H, $) => {
                if (H) return Y(H);
                let O = gu7.dirname(q);
                CM9(O, (_, J) => {
                    if (_) return Y(_);
                    if (J) return Mh.symlink(A, q, $, Y);
                    vM9(O, (X) => {
                        if (X) return Y(X);
                        Mh.symlink(A, q, $, Y)
                    })
                })
            })
        })
    }

    function hM9(A, q, K) {
        let Y;
        try {
            Y = Mh.lstatSync(q)
        } catch {}
        if (Y && Y.isSymbolicLink()) {
            let $ = Mh.statSync(A),
                O = Mh.statSync(q);
            if (cu7($, O)) return
        }
        let z = LM9(A, q);
        A = z.toDst, K = yM9(z.toCwd, K);
        let w = gu7.dirname(q);
        if (Mh.existsSync(w)) return Mh.symlinkSync(A, q, K);
        return EM9(w), Mh.symlinkSync(A, q, K)
    }
    lu7.exports = {
        createSymlink: TM9(SM9),
        createSymlinkSync: hM9
    }
})
// @from(Ln 220741, Col 4)
AB7 = R((U$w, eu7) => {
    var {
        createFile: nu7,
        createFileSync: ru7
    } = yu7(), {
        createLink: ou7,
        createLinkSync: au7
    } = xu7(), {
        createSymlink: su7,
        createSymlinkSync: tu7
    } = iu7();
    eu7.exports = {
        createFile: nu7,
        createFileSync: ru7,
        ensureFile: nu7,
        ensureFileSync: ru7,
        createLink: ou7,
        createLinkSync: au7,
        ensureLink: ou7,
        ensureLinkSync: au7,
        createSymlink: su7,
        createSymlinkSync: tu7,
        ensureSymlink: su7,
        ensureSymlinkSync: tu7
    }
})
// @from(Ln 220767, Col 4)
Yj1 = R((p$w, qB7) => {
    function IM9(A, {
        EOL: q = `
`,
        finalEOL: K = !0,
        replacer: Y = null,
        spaces: z
    } = {}) {
        let w = K ? q : "";
        return JSON.stringify(A, Y, z).replace(/\n/g, q) + w
    }

    function xM9(A) {
        if (Buffer.isBuffer(A)) A = A.toString("utf8");
        return A.replace(/^\uFEFF/, "")
    }
    qB7.exports = {
        stringify: IM9,
        stripBom: xM9
    }
})
// @from(Ln 220788, Col 4)
tXA = R((d$w, zB7) => {
    var zj1;
    try {
        zj1 = cz()
    } catch (A) {
        zj1 = h1("fs")
    }
    var l$6 = fH(),
        {
            stringify: KB7,
            stripBom: YB7
        } = Yj1();
    async function bM9(A, q = {}) {
        if (typeof q === "string") q = {
            encoding: q
        };
        let K = q.fs || zj1,
            Y = "throws" in q ? q.throws : !0,
            z = await l$6.fromCallback(K.readFile)(A, q);
        z = YB7(z);
        let w;
        try {
            w = JSON.parse(z, q ? q.reviver : null)
        } catch (H) {
            if (Y) throw H.message = `${A}: ${H.message}`, H;
            else return null
        }
        return w
    }
    var uM9 = l$6.fromPromise(bM9);

    function BM9(A, q = {}) {
        if (typeof q === "string") q = {
            encoding: q
        };
        let K = q.fs || zj1,
            Y = "throws" in q ? q.throws : !0;
        try {
            let z = K.readFileSync(A, q);
            return z = YB7(z), JSON.parse(z, q.reviver)
        } catch (z) {
            if (Y) throw z.message = `${A}: ${z.message}`, z;
            else return null
        }
    }
    async function mM9(A, q, K = {}) {
        let Y = K.fs || zj1,
            z = KB7(q, K);
        await l$6.fromCallback(Y.writeFile)(A, z, K)
    }
    var FM9 = l$6.fromPromise(mM9);

    function QM9(A, q, K = {}) {
        let Y = K.fs || zj1,
            z = KB7(q, K);
        return Y.writeFileSync(A, z, K)
    }
    var gM9 = {
        readFile: uM9,
        readFileSync: BM9,
        writeFile: FM9,
        writeFileSync: QM9
    };
    zB7.exports = gM9
})
// @from(Ln 220853, Col 4)
HB7 = R((c$w, wB7) => {
    var i$6 = tXA();
    wB7.exports = {
        readJson: i$6.readFile,
        readJsonSync: i$6.readFileSync,
        writeJson: i$6.writeFile,
        writeJsonSync: i$6.writeFileSync
    }
})
// @from(Ln 220862, Col 4)
n$6 = R((l$w, _B7) => {
    var UM9 = fH().fromCallback,
        $u1 = cz(),
        $B7 = h1("path"),
        OB7 = jh(),
        pM9 = Pa().pathExists;

    function dM9(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = "utf8";
        let z = $B7.dirname(A);
        pM9(z, (w, H) => {
            if (w) return Y(w);
            if (H) return $u1.writeFile(A, q, K, Y);
            OB7.mkdirs(z, ($) => {
                if ($) return Y($);
                $u1.writeFile(A, q, K, Y)
            })
        })
    }

    function cM9(A, ...q) {
        let K = $B7.dirname(A);
        if ($u1.existsSync(K)) return $u1.writeFileSync(A, ...q);
        OB7.mkdirsSync(K), $u1.writeFileSync(A, ...q)
    }
    _B7.exports = {
        outputFile: UM9(dM9),
        outputFileSync: cM9
    }
})
// @from(Ln 220892, Col 4)
XB7 = R((i$w, JB7) => {
    var {
        stringify: lM9
    } = Yj1(), {
        outputFile: iM9
    } = n$6();
    async function nM9(A, q, K = {}) {
        let Y = lM9(q, K);
        await iM9(A, Y, K)
    }
    JB7.exports = nM9
})
// @from(Ln 220904, Col 4)
jB7 = R((n$w, DB7) => {
    var {
        stringify: rM9
    } = Yj1(), {
        outputFileSync: oM9
    } = n$6();

    function aM9(A, q, K) {
        let Y = rM9(q, K);
        oM9(A, Y, K)
    }
    DB7.exports = aM9
})
// @from(Ln 220917, Col 4)
PB7 = R((r$w, MB7) => {
    var sM9 = fH().fromPromise,
        vZ = HB7();
    vZ.outputJson = sM9(XB7());
    vZ.outputJsonSync = jB7();
    vZ.outputJSON = vZ.outputJson;
    vZ.outputJSONSync = vZ.outputJsonSync;
    vZ.writeJSON = vZ.writeJson;
    vZ.writeJSONSync = vZ.writeJsonSync;
    vZ.readJSON = vZ.readJson;
    vZ.readJSONSync = vZ.readJsonSync;
    MB7.exports = vZ
})
// @from(Ln 220930, Col 4)
VB7 = R((o$w, fB7) => {
    var tM9 = cz(),
        ADA = h1("path"),
        eM9 = U$6().copy,
        ZB7 = wu1().remove,
        AP9 = jh().mkdirp,
        qP9 = Pa().pathExists,
        WB7 = dq1();

    function KP9(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = {};
        K = K || {};
        let z = K.overwrite || K.clobber || !1;
        WB7.checkPaths(A, q, "move", K, (w, H) => {
            if (w) return Y(w);
            let {
                srcStat: $,
                isChangingCase: O = !1
            } = H;
            WB7.checkParentPaths(A, $, q, "move", (_) => {
                if (_) return Y(_);
                if (YP9(q)) return GB7(A, q, z, O, Y);
                AP9(ADA.dirname(q), (J) => {
                    if (J) return Y(J);
                    return GB7(A, q, z, O, Y)
                })
            })
        })
    }

    function YP9(A) {
        let q = ADA.dirname(A);
        return ADA.parse(q).root === q
    }

    function GB7(A, q, K, Y, z) {
        if (Y) return eXA(A, q, K, z);
        if (K) return ZB7(q, (w) => {
            if (w) return z(w);
            return eXA(A, q, K, z)
        });
        qP9(q, (w, H) => {
            if (w) return z(w);
            if (H) return z(Error("dest already exists."));
            return eXA(A, q, K, z)
        })
    }

    function eXA(A, q, K, Y) {
        tM9.rename(A, q, (z) => {
            if (!z) return Y();
            if (z.code !== "EXDEV") return Y(z);
            return zP9(A, q, K, Y)
        })
    }

    function zP9(A, q, K, Y) {
        eM9(A, q, {
            overwrite: K,
            errorOnExist: !0
        }, (w) => {
            if (w) return Y(w);
            return ZB7(A, Y)
        })
    }
    fB7.exports = KP9
})
// @from(Ln 220997, Col 4)
kB7 = R((a$w, EB7) => {
    var TB7 = cz(),
        KDA = h1("path"),
        wP9 = U$6().copySync,
        vB7 = wu1().removeSync,
        HP9 = jh().mkdirpSync,
        NB7 = dq1();

    function $P9(A, q, K) {
        K = K || {};
        let Y = K.overwrite || K.clobber || !1,
            {
                srcStat: z,
                isChangingCase: w = !1
            } = NB7.checkPathsSync(A, q, "move", K);
        if (NB7.checkParentPathsSync(A, z, q, "move"), !OP9(q)) HP9(KDA.dirname(q));
        return _P9(A, q, Y, w)
    }

    function OP9(A) {
        let q = KDA.dirname(A);
        return KDA.parse(q).root === q
    }

    function _P9(A, q, K, Y) {
        if (Y) return qDA(A, q, K);
        if (K) return vB7(q), qDA(A, q, K);
        if (TB7.existsSync(q)) throw Error("dest already exists.");
        return qDA(A, q, K)
    }

    function qDA(A, q, K) {
        try {
            TB7.renameSync(A, q)
        } catch (Y) {
            if (Y.code !== "EXDEV") throw Y;
            return JP9(A, q, K)
        }
    }

    function JP9(A, q, K) {
        return wP9(A, q, {
            overwrite: K,
            errorOnExist: !0
        }), vB7(A)
    }
    EB7.exports = $P9
})
// @from(Ln 221045, Col 4)
RB7 = R((s$w, LB7) => {
    var XP9 = fH().fromCallback;
    LB7.exports = {
        move: XP9(VB7()),
        moveSync: kB7()
    }
})
// @from(Ln 221052, Col 4)
CB7 = R((t$w, yB7) => {
    yB7.exports = {
        ...pq1(),
        ...U$6(),
        ...Eu7(),
        ...AB7(),
        ...PB7(),
        ...jh(),
        ...RB7(),
        ...n$6(),
        ...Pa(),
        ...wu1()
    }
})
// @from(Ln 221066, Col 4)
cq1 = R((YDA) => {
    var SB7 = fH().fromCallback,
        aV = cz(),
        DP9 = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((A) => {
            return typeof aV[A] === "function"
        });
    Object.assign(YDA, aV);
    DP9.forEach((A) => {
        YDA[A] = SB7(aV[A])
    });
    YDA.exists = function(A, q) {
        if (typeof q === "function") return aV.exists(A, q);
        return new Promise((K) => {
            return aV.exists(A, K)
        })
    };
    YDA.read = function(A, q, K, Y, z, w) {
        if (typeof w === "function") return aV.read(A, q, K, Y, z, w);
        return new Promise((H, $) => {
            aV.read(A, q, K, Y, z, (O, _, J) => {
                if (O) return $(O);
                H({
                    bytesRead: _,
                    buffer: J
                })
            })
        })
    };
    YDA.write = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return aV.write(A, q, ...K);
        return new Promise((Y, z) => {
            aV.write(A, q, ...K, (w, H, $) => {
                if (w) return z(w);
                Y({
                    bytesWritten: H,
                    buffer: $
                })
            })
        })
    };
    if (typeof aV.writev === "function") YDA.writev = function(A, q, ...K) {
        if (typeof K[K.length - 1] === "function") return aV.writev(A, q, ...K);
        return new Promise((Y, z) => {
            aV.writev(A, q, ...K, (w, H, $) => {
                if (w) return z(w);
                Y({
                    bytesWritten: H,
                    buffers: $
                })
            })
        })
    };
    if (typeof aV.realpath.native === "function") YDA.realpath.native = SB7(aV.realpath.native);
    else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003")
})
// @from(Ln 221121, Col 4)
IB7 = R((GP9, hB7) => {
    var WP9 = h1("path");
    GP9.checkPath = function(q) {
        if (process.platform === "win32") {
            if (/[<>:"|?*]/.test(q.replace(WP9.parse(q).root, ""))) {
                let Y = Error(`Path contains invalid characters: ${q}`);
                throw Y.code = "EINVAL", Y
            }
        }
    }
})
// @from(Ln 221132, Col 4)
BB7 = R((fP9, zDA) => {
    var xB7 = cq1(),
        {
            checkPath: bB7
        } = IB7(),
        uB7 = (A) => {
            let q = {
                mode: 511
            };
            if (typeof A === "number") return A;
            return {
                ...q,
                ...A
            }.mode
        };
    fP9.makeDir = async (A, q) => {
        return bB7(A), xB7.mkdir(A, {
            mode: uB7(q),
            recursive: !0
        })
    };
    fP9.makeDirSync = (A, q) => {
        return bB7(A), xB7.mkdirSync(A, {
            mode: uB7(q),
            recursive: !0
        })
    }
})
// @from(Ln 221160, Col 4)
Ph = R((KOw, mB7) => {
    var TP9 = fH().fromPromise,
        {
            makeDir: vP9,
            makeDirSync: wDA
        } = BB7(),
        HDA = TP9(vP9);
    mB7.exports = {
        mkdirs: HDA,
        mkdirsSync: wDA,
        mkdirp: HDA,
        mkdirpSync: wDA,
        ensureDir: HDA,
        ensureDirSync: wDA
    }
})
// @from(Ln 221176, Col 4)
fa = R((YOw, QB7) => {
    var EP9 = fH().fromPromise,
        FB7 = cq1();

    function kP9(A) {
        return FB7.access(A).then(() => !0).catch(() => !1)
    }
    QB7.exports = {
        pathExists: EP9(kP9),
        pathExistsSync: FB7.existsSync
    }
})
// @from(Ln 221188, Col 4)
$DA = R((zOw, gB7) => {
    var wj1 = cz();

    function LP9(A, q, K, Y) {
        wj1.open(A, "r+", (z, w) => {
            if (z) return Y(z);
            wj1.futimes(w, q, K, (H) => {
                wj1.close(w, ($) => {
                    if (Y) Y(H || $)
                })
            })
        })
    }

    function RP9(A, q, K) {
        let Y = wj1.openSync(A, "r+");
        return wj1.futimesSync(Y, q, K), wj1.closeSync(Y)
    }
    gB7.exports = {
        utimesMillis: LP9,
        utimesMillisSync: RP9
    }
})
// @from(Ln 221211, Col 4)
lq1 = R((wOw, dB7) => {
    var Hj1 = cq1(),
        t0 = h1("path"),
        yP9 = h1("util");

    function CP9(A, q, K) {
        let Y = K.dereference ? (z) => Hj1.stat(z, {
            bigint: !0
        }) : (z) => Hj1.lstat(z, {
            bigint: !0
        });
        return Promise.all([Y(A), Y(q).catch((z) => {
            if (z.code === "ENOENT") return null;
            throw z
        })]).then(([z, w]) => ({
            srcStat: z,
            destStat: w
        }))
    }

    function SP9(A, q, K) {
        let Y, z = K.dereference ? (H) => Hj1.statSync(H, {
                bigint: !0
            }) : (H) => Hj1.lstatSync(H, {
                bigint: !0
            }),
            w = z(A);
        try {
            Y = z(q)
        } catch (H) {
            if (H.code === "ENOENT") return {
                srcStat: w,
                destStat: null
            };
            throw H
        }
        return {
            srcStat: w,
            destStat: Y
        }
    }

    function hP9(A, q, K, Y, z) {
        yP9.callbackify(CP9)(A, q, Y, (w, H) => {
            if (w) return z(w);
            let {
                srcStat: $,
                destStat: O
            } = H;
            if (O) {
                if (Ou1($, O)) {
                    let _ = t0.basename(A),
                        J = t0.basename(q);
                    if (K === "move" && _ !== J && _.toLowerCase() === J.toLowerCase()) return z(null, {
                        srcStat: $,
                        destStat: O,
                        isChangingCase: !0
                    });
                    return z(Error("Source and destination must not be the same."))
                }
                if ($.isDirectory() && !O.isDirectory()) return z(Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`));
                if (!$.isDirectory() && O.isDirectory()) return z(Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`))
            }
            if ($.isDirectory() && ODA(A, q)) return z(Error(r$6(A, q, K)));
            return z(null, {
                srcStat: $,
                destStat: O
            })
        })
    }

    function IP9(A, q, K, Y) {
        let {
            srcStat: z,
            destStat: w
        } = SP9(A, q, Y);
        if (w) {
            if (Ou1(z, w)) {
                let H = t0.basename(A),
                    $ = t0.basename(q);
                if (K === "move" && H !== $ && H.toLowerCase() === $.toLowerCase()) return {
                    srcStat: z,
                    destStat: w,
                    isChangingCase: !0
                };
                throw Error("Source and destination must not be the same.")
            }
            if (z.isDirectory() && !w.isDirectory()) throw Error(`Cannot overwrite non-directory '${q}' with directory '${A}'.`);
            if (!z.isDirectory() && w.isDirectory()) throw Error(`Cannot overwrite directory '${q}' with non-directory '${A}'.`)
        }
        if (z.isDirectory() && ODA(A, q)) throw Error(r$6(A, q, K));
        return {
            srcStat: z,
            destStat: w
        }
    }

    function UB7(A, q, K, Y, z) {
        let w = t0.resolve(t0.dirname(A)),
            H = t0.resolve(t0.dirname(K));
        if (H === w || H === t0.parse(H).root) return z();
        Hj1.stat(H, {
            bigint: !0
        }, ($, O) => {
            if ($) {
                if ($.code === "ENOENT") return z();
                return z($)
            }
            if (Ou1(q, O)) return z(Error(r$6(A, K, Y)));
            return UB7(A, q, H, Y, z)
        })
    }

    function pB7(A, q, K, Y) {
        let z = t0.resolve(t0.dirname(A)),
            w = t0.resolve(t0.dirname(K));
        if (w === z || w === t0.parse(w).root) return;
        let H;
        try {
            H = Hj1.statSync(w, {
                bigint: !0
            })
        } catch ($) {
            if ($.code === "ENOENT") return;
            throw $
        }
        if (Ou1(q, H)) throw Error(r$6(A, K, Y));
        return pB7(A, q, w, Y)
    }

    function Ou1(A, q) {
        return q.ino && q.dev && q.ino === A.ino && q.dev === A.dev
    }

    function ODA(A, q) {
        let K = t0.resolve(A).split(t0.sep).filter((z) => z),
            Y = t0.resolve(q).split(t0.sep).filter((z) => z);
        return K.reduce((z, w, H) => z && Y[H] === w, !0)
    }

    function r$6(A, q, K) {
        return `Cannot ${K} '${A}' to a subdirectory of itself, '${q}'.`
    }
    dB7.exports = {
        checkPaths: hP9,
        checkPathsSync: IP9,
        checkParentPaths: UB7,
        checkParentPathsSync: pB7,
        isSrcSubdir: ODA,
        areIdentical: Ou1
    }
})