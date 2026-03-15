
// @from(Ln 390539, Col 0)
function GU8(A) {
    let q = A6(84),
        {
            onDone: K
        } = A,
        Y = M1(dUY),
        z = M1(UUY),
        _ = M1(QUY),
        w = M1(pUY);
    IK();
    let O;
    if (q[0] !== z) O = z || [], q[0] = z, q[1] = O;
    else O = q[1];
    let $ = O,
        [H, j] = ez6.useState(null),
        [J, M] = ez6.useState(null),
        [D, X] = ez6.useState(null),
        [P, W] = ez6.useState(null),
        Z = ly1(),
        G;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) G = SY6().then(gUY), q[2] = G;
    else G = q[2];
    let f = G,
        v = mA()?.autoUpdatesChannel ?? "latest",
        N;
    if (q[3] !== Z) N = Z.filter(BUY), q[3] = Z, q[4] = N;
    else N = q[4];
    let V = N,
        L;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) L = [{
        name: "BASH_MAX_OUTPUT_LENGTH",
        default: $38,
        upperLimit: O38
    }, {
        name: "TASK_MAX_OUTPUT_LENGTH",
        default: lg8,
        upperLimit: cg8
    }, {
        name: "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
        ...oa("claude-opus-4-6")
    }].map(mUY).filter(uUY), q[5] = L;
    else L = q[5];
    let h = L,
        R, u;
    if (q[6] !== Y || q[7] !== _ || q[8] !== $) R = () => {
        SY6().then(j), (async () => {
            let C6 = ZU8(c8(), "agents"),
                o6 = ZU8(AA(), ".claude", "agents"),
                {
                    activeAgents: V6,
                    allAgents: b6,
                    failedFiles: E6
                } = Y,
                [U6, c6] = await Promise.all([uK(C6), uK(o6)]),
                K1 = {
                    activeAgents: V6.map(xUY),
                    userAgentsDir: C6,
                    projectAgentsDir: o6,
                    userDirExists: U6,
                    projectDirExists: c6,
                    failedFiles: E6
                };
            M(K1);
            let j6 = await rYq($, {
                activeAgents: V6,
                allAgents: b6,
                failedFiles: E6
            }, async () => _);
            if (X(j6), $66()) {
                let W6 = ZU8(jv1(), "claude", "locks"),
                    n6 = Vv1(W6),
                    d6 = DU4(W6);
                W({
                    enabled: !0,
                    locks: d6,
                    locksDir: W6,
                    staleLocksCleaned: n6
                })
            } else W({
                enabled: !1,
                locks: [],
                locksDir: "",
                staleLocksCleaned: 0
            })
        })()
    }, u = [_, $, Y], q[6] = Y, q[7] = _, q[8] = $, q[9] = R, q[10] = u;
    else R = q[9], u = q[10];
    ez6.useEffect(R, u);
    let I;
    if (q[11] !== K) I = () => {
        K("Claude Code diagnostics dismissed", {
            display: "system"
        })
    }, q[11] = K, q[12] = I;
    else I = q[12];
    let g = I,
        B;
    if (q[13] !== g) B = {
        "confirm:yes": g,
        "confirm:no": g
    }, q[13] = g, q[14] = B;
    else B = q[14];
    let b;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) b = {
        context: "Confirmation"
    }, q[15] = b;
    else b = q[15];
    if (tA(B, b), !H) {
        let C6;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) C6 = UA.default.createElement(S3, null, UA.default.createElement(T, {
            dimColor: !0
        }, "Checking installation status…")), q[16] = C6;
        else C6 = q[16];
        return C6
    }
    let p;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) p = UA.default.createElement(T, {
        bold: !0
    }, "Diagnostics"), q[17] = p;
    else p = q[17];
    let Q;
    if (q[18] !== H.installationType || q[19] !== H.version) Q = UA.default.createElement(T, null, "└ Currently running: ", H.installationType, " (", H.version, ")"), q[18] = H.installationType, q[19] = H.version, q[20] = Q;
    else Q = q[20];
    let U;
    if (q[21] !== H.packageManager) U = H.packageManager && UA.default.createElement(T, null, "└ Package manager: ", H.packageManager), q[21] = H.packageManager, q[22] = U;
    else U = q[22];
    let r;
    if (q[23] !== H.installationPath) r = UA.default.createElement(T, null, "└ Path: ", H.installationPath), q[23] = H.installationPath, q[24] = r;
    else r = q[24];
    let e;
    if (q[25] !== H.invokedBinary) e = UA.default.createElement(T, null, "└ Invoked: ", H.invokedBinary), q[25] = H.invokedBinary, q[26] = e;
    else e = q[26];
    let Y6;
    if (q[27] !== H.configInstallMethod) Y6 = UA.default.createElement(T, null, "└ Config install method: ", H.configInstallMethod), q[27] = H.configInstallMethod, q[28] = Y6;
    else Y6 = q[28];
    let H6 = H.ripgrepStatus.working ? "OK" : "Not working",
        J6 = H.ripgrepStatus.mode === "embedded" ? "bundled" : H.ripgrepStatus.mode === "builtin" ? "vendor" : H.ripgrepStatus.systemPath || "system",
        K6;
    if (q[29] !== H6 || q[30] !== J6) K6 = UA.default.createElement(T, null, "└ Search: ", H6, " (", J6, ")"), q[29] = H6, q[30] = J6, q[31] = K6;
    else K6 = q[31];
    let s;
    if (q[32] !== H.recommendation) s = H.recommendation && UA.default.createElement(UA.default.Fragment, null, UA.default.createElement(T, null), UA.default.createElement(T, {
        color: "warning"
    }, "Recommendation: ", H.recommendation.split(`
`)[0]), UA.default.createElement(T, {
        dimColor: !0
    }, H.recommendation.split(`
`)[1])), q[32] = H.recommendation, q[33] = s;
    else s = q[33];
    let X6;
    if (q[34] !== H.multipleInstallations) X6 = H.multipleInstallations.length > 1 && UA.default.createElement(UA.default.Fragment, null, UA.default.createElement(T, null), UA.default.createElement(T, {
        color: "warning"
    }, "Warning: Multiple installations found"), H.multipleInstallations.map(bUY)), q[34] = H.multipleInstallations, q[35] = X6;
    else X6 = q[35];
    let z6;
    if (q[36] !== H.warnings) z6 = H.warnings.length > 0 && UA.default.createElement(UA.default.Fragment, null, UA.default.createElement(T, null), H.warnings.map(IUY)), q[36] = H.warnings, q[37] = z6;
    else z6 = q[37];
    let N6;
    if (q[38] !== V) N6 = V.length > 0 && UA.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        marginBottom: 1
    }, UA.default.createElement(T, {
        bold: !0
    }, "Invalid Settings"), UA.default.createElement(iy1, {
        errors: V
    })), q[38] = V, q[39] = N6;
    else N6 = q[39];
    let $6;
    if (q[40] !== Q || q[41] !== U || q[42] !== r || q[43] !== e || q[44] !== Y6 || q[45] !== K6 || q[46] !== s || q[47] !== X6 || q[48] !== z6 || q[49] !== N6) $6 = UA.default.createElement(m, {
        flexDirection: "column"
    }, p, Q, U, r, e, Y6, K6, s, X6, z6, N6), q[40] = Q, q[41] = U, q[42] = r, q[43] = e, q[44] = Y6, q[45] = K6, q[46] = s, q[47] = X6, q[48] = z6, q[49] = N6, q[50] = $6;
    else $6 = q[50];
    let n;
    if (q[51] === Symbol.for("react.memo_cache_sentinel")) n = UA.default.createElement(T, {
        bold: !0
    }, "Updates"), q[51] = n;
    else n = q[51];
    let o = H.packageManager ? "Managed by package manager" : H.autoUpdates,
        a;
    if (q[52] !== o) a = UA.default.createElement(T, null, "└ Auto-updates:", " ", o), q[52] = o, q[53] = a;
    else a = q[53];
    let i;
    if (q[54] !== H.hasUpdatePermissions) i = H.hasUpdatePermissions !== null && UA.default.createElement(T, null, "└ Update permissions:", " ", H.hasUpdatePermissions ? "Yes" : "No (requires sudo)"), q[54] = H.hasUpdatePermissions, q[55] = i;
    else i = q[55];
    let l;
    if (q[56] === Symbol.for("react.memo_cache_sentinel")) l = UA.default.createElement(T, null, "└ Auto-update channel: ", v), q[56] = l;
    else l = q[56];
    let q6;
    if (q[57] === Symbol.for("react.memo_cache_sentinel")) q6 = UA.default.createElement(UA.Suspense, {
        fallback: null
    }, UA.default.createElement(VUY, {
        promise: f
    })), q[57] = q6;
    else q6 = q[57];
    let w6;
    if (q[58] !== a || q[59] !== i) w6 = UA.default.createElement(m, {
        flexDirection: "column"
    }, n, a, i, l, q6), q[58] = a, q[59] = i, q[60] = w6;
    else w6 = q[60];
    let O6, L6, y6, G6;
    if (q[61] === Symbol.for("react.memo_cache_sentinel")) O6 = UA.default.createElement(aYq, null), L6 = UA.default.createElement(ry1, null), y6 = UA.default.createElement(lYq, null), G6 = h.length > 0 && UA.default.createElement(m, {
        flexDirection: "column"
    }, UA.default.createElement(T, {
        bold: !0
    }, "Environment Variables"), h.map(CUY)), q[61] = O6, q[62] = L6, q[63] = y6, q[64] = G6;
    else O6 = q[61], L6 = q[62], y6 = q[63], G6 = q[64];
    let R6;
    if (q[65] !== P) R6 = P?.enabled && UA.default.createElement(m, {
        flexDirection: "column"
    }, UA.default.createElement(T, {
        bold: !0
    }, "Version Locks"), P.staleLocksCleaned > 0 && UA.default.createElement(T, {
        dimColor: !0
    }, "└ Cleaned ", P.staleLocksCleaned, " stale lock(s)"), P.locks.length === 0 ? UA.default.createElement(T, {
        dimColor: !0
    }, "└ No active version locks") : P.locks.map(SUY)), q[65] = P, q[66] = R6;
    else R6 = q[66];
    let T6;
    if (q[67] !== J) T6 = J?.failedFiles && J.failedFiles.length > 0 && UA.default.createElement(m, {
        flexDirection: "column"
    }, UA.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Agent Parse Errors"), UA.default.createElement(T, {
        color: "error"
    }, "└ Failed to parse ", J.failedFiles.length, " agent file(s):"), J.failedFiles.map(hUY)), q[67] = J, q[68] = T6;
    else T6 = q[68];
    let D6;
    if (q[69] !== w) D6 = w.length > 0 && UA.default.createElement(m, {
        flexDirection: "column"
    }, UA.default.createElement(T, {
        bold: !0,
        color: "error"
    }, "Plugin Errors"), UA.default.createElement(T, {
        color: "error"
    }, "└ ", w.length, " plugin error(s) detected:"), w.map(RUY)), q[69] = w, q[70] = D6;
    else D6 = q[70];
    let Q6;
    if (q[71] !== D) Q6 = D?.unreachableRulesWarning && UA.default.createElement(m, {
        flexDirection: "column"
    }, UA.default.createElement(T, {
        bold: !0,
        color: "warning"
    }, "Unreachable Permission Rules"), UA.default.createElement(T, null, "└", " ", UA.default.createElement(T, {
        color: "warning"
    }, a6.warning, " ", D.unreachableRulesWarning.message)), D.unreachableRulesWarning.details.map(LUY)), q[71] = D, q[72] = Q6;
    else Q6 = q[72];
    let k6;
    if (q[73] !== D) k6 = D && (D.claudeMdWarning || D.agentWarning || D.mcpWarning) && UA.default.createElement(m, {
        flexDirection: "column"
    }, UA.default.createElement(T, {
        bold: !0
    }, "Context Usage Warnings"), D.claudeMdWarning && UA.default.createElement(UA.default.Fragment, null, UA.default.createElement(T, null, "└", " ", UA.default.createElement(T, {
        color: "warning"
    }, a6.warning, " ", D.claudeMdWarning.message)), UA.default.createElement(T, null, "  ", "└ Files:"), D.claudeMdWarning.details.map(yUY)), D.agentWarning && UA.default.createElement(UA.default.Fragment, null, UA.default.createElement(T, null, "└", " ", UA.default.createElement(T, {
        color: "warning"
    }, a6.warning, " ", D.agentWarning.message)), UA.default.createElement(T, null, "  ", "└ Top contributors:"), D.agentWarning.details.map(EUY)), D.mcpWarning && UA.default.createElement(UA.default.Fragment, null, UA.default.createElement(T, null, "└", " ", UA.default.createElement(T, {
        color: "warning"
    }, a6.warning, " ", D.mcpWarning.message)), UA.default.createElement(T, null, "  ", "└ MCP servers:"), D.mcpWarning.details.map(kUY))), q[73] = D, q[74] = k6;
    else k6 = q[74];
    let Z6;
    if (q[75] === Symbol.for("react.memo_cache_sentinel")) Z6 = UA.default.createElement(m, null, UA.default.createElement(dy1, null)), q[75] = Z6;
    else Z6 = q[75];
    let u6;
    if (q[76] !== $6 || q[77] !== w6 || q[78] !== R6 || q[79] !== T6 || q[80] !== D6 || q[81] !== Q6 || q[82] !== k6) u6 = UA.default.createElement(S3, null, $6, w6, O6, L6, y6, G6, R6, T6, D6, Q6, k6, Z6), q[76] = $6, q[77] = w6, q[78] = R6, q[79] = T6, q[80] = D6, q[81] = Q6, q[82] = k6, q[83] = u6;
    else u6 = q[83];
    return u6
}
// @from(Ln 390809, Col 0)
function kUY(A, q) {
    return UA.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "    ", "└ ", A)
}
// @from(Ln 390816, Col 0)
function EUY(A, q) {
    return UA.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "    ", "└ ", A)
}
// @from(Ln 390823, Col 0)
function yUY(A, q) {
    return UA.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "    ", "└ ", A)
}
// @from(Ln 390830, Col 0)
function LUY(A, q) {
    return UA.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "  ", "└ ", A)
}
// @from(Ln 390837, Col 0)
function RUY(A, q) {
    return UA.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "  ", "└ ", A.source || "unknown", "plugin" in A && A.plugin ? ` [${A.plugin}]` : "", ":", " ", sM(A))
}
// @from(Ln 390844, Col 0)
function hUY(A, q) {
    return UA.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "  ", "└ ", A.path, ": ", A.error)
}
// @from(Ln 390851, Col 0)
function SUY(A, q) {
    return UA.default.createElement(T, {
        key: q
    }, "└ ", A.version, ": PID ", A.pid, " ", A.isProcessRunning ? UA.default.createElement(T, null, "(running)") : UA.default.createElement(T, {
        color: "warning"
    }, "(stale)"))
}
// @from(Ln 390859, Col 0)
function CUY(A, q) {
    return UA.default.createElement(T, {
        key: q
    }, "└ ", A.name, ":", " ", UA.default.createElement(T, {
        color: A.status === "capped" ? "warning" : "error"
    }, A.message))
}
// @from(Ln 390867, Col 0)
function IUY(A, q) {
    return UA.default.createElement(m, {
        key: q,
        flexDirection: "column"
    }, UA.default.createElement(T, {
        color: "warning"
    }, "Warning: ", A.issue), UA.default.createElement(T, null, "Fix: ", A.fix))
}
// @from(Ln 390876, Col 0)
function bUY(A, q) {
    return UA.default.createElement(T, {
        key: q
    }, "└ ", A.type, " at ", A.path)
}
// @from(Ln 390882, Col 0)
function xUY(A) {
    return {
        agentType: A.agentType,
        source: A.source
    }
}
// @from(Ln 390889, Col 0)
function uUY(A) {
    return A.status !== "valid"
}
// @from(Ln 390893, Col 0)
function mUY(A) {
    let q = process.env[A.name],
        K = Io(A.name, q, A.default, A.upperLimit);
    return {
        name: A.name,
        ...K
    }
}
// @from(Ln 390902, Col 0)
function BUY(A) {
    return A.mcpErrorMetadata === void 0
}
// @from(Ln 390906, Col 0)
function gUY(A) {
    return (A.installationType === "native" ? YU4 : KU4)().catch(FUY)
}
// @from(Ln 390910, Col 0)
function FUY() {
    return {
        latest: null,
        stable: null
    }
}
// @from(Ln 390917, Col 0)
function pUY(A) {
    return A.plugins.errors
}
// @from(Ln 390921, Col 0)
function QUY(A) {
    return A.toolPermissionContext
}
// @from(Ln 390925, Col 0)
function UUY(A) {
    return A.mcp.tools
}
// @from(Ln 390929, Col 0)
function dUY(A) {
    return A.agentDefinitions
}
// @from(Ln 390932, Col 4)
UA
// @from(Ln 390932, Col 8)
ez6
// @from(Ln 390933, Col 4)
fU8 = E(() => {
    e6();
    i6();
    _7();
    PO();
    b7();
    tc();
    ac();
    i8();
    JU8();
    MU8();
    DU8();
    XU8();
    iYq();
    Z7();
    T1();
    A8();
    rC6();
    $91();
    ig8();
    oYq();
    Fb8();
    kb8();
    NA();
    sYq();
    FJ();
    xJ();
    UA = t(P6(), 1), ez6 = t(P6(), 1)
})
// @from(Ln 390962, Col 4)
Azq = {}
// @from(Ln 390966, Col 4)
eYq
// @from(Ln 390966, Col 9)
cUY = (A, q, K) => {
    return Promise.resolve(eYq.default.createElement(GU8, {
        onDone: A
    }))
}
// @from(Ln 390971, Col 4)
qzq = E(() => {
    fU8();
    eYq = t(P6(), 1)
})
// @from(Ln 390975, Col 4)
lUY
// @from(Ln 390975, Col 9)
Kzq
// @from(Ln 390976, Col 4)
Yzq = E(() => {
    lUY = {
        name: "doctor",
        description: "Diagnose and verify your Claude Code installation and settings",
        isEnabled: () => !process.env.DISABLE_DOCTOR_COMMAND,
        isHidden: !1,
        userFacingName() {
            return "doctor"
        },
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (qzq(), Azq))
    }, Kzq = lUY
})
// @from(Ln 390993, Col 0)
function nUY(A) {
    return !!eO6(A)
}
// @from(Ln 390997, Col 0)
function zzq(A) {
    let q = iUY(A.split(" ")[0] ?? "");
    return rUY.find((K) => q.includes(K))
}
// @from(Ln 391001, Col 4)
rUY
// @from(Ln 391001, Col 9)
vh
// @from(Ln 391002, Col 4)
ll = E(() => {
    U4();
    Oy();
    H1();
    bU();
    rUY = ["code", "cursor", "windsurf", "codium", "subl", "atom", "gedit", "notepad++", "notepad"];
    vh = e1(() => {
        if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
        if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
        if (process.platform === "win32") return "start /wait notepad";
        return ["code", "vi", "nano"].find((q) => nUY(q))
    })
})
// @from(Ln 391026, Col 0)
function sy1(A = "claude-prompt", q = ".md", K) {
    let Y = K?.contentHash ? sUY("sha256").update(K.contentHash).digest("hex").slice(0, 16) : tUY();
    return oUY(aUY(), `${A}-${Y}${q}`)
}
// @from(Ln 391030, Col 4)
TU8 = () => {}
// @from(Ln 391032, Col 0)
function AdY(A) {
    return zzq(A) !== void 0
}
// @from(Ln 391036, Col 0)
function NE(A) {
    let q = $1(),
        K = FP.get(process.stdout);
    if (!K) throw Error("Ink instance not found - cannot pause rendering");
    let Y = vh();
    if (!Y) return {
        content: null
    };
    try {
        q.statSync(A)
    } catch {
        return {
            content: null
        }
    }
    let z = !AdY(Y);
    if (z) K.enterAlternateScreen();
    else K.pause(), K.suspendStdin();
    try {
        let _ = eUY[Y] ?? Y;
        return tn(`${_} "${A}"`, {
            stdio: "inherit"
        }), {
            content: q.readFileSync(A, {
                encoding: "utf-8"
            })
        }
    } catch (_) {
        if (typeof _ === "object" && _ !== null && "status" in _ && typeof _.status === "number") {
            let w = _.status;
            if (w !== 0) return {
                content: null,
                error: `${Y$(Y)} exited with code ${w}`
            }
        }
        return {
            content: null
        }
    } finally {
        if (z) K.exitAlternateScreen();
        else K.resumeStdin(), K.resume()
    }
}
// @from(Ln 391080, Col 0)
function qdY(A, q) {
    let K = x06(A),
        Y = A;
    for (let z = K.length - 1; z >= 0; z--) {
        let _ = K[z],
            w = q[_.id];
        if (w && w.type === "text") {
            let O = Y.lastIndexOf(_.match);
            if (O !== -1) Y = Y.slice(0, O) + w.content + Y.slice(O + _.match.length)
        }
    }
    return Y
}
// @from(Ln 391094, Col 0)
function KdY(A, q, K) {
    let Y = A;
    for (let [z, _] of Object.entries(K))
        if (_.type === "text") {
            let w = parseInt(z),
                O = _.content,
                $ = Y.indexOf(O);
            if ($ !== -1) {
                let H = b06(O),
                    j = JX1(w, H);
                Y = Y.slice(0, $) + j + Y.slice($ + O.length)
            }
        } return Y
}
// @from(Ln 391109, Col 0)
function NN(A, q) {
    let K = $1(),
        Y = sy1();
    try {
        let z = q ? qdY(A, q) : A;
        fz(Y, z, {
            encoding: "utf-8",
            flush: !0
        });
        let _ = NE(Y);
        if (_.content === null) return _;
        let w = _.content;
        if (w.endsWith(`
`) && !w.endsWith(`

`)) w = w.slice(0, -1);
        if (q) w = KdY(w, A, q);
        return {
            content: w
        }
    } finally {
        try {
            K.unlinkSync(Y)
        } catch {}
    }
}
// @from(Ln 391135, Col 4)
eUY
// @from(Ln 391136, Col 4)
VE = E(() => {
    p11();
    ll();
    g1();
    SA();
    TU8();
    bU();
    Sw();
    ZI();
    eUY = {
        code: "code -w",
        subl: "subl --wait"
    }
})
// @from(Ln 391151, Col 0)
function _zq(A) {
    return H_(A) !== null
}
// @from(Ln 391154, Col 4)
wzq = E(() => {
    $5()
})
// @from(Ln 391164, Col 0)
function Hzq(A) {
    let q = A6(32),
        {
            onSelect: K,
            onCancel: Y
        } = A,
        z = vO(),
        _ = Ozq(c8(), "CLAUDE.md"),
        w = Ozq(AA(), "CLAUDE.md"),
        O = z.some((Y6) => Y6.path === _),
        $ = z.some((Y6) => Y6.path === w),
        H = [...z.filter(HdY).map($dY), ...O ? [] : [{
            path: _,
            type: "User",
            content: "",
            exists: !1
        }], ...$ ? [] : [{
            path: w,
            type: "Project",
            content: "",
            exists: !1
        }]],
        j = new Map,
        J = H.map((Y6) => {
            let H6 = $K(Y6.path),
                J6 = Y6.exists ? "" : " (new)",
                K6 = Y6.parent ? (j.get(Y6.parent) ?? 0) + 1 : 0;
            j.set(Y6.path, K6);
            let s = K6 > 0 ? "  ".repeat(K6 - 1) : "",
                X6;
            if (Y6.type === "User" && !Y6.isNested && Y6.path === _) X6 = "User memory";
            else if (Y6.type === "Project" && !Y6.isNested && Y6.path === w) X6 = "Project memory";
            else if (K6 > 0) X6 = `${s}L ${H6}${J6}`;
            else X6 = `${H6}`;
            let z6, N6 = _zq(AA());
            if (Y6.type === "User" && !Y6.isNested) z6 = "Saved in ~/.claude/CLAUDE.md";
            else if (Y6.type === "Project" && !Y6.isNested && Y6.path === w) z6 = `${N6?"Checked in at":"Saved in"} ./CLAUDE.md`;
            else if (Y6.type, Y6.parent) z6 = "@-imported";
            else if (Y6.isNested) z6 = "dynamically loaded";
            else z6 = "";
            return {
                label: X6,
                value: Y6.path,
                description: z6
            }
        }),
        M = [],
        D = M1(OdY);
    if (Z3()) {
        let Y6;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y6 = {
            label: "Open auto-memory folder",
            value: `${Gn6}${uH()}`,
            description: ""
        }, q[0] = Y6;
        else Y6 = q[0];
        if (M.push(Y6), $zq.isTeamMemoryEnabled()) {
            let H6;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) H6 = {
                label: "Open team memory folder",
                value: `${Gn6}${$zq.getTeamMemPath()}`,
                description: ""
            }, q[1] = H6;
            else H6 = q[1];
            M.push(H6)
        }
        for (let H6 of D.activeAgents)
            if (H6.memory) {
                let J6 = GW6(H6.agentType, H6.memory);
                M.push({
                    label: `Open ${O1.bold(H6.agentType)} agent memory`,
                    value: `${Gn6}${J6}`,
                    description: `${H6.memory} scope`
                })
            }
    }
    J.push(...M);
    let X;
    if (q[2] !== J) X = ty1 && J.some(wdY) ? ty1 : J[0]?.value || "", q[2] = J, q[3] = X;
    else X = q[3];
    let P = X,
        [W, Z] = vU8.useState(Z3),
        [G, f] = vU8.useState(null),
        v = G !== null,
        N;
    if (q[4] !== W) N = function() {
        let H6 = !W;
        TA("userSettings", {
            autoMemoryEnabled: H6
        }), Z(H6), d("tengu_auto_memory_toggled", {
            enabled: H6
        })
    }, q[4] = W, q[5] = N;
    else N = q[5];
    let V = N;
    IK();
    let L;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) L = {
        context: "Confirmation"
    }, q[6] = L;
    else L = q[6];
    D8("confirm:no", Y, L);
    let h;
    if (q[7] !== G || q[8] !== V) h = () => {
        if (G === 0) V()
    }, q[7] = G, q[8] = V, q[9] = h;
    else h = q[9];
    let R;
    if (q[10] !== v) R = {
        context: "Confirmation",
        isActive: v
    }, q[10] = v, q[11] = R;
    else R = q[11];
    D8("confirm:yes", h, R);
    let u;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) u = () => {
        f(null)
    }, q[12] = u;
    else u = q[12];
    let I;
    if (q[13] !== v) I = {
        context: "Select",
        isActive: v
    }, q[13] = v, q[14] = I;
    else I = q[14];
    D8("select:next", u, I);
    let g = G === 0,
        B = W ? "on" : "off",
        b;
    if (q[15] !== B) b = Qb.createElement(T, null, "Auto-memory: ", B), q[15] = B, q[16] = b;
    else b = q[16];
    let p;
    if (q[17] !== b || q[18] !== g) p = Qb.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, Qb.createElement(QR, {
        isFocused: g
    }, b)), q[17] = b, q[18] = g, q[19] = p;
    else p = q[19];
    let Q;
    if (q[20] !== K) Q = (Y6) => {
        if (Y6.startsWith(Gn6)) {
            let H6 = Y6.slice(Gn6.length);
            zdY(H6, {
                recursive: !0
            }).catch(_dY).then(() => VW4(H6));
            return
        }
        ty1 = Y6, K(Y6)
    }, q[20] = K, q[21] = Q;
    else Q = q[21];
    let U;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) U = () => f(0), q[22] = U;
    else U = q[22];
    let r;
    if (q[23] !== P || q[24] !== J || q[25] !== Y || q[26] !== Q || q[27] !== v) r = Qb.createElement(T8, {
        defaultFocusValue: P,
        options: J,
        isDisabled: v,
        onChange: Q,
        onCancel: Y,
        onUpFromFirstItem: U
    }), q[23] = P, q[24] = J, q[25] = Y, q[26] = Q, q[27] = v, q[28] = r;
    else r = q[28];
    let e;
    if (q[29] !== p || q[30] !== r) e = Qb.createElement(m, {
        flexDirection: "column",
        width: "100%"
    }, p, r), q[29] = p, q[30] = r, q[31] = e;
    else e = q[31];
    return e
}
// @from(Ln 391337, Col 0)
function _dY() {}
// @from(Ln 391339, Col 0)
function wdY(A) {
    return A.value === ty1
}
// @from(Ln 391343, Col 0)
function OdY(A) {
    return A.agentDefinitions
}
// @from(Ln 391347, Col 0)
function $dY(A) {
    return {
        ...A,
        exists: !0
    }
}
// @from(Ln 391354, Col 0)
function HdY(A) {
    return A.type !== "AutoMem" && A.type !== "TeamMem"
}
// @from(Ln 391357, Col 4)
Qb
// @from(Ln 391357, Col 8)
vU8
// @from(Ln 391357, Col 13)
$zq
// @from(Ln 391357, Col 18)
ty1
// @from(Ln 391357, Col 23)
Gn6 = "__open_folder__"
// @from(Ln 391358, Col 4)
jzq = E(() => {
    e6();
    i6();
    o9();
    PO();
    _7();
    lM();
    mH();
    kX();
    yI();
    NA();
    Z7();
    wzq();
    T1();
    A8();
    U96();
    i8();
    V1();
    aK();
    Qb = t(P6(), 1), vU8 = t(P6(), 1), $zq = (Rk(), k4(Ld))
})
// @from(Ln 391386, Col 0)
function Jzq(A) {
    let q = jdY(),
        K = G1(),
        Y = A.startsWith(q) ? "~" + A.slice(q.length) : null,
        z = A.startsWith(K) ? "./" + JdY(K, A) : null;
    if (Y && z) return Y.length <= z.length ? Y : z;
    return Y || z || A
}
// @from(Ln 391394, Col 4)
MdY
// @from(Ln 391395, Col 4)
Mzq = E(() => {
    e6();
    i6();
    lA();
    MdY = t(P6(), 1)
})
// @from(Ln 391401, Col 4)
Dzq = {}
// @from(Ln 391410, Col 0)
function PdY({
    onDone: A
}) {
    d0.useState(() => {
        vO.cache.clear?.()
    });
    let q = async (Y) => {
        try {
            if (Y.includes(c8())) await DdY(c8(), {
                recursive: !0
            });
            try {
                await XdY(Y, "", {
                    encoding: "utf8",
                    flag: "wx"
                })
            } catch ($) {
                if ($.code !== "EEXIST") throw $
            }
            await NE(Y);
            let z = "default",
                _ = "";
            if (process.env.VISUAL) z = "$VISUAL", _ = process.env.VISUAL;
            else if (process.env.EDITOR) z = "$EDITOR", _ = process.env.EDITOR;
            let w = z !== "default" ? `Using ${z}="${_}".` : "",
                O = w ? `> ${w} To change editor, set $EDITOR or $VISUAL environment variable.` : "> To use a different editor, set the $EDITOR or $VISUAL environment variable.";
            A(`Opened memory file at ${Jzq(Y)}

${O}`, {
                display: "system"
            })
        } catch (z) {
            _6(z), A(`Error opening memory file: ${z}`)
        }
    }, K = () => {
        A("Cancelled memory editing", {
            display: "system"
        })
    };
    return d0.createElement(m8, {
        title: "Memory",
        onCancel: K,
        color: "remember"
    }, d0.createElement(m, {
        flexDirection: "column"
    }, d0.createElement(Hzq, {
        onSelect: q,
        onCancel: K
    }), d0.createElement(m, {
        marginTop: 1
    }, d0.createElement(T, {
        dimColor: !0
    }, "Learn more: ", d0.createElement(y7, {
        url: "https://code.claude.com/docs/en/memory"
    })))))
}
// @from(Ln 391466, Col 4)
d0
// @from(Ln 391466, Col 8)
WdY = async (A) => {
    return d0.createElement(PdY, {
        onDone: A
    })
}
// @from(Ln 391471, Col 4)
Xzq = E(() => {
    A8();
    k1();
    VE();
    jzq();
    Mzq();
    i6();
    i6();
    lM();
    wq();
    d0 = t(P6(), 1)
})
// @from(Ln 391483, Col 4)
ZdY
// @from(Ln 391483, Col 9)
Pzq
// @from(Ln 391484, Col 4)
Wzq = E(() => {
    ZdY = {
        type: "local-jsx",
        name: "memory",
        description: "Edit Claude memory files",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Xzq(), Dzq)),
        userFacingName() {
            return this.name
        }
    }, Pzq = ZdY
})
// @from(Ln 391497, Col 4)
GdY
// @from(Ln 391497, Col 9)
fdY
// @from(Ln 391497, Col 14)
A_6
// @from(Ln 391498, Col 4)
ey1 = E(() => {
    d3();
    GdY = {
        ghostty: "Ghostty",
        kitty: "Kitty",
        "iTerm.app": "iTerm2",
        WezTerm: "WezTerm"
    }, fdY = {
        type: "local-jsx",
        name: "terminal-setup",
        userFacingName() {
            return "terminal-setup"
        },
        description: Q8.terminal === "Apple_Terminal" ? "Enable Option+Enter key binding for newlines and visual bell" : "Install Shift+Enter key binding for newlines",
        isEnabled: () => !0,
        isHidden: Q8.terminal !== null && Q8.terminal in GdY,
        load: () => Promise.resolve().then(() => (J36(), L84))
    }, A_6 = fdY
})
// @from(Ln 391518, Col 0)
function X16() {
    return X1().editorMode === "vim"
}
// @from(Ln 391522, Col 0)
function Zzq() {
    if (Q8.terminal === "Apple_Terminal" && process.platform === "darwin") return "shift + ⏎ for newline";
    if (A_6.isEnabled() && VT8()) return "shift + ⏎ for newline";
    return kT8() ? "\\⏎ for newline" : "backslash (\\) + return (⏎) for newline"
}
// @from(Ln 391527, Col 4)
hv6 = E(() => {
    ey1();
    J36();
    k8();
    d3()
})
// @from(Ln 391534, Col 0)
function XF(A) {
    return A.replace(/\+/g, " + ")
}
// @from(Ln 391538, Col 0)
function AL1(A) {
    let q = A6(98),
        {
            dimColor: K,
            fixedWidth: Y,
            gap: z,
            paddingX: _
        } = A,
        w = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        O;
    if (q[0] !== w) O = XF(w), q[0] = w, q[1] = O;
    else O = q[1];
    let $ = O,
        H = Rq("app:toggleTodos", "Global", "ctrl+t"),
        j;
    if (q[2] !== H) j = XF(H), q[2] = H, q[3] = j;
    else j = q[3];
    let J = j,
        M = Rq("chat:undo", "Chat", "ctrl+_"),
        D;
    if (q[4] !== M) D = XF(M), q[4] = M, q[5] = D;
    else D = q[5];
    let X = D,
        P = Rq("chat:stash", "Chat", "ctrl+s"),
        W;
    if (q[6] !== P) W = XF(P), q[6] = P, q[7] = W;
    else W = q[7];
    let Z = W,
        G = Rq("chat:cycleMode", "Chat", "shift+tab"),
        f;
    if (q[8] !== G) f = XF(G), q[8] = G, q[9] = f;
    else f = q[9];
    let v = f,
        N = Rq("chat:modelPicker", "Chat", "alt+p"),
        V;
    if (q[10] !== N) V = XF(N), q[10] = N, q[11] = V;
    else V = q[11];
    let L = V,
        h = Rq("chat:fastMode", "Chat", "alt+o"),
        R;
    if (q[12] !== h) R = XF(h), q[12] = h, q[13] = R;
    else R = q[13];
    let u = R,
        I = Rq("chat:externalEditor", "Chat", "ctrl+g"),
        g;
    if (q[14] !== I) g = XF(I), q[14] = I, q[15] = g;
    else g = q[15];
    let B = g,
        b = Rq("app:toggleTerminal", "Global", "meta+j"),
        p;
    if (q[16] !== b) p = XF(b), q[16] = b, q[17] = p;
    else p = q[17];
    let Q = p,
        U = Rq("chat:imagePaste", "Chat", "ctrl+v"),
        r;
    if (q[18] !== U) r = XF(U), q[18] = U, q[19] = r;
    else r = q[19];
    let e = r,
        Y6;
    if (q[20] !== K || q[21] !== Q) Y6 = null, q[20] = K, q[21] = Q, q[22] = Y6;
    else Y6 = q[22];
    let H6 = Y6,
        J6 = Y ? 24 : void 0,
        K6;
    if (q[23] !== K) K6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "! for bash mode")), q[23] = K, q[24] = K6;
    else K6 = q[24];
    let s;
    if (q[25] !== K) s = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "/ for commands")), q[25] = K, q[26] = s;
    else s = q[26];
    let X6;
    if (q[27] !== K) X6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "@ for file paths")), q[27] = K, q[28] = X6;
    else X6 = q[28];
    let z6, N6;
    if (q[29] !== K) z6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "& for background")), N6 = F96() && S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "/btw for side question")), q[29] = K, q[30] = z6, q[31] = N6;
    else z6 = q[30], N6 = q[31];
    let $6;
    if (q[32] !== J6 || q[33] !== K6 || q[34] !== s || q[35] !== X6 || q[36] !== z6 || q[37] !== N6) $6 = S7.createElement(m, {
        flexDirection: "column",
        width: J6
    }, K6, s, X6, z6, N6), q[32] = J6, q[33] = K6, q[34] = s, q[35] = X6, q[36] = z6, q[37] = N6, q[38] = $6;
    else $6 = q[38];
    let n = Y ? 35 : void 0,
        o;
    if (q[39] !== K) o = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "double tap esc to clear input")), q[39] = K, q[40] = o;
    else o = q[40];
    let a;
    if (q[41] !== v || q[42] !== K) a = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, v, " to auto-accept edits")), q[41] = v, q[42] = K, q[43] = a;
    else a = q[43];
    let i;
    if (q[44] !== K || q[45] !== $) i = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, $, " for verbose output")), q[44] = K, q[45] = $, q[46] = i;
    else i = q[46];
    let l;
    if (q[47] !== K || q[48] !== J) l = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, J, " to toggle tasks")), q[47] = K, q[48] = J, q[49] = l;
    else l = q[49];
    let q6;
    if (q[50] === Symbol.for("react.memo_cache_sentinel")) q6 = Zzq(), q[50] = q6;
    else q6 = q[50];
    let w6;
    if (q[51] !== K) w6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, q6)), q[51] = K, q[52] = w6;
    else w6 = q[52];
    let O6;
    if (q[53] !== n || q[54] !== o || q[55] !== a || q[56] !== i || q[57] !== l || q[58] !== w6 || q[59] !== H6) O6 = S7.createElement(m, {
        flexDirection: "column",
        width: n
    }, o, a, i, l, H6, w6), q[53] = n, q[54] = o, q[55] = a, q[56] = i, q[57] = l, q[58] = w6, q[59] = H6, q[60] = O6;
    else O6 = q[60];
    let L6;
    if (q[61] !== K || q[62] !== X) L6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, X, " to undo")), q[61] = K, q[62] = X, q[63] = L6;
    else L6 = q[63];
    let y6;
    if (q[64] !== K) y6 = y8() !== "windows" && S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "ctrl + z to suspend")), q[64] = K, q[65] = y6;
    else y6 = q[65];
    let G6;
    if (q[66] !== K || q[67] !== e) G6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, e, " to paste images")), q[66] = K, q[67] = e, q[68] = G6;
    else G6 = q[68];
    let R6;
    if (q[69] !== K || q[70] !== L) R6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, L, " to switch model")), q[69] = K, q[70] = L, q[71] = R6;
    else R6 = q[71];
    let T6;
    if (q[72] !== K || q[73] !== u) T6 = Dq() && yj() && S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, u, " to toggle fast mode")), q[72] = K, q[73] = u, q[74] = T6;
    else T6 = q[74];
    let D6;
    if (q[75] !== K || q[76] !== Z) D6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, Z, " to stash prompt")), q[75] = K, q[76] = Z, q[77] = D6;
    else D6 = q[77];
    let Q6;
    if (q[78] !== K || q[79] !== B) Q6 = S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, B, " to edit in $EDITOR")), q[78] = K, q[79] = B, q[80] = Q6;
    else Q6 = q[80];
    let k6;
    if (q[81] !== K) k6 = pk() && S7.createElement(m, null, S7.createElement(T, {
        dimColor: K
    }, "/keybindings to customize")), q[81] = K, q[82] = k6;
    else k6 = q[82];
    let Z6;
    if (q[83] !== L6 || q[84] !== y6 || q[85] !== G6 || q[86] !== R6 || q[87] !== T6 || q[88] !== D6 || q[89] !== Q6 || q[90] !== k6) Z6 = S7.createElement(m, {
        flexDirection: "column"
    }, L6, y6, G6, R6, T6, D6, Q6, k6), q[83] = L6, q[84] = y6, q[85] = G6, q[86] = R6, q[87] = T6, q[88] = D6, q[89] = Q6, q[90] = k6, q[91] = Z6;
    else Z6 = q[91];
    let u6;
    if (q[92] !== z || q[93] !== _ || q[94] !== $6 || q[95] !== O6 || q[96] !== Z6) u6 = S7.createElement(m, {
        paddingX: _,
        flexDirection: "row",
        gap: z
    }, $6, O6, Z6), q[92] = z, q[93] = _, q[94] = $6, q[95] = O6, q[96] = Z6, q[97] = u6;
    else u6 = q[97];
    return u6
}
// @from(Ln 391718, Col 4)
S7
// @from(Ln 391719, Col 4)
NU8 = E(() => {
    e6();
    i6();
    YK();
    hv6();
    Rj();
    cd();
    HA();
    FW();
    FZ6();
    S7 = t(P6(), 1)
})
// @from(Ln 391732, Col 0)
function Gzq() {
    let A = A6(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Bf.createElement(m, null, Bf.createElement(T, null, "Claude understands your codebase, makes edits with your permission, and executes commands — right from your terminal.")), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = Bf.createElement(m, {
        flexDirection: "column",
        paddingY: 1,
        gap: 1
    }, q, Bf.createElement(m, {
        flexDirection: "column"
    }, Bf.createElement(m, null, Bf.createElement(T, {
        bold: !0
    }, "Shortcuts")), Bf.createElement(AL1, {
        gap: 2,
        fixedWidth: !0
    }))), A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 391753, Col 4)
Bf
// @from(Ln 391754, Col 4)
fzq = E(() => {
    e6();
    i6();
    NU8();
    Bf = t(P6(), 1)
})
// @from(Ln 391761, Col 0)
function VU8(A) {
    let q = A6(12),
        {
            commands: K,
            maxHeight: Y,
            columns: z,
            title: _,
            onCancel: w,
            emptyMessage: O
        } = A,
        $ = Math.max(1, z - 10),
        H = Math.max(1, Math.floor((Y - 10) / 2)),
        j;
    if (q[0] !== K || q[1] !== $) {
        let D = new Set,
            X;
        if (q[3] !== $) X = (P) => ({
            label: `/${P.name}`,
            value: P.name,
            description: R3(Sv6(P), $, !0)
        }), q[3] = $, q[4] = X;
        else X = q[4];
        j = K.filter((P) => {
            if (D.has(P.name)) return !1;
            return D.add(P.name), !0
        }).sort(TdY).map(X), q[0] = K, q[1] = $, q[2] = j
    } else j = q[2];
    let J = j,
        M;
    if (q[5] !== K.length || q[6] !== O || q[7] !== w || q[8] !== J || q[9] !== _ || q[10] !== H) M = FZ.createElement(m, {
        flexDirection: "column",
        paddingY: 1
    }, K.length === 0 && O ? FZ.createElement(T, {
        dimColor: !0
    }, O) : FZ.createElement(FZ.Fragment, null, FZ.createElement(T, null, _), FZ.createElement(m, {
        marginTop: 1
    }, FZ.createElement(T8, {
        options: J,
        visibleOptionCount: H,
        onCancel: w,
        disableSelection: !0,
        hideIndexes: !0,
        layout: "compact-vertical"
    })))), q[5] = K.length, q[6] = O, q[7] = w, q[8] = J, q[9] = _, q[10] = H, q[11] = M;
    else M = q[11];
    return M
}
// @from(Ln 391809, Col 0)
function TdY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 391812, Col 4)
FZ
// @from(Ln 391813, Col 4)
Tzq = E(() => {
    e6();
    i6();
    D$();
    v3();
    M4();
    FZ = t(P6(), 1)
})
// @from(Ln 391822, Col 0)
function vzq(A) {
    let q = A6(44),
        {
            onClose: K,
            commands: Y
        } = A,
        {
            rows: z,
            columns: _
        } = KA(),
        w = Math.floor(z / 2),
        O;
    if (q[0] !== K) O = () => K("Help dialog dismissed", {
        display: "system"
    }), q[0] = K, q[1] = O;
    else O = q[1];
    let $ = O,
        H;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Help"
    }, q[2] = H;
    else H = q[2];
    D8("help:dismiss", $, H);
    let j = IK($),
        J = Rq("help:dismiss", "Help", "esc"),
        M, D, X;
    if (q[3] !== Y) {
        let L = Qg();
        D = Y.filter((R) => L.has(R.name) && !R.isHidden);
        let h;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) h = [], q[7] = h;
        else h = q[7];
        M = h, X = Y.filter((R) => !L.has(R.name) && !R.isHidden), q[3] = Y, q[4] = M, q[5] = D, q[6] = X
    } else M = q[4], D = q[5], X = q[6];
    let P = X,
        W;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) W = a9.createElement(Hw, {
        key: "general",
        title: "general"
    }, a9.createElement(Gzq, null)), q[8] = W;
    else W = q[8];
    let Z;
    if (q[9] !== M || q[10] !== D || q[11] !== $ || q[12] !== _ || q[13] !== P || q[14] !== w) {
        Z = [W];
        let L;
        if (q[16] !== D || q[17] !== $ || q[18] !== _ || q[19] !== w) L = a9.createElement(Hw, {
            key: "commands",
            title: "commands"
        }, a9.createElement(VU8, {
            commands: D,
            maxHeight: w,
            columns: _,
            title: "Browse default commands:",
            onCancel: $
        })), q[16] = D, q[17] = $, q[18] = _, q[19] = w, q[20] = L;
        else L = q[20];
        Z.push(L);
        let h;
        if (q[21] !== $ || q[22] !== _ || q[23] !== P || q[24] !== w) h = a9.createElement(Hw, {
            key: "custom",
            title: "custom-commands"
        }, a9.createElement(VU8, {
            commands: P,
            maxHeight: w,
            columns: _,
            title: "Browse custom commands:",
            emptyMessage: "No custom commands found",
            onCancel: $
        })), q[21] = $, q[22] = _, q[23] = P, q[24] = w, q[25] = h;
        else h = q[25];
        Z.push(h), q[9] = M, q[10] = D, q[11] = $, q[12] = _, q[13] = P, q[14] = w, q[15] = Z
    } else Z = q[15];
    let G;
    if (q[31] !== Z) G = a9.createElement(Gh, {
        title: `Claude Code v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION}`,
        color: "professionalBlue",
        defaultTab: "general"
    }, Z), q[31] = Z, q[32] = G;
    else G = q[32];
    let f;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) f = a9.createElement(m, {
        marginTop: 1
    }, a9.createElement(T, null, "For more help:", " ", a9.createElement(y7, {
        url: "https://code.claude.com/docs/en/overview"
    }))), q[33] = f;
    else f = q[33];
    let v;
    if (q[34] !== J || q[35] !== j.keyName || q[36] !== j.pending) v = a9.createElement(m, {
        marginTop: 1
    }, a9.createElement(T, {
        dimColor: !0
    }, j.pending ? a9.createElement(a9.Fragment, null, "Press ", j.keyName, " again to exit") : a9.createElement(T, {
        italic: !0
    }, J, " to cancel"))), q[34] = J, q[35] = j.keyName, q[36] = j.pending, q[37] = v;
    else v = q[37];
    let N;
    if (q[38] !== G || q[39] !== v) N = a9.createElement(S3, {
        color: "professionalBlue"
    }, G, f, v), q[38] = G, q[39] = v, q[40] = N;
    else N = q[40];
    let V;
    if (q[41] !== w || q[42] !== N) V = a9.createElement(m, {
        flexDirection: "column",
        height: w
    }, N), q[41] = w, q[42] = N, q[43] = V;
    else V = q[43];
    return V
}
// @from(Ln 391930, Col 4)
a9
// @from(Ln 391931, Col 4)
Nzq = E(() => {
    e6();
    i6();
    FJ();
    oz6();
    fzq();
    Tzq();
    D$();
    _q();
    PO();
    _7();
    Rj();
    i6();
    a9 = t(P6(), 1)
})
// @from(Ln 391946, Col 4)
Vzq = {}
// @from(Ln 391950, Col 4)
kU8
// @from(Ln 391950, Col 9)
vdY = async (A, {
    options: {
        commands: q
    }
}) => {
    return kU8.createElement(vzq, {
        commands: q,
        onClose: A
    })
}
// @from(Ln 391960, Col 4)
kzq = E(() => {
    Nzq();
    kU8 = t(P6(), 1)
})
// @from(Ln 391964, Col 4)
NdY
// @from(Ln 391964, Col 9)
EU8
// @from(Ln 391965, Col 4)
Ezq = E(() => {
    NdY = {
        type: "local-jsx",
        name: "help",
        description: "Show help and available commands",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (kzq(), Vzq)),
        userFacingName() {
            return "help"
        }
    }, EU8 = NdY
})
// @from(Ln 391979, Col 0)
function yzq(A) {
    let q = A6(9),
        {
            onComplete: K
        } = A,
        Y;
    if (q[0] !== K) Y = async (j) => {
        let J = j === "yes";
        d1((M) => ({
            ...M,
            autoConnectIde: J,
            hasIdeAutoConnectDialogBeenShown: !0
        })), K()
    }, q[0] = K, q[1] = Y;
    else Y = q[1];
    let z = Y,
        _;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) _ = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], q[2] = _;
    else _ = q[2];
    let w = _,
        O;
    if (q[3] !== z) O = Cv6.default.createElement(T8, {
        options: w,
        onChange: z,
        defaultValue: "yes"
    }), q[3] = z, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = Cv6.default.createElement(T, {
        dimColor: !0
    }, "You can also configure this in /config or with the --ide flag"), q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] !== K || q[7] !== O) H = Cv6.default.createElement(m8, {
        title: "Do you wish to enable auto-connect to IDE?",
        color: "ide",
        onCancel: K
    }, O, $), q[6] = K, q[7] = O, q[8] = H;
    else H = q[8];
    return H
}
// @from(Ln 392027, Col 0)
function Lzq() {
    let A = X1();
    return !FM() && A.autoConnectIde !== !0 && A.hasIdeAutoConnectDialogBeenShown !== !0
}
// @from(Ln 392032, Col 0)
function Rzq(A) {
    let q = A6(10),
        {
            onComplete: K
        } = A,
        Y;
    if (q[0] !== K) Y = (J) => {
        let M = J === "yes";
        if (M) d1(VdY);
        K(M)
    }, q[0] = K, q[1] = Y;
    else Y = q[1];
    let z = Y,
        _;
    if (q[2] !== K) _ = () => {
        K(!1)
    }, q[2] = K, q[3] = _;
    else _ = q[3];
    let w = _,
        O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = [{
        label: "No",
        value: "no"
    }, {
        label: "Yes",
        value: "yes"
    }], q[4] = O;
    else O = q[4];
    let $ = O,
        H;
    if (q[5] !== z) H = Cv6.default.createElement(T8, {
        options: $,
        onChange: z,
        defaultValue: "no"
    }), q[5] = z, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== w || q[8] !== H) j = Cv6.default.createElement(m8, {
        title: "Do you wish to disable auto-connect to IDE?",
        subtitle: "You can also configure this in /config",
        onCancel: w,
        color: "ide"
    }, H), q[7] = w, q[8] = H, q[9] = j;
    else j = q[9];
    return j
}
// @from(Ln 392079, Col 0)
function VdY(A) {
    return {
        ...A,
        autoConnectIde: !1
    }
}
// @from(Ln 392086, Col 0)
function hzq() {
    let A = X1();
    return !FM() && A.autoConnectIde === !0
}
// @from(Ln 392090, Col 4)
Cv6
// @from(Ln 392091, Col 4)
Szq = E(() => {
    e6();
    i6();
    k8();
    o9();
    Sw();
    wq();
    Cv6 = t(P6(), 1)
})
// @from(Ln 392100, Col 4)
Izq = {}
// @from(Ln 392107, Col 0)
function kdY(A) {
    let q = A6(39),
        {
            availableIDEs: K,
            unavailableIDEs: Y,
            selectedIDE: z,
            onClose: _,
            onSelect: w
        } = A,
        O;
    if (q[0] !== z?.port) O = z?.port?.toString() ?? "None", q[0] = z?.port, q[1] = O;
    else O = q[1];
    let [$, H] = gf.useState(O), [j, J] = gf.useState(!1), [M, D] = gf.useState(!1), X;
    if (q[2] !== K || q[3] !== w) X = (I) => {
        if (I !== "None" && Lzq()) J(!0);
        else if (I === "None" && hzq()) D(!0);
        else w(K.find((g) => g.port === parseInt(I)))
    }, q[2] = K, q[3] = w, q[4] = X;
    else X = q[4];
    let P = X,
        W;
    if (q[5] !== K) W = K.reduce(LdY, {}), q[5] = K, q[6] = W;
    else W = q[6];
    let Z = W,
        G;
    if (q[7] !== K || q[8] !== Z) {
        let I;
        if (q[10] !== Z) I = (g) => {
            let b = (Z[g.name] || 0) > 1 && g.workspaceFolders.length > 0;
            return {
                label: g.name,
                value: g.port.toString(),
                description: b ? yU8(g.workspaceFolders) : void 0
            }
        }, q[10] = Z, q[11] = I;
        else I = q[11];
        G = K.map(I).concat([{
            label: "None",
            value: "None",
            description: void 0
        }]), q[7] = K, q[8] = Z, q[9] = G
    } else G = q[9];
    let f = G;
    if (j) {
        let I;
        if (q[12] !== P || q[13] !== $) I = lw.default.createElement(yzq, {
            onComplete: () => P($)
        }), q[12] = P, q[13] = $, q[14] = I;
        else I = q[14];
        return I
    }
    if (M) {
        let I;
        if (q[15] !== w) I = lw.default.createElement(Rzq, {
            onComplete: () => {
                w(void 0)
            }
        }), q[15] = w, q[16] = I;
        else I = q[16];
        return I
    }
    let v;
    if (q[17] !== K.length) v = K.length === 0 && lw.default.createElement(T, {
        dimColor: !0
    }, FX6() ? `No available IDEs detected. Please install the plugin and restart your IDE:
https://docs.claude.com/s/claude-code-jetbrains` : "No available IDEs detected. Make sure your IDE has the Claude Code extension or plugin installed and is running."), q[17] = K.length, q[18] = v;
    else v = q[18];
    let N;
    if (q[19] !== K.length || q[20] !== P || q[21] !== f || q[22] !== $) N = K.length !== 0 && lw.default.createElement(T8, {
        defaultValue: $,
        defaultFocusValue: $,
        options: f,
        onChange: (I) => {
            H(I), P(I)
        }
    }), q[19] = K.length, q[20] = P, q[21] = f, q[22] = $, q[23] = N;
    else N = q[23];
    let V;
    if (q[24] !== K) V = K.length !== 0 && K.some(ydY) && lw.default.createElement(m, {
        marginTop: 1
    }, lw.default.createElement(T, {
        color: "warning"
    }, "Note: Only one Claude Code instance can be connected to VS Code at a time.")), q[24] = K, q[25] = V;
    else V = q[25];
    let L;
    if (q[26] !== K.length) L = K.length !== 0 && !FM() && lw.default.createElement(m, {
        marginTop: 1
    }, lw.default.createElement(T, {
        dimColor: !0
    }, "Tip: You can enable auto-connect to IDE in /config or with the --ide flag")), q[26] = K.length, q[27] = L;
    else L = q[27];
    let h;
    if (q[28] !== Y) h = Y.length > 0 && lw.default.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, lw.default.createElement(T, {
        dimColor: !0
    }, "Found ", Y.length, " other running IDE(s). However, their workspace/project directories do not match the current cwd."), lw.default.createElement(m, {
        marginTop: 1,
        flexDirection: "column"
    }, Y.map(EdY))), q[28] = Y, q[29] = h;
    else h = q[29];
    let R;
    if (q[30] !== v || q[31] !== N || q[32] !== V || q[33] !== L || q[34] !== h) R = lw.default.createElement(m, {
        flexDirection: "column"
    }, v, N, V, L, h), q[30] = v, q[31] = N, q[32] = V, q[33] = L, q[34] = h, q[35] = R;
    else R = q[35];
    let u;
    if (q[36] !== _ || q[37] !== R) u = lw.default.createElement(m8, {
        title: "Select IDE",
        subtitle: "Connect to an IDE for integrated development features.",
        onCancel: _,
        color: "ide"
    }, R), q[36] = _, q[37] = R, q[38] = u;
    else u = q[38];
    return u
}
// @from(Ln 392225, Col 0)
function EdY(A, q) {
    return lw.default.createElement(m, {
        key: q,
        paddingLeft: 3
    }, lw.default.createElement(T, {
        dimColor: !0
    }, "• ", A.name, ": ", yU8(A.workspaceFolders)))
}
// @from(Ln 392234, Col 0)
function ydY(A) {
    return A.name === "VS Code" || A.name === "Visual Studio Code"
}
// @from(Ln 392238, Col 0)
function LdY(A, q) {
    return A[q.name] = (A[q.name] || 0) + 1, A
}
// @from(Ln 392241, Col 0)
async function RdY(A, q) {
    let K = q?.ide;
    if (!K || K.type !== "sse-ide" && K.type !== "ws-ide") return null;
    for (let Y of A)
        if (Y.url === K.url) return Y;
    return null
}
// @from(Ln 392249, Col 0)
function hdY(A) {
    let q = A6(18),
        {
            availableIDEs: K,
            onSelectIDE: Y,
            onDone: z
        } = A,
        _;
    if (q[0] !== K[0]?.port) _ = K[0]?.port?.toString() ?? "", q[0] = K[0]?.port, q[1] = _;
    else _ = q[1];
    let [w, O] = gf.useState(_), $;
    if (q[2] !== K || q[3] !== Y) $ = (Z) => {
        let G = K.find((f) => f.port === parseInt(Z));
        Y(G)
    }, q[2] = K, q[3] = Y, q[4] = $;
    else $ = q[4];
    let H = $,
        j;
    if (q[5] !== K) j = K.map(SdY), q[5] = K, q[6] = j;
    else j = q[6];
    let J = j,
        M;
    if (q[7] !== z) M = function() {
        z("IDE selection cancelled", {
            display: "system"
        })
    }, q[7] = z, q[8] = M;
    else M = q[8];
    let D = M,
        X;
    if (q[9] !== H) X = (Z) => {
        O(Z), H(Z)
    }, q[9] = H, q[10] = X;
    else X = q[10];
    let P;
    if (q[11] !== J || q[12] !== w || q[13] !== X) P = lw.default.createElement(T8, {
        defaultValue: w,
        defaultFocusValue: w,
        options: J,
        onChange: X
    }), q[11] = J, q[12] = w, q[13] = X, q[14] = P;
    else P = q[14];
    let W;
    if (q[15] !== D || q[16] !== P) W = lw.default.createElement(m8, {
        title: "Select an IDE to open the project",
        onCancel: D,
        color: "ide"
    }, P), q[15] = D, q[16] = P, q[17] = W;
    else W = q[17];
    return W
}
// @from(Ln 392301, Col 0)
function SdY(A) {
    return {
        label: A.name,
        value: A.port.toString()
    }
}
// @from(Ln 392308, Col 0)
function CdY(A) {
    let q = A6(15),
        {
            runningIDEs: K,
            onSelectIDE: Y,
            onDone: z
        } = A,
        [_, w] = gf.useState(K[0] ?? ""),
        O;
    if (q[0] !== Y) O = (W) => {
        Y(W)
    }, q[0] = Y, q[1] = O;
    else O = q[1];
    let $ = O,
        H;
    if (q[2] !== K) H = K.map(IdY), q[2] = K, q[3] = H;
    else H = q[3];
    let j = H,
        J;
    if (q[4] !== z) J = function() {
        z("IDE selection cancelled", {
            display: "system"
        })
    }, q[4] = z, q[5] = J;
    else J = q[5];
    let M = J,
        D;
    if (q[6] !== $) D = (W) => {
        w(W), $(W)
    }, q[6] = $, q[7] = D;
    else D = q[7];
    let X;
    if (q[8] !== j || q[9] !== _ || q[10] !== D) X = lw.default.createElement(T8, {
        defaultFocusValue: _,
        options: j,
        onChange: D
    }), q[8] = j, q[9] = _, q[10] = D, q[11] = X;
    else X = q[11];
    let P;
    if (q[12] !== M || q[13] !== X) P = lw.default.createElement(m8, {
        title: "Select IDE to install extension",
        onCancel: M,
        color: "ide"
    }, X), q[12] = M, q[13] = X, q[14] = P;
    else P = q[14];
    return P
}
// @from(Ln 392356, Col 0)
function IdY(A) {
    return {
        label: Y$(A),
        value: A
    }
}
// @from(Ln 392363, Col 0)
function bdY(A) {
    let q = A6(4),
        {
            ide: K,
            onInstall: Y
        } = A,
        z, _;
    if (q[0] !== K || q[1] !== Y) z = () => {
        Y(K)
    }, _ = [K, Y], q[0] = K, q[1] = Y, q[2] = z, q[3] = _;
    else z = q[2], _ = q[3];
    return gf.useEffect(z, _), null
}
// @from(Ln 392376, Col 0)
async function xdY(A, q, K) {
    d("tengu_ext_ide_command", {});
    let {
        options: {
            dynamicMcpConfig: Y
        },
        onChangeDynamicMcpConfig: z
    } = q;
    if (K?.trim() === "open") {
        let H = S0(),
            j = H ? H.worktreePath : G1(),
            M = (await pX6(!0)).filter((D) => D.isValid);
        if (M.length === 0) return A("No IDEs with Claude Code extension detected."), null;
        return lw.default.createElement(hdY, {
            availableIDEs: M,
            onSelectIDE: async (D) => {
                if (!D) {
                    A("No IDE selected.");
                    return
                }
                if (D.name.toLowerCase().includes("vscode") || D.name.toLowerCase().includes("cursor") || D.name.toLowerCase().includes("windsurf")) {
                    let {
                        code: X
                    } = await z8("code", [j]);
                    if (X === 0) A(`Opened ${H?"worktree":"project"} in ${O1.bold(D.name)}`);
                    else A(`Failed to open in ${D.name}. Try opening manually: ${j}`)
                } else if (FX6()) A(`Please open the ${H?"worktree":"project"} manually in ${O1.bold(D.name)}: ${j}`);
                else A(`Please open the ${H?"worktree":"project"} manually in ${O1.bold(D.name)}: ${j}`)
            },
            onDone: () => {
                A("Exited without opening IDE", {
                    display: "system"
                })
            }
        })
    }
    let _ = await pX6(!0);
    if (_.length === 0 && q.onInstallIDEExtension && !FM()) {
        let H = await aj8(),
            j = (J) => {
                if (q.onInstallIDEExtension)
                    if (q.onInstallIDEExtension(J), FC(J)) A(`Installed plugin to ${O1.bold(Y$(J))}
Please ${O1.bold("restart your IDE")} completely for it to take effect`);
                    else A(`Installed extension to ${O1.bold(Y$(J))}`)
            };
        if (H.length > 1) return lw.default.createElement(CdY, {
            runningIDEs: H,
            onSelectIDE: j,
            onDone: () => {
                A("No IDE selected.", {
                    display: "system"
                })
            }
        });
        else if (H.length === 1) return lw.default.createElement(bdY, {
            ide: H[0],
            onInstall: j
        })
    }
    let w = _.filter((H) => H.isValid),
        O = _.filter((H) => !H.isValid),
        $ = await RdY(w, Y);
    return lw.default.createElement(mdY, {
        availableIDEs: w,
        unavailableIDEs: O,
        currentIDE: $,
        dynamicMcpConfig: Y,
        onChangeDynamicMcpConfig: z,
        onDone: A
    })
}
// @from(Ln 392448, Col 0)
function mdY({
    availableIDEs: A,
    unavailableIDEs: q,
    currentIDE: K,
    dynamicMcpConfig: Y,
    onChangeDynamicMcpConfig: z,
    onDone: _
}) {
    let [w, O] = gf.useState(null), $ = M1((M) => M.mcp.clients.find((D) => D.name === "ide")), H = xA(), j = gf.useRef(!0);
    gf.useEffect(() => {
        if (!w) return;
        if (j.current) {
            j.current = !1;
            return
        }
        if (!$ || $.type === "pending") return;
        if ($.type === "connected") _(`Connected to ${w.name}.`);
        else if ($.type === "failed") _(`Failed to connect to ${w.name}.`)
    }, [$, w, _]), gf.useEffect(() => {
        if (!w) return;
        let M = setTimeout(_, udY, `Connection to ${w.name} timed out.`);
        return () => clearTimeout(M)
    }, [w, _]);
    let J = gf.useCallback((M) => {
        if (!z) {
            _("Error connecting to IDE.");
            return
        }
        let D = {
            ...Y || {}
        };
        if (K) delete D.ide;
        if (!M) {
            if ($ && $.type === "connected" && K) $.client.onclose = () => {}, VN("ide", $.config), H((P) => ({
                ...P,
                mcp: {
                    ...P.mcp,
                    clients: P.mcp.clients.filter((W) => W.name !== "ide"),
                    tools: P.mcp.tools.filter((W) => !W.name?.startsWith("mcp__ide__")),
                    commands: P.mcp.commands.filter((W) => !W.name?.startsWith("mcp__ide__"))
                }
            }));
            z(D), _(K ? `Disconnected from ${K.name}.` : "No IDE selected.");
            return
        }
        let X = M.url;
        D.ide = {
            type: X.startsWith("ws:") ? "ws-ide" : "sse-ide",
            url: X,
            ideName: M.name,
            authToken: M.authToken,
            ideRunningInWindows: M.ideRunningInWindows,
            scope: "dynamic"
        }, j.current = !0, O(M), z(D)
    }, [Y, K, $, H, z, _]);
    if (w) return lw.default.createElement(T, {
        dimColor: !0
    }, "Connecting to ", w.name, "…");
    return lw.default.createElement(kdY, {
        availableIDEs: A,
        unavailableIDEs: q,
        selectedIDE: K,
        onClose: () => _("IDE selection cancelled", {
            display: "system"
        }),
        onSelect: J
    })
}
// @from(Ln 392517, Col 0)
function yU8(A, q = 100) {
    if (A.length === 0) return "";
    let K = G1(),
        Y = A.slice(0, 2),
        z = A.length > 2,
        _ = z ? 3 : 0,
        w = (Y.length - 1) * 2,
        O = q - w - _,
        $ = Math.floor(O / Y.length),
        H = K.normalize("NFC"),
        J = Y.map((M) => {
            let D = M.normalize("NFC");
            if (D.startsWith(H + Czq.sep)) M = D.slice(H.length + 1);
            if (M.length <= $) return M;
            return "…" + M.slice(-($ - 1))
        }).join(", ");
    if (z) J += ", …";
    return J
}
// @from(Ln 392536, Col 4)
lw
// @from(Ln 392536, Col 8)
gf
// @from(Ln 392536, Col 12)
udY = 35000
// @from(Ln 392537, Col 4)
bzq = E(() => {
    e6();
    i6();
    o9();
    Szq();
    Sw();
    QP();
    NA();
    V1();
    wq();
    jN();
    lA();
    Eq();
    aK();
    lw = t(P6(), 1), gf = t(P6(), 1)
})
// @from(Ln 392553, Col 4)
BdY
// @from(Ln 392553, Col 9)
xzq
// @from(Ln 392554, Col 4)
uzq = E(() => {
    BdY = {
        type: "local-jsx",
        name: "ide",
        description: "Manage IDE integrations and show status",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[open]",
        load: () => Promise.resolve().then(() => (bzq(), Izq)),
        userFacingName() {
            return "ide"
        }
    }, xzq = BdY
})
// @from(Ln 392568, Col 4)
gdY
// @from(Ln 392568, Col 9)
mzq
// @from(Ln 392569, Col 4)
Bzq = E(() => {
    SF6();
    gdY = {
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
            return h06(), [{
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
    }, mzq = gdY
})
// @from(Ln 392611, Col 4)
FdY
// @from(Ln 392611, Col 9)
gzq
// @from(Ln 392612, Col 4)
Fzq = E(() => {
    FdY = {
        type: "prompt",
        name: "init-verifiers",
        description: "Create verifier skill(s) for automated verification of code changes",
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        progressMessage: "analyzing your project and creating verifier skills",
        userFacingName() {
            return "init-verifiers"
        },
        source: "builtin",
        async getPromptForCommand() {
            return [{
                type: "text",
                text: `Use the TodoWrite tool to track your progress through this multi-step task.

## Goal

Create one or more verifier skills that can be used by the Verify agent to automatically verify code changes in this project or folder. You may create multiple verifiers if the project has different verification needs (e.g., both web UI and API endpoints).

**Do NOT create verifiers for unit tests or typechecking.** Those are already handled by the standard build/test workflow and don't need dedicated verifier skills. Focus on functional verification: web UI (Playwright), CLI (Tmux), and API (HTTP) verifiers.

## Phase 1: Auto-Detection

Analyze the project to detect what's in different subdirectories. The project may contain multiple sub-projects or areas that need different verification approaches (e.g., a web frontend, an API backend, and shared libraries all in one repo).

1. **Scan top-level directories** to identify distinct project areas:
   - Look for separate package.json, Cargo.toml, pyproject.toml, go.mod in subdirectories
   - Identify distinct application types in different folders

2. **For each area, detect:**

   a. **Project type and stack**
      - Primary language(s) and frameworks
      - Package managers (npm, yarn, pnpm, pip, cargo, etc.)

   b. **Application type**
      - Web app (React, Next.js, Vue, etc.) → suggest Playwright-based verifier
      - CLI tool → suggest Tmux-based verifier
      - API service (Express, FastAPI, etc.) → suggest HTTP-based verifier

   c. **Existing verification tools**
      - Test frameworks (Jest, Vitest, pytest, etc.)
      - E2E tools (Playwright, Cypress, etc.)
      - Dev server scripts in package.json

   d. **Dev server configuration**
      - How to start the dev server
      - What URL it runs on
      - What text indicates it's ready

3. **Installed verification packages** (for web apps)
   - Check if Playwright is installed (look in package.json dependencies/devDependencies)
   - Check MCP configuration (.mcp.json) for browser automation tools:
     - Playwright MCP server
     - Chrome DevTools MCP server
     - Claude Chrome Extension MCP (browser-use via Claude's Chrome extension)
   - For Python projects, check for playwright, pytest-playwright

## Phase 2: Verification Tool Setup

Based on what was detected in Phase 1, help the user set up appropriate verification tools.

### For Web Applications

1. **If browser automation tools are already installed/configured**, ask the user which one they want to use:
   - Use AskUserQuestion to present the detected options
   - Example: "I found Playwright and Chrome DevTools MCP configured. Which would you like to use for verification?"

2. **If NO browser automation tools are detected**, ask if they want to install/configure one:
   - Use AskUserQuestion: "No browser automation tools detected. Would you like to set one up for UI verification?"
   - Options to offer:
     - **Playwright** (Recommended) - Full browser automation library, works headless, great for CI
     - **Chrome DevTools MCP** - Uses Chrome DevTools Protocol via MCP
     - **Claude Chrome Extension** - Uses the Claude Chrome extension for browser interaction (requires the extension installed in Chrome)
     - **None** - Skip browser automation (will use basic HTTP checks only)

3. **If user chooses to install Playwright**, run the appropriate command based on package manager:
   - For npm: \`npm install -D @playwright/test && npx playwright install\`
   - For yarn: \`yarn add -D @playwright/test && yarn playwright install\`
   - For pnpm: \`pnpm add -D @playwright/test && pnpm exec playwright install\`
   - For bun: \`bun add -D @playwright/test && bun playwright install\`

4. **If user chooses Chrome DevTools MCP or Claude Chrome Extension**:
   - These require MCP server configuration rather than package installation
   - Ask if they want you to add the MCP server configuration to .mcp.json
   - For Claude Chrome Extension, inform them they need the extension installed from the Chrome Web Store

5. **MCP Server Setup** (if applicable):
   - If user selected an MCP-based option, configure the appropriate entry in .mcp.json
   - Update the verifier skill's allowed-tools to use the appropriate mcp__* tools

### For CLI Tools

1. Check if asciinema is available (run \`which asciinema\`)
2. If not available, inform the user that asciinema can help record verification sessions but is optional
3. Tmux is typically system-installed, just verify it's available

### For API Services

1. Check if HTTP testing tools are available:
   - curl (usually system-installed)
   - httpie (\`http\` command)
2. No installation typically needed

## Phase 3: Interactive Q&A

Based on the areas detected in Phase 1, you may need to create multiple verifiers. For each distinct area, use the AskUserQuestion tool to confirm:

1. **Verifier name** - Based on detection, suggest a name but let user choose:

   If there is only ONE project area, use the simple format:
   - "verifier-playwright" for web UI testing
   - "verifier-cli" for CLI/terminal testing
   - "verifier-api" for HTTP API testing

   If there are MULTIPLE project areas, use the format \`verifier-<project>-<type>\`:
   - "verifier-frontend-playwright" for the frontend web UI
   - "verifier-backend-api" for the backend API
   - "verifier-admin-playwright" for an admin dashboard

   The \`<project>\` portion should be a short identifier for the subdirectory or project area (e.g., the folder name or package name).

   Custom names are allowed but MUST include "verifier" in the name — the Verify agent discovers skills by looking for "verifier" in the folder name.

2. **Project-specific questions** based on type:

   For web apps (playwright):
   - Dev server command (e.g., "npm run dev")
   - Dev server URL (e.g., "http://localhost:3000")
   - Ready signal (text that appears when server is ready)

   For CLI tools:
   - Entry point command (e.g., "node ./cli.js" or "./target/debug/myapp")
   - Whether to record with asciinema

   For APIs:
   - API server command
   - Base URL

3. **Authentication & Login** (for web apps and APIs):

   Use AskUserQuestion to ask: "Does your app require authentication/login to access the pages or endpoints being verified?"
   - **No authentication needed** - App is publicly accessible, no login required
   - **Yes, login required** - App requires authentication before verification can proceed
   - **Some pages require auth** - Mix of public and authenticated routes

   If the user selects login required (or partial), ask follow-up questions:
   - **Login method**: How does a user log in?
     - Form-based login (username/password on a login page)
     - API token/key (passed as header or query param)
     - OAuth/SSO (redirect-based flow)
     - Other (let user describe)
   - **Test credentials**: What credentials should the verifier use?
     - Ask for the login URL (e.g., "/login", "http://localhost:3000/auth")
     - Ask for test username/email and password, or API key
     - Note: Suggest the user use environment variables for secrets (e.g., \`TEST_USER\`, \`TEST_PASSWORD\`) rather than hardcoding
   - **Post-login indicator**: How to confirm login succeeded?
     - URL redirect (e.g., redirects to "/dashboard")
     - Element appears (e.g., "Welcome" text, user avatar)
     - Cookie/token is set

## Phase 4: Generate Verifier Skill

**All verifier skills are created in the project root's \`.claude/skills/\` directory.** This ensures they are automatically loaded when Claude runs in the project.

Write the skill file to \`.claude/skills/<verifier-name>/SKILL.md\`.

### Skill Template Structure

\`\`\`markdown
---
name: <verifier-name>
description: <description based on type>
allowed-tools:
  # Tools appropriate for the verifier type
---

# <Verifier Title>

You are a verification executor. You receive a verification plan and execute it EXACTLY as written.

## Project Context
<Project-specific details from detection>

## Setup Instructions
<How to start any required services>

## Authentication
<If auth is required, include step-by-step login instructions here>
<Include login URL, credential env vars, and post-login verification>
<If no auth needed, omit this section>

## Reporting

Report PASS or FAIL for each step using the format specified in the verification plan.

## Cleanup

After verification:
1. Stop any dev servers started
2. Close any browser sessions
3. Report final summary

## Self-Update

If verification fails because this skill's instructions are outdated (dev server command/port/ready-signal changed, etc.) — not because the feature under test is broken — or if the user corrects you mid-run, use AskUserQuestion to confirm and then Edit this SKILL.md with a minimal targeted fix.
\`\`\`

### Allowed Tools by Type

**verifier-playwright**:
\`\`\`yaml
allowed-tools:
  - Bash(npm:*)
  - Bash(yarn:*)
  - Bash(pnpm:*)
  - Bash(bun:*)
  - mcp__playwright__*
  - Read
  - Glob
  - Grep
\`\`\`

**verifier-cli**:
\`\`\`yaml
allowed-tools:
  - Tmux
  - Bash(asciinema:*)
  - Read
  - Glob
  - Grep
\`\`\`

**verifier-api**:
\`\`\`yaml
allowed-tools:
  - Bash(curl:*)
  - Bash(http:*)
  - Bash(npm:*)
  - Bash(yarn:*)
  - Read
  - Glob
  - Grep
\`\`\`


## Phase 5: Confirm Creation

After writing the skill file(s), inform the user:
1. Where each skill was created (always in \`.claude/skills/\`)
2. How the Verify agent will discover them — the folder name must contain "verifier" (case-insensitive) for automatic discovery
3. That they can edit the skills to customize them
4. That they can run /init-verifiers again to add more verifiers for other areas
5. That the verifier will offer to self-update if it detects its own instructions are outdated (wrong dev server command, changed ready signal, etc.)
`
            }]
        }
    }, gzq = FdY
})
// @from(Ln 392875, Col 0)
function pdY(A) {
    let q = new Set(wp6.map((K) => C36(K.key)));
    return A.map((K) => {
        let Y = {};
        for (let [z, _] of Object.entries(K.bindings))
            if (!q.has(C36(z))) Y[z] = _;
        return {
            context: K.context,
            bindings: Y
        }
    }).filter((K) => Object.keys(K.bindings).length > 0)
}
// @from(Ln 392888, Col 0)
function pzq() {
    let q = {
        $schema: "https://www.schemastore.org/claude-code-keybindings.json",
        $docs: "https://code.claude.com/docs/en/keybindings",
        bindings: pdY(XW6)
    };
    return B6(q, null, 2) + `
`
}
// @from(Ln 392897, Col 4)
Qzq = E(() => {
    fP1();
    TP1();
    g1()
})
// @from(Ln 392902, Col 4)
Uzq = {}
// @from(Ln 392914, Col 0)
async function ldY() {
    if (!pk()) return {
        type: "text",
        value: "Keybinding customization is not enabled. This feature is currently in preview."
    };
    let A = b36(),
        q = !1;
    try {
        await QdY(A), q = !0
    } catch {}
    if (!q) {
        let Y = pzq(),
            z = cdY(A);
        await ddY(z, {
            recursive: !0
        }), await UdY(A, Y, "utf-8")
    }
    let K = await NE(A);
    if (K.error) return {
        type: "text",
        value: `${q?"Opened":"Created"} ${A}. Could not open in editor: ${K.error}`
    };
    return {
        type: "text",
        value: q ? `Opened ${A} in your editor.` : `Created ${A} with template. Opened in your editor.`
    }
}
// @from(Ln 392941, Col 4)
dzq = E(() => {
    cd();
    Qzq();
    VE()
})
// @from(Ln 392946, Col 4)
idY
// @from(Ln 392946, Col 9)
LU8
// @from(Ln 392947, Col 4)
czq = E(() => {
    cd();
    idY = {
        name: "keybindings",
        description: "Open or create your keybindings configuration file",
        isEnabled: () => pk(),
        isHidden: !1,
        supportsNonInteractive: !1,
        type: "local",
        load: () => Promise.resolve().then(() => (dzq(), Uzq)),
        userFacingName: () => "keybindings"
    }, LU8 = idY
})
// @from(Ln 392960, Col 4)
lzq = () => ({
    type: "local-jsx",
    name: "login",
    description: RU8() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGIN_COMMAND,
    isHidden: !1,
    load: () => Promise.resolve().then(() => (xv1(), gU4)),
    userFacingName() {
        return "login"
    }
})
// @from(Ln 392971, Col 4)
izq = E(() => {
    fA()
})
// @from(Ln 392974, Col 4)
nzq
// @from(Ln 392975, Col 4)
rzq = E(() => {
    nzq = {
        type: "local-jsx",
        name: "logout",
        description: "Sign out from your Anthropic account",
        isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Nb8(), cQ4)),
        userFacingName() {
            return "logout"
        }
    }
})
// @from(Ln 392989, Col 0)
function azq() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = ozq.default.createElement(T, null, "Checking GitHub CLI installation…"), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 392996, Col 4)
ozq
// @from(Ln 392997, Col 4)
szq = E(() => {
    e6();
    i6();
    ozq = t(P6(), 1)
})
// @from(Ln 393003, Col 0)
function tzq(A) {
    let q = A6(49),
        {
            currentRepo: K,
            useCurrentRepo: Y,
            repoUrl: z,
            onRepoUrlChange: _,
            onSubmit: w,
            onToggleUseCurrentRepo: O
        } = A,
        [$, H] = MM.useState(0),
        [j, J] = MM.useState(!1),
        D = KA().columns,
        X;
    if (q[0] !== K || q[1] !== w || q[2] !== z || q[3] !== Y) X = () => {
        if (!(Y ? K : z)?.trim()) {
            J(!0);
            return
        }
        w()
    }, q[0] = K, q[1] = w, q[2] = z, q[3] = Y, q[4] = X;
    else X = q[4];
    let P = X,
        W = !Y || !K,
        Z;
    if (q[5] !== O) Z = () => {
        O(!0), J(!1)
    }, q[5] = O, q[6] = Z;
    else Z = q[6];
    let G = Z,
        f;
    if (q[7] !== O) f = () => {
        O(!1), J(!1)
    }, q[7] = O, q[8] = f;
    else f = q[8];
    let v = f,
        N;
    if (q[9] !== v || q[10] !== G || q[11] !== P) N = {
        "confirm:previous": G,
        "confirm:next": v,
        "confirm:yes": P
    }, q[9] = v, q[10] = G, q[11] = P, q[12] = N;
    else N = q[12];
    let V = !W,
        L;
    if (q[13] !== V) L = {
        context: "Confirmation",
        isActive: V
    }, q[13] = V, q[14] = L;
    else L = q[14];
    tA(N, L);
    let h;
    if (q[15] !== v || q[16] !== G) h = {
        "confirm:previous": G,
        "confirm:next": v
    }, q[15] = v, q[16] = G, q[17] = h;
    else h = q[17];
    let R;
    if (q[18] !== W) R = {
        context: "Confirmation",
        isActive: W
    }, q[18] = W, q[19] = R;
    else R = q[19];
    tA(h, R);
    let u;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) u = MM.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, MM.default.createElement(T, {
        bold: !0
    }, "Install GitHub App"), MM.default.createElement(T, {
        dimColor: !0
    }, "Select GitHub repository")), q[20] = u;
    else u = q[20];
    let I;
    if (q[21] !== K || q[22] !== Y) I = K && MM.default.createElement(m, {
        marginBottom: 1
    }, MM.default.createElement(T, {
        bold: Y,
        color: Y ? "permission" : void 0
    }, Y ? "> " : "  ", "Use current repository: ", K)), q[21] = K, q[22] = Y, q[23] = I;
    else I = q[23];
    let g = !Y || !K,
        B = !Y || !K ? "permission" : void 0,
        b = !Y || !K ? "> " : "  ",
        p = K ? "Enter a different repository" : "Enter repository",
        Q;
    if (q[24] !== g || q[25] !== B || q[26] !== b || q[27] !== p) Q = MM.default.createElement(m, {
        marginBottom: 1
    }, MM.default.createElement(T, {
        bold: g,
        color: B
    }, b, p)), q[24] = g, q[25] = B, q[26] = b, q[27] = p, q[28] = Q;
    else Q = q[28];
    let U;
    if (q[29] !== K || q[30] !== $ || q[31] !== P || q[32] !== _ || q[33] !== z || q[34] !== D || q[35] !== Y) U = (!Y || !K) && MM.default.createElement(m, {
        marginLeft: 2,
        marginBottom: 1
    }, MM.default.createElement(J5, {
        value: z,
        onChange: (K6) => {
            _(K6), J(!1)
        },
        onSubmit: P,
        focus: !0,
        placeholder: "Enter a repo as owner/repo or https://github.com/owner/repo…",
        columns: D,
        cursorOffset: $,
        onChangeCursorOffset: H,
        showCursor: !0
    })), q[29] = K, q[30] = $, q[31] = P, q[32] = _, q[33] = z, q[34] = D, q[35] = Y, q[36] = U;
    else U = q[36];
    let r;
    if (q[37] !== I || q[38] !== Q || q[39] !== U) r = MM.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, u, I, Q, U), q[37] = I, q[38] = Q, q[39] = U, q[40] = r;
    else r = q[40];
    let e;
    if (q[41] !== j) e = j && MM.default.createElement(m, {
        marginLeft: 3,
        marginBottom: 1
    }, MM.default.createElement(T, {
        color: "error"
    }, "Please enter a repository name to continue")), q[41] = j, q[42] = e;
    else e = q[42];
    let Y6 = K ? "↑/↓ to select · " : "",
        H6;
    if (q[43] !== Y6) H6 = MM.default.createElement(m, {
        marginLeft: 3
    }, MM.default.createElement(T, {
        dimColor: !0
    }, Y6, "Enter to continue")), q[43] = Y6, q[44] = H6;
    else H6 = q[44];
    let J6;
    if (q[45] !== r || q[46] !== e || q[47] !== H6) J6 = MM.default.createElement(MM.default.Fragment, null, r, e, H6), q[45] = r, q[46] = e, q[47] = H6, q[48] = J6;
    else J6 = q[48];
    return J6
}
// @from(Ln 393143, Col 4)
MM
// @from(Ln 393144, Col 4)
ezq = E(() => {
    e6();
    i6();
    _7();
    AH();
    _q();
    MM = t(P6(), 1)
})
// @from(Ln 393152, Col 4)
A_q = "Add Claude Code GitHub Workflow"
// @from(Ln 393153, Col 4)
PF = "https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md"
// @from(Ln 393154, Col 4)
q_q = `name: Claude Code

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
// @from(Ln 393205, Col 4)
K_q = `## \uD83E\uDD16 Installing Claude Code GitHub App

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
// @from(Ln 393246, Col 4)
Y_q = `name: Claude Code Review

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
// @from(Ln 393292, Col 0)
function z_q(A) {
    let q = A6(12),
        {
            repoUrl: K,
            onSubmit: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, q[0] = z;
    else z = q[0];
    D8("confirm:yes", Y, z);
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = DM.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, DM.default.createElement(T, {
        bold: !0
    }, "Install the Claude GitHub App")), q[1] = _;
    else _ = q[1];
    let w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = DM.default.createElement(m, {
        marginBottom: 1
    }, DM.default.createElement(T, null, "Opening browser to install the Claude GitHub App…")), q[2] = w;
    else w = q[2];
    let O;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) O = DM.default.createElement(m, {
        marginBottom: 1
    }, DM.default.createElement(T, null, "If your browser doesn't open automatically, visit:")), q[3] = O;
    else O = q[3];
    let $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = DM.default.createElement(m, {
        marginBottom: 1
    }, DM.default.createElement(T, {
        underline: !0
    }, "https://github.com/apps/claude")), q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== K) H = DM.default.createElement(m, {
        marginBottom: 1
    }, DM.default.createElement(T, null, "Please install the app for repository: ", DM.default.createElement(T, {
        bold: !0
    }, K))), q[5] = K, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) j = DM.default.createElement(m, {
        marginBottom: 1
    }, DM.default.createElement(T, {
        dimColor: !0
    }, "Important: Make sure to grant access to this specific repository")), q[7] = j;
    else j = q[7];
    let J;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) J = DM.default.createElement(m, null, DM.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Press Enter once you've installed the app", a6.ellipsis)), q[8] = J;
    else J = q[8];
    let M;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) M = DM.default.createElement(m, {
        marginTop: 1
    }, DM.default.createElement(T, {
        dimColor: !0
    }, "Having trouble? See manual setup instructions at:", " ", DM.default.createElement(T, {
        color: "claude"
    }, PF))), q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== H) D = DM.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, _, w, O, $, H, j, J, M), q[10] = H, q[11] = D;
    else D = q[11];
    return D
}
// @from(Ln 393368, Col 4)
DM
// @from(Ln 393369, Col 4)
__q = E(() => {
    e6();
    i6();
    _7();
    b7();
    DM = t(P6(), 1)
})
// @from(Ln 393377, Col 0)
function w_q(A) {
    let q = A6(42),
        {
            useExistingSecret: K,
            secretName: Y,
            onToggleUseExistingSecret: z,
            onSecretNameChange: _,
            onSubmit: w
        } = A,
        [O, $] = G$.useState(0),
        H = KA(),
        [j] = z7(),
        J;
    if (q[0] !== z) J = () => z(!0), q[0] = z, q[1] = J;
    else J = q[1];
    let M = J,
        D;
    if (q[2] !== z) D = () => z(!1), q[2] = z, q[3] = D;
    else D = q[3];
    let X = D,
        P;
    if (q[4] !== X || q[5] !== M || q[6] !== w) P = {
        "confirm:previous": M,
        "confirm:next": X,
        "confirm:yes": w
    }, q[4] = X, q[5] = M, q[6] = w, q[7] = P;
    else P = q[7];
    let W;
    if (q[8] !== K) W = {
        context: "Confirmation",
        isActive: K
    }, q[8] = K, q[9] = W;
    else W = q[9];
    tA(P, W);
    let Z;
    if (q[10] !== X || q[11] !== M) Z = {
        "confirm:previous": M,
        "confirm:next": X
    }, q[10] = X, q[11] = M, q[12] = Z;
    else Z = q[12];
    let G = !K,
        f;
    if (q[13] !== G) f = {
        context: "Confirmation",
        isActive: G
    }, q[13] = G, q[14] = f;
    else f = q[14];
    tA(Z, f);
    let v;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) v = G$.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, G$.default.createElement(T, {
        bold: !0
    }, "Install GitHub App"), G$.default.createElement(T, {
        dimColor: !0
    }, "Setup API key secret")), q[15] = v;
    else v = q[15];
    let N;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) N = G$.default.createElement(m, {
        marginBottom: 1
    }, G$.default.createElement(T, {
        color: "warning"
    }, "ANTHROPIC_API_KEY already exists in repository secrets!")), q[16] = N;
    else N = q[16];
    let V;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) V = G$.default.createElement(m, {
        marginBottom: 1
    }, G$.default.createElement(T, null, "Would you like to:")), q[17] = V;
    else V = q[17];
    let L;
    if (q[18] !== j || q[19] !== K) L = K ? kA("success", j)("> ") : "  ", q[18] = j, q[19] = K, q[20] = L;
    else L = q[20];
    let h;
    if (q[21] !== L) h = G$.default.createElement(m, {
        marginBottom: 1
    }, G$.default.createElement(T, null, L, "Use the existing API key")), q[21] = L, q[22] = h;
    else h = q[22];
    let R;
    if (q[23] !== j || q[24] !== K) R = !K ? kA("success", j)("> ") : "  ", q[23] = j, q[24] = K, q[25] = R;
    else R = q[25];
    let u;
    if (q[26] !== R) u = G$.default.createElement(m, {
        marginBottom: 1
    }, G$.default.createElement(T, null, R, "Create a new secret with a different name")), q[26] = R, q[27] = u;
    else u = q[27];
    let I;
    if (q[28] !== O || q[29] !== _ || q[30] !== w || q[31] !== Y || q[32] !== H || q[33] !== K) I = !K && G$.default.createElement(G$.default.Fragment, null, G$.default.createElement(m, {
        marginBottom: 1
    }, G$.default.createElement(T, null, "Enter new secret name (alphanumeric with underscores):")), G$.default.createElement(J5, {
        value: Y,
        onChange: _,
        onSubmit: w,
        focus: !0,
        placeholder: "e.g., CLAUDE_API_KEY",
        columns: H.columns,
        cursorOffset: O,
        onChangeCursorOffset: $,
        showCursor: !0
    })), q[28] = O, q[29] = _, q[30] = w, q[31] = Y, q[32] = H, q[33] = K, q[34] = I;
    else I = q[34];
    let g;
    if (q[35] !== h || q[36] !== u || q[37] !== I) g = G$.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, v, N, V, h, u, I), q[35] = h, q[36] = u, q[37] = I, q[38] = g;
    else g = q[38];
    let B;
    if (q[39] === Symbol.for("react.memo_cache_sentinel")) B = G$.default.createElement(m, {
        marginLeft: 3
    }, G$.default.createElement(T, {
        dimColor: !0
    }, "↑/↓ to select · Enter to continue")), q[39] = B;
    else B = q[39];
    let b;
    if (q[40] !== g) b = G$.default.createElement(G$.default.Fragment, null, g, B), q[40] = g, q[41] = b;
    else b = q[41];
    return b
}
// @from(Ln 393497, Col 4)
G$
// @from(Ln 393498, Col 4)
O_q = E(() => {
    e6();
    i6();
    _7();
    AH();
    _q();
    G$ = t(P6(), 1)
})