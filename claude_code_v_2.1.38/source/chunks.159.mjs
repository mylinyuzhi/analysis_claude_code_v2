
// @from(Ln 408282, Col 0)
function PKq(A) {
    let q = e(56),
        {
            onComplete: K
        } = A,
        Y = v6(esY),
        z = v6(tsY),
        w = L7();
    uq();
    let H;
    if (q[0] !== w) H = () => {
        w(osY), cV6(w)
    }, q[0] = w, q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Confirmation"
    }, q[2] = O;
    else O = q[2];
    DA("confirm:no", K, O);
    let _;
    if (q[3] !== $) _ = (t) => {
        if (t === "r" || t === "R") $()
    }, q[3] = $, q[4] = _;
    else _ = q[4];
    D8(_);
    let J;
    if (q[5] !== Y.marketplaces) J = Y.marketplaces.filter(rsY), q[5] = Y.marketplaces, q[6] = J;
    else J = q[6];
    let X = J.length,
        D;
    if (q[7] !== Y.marketplaces) D = Y.marketplaces.filter(nsY), q[7] = Y.marketplaces, q[8] = D;
    else D = q[8];
    let j = D.length,
        M;
    if (q[9] !== Y.marketplaces) M = Y.marketplaces.filter(isY), q[9] = Y.marketplaces, q[10] = M;
    else M = q[10];
    let P = M.length,
        W;
    if (q[11] !== Y.marketplaces) W = Y.marketplaces.filter(lsY), q[11] = Y.marketplaces, q[12] = W;
    else W = q[12];
    let G;
    if (q[13] !== W.length || q[14] !== J.length || q[15] !== D.length || q[16] !== M.length) G = {
        pending: X,
        installing: j,
        installed: P,
        failed: W.length
    }, q[13] = W.length, q[14] = J.length, q[15] = D.length, q[16] = M.length, q[17] = G;
    else G = q[17];
    let f = G,
        Z;
    if (q[18] !== Y.plugins) Z = Y.plugins.filter(csY), q[18] = Y.plugins, q[19] = Z;
    else Z = q[19];
    let N = Z.length,
        T;
    if (q[20] !== Y.plugins) T = Y.plugins.filter(dsY), q[20] = Y.plugins, q[21] = T;
    else T = q[21];
    let k = T.length,
        y;
    if (q[22] !== Y.plugins) y = Y.plugins.filter(psY), q[22] = Y.plugins, q[23] = y;
    else y = q[23];
    let B = y.length,
        S;
    if (q[24] !== Y.plugins) S = Y.plugins.filter(UsY), q[24] = Y.plugins, q[25] = S;
    else S = q[25];
    let m;
    if (q[26] !== Z.length || q[27] !== T.length || q[28] !== y.length || q[29] !== S.length) m = {
        pending: N,
        installing: k,
        installed: B,
        failed: S.length
    }, q[26] = Z.length, q[27] = T.length, q[28] = y.length, q[29] = S.length, q[30] = m;
    else m = q[30];
    let b = m,
        g = f.installing > 0 || b.installing > 0 || f.pending > 0 || b.pending > 0,
        U = z.length > 0,
        x = Y.marketplaces.length > 0 || Y.plugins.length > 0,
        p = U && !x ? "Plugin Loading Errors" : "Plugin Status",
        l;
    if (q[31] !== p) l = yA.createElement(I, {
        marginBottom: 1
    }, yA.createElement(V, {
        bold: !0
    }, p)), q[31] = p, q[32] = l;
    else l = q[32];
    let r;
    if (q[33] !== Y.marketplaces) r = Y.marketplaces.length > 0 && yA.createElement(yA.Fragment, null, yA.createElement(I, {
        marginBottom: 1
    }, yA.createElement(V, {
        dimColor: !0
    }, "Marketplaces:")), Y.marketplaces.map(gsY)), q[33] = Y.marketplaces, q[34] = r;
    else r = q[34];
    let s;
    if (q[35] !== Y.plugins) s = Y.plugins.length > 0 && yA.createElement(yA.Fragment, null, yA.createElement(I, {
        marginTop: 1,
        marginBottom: 1
    }, yA.createElement(V, {
        dimColor: !0
    }, "Plugins:")), Y.plugins.map(QsY)), q[35] = Y.plugins, q[36] = s;
    else s = q[36];
    let O1;
    if (q[37] !== z.length || q[38] !== Y.marketplaces.length || q[39] !== Y.plugins.length) O1 = Y.marketplaces.length === 0 && Y.plugins.length === 0 && z.length === 0 && yA.createElement(I, {
        marginTop: 1
    }, yA.createElement(V, {
        dimColor: !0
    }, "No pending installations or errors")), q[37] = z.length, q[38] = Y.marketplaces.length, q[39] = Y.plugins.length, q[40] = O1;
    else O1 = q[40];
    let T1;
    if (q[41] !== z) T1 = z.length > 0 && yA.createElement(yA.Fragment, null, yA.createElement(I, {
        marginTop: 1,
        marginBottom: 1
    }, yA.createElement(V, {
        dimColor: !0
    }, "Plugin Loading Errors:")), z.map(FsY)), q[41] = z, q[42] = T1;
    else T1 = q[42];
    let N1;
    if (q[43] !== g || q[44] !== f.failed || q[45] !== b) N1 = g ? "Installing…" : yA.createElement(yA.Fragment, null, "Press", " ", f.failed > 0 || b.failed > 0 ? yA.createElement(yA.Fragment, null, yA.createElement(V, {
        bold: !0
    }, "r"), " to retry failed installations ·", " ") : null, yA.createElement(V, {
        bold: !0
    }, "Esc"), " to return"), q[43] = g, q[44] = f.failed, q[45] = b, q[46] = N1;
    else N1 = q[46];
    let j1;
    if (q[47] !== N1) j1 = yA.createElement(I, {
        marginTop: 2
    }, yA.createElement(V, {
        dimColor: !0
    }, N1)), q[47] = N1, q[48] = j1;
    else j1 = q[48];
    let q1;
    if (q[49] !== l || q[50] !== r || q[51] !== s || q[52] !== O1 || q[53] !== T1 || q[54] !== j1) q1 = yA.createElement(I, {
        flexDirection: "column"
    }, l, r, s, O1, T1, j1), q[49] = l, q[50] = r, q[51] = s, q[52] = O1, q[53] = T1, q[54] = j1, q[55] = q1;
    else q1 = q[55];
    return q1
}
// @from(Ln 408420, Col 0)
function FsY(A, q) {
    let K = "plugin" in A ? A.plugin : void 0;
    return yA.createElement(I, {
        key: q,
        marginLeft: 2,
        flexDirection: "column"
    }, yA.createElement(V, null, yA.createElement(ZE, {
        status: "error",
        withSpace: !0
    }), K ? yA.createElement(yA.Fragment, null, "Plugin ", yA.createElement(V, {
        bold: !0
    }, K), " from", " ", yA.createElement(V, {
        dimColor: !0
    }, A.source)) : yA.createElement(V, {
        dimColor: !0
    }, A.source)), yA.createElement(I, {
        marginLeft: 3
    }, yA.createElement(V, {
        color: "error",
        dimColor: !0
    }, msY(A))), MKq(A) && yA.createElement(I, {
        marginLeft: 3,
        marginTop: 1
    }, yA.createElement(V, {
        dimColor: !0,
        italic: !0
    }, MKq(A))))
}
// @from(Ln 408449, Col 0)
function QsY(A) {
    return yA.createElement(I, {
        key: A.id,
        marginLeft: 2
    }, A.status === "installing" && yA.createElement(yA.Fragment, null, yA.createElement(c4, null), yA.createElement(I, {
        marginLeft: 1
    }, yA.createElement(V, null, A.name), yA.createElement(V, {
        dimColor: !0
    }, " · Installing…"))), A.status === "pending" && yA.createElement(V, null, yA.createElement(ZE, {
        status: "pending",
        withSpace: !0
    }), A.name, yA.createElement(V, {
        dimColor: !0
    }, " · Pending")), A.status === "installed" && yA.createElement(V, null, yA.createElement(ZE, {
        status: "success",
        withSpace: !0
    }), A.name, yA.createElement(V, {
        dimColor: !0
    }, " · Installed")), A.status === "failed" && yA.createElement(I, {
        flexDirection: "column"
    }, yA.createElement(V, null, yA.createElement(ZE, {
        status: "error",
        withSpace: !0
    }), A.name, yA.createElement(V, {
        color: "error"
    }, " · Failed")), A.error && yA.createElement(I, {
        marginLeft: 3
    }, yA.createElement(V, {
        color: "error",
        dimColor: !0
    }, A.error))))
}
// @from(Ln 408482, Col 0)
function gsY(A) {
    return yA.createElement(I, {
        key: A.name,
        marginLeft: 2
    }, A.status === "installing" && yA.createElement(yA.Fragment, null, yA.createElement(c4, null), yA.createElement(I, {
        marginLeft: 1
    }, yA.createElement(V, null, A.name), yA.createElement(V, {
        dimColor: !0
    }, " · Installing…"))), A.status === "pending" && yA.createElement(V, null, yA.createElement(ZE, {
        status: "pending",
        withSpace: !0
    }), A.name, yA.createElement(V, {
        dimColor: !0
    }, " · Pending")), A.status === "installed" && yA.createElement(V, null, yA.createElement(ZE, {
        status: "success",
        withSpace: !0
    }), A.name, yA.createElement(V, {
        dimColor: !0
    }, " · Installed")), A.status === "failed" && yA.createElement(I, {
        flexDirection: "column"
    }, yA.createElement(V, null, yA.createElement(ZE, {
        status: "error",
        withSpace: !0
    }), A.name, yA.createElement(V, {
        color: "error"
    }, " · Failed")), A.error && yA.createElement(I, {
        marginLeft: 3
    }, yA.createElement(V, {
        color: "error",
        dimColor: !0
    }, A.error))))
}
// @from(Ln 408515, Col 0)
function UsY(A) {
    return A.status === "failed"
}
// @from(Ln 408519, Col 0)
function psY(A) {
    return A.status === "installed"
}
// @from(Ln 408523, Col 0)
function dsY(A) {
    return A.status === "installing"
}
// @from(Ln 408527, Col 0)
function csY(A) {
    return A.status === "pending"
}
// @from(Ln 408531, Col 0)
function lsY(A) {
    return A.status === "failed"
}
// @from(Ln 408535, Col 0)
function isY(A) {
    return A.status === "installed"
}
// @from(Ln 408539, Col 0)
function nsY(A) {
    return A.status === "installing"
}
// @from(Ln 408543, Col 0)
function rsY(A) {
    return A.status === "pending"
}
// @from(Ln 408547, Col 0)
function osY(A) {
    return {
        ...A,
        plugins: {
            ...A.plugins,
            installationStatus: {
                marketplaces: A.plugins.installationStatus.marketplaces.map(ssY),
                plugins: A.plugins.installationStatus.plugins.map(asY)
            }
        }
    }
}
// @from(Ln 408560, Col 0)
function asY(A) {
    return A.status === "failed" ? {
        ...A,
        status: "pending"
    } : A
}
// @from(Ln 408567, Col 0)
function ssY(A) {
    return A.status === "failed" ? {
        ...A,
        status: "pending"
    } : A
}
// @from(Ln 408574, Col 0)
function tsY(A) {
    return A.plugins.errors
}
// @from(Ln 408578, Col 0)
function esY(A) {
    return A.plugins.installationStatus
}
// @from(Ln 408581, Col 4)
yA
// @from(Ln 408582, Col 4)
WKq = v(() => {
    i1();
    m1();
    K7();
    R2();
    d8();
    lV6();
    x2();
    iV6();
    yA = o(X1(), 1)
})
// @from(Ln 408596, Col 0)
function AtY(A) {
    let q = Jy.basename(A),
        K = Jy.basename(Jy.dirname(A));
    if (q === "plugin.json") return "plugin";
    if (q === "marketplace.json") return "marketplace";
    if (K === ".claude-plugin") return "plugin";
    return "unknown"
}
// @from(Ln 408605, Col 0)
function GKq(A) {
    return A.issues.map((q) => ({
        path: q.path.join(".") || "root",
        message: q.message,
        code: q.code
    }))
}
// @from(Ln 408613, Col 0)
function Ip1(A, q, K) {
    if (A.includes("..")) K.push({
        path: q,
        message: `Path contains ".." which could be a path traversal attempt: ${A}`
    })
}
// @from(Ln 408620, Col 0)
function uxA(A) {
    let q = [],
        K = [],
        Y = Jy.resolve(A);
    if (!Kf.existsSync(Y)) return {
        success: !1,
        errors: [{
            path: "file",
            message: `File not found: ${Y}`
        }],
        warnings: [],
        filePath: Y,
        fileType: "plugin"
    };
    if (!Kf.statSync(Y).isFile()) return {
        success: !1,
        errors: [{
            path: "file",
            message: `Path is not a file: ${Y}`
        }],
        warnings: [],
        filePath: Y,
        fileType: "plugin"
    };
    let w;
    try {
        w = Kf.readFileSync(Y, {
            encoding: "utf-8"
        })
    } catch (O) {
        return {
            success: !1,
            errors: [{
                path: "file",
                message: `Failed to read file: ${O instanceof Error?O.message:String(O)}`
            }],
            warnings: [],
            filePath: Y,
            fileType: "plugin"
        }
    }
    let H;
    try {
        H = _A(w)
    } catch (O) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${O instanceof Error?O.message:String(O)}`
            }],
            warnings: [],
            filePath: Y,
            fileType: "plugin"
        }
    }
    if (H && typeof H === "object") {
        let O = H;
        if (O.commands)(Array.isArray(O.commands) ? O.commands : [O.commands]).forEach((J, X) => {
            if (typeof J === "string") Ip1(J, `commands[${X}]`, q)
        });
        if (O.agents)(Array.isArray(O.agents) ? O.agents : [O.agents]).forEach((J, X) => {
            if (typeof J === "string") Ip1(J, `agents[${X}]`, q)
        });
        if (O.skills)(Array.isArray(O.skills) ? O.skills : [O.skills]).forEach((J, X) => {
            if (typeof J === "string") Ip1(J, `skills[${X}]`, q)
        })
    }
    let $ = wA1.safeParse(H);
    if (!$.success) q.push(...GKq($.error));
    if ($.success) {
        let O = $.data;
        if (!O.version) K.push({
            path: "version",
            message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")'
        });
        if (!O.description) K.push({
            path: "description",
            message: "No description provided. Adding a description helps users understand what your plugin does"
        });
        if (!O.author) K.push({
            path: "author",
            message: "No author information provided. Consider adding author details for plugin attribution"
        })
    }
    return {
        success: q.length === 0,
        errors: q,
        warnings: K,
        filePath: Y,
        fileType: "plugin"
    }
}
// @from(Ln 408714, Col 0)
function BxA(A) {
    let q = [],
        K = [],
        Y = Jy.resolve(A);
    if (!Kf.existsSync(Y)) return {
        success: !1,
        errors: [{
            path: "file",
            message: `File not found: ${Y}`
        }],
        warnings: [],
        filePath: Y,
        fileType: "marketplace"
    };
    if (!Kf.statSync(Y).isFile()) return {
        success: !1,
        errors: [{
            path: "file",
            message: `Path is not a file: ${Y}`
        }],
        warnings: [],
        filePath: Y,
        fileType: "marketplace"
    };
    let w;
    try {
        w = Kf.readFileSync(Y, {
            encoding: "utf-8"
        })
    } catch (O) {
        return {
            success: !1,
            errors: [{
                path: "file",
                message: `Failed to read file: ${O instanceof Error?O.message:String(O)}`
            }],
            warnings: [],
            filePath: Y,
            fileType: "marketplace"
        }
    }
    let H;
    try {
        H = _A(w)
    } catch (O) {
        return {
            success: !1,
            errors: [{
                path: "json",
                message: `Invalid JSON syntax: ${O instanceof Error?O.message:String(O)}`
            }],
            warnings: [],
            filePath: Y,
            fileType: "marketplace"
        }
    }
    if (H && typeof H === "object") {
        let O = H;
        if (Array.isArray(O.plugins)) O.plugins.forEach((_, J) => {
            if (_ && typeof _ === "object" && "source" in _) {
                let X = _.source;
                if (typeof X === "string") Ip1(X, `plugins[${J}].source`, q);
                if (X && typeof X === "object" && "path" in X && typeof X.path === "string") Ip1(X.path, `plugins[${J}].source.path`, q)
            }
        })
    }
    let $ = AH1.safeParse(H);
    if (!$.success) q.push(...GKq($.error));
    if ($.success) {
        let O = $.data;
        if (!O.plugins || O.plugins.length === 0) K.push({
            path: "plugins",
            message: "Marketplace has no plugins defined"
        });
        if (O.plugins) O.plugins.forEach((_, J) => {
            if (typeof _.source === "object" && _.source.source === "npm") K.push({
                path: `plugins[${J}].source`,
                message: `Plugin "${_.name}" uses npm source which is not yet fully implemented`
            });
            if (O.plugins.filter((D) => D.name === _.name).length > 1) q.push({
                path: `plugins[${J}].name`,
                message: `Duplicate plugin name "${_.name}" found in marketplace`
            })
        });
        if (!O.metadata?.description) K.push({
            path: "metadata.description",
            message: "No marketplace description provided. Adding a description helps users understand what this marketplace offers"
        })
    }
    return {
        success: q.length === 0,
        errors: q,
        warnings: K,
        filePath: Y,
        fileType: "marketplace"
    }
}
// @from(Ln 408812, Col 0)
function nV6(A) {
    let q = Jy.resolve(A);
    if (Kf.existsSync(q) && Kf.statSync(q).isDirectory()) {
        let Y = Jy.join(q, ".claude-plugin", "marketplace.json"),
            z = Jy.join(q, ".claude-plugin", "plugin.json");
        if (Kf.existsSync(Y)) return BxA(Y);
        else if (Kf.existsSync(z)) return uxA(z);
        else return {
            success: !1,
            errors: [{
                path: "directory",
                message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json"
            }],
            warnings: [],
            filePath: q,
            fileType: "plugin"
        }
    }
    switch (AtY(A)) {
        case "plugin":
            return uxA(A);
        case "marketplace":
            return BxA(A);
        case "unknown": {
            if (!Kf.existsSync(q)) return {
                success: !1,
                errors: [{
                    path: "file",
                    message: `File not found: ${q}`
                }],
                warnings: [],
                filePath: q,
                fileType: "plugin"
            };
            try {
                let Y = Kf.readFileSync(q, {
                        encoding: "utf-8"
                    }),
                    z = _A(Y);
                if (Array.isArray(z.plugins)) return BxA(A)
            } catch {}
            return uxA(A)
        }
    }
}
// @from(Ln 408857, Col 4)
mxA = v(() => {
    N0();
    m6()
})
// @from(Ln 408862, Col 0)
function fKq({
    onComplete: A,
    path: q
}) {
    return ZKq.useEffect(() => {
        async function K() {
            if (!q) {
                A(`Usage: /plugin validate <path>

Validate a plugin or marketplace manifest file or directory.

Examples:
  /plugin validate .claude-plugin/plugin.json
  /plugin validate /path/to/plugin-directory
  /plugin validate .

When given a directory, automatically validates .claude-plugin/marketplace.json
or .claude-plugin/plugin.json (prefers marketplace if both exist).

Or from the command line:
  claude plugin validate <path>`);
                return
            }
            try {
                let Y = nV6(q),
                    z = "";
                if (z += `Validating ${Y.fileType} manifest: ${Y.filePath}

`, Y.errors.length > 0) z += `${l1.cross} Found ${Y.errors.length} error${Y.errors.length===1?"":"s"}:

`, Y.errors.forEach((w) => {
                    z += `  ${l1.pointer} ${w.path}: ${w.message}
`
                }), z += `
`;
                if (Y.warnings.length > 0) z += `${l1.warning} Found ${Y.warnings.length} warning${Y.warnings.length===1?"":"s"}:

`, Y.warnings.forEach((w) => {
                    z += `  ${l1.pointer} ${w.path}: ${w.message}
`
                }), z += `
`;
                if (Y.success) {
                    if (Y.warnings.length > 0) z += `${l1.tick} Validation passed with warnings
`;
                    else z += `${l1.tick} Validation passed
`;
                    process.exitCode = 0
                } else z += `${l1.cross} Validation failed
`, process.exitCode = 1;
                A(z)
            } catch (Y) {
                process.exitCode = 2, K1(Y instanceof Error ? Y : Error(String(Y))), A(`${l1.cross} Unexpected error during validation: ${Y instanceof Error?Y.message:String(Y)}`)
            }
        }
        K()
    }, [A, q]), xp1.createElement(I, {
        flexDirection: "column"
    }, xp1.createElement(V, null, "Running validation..."))
}
// @from(Ln 408922, Col 4)
xp1
// @from(Ln 408922, Col 9)
ZKq
// @from(Ln 408923, Col 4)
VKq = v(() => {
    m1();
    mxA();
    b7();
    y6();
    xp1 = o(X1(), 1), ZKq = o(X1(), 1)
})
// @from(Ln 408931, Col 0)
function NKq(A) {
    if (!A) return {
        type: "menu"
    };
    let q = A.trim().split(/\s+/);
    switch (q[0]?.toLowerCase()) {
        case "help":
        case "--help":
        case "-h":
            return {
                type: "help"
            };
        case "install":
        case "i": {
            let Y = q[1];
            if (!Y) return {
                type: "install"
            };
            if (Y.includes("@")) {
                let [w, H] = Y.split("@");
                return {
                    type: "install",
                    plugin: w,
                    marketplace: H
                }
            }
            if (Y.startsWith("http://") || Y.startsWith("https://") || Y.startsWith("file://") || Y.includes("/") || Y.includes("\\")) return {
                type: "install",
                marketplace: Y
            };
            return {
                type: "install",
                plugin: Y
            }
        }
        case "manage":
            return {
                type: "manage"
            };
        case "uninstall":
            return {
                type: "uninstall", plugin: q[1]
            };
        case "enable":
            return {
                type: "enable", plugin: q[1]
            };
        case "disable":
            return {
                type: "disable", plugin: q[1]
            };
        case "validate":
            return {
                type: "validate", path: q.slice(1).join(" ").trim() || void 0
            };
        case "marketplace":
        case "market": {
            let Y = q[1]?.toLowerCase(),
                z = q.slice(2).join(" ");
            switch (Y) {
                case "add":
                    return {
                        type: "marketplace", action: "add", target: z
                    };
                case "remove":
                case "rm":
                    return {
                        type: "marketplace", action: "remove", target: z
                    };
                case "update":
                    return {
                        type: "marketplace", action: "update", target: z
                    };
                case "list":
                    return {
                        type: "marketplace", action: "list"
                    };
                default:
                    return {
                        type: "marketplace"
                    }
            }
        }
        default:
            return {
                type: "menu"
            }
    }
}
// @from(Ln 409021, Col 0)
function qtY(A) {
    let q = e(4),
        {
            onComplete: K
        } = A,
        Y, z;
    if (q[0] !== K) Y = () => {
        (async function() {
            try {
                let O = await n5(),
                    _ = Object.keys(O);
                if (_.length === 0) K("No marketplaces configured");
                else K(`Configured marketplaces:
${_.map(KtY).join(`
`)}`)
            } catch (O) {
                let _ = O;
                K(`Error loading marketplaces: ${_ instanceof Error?_.message:String(_)}`)
            }
        })()
    }, z = [K], q[0] = K, q[1] = Y, q[2] = z;
    else Y = q[1], z = q[2];
    hN.useEffect(Y, z);
    let w;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) w = s8.createElement(V, null, "Loading marketplaces..."), q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 409050, Col 0)
function KtY(A) {
    return `  • ${A}`
}
// @from(Ln 409054, Col 0)
function YtY() {
    return null
}
// @from(Ln 409058, Col 0)
function ztY(A) {
    switch (A.type) {
        case "help":
            return {
                type: "help"
            };
        case "validate":
            return {
                type: "validate", path: A.path
            };
        case "install":
            if (A.marketplace) return {
                type: "browse-marketplace",
                targetMarketplace: A.marketplace,
                targetPlugin: A.plugin
            };
            if (A.plugin) return {
                type: "discover-plugins",
                targetPlugin: A.plugin
            };
            return {
                type: "discover-plugins"
            };
        case "manage":
            return {
                type: "manage-plugins"
            };
        case "uninstall":
            return {
                type: "manage-plugins", targetPlugin: A.plugin, action: "uninstall"
            };
        case "enable":
            return {
                type: "manage-plugins", targetPlugin: A.plugin, action: "enable"
            };
        case "disable":
            return {
                type: "manage-plugins", targetPlugin: A.plugin, action: "disable"
            };
        case "marketplace":
            if (A.action === "list") return {
                type: "marketplace-list"
            };
            if (A.action === "add") return {
                type: "add-marketplace",
                initialValue: A.target
            };
            if (A.action === "remove") return {
                type: "manage-marketplaces",
                targetMarketplace: A.target,
                action: "remove"
            };
            if (A.action === "update") return {
                type: "manage-marketplaces",
                targetMarketplace: A.target,
                action: "update"
            };
            return {
                type: "marketplace-menu"
            };
        case "menu":
        default:
            return {
                type: "discover-plugins"
            }
    }
}
// @from(Ln 409126, Col 0)
function wtY(A) {
    if (A.type === "manage-plugins") return "installed";
    if (A.type === "manage-marketplaces") return "marketplaces";
    return "discover"
}
// @from(Ln 409132, Col 0)
function TKq(A) {
    let q = e(70),
        {
            onComplete: K,
            args: Y,
            showMcpRedirectMessage: z
        } = A,
        w, H;
    if (q[0] !== Y) w = NKq(Y), H = ztY(w), q[0] = Y, q[1] = w, q[2] = H;
    else w = q[1], H = q[2];
    let $ = H,
        [O, _] = hN.useState($),
        J;
    if (q[3] !== $) J = wtY($), q[3] = $, q[4] = J;
    else J = q[4];
    let [X, D] = hN.useState(J), [j, M] = hN.useState(O.type === "add-marketplace" ? O.initialValue || "" : ""), [P, W] = hN.useState(0), [G, f] = hN.useState(null), [Z, N] = hN.useState(null), [T, k] = hN.useState(!1), y = L7(), B = uq(), S = w.type === "marketplace" && w.action === "add" && w.target !== void 0, m;
    if (q[5] !== y) m = async () => {
        let {
            enabled: G1,
            disabled: L1,
            errors: x1
        } = await iY(), [f1, R1] = await Promise.all([YK1(), wK1()]);
        y((H1) => {
            let y1 = H1.plugins.errors.filter($tY),
                B1 = new Set(x1.map(HtY)),
                O6 = [...y1.filter((P6) => {
                    let V6 = P6.type === "generic-error" ? `generic-error:${P6.source}:${P6.error}` : `${P6.type}:${P6.source}`;
                    return !B1.has(V6)
                }), ...x1];
            return {
                ...H1,
                plugins: {
                    ...H1.plugins,
                    enabled: G1,
                    disabled: L1,
                    commands: f1,
                    agents: R1,
                    errors: O6
                }
            }
        })
    }, q[5] = y, q[6] = m;
    else m = q[6];
    let b = m,
        g;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) g = (G1) => {
        let L1 = G1;
        D(L1), f(null);
        A: switch (L1) {
            case "discover": {
                _({
                    type: "discover-plugins"
                });
                break A
            }
            case "installed": {
                _({
                    type: "manage-plugins"
                });
                break A
            }
            case "marketplaces":
                _({
                    type: "manage-marketplaces"
                })
        }
    }, q[7] = g;
    else g = q[7];
    let U = g,
        x, p;
    if (q[8] !== K || q[9] !== O.type) x = () => {
        if (O.type === "menu") K()
    }, p = [O.type, K], q[8] = K, q[9] = O.type, q[10] = x, q[11] = p;
    else x = q[10], p = q[11];
    hN.useEffect(x, p);
    let l, r;
    if (q[12] !== X || q[13] !== O.type) l = () => {
        if (O.type === "browse-marketplace" && X !== "discover") D("discover")
    }, r = [O.type, X], q[12] = X, q[13] = O.type, q[14] = l, q[15] = r;
    else l = q[14], r = q[15];
    hN.useEffect(l, r);
    let s;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) s = () => {
        D("marketplaces"), _({
            type: "manage-marketplaces"
        }), M(""), f(null)
    }, q[16] = s;
    else s = q[16];
    let O1 = s,
        T1 = O.type === "add-marketplace",
        N1;
    if (q[17] !== T1) N1 = {
        context: "Settings",
        isActive: T1
    }, q[17] = T1, q[18] = N1;
    else N1 = q[18];
    DA("confirm:no", O1, N1);
    let j1, q1;
    if (q[19] !== K || q[20] !== Z) j1 = () => {
        if (Z) K(Z)
    }, q1 = [Z, K], q[19] = K, q[20] = Z, q[21] = j1, q[22] = q1;
    else j1 = q[21], q1 = q[22];
    hN.useEffect(j1, q1);
    let t, J1;
    if (q[23] !== K || q[24] !== O.type) t = () => {
        if (O.type === "help") K()
    }, J1 = [O.type, K], q[23] = K, q[24] = O.type, q[25] = t, q[26] = J1;
    else t = q[25], J1 = q[26];
    if (hN.useEffect(t, J1), O.type === "help") {
        let G1;
        if (q[27] === Symbol.for("react.memo_cache_sentinel")) G1 = s8.createElement(I, {
            flexDirection: "column"
        }, s8.createElement(V, {
            bold: !0
        }, "Plugin Command Usage:"), s8.createElement(V, null, " "), s8.createElement(V, {
            dimColor: !0
        }, "Installation:"), s8.createElement(V, null, " /plugin install - Browse and install plugins"), s8.createElement(V, null, " ", "/plugin install <marketplace> - Install from specific marketplace"), s8.createElement(V, null, " /plugin install <plugin> - Install specific plugin"), s8.createElement(V, null, " ", "/plugin install <plugin>@<market> - Install plugin from marketplace"), s8.createElement(V, null, " "), s8.createElement(V, {
            dimColor: !0
        }, "Management:"), s8.createElement(V, null, " /plugin manage - Manage installed plugins"), s8.createElement(V, null, " /plugin enable <plugin> - Enable a plugin"), s8.createElement(V, null, " /plugin disable <plugin> - Disable a plugin"), s8.createElement(V, null, " /plugin uninstall <plugin> - Uninstall a plugin"), s8.createElement(V, null, " "), s8.createElement(V, {
            dimColor: !0
        }, "Marketplaces:"), s8.createElement(V, null, " /plugin marketplace - Marketplace management menu"), s8.createElement(V, null, " /plugin marketplace add - Add a marketplace"), s8.createElement(V, null, " ", "/plugin marketplace add <path/url> - Add marketplace directly"), s8.createElement(V, null, " /plugin marketplace update - Update marketplaces"), s8.createElement(V, null, " ", "/plugin marketplace update <name> - Update specific marketplace"), s8.createElement(V, null, " /plugin marketplace remove - Remove a marketplace"), s8.createElement(V, null, " ", "/plugin marketplace remove <name> - Remove specific marketplace"), s8.createElement(V, null, " /plugin marketplace list - List all marketplaces"), s8.createElement(V, null, " "), s8.createElement(V, {
            dimColor: !0
        }, "Validation:"), s8.createElement(V, null, " ", "/plugin validate <path> - Validate a manifest file or directory"), s8.createElement(V, null, " "), s8.createElement(V, {
            dimColor: !0
        }, "Other:"), s8.createElement(V, null, " /plugin - Main plugin menu"), s8.createElement(V, null, " /plugin help - Show this help"), s8.createElement(V, null, " /plugins - Alias for /plugin")), q[27] = G1;
        else G1 = q[27];
        return G1
    }
    if (O.type === "validate") {
        let G1;
        if (q[28] !== K || q[29] !== O.path) G1 = s8.createElement(fKq, {
            onComplete: K,
            path: O.path
        }), q[28] = K, q[29] = O.path, q[30] = G1;
        else G1 = q[30];
        return G1
    }
    if (O.type === "marketplace-menu") return _({
        type: "menu"
    }), null;
    if (O.type === "marketplace-list") {
        let G1;
        if (q[31] !== K) G1 = s8.createElement(qtY, {
            onComplete: K
        }), q[31] = K, q[32] = G1;
        else G1 = q[32];
        return G1
    }
    if (O.type === "add-marketplace") {
        let G1;
        if (q[33] !== S || q[34] !== P || q[35] !== G || q[36] !== j || q[37] !== Z || q[38] !== b) G1 = s8.createElement(cqq, {
            inputValue: j,
            setInputValue: M,
            cursorOffset: P,
            setCursorOffset: W,
            error: G,
            setError: f,
            result: Z,
            setResult: N,
            setViewState: _,
            onAddComplete: b,
            cliMode: S
        }), q[33] = S, q[34] = P, q[35] = G, q[36] = j, q[37] = Z, q[38] = b, q[39] = G1;
        else G1 = q[39];
        return G1
    }
    if (O.type === "installation-status") {
        let G1;
        if (q[40] === Symbol.for("react.memo_cache_sentinel")) G1 = s8.createElement(PKq, {
            onComplete: () => _({
                type: "menu"
            })
        }), q[40] = G1;
        else G1 = q[40];
        return G1
    }
    if (O.type === "plugin-errors") {
        let G1;
        if (q[41] === Symbol.for("react.memo_cache_sentinel")) G1 = s8.createElement(_Kq, {
            setViewState: _
        }), q[41] = G1;
        else G1 = q[41];
        return G1
    }
    let D1;
    if (q[42] !== X || q[43] !== z) D1 = z && X === "installed" ? s8.createElement(YtY, null) : void 0, q[42] = X, q[43] = z, q[44] = D1;
    else D1 = q[44];
    let Z1;
    if (q[45] !== G || q[46] !== Z || q[47] !== b || q[48] !== O.targetMarketplace || q[49] !== O.targetPlugin || q[50] !== O.type) Z1 = s8.createElement(LH, {
        id: "discover",
        title: "Discover"
    }, O.type === "browse-marketplace" ? s8.createElement(sqq, {
        error: G,
        setError: f,
        result: Z,
        setResult: N,
        setViewState: _,
        onInstallComplete: b,
        targetMarketplace: O.targetMarketplace,
        targetPlugin: O.targetPlugin
    }) : s8.createElement(eqq, {
        error: G,
        setError: f,
        result: Z,
        setResult: N,
        setViewState: _,
        onInstallComplete: b,
        onSearchModeChange: k,
        targetPlugin: O.type === "discover-plugins" ? O.targetPlugin : void 0
    })), q[45] = G, q[46] = Z, q[47] = b, q[48] = O.targetMarketplace, q[49] = O.targetPlugin, q[50] = O.type, q[51] = Z1;
    else Z1 = q[51];
    let E1 = O.type === "manage-plugins" ? O.targetPlugin : void 0,
        a = O.type === "manage-plugins" ? O.targetMarketplace : void 0,
        A1 = O.type === "manage-plugins" ? O.action : void 0,
        M1;
    if (q[52] !== E1 || q[53] !== a || q[54] !== A1 || q[55] !== b) M1 = s8.createElement(LH, {
        id: "installed",
        title: "Installed"
    }, s8.createElement(XKq, {
        setViewState: _,
        setResult: N,
        onManageComplete: b,
        onSearchModeChange: k,
        targetPlugin: E1,
        targetMarketplace: a,
        action: A1
    })), q[52] = E1, q[53] = a, q[54] = A1, q[55] = b, q[56] = M1;
    else M1 = q[56];
    let z1 = O.type === "manage-marketplaces" ? O.targetMarketplace : void 0,
        Y1 = O.type === "manage-marketplaces" ? O.action : void 0,
        _1;
    if (q[57] !== G || q[58] !== B || q[59] !== z1 || q[60] !== Y1 || q[61] !== b) _1 = s8.createElement(LH, {
        id: "marketplaces",
        title: "Marketplaces"
    }, s8.createElement(iqq, {
        setViewState: _,
        error: G,
        setError: f,
        setResult: N,
        exitState: B,
        onManageComplete: b,
        targetMarketplace: z1,
        action: Y1
    })), q[57] = G, q[58] = B, q[59] = z1, q[60] = Y1, q[61] = b, q[62] = _1;
    else _1 = q[62];
    let $1;
    if (q[63] !== X || q[64] !== T || q[65] !== D1 || q[66] !== Z1 || q[67] !== M1 || q[68] !== _1) $1 = s8.createElement($y, {
        title: "Plugins",
        selectedTab: X,
        onTabChange: U,
        color: "suggestion",
        disableNavigation: T,
        banner: D1
    }, Z1, M1, _1), q[63] = X, q[64] = T, q[65] = D1, q[66] = Z1, q[67] = M1, q[68] = _1, q[69] = $1;
    else $1 = q[69];
    return $1
}
// @from(Ln 409390, Col 0)
function HtY(A) {
    return A.type === "generic-error" ? `generic-error:${A.source}:${A.error}` : `${A.type}:${A.source}`
}
// @from(Ln 409394, Col 0)
function $tY(A) {
    return A.source === "lsp-manager" || A.source.startsWith("plugin:")
}
// @from(Ln 409397, Col 4)
s8
// @from(Ln 409397, Col 8)
hN
// @from(Ln 409398, Col 4)
FxA = v(() => {
    i1();
    m1();
    K7();
    R2();
    VJ();
    d8();
    Bu1();
    Uu1();
    X91();
    lqq();
    nqq();
    tqq();
    AKq();
    DKq();
    WKq();
    hxA();
    VKq();
    p$();
    s8 = o(X1(), 1), hN = o(X1(), 1)
})
// @from(Ln 409419, Col 4)
vKq = {}
// @from(Ln 409424, Col 0)
function OtY(A) {
    let q = e(7),
        {
            action: K,
            target: Y,
            onComplete: z
        } = A,
        w = v6(JtY),
        H = Xe(),
        $ = rV6.useRef(!1),
        O, _;
    if (q[0] !== K || q[1] !== w || q[2] !== z || q[3] !== Y || q[4] !== H) O = () => {
        if ($.current) return;
        $.current = !0;
        let J = K === "enable",
            X = w.filter(_tY),
            D = Y === "all" ? X.filter((j) => J ? j.type === "disabled" : j.type !== "disabled") : X.filter((j) => j.name === Y);
        if (D.length === 0) {
            z(Y === "all" ? `All MCP servers are already ${J?"enabled":"disabled"}` : `MCP server "${Y}" not found`);
            return
        }
        for (let j of D) H(j.name);
        z(Y === "all" ? `${J?"Enabled":"Disabled"} ${D.length} MCP server(s)` : `MCP server "${Y}" ${J?"enabled":"disabled"}`)
    }, _ = [K, Y, w, H, z], q[0] = K, q[1] = w, q[2] = z, q[3] = Y, q[4] = H, q[5] = O, q[6] = _;
    else O = q[5], _ = q[6];
    return rV6.useEffect(O, _), null
}
// @from(Ln 409452, Col 0)
function _tY(A) {
    return A.name !== "ide"
}
// @from(Ln 409456, Col 0)
function JtY(A) {
    return A.mcp.clients
}
// @from(Ln 409459, Col 0)
async function XtY(A, q, K) {
    if (K) {
        let Y = K.trim().split(/\s+/);
        if (Y[0] === "no-redirect") return bp1.default.createElement(bV6, {
            onComplete: A
        });
        if (Y[0] === "reconnect" && Y[1]) return bp1.default.createElement(VxA, {
            serverName: Y.slice(1).join(" "),
            onComplete: A
        });
        if (Y[0] === "enable" || Y[0] === "disable") return bp1.default.createElement(OtY, {
            action: Y[0],
            target: Y.length > 1 ? Y.slice(1).join(" ") : "all",
            onComplete: A
        })
    }
    return bp1.default.createElement(bV6, {
        onComplete: A
    })
}
// @from(Ln 409479, Col 4)
bp1
// @from(Ln 409479, Col 9)
rV6
// @from(Ln 409480, Col 4)
EKq = v(() => {
    i1();
    dqq();
    NxA();
    De();
    d8();
    FxA();
    bp1 = o(X1(), 1), rV6 = o(X1(), 1)
})
// @from(Ln 409489, Col 4)
DtY
// @from(Ln 409489, Col 9)
kKq
// @from(Ln 409490, Col 4)
LKq = v(() => {
    DtY = {
        type: "local-jsx",
        name: "mcp",
        description: "Manage MCP servers",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[enable|disable [server-name]]",
        load: () => Promise.resolve().then(() => (EKq(), vKq)),
        userFacingName() {
            return "mcp"
        }
    }, kKq = DtY
})
// @from(Ln 409504, Col 4)
QxA = R((F8$, RKq) => {
    RKq.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then
    }
})
// @from(Ln 409509, Col 4)
Ge = R((MtY) => {
    var gxA, jtY = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
    MtY.getSymbolSize = function(q) {
        if (!q) throw Error('"version" cannot be null or undefined');
        if (q < 1 || q > 40) throw Error('"version" should be in range from 1 to 40');
        return q * 4 + 17
    };
    MtY.getSymbolTotalCodewords = function(q) {
        return jtY[q]
    };
    MtY.getBCHDigit = function(A) {
        let q = 0;
        while (A !== 0) q++, A >>>= 1;
        return q
    };
    MtY.setToSJISFunction = function(q) {
        if (typeof q !== "function") throw Error('"toSJISFunc" is not a valid function.');
        gxA = q
    };
    MtY.isKanjiModeEnabled = function() {
        return typeof gxA < "u"
    };
    MtY.toSJIS = function(q) {
        return gxA(q)
    }
})
// @from(Ln 409535, Col 4)
oV6 = R((TtY) => {
    TtY.L = {
        bit: 1
    };
    TtY.M = {
        bit: 0
    };
    TtY.Q = {
        bit: 3
    };
    TtY.H = {
        bit: 2
    };

    function NtY(A) {
        if (typeof A !== "string") throw Error("Param is not a string");
        switch (A.toLowerCase()) {
            case "l":
            case "low":
                return TtY.L;
            case "m":
            case "medium":
                return TtY.M;
            case "q":
            case "quartile":
                return TtY.Q;
            case "h":
            case "high":
                return TtY.H;
            default:
                throw Error("Unknown EC Level: " + A)
        }
    }
    TtY.isValid = function(q) {
        return q && typeof q.bit < "u" && q.bit >= 0 && q.bit < 4
    };
    TtY.from = function(q, K) {
        if (TtY.isValid(q)) return q;
        try {
            return NtY(q)
        } catch (Y) {
            return K
        }
    }
})
// @from(Ln 409580, Col 4)
uKq = R((U8$, bKq) => {
    function xKq() {
        this.buffer = [], this.length = 0
    }
    xKq.prototype = {
        get: function(A) {
            let q = Math.floor(A / 8);
            return (this.buffer[q] >>> 7 - A % 8 & 1) === 1
        },
        put: function(A, q) {
            for (let K = 0; K < q; K++) this.putBit((A >>> q - K - 1 & 1) === 1)
        },
        getLengthInBits: function() {
            return this.length
        },
        putBit: function(A) {
            let q = Math.floor(this.length / 8);
            if (this.buffer.length <= q) this.buffer.push(0);
            if (A) this.buffer[q] |= 128 >>> this.length % 8;
            this.length++
        }
    };
    bKq.exports = xKq
})
// @from(Ln 409604, Col 4)
mKq = R((p8$, BKq) => {
    function up1(A) {
        if (!A || A < 1) throw Error("BitMatrix size must be defined and greater than 0");
        this.size = A, this.data = new Uint8Array(A * A), this.reservedBit = new Uint8Array(A * A)
    }
    up1.prototype.set = function(A, q, K, Y) {
        let z = A * this.size + q;
        if (this.data[z] = K, Y) this.reservedBit[z] = !0
    };
    up1.prototype.get = function(A, q) {
        return this.data[A * this.size + q]
    };
    up1.prototype.xor = function(A, q, K) {
        this.data[A * this.size + q] ^= K
    };
    up1.prototype.isReserved = function(A, q) {
        return this.reservedBit[A * this.size + q]
    };
    BKq.exports = up1
})
// @from(Ln 409624, Col 4)
QKq = R((ktY) => {
    var EtY = Ge().getSymbolSize;
    ktY.getRowColCoords = function(q) {
        if (q === 1) return [];
        let K = Math.floor(q / 7) + 2,
            Y = EtY(q),
            z = Y === 145 ? 26 : Math.ceil((Y - 13) / (2 * K - 2)) * 2,
            w = [Y - 7];
        for (let H = 1; H < K - 1; H++) w[H] = w[H - 1] - z;
        return w.push(6), w.reverse()
    };
    ktY.getPositions = function(q) {
        let K = [],
            Y = ktY.getRowColCoords(q),
            z = Y.length;
        for (let w = 0; w < z; w++)
            for (let H = 0; H < z; H++) {
                if (w === 0 && H === 0 || w === 0 && H === z - 1 || w === z - 1 && H === 0) continue;
                K.push([Y[w], Y[H]])
            }
        return K
    }
})
// @from(Ln 409647, Col 4)
gKq = R((ytY) => {
    var RtY = Ge().getSymbolSize;
    ytY.getPositions = function(q) {
        let K = RtY(q);
        return [
            [0, 0],
            [K - 7, 0],
            [0, K - 7]
        ]
    }
})
// @from(Ln 409658, Col 4)
iKq = R((htY) => {
    htY.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };
    var B91 = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
    };
    htY.isValid = function(q) {
        return q != null && q !== "" && !isNaN(q) && q >= 0 && q <= 7
    };
    htY.from = function(q) {
        return htY.isValid(q) ? parseInt(q, 10) : void 0
    };
    htY.getPenaltyN1 = function(q) {
        let K = q.size,
            Y = 0,
            z = 0,
            w = 0,
            H = null,
            $ = null;
        for (let O = 0; O < K; O++) {
            z = w = 0, H = $ = null;
            for (let _ = 0; _ < K; _++) {
                let J = q.get(O, _);
                if (J === H) z++;
                else {
                    if (z >= 5) Y += B91.N1 + (z - 5);
                    H = J, z = 1
                }
                if (J = q.get(_, O), J === $) w++;
                else {
                    if (w >= 5) Y += B91.N1 + (w - 5);
                    $ = J, w = 1
                }
            }
            if (z >= 5) Y += B91.N1 + (z - 5);
            if (w >= 5) Y += B91.N1 + (w - 5)
        }
        return Y
    };
    htY.getPenaltyN2 = function(q) {
        let K = q.size,
            Y = 0;
        for (let z = 0; z < K - 1; z++)
            for (let w = 0; w < K - 1; w++) {
                let H = q.get(z, w) + q.get(z, w + 1) + q.get(z + 1, w) + q.get(z + 1, w + 1);
                if (H === 4 || H === 0) Y++
            }
        return Y * B91.N2
    };
    htY.getPenaltyN3 = function(q) {
        let K = q.size,
            Y = 0,
            z = 0,
            w = 0;
        for (let H = 0; H < K; H++) {
            z = w = 0;
            for (let $ = 0; $ < K; $++) {
                if (z = z << 1 & 2047 | q.get(H, $), $ >= 10 && (z === 1488 || z === 93)) Y++;
                if (w = w << 1 & 2047 | q.get($, H), $ >= 10 && (w === 1488 || w === 93)) Y++
            }
        }
        return Y * B91.N3
    };
    htY.getPenaltyN4 = function(q) {
        let K = 0,
            Y = q.data.length;
        for (let w = 0; w < Y; w++) K += q.data[w];
        return Math.abs(Math.ceil(K * 100 / Y / 5) - 10) * B91.N4
    };

    function StY(A, q, K) {
        switch (A) {
            case htY.Patterns.PATTERN000:
                return (q + K) % 2 === 0;
            case htY.Patterns.PATTERN001:
                return q % 2 === 0;
            case htY.Patterns.PATTERN010:
                return K % 3 === 0;
            case htY.Patterns.PATTERN011:
                return (q + K) % 3 === 0;
            case htY.Patterns.PATTERN100:
                return (Math.floor(q / 2) + Math.floor(K / 3)) % 2 === 0;
            case htY.Patterns.PATTERN101:
                return q * K % 2 + q * K % 3 === 0;
            case htY.Patterns.PATTERN110:
                return (q * K % 2 + q * K % 3) % 2 === 0;
            case htY.Patterns.PATTERN111:
                return (q * K % 3 + (q + K) % 2) % 2 === 0;
            default:
                throw Error("bad maskPattern:" + A)
        }
    }
    htY.applyMask = function(q, K) {
        let Y = K.size;
        for (let z = 0; z < Y; z++)
            for (let w = 0; w < Y; w++) {
                if (K.isReserved(w, z)) continue;
                K.xor(w, z, StY(q, w, z))
            }
    };
    htY.getBestMask = function(q, K) {
        let Y = Object.keys(htY.Patterns).length,
            z = 0,
            w = 1 / 0;
        for (let H = 0; H < Y; H++) {
            K(H), htY.applyMask(H, q);
            let $ = htY.getPenaltyN1(q) + htY.getPenaltyN2(q) + htY.getPenaltyN3(q) + htY.getPenaltyN4(q);
            if (htY.applyMask(H, q), $ < w) w = $, z = H
        }
        return z
    }
})
// @from(Ln 409781, Col 4)
pxA = R((btY) => {
    var Ze = oV6(),
        aV6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81],
        sV6 = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
    btY.getBlocksCount = function(q, K) {
        switch (K) {
            case Ze.L:
                return aV6[(q - 1) * 4 + 0];
            case Ze.M:
                return aV6[(q - 1) * 4 + 1];
            case Ze.Q:
                return aV6[(q - 1) * 4 + 2];
            case Ze.H:
                return aV6[(q - 1) * 4 + 3];
            default:
                return
        }
    };
    btY.getTotalCodewordsCount = function(q, K) {
        switch (K) {
            case Ze.L:
                return sV6[(q - 1) * 4 + 0];
            case Ze.M:
                return sV6[(q - 1) * 4 + 1];
            case Ze.Q:
                return sV6[(q - 1) * 4 + 2];
            case Ze.H:
                return sV6[(q - 1) * 4 + 3];
            default:
                return
        }
    }
})
// @from(Ln 409814, Col 4)
nKq = R((mtY) => {
    var Bp1 = new Uint8Array(512),
        tV6 = new Uint8Array(256);
    (function() {
        let q = 1;
        for (let K = 0; K < 255; K++)
            if (Bp1[K] = q, tV6[q] = K, q <<= 1, q & 256) q ^= 285;
        for (let K = 255; K < 512; K++) Bp1[K] = Bp1[K - 255]
    })();
    mtY.log = function(q) {
        if (q < 1) throw Error("log(" + q + ")");
        return tV6[q]
    };
    mtY.exp = function(q) {
        return Bp1[q]
    };
    mtY.mul = function(q, K) {
        if (q === 0 || K === 0) return 0;
        return Bp1[tV6[q] + tV6[K]]
    }
})
// @from(Ln 409835, Col 4)
oKq = R((UtY) => {
    var dxA = nKq();
    UtY.mul = function(q, K) {
        let Y = new Uint8Array(q.length + K.length - 1);
        for (let z = 0; z < q.length; z++)
            for (let w = 0; w < K.length; w++) Y[z + w] ^= dxA.mul(q[z], K[w]);
        return Y
    };
    UtY.mod = function(q, K) {
        let Y = new Uint8Array(q);
        while (Y.length - K.length >= 0) {
            let z = Y[0];
            for (let H = 0; H < K.length; H++) Y[H] ^= dxA.mul(K[H], z);
            let w = 0;
            while (w < Y.length && Y[w] === 0) w++;
            Y = Y.slice(w)
        }
        return Y
    };
    UtY.generateECPolynomial = function(q) {
        let K = new Uint8Array([1]);
        for (let Y = 0; Y < q; Y++) K = UtY.mul(K, new Uint8Array([1, dxA.exp(Y)]));
        return K
    }
})
// @from(Ln 409860, Col 4)
tKq = R((o8$, sKq) => {
    var aKq = oKq();

    function cxA(A) {
        if (this.genPoly = void 0, this.degree = A, this.degree) this.initialize(this.degree)
    }
    cxA.prototype.initialize = function(q) {
        this.degree = q, this.genPoly = aKq.generateECPolynomial(this.degree)
    };
    cxA.prototype.encode = function(q) {
        if (!this.genPoly) throw Error("Encoder not initialized");
        let K = new Uint8Array(q.length + this.degree);
        K.set(q);
        let Y = aKq.mod(K, this.genPoly),
            z = this.degree - Y.length;
        if (z > 0) {
            let w = new Uint8Array(this.degree);
            return w.set(Y, z), w
        }
        return Y
    };
    sKq.exports = cxA
})
// @from(Ln 409883, Col 4)
lxA = R((ctY) => {
    ctY.isValid = function(q) {
        return !isNaN(q) && q >= 1 && q <= 40
    }
})
// @from(Ln 409888, Col 4)
ixA = R((atY) => {
    var mp1 = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    mp1 = mp1.replace(/u/g, "\\u");
    var itY = "(?:(?![A-Z0-9 $%*+\\-./:]|" + mp1 + `)(?:.|[\r
]))+`;
    atY.KANJI = new RegExp(mp1, "g");
    atY.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    atY.BYTE = new RegExp(itY, "g");
    atY.NUMERIC = new RegExp("[0-9]+", "g");
    atY.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g");
    var ntY = new RegExp("^" + mp1 + "$"),
        rtY = new RegExp("^[0-9]+$"),
        otY = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    atY.testKanji = function(q) {
        return ntY.test(q)
    };
    atY.testNumeric = function(q) {
        return rtY.test(q)
    };
    atY.testAlphanumeric = function(q) {
        return otY.test(q)
    }
})
// @from(Ln 409911, Col 4)
fe = R(($eY) => {
    var weY = lxA(),
        nxA = ixA();
    $eY.NUMERIC = {
        id: "Numeric",
        bit: 1,
        ccBits: [10, 12, 14]
    };
    $eY.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 2,
        ccBits: [9, 11, 13]
    };
    $eY.BYTE = {
        id: "Byte",
        bit: 4,
        ccBits: [8, 16, 16]
    };
    $eY.KANJI = {
        id: "Kanji",
        bit: 8,
        ccBits: [8, 10, 12]
    };
    $eY.MIXED = {
        bit: -1
    };
    $eY.getCharCountIndicator = function(q, K) {
        if (!q.ccBits) throw Error("Invalid mode: " + q);
        if (!weY.isValid(K)) throw Error("Invalid version: " + K);
        if (K >= 1 && K < 10) return q.ccBits[0];
        else if (K < 27) return q.ccBits[1];
        return q.ccBits[2]
    };
    $eY.getBestModeForData = function(q) {
        if (nxA.testNumeric(q)) return $eY.NUMERIC;
        else if (nxA.testAlphanumeric(q)) return $eY.ALPHANUMERIC;
        else if (nxA.testKanji(q)) return $eY.KANJI;
        else return $eY.BYTE
    };
    $eY.toString = function(q) {
        if (q && q.id) return q.id;
        throw Error("Invalid mode")
    };
    $eY.isValid = function(q) {
        return q && q.bit && q.ccBits
    };

    function HeY(A) {
        if (typeof A !== "string") throw Error("Param is not a string");
        switch (A.toLowerCase()) {
            case "numeric":
                return $eY.NUMERIC;
            case "alphanumeric":
                return $eY.ALPHANUMERIC;
            case "kanji":
                return $eY.KANJI;
            case "byte":
                return $eY.BYTE;
            default:
                throw Error("Unknown mode: " + A)
        }
    }
    $eY.from = function(q, K) {
        if ($eY.isValid(q)) return q;
        try {
            return HeY(q)
        } catch (Y) {
            return K
        }
    }
})
// @from(Ln 409982, Col 4)
z3q = R((GeY) => {
    var eV6 = Ge(),
        jeY = pxA(),
        A3q = oV6(),
        Ve = fe(),
        txA = lxA(),
        q3q = eV6.getBCHDigit(7973);

    function MeY(A, q, K) {
        for (let Y = 1; Y <= 40; Y++)
            if (q <= GeY.getCapacity(Y, K, A)) return Y;
        return
    }

    function K3q(A, q) {
        return Ve.getCharCountIndicator(A, q) + 4
    }

    function PeY(A, q) {
        let K = 0;
        return A.forEach(function(Y) {
            let z = K3q(Y.mode, q);
            K += z + Y.getBitsLength()
        }), K
    }

    function WeY(A, q) {
        for (let K = 1; K <= 40; K++)
            if (PeY(A, K) <= GeY.getCapacity(K, q, Ve.MIXED)) return K;
        return
    }
    GeY.from = function(q, K) {
        if (txA.isValid(q)) return parseInt(q, 10);
        return K
    };
    GeY.getCapacity = function(q, K, Y) {
        if (!txA.isValid(q)) throw Error("Invalid QR Code version");
        if (typeof Y > "u") Y = Ve.BYTE;
        let z = eV6.getSymbolTotalCodewords(q),
            w = jeY.getTotalCodewordsCount(q, K),
            H = (z - w) * 8;
        if (Y === Ve.MIXED) return H;
        let $ = H - K3q(Y, q);
        switch (Y) {
            case Ve.NUMERIC:
                return Math.floor($ / 10 * 3);
            case Ve.ALPHANUMERIC:
                return Math.floor($ / 11 * 2);
            case Ve.KANJI:
                return Math.floor($ / 13);
            case Ve.BYTE:
            default:
                return Math.floor($ / 8)
        }
    };
    GeY.getBestVersionForData = function(q, K) {
        let Y, z = A3q.from(K, A3q.M);
        if (Array.isArray(q)) {
            if (q.length > 1) return WeY(q, z);
            if (q.length === 0) return 1;
            Y = q[0]
        } else Y = q;
        return MeY(Y.mode, Y.getLength(), z)
    };
    GeY.getEncodedBits = function(q) {
        if (!txA.isValid(q) || q < 7) throw Error("Invalid QR Code version");
        let K = q << 12;
        while (eV6.getBCHDigit(K) - q3q >= 0) K ^= 7973 << eV6.getBCHDigit(K) - q3q;
        return q << 12 | K
    }
})
// @from(Ln 410053, Col 4)
H3q = R((NeY) => {
    var exA = Ge(),
        w3q = exA.getBCHDigit(1335);
    NeY.getEncodedBits = function(q, K) {
        let Y = q.bit << 3 | K,
            z = Y << 10;
        while (exA.getBCHDigit(z) - w3q >= 0) z ^= 1335 << exA.getBCHDigit(z) - w3q;
        return (Y << 10 | z) ^ 21522
    }
})
// @from(Ln 410063, Col 4)
O3q = R((q7$, $3q) => {
    var veY = fe();

    function LZ1(A) {
        this.mode = veY.NUMERIC, this.data = A.toString()
    }
    LZ1.getBitsLength = function(q) {
        return 10 * Math.floor(q / 3) + (q % 3 ? q % 3 * 3 + 1 : 0)
    };
    LZ1.prototype.getLength = function() {
        return this.data.length
    };
    LZ1.prototype.getBitsLength = function() {
        return LZ1.getBitsLength(this.data.length)
    };
    LZ1.prototype.write = function(q) {
        let K, Y, z;
        for (K = 0; K + 3 <= this.data.length; K += 3) Y = this.data.substr(K, 3), z = parseInt(Y, 10), q.put(z, 10);
        let w = this.data.length - K;
        if (w > 0) Y = this.data.substr(K), z = parseInt(Y, 10), q.put(z, w * 3 + 1)
    };
    $3q.exports = LZ1
})
// @from(Ln 410086, Col 4)
J3q = R((K7$, _3q) => {
    var EeY = fe(),
        AbA = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];

    function RZ1(A) {
        this.mode = EeY.ALPHANUMERIC, this.data = A
    }
    RZ1.getBitsLength = function(q) {
        return 11 * Math.floor(q / 2) + 6 * (q % 2)
    };
    RZ1.prototype.getLength = function() {
        return this.data.length
    };
    RZ1.prototype.getBitsLength = function() {
        return RZ1.getBitsLength(this.data.length)
    };
    RZ1.prototype.write = function(q) {
        let K;
        for (K = 0; K + 2 <= this.data.length; K += 2) {
            let Y = AbA.indexOf(this.data[K]) * 45;
            Y += AbA.indexOf(this.data[K + 1]), q.put(Y, 11)
        }
        if (this.data.length % 2) q.put(AbA.indexOf(this.data[K]), 6)
    };
    _3q.exports = RZ1
})
// @from(Ln 410112, Col 4)
D3q = R((Y7$, X3q) => {
    var keY = fe();

    function yZ1(A) {
        if (this.mode = keY.BYTE, typeof A === "string") this.data = new TextEncoder().encode(A);
        else this.data = new Uint8Array(A)
    }
    yZ1.getBitsLength = function(q) {
        return q * 8
    };
    yZ1.prototype.getLength = function() {
        return this.data.length
    };
    yZ1.prototype.getBitsLength = function() {
        return yZ1.getBitsLength(this.data.length)
    };
    yZ1.prototype.write = function(A) {
        for (let q = 0, K = this.data.length; q < K; q++) A.put(this.data[q], 8)
    };
    X3q.exports = yZ1
})
// @from(Ln 410133, Col 4)
M3q = R((z7$, j3q) => {
    var LeY = fe(),
        ReY = Ge();

    function CZ1(A) {
        this.mode = LeY.KANJI, this.data = A
    }
    CZ1.getBitsLength = function(q) {
        return q * 13
    };
    CZ1.prototype.getLength = function() {
        return this.data.length
    };
    CZ1.prototype.getBitsLength = function() {
        return CZ1.getBitsLength(this.data.length)
    };
    CZ1.prototype.write = function(A) {
        let q;
        for (q = 0; q < this.data.length; q++) {
            let K = ReY.toSJIS(this.data[q]);
            if (K >= 33088 && K <= 40956) K -= 33088;
            else if (K >= 57408 && K <= 60351) K -= 49472;
            else throw Error("Invalid SJIS character: " + this.data[q] + `
Make sure your charset is UTF-8`);
            K = (K >>> 8 & 255) * 192 + (K & 255), A.put(K, 13)
        }
    };
    j3q.exports = CZ1
})
// @from(Ln 410162, Col 4)
P3q = R((w7$, qbA) => {
    var Fp1 = {
        single_source_shortest_paths: function(A, q, K) {
            var Y = {},
                z = {};
            z[q] = 0;
            var w = Fp1.PriorityQueue.make();
            w.push(q, 0);
            var H, $, O, _, J, X, D, j, M;
            while (!w.empty()) {
                H = w.pop(), $ = H.value, _ = H.cost, J = A[$] || {};
                for (O in J)
                    if (J.hasOwnProperty(O)) {
                        if (X = J[O], D = _ + X, j = z[O], M = typeof z[O] > "u", M || j > D) z[O] = D, w.push(O, D), Y[O] = $
                    }
            }
            if (typeof K < "u" && typeof z[K] > "u") {
                var P = ["Could not find a path from ", q, " to ", K, "."].join("");
                throw Error(P)
            }
            return Y
        },
        extract_shortest_path_from_predecessor_list: function(A, q) {
            var K = [],
                Y = q,
                z;
            while (Y) K.push(Y), z = A[Y], Y = A[Y];
            return K.reverse(), K
        },
        find_path: function(A, q, K) {
            var Y = Fp1.single_source_shortest_paths(A, q, K);
            return Fp1.extract_shortest_path_from_predecessor_list(Y, K)
        },
        PriorityQueue: {
            make: function(A) {
                var q = Fp1.PriorityQueue,
                    K = {},
                    Y;
                A = A || {};
                for (Y in q)
                    if (q.hasOwnProperty(Y)) K[Y] = q[Y];
                return K.queue = [], K.sorter = A.sorter || q.default_sorter, K
            },
            default_sorter: function(A, q) {
                return A.cost - q.cost
            },
            push: function(A, q) {
                var K = {
                    value: A,
                    cost: q
                };
                this.queue.push(K), this.queue.sort(this.sorter)
            },
            pop: function() {
                return this.queue.shift()
            },
            empty: function() {
                return this.queue.length === 0
            }
        }
    };
    if (typeof qbA < "u") qbA.exports = Fp1
})
// @from(Ln 410225, Col 4)
v3q = R((IeY) => {
    var $2 = fe(),
        Z3q = O3q(),
        f3q = J3q(),
        V3q = D3q(),
        N3q = M3q(),
        Qp1 = ixA(),
        AN6 = Ge(),
        yeY = P3q();

    function W3q(A) {
        return unescape(encodeURIComponent(A)).length
    }

    function gp1(A, q, K) {
        let Y = [],
            z;
        while ((z = A.exec(K)) !== null) Y.push({
            data: z[0],
            index: z.index,
            mode: q,
            length: z[0].length
        });
        return Y
    }

    function T3q(A) {
        let q = gp1(Qp1.NUMERIC, $2.NUMERIC, A),
            K = gp1(Qp1.ALPHANUMERIC, $2.ALPHANUMERIC, A),
            Y, z;
        if (AN6.isKanjiModeEnabled()) Y = gp1(Qp1.BYTE, $2.BYTE, A), z = gp1(Qp1.KANJI, $2.KANJI, A);
        else Y = gp1(Qp1.BYTE_KANJI, $2.BYTE, A), z = [];
        return q.concat(K, Y, z).sort(function(H, $) {
            return H.index - $.index
        }).map(function(H) {
            return {
                data: H.data,
                mode: H.mode,
                length: H.length
            }
        })
    }

    function KbA(A, q) {
        switch (q) {
            case $2.NUMERIC:
                return Z3q.getBitsLength(A);
            case $2.ALPHANUMERIC:
                return f3q.getBitsLength(A);
            case $2.KANJI:
                return N3q.getBitsLength(A);
            case $2.BYTE:
                return V3q.getBitsLength(A)
        }
    }

    function CeY(A) {
        return A.reduce(function(q, K) {
            let Y = q.length - 1 >= 0 ? q[q.length - 1] : null;
            if (Y && Y.mode === K.mode) return q[q.length - 1].data += K.data, q;
            return q.push(K), q
        }, [])
    }

    function SeY(A) {
        let q = [];
        for (let K = 0; K < A.length; K++) {
            let Y = A[K];
            switch (Y.mode) {
                case $2.NUMERIC:
                    q.push([Y, {
                        data: Y.data,
                        mode: $2.ALPHANUMERIC,
                        length: Y.length
                    }, {
                        data: Y.data,
                        mode: $2.BYTE,
                        length: Y.length
                    }]);
                    break;
                case $2.ALPHANUMERIC:
                    q.push([Y, {
                        data: Y.data,
                        mode: $2.BYTE,
                        length: Y.length
                    }]);
                    break;
                case $2.KANJI:
                    q.push([Y, {
                        data: Y.data,
                        mode: $2.BYTE,
                        length: W3q(Y.data)
                    }]);
                    break;
                case $2.BYTE:
                    q.push([{
                        data: Y.data,
                        mode: $2.BYTE,
                        length: W3q(Y.data)
                    }])
            }
        }
        return q
    }

    function heY(A, q) {
        let K = {},
            Y = {
                start: {}
            },
            z = ["start"];
        for (let w = 0; w < A.length; w++) {
            let H = A[w],
                $ = [];
            for (let O = 0; O < H.length; O++) {
                let _ = H[O],
                    J = "" + w + O;
                $.push(J), K[J] = {
                    node: _,
                    lastCount: 0
                }, Y[J] = {};
                for (let X = 0; X < z.length; X++) {
                    let D = z[X];
                    if (K[D] && K[D].node.mode === _.mode) Y[D][J] = KbA(K[D].lastCount + _.length, _.mode) - KbA(K[D].lastCount, _.mode), K[D].lastCount += _.length;
                    else {
                        if (K[D]) K[D].lastCount = _.length;
                        Y[D][J] = KbA(_.length, _.mode) + 4 + $2.getCharCountIndicator(_.mode, q)
                    }
                }
            }
            z = $
        }
        for (let w = 0; w < z.length; w++) Y[z[w]].end = 0;
        return {
            map: Y,
            table: K
        }
    }

    function G3q(A, q) {
        let K, Y = $2.getBestModeForData(A);
        if (K = $2.from(q, Y), K !== $2.BYTE && K.bit < Y.bit) throw Error('"' + A + '" cannot be encoded with mode ' + $2.toString(K) + `.
 Suggested mode is: ` + $2.toString(Y));
        if (K === $2.KANJI && !AN6.isKanjiModeEnabled()) K = $2.BYTE;
        switch (K) {
            case $2.NUMERIC:
                return new Z3q(A);
            case $2.ALPHANUMERIC:
                return new f3q(A);
            case $2.KANJI:
                return new N3q(A);
            case $2.BYTE:
                return new V3q(A)
        }
    }
    IeY.fromArray = function(q) {
        return q.reduce(function(K, Y) {
            if (typeof Y === "string") K.push(G3q(Y, null));
            else if (Y.data) K.push(G3q(Y.data, Y.mode));
            return K
        }, [])
    };
    IeY.fromString = function(q, K) {
        let Y = T3q(q, AN6.isKanjiModeEnabled()),
            z = SeY(Y),
            w = heY(z, K),
            H = yeY.find_path(w.map, "start", "end"),
            $ = [];
        for (let O = 1; O < H.length - 1; O++) $.push(w.table[H[O]].node);
        return IeY.fromArray(CeY($))
    };
    IeY.rawSplit = function(q) {
        return IeY.fromArray(T3q(q, AN6.isKanjiModeEnabled()))
    }
})
// @from(Ln 410400, Col 4)
_bA = R((aeY) => {
    var KN6 = Ge(),
        zbA = oV6(),
        ueY = uKq(),
        BeY = mKq(),
        meY = QKq(),
        FeY = gKq(),
        $bA = iKq(),
        ObA = pxA(),
        QeY = tKq(),
        qN6 = z3q(),
        geY = H3q(),
        UeY = fe(),
        wbA = v3q();

    function peY(A, q) {
        let K = A.size,
            Y = FeY.getPositions(q);
        for (let z = 0; z < Y.length; z++) {
            let w = Y[z][0],
                H = Y[z][1];
            for (let $ = -1; $ <= 7; $++) {
                if (w + $ <= -1 || K <= w + $) continue;
                for (let O = -1; O <= 7; O++) {
                    if (H + O <= -1 || K <= H + O) continue;
                    if ($ >= 0 && $ <= 6 && (O === 0 || O === 6) || O >= 0 && O <= 6 && ($ === 0 || $ === 6) || $ >= 2 && $ <= 4 && O >= 2 && O <= 4) A.set(w + $, H + O, !0, !0);
                    else A.set(w + $, H + O, !1, !0)
                }
            }
        }
    }

    function deY(A) {
        let q = A.size;
        for (let K = 8; K < q - 8; K++) {
            let Y = K % 2 === 0;
            A.set(K, 6, Y, !0), A.set(6, K, Y, !0)
        }
    }

    function ceY(A, q) {
        let K = meY.getPositions(q);
        for (let Y = 0; Y < K.length; Y++) {
            let z = K[Y][0],
                w = K[Y][1];
            for (let H = -2; H <= 2; H++)
                for (let $ = -2; $ <= 2; $++)
                    if (H === -2 || H === 2 || $ === -2 || $ === 2 || H === 0 && $ === 0) A.set(z + H, w + $, !0, !0);
                    else A.set(z + H, w + $, !1, !0)
        }
    }

    function leY(A, q) {
        let K = A.size,
            Y = qN6.getEncodedBits(q),
            z, w, H;
        for (let $ = 0; $ < 18; $++) z = Math.floor($ / 3), w = $ % 3 + K - 8 - 3, H = (Y >> $ & 1) === 1, A.set(z, w, H, !0), A.set(w, z, H, !0)
    }

    function HbA(A, q, K) {
        let Y = A.size,
            z = geY.getEncodedBits(q, K),
            w, H;
        for (w = 0; w < 15; w++) {
            if (H = (z >> w & 1) === 1, w < 6) A.set(w, 8, H, !0);
            else if (w < 8) A.set(w + 1, 8, H, !0);
            else A.set(Y - 15 + w, 8, H, !0);
            if (w < 8) A.set(8, Y - w - 1, H, !0);
            else if (w < 9) A.set(8, 15 - w - 1 + 1, H, !0);
            else A.set(8, 15 - w - 1, H, !0)
        }
        A.set(Y - 8, 8, 1, !0)
    }

    function ieY(A, q) {
        let K = A.size,
            Y = -1,
            z = K - 1,
            w = 7,
            H = 0;
        for (let $ = K - 1; $ > 0; $ -= 2) {
            if ($ === 6) $--;
            while (!0) {
                for (let O = 0; O < 2; O++)
                    if (!A.isReserved(z, $ - O)) {
                        let _ = !1;
                        if (H < q.length) _ = (q[H] >>> w & 1) === 1;
                        if (A.set(z, $ - O, _), w--, w === -1) H++, w = 7
                    } if (z += Y, z < 0 || K <= z) {
                    z -= Y, Y = -Y;
                    break
                }
            }
        }
    }

    function neY(A, q, K) {
        let Y = new ueY;
        K.forEach(function(O) {
            Y.put(O.mode.bit, 4), Y.put(O.getLength(), UeY.getCharCountIndicator(O.mode, A)), O.write(Y)
        });
        let z = KN6.getSymbolTotalCodewords(A),
            w = ObA.getTotalCodewordsCount(A, q),
            H = (z - w) * 8;
        if (Y.getLengthInBits() + 4 <= H) Y.put(0, 4);
        while (Y.getLengthInBits() % 8 !== 0) Y.putBit(0);
        let $ = (H - Y.getLengthInBits()) / 8;
        for (let O = 0; O < $; O++) Y.put(O % 2 ? 17 : 236, 8);
        return reY(Y, A, q)
    }

    function reY(A, q, K) {
        let Y = KN6.getSymbolTotalCodewords(q),
            z = ObA.getTotalCodewordsCount(q, K),
            w = Y - z,
            H = ObA.getBlocksCount(q, K),
            $ = Y % H,
            O = H - $,
            _ = Math.floor(Y / H),
            J = Math.floor(w / H),
            X = J + 1,
            D = _ - J,
            j = new QeY(D),
            M = 0,
            P = Array(H),
            W = Array(H),
            G = 0,
            f = new Uint8Array(A.buffer);
        for (let y = 0; y < H; y++) {
            let B = y < O ? J : X;
            P[y] = f.slice(M, M + B), W[y] = j.encode(P[y]), M += B, G = Math.max(G, B)
        }
        let Z = new Uint8Array(Y),
            N = 0,
            T, k;
        for (T = 0; T < G; T++)
            for (k = 0; k < H; k++)
                if (T < P[k].length) Z[N++] = P[k][T];
        for (T = 0; T < D; T++)
            for (k = 0; k < H; k++) Z[N++] = W[k][T];
        return Z
    }

    function oeY(A, q, K, Y) {
        let z;
        if (Array.isArray(A)) z = wbA.fromArray(A);
        else if (typeof A === "string") {
            let _ = q;
            if (!_) {
                let J = wbA.rawSplit(A);
                _ = qN6.getBestVersionForData(J, K)
            }
            z = wbA.fromString(A, _ || 40)
        } else throw Error("Invalid data");
        let w = qN6.getBestVersionForData(z, K);
        if (!w) throw Error("The amount of data is too big to be stored in a QR Code");
        if (!q) q = w;
        else if (q < w) throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + w + `.
`);
        let H = neY(q, K, z),
            $ = KN6.getSymbolSize(q),
            O = new BeY($);
        if (peY(O, q), deY(O), ceY(O, q), HbA(O, K, 0), q >= 7) leY(O, q);
        if (ieY(O, H), isNaN(Y)) Y = $bA.getBestMask(O, HbA.bind(null, O, K));
        return $bA.applyMask(Y, O), HbA(O, K, Y), {
            modules: O,
            version: q,
            errorCorrectionLevel: K,
            maskPattern: Y,
            segments: z
        }
    }
    aeY.create = function(q, K) {
        if (typeof q > "u" || q === "") throw Error("No input text");
        let Y = zbA.M,
            z, w;
        if (typeof K < "u") {
            if (Y = zbA.from(K.errorCorrectionLevel, zbA.M), z = qN6.from(K.version), w = $bA.from(K.maskPattern), K.toSJISFunc) KN6.setToSJISFunction(K.toSJISFunc)
        }
        return oeY(q, z, Y, w)
    }
})
// @from(Ln 410584, Col 4)
JbA = R((O7$, k3q) => {
    var teY = h1("util"),
        E3q = h1("stream"),
        gI = k3q.exports = function() {
            E3q.call(this), this._buffers = [], this._buffered = 0, this._reads = [], this._paused = !1, this._encoding = "utf8", this.writable = !0
        };
    teY.inherits(gI, E3q);
    gI.prototype.read = function(A, q) {
        this._reads.push({
            length: Math.abs(A),
            allowLess: A < 0,
            func: q
        }), process.nextTick(function() {
            if (this._process(), this._paused && this._reads && this._reads.length > 0) this._paused = !1, this.emit("drain")
        }.bind(this))
    };
    gI.prototype.write = function(A, q) {
        if (!this.writable) return this.emit("error", Error("Stream not writable")), !1;
        let K;
        if (Buffer.isBuffer(A)) K = A;
        else K = Buffer.from(A, q || this._encoding);
        if (this._buffers.push(K), this._buffered += K.length, this._process(), this._reads && this._reads.length === 0) this._paused = !0;
        return this.writable && !this._paused
    };
    gI.prototype.end = function(A, q) {
        if (A) this.write(A, q);
        if (this.writable = !1, !this._buffers) return;
        if (this._buffers.length === 0) this._end();
        else this._buffers.push(null), this._process()
    };
    gI.prototype.destroySoon = gI.prototype.end;
    gI.prototype._end = function() {
        if (this._reads.length > 0) this.emit("error", Error("Unexpected end of input"));
        this.destroy()
    };
    gI.prototype.destroy = function() {
        if (!this._buffers) return;
        this.writable = !1, this._reads = null, this._buffers = null, this.emit("close")
    };
    gI.prototype._processReadAllowingLess = function(A) {
        this._reads.shift();
        let q = this._buffers[0];
        if (q.length > A.length) this._buffered -= A.length, this._buffers[0] = q.slice(A.length), A.func.call(this, q.slice(0, A.length));
        else this._buffered -= q.length, this._buffers.shift(), A.func.call(this, q)
    };
    gI.prototype._processRead = function(A) {
        this._reads.shift();
        let q = 0,
            K = 0,
            Y = Buffer.alloc(A.length);
        while (q < A.length) {
            let z = this._buffers[K++],
                w = Math.min(z.length, A.length - q);
            if (z.copy(Y, q, 0, w), q += w, w !== z.length) this._buffers[--K] = z.slice(w)
        }
        if (K > 0) this._buffers.splice(0, K);
        this._buffered -= A.length, A.func.call(this, Y)
    };
    gI.prototype._process = function() {
        try {
            while (this._buffered > 0 && this._reads && this._reads.length > 0) {
                let A = this._reads[0];
                if (A.allowLess) this._processReadAllowingLess(A);
                else if (this._buffered >= A.length) this._processRead(A);
                else break
            }
            if (this._buffers && !this.writable) this._end()
        } catch (A) {
            this.emit("error", A)
        }
    }
})
// @from(Ln 410656, Col 4)
XbA = R((eeY) => {
    var Ne = [{
        x: [0],
        y: [0]
    }, {
        x: [4],
        y: [0]
    }, {
        x: [0, 4],
        y: [4]
    }, {
        x: [2, 6],
        y: [0, 4]
    }, {
        x: [0, 2, 4, 6],
        y: [2, 6]
    }, {
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
    }, {
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
    }];
    eeY.getImagePasses = function(A, q) {
        let K = [],
            Y = A % 8,
            z = q % 8,
            w = (A - Y) / 8,
            H = (q - z) / 8;
        for (let $ = 0; $ < Ne.length; $++) {
            let O = Ne[$],
                _ = w * O.x.length,
                J = H * O.y.length;
            for (let X = 0; X < O.x.length; X++)
                if (O.x[X] < Y) _++;
                else break;
            for (let X = 0; X < O.y.length; X++)
                if (O.y[X] < z) J++;
                else break;
            if (_ > 0 && J > 0) K.push({
                width: _,
                height: J,
                index: $
            })
        }
        return K
    };
    eeY.getInterlaceIterator = function(A) {
        return function(q, K, Y) {
            let z = q % Ne[Y].x.length,
                w = (q - z) / Ne[Y].x.length * 8 + Ne[Y].x[z],
                H = K % Ne[Y].y.length,
                $ = (K - H) / Ne[Y].y.length * 8 + Ne[Y].y[H];
            return w * 4 + $ * A * 4
        }
    }
})
// @from(Ln 410713, Col 4)
DbA = R((J7$, L3q) => {
    L3q.exports = function(q, K, Y) {
        let z = q + K - Y,
            w = Math.abs(z - q),
            H = Math.abs(z - K),
            $ = Math.abs(z - Y);
        if (w <= H && w <= $) return q;
        if (H <= $) return K;
        return Y
    }
})
// @from(Ln 410724, Col 4)
jbA = R((X7$, y3q) => {
    var K1z = XbA(),
        Y1z = DbA();

    function R3q(A, q, K) {
        let Y = A * q;
        if (K !== 8) Y = Math.ceil(Y / (8 / K));
        return Y
    }
    var SZ1 = y3q.exports = function(A, q) {
        let {
            width: K,
            height: Y,
            interlace: z,
            bpp: w,
            depth: H
        } = A;
        if (this.read = q.read, this.write = q.write, this.complete = q.complete, this._imageIndex = 0, this._images = [], z) {
            let $ = K1z.getImagePasses(K, Y);
            for (let O = 0; O < $.length; O++) this._images.push({
                byteWidth: R3q($[O].width, w, H),
                height: $[O].height,
                lineIndex: 0
            })
        } else this._images.push({
            byteWidth: R3q(K, w, H),
            height: Y,
            lineIndex: 0
        });
        if (H === 8) this._xComparison = w;
        else if (H === 16) this._xComparison = w * 2;
        else this._xComparison = 1
    };
    SZ1.prototype.start = function() {
        this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this))
    };
    SZ1.prototype._unFilterType1 = function(A, q, K) {
        let Y = this._xComparison,
            z = Y - 1;
        for (let w = 0; w < K; w++) {
            let H = A[1 + w],
                $ = w > z ? q[w - Y] : 0;
            q[w] = H + $
        }
    };
    SZ1.prototype._unFilterType2 = function(A, q, K) {
        let Y = this._lastLine;
        for (let z = 0; z < K; z++) {
            let w = A[1 + z],
                H = Y ? Y[z] : 0;
            q[z] = w + H
        }
    };
    SZ1.prototype._unFilterType3 = function(A, q, K) {
        let Y = this._xComparison,
            z = Y - 1,
            w = this._lastLine;
        for (let H = 0; H < K; H++) {
            let $ = A[1 + H],
                O = w ? w[H] : 0,
                _ = H > z ? q[H - Y] : 0,
                J = Math.floor((_ + O) / 2);
            q[H] = $ + J
        }
    };
    SZ1.prototype._unFilterType4 = function(A, q, K) {
        let Y = this._xComparison,
            z = Y - 1,
            w = this._lastLine;
        for (let H = 0; H < K; H++) {
            let $ = A[1 + H],
                O = w ? w[H] : 0,
                _ = H > z ? q[H - Y] : 0,
                J = H > z && w ? w[H - Y] : 0,
                X = Y1z(_, O, J);
            q[H] = $ + X
        }
    };
    SZ1.prototype._reverseFilterLine = function(A) {
        let q = A[0],
            K, Y = this._images[this._imageIndex],
            z = Y.byteWidth;
        if (q === 0) K = A.slice(1, z + 1);
        else switch (K = Buffer.alloc(z), q) {
            case 1:
                this._unFilterType1(A, K, z);
                break;
            case 2:
                this._unFilterType2(A, K, z);
                break;
            case 3:
                this._unFilterType3(A, K, z);
                break;
            case 4:
                this._unFilterType4(A, K, z);
                break;
            default:
                throw Error("Unrecognised filter type - " + q)
        }
        if (this.write(K), Y.lineIndex++, Y.lineIndex >= Y.height) this._lastLine = null, this._imageIndex++, Y = this._images[this._imageIndex];
        else this._lastLine = K;
        if (Y) this.read(Y.byteWidth + 1, this._reverseFilterLine.bind(this));
        else this._lastLine = null, this.complete()
    }
})
// @from(Ln 410829, Col 4)
h3q = R((D7$, S3q) => {
    var z1z = h1("util"),
        C3q = JbA(),
        w1z = jbA(),
        H1z = S3q.exports = function(A) {
            C3q.call(this);
            let q = [],
                K = this;
            this._filter = new w1z(A, {
                read: this.read.bind(this),
                write: function(Y) {
                    q.push(Y)
                },
                complete: function() {
                    K.emit("complete", Buffer.concat(q))
                }
            }), this._filter.start()
        };
    z1z.inherits(H1z, C3q)
})
// @from(Ln 410849, Col 4)
hZ1 = R((j7$, I3q) => {
    I3q.exports = {
        PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
        TYPE_IHDR: 1229472850,
        TYPE_IEND: 1229278788,
        TYPE_IDAT: 1229209940,
        TYPE_PLTE: 1347179589,
        TYPE_tRNS: 1951551059,
        TYPE_gAMA: 1732332865,
        COLORTYPE_GRAYSCALE: 0,
        COLORTYPE_PALETTE: 1,
        COLORTYPE_COLOR: 2,
        COLORTYPE_ALPHA: 4,
        COLORTYPE_PALETTE_COLOR: 3,
        COLORTYPE_COLOR_ALPHA: 6,
        COLORTYPE_TO_BPP_MAP: {
            0: 1,
            2: 3,
            3: 1,
            4: 2,
            6: 4
        },
        GAMMA_DIVISION: 1e5
    }
})
// @from(Ln 410874, Col 4)
WbA = R((M7$, x3q) => {
    var MbA = [];
    (function() {
        for (let A = 0; A < 256; A++) {
            let q = A;
            for (let K = 0; K < 8; K++)
                if (q & 1) q = 3988292384 ^ q >>> 1;
                else q = q >>> 1;
            MbA[A] = q
        }
    })();
    var PbA = x3q.exports = function() {
        this._crc = -1
    };
    PbA.prototype.write = function(A) {
        for (let q = 0; q < A.length; q++) this._crc = MbA[(this._crc ^ A[q]) & 255] ^ this._crc >>> 8;
        return !0
    };
    PbA.prototype.crc32 = function() {
        return this._crc ^ -1
    };
    PbA.crc32 = function(A) {
        let q = -1;
        for (let K = 0; K < A.length; K++) q = MbA[(q ^ A[K]) & 255] ^ q >>> 8;
        return q ^ -1
    }
})
// @from(Ln 410901, Col 4)
GbA = R((P7$, b3q) => {
    var z0 = hZ1(),
        $1z = WbA(),
        yj = b3q.exports = function(A, q) {
            this._options = A, A.checkCRC = A.checkCRC !== !1, this._hasIHDR = !1, this._hasIEND = !1, this._emittedHeadersFinished = !1, this._palette = [], this._colorType = 0, this._chunks = {}, this._chunks[z0.TYPE_IHDR] = this._handleIHDR.bind(this), this._chunks[z0.TYPE_IEND] = this._handleIEND.bind(this), this._chunks[z0.TYPE_IDAT] = this._handleIDAT.bind(this), this._chunks[z0.TYPE_PLTE] = this._handlePLTE.bind(this), this._chunks[z0.TYPE_tRNS] = this._handleTRNS.bind(this), this._chunks[z0.TYPE_gAMA] = this._handleGAMA.bind(this), this.read = q.read, this.error = q.error, this.metadata = q.metadata, this.gamma = q.gamma, this.transColor = q.transColor, this.palette = q.palette, this.parsed = q.parsed, this.inflateData = q.inflateData, this.finished = q.finished, this.simpleTransparency = q.simpleTransparency, this.headersFinished = q.headersFinished || function() {}
        };
    yj.prototype.start = function() {
        this.read(z0.PNG_SIGNATURE.length, this._parseSignature.bind(this))
    };
    yj.prototype._parseSignature = function(A) {
        let q = z0.PNG_SIGNATURE;
        for (let K = 0; K < q.length; K++)
            if (A[K] !== q[K]) {
                this.error(Error("Invalid file signature"));
                return
            } this.read(8, this._parseChunkBegin.bind(this))
    };
    yj.prototype._parseChunkBegin = function(A) {
        let q = A.readUInt32BE(0),
            K = A.readUInt32BE(4),
            Y = "";
        for (let w = 4; w < 8; w++) Y += String.fromCharCode(A[w]);
        let z = Boolean(A[4] & 32);
        if (!this._hasIHDR && K !== z0.TYPE_IHDR) {
            this.error(Error("Expected IHDR on beggining"));
            return
        }
        if (this._crc = new $1z, this._crc.write(Buffer.from(Y)), this._chunks[K]) return this._chunks[K](q);
        if (!z) {
            this.error(Error("Unsupported critical chunk type " + Y));
            return
        }
        this.read(q + 4, this._skipChunk.bind(this))
    };
    yj.prototype._skipChunk = function() {
        this.read(8, this._parseChunkBegin.bind(this))
    };
    yj.prototype._handleChunkEnd = function() {
        this.read(4, this._parseChunkEnd.bind(this))
    };
    yj.prototype._parseChunkEnd = function(A) {
        let q = A.readInt32BE(0),
            K = this._crc.crc32();
        if (this._options.checkCRC && K !== q) {
            this.error(Error("Crc error - " + q + " - " + K));
            return
        }
        if (!this._hasIEND) this.read(8, this._parseChunkBegin.bind(this))
    };
    yj.prototype._handleIHDR = function(A) {
        this.read(A, this._parseIHDR.bind(this))
    };
    yj.prototype._parseIHDR = function(A) {
        this._crc.write(A);
        let q = A.readUInt32BE(0),
            K = A.readUInt32BE(4),
            Y = A[8],
            z = A[9],
            w = A[10],
            H = A[11],
            $ = A[12];
        if (Y !== 8 && Y !== 4 && Y !== 2 && Y !== 1 && Y !== 16) {
            this.error(Error("Unsupported bit depth " + Y));
            return
        }
        if (!(z in z0.COLORTYPE_TO_BPP_MAP)) {
            this.error(Error("Unsupported color type"));
            return
        }
        if (w !== 0) {
            this.error(Error("Unsupported compression method"));
            return
        }
        if (H !== 0) {
            this.error(Error("Unsupported filter method"));
            return
        }
        if ($ !== 0 && $ !== 1) {
            this.error(Error("Unsupported interlace method"));
            return
        }
        this._colorType = z;
        let O = z0.COLORTYPE_TO_BPP_MAP[this._colorType];
        this._hasIHDR = !0, this.metadata({
            width: q,
            height: K,
            depth: Y,
            interlace: Boolean($),
            palette: Boolean(z & z0.COLORTYPE_PALETTE),
            color: Boolean(z & z0.COLORTYPE_COLOR),
            alpha: Boolean(z & z0.COLORTYPE_ALPHA),
            bpp: O,
            colorType: z
        }), this._handleChunkEnd()
    };
    yj.prototype._handlePLTE = function(A) {
        this.read(A, this._parsePLTE.bind(this))
    };
    yj.prototype._parsePLTE = function(A) {
        this._crc.write(A);
        let q = Math.floor(A.length / 3);
        for (let K = 0; K < q; K++) this._palette.push([A[K * 3], A[K * 3 + 1], A[K * 3 + 2], 255]);
        this.palette(this._palette), this._handleChunkEnd()
    };
    yj.prototype._handleTRNS = function(A) {
        this.simpleTransparency(), this.read(A, this._parseTRNS.bind(this))
    };
    yj.prototype._parseTRNS = function(A) {
        if (this._crc.write(A), this._colorType === z0.COLORTYPE_PALETTE_COLOR) {
            if (this._palette.length === 0) {
                this.error(Error("Transparency chunk must be after palette"));
                return
            }
            if (A.length > this._palette.length) {
                this.error(Error("More transparent colors than palette size"));
                return
            }
            for (let q = 0; q < A.length; q++) this._palette[q][3] = A[q];
            this.palette(this._palette)
        }
        if (this._colorType === z0.COLORTYPE_GRAYSCALE) this.transColor([A.readUInt16BE(0)]);
        if (this._colorType === z0.COLORTYPE_COLOR) this.transColor([A.readUInt16BE(0), A.readUInt16BE(2), A.readUInt16BE(4)]);
        this._handleChunkEnd()
    };
    yj.prototype._handleGAMA = function(A) {
        this.read(A, this._parseGAMA.bind(this))
    };
    yj.prototype._parseGAMA = function(A) {
        this._crc.write(A), this.gamma(A.readUInt32BE(0) / z0.GAMMA_DIVISION), this._handleChunkEnd()
    };
    yj.prototype._handleIDAT = function(A) {
        if (!this._emittedHeadersFinished) this._emittedHeadersFinished = !0, this.headersFinished();
        this.read(-A, this._parseIDAT.bind(this, A))
    };
    yj.prototype._parseIDAT = function(A, q) {
        if (this._crc.write(q), this._colorType === z0.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) throw Error("Expected palette not found");
        this.inflateData(q);
        let K = A - q.length;
        if (K > 0) this._handleIDAT(K);
        else this._handleChunkEnd()
    };
    yj.prototype._handleIEND = function(A) {
        this.read(A, this._parseIEND.bind(this))
    };
    yj.prototype._parseIEND = function(A) {
        if (this._crc.write(A), this._hasIEND = !0, this._handleChunkEnd(), this.finished) this.finished()
    }
})
// @from(Ln 411049, Col 4)
ZbA = R((j1z) => {
    var u3q = XbA(),
        O1z = [function() {}, function(A, q, K, Y) {
            if (Y === q.length) throw Error("Ran out of data");
            let z = q[Y];
            A[K] = z, A[K + 1] = z, A[K + 2] = z, A[K + 3] = 255
        }, function(A, q, K, Y) {
            if (Y + 1 >= q.length) throw Error("Ran out of data");
            let z = q[Y];
            A[K] = z, A[K + 1] = z, A[K + 2] = z, A[K + 3] = q[Y + 1]
        }, function(A, q, K, Y) {
            if (Y + 2 >= q.length) throw Error("Ran out of data");
            A[K] = q[Y], A[K + 1] = q[Y + 1], A[K + 2] = q[Y + 2], A[K + 3] = 255
        }, function(A, q, K, Y) {
            if (Y + 3 >= q.length) throw Error("Ran out of data");
            A[K] = q[Y], A[K + 1] = q[Y + 1], A[K + 2] = q[Y + 2], A[K + 3] = q[Y + 3]
        }],
        _1z = [function() {}, function(A, q, K, Y) {
            let z = q[0];
            A[K] = z, A[K + 1] = z, A[K + 2] = z, A[K + 3] = Y
        }, function(A, q, K) {
            let Y = q[0];
            A[K] = Y, A[K + 1] = Y, A[K + 2] = Y, A[K + 3] = q[1]
        }, function(A, q, K, Y) {
            A[K] = q[0], A[K + 1] = q[1], A[K + 2] = q[2], A[K + 3] = Y
        }, function(A, q, K) {
            A[K] = q[0], A[K + 1] = q[1], A[K + 2] = q[2], A[K + 3] = q[3]
        }];

    function J1z(A, q) {
        let K = [],
            Y = 0;

        function z() {
            if (Y === A.length) throw Error("Ran out of data");
            let w = A[Y];
            Y++;
            let H, $, O, _, J, X, D, j;
            switch (q) {
                default:
                    throw Error("unrecognised depth");
                case 16:
                    D = A[Y], Y++, K.push((w << 8) + D);
                    break;
                case 4:
                    D = w & 15, j = w >> 4, K.push(j, D);
                    break;
                case 2:
                    J = w & 3, X = w >> 2 & 3, D = w >> 4 & 3, j = w >> 6 & 3, K.push(j, D, X, J);
                    break;
                case 1:
                    H = w & 1, $ = w >> 1 & 1, O = w >> 2 & 1, _ = w >> 3 & 1, J = w >> 4 & 1, X = w >> 5 & 1, D = w >> 6 & 1, j = w >> 7 & 1, K.push(j, D, X, J, _, O, $, H);
                    break
            }
        }
        return {
            get: function(w) {
                while (K.length < w) z();
                let H = K.slice(0, w);
                return K = K.slice(w), H
            },
            resetAfterLine: function() {
                K.length = 0
            },
            end: function() {
                if (Y !== A.length) throw Error("extra data found")
            }
        }
    }

    function X1z(A, q, K, Y, z, w) {
        let {
            width: H,
            height: $,
            index: O
        } = A;
        for (let _ = 0; _ < $; _++)
            for (let J = 0; J < H; J++) {
                let X = K(J, _, O);
                O1z[Y](q, z, X, w), w += Y
            }
        return w
    }

    function D1z(A, q, K, Y, z, w) {
        let {
            width: H,
            height: $,
            index: O
        } = A;
        for (let _ = 0; _ < $; _++) {
            for (let J = 0; J < H; J++) {
                let X = z.get(Y),
                    D = K(J, _, O);
                _1z[Y](q, X, D, w)
            }
            z.resetAfterLine()
        }
    }
    j1z.dataToBitMap = function(A, q) {
        let {
            width: K,
            height: Y,
            depth: z,
            bpp: w,
            interlace: H
        } = q, $;
        if (z !== 8) $ = J1z(A, z);
        let O;
        if (z <= 8) O = Buffer.alloc(K * Y * 4);
        else O = new Uint16Array(K * Y * 4);
        let _ = Math.pow(2, z) - 1,
            J = 0,
            X, D;
        if (H) X = u3q.getImagePasses(K, Y), D = u3q.getInterlaceIterator(K, Y);
        else {
            let j = 0;
            D = function() {
                let M = j;
                return j += 4, M
            }, X = [{
                width: K,
                height: Y
            }]
        }
        for (let j = 0; j < X.length; j++)
            if (z === 8) J = X1z(X[j], O, D, w, A, J);
            else D1z(X[j], O, D, w, $, _);
        if (z === 8) {
            if (J !== A.length) throw Error("extra data found")
        } else $.end();
        return O
    }
})
// @from(Ln 411183, Col 4)
fbA = R((G7$, B3q) => {
    function P1z(A, q, K, Y, z) {
        let w = 0;
        for (let H = 0; H < Y; H++)
            for (let $ = 0; $ < K; $++) {
                let O = z[A[w]];
                if (!O) throw Error("index " + A[w] + " not in palette");
                for (let _ = 0; _ < 4; _++) q[w + _] = O[_];
                w += 4
            }
    }

    function W1z(A, q, K, Y, z) {
        let w = 0;
        for (let H = 0; H < Y; H++)
            for (let $ = 0; $ < K; $++) {
                let O = !1;
                if (z.length === 1) {
                    if (z[0] === A[w]) O = !0
                } else if (z[0] === A[w] && z[1] === A[w + 1] && z[2] === A[w + 2]) O = !0;
                if (O)
                    for (let _ = 0; _ < 4; _++) q[w + _] = 0;
                w += 4
            }
    }

    function G1z(A, q, K, Y, z) {
        let w = 255,
            H = Math.pow(2, z) - 1,
            $ = 0;
        for (let O = 0; O < Y; O++)
            for (let _ = 0; _ < K; _++) {
                for (let J = 0; J < 4; J++) q[$ + J] = Math.floor(A[$ + J] * w / H + 0.5);
                $ += 4
            }
    }
    B3q.exports = function(A, q) {
        let {
            depth: K,
            width: Y,
            height: z,
            colorType: w,
            transColor: H,
            palette: $
        } = q, O = A;
        if (w === 3) P1z(A, O, Y, z, $);
        else {
            if (H) W1z(A, O, Y, z, H);
            if (K !== 8) {
                if (K === 16) O = Buffer.alloc(Y * z * 4);
                G1z(A, O, Y, z, K)
            }
        }
        return O
    }
})