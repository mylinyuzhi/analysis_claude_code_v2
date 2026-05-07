
// @from(Ln 327077, Col 0)
async function g87() {
    let q = Nl();
    if (!process.execPath.includes(q.versions)) return;
    let K = HX6(process.execPath);
    try {
        let _ = tq8(q, K);
        if (await XX6(q.locks, {
                recursive: !0
            }), i36()) {
            if (!await s9K(K, _)) {
                d("tengu_version_lock_failed", {
                    is_pid_based: !0,
                    is_lifetime_lock: !0
                }), hp8(K, Error("Lock already held by another process"));
                return
            }
            d("tengu_version_lock_acquired", {
                is_pid_based: !0,
                is_lifetime_lock: !0
            }), E(`Acquired PID lock on running version: ${K}`)
        } else {
            let z;
            try {
                z = await Jj(K, {
                    stale: p87,
                    retries: 0,
                    lockfilePath: _,
                    onCompromised: (Y) => {
                        E(`NON-FATAL: Lock on running version was compromised: ${Y.message}`, {
                            level: "info"
                        })
                    }
                }), d("tengu_version_lock_acquired", {
                    is_pid_based: !1,
                    is_lifetime_lock: !0
                }), E(`Acquired mtime-based lock on running version: ${K}`), eq(async () => {
                    try {
                        await z?.()
                    } catch {}
                })
            } catch (Y) {
                if (t1(Y)) {
                    E(`Cannot lock current version - file does not exist: ${K}`, {
                        level: "info"
                    });
                    return
                }
                d("tengu_version_lock_failed", {
                    is_pid_based: !1,
                    is_lifetime_lock: !0
                }), hp8(K, Y);
                return
            }
        }
    } catch (_) {
        if (t1(_)) {
            E(`Cannot lock current version - file does not exist: ${K}`, {
                level: "info"
            });
            return
        }
        E(`NON-FATAL: Failed to lock current version during execution ${b6(_)}`, {
            level: "info"
        })
    }
}
// @from(Ln 327144, Col 0)
function hp8(q, K) {
    j6(Error(`NON-FATAL: Lock acquisition failed for ${q} (expected in multi-process scenarios)`, {
        cause: K
    }))
}
// @from(Ln 327149, Col 0)
async function xoz(q) {
    let K = Nl(),
        _ = tq8(K, q);
    try {
        await St(_), E(`Force-removed lock file at ${_}`)
    } catch (z) {
        E(`Failed to force-remove lock file: ${b6(z)}`)
    }
}
// @from(Ln 327158, Col 0)
async function eq8() {
    await Promise.resolve();
    let q = Nl(),
        K = Date.now() - 3600000;
    if (Vl().startsWith("win32")) {
        let A = r36(q.executable);
        try {
            let O = await yp8(A),
                w = 0;
            for (let $ of O) {
                if (!/^claude\.exe\.old\.\d+$/.test($)) continue;
                try {
                    await St(eP(A, $)), w++
                } catch {}
            }
            if (w > 0) E(`Cleaned up ${w} old Windows executables on startup`)
        } catch (O) {
            if (!t1(O)) E(`Failed to clean up old Windows executables: ${O}`)
        }
    }
    try {
        let A = await yp8(q.staging),
            O = 0;
        for (let w of A) {
            let $ = eP(q.staging, w);
            try {
                if ((await kl($)).mtime.getTime() < K) await Rp8($, {
                    recursive: !0,
                    force: !0
                }), O++, E(`Cleaned up old staging directory: ${w}`)
            } catch {}
        }
        if (O > 0) E(`Cleaned up ${O} orphaned staging directories`), d("tengu_native_staging_cleanup", {
            cleaned_count: O
        })
    } catch (A) {
        if (!t1(A)) E(`Failed to clean up staging directories: ${A}`)
    }
    if (i36()) {
        let A = Np8(q.locks);
        if (A > 0) E(`Cleaned up ${A} stale version locks`), d("tengu_native_stale_locks_cleanup", {
            cleaned_count: A
        })
    }
    let _;
    try {
        _ = await yp8(q.versions)
    } catch (A) {
        if (!t1(A)) E(`Failed to readdir versions directory: ${A}`);
        return
    }
    let z = [],
        Y = 0;
    for (let A of _) {
        let O = eP(q.versions, A);
        if (/\.tmp\.\d+\.\d+$/.test(A)) {
            try {
                if ((await kl(O)).mtime.getTime() < K) await St(O), Y++, E(`Cleaned up orphaned temp install file: ${A}`)
            } catch {}
            continue
        }
        try {
            let w = await kl(O);
            if (!w.isFile()) continue;
            if (process.platform !== "win32" && w.size > 0 && (w.mode & 73) === 0) continue;
            z.push({
                name: A,
                path: O,
                resolvedPath: HX6(O),
                mtime: w.mtime,
                size: w.size
            })
        } catch {}
    }
    if (Y > 0) E(`Cleaned up ${Y} orphaned temp install files`), d("tengu_native_temp_files_cleanup", {
        cleaned_count: Y
    });
    if (z.length === 0) return;
    try {
        let A = process.execPath,
            O = new Set;
        if (A && A.includes(q.versions)) O.add(HX6(A));
        let w = await Ioz(q.executable);
        if (w) O.add(w);
        else if (Vl().startsWith("win32")) try {
            let M = await kl(q.executable);
            for (let P of z)
                if (P.size === M.size) O.add(P.resolvedPath)
        } catch {}
        for (let M of z) {
            if (O.has(M.resolvedPath)) continue;
            let P = tq8(q, M.resolvedPath),
                W = !1;
            if (i36()) W = sq8(P);
            else try {
                W = await ZUq(M.resolvedPath, {
                    stale: p87,
                    lockfilePath: P
                })
            } catch {
                W = !1
            }
            if (W) O.add(M.resolvedPath), E(`Protecting locked version from cleanup: ${M.name}`)
        }
        let j = z.filter((M) => !O.has(M.resolvedPath)).sort((M, P) => P.mtime.getTime() - M.mtime.getTime()).slice(m87);
        if (j.length === 0) {
            d("tengu_native_version_cleanup", {
                total_count: z.length,
                deleted_count: 0,
                protected_count: O.size,
                retained_count: m87,
                lock_failed_count: 0,
                error_count: 0
            });
            return
        }
        let H = 0,
            J = 0,
            X = 0;
        await Promise.all(j.map(async (M) => {
            try {
                if (await O_K(M.path, async () => {
                        await St(M.path)
                    })) H++;
                else J++, E(`Skipping deletion of ${M.name} - locked by another process`)
            } catch (P) {
                X++, j6(Error(`Failed to delete version ${M.name}: ${P}`))
            }
        })), d("tengu_native_version_cleanup", {
            total_count: z.length,
            deleted_count: H,
            protected_count: O.size,
            retained_count: m87,
            lock_failed_count: J,
            error_count: X
        })
    } catch (A) {
        if (!t1(A)) j6(Error(`Version cleanup failed: ${A}`))
    }
}
// @from(Ln 327298, Col 0)
async function uoz(q) {
    let K = await Goz(q);
    return K.endsWith(".js") || K.includes("node_modules")
}
// @from(Ln 327302, Col 0)
async function q48() {
    let q = Nl();
    try {
        if (await uoz(q.executable)) {
            E(`Skipping removal of ${q.executable} - appears to be npm-managed`);
            return
        }
        await St(q.executable), E(`Removed claude symlink at ${q.executable}`)
    } catch (K) {
        if (t1(K)) return;
        j6(Error(`Failed to remove claude symlink: ${K}`))
    }
}
// @from(Ln 327315, Col 0)
async function U87() {
    let q = [],
        K = c36();
    for (let [_, z] of Object.entries(K)) try {
        let Y = await dq8(z);
        if (!Y) continue;
        let {
            filtered: A,
            hadAlias: O
        } = Hp8(Y);
        if (O) await Jp8(z, A), q.push({
            message: `Removed claude alias from ${z}. Run: unalias claude`,
            userActionRequired: !0,
            type: "alias"
        }), E(`Cleaned up claude alias from ${_} config`)
    } catch (Y) {
        j6(Y), q.push({
            message: `Failed to clean up ${z}: ${Y}`,
            userActionRequired: !1,
            type: "error"
        })
    }
    return q
}
// @from(Ln 327339, Col 0)
async function moz(q) {
    try {
        let K = await M7("npm", ["config", "get", "prefix"]);
        if (K.code !== 0 || !K.stdout) return {
            success: !1,
            error: "Failed to get npm global prefix"
        };
        let _ = K.stdout.trim(),
            z = !1;
        async function Y(A, O) {
            try {
                return await St(A), E(`Manually removed ${O}: ${A}`), !0
            } catch {
                return !1
            }
        }
        if (Vl().startsWith("win32")) {
            let A = eP(_, "claude.cmd"),
                O = eP(_, "claude.ps1"),
                w = eP(_, "claude");
            if (await Y(A, "bin script")) z = !0;
            if (await Y(O, "PowerShell script")) z = !0;
            if (await Y(w, "bin executable")) z = !0
        } else {
            let A = eP(_, "bin", "claude");
            if (await Y(A, "bin symlink")) z = !0
        }
        if (z) {
            E(`Successfully removed ${q} manually`);
            let A = Vl().startsWith("win32") ? eP(_, "node_modules", q) : eP(_, "lib", "node_modules", q);
            return {
                success: !0,
                warning: `${q} executables removed, but node_modules directory was left intact for safety. You may manually delete it later at: ${A}`
            }
        } else return {
            success: !1
        }
    } catch (K) {
        return E(`Manual removal failed: ${K}`, {
            level: "error"
        }), {
            success: !1,
            error: `Manual removal failed: ${K}`
        }
    }
}
// @from(Ln 327385, Col 0)
async function __K(q) {
    let {
        code: K,
        stderr: _
    } = await M7("npm", ["uninstall", "-g", q], {
        cwd: process.cwd()
    });
    if (K === 0) return E(`Removed global npm installation of ${q}`), {
        success: !0
    };
    else if (_ && !_.includes("npm ERR! code E404")) {
        if (_.includes("npm error code ENOTEMPTY")) {
            E(`Failed to uninstall global npm package ${q}: ${_}`, {
                level: "error"
            }), E("Attempting manual removal due to ENOTEMPTY error");
            let z = await moz(q);
            if (z.success) return {
                success: !0,
                warning: z.warning
            };
            else if (z.error) return {
                success: !1,
                error: `Failed to remove global npm installation of ${q}: ${_}. Manual removal also failed: ${z.error}`
            }
        }
        return E(`Failed to uninstall global npm package ${q}: ${_}`, {
            level: "error"
        }), {
            success: !1,
            error: `Failed to remove global npm installation of ${q}: ${_}`
        }
    }
    return {
        success: !1
    }
}
// @from(Ln 327421, Col 0)
async function Q87() {
    let q = [],
        K = [],
        _ = 0,
        z = await __K("@anthropic-ai/claude-code");
    if (z.success) {
        if (_++, z.warning) K.push(z.warning)
    } else if (z.error) q.push(z.error);
    if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.PACKAGE_URL !== "@anthropic-ai/claude-code") {
        let A = await __K({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.PACKAGE_URL);
        if (A.success) {
            if (_++, A.warning) K.push(A.warning)
        } else if (A.error) q.push(A.error)
    }
    let Y = eP(Y_K(), ".claude", "local");
    try {
        await Rp8(Y, {
            recursive: !0
        }), _++, E(`Removed local installation at ${Y}`)
    } catch (A) {
        if (!t1(A)) q.push(`Failed to remove ${Y}: ${A}`), E(`Failed to remove local installation: ${A}`, {
            level: "error"
        })
    }
    return {
        removed: _,
        errors: q,
        warnings: K
    }
}
// @from(Ln 327472, Col 4)
A_K
// @from(Ln 327472, Col 9)
m87 = 2
// @from(Ln 327473, Col 4)
p87 = 604800000
// @from(Ln 327474, Col 4)
Eoz
// @from(Ln 327474, Col 9)
Ep8 = null
// @from(Ln 327475, Col 4)
x87 = L(() => {
    B1();
    C8();
    ht();
    R9();
    h1();
    K8();
    n36();
    D_();
    w46();
    Q8();
    m8();
    Q4();
    OX6();
    U8();
    Xp8();
    aq8();
    I87();
    u87();
    A_K = K6(Pd(), 1), Eoz = process.platform === "darwin" && process.arch === "x64" && Woz("sysctl", ["-n", "sysctl.proc_translated"], {
        encoding: "utf8"
    }).stdout?.trim() === "1"
})
// @from(Ln 327498, Col 4)
El = L(() => {
    x87()
})
// @from(Ln 327502, Col 0)
function o36(q) {
    let K = [];
    return {
        expanded: q.replace(/\$\{([^}]+)\}/g, (z, Y) => {
            let A = Y.indexOf(":-"),
                O = A === -1 ? Y : Y.slice(0, A),
                w = A === -1 ? void 0 : Y.slice(A + 2),
                $ = process.env[O];
            if ($ !== void 0) return $;
            if (w !== void 0) return w;
            return K.push(O), z
        }),
        missingVars: K
    }
}
// @from(Ln 327520, Col 0)
async function j_K(q, K, _) {
    try {
        E(`Loading MCP servers from MCPB: ${K}`);
        let z = q.repository,
            Y = await P88(K, q.path, z, (w) => {
                E(`MCPB [${q.name}]: ${w}`)
            });
        if ("status" in Y && Y.status === "needs-config") return E(`MCPB ${K} requires user configuration. ` + `User can configure via: /plugin → Manage plugins → ${q.name} → Configure`), null;
        let A = Y,
            O = A.manifest.name;
        return E(`Loaded MCP server "${O}" from MCPB (extracted to ${A.extractedPath})`), {
            [O]: A.mcpConfig
        }
    } catch (z) {
        let Y = b6(z);
        E(`Failed to load MCPB ${K}: ${Y}`, {
            level: "error"
        });
        let A = q.repository;
        if (K.startsWith("http") && (Y.includes("download") || Y.includes("network"))) _.push({
            type: "mcpb-download-failed",
            source: A,
            plugin: q.name,
            url: K,
            reason: Y
        });
        else if (Y.includes("manifest") || Y.includes("user configuration")) _.push({
            type: "mcpb-invalid-manifest",
            source: A,
            plugin: q.name,
            mcpbPath: K,
            validationError: Y
        });
        else _.push({
            type: "mcpb-extract-failed",
            source: A,
            plugin: q.name,
            mcpbPath: K,
            reason: Y
        });
        return null
    }
}
// @from(Ln 327563, Col 0)
async function yl(q, K = []) {
    let _ = {},
        z = await d87(q.path, ".mcp.json");
    if (z) _ = {
        ..._,
        ...z
    };
    if (q.manifest.mcpServers) {
        let Y = q.manifest.mcpServers;
        if (typeof Y === "string")
            if (Zx(Y)) {
                let A = await j_K(q, Y, K);
                if (A) _ = {
                    ..._,
                    ...A
                }
            } else {
                let A = await d87(q.path, Y);
                if (A) _ = {
                    ..._,
                    ...A
                }
            }
        else if (Array.isArray(Y)) {
            let A = await Promise.all(Y.map(async (O) => {
                try {
                    if (typeof O === "string") {
                        if (Zx(O)) return await j_K(q, O, K);
                        return await d87(q.path, O)
                    }
                    return O
                } catch (w) {
                    return E(`Failed to load MCP servers from spec for plugin ${q.name}: ${w}`, {
                        level: "error"
                    }), null
                }
            }));
            for (let O of A)
                if (O) _ = {
                    ..._,
                    ...O
                }
        } else _ = {
            ..._,
            ...Y
        }
    }
    return Object.keys(_).length > 0 ? _ : void 0
}
// @from(Ln 327612, Col 0)
async function d87(q, K) {
    let _ = V8(),
        z = Boz(q, K),
        Y;
    try {
        Y = await _.readFile(z, {
            encoding: "utf-8"
        })
    } catch (A) {
        if (t1(A)) return null;
        return E(`Failed to load MCP servers from ${z}: ${A}`, {
            level: "error"
        }), null
    }
    try {
        let A = n8(Y),
            O = A.mcpServers || A,
            w = {};
        for (let [$, j] of Object.entries(O)) {
            let H = GU().safeParse(j);
            if (H.success) w[$] = H.data;
            else E(`Invalid MCP server config for ${$} in ${z}: ${H.error.message}`, {
                level: "error"
            })
        }
        return w
    } catch (A) {
        return E(`Failed to load MCP servers from ${z}: ${A}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 327645, Col 0)
function H_K(q) {
    let K = q.manifest.channels;
    if (!K || K.length === 0) return [];
    let _ = q.repository,
        z = [];
    for (let Y of K) {
        if (!Y.userConfig || Object.keys(Y.userConfig).length === 0) continue;
        let A = IH6(_, Y.server) ?? {};
        if (!xH6(A, Y.userConfig).valid) z.push({
            server: Y.server,
            displayName: Y.displayName ?? Y.server,
            configSchema: Y.userConfig
        })
    }
    return z
}
// @from(Ln 327662, Col 0)
function poz(q, K) {
    if (!q.manifest.channels?.find((z) => z.server === K)?.userConfig) return;
    return IH6(q.repository, K) ?? void 0
}
// @from(Ln 327667, Col 0)
function Foz(q, K, _) {
    let z = {};
    for (let [Y, A] of Object.entries(q)) {
        let O = `plugin:${K}:${Y}`,
            w = {
                ...A,
                scope: "dynamic",
                pluginSource: _
            };
        z[O] = w
    }
    return z
}
// @from(Ln 327681, Col 0)
function goz(q, K) {
    let _ = q.manifest.userConfig ? ID(uH6(q)) : void 0,
        z = poz(q, K);
    if (!_ && !z) return;
    return {
        ..._,
        ...z
    }
}
// @from(Ln 327691, Col 0)
function Uoz(q, K, _, z, Y, A) {
    let O = [],
        w = (j) => {
            let H = fx(j, K);
            if (_) H = I56(H, _);
            let {
                expanded: J,
                missingVars: X
            } = o36(H);
            return O.push(...X), J
        },
        $;
    switch (q.type) {
        case void 0:
        case "stdio": {
            let j = {
                ...q
            };
            if (j.command) j.command = w(j.command);
            if (j.args) j.args = j.args.map((J) => w(J));
            let H = {
                CLAUDE_PLUGIN_ROOT: K.path,
                CLAUDE_PLUGIN_DATA: Is(K.source),
                ...j.env || {}
            };
            for (let [J, X] of Object.entries(H))
                if (J !== "CLAUDE_PLUGIN_ROOT" && J !== "CLAUDE_PLUGIN_DATA") H[J] = w(X);
            j.env = H, $ = j;
            break
        }
        case "sse":
        case "http":
        case "ws": {
            let j = {
                ...q
            };
            if (j.url) j.url = w(j.url);
            if (j.headers) {
                let H = {};
                for (let [J, X] of Object.entries(j.headers)) H[J] = w(X);
                j.headers = H
            }
            $ = j;
            break
        }
        case "sse-ide":
        case "ws-ide":
        case "sdk":
        case "claudeai-proxy":
            $ = q;
            break
    }
    if (z && O.length > 0) {
        let H = F4(O).join(", ");
        if (E(`Missing environment variables in plugin MCP config: ${H}`, {
                level: "warn"
            }), Y && A) z.push({
            type: "mcp-config-invalid",
            source: K.source,
            plugin: Y,
            serverName: A,
            validationError: `Missing environment variables: ${H}`
        })
    }
    return $
}
// @from(Ln 327757, Col 0)
async function J_K(q, K = []) {
    if (!q.enabled) return;
    let _ = q.mcpServers || await yl(q, K);
    if (!_) return;
    let z = {};
    for (let [Y, A] of Object.entries(_)) {
        let O = goz(q, Y);
        try {
            z[Y] = Uoz(A, q, O, K, q.name, Y)
        } catch (w) {
            K?.push({
                type: "generic-error",
                source: Y,
                plugin: q.name,
                error: b6(w)
            })
        }
    }
    return Foz(z, q.name, q.source)
}
// @from(Ln 327777, Col 4)
WX6 = L(() => {
    FA6();
    K8();
    m8();
    Yq();
    e8();
    W88();
    Jy();
    Gx()
})
// @from(Ln 327788, Col 0)
function X_K() {
    DX6.cache.clear?.(), Sp8()
}
// @from(Ln 327792, Col 0)
function c87(q) {
    d8((K) => {
        let _ = K.claudeAiMcpEverConnected ?? [];
        if (_.includes(q)) return K;
        return {
            ...K,
            claudeAiMcpEverConnected: [..._, q]
        }
    })
}
// @from(Ln 327803, Col 0)
function l87(q) {
    return (H8().claudeAiMcpEverConnected ?? []).includes(q)
}
// @from(Ln 327806, Col 4)
Qoz = 5000
// @from(Ln 327807, Col 4)
doz = "mcp-servers-2025-12-04"
// @from(Ln 327808, Col 4)
DX6
// @from(Ln 327809, Col 4)
tS6 = L(() => {
    CK();
    U4();
    z3();
    C8();
    T7();
    h1();
    K8();
    Q8();
    oW();
    DX6 = P1(async () => {
        try {
            if (c5(process.env.ENABLE_CLAUDEAI_MCP_SERVERS)) return E("[claudeai-mcp] Disabled via env var"), d("tengu_claudeai_mcp_eligibility", {
                state: "disabled_env_var"
            }), {};
            let q = o7();
            if (!q?.accessToken) return E("[claudeai-mcp] No access token"), d("tengu_claudeai_mcp_eligibility", {
                state: "no_oauth_token"
            }), {};
            if (!q.scopes?.includes("user:mcp_servers")) return E(`[claudeai-mcp] Missing user:mcp_servers scope (scopes=${q.scopes?.join(",")||"none"})`), d("tengu_claudeai_mcp_eligibility", {
                state: "missing_scope"
            }), {};
            let _ = `${r7().BASE_API_URL}/v1/mcp_servers?limit=1000`;
            E(`[claudeai-mcp] Fetching from ${_}`);
            let z = await Z1.get(_, {
                    headers: {
                        Authorization: `Bearer ${q.accessToken}`,
                        "Content-Type": "application/json",
                        "anthropic-beta": doz,
                        "anthropic-version": "2023-06-01"
                    },
                    timeout: Qoz
                }),
                Y = {},
                A = new Set;
            for (let O of z.data.data) {
                let w = `claude.ai ${O.display_name}`,
                    $ = w,
                    j = Pw($),
                    H = 1;
                while (A.has(j)) H++, $ = `${w} (${H})`, j = Pw($);
                A.add(j), Y[$] = {
                    type: "claudeai-proxy",
                    url: O.url,
                    id: O.id,
                    scope: "claudeai"
                }
            }
            return E(`[claudeai-mcp] Fetched ${Object.keys(Y).length} servers`), d("tengu_claudeai_mcp_eligibility", {
                state: "eligible"
            }), Y
        } catch {
            return E("[claudeai-mcp] Fetch failed"), {}
        }
    })
})
// @from(Ln 327872, Col 0)
function Ll(q, K) {
    let _ = `mcp__${Pw(K)}__`;
    return q.filter((z) => z.name?.startsWith(_))
}
// @from(Ln 327877, Col 0)
function hl(q, K) {
    let _ = Pw(K),
        z = q.name;
    if (!z) return !1;
    return z.startsWith(`mcp__${_}__`) || z.startsWith(`${_}:`)
}
// @from(Ln 327884, Col 0)
function Cp8(q, K) {
    return q.filter((_) => hl(_, K) && !(_.type === "prompt" && _.loadedFrom === "mcp"))
}
// @from(Ln 327888, Col 0)
function bp8(q, K) {
    let _ = `mcp__${Pw(K)}__`;
    return q.filter((z) => !z.name?.startsWith(_))
}
// @from(Ln 327893, Col 0)
function eS6(q, K) {
    return q.filter((_) => !hl(_, K))
}
// @from(Ln 327897, Col 0)
function qC6(q, K) {
    let _ = {
        ...q
    };
    return delete _[K], _
}
// @from(Ln 327904, Col 0)
function M_K(q) {
    let {
        scope: K,
        ..._
    } = q, z = I6(_, (Y, A) => {
        if (A && typeof A === "object" && !Array.isArray(A)) {
            let O = A,
                w = {};
            for (let $ of Object.keys(O).sort()) w[$] = O[$];
            return w
        }
        return A
    });
    return coz("sha256").update(z).digest("hex").slice(0, 16)
}
// @from(Ln 327920, Col 0)
function P_K(q, K) {
    let _ = q.clients.filter((w) => {
        let $ = K[w.name];
        if (!$) return w.config.scope === "dynamic";
        return M_K(w.config) !== M_K($)
    });
    if (_.length === 0) return {
        ...q,
        stale: []
    };
    let {
        tools: z,
        commands: Y,
        resources: A
    } = q;
    for (let w of _) z = bp8(z, w.name), Y = eS6(Y, w.name), A = qC6(A, w.name);
    let O = new Set(_.map((w) => w.name));
    return {
        clients: q.clients.filter((w) => !O.has(w.name)),
        tools: z,
        commands: Y,
        resources: A,
        stale: _
    }
}
// @from(Ln 327946, Col 0)
function rk(q) {
    switch (q) {
        case "user":
            return QZ();
        case "project":
            return loz(b8(), ".mcp.json");
        case "local":
            return `${QZ()} [project: ${b8()}]`;
        case "dynamic":
            return "Dynamically configured";
        case "enterprise":
            return xp8();
        case "claudeai":
            return "claude.ai";
        default:
            return q
    }
}
// @from(Ln 327965, Col 0)
function K48(q) {
    switch (q) {
        case "local":
            return "Local config (private to you in this project)";
        case "project":
            return "Project config (shared via .mcp.json)";
        case "user":
            return "User config (available in all your projects)";
        case "dynamic":
            return "Dynamic config (from command line)";
        case "enterprise":
            return "Enterprise config (managed by your organization)";
        case "claudeai":
            return "claude.ai config";
        default:
            return q
    }
}
// @from(Ln 327984, Col 0)
function KC6(q) {
    if (!q) return "local";
    if (!OO1().options.includes(q)) throw Error(`Invalid scope: ${q}. Must be one of: ${OO1().options.join(", ")}`);
    return q
}
// @from(Ln 327990, Col 0)
function W_K(q) {
    if (!q) return "stdio";
    if (q !== "stdio" && q !== "sse" && q !== "http") throw Error(`Invalid transport type: ${q}. Must be one of: stdio, sse, http`);
    return q
}
// @from(Ln 327996, Col 0)
function n87(q) {
    let K = {};
    for (let _ of q) {
        let z = _.indexOf(":");
        if (z === -1) throw Error(`Invalid header format: "${_}". Expected format: "Header-Name: value"`);
        let Y = _.substring(0, z).trim(),
            A = _.substring(z + 1).trim();
        if (!Y) throw Error(`Invalid header: "${_}". Header name cannot be empty.`);
        K[Y] = A
    }
    return K
}
// @from(Ln 328009, Col 0)
function Ip8(q) {
    let K = y7(),
        _ = Pw(q);
    if (K?.disabledMcpjsonServers?.some((z) => Pw(z) === _)) return "rejected";
    if (K?.enabledMcpjsonServers?.some((z) => Pw(z) === _) || K?.enableAllProjectMcpServers) return "approved";
    if (dA6() && L2("projectSettings")) return "approved";
    if (I7() && L2("projectSettings")) return "approved";
    return "pending"
}
// @from(Ln 328019, Col 0)
function i87(q) {
    if (!yJ({
            name: q
        })) return null;
    let K = Cm(q);
    if (!K) return null;
    let _ = my(K.serverName);
    if (!_ && K.serverName.startsWith("claude_ai_")) return "claudeai";
    return _?.scope ?? null
}
// @from(Ln 328030, Col 0)
function noz(q) {
    return q.type === "stdio" || q.type === void 0
}
// @from(Ln 328034, Col 0)
function ioz(q) {
    return q.type === "sse"
}
// @from(Ln 328038, Col 0)
function roz(q) {
    return q.type === "http"
}
// @from(Ln 328042, Col 0)
function ooz(q) {
    return q.type === "ws"
}
// @from(Ln 328046, Col 0)
function D_K(q) {
    let K = new Map;
    for (let z of q) {
        if (!z.mcpServers?.length) continue;
        for (let Y of z.mcpServers) {
            if (typeof Y === "string") continue;
            let A = Object.entries(Y);
            if (A.length !== 1) continue;
            let [O, w] = A[0], $ = K.get(O);
            if ($) {
                if (!$.sourceAgents.includes(z.agentType)) $.sourceAgents.push(z.agentType)
            } else K.set(O, {
                config: {
                    ...w,
                    name: O
                },
                sourceAgents: [z.agentType]
            })
        }
    }
    let _ = [];
    for (let [z, {
            config: Y,
            sourceAgents: A
        }] of K)
        if (noz(Y)) _.push({
            name: z,
            sourceAgents: A,
            transport: "stdio",
            command: Y.command,
            needsAuth: !1
        });
        else if (ioz(Y)) _.push({
        name: z,
        sourceAgents: A,
        transport: "sse",
        url: Y.url,
        needsAuth: !0
    });
    else if (roz(Y)) _.push({
        name: z,
        sourceAgents: A,
        transport: "http",
        url: Y.url,
        needsAuth: !0
    });
    else if (ooz(Y)) _.push({
        name: z,
        sourceAgents: A,
        transport: "ws",
        url: Y.url,
        needsAuth: !1
    });
    return _.sort((z, Y) => z.name.localeCompare(Y.name))
}
// @from(Ln 328102, Col 0)
function uy(q) {
    if (!("url" in q) || typeof q.url !== "string") return;
    try {
        let K = new URL(q.url);
        return K.search = "", K.toString().replace(/\/$/, "")
    } catch {
        return
    }
}
// @from(Ln 328111, Col 4)
iD = L(() => {
    y8();
    n7();
    D_();
    aY();
    a1();
    e8();
    rD();
    fh();
    FA6()
})
// @from(Ln 328135, Col 0)
function xp8() {
    return up8(SW(), "managed-mcp.json")
}
// @from(Ln 328139, Col 0)
function _48(q, K) {
    if (!q) return {};
    let _ = {};
    for (let [z, Y] of Object.entries(q)) _[z] = {
        ...Y,
        scope: K
    };
    return _
}
// @from(Ln 328148, Col 0)
async function f_K(q) {
    let K = up8(b8(), ".mcp.json"),
        _;
    try {
        _ = (await eoz(K)).mode
    } catch (A) {
        if (Q1(A) !== "ENOENT") throw A
    }
    let z = `${K}.tmp.${process.pid}.${Date.now()}`,
        Y = await soz(z, "w", _ ?? 420);
    try {
        await Y.writeFile(I6(q, null, 2), {
            encoding: "utf8"
        }), await Y.datasync()
    } finally {
        await Y.close()
    }
    try {
        if (_ !== void 0) await aoz(z, _);
        await toz(z, K)
    } catch (A) {
        try {
            await qaz(z)
        } catch {}
        throw A
    }
}
// @from(Ln 328176, Col 0)
function mp8(q) {
    if (q.type !== void 0 && q.type !== "stdio") return null;
    let K = q;
    return [K.command, ...K.args ?? []]
}
// @from(Ln 328182, Col 0)
function G_K(q, K) {
    if (q.length !== K.length) return !1;
    return q.every((_, z) => _ === K[z])
}
// @from(Ln 328187, Col 0)
function Bp8(q) {
    return "url" in q ? q.url : null
}
// @from(Ln 328191, Col 0)
function v_K(q) {
    if (!zaz.some((K) => q.includes(K))) return q;
    try {
        return new URL(q).searchParams.get("mcp_url") || q
    } catch {
        return q
    }
}
// @from(Ln 328200, Col 0)
function a36(q) {
    let K = mp8(q);
    if (K) return `stdio:${I6(K)}`;
    let _ = Bp8(q);
    if (_) return `url:${v_K(_)}`;
    return null
}
// @from(Ln 328208, Col 0)
function Yaz(q, K) {
    let _ = new Map;
    for (let [O, w] of Object.entries(K)) {
        let $ = a36(w);
        if ($ && !_.has($)) _.set($, O)
    }
    let z = {},
        Y = [],
        A = new Map;
    for (let [O, w] of Object.entries(q)) {
        let $ = a36(w);
        if ($ === null) {
            z[O] = w;
            continue
        }
        let j = _.get($);
        if (j !== void 0) {
            E(`Suppressing plugin MCP server "${O}": duplicates manually-configured "${j}"`), Y.push({
                name: O,
                duplicateOf: j
            });
            continue
        }
        let H = A.get($);
        if (H !== void 0) {
            E(`Suppressing plugin MCP server "${O}": duplicates earlier plugin server "${H}"`), Y.push({
                name: O,
                duplicateOf: H
            });
            continue
        }
        A.set($, O), z[O] = w
    }
    return {
        servers: z,
        suppressed: Y
    }
}
// @from(Ln 328247, Col 0)
function Aaz(q) {
    let K = Bp8(q);
    if (K) return v_K(K);
    let _ = mp8(q);
    if (_) return _.join(" ");
    return q.type ?? "unknown"
}
// @from(Ln 328255, Col 0)
function T_K(q) {
    let K = new Map;
    for (let {
            scope: z,
            servers: Y
        }
        of q)
        for (let [A, O] of Object.entries(Y)) {
            let w = a36(O);
            if (!w) continue;
            let $ = K.get(A);
            if (!$) K.set(A, $ = []);
            $.push({
                scope: z,
                sig: w,
                endpoint: Aaz(O)
            })
        }
    let _ = [];
    for (let [z, Y] of K) {
        if (Y.length < 2) continue;
        if (new Set(Y.map((A) => A.sig)).size < 2) continue;
        _.push({
            path: `mcpServers.${z}`,
            message: `Server "${z}" is defined in multiple scopes with different endpoints: ${Y.map((A)=>`${A.scope} (${A.endpoint})`).join(", ")}. OAuth tokens are stored per endpoint, so authenticating in one context will not carry over.`,
            severity: "warning",
            suggestion: `Keep the correct endpoint and remove the others: ${Y.map((A)=>`\`claude mcp remove ${z} -s ${A.scope}\``).join(" or ")}`,
            mcpErrorMetadata: {
                scope: Y[0].scope,
                serverName: z,
                severity: "warning"
            }
        })
    }
    return _
}
// @from(Ln 328292, Col 0)
function Y48(q, K) {
    let _ = new Map;
    for (let [A, O] of Object.entries(K)) {
        if (ZT(A)) continue;
        let w = a36(O);
        if (w && !_.has(w)) _.set(w, A)
    }
    let z = {},
        Y = [];
    for (let [A, O] of Object.entries(q)) {
        let w = a36(O),
            $ = w !== null ? _.get(w) : void 0;
        if ($ !== void 0) {
            E(`Suppressing claude.ai connector "${A}": duplicates manually-configured "${$}"`), Y.push({
                name: A,
                duplicateOf: $
            });
            continue
        }
        z[A] = O
    }
    return {
        servers: z,
        suppressed: Y
    }
}
// @from(Ln 328319, Col 0)
function Oaz(q) {
    let _ = q.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*");
    return new RegExp(`^${_}$`)
}
// @from(Ln 328324, Col 0)
function V_K(q, K) {
    return Oaz(K).test(q)
}
// @from(Ln 328328, Col 0)
function waz() {
    if (Haz()) return E1("policySettings") ?? {};
    return v7()
}
// @from(Ln 328333, Col 0)
function $az() {
    return v7()
}
// @from(Ln 328337, Col 0)
function k_K(q, K) {
    let _ = $az();
    if (!_.deniedMcpServers) return !1;
    for (let z of _.deniedMcpServers)
        if (AG6(z) && z.serverName === q) return !0;
    if (K) {
        let z = mp8(K);
        if (z) {
            for (let A of _.deniedMcpServers)
                if (VX8(A) && G_K(A.serverCommand, z)) return !0
        }
        let Y = Bp8(K);
        if (Y) {
            for (let A of _.deniedMcpServers)
                if (kX8(A) && V_K(Y, A.serverUrl)) return !0
        }
    }
    return !1
}
// @from(Ln 328357, Col 0)
function _C6(q, K) {
    if (k_K(q, K)) return !1;
    let _ = waz();
    if (!_.allowedMcpServers) return !0;
    if (_.allowedMcpServers.length === 0) return !1;
    let z = _.allowedMcpServers.some(VX8),
        Y = _.allowedMcpServers.some(kX8);
    if (K) {
        let A = mp8(K),
            O = Bp8(K);
        if (A)
            if (z) {
                for (let w of _.allowedMcpServers)
                    if (VX8(w) && G_K(w.serverCommand, A)) return !0;
                return !1
            } else {
                for (let w of _.allowedMcpServers)
                    if (AG6(w) && w.serverName === q) return !0;
                return !1
            }
        else if (O)
            if (Y) {
                for (let w of _.allowedMcpServers)
                    if (kX8(w) && V_K(O, w.serverUrl)) return !0;
                return !1
            } else {
                for (let w of _.allowedMcpServers)
                    if (AG6(w) && w.serverName === q) return !0;
                return !1
            }
        else {
            for (let w of _.allowedMcpServers)
                if (AG6(w) && w.serverName === q) return !0;
            return !1
        }
    }
    for (let A of _.allowedMcpServers)
        if (AG6(A) && A.serverName === q) return !0;
    return !1
}
// @from(Ln 328398, Col 0)
function s36(q) {
    let K = {},
        _ = [];
    for (let [z, Y] of Object.entries(q)) {
        let A = Y;
        if (A.type === "sdk" || _C6(z, A)) K[z] = Y;
        else _.push(z)
    }
    return {
        allowed: K,
        blocked: _
    }
}
// @from(Ln 328412, Col 0)
function jaz(q) {
    let K = [];

    function _(Y) {
        let {
            expanded: A,
            missingVars: O
        } = o36(Y);
        return K.push(...O), A
    }
    let z;
    switch (q.type) {
        case void 0:
        case "stdio": {
            let Y = q;
            z = {
                ...Y,
                command: _(Y.command),
                args: Y.args.map(_),
                env: Y.env ? c0(Y.env, _) : void 0
            };
            break
        }
        case "sse":
        case "http":
        case "ws": {
            let Y = q;
            z = {
                ...Y,
                url: _(Y.url),
                headers: Y.headers ? c0(Y.headers, _) : void 0
            };
            break
        }
        case "sse-ide":
        case "ws-ide":
            z = q;
            break;
        case "sdk":
            z = q;
            break;
        case "claudeai-proxy":
            z = q;
            break
    }
    return {
        expanded: z,
        missingVars: F4(K)
    }
}
// @from(Ln 328462, Col 0)
async function t36(q, K, _) {
    if (q.match(/[^a-zA-Z0-9_-]/)) throw Error(`Invalid name ${q}. Names can only contain letters, numbers, hyphens, and underscores.`);
    if (rH6(q)) throw Error(`Cannot add MCP server "${q}": this name is reserved.`);
    if (_$6(q)) throw Error(`Cannot add MCP server "${q}": this name is reserved.`);
    if (e36()) throw Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
    let z = GU().safeParse(K);
    if (!z.success) {
        let A = z.error.issues.map((O) => `${O.path.join(".")}: ${O.message}`).join(", ");
        throw Error(`Invalid configuration: ${A}`)
    }
    let Y = z.data;
    if (k_K(q, Y)) throw Error(`Cannot add MCP server "${q}": server is explicitly blocked by enterprise policy`);
    if (!_C6(q, Y)) throw Error(`Cannot add MCP server "${q}": not allowed by enterprise policy`);
    switch (_) {
        case "project": {
            let {
                servers: A
            } = r87();
            if (A[q]) throw Error(`MCP server ${q} already exists in .mcp.json`);
            break
        }
        case "user": {
            if (H8().mcpServers?.[q]) throw Error(`MCP server ${q} already exists in user config`);
            break
        }
        case "local": {
            if (Ew().mcpServers?.[q]) throw Error(`MCP server ${q} already exists in local config`);
            break
        }
        case "dynamic":
            throw Error("Cannot add MCP server to scope: dynamic");
        case "enterprise":
            throw Error("Cannot add MCP server to scope: enterprise");
        case "claudeai":
            throw Error("Cannot add MCP server to scope: claudeai")
    }
    switch (_) {
        case "project": {
            let {
                servers: A
            } = r87(), O = {};
            for (let [$, j] of Object.entries(A)) {
                let {
                    scope: H,
                    ...J
                } = j;
                O[$] = J
            }
            O[q] = Y;
            let w = {
                mcpServers: O
            };
            try {
                await f_K(w)
            } catch ($) {
                throw Error(`Failed to write to .mcp.json: ${$}`)
            }
            break
        }
        case "user": {
            d8((A) => ({
                ...A,
                mcpServers: {
                    ...A.mcpServers,
                    [q]: Y
                }
            }));
            break
        }
        case "local": {
            u2((A) => ({
                ...A,
                mcpServers: {
                    ...A.mcpServers,
                    [q]: Y
                }
            }));
            break
        }
        default:
            throw Error(`Cannot add MCP server to scope: ${_}`)
    }
}
// @from(Ln 328545, Col 0)
async function a87(q, K) {
    switch (K) {
        case "project": {
            let {
                servers: _
            } = r87();
            if (!_[q]) throw Error(`No MCP server found with name: ${q} in .mcp.json`);
            let z = {};
            for (let [A, O] of Object.entries(_))
                if (A !== q) {
                    let {
                        scope: w,
                        ...$
                    } = O;
                    z[A] = $
                } let Y = {
                mcpServers: z
            };
            try {
                await f_K(Y)
            } catch (A) {
                throw Error(`Failed to remove from .mcp.json: ${A}`)
            }
            break
        }
        case "user": {
            if (!H8().mcpServers?.[q]) throw Error(`No user-scoped MCP server found with name: ${q}`);
            d8((z) => {
                let {
                    [q]: Y, ...A
                } = z.mcpServers ?? {};
                return {
                    ...z,
                    mcpServers: A
                }
            });
            break
        }
        case "local": {
            if (!Ew().mcpServers?.[q]) throw Error(`No project-local MCP server found with name: ${q}`);
            u2((z) => {
                let {
                    [q]: Y, ...A
                } = z.mcpServers ?? {};
                return {
                    ...z,
                    mcpServers: A
                }
            });
            break
        }
        default:
            throw Error(`Cannot remove MCP server from scope: ${K}`)
    }
}
// @from(Ln 328601, Col 0)
function r87() {
    if (!L2("projectSettings")) return {
        servers: {},
        errors: []
    };
    let q = up8(b8(), ".mcp.json"),
        {
            config: K,
            errors: _
        } = zC6({
            filePath: q,
            expandVars: !0,
            scope: "project"
        });
    if (!K) {
        let z = _.filter((Y) => !Y.message.startsWith("MCP config file not found"));
        if (z.length > 0) return E(`MCP config errors for ${q}: ${I6(z.map((Y)=>Y.message))}`, {
            level: "error"
        }), {
            servers: {},
            errors: z
        };
        return {
            servers: {},
            errors: []
        }
    }
    return {
        servers: K.mcpServers ? _48(K.mcpServers, "project") : {},
        errors: _ || []
    }
}
// @from(Ln 328634, Col 0)
function SJ(q) {
    let K = {
        project: "projectSettings",
        user: "userSettings",
        local: "localSettings"
    };
    if (q in K && !L2(K[q])) return {
        servers: {},
        errors: []
    };
    switch (q) {
        case "project": {
            let _ = {},
                z = [],
                Y = [],
                A = b8();
            while (A !== _az(A).root) Y.push(A), A = Kaz(A);
            for (let O of Y.reverse()) {
                let w = up8(O, ".mcp.json"),
                    {
                        config: $,
                        errors: j
                    } = zC6({
                        filePath: w,
                        expandVars: !0,
                        scope: "project"
                    });
                if (!$) {
                    let H = j.filter((J) => !J.message.startsWith("MCP config file not found"));
                    if (H.length > 0) E(`MCP config errors for ${w}: ${I6(H.map((J)=>J.message))}`, {
                        level: "error"
                    }), z.push(...H);
                    continue
                }
                if ($.mcpServers) Object.assign(_, _48($.mcpServers, q));
                if (j.length > 0) z.push(...j)
            }
            return {
                servers: _,
                errors: z
            }
        }
        case "user": {
            let _ = H8().mcpServers;
            if (!_) return {
                servers: {},
                errors: []
            };
            let {
                config: z,
                errors: Y
            } = z48({
                configObject: {
                    mcpServers: _
                },
                expandVars: !0,
                scope: "user"
            });
            return {
                servers: _48(z?.mcpServers, q),
                errors: Y
            }
        }
        case "local": {
            let _ = Ew().mcpServers;
            if (!_) return {
                servers: {},
                errors: []
            };
            let {
                config: z,
                errors: Y
            } = z48({
                configObject: {
                    mcpServers: _
                },
                expandVars: !0,
                scope: "local"
            });
            return {
                servers: _48(z?.mcpServers, q),
                errors: Y
            }
        }
        case "enterprise": {
            let _ = xp8(),
                {
                    config: z,
                    errors: Y
                } = zC6({
                    filePath: _,
                    expandVars: !0,
                    scope: "enterprise"
                });
            if (!z) {
                let A = Y.filter((O) => !O.message.startsWith("MCP config file not found"));
                if (A.length > 0) return E(`Enterprise MCP config errors for ${_}: ${I6(A.map((O)=>O.message))}`, {
                    level: "error"
                }), {
                    servers: {},
                    errors: A
                };
                return {
                    servers: {},
                    errors: []
                }
            }
            return {
                servers: _48(z.mcpServers, q),
                errors: Y
            }
        }
    }
}
// @from(Ln 328749, Col 0)
function my(q) {
    let {
        servers: K
    } = SJ("enterprise");
    if (HT("mcp")) return K[q] ?? null;
    let {
        servers: _
    } = SJ("user"), {
        servers: z
    } = SJ("project"), {
        servers: Y
    } = SJ("local");
    if (K[q]) return K[q];
    if (Y[q]) return Y[q];
    if (z[q]) return z[q];
    if (_[q]) return _[q];
    return null
}
// @from(Ln 328767, Col 0)
async function ZX6(q = {}) {
    let {
        servers: K
    } = SJ("enterprise");
    if (e36()) {
        let f = {};
        for (let [v, V] of Object.entries(K)) {
            if (!_C6(v, V)) continue;
            f[v] = V
        }
        return {
            servers: f,
            errors: []
        }
    }
    let _ = HT("mcp"),
        z = {
            servers: {}
        },
        {
            servers: Y
        } = _ ? z : SJ("user"),
        {
            servers: A
        } = _ ? z : SJ("project"),
        {
            servers: O
        } = _ ? z : SJ("local"),
        w = {},
        $ = await Gj(),
        j = [];
    if ($.errors.length > 0)
        for (let f of $.errors)
            if (f.type === "mcp-config-invalid" || f.type === "mcpb-download-failed" || f.type === "mcpb-extract-failed" || f.type === "mcpb-invalid-manifest") {
                let v = `Plugin MCP loading error - ${f.type}: ${GH(f)}`;
                j6(Error(v))
            } else {
                let v = f.type;
                E(`Plugin not available for MCP: ${f.source} - error type: ${v}`)
            } let H = await Promise.all($.enabled.map((f) => J_K(f, j)));
    for (let f of H)
        if (f) Object.assign(w, f);
    if (j.length > 0)
        for (let f of j) {
            let v = `Plugin MCP server error - ${f.type}: ${GH(f)}`;
            j6(Error(v))
        }
    let J = {};
    for (let [f, v] of Object.entries(A))
        if (Ip8(f) === "approved") J[f] = v;
    let X = {};
    for (let [f, v] of Object.entries({
            ...Y,
            ...J,
            ...O,
            ...q
        }))
        if (!ZT(f) && _C6(f, v)) X[f] = v;
    let M = {},
        P = {};
    for (let [f, v] of Object.entries(w))
        if (ZT(f) || !_C6(f, v)) P[f] = v;
        else M[f] = v;
    let {
        servers: W,
        suppressed: D
    } = Yaz(M, X);
    Object.assign(W, P);
    for (let {
            name: f,
            duplicateOf: v
        }
        of D) {
        let V = f.split(":");
        if (V[0] !== "plugin" || V.length < 3) continue;
        j.push({
            type: "mcp-server-suppressed-duplicate",
            source: f,
            plugin: V[1],
            serverName: V.slice(2).join(":"),
            duplicateOf: v
        })
    }
    let Z = Object.assign({}, W, Y, J, O),
        G = {};
    for (let [f, v] of Object.entries(Z)) {
        if (!_C6(f, v)) continue;
        G[f] = v
    }
    return {
        servers: G,
        errors: j
    }
}
// @from(Ln 328861, Col 0)
async function Ct() {
    if (e36()) return ZX6();
    let q = DX6(),
        {
            servers: K,
            errors: _
        } = await ZX6(),
        {
            allowed: z
        } = s36(await q),
        {
            servers: Y
        } = Y48(z, K);
    return {
        servers: Object.assign({}, Y, K),
        errors: _
    }
}
// @from(Ln 328880, Col 0)
function z48(q) {
    let {
        configObject: K,
        expandVars: _,
        scope: z,
        filePath: Y
    } = q, A = fg7().safeParse(K);
    if (!A.success) return {
        config: null,
        errors: A.error.issues.map(($) => ({
            ...Y && {
                file: Y
            },
            path: $.path.join("."),
            message: "Does not adhere to MCP server configuration schema",
            mcpErrorMetadata: {
                scope: z,
                severity: "fatal"
            }
        }))
    };
    let O = [],
        w = {};
    for (let [$, j] of Object.entries(A.data.mcpServers)) {
        let H = j;
        if (_) {
            let {
                expanded: J,
                missingVars: X
            } = jaz(j);
            if (X.length > 0) O.push({
                ...Y && {
                    file: Y
                },
                path: `mcpServers.${$}`,
                message: `Missing environment variables: ${X.join(", ")}`,
                suggestion: `Set the following environment variables: ${X.join(", ")}`,
                mcpErrorMetadata: {
                    scope: z,
                    serverName: $,
                    severity: "warning"
                }
            });
            H = J
        }
        if (y1() === "windows" && (!H.type || H.type === "stdio") && (H.command === "npx" || H.command.endsWith("\\npx") || H.command.endsWith("/npx"))) O.push({
            ...Y && {
                file: Y
            },
            path: `mcpServers.${$}`,
            message: "Windows requires 'cmd /c' wrapper to execute npx",
            suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]. See: https://code.claude.com/docs/en/mcp#configure-mcp-servers',
            mcpErrorMetadata: {
                scope: z,
                serverName: $,
                severity: "warning"
            }
        });
        w[$] = H
    }
    return {
        config: {
            mcpServers: w
        },
        errors: O
    }
}
// @from(Ln 328948, Col 0)
function zC6(q) {
    let {
        filePath: K,
        expandVars: _,
        scope: z
    } = q, Y = V8(), A;
    try {
        A = Y.readFileSync(K, {
            encoding: "utf8"
        })
    } catch (w) {
        if (Q1(w) === "ENOENT") return {
            config: null,
            errors: [{
                file: K,
                path: "",
                message: `MCP config file not found: ${K}`,
                suggestion: "Check that the file path is correct",
                mcpErrorMetadata: {
                    scope: z,
                    severity: "fatal"
                }
            }]
        };
        return E(`MCP config read error for ${K} (scope=${z}): ${w}`, {
            level: "error"
        }), {
            config: null,
            errors: [{
                file: K,
                path: "",
                message: `Failed to read file: ${w}`,
                suggestion: "Check file permissions and ensure the file exists",
                mcpErrorMetadata: {
                    scope: z,
                    severity: "fatal"
                }
            }]
        }
    }
    let O = k5(A);
    if (!O) return E(`MCP config is not valid JSON: ${K} (scope=${z}, length=${A.length}, first100=${I6(A.slice(0,100))})`, {
        level: "error"
    }), {
        config: null,
        errors: [{
            file: K,
            path: "",
            message: "MCP config is not a valid JSON",
            suggestion: "Fix the JSON syntax errors in the file",
            mcpErrorMetadata: {
                scope: z,
                severity: "fatal"
            }
        }]
    };
    return z48({
        configObject: O,
        expandVars: _,
        scope: z,
        filePath: K
    })
}
// @from(Ln 329012, Col 0)
function Haz() {
    return E1("policySettings")?.allowManagedMcpServersOnly === !0
}
// @from(Ln 329016, Col 0)
function N_K(q) {
    return Object.values(q).every((K) => K.type === "sdk" && K.name === "claude-vscode")
}
// @from(Ln 329020, Col 0)
function o87(q) {
    return q === QE
}
// @from(Ln 329024, Col 0)
function ZT(q) {
    let K = Ew();
    if (o87(q)) return !(K.enabledMcpServers || []).includes(q);
    return (K.disabledMcpServers || []).includes(q)
}
// @from(Ln 329030, Col 0)
function Z_K(q, K, _) {
    if (q.includes(K) === _) return q;
    return _ ? [...q, K] : q.filter((Y) => Y !== K)
}
// @from(Ln 329035, Col 0)
function YC6(q, K) {
    let _ = o87(q) && ZT(q) === K;
    if (u2((z) => {
            if (o87(q)) {
                let O = z.enabledMcpServers || [],
                    w = Z_K(O, q, K);
                if (w === O) return z;
                return {
                    ...z,
                    enabledMcpServers: w
                }
            }
            let Y = z.disabledMcpServers || [],
                A = Z_K(Y, q, !K);
            if (A === Y) return z;
            return {
                ...z,
                disabledMcpServers: A
            }
        }), _) d("tengu_builtin_mcp_toggle", {
        serverName: q,
        enabled: K
    })
}
// @from(Ln 329059, Col 4)
zaz
// @from(Ln 329059, Col 9)
e36
// @from(Ln 329060, Col 4)
rD = L(() => {
    G16();
    U4();
    NK();
    ip();
    Va();
    h1();
    n7();
    K8();
    m8();
    Yq();
    mO();
    U8();
    WX6();
    vH();
    aY();
    Rm();
    jJ6();
    a1();
    Th();
    e8();
    C8();
    tS6();
    FA6();
    iD();
    zaz = ["/v2/session_ingress/shttp/mcp/", "/v2/ccr-sessions/"];
    e36 = P1(() => {
        let {
            config: q
        } = zC6({
            filePath: xp8(),
            expandVars: !0,
            scope: "enterprise"
        });
        return q !== null
    })
})
// @from(Ln 329098, Col 0)
function bt() {
    let q = bm(),
        _ = ["user", "project", "local"].flatMap((z) => SJ(z).errors);
    return {
        settings: q.settings,
        errors: [...q.errors, ..._]
    }
}
// @from(Ln 329106, Col 4)
A48 = L(() => {
    rD();
    a1()
})
// @from(Ln 329111, Col 0)
function E_K() {
    return []
}
// @from(Ln 329115, Col 0)
function y_K(q, K = null, _) {
    let z = q?.find((Y) => Y.name === "ide");
    if (K) {
        let Y = kH(K.ideType),
            A = Up(K.ideType) ? "plugin" : "extension";
        if (K.error) return [{
            label: "IDE",
            value: s87.createElement(T, null, d7("error", _)(e6.cross), " Error installing ", Y, " ", A, ": ", K.error, `
`, "Please restart your IDE and try again.")
        }];
        if (K.installed)
            if (z && z.type === "connected")
                if (K.installedVersion !== z.serverInfo?.version) return [{
                    label: "IDE",
                    value: `Connected to ${Y} ${A} version ${K.installedVersion} (server version: ${z.serverInfo?.version})`
                }];
                else return [{
                    label: "IDE",
                    value: `Connected to ${Y} ${A} version ${K.installedVersion}`
                }];
        else return [{
            label: "IDE",
            value: `Installed ${Y} ${A}`
        }]
    } else if (z) {
        let Y = yn1(z) ?? "IDE";
        if (z.type === "connected") return [{
            label: "IDE",
            value: `Connected to ${Y} extension`
        }];
        else return [{
            label: "IDE",
            value: `${d7("error",_)(e6.cross)} Not connected to ${Y}`
        }]
    }
    return []
}
// @from(Ln 329153, Col 0)
function L_K(q = [], K) {
    let _ = q.filter((A) => A.name !== "ide");
    if (!_.length) return [];
    let z = {
        connected: 0,
        pending: 0,
        needsAuth: 0,
        failed: 0
    };
    for (let A of _)
        if (A.type === "connected") z.connected++;
        else if (A.type === "pending") z.pending++;
    else if (A.type === "needs-auth") z.needsAuth++;
    else z.failed++;
    let Y = [];
    if (z.connected) Y.push(d7("success", K)(`${z.connected} connected`));
    if (z.needsAuth) Y.push(d7("warning", K)(`${z.needsAuth} need auth`));
    if (z.pending) Y.push(d7("inactive", K)(`${z.pending} pending`));
    if (z.failed) Y.push(d7("error", K)(`${z.failed} failed`));
    return [{
        label: "MCP servers",
        value: `${Y.join(", ")} ${d7("inactive",K)("· /mcp")}`
    }]
}
// @from(Ln 329177, Col 0)
async function h_K() {
    let q = await GJ(),
        K = QK6(q),
        _ = [];
    return K.forEach((z) => {
        let Y = S3(z.path);
        _.push(`Large ${Y} will impact performance (${iK(z.content.length)} chars > ${iK(Oc)})`)
    }), _
}
// @from(Ln 329187, Col 0)
function R_K() {
    return [{
        label: "Setting sources",
        value: Er().filter((z) => {
            let Y = E1(z);
            return Y !== null && Object.keys(Y).length > 0
        }).map((z) => {
            if (z === "policySettings") {
                let Y = UO1();
                if (Y === null) return null;
                switch (Y) {
                    case "remote":
                        return "Enterprise managed settings (remote)";
                    case "plist":
                        return "Enterprise managed settings (plist)";
                    case "hklm":
                        return "Enterprise managed settings (HKLM)";
                    case "file": {
                        let {
                            hasBase: A,
                            hasDropIns: O
                        } = gO1();
                        if (A && O) return "Enterprise managed settings (file + drop-ins)";
                        if (O) return "Enterprise managed settings (drop-ins)";
                        return "Enterprise managed settings (file)"
                    }
                    case "hkcu":
                        return "Enterprise managed settings (HKCU)"
                }
            }
            return pF7(z)
        }).filter((z) => z !== null)
    }]
}
// @from(Ln 329221, Col 0)
async function S_K() {
    return (await MX6()).map((K) => K.message)
}
// @from(Ln 329224, Col 0)
async function C_K() {
    let q = await $X6(),
        K = [],
        {
            errors: _
        } = bt();
    if (_.length > 0) {
        let Y = F4(_.map((A) => A.file)).join(", ");
        K.push(`Found invalid settings files: ${Y}. They will be ignored.`)
    }
    if (q.warnings.forEach((z) => {
            K.push(z.issue)
        }), q.hasUpdatePermissions === !1) K.push("No write permissions for auto-updates (requires sudo)");
    return K
}
// @from(Ln 329240, Col 0)
function pp8() {
    let q = hk6();
    if (!q) return [];
    let K = [];
    if (q.subscription) K.push({
        label: "Login method",
        value: `${q.subscription} account`
    });
    if (q.tokenSource) K.push({
        label: "Auth token",
        value: q.tokenSource
    });
    if (q.apiKeySource) K.push({
        label: "API key",
        value: q.apiKeySource
    });
    if (q.organization && !process.env.IS_DEMO) K.push({
        label: "Organization",
        value: q.organization
    });
    if (q.email && !process.env.IS_DEMO) K.push({
        label: "Email",
        value: q.email
    });
    return K
}
// @from(Ln 329267, Col 0)
function Fp8() {
    let q = pq(),
        K = [],
        _ = {
            bedrock: "Amazon Bedrock",
            vertex: "Google Vertex AI",
            foundry: "Microsoft Foundry",
            anthropicAws: "Claude Platform on AWS",
            mantle: "Amazon Bedrock (Mantle)"
        };
    if (q !== "firstParty") {
        let A = KZ8(),
            O = A ? `${_[q]} + ${_[A]}` : _[q];
        K.push({
            label: "API provider",
            value: O
        })
    }
    if (q === "firstParty") {
        let A = process.env.ANTHROPIC_BASE_URL;
        if (A) K.push({
            label: "Anthropic base URL",
            value: A
        })
    } else if (q === "bedrock") {
        let A = process.env.ANTHROPIC_BEDROCK_BASE_URL;
        if (A) K.push({
            label: "Bedrock base URL",
            value: A
        });
        if (K.push({
                label: "AWS region",
                value: oL()
            }), S6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) K.push({
            value: "AWS auth skipped"
        })
    } else if (q === "vertex") {
        let A = process.env.ANTHROPIC_VERTEX_BASE_URL;
        if (A) K.push({
            label: "Vertex base URL",
            value: A
        });
        let O = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
        if (O) K.push({
            label: "GCP project",
            value: O
        });
        if (K.push({
                label: "Default region",
                value: zw8()
            }), S6(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) K.push({
            value: "GCP auth skipped"
        })
    } else if (q === "foundry") {
        let A = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
        if (A) K.push({
            label: "Microsoft Foundry base URL",
            value: A
        });
        let O = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
        if (O) K.push({
            label: "Microsoft Foundry resource",
            value: O
        });
        if (S6(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) K.push({
            value: "Microsoft Foundry auth skipped"
        })
    } else if (q === "anthropicAws") {
        let A = process.env.ANTHROPIC_AWS_BASE_URL;
        if (A) K.push({
            label: "Claude Platform on AWS base URL",
            value: A
        });
        let O = process.env.ANTHROPIC_AWS_WORKSPACE_ID;
        if (O) K.push({
            label: "Workspace ID",
            value: O
        });
        if (K.push({
                label: "AWS region",
                value: oL()
            }), S6(process.env.CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH)) K.push({
            value: "Claude Platform on AWS auth skipped"
        })
    }
    if (q === "mantle" || KZ8() === "mantle") {
        let A = process.env.ANTHROPIC_BEDROCK_MANTLE_BASE_URL;
        if (A) K.push({
            label: "Amazon Bedrock (Mantle) base URL",
            value: A
        });
        if (q === "mantle") K.push({
            label: "AWS region",
            value: oL()
        });
        if (S6(process.env.CLAUDE_CODE_SKIP_MANTLE_AUTH)) K.push({
            value: "Amazon Bedrock (Mantle) auth skipped"
        })
    }
    let z = ME();
    if (z) K.push({
        label: "Proxy",
        value: z
    });
    let Y = $b();
    if (process.env.NODE_EXTRA_CA_CERTS) K.push({
        label: "Additional CA cert(s)",
        value: process.env.NODE_EXTRA_CA_CERTS
    });
    if (Y) {
        if (Y.cert && process.env.CLAUDE_CODE_CLIENT_CERT) K.push({
            label: "mTLS client cert",
            value: process.env.CLAUDE_CODE_CLIENT_CERT
        });
        if (Y.key && process.env.CLAUDE_CODE_CLIENT_KEY) K.push({
            label: "mTLS client key",
            value: process.env.CLAUDE_CODE_CLIENT_KEY
        })
    }
    return K
}
// @from(Ln 329389, Col 0)
function b_K(q) {
    let K = hE(q);
    if (q === null && i7()) {
        let _ = uT6();
        K = `${Y8.bold("Default")} ${_}`
    }
    return K
}
// @from(Ln 329397, Col 4)
s87
// @from(Ln 329398, Col 4)
t87 = L(() => {
    Y3();
    Qq();
    g6();
    T7();
    PM();
    n36();
    Q8();
    eK();
    c7();
    kj();
    Sq();
    x9();
    Qm();
    El();
    _M();
    yY();
    A48();
    aY();
    a1();
    s87 = K6(P6(), 1)
})
// @from(Ln 329420, Col 4)
gp8 = {}
// @from(Ln 329427, Col 0)
async function fX6(q) {
    await pq8({
        clearOnboarding: !1
    });
    let K = q.profile ?? await JQ(q.accessToken);
    if (K) DT6({
        accountUuid: K.account.uuid,
        emailAddress: K.account.email,
        organizationUuid: K.organization.uuid,
        displayName: K.account.display_name || void 0,
        hasExtraUsageEnabled: K.organization.has_extra_usage_enabled ?? void 0,
        billingType: K.organization.billing_type ?? void 0,
        subscriptionCreatedAt: K.organization.subscription_created_at ?? void 0,
        accountCreatedAt: K.account.created_at
    });
    else if (q.tokenAccount) DT6({
        accountUuid: q.tokenAccount.uuid,
        emailAddress: q.tokenAccount.emailAddress,
        organizationUuid: q.tokenAccount.organizationUuid
    });
    let _ = yk6(q);
    if (Nk6(), _.warning) d("tengu_oauth_storage_warning", {
        warning: _.warning
    });
    if (await Qf1(q.accessToken).catch((z) => E(String(z), {
            level: "error"
        })), ub(q.scopes)) await G9K().catch((z) => E(String(z), {
        level: "error"
    }));
    else if (!await df1(q.accessToken)) throw Error("Unable to create API key. The server accepted the request but did not return a key.");
    await $p8()
}
// @from(Ln 329459, Col 0)
async function Jaz({
    email: q,
    sso: K,
    console: _,
    claudeai: z
}) {
    if (_ && z) process.stderr.write(`Error: --console and --claudeai cannot be used together.
`), process.exit(1);
    let Y = v7(),
        A = Y.forceLoginMethod ? Y.forceLoginMethod === "claudeai" : !_,
        O = typeof Y.forceLoginOrgUUID === "string" ? Y.forceLoginOrgUUID : void 0,
        w = process.env.CLAUDE_CODE_OAUTH_REFRESH_TOKEN;
    if (w) {
        let H = process.env.CLAUDE_CODE_OAUTH_SCOPES;
        if (!H) process.stderr.write(`CLAUDE_CODE_OAUTH_SCOPES is required when using CLAUDE_CODE_OAUTH_REFRESH_TOKEN.
Set it to the space-separated scopes the refresh token was issued with
(e.g. "user:inference" or "user:profile user:inference user:sessions:claude_code user:mcp_servers").
`), process.exit(1);
        let J = H.split(/\s+/).filter(Boolean);
        try {
            d("tengu_login_from_refresh_token", {});
            let X = await ll6(w, {
                scopes: J
            });
            await fX6(X);
            let M = await Ma();
            if (!M.valid) process.stderr.write(M.message + `
`), process.exit(1);
            d8((P) => {
                if (P.hasCompletedOnboarding) return P;
                return {
                    ...P,
                    hasCompletedOnboarding: !0
                }
            }), d("tengu_oauth_success", {
                loginWithClaudeAi: ub(X.scopes)
            }), process.stdout.write(`Login successful.
`), process.exit(0)
        } catch (X) {
            j6(X);
            let M = GK6(X);
            process.stderr.write(`Login failed: ${b6(X)}
${M?M+`
`:""}`), process.exit(1)
        }
    }
    let $ = K ? "sso" : void 0,
        j = new Et;
    try {
        d("tengu_oauth_flow_start", {
            loginWithClaudeAi: A
        });
        let H = await j.startOAuthFlow(async (X) => {
            process.stdout.write(`Opening browser to sign in…
`), process.stdout.write(`If the browser didn't open, visit: ${X}
`)
        }, {
            loginWithClaudeAi: A,
            loginHint: q,
            loginMethod: $,
            orgUUID: O
        });
        await fX6(H);
        let J = await Ma();
        if (!J.valid) process.stderr.write(J.message + `
`), process.exit(1);
        d("tengu_oauth_success", {
            loginWithClaudeAi: A
        }), process.stdout.write(`Login successful.
`), process.exit(0)
    } catch (H) {
        j6(H);
        let J = GK6(H);
        process.stderr.write(`Login failed: ${b6(H)}
${J?J+`
`:""}`), process.exit(1)
    } finally {
        j.cleanup()
    }
}
// @from(Ln 329539, Col 0)
async function Xaz(q, K) {
    let {
        source: _,
        hasToken: z
    } = xb(), {
        source: Y
    } = Vw(), A = !!process.env.ANTHROPIC_API_KEY && !CZ(), O = k_(), w = MK(), $ = z46(), j = z || Y !== "none" || A || $, H = "none";
    if ($) H = "third_party";
    else if (_ === "claude.ai") H = "claude.ai";
    else if (_ === "apiKeyHelper") H = "api_key_helper";
    else if (_ !== "none") H = "oauth_token";
    else if (Y === "ANTHROPIC_API_KEY" || A) H = "api_key";
    else if (Y === "/login managed key") H = "claude.ai";
    let J;
    if (K.text) {
        let X = [...pp8(), ...Fp8()],
            M = [];
        for (let P of X) {
            let W = typeof P.value === "string" ? P.value : Array.isArray(P.value) ? P.value.join(", ") : null;
            if (W === null || W === "none") continue;
            M.push(P.label ? `${P.label}: ${W}` : W)
        }
        if (M.length === 0 && A) M.push("API key: ANTHROPIC_API_KEY");
        if (!j) M.push("Not logged in. Run claude auth login to authenticate.");
        J = AC6.default.createElement(T, null, M.join(`
`))
    } else {
        let X = pq(),
            M = Y !== "none" ? Y : A ? "ANTHROPIC_API_KEY" : null,
            P = {
                loggedIn: j,
                authMethod: H,
                apiProvider: X
            };
        if (M) P.apiKeySource = M;
        if (H === "claude.ai") P.email = O?.emailAddress ?? null, P.orgId = O?.organizationUuid ?? null, P.orgName = O?.organizationName ?? null, P.subscriptionType = w ?? null;
        J = AC6.default.createElement(T, null, I6(P, null, 2))
    }
    q.render(AC6.default.createElement(qw, null, J)), await q.waitUntilExit(), process.exit(j ? 0 : 1)
}
// @from(Ln 329579, Col 0)
async function Maz(q) {
    try {
        await pq8({
            clearOnboarding: !1
        })
    } catch {
        process.stderr.write(`Failed to log out.
`), process.exit(1)
    }
    q.render(AC6.default.createElement(qw, null, AC6.default.createElement(T, null, "Successfully logged out from your Anthropic account."))), await q.waitUntilExit()
}
// @from(Ln 329590, Col 4)
AC6
// @from(Ln 329591, Col 4)
OC6 = L(() => {
    G87();
    g6();
    C8();
    Ws();
    v9K();
    YD();
    WT6();
    Fq8();
    T7();
    h1();
    K8();
    Q8();
    m8();
    U8();
    x9();
    a1();
    e8();
    yt();
    t87();
    AC6 = K6(P6(), 1)
})
// @from(Ln 329613, Col 4)
vX6 = p((Naz) => {
    function Paz(q, K, _) {
        if (_ === void 0) _ = Array.prototype;
        if (q && typeof _.find === "function") return _.find.call(q, K);
        for (var z = 0; z < q.length; z++)
            if (GX6(q, z)) {
                var Y = q[z];
                if (K.call(void 0, Y, z, q)) return Y
            }
    }

    function wC6(q, K) {
        if (K === void 0) K = Object;
        if (K && typeof K.getOwnPropertyDescriptors === "function") q = K.create(null, K.getOwnPropertyDescriptors(q));
        return K && typeof K.freeze === "function" ? K.freeze(q) : q
    }

    function GX6(q, K) {
        return Object.prototype.hasOwnProperty.call(q, K)
    }

    function Waz(q, K) {
        if (q === null || typeof q !== "object") throw TypeError("target is not an object");
        for (var _ in K)
            if (GX6(K, _)) q[_] = K[_];
        return q
    }
    var I_K = wC6({
        allowfullscreen: !0,
        async: !0,
        autofocus: !0,
        autoplay: !0,
        checked: !0,
        controls: !0,
        default: !0,
        defer: !0,
        disabled: !0,
        formnovalidate: !0,
        hidden: !0,
        ismap: !0,
        itemscope: !0,
        loop: !0,
        multiple: !0,
        muted: !0,
        nomodule: !0,
        novalidate: !0,
        open: !0,
        playsinline: !0,
        readonly: !0,
        required: !0,
        reversed: !0,
        selected: !0
    });

    function Daz(q) {
        return GX6(I_K, q.toLowerCase())
    }
    var x_K = wC6({
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    });

    function Zaz(q) {
        return GX6(x_K, q.toLowerCase())
    }
    var O48 = wC6({
        script: !1,
        style: !1,
        textarea: !0,
        title: !0
    });

    function faz(q) {
        var K = q.toLowerCase();
        return GX6(O48, K) && !O48[K]
    }

    function Gaz(q) {
        var K = q.toLowerCase();
        return GX6(O48, K) && O48[K]
    }

    function u_K(q) {
        return q === w48.HTML
    }

    function vaz(q) {
        return u_K(q) || q === w48.XML_XHTML_APPLICATION
    }
    var w48 = wC6({
            HTML: "text/html",
            XML_APPLICATION: "application/xml",
            XML_TEXT: "text/xml",
            XML_XHTML_APPLICATION: "application/xhtml+xml",
            XML_SVG_IMAGE: "image/svg+xml"
        }),
        Taz = Object.keys(w48).map(function(q) {
            return w48[q]
        });

    function Vaz(q) {
        return Taz.indexOf(q) > -1
    }
    var kaz = wC6({
        HTML: "http://www.w3.org/1999/xhtml",
        SVG: "http://www.w3.org/2000/svg",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/"
    });
    Naz.assign = Waz;
    Naz.find = Paz;
    Naz.freeze = wC6;
    Naz.HTML_BOOLEAN_ATTRIBUTES = I_K;
    Naz.HTML_RAW_TEXT_ELEMENTS = O48;
    Naz.HTML_VOID_ELEMENTS = x_K;
    Naz.hasDefaultHTMLNamespace = vaz;
    Naz.hasOwn = GX6;
    Naz.isHTMLBooleanAttribute = Daz;
    Naz.isHTMLRawTextElement = faz;
    Naz.isHTMLEscapableRawTextElement = Gaz;
    Naz.isHTMLMimeType = u_K;
    Naz.isHTMLVoidElement = Zaz;
    Naz.isValidMimeType = Vaz;
    Naz.MIME_TYPE = w48;
    Naz.NAMESPACE = kaz
})
// @from(Ln 329751, Col 4)
H48 = p((daz) => {
    var Uaz = vX6();

    function m_K(q, K) {
        q.prototype = Object.create(Error.prototype, {
            constructor: {
                value: q
            },
            name: {
                value: q.name,
                enumerable: !0,
                writable: K
            }
        })
    }
    var $48 = Uaz.freeze({
            Error: "Error",
            IndexSizeError: "IndexSizeError",
            DomstringSizeError: "DomstringSizeError",
            HierarchyRequestError: "HierarchyRequestError",
            WrongDocumentError: "WrongDocumentError",
            InvalidCharacterError: "InvalidCharacterError",
            NoDataAllowedError: "NoDataAllowedError",
            NoModificationAllowedError: "NoModificationAllowedError",
            NotFoundError: "NotFoundError",
            NotSupportedError: "NotSupportedError",
            InUseAttributeError: "InUseAttributeError",
            InvalidStateError: "InvalidStateError",
            SyntaxError: "SyntaxError",
            InvalidModificationError: "InvalidModificationError",
            NamespaceError: "NamespaceError",
            InvalidAccessError: "InvalidAccessError",
            ValidationError: "ValidationError",
            TypeMismatchError: "TypeMismatchError",
            SecurityError: "SecurityError",
            NetworkError: "NetworkError",
            AbortError: "AbortError",
            URLMismatchError: "URLMismatchError",
            QuotaExceededError: "QuotaExceededError",
            TimeoutError: "TimeoutError",
            InvalidNodeTypeError: "InvalidNodeTypeError",
            DataCloneError: "DataCloneError",
            EncodingError: "EncodingError",
            NotReadableError: "NotReadableError",
            UnknownError: "UnknownError",
            ConstraintError: "ConstraintError",
            DataError: "DataError",
            TransactionInactiveError: "TransactionInactiveError",
            ReadOnlyError: "ReadOnlyError",
            VersionError: "VersionError",
            OperationError: "OperationError",
            NotAllowedError: "NotAllowedError",
            OptOutError: "OptOutError"
        }),
        B_K = Object.keys($48);

    function p_K(q) {
        return typeof q === "number" && q >= 1 && q <= 25
    }

    function Qaz(q) {
        return typeof q === "string" && q.substring(q.length - $48.Error.length) === $48.Error
    }

    function j48(q, K) {
        if (p_K(q)) this.name = B_K[q], this.message = K || "";
        else this.message = q, this.name = Qaz(K) ? K : $48.Error;
        if (Error.captureStackTrace) Error.captureStackTrace(this, j48)
    }
    m_K(j48, !0);
    Object.defineProperties(j48.prototype, {
        code: {
            enumerable: !0,
            get: function() {
                var q = B_K.indexOf(this.name);
                if (p_K(q)) return q;
                return 0
            }
        }
    });
    var F_K = {
            INDEX_SIZE_ERR: 1,
            DOMSTRING_SIZE_ERR: 2,
            HIERARCHY_REQUEST_ERR: 3,
            WRONG_DOCUMENT_ERR: 4,
            INVALID_CHARACTER_ERR: 5,
            NO_DATA_ALLOWED_ERR: 6,
            NO_MODIFICATION_ALLOWED_ERR: 7,
            NOT_FOUND_ERR: 8,
            NOT_SUPPORTED_ERR: 9,
            INUSE_ATTRIBUTE_ERR: 10,
            INVALID_STATE_ERR: 11,
            SYNTAX_ERR: 12,
            INVALID_MODIFICATION_ERR: 13,
            NAMESPACE_ERR: 14,
            INVALID_ACCESS_ERR: 15,
            VALIDATION_ERR: 16,
            TYPE_MISMATCH_ERR: 17,
            SECURITY_ERR: 18,
            NETWORK_ERR: 19,
            ABORT_ERR: 20,
            URL_MISMATCH_ERR: 21,
            QUOTA_EXCEEDED_ERR: 22,
            TIMEOUT_ERR: 23,
            INVALID_NODE_TYPE_ERR: 24,
            DATA_CLONE_ERR: 25
        },
        e87 = Object.entries(F_K);
    for ($C6 = 0; $C6 < e87.length; $C6++) q17 = e87[$C6][0], j48[q17] = e87[$C6][1];
    var q17, $C6;

    function K17(q, K) {
        if (this.message = q, this.locator = K, Error.captureStackTrace) Error.captureStackTrace(this, K17)
    }
    m_K(K17);
    daz.DOMException = j48;
    daz.DOMExceptionName = $48;
    daz.ExceptionCode = F_K;
    daz.ParseError = K17
})
// @from(Ln 329871, Col 4)
$17 = p((Usz) => {
    function n_K(q) {
        try {
            if (typeof q !== "function") q = RegExp;
            var K = new q("\uD834\uDF06", "u").exec("\uD834\uDF06");
            return !!K && K[0].length === 2
        } catch (_) {}
        return !1
    }
    var W48 = n_K();

    function TX6(q) {
        if (q.source[0] !== "[") throw Error(q + " can not be used with chars");
        return q.source.slice(1, q.source.lastIndexOf("]"))
    }

    function jC6(q, K) {
        if (q.source[0] !== "[") throw Error("/" + q.source + "/ can not be used with chars_without");
        if (!K || typeof K !== "string") throw Error(JSON.stringify(K) + " is not a valid search");
        if (q.source.indexOf(K) === -1) throw Error('"' + K + '" is not is /' + q.source + "/");
        if (K === "-" && q.source.indexOf(K) !== 1) throw Error('"' + K + '" is not at the first postion of /' + q.source + "/");
        return new RegExp(q.source.replace(K, ""), W48 ? "u" : "")
    }

    function gz(q) {
        var K = this;
        return new RegExp(Array.prototype.slice.call(arguments).map(function(_) {
            var z = typeof _ === "string";
            if (z && K === void 0 && _ === "|") throw Error("use regg instead of reg to wrap expressions with `|`!");
            return z ? _ : _.source
        }).join(""), W48 ? "mu" : "m")
    }

    function l3(q) {
        if (arguments.length === 0) throw Error("no parameters provided");
        return gz.apply(l3, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]))
    }
    var raz = "�",
        VX6 = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
    if (W48) VX6 = gz("[", TX6(VX6), "\\u{10000}-\\u{10FFFF}", "]");
    var z17 = /[\x20\x09\x0D\x0A]/,
        oaz = TX6(z17),
        bw = gz(z17, "+"),
        CJ = gz(z17, "*"),
        J48 = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    if (W48) J48 = gz("[", TX6(J48), "\\u{10000}-\\u{10FFFF}", "]");
    var aaz = TX6(J48),
        Y17 = gz("[", aaz, TX6(/[-.0-9\xB7]/), TX6(/[\u0300-\u036F\u203F-\u2040]/), "]"),
        dx = gz(J48, Y17, "*"),
        g_K = gz(Y17, "+"),
        saz = gz("&", dx, ";"),
        taz = l3(/&#[0-9]+;|&#x[0-9a-fA-F]+;/),
        X48 = l3(saz, "|", taz),
        M48 = gz("%", dx, ";"),
        A17 = l3(gz('"', l3(/[^%&"]/, "|", M48, "|", X48), "*", '"'), "|", gz("'", l3(/[^%&']/, "|", M48, "|", X48), "*", "'")),
        eaz = l3('"', l3(/[^<&"]/, "|", X48), "*", '"', "|", "'", l3(/[^<&']/, "|", X48), "*", "'"),
        qsz = jC6(J48, ":"),
        Ksz = jC6(Y17, ":"),
        U_K = gz(qsz, Ksz, "*"),
        D48 = gz(U_K, l3(":", U_K), "?"),
        _sz = gz("^", D48, "$"),
        zsz = gz("(", D48, ")"),
        P48 = l3(/"[^"]*"|'[^']*'/),
        Ysz = gz(/^<\?/, "(", dx, ")", l3(bw, "(", VX6, "*?)"), "?", /\?>/),
        Q_K = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/,
        Up8 = l3('"', Q_K, '*"', "|", "'", jC6(Q_K, "'"), "*'"),
        i_K = "<!--",
        r_K = "-->",
        Asz = gz(i_K, l3(jC6(VX6, "-"), "|", gz("-", jC6(VX6, "-"))), "*", r_K),
        d_K = "#PCDATA",
        Osz = l3(gz(/\(/, CJ, d_K, l3(CJ, /\|/, CJ, D48), "*", CJ, /\)\*/), "|", gz(/\(/, CJ, d_K, CJ, /\)/)),
        wsz = /[?*+]?/,
        $sz = gz(/\([^>]+\)/, wsz),
        jsz = l3("EMPTY", "|", "ANY", "|", Osz, "|", $sz),
        Hsz = "<!ELEMENT",
        Jsz = gz(Hsz, bw, l3(D48, "|", M48), bw, l3(jsz, "|", M48), CJ, ">"),
        Xsz = gz("NOTATION", bw, /\(/, CJ, dx, l3(CJ, /\|/, CJ, dx), "*", CJ, /\)/),
        Msz = gz(/\(/, CJ, g_K, l3(CJ, /\|/, CJ, g_K), "*", CJ, /\)/),
        Psz = l3(Xsz, "|", Msz),
        Wsz = l3(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", Psz),
        Dsz = l3(/#REQUIRED|#IMPLIED/, "|", l3(l3("#FIXED", bw), "?", eaz)),
        Zsz = l3(bw, dx, bw, Wsz, bw, Dsz),
        fsz = "<!ATTLIST",
        Gsz = gz(fsz, bw, dx, Zsz, "*", CJ, ">"),
        _17 = "about:legacy-compat",
        vsz = l3('"' + _17 + '"', "|", "'" + _17 + "'"),
        O17 = "SYSTEM",
        Qp8 = "PUBLIC",
        dp8 = l3(l3(O17, bw, P48), "|", l3(Qp8, bw, Up8, bw, P48)),
        Tsz = gz("^", l3(l3(O17, bw, "(?<SystemLiteralOnly>", P48, ")"), "|", l3(Qp8, bw, "(?<PubidLiteral>", Up8, ")", bw, "(?<SystemLiteral>", P48, ")"))),
        Vsz = l3(bw, "NDATA", bw, dx),
        ksz = l3(A17, "|", l3(dp8, Vsz, "?")),
        o_K = "<!ENTITY",
        Nsz = gz(o_K, bw, dx, bw, ksz, CJ, ">"),
        Esz = l3(A17, "|", dp8),
        ysz = gz(o_K, bw, "%", bw, dx, bw, Esz, CJ, ">"),
        Lsz = l3(Nsz, "|", ysz),
        hsz = gz(Qp8, bw, Up8),
        Rsz = gz("<!NOTATION", bw, dx, bw, l3(dp8, "|", hsz), CJ, ">"),
        w17 = gz(CJ, "=", CJ),
        c_K = /1[.]\d+/,
        Ssz = gz(bw, "version", w17, l3("'", c_K, "'", "|", '"', c_K, '"')),
        l_K = /[A-Za-z][-A-Za-z0-9._]*/,
        Csz = l3(bw, "encoding", w17, l3('"', l_K, '"', "|", "'", l_K, "'")),
        bsz = l3(bw, "standalone", w17, l3("'", l3("yes", "|", "no"), "'", "|", '"', l3("yes", "|", "no"), '"')),
        Isz = gz(/^<\?xml/, Ssz, Csz, "?", bsz, "?", CJ, /\?>/),
        xsz = "<!DOCTYPE",
        usz = "<![CDATA[",
        msz = "]]>",
        Bsz = /<!\[CDATA\[/,
        psz = /\]\]>/,
        Fsz = gz(VX6, "*?", psz),
        gsz = gz(Bsz, Fsz);
    Usz.chars = TX6;
    Usz.chars_without = jC6;
    Usz.detectUnicodeSupport = n_K;
    Usz.reg = gz;
    Usz.regg = l3;
    Usz.ABOUT_LEGACY_COMPAT = _17;
    Usz.ABOUT_LEGACY_COMPAT_SystemLiteral = vsz;
    Usz.AttlistDecl = Gsz;
    Usz.CDATA_START = usz;
    Usz.CDATA_END = msz;
    Usz.CDSect = gsz;
    Usz.Char = VX6;
    Usz.Comment = Asz;
    Usz.COMMENT_START = i_K;
    Usz.COMMENT_END = r_K;
    Usz.DOCTYPE_DECL_START = xsz;
    Usz.elementdecl = Jsz;
    Usz.EntityDecl = Lsz;
    Usz.EntityValue = A17;
    Usz.ExternalID = dp8;
    Usz.ExternalID_match = Tsz;
    Usz.Name = dx;
    Usz.NotationDecl = Rsz;
    Usz.Reference = X48;
    Usz.PEReference = M48;
    Usz.PI = Ysz;
    Usz.PUBLIC = Qp8;
    Usz.PubidLiteral = Up8;
    Usz.QName = D48;
    Usz.QName_exact = _sz;
    Usz.QName_group = zsz;
    Usz.S = bw;
    Usz.SChar_s = oaz;
    Usz.S_OPT = CJ;
    Usz.SYSTEM = O17;
    Usz.SystemLiteral = P48;
    Usz.UNICODE_REPLACEMENT_CHARACTER = raz;
    Usz.UNICODE_SUPPORT = W48;
    Usz.XMLDecl = Isz
})