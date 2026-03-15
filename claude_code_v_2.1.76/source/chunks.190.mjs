
// @from(Ln 491085, Col 0)
function KIq(A) {
    let q = A6(115),
        {
            question: K,
            questions: Y,
            currentQuestionIndex: z,
            answers: _,
            questionStates: w,
            hideSubmitTab: O,
            planFilePath: $,
            minContentHeight: H,
            minContentWidth: j,
            onUpdateQuestionState: J,
            onAnswer: M,
            onTextInputFocus: D,
            onCancel: X,
            onSubmit: P,
            onTabPrev: W,
            onTabNext: Z,
            onRespondToClaude: G,
            onFinishPlanInterview: f,
            onImagePaste: v,
            pastedContents: N,
            onRemoveImage: V
        } = A,
        L = O === void 0 ? !1 : O,
        h = M1(MWz) === "plan",
        [R, u] = PY.useState(!1),
        [I, g] = PY.useState(0),
        [B, b] = PY.useState(!1),
        p;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let V6 = vh();
        p = V6 ? Y$(V6) : null, q[0] = p
    } else p = q[0];
    let Q = p,
        U;
    if (q[1] !== D) U = (V6) => {
        let b6 = V6 === "__other__";
        b(b6), D(b6)
    }, q[1] = D, q[2] = U;
    else U = q[2];
    let r = U,
        e;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) e = () => {
        u(!0)
    }, q[3] = e;
    else e = q[3];
    let Y6 = e,
        H6;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) H6 = () => {
        u(!1)
    }, q[4] = H6;
    else H6 = q[4];
    let J6 = H6,
        K6;
    if (q[5] !== I || q[6] !== R || q[7] !== h || q[8] !== X || q[9] !== f || q[10] !== G) K6 = (V6, b6) => {
        if (!R) return;
        if (b6.upArrow || b6.ctrl && V6 === "p") {
            if (I === 0) J6();
            else g(0);
            return
        }
        if (b6.downArrow || b6.ctrl && V6 === "n") {
            if (h && I === 0) g(1);
            return
        }
        if (b6.return) {
            if (I === 0) G();
            else f();
            return
        }
        if (b6.escape) X()
    }, q[5] = I, q[6] = R, q[7] = h, q[8] = X, q[9] = f, q[10] = G, q[11] = K6;
    else K6 = q[11];
    let s;
    if (q[12] !== R) s = {
        isActive: R
    }, q[12] = R, q[13] = s;
    else s = q[13];
    jA(K6, s);
    let X6, z6, N6;
    if (q[14] !== J || q[15] !== K || q[16] !== w) {
        let V6 = K.options.map(JWz);
        z6 = K.question;
        let b6 = w[z6],
            E6;
        if (q[20] !== J || q[21] !== K.multiSelect || q[22] !== z6) E6 = async (n6, d6) => {
            let S6 = await NN(n6);
            if (S6.content !== null && S6.content !== n6) d6(S6.content), J(z6, {
                textInputValue: S6.content
            }, K.multiSelect ?? !1)
        }, q[20] = J, q[21] = K.multiSelect, q[22] = z6, q[23] = E6;
        else E6 = q[23];
        X6 = E6;
        let U6 = K.multiSelect ? "Type something" : "Type something.",
            c6 = b6?.textInputValue ?? "",
            K1;
        if (q[24] !== J || q[25] !== K.multiSelect || q[26] !== z6) K1 = (n6) => {
            J(z6, {
                textInputValue: n6
            }, K.multiSelect ?? !1)
        }, q[24] = J, q[25] = K.multiSelect, q[26] = z6, q[27] = K1;
        else K1 = q[27];
        let j6;
        if (q[28] !== U6 || q[29] !== c6 || q[30] !== K1) j6 = {
            type: "input",
            value: "__other__",
            label: "Other",
            placeholder: U6,
            initialValue: c6,
            onChange: K1
        }, q[28] = U6, q[29] = c6, q[30] = K1, q[31] = j6;
        else j6 = q[31];
        let W6 = j6;
        N6 = [...V6, W6], q[14] = J, q[15] = K, q[16] = w, q[17] = X6, q[18] = z6, q[19] = N6
    } else X6 = q[17], z6 = q[18], N6 = q[19];
    let $6 = N6;
    if (!K.multiSelect && K.options.some(jWz)) {
        let V6;
        if (q[32] !== _ || q[33] !== z || q[34] !== L || q[35] !== H || q[36] !== j || q[37] !== M || q[38] !== X || q[39] !== f || q[40] !== G || q[41] !== Z || q[42] !== W || q[43] !== D || q[44] !== J || q[45] !== K || q[46] !== w || q[47] !== Y) V6 = PY.default.createElement(AIq, {
            question: K,
            questions: Y,
            currentQuestionIndex: z,
            answers: _,
            questionStates: w,
            hideSubmitTab: L,
            minContentHeight: H,
            minContentWidth: j,
            onUpdateQuestionState: J,
            onAnswer: M,
            onTextInputFocus: D,
            onCancel: X,
            onTabPrev: W,
            onTabNext: Z,
            onRespondToClaude: G,
            onFinishPlanInterview: f
        }), q[32] = _, q[33] = z, q[34] = L, q[35] = H, q[36] = j, q[37] = M, q[38] = X, q[39] = f, q[40] = G, q[41] = Z, q[42] = W, q[43] = D, q[44] = J, q[45] = K, q[46] = w, q[47] = Y, q[48] = V6;
        else V6 = q[48];
        return V6
    }
    let o;
    if (q[49] !== h || q[50] !== $) o = h && $ && PY.default.createElement(m, {
        flexDirection: "column",
        gap: 0
    }, PY.default.createElement(DD, {
        dividerColor: "inactive"
    }), PY.default.createElement(T, {
        color: "inactive"
    }, "Planning: ", PY.default.createElement(Qk, {
        filePath: $
    }))), q[49] = h, q[50] = $, q[51] = o;
    else o = q[51];
    let a;
    if (q[52] === Symbol.for("react.memo_cache_sentinel")) a = PY.default.createElement(DD, {
        dividerColor: "inactive",
        boxProps: {
            marginTop: -1
        }
    }), q[52] = a;
    else a = q[52];
    let i;
    if (q[53] !== _ || q[54] !== z || q[55] !== L || q[56] !== Y) i = PY.default.createElement(kV6, {
        questions: Y,
        currentQuestionIndex: z,
        answers: _,
        hideSubmitTab: L
    }), q[53] = _, q[54] = z, q[55] = L, q[56] = Y, q[57] = i;
    else i = q[57];
    let l;
    if (q[58] !== K.question) l = PY.default.createElement(be, {
        title: K.question,
        color: "text"
    }), q[58] = K.question, q[59] = l;
    else l = q[59];
    let q6;
    if (q[60] !== z || q[61] !== r || q[62] !== X6 || q[63] !== R || q[64] !== M || q[65] !== X || q[66] !== v || q[67] !== V || q[68] !== P || q[69] !== J || q[70] !== $6 || q[71] !== N || q[72] !== K.multiSelect || q[73] !== K.question || q[74] !== w || q[75] !== z6 || q[76] !== Y.length) q6 = PY.default.createElement(m, {
        marginTop: 1
    }, K.multiSelect ? PY.default.createElement(sN4, {
        key: K.question,
        options: $6,
        defaultValue: w[K.question]?.selectedValue,
        onChange: (V6) => {
            J(z6, {
                selectedValue: V6
            }, !0);
            let b6 = V6.includes("__other__") ? w[z6]?.textInputValue : void 0,
                E6 = V6.filter(HWz).concat(b6 ? [b6] : []);
            M(z6, E6, void 0, !1)
        },
        onFocus: r,
        onCancel: X,
        submitButtonText: z === Y.length - 1 ? "Submit" : "Next",
        onSubmit: P,
        onDownFromLastItem: Y6,
        isDisabled: R,
        onOpenEditor: X6,
        onImagePaste: v,
        pastedContents: N,
        onRemoveImage: V
    }) : PY.default.createElement(T8, {
        key: K.question,
        options: $6,
        defaultValue: w[K.question]?.selectedValue,
        onChange: (V6) => {
            J(z6, {
                selectedValue: V6
            }, !1);
            let b6 = V6 === "__other__" ? w[z6]?.textInputValue : void 0;
            M(z6, V6, b6)
        },
        onFocus: r,
        onCancel: X,
        onDownFromLastItem: Y6,
        isDisabled: R,
        layout: "compact-vertical",
        onOpenEditor: X6,
        onImagePaste: v,
        pastedContents: N,
        onRemoveImage: V
    })), q[60] = z, q[61] = r, q[62] = X6, q[63] = R, q[64] = M, q[65] = X, q[66] = v, q[67] = V, q[68] = P, q[69] = J, q[70] = $6, q[71] = N, q[72] = K.multiSelect, q[73] = K.question, q[74] = w, q[75] = z6, q[76] = Y.length, q[77] = q6;
    else q6 = q[77];
    let w6;
    if (q[78] === Symbol.for("react.memo_cache_sentinel")) w6 = PY.default.createElement(DD, {
        dividerColor: "inactive"
    }), q[78] = w6;
    else w6 = q[78];
    let O6;
    if (q[79] !== I || q[80] !== R) O6 = R && I === 0 ? PY.default.createElement(T, {
        color: "suggestion"
    }, a6.pointer) : PY.default.createElement(T, null, " "), q[79] = I, q[80] = R, q[81] = O6;
    else O6 = q[81];
    let L6 = R && I === 0 ? "suggestion" : void 0,
        y6 = $6.length + 1,
        G6;
    if (q[82] !== L6 || q[83] !== y6) G6 = PY.default.createElement(T, {
        color: L6
    }, y6, ". Chat about this"), q[82] = L6, q[83] = y6, q[84] = G6;
    else G6 = q[84];
    let R6;
    if (q[85] !== O6 || q[86] !== G6) R6 = PY.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, O6, G6), q[85] = O6, q[86] = G6, q[87] = R6;
    else R6 = q[87];
    let T6;
    if (q[88] !== I || q[89] !== R || q[90] !== h || q[91] !== $6.length) T6 = h && PY.default.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, R && I === 1 ? PY.default.createElement(T, {
        color: "suggestion"
    }, a6.pointer) : PY.default.createElement(T, null, " "), PY.default.createElement(T, {
        color: R && I === 1 ? "suggestion" : void 0
    }, $6.length + 2, ". Skip interview and plan immediately")), q[88] = I, q[89] = R, q[90] = h, q[91] = $6.length, q[92] = T6;
    else T6 = q[92];
    let D6;
    if (q[93] !== R6 || q[94] !== T6) D6 = PY.default.createElement(m, {
        flexDirection: "column"
    }, w6, R6, T6), q[93] = R6, q[94] = T6, q[95] = D6;
    else D6 = q[95];
    let Q6;
    if (q[96] !== Y.length) Q6 = Y.length === 1 ? PY.default.createElement(PY.default.Fragment, null, a6.arrowUp, "/", a6.arrowDown, " to navigate") : "Tab/Arrow keys to navigate", q[96] = Y.length, q[97] = Q6;
    else Q6 = q[97];
    let k6;
    if (q[98] !== B) k6 = B && Q && PY.default.createElement(PY.default.Fragment, null, " · ctrl+g to edit in ", Q), q[98] = B, q[99] = k6;
    else k6 = q[99];
    let Z6;
    if (q[100] !== Q6 || q[101] !== k6) Z6 = PY.default.createElement(m, {
        marginTop: 1
    }, PY.default.createElement(T, {
        color: "inactive",
        dimColor: !0
    }, "Enter to select ·", " ", Q6, k6, " ", "· Esc to cancel")), q[100] = Q6, q[101] = k6, q[102] = Z6;
    else Z6 = q[102];
    let u6;
    if (q[103] !== H || q[104] !== q6 || q[105] !== D6 || q[106] !== Z6) u6 = PY.default.createElement(m, {
        flexDirection: "column",
        minHeight: H
    }, q6, D6, Z6), q[103] = H, q[104] = q6, q[105] = D6, q[106] = Z6, q[107] = u6;
    else u6 = q[107];
    let C6;
    if (q[108] !== i || q[109] !== l || q[110] !== u6) C6 = PY.default.createElement(m, {
        flexDirection: "column",
        paddingTop: 0
    }, i, l, u6), q[108] = i, q[109] = l, q[110] = u6, q[111] = C6;
    else C6 = q[111];
    let o6;
    if (q[112] !== C6 || q[113] !== o) o6 = PY.default.createElement(m, {
        flexDirection: "column",
        marginTop: 0
    }, o, a, C6), q[112] = C6, q[113] = o, q[114] = o6;
    else o6 = q[114];
    return o6
}
// @from(Ln 491380, Col 0)
function HWz(A) {
    return A !== "__other__"
}
// @from(Ln 491384, Col 0)
function jWz(A) {
    return A.preview
}
// @from(Ln 491388, Col 0)
function JWz(A) {
    return {
        type: "text",
        value: A.label,
        label: A.label,
        description: A.description
    }
}
// @from(Ln 491397, Col 0)
function MWz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 491400, Col 4)
PY
// @from(Ln 491401, Col 4)
YIq = E(() => {
    e6();
    b7();
    i6();
    o9();
    NU6();
    yI1();
    C16();
    NA();
    VE();
    ll();
    Sw();
    ZW6();
    qIq();
    PY = t(P6(), 1)
})
// @from(Ln 491418, Col 0)
function zIq(A) {
    let q = A6(27),
        {
            questions: K,
            currentQuestionIndex: Y,
            answers: z,
            allQuestionsAnswered: _,
            permissionResult: w,
            minContentHeight: O,
            onFinalResponse: $
        } = A,
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = sX.default.createElement(DD, {
        dividerColor: "inactive"
    }), q[0] = H;
    else H = q[0];
    let j;
    if (q[1] !== z || q[2] !== Y || q[3] !== K) j = sX.default.createElement(kV6, {
        questions: K,
        currentQuestionIndex: Y,
        answers: z
    }), q[1] = z, q[2] = Y, q[3] = K, q[4] = j;
    else j = q[4];
    let J;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = sX.default.createElement(be, {
        title: "Review your answers",
        color: "text"
    }), q[5] = J;
    else J = q[5];
    let M;
    if (q[6] !== _) M = !_ && sX.default.createElement(m, {
        marginBottom: 1
    }, sX.default.createElement(T, {
        color: "warning"
    }, a6.warning, " You have not answered all questions")), q[6] = _, q[7] = M;
    else M = q[7];
    let D;
    if (q[8] !== z || q[9] !== K) D = Object.keys(z).length > 0 && sX.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, K.filter((N) => N?.question && z[N.question]).map((N) => {
        let V = z[N?.question];
        return sX.default.createElement(m, {
            key: N?.question || "answer",
            flexDirection: "column",
            marginLeft: 1
        }, sX.default.createElement(T, null, a6.bullet, " ", N?.question || "Question"), sX.default.createElement(m, {
            marginLeft: 2
        }, sX.default.createElement(T, {
            color: "success"
        }, a6.arrowRight, " ", V)))
    })), q[8] = z, q[9] = K, q[10] = D;
    else D = q[10];
    let X;
    if (q[11] !== w) X = sX.default.createElement(lh, {
        permissionResult: w,
        toolType: "tool"
    }), q[11] = w, q[12] = X;
    else X = q[12];
    let P;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) P = sX.default.createElement(T, {
        color: "inactive"
    }, "Ready to submit your answers?"), q[13] = P;
    else P = q[13];
    let W;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) W = {
        type: "text",
        label: "Submit answers",
        value: "submit"
    }, q[14] = W;
    else W = q[14];
    let Z;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) Z = [W, {
        type: "text",
        label: "Cancel",
        value: "cancel"
    }], q[15] = Z;
    else Z = q[15];
    let G;
    if (q[16] !== $) G = sX.default.createElement(m, {
        marginTop: 1
    }, sX.default.createElement(T8, {
        options: Z,
        onChange: (N) => $(N),
        onCancel: () => $("cancel")
    })), q[16] = $, q[17] = G;
    else G = q[17];
    let f;
    if (q[18] !== O || q[19] !== G || q[20] !== M || q[21] !== D || q[22] !== X) f = sX.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        minHeight: O
    }, M, D, X, P, G), q[18] = O, q[19] = G, q[20] = M, q[21] = D, q[22] = X, q[23] = f;
    else f = q[23];
    let v;
    if (q[24] !== f || q[25] !== j) v = sX.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, H, sX.default.createElement(m, {
        flexDirection: "column",
        borderTop: !0,
        borderColor: "inactive",
        paddingTop: 0
    }, j, J, f)), q[24] = f, q[25] = j, q[26] = v;
    else v = q[26];
    return v
}
// @from(Ln 491525, Col 4)
sX
// @from(Ln 491526, Col 4)
_Iq = E(() => {
    e6();
    b7();
    i6();
    o9();
    NU6();
    H26();
    yI1();
    C16();
    sX = t(P6(), 1)
})
// @from(Ln 491538, Col 0)
function OIq(A) {
    let q = A6(115),
        {
            toolUseConfirm: K,
            onDone: Y,
            onReject: z
        } = A,
        _;
    if (q[0] !== K.input) _ = kT6.inputSchema.safeParse(K.input), q[0] = K.input, q[1] = _;
    else _ = q[1];
    let w = _,
        O;
    if (q[2] !== w.data || q[3] !== w.success) O = w.success ? w.data.questions || [] : [], q[2] = w.data, q[3] = w.success, q[4] = O;
    else O = q[4];
    let $ = O,
        {
            rows: H
        } = KA(),
        [j] = z7(),
        M = Kj().syntaxHighlightingDisabled ?? !1,
        D = 0,
        X = 0,
        P = Math.max(wIq, H - XWz);
    if (q[5] !== P || q[6] !== D || q[7] !== X || q[8] !== $ || q[9] !== M || q[10] !== j) {
        for (let j6 of $)
            if (j6.options.some(TWz)) {
                let n6 = Math.max(1, P - 11),
                    d6 = 0;
                for (let J1 of j6.options)
                    if (J1.preview) {
                        let K8 = $Z1(J1.preview, j, M).split(`
`),
                            e8 = K8.length > n6,
                            n8 = e8 ? n6 : K8.length;
                        d6 = Math.max(d6, n8 + (e8 ? 1 : 0) + 2);
                        for (let H7 of K8) X = Math.max(X, f8(H7))
                    } let S6 = d6 + 2,
                    g6 = j6.options.length + 2,
                    D1 = Math.max(g6, S6);
                D = Math.max(D, D1 + 7)
            } else D = Math.max(D, j6.options.length + 3 + 7);
        q[5] = P, q[6] = D, q[7] = X, q[8] = $, q[9] = M, q[10] = j, q[11] = D
    } else D = q[11];
    let W = Math.min(Math.max(D, wIq), P),
        Z = Math.max(X, DWz),
        G;
    if (q[12] !== W || q[13] !== Z) G = {
        globalContentHeight: W,
        globalContentWidth: Z
    }, q[12] = W, q[13] = Z, q[14] = G;
    else G = q[14];
    let {
        globalContentHeight: f,
        globalContentWidth: v
    } = G, N = w.success ? w.data.metadata?.source : void 0, V;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) V = {}, q[15] = V;
    else V = q[15];
    let [L, h] = LI1.useState(V), R = LI1.useRef(0), u;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) u = function(W6, n6, d6, S6, g6, D1) {
        R.current = R.current + 1;
        let J1 = R.current,
            E1 = {
                id: J1,
                type: "image",
                content: n6,
                mediaType: d6 || "image/png",
                filename: S6 || "Pasted image",
                dimensions: g6
            };
        sZ6(E1), c96(E1), h((K8) => ({
            ...K8,
            [W6]: {
                ...K8[W6] ?? {},
                [J1]: E1
            }
        }))
    }, q[16] = u;
    else u = q[16];
    let I = u,
        g;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) g = (j6, W6) => {
        h((n6) => {
            let d6 = {
                ...n6[j6] ?? {}
            };
            return delete d6[W6], {
                ...n6,
                [j6]: d6
            }
        })
    }, q[17] = g;
    else g = q[17];
    let B = g,
        b;
    if (q[18] !== L) b = Object.values(L).flatMap(fWz).filter(GWz), q[18] = L, q[19] = b;
    else b = q[19];
    let p = b,
        U = M1(ZWz) === "plan",
        r;
    if (q[20] !== U) r = U ? Fj() : void 0, q[20] = U, q[21] = r;
    else r = q[21];
    let e = r,
        Y6 = aCq(),
        {
            currentQuestionIndex: H6,
            answers: J6,
            questionStates: K6,
            isInTextInput: s,
            nextQuestion: X6,
            prevQuestion: z6,
            updateQuestionState: N6,
            setAnswer: $6,
            setTextInputMode: n
        } = Y6,
        o = H6 < ($?.length || 0) ? $?.[H6] : null,
        a = H6 === ($?.length || 0),
        i;
    if (q[22] !== J6 || q[23] !== $) i = $?.every((j6) => j6?.question && !!J6[j6.question]) ?? !1, q[22] = J6, q[23] = $, q[24] = i;
    else i = q[24];
    let l = i,
        q6 = $.length === 1 && !$[0]?.multiSelect,
        w6;
    if (q[25] !== U || q[26] !== N || q[27] !== Y || q[28] !== z || q[29] !== $.length || q[30] !== K) w6 = () => {
        if (N) d("tengu_ask_user_question_rejected", {
            source: N,
            questionCount: $.length,
            isInPlanMode: U,
            interviewPhaseEnabled: U && rO()
        });
        Y(), z(), K.onReject()
    }, q[25] = U, q[26] = N, q[27] = Y, q[28] = z, q[29] = $.length, q[30] = K, q[31] = w6;
    else w6 = q[31];
    let O6 = w6,
        L6;
    if (q[32] !== p || q[33] !== J6 || q[34] !== U || q[35] !== N || q[36] !== Y || q[37] !== $ || q[38] !== K) L6 = async () => {
        let W6 = `The user wants to clarify these questions.
    This means they may have additional information, context or questions for you.
    Take their response into account and then reformulate the questions if appropriate.
    Start by asking them what they would like to clarify.

    Questions asked:
${$.map((d6)=>{let S6=J6[d6.question];if(S6)return`- "${d6.question}"
  Answer: ${S6}`;return`- "${d6.question}"
  (No answer provided)`}).join(`
        `)}`;
        if (N) d("tengu_ask_user_question_respond_to_claude", {
            source: N,
            questionCount: $.length,
            isInPlanMode: U,
            interviewPhaseEnabled: U && rO()
        });
        let n6 = await ds8(p);
        Y(), K.onReject(W6, n6 && n6.length > 0 ? n6 : void 0)
    }, q[32] = p, q[33] = J6, q[34] = U, q[35] = N, q[36] = Y, q[37] = $, q[38] = K, q[39] = L6;
    else L6 = q[39];
    let y6 = L6,
        G6;
    if (q[40] !== p || q[41] !== J6 || q[42] !== U || q[43] !== N || q[44] !== Y || q[45] !== $ || q[46] !== K) G6 = async () => {
        let W6 = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${$.map((d6)=>{let S6=J6[d6.question];if(S6)return`- "${d6.question}"
  Answer: ${S6}`;return`- "${d6.question}"
  (No answer provided)`}).join(`
        `)}`;
        if (N) d("tengu_ask_user_question_finish_plan_interview", {
            source: N,
            questionCount: $.length,
            isInPlanMode: U,
            interviewPhaseEnabled: U && rO()
        });
        let n6 = await ds8(p);
        Y(), K.onReject(W6, n6 && n6.length > 0 ? n6 : void 0)
    }, q[40] = p, q[41] = J6, q[42] = U, q[43] = N, q[44] = Y, q[45] = $, q[46] = K, q[47] = G6;
    else G6 = q[47];
    let R6 = G6,
        T6;
    if (q[48] !== p || q[49] !== U || q[50] !== N || q[51] !== Y || q[52] !== K6 || q[53] !== $ || q[54] !== K) T6 = async (j6) => {
        if (N) d("tengu_ask_user_question_accepted", {
            source: N,
            questionCount: $.length,
            answerCount: Object.keys(j6).length,
            isInPlanMode: U,
            interviewPhaseEnabled: U && rO()
        });
        let W6 = {};
        for (let S6 of $) {
            let g6 = j6[S6.question],
                D1 = K6[S6.question]?.textInputValue,
                E1 = (g6 ? S6.options.find((K8) => K8.label === g6) : void 0)?.preview;
            if (E1 || D1?.trim()) W6[S6.question] = {
                ...E1 && {
                    preview: E1
                },
                ...D1?.trim() && {
                    notes: D1.trim()
                }
            }
        }
        let n6 = {
                ...K.input,
                answers: j6,
                ...Object.keys(W6).length > 0 && {
                    annotations: W6
                }
            },
            d6 = await ds8(p);
        Y(), K.onAllow(n6, [], void 0, d6 && d6.length > 0 ? d6 : void 0)
    }, q[48] = p, q[49] = U, q[50] = N, q[51] = Y, q[52] = K6, q[53] = $, q[54] = K, q[55] = T6;
    else T6 = q[55];
    let D6 = T6,
        Q6;
    if (q[56] !== J6 || q[57] !== L || q[58] !== $.length || q[59] !== $6 || q[60] !== D6) Q6 = (j6, W6, n6, d6) => {
        let S6 = d6 === void 0 ? !0 : d6,
            g6, D1 = Array.isArray(W6);
        if (D1) g6 = W6.join(", ");
        else if (n6) g6 = Object.values(L[j6] ?? {}).filter(WWz).length > 0 ? `${n6} (Image attached)` : n6;
        else if (W6 === "__other__") g6 = Object.values(L[j6] ?? {}).filter(PWz).length > 0 ? "(Image attached)" : W6;
        else g6 = W6;
        let J1 = $.length === 1;
        if (!D1 && J1 && S6) {
            let E1 = {
                ...J6,
                [j6]: g6
            };
            D6(E1).catch(_6);
            return
        }
        $6(j6, g6, S6)
    }, q[56] = J6, q[57] = L, q[58] = $.length, q[59] = $6, q[60] = D6, q[61] = Q6;
    else Q6 = q[61];
    let k6 = Q6,
        Z6;
    if (q[62] !== J6 || q[63] !== O6 || q[64] !== D6) Z6 = function(W6) {
        if (W6 === "cancel") {
            O6();
            return
        }
        if (W6 === "submit") D6(J6).catch(_6)
    }, q[62] = J6, q[63] = O6, q[64] = D6, q[65] = Z6;
    else Z6 = q[65];
    let u6 = Z6,
        C6 = q6 ? ($?.length || 1) - 1 : $?.length || 0,
        o6;
    if (q[66] !== H6 || q[67] !== z6) o6 = () => {
        if (H6 > 0) z6()
    }, q[66] = H6, q[67] = z6, q[68] = o6;
    else o6 = q[68];
    let V6 = o6,
        b6;
    if (q[69] !== H6 || q[70] !== C6 || q[71] !== X6) b6 = () => {
        if (H6 < C6) X6()
    }, q[69] = H6, q[70] = C6, q[71] = X6, q[72] = b6;
    else b6 = q[72];
    let E6 = b6,
        U6;
    if (q[73] !== E6 || q[74] !== V6) U6 = {
        "tabs:previous": V6,
        "tabs:next": E6
    }, q[73] = E6, q[74] = V6, q[75] = U6;
    else U6 = q[75];
    let c6 = !(s && !a),
        K1;
    if (q[76] !== c6) K1 = {
        context: "Tabs",
        isActive: c6
    }, q[76] = c6, q[77] = K1;
    else K1 = q[77];
    if (tA(U6, K1), o) {
        let j6;
        if (q[78] !== o.question) j6 = (S6, g6, D1, J1, E1) => I(o.question, S6, g6, D1, J1, E1), q[78] = o.question, q[79] = j6;
        else j6 = q[79];
        let W6;
        if (q[80] !== o.question || q[81] !== L) W6 = L[o.question] ?? {}, q[80] = o.question, q[81] = L, q[82] = W6;
        else W6 = q[82];
        let n6;
        if (q[83] !== o.question) n6 = (S6) => B(o.question, S6), q[83] = o.question, q[84] = n6;
        else n6 = q[84];
        let d6;
        if (q[85] !== J6 || q[86] !== o || q[87] !== H6 || q[88] !== f || q[89] !== v || q[90] !== O6 || q[91] !== R6 || q[92] !== k6 || q[93] !== y6 || q[94] !== E6 || q[95] !== V6 || q[96] !== q6 || q[97] !== X6 || q[98] !== e || q[99] !== K6 || q[100] !== $ || q[101] !== n || q[102] !== j6 || q[103] !== W6 || q[104] !== n6 || q[105] !== N6) d6 = J26.default.createElement(J26.default.Fragment, null, J26.default.createElement(KIq, {
            question: o,
            questions: $,
            currentQuestionIndex: H6,
            answers: J6,
            questionStates: K6,
            hideSubmitTab: q6,
            minContentHeight: f,
            minContentWidth: v,
            planFilePath: e,
            onUpdateQuestionState: N6,
            onAnswer: k6,
            onTextInputFocus: n,
            onCancel: O6,
            onSubmit: X6,
            onTabPrev: V6,
            onTabNext: E6,
            onRespondToClaude: y6,
            onFinishPlanInterview: R6,
            onImagePaste: j6,
            pastedContents: W6,
            onRemoveImage: n6
        })), q[85] = J6, q[86] = o, q[87] = H6, q[88] = f, q[89] = v, q[90] = O6, q[91] = R6, q[92] = k6, q[93] = y6, q[94] = E6, q[95] = V6, q[96] = q6, q[97] = X6, q[98] = e, q[99] = K6, q[100] = $, q[101] = n, q[102] = j6, q[103] = W6, q[104] = n6, q[105] = N6, q[106] = d6;
        else d6 = q[106];
        return d6
    }
    if (a) {
        let j6;
        if (q[107] !== l || q[108] !== J6 || q[109] !== H6 || q[110] !== f || q[111] !== u6 || q[112] !== $ || q[113] !== K.permissionResult) j6 = J26.default.createElement(J26.default.Fragment, null, J26.default.createElement(zIq, {
            questions: $,
            currentQuestionIndex: H6,
            answers: J6,
            allQuestionsAnswered: l,
            permissionResult: K.permissionResult,
            minContentHeight: f,
            onFinalResponse: u6
        })), q[107] = l, q[108] = J6, q[109] = H6, q[110] = f, q[111] = u6, q[112] = $, q[113] = K.permissionResult, q[114] = j6;
        else j6 = q[114];
        return j6
    }
    return null
}
// @from(Ln 491861, Col 0)
function PWz(A) {
    return A.type === "image"
}
// @from(Ln 491865, Col 0)
function WWz(A) {
    return A.type === "image"
}
// @from(Ln 491869, Col 0)
function ZWz(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 491873, Col 0)
function GWz(A) {
    return A.type === "image"
}
// @from(Ln 491877, Col 0)
function fWz(A) {
    return Object.values(A)
}
// @from(Ln 491881, Col 0)
function TWz(A) {
    return A.preview
}
// @from(Ln 491884, Col 0)
async function ds8(A) {
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
        return (await Qd(K)).block
    }))
}
// @from(Ln 491898, Col 4)
J26
// @from(Ln 491898, Col 9)
LI1
// @from(Ln 491898, Col 14)
wIq = 12
// @from(Ln 491899, Col 4)
DWz = 40
// @from(Ln 491900, Col 4)
XWz = 15
// @from(Ln 491901, Col 4)
$Iq = E(() => {
    e6();
    i6();
    nk1();
    sCq();
    YIq();
    _Iq();
    V1();
    NA();
    rH();
    Xa();
    jR();
    Sc();
    k1();
    _q();
    _7();
    q3();
    nI();
    CQ6();
    J26 = t(P6(), 1), LI1 = t(P6(), 1)
})
// @from(Ln 491923, Col 0)
function hWz(A) {
    switch (A) {
        case pX:
            return cSq;
        case xX:
            return uCq;
        case J4:
            return SCq;
        case vWz:
            return NWz ?? M86;
        case VWz:
            return kWz ?? M86;
        case EWz:
            return yWz ?? M86;
        case BX:
            return FCq;
        case Vl:
            return dCq;
        case zD:
            return lCq;
        case Ki6:
            return iCq;
        case m66:
            return rCq;
        case kT6:
            return OIq;
        case LWz:
            return RWz ?? M86;
        case rg:
        case bb:
        case L9:
            return BCq;
        default:
            return M86
    }
}
// @from(Ln 491960, Col 0)
function SWz(A) {
    let q = A.tool.userFacingName(A.input);
    if (A.tool === zD) return "Claude Code needs your approval for the plan";
    if (A.tool === Ki6) return "Claude Code wants to enter plan mode";
    if (!q || q.trim() === "") return "Claude Code needs your attention";
    return `Claude needs your permission to use ${q}`
}
// @from(Ln 491968, Col 0)
function HIq(A) {
    let q = A6(17),
        {
            toolUseConfirm: K,
            toolUseContext: Y,
            onDone: z,
            onReject: _,
            verbose: w,
            workerBadge: O
        } = A,
        $;
    if (q[0] !== z || q[1] !== _ || q[2] !== K) $ = () => {
        z(), _(), K.onReject()
    }, q[0] = z, q[1] = _, q[2] = K, q[3] = $;
    else $ = q[3];
    let H;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) H = {
        context: "Confirmation"
    }, q[4] = H;
    else H = q[4];
    D8("app:interrupt", $, H);
    let j;
    if (q[5] !== K) j = SWz(K), q[5] = K, q[6] = j;
    else j = q[6];
    $a6(j, "permission_prompt");
    let M;
    if (q[7] !== K.tool) M = hWz(K.tool), q[7] = K.tool, q[8] = M;
    else M = q[8];
    let D = M,
        X;
    if (q[9] !== D || q[10] !== z || q[11] !== _ || q[12] !== K || q[13] !== Y || q[14] !== w || q[15] !== O) X = cs8.createElement(D, {
        toolUseContext: Y,
        toolUseConfirm: K,
        onDone: z,
        onReject: _,
        verbose: w,
        workerBadge: O
    }), q[9] = D, q[10] = z, q[11] = _, q[12] = K, q[13] = Y, q[14] = w, q[15] = O, q[16] = X;
    else X = q[16];
    return X
}
// @from(Ln 492009, Col 4)
cs8
// @from(Ln 492009, Col 9)
vWz = null
// @from(Ln 492010, Col 4)
NWz = null
// @from(Ln 492011, Col 4)
VWz = null
// @from(Ln 492012, Col 4)
kWz = null
// @from(Ln 492013, Col 4)
EWz = null
// @from(Ln 492014, Col 4)
yWz = null
// @from(Ln 492015, Col 4)
LWz = null
// @from(Ln 492016, Col 4)
RWz = null
// @from(Ln 492017, Col 4)
jIq = E(() => {
    e6();
    _7();
    Sz6();
    c66();
    OZ();
    lSq();
    CCq();
    Fs8();
    Qs8();
    mCq();
    gCq();
    Rl6();
    Ll6();
    KT6();
    RI();
    vT6();
    pCq();
    cCq();
    tl6();
    Us8();
    OF8();
    nCq();
    EV1();
    oCq();
    nk1();
    $Iq();
    cs8 = t(P6(), 1)
})
// @from(Ln 492046, Col 0)
async function JIq(A, q, K) {
    let Y = new Date,
        z = Y.toISOString(),
        _ = -Y.getTimezoneOffset(),
        w = Math.floor(Math.abs(_) / 60),
        O = Math.abs(_) % 60,
        H = `${_>=0?"+":"-"}${String(w).padStart(2,"0")}:${String(O).padStart(2,"0")}`,
        j = Y.toLocaleDateString("en-US", {
            weekday: "long"
        }),
        J = uq(["You are a date/time parser that converts natural language into ISO 8601 format.", "You MUST respond with ONLY the ISO 8601 formatted string, with no explanation or additional text.", "If the input is ambiguous, prefer future dates over past dates.", "For times without dates, use today's date.", "For dates without times, do not include a time component.", 'If the input is incomplete or you cannot confidently parse it into a valid date, respond with exactly "INVALID" (nothing else).', 'Examples of INVALID input: partial dates like "2025-01-", lone numbers like "13", gibberish.', 'Examples of valid natural language: "tomorrow", "next Monday", "jan 1st 2025", "in 2 hours", "yesterday".']),
        M = q === "date" ? "YYYY-MM-DD (date only, no time)" : `YYYY-MM-DDTHH:MM:SS${H} (full date-time with timezone)`,
        D = `Current context:
- Current date and time: ${z} (UTC)
- Local timezone: ${H}
- Day of week: ${j}

User input: "${A}"

Output format: ${M}

Parse the user's input into ISO 8601 format. Return ONLY the formatted string, or "INVALID" if the input is incomplete or unparseable.`;
    try {
        let P = (await WX({
            systemPrompt: J,
            userPrompt: D,
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
    } catch (X) {
        return _6(X), {
            success: !1,
            error: "Unable to parse date/time. Please enter in ISO 8601 format manually."
        }
    }
}
// @from(Ln 492102, Col 0)
function MIq(A) {
    return /^\d{4}-\d{2}-\d{2}(T|$)/.test(A.trim())
}
// @from(Ln 492105, Col 4)
DIq = E(() => {
    gw();
    k1()
})
// @from(Ln 492110, Col 0)
function M26(A) {
    return A.type === "array" && "items" in A && typeof A.items === "object" && A.items !== null && (("enum" in A.items) || ("anyOf" in A.items))
}
// @from(Ln 492114, Col 0)
function Da6(A) {
    if ("anyOf" in A.items) return A.items.anyOf.map((q) => q.const);
    if ("enum" in A.items) return A.items.enum;
    return []
}
// @from(Ln 492120, Col 0)
function CWz(A) {
    if ("anyOf" in A.items) return A.items.anyOf.map((q) => q.title);
    if ("enum" in A.items) return A.items.enum;
    return []
}
// @from(Ln 492126, Col 0)
function Xa6(A, q) {
    let K = Da6(A).indexOf(q);
    return K >= 0 ? CWz(A)[K] ?? q : q
}
// @from(Ln 492131, Col 0)
function X86(A) {
    if ("oneOf" in A) return A.oneOf.map((q) => q.const);
    if ("enum" in A) return A.enum;
    return []
}
// @from(Ln 492137, Col 0)
function IWz(A) {
    if ("oneOf" in A) return A.oneOf.map((q) => q.title);
    if ("enum" in A) return ("enumNames" in A ? A.enumNames : void 0) ?? A.enum;
    return []
}
// @from(Ln 492143, Col 0)
function EV6(A, q) {
    let K = X86(A).indexOf(q);
    return K >= 0 ? IWz(A)[K] ?? q : q
}
// @from(Ln 492148, Col 0)
function bWz(A) {
    if (pF(A)) {
        let [q, ...K] = X86(A);
        if (!q) return C.never();
        return C.enum([q, ...K])
    }
    if (A.type === "string") {
        let q = C.string();
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
            Y = (w) => Number.isInteger(w) && !K ? `${w}.0` : String(w),
            z = A.minimum !== void 0 && A.maximum !== void 0 ? `Must be ${q} between ${Y(A.minimum)} and ${Y(A.maximum)}` : A.minimum !== void 0 ? `Must be ${q} >= ${Y(A.minimum)}` : A.maximum !== void 0 ? `Must be ${q} <= ${Y(A.maximum)}` : `Must be ${q}`,
            _ = C.coerce.number({
                error: z
            });
        if (A.type === "integer") _ = _.int({
            message: z
        });
        if (A.minimum !== void 0) _ = _.min(A.minimum, {
            message: z
        });
        if (A.maximum !== void 0) _ = _.max(A.maximum, {
            message: z
        });
        return _
    }
    if (A.type === "boolean") return C.coerce.boolean();
    throw Error(`Unsupported schema: ${B6(A)}`)
}
// @from(Ln 492210, Col 0)
function Ma6(A, q) {
    let Y = bWz(q).safeParse(A);
    if (Y.success) return {
        value: Y.data,
        isValid: !0
    };
    return {
        isValid: !1,
        error: Y.error.issues.map((z) => z.message).join("; ")
    }
}
// @from(Ln 492222, Col 0)
function Pa6(A) {
    return A.type === "string" && "format" in A && (A.format === "date" || A.format === "date-time")
}
// @from(Ln 492225, Col 0)
async function XIq(A, q, K) {
    let Y = Ma6(A, q);
    if (Y.isValid) return Y;
    if (Pa6(q) && !MIq(A)) {
        let z = await JIq(A, q.format, K);
        if (z.success) {
            let _ = Ma6(z.value, q);
            if (_.isValid) return _
        }
    }
    return Y
}
// @from(Ln 492237, Col 4)
pF = (A) => {
    return A.type === "string" && (("enum" in A) || ("oneOf" in A))
}
// @from(Ln 492240, Col 4)
PIq = E(() => {
    K7();
    g1();
    DIq()
})
// @from(Ln 492246, Col 0)
function Za6(A) {
    A.buffer = "", A.timer = void 0
}
// @from(Ln 492250, Col 0)
function uWz() {
    let A = A6(4),
        [q, K] = V_.useState(0),
        Y, z;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) Y = () => {
        let O = setInterval(K, 80, xWz);
        return () => clearInterval(O)
    }, z = [], A[0] = Y, A[1] = z;
    else Y = A[0], z = A[1];
    V_.useEffect(Y, z);
    let _ = WIq[q],
        w;
    if (A[2] !== _) w = XA.default.createElement(T, {
        color: "warning"
    }, _), A[2] = _, A[3] = w;
    else w = A[3];
    return w
}
// @from(Ln 492269, Col 0)
function mWz(A, q) {
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
// @from(Ln 492295, Col 0)
function ZIq(A) {
    let q = A6(7),
        {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        } = A;
    if (K.params.mode === "url") {
        let w;
        if (q[0] !== K || q[1] !== Y || q[2] !== z) w = XA.default.createElement(gWz, {
            event: K,
            onResponse: Y,
            onWaitingDismiss: z
        }), q[0] = K, q[1] = Y, q[2] = z, q[3] = w;
        else w = q[3];
        return w
    }
    let _;
    if (q[4] !== K || q[5] !== Y) _ = XA.default.createElement(BWz, {
        event: K,
        onResponse: Y
    }), q[4] = K, q[5] = Y, q[6] = _;
    else _ = q[6];
    return _
}
// @from(Ln 492321, Col 0)
function BWz({
    event: A,
    onResponse: q
}) {
    let {
        serverName: K,
        signal: Y
    } = A, z = A.params, {
        message: _,
        requestedSchema: w
    } = z, O = Object.keys(w.properties).length > 0, [$, H] = V_.useState(O ? null : "accept"), [j, J] = V_.useState(() => {
        let y6 = {};
        if (w.properties) {
            for (let [G6, R6] of Object.entries(w.properties))
                if (typeof R6 === "object" && R6 !== null) {
                    if (R6.default !== void 0) y6[G6] = R6.default
                }
        }
        return y6
    }), [M, D] = V_.useState(() => {
        let y6 = {};
        for (let [G6, R6] of Object.entries(w.properties))
            if (Wa6(R6) && R6?.default !== void 0) {
                let T6 = Ma6(String(R6.default), R6);
                if (!T6.isValid && T6.error) y6[G6] = T6.error
            } return y6
    });
    V_.useEffect(() => {
        if (!Y) return;
        let y6 = () => {
            q("cancel")
        };
        if (Y.aborted) {
            y6();
            return
        }
        return Y.addEventListener("abort", y6), () => {
            Y.removeEventListener("abort", y6)
        }
    }, [Y, q]);
    let X = V_.useMemo(() => {
            let y6 = w.required ?? [];
            return Object.entries(w.properties).map(([G6, R6]) => ({
                name: G6,
                schema: R6,
                isRequired: y6.includes(G6)
            }))
        }, [w]),
        [P, W] = V_.useState(O ? 0 : void 0),
        [Z, G] = V_.useState(() => {
            let y6 = X[0];
            if (y6 && Wa6(y6.schema)) {
                let G6 = j[y6.name];
                if (G6 === void 0) return "";
                return String(G6)
            }
            return ""
        }),
        [f, v] = V_.useState(Z.length),
        [N, V] = V_.useState(() => new Set),
        [L, h] = V_.useState(),
        [R, u] = V_.useState(0),
        I = V_.useRef(void 0),
        g = V_.useRef(new Map),
        B = V_.useRef({
            buffer: "",
            timer: void 0
        }),
        {
            columns: b,
            rows: p
        } = KA(),
        Q = P !== void 0 ? X[P] : void 0,
        r = Q !== void 0 && Wa6(Q.schema) && !pF(Q.schema) && !$;
    oj("elicitation"), $a6("Claude Code needs your input", "elicitation_dialog");
    let e = V_.useCallback((y6) => {
        if (y6 === void 0) {
            G(""), v(0);
            return
        }
        let G6 = X[y6];
        if (G6 && Wa6(G6.schema) && !pF(G6.schema)) {
            let R6 = j[G6.name],
                T6 = R6 !== void 0 ? String(R6) : "";
            G(T6), v(T6.length)
        }
    }, [X, j]);

    function Y6(y6, G6) {
        if (!M26(G6)) return;
        let R6 = j[y6] ?? [],
            T6 = X.find((k6) => k6.name === y6)?.isRequired ?? !1,
            D6 = G6.minItems,
            Q6 = G6.maxItems;
        if (D6 !== void 0 && R6.length < D6 && (R6.length > 0 || T6)) K6(y6, `Select at least ${D6} item${D6===1?"":"s"}`);
        else if (Q6 !== void 0 && R6.length > Q6) K6(y6, `Select at most ${Q6} item${Q6===1?"":"s"}`);
        else K6(y6)
    }

    function H6(y6) {
        if (Q && M26(Q.schema)) Y6(Q.name, Q.schema), h(void 0);
        else if (Q && pF(Q.schema)) h(void 0);
        if (r && Q) {
            if (X6(Q.name, Q.schema, Z), I.current !== void 0) clearTimeout(I.current), I.current = void 0;
            if (Pa6(Q.schema) && Z.trim() !== "" && M[Q.name]) z6(Q.name, Q.schema, Z)
        }
        let G6 = X.length + 2,
            R6 = P ?? ($ === "accept" ? X.length : $ === "decline" ? X.length + 1 : void 0),
            T6 = R6 !== void 0 ? (R6 + (y6 === "up" ? G6 - 1 : 1)) % G6 : 0;
        if (T6 < X.length) W(T6), H(null), e(T6);
        else W(void 0), H(T6 === X.length ? "accept" : "decline"), G("")
    }

    function J6(y6, G6) {
        if (J((R6) => {
                let T6 = {
                    ...R6
                };
                if (G6 === void 0) delete T6[y6];
                else T6[y6] = G6;
                return T6
            }), G6 !== void 0 && M[y6] === "This field is required") K6(y6)
    }

    function K6(y6, G6) {
        D((R6) => {
            let T6 = {
                ...R6
            };
            if (G6) T6[y6] = G6;
            else delete T6[y6];
            return T6
        })
    }

    function s(y6) {
        if (!y6) return;
        J6(y6, void 0), K6(y6), G(""), v(0)
    }

    function X6(y6, G6, R6) {
        let T6 = R6.trim();
        if (T6 === "" && (G6.type !== "string" || ("format" in G6) && G6.format !== void 0)) {
            s(y6);
            return
        }
        if (T6 === "") {
            if (j[y6] !== void 0) J6(y6, "");
            return
        }
        let D6 = Ma6(R6, G6);
        J6(y6, D6.isValid ? D6.value : R6), K6(y6, D6.isValid ? void 0 : D6.error)
    }

    function z6(y6, G6, R6) {
        if (!Y) return;
        let T6 = g.current.get(y6);
        if (T6) T6.abort();
        let D6 = new AbortController;
        g.current.set(y6, D6), V((Q6) => new Set([...Q6, y6])), XIq(R6, G6, D6.signal).then((Q6) => {
            if (g.current.delete(y6), V((k6) => {
                    let Z6 = new Set(k6);
                    return Z6.delete(y6), Z6
                }), D6.signal.aborted) return;
            if (Q6.isValid) {
                J6(y6, Q6.value), K6(y6);
                let k6 = String(Q6.value);
                G((Z6) => {
                    if (Z6 === R6) return v(k6.length), k6;
                    return Z6
                })
            } else K6(y6, Q6.error)
        }, () => {
            g.current.delete(y6), V((Q6) => {
                let k6 = new Set(Q6);
                return k6.delete(y6), k6
            })
        })
    }

    function N6(y6) {
        if (G(y6), Q) {
            if (X6(Q.name, Q.schema, y6), I.current !== void 0) clearTimeout(I.current), I.current = void 0;
            if (Pa6(Q.schema) && y6.trim() !== "" && M[Q.name]) {
                let {
                    name: G6,
                    schema: R6
                } = Q;
                I.current = setTimeout((T6, D6, Q6, k6, Z6) => {
                    T6.current = void 0, D6(Q6, k6, Z6)
                }, 2000, I, z6, G6, R6, y6)
            }
        }
    }

    function $6() {
        H6("down")
    }

    function n(y6) {
        if (!Q) return;
        let {
            schema: G6,
            name: R6
        } = Q, T6 = B.current;
        if (T6.timer !== void 0) clearTimeout(T6.timer);
        T6.buffer += y6.toLowerCase(), T6.timer = setTimeout(Za6, 2000, T6);
        let D6, Q6;
        if (G6.type === "boolean") D6 = [!0, !1], Q6 = ["yes", "no"];
        else if (pF(G6)) {
            let Z6 = X86(G6);
            D6 = Z6, Q6 = Z6.map((u6) => EV6(G6, u6).toLowerCase())
        } else return;
        let k6 = Q6.findIndex((Z6) => Z6.startsWith(T6.buffer));
        if (k6 !== -1) J6(R6, D6[k6])
    }
    D8("confirm:no", () => {
        if (r && Q) {
            let y6 = j[Q.name];
            G(y6 !== void 0 ? String(y6) : ""), v(0)
        }
        q("cancel")
    }, {
        context: "Settings",
        isActive: !!Q && !$ && !L
    }), jA((y6, G6) => {
        if (r && !G6.upArrow && !G6.downArrow && !G6.return && !G6.backspace) return;
        if (L && Q && M26(Q.schema)) {
            let Q6 = Q.schema,
                k6 = Da6(Q6),
                Z6 = j[Q.name] ?? [];
            if (G6.leftArrow || G6.escape) {
                h(void 0), Y6(Q.name, Q6);
                return
            }
            if (G6.upArrow) {
                if (R === 0) h(void 0), Y6(Q.name, Q6);
                else u(R - 1);
                return
            }
            if (G6.downArrow) {
                if (R >= k6.length - 1) h(void 0), H6("down");
                else u(R + 1);
                return
            }
            if (y6 === " ") {
                let u6 = k6[R];
                if (u6 !== void 0) {
                    let C6 = Z6.includes(u6) ? Z6.filter((E6) => E6 !== u6) : [...Z6, u6],
                        o6 = C6.length > 0 ? C6 : void 0;
                    J6(Q.name, o6);
                    let {
                        minItems: V6,
                        maxItems: b6
                    } = Q6;
                    if (V6 !== void 0 && C6.length < V6 && (C6.length > 0 || Q.isRequired)) K6(Q.name, `Select at least ${V6} item${V6===1?"":"s"}`);
                    else if (b6 !== void 0 && C6.length > b6) K6(Q.name, `Select at most ${b6} item${b6===1?"":"s"}`);
                    else K6(Q.name)
                }
                return
            }
            if (G6.return) {
                let u6 = k6[R];
                if (u6 !== void 0 && !Z6.includes(u6)) J6(Q.name, [...Z6, u6]);
                h(void 0), H6("down");
                return
            }
            if (y6) {
                let u6 = B.current;
                if (u6.timer !== void 0) clearTimeout(u6.timer);
                u6.buffer += y6.toLowerCase(), u6.timer = setTimeout(Za6, 2000, u6);
                let o6 = k6.map((V6) => Xa6(Q6, V6).toLowerCase()).findIndex((V6) => V6.startsWith(u6.buffer));
                if (o6 !== -1) u(o6);
                return
            }
            return
        }
        if (L && Q && pF(Q.schema)) {
            let Q6 = Q.schema,
                k6 = X86(Q6);
            if (G6.leftArrow || G6.escape) {
                h(void 0);
                return
            }
            if (G6.upArrow) {
                if (R === 0) h(void 0);
                else u(R - 1);
                return
            }
            if (G6.downArrow) {
                if (R >= k6.length - 1) h(void 0), H6("down");
                else u(R + 1);
                return
            }
            if (y6 === " ") {
                let Z6 = k6[R];
                if (Z6 !== void 0) J6(Q.name, Z6);
                h(void 0);
                return
            }
            if (G6.return) {
                let Z6 = k6[R];
                if (Z6 !== void 0) J6(Q.name, Z6);
                h(void 0), H6("down");
                return
            }
            if (y6) {
                let Z6 = B.current;
                if (Z6.timer !== void 0) clearTimeout(Z6.timer);
                Z6.buffer += y6.toLowerCase(), Z6.timer = setTimeout(Za6, 2000, Z6);
                let C6 = k6.map((o6) => EV6(Q6, o6).toLowerCase()).findIndex((o6) => o6.startsWith(Z6.buffer));
                if (C6 !== -1) u(C6);
                return
            }
            return
        }
        if (G6.return && $ === "accept") {
            if (o() && Object.keys(M).length === 0) q("accept", j);
            else {
                let Q6 = w.required || [];
                for (let Z6 of Q6)
                    if (j[Z6] === void 0) K6(Z6, "This field is required");
                let k6 = X.findIndex((Z6) => Q6.includes(Z6.name) && j[Z6.name] === void 0 || M[Z6.name] !== void 0);
                if (k6 !== -1) W(k6), H(null), e(k6)
            }
            return
        }
        if (G6.return && $ === "decline") {
            q("decline");
            return
        }
        if (G6.upArrow || G6.downArrow) {
            let Q6 = B.current;
            if (Q6.buffer = "", Q6.timer !== void 0) clearTimeout(Q6.timer), Q6.timer = void 0;
            H6(G6.upArrow ? "up" : "down");
            return
        }
        if ($ && (G6.leftArrow || G6.rightArrow)) {
            H($ === "accept" ? "decline" : "accept");
            return
        }
        if (!Q) return;
        let {
            schema: R6,
            name: T6
        } = Q, D6 = j[T6];
        if (R6.type === "boolean") {
            if (y6 === " ") {
                if (D6 === void 0) J6(T6, !0);
                else J6(T6, !D6);
                return
            }
            if (G6.return) {
                H6("down");
                return
            }
            if (G6.backspace && D6 !== void 0) {
                s(T6);
                return
            }
            if (y6 && !G6.return) {
                n(y6);
                return
            }
            return
        }
        if (pF(R6)) {
            if (G6.rightArrow) {
                let Q6 = X86(R6),
                    k6 = D6,
                    Z6 = k6 !== void 0 ? Q6.indexOf(k6) : 0;
                h(T6), u(Math.max(0, Z6));
                return
            }
            if (G6.return) {
                H6("down");
                return
            }
            if (G6.backspace && D6 !== void 0) {
                s(T6);
                return
            }
            if (y6 && !G6.leftArrow) {
                let Q6 = X86(R6),
                    k6 = B.current;
                if (k6.timer !== void 0) clearTimeout(k6.timer);
                k6.buffer += y6.toLowerCase(), k6.timer = setTimeout(Za6, 2000, k6);
                let u6 = Q6.map((C6) => EV6(R6, C6).toLowerCase()).findIndex((C6) => C6.startsWith(k6.buffer));
                if (u6 !== -1) h(T6), u(u6);
                return
            }
            return
        }
        if (M26(R6)) {
            if (G6.rightArrow) {
                h(T6), u(0);
                return
            }
            if (G6.return) {
                H6("down");
                return
            }
            if (G6.backspace && D6 !== void 0) {
                s(T6);
                return
            }
            if (y6 && !G6.leftArrow) {
                let Q6 = Da6(R6),
                    k6 = B.current;
                if (k6.timer !== void 0) clearTimeout(k6.timer);
                k6.buffer += y6.toLowerCase(), k6.timer = setTimeout(Za6, 2000, k6);
                let u6 = Q6.map((C6) => Xa6(R6, C6).toLowerCase()).findIndex((C6) => C6.startsWith(k6.buffer));
                if (u6 !== -1) h(T6), u(u6);
                return
            }
            return
        }
        if (G6.backspace) {
            if (r && Z === "") {
                s(T6);
                return
            }
        }
    }, {
        isActive: !0
    });

    function o() {
        let y6 = w.required || [];
        for (let G6 of y6) {
            let R6 = j[G6];
            if (R6 === void 0 || R6 === null || R6 === "") return !1;
            if (Array.isArray(R6) && R6.length === 0) return !1
        }
        return !0
    }
    let a = 3,
        l = Math.max(2, Math.floor((p - 14) / a)),
        q6 = V_.useMemo(() => {
            let y6 = X.length;
            if (y6 <= l) return {
                start: 0,
                end: y6
            };
            let G6 = P ?? y6 - 1,
                R6 = Math.max(0, G6 - Math.floor(l / 2)),
                T6 = Math.min(R6 + l, y6);
            return R6 = Math.max(0, T6 - l), {
                start: R6,
                end: T6
            }
        }, [X.length, l, P]),
        w6 = q6.start > 0,
        O6 = q6.end < X.length;

    function L6() {
        if (!X.length) return null;
        return XA.default.createElement(m, {
            flexDirection: "column"
        }, w6 && XA.default.createElement(m, {
            marginLeft: 2
        }, XA.default.createElement(T, {
            dimColor: !0
        }, a6.arrowUp, " ", q6.start, " more above")), X.slice(q6.start, q6.end).map((y6, G6) => {
            let R6 = q6.start + G6,
                {
                    name: T6,
                    schema: D6,
                    isRequired: Q6
                } = y6,
                k6 = R6 === P && !$,
                Z6 = j[T6],
                u6 = Z6 !== void 0 && (!Array.isArray(Z6) || Z6.length > 0),
                C6 = M[T6],
                V6 = N.has(T6) ? XA.default.createElement(uWz, null) : C6 ? XA.default.createElement(T, {
                    color: "error"
                }, a6.warning) : u6 ? XA.default.createElement(T, {
                    color: "success",
                    dimColor: !k6
                }, a6.tick) : Q6 ? XA.default.createElement(T, {
                    color: "error"
                }, "*") : XA.default.createElement(T, null, " "),
                b6 = C6 ? "error" : u6 ? "success" : Q6 ? "error" : "suggestion",
                E6 = k6 ? b6 : void 0,
                U6 = XA.default.createElement(T, {
                    color: E6,
                    bold: k6
                }, D6.title || T6),
                c6, K1 = null;
            if (M26(D6)) {
                let j6 = Da6(D6),
                    W6 = Z6 ?? [];
                if (L === T6 && k6) c6 = XA.default.createElement(T, {
                    dimColor: !0
                }, a6.triangleDownSmall), K1 = XA.default.createElement(m, {
                    flexDirection: "column",
                    marginLeft: 6
                }, j6.map((d6, S6) => {
                    let g6 = Xa6(D6, d6),
                        D1 = W6.includes(d6),
                        J1 = S6 === R;
                    return XA.default.createElement(m, {
                        key: d6,
                        gap: 1
                    }, XA.default.createElement(T, {
                        color: "suggestion"
                    }, J1 ? a6.pointer : " "), XA.default.createElement(T, {
                        color: D1 ? "success" : void 0
                    }, D1 ? a6.checkboxOn : a6.checkboxOff), XA.default.createElement(T, {
                        color: J1 ? "suggestion" : void 0,
                        bold: J1
                    }, g6))
                }));
                else {
                    let d6 = k6 ? XA.default.createElement(T, {
                        dimColor: !0
                    }, a6.triangleRightSmall, " ") : null;
                    if (W6.length > 0) {
                        let S6 = W6.map((g6) => Xa6(D6, g6));
                        c6 = XA.default.createElement(T, null, d6, XA.default.createElement(T, {
                            color: E6,
                            bold: k6
                        }, S6.join(", ")))
                    } else c6 = XA.default.createElement(T, null, d6, XA.default.createElement(T, {
                        dimColor: !0,
                        italic: !0
                    }, "not set"))
                }
            } else if (pF(D6)) {
                let j6 = X86(D6);
                if (L === T6 && k6) c6 = XA.default.createElement(T, {
                    dimColor: !0
                }, a6.triangleDownSmall), K1 = XA.default.createElement(m, {
                    flexDirection: "column",
                    marginLeft: 6
                }, j6.map((n6, d6) => {
                    let S6 = EV6(D6, n6),
                        g6 = Z6 === n6,
                        D1 = d6 === R;
                    return XA.default.createElement(m, {
                        key: n6,
                        gap: 1
                    }, XA.default.createElement(T, {
                        color: "suggestion"
                    }, D1 ? a6.pointer : " "), XA.default.createElement(T, {
                        color: g6 ? "success" : void 0
                    }, g6 ? a6.radioOn : a6.radioOff), XA.default.createElement(T, {
                        color: D1 ? "suggestion" : void 0,
                        bold: D1
                    }, S6))
                }));
                else {
                    let n6 = k6 ? XA.default.createElement(T, {
                        dimColor: !0
                    }, a6.triangleRightSmall, " ") : null;
                    if (u6) c6 = XA.default.createElement(T, null, n6, XA.default.createElement(T, {
                        color: E6,
                        bold: k6
                    }, EV6(D6, Z6)));
                    else c6 = XA.default.createElement(T, null, n6, XA.default.createElement(T, {
                        dimColor: !0,
                        italic: !0
                    }, "not set"))
                }
            } else if (D6.type === "boolean")
                if (k6) c6 = u6 ? XA.default.createElement(T, {
                    color: E6,
                    bold: !0
                }, Z6 ? a6.checkboxOn : a6.checkboxOff) : XA.default.createElement(T, {
                    dimColor: !0
                }, a6.checkboxOff);
                else c6 = u6 ? XA.default.createElement(T, null, Z6 ? a6.checkboxOn : a6.checkboxOff) : XA.default.createElement(T, {
                    dimColor: !0,
                    italic: !0
                }, "not set");
            else if (Wa6(D6))
                if (k6) c6 = XA.default.createElement(J5, {
                    value: Z,
                    onChange: N6,
                    onSubmit: $6,
                    placeholder: "Type something…",
                    columns: Math.min(b - 20, 60),
                    cursorOffset: f,
                    onChangeCursorOffset: v,
                    focus: !0,
                    showCursor: !0
                });
                else {
                    let j6 = u6 && Pa6(D6) ? mWz(String(Z6), D6) : String(Z6);
                    c6 = u6 ? XA.default.createElement(T, null, j6) : XA.default.createElement(T, {
                        dimColor: !0,
                        italic: !0
                    }, "not set")
                }
            else c6 = u6 ? XA.default.createElement(T, null, String(Z6)) : XA.default.createElement(T, {
                dimColor: !0,
                italic: !0
            }, "not set");
            return XA.default.createElement(m, {
                key: T6,
                flexDirection: "column"
            }, XA.default.createElement(m, {
                gap: 1
            }, XA.default.createElement(T, {
                color: b6
            }, k6 ? a6.pointer : " "), V6, XA.default.createElement(m, null, U6, XA.default.createElement(T, {
                color: E6
            }, ": "), c6)), K1, D6.description && XA.default.createElement(m, {
                marginLeft: 6
            }, XA.default.createElement(T, {
                dimColor: !0
            }, D6.description)), XA.default.createElement(m, {
                marginLeft: 6,
                height: 1
            }, C6 ? XA.default.createElement(T, {
                color: "error",
                italic: !0
            }, C6) : XA.default.createElement(T, null, " ")))
        }), O6 && XA.default.createElement(m, {
            marginLeft: 2
        }, XA.default.createElement(T, {
            dimColor: !0
        }, a6.arrowDown, " ", X.length - q6.end, " more below")))
    }
    return XA.default.createElement(m8, {
        title: `MCP server “${K}” requests your input`,
        subtitle: `
${_}`,
        color: "permission",
        onCancel: () => q("cancel"),
        isCancelActive: (!Q || !!$) && !L,
        inputGuide: (y6) => y6.pending ? XA.default.createElement(T, null, "Press ", y6.keyName, " again to exit") : XA.default.createElement(C8, null, XA.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        }), XA.default.createElement(a1, {
            shortcut: "↑↓",
            action: "navigate"
        }), Q && XA.default.createElement(a1, {
            shortcut: "Backspace",
            action: "unset"
        }), Q && Q.schema.type === "boolean" && XA.default.createElement(a1, {
            shortcut: "Space",
            action: "toggle"
        }), Q && pF(Q.schema) && (L ? XA.default.createElement(a1, {
            shortcut: "Space",
            action: "select"
        }) : XA.default.createElement(a1, {
            shortcut: "→",
            action: "expand"
        })), Q && M26(Q.schema) && (L ? XA.default.createElement(a1, {
            shortcut: "Space",
            action: "toggle"
        }) : XA.default.createElement(a1, {
            shortcut: "→",
            action: "expand"
        })))
    }, XA.default.createElement(m, {
        flexDirection: "column"
    }, L6(), XA.default.createElement(m, null, XA.default.createElement(T, {
        color: "success"
    }, $ === "accept" ? a6.pointer : " "), XA.default.createElement(T, {
        bold: $ === "accept",
        color: $ === "accept" ? "success" : void 0,
        dimColor: $ !== "accept"
    }, " Accept  "), XA.default.createElement(T, {
        color: "error"
    }, $ === "decline" ? a6.pointer : " "), XA.default.createElement(T, {
        bold: $ === "decline",
        color: $ === "decline" ? "error" : void 0,
        dimColor: $ !== "decline"
    }, " Decline"))))
}
// @from(Ln 492996, Col 0)
function gWz({
    event: A,
    onResponse: q,
    onWaitingDismiss: K
}) {
    let {
        serverName: Y,
        signal: z,
        waitingState: _
    } = A, w = A.params, {
        message: O,
        url: $
    } = w, [H, j] = V_.useState("prompt"), J = V_.useRef("prompt"), [M, D] = V_.useState("accept"), X = _?.showCancel ?? !1;
    $a6("Claude Code needs your input", "elicitation_url_dialog"), oj("elicitation-url"), J.current = H;
    let P = V_.useRef(K);
    P.current = K, V_.useEffect(() => {
        let v = () => {
            if (J.current === "waiting") P.current?.("cancel");
            else q("cancel")
        };
        if (z.aborted) {
            v();
            return
        }
        return z.addEventListener("abort", v), () => z.removeEventListener("abort", v)
    }, [z, q]);
    let W = "",
        Z = "",
        G = "";
    try {
        W = new URL($).hostname;
        let N = $.indexOf(W);
        Z = $.slice(0, N), G = $.slice(N + W.length)
    } catch {
        W = $
    }
    V_.useEffect(() => {
        if (H === "waiting" && A.completed) K?.(X ? "retry" : "dismiss")
    }, [H, A.completed, K, X]);
    let f = V_.useCallback(() => {
        R9($), q("accept"), j("waiting"), J.current = "waiting", D("open")
    }, [q, $]);
    if (jA((v, N) => {
            if (H === "prompt") {
                if (N.leftArrow || N.rightArrow) {
                    D((V) => V === "accept" ? "decline" : "accept");
                    return
                }
                if (N.return)
                    if (M === "accept") f();
                    else q("decline")
            } else {
                let V = X ? ["open", "action", "cancel"] : ["open", "action"];
                if (N.leftArrow || N.rightArrow) {
                    D((L) => {
                        let h = V.indexOf(L),
                            R = N.rightArrow ? 1 : -1;
                        return V[(h + R + V.length) % V.length]
                    });
                    return
                }
                if (N.return)
                    if (M === "open") R9($);
                    else if (M === "cancel") K?.("cancel");
                else K?.(X ? "retry" : "dismiss")
            }
        }), H === "waiting") {
        let v = _?.actionLabel ?? "Continue without waiting";
        return XA.default.createElement(m8, {
            title: `MCP server “${Y}” — waiting for completion`,
            subtitle: `
${O}`,
            color: "permission",
            onCancel: () => K?.("cancel"),
            isCancelActive: !0,
            inputGuide: (N) => N.pending ? XA.default.createElement(T, null, "Press ", N.keyName, " again to exit") : XA.default.createElement(C8, null, XA.default.createElement(O8, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
            }), XA.default.createElement(a1, {
                shortcut: "\\u2190\\u2192",
                action: "switch"
            }))
        }, XA.default.createElement(m, {
            flexDirection: "column"
        }, XA.default.createElement(m, {
            marginBottom: 1,
            flexDirection: "column"
        }, XA.default.createElement(T, null, Z, XA.default.createElement(T, {
            bold: !0
        }, W), G)), XA.default.createElement(m, {
            marginBottom: 1
        }, XA.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Waiting for the server to confirm completion…")), XA.default.createElement(m, null, XA.default.createElement(T, {
            color: "success"
        }, M === "open" ? a6.pointer : " "), XA.default.createElement(T, {
            bold: M === "open",
            color: M === "open" ? "success" : void 0,
            dimColor: M !== "open"
        }, " Reopen URL  "), XA.default.createElement(T, {
            color: "success"
        }, M === "action" ? a6.pointer : " "), XA.default.createElement(T, {
            bold: M === "action",
            color: M === "action" ? "success" : void 0,
            dimColor: M !== "action"
        }, ` ${v}`), X && XA.default.createElement(XA.default.Fragment, null, XA.default.createElement(T, null, " "), XA.default.createElement(T, {
            color: "error"
        }, M === "cancel" ? a6.pointer : " "), XA.default.createElement(T, {
            bold: M === "cancel",
            color: M === "cancel" ? "error" : void 0,
            dimColor: M !== "cancel"
        }, " Cancel")))))
    }
    return XA.default.createElement(m8, {
        title: `MCP server “${Y}” wants to open a URL`,
        subtitle: `
${O}`,
        color: "permission",
        onCancel: () => q("cancel"),
        isCancelActive: !0,
        inputGuide: (v) => v.pending ? XA.default.createElement(T, null, "Press ", v.keyName, " again to exit") : XA.default.createElement(C8, null, XA.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        }), XA.default.createElement(a1, {
            shortcut: "\\u2190\\u2192",
            action: "switch"
        }))
    }, XA.default.createElement(m, {
        flexDirection: "column"
    }, XA.default.createElement(m, {
        marginBottom: 1,
        flexDirection: "column"
    }, XA.default.createElement(T, null, Z, XA.default.createElement(T, {
        bold: !0
    }, W), G)), XA.default.createElement(m, null, XA.default.createElement(T, {
        color: "success"
    }, M === "accept" ? a6.pointer : " "), XA.default.createElement(T, {
        bold: M === "accept",
        color: M === "accept" ? "success" : void 0,
        dimColor: M !== "accept"
    }, " Accept  "), XA.default.createElement(T, {
        color: "error"
    }, M === "decline" ? a6.pointer : " "), XA.default.createElement(T, {
        bold: M === "decline",
        color: M === "decline" ? "error" : void 0,
        dimColor: M !== "decline"
    }, " Decline"))))
}
// @from(Ln 493149, Col 4)
XA
// @from(Ln 493149, Col 8)
V_
// @from(Ln 493149, Col 12)
Wa6 = (A) => ["string", "number", "integer"].includes(A.type)
// @from(Ln 493150, Col 4)
WIq = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
// @from(Ln 493151, Col 4)
xWz = (A) => (A + 1) % WIq.length
// @from(Ln 493152, Col 4)
GIq = E(() => {
    e6();
    i6();
    _7();
    b7();
    Qs8();
    Xq();
    wq();
    Lq();
    OK();
    PIq();
    AH();
    _q();
    fZ();
    kX();
    XA = t(P6(), 1), V_ = t(P6(), 1)
})
// @from(Ln 493170, Col 0)
function fIq(A) {
    let q = A6(15),
        {
            title: K,
            toolInputSummary: Y,
            request: z,
            onRespond: _,
            onAbort: w
        } = A,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = {
        isActive: !0
    }, q[0] = O;
    else O = q[0];
    D8("app:interrupt", w, O);
    let $;
    if (q[1] !== z.options) $ = z.options.map(FWz), q[1] = z.options, q[2] = $;
    else $ = q[2];
    let H = $,
        j;
    if (q[3] !== Y) j = Y ? Ui.createElement(T, {
        dimColor: !0
    }, Y) : void 0, q[3] = Y, q[4] = j;
    else j = q[4];
    let J;
    if (q[5] !== _) J = (X) => {
        _(X)
    }, q[5] = _, q[6] = J;
    else J = q[6];
    let M;
    if (q[7] !== H || q[8] !== J) M = Ui.createElement(m, {
        flexDirection: "column",
        paddingY: 1
    }, Ui.createElement(T8, {
        options: H,
        onChange: J
    })), q[7] = H, q[8] = J, q[9] = M;
    else M = q[9];
    let D;
    if (q[10] !== z.message || q[11] !== j || q[12] !== M || q[13] !== K) D = Ui.createElement(cz, {
        title: K,
        subtitle: z.message,
        titleRight: j
    }, M), q[10] = z.message, q[11] = j, q[12] = M, q[13] = K, q[14] = D;
    else D = q[14];
    return D
}
// @from(Ln 493218, Col 0)
function FWz(A) {
    return {
        label: A.label,
        value: A.key,
        description: A.description
    }
}
// @from(Ln 493225, Col 4)
Ui
// @from(Ln 493226, Col 4)
TIq = E(() => {
    e6();
    i6();
    NZ();
    v3();
    _7();
    Ui = t(P6(), 1)
})
// @from(Ln 493235, Col 0)
function vIq(A) {
    return `${yV6.major(A,{loose:!0})}.${yV6.minor(A,{loose:!0})}.${yV6.patch(A,{loose:!0})}`
}
// @from(Ln 493239, Col 0)
function RI1(A, q = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.76",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-03-14T00:12:49Z"
}.VERSION) {
    let [K, Y] = NIq.useState(() => vIq(q));
    if (!A) return null;
    let z = vIq(A);
    if (z !== K) return Y(z), z;
    return null
}
// @from(Ln 493253, Col 4)
NIq
// @from(Ln 493253, Col 9)
yV6
// @from(Ln 493254, Col 4)
ls8 = E(() => {
    NIq = t(P6(), 1), yV6 = t(lD6(), 1)
})
// @from(Ln 493258, Col 0)
function VIq({
    isUpdating: A,
    onChangeIsUpdating: q,
    onAutoUpdaterResult: K,
    autoUpdaterResult: Y,
    showSuccessMessage: z,
    verbose: _
}) {
    let [w, O] = hI1.useState({}), $ = RI1(Y?.version), H = pY.useCallback(async () => {
        if (A) return;
        let j = {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION,
            J = mA()?.autoUpdatesChannel ?? "latest",
            M = await LY6(J),
            D = CF(),
            X = await O66();
        if (X && M && UG(M, X)) {
            if (k(`AutoUpdater: maxVersion ${X} is set, capping update from ${M} to ${X}`), BM(j, X)) {
                k(`AutoUpdater: current version ${j} is already at or above maxVersion ${X}, skipping update`), O({
                    global: j,
                    latest: M
                });
                return
            }
            M = X
        }
        if (O({
                global: j,
                latest: M
            }), !D && j && M && !BM(j, M) && !zf6(M)) {
            let P = Date.now();
            q(!0);
            let W = X1();
            if (W.installMethod !== "native") await qc6();
            let Z = await ug();
            if (k(`AutoUpdater: Detected installation type: ${Z}`), Z === "development") {
                k("AutoUpdater: Cannot auto-update development build"), q(!1);
                return
            }
            let G, f;
            if (Z === "npm-local") k("AutoUpdater: Using local update method"), f = "local", G = await ld6(J);
            else if (Z === "npm-global") k("AutoUpdater: Using global update method"), f = "global", G = await rd6();
            else if (Z === "native") {
                k("AutoUpdater: Unexpected native installation in non-native updater"), q(!1);
                return
            } else {
                k("AutoUpdater: Unknown installation type, falling back to config");
                let v = W.installMethod === "local";
                if (f = v ? "local" : "global", v) G = await ld6(J);
                else G = await rd6()
            }
            if (q(!1), G === "success") d("tengu_auto_updater_success", {
                fromVersion: j,
                toVersion: M,
                durationMs: Date.now() - P,
                wasMigrated: f === "local",
                installationType: Z
            });
            else d("tengu_auto_updater_fail", {
                fromVersion: j,
                attemptedVersion: M,
                status: G,
                durationMs: Date.now() - P,
                wasMigrated: f === "local",
                installationType: Z
            });
            K({
                version: M,
                status: G
            })
        }
    }, [K]);
    if (hI1.useEffect(() => {
            H()
        }, [H]), OX(H, 1800000), !Y?.version && (!w.global || !w.latest)) return null;
    if (!Y?.version && !A) return null;
    return pY.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, _ && pY.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "globalVersion: ", w.global, " · latestVersion:", " ", w.latest), A ? pY.createElement(pY.Fragment, null, pY.createElement(m, null, pY.createElement(T, {
        color: "text",
        dimColor: !0,
        wrap: "truncate"
    }, "Auto-updating…"))) : Y?.status === "success" && z && $ && pY.createElement(T, {
        color: "success",
        wrap: "truncate"
    }, "✓ Update installed · Restart to apply"), (Y?.status === "install_failed" || Y?.status === "no_permissions") && pY.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "✗ Auto-update failed · Try ", pY.createElement(T, {
        bold: !0
    }, "claude doctor"), !_66() && pY.createElement(pY.Fragment, null, " ", "or ", pY.createElement(T, {
        bold: !0
    }, "npm i -g ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.PACKAGE_URL)), _66() && pY.createElement(pY.Fragment, null, " ", "or", " ", pY.createElement(T, {
        bold: !0
    }, "cd ~/.claude/local && npm update ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.PACKAGE_URL))))
}
// @from(Ln 493378, Col 4)
pY
// @from(Ln 493378, Col 8)
hI1
// @from(Ln 493379, Col 4)
kIq = E(() => {
    i6();
    k8();
    ac();
    yY6();
    Pb();
    Pv();
    V1();
    ls8();
    tc();
    H1();
    i8();
    pY = t(P6(), 1), hI1 = t(P6(), 1)
})
// @from(Ln 493394, Col 0)
function pWz(A) {
    if (A.includes("timeout")) return "timeout";
    if (A.includes("Checksum mismatch")) return "checksum_mismatch";
    if (A.includes("ENOENT") || A.includes("not found")) return "not_found";
    if (A.includes("EACCES") || A.includes("permission")) return "permission_denied";
    if (A.includes("ENOSPC")) return "disk_full";
    if (A.includes("npm")) return "npm_error";
    if (A.includes("network") || A.includes("ECONNREFUSED") || A.includes("ENOTFOUND")) return "network_error";
    return "unknown"
}
// @from(Ln 493405, Col 0)
function EIq({
    isUpdating: A,
    onChangeIsUpdating: q,
    onAutoUpdaterResult: K,
    autoUpdaterResult: Y,
    showSuccessMessage: z,
    verbose: _
}) {
    let [w, O] = Ga6.useState({}), [$, H] = Ga6.useState(null), j = RI1(Y?.version), J = ZD.useRef(!1), M = mA()?.autoUpdatesChannel ?? "latest", D = ZD.useCallback(async () => {
        if (A || CF()) return;
        q(!0);
        let Z = Date.now();
        d("tengu_native_auto_updater_start", {});
        try {
            let G = await O66();
            if (G && UG({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION, G)) {
                let V = await AU4();
                H(V ?? "affects your version")
            }
            let f = await ql(M),
                v = {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION,
                N = Date.now() - Z;
            if (f.lockFailed) {
                d("tengu_native_auto_updater_lock_contention", {
                    latency_ms: N
                });
                return
            }
            if (O({
                    current: v,
                    latest: f.latestVersion
                }), f.wasUpdated) d("tengu_native_auto_updater_success", {
                latency_ms: N
            }), K({
                version: f.latestVersion,
                status: "success"
            });
            else d("tengu_native_auto_updater_up_to_date", {
                latency_ms: N
            })
        } catch (G) {
            let f = Date.now() - Z,
                v = G instanceof Error ? G.message : String(G);
            _6(G);
            let N = pWz(v);
            d("tengu_native_auto_updater_fail", {
                latency_ms: f,
                error_timeout: N === "timeout",
                error_checksum: N === "checksum_mismatch",
                error_not_found: N === "not_found",
                error_permission: N === "permission_denied",
                error_disk_full: N === "disk_full",
                error_npm: N === "npm_error",
                error_network: N === "network_error"
            }), K({
                version: null,
                status: "install_failed"
            })
        } finally {
            q(!1)
        }
    }, [A, q, K]);
    Ga6.useEffect(() => {
        if (!J.current) J.current = !0, D()
    }), OX(D, 1800000);
    let X = !!Y?.version,
        P = !!w.current && !!w.latest;
    if (!(!!$ || X || A && P)) return null;
    return ZD.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, _ && ZD.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "current: ", w.current, " · ", M, ": ", w.latest), A ? ZD.createElement(m, null, ZD.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "Checking for updates")) : Y?.status === "success" && z && j && ZD.createElement(T, {
        color: "success",
        wrap: "truncate"
    }, "✓ Update installed · Restart to update"), Y?.status === "install_failed" && ZD.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "✗ Auto-update failed · Try ", ZD.createElement(T, {
        bold: !0
    }, "/status")), $ && !1)
}
// @from(Ln 493506, Col 4)
ZD
// @from(Ln 493506, Col 8)
Ga6
// @from(Ln 493507, Col 4)
yIq = E(() => {
    i6();
    k8();
    Pb();
    ac();
    Pv();
    V1();
    k1();
    ls8();
    i8();
    ZD = t(P6(), 1), Ga6 = t(P6(), 1)
})
// @from(Ln 493520, Col 0)
function LIq(A) {
    let q = A6(10),
        {
            verbose: K
        } = A,
        [Y, z] = is8.useState(!1),
        [_, w] = is8.useState("unknown"),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = async () => {
        if (CF()) return;
        let [P, W] = await Promise.all([Promise.resolve(mA()?.autoUpdatesChannel ?? "latest"), _f6()]);
        w(W);
        let Z = await Wv1(P),
            G = await O66();
        if (G && Z && UG(Z, G)) {
            if (k(`PackageManagerAutoUpdater: maxVersion ${G} is set, capping update from ${Z} to ${G}`), BM({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.76",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-03-14T00:12:49Z"
                }.VERSION, G)) {
                k(`PackageManagerAutoUpdater: current version ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} is already at or above maxVersion ${G}, skipping update`), z(!1);
                return
            }
            Z = G
        }
        let f = Z && !BM({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION, Z) && !zf6(Z);
        if (z(!!f), f) k(`PackageManagerAutoUpdater: Update available ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION} -> ${Z}`)
    }, q[0] = O;
    else O = q[0];
    let $ = O,
        H, j;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        $()
    }, j = [$], q[1] = H, q[2] = j;
    else H = q[1], j = q[2];
    if (dN.useEffect(H, j), OX($, 1800000), !Y) return null;
    let J = _ === "homebrew" ? "brew upgrade claude-code" : _ === "winget" ? "winget upgrade Anthropic.ClaudeCode" : _ === "apk" ? "apk upgrade claude-code" : "your package manager update command",
        M;
    if (q[3] !== K) M = K && dN.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "currentVersion: ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION), q[3] = K, q[4] = M;
    else M = q[4];
    let D;
    if (q[5] !== J) D = dN.createElement(T, {
        color: "warning",
        wrap: "truncate"
    }, "Update available! Run: ", dN.createElement(T, {
        bold: !0
    }, J)), q[5] = J, q[6] = D;
    else D = q[6];
    let X;
    if (q[7] !== M || q[8] !== D) X = dN.createElement(dN.Fragment, null, M, D), q[7] = M, q[8] = D, q[9] = X;
    else X = q[9];
    return X
}
// @from(Ln 493593, Col 4)
dN
// @from(Ln 493593, Col 8)
is8
// @from(Ln 493594, Col 4)
RIq = E(() => {
    e6();
    i6();
    ac();
    Pv();
    H1();
    vv1();
    k8();
    i8();
    dN = t(P6(), 1), is8 = t(P6(), 1)
})
// @from(Ln 493605, Col 0)
async function SI1() {
    let A = process.argv.includes("-p") || process.argv.includes("--print");
    if (!await iS1("auto_migrate_to_native", !1)) return !1;
    if (t6(!1) || !1 || A || t6(process.env.DISABLE_AUTO_MIGRATE_TO_NATIVE)) return !1;
    if (X1().installMethod === "native") return !1;
    return !0
}
// @from(Ln 493612, Col 0)
async function hIq() {
    d("tengu_auto_migrate_to_native_attempt", {});
    try {
        let A = mA()?.autoUpdatesChannel ?? "latest",
            q = await ql(A),
            K = [];
        if (q.latestVersion) {
            d("tengu_auto_migrate_to_native_success", {}), k("✅ Upgraded to native installation. Future sessions will use the native version.");
            let {
                removed: z,
                errors: _,
                warnings: w
            } = await Yc6(), O = [];
            if (_.length > 0) _.forEach((j) => {
                O.push({
                    message: j,
                    userActionRequired: !1,
                    type: "error"
                })
            });
            if (w.length > 0) w.forEach((j) => {
                O.push({
                    message: j,
                    userActionRequired: !1,
                    type: "info"
                })
            });
            if (z > 0) O.push({
                message: `Cleaned up ${z} old npm installation(s)`,
                userActionRequired: !1,
                type: "info"
            });
            let $ = await Kc6();
            K = [...await gg(!0), ...$, ...O]
        } else d("tengu_auto_migrate_to_native_partial", {}), k("⚠️ Native installation setup encountered issues but cleanup completed."), K = await gg(!0);
        let Y = [];
        if (K.length > 0) {
            let z = K.filter((_) => _.userActionRequired);
            if (z.length > 0) {
                let _ = ["⚠️  Manual action required after migration to native installer:", ...z.map((w) => `• ${w.message}`)].join(`
`);
                Y.push(_)
            }
            k("Migration completed with the following notes:"), K.forEach((_) => {
                k(`  • [${_.type}] ${_.message}`)
            })
        }
        return {
            success: !0,
            version: q.latestVersion,
            notifications: Y.length > 0 ? Y : void 0
        }
    } catch (A) {
        return d("tengu_auto_migrate_to_native_failure", {
            error: A instanceof Error ? A.message : String(A)
        }), _6(A), {
            success: !1
        }
    }
}
// @from(Ln 493672, Col 4)
ns8 = E(() => {
    Pb();
    HA();
    V1();
    k1();
    H1();
    A8();
    k8();
    i8()
})
// @from(Ln 493683, Col 0)
function SIq({
    onMigrationComplete: A,
    onChangeIsUpdating: q,
    onAutoUpdaterResult: K,
    verbose: Y
}) {
    let [z, _] = CI1.useState("checking"), w = di.useRef(!1);
    if (CI1.useEffect(() => {
            async function O() {
                if (w.current) return;
                w.current = !0;
                try {
                    if (!await SI1()) {
                        _("idle");
                        return
                    }
                    if (Y) k("Starting auto-migration from npm to native installation");
                    d("tengu_auto_migrate_to_native_ui_shown", {}), _("migrating"), q?.(!0);
                    let H = await hIq();
                    if (H.success) _("success"), d("tengu_auto_migrate_to_native_ui_success", {}), K?.({
                        status: "success",
                        version: H.version,
                        notifications: H.notifications
                    }), setTimeout((j, J, M) => {
                        j("idle"), J?.(!1), M?.()
                    }, 5000, _, q, A);
                    else _("error"), d("tengu_auto_migrate_to_native_ui_error", {}), K?.({
                        status: "install_failed",
                        version: null
                    }), setTimeout((j, J) => {
                        j("idle"), J?.(!1)
                    }, 1e4, _, q)
                } catch ($) {
                    _6($), _("error"), K?.({
                        status: "install_failed",
                        version: null
                    }), setTimeout((H, j) => {
                        H("idle"), j?.(!1)
                    }, 1e4, _, q)
                }
            }
            O()
        }, [A, q, K, Y]), z === "idle" || z === "checking") return null;
    if (z === "migrating") return di.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "Migrating to native installation…");
    if (z === "success") return di.createElement(T, {
        color: "success",
        wrap: "truncate"
    }, a6.tick, " Migrated to native installation");
    if (z === "error") return di.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "Migration failed · Run /doctor for details");
    return null
}
// @from(Ln 493740, Col 4)
di
// @from(Ln 493740, Col 8)
CI1
// @from(Ln 493741, Col 4)
CIq = E(() => {
    i6();
    b7();
    ns8();
    V1();
    k1();
    H1();
    di = t(P6(), 1), CI1 = t(P6(), 1)
})
// @from(Ln 493751, Col 0)
function IIq(A) {
    let q = A6(22),
        {
            isUpdating: K,
            onChangeIsUpdating: Y,
            onAutoUpdaterResult: z,
            autoUpdaterResult: _,
            showSuccessMessage: w,
            verbose: O
        } = A,
        [$, H] = gE.useState(null),
        [j, J] = gE.useState(null),
        [M, D] = gE.useState(null),
        X, P;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = () => {
        (async function() {
            let v = await ug(),
                N = v === "native",
                V = v === "package-manager";
            if (k(`AutoUpdaterWrapper: Installation type: ${v}`), H(N), J(V), !N && !V) {
                let L = await SI1();
                D(L)
            } else D(!1)
        })()
    }, P = [], q[0] = X, q[1] = P;
    else X = q[0], P = q[1];
    if (gE.useEffect(X, P), $ === null || M === null || j === null) return null;
    if (j) {
        let G;
        if (q[2] !== _ || q[3] !== K || q[4] !== z || q[5] !== Y || q[6] !== w || q[7] !== O) G = gE.createElement(LIq, {
            verbose: O,
            onAutoUpdaterResult: z,
            autoUpdaterResult: _,
            isUpdating: K,
            onChangeIsUpdating: Y,
            showSuccessMessage: w
        }), q[2] = _, q[3] = K, q[4] = z, q[5] = Y, q[6] = w, q[7] = O, q[8] = G;
        else G = q[8];
        return G
    }
    if (!$ && M) {
        let G;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) G = async () => {
            try {
                let N = await ug() === "native";
                H(N), D(!1)
            } catch (v) {
                k(`Error checking installation type after migration: ${v}`), H(!0), D(!1)
            }
        }, q[9] = G;
        else G = q[9];
        let f;
        if (q[10] !== z || q[11] !== Y || q[12] !== O) f = gE.createElement(SIq, {
            onMigrationComplete: G,
            onChangeIsUpdating: Y,
            onAutoUpdaterResult: z,
            verbose: O
        }), q[10] = z, q[11] = Y, q[12] = O, q[13] = f;
        else f = q[13];
        return f
    }
    let W = $ ? EIq : VIq,
        Z;
    if (q[14] !== W || q[15] !== _ || q[16] !== K || q[17] !== z || q[18] !== Y || q[19] !== w || q[20] !== O) Z = gE.createElement(W, {
        verbose: O,
        onAutoUpdaterResult: z,
        autoUpdaterResult: _,
        isUpdating: K,
        onChangeIsUpdating: Y,
        showSuccessMessage: w
    }), q[14] = W, q[15] = _, q[16] = K, q[17] = z, q[18] = Y, q[19] = w, q[20] = O, q[21] = Z;
    else Z = q[21];
    return Z
}
// @from(Ln 493825, Col 4)
gE
// @from(Ln 493826, Col 4)
bIq = E(() => {
    e6();
    kIq();
    yIq();
    RIq();
    CIq();
    tc();
    H1();
    ns8();
    k8();
    gE = t(P6(), 1)
})
// @from(Ln 493839, Col 0)
function uIq() {
    return xIq.useSyncExternalStore(dc4, Uc4)
}
// @from(Ln 493842, Col 4)
xIq
// @from(Ln 493843, Col 4)
mIq = E(() => {
    jN1();
    xIq = t(P6(), 1)
})
// @from(Ln 493848, Col 0)
function gIq(A) {
    let q = A6(13),
        {
            tokenUsage: K,
            model: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = mz6(K, Y), q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let {
        percentLeft: _,
        isAboveWarningThreshold: w,
        isAboveErrorThreshold: O
    } = z, $ = uIq();
    if (!w || $) return null;
    let H;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) H = Xh(), q[3] = H;
    else H = q[3];
    let j = H,
        J;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) J = LZ6("warning"), q[4] = J;
    else J = q[4];
    let M = J,
        D = _,
        X = !1,
        P = !1;
    if (X || P) {
        let G = OF(Y),
            f;
        if (q[5] !== G || q[6] !== K) f = Math.round((G - K) / G * 100), q[5] = G, q[6] = K, q[7] = f;
        else f = q[7];
        D = Math.max(0, f)
    }
    let W = X ? `${100-D}% context used` : `${D}% until auto-compact`,
        Z;
    if (q[9] !== W || q[10] !== O || q[11] !== _) Z = D26.createElement(m, {
        flexDirection: "row"
    }, j ? D26.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, M ? `${W} · ${M}` : W) : D26.createElement(T, {
        color: O ? "error" : "warning",
        wrap: "truncate"
    }, M ? `Context low (${_}% remaining) · ${M}` : `Context low (${_}% remaining) · Run /compact to compact & continue`)), q[9] = W, q[10] = O, q[11] = _, q[12] = Z;
    else Z = q[12];
    return Z
}
// @from(Ln 493895, Col 4)
D26
// @from(Ln 493895, Col 9)
QWz
// @from(Ln 493896, Col 4)
FIq = E(() => {
    e6();
    i6();
    Xl();
    HA();
    mIq();
    WZ1();
    D26 = t(P6(), 1), QWz = t(P6(), 1)
})
// @from(Ln 493906, Col 0)
function pIq(A, q) {
    return mz6(A, q).isAboveWarningThreshold
}
// @from(Ln 493909, Col 4)
QIq = E(() => {
    Xl()
})
// @from(Ln 493913, Col 0)
function LV6(A) {
    return UIq.useMemo(() => {
        let q = A?.find((z) => z.name === "ide");
        if (!q) return {
            status: null,
            ideName: null
        };
        let K = q.config,
            Y = K.type === "sse-ide" || K.type === "ws-ide" ? K.ideName : null;
        if (q.type === "connected") return {
            status: "connected",
            ideName: Y
        };
        if (q.type === "pending") return {
            status: "pending",
            ideName: Y
        };
        return {
            status: "disconnected",
            ideName: Y
        }
    }, [A])
}
// @from(Ln 493936, Col 4)
UIq