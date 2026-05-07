
// @from(Ln 402110, Col 0)
function N38(q, K, _, z, Y, A, O = {
    isSkillMode: !1
}) {
    try {
        let {
            frontmatter: w,
            content: $
        } = K, j = Wp(w.description, q), H = j ?? j_6($, A ? "Plugin skill" : "Plugin command"), J = w["allowed-tools"], X = typeof J === "string" ? fx(J, {
            path: Y,
            source: _
        }) : Array.isArray(J) ? J.map((B) => typeof B === "string" ? fx(B, {
            path: Y,
            source: _
        }) : B) : J, M = yc(X), P = w["argument-hint"] != null ? String(w["argument-hint"]) : void 0, W = HS8(w.arguments), D = w.when_to_use != null ? String(w.when_to_use) : void 0, Z = w.version != null ? String(w.version) : void 0, G = w.name != null ? String(w.name) : void 0, f = w.model, v;
        if (typeof f === "string" && f.trim().length > 0) {
            let B = f.trim();
            v = B === "inherit" ? void 0 : K5(B)
        }
        let V = w.effort,
            k = V !== void 0 ? id(V) : void 0;
        if (V !== void 0 && k === void 0) E(`Plugin command ${q} has invalid effort '${V}'. Valid options: ${UI.join(", ")} or an integer`);
        let N = Yy6(w["disable-model-invocation"]),
            R = w["user-invocable"],
            h = R === void 0 ? !0 : Yy6(R),
            C = vh8(w.shell, q),
            x;
        if ((A || O.isSkillMode) && w.hooks) {
            let B = sN().safeParse(w.hooks);
            if (B.success) x = B.data;
            else E(`Invalid hooks in plugin skill '${q}': ${B.error.message}`)
        }
        return {
            type: "prompt",
            name: q,
            description: H,
            hasUserSpecifiedDescription: j !== null,
            allowedTools: M,
            argumentHint: P,
            argNames: W.length > 0 ? W : void 0,
            whenToUse: D,
            version: Z,
            model: v,
            effort: k,
            context: w.context === "fork" ? "fork" : void 0,
            agent: w.agent != null ? String(w.agent) : void 0,
            disableModelInvocation: N,
            userInvocable: h,
            contentLength: $.length,
            source: "plugin",
            loadedFrom: A || O.isSkillMode ? "plugin" : void 0,
            hooks: x,
            skillRoot: (A || O.isSkillMode) && x ? Y : void 0,
            pluginInfo: {
                pluginManifest: z,
                repository: _
            },
            isHidden: !h,
            progressMessage: A || O.isSkillMode ? "loading" : "running",
            userFacingName() {
                return G || q
            },
            async getPromptForCommand(B, m) {
                let S = O.isSkillMode ? `Base directory for this skill: ${ye(K.filePath)}

${$}` : $;
                if (S = qL6(S, B, !0, W), S = fx(S, {
                        path: Y,
                        source: _
                    }), z.userConfig) S = kb8(S, ID(_), z.userConfig);
                if (O.isSkillMode) {
                    let F = ye(K.filePath),
                        U = process.platform === "win32" ? F.replaceAll("\\", "/") : F;
                    S = S.replace(/\$\{CLAUDE_SKILL_DIR\}/g, U)
                }
                if (S = S.replace(/\$\{CLAUDE_SESSION_ID\}/g, I8()), Wc8()) S = Dc8(S);
                else S = await An(S, {
                    ...m,
                    getAppState() {
                        let F = m.getAppState();
                        return {
                            ...F,
                            toolPermissionContext: {
                                ...F.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...F.toolPermissionContext.alwaysAllowRules,
                                    command: M
                                }
                            }
                        }
                    }
                }, `/${q}`, C);
                return [{
                    type: "text",
                    text: S
                }]
            }
        }
    } catch (w) {
        return E(`Failed to create command from ${K.filePath}: ${w}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 402214, Col 0)
function fc8() {
    iM6.cache?.clear?.()
}
// @from(Ln 402217, Col 0)
async function iNK(q, K, _, z, Y, A) {
    let O = V8(),
        w = [],
        $ = Zc8(q, "SKILL.md"),
        j = null;
    try {
        j = await O.readFile($, {
            encoding: "utf-8"
        })
    } catch (J) {
        if (!t1(J)) return E(`Failed to load skill from ${$}: ${J}`, {
            level: "error"
        }), w
    }
    if (j !== null) {
        if (di(O, $, A)) return w;
        try {
            let {
                frontmatter: J,
                content: X
            } = p2(j, $), P = ((typeof J.name === "string" ? J.name.trim() : "") || yI6(q)).replace(/[^a-zA-Z0-9_-]/g, "-"), W = `${K}:${P}`, D = {
                filePath: $,
                baseDir: ye($),
                frontmatter: J,
                content: Ee($, X)
            }, Z = N38(W, D, _, z, Y, !0, {
                isSkillMode: !0
            });
            if (Z) w.push(Z)
        } catch (J) {
            E(`Failed to load skill from ${$}: ${J}`, {
                level: "error"
            })
        }
        return w
    }
    let H;
    try {
        H = await O.readdir(q)
    } catch (J) {
        if (!t1(J)) E(`Failed to load skills from directory ${q}: ${J}`, {
            level: "error"
        });
        return w
    }
    return await Promise.all(H.map(async (J) => {
        if (!J.isDirectory() && !J.isSymbolicLink()) return;
        let X = Zc8(q, J.name),
            M = Zc8(X, "SKILL.md"),
            P;
        try {
            P = await O.readFile(M, {
                encoding: "utf-8"
            })
        } catch (W) {
            if (!t1(W)) E(`Failed to load skill from ${M}: ${W}`, {
                level: "error"
            });
            return
        }
        if (di(O, M, A)) return;
        try {
            let {
                frontmatter: W,
                content: D
            } = p2(P, M), Z = `${K}:${J.name.replace(/[^a-zA-Z0-9_-]/g,"-")}`, G = {
                filePath: M,
                baseDir: ye(M),
                frontmatter: W,
                content: Ee(M, D)
            }, f = N38(Z, G, _, z, Y, !0, {
                isSkillMode: !0
            });
            if (f) w.push(f)
        } catch (W) {
            E(`Failed to load skill from ${M}: ${W}`, {
                level: "error"
            })
        }
    })), w
}
// @from(Ln 402299, Col 0)
function rNK() {
    l97.cache?.clear?.()
}
// @from(Ln 402302, Col 4)
iM6
// @from(Ln 402302, Col 9)
l97
// @from(Ln 402303, Col 4)
E38 = L(() => {
    U4();
    y8();
    Q97();
    oe6();
    K8();
    hf();
    Q8();
    m8();
    Lf();
    Yq();
    ds();
    Sq();
    LI6();
    Th();
    d97();
    vH();
    Gx();
    Nb8();
    iM6 = P1(async () => {
        if (S9() && cg().length === 0) return [];
        let {
            enabled: q,
            errors: K
        } = await Gj();
        if (K.length > 0) E(`Plugin loading errors: ${K.map((Y)=>GH(Y)).join(", ")}`);
        let z = (await Promise.all(q.map(async (Y) => {
            let A = new Set,
                O = [];
            if (Y.commandsPath) try {
                let w = await nNK(Y.commandsPath, Y.name, Y.source, Y.manifest, Y.path, {
                    isSkillMode: !1
                }, A);
                if (O.push(...w), w.length > 0) E(`Loaded ${w.length} commands from plugin ${Y.name} default directory`)
            } catch (w) {
                E(`Failed to load commands from plugin ${Y.name} default directory: ${w}`, {
                    level: "error"
                })
            }
            if (Y.commandsPaths) {
                E(`Plugin ${Y.name} has commandsPaths: ${Y.commandsPaths.join(", ")}`);
                let w = await Promise.all(Y.commandsPaths.map(async ($) => {
                    try {
                        let j = V8(),
                            H = await j.stat($);
                        if (E(`Checking commandPath ${$} - isDirectory: ${H.isDirectory()}, isFile: ${H.isFile()}`), H.isDirectory()) {
                            let J = await nNK($, Y.name, Y.source, Y.manifest, Y.path, {
                                isSkillMode: !1
                            }, A);
                            if (J.length > 0) E(`Loaded ${J.length} commands from plugin ${Y.name} custom path: ${$}`);
                            else E(`Warning: No commands found in plugin ${Y.name} custom directory: ${$}. Expected .md files or SKILL.md in subdirectories.`, {
                                level: "warn"
                            });
                            return J
                        } else if (H.isFile() && $.endsWith(".md")) {
                            if (di(j, $, A)) return [];
                            let J = await j.readFile($, {
                                    encoding: "utf-8"
                                }),
                                {
                                    frontmatter: X,
                                    content: M
                                } = p2(J, $),
                                P, W;
                            if (Y.commandsMetadata) {
                                for (let [f, v] of Object.entries(Y.commandsMetadata))
                                    if (v.source) {
                                        let V = Zc8(Y.path, v.source);
                                        if ($ === V) {
                                            P = `${Y.name}:${f}`, W = v;
                                            break
                                        }
                                    }
                            }
                            if (!P) P = `${Y.name}:${yI6($).replace(/\.md$/,"")}`;
                            let D = W ? {
                                    ...X,
                                    ...W.description && {
                                        description: W.description
                                    },
                                    ...W.argumentHint && {
                                        "argument-hint": W.argumentHint
                                    },
                                    ...W.model && {
                                        model: W.model
                                    },
                                    ...W.allowedTools && {
                                        "allowed-tools": W.allowedTools.join(",")
                                    }
                                } : X,
                                Z = {
                                    filePath: $,
                                    baseDir: ye($),
                                    frontmatter: D,
                                    content: Ee($, M)
                                },
                                G = N38(P, Z, Y.source, Y.manifest, Y.path, !1);
                            if (G) return E(`Loaded command from plugin ${Y.name} custom file: ${$}${W?" (with metadata override)":""}`), [G]
                        }
                        return []
                    } catch (j) {
                        return E(`Failed to load commands from plugin ${Y.name} custom path ${$}: ${j}`, {
                            level: "error"
                        }), []
                    }
                }));
                for (let $ of w) O.push(...$)
            }
            if (Y.commandsMetadata) {
                for (let [w, $] of Object.entries(Y.commandsMetadata))
                    if ($.content && !$.source) try {
                        let {
                            frontmatter: j,
                            content: H
                        } = p2($.content, `<inline:${Y.name}:${w}>`), J = {
                            ...j,
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
                        }, X = `${Y.name}:${w}`, M = `<inline:${X}>`, P = {
                            filePath: M,
                            baseDir: Y.path,
                            frontmatter: J,
                            content: Ee(M, H)
                        }, W = N38(X, P, Y.source, Y.manifest, Y.path, !1);
                        if (W) O.push(W), E(`Loaded inline content command from plugin ${Y.name}: ${X}`)
                    } catch (j) {
                        E(`Failed to load inline content command ${w} from plugin ${Y.name}: ${j}`, {
                            level: "error"
                        })
                    }
            }
            return O
        }))).flat();
        return E(`Total plugin commands loaded: ${z.length}`), z
    });
    l97 = P1(async () => {
        if (S9() && cg().length === 0) return [];
        let {
            enabled: q,
            errors: K
        } = await Gj();
        if (K.length > 0) E(`Plugin loading errors: ${K.map((Y)=>GH(Y)).join(", ")}`);
        E(`getPluginSkills: Processing ${q.length} enabled plugins`);
        let z = (await Promise.all(q.map(async (Y) => {
            let A = new Set,
                O = [];
            if (E(`Checking plugin ${Y.name}: skillsPath=${Y.skillsPath?"exists":"none"}, skillsPaths=${Y.skillsPaths?Y.skillsPaths.length:0} paths`), Y.skillsPath) {
                E(`Attempting to load skills from plugin ${Y.name} default skillsPath: ${Y.skillsPath}`);
                try {
                    let w = await iNK(Y.skillsPath, Y.name, Y.source, Y.manifest, Y.path, A);
                    O.push(...w), E(`Loaded ${w.length} skills from plugin ${Y.name} default directory`)
                } catch (w) {
                    E(`Failed to load skills from plugin ${Y.name} default directory: ${w}`, {
                        level: "error"
                    })
                }
            }
            if (Y.skillsPaths) {
                E(`Attempting to load skills from plugin ${Y.name} skillsPaths: ${Y.skillsPaths.join(", ")}`);
                let w = await Promise.all(Y.skillsPaths.map(async ($) => {
                    try {
                        E(`Loading from skillPath: ${$} for plugin ${Y.name}`);
                        let j = await iNK($, Y.name, Y.source, Y.manifest, Y.path, A);
                        return E(`Loaded ${j.length} skills from plugin ${Y.name} custom path: ${$}`), j
                    } catch (j) {
                        return E(`Failed to load skills from plugin ${Y.name} custom path ${$}: ${j}`, {
                            level: "error"
                        }), []
                    }
                }));
                for (let $ of w) O.push(...$)
            }
            return O
        }))).flat();
        return E(`Total plugin skills loaded: ${z.length}`), z
    })
})
// @from(Ln 402493, Col 0)
async function oNK(q, K, _) {
    let z = [];
    return await Hh6(q, async (Y) => {
        let A = await aNK(Y, K, _);
        if (A) z.push(A)
    }, {
        logLabel: "output-styles"
    }), z
}
// @from(Ln 402502, Col 0)
async function aNK(q, K, _) {
    let z = V8();
    if (di(z, q, _)) return null;
    try {
        let Y = await z.readFile(q, {
                encoding: "utf-8"
            }),
            {
                frontmatter: A,
                content: O
            } = p2(Y, q),
            w = OPY(q, ".md"),
            $ = (A.name != null ? String(A.name) : void 0) || w,
            j = `${K}:${$}`,
            H = Wp(A.description, j) ?? j_6(O, `Output style from ${K} plugin`);
        return {
            name: j,
            description: H,
            prompt: O.trim(),
            source: "plugin",
            forceForPlugin: ht6(A["force-for-plugin"]),
            keepCodingInstructions: ht6(A["keep-coding-instructions"])
        }
    } catch (Y) {
        return E(`Failed to load output style from ${q}: ${Y}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 402532, Col 0)
function i97() {
    n97.cache?.clear?.()
}
// @from(Ln 402535, Col 4)
n97
// @from(Ln 402536, Col 4)
Gc8 = L(() => {
    U4();
    K8();
    Lf();
    Yq();
    ds();
    vH();
    Nb8();
    n97 = P1(async () => {
        let {
            enabled: q,
            errors: K
        } = await Gj(), _ = [];
        if (K.length > 0) E(`Plugin loading errors: ${K.map((z)=>GH(z)).join(", ")}`);
        for (let z of q) {
            let Y = new Set;
            if (z.outputStylesPath) try {
                let A = await oNK(z.outputStylesPath, z.name, Y);
                if (_.push(...A), A.length > 0) E(`Loaded ${A.length} output styles from plugin ${z.name} default directory`)
            } catch (A) {
                E(`Failed to load output styles from plugin ${z.name} default directory: ${A}`, {
                    level: "error"
                })
            }
            if (z.outputStylesPaths)
                for (let A of z.outputStylesPaths) try {
                    let w = await V8().stat(A);
                    if (w.isDirectory()) {
                        let $ = await oNK(A, z.name, Y);
                        if (_.push(...$), $.length > 0) E(`Loaded ${$.length} output styles from plugin ${z.name} custom path: ${A}`)
                    } else if (w.isFile() && A.endsWith(".md")) {
                        let $ = await aNK(A, z.name, Y);
                        if ($) _.push($), E(`Loaded output style from plugin ${z.name} custom file: ${A}`)
                    }
                } catch (O) {
                    E(`Failed to load output styles from plugin ${z.name} custom path ${A}: ${O}`, {
                        level: "error"
                    })
                }
        }
        return E(`Total plugin output styles loaded: ${_.length}`), _
    })
})
// @from(Ln 402590, Col 0)
function MPY() {
    bk(), fc8(), Eb8(), Ax8(), Qi1().catch((q) => j6(q)), vb8(), i97(), eNK()
}
// @from(Ln 402594, Col 0)
function YO() {
    MPY(), On(), ol1(), _n1(), EI6()
}
// @from(Ln 402597, Col 0)
async function hI6(q) {
    try {
        await HPY(o97(q), `${Date.now()}`, "utf-8")
    } catch (K) {
        E(`Failed to write .orphaned_at: ${q}: ${K}`)
    }
}
// @from(Ln 402604, Col 0)
async function r97() {
    if (wx()) return;
    try {
        let q = WPY();
        if (!q) return;
        let K = RL6(),
            _ = Date.now();
        await Promise.all([...q].map((z) => PPY(z)));
        for (let z of await Tc8(K)) {
            let Y = vc8(K, z);
            for (let A of await Tc8(Y)) {
                let O = vc8(Y, A);
                for (let w of await Tc8(O)) {
                    let $ = vc8(O, w);
                    if (q.has($)) continue;
                    await DPY($, _)
                }
                await sNK(O)
            }
            await sNK(Y)
        }
    } catch (q) {
        E(`Plugin cache cleanup failed: ${q}`)
    }
}
// @from(Ln 402630, Col 0)
function o97(q) {
    return vc8(q, JPY)
}
// @from(Ln 402633, Col 0)
async function PPY(q) {
    let K = o97(q);
    try {
        await jPY(K)
    } catch (_) {
        if (Q1(_) === "ENOENT") return;
        E(`Failed to remove .orphaned_at: ${q}: ${_}`)
    }
}
// @from(Ln 402643, Col 0)
function WPY() {
    try {
        let q = new Set,
            K = mR();
        for (let _ of Object.values(K.plugins))
            for (let z of _) q.add(z.installPath);
        return q
    } catch (q) {
        return E(`Failed to load installed plugins: ${q}`), null
    }
}
// @from(Ln 402654, Col 0)
async function DPY(q, K) {
    let _ = o97(q),
        z;
    try {
        z = (await $PY(_)).mtimeMs
    } catch (Y) {
        if (Q1(Y) === "ENOENT") {
            await hI6(q);
            return
        }
        E(`Failed to stat orphaned marker: ${q}: ${Y}`);
        return
    }
    if (K - z > XPY) try {
        await tNK(q, {
            recursive: !0,
            force: !0
        })
    } catch (Y) {
        E(`Failed to delete orphaned version: ${q}: ${Y}`)
    }
}
// @from(Ln 402676, Col 0)
async function sNK(q) {
    if ((await Tc8(q)).length === 0) try {
        await tNK(q, {
            recursive: !0,
            force: !0
        })
    } catch (K) {
        E(`Failed to remove empty dir: ${q}: ${K}`)
    }
}
// @from(Ln 402686, Col 0)
async function Tc8(q) {
    try {
        return (await wPY(q, {
            withFileTypes: !0
        })).filter((_) => _.isDirectory()).map((_) => _.name)
    } catch {
        return []
    }
}
// @from(Ln 402695, Col 4)
JPY = ".orphaned_at"
// @from(Ln 402696, Col 4)
XPY = 604800000
// @from(Ln 402697, Col 4)
uR = L(() => {
    CA();
    ec();
    cP();
    Mh6();
    ZM();
    K8();
    m8();
    U8();
    yD();
    yb8();
    E38();
    HJ6();
    Gc8();
    vH();
    Gx();
    EL6()
})
// @from(Ln 402729, Col 0)
async function y38(q, K) {
    let _ = _EK(K),
        z = _EK(q);
    if (z !== _ && !z.startsWith(_ + vPY)) return E(`fetchOfficialMarketplaceFromGcs: refusing path outside cache dir: ${q}`, {
        level: "error"
    }), null;
    await dB6();
    let Y = performance.now(),
        A = "failed",
        O, w, $;
    try {
        let j = await Z1.get(`${zEK}/latest`, {
            responseType: "text",
            timeout: 1e4
        });
        if (O = String(j.data).trim(), !O) throw Error("latest pointer returned empty body");
        let H = t97(q, ".gcs-sha");
        if (await fPY(H, "utf8").then((f) => f.trim(), () => null) === O) return A = "noop", O;
        let X = await Z1.get(`${zEK}/${O}.zip`, {
                responseType: "arraybuffer",
                timeout: 60000
            }),
            M = Buffer.from(X.data);
        w = M.length;
        let P = await kL6(M),
            W = NL6(M),
            D = `${q}.staging`;
        await s97(D, {
            recursive: !0,
            force: !0
        }), await qEK(D, {
            recursive: !0
        });
        for (let [f, v] of Object.entries(P)) {
            if (!f.startsWith(YEK)) continue;
            let V = f.slice(YEK.length);
            if (!V || V.endsWith("/")) continue;
            let k = t97(D, V);
            await qEK(GPY(k), {
                recursive: !0
            }), await KEK(k, v);
            let N = W[f];
            if (N && N & 73) await ZPY(k, N & 511).catch(() => {})
        }
        await KEK(t97(D, ".gcs-sha"), O);
        let Z = `${q}.backup`;
        await s97(Z, {
            recursive: !0,
            force: !0
        }).catch(() => {});
        let G = !1;
        try {
            await a97(q, Z), G = !0
        } catch (f) {
            if (Q1(f) !== "ENOENT") throw f
        }
        try {
            await a97(D, q)
        } catch (f) {
            if (G) await a97(Z, q).catch(() => {});
            throw f
        }
        return await s97(Z, {
            recursive: !0,
            force: !0
        }).catch(() => {}), A = "updated", O
    } catch (j) {
        return $ = VPY(j), E(`Official marketplace GCS fetch failed: ${b6(j)}`, {
            level: "warn"
        }), null
    } finally {
        d("tengu_plugin_remote_fetch", {
            source: "marketplace_gcs",
            host: "downloads.claude.ai",
            is_official: !0,
            outcome: A,
            duration_ms: Math.round(performance.now() - Y),
            ...w !== void 0 && {
                bytes: w
            },
            ...O && {
                sha: O
            },
            ...$ && {
                error_kind: $
            }
        })
    }
}
// @from(Ln 402819, Col 0)
function VPY(q) {
    if (Z1.isAxiosError(q)) {
        if (q.code === "ECONNABORTED") return "timeout";
        if (q.response) return `http_${q.response.status}`;
        return "network"
    }
    let K = Q1(q);
    if (K && /^E[A-Z]+$/.test(K) && !K.startsWith("ERR_")) return TPY.has(K) ? `fs_${K}` : "fs_other";
    if (typeof q?.code === "number") return "zip_parse";
    let _ = b6(q);
    if (/unzip|invalid zip|central directory/i.test(_)) return "zip_parse";
    if (/empty body/.test(_)) return "empty_latest";
    return "other"
}
// @from(Ln 402833, Col 4)
zEK = "https://downloads.claude.ai/claude-code-releases/plugins/claude-plugins-official"
// @from(Ln 402834, Col 4)
YEK = "marketplaces/claude-plugins-official/"
// @from(Ln 402835, Col 4)
TPY
// @from(Ln 402836, Col 4)
e97 = L(() => {
    CK();
    y8();
    C8();
    K8();
    gS8();
    m8();
    TPY = new Set(["ENOSPC", "EACCES", "EPERM", "EXDEV", "EBUSY", "ENOENT", "ENOTDIR", "EROFS", "EMFILE", "ENAMETOOLONG"])
})
// @from(Ln 402857, Col 0)
function Ec8() {
    return BM(gP(), "known_marketplaces.json")
}
// @from(Ln 402861, Col 0)
function H_6() {
    return BM(gP(), "marketplaces")
}
// @from(Ln 402865, Col 0)
function J_6() {
    xf.cache?.clear?.(), kc8.clear()
}
// @from(Ln 402869, Col 0)
function X_6() {
    let q = {},
        K = {
            ...ej6(),
            ...v7().enabledPlugins ?? {}
        };
    for (let [_, z] of Object.entries(K))
        if (z && Z4(_).marketplace === WM) {
            q[WM] = {
                source: AL6,
                sourceIsFallback: !0
            };
            break
        } return {
        ...q,
        ...tZ4(),
        ...v7().extraKnownMarketplaces ?? {}
    }
}
// @from(Ln 402889, Col 0)
function NPY(q) {
    let K = ["localSettings", "projectSettings", "userSettings"];
    for (let _ of K)
        if (E1(_)?.extraKnownMarketplaces?.[q]) return _;
    return null
}
// @from(Ln 402896, Col 0)
function h38(q, K, _ = "userSettings") {
    let Y = {
        ...(E1(_) ?? {}).extraKnownMarketplaces
    };
    Y[q] = K, P7(_, {
        extraKnownMarketplaces: Y
    })
}
// @from(Ln 402904, Col 0)
async function Dz() {
    let q = V8(),
        K = Ec8();
    try {
        let _ = await q.readFile(K, {
                encoding: "utf-8"
            }),
            z = n8(_),
            Y = zG6().safeParse(z);
        if (!Y.success) {
            let A = `Marketplace configuration file is corrupted: ${Y.error.issues.map((O)=>`${O.path.join(".")}: ${O.message}`).join(", ")}`;
            throw E(A, {
                level: "error"
            }), new HV(A, K, z)
        }
        return Y.data
    } catch (_) {
        if (t1(_)) return {};
        if (_ instanceof HV) throw _;
        let z = `Failed to load marketplace configuration: ${b6(_)}`;
        throw E(z, {
            level: "error"
        }), Error(z)
    }
}
// @from(Ln 402929, Col 0)
async function O56() {
    try {
        return await Dz()
    } catch {
        return {}
    }
}
// @from(Ln 402936, Col 0)
async function $n(q) {
    let K = zG6().safeParse(q),
        _ = Ec8();
    if (!K.success) throw new HV(`Invalid marketplace config: ${K.error.message}`, _, q);
    let z = V8(),
        Y = BM(_, "..");
    await z.mkdir(Y), aJ(_, I6(K.data, null, 2), {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 402947, Col 0)
async function yc8() {
    let q = nK6();
    if (q.length === 0) return !1;
    let K = await Dz(),
        _ = new Set,
        z = 0;
    for (let Y of q) {
        let A = await EPY(Y);
        if (!A) continue;
        for (let [O, w] of Object.entries(A)) {
            if (_.has(O)) continue;
            let $ = await yPY(Y, O);
            if (!$) {
                E(`Seed marketplace '${O}' not found under ${Y}/marketplaces/, skipping`, {
                    level: "warn"
                });
                continue
            }
            _.add(O);
            let j = {
                source: w.source,
                installLocation: $,
                lastUpdated: w.lastUpdated,
                autoUpdate: !1
            };
            if (f$(K[O], j)) continue;
            K[O] = j, z++
        }
    }
    if (z > 0) return await $n(K), E(`Synced ${z} marketplace(s) from seed dir(s)`), !0;
    return !1
}
// @from(Ln 402979, Col 0)
async function EPY(q) {
    let K = BM(q, "known_marketplaces.json");
    try {
        let _ = await V8().readFile(K, {
                encoding: "utf-8"
            }),
            z = zG6().safeParse(n8(_));
        if (!z.success) return E(`Seed known_marketplaces.json invalid at ${q}: ${z.error.message}`, {
            level: "warn"
        }), null;
        return z.data
    } catch (_) {
        if (!t1(_)) E(`Failed to read seed known_marketplaces.json at ${q}: ${_}`, {
            level: "warn"
        });
        return null
    }
}
// @from(Ln 402997, Col 0)
async function yPY(q, K) {
    let _ = BM(q, "marketplaces", K),
        z = BM(q, "marketplaces", `${K}.json`);
    for (let Y of [_, z]) try {
        return await L38(Y), Y
    } catch {}
    return null
}
// @from(Ln 403006, Col 0)
function R38(q) {
    return nK6().find((K) => q === K || q.startsWith(K + Nc8))
}
// @from(Ln 403010, Col 0)
function he() {
    let q = process.env.CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS;
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K) && K > 0) return K
    }
    return LPY
}
// @from(Ln 403018, Col 0)
async function hPY(q, K, _) {
    E(`git pull: cwd=${q} ref=${K??"default"}`);
    let z = {
            ...process.env,
            ...IR
        },
        Y = _?.disableCredentialHelper ? ["-c", "credential.helper="] : [];
    if (K) {
        let O = await M7(D7(), [...Y, "fetch", "origin", K], {
            cwd: q,
            timeout: he(),
            stdin: "ignore",
            env: z
        });
        if (O.code !== 0) return Vc8(O);
        let w = await M7(D7(), [...Y, "checkout", K], {
            cwd: q,
            timeout: he(),
            stdin: "ignore",
            env: z
        });
        if (w.code !== 0) return Vc8(w);
        let $ = await M7(D7(), [...Y, "pull", "origin", K], {
            cwd: q,
            timeout: he(),
            stdin: "ignore",
            env: z
        });
        if ($.code !== 0) return Vc8($);
        return await OEK(q, Y, z, _?.sparsePaths), $
    }
    let A = await M7(D7(), [...Y, "pull", "origin", "HEAD"], {
        cwd: q,
        timeout: he(),
        stdin: "ignore",
        env: z
    });
    if (A.code !== 0) return Vc8(A);
    return await OEK(q, Y, z, _?.sparsePaths), A
}
// @from(Ln 403058, Col 0)
async function OEK(q, K, _, z) {
    if (z && z.length > 0) return;
    if (!await V8().stat(BM(q, ".gitmodules")).then(() => !0, () => !1)) return;
    let A = await M7(D7(), ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes", ...K, "submodule", "update", "--init", "--recursive", "--depth", "1"], {
        cwd: q,
        timeout: he(),
        stdin: "ignore",
        env: _
    });
    if (A.code !== 0) E(`git submodule update failed (non-fatal): ${A.stderr}`, {
        level: "warn"
    })
}
// @from(Ln 403072, Col 0)
function Vc8(q) {
    if (q.code === 0) return q;
    if (q.error?.includes("timed out")) {
        let K = Math.round(he() / 1000);
        return {
            ...q,
            stderr: `Git pull timed out after ${K}s. Try increasing the timeout via CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS environment variable.

Original error: ${q.stderr}`
        }
    }
    if (q.stderr.includes("REMOTE HOST IDENTIFICATION HAS CHANGED")) return {
        ...q,
        stderr: `SSH host key for this marketplace's git host has changed (server key rotation or possible MITM). Remove the stale entry with: ssh-keygen -R <host>
Then connect once manually to accept the new key.

Original error: ${q.stderr}`
    };
    if (q.stderr.includes("Host key verification failed")) return {
        ...q,
        stderr: `SSH host key verification failed while updating marketplace. The host key is not in your known_hosts file. Connect once manually to add it (e.g., ssh -T git@<host>), or remove and re-add the marketplace with an HTTPS URL.

Original error: ${q.stderr}`
    };
    if (q.stderr.includes("Permission denied (publickey)") || q.stderr.includes("Could not read from remote repository")) return {
        ...q,
        stderr: `SSH authentication failed while updating marketplace. Please ensure your SSH keys are configured.

Original error: ${q.stderr}`
    };
    if (q.stderr.includes("timed out") || q.stderr.includes("Could not resolve host")) return {
        ...q,
        stderr: `Network error while updating marketplace. Please check your internet connection.

Original error: ${q.stderr}`
    };
    return q
}
// @from(Ln 403110, Col 0)
async function jEK() {
    try {
        let q = await w1("ssh", ["-T", "-o", "BatchMode=yes", "-o", "ConnectTimeout=2", "-o", "StrictHostKeyChecking=yes", "git@github.com"], {
                timeout: 3000
            }),
            K = q.code === 1 && (q.stderr?.includes("successfully authenticated") || q.stdout?.includes("successfully authenticated"));
        return E(`SSH config check: code=${q.code} configured=${K}`), K
    } catch (q) {
        return E(`SSH configuration check failed: ${b6(q)}`, {
            level: "warn"
        }), !1
    }
}
// @from(Ln 403124, Col 0)
function RPY(q) {
    return q.includes("Authentication failed") || q.includes("could not read Username") || q.includes("terminal prompts disabled") || q.includes("403") || q.includes("401")
}
// @from(Ln 403128, Col 0)
function wEK(q) {
    return q.match(/^[^@]+@([^:]+):/)?.[1] ?? null
}
// @from(Ln 403131, Col 0)
async function SPY(q, K, _, z) {
    let Y = z && z.length > 0,
        A = ["-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes", "clone", "--depth", "1"];
    if (Y) A.push("--filter=blob:none", "--no-checkout");
    else A.push("--recurse-submodules", "--shallow-submodules");
    if (_) A.push("--branch", _);
    A.push(q, K);
    let O = he();
    E(`git clone: url=${rM6(q)} ref=${_??"default"} timeout=${O}ms`);
    let w = await M7(D7(), A, {
            timeout: O,
            stdin: "ignore",
            env: {
                ...process.env,
                ...IR
            }
        }),
        $ = rM6(q);
    if (q !== $) {
        if (w.error) w.error = w.error.replaceAll(q, $);
        if (w.stderr) w.stderr = w.stderr.replaceAll(q, $)
    }
    if (w.code === 0) {
        if (Y) {
            let j = await M7(D7(), ["sparse-checkout", "set", "--cone", "--", ...z], {
                cwd: K,
                timeout: O,
                stdin: "ignore",
                env: {
                    ...process.env,
                    ...IR
                }
            });
            if (j.code !== 0) return {
                code: j.code,
                stderr: `git sparse-checkout set failed: ${j.stderr}`
            };
            let H = await M7(D7(), ["checkout", "HEAD"], {
                cwd: K,
                timeout: O,
                stdin: "ignore",
                env: {
                    ...process.env,
                    ...IR
                }
            });
            if (H.code !== 0) return {
                code: H.code,
                stderr: `git checkout after sparse-checkout failed: ${H.stderr}`
            }
        }
        return E(`git clone succeeded: ${rM6(q)}`), w
    }
    if (E(`git clone failed: url=${rM6(q)} code=${w.code} error=${w.error??"none"} stderr=${w.stderr}`, {
            level: "warn"
        }), w.error?.includes("timed out")) return {
        ...w,
        stderr: `Git clone timed out after ${Math.round(O/1000)}s. The repository may be too large for the current timeout. Set CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS to increase it (e.g., 300000 for 5 minutes).

Original error: ${w.stderr}`
    };
    if (w.stderr) {
        if (w.stderr.includes("REMOTE HOST IDENTIFICATION HAS CHANGED")) {
            let j = wEK(q),
                H = j ? `ssh-keygen -R ${j}` : "ssh-keygen -R <host>";
            return {
                ...w,
                stderr: `SSH host key has changed (server key rotation or possible MITM). Remove the stale known_hosts entry:
  ${H}
Then connect once manually to verify and accept the new key.

Original error: ${w.stderr}`
            }
        }
        if (w.stderr.includes("Host key verification failed")) {
            let j = wEK(q),
                H = j ? `ssh -T git@${j}` : "ssh -T git@<host>";
            return {
                ...w,
                stderr: `SSH host key is not in your known_hosts file. To add it, connect once manually (this will show the fingerprint for you to verify):
  ${H}

Or use an HTTPS URL instead (recommended for public repos).

Original error: ${w.stderr}`
            }
        }
        if (w.stderr.includes("Permission denied (publickey)") || w.stderr.includes("Could not read from remote repository")) return {
            ...w,
            stderr: `SSH authentication failed. Please ensure your SSH keys are configured for GitHub, or use an HTTPS URL instead.

Original error: ${w.stderr}`
        };
        if (RPY(w.stderr)) return {
            ...w,
            stderr: `HTTPS authentication failed. Please ensure your credential helper is configured (e.g., gh auth login).

Original error: ${w.stderr}`
        };
        if (w.stderr.includes("timed out") || w.stderr.includes("timeout") || w.stderr.includes("Could not resolve host")) return {
            ...w,
            stderr: `Network error or timeout while cloning repository. Please check your internet connection and try again.

Original error: ${w.stderr}`
        }
    }
    if (!w.stderr) return {
        code: w.code,
        stderr: w.error || `git clone exited with code ${w.code} (no stderr output). Run with --debug to see the full command.`
    };
    return w
}
// @from(Ln 403244, Col 0)
function ES(q, K) {
    if (!q) return;
    try {
        q(K)
    } catch (_) {
        E(`Progress callback error: ${b6(_)}`, {
            level: "warn"
        })
    }
}
// @from(Ln 403254, Col 0)
async function CPY(q, K) {
    let _ = {
        ...process.env,
        ...IR
    };
    if (K && K.length > 0) return M7(D7(), ["sparse-checkout", "set", "--cone", "--", ...K], {
        cwd: q,
        timeout: he(),
        stdin: "ignore",
        env: _
    });
    let z = await M7(D7(), ["config", "--get", "core.sparseCheckout"], {
        cwd: q,
        stdin: "ignore",
        env: _
    });
    if (z.code === 0 && z.stdout.trim() === "true") return {
        code: 1,
        stderr: "sparsePaths removed from config but repository is sparse; re-cloning for full checkout"
    };
    return {
        code: 0,
        stderr: ""
    }
}
// @from(Ln 403279, Col 0)
async function Le(q, K, _, z, Y, A) {
    let O = V8(),
        w = Math.round(he() / 1000);
    ES(Y, `Refreshing marketplace cache (timeout: ${w}s)…`);
    let $ = await CPY(K, z);
    if ($.code === 0) {
        let P = performance.now(),
            W = await hPY(K, _, {
                disableCredentialHelper: A?.disableCredentialHelper,
                sparsePaths: z
            });
        if (ED("marketplace_pull", q, W.code === 0 ? "success" : "failure", performance.now() - P, W.code === 0 ? void 0 : Kx(W.stderr)), W.code === 0) return;
        if (S6(process.env.CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE)) {
            E(`git pull failed, keeping existing clone (CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE): ${W.stderr}`, {
                level: "warn"
            });
            return
        }
        E(`git pull failed, will re-clone: ${W.stderr}`, {
            level: "warn"
        })
    } else E(`sparse-checkout reconcile requires re-clone: ${$.stderr}`);
    let j = `${K}.bak`,
        H = !1;
    try {
        await O.rename(j, K)
    } catch (P) {
        if (!t1(P)) {
            let W = BM(K, ".claude-plugin", "marketplace.json");
            if (!await O.stat(W).then(() => !0, () => !1)) await O.rm(K, {
                recursive: !0,
                force: !0
            }).catch(() => {}), await O.rename(j, K)
        }
    }
    try {
        await O.rm(j, {
            recursive: !0,
            force: !0
        })
    } catch (P) {
        throw Error(`Failed to clean up stale marketplace backup directory. Please manually delete the directory at ${j} and try again.

Technical details: ${b6(P)}`)
    }
    try {
        await O.rename(K, j), H = !0, E(`Found stale marketplace directory at ${K}, moving aside to allow re-clone`, {
            level: "warn"
        }), ES(Y, "Found stale directory, cleaning up and re-cloning…")
    } catch (P) {
        if (!t1(P)) throw Error(`Failed to clean up existing marketplace directory. Please manually delete the directory at ${K} and try again.

Technical details: ${b6(P)}`)
    }
    let J = _ ? ` (ref: ${_})` : "";
    ES(Y, `Cloning repository (timeout: ${w}s): ${rM6(q)}${J}`);
    let X = performance.now(),
        M = await SPY(q, K, _, z);
    if (ED("marketplace_clone", q, M.code === 0 ? "success" : "failure", performance.now() - X, M.code === 0 ? void 0 : Kx(M.stderr)), M.code !== 0) {
        try {
            await O.rm(K, {
                recursive: !0,
                force: !0
            })
        } catch {}
        if (H) try {
            await O.rename(j, K)
        } catch {}
        throw Error(`Failed to clone marketplace repository: ${M.stderr}`)
    }
    if (H) try {
        await O.rm(j, {
            recursive: !0,
            force: !0
        })
    } catch {}
    ES(Y, "Clone complete, validating marketplace…")
}
// @from(Ln 403358, Col 0)
function bPY(q) {
    return c0(q, () => "***REDACTED***")
}
// @from(Ln 403362, Col 0)
function rM6(q) {
    try {
        let K = new URL(q);
        if ((K.protocol === "http:" || K.protocol === "https:") && (K.username || K.password)) {
            if (K.username) K.username = "***";
            if (K.password) K.password = "***";
            return K.toString()
        }
    } catch {}
    return q
}
// @from(Ln 403373, Col 0)
async function HEK(q, K, _, z) {
    let Y = V8(),
        A = rM6(q);
    if (ES(z, `Downloading marketplace from ${A}`), E(`Downloading marketplace from URL: ${A}`), _ && Object.keys(_).length > 0) E(`Using custom headers: ${I6(bPY(_))}`);
    let O = {
            ..._,
            "User-Agent": "Claude-Code-Plugin-Manager"
        },
        w, $ = performance.now();
    try {
        w = await Z1.get(q, {
            timeout: 1e4,
            headers: O
        })
    } catch (J) {
        if (ED("marketplace_url", q, "failure", performance.now() - $, Kx(J)), Z1.isAxiosError(J)) {
            if (J.code === "ECONNREFUSED" || J.code === "ENOTFOUND") throw Error(`Could not connect to ${A}. Please check your internet connection and verify the URL is correct.

Technical details: ${J.message}`);
            if (J.code === "ETIMEDOUT") throw Error(`Request timed out while downloading marketplace from ${A}. The server may be slow or unreachable.

Technical details: ${J.message}`);
            if (J.response) throw Error(`HTTP ${J.response.status} error while downloading marketplace from ${A}. The marketplace file may not exist at this URL.

Technical details: ${J.message}`)
        }
        throw Error(`Failed to download marketplace from ${A}: ${b6(J)}`)
    }
    ES(z, "Validating marketplace data");
    let j = g16().safeParse(w.data);
    if (!j.success) throw ED("marketplace_url", q, "failure", performance.now() - $, "invalid_schema"), new HV(`Invalid marketplace schema from URL: ${j.error.issues.map((J)=>`${J.path.join(".")}: ${J.message}`).join(", ")}`, A, w.data);
    ED("marketplace_url", q, "success", performance.now() - $), ES(z, "Saving marketplace to cache");
    let H = BM(K, "..");
    await Y.mkdir(H), aJ(K, I6(j.data, null, 2), {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 403412, Col 0)
function IPY(q) {
    return q.source === "github" ? q.repo.replace("/", "-") : q.source === "npm" ? q.package.replace("@", "").replace("/", "-") : q.source === "file" ? AEK(q.path).replace(".json", "") : q.source === "directory" ? AEK(q.path) : "temp_" + Date.now()
}
// @from(Ln 403415, Col 0)
async function K_7(q, K) {
    let z = await V8().readFile(q, {
            encoding: "utf-8"
        }),
        Y;
    try {
        Y = n8(z)
    } catch (O) {
        throw new HV(`Invalid JSON in ${q}: ${b6(O)}`, q, z)
    }
    let A = K.safeParse(Y);
    if (!A.success) throw new HV(`Invalid schema: ${q} ${A.error?.issues.map((O)=>`${O.path.join(".")}: ${O.message}`).join(", ")}`, q, Y);
    return A.data
}
// @from(Ln 403429, Col 0)
async function __7(q, K) {
    let _ = V8(),
        z = H_6();
    await _.mkdir(z);
    let Y, A, O = !1,
        w = IPY(q);
    try {
        switch (q.source) {
            case "url": {
                Y = BM(z, `${w}.json`), O = !0, await HEK(q.url, Y, q.headers, K), A = Y;
                break
            }
            case "github": {
                let X = `git@github.com:${q.repo}.git`,
                    M = `https://github.com/${q.repo}.git`;
                Y = BM(z, w), O = !0;
                let P = null;
                if (await jEK()) {
                    ES(K, `Cloning via SSH: ${X}`);
                    try {
                        await Le(X, Y, q.ref, q.sparsePaths, K)
                    } catch (D) {
                        P = r1(D), j6(P), ES(K, `SSH clone failed, retrying with HTTPS: ${M}`), E(`SSH clone failed for ${q.repo} despite SSH being configured, falling back to HTTPS`, {
                            level: "info"
                        }), await _.rm(Y, {
                            recursive: !0,
                            force: !0
                        });
                        try {
                            await Le(M, Y, q.ref, q.sparsePaths, K), P = null
                        } catch (Z) {
                            P = r1(Z), j6(P)
                        }
                    }
                } else {
                    ES(K, `SSH not configured, cloning via HTTPS: ${M}`), E(`SSH not configured for GitHub, using HTTPS for ${q.repo}`, {
                        level: "info"
                    });
                    try {
                        await Le(M, Y, q.ref, q.sparsePaths, K)
                    } catch (D) {
                        P = r1(D), j6(P), ES(K, `HTTPS clone failed, retrying with SSH: ${X}`), E(`HTTPS clone failed for ${q.repo} (${P.message}), falling back to SSH`, {
                            level: "info"
                        }), await _.rm(Y, {
                            recursive: !0,
                            force: !0
                        });
                        try {
                            await Le(X, Y, q.ref, q.sparsePaths, K), P = null
                        } catch (Z) {
                            P = r1(Z), j6(P)
                        }
                    }
                }
                if (P) throw P;
                A = BM(Y, q.path || ".claude-plugin/marketplace.json");
                break
            }
            case "git": {
                Y = BM(z, w), O = !0, await Le(q.url, Y, q.ref, q.sparsePaths, K), A = BM(Y, q.path || ".claude-plugin/marketplace.json");
                break
            }
            case "npm":
                throw Error("NPM marketplace sources not yet implemented");
            case "file": {
                let X = wn(q.path);
                A = X, Y = q_7(q_7(X)), O = !1;
                break
            }
            case "directory": {
                let X = wn(q.path);
                A = BM(X, ".claude-plugin", "marketplace.json"), Y = X, O = !1;
                break
            }
            case "settings": {
                Y = BM(z, q.name), A = BM(Y, ".claude-plugin", "marketplace.json"), O = !1, await _.mkdir(q_7(A)), await kPY(A, I6({
                    name: q.name,
                    owner: q.owner ?? {
                        name: "settings"
                    },
                    plugins: q.plugins
                }, null, 2));
                break
            }
            default:
                throw Error("Unsupported marketplace source type")
        }
        E(`Reading marketplace from ${A}`);
        let $;
        try {
            $ = await K_7(A, g16())
        } catch (X) {
            if (t1(X)) throw Error(`Marketplace file not found at ${A}`);
            throw Error(`Failed to parse marketplace file at ${A}: ${b6(X)}`)
        }
        let j = BM(z, $.name),
            H = wn(j),
            J = wn(z);
        if (!H.startsWith(J + Nc8)) throw Error(`Marketplace name '${$.name}' resolves to a path outside the cache directory`);
        if (Y !== j && !Wh(q)) try {
            try {
                K?.("Cleaning up old marketplace cache…")
            } catch (X) {
                E(`Progress callback error: ${b6(X)}`, {
                    level: "warn"
                })
            }
            await _.rm(j, {
                recursive: !0,
                force: !0
            }), await _.rename(Y, j), Y = j, O = !1
        } catch (X) {
            let M = b6(X);
            throw Error(`Failed to finalize marketplace cache. Please manually delete the directory at ${j} if it exists and try again.

Technical details: ${M}`)
        }
        return {
            marketplace: $,
            cachePath: Y
        }
    } catch ($) {
        if (O && Y && !Wh(q)) try {
            await _.rm(Y, {
                recursive: !0,
                force: !0
            })
        } catch (j) {
            E(`Warning: Failed to clean up temporary marketplace cache at ${Y}: ${b6(j)}`, {
                level: "warn"
            })
        }
        throw $
    }
}
// @from(Ln 403564, Col 0)
async function M_6(q, K) {
    let _ = q;
    if (Wh(q) && !$EK(q.path)) _ = {
        ...q,
        path: wn(q.path)
    };
    if (!_H6(_)) {
        if (w68(_)) throw Error(`Marketplace source '${zH6(_)}' is blocked by enterprise policy.`);
        let j = oK6() || [],
            H = Df4(),
            J = kQ1(_),
            X = `Marketplace source '${zH6(_)}'`;
        if (J) X += ` (${J})`;
        if (X += " is blocked by enterprise policy.", j.length > 0) X += ` Allowed sources: ${j.map((M)=>zH6(M)).join(", ")}`;
        else X += " No external marketplaces are allowed.";
        if (_.source === "github" && H.length > 0) X += `

Tip: The shorthand "${_.repo}" assumes github.com. For internal GitHub Enterprise, use the full URL:
  git@your-github-host.com:${_.repo}.git`;
        throw Error(X)
    }
    let z = await Dz();
    for (let [j, H] of Object.entries(z))
        if (f$(H.source, _)) return E(`Source already materialized as '${j}', skipping clone`), {
            name: j,
            alreadyMaterialized: !0,
            resolvedSource: _
        };
    let {
        marketplace: Y,
        cachePath: A
    } = await __7(_, K), O = Tg7(Y.name, _);
    if (O) throw Error(O);
    let w = await Dz(),
        $ = w[Y.name];
    if ($) {
        let j = R38($.installLocation);
        if (j) throw Error(`Marketplace '${Y.name}' is seed-managed (${j}). To use a different source, ask your admin to update the seed, or use a different marketplace name.`);
        if (E(`Marketplace '${Y.name}' exists with different source — overwriting`), !Wh($.source)) {
            let H = wn(H_6()),
                J = wn($.installLocation),
                X = wn(A);
            if (J === X);
            else if (J === H || J.startsWith(H + Nc8)) await V8().rm($.installLocation, {
                recursive: !0,
                force: !0
            });
            else E(`Skipping cleanup of old installLocation (${$.installLocation}) — ` + `outside ${H}. The path is corrupted; leaving it alone and overwriting the config entry.`, {
                level: "warn"
            })
        }
    }
    return w[Y.name] = {
        source: _,
        installLocation: A,
        lastUpdated: new Date().toISOString()
    }, await $n(w), E(`Added marketplace source: ${Y.name}`), {
        name: Y.name,
        alreadyMaterialized: !1,
        resolvedSource: _
    }
}
// @from(Ln 403626, Col 0)
async function RI6(q) {
    let K = await Dz();
    if (!K[q]) throw Error(`Marketplace '${q}' not found`);
    let _ = K[q],
        z = R38(_.installLocation);
    if (z) throw Error(`Marketplace '${q}' is registered from the read-only seed directory (${z}) and will be re-registered on next startup. To stop using its plugins: claude plugin disable <plugin>@${q}`);
    delete K[q], await $n(K);
    let Y = V8(),
        A = H_6(),
        O = BM(A, q);
    await Y.rm(O, {
        recursive: !0,
        force: !0
    }), await Y.rm(`${O}.bak`, {
        recursive: !0,
        force: !0
    });
    let w = BM(A, `${q}.json`);
    await Y.rm(w, {
        force: !0
    });
    for (let H of $v) {
        let J = E1(H);
        if (!J) continue;
        let X = !1,
            M = {};
        if (J.extraKnownMarketplaces?.[q]) {
            let P = {
                ...J.extraKnownMarketplaces
            };
            P[q] = void 0, M.extraKnownMarketplaces = P, X = !0
        }
        if (J.enabledPlugins) {
            let P = `@${q}`,
                W = {
                    ...J.enabledPlugins
                },
                D = !1;
            for (let Z in W)
                if (Z.endsWith(P)) W[Z] = void 0, D = !0;
            if (D) M.enabledPlugins = W, X = !0
        }
        if (X) {
            let P = P7(H, M);
            if (P.error) j6(P.error), E(`Failed to clean up marketplace '${q}' from ${H} settings: ${P.error.message}`);
            else E(`Cleaned up marketplace '${q}' from ${H} settings`)
        }
    }
    let {
        orphanedPaths: $,
        removedPluginIds: j
    } = MEK(q);
    for (let H of $) await hI6(H);
    for (let H of j) Vb8(H), await PS8(H);
    E(`Removed marketplace source: ${q}`)
}
// @from(Ln 403682, Col 0)
async function L38(q) {
    let K = BM(q, ".claude-plugin", "marketplace.json");
    try {
        return await K_7(K, g16())
    } catch (_) {
        if (_ instanceof HV) throw _;
        let z = Q1(_);
        if (z !== "ENOENT" && z !== "ENOTDIR") throw _
    }
    return await K_7(q, g16())
}
// @from(Ln 403693, Col 0)
async function G68(q) {
    let K = V8(),
        _ = Ec8();
    try {
        let z = await K.readFile(_, {
                encoding: "utf-8"
            }),
            A = n8(z)[q];
        if (!A) return null;
        return await L38(A.installLocation)
    } catch (z) {
        if (t1(z)) return null;
        return E(`Failed to read cached marketplace ${q}: ${b6(z)}`, {
            level: "warn"
        }), null
    }
}
// @from(Ln 403710, Col 0)
async function Md1(q) {
    let {
        name: K,
        marketplace: _
    } = Z4(q);
    if (!K || !_) return null;
    let z = V8(),
        Y = Ec8();
    try {
        let A = await z.readFile(Y, {
                encoding: "utf-8"
            }),
            w = n8(A)[_];
        if (!w) return null;
        let $ = await G68(_);
        if (!$) return null;
        let j = $.plugins.find((H) => H.name === K);
        if (!j) return null;
        return {
            entry: j,
            marketplaceInstallLocation: w.installLocation
        }
    } catch {
        return null
    }
}
// @from(Ln 403736, Col 0)
async function mf(q) {
    let K = await Md1(q);
    if (K) return K;
    let {
        name: _,
        marketplace: z
    } = Z4(q);
    if (!_ || !z) return null;
    try {
        let A = (await Dz())[z];
        if (!A) return null;
        let w = (await xf(z)).plugins.find(($) => $.name === _);
        if (!w) return null;
        return {
            entry: w,
            marketplaceInstallLocation: A.installLocation
        }
    } catch (Y) {
        return E(`Could not find plugin ${q}: ${b6(Y)}`, {
            level: "debug"
        }), null
    }
}
// @from(Ln 403759, Col 0)
async function JEK() {
    let q = await Dz();
    for (let [K, _] of Object.entries(q)) {
        if (R38(_.installLocation)) {
            E(`Skipping seed-managed marketplace '${K}' in bulk refresh`);
            continue
        }
        if (_.source.source === "settings") continue;
        if (K === WM) {
            if (await y38(_.installLocation, H_6()) !== null) {
                q[K].lastUpdated = new Date().toISOString();
                continue
            }
            if (!u8("tengu_plugin_official_mkt_git_fallback", !0)) {
                E("Skipping official marketplace bulk refresh: GCS failed, git fallback disabled");
                continue
            }
        }
        try {
            let {
                cachePath: z
            } = await __7(_.source);
            q[K].lastUpdated = new Date().toISOString(), q[K].installLocation = z
        } catch (z) {
            E(`Failed to refresh marketplace ${K}: ${b6(z)}`, {
                level: "error"
            })
        }
    }
    await $n(q)
}
// @from(Ln 403791, Col 0)
function P_6(q, K, _) {
    let z = `${q}:${_?.disableCredentialHelper?1:0}`,
        Y = kc8.get(z);
    if (Y) {
        if (K) Y.listeners.push(K);
        return Y.promise
    }
    let A = K ? [K] : [],
        w = xPY(q, ($) => {
            for (let j of A) ES(j, $)
        }, _).finally(() => kc8.delete(z));
    return kc8.set(z, {
        promise: w,
        listeners: A
    }), w
}
// @from(Ln 403807, Col 0)
async function xPY(q, K, _) {
    let z = await Dz(),
        Y = z[q];
    if (!Y) throw Error(`Marketplace '${q}' not found. Available marketplaces: ${Object.keys(z).join(", ")}`);
    if (_?.skipIfRecent && Y.lastUpdated) {
        let A = Date.now() - new Date(Y.lastUpdated).getTime();
        if (A >= 0 && A < 30000) {
            E(`Skipping refresh for marketplace '${q}' — refreshed ${Math.round(A/1000)}s ago`);
            return
        }
    }
    if (xf.cache?.delete?.(q), Y.source.source === "settings") {
        E(`Skipping refresh for settings-sourced marketplace '${q}' — no upstream`);
        return
    }
    try {
        let {
            installLocation: A,
            source: O
        } = Y, w = R38(A);
        if (w) throw Error(`Marketplace '${q}' is seed-managed (${w}) and its content is controlled by the seed image. To update: ask your admin to update the seed.`);
        if (!Wh(O)) {
            let $ = wn(H_6()),
                j = wn(A);
            if (j !== $ && !j.startsWith($ + Nc8)) throw Error(`Marketplace '${q}' has a corrupted installLocation (${A}) — expected a path inside ${$}. This can happen after cross-platform path writes or manual edits to known_marketplaces.json. Run: claude plugin marketplace remove "${q}" and re-add it.`)
        }
        if (q === WM) {
            if (await y38(A, H_6()) !== null) {
                z[q] = {
                    ...Y,
                    lastUpdated: new Date().toISOString()
                }, await $n(z);
                return
            }
            if (!u8("tengu_plugin_official_mkt_git_fallback", !0)) throw Error("Official marketplace GCS fetch failed and git fallback is disabled");
            E("Official marketplace GCS failed; falling back to git", {
                level: "warn"
            })
        }
        if (O.source === "github" || O.source === "git") {
            if (O.source === "github") {
                let $ = `git@github.com:${O.repo}.git`,
                    j = `https://github.com/${O.repo}.git`;
                if (S6(process.env.CLAUDE_CODE_REMOTE)) await Le(j, A, O.ref, O.sparsePaths, K, _);
                else {
                    let H = await jEK(),
                        J = H ? $ : j,
                        X = H ? j : $;
                    try {
                        await Le(J, A, O.ref, O.sparsePaths, K, _)
                    } catch {
                        E(`Marketplace refresh failed with ${H?"SSH":"HTTPS"} for ${O.repo}, falling back to ${H?"HTTPS":"SSH"}`, {
                            level: "info"
                        }), await Le(X, A, O.ref, O.sparsePaths, K, _)
                    }
                }
            } else await Le(O.url, A, O.ref, O.sparsePaths, K, _);
            try {
                await L38(A)
            } catch {
                let $ = O.source === "github" ? O.repo : rM6(O.url);
                throw Error(`The marketplace.json file is no longer present in this repository.

${q==="claude-code-plugins"?`We've deprecated "claude-code-plugins" in favor of "claude-plugins-official".`:"This marketplace may have been deprecated or moved to a new location."}
Source: ${$}

You can remove this marketplace with: claude plugin marketplace remove "${q}"`)
            }
        } else if (O.source === "url") await HEK(O.url, A, O.headers, K);
        else if (Wh(O)) ES(K, "Validating local marketplace"), await L38(A);
        else throw Error("Unsupported marketplace source type for refresh");
        z[q].lastUpdated = new Date().toISOString(), await $n(z), E(`Successfully refreshed marketplace: ${q}`)
    } catch (A) {
        let O = A instanceof Error ? A.message : String(A);
        throw E(`Failed to refresh marketplace ${q}: ${O}`, {
            level: "error"
        }), Error(`Failed to refresh marketplace '${q}': ${O}`)
    }
}
// @from(Ln 403886, Col 0)
async function XEK(q, K) {
    let _ = await Dz(),
        z = _[q];
    if (!z) throw Error(`Marketplace '${q}' not found. Available marketplaces: ${Object.keys(_).join(", ")}`);
    let Y = R38(z.installLocation);
    if (Y) throw Error(`Marketplace '${q}' is seed-managed (${Y}) and auto-update is always disabled for seed content. To update: ask your admin to update the seed.`);
    if (z.autoUpdate === K) return;
    _[q] = {
        ...z,
        autoUpdate: K
    }, await $n(_);
    let A = NPY(q);
    if (A) {
        let O = E1(A)?.extraKnownMarketplaces?.[q];
        if (O) h38(q, {
            source: O.source,
            autoUpdate: K
        }, A)
    }
    E(`Set autoUpdate=${K} for marketplace: ${q}`)
}
// @from(Ln 403907, Col 4)
LPY = 120000
// @from(Ln 403908, Col 4)
xf
// @from(Ln 403908, Col 8)
kc8
// @from(Ln 403909, Col 4)
m$ = L(() => {
    CK();
    JU();
    G16();
    U4();
    B1();
    K8();
    Q8();
    m8();
    Q4();
    Yq();
    pK();
    U8();
    aY();
    a1();
    e8();
    WS8();
    uR();
    Y68();
    A68();
    yD();
    Xc();
    qH6();
    e97();
    Jy();
    aW();
    Gx();
    Hv();
    xf = P1(async (q) => {
        let K = await Dz(),
            _ = K[q];
        if (!_) throw Error(`Marketplace '${q}' not found in configuration. Available marketplaces: ${Object.keys(K).join(", ")}`);
        if (Wh(_.source) && !$EK(_.source.path)) throw Error(`Marketplace "${q}" has a relative source path (${_.source.path}) ` + "in known_marketplaces.json — this is stale state from an older " + `Claude Code version. Run 'claude marketplace remove ${q}' and re-add it from the original project directory.`);
        try {
            return await L38(_.installLocation)
        } catch (Y) {
            E(`Cache corrupted or missing for marketplace ${q}, re-fetching from source: ${b6(Y)}`, {
                level: "warn"
            })
        }
        let z;
        try {
            ({
                marketplace: z
            } = await __7(_.source))
        } catch (Y) {
            throw Error(`Failed to load marketplace "${q}" from source (${_.source.source}): ${b6(Y)}`)
        }
        return K[q].lastUpdated = new Date().toISOString(), await $n(K), z
    });
    kc8 = new Map
})
// @from(Ln 403966, Col 0)
function C38() {
    return oM6(gP(), "installed_plugins.json")
}
// @from(Ln 403970, Col 0)
function uPY() {
    return oM6(gP(), "installed_plugins_v2.json")
}
// @from(Ln 403974, Col 0)
function mPY() {
    if (S38) return;
    let q = V8(),
        K = C38(),
        _ = uPY();
    try {
        try {
            q.renameSync(_, K), E("Renamed installed_plugins_v2.json to installed_plugins.json");
            let O = OZ();
            PEK(O), S38 = !0;
            return
        } catch (O) {
            if (!t1(O)) throw O
        }
        let z;
        try {
            z = q.readFileSync(K, {
                encoding: "utf-8"
            })
        } catch (O) {
            if (!t1(O)) throw O;
            S38 = !0;
            return
        }
        let Y = n8(z);
        if ((typeof Y?.version === "number" ? Y.version : 1) === 1) {
            let O = mQ6().parse(Y),
                w = Y_7(O);
            aJ(K, I6(w, null, 2), {
                encoding: "utf-8",
                flush: !0
            }), E(`Converted installed_plugins.json from V1 to V2 format (${Object.keys(O.plugins).length} plugins)`), PEK(w)
        }
        S38 = !0
    } catch (z) {
        let Y = b6(z);
        E(`Failed to migrate plugin files: ${Y}`, {
            level: "error"
        }), j6(r1(z)), S38 = !0
    }
}
// @from(Ln 404016, Col 0)
function PEK(q) {
    let K = V8(),
        _ = RL6();
    try {
        let z = new Set;
        for (let A of Object.values(q.plugins))
            for (let O of A) z.add(O.installPath);
        let Y = K.readdirSync(_);
        for (let A of Y) {
            if (!A.isDirectory()) continue;
            let O = A.name,
                w = oM6(_, O);
            if (K.readdirSync(w).some((H) => {
                    if (!H.isDirectory()) return !1;
                    let J = oM6(w, H.name);
                    return K.readdirSync(J).some((M) => M.isDirectory())
                })) continue;
            if (!z.has(w)) K.rmSync(w, {
                recursive: !0,
                force: !0
            }), E(`Cleaned up legacy cache directory: ${O}`)
        }
    } catch (z) {
        let Y = b6(z);
        E(`Failed to clean up legacy cache: ${Y}`, {
            level: "warn"
        })
    }
}
// @from(Ln 404046, Col 0)
function z_7() {
    let q = V8(),
        K = C38(),
        _;
    try {
        _ = q.readFileSync(K, {
            encoding: "utf-8"
        })
    } catch (A) {
        if (t1(A)) return null;
        throw A
    }
    let z = n8(_);
    return {
        version: typeof z?.version === "number" ? z.version : 1,
        data: z
    }
}
// @from(Ln 404065, Col 0)
function Y_7(q) {
    let K = {};
    for (let [_, z] of Object.entries(q.plugins)) {
        let Y = Sp(_, z.version);
        K[_] = [{
            scope: "user",
            installPath: Y,
            version: z.version,
            installedAt: z.installedAt,
            lastUpdated: z.lastUpdated,
            gitCommitSha: z.gitCommitSha
        }]
    }
    return {
        version: 2,
        plugins: K
    }
}
// @from(Ln 404084, Col 0)
function OZ() {
    if (jn !== null) return jn;
    let q = C38();
    try {
        let K = z_7();
        if (K) {
            if (K.version === 2) {
                let Y = BQ6().parse(K.data);
                return jn = Y, E(`Loaded ${Object.keys(Y.plugins).length} installed plugins from ${q}`), Y
            }
            let _ = mQ6().parse(K.data),
                z = Y_7(_);
            return jn = z, E(`Loaded and converted ${Object.keys(_.plugins).length} plugins from V1 format`), z
        }
        return E("installed_plugins.json doesn't exist, returning empty V2 object"), jn = {
            version: 2,
            plugins: {}
        }, jn
    } catch (K) {
        let _ = b6(K);
        return E(`Failed to load installed_plugins.json: ${_}. Starting with empty state.`, {
            level: "error"
        }), j6(r1(K)), jn = {
            version: 2,
            plugins: {}
        }, jn
    }
}
// @from(Ln 404113, Col 0)
function hc8(q) {
    let K = V8(),
        _ = C38();
    try {
        K.mkdirSync(gP());
        let z = I6(q, null, 2);
        aJ(_, z, {
            encoding: "utf-8",
            flush: !0
        }), jn = q, E(`Saved ${Object.keys(q.plugins).length} installed plugins to ${_}`)
    } catch (z) {
        let Y = b6(z);
        throw j6(r1(z)), z
    }
}
// @from(Ln 404129, Col 0)
function DEK(q, K, _) {
    let z = mR(),
        Y = z.plugins[q];
    if (!Y) return;
    if (z.plugins[q] = Y.filter((A) => !(A.scope === K && A.projectPath === _)), z.plugins[q].length === 0) delete z.plugins[q];
    hc8(z), E(`Removed installation for ${q} at scope ${K}`)
}
// @from(Ln 404137, Col 0)
function N68() {
    if (Lc8 === null) Lc8 = OZ();
    return Lc8
}
// @from(Ln 404142, Col 0)
function mR() {
    try {
        let q = z_7();
        if (q) {
            if (q.version === 2) return BQ6().parse(q.data);
            let K = mQ6().parse(q.data);
            return Y_7(K)
        }
        return {
            version: 2,
            plugins: {}
        }
    } catch (q) {
        let K = b6(q);
        return E(`Failed to load installed plugins from disk: ${K}`, {
            level: "error"
        }), {
            version: 2,
            plugins: {}
        }
    }
}
// @from(Ln 404165, Col 0)
function ZEK(q, K, _, z, Y, A) {
    let O = mR(),
        w = O.plugins[q];
    if (!w) {
        E(`Cannot update ${q} on disk: plugin not found in installed plugins`);
        return
    }
    let $ = w.find((j) => j.scope === K && j.projectPath === _);
    if ($) {
        if ($.installPath = z, $.version = Y, delete $.resolvedVersion, $.lastUpdated = new Date().toISOString(), A !== void 0) $.gitCommitSha = A;
        let j = C38();
        aJ(j, I6(O, null, 2), {
            encoding: "utf-8",
            flush: !0
        }), jn = null, E(`Updated ${q} on disk to version ${Y} at ${z}`)
    } else E(`Cannot update ${q} on disk: no installation for scope ${K}`)
}
// @from(Ln 404182, Col 0)
async function A_7() {
    mPY();
    try {
        await w_7()
    } catch (K) {
        j6(K)
    }
    let q = N68();
    E(`Initialized versioned plugins system with ${Object.keys(q.plugins).length} plugins`)
}
// @from(Ln 404193, Col 0)
function MEK(q) {
    if (!q) return {
        orphanedPaths: [],
        removedPluginIds: []
    };
    let K = mR(),
        _ = `@${q}`,
        z = new Set,
        Y = [];
    for (let A of Object.keys(K.plugins)) {
        if (!A.endsWith(_)) continue;
        for (let O of K.plugins[A] ?? [])
            if (O.installPath) z.add(O.installPath);
        delete K.plugins[A], Y.push(A), E(`Removed installed plugin for marketplace removal: ${A}`)
    }
    if (Y.length > 0) hc8(K);
    return {
        orphanedPaths: Array.from(z),
        removedPluginIds: Y
    }
}
// @from(Ln 404215, Col 0)
function O_7(q) {
    return q.scope === "user" || q.scope === "managed" || q.projectPath === Y7()
}
// @from(Ln 404219, Col 0)
function Hu(q) {
    let _ = OZ().plugins[q];
    if (!_ || _.length === 0) return !1;
    if (!_.some(O_7)) return !1;
    return y7().enabledPlugins?.[q] !== void 0
}
// @from(Ln 404226, Col 0)
function aM6(q) {
    let _ = OZ().plugins[q];
    if (!_ || _.length === 0) return !1;
    if (!_.some((Y) => Y.scope === "user" || Y.scope === "managed")) return !1;
    return y7().enabledPlugins?.[q] !== void 0
}
// @from(Ln 404233, Col 0)
function jd1(q, K, _ = "user", z) {
    let Y = mR(),
        A = {
            scope: _,
            installPath: K.installPath,
            version: K.version,
            installedAt: K.installedAt,
            lastUpdated: K.lastUpdated,
            gitCommitSha: K.gitCommitSha,
            ...K.resolvedVersion && {
                resolvedVersion: K.resolvedVersion
            },
            ...z && {
                projectPath: z
            }
        },
        O = Y.plugins[q] || [],
        w = O.findIndex((j) => j.scope === _ && j.projectPath === z),
        $ = w >= 0;
    if ($) O[w] = A;
    else O.push(A);
    Y.plugins[q] = O, hc8(Y), Lc8 = null, E(`${$?"Updated":"Added"} installed plugin: ${q} (scope: ${_})`)
}
// @from(Ln 404256, Col 0)
async function lS8(q) {
    return await ZQ6(q) ?? void 0
}
// @from(Ln 404260, Col 0)
function WEK(q, K) {
    let _ = V8(),
        z = oM6(q, ".claude-plugin", "plugin.json");
    try {
        let Y = _.readFileSync(z, {
            encoding: "utf-8"
        });
        return n8(Y).version || "unknown"
    } catch {
        return E(`Could not extract version from manifest for ${K}`), "unknown"
    }
}
// @from(Ln 404272, Col 0)
async function w_7() {
    let q = new Set(Object.entries(E1("policySettings")?.enabledPlugins || {}).filter(([H, J]) => H.includes("@") && J === !0).map(([H]) => H)),
        K = b8(),
        _ = new Map;
    for (let H of $v) {
        let X = E1(H)?.enabledPlugins || {};
        for (let M of Object.keys(X)) {
            if (!M.includes("@")) continue;
            let P = zf4(H);
            _.set(M, {
                scope: P,
                projectPath: P === "user" ? void 0 : K
            })
        }
    }
    for (let H of q) _.set(H, {
        scope: "managed",
        projectPath: void 0
    });
    let z = z_7(),
        Y = z !== null,
        A = Y && z?.version === 2;
    if (_.size === 0 && !Y) return;
    if (A && z) {
        let H = BQ6().safeParse(z.data);
        if (H?.success) {
            let J = H.data.plugins,
                X = [..._.keys()].every((P) => {
                    let W = J[P];
                    if (!W || W.length === 0) return !1;
                    if (q.has(P)) return W.length === 1 && W[0]?.scope === "managed";
                    return !0
                }),
                M = Object.entries(J).every(([P, W]) => q.has(P) || !W.some((D) => D.scope === "managed"));
            if (X && M) {
                E("All plugins already exist, skipping migration");
                return
            }
        }
    }
    E(Y ? "Syncing installed_plugins.json with enabledPlugins from all settings.json files" : "Creating installed_plugins.json from settings.json files");
    let O = new Date().toISOString(),
        w = {};
    if (Y) w = {
        ...OZ().plugins
    };
    let $ = 0,
        j = 0;
    for (let [H, J] of Object.entries(w)) {
        if (q.has(H)) continue;
        if (_.has(H)) continue;
        if (!J.some((M) => M.scope === "managed")) continue;
        let X = J.filter((M) => M.scope !== "managed");
        if (X.length === 0) delete w[H];
        else w[H] = X;
        $++, E(`Dropped orphaned managed entry for ${H} (no longer policy-required)`)
    }
    for (let [H, J] of _) {
        let X = w[H];
        if (X && X.length > 0) {
            let M = X[0],
                P = !1;
            if (M && (M.scope !== J.scope || M.projectPath !== J.projectPath)) {
                if (M.scope = J.scope, J.projectPath) M.projectPath = J.projectPath;
                else delete M.projectPath;
                M.lastUpdated = O, P = !0, E(`Updated ${H} scope to ${J.scope} (settings.json is source of truth)`)
            }
            if (J.scope === "managed") {
                if (X.length > 1) E(`Collapsed ${H} to single managed entry (was ${X.length})`), w[H] = X.slice(0, 1), P = !0
            } else if (X.length > 1) {
                let W = new Set,
                    D = X.filter((Z) => {
                        if (Z.scope === "managed") return !1;
                        let G = `${Z.scope}|${Z.projectPath??""}`;
                        if (W.has(G)) return !1;
                        return W.add(G), !0
                    });
                if (D.length < X.length) E(`Cleaned ${H} (${X.length}→${D.length}: stripped stale managed and/or dedupes)`), w[H] = D, P = !0
            }
            if (P) $++
        } else {
            let {
                name: M,
                marketplace: P
            } = Z4(H);
            if (!M || !P) continue;
            try {
                E(`Looking up plugin ${H} in marketplace ${P}`);
                let W = await mf(H);
                if (!W) {
                    E(`Plugin ${H} not found in any marketplace, skipping`);
                    continue
                }
                let {
                    entry: D,
                    marketplaceInstallLocation: Z
                } = W, G, f = "unknown", v = void 0;
                if (typeof D.source === "string") G = oM6(Z, D.source), f = WEK(G, H), v = await lS8(G);
                else {
                    let V = RL6(),
                        k = M.replace(/[^a-zA-Z0-9-_]/g, "-"),
                        N = oM6(V, k),
                        R;
                    try {
                        R = (await V8().readdir(N)).map((h) => typeof h === "string" ? h : h.name)
                    } catch (h) {
                        if (!t1(h)) throw h;
                        E(`External plugin ${H} not in cache, skipping`);
                        continue
                    }
                    if (G = N, R.includes(".claude-plugin")) f = WEK(N, H);
                    v = await lS8(N)
                }
                if (f === "unknown" && D.version) f = D.version;
                if (f === "unknown" && v) f = v.substring(0, 12);
                w[H] = [{
                    scope: J.scope,
                    installPath: Sp(H, f),
                    version: f,
                    installedAt: O,
                    lastUpdated: O,
                    gitCommitSha: v,
                    ...J.projectPath && {
                        projectPath: J.projectPath
                    }
                }], j++, E(`Added ${H} with scope ${J.scope}`)
            } catch (W) {
                E(`Failed to add plugin ${H}: ${W}`)
            }
        }
    }
    if (!Y || $ > 0 || j > 0) hc8({
        version: 2,
        plugins: w
    }), E(`Sync completed: ${j} added, ${$} updated in installed_plugins.json`)
}
// @from(Ln 404408, Col 4)
S38 = !1
// @from(Ln 404409, Col 4)
jn = null
// @from(Ln 404410, Col 4)
Lc8 = null
// @from(Ln 404411, Col 4)
yD = L(() => {
    K8();
    m8();
    Yq();
    U8();
    e8();
    Jy();
    Hv();
    y8();
    n7();
    sC();
    aY();
    a1();
    m$();
    aW();
    vH()
})
// @from(Ln 404429, Col 0)
function b38(q) {
    if (!u8("tengu_lapis_finch", !1)) return;
    if (iZ4()) return;
    let K = H8().claudeCodeHints;
    if (K?.disabled) return;
    let _ = K?.plugin ?? [];
    if (_.length >= BPY) return;
    let z = q.value,
        {
            name: Y,
            marketplace: A
        } = Z4(z);
    if (!Y || !A) return;
    if (!eI(A)) return;
    if (_.includes(z)) return;
    if (Hu(z)) return;
    if (Rk(z)) return;
    if (fEK.has(z)) return;
    fEK.add(z), dZ4(q)
}
// @from(Ln 404449, Col 0)
async function GEK(q) {
    let K = q.value,
        {
            name: _,
            marketplace: z
        } = Z4(K),
        Y = await mf(K);
    if (d("tengu_plugin_hint_detected", {
            _PROTO_plugin_name: _ ?? "",
            _PROTO_marketplace_name: z ?? "",
            result: Y ? "passed" : "not_in_cache"
        }), !Y) return E(`[hintRecommendation] ${K} not found in marketplace cache`), null;
    return {
        pluginId: K,
        pluginName: Y.entry.name,
        marketplaceName: z ?? "",
        pluginDescription: Y.entry.description,
        sourceCommand: q.sourceCommand
    }
}
// @from(Ln 404470, Col 0)
function vEK(q) {
    d8((K) => {
        let _ = K.claudeCodeHints?.plugin ?? [];
        if (_.includes(q)) return K;
        return {
            ...K,
            claudeCodeHints: {
                ...K.claudeCodeHints,
                plugin: [..._, q]
            }
        }
    })
}
// @from(Ln 404484, Col 0)
function TEK() {
    d8((q) => {
        if (q.claudeCodeHints?.disabled) return q;
        return {
            ...q,
            claudeCodeHints: {
                ...q.claudeCodeHints,
                disabled: !0
            }
        }
    })
}
// @from(Ln 404496, Col 4)
BPY = 100
// @from(Ln 404497, Col 4)
fEK
// @from(Ln 404498, Col 4)
Rc8 = L(() => {
    B1();
    C8();
    q68();
    h1();
    K8();
    yD();
    m$();
    aW();
    AH6();
    fEK = new Set
})
// @from(Ln 404511, Col 0)
function gPY(q) {
    let z = (q.trim().replace(/^[&.]\s+/, "").split(/\s+/)[0] || "").replace(/^["']|["']$/g, "");
    return (z.split(/[\\/]/).pop() || z).toLowerCase().replace(/\.exe$/, "")
}
// @from(Ln 404516, Col 0)
function UPY(q) {
    let K = q.split(/[;|]/).filter((z) => z.trim()),
        _ = K[K.length - 1] || q;
    return gPY(_)
}
// @from(Ln 404522, Col 0)
function VEK(q, K, _, z) {
    let Y = UPY(q);
    return (FPY.get(Y) ?? pPY)(K, _, z)
}
// @from(Ln 404526, Col 4)
pPY = (q, K, _) => ({
        isError: q !== 0,
        message: q !== 0 ? `Command failed with exit code ${q}` : void 0
    })
// @from(Ln 404530, Col 4)
$_7 = (q, K, _) => ({
        isError: q >= 2,
        message: q === 1 ? "No matches found" : void 0
    })
// @from(Ln 404534, Col 4)
FPY
// @from(Ln 404535, Col 4)
kEK = L(() => {
    FPY = new Map([
        ["grep", $_7],
        ["rg", $_7],
        ["findstr", $_7],
        ["robocopy", (q, K, _) => ({
            isError: q >= 8,
            message: q === 0 ? "No files copied (already in sync)" : q >= 1 && q < 8 ? q & 1 ? "Files copied successfully" : "Robocopy completed (no errors)" : void 0
        })]
    ])
})
// @from(Ln 404547, Col 0)
function dPY() {
    let q = process.env.CLAUDE_CODE_PWSH_PARSE_TIMEOUT_MS;
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K) && K > 0) return K
    }
    return QPY
}
// @from(Ln 404556, Col 0)
function sM6(q, K, _) {
    return {
        ...tPY,
        errors: [{
            message: K,
            errorId: _
        }],
        originalCommand: q
    }
}
// @from(Ln 404567, Col 0)
function ePY(q) {
    if (typeof Buffer < "u") return Buffer.from(q, "utf16le").toString("base64");
    let K = [];
    for (let _ = 0; _ < q.length; _++) {
        let z = q.charCodeAt(_);
        K.push(z & 255, z >> 8 & 255)
    }
    return btoa(K.map((_) => String.fromCharCode(_)).join(""))
}
// @from(Ln 404577, Col 0)
function qWY(q) {
    return `$EncodedCommand = '${typeof Buffer<"u"?Buffer.from(q,"utf8").toString("base64"):btoa(new TextEncoder().encode(q).reduce((_,z)=>_+String.fromCharCode(z),""))}'
${EEK}`
}
// @from(Ln 404582, Col 0)
function yS(q) {
    if (q === void 0 || q === null) return [];
    return Array.isArray(q) ? q : [q]
}
// @from(Ln 404587, Col 0)
function KWY(q) {
    switch (q) {
        case "PipelineAst":
            return "PipelineAst";
        case "PipelineChainAst":
            return "PipelineChainAst";
        case "AssignmentStatementAst":
            return "AssignmentStatementAst";
        case "IfStatementAst":
            return "IfStatementAst";
        case "ForStatementAst":
            return "ForStatementAst";
        case "ForEachStatementAst":
            return "ForEachStatementAst";
        case "WhileStatementAst":
            return "WhileStatementAst";
        case "DoWhileStatementAst":
            return "DoWhileStatementAst";
        case "DoUntilStatementAst":
            return "DoUntilStatementAst";
        case "SwitchStatementAst":
            return "SwitchStatementAst";
        case "TryStatementAst":
            return "TryStatementAst";
        case "TrapStatementAst":
            return "TrapStatementAst";
        case "FunctionDefinitionAst":
            return "FunctionDefinitionAst";
        case "DataStatementAst":
            return "DataStatementAst";
        default:
            return "UnknownStatementAst"
    }
}
// @from(Ln 404622, Col 0)
function x38(q, K) {
    switch (q) {
        case "ScriptBlockExpressionAst":
            return "ScriptBlock";
        case "SubExpressionAst":
        case "ArrayExpressionAst":
            return "SubExpression";
        case "ExpandableStringExpressionAst":
            return "ExpandableString";
        case "InvokeMemberExpressionAst":
        case "MemberExpressionAst":
            return "MemberInvocation";
        case "VariableExpressionAst":
            return "Variable";
        case "StringConstantExpressionAst":
        case "ConstantExpressionAst":
            return "StringConstant";
        case "CommandParameterAst":
            return "Parameter";
        case "ParenExpressionAst":
            return "SubExpression";
        case "CommandExpressionAst":
            if (K) return x38(K);
            return "Other";
        default:
            return "Other"
    }
}
// @from(Ln 404651, Col 0)
function H_7(q) {
    if (/^[A-Za-z]+-[A-Za-z][A-Za-z0-9_]*$/.test(q)) return "cmdlet";
    if (/[.\\/]/.test(q)) return "application";
    return "unknown"
}
// @from(Ln 404657, Col 0)
function Sc8(q) {
    let K = q.lastIndexOf("\\");
    if (K < 0) return q;
    if (/^[A-Za-z]:/.test(q) || q.startsWith("\\\\") || q.startsWith(".\\") || q.startsWith("..\\")) return q;
    return q.substring(K + 1)
}
// @from(Ln 404664, Col 0)
function NEK(q) {
    let K = yS(q.commandElements),
        _ = "",
        z = [],
        Y = [],
        A = [],
        O = !1,
        w = "unknown";
    if (K.length > 0) {
        let H = K[0],
            M = ((H.type === "StringConstantExpressionAst" || H.type === "ExpandableStringExpressionAst") && typeof H.value === "string" ? H.value : H.text).replace(/^['"]|['"]$/g, "");
        if (/[\u0080-\uFFFF]/.test(M)) w = "application";
        else w = H_7(M);
        _ = Sc8(M), Y.push(x38(H.type, H.expressionType));
        for (let P = 1; P < K.length; P++) {
            let W = K[P],
                D = W.type === "StringConstantExpressionAst" || W.type === "ExpandableStringExpressionAst";
            z.push(D && W.value != null ? W.value : W.text), Y.push(x38(W.type, W.expressionType));
            let Z = yS(W.children);
            if (Z.length > 0) O = !0, A.push(Z.map((G) => ({
                type: x38(G.type),
                text: G.text
            })));
            else A.push(void 0)
        }
    }
    let $ = {
            name: _,
            nameType: w,
            elementType: "CommandAst",
            args: z,
            text: q.text,
            elementTypes: Y,
            ...O && {
                children: A
            }
        },
        j = yS(q.redirections);
    if (j.length > 0) $.redirections = j.map(I38);
    return $
}
// @from(Ln 404706, Col 0)
function _WY(q) {
    let K = q.type === "ParenExpressionAst" ? "ParenExpressionAst" : "CommandExpressionAst",
        _ = [x38(q.type, q.expressionType)];
    return {
        name: q.text,
        nameType: "unknown",
        elementType: K,
        args: [],
        text: q.text,
        elementTypes: _
    }
}
// @from(Ln 404719, Col 0)
function I38(q) {
    if (q.type === "MergingRedirectionAst") return {
        operator: "2>&1",
        target: "",
        isMerging: !0
    };
    let K = q.append ?? !1,
        _ = q.fromStream ?? "Output",
        z;
    if (K) switch (_) {
        case "Error":
            z = "2>>";
            break;
        case "All":
            z = "*>>";
            break;
        default:
            z = ">>";
            break
    } else switch (_) {
        case "Error":
            z = "2>";
            break;
        case "All":
            z = "*>";
            break;
        default:
            z = ">";
            break
    }
    return {
        operator: z,
        target: q.locationText ?? "",
        isMerging: !1
    }
}
// @from(Ln 404756, Col 0)
function zWY(q) {
    let K = KWY(q.type),
        _ = [],
        z = [];
    if (q.elements) {
        for (let $ of yS(q.elements))
            if ($.type === "CommandAst") {
                _.push(NEK($));
                for (let j of yS($.redirections)) z.push(I38(j))
            } else {
                _.push(_WY($));
                for (let j of yS($.redirections)) z.push(I38(j))
            } let w = new Set(z.map(($) => `${$.operator}\x00${$.target}`));
        for (let $ of yS(q.redirections)) {
            let j = I38($),
                H = `${j.operator}\x00${j.target}`;
            if (!w.has(H)) w.add(H), z.push(j)
        }
    } else {
        _.push({
            name: q.text,
            nameType: "unknown",
            elementType: "CommandExpressionAst",
            args: [],
            text: q.text
        });
        for (let w of yS(q.redirections)) z.push(I38(w))
    }
    let Y, A = yS(q.nestedCommands);
    if (A.length > 0) Y = A.map(NEK);
    let O = {
        statementType: K,
        commands: _,
        redirections: z,
        text: q.text,
        nestedCommands: Y
    };
    if (q.securityPatterns) O.securityPatterns = q.securityPatterns;
    return O
}
// @from(Ln 404797, Col 0)
function YWY(q) {
    let K = {
            valid: q.valid,
            errors: yS(q.errors),
            statements: yS(q.statements).map(zWY),
            variables: yS(q.variables),
            hasStopParsing: q.hasStopParsing,
            originalCommand: q.originalCommand
        },
        _ = yS(q.typeLiterals);
    if (_.length > 0) K.typeLiterals = _;
    if (q.hasUsingStatements) K.hasUsingStatements = !0;
    if (q.hasScriptRequirements) K.hasScriptRequirements = !0;
    if (q.hasBackgroundJob) K.hasBackgroundJob = !0;
    return K
}
// @from(Ln 404813, Col 0)
async function AWY(q) {
    let K = Buffer.byteLength(q, "utf8");
    if (K > j_7) return E(`PowerShell parser: command too long (${K} bytes, max ${j_7})`), sM6(q, `Command too long for parsing (${K} bytes). Maximum supported length is ${j_7} bytes.`, "CommandTooLong");
    let _ = await $e();
    if (!_) return sM6(q, "PowerShell is not available", "NoPowerShell");
    let z = qWY(q),
        A = ["-NoProfile", "-NonInteractive", "-NoLogo", "-EncodedCommand", ePY(z)],
        O = dPY(),
        w = "",
        $ = "",
        j = null,
        H = !1,
        J = null;
    for (let M = 0; M < 2; M++) {
        J = null, H = !1;
        try {
            let P = await Xh(_, A, {
                timeout: O,
                reject: !1
            });
            w = P.stdout, $ = P.stderr, H = P.timedOut, j = P.failed ? P.exitCode ?? 1 : 0
        } catch (P) {
            J = P instanceof Error ? P.message : String(P), j = null
        }
        if (j === 0) break;
        E(`PowerShell parser: ${J?`failed to spawn pwsh: ${J}`:H?`pwsh timed out after ${O}ms`:`pwsh exited ${j}: ${$}`} (attempt ${M+1})`)
    }
    if (J) return sM6(q, `Failed to spawn PowerShell: ${J}`, "PwshSpawnError");
    if (H) return sM6(q, `pwsh timed out after ${O}ms (2 attempts)`, "PwshTimeout");
    if (j !== 0) return E(`PowerShell parser: pwsh exited with code ${j}, stderr: ${$}`), sM6(q, `pwsh exited with code ${j}: ${$}`, "PwshError");
    let X = w.trim();
    if (!X) return E("PowerShell parser: empty stdout from pwsh"), sM6(q, "No output from PowerShell parser", "EmptyOutput");
    try {
        let M = n8(X);
        return YWY(M)
    } catch {
        return E(`PowerShell parser: invalid JSON output: ${X.slice(0,200)}`), sM6(q, "Invalid JSON from PowerShell parser", "InvalidJson")
    }
}
// @from(Ln 404853, Col 0)
function J_7(q) {
    let K = [];
    for (let _ of q.statements) {
        for (let z of _.commands) K.push(z.name.toLowerCase());
        if (_.nestedCommands)
            for (let z of _.nestedCommands) K.push(z.name.toLowerCase())
    }
    return K
}
// @from(Ln 404863, Col 0)
function AW(q) {
    let K = [];
    for (let _ of q.statements) {
        for (let z of _.commands) K.push(z);
        if (_.nestedCommands)
            for (let z of _.nestedCommands) K.push(z)
    }
    return K
}
// @from(Ln 404873, Col 0)
function wWY(q) {
    let K = [];
    for (let _ of q.statements) {
        for (let z of _.redirections) K.push(z);
        if (_.nestedCommands) {
            for (let z of _.nestedCommands)
                if (z.redirections)
                    for (let Y of z.redirections) K.push(Y)
        }
    }
    return K
}
// @from(Ln 404886, Col 0)
function yEK(q, K) {
    let _ = K.toLowerCase() + ":";
    return q.variables.filter((z) => z.path.toLowerCase().startsWith(_))
}
// @from(Ln 404891, Col 0)
function X_7(q, K) {
    let _ = K.toLowerCase(),
        z = Hn[_]?.toLowerCase();
    for (let Y of J_7(q)) {
        if (Y === _) return !0;
        let A = Hn[Y]?.toLowerCase();
        if (A === _) return !0;
        if (z && Y === z) return !0;
        if (A && z && A === z) return !0
    }
    return !1
}
// @from(Ln 404904, Col 0)
function W_6(q, K) {
    if (K !== void 0) return K === "Parameter";
    return q.length > 0 && qg.has(q[0])
}
// @from(Ln 404909, Col 0)
function M_7(q, K, _) {
    let z = K.toLowerCase(),
        Y = _.toLowerCase();
    return q.args.some((A) => {
        let O = A.indexOf(":", 1),
            $ = (O > 0 ? A.slice(0, O) : A).replaceAll("`", "").toLowerCase();
        return $.startsWith(Y) && z.startsWith($) && $.length <= z.length
    })
}
// @from(Ln 404919, Col 0)
function Cc8(q) {
    return q.statements
}
// @from(Ln 404923, Col 0)
function CI6(q) {
    let K = q.trim().toLowerCase();
    return K === "$null" || K === "${null}"
}
// @from(Ln 404928, Col 0)
function bc8(q) {
    return wWY(q).filter((K) => !K.isMerging && !CI6(K.target))
}
// @from(Ln 404932, Col 0)
function wL(q) {
    let K = {
        hasSubExpressions: !1,
        hasScriptBlocks: !1,
        hasSplatting: !1,
        hasExpandableStrings: !1,
        hasMemberInvocations: !1,
        hasAssignments: !1,
        hasStopParsing: q.hasStopParsing
    };

    function _(z) {
        if (!z.elementTypes) return;
        for (let Y of z.elementTypes) switch (Y) {
            case "ScriptBlock":
                K.hasScriptBlocks = !0;
                break;
            case "SubExpression":
                K.hasSubExpressions = !0;
                break;
            case "ExpandableString":
                K.hasExpandableStrings = !0;
                break;
            case "MemberInvocation":
                K.hasMemberInvocations = !0;
                break
        }
    }
    for (let z of q.statements) {
        if (z.statementType === "AssignmentStatementAst") K.hasAssignments = !0;
        for (let Y of z.commands) _(Y);
        if (z.nestedCommands)
            for (let Y of z.nestedCommands) _(Y);
        if (z.securityPatterns) {
            if (z.securityPatterns.hasMemberInvocations) K.hasMemberInvocations = !0;
            if (z.securityPatterns.hasSubExpressions) K.hasSubExpressions = !0;
            if (z.securityPatterns.hasExpandableStrings) K.hasExpandableStrings = !0;
            if (z.securityPatterns.hasScriptBlocks) K.hasScriptBlocks = !0
        }
    }
    for (let z of q.variables)
        if (z.isSplatted) {
            K.hasSplatting = !0;
            break
        } return K
}
// @from(Ln 404978, Col 4)
QPY = 5000