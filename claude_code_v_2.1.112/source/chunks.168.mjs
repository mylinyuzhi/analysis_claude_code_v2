
// @from(Ln 435728, Col 0)
function AxK(q) {
    let K = s(19),
        {
            cells: _,
            columns: z,
            widths: Y,
            box: A,
            isHeader: O
        } = q,
        w;
    if (K[0] !== A) w = jY.default.createElement(YxK, {
        box: A,
        side: "left"
    }), K[0] = A, K[1] = w;
    else w = K[1];
    let $;
    if (K[2] !== A || K[3] !== _ || K[4] !== z || K[5] !== O || K[6] !== Y) {
        let J;
        if (K[8] !== A || K[9] !== _ || K[10] !== O || K[11] !== Y) J = (X, M) => jY.default.createElement(jY.default.Fragment, {
            key: M
        }, M > 0 && jY.default.createElement(CLY, {
            box: A
        }), jY.default.createElement(u, {
            width: Y[M] || void 0,
            flexShrink: 0,
            justifyContent: yLY[X.align ?? "start"]
        }, RLY(_[M], X, O))), K[8] = A, K[9] = _, K[10] = O, K[11] = Y, K[12] = J;
        else J = K[12];
        $ = z.map(J), K[2] = A, K[3] = _, K[4] = z, K[5] = O, K[6] = Y, K[7] = $
    } else $ = K[7];
    let j;
    if (K[13] !== A) j = jY.default.createElement(YxK, {
        box: A,
        side: "right"
    }), K[13] = A, K[14] = j;
    else j = K[14];
    let H;
    if (K[15] !== w || K[16] !== $ || K[17] !== j) H = jY.default.createElement(u, {
        flexDirection: "row"
    }, w, $, j), K[15] = w, K[16] = $, K[17] = j, K[18] = H;
    else H = K[18];
    return H
}
// @from(Ln 435772, Col 0)
function xLY(q) {
    let K = s(2),
        {
            children: _
        } = q,
        z;
    if (K[0] !== _) z = jY.default.createElement(jY.default.Fragment, null, _), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 435783, Col 0)
function uLY(q) {
    let K = s(22),
        {
            box: _,
            columns: z,
            children: Y,
            forceWidth: A
        } = q,
        O = _ === void 0 ? "plain" : _,
        {
            columns: w
        } = s1(),
        $ = A ?? w,
        j, H, J, X, M, P, W;
    if (K[0] !== O || K[1] !== Y || K[2] !== z || K[3] !== $) {
        let G = jY.Children.toArray(Y).filter(jY.isValidElement),
            f = G.map(pLY),
            v = z.some(BLY);
        W = SLY(z, f, v, $, O), j = u, H = "column", J = O === "grid" && jY.default.createElement(rA7, {
            box: O,
            type: "top",
            widths: W
        }), X = v && jY.default.createElement(AxK, {
            cells: z.map(mLY),
            columns: z,
            widths: W,
            box: O,
            isHeader: !0
        }), M = v && O !== "plain" && jY.default.createElement(rA7, {
            box: O,
            type: "header",
            widths: W
        }), P = f.map((V, k) => jY.default.createElement(AxK, {
            key: G[k].key ?? k,
            cells: V,
            columns: z,
            widths: W,
            box: O,
            isHeader: !1
        })), K[0] = O, K[1] = Y, K[2] = z, K[3] = $, K[4] = j, K[5] = H, K[6] = J, K[7] = X, K[8] = M, K[9] = P, K[10] = W
    } else j = K[4], H = K[5], J = K[6], X = K[7], M = K[8], P = K[9], W = K[10];
    let D;
    if (K[11] !== O || K[12] !== W) D = O === "grid" && jY.default.createElement(rA7, {
        box: O,
        type: "bottom",
        widths: W
    }), K[11] = O, K[12] = W, K[13] = D;
    else D = K[13];
    let Z;
    if (K[14] !== j || K[15] !== H || K[16] !== J || K[17] !== X || K[18] !== M || K[19] !== P || K[20] !== D) Z = jY.default.createElement(j, {
        flexDirection: H
    }, J, X, M, P, D), K[14] = j, K[15] = H, K[16] = J, K[17] = X, K[18] = M, K[19] = P, K[20] = D, K[21] = Z;
    else Z = K[21];
    return Z
}
// @from(Ln 435839, Col 0)
function mLY(q) {
    return q.header
}
// @from(Ln 435843, Col 0)
function BLY(q) {
    return q.header !== void 0
}
// @from(Ln 435847, Col 0)
function pLY(q) {
    return jY.Children.toArray(q.props.children)
}
// @from(Ln 435850, Col 4)
jY
// @from(Ln 435850, Col 8)
yLY
// @from(Ln 435850, Col 13)
oA7 = 2
// @from(Ln 435851, Col 4)
Wn
// @from(Ln 435852, Col 4)
aA7 = L(() => {
    o6();
    I4();
    y$6();
    n5();
    g6();
    VB1();
    jY = K6(P6(), 1), yLY = {
        start: "flex-start",
        center: "center",
        end: "flex-end"
    };
    Wn = Object.assign(uLY, {
        Row: xLY
    })
})
// @from(Ln 435869, Col 0)
function FLY() {
    let q = I8(),
        _ = NH(q) ?? t5.createElement(T, {
            dimColor: !0
        }, "/rename to add a name");
    return [{
        label: "Version",
        value: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION
    }, ...[], {
        label: "Session name",
        value: _
    }, {
        label: "Session ID",
        value: q
    }, {
        label: "cwd",
        value: b8()
    }, ...pp8(), ...Fp8()]
}
// @from(Ln 435896, Col 0)
function gLY({
    mainLoopModel: q,
    mcp: K,
    theme: _,
    context: z
}) {
    return [{
        label: "Model",
        value: b_K(q)
    }, ...y_K(K.clients, z.options.ideInstallationStatus, _), ...L_K(K.clients, _), ...E_K(), ...R_K()]
}
// @from(Ln 435907, Col 0)
async function OxK() {
    return [...await S_K(), ...await C_K(), ...await h_K()]
}
// @from(Ln 435911, Col 0)
function ULY(q) {
    let K = s(8),
        {
            value: _
        } = q;
    if (Array.isArray(_)) {
        let z;
        if (K[0] !== _) {
            let A;
            if (K[2] !== _.length) A = (O, w) => t5.createElement(T, {
                key: w
            }, O, w < _.length - 1 ? "," : ""), K[2] = _.length, K[3] = A;
            else A = K[3];
            z = _.map(A), K[0] = _, K[1] = z
        } else z = K[1];
        let Y;
        if (K[4] !== z) Y = t5.createElement(u, {
            flexWrap: "wrap",
            columnGap: 1,
            flexShrink: 99
        }, z), K[4] = z, K[5] = Y;
        else Y = K[5];
        return Y
    }
    if (typeof _ === "string") {
        let z;
        if (K[6] !== _) z = t5.createElement(T, null, _), K[6] = _, K[7] = z;
        else z = K[7];
        return z
    }
    return _
}
// @from(Ln 435944, Col 0)
function wxK(q) {
    let K = s(21),
        {
            context: _,
            diagnosticsPromise: z
        } = q,
        Y = M8(lLY),
        A = M8(cLY),
        [O] = Zq(),
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = FLY(), K[0] = w;
    else w = K[0];
    let $;
    if (K[1] !== _ || K[2] !== Y || K[3] !== A || K[4] !== O) $ = gLY({
        mainLoopModel: Y,
        mcp: A,
        theme: O,
        context: _
    }), K[1] = _, K[2] = Y, K[3] = A, K[4] = O, K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] !== $) j = [w, $], K[6] = $, K[7] = j;
    else j = K[7];
    let H = j,
        J = bP() ? 1 : void 0,
        X;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) X = [{
        bold: !0
    }, {}], K[8] = X;
    else X = K[8];
    let M;
    if (K[9] !== H) M = t5.createElement(Wn, {
        box: "plain",
        columns: X
    }, H.filter(dLY).flatMap(QLY)), K[9] = H, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== z) P = t5.createElement(dn8.Suspense, {
        fallback: null
    }, t5.createElement(nLY, {
        promise: z
    })), K[11] = z, K[12] = P;
    else P = K[12];
    let W;
    if (K[13] !== J || K[14] !== M || K[15] !== P) W = t5.createElement(u, {
        flexDirection: "column",
        gap: 1,
        flexGrow: J
    }, M, P), K[13] = J, K[14] = M, K[15] = P, K[16] = W;
    else W = K[16];
    let D;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) D = t5.createElement(T, {
        dimColor: !0
    }, t5.createElement(v1, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    })), K[17] = D;
    else D = K[17];
    let Z;
    if (K[18] !== J || K[19] !== W) Z = t5.createElement(u, {
        flexDirection: "column",
        flexGrow: J
    }, W, D), K[18] = J, K[19] = W, K[20] = Z;
    else Z = K[20];
    return Z
}
// @from(Ln 436013, Col 0)
function QLY(q, K) {
    return [K > 0 && t5.createElement(Wn.Row, {
        key: `gap-${K}`
    }, t5.createElement(t5.Fragment, null, " "), t5.createElement(t5.Fragment, null, "")), ...q.map((_, z) => {
        let {
            label: Y,
            value: A
        } = _;
        return t5.createElement(Wn.Row, {
            key: `${K}-${z}`
        }, t5.createElement(t5.Fragment, null, Y !== void 0 ? `${Y}:` : ""), t5.createElement(ULY, {
            value: A
        }))
    })]
}
// @from(Ln 436029, Col 0)
function dLY(q) {
    return q.length > 0
}
// @from(Ln 436033, Col 0)
function cLY(q) {
    return q.mcp
}
// @from(Ln 436037, Col 0)
function lLY(q) {
    return q.mainLoopModel
}
// @from(Ln 436041, Col 0)
function nLY(q) {
    let K = s(5),
        {
            promise: _
        } = q,
        z = dn8.use(_);
    if (z.length === 0) return null;
    let Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = t5.createElement(T, {
        bold: !0
    }, "System diagnostics"), K[0] = Y;
    else Y = K[0];
    let A;
    if (K[1] !== z) A = z.map(iLY), K[1] = z, K[2] = A;
    else A = K[2];
    let O;
    if (K[3] !== A) O = t5.createElement(u, {
        flexDirection: "column",
        paddingBottom: 1
    }, Y, A), K[3] = A, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 436065, Col 0)
function iLY(q, K) {
    return t5.createElement(u, {
        key: K,
        flexDirection: "row",
        gap: 1,
        paddingX: 1
    }, t5.createElement(D4, {
        status: "warning"
    }), typeof q === "string" ? t5.createElement(T, {
        wrap: "wrap"
    }, q) : q)
}
// @from(Ln 436077, Col 4)
t5
// @from(Ln 436077, Col 8)
dn8
// @from(Ln 436078, Col 4)
$xK = L(() => {
    o6();
    y8();
    Mk();
    g6();
    N7();
    n7();
    h_6();
    g4();
    t87();
    bK();
    Y2();
    aA7();
    t5 = K6(P6(), 1), dn8 = K6(P6(), 1)
})
// @from(Ln 436094, Col 0)
function Zx6(q) {
    let K = s(59),
        {
            onThemeSelect: _,
            showIntroText: z,
            helpText: Y,
            showHelpTextBelow: A,
            hideEscToCancel: O,
            skipExitHandling: w,
            onCancel: $
        } = q,
        j = z === void 0 ? !1 : z,
        H = Y === void 0 ? "" : Y,
        J = A === void 0 ? !1 : A,
        X = O === void 0 ? !1 : O,
        M = w === void 0 ? !1 : w,
        [P] = Zq(),
        W = $N6(),
        {
            columns: D
        } = s1(),
        Z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Z = O58(), K[0] = Z;
    else Z = K[0];
    let G = Z,
        f;
    if (K[1] !== P) f = G === null ? KPK(P) : null, K[1] = P, K[2] = f;
    else f = K[2];
    let v = f,
        {
            setPreviewTheme: V,
            savePreview: k,
            cancelPreview: N
        } = jN8(),
        R = M8(oLY) ?? !1,
        h = R7();
    dy8("ThemePicker");
    let C = V3("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t"),
        x;
    if (K[3] !== h || K[4] !== R) x = () => {
        if (G === null) {
            let r = !R;
            P7("userSettings", {
                syntaxHighlightingDisabled: r
            }), h((t) => ({
                ...t,
                settings: {
                    ...t.settings,
                    syntaxHighlightingDisabled: r
                }
            }))
        }
    }, K[3] = h, K[4] = R, K[5] = x;
    else x = K[5];
    let B;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) B = {
        context: "ThemePicker"
    }, K[6] = B;
    else B = K[6];
    G1("theme:toggleSyntaxHighlighting", x, B);
    let m = $3(M ? rLY : void 0),
        S;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) S = [{
        label: "Auto (match terminal)",
        value: "auto"
    }, {
        label: "Dark mode",
        value: "dark"
    }, {
        label: "Light mode",
        value: "light"
    }, {
        label: "Dark mode (colorblind-friendly)",
        value: "dark-daltonized"
    }, {
        label: "Light mode (colorblind-friendly)",
        value: "light-daltonized"
    }, {
        label: "Dark mode (ANSI colors only)",
        value: "dark-ansi"
    }, {
        label: "Light mode (ANSI colors only)",
        value: "light-ansi"
    }], K[7] = S;
    else S = K[7];
    let F = S,
        U;
    if (K[8] !== j) U = j ? e5.createElement(T, null, "Let's get started.") : e5.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Theme"), K[8] = j, K[9] = U;
    else U = K[9];
    let g;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) g = e5.createElement(T, {
        bold: !0
    }, "Choose the text style that looks best with your terminal"), K[10] = g;
    else g = K[10];
    let c;
    if (K[11] !== H || K[12] !== J) c = H && !J && e5.createElement(T, {
        dimColor: !0
    }, H), K[11] = H, K[12] = J, K[13] = c;
    else c = K[13];
    let n;
    if (K[14] !== c) n = e5.createElement(u, {
        flexDirection: "column"
    }, g, c), K[14] = c, K[15] = n;
    else n = K[15];
    let l;
    if (K[16] !== V) l = (r) => {
        V(r)
    }, K[16] = V, K[17] = l;
    else l = K[17];
    let z6;
    if (K[18] !== _ || K[19] !== k) z6 = (r) => {
        k(), _(r)
    }, K[18] = _, K[19] = k, K[20] = z6;
    else z6 = K[20];
    let A6;
    if (K[21] !== N || K[22] !== $ || K[23] !== M) A6 = M ? () => {
        N(), $?.()
    } : async () => {
        N(), await WK(0)
    }, K[21] = N, K[22] = $, K[23] = M, K[24] = A6;
    else A6 = K[24];
    let e;
    if (K[25] !== l || K[26] !== z6 || K[27] !== A6 || K[28] !== W) e = e5.createElement(A1, {
        options: F,
        onFocus: l,
        onChange: z6,
        onCancel: A6,
        visibleOptionCount: F.length,
        defaultValue: W,
        defaultFocusValue: W
    }), K[25] = l, K[26] = z6, K[27] = A6, K[28] = W, K[29] = e;
    else e = K[29];
    let i;
    if (K[30] !== U || K[31] !== n || K[32] !== e) i = e5.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, U, n, e), K[30] = U, K[31] = n, K[32] = e, K[33] = i;
    else i = K[33];
    let O6;
    if (K[34] === Symbol.for("react.memo_cache_sentinel")) O6 = {
        oldStart: 1,
        newStart: 1,
        oldLines: 3,
        newLines: 3,
        lines: [" function greet() {", '-  console.log("Hello, World!");', '+  console.log("Hello, Claude!");', " }"]
    }, K[34] = O6;
    else O6 = K[34];
    let J6;
    if (K[35] !== D) J6 = e5.createElement(u, {
        flexDirection: "column",
        borderTop: !0,
        borderBottom: !0,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "dashed",
        borderColor: "subtle"
    }, e5.createElement(il, {
        patch: O6,
        dim: !1,
        filePath: "demo.js",
        firstLine: null,
        width: D
    })), K[35] = D, K[36] = J6;
    else J6 = K[36];
    let $6 = G === "env" ? `Syntax highlighting disabled (via CLAUDE_CODE_SYNTAX_HIGHLIGHT=${process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT})` : R ? `Syntax highlighting disabled (${C} to enable)` : v ? `Syntax theme: ${v.theme}${v.source?` (from ${v.source})`:""} (${C} to disable)` : `Syntax highlighting enabled (${C} to disable)`,
        H6;
    if (K[37] !== $6) H6 = e5.createElement(T, {
        dimColor: !0
    }, " ", $6), K[37] = $6, K[38] = H6;
    else H6 = K[38];
    let q6;
    if (K[39] !== J6 || K[40] !== H6) q6 = e5.createElement(u, {
        flexDirection: "column",
        width: "100%"
    }, J6, H6), K[39] = J6, K[40] = H6, K[41] = q6;
    else q6 = K[41];
    let o;
    if (K[42] !== i || K[43] !== q6) o = e5.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, i, q6), K[42] = i, K[43] = q6, K[44] = o;
    else o = K[44];
    let _6 = o;
    if (!j) {
        let r;
        if (K[45] !== _6) r = e5.createElement(u, {
            flexDirection: "column"
        }, _6), K[45] = _6, K[46] = r;
        else r = K[46];
        let t;
        if (K[47] !== H || K[48] !== J) t = J && H && e5.createElement(u, {
            marginLeft: 3
        }, e5.createElement(T, {
            dimColor: !0
        }, H)), K[47] = H, K[48] = J, K[49] = t;
        else t = K[49];
        let Y6;
        if (K[50] !== m || K[51] !== X) Y6 = !X && e5.createElement(u, null, e5.createElement(T, {
            dimColor: !0,
            italic: !0
        }, m.pending ? e5.createElement(e5.Fragment, null, "Press ", m.keyName, " again to exit") : e5.createElement(z1, null, e5.createElement(A8, {
            chord: "enter",
            action: "select"
        }), e5.createElement(A8, {
            chord: "escape",
            action: "cancel"
        })))), K[50] = m, K[51] = X, K[52] = Y6;
        else Y6 = K[52];
        let X6;
        if (K[53] !== t || K[54] !== Y6) X6 = e5.createElement(u, {
            marginTop: 1
        }, t, Y6), K[53] = t, K[54] = Y6, K[55] = X6;
        else X6 = K[55];
        let M6;
        if (K[56] !== r || K[57] !== X6) M6 = e5.createElement(e5.Fragment, null, r, X6), K[56] = r, K[57] = X6, K[58] = M6;
        else M6 = K[58];
        return M6
    }
    return _6
}
// @from(Ln 436318, Col 0)
function rLY() {}
// @from(Ln 436320, Col 0)
function oLY(q) {
    return q.settings.syntaxHighlightingDisabled
}
// @from(Ln 436323, Col 4)
e5
// @from(Ln 436324, Col 4)
cn8 = L(() => {
    o6();
    C$();
    I4();
    g6();
    jp();
    C7();
    RM();
    N7();
    CY();
    a1();
    g_();
    Nq();
    u7();
    xU8();
    fb6();
    e5 = K6(P6(), 1)
})
// @from(Ln 436343, Col 0)
function jxK(q, K) {
    if (!QI(K)) return;
    let _ = $y6(K, q);
    return `${sA7(_)} ${_} · /effort`
}
// @from(Ln 436349, Col 0)
function sA7(q) {
    switch (q) {
        case "low":
            return sF7;
        case "medium":
            return YX8;
        case "high":
            return YO1;
        case "xhigh":
            return tF7;
        case "max":
            return eF7;
        default:
            return YO1
    }
}
// @from(Ln 436365, Col 4)
tA7 = L(() => {
    A3();
    hf()
})
// @from(Ln 436370, Col 0)
function kP6(q) {
    let K = s(88),
        {
            initial: _,
            sessionModel: z,
            onSelect: Y,
            onCancel: A,
            isStandaloneCommand: O,
            showFastModeNotice: w,
            headerText: $,
            skipSettingsWrite: j
        } = q,
        H = R7(),
        J = $3(),
        X = _ === null ? nn8 : _,
        [M, P] = ln8.useState(X),
        W = M8(qhY),
        [D, Z] = ln8.useState(!1),
        G = M8(eLY),
        f;
    if (K[0] !== G) f = G !== void 0 ? xt6(G) : void 0, K[0] = G, K[1] = f;
    else f = K[1];
    let [v, V] = ln8.useState(f), k = W ?? !1, N;
    if (K[2] !== k) N = q_6(k), K[2] = k, K[3] = N;
    else N = K[3];
    let R = N,
        h;
    q: {
        if (_ !== null && !R.some((p6) => p6.value === _)) {
            let p6;
            if (K[4] !== _) p6 = hE(_), K[4] = _, K[5] = p6;
            else p6 = K[5];
            let q8;
            if (K[6] !== _ || K[7] !== p6) q8 = {
                value: _,
                label: p6,
                description: "Current model"
            }, K[6] = _, K[7] = p6, K[8] = q8;
            else q8 = K[8];
            let L8;
            if (K[9] !== R || K[10] !== q8) L8 = [...R, q8], K[9] = R, K[10] = q8, K[11] = L8;
            else L8 = K[11];
            h = L8;
            break q
        }
        h = R
    }
    let C = h,
        x;
    if (K[12] !== C) x = C.map(tLY), K[12] = C, K[13] = x;
    else x = K[13];
    let B = x,
        m;
    if (K[14] !== X || K[15] !== B) m = B.some((p6) => p6.value === X) ? X : B[0]?.value ?? void 0, K[14] = X, K[15] = B, K[16] = m;
    else m = K[16];
    let S = m,
        F = Math.min(10, B.length),
        U = Math.max(0, B.length - F),
        g;
    if (K[17] !== M || K[18] !== B) g = B.find((p6) => p6.value === M)?.label, K[17] = M, K[18] = B, K[19] = g;
    else g = K[19];
    let c = g,
        n, l, z6, A6, e;
    if (K[20] !== M || K[21] !== D) {
        let p6 = qO7(M);
        l = p6 ? QI(p6) : !1, z6 = p6 ? Ct6(p6) : !1, A6 = p6 ? bt6(p6) : !1;
        let q8;
        if (K[27] !== M) q8 = eA7(M), K[27] = M, K[28] = q8;
        else q8 = K[28];
        n = q8, e = !D && !!p6 && o5(p6).includes("opus-4-7") && !H8().unpinOpus47LaunchEffort, K[20] = M, K[21] = D, K[22] = n, K[23] = l, K[24] = z6, K[25] = A6, K[26] = e
    } else n = K[22], l = K[23], z6 = K[24], A6 = K[25], e = K[26];
    let i = e,
        O6 = i ? "xhigh" : v === "max" && !z6 || v === "xhigh" && !A6 ? "high" : v,
        J6;
    if (K[29] !== G || K[30] !== D) J6 = (p6) => {
        if (P(p6), !D && G === void 0) V(eA7(p6))
    }, K[29] = G, K[30] = D, K[31] = J6;
    else J6 = K[31];
    let $6 = J6,
        H6;
    if (K[32] !== n || K[33] !== i || K[34] !== l || K[35] !== z6 || K[36] !== A6) H6 = (p6) => {
        if (!l) return;
        V((q8) => KhY(i ? "xhigh" : q8 ?? n, p6, z6, A6)), Z(!0)
    }, K[32] = n, K[33] = i, K[34] = l, K[35] = z6, K[36] = A6, K[37] = H6;
    else H6 = K[37];
    let q6 = H6,
        o;
    if (K[38] !== q6) o = {
        "modelPicker:decreaseEffort": () => q6("left"),
        "modelPicker:increaseEffort": () => q6("right")
    }, K[38] = q6, K[39] = o;
    else o = K[39];
    let _6;
    if (K[40] === Symbol.for("react.memo_cache_sentinel")) _6 = {
        context: "ModelPicker"
    }, K[40] = _6;
    else _6 = K[40];
    L7(o, _6);
    let r;
    if (K[41] !== v || K[42] !== D || K[43] !== Y || K[44] !== H || K[45] !== j) r = function(q8) {
        if (d("tengu_model_command_menu_effort", {
                effort: v
            }), !j && D) {
            let x8 = EM4(v, eA7(q8), E1("userSettings")?.effortLevel, D),
                a6 = It6(x8);
            if (a6 !== void 0) P7("userSettings", {
                effortLevel: a6
            });
            d8(sLY), H((D8) => ({
                ...D8,
                effortValue: x8
            }))
        }
        let L8 = qO7(q8),
            w8 = D && L8 && QI(L8) ? v : void 0;
        if (q8 === nn8) {
            Y(null, w8);
            return
        }
        Y(q8, w8)
    }, K[41] = v, K[42] = D, K[43] = Y, K[44] = H, K[45] = j, K[46] = r;
    else r = K[46];
    let t = r,
        Y6;
    if (K[47] === Symbol.for("react.memo_cache_sentinel")) Y6 = TK.createElement(T, {
        color: "remember",
        bold: !0
    }, "Select model"), K[47] = Y6;
    else Y6 = K[47];
    let X6 = $ ?? "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model.",
        M6;
    if (K[48] !== X6) M6 = TK.createElement(T, {
        dimColor: !0
    }, X6), K[48] = X6, K[49] = M6;
    else M6 = K[49];
    let W6;
    if (K[50] !== z) W6 = z && TK.createElement(T, {
        dimColor: !0
    }, "Currently using ", hE(z), " for this session (set by plan mode). Selecting a model will undo this."), K[50] = z, K[51] = W6;
    else W6 = K[51];
    let V6;
    if (K[52] !== M6 || K[53] !== W6) V6 = TK.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, Y6, M6, W6), K[52] = M6, K[53] = W6, K[54] = V6;
    else V6 = K[54];
    let f6 = A ?? aLY,
        G6;
    if (K[55] !== $6 || K[56] !== t || K[57] !== S || K[58] !== X || K[59] !== B || K[60] !== f6 || K[61] !== F) G6 = TK.createElement(u, {
        flexDirection: "column"
    }, TK.createElement(A1, {
        defaultValue: X,
        defaultFocusValue: S,
        options: B,
        onChange: t,
        onFocus: $6,
        onCancel: f6,
        visibleOptionCount: F
    })), K[55] = $6, K[56] = t, K[57] = S, K[58] = X, K[59] = B, K[60] = f6, K[61] = F, K[62] = G6;
    else G6 = K[62];
    let k6;
    if (K[63] !== U) k6 = U > 0 && TK.createElement(u, {
        paddingLeft: 3
    }, TK.createElement(T, {
        dimColor: !0
    }, "and ", U, " more…")), K[63] = U, K[64] = k6;
    else k6 = K[64];
    let T6;
    if (K[65] !== G6 || K[66] !== k6) T6 = TK.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, G6, k6), K[65] = G6, K[66] = k6, K[67] = T6;
    else T6 = K[67];
    let v6;
    if (K[68] !== O6 || K[69] !== n || K[70] !== c || K[71] !== l) v6 = TK.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, l ? TK.createElement(T, {
        dimColor: !0
    }, TK.createElement(HxK, {
        effort: O6
    }), " ", O6 === "xhigh" ? "xHigh" : gH6(O6), " ", "effort", O6 === n ? " (default)" : "", " ", TK.createElement(T, {
        color: "subtle"
    }, TK.createElement(A8, {
        chord: ["left", "right"],
        action: "adjust",
        format: {
            arrowSep: " "
        }
    }))) : TK.createElement(T, {
        color: "subtle"
    }, TK.createElement(HxK, {
        effort: void 0
    }), " Effort not supported", c ? ` for ${c}` : "")), K[68] = O6, K[69] = n, K[70] = c, K[71] = l, K[72] = v6;
    else v6 = K[72];
    let L6;
    if (K[73] !== w) L6 = q5() ? w ? TK.createElement(u, {
        marginBottom: 1
    }, TK.createElement(T, {
        dimColor: !0
    }, "Fast mode is ", TK.createElement(T, {
        bold: !0
    }, "ON"), " and available with", " ", wB, " only (/fast). Switching to other models turn off fast mode.")) : AM() && !fQ() ? TK.createElement(u, {
        marginBottom: 1
    }, TK.createElement(T, {
        dimColor: !0
    }, "Use ", TK.createElement(T, {
        bold: !0
    }, "/fast"), " to turn on Fast mode (", wB, " only).")) : null : null, K[73] = w, K[74] = L6;
    else L6 = K[74];
    let y6;
    if (K[75] !== V6 || K[76] !== T6 || K[77] !== v6 || K[78] !== L6) y6 = TK.createElement(u, {
        flexDirection: "column"
    }, V6, T6, v6, L6), K[75] = V6, K[76] = T6, K[77] = v6, K[78] = L6, K[79] = y6;
    else y6 = K[79];
    let c6;
    if (K[80] !== J || K[81] !== O) c6 = O && TK.createElement(T, {
        dimColor: !0,
        italic: !0
    }, J.pending ? TK.createElement(TK.Fragment, null, "Press ", J.keyName, " again to exit") : TK.createElement(z1, null, TK.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), TK.createElement(v1, {
        action: "select:cancel",
        context: "Select",
        fallback: "Esc",
        description: "exit"
    }))), K[80] = J, K[81] = O, K[82] = c6;
    else c6 = K[82];
    let Z8;
    if (K[83] !== y6 || K[84] !== c6) Z8 = TK.createElement(u, {
        flexDirection: "column"
    }, y6, c6), K[83] = y6, K[84] = c6, K[85] = Z8;
    else Z8 = K[85];
    let N8 = Z8;
    if (!O) return N8;
    let R6;
    if (K[86] !== N8) R6 = TK.createElement(A_, {
        color: "permission"
    }, N8), K[86] = N8, K[87] = R6;
    else R6 = K[87];
    return R6
}
// @from(Ln 436614, Col 0)
function aLY() {}
// @from(Ln 436616, Col 0)
function sLY(q) {
    return q.unpinOpus47LaunchEffort ? q : {
        ...q,
        unpinOpus47LaunchEffort: !0
    }
}
// @from(Ln 436623, Col 0)
function tLY(q) {
    return {
        ...q,
        value: q.value === null ? nn8 : q.value
    }
}
// @from(Ln 436630, Col 0)
function eLY(q) {
    return q.effortValue
}
// @from(Ln 436634, Col 0)
function qhY(q) {
    return q5() ? q.fastMode : !1
}
// @from(Ln 436638, Col 0)
function qO7(q) {
    if (!q) return;
    return q === nn8 ? ZP() : K5(q)
}
// @from(Ln 436643, Col 0)
function HxK(q) {
    let K = s(5),
        {
            effort: _
        } = q,
        z = _ ? "claude" : "subtle",
        Y = _ ?? "low",
        A;
    if (K[0] !== Y) A = sA7(Y), K[0] = Y, K[1] = A;
    else A = K[1];
    let O;
    if (K[2] !== z || K[3] !== A) O = TK.createElement(T, {
        color: z
    }, A), K[2] = z, K[3] = A, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 436661, Col 0)
function KhY(q, K, _, z) {
    let Y = ["low", "medium", "high"];
    if (z) Y.push("xhigh");
    if (_) Y.push("max");
    let A = Y.indexOf(q),
        O = A !== -1 ? A : Y.indexOf("high");
    if (K === "right") return Y[(O + 1) % Y.length];
    else return Y[(O - 1 + Y.length) % Y.length]
}
// @from(Ln 436671, Col 0)
function eA7(q) {
    let K = qO7(q) ?? ZP();
    return xt6(IF1(K))
}
// @from(Ln 436675, Col 4)
TK
// @from(Ln 436675, Col 8)
ln8
// @from(Ln 436675, Col 13)
nn8 = "__NO_PREFERENCE__"
// @from(Ln 436676, Col 4)
in8 = L(() => {
    o6();
    cb8();
    C$();
    C8();
    zf();
    g6();
    C7();
    N7();
    h1();
    hf();
    Sq();
    s58();
    a1();
    bK();
    g_();
    Nq();
    u7();
    DJ();
    tA7();
    TK = K6(P6(), 1), ln8 = K6(P6(), 1)
})
// @from(Ln 436699, Col 0)
function NP6(q, K, _) {
    if (!i7()) return !1;
    let z = q !== null ? K5(q).toLowerCase() : ZP().toLowerCase(),
        Y = z.includes("opus-4-6"),
        A = z.includes("opus-4-7"),
        O = z.includes("sonnet-4-6");
    if (Y && K) return !0;
    if (!DP(z)) return !1;
    if (Y && _) return !1;
    if (A && _) return !1;
    return Y || A || O
}
// @from(Ln 436711, Col 4)
rn8 = L(() => {
    T7();
    AJ();
    Sq()
})
// @from(Ln 436716, Col 4)
JxK = {}
// @from(Ln 436721, Col 0)
function KO7(q) {
    let K = s(18),
        {
            onDone: _,
            isStandaloneDialog: z,
            externalIncludes: Y
        } = q,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = [], K[0] = A;
    else A = K[0];
    Dn.default.useEffect(AhY, A);
    let O;
    if (K[1] !== _) O = (G) => {
        if (G === "no") d("tengu_claude_md_external_includes_dialog_declined", {}), u2(YhY);
        else d("tengu_claude_md_external_includes_dialog_accepted", {}), u2(zhY);
        _()
    }, K[1] = _, K[2] = O;
    else O = K[2];
    let w = O,
        $;
    if (K[3] !== w) $ = () => {
        w("no")
    }, K[3] = w, K[4] = $;
    else $ = K[4];
    let j = $,
        H = !z,
        J = !z,
        X;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) X = Dn.default.createElement(T, null, "This project's CLAUDE.md imports files outside the current working directory. Never allow this for third-party repositories."), K[5] = X;
    else X = K[5];
    let M;
    if (K[6] !== Y) M = Y && Y.length > 0 && Dn.default.createElement(u, {
        flexDirection: "column"
    }, Dn.default.createElement(T, {
        dimColor: !0
    }, "External imports:"), Y.map(_hY)), K[6] = Y, K[7] = M;
    else M = K[7];
    let P;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) P = Dn.default.createElement(T, {
        dimColor: !0
    }, "Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks", " ", Dn.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/security"
    }), " "), K[8] = P;
    else P = K[8];
    let W;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) W = [{
        label: "Yes, allow external imports",
        value: "yes"
    }, {
        label: "No, disable external imports",
        value: "no"
    }], K[9] = W;
    else W = K[9];
    let D;
    if (K[10] !== w) D = Dn.default.createElement(A1, {
        options: W,
        onChange: (G) => w(G)
    }), K[10] = w, K[11] = D;
    else D = K[11];
    let Z;
    if (K[12] !== j || K[13] !== D || K[14] !== H || K[15] !== J || K[16] !== M) Z = Dn.default.createElement(R1, {
        title: "Allow external CLAUDE.md file imports?",
        color: "warning",
        onCancel: j,
        hideBorder: H,
        hideInputGuide: J
    }, X, M, P, D), K[12] = j, K[13] = D, K[14] = H, K[15] = J, K[16] = M, K[17] = Z;
    else Z = K[17];
    return Z
}
// @from(Ln 436792, Col 0)
function _hY(q, K) {
    return Dn.default.createElement(T, {
        key: K,
        dimColor: !0
    }, "  ", q.path)
}
// @from(Ln 436799, Col 0)
function zhY(q) {
    return {
        ...q,
        hasClaudeMdExternalIncludesApproved: !0,
        hasClaudeMdExternalIncludesWarningShown: !0
    }
}
// @from(Ln 436807, Col 0)
function YhY(q) {
    return {
        ...q,
        hasClaudeMdExternalIncludesApproved: !1,
        hasClaudeMdExternalIncludesWarningShown: !0
    }
}
// @from(Ln 436815, Col 0)
function AhY() {
    d("tengu_claude_md_includes_dialog_shown", {})
}
// @from(Ln 436818, Col 4)
Dn
// @from(Ln 436819, Col 4)
_O7 = L(() => {
    o6();
    C8();
    g6();
    h1();
    g_();
    S4();
    Dn = K6(P6(), 1)
})
// @from(Ln 436829, Col 0)
function XxK(q) {
    let K = s(17),
        {
            currentVersion: _,
            onChoice: z
        } = q,
        Y;
    if (K[0] !== z) Y = function(D) {
        z(D)
    }, K[0] = z, K[1] = Y;
    else Y = K[1];
    let A = Y,
        O;
    if (K[2] !== z) O = function() {
        z("cancel")
    }, K[2] = z, K[3] = O;
    else O = K[3];
    let w = O,
        $;
    if (K[4] !== _) $ = n98.default.createElement(T, null, "The stable channel may have an older version than what you're currently running (", _, ")."), K[4] = _, K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) j = n98.default.createElement(T, {
        dimColor: !0
    }, "How would you like to handle this?"), K[6] = j;
    else j = K[6];
    let H;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) H = {
        label: "Allow possible downgrade to stable version",
        value: "downgrade"
    }, K[7] = H;
    else H = K[7];
    let J = `Stay on current version (${_}) until stable catches up`,
        X;
    if (K[8] !== J) X = [H, {
        label: J,
        value: "stay"
    }], K[8] = J, K[9] = X;
    else X = K[9];
    let M;
    if (K[10] !== A || K[11] !== X) M = n98.default.createElement(A1, {
        options: X,
        onChange: A
    }), K[10] = A, K[11] = X, K[12] = M;
    else M = K[12];
    let P;
    if (K[13] !== w || K[14] !== $ || K[15] !== M) P = n98.default.createElement(R1, {
        title: "Switch to Stable Channel",
        onCancel: w,
        color: "permission",
        hideBorder: !0,
        hideInputGuide: !0
    }, $, j, M), K[13] = w, K[14] = $, K[15] = M, K[16] = P;
    else P = K[16];
    return P
}
// @from(Ln 436885, Col 4)
n98
// @from(Ln 436886, Col 4)
MxK = L(() => {
    o6();
    g6();
    g_();
    S4();
    n98 = K6(P6(), 1)
})
// @from(Ln 436894, Col 0)
function PxK(q) {
    return Object.entries(q).map(([K, _]) => ({
        label: _?.name ?? OhY,
        value: K,
        description: _?.description ?? whY
    }))
}
// @from(Ln 436902, Col 0)
function WxK(q) {
    let K = s(16),
        {
            initialStyle: _,
            onComplete: z,
            onCancel: Y,
            isStandaloneCommand: A
        } = q,
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = [], K[0] = O;
    else O = K[0];
    let [w, $] = i98.useState(O), [j, H] = i98.useState(!0), J, X;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        Hx6(b8()).then((v) => {
            let V = PxK(v);
            $(V), H(!1)
        }).catch(() => {
            let v = PxK(GJ6);
            $(v), H(!1)
        })
    }, X = [], K[1] = J, K[2] = X;
    else J = K[1], X = K[2];
    i98.useEffect(J, X);
    let M;
    if (K[3] !== z) M = (v) => {
        z(v)
    }, K[3] = z, K[4] = M;
    else M = K[4];
    let P = M,
        W = !A,
        D = !A,
        Z;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) Z = CS.createElement(u, {
        marginTop: 1
    }, CS.createElement(T, {
        dimColor: !0
    }, "This changes how Claude Code communicates with you")), K[5] = Z;
    else Z = K[5];
    let G;
    if (K[6] !== P || K[7] !== _ || K[8] !== j || K[9] !== w) G = CS.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, Z, j ? CS.createElement(T, {
        dimColor: !0
    }, "Loading output styles…") : CS.createElement(A1, {
        options: w,
        onChange: P,
        visibleOptionCount: 10,
        defaultValue: _
    })), K[6] = P, K[7] = _, K[8] = j, K[9] = w, K[10] = G;
    else G = K[10];
    let f;
    if (K[11] !== Y || K[12] !== W || K[13] !== D || K[14] !== G) f = CS.createElement(R1, {
        title: "Preferred output style",
        onCancel: Y,
        hideInputGuide: W,
        hideBorder: D
    }, G), K[11] = Y, K[12] = W, K[13] = D, K[14] = G, K[15] = f;
    else f = K[15];
    return f
}
// @from(Ln 436963, Col 4)
CS
// @from(Ln 436963, Col 8)
i98
// @from(Ln 436963, Col 13)
OhY = "Default"
// @from(Ln 436964, Col 4)
whY = "Claude completes coding tasks efficiently and provides concise responses"
// @from(Ln 436965, Col 4)
DxK = L(() => {
    o6();
    ec();
    g6();
    n7();
    gK();
    S4();
    CS = K6(P6(), 1), i98 = K6(P6(), 1)
})
// @from(Ln 436975, Col 0)
function ZxK(q) {
    let K = s(13),
        {
            initialLanguage: _,
            onComplete: z,
            onCancel: Y
        } = q,
        [A, O] = Zn.useState(_),
        [w, $] = Zn.useState((_ ?? "").length),
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = {
        context: "Settings"
    }, K[0] = j;
    else j = K[0];
    G1("confirm:no", Y, j);
    let H;
    if (K[1] !== A || K[2] !== z) H = function() {
        let f = A?.trim();
        z(f || void 0)
    }, K[1] = A, K[2] = z, K[3] = H;
    else H = K[3];
    let J = H,
        X;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) X = Zn.default.createElement(T, null, "Enter your preferred response and voice language:"), K[4] = X;
    else X = K[4];
    let M;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) M = Zn.default.createElement(T, null, e6.pointer), K[5] = M;
    else M = K[5];
    let P = A ?? "",
        W;
    if (K[6] !== w || K[7] !== J || K[8] !== P) W = Zn.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, M, Zn.default.createElement(l4, {
        value: P,
        onChange: O,
        onSubmit: J,
        focus: !0,
        showCursor: !0,
        placeholder: `e.g., Japanese, 日本語, Español${e6.ellipsis}`,
        columns: 60,
        cursorOffset: w,
        onChangeCursorOffset: $
    })), K[6] = w, K[7] = J, K[8] = P, K[9] = W;
    else W = K[9];
    let D;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) D = Zn.default.createElement(T, {
        dimColor: !0
    }, "Leave empty for default (English)"), K[10] = D;
    else D = K[10];
    let Z;
    if (K[11] !== W) Z = Zn.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, X, W, D), K[11] = W, K[12] = Z;
    else Z = K[12];
    return Z
}
// @from(Ln 437033, Col 4)
Zn
// @from(Ln 437034, Col 4)
fxK = L(() => {
    o6();
    Qq();
    g6();
    C7();
    NY();
    Zn = K6(P6(), 1)
})
// @from(Ln 437043, Col 0)
function wg(q) {
    let K = s(23),
        {
            query: _,
            placeholder: z,
            isFocused: Y,
            isTerminalFocused: A,
            prefix: O,
            width: w,
            cursorOffset: $,
            borderless: j,
            highlights: H,
            prefixDim: J
        } = q,
        X = z === void 0 ? "Search…" : z,
        M = O === void 0 ? rF7 : O,
        P = j === void 0 ? !1 : j,
        W;
    if (K[0] !== H) W = H === void 0 ? [] : H, K[0] = H, K[1] = W;
    else W = K[1];
    let D = W,
        Z = J === void 0 ? !1 : J,
        G = $ ?? _.length,
        f = P ? void 0 : "round",
        v = Y ? "suggestion" : void 0,
        V = !Y,
        k = P ? 0 : 1,
        N = !Y,
        R;
    if (K[2] !== M || K[3] !== Z) R = Tu.default.createElement(T, {
        dimColor: Z
    }, M), K[2] = M, K[3] = Z, K[4] = R;
    else R = K[4];
    let h;
    if (K[5] !== D || K[6] !== Y || K[7] !== A || K[8] !== G || K[9] !== X || K[10] !== _) h = Y ? _ ? $hY(_, D, A ? G : -1) : A ? Tu.default.createElement(Tu.default.Fragment, null, Tu.default.createElement(T, {
        inverse: !0
    }, X.charAt(0)), Tu.default.createElement(T, {
        dimColor: !0
    }, X.slice(1))) : Tu.default.createElement(T, {
        dimColor: !0
    }, X) : _ ? Tu.default.createElement(T, null, _) : Tu.default.createElement(T, null, X), K[5] = D, K[6] = Y, K[7] = A, K[8] = G, K[9] = X, K[10] = _, K[11] = h;
    else h = K[11];
    let C;
    if (K[12] !== N || K[13] !== R || K[14] !== h) C = Tu.default.createElement(T, {
        dimColor: N
    }, R, " ", h), K[12] = N, K[13] = R, K[14] = h, K[15] = C;
    else C = K[15];
    let x;
    if (K[16] !== k || K[17] !== C || K[18] !== f || K[19] !== v || K[20] !== V || K[21] !== w) x = Tu.default.createElement(u, {
        flexShrink: 0,
        borderStyle: f,
        borderColor: v,
        borderDimColor: V,
        paddingX: k,
        width: w
    }, C), K[16] = k, K[17] = C, K[18] = f, K[19] = v, K[20] = V, K[21] = w, K[22] = x;
    else x = K[22];
    return x
}
// @from(Ln 437103, Col 0)
function $hY(q, K, _) {
    let z = (w) => K.some(([$, j]) => w >= $ && w < j),
        Y = new Set([0, q.length]);
    for (let [w, $] of K) Y.add(w), Y.add($);
    if (_ >= 0) Y.add(_), Y.add(_ + 1);
    let A = [...Y].sort((w, $) => w - $),
        O = [];
    for (let w = 0; w < A.length - 1; w++) {
        let $ = A[w],
            j = A[w + 1],
            H = $ < q.length ? q.slice($, j) : " ";
        if (!H) continue;
        O.push(Tu.default.createElement(T, {
            key: $,
            color: z($) ? "suggestion" : void 0,
            inverse: $ === _
        }, H))
    }
    return O
}
// @from(Ln 437123, Col 4)
Tu
// @from(Ln 437124, Col 4)
EP6 = L(() => {
    o6();
    A3();
    g6();
    Tu = K6(P6(), 1)
})
// @from(Ln 437131, Col 0)
function NxK() {
    return `${r7().BASE_API_URL}/api/claude_code/notification/preferences`
}
// @from(Ln 437135, Col 0)
function ExK() {
    if (o3()) return null;
    let q = o7();
    if (!q?.accessToken) return null;
    return {
        Authorization: `Bearer ${q.accessToken}`,
        "anthropic-beta": eJ,
        "User-Agent": yA()
    }
}
// @from(Ln 437145, Col 0)
async function jhY() {
    try {
        await _Y();
        let q = ExK();
        if (!q) return null;
        return (await Z1.get(NxK(), {
            headers: q,
            timeout: GxK
        })).data
    } catch (q) {
        let {
            kind: K
        } = LC(q);
        return j1("warn", "notif_prefs_fetch_failed", {
            kind: K
        }), null
    }
}
// @from(Ln 437163, Col 0)
async function yxK(q) {
    try {
        await _Y();
        let K = ExK();
        if (!K) return;
        await Z1.patch(NxK(), q, {
            headers: K,
            timeout: GxK
        }), j1("info", "notif_prefs_patch_ok", {})
    } catch (K) {
        let {
            kind: _
        } = LC(K);
        j1("warn", "notif_prefs_patch_failed", {
            kind: _
        })
    }
}
// @from(Ln 437182, Col 0)
function zO7() {
    let q = H8(),
        K = {};
    if (typeof q.agentPushNotifEnabled === "boolean") K.bogosort = {
        enable_push: q.agentPushNotifEnabled
    };
    if (typeof q.inputNeededNotifEnabled === "boolean") K.code_requires_action = {
        enable_push: q.inputNeededNotifEnabled
    };
    if (Object.keys(K).length === 0) return;
    yxK({
        preferences: {
            feature_preference: K
        }
    })
}
// @from(Ln 437199, Col 0)
function LxK(q) {
    let K = {};
    if (typeof q.agentPushNotifEnabled === "boolean") K.bogosort = {
        enable_push: q.agentPushNotifEnabled
    };
    if (typeof q.inputNeededNotifEnabled === "boolean") K.code_requires_action = {
        enable_push: q.inputNeededNotifEnabled
    };
    if (Object.keys(K).length === 0) return;
    yxK({
        preferences: {
            feature_preference: K
        }
    })
}
// @from(Ln 437214, Col 0)
async function hxK() {
    let q = await jhY();
    if (!q) {
        on8.setState(() => null), j1("info", "notif_prefs_hydrate_skipped", {
            reason: "fetch_failed_or_no_auth"
        });
        return
    }
    let K = q.push_reachability ?? null;
    if (on8.setState(() => K), K) d("tengu_push_reachability", {
        has_active_channel: K.has_active_channel,
        platform_count: K.platforms.length
    });
    let _ = q.preferences.feature_preference,
        z = _?.bogosort?.enable_push,
        Y = _?.code_requires_action?.enable_push,
        A = H8(),
        O = {};
    if (A.agentPushNotifEnabled === void 0 && typeof z === "boolean") O.agentPushNotifEnabled = z;
    if (A.inputNeededNotifEnabled === void 0 && typeof Y === "boolean") O.inputNeededNotifEnabled = Y;
    if (j1("info", "notif_prefs_hydrate_result", {
            has_active_channel: K?.has_active_channel,
            server_bogosort: z,
            server_code_requires_action: Y,
            seeded_agentPushNotifEnabled: O.agentPushNotifEnabled,
            seeded_inputNeededNotifEnabled: O.inputNeededNotifEnabled
        }), Object.keys(O).length === 0) return;
    d8((w) => ({
        ...w,
        ...O
    })), vxK.emit()
}
// @from(Ln 437246, Col 4)
GxK = 1e4
// @from(Ln 437247, Col 4)
on8
// @from(Ln 437247, Col 9)
vxK
// @from(Ln 437247, Col 14)
TxK
// @from(Ln 437247, Col 19)
VxK
// @from(Ln 437247, Col 24)
kxK
// @from(Ln 437248, Col 4)
YO7 = L(() => {
    CK();
    z3();
    T7();
    h1();
    VA();
    m8();
    G$();
    nH();
    C8();
    on8 = rE(void 0), vxK = l5(), TxK = on8.getState, VxK = on8.subscribe, kxK = vxK.subscribe
})
// @from(Ln 437261, Col 0)
function HhY(q) {
    if (q.ctrl && (q.key === "k" || q.key === "u" || q.key === "w")) return !0;
    if (q.meta && q.key === "backspace") return !0;
    return !1
}
// @from(Ln 437267, Col 0)
function JhY(q) {
    return (q.ctrl || q.meta) && q.key === "y"
}
// @from(Ln 437271, Col 0)
function bS({
    isActive: q,
    onExit: K,
    onCancel: _,
    onExitUp: z,
    columns: Y,
    passthroughCtrlKeys: A = [],
    initialQuery: O = "",
    backspaceExitsOnEmpty: w = !0,
    multiline: $ = !1,
    onSpaceOnEmpty: j,
    killRing: H
}) {
    let J = Cy8(),
        X = H ?? J,
        {
            columns: M
        } = s1(),
        P = Y ?? M,
        [W, D] = fn.useState(O),
        [Z, G] = fn.useState(O.length),
        f = fn.useRef(W),
        v = fn.useRef(Z),
        V = fn.useCallback((C) => {
            f.current = C, D(C)
        }, []),
        k = fn.useCallback((C) => {
            v.current = C, G(C)
        }, []),
        N = fn.useCallback((C) => {
            V(C), k(C.length)
        }, [V, k]);
    return {
        query: W,
        queryRef: f,
        setQuery: N,
        cursorOffset: Z,
        handleKeyDown: (C) => {
            if (!q) return;
            let x = f.current,
                B = v.current,
                m = FK.fromText(x, P, B);
            if (C.ctrl && A.includes(C.key.toLowerCase())) return;
            if (!HhY(C) && !JhY(C)) X.dispatch({
                type: "interrupt"
            });
            if (C.key === "return") {
                if (C.preventDefault(), $) {
                    if (B > 0 && x[B - 1] === "\\") {
                        V(x.slice(0, B - 1) + `
` + x.slice(B));
                        return
                    }
                    if (C.shift || C.meta) {
                        V(x.slice(0, B) + `
` + x.slice(B)), k(B + 1);
                        return
                    }
                }
                K();
                return
            }
            if (C.key === "down") {
                if (C.preventDefault(), !$) K();
                return
            }
            if (C.key === "up") {
                if (C.preventDefault(), z) z();
                return
            }
            if (C.key === "escape") {
                if (C.preventDefault(), _) _();
                else if (x.length > 0) V(""), k(0);
                else K();
                return
            }
            if (C.key === "backspace") {
                if (C.preventDefault(), C.meta) {
                    let {
                        cursor: F,
                        killed: U
                    } = m.deleteWordBefore();
                    X.dispatch({
                        type: "kill",
                        text: U,
                        direction: "prepend"
                    }), V(F.text), k(F.offset);
                    return
                }
                if (x.length === 0) {
                    if (w)(_ ?? K)();
                    return
                }
                let S = m.backspace();
                V(S.text), k(S.offset);
                return
            }
            if (C.key === "delete") {
                C.preventDefault();
                let S = m.del();
                V(S.text), k(S.offset);
                return
            }
            if (C.key === "left" && (C.ctrl || C.meta || C.fn)) {
                C.preventDefault();
                let S = m.prevWord();
                k(S.offset);
                return
            }
            if (C.key === "right" && (C.ctrl || C.meta || C.fn)) {
                C.preventDefault();
                let S = m.nextWord();
                k(S.offset);
                return
            }
            if (C.key === "left") {
                C.preventDefault();
                let S = m.left();
                k(S.offset);
                return
            }
            if (C.key === "right") {
                C.preventDefault();
                let S = m.right();
                k(S.offset);
                return
            }
            if (C.key === "home") {
                C.preventDefault(), k(0);
                return
            }
            if (C.key === "end") {
                C.preventDefault(), k(x.length);
                return
            }
            if (C.ctrl) {
                switch (C.preventDefault(), C.key.toLowerCase()) {
                    case "a":
                        k(0);
                        return;
                    case "e":
                        k(x.length);
                        return;
                    case "b":
                        k(m.left().offset);
                        return;
                    case "f":
                        k(m.right().offset);
                        return;
                    case "d": {
                        if (x.length === 0) {
                            (_ ?? K)();
                            return
                        }
                        let S = m.del();
                        V(S.text), k(S.offset);
                        return
                    }
                    case "h": {
                        if (x.length === 0) {
                            if (w)(_ ?? K)();
                            return
                        }
                        let S = m.backspace();
                        V(S.text), k(S.offset);
                        return
                    }
                    case "k": {
                        let {
                            cursor: S,
                            killed: F
                        } = m.deleteToLineEnd();
                        X.dispatch({
                            type: "kill",
                            text: F,
                            direction: "append"
                        }), V(S.text), k(S.offset);
                        return
                    }
                    case "u": {
                        if (m.text !== "") X.dispatch({
                            type: "kill",
                            text: m.text,
                            direction: "prepend"
                        });
                        V(""), k(0);
                        return
                    }
                    case "w": {
                        let {
                            cursor: S,
                            killed: F
                        } = m.deleteWordBefore();
                        X.dispatch({
                            type: "kill",
                            text: F,
                            direction: "prepend"
                        }), V(S.text), k(S.offset);
                        return
                    }
                    case "y": {
                        let S = Ry8(X.state);
                        if (S.length > 0) {
                            let F = m.offset,
                                U = m.insert(S);
                            X.dispatch({
                                type: "yank",
                                start: F,
                                length: S.length
                            }), V(U.text), k(U.offset)
                        }
                        return
                    }
                    case "g":
                    case "c":
                        if (_) {
                            _();
                            return
                        }
                }
                return
            }
            if (C.meta) {
                switch (C.preventDefault(), C.key.toLowerCase()) {
                    case "b":
                        k(m.prevWord().offset);
                        return;
                    case "f":
                        k(m.nextWord().offset);
                        return;
                    case "d": {
                        let S = m.deleteWordAfter();
                        V(S.text), k(S.offset);
                        return
                    }
                    case "y": {
                        let S = Sy8(X.state);
                        if (S) {
                            let {
                                text: F,
                                start: U,
                                length: g
                            } = S;
                            X.dispatch({
                                type: "yankPop"
                            });
                            let c = x.slice(0, U),
                                n = x.slice(U + g),
                                l = c + F + n,
                                z6 = U + F.length;
                            X.dispatch({
                                type: "updateYankLength",
                                length: F.length
                            }), V(l), k(z6)
                        }
                        return
                    }
                }
                return
            }
            if (C.key === "tab") {
                C.preventDefault();
                return
            }
            if (j && C.key === " " && x === "") {
                C.preventDefault(), j();
                return
            }
            if (C.key.length >= 1 && !XhY.has(C.key)) {
                C.preventDefault();
                let S = m.insert(C.key);
                V(S.text), k(S.offset)
            }
        },
        handlePaste: (C) => {
            if (!q || C.text.length === 0) return;
            C.preventDefault();
            let x = $ ? C.text.replace(/\r\n|\r/g, `
`) : C.text.split(/\r\n|\r|\n/, 2)[0] ?? "";
            if (x.length === 0) return;
            let m = FK.fromText(f.current, P, v.current).insert(x);
            V(m.text), k(m.offset)
        }
    }
}
// @from(Ln 437556, Col 4)
fn
// @from(Ln 437556, Col 8)
XhY
// @from(Ln 437557, Col 4)
R_6 = L(() => {
    by8();
    a$6();
    I4();
    fn = K6(P6(), 1);
    XhY = new Set(["pageup", "pagedown", "insert", "wheelup", "wheeldown", "mouse", "clear", "enter", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"])
})
// @from(Ln 437564, Col 4)
AO7 = L(() => {
    B1();
    QR();
    h1()
})