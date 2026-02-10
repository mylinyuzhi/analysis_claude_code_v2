
// @from(Ln 396987, Col 0)
function zxA(A) {
    let q = e(87),
        {
            onDone: K
        } = A,
        Y = v6(poY),
        z = v6(UoY),
        w = v6(goY),
        H = v6(QoY);
    uq();
    let $;
    if (q[0] !== z) $ = z || [], q[0] = z, q[1] = $;
    else $ = q[1];
    let O = $,
        [_, J] = v91.useState(null),
        [X, D] = v91.useState(null),
        [j, M] = v91.useState(null),
        [P, W] = v91.useState(null),
        G = WV6(),
        f;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) f = W91().then(moY), q[2] = f;
    else f = q[2];
    let Z = f,
        N = l4()?.autoUpdatesChannel ?? "latest",
        T;
    if (q[3] !== G) T = G.filter(BoY), q[3] = G, q[4] = T;
    else T = q[4];
    let k = T,
        y;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) y = u7q(), q[5] = y;
    else y = q[5];
    let B = y,
        S, m;
    if (q[6] !== Y || q[7] !== w || q[8] !== O) S = () => {
        W91().then(J), (async () => {
            let V6 = b1(),
                q6 = YxA(O8(), "agents"),
                p1 = YxA(y8(), ".claude", "agents"),
                {
                    activeAgents: K6,
                    allAgents: j6,
                    failedFiles: M6
                } = Y,
                N6 = {
                    activeAgents: K6.map(uoY),
                    userAgentsDir: q6,
                    projectAgentsDir: p1,
                    userDirExists: V6.existsSync(q6),
                    projectDirExists: V6.existsSync(p1),
                    failedFiles: M6
                };
            D(N6);
            let F6 = await m7q(O, {
                activeAgents: K6,
                allAgents: j6,
                failedFiles: M6
            }, async () => w);
            if (M(F6), G91()) {
                let P1 = YxA(Qf6(), "claude", "locks"),
                    k1 = AV6(P1),
                    o1 = BIA(P1);
                W({
                    enabled: !0,
                    locks: o1,
                    locksDir: P1,
                    staleLocksCleaned: k1
                })
            } else W({
                enabled: !1,
                locks: [],
                locksDir: "",
                staleLocksCleaned: 0
            })
        })()
    }, m = [w, O, Y], q[6] = Y, q[7] = w, q[8] = O, q[9] = S, q[10] = m;
    else S = q[9], m = q[10];
    v91.useEffect(S, m);
    let b;
    if (q[11] !== K) b = () => {
        K("Claude Code diagnostics dismissed", {
            display: "system"
        })
    }, q[11] = K, q[12] = b;
    else b = q[12];
    let g = b,
        U;
    if (q[13] !== g) U = {
        "confirm:yes": g,
        "confirm:no": g
    }, q[13] = g, q[14] = U;
    else U = q[14];
    let x;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) x = {
        context: "Confirmation"
    }, q[15] = x;
    else x = q[15];
    if (c7(U, x), !_) {
        let V6;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) V6 = o8.default.createElement(I, {
            paddingX: 1,
            paddingTop: 1
        }, o8.default.createElement(V, {
            dimColor: !0
        }, "Checking installation status…")), q[16] = V6;
        else V6 = q[16];
        return V6
    }
    let p;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) p = o8.default.createElement(V, {
        bold: !0
    }, "Diagnostics"), q[17] = p;
    else p = q[17];
    let l;
    if (q[18] !== _.installationType || q[19] !== _.version) l = o8.default.createElement(V, null, "└ Currently running: ", _.installationType, " (", _.version, ")"), q[18] = _.installationType, q[19] = _.version, q[20] = l;
    else l = q[20];
    let r;
    if (q[21] !== _.packageManager) r = _.packageManager && o8.default.createElement(V, null, "└ Package manager: ", _.packageManager), q[21] = _.packageManager, q[22] = r;
    else r = q[22];
    let s;
    if (q[23] !== _.installationPath) s = o8.default.createElement(V, null, "└ Path: ", _.installationPath), q[23] = _.installationPath, q[24] = s;
    else s = q[24];
    let O1;
    if (q[25] !== _.invokedBinary) O1 = o8.default.createElement(V, null, "└ Invoked: ", _.invokedBinary), q[25] = _.invokedBinary, q[26] = O1;
    else O1 = q[26];
    let T1;
    if (q[27] !== _.configInstallMethod) T1 = o8.default.createElement(V, null, "└ Config install method: ", _.configInstallMethod), q[27] = _.configInstallMethod, q[28] = T1;
    else T1 = q[28];
    let N1 = _.ripgrepStatus.working ? "OK" : "Not working",
        j1;
    if (q[29] !== _.ripgrepStatus.mode || q[30] !== _.ripgrepStatus.systemPath) j1 = _.ripgrepStatus.mode === "builtin" ? D9() ? "bundled" : "vendor" : _.ripgrepStatus.systemPath || "system", q[29] = _.ripgrepStatus.mode, q[30] = _.ripgrepStatus.systemPath, q[31] = j1;
    else j1 = q[31];
    let q1;
    if (q[32] !== N1 || q[33] !== j1) q1 = o8.default.createElement(V, null, "└ Search: ", N1, " (", j1, ")"), q[32] = N1, q[33] = j1, q[34] = q1;
    else q1 = q[34];
    let t;
    if (q[35] !== _.recommendation) t = _.recommendation && o8.default.createElement(o8.default.Fragment, null, o8.default.createElement(V, null), o8.default.createElement(V, {
        color: "warning"
    }, "Recommendation: ", _.recommendation.split(`
`)[0]), o8.default.createElement(V, {
        dimColor: !0
    }, _.recommendation.split(`
`)[1])), q[35] = _.recommendation, q[36] = t;
    else t = q[36];
    let J1;
    if (q[37] !== _.multipleInstallations) J1 = _.multipleInstallations.length > 1 && o8.default.createElement(o8.default.Fragment, null, o8.default.createElement(V, null), o8.default.createElement(V, {
        color: "warning"
    }, "Warning: Multiple installations found"), _.multipleInstallations.map(boY)), q[37] = _.multipleInstallations, q[38] = J1;
    else J1 = q[38];
    let D1;
    if (q[39] !== _.warnings) D1 = _.warnings.length > 0 && o8.default.createElement(o8.default.Fragment, null, o8.default.createElement(V, null), _.warnings.map(xoY)), q[39] = _.warnings, q[40] = D1;
    else D1 = q[40];
    let Z1;
    if (q[41] !== k) Z1 = k.length > 0 && o8.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        marginBottom: 1
    }, o8.default.createElement(V, {
        bold: !0
    }, "Invalid Settings"), o8.default.createElement(GV6, {
        errors: k
    })), q[41] = k, q[42] = Z1;
    else Z1 = q[42];
    let E1;
    if (q[43] !== l || q[44] !== r || q[45] !== s || q[46] !== O1 || q[47] !== T1 || q[48] !== q1 || q[49] !== t || q[50] !== J1 || q[51] !== D1 || q[52] !== Z1) E1 = o8.default.createElement(I, {
        flexDirection: "column"
    }, p, l, r, s, O1, T1, q1, t, J1, D1, Z1), q[43] = l, q[44] = r, q[45] = s, q[46] = O1, q[47] = T1, q[48] = q1, q[49] = t, q[50] = J1, q[51] = D1, q[52] = Z1, q[53] = E1;
    else E1 = q[53];
    let a;
    if (q[54] === Symbol.for("react.memo_cache_sentinel")) a = o8.default.createElement(V, {
        bold: !0
    }, "Updates"), q[54] = a;
    else a = q[54];
    let A1 = _.packageManager ? "Managed by package manager" : _.autoUpdates,
        M1;
    if (q[55] !== A1) M1 = o8.default.createElement(V, null, "└ Auto-updates:", " ", A1), q[55] = A1, q[56] = M1;
    else M1 = q[56];
    let z1;
    if (q[57] !== _.hasUpdatePermissions) z1 = _.hasUpdatePermissions !== null && o8.default.createElement(V, null, "└ Update permissions:", " ", _.hasUpdatePermissions ? "Yes" : "No (requires sudo)"), q[57] = _.hasUpdatePermissions, q[58] = z1;
    else z1 = q[58];
    let Y1;
    if (q[59] === Symbol.for("react.memo_cache_sentinel")) Y1 = o8.default.createElement(V, null, "└ Auto-update channel: ", N), q[59] = Y1;
    else Y1 = q[59];
    let _1;
    if (q[60] === Symbol.for("react.memo_cache_sentinel")) _1 = o8.default.createElement(o8.Suspense, {
        fallback: null
    }, o8.default.createElement(EoY, {
        promise: Z
    })), q[60] = _1;
    else _1 = q[60];
    let $1;
    if (q[61] !== M1 || q[62] !== z1) $1 = o8.default.createElement(I, {
        flexDirection: "column"
    }, a, M1, z1, Y1, _1), q[61] = M1, q[62] = z1, q[63] = $1;
    else $1 = q[63];
    let G1, L1, x1, f1;
    if (q[64] === Symbol.for("react.memo_cache_sentinel")) G1 = o8.default.createElement(Q7q, null), L1 = o8.default.createElement(fV6, null), x1 = o8.default.createElement(x7q, null), f1 = B.length > 0 && o8.default.createElement(I, {
        flexDirection: "column"
    }, o8.default.createElement(V, {
        bold: !0
    }, "Environment Variables"), B.map(IoY)), q[64] = G1, q[65] = L1, q[66] = x1, q[67] = f1;
    else G1 = q[64], L1 = q[65], x1 = q[66], f1 = q[67];
    let R1;
    if (q[68] !== P) R1 = P?.enabled && o8.default.createElement(I, {
        flexDirection: "column"
    }, o8.default.createElement(V, {
        bold: !0
    }, "Version Locks"), P.staleLocksCleaned > 0 && o8.default.createElement(V, {
        dimColor: !0
    }, "└ Cleaned ", P.staleLocksCleaned, " stale lock(s)"), P.locks.length === 0 ? o8.default.createElement(V, {
        dimColor: !0
    }, "└ No active version locks") : P.locks.map(hoY)), q[68] = P, q[69] = R1;
    else R1 = q[69];
    let H1;
    if (q[70] !== X) H1 = X?.failedFiles && X.failedFiles.length > 0 && o8.default.createElement(I, {
        flexDirection: "column"
    }, o8.default.createElement(V, {
        bold: !0,
        color: "error"
    }, "Agent Parse Errors"), o8.default.createElement(V, {
        color: "error"
    }, "└ Failed to parse ", X.failedFiles.length, " agent file(s):"), X.failedFiles.map(SoY)), q[70] = X, q[71] = H1;
    else H1 = q[71];
    let y1;
    if (q[72] !== H) y1 = H.length > 0 && o8.default.createElement(I, {
        flexDirection: "column"
    }, o8.default.createElement(V, {
        bold: !0,
        color: "error"
    }, "Plugin Errors"), o8.default.createElement(V, {
        color: "error"
    }, "└ ", H.length, " plugin error(s) detected:"), H.map(CoY)), q[72] = H, q[73] = y1;
    else y1 = q[73];
    let B1;
    if (q[74] !== j) B1 = j?.unreachableRulesWarning && o8.default.createElement(I, {
        flexDirection: "column"
    }, o8.default.createElement(V, {
        bold: !0,
        color: "warning"
    }, "Unreachable Permission Rules"), o8.default.createElement(V, null, "└", " ", o8.default.createElement(V, {
        color: "warning"
    }, l1.warning, " ", j.unreachableRulesWarning.message)), j.unreachableRulesWarning.details.map(yoY)), q[74] = j, q[75] = B1;
    else B1 = q[75];
    let A6;
    if (q[76] !== j) A6 = j && (j.claudeMdWarning || j.agentWarning || j.mcpWarning) && o8.default.createElement(I, {
        flexDirection: "column"
    }, o8.default.createElement(V, {
        bold: !0
    }, "Context Usage Warnings"), j.claudeMdWarning && o8.default.createElement(o8.default.Fragment, null, o8.default.createElement(V, null, "└", " ", o8.default.createElement(V, {
        color: "warning"
    }, l1.warning, " ", j.claudeMdWarning.message)), o8.default.createElement(V, null, "  ", "└ Files:"), j.claudeMdWarning.details.map(RoY)), j.agentWarning && o8.default.createElement(o8.default.Fragment, null, o8.default.createElement(V, null, "└", " ", o8.default.createElement(V, {
        color: "warning"
    }, l1.warning, " ", j.agentWarning.message)), o8.default.createElement(V, null, "  ", "└ Top contributors:"), j.agentWarning.details.map(LoY)), j.mcpWarning && o8.default.createElement(o8.default.Fragment, null, o8.default.createElement(V, null, "└", " ", o8.default.createElement(V, {
        color: "warning"
    }, l1.warning, " ", j.mcpWarning.message)), o8.default.createElement(V, null, "  ", "└ MCP servers:"), j.mcpWarning.details.map(koY))), q[76] = j, q[77] = A6;
    else A6 = q[77];
    let O6;
    if (q[78] === Symbol.for("react.memo_cache_sentinel")) O6 = o8.default.createElement(I, null, o8.default.createElement(MV6, null)), q[78] = O6;
    else O6 = q[78];
    let P6;
    if (q[79] !== E1 || q[80] !== $1 || q[81] !== R1 || q[82] !== H1 || q[83] !== y1 || q[84] !== B1 || q[85] !== A6) P6 = o8.default.createElement(I, {
        flexDirection: "column",
        gap: 1,
        paddingX: 1,
        paddingTop: 1
    }, E1, $1, G1, L1, x1, f1, R1, H1, y1, B1, A6, O6), q[79] = E1, q[80] = $1, q[81] = R1, q[82] = H1, q[83] = y1, q[84] = B1, q[85] = A6, q[86] = P6;
    else P6 = q[86];
    return P6
}
// @from(Ln 397256, Col 0)
function koY(A, q) {
    return o8.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "    ", "└ ", A)
}
// @from(Ln 397263, Col 0)
function LoY(A, q) {
    return o8.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "    ", "└ ", A)
}
// @from(Ln 397270, Col 0)
function RoY(A, q) {
    return o8.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "    ", "└ ", A)
}
// @from(Ln 397277, Col 0)
function yoY(A, q) {
    return o8.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "  ", "└ ", A)
}
// @from(Ln 397284, Col 0)
function CoY(A, q) {
    return o8.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "  ", "└ ", A.source || "unknown", "plugin" in A && A.plugin ? ` [${A.plugin}]` : "", ":", " ", TZ(A))
}
// @from(Ln 397291, Col 0)
function SoY(A, q) {
    return o8.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "  ", "└ ", A.path, ": ", A.error)
}
// @from(Ln 397298, Col 0)
function hoY(A, q) {
    return o8.default.createElement(V, {
        key: q
    }, "└ ", A.version, ": PID ", A.pid, " ", A.isProcessRunning ? o8.default.createElement(V, null, "(running)") : o8.default.createElement(V, {
        color: "warning"
    }, "(stale)"))
}
// @from(Ln 397306, Col 0)
function IoY(A, q) {
    return o8.default.createElement(V, {
        key: q
    }, "└ ", A.name, ":", " ", o8.default.createElement(V, {
        color: A.status === "capped" ? "warning" : "error"
    }, A.message))
}
// @from(Ln 397314, Col 0)
function xoY(A, q) {
    return o8.default.createElement(I, {
        key: q,
        flexDirection: "column"
    }, o8.default.createElement(V, {
        color: "warning"
    }, "Warning: ", A.issue), o8.default.createElement(V, null, "Fix: ", A.fix))
}
// @from(Ln 397323, Col 0)
function boY(A, q) {
    return o8.default.createElement(V, {
        key: q
    }, "└ ", A.type, " at ", A.path)
}
// @from(Ln 397329, Col 0)
function uoY(A) {
    return {
        agentType: A.agentType,
        source: A.source
    }
}
// @from(Ln 397336, Col 0)
function BoY(A) {
    return A.mcpErrorMetadata === void 0
}
// @from(Ln 397340, Col 0)
function moY(A) {
    return (A.installationType === "native" ? Z8q : G8q)().catch(FoY)
}
// @from(Ln 397344, Col 0)
function FoY() {
    return {
        latest: null,
        stable: null
    }
}
// @from(Ln 397351, Col 0)
function QoY(A) {
    return A.plugins.errors
}
// @from(Ln 397355, Col 0)
function goY(A) {
    return A.toolPermissionContext
}
// @from(Ln 397359, Col 0)
function UoY(A) {
    return A.mcp.tools
}
// @from(Ln 397363, Col 0)
function poY(A) {
    return A.agentDefinitions
}
// @from(Ln 397366, Col 4)
o8
// @from(Ln 397366, Col 8)
v91
// @from(Ln 397367, Col 4)
wxA = v(() => {
    i1();
    m1();
    K7();
    R2();
    b7();
    am();
    we();
    p8();
    tIA();
    eIA();
    AxA();
    qxA();
    b7q();
    B6();
    _8();
    hA();
    B7q();
    F7q();
    mIA();
    EIA();
    d8();
    g7q();
    o8 = o(X1(), 1), v91 = o(X1(), 1)
})
// @from(Ln 397392, Col 4)
d7q = {}
// @from(Ln 397396, Col 4)
p7q
// @from(Ln 397396, Col 9)
doY = (A, q, K) => {
    return u8("doctor"), Promise.resolve(p7q.default.createElement(zxA, {
        onDone: A
    }))
}
// @from(Ln 397401, Col 4)
c7q = v(() => {
    wxA();
    v3();
    p7q = o(X1(), 1)
})
// @from(Ln 397406, Col 4)
coY
// @from(Ln 397406, Col 9)
l7q
// @from(Ln 397407, Col 4)
i7q = v(() => {
    coY = {
        name: "doctor",
        description: "Diagnose and verify your Claude Code installation and settings",
        isEnabled: () => !process.env.DISABLE_DOCTOR_COMMAND,
        isHidden: !1,
        userFacingName() {
            return "doctor"
        },
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (c7q(), d7q))
    }, l7q = coY
})
// @from(Ln 397420, Col 4)
n7q = () => {}
// @from(Ln 397422, Col 0)
function loY(A) {
    return !!Po1(A)
}
// @from(Ln 397425, Col 0)
async function KF(A) {
    let q = FI();
    if (!q) throw Error("No editor available");
    $k(`${q} "${A}"`, {
        stdio: "inherit"
    })
}
// @from(Ln 397432, Col 4)
FI
// @from(Ln 397433, Col 4)
YF = v(() => {
    eN1();
    zq();
    WQ();
    FI = KA(() => {
        if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
        if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
        if (process.platform === "win32") return "start /wait notepad";
        return ["code", "vi", "nano"].find((q) => loY(q))
    })
})
// @from(Ln 397445, Col 0)
function r7q(A) {
    return YX(A) !== null
}
// @from(Ln 397448, Col 4)
o7q = v(() => {
    _8();
    XF6();
    h9()
})
// @from(Ln 397457, Col 0)
function s7q(A) {
    let q = e(30),
        {
            onSelect: K,
            onCancel: Y
        } = A,
        z = I_(),
        w = a7q(O8(), "CLAUDE.md"),
        H = a7q(y8(), "CLAUDE.md"),
        $ = z.some((s) => s.path === w),
        O = z.some((s) => s.path === H),
        _ = [...z.map(roY), ...$ ? [] : [{
            path: w,
            type: "User",
            content: "",
            exists: !1
        }], ...O ? [] : [{
            path: H,
            type: "Project",
            content: "",
            exists: !1
        }]],
        J = new Map,
        X = _.map((s) => {
            let O1 = L3(s.path),
                T1 = s.exists ? "" : " (new)",
                N1 = s.parent ? (J.get(s.parent) ?? 0) + 1 : 0;
            J.set(s.path, N1);
            let j1 = N1 > 0 ? "  ".repeat(N1 - 1) : "",
                q1;
            if (s.type === "User" && !s.isNested && s.path === w) q1 = "User memory";
            else if (s.type === "Project" && !s.isNested && s.path === H) q1 = "Project memory";
            else if (N1 > 0) q1 = `${j1}L ${O1}${T1}`;
            else q1 = `${O1}`;
            let t, J1 = r7q(y8());
            if (s.type === "User" && !s.isNested) t = "Saved in ~/.claude/CLAUDE.md";
            else if (s.type === "Project" && !s.isNested && s.path === H) t = `${J1?"Checked in at":"Saved in"} ./CLAUDE.md`;
            else if (s.type, s.type === "AutoMem") t = "auto memory entrypoint";
            else if (s.parent) t = "@-imported";
            else if (s.isNested) t = "dynamically loaded";
            else t = "";
            return {
                label: q1,
                value: s.path,
                description: t
            }
        }),
        D = [],
        j = v6(noY);
    if (y2()) {
        let s;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) s = {
            label: "Open auto-memory folder",
            value: `${VV6}${mu1()}`,
            description: ""
        }, q[0] = s;
        else s = q[0];
        D.push(s);
        for (let O1 of j.activeAgents)
            if (O1.memory) {
                let T1 = iO6(O1.agentType, O1.memory);
                D.push({
                    label: `Open ${H6.bold(O1.agentType)} agent memory`,
                    value: `${VV6}${T1}`,
                    description: `${O1.memory} scope`
                })
            }
    }
    X.push(...D);
    let M;
    if (q[1] !== X) M = NV6 && X.some(ioY) ? NV6 : X[0]?.value || "", q[1] = X, q[2] = M;
    else M = q[2];
    let P = M,
        [W, G] = HxA.useState(y2),
        [f, Z] = HxA.useState(!1),
        N;
    if (q[3] !== W) N = function() {
        let O1 = !W;
        Z7("userSettings", {
            autoMemoryEnabled: O1
        }), G(O1), c("tengu_auto_memory_toggled", {
            enabled: O1
        })
    }, q[3] = W, q[4] = N;
    else N = q[4];
    let T = N;
    uq();
    let k;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Confirmation"
    }, q[5] = k;
    else k = q[5];
    DA("confirm:no", Y, k);
    let y;
    if (q[6] !== T) y = () => {
        T()
    }, q[6] = T, q[7] = y;
    else y = q[7];
    let B;
    if (q[8] !== f) B = {
        context: "Confirmation",
        isActive: f
    }, q[8] = f, q[9] = B;
    else B = q[9];
    DA("confirm:yes", y, B);
    let S;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) S = () => {
        Z(!1)
    }, q[10] = S;
    else S = q[10];
    let m;
    if (q[11] !== f) m = {
        context: "Select",
        isActive: f
    }, q[11] = f, q[12] = m;
    else m = q[12];
    DA("select:next", S, m);
    let b = W ? "on" : "off",
        g;
    if (q[13] !== b) g = QI.createElement(V, null, "Auto-memory (research preview): ", b), q[13] = b, q[14] = g;
    else g = q[14];
    let U;
    if (q[15] !== g || q[16] !== f) U = QI.createElement(I, {
        marginBottom: 1
    }, QI.createElement(uD1, {
        isFocused: f
    }, g)), q[15] = g, q[16] = f, q[17] = U;
    else U = q[17];
    let x;
    if (q[18] !== K) x = (s) => {
        if (s.startsWith(VV6)) {
            let O1 = s.slice(VV6.length);
            try {
                b1().mkdirSync(O1)
            } catch {}
            S74(O1);
            return
        }
        NV6 = s, K(s)
    }, q[18] = K, q[19] = x;
    else x = q[19];
    let p;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) p = () => Z(!0), q[20] = p;
    else p = q[20];
    let l;
    if (q[21] !== P || q[22] !== X || q[23] !== Y || q[24] !== x || q[25] !== f) l = QI.createElement(kA, {
        defaultFocusValue: P,
        options: X,
        isDisabled: f,
        onChange: x,
        onCancel: Y,
        onUpFromFirstItem: p
    }), q[21] = P, q[22] = X, q[23] = Y, q[24] = x, q[25] = f, q[26] = l;
    else l = q[26];
    let r;
    if (q[27] !== U || q[28] !== l) r = QI.createElement(I, {
        flexDirection: "column",
        width: "100%"
    }, U, l), q[27] = U, q[28] = l, q[29] = r;
    else r = q[29];
    return r
}
// @from(Ln 397620, Col 0)
function ioY(A) {
    return A.value === NV6
}
// @from(Ln 397624, Col 0)
function noY(A) {
    return A.agentDefinitions
}
// @from(Ln 397628, Col 0)
function roY(A) {
    return {
        ...A,
        exists: !0
    }
}
// @from(Ln 397634, Col 4)
QI
// @from(Ln 397634, Col 8)
HxA
// @from(Ln 397634, Col 13)
NV6
// @from(Ln 397634, Col 18)
VV6 = "__open_folder__"
// @from(Ln 397635, Col 4)
t7q = v(() => {
    i1();
    m1();
    wY();
    R2();
    K7();
    dD();
    xW();
    Oj();
    gB();
    _8();
    d8();
    wq();
    o7q();
    B6();
    hA();
    a26();
    p8();
    u6();
    q3();
    QI = o(X1(), 1), HxA = o(X1(), 1)
})
// @from(Ln 397664, Col 0)
function e7q(A) {
    let q = ooY(),
        K = h6(),
        Y = A.startsWith(q) ? "~" + A.slice(q.length) : null,
        z = A.startsWith(K) ? "./" + aoY(K, A) : null;
    if (Y && z) return Y.length <= z.length ? Y : z;
    return Y || z || A
}
// @from(Ln 397672, Col 4)
soY
// @from(Ln 397673, Col 4)
A4q = v(() => {
    i1();
    m1();
    N7();
    soY = o(X1(), 1)
})
// @from(Ln 397679, Col 4)
q4q = {}
// @from(Ln 397684, Col 0)
function toY({
    onDone: A
}) {
    $xA.useState(() => {
        I_.cache.clear?.()
    });
    let {
        columns: q
    } = Z8(), K = async (O) => {
        u8("memory-mode");
        try {
            if (O.includes(O8())) {
                let j = O8();
                if (!b1().existsSync(j)) b1().mkdirSync(j)
            }
            if (!b1().existsSync(O)) c8(O, "", {
                encoding: "utf8",
                flush: !0
            });
            await KF(O);
            let _ = "default",
                J = "";
            if (process.env.VISUAL) _ = "$VISUAL", J = process.env.VISUAL;
            else if (process.env.EDITOR) _ = "$EDITOR", J = process.env.EDITOR;
            let X = _ !== "default" ? `Using ${_}="${J}".` : "",
                D = X ? `> ${X} To change editor, set $EDITOR or $VISUAL environment variable.` : "> To use a different editor, set the $EDITOR or $VISUAL environment variable.";
            A(`Opened memory file at ${e7q(O)}

${D}`, {
                display: "system"
            })
        } catch (_) {
            K1(_ instanceof Error ? _ : Error(String(_))), A(`Error opening memory file: ${_}`)
        }
    }, Y = () => {
        A("Cancelled memory editing", {
            display: "system"
        })
    }, w = [].length, [H, $] = $xA.useState(!1);
    return D8((O, _) => {}), sZ.createElement(w8, {
        title: "Memory",
        onCancel: Y,
        color: "remember"
    }, sZ.createElement(I, {
        flexDirection: "column"
    }, !1, !1, !1, !H && sZ.createElement(s7q, {
        onSelect: K,
        onCancel: Y
    }), sZ.createElement(I, {
        marginTop: 1
    }, sZ.createElement(V, {
        dimColor: !0
    }, "Learn more: ", sZ.createElement(d7, {
        url: "https://code.claude.com/docs/en/memory"
    })))))
}
// @from(Ln 397740, Col 4)
sZ
// @from(Ln 397740, Col 8)
$xA
// @from(Ln 397740, Col 13)
eoY = async (A) => {
    return sZ.createElement(toY, {
        onDone: A
    })
}
// @from(Ln 397745, Col 4)
K4q = v(() => {
    hA();
    y6();
    YF();
    _8();
    m6();
    t7q();
    A4q();
    m1();
    m1();
    dD();
    v3();
    mq();
    vq();
    Bq();
    sZ = o(X1(), 1), $xA = o(X1(), 1)
})
// @from(Ln 397762, Col 4)
AaY
// @from(Ln 397762, Col 9)
Y4q
// @from(Ln 397763, Col 4)
z4q = v(() => {
    AaY = {
        type: "local-jsx",
        name: "memory",
        description: "Edit Claude memory files",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (K4q(), q4q)),
        userFacingName() {
            return this.name
        }
    }, Y4q = AaY
})
// @from(Ln 397776, Col 4)
qaY
// @from(Ln 397776, Col 9)
KaY
// @from(Ln 397776, Col 14)
E91
// @from(Ln 397777, Col 4)
TV6 = v(() => {
    G5();
    qaY = {
        ghostty: "Ghostty",
        kitty: "Kitty",
        "iTerm.app": "iTerm2",
        WezTerm: "WezTerm"
    }, KaY = {
        type: "local-jsx",
        name: "terminal-setup",
        userFacingName() {
            return "terminal-setup"
        },
        description: xA.terminal === "Apple_Terminal" ? "Enable Option+Enter key binding for newlines and visual bell" : "Install Shift+Enter key binding for newlines",
        isEnabled: () => !0,
        isHidden: xA.terminal !== null && xA.terminal in qaY,
        load: () => Promise.resolve().then(() => (Oq1(), xE7))
    }, E91 = KaY
})
// @from(Ln 397797, Col 0)
function _e() {
    return f6().editorMode === "vim"
}
// @from(Ln 397801, Col 0)
function w4q() {
    if (xA.terminal === "Apple_Terminal" && process.platform === "darwin") return "shift + ⏎ for newline";
    if (E91.isEnabled() && I$A()) return "shift + ⏎ for newline";
    return x$A() ? "\\⏎ for newline" : "backslash (\\) + return (⏎) for newline"
}
// @from(Ln 397806, Col 4)
DZ1 = v(() => {
    TV6();
    Oq1();
    cA();
    G5()
})
// @from(Ln 397813, Col 0)
function Je(A) {
    return A.replace(/\+/g, " + ")
}
// @from(Ln 397817, Col 0)
function vV6(A) {
    let q = e(90),
        {
            dimColor: K,
            fixedWidth: Y,
            gap: z,
            paddingX: w
        } = A,
        H = RK("app:toggleTranscript", "Global", "ctrl+o"),
        $;
    if (q[0] !== H) $ = Je(H), q[0] = H, q[1] = $;
    else $ = q[1];
    let O = $,
        _ = RK("app:toggleTodos", "Global", "ctrl+t"),
        J;
    if (q[2] !== _) J = Je(_), q[2] = _, q[3] = J;
    else J = q[3];
    let X = J,
        D = RK("chat:undo", "Chat", "ctrl+_"),
        j;
    if (q[4] !== D) j = Je(D), q[4] = D, q[5] = j;
    else j = q[5];
    let M = j,
        P = RK("chat:stash", "Chat", "ctrl+s"),
        W;
    if (q[6] !== P) W = Je(P), q[6] = P, q[7] = W;
    else W = q[7];
    let G = W,
        f = RK("chat:cycleMode", "Chat", "shift+tab"),
        Z;
    if (q[8] !== f) Z = Je(f), q[8] = f, q[9] = Z;
    else Z = q[9];
    let N = Z,
        T = RK("chat:modelPicker", "Chat", "alt+p"),
        k;
    if (q[10] !== T) k = Je(T), q[10] = T, q[11] = k;
    else k = q[11];
    let y = k,
        B = RK("chat:externalEditor", "Chat", "ctrl+g"),
        S;
    if (q[12] !== B) S = Je(B), q[12] = B, q[13] = S;
    else S = q[13];
    let m = S,
        b = RK("app:toggleTerminal", "Global", "meta+j"),
        g;
    if (q[14] !== b) g = Je(b), q[14] = b, q[15] = g;
    else g = q[15];
    let U = g,
        x;
    if (q[16] !== K || q[17] !== U) x = null, q[16] = K, q[17] = U, q[18] = x;
    else x = q[18];
    let p = x,
        l = Y ? 24 : void 0,
        r;
    if (q[19] !== K) r = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "! for bash mode")), q[19] = K, q[20] = r;
    else r = q[20];
    let s;
    if (q[21] !== K) s = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "/ for commands")), q[21] = K, q[22] = s;
    else s = q[22];
    let O1;
    if (q[23] !== K) O1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "@ for file paths")), q[23] = K, q[24] = O1;
    else O1 = q[24];
    let T1, N1;
    if (q[25] !== K) T1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "& for background")), N1 = !1, q[25] = K, q[26] = T1, q[27] = N1;
    else T1 = q[26], N1 = q[27];
    let j1;
    if (q[28] !== l || q[29] !== r || q[30] !== s || q[31] !== O1 || q[32] !== T1 || q[33] !== N1) j1 = M4.createElement(I, {
        flexDirection: "column",
        width: l
    }, r, s, O1, T1, N1), q[28] = l, q[29] = r, q[30] = s, q[31] = O1, q[32] = T1, q[33] = N1, q[34] = j1;
    else j1 = q[34];
    let q1 = Y ? 35 : void 0,
        t;
    if (q[35] !== K) t = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "double tap esc to clear input")), q[35] = K, q[36] = t;
    else t = q[36];
    let J1;
    if (q[37] !== N || q[38] !== K) J1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, N, " to auto-accept edits")), q[37] = N, q[38] = K, q[39] = J1;
    else J1 = q[39];
    let D1;
    if (q[40] !== K || q[41] !== O) D1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, O, " for verbose output")), q[40] = K, q[41] = O, q[42] = D1;
    else D1 = q[42];
    let Z1;
    if (q[43] !== K || q[44] !== X) Z1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, X, " to toggle tasks")), q[43] = K, q[44] = X, q[45] = Z1;
    else Z1 = q[45];
    let E1;
    if (q[46] === Symbol.for("react.memo_cache_sentinel")) E1 = w4q(), q[46] = E1;
    else E1 = q[46];
    let a;
    if (q[47] !== K) a = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, E1)), q[47] = K, q[48] = a;
    else a = q[48];
    let A1;
    if (q[49] !== q1 || q[50] !== t || q[51] !== J1 || q[52] !== D1 || q[53] !== Z1 || q[54] !== a || q[55] !== p) A1 = M4.createElement(I, {
        flexDirection: "column",
        width: q1
    }, t, J1, D1, Z1, p, a), q[49] = q1, q[50] = t, q[51] = J1, q[52] = D1, q[53] = Z1, q[54] = a, q[55] = p, q[56] = A1;
    else A1 = q[56];
    let M1;
    if (q[57] !== K || q[58] !== M) M1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, M, " to undo")), q[57] = K, q[58] = M, q[59] = M1;
    else M1 = q[59];
    let z1;
    if (q[60] !== K) z1 = PY8 && M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "ctrl + z to suspend")), q[60] = K, q[61] = z1;
    else z1 = q[61];
    let Y1;
    if (q[62] === Symbol.for("react.memo_cache_sentinel")) Y1 = pG1.displayText.replace("+", " + "), q[62] = Y1;
    else Y1 = q[62];
    let _1;
    if (q[63] !== K) _1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, Y1, " to paste images")), q[63] = K, q[64] = _1;
    else _1 = q[64];
    let $1;
    if (q[65] !== K || q[66] !== y) $1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, y, " to switch model")), q[65] = K, q[66] = y, q[67] = $1;
    else $1 = q[67];
    let G1;
    if (q[68] !== K || q[69] !== G) G1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, G, " to stash prompt")), q[68] = K, q[69] = G, q[70] = G1;
    else G1 = q[70];
    let L1;
    if (q[71] !== K || q[72] !== m) L1 = M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, m, " to edit in $EDITOR")), q[71] = K, q[72] = m, q[73] = L1;
    else L1 = q[73];
    let x1;
    if (q[74] !== K) x1 = Hv() && M4.createElement(I, null, M4.createElement(V, {
        dimColor: K
    }, "/keybindings to customize")), q[74] = K, q[75] = x1;
    else x1 = q[75];
    let f1;
    if (q[76] !== M1 || q[77] !== z1 || q[78] !== _1 || q[79] !== $1 || q[80] !== G1 || q[81] !== L1 || q[82] !== x1) f1 = M4.createElement(I, {
        flexDirection: "column"
    }, M1, z1, _1, $1, G1, L1, x1), q[76] = M1, q[77] = z1, q[78] = _1, q[79] = $1, q[80] = G1, q[81] = L1, q[82] = x1, q[83] = f1;
    else f1 = q[83];
    let R1;
    if (q[84] !== z || q[85] !== w || q[86] !== j1 || q[87] !== A1 || q[88] !== f1) R1 = M4.createElement(I, {
        paddingX: w,
        flexDirection: "row",
        gap: z
    }, j1, A1, f1), q[84] = z, q[85] = w, q[86] = j1, q[87] = A1, q[88] = f1, q[89] = R1;
    else R1 = q[89];
    return R1
}
// @from(Ln 397983, Col 4)
M4
// @from(Ln 397984, Col 4)
OxA = v(() => {
    i1();
    m1();
    nU1();
    x3();
    DZ1();
    s2();
    AU();
    U4();
    M4 = o(X1(), 1)
})
// @from(Ln 397996, Col 0)
function H4q() {
    let A = e(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = tZ.createElement(I, null, tZ.createElement(V, null, "Claude understands your codebase, makes edits with your permission, and executes commands — right from your terminal.")), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = tZ.createElement(I, {
        flexDirection: "column",
        paddingY: 1,
        gap: 1
    }, q, tZ.createElement(I, {
        flexDirection: "column"
    }, tZ.createElement(I, null, tZ.createElement(V, {
        bold: !0
    }, "Shortcuts")), tZ.createElement(vV6, {
        gap: 2,
        fixedWidth: !0
    }))), A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 398017, Col 4)
tZ
// @from(Ln 398018, Col 4)
$4q = v(() => {
    i1();
    m1();
    OxA();
    tZ = o(X1(), 1)
})
// @from(Ln 398025, Col 0)
function _xA(A) {
    let q = e(9),
        {
            commands: K,
            maxHeight: Y,
            title: z,
            onCancel: w,
            emptyMessage: H
        } = A,
        $ = Math.max(1, Math.floor((Y - 6) / 2)),
        O;
    if (q[0] !== K) O = [...K].sort(zaY).map(YaY), q[0] = K, q[1] = O;
    else O = q[1];
    let _ = O,
        J;
    if (q[2] !== K.length || q[3] !== H || q[4] !== w || q[5] !== _ || q[6] !== z || q[7] !== $) J = $G.createElement(I, {
        flexDirection: "column",
        paddingY: 1
    }, K.length === 0 && H ? $G.createElement(V, {
        dimColor: !0
    }, H) : $G.createElement($G.Fragment, null, $G.createElement(V, null, z), $G.createElement(I, {
        marginTop: 1
    }, $G.createElement(kA, {
        options: _,
        visibleOptionCount: $,
        onCancel: w,
        disableSelection: !0,
        hideIndexes: !0,
        layout: "compact-vertical"
    })))), q[2] = K.length, q[3] = H, q[4] = w, q[5] = _, q[6] = z, q[7] = $, q[8] = J;
    else J = q[8];
    return J
}
// @from(Ln 398059, Col 0)
function YaY(A) {
    return {
        label: `/${A.name}`,
        value: A.name,
        description: jZ1(A)
    }
}
// @from(Ln 398067, Col 0)
function zaY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 398070, Col 4)
$G
// @from(Ln 398071, Col 4)
O4q = v(() => {
    i1();
    m1();
    c$();
    U5();
    $G = o(X1(), 1)
})
// @from(Ln 398079, Col 0)
function _4q(A) {
    let q = e(41),
        {
            onClose: K,
            commands: Y
        } = A,
        {
            rows: z
        } = Z8(),
        w = Math.floor(z / 2),
        H;
    if (q[0] !== K) H = () => K("Help dialog dismissed", {
        display: "system"
    }), q[0] = K, q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Help"
    }, q[2] = O;
    else O = q[2];
    DA("help:dismiss", $, O);
    let _ = uq($),
        J = RK("help:dismiss", "Help", "esc"),
        X, D, j;
    if (q[3] !== Y) {
        let y = Cd();
        D = Y.filter((S) => y.has(S.name) && !S.isHidden);
        let B;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) B = [], q[7] = B;
        else B = q[7];
        X = B, j = Y.filter((S) => !y.has(S.name) && !S.isHidden), q[3] = Y, q[4] = X, q[5] = D, q[6] = j
    } else X = q[4], D = q[5], j = q[6];
    let M = j,
        P;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) P = N9.createElement(LH, {
        key: "general",
        title: "general"
    }, N9.createElement(H4q, null)), q[8] = P;
    else P = q[8];
    let W;
    if (q[9] !== X || q[10] !== D || q[11] !== $ || q[12] !== M || q[13] !== w) {
        W = [P];
        let y;
        if (q[15] !== D || q[16] !== $ || q[17] !== w) y = N9.createElement(LH, {
            key: "commands",
            title: "commands"
        }, N9.createElement(_xA, {
            commands: D,
            maxHeight: w,
            title: "Browse default commands:",
            onCancel: $
        })), q[15] = D, q[16] = $, q[17] = w, q[18] = y;
        else y = q[18];
        W.push(y);
        let B;
        if (q[19] !== $ || q[20] !== M || q[21] !== w) B = N9.createElement(LH, {
            key: "custom",
            title: "custom-commands"
        }, N9.createElement(_xA, {
            commands: M,
            maxHeight: w,
            title: "Browse custom commands:",
            emptyMessage: "No custom commands found",
            onCancel: $
        })), q[19] = $, q[20] = M, q[21] = w, q[22] = B;
        else B = q[22];
        W.push(B), q[9] = X, q[10] = D, q[11] = $, q[12] = M, q[13] = w, q[14] = W
    } else W = q[14];
    let G;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) G = N9.createElement(CY, {
        dividerColor: "professionalBlue"
    }), q[27] = G;
    else G = q[27];
    let f;
    if (q[28] !== W) f = N9.createElement($y, {
        title: `Claude Code v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION}`,
        color: "professionalBlue",
        defaultTab: "general"
    }, W), q[28] = W, q[29] = f;
    else f = q[29];
    let Z;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) Z = N9.createElement(I, {
        marginTop: 1
    }, N9.createElement(V, null, "For more help:", " ", N9.createElement(d7, {
        url: "https://code.claude.com/docs/en/overview"
    }))), q[30] = Z;
    else Z = q[30];
    let N;
    if (q[31] !== J || q[32] !== _.keyName || q[33] !== _.pending) N = N9.createElement(I, {
        marginTop: 1
    }, N9.createElement(V, {
        dimColor: !0
    }, _.pending ? N9.createElement(N9.Fragment, null, "Press ", _.keyName, " again to exit") : N9.createElement(V, {
        italic: !0
    }, J, " to cancel"))), q[31] = J, q[32] = _.keyName, q[33] = _.pending, q[34] = N;
    else N = q[34];
    let T;
    if (q[35] !== f || q[36] !== N) T = N9.createElement(I, {
        paddingX: 1,
        flexDirection: "column"
    }, f, Z, N), q[35] = f, q[36] = N, q[37] = T;
    else T = q[37];
    let k;
    if (q[38] !== w || q[39] !== T) k = N9.createElement(I, {
        flexDirection: "column",
        height: w
    }, G, T), q[38] = w, q[39] = T, q[40] = k;
    else k = q[40];
    return k
}
// @from(Ln 398190, Col 4)
N9
// @from(Ln 398191, Col 4)
J4q = v(() => {
    i1();
    m1();
    kW();
    X91();
    $4q();
    O4q();
    c$();
    mq();
    R2();
    K7();
    s2();
    m1();
    N9 = o(X1(), 1)
})
// @from(Ln 398206, Col 4)
X4q = {}
// @from(Ln 398210, Col 4)
JxA
// @from(Ln 398210, Col 9)
waY = async (A, {
    options: {
        commands: q
    }
}) => {
    return JxA.createElement(_4q, {
        commands: q,
        onClose: A
    })
}
// @from(Ln 398220, Col 4)
D4q = v(() => {
    J4q();
    JxA = o(X1(), 1)
})
// @from(Ln 398224, Col 4)
HaY
// @from(Ln 398224, Col 9)
XxA
// @from(Ln 398225, Col 4)
j4q = v(() => {
    HaY = {
        type: "local-jsx",
        name: "help",
        description: "Show help and available commands",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (D4q(), X4q)),
        userFacingName() {
            return "help"
        }
    }, XxA = HaY
})
// @from(Ln 398239, Col 0)
function M4q(A) {
    let q = e(9),
        {
            onComplete: K
        } = A,
        Y;
    if (q[0] !== K) Y = async (J) => {
        let X = J === "yes";
        jA((D) => ({
            ...D,
            autoConnectIde: X,
            hasIdeAutoConnectDialogBeenShown: !0
        })), K()
    }, q[0] = K, q[1] = Y;
    else Y = q[1];
    let z = Y,
        w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[2] = w;
    else w = q[2];
    let H = w,
        $;
    if (q[3] !== z) $ = k91.default.createElement(kA, {
        options: H,
        onChange: z,
        defaultValue: "yes"
    }), q[3] = z, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = k91.default.createElement(V, {
        dimColor: !0
    }, "You can also configure this in /config or with the --ide flag"), q[5] = O;
    else O = q[5];
    let _;
    if (q[6] !== K || q[7] !== $) _ = k91.default.createElement(w8, {
        title: "Do you wish to enable auto-connect to IDE?",
        color: "ide",
        onCancel: K
    }, $, O), q[6] = K, q[7] = $, q[8] = _;
    else _ = q[8];
    return _
}
// @from(Ln 398287, Col 0)
function P4q() {
    let A = f6();
    return !bX() && A.autoConnectIde !== !0 && A.hasIdeAutoConnectDialogBeenShown !== !0
}
// @from(Ln 398292, Col 0)
function W4q(A) {
    let q = e(11),
        {
            onComplete: K
        } = A,
        Y;
    if (q[0] !== K) Y = (D) => {
        let j = D === "yes";
        if (j) jA($aY);
        K(j)
    }, q[0] = K, q[1] = Y;
    else Y = q[1];
    let z = Y,
        w;
    if (q[2] !== K) w = () => {
        K(!1)
    }, q[2] = K, q[3] = w;
    else w = q[3];
    let H = w,
        $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[4] = $;
    else $ = q[4];
    let O = $,
        _;
    if (q[5] !== z) _ = k91.default.createElement(kA, {
        options: O,
        onChange: z,
        defaultValue: "yes"
    }), q[5] = z, q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) J = k91.default.createElement(V, {
        dimColor: !0
    }, "You can also configure this in /config"), q[7] = J;
    else J = q[7];
    let X;
    if (q[8] !== H || q[9] !== _) X = k91.default.createElement(w8, {
        title: "Do you wish to disable auto-connect to IDE?",
        color: "ide",
        onCancel: H
    }, _, J), q[8] = H, q[9] = _, q[10] = X;
    else X = q[10];
    return X
}
// @from(Ln 398343, Col 0)
function $aY(A) {
    return {
        ...A,
        autoConnectIde: !1
    }
}
// @from(Ln 398350, Col 0)
function G4q() {
    let A = f6();
    return !bX() && A.autoConnectIde === !0
}
// @from(Ln 398354, Col 4)
k91
// @from(Ln 398355, Col 4)
Z4q = v(() => {
    i1();
    m1();
    cA();
    wY();
    q$();
    Bq();
    k91 = o(X1(), 1)
})
// @from(Ln 398364, Col 4)
V4q = {}
// @from(Ln 398371, Col 0)
function OaY(A) {
    let q = e(36),
        {
            availableIDEs: K,
            unavailableIDEs: Y,
            selectedIDE: z,
            onClose: w,
            onSelect: H
        } = A,
        $;
    if (q[0] !== z?.port) $ = z?.port?.toString() ?? "None", q[0] = z?.port, q[1] = $;
    else $ = q[1];
    let [O, _] = L91.useState($), [J, X] = L91.useState(!1), [D, j] = L91.useState(!1), M;
    if (q[2] !== K || q[3] !== H) M = (m) => {
        if (m !== "None" && P4q()) X(!0);
        else if (m === "None" && G4q()) j(!0);
        else H(K.find((b) => b.port === parseInt(m)))
    }, q[2] = K, q[3] = H, q[4] = M;
    else M = q[4];
    let P = M,
        W;
    if (q[5] !== K) W = K.reduce(JaY, {}), q[5] = K, q[6] = W;
    else W = q[6];
    let G = W,
        f;
    if (q[7] !== K || q[8] !== G) {
        let m;
        if (q[10] !== G) m = (b) => {
            let U = (G[b.name] || 0) > 1 && b.workspaceFolders.length > 0;
            return {
                label: b.name,
                value: b.port.toString(),
                description: U ? DxA(b.workspaceFolders) : void 0
            }
        }, q[10] = G, q[11] = m;
        else m = q[11];
        f = K.map(m).concat([{
            label: "None",
            value: "None",
            description: void 0
        }]), q[7] = K, q[8] = G, q[9] = f
    } else f = q[9];
    let Z = f;
    if (J) {
        let m;
        if (q[12] !== P || q[13] !== O) m = q0.default.createElement(M4q, {
            onComplete: () => P(O)
        }), q[12] = P, q[13] = O, q[14] = m;
        else m = q[14];
        return m
    }
    if (D) {
        let m;
        if (q[15] !== H) m = q0.default.createElement(W4q, {
            onComplete: () => {
                H(void 0)
            }
        }), q[15] = H, q[16] = m;
        else m = q[16];
        return m
    }
    let N;
    if (q[17] !== K.length) N = K.length === 0 && q0.default.createElement(V, {
        dimColor: !0
    }, gb1() ? `No available IDEs detected. Please install the plugin and restart your IDE:
https://docs.claude.com/s/claude-code-jetbrains` : "No available IDEs detected. Make sure your IDE has the Claude Code extension or plugin installed and is running."), q[17] = K.length, q[18] = N;
    else N = q[18];
    let T;
    if (q[19] !== K.length || q[20] !== P || q[21] !== Z || q[22] !== O) T = K.length !== 0 && q0.default.createElement(kA, {
        defaultValue: O,
        defaultFocusValue: O,
        options: Z,
        onChange: (m) => {
            _(m), P(m)
        }
    }), q[19] = K.length, q[20] = P, q[21] = Z, q[22] = O, q[23] = T;
    else T = q[23];
    let k;
    if (q[24] !== K.length) k = K.length !== 0 && !bX() && q0.default.createElement(I, {
        marginTop: 1
    }, q0.default.createElement(V, {
        dimColor: !0
    }, "Tip: You can enable auto-connect to IDE in /config or with the --ide flag")), q[24] = K.length, q[25] = k;
    else k = q[25];
    let y;
    if (q[26] !== Y) y = Y.length > 0 && q0.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, q0.default.createElement(V, {
        dimColor: !0
    }, "Found ", Y.length, " other running IDE(s). However, their workspace/project directories do not match the current cwd."), q0.default.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, Y.map(_aY))), q[26] = Y, q[27] = y;
    else y = q[27];
    let B;
    if (q[28] !== N || q[29] !== T || q[30] !== k || q[31] !== y) B = q0.default.createElement(I, {
        flexDirection: "column"
    }, N, T, k, y), q[28] = N, q[29] = T, q[30] = k, q[31] = y, q[32] = B;
    else B = q[32];
    let S;
    if (q[33] !== w || q[34] !== B) S = q0.default.createElement(w8, {
        title: "Select IDE",
        subtitle: "Connect to an IDE for integrated development features.",
        onCancel: w,
        color: "ide",
        borderDimColor: !1
    }, B), q[33] = w, q[34] = B, q[35] = S;
    else S = q[35];
    return S
}
// @from(Ln 398483, Col 0)
function _aY(A, q) {
    return q0.default.createElement(I, {
        key: q,
        paddingLeft: 3
    }, q0.default.createElement(V, {
        dimColor: !0
    }, "• ", A.name, ": ", DxA(A.workspaceFolders)))
}
// @from(Ln 398492, Col 0)
function JaY(A, q) {
    return A[q.name] = (A[q.name] || 0) + 1, A
}
// @from(Ln 398495, Col 0)
async function XaY(A, q) {
    let K = q?.ide;
    if (!K || K.type !== "sse-ide" && K.type !== "ws-ide") return null;
    for (let Y of A)
        if (Y.url === K.url) return Y;
    return null
}
// @from(Ln 398503, Col 0)
function DaY(A) {
    let q = e(15),
        {
            runningIDEs: K,
            onSelectIDE: Y,
            onDone: z
        } = A,
        [w, H] = L91.useState(K[0] ?? ""),
        $;
    if (q[0] !== Y) $ = (W) => {
        Y(W)
    }, q[0] = Y, q[1] = $;
    else $ = q[1];
    let O = $,
        _;
    if (q[2] !== K) _ = K.map(jaY), q[2] = K, q[3] = _;
    else _ = q[3];
    let J = _,
        X;
    if (q[4] !== z) X = function() {
        z("IDE selection cancelled", {
            display: "system"
        })
    }, q[4] = z, q[5] = X;
    else X = q[5];
    let D = X,
        j;
    if (q[6] !== O) j = (W) => {
        H(W), O(W)
    }, q[6] = O, q[7] = j;
    else j = q[7];
    let M;
    if (q[8] !== J || q[9] !== w || q[10] !== j) M = q0.default.createElement(kA, {
        defaultFocusValue: w,
        options: J,
        onChange: j
    }), q[8] = J, q[9] = w, q[10] = j, q[11] = M;
    else M = q[11];
    let P;
    if (q[12] !== D || q[13] !== M) P = q0.default.createElement(w8, {
        title: "Select IDE to install extension",
        onCancel: D,
        color: "ide",
        borderDimColor: !1
    }, M), q[12] = D, q[13] = M, q[14] = P;
    else P = q[14];
    return P
}
// @from(Ln 398552, Col 0)
function jaY(A) {
    return {
        label: S_(A),
        value: A
    }
}
// @from(Ln 398558, Col 0)
async function MaY(A, q, K) {
    c("tengu_ext_ide_command", {}), u8("ide-integration");
    let {
        options: {
            dynamicMcpConfig: Y
        },
        onChangeDynamicMcpConfig: z
    } = q, w = await Ub1(!0);
    if (w.length === 0 && q.onInstallIDEExtension && !bX()) {
        let J = await XXA(),
            X = (D) => {
                if (q.onInstallIDEExtension)
                    if (q.onInstallIDEExtension(D), Oh(D)) A(`Installed plugin to ${H6.bold(S_(D))}
Please ${H6.bold("restart your IDE")} completely for it to take effect`);
                    else A(`Installed extension to ${H6.bold(S_(D))}`)
            };
        if (J.length > 1) return q0.default.createElement(DaY, {
            runningIDEs: J,
            onSelectIDE: X,
            onDone: () => {
                A("No IDE selected.", {
                    display: "system"
                })
            }
        });
        else if (J.length === 1) {
            let D = J[0];
            return q0.default.createElement(() => {
                let M = e(1),
                    P;
                if (M[0] === Symbol.for("react.memo_cache_sentinel")) P = [], M[0] = P;
                else P = M[0];
                return L91.useEffect(PaY, P), null
            }, null)
        }
    }
    let H = w.filter((J) => J.isValid),
        $ = w.filter((J) => !J.isValid),
        O = await XaY(H, Y);
    return q0.default.createElement(OaY, {
        availableIDEs: H,
        unavailableIDEs: $,
        selectedIDE: O,
        onClose: () => A("IDE selection cancelled", {
            display: "system"
        }),
        onSelect: async (J) => {
            try {
                if (!z) {
                    A("Error connecting to IDE.");
                    return
                }
                let X = {
                    ...Y || {}
                };
                if (O) delete X.ide;
                if (!J) A(O ? `Disconnected from ${O.name}.` : "No IDE selected.");
                else {
                    let D = J.url;
                    X.ide = {
                        type: D.startsWith("ws:") ? "ws-ide" : "sse-ide",
                        url: D,
                        ideName: J.name,
                        authToken: J.authToken,
                        ideRunningInWindows: J.ideRunningInWindows,
                        scope: "dynamic"
                    }, A(`Connected to ${J.name}.`)
                }
                z(X)
            } catch (X) {
                A("Error connecting to IDE.")
            }
        }
    })
}
// @from(Ln 398634, Col 0)
function DxA(A, q = 100) {
    if (A.length === 0) return "";
    let K = h6(),
        Y = A.slice(0, 2),
        z = A.length > 2,
        w = z ? 3 : 0,
        H = (Y.length - 1) * 2,
        $ = q - H - w,
        O = Math.floor($ / Y.length),
        _ = K.normalize("NFC"),
        X = Y.map((D) => {
            let j = D.normalize("NFC");
            if (j.startsWith(_ + f4q.sep)) D = j.slice(_.length + 1);
            if (D.length <= O) return D;
            return "…" + D.slice(-(O - 1))
        }).join(", ");
    if (z) X += ", …";
    return X
}
// @from(Ln 398654, Col 0)
function PaY() {
    onInstall(ideToInstall)
}
// @from(Ln 398657, Col 4)
q0
// @from(Ln 398657, Col 8)
L91
// @from(Ln 398658, Col 4)
N4q = v(() => {
    i1();
    m1();
    wY();
    Z4q();
    q$();
    u6();
    v3();
    Bq();
    Et();
    N7();
    tq();
    q3();
    q0 = o(X1(), 1), L91 = o(X1(), 1)
})
// @from(Ln 398673, Col 4)
WaY
// @from(Ln 398673, Col 9)
T4q
// @from(Ln 398674, Col 4)
v4q = v(() => {
    WaY = {
        type: "local-jsx",
        name: "ide",
        description: "Manage IDE integrations and show status",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[open]",
        load: () => Promise.resolve().then(() => (N4q(), V4q)),
        userFacingName() {
            return "ide"
        }
    }, T4q = WaY
})
// @from(Ln 398688, Col 4)
GaY
// @from(Ln 398688, Col 9)
E4q
// @from(Ln 398689, Col 4)
k4q = v(() => {
    Ex1();
    v3();
    GaY = {
        type: "prompt",
        name: "init",
        description: "Initialize a new CLAUDE.md file with codebase documentation",
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        progressMessage: "analyzing your codebase",
        userFacingName() {
            return "init"
        },
        source: "builtin",
        async getPromptForCommand() {
            return u8("init"), yD1(), [{
                type: "text",
                text: `Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

What to add:
1. Commands that will be commonly used, such as how to build, lint, and run tests. Include the necessary commands to develop in this codebase, such as how to run a single test.
2. High-level code architecture and structure so that future instances can be productive more quickly. Focus on the "big picture" architecture that requires reading multiple files to understand.

Usage notes:
- If there's already a CLAUDE.md, suggest improvements to it.
- When you make the initial CLAUDE.md, do not repeat yourself and do not include obvious instructions like "Provide helpful error messages to users", "Write unit tests for all new utilities", "Never include sensitive information (API keys, tokens) in code or commits".
- Avoid listing every component or file structure that can be easily discovered.
- Don't include generic development practices.
- If there are Cursor rules (in .cursor/rules/ or .cursorrules) or Copilot rules (in .github/copilot-instructions.md), make sure to include the important parts.
- If there is a README.md, make sure to include the important parts.
- Do not make up information such as "Common Development Tasks", "Tips for Development", "Support and Documentation" unless this is expressly included in other files that you read.
- Be sure to prefix the file with the following text:

\`\`\`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
\`\`\``
            }]
        }
    }, E4q = GaY
})
// @from(Ln 398732, Col 4)
L4q = () => {}
// @from(Ln 398734, Col 0)
function ZaY(A) {
    let q = new Set(qS1.map((K) => k71(K.key)));
    return A.map((K) => {
        let Y = {};
        for (let [z, w] of Object.entries(K.bindings))
            if (!q.has(k71(z))) Y[z] = w;
        return {
            context: K.context,
            bindings: Y
        }
    }).filter((K) => Object.keys(K.bindings).length > 0)
}
// @from(Ln 398747, Col 0)
function R4q() {
    let q = {
        $schema: "https://www.schemastore.org/claude-code-keybindings.json",
        $docs: "https://code.claude.com/docs/en/keybindings",
        bindings: ZaY(kJ1)
    };
    return Q1(q, null, 2) + `
`
}
// @from(Ln 398756, Col 4)
y4q = v(() => {
    P36();
    W36();
    m6()
})
// @from(Ln 398761, Col 4)
C4q = {}
// @from(Ln 398773, Col 0)
async function vaY() {
    if (u8("keybindings"), !Hv()) return {
        type: "text",
        value: "Keybinding customization is not enabled. This feature is currently in preview."
    };
    let A = R71(),
        q = !1;
    try {
        await faY(A), q = !0
    } catch {}
    if (!q) {
        let K = R4q(),
            Y = TaY(A);
        await NaY(Y, {
            recursive: !0
        }), await VaY(A, K, "utf-8")
    }
    try {
        return await KF(A), {
            type: "text",
            value: q ? `Opened ${A} in your editor.` : `Created ${A} with template. Opened in your editor.`
        }
    } catch (K) {
        return {
            type: "text",
            value: `${q?"Opened":"Created"} ${A}. Could not open in editor: ${K instanceof Error?K.message:String(K)}`
        }
    }
}
// @from(Ln 398802, Col 4)
S4q = v(() => {
    AU();
    y4q();
    YF();
    v3()
})
// @from(Ln 398808, Col 4)
EaY
// @from(Ln 398808, Col 9)
jxA
// @from(Ln 398809, Col 4)
h4q = v(() => {
    AU();
    EaY = {
        name: "keybindings",
        description: "Open or create your keybindings configuration file",
        isEnabled: () => Hv(),
        isHidden: !1,
        supportsNonInteractive: !1,
        type: "local",
        load: () => Promise.resolve().then(() => (S4q(), C4q)),
        userFacingName: () => "keybindings"
    }, jxA = EaY
})
// @from(Ln 398822, Col 4)
I4q = () => ({
    type: "local-jsx",
    name: "login",
    description: ol8() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGIN_COMMAND,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (_M6(), II4)),
    userFacingName() {
        return "login"
    }
})
// @from(Ln 398833, Col 4)
x4q = v(() => {
    J7()
})
// @from(Ln 398836, Col 4)
b4q
// @from(Ln 398837, Col 4)
u4q = v(() => {
    b4q = {
        type: "local-jsx",
        name: "logout",
        description: "Sign out from your Anthropic account",
        isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Pj6(), gL4)),
        userFacingName() {
            return "logout"
        }
    }
})
// @from(Ln 398851, Col 0)
function m4q() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = B4q.default.createElement(V, null, "Checking GitHub CLI installation…"), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 398858, Col 4)
B4q
// @from(Ln 398859, Col 4)
F4q = v(() => {
    i1();
    m1();
    B4q = o(X1(), 1)
})
// @from(Ln 398865, Col 0)
function Q4q(A) {
    let q = e(42),
        {
            currentRepo: K,
            useCurrentRepo: Y,
            repoUrl: z,
            onRepoUrlChange: w,
            onSubmit: H,
            onToggleUseCurrentRepo: $
        } = A,
        [O, _] = qD.useState(0),
        [J, X] = qD.useState(!1),
        j = Z8().columns,
        M;
    if (q[0] !== K || q[1] !== H || q[2] !== z || q[3] !== Y) M = () => {
        if (!(Y ? K : z)?.trim()) {
            X(!0);
            return
        }
        H()
    }, q[0] = K, q[1] = H, q[2] = z, q[3] = Y, q[4] = M;
    else M = q[4];
    let P = M,
        W, G;
    if (q[5] !== $) W = () => {
        $(!0), X(!1)
    }, G = () => {
        $(!1), X(!1)
    }, q[5] = $, q[6] = W, q[7] = G;
    else W = q[6], G = q[7];
    let f;
    if (q[8] !== P || q[9] !== W || q[10] !== G) f = {
        "confirm:previous": W,
        "confirm:next": G,
        "confirm:yes": P
    }, q[8] = P, q[9] = W, q[10] = G, q[11] = f;
    else f = q[11];
    let Z;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) Z = {
        context: "Confirmation"
    }, q[12] = Z;
    else Z = q[12];
    c7(f, Z);
    let N;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) N = qD.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, qD.default.createElement(V, {
        bold: !0
    }, "Install GitHub App"), qD.default.createElement(V, {
        dimColor: !0
    }, "Select GitHub repository")), q[13] = N;
    else N = q[13];
    let T;
    if (q[14] !== K || q[15] !== Y) T = K && qD.default.createElement(I, {
        marginBottom: 1
    }, qD.default.createElement(V, {
        bold: Y,
        color: Y ? "permission" : void 0
    }, Y ? "> " : "  ", "Use current repository: ", K)), q[14] = K, q[15] = Y, q[16] = T;
    else T = q[16];
    let k = !Y || !K,
        y = !Y || !K ? "permission" : void 0,
        B = !Y || !K ? "> " : "  ",
        S = K ? "Enter a different repository" : "Enter repository",
        m;
    if (q[17] !== B || q[18] !== S || q[19] !== k || q[20] !== y) m = qD.default.createElement(I, {
        marginBottom: 1
    }, qD.default.createElement(V, {
        bold: k,
        color: y
    }, B, S)), q[17] = B, q[18] = S, q[19] = k, q[20] = y, q[21] = m;
    else m = q[21];
    let b;
    if (q[22] !== K || q[23] !== O || q[24] !== P || q[25] !== w || q[26] !== z || q[27] !== j || q[28] !== Y) b = (!Y || !K) && qD.default.createElement(I, {
        marginLeft: 2,
        marginBottom: 1
    }, qD.default.createElement(k3, {
        value: z,
        onChange: (r) => {
            w(r), X(!1)
        },
        onSubmit: P,
        focus: !0,
        placeholder: "Enter a repo as owner/repo or https://github.com/owner/repo…",
        columns: j,
        cursorOffset: O,
        onChangeCursorOffset: _,
        showCursor: !0
    })), q[22] = K, q[23] = O, q[24] = P, q[25] = w, q[26] = z, q[27] = j, q[28] = Y, q[29] = b;
    else b = q[29];
    let g;
    if (q[30] !== m || q[31] !== b || q[32] !== T) g = qD.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, N, T, m, b), q[30] = m, q[31] = b, q[32] = T, q[33] = g;
    else g = q[33];
    let U;
    if (q[34] !== J) U = J && qD.default.createElement(I, {
        marginLeft: 3,
        marginBottom: 1
    }, qD.default.createElement(V, {
        color: "error"
    }, "Please enter a repository name to continue")), q[34] = J, q[35] = U;
    else U = q[35];
    let x = K ? "↑/↓ to select · " : "",
        p;
    if (q[36] !== x) p = qD.default.createElement(I, {
        marginLeft: 3
    }, qD.default.createElement(V, {
        dimColor: !0
    }, x, "Enter to continue")), q[36] = x, q[37] = p;
    else p = q[37];
    let l;
    if (q[38] !== g || q[39] !== U || q[40] !== p) l = qD.default.createElement(qD.default.Fragment, null, g, U, p), q[38] = g, q[39] = U, q[40] = p, q[41] = l;
    else l = q[41];
    return l
}
// @from(Ln 398985, Col 4)
qD
// @from(Ln 398986, Col 4)
g4q = v(() => {
    i1();
    m1();
    K7();
    gO();
    mq();
    qD = o(X1(), 1)
})
// @from(Ln 398994, Col 4)
U4q = "Add Claude Code GitHub Workflow"
// @from(Ln 398995, Col 4)
zF = "https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md"
// @from(Ln 398996, Col 4)
p4q = `name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read # Required for Claude to read CI results on PRs
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}

          # This is an optional setting that allows Claude to read CI results on PRs
          additional_permissions: |
            actions: read

          # Optional: Give a custom prompt to Claude. If this is not specified, Claude will perform the instructions specified in the comment that tagged it.
          # prompt: 'Update the pull request description to include a summary of changes.'

          # Optional: Add claude_args to customize behavior and configuration
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options
          # claude_args: '--allowed-tools Bash(gh pr:*)'

`
// @from(Ln 399047, Col 4)
d4q = `## \uD83E\uDD16 Installing Claude Code GitHub App

This PR adds a GitHub Actions workflow that enables Claude Code integration in our repository.

### What is Claude Code?

[Claude Code](https://claude.com/claude-code) is an AI coding agent that can help with:
- Bug fixes and improvements  
- Documentation updates
- Implementing new features
- Code reviews and suggestions
- Writing tests
- And more!

### How it works

Once this PR is merged, we'll be able to interact with Claude by mentioning @claude in a pull request or issue comment.
Once the workflow is triggered, Claude will analyze the comment and surrounding context, and execute on the request in a GitHub action.

### Important Notes

- **This workflow won't take effect until this PR is merged**
- **@claude mentions won't work until after the merge is complete**
- The workflow runs automatically whenever Claude is mentioned in PR or issue comments
- Claude gets access to the entire PR or issue context including files, diffs, and previous comments

### Security

- Our Anthropic API key is securely stored as a GitHub Actions secret
- Only users with write access to the repository can trigger the workflow
- All Claude runs are stored in the GitHub Actions run history
- Claude's default tools are limited to reading/writing files and interacting with our repo by creating comments, branches, and commits.
- We can add more allowed tools by adding them to the workflow file like:

\`\`\`
allowed_tools: Bash(npm install),Bash(npm run build),Bash(npm run lint),Bash(npm run test)
\`\`\`

There's more information in the [Claude Code action repo](https://github.com/anthropics/claude-code-action).

After merging this PR, let's try mentioning @claude in a comment on any PR to get started!`
// @from(Ln 399088, Col 4)
c4q = `name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
    # Optional: Only run on specific file changes
    # paths:
    #   - "src/**/*.ts"
    #   - "src/**/*.tsx"
    #   - "src/**/*.js"
    #   - "src/**/*.jsx"

jobs:
  claude-review:
    # Optional: Filter by PR author
    # if: |
    #   github.event.pull_request.user.login == 'external-contributor' ||
    #   github.event.pull_request.user.login == 'new-developer' ||
    #   github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'

    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: 'https://github.com/anthropics/claude-code.git'
          plugins: 'code-review@claude-code-plugins'
          prompt: '/code-review:code-review \${{ github.repository }}/pull/\${{ github.event.pull_request.number }}'
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options

`
// @from(Ln 399134, Col 0)
function l4q(A) {
    let q = e(12),
        {
            repoUrl: K,
            onSubmit: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, q[0] = z;
    else z = q[0];
    DA("confirm:yes", Y, z);
    let w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = KD.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, KD.default.createElement(V, {
        bold: !0
    }, "Install the Claude GitHub App")), q[1] = w;
    else w = q[1];
    let H;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) H = KD.default.createElement(I, {
        marginBottom: 1
    }, KD.default.createElement(V, null, "Opening browser to install the Claude GitHub App…")), q[2] = H;
    else H = q[2];
    let $;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) $ = KD.default.createElement(I, {
        marginBottom: 1
    }, KD.default.createElement(V, null, "If your browser doesn't open automatically, visit:")), q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = KD.default.createElement(I, {
        marginBottom: 1
    }, KD.default.createElement(V, {
        underline: !0
    }, "https://github.com/apps/claude")), q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== K) _ = KD.default.createElement(I, {
        marginBottom: 1
    }, KD.default.createElement(V, null, "Please install the app for repository: ", KD.default.createElement(V, {
        bold: !0
    }, K))), q[5] = K, q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) J = KD.default.createElement(I, {
        marginBottom: 1
    }, KD.default.createElement(V, {
        dimColor: !0
    }, "Important: Make sure to grant access to this specific repository")), q[7] = J;
    else J = q[7];
    let X;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) X = KD.default.createElement(I, null, KD.default.createElement(V, {
        bold: !0,
        color: "permission"
    }, "Press Enter once you've installed the app", l1.ellipsis)), q[8] = X;
    else X = q[8];
    let D;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) D = KD.default.createElement(I, {
        marginTop: 1
    }, KD.default.createElement(V, {
        dimColor: !0
    }, "Having trouble? See manual setup instructions at:", " ", KD.default.createElement(V, {
        color: "claude"
    }, zF))), q[9] = D;
    else D = q[9];
    let j;
    if (q[10] !== _) j = KD.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, w, H, $, O, _, J, X, D), q[10] = _, q[11] = j;
    else j = q[11];
    return j
}
// @from(Ln 399210, Col 4)
KD
// @from(Ln 399211, Col 4)
i4q = v(() => {
    i1();
    m1();
    K7();
    b7();
    KD = o(X1(), 1)
})
// @from(Ln 399219, Col 0)
function n4q(A) {
    let q = e(35),
        {
            useExistingSecret: K,
            secretName: Y,
            onToggleUseExistingSecret: z,
            onSecretNameChange: w,
            onSubmit: H
        } = A,
        [$, O] = s$.useState(0),
        _ = Z8(),
        [J] = T7(),
        X, D;
    if (q[0] !== z) X = () => z(!0), D = () => z(!1), q[0] = z, q[1] = X, q[2] = D;
    else X = q[1], D = q[2];
    let j;
    if (q[3] !== H || q[4] !== X || q[5] !== D) j = {
        "confirm:previous": X,
        "confirm:next": D,
        "confirm:yes": H
    }, q[3] = H, q[4] = X, q[5] = D, q[6] = j;
    else j = q[6];
    let M;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) M = {
        context: "Confirmation"
    }, q[7] = M;
    else M = q[7];
    c7(j, M);
    let P;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) P = s$.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, s$.default.createElement(V, {
        bold: !0
    }, "Install GitHub App"), s$.default.createElement(V, {
        dimColor: !0
    }, "Setup API key secret")), q[8] = P;
    else P = q[8];
    let W;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) W = s$.default.createElement(I, {
        marginBottom: 1
    }, s$.default.createElement(V, {
        color: "warning"
    }, "ANTHROPIC_API_KEY already exists in repository secrets!")), q[9] = W;
    else W = q[9];
    let G;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) G = s$.default.createElement(I, {
        marginBottom: 1
    }, s$.default.createElement(V, null, "Would you like to:")), q[10] = G;
    else G = q[10];
    let f;
    if (q[11] !== J || q[12] !== K) f = K ? k8("success", J)("> ") : "  ", q[11] = J, q[12] = K, q[13] = f;
    else f = q[13];
    let Z;
    if (q[14] !== f) Z = s$.default.createElement(I, {
        marginBottom: 1
    }, s$.default.createElement(V, null, f, "Use the existing API key")), q[14] = f, q[15] = Z;
    else Z = q[15];
    let N;
    if (q[16] !== J || q[17] !== K) N = !K ? k8("success", J)("> ") : "  ", q[16] = J, q[17] = K, q[18] = N;
    else N = q[18];
    let T;
    if (q[19] !== N) T = s$.default.createElement(I, {
        marginBottom: 1
    }, s$.default.createElement(V, null, N, "Create a new secret with a different name")), q[19] = N, q[20] = T;
    else T = q[20];
    let k;
    if (q[21] !== $ || q[22] !== w || q[23] !== H || q[24] !== Y || q[25] !== _ || q[26] !== K) k = !K && s$.default.createElement(s$.default.Fragment, null, s$.default.createElement(I, {
        marginBottom: 1
    }, s$.default.createElement(V, null, "Enter new secret name (alphanumeric with underscores):")), s$.default.createElement(k3, {
        value: Y,
        onChange: w,
        onSubmit: H,
        focus: !0,
        placeholder: "e.g., CLAUDE_API_KEY",
        columns: _.columns,
        cursorOffset: $,
        onChangeCursorOffset: O,
        showCursor: !0
    })), q[21] = $, q[22] = w, q[23] = H, q[24] = Y, q[25] = _, q[26] = K, q[27] = k;
    else k = q[27];
    let y;
    if (q[28] !== T || q[29] !== k || q[30] !== Z) y = s$.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, P, W, G, Z, T, k), q[28] = T, q[29] = k, q[30] = Z, q[31] = y;
    else y = q[31];
    let B;
    if (q[32] === Symbol.for("react.memo_cache_sentinel")) B = s$.default.createElement(I, {
        marginLeft: 3
    }, s$.default.createElement(V, {
        dimColor: !0
    }, "↑/↓ to select · Enter to continue")), q[32] = B;
    else B = q[32];
    let S;
    if (q[33] !== y) S = s$.default.createElement(s$.default.Fragment, null, y, B), q[33] = y, q[34] = S;
    else S = q[34];
    return S
}
// @from(Ln 399320, Col 4)
s$
// @from(Ln 399321, Col 4)
r4q = v(() => {
    i1();
    m1();
    K7();
    gO();
    mq();
    s$ = o(X1(), 1)
})
// @from(Ln 399330, Col 0)
function o4q(A) {
    let q = e(49),
        {
            existingApiKey: K,
            apiKeyOrOAuthToken: Y,
            onApiKeyChange: z,
            onSubmit: w,
            onToggleUseExistingKey: H,
            onCreateOAuthToken: $,
            selectedOption: O,
            onSelectOption: _
        } = A,
        J = O === void 0 ? K ? "existing" : $ ? "oauth" : "new" : O,
        [X, D] = Rj.useState(0),
        j = Z8(),
        [M] = T7(),
        P;
    if (q[0] !== K || q[1] !== $ || q[2] !== _ || q[3] !== H || q[4] !== J) P = () => {
        if (J === "new" && $) _?.("oauth");
        else if (J === "oauth" && K) _?.("existing"), H(!0)
    }, q[0] = K, q[1] = $, q[2] = _, q[3] = H, q[4] = J, q[5] = P;
    else P = q[5];
    let W = P,
        G;
    if (q[6] !== $ || q[7] !== _ || q[8] !== H || q[9] !== J) G = () => {
        if (J === "existing") _?.($ ? "oauth" : "new"), H(!1);
        else if (J === "oauth") _?.("new")
    }, q[6] = $, q[7] = _, q[8] = H, q[9] = J, q[10] = G;
    else G = q[10];
    let f = G,
        Z;
    if (q[11] !== $ || q[12] !== w || q[13] !== J) Z = () => {
        if (J === "oauth" && $) $();
        else w()
    }, q[11] = $, q[12] = w, q[13] = J, q[14] = Z;
    else Z = q[14];
    let N = Z,
        T;
    if (q[15] !== N || q[16] !== f || q[17] !== W) T = {
        "confirm:previous": W,
        "confirm:next": f,
        "confirm:yes": N
    }, q[15] = N, q[16] = f, q[17] = W, q[18] = T;
    else T = q[18];
    let k;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) k = {
        context: "Confirmation"
    }, q[19] = k;
    else k = q[19];
    c7(T, k);
    let y;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) y = Rj.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, Rj.default.createElement(V, {
        bold: !0
    }, "Install GitHub App"), Rj.default.createElement(V, {
        dimColor: !0
    }, "Choose API key")), q[20] = y;
    else y = q[20];
    let B;
    if (q[21] !== K || q[22] !== J || q[23] !== M) B = K && Rj.default.createElement(I, {
        marginBottom: 1
    }, Rj.default.createElement(V, null, J === "existing" ? k8("success", M)("> ") : "  ", "Use your existing Claude Code API key")), q[21] = K, q[22] = J, q[23] = M, q[24] = B;
    else B = q[24];
    let S;
    if (q[25] !== $ || q[26] !== J || q[27] !== M) S = $ && Rj.default.createElement(I, {
        marginBottom: 1
    }, Rj.default.createElement(V, null, J === "oauth" ? k8("success", M)("> ") : "  ", "Create a long-lived token with your Claude subscription")), q[25] = $, q[26] = J, q[27] = M, q[28] = S;
    else S = q[28];
    let m;
    if (q[29] !== J || q[30] !== M) m = J === "new" ? k8("success", M)("> ") : "  ", q[29] = J, q[30] = M, q[31] = m;
    else m = q[31];
    let b;
    if (q[32] !== m) b = Rj.default.createElement(I, {
        marginBottom: 1
    }, Rj.default.createElement(V, null, m, "Enter a new API key")), q[32] = m, q[33] = b;
    else b = q[33];
    let g;
    if (q[34] !== Y || q[35] !== X || q[36] !== z || q[37] !== w || q[38] !== J || q[39] !== j) g = J === "new" && Rj.default.createElement(k3, {
        value: Y,
        onChange: z,
        onSubmit: w,
        onPaste: z,
        focus: !0,
        placeholder: "sk-ant… (Create a new key at https://platform.claude.com/settings/keys)",
        mask: "*",
        columns: j.columns,
        cursorOffset: X,
        onChangeCursorOffset: D,
        showCursor: !0
    }), q[34] = Y, q[35] = X, q[36] = z, q[37] = w, q[38] = J, q[39] = j, q[40] = g;
    else g = q[40];
    let U;
    if (q[41] !== b || q[42] !== g || q[43] !== B || q[44] !== S) U = Rj.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, y, B, S, b, g), q[41] = b, q[42] = g, q[43] = B, q[44] = S, q[45] = U;
    else U = q[45];
    let x;
    if (q[46] === Symbol.for("react.memo_cache_sentinel")) x = Rj.default.createElement(I, {
        marginLeft: 3
    }, Rj.default.createElement(V, {
        dimColor: !0
    }, "↑/↓ to select · Enter to continue")), q[46] = x;
    else x = q[46];
    let p;
    if (q[47] !== U) p = Rj.default.createElement(Rj.default.Fragment, null, U, x), q[47] = U, q[48] = p;
    else p = q[48];
    return p
}
// @from(Ln 399443, Col 4)
Rj
// @from(Ln 399444, Col 4)
a4q = v(() => {
    i1();
    m1();
    K7();
    gO();
    mq();
    Rj = o(X1(), 1)
})
// @from(Ln 399453, Col 0)
function s4q(A) {
    let q = e(10),
        {
            currentWorkflowInstallStep: K,
            secretExists: Y,
            useExistingSecret: z,
            secretName: w,
            skipWorkflow: H,
            selectedWorkflows: $
        } = A,
        O = H === void 0 ? !1 : H,
        _;
    if (q[0] !== Y || q[1] !== w || q[2] !== $ || q[3] !== O || q[4] !== z) _ = O ? ["Getting repository information", Y && z ? "Using existing API key secret" : `Setting up ${w} secret`] : ["Getting repository information", "Creating branch", $.length > 1 ? "Creating workflow files" : "Creating workflow file", Y && z ? "Using existing API key secret" : `Setting up ${w} secret`, "Opening pull request page"], q[0] = Y, q[1] = w, q[2] = $, q[3] = O, q[4] = z, q[5] = _;
    else _ = q[5];
    let J = _,
        X;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) X = Xc.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, Xc.default.createElement(V, {
        bold: !0
    }, "Install GitHub App"), Xc.default.createElement(V, {
        dimColor: !0
    }, "Create GitHub Actions workflow")), q[6] = X;
    else X = q[6];
    let D;
    if (q[7] !== K || q[8] !== J) D = Xc.default.createElement(Xc.default.Fragment, null, Xc.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, X, J.map((j, M) => {
        let P = "pending";
        if (M < K) P = "completed";
        else if (M === K) P = "in-progress";
        return Xc.default.createElement(I, {
            key: M
        }, Xc.default.createElement(V, {
            color: P === "completed" ? "success" : P === "in-progress" ? "warning" : void 0
        }, P === "completed" ? "✓ " : "", j, P === "in-progress" ? "…" : ""))
    }))), q[7] = K, q[8] = J, q[9] = D;
    else D = q[9];
    return D
}
// @from(Ln 399497, Col 4)
Xc
// @from(Ln 399498, Col 4)
t4q = v(() => {
    i1();
    m1();
    Xc = o(X1(), 1)
})
// @from(Ln 399504, Col 0)
function e4q(A) {
    let q = e(21),
        {
            secretExists: K,
            useExistingSecret: Y,
            secretName: z,
            skipWorkflow: w
        } = A,
        H = w === void 0 ? !1 : w,
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = RH.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, RH.default.createElement(V, {
        bold: !0
    }, "Install GitHub App"), RH.default.createElement(V, {
        dimColor: !0
    }, "Success")), q[0] = $;
    else $ = q[0];
    let O;
    if (q[1] !== H) O = !H && RH.default.createElement(V, {
        color: "success"
    }, "✓ GitHub Actions workflow created!"), q[1] = H, q[2] = O;
    else O = q[2];
    let _;
    if (q[3] !== K || q[4] !== Y) _ = K && Y && RH.default.createElement(I, {
        marginTop: 1
    }, RH.default.createElement(V, {
        color: "success"
    }, "✓ Using existing ANTHROPIC_API_KEY secret")), q[3] = K, q[4] = Y, q[5] = _;
    else _ = q[5];
    let J;
    if (q[6] !== K || q[7] !== z || q[8] !== Y) J = (!K || !Y) && RH.default.createElement(I, {
        marginTop: 1
    }, RH.default.createElement(V, {
        color: "success"
    }, "✓ API key saved as ", z, " secret")), q[6] = K, q[7] = z, q[8] = Y, q[9] = J;
    else J = q[9];
    let X;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) X = RH.default.createElement(I, {
        marginTop: 1
    }, RH.default.createElement(V, null, "Next steps:")), q[10] = X;
    else X = q[10];
    let D;
    if (q[11] !== H) D = H ? RH.default.createElement(RH.default.Fragment, null, RH.default.createElement(V, null, "1. Install the Claude GitHub App if you haven't already"), RH.default.createElement(V, null, "2. Your workflow file was kept unchanged"), RH.default.createElement(V, null, "3. API key is configured and ready to use")) : RH.default.createElement(RH.default.Fragment, null, RH.default.createElement(V, null, "1. A pre-filled PR page has been created"), RH.default.createElement(V, null, "2. Install the Claude GitHub App if you haven't already"), RH.default.createElement(V, null, "3. Merge the PR to enable Claude PR assistance")), q[11] = H, q[12] = D;
    else D = q[12];
    let j;
    if (q[13] !== O || q[14] !== _ || q[15] !== J || q[16] !== D) j = RH.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, $, O, _, J, X, D), q[13] = O, q[14] = _, q[15] = J, q[16] = D, q[17] = j;
    else j = q[17];
    let M;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) M = RH.default.createElement(I, {
        marginLeft: 3
    }, RH.default.createElement(V, {
        dimColor: !0
    }, "Press any key to exit")), q[18] = M;
    else M = q[18];
    let P;
    if (q[19] !== j) P = RH.default.createElement(RH.default.Fragment, null, j, M), q[19] = j, q[20] = P;
    else P = q[20];
    return P
}
// @from(Ln 399570, Col 4)
RH
// @from(Ln 399571, Col 4)
Aqq = v(() => {
    i1();
    m1();
    RH = o(X1(), 1)
})
// @from(Ln 399577, Col 0)
function qqq(A) {
    let q = e(15),
        {
            error: K,
            errorReason: Y,
            errorInstructions: z
        } = A,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = K0.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, K0.default.createElement(V, {
        bold: !0
    }, "Install GitHub App")), q[0] = w;
    else w = q[0];
    let H;
    if (q[1] !== K) H = K0.default.createElement(V, {
        color: "error"
    }, "Error: ", K), q[1] = K, q[2] = H;
    else H = q[2];
    let $;
    if (q[3] !== Y) $ = Y && K0.default.createElement(I, {
        marginTop: 1
    }, K0.default.createElement(V, {
        dimColor: !0
    }, "Reason: ", Y)), q[3] = Y, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== z) O = z && z.length > 0 && K0.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, K0.default.createElement(V, {
        dimColor: !0
    }, "How to fix:"), z.map(kaY)), q[5] = z, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) _ = K0.default.createElement(I, {
        marginTop: 1
    }, K0.default.createElement(V, {
        dimColor: !0
    }, "For manual setup instructions, see:", " ", K0.default.createElement(V, {
        color: "claude"
    }, zF))), q[7] = _;
    else _ = q[7];
    let J;
    if (q[8] !== H || q[9] !== $ || q[10] !== O) J = K0.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, w, H, $, O, _), q[8] = H, q[9] = $, q[10] = O, q[11] = J;
    else J = q[11];
    let X;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) X = K0.default.createElement(I, {
        marginLeft: 3
    }, K0.default.createElement(V, {
        dimColor: !0
    }, "Press any key to exit")), q[12] = X;
    else X = q[12];
    let D;
    if (q[13] !== J) D = K0.default.createElement(K0.default.Fragment, null, J, X), q[13] = J, q[14] = D;
    else D = q[14];
    return D
}
// @from(Ln 399642, Col 0)
function kaY(A, q) {
    return K0.default.createElement(I, {
        key: q,
        marginLeft: 2
    }, K0.default.createElement(V, {
        dimColor: !0
    }, "• "), K0.default.createElement(V, null, A))
}
// @from(Ln 399650, Col 4)
K0
// @from(Ln 399651, Col 4)
Kqq = v(() => {
    i1();
    m1();
    K0 = o(X1(), 1)
})
// @from(Ln 399657, Col 0)
function Yqq(A) {
    let q = e(16),
        {
            repoName: K,
            onSelectAction: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = [{
        label: "Update workflow file with latest version",
        value: "update"
    }, {
        label: "Skip workflow update (configure secrets only)",
        value: "skip"
    }, {
        label: "Exit without making changes",
        value: "exit"
    }], q[0] = z;
    else z = q[0];
    let w = z,
        H;
    if (q[1] !== Y) H = (W) => {
        Y(W)
    }, q[1] = Y, q[2] = H;
    else H = q[2];
    let $ = H,
        O;
    if (q[3] !== Y) O = () => {
        Y("exit")
    }, q[3] = Y, q[4] = O;
    else O = q[4];
    let _ = O,
        J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = yN.default.createElement(V, {
        bold: !0
    }, "Existing Workflow Found"), q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== K) X = yN.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, J, yN.default.createElement(V, {
        dimColor: !0
    }, "Repository: ", K)), q[6] = K, q[7] = X;
    else X = q[7];
    let D;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) D = yN.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, yN.default.createElement(V, null, "A Claude workflow file already exists at", " ", yN.default.createElement(V, {
        color: "claude"
    }, ".github/workflows/claude.yml")), yN.default.createElement(V, {
        dimColor: !0
    }, "What would you like to do?")), q[8] = D;
    else D = q[8];
    let j;
    if (q[9] !== _ || q[10] !== $) j = yN.default.createElement(I, {
        flexDirection: "column"
    }, yN.default.createElement(kA, {
        options: w,
        onChange: $,
        onCancel: _
    })), q[9] = _, q[10] = $, q[11] = j;
    else j = q[11];
    let M;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) M = yN.default.createElement(I, {
        marginTop: 1
    }, yN.default.createElement(V, {
        dimColor: !0
    }, "View the latest workflow template at:", " ", yN.default.createElement(V, {
        color: "claude"
    }, "https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml"))), q[12] = M;
    else M = q[12];
    let P;
    if (q[13] !== X || q[14] !== j) P = yN.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, X, D, j, M), q[13] = X, q[14] = j, q[15] = P;
    else P = q[15];
    return P
}
// @from(Ln 399739, Col 4)
yN
// @from(Ln 399740, Col 4)
zqq = v(() => {
    i1();
    m1();
    wY();
    yN = o(X1(), 1)
})
// @from(Ln 399747, Col 0)
function wqq(A) {
    let q = e(8),
        {
            warnings: K,
            onContinue: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, q[0] = z;
    else z = q[0];
    DA("confirm:yes", Y, z);
    let w;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) w = GP.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, GP.default.createElement(V, {
        bold: !0
    }, l1.warning, " Setup Warnings"), GP.default.createElement(V, {
        dimColor: !0
    }, "We found some potential issues, but you can continue anyway")), q[1] = w;
    else w = q[1];
    let H;
    if (q[2] !== K) H = K.map(LaY), q[2] = K, q[3] = H;
    else H = q[3];
    let $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = GP.default.createElement(I, {
        marginTop: 1
    }, GP.default.createElement(V, {
        bold: !0,
        color: "permission"
    }, "Press Enter to continue anyway, or Ctrl+C to exit and fix issues")), q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = GP.default.createElement(I, {
        marginTop: 1
    }, GP.default.createElement(V, {
        dimColor: !0
    }, "You can also try the manual setup steps if needed:", " ", GP.default.createElement(V, {
        color: "claude"
    }, zF))), q[5] = O;
    else O = q[5];
    let _;
    if (q[6] !== H) _ = GP.default.createElement(GP.default.Fragment, null, GP.default.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, w, H, $, O)), q[6] = H, q[7] = _;
    else _ = q[7];
    return _
}
// @from(Ln 399800, Col 0)
function LaY(A, q) {
    return GP.default.createElement(I, {
        key: q,
        flexDirection: "column",
        marginBottom: 1
    }, GP.default.createElement(V, {
        color: "warning",
        bold: !0
    }, A.title), GP.default.createElement(V, null, A.message), A.instructions.length > 0 && GP.default.createElement(I, {
        flexDirection: "column",
        marginLeft: 2,
        marginTop: 1
    }, A.instructions.map(RaY)))
}
// @from(Ln 399815, Col 0)
function RaY(A, q) {
    return GP.default.createElement(V, {
        key: q,
        dimColor: !0
    }, "• ", A)
}
// @from(Ln 399821, Col 4)
GP
// @from(Ln 399822, Col 4)
Hqq = v(() => {
    i1();
    m1();
    K7();
    b7();
    GP = o(X1(), 1)
})
// @from(Ln 399830, Col 0)
function Oqq(A) {
    let q = e(4),
        {
            isFocused: K,
            isSelected: Y,
            children: z
        } = A,
        w;
    if (q[0] !== z || q[1] !== K || q[2] !== Y) w = $qq.default.createElement(uD1, {
        isFocused: K,
        isSelected: Y
    }, z), q[0] = z, q[1] = K, q[2] = Y, q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 399845, Col 4)
$qq
// @from(Ln 399846, Col 4)
_qq = v(() => {
    i1();
    a26();
    $qq = o(X1(), 1)
})
// @from(Ln 399851, Col 4)
EV6
// @from(Ln 399852, Col 4)
Jqq = v(() => {
    EV6 = class EV6 extends Map {
        first;
        last;
        constructor(A) {
            let q = [],
                K, Y, z, w = 0;
            for (let H of A) {
                let $ = {
                    ...H,
                    previous: z,
                    next: void 0,
                    index: w
                };
                if (z) z.next = $;
                K ||= $, Y = $, q.push([H.value, $]), w++, z = $
            }
            super(q);
            this.first = K, this.last = Y
        }
    }
})
// @from(Ln 399877, Col 4)
WE
// @from(Ln 399877, Col 8)
yaY = (A, q) => {
        switch (q.type) {
            case "focus-next-option": {
                if (!A.focusedValue) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.next || A.optionMap.first;
                if (!Y) return A;
                if (!K.next && Y === A.optionMap.first) return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: 0,
                    visibleToIndex: A.visibleOptionCount
                };
                if (!(Y.index >= A.visibleToIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let w = Math.min(A.optionMap.size, A.visibleToIndex + 1),
                    H = w - A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: H,
                    visibleToIndex: w
                }
            }
            case "focus-previous-option": {
                if (!A.focusedValue) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.previous || A.optionMap.last;
                if (!Y) return A;
                if (!K.previous && Y === A.optionMap.last) {
                    let $ = A.optionMap.size,
                        O = Math.max(0, $ - A.visibleOptionCount);
                    return {
                        ...A,
                        focusedValue: Y.value,
                        visibleFromIndex: O,
                        visibleToIndex: $
                    }
                }
                if (!(Y.index <= A.visibleFromIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let w = Math.max(0, A.visibleFromIndex - 1),
                    H = w + A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: w,
                    visibleToIndex: H
                }
            }
            case "toggle-focused-option": {
                if (!A.focusedValue) return A;
                if (A.value.includes(A.focusedValue)) {
                    let K = new Set(A.value);
                    return K.delete(A.focusedValue), {
                        ...A,
                        previousValue: A.value,
                        value: [...K]
                    }
                }
                return {
                    ...A,
                    previousValue: A.value,
                    value: [...A.value, A.focusedValue]
                }
            }
            case "reset":
                return q.state
        }
    }
// @from(Ln 399953, Col 4)
Dqq = ({
        visibleOptionCount: A,
        defaultValue: q,
        options: K
    }) => {
        let Y = typeof A === "number" ? Math.min(A, K.length) : K.length,
            z = new EV6(K),
            w = q ?? [];
        return {
            optionMap: z,
            visibleOptionCount: Y,
            focusedValue: z.first?.value,
            visibleFromIndex: 0,
            visibleToIndex: Y,
            previousValue: w,
            value: w
        }
    }
// @from(Ln 399971, Col 4)
jqq = ({
        visibleOptionCount: A = 5,
        options: q,
        defaultValue: K,
        onChange: Y,
        onSubmit: z
    }) => {
        let [w, H] = WE.useReducer(yaY, {
            visibleOptionCount: A,
            defaultValue: K,
            options: q
        }, Dqq), [$, O] = WE.useState(q);
        if (q !== $ && !Xqq(q, $)) H({
            type: "reset",
            state: Dqq({
                visibleOptionCount: A,
                defaultValue: K,
                options: q
            })
        }), O(q);
        let _ = WE.useCallback(() => {
                H({
                    type: "focus-next-option"
                })
            }, []),
            J = WE.useCallback(() => {
                H({
                    type: "focus-previous-option"
                })
            }, []),
            X = WE.useCallback(() => {
                H({
                    type: "toggle-focused-option"
                })
            }, []),
            D = WE.useCallback(() => {
                z?.(w.value)
            }, [w.value, z]),
            j = WE.useMemo(() => {
                return q.map((M, P) => ({
                    ...M,
                    index: P
                })).slice(w.visibleFromIndex, w.visibleToIndex)
            }, [q, w.visibleFromIndex, w.visibleToIndex]);
        return WE.useEffect(() => {
            if (!Xqq(w.previousValue, w.value)) Y?.(w.value)
        }, [w.previousValue, w.value, q, Y]), {
            focusedValue: w.focusedValue,
            visibleFromIndex: w.visibleFromIndex,
            visibleToIndex: w.visibleToIndex,
            value: w.value,
            visibleOptions: j,
            focusNextOption: _,
            focusPreviousOption: J,
            toggleFocusedOption: X,
            submit: D
        }
    }
// @from(Ln 400029, Col 4)
Mqq = v(() => {
    Jqq();
    WE = o(X1(), 1)
})