
// @from(Ln 468126, Col 0)
function iPq(A) {
    let q = e(36),
        {
            notebook_path: K,
            cell_id: Y,
            new_source: z,
            cell_type: w,
            edit_mode: H,
            verbose: $,
            width: O
        } = A,
        _ = H === void 0 ? "replace" : H,
        J = b1().existsSync(K),
        X;
    A: {
        if (!J) {
            X = null;
            break A
        }
        try {
            let S;
            if (q[0] !== K) {
                let m = $J(K);
                S = j9(m), q[0] = K, q[1] = S
            } else S = q[1];
            X = S
        } catch (S) {
            X = null
        }
    }
    let D = X,
        j;
    if (q[2] !== Y || q[3] !== D) {
        A: {
            if (!D || !Y) {
                j = "";
                break A
            }
            let S = sQ1(Y);
            if (S !== void 0) {
                if (D.cells[S]) {
                    let g = D.cells[S].source,
                        U;
                    if (q[5] !== g) U = Array.isArray(g) ? g.join("") : g, q[5] = g, q[6] = U;
                    else U = q[6];
                    j = U;
                    break A
                }
                j = "";
                break A
            }
            let m;
            if (q[7] !== Y) m = (g) => g.id === Y,
            q[7] = Y,
            q[8] = m;
            else m = q[8];
            let b = D.cells.find(m);
            if (!b) {
                j = "";
                break A
            }
            j = Array.isArray(b.source) ? b.source.join("") : b.source
        }
        q[2] = Y,
        q[3] = D,
        q[4] = j
    }
    else j = q[4];
    let M = j,
        P;
    A: {
        if (!J || _ === "insert" || _ === "delete") {
            P = null;
            break A
        }
        let S;
        if (q[9] !== z || q[10] !== K || q[11] !== M) S = kv({
            filePath: K,
            fileContents: M,
            edits: [{
                old_string: M,
                new_string: z,
                replace_all: !1
            }],
            ignoreWhitespace: !1
        }),
        q[9] = z,
        q[10] = K,
        q[11] = M,
        q[12] = S;
        else S = q[12];P = S
    }
    let W = P,
        G;
    A: switch (_) {
        case "insert": {
            G = "Insert new cell";
            break A
        }
        case "delete": {
            G = "Delete cell";
            break A
        }
        default:
            G = "Replace cell contents"
    }
    let f;
    if (q[13] !== K || q[14] !== $) f = $ ? K : tXz(h6(), K), q[13] = K, q[14] = $, q[15] = f;
    else f = q[15];
    let Z;
    if (q[16] !== f) Z = M$.createElement(V, {
        bold: !0
    }, f), q[16] = f, q[17] = Z;
    else Z = q[17];
    let N = w ? ` (${w})` : "",
        T;
    if (q[18] !== Y || q[19] !== G || q[20] !== N) T = M$.createElement(V, {
        dimColor: !0
    }, G, " for cell ", Y, N), q[18] = Y, q[19] = G, q[20] = N, q[21] = T;
    else T = q[21];
    let k;
    if (q[22] !== Z || q[23] !== T) k = M$.createElement(I, {
        paddingBottom: 1,
        flexDirection: "column"
    }, Z, T), q[22] = Z, q[23] = T, q[24] = k;
    else k = q[24];
    let y;
    if (q[25] !== w || q[26] !== _ || q[27] !== W || q[28] !== z || q[29] !== K || q[30] !== M || q[31] !== O) y = _ === "delete" ? M$.createElement(I, {
        flexDirection: "column",
        paddingLeft: 2
    }, M$.createElement(VN, {
        code: M,
        filePath: K
    })) : _ === "insert" ? M$.createElement(I, {
        flexDirection: "column",
        paddingLeft: 2
    }, M$.createElement(VN, {
        code: z,
        filePath: w === "markdown" ? "file.md" : K
    })) : W ? rR(W.map((S) => M$.createElement(fN, {
        key: S.newStart,
        patch: S,
        dim: !1,
        width: O,
        filePath: K,
        firstLine: z.split(`
`)[0] ?? null,
        fileContent: M
    })), eXz) : M$.createElement(VN, {
        code: z,
        filePath: w === "markdown" ? "file.md" : K
    }), q[25] = w, q[26] = _, q[27] = W, q[28] = z, q[29] = K, q[30] = M, q[31] = O, q[32] = y;
    else y = q[32];
    let B;
    if (q[33] !== y || q[34] !== k) B = M$.createElement(I, {
        flexDirection: "column"
    }, M$.createElement(I, {
        borderDimColor: !0,
        borderStyle: "round",
        flexDirection: "column",
        paddingX: 1
    }, k, y)), q[33] = y, q[34] = k, q[35] = B;
    else B = q[35];
    return B
}
// @from(Ln 468292, Col 0)
function eXz(A) {
    return M$.createElement(V, {
        dimColor: !0,
        key: `ellipsis-${A}`
    }, "...")
}
// @from(Ln 468298, Col 4)
M$
// @from(Ln 468299, Col 4)
nPq = v(() => {
    i1();
    jt();
    m1();
    N7();
    Z51();
    wp();
    wq();
    AH();
    _8();
    FP6();
    M$ = o(X1(), 1)
})
// @from(Ln 468316, Col 0)
function rPq(A) {
    let q = e(52),
        K = qDz,
        Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G, f, Z;
    if (q[0] !== A.onDone || q[1] !== A.onReject || q[2] !== A.toolUseConfirm || q[3] !== A.toolUseContext || q[4] !== A.workerBadge) {
        O = K(A.toolUseConfirm.input);
        let {
            notebook_path: S,
            edit_mode: m,
            cell_type: b
        } = O;
        $ = S, H = b === "markdown" ? "markdown" : "python";
        let g = m === "insert" ? "insert this cell into" : m === "delete" ? "delete this cell from" : "make this edit to";
        w = ZF, P = A.toolUseConfirm, W = A.toolUseContext, G = A.onDone, f = A.onReject, Z = A.workerBadge, X = "Edit notebook", z = V, D = "Do you want to ", j = g, M = " ", Y = V, _ = !0, J = ADz($), q[0] = A.onDone, q[1] = A.onReject, q[2] = A.toolUseConfirm, q[3] = A.toolUseContext, q[4] = A.workerBadge, q[5] = Y, q[6] = z, q[7] = w, q[8] = H, q[9] = $, q[10] = O, q[11] = _, q[12] = J, q[13] = X, q[14] = D, q[15] = j, q[16] = M, q[17] = P, q[18] = W, q[19] = G, q[20] = f, q[21] = Z
    } else Y = q[5], z = q[6], w = q[7], H = q[8], $ = q[9], O = q[10], _ = q[11], J = q[12], X = q[13], D = q[14], j = q[15], M = q[16], P = q[17], W = q[18], G = q[19], f = q[20], Z = q[21];
    let N;
    if (q[22] !== Y || q[23] !== _ || q[24] !== J) N = Lc1.default.createElement(Y, {
        bold: _
    }, J), q[22] = Y, q[23] = _, q[24] = J, q[25] = N;
    else N = q[25];
    let T;
    if (q[26] !== z || q[27] !== N || q[28] !== D || q[29] !== j || q[30] !== M) T = Lc1.default.createElement(z, null, D, j, M, N, "?"), q[26] = z, q[27] = N, q[28] = D, q[29] = j, q[30] = M, q[31] = T;
    else T = q[31];
    let k = A.verbose ? 120 : 80,
        y;
    if (q[32] !== O.cell_id || q[33] !== O.cell_type || q[34] !== O.edit_mode || q[35] !== O.new_source || q[36] !== O.notebook_path || q[37] !== A.verbose || q[38] !== k) y = Lc1.default.createElement(iPq, {
        notebook_path: O.notebook_path,
        cell_id: O.cell_id,
        new_source: O.new_source,
        cell_type: O.cell_type,
        edit_mode: O.edit_mode,
        verbose: A.verbose,
        width: k
    }), q[32] = O.cell_id, q[33] = O.cell_type, q[34] = O.edit_mode, q[35] = O.new_source, q[36] = O.notebook_path, q[37] = A.verbose, q[38] = k, q[39] = y;
    else y = q[39];
    let B;
    if (q[40] !== w || q[41] !== H || q[42] !== $ || q[43] !== X || q[44] !== T || q[45] !== y || q[46] !== P || q[47] !== W || q[48] !== G || q[49] !== f || q[50] !== Z) B = Lc1.default.createElement(w, {
        toolUseConfirm: P,
        toolUseContext: W,
        onDone: G,
        onReject: f,
        workerBadge: Z,
        title: X,
        question: T,
        content: y,
        path: $,
        completionType: "tool_use_single",
        languageName: H,
        parseInput: K
    }), q[40] = w, q[41] = H, q[42] = $, q[43] = X, q[44] = T, q[45] = y, q[46] = P, q[47] = W, q[48] = G, q[49] = f, q[50] = Z, q[51] = B;
    else B = q[51];
    return B
}
// @from(Ln 468370, Col 0)
function qDz(A) {
    let q = gd.inputSchema.safeParse(A);
    if (!q.success) return K1(Error(`Failed to parse notebook edit input: ${q.error.message}`)), {
        notebook_path: "",
        new_source: "",
        cell_id: ""
    };
    return q.data
}
// @from(Ln 468379, Col 4)
Lc1
// @from(Ln 468380, Col 4)
oPq = v(() => {
    i1();
    m1();
    tQ1();
    nPq();
    Nf1();
    y6();
    Lc1 = o(X1(), 1)
})
// @from(Ln 468390, Col 0)
function zDz(A) {
    let q = A.split(" ")[0] ?? "";
    return YDz.some((K) => q.includes(K))
}
// @from(Ln 468395, Col 0)
function YgA(A) {
    let q = b1(),
        K = fL.get(process.stdout);
    if (!K) throw Error("Ink instance not found - cannot pause rendering");
    let Y = FI();
    if (!Y) return {
        content: null
    };
    if (!q.existsSync(A)) return {
        content: null
    };
    let z = !zDz(Y);
    try {
        if (K.pause(), K.suspendStdin(), z) process.stdout.write("\x1B[?1049h\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H");
        let w = KDz[Y] ?? Y;
        return $k(`${w} "${A}"`, {
            stdio: "inherit"
        }), {
            content: q.readFileSync(A, {
                encoding: "utf-8"
            })
        }
    } catch (w) {
        if (typeof w === "object" && w !== null && "status" in w && typeof w.status === "number") {
            let H = w.status;
            if (H !== 0) return {
                content: null,
                error: `${S_(Y)} exited with code ${H}`
            }
        }
        return {
            content: null
        }
    } finally {
        if (z) process.stdout.write("\x1B[?1049l\x1B[?1004h\x1B[?25l");
        K.resumeStdin(), K.resume()
    }
}
// @from(Ln 468434, Col 0)
function wDz(A, q) {
    let K = ID1(A),
        Y = A;
    for (let z = K.length - 1; z >= 0; z--) {
        let w = K[z],
            H = q[w.id];
        if (H && H.type === "text") {
            let $ = Y.lastIndexOf(w.match);
            if ($ !== -1) Y = Y.slice(0, $) + H.content + Y.slice($ + w.match.length)
        }
    }
    return Y
}
// @from(Ln 468448, Col 0)
function HDz(A, q, K) {
    let Y = A;
    for (let [z, w] of Object.entries(K))
        if (w.type === "text") {
            let H = parseInt(z),
                $ = w.content,
                O = Y.indexOf($);
            if (O !== -1) {
                let _ = hD1($),
                    J = c26(H, _);
                Y = Y.slice(0, O) + J + Y.slice(O + $.length)
            }
        } return Y
}
// @from(Ln 468463, Col 0)
function Ef1(A, q) {
    let K = b1(),
        Y = eT6();
    try {
        let z = q ? wDz(A, q) : A;
        c8(Y, z, {
            encoding: "utf-8",
            flush: !0
        });
        let w = YgA(Y);
        if (w.content === null) return w;
        let H = w.content;
        if (H.endsWith(`
`) && !H.endsWith(`

`)) H = H.slice(0, -1);
        if (q) H = HDz(H, A, q);
        return {
            content: H
        }
    } finally {
        try {
            if (K.existsSync(Y)) K.unlinkSync(Y)
        } catch {}
    }
}
// @from(Ln 468489, Col 4)
KDz
// @from(Ln 468489, Col 9)
YDz
// @from(Ln 468490, Col 4)
Cv6 = v(() => {
    eN1();
    YF();
    m6();
    _8();
    AQA();
    DJ1();
    q$();
    nS();
    KDz = {
        code: "code -w",
        subl: "subl --wait"
    }, YDz = ["code", "subl", "atom", "gedit", "notepad++", "notepad"]
})
// @from(Ln 468505, Col 0)
function Rc1(A, q) {
    let K = [{
        type: "setMode",
        mode: KA1(A),
        destination: "session"
    }];
    if (ne() && q && q.length > 0) K.push({
        type: "addRules",
        rules: q.map((Y) => ({
            toolName: Y.tool,
            ruleContent: g_q(Y.prompt)
        })),
        behavior: "allow",
        destination: "session"
    });
    return K
}
// @from(Ln 468523, Col 0)
function aPq({
    toolUseConfirm: A,
    onDone: q,
    onReject: K,
    workerBadge: Y
}) {
    let z = v6((D1) => D1.toolPermissionContext),
        w = L7(),
        {
            addNotification: H
        } = iq(),
        [$, O] = TP.useState(""),
        [_, J] = TP.useState({}),
        X = TP.useRef(0);

    function D(D1, Z1, E1, a, A1) {
        let M1 = X.current++,
            z1 = {
                id: M1,
                type: "image",
                content: D1,
                mediaType: Z1 || "image/png",
                filename: E1 || "Pasted image",
                dimensions: a
            };
        gD1(z1), setTimeout(() => Xq1(z1), 0), J((Y1) => ({
            ...Y1,
            [M1]: z1
        }))
    }
    let j = TP.useCallback((D1) => {
            J((Z1) => {
                let E1 = {
                    ...Z1
                };
                return delete E1[D1], E1
            })
        }, []),
        M = Object.values(_).filter((D1) => D1.type === "image"),
        P = M.length > 0,
        W = A.tool.name === bW,
        G = W ? void 0 : A.input.plan,
        f = W ? uW() : void 0,
        Z = A.input.allowedPrompts,
        N = G ?? pD(),
        T = !N || N.trim() === "",
        [k, y] = TP.useState(() => {
            if (G) return G;
            return pD() ?? "No plan found. Please write your plan to the plan file first."
        }),
        [B, S] = TP.useState(!1),
        [m, b] = TP.useState("default"),
        [g, U] = TP.useState([]),
        [x, p] = TP.useState(null),
        [l, r] = TP.useState(null),
        [s, O1] = TP.useState("");
    TP.useEffect(() => {
        if (B) {
            let D1 = setTimeout(() => {
                S(!1)
            }, 5000);
            return () => clearTimeout(D1)
        }
    }, [B]), TP.useEffect(() => {
        if (!x) return;
        H({
            key: "remote-error",
            text: x,
            color: "warning",
            priority: "high"
        }), p(null)
    }, [x, H]), D8((D1, Z1) => {
        if (Z1.ctrl && D1.toLowerCase() === "g")
            if (c("tengu_plan_external_editor_used", {}), W && f) {
                let E1 = YgA(f);
                if (E1.error) H({
                    key: "external-editor-error",
                    text: E1.error,
                    color: "warning",
                    priority: "high"
                });
                if (E1.content !== null) y(E1.content), S(!0)
            } else {
                let E1 = Ef1(k);
                if (E1.error) H({
                    key: "external-editor-error",
                    text: E1.error,
                    color: "warning",
                    priority: "high"
                });
                if (E1.content !== null && E1.content !== k) y(E1.content), S(!0)
            } if (Z1.shift && Z1.tab) {
            q1("yes-accept-edits");
            return
        }
    });
    async function T1(D1) {
        b("creating");
        try {
            let Z1 = $Dz(k),
                E1 = `Implement the following plan:

${k}`,
                a = await b51({
                    initialMessage: E1,
                    branchName: D1,
                    description: Z1,
                    signal: new AbortController().signal
                });
            if (!a) {
                c("tengu_plan_remote_session_failed", {
                    reason: "null_session"
                }), p("Failed to create remote session"), b("default");
                return
            }
            c("tengu_plan_exit", {
                planLengthChars: k.length,
                outcome: "yes-push-to-remote"
            }), OT(!0), q(), A.onAllow({
                pushToRemote: !0,
                remoteSessionId: a.id,
                remoteSessionTitle: a.title,
                remoteSessionUrl: u51(a.id)
            }, Rc1("default", Z))
        } catch (Z1) {
            c("tengu_plan_remote_session_failed", {
                reason: "exception"
            }), p(`Failed to create remote session: ${Z1 instanceof Error?Z1.message:String(Z1)}`), b("default")
        }
    }
    async function N1() {
        b("checking");
        let D1 = await rW6();
        if (!D1.eligible) {
            let z1 = D1.errors.map((Y1) => Y1.type).join(",");
            c("tengu_plan_remote_eligibility_failed", {
                errors: z1
            }), U(D1.errors.map(oW6)), b("eligibility-error");
            return
        }
        let Z1 = await bs1(),
            E1 = await sj(),
            a = await tj(),
            A1 = Z1.commitsAheadOfDefaultBranch === 0;
        if ((Z1.hasUncommitted || Z1.hasUnpushed) && !A1) {
            r(Z1), O1(E1), b("git-dialog");
            return
        }
        let M1 = Z1.commitsAheadOfDefaultBranch === 0 ? a : E1;
        await T1(M1)
    }
    async function j1(D1) {
        if (c("tengu_plan_remote_git_dialog", {
                choice: D1
            }), D1 === "cancel") {
            b("default");
            return
        }
        if (b("checking"), D1 === "commit-push" && l) {
            let A1 = await us1("Plan mode: Push to remote");
            if (!A1.success) {
                p(`Failed to commit and push: ${A1.error}`), b("default");
                return
            }
        }
        let Z1 = await tj(),
            E1 = l?.commitsAheadOfDefaultBranch === 0 ? Z1 : s;
        await T1(E1)
    }
    async function q1(D1) {
        if (D1 === "yes-push-to-remote") {
            N1();
            return
        }
        let Z1 = W ? {} : {
            plan: k
        };
        if (D1 !== "no" && !(D1 === "yes-accept-edits-keep-context" || D1 === "yes-default-keep-context")) {
            let Y1 = "default";
            if (D1 === "yes-bypass-permissions") Y1 = "bypassPermissions";
            else if (D1 === "yes-accept-edits") Y1 = "acceptEdits";
            c("tengu_plan_exit", {
                planLengthChars: k.length,
                outcome: D1,
                clearContext: !0,
                interviewPhaseEnabled: sO()
            });
            let _1 = "",
                G1 = `

If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: ${a$(U6())}`,
                L1 = l8() ? `

If this plan can be broken down into multiple independent tasks, consider using the ${vh} tool to create a team and parallelize the work.` : "";
            w((x1) => ({
                ...x1,
                initialMessage: {
                    message: {
                        ...c6({
                            content: `Implement the following plan:

${k}${_1}${G1}${L1}`
                        }),
                        planContent: k
                    },
                    clearContext: !0,
                    mode: Y1,
                    allowedPrompts: Z
                }
            })), OT(!0), q(), K(), A.onReject();
            return
        }
        let A1 = {
            "yes-accept-edits-keep-context": z.isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
            "yes-default-keep-context": "default"
        } [D1];
        if (A1) {
            c("tengu_plan_exit", {
                planLengthChars: k.length,
                outcome: D1,
                clearContext: !1,
                interviewPhaseEnabled: sO()
            }), OT(!0), kx(!0), q(), A.onAllow(Z1, Rc1(A1, Z));
            return
        }
        let z1 = {
            "yes-bypass-permissions": "bypassPermissions",
            "yes-accept-edits": "acceptEdits"
        } [D1];
        if (z1) {
            c("tengu_plan_exit", {
                planLengthChars: k.length,
                outcome: D1,
                interviewPhaseEnabled: sO()
            }), OT(!0), kx(!0), q(), A.onAllow(Z1, Rc1(z1, Z));
            return
        }
        if (D1 === "no") {
            let Y1 = $.trim();
            if (!Y1 && !P) return;
            c("tengu_plan_exit", {
                planLengthChars: k.length,
                outcome: "no",
                interviewPhaseEnabled: sO()
            });
            let _1;
            if (P) _1 = await Promise.all(M.map(async ($1) => {
                let G1 = {
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: $1.mediaType || "image/png",
                        data: $1.content
                    }
                };
                return (await Aq1(G1)).block
            }));
            q(), K(), A.onReject(Y1 || (P ? "(See attached image)" : void 0), _1 && _1.length > 0 ? _1 : void 0)
        }
    }
    let t = FI(),
        J1 = t ? S_(t) : null;
    if (m === "git-dialog" && l) return X5.default.createElement(Gc1, {
        issue: l,
        branchName: s,
        onDone: j1,
        color: "planMode"
    });
    if (m === "eligibility-error") {
        let D1 = g.map((Z1) => {
            let E1 = Z1.match(/(https?:\/\/[^\s]+)/i),
                a = Z1.split(`
`)[0] || Z1,
                A1 = a;
            if (/^The Claude GitHub app must be installed/i.test(a)) A1 = "Install the Claude GitHub app on this repository";
            else if (/^Please run \/login and sign in/i.test(a)) A1 = "Run /login to sign in with Claude.ai";
            return {
                label: A1,
                url: E1?.[1],
                value: E1?.[1] ?? "none"
            }
        });
        return X5.default.createElement(Bw, {
            color: "planMode",
            title: "Push to remote unavailable",
            workerBadge: Y
        }, X5.default.createElement(I, {
            flexDirection: "column",
            paddingX: 1,
            marginTop: 1
        }, X5.default.createElement(V, null, "Complete these steps, then try again:"), X5.default.createElement(I, {
            marginTop: 1,
            flexDirection: "column"
        }, X5.default.createElement(kA, {
            options: D1,
            onChange: (Z1) => {
                if (Z1 === "none") b("default");
                else if (Z1.startsWith("http")) zY(Z1)
            },
            onCancel: () => b("default")
        })), D1.filter((Z1) => Z1.url).map((Z1, E1) => X5.default.createElement(V, {
            key: E1,
            dimColor: !0
        }, Z1.url)), X5.default.createElement(V, {
            dimColor: !0
        }, "← to go back")))
    }
    if (m === "checking" || m === "creating") return X5.default.createElement(Bw, {
        color: "planMode",
        title: "Pushing to remote…",
        workerBadge: Y
    }, X5.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1,
        marginTop: 1
    }, X5.default.createElement(I, null, X5.default.createElement(c4, null), X5.default.createElement(V, null, m === "checking" ? " Checking prerequisites…" : " Creating remote session…"))));
    if (T) return X5.default.createElement(Bw, {
        color: "planMode",
        title: "Exit plan mode?",
        workerBadge: Y
    }, X5.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1,
        marginTop: 1
    }, X5.default.createElement(V, null, "Claude wants to exit plan mode"), X5.default.createElement(I, {
        marginTop: 1
    }, X5.default.createElement(kA, {
        options: [{
            label: "Yes",
            value: "yes"
        }, {
            label: "No",
            value: "no"
        }],
        onChange: function(Z1) {
            if (Z1 === "yes") c("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "yes-default",
                interviewPhaseEnabled: sO()
            }), OT(!0), kx(!0), q(), A.onAllow({}, [{
                type: "setMode",
                mode: "default",
                destination: "session"
            }]);
            else c("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "no",
                interviewPhaseEnabled: sO()
            }), q(), K(), A.onReject()
        },
        onCancel: () => {
            c("tengu_plan_exit", {
                planLengthChars: 0,
                outcome: "no",
                interviewPhaseEnabled: sO()
            }), q(), K(), A.onReject()
        }
    }))));
    return X5.default.createElement(X5.default.Fragment, null, X5.default.createElement(Bw, {
        color: "planMode",
        title: "Ready to code?",
        innerPaddingX: 0,
        workerBadge: Y
    }, X5.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, X5.default.createElement(I, {
        paddingX: 1
    }, X5.default.createElement(V, null, "Here is Claude's plan:")), X5.default.createElement(I, {
        borderDimColor: !0,
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1,
        marginBottom: 1,
        overflow: "hidden"
    }, X5.default.createElement(TJ, null, k)), X5.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1
    }, X5.default.createElement(mN, {
        permissionResult: A.permissionResult,
        toolType: "tool"
    }), ne() && Z && Z.length > 0 && X5.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, X5.default.createElement(V, {
        bold: !0
    }, "Requested permissions:"), Z.map((D1, Z1) => X5.default.createElement(V, {
        key: Z1,
        dimColor: !0
    }, "  ", "· ", D1.tool, "(", Q_q, " ", D1.prompt, ")"))), X5.default.createElement(V, {
        dimColor: !0
    }, "Claude has written up a plan and is ready to execute. Would you like to proceed?"), X5.default.createElement(I, {
        marginTop: 1
    }, X5.default.createElement(kA, {
        options: [...z.isBypassPermissionsModeAvailable ? [{
            label: "Yes, clear context and bypass permissions",
            value: "yes-bypass-permissions"
        }] : [{
            label: "Yes, clear context and auto-accept edits (shift+tab)",
            value: "yes-accept-edits"
        }], ...[], {
            label: z.isBypassPermissionsModeAvailable ? "Yes, and bypass permissions" : "Yes, auto-accept edits",
            value: "yes-accept-edits-keep-context"
        }, {
            label: "Yes, manually approve edits",
            value: "yes-default-keep-context"
        }, {
            type: "input",
            label: "No, keep planning",
            value: "no",
            placeholder: "Type here to tell Claude what to change",
            onChange: O
        }],
        onChange: (D1) => q1(D1),
        onCancel: () => {
            c("tengu_plan_exit", {
                planLengthChars: k.length,
                outcome: "no",
                interviewPhaseEnabled: sO()
            }), q(), K(), A.onReject()
        },
        onImagePaste: D,
        pastedContents: _,
        onRemoveImage: j
    }))))), J1 && X5.default.createElement(I, {
        flexDirection: "row",
        gap: 1,
        paddingX: 1,
        marginTop: 1
    }, X5.default.createElement(I, null, X5.default.createElement(V, {
        dimColor: !0
    }, "ctrl-g to edit in "), X5.default.createElement(V, {
        bold: !0,
        dimColor: !0
    }, J1), W && f && X5.default.createElement(V, {
        dimColor: !0
    }, " · ", L3(f))), B && X5.default.createElement(I, null, X5.default.createElement(V, {
        dimColor: !0
    }, " · "), X5.default.createElement(V, {
        color: "success"
    }, l1.tick, "Plan saved!"))))
}
// @from(Ln 468969, Col 0)
function $Dz(A) {
    let q = A.split(`
`),
        K = q.find((w) => /^#\s+/.test(w)),
        Y = q.find((w) => {
            let H = w.trim();
            return H && !H.startsWith("#")
        }),
        z = K ? K.replace(/^#+\s*/, "").replace(/^Plan:\s*/i, "") : Y?.trim() ?? "Implement plan";
    return z.length > 100 ? `${z.slice(0,97)}...` : z
}
// @from(Ln 468980, Col 4)
X5
// @from(Ln 468980, Col 8)
TP
// @from(Ln 468981, Col 4)
zgA = v(() => {
    m1();
    S9();
    wY();
    Bv();
    uh();
    $11();
    d8();
    h2();
    Cv6();
    u6();
    b7();
    YF();
    q$();
    mX();
    wq();
    B6();
    lq();
    N8();
    oj();
    J7();
    mV();
    pW1();
    Im();
    h9();
    x2();
    Oj();
    QQA();
    S51();
    dL();
    po();
    X5 = o(X1(), 1), TP = o(X1(), 1)
})
// @from(Ln 469015, Col 0)
function sPq(A) {
    let q = e(18),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: w
        } = A,
        H = v6(ODz),
        $;
    if (q[0] !== Y || q[1] !== z || q[2] !== H || q[3] !== K) $ = function(f) {
        if (f === "yes") c("tengu_plan_enter", {
            interviewPhaseEnabled: sO(),
            entryMethod: "tool"
        }), ey(H, "plan"), Y(), K.onAllow({}, [{
            type: "setMode",
            mode: "plan",
            destination: "session"
        }]);
        else Y(), z(), K.onReject()
    }, q[0] = Y, q[1] = z, q[2] = H, q[3] = K, q[4] = $;
    else $ = q[4];
    let O = $,
        _;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) _ = QN.default.createElement(V, null, "Claude wants to enter plan mode to explore and design an implementation approach."), q[5] = _;
    else _ = q[5];
    let J;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) J = QN.default.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, QN.default.createElement(V, {
        dimColor: !0
    }, "In plan mode, Claude will:"), QN.default.createElement(V, {
        dimColor: !0
    }, " · Explore the codebase thoroughly"), QN.default.createElement(V, {
        dimColor: !0
    }, " · Identify existing patterns"), QN.default.createElement(V, {
        dimColor: !0
    }, " · Design an implementation strategy"), QN.default.createElement(V, {
        dimColor: !0
    }, " · Present a plan for your approval")), q[6] = J;
    else J = q[6];
    let X;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) X = QN.default.createElement(I, {
        marginTop: 1
    }, QN.default.createElement(V, {
        dimColor: !0
    }, "No code changes will be made until you approve the plan.")), q[7] = X;
    else X = q[7];
    let D;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) D = {
        label: "Yes, enter plan mode",
        value: "yes"
    }, q[8] = D;
    else D = q[8];
    let j;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) j = [D, {
        label: "No, start implementing now",
        value: "no"
    }], q[9] = j;
    else j = q[9];
    let M;
    if (q[10] !== O) M = () => O("no"), q[10] = O, q[11] = M;
    else M = q[11];
    let P;
    if (q[12] !== O || q[13] !== M) P = QN.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        paddingX: 1
    }, _, J, X, QN.default.createElement(I, {
        marginTop: 1
    }, QN.default.createElement(kA, {
        options: j,
        onChange: O,
        onCancel: M
    }))), q[12] = O, q[13] = M, q[14] = P;
    else P = q[14];
    let W;
    if (q[15] !== P || q[16] !== w) W = QN.default.createElement(Bw, {
        color: "planMode",
        title: "Enter plan mode?",
        workerBadge: w
    }, P), q[15] = P, q[16] = w, q[17] = W;
    else W = q[17];
    return W
}
// @from(Ln 469102, Col 0)
function ODz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 469105, Col 4)
QN
// @from(Ln 469106, Col 4)
tPq = v(() => {
    i1();
    m1();
    wY();
    Bv();
    B6();
    d8();
    u6();
    S51();
    QN = o(X1(), 1)
})
// @from(Ln 469118, Col 0)
function ePq(A) {
    let q = e(51),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: w
        } = A,
        H = _Dz,
        $;
    if (q[0] !== K.input) $ = H(K.input), q[0] = K.input, q[1] = $;
    else $ = q[1];
    let O = $,
        _ = K.permissionResult.behavior === "ask" && K.permissionResult.metadata && "command" in K.permissionResult.metadata ? K.permissionResult.metadata.command : void 0,
        J;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) J = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[2] = J;
    else J = q[2];
    Ny(K, J);
    let D;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) D = y8(), q[3] = D;
    else D = q[3];
    let j = D,
        M;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) M = tb(), q[4] = M;
    else M = q[4];
    let P = M,
        W;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = [{
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }], q[5] = W;
    else W = q[5];
    let G = W,
        f;
    if (q[6] !== O) {
        if (f = [], P) {
            let q1 = gN.default.createElement(V, {
                    bold: !0
                }, O),
                t;
            if (q[8] === Symbol.for("react.memo_cache_sentinel")) t = gN.default.createElement(V, {
                bold: !0
            }, j), q[8] = t;
            else t = q[8];
            let J1;
            if (q[9] !== q1) J1 = {
                label: gN.default.createElement(V, null, "Yes, and don't ask again for ", q1, " in", " ", t),
                value: "yes-exact"
            }, q[9] = q1, q[10] = J1;
            else J1 = q[10];
            f.push(J1);
            let D1 = O.indexOf(" ");
            if (D1 > 0) {
                let E1 = O.substring(0, D1) + ":*",
                    a;
                if (q[11] !== E1) a = gN.default.createElement(V, {
                    bold: !0
                }, E1), q[11] = E1, q[12] = a;
                else a = q[12];
                let A1;
                if (q[13] === Symbol.for("react.memo_cache_sentinel")) A1 = gN.default.createElement(V, {
                    bold: !0
                }, j), q[13] = A1;
                else A1 = q[13];
                let M1;
                if (q[14] !== a) M1 = {
                    label: gN.default.createElement(V, null, "Yes, and don't ask again for", " ", a, " commands in", " ", A1),
                    value: "yes-prefix"
                }, q[14] = a, q[15] = M1;
                else M1 = q[15];
                f.push(M1)
            }
        }
        q[6] = O, q[7] = f
    } else f = q[7];
    let Z;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) Z = {
        label: "No",
        value: "no",
        feedbackConfig: {
            type: "reject"
        }
    }, q[16] = Z;
    else Z = q[16];
    let N = Z,
        T;
    if (q[17] !== f) T = [...G, ...f, N], q[17] = f, q[18] = T;
    else T = q[18];
    let k = T,
        y;
    if (q[19] !== K.tool.name) y = AK(K.tool.name), q[19] = K.tool.name, q[20] = y;
    else y = q[20];
    let B = K.tool.isMcp ?? !1,
        S;
    if (q[21] !== y || q[22] !== B) S = {
        toolName: y,
        isMcp: B
    }, q[21] = y, q[22] = B, q[23] = S;
    else S = q[23];
    let m = S,
        b;
    if (q[24] !== Y || q[25] !== z || q[26] !== O || q[27] !== K) b = (q1, t) => {
        A: switch (q1) {
            case "yes": {
                l_({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: xA.platform
                    }
                }), K.onAllow(K.input, [], t), Y();
                break A
            }
            case "yes-exact": {
                l_({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: xA.platform
                    }
                }), K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: NJ,
                        ruleContent: O
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "yes-prefix": {
                l_({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: xA.platform
                    }
                });
                let J1 = O.indexOf(" "),
                    D1 = J1 > 0 ? O.substring(0, J1) : O;
                K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [{
                        toolName: NJ,
                        ruleContent: `${D1}:*`
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "no":
                l_({
                    completion_type: "tool_use_single",
                    event: "reject",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: xA.platform
                    }
                }), K.onReject(t), z(), Y()
        }
    }, q[24] = Y, q[25] = z, q[26] = O, q[27] = K, q[28] = b;
    else b = q[28];
    let g = b,
        U;
    if (q[29] !== Y || q[30] !== z || q[31] !== K) U = () => {
        l_({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: K.assistantMessage.message.id,
                platform: xA.platform
            }
        }), K.onReject(), z(), Y()
    }, q[29] = Y, q[30] = z, q[31] = K, q[32] = U;
    else U = q[32];
    let x = U,
        p = `Use skill "${O}"?`,
        l;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) l = gN.default.createElement(V, null, "Claude may use instructions, code, or files from this Skill."), q[33] = l;
    else l = q[33];
    let r = _?.description,
        s;
    if (q[34] !== r) s = gN.default.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, gN.default.createElement(V, {
        dimColor: !0
    }, r)), q[34] = r, q[35] = s;
    else s = q[35];
    let O1;
    if (q[36] !== K.permissionResult) O1 = gN.default.createElement(mN, {
        permissionResult: K.permissionResult,
        toolType: "tool"
    }), q[36] = K.permissionResult, q[37] = O1;
    else O1 = q[37];
    let T1;
    if (q[38] !== x || q[39] !== g || q[40] !== k || q[41] !== m) T1 = gN.default.createElement(Tf1, {
        options: k,
        onSelect: g,
        onCancel: x,
        toolAnalyticsContext: m
    }), q[38] = x, q[39] = g, q[40] = k, q[41] = m, q[42] = T1;
    else T1 = q[42];
    let N1;
    if (q[43] !== O1 || q[44] !== T1) N1 = gN.default.createElement(I, {
        flexDirection: "column"
    }, O1, T1), q[43] = O1, q[44] = T1, q[45] = N1;
    else N1 = q[45];
    let j1;
    if (q[46] !== p || q[47] !== s || q[48] !== N1 || q[49] !== w) j1 = gN.default.createElement(Bw, {
        title: p,
        workerBadge: w
    }, l, s, N1), q[46] = p, q[47] = s, q[48] = N1, q[49] = w, q[50] = j1;
    else j1 = q[50];
    return j1
}
// @from(Ln 469352, Col 0)
function _Dz(A) {
    let q = wt.inputSchema.safeParse(A);
    if (!q.success) return K1(Error(`Failed to parse skill tool input: ${q.error.message}`)), "";
    return q.data.skill
}
// @from(Ln 469357, Col 4)
gN
// @from(Ln 469358, Col 4)
AWq = v(() => {
    i1();
    m1();
    Bv();
    DY1();
    G5();
    B6();
    jY1();
    $11();
    $P6();
    y6();
    Rv6();
    U$();
    KL();
    gN = o(X1(), 1)
})
// @from(Ln 469375, Col 0)
function JDz(A, q) {
    switch (q.type) {
        case "next-question":
            return {
                ...A, currentQuestionIndex: A.currentQuestionIndex + 1, isInTextInput: !1
            };
        case "prev-question":
            return {
                ...A, currentQuestionIndex: Math.max(0, A.currentQuestionIndex - 1), isInTextInput: !1
            };
        case "update-question-state": {
            let K = A.questionStates[q.questionText],
                Y = {
                    selectedValue: q.updates.selectedValue ?? K?.selectedValue ?? (q.isMultiSelect ? [] : void 0),
                    textInputValue: q.updates.textInputValue ?? K?.textInputValue ?? ""
                };
            return {
                ...A,
                questionStates: {
                    ...A.questionStates,
                    [q.questionText]: Y
                }
            }
        }
        case "set-answer": {
            let K = {
                ...A,
                answers: {
                    ...A.answers,
                    [q.questionText]: q.answer
                }
            };
            if (q.shouldAdvance) return {
                ...K,
                currentQuestionIndex: K.currentQuestionIndex + 1,
                isInTextInput: !1
            };
            return K
        }
        case "set-text-input-mode":
            return {
                ...A, isInTextInput: q.isInInput
            }
    }
}
// @from(Ln 469421, Col 0)
function qWq() {
    let [A, q] = O11.useReducer(JDz, XDz), K = O11.useCallback(() => {
        q({
            type: "next-question"
        })
    }, []), Y = O11.useCallback(() => {
        q({
            type: "prev-question"
        })
    }, []), z = O11.useCallback(($, O, _) => {
        q({
            type: "update-question-state",
            questionText: $,
            updates: O,
            isMultiSelect: _
        })
    }, []), w = O11.useCallback(($, O, _ = !0) => {
        q({
            type: "set-answer",
            questionText: $,
            answer: O,
            shouldAdvance: _
        })
    }, []), H = O11.useCallback(($) => {
        q({
            type: "set-text-input-mode",
            isInInput: $
        })
    }, []);
    return {
        currentQuestionIndex: A.currentQuestionIndex,
        answers: A.answers,
        questionStates: A.questionStates,
        isInTextInput: A.isInTextInput,
        nextQuestion: K,
        prevQuestion: Y,
        updateQuestionState: z,
        setAnswer: w,
        setTextInputMode: H
    }
}
// @from(Ln 469462, Col 4)
O11
// @from(Ln 469462, Col 9)
XDz
// @from(Ln 469463, Col 4)
KWq = v(() => {
    O11 = o(X1(), 1);
    XDz = {
        currentQuestionIndex: 0,
        answers: {},
        questionStates: {},
        isInTextInput: !1
    }
})
// @from(Ln 469473, Col 0)
function Sv6(A) {
    let q = e(39),
        {
            questions: K,
            currentQuestionIndex: Y,
            answers: z,
            hideSubmitTab: w
        } = A,
        H = w === void 0 ? !1 : w,
        {
            columns: $
        } = Z8(),
        O;
    if (q[0] !== $ || q[1] !== Y || q[2] !== H || q[3] !== K) {
        A: {
            let W = H ? "" : ` ${l1.tick} Submit `,
                G = UA("← ") + UA(" →") + UA(W),
                f = $ - G;
            if (f <= 0) {
                let U;
                if (q[5] !== Y || q[6] !== K) {
                    let x;
                    if (q[8] !== Y) x = (p, l) => {
                        let r = p?.header || `Q${l+1}`;
                        return l === Y ? r.slice(0, 3) : ""
                    }, q[8] = Y, q[9] = x;
                    else x = q[9];
                    U = K.map(x), q[5] = Y, q[6] = K, q[7] = U
                } else U = q[7];
                O = U;
                break A
            }
            let Z = K.map(MDz);
            if (Z.map(jDz).reduce(DDz, 0) <= f) {
                O = Z;
                break A
            }
            let k = Z[Y] || "",
                y = 4 + UA(k),
                B = Math.min(y, f / 2),
                S = f - B,
                m = K.length - 1,
                b = Math.max(6, Math.floor(S / Math.max(m, 1))),
                g;
            if (q[10] !== Y || q[11] !== B || q[12] !== b) g = (U, x) => {
                if (x === Y) {
                    let p = B - 2 - 2;
                    return K3(U, p)
                } else {
                    let p = b - 2 - 2;
                    return K3(U, p)
                }
            },
            q[10] = Y,
            q[11] = B,
            q[12] = b,
            q[13] = g;
            else g = q[13];O = Z.map(g)
        }
        q[0] = $,
        q[1] = Y,
        q[2] = H,
        q[3] = K,
        q[4] = O
    }
    else O = q[4];
    let _ = O,
        J = K.length === 1 && H,
        X;
    if (q[14] !== Y || q[15] !== J) X = !J && fF.default.createElement(V, {
        color: Y === 0 ? "inactive" : void 0
    }, "←", " "), q[14] = Y, q[15] = J, q[16] = X;
    else X = q[16];
    let D;
    if (q[17] !== z || q[18] !== Y || q[19] !== K || q[20] !== _) {
        let W;
        if (q[22] !== z || q[23] !== Y || q[24] !== _) W = (G, f) => {
            let Z = f === Y,
                T = G?.question && !!z[G.question] ? l1.checkboxOn : l1.checkboxOff,
                k = _[f] || G?.header || `Q${f+1}`;
            return fF.default.createElement(I, {
                key: G?.question || `question-${f}`
            }, Z ? fF.default.createElement(V, {
                backgroundColor: "permission",
                color: "inverseText"
            }, " ", T, " ", k, " ") : fF.default.createElement(V, null, " ", T, " ", k, " "))
        }, q[22] = z, q[23] = Y, q[24] = _, q[25] = W;
        else W = q[25];
        D = K.map(W), q[17] = z, q[18] = Y, q[19] = K, q[20] = _, q[21] = D
    } else D = q[21];
    let j;
    if (q[26] !== Y || q[27] !== H || q[28] !== K.length) j = !H && fF.default.createElement(I, {
        key: "submit"
    }, Y === K.length ? fF.default.createElement(V, {
        backgroundColor: "permission",
        color: "inverseText"
    }, " ", l1.tick, " Submit", " ") : fF.default.createElement(V, null, " ", l1.tick, " Submit ")), q[26] = Y, q[27] = H, q[28] = K.length, q[29] = j;
    else j = q[29];
    let M;
    if (q[30] !== Y || q[31] !== J || q[32] !== K.length) M = !J && fF.default.createElement(V, {
        color: Y === K.length ? "inactive" : void 0
    }, " ", "→"), q[30] = Y, q[31] = J, q[32] = K.length, q[33] = M;
    else M = q[33];
    let P;
    if (q[34] !== X || q[35] !== D || q[36] !== j || q[37] !== M) P = fF.default.createElement(I, {
        flexDirection: "row",
        marginBottom: 1
    }, X, D, j, M), q[34] = X, q[35] = D, q[36] = j, q[37] = M, q[38] = P;
    else P = q[38];
    return P
}
// @from(Ln 469585, Col 0)
function DDz(A, q) {
    return A + q
}
// @from(Ln 469589, Col 0)
function jDz(A) {
    return 4 + UA(A)
}
// @from(Ln 469593, Col 0)
function MDz(A, q) {
    return A?.header || `Q${q+1}`
}
// @from(Ln 469596, Col 4)
fF
// @from(Ln 469597, Col 4)
wgA = v(() => {
    i1();
    b7();
    m1();
    mq();
    LY();
    vq();
    fF = o(X1(), 1)
})
// @from(Ln 469607, Col 0)
function YWq(A) {
    let q = e(95),
        {
            question: K,
            questions: Y,
            currentQuestionIndex: z,
            answers: w,
            questionStates: H,
            hideSubmitTab: $,
            planFilePath: O,
            onUpdateQuestionState: _,
            onAnswer: J,
            onTextInputFocus: X,
            onCancel: D,
            onSubmit: j,
            onRespondToClaude: M,
            onFinishPlanInterview: P,
            onImagePaste: W,
            pastedContents: G,
            onRemoveImage: f
        } = A,
        Z = $ === void 0 ? !1 : $,
        N = v6(GDz) === "plan",
        [T, k] = tY.useState(!1),
        [y, B] = tY.useState(0),
        [S, m] = tY.useState(!1),
        b;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let B1 = FI();
        b = B1 ? S_(B1) : null, q[0] = b
    } else b = q[0];
    let g = b,
        U;
    if (q[1] !== X) U = (B1) => {
        let A6 = B1 === "__other__";
        m(A6), X(A6)
    }, q[1] = X, q[2] = U;
    else U = q[2];
    let x = U,
        p;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) p = () => {
        k(!0)
    }, q[3] = p;
    else p = q[3];
    let l = p,
        r;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) r = () => {
        k(!1)
    }, q[4] = r;
    else r = q[4];
    let s = r,
        O1;
    if (q[5] !== y || q[6] !== T || q[7] !== N || q[8] !== D || q[9] !== P || q[10] !== M) O1 = (B1, A6) => {
        if (!T) return;
        if (A6.upArrow || A6.ctrl && B1 === "p") {
            if (y === 0) s();
            else B(0);
            return
        }
        if (A6.downArrow || A6.ctrl && B1 === "n") {
            if (N && y === 0) B(1);
            return
        }
        if (A6.return) {
            if (y === 0) M();
            else P();
            return
        }
        if (A6.escape) D()
    }, q[5] = y, q[6] = T, q[7] = N, q[8] = D, q[9] = P, q[10] = M, q[11] = O1;
    else O1 = q[11];
    let T1;
    if (q[12] !== T) T1 = {
        isActive: T
    }, q[12] = T, q[13] = T1;
    else T1 = q[13];
    D8(O1, T1);
    let N1, j1, q1;
    if (q[14] !== _ || q[15] !== K || q[16] !== H) {
        let B1 = K.options.map(WDz);
        j1 = K.question;
        let A6 = H[j1],
            O6;
        if (q[20] !== _ || q[21] !== K.multiSelect || q[22] !== j1) O6 = (j6, M6) => {
            let N6 = Ef1(j6);
            if (N6.content !== null && N6.content !== j6) M6(N6.content), _(j1, {
                textInputValue: N6.content
            }, K.multiSelect ?? !1)
        }, q[20] = _, q[21] = K.multiSelect, q[22] = j1, q[23] = O6;
        else O6 = q[23];
        N1 = O6;
        let P6 = K.multiSelect ? "Type something" : "Type something.",
            V6 = A6?.textInputValue ?? "",
            q6;
        if (q[24] !== _ || q[25] !== K.multiSelect || q[26] !== j1) q6 = (j6) => {
            _(j1, {
                textInputValue: j6
            }, K.multiSelect ?? !1)
        }, q[24] = _, q[25] = K.multiSelect, q[26] = j1, q[27] = q6;
        else q6 = q[27];
        let p1;
        if (q[28] !== P6 || q[29] !== V6 || q[30] !== q6) p1 = {
            type: "input",
            value: "__other__",
            label: "Other",
            placeholder: P6,
            initialValue: V6,
            onChange: q6
        }, q[28] = P6, q[29] = V6, q[30] = q6, q[31] = p1;
        else p1 = q[31];
        let K6 = p1;
        q1 = [...B1, K6], q[14] = _, q[15] = K, q[16] = H, q[17] = N1, q[18] = j1, q[19] = q1
    } else N1 = q[17], j1 = q[18], q1 = q[19];
    let t = q1,
        J1;
    if (q[32] !== N || q[33] !== O) J1 = N && O && tY.default.createElement(I, {
        flexDirection: "column",
        gap: 0
    }, tY.default.createElement(CY, {
        dividerColor: "inactive"
    }), tY.default.createElement(V, {
        color: "inactive"
    }, "Planning: ", tY.default.createElement(AE, {
        filePath: O
    }))), q[32] = N, q[33] = O, q[34] = J1;
    else J1 = q[34];
    let D1;
    if (q[35] === Symbol.for("react.memo_cache_sentinel")) D1 = tY.default.createElement(CY, {
        dividerColor: "inactive",
        boxProps: {
            marginTop: -1
        }
    }), q[35] = D1;
    else D1 = q[35];
    let Z1;
    if (q[36] !== w || q[37] !== z || q[38] !== Z || q[39] !== Y) Z1 = tY.default.createElement(Sv6, {
        questions: Y,
        currentQuestionIndex: z,
        answers: w,
        hideSubmitTab: Z
    }), q[36] = w, q[37] = z, q[38] = Z, q[39] = Y, q[40] = Z1;
    else Z1 = q[40];
    let E1;
    if (q[41] !== K.question) E1 = tY.default.createElement(vM1, {
        title: K.question,
        color: "text"
    }), q[41] = K.question, q[42] = E1;
    else E1 = q[42];
    let a;
    if (q[43] !== z || q[44] !== x || q[45] !== N1 || q[46] !== T || q[47] !== J || q[48] !== D || q[49] !== W || q[50] !== f || q[51] !== j || q[52] !== _ || q[53] !== t || q[54] !== G || q[55] !== K.multiSelect || q[56] !== K.question || q[57] !== H || q[58] !== j1 || q[59] !== Y.length) a = tY.default.createElement(I, {
        marginTop: 1
    }, K.multiSelect ? tY.default.createElement(A_4, {
        key: K.question,
        options: t,
        defaultValue: H[K.question]?.selectedValue,
        onChange: (B1) => {
            _(j1, {
                selectedValue: B1
            }, !0);
            let A6 = B1.includes("__other__") ? H[j1]?.textInputValue : void 0,
                O6 = B1.filter(PDz).concat(A6 ? [A6] : []);
            J(j1, O6, void 0, !1)
        },
        onFocus: x,
        onCancel: D,
        submitButtonText: z === Y.length - 1 ? "Submit" : "Next",
        onSubmit: j,
        onDownFromLastItem: l,
        isDisabled: T,
        onOpenEditor: N1,
        onImagePaste: W,
        pastedContents: G,
        onRemoveImage: f
    }) : tY.default.createElement(kA, {
        key: K.question,
        options: t,
        defaultValue: H[K.question]?.selectedValue,
        onChange: (B1) => {
            _(j1, {
                selectedValue: B1
            }, !1);
            let A6 = B1 === "__other__" ? H[j1]?.textInputValue : void 0;
            J(j1, B1, A6)
        },
        onFocus: x,
        onCancel: D,
        onDownFromLastItem: l,
        isDisabled: T,
        layout: "compact-vertical",
        onOpenEditor: N1,
        onImagePaste: W,
        pastedContents: G,
        onRemoveImage: f
    })), q[43] = z, q[44] = x, q[45] = N1, q[46] = T, q[47] = J, q[48] = D, q[49] = W, q[50] = f, q[51] = j, q[52] = _, q[53] = t, q[54] = G, q[55] = K.multiSelect, q[56] = K.question, q[57] = H, q[58] = j1, q[59] = Y.length, q[60] = a;
    else a = q[60];
    let A1;
    if (q[61] === Symbol.for("react.memo_cache_sentinel")) A1 = tY.default.createElement(CY, {
        dividerColor: "inactive"
    }), q[61] = A1;
    else A1 = q[61];
    let M1;
    if (q[62] !== y || q[63] !== T) M1 = T && y === 0 ? tY.default.createElement(V, {
        color: "suggestion"
    }, l1.pointer) : tY.default.createElement(V, null, " "), q[62] = y, q[63] = T, q[64] = M1;
    else M1 = q[64];
    let z1 = T && y === 0 ? "suggestion" : void 0,
        Y1 = t.length + 1,
        _1;
    if (q[65] !== z1 || q[66] !== Y1) _1 = tY.default.createElement(V, {
        color: z1
    }, Y1, ". Chat about this"), q[65] = z1, q[66] = Y1, q[67] = _1;
    else _1 = q[67];
    let $1;
    if (q[68] !== M1 || q[69] !== _1) $1 = tY.default.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, M1, _1), q[68] = M1, q[69] = _1, q[70] = $1;
    else $1 = q[70];
    let G1;
    if (q[71] !== y || q[72] !== T || q[73] !== N || q[74] !== t.length) G1 = N && tY.default.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, T && y === 1 ? tY.default.createElement(V, {
        color: "suggestion"
    }, l1.pointer) : tY.default.createElement(V, null, " "), tY.default.createElement(V, {
        color: T && y === 1 ? "suggestion" : void 0
    }, t.length + 2, ". Skip interview and plan immediately")), q[71] = y, q[72] = T, q[73] = N, q[74] = t.length, q[75] = G1;
    else G1 = q[75];
    let L1;
    if (q[76] !== $1 || q[77] !== G1) L1 = tY.default.createElement(I, {
        flexDirection: "column"
    }, A1, $1, G1), q[76] = $1, q[77] = G1, q[78] = L1;
    else L1 = q[78];
    let x1;
    if (q[79] !== Y.length) x1 = Y.length === 1 ? tY.default.createElement(tY.default.Fragment, null, l1.arrowUp, "/", l1.arrowDown, " to navigate") : "Tab/Arrow keys to navigate", q[79] = Y.length, q[80] = x1;
    else x1 = q[80];
    let f1;
    if (q[81] !== S) f1 = S && g && tY.default.createElement(tY.default.Fragment, null, " · ctrl+g to edit in ", g), q[81] = S, q[82] = f1;
    else f1 = q[82];
    let R1;
    if (q[83] !== x1 || q[84] !== f1) R1 = tY.default.createElement(I, {
        marginTop: 1
    }, tY.default.createElement(V, {
        color: "inactive",
        dimColor: !0
    }, "Enter to select ·", " ", x1, f1, " ", "· Esc to cancel")), q[83] = x1, q[84] = f1, q[85] = R1;
    else R1 = q[85];
    let H1;
    if (q[86] !== Z1 || q[87] !== E1 || q[88] !== a || q[89] !== L1 || q[90] !== R1) H1 = tY.default.createElement(I, {
        flexDirection: "column",
        paddingTop: 0
    }, Z1, E1, a, L1, R1), q[86] = Z1, q[87] = E1, q[88] = a, q[89] = L1, q[90] = R1, q[91] = H1;
    else H1 = q[91];
    let y1;
    if (q[92] !== H1 || q[93] !== J1) y1 = tY.default.createElement(I, {
        flexDirection: "column",
        marginTop: 0
    }, J1, D1, H1), q[92] = H1, q[93] = J1, q[94] = y1;
    else y1 = q[94];
    return y1
}
// @from(Ln 469869, Col 0)
function PDz(A) {
    return A !== "__other__"
}
// @from(Ln 469873, Col 0)
function WDz(A) {
    return {
        type: "text",
        value: A.label,
        label: A.label,
        description: A.description
    }
}
// @from(Ln 469882, Col 0)
function GDz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 469885, Col 4)
tY
// @from(Ln 469886, Col 4)
zWq = v(() => {
    i1();
    b7();
    m1();
    wY();
    cX6();
    wgA();
    kW();
    d8();
    Cv6();
    YF();
    q$();
    fW1();
    tY = o(X1(), 1)
})
// @from(Ln 469902, Col 0)
function wWq(A) {
    let q = e(26),
        {
            questions: K,
            currentQuestionIndex: Y,
            answers: z,
            allQuestionsAnswered: w,
            permissionResult: H,
            onFinalResponse: $
        } = A,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = bj.default.createElement(CY, {
        dividerColor: "inactive"
    }), q[0] = O;
    else O = q[0];
    let _;
    if (q[1] !== z || q[2] !== Y || q[3] !== K) _ = bj.default.createElement(Sv6, {
        questions: K,
        currentQuestionIndex: Y,
        answers: z
    }), q[1] = z, q[2] = Y, q[3] = K, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = bj.default.createElement(vM1, {
        title: "Review your answers",
        color: "text"
    }), q[5] = J;
    else J = q[5];
    let X;
    if (q[6] !== w) X = !w && bj.default.createElement(I, {
        marginBottom: 1
    }, bj.default.createElement(V, {
        color: "warning"
    }, l1.warning, " You have not answered all questions")), q[6] = w, q[7] = X;
    else X = q[7];
    let D;
    if (q[8] !== z || q[9] !== K) D = Object.keys(z).length > 0 && bj.default.createElement(I, {
        flexDirection: "column",
        marginBottom: 1
    }, K.filter((N) => N?.question && z[N.question]).map((N) => {
        let T = z[N?.question];
        return bj.default.createElement(I, {
            key: N?.question || "answer",
            flexDirection: "column",
            marginLeft: 1
        }, bj.default.createElement(V, null, l1.bullet, " ", N?.question || "Question"), bj.default.createElement(I, {
            marginLeft: 2
        }, bj.default.createElement(V, {
            color: "success"
        }, l1.arrowRight, " ", T)))
    })), q[8] = z, q[9] = K, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== H) j = bj.default.createElement(mN, {
        permissionResult: H,
        toolType: "tool"
    }), q[11] = H, q[12] = j;
    else j = q[12];
    let M;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) M = bj.default.createElement(V, {
        color: "inactive"
    }, "Ready to submit your answers?"), q[13] = M;
    else M = q[13];
    let P;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) P = {
        type: "text",
        label: "Submit answers",
        value: "submit"
    }, q[14] = P;
    else P = q[14];
    let W;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) W = [P, {
        type: "text",
        label: "Cancel",
        value: "cancel"
    }], q[15] = W;
    else W = q[15];
    let G;
    if (q[16] !== $) G = bj.default.createElement(I, {
        marginTop: 1
    }, bj.default.createElement(kA, {
        options: W,
        onChange: (N) => $(N),
        onCancel: () => $("cancel")
    })), q[16] = $, q[17] = G;
    else G = q[17];
    let f;
    if (q[18] !== G || q[19] !== X || q[20] !== D || q[21] !== j) f = bj.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, X, D, j, M, G), q[18] = G, q[19] = X, q[20] = D, q[21] = j, q[22] = f;
    else f = q[22];
    let Z;
    if (q[23] !== f || q[24] !== _) Z = bj.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, O, bj.default.createElement(I, {
        flexDirection: "column",
        borderTop: !0,
        borderColor: "inactive",
        paddingTop: 0
    }, _, J, f)), q[23] = f, q[24] = _, q[25] = Z;
    else Z = q[25];
    return Z
}
// @from(Ln 470007, Col 4)
bj
// @from(Ln 470008, Col 4)
HWq = v(() => {
    i1();
    b7();
    m1();
    wY();
    cX6();
    $11();
    wgA();
    kW();
    bj = o(X1(), 1)
})
// @from(Ln 470020, Col 0)
function $Wq(A) {
    let q = e(89),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z
        } = A,
        w = dW1.inputSchema.safeParse(K.input),
        H = w.success ? w.data.questions || [] : [],
        $ = w.success ? w.data.metadata?.source : void 0,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = {}, q[0] = O;
    else O = q[0];
    let [_, J] = hv6.useState(O), X = hv6.useRef(0), D;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) D = function(_1, $1, G1, L1, x1, f1) {
        X.current = X.current + 1;
        let R1 = X.current,
            H1 = {
                id: R1,
                type: "image",
                content: $1,
                mediaType: G1 || "image/png",
                filename: L1 || "Pasted image",
                dimensions: x1
            };
        gD1(H1), setTimeout(() => Xq1(H1), 0), J((y1) => ({
            ...y1,
            [_1]: {
                ...y1[_1] ?? {},
                [R1]: H1
            }
        }))
    }, q[1] = D;
    else D = q[1];
    let j = D,
        M;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) M = (Y1, _1) => {
        J(($1) => {
            let G1 = {
                ...$1[Y1] ?? {}
            };
            return delete G1[_1], {
                ...$1,
                [Y1]: G1
            }
        })
    }, q[2] = M;
    else M = q[2];
    let P = M,
        W;
    if (q[3] !== _) W = Object.values(_).flatMap(TDz).filter(NDz), q[3] = _, q[4] = W;
    else W = q[4];
    let G = W,
        Z = v6(VDz) === "plan",
        N;
    if (q[5] !== Z) N = Z ? uW() : void 0, q[5] = Z, q[6] = N;
    else N = q[6];
    let T = N,
        k = qWq(),
        {
            currentQuestionIndex: y,
            answers: B,
            questionStates: S,
            isInTextInput: m,
            nextQuestion: b,
            prevQuestion: g,
            updateQuestionState: U,
            setAnswer: x,
            setTextInputMode: p
        } = k,
        l = y < (H?.length || 0) ? H?.[y] : null,
        r = y === (H?.length || 0),
        s = H?.every((Y1) => Y1?.question && !!B[Y1.question]) ?? !1,
        O1 = H.length === 1 && !H[0]?.multiSelect,
        T1;
    if (q[7] !== Z || q[8] !== $ || q[9] !== Y || q[10] !== z || q[11] !== H.length || q[12] !== K) T1 = () => {
        if ($) c("tengu_ask_user_question_rejected", {
            source: $,
            questionCount: H.length,
            isInPlanMode: Z,
            interviewPhaseEnabled: Z && sO()
        });
        Y(), z(), K.onReject()
    }, q[7] = Z, q[8] = $, q[9] = Y, q[10] = z, q[11] = H.length, q[12] = K, q[13] = T1;
    else T1 = q[13];
    let N1 = T1,
        j1;
    if (q[14] !== G || q[15] !== B || q[16] !== Z || q[17] !== $ || q[18] !== Y || q[19] !== H || q[20] !== K) j1 = async () => {
        let _1 = `The user wants to clarify these questions.
    This means they may have additional information, context or questions for you.
    Take their response into account and then reformulate the questions if appropriate.
    Start by asking them what they would like to clarify.

    Questions asked:
${H.map((G1)=>{let L1=B[G1.question];if(L1)return`- "${G1.question}"
  Answer: ${L1}`;return`- "${G1.question}"
  (No answer provided)`}).join(`
        `)}`;
        if ($) c("tengu_ask_user_question_respond_to_claude", {
            source: $,
            questionCount: H.length,
            isInPlanMode: Z,
            interviewPhaseEnabled: Z && sO()
        });
        let $1 = await HgA(G);
        Y(), K.onReject(_1, $1 && $1.length > 0 ? $1 : void 0)
    }, q[14] = G, q[15] = B, q[16] = Z, q[17] = $, q[18] = Y, q[19] = H, q[20] = K, q[21] = j1;
    else j1 = q[21];
    let q1 = j1,
        t;
    if (q[22] !== G || q[23] !== B || q[24] !== Z || q[25] !== $ || q[26] !== Y || q[27] !== H || q[28] !== K) t = async () => {
        let _1 = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${H.map((G1)=>{let L1=B[G1.question];if(L1)return`- "${G1.question}"
  Answer: ${L1}`;return`- "${G1.question}"
  (No answer provided)`}).join(`
        `)}`;
        if ($) c("tengu_ask_user_question_finish_plan_interview", {
            source: $,
            questionCount: H.length,
            isInPlanMode: Z,
            interviewPhaseEnabled: Z && sO()
        });
        let $1 = await HgA(G);
        Y(), K.onReject(_1, $1 && $1.length > 0 ? $1 : void 0)
    }, q[22] = G, q[23] = B, q[24] = Z, q[25] = $, q[26] = Y, q[27] = H, q[28] = K, q[29] = t;
    else t = q[29];
    let J1 = t,
        D1;
    if (q[30] !== G || q[31] !== Z || q[32] !== $ || q[33] !== Y || q[34] !== H.length || q[35] !== K) D1 = async (Y1) => {
        if ($) c("tengu_ask_user_question_accepted", {
            source: $,
            questionCount: H.length,
            answerCount: Object.keys(Y1).length,
            isInPlanMode: Z,
            interviewPhaseEnabled: Z && sO()
        });
        let _1 = {
                ...K.input,
                answers: Y1
            },
            $1 = await HgA(G);
        Y(), K.onAllow(_1, [], void 0, $1 && $1.length > 0 ? $1 : void 0)
    }, q[30] = G, q[31] = Z, q[32] = $, q[33] = Y, q[34] = H.length, q[35] = K, q[36] = D1;
    else D1 = q[36];
    let Z1 = D1,
        E1;
    if (q[37] !== B || q[38] !== _ || q[39] !== H.length || q[40] !== x || q[41] !== Z1) E1 = (Y1, _1, $1, G1) => {
        let L1 = G1 === void 0 ? !0 : G1,
            x1, f1 = Array.isArray(_1);
        if (f1) x1 = _1.join(", ");
        else if ($1) x1 = Object.values(_[Y1] ?? {}).filter(fDz).length > 0 ? `${$1} (Image attached)` : $1;
        else if (_1 === "__other__") x1 = Object.values(_[Y1] ?? {}).filter(ZDz).length > 0 ? "(Image attached)" : _1;
        else x1 = _1;
        let R1 = H.length === 1;
        if (!f1 && R1 && L1) {
            let H1 = {
                ...B,
                [Y1]: x1
            };
            Z1(H1).catch(K1);
            return
        }
        x(Y1, x1, L1)
    }, q[37] = B, q[38] = _, q[39] = H.length, q[40] = x, q[41] = Z1, q[42] = E1;
    else E1 = q[42];
    let a = E1,
        A1;
    if (q[43] !== B || q[44] !== N1 || q[45] !== Z1) A1 = function(_1) {
        if (_1 === "cancel") {
            N1();
            return
        }
        if (_1 === "submit") Z1(B).catch(K1)
    }, q[43] = B, q[44] = N1, q[45] = Z1, q[46] = A1;
    else A1 = q[46];
    let M1 = A1,
        z1;
    if (q[47] !== y || q[48] !== O1 || q[49] !== r || q[50] !== m || q[51] !== b || q[52] !== g || q[53] !== H.length) z1 = (Y1, _1) => {
        if (m && !r) return;
        if ((_1.leftArrow || _1.shift && _1.tab) && y > 0) g();
        let $1 = O1 ? (H?.length || 1) - 1 : H?.length || 0;
        if ((_1.rightArrow || _1.tab && !_1.shift) && y < $1) b()
    }, q[47] = y, q[48] = O1, q[49] = r, q[50] = m, q[51] = b, q[52] = g, q[53] = H.length, q[54] = z1;
    else z1 = q[54];
    if (D8(z1), l) {
        let Y1;
        if (q[55] !== l.question || q[56] !== j) Y1 = (L1, x1, f1, R1, H1) => j(l.question, L1, x1, f1, R1, H1), q[55] = l.question, q[56] = j, q[57] = Y1;
        else Y1 = q[57];
        let _1;
        if (q[58] !== l.question || q[59] !== _) _1 = _[l.question] ?? {}, q[58] = l.question, q[59] = _, q[60] = _1;
        else _1 = q[60];
        let $1;
        if (q[61] !== l.question || q[62] !== P) $1 = (L1) => P(l.question, L1), q[61] = l.question, q[62] = P, q[63] = $1;
        else $1 = q[63];
        let G1;
        if (q[64] !== B || q[65] !== l || q[66] !== y || q[67] !== N1 || q[68] !== J1 || q[69] !== a || q[70] !== q1 || q[71] !== O1 || q[72] !== b || q[73] !== T || q[74] !== S || q[75] !== H || q[76] !== p || q[77] !== Y1 || q[78] !== _1 || q[79] !== $1 || q[80] !== U) G1 = $gA.default.createElement(YWq, {
            question: l,
            questions: H,
            currentQuestionIndex: y,
            answers: B,
            questionStates: S,
            hideSubmitTab: O1,
            planFilePath: T,
            onUpdateQuestionState: U,
            onAnswer: a,
            onTextInputFocus: p,
            onCancel: N1,
            onSubmit: b,
            onRespondToClaude: q1,
            onFinishPlanInterview: J1,
            onImagePaste: Y1,
            pastedContents: _1,
            onRemoveImage: $1
        }), q[64] = B, q[65] = l, q[66] = y, q[67] = N1, q[68] = J1, q[69] = a, q[70] = q1, q[71] = O1, q[72] = b, q[73] = T, q[74] = S, q[75] = H, q[76] = p, q[77] = Y1, q[78] = _1, q[79] = $1, q[80] = U, q[81] = G1;
        else G1 = q[81];
        return G1
    }
    if (r) {
        let Y1;
        if (q[82] !== s || q[83] !== B || q[84] !== y || q[85] !== M1 || q[86] !== H || q[87] !== K.permissionResult) Y1 = $gA.default.createElement(wWq, {
            questions: H,
            currentQuestionIndex: y,
            answers: B,
            allQuestionsAnswered: s,
            permissionResult: K.permissionResult,
            onFinalResponse: M1
        }), q[82] = s, q[83] = B, q[84] = y, q[85] = M1, q[86] = H, q[87] = K.permissionResult, q[88] = Y1;
        else Y1 = q[88];
        return Y1
    }
    return null
}
// @from(Ln 470256, Col 0)
function ZDz(A) {
    return A.type === "image"
}
// @from(Ln 470260, Col 0)
function fDz(A) {
    return A.type === "image"
}
// @from(Ln 470264, Col 0)
function VDz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 470268, Col 0)
function NDz(A) {
    return A.type === "image"
}
// @from(Ln 470272, Col 0)
function TDz(A) {
    return Object.values(A)
}
// @from(Ln 470275, Col 0)
async function HgA(A) {
    if (A.length === 0) return;
    return Promise.all(A.map(async (q) => {
        let K = {
            type: "image",
            source: {
                type: "base64",
                media_type: q.mediaType || "image/png",
                data: q.content
            }
        };
        return (await Aq1(K)).block
    }))
}
// @from(Ln 470289, Col 4)
$gA
// @from(Ln 470289, Col 9)
hv6
// @from(Ln 470290, Col 4)
OWq = v(() => {
    i1();
    m1();
    RW6();
    KWq();
    zWq();
    HWq();
    u6();
    d8();
    mX();
    S51();
    dL();
    po();
    y6();
    $gA = o(X1(), 1), hv6 = o(X1(), 1)
})
// @from(Ln 470307, Col 0)
function vDz(A) {
    switch (A) {
        case sW:
            return ZPq;
        case vj:
            return gPq;
        case qq:
            return uPq;
        case Vj:
            return cPq;
        case gd:
            return rPq;
        case Nj:
            return aPq;
        case kg1:
            return sPq;
        case wt:
            return ePq;
        case dW1:
            return $Wq;
        case WB:
        case tS:
        case i5:
            return pPq;
        default:
            return yv6
    }
}
// @from(Ln 470336, Col 0)
function EDz(A) {
    let q = A.tool.userFacingName(A.input);
    if (A.tool === Nj) return "Claude Code needs your approval for the plan";
    if (A.tool === kg1) return "Claude Code wants to enter plan mode";
    if (!q || q.trim() === "") return "Claude Code needs your attention";
    return `Claude needs your permission to use ${q}`
}
// @from(Ln 470344, Col 0)
function _Wq(A) {
    let q = e(17),
        {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: w,
            verbose: H,
            workerBadge: $
        } = A,
        O;
    if (q[0] !== z || q[1] !== w || q[2] !== K) O = () => {
        z(), w(), K.onReject()
    }, q[0] = z, q[1] = w, q[2] = K, q[3] = O;
    else O = q[3];
    let _;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Confirmation"
    }, q[4] = _;
    else _ = q[4];
    DA("app:interrupt", O, _);
    let J;
    if (q[5] !== K) J = EDz(K), q[5] = K, q[6] = J;
    else J = q[6];
    vc1(J, "permission_prompt");
    let D;
    if (q[7] !== K.tool) D = vDz(K.tool), q[7] = K.tool, q[8] = D;
    else D = q[8];
    let j = D,
        M;
    if (q[9] !== j || q[10] !== z || q[11] !== w || q[12] !== K || q[13] !== Y || q[14] !== H || q[15] !== $) M = OgA.createElement(j, {
        toolUseContext: Y,
        toolUseConfirm: K,
        onDone: z,
        onReject: w,
        verbose: H,
        workerBadge: $
    }), q[9] = j, q[10] = z, q[11] = w, q[12] = K, q[13] = Y, q[14] = H, q[15] = $, q[16] = M;
    else M = q[16];
    return M
}
// @from(Ln 470385, Col 4)
OgA
// @from(Ln 470386, Col 4)
JWq = v(() => {
    i1();
    K7();
    V51();
    Lt();
    i0();
    fPq();
    BPq();
    AgA();
    KgA();
    UPq();
    dPq();
    tQ1();
    cx1();
    $01();
    YE();
    gW1();
    lPq();
    oPq();
    Tg1();
    zgA();
    yRA();
    tPq();
    $P6();
    AWq();
    RW6();
    OWq();
    OgA = o(X1(), 1)
})
// @from(Ln 470415, Col 0)
async function XWq(A, q, K) {
    let Y = new Date,
        z = Y.toISOString(),
        w = -Y.getTimezoneOffset(),
        H = Math.floor(Math.abs(w) / 60),
        $ = Math.abs(w) % 60,
        _ = `${w>=0?"+":"-"}${String(H).padStart(2,"0")}:${String($).padStart(2,"0")}`,
        J = Y.toLocaleDateString("en-US", {
            weekday: "long"
        }),
        X = ["You are a date/time parser that converts natural language into ISO 8601 format.", "You MUST respond with ONLY the ISO 8601 formatted string, with no explanation or additional text.", "If the input is ambiguous, prefer future dates over past dates.", "For times without dates, use today's date.", "For dates without times, do not include a time component.", 'If the input is incomplete or you cannot confidently parse it into a valid date, respond with exactly "INVALID" (nothing else).', 'Examples of INVALID input: partial dates like "2025-01-", lone numbers like "13", gibberish.', 'Examples of valid natural language: "tomorrow", "next Monday", "jan 1st 2025", "in 2 hours", "yesterday".'],
        D = q === "date" ? "YYYY-MM-DD (date only, no time)" : `YYYY-MM-DDTHH:MM:SS${_} (full date-time with timezone)`,
        j = `Current context:
- Current date and time: ${z} (UTC)
- Local timezone: ${_}
- Day of week: ${J}

User input: "${A}"

Output format: ${D}

Parse the user's input into ISO 8601 format. Return ONLY the formatted string, or "INVALID" if the input is incomplete or unparseable.`;
    try {
        let P = (await SX({
            systemPrompt: X,
            userPrompt: j,
            signal: K,
            options: {
                querySource: "mcp_datetime_parse",
                agents: [],
                isNonInteractiveSession: !1,
                hasAppendSystemPrompt: !1,
                mcpTools: [],
                enablePromptCaching: !1
            }
        })).message.content.filter((W) => W.type === "text").map((W) => W.text).join("").trim();
        if (!P || P === "INVALID") return {
            success: !1,
            error: "Unable to parse date/time from input"
        };
        if (!/^\d{4}/.test(P)) return {
            success: !1,
            error: "Unable to parse date/time from input"
        };
        return {
            success: !0,
            value: P
        }
    } catch (M) {
        return K1(M instanceof Error ? M : Error(String(M))), {
            success: !1,
            error: "Unable to parse date/time. Please enter in ISO 8601 format manually."
        }
    }
}
// @from(Ln 470471, Col 0)
function DWq(A) {
    return /^\d{4}-\d{2}-\d{2}(T|$)/.test(A.trim())
}
// @from(Ln 470474, Col 4)
jWq = v(() => {
    yw();
    y6()
})
// @from(Ln 470479, Col 0)
function PY1(A) {
    return A.type === "array" && "items" in A && typeof A.items === "object" && A.items !== null && (("enum" in A.items) || ("anyOf" in A.items))
}
// @from(Ln 470483, Col 0)
function Cc1(A) {
    if ("anyOf" in A.items) return A.items.anyOf.map((q) => q.const);
    if ("enum" in A.items) return A.items.enum;
    return []
}
// @from(Ln 470489, Col 0)
function kDz(A) {
    if ("anyOf" in A.items) return A.items.anyOf.map((q) => q.title);
    if ("enum" in A.items) return A.items.enum;
    return []
}
// @from(Ln 470495, Col 0)
function Sc1(A, q) {
    let K = Cc1(A).indexOf(q);
    return K >= 0 ? kDz(A)[K] ?? q : q
}
// @from(Ln 470500, Col 0)
function _11(A) {
    if ("oneOf" in A) return A.oneOf.map((q) => q.const);
    if ("enum" in A) return A.enum;
    return []
}
// @from(Ln 470506, Col 0)
function LDz(A) {
    if ("oneOf" in A) return A.oneOf.map((q) => q.title);
    if ("enum" in A) return ("enumNames" in A ? A.enumNames : void 0) ?? A.enum;
    return []
}
// @from(Ln 470512, Col 0)
function kf1(A, q) {
    let K = _11(A).indexOf(q);
    return K >= 0 ? LDz(A)[K] ?? q : q
}
// @from(Ln 470517, Col 0)
function RDz(A) {
    if (VF(A)) {
        let [q, ...K] = _11(A);
        if (!q) return u.never();
        return u.enum([q, ...K])
    }
    if (A.type === "string") {
        let q = u.string();
        if (A.minLength !== void 0) q = q.min(A.minLength, {
            message: `Must be at least ${A.minLength} character${A.minLength===1?"":"s"}`
        });
        if (A.maxLength !== void 0) q = q.max(A.maxLength, {
            message: `Must be at most ${A.maxLength} character${A.maxLength===1?"":"s"}`
        });
        switch (A.format) {
            case "email":
                q = q.email({
                    message: "Must be a valid email address, e.g. user@example.com"
                });
                break;
            case "uri":
                q = q.url({
                    message: "Must be a valid URI, e.g. https://example.com"
                });
                break;
            case "date":
                q = q.date("Must be a valid date, e.g. 2024-03-15, today, next Monday");
                break;
            case "date-time":
                q = q.datetime({
                    offset: !0,
                    message: "Must be a valid date-time, e.g. 2024-03-15T14:30:00Z, tomorrow at 3pm"
                });
                break;
            default:
                break
        }
        return q
    }
    if (A.type === "number" || A.type === "integer") {
        let q = A.type === "integer" ? "an integer" : "a number",
            K = A.type === "integer",
            Y = (H) => Number.isInteger(H) && !K ? `${H}.0` : String(H),
            z = A.minimum !== void 0 && A.maximum !== void 0 ? `Must be ${q} between ${Y(A.minimum)} and ${Y(A.maximum)}` : A.minimum !== void 0 ? `Must be ${q} >= ${Y(A.minimum)}` : A.maximum !== void 0 ? `Must be ${q} <= ${Y(A.maximum)}` : `Must be ${q}`,
            w = u.coerce.number({
                error: z
            });
        if (A.type === "integer") w = w.int({
            message: z
        });
        if (A.minimum !== void 0) w = w.min(A.minimum, {
            message: z
        });
        if (A.maximum !== void 0) w = w.max(A.maximum, {
            message: z
        });
        return w
    }
    if (A.type === "boolean") return u.coerce.boolean();
    throw Error(`Unsupported schema: ${Q1(A)}`)
}
// @from(Ln 470579, Col 0)
function yc1(A, q) {
    let Y = RDz(q).safeParse(A);
    if (Y.success) return {
        value: Y.data,
        isValid: !0
    };
    return {
        isValid: !1,
        error: Y.error.issues.map((z) => z.message).join("; ")
    }
}
// @from(Ln 470591, Col 0)
function hc1(A) {
    return A.type === "string" && "format" in A && (A.format === "date" || A.format === "date-time")
}
// @from(Ln 470594, Col 0)
async function MWq(A, q, K) {
    let Y = yc1(A, q);
    if (Y.isValid) return Y;
    if (hc1(q) && !DWq(A)) {
        let z = await XWq(A, q.format, K);
        if (z.success) {
            let w = yc1(z.value, q);
            if (w.isValid) return w
        }
    }
    return Y
}
// @from(Ln 470606, Col 4)
VF = (A) => {
    return A.type === "string" && (("enum" in A) || ("oneOf" in A))
}
// @from(Ln 470609, Col 4)
PWq = v(() => {
    i7();
    m6();
    jWq()
})
// @from(Ln 470615, Col 0)
function yDz(A, q) {
    try {
        let K = new Date(A);
        if (Number.isNaN(K.getTime())) return A;
        if (("format" in q ? q.format : void 0) === "date-time") return K.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        });
        let z = A.split("-");
        if (z.length === 3) return new Date(Number(z[0]), Number(z[1]) - 1, Number(z[2])).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
        return A
    } catch {
        return A
    }
}
// @from(Ln 470641, Col 0)
function WWq(A) {
    let q = e(6),
        {
            event: K,
            onResponse: Y
        } = A;
    if (K.params.mode === "url") {
        let w;
        if (q[0] !== K || q[1] !== Y) w = j7.default.createElement(SDz, {
            event: K,
            onResponse: Y
        }), q[0] = K, q[1] = Y, q[2] = w;
        else w = q[2];
        return w
    }
    let z;
    if (q[3] !== K || q[4] !== Y) z = j7.default.createElement(CDz, {
        event: K,
        onResponse: Y
    }), q[3] = K, q[4] = Y, q[5] = z;
    else z = q[5];
    return z
}