
// @from(Ln 248260, Col 0)
async function sp6(A, q) {
    let K = rW6();
    await $1().mkdir(K);
    let Y = dp9(A),
        z = r3(K, Y),
        _ = !1,
        w;
    try {
        if (k(`Caching plugin from source: ${B6(A)} to temporary path ${z}`), _ = !0, typeof A === "string") await Up9(A, z);
        else switch (A.source) {
            case "npm":
                await Bp9(A.package, z, {
                    registry: A.registry,
                    version: A.version
                });
                break;
            case "github":
                await Fp9(A.repo, z, A.ref, A.sha);
                break;
            case "url":
                await R24(A.url, z, A.ref, A.sha);
                break;
            case "git-subdir":
                w = await Qp9(A.url, z, A.path, A.ref, A.sha);
                break;
            case "pip":
                throw Error("Python package plugins are not yet supported");
            default:
                throw Error("Unsupported plugin source type")
        }
    } catch (M) {
        if (_ && await uK(z)) {
            k(`Cleaning up failed installation at ${z}`);
            try {
                await D96(z, {
                    recursive: !0,
                    force: !0
                })
            } catch (D) {
                k(`Failed to clean up installation: ${D}`, {
                    level: "error"
                })
            }
        }
        throw M
    }
    let O = r3(z, ".claude-plugin", "plugin.json"),
        $ = r3(z, "plugin.json"),
        H;
    if (await uK(O)) try {
        let M = await AQ6(O, {
                encoding: "utf-8"
            }),
            D = i1(M),
            X = x46().safeParse(D);
        if (X.success) H = X.data;
        else {
            let P = X.error.issues.map((W) => `${W.path.join(".")}: ${W.message}`).join(", ");
            throw k(`Invalid manifest at ${O}: ${P}`, {
                level: "error"
            }), Error(`Plugin has an invalid manifest file at ${O}. Validation errors: ${P}`)
        }
    } catch (M) {
        if (M instanceof Error && M.message.includes("invalid manifest file")) throw M;
        let D = _1(M);
        throw k(`Failed to parse manifest at ${O}: ${D}`, {
            level: "error"
        }), Error(`Plugin has a corrupt manifest file at ${O}. JSON parse error: ${D}`)
    } else if (await uK($)) try {
        let M = await AQ6($, {
                encoding: "utf-8"
            }),
            D = i1(M),
            X = x46().safeParse(D);
        if (X.success) H = X.data;
        else {
            let P = X.error.issues.map((W) => `${W.path.join(".")}: ${W.message}`).join(", ");
            throw k(`Invalid legacy manifest at ${$}: ${P}`, {
                level: "error"
            }), Error(`Plugin has an invalid manifest file at ${$}. Validation errors: ${P}`)
        }
    } catch (M) {
        if (M instanceof Error && M.message.includes("invalid manifest file")) throw M;
        let D = _1(M);
        throw k(`Failed to parse legacy manifest at ${$}: ${D}`, {
            level: "error"
        }), Error(`Plugin has a corrupt manifest file at ${$}. JSON parse error: ${D}`)
    } else H = q?.manifest || {
        name: Y,
        description: `Plugin cached from ${typeof A==="string"?A:A.source}`
    };
    let j = H.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
        J = r3(K, j);
    if (await uK(J)) k(`Removing old cached version at ${J}`), await D96(J, {
        recursive: !0,
        force: !0
    });
    return await E24(z, J), k(`Successfully cached plugin ${H.name} to ${J}`), {
        path: J,
        manifest: H,
        ...w && {
            gitCommitSha: w
        }
    }
}
// @from(Ln 248365, Col 0)
async function $W1(A, q, K) {
    if (!await uK(A)) return {
        name: q,
        description: `Plugin from ${K}`
    };
    try {
        let Y = await AQ6(A, {
                encoding: "utf-8"
            }),
            z = i1(Y),
            _ = x46().safeParse(z);
        if (_.success) return _.data;
        let w = _.error.issues.map((O) => O.path.length > 0 ? `${O.path.join(".")}: ${O.message}` : O.message).join(", ");
        throw k(`Plugin ${q} has an invalid manifest file at ${A}. Validation errors: ${w}`, {
            level: "error"
        }), Error(`Plugin ${q} has an invalid manifest file at ${A}.

Validation errors: ${w}`)
    } catch (Y) {
        if (Y instanceof Error && Y.message.includes("invalid manifest file")) throw Y;
        let z = _1(Y);
        throw k(`Plugin ${q} has a corrupt manifest file at ${A}. Parse error: ${z}`, {
            level: "error"
        }), Error(`Plugin ${q} has a corrupt manifest file at ${A}.

JSON parse error: ${z}`)
    }
}
// @from(Ln 248393, Col 0)
async function N24(A, q) {
    if (!await uK(A)) throw Error(`Hooks file not found at ${A} for plugin ${q}. If the manifest declares hooks, the file must exist.`);
    let K = await AQ6(A, {
            encoding: "utf-8"
        }),
        Y = i1(K);
    return B57().parse(Y).hooks
}
// @from(Ln 248401, Col 0)
async function Oe(A, q, K, Y, z, _, w, O) {
    let $ = await Promise.all(A.map(async (j) => {
            let J = r3(q, j);
            return {
                relPath: j,
                fullPath: J,
                exists: await uK(J)
            }
        })),
        H = [];
    for (let {
            relPath: j,
            fullPath: J,
            exists: M
        }
        of $)
        if (M) H.push(J);
        else k(`${_} path ${j} ${w} not found at ${J} for ${K}`, {
            level: "warn"
        }), _6(Error(`Plugin component file not found: ${J} for ${K}`)), O.push({
            type: "path-not-found",
            source: Y,
            plugin: K,
            path: J,
            component: z
        });
    return H
}
// @from(Ln 248429, Col 0)
async function h24(A, q, K, Y, z = !0) {
    let _ = [],
        w = r3(A, ".claude-plugin", "plugin.json"),
        O = await $W1(w, Y, q),
        $ = {
            name: O.name,
            manifest: O,
            path: A,
            source: q,
            repository: q,
            enabled: K
        },
        [H, j, J, M] = await Promise.all([!O.commands ? uK(r3(A, "commands")) : !1, !O.agents ? uK(r3(A, "agents")) : !1, !O.skills ? uK(r3(A, "skills")) : !1, !O.outputStyles ? uK(r3(A, "output-styles")) : !1]),
        D = r3(A, "commands");
    if (H) $.commandsPath = D;
    if (O.commands) {
        let N = Object.values(O.commands)[0];
        if (typeof O.commands === "object" && !Array.isArray(O.commands) && N && typeof N === "object" && (("source" in N) || ("content" in N))) {
            let V = {},
                L = [],
                h = Object.entries(O.commands),
                R = await Promise.all(h.map(async ([u, I]) => {
                    if (!I || typeof I !== "object") return {
                        commandName: u,
                        metadata: I,
                        kind: "skip"
                    };
                    if (I.source) {
                        let g = r3(A, I.source);
                        return {
                            commandName: u,
                            metadata: I,
                            kind: "source",
                            fullPath: g,
                            exists: await uK(g)
                        }
                    }
                    if (I.content) return {
                        commandName: u,
                        metadata: I,
                        kind: "content"
                    };
                    return {
                        commandName: u,
                        metadata: I,
                        kind: "skip"
                    }
                }));
            for (let u of R) {
                if (u.kind === "skip") continue;
                if (u.kind === "content") {
                    V[u.commandName] = u.metadata;
                    continue
                }
                if (u.exists) L.push(u.fullPath), V[u.commandName] = u.metadata;
                else k(`Command ${u.commandName} path ${u.metadata.source} specified in manifest but not found at ${u.fullPath} for ${O.name}`, {
                    level: "warn"
                }), _6(Error(`Plugin component file not found: ${u.fullPath} for ${O.name}`)), _.push({
                    type: "path-not-found",
                    source: q,
                    plugin: O.name,
                    path: u.fullPath,
                    component: "commands"
                })
            }
            if (L.length > 0) $.commandsPaths = L;
            if (Object.keys(V).length > 0) $.commandsMetadata = V
        } else {
            let V = Array.isArray(O.commands) ? O.commands : [O.commands],
                L = await Promise.all(V.map(async (R) => {
                    if (typeof R !== "string") return {
                        cmdPath: R,
                        kind: "invalid"
                    };
                    let u = r3(A, R);
                    return {
                        cmdPath: R,
                        kind: "path",
                        fullPath: u,
                        exists: await uK(u)
                    }
                })),
                h = [];
            for (let R of L) {
                if (R.kind === "invalid") {
                    k(`Unexpected command format in manifest for ${O.name}`, {
                        level: "error"
                    });
                    continue
                }
                if (R.exists) h.push(R.fullPath);
                else k(`Command path ${R.cmdPath} specified in manifest but not found at ${R.fullPath} for ${O.name}`, {
                    level: "warn"
                }), _6(Error(`Plugin component file not found: ${R.fullPath} for ${O.name}`)), _.push({
                    type: "path-not-found",
                    source: q,
                    plugin: O.name,
                    path: R.fullPath,
                    component: "commands"
                })
            }
            if (h.length > 0) $.commandsPaths = h
        }
    }
    let X = r3(A, "agents");
    if (j) $.agentsPath = X;
    if (O.agents) {
        let N = Array.isArray(O.agents) ? O.agents : [O.agents],
            V = await Oe(N, A, O.name, q, "agents", "Agent", "specified in manifest but", _);
        if (V.length > 0) $.agentsPaths = V
    }
    let P = r3(A, "skills");
    if (J) $.skillsPath = P;
    if (O.skills) {
        let N = Array.isArray(O.skills) ? O.skills : [O.skills],
            V = await Oe(N, A, O.name, q, "skills", "Skill", "specified in manifest but", _);
        if (V.length > 0) $.skillsPaths = V
    }
    let W = r3(A, "output-styles");
    if (M) $.outputStylesPath = W;
    if (O.outputStyles) {
        let N = Array.isArray(O.outputStyles) ? O.outputStyles : [O.outputStyles],
            V = await Oe(N, A, O.name, q, "output-styles", "Output style", "specified in manifest but", _);
        if (V.length > 0) $.outputStylesPaths = V
    }
    let Z, G = new Set,
        f = r3(A, "hooks", "hooks.json");
    if (await uK(f)) try {
        Z = await N24(f, O.name);
        try {
            G.add(await wW1(f))
        } catch {
            G.add(f)
        }
        k(`Loaded hooks from standard location for plugin ${O.name}: ${f}`)
    } catch (N) {
        let V = _1(N);
        k(`Failed to load hooks for ${O.name}: ${V}`, {
            level: "error"
        }), _6(N instanceof Error ? N : Error(V)), _.push({
            type: "hook-load-failed",
            source: q,
            plugin: O.name,
            hookPath: f,
            reason: V
        })
    }
    if (O.hooks) {
        let N = Array.isArray(O.hooks) ? O.hooks : [O.hooks];
        for (let V of N)
            if (typeof V === "string") {
                let L = r3(A, V);
                if (!await uK(L)) {
                    k(`Hooks file ${V} specified in manifest but not found at ${L} for ${O.name}`, {
                        level: "error"
                    }), _6(Error(`Plugin component file not found: ${L} for ${O.name}`)), _.push({
                        type: "path-not-found",
                        source: q,
                        plugin: O.name,
                        path: L,
                        component: "hooks"
                    });
                    continue
                }
                let h;
                try {
                    h = await wW1(L)
                } catch {
                    h = L
                }
                if (G.has(h)) {
                    if (k(`Skipping duplicate hooks file for plugin ${O.name}: ${V} (resolves to already-loaded file: ${h})`), z) {
                        let R = `Duplicate hooks file detected: ${V} resolves to already-loaded file ${h}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
                        _6(Error(R)), _.push({
                            type: "hook-load-failed",
                            source: q,
                            plugin: O.name,
                            hookPath: L,
                            reason: R
                        })
                    }
                    continue
                }
                try {
                    let R = await N24(L, O.name);
                    try {
                        Z = k24(Z, R), G.add(h), k(`Loaded and merged hooks from manifest for plugin ${O.name}: ${V}`)
                    } catch (u) {
                        let I = _1(u);
                        k(`Failed to merge hooks from ${V} for ${O.name}: ${I}`, {
                            level: "error"
                        }), _6(u instanceof Error ? u : Error(I)), _.push({
                            type: "hook-load-failed",
                            source: q,
                            plugin: O.name,
                            hookPath: L,
                            reason: `Failed to merge: ${I}`
                        })
                    }
                } catch (R) {
                    let u = _1(R);
                    k(`Failed to load hooks from ${V} for ${O.name}: ${u}`, {
                        level: "error"
                    }), _6(R instanceof Error ? R : Error(u)), _.push({
                        type: "hook-load-failed",
                        source: q,
                        plugin: O.name,
                        hookPath: L,
                        reason: u
                    })
                }
            } else if (typeof V === "object") Z = k24(Z, V)
    }
    if (Z) $.hooksConfig = Z;
    let v = await lp9(A, O);
    if (v) $.settings = v;
    return {
        plugin: $,
        errors: _
    }
}
// @from(Ln 248651, Col 0)
function V24(A) {
    let q = cp9().safeParse(A);
    if (!q.success) return;
    let K = q.data;
    if (Object.keys(K).length === 0) return;
    return K
}
// @from(Ln 248658, Col 0)
async function lp9(A, q) {
    let K = r3(A, "settings.json");
    try {
        let Y = await AQ6(K, {
                encoding: "utf-8"
            }),
            z = i1(Y);
        if (tp9(z)) {
            let _ = V24(z);
            if (_) return k(`Loaded settings from settings.json for plugin ${q.name}`), _
        }
    } catch (Y) {
        let z = Y.code;
        if (z !== "ENOENT" && z !== "EACCES" && z !== "EPERM") k(`Failed to parse settings.json for plugin ${q.name}: ${Y}`, {
            level: "warn"
        })
    }
    if (q.settings) {
        let Y = V24(q.settings);
        if (Y) return k(`Loaded settings from manifest for plugin ${q.name}`), Y
    }
    return
}
// @from(Ln 248682, Col 0)
function k24(A, q) {
    if (!A) return q;
    let K = {
        ...A
    };
    for (let [Y, z] of Object.entries(q))
        if (!K[Y]) K[Y] = z;
        else K[Y] = [...K[Y] || [], ...z];
    return K
}
// @from(Ln 248692, Col 0)
async function ip9() {
    let A = PA(),
        q = {
            ...pp6(),
            ...A.enabledPlugins || {}
        },
        K = [],
        Y = [],
        z = Object.entries(q).filter(([D, X]) => {
            if (!XJ6().safeParse(D).success || X === void 0) return !1;
            let {
                marketplace: W
            } = n3(D);
            return W !== tp6
        }),
        _ = await eW6(),
        w = Ke(),
        O = Gk8(),
        $ = w !== null || O !== null && O.length > 0,
        H = new Set(z.map(([D]) => n3(D).marketplace).filter((D) => !!D)),
        j = new Map;
    await Promise.all([...H].map(async (D) => {
        j.set(D, await Uk8(D))
    }));
    let J = Up6(),
        M = await Promise.allSettled(z.map(async ([D, X]) => {
            let {
                name: P,
                marketplace: W
            } = n3(D), Z = _[W];
            if (!Z && $) return Y.push({
                type: "marketplace-blocked-by-policy",
                source: D,
                plugin: P,
                marketplace: W,
                blockedByBlocklist: w === null,
                allowedSources: (w ?? []).map((N) => z96(N))
            }), null;
            if (Z && !Y96(Z.source)) {
                let N = Fp6(Z.source),
                    V = Ke() || [];
                return Y.push({
                    type: "marketplace-blocked-by-policy",
                    source: D,
                    plugin: P,
                    marketplace: W,
                    blockedByBlocklist: N,
                    allowedSources: N ? [] : V.map((L) => z96(L))
                }), null
            }
            let G = null,
                f = j.get(W);
            if (f && Z) {
                let N = f.plugins.find((V) => V.name === P);
                if (N) G = {
                    entry: N,
                    marketplaceInstallLocation: Z.installLocation
                }
            } else G = await dk8(D);
            if (!G) return Y.push({
                type: "plugin-not-found",
                source: D,
                pluginId: P,
                marketplace: W
            }), null;
            let v = J.plugins[D]?.[0]?.version;
            return np9(G.entry, G.marketplaceInstallLocation, D, X === !0, Y, v)
        }));
    for (let [D, X] of M.entries())
        if (X.status === "fulfilled" && X.value) K.push(X.value);
        else if (X.status === "rejected") {
        let P = X.reason instanceof Error ? X.reason : Error(String(X.reason));
        _6(P);
        let W = z[D][0];
        Y.push({
            type: "generic-error",
            source: W,
            plugin: W.split("@")[0],
            error: P.message
        })
    }
    return {
        plugins: K,
        errors: Y
    }
}
// @from(Ln 248778, Col 0)
async function np9(A, q, K, Y, z, _) {
    k(`Loading plugin ${A.name} from source: ${B6(A.source)}`);
    let w = [],
        O;
    if (typeof A.source === "string") {
        let M = (await bp9(q)).isDirectory() ? q : r3(q, ".."),
            D = r3(M, A.source);
        if (!await uK(D)) {
            let X = Error(`Plugin path not found: ${D}`);
            return k(`Plugin path not found: ${D}`, {
                level: "error"
            }), _6(X), z.push({
                type: "generic-error",
                source: K,
                error: `Plugin directory not found at path: ${D}. Check that the marketplace entry has the correct path.`
            }), null
        }
        try {
            let X = r3(D, ".claude-plugin", "plugin.json"),
                P;
            try {
                P = await $W1(X, A.name, A.source)
            } catch {}
            let W = await Jc(K, A.source, P, M, A.version);
            O = await OW1(D, K, W, A, M), k(`Resolved local plugin ${A.name} to versioned cache: ${O}`)
        } catch (X) {
            let P = _1(X);
            k(`Failed to copy plugin ${A.name} to versioned cache: ${P}. Using marketplace path.`, {
                level: "warn"
            }), O = D
        }
    } else try {
        let M = await Jc(K, A.source, void 0, void 0, _ ?? A.version),
            D = FI(K, M),
            X = KZ6(K, M);
        if (pI() && await uK(X)) k(`Using versioned cached plugin ZIP ${A.name} from ${X}`), O = X;
        else if (await uK(D)) k(`Using versioned cached plugin ${A.name} from ${D}`), O = D;
        else {
            let P = await y24(K, M) ?? (M === "unknown" ? await mp9(K) : null);
            if (P) O = P, k(`Using seed cache for external plugin ${A.name} at ${P}`);
            else {
                let W = await sp6(A.source, {
                        manifest: {
                            name: A.name
                        }
                    }),
                    Z = await Jc(K, A.source, W.manifest, W.path, _ ?? A.version);
                if (O = await OW1(W.path, K, Z, A, void 0), W.path !== O) await D96(W.path, {
                    recursive: !0,
                    force: !0
                })
            }
        }
    } catch (M) {
        let D = _1(M);
        return k(`Failed to cache plugin ${A.name}: ${D}`, {
            level: "error"
        }), _6(M instanceof Error ? M : Error(D)), z.push({
            type: "generic-error",
            source: K,
            error: `Failed to download/cache plugin ${A.name}: ${D}`
        }), null
    }
    if (pI() && O.endsWith(".zip")) {
        let M = await n_4(),
            D = r3(M, K.replace(/[^a-zA-Z0-9@\-_]/g, "-"));
        try {
            await a_4(O, D), k(`Extracted plugin ZIP to session dir: ${D}`), O = D
        } catch (X) {
            throw k(`Failed to extract plugin ZIP ${O}, deleting corrupt file: ${X}`), await D96(O, {
                force: !0
            }).catch(() => {}), X
        }
    }
    let $ = r3(O, ".claude-plugin", "plugin.json"),
        H = await uK($),
        {
            plugin: j,
            errors: J
        } = await h24(O, K, Y, A.name, A.strict ?? !0);
    if (w.push(...J), typeof A.source === "object" && "sha" in A.source && A.source.sha) j.sha = A.source.sha;
    if (!H) {
        if (j.manifest = {
                ...A,
                id: void 0,
                source: void 0,
                strict: void 0
            }, j.name = j.manifest.name, A.commands) {
            let M = Object.values(A.commands)[0];
            if (typeof A.commands === "object" && !Array.isArray(A.commands) && M && typeof M === "object" && (("source" in M) || ("content" in M))) {
                let D = {},
                    X = [],
                    P = Object.entries(A.commands),
                    W = await Promise.all(P.map(async ([Z, G]) => {
                        if (!G || typeof G !== "object" || !G.source) return {
                            commandName: Z,
                            metadata: G,
                            skip: !0
                        };
                        let f = r3(O, G.source);
                        return {
                            commandName: Z,
                            metadata: G,
                            skip: !1,
                            fullPath: f,
                            exists: await uK(f)
                        }
                    }));
                for (let Z of W) {
                    if (Z.skip) continue;
                    if (Z.exists) X.push(Z.fullPath), D[Z.commandName] = Z.metadata;
                    else k(`Command ${Z.commandName} path ${Z.metadata.source} from marketplace entry not found at ${Z.fullPath} for ${A.name}`, {
                        level: "warn"
                    }), _6(Error(`Plugin component file not found: ${Z.fullPath} for ${A.name}`)), w.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: Z.fullPath,
                        component: "commands"
                    })
                }
                if (X.length > 0) j.commandsPaths = X, j.commandsMetadata = D
            } else {
                let D = Array.isArray(A.commands) ? A.commands : [A.commands],
                    X = await Promise.all(D.map(async (W) => {
                        if (typeof W !== "string") return {
                            cmdPath: W,
                            kind: "invalid"
                        };
                        let Z = r3(O, W);
                        return {
                            cmdPath: W,
                            kind: "path",
                            fullPath: Z,
                            exists: await uK(Z)
                        }
                    })),
                    P = [];
                for (let W of X) {
                    if (W.kind === "invalid") {
                        k(`Unexpected command format in marketplace entry for ${A.name}`, {
                            level: "error"
                        });
                        continue
                    }
                    if (W.exists) P.push(W.fullPath);
                    else k(`Command path ${W.cmdPath} from marketplace entry not found at ${W.fullPath} for ${A.name}`, {
                        level: "warn"
                    }), _6(Error(`Plugin component file not found: ${W.fullPath} for ${A.name}`)), w.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: W.fullPath,
                        component: "commands"
                    })
                }
                if (P.length > 0) j.commandsPaths = P
            }
        }
        if (A.agents) {
            let M = Array.isArray(A.agents) ? A.agents : [A.agents],
                D = await Oe(M, O, A.name, K, "agents", "Agent", "from marketplace entry", w);
            if (D.length > 0) j.agentsPaths = D
        }
        if (A.skills) {
            k(`Processing ${Array.isArray(A.skills)?A.skills.length:1} skill paths for plugin ${A.name}`);
            let M = Array.isArray(A.skills) ? A.skills : [A.skills],
                D = await Promise.all(M.map(async (P) => {
                    let W = r3(O, P);
                    return {
                        skillPath: P,
                        fullPath: W,
                        exists: await uK(W)
                    }
                })),
                X = [];
            for (let {
                    skillPath: P,
                    fullPath: W,
                    exists: Z
                }
                of D)
                if (k(`Checking skill path: ${P} -> ${W} (exists: ${Z})`), Z) X.push(W);
                else k(`Skill path ${P} from marketplace entry not found at ${W} for ${A.name}`, {
                    level: "warn"
                }), _6(Error(`Plugin component file not found: ${W} for ${A.name}`)), w.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: W,
                    component: "skills"
                });
            if (k(`Found ${X.length} valid skill paths for plugin ${A.name}, setting skillsPaths`), X.length > 0) j.skillsPaths = X
        } else k(`Plugin ${A.name} has no entry.skills defined`);
        if (A.outputStyles) {
            let M = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
                D = await Oe(M, O, A.name, K, "output-styles", "Output style", "from marketplace entry", w);
            if (D.length > 0) j.outputStylesPaths = D
        }
        if (A.hooks) j.hooksConfig = A.hooks
    } else if (!A.strict && H && (A.commands || A.agents || A.skills || A.hooks || A.outputStyles)) {
        let M = Error(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
        return k(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`, {
            level: "error"
        }), _6(M), z.push({
            type: "generic-error",
            source: K,
            error: `Plugin ${A.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
        }), null
    } else if (H) {
        if (A.commands) {
            let M = Object.values(A.commands)[0];
            if (typeof A.commands === "object" && !Array.isArray(A.commands) && M && typeof M === "object" && (("source" in M) || ("content" in M))) {
                let D = {
                        ...j.commandsMetadata || {}
                    },
                    X = [],
                    P = Object.entries(A.commands),
                    W = await Promise.all(P.map(async ([Z, G]) => {
                        if (!G || typeof G !== "object" || !G.source) return {
                            commandName: Z,
                            metadata: G,
                            skip: !0
                        };
                        let f = r3(O, G.source);
                        return {
                            commandName: Z,
                            metadata: G,
                            skip: !1,
                            fullPath: f,
                            exists: await uK(f)
                        }
                    }));
                for (let Z of W) {
                    if (Z.skip) continue;
                    if (Z.exists) X.push(Z.fullPath), D[Z.commandName] = Z.metadata;
                    else k(`Command ${Z.commandName} path ${Z.metadata.source} from marketplace entry not found at ${Z.fullPath} for ${A.name}`, {
                        level: "warn"
                    }), _6(Error(`Plugin component file not found: ${Z.fullPath} for ${A.name}`)), w.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: Z.fullPath,
                        component: "commands"
                    })
                }
                if (X.length > 0) j.commandsPaths = [...j.commandsPaths || [], ...X], j.commandsMetadata = D
            } else {
                let D = Array.isArray(A.commands) ? A.commands : [A.commands],
                    X = await Promise.all(D.map(async (W) => {
                        if (typeof W !== "string") return {
                            cmdPath: W,
                            kind: "invalid"
                        };
                        let Z = r3(O, W);
                        return {
                            cmdPath: W,
                            kind: "path",
                            fullPath: Z,
                            exists: await uK(Z)
                        }
                    })),
                    P = [];
                for (let W of X) {
                    if (W.kind === "invalid") {
                        k(`Unexpected command format in marketplace entry for ${A.name}`, {
                            level: "error"
                        });
                        continue
                    }
                    if (W.exists) P.push(W.fullPath);
                    else k(`Command path ${W.cmdPath} from marketplace entry not found at ${W.fullPath} for ${A.name}`, {
                        level: "warn"
                    }), _6(Error(`Plugin component file not found: ${W.fullPath} for ${A.name}`)), w.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: W.fullPath,
                        component: "commands"
                    })
                }
                if (P.length > 0) j.commandsPaths = [...j.commandsPaths || [], ...P]
            }
        }
        if (A.agents) {
            let M = Array.isArray(A.agents) ? A.agents : [A.agents],
                D = await Oe(M, O, A.name, K, "agents", "Agent", "from marketplace entry", w);
            if (D.length > 0) j.agentsPaths = [...j.agentsPaths || [], ...D]
        }
        if (A.skills) {
            let M = Array.isArray(A.skills) ? A.skills : [A.skills],
                D = await Oe(M, O, A.name, K, "skills", "Skill", "from marketplace entry", w);
            if (D.length > 0) j.skillsPaths = [...j.skillsPaths || [], ...D]
        }
        if (A.outputStyles) {
            let M = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
                D = await Oe(M, O, A.name, K, "output-styles", "Output style", "from marketplace entry", w);
            if (D.length > 0) j.outputStylesPaths = [...j.outputStylesPaths || [], ...D]
        }
        if (A.hooks) j.hooksConfig = {
            ...j.hooksConfig || {},
            ...A.hooks
        }
    }
    return z.push(...w), j
}
// @from(Ln 249084, Col 0)
async function rp9(A) {
    if (A.length === 0) return {
        plugins: [],
        errors: []
    };
    let q = [],
        K = [];
    for (let [Y, z] of A.entries()) try {
        let _ = xp9(z);
        if (!await uK(_)) {
            k(`Plugin path does not exist: ${_}, skipping`, {
                level: "warn"
            }), K.push({
                type: "path-not-found",
                source: `inline[${Y}]`,
                path: _,
                component: "commands"
            });
            continue
        }
        let w = up9(_),
            {
                plugin: O,
                errors: $
            } = await h24(_, `${w}@inline`, !0, w);
        O.source = `${O.name}@inline`, O.repository = `${O.name}@inline`, q.push(O), K.push(...$), k(`Loaded inline plugin from path: ${O.name}`)
    } catch (_) {
        let w = _1(_);
        k(`Failed to load session plugin from ${z}: ${w}`, {
            level: "warn"
        }), K.push({
            type: "generic-error",
            source: `inline[${Y}]`,
            error: `Failed to load plugin: ${w}`
        })
    }
    if (q.length > 0) k(`Loaded ${q.length} session-only plugins from --plugin-dir`);
    return {
        plugins: q,
        errors: K
    }
}
// @from(Ln 249127, Col 0)
function op9(A) {
    let q = [],
        K = A.managedNames,
        Y = A.session.filter((w) => {
            if (K?.has(w.name)) return k(`Plugin "${w.name}" from --plugin-dir is blocked by managed settings`, {
                level: "warn"
            }), q.push({
                type: "generic-error",
                source: w.source,
                plugin: w.name,
                error: `--plugin-dir copy of "${w.name}" ignored: plugin is locked by managed settings`
            }), !1;
            return !0
        }),
        z = new Set(Y.map((w) => w.name)),
        _ = A.marketplace.filter((w) => {
            if (z.has(w.name)) return k(`Plugin "${w.name}" from --plugin-dir overrides installed version`), !1;
            return !0
        });
    return {
        plugins: [...Y, ..._, ...A.builtin],
        errors: q
    }
}
// @from(Ln 249152, Col 0)
function XZ(A) {
    if (A) k(`clearPluginCache: invalidating loadAllPlugins cache (${A})`);
    if (_z.cache?.clear?.(), Dt6() !== void 0) zP();
    h8A()
}
// @from(Ln 249158, Col 0)
function ap9(A) {
    let q;
    for (let K of A) {
        if (!K.settings) continue;
        if (!q) q = {};
        for (let [Y, z] of Object.entries(K.settings)) {
            if (Y in q) k(`Plugin "${K.name}" overrides setting "${Y}" (previously set by another plugin)`);
            q[Y] = z
        }
    }
    return q
}
// @from(Ln 249171, Col 0)
function sp9(A) {
    let q = ap9(A);
    if (R8A(q), q && Object.keys(q).length > 0) zP(), k(`Cached plugin settings with keys: ${Object.keys(q).join(", ")}`)
}
// @from(Ln 249176, Col 0)
function tp9(A) {
    return typeof A === "object" && A !== null && !Array.isArray(A)
}
// @from(Ln 249179, Col 4)
cp9
// @from(Ln 249179, Col 9)
_z
// @from(Ln 249180, Col 4)
tH = E(() => {
    SA();
    U4();
    T1();
    IW();
    H1();
    k1();
    i8();
    jC();
    Aw();
    dB();
    Eq();
    A8();
    B01();
    ze();
    YW1();
    M96();
    BI();
    fX();
    zW1();
    g1();
    $5();
    Z7();
    sW6();
    m01();
    s8();
    ep6();
    cp9 = F6(() => oD().pick({
        agent: !0
    }).strip());
    _z = e1(async () => {
        let A = AA6(),
            [q, K] = await Promise.all([ip9(), A.length > 0 ? rp9(A) : Promise.resolve({
                plugins: [],
                errors: []
            })]),
            Y = AE8(),
            {
                plugins: z,
                errors: _
            } = op9({
                session: K.plugins,
                marketplace: q.plugins,
                builtin: [...Y.enabled, ...Y.disabled],
                managedNames: k_4()
            }),
            w = [...q.errors, ...K.errors, ..._];
        if (J96()) {
            let {
                demoted: $,
                errors: H
            } = M24(z);
            for (let j of z)
                if ($.has(j.source)) j.enabled = !1;
            w.push(...H)
        }
        k(`Found ${z.length} plugins (${z.filter(($)=>$.enabled).length} enabled, ${z.filter(($)=>!$.enabled).length} disabled)`);
        let O = z.filter(($) => $.enabled);
        return sp9(O), {
            enabled: O,
            disabled: z.filter(($) => !$.enabled),
            errors: w
        }
    })
})
// @from(Ln 249249, Col 0)
async function C24(A, q, K, Y, z, _) {
    let w = [],
        O = $1();
    async function $(H, j = []) {
        try {
            let J = await O.readdir(H);
            await Promise.all(J.map(async (M) => {
                let D = ep9(H, M.name);
                if (M.isDirectory()) await $(D, [...j, M.name]);
                else if (M.isFile() && M.name.endsWith(".md")) {
                    let X = await I24(D, q, j, K, Y, z, _);
                    if (X) w.push(X)
                }
            }))
        } catch (J) {
            k(`Failed to scan agents directory ${H}: ${J}`, {
                level: "error"
            })
        }
    }
    return await $(A), w
}
// @from(Ln 249271, Col 0)
async function I24(A, q, K, Y, z, _, w) {
    let O = $1();
    if (hx(O, A, w)) return null;
    try {
        let $ = await O.readFile(A, {
                encoding: "utf-8"
            }),
            {
                frontmatter: H,
                content: j
            } = BH($, A),
            J = H.name || AQ9(A).replace(/\.md$/, ""),
            D = [q, ...K, J].join(":"),
            X = NL(H.description, D) ?? NL(H["when-to-use"], D) ?? `Agent from ${q} plugin`,
            P = X96(H.tools),
            W = LI(H.skills),
            Z = H.color,
            G = H.model,
            f;
        if (typeof G === "string" && G.trim().length > 0) {
            let I = G.trim();
            f = I.toLowerCase() === "inherit" ? "inherit" : I
        }
        let v = H.background,
            N = v === "true" || v === !0 ? !0 : void 0,
            V = ZL(j.trim(), z),
            L = H.memory,
            h;
        if (L !== void 0)
            if (S24.includes(L)) h = L;
            else k(`Plugin agent file ${A} has invalid memory value '${L}'. Valid options: ${S24.join(", ")}`);
        let u = H.isolation === "worktree" ? "worktree" : void 0;
        if (Z3() && h && P !== void 0) {
            let I = new Set(P);
            for (let g of [_K, R4, s7])
                if (!I.has(g)) P = [...P, g]
        }
        return {
            agentType: D,
            whenToUse: X,
            tools: P,
            ...W !== void 0 ? {
                skills: W
            } : {},
            getSystemPrompt: () => {
                if (Z3() && h) {
                    let I = m36(D, h);
                    return V + `

` + I
                }
                return V
            },
            source: "plugin",
            color: Z,
            model: f,
            filename: J,
            plugin: Y,
            ...N ? {
                background: N
            } : {},
            ...h ? {
                memory: h
            } : {},
            ...u ? {
                isolation: u
            } : {}
        }
    } catch ($) {
        return k(`Failed to load agent from ${A}: ${$}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 249346, Col 0)
function a01() {
    KQ6.cache?.clear?.()
}
// @from(Ln 249349, Col 4)
S24
// @from(Ln 249349, Col 9)
KQ6
// @from(Ln 249350, Col 4)
s01 = E(() => {
    U4();
    SA();
    tH();
    H1();
    eu();
    BG();
    BG();
    td();
    mH();
    yI();
    Q$();
    J_();
    S24 = ["user", "project", "local"];
    KQ6 = e1(async () => {
        let {
            enabled: A,
            errors: q
        } = await _z();
        if (q.length > 0) k(`Plugin loading errors: ${q.map((z)=>sM(z)).join(", ")}`);
        let Y = (await Promise.all(A.map(async (z) => {
            let _ = new Set,
                w = [];
            if (z.agentsPath) try {
                let O = await C24(z.agentsPath, z.name, z.source, z.path, z.manifest, _);
                if (w.push(...O), O.length > 0) k(`Loaded ${O.length} agents from plugin ${z.name} default directory`)
            } catch (O) {
                k(`Failed to load agents from plugin ${z.name} default directory: ${O}`, {
                    level: "error"
                })
            }
            if (z.agentsPaths) {
                let O = await Promise.all(z.agentsPaths.map(async ($) => {
                    try {
                        let j = await $1().stat($);
                        if (j.isDirectory()) {
                            let J = await C24($, z.name, z.source, z.path, z.manifest, _);
                            if (J.length > 0) k(`Loaded ${J.length} agents from plugin ${z.name} custom path: ${$}`);
                            return J
                        } else if (j.isFile() && $.endsWith(".md")) {
                            let J = await I24($, z.name, [], z.source, z.path, z.manifest, _);
                            if (J) return k(`Loaded agent from plugin ${z.name} custom file: ${$}`), [J]
                        }
                        return []
                    } catch (H) {
                        return k(`Failed to load agents from plugin ${z.name} custom path ${$}: ${H}`, {
                            level: "error"
                        }), []
                    }
                }));
                for (let $ of O) w.push(...$)
            }
            return w
        }))).flat();
        return k(`Total plugin agents loaded: ${Y.length}`), Y
    })
})
// @from(Ln 249407, Col 4)
b24 = E(() => {
    lA();
    yI();
    H1();
    g1()
})
// @from(Ln 249413, Col 4)
g24 = {}
// @from(Ln 249431, Col 0)
function Qj(A) {
    return A.source === "built-in"
}
// @from(Ln 249435, Col 0)
function YQ6(A) {
    return A.source !== "built-in" && A.source !== "plugin"
}
// @from(Ln 249439, Col 0)
function zQ6(A) {
    return A.source === "plugin"
}
// @from(Ln 249443, Col 0)
function dv(A) {
    let q = A.filter((H) => H.source === "built-in"),
        K = A.filter((H) => H.source === "plugin"),
        Y = A.filter((H) => H.source === "userSettings"),
        z = A.filter((H) => H.source === "projectSettings"),
        _ = A.filter((H) => H.source === "policySettings"),
        w = A.filter((H) => H.source === "flagSettings"),
        O = [q, K, Y, z, w, _],
        $ = new Map;
    for (let H of O)
        for (let j of H) $.set(j.agentType, j);
    return Array.from($.values())
}
// @from(Ln 249457, Col 0)
function HW1(A, q) {
    if (!A.requiredMcpServers || A.requiredMcpServers.length === 0) return !0;
    return A.requiredMcpServers.every((K) => q.some((Y) => Y.toLowerCase().includes(K.toLowerCase())))
}
// @from(Ln 249462, Col 0)
function zE8(A, q) {
    return A.filter((K) => HW1(K, q))
}
// @from(Ln 249466, Col 0)
function Fk8() {
    UI.cache.clear?.(), a01()
}
// @from(Ln 249470, Col 0)
function YQ9(A) {
    let {
        name: q,
        description: K
    } = A;
    if (!q || typeof q !== "string") return 'Missing required "name" field in frontmatter';
    if (!K || typeof K !== "string") return 'Missing required "description" field in frontmatter';
    return "Unknown parsing error"
}
// @from(Ln 249480, Col 0)
function zQ9(A, q) {
    if (!A.hooks) return;
    let K = ty().safeParse(A.hooks);
    if (!K.success) {
        k(`Invalid hooks in agent '${q}': ${K.error.message}`);
        return
    }
    return K.data
}
// @from(Ln 249490, Col 0)
function m24(A, q, K = "flagSettings") {
    try {
        let Y = u24().parse(q),
            z = X96(Y.tools);
        if (Z3() && Y.memory && z !== void 0) {
            let $ = new Set(z);
            for (let H of [_K, R4, s7])
                if (!$.has(H)) z = [...z, H]
        }
        let _ = Y.disallowedTools !== void 0 ? X96(Y.disallowedTools) : void 0,
            w = Y.prompt;
        return {
            agentType: A,
            whenToUse: Y.description,
            ...z !== void 0 ? {
                tools: z
            } : {},
            ..._ !== void 0 ? {
                disallowedTools: _
            } : {},
            getSystemPrompt: () => {
                if (Z3() && Y.memory) return w + `

` + m36(A, Y.memory);
                return w
            },
            source: K,
            ...Y.model ? {
                model: Y.model
            } : {},
            ...Y.effort !== void 0 ? {
                effort: Y.effort
            } : {},
            ...Y.permissionMode ? {
                permissionMode: Y.permissionMode
            } : {},
            ...Y.mcpServers && Y.mcpServers.length > 0 ? {
                mcpServers: Y.mcpServers
            } : {},
            ...Y.hooks ? {
                hooks: Y.hooks
            } : {},
            ...Y.maxTurns !== void 0 ? {
                maxTurns: Y.maxTurns
            } : {},
            ...Y.skills && Y.skills.length > 0 ? {
                skills: Y.skills
            } : {},
            ...Y.background ? {
                background: Y.background
            } : {},
            ...Y.memory ? {
                memory: Y.memory
            } : {},
            ...Y.isolation ? {
                isolation: Y.isolation
            } : {}
        }
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        return k(`Error parsing agent '${A}' from JSON: ${z}`), _6(Y), null
    }
}
// @from(Ln 249554, Col 0)
function _Q6(A, q = "flagSettings") {
    try {
        let K = KQ9().parse(A);
        return Object.entries(K).map(([Y, z]) => m24(Y, z, q)).filter((Y) => Y !== null)
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        return k(`Error parsing agents from JSON: ${Y}`), _6(K), []
    }
}
// @from(Ln 249564, Col 0)
function B24(A, q, K, Y, z) {
    try {
        let {
            name: _,
            description: w
        } = K;
        if (!_ || typeof _ !== "string") return null;
        if (!w || typeof w !== "string") return k(`Agent file ${A} is missing required 'description' in frontmatter`), null;
        w = w.replace(/\\n/g, `
`);
        let {
            color: O,
            model: $
        } = K, H;
        if (typeof $ === "string" && $.trim().length > 0) {
            let r = $.trim();
            H = r.toLowerCase() === "inherit" ? "inherit" : r
        }
        let j = K.background;
        if (j !== void 0 && j !== "true" && j !== "false" && j !== !0 && j !== !1) k(`Agent file ${A} has invalid background value '${j}'. Must be 'true', 'false', or omitted.`);
        let J = j === "true" || j === !0 ? !0 : void 0,
            M = ["user", "project", "local"],
            D = K.memory,
            X;
        if (D !== void 0)
            if (M.includes(D)) X = D;
            else k(`Agent file ${A} has invalid memory value '${D}'. Valid options: ${M.join(", ")}`);
        let P = ["worktree"],
            W = K.isolation,
            Z;
        if (W !== void 0)
            if (P.includes(W)) Z = W;
            else k(`Agent file ${A} has invalid isolation value '${W}'. Valid options: ${P.join(", ")}`);
        let G = K.effort,
            f = G !== void 0 ? TD6(G) : void 0;
        if (G !== void 0 && f === void 0) k(`Agent file ${A} has invalid effort '${G}'. Valid options: ${iq6.join(", ")} or an integer`);
        let v = K.permissionMode,
            N = v && CW.includes(v);
        if (v && !N) {
            let r = `Agent file ${A} has invalid permissionMode '${v}'. Valid options: ${CW.join(", ")}`;
            k(r)
        }
        let V = K.maxTurns,
            L = HX7(V);
        if (V !== void 0 && L === void 0) k(`Agent file ${A} has invalid maxTurns '${V}'. Must be a positive integer.`);
        let h = qQ9(A, ".md"),
            R = X96(K.tools);
        if (Z3() && X && R !== void 0) {
            let r = new Set(R);
            for (let e of [_K, R4, s7])
                if (!r.has(e)) R = [...R, e]
        }
        let u = K.disallowedTools,
            I = u !== void 0 ? X96(u) : void 0,
            g = LI(K.skills),
            B = K.mcpServers,
            b;
        if (Array.isArray(B)) b = B.map((r) => {
            let e = x24().safeParse(r);
            if (e.success) return e.data;
            return k(`Agent file ${A} has invalid mcpServers item: ${B6(r)}. Error: ${e.error.message}`), null
        }).filter((r) => r !== null);
        let p = zQ9(K, _),
            Q = Y.trim();
        return {
            baseDir: q,
            agentType: _,
            whenToUse: w,
            ...R !== void 0 ? {
                tools: R
            } : {},
            ...I !== void 0 ? {
                disallowedTools: I
            } : {},
            ...g !== void 0 ? {
                skills: g
            } : {},
            ...b !== void 0 && b.length > 0 ? {
                mcpServers: b
            } : {},
            ...p !== void 0 ? {
                hooks: p
            } : {},
            getSystemPrompt: () => {
                if (Z3() && X) {
                    let r = m36(_, X);
                    return Q + `

` + r
                }
                return Q
            },
            source: z,
            filename: h,
            ...O && typeof O === "string" && s$.includes(O) ? {
                color: O
            } : {},
            ...H !== void 0 ? {
                model: H
            } : {},
            ...f !== void 0 ? {
                effort: f
            } : {},
            ...N ? {
                permissionMode: v
            } : {},
            ...L !== void 0 ? {
                maxTurns: L
            } : {},
            ...J ? {
                background: J
            } : {},
            ...X ? {
                memory: X
            } : {},
            ...Z ? {
                isolation: Z
            } : {}
        }
    } catch (_) {
        let w = _ instanceof Error ? _.message : String(_);
        return k(`Error parsing agent from ${A}: ${w}`), _6(_), null
    }
}
// @from(Ln 249688, Col 4)
x24
// @from(Ln 249688, Col 9)
u24
// @from(Ln 249688, Col 14)
KQ9
// @from(Ln 249688, Col 19)
UI
// @from(Ln 249689, Col 4)
J0 = E(() => {
    U4();
    K7();
    V1();
    H1();
    A8();
    BG();
    k1();
    td();
    H0();
    T_4();
    jC();
    s01();
    rD();
    wk();
    b46();
    g1();
    mH();
    yI();
    b24();
    Q$();
    J_();
    x24 = F6(() => C.union([C.string(), C.record(C.string(), pu())])), u24 = F6(() => C.object({
        description: C.string().min(1, "Description cannot be empty"),
        tools: C.array(C.string()).optional(),
        disallowedTools: C.array(C.string()).optional(),
        prompt: C.string().min(1, "Prompt cannot be empty"),
        model: C.string().trim().min(1, "Model cannot be empty").transform((A) => A.toLowerCase() === "inherit" ? "inherit" : A).optional(),
        effort: C.union([C.enum(iq6), C.number().int()]).optional(),
        permissionMode: C.enum(CW).optional(),
        mcpServers: C.array(x24()).optional(),
        hooks: ty().optional(),
        maxTurns: C.number().int().positive().optional(),
        skills: C.array(C.string()).optional(),
        memory: C.enum(["user", "project", "local"]).optional(),
        background: C.boolean().optional(),
        isolation: C.enum(["worktree"]).optional()
    })), KQ9 = F6(() => C.record(C.string(), u24()));
    UI = e1(async (A) => {
        if (t6(process.env.CLAUDE_CODE_SIMPLE)) {
            let q = u01();
            return {
                activeAgents: q,
                allAgents: q
            }
        }
        try {
            let q = await sd("agents", A),
                K = [],
                Y = q.map(({
                    filePath: H,
                    baseDir: j,
                    frontmatter: J,
                    content: M,
                    source: D
                }) => {
                    let X = B24(H, j, J, M, D);
                    if (!X) {
                        if (!J.name) return null;
                        let P = YQ9(J);
                        return K.push({
                            path: H,
                            error: P
                        }), k(`Failed to parse agent from ${H}: ${P}`), d("tengu_agent_parse_error", {
                            error: P,
                            location: D
                        }), null
                    }
                    return X
                }).filter((H) => H !== null),
                _ = await KQ6(),
                O = [...u01(), ..._, ...Y],
                $ = dv(O);
            for (let H of $)
                if (H.color) t36(H.agentType, H.color);
            return {
                activeAgents: $,
                allAgents: O,
                failedFiles: K.length > 0 ? K : void 0
            }
        } catch (q) {
            let K = q instanceof Error ? q.message : String(q);
            k(`Error loading agent definitions: ${K}`), _6(q);
            let Y = u01();
            return {
                activeAgents: Y,
                allAgents: Y,
                failedFiles: [{
                    path: "unknown",
                    error: K
                }]
            }
        }
    })
})
// @from(Ln 249788, Col 0)
function _E8(A, q) {
    if (A.type !== q.type) return !1;
    switch (A.type) {
        case "command":
            return q.type === "command" && A.command === q.command;
        case "prompt":
            return q.type === "prompt" && A.prompt === q.prompt;
        case "agent":
            return q.type === "agent" && A.prompt === q.prompt;
        case "http":
            return q.type === "http" && A.url === q.url;
        case "function":
            return !1
    }
}
// @from(Ln 249804, Col 0)
function dI(A) {
    if ("statusMessage" in A && A.statusMessage) return A.statusMessage;
    switch (A.type) {
        case "command":
            return A.command;
        case "prompt":
            return A.prompt;
        case "agent":
            return A.prompt;
        case "http":
            return A.url;
        case "callback":
            return "callback";
        case "function":
            return "function"
    }
}
// @from(Ln 249822, Col 0)
function F24(A) {
    let q = [];
    if (L8("policySettings")?.allowManagedHooksOnly !== !0) {
        let w = ["userSettings", "projectSettings", "localSettings"],
            O = new Set;
        for (let $ of w) {
            let H = F_($);
            if (H) {
                let J = _Q9(H);
                if (O.has(J)) continue;
                O.add(J)
            }
            let j = L8($);
            if (!j?.hooks) continue;
            for (let [J, M] of Object.entries(j.hooks))
                for (let D of M)
                    for (let X of D.hooks) q.push({
                        event: J,
                        config: X,
                        matcher: D.matcher,
                        source: $
                    })
        }
    }
    let z = R1(),
        _ = jW1(A, z);
    for (let [w, O] of _.entries())
        for (let $ of O)
            for (let H of $.hooks) q.push({
                event: w,
                config: H,
                matcher: $.matcher,
                source: "sessionHook"
            });
    return q
}
// @from(Ln 249859, Col 0)
function p24(A) {
    switch (A) {
        case "userSettings":
            return "User settings (~/.claude/settings.json)";
        case "projectSettings":
            return "Project settings (.claude/settings.json)";
        case "localSettings":
            return "Local settings (.claude/settings.local.json)";
        case "pluginHook":
            return "Plugin hooks (~/.claude/plugins/*/hooks/hooks.json)";
        case "sessionHook":
            return "Session hooks (in-memory, temporary)";
        case "builtinHook":
            return "Built-in hooks (registered internally by Claude Code)";
        default:
            return A
    }
}
// @from(Ln 249878, Col 0)
function wE8(A) {
    switch (A) {
        case "userSettings":
            return "User Settings";
        case "projectSettings":
            return "Project Settings";
        case "localSettings":
            return "Local Settings";
        case "pluginHook":
            return "Plugin Hooks";
        case "sessionHook":
            return "Session Hooks";
        case "builtinHook":
            return "Built-in Hooks";
        default:
            return A
    }
}
// @from(Ln 249897, Col 0)
function Q24(A) {
    switch (A) {
        case "userSettings":
            return "User";
        case "projectSettings":
            return "Project";
        case "localSettings":
            return "Local";
        case "pluginHook":
            return "Plugin";
        case "sessionHook":
            return "Session";
        case "builtinHook":
            return "Built-in";
        default:
            return A
    }
}
// @from(Ln 249916, Col 0)
function U24(A, q, K) {
    let Y = kC6.reduce((z, _, w) => {
        return z[_] = w, z
    }, {});
    return [...A].sort((z, _) => {
        let w = q[K]?.[z] || [],
            O = q[K]?.[_] || [],
            $ = Array.from(new Set(w.map((D) => D.source))),
            H = Array.from(new Set(O.map((D) => D.source))),
            j = (D) => D === "pluginHook" || D === "builtinHook" ? 999 : Y[D],
            J = Math.min(...$.map(j)),
            M = Math.min(...H.map(j));
        if (J !== M) return J - M;
        return z.localeCompare(_)
    })
}
// @from(Ln 249932, Col 4)
P96 = E(() => {
    i8();
    O2();
    Mc();
    T1()
})
// @from(Ln 249939, Col 0)
function JW1(A, q, K, Y, z, _, w) {
    c24(A, q, K, Y, z, _, w)
}
// @from(Ln 249943, Col 0)
function MW1(A, q, K, Y, z, _, w) {
    let O = w?.id || `function-hook-${Date.now()}-${Math.random()}`,
        $ = {
            type: "function",
            id: O,
            timeout: w?.timeout || 5000,
            callback: z,
            errorMessage: _
        };
    return c24(A, q, K, Y, $), O
}
// @from(Ln 249955, Col 0)
function c24(A, q, K, Y, z, _, w) {
    A((O) => {
        let $ = O.sessionHooks.get(q) ?? {
                hooks: {}
            },
            H = $.hooks[K] || [],
            j = H.findIndex((D) => D.matcher === Y && D.skillRoot === w),
            J;
        if (j >= 0) {
            J = [...H];
            let D = J[j];
            J[j] = {
                matcher: D.matcher,
                skillRoot: D.skillRoot,
                hooks: [...D.hooks, {
                    hook: z,
                    onHookSuccess: _
                }]
            }
        } else J = [...H, {
            matcher: Y,
            skillRoot: w,
            hooks: [{
                hook: z,
                onHookSuccess: _
            }]
        }];
        let M = {
            ...$.hooks,
            [K]: J
        };
        return O.sessionHooks.set(q, {
            hooks: M
        }), O
    }), k(`Added session hook for event ${K} in session ${q}`)
}
// @from(Ln 249992, Col 0)
function l24(A, q, K, Y) {
    A((z) => {
        let _ = z.sessionHooks.get(q);
        if (!_) return z;
        let O = (_.hooks[K] || []).map((H) => {
                let j = H.hooks.filter((J) => !_E8(J.hook, Y));
                return j.length > 0 ? {
                    ...H,
                    hooks: j
                } : null
            }).filter((H) => H !== null),
            $ = O.length > 0 ? {
                ..._.hooks,
                [K]: O
            } : {
                ..._.hooks
            };
        if (O.length === 0) delete $[K];
        return z.sessionHooks.set(q, {
            ..._,
            hooks: $
        }), z
    }), k(`Removed session hook for event ${K} in session ${q}`)
}
// @from(Ln 250017, Col 0)
function d24(A) {
    return A.map((q) => ({
        matcher: q.matcher,
        skillRoot: q.skillRoot,
        hooks: q.hooks.map((K) => K.hook).filter((K) => K.type !== "function")
    }))
}
// @from(Ln 250025, Col 0)
function jW1(A, q, K) {
    let Y = A.sessionHooks.get(q);
    if (!Y) return new Map;
    let z = new Map;
    if (K) {
        let _ = Y.hooks[K];
        if (_) z.set(K, d24(_));
        return z
    }
    for (let _ of Fu) {
        let w = Y.hooks[_];
        if (w) z.set(_, d24(w))
    }
    return z
}
// @from(Ln 250041, Col 0)
function i24(A, q, K) {
    let Y = A.sessionHooks.get(q);
    if (!Y) return new Map;
    let z = new Map,
        _ = (w) => {
            return w.map((O) => ({
                matcher: O.matcher,
                hooks: O.hooks.map(($) => $.hook).filter(($) => $.type === "function")
            })).filter((O) => O.hooks.length > 0)
        };
    if (K) {
        let w = Y.hooks[K];
        if (w) {
            let O = _(w);
            if (O.length > 0) z.set(K, O)
        }
        return z
    }
    for (let w of Fu) {
        let O = Y.hooks[w];
        if (O) {
            let $ = _(O);
            if ($.length > 0) z.set(w, $)
        }
    }
    return z
}
// @from(Ln 250069, Col 0)
function n24(A, q, K, Y, z) {
    let _ = A.sessionHooks.get(q);
    if (!_) return;
    let w = _.hooks[K];
    if (!w) return;
    for (let O of w)
        if (O.matcher === Y || Y === "") {
            let $ = O.hooks.find((H) => _E8(H.hook, z));
            if ($) return $
        } return
}
// @from(Ln 250081, Col 0)
function zZ6(A, q) {
    A((K) => {
        return K.sessionHooks.delete(q), K
    }), k(`Cleared all session hooks for session ${q}`)
}
// @from(Ln 250086, Col 4)
Mc = E(() => {
    JJ6();
    H1();
    P96()
})
// @from(Ln 250092, Col 0)
function r24(A, q, K, Y, z = !1) {
    if (!K || Object.keys(K).length === 0) return;
    let _ = 0;
    for (let w of Fu) {
        let O = K[w];
        if (!O || O.length === 0) continue;
        let $ = w;
        if (z && w === "Stop") $ = "SubagentStop", k(`Converting Stop hook to SubagentStop for ${Y} (subagents trigger SubagentStop)`);
        for (let H of O) {
            let j = H.matcher ?? "",
                J = H.hooks;
            if (!J || J.length === 0) continue;
            for (let M of J) JW1(A, q, $, j, M), _++
        }
    }
    if (_ > 0) k(`Registered ${_} frontmatter hook(s) from ${Y} for session ${q}`)
}
// @from(Ln 250109, Col 4)
o24 = E(() => {
    JJ6();
    Mc();
    H1()
})
// @from(Ln 250119, Col 0)
function XW1(A) {
    DW1.delete(A)
}
// @from(Ln 250123, Col 0)
function a24() {
    DW1.clear()
}
// @from(Ln 250127, Col 0)
function $Q9(A) {
    return
}
// @from(Ln 250131, Col 0)
function HQ9(A) {
    return wQ9(c8(), "dump-prompts", `${A??R1()}.jsonl`)
}
// @from(Ln 250135, Col 0)
function s24(A) {
    let q = HQ9(A);
    return async (K, Y) => {
        let z = DW1.get(A);
        if (!z) z = {
            initialized: !1,
            messageCountSeen: 0,
            lastInitDataHash: ""
        }, DW1.set(A, z);
        let _;
        if (Y?.method === "POST" && Y.body) try {
            let O = i1(Y.body);
            _ = new Date().toISOString(), $Q9(O)
        } catch {}
        let w = await globalThis.fetch(K, Y);
        return _ && w.ok, w
    }
}
// @from(Ln 250153, Col 4)
OQ9 = 5
// @from(Ln 250154, Col 4)
OE8
// @from(Ln 250154, Col 9)
DW1
// @from(Ln 250155, Col 4)
$e = E(() => {
    T1();
    A8();
    g1();
    OE8 = [], DW1 = new Map
})
// @from(Ln 250162, Col 0)
function Gf(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "local_bash"
}
// @from(Ln 250166, Col 0)
function wQ6(A, q) {
    i9(A, q, (K) => {
        if (K.status !== "running" || !Gf(K)) return K;
        try {
            k(`LocalBashTask ${A} kill requested`), K.shellCommand?.kill(), K.shellCommand?.cleanup()
        } catch (Y) {
            _6(Y)
        }
        if (K.unregisterCleanup?.(), K.cleanupTimeoutId) clearTimeout(K.cleanupTimeoutId);
        return {
            ...K,
            status: "killed",
            shellCommand: null,
            unregisterCleanup: void 0,
            cleanupTimeoutId: void 0,
            endTime: Date.now()
        }
    }), $O(A)
}
// @from(Ln 250186, Col 0)
function t24(A, q, K) {
    let Y = q().tasks ?? {};
    for (let [z, _] of Object.entries(Y))
        if (Gf(_) && _.agentId === A && _.status === "running") k(`killBashTasksForAgent: killing orphaned bash task ${z} (agent ${A} exiting)`), wQ6(z, K)
}
// @from(Ln 250191, Col 4)
$E8 = E(() => {
    O0();
    SM();
    H1();
    k1()
})
// @from(Ln 250198, Col 0)
function _Z6(A) {
    let q = [];
    return {
        expanded: A.replace(/\$\{([^}]+)\}/g, (Y, z) => {
            let [_, w] = z.split(":-", 2), O = process.env[_];
            if (O !== void 0) return O;
            if (w !== void 0) return w;
            return q.push(_), Y
        }),
        missingVars: q
    }
}
// @from(Ln 250217, Col 0)
function eB(A, q) {
    let K = `mcp__${lO(q)}__`;
    return A.filter((Y) => Y.name?.startsWith(K))
}
// @from(Ln 250222, Col 0)
function PW1(A, q) {
    let K = `mcp__${lO(q)}__`;
    return A.filter((Y) => Y.name?.startsWith(K))
}
// @from(Ln 250227, Col 0)
function WW1(A, q) {
    let K = `mcp__${lO(q)}__`;
    return A.filter((Y) => !Y.name?.startsWith(K))
}
// @from(Ln 250232, Col 0)
function ZW1(A, q) {
    let K = `mcp__${lO(q)}__`;
    return A.filter((Y) => !Y.name?.startsWith(K))
}
// @from(Ln 250237, Col 0)
function GW1(A, q) {
    let K = {
        ...A
    };
    return delete K[q], K
}
// @from(Ln 250244, Col 0)
function e24(A) {
    let {
        scope: q,
        ...K
    } = A, Y = B6(K, (z, _) => {
        if (_ && typeof _ === "object" && !Array.isArray(_)) {
            let w = _,
                O = {};
            for (let $ of Object.keys(w).sort()) O[$] = w[$];
            return O
        }
        return _
    });
    return jQ9("sha256").update(Y).digest("hex").slice(0, 16)
}
// @from(Ln 250260, Col 0)
function Aw4(A, q) {
    let K = A.clients.filter((O) => {
        let $ = q[O.name];
        if (!$) return O.config.scope === "dynamic";
        return e24(O.config) !== e24($)
    });
    if (K.length === 0) return {
        ...A,
        stale: []
    };
    let {
        tools: Y,
        commands: z,
        resources: _
    } = A;
    for (let O of K) Y = WW1(Y, O.name), z = ZW1(z, O.name), _ = GW1(_, O.name);
    let w = new Set(K.map((O) => O.name));
    return {
        clients: A.clients.filter((O) => !w.has(O.name)),
        tools: Y,
        commands: z,
        resources: _,
        stale: K
    }
}
// @from(Ln 250286, Col 0)
function qw4(A, q) {
    return iV(A)?.serverName === q
}
// @from(Ln 250290, Col 0)
function rk(A) {
    return A.name?.startsWith("mcp__") || A.isMcp === !0
}
// @from(Ln 250294, Col 0)
function PZ(A) {
    switch (A) {
        case "user":
            return xD();
        case "project":
            return JQ9(G1(), ".mcp.json");
        case "local":
            return `${xD()} [project: ${G1()}]`;
        case "dynamic":
            return "Dynamically configured";
        case "enterprise":
            return TW1();
        case "claudeai":
            return "claude.ai";
        default:
            return A
    }
}
// @from(Ln 250313, Col 0)
function OQ6(A) {
    switch (A) {
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
            return A
    }
}
// @from(Ln 250332, Col 0)
function wZ6(A) {
    if (!A) return "local";
    if (!D58().options.includes(A)) throw Error(`Invalid scope: ${A}. Must be one of: ${D58().options.join(", ")}`);
    return A
}
// @from(Ln 250338, Col 0)
function Kw4(A) {
    if (!A) return "stdio";
    if (A !== "stdio" && A !== "sse" && A !== "http") throw Error(`Invalid transport type: ${A}. Must be one of: stdio, sse, http`);
    return A
}
// @from(Ln 250344, Col 0)
function HE8(A) {
    let q = {};
    for (let K of A) {
        let Y = K.indexOf(":");
        if (Y === -1) throw Error(`Invalid header format: "${K}". Expected format: "Header-Name: value"`);
        let z = K.substring(0, Y).trim(),
            _ = K.substring(Y + 1).trim();
        if (!z) throw Error(`Invalid header: "${K}". Header name cannot be empty.`);
        q[z] = _
    }
    return q
}
// @from(Ln 250357, Col 0)
function fW1(A) {
    let q = PA(),
        K = lO(A);
    if (q?.disabledMcpjsonServers?.some((Y) => lO(Y) === K)) return "rejected";
    if (q?.enabledMcpjsonServers?.some((Y) => lO(Y) === K) || q?.enableAllProjectMcpServers) return "approved";
    if (OZ6() && SH("projectSettings")) return "approved";
    if (q7() && SH("projectSettings")) return "approved";
    return "pending"
}
// @from(Ln 250367, Col 0)
function jE8(A) {
    if (!rk({
            name: A
        })) return null;
    let q = iV(A);
    if (!q) return null;
    let K = cv(q.serverName);
    if (!K && q.serverName.startsWith("claude_ai_")) return "claudeai";
    return K?.scope ?? null
}
// @from(Ln 250378, Col 0)
function MQ9(A) {
    return A.type === "stdio" || A.type === void 0
}
// @from(Ln 250382, Col 0)
function DQ9(A) {
    return A.type === "sse"
}
// @from(Ln 250386, Col 0)
function XQ9(A) {
    return A.type === "http"
}
// @from(Ln 250390, Col 0)
function PQ9(A) {
    return A.type === "ws"
}
// @from(Ln 250394, Col 0)
function Yw4(A) {
    let q = new Map;
    for (let Y of A) {
        if (!Y.mcpServers?.length) continue;
        for (let z of Y.mcpServers) {
            if (typeof z === "string") continue;
            let _ = Object.entries(z);
            if (_.length !== 1) continue;
            let [w, O] = _[0], $ = q.get(w);
            if ($) {
                if (!$.sourceAgents.includes(Y.agentType)) $.sourceAgents.push(Y.agentType)
            } else q.set(w, {
                config: {
                    ...O,
                    name: w
                },
                sourceAgents: [Y.agentType]
            })
        }
    }
    let K = [];
    for (let [Y, {
            config: z,
            sourceAgents: _
        }] of q)
        if (MQ9(z)) K.push({
            name: Y,
            sourceAgents: _,
            transport: "stdio",
            command: z.command,
            needsAuth: !1
        });
        else if (DQ9(z)) K.push({
        name: Y,
        sourceAgents: _,
        transport: "sse",
        url: z.url,
        needsAuth: !0
    });
    else if (XQ9(z)) K.push({
        name: Y,
        sourceAgents: _,
        transport: "http",
        url: z.url,
        needsAuth: !0
    });
    else if (PQ9(z)) K.push({
        name: Y,
        sourceAgents: _,
        transport: "ws",
        url: z.url,
        needsAuth: !1
    });
    return K.sort((Y, z) => Y.name.localeCompare(z.name))
}
// @from(Ln 250450, Col 0)
function Uj(A) {
    if (!("url" in A) || typeof A.url !== "string") return;
    try {
        let q = new URL(A.url);
        return q.search = "", q.toString().replace(/\/$/, "")
    } catch {
        return
    }
}
// @from(Ln 250459, Col 4)
qM = E(() => {
    i8();
    HA();
    b46();
    g1();
    d3();
    lA();
    WZ();
    sy();
    O2();
    T1()
})
// @from(Ln 250487, Col 0)
function ww4() {
    let A = y8(),
        q = JE8(),
        K = [];
    for (let Y of NW1) {
        let z = $Q6[Y],
            _;
        switch (A) {
            case "macos":
                _ = z.macos.dataPath;
                break;
            case "linux":
            case "wsl":
                _ = z.linux.dataPath;
                break;
            case "windows": {
                if (z.windows.dataPath.length > 0) {
                    let w = z.windows.useRoaming ? hR(q, "AppData", "Roaming") : hR(q, "AppData", "Local");
                    K.push({
                        browser: Y,
                        path: hR(w, ...z.windows.dataPath)
                    })
                }
                continue
            }
        }
        if (_ && _.length > 0) K.push({
            browser: Y,
            path: hR(q, ..._)
        })
    }
    return K
}
// @from(Ln 250521, Col 0)
function Ow4() {
    let A = y8(),
        q = JE8(),
        K = [];
    for (let Y of NW1) {
        let z = $Q6[Y];
        switch (A) {
            case "macos":
                if (z.macos.nativeMessagingPath.length > 0) K.push({
                    browser: Y,
                    path: hR(q, ...z.macos.nativeMessagingPath)
                });
                break;
            case "linux":
            case "wsl":
                if (z.linux.nativeMessagingPath.length > 0) K.push({
                    browser: Y,
                    path: hR(q, ...z.linux.nativeMessagingPath)
                });
                break;
            case "windows":
                break
        }
    }
    return K
}
// @from(Ln 250548, Col 0)
function $w4() {
    let A = [];
    for (let q of NW1) {
        let K = $Q6[q];
        if (K.windows.registryKey) A.push({
            browser: q,
            key: K.windows.registryKey
        })
    }
    return A
}
// @from(Ln 250559, Col 0)
async function fQ9() {
    let A = y8();
    for (let q of NW1) {
        let K = $Q6[q];
        switch (A) {
            case "macos": {
                let Y = `/Applications/${K.macos.appName}.app`;
                try {
                    return await zw4(Y), k(`[Claude in Chrome] Detected browser: ${K.name}`), q
                } catch {}
                break
            }
            case "linux": {
                for (let Y of K.linux.binaries)
                    if (await EM(Y).catch(() => null)) return k(`[Claude in Chrome] Detected browser: ${K.name}`), q;
                break
            }
            case "windows": {
                let Y = JE8();
                if (K.windows.dataPath.length > 0) {
                    let z = K.windows.useRoaming ? hR(Y, "AppData", "Roaming") : hR(Y, "AppData", "Local"),
                        _ = hR(z, ...K.windows.dataPath);
                    try {
                        return await zw4(_), k(`[Claude in Chrome] Detected browser: ${K.name}`), q
                    } catch {}
                }
                break
            }
        }
    }
    return null
}
// @from(Ln 250592, Col 0)
function W96(A) {
    return lO(A) === lv
}
// @from(Ln 250596, Col 0)
function Hw4(A) {
    if (vW1.size >= TQ9 && !vW1.has(A)) vW1.clear();
    vW1.add(A)
}
// @from(Ln 250600, Col 0)
async function VW1(A) {
    let q = y8(),
        K = await fQ9();
    if (!K) return k("[Claude in Chrome] No compatible browser found"), !1;
    let Y = $Q6[K];
    switch (q) {
        case "macos": {
            let {
                code: z
            } = await z8("open", ["-a", Y.macos.appName, A]);
            return z === 0
        }
        case "windows": {
            let {
                code: z
            } = await z8("rundll32", ["url,OpenURL", A]);
            return z === 0
        }
        case "linux": {
            for (let z of Y.linux.binaries) {
                let {
                    code: _
                } = await z8(z, [A]);
                if (_ === 0) return !0
            }
            return !1
        }
        default:
            return !1
    }
}
// @from(Ln 250632, Col 0)
function HQ6() {
    return `/tmp/claude-mcp-browser-bridge-${ME8()}`
}
// @from(Ln 250636, Col 0)
function kW1() {
    if (_w4() === "win32") return `\\\\.\\pipe\\${Jw4()}`;
    return hR(HQ6(), `${process.pid}.sock`)
}
// @from(Ln 250641, Col 0)
function jw4() {
    if (_w4() === "win32") return [`\\\\.\\pipe\\${Jw4()}`];
    let A = [],
        q = HQ6();
    try {
        let _ = GQ9(q);
        for (let w of _)
            if (w.endsWith(".sock")) A.push(hR(q, w))
    } catch {}
    let K = `claude-mcp-browser-bridge-${ME8()}`,
        Y = hR(WQ9(), K),
        z = `/tmp/${K}`;
    if (!A.includes(Y)) A.push(Y);
    if (Y !== z && !A.includes(z)) A.push(z);
    return A
}
// @from(Ln 250658, Col 0)
function Jw4() {
    return `claude-mcp-browser-bridge-${ME8()}`
}
// @from(Ln 250662, Col 0)
function ME8() {
    try {
        return ZQ9().username || "default"
    } catch {
        return process.env.USER || process.env.USERNAME || "default"
    }
}
// @from(Ln 250669, Col 4)
lv = "claude-in-chrome"
// @from(Ln 250670, Col 4)
$Q6
// @from(Ln 250670, Col 9)
NW1
// @from(Ln 250670, Col 14)
TQ9 = 200
// @from(Ln 250671, Col 4)
vW1
// @from(Ln 250672, Col 4)
SR = E(() => {
    YK();
    Eq();
    H1();
    Oy();
    $Q6 = {
        chrome: {
            name: "Google Chrome",
            macos: {
                appName: "Google Chrome",
                dataPath: ["Library", "Application Support", "Google", "Chrome"],
                nativeMessagingPath: ["Library", "Application Support", "Google", "Chrome", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["google-chrome", "google-chrome-stable"],
                dataPath: [".config", "google-chrome"],
                nativeMessagingPath: [".config", "google-chrome", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Google", "Chrome", "User Data"],
                registryKey: "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts"
            }
        },
        brave: {
            name: "Brave",
            macos: {
                appName: "Brave Browser",
                dataPath: ["Library", "Application Support", "BraveSoftware", "Brave-Browser"],
                nativeMessagingPath: ["Library", "Application Support", "BraveSoftware", "Brave-Browser", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["brave-browser", "brave"],
                dataPath: [".config", "BraveSoftware", "Brave-Browser"],
                nativeMessagingPath: [".config", "BraveSoftware", "Brave-Browser", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["BraveSoftware", "Brave-Browser", "User Data"],
                registryKey: "HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts"
            }
        },
        arc: {
            name: "Arc",
            macos: {
                appName: "Arc",
                dataPath: ["Library", "Application Support", "Arc", "User Data"],
                nativeMessagingPath: ["Library", "Application Support", "Arc", "User Data", "NativeMessagingHosts"]
            },
            linux: {
                binaries: [],
                dataPath: [],
                nativeMessagingPath: []
            },
            windows: {
                dataPath: ["Arc", "User Data"],
                registryKey: "HKCU\\Software\\ArcBrowser\\Arc\\NativeMessagingHosts"
            }
        },
        chromium: {
            name: "Chromium",
            macos: {
                appName: "Chromium",
                dataPath: ["Library", "Application Support", "Chromium"],
                nativeMessagingPath: ["Library", "Application Support", "Chromium", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["chromium", "chromium-browser"],
                dataPath: [".config", "chromium"],
                nativeMessagingPath: [".config", "chromium", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Chromium", "User Data"],
                registryKey: "HKCU\\Software\\Chromium\\NativeMessagingHosts"
            }
        },
        edge: {
            name: "Microsoft Edge",
            macos: {
                appName: "Microsoft Edge",
                dataPath: ["Library", "Application Support", "Microsoft Edge"],
                nativeMessagingPath: ["Library", "Application Support", "Microsoft Edge", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["microsoft-edge", "microsoft-edge-stable"],
                dataPath: [".config", "microsoft-edge"],
                nativeMessagingPath: [".config", "microsoft-edge", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Microsoft", "Edge", "User Data"],
                registryKey: "HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts"
            }
        },
        vivaldi: {
            name: "Vivaldi",
            macos: {
                appName: "Vivaldi",
                dataPath: ["Library", "Application Support", "Vivaldi"],
                nativeMessagingPath: ["Library", "Application Support", "Vivaldi", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["vivaldi", "vivaldi-stable"],
                dataPath: [".config", "vivaldi"],
                nativeMessagingPath: [".config", "vivaldi", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Vivaldi", "User Data"],
                registryKey: "HKCU\\Software\\Vivaldi\\NativeMessagingHosts"
            }
        },
        opera: {
            name: "Opera",
            macos: {
                appName: "Opera",
                dataPath: ["Library", "Application Support", "com.operasoftware.Opera"],
                nativeMessagingPath: ["Library", "Application Support", "com.operasoftware.Opera", "NativeMessagingHosts"]
            },
            linux: {
                binaries: ["opera"],
                dataPath: [".config", "opera"],
                nativeMessagingPath: [".config", "opera", "NativeMessagingHosts"]
            },
            windows: {
                dataPath: ["Opera Software", "Opera Stable"],
                registryKey: "HKCU\\Software\\Opera Software\\Opera Stable\\NativeMessagingHosts",
                useRoaming: !0
            }
        }
    }, NW1 = ["chrome", "brave", "arc", "edge", "chromium", "vivaldi", "opera"];
    vW1 = new Set
})
// @from(Ln 250804, Col 0)
async function Mw4(A, q, K) {
    try {
        k(`Loading MCP servers from MCPB: ${q}`);
        let Y = A.repository,
            z = await rI6(q, A.path, Y, (O) => {
                k(`MCPB [${A.name}]: ${O}`)
            });
        if ("status" in z && z.status === "needs-config") return k(`MCPB ${q} requires user configuration. ` + `User can configure via: /plugin → Manage plugins → ${A.name} → Configure`), null;
        let _ = z,
            w = _.manifest.name;
        return k(`Loaded MCP server "${w}" from MCPB (extracted to ${_.extractedPath})`), {
            [w]: _.mcpConfig
        }
    } catch (Y) {
        let z = _1(Y);
        k(`Failed to load MCPB ${q}: ${z}`, {
            level: "error"
        });
        let _ = `${A.name}@${A.repository}`;
        if (q.startsWith("http") && (z.includes("download") || z.includes("network"))) K.push({
            type: "mcpb-download-failed",
            source: _,
            plugin: A.name,
            url: q,
            reason: z
        });
        else if (z.includes("manifest") || z.includes("user configuration")) K.push({
            type: "mcpb-invalid-manifest",
            source: _,
            plugin: A.name,
            mcpbPath: q,
            validationError: z
        });
        else K.push({
            type: "mcpb-extract-failed",
            source: _,
            plugin: A.name,
            mcpbPath: q,
            reason: z
        });
        return null
    }
}
// @from(Ln 250847, Col 0)
async function He(A, q = []) {
    let K = {},
        Y = await DE8(A.path, ".mcp.json");
    if (Y) K = {
        ...K,
        ...Y
    };
    if (A.manifest.mcpServers) {
        let z = A.manifest.mcpServers;
        if (typeof z === "string")
            if (WL(z)) {
                let _ = await Mw4(A, z, q);
                if (_) K = {
                    ...K,
                    ..._
                }
            } else {
                let _ = await DE8(A.path, z);
                if (_) K = {
                    ...K,
                    ..._
                }
            }
        else if (Array.isArray(z)) {
            let _ = await Promise.all(z.map(async (w) => {
                try {
                    if (typeof w === "string") {
                        if (WL(w)) return await Mw4(A, w, q);
                        return await DE8(A.path, w)
                    }
                    return w
                } catch (O) {
                    return k(`Failed to load MCP servers from spec for plugin ${A.name}: ${O}`, {
                        level: "error"
                    }), null
                }
            }));
            for (let w of _)
                if (w) K = {
                    ...K,
                    ...w
                }
        } else K = {
            ...K,
            ...z
        }
    }
    return Object.keys(K).length > 0 ? K : void 0
}
// @from(Ln 250896, Col 0)
async function DE8(A, q) {
    let K = $1(),
        Y = vQ9(A, q),
        z;
    try {
        z = await K.readFile(Y, {
            encoding: "utf-8"
        })
    } catch (_) {
        if (_.code === "ENOENT") return null;
        return k(`Failed to load MCP servers from ${Y}: ${_}`, {
            level: "error"
        }), null
    }
    try {
        let _ = i1(z),
            w = _.mcpServers || _,
            O = {};
        for (let [$, H] of Object.entries(w)) {
            let j = pu().safeParse(H);
            if (j.success) O[$] = j.data;
            else k(`Invalid MCP server config for ${$} in ${Y}: ${j.error.message}`, {
                level: "error"
            })
        }
        return O
    } catch (_) {
        return k(`Failed to load MCP servers from ${Y}: ${_}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 250929, Col 0)
function NQ9(A, q) {
    let K = {};
    for (let [Y, z] of Object.entries(A)) {
        let _ = `plugin:${q}:${Y}`,
            w = {
                ...z,
                scope: "dynamic"
            };
        K[_] = w
    }
    return K
}
// @from(Ln 250942, Col 0)
function VQ9(A, q) {
    return
}
// @from(Ln 250946, Col 0)
function kQ9(A, q, K, Y, z, _) {
    let w = [],
        O = (H) => {
            let j = ZL(H, q);
            if (K) j = zz1(j, K);
            let {
                expanded: J,
                missingVars: M
            } = _Z6(j);
            return w.push(...M), J
        },
        $;
    switch (A.type) {
        case void 0:
        case "stdio": {
            let H = {
                ...A
            };
            if (H.command) H.command = O(H.command);
            if (H.args) H.args = H.args.map((J) => O(J));
            let j = {
                CLAUDE_PLUGIN_ROOT: q,
                ...H.env || {}
            };
            for (let [J, M] of Object.entries(j))
                if (J !== "CLAUDE_PLUGIN_ROOT") j[J] = O(M);
            H.env = j, $ = H;
            break
        }
        case "sse":
        case "http":
        case "ws": {
            let H = {
                ...A
            };
            if (H.url) H.url = O(H.url);
            if (H.headers) {
                let j = {};
                for (let [J, M] of Object.entries(H.headers)) j[J] = O(M);
                H.headers = j
            }
            $ = H;
            break
        }
        case "sse-ide":
        case "ws-ide":
        case "sdk":
        case "claudeai-proxy":
            $ = A;
            break
    }
    if (Y && w.length > 0) {
        let j = [...new Set(w)].join(", ");
        if (k(`Missing environment variables in plugin MCP config: ${j}`, {
                level: "warn"
            }), z && _) Y.push({
            type: "mcp-config-invalid",
            source: `plugin:${z}`,
            plugin: z,
            serverName: _,
            validationError: `Missing environment variables: ${j}`
        })
    }
    return $
}
// @from(Ln 251011, Col 0)
async function Dw4(A, q = []) {
    if (!A.enabled) return;
    let K = A.mcpServers || await He(A, q);
    if (!K) return;
    let Y = {};
    for (let [z, _] of Object.entries(K)) {
        let w = VQ9(A, z);
        try {
            Y[z] = kQ9(_, A.path, w, q, A.name, z)
        } catch (O) {
            q?.push({
                type: "generic-error",
                source: z,
                plugin: A.name,
                error: _1(O)
            })
        }
    }
    return NQ9(Y, A.name)
}
// @from(Ln 251031, Col 4)
jQ6 = E(() => {
    SA();
    H1();
    b46();
    qz1();
    eu();
    g1();
    s8()
})
// @from(Ln 251041, Col 0)
function Xw4() {
    Z96.cache.clear?.(), Pw4()
}
// @from(Ln 251045, Col 0)
function XE8(A) {
    d1((q) => {
        let K = q.claudeAiMcpEverConnected ?? [];
        if (K.includes(A)) return q;
        return {
            ...q,
            claudeAiMcpEverConnected: [...K, A]
        }
    })
}
// @from(Ln 251056, Col 0)
function PE8(A) {
    return (X1().claudeAiMcpEverConnected ?? []).includes(A)
}
// @from(Ln 251059, Col 4)
EQ9 = "tengu_claudeai_mcp_connectors"
// @from(Ln 251060, Col 4)
yQ9 = 5000
// @from(Ln 251061, Col 4)
LQ9 = "mcp-servers-2025-12-04"
// @from(Ln 251062, Col 4)
Z96
// @from(Ln 251063, Col 4)
$Z6 = E(() => {
    U4();
    kK();
    F5();
    V1();
    fA();
    k8();
    H1();
    A8();
    HA();
    QP();
    Z96 = e1(async () => {
        try {
            k("[claudeai-mcp] Checking gate (cached)...");
            let A = jY(EQ9);
            if (k(`[claudeai-mcp] Gate returned: ${A}`), !A) return k("[claudeai-mcp] Disabled via gate"), d("tengu_claudeai_mcp_eligibility", {
                state: "disabled_gate"
            }), {};
            if (xz(process.env.ENABLE_CLAUDEAI_MCP_SERVERS)) return k("[claudeai-mcp] Disabled via env var"), d("tengu_claudeai_mcp_eligibility", {
                state: "disabled_env_var"
            }), {};
            let q = sA();
            if (!q?.accessToken) return k("[claudeai-mcp] No access token"), d("tengu_claudeai_mcp_eligibility", {
                state: "no_oauth_token"
            }), {};
            if (!q.scopes?.includes("user:mcp_servers")) return k(`[claudeai-mcp] Missing user:mcp_servers scope (scopes=${q.scopes?.join(",")||"none"})`), d("tengu_claudeai_mcp_eligibility", {
                state: "missing_scope"
            }), {};
            let Y = `${P7().BASE_API_URL}/v1/mcp_servers?limit=1000`;
            k(`[claudeai-mcp] Fetching from ${Y}`);
            let z = await X8.get(Y, {
                    headers: {
                        Authorization: `Bearer ${q.accessToken}`,
                        "Content-Type": "application/json",
                        "anthropic-beta": LQ9,
                        "anthropic-version": "2023-06-01"
                    },
                    timeout: yQ9
                }),
                _ = {},
                w = new Set;
            for (let O of z.data.data) {
                let $ = `claude.ai ${O.display_name}`,
                    H = $,
                    j = lO(H),
                    J = 1;
                while (w.has(j)) J++, H = `${$} (${J})`, j = lO(H);
                w.add(j), _[H] = {
                    type: "claudeai-proxy",
                    url: O.url,
                    id: O.id,
                    scope: "claudeai"
                }
            }
            return k(`[claudeai-mcp] Fetched ${Object.keys(_).length} servers`), d("tengu_claudeai_mcp_eligibility", {
                state: "eligible"
            }), _
        } catch {
            return k("[claudeai-mcp] Fetch failed"), {}
        }
    })
})
// @from(Ln 251138, Col 0)
function TW1() {
    return EW1(bW(), "managed-mcp.json")
}
// @from(Ln 251142, Col 0)
function JQ6(A, q) {
    if (!A) return {};
    let K = {};
    for (let [Y, z] of Object.entries(A)) K[Y] = {
        ...z,
        scope: q
    };
    return K
}
// @from(Ln 251151, Col 0)
async function Zw4(A) {
    let q = EW1(G1(), ".mcp.json"),
        K;
    try {
        K = (await CQ9(q)).mode
    } catch (_) {
        if (_.code !== "ENOENT") throw _
    }
    let Y = `${q}.tmp.${process.pid}.${Date.now()}`,
        z = await SQ9(Y, "w", K ?? 420);
    try {
        await z.writeFile(B6(A, null, 2), {
            encoding: "utf8"
        }), await z.datasync()
    } finally {
        await z.close()
    }
    try {
        if (K !== void 0) await IQ9(Y, K);
        await bQ9(Y, q)
    } catch (_) {
        try {
            await xQ9(Y)
        } catch {}
        throw _
    }
}
// @from(Ln 251179, Col 0)
function ZE8(A) {
    if (A.type !== void 0 && A.type !== "stdio") return null;
    let q = A;
    return [q.command, ...q.args]
}
// @from(Ln 251185, Col 0)
function Gw4(A, q) {
    if (A.length !== q.length) return !1;
    return A.every((K, Y) => K === q[Y])
}
// @from(Ln 251190, Col 0)
function GE8(A) {
    return "url" in A ? A.url : null
}
// @from(Ln 251194, Col 0)
function Ww4(A) {
    let q = ZE8(A);
    if (q) return `stdio:${B6(q)}`;
    let K = GE8(A);
    if (K) return `url:${K}`;
    return null
}
// @from(Ln 251202, Col 0)
function uQ9(A, q) {
    let K = new Map;
    for (let [w, O] of Object.entries(q)) {
        let $ = Ww4(O);
        if ($ && !K.has($)) K.set($, w)
    }
    let Y = {},
        z = [],
        _ = new Map;
    for (let [w, O] of Object.entries(A)) {
        let $ = Ww4(O);
        if ($ === null) {
            Y[w] = O;
            continue
        }
        let H = K.get($);
        if (H !== void 0) {
            k(`Suppressing plugin MCP server "${w}": duplicates manually-configured "${H}"`), z.push({
                name: w,
                duplicateOf: H
            });
            continue
        }
        let j = _.get($);
        if (j !== void 0) {
            k(`Suppressing plugin MCP server "${w}": duplicates earlier plugin server "${j}"`), z.push({
                name: w,
                duplicateOf: j
            });
            continue
        }
        _.set($, w), Y[w] = O
    }
    return {
        servers: Y,
        suppressed: z
    }
}
// @from(Ln 251241, Col 0)
function mQ9(A) {
    let K = A.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${K}$`)
}
// @from(Ln 251246, Col 0)
function fw4(A, q) {
    return mQ9(q).test(A)
}
// @from(Ln 251250, Col 0)
function BQ9() {
    if (pQ9()) return L8("policySettings") ?? {};
    return mA()
}
// @from(Ln 251255, Col 0)
function gQ9() {
    return mA()
}
// @from(Ln 251259, Col 0)
function Tw4(A, q) {
    let K = gQ9();
    if (!K.deniedMcpServers) return !1;
    for (let Y of K.deniedMcpServers)
        if (WJ6(Y) && Y.serverName === A) return !0;
    if (q) {
        let Y = ZE8(q);
        if (Y) {
            for (let _ of K.deniedMcpServers)
                if (x31(_) && Gw4(_.serverCommand, Y)) return !0
        }
        let z = GE8(q);
        if (z) {
            for (let _ of K.deniedMcpServers)
                if (u31(_) && fw4(z, _.serverUrl)) return !0
        }
    }
    return !1
}
// @from(Ln 251279, Col 0)
function MQ6(A, q) {
    if (Tw4(A, q)) return !1;
    let K = BQ9();
    if (!K.allowedMcpServers) return !0;
    if (K.allowedMcpServers.length === 0) return !1;
    let Y = K.allowedMcpServers.some(x31),
        z = K.allowedMcpServers.some(u31);
    if (q) {
        let _ = ZE8(q),
            w = GE8(q);
        if (_)
            if (Y) {
                for (let O of K.allowedMcpServers)
                    if (x31(O) && Gw4(O.serverCommand, _)) return !0;
                return !1
            } else {
                for (let O of K.allowedMcpServers)
                    if (WJ6(O) && O.serverName === A) return !0;
                return !1
            }
        else if (w)
            if (z) {
                for (let O of K.allowedMcpServers)
                    if (u31(O) && fw4(w, O.serverUrl)) return !0;
                return !1
            } else {
                for (let O of K.allowedMcpServers)
                    if (WJ6(O) && O.serverName === A) return !0;
                return !1
            }
        else {
            for (let O of K.allowedMcpServers)
                if (WJ6(O) && O.serverName === A) return !0;
            return !1
        }
    }
    for (let _ of K.allowedMcpServers)
        if (WJ6(_) && _.serverName === A) return !0;
    return !1
}
// @from(Ln 251320, Col 0)
function FQ9(A) {
    let q = [];

    function K(z) {
        let {
            expanded: _,
            missingVars: w
        } = _Z6(z);
        return q.push(...w), _
    }
    let Y;
    switch (A.type) {
        case void 0:
        case "stdio": {
            let z = A;
            Y = {
                ...z,
                command: K(z.command),
                args: z.args.map(K),
                env: z.env ? K36(z.env, K) : void 0
            };
            break
        }
        case "sse":
        case "http":
        case "ws": {
            let z = A;
            Y = {
                ...z,
                url: K(z.url),
                headers: z.headers ? K36(z.headers, K) : void 0
            };
            break
        }
        case "sse-ide":
        case "ws-ide":
            Y = A;
            break;
        case "sdk":
            Y = A;
            break;
        case "claudeai-proxy":
            Y = A;
            break
    }
    return {
        expanded: Y,
        missingVars: [...new Set(q)]
    }
}