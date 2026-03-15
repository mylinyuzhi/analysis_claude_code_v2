
// @from(Ln 393507, Col 0)
function $_q(A) {
    let q = A6(55),
        {
            existingApiKey: K,
            apiKeyOrOAuthToken: Y,
            onApiKeyChange: z,
            onSubmit: _,
            onToggleUseExistingKey: w,
            onCreateOAuthToken: O,
            selectedOption: $,
            onSelectOption: H
        } = A,
        j = $ === void 0 ? K ? "existing" : O ? "oauth" : "new" : $,
        [J, M] = dX.useState(0),
        D = KA(),
        [X] = z7(),
        P;
    if (q[0] !== K || q[1] !== O || q[2] !== H || q[3] !== w || q[4] !== j) P = () => {
        if (j === "new" && O) H?.("oauth");
        else if (j === "oauth" && K) H?.("existing"), w(!0)
    }, q[0] = K, q[1] = O, q[2] = H, q[3] = w, q[4] = j, q[5] = P;
    else P = q[5];
    let W = P,
        Z;
    if (q[6] !== O || q[7] !== H || q[8] !== w || q[9] !== j) Z = () => {
        if (j === "existing") H?.(O ? "oauth" : "new"), w(!1);
        else if (j === "oauth") H?.("new")
    }, q[6] = O, q[7] = H, q[8] = w, q[9] = j, q[10] = Z;
    else Z = q[10];
    let G = Z,
        f;
    if (q[11] !== O || q[12] !== _ || q[13] !== j) f = () => {
        if (j === "oauth" && O) O();
        else _()
    }, q[11] = O, q[12] = _, q[13] = j, q[14] = f;
    else f = q[14];
    let v = f,
        N = j === "new",
        V;
    if (q[15] !== v || q[16] !== G || q[17] !== W) V = {
        "confirm:previous": W,
        "confirm:next": G,
        "confirm:yes": v
    }, q[15] = v, q[16] = G, q[17] = W, q[18] = V;
    else V = q[18];
    let L = !N,
        h;
    if (q[19] !== L) h = {
        context: "Confirmation",
        isActive: L
    }, q[19] = L, q[20] = h;
    else h = q[20];
    tA(V, h);
    let R;
    if (q[21] !== G || q[22] !== W) R = {
        "confirm:previous": W,
        "confirm:next": G
    }, q[21] = G, q[22] = W, q[23] = R;
    else R = q[23];
    let u;
    if (q[24] !== N) u = {
        context: "Confirmation",
        isActive: N
    }, q[24] = N, q[25] = u;
    else u = q[25];
    tA(R, u);
    let I;
    if (q[26] === Symbol.for("react.memo_cache_sentinel")) I = dX.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, dX.default.createElement(T, {
        bold: !0
    }, "Install GitHub App"), dX.default.createElement(T, {
        dimColor: !0
    }, "Choose API key")), q[26] = I;
    else I = q[26];
    let g;
    if (q[27] !== K || q[28] !== j || q[29] !== X) g = K && dX.default.createElement(m, {
        marginBottom: 1
    }, dX.default.createElement(T, null, j === "existing" ? kA("success", X)("> ") : "  ", "Use your existing Claude Code API key")), q[27] = K, q[28] = j, q[29] = X, q[30] = g;
    else g = q[30];
    let B;
    if (q[31] !== O || q[32] !== j || q[33] !== X) B = O && dX.default.createElement(m, {
        marginBottom: 1
    }, dX.default.createElement(T, null, j === "oauth" ? kA("success", X)("> ") : "  ", "Create a long-lived token with your Claude subscription")), q[31] = O, q[32] = j, q[33] = X, q[34] = B;
    else B = q[34];
    let b;
    if (q[35] !== j || q[36] !== X) b = j === "new" ? kA("success", X)("> ") : "  ", q[35] = j, q[36] = X, q[37] = b;
    else b = q[37];
    let p;
    if (q[38] !== b) p = dX.default.createElement(m, {
        marginBottom: 1
    }, dX.default.createElement(T, null, b, "Enter a new API key")), q[38] = b, q[39] = p;
    else p = q[39];
    let Q;
    if (q[40] !== Y || q[41] !== J || q[42] !== z || q[43] !== _ || q[44] !== j || q[45] !== D) Q = j === "new" && dX.default.createElement(J5, {
        value: Y,
        onChange: z,
        onSubmit: _,
        onPaste: z,
        focus: !0,
        placeholder: "sk-ant… (Create a new key at https://platform.claude.com/settings/keys)",
        mask: "*",
        columns: D.columns,
        cursorOffset: J,
        onChangeCursorOffset: M,
        showCursor: !0
    }), q[40] = Y, q[41] = J, q[42] = z, q[43] = _, q[44] = j, q[45] = D, q[46] = Q;
    else Q = q[46];
    let U;
    if (q[47] !== g || q[48] !== B || q[49] !== p || q[50] !== Q) U = dX.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, I, g, B, p, Q), q[47] = g, q[48] = B, q[49] = p, q[50] = Q, q[51] = U;
    else U = q[51];
    let r;
    if (q[52] === Symbol.for("react.memo_cache_sentinel")) r = dX.default.createElement(m, {
        marginLeft: 3
    }, dX.default.createElement(T, {
        dimColor: !0
    }, "↑/↓ to select · Enter to continue")), q[52] = r;
    else r = q[52];
    let e;
    if (q[53] !== U) e = dX.default.createElement(dX.default.Fragment, null, U, r), q[53] = U, q[54] = e;
    else e = q[54];
    return e
}
// @from(Ln 393635, Col 4)
dX
// @from(Ln 393636, Col 4)
H_q = E(() => {
    e6();
    i6();
    _7();
    AH();
    _q();
    dX = t(P6(), 1)
})
// @from(Ln 393645, Col 0)
function j_q(A) {
    let q = A6(10),
        {
            currentWorkflowInstallStep: K,
            secretExists: Y,
            useExistingSecret: z,
            secretName: _,
            skipWorkflow: w,
            selectedWorkflows: O
        } = A,
        $ = w === void 0 ? !1 : w,
        H;
    if (q[0] !== Y || q[1] !== _ || q[2] !== O || q[3] !== $ || q[4] !== z) H = $ ? ["Getting repository information", Y && z ? "Using existing API key secret" : `Setting up ${_} secret`] : ["Getting repository information", "Creating branch", O.length > 1 ? "Creating workflow files" : "Creating workflow file", Y && z ? "Using existing API key secret" : `Setting up ${_} secret`, "Opening pull request page"], q[0] = Y, q[1] = _, q[2] = O, q[3] = $, q[4] = z, q[5] = H;
    else H = q[5];
    let j = H,
        J;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) J = il.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, il.default.createElement(T, {
        bold: !0
    }, "Install GitHub App"), il.default.createElement(T, {
        dimColor: !0
    }, "Create GitHub Actions workflow")), q[6] = J;
    else J = q[6];
    let M;
    if (q[7] !== K || q[8] !== j) M = il.default.createElement(il.default.Fragment, null, il.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, J, j.map((D, X) => {
        let P = "pending";
        if (X < K) P = "completed";
        else if (X === K) P = "in-progress";
        return il.default.createElement(m, {
            key: X
        }, il.default.createElement(T, {
            color: P === "completed" ? "success" : P === "in-progress" ? "warning" : void 0
        }, P === "completed" ? "✓ " : "", D, P === "in-progress" ? "…" : ""))
    }))), q[7] = K, q[8] = j, q[9] = M;
    else M = q[9];
    return M
}
// @from(Ln 393688, Col 4)
il
// @from(Ln 393689, Col 4)
J_q = E(() => {
    e6();
    i6();
    il = t(P6(), 1)
})
// @from(Ln 393695, Col 0)
function M_q(A) {
    let q = A6(21),
        {
            secretExists: K,
            useExistingSecret: Y,
            secretName: z,
            skipWorkflow: _
        } = A,
        w = _ === void 0 ? !1 : _,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = iw.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, iw.default.createElement(T, {
        bold: !0
    }, "Install GitHub App"), iw.default.createElement(T, {
        dimColor: !0
    }, "Success")), q[0] = O;
    else O = q[0];
    let $;
    if (q[1] !== w) $ = !w && iw.default.createElement(T, {
        color: "success"
    }, "✓ GitHub Actions workflow created!"), q[1] = w, q[2] = $;
    else $ = q[2];
    let H;
    if (q[3] !== K || q[4] !== Y) H = K && Y && iw.default.createElement(m, {
        marginTop: 1
    }, iw.default.createElement(T, {
        color: "success"
    }, "✓ Using existing ANTHROPIC_API_KEY secret")), q[3] = K, q[4] = Y, q[5] = H;
    else H = q[5];
    let j;
    if (q[6] !== K || q[7] !== z || q[8] !== Y) j = (!K || !Y) && iw.default.createElement(m, {
        marginTop: 1
    }, iw.default.createElement(T, {
        color: "success"
    }, "✓ API key saved as ", z, " secret")), q[6] = K, q[7] = z, q[8] = Y, q[9] = j;
    else j = q[9];
    let J;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) J = iw.default.createElement(m, {
        marginTop: 1
    }, iw.default.createElement(T, null, "Next steps:")), q[10] = J;
    else J = q[10];
    let M;
    if (q[11] !== w) M = w ? iw.default.createElement(iw.default.Fragment, null, iw.default.createElement(T, null, "1. Install the Claude GitHub App if you haven't already"), iw.default.createElement(T, null, "2. Your workflow file was kept unchanged"), iw.default.createElement(T, null, "3. API key is configured and ready to use")) : iw.default.createElement(iw.default.Fragment, null, iw.default.createElement(T, null, "1. A pre-filled PR page has been created"), iw.default.createElement(T, null, "2. Install the Claude GitHub App if you haven't already"), iw.default.createElement(T, null, "3. Merge the PR to enable Claude PR assistance")), q[11] = w, q[12] = M;
    else M = q[12];
    let D;
    if (q[13] !== $ || q[14] !== H || q[15] !== j || q[16] !== M) D = iw.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, O, $, H, j, J, M), q[13] = $, q[14] = H, q[15] = j, q[16] = M, q[17] = D;
    else D = q[17];
    let X;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) X = iw.default.createElement(m, {
        marginLeft: 3
    }, iw.default.createElement(T, {
        dimColor: !0
    }, "Press any key to exit")), q[18] = X;
    else X = q[18];
    let P;
    if (q[19] !== D) P = iw.default.createElement(iw.default.Fragment, null, D, X), q[19] = D, q[20] = P;
    else P = q[20];
    return P
}
// @from(Ln 393760, Col 4)
iw
// @from(Ln 393761, Col 4)
D_q = E(() => {
    e6();
    i6();
    iw = t(P6(), 1)
})
// @from(Ln 393767, Col 0)
function X_q(A) {
    let q = A6(15),
        {
            error: K,
            errorReason: Y,
            errorInstructions: z
        } = A,
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = jD.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, jD.default.createElement(T, {
        bold: !0
    }, "Install GitHub App")), q[0] = _;
    else _ = q[0];
    let w;
    if (q[1] !== K) w = jD.default.createElement(T, {
        color: "error"
    }, "Error: ", K), q[1] = K, q[2] = w;
    else w = q[2];
    let O;
    if (q[3] !== Y) O = Y && jD.default.createElement(m, {
        marginTop: 1
    }, jD.default.createElement(T, {
        dimColor: !0
    }, "Reason: ", Y)), q[3] = Y, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] !== z) $ = z && z.length > 0 && jD.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, jD.default.createElement(T, {
        dimColor: !0
    }, "How to fix:"), z.map(ndY)), q[5] = z, q[6] = $;
    else $ = q[6];
    let H;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) H = jD.default.createElement(m, {
        marginTop: 1
    }, jD.default.createElement(T, {
        dimColor: !0
    }, "For manual setup instructions, see:", " ", jD.default.createElement(T, {
        color: "claude"
    }, PF))), q[7] = H;
    else H = q[7];
    let j;
    if (q[8] !== w || q[9] !== O || q[10] !== $) j = jD.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, _, w, O, $, H), q[8] = w, q[9] = O, q[10] = $, q[11] = j;
    else j = q[11];
    let J;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) J = jD.default.createElement(m, {
        marginLeft: 3
    }, jD.default.createElement(T, {
        dimColor: !0
    }, "Press any key to exit")), q[12] = J;
    else J = q[12];
    let M;
    if (q[13] !== j) M = jD.default.createElement(jD.default.Fragment, null, j, J), q[13] = j, q[14] = M;
    else M = q[14];
    return M
}
// @from(Ln 393831, Col 0)
function ndY(A, q) {
    return jD.default.createElement(m, {
        key: q,
        marginLeft: 2
    }, jD.default.createElement(T, {
        dimColor: !0
    }, "• "), jD.default.createElement(T, null, A))
}
// @from(Ln 393839, Col 4)
jD
// @from(Ln 393840, Col 4)
P_q = E(() => {
    e6();
    i6();
    jD = t(P6(), 1)
})
// @from(Ln 393846, Col 0)
function W_q(A) {
    let q = A6(16),
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
    let _ = z,
        w;
    if (q[1] !== Y) w = (W) => {
        Y(W)
    }, q[1] = Y, q[2] = w;
    else w = q[2];
    let O = w,
        $;
    if (q[3] !== Y) $ = () => {
        Y("exit")
    }, q[3] = Y, q[4] = $;
    else $ = q[4];
    let H = $,
        j;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) j = kN.default.createElement(T, {
        bold: !0
    }, "Existing Workflow Found"), q[5] = j;
    else j = q[5];
    let J;
    if (q[6] !== K) J = kN.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, j, kN.default.createElement(T, {
        dimColor: !0
    }, "Repository: ", K)), q[6] = K, q[7] = J;
    else J = q[7];
    let M;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) M = kN.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, kN.default.createElement(T, null, "A Claude workflow file already exists at", " ", kN.default.createElement(T, {
        color: "claude"
    }, ".github/workflows/claude.yml")), kN.default.createElement(T, {
        dimColor: !0
    }, "What would you like to do?")), q[8] = M;
    else M = q[8];
    let D;
    if (q[9] !== H || q[10] !== O) D = kN.default.createElement(m, {
        flexDirection: "column"
    }, kN.default.createElement(T8, {
        options: _,
        onChange: O,
        onCancel: H
    })), q[9] = H, q[10] = O, q[11] = D;
    else D = q[11];
    let X;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) X = kN.default.createElement(m, {
        marginTop: 1
    }, kN.default.createElement(T, {
        dimColor: !0
    }, "View the latest workflow template at:", " ", kN.default.createElement(T, {
        color: "claude"
    }, "https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml"))), q[12] = X;
    else X = q[12];
    let P;
    if (q[13] !== J || q[14] !== D) P = kN.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        borderDimColor: !0,
        paddingX: 1
    }, J, M, D, X), q[13] = J, q[14] = D, q[15] = P;
    else P = q[15];
    return P
}
// @from(Ln 393928, Col 4)
kN
// @from(Ln 393929, Col 4)
Z_q = E(() => {
    e6();
    i6();
    o9();
    kN = t(P6(), 1)
})
// @from(Ln 393936, Col 0)
function G_q(A) {
    let q = A6(8),
        {
            warnings: K,
            onContinue: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, q[0] = z;
    else z = q[0];
    D8("confirm:yes", Y, z);
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = c0.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, c0.default.createElement(T, {
        bold: !0
    }, a6.warning, " Setup Warnings"), c0.default.createElement(T, {
        dimColor: !0
    }, "We found some potential issues, but you can continue anyway")), q[1] = _;
    else _ = q[1];
    let w;
    if (q[2] !== K) w = K.map(rdY), q[2] = K, q[3] = w;
    else w = q[3];
    let O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = c0.default.createElement(m, {
        marginTop: 1
    }, c0.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Press Enter to continue anyway, or Ctrl+C to exit and fix issues")), q[4] = O;
    else O = q[4];
    let $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = c0.default.createElement(m, {
        marginTop: 1
    }, c0.default.createElement(T, {
        dimColor: !0
    }, "You can also try the manual setup steps if needed:", " ", c0.default.createElement(T, {
        color: "claude"
    }, PF))), q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] !== w) H = c0.default.createElement(c0.default.Fragment, null, c0.default.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1
    }, _, w, O, $)), q[6] = w, q[7] = H;
    else H = q[7];
    return H
}
// @from(Ln 393988, Col 0)
function rdY(A, q) {
    return c0.default.createElement(m, {
        key: q,
        flexDirection: "column",
        marginBottom: 1
    }, c0.default.createElement(T, {
        color: "warning",
        bold: !0
    }, A.title), c0.default.createElement(T, null, A.message), A.instructions.length > 0 && c0.default.createElement(m, {
        flexDirection: "column",
        marginLeft: 2,
        marginTop: 1
    }, A.instructions.map(odY)))
}
// @from(Ln 394003, Col 0)
function odY(A, q) {
    return c0.default.createElement(T, {
        key: q,
        dimColor: !0
    }, "• ", A)
}
// @from(Ln 394009, Col 4)
c0
// @from(Ln 394010, Col 4)
f_q = E(() => {
    e6();
    i6();
    _7();
    b7();
    c0 = t(P6(), 1)
})
// @from(Ln 394018, Col 0)
function v_q(A) {
    let q = A6(4),
        {
            isFocused: K,
            isSelected: Y,
            children: z
        } = A,
        _;
    if (q[0] !== z || q[1] !== K || q[2] !== Y) _ = T_q.default.createElement(QR, {
        isFocused: K,
        isSelected: Y
    }, z), q[0] = z, q[1] = K, q[2] = Y, q[3] = _;
    else _ = q[3];
    return _
}
// @from(Ln 394033, Col 4)
T_q
// @from(Ln 394034, Col 4)
N_q = E(() => {
    e6();
    U96();
    T_q = t(P6(), 1)
})
// @from(Ln 394039, Col 4)
qL1
// @from(Ln 394040, Col 4)
V_q = E(() => {
    qL1 = class qL1 extends Map {
        first;
        last;
        constructor(A) {
            let q = [],
                K, Y, z, _ = 0;
            for (let w of A) {
                let O = {
                    ...w,
                    previous: z,
                    next: void 0,
                    index: _
                };
                if (z) z.next = O;
                K ||= O, Y = O, q.push([w.value, O]), _++, z = O
            }
            super(q);
            this.first = K, this.last = Y
        }
    }
})
// @from(Ln 394065, Col 4)
kE
// @from(Ln 394065, Col 8)
adY = (A, q) => {
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
                let _ = Math.min(A.optionMap.size, A.visibleToIndex + 1),
                    w = _ - A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: w,
                    visibleToIndex: _
                }
            }
            case "focus-previous-option": {
                if (!A.focusedValue) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.previous || A.optionMap.last;
                if (!Y) return A;
                if (!K.previous && Y === A.optionMap.last) {
                    let O = A.optionMap.size,
                        $ = Math.max(0, O - A.visibleOptionCount);
                    return {
                        ...A,
                        focusedValue: Y.value,
                        visibleFromIndex: $,
                        visibleToIndex: O
                    }
                }
                if (!(Y.index <= A.visibleFromIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let _ = Math.max(0, A.visibleFromIndex - 1),
                    w = _ + A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: _,
                    visibleToIndex: w
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
// @from(Ln 394141, Col 4)
E_q = ({
        visibleOptionCount: A,
        defaultValue: q,
        options: K
    }) => {
        let Y = typeof A === "number" ? Math.min(A, K.length) : K.length,
            z = new qL1(K),
            _ = q ?? [];
        return {
            optionMap: z,
            visibleOptionCount: Y,
            focusedValue: z.first?.value,
            visibleFromIndex: 0,
            visibleToIndex: Y,
            previousValue: _,
            value: _
        }
    }
// @from(Ln 394159, Col 4)
y_q = ({
        visibleOptionCount: A = 5,
        options: q,
        defaultValue: K,
        onChange: Y,
        onSubmit: z
    }) => {
        let [_, w] = kE.useReducer(adY, {
            visibleOptionCount: A,
            defaultValue: K,
            options: q
        }, E_q), [O, $] = kE.useState(q);
        if (q !== O && !k_q(q, O)) w({
            type: "reset",
            state: E_q({
                visibleOptionCount: A,
                defaultValue: K,
                options: q
            })
        }), $(q);
        let H = kE.useCallback(() => {
                w({
                    type: "focus-next-option"
                })
            }, []),
            j = kE.useCallback(() => {
                w({
                    type: "focus-previous-option"
                })
            }, []),
            J = kE.useCallback(() => {
                w({
                    type: "toggle-focused-option"
                })
            }, []),
            M = kE.useCallback(() => {
                z?.(_.value)
            }, [_.value, z]),
            D = kE.useMemo(() => {
                return q.map((X, P) => ({
                    ...X,
                    index: P
                })).slice(_.visibleFromIndex, _.visibleToIndex)
            }, [q, _.visibleFromIndex, _.visibleToIndex]);
        return kE.useEffect(() => {
            if (!k_q(_.previousValue, _.value)) Y?.(_.value)
        }, [_.previousValue, _.value, q, Y]), {
            focusedValue: _.focusedValue,
            visibleFromIndex: _.visibleFromIndex,
            visibleToIndex: _.visibleToIndex,
            value: _.value,
            visibleOptions: D,
            focusNextOption: H,
            focusPreviousOption: j,
            toggleFocusedOption: J,
            submit: M
        }
    }
// @from(Ln 394217, Col 4)
L_q = E(() => {
    V_q();
    kE = t(P6(), 1)
})
// @from(Ln 394221, Col 4)
R_q = ({
    isDisabled: A = !1,
    state: q
}) => {
    jA((K, Y) => {
        if (Y.downArrow || Y.ctrl && K === "n" || !Y.ctrl && !Y.shift && K === "j") q.focusNextOption();
        if (Y.upArrow || Y.ctrl && K === "p" || !Y.ctrl && !Y.shift && K === "k") q.focusPreviousOption();
        if (K === " ") q.toggleFocusedOption();
        if (Y.return) q.submit()
    }, {
        isActive: !A
    })
}
// @from(Ln 394234, Col 4)
h_q = E(() => {
    i6()
})
// @from(Ln 394238, Col 0)
function bv6(A) {
    let q = A6(22),
        {
            isDisabled: K,
            visibleOptionCount: Y,
            highlightText: z,
            options: _,
            defaultValue: w,
            onChange: O,
            onSubmit: $
        } = A,
        H = K === void 0 ? !1 : K,
        j = Y === void 0 ? 5 : Y,
        J;
    if (q[0] !== w || q[1] !== O || q[2] !== $ || q[3] !== _ || q[4] !== j) J = {
        visibleOptionCount: j,
        options: _,
        defaultValue: w,
        onChange: O,
        onSubmit: $
    }, q[0] = w, q[1] = O, q[2] = $, q[3] = _, q[4] = j, q[5] = J;
    else J = q[5];
    let M = y_q(J),
        D;
    if (q[6] !== H || q[7] !== M) D = {
        isDisabled: H,
        state: M
    }, q[6] = H, q[7] = M, q[8] = D;
    else D = q[8];
    R_q(D);
    let X;
    if (q[9] !== z || q[10] !== H || q[11] !== M.focusedValue || q[12] !== M.value || q[13] !== M.visibleOptions) {
        let W;
        if (q[15] !== z || q[16] !== H || q[17] !== M.focusedValue || q[18] !== M.value) W = (Z) => {
            let G = Z.label;
            if (z && Z.label.includes(z)) {
                let f = Z.label.indexOf(z);
                G = Iv6.default.createElement(Iv6.default.Fragment, null, Z.label.slice(0, f), Iv6.default.createElement(T, {
                    bold: !0
                }, z), Z.label.slice(f + z.length))
            }
            return Iv6.default.createElement(v_q, {
                key: Z.value,
                isFocused: !H && M.focusedValue === Z.value,
                isSelected: M.value.includes(Z.value)
            }, G)
        }, q[15] = z, q[16] = H, q[17] = M.focusedValue, q[18] = M.value, q[19] = W;
        else W = q[19];
        X = M.visibleOptions.map(W), q[9] = z, q[10] = H, q[11] = M.focusedValue, q[12] = M.value, q[13] = M.visibleOptions, q[14] = X
    } else X = q[14];
    let P;
    if (q[20] !== X) P = Iv6.default.createElement(m, {
        flexDirection: "column"
    }, X), q[20] = X, q[21] = P;
    else P = q[21];
    return P
}
// @from(Ln 394295, Col 4)
Iv6
// @from(Ln 394296, Col 4)
KL1 = E(() => {
    e6();
    i6();
    N_q();
    L_q();
    h_q();
    Iv6 = t(P6(), 1)
})
// @from(Ln 394305, Col 0)
function tdY(A) {
    if (A.pending) return EN.default.createElement(T, null, "Press ", A.keyName, " again to exit");
    return EN.default.createElement(C8, null, EN.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), EN.default.createElement(a1, {
        shortcut: "Space",
        action: "toggle"
    }), EN.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), EN.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))
}
// @from(Ln 394324, Col 0)
function C_q(A) {
    let q = A6(14),
        {
            onSubmit: K,
            defaultSelections: Y
        } = A,
        [z, _] = S_q.useState(!1),
        w;
    if (q[0] !== K) w = (Z) => {
        if (Z.length === 0) {
            _(!0);
            return
        }
        _(!1), K(Z)
    }, q[0] = K, q[1] = w;
    else w = q[1];
    let O = w,
        $;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) $ = () => {
        _(!1)
    }, q[2] = $;
    else $ = q[2];
    let H = $,
        j;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) j = () => {
        _(!0)
    }, q[3] = j;
    else j = q[3];
    let J = j,
        M;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) M = EN.default.createElement(m, null, EN.default.createElement(T, {
        dimColor: !0
    }, "More workflow examples (issue triage, CI fixes, etc.) at:", " ", EN.default.createElement(y7, {
        url: "https://github.com/anthropics/claude-code-action/blob/main/examples/"
    }, "https://github.com/anthropics/claude-code-action/blob/main/examples/"))), q[4] = M;
    else M = q[4];
    let D;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) D = sdY.map(edY), q[5] = D;
    else D = q[5];
    let X;
    if (q[6] !== Y || q[7] !== O) X = EN.default.createElement(bv6, {
        options: D,
        defaultValue: Y,
        onSubmit: O,
        onChange: H
    }), q[6] = Y, q[7] = O, q[8] = X;
    else X = q[8];
    let P;
    if (q[9] !== z) P = z && EN.default.createElement(m, null, EN.default.createElement(T, {
        color: "error"
    }, "You must select at least one workflow to continue")), q[9] = z, q[10] = P;
    else P = q[10];
    let W;
    if (q[11] !== X || q[12] !== P) W = EN.default.createElement(m8, {
        title: "Select GitHub workflows to install",
        subtitle: "We'll create a workflow file in your repository for each one you select.",
        onCancel: J,
        inputGuide: tdY
    }, M, X, P), q[11] = X, q[12] = P, q[13] = W;
    else W = q[13];
    return W
}
// @from(Ln 394387, Col 0)
function edY(A) {
    return {
        label: A.label,
        value: A.value
    }
}
// @from(Ln 394393, Col 4)
EN
// @from(Ln 394393, Col 8)
S_q
// @from(Ln 394393, Col 13)
sdY
// @from(Ln 394394, Col 4)
I_q = E(() => {
    e6();
    i6();
    wq();
    KL1();
    Lq();
    OK();
    Xq();
    EN = t(P6(), 1), S_q = t(P6(), 1), sdY = [{
        value: "claude",
        label: "@Claude Code - Tag @claude in issues and PR comments"
    }, {
        value: "claude-review",
        label: "Claude Code Review - Automated code review on new PRs"
    }]
})
// @from(Ln 394410, Col 0)
async function AcY(A, q, K, Y, z, _, w) {
    let O = await z8("gh", ["api", `repos/${A}/contents/${K}`, "--jq", ".sha"]),
        $ = null;
    if (O.code === 0) $ = O.stdout.trim();
    let H = Y;
    if (z === "CLAUDE_CODE_OAUTH_TOKEN") H = Y.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, "claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}");
    else if (z !== "ANTHROPIC_API_KEY") H = Y.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, `anthropic_api_key: \${{ secrets.${z} }}`);
    let j = Buffer.from(H).toString("base64"),
        J = ["api", "--method", "PUT", `repos/${A}/contents/${K}`, "-f", `message=${$?`"Update ${_}"`:`"${_}"`}`, "-f", `content=${j}`, "-f", `branch=${q}`];
    if ($) J.push("-f", `sha=${$}`);
    let M = await z8("gh", J);
    if (M.code !== 0) {
        if (M.stderr.includes("422") && M.stderr.includes("sha")) throw d("tengu_setup_github_actions_failed", {
            reason: "failed_to_create_workflow_file",
            exit_code: M.code,
            ...w
        }), Error(`Failed to create workflow file ${K}: A Claude workflow file already exists in this repository. Please remove it first or update it manually.`);
        d("tengu_setup_github_actions_failed", {
            reason: "failed_to_create_workflow_file",
            exit_code: M.code,
            ...w
        });
        let D = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo,workflow
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
        throw Error(`Failed to create workflow file ${K}: ${M.stderr}${D}`)
    }
}
// @from(Ln 394441, Col 0)
async function b_q(A, q, K, Y, z = !1, _, w, O) {
    try {
        d("tengu_setup_github_actions_started", {
            skip_workflow: z,
            has_api_key: !!q,
            using_default_secret_name: K === "ANTHROPIC_API_KEY",
            selected_claude_workflow: _.includes("claude"),
            selected_claude_review_workflow: _.includes("claude-review"),
            ...O
        });
        let $ = await z8("gh", ["api", `repos/${A}`, "--jq", ".id"]);
        if ($.code !== 0) throw d("tengu_setup_github_actions_failed", {
            reason: "repo_not_found",
            exit_code: $.code,
            ...O
        }), Error(`Failed to access repository ${A}`);
        let H = await z8("gh", ["api", `repos/${A}`, "--jq", ".default_branch"]);
        if (H.code !== 0) throw d("tengu_setup_github_actions_failed", {
            reason: "failed_to_get_default_branch",
            exit_code: H.code,
            ...O
        }), Error(`Failed to get default branch: ${H.stderr}`);
        let j = H.stdout.trim(),
            J = await z8("gh", ["api", `repos/${A}/git/ref/heads/${j}`, "--jq", ".object.sha"]);
        if (J.code !== 0) throw d("tengu_setup_github_actions_failed", {
            reason: "failed_to_get_branch_sha",
            exit_code: J.code,
            ...O
        }), Error(`Failed to get branch SHA: ${J.stderr}`);
        let M = J.stdout.trim(),
            D = null;
        if (!z) {
            Y(), D = `add-claude-github-actions-${Date.now()}`;
            let X = await z8("gh", ["api", "--method", "POST", `repos/${A}/git/refs`, "-f", `ref=refs/heads/${D}`, "-f", `sha=${M}`]);
            if (X.code !== 0) throw d("tengu_setup_github_actions_failed", {
                reason: "failed_to_create_branch",
                exit_code: X.code,
                ...O
            }), Error(`Failed to create branch: ${X.stderr}`);
            Y();
            let P = [];
            if (_.includes("claude")) P.push({
                path: ".github/workflows/claude.yml",
                content: q_q,
                message: "Claude PR Assistant workflow"
            });
            if (_.includes("claude-review")) P.push({
                path: ".github/workflows/claude-code-review.yml",
                content: Y_q,
                message: "Claude Code Review workflow"
            });
            for (let W of P) await AcY(A, D, W.path, W.content, K, W.message, O)
        }
        if (Y(), q) {
            let X = await z8("gh", ["secret", "set", K, "--body", q, "--repo", A]);
            if (X.code !== 0) {
                d("tengu_setup_github_actions_failed", {
                    reason: "failed_to_set_api_key_secret",
                    exit_code: X.code,
                    ...O
                });
                let P = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
                throw Error(`Failed to set API key secret: ${X.stderr||"Unknown error"}${P}`)
            }
        }
        if (!z && D) {
            Y();
            let X = `https://github.com/${A}/compare/${j}...${D}?quick_pull=1&title=${encodeURIComponent(A_q)}&body=${encodeURIComponent(K_q)}`;
            await R9(X)
        }
        d("tengu_setup_github_actions_completed", {
            skip_workflow: z,
            has_api_key: !!q,
            auth_type: w,
            using_default_secret_name: K === "ANTHROPIC_API_KEY",
            selected_claude_workflow: _.includes("claude"),
            selected_claude_review_workflow: _.includes("claude-review"),
            ...O
        }), d1((X) => ({
            ...X,
            githubActionSetupCount: (X.githubActionSetupCount ?? 0) + 1
        }))
    } catch ($) {
        if (!$ || !($ instanceof Error) || !$.message.includes("Failed to")) d("tengu_setup_github_actions_failed", {
            reason: "unexpected_error",
            ...O
        });
        if ($ instanceof Error) _6($);
        throw $
    }
}
// @from(Ln 394537, Col 4)
x_q = E(() => {
    Eq();
    kX();
    V1();
    k1();
    k8()
})
// @from(Ln 394545, Col 0)
function m_q({
    onSuccess: A,
    onCancel: q
}) {
    let [K, Y] = pZ.useState({
        state: "starting"
    }), [z] = pZ.useState(() => new I96), [_, w] = pZ.useState(""), [O, $] = pZ.useState(0), [H, j] = pZ.useState(!1), [J, M] = pZ.useState(!1), D = pZ.useRef(new Set), X = KA(), P = Math.max(50, X.columns - u_q.length - 4);
    jA((f, v) => {
        if (K.state === "error")
            if (v.return && K.toRetry) w(""), $(0), Y({
                state: "about_to_retry",
                nextState: K.toRetry
            });
            else q()
    });
    async function W(f, v) {
        try {
            let [N, V] = f.split("#");
            if (!N || !V) {
                Y({
                    state: "error",
                    message: "Invalid code. Please make sure the full code was copied",
                    toRetry: {
                        state: "waiting_for_login",
                        url: v
                    }
                });
                return
            }
            d("tengu_oauth_manual_entry", {}), z.handleManualAuthCodeInput({
                authorizationCode: N,
                state: V
            })
        } catch (N) {
            _6(N), Y({
                state: "error",
                message: N.message,
                toRetry: {
                    state: "waiting_for_login",
                    url: v
                }
            })
        }
    }
    let Z = pZ.useCallback(async () => {
        D.current.forEach((f) => clearTimeout(f)), D.current.clear();
        try {
            let f = await z.startOAuthFlow(async (N) => {
                Y({
                    state: "waiting_for_login",
                    url: N
                });
                let V = setTimeout(j, 3000, !0);
                D.current.add(V)
            }, {
                loginWithClaudeAi: !0,
                inferenceOnly: !0,
                expiresIn: 31536000
            });
            Y({
                state: "processing"
            }), $f6(f);
            let v = setTimeout((N, V, L, h) => {
                N({
                    state: "success",
                    token: V
                });
                let R = setTimeout(L, 1000, V);
                h.current.add(R)
            }, 100, Y, f.accessToken, A, D);
            D.current.add(v)
        } catch (f) {
            let v = f.message;
            Y({
                state: "error",
                message: v,
                toRetry: {
                    state: "starting"
                }
            }), _6(f), d("tengu_oauth_error", {
                error: v
            })
        }
    }, [z, A]);
    pZ.useEffect(() => {
        if (K.state === "starting") Z()
    }, [K.state, Z]), pZ.useEffect(() => {
        if (K.state === "about_to_retry") {
            let f = setTimeout((v, N, V) => {
                N(v.state === "waiting_for_login"), V(v)
            }, 500, K.nextState, j, Y);
            D.current.add(f)
        }
    }, [K]), pZ.useEffect(() => {
        if (_ === "c" && K.state === "waiting_for_login" && H && !J) ZZ(K.url).then((f) => {
            if (f) M(!0), setTimeout(M, 2000, !1)
        }), w("")
    }, [_, K, H, J]), pZ.useEffect(() => {
        let f = D.current;
        return () => {
            z.cleanup(), f.forEach((v) => clearTimeout(v)), f.clear()
        }
    }, [z]);

    function G() {
        switch (K.state) {
            case "starting":
                return t3.default.createElement(m, null, t3.default.createElement(Wq, null), t3.default.createElement(T, null, "Starting authentication…"));
            case "waiting_for_login":
                return t3.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, !H && t3.default.createElement(m, null, t3.default.createElement(Wq, null), t3.default.createElement(T, null, "Opening browser to sign in with your Claude account…")), H && t3.default.createElement(m, null, t3.default.createElement(T, null, u_q), t3.default.createElement(J5, {
                    value: _,
                    onChange: w,
                    onSubmit: (f) => W(f, K.url),
                    cursorOffset: O,
                    onChangeCursorOffset: $,
                    columns: P
                })));
            case "processing":
                return t3.default.createElement(m, null, t3.default.createElement(Wq, null), t3.default.createElement(T, null, "Processing authentication…"));
            case "success":
                return t3.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, t3.default.createElement(T, {
                    color: "success"
                }, "✓ Authentication token created successfully!"), t3.default.createElement(T, {
                    dimColor: !0
                }, "Using token for GitHub Actions setup…"));
            case "error":
                return t3.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, t3.default.createElement(T, {
                    color: "error"
                }, "OAuth error: ", K.message), K.toRetry ? t3.default.createElement(T, {
                    dimColor: !0
                }, "Press Enter to try again, or any other key to cancel") : t3.default.createElement(T, {
                    dimColor: !0
                }, "Press any key to return to API key selection"));
            case "about_to_retry":
                return t3.default.createElement(m, {
                    flexDirection: "column",
                    gap: 1
                }, t3.default.createElement(T, {
                    color: "permission"
                }, "Retrying…"));
            default:
                return null
        }
    }
    return t3.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, K.state === "starting" && t3.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1
    }, t3.default.createElement(T, {
        bold: !0
    }, "Create Authentication Token"), t3.default.createElement(T, {
        dimColor: !0
    }, "Creating a long-lived token for GitHub Actions")), K.state !== "success" && K.state !== "starting" && K.state !== "processing" && t3.default.createElement(m, {
        key: "header",
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1
    }, t3.default.createElement(T, {
        bold: !0
    }, "Create Authentication Token"), t3.default.createElement(T, {
        dimColor: !0
    }, "Creating a long-lived token for GitHub Actions")), K.state === "waiting_for_login" && H && t3.default.createElement(m, {
        flexDirection: "column",
        key: "urlToCopy",
        gap: 1,
        paddingBottom: 1
    }, t3.default.createElement(m, {
        paddingX: 1
    }, t3.default.createElement(T, {
        dimColor: !0
    }, "Browser didn't open? Use the url below to sign in", " "), J ? t3.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : t3.default.createElement(T, {
        dimColor: !0
    }, t3.default.createElement(a1, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), t3.default.createElement(y7, {
        url: K.url
    }, t3.default.createElement(T, {
        dimColor: !0
    }, K.url))), t3.default.createElement(m, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1
    }, G()))
}
// @from(Ln 394745, Col 4)
t3
// @from(Ln 394745, Col 8)
pZ
// @from(Ln 394745, Col 12)
u_q = "Paste code here if prompted > "
// @from(Ln 394746, Col 4)
B_q = E(() => {
    i6();
    vc();
    Lq();
    AH();
    TZ1();
    fA();
    V1();
    LO();
    k1();
    _q();
    t3 = t(P6(), 1), pZ = t(P6(), 1)
})
// @from(Ln 394759, Col 4)
g_q = {}
// @from(Ln 394764, Col 0)
function KcY(A) {
    let [q] = IO.useState(() => RV()), [K, Y] = IO.useState({
        ...qcY,
        useExistingKey: !!q,
        selectedApiKeyOption: q ? "existing" : iH() ? "oauth" : "new"
    });
    IK(), IO.default.useEffect(() => {
        d("tengu_install_github_app_started", {})
    }, []);
    let z = IO.useCallback(async () => {
        let V = [];
        if ((await q9("gh --version", {
                shell: !0,
                reject: !1
            })).exitCode !== 0) V.push({
            title: "GitHub CLI not found",
            message: "GitHub CLI (gh) does not appear to be installed or accessible.",
            instructions: ["Install GitHub CLI from https://cli.github.com/", "macOS: brew install gh", "Windows: winget install --id GitHub.cli", "Linux: See installation instructions at https://github.com/cli/cli#installation"]
        });
        let h = await q9("gh auth status -a", {
            shell: !0,
            reject: !1
        });
        if (h.exitCode !== 0) V.push({
            title: "GitHub CLI not authenticated",
            message: "GitHub CLI does not appear to be authenticated.",
            instructions: ["Run: gh auth login", "Follow the prompts to authenticate with GitHub", "Or set up authentication using environment variables or other methods"]
        });
        else {
            let u = h.stdout.match(/Token scopes:.*$/m);
            if (u) {
                let I = u[0],
                    g = [];
                if (!I.includes("repo")) g.push("repo");
                if (!I.includes("workflow")) g.push("workflow");
                if (g.length > 0) {
                    Y((B) => ({
                        ...B,
                        step: "error",
                        error: `GitHub CLI is missing required permissions: ${g.join(", ")}.`,
                        errorReason: "Missing required scopes",
                        errorInstructions: [`Your GitHub CLI authentication is missing the "${g.join('" and "')}" scope${g.length>1?"s":""} needed to manage GitHub Actions and secrets.`, "", "To fix this, run:", "  gh auth refresh -h github.com -s repo,workflow", "", "This will add the necessary permissions to manage workflows and secrets."]
                    }));
                    return
                }
            }
        }
        let R = await ho() ?? "";
        d("tengu_install_github_app_step_completed", {
            step: "check-gh"
        }), Y((u) => ({
            ...u,
            warnings: V,
            currentRepo: R,
            selectedRepoName: R,
            useCurrentRepo: !!R,
            step: V.length > 0 ? "warnings" : "choose-repo"
        }))
    }, []);
    IO.default.useEffect(() => {
        if (K.step === "check-gh") z()
    }, [K.step, z]);
    let _ = IO.useCallback(async (V, L) => {
        Y((h) => ({
            ...h,
            step: "creating",
            currentWorkflowInstallStep: 0
        }));
        try {
            await b_q(K.selectedRepoName, V, L, () => {
                Y((h) => ({
                    ...h,
                    currentWorkflowInstallStep: h.currentWorkflowInstallStep + 1
                }))
            }, K.workflowAction === "skip", K.selectedWorkflows, K.authType, {
                useCurrentRepo: K.useCurrentRepo,
                workflowExists: K.workflowExists,
                secretExists: K.secretExists
            }), d("tengu_install_github_app_step_completed", {
                step: "creating"
            }), Y((h) => ({
                ...h,
                step: "success"
            }))
        } catch (h) {
            let R = h instanceof Error ? h.message : "Failed to set up GitHub Actions";
            if (R.includes("workflow file already exists")) d("tengu_install_github_app_error", {
                reason: "workflow_file_exists"
            }), Y((u) => ({
                ...u,
                step: "error",
                error: "A Claude workflow file already exists in this repository.",
                errorReason: "Workflow file conflict",
                errorInstructions: ["The file .github/workflows/claude.yml already exists", "You can either:", "  1. Delete the existing file and run this command again", "  2. Update the existing file manually using the template from:", `     ${PF}`]
            }));
            else d("tengu_install_github_app_error", {
                reason: "setup_github_actions_failed"
            }), Y((u) => ({
                ...u,
                step: "error",
                error: R,
                errorReason: "GitHub Actions setup failed",
                errorInstructions: []
            }))
        }
    }, [K.selectedRepoName, K.workflowAction, K.selectedWorkflows, K.useCurrentRepo, K.workflowExists, K.secretExists, K.authType]);
    async function w() {
        await R9("https://github.com/apps/claude")
    }
    async function O(V) {
        try {
            let L = await z8("gh", ["api", `repos/${V}`, "--jq", ".permissions.admin"]);
            if (L.code === 0) return {
                hasAccess: L.stdout.trim() === "true"
            };
            if (L.stderr.includes("404") || L.stderr.includes("Not Found")) return {
                hasAccess: !1,
                error: "repository_not_found"
            };
            return {
                hasAccess: !1
            }
        } catch {
            return {
                hasAccess: !1
            }
        }
    }
    async function $(V) {
        return (await z8("gh", ["api", `repos/${V}/contents/.github/workflows/claude.yml`, "--jq", ".sha"])).code === 0
    }
    async function H() {
        let V = await z8("gh", ["secret", "list", "--app", "actions", "--repo", K.selectedRepoName]);
        if (V.code === 0)
            if (V.stdout.split(`
`).some((R) => {
                    return /^ANTHROPIC_API_KEY\s+/.test(R)
                })) Y((R) => ({
                ...R,
                secretExists: !0,
                step: "check-existing-secret"
            }));
            else if (q) Y((R) => ({
            ...R,
            apiKeyOrOAuthToken: q,
            useExistingKey: !0
        })), await _(q, K.secretName);
        else Y((R) => ({
            ...R,
            step: "api-key"
        }));
        else if (q) Y((L) => ({
            ...L,
            apiKeyOrOAuthToken: q,
            useExistingKey: !0
        })), await _(q, K.secretName);
        else Y((L) => ({
            ...L,
            step: "api-key"
        }))
    }
    let j = async () => {
        if (K.step === "warnings") d("tengu_install_github_app_step_completed", {
            step: "warnings"
        }), Y((V) => ({
            ...V,
            step: "install-app"
        })), setTimeout(w, 0);
        else if (K.step === "choose-repo") {
            let V = K.useCurrentRepo ? K.currentRepo : K.selectedRepoName;
            if (!V.trim()) return;
            let L = [];
            if (V.includes("github.com")) {
                let u = V.match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
                if (!u) L.push({
                    title: "Invalid GitHub URL format",
                    message: "The repository URL format appears to be invalid.",
                    instructions: ["Use format: owner/repo or https://github.com/owner/repo", "Example: anthropics/claude-cli"]
                });
                else V = u[1]?.replace(/\.git$/, "") || ""
            }
            if (!V.includes("/")) L.push({
                title: "Repository format warning",
                message: 'Repository should be in format "owner/repo"',
                instructions: ["Use format: owner/repo", "Example: anthropics/claude-cli"]
            });
            let h = await O(V);
            if (h.error === "repository_not_found") L.push({
                title: "Repository not found",
                message: `Repository ${V} was not found or you don't have access.`,
                instructions: [`Check that the repository name is correct: ${V}`, "Ensure you have access to this repository", 'For private repositories, make sure your GitHub token has the "repo" scope', "You can add the repo scope with: gh auth refresh -h github.com -s repo,workflow"]
            });
            else if (!h.hasAccess) L.push({
                title: "Admin permissions required",
                message: `You might need admin permissions on ${V} to set up GitHub Actions.`,
                instructions: ["Repository admins can install GitHub Apps and set secrets", "Ask a repository admin to run this command if setup fails", "Alternatively, you can use the manual setup instructions"]
            });
            let R = await $(V);
            if (L.length > 0) {
                let u = [...K.warnings, ...L];
                Y((I) => ({
                    ...I,
                    selectedRepoName: V,
                    workflowExists: R,
                    warnings: u,
                    step: "warnings"
                }))
            } else d("tengu_install_github_app_step_completed", {
                step: "choose-repo"
            }), Y((u) => ({
                ...u,
                selectedRepoName: V,
                workflowExists: R,
                step: "install-app"
            })), setTimeout(w, 0)
        } else if (K.step === "install-app")
            if (d("tengu_install_github_app_step_completed", {
                    step: "install-app"
                }), K.workflowExists) Y((V) => ({
                ...V,
                step: "check-existing-workflow"
            }));
            else Y((V) => ({
                ...V,
                step: "select-workflows"
            }));
        else if (K.step === "check-existing-workflow") return;
        else if (K.step === "select-workflows") return;
        else if (K.step === "check-existing-secret")
            if (d("tengu_install_github_app_step_completed", {
                    step: "check-existing-secret"
                }), K.useExistingSecret) await _(null, K.secretName);
            else await _(K.apiKeyOrOAuthToken, K.secretName);
        else if (K.step === "api-key") {
            if (K.selectedApiKeyOption === "oauth") return;
            let V = K.selectedApiKeyOption === "existing" ? q : K.apiKeyOrOAuthToken;
            if (!V) {
                d("tengu_install_github_app_error", {
                    reason: "api_key_missing"
                }), Y((h) => ({
                    ...h,
                    step: "error",
                    error: "API key is required"
                }));
                return
            }
            Y((h) => ({
                ...h,
                apiKeyOrOAuthToken: V,
                useExistingKey: K.selectedApiKeyOption === "existing"
            }));
            let L = await z8("gh", ["secret", "list", "--app", "actions", "--repo", K.selectedRepoName]);
            if (L.code === 0)
                if (L.stdout.split(`
`).some((u) => {
                        return /^ANTHROPIC_API_KEY\s+/.test(u)
                    })) d("tengu_install_github_app_step_completed", {
                    step: "api-key"
                }), Y((u) => ({
                    ...u,
                    secretExists: !0,
                    step: "check-existing-secret"
                }));
                else d("tengu_install_github_app_step_completed", {
                    step: "api-key"
                }), await _(V, K.secretName);
            else d("tengu_install_github_app_step_completed", {
                step: "api-key"
            }), await _(V, K.secretName)
        }
    }, J = (V) => {
        Y((L) => ({
            ...L,
            selectedRepoName: V
        }))
    }, M = (V) => {
        Y((L) => ({
            ...L,
            apiKeyOrOAuthToken: V
        }))
    }, D = (V) => {
        Y((L) => ({
            ...L,
            selectedApiKeyOption: V
        }))
    }, X = IO.useCallback(() => {
        d("tengu_install_github_app_step_completed", {
            step: "api-key"
        }), Y((V) => ({
            ...V,
            step: "oauth-flow"
        }))
    }, []), P = IO.useCallback((V) => {
        d("tengu_install_github_app_step_completed", {
            step: "oauth-flow"
        }), Y((L) => ({
            ...L,
            apiKeyOrOAuthToken: V,
            useExistingKey: !1,
            secretName: "CLAUDE_CODE_OAUTH_TOKEN",
            authType: "oauth_token"
        })), _(V, "CLAUDE_CODE_OAUTH_TOKEN")
    }, [_]), W = IO.useCallback(() => {
        Y((V) => ({
            ...V,
            step: "api-key"
        }))
    }, []), Z = (V) => {
        if (V && !/^[a-zA-Z0-9_]+$/.test(V)) return;
        Y((L) => ({
            ...L,
            secretName: V
        }))
    }, G = (V) => {
        Y((L) => ({
            ...L,
            useCurrentRepo: V,
            selectedRepoName: V ? L.currentRepo : ""
        }))
    }, f = (V) => {
        Y((L) => ({
            ...L,
            useExistingKey: V
        }))
    }, v = (V) => {
        Y((L) => ({
            ...L,
            useExistingSecret: V,
            secretName: V ? "ANTHROPIC_API_KEY" : ""
        }))
    }, N = async (V) => {
        if (V === "exit") {
            A.onDone("Installation cancelled by user");
            return
        }
        if (d("tengu_install_github_app_step_completed", {
                step: "check-existing-workflow"
            }), Y((L) => ({
                ...L,
                workflowAction: V
            })), V === "skip" || V === "update")
            if (q) await H();
            else Y((L) => ({
                ...L,
                step: "api-key"
            }))
    };
    switch (jA(() => {
            if (K.step === "success" || K.step === "error") {
                if (K.step === "success") d("tengu_install_github_app_completed", {});
                A.onDone(K.step === "success" ? "GitHub Actions setup complete!" : K.error ? `Couldn't install GitHub App: ${K.error}
For manual setup instructions, see: ${PF}` : `GitHub App installation failed
For manual setup instructions, see: ${PF}`)
            }
        }), K.step) {
        case "check-gh":
            return IO.default.createElement(azq, null);
        case "warnings":
            return IO.default.createElement(G_q, {
                warnings: K.warnings,
                onContinue: j
            });
        case "choose-repo":
            return IO.default.createElement(tzq, {
                currentRepo: K.currentRepo,
                useCurrentRepo: K.useCurrentRepo,
                repoUrl: K.selectedRepoName,
                onRepoUrlChange: J,
                onToggleUseCurrentRepo: G,
                onSubmit: j
            });
        case "install-app":
            return IO.default.createElement(z_q, {
                repoUrl: K.selectedRepoName,
                onSubmit: j
            });
        case "check-existing-workflow":
            return IO.default.createElement(W_q, {
                repoName: K.selectedRepoName,
                onSelectAction: N
            });
        case "check-existing-secret":
            return IO.default.createElement(w_q, {
                useExistingSecret: K.useExistingSecret,
                secretName: K.secretName,
                onToggleUseExistingSecret: v,
                onSecretNameChange: Z,
                onSubmit: j
            });
        case "api-key":
            return IO.default.createElement($_q, {
                existingApiKey: q,
                useExistingKey: K.useExistingKey,
                apiKeyOrOAuthToken: K.apiKeyOrOAuthToken,
                onApiKeyChange: M,
                onToggleUseExistingKey: f,
                onSubmit: j,
                onCreateOAuthToken: iH() ? X : void 0,
                selectedOption: K.selectedApiKeyOption,
                onSelectOption: D
            });
        case "creating":
            return IO.default.createElement(j_q, {
                currentWorkflowInstallStep: K.currentWorkflowInstallStep,
                secretExists: K.secretExists,
                useExistingSecret: K.useExistingSecret,
                secretName: K.secretName,
                skipWorkflow: K.workflowAction === "skip",
                selectedWorkflows: K.selectedWorkflows
            });
        case "success":
            return IO.default.createElement(M_q, {
                secretExists: K.secretExists,
                useExistingSecret: K.useExistingSecret,
                secretName: K.secretName,
                skipWorkflow: K.workflowAction === "skip"
            });
        case "error":
            return IO.default.createElement(X_q, {
                error: K.error,
                errorReason: K.errorReason,
                errorInstructions: K.errorInstructions
            });
        case "select-workflows":
            return IO.default.createElement(C_q, {
                defaultSelections: K.selectedWorkflows,
                onSubmit: (V) => {
                    if (d("tengu_install_github_app_step_completed", {
                            step: "select-workflows"
                        }), Y((L) => ({
                            ...L,
                            selectedWorkflows: V
                        })), q) H();
                    else Y((L) => ({
                        ...L,
                        step: "api-key"
                    }))
                }
            });
        case "oauth-flow":
            return IO.default.createElement(m_q, {
                onSuccess: P,
                onCancel: W
            })
    }
}
// @from(Ln 395210, Col 0)
async function YcY(A) {
    return IO.default.createElement(KcY, {
        onDone: A
    })
}
// @from(Ln 395215, Col 4)
IO
// @from(Ln 395215, Col 8)
qcY
// @from(Ln 395216, Col 4)
F_q = E(() => {
    i6();
    fA();
    PO();
    Eq();
    WW();
    $5();
    kX();
    szq();
    ezq();
    __q();
    O_q();
    H_q();
    J_q();
    D_q();
    P_q();
    Z_q();
    f_q();
    I_q();
    x_q();
    B_q();
    V1();
    IO = t(P6(), 1), qcY = {
        step: "check-gh",
        selectedRepoName: "",
        currentRepo: "",
        useCurrentRepo: !1,
        apiKeyOrOAuthToken: "",
        useExistingKey: !0,
        currentWorkflowInstallStep: 0,
        warnings: [],
        secretExists: !1,
        secretName: "ANTHROPIC_API_KEY",
        useExistingSecret: !0,
        workflowExists: !1,
        selectedWorkflows: ["claude", "claude-review"],
        selectedApiKeyOption: "new",
        authType: "api_key"
    }
})
// @from(Ln 395256, Col 4)
zcY
// @from(Ln 395256, Col 9)
p_q
// @from(Ln 395257, Col 4)
Q_q = E(() => {
    fA();
    zcY = {
        type: "local-jsx",
        name: "install-github-app",
        description: "Set up Claude GitHub Actions for a repository",
        isEnabled: () => !process.env.DISABLE_INSTALL_GITHUB_APP_COMMAND && !uI(),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (F_q(), g_q)),
        userFacingName() {
            return "install-github-app"
        }
    }, p_q = zcY
})
// @from(Ln 395271, Col 4)
d_q = {}
// @from(Ln 395275, Col 0)
async function _cY() {
    if (d("tengu_install_slack_app_clicked", {}), d1((q) => ({
            ...q,
            slackAppInstallCount: (q.slackAppInstallCount ?? 0) + 1
        })), await R9(U_q)) return {
        type: "text",
        value: "Opening Slack app installation page in browser…"
    };
    else return {
        type: "text",
        value: `Couldn't open browser. Visit: ${U_q}`
    }
}
// @from(Ln 395288, Col 4)
U_q = "https://slack.com/marketplace/A08SF47R6P4-claude"
// @from(Ln 395289, Col 4)
c_q = E(() => {
    kX();
    k8();
    V1()
})
// @from(Ln 395294, Col 4)
wcY
// @from(Ln 395294, Col 9)
l_q
// @from(Ln 395295, Col 4)
i_q = E(() => {
    wcY = {
        type: "local",
        name: "install-slack-app",
        description: "Install the Claude Slack app",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (c_q(), d_q)),
        userFacingName() {
            return "install-slack-app"
        }
    }, l_q = wcY
})
// @from(Ln 395309, Col 4)
n_q
// @from(Ln 395310, Col 4)
r_q = E(() => {
    n_q = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 395317, Col 4)
hU8 = x((JcY) => {
    function o_q() {
        var A = {};
        return A["align-content"] = !1, A["align-items"] = !1, A["align-self"] = !1, A["alignment-adjust"] = !1, A["alignment-baseline"] = !1, A.all = !1, A["anchor-point"] = !1, A.animation = !1, A["animation-delay"] = !1, A["animation-direction"] = !1, A["animation-duration"] = !1, A["animation-fill-mode"] = !1, A["animation-iteration-count"] = !1, A["animation-name"] = !1, A["animation-play-state"] = !1, A["animation-timing-function"] = !1, A.azimuth = !1, A["backface-visibility"] = !1, A.background = !0, A["background-attachment"] = !0, A["background-clip"] = !0, A["background-color"] = !0, A["background-image"] = !0, A["background-origin"] = !0, A["background-position"] = !0, A["background-repeat"] = !0, A["background-size"] = !0, A["baseline-shift"] = !1, A.binding = !1, A.bleed = !1, A["bookmark-label"] = !1, A["bookmark-level"] = !1, A["bookmark-state"] = !1, A.border = !0, A["border-bottom"] = !0, A["border-bottom-color"] = !0, A["border-bottom-left-radius"] = !0, A["border-bottom-right-radius"] = !0, A["border-bottom-style"] = !0, A["border-bottom-width"] = !0, A["border-collapse"] = !0, A["border-color"] = !0, A["border-image"] = !0, A["border-image-outset"] = !0, A["border-image-repeat"] = !0, A["border-image-slice"] = !0, A["border-image-source"] = !0, A["border-image-width"] = !0, A["border-left"] = !0, A["border-left-color"] = !0, A["border-left-style"] = !0, A["border-left-width"] = !0, A["border-radius"] = !0, A["border-right"] = !0, A["border-right-color"] = !0, A["border-right-style"] = !0, A["border-right-width"] = !0, A["border-spacing"] = !0, A["border-style"] = !0, A["border-top"] = !0, A["border-top-color"] = !0, A["border-top-left-radius"] = !0, A["border-top-right-radius"] = !0, A["border-top-style"] = !0, A["border-top-width"] = !0, A["border-width"] = !0, A.bottom = !1, A["box-decoration-break"] = !0, A["box-shadow"] = !0, A["box-sizing"] = !0, A["box-snap"] = !0, A["box-suppress"] = !0, A["break-after"] = !0, A["break-before"] = !0, A["break-inside"] = !0, A["caption-side"] = !1, A.chains = !1, A.clear = !0, A.clip = !1, A["clip-path"] = !1, A["clip-rule"] = !1, A.color = !0, A["color-interpolation-filters"] = !0, A["column-count"] = !1, A["column-fill"] = !1, A["column-gap"] = !1, A["column-rule"] = !1, A["column-rule-color"] = !1, A["column-rule-style"] = !1, A["column-rule-width"] = !1, A["column-span"] = !1, A["column-width"] = !1, A.columns = !1, A.contain = !1, A.content = !1, A["counter-increment"] = !1, A["counter-reset"] = !1, A["counter-set"] = !1, A.crop = !1, A.cue = !1, A["cue-after"] = !1, A["cue-before"] = !1, A.cursor = !1, A.direction = !1, A.display = !0, A["display-inside"] = !0, A["display-list"] = !0, A["display-outside"] = !0, A["dominant-baseline"] = !1, A.elevation = !1, A["empty-cells"] = !1, A.filter = !1, A.flex = !1, A["flex-basis"] = !1, A["flex-direction"] = !1, A["flex-flow"] = !1, A["flex-grow"] = !1, A["flex-shrink"] = !1, A["flex-wrap"] = !1, A.float = !1, A["float-offset"] = !1, A["flood-color"] = !1, A["flood-opacity"] = !1, A["flow-from"] = !1, A["flow-into"] = !1, A.font = !0, A["font-family"] = !0, A["font-feature-settings"] = !0, A["font-kerning"] = !0, A["font-language-override"] = !0, A["font-size"] = !0, A["font-size-adjust"] = !0, A["font-stretch"] = !0, A["font-style"] = !0, A["font-synthesis"] = !0, A["font-variant"] = !0, A["font-variant-alternates"] = !0, A["font-variant-caps"] = !0, A["font-variant-east-asian"] = !0, A["font-variant-ligatures"] = !0, A["font-variant-numeric"] = !0, A["font-variant-position"] = !0, A["font-weight"] = !0, A.grid = !1, A["grid-area"] = !1, A["grid-auto-columns"] = !1, A["grid-auto-flow"] = !1, A["grid-auto-rows"] = !1, A["grid-column"] = !1, A["grid-column-end"] = !1, A["grid-column-start"] = !1, A["grid-row"] = !1, A["grid-row-end"] = !1, A["grid-row-start"] = !1, A["grid-template"] = !1, A["grid-template-areas"] = !1, A["grid-template-columns"] = !1, A["grid-template-rows"] = !1, A["hanging-punctuation"] = !1, A.height = !0, A.hyphens = !1, A.icon = !1, A["image-orientation"] = !1, A["image-resolution"] = !1, A["ime-mode"] = !1, A["initial-letters"] = !1, A["inline-box-align"] = !1, A["justify-content"] = !1, A["justify-items"] = !1, A["justify-self"] = !1, A.left = !1, A["letter-spacing"] = !0, A["lighting-color"] = !0, A["line-box-contain"] = !1, A["line-break"] = !1, A["line-grid"] = !1, A["line-height"] = !1, A["line-snap"] = !1, A["line-stacking"] = !1, A["line-stacking-ruby"] = !1, A["line-stacking-shift"] = !1, A["line-stacking-strategy"] = !1, A["list-style"] = !0, A["list-style-image"] = !0, A["list-style-position"] = !0, A["list-style-type"] = !0, A.margin = !0, A["margin-bottom"] = !0, A["margin-left"] = !0, A["margin-right"] = !0, A["margin-top"] = !0, A["marker-offset"] = !1, A["marker-side"] = !1, A.marks = !1, A.mask = !1, A["mask-box"] = !1, A["mask-box-outset"] = !1, A["mask-box-repeat"] = !1, A["mask-box-slice"] = !1, A["mask-box-source"] = !1, A["mask-box-width"] = !1, A["mask-clip"] = !1, A["mask-image"] = !1, A["mask-origin"] = !1, A["mask-position"] = !1, A["mask-repeat"] = !1, A["mask-size"] = !1, A["mask-source-type"] = !1, A["mask-type"] = !1, A["max-height"] = !0, A["max-lines"] = !1, A["max-width"] = !0, A["min-height"] = !0, A["min-width"] = !0, A["move-to"] = !1, A["nav-down"] = !1, A["nav-index"] = !1, A["nav-left"] = !1, A["nav-right"] = !1, A["nav-up"] = !1, A["object-fit"] = !1, A["object-position"] = !1, A.opacity = !1, A.order = !1, A.orphans = !1, A.outline = !1, A["outline-color"] = !1, A["outline-offset"] = !1, A["outline-style"] = !1, A["outline-width"] = !1, A.overflow = !1, A["overflow-wrap"] = !1, A["overflow-x"] = !1, A["overflow-y"] = !1, A.padding = !0, A["padding-bottom"] = !0, A["padding-left"] = !0, A["padding-right"] = !0, A["padding-top"] = !0, A.page = !1, A["page-break-after"] = !1, A["page-break-before"] = !1, A["page-break-inside"] = !1, A["page-policy"] = !1, A.pause = !1, A["pause-after"] = !1, A["pause-before"] = !1, A.perspective = !1, A["perspective-origin"] = !1, A.pitch = !1, A["pitch-range"] = !1, A["play-during"] = !1, A.position = !1, A["presentation-level"] = !1, A.quotes = !1, A["region-fragment"] = !1, A.resize = !1, A.rest = !1, A["rest-after"] = !1, A["rest-before"] = !1, A.richness = !1, A.right = !1, A.rotation = !1, A["rotation-point"] = !1, A["ruby-align"] = !1, A["ruby-merge"] = !1, A["ruby-position"] = !1, A["shape-image-threshold"] = !1, A["shape-outside"] = !1, A["shape-margin"] = !1, A.size = !1, A.speak = !1, A["speak-as"] = !1, A["speak-header"] = !1, A["speak-numeral"] = !1, A["speak-punctuation"] = !1, A["speech-rate"] = !1, A.stress = !1, A["string-set"] = !1, A["tab-size"] = !1, A["table-layout"] = !1, A["text-align"] = !0, A["text-align-last"] = !0, A["text-combine-upright"] = !0, A["text-decoration"] = !0, A["text-decoration-color"] = !0, A["text-decoration-line"] = !0, A["text-decoration-skip"] = !0, A["text-decoration-style"] = !0, A["text-emphasis"] = !0, A["text-emphasis-color"] = !0, A["text-emphasis-position"] = !0, A["text-emphasis-style"] = !0, A["text-height"] = !0, A["text-indent"] = !0, A["text-justify"] = !0, A["text-orientation"] = !0, A["text-overflow"] = !0, A["text-shadow"] = !0, A["text-space-collapse"] = !0, A["text-transform"] = !0, A["text-underline-position"] = !0, A["text-wrap"] = !0, A.top = !1, A.transform = !1, A["transform-origin"] = !1, A["transform-style"] = !1, A.transition = !1, A["transition-delay"] = !1, A["transition-duration"] = !1, A["transition-property"] = !1, A["transition-timing-function"] = !1, A["unicode-bidi"] = !1, A["vertical-align"] = !1, A.visibility = !1, A["voice-balance"] = !1, A["voice-duration"] = !1, A["voice-family"] = !1, A["voice-pitch"] = !1, A["voice-range"] = !1, A["voice-rate"] = !1, A["voice-stress"] = !1, A["voice-volume"] = !1, A.volume = !1, A["white-space"] = !1, A.widows = !1, A.width = !0, A["will-change"] = !1, A["word-break"] = !0, A["word-spacing"] = !0, A["word-wrap"] = !0, A["wrap-flow"] = !1, A["wrap-through"] = !1, A["writing-mode"] = !1, A["z-index"] = !1, A
    }

    function OcY(A, q, K) {}

    function $cY(A, q, K) {}
    var HcY = /javascript\s*\:/img;

    function jcY(A, q) {
        if (HcY.test(q)) return "";
        return q
    }
    JcY.whiteList = o_q();
    JcY.getDefaultWhiteList = o_q;
    JcY.onAttr = OcY;
    JcY.onIgnoreAttr = $cY;
    JcY.safeAttrValue = jcY
})
// @from(Ln 395338, Col 4)
SU8 = x((TVO, a_q) => {
    a_q.exports = {
        indexOf: function(A, q) {
            var K, Y;
            if (Array.prototype.indexOf) return A.indexOf(q);
            for (K = 0, Y = A.length; K < Y; K++)
                if (A[K] === q) return K;
            return -1
        },
        forEach: function(A, q, K) {
            var Y, z;
            if (Array.prototype.forEach) return A.forEach(q, K);
            for (Y = 0, z = A.length; Y < z; Y++) q.call(K, A[Y], Y, A)
        },
        trim: function(A) {
            if (String.prototype.trim) return A.trim();
            return A.replace(/(^\s*)|(\s*$)/g, "")
        },
        trimRight: function(A) {
            if (String.prototype.trimRight) return A.trimRight();
            return A.replace(/(\s*$)/g, "")
        }
    }
})
// @from(Ln 395362, Col 4)
t_q = x((vVO, s_q) => {
    var fn6 = SU8();

    function ZcY(A, q) {
        if (A = fn6.trimRight(A), A[A.length - 1] !== ";") A += ";";
        var K = A.length,
            Y = !1,
            z = 0,
            _ = 0,
            w = "";

        function O() {
            if (!Y) {
                var j = fn6.trim(A.slice(z, _)),
                    J = j.indexOf(":");
                if (J !== -1) {
                    var M = fn6.trim(j.slice(0, J)),
                        D = fn6.trim(j.slice(J + 1));
                    if (M) {
                        var X = q(z, w.length, M, D, j);
                        if (X) w += X + "; "
                    }
                }
            }
            z = _ + 1
        }
        for (; _ < K; _++) {
            var $ = A[_];
            if ($ === "/" && A[_ + 1] === "*") {
                var H = A.indexOf("*/", _ + 2);
                if (H === -1) break;
                _ = H + 1, z = _ + 1, Y = !1
            } else if ($ === "(") Y = !0;
            else if ($ === ")") Y = !1;
            else if ($ === ";")
                if (Y);
                else O();
            else if ($ === `
`) O()
        }
        return fn6.trim(w)
    }
    s_q.exports = ZcY
})
// @from(Ln 395406, Col 4)
K2q = x((VVO, q2q) => {
    var YL1 = hU8(),
        GcY = t_q(),
        NVO = SU8();

    function e_q(A) {
        return A === void 0 || A === null
    }

    function fcY(A) {
        var q = {};
        for (var K in A) q[K] = A[K];
        return q
    }

    function A2q(A) {
        A = fcY(A || {}), A.whiteList = A.whiteList || YL1.whiteList, A.onAttr = A.onAttr || YL1.onAttr, A.onIgnoreAttr = A.onIgnoreAttr || YL1.onIgnoreAttr, A.safeAttrValue = A.safeAttrValue || YL1.safeAttrValue, this.options = A
    }
    A2q.prototype.process = function(A) {
        if (A = A || "", A = A.toString(), !A) return "";
        var q = this,
            K = q.options,
            Y = K.whiteList,
            z = K.onAttr,
            _ = K.onIgnoreAttr,
            w = K.safeAttrValue,
            O = GcY(A, function($, H, j, J, M) {
                var D = Y[j],
                    X = !1;
                if (D === !0) X = D;
                else if (typeof D === "function") X = D(J);
                else if (D instanceof RegExp) X = D.test(J);
                if (X !== !0) X = !1;
                if (J = w(j, J), !J) return;
                var P = {
                    position: H,
                    sourcePosition: $,
                    source: M,
                    isWhite: X
                };
                if (X) {
                    var W = z(j, J, P);
                    if (e_q(W)) return j + ":" + J;
                    else return W
                } else {
                    var W = _(j, J, P);
                    if (!e_q(W)) return W
                }
            });
        return O
    };
    q2q.exports = A2q
})
// @from(Ln 395459, Col 4)
wL1 = x((_L1, CU8) => {
    var Y2q = hU8(),
        z2q = K2q();

    function TcY(A, q) {
        var K = new z2q(q);
        return K.process(A)
    }
    _L1 = CU8.exports = TcY;
    _L1.FilterCSS = z2q;
    for (zL1 in Y2q) _L1[zL1] = Y2q[zL1];
    var zL1;
    if (typeof window < "u") window.filterCSS = CU8.exports
})
// @from(Ln 395473, Col 4)
OL1 = x((kVO, _2q) => {
    _2q.exports = {
        indexOf: function(A, q) {
            var K, Y;
            if (Array.prototype.indexOf) return A.indexOf(q);
            for (K = 0, Y = A.length; K < Y; K++)
                if (A[K] === q) return K;
            return -1
        },
        forEach: function(A, q, K) {
            var Y, z;
            if (Array.prototype.forEach) return A.forEach(q, K);
            for (Y = 0, z = A.length; Y < z; Y++) q.call(K, A[Y], Y, A)
        },
        trim: function(A) {
            if (String.prototype.trim) return A.trim();
            return A.replace(/(^\s*)|(\s*$)/g, "")
        },
        spaceIndex: function(A) {
            var q = /\s|\n|\t/,
                K = q.exec(A);
            return K ? K.index : -1
        }
    }
})
// @from(Ln 395498, Col 4)
IU8 = x((FcY) => {
    var vcY = wL1().FilterCSS,
        NcY = wL1().getDefaultWhiteList,
        HL1 = OL1();

    function $2q() {
        return {
            a: ["target", "href", "title"],
            abbr: ["title"],
            address: [],
            area: ["shape", "coords", "href", "alt"],
            article: [],
            aside: [],
            audio: ["autoplay", "controls", "crossorigin", "loop", "muted", "preload", "src"],
            b: [],
            bdi: ["dir"],
            bdo: ["dir"],
            big: [],
            blockquote: ["cite"],
            br: [],
            caption: [],
            center: [],
            cite: [],
            code: [],
            col: ["align", "valign", "span", "width"],
            colgroup: ["align", "valign", "span", "width"],
            dd: [],
            del: ["datetime"],
            details: ["open"],
            div: [],
            dl: [],
            dt: [],
            em: [],
            figcaption: [],
            figure: [],
            font: ["color", "size", "face"],
            footer: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            header: [],
            hr: [],
            i: [],
            img: ["src", "alt", "title", "width", "height", "loading"],
            ins: ["datetime"],
            kbd: [],
            li: [],
            mark: [],
            nav: [],
            ol: [],
            p: [],
            pre: [],
            s: [],
            section: [],
            small: [],
            span: [],
            sub: [],
            summary: [],
            sup: [],
            strong: [],
            strike: [],
            table: ["width", "border", "align", "valign"],
            tbody: ["align", "valign"],
            td: ["width", "rowspan", "colspan", "align", "valign"],
            tfoot: ["align", "valign"],
            th: ["width", "rowspan", "colspan", "align", "valign"],
            thead: ["align", "valign"],
            tr: ["rowspan", "align", "valign"],
            tt: [],
            u: [],
            ul: [],
            video: ["autoplay", "controls", "crossorigin", "loop", "muted", "playsinline", "poster", "preload", "src", "height", "width"]
        }
    }
    var H2q = new vcY;

    function VcY(A, q, K) {}

    function kcY(A, q, K) {}

    function EcY(A, q, K) {}

    function ycY(A, q, K) {}

    function j2q(A) {
        return A.replace(RcY, "&lt;").replace(hcY, "&gt;")
    }

    function LcY(A, q, K, Y) {
        if (K = W2q(K), q === "href" || q === "src") {
            if (K = HL1.trim(K), K === "#") return "#";
            if (!(K.substr(0, 7) === "http://" || K.substr(0, 8) === "https://" || K.substr(0, 7) === "mailto:" || K.substr(0, 4) === "tel:" || K.substr(0, 11) === "data:image/" || K.substr(0, 6) === "ftp://" || K.substr(0, 2) === "./" || K.substr(0, 3) === "../" || K[0] === "#" || K[0] === "/")) return ""
        } else if (q === "background") {
            if ($L1.lastIndex = 0, $L1.test(K)) return ""
        } else if (q === "style") {
            if (w2q.lastIndex = 0, w2q.test(K)) return "";
            if (O2q.lastIndex = 0, O2q.test(K)) {
                if ($L1.lastIndex = 0, $L1.test(K)) return ""
            }
            if (Y !== !1) Y = Y || H2q, K = Y.process(K)
        }
        return K = Z2q(K), K
    }
    var RcY = /</g,
        hcY = />/g,
        ScY = /"/g,
        CcY = /&quot;/g,
        IcY = /&#([a-zA-Z0-9]*);?/gim,
        bcY = /&colon;?/gim,
        xcY = /&newline;?/gim,
        $L1 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,
        w2q = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,
        O2q = /u\s*r\s*l\s*\(.*/gi;

    function J2q(A) {
        return A.replace(ScY, "&quot;")
    }

    function M2q(A) {
        return A.replace(CcY, '"')
    }

    function D2q(A) {
        return A.replace(IcY, function(K, Y) {
            return Y[0] === "x" || Y[0] === "X" ? String.fromCharCode(parseInt(Y.substr(1), 16)) : String.fromCharCode(parseInt(Y, 10))
        })
    }

    function X2q(A) {
        return A.replace(bcY, ":").replace(xcY, " ")
    }

    function P2q(A) {
        var q = "";
        for (var K = 0, Y = A.length; K < Y; K++) q += A.charCodeAt(K) < 32 ? " " : A.charAt(K);
        return HL1.trim(q)
    }

    function W2q(A) {
        return A = M2q(A), A = D2q(A), A = X2q(A), A = P2q(A), A
    }

    function Z2q(A) {
        return A = J2q(A), A = j2q(A), A
    }

    function ucY() {
        return ""
    }

    function mcY(A, q) {
        if (typeof q !== "function") q = function() {};
        var K = !Array.isArray(A);

        function Y(w) {
            if (K) return !0;
            return HL1.indexOf(A, w) !== -1
        }
        var z = [],
            _ = !1;
        return {
            onIgnoreTag: function(w, O, $) {
                if (Y(w))
                    if ($.isClosing) {
                        var H = "[/removed]",
                            j = $.position + H.length;
                        return z.push([_ !== !1 ? _ : $.position, j]), _ = !1, H
                    } else {
                        if (!_) _ = $.position;
                        return "[removed]"
                    }
                else return q(w, O, $)
            },
            remove: function(w) {
                var O = "",
                    $ = 0;
                return HL1.forEach(z, function(H) {
                    O += w.slice($, H[0]), $ = H[1]
                }), O += w.slice($), O
            }
        }
    }

    function BcY(A) {
        var q = "",
            K = 0;
        while (K < A.length) {
            var Y = A.indexOf("<!--", K);
            if (Y === -1) {
                q += A.slice(K);
                break
            }
            q += A.slice(K, Y);
            var z = A.indexOf("-->", Y);
            if (z === -1) break;
            K = z + 3
        }
        return q
    }

    function gcY(A) {
        var q = A.split("");
        return q = q.filter(function(K) {
            var Y = K.charCodeAt(0);
            if (Y === 127) return !1;
            if (Y <= 31) {
                if (Y === 10 || Y === 13) return !0;
                return !1
            }
            return !0
        }), q.join("")
    }
    FcY.whiteList = $2q();
    FcY.getDefaultWhiteList = $2q;
    FcY.onTag = VcY;
    FcY.onIgnoreTag = kcY;
    FcY.onTagAttr = EcY;
    FcY.onIgnoreTagAttr = ycY;
    FcY.safeAttrValue = LcY;
    FcY.escapeHtml = j2q;
    FcY.escapeQuote = J2q;
    FcY.unescapeQuote = M2q;
    FcY.escapeHtmlEntities = D2q;
    FcY.escapeDangerHtml5Entities = X2q;
    FcY.clearNonPrintableCharacter = P2q;
    FcY.friendlyAttrValue = W2q;
    FcY.escapeAttrValue = Z2q;
    FcY.onIgnoreTagStripAll = ucY;
    FcY.StripTagBody = mcY;
    FcY.stripCommentTag = BcY;
    FcY.stripBlankChar = gcY;
    FcY.attributeWrapSign = '"';
    FcY.cssFilter = H2q;
    FcY.getDefaultCSSWhiteList = NcY
})
// @from(Ln 395736, Col 4)
bU8 = x((ZlY) => {
    var P16 = OL1();

    function $lY(A) {
        var q = P16.spaceIndex(A),
            K;
        if (q === -1) K = A.slice(1, -1);
        else K = A.slice(1, q + 1);
        if (K = P16.trim(K).toLowerCase(), K.slice(0, 1) === "/") K = K.slice(1);
        if (K.slice(-1) === "/") K = K.slice(0, -1);
        return K
    }

    function HlY(A) {
        return A.slice(0, 2) === "</"
    }

    function jlY(A, q, K) {
        var Y = "",
            z = 0,
            _ = !1,
            w = !1,
            O = 0,
            $ = A.length,
            H = "",
            j = "";
        A: for (O = 0; O < $; O++) {
            var J = A.charAt(O);
            if (_ === !1) {
                if (J === "<") {
                    _ = O;
                    continue
                }
            } else if (w === !1) {
                if (J === "<") {
                    Y += K(A.slice(z, O)), _ = O, z = O;
                    continue
                }
                if (J === ">" || O === $ - 1) {
                    Y += K(A.slice(z, _)), j = A.slice(_, O + 1), H = $lY(j), Y += q(_, Y.length, H, j, HlY(j)), z = O + 1, _ = !1;
                    continue
                }
                if (J === '"' || J === "'") {
                    var M = 1,
                        D = A.charAt(O - M);
                    while (D.trim() === "" || D === "=") {
                        if (D === "=") {
                            w = J;
                            continue A
                        }
                        D = A.charAt(O - ++M)
                    }
                }
            } else if (J === w) {
                w = !1;
                continue
            }
        }
        if (z < $) Y += K(A.substr(z));
        return Y
    }
    var JlY = /[^a-zA-Z0-9\\_:.-]/gim;

    function MlY(A, q) {
        var K = 0,
            Y = 0,
            z = [],
            _ = !1,
            w = A.length;

        function O(M, D) {
            if (M = P16.trim(M), M = M.replace(JlY, "").toLowerCase(), M.length < 1) return;
            var X = q(M, D || "");
            if (X) z.push(X)
        }
        for (var $ = 0; $ < w; $++) {
            var H = A.charAt($),
                j, J;
            if (_ === !1 && H === "=") {
                _ = A.slice(K, $), K = $ + 1, Y = A.charAt(K) === '"' || A.charAt(K) === "'" ? K : XlY(A, $ + 1);
                continue
            }
            if (_ !== !1) {
                if ($ === Y)
                    if (J = A.indexOf(H, $ + 1), J === -1) break;
                    else {
                        j = P16.trim(A.slice(Y + 1, J)), O(_, j), _ = !1, $ = J, K = $ + 1;
                        continue
                    }
            }
            if (/\s|\n|\t/.test(H))
                if (A = A.replace(/\s|\n|\t/g, " "), _ === !1)
                    if (J = DlY(A, $), J === -1) {
                        j = P16.trim(A.slice(K, $)), O(j), _ = !1, K = $ + 1;
                        continue
                    } else {
                        $ = J - 1;
                        continue
                    }
            else if (J = PlY(A, $ - 1), J === -1) {
                j = P16.trim(A.slice(K, $)), j = G2q(j), O(_, j), _ = !1, K = $ + 1;
                continue
            } else continue
        }
        if (K < A.length)
            if (_ === !1) O(A.slice(K));
            else O(_, G2q(P16.trim(A.slice(K))));
        return P16.trim(z.join(" "))
    }

    function DlY(A, q) {
        for (; q < A.length; q++) {
            var K = A[q];
            if (K === " ") continue;
            if (K === "=") return q;
            return -1
        }
    }

    function XlY(A, q) {
        for (; q < A.length; q++) {
            var K = A[q];
            if (K === " ") continue;
            if (K === "'" || K === '"') return q;
            return -1
        }
    }

    function PlY(A, q) {
        for (; q > 0; q--) {
            var K = A[q];
            if (K === " ") continue;
            if (K === "=") return q;
            return -1
        }
    }

    function WlY(A) {
        if (A[0] === '"' && A[A.length - 1] === '"' || A[0] === "'" && A[A.length - 1] === "'") return !0;
        else return !1
    }

    function G2q(A) {
        if (WlY(A)) return A.substr(1, A.length - 2);
        else return A
    }
    ZlY.parseTag = jlY;
    ZlY.parseAttr = MlY
})
// @from(Ln 395885, Col 4)
N2q = x((LVO, v2q) => {
    var TlY = wL1().FilterCSS,
        Nh = IU8(),
        f2q = bU8(),
        vlY = f2q.parseTag,
        NlY = f2q.parseAttr,
        JL1 = OL1();

    function jL1(A) {
        return A === void 0 || A === null
    }

    function VlY(A) {
        var q = JL1.spaceIndex(A);
        if (q === -1) return {
            html: "",
            closing: A[A.length - 2] === "/"
        };
        A = JL1.trim(A.slice(q + 1, -1));
        var K = A[A.length - 1] === "/";
        if (K) A = JL1.trim(A.slice(0, -1));
        return {
            html: A,
            closing: K
        }
    }

    function klY(A) {
        var q = {};
        for (var K in A) q[K] = A[K];
        return q
    }

    function ElY(A) {
        var q = {};
        for (var K in A)
            if (Array.isArray(A[K])) q[K.toLowerCase()] = A[K].map(function(Y) {
                return Y.toLowerCase()
            });
            else q[K.toLowerCase()] = A[K];
        return q
    }

    function T2q(A) {
        if (A = klY(A || {}), A.stripIgnoreTag) {
            if (A.onIgnoreTag) console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time');
            A.onIgnoreTag = Nh.onIgnoreTagStripAll
        }
        if (A.whiteList || A.allowList) A.whiteList = ElY(A.whiteList || A.allowList);
        else A.whiteList = Nh.whiteList;
        if (this.attributeWrapSign = A.singleQuotedAttributeValue === !0 ? "'" : Nh.attributeWrapSign, A.onTag = A.onTag || Nh.onTag, A.onTagAttr = A.onTagAttr || Nh.onTagAttr, A.onIgnoreTag = A.onIgnoreTag || Nh.onIgnoreTag, A.onIgnoreTagAttr = A.onIgnoreTagAttr || Nh.onIgnoreTagAttr, A.safeAttrValue = A.safeAttrValue || Nh.safeAttrValue, A.escapeHtml = A.escapeHtml || Nh.escapeHtml, this.options = A, A.css === !1) this.cssFilter = !1;
        else A.css = A.css || {}, this.cssFilter = new TlY(A.css)
    }
    T2q.prototype.process = function(A) {
        if (A = A || "", A = A.toString(), !A) return "";
        var q = this,
            K = q.options,
            Y = K.whiteList,
            z = K.onTag,
            _ = K.onIgnoreTag,
            w = K.onTagAttr,
            O = K.onIgnoreTagAttr,
            $ = K.safeAttrValue,
            H = K.escapeHtml,
            j = q.attributeWrapSign,
            J = q.cssFilter;
        if (K.stripBlankChar) A = Nh.stripBlankChar(A);
        if (!K.allowCommentTag) A = Nh.stripCommentTag(A);
        var M = !1;
        if (K.stripIgnoreTagBody) M = Nh.StripTagBody(K.stripIgnoreTagBody, _), _ = M.onIgnoreTag;
        var D = vlY(A, function(X, P, W, Z, G) {
            var f = {
                    sourcePosition: X,
                    position: P,
                    isClosing: G,
                    isWhite: Object.prototype.hasOwnProperty.call(Y, W)
                },
                v = z(W, Z, f);
            if (!jL1(v)) return v;
            if (f.isWhite) {
                if (f.isClosing) return "</" + W + ">";
                var N = VlY(Z),
                    V = Y[W],
                    L = NlY(N.html, function(h, R) {
                        var u = JL1.indexOf(V, h) !== -1,
                            I = w(W, h, R, u);
                        if (!jL1(I)) return I;
                        if (u)
                            if (R = $(W, h, R, J), R) return h + "=" + j + R + j;
                            else return h;
                        else {
                            if (I = O(W, h, R, u), !jL1(I)) return I;
                            return
                        }
                    });
                if (Z = "<" + W, L) Z += " " + L;
                if (N.closing) Z += " /";
                return Z += ">", Z
            } else {
                if (v = _(W, Z, f), !jL1(v)) return v;
                return H(Z)
            }
        }, H);
        if (M) D = M.remove(D);
        return D
    };
    v2q.exports = T2q
})
// @from(Ln 395993, Col 4)
L2q = x((xv6, ML1) => {
    var V2q = IU8(),
        k2q = bU8(),
        E2q = N2q();

    function y2q(A, q) {
        var K = new E2q(q);
        return K.process(A)
    }
    xv6 = ML1.exports = y2q;
    xv6.filterXSS = y2q;
    xv6.FilterXSS = E2q;
    (function() {
        for (var A in V2q) xv6[A] = V2q[A];
        for (var q in k2q) xv6[q] = k2q[q]
    })();
    if (typeof window < "u") window.filterXSS = ML1.exports;

    function ylY() {
        return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope
    }
    if (ylY()) self.filterXSS = ML1.exports
})
// @from(Ln 396033, Col 0)
function R2q(A) {
    try {
        let q = new URL(A);
        for (let K of blY)
            if (q.searchParams.has(K)) q.searchParams.set(K, "[REDACTED]");
        return q.toString()
    } catch {
        return A
    }
}
// @from(Ln 396043, Col 0)
async function h2q(A) {
    if (!A.ok) return A;
    let q = await A.text(),
        K;
    try {
        K = i1(q)
    } catch {
        return new Response(q, A)
    }
    if (Hw1.safeParse(K).success) return new Response(q, A);
    let Y = rx6.safeParse(K);
    if (!Y.success) return new Response(q, A);
    let z = xlY.has(Y.data.error) ? {
        error: "invalid_grant",
        error_description: Y.data.error_description ?? `Server returned non-standard error code: ${Y.data.error}`
    } : Y.data;
    return new Response(B6(z), {
        status: 400,
        statusText: "Bad Request",
        headers: A.headers
    })
}
// @from(Ln 396066, Col 0)
function I2q() {
    return async (A, q) => {
        let K = AbortSignal.timeout(IlY),
            Y = q?.method?.toUpperCase() === "POST";
        if (!q?.signal) {
            let O = await fetch(A, {
                ...q,
                signal: K
            });
            return Y ? h2q(O) : O
        }
        let z = new AbortController,
            _ = () => z.abort();
        q.signal.addEventListener("abort", _), K.addEventListener("abort", _);
        let w = () => {
            q.signal?.removeEventListener("abort", _), K.removeEventListener("abort", _)
        };
        if (q.signal.aborted) z.abort();
        try {
            let O = await fetch(A, {
                ...q,
                signal: z.signal
            });
            return w(), Y ? h2q(O) : O
        } catch (O) {
            throw w(), O
        }
    }
}
// @from(Ln 396095, Col 0)
async function DL1(A, q, K) {
    if (q) {
        if (!q.startsWith("https://")) throw Error(`authServerMetadataUrl must use https:// (got: ${q})`);
        let z = await (K ?? I2q())(q, {
            headers: {
                Accept: "application/json"
            }
        });
        if (z.ok) return nx6.parse(await z.json());
        throw Error(`HTTP ${z.status} fetching configured auth server metadata from ${q}`)
    }
    return ox6(new URL(A), {
        ...K && {
            fetchFn: K
        }
    })
}
// @from(Ln 396113, Col 0)
function b2q(A = BU8) {
    return `http://localhost:${A}/callback`
}
// @from(Ln 396117, Col 0)
function mlY() {
    let A = parseInt(process.env.MCP_OAUTH_CALLBACK_PORT || "", 10);
    return A > 0 ? A : void 0
}
// @from(Ln 396121, Col 0)
async function BlY() {
    let A = mlY();
    if (A) return A;
    let {
        min: q,
        max: K
    } = ulY, Y = K - q + 1, z = Math.min(Y, 100);
    for (let _ = 0; _ < z; _++) {
        let w = q + Math.floor(Math.random() * Y);
        try {
            return await new Promise((O, $) => {
                let H = uU8();
                H.once("error", $), H.listen(w, () => {
                    H.close(() => O())
                })
            }), w
        } catch {
            continue
        }
    }
    try {
        return await new Promise((_, w) => {
            let O = uU8();
            O.once("error", w), O.listen(BU8, () => {
                O.close(() => _())
            })
        }), BU8
    } catch {
        throw Error("No available ports for OAuth redirect")
    }
}
// @from(Ln 396153, Col 0)
function l0(A, q) {
    let K = B6({
            type: q.type,
            url: q.url,
            headers: q.headers || {}
        }),
        Y = RlY("sha256").update(K).digest("hex").substring(0, 16);
    return `${A}|${Y}`
}
// @from(Ln 396162, Col 0)
async function S2q({
    serverName: A,
    endpoint: q,
    token: K,
    tokenTypeHint: Y,
    clientId: z,
    accessToken: _
}) {
    let w = new URLSearchParams;
    if (w.set("token", K), w.set("token_type_hint", Y), z) w.set("client_id", z);
    else n1(A, `No client_id available for ${Y} revocation - server may reject`);
    let O = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    try {
        await X8.post(q, w, {
            headers: O
        }), n1(A, `Successfully revoked ${Y}`)
    } catch ($) {
        if (X8.isAxiosError($) && $.response?.status === 401 && _) n1(A, `Got 401, retrying ${Y} revocation with Bearer auth`), await X8.post(q, w, {
            headers: {
                ...O,
                Authorization: `Bearer ${_}`
            }
        }), n1(A, `Successfully revoked ${Y} with Bearer auth`);
        else throw $
    }
}