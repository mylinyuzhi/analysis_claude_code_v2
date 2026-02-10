
// @from(Ln 465034, Col 0)
function MPq({
    onChange: A,
    toolUseContext: q,
    filePath: K,
    edits: Y,
    editMode: z
}) {
    let w = Qc.useRef(!1),
        [H, $] = Qc.useState(!1),
        O = Qc.useMemo(() => nJz().slice(0, 6), []),
        _ = Qc.useMemo(() => `✻ [Claude Code] ${rJz(K)} (${O}) ⧉`, [K, O]),
        J = N$6(q.options.mcpClients) && f6().diffTool === "auto" && !K.endsWith(".ipynb"),
        X = T$6(q.options.mcpClients) ?? "IDE";
    async function D() {
        if (!J) return;
        try {
            c("tengu_ext_will_show_diff", {});
            let {
                oldContent: j,
                newContent: M
            } = await aJz(K, Y, q, _);
            if (w.current) return;
            c("tengu_ext_diff_accepted", {});
            let P = oJz(K, j, M, z);
            if (P.length === 0) {
                c("tengu_ext_diff_rejected", {});
                let W = iV(q.options.mcpClients);
                if (W) await aQA(_, W);
                A({
                    type: "reject"
                }, {
                    file_path: K,
                    edits: Y
                });
                return
            }
            A({
                type: "accept-once"
            }, {
                file_path: K,
                edits: P
            })
        } catch (j) {
            K1(j), $(!0)
        }
    }
    return Qc.useEffect(() => {
        return D(), () => {
            w.current = !0
        }
    }, []), {
        closeTabInIDE() {
            let j = iV(q.options.mcpClients);
            if (!j) return Promise.resolve();
            return aQA(_, j)
        },
        showingDiffInIDE: J && !H,
        ideName: X,
        hasError: H
    }
}
// @from(Ln 465096, Col 0)
function oJz(A, q, K, Y) {
    let z = Y === "single",
        w = yR7({
            filePath: A,
            oldContent: q,
            newContent: K,
            singleHunk: z
        });
    if (w.length === 0) return [];
    if (z && w.length > 1) K1(Error(`Unexpected number of hunks: ${w.length}. Expected 1 hunk.`));
    return Vp7(w)
}
// @from(Ln 465108, Col 0)
async function aJz(A, q, K, Y) {
    let z = !1,
        w = b1(),
        H = g4(A),
        $ = w.existsSync(H) ? $J(H) : "";
    async function O() {
        if (z) return;
        z = !0;
        try {
            await aQA(Y, _)
        } catch (J) {
            K1(J)
        }
        process.off("beforeExit", O), K.abortController.signal.removeEventListener("abort", O)
    }
    K.abortController.signal.addEventListener("abort", O), process.on("beforeExit", O);
    let _ = iV(K.options.mcpClients);
    try {
        let {
            updatedFile: J
        } = tu1({
            filePath: H,
            fileContents: $,
            edits: q
        });
        if (!_ || _.type !== "connected") throw Error("IDE client not available");
        let X = H,
            D = _.config.ideRunningInWindows === !0;
        if (eA() === "wsl" && D && process.env.WSL_DISTRO_NAME) X = new g01(process.env.WSL_DISTRO_NAME).toIDEPath(H);
        let j = await _h("openDiff", {
                old_file_path: X,
                new_file_path: X,
                new_file_contents: J,
                tab_name: Y
            }, _),
            M = Array.isArray(j) ? j : [j];
        if (eJz(M)) return O(), {
            oldContent: $,
            newContent: M[1].text
        };
        else if (sJz(M)) return O(), {
            oldContent: $,
            newContent: J
        };
        else if (tJz(M)) return O(), {
            oldContent: $,
            newContent: $
        };
        throw Error("Not accepted")
    } catch (J) {
        throw K1(J), O(), J
    }
}
// @from(Ln 465161, Col 0)
async function aQA(A, q) {
    try {
        if (!q || q.type !== "connected") throw Error("IDE client not available");
        await _h("close_tab", {
            tab_name: A
        }, q)
    } catch (K) {
        K1(K)
    }
}
// @from(Ln 465172, Col 0)
function sJz(A) {
    return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "TAB_CLOSED"
}
// @from(Ln 465176, Col 0)
function tJz(A) {
    return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "DIFF_REJECTED"
}
// @from(Ln 465180, Col 0)
function eJz(A) {
    return Array.isArray(A) && A[0]?.type === "text" && A[0].text === "FILE_SAVED" && typeof A[1].text === "string"
}
// @from(Ln 465183, Col 4)
Qc
// @from(Ln 465184, Col 4)
PPq = v(() => {
    _8();
    WK1();
    wp();
    y6();
    cA();
    q$();
    u6();
    q$();
    Ez();
    HXA();
    x3();
    wq();
    Qc = o(X1(), 1)
})
// @from(Ln 465204, Col 0)
function WPq(A) {
    let q = e(37),
        {
            onChange: K,
            options: Y,
            input: z,
            filePath: w,
            ideName: H,
            symlinkTarget: $,
            rejectFeedback: O,
            acceptFeedback: _,
            setFocusedOption: J,
            onInputModeToggle: X,
            focusedOption: D,
            yesInputMode: j,
            noInputMode: M
        } = A,
        P;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) P = IE.default.createElement(CY, {
        dividerColor: "permission"
    }), q[0] = P;
    else P = q[0];
    let W;
    if (q[1] !== H) W = IE.default.createElement(V, {
        bold: !0,
        color: "permission"
    }, "Opened changes in ", H, " ⧉"), q[1] = H, q[2] = W;
    else W = q[2];
    let G;
    if (q[3] !== $) G = $ && IE.default.createElement(V, {
        color: "warning"
    }, qXz(h6(), $).startsWith("..") ? `This will modify ${$} (outside working directory) via a symlink` : `Symlink target: ${$}`), q[3] = $, q[4] = G;
    else G = q[4];
    let f;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) f = Qb1() && IE.default.createElement(V, {
        dimColor: !0
    }, "Save file to continue…"), q[5] = f;
    else f = q[5];
    let Z;
    if (q[6] !== w) Z = AXz(w), q[6] = w, q[7] = Z;
    else Z = q[7];
    let N;
    if (q[8] !== Z) N = IE.default.createElement(V, null, "Do you want to make this edit to", " ", IE.default.createElement(V, {
        bold: !0
    }, Z), "?"), q[8] = Z, q[9] = N;
    else N = q[9];
    let T;
    if (q[10] !== _ || q[11] !== z || q[12] !== K || q[13] !== Y || q[14] !== O) T = (U) => {
        let x = Y.find((p) => p.value === U);
        if (x) {
            if (x.option.type === "reject") {
                let p = O.trim();
                K(x.option, z, p || void 0);
                return
            }
            if (x.option.type === "accept-once") {
                let p = _.trim();
                K(x.option, z, p || void 0);
                return
            }
            K(x.option, z)
        }
    }, q[10] = _, q[11] = z, q[12] = K, q[13] = Y, q[14] = O, q[15] = T;
    else T = q[15];
    let k;
    if (q[16] !== z || q[17] !== K) k = () => K({
        type: "reject"
    }, z), q[16] = z, q[17] = K, q[18] = k;
    else k = q[18];
    let y;
    if (q[19] !== J) y = (U) => J(U), q[19] = J, q[20] = y;
    else y = q[20];
    let B;
    if (q[21] !== X || q[22] !== Y || q[23] !== T || q[24] !== k || q[25] !== y) B = IE.default.createElement(kA, {
        options: Y,
        inlineDescriptions: !0,
        onChange: T,
        onCancel: k,
        onFocus: y,
        onInputModeToggle: X
    }), q[21] = X, q[22] = Y, q[23] = T, q[24] = k, q[25] = y, q[26] = B;
    else B = q[26];
    let S;
    if (q[27] !== B || q[28] !== N) S = IE.default.createElement(I, {
        flexDirection: "column"
    }, N, B), q[27] = B, q[28] = N, q[29] = S;
    else S = q[29];
    let m = (D === "yes" && !j || D === "no" && !M) && " · Tab to amend",
        b;
    if (q[30] !== m) b = IE.default.createElement(I, {
        marginTop: 1
    }, IE.default.createElement(V, {
        dimColor: !0
    }, "Esc to cancel", m)), q[30] = m, q[31] = b;
    else b = q[31];
    let g;
    if (q[32] !== S || q[33] !== b || q[34] !== W || q[35] !== G) g = IE.default.createElement(I, {
        flexDirection: "column"
    }, P, IE.default.createElement(I, {
        marginX: 1,
        flexDirection: "column",
        gap: 1
    }, W, G, f, S, b)), q[32] = S, q[33] = b, q[34] = W, q[35] = G, q[36] = g;
    else g = q[36];
    return g
}
// @from(Ln 465310, Col 4)
IE
// @from(Ln 465311, Col 4)
GPq = v(() => {
    i1();
    m1();
    wY();
    q$();
    kW();
    N7();
    IE = o(X1(), 1)
})
// @from(Ln 465324, Col 0)
function ZF(A) {
    let q = e(79),
        {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: w,
            title: H,
            subtitle: $,
            question: O,
            content: _,
            completionType: J,
            languageName: X,
            path: D,
            parseInput: j,
            operationType: M,
            ideDiffSupport: P,
            workerBadge: W
        } = A,
        G = O === void 0 ? "Do you want to proceed?" : O,
        f = J === void 0 ? "tool_use_single" : J,
        Z = X === void 0 ? "none" : X,
        N = M === void 0 ? "write" : M,
        T;
    if (q[0] !== f || q[1] !== Z) T = {
        completion_type: f,
        language_name: Z
    }, q[0] = f, q[1] = Z, q[2] = T;
    else T = q[2];
    Ny(K, T);
    let y;
    A: {
        if (!D || N === "read") {
            y = null;
            break A
        }
        let B1;
        if (q[3] !== D) {
            let P6 = g4(D),
                V6 = b1();
            B1 = QH(V6, P6), q[3] = D, q[4] = B1
        } else B1 = q[4];
        let {
            resolvedPath: A6,
            isSymlink: O6
        } = B1;
        if (O6) {
            y = A6;
            break A
        }
        y = null
    }
    let B = y,
        S = D || "",
        m;
    if (q[5] !== f || q[6] !== Z || q[7] !== z || q[8] !== w || q[9] !== N || q[10] !== j || q[11] !== S || q[12] !== K) m = {
        filePath: S,
        completionType: f,
        languageName: Z,
        toolUseConfirm: K,
        onDone: z,
        onReject: w,
        parseInput: j,
        operationType: N
    }, q[5] = f, q[6] = Z, q[7] = z, q[8] = w, q[9] = N, q[10] = j, q[11] = S, q[12] = K, q[13] = m;
    else m = q[13];
    let b = DPq(m),
        {
            options: g,
            acceptFeedback: U,
            rejectFeedback: x,
            setFocusedOption: p,
            handleInputModeToggle: l,
            focusedOption: r,
            yesInputMode: s,
            noInputMode: O1
        } = b,
        T1, N1, j1;
    if (q[14] !== b || q[15] !== P || q[16] !== j || q[17] !== K.input || q[18] !== Y) N1 = j(K.input), T1 = P ? P.getConfig(N1) : null, j1 = T1 ? {
        onChange: (B1, A6) => {
            let O6 = P.applyChanges(N1, A6.edits);
            b.onChange(B1, O6)
        },
        toolUseContext: Y,
        filePath: T1.filePath,
        edits: (T1.edits || []).map(zXz),
        editMode: T1.editMode || "single"
    } : {
        onChange: YXz,
        toolUseContext: Y,
        filePath: "",
        edits: [],
        editMode: "single"
    }, q[14] = b, q[15] = P, q[16] = j, q[17] = K.input, q[18] = Y, q[19] = T1, q[20] = N1, q[21] = j1;
    else T1 = q[19], N1 = q[20], j1 = q[21];
    let q1 = j1,
        {
            closeTabInIDE: t,
            showingDiffInIDE: J1,
            ideName: D1
        } = MPq(q1),
        Z1;
    if (q[22] !== t || q[23] !== b || q[24] !== N1) Z1 = (B1, A6) => {
        t?.(), b.onChange(B1, N1, A6?.trim())
    }, q[22] = t, q[23] = b, q[24] = N1, q[25] = Z1;
    else Z1 = q[25];
    let E1 = Z1;
    if (J1 && T1 && D) {
        let B1;
        if (q[26] !== E1) B1 = (O6, P6, V6) => E1(O6, V6), q[26] = E1, q[27] = B1;
        else B1 = q[27];
        let A6;
        if (q[28] !== U || q[29] !== r || q[30] !== l || q[31] !== D1 || q[32] !== O1 || q[33] !== g || q[34] !== N1 || q[35] !== D || q[36] !== x || q[37] !== p || q[38] !== B || q[39] !== B1 || q[40] !== s) A6 = Ty.default.createElement(WPq, {
            onChange: B1,
            options: g,
            filePath: D,
            input: N1,
            ideName: D1,
            symlinkTarget: B,
            rejectFeedback: x,
            acceptFeedback: U,
            setFocusedOption: p,
            onInputModeToggle: l,
            focusedOption: r,
            yesInputMode: s,
            noInputMode: O1
        }), q[28] = U, q[29] = r, q[30] = l, q[31] = D1, q[32] = O1, q[33] = g, q[34] = N1, q[35] = D, q[36] = x, q[37] = p, q[38] = B, q[39] = B1, q[40] = s, q[41] = A6;
        else A6 = q[41];
        return A6
    }
    let a;
    if (q[42] !== B) a = B != null && KXz(h6(), B).startsWith(".."), q[42] = B, q[43] = a;
    else a = q[43];
    let A1 = a,
        M1;
    if (q[44] !== A1 || q[45] !== B) M1 = B ? Ty.default.createElement(I, {
        paddingX: 1,
        marginBottom: 1
    }, Ty.default.createElement(V, {
        color: "warning"
    }, A1 ? `This will modify ${B} (outside working directory) via a symlink` : `Symlink target: ${B}`)) : null, q[44] = A1, q[45] = B, q[46] = M1;
    else M1 = q[46];
    let z1 = M1,
        Y1;
    if (q[47] !== G) Y1 = typeof G === "string" ? Ty.default.createElement(V, null, G) : G, q[47] = G, q[48] = Y1;
    else Y1 = q[48];
    let _1;
    if (q[49] !== U || q[50] !== E1 || q[51] !== g || q[52] !== x) _1 = (B1) => {
        let A6 = g.find((O6) => O6.value === B1);
        if (A6) {
            if (A6.option.type === "reject") {
                let O6 = x.trim();
                E1(A6.option, O6 || void 0);
                return
            }
            if (A6.option.type === "accept-once") {
                let O6 = U.trim();
                E1(A6.option, O6 || void 0);
                return
            }
            E1(A6.option)
        }
    }, q[49] = U, q[50] = E1, q[51] = g, q[52] = x, q[53] = _1;
    else _1 = q[53];
    let $1;
    if (q[54] !== E1) $1 = () => E1({
        type: "reject"
    }), q[54] = E1, q[55] = $1;
    else $1 = q[55];
    let G1;
    if (q[56] !== p) G1 = (B1) => p(B1), q[56] = p, q[57] = G1;
    else G1 = q[57];
    let L1;
    if (q[58] !== l || q[59] !== g || q[60] !== _1 || q[61] !== $1 || q[62] !== G1) L1 = Ty.default.createElement(kA, {
        options: g,
        inlineDescriptions: !0,
        onChange: _1,
        onCancel: $1,
        onFocus: G1,
        onInputModeToggle: l
    }), q[58] = l, q[59] = g, q[60] = _1, q[61] = $1, q[62] = G1, q[63] = L1;
    else L1 = q[63];
    let x1;
    if (q[64] !== Y1 || q[65] !== L1) x1 = Ty.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1
    }, Y1, L1), q[64] = Y1, q[65] = L1, q[66] = x1;
    else x1 = q[66];
    let f1;
    if (q[67] !== _ || q[68] !== $ || q[69] !== z1 || q[70] !== x1 || q[71] !== H || q[72] !== W) f1 = Ty.default.createElement(Bw, {
        title: H,
        subtitle: $,
        innerPaddingX: 0,
        workerBadge: W
    }, z1, _, x1), q[67] = _, q[68] = $, q[69] = z1, q[70] = x1, q[71] = H, q[72] = W, q[73] = f1;
    else f1 = q[73];
    let R1 = (r === "yes" && !s || r === "no" && !O1) && " · Tab to amend",
        H1;
    if (q[74] !== R1) H1 = Ty.default.createElement(I, {
        paddingX: 1,
        marginTop: 1
    }, Ty.default.createElement(V, {
        dimColor: !0
    }, "Esc to cancel", R1)), q[74] = R1, q[75] = H1;
    else H1 = q[75];
    let y1;
    if (q[76] !== f1 || q[77] !== H1) y1 = Ty.default.createElement(Ty.default.Fragment, null, f1, H1), q[76] = f1, q[77] = H1, q[78] = y1;
    else y1 = q[78];
    return y1
}
// @from(Ln 465535, Col 0)
function YXz() {}
// @from(Ln 465537, Col 0)
function zXz(A) {
    return {
        old_string: A.old_string,
        new_string: A.new_string,
        replace_all: A.replace_all || !1
    }
}
// @from(Ln 465544, Col 4)
Ty
// @from(Ln 465545, Col 4)
Nf1 = v(() => {
    i1();
    m1();
    wY();
    Bv();
    jY1();
    jPq();
    PPq();
    GPq();
    _8();
    N7();
    Ez();
    Ty = o(X1(), 1)
})
// @from(Ln 465560, Col 0)
function Lv6(A, q, K, Y) {
    return {
        filePath: A,
        edits: [{
            old_string: q,
            new_string: K,
            replace_all: Y
        }],
        editMode: "single"
    }
}
// @from(Ln 465578, Col 0)
function ZPq(A) {
    let q = e(54),
        K = OXz,
        Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G, f, Z, N;
    if (q[0] !== A.onDone || q[1] !== A.onReject || q[2] !== A.toolUseConfirm || q[3] !== A.toolUseContext || q[4] !== A.workerBadge)({
        file_path: H,
        old_string: O,
        new_string: $,
        replace_all: _
    } = K(A.toolUseConfirm.input)), w = ZF, P = A.toolUseConfirm, W = A.toolUseContext, G = A.onDone, f = A.onReject, Z = A.workerBadge, N = "Edit file", D = HXz(h6(), H), z = V, j = "Do you want to make this edit to", M = " ", Y = V, J = !0, X = wXz(H), q[0] = A.onDone, q[1] = A.onReject, q[2] = A.toolUseConfirm, q[3] = A.toolUseContext, q[4] = A.workerBadge, q[5] = Y, q[6] = z, q[7] = w, q[8] = H, q[9] = $, q[10] = O, q[11] = _, q[12] = J, q[13] = X, q[14] = D, q[15] = j, q[16] = M, q[17] = P, q[18] = W, q[19] = G, q[20] = f, q[21] = Z, q[22] = N;
    else Y = q[5], z = q[6], w = q[7], H = q[8], $ = q[9], O = q[10], _ = q[11], J = q[12], X = q[13], D = q[14], j = q[15], M = q[16], P = q[17], W = q[18], G = q[19], f = q[20], Z = q[21], N = q[22];
    let T;
    if (q[23] !== Y || q[24] !== J || q[25] !== X) T = fc1.default.createElement(Y, {
        bold: J
    }, X), q[23] = Y, q[24] = J, q[25] = X, q[26] = T;
    else T = q[26];
    let k;
    if (q[27] !== z || q[28] !== T || q[29] !== j || q[30] !== M) k = fc1.default.createElement(z, null, j, M, T, "?"), q[27] = z, q[28] = T, q[29] = j, q[30] = M, q[31] = k;
    else k = q[31];
    let y = _ || !1,
        B;
    if (q[32] !== $ || q[33] !== O || q[34] !== y) B = [{
        old_string: O,
        new_string: $,
        replace_all: y
    }], q[32] = $, q[33] = O, q[34] = y, q[35] = B;
    else B = q[35];
    let S;
    if (q[36] !== H || q[37] !== B) S = fc1.default.createElement(kv6, {
        file_path: H,
        edits: B
    }), q[36] = H, q[37] = B, q[38] = S;
    else S = q[38];
    let m;
    if (q[39] !== H) m = ae(H), q[39] = H, q[40] = m;
    else m = q[40];
    let b;
    if (q[41] !== w || q[42] !== H || q[43] !== D || q[44] !== k || q[45] !== S || q[46] !== m || q[47] !== P || q[48] !== W || q[49] !== G || q[50] !== f || q[51] !== Z || q[52] !== N) b = fc1.default.createElement(w, {
        toolUseConfirm: P,
        toolUseContext: W,
        onDone: G,
        onReject: f,
        workerBadge: Z,
        title: N,
        subtitle: D,
        question: k,
        content: S,
        path: H,
        completionType: "str_replace_single",
        languageName: m,
        parseInput: K,
        ideDiffSupport: $Xz
    }), q[41] = w, q[42] = H, q[43] = D, q[44] = k, q[45] = S, q[46] = m, q[47] = P, q[48] = W, q[49] = G, q[50] = f, q[51] = Z, q[52] = N, q[53] = b;
    else b = q[53];
    return b
}
// @from(Ln 465635, Col 0)
function OXz(A) {
    return sW.inputSchema.parse(A)
}
// @from(Ln 465638, Col 4)
fc1
// @from(Ln 465638, Col 9)
$Xz
// @from(Ln 465639, Col 4)
fPq = v(() => {
    i1();
    m1();
    V51();
    rQA();
    wq();
    Nf1();
    N7();
    fc1 = o(X1(), 1), $Xz = {
        getConfig: (A) => Lv6(A.file_path, A.old_string, A.new_string, A.replace_all),
        applyChanges: (A, q) => {
            let K = q[0];
            if (K) return {
                ...A,
                old_string: K.old_string,
                new_string: K.new_string,
                replace_all: K.replace_all
            };
            return A
        }
    }
})
// @from(Ln 465662, Col 0)
function w11(A, {
    assistantMessage: {
        message: {
            id: q
        }
    }
}, K, Y) {
    l_({
        completion_type: A,
        event: K,
        metadata: {
            language_name: "none",
            message_id: q,
            platform: xA.platform,
            hasFeedback: Y ?? !1
        }
    })
}
// @from(Ln 465680, Col 4)
sQA = v(() => {
    G5();
    DY1()
})
// @from(Ln 465686, Col 0)
function _Xz(A) {
    switch (A.length) {
        case 0:
            return "";
        case 1:
            return iw.default.createElement(V, {
                bold: !0
            }, A[0]);
        case 2:
            return iw.default.createElement(V, null, iw.default.createElement(V, {
                bold: !0
            }, A[0]), " and ", iw.default.createElement(V, {
                bold: !0
            }, A[1]));
        default:
            return iw.default.createElement(V, null, iw.default.createElement(V, {
                bold: !0
            }, A.slice(0, -1).join(", ")), ", and", " ", iw.default.createElement(V, {
                bold: !0
            }, A.slice(-1)[0]))
    }
}
// @from(Ln 465709, Col 0)
function tQA(A) {
    if (A.join(", ").length > 50) return "similar";
    return _Xz(A)
}
// @from(Ln 465714, Col 0)
function Vc1(A) {
    if (A.length === 0) return "";
    let q = A.map((K) => K.split("/").pop() || K);
    if (q.length === 1) return iw.default.createElement(V, null, iw.default.createElement(V, {
        bold: !0
    }, q[0]), H11.sep);
    if (q.length === 2) return iw.default.createElement(V, null, iw.default.createElement(V, {
        bold: !0
    }, q[0]), H11.sep, " and ", iw.default.createElement(V, {
        bold: !0
    }, q[1]), H11.sep);
    return iw.default.createElement(V, null, iw.default.createElement(V, {
        bold: !0
    }, q[0]), H11.sep, ", ", iw.default.createElement(V, {
        bold: !0
    }, q[1]), H11.sep, " and ", A.length - 2, " more")
}
// @from(Ln 465732, Col 0)
function JXz(A) {
    let q = A.filter((J) => J.type === "addRules").flatMap((J) => J.rules || []),
        K = q.filter((J) => J.toolName === "Read"),
        Y = q.filter((J) => J.toolName === "Bash"),
        z = A.filter((J) => J.type === "addDirectories").flatMap((J) => J.directories || []),
        w = K.map((J) => J.ruleContent?.replace("/**", "") || "").filter((J) => J),
        H = [...new Set(Y.flatMap((J) => {
            if (!J.ruleContent) return [];
            let X = LmA(J.ruleContent) ?? J.ruleContent,
                {
                    commandWithoutRedirections: D,
                    redirections: j
                } = aI(X);
            return j.length > 0 ? D : X
        }))],
        $ = z.length > 0,
        O = w.length > 0,
        _ = H.length > 0;
    if (O && !$ && !_) {
        if (w.length === 1) {
            let J = w[0],
                X = J.split("/").pop() || J;
            return iw.default.createElement(V, null, "Yes, allow reading from ", iw.default.createElement(V, {
                bold: !0
            }, X), H11.sep, " from this project")
        }
        return iw.default.createElement(V, null, "Yes, allow reading from ", Vc1(w), " from this project")
    }
    if ($ && !O && !_) {
        if (z.length === 1) {
            let J = z[0],
                X = J.split("/").pop() || J;
            return iw.default.createElement(V, null, "Yes, and always allow access to ", iw.default.createElement(V, {
                bold: !0
            }, X), H11.sep, " from this project")
        }
        return iw.default.createElement(V, null, "Yes, and always allow access to ", Vc1(z), " from this project")
    }
    if (_ && !$ && !O) return iw.default.createElement(V, null, "Yes, and don't ask again for ", tQA(H), " commands in", " ", iw.default.createElement(V, {
        bold: !0
    }, y8()));
    if (($ || O) && !_) {
        let J = [...z, ...w];
        if ($ && O) return iw.default.createElement(V, null, "Yes, and always allow access to ", Vc1(J), " from this project")
    }
    if (($ || O) && _) {
        let J = [...z, ...w];
        if (J.length === 1 && H.length === 1) return iw.default.createElement(V, null, "Yes, and allow access to ", Vc1(J), " and", " ", tQA(H), " commands");
        return iw.default.createElement(V, null, "Yes, and allow ", Vc1(J), " access and", " ", tQA(H), " commands")
    }
    return null
}
// @from(Ln 465785, Col 0)
function VPq({
    suggestions: A = [],
    decisionReason: q,
    onRejectFeedbackChange: K,
    onAcceptFeedbackChange: Y,
    onClassifierDescriptionChange: z,
    classifierDescription: w,
    initialClassifierDescriptionEmpty: H = !1,
    existingAllowDescriptions: $ = [],
    yesInputMode: O = !1,
    noInputMode: _ = !1
}) {
    let J = [];
    if (O) J.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: Y,
        allowEmptySubmitToCancel: !0
    });
    else J.push({
        label: "Yes",
        value: "yes"
    });
    if (tb()) {
        if (A.length > 0) {
            let X = JXz(A);
            if (X) J.push({
                label: X,
                value: "yes-apply-suggestions"
            })
        }
    }
    if (_) J.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: K,
        allowEmptySubmitToCancel: !0
    });
    else J.push({
        label: "No",
        value: "no"
    });
    return J
}
// @from(Ln 465833, Col 4)
iw
// @from(Ln 465834, Col 4)
NPq = v(() => {
    m1();
    B6();
    km();
    wG();
    KL();
    iw = o(X1(), 1)
})
// @from(Ln 465843, Col 0)
function TPq(A) {
    switch (A.type) {
        case "rule":
            return `${H6.bold(M9(A.rule.ruleValue))} rule from ${Ta1(A.rule.source)}`;
        case "mode":
            return `${CQ(A.mode)} mode`;
        case "sandboxOverride":
            return "Requires permission to bypass sandbox";
        case "workingDir":
            return A.reason;
        case "other":
            return A.reason;
        case "permissionPromptTool":
            return `${H6.bold(A.permissionPromptToolName)} permission prompt tool`;
        case "hook":
            return A.reason ? `${H6.bold(A.hookName)} hook: ${A.reason}` : `${H6.bold(A.hookName)} hook`;
        case "asyncAgent":
            return A.reason
    }
}
// @from(Ln 465864, Col 0)
function XXz(A) {
    let q = e(10),
        {
            title: K,
            decisionReason: Y
        } = A,
        [z] = T7(),
        w;
    if (q[0] !== Y || q[1] !== z) w = function() {
        switch (Y.type) {
            case "subcommandResults":
                return Zq.default.createElement(I, {
                    flexDirection: "column"
                }, Array.from(Y.reasons.entries()).map((X) => {
                    let [D, j] = X, M = j.behavior === "allow" ? k8("success", z)(l1.tick) : k8("error", z)(l1.cross);
                    return Zq.default.createElement(I, {
                        flexDirection: "column",
                        key: D
                    }, Zq.default.createElement(V, null, M, " ", D), j.decisionReason !== void 0 && j.decisionReason.type !== "subcommandResults" && Zq.default.createElement(V, null, "  ", "⎿", "  ", Zq.default.createElement(W3, null, TPq(j.decisionReason))), j.behavior === "ask" && (() => {
                        let P = I81(j.suggestions);
                        return P.length > 0 ? Zq.default.createElement(V, null, "  ", "⎿", "  ", "Suggested rules:", " ", Zq.default.createElement(W3, null, P.map(DXz).join(", "))) : null
                    })())
                }));
            default:
                return Zq.default.createElement(V, null, Zq.default.createElement(W3, null, TPq(Y)))
        }
    }, q[0] = Y, q[1] = z, q[2] = w;
    else w = q[2];
    let H = w,
        $;
    if (q[3] !== K) $ = K && Zq.default.createElement(V, null, K), q[3] = K, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== H) O = H(), q[5] = H, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] !== $ || q[8] !== O) _ = Zq.default.createElement(I, {
        flexDirection: "column"
    }, $, O), q[7] = $, q[8] = O, q[9] = _;
    else _ = q[9];
    return _
}
// @from(Ln 465907, Col 0)
function DXz(A) {
    return H6.bold(M9(A))
}
// @from(Ln 465911, Col 0)
function jXz(A) {
    if (!A) return [];
    return A.flatMap((q) => {
        switch (q.type) {
            case "addDirectories":
                return q.directories;
            default:
                return []
        }
    })
}
// @from(Ln 465923, Col 0)
function MXz(A) {
    if (!A) return;
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K?.type === "setMode") return K.mode
    }
    return
}
// @from(Ln 465932, Col 0)
function PXz(A) {
    let q = e(22),
        {
            suggestions: K,
            width: Y
        } = A;
    if (!K || K.length === 0) {
        let H;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = Zq.default.createElement(V, {
            dimColor: !0
        }, "Suggestions "), q[0] = H;
        else H = q[0];
        let $;
        if (q[1] !== Y) $ = Zq.default.createElement(I, {
            justifyContent: "flex-end",
            minWidth: Y
        }, H), q[1] = Y, q[2] = $;
        else $ = q[2];
        let O;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) O = Zq.default.createElement(V, null, "None"), q[3] = O;
        else O = q[3];
        let _;
        if (q[4] !== $) _ = Zq.default.createElement(I, {
            flexDirection: "row"
        }, $, O), q[4] = $, q[5] = _;
        else _ = q[5];
        return _
    }
    let z, w;
    if (q[6] !== K || q[7] !== Y) {
        w = Symbol.for("react.early_return_sentinel");
        A: {
            let H = I81(K),
                $ = jXz(K),
                O = MXz(K);
            if (H.length === 0 && $.length === 0 && !O) {
                let j;
                if (q[10] === Symbol.for("react.memo_cache_sentinel")) j = Zq.default.createElement(V, {
                    dimColor: !0
                }, "Suggestion "), q[10] = j;
                else j = q[10];
                let M;
                if (q[11] !== Y) M = Zq.default.createElement(I, {
                    justifyContent: "flex-end",
                    minWidth: Y
                }, j), q[11] = Y, q[12] = M;
                else M = q[12];
                let P;
                if (q[13] === Symbol.for("react.memo_cache_sentinel")) P = Zq.default.createElement(V, null, "None"), q[13] = P;
                else P = q[13];
                let W;
                if (q[14] !== M) W = Zq.default.createElement(I, {
                    flexDirection: "row"
                }, M, P), q[14] = M, q[15] = W;
                else W = q[15];
                w = W;
                break A
            }
            let _;
            if (q[16] === Symbol.for("react.memo_cache_sentinel")) _ = Zq.default.createElement(V, {
                dimColor: !0
            }, "Suggestions "),
            q[16] = _;
            else _ = q[16];
            let J;
            if (q[17] !== Y) J = Zq.default.createElement(I, {
                justifyContent: "flex-end",
                minWidth: Y
            }, _),
            q[17] = Y,
            q[18] = J;
            else J = q[18];
            let X;
            if (q[19] === Symbol.for("react.memo_cache_sentinel")) X = Zq.default.createElement(V, null, " "),
            q[19] = X;
            else X = q[19];
            let D;
            if (q[20] !== J) D = Zq.default.createElement(I, {
                flexDirection: "row"
            }, J, X),
            q[20] = J,
            q[21] = D;
            else D = q[21];z = Zq.default.createElement(I, {
                flexDirection: "column"
            }, D, H.length > 0 && Zq.default.createElement(I, {
                flexDirection: "row"
            }, Zq.default.createElement(I, {
                justifyContent: "flex-end",
                minWidth: Y
            }, Zq.default.createElement(V, {
                dimColor: !0
            }, " Rules ")), Zq.default.createElement(I, {
                flexDirection: "column"
            }, H.map(GXz))), $.length > 0 && Zq.default.createElement(I, {
                flexDirection: "row"
            }, Zq.default.createElement(I, {
                justifyContent: "flex-end",
                minWidth: Y
            }, Zq.default.createElement(V, {
                dimColor: !0
            }, " Directories ")), Zq.default.createElement(I, {
                flexDirection: "column"
            }, $.map(WXz))), O && Zq.default.createElement(I, {
                flexDirection: "row"
            }, Zq.default.createElement(I, {
                justifyContent: "flex-end",
                minWidth: Y
            }, Zq.default.createElement(V, {
                dimColor: !0
            }, " Mode ")), Zq.default.createElement(V, null, CQ(O))))
        }
        q[6] = K, q[7] = Y, q[8] = z, q[9] = w
    } else z = q[8], w = q[9];
    if (w !== Symbol.for("react.early_return_sentinel")) return w;
    return z
}
// @from(Ln 466049, Col 0)
function WXz(A, q) {
    return Zq.default.createElement(V, {
        key: q
    }, l1.bullet, " ", A)
}
// @from(Ln 466055, Col 0)
function GXz(A, q) {
    return Zq.default.createElement(V, {
        key: q
    }, l1.bullet, " ", M9(A))
}
// @from(Ln 466061, Col 0)
function vPq(A) {
    let q = e(25),
        {
            permissionResult: K,
            toolName: Y
        } = A,
        z = v6(fXz),
        w = K.decisionReason,
        H = "suggestions" in K ? K.suggestions : void 0,
        $;
    if (q[0] !== H || q[1] !== Y || q[2] !== z) {
        A: {
            let G = b8.isSandboxingEnabled() && b8.isAutoAllowBashIfSandboxedEnabled(),
                f = pD1(z, {
                    sandboxAutoAllowEnabled: G
                }),
                Z = I81(H);
            if (Z.length > 0) {
                $ = f.filter((N) => Z.some((T) => T.toolName === N.rule.ruleValue.toolName && T.ruleContent === N.rule.ruleValue.ruleContent));
                break A
            }
            if (Y) {
                let N;
                if (q[4] !== Y) N = (T) => T.rule.ruleValue.toolName === Y, q[4] = Y, q[5] = N;
                else N = q[5];
                $ = f.filter(N);
                break A
            }
            $ = f
        }
        q[0] = H,
        q[1] = Y,
        q[2] = z,
        q[3] = $
    }
    else $ = q[3];
    let O = $,
        _;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) _ = Zq.default.createElement(I, {
        justifyContent: "flex-end",
        minWidth: 10
    }, Zq.default.createElement(V, {
        dimColor: !0
    }, "Behavior ")), q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== K.behavior) J = Zq.default.createElement(I, {
        flexDirection: "row"
    }, _, Zq.default.createElement(V, null, K.behavior)), q[7] = K.behavior, q[8] = J;
    else J = q[8];
    let X;
    if (q[9] !== K.behavior || q[10] !== K.message) X = K.behavior !== "allow" && Zq.default.createElement(I, {
        flexDirection: "row"
    }, Zq.default.createElement(I, {
        justifyContent: "flex-end",
        minWidth: 10
    }, Zq.default.createElement(V, {
        dimColor: !0
    }, "Message ")), Zq.default.createElement(V, null, K.message)), q[9] = K.behavior, q[10] = K.message, q[11] = X;
    else X = q[11];
    let D;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) D = Zq.default.createElement(I, {
        justifyContent: "flex-end",
        minWidth: 10
    }, Zq.default.createElement(V, {
        dimColor: !0
    }, "Reason ")), q[12] = D;
    else D = q[12];
    let j;
    if (q[13] !== w) j = Zq.default.createElement(I, {
        flexDirection: "row"
    }, D, w === void 0 ? Zq.default.createElement(V, null, "undefined") : Zq.default.createElement(XXz, {
        decisionReason: w
    })), q[13] = w, q[14] = j;
    else j = q[14];
    let M;
    if (q[15] !== H) M = Zq.default.createElement(PXz, {
        suggestions: H,
        width: 10
    }), q[15] = H, q[16] = M;
    else M = q[16];
    let P;
    if (q[17] !== O) P = O.length > 0 && Zq.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Zq.default.createElement(V, {
        color: "warning"
    }, l1.warning, " Unreachable Rules (", O.length, ")"), O.map(ZXz)), q[17] = O, q[18] = P;
    else P = q[18];
    let W;
    if (q[19] !== J || q[20] !== X || q[21] !== j || q[22] !== M || q[23] !== P) W = Zq.default.createElement(I, {
        flexDirection: "column"
    }, J, X, j, M, P), q[19] = J, q[20] = X, q[21] = j, q[22] = M, q[23] = P, q[24] = W;
    else W = q[24];
    return W
}
// @from(Ln 466158, Col 0)
function ZXz(A, q) {
    return Zq.default.createElement(I, {
        key: q,
        flexDirection: "column",
        marginLeft: 2
    }, Zq.default.createElement(V, {
        color: "warning"
    }, M9(A.rule.ruleValue)), Zq.default.createElement(V, {
        dimColor: !0
    }, "  ", A.reason), Zq.default.createElement(V, {
        dimColor: !0
    }, "  ", "Fix: ", A.fix))
}
// @from(Ln 466172, Col 0)
function fXz(A) {
    return A.toolPermissionContext
}
// @from(Ln 466175, Col 4)
Zq
// @from(Ln 466176, Col 4)
EPq = v(() => {
    i1();
    m1();
    q3();
    b7();
    oj();
    CO();
    E$();
    d8();
    Dw6();
    k2();
    Zq = o(X1(), 1)
})
// @from(Ln 466190, Col 0)
function VXz(A, q) {
    if (!A) return null;
    switch (A.type) {
        case "rule":
            return {
                reasonString: `Permission rule ${H6.bold(M9(A.rule.ruleValue))} requires confirmation for this ${q}.`, configString: A.rule.source === "policySettings" ? void 0 : "/permissions to update rules"
            };
        case "hook": {
            let K = A.reason ? `:
${A.reason}` : ".";
            return {
                reasonString: `Hook ${H6.bold(A.hookName)} requires confirmation for this ${q}${K}`,
                configString: "/hooks to update"
            }
        }
        default:
            return null
    }
}
// @from(Ln 466210, Col 0)
function mN(A) {
    let q = e(10),
        {
            permissionResult: K,
            toolType: Y
        } = A,
        z = K?.decisionReason,
        w;
    if (q[0] !== z || q[1] !== Y) w = VXz(z, Y), q[0] = z, q[1] = Y, q[2] = w;
    else w = q[2];
    let H = w;
    if (!H) return null;
    let $;
    if (q[3] !== H.reasonString) $ = Nc1.default.createElement(V, null, Nc1.default.createElement(W3, null, H.reasonString)), q[3] = H.reasonString, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== H.configString) O = H.configString && Nc1.default.createElement(V, {
        dimColor: !0
    }, H.configString), q[5] = H.configString, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] !== $ || q[8] !== O) _ = Nc1.default.createElement(I, {
        marginBottom: 1,
        flexDirection: "column"
    }, $, O), q[7] = $, q[8] = O, q[9] = _;
    else _ = q[9];
    return _
}
// @from(Ln 466238, Col 4)
Nc1
// @from(Ln 466239, Col 4)
$11 = v(() => {
    i1();
    m1();
    q3();
    Nc1 = o(X1(), 1)
})
// @from(Ln 466246, Col 0)
function Tf1(A) {
    let q = e(54),
        {
            options: K,
            onSelect: Y,
            onCancel: z,
            question: w,
            toolAnalyticsContext: H
        } = A,
        $ = w === void 0 ? "Do you want to proceed?" : w,
        O = L7(),
        [_, J] = FN.useState(""),
        [X, D] = FN.useState(""),
        [j, M] = FN.useState(!1),
        [P, W] = FN.useState(!1),
        [G, f] = FN.useState(null),
        [Z, N] = FN.useState(!1),
        [T, k] = FN.useState(!1),
        y;
    if (q[0] !== G || q[1] !== K) {
        let E1;
        if (q[3] !== G) E1 = (a) => a.value === G, q[3] = G, q[4] = E1;
        else E1 = q[4];
        y = K.find(E1), q[0] = G, q[1] = K, q[2] = y
    } else y = q[2];
    let S = y?.feedbackConfig?.type,
        m = S === "accept" && !j || S === "reject" && !P,
        b;
    if (q[5] !== j || q[6] !== K || q[7] !== P) {
        let E1;
        if (q[9] !== j || q[10] !== P) E1 = (a) => {
            let {
                value: A1,
                label: M1,
                feedbackConfig: z1
            } = a;
            if (!z1) return {
                label: M1,
                value: A1
            };
            let {
                type: Y1,
                placeholder: _1
            } = z1, $1 = Y1 === "accept" ? j : P, G1 = Y1 === "accept" ? J : D, L1 = NXz[Y1];
            if ($1) return {
                type: "input",
                label: M1,
                value: A1,
                placeholder: _1 ?? L1,
                onChange: G1,
                allowEmptySubmitToCancel: !0
            };
            return {
                label: M1,
                value: A1
            }
        }, q[9] = j, q[10] = P, q[11] = E1;
        else E1 = q[11];
        b = K.map(E1), q[5] = j, q[6] = K, q[7] = P, q[8] = b
    } else b = q[8];
    let g = b,
        U;
    if (q[12] !== j || q[13] !== K || q[14] !== P || q[15] !== H?.isMcp || q[16] !== H?.toolName) U = (E1) => {
        let a = K.find((z1) => z1.value === E1);
        if (!a?.feedbackConfig) return;
        let {
            type: A1
        } = a.feedbackConfig, M1 = {
            toolName: H?.toolName,
            isMcp: H?.isMcp ?? !1
        };
        if (A1 === "accept")
            if (j) M(!1), c("tengu_accept_feedback_mode_collapsed", M1);
            else M(!0), N(!0), c("tengu_accept_feedback_mode_entered", M1);
        else if (A1 === "reject")
            if (P) W(!1), c("tengu_reject_feedback_mode_collapsed", M1);
            else W(!0), k(!0), c("tengu_reject_feedback_mode_entered", M1)
    }, q[12] = j, q[13] = K, q[14] = P, q[15] = H?.isMcp, q[16] = H?.toolName, q[17] = U;
    else U = q[17];
    let x = U,
        p;
    if (q[18] !== _ || q[19] !== Z || q[20] !== Y || q[21] !== K || q[22] !== X || q[23] !== T || q[24] !== H?.isMcp || q[25] !== H?.toolName) p = (E1) => {
        let a = K.find((M1) => M1.value === E1);
        if (!a) return;
        let A1;
        if (a.feedbackConfig) {
            let z1 = (a.feedbackConfig.type === "accept" ? _ : X).trim();
            if (z1) A1 = z1;
            let Y1 = {
                toolName: H?.toolName,
                isMcp: H?.isMcp ?? !1,
                has_instructions: !!z1,
                instructions_length: z1?.length ?? 0,
                entered_feedback_mode: a.feedbackConfig.type === "accept" ? Z : T
            };
            if (a.feedbackConfig.type === "accept") c("tengu_accept_submitted", Y1);
            else if (a.feedbackConfig.type === "reject") c("tengu_reject_submitted", Y1)
        }
        Y(E1, A1)
    }, q[18] = _, q[19] = Z, q[20] = Y, q[21] = K, q[22] = X, q[23] = T, q[24] = H?.isMcp, q[25] = H?.toolName, q[26] = p;
    else p = q[26];
    let l = p,
        r;
    if (q[27] !== l || q[28] !== K) {
        r = {};
        for (let E1 of K)
            if (E1.keybinding) r[E1.keybinding] = () => l(E1.value);
        q[27] = l, q[28] = K, q[29] = r
    } else r = q[29];
    let s = r,
        O1;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) O1 = {
        context: "Confirmation"
    }, q[30] = O1;
    else O1 = q[30];
    c7(s, O1);
    let T1;
    if (q[31] !== z || q[32] !== O) T1 = () => {
        c("tengu_permission_request_escape", {}), O(TXz), z?.()
    }, q[31] = z, q[32] = O, q[33] = T1;
    else T1 = q[33];
    let N1 = T1,
        j1;
    if (q[34] !== $) j1 = typeof $ === "string" ? FN.default.createElement(V, null, $) : $, q[34] = $, q[35] = j1;
    else j1 = q[35];
    let q1;
    if (q[36] !== _ || q[37] !== j || q[38] !== K || q[39] !== X || q[40] !== P) q1 = (E1) => {
        let a = K.find((A1) => A1.value === E1);
        if (a?.feedbackConfig?.type !== "accept" && j && !_.trim()) M(!1);
        if (a?.feedbackConfig?.type !== "reject" && P && !X.trim()) W(!1);
        f(E1)
    }, q[36] = _, q[37] = j, q[38] = K, q[39] = X, q[40] = P, q[41] = q1;
    else q1 = q[41];
    let t;
    if (q[42] !== N1 || q[43] !== x || q[44] !== l || q[45] !== g || q[46] !== q1) t = FN.default.createElement(kA, {
        options: g,
        inlineDescriptions: !0,
        onChange: l,
        onCancel: N1,
        onFocus: q1,
        onInputModeToggle: x
    }), q[42] = N1, q[43] = x, q[44] = l, q[45] = g, q[46] = q1, q[47] = t;
    else t = q[47];
    let J1 = m && " · Tab to amend",
        D1;
    if (q[48] !== J1) D1 = FN.default.createElement(I, {
        marginTop: 1
    }, FN.default.createElement(V, {
        dimColor: !0
    }, "Esc to cancel", J1)), q[48] = J1, q[49] = D1;
    else D1 = q[49];
    let Z1;
    if (q[50] !== t || q[51] !== D1 || q[52] !== j1) Z1 = FN.default.createElement(I, {
        flexDirection: "column"
    }, j1, t, D1), q[50] = t, q[51] = D1, q[52] = j1, q[53] = Z1;
    else Z1 = q[53];
    return Z1
}
// @from(Ln 466405, Col 0)
function TXz(A) {
    return {
        ...A,
        attribution: {
            ...A.attribution,
            escapeCount: A.attribution.escapeCount + 1
        }
    }
}
// @from(Ln 466414, Col 4)
FN
// @from(Ln 466414, Col 8)
NXz
// @from(Ln 466415, Col 4)
Rv6 = v(() => {
    i1();
    m1();
    U5();
    u6();
    d8();
    K7();
    FN = o(X1(), 1), NXz = {
        accept: "tell Claude what to do next",
        reject: "tell Claude what to do differently"
    }
})
// @from(Ln 466428, Col 0)
function kPq(A) {
    let q = e(53),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: w,
            serverName: H,
            toolName: $,
            args: O
        } = A,
        _ = `${H} - ${$}`,
        J = `mcp__${H}__${$}`,
        X;
    if (q[0] !== J || q[1] !== K.tool) X = {
        ...K.tool,
        name: J,
        isMcp: !0
    }, q[0] = J, q[1] = K.tool, q[2] = X;
    else X = q[2];
    let D;
    if (q[3] !== X || q[4] !== K) D = {
        ...K,
        tool: X
    }, q[3] = X, q[4] = K, q[5] = D;
    else D = q[5];
    let j = D,
        M;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) M = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[6] = M;
    else M = q[6];
    Ny(j, M);
    let W;
    if (q[7] !== j || q[8] !== Y || q[9] !== z || q[10] !== H || q[11] !== $) W = (q1, t) => {
        A: switch (q1) {
            case "yes": {
                l_({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: j.assistantMessage.message.id,
                        platform: xA.platform
                    }
                }), j.onAllow(j.input, [], t), Y();
                break A
            }
            case "yes-dont-ask-again": {
                l_({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: j.assistantMessage.message.id,
                        platform: xA.platform
                    }
                });
                let J1 = j.permissionResult.behavior === "ask" ? j.permissionResult.suggestions || [] : [];
                if (J1.length === 0) K1(Error(`MCPCliPermissionRequest: No MCP suggestions found for ${H}/${$}`)), j.onAllow(j.input, []);
                else j.onAllow(j.input, J1);
                Y();
                break A
            }
            case "no":
                l_({
                    completion_type: "tool_use_single",
                    event: "reject",
                    metadata: {
                        language_name: "none",
                        message_id: j.assistantMessage.message.id,
                        platform: xA.platform
                    }
                }), j.onReject(t), z(), Y()
        }
    }, q[7] = j, q[8] = Y, q[9] = z, q[10] = H, q[11] = $, q[12] = W;
    else W = q[12];
    let G = W,
        f;
    if (q[13] !== j || q[14] !== Y || q[15] !== z) f = () => {
        l_({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: j.assistantMessage.message.id,
                platform: xA.platform
            }
        }), j.onReject(), z(), Y()
    }, q[13] = j, q[14] = Y, q[15] = z, q[16] = f;
    else f = q[16];
    let Z = f,
        N;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) N = y8(), q[17] = N;
    else N = q[17];
    let T = N,
        k;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) k = tb(), q[18] = k;
    else k = q[18];
    let y = k,
        B;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) B = {
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }, q[19] = B;
    else B = q[19];
    let S;
    if (q[20] !== _) {
        if (S = [B], y) {
            let t = vy.default.createElement(V, {
                    bold: !0
                }, _),
                J1;
            if (q[22] === Symbol.for("react.memo_cache_sentinel")) J1 = vy.default.createElement(V, {
                bold: !0
            }, T), q[22] = J1;
            else J1 = q[22];
            let D1;
            if (q[23] !== t) D1 = {
                label: vy.default.createElement(V, null, "Yes, and don't ask again for ", t, " ", "commands in ", J1),
                value: "yes-dont-ask-again"
            }, q[23] = t, q[24] = D1;
            else D1 = q[24];
            S.push(D1)
        }
        let q1;
        if (q[25] === Symbol.for("react.memo_cache_sentinel")) q1 = {
            label: "No",
            value: "no",
            feedbackConfig: {
                type: "reject"
            }
        }, q[25] = q1;
        else q1 = q[25];
        S.push(q1), q[20] = _, q[21] = S
    } else S = q[21];
    let m = S,
        b;
    if (q[26] !== j.tool.name) b = AK(j.tool.name), q[26] = j.tool.name, q[27] = b;
    else b = q[27];
    let g;
    if (q[28] !== b) g = {
        toolName: b,
        isMcp: !0
    }, q[28] = b, q[29] = g;
    else g = q[29];
    let U = g,
        x = O || "{}",
        p;
    if (q[30] === Symbol.for("react.memo_cache_sentinel")) p = vy.default.createElement(V, {
        dimColor: !0
    }, " (MCP)"), q[30] = p;
    else p = q[30];
    let l;
    if (q[31] !== x || q[32] !== _) l = vy.default.createElement(V, null, _, "(", x, ")", p), q[31] = x, q[32] = _, q[33] = l;
    else l = q[33];
    let r;
    if (q[34] !== j.description) r = vy.default.createElement(V, {
        dimColor: !0
    }, j.description), q[34] = j.description, q[35] = r;
    else r = q[35];
    let s;
    if (q[36] !== l || q[37] !== r) s = vy.default.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, l, r), q[36] = l, q[37] = r, q[38] = s;
    else s = q[38];
    let O1;
    if (q[39] !== j.permissionResult) O1 = vy.default.createElement(mN, {
        permissionResult: j.permissionResult,
        toolType: "tool"
    }), q[39] = j.permissionResult, q[40] = O1;
    else O1 = q[40];
    let T1;
    if (q[41] !== Z || q[42] !== G || q[43] !== m || q[44] !== U) T1 = vy.default.createElement(Tf1, {
        options: m,
        onSelect: G,
        onCancel: Z,
        toolAnalyticsContext: U
    }), q[41] = Z, q[42] = G, q[43] = m, q[44] = U, q[45] = T1;
    else T1 = q[45];
    let N1;
    if (q[46] !== O1 || q[47] !== T1) N1 = vy.default.createElement(I, {
        flexDirection: "column"
    }, O1, T1), q[46] = O1, q[47] = T1, q[48] = N1;
    else N1 = q[48];
    let j1;
    if (q[49] !== s || q[50] !== N1 || q[51] !== w) j1 = vy.default.createElement(Bw, {
        title: "Tool use",
        workerBadge: w
    }, s, N1), q[49] = s, q[50] = N1, q[51] = w, q[52] = j1;
    else j1 = q[52];
    return j1
}
// @from(Ln 466627, Col 4)
vy
// @from(Ln 466628, Col 4)
LPq = v(() => {
    i1();
    m1();
    Bv();
    DY1();
    G5();
    B6();
    jY1();
    $11();
    y6();
    Rv6();
    U$();
    KL();
    vy = o(X1(), 1)
})
// @from(Ln 466648, Col 0)
function RPq(A) {
    let q = e(43),
        K, Y;
    if (q[0] !== A)({
        sedInfo: Y,
        ...K
    } = A), q[0] = A, q[1] = K, q[2] = Y;
    else K = q[1], Y = q[2];
    let {
        filePath: z
    } = Y, w;
    A: try {
        if (b1().existsSync(z)) {
            let g;
            if (q[3] !== z) g = $J(z), q[3] = z, q[4] = g;
            else g = q[4];
            let U;
            if (q[5] !== g) U = {
                oldContent: g,
                fileExists: !0
            }, q[5] = g, q[6] = U;
            else U = q[6];
            w = U;
            break A
        }
        let b;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) b = {
            oldContent: "",
            fileExists: !1
        }, q[7] = b;
        else b = q[7];
        w = b
    } catch {
        let m;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) m = {
            oldContent: "",
            fileExists: !1
        }, q[8] = m;
        else m = q[8];
        w = m
    }
    let {
        oldContent: H,
        fileExists: $
    } = w, O;
    if (q[9] !== H || q[10] !== Y) O = Vb4(H, Y), q[9] = H, q[10] = Y, q[11] = O;
    else O = q[11];
    let _ = O,
        J;
    A: {
        if (H === _) {
            let b;
            if (q[12] === Symbol.for("react.memo_cache_sentinel")) b = [], q[12] = b;
            else b = q[12];
            J = b;
            break A
        }
        let m;
        if (q[13] !== _ || q[14] !== H) m = [{
            old_string: H,
            new_string: _,
            replace_all: !1
        }],
        q[13] = _,
        q[14] = H,
        q[15] = m;
        else m = q[15];J = m
    }
    let X = J,
        D;
    A: {
        if (!$) {
            D = "File does not exist";
            break A
        }
        D = "Pattern did not match any content"
    }
    let j = D,
        M;
    if (q[16] !== z || q[17] !== _) M = (m) => {
        return {
            ...qq.inputSchema.parse(m),
            _simulatedSedEdit: {
                filePath: z,
                newContent: _
            }
        }
    }, q[16] = z, q[17] = _, q[18] = M;
    else M = q[18];
    let P = M,
        W = K.toolUseConfirm,
        G = K.toolUseContext,
        f = K.onDone,
        Z = K.onReject,
        N;
    if (q[19] !== z) N = EXz(h6(), z), q[19] = z, q[20] = N;
    else N = q[20];
    let T;
    if (q[21] !== z) T = vXz(z), q[21] = z, q[22] = T;
    else T = q[22];
    let k;
    if (q[23] !== T) k = vf1.default.createElement(V, null, "Do you want to make this edit to", " ", vf1.default.createElement(V, {
        bold: !0
    }, T), "?"), q[23] = T, q[24] = k;
    else k = q[24];
    let y;
    if (q[25] !== X || q[26] !== z || q[27] !== j) y = X.length > 0 ? vf1.default.createElement(kv6, {
        file_path: z,
        edits: X
    }) : vf1.default.createElement(V, {
        dimColor: !0
    }, j), q[25] = X, q[26] = z, q[27] = j, q[28] = y;
    else y = q[28];
    let B;
    if (q[29] !== z) B = ae(z), q[29] = z, q[30] = B;
    else B = q[30];
    let S;
    if (q[31] !== z || q[32] !== P || q[33] !== K.onDone || q[34] !== K.onReject || q[35] !== K.toolUseConfirm || q[36] !== K.toolUseContext || q[37] !== K.workerBadge || q[38] !== N || q[39] !== k || q[40] !== y || q[41] !== B) S = vf1.default.createElement(ZF, {
        toolUseConfirm: W,
        toolUseContext: G,
        onDone: f,
        onReject: Z,
        title: "Edit file",
        subtitle: N,
        question: k,
        content: y,
        path: z,
        completionType: "str_replace_single",
        languageName: B,
        parseInput: P,
        workerBadge: K.workerBadge
    }), q[31] = z, q[32] = P, q[33] = K.onDone, q[34] = K.onReject, q[35] = K.toolUseConfirm, q[36] = K.toolUseContext, q[37] = K.workerBadge, q[38] = N, q[39] = k, q[40] = y, q[41] = B, q[42] = S;
    else S = q[42];
    return S
}
// @from(Ln 466783, Col 4)
vf1
// @from(Ln 466784, Col 4)
yPq = v(() => {
    i1();
    m1();
    rQA();
    wq();
    Nf1();
    N7();
    wq();
    _8();
    kQ1();
    i0();
    vf1 = o(X1(), 1)
})
// @from(Ln 466798, Col 0)
function IXz(A) {
    if (typeof A === "string") return A;
    try {
        return Q1(A, null, 2)
    } catch {
        return String(A)
    }
}
// @from(Ln 466807, Col 0)
function xXz(A, q = 1000) {
    let K = A.filter((w) => w.type === "assistant").slice(-3),
        Y = [],
        z = 0;
    for (let w of K.reverse()) {
        let H = w.message.content.filter(($) => $.type === "text").map(($) => ("text" in $) ? $.text : "").join(" ");
        if (H && z < q) {
            let $ = q - z,
                O = H.length > $ ? H.slice(0, $) + "..." : H;
            Y.unshift(O), z += O.length
        }
    }
    return Y.join(`

`)
}
// @from(Ln 466824, Col 0)
function eQA() {
    if (process.env.PERMISSION_EXPLAINER_ENABLED === "true") return f6().permissionExplainerEnabled !== !1;
    if (!x8("tengu_permission_explainer", !1)) return !1;
    return f6().permissionExplainerEnabled !== !1
}
// @from(Ln 466829, Col 0)
async function CPq({
    toolName: A,
    toolInput: q,
    toolDescription: K,
    messages: Y,
    signal: z
}) {
    if (!eQA()) return null;
    let w = Date.now();
    try {
        let H = IXz(q),
            $ = Y?.length ? xXz(Y) : "",
            O = `Tool: ${A}
${K?`Description: ${K}
`:""}
Input:
${H}
${$?`
Recent conversation context:
${$}`:""}

Explain this command in context.`,
            _ = l3(),
            J = await h51({
                model: _,
                system: CXz,
                messages: [{
                    role: "user",
                    content: O
                }],
                tools: [SXz],
                tool_choice: {
                    type: "tool",
                    name: "explain_command"
                },
                signal: z
            }),
            X = Date.now() - w;
        h(`Permission explainer: API returned in ${X}ms, stop_reason=${J.stop_reason}`);
        let D = J.content.find((j) => j.type === "tool_use");
        if (D && D.type === "tool_use") {
            h(`Permission explainer: tool input: ${Q1(D.input).slice(0,500)}`);
            let j = hXz.safeParse(D.input);
            if (j.success) {
                let M = {
                    riskLevel: j.data.riskLevel,
                    explanation: j.data.explanation,
                    reasoning: j.data.reasoning,
                    risk: j.data.risk
                };
                return c("tengu_permission_explainer_generated", {
                    tool_name: AK(A),
                    risk_level: kXz[M.riskLevel],
                    latency_ms: X
                }), h(`Permission explainer: ${M.riskLevel} risk for ${A} (${X}ms)`), M
            }
        }
        return c("tengu_permission_explainer_error", {
            tool_name: AK(A),
            error_type: LXz,
            latency_ms: X
        }), h("Permission explainer: no parsed output in response"), null
    } catch (H) {
        let $ = Date.now() - w;
        if (z.aborted) return h(`Permission explainer: request aborted for ${A}`), null;
        return h(`Permission explainer error: ${H instanceof Error?H.message:String(H)}`), K1(H instanceof Error ? H : Error(String(H))), c("tengu_permission_explainer_error", {
            tool_name: AK(A),
            error_type: H instanceof Error && H.name === "AbortError" ? RXz : yXz,
            latency_ms: $
        }), null
    }
}
// @from(Ln 466901, Col 4)
kXz
// @from(Ln 466901, Col 9)
LXz = 1
// @from(Ln 466902, Col 4)
RXz = 2
// @from(Ln 466903, Col 4)
yXz = 3
// @from(Ln 466904, Col 4)
CXz = "Analyze shell commands and explain what they do, why you're running them, and potential risks."
// @from(Ln 466905, Col 4)
SXz
// @from(Ln 466905, Col 9)
hXz
// @from(Ln 466906, Col 4)
SPq = v(() => {
    u6();
    U$();
    y6();
    Z6();
    U4();
    cA();
    m6();
    e7();
    Rg1();
    i7();
    kXz = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    }, SXz = {
        name: "explain_command",
        description: "Provide an explanation of a shell command",
        input_schema: {
            type: "object",
            properties: {
                explanation: {
                    type: "string",
                    description: "What this command does (1-2 sentences)"
                },
                reasoning: {
                    type: "string",
                    description: 'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"'
                },
                risk: {
                    type: "string",
                    description: "What could go wrong, under 15 words"
                },
                riskLevel: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH"],
                    description: "LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)"
                }
            },
            required: ["explanation", "reasoning", "risk", "riskLevel"]
        }
    }, hXz = u.object({
        riskLevel: u.enum(["LOW", "MEDIUM", "HIGH"]),
        explanation: u.string(),
        reasoning: u.string(),
        risk: u.string()
    })
})
// @from(Ln 466955, Col 0)
function bXz() {
    let A = e(7),
        [q, K] = hF1("responding", hPq, !0, !1),
        Y;
    if (A[0] !== K) Y = hPq.split("").map((H, $) => xj.default.createElement(JTA, {
        key: $,
        char: H,
        index: $,
        glimmerIndex: K,
        messageColor: "inactive",
        shimmerColor: "text"
    })), A[0] = K, A[1] = Y;
    else Y = A[1];
    let z;
    if (A[2] !== Y) z = xj.default.createElement(V, null, Y), A[2] = Y, A[3] = z;
    else z = A[3];
    let w;
    if (A[4] !== q || A[5] !== z) w = xj.default.createElement(I, {
        ref: q
    }, z), A[4] = q, A[5] = z, A[6] = w;
    else w = A[6];
    return w
}
// @from(Ln 466979, Col 0)
function uXz(A) {
    switch (A) {
        case "LOW":
            return "success";
        case "MEDIUM":
            return "warning";
        case "HIGH":
            return "error"
    }
}
// @from(Ln 466990, Col 0)
function BXz(A) {
    switch (A) {
        case "LOW":
            return "Low risk";
        case "MEDIUM":
            return "Med risk";
        case "HIGH":
            return "High risk"
    }
}
// @from(Ln 467001, Col 0)
function mXz(A) {
    return CPq({
        toolName: A.toolName,
        toolInput: A.toolInput,
        toolDescription: A.toolDescription,
        messages: A.messages,
        signal: new AbortController().signal
    }).catch(() => null)
}
// @from(Ln 467011, Col 0)
function IPq(A) {
    let q = e(9),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = eQA(), q[0] = K;
    else K = q[0];
    let Y = K,
        [z, w] = MY1.useState(!1),
        [H, $] = MY1.useState(null),
        O;
    if (q[1] !== H || q[2] !== A || q[3] !== z) O = () => {
        if (!z) {
            if (c("tengu_permission_explainer_shortcut_used", {}), !H) $(mXz(A))
        }
        w(FXz)
    }, q[1] = H, q[2] = A, q[3] = z, q[4] = O;
    else O = q[4];
    let _;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Confirmation",
        isActive: Y
    }, q[5] = _;
    else _ = q[5];
    DA("confirm:toggleExplanation", O, _);
    let J;
    if (q[6] !== H || q[7] !== z) J = {
        visible: z,
        enabled: Y,
        promise: H
    }, q[6] = H, q[7] = z, q[8] = J;
    else J = q[8];
    return J
}
// @from(Ln 467044, Col 0)
function FXz(A) {
    return !A
}
// @from(Ln 467048, Col 0)
function QXz(A) {
    let q = e(21),
        {
            promise: K
        } = A,
        Y = MY1.use(K);
    if (!Y) {
        let D;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) D = xj.default.createElement(I, {
            marginTop: 1
        }, xj.default.createElement(V, {
            dimColor: !0
        }, "Explanation unavailable")), q[0] = D;
        else D = q[0];
        return D
    }
    let z;
    if (q[1] !== Y.explanation) z = xj.default.createElement(V, null, Y.explanation), q[1] = Y.explanation, q[2] = z;
    else z = q[2];
    let w;
    if (q[3] !== Y.reasoning) w = xj.default.createElement(I, {
        marginTop: 1
    }, xj.default.createElement(V, null, Y.reasoning)), q[3] = Y.reasoning, q[4] = w;
    else w = q[4];
    let H;
    if (q[5] !== Y.riskLevel) H = uXz(Y.riskLevel), q[5] = Y.riskLevel, q[6] = H;
    else H = q[6];
    let $;
    if (q[7] !== Y.riskLevel) $ = BXz(Y.riskLevel), q[7] = Y.riskLevel, q[8] = $;
    else $ = q[8];
    let O;
    if (q[9] !== H || q[10] !== $) O = xj.default.createElement(V, {
        color: H
    }, $, ":"), q[9] = H, q[10] = $, q[11] = O;
    else O = q[11];
    let _;
    if (q[12] !== Y.risk) _ = xj.default.createElement(V, null, " ", Y.risk), q[12] = Y.risk, q[13] = _;
    else _ = q[13];
    let J;
    if (q[14] !== O || q[15] !== _) J = xj.default.createElement(I, {
        marginTop: 1
    }, xj.default.createElement(V, null, O, _)), q[14] = O, q[15] = _, q[16] = J;
    else J = q[16];
    let X;
    if (q[17] !== z || q[18] !== w || q[19] !== J) X = xj.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, z, w, J), q[17] = z, q[18] = w, q[19] = J, q[20] = X;
    else X = q[20];
    return X
}
// @from(Ln 467100, Col 0)
function xPq(A) {
    let q = e(3),
        {
            visible: K,
            promise: Y
        } = A;
    if (!K || !Y) return null;
    let z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = xj.default.createElement(I, {
        marginTop: 1
    }, xj.default.createElement(bXz, null)), q[0] = z;
    else z = q[0];
    let w;
    if (q[1] !== Y) w = xj.default.createElement(MY1.Suspense, {
        fallback: z
    }, xj.default.createElement(QXz, {
        promise: Y
    })), q[1] = Y, q[2] = w;
    else w = q[2];
    return w
}
// @from(Ln 467121, Col 4)
xj
// @from(Ln 467121, Col 8)
MY1
// @from(Ln 467121, Col 13)
hPq = "Loading explanation…"
// @from(Ln 467122, Col 4)
bPq = v(() => {
    i1();
    m1();
    K7();
    SPq();
    u6();
    Tj6();
    vj6();
    xj = o(X1(), 1), MY1 = o(X1(), 1)
})
// @from(Ln 467133, Col 0)
function uPq(A) {
    let q = e(27),
        {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: w,
            verbose: H,
            workerBadge: $
        } = A,
        O, _, J, X;
    if (q[0] !== z || q[1] !== w || q[2] !== K || q[3] !== Y || q[4] !== H || q[5] !== $) {
        X = Symbol.for("react.early_return_sentinel");
        A: {
            ({
                command: O,
                description: _
            } = qq.inputSchema.parse(K.input));
            let M = ce(O);
            if (M) {
                let {
                    server: P,
                    toolName: W,
                    args: G
                } = M;
                X = Y_.default.createElement(kPq, {
                    toolUseConfirm: K,
                    toolUseContext: Y,
                    onDone: z,
                    verbose: H,
                    onReject: w,
                    workerBadge: $,
                    serverName: P,
                    toolName: W,
                    args: G
                });
                break A
            }
            J = aP1(O)
        }
        q[0] = z, q[1] = w, q[2] = K, q[3] = Y, q[4] = H, q[5] = $, q[6] = O, q[7] = _, q[8] = J, q[9] = X
    } else O = q[6], _ = q[7], J = q[8], X = q[9];
    if (X !== Symbol.for("react.early_return_sentinel")) return X;
    let D = J;
    if (D) {
        let M;
        if (q[10] !== z || q[11] !== w || q[12] !== D || q[13] !== K || q[14] !== Y || q[15] !== H || q[16] !== $) M = Y_.default.createElement(RPq, {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: w,
            verbose: H,
            workerBadge: $,
            sedInfo: D
        }), q[10] = z, q[11] = w, q[12] = D, q[13] = K, q[14] = Y, q[15] = H, q[16] = $, q[17] = M;
        else M = q[17];
        return M
    }
    let j;
    if (q[18] !== O || q[19] !== _ || q[20] !== z || q[21] !== w || q[22] !== K || q[23] !== Y || q[24] !== H || q[25] !== $) j = Y_.default.createElement(gXz, {
        toolUseConfirm: K,
        toolUseContext: Y,
        onDone: z,
        onReject: w,
        verbose: H,
        workerBadge: $,
        command: O,
        description: _
    }), q[18] = O, q[19] = _, q[20] = z, q[21] = w, q[22] = K, q[23] = Y, q[24] = H, q[25] = $, q[26] = j;
    else j = q[26];
    return j
}
// @from(Ln 467206, Col 0)
function gXz({
    toolUseConfirm: A,
    toolUseContext: q,
    onDone: K,
    onReject: Y,
    verbose: z,
    workerBadge: w,
    command: H,
    description: $
}) {
    let [O] = T7(), _ = v6((M1) => M1.toolPermissionContext), J = L7(), X = IPq({
        toolName: A.tool.name,
        toolInput: A.input,
        toolDescription: A.description,
        messages: q.messages
    }), [D, j] = i_.useState(!1), [M, P] = i_.useState(""), [W, G] = i_.useState(""), [f, Z] = i_.useState($ || ""), [N, T] = i_.useState(!$?.trim());
    i_.useEffect(() => {
        if (!ne()) return;
        let M1 = new AbortController;
        return p_q(H, $, M1.signal).then((z1) => {
            if (z1 && !M1.signal.aborted) Z(z1), T(!1)
        }).catch(() => {}), () => M1.abort()
    }, [H, $]);
    let [k, y] = i_.useState(!1), [B, S] = i_.useState(!1), [m, b] = i_.useState("yes"), [g, U] = i_.useState(!1), [x, p] = i_.useState(!1), l = i_.useRef(!1), r = "Attempting to auto-approve…", [s, O1] = hF1("requesting", r, !0, !1), T1 = b8.isSandboxingEnabled(), N1 = T1 && Sc(A.input), j1 = i_.useMemo(() => ({
        completion_type: "tool_use_single",
        language_name: "none"
    }), []);
    Ny(A, j1);
    let q1 = i_.useMemo(() => Qd1(_), [_]),
        t = i_.useMemo(() => VPq({
            suggestions: A.permissionResult.behavior === "ask" ? A.permissionResult.suggestions : void 0,
            decisionReason: A.permissionResult.decisionReason,
            onRejectFeedbackChange: P,
            onAcceptFeedbackChange: G,
            onClassifierDescriptionChange: Z,
            classifierDescription: f,
            initialClassifierDescriptionEmpty: N,
            existingAllowDescriptions: q1,
            yesInputMode: k,
            noInputMode: B
        }), [A, f, N, q1, k, B]),
        J1 = i_.useCallback(() => {
            j((M1) => !M1)
        }, []);
    DA("permission:toggleDebug", J1, {
        context: "Confirmation"
    });
    let D1 = i_.useCallback(() => {
        A.onDismissCheckmark?.()
    }, [A]);
    DA("confirm:no", D1, {
        context: "Confirmation",
        isActive: !1
    });

    function Z1(M1) {
        A.onUserInteraction();
        let z1 = {
            toolName: AK(A.tool.name),
            isMcp: A.tool.isMcp ?? !1
        };
        if (M1 === "yes")
            if (k) y(!1), c("tengu_accept_feedback_mode_collapsed", z1);
            else y(!0), U(!0), c("tengu_accept_feedback_mode_entered", z1);
        else if (M1 === "no")
            if (B) S(!1), c("tengu_reject_feedback_mode_collapsed", z1);
            else S(!0), p(!0), c("tengu_reject_feedback_mode_entered", z1)
    }

    function E1(M1) {
        let z1 = M1?.trim(),
            Y1 = !!z1;
        if (!Y1) c("tengu_permission_request_escape", {
            explainer_visible: X.visible
        }), J((_1) => ({
            ..._1,
            attribution: {
                ..._1.attribution,
                escapeCount: _1.attribution.escapeCount + 1
            }
        }));
        if (w11("tool_use_single", A, "reject", Y1), z1) A.onReject(z1);
        else A.onReject();
        Y(), K()
    }

    function a(M1) {
        c("tengu_permission_request_option_selected", {
            option_index: {
                yes: 1,
                "yes-apply-suggestions": 2,
                no: 3
            } [M1],
            explainer_visible: X.visible
        });
        let Y1 = AK(A.tool.name);
        switch (M1) {
            case "yes": {
                let _1 = W.trim();
                w11("tool_use_single", A, "accept"), c("tengu_accept_submitted", {
                    toolName: Y1,
                    isMcp: A.tool.isMcp ?? !1,
                    has_instructions: !!_1,
                    instructions_length: _1.length,
                    entered_feedback_mode: g
                }), A.onAllow(A.input, [], _1 || void 0), K();
                break
            }
            case "yes-apply-suggestions": {
                w11("tool_use_single", A, "accept");
                let _1 = "suggestions" in A.permissionResult ? A.permissionResult.suggestions || [] : [];
                A.onAllow(A.input, _1), K();
                break
            }
            case "no": {
                let _1 = M.trim();
                c("tengu_reject_submitted", {
                    toolName: Y1,
                    isMcp: A.tool.isMcp ?? !1,
                    has_instructions: !!_1,
                    instructions_length: _1.length,
                    entered_feedback_mode: x
                }), E1(_1 || void 0);
                break
            }
        }
    }
    return Y_.default.createElement(Bw, {
        workerBadge: w,
        title: T1 && !N1 ? "Bash command (unsandboxed)" : "Bash command",
        subtitle: void 0
    }, Y_.default.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, Y_.default.createElement(V, {
        dimColor: X.visible
    }, qq.renderToolUseMessage({
        command: H,
        description: $
    }, {
        theme: O,
        verbose: !0
    })), !X.visible && Y_.default.createElement(V, {
        dimColor: !0
    }, A.description), Y_.default.createElement(xPq, {
        visible: X.visible,
        promise: X.promise
    })), D ? Y_.default.createElement(Y_.default.Fragment, null, Y_.default.createElement(vPq, {
        permissionResult: A.permissionResult,
        toolName: "Bash"
    }), q.options.debug && Y_.default.createElement(I, {
        justifyContent: "flex-end",
        marginTop: 1
    }, Y_.default.createElement(V, {
        dimColor: !0
    }, "Ctrl-D to hide debug info"))) : Y_.default.createElement(Y_.default.Fragment, null, Y_.default.createElement(I, {
        flexDirection: "column"
    }, Y_.default.createElement(mN, {
        permissionResult: A.permissionResult,
        toolType: "command"
    }), Y_.default.createElement(V, {
        dimColor: !1
    }, "Do you want to proceed?"), Y_.default.createElement(kA, {
        options: t,
        isDisabled: !1,
        inlineDescriptions: !0,
        onChange: a,
        onCancel: () => E1(),
        onFocus: (M1) => {
            if (M1 !== m) A.onUserInteraction();
            if (M1 !== "yes" && k && !W.trim()) y(!1);
            if (M1 !== "no" && B && !M.trim()) S(!1);
            b(M1)
        },
        onInputModeToggle: Z1
    })), Y_.default.createElement(I, {
        justifyContent: "space-between",
        marginTop: 1
    }, Y_.default.createElement(V, {
        dimColor: !0
    }, "Esc to cancel", (m === "yes" && !k || m === "no" && !B) && " · Tab to amend", X.enabled && ` · ctrl+e to ${X.visible?"hide":"explain"}`), q.options.debug && Y_.default.createElement(V, {
        dimColor: !0
    }, "Ctrl+d to show debug info"))))
}
// @from(Ln 467391, Col 4)
Y_
// @from(Ln 467391, Col 8)
i_
// @from(Ln 467392, Col 4)
BPq = v(() => {
    i1();
    m1();
    K7();
    i0();
    xd1();
    jY1();
    Bv();
    sQA();
    U5();
    NPq();
    EPq();
    $11();
    k2();
    LPq();
    Tj();
    u6();
    U$();
    kQ1();
    yPq();
    d8();
    Tj6();
    vj6();
    bPq();
    Y_ = o(X1(), 1), i_ = o(X1(), 1)
})
// @from(Ln 467419, Col 0)
function yv6(A) {
    let q = e(58),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            workerBadge: w
        } = A,
        [H] = T7(),
        $, O;
    if (q[0] !== K.input || q[1] !== K.tool) $ = K.tool.userFacingName(K.input), O = $.endsWith(" (MCP)") ? $.slice(0, -6) : $, q[0] = K.input, q[1] = K.tool, q[2] = $, q[3] = O;
    else $ = q[2], O = q[3];
    let _ = O,
        J;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) J = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[4] = J;
    else J = q[4];
    Ny(K, J);
    let D;
    if (q[5] !== Y || q[6] !== z || q[7] !== K) D = (N1, j1) => {
        A: switch (N1) {
            case "yes": {
                l_({
                    completion_type: "tool_use_single",
                    event: "accept",
                    metadata: {
                        language_name: "none",
                        message_id: K.assistantMessage.message.id,
                        platform: xA.platform
                    }
                }), K.onAllow(K.input, [], j1), Y();
                break A
            }
            case "yes-dont-ask-again": {
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
                        toolName: K.tool.name
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
                }), K.onReject(j1), z(), Y()
        }
    }, q[5] = Y, q[6] = z, q[7] = K, q[8] = D;
    else D = q[8];
    let j = D,
        M;
    if (q[9] !== Y || q[10] !== z || q[11] !== K) M = () => {
        l_({
            completion_type: "tool_use_single",
            event: "reject",
            metadata: {
                language_name: "none",
                message_id: K.assistantMessage.message.id,
                platform: xA.platform
            }
        }), K.onReject(), z(), Y()
    }, q[9] = Y, q[10] = z, q[11] = K, q[12] = M;
    else M = q[12];
    let P = M,
        W;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) W = y8(), q[13] = W;
    else W = q[13];
    let G = W,
        f;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) f = tb(), q[14] = f;
    else f = q[14];
    let Z = f,
        N;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) N = {
        label: "Yes",
        value: "yes",
        feedbackConfig: {
            type: "accept"
        }
    }, q[15] = N;
    else N = q[15];
    let T;
    if (q[16] !== _) {
        if (T = [N], Z) {
            let j1 = Ey.default.createElement(V, {
                    bold: !0
                }, _),
                q1;
            if (q[18] === Symbol.for("react.memo_cache_sentinel")) q1 = Ey.default.createElement(V, {
                bold: !0
            }, G), q[18] = q1;
            else q1 = q[18];
            let t;
            if (q[19] !== j1) t = {
                label: Ey.default.createElement(V, null, "Yes, and don't ask again for ", j1, " ", "commands in ", q1),
                value: "yes-dont-ask-again"
            }, q[19] = j1, q[20] = t;
            else t = q[20];
            T.push(t)
        }
        let N1;
        if (q[21] === Symbol.for("react.memo_cache_sentinel")) N1 = {
            label: "No",
            value: "no",
            feedbackConfig: {
                type: "reject"
            }
        }, q[21] = N1;
        else N1 = q[21];
        T.push(N1), q[16] = _, q[17] = T
    } else T = q[17];
    let k = T,
        y;
    if (q[22] !== K.tool.name) y = AK(K.tool.name), q[22] = K.tool.name, q[23] = y;
    else y = q[23];
    let B = K.tool.isMcp ?? !1,
        S;
    if (q[24] !== y || q[25] !== B) S = {
        toolName: y,
        isMcp: B
    }, q[24] = y, q[25] = B, q[26] = S;
    else S = q[26];
    let m = S,
        b;
    if (q[27] !== H || q[28] !== K.input || q[29] !== K.tool) b = K.tool.renderToolUseMessage(K.input, {
        theme: H,
        verbose: !0
    }), q[27] = H, q[28] = K.input, q[29] = K.tool, q[30] = b;
    else b = q[30];
    let g;
    if (q[31] !== $) g = $.endsWith(" (MCP)") ? Ey.default.createElement(V, {
        dimColor: !0
    }, " (MCP)") : "", q[31] = $, q[32] = g;
    else g = q[32];
    let U;
    if (q[33] !== b || q[34] !== g || q[35] !== _) U = Ey.default.createElement(V, null, _, "(", b, ")", g), q[33] = b, q[34] = g, q[35] = _, q[36] = U;
    else U = q[36];
    let x;
    if (q[37] !== K.description) x = Dk7(K.description, 3), q[37] = K.description, q[38] = x;
    else x = q[38];
    let p;
    if (q[39] !== x) p = Ey.default.createElement(V, {
        dimColor: !0
    }, x), q[39] = x, q[40] = p;
    else p = q[40];
    let l;
    if (q[41] !== U || q[42] !== p) l = Ey.default.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, U, p), q[41] = U, q[42] = p, q[43] = l;
    else l = q[43];
    let r;
    if (q[44] !== K.permissionResult) r = Ey.default.createElement(mN, {
        permissionResult: K.permissionResult,
        toolType: "tool"
    }), q[44] = K.permissionResult, q[45] = r;
    else r = q[45];
    let s;
    if (q[46] !== P || q[47] !== j || q[48] !== k || q[49] !== m) s = Ey.default.createElement(Tf1, {
        options: k,
        onSelect: j,
        onCancel: P,
        toolAnalyticsContext: m
    }), q[46] = P, q[47] = j, q[48] = k, q[49] = m, q[50] = s;
    else s = q[50];
    let O1;
    if (q[51] !== r || q[52] !== s) O1 = Ey.default.createElement(I, {
        flexDirection: "column"
    }, r, s), q[51] = r, q[52] = s, q[53] = O1;
    else O1 = q[53];
    let T1;
    if (q[54] !== l || q[55] !== O1 || q[56] !== w) T1 = Ey.default.createElement(Bw, {
        title: "Tool use",
        workerBadge: w
    }, l, O1), q[54] = l, q[55] = O1, q[56] = w, q[57] = T1;
    else T1 = q[57];
    return T1
}
// @from(Ln 467616, Col 4)
Ey
// @from(Ln 467617, Col 4)
AgA = v(() => {
    i1();
    m1();
    Bv();
    DY1();
    G5();
    B6();
    jY1();
    $11();
    Rv6();
    U$();
    KL();
    Ey = o(X1(), 1)
})
// @from(Ln 467632, Col 0)
function UXz() {
    return Date.now() - KN1()
}
// @from(Ln 467636, Col 0)
function pXz(A) {
    return UXz() < A
}
// @from(Ln 467640, Col 0)
function dXz(A) {
    return !pXz(A)
}
// @from(Ln 467644, Col 0)
function vc1(A, q) {
    let K = YB();
    qgA.useEffect(() => {
        A61()
    }, []), qgA.useEffect(() => {
        let Y = !1,
            z = setInterval(() => {
                if (dXz(mPq) && !Y) Y = !0, Nm({
                    message: A,
                    notificationType: q
                }, K)
            }, mPq);
        return () => clearInterval(z)
    }, [A, q, K])
}
// @from(Ln 467659, Col 4)
qgA
// @from(Ln 467659, Col 9)
mPq = 6000
// @from(Ln 467660, Col 4)
KgA = v(() => {
    $q1();
    aF1();
    B6();
    qgA = o(X1(), 1)
})
// @from(Ln 467667, Col 0)
function FPq(A) {
    let q = e(17),
        {
            file_path: K,
            content: Y
        } = A,
        {
            columns: z
        } = Z8(),
        w = b1().existsSync(K),
        H;
    A: {
        if (!w) {
            H = "";
            break A
        }
        let M;
        if (q[0] !== K) {
            let P = AX(K);
            M = b1().readFileSync(K, {
                encoding: P
            }), q[0] = K, q[1] = M
        } else M = q[1];H = M
    }
    let $ = H,
        O;
    A: {
        if (!w) {
            O = null;
            break A
        }
        let M;
        if (q[2] !== Y || q[3] !== K || q[4] !== $) M = kv({
            filePath: K,
            fileContents: $,
            edits: [{
                old_string: $,
                new_string: Y,
                replace_all: !1
            }]
        }),
        q[2] = Y,
        q[3] = K,
        q[4] = $,
        q[5] = M;
        else M = q[5];O = M
    }
    let _ = O,
        J;
    if (q[6] !== Y) J = Y.split(`
`)[0] ?? null, q[6] = Y, q[7] = J;
    else J = q[7];
    let X = J,
        D;
    if (q[8] !== z || q[9] !== Y || q[10] !== K || q[11] !== X || q[12] !== _ || q[13] !== $) D = _ ? rR(_.map((M) => Kx.createElement(fN, {
        key: M.newStart,
        patch: M,
        dim: !1,
        filePath: K,
        firstLine: X,
        fileContent: $,
        width: z - 2
    })), cXz) : Kx.createElement(VN, {
        code: Y || "(No content)",
        filePath: K
    }), q[8] = z, q[9] = Y, q[10] = K, q[11] = X, q[12] = _, q[13] = $, q[14] = D;
    else D = q[14];
    let j;
    if (q[15] !== D) j = Kx.createElement(I, {
        flexDirection: "column"
    }, Kx.createElement(I, {
        borderDimColor: !0,
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1
    }, D)), q[15] = D, q[16] = j;
    else j = q[16];
    return j
}
// @from(Ln 467750, Col 0)
function cXz(A) {
    return Kx.createElement(V, {
        dimColor: !0,
        key: `ellipsis-${A}`
    }, "...")
}
// @from(Ln 467756, Col 4)
Kx
// @from(Ln 467757, Col 4)
QPq = v(() => {
    i1();
    jt();
    m1();
    wq();
    Z51();
    wp();
    _8();
    mq();
    Kx = o(X1(), 1)
})
// @from(Ln 467773, Col 0)
function gPq(A) {
    let q = e(28),
        K = rXz,
        Y;
    if (q[0] !== A.toolUseConfirm.input) Y = K(A.toolUseConfirm.input), q[0] = A.toolUseConfirm.input, q[1] = Y;
    else Y = q[1];
    let z = Y,
        {
            file_path: w,
            content: H
        } = z,
        $ = b1().existsSync(w),
        O = $ ? "overwrite" : "create",
        _ = A.toolUseConfirm,
        J = A.toolUseContext,
        X = A.onDone,
        D = A.onReject,
        j = A.workerBadge,
        M = $ ? "Overwrite file" : "Create file",
        P;
    if (q[2] !== w) P = iXz(h6(), w), q[2] = w, q[3] = P;
    else P = q[3];
    let W;
    if (q[4] !== w) W = lXz(w), q[4] = w, q[5] = W;
    else W = q[5];
    let G;
    if (q[6] !== W) G = Ec1.default.createElement(V, {
        bold: !0
    }, W), q[6] = W, q[7] = G;
    else G = q[7];
    let f;
    if (q[8] !== O || q[9] !== G) f = Ec1.default.createElement(V, null, "Do you want to ", O, " ", G, "?"), q[8] = O, q[9] = G, q[10] = f;
    else f = q[10];
    let Z;
    if (q[11] !== H || q[12] !== w) Z = Ec1.default.createElement(FPq, {
        file_path: w,
        content: H
    }), q[11] = H, q[12] = w, q[13] = Z;
    else Z = q[13];
    let N;
    if (q[14] !== w) N = ae(w), q[14] = w, q[15] = N;
    else N = q[15];
    let T;
    if (q[16] !== w || q[17] !== A.onDone || q[18] !== A.onReject || q[19] !== A.toolUseConfirm || q[20] !== A.toolUseContext || q[21] !== A.workerBadge || q[22] !== f || q[23] !== Z || q[24] !== N || q[25] !== M || q[26] !== P) T = Ec1.default.createElement(ZF, {
        toolUseConfirm: _,
        toolUseContext: J,
        onDone: X,
        onReject: D,
        workerBadge: j,
        title: M,
        subtitle: P,
        question: f,
        content: Z,
        path: w,
        completionType: "write_file_single",
        languageName: N,
        parseInput: K,
        ideDiffSupport: nXz
    }), q[16] = w, q[17] = A.onDone, q[18] = A.onReject, q[19] = A.toolUseConfirm, q[20] = A.toolUseContext, q[21] = A.workerBadge, q[22] = f, q[23] = Z, q[24] = N, q[25] = M, q[26] = P, q[27] = T;
    else T = q[27];
    return T
}
// @from(Ln 467836, Col 0)
function rXz(A) {
    return vj.inputSchema.parse(A)
}
// @from(Ln 467839, Col 4)
Ec1
// @from(Ln 467839, Col 9)
nXz
// @from(Ln 467840, Col 4)
UPq = v(() => {
    i1();
    m1();
    Lt();
    QPq();
    wq();
    _8();
    Nf1();
    N7();
    Ec1 = o(X1(), 1), nXz = {
        getConfig: (A) => {
            let K = b1().existsSync(A.file_path) ? $J(A.file_path) : "";
            return Lv6(A.file_path, K, A.content, !1)
        },
        applyChanges: (A, q) => {
            let K = q[0];
            if (K) return {
                ...A,
                content: K.new_string
            };
            return A
        }
    }
})
// @from(Ln 467865, Col 0)
function oXz(A) {
    let q = A.tool;
    if ("getPath" in q && typeof q.getPath === "function") try {
        return q.getPath(A.input)
    } catch {
        return null
    }
    return null
}
// @from(Ln 467875, Col 0)
function pPq(A) {
    let q = e(30),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            verbose: w,
            toolUseContext: H,
            workerBadge: $
        } = A,
        [O] = T7(),
        _;
    if (q[0] !== K) _ = oXz(K), q[0] = K, q[1] = _;
    else _ = q[1];
    let J = _,
        X;
    if (q[2] !== K.input || q[3] !== K.tool) X = K.tool.userFacingName(K.input), q[2] = K.input, q[3] = K.tool, q[4] = X;
    else X = q[4];
    let D = X,
        j = K.tool.isReadOnly(K.input),
        P = `${j?"Read":"Edit"} file`,
        W = aXz;
    if (!J) {
        let k;
        if (q[5] !== Y || q[6] !== z || q[7] !== K || q[8] !== H || q[9] !== w || q[10] !== $) k = kc1.default.createElement(yv6, {
            toolUseConfirm: K,
            toolUseContext: H,
            onDone: Y,
            onReject: z,
            verbose: w,
            workerBadge: $
        }), q[5] = Y, q[6] = z, q[7] = K, q[8] = H, q[9] = w, q[10] = $, q[11] = k;
        else k = q[11];
        return k
    }
    let G;
    if (q[12] !== O || q[13] !== K.input || q[14] !== K.tool || q[15] !== w) G = K.tool.renderToolUseMessage(K.input, {
        theme: O,
        verbose: w
    }), q[12] = O, q[13] = K.input, q[14] = K.tool, q[15] = w, q[16] = G;
    else G = q[16];
    let f;
    if (q[17] !== G || q[18] !== D) f = kc1.default.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, kc1.default.createElement(V, null, D, "(", G, ")")), q[17] = G, q[18] = D, q[19] = f;
    else f = q[19];
    let Z = f,
        N = j ? "read" : "write",
        T;
    if (q[20] !== Z || q[21] !== Y || q[22] !== z || q[23] !== J || q[24] !== N || q[25] !== P || q[26] !== K || q[27] !== H || q[28] !== $) T = kc1.default.createElement(ZF, {
        toolUseConfirm: K,
        toolUseContext: H,
        onDone: Y,
        onReject: z,
        workerBadge: $,
        title: P,
        content: Z,
        path: J,
        parseInput: W,
        operationType: N,
        completionType: "tool_use_single",
        languageName: "none"
    }), q[20] = Z, q[21] = Y, q[22] = z, q[23] = J, q[24] = N, q[25] = P, q[26] = K, q[27] = H, q[28] = $, q[29] = T;
    else T = q[29];
    return T
}
// @from(Ln 467944, Col 0)
function aXz(A) {
    return A
}
// @from(Ln 467947, Col 4)
kc1
// @from(Ln 467948, Col 4)
dPq = v(() => {
    i1();
    m1();
    AgA();
    Nf1();
    kc1 = o(X1(), 1)
})
// @from(Ln 467956, Col 0)
function sXz(A) {
    try {
        let q = Vj.inputSchema.safeParse(A);
        if (!q.success) return `input:${A.toString()}`;
        let {
            url: K
        } = q.data;
        return `domain:${new URL(K).hostname}`
    } catch {
        return `input:${A.toString()}`
    }
}
// @from(Ln 467969, Col 0)
function cPq(A) {
    let q = e(41),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z,
            verbose: w,
            workerBadge: H
        } = A,
        [$] = T7(),
        {
            url: O
        } = K.input,
        _;
    if (q[0] !== O) _ = new URL(O), q[0] = O, q[1] = _;
    else _ = q[1];
    let J = _.hostname,
        X;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) X = {
        completion_type: "tool_use_single",
        language_name: "none"
    }, q[2] = X;
    else X = q[2];
    Ny(K, X);
    let j;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) j = tb(), q[3] = j;
    else j = q[3];
    let M = j,
        P;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) P = {
        label: "Yes",
        value: "yes"
    }, q[4] = P;
    else P = q[4];
    let W;
    if (q[5] !== J) {
        if (W = [P], M) {
            let p = xE.default.createElement(V, {
                    bold: !0
                }, J),
                l;
            if (q[7] !== p) l = {
                label: xE.default.createElement(V, null, "Yes, and don't ask again for ", p),
                value: "yes-dont-ask-again-domain"
            }, q[7] = p, q[8] = l;
            else l = q[8];
            W.push(l)
        }
        let x;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) x = {
            label: xE.default.createElement(V, null, "No, and tell Claude what to do differently ", xE.default.createElement(V, {
                bold: !0
            }, "(esc)")),
            value: "no"
        }, q[9] = x;
        else x = q[9];
        W.push(x), q[5] = J, q[6] = W
    } else W = q[6];
    let G = W,
        f;
    if (q[10] !== Y || q[11] !== z || q[12] !== K) f = function(p) {
        A: switch (p) {
            case "yes": {
                w11("tool_use_single", K, "accept"), K.onAllow(K.input, []), Y();
                break A
            }
            case "yes-dont-ask-again-domain": {
                w11("tool_use_single", K, "accept");
                let l = sXz(K.input),
                    r = {
                        toolName: K.tool.name,
                        ruleContent: l
                    };
                K.onAllow(K.input, [{
                    type: "addRules",
                    rules: [r],
                    behavior: "allow",
                    destination: "localSettings"
                }]), Y();
                break A
            }
            case "no":
                w11("tool_use_single", K, "reject"), K.onReject(), z(), Y()
        }
    }, q[10] = Y, q[11] = z, q[12] = K, q[13] = f;
    else f = q[13];
    let Z = f,
        N;
    if (q[14] !== $ || q[15] !== K.input || q[16] !== w) N = Vj.renderToolUseMessage(K.input, {
        theme: $,
        verbose: w
    }), q[14] = $, q[15] = K.input, q[16] = w, q[17] = N;
    else N = q[17];
    let T;
    if (q[18] !== N) T = xE.default.createElement(V, null, N), q[18] = N, q[19] = T;
    else T = q[19];
    let k;
    if (q[20] !== K.description) k = xE.default.createElement(V, {
        dimColor: !0
    }, K.description), q[20] = K.description, q[21] = k;
    else k = q[21];
    let y;
    if (q[22] !== T || q[23] !== k) y = xE.default.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1
    }, T, k), q[22] = T, q[23] = k, q[24] = y;
    else y = q[24];
    let B;
    if (q[25] !== K.permissionResult) B = xE.default.createElement(mN, {
        permissionResult: K.permissionResult,
        toolType: "tool"
    }), q[25] = K.permissionResult, q[26] = B;
    else B = q[26];
    let S;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) S = xE.default.createElement(V, null, "Do you want to allow Claude to fetch this content?"), q[27] = S;
    else S = q[27];
    let m;
    if (q[28] !== Z) m = () => Z("no"), q[28] = Z, q[29] = m;
    else m = q[29];
    let b;
    if (q[30] !== Z || q[31] !== G || q[32] !== m) b = xE.default.createElement(kA, {
        options: G,
        onChange: Z,
        onCancel: m
    }), q[30] = Z, q[31] = G, q[32] = m, q[33] = b;
    else b = q[33];
    let g;
    if (q[34] !== B || q[35] !== b) g = xE.default.createElement(I, {
        flexDirection: "column"
    }, B, S, b), q[34] = B, q[35] = b, q[36] = g;
    else g = q[36];
    let U;
    if (q[37] !== g || q[38] !== y || q[39] !== H) U = xE.default.createElement(Bw, {
        title: "Fetch",
        workerBadge: H
    }, y, g), q[37] = g, q[38] = y, q[39] = H, q[40] = U;
    else U = q[40];
    return U
}
// @from(Ln 468109, Col 4)
xE
// @from(Ln 468110, Col 4)
lPq = v(() => {
    i1();
    m1();
    gW1();
    jY1();
    Bv();
    sQA();
    U5();
    $11();
    KL();
    xE = o(X1(), 1)
})