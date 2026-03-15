
// @from(Ln 245247, Col 0)
function x_4(A, q, K, Y, z, _) {
    let w = gI(),
        O = w.plugins[A];
    if (!O) {
        k(`Cannot update ${A} on disk: plugin not found in installed plugins`);
        return
    }
    let $ = O.find((H) => H.scope === q && H.projectPath === K);
    if ($) {
        if ($.installPath = Y, $.version = z, $.lastUpdated = new Date().toISOString(), _ !== void 0) $.gitCommitSha = _;
        let H = Qp6();
        fz(H, B6(w, null, 2), {
            encoding: "utf-8",
            flush: !0
        }), lB = null, k(`Updated ${A} on disk to version ${z} at ${Y}`)
    } else k(`Cannot update ${A} on disk: no installation for scope ${q}`)
}
// @from(Ln 245264, Col 0)
async function Ek8() {
    dF9();
    try {
        await Rk8()
    } catch (q) {
        _6(q)
    }
    let A = Up6();
    k(`Initialized versioned plugins system with ${Object.keys(A.plugins).length} plugins`)
}
// @from(Ln 245275, Col 0)
function u_4(A) {
    if (!A) return {
        orphanedPaths: [],
        removedPluginIds: []
    };
    let q = gI(),
        K = `@${A}`,
        Y = new Set,
        z = [];
    for (let _ of Object.keys(q.plugins)) {
        if (!_.endsWith(K)) continue;
        for (let w of q.plugins[_] ?? [])
            if (w.installPath) Y.add(w.installPath);
        delete q.plugins[_], z.push(_), k(`Removed installed plugin for marketplace removal: ${_}`)
    }
    if (z.length > 0) F01(q);
    return {
        orphanedPaths: Array.from(Y),
        removedPluginIds: z
    }
}
// @from(Ln 245297, Col 0)
function yk8(A) {
    return A.scope === "user" || A.scope === "managed" || A.projectPath === AA()
}
// @from(Ln 245301, Col 0)
function iB(A) {
    let K = DZ().plugins[A];
    if (!K || K.length === 0) return !1;
    if (!K.some(yk8)) return !1;
    return PA().enabledPlugins?.[A] !== void 0
}
// @from(Ln 245308, Col 0)
function nW6(A) {
    let K = DZ().plugins[A];
    if (!K || K.length === 0) return !1;
    if (!K.some((z) => z.scope === "user" || z.scope === "managed")) return !1;
    return PA().enabledPlugins?.[A] !== void 0
}
// @from(Ln 245315, Col 0)
function Lk8(A, q, K = "user", Y) {
    let z = gI(),
        _ = {
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
        w = z.plugins[A] || [],
        O = w.findIndex((H) => H.scope === K && H.projectPath === Y),
        $ = O >= 0;
    if ($) w[O] = _;
    else w.push(_);
    z.plugins[A] = w, F01(z), k(`${$?"Updated":"Added"} installed plugin: ${A} (scope: ${K})`)
}
// @from(Ln 245335, Col 0)
async function g01(A) {
    return await g31(A) ?? void 0
}
// @from(Ln 245339, Col 0)
function I_4(A, q) {
    let K = $1(),
        Y = _96(A, ".claude-plugin", "plugin.json");
    try {
        let z = K.readFileSync(Y, {
            encoding: "utf-8"
        });
        return i1(z).version || "unknown"
    } catch {
        return k(`Could not read version from manifest for ${q}`), "unknown"
    }
}
// @from(Ln 245351, Col 0)
async function Rk8() {
    let q = PA().enabledPlugins || {};
    if (Object.keys(q).length === 0) return;
    let K = Vk8(),
        Y = K !== null;
    if (Y && K?.version === 2 && K) {
        let D = IC6().safeParse(K.data);
        if (D?.success) {
            let X = D.data.plugins;
            if (Object.keys(q).filter((W) => W.includes("@")).every((W) => {
                    let Z = X[W];
                    return Z && Z.length > 0
                })) {
                k("All plugins already exist, skipping migration");
                return
            }
        }
    }
    k(Y ? "Syncing installed_plugins.json with enabledPlugins from all settings.json files" : "Creating installed_plugins.json from settings.json files");
    let _ = $1(),
        w = new Date().toISOString(),
        O = G1(),
        $ = new Map,
        H = ["userSettings", "projectSettings", "localSettings"];
    for (let D of H) {
        let P = L8(D)?.enabledPlugins || {};
        for (let W of Object.keys(P)) {
            if (!W.includes("@")) continue;
            let Z = S_4(D);
            $.set(W, {
                scope: Z,
                projectPath: Z === "user" ? void 0 : O
            })
        }
    }
    let j = {};
    if (Y) j = {
        ...DZ().plugins
    };
    let J = 0,
        M = 0;
    for (let [D, X] of $) {
        let P = j[D];
        if (P && P.length > 0) {
            let W = P[0];
            if (W && (W.scope !== X.scope || W.projectPath !== X.projectPath)) {
                if (W.scope = X.scope, X.projectPath) W.projectPath = X.projectPath;
                else delete W.projectPath;
                W.lastUpdated = w, J++, k(`Updated ${D} scope to ${X.scope} (settings.json is source of truth)`)
            }
        } else {
            let {
                name: W,
                marketplace: Z
            } = n3(D);
            if (!W || !Z) continue;
            try {
                k(`Looking up plugin ${D} in marketplace ${Z}`);
                let G = await Qv(D);
                if (!G) {
                    k(`Plugin ${D} not found in any marketplace, skipping`);
                    continue
                }
                let {
                    entry: f,
                    marketplaceInstallLocation: v
                } = G, N, V = "unknown", L = void 0;
                if (typeof f.source === "string") N = _96(v, f.source), V = I_4(N, D), L = await g01(N);
                else {
                    let h = rW6(),
                        R = W.replace(/[^a-zA-Z0-9-_]/g, "-"),
                        u = _96(h, R);
                    if (!_.existsSync(u)) {
                        k(`External plugin ${D} not in cache, skipping`);
                        continue
                    }
                    N = u, V = I_4(u, D), L = await g01(u)
                }
                if (V === "unknown" && f.version) V = f.version;
                if (V === "unknown" && L) V = L.substring(0, 12);
                j[D] = [{
                    scope: X.scope,
                    installPath: FI(D, V),
                    version: V,
                    installedAt: w,
                    lastUpdated: w,
                    gitCommitSha: L,
                    ...X.projectPath && {
                        projectPath: X.projectPath
                    }
                }], M++, k(`Added ${D} with scope ${X.scope}`)
            } catch (G) {
                k(`Failed to add plugin ${D}: ${G}`)
            }
        }
    }
    if (!Y || J > 0 || M > 0) F01({
        version: 2,
        plugins: j
    }), k(`Sync completed: ${M} added, ${J} updated in installed_plugins.json`)
}
// @from(Ln 245452, Col 4)
vk8 = !1
// @from(Ln 245453, Col 4)
lB = null
// @from(Ln 245454, Col 4)
Nk8 = null
// @from(Ln 245455, Col 4)
fX = E(() => {
    SA();
    g1();
    H1();
    k1();
    ze();
    IW();
    g1();
    s8();
    i8();
    BI();
    lA();
    T1();
    tH();
    yo();
    Aw()
})
// @from(Ln 245473, Col 0)
function sM(A) {
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
        case "mcp-config-invalid":
            return `MCP server ${A.serverName} invalid: ${A.validationError}`;
        case "mcp-server-suppressed-duplicate": {
            let q = A.duplicateOf.startsWith("plugin:") ? `server provided by plugin "${A.duplicateOf.split(":")[1]??"?"}"` : `already-configured "${A.duplicateOf}"`;
            return `MCP server "${A.serverName}" skipped — same command/URL as ${q}`
        }
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
            return `Marketplace '${A.marketplace}' is not in the allowed marketplace list`;
        case "dependency-unsatisfied": {
            let q = A.reason === "not-enabled" ? "disabled — enable it or remove the dependency" : "not found in any configured marketplace";
            return `Dependency "${A.dependency}" is ${q}`
        }
    }
}
// @from(Ln 245537, Col 0)
function p01(A) {
    return /^skill\.md$/i.test(aW6(A))
}
// @from(Ln 245541, Col 0)
function cF9(A, q, K) {
    if (p01(A)) {
        let z = wc(A),
            _ = wc(z),
            w = aW6(z),
            O = _.startsWith(q) ? _.slice(q.length).replace(/^\//, "") : "",
            $ = O ? O.split("/").join(":") : "";
        return $ ? `${K}:${$}:${w}` : `${K}:${w}`
    } else {
        let z = wc(A),
            _ = aW6(A).replace(/\.md$/, ""),
            w = z.startsWith(q) ? z.slice(q.length).replace(/^\//, "") : "",
            O = w ? w.split("/").join(":") : "";
        return O ? `${K}:${O}:${_}` : `${K}:${_}`
    }
}
// @from(Ln 245557, Col 0)
async function lF9(A, q, K) {
    let Y = [],
        z = $1();
    async function _(w) {
        try {
            let O = await z.readdir(w);
            if (O.some((H) => H.isFile() && p01(H.name))) {
                await Promise.all(O.map(async (H) => {
                    if (!H.isFile() || !H.name.toLowerCase().endsWith(".md")) return;
                    let j = oW6(w, H.name);
                    if (hx(z, j, K)) return;
                    let J = await z.readFile(j, {
                            encoding: "utf-8"
                        }),
                        {
                            frontmatter: M,
                            content: D
                        } = BH(J, j);
                    Y.push({
                        filePath: j,
                        baseDir: q,
                        frontmatter: M,
                        content: D
                    })
                }));
                return
            }
            await Promise.all(O.map(async (H) => {
                let j = oW6(w, H.name);
                if (H.isDirectory()) await _(j);
                else if (H.isFile() && H.name.toLowerCase().endsWith(".md")) {
                    if (hx(z, j, K)) return;
                    let J = await z.readFile(j, {
                            encoding: "utf-8"
                        }),
                        {
                            frontmatter: M,
                            content: D
                        } = BH(J, j);
                    Y.push({
                        filePath: j,
                        baseDir: q,
                        frontmatter: M,
                        content: D
                    })
                }
            }))
        } catch (O) {
            k(`Failed to scan directory ${w}: ${O}`, {
                level: "error"
            })
        }
    }
    return await _(A), Y
}
// @from(Ln 245613, Col 0)
function iF9(A) {
    let q = new Map;
    for (let Y of A) {
        let z = wc(Y.filePath),
            _ = q.get(z) ?? [];
        _.push(Y), q.set(z, _)
    }
    let K = [];
    for (let [Y, z] of q) {
        let _ = z.filter((w) => p01(w.filePath));
        if (_.length > 0) {
            let w = _[0];
            if (_.length > 1) k(`Multiple skill files found in ${Y}, using ${aW6(w.filePath)}`);
            K.push(w)
        } else K.push(...z)
    }
    return K
}
// @from(Ln 245631, Col 0)
async function m_4(A, q, K, Y, z, _ = {
    isSkillMode: !1
}, w = new Set) {
    let O = await lF9(A, A, w),
        $ = iF9(O),
        H = [];
    for (let j of $) {
        let J = cF9(j.filePath, j.baseDir, q),
            M = dp6(J, j, K, Y, z, p01(j.filePath), _);
        if (M) H.push(M)
    }
    return H
}
// @from(Ln 245645, Col 0)
function dp6(A, q, K, Y, z, _, w = {
    isSkillMode: !1
}) {
    try {
        let {
            frontmatter: O,
            content: $
        } = q, H = NL(O.description, A), j = H ?? ad($, _ ? "Plugin skill" : "Plugin command"), J = O["allowed-tools"], M = typeof J === "string" ? ZL(J, z) : Array.isArray(J) ? J.map((L) => typeof L === "string" ? ZL(L, z) : L) : J, D = LI(M), X = O["argument-hint"], P = Pp6(O.arguments), W = O.when_to_use, Z = O.version, G = O.name, f = O.model === "inherit" ? void 0 : O.model ? H5(O.model) : void 0, v = ka(O["disable-model-invocation"]), N = O["user-invocable"], V = N === void 0 ? !0 : ka(N);
        return {
            type: "prompt",
            name: A,
            description: j,
            hasUserSpecifiedDescription: H !== null,
            allowedTools: D,
            argumentHint: X,
            argNames: P.length > 0 ? P : void 0,
            whenToUse: W,
            version: Z,
            model: f,
            disableModelInvocation: v,
            userInvocable: V,
            contentLength: $.length,
            source: "plugin",
            loadedFrom: _ || w.isSkillMode ? "plugin" : void 0,
            pluginInfo: {
                pluginManifest: Y,
                repository: K
            },
            isEnabled: () => !0,
            isHidden: !V,
            progressMessage: _ || w.isSkillMode ? "loading" : "running",
            userFacingName() {
                return G || A
            },
            async getPromptForCommand(L, h) {
                let R = w.isSkillMode ? `Base directory for this skill: ${wc(q.filePath)}

${$}` : $;
                if (R = vW6(R, L, !0, P), R = ZL(R, z), w.isSkillMode) {
                    let u = wc(q.filePath),
                        I = process.platform === "win32" ? u.replace(/\\/g, "/") : u;
                    R = R.replace(/\$\{CLAUDE_SKILL_DIR\}/g, I)
                }
                return R = R.replace(/\$\{CLAUDE_SESSION_ID\}/g, R1()), R = await uB(R, {
                    ...h,
                    getAppState() {
                        let u = h.getAppState();
                        return {
                            ...u,
                            toolPermissionContext: {
                                ...u.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...u.toolPermissionContext.alwaysAllowRules,
                                    command: D
                                }
                            }
                        }
                    }
                }, `/${A}`), [{
                    type: "text",
                    text: R
                }]
            }
        }
    } catch (O) {
        return k(`Failed to create command from ${q.filePath}: ${O}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 245716, Col 0)
function Q01() {
    w96.cache?.clear?.()
}
// @from(Ln 245719, Col 0)
async function B_4(A, q, K, Y, z, _) {
    let w = $1(),
        O = [],
        $ = oW6(A, "SKILL.md"),
        H = null;
    try {
        H = await w.readFile($, {
            encoding: "utf-8"
        })
    } catch (J) {
        if (J.code !== "ENOENT") return k(`Failed to load skill from ${$}: ${J}`, {
            level: "error"
        }), O
    }
    if (H !== null) {
        if (hx(w, $, _)) return O;
        try {
            let {
                frontmatter: J,
                content: M
            } = BH(H, $), D = `${q}:${aW6(A)}`, X = {
                filePath: $,
                baseDir: wc($),
                frontmatter: J,
                content: M
            }, P = dp6(D, X, K, Y, z, !0, {
                isSkillMode: !0
            });
            if (P) O.push(P)
        } catch (J) {
            k(`Failed to load skill from ${$}: ${J}`, {
                level: "error"
            })
        }
        return O
    }
    let j;
    try {
        j = await w.readdir(A)
    } catch (J) {
        if (J.code !== "ENOENT") k(`Failed to load skills from directory ${A}: ${J}`, {
            level: "error"
        });
        return O
    }
    return await Promise.all(j.map(async (J) => {
        if (!J.isDirectory() && !J.isSymbolicLink()) return;
        let M = oW6(A, J.name),
            D = oW6(M, "SKILL.md"),
            X;
        try {
            X = await w.readFile(D, {
                encoding: "utf-8"
            })
        } catch (P) {
            if (P.code !== "ENOENT") k(`Failed to load skill from ${D}: ${P}`, {
                level: "error"
            });
            return
        }
        if (hx(w, D, _)) return;
        try {
            let {
                frontmatter: P,
                content: W
            } = BH(X, D), Z = `${q}:${J.name}`, G = {
                filePath: D,
                baseDir: wc(D),
                frontmatter: P,
                content: W
            }, f = dp6(Z, G, K, Y, z, !0, {
                isSkillMode: !0
            });
            if (f) O.push(f)
        } catch (P) {
            k(`Failed to load skill from ${D}: ${P}`, {
                level: "error"
            })
        }
    })), O
}
// @from(Ln 245801, Col 0)
function g_4() {
    hk8.cache?.clear?.()
}
// @from(Ln 245804, Col 4)
w96
// @from(Ln 245804, Col 9)
hk8
// @from(Ln 245805, Col 4)
cp6 = E(() => {
    U4();
    SA();
    tH();
    H1();
    TW6();
    td();
    BG();
    eu();
    z4();
    T1();
    Wp6();
    w96 = e1(async () => {
        let {
            enabled: A,
            errors: q
        } = await _z();
        if (q.length > 0) k(`Plugin loading errors: ${q.map((z)=>sM(z)).join(", ")}`);
        let Y = (await Promise.all(A.map(async (z) => {
            let _ = new Set,
                w = [];
            if (z.commandsPath) try {
                let O = await m_4(z.commandsPath, z.name, z.source, z.manifest, z.path, {
                    isSkillMode: !1
                }, _);
                if (w.push(...O), O.length > 0) k(`Loaded ${O.length} commands from plugin ${z.name} default directory`)
            } catch (O) {
                k(`Failed to load commands from plugin ${z.name} default directory: ${O}`, {
                    level: "error"
                })
            }
            if (z.commandsPaths) {
                k(`Plugin ${z.name} has commandsPaths: ${z.commandsPaths.join(", ")}`);
                let O = await Promise.all(z.commandsPaths.map(async ($) => {
                    try {
                        let H = $1(),
                            j = await H.stat($);
                        if (k(`Checking commandPath ${$} - isDirectory: ${j.isDirectory()}, isFile: ${j.isFile()}`), j.isDirectory()) {
                            let J = await m_4($, z.name, z.source, z.manifest, z.path, {
                                isSkillMode: !1
                            }, _);
                            if (J.length > 0) k(`Loaded ${J.length} commands from plugin ${z.name} custom path: ${$}`);
                            else k(`Warning: No commands found in plugin ${z.name} custom directory: ${$}. Expected .md files or SKILL.md in subdirectories.`, {
                                level: "warn"
                            });
                            return J
                        } else if (j.isFile() && $.endsWith(".md")) {
                            if (hx(H, $, _)) return [];
                            let J = await H.readFile($, {
                                    encoding: "utf-8"
                                }),
                                {
                                    frontmatter: M,
                                    content: D
                                } = BH(J, $),
                                X, P;
                            if (z.commandsMetadata) {
                                for (let [f, v] of Object.entries(z.commandsMetadata))
                                    if (v.source) {
                                        let N = oW6(z.path, v.source);
                                        if ($ === N) {
                                            X = `${z.name}:${f}`, P = v;
                                            break
                                        }
                                    }
                            }
                            if (!X) X = `${z.name}:${aW6($).replace(/\.md$/,"")}`;
                            let W = P ? {
                                    ...M,
                                    ...P.description && {
                                        description: P.description
                                    },
                                    ...P.argumentHint && {
                                        "argument-hint": P.argumentHint
                                    },
                                    ...P.model && {
                                        model: P.model
                                    },
                                    ...P.allowedTools && {
                                        "allowed-tools": P.allowedTools.join(",")
                                    }
                                } : M,
                                Z = {
                                    filePath: $,
                                    baseDir: wc($),
                                    frontmatter: W,
                                    content: D
                                },
                                G = dp6(X, Z, z.source, z.manifest, z.path, !1);
                            if (G) return k(`Loaded command from plugin ${z.name} custom file: ${$}${P?" (with metadata override)":""}`), [G]
                        }
                        return []
                    } catch (H) {
                        return k(`Failed to load commands from plugin ${z.name} custom path ${$}: ${H}`, {
                            level: "error"
                        }), []
                    }
                }));
                for (let $ of O) w.push(...$)
            }
            if (z.commandsMetadata) {
                for (let [O, $] of Object.entries(z.commandsMetadata))
                    if ($.content && !$.source) try {
                        let {
                            frontmatter: H,
                            content: j
                        } = BH($.content, `<inline:${z.name}:${O}>`), J = {
                            ...H,
                            ...$.description && {
                                description: $.description
                            },
                            ...$.argumentHint && {
                                "argument-hint": $.argumentHint
                            },
                            ...$.model && {
                                model: $.model
                            },
                            ...$.allowedTools && {
                                "allowed-tools": $.allowedTools.join(",")
                            }
                        }, M = `${z.name}:${O}`, D = {
                            filePath: `<inline:${M}>`,
                            baseDir: z.path,
                            frontmatter: J,
                            content: j
                        }, X = dp6(M, D, z.source, z.manifest, z.path, !1);
                        if (X) w.push(X), k(`Loaded inline content command from plugin ${z.name}: ${M}`)
                    } catch (H) {
                        k(`Failed to load inline content command ${O} from plugin ${z.name}: ${H}`, {
                            level: "error"
                        })
                    }
            }
            return w
        }))).flat();
        return k(`Total plugin commands loaded: ${Y.length}`), Y
    });
    hk8 = e1(async () => {
        let {
            enabled: A,
            errors: q
        } = await _z();
        if (q.length > 0) k(`Plugin loading errors: ${q.map((z)=>sM(z)).join(", ")}`);
        k(`getPluginSkills: Processing ${A.length} enabled plugins`);
        let Y = (await Promise.all(A.map(async (z) => {
            let _ = new Set,
                w = [];
            if (k(`Checking plugin ${z.name}: skillsPath=${z.skillsPath?"exists":"none"}, skillsPaths=${z.skillsPaths?z.skillsPaths.length:0} paths`), z.skillsPath) {
                k(`Attempting to load skills from plugin ${z.name} default skillsPath: ${z.skillsPath}`);
                try {
                    let O = await B_4(z.skillsPath, z.name, z.source, z.manifest, z.path, _);
                    w.push(...O), k(`Loaded ${O.length} skills from plugin ${z.name} default directory`)
                } catch (O) {
                    k(`Failed to load skills from plugin ${z.name} default directory: ${O}`, {
                        level: "error"
                    })
                }
            }
            if (z.skillsPaths) {
                k(`Attempting to load skills from plugin ${z.name} skillsPaths: ${z.skillsPaths.join(", ")}`);
                let O = await Promise.all(z.skillsPaths.map(async ($) => {
                    try {
                        k(`Loading from skillPath: ${$} for plugin ${z.name}`);
                        let H = await B_4($, z.name, z.source, z.manifest, z.path, _);
                        return k(`Loaded ${H.length} skills from plugin ${z.name} custom path: ${$}`), H
                    } catch (H) {
                        return k(`Failed to load skills from plugin ${z.name} custom path ${$}: ${H}`, {
                            level: "error"
                        }), []
                    }
                }));
                for (let $ of O) w.push(...$)
            }
            return w
        }))).flat();
        return k(`Total plugin skills loaded: ${Y.length}`), Y
    })
})
// @from(Ln 245983, Col 4)
Ck8 = {}
// @from(Ln 245991, Col 0)
function nF9(A) {
    let q = {
        PreToolUse: [],
        PostToolUse: [],
        PostToolUseFailure: [],
        Notification: [],
        UserPromptSubmit: [],
        SessionStart: [],
        SessionEnd: [],
        Stop: [],
        SubagentStart: [],
        SubagentStop: [],
        PreCompact: [],
        PostCompact: [],
        PermissionRequest: [],
        Setup: [],
        TeammateIdle: [],
        TaskCompleted: [],
        Elicitation: [],
        ElicitationResult: [],
        ConfigChange: [],
        WorktreeCreate: [],
        WorktreeRemove: [],
        InstructionsLoaded: []
    };
    if (!A.hooksConfig) return q;
    for (let [K, Y] of Object.entries(A.hooksConfig)) {
        let z = K;
        if (!q[z]) continue;
        for (let _ of Y)
            if (_.hooks.length > 0) q[z].push({
                matcher: _.matcher,
                hooks: _.hooks,
                pluginRoot: A.path,
                pluginName: A.name,
                pluginId: A.source
            })
    }
    return q
}
// @from(Ln 246032, Col 0)
function d01() {
    nB.cache?.clear?.()
}
// @from(Ln 246036, Col 0)
function rF9() {
    Sk8 = !1, U01 = void 0
}
// @from(Ln 246040, Col 0)
function F_4() {
    let A = PA().enabledPlugins;
    if (!A) return "{}";
    return B6(A, Object.keys(A).sort())
}
// @from(Ln 246046, Col 0)
function oF9() {
    if (Sk8) return;
    Sk8 = !0, U01 = F_4(), tO.subscribe((A) => {
        if (A === "policySettings") {
            let q = F_4();
            if (q === U01) {
                k("Plugin hooks: skipping reload, enabledPlugins unchanged");
                return
            }
            U01 = q, k("Plugin hooks: reloading due to enabledPlugins change"), XZ("loadPluginHooks: enabledPlugins settings changed"), d01(), nB()
        }
    })
}
// @from(Ln 246059, Col 4)
Sk8 = !1
// @from(Ln 246060, Col 4)
U01
// @from(Ln 246060, Col 9)
nB
// @from(Ln 246061, Col 4)
O96 = E(() => {
    U4();
    tH();
    H1();
    T1();
    Hm();
    i8();
    g1();
    nB = e1(async () => {
        let {
            enabled: A
        } = await _z(), q = {
            PreToolUse: [],
            PostToolUse: [],
            PostToolUseFailure: [],
            Notification: [],
            UserPromptSubmit: [],
            SessionStart: [],
            SessionEnd: [],
            Stop: [],
            SubagentStart: [],
            SubagentStop: [],
            PreCompact: [],
            PostCompact: [],
            PermissionRequest: [],
            Setup: [],
            TeammateIdle: [],
            TaskCompleted: [],
            Elicitation: [],
            ElicitationResult: [],
            ConfigChange: [],
            WorktreeCreate: [],
            WorktreeRemove: [],
            InstructionsLoaded: []
        };
        for (let Y of A) {
            if (!Y.hooksConfig) continue;
            k(`Loading hooks from plugin: ${Y.name}`);
            let z = nF9(Y);
            for (let _ of Object.keys(z)) q[_].push(...z[_])
        }
        lu1(), KA6(q);
        let K = Object.values(q).reduce((Y, z) => Y + z.reduce((_, w) => _ + w.hooks.length, 0), 0);
        k(`Registered ${K} hooks from ${A.length} plugins`)
    })
})
// @from(Ln 246111, Col 0)
async function p_4(A, q, K) {
    let Y = [],
        z = $1();
    async function _(w) {
        try {
            let O = await z.readdir(w);
            await Promise.all(O.map(async ($) => {
                let H = aF9(w, $.name);
                if ($.isDirectory()) await _(H);
                else if ($.isFile() && $.name.endsWith(".md")) {
                    let j = await Q_4(H, q, K);
                    if (j) Y.push(j)
                }
            }))
        } catch (O) {
            k(`Failed to scan output-styles directory ${w}: ${O}`, {
                level: "error"
            })
        }
    }
    return await _(A), Y
}
// @from(Ln 246133, Col 0)
async function Q_4(A, q, K) {
    let Y = $1();
    if (hx(Y, A, K)) return null;
    try {
        let z = await Y.readFile(A, {
                encoding: "utf-8"
            }),
            {
                frontmatter: _,
                content: w
            } = BH(z, A),
            O = sF9(A, ".md"),
            $ = _.name || O,
            H = `${q}:${$}`,
            j = NL(_.description, H) ?? ad(w, `Output style from ${q} plugin`),
            J = _["force-for-plugin"],
            M = J === !0 || J === "true" ? !0 : J === !1 || J === "false" ? !1 : void 0;
        return {
            name: H,
            description: j,
            prompt: w.trim(),
            source: "plugin",
            forceForPlugin: M
        }
    } catch (z) {
        return k(`Failed to load output style from ${A}: ${z}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 246164, Col 0)
function bk8() {
    Ik8.cache?.clear?.()
}
// @from(Ln 246167, Col 4)
Ik8
// @from(Ln 246168, Col 4)
c01 = E(() => {
    U4();
    SA();
    tH();
    H1();
    BG();
    BG();
    td();
    Ik8 = e1(async () => {
        let {
            enabled: A,
            errors: q
        } = await _z(), K = [];
        if (q.length > 0) k(`Plugin loading errors: ${q.map((Y)=>sM(Y)).join(", ")}`);
        for (let Y of A) {
            let z = new Set;
            if (Y.outputStylesPath) try {
                let _ = await p_4(Y.outputStylesPath, Y.name, z);
                if (K.push(..._), _.length > 0) k(`Loaded ${_.length} output styles from plugin ${Y.name} default directory`)
            } catch (_) {
                k(`Failed to load output styles from plugin ${Y.name} default directory: ${_}`, {
                    level: "error"
                })
            }
            if (Y.outputStylesPaths)
                for (let _ of Y.outputStylesPaths) try {
                    let O = await $1().stat(_);
                    if (O.isDirectory()) {
                        let $ = await p_4(_, Y.name, z);
                        if (K.push(...$), $.length > 0) k(`Loaded ${$.length} output styles from plugin ${Y.name} custom path: ${_}`)
                    } else if (O.isFile() && _.endsWith(".md")) {
                        let $ = await Q_4(_, Y.name, z);
                        if ($) K.push($), k(`Loaded output style from plugin ${Y.name} custom file: ${_}`)
                    }
                } catch (w) {
                    k(`Failed to load output styles from plugin ${Y.name} custom path ${_}: ${w}`, {
                        level: "error"
                    })
                }
        }
        return k(`Total plugin output styles loaded: ${K.length}`), K
    })
})
// @from(Ln 246232, Col 0)
function pI() {
    return t6(process.env.CLAUDE_CODE_PLUGIN_USE_ZIP_CACHE)
}
// @from(Ln 246236, Col 0)
function lp6() {
    if (!pI()) return;
    let A = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
    return A ? at(A) : void 0
}
// @from(Ln 246242, Col 0)
function mk8() {
    let A = lp6();
    if (!A) throw Error("Plugin zip cache is not enabled");
    return rB(A, "known_marketplaces.json")
}
// @from(Ln 246248, Col 0)
function l_4() {
    let A = lp6();
    if (!A) throw Error("Plugin zip cache is not enabled");
    return rB(A, "marketplaces")
}
// @from(Ln 246254, Col 0)
function i_4() {
    let A = lp6();
    if (!A) throw Error("Plugin zip cache is not enabled");
    return rB(A, "plugins")
}
// @from(Ln 246259, Col 0)
async function n_4() {
    if ($96) return $96;
    if (!l01) l01 = (async () => {
        let A = c_4(8).toString("hex"),
            q = rB(eF9(), `claude-plugin-session-${A}`);
        return await $1().mkdir(q), $96 = q, k(`Created session plugin cache at ${q}`), q
    })();
    return l01
}
// @from(Ln 246268, Col 0)
async function r_4() {
    if (!$96) return;
    try {
        await uk8($96, {
            recursive: !0,
            force: !0
        }), k(`Cleaned up session plugin cache at ${$96}`)
    } catch (A) {
        k(`Failed to clean up session plugin cache: ${A}`)
    } finally {
        $96 = null, l01 = null
    }
}
// @from(Ln 246281, Col 0)
async function i01(A, q) {
    let K = d_4(A);
    await $1().mkdir(K);
    let Y = `.${tF9(A)}.tmp.${c_4(4).toString("hex")}`,
        z = rB(K, Y);
    try {
        if (typeof q === "string") await xk8(z, q, {
            encoding: "utf-8"
        });
        else await xk8(z, q);
        await Kp9(z, A)
    } catch (_) {
        try {
            await uk8(z, {
                force: !0
            })
        } catch {}
        throw _
    }
}
// @from(Ln 246301, Col 0)
async function zp9(A) {
    let q = {};
    await o_4(A, "", q, new Set);
    let {
        zipSync: Y
    } = await Promise.resolve().then(() => (MI6(), f98)), z = Y(q, {
        level: 6
    });
    return k(`Created ZIP from ${A}: ${Object.keys(q).length} files, ${z.length} bytes`), z
}
// @from(Ln 246311, Col 0)
async function o_4(A, q, K, Y) {
    let z = q ? rB(A, q) : A,
        _;
    try {
        _ = await Ap9(z)
    } catch {
        return
    }
    try {
        let w = await U_4(z, {
            bigint: !0
        });
        if (w.dev !== 0n || w.ino !== 0n) {
            let O = `${w.dev}:${w.ino}`;
            if (Y.has(O)) {
                k(`Skipping symlink cycle at ${z}`);
                return
            }
            Y.add(O)
        }
    } catch {
        return
    }
    for (let w of _) {
        if (w === ".git") continue;
        let O = rB(z, w),
            $ = q ? `${q}/${w}` : w,
            H;
        try {
            H = await Yp9(O)
        } catch {
            continue
        }
        if (H.isSymbolicLink()) try {
            let j = await U_4(O);
            if (j.isDirectory()) continue;
            H = j
        } catch {
            continue
        }
        if (H.isDirectory()) await o_4(A, $, K, Y);
        else if (H.isFile()) try {
            let j = await qp9(O);
            K[$] = new Uint8Array(j)
        } catch (j) {
            k(`Failed to read file for zip: ${$}: ${j}`)
        }
    }
}
// @from(Ln 246360, Col 0)
async function a_4(A, q) {
    let K = await tY1(A);
    await $1().mkdir(q);
    for (let [Y, z] of Object.entries(K)) {
        if (Y.endsWith("/")) {
            await $1().mkdir(rB(q, Y));
            continue
        }
        let _ = rB(q, Y);
        await $1().mkdir(d_4(_)), await xk8(_, z)
    }
    k(`Extracted ZIP to ${q}: ${Object.keys(K).length} entries`)
}
// @from(Ln 246373, Col 0)
async function n01(A, q) {
    let K = await zp9(A);
    await i01(q, K), await uk8(A, {
        recursive: !0,
        force: !0
    })
}
// @from(Ln 246381, Col 0)
function s_4(A) {
    let q = A.replace(/[^a-zA-Z0-9\-_]/g, "-");
    return rB("marketplaces", `${q}.json`)
}
// @from(Ln 246386, Col 0)
function t_4(A) {
    if (typeof A === "string") return !1;
    return ["github", "git", "url"].includes(A.source)
}
// @from(Ln 246390, Col 4)
$96 = null
// @from(Ln 246391, Col 4)
l01 = null
// @from(Ln 246392, Col 4)
sW6 = E(() => {
    SA();
    H1();
    Nz8();
    A8();
    J01()
})
// @from(Ln 246410, Col 0)
function Jp9() {
    XZ(), Q01(), a01(), d01(), Rz8(), bk8(), q24()
}
// @from(Ln 246414, Col 0)
function HY() {
    Jp9(), oB(), Fk8(), NV8(), Oc()
}
// @from(Ln 246417, Col 0)
async function tW6(A) {
    try {
        await $p9(gk8(A), `${Date.now()}`, "utf-8")
    } catch (q) {
        k(`Failed to write .orphaned_at: ${A}: ${q}`)
    }
}
// @from(Ln 246424, Col 0)
async function Bk8() {
    if (pI()) return;
    try {
        let A = Dp9();
        if (!A) return;
        let q = rW6(),
            K = Date.now();
        await Promise.all([...A].map((Y) => Mp9(Y)));
        for (let Y of await o01(q)) {
            let z = r01(q, Y);
            for (let _ of await o01(z)) {
                let w = r01(z, _);
                for (let O of await o01(w)) {
                    let $ = r01(w, O);
                    if (A.has($)) continue;
                    await Xp9($, K)
                }
                await e_4(w)
            }
            await e_4(z)
        }
    } catch (A) {
        k(`Plugin cache cleanup failed: ${A}`)
    }
}
// @from(Ln 246450, Col 0)
function gk8(A) {
    return r01(A, Hp9)
}
// @from(Ln 246453, Col 0)
async function Mp9(A) {
    let q = gk8(A);
    try {
        await Op9(q)
    } catch (K) {
        if (K.code === "ENOENT") return;
        k(`Failed to remove .orphaned_at: ${A}: ${K}`)
    }
}
// @from(Ln 246463, Col 0)
function Dp9() {
    try {
        let A = new Set,
            q = gI();
        for (let K of Object.values(q.plugins))
            for (let Y of K) A.add(Y.installPath);
        return A
    } catch (A) {
        return k(`Failed to load installed plugins: ${A}`), null
    }
}
// @from(Ln 246474, Col 0)
async function Xp9(A, q) {
    let K = gk8(A),
        Y;
    try {
        Y = (await wp9(K)).mtimeMs
    } catch (z) {
        if (z.code === "ENOENT") {
            await tW6(A);
            return
        }
        k(`Failed to stat orphaned marker: ${A}: ${z}`);
        return
    }
    if (q - Y > jp9) try {
        await A24(A, {
            recursive: !0,
            force: !0
        })
    } catch (z) {
        k(`Failed to delete orphaned version: ${A}: ${z}`)
    }
}
// @from(Ln 246496, Col 0)
async function e_4(A) {
    if ((await o01(A)).length === 0) try {
        await A24(A, {
            recursive: !0,
            force: !0
        })
    } catch (q) {
        k(`Failed to remove empty dir: ${A}: ${q}`)
    }
}
// @from(Ln 246506, Col 0)
async function o01(A) {
    try {
        return (await _p9(A, {
            withFileTypes: !0
        })).filter((K) => K.isDirectory()).map((K) => K.name)
    } catch {
        return []
    }
}
// @from(Ln 246515, Col 4)
Hp9 = ".orphaned_at"
// @from(Ln 246516, Col 4)
jp9 = 604800000
// @from(Ln 246517, Col 4)
Uv = E(() => {
    tH();
    cp6();
    s01();
    O96();
    eu();
    c01();
    aB();
    D$();
    J0();
    fX();
    H1();
    sW6();
    Q36();
    M0()
})
// @from(Ln 246542, Col 0)
function AW1() {
    return TX(eH(), "known_marketplaces.json")
}
// @from(Ln 246546, Col 0)
function qW1() {
    return TX(eH(), "marketplaces")
}
// @from(Ln 246550, Col 0)
function QI() {
    j0.cache?.clear?.()
}
// @from(Ln 246554, Col 0)
function _e() {
    return {
        ...h_4(),
        ...mA().extraKnownMarketplaces ?? {}
    }
}
// @from(Ln 246561, Col 0)
function Pp9(A) {
    let q = ["localSettings", "projectSettings", "userSettings"];
    for (let K of q)
        if (L8(K)?.extraKnownMarketplaces?.[A]) return K;
    return null
}
// @from(Ln 246568, Col 0)
function rp6(A, q, K = "userSettings") {
    let z = {
        ...(L8(K) ?? {}).extraKnownMarketplaces
    };
    z[A] = q, TA(K, {
        extraKnownMarketplaces: z
    })
}
// @from(Ln 246576, Col 0)
async function C3() {
    let A = $1(),
        q = AW1();
    try {
        let K = await A.readFile(q, {
                encoding: "utf-8"
            }),
            Y = i1(K),
            z = PJ6().safeParse(Y);
        if (!z.success) {
            let _ = `Marketplace configuration file is corrupted: ${z.error.issues.map((w)=>`${w.path.join(".")}: ${w.message}`).join(", ")}`;
            throw k(_, {
                level: "error"
            }), new MG(_, q, Y)
        }
        return z.data
    } catch (K) {
        if (K.code === "ENOENT") return {};
        if (K instanceof MG) throw K;
        let Y = `Failed to load marketplace configuration: ${_1(K)}`;
        throw k(Y, {
            level: "error"
        }), Error(Y)
    }
}
// @from(Ln 246601, Col 0)
async function eW6() {
    try {
        return await C3()
    } catch {
        return {}
    }
}
// @from(Ln 246608, Col 0)
async function j96(A) {
    let q = PJ6().safeParse(A),
        K = AW1();
    if (!q.success) throw new MG(`Invalid marketplace config: ${q.error.message}`, K, A);
    let Y = $1(),
        z = TX(K, "..");
    await Y.mkdir(z), fz(K, B6(q.data, null, 2), {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 246619, Col 0)
async function KW1() {
    let A = tB();
    if (!A) return !1;
    let q = TX(A, "known_marketplaces.json"),
        K;
    try {
        let _ = await $1().readFile(q, {
                encoding: "utf-8"
            }),
            w = PJ6().safeParse(i1(_));
        if (!w.success) return k(`Seed known_marketplaces.json invalid: ${w.error.message}`, {
            level: "warn"
        }), !1;
        K = w.data
    } catch (_) {
        if (_.code !== "ENOENT") k(`Failed to read seed known_marketplaces.json: ${_}`, {
            level: "warn"
        });
        return !1
    }
    let Y = await C3(),
        z = 0;
    for (let [_, w] of Object.entries(K)) {
        let O = await Wp9(A, _);
        if (!O) {
            k(`Seed marketplace '${_}' not found under ${A}/marketplaces/, skipping`, {
                level: "warn"
            });
            continue
        }
        let $ = {
            source: w.source,
            installLocation: O,
            lastUpdated: w.lastUpdated,
            autoUpdate: !1
        };
        if (TP(Y[_], $)) continue;
        Y[_] = $, z++
    }
    if (z > 0) return await j96(Y), k(`Synced ${z} marketplace(s) from seed dir`), !0;
    return !1
}
// @from(Ln 246661, Col 0)
async function Wp9(A, q) {
    let K = TX(A, "marketplaces", q),
        Y = TX(A, "marketplaces", `${q}.json`);
    for (let z of [K, Y]) try {
        return await np6(z), z
    } catch {}
    return null
}
// @from(Ln 246670, Col 0)
function op6(A) {
    let q = tB();
    if (!q) return !1;
    return A === q || A.startsWith(q + e01)
}
// @from(Ln 246676, Col 0)
function jc() {
    let A = process.env.CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS;
    if (A) {
        let q = parseInt(A, 10);
        if (!isNaN(q) && q > 0) return q
    }
    return Zp9
}
// @from(Ln 246684, Col 0)
async function Gp9(A, q, K) {
    k(`git pull: cwd=${A} ref=${q??"default"}`);
    let Y = {
            ...process.env,
            ...ip6
        },
        z = K?.disableCredentialHelper ? ["-c", "credential.helper="] : [];
    if (q) {
        let w = await RA(hA(), [...z, "fetch", "origin", q], {
            cwd: A,
            timeout: jc(),
            stdin: "ignore",
            env: Y
        });
        if (w.code !== 0) return t01(w);
        let O = await RA(hA(), [...z, "checkout", q], {
            cwd: A,
            timeout: jc(),
            stdin: "ignore",
            env: Y
        });
        if (O.code !== 0) return t01(O);
        let $ = await RA(hA(), [...z, "pull", "origin", q], {
            cwd: A,
            timeout: jc(),
            stdin: "ignore",
            env: Y
        });
        if ($.code !== 0) return t01($);
        return await z24(A, z, Y, K?.sparsePaths), $
    }
    let _ = await RA(hA(), [...z, "pull", "origin", "HEAD"], {
        cwd: A,
        timeout: jc(),
        stdin: "ignore",
        env: Y
    });
    if (_.code !== 0) return t01(_);
    return await z24(A, z, Y, K?.sparsePaths), _
}
// @from(Ln 246724, Col 0)
async function z24(A, q, K, Y) {
    if (Y && Y.length > 0) return;
    if (!await $1().stat(TX(A, ".gitmodules")).then(() => !0, () => !1)) return;
    let _ = await RA(hA(), ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes", ...q, "submodule", "update", "--init", "--recursive", "--depth", "1"], {
        cwd: A,
        timeout: jc(),
        stdin: "ignore",
        env: K
    });
    if (_.code !== 0) k(`git submodule update failed (non-fatal): ${_.stderr}`, {
        level: "warn"
    })
}
// @from(Ln 246738, Col 0)
function t01(A) {
    if (A.code === 0) return A;
    if (A.error?.includes("timed out")) {
        let q = Math.round(jc() / 1000);
        return {
            ...A,
            stderr: `Git pull timed out after ${q}s. Try increasing the timeout via CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS environment variable.

Original error: ${A.stderr}`
        }
    }
    if (A.stderr.includes("REMOTE HOST IDENTIFICATION HAS CHANGED")) return {
        ...A,
        stderr: `SSH host key for this marketplace's git host has changed (server key rotation or possible MITM). Remove the stale entry with: ssh-keygen -R <host>
Then connect once manually to accept the new key.

Original error: ${A.stderr}`
    };
    if (A.stderr.includes("Host key verification failed")) return {
        ...A,
        stderr: `SSH host key verification failed while updating marketplace. The host key is not in your known_hosts file. Connect once manually to add it (e.g., ssh -T git@<host>), or remove and re-add the marketplace with an HTTPS URL.

Original error: ${A.stderr}`
    };
    if (A.stderr.includes("Permission denied (publickey)") || A.stderr.includes("Could not read from remote repository")) return {
        ...A,
        stderr: `SSH authentication failed while updating marketplace. Please ensure your SSH keys are configured.

Original error: ${A.stderr}`
    };
    if (A.stderr.includes("timed out") || A.stderr.includes("Could not resolve host")) return {
        ...A,
        stderr: `Network error while updating marketplace. Please check your internet connection.

Original error: ${A.stderr}`
    };
    return A
}
// @from(Ln 246776, Col 0)
async function O24() {
    try {
        let A = await z8("ssh", ["-T", "-o", "BatchMode=yes", "-o", "ConnectTimeout=2", "-o", "StrictHostKeyChecking=yes", "git@github.com"], {
                timeout: 3000
            }),
            q = A.code === 1 && (A.stderr?.includes("successfully authenticated") || A.stdout?.includes("successfully authenticated"));
        return k(`SSH config check: code=${A.code} configured=${q}`), q
    } catch (A) {
        return k(`SSH configuration check failed: ${_1(A)}`, {
            level: "warn"
        }), !1
    }
}
// @from(Ln 246790, Col 0)
function fp9(A) {
    return A.includes("Authentication failed") || A.includes("could not read Username") || A.includes("terminal prompts disabled") || A.includes("403") || A.includes("401")
}
// @from(Ln 246794, Col 0)
function _24(A) {
    return A.match(/^[^@]+@([^:]+):/)?.[1] ?? null
}
// @from(Ln 246797, Col 0)
async function Tp9(A, q, K, Y) {
    let z = Y && Y.length > 0,
        _ = ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes", "clone", "--depth", "1"];
    if (z) _.push("--filter=blob:none", "--no-checkout");
    else _.push("--recurse-submodules", "--shallow-submodules");
    if (K) _.push("--branch", K);
    _.push(A, q);
    let w = jc();
    k(`git clone: url=${H96(A)} ref=${K??"default"} timeout=${w}ms`);
    let O = await RA(hA(), _, {
            timeout: w,
            stdin: "ignore",
            env: {
                ...process.env,
                ...ip6
            }
        }),
        $ = H96(A);
    if (A !== $) {
        if (O.error) O.error = O.error.replaceAll(A, $);
        if (O.stderr) O.stderr = O.stderr.replaceAll(A, $)
    }
    if (O.code === 0) {
        if (z) {
            let H = await RA(hA(), ["sparse-checkout", "set", "--cone", "--", ...Y], {
                cwd: q,
                timeout: w,
                stdin: "ignore",
                env: {
                    ...process.env,
                    ...ip6
                }
            });
            if (H.code !== 0) return {
                code: H.code,
                stderr: `git sparse-checkout set failed: ${H.stderr}`
            };
            let j = await RA(hA(), ["checkout", "HEAD"], {
                cwd: q,
                timeout: w,
                stdin: "ignore",
                env: {
                    ...process.env,
                    ...ip6
                }
            });
            if (j.code !== 0) return {
                code: j.code,
                stderr: `git checkout after sparse-checkout failed: ${j.stderr}`
            }
        }
        return k(`git clone succeeded: ${H96(A)}`), O
    }
    if (k(`git clone failed: url=${H96(A)} code=${O.code} error=${O.error??"none"} stderr=${O.stderr}`, {
            level: "warn"
        }), O.error?.includes("timed out")) return {
        ...O,
        stderr: `Git clone timed out after ${Math.round(w/1000)}s. The repository may be too large for the current timeout. Set CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS to increase it (e.g., 300000 for 5 minutes).

Original error: ${O.stderr}`
    };
    if (O.stderr) {
        if (O.stderr.includes("REMOTE HOST IDENTIFICATION HAS CHANGED")) {
            let H = _24(A),
                j = H ? `ssh-keygen -R ${H}` : "ssh-keygen -R <host>";
            return {
                ...O,
                stderr: `SSH host key has changed (server key rotation or possible MITM). Remove the stale known_hosts entry:
  ${j}
Then connect once manually to verify and accept the new key.

Original error: ${O.stderr}`
            }
        }
        if (O.stderr.includes("Host key verification failed")) {
            let H = _24(A),
                j = H ? `ssh -T git@${H}` : "ssh -T git@<host>";
            return {
                ...O,
                stderr: `SSH host key is not in your known_hosts file. To add it, connect once manually (this will show the fingerprint for you to verify):
  ${j}

Or use an HTTPS URL instead (recommended for public repos).

Original error: ${O.stderr}`
            }
        }
        if (O.stderr.includes("Permission denied (publickey)") || O.stderr.includes("Could not read from remote repository")) return {
            ...O,
            stderr: `SSH authentication failed. Please ensure your SSH keys are configured for GitHub, or use an HTTPS URL instead.

Original error: ${O.stderr}`
        };
        if (fp9(O.stderr)) return {
            ...O,
            stderr: `HTTPS authentication failed. Please ensure your credential helper is configured (e.g., gh auth login).

Original error: ${O.stderr}`
        };
        if (O.stderr.includes("timed out") || O.stderr.includes("timeout") || O.stderr.includes("Could not resolve host")) return {
            ...O,
            stderr: `Network error or timeout while cloning repository. Please check your internet connection and try again.

Original error: ${O.stderr}`
        }
    }
    if (!O.stderr) return {
        code: O.code,
        stderr: O.error || `git clone exited with code ${O.code} (no stderr output). Run with --debug to see the full command.`
    };
    return O
}
// @from(Ln 246910, Col 0)
function RR(A, q) {
    if (!A) return;
    try {
        A(q)
    } catch (K) {
        k(`Progress callback error: ${_1(K)}`, {
            level: "warn"
        })
    }
}
// @from(Ln 246920, Col 0)
async function vp9(A, q) {
    let K = {
        ...process.env,
        ...ip6
    };
    if (q && q.length > 0) return RA(hA(), ["sparse-checkout", "set", "--cone", "--", ...q], {
        cwd: A,
        timeout: jc(),
        stdin: "ignore",
        env: K
    });
    let Y = await RA(hA(), ["config", "--get", "core.sparseCheckout"], {
        cwd: A,
        stdin: "ignore",
        env: K
    });
    if (Y.code === 0 && Y.stdout.trim() === "true") return {
        code: 1,
        stderr: "sparsePaths removed from config but repository is sparse; re-cloning for full checkout"
    };
    return {
        code: 0,
        stderr: ""
    }
}
// @from(Ln 246945, Col 0)
async function $c(A, q, K, Y, z, _) {
    let w = $1(),
        O = Math.round(jc() / 1000);
    RR(z, `Refreshing marketplace cache (timeout: ${O}s)…`);
    let $ = await vp9(q, Y);
    if ($.code === 0) {
        let J = await Gp9(q, K, {
            disableCredentialHelper: _?.disableCredentialHelper,
            sparsePaths: Y
        });
        if (J.code === 0) return;
        k(`git pull failed, will re-clone: ${J.stderr}`, {
            level: "warn"
        })
    } else k(`sparse-checkout reconcile requires re-clone: ${$.stderr}`);
    try {
        await w.rm(q, {
            recursive: !0
        }), k(`Found stale marketplace directory at ${q}, cleaning up to allow re-clone`, {
            level: "warn"
        }), RR(z, "Found stale directory, cleaning up and re-cloning…")
    } catch (J) {
        if (J.code !== "ENOENT") {
            let M = _1(J);
            throw Error(`Failed to clean up existing marketplace directory. Please manually delete the directory at ${q} and try again.

Technical details: ${M}`)
        }
    }
    let H = K ? ` (ref: ${K})` : "";
    RR(z, `Cloning repository (timeout: ${O}s): ${H96(A)}${H}`);
    let j = await Tp9(A, q, K, Y);
    if (j.code !== 0) {
        try {
            await w.rm(q, {
                recursive: !0,
                force: !0
            })
        } catch {}
        throw Error(`Failed to clone marketplace repository: ${j.stderr}`)
    }
    RR(z, "Clone complete, validating marketplace…")
}
// @from(Ln 246989, Col 0)
function Np9(A) {
    return Object.fromEntries(Object.entries(A).map(([q]) => [q, "***REDACTED***"]))
}
// @from(Ln 246993, Col 0)
function H96(A) {
    try {
        let q = new URL(A);
        if ((q.protocol === "http:" || q.protocol === "https:") && (q.username || q.password)) {
            if (q.username) q.username = "***";
            if (q.password) q.password = "***";
            return q.toString()
        }
    } catch {}
    return A
}
// @from(Ln 247004, Col 0)
async function $24(A, q, K, Y) {
    let z = $1(),
        _ = H96(A);
    if (RR(Y, `Downloading marketplace from ${_}`), k(`Downloading marketplace from URL: ${_}`), K && Object.keys(K).length > 0) k(`Using custom headers: ${B6(Np9(K))}`);
    let w = {
            ...K,
            "User-Agent": "Claude-Code-Plugin-Manager"
        },
        O;
    try {
        O = await X8.get(A, {
            timeout: 1e4,
            headers: w
        })
    } catch (j) {
        if (X8.isAxiosError(j)) {
            if (j.code === "ECONNREFUSED" || j.code === "ENOTFOUND") throw Error(`Could not connect to ${_}. Please check your internet connection and verify the URL is correct.

Technical details: ${j.message}`);
            if (j.code === "ETIMEDOUT") throw Error(`Request timed out while downloading marketplace from ${_}. The server may be slow or unreachable.

Technical details: ${j.message}`);
            if (j.response) throw Error(`HTTP ${j.response.status} error while downloading marketplace from ${_}. The marketplace file may not exist at this URL.

Technical details: ${j.message}`)
        }
        throw Error(`Failed to download marketplace from ${_}: ${_1(j)}`)
    }
    RR(Y, "Validating marketplace data");
    let $ = Vo().safeParse(O.data);
    if (!$.success) throw new MG(`Invalid marketplace schema from URL: ${$.error.issues.map((j)=>`${j.path.join(".")}: ${j.message}`).join(", ")}`, _, O.data);
    RR(Y, "Saving marketplace to cache");
    let H = TX(q, "..");
    await z.mkdir(H), fz(q, B6($.data, null, 2), {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 247043, Col 0)
function Vp9(A) {
    return A.source === "github" ? A.repo.replace("/", "-") : A.source === "npm" ? A.package.replace("@", "").replace("/", "-") : A.source === "file" ? K24(A.path).replace(".json", "") : A.source === "directory" ? K24(A.path) : "temp_" + Date.now()
}
// @from(Ln 247046, Col 0)
async function pk8(A, q) {
    let Y = await $1().readFile(A, {
            encoding: "utf-8"
        }),
        z;
    try {
        z = i1(Y)
    } catch (w) {
        throw new MG(`Invalid JSON in ${A}: ${_1(w)}`, A, Y)
    }
    let _ = q.safeParse(z);
    if (!_.success) throw new MG(`Invalid schema: ${A} ${_.error?.issues.map((w)=>`${w.path.join(".")}: ${w.message}`).join(", ")}`, A, z);
    return _.data
}
// @from(Ln 247060, Col 0)
async function Qk8(A, q) {
    let K = $1(),
        Y = qW1();
    await K.mkdir(Y);
    let z, _, w = !1,
        O = Vp9(A);
    try {
        switch (A.source) {
            case "url": {
                z = TX(Y, `${O}.json`), w = !0, await $24(A.url, z, A.headers, q), _ = z;
                break
            }
            case "github": {
                let M = `git@github.com:${A.repo}.git`,
                    D = `https://github.com/${A.repo}.git`;
                z = TX(Y, O), w = !0;
                let X = null;
                if (await O24()) {
                    RR(q, `Cloning via SSH: ${M}`);
                    try {
                        await $c(M, z, A.ref, A.sparsePaths, q)
                    } catch (W) {
                        X = W instanceof Error ? W : Error(String(W)), _6(X), RR(q, `SSH clone failed, retrying with HTTPS: ${D}`), k(`SSH clone failed for ${A.repo} despite SSH being configured, falling back to HTTPS`, {
                            level: "info"
                        }), await K.rm(z, {
                            recursive: !0,
                            force: !0
                        });
                        try {
                            await $c(D, z, A.ref, A.sparsePaths, q), X = null
                        } catch (Z) {
                            X = Z instanceof Error ? Z : Error(String(Z)), _6(X)
                        }
                    }
                } else {
                    RR(q, `SSH not configured, cloning via HTTPS: ${D}`), k(`SSH not configured for GitHub, using HTTPS for ${A.repo}`, {
                        level: "info"
                    });
                    try {
                        await $c(D, z, A.ref, A.sparsePaths, q)
                    } catch (W) {
                        X = W instanceof Error ? W : Error(String(W)), _6(X), RR(q, `HTTPS clone failed, retrying with SSH: ${M}`), k(`HTTPS clone failed for ${A.repo} (${X.message}), falling back to SSH`, {
                            level: "info"
                        }), await K.rm(z, {
                            recursive: !0,
                            force: !0
                        });
                        try {
                            await $c(M, z, A.ref, A.sparsePaths, q), X = null
                        } catch (Z) {
                            X = Z instanceof Error ? Z : Error(String(Z)), _6(X)
                        }
                    }
                }
                if (X) throw X;
                _ = TX(z, A.path || ".claude-plugin/marketplace.json");
                break
            }
            case "git": {
                z = TX(Y, O), w = !0, await $c(A.url, z, A.ref, A.sparsePaths, q), _ = TX(z, A.path || ".claude-plugin/marketplace.json");
                break
            }
            case "npm":
                throw Error("NPM marketplace sources not yet implemented");
            case "file": {
                let M = Hc(A.path);
                _ = M, z = Y24(Y24(M)), w = !1;
                break
            }
            case "directory": {
                let M = Hc(A.path);
                _ = TX(M, ".claude-plugin", "marketplace.json"), z = M, w = !1;
                break
            }
            default:
                throw Error("Unsupported marketplace source type")
        }
        k(`Reading marketplace from ${_}`);
        let $;
        try {
            $ = await pk8(_, Vo())
        } catch (M) {
            if (M.code === "ENOENT") throw Error(`Marketplace file not found at ${_}`);
            throw Error(`Failed to parse marketplace file at ${_}: ${_1(M)}`)
        }
        let H = TX(Y, $.name),
            j = Hc(H),
            J = Hc(Y);
        if (!j.startsWith(J + e01)) throw Error(`Marketplace name '${$.name}' resolves to a path outside the cache directory`);
        if (z !== H && !No(A)) try {
            try {
                q?.("Cleaning up old marketplace cache…")
            } catch (M) {
                k(`Progress callback error: ${_1(M)}`, {
                    level: "warn"
                })
            }
            await K.rm(H, {
                recursive: !0,
                force: !0
            }), await K.rename(z, H), z = H, w = !1
        } catch (M) {
            let D = _1(M);
            throw Error(`Failed to finalize marketplace cache. Please manually delete the directory at ${H} if it exists and try again.

Technical details: ${D}`)
        }
        return {
            marketplace: $,
            cachePath: z
        }
    } catch ($) {
        if (w && z && !No(A)) try {
            await K.rm(z, {
                recursive: !0,
                force: !0
            })
        } catch (H) {
            k(`Warning: Failed to clean up temporary marketplace cache at ${z}: ${_1(H)}`, {
                level: "warn"
            })
        }
        throw $
    }
}
// @from(Ln 247185, Col 0)
async function sB(A, q) {
    let K = A;
    if (No(A) && !w24(A.path)) K = {
        ...A,
        path: Hc(A.path)
    };
    if (!Y96(K)) {
        if (Fp6(K)) throw Error(`Marketplace source '${z96(K)}' is blocked by enterprise policy.`);
        let H = Ke() || [],
            j = E_4(),
            J = fk8(K),
            M = `Marketplace source '${z96(K)}'`;
        if (J) M += ` (${J})`;
        if (M += " is blocked by enterprise policy.", H.length > 0) M += ` Allowed sources: ${H.map((D)=>z96(D)).join(", ")}`;
        else M += " No external marketplaces are allowed.";
        if (K.source === "github" && j.length > 0) M += `

Tip: The shorthand "${K.repo}" assumes github.com. For internal GitHub Enterprise, use the full URL:
  git@your-github-host.com:${K.repo}.git`;
        throw Error(M)
    }
    let Y = await C3();
    for (let [H, j] of Object.entries(Y))
        if (TP(j.source, K)) return k(`Source already materialized as '${H}', skipping clone`), {
            name: H,
            alreadyMaterialized: !0,
            resolvedSource: K
        };
    let {
        marketplace: z,
        cachePath: _
    } = await Qk8(K, q), w = u57(z.name, K);
    if (w) throw Error(w);
    let O = await C3(),
        $ = O[z.name];
    if ($) {
        if (op6($.installLocation)) throw Error(`Marketplace '${z.name}' is seed-managed (${tB()}). To use a different source, ask your admin to update the seed, or use a different marketplace name.`);
        if (k(`Marketplace '${z.name}' exists with different source — overwriting`), !No($.source)) {
            let H = Hc(qW1()),
                j = Hc($.installLocation);
            if (j === H || j.startsWith(H + e01)) await $1().rm($.installLocation, {
                recursive: !0,
                force: !0
            });
            else k(`Skipping cleanup of old installLocation (${$.installLocation}) — ` + `outside ${H}. The path is corrupted; leaving it alone and overwriting the config entry.`, {
                level: "warn"
            })
        }
    }
    return O[z.name] = {
        source: K,
        installLocation: _,
        lastUpdated: new Date().toISOString()
    }, await j96(O), k(`Added marketplace source: ${z.name}`), {
        name: z.name,
        alreadyMaterialized: !1,
        resolvedSource: K
    }
}
// @from(Ln 247244, Col 0)
async function AZ6(A) {
    let q = await C3();
    if (!q[A]) throw Error(`Marketplace '${A}' not found`);
    let K = q[A];
    if (op6(K.installLocation)) {
        let j = tB();
        throw Error(`Marketplace '${A}' is registered from the read-only seed directory (${j}) and will be re-registered on next startup. To stop using its plugins: claude plugin disable <plugin>@${A}`)
    }
    delete q[A], await j96(q);
    let Y = $1(),
        z = qW1(),
        _ = TX(z, A);
    await Y.rm(_, {
        recursive: !0,
        force: !0
    });
    let w = TX(z, `${A}.json`);
    await Y.rm(w, {
        force: !0
    });
    let O = ["userSettings", "projectSettings", "localSettings"];
    for (let j of O) {
        let J = L8(j);
        if (!J) continue;
        let M = !1,
            D = {};
        if (J.extraKnownMarketplaces?.[A]) {
            let X = {
                ...J.extraKnownMarketplaces
            };
            X[A] = void 0, D.extraKnownMarketplaces = X, M = !0
        }
        if (J.enabledPlugins) {
            let X = `@${A}`,
                P = {
                    ...J.enabledPlugins
                },
                W = !1;
            for (let Z in P)
                if (Z.endsWith(X)) P[Z] = void 0, W = !0;
            if (W) D.enabledPlugins = P, M = !0
        }
        if (M) {
            let X = TA(j, D);
            if (X.error) _6(X.error), k(`Failed to clean up marketplace '${A}' from ${j} settings: ${X.error.message}`);
            else k(`Cleaned up marketplace '${A}' from ${j} settings`)
        }
    }
    let {
        orphanedPaths: $,
        removedPluginIds: H
    } = u_4(A);
    for (let j of $) await tW6(j);
    for (let j of H) Yz1(j);
    k(`Removed marketplace source: ${A}`)
}
// @from(Ln 247300, Col 0)
async function np6(A) {
    let q = TX(A, ".claude-plugin", "marketplace.json");
    try {
        return await pk8(q, Vo())
    } catch (K) {
        if (K instanceof MG) throw K;
        let Y = K.code;
        if (Y !== "ENOENT" && Y !== "ENOTDIR") throw K
    }
    return await pk8(A, Vo())
}
// @from(Ln 247311, Col 0)
async function Uk8(A) {
    let q = $1(),
        K = AW1();
    try {
        let Y = await q.readFile(K, {
                encoding: "utf-8"
            }),
            _ = i1(Y)[A];
        if (!_) return null;
        return await np6(_.installLocation)
    } catch (Y) {
        if (Y.code === "ENOENT") return null;
        return k(`Failed to read cached marketplace ${A}: ${_1(Y)}`, {
            level: "warn"
        }), null
    }
}
// @from(Ln 247328, Col 0)
async function dk8(A) {
    let {
        name: q,
        marketplace: K
    } = n3(A);
    if (!q || !K) return null;
    let Y = $1(),
        z = AW1();
    try {
        let _ = await Y.readFile(z, {
                encoding: "utf-8"
            }),
            O = i1(_)[K];
        if (!O) return null;
        let $ = await Uk8(K);
        if (!$) return null;
        let H = $.plugins.find((j) => j.name === q);
        if (!H) return null;
        return {
            entry: H,
            marketplaceInstallLocation: O.installLocation
        }
    } catch {
        return null
    }
}
// @from(Ln 247354, Col 0)
async function Qv(A) {
    let q = await dk8(A);
    if (q) return q;
    let {
        name: K,
        marketplace: Y
    } = n3(A);
    if (!K || !Y) return null;
    try {
        let _ = (await C3())[Y];
        if (!_) return null;
        let O = (await j0(Y)).plugins.find(($) => $.name === K);
        if (!O) return null;
        return {
            entry: O,
            marketplaceInstallLocation: _.installLocation
        }
    } catch (z) {
        return k(`Could not find plugin ${A}: ${_1(z)}`, {
            level: "debug"
        }), null
    }
}
// @from(Ln 247377, Col 0)
async function H24() {
    let A = await C3();
    for (let [q, K] of Object.entries(A)) {
        if (op6(K.installLocation)) {
            k(`Skipping seed-managed marketplace '${q}' in bulk refresh`);
            continue
        }
        try {
            let {
                cachePath: Y
            } = await Qk8(K.source);
            A[q].lastUpdated = new Date().toISOString(), A[q].installLocation = Y
        } catch (Y) {
            k(`Failed to refresh marketplace ${q}: ${_1(Y)}`, {
                level: "error"
            })
        }
    }
    await j96(A)
}
// @from(Ln 247397, Col 0)
async function we(A, q, K) {
    let Y = await C3(),
        z = Y[A];
    if (!z) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(Y).join(", ")}`);
    j0.cache?.delete?.(A);
    try {
        let {
            installLocation: _,
            source: w
        } = z;
        if (op6(_)) {
            let O = tB();
            throw Error(`Marketplace '${A}' is seed-managed (${O}) and its content is controlled by the seed image. To update: ask your admin to update the seed.`)
        }
        if (!No(w)) {
            let O = Hc(qW1()),
                $ = Hc(_);
            if ($ !== O && !$.startsWith(O + e01)) throw Error(`Marketplace '${A}' has a corrupted installLocation (${_}) — expected a path inside ${O}. This can happen after cross-platform path writes or manual edits to known_marketplaces.json. Run: claude plugin marketplace remove "${A}" and re-add it.`)
        }
        if (w.source === "github" || w.source === "git") {
            if (w.source === "github") {
                let O = `git@github.com:${w.repo}.git`,
                    $ = `https://github.com/${w.repo}.git`;
                if (t6(process.env.CLAUDE_CODE_REMOTE)) await $c($, _, w.ref, w.sparsePaths, q, K);
                else {
                    let H = await O24(),
                        j = H ? O : $,
                        J = H ? $ : O;
                    try {
                        await $c(j, _, w.ref, w.sparsePaths, q, K)
                    } catch {
                        k(`Marketplace refresh failed with ${H?"SSH":"HTTPS"} for ${w.repo}, falling back to ${H?"HTTPS":"SSH"}`, {
                            level: "info"
                        }), await $c(J, _, w.ref, w.sparsePaths, q, K)
                    }
                }
            } else await $c(w.url, _, w.ref, w.sparsePaths, q, K);
            try {
                await np6(_)
            } catch {
                let O = w.source === "github" ? w.repo : H96(w.url);
                throw Error(`The marketplace.json file is no longer present in this repository.

${A==="claude-code-plugins"?`We've deprecated "claude-code-plugins" in favor of "claude-plugins-official".`:"This marketplace may have been deprecated or moved to a new location."}
Source: ${O}

You can remove this marketplace with: claude plugin marketplace remove "${A}"`)
            }
        } else if (w.source === "url") await $24(w.url, _, w.headers, q);
        else if (No(w)) RR(q, "Validating local marketplace"), await np6(_);
        else throw Error("Unsupported marketplace source type for refresh");
        Y[A].lastUpdated = new Date().toISOString(), await j96(Y), k(`Successfully refreshed marketplace: ${A}`)
    } catch (_) {
        let w = _ instanceof Error ? _.message : String(_);
        throw k(`Failed to refresh marketplace ${A}: ${w}`, {
            level: "error"
        }), Error(`Failed to refresh marketplace '${A}': ${w}`)
    }
}
// @from(Ln 247456, Col 0)
async function j24(A, q) {
    let K = await C3(),
        Y = K[A];
    if (!Y) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(K).join(", ")}`);
    if (op6(Y.installLocation)) throw Error(`Marketplace '${A}' is seed-managed (${tB()}) and auto-update is always disabled for seed content. To update: ask your admin to update the seed.`);
    if (Y.autoUpdate === q) return;
    K[A] = {
        ...Y,
        autoUpdate: q
    }, await j96(K);
    let z = Pp9(A);
    if (z) {
        let _ = L8(z)?.extraKnownMarketplaces?.[A];
        if (_) rp6(A, {
            source: _.source,
            autoUpdate: q
        }, z)
    }
    k(`Set autoUpdate=${q} for marketplace: ${A}`)
}
// @from(Ln 247476, Col 4)
ip6
// @from(Ln 247476, Col 9)
Zp9 = 120000
// @from(Ln 247477, Col 4)
j0
// @from(Ln 247478, Col 4)
Aw = E(() => {
    kK();
    U4();
    Q$6();
    A8();
    ze();
    SA();
    g1();
    H1();
    k1();
    Eq();
    s8();
    i8();
    IW();
    dB();
    B01();
    BI();
    g1();
    fX();
    Uv();
    eu();
    $5();
    ip6 = {
        GIT_TERMINAL_PROMPT: "0",
        GIT_ASKPASS: ""
    };
    j0 = e1(async (A) => {
        let q = await C3(),
            K = q[A];
        if (!K) throw Error(`Marketplace '${A}' not found in configuration. Available marketplaces: ${Object.keys(q).join(", ")}`);
        if (No(K.source) && !w24(K.source.path)) throw Error(`Marketplace "${A}" has a relative source path (${K.source.path}) ` + "in known_marketplaces.json — this is stale state from an older " + `Claude Code version. Run 'claude marketplace remove ${A}' and re-add it from the original project directory.`);
        try {
            return await np6(K.installLocation)
        } catch (z) {
            k(`Cache corrupted or missing for marketplace ${A}, re-fetching from source: ${_1(z)}`, {
                level: "warn"
            })
        }
        let Y;
        try {
            ({
                marketplace: Y
            } = await Qk8(K.source))
        } catch (z) {
            throw Error(`Failed to load marketplace "${A}" from source (${K.source.source}): ${_1(z)}`)
        }
        return q[A].lastUpdated = new Date().toISOString(), await j96(q), Y
    })
})
// @from(Ln 247527, Col 0)
async function Jc(A, q, K, Y, z, _) {
    if (K?.version) return k(`Using manifest version for ${A}: ${K.version}`), K.version;
    if (z) return k(`Using provided version for ${A}: ${z}`), z;
    if (_) {
        let w = _.substring(0, 12);
        return k(`Using pre-resolved git SHA for ${A}: ${w}`), w
    }
    if (Y) {
        let w = await kp9(Y);
        if (w) {
            let O = w.substring(0, 12);
            return k(`Using git SHA for ${A}: ${O}`), O
        }
    }
    return k(`No version found for ${A}, using 'unknown'`), "unknown"
}
// @from(Ln 247544, Col 0)
function kp9(A) {
    return g31(A)
}
// @from(Ln 247547, Col 4)
YW1 = E(() => {
    H1();
    yo()
})
// @from(Ln 247552, Col 0)
function J96() {
    return w8("tengu_orchid_trellis", !1)
}
// @from(Ln 247556, Col 0)
function ck8(A, q) {
    if (n3(A).marketplace) return A;
    let K = n3(q).marketplace;
    if (!K || K === Ep9) return A;
    return `${A}@${K}`
}
// @from(Ln 247562, Col 0)
async function J24(A, q, K) {
    let Y = n3(A).marketplace,
        z = [],
        _ = new Set,
        w = [];
    async function O(H, j) {
        if (H !== A && K.has(H)) return null;
        if (n3(H).marketplace !== Y) return {
            ok: !1,
            reason: "cross-marketplace",
            dependency: H,
            requiredBy: j
        };
        if (w.includes(H)) return {
            ok: !1,
            reason: "cycle",
            chain: [...w, H]
        };
        if (_.has(H)) return null;
        _.add(H);
        let M = await q(H);
        if (!M) return {
            ok: !1,
            reason: "not-found",
            missing: H,
            requiredBy: j
        };
        w.push(H);
        for (let D of M.dependencies ?? []) {
            let X = ck8(D, H),
                P = await O(X, H);
            if (P) return P
        }
        return w.pop(), z.push(H), null
    }
    let $ = await O(A, A);
    if ($) return $;
    return {
        ok: !0,
        closure: z
    }
}
// @from(Ln 247605, Col 0)
function M24(A) {
    let q = new Set(A.map(($) => $.source)),
        K = new Set(A.filter(($) => $.enabled).map(($) => $.source)),
        Y = new Set(A.map(($) => n3($.source).name)),
        z = new Map;
    for (let $ of K) {
        let H = n3($).name;
        z.set(H, (z.get(H) ?? 0) + 1)
    }
    let _ = [],
        w = !0;
    while (w) {
        w = !1;
        for (let $ of A) {
            if (!K.has($.source)) continue;
            for (let H of $.manifest.dependencies ?? []) {
                let j = ck8(H, $.source),
                    J = !n3(j).marketplace;
                if (!(J ? (z.get(j) ?? 0) > 0 : K.has(j))) {
                    K.delete($.source);
                    let D = z.get($.name) ?? 0;
                    if (D <= 1) z.delete($.name);
                    else z.set($.name, D - 1);
                    _.push({
                        type: "dependency-unsatisfied",
                        source: $.source,
                        plugin: $.name,
                        dependency: j,
                        reason: (J ? Y.has(j) : q.has(j)) ? "not-enabled" : "not-found"
                    }), w = !0;
                    break
                }
            }
        }
    }
    return {
        demoted: new Set(A.filter(($) => $.enabled && !K.has($.source)).map(($) => $.source)),
        errors: _
    }
}
// @from(Ln 247646, Col 0)
function lk8(A, q) {
    let {
        name: K
    } = n3(A);
    return q.filter((Y) => Y.enabled && Y.source !== A && (Y.manifest.dependencies ?? []).some((z) => {
        let _ = ck8(z, Y.source);
        return n3(_).marketplace ? _ === A : _ === K
    })).map((Y) => Y.name)
}
// @from(Ln 247656, Col 0)
function D24(A) {
    return new Set(Object.entries(L8(A)?.enabledPlugins ?? {}).filter(([, q]) => q === !0 || Array.isArray(q)).map(([q]) => q))
}
// @from(Ln 247660, Col 0)
function X24(A) {
    if (A.length === 0) return "";
    let q = A.length;
    return ` (+ ${q} ${q===1?"dependency":"dependencies"})`
}
// @from(Ln 247666, Col 0)
function ik8(A) {
    if (!A || A.length === 0) return "";
    return ` — warning: required by ${A.join(", ")}`
}
// @from(Ln 247670, Col 4)
Ep9 = "inline"
// @from(Ln 247671, Col 4)
zW1 = E(() => {
    BI();
    i8();
    HA()
})
// @from(Ln 247690, Col 0)
function P24() {
    return new Date().toISOString()
}
// @from(Ln 247694, Col 0)
function _W1(A, q) {
    let K = ok8(A, q),
        Y = ok8(A) + ak8;
    if (!K.startsWith(Y) && K !== ok8(A)) throw Error(`Path traversal detected: "${q}" would escape the base directory`);
    return K
}
// @from(Ln 247700, Col 0)
async function ap6(A, q, K = "user", Y, z) {
    let _ = typeof q.source === "string" && z ? z : q.source,
        w = await sp6(_, {
            manifest: q
        }),
        O = z || w.path,
        $ = w.gitCommitSha ?? await g01(O),
        H = P24(),
        j = await Jc(A, q.source, w.manifest, O, q.version, w.gitCommitSha),
        J = FI(A, j),
        M = w.path;
    if (w.path !== J) {
        await $1().mkdir(rk8(J)), await yp9(J, {
            recursive: !0,
            force: !0
        });
        let D = w.path.endsWith(ak8) ? w.path : w.path + ak8;
        if (J.startsWith(D)) {
            let P = Lp9(rk8(w.path), `.claude-plugin-temp-${Date.now()}-${Rp9(4).toString("hex")}`);
            await nk8(w.path, P), await $1().mkdir(rk8(J)), await nk8(P, J)
        } else await nk8(w.path, J);
        M = J
    }
    if (pI()) {
        let D = KZ6(A, j);
        await n01(M, D), M = D
    }
    return Lk8(A, {
        version: j,
        installedAt: H,
        lastUpdated: H,
        installPath: M,
        gitCommitSha: $
    }, K, Y), M
}
// @from(Ln 247736, Col 0)
function W24(A, q = "user", K) {
    let Y = P24();
    Lk8(A.pluginId, {
        version: A.version || "unknown",
        installedAt: Y,
        lastUpdated: Y,
        installPath: A.installPath
    }, q, K)
}
// @from(Ln 247746, Col 0)
function sk8(A) {
    switch (A.reason) {
        case "cycle":
            return `Dependency cycle: ${A.chain.join(" → ")}`;
        case "cross-marketplace":
            return `Dependency "${A.dependency}" (required by ${A.requiredBy}) is in a different marketplace. Cross-marketplace dependencies are blocked — install it manually first.`;
        case "not-found": {
            let {
                marketplace: q
            } = n3(A.missing);
            return q ? `Dependency "${A.missing}" (required by ${A.requiredBy}) not found. Is the "${q}" marketplace added?` : `Dependency "${A.missing}" (required by ${A.requiredBy}) not found in any configured marketplace`
        }
    }
}
// @from(Ln 247760, Col 0)
async function tk8({
    pluginId: A,
    entry: q,
    scope: K,
    marketplaceInstallLocation: Y
}) {
    let z = cB(K),
        _ = new Map;
    if (SC6(q.source) && !Y) return {
        ok: !1,
        reason: "local-source-no-location",
        pluginName: q.name
    };
    if (Y) _.set(A, {
        entry: q,
        marketplaceInstallLocation: Y
    });
    let w;
    if (J96()) w = await J24(A, async (J) => {
        if (_.has(J)) return _.get(J).entry;
        if (J === A) return q;
        let M = await Qv(J);
        if (M) _.set(J, M);
        return M?.entry ?? null
    }, D24(z));
    else w = {
        ok: !0,
        closure: [A]
    };
    if (!w.ok) return {
        ok: !1,
        reason: "resolution-failed",
        resolution: w
    };
    let O = {};
    for (let J of w.closure) O[J] = !0;
    let {
        error: $
    } = TA(z, {
        enabledPlugins: {
            ...L8(z)?.enabledPlugins,
            ...O
        }
    });
    if ($) return {
        ok: !1,
        reason: "settings-write-failed",
        message: $.message
    };
    let H = K !== "user" ? G1() : void 0;
    for (let J of w.closure) {
        let M = _.get(J);
        if (!M && J === A) {
            let P = (await Qv(J))?.marketplaceInstallLocation;
            if (P) M = {
                entry: q,
                marketplaceInstallLocation: P
            }
        }
        if (!M) continue;
        let D, {
            source: X
        } = M.entry;
        if (SC6(X)) D = _W1(M.marketplaceInstallLocation, X);
        await ap6(J, M.entry, K, H, D)
    }
    HY();
    let j = X24(w.closure.filter((J) => J !== A));
    return {
        ok: !0,
        closure: w.closure,
        depNote: j
    }
}
// @from(Ln 247834, Col 0)
async function qZ6({
    pluginId: A,
    entry: q,
    marketplaceName: K,
    scope: Y = "user"
}) {
    try {
        let _ = (await Qv(A))?.marketplaceInstallLocation,
            w = await tk8({
                pluginId: A,
                entry: q,
                scope: Y,
                marketplaceInstallLocation: _
            });
        if (!w.ok) switch (w.reason) {
            case "local-source-no-location":
                return {
                    success: !1, error: `Cannot install local plugin "${w.pluginName}" without marketplace install location`
                };
            case "settings-write-failed":
                return {
                    success: !1, error: `Failed to update settings: ${w.message}`
                };
            case "resolution-failed":
                return {
                    success: !1, error: sk8(w.resolution)
                }
        }
        return d("tengu_plugin_installed", {
            plugin_id: A,
            marketplace_name: K
        }), {
            success: !0,
            message: `✓ Installed ${q.name}${w.depNote}. Run /reload-plugins to activate.`
        }
    } catch (z) {
        let _ = z instanceof Error ? z.message : String(z);
        return _6(z instanceof Error ? z : Error(`Failed to install plugin: ${String(z)}`)), {
            success: !1,
            error: `Failed to install: ${_}`
        }
    }
}
// @from(Ln 247877, Col 4)
M96 = E(() => {
    SA();
    IW();
    fX();
    tH();
    sW6();
    Aw();
    BI();
    i8();
    lA();
    Uv();
    V1();
    k1();
    YW1();
    zW1()
})
// @from(Ln 247894, Col 0)
function Z24(A) {
    return A.endsWith(`@${tp6}`)
}
// @from(Ln 247898, Col 0)
function G24(A) {
    return ek8.get(A)
}
// @from(Ln 247902, Col 0)
function AE8() {
    let A = PA(),
        q = [],
        K = [];
    for (let [Y, z] of ek8) {
        if (z.isAvailable && !z.isAvailable()) continue;
        let _ = `${Y}@${tp6}`,
            w = A?.enabledPlugins?.[_],
            O = w !== void 0 ? w === !0 : z.defaultEnabled ?? !0,
            $ = {
                name: Y,
                manifest: {
                    name: Y,
                    description: z.description,
                    version: z.version
                },
                path: tp6,
                source: _,
                repository: _,
                enabled: O,
                isBuiltin: !0,
                hooksConfig: z.hooks,
                mcpServers: z.mcpServers
            };
        if (O) q.push($);
        else K.push($)
    }
    return {
        enabled: q,
        disabled: K
    }
}
// @from(Ln 247935, Col 0)
function f24() {
    let {
        enabled: A
    } = AE8(), q = [];
    for (let K of A) {
        let Y = ek8.get(K.name);
        if (!Y?.skills) continue;
        for (let z of Y.skills) q.push(hp9(z))
    }
    return q
}
// @from(Ln 247947, Col 0)
function hp9(A) {
    return {
        type: "prompt",
        name: A.name,
        description: A.description,
        hasUserSpecifiedDescription: !0,
        allowedTools: A.allowedTools ?? [],
        argumentHint: A.argumentHint,
        whenToUse: A.whenToUse,
        model: A.model,
        disableModelInvocation: A.disableModelInvocation ?? !1,
        userInvocable: A.userInvocable ?? !0,
        contentLength: 0,
        source: "bundled",
        loadedFrom: "bundled",
        hooks: A.hooks,
        context: A.context,
        agent: A.agent,
        isEnabled: A.isEnabled ?? (() => !0),
        isHidden: !(A.userInvocable ?? !0),
        progressMessage: "running",
        userFacingName: () => A.name,
        getPromptForCommand: A.getPromptForCommand
    }
}
// @from(Ln 247972, Col 4)
ek8
// @from(Ln 247972, Col 9)
tp6 = "builtin"
// @from(Ln 247973, Col 4)
ep6 = E(() => {
    i8();
    ek8 = new Map
})
// @from(Ln 247998, Col 0)
function rW6() {
    return r3(eH(), "cache")
}
// @from(Ln 248002, Col 0)
function YE8(A, q, K) {
    let {
        name: Y,
        marketplace: z
    } = n3(q), _ = (z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"), w = (Y || q).replace(/[^a-zA-Z0-9\-_]/g, "-"), O = K.replace(/[^a-zA-Z0-9\-_.]/g, "-");
    return r3(A, "cache", _, w, O)
}
// @from(Ln 248010, Col 0)
function FI(A, q) {
    return YE8(eH(), A, q)
}
// @from(Ln 248014, Col 0)
function KZ6(A, q) {
    return `${FI(A,q)}.zip`
}
// @from(Ln 248017, Col 0)
async function y24(A, q) {
    let K = tB();
    if (!K) return null;
    let Y = YE8(K, A, q);
    try {
        return (await YZ6(Y)).length > 0 ? Y : null
    } catch {
        return null
    }
}
// @from(Ln 248027, Col 0)
async function mp9(A) {
    let q = tB();
    if (!q) return null;
    let K = KE8(YE8(q, A, "_"));
    try {
        let Y = await YZ6(K);
        if (Y.length !== 1) return null;
        let z = r3(K, Y[0]);
        return (await YZ6(z)).length > 0 ? z : null
    } catch {
        return null
    }
}
// @from(Ln 248040, Col 0)
async function qQ6(A, q) {
    await $1().mkdir(q);
    let K = await YZ6(A, {
        withFileTypes: !0
    });
    for (let Y of K) {
        let z = r3(A, Y.name),
            _ = r3(q, Y.name);
        if (Y.isDirectory()) await qQ6(z, _);
        else if (Y.isFile()) await Sp9(z, _);
        else if (Y.isSymbolicLink()) {
            let w = await Cp9(z),
                O;
            try {
                O = await wW1(z)
            } catch {
                await qE8(w, _);
                continue
            }
            let $;
            try {
                $ = await wW1(A)
            } catch {
                $ = A
            }
            let H = $.endsWith(v24) ? $ : $ + v24;
            if (O.startsWith(H) || O === $) {
                let j = T24($, O),
                    J = r3(q, j),
                    M = T24(KE8(_), J);
                await qE8(M, _)
            } else await qE8(O, _)
        }
    }
}
// @from(Ln 248075, Col 0)
async function OW1(A, q, K, Y, z) {
    let _ = pI(),
        w = FI(q, K),
        O = KZ6(q, K);
    if (_) {
        if (await uK(O)) return k(`Plugin ${q} version ${K} already cached at ${O}`), O
    } else if (await uK(w)) {
        if ((await YZ6(w)).length > 0) return k(`Plugin ${q} version ${K} already cached at ${w}`), w;
        k(`Removing empty cache directory for ${q} at ${w}`), await Ip9(w)
    }
    let $ = await y24(q, K);
    if ($) return k(`Using seed cache for ${q}@${K} at ${$}`), $;
    if (await $1().mkdir(KE8(w)), Y && typeof Y.source === "string" && z) {
        let J = _W1(z, Y.source);
        if (await uK(J)) k(`Copying source directory ${Y.source} for plugin ${q}`), await qQ6(J, w);
        else throw Error(`Plugin source directory not found: ${J} (from entry.source: ${Y.source})`)
    } else k(`Copying plugin ${q} to versioned cache (fallback to full copy)`), await qQ6(A, w);
    let H = r3(w, ".git");
    if (await D96(H, {
            recursive: !0,
            force: !0
        }), (await YZ6(w)).length === 0) throw Error(`Failed to copy plugin ${q} to versioned cache: destination is empty after copy`);
    if (_) return await n01(w, O), k(`Successfully cached plugin ${q} as ZIP at ${O}`), O;
    return k(`Successfully cached plugin ${q} at ${w}`), w
}
// @from(Ln 248101, Col 0)
function L24(A) {
    try {
        let q = new URL(A);
        if (!["https:", "http:", "file:"].includes(q.protocol)) {
            if (!/^git@[a-zA-Z0-9.-]+:/.test(A)) throw Error(`Invalid git URL protocol: ${q.protocol}. Only HTTPS, HTTP, file:// and SSH (git@) URLs are supported.`)
        }
        return A
    } catch {
        if (/^git@[a-zA-Z0-9.-]+:/.test(A)) return A;
        throw Error(`Invalid git URL: ${A}`)
    }
}
// @from(Ln 248113, Col 0)
async function Bp9(A, q, K = {}) {
    let Y = r3(eH(), "npm-cache");
    await $1().mkdir(Y);
    let z = K.version ? `${A}@${K.version}` : A,
        _ = r3(Y, "node_modules", A);
    if (!await uK(_)) {
        k(`Installing npm package ${z} to cache`);
        let O = ["install", z, "--prefix", Y];
        if (K.registry) O.push("--registry", K.registry);
        let $ = await z8("npm", O, {
            useCwd: !1
        });
        if ($.code !== 0) throw Error(`Failed to install npm package: ${$.stderr}`)
    }
    await qQ6(_, q), k(`Copied npm package ${A} from cache to ${q}`)
}
// @from(Ln 248129, Col 0)
async function gp9(A, q, K, Y) {
    let z = ["clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
    if (K) z.push("--branch", K);
    if (Y) z.push("--no-checkout");
    z.push(A, q);
    let _ = await z8(hA(), z);
    if (_.code !== 0) throw Error(`Failed to clone repository: ${_.stderr}`);
    if (Y) {
        if ((await RA(hA(), ["fetch", "--depth", "1", "origin", Y], {
                cwd: q
            })).code !== 0) {
            k(`Shallow fetch of SHA ${Y} failed, falling back to unshallow fetch`);
            let $ = await RA(hA(), ["fetch", "--unshallow"], {
                cwd: q
            });
            if ($.code !== 0) throw Error(`Failed to fetch commit ${Y}: ${$.stderr}`)
        }
        let O = await RA(hA(), ["checkout", Y], {
            cwd: q
        });
        if (O.code !== 0) throw Error(`Failed to checkout commit ${Y}: ${O.stderr}`)
    }
}
// @from(Ln 248152, Col 0)
async function R24(A, q, K, Y) {
    let z = L24(A);
    await gp9(z, q, K, Y);
    let _ = K ? ` (ref: ${K})` : "";
    k(`Cloned repository from ${z}${_} to ${q}`)
}
// @from(Ln 248158, Col 0)
async function Fp9(A, q, K, Y) {
    if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(A)) throw Error(`Invalid GitHub repository format: ${A}. Expected format: owner/repo`);
    let z = t6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${A}.git` : `git@github.com:${A}.git`;
    return R24(z, q, K, Y)
}
// @from(Ln 248164, Col 0)
function pp9(A) {
    if (/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(A)) return t6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${A}.git` : `git@github.com:${A}.git`;
    return L24(A)
}
// @from(Ln 248168, Col 0)
async function Qp9(A, q, K, Y, z) {
    if (!await K96()) throw Error("git-subdir plugin source requires git to be installed and on PATH. Install git (version 2.25 or later for sparse-checkout cone mode) and try again.");
    let _ = pp9(A),
        w = `${q}.clone`,
        O = ["clone", "--depth", "1", "--filter=tree:0", "--no-checkout"];
    if (Y) O.push("--branch", Y);
    O.push(_, w);
    let $ = await z8(hA(), O);
    if ($.code !== 0) throw Error(`Failed to clone repository for git-subdir source: ${$.stderr}`);
    try {
        let H = await RA(hA(), ["sparse-checkout", "set", "--cone", "--", K], {
            cwd: w
        });
        if (H.code !== 0) throw Error(`git sparse-checkout set failed (git >= 2.25 required for cone mode): ${H.stderr}`);
        let j;
        if (z) {
            if ((await RA(hA(), ["fetch", "--depth", "1", "origin", z], {
                    cwd: w
                })).code !== 0) {
                k(`Shallow fetch of SHA ${z} failed for git-subdir, falling back to unshallow fetch`);
                let W = await RA(hA(), ["fetch", "--unshallow"], {
                    cwd: w
                });
                if (W.code !== 0) throw Error(`Failed to fetch commit ${z}: ${W.stderr}`)
            }
            let P = await RA(hA(), ["checkout", z], {
                cwd: w
            });
            if (P.code !== 0) throw Error(`Failed to checkout commit ${z}: ${P.stderr}`);
            j = z
        } else {
            let [X, P] = await Promise.all([RA(hA(), ["checkout", "HEAD"], {
                cwd: w
            }), RA(hA(), ["rev-parse", "HEAD"], {
                cwd: w
            })]);
            if (X.code !== 0) throw Error(`git checkout after sparse-checkout failed: ${X.stderr}`);
            if (P.code === 0) j = P.stdout.trim()
        }
        let J = _W1(w, K);
        try {
            await E24(J, q)
        } catch (X) {
            if (X.code === "ENOENT") throw Error(`Subdirectory '${K}' not found in repository ${_}${Y?` (ref: ${Y})`:""}. Check that the path is correct and exists at the specified ref/sha.`);
            throw X
        }
        let M = Y ? ` ref=${Y}` : "",
            D = j ? ` sha=${j}` : "";
        return k(`Extracted subdir ${K} from ${_}${M}${D} to ${q}`), j
    } finally {
        await D96(w, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 248224, Col 0)
async function Up9(A, q) {
    if (!await uK(A)) throw Error(`Source path does not exist: ${A}`);
    await qQ6(A, q);
    let K = r3(q, ".git");
    await D96(K, {
        recursive: !0,
        force: !0
    })
}
// @from(Ln 248234, Col 0)
function dp9(A) {
    let q = Date.now(),
        K = Math.random().toString(36).substring(2, 8),
        Y;
    if (typeof A === "string") Y = "local";
    else switch (A.source) {
        case "npm":
            Y = "npm";
            break;
        case "pip":
            Y = "pip";
            break;
        case "github":
            Y = "github";
            break;
        case "url":
            Y = "git";
            break;
        case "git-subdir":
            Y = "subdir";
            break;
        default:
            Y = "unknown"
    }
    return `temp_${Y}_${q}_${K}`
}