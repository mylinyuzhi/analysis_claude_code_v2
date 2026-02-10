
// @from(Ln 363275, Col 0)
async function qn4(A, q, K, Y) {
    let z = b1();
    if (eR(Y, `Downloading marketplace from ${A}`), h(`Downloading marketplace from URL: ${A}`), K && Object.keys(K).length > 0) h(`Using custom headers: ${Q1(cIY(K))}`);
    let w = {
            ...K,
            "User-Agent": "Claude-Code-Plugin-Manager"
        },
        H;
    try {
        H = await sA.get(A, {
            timeout: 1e4,
            headers: w
        })
    } catch (_) {
        if (sA.isAxiosError(_)) {
            if (_.code === "ECONNREFUSED" || _.code === "ENOTFOUND") throw Error(`Could not connect to ${A}. Please check your internet connection and verify the URL is correct.

Technical details: ${_.message}`);
            if (_.code === "ETIMEDOUT") throw Error(`Request timed out while downloading marketplace from ${A}. The server may be slow or unreachable.

Technical details: ${_.message}`);
            if (_.response) throw Error(`HTTP ${_.response.status} error while downloading marketplace from ${A}. The marketplace file may not exist at this URL.

Technical details: ${_.message}`)
        }
        throw Error(`Failed to download marketplace from ${A}: ${_ instanceof Error?_.message:String(_)}`)
    }
    eR(Y, "Validating marketplace data");
    let $ = AH1.safeParse(H.data);
    if (!$.success) throw new hG(`Invalid marketplace schema from URL: ${$.error.issues.map((_)=>`${_.path.join(".")}: ${_.message}`).join(", ")}`, A, H.data);
    eR(Y, "Saving marketplace to cache");
    let O = iZ(q, "..");
    z.mkdirSync(O), c8(q, Q1($.data, null, 2), {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 363313, Col 0)
function lIY(A) {
    return A.source === "github" ? A.repo.replace("/", "-") : A.source === "npm" ? A.package.replace("@", "").replace("/", "-") : A.source === "file" ? si4(A.path).replace(".json", "") : A.source === "directory" ? si4(A.path) : "temp_" + Date.now()
}
// @from(Ln 363317, Col 0)
function Kn4(A, q) {
    let Y = b1().readFileSync(A, {
            encoding: "utf-8"
        }),
        z;
    try {
        z = _A(Y)
    } catch (H) {
        throw new hG(`Invalid JSON in ${A}: ${H instanceof Error?H.message:String(H)}`, A, Y)
    }
    let w = q.safeParse(z);
    if (!w.success) throw new hG(`Invalid schema: ${A} ${w.error?.issues.map((H)=>`${H.path.join(".")}: ${H.message}`).join(", ")}`, A, z);
    return w.data
}
// @from(Ln 363331, Col 0)
async function RyA(A, q) {
    let K = b1(),
        Y = ei4();
    K.mkdirSync(Y);
    let z, w, H = !1,
        $ = lIY(A);
    try {
        switch (A.source) {
            case "url": {
                z = iZ(Y, `${$}.json`), H = !0, await qn4(A.url, z, A.headers, q), w = z;
                break
            }
            case "github": {
                let X = `git@github.com:${A.repo}.git`,
                    D = `https://github.com/${A.repo}.git`;
                z = iZ(Y, $), H = !0;
                let j = null;
                if (await UIY()) {
                    eR(q, `Cloning via SSH: ${X}`);
                    try {
                        await eW1(X, z, A.ref, q)
                    } catch (P) {
                        if (j = P instanceof Error ? P : Error(String(P)), K1(j), eR(q, `SSH clone failed, retrying with HTTPS: ${D}`), h(`SSH clone failed for ${A.repo} despite SSH being configured, falling back to HTTPS`, {
                                level: "info"
                            }), K.existsSync(z)) K.rmSync(z, {
                            recursive: !0,
                            force: !0
                        });
                        try {
                            await eW1(D, z, A.ref, q), j = null
                        } catch (W) {
                            j = W instanceof Error ? W : Error(String(W)), K1(j)
                        }
                    }
                } else {
                    eR(q, `SSH not configured, cloning via HTTPS: ${D}`), h(`SSH not configured for GitHub, using HTTPS for ${A.repo}`, {
                        level: "info"
                    });
                    try {
                        await eW1(D, z, A.ref, q)
                    } catch (P) {
                        if (j = P instanceof Error ? P : Error(String(P)), K1(j), eR(q, `HTTPS clone failed, retrying with SSH: ${X}`), h(`HTTPS clone failed for ${A.repo} (${j.message}), falling back to SSH`, {
                                level: "info"
                            }), K.existsSync(z)) K.rmSync(z, {
                            recursive: !0,
                            force: !0
                        });
                        try {
                            await eW1(X, z, A.ref, q), j = null
                        } catch (W) {
                            j = W instanceof Error ? W : Error(String(W)), K1(j)
                        }
                    }
                }
                if (j) throw j;
                w = iZ(z, A.path || ".claude-plugin/marketplace.json");
                break
            }
            case "git": {
                z = iZ(Y, $), H = !0, await eW1(A.url, z, A.ref, q), w = iZ(z, A.path || ".claude-plugin/marketplace.json");
                break
            }
            case "npm":
                throw Error("NPM marketplace sources not yet implemented");
            case "file": {
                w = A.path, z = ti4(ti4(A.path)), H = !1;
                break
            }
            case "directory": {
                w = iZ(A.path, ".claude-plugin", "marketplace.json"), z = A.path, H = !1;
                break
            }
            default:
                throw Error("Unsupported marketplace source type")
        }
        if (!K.existsSync(w)) throw Error(`Marketplace file not found at ${w}`);
        h(`Reading marketplace from ${w}`);
        let O = Kn4(w, AH1),
            _ = iZ(Y, O.name),
            J = A.source === "file" || A.source === "directory";
        if (z !== _ && !J) try {
            if (K.existsSync(_)) {
                try {
                    q?.("Cleaning up old marketplace cache…")
                } catch (X) {
                    h(`Progress callback error: ${X instanceof Error?X.message:String(X)}`, {
                        level: "warn"
                    })
                }
                K.rmSync(_, {
                    recursive: !0,
                    force: !0
                })
            }
            K.renameSync(z, _), z = _, H = !1
        } catch (X) {
            let D = X instanceof Error ? X.message : String(X);
            throw Error(`Failed to finalize marketplace cache. Please manually delete the directory at ${_} if it exists and try again.

Technical details: ${D}`)
        }
        return {
            marketplace: O,
            cachePath: z
        }
    } catch (O) {
        if (H && z && A.source !== "file" && A.source !== "directory") try {
            if (K.existsSync(z)) K.rmSync(z, {
                recursive: !0,
                force: !0
            })
        } catch (_) {
            h(`Warning: Failed to clean up temporary marketplace cache at ${z}: ${_ instanceof Error?_.message:String(_)}`, {
                level: "warn"
            })
        }
        throw O
    }
}
// @from(Ln 363450, Col 0)
async function wE(A, q) {
    if (!Fq1(A)) {
        if (nb1(A)) throw Error(`Marketplace source '${o01(A)}' is blocked by enterprise policy.`);
        let H = mq1() || [],
            $ = Kb7(),
            O = vXA(A),
            _ = `Marketplace source '${o01(A)}'`;
        if (O) _ += ` (${O})`;
        if (_ += " is blocked by enterprise policy.", H.length > 0) _ += ` Allowed sources: ${H.map((J)=>o01(J)).join(", ")}`;
        else _ += " No external marketplaces are allowed.";
        if (A.source === "github" && $.length > 0) _ += `

Tip: The shorthand "${A.repo}" assumes github.com. For internal GitHub Enterprise, use the full URL:
  git@your-github-host.com:${A.repo}.git`;
        throw Error(_)
    }
    let {
        marketplace: K,
        cachePath: Y
    } = await RyA(A, q), z = pw8(K.name, A);
    if (z) throw Error(z);
    let w = await n5();
    if (w[K.name]) throw Error(`Marketplace '${K.name}' is already installed. Please remove it first using '/plugin marketplace remove ${K.name}' if you want to re-install it.`);
    return w[K.name] = {
        source: A,
        installLocation: Y,
        lastUpdated: new Date().toISOString()
    }, await qG1(w), h(`Added marketplace source: ${K.name}`), {
        name: K.name
    }
}
// @from(Ln 363481, Col 0)
async function OG6(A) {
    let q = await n5();
    if (!q[A]) throw Error(`Marketplace '${A}' not found`);
    delete q[A], await qG1(q);
    let K = b1(),
        Y = ei4(),
        z = iZ(Y, A);
    if (K.existsSync(z)) K.rmSync(z, {
        recursive: !0,
        force: !0
    });
    let w = iZ(Y, `${A}.json`);
    if (K.existsSync(w)) K.rmSync(w, {
        force: !0
    });
    let H = ["userSettings", "projectSettings", "localSettings"];
    for (let O of H) {
        let _ = y7(O);
        if (!_) continue;
        let J = !1,
            X = {};
        if (_.extraKnownMarketplaces?.[A]) {
            let D = {
                ..._.extraKnownMarketplaces
            };
            D[A] = void 0, X.extraKnownMarketplaces = D, J = !0
        }
        if (_.enabledPlugins) {
            let D = `@${A}`,
                j = {
                    ..._.enabledPlugins
                },
                M = !1;
            for (let P in j)
                if (P.endsWith(D)) j[P] = void 0, M = !0;
            if (M) X.enabledPlugins = j, J = !0
        }
        if (J) {
            let D = Z7(O, X);
            if (D.error) K1(D.error), h(`Failed to clean up marketplace '${A}' from ${O} settings: ${D.error.message}`);
            else h(`Cleaned up marketplace '${A}' from ${O} settings`)
        }
    }
    let $ = _b7(A);
    for (let O of $) tW1(O);
    h(`Removed marketplace source: ${A}`)
}
// @from(Ln 363529, Col 0)
function HG6(A) {
    let q = b1();
    try {
        let K = A;
        if (q.existsSync(A) && q.statSync(A).isDirectory()) {
            let Y = iZ(A, ".claude-plugin", "marketplace.json");
            if (q.existsSync(Y)) K = Y;
            else throw Error(`Invalid cached directory at ${A}: missing .claude-plugin/marketplace.json`)
        }
        if (!q.existsSync(K)) throw Error(`Marketplace file not found at ${K}`);
        return Kn4(K, AH1)
    } catch (K) {
        if (K instanceof hG) throw K;
        throw K
    }
}
// @from(Ln 363546, Col 0)
function iIY(A) {
    let q = b1(),
        K = $G6();
    if (!q.existsSync(K)) return null;
    try {
        let Y = q.readFileSync(K, {
                encoding: "utf-8"
            }),
            w = _A(Y)[A];
        if (!w) return null;
        return HG6(w.installLocation)
    } catch (Y) {
        return h(`Failed to read cached marketplace ${A}: ${Y instanceof Error?Y.message:String(Y)}`, {
            level: "warn"
        }), null
    }
}
// @from(Ln 363564, Col 0)
function yyA(A) {
    let q = A.split("@");
    if (q.length !== 2) return null;
    let K = q[0],
        Y = q[1],
        z = b1(),
        w = $G6();
    if (!z.existsSync(w)) return null;
    try {
        let H = z.readFileSync(w, {
                encoding: "utf-8"
            }),
            O = _A(H)[Y];
        if (!O) return null;
        let _ = iIY(Y);
        if (!_) return null;
        let J = _.plugins.find((X) => X.name === K);
        if (!J) return null;
        return {
            entry: J,
            marketplaceInstallLocation: O.installLocation
        }
    } catch {
        return null
    }
}
// @from(Ln 363590, Col 0)
async function a0(A) {
    let q = yyA(A);
    if (q) return q;
    let K = A.split("@");
    if (K.length !== 2) return null;
    let Y = K[0],
        z = K[1];
    try {
        let H = (await n5())[z];
        if (!H) return null;
        let O = (await NZ(z)).plugins.find((_) => _.name === Y);
        if (!O) return null;
        return {
            entry: O,
            marketplaceInstallLocation: H.installLocation
        }
    } catch (w) {
        return h(`Could not find plugin ${A}: ${w instanceof Error?w.message:String(w)}`, {
            level: "debug"
        }), null
    }
}
// @from(Ln 363612, Col 0)
async function Yn4() {
    let A = await n5();
    for (let [q, K] of Object.entries(A)) try {
        await RyA(K.source), A[q].lastUpdated = new Date().toISOString()
    } catch (Y) {
        h(`Failed to refresh marketplace ${q}: ${Y instanceof Error?Y.message:String(Y)}`, {
            level: "error"
        })
    }
    await qG1(A)
}
// @from(Ln 363623, Col 0)
async function St(A, q, K) {
    let Y = await n5(),
        z = Y[A];
    if (!z) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(Y).join(", ")}`);
    NZ.cache?.delete?.(A);
    try {
        let {
            installLocation: w,
            source: H
        } = z;
        if (H.source === "github" || H.source === "git") {
            let $ = H.source === "github" ? J6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${H.repo}.git` : `git@github.com:${H.repo}.git` : H.url;
            await eW1($, w, H.ref, q, K);
            try {
                HG6(w)
            } catch {
                let O = H.source === "github" ? H.repo : H.url;
                throw Error(`The marketplace.json file is no longer present in this repository.

${A==="claude-code-plugins"?`We've deprecated "claude-code-plugins" in favor of "claude-plugins-official".`:"This marketplace may have been deprecated or moved to a new location."}
Source: ${O}

You can remove this marketplace with: claude plugin marketplace remove "${A}"`)
            }
        } else if (H.source === "url") await qn4(H.url, w, H.headers, q);
        else if (H.source === "file" || H.source === "directory") eR(q, "Validating local marketplace"), HG6(w);
        else throw Error("Unsupported marketplace source type for refresh");
        Y[A].lastUpdated = new Date().toISOString(), await qG1(Y), h(`Successfully refreshed marketplace: ${A}`)
    } catch (w) {
        let H = w instanceof Error ? w.message : String(w);
        throw h(`Failed to refresh marketplace ${A}: ${H}`, {
            level: "error"
        }), Error(`Failed to refresh marketplace '${A}': ${H}`)
    }
}
// @from(Ln 363658, Col 0)
async function zn4(A, q) {
    let K = await n5(),
        Y = K[A];
    if (!Y) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(K).join(", ")}`);
    if (Y.autoUpdate === q) return;
    K[A] = {
        ...Y,
        autoUpdate: q
    }, await qG1(K), h(`Set autoUpdate=${q} for marketplace: ${A}`)
}
// @from(Ln 363668, Col 4)
An4
// @from(Ln 363668, Col 9)
NZ
// @from(Ln 363669, Col 4)
p$ = v(() => {
    y5();
    zq();
    hA();
    lb1();
    _8();
    m6();
    Z6();
    y6();
    tq();
    qH();
    p8();
    N0();
    Xa();
    m6();
    mM();
    tR();
    h9();
    An4 = {
        GIT_TERMINAL_PROMPT: "0",
        GIT_ASKPASS: ""
    };
    NZ = KA(async (A) => {
        let q = await n5(),
            K = q[A];
        if (!K) throw Error(`Marketplace '${A}' not found in configuration. Available marketplaces: ${Object.keys(q).join(", ")}`);
        try {
            return HG6(K.installLocation)
        } catch (z) {
            h(`Cache corrupted or missing for marketplace ${A}, re-fetching from source: ${z instanceof Error?z.message:String(z)}`, {
                level: "warn"
            })
        }
        let {
            marketplace: Y
        } = await RyA(K.source);
        return q[A].lastUpdated = new Date().toISOString(), await qG1(q), Y
    })
})
// @from(Ln 363708, Col 0)
async function od(A, q, K, Y, z) {
    if (K?.version) return h(`Using manifest version for ${A}: ${K.version}`), K.version;
    if (z) return h(`Using provided version for ${A}: ${z}`), z;
    if (Y) {
        let w = await nIY(Y);
        if (w) {
            let H = w.substring(0, 12);
            return h(`Using git SHA for ${A}: ${H}`), H
        }
    }
    return h(`No version found for ${A}, using 'unknown'`), "unknown"
}
// @from(Ln 363720, Col 0)
async function nIY(A) {
    return bv1(A)
}
// @from(Ln 363723, Col 4)
_G6 = v(() => {
    tq();
    Z6();
    YH1()
})
// @from(Ln 363746, Col 0)
function $n4() {
    return new Date().toISOString()
}
// @from(Ln 363750, Col 0)
function IyA(A, q) {
    let K = SyA(A, q),
        Y = SyA(A) + hyA;
    if (!K.startsWith(Y) && K !== SyA(A)) throw Error(`Path traversal detected: "${q}" would escape the base directory`);
    return K
}
// @from(Ln 363756, Col 0)
async function HE(A, q, K = "user", Y, z) {
    let w = typeof q.source === "string" && z ? z : q.source,
        H = await F51(w, {
            manifest: q
        }),
        $ = z || H.path,
        O = await I$6($),
        _ = $n4(),
        J = await od(A, q.source, H.manifest, $, q.version),
        X = RB(A, J),
        D = H.path;
    if (H.path !== X) {
        if (wn4(Hn4(X), {
                recursive: !0
            }), rIY(X)) oIY(X, {
            recursive: !0,
            force: !0
        });
        let j = H.path.endsWith(hyA) ? H.path : H.path + hyA;
        if (X.startsWith(j)) {
            let P = aIY(sIY(), `claude-plugin-temp-${Date.now()}`);
            await CyA(H.path, P), wn4(Hn4(X), {
                recursive: !0
            }), await CyA(P, X)
        } else await CyA(H.path, X);
        D = X
    }
    return hXA(A, {
        version: J,
        installedAt: _,
        lastUpdated: _,
        installPath: D,
        gitCommitSha: O
    }, K, Y), D
}
// @from(Ln 363792, Col 0)
function On4(A, q = "user", K) {
    let Y = $n4();
    hXA(A.pluginId, {
        version: A.version || "unknown",
        installedAt: Y,
        lastUpdated: Y,
        installPath: A.installPath
    }, q, K)
}
// @from(Ln 363801, Col 0)
async function ug1({
    pluginId: A,
    entry: q,
    marketplaceName: K,
    scope: Y = "user"
}) {
    try {
        let z = kB(Y),
            w = Y !== "user" ? h6() : void 0,
            H, {
                source: $
            } = q;
        if (tx($)) {
            let J = await a0(A);
            if (J) H = IyA(J.marketplaceInstallLocation, $)
        }
        await HE(A, q, Y, w, H);
        let _ = {
            ...y7(z)?.enabledPlugins,
            [A]: !0
        };
        return Z7(z, {
            enabledPlugins: _
        }), c("tengu_plugin_installed", {
            plugin_id: A,
            marketplace_name: K
        }), Uw(), {
            success: !0,
            message: `✓ Installed ${q.name}. Restart Claude Code to load new plugins.`
        }
    } catch (z) {
        let w = z instanceof Error ? z.message : String(z);
        return K1(z instanceof Error ? z : Error(`Failed to install plugin: ${String(z)}`)), {
            success: !1,
            error: `Failed to install: ${w}`
        }
    }
}
// @from(Ln 363839, Col 4)
ad = v(() => {
    N0();
    mM();
    VJ();
    p$();
    Qq1();
    p8();
    N7();
    tR();
    u6();
    y6();
    _G6()
})
// @from(Ln 363861, Col 0)
function Uq1() {
    return $9(Lv(), "cache")
}
// @from(Ln 363865, Col 0)
function RB(A, q) {
    let K = Uq1(),
        [Y, z] = A.split("@"),
        w = (z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
        H = (Y || A).replace(/[^a-zA-Z0-9\-_]/g, "-"),
        $ = q.replace(/[^a-zA-Z0-9\-_.]/g, "-");
    return $9(K, w, H, $)
}
// @from(Ln 363874, Col 0)
function Bg1(A, q) {
    let K = b1();
    if (!K.existsSync(q)) K.mkdirSync(q);
    let Y = K.readdirSync(A);
    for (let z of Y) {
        let w = $9(A, z.name),
            H = $9(q, z.name);
        if (z.isDirectory()) Bg1(w, H);
        else if (z.isFile()) K.copyFileSync(w, H);
        else if (z.isSymbolicLink()) {
            let $ = K.readlinkSync(w),
                O;
            try {
                O = K.realpathSync(w)
            } catch {
                K.symlinkSync($, H);
                continue
            }
            let _;
            try {
                _ = K.realpathSync(A)
            } catch {
                _ = A
            }
            let J = _.endsWith(Jn4) ? _ : _ + Jn4;
            if (O.startsWith(J) || O === _) {
                let X = _n4(_, O),
                    D = $9(q, X),
                    j = _n4(jn4(H), D);
                K.symlinkSync(j, H)
            } else K.symlinkSync(O, H)
        }
    }
}
// @from(Ln 363908, Col 0)
async function JG6(A, q, K, Y, z) {
    let w = b1(),
        H = RB(q, K);
    if (w.existsSync(H) && !w.isDirEmptySync(H)) return h(`Plugin ${q} version ${K} already cached at ${H}`), H;
    if (w.existsSync(H) && w.isDirEmptySync(H)) h(`Removing empty cache directory for ${q} at ${H}`), w.rmdirSync(H);
    if (w.mkdirSync(jn4(H)), Y && typeof Y.source === "string" && z) {
        let O = IyA(z, Y.source);
        if (w.existsSync(O)) h(`Copying source directory ${Y.source} for plugin ${q}`), Bg1(O, H);
        else throw Error(`Plugin source directory not found: ${O} (from entry.source: ${Y.source})`)
    } else h(`Copying plugin ${q} to versioned cache (fallback to full copy)`), Bg1(A, H);
    let $ = $9(H, ".git");
    if (w.existsSync($)) w.rmSync($, {
        recursive: !0,
        force: !0
    });
    if (w.isDirEmptySync(H)) throw Error(`Failed to copy plugin ${q} to versioned cache: destination is empty after copy`);
    return h(`Successfully cached plugin ${q} at ${H}`), H
}
// @from(Ln 363927, Col 0)
function AxY(A) {
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
// @from(Ln 363939, Col 0)
async function qxY(A, q) {
    let K = b1(),
        Y = $9(Lv(), "npm-cache");
    K.mkdirSync(Y);
    let z = $9(Y, "node_modules", A);
    if (!K.existsSync(z)) {
        h(`Installing npm package ${A} to cache`);
        let H = await IA("npm", ["install", A, "--prefix", Y], {
            useCwd: !1
        });
        if (H.code !== 0) throw Error(`Failed to install npm package: ${H.stderr}`)
    }
    Bg1(z, q), h(`Copied npm package ${A} from cache to ${q}`)
}
// @from(Ln 363953, Col 0)
async function KxY(A, q, K, Y) {
    let z = ["clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
    if (K) z.push("--branch", K);
    if (Y) z.push("--no-checkout");
    z.push(A, q);
    let w = await IA(pq(), z);
    if (w.code !== 0) throw Error(`Failed to clone repository: ${w.stderr}`);
    if (Y) {
        if ((await d4(pq(), ["fetch", "--depth", "1", "origin", Y], {
                cwd: q
            })).code !== 0) {
            h(`Shallow fetch of SHA ${Y} failed, falling back to unshallow fetch`);
            let O = await d4(pq(), ["fetch", "--unshallow"], {
                cwd: q
            });
            if (O.code !== 0) throw Error(`Failed to fetch commit ${Y}: ${O.stderr}`)
        }
        let $ = await d4(pq(), ["checkout", Y], {
            cwd: q
        });
        if ($.code !== 0) throw Error(`Failed to checkout commit ${Y}: ${$.stderr}`)
    }
}
// @from(Ln 363976, Col 0)
async function Mn4(A, q, K, Y) {
    let z = AxY(A);
    await KxY(z, q, K, Y);
    let w = K ? ` (ref: ${K})` : "";
    h(`Cloned repository from ${z}${w} to ${q}`)
}
// @from(Ln 363982, Col 0)
async function YxY(A, q, K, Y) {
    if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(A)) throw Error(`Invalid GitHub repository format: ${A}. Expected format: owner/repo`);
    let z = J6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${A}.git` : `git@github.com:${A}.git`;
    return Mn4(z, q, K, Y)
}
// @from(Ln 363987, Col 0)
async function zxY(A, q) {
    let K = b1();
    if (!K.existsSync(A)) throw Error(`Source path does not exist: ${A}`);
    Bg1(A, q);
    let Y = $9(q, ".git");
    if (K.existsSync(Y)) K.rmSync(Y, {
        recursive: !0,
        force: !0
    })
}
// @from(Ln 363998, Col 0)
function wxY(A) {
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
        default:
            Y = "unknown"
    }
    return `temp_${Y}_${q}_${K}`
}
// @from(Ln 364021, Col 0)
async function F51(A, q) {
    let K = b1(),
        Y = Uq1();
    K.mkdirSync(Y);
    let z = wxY(A),
        w = $9(Y, z),
        H = !1;
    try {
        if (h(`Caching plugin from source: ${Q1(A)} to temporary path ${w}`), H = !0, typeof A === "string") await zxY(A, w);
        else switch (A.source) {
            case "npm":
                await qxY(A.package, w);
                break;
            case "github":
                await YxY(A.repo, w, A.ref, A.sha);
                break;
            case "url":
                await Mn4(A.url, w, A.ref, A.sha);
                break;
            case "pip":
                throw Error("Python package plugins are not yet supported");
            default:
                throw Error("Unsupported plugin source type")
        }
    } catch (D) {
        if (H && K.existsSync(w)) {
            h(`Cleaning up failed installation at ${w}`);
            try {
                K.rmSync(w, {
                    recursive: !0,
                    force: !0
                })
            } catch (j) {
                h(`Failed to clean up installation: ${j}`, {
                    level: "error"
                })
            }
        }
        throw D
    }
    let $ = $9(w, ".claude-plugin", "plugin.json"),
        O = $9(w, "plugin.json"),
        _;
    if (K.existsSync($)) try {
        let D = K.readFileSync($, {
                encoding: "utf-8"
            }),
            j = _A(D),
            M = wA1.safeParse(j);
        if (M.success) _ = M.data;
        else {
            let P = M.error.issues.map((W) => `${W.path.join(".")}: ${W.message}`).join(", ");
            throw h(`Invalid manifest at ${$}: ${P}`, {
                level: "error"
            }), Error(`Plugin has an invalid manifest file at ${$}. Validation errors: ${P}`)
        }
    } catch (D) {
        if (D instanceof Error && D.message.includes("invalid manifest file")) throw D;
        let j = D instanceof Error ? D.message : String(D);
        throw h(`Failed to parse manifest at ${$}: ${j}`, {
            level: "error"
        }), Error(`Plugin has a corrupt manifest file at ${$}. JSON parse error: ${j}`)
    } else if (K.existsSync(O)) try {
        let D = K.readFileSync(O, {
                encoding: "utf-8"
            }),
            j = _A(D),
            M = wA1.safeParse(j);
        if (M.success) _ = M.data;
        else {
            let P = M.error.issues.map((W) => `${W.path.join(".")}: ${W.message}`).join(", ");
            throw h(`Invalid legacy manifest at ${O}: ${P}`, {
                level: "error"
            }), Error(`Plugin has an invalid manifest file at ${O}. Validation errors: ${P}`)
        }
    } catch (D) {
        if (D instanceof Error && D.message.includes("invalid manifest file")) throw D;
        let j = D instanceof Error ? D.message : String(D);
        throw h(`Failed to parse legacy manifest at ${O}: ${j}`, {
            level: "error"
        }), Error(`Plugin has a corrupt manifest file at ${O}. JSON parse error: ${j}`)
    } else _ = q?.manifest || {
        name: z,
        description: `Plugin cached from ${typeof A==="string"?A:A.source}`
    };
    let J = _.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
        X = $9(Y, J);
    if (K.existsSync(X)) h(`Removing old cached version at ${X}`), K.rmSync(X, {
        recursive: !0,
        force: !0
    });
    return K.renameSync(w, X), h(`Successfully cached plugin ${_.name} to ${X}`), {
        path: X,
        manifest: _
    }
}
// @from(Ln 364118, Col 0)
function XG6(A, q, K) {
    let Y = b1();
    if (!Y.existsSync(A)) return {
        name: q,
        description: `Plugin from ${K}`
    };
    try {
        let z = Y.readFileSync(A, {
                encoding: "utf-8"
            }),
            w = _A(z),
            H = wA1.safeParse(w);
        if (H.success) return H.data;
        let $ = H.error.issues.map((O) => `${O.path.join(".")}: ${O.message}`).join(", ");
        throw h(`Plugin ${q} has an invalid manifest file at ${A}. Validation errors: ${$}`, {
            level: "error"
        }), Error(`Plugin ${q} has an invalid manifest file at ${A}.

Validation errors: ${$}

Please fix the manifest or remove it. The plugin cannot load with an invalid manifest.`)
    } catch (z) {
        if (z instanceof Error && z.message.includes("invalid manifest file")) throw z;
        let w = z instanceof Error ? z.message : String(z);
        throw h(`Plugin ${q} has a corrupt manifest file at ${A}. Parse error: ${w}`, {
            level: "error"
        }), Error(`Plugin ${q} has a corrupt manifest file at ${A}.

JSON parse error: ${w}

Please check the file for syntax errors.`)
    }
}
// @from(Ln 364152, Col 0)
function Xn4(A, q) {
    let K = b1();
    if (!K.existsSync(A)) throw Error(`Hooks file not found at ${A} for plugin ${q}. If the manifest declares hooks, the file must exist.`);
    let Y = K.readFileSync(A, {
            encoding: "utf-8"
        }),
        z = _A(Y);
    return cw8.parse(z).hooks
}
// @from(Ln 364162, Col 0)
function Pn4(A, q, K, Y, z = !0) {
    let w = b1(),
        H = [],
        $ = $9(A, ".claude-plugin", "plugin.json"),
        O = XG6($, Y, q),
        _ = {
            name: O.name,
            manifest: O,
            path: A,
            source: q,
            repository: q,
            enabled: K
        },
        J = $9(A, "commands");
    if (!O.commands && w.existsSync(J)) _.commandsPath = J;
    if (O.commands) {
        let G = Object.values(O.commands)[0];
        if (typeof O.commands === "object" && !Array.isArray(O.commands) && G && typeof G === "object" && (("source" in G) || ("content" in G))) {
            let f = {},
                Z = [];
            for (let [N, T] of Object.entries(O.commands)) {
                if (!T || typeof T !== "object") continue;
                if (T.source) {
                    let k = $9(A, T.source);
                    if (w.existsSync(k)) Z.push(k), f[N] = T;
                    else h(`Command ${N} path ${T.source} specified in manifest but not found at ${k} for ${O.name}`, {
                        level: "warn"
                    }), K1(Error(`Plugin component file not found: ${k} for ${O.name}`)), H.push({
                        type: "path-not-found",
                        source: q,
                        plugin: O.name,
                        path: k,
                        component: "commands"
                    })
                } else if (T.content) f[N] = T
            }
            if (Z.length > 0) _.commandsPaths = Z;
            if (Object.keys(f).length > 0) _.commandsMetadata = f
        } else {
            let f = Array.isArray(O.commands) ? O.commands : [O.commands],
                Z = [];
            for (let N of f) {
                if (typeof N !== "string") {
                    h(`Unexpected command format in manifest for ${O.name}`, {
                        level: "error"
                    });
                    continue
                }
                let T = $9(A, N);
                if (w.existsSync(T)) Z.push(T);
                else h(`Command path ${N} specified in manifest but not found at ${T} for ${O.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${T} for ${O.name}`)), H.push({
                    type: "path-not-found",
                    source: q,
                    plugin: O.name,
                    path: T,
                    component: "commands"
                })
            }
            if (Z.length > 0) _.commandsPaths = Z
        }
    }
    let X = $9(A, "agents");
    if (!O.agents && w.existsSync(X)) _.agentsPath = X;
    if (O.agents) {
        let G = Array.isArray(O.agents) ? O.agents : [O.agents],
            f = [];
        for (let Z of G) {
            let N = $9(A, Z);
            if (w.existsSync(N)) f.push(N);
            else h(`Agent path ${Z} specified in manifest but not found at ${N} for ${O.name}`, {
                level: "warn"
            }), K1(Error(`Plugin component file not found: ${N} for ${O.name}`)), H.push({
                type: "path-not-found",
                source: q,
                plugin: O.name,
                path: N,
                component: "agents"
            })
        }
        if (f.length > 0) _.agentsPaths = f
    }
    let D = $9(A, "skills");
    if (!O.skills && w.existsSync(D)) _.skillsPath = D;
    if (O.skills) {
        let G = Array.isArray(O.skills) ? O.skills : [O.skills],
            f = [];
        for (let Z of G) {
            let N = $9(A, Z);
            if (w.existsSync(N)) f.push(N);
            else h(`Skill path ${Z} specified in manifest but not found at ${N} for ${O.name}`, {
                level: "warn"
            }), K1(Error(`Plugin component file not found: ${N} for ${O.name}`)), H.push({
                type: "path-not-found",
                source: q,
                plugin: O.name,
                path: N,
                component: "skills"
            })
        }
        if (f.length > 0) _.skillsPaths = f
    }
    let j = $9(A, "output-styles");
    if (!O.outputStyles && w.existsSync(j)) _.outputStylesPath = j;
    if (O.outputStyles) {
        let G = Array.isArray(O.outputStyles) ? O.outputStyles : [O.outputStyles],
            f = [];
        for (let Z of G) {
            let N = $9(A, Z);
            if (w.existsSync(N)) f.push(N);
            else h(`Output style path ${Z} specified in manifest but not found at ${N} for ${O.name}`, {
                level: "warn"
            }), K1(Error(`Plugin component file not found: ${N} for ${O.name}`)), H.push({
                type: "path-not-found",
                source: q,
                plugin: O.name,
                path: N,
                component: "output-styles"
            })
        }
        if (f.length > 0) _.outputStylesPaths = f
    }
    let M, P = new Set,
        W = $9(A, "hooks", "hooks.json");
    if (w.existsSync(W)) try {
        M = Xn4(W, O.name);
        try {
            P.add(w.realpathSync(W))
        } catch {
            P.add(W)
        }
        h(`Loaded hooks from standard location for plugin ${O.name}: ${W}`)
    } catch (G) {
        let f = G instanceof Error ? G.message : String(G);
        h(`Failed to load hooks for ${O.name}: ${f}`, {
            level: "error"
        }), K1(G instanceof Error ? G : Error(f)), H.push({
            type: "hook-load-failed",
            source: q,
            plugin: O.name,
            hookPath: W,
            reason: f
        })
    }
    if (O.hooks) {
        let G = Array.isArray(O.hooks) ? O.hooks : [O.hooks];
        for (let f of G)
            if (typeof f === "string") {
                let Z = $9(A, f);
                if (!w.existsSync(Z)) {
                    h(`Hooks file ${f} specified in manifest but not found at ${Z} for ${O.name}`, {
                        level: "error"
                    }), K1(Error(`Plugin component file not found: ${Z} for ${O.name}`)), H.push({
                        type: "path-not-found",
                        source: q,
                        plugin: O.name,
                        path: Z,
                        component: "hooks"
                    });
                    continue
                }
                let N;
                try {
                    N = w.realpathSync(Z)
                } catch {
                    N = Z
                }
                if (P.has(N)) {
                    if (h(`Skipping duplicate hooks file for plugin ${O.name}: ${f} (resolves to already-loaded file: ${N})`), z) {
                        let T = `Duplicate hooks file detected: ${f} resolves to already-loaded file ${N}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
                        K1(Error(T)), H.push({
                            type: "hook-load-failed",
                            source: q,
                            plugin: O.name,
                            hookPath: Z,
                            reason: T
                        })
                    }
                    continue
                }
                try {
                    let T = Xn4(Z, O.name);
                    try {
                        M = Dn4(M, T), P.add(N), h(`Loaded and merged hooks from manifest for plugin ${O.name}: ${f}`)
                    } catch (k) {
                        let y = k instanceof Error ? k.message : String(k);
                        h(`Failed to merge hooks from ${f} for ${O.name}: ${y}`, {
                            level: "error"
                        }), K1(k instanceof Error ? k : Error(y)), H.push({
                            type: "hook-load-failed",
                            source: q,
                            plugin: O.name,
                            hookPath: Z,
                            reason: `Failed to merge: ${y}`
                        })
                    }
                } catch (T) {
                    let k = T instanceof Error ? T.message : String(T);
                    h(`Failed to load hooks from ${f} for ${O.name}: ${k}`, {
                        level: "error"
                    }), K1(T instanceof Error ? T : Error(k)), H.push({
                        type: "hook-load-failed",
                        source: q,
                        plugin: O.name,
                        hookPath: Z,
                        reason: k
                    })
                }
            } else if (typeof f === "object") M = Dn4(M, f)
    }
    if (M) _.hooksConfig = M;
    return {
        plugin: _,
        errors: H
    }
}
// @from(Ln 364380, Col 0)
function Dn4(A, q) {
    if (!A) return q;
    let K = {
        ...A
    };
    for (let [Y, z] of Object.entries(q))
        if (!K[Y]) K[Y] = z;
        else K[Y] = [...K[Y] || [], ...z];
    return K
}
// @from(Ln 364390, Col 0)
async function HxY() {
    let q = C8().enabledPlugins || {},
        K = [],
        Y = [],
        z = Object.entries(q).filter(([H, $]) => {
            return zA1.safeParse(H).success && $ !== void 0
        }),
        w = await n5();
    for (let [H, $] of z) try {
        let [O, _] = H.split("@"), J = w[_];
        if (J && !Fq1(J.source)) {
            let j = nb1(J.source),
                M = mq1() || [];
            Y.push({
                type: "marketplace-blocked-by-policy",
                source: H,
                plugin: O,
                marketplace: _,
                blockedByBlocklist: j,
                allowedSources: j ? [] : M.map((P) => o01(P))
            });
            continue
        }
        let X = yyA(H);
        if (!X) {
            Y.push({
                type: "plugin-not-found",
                source: H,
                pluginId: O,
                marketplace: _
            });
            continue
        }
        let D = await $xY(X.entry, X.marketplaceInstallLocation, H, $ === !0, Y);
        if (D) K.push(D)
    } catch (O) {
        let _ = O instanceof Error ? O : Error(String(O));
        K1(_), Y.push({
            type: "generic-error",
            source: H,
            error: _.message
        })
    }
    return {
        plugins: K,
        errors: Y
    }
}
// @from(Ln 364438, Col 0)
async function $xY(A, q, K, Y, z) {
    h(`Loading plugin ${A.name} from source: ${Q1(A.source)}`);
    let w = b1(),
        H = [],
        $;
    if (typeof A.source === "string") {
        let D = w.statSync(q).isDirectory() ? q : $9(q, ".."),
            j = $9(D, A.source);
        if (!w.existsSync(j)) {
            let M = Error(`Plugin path not found: ${j}`);
            return h(`Plugin path not found: ${j}`, {
                level: "error"
            }), K1(M), z.push({
                type: "generic-error",
                source: K,
                error: `Plugin directory not found at path: ${j}. Check that the marketplace entry has the correct path.`
            }), null
        }
        try {
            let M = $9(j, ".claude-plugin", "plugin.json"),
                P;
            try {
                P = XG6(M, A.name, A.source)
            } catch {}
            let W = await od(K, A.source, P, D, A.version);
            $ = await JG6(j, K, W, A, D), h(`Copied local plugin ${A.name} to versioned cache: ${$}`)
        } catch (M) {
            let P = M instanceof Error ? M.message : String(M);
            h(`Failed to copy plugin ${A.name} to versioned cache: ${P}. Using marketplace path.`, {
                level: "warn"
            }), $ = j
        }
    } else try {
        let D = await od(K, A.source, void 0, void 0, A.version),
            j = RB(K, D);
        if (w.existsSync(j)) h(`Using versioned cached plugin ${A.name} from ${j}`), $ = j;
        else {
            let M = await F51(A.source, {
                    manifest: {
                        name: A.name
                    }
                }),
                P = await od(K, A.source, M.manifest, M.path, A.version);
            if ($ = await JG6(M.path, K, P, A, void 0), M.path !== $) w.rmSync(M.path, {
                recursive: !0,
                force: !0
            })
        }
    } catch (D) {
        let j = D instanceof Error ? D.message : String(D);
        return h(`Failed to cache plugin ${A.name}: ${j}`, {
            level: "error"
        }), K1(D instanceof Error ? D : Error(j)), z.push({
            type: "generic-error",
            source: K,
            error: `Failed to download/cache plugin ${A.name}: ${j}`
        }), null
    }
    let O = $9($, ".claude-plugin", "plugin.json"),
        _ = w.existsSync(O),
        {
            plugin: J,
            errors: X
        } = Pn4($, K, Y, A.name, A.strict ?? !0);
    if (H.push(...X), typeof A.source === "object" && "sha" in A.source && A.source.sha) J.sha = A.source.sha;
    if (!_) {
        if (J.manifest = {
                ...A,
                id: void 0,
                source: void 0,
                strict: void 0
            }, J.name = J.manifest.name, A.commands) {
            let D = Object.values(A.commands)[0];
            if (typeof A.commands === "object" && !Array.isArray(A.commands) && D && typeof D === "object" && (("source" in D) || ("content" in D))) {
                let j = {},
                    M = [];
                for (let [P, W] of Object.entries(A.commands)) {
                    if (!W || typeof W !== "object" || !W.source) continue;
                    let G = $9($, W.source);
                    if (w.existsSync(G)) M.push(G), j[P] = W;
                    else h(`Command ${P} path ${W.source} from marketplace entry not found at ${G} for ${A.name}`, {
                        level: "warn"
                    }), K1(Error(`Plugin component file not found: ${G} for ${A.name}`)), H.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: G,
                        component: "commands"
                    })
                }
                if (M.length > 0) J.commandsPaths = M, J.commandsMetadata = j
            } else {
                let j = Array.isArray(A.commands) ? A.commands : [A.commands],
                    M = [];
                for (let P of j) {
                    if (typeof P !== "string") {
                        h(`Unexpected command format in marketplace entry for ${A.name}`, {
                            level: "error"
                        });
                        continue
                    }
                    let W = $9($, P);
                    if (w.existsSync(W)) M.push(W);
                    else h(`Command path ${P} from marketplace entry not found at ${W} for ${A.name}`, {
                        level: "warn"
                    }), K1(Error(`Plugin component file not found: ${W} for ${A.name}`)), H.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: W,
                        component: "commands"
                    })
                }
                if (M.length > 0) J.commandsPaths = M
            }
        }
        if (A.agents) {
            let D = Array.isArray(A.agents) ? A.agents : [A.agents],
                j = [];
            for (let M of D) {
                let P = $9($, M);
                if (w.existsSync(P)) j.push(P);
                else h(`Agent path ${M} from marketplace entry not found at ${P} for ${A.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${P} for ${A.name}`)), H.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: P,
                    component: "agents"
                })
            }
            if (j.length > 0) J.agentsPaths = j
        }
        if (A.skills) {
            h(`Processing ${Array.isArray(A.skills)?A.skills.length:1} skill paths for plugin ${A.name}`);
            let D = Array.isArray(A.skills) ? A.skills : [A.skills],
                j = [];
            for (let M of D) {
                let P = $9($, M);
                if (h(`Checking skill path: ${M} -> ${P} (exists: ${w.existsSync(P)})`), w.existsSync(P)) j.push(P);
                else h(`Skill path ${M} from marketplace entry not found at ${P} for ${A.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${P} for ${A.name}`)), H.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: P,
                    component: "skills"
                })
            }
            if (h(`Found ${j.length} valid skill paths for plugin ${A.name}, setting skillsPaths`), j.length > 0) J.skillsPaths = j
        } else h(`Plugin ${A.name} has no entry.skills defined`);
        if (A.outputStyles) {
            let D = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
                j = [];
            for (let M of D) {
                let P = $9($, M);
                if (w.existsSync(P)) j.push(P);
                else h(`Output style path ${M} from marketplace entry not found at ${P} for ${A.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${P} for ${A.name}`)), H.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: P,
                    component: "output-styles"
                })
            }
            if (j.length > 0) J.outputStylesPaths = j
        }
        if (A.hooks) J.hooksConfig = A.hooks
    } else if (!A.strict && _ && (A.commands || A.agents || A.skills || A.hooks || A.outputStyles)) {
        let D = Error(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
        return h(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`, {
            level: "error"
        }), K1(D), z.push({
            type: "generic-error",
            source: K,
            error: `Plugin ${A.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
        }), null
    } else if (_) {
        if (A.commands) {
            let D = Object.values(A.commands)[0];
            if (typeof A.commands === "object" && !Array.isArray(A.commands) && D && typeof D === "object" && (("source" in D) || ("content" in D))) {
                let j = {
                        ...J.commandsMetadata || {}
                    },
                    M = [];
                for (let [P, W] of Object.entries(A.commands)) {
                    if (!W || typeof W !== "object" || !W.source) continue;
                    let G = $9($, W.source);
                    if (w.existsSync(G)) M.push(G), j[P] = W;
                    else h(`Command ${P} path ${W.source} from marketplace entry not found at ${G} for ${A.name}`, {
                        level: "warn"
                    }), K1(Error(`Plugin component file not found: ${G} for ${A.name}`)), H.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: G,
                        component: "commands"
                    })
                }
                if (M.length > 0) J.commandsPaths = [...J.commandsPaths || [], ...M], J.commandsMetadata = j
            } else {
                let j = Array.isArray(A.commands) ? A.commands : [A.commands],
                    M = [];
                for (let P of j) {
                    if (typeof P !== "string") {
                        h(`Unexpected command format in marketplace entry for ${A.name}`, {
                            level: "error"
                        });
                        continue
                    }
                    let W = $9($, P);
                    if (w.existsSync(W)) M.push(W);
                    else h(`Command path ${P} from marketplace entry not found at ${W} for ${A.name}`, {
                        level: "warn"
                    }), K1(Error(`Plugin component file not found: ${W} for ${A.name}`)), H.push({
                        type: "path-not-found",
                        source: K,
                        plugin: A.name,
                        path: W,
                        component: "commands"
                    })
                }
                if (M.length > 0) J.commandsPaths = [...J.commandsPaths || [], ...M]
            }
        }
        if (A.agents) {
            let D = Array.isArray(A.agents) ? A.agents : [A.agents],
                j = [];
            for (let M of D) {
                let P = $9($, M);
                if (w.existsSync(P)) j.push(P);
                else h(`Agent path ${M} from marketplace entry not found at ${P} for ${A.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${P} for ${A.name}`)), H.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: P,
                    component: "agents"
                })
            }
            if (j.length > 0) J.agentsPaths = [...J.agentsPaths || [], ...j]
        }
        if (A.skills) {
            let D = Array.isArray(A.skills) ? A.skills : [A.skills],
                j = [];
            for (let M of D) {
                let P = $9($, M);
                if (w.existsSync(P)) j.push(P);
                else h(`Skill path ${M} from marketplace entry not found at ${P} for ${A.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${P} for ${A.name}`)), H.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: P,
                    component: "skills"
                })
            }
            if (j.length > 0) J.skillsPaths = [...J.skillsPaths || [], ...j]
        }
        if (A.outputStyles) {
            let D = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
                j = [];
            for (let M of D) {
                let P = $9($, M);
                if (w.existsSync(P)) j.push(P);
                else h(`Output style path ${M} from marketplace entry not found at ${P} for ${A.name}`, {
                    level: "warn"
                }), K1(Error(`Plugin component file not found: ${P} for ${A.name}`)), H.push({
                    type: "path-not-found",
                    source: K,
                    plugin: A.name,
                    path: P,
                    component: "output-styles"
                })
            }
            if (j.length > 0) J.outputStylesPaths = [...J.outputStylesPaths || [], ...j]
        }
        if (A.hooks) J.hooksConfig = {
            ...J.hooksConfig || {},
            ...A.hooks
        }
    }
    return z.push(...H), J
}
// @from(Ln 364728, Col 0)
async function OxY(A) {
    if (A.length === 0) return {
        plugins: [],
        errors: []
    };
    let q = [],
        K = [],
        Y = b1();
    for (let [z, w] of A.entries()) try {
        let H = tIY(w);
        if (!Y.existsSync(H)) {
            h(`Plugin path does not exist: ${H}, skipping`, {
                level: "warn"
            }), K.push({
                type: "path-not-found",
                source: `inline[${z}]`,
                path: H,
                component: "commands"
            });
            continue
        }
        let $ = eIY(H),
            {
                plugin: O,
                errors: _
            } = Pn4(H, `${$}@inline`, !0, $);
        O.source = `${O.name}@inline`, O.repository = `${O.name}@inline`, q.push(O), K.push(..._), h(`Loaded inline plugin from path: ${O.name}`)
    } catch (H) {
        let $ = H instanceof Error ? H.message : String(H);
        h(`Failed to load session plugin from ${w}: ${$}`, {
            level: "warn"
        }), K.push({
            type: "generic-error",
            source: `inline[${z}]`,
            error: `Failed to load plugin: ${$}`
        })
    }
    if (q.length > 0) h(`Loaded ${q.length} session-only plugins from --plugin-dir`);
    return {
        plugins: q,
        errors: K
    }
}
// @from(Ln 364772, Col 0)
function Sv() {
    iY.cache?.clear?.()
}
// @from(Ln 364775, Col 4)
iY
// @from(Ln 364776, Col 4)
VJ = v(() => {
    zq();
    _8();
    B6();
    N0();
    Z6();
    y6();
    p8();
    p$();
    Xa();
    tq();
    hA();
    lb1();
    _G6();
    v3();
    ad();
    m6();
    h9();
    iY = KA(async () => {
        let A = await HxY(),
            q = [...A.plugins],
            K = [...A.errors],
            Y = $61();
        if (Y.length > 0) {
            let w = await OxY(Y);
            q.push(...w.plugins), K.push(...w.errors)
        }
        h(`Found ${q.length} plugins (${q.filter((w)=>w.enabled).length} enabled, ${q.filter((w)=>!w.enabled).length} disabled)`);
        let z = q.filter((w) => w.enabled);
        if (z.length > 0) u8("plugins");
        return {
            enabled: z,
            disabled: q.filter((w) => !w.enabled),
            errors: K
        }
    })
})
// @from(Ln 364829, Col 0)
function Zn4() {
    let A = eA(),
        q = xyA(),
        K = [];
    for (let Y of DG6) {
        let z = mg1[Y],
            w;
        switch (A) {
            case "macos":
                w = z.macos.dataPath;
                break;
            case "linux":
            case "wsl":
                w = z.linux.dataPath;
                break;
            case "windows": {
                if (z.windows.dataPath.length > 0) {
                    let H = z.windows.useRoaming ? Ay(q, "AppData", "Roaming") : Ay(q, "AppData", "Local");
                    K.push({
                        browser: Y,
                        path: Ay(H, ...z.windows.dataPath)
                    })
                }
                continue
            }
        }
        if (w && w.length > 0) K.push({
            browser: Y,
            path: Ay(q, ...w)
        })
    }
    return K
}
// @from(Ln 364863, Col 0)
function fn4() {
    let A = eA(),
        q = xyA(),
        K = [];
    for (let Y of DG6) {
        let z = mg1[Y];
        switch (A) {
            case "macos":
                if (z.macos.nativeMessagingPath.length > 0) K.push({
                    browser: Y,
                    path: Ay(q, ...z.macos.nativeMessagingPath)
                });
                break;
            case "linux":
            case "wsl":
                if (z.linux.nativeMessagingPath.length > 0) K.push({
                    browser: Y,
                    path: Ay(q, ...z.linux.nativeMessagingPath)
                });
                break;
            case "windows":
                break
        }
    }
    return K
}
// @from(Ln 364890, Col 0)
function Vn4() {
    let A = [];
    for (let q of DG6) {
        let K = mg1[q];
        if (K.windows.registryKey) A.push({
            browser: q,
            key: K.windows.registryKey
        })
    }
    return A
}
// @from(Ln 364901, Col 0)
async function DxY() {
    let A = eA();
    for (let q of DG6) {
        let K = mg1[q];
        switch (A) {
            case "macos": {
                let Y = `/Applications/${K.macos.appName}.app`;
                try {
                    return await Wn4(Y), h(`[Claude in Chrome] Detected browser: ${K.name}`), q
                } catch {}
                break
            }
            case "linux": {
                for (let Y of K.linux.binaries)
                    if (await mf(Y).catch(() => null)) return h(`[Claude in Chrome] Detected browser: ${K.name}`), q;
                break
            }
            case "windows": {
                let Y = xyA();
                if (K.windows.dataPath.length > 0) {
                    let z = K.windows.useRoaming ? Ay(Y, "AppData", "Roaming") : Ay(Y, "AppData", "Local"),
                        w = Ay(z, ...K.windows.dataPath);
                    try {
                        return await Wn4(w), h(`[Claude in Chrome] Detected browser: ${K.name}`), q
                    } catch {}
                }
                break
            }
        }
    }
    return null
}
// @from(Ln 364934, Col 0)
function KG1(A) {
    return P5(A) === qy
}
// @from(Ln 364938, Col 0)
function Nn4(A) {
    jxY.add(A)
}
// @from(Ln 364941, Col 0)
async function jG6(A) {
    let q = eA(),
        K = await DxY();
    if (!K) return h("[Claude in Chrome] No compatible browser found"), !1;
    let Y = mg1[K];
    switch (q) {
        case "macos": {
            let {
                code: z
            } = await IA("open", ["-a", Y.macos.appName, A]);
            return z === 0
        }
        case "windows": {
            let {
                code: z
            } = await IA("rundll32", ["url,OpenURL", A]);
            return z === 0
        }
        case "linux": {
            for (let z of Y.linux.binaries) {
                let {
                    code: w
                } = await IA(z, [A]);
                if (w === 0) return !0
            }
            return !1
        }
        default:
            return !1
    }
}
// @from(Ln 364973, Col 0)
function Fg1() {
    return `/tmp/claude-mcp-browser-bridge-${byA()}`
}
// @from(Ln 364977, Col 0)
function MG6() {
    if (Gn4() === "win32") return `\\\\.\\pipe\\${vn4()}`;
    return Ay(Fg1(), `${process.pid}.sock`)
}
// @from(Ln 364982, Col 0)
function Tn4() {
    if (Gn4() === "win32") return [`\\\\.\\pipe\\${vn4()}`];
    let A = [],
        q = Fg1();
    try {
        let w = XxY(q);
        for (let H of w)
            if (H.endsWith(".sock")) A.push(Ay(q, H))
    } catch {}
    let K = `claude-mcp-browser-bridge-${byA()}`,
        Y = Ay(_xY(), K),
        z = `/tmp/${K}`;
    if (!A.includes(Y)) A.push(Y);
    if (Y !== z && !A.includes(z)) A.push(z);
    return A
}
// @from(Ln 364999, Col 0)
function vn4() {
    return `claude-mcp-browser-bridge-${byA()}`
}
// @from(Ln 365003, Col 0)
function byA() {
    try {
        return JxY().username || "default"
    } catch {
        return process.env.USER || process.env.USERNAME || "default"
    }
}
// @from(Ln 365010, Col 4)
qy = "claude-in-chrome"
// @from(Ln 365011, Col 4)
mg1
// @from(Ln 365011, Col 9)
DG6
// @from(Ln 365011, Col 14)
jxY
// @from(Ln 365012, Col 4)
kI = v(() => {
    x3();
    tq();
    Z6();
    WQ();
    mg1 = {
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
    }, DG6 = ["chrome", "brave", "arc", "edge", "chromium", "vivaldi", "opera"];
    jxY = new Set
})
// @from(Ln 365142, Col 0)
function En4() {
    Qg1.cache.clear?.()
}
// @from(Ln 365145, Col 4)
MxY = "tengu_claudeai_mcp_connectors"
// @from(Ln 365146, Col 4)
PxY = 5000
// @from(Ln 365147, Col 4)
WxY = "mcp-servers-2025-12-04"
// @from(Ln 365148, Col 4)
Qg1
// @from(Ln 365149, Col 4)
uyA = v(() => {
    zq();
    y5();
    Uz();
    u6();
    J7();
    Z6();
    hA();
    U4();
    Qg1 = KA(async () => {
        try {
            h("[claudeai-mcp] Checking gate (cached)...");
            let A = i2(MxY);
            if (h(`[claudeai-mcp] Gate returned: ${A}`), !A) return h("[claudeai-mcp] Disabled via gate"), c("tengu_claudeai_mcp_eligibility", {
                state: "disabled_gate"
            }), {};
            if (FY(void 0)) return h("[claudeai-mcp] Disabled via env var"), c("tengu_claudeai_mcp_eligibility", {
                state: "disabled_env_var"
            }), {};
            let q = a4();
            if (!q?.accessToken) return h("[claudeai-mcp] No access token"), c("tengu_claudeai_mcp_eligibility", {
                state: "no_oauth_token"
            }), {};
            if (!q.scopes?.includes("user:mcp_servers")) return h(`[claudeai-mcp] Missing user:mcp_servers scope (scopes=${q.scopes?.join(",")||"none"})`), c("tengu_claudeai_mcp_eligibility", {
                state: "missing_scope"
            }), {};
            let Y = `${P4().BASE_API_URL}/v1/mcp_servers?limit=1000`;
            h(`[claudeai-mcp] Fetching from ${Y}`);
            let z = await sA.get(Y, {
                    headers: {
                        Authorization: `Bearer ${q.accessToken}`,
                        "Content-Type": "application/json",
                        "anthropic-beta": WxY,
                        "anthropic-version": "2023-06-01"
                    },
                    timeout: PxY
                }),
                w = {},
                H = new Set;
            for (let $ of z.data.data) {
                let O = `claude.ai ${$.display_name}`,
                    _ = O,
                    J = P5(_),
                    X = 1;
                while (H.has(J)) X++, _ = `${O} (${X})`, J = P5(_);
                H.add(J), w[_] = {
                    type: "claudeai-proxy",
                    url: $.url,
                    id: $.id,
                    scope: "claudeai"
                }
            }
            return h(`[claudeai-mcp] Fetched ${Object.keys(w).length} servers`), c("tengu_claudeai_mcp_eligibility", {
                state: "eligible"
            }), w
        } catch {
            return h("[claudeai-mcp] Fetch failed"), {}
        }
    })
})
// @from(Ln 365215, Col 0)
function WG6() {
    return PG6(df(), "managed-mcp.json")
}
// @from(Ln 365219, Col 0)
function gg1(A, q) {
    if (!A) return {};
    let K = {};
    for (let [Y, z] of Object.entries(A)) K[Y] = {
        ...z,
        scope: q
    };
    return K
}
// @from(Ln 365229, Col 0)
function kn4(A) {
    let q = PG6(h6(), ".mcp.json");
    ek(q, Q1(A, null, 2), {
        encoding: "utf8"
    })
}
// @from(Ln 365236, Col 0)
function Ln4(A) {
    if (A.type !== void 0 && A.type !== "stdio") return null;
    let q = A;
    return [q.command, ...q.args]
}
// @from(Ln 365242, Col 0)
function Rn4(A, q) {
    if (A.length !== q.length) return !1;
    return A.every((K, Y) => K === q[Y])
}
// @from(Ln 365247, Col 0)
function yn4(A) {
    return "url" in A ? A.url : null
}
// @from(Ln 365251, Col 0)
function fxY(A) {
    let K = A.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${K}$`)
}
// @from(Ln 365256, Col 0)
function Cn4(A, q) {
    return fxY(q).test(A)
}
// @from(Ln 365260, Col 0)
function Sn4(A, q) {
    let K = l4();
    if (!K.deniedMcpServers) return !1;
    for (let Y of K.deniedMcpServers)
        if (qH1(Y) && Y.serverName === A) return !0;
    if (q) {
        let Y = Ln4(q);
        if (Y) {
            for (let w of K.deniedMcpServers)
                if (ys1(w) && Rn4(w.serverCommand, Y)) return !0
        }
        let z = yn4(q);
        if (z) {
            for (let w of K.deniedMcpServers)
                if (Cs1(w) && Cn4(z, w.serverUrl)) return !0
        }
    }
    return !1
}
// @from(Ln 365280, Col 0)
function ByA(A, q) {
    if (Sn4(A, q)) return !1;
    let K = l4();
    if (!K.allowedMcpServers) return !0;
    if (K.allowedMcpServers.length === 0) return !1;
    let Y = K.allowedMcpServers.some(ys1),
        z = K.allowedMcpServers.some(Cs1);
    if (q) {
        let w = Ln4(q),
            H = yn4(q);
        if (w)
            if (Y) {
                for (let $ of K.allowedMcpServers)
                    if (ys1($) && Rn4($.serverCommand, w)) return !0;
                return !1
            } else {
                for (let $ of K.allowedMcpServers)
                    if (qH1($) && $.serverName === A) return !0;
                return !1
            }
        else if (H)
            if (z) {
                for (let $ of K.allowedMcpServers)
                    if (Cs1($) && Cn4(H, $.serverUrl)) return !0;
                return !1
            } else {
                for (let $ of K.allowedMcpServers)
                    if (qH1($) && $.serverName === A) return !0;
                return !1
            }
        else {
            for (let $ of K.allowedMcpServers)
                if (qH1($) && $.serverName === A) return !0;
            return !1
        }
    }
    for (let w of K.allowedMcpServers)
        if (qH1(w) && w.serverName === A) return !0;
    return !1
}
// @from(Ln 365321, Col 0)
function VxY(A) {
    let q = [];

    function K(z) {
        let {
            expanded: w,
            missingVars: H
        } = i01(z);
        return q.push(...H), w
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
                env: z.env ? G61(z.env, K) : void 0
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
                headers: z.headers ? G61(z.headers, K) : void 0
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
// @from(Ln 365372, Col 0)
function ht(A, q, K) {
    if (A.match(/[^a-zA-Z0-9_-]/)) throw Error(`Invalid name ${A}. Names can only contain letters, numbers, hyphens, and underscores.`);
    if (KG1(A)) throw Error(`Cannot add MCP server "${A}": this name is reserved.`);
    if (pg1()) throw Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
    let Y = sx.safeParse(q);
    if (!Y.success) {
        let w = Y.error.issues.map((H) => `${H.path.join(".")}: ${H.message}`).join(", ");
        throw Error(`Invalid configuration: ${w}`)
    }
    let z = Y.data;
    if (Sn4(A, z)) throw Error(`Cannot add MCP server "${A}": server is explicitly blocked by enterprise policy`);
    if (!ByA(A, z)) throw Error(`Cannot add MCP server "${A}": not allowed by enterprise policy`);
    switch (K) {
        case "project": {
            let {
                servers: w
            } = myA();
            if (w[A]) throw Error(`MCP server ${A} already exists in .mcp.json`);
            break
        }
        case "user": {
            if (f6().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in user config`);
            break
        }
        case "local": {
            if (sz().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in local config`);
            break
        }
        case "dynamic":
            throw Error("Cannot add MCP server to scope: dynamic");
        case "enterprise":
            throw Error("Cannot add MCP server to scope: enterprise");
        case "claudeai":
            throw Error("Cannot add MCP server to scope: claudeai")
    }
    switch (K) {
        case "project": {
            let {
                servers: w
            } = myA(), H = {};
            for (let [O, _] of Object.entries(w)) {
                let {
                    scope: J,
                    ...X
                } = _;
                H[O] = X
            }
            H[A] = z;
            let $ = {
                mcpServers: H
            };
            try {
                kn4($)
            } catch (O) {
                throw Error(`Failed to write to .mcp.json: ${O}`)
            }
            break
        }
        case "user": {
            jA((w) => ({
                ...w,
                mcpServers: {
                    ...w.mcpServers,
                    [A]: z
                }
            }));
            break
        }
        case "local": {
            iH((w) => ({
                ...w,
                mcpServers: {
                    ...w.mcpServers,
                    [A]: z
                }
            }));
            break
        }
        default:
            throw Error(`Cannot add MCP server to scope: ${K}`)
    }
}
// @from(Ln 365455, Col 0)
function FyA(A, q) {
    switch (q) {
        case "project": {
            let {
                servers: K
            } = myA();
            if (!K[A]) throw Error(`No MCP server found with name: ${A} in .mcp.json`);
            let Y = {};
            for (let [w, H] of Object.entries(K))
                if (w !== A) {
                    let {
                        scope: $,
                        ...O
                    } = H;
                    Y[w] = O
                } let z = {
                mcpServers: Y
            };
            try {
                kn4(z)
            } catch (w) {
                throw Error(`Failed to remove from .mcp.json: ${w}`)
            }
            break
        }
        case "user": {
            if (!f6().mcpServers?.[A]) throw Error(`No user-scoped MCP server found with name: ${A}`);
            jA((Y) => {
                let {
                    [A]: z, ...w
                } = Y.mcpServers ?? {};
                return {
                    ...Y,
                    mcpServers: w
                }
            });
            break
        }
        case "local": {
            if (!sz().mcpServers?.[A]) throw Error(`No project-local MCP server found with name: ${A}`);
            iH((Y) => {
                let {
                    [A]: z, ...w
                } = Y.mcpServers ?? {};
                return {
                    ...Y,
                    mcpServers: w
                }
            });
            break
        }
        default:
            throw Error(`Cannot remove MCP server from scope: ${q}`)
    }
}
// @from(Ln 365511, Col 0)
function myA() {
    if (!qX("projectSettings")) return {
        servers: {},
        errors: []
    };
    let A = b1(),
        q = PG6(h6(), ".mcp.json");
    if (!A.existsSync(q)) return {
        servers: {},
        errors: []
    };
    let {
        config: K,
        errors: Y
    } = YG1({
        filePath: q,
        expandVars: !0,
        scope: "project"
    });
    return {
        servers: K?.mcpServers ? gg1(K.mcpServers, "project") : {},
        errors: Y || []
    }
}
// @from(Ln 365536, Col 0)
function xJ(A) {
    let q = {
        project: "projectSettings",
        user: "userSettings",
        local: "localSettings"
    };
    if (A in q && !qX(q[A])) return {
        servers: {},
        errors: []
    };
    switch (A) {
        case "project": {
            let K = b1(),
                Y = {},
                z = [],
                w = [],
                H = h6();
            while (H !== ZxY(H).root) w.push(H), H = GxY(H);
            for (let $ of w.reverse()) {
                let O = PG6($, ".mcp.json");
                if (!K.existsSync(O)) continue;
                let {
                    config: _,
                    errors: J
                } = YG1({
                    filePath: O,
                    expandVars: !0,
                    scope: "project"
                });
                if (_?.mcpServers) Object.assign(Y, gg1(_.mcpServers, A));
                if (J.length > 0) z.push(...J)
            }
            return {
                servers: Y,
                errors: z
            }
        }
        case "user": {
            let K = f6().mcpServers;
            if (!K) return {
                servers: {},
                errors: []
            };
            let {
                config: Y,
                errors: z
            } = Ug1({
                configObject: {
                    mcpServers: K
                },
                expandVars: !0,
                scope: "user"
            });
            return {
                servers: gg1(Y?.mcpServers, A),
                errors: z
            }
        }
        case "local": {
            let K = sz().mcpServers;
            if (!K) return {
                servers: {},
                errors: []
            };
            let {
                config: Y,
                errors: z
            } = Ug1({
                configObject: {
                    mcpServers: K
                },
                expandVars: !0,
                scope: "local"
            });
            return {
                servers: gg1(Y?.mcpServers, A),
                errors: z
            }
        }
        case "enterprise": {
            let K = WG6();
            if (!b1().existsSync(K)) return {
                servers: {},
                errors: []
            };
            let {
                config: z,
                errors: w
            } = YG1({
                filePath: K,
                expandVars: !0,
                scope: "enterprise"
            });
            return {
                servers: gg1(z?.mcpServers, A),
                errors: w
            }
        }
    }
}
// @from(Ln 365637, Col 0)
function lR(A) {
    let {
        servers: q
    } = xJ("enterprise"), {
        servers: K
    } = xJ("user"), {
        servers: Y
    } = xJ("project"), {
        servers: z
    } = xJ("local");
    if (q[A]) return q[A];
    if (z[A]) return z[A];
    if (Y[A]) return Y[A];
    if (K[A]) return K[A];
    return null
}
// @from(Ln 365653, Col 0)
async function zG1() {
    let {
        servers: A
    } = xJ("enterprise");
    if (pg1()) {
        let J = {};
        for (let [X, D] of Object.entries(A)) {
            if (!ByA(X, D)) continue;
            J[X] = D
        }
        return {
            servers: J,
            errors: []
        }
    }
    let {
        servers: q
    } = xJ("user"), {
        servers: K
    } = xJ("project"), {
        servers: Y
    } = xJ("local"), z = {}, w = await iY(), H = [];
    if (w.errors.length > 0)
        for (let J of w.errors)
            if (J.type === "mcp-config-invalid" || J.type === "mcpb-download-failed" || J.type === "mcpb-extract-failed" || J.type === "mcpb-invalid-manifest") {
                let X = `Plugin MCP loading error - ${J.type}: ${TZ(J)}`;
                K1(Error(X))
            } else {
                let X = J.type;
                h(`Plugin not available for MCP: ${J.source} - error type: ${X}`)
            } for (let J of w.enabled) {
        let X = await VU7(J, H);
        if (X) Object.assign(z, X)
    }
    if (H.length > 0)
        for (let J of H) {
            let X = `Plugin MCP server error - ${J.type}: ${TZ(J)}`;
            K1(Error(X))
        }
    let $ = {};
    for (let [J, X] of Object.entries(K))
        if (GG6(J) === "approved") $[J] = X;
    let O = Object.assign({}, z, q, $, Y),
        _ = {};
    for (let [J, X] of Object.entries(O)) {
        if (!ByA(J, X)) continue;
        _[J] = X
    }
    return {
        servers: _,
        errors: H
    }
}
// @from(Ln 365706, Col 0)
async function um() {
    let {
        servers: A,
        errors: q
    } = await zG1();
    if (pg1()) return {
        servers: A,
        errors: q
    };
    let K = await Qg1();
    return {
        servers: Object.assign({}, K, A),
        errors: q
    }
}
// @from(Ln 365722, Col 0)
function Ug1(A) {
    let {
        configObject: q,
        expandVars: K,
        scope: Y,
        filePath: z
    } = A, w = Fw8.safeParse(q);
    if (!w.success) return {
        config: null,
        errors: w.error.issues.map((O) => ({
            ...z && {
                file: z
            },
            path: O.path.join("."),
            message: "Does not adhere to MCP server configuration schema",
            mcpErrorMetadata: {
                scope: Y,
                severity: "fatal"
            }
        }))
    };
    let H = [],
        $ = {};
    for (let [O, _] of Object.entries(w.data.mcpServers)) {
        let J = _;
        if (K) {
            let {
                expanded: X,
                missingVars: D
            } = VxY(_);
            if (D.length > 0) H.push({
                ...z && {
                    file: z
                },
                path: `mcpServers.${O}`,
                message: `Missing environment variables: ${D.join(", ")}`,
                suggestion: `Set the following environment variables: ${D.join(", ")}`,
                mcpErrorMetadata: {
                    scope: Y,
                    serverName: O,
                    severity: "warning"
                }
            });
            J = X
        }
        if (eA() === "windows" && (!J.type || J.type === "stdio") && (J.command === "npx" || J.command.endsWith("\\npx") || J.command.endsWith("/npx"))) H.push({
            ...z && {
                file: z
            },
            path: `mcpServers.${O}`,
            message: "Windows requires 'cmd /c' wrapper to execute npx",
            suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]. See: https://code.claude.com/docs/en/mcp#configure-mcp-servers',
            mcpErrorMetadata: {
                scope: Y,
                serverName: O,
                severity: "warning"
            }
        });
        $[O] = J
    }
    return {
        config: {
            mcpServers: $
        },
        errors: H
    }
}
// @from(Ln 365790, Col 0)
function YG1(A) {
    let {
        filePath: q,
        expandVars: K,
        scope: Y
    } = A, z = b1();
    if (!z.existsSync(q)) return {
        config: null,
        errors: [{
            file: q,
            path: "",
            message: `MCP config file not found: ${q}`,
            suggestion: "Check that the file path is correct",
            mcpErrorMetadata: {
                scope: Y,
                severity: "fatal"
            }
        }]
    };
    let w;
    try {
        w = z.readFileSync(q, {
            encoding: "utf8"
        })
    } catch ($) {
        return {
            config: null,
            errors: [{
                file: q,
                path: "",
                message: `Failed to read file: ${$}`,
                suggestion: "Check file permissions and ensure the file exists",
                mcpErrorMetadata: {
                    scope: Y,
                    severity: "fatal"
                }
            }]
        }
    }
    let H = j9(w);
    if (!H) return {
        config: null,
        errors: [{
            file: q,
            path: "",
            message: "MCP config is not a valid JSON",
            suggestion: "Fix the JSON syntax errors in the file",
            mcpErrorMetadata: {
                scope: Y,
                severity: "fatal"
            }
        }]
    };
    return Ug1({
        configObject: H,
        expandVars: K,
        scope: Y,
        filePath: q
    })
}
// @from(Ln 365851, Col 0)
function pg1() {
    let {
        config: A
    } = YG1({
        filePath: WG6(),
        expandVars: !0,
        scope: "enterprise"
    });
    return A !== null
}
// @from(Ln 365862, Col 0)
function hn4(A) {
    return Object.values(A).every((q) => q.type === "sdk" && q.name === "claude-vscode")
}
// @from(Ln 365866, Col 0)
function dg1(A) {
    return (sz().disabledMcpServers || []).includes(A)
}
// @from(Ln 365870, Col 0)
function wG1(A, q) {
    iH((K) => {
        let Y = K.disabledMcpServers || [];
        if (q) Y = Y.filter((z) => z !== A);
        else if (!Y.includes(A)) Y = [...Y, A];
        return {
            ...K,
            disabledMcpServers: Y
        }
    })
}
// @from(Ln 365881, Col 4)
nW = v(() => {
    cA();
    _8();
    AH();
    rn1();
    N7();
    wq();
    YA1();
    tX();
    x3();
    $A1();
    p8();
    hQ();
    E$();
    y6();
    Z6();
    VJ();
    kI();
    UO6();
    uyA();
    m6()
})
// @from(Ln 365907, Col 0)
function Bm(A, q) {
    let K = `mcp__${P5(q)}__`;
    return A.filter((Y) => Y.name?.startsWith(K))
}
// @from(Ln 365912, Col 0)
function ZG6(A, q) {
    let K = `mcp__${P5(q)}__`;
    return A.filter((Y) => Y.name?.startsWith(K))
}
// @from(Ln 365917, Col 0)
function QyA(A, q) {
    let K = `mcp__${P5(q)}__`;
    return A.filter((Y) => !Y.name?.startsWith(K))
}
// @from(Ln 365922, Col 0)
function gyA(A, q) {
    let K = `mcp__${P5(q)}__`;
    return A.filter((Y) => !Y.name?.startsWith(K))
}
// @from(Ln 365927, Col 0)
function UyA(A, q) {
    let K = {
        ...A
    };
    return delete K[q], K
}
// @from(Ln 365934, Col 0)
function In4(A, q) {
    return VD(A)?.serverName === q
}
// @from(Ln 365938, Col 0)
function $E(A) {
    return A.name?.startsWith("mcp__") || A.isMcp === !0
}
// @from(Ln 365942, Col 0)
function KG(A) {
    let q = b1();
    switch (A) {
        case "user": {
            let K = ij(),
                Y = q.existsSync(K);
            return `${K}${Y?"":" (file does not exist)"}`
        }
        case "project": {
            let K = NxY(h6(), ".mcp.json"),
                Y = q.existsSync(K);
            return `${K}${Y?"":" (file does not exist)"}`
        }
        case "local":
            return `${ij()} [project: ${h6()}]`;
        case "dynamic":
            return "Dynamically configured";
        case "enterprise": {
            let K = WG6(),
                Y = q.existsSync(K);
            return `${K}${Y?"":" (file does not exist)"}`
        }
        case "claudeai":
            return "claude.ai";
        default:
            return A
    }
}
// @from(Ln 365971, Col 0)
function cg1(A) {
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
// @from(Ln 365990, Col 0)
function HG1(A) {
    if (!A) return "local";
    if (!KF6.options.includes(A)) throw Error(`Invalid scope: ${A}. Must be one of: ${KF6.options.join(", ")}`);
    return A
}
// @from(Ln 365996, Col 0)
function xn4(A) {
    if (!A) return "stdio";
    if (A !== "stdio" && A !== "sse" && A !== "http") throw Error(`Invalid transport type: ${A}. Must be one of: stdio, sse, http`);
    return A
}
// @from(Ln 366002, Col 0)
function pyA(A) {
    let q = {};
    for (let K of A) {
        let Y = K.indexOf(":");
        if (Y === -1) throw Error(`Invalid header format: "${K}". Expected format: "Header-Name: value"`);
        let z = K.substring(0, Y).trim(),
            w = K.substring(Y + 1).trim();
        if (!z) throw Error(`Invalid header: "${K}". Header name cannot be empty.`);
        q[z] = w
    }
    return q
}
// @from(Ln 366015, Col 0)
function GG6(A) {
    let q = C8(),
        K = P5(A);
    if (q?.disabledMcpjsonServers?.some((Y) => P5(Y) === K)) return "rejected";
    if (q?.enabledMcpjsonServers?.some((Y) => P5(Y) === K) || q?.enableAllProjectMcpServers) return "approved";
    if (f6().bypassPermissionsModeAccepted && qX("projectSettings")) return "approved";
    if (w4() && qX("projectSettings")) return "approved";
    return "pending"
}
// @from(Ln 366025, Col 0)
function dyA(A) {
    if (!$E({
            name: A
        })) return null;
    let q = VD(A);
    if (!q) return null;
    let K = lR(q.serverName);
    if (!K && q.serverName.startsWith("claude_ai_")) return "claudeai";
    return K?.scope ?? null
}
// @from(Ln 366036, Col 0)
function TxY(A) {
    return A.type === "stdio" || A.type === void 0
}
// @from(Ln 366040, Col 0)
function vxY(A) {
    return A.type === "sse"
}
// @from(Ln 366044, Col 0)
function ExY(A) {
    return A.type === "http"
}
// @from(Ln 366048, Col 0)
function kxY(A) {
    return A.type === "ws"
}
// @from(Ln 366052, Col 0)
function bn4(A) {
    let q = new Map;
    for (let Y of A) {
        if (!Y.mcpServers?.length) continue;
        for (let z of Y.mcpServers) {
            if (typeof z === "string") continue;
            let w = Object.entries(z);
            if (w.length !== 1) continue;
            let [H, $] = w[0], O = q.get(H);
            if (O) {
                if (!O.sourceAgents.includes(Y.agentType)) O.sourceAgents.push(Y.agentType)
            } else q.set(H, {
                config: {
                    ...$,
                    name: H
                },
                sourceAgents: [Y.agentType]
            })
        }
    }
    let K = [];
    for (let [Y, {
            config: z,
            sourceAgents: w
        }] of q)
        if (TxY(z)) K.push({
            name: Y,
            sourceAgents: w,
            transport: "stdio",
            command: z.command,
            needsAuth: !1
        });
        else if (vxY(z)) K.push({
        name: Y,
        sourceAgents: w,
        transport: "sse",
        url: z.url,
        needsAuth: !0
    });
    else if (ExY(z)) K.push({
        name: Y,
        sourceAgents: w,
        transport: "http",
        url: z.url,
        needsAuth: !0
    });
    else if (kxY(z)) K.push({
        name: Y,
        sourceAgents: w,
        transport: "ws",
        url: z.url,
        needsAuth: !1
    });
    return K.sort((Y, z) => Y.name.localeCompare(z.name))
}
// @from(Ln 366108, Col 0)
function U_(A) {
    if (!("url" in A) || typeof A.url !== "string") return;
    try {
        let q = new URL(A.url);
        return q.search = "", q.toString().replace(/\/$/, "")
    } catch {
        return
    }
}
// @from(Ln 366117, Col 4)
tX = v(() => {
    p8();
    YA1();
    G5();
    N7();
    _8();
    nW();
    _T();
    E$();
    B6();
    cA()
})
// @from(Ln 366130, Col 0)
function un4(A) {
    let q = A.trim(),
        K = q.split(/\s+/)[0]?.toLowerCase();
    if (!K) return;
    if (K === "npx" || K === "bunx") {
        let Y = q.split(/\s+/)[1]?.toLowerCase();
        if (Y && Y in cyA) return cyA[Y]
    }
    return cyA[K]
}
// @from(Ln 366141, Col 0)
function Bn4(A) {
    for (let {
            pattern: q,
            tool: K
        }
        of LxY)
        if (q.test(A)) return K;
    return
}
// @from(Ln 366150, Col 4)
cyA
// @from(Ln 366150, Col 9)
LxY
// @from(Ln 366151, Col 4)
lyA = v(() => {
    cyA = {
        src: "sourcegraph",
        cody: "cody",
        aider: "aider",
        tabby: "tabby",
        tabnine: "tabnine",
        augment: "augment",
        pieces: "pieces",
        qodo: "qodo",
        aide: "aide",
        hound: "hound",
        seagoat: "seagoat",
        bloop: "bloop",
        gitloop: "gitloop",
        q: "amazon-q",
        gemini: "gemini"
    }, LxY = [{
        pattern: /^sourcegraph$/i,
        tool: "sourcegraph"
    }, {
        pattern: /^cody$/i,
        tool: "cody"
    }, {
        pattern: /^openctx$/i,
        tool: "openctx"
    }, {
        pattern: /^aider$/i,
        tool: "aider"
    }, {
        pattern: /^continue$/i,
        tool: "continue"
    }, {
        pattern: /^github[-_]?copilot$/i,
        tool: "github-copilot"
    }, {
        pattern: /^copilot$/i,
        tool: "github-copilot"
    }, {
        pattern: /^cursor$/i,
        tool: "cursor"
    }, {
        pattern: /^tabby$/i,
        tool: "tabby"
    }, {
        pattern: /^codeium$/i,
        tool: "codeium"
    }, {
        pattern: /^tabnine$/i,
        tool: "tabnine"
    }, {
        pattern: /^augment[-_]?code$/i,
        tool: "augment"
    }, {
        pattern: /^augment$/i,
        tool: "augment"
    }, {
        pattern: /^windsurf$/i,
        tool: "windsurf"
    }, {
        pattern: /^aide$/i,
        tool: "aide"
    }, {
        pattern: /^codestory$/i,
        tool: "aide"
    }, {
        pattern: /^pieces$/i,
        tool: "pieces"
    }, {
        pattern: /^qodo$/i,
        tool: "qodo"
    }, {
        pattern: /^amazon[-_]?q$/i,
        tool: "amazon-q"
    }, {
        pattern: /^gemini[-_]?code[-_]?assist$/i,
        tool: "gemini"
    }, {
        pattern: /^gemini$/i,
        tool: "gemini"
    }, {
        pattern: /^hound$/i,
        tool: "hound"
    }, {
        pattern: /^seagoat$/i,
        tool: "seagoat"
    }, {
        pattern: /^bloop$/i,
        tool: "bloop"
    }, {
        pattern: /^gitloop$/i,
        tool: "gitloop"
    }, {
        pattern: /^claude[-_]?context$/i,
        tool: "claude-context"
    }, {
        pattern: /^code[-_]?index[-_]?mcp$/i,
        tool: "code-index-mcp"
    }, {
        pattern: /^code[-_]?index$/i,
        tool: "code-index-mcp"
    }, {
        pattern: /^local[-_]?code[-_]?search$/i,
        tool: "local-code-search"
    }, {
        pattern: /^codebase$/i,
        tool: "autodev-codebase"
    }, {
        pattern: /^autodev[-_]?codebase$/i,
        tool: "autodev-codebase"
    }, {
        pattern: /^code[-_]?context$/i,
        tool: "claude-context"
    }]
})