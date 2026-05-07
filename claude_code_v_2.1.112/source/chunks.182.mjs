
// @from(Ln 468470, Col 0)
function McK(q, K, _) {
    let z = RO.useRef(new Map),
        Y = RO.useRef(0),
        A = RO.useRef(0),
        O = RO.useRef({
            arr: new Float64Array(0),
            version: -1,
            n: -1
        }),
        w = RO.useRef(new Map),
        $ = RO.useRef(new Map),
        j = RO.useRef(_),
        H = RO.useRef(!1),
        J = RO.useRef(null),
        X = RO.useRef(0);
    if (j.current !== _) {
        let e = j.current / _;
        j.current = _;
        for (let [i, O6] of z.current) z.current.set(i, Math.max(1, Math.round(O6 * e)));
        Y.current++, H.current = !0, X.current = 2
    }
    let M = X.current > 0 ? J.current : null,
        P = RO.useRef(0),
        [, W] = RO.useState(0),
        D = RO.useRef(null),
        Z = RO.useCallback((e) => q.current?.subscribe(e) ?? FUY, [q]);
    RO.useSyncExternalStore(Z, () => {
        let e = q.current;
        if (!e) return NaN;
        let i = e.getScrollTop() + e.getPendingDelta(),
            O6 = Math.floor(i / pUY);
        return e.isSticky() ? ~O6 : O6
    });
    let G = q.current?.getScrollTop() ?? -1,
        f = q.current?.getPendingDelta() ?? 0,
        v = q.current?.getViewportHeight() ?? 0,
        V = q.current?.isSticky() ?? !0;
    RO.useMemo(() => {
        let e = new Set(K),
            i = !1;
        for (let O6 of z.current.keys())
            if (!e.has(O6)) z.current.delete(O6), i = !0;
        for (let O6 of $.current.keys())
            if (!e.has(O6)) $.current.delete(O6);
        if (i) Y.current++
    }, [K]);
    let k = K.length;
    if (O.current.version !== Y.current || O.current.n !== k) {
        let e = O.current.arr.length >= k + 1 ? O.current.arr : new Float64Array(k + 1);
        e[0] = 0;
        for (let i = 0; i < k; i++) e[i + 1] = e[i] + (z.current.get(K[i]) ?? mUY);
        O.current = {
            arr: e,
            version: Y.current,
            n: k
        }
    }
    let N = O.current.arr,
        R = N[k],
        h, C;
    if (M)[h, C] = M, h = Math.min(h, k), C = Math.min(C, k);
    else if (v === 0 || G < 0) h = Math.max(0, k - BUY), C = k;
    else {
        if (V) {
            let H6 = v + qu6;
            h = k;
            while (h > 0 && R - N[h - 1] < H6) h--;
            C = k
        } else {
            let H6 = P.current,
                q6 = v * 3,
                o = Math.min(G, G + f),
                _6 = Math.max(G, G + f),
                r = _6 - o,
                t = r > q6 ? f < 0 ? _6 - q6 : o : o,
                Y6 = t + Math.min(r, q6),
                X6 = Math.max(0, t - H6),
                M6 = Y6 - H6,
                W6 = X6 - qu6;
            {
                let k6 = 0,
                    T6 = k;
                while (k6 < T6) {
                    let v6 = k6 + T6 >> 1;
                    if (N[v6 + 1] <= W6) k6 = v6 + 1;
                    else T6 = v6
                }
                h = k6
            } {
                let k6 = J.current;
                if (k6 && k6[0] < h)
                    for (let T6 = k6[0]; T6 < Math.min(h, k6[1]); T6++) {
                        let v6 = K[T6];
                        if (w.current.has(v6) && !z.current.has(v6)) {
                            h = T6;
                            break
                        }
                    }
            }
            let V6 = v + 2 * qu6,
                f6 = Math.min(k, h + F_8),
                G6 = 0;
            C = h;
            while (C < f6 && (G6 < V6 || N[C] < M6 + v + qu6)) G6 += z.current.get(K[C]) ?? t27, C++
        }
        let e = v + 2 * qu6,
            i = Math.max(0, C - F_8),
            O6 = 0;
        for (let H6 = h; H6 < C; H6++) O6 += z.current.get(K[H6]) ?? t27;
        while (h > i && O6 < e) h--, O6 += z.current.get(K[h]) ?? t27;
        let J6 = J.current,
            $6 = Math.abs(G - A.current) + Math.abs(f);
        if (J6 && $6 > v * 2) {
            let [H6, q6] = J6;
            if (h < H6 - g_8) h = H6 - g_8;
            if (C > q6 + g_8) C = q6 + g_8;
            if (h > C) C = Math.min(h + g_8, k)
        }
        A.current = G
    }
    if (X.current > 0) X.current--;
    else J.current = [h, C];
    let x = RO.useDeferredValue(h),
        B = RO.useDeferredValue(C),
        m = h < x ? x : h,
        S = C > B ? B : C;
    if (m > S || V) m = h, S = C;
    if (f > 0) S = C;
    if (S - m > F_8) {
        let e = (N[m] + N[S]) / 2;
        if (G - P.current < e) S = m + F_8;
        else m = S - F_8
    }
    let F = N[m],
        U = S === k ? 1 / 0 : Math.max(F, N[S] - v);
    RO.useLayoutEffect(() => {
        let e = D.current?.yogaNode;
        if (e && e.getComputedWidth() > 0) {
            let J6 = e.getComputedTop(),
                $6 = P.current;
            if (P.current = J6, $6 !== 0 && Math.abs(J6 - $6) > 1) W((H6) => H6 + 1)
        }
        let i = P.current;
        if (V) q.current?.setClampBounds(void 0, void 0);
        else q.current?.setClampBounds(m === 0 ? 0 : F + i, U === 1 / 0 ? 1 / 0 : U + i);
        if (H.current) {
            H.current = !1;
            return
        }
        let O6 = !1;
        for (let [J6, $6] of w.current) {
            let H6 = $6.yogaNode;
            if (!H6) continue;
            let q6 = H6.getComputedHeight(),
                o = z.current.get(J6);
            if (q6 > 0) {
                if (o !== q6) z.current.set(J6, q6), O6 = !0
            } else if (H6.getComputedWidth() > 0 && o !== 0) z.current.set(J6, 0), O6 = !0
        }
        if (O6) Y.current++
    });
    let g = RO.useCallback((e) => {
            let i = $.current.get(e);
            if (!i) i = (O6) => {
                if (O6) w.current.set(e, O6);
                else {
                    let J6 = w.current.get(e)?.yogaNode;
                    if (J6 && !H.current) {
                        let $6 = J6.getComputedHeight();
                        if (($6 > 0 || J6.getComputedWidth() > 0) && z.current.get(e) !== $6) z.current.set(e, $6), Y.current++
                    }
                    w.current.delete(e)
                }
            }, $.current.set(e, i);
            return i
        }, []),
        c = RO.useCallback((e) => {
            let i = w.current.get(K[e])?.yogaNode;
            if (!i || i.getComputedWidth() === 0) return -1;
            return i.getComputedTop()
        }, [K]),
        n = RO.useCallback((e) => w.current.get(K[e]) ?? null, [K]),
        l = RO.useCallback((e) => z.current.get(K[e]), [K]),
        z6 = RO.useCallback((e) => {
            let i = O.current;
            if (e < 0 || e >= i.n) return;
            q.current?.scrollTo(i.arr[e] + P.current)
        }, [q]),
        A6 = R - N[S];
    return {
        range: [m, S],
        topSpacer: F,
        bottomSpacer: A6,
        measureRef: g,
        spacerRef: D,
        offsets: N,
        getItemTop: c,
        getItemElement: n,
        getItemHeight: l,
        scrollToIndex: z6
    }
}
// @from(Ln 468672, Col 4)
RO
// @from(Ln 468672, Col 8)
mUY = 3
// @from(Ln 468673, Col 4)
qu6 = 80
// @from(Ln 468674, Col 4)
BUY = 30
// @from(Ln 468675, Col 4)
pUY
// @from(Ln 468675, Col 9)
t27 = 1
// @from(Ln 468676, Col 4)
F_8 = 300
// @from(Ln 468677, Col 4)
g_8 = 25
// @from(Ln 468678, Col 4)
FUY = () => {}
// @from(Ln 468679, Col 4)
PcK = L(() => {
    RO = K6(P6(), 1), pUY = qu6 >> 1
})
// @from(Ln 468683, Col 0)
function GcK(q) {
    let K = s(6),
        {
            children: _
        } = q,
        [z, Y] = gM.useState(null),
        [A, O] = gM.useState(null),
        w;
    if (K[0] !== _ || K[1] !== A) w = gM.default.createElement(ZcK.Provider, {
        value: A
    }, _), K[0] = _, K[1] = A, K[2] = w;
    else w = K[2];
    let $;
    if (K[3] !== z || K[4] !== w) $ = gM.default.createElement(DcK.Provider, {
        value: Y
    }, gM.default.createElement(fcK.Provider, {
        value: O
    }, gM.default.createElement(WcK.Provider, {
        value: z
    }, w))), K[3] = z, K[4] = w, K[5] = $;
    else $ = K[5];
    return $
}
// @from(Ln 468707, Col 0)
function vcK() {
    return gM.useContext(WcK)
}
// @from(Ln 468711, Col 0)
function TcK() {
    return gM.useContext(ZcK)
}
// @from(Ln 468715, Col 0)
function VcK(q) {
    let K = s(4),
        _ = gM.useContext(DcK),
        z, Y;
    if (K[0] !== q || K[1] !== _) z = () => {
        if (!_) return;
        return _(q), () => _(null)
    }, Y = [_, q], K[0] = q, K[1] = _, K[2] = z, K[3] = Y;
    else z = K[2], Y = K[3];
    gM.useEffect(z, Y)
}
// @from(Ln 468727, Col 0)
function kcK(q) {
    let K = s(4),
        _ = gM.useContext(fcK),
        z, Y;
    if (K[0] !== q || K[1] !== _) z = () => {
        if (!_) return;
        return _(q), () => _(null)
    }, Y = [_, q], K[0] = q, K[1] = _, K[2] = z, K[3] = Y;
    else z = K[2], Y = K[3];
    gM.useEffect(z, Y)
}
// @from(Ln 468738, Col 4)
gM
// @from(Ln 468738, Col 8)
WcK
// @from(Ln 468738, Col 13)
DcK
// @from(Ln 468738, Col 18)
ZcK
// @from(Ln 468738, Col 23)
fcK
// @from(Ln 468739, Col 4)
Nr8 = L(() => {
    o6();
    gM = K6(P6(), 1), WcK = gM.createContext(null), DcK = gM.createContext(null), ZcK = gM.createContext(null), fcK = gM.createContext(null)
})
// @from(Ln 468747, Col 0)
function EcK(q) {
    let [K, _] = n3.useState(null), z = n3.useRef(K);
    z.current = K;
    let Y = n3.useRef(q);
    Y.current = q;
    let A = n3.useRef(null),
        O = n3.useCallback(() => {
            if (z.current !== null) _(null)
        }, []),
        w = n3.useCallback((H) => {
            let J = Math.max(0, H.getScrollHeight() - H.getViewportHeight());
            if (H.getScrollTop() + H.getPendingDelta() >= J) return;
            if (A.current === null) A.current = H.getScrollHeight(), _(Y.current)
        }, []),
        $ = n3.useCallback((H) => {
            if (!H) return;
            H.scrollToBottom()
        }, []);
    n3.useEffect(() => {
        if (K === null) A.current = null;
        else if (q < K) A.current = null, _(null)
    }, [q, K]);
    let j = n3.useCallback((H, J) => {
        if (_((X) => X === null ? null : X + H), A.current !== null) A.current += J
    }, []);
    return {
        dividerIndex: K,
        dividerYRef: A,
        onScrollAway: w,
        onRepin: O,
        jumpToNew: $,
        shiftDivider: j
    }
}
// @from(Ln 468782, Col 0)
function UUY(q, K) {
    let _ = 0,
        z = !1;
    for (let Y = K; Y < q.length; Y++) {
        let A = q[Y];
        if (A.type === "progress") continue;
        if (A.type === "assistant" && !QUY(A)) continue;
        let O = A.type === "assistant";
        if (O && !z) _++;
        z = O
    }
    return _
}
// @from(Ln 468796, Col 0)
function QUY(q) {
    if (q.type !== "assistant") return !1;
    for (let K of q.message.content)
        if (K.type === "text" && K.text?.trim()) return !0;
    return !1
}
// @from(Ln 468803, Col 0)
function ycK(q, K) {
    if (K === null) return;
    let _ = K;
    while (_ < q.length && (q[_]?.type === "progress" || Vr8(q[_]))) _++;
    let z = q[_]?.uuid;
    if (!z) return;
    let Y = UUY(q, K);
    return {
        firstUnseenUuid: z,
        count: Math.max(1, Y)
    }
}
// @from(Ln 468816, Col 0)
function q$7(q) {
    let K = s(44),
        {
            scrollable: _,
            bottom: z,
            overlay: Y,
            modal: A,
            modalScrollRef: O,
            scrollRef: w,
            dividerYRef: $,
            hidePill: j,
            hideSticky: H,
            newMessageCount: J,
            onPillClick: X
        } = q,
        M = j === void 0 ? !1 : j,
        P = H === void 0 ? !1 : H,
        W = J === void 0 ? 0 : J,
        {
            rows: D,
            columns: Z
        } = s1(),
        [G, f] = n3.useState(null),
        v;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) v = {
        setStickyPrompt: f
    }, K[0] = v;
    else v = K[0];
    let V = v,
        k;
    if (K[1] !== w) k = (B) => w?.current?.subscribe(B) ?? lUY, K[1] = w, K[2] = k;
    else k = K[2];
    let N = k,
        R;
    if (K[3] !== $ || K[4] !== w) R = () => {
        let B = w?.current,
            m = $?.current;
        if (!B || m == null) return !1;
        let S = B.getScrollTop() + B.getPendingDelta() + B.getViewportHeight();
        return S < m && S < B.getScrollHeight()
    }, K[3] = $, K[4] = w, K[5] = R;
    else R = K[5];
    let h = n3.useSyncExternalStore(N, R),
        C;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) C = [], K[6] = C;
    else C = K[6];
    if (n3.useLayoutEffect(dUY, C), lq()) {
        let B = P ? null : G,
            m = B != null && B !== "clicked" && Y == null ? B : null,
            S = B != null && Y == null,
            F;
        if (K[7] !== m) F = m && n3.default.createElement(iUY, {
            text: m.text,
            onClick: m.scrollTo
        }), K[7] = m, K[8] = F;
        else F = K[8];
        let U = S ? 0 : 1,
            g;
        if (K[9] !== _) g = n3.default.createElement(e27, {
            value: V
        }, _), K[9] = _, K[10] = g;
        else g = K[10];
        let c;
        if (K[11] !== Y || K[12] !== w || K[13] !== g || K[14] !== U) c = n3.default.createElement(Px6, {
            ref: w,
            flexGrow: 1,
            flexDirection: "column",
            paddingTop: U,
            stickyScroll: !0
        }, g, Y), K[11] = Y, K[12] = w, K[13] = g, K[14] = U, K[15] = c;
        else c = K[15];
        let n;
        if (K[16] !== M || K[17] !== W || K[18] !== X || K[19] !== Y || K[20] !== h) n = !M && h && Y == null && n3.default.createElement(nUY, {
            count: W,
            onClick: X
        }), K[16] = M, K[17] = W, K[18] = X, K[19] = Y, K[20] = h, K[21] = n;
        else n = K[21];
        let l;
        if (K[22] !== c || K[23] !== n || K[24] !== F) l = n3.default.createElement(u, {
            flexGrow: 1,
            flexDirection: "column",
            overflow: "hidden"
        }, F, c, n), K[22] = c, K[23] = n, K[24] = F, K[25] = l;
        else l = K[25];
        let z6, A6;
        if (K[26] === Symbol.for("react.memo_cache_sentinel")) z6 = n3.default.createElement(rUY, null), A6 = n3.default.createElement(oUY, null), K[26] = z6, K[27] = A6;
        else z6 = K[26], A6 = K[27];
        let e;
        if (K[28] !== z) e = n3.default.createElement(u, {
            flexDirection: "column",
            flexShrink: 0,
            width: "100%",
            maxHeight: "50%"
        }, z6, A6, n3.default.createElement(u, {
            flexDirection: "column",
            width: "100%",
            flexGrow: 1,
            flexShrink: 0,
            overflowY: "hidden"
        }, z)), K[28] = z, K[29] = e;
        else e = K[29];
        let i;
        if (K[30] !== Z || K[31] !== A || K[32] !== O || K[33] !== D) i = A != null && n3.default.createElement(xs6, {
            value: {
                rows: D - NcK - 1,
                columns: Z - 2 * Bs6,
                scrollRef: O ?? null
            }
        }, n3.default.createElement(u, {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: D - NcK,
            flexDirection: "column",
            overflow: "hidden",
            opaque: !0
        }, n3.default.createElement(u, {
            flexShrink: 0
        }, n3.default.createElement(T, {
            color: "permission"
        }, "▔".repeat(Z))), n3.default.createElement(u, {
            flexDirection: "column",
            paddingX: Bs6,
            flexShrink: 0,
            overflow: "hidden"
        }, A))), K[30] = Z, K[31] = A, K[32] = O, K[33] = D, K[34] = i;
        else i = K[34];
        let O6;
        if (K[35] !== l || K[36] !== e || K[37] !== i) O6 = n3.default.createElement(GcK, null, l, e, i), K[35] = l, K[36] = e, K[37] = i, K[38] = O6;
        else O6 = K[38];
        return O6
    }
    let x;
    if (K[39] !== z || K[40] !== A || K[41] !== Y || K[42] !== _) x = n3.default.createElement(n3.default.Fragment, null, _, z, Y, A), K[39] = z, K[40] = A, K[41] = Y, K[42] = _, K[43] = x;
    else x = K[43];
    return x
}
// @from(Ln 468955, Col 0)
function dUY() {
    if (!lq()) return;
    let q = KO.get(process.stdout);
    if (!q) return;
    return q.onHyperlinkClick = cUY, () => {
        q.onHyperlinkClick = void 0
    }
}
// @from(Ln 468964, Col 0)
function cUY(q) {
    if (q.startsWith("file:")) try {
        lS6(gUY(q))
    } catch {} else J3(q)
}
// @from(Ln 468970, Col 0)
function lUY() {}
// @from(Ln 468972, Col 0)
function nUY(q) {
    let K = s(11),
        {
            count: _,
            onClick: z
        } = q,
        [Y, A] = n3.useState(!1),
        O = V3("scroll:bottom", "Scroll", "ctrl+end"),
        w, $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = () => A(!0), $ = () => A(!1), K[0] = w, K[1] = $;
    else w = K[0], $ = K[1];
    let j = Y ? "userMessageBackgroundHover" : "userMessageBackground",
        H;
    if (K[2] !== _) H = _ > 0 ? `${_} new ${O7(_,"message")}` : "Jump to bottom", K[2] = _, K[3] = H;
    else H = K[3];
    let J;
    if (K[4] !== O || K[5] !== j || K[6] !== H) J = n3.default.createElement(T, {
        backgroundColor: j,
        dimColor: !0
    }, " ", H, " ", "(", O, ") ", e6.arrowDown, " "), K[4] = O, K[5] = j, K[6] = H, K[7] = J;
    else J = K[7];
    let X;
    if (K[8] !== z || K[9] !== J) X = n3.default.createElement(u, {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center"
    }, n3.default.createElement(u, {
        onClick: z,
        onMouseEnter: w,
        onMouseLeave: $
    }, J)), K[8] = z, K[9] = J, K[10] = X;
    else X = K[10];
    return X
}
// @from(Ln 469009, Col 0)
function iUY(q) {
    let K = s(8),
        {
            text: _,
            onClick: z
        } = q,
        [Y, A] = n3.useState(!1),
        O = Y ? "userMessageBackgroundHover" : "userMessageBackground",
        w, $;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = () => A(!0), $ = () => A(!1), K[0] = w, K[1] = $;
    else w = K[0], $ = K[1];
    let j;
    if (K[2] !== _) j = n3.default.createElement(T, {
        color: "subtle",
        wrap: "truncate-end"
    }, e6.pointer, " ", _), K[2] = _, K[3] = j;
    else j = K[3];
    let H;
    if (K[4] !== z || K[5] !== O || K[6] !== j) H = n3.default.createElement(u, {
        flexShrink: 0,
        width: "100%",
        height: 1,
        paddingRight: 1,
        backgroundColor: O,
        onClick: z,
        onMouseEnter: w,
        onMouseLeave: $
    }, j), K[4] = z, K[5] = O, K[6] = j, K[7] = H;
    else H = K[7];
    return H
}
// @from(Ln 469041, Col 0)
function rUY() {
    let q = s(4),
        K = vcK();
    if (!K || K.suggestions.length === 0) return null;
    let _;
    if (q[0] !== K.maxColumnWidth || q[1] !== K.selectedSuggestion || q[2] !== K.suggestions) _ = n3.default.createElement(u, {
        position: "absolute",
        bottom: "100%",
        left: 0,
        right: 0,
        paddingX: 2,
        paddingTop: 1,
        flexDirection: "column",
        opaque: !0
    }, n3.default.createElement(Hj4, {
        suggestions: K.suggestions,
        selectedSuggestion: K.selectedSuggestion,
        maxColumnWidth: K.maxColumnWidth,
        overlay: !0,
        noPad: !0
    })), q[0] = K.maxColumnWidth, q[1] = K.selectedSuggestion, q[2] = K.suggestions, q[3] = _;
    else _ = q[3];
    return _
}
// @from(Ln 469066, Col 0)
function oUY() {
    let q = s(2),
        K = TcK();
    if (!K) return null;
    let _;
    if (q[0] !== K) _ = n3.default.createElement(u, {
        position: "absolute",
        bottom: "100%",
        left: 0,
        right: 0,
        opaque: !0
    }, K), q[0] = K, q[1] = _;
    else _ = q[1];
    return _
}
// @from(Ln 469081, Col 4)
n3
// @from(Ln 469081, Col 8)
NcK = 2
// @from(Ln 469082, Col 4)
e27
// @from(Ln 469083, Col 4)
K$7 = L(() => {
    o6();
    Qq();
    Mk();
    Nr8();
    I4();
    En8();
    Yk();
    g6();
    RM();
    Nj();
    nO();
    DJ();
    s27();
    KL8();
    n3 = K6(P6(), 1), e27 = n3.createContext({
        setStickyPrompt: () => {}
    })
})
// @from(Ln 469103, Col 0)
function aUY(q) {
    let K = LcK.get(q);
    if (K !== void 0) return K;
    let _ = $r8(q);
    return LcK.set(q, _), _
}
// @from(Ln 469110, Col 0)
function tUY(q) {
    let K = hcK.get(q);
    if (K !== void 0) return K;
    let _ = eUY(q);
    return hcK.set(q, _), _
}
// @from(Ln 469117, Col 0)
function eUY(q) {
    let K = null;
    if (q.type === "user") {
        if (q.isMeta || q.isVisibleInTranscriptOnly) return null;
        let z = q.message.content[0];
        if (z?.type !== "text") return null;
        K = z.text
    } else if (q.type === "attachment" && q.attachment.type === "queued_command" && q.attachment.commandMode !== "task-notification" && !q.attachment.isMeta) {
        let z = q.attachment.prompt;
        K = typeof z === "string" ? z : z.flatMap((Y) => Y.type === "text" ? [Y.text] : []).join(`
`)
    }
    if (K === null) return null;
    let _ = BR8(K);
    if (_.startsWith("<") || _ === "") return null;
    return _
}
// @from(Ln 469135, Col 0)
function qQY({
    itemKey: q,
    msg: K,
    idx: _,
    measureRef: z,
    expanded: Y,
    hovered: A,
    clickable: O,
    onClickK: w,
    onEnterK: $,
    onLeaveK: j,
    renderItemRef: H
}) {
    return XZ.createElement(u, {
        ref: z(q),
        flexDirection: "column",
        backgroundColor: Y ? "userMessageBackgroundHover" : void 0,
        paddingBottom: Y ? 1 : void 0,
        onClick: O ? (J) => w(K, J.cellIsBlank) : void 0,
        onMouseEnter: O ? () => $(q) : void 0,
        onMouseLeave: O ? () => j(q) : void 0,
        hoverIgnoresBlankCells: !Y
    }, XZ.createElement(Ru1.Provider, {
        value: A && !Y
    }, H.current(K, _)))
}
// @from(Ln 469162, Col 0)
function RcK({
    messages: q,
    scrollRef: K,
    columns: _,
    itemKey: z,
    renderItem: Y,
    onItemClick: A,
    isItemClickable: O,
    isItemExpanded: w,
    extractSearchText: $ = aUY,
    trackStickyPrompt: j,
    selectedIndex: H,
    cursorNavRef: J,
    setCursor: X,
    jumpRef: M,
    onSearchMatchesChange: P,
    scanElement: W,
    setPositions: D
}) {
    let Z = b_.useMemo(() => zQY(q.map(z)), [q, z]),
        {
            range: G,
            topSpacer: f,
            bottomSpacer: v,
            measureRef: V,
            spacerRef: k,
            offsets: N,
            getItemTop: R,
            getItemElement: h,
            getItemHeight: C,
            scrollToIndex: x
        } = McK(K, Z, _),
        [B, m] = G,
        S = b_.useCallback((G6) => {
            if (C(G6) === 0) return !1;
            return nW4(q[G6])
        }, [C, q]);
    b_.useImperativeHandle(J, () => {
        let G6 = (L6) => X?.({
                uuid: L6.uuid,
                msgType: L6.type,
                expanded: !1,
                toolName: mR8(L6)?.name
            }),
            k6 = H ?? -1,
            T6 = (L6, y6, c6 = S) => {
                for (let Z8 = L6; Z8 >= 0 && Z8 < q.length; Z8 += y6)
                    if (c6(Z8)) return G6(q[Z8]), !0;
                return !1
            },
            v6 = (L6) => S(L6) && q[L6].type === "user";
        return {
            enterCursor: () => T6(q.length - 1, -1, v6),
            navigatePrev: () => T6(k6 - 1, -1),
            navigateNext: () => {
                if (T6(k6 + 1, 1)) return;
                K.current?.scrollToBottom(), X?.(null)
            },
            navigatePrevUser: () => T6(k6 - 1, -1, v6),
            navigateNextUser: () => T6(k6 + 1, 1, v6),
            navigateTop: () => T6(0, 1),
            navigateBottom: () => T6(q.length - 1, -1),
            getSelected: () => k6 >= 0 ? q[k6] ?? null : null
        }
    }, [q, H, X, S]);
    let F = b_.useRef({
        offsets: N,
        start: B,
        getItemElement: h,
        getItemTop: R,
        messages: q,
        scrollToIndex: x
    });
    F.current = {
        offsets: N,
        start: B,
        getItemElement: h,
        getItemTop: R,
        messages: q,
        scrollToIndex: x
    }, b_.useEffect(() => {
        if (H === void 0) return;
        let G6 = F.current,
            k6 = G6.getItemElement(H);
        if (k6) K.current?.scrollToElement(k6, 1);
        else G6.scrollToIndex(H)
    }, [H, K]);
    let U = b_.useRef(null),
        g = b_.useRef({
            msgIdx: -1,
            positions: []
        }),
        c = b_.useRef(-1),
        n = b_.useRef(0),
        l = b_.useRef(0),
        z6 = b_.useRef(() => {}),
        A6 = b_.useRef(() => {}),
        e = b_.useRef({
            matches: [],
            ptr: 0,
            screenOrd: 0,
            prefixSum: []
        }),
        i = b_.useRef(-1),
        O6 = b_.useRef(!1);

    function J6(G6) {
        let k6 = F.current.getItemTop(G6);
        return Math.max(0, k6 - _$7)
    }

    function $6(G6) {
        let k6 = K.current,
            {
                msgIdx: T6,
                positions: v6
            } = g.current;
        if (!k6 || v6.length === 0 || T6 < 0) {
            D?.(null);
            return
        }
        let L6 = Math.max(0, Math.min(G6, v6.length - 1)),
            y6 = v6[L6],
            c6 = F.current.getItemTop(T6),
            Z8 = k6.getViewportTop(),
            N8 = c6 - k6.getScrollTop(),
            R6 = k6.getViewportHeight(),
            p6 = Z8 + N8 + y6.row;
        if (p6 < Z8 || p6 >= Z8 + R6) k6.scrollTo(Math.max(0, c6 + y6.row - _$7)), N8 = c6 - k6.getScrollTop(), p6 = Z8 + N8 + y6.row;
        D?.({
            positions: v6,
            rowOffset: Z8 + N8,
            currentIdx: L6
        });
        let q8 = e.current,
            L8 = q8.prefixSum.at(-1) ?? 0,
            w8 = (q8.prefixSum[q8.ptr] ?? 0) + L6 + 1;
        P?.(L8, w8), E(`highlight(i=${T6}, ord=${L6}/${v6.length}): pos={row:${y6.row},col:${y6.col}} lo=${N8} screenRow=${p6} badge=${w8}/${L8}`)
    }
    A6.current = $6;
    let [H6, q6] = b_.useState(0), o = b_.useCallback(() => q6((G6) => G6 + 1), []);
    b_.useEffect(() => {
        let G6 = U.current;
        if (!G6) return;
        let {
            idx: k6,
            wantLast: T6,
            tries: v6
        } = G6, L6 = K.current;
        if (!L6) return;
        let {
            getItemElement: y6,
            getItemTop: c6,
            scrollToIndex: Z8
        } = F.current, N8 = y6(k6), R6 = N8?.yogaNode?.getComputedHeight() ?? 0;
        if (!N8 || R6 === 0) {
            if (v6 > 1) {
                U.current = null, E(`seek(i=${k6}): no mount after scrollToIndex, skip`), z6.current(T6 ? -1 : 1);
                return
            }
            U.current = {
                idx: k6,
                wantLast: T6,
                tries: v6 + 1
            }, Z8(k6), o();
            return
        }
        U.current = null, L6.scrollTo(Math.max(0, c6(k6) - _$7));
        let p6 = W?.(N8) ?? [];
        if (g.current = {
                msgIdx: k6,
                positions: p6
            }, E(`seek(i=${k6} t=${v6}): ${p6.length} positions`), p6.length === 0) {
            if (++n.current > 20) {
                n.current = 0;
                return
            }
            z6.current(T6 ? -1 : 1);
            return
        }
        n.current = 0;
        let q8 = T6 ? p6.length - 1 : 0;
        e.current.screenOrd = q8, c.current = -1, A6.current(q8);
        let L8 = l.current;
        if (L8) l.current = 0, z6.current(L8)
    }, [H6]);

    function _6(G6, k6) {
        let T6 = K.current;
        if (!T6) return;
        let v6 = F.current,
            {
                getItemElement: L6,
                scrollToIndex: y6
            } = v6;
        if (G6 < 0 || G6 >= v6.messages.length) return;
        D?.(null), g.current = {
            msgIdx: -1,
            positions: []
        }, U.current = {
            idx: G6,
            wantLast: k6,
            tries: 0
        };
        let c6 = L6(G6),
            Z8 = c6?.yogaNode?.getComputedHeight() ?? 0;
        if (c6 && Z8 > 0) T6.scrollTo(J6(G6));
        else y6(G6);
        o()
    }

    function r(G6) {
        let k6 = e.current,
            {
                matches: T6,
                prefixSum: v6
            } = k6,
            L6 = v6.at(-1) ?? 0;
        if (T6.length === 0) return;
        if (U.current) {
            l.current = G6;
            return
        }
        if (c.current < 0) c.current = k6.ptr;
        let {
            positions: y6
        } = g.current, c6 = k6.screenOrd + G6;
        if (c6 >= 0 && c6 < y6.length) {
            k6.screenOrd = c6, $6(c6), c.current = -1;
            return
        }
        let Z8 = (k6.ptr + G6 + T6.length) % T6.length;
        if (Z8 === c.current) {
            D?.(null), c.current = -1, E(`step: wraparound at ptr=${Z8}, all ${T6.length} msgs phantoms`);
            return
        }
        k6.ptr = Z8, k6.screenOrd = 0, _6(T6[Z8], G6 < 0);
        let N8 = G6 < 0 ? v6[Z8 + 1] ?? L6 : v6[Z8] + 1;
        P?.(L6, N8)
    }
    z6.current = r, b_.useImperativeHandle(M, () => ({
        jumpToIndex: (G6) => {
            let k6 = K.current;
            if (k6) k6.scrollTo(J6(G6))
        },
        setSearchQuery: (G6) => {
            U.current = null, g.current = {
                msgIdx: -1,
                positions: []
            }, c.current = -1, D?.(null);
            let k6 = G6.toLowerCase(),
                T6 = [],
                v6 = [0];
            if (k6) {
                let L8 = F.current.messages;
                for (let w8 = 0; w8 < L8.length; w8++) {
                    let x8 = $(L8[w8]),
                        a6 = x8.indexOf(k6),
                        D8 = 0;
                    while (a6 >= 0) D8++, a6 = x8.indexOf(k6, a6 + k6.length);
                    if (D8 > 0) T6.push(w8), v6.push(v6.at(-1) + D8)
                }
            }
            let L6 = v6.at(-1),
                y6 = 0,
                c6 = K.current,
                {
                    offsets: Z8,
                    start: N8,
                    getItemTop: R6
                } = F.current,
                p6 = R6(N8),
                q8 = p6 >= 0 ? p6 - Z8[N8] : 0;
            if (T6.length > 0 && c6) {
                let L8 = i.current >= 0 ? i.current : c6.getScrollTop(),
                    w8 = 1 / 0;
                for (let x8 = 0; x8 < T6.length; x8++) {
                    let a6 = Math.abs(q8 + Z8[T6[x8]] - L8);
                    if (a6 <= w8) w8 = a6, y6 = x8
                }
                E(`setSearchQuery('${G6}'): ${T6.length} msgs · ptr=${y6} msgIdx=${T6[y6]} curTop=${L8} origin=${q8}`)
            }
            if (e.current = {
                    matches: T6,
                    ptr: y6,
                    screenOrd: 0,
                    prefixSum: v6
                }, T6.length > 0) _6(T6[y6], !0);
            else if (i.current >= 0 && c6) c6.scrollTo(i.current);
            P?.(L6, T6.length > 0 ? v6[y6 + 1] ?? L6 : 0)
        },
        nextMatch: () => r(1),
        prevMatch: () => r(-1),
        setAnchor: () => {
            let G6 = K.current;
            if (G6) i.current = G6.getScrollTop()
        },
        disarmSearch: () => {
            D?.(null), U.current = null, g.current = {
                msgIdx: -1,
                positions: []
            }, c.current = -1
        },
        warmSearchIndex: async () => {
            if (O6.current) return 0;
            let G6 = F.current.messages,
                k6 = 500,
                T6 = 0,
                v6 = performance.now();
            for (let y6 = 0; y6 < G6.length; y6 += k6) {
                await l7(0);
                let c6 = performance.now(),
                    Z8 = Math.min(y6 + k6, G6.length);
                for (let N8 = y6; N8 < Z8; N8++) $(G6[N8]);
                T6 += performance.now() - c6
            }
            let L6 = Math.round(performance.now() - v6);
            return E(`warmSearchIndex: ${G6.length} msgs · work=${Math.round(T6)}ms wall=${L6}ms chunks=${Math.ceil(G6.length/k6)}`), O6.current = !0, Math.round(T6)
        }
    }), [K]);
    let [t, Y6] = b_.useState(null), X6 = b_.useRef({
        onItemClick: A,
        setHoveredKey: Y6
    });
    X6.current = {
        onItemClick: A,
        setHoveredKey: Y6
    };
    let M6 = b_.useCallback((G6, k6) => {
            let T6 = X6.current;
            if (!k6 && T6.onItemClick) T6.onItemClick(G6)
        }, []),
        W6 = b_.useCallback((G6) => {
            X6.current.setHoveredKey(G6)
        }, []),
        V6 = b_.useCallback((G6) => {
            X6.current.setHoveredKey((k6) => k6 === G6 ? null : k6)
        }, []),
        f6 = b_.useRef(Y);
    return f6.current = Y, XZ.createElement(XZ.Fragment, null, XZ.createElement(u, {
        ref: k,
        height: f,
        flexShrink: 0
    }), q.slice(B, m).map((G6, k6) => {
        let T6 = B + k6,
            v6 = Z[T6],
            L6 = !!A && (O?.(G6) ?? !0),
            y6 = L6 && t === v6,
            c6 = w?.(G6);
        return XZ.createElement(qQY, {
            key: v6,
            itemKey: v6,
            msg: G6,
            idx: T6,
            measureRef: V,
            expanded: c6,
            hovered: y6,
            clickable: L6,
            onClickK: M6,
            onEnterK: W6,
            onLeaveK: V6,
            renderItemRef: f6
        })
    }), v > 0 && XZ.createElement(u, {
        height: v,
        flexShrink: 0
    }), j && XZ.createElement(_QY, {
        messages: q,
        start: B,
        end: m,
        offsets: N,
        getItemTop: R,
        getItemElement: h,
        scrollRef: K
    }))
}
// @from(Ln 469539, Col 0)
function _QY({
    messages: q,
    start: K,
    end: _,
    offsets: z,
    getItemTop: Y,
    getItemElement: A,
    scrollRef: O
}) {
    let {
        setStickyPrompt: w
    } = b_.useContext(e27), $ = b_.useCallback((v) => O.current?.subscribe(v) ?? KQY, [O]);
    b_.useSyncExternalStore($, () => {
        let v = O.current;
        if (!v) return NaN;
        let V = v.getScrollTop() + v.getPendingDelta();
        return v.isSticky() ? -1 - V : V
    });
    let j = O.current?.isSticky() ?? !0,
        H = Math.max(0, (O.current?.getScrollTop() ?? 0) + (O.current?.getPendingDelta() ?? 0)),
        J = K,
        X = -1;
    for (let v = _ - 1; v >= K; v--) {
        let V = Y(v);
        if (V >= 0) {
            if (V < H) break;
            X = V
        }
        J = v
    }
    let M = -1,
        P = null;
    if (J > 0 && !j)
        for (let v = J - 1; v >= 0; v--) {
            let V = tUY(q[v]);
            if (V === null) continue;
            let k = Y(v);
            if (k >= 0 && k + 1 >= H) continue;
            M = v, P = V;
            break
        }
    let W = X >= 0 ? X - z[J] : 0,
        D = M >= 0 ? Math.max(0, W + z[M]) : -1,
        Z = b_.useRef({
            idx: -1,
            tries: 0
        }),
        G = b_.useRef("none"),
        f = b_.useRef(-1);
    return b_.useEffect(() => {
        if (Z.current.idx >= 0) return;
        if (G.current === "armed") {
            G.current = "force";
            return
        }
        let v = G.current === "force";
        if (G.current = "none", !v && f.current === M) return;
        if (f.current = M, P === null) {
            w(null);
            return
        }
        let V = P.trimStart(),
            k = V.search(/\n\s*\n/),
            N = (k >= 0 ? V.slice(0, k) : V).slice(0, sUY).replace(/\s+/g, " ").trim();
        if (N === "") {
            w(null);
            return
        }
        let R = M,
            h = D;
        w({
            text: N,
            scrollTo: () => {
                w("clicked"), G.current = "armed";
                let C = A(R);
                if (C) O.current?.scrollToElement(C, 1);
                else O.current?.scrollTo(h), Z.current = {
                    idx: R,
                    tries: 0
                }
            }
        })
    }), b_.useEffect(() => {
        if (Z.current.idx < 0) return;
        let v = A(Z.current.idx);
        if (v) O.current?.scrollToElement(v, 1), Z.current = {
            idx: -1,
            tries: 0
        };
        else if (++Z.current.tries > 5) Z.current = {
            idx: -1,
            tries: 0
        }
    }), null
}
// @from(Ln 469635, Col 0)
function zQY(q) {
    let K = q.slice(),
        _ = new Map,
        z = !1;
    for (let Y = 0; Y < K.length; Y++) {
        let A = K[Y],
            O = _.get(A);
        if (O === void 0) _.set(A, 1);
        else z = !0, _.set(A, O + 1), K[Y] = `${A}#${O}`
    }
    if (z) {
        let Y = [..._].filter(([, A]) => A > 1).slice(0, 3);
        j6(Error(`VirtualMessageList: duplicate sibling keys (leaks DOM nodes via mapRemainingChildren overwrite): ${Y.map(([A,O])=>`${A} ×${O}`).join(", ")}`))
    }
    return K
}
// @from(Ln 469651, Col 4)
XZ
// @from(Ln 469651, Col 8)
b_
// @from(Ln 469651, Col 12)
_$7 = 3
// @from(Ln 469652, Col 4)
LcK
// @from(Ln 469652, Col 9)
sUY = 500
// @from(Ln 469653, Col 4)
hcK
// @from(Ln 469653, Col 9)
KQY = () => {}
// @from(Ln 469654, Col 4)
ScK = L(() => {
    PcK();
    g6();
    dN6();
    K$7();
    K8();
    U8();
    F27();
    wy();
    XZ = K6(P6(), 1), b_ = K6(P6(), 1), LcK = new WeakMap;
    hcK = new WeakMap
})
// @from(Ln 469667, Col 0)
function OQY(q, K) {
    let _ = new Set(K),
        z = new Set;
    return q.filter((Y) => {
        if (Y.type === "system") return Y.subtype !== "api_metrics";
        let A = Y.message?.content[0];
        if (Y.type === "assistant") {
            if (Y.isApiErrorMessage) return !0;
            if (A?.type === "tool_use" && A.name && _.has(A.name)) {
                if ("id" in A) z.add(A.id);
                return !0
            }
            return !1
        }
        if (Y.type === "user") {
            if (A?.type === "tool_result") return A.tool_use_id !== void 0 && z.has(A.tool_use_id);
            return !Y.isMeta || GP6(Y.origin)
        }
        if (Y.type === "attachment") {
            let O = Y.attachment;
            return O?.type === "queued_command" && O.commandMode === "prompt" && (GP6(O.origin) || !O.isMeta && O.origin === void 0)
        }
        return !1
    })
}
// @from(Ln 469693, Col 0)
function wQY(q, K) {
    let _ = new Set(K),
        z = new Set,
        Y = [],
        A = 0;
    for (let O = 0; O < q.length; O++) {
        let w = q[O],
            $ = w.message?.content[0];
        if (w.type === "user" && $?.type !== "tool_result" && !w.isMeta) {
            A++;
            continue
        }
        if (w.type === "assistant") {
            if ($?.type === "text") Y[O] = A;
            else if ($?.type === "tool_use" && $.name && _.has($.name)) z.add(A)
        }
    }
    if (z.size === 0) return q;
    return q.filter((O, w) => {
        let $ = Y[w];
        return $ === void 0 || !z.has($)
    })
}
// @from(Ln 469717, Col 0)
function jQY(q) {
    return lq() ? Math.min(bcK, q) : bcK
}
// @from(Ln 469721, Col 0)
function IcK(q, K, _, z = $QY) {
    let Y = K.current,
        A = Y ? q[Y.idx]?.uuid === Y.uuid ? Y.idx : q.findIndex(($) => $.uuid === Y.uuid) : -1,
        O = A >= 0 ? A : Y && Y.idx < q.length ? Y.idx : 0;
    if (q.length - O > _ + z) O = q.length - _;
    let w = q[O];
    if (w && (Y?.uuid !== w.uuid || Y.idx !== O)) K.current = {
        uuid: w.uuid,
        idx: O
    };
    else if (!w && Y) K.current = null;
    return O
}
// @from(Ln 469735, Col 0)
function xcK(q) {
    return (q.type === "assistant" || q.type === "user" ? Ue(q) : null) ?? q.uuid
}
// @from(Ln 469739, Col 0)
function JQY(q, K) {
    if (q.size !== K.size) return !1;
    for (let _ of q)
        if (!K.has(_)) return !1;
    return !0
}
// @from(Ln 469746, Col 0)
function XQY(q, K, _) {
    return _ && q[0] === K[0] ? q : K
}
// @from(Ln 469750, Col 0)
function zW6(q) {
    let K = s(6),
        {
            deferMessages: _,
            placeholderBaseline: z,
            placeholderElement: Y,
            ...A
        } = q,
        O = zz.useDeferredValue(A.messages),
        w = XQY(O, A.messages, _),
        $;
    if (K[0] !== w || K[1] !== A) $ = LK.createElement(MQY, {
        ...A,
        messages: w
    }), K[0] = w, K[1] = A, K[2] = $;
    else $ = K[2];
    let j = Y && z !== void 0 && w.length <= z && Y,
        H;
    if (K[3] !== $ || K[4] !== j) H = LK.createElement(LK.Fragment, null, $, j), K[3] = $, K[4] = j, K[5] = H;
    else H = K[5];
    return H
}
// @from(Ln 469773, Col 0)
function zcK(q, K, _, z, Y, A) {
    if (Y === "transcript") return !0;
    switch (q.type) {
        case "attachment":
        case "user":
        case "assistant": {
            if (q.type === "assistant") {
                let w = q.message.content[0];
                if (w?.type === "server_tool_use") return A.resolvedToolUseIDs.has(w.id)
            }
            let O = Ue(q);
            if (!O) return !0;
            if (K.has(O)) return !1;
            if (_.has(O)) return !1;
            if (QCK(O, "PostToolUse", A)) return !1;
            return QQK(z, A.resolvedToolUseIDs)
        }
        case "system":
            return q.subtype !== "api_error";
        case "grouped_tool_use":
            return q.messages.every((w) => {
                let $ = w.message.content[0];
                return $?.type === "tool_use" && A.resolvedToolUseIDs.has($.id)
            });
        case "collapsed_read_search":
            return !1
    }
}
// @from(Ln 469801, Col 4)
LK
// @from(Ln 469801, Col 8)
zz
// @from(Ln 469801, Col 12)
YQY
// @from(Ln 469801, Col 17)
CcK
// @from(Ln 469801, Col 22)
AQY = null
// @from(Ln 469802, Col 4)
z$7 = 30
// @from(Ln 469803, Col 4)
$QY = 50
// @from(Ln 469804, Col 4)
bcK = 200
// @from(Ln 469805, Col 4)
HQY = ({
        messages: q,
        tools: K,
        commands: _,
        verbose: z,
        toolJSX: Y,
        toolUseConfirmQueue: A,
        inProgressToolUseIDs: O,
        isMessageSelectorVisible: w,
        conversationId: $,
        screen: j,
        streamingToolUses: H,
        showAllInTranscript: J = !1,
        agentDefinitions: X,
        onOpenRateLimitOptions: M,
        hideLogo: P = !1,
        isLoading: W,
        hidePastThinking: D = !1,
        streamingThinking: Z,
        streamingText: G,
        showThinkingHint: f = !1,
        isBriefOnly: v = !1,
        unseenDivider: V,
        scrollRef: k,
        trackStickyPrompt: N,
        jumpRef: R,
        onSearchMatchesChange: h,
        scanElement: C,
        setPositions: x,
        disableRenderCap: B = !1,
        cursor: m = null,
        setCursor: S,
        cursorNavRef: F,
        renderRange: U
    }) => {
        let {
            columns: g,
            rows: c
        } = s1(), n = V3("transcript:toggleShowAll", "Transcript", "Ctrl+E"), l = zz.useMemo(() => S6(process.env.CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL), []), z6 = M8((g8) => g8.briefTranscript), A6 = H9(), e = !1, i = zz.useMemo(() => null, [q, !1]), O6 = k != null && !l, J6 = jQY(c), $6 = zz.useRef(null), H6 = zz.useRef(null), q6 = zz.useRef($), o = zz.useRef(z);
        if (q6.current !== $) q6.current = $, $6.current = null, H6.current = null;
        if (o.current !== z) o.current = z, H6.current = null;
        let _6 = !O6 && !B ? IcK(q, $6, J6 * 2) : 0,
            r = zz.useRef(null);
        r.current ??= new WeakMap;
        let t = r.current,
            Y6 = zz.useMemo(() => {
                let g8 = _6 > 0,
                    w6 = g8 ? q.slice(_6) : q;
                return aP(w6, g8, t).filter(Z78)
            }, [q, _6, t]),
            X6 = zz.useMemo(() => {
                if (!Z) return !1;
                if (Z.isStreaming) return !0;
                if (Z.streamingEndedAt) return Date.now() - Z.streamingEndedAt < 30000;
                return !1
            }, [Z]),
            M6 = zz.useMemo(() => {
                if (!D) return null;
                if (X6) return "streaming";
                for (let g8 = Y6.length - 1; g8 >= 0; g8--) {
                    let w6 = Y6[g8];
                    if (w6?.type === "assistant") {
                        let D6 = w6.message.content;
                        for (let U6 = D6.length - 1; U6 >= 0; U6--)
                            if (D6[U6]?.type === "thinking") return `${w6.uuid}:${U6}`
                    } else if (w6?.type === "user") {
                        if (!w6.message.content.some((U6) => U6.type === "tool_result")) return "no-thinking"
                    }
                }
                return null
            }, [Y6, D, X6]),
            W6 = zz.useMemo(() => {
                for (let g8 = Y6.length - 1; g8 >= 0; g8--) {
                    let w6 = Y6[g8];
                    if (w6?.type === "user") {
                        let D6 = w6.message.content;
                        for (let U6 of D6)
                            if (U6.type === "text") {
                                let F6 = U6.text;
                                if (F6.startsWith("<bash-stdout") || F6.startsWith("<bash-stderr")) return w6.uuid
                            }
                    }
                }
                return null
            }, [Y6]),
            V6 = zz.useMemo(() => dCK(Y6), [Y6]),
            f6 = zz.useMemo(() => {
                let g8 = new Set;
                return H.filter((w6) => {
                    if (O.has(w6.contentBlock.id) || V6.has(w6.contentBlock.id) || g8.has(w6.contentBlock.id)) return !1;
                    return g8.add(w6.contentBlock.id), !0
                })
            }, [H, O, V6]),
            G6 = zz.useMemo(() => f6.flatMap((g8) => {
                let w6 = yj({
                    content: [g8.contentBlock]
                });
                return w6.uuid = S98(g8.contentBlock.id, 0), aP([w6])
            }), [f6]),
            k6 = j === "transcript",
            T6 = k6 && !J && !O6,
            {
                collapsed: v6,
                lookups: L6,
                hasTruncatedMessages: y6,
                hiddenMessageCount: c6
            } = zz.useMemo(() => {
                let g8 = z || lq() ? Y6 : H2(Y6, void 0),
                    w6 = pCK(g8.filter((c1) => c1.type !== "progress").filter((c1) => !Vr8(c1)).filter((c1) => KbK(c1, k6)), G6),
                    D6 = [CcK, AQY].filter((c1) => c1 !== null),
                    U6 = [CcK].filter((c1) => c1 !== null),
                    F6 = D6.length > 0 && !k6 ? v ? OQY(w6, D6) : U6.length > 0 ? wQY(w6, U6) : w6 : w6,
                    z8 = T6 ? F6.slice(-z$7) : F6,
                    l6 = T6 && F6.length > z$7,
                    {
                        messages: j8
                    } = sQK(z8, K, z),
                    f8 = cQK(iQK(oQK(nRK(j8, K))), z),
                    p8 = lq() && z6 && !k6 ? rRK(f8, K, (c1) => {
                        let dq = A6.getState().tasks[c1];
                        return dq?.type === "local_agent" ? dq.result?.toolStats : void 0
                    }, W) : f8,
                    o8 = FCK(Y6, z8),
                    n1 = w6.length - z$7;
                return {
                    collapsed: p8,
                    lookups: o8,
                    hasTruncatedMessages: l6,
                    hiddenMessageCount: n1
                }
            }, [z, Y6, k6, G6, T6, K, v, z6, A6, W]),
            Z8 = zz.useMemo(() => {
                let w6 = !O6 && !B ? IcK(v6, H6, J6) : 0;
                return U ? v6.slice(U[0], U[1]) : w6 > 0 ? v6.slice(w6) : v6
            }, [v6, U, O6, B, J6]),
            N8 = zz.useMemo(() => new Set(H.map((g8) => g8.contentBlock.id)), [H]),
            R6 = zz.useMemo(() => null, [Z8, i]),
            p6 = zz.useMemo(() => {
                if (!V) return -1;
                let g8 = V.firstUnseenUuid.slice(0, 24);
                return Z8.findIndex((w6) => w6.uuid.slice(0, 24) === g8)
            }, [V, Z8]),
            q8 = zz.useMemo(() => {
                if (!m) return -1;
                return Z8.findIndex((g8) => g8.uuid === m.uuid)
            }, [m, Z8]),
            [L8, w8] = zz.useState(() => new Set),
            x8 = zz.useCallback((g8) => {
                let w6 = xcK(g8);
                w8((D6) => {
                    let U6 = new Set(D6);
                    if (U6.has(w6)) U6.delete(w6);
                    else U6.add(w6);
                    return U6
                })
            }, []),
            a6 = zz.useCallback((g8) => L8.size > 0 && L8.has(xcK(g8)), [L8]),
            D8 = zz.useRef(L6);
        D8.current = L6;
        let Q6 = zz.useRef(g);
        Q6.current = g;
        let W8 = zz.useCallback((g8) => {
                if (g8.type === "collapsed_read_search") return !0;
                if (g8.type === "assistant") {
                    let F6 = g8.message.content[0];
                    return F6 != null && cH6(F6) && F6.type === "advisor_tool_result" && F6.content.type === "advisor_result"
                }
                if (g8.type !== "user") return !1;
                let w6 = g8.message.content[0];
                if (w6?.type !== "tool_result" || w6.is_error || !g8.toolUseResult) return !1;
                let D6 = D8.current.toolUseByToolUseID.get(w6.tool_use_id)?.name;
                return (D6 ? rK(K, D6) : void 0)?.isResultTruncated?.(g8.toolUseResult, {
                    columns: Q6.current
                }) ?? !1
            }, [K]),
            G8 = (!Y || !!Y.shouldContinueAnimation) && !A.length && !w,
            s6 = O.size > 0,
            {
                progress: u6
            } = fd(),
            h6 = zz.useRef(null),
            _8 = H8().terminalProgressBarEnabled && !nK();
        zz.useEffect(() => {
            let g8 = _8 ? s6 ? "indeterminate" : "completed" : null;
            if (h6.current === g8) return;
            h6.current = g8, u6(g8)
        }, [u6, _8, s6]), zz.useEffect(() => {
            return () => u6(null)
        }, [u6]);
        let R8 = zz.useCallback((g8) => `${g8.uuid}-${$}`, [$]),
            x6 = (g8, w6) => {
                let D6 = w6 > 0 ? Z8[w6 - 1]?.type : void 0,
                    U6 = g8.type === "user" && D6 === "user",
                    F6 = g8.type === "collapsed_read_search" && (!!G || qcK(Z8, w6, K, N8)),
                    z8 = R8(g8),
                    l6 = LK.createElement(KcK, {
                        key: z8,
                        message: g8,
                        isUserContinuation: U6,
                        hasContentAfter: F6,
                        tools: K,
                        commands: _,
                        verbose: z || a6(g8) || m?.expanded === !0 && w6 === q8,
                        inProgressToolUseIDs: O,
                        streamingToolUseIDs: N8,
                        screen: j,
                        canAnimate: G8,
                        onOpenRateLimitOptions: M,
                        lastThinkingBlockId: M6,
                        latestBashOutputUUID: W6,
                        columns: g,
                        isLoading: W,
                        lookups: L6
                    }),
                    f8 = LK.createElement(Vs.Provider, {
                        key: z8,
                        value: w6 === q8
                    }, l6);
                if (V && w6 === p6) return [LK.createElement(u, {
                    key: "unseen-divider",
                    marginTop: 1
                }, LK.createElement(zA, {
                    title: `${V.count} new ${O7(V.count,"message")}`,
                    width: g,
                    color: "inactive"
                })), f8];
                return f8
            },
            i6 = zz.useRef(null);
        i6.current ??= new WeakMap;
        let v8 = i6.current,
            f1 = zz.useCallback((g8) => {
                let w6 = v8.get(g8);
                if (w6 !== void 0) return w6;
                let D6 = $r8(g8);
                if (g8.type === "user" && g8.toolUseResult && Array.isArray(g8.message.content)) {
                    let F6 = g8.message.content.find((z8) => z8.type === "tool_result");
                    if (F6 && "tool_use_id" in F6) {
                        let z8 = D8.current.toolUseByToolUseID.get(F6.tool_use_id),
                            j8 = (z8 && rK(K, z8.name))?.extractSearchText?.(g8.toolUseResult);
                        if (j8 !== void 0) D6 = j8
                    }
                }
                let U6 = D6.toLowerCase();
                return v8.set(g8, U6), U6
            }, [K, v8]);
        return LK.createElement(LK.Fragment, null, !P && !(U && U[0] > 0) && LK.createElement(YQY, {
            agentDefinitions: X
        }), y6 && LK.createElement(zA, {
            title: `${n} to show ${Y8.bold(c6)} previous messages`,
            width: g
        }), k6 && J && c6 > 0 && !B && LK.createElement(zA, {
            title: `${n} to hide ${Y8.bold(c6)} previous messages`,
            width: g
        }), O6 ? LK.createElement(CK6.Provider, {
            value: !0
        }, LK.createElement(RcK, {
            messages: Z8,
            scrollRef: k,
            columns: g,
            itemKey: R8,
            renderItem: x6,
            onItemClick: x8,
            isItemClickable: W8,
            isItemExpanded: a6,
            trackStickyPrompt: N,
            selectedIndex: q8 >= 0 ? q8 : void 0,
            cursorNavRef: F,
            setCursor: S,
            jumpRef: R,
            onSearchMatchesChange: h,
            scanElement: C,
            setPositions: x,
            extractSearchText: f1
        })) : Z8.flatMap(x6), f && LK.createElement(JcK, {
            isLoading: W
        }), G && !v && LK.createElement(u, {
            alignItems: "flex-start",
            flexDirection: "row",
            marginTop: 1,
            width: "100%"
        }, LK.createElement(u, {
            flexDirection: "row"
        }, LK.createElement(u, {
            minWidth: 2
        }, LK.createElement(T, {
            color: "text"
        }, $9)), LK.createElement(u, {
            flexDirection: "column"
        }, LK.createElement(e2K, null, G)))), X6 && Z && !v && LK.createElement(u, {
            marginTop: 1
        }, LK.createElement(cg8, {
            param: {
                type: "thinking",
                thinking: Z.thinking
            },
            addMargin: !1,
            isTranscriptMode: !0,
            verbose: z,
            hideInTranscript: !1
        })))
    }
// @from(Ln 470107, Col 4)
MQY
// @from(Ln 470108, Col 4)
p_8 = L(() => {
    o6();
    Y3();
    y8();
    A3();
    I4();
    Gd();
    g6();
    RM();
    N7();
    gq();
    is();
    lQK();
    Bt();
    h1();
    Q8();
    nO();
    tQK();
    _7();
    F27();
    VR();
    odK();
    ry();
    _cK();
    wy();
    zq7();
    s27();
    f96();
    jcK();
    XcK();
    ScK();
    LK = K6(P6(), 1), zz = K6(P6(), 1), YQY = LK.memo(function(K) {
        let _ = s(3),
            {
                agentDefinitions: z
            } = K,
            Y;
        if (_[0] === Symbol.for("react.memo_cache_sentinel")) Y = LK.createElement(rdK, null), _[0] = Y;
        else Y = _[0];
        let A;
        if (_[1] !== z) A = LK.createElement(zG, null, LK.createElement(u, {
            flexDirection: "column",
            gap: 1
        }, Y, LK.createElement(LK.Suspense, {
            fallback: null
        }, LK.createElement($cK, {
            agentDefinitions: z
        })))), _[1] = z, _[2] = A;
        else A = _[2];
        return A
    }), CcK = (vh(), B7(TU)).BRIEF_TOOL_NAME;
    MQY = LK.memo(HQY, (q, K) => {
        let _ = Object.keys(q);
        for (let z of _) {
            if (z === "onOpenRateLimitOptions" || z === "scrollRef" || z === "trackStickyPrompt" || z === "setCursor" || z === "cursorNavRef" || z === "jumpRef" || z === "onSearchMatchesChange" || z === "scanElement" || z === "setPositions") continue;
            if (q[z] !== K[z]) {
                if (z === "streamingToolUses") {
                    let Y = q.streamingToolUses,
                        A = K.streamingToolUses;
                    if (Y.length === A.length && Y.every((O, w) => O.contentBlock === A[w]?.contentBlock)) continue
                }
                if (z === "inProgressToolUseIDs") {
                    if (JQY(q.inProgressToolUseIDs, K.inProgressToolUseIDs)) continue
                }
                if (z === "unseenDivider") {
                    let Y = q.unseenDivider,
                        A = K.unseenDivider;
                    if (Y?.firstUnseenUuid === A?.firstUnseenUuid && Y?.count === A?.count) continue
                }
                if (z === "tools") {
                    let Y = q.tools,
                        A = K.tools;
                    if (Y.length === A.length && Y.every((O, w) => O.name === A[w]?.name)) continue
                }
                return !1
            }
        }
        return !0
    })
})
// @from(Ln 470189, Col 0)
function ucK(q) {
    let K = s(33),
        {
            log: _,
            onExit: z,
            onSelect: Y
        } = q,
        [A, O] = QT.default.useState(null),
        w, $;
    if (K[0] !== _) w = () => {
        if (O(null), SF(_)) gt(_).then(O)
    }, $ = [_], K[0] = _, K[1] = w, K[2] = $;
    else w = K[1], $ = K[2];
    QT.default.useEffect(w, $);
    let j = SF(_) && A === null,
        H = A ?? _,
        J;
    if (K[3] !== H) J = xY(H) || "", K[3] = H, K[4] = J;
    else J = K[4];
    let X = J,
        M;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) M = _n(), K[5] = M;
    else M = K[5];
    let P = M,
        W;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) W = {
        context: "Confirmation"
    }, K[6] = W;
    else W = K[6];
    G1("confirm:no", z, W);
    let D;
    if (K[7] !== A || K[8] !== _ || K[9] !== Y) D = () => {
        Y(A ?? _)
    }, K[7] = A, K[8] = _, K[9] = Y, K[10] = D;
    else D = K[10];
    let Z = D,
        G;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) G = {
        context: "Confirmation"
    }, K[11] = G;
    else G = K[11];
    if (G1("confirm:yes", Z, G), j) {
        let S;
        if (K[12] === Symbol.for("react.memo_cache_sentinel")) S = QT.default.createElement(Q$, {
            message: "Loading session…"
        }), K[12] = S;
        else S = K[12];
        let F;
        if (K[13] === Symbol.for("react.memo_cache_sentinel")) F = QT.default.createElement(u, {
            flexDirection: "column",
            padding: 1
        }, S, QT.default.createElement(T, {
            dimColor: !0
        }, QT.default.createElement(z1, null, QT.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })))), K[13] = F;
        else F = K[13];
        return F
    }
    let f;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) f = [], K[14] = f;
    else f = K[14];
    let v, V;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) V = [], v = new Set, K[15] = v, K[16] = V;
    else v = K[15], V = K[16];
    let k;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) k = [], K[17] = k;
    else k = K[17];
    let N;
    if (K[18] !== X || K[19] !== H.messages) N = QT.default.createElement(zW6, {
        messages: H.messages,
        tools: P,
        commands: f,
        verbose: !0,
        toolJSX: null,
        toolUseConfirmQueue: V,
        inProgressToolUseIDs: v,
        isMessageSelectorVisible: !1,
        conversationId: X,
        screen: "transcript",
        streamingToolUses: k,
        showAllInTranscript: !0,
        isLoading: !1
    }), K[18] = X, K[19] = H.messages, K[20] = N;
    else N = K[20];
    let R;
    if (K[21] !== H.modified) R = CC(H.modified), K[21] = H.modified, K[22] = R;
    else R = K[22];
    let h = H.gitBranch ? ` · ${H.gitBranch}` : "",
        C;
    if (K[23] !== H.messageCount || K[24] !== R || K[25] !== h) C = QT.default.createElement(T, null, R, " ·", " ", H.messageCount, " messages", h), K[23] = H.messageCount, K[24] = R, K[25] = h, K[26] = C;
    else C = K[26];
    let x;
    if (K[27] === Symbol.for("react.memo_cache_sentinel")) x = QT.default.createElement(T, {
        dimColor: !0
    }, QT.default.createElement(z1, null, QT.default.createElement(A8, {
        chord: "enter",
        action: "resume"
    }), QT.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))), K[27] = x;
    else x = K[27];
    let B;
    if (K[28] !== C) B = QT.default.createElement(u, {
        flexShrink: 0,
        flexDirection: "column",
        borderTopDimColor: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderStyle: "single",
        paddingLeft: 2
    }, C, x), K[28] = C, K[29] = B;
    else B = K[29];
    let m;
    if (K[30] !== N || K[31] !== B) m = QT.default.createElement(u, {
        flexDirection: "column"
    }, N, B), K[30] = N, K[31] = B, K[32] = m;
    else m = K[32];
    return m
}
// @from(Ln 470316, Col 4)
QT
// @from(Ln 470317, Col 4)
mcK = L(() => {
    o6();
    g6();
    C7();
    $0();
    c7();
    g4();
    bK();
    Nq();
    u7();
    Qy();
    p_8();
    QT = K6(P6(), 1)
})
// @from(Ln 470332, Col 0)
function BcK(q) {
    let K = s(48),
        {
            nodes: _,
            onSelect: z,
            onCancel: Y,
            onFocus: A,
            focusNodeId: O,
            visibleOptionCount: w,
            layout: $,
            isDisabled: j,
            hideIndexes: H,
            isNodeExpanded: J,
            onExpand: X,
            onCollapse: M,
            getParentPrefix: P,
            getChildPrefix: W,
            onUpFromFirstItem: D
        } = q,
        Z = $ === void 0 ? "expanded" : $,
        G = j === void 0 ? !1 : j,
        f = H === void 0 ? !1 : H,
        v;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) v = new Set, K[0] = v;
    else v = K[0];
    let [V, k] = Ku6.default.useState(v), N = Ku6.default.useRef(!1), R = Ku6.default.useRef(null), h;
    if (K[1] !== V || K[2] !== J) h = (X6) => {
        if (J) return J(X6);
        return V.has(X6)
    }, K[1] = V, K[2] = J, K[3] = h;
    else h = K[3];
    let C = h,
        x;
    if (K[4] !== C || K[5] !== _) {
        let X6 = function(M6, W6, V6) {
            let f6 = !!M6.children && M6.children.length > 0,
                G6 = C(M6.id);
            if (x.push({
                    node: M6,
                    depth: W6,
                    isExpanded: G6,
                    hasChildren: f6,
                    parentId: V6
                }), f6 && G6 && M6.children)
                for (let k6 of M6.children) X6(k6, W6 + 1, M6.id)
        };
        x = [];
        for (let M6 of _) X6(M6, 0);
        K[4] = C, K[5] = _, K[6] = x
    } else x = K[6];
    let B = x,
        m = WQY,
        S = PQY,
        F = P ?? m,
        U = W ?? S,
        g;
    if (K[7] !== U || K[8] !== F) g = (X6) => {
        let M6 = "";
        if (X6.hasChildren) M6 = F(X6.isExpanded);
        else if (X6.depth > 0) M6 = U(X6.depth);
        return M6 + X6.node.label
    }, K[7] = U, K[8] = F, K[9] = g;
    else g = K[9];
    let c = g,
        n;
    if (K[10] !== c || K[11] !== B) n = B.map((X6) => ({
        label: c(X6),
        description: X6.node.description,
        dimDescription: X6.node.dimDescription ?? !0,
        value: X6.node.id
    })), K[10] = c, K[11] = B, K[12] = n;
    else n = K[12];
    let l = n,
        z6;
    if (K[13] !== B) z6 = new Map, B.forEach((X6) => z6.set(X6.node.id, X6.node)), K[13] = B, K[14] = z6;
    else z6 = K[14];
    let A6 = z6,
        e;
    if (K[15] !== B) e = (X6) => B.find((M6) => M6.node.id === X6), K[15] = B, K[16] = e;
    else e = K[16];
    let i = e,
        O6;
    if (K[17] !== i || K[18] !== M || K[19] !== X) O6 = (X6, M6) => {
        let W6 = i(X6);
        if (!W6 || !W6.hasChildren) return;
        if (M6)
            if (X) X(X6);
            else k((V6) => new Set(V6).add(X6));
        else if (M) M(X6);
        else k((V6) => {
            let f6 = new Set(V6);
            return f6.delete(X6), f6
        })
    }, K[17] = i, K[18] = M, K[19] = X, K[20] = O6;
    else O6 = K[20];
    let J6 = O6,
        $6;
    if (K[21] !== i || K[22] !== O || K[23] !== G || K[24] !== A6 || K[25] !== A || K[26] !== J6) $6 = (X6) => {
        if (!O || G) return;
        let M6 = i(O);
        if (!M6) return;
        if (X6.key === "right" && M6.hasChildren) X6.preventDefault(), J6(O, !0);
        else if (X6.key === "left") {
            if (M6.hasChildren && M6.isExpanded) X6.preventDefault(), J6(O, !1);
            else if (M6.parentId !== void 0) {
                if (X6.preventDefault(), N.current = !0, J6(M6.parentId, !1), A) {
                    let W6 = A6.get(M6.parentId);
                    if (W6) A(W6)
                }
            }
        }
    }, K[21] = i, K[22] = O, K[23] = G, K[24] = A6, K[25] = A, K[26] = J6, K[27] = $6;
    else $6 = K[27];
    let H6 = $6,
        q6;
    if (K[28] !== A6 || K[29] !== z) q6 = (X6) => {
        let M6 = A6.get(X6);
        if (!M6) return;
        z(M6)
    }, K[28] = A6, K[29] = z, K[30] = q6;
    else q6 = K[30];
    let o = q6,
        _6;
    if (K[31] !== A6 || K[32] !== A) _6 = (X6) => {
        if (N.current) {
            N.current = !1;
            return
        }
        if (R.current === X6) return;
        if (R.current = X6, A) {
            let M6 = A6.get(X6);
            if (M6) A(M6)
        }
    }, K[31] = A6, K[32] = A, K[33] = _6;
    else _6 = K[33];
    let r = _6,
        t;
    if (K[34] !== O || K[35] !== o || K[36] !== r || K[37] !== f || K[38] !== G || K[39] !== Z || K[40] !== Y || K[41] !== D || K[42] !== l || K[43] !== w) t = Ku6.default.createElement(A1, {
        options: l,
        onChange: o,
        onFocus: r,
        onCancel: Y,
        defaultFocusValue: O,
        visibleOptionCount: w,
        layout: Z,
        isDisabled: G,
        hideIndexes: f,
        onUpFromFirstItem: D
    }), K[34] = O, K[35] = o, K[36] = r, K[37] = f, K[38] = G, K[39] = Z, K[40] = Y, K[41] = D, K[42] = l, K[43] = w, K[44] = t;
    else t = K[44];
    let Y6;
    if (K[45] !== H6 || K[46] !== t) Y6 = Ku6.default.createElement(u, {
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: H6
    }, t), K[45] = H6, K[46] = t, K[47] = Y6;
    else Y6 = K[47];
    return Y6
}
// @from(Ln 470492, Col 0)
function PQY(q) {
    return "  ▸ "
}
// @from(Ln 470496, Col 0)
function WQY(q) {
    return q ? "▼ " : "▶ "
}
// @from(Ln 470499, Col 4)
Ku6
// @from(Ln 470500, Col 4)
pcK = L(() => {
    o6();
    g6();
    gK();
    Ku6 = K6(P6(), 1)
})
// @from(Ln 470511, Col 0)
function dcK(q, K) {
    let _ = q.replace(/\s+/g, " ").trim();
    return j4(_, K)
}
// @from(Ln 470516, Col 0)
function Y$7({
    before: q,
    match: K,
    after: _
}, z) {
    return Y8.dim(q) + z(K) + Y8.dim(_)
}
// @from(Ln 470524, Col 0)
function VQY(q, K, _) {
    let z = q.toLowerCase().indexOf(K.toLowerCase());
    if (z === -1) return null;
    let Y = z + K.length,
        A = Math.max(0, z - _),
        O = Math.min(q.length, Y + _),
        w = q.slice(A, z),
        $ = q.slice(z, Y),
        j = q.slice(Y, O);
    return {
        before: (A > 0 ? "…" : "") + w.replace(/\s+/g, " ").trimStart(),
        match: $.trim(),
        after: j.replace(/\s+/g, " ").trimEnd() + (O < q.length ? "…" : "")
    }
}
// @from(Ln 470540, Col 0)
function A$7(q, K, _) {
    let {
        isGroupHeader: z = !1,
        isChild: Y = !1,
        forkCount: A = 0
    } = _ || {}, O = z && A > 0 ? DQY : Y ? ZQY : 0, w = z && A > 0 ? ` (+${A} other ${A===1?"session":"sessions"})` : "", $ = q.isSidechain ? " (sidechain)" : "", j = K - O - $.length - w.length;
    return `${dcK(kA6(q),j)}${$}${w}`
}
// @from(Ln 470549, Col 0)
function O$7(q, K) {
    let {
        isChild: _ = !1,
        showProjectPath: z = !1
    } = K || {}, Y = _ ? "    " : "", A = wF6(q), O = z && q.projectPath ? ` · ${q.projectPath}` : "";
    return Y + A + O
}
// @from(Ln 470557, Col 0)
function Er8({
    logs: q,
    maxHeight: K = 1 / 0,
    forceWidth: _,
    onCancel: z,
    onSelect: Y,
    onLogsChanged: A,
    onLoadMore: O,
    initialSearchQuery: w,
    isLoading: $ = !1,
    reloadGeneration: j = 0,
    showAllProjects: H = !1,
    onToggleAllProjects: J,
    onAgenticSearch: X
}) {
    let M = Fd(s1()),
        P = _ === void 0 ? M.columns : _,
        W = $3(z),
        D = K2(),
        Z = K66(),
        G = !1,
        [f] = Zq(),
        v = DD(f),
        V = m7.default.useMemo(() => (C1) => Ba(C1, v.warning), [v.warning]),
        k = !1,
        [N, R] = m7.default.useState(null),
        [h, C] = m7.default.useState(!0),
        [x, B] = m7.default.useState(!1),
        [m, S] = m7.default.useState(!1),
        [F, U] = m7.default.useState(null),
        [g, c] = m7.default.useState(null),
        [n, l] = m7.default.useState([]),
        [z6, A6] = m7.default.useState(!1),
        e = m7.default.useMemo(() => Y7(), []),
        [i, O6] = m7.default.useState(""),
        [J6, $6] = m7.default.useState(0),
        [H6, q6] = m7.default.useState(new Set),
        [o, _6] = m7.default.useState(null),
        [r, t] = m7.default.useState(1),
        [Y6, X6] = m7.default.useState(w ? "search" : "list"),
        [M6, W6] = m7.default.useState(null),
        V6 = m7.default.useRef(null),
        [f6, G6] = m7.default.useState({
            status: "idle"
        }),
        [k6, T6] = m7.default.useState(!1),
        v6 = m7.default.useRef(null),
        {
            query: L6,
            setQuery: y6,
            cursorOffset: c6,
            handleKeyDown: Z8,
            handlePaste: N8
        } = bS({
            isActive: Y6 === "search" && f6.status !== "searching",
            onExit: () => {
                X6("list"), d("tengu_session_search_toggled", {
                    enabled: !1
                })
            },
            onExitUp: () => {
                X6("list"), d("tengu_session_search_toggled", {
                    enabled: !1
                })
            },
            passthroughCtrlKeys: ["n"],
            initialQuery: w || ""
        }),
        R6 = m7.default.useDeferredValue(L6),
        [p6, q8] = m7.default.useState("");
    m7.default.useEffect(() => {
        if (!R6) {
            q8("");
            return
        }
        let C1 = setTimeout(q8, 300, R6);
        return () => clearTimeout(C1)
    }, [R6]);
    let [L8, w8] = m7.default.useState(null), [x8, a6] = m7.default.useState(!1);
    m7.default.useEffect(() => {
        rj().then((W7) => R(W7));
        let C1 = Date.now();
        xf6(e).then((W7) => {
            d("tengu_worktree_detection", {
                duration_ms: Date.now() - C1,
                worktree_count: W7.length,
                success: !0
            }), S(W7.length > 1), l(W7), U(W7[0] ?? null);
            let $4 = W7.filter((t4) => e === t4 || e.startsWith(t4 + gcK));
            $4.sort((t4, x4) => x4.length - t4.length), c($4[0] ?? null), A6(!0)
        }).catch(() => {
            d("tengu_worktree_detection", {
                duration_ms: Date.now() - C1,
                worktree_count: 0,
                success: !1
            }), A6(!0)
        })
    }, [e]);
    let D8 = m7.default.useMemo(() => new Map(q.map((C1) => [C1, NQY(C1)])), [q]),
        Q6 = m7.default.useMemo(() => {
            return null
        }, [q, D8, !1]),
        W8 = m7.default.useMemo(() => {
            let C1 = q;
            if (Z) C1 = q.filter((W7) => {
                let $4 = I8(),
                    t4 = xY(W7);
                if ($4 && t4 === $4) return !0;
                if (W7.customTitle) return !0;
                if (U_8(W7.messages)) return !0;
                if (W7.firstPrompt || W7.customTitle) return !0;
                return !1
            });
            if (!h && N) C1 = C1.filter((W7) => W7.gitBranch === N);
            if (m && !x && !H) {
                let W7 = g ?? e;
                C1 = C1.filter(($4) => {
                    let t4 = $4.projectPath;
                    if (t4 === void 0) return !1;
                    let x4 = null;
                    for (let DK of n)
                        if (t4 === DK || t4.startsWith(DK + gcK)) {
                            if (x4 === null || DK.length > x4.length) x4 = DK
                        } if (x4 === null) return t4 === W7;
                    return x4 === W7
                })
            }
            return C1
        }, [q, Z, h, N, m, x, H, e, g, n]),
        G8 = m7.default.useMemo(() => {
            if (!L6) return W8;
            let C1 = L6.toLowerCase();
            return W8.filter((W7) => {
                let $4 = kA6(W7).toLowerCase(),
                    t4 = (W7.gitBranch || "").toLowerCase(),
                    x4 = (W7.tag || "").toLowerCase(),
                    DK = W7.prNumber ? `pr #${W7.prNumber} ${W7.prRepository||""}`.toLowerCase() : "";
                return $4.includes(C1) || t4.includes(C1) || x4.includes(C1) || DK.includes(C1)
            })
        }, [W8, L6]);
    m7.default.useEffect(() => {}, [R6, p6, !1]), m7.default.useEffect(() => {
        if (w8(null), !R6) a6(!1);
        return
    }, [p6, R6, Q6, !1]);
    let {
        filteredLogs: s6,
        snippets: u6
    } = m7.default.useMemo(() => {
        let C1 = new Map,
            W7 = G8;
        if (L8 && p6 && L8.query === p6) {
            for (let DK of L8.results)
                if (DK.searchableText) {
                    let _q = VQY(DK.searchableText, p6, TQY);
                    if (_q) C1.set(DK.log, _q)
                } let $4 = new Set(W7.map((DK) => DK.messages[0]?.uuid)),
                t4 = new Set(W8),
                x4 = L8.results.map((DK) => DK.log).filter((DK) => !$4.has(DK.messages[0]?.uuid) && t4.has(DK));
            W7 = [...W7, ...x4]
        }
        return {
            filteredLogs: W7,
            snippets: C1
        }
    }, [G8, L8, p6, W8]), h6 = m7.default.useMemo(() => {
        if (f6.status === "results" && f6.results.length > 0) {
            let C1 = new Set(W8);
            return f6.results.filter((W7) => C1.has(W7))
        }
        return s6
    }, [f6, s6, W8]), _8 = Math.max(30, P - 4), R8 = m7.default.useMemo(() => {
        if (!Z) return [];
        let C1 = EQY(h6);
        return Array.from(C1.entries()).map(([W7, $4]) => {
            let t4 = $4[0],
                x4 = h6.indexOf(t4),
                DK = u6.get(t4),
                _q = DK ? Y$7(DK, V) : null;
            if ($4.length === 1) {
                let U3 = O$7(t4, {
                    showProjectPath: H
                });
                return {
                    id: `log:${W7}:0`,
                    value: {
                        log: t4,
                        indexInFiltered: x4
                    },
                    label: A$7(t4, _8),
                    description: _q ? `${U3}
  ${_q}` : U3,
                    dimDescription: !0
                }
            }
            let QY = $4.length - 1,
                vz = $4.slice(1).map((U3, DA) => {
                    let U9 = h6.indexOf(U3),
                        BH = u6.get(U3),
                        gj = BH ? Y$7(BH, V) : null,
                        FA = O$7(U3, {
                            isChild: !0,
                            showProjectPath: H
                        });
                    return {
                        id: `log:${W7}:${DA+1}`,
                        value: {
                            log: U3,
                            indexInFiltered: U9
                        },
                        label: A$7(U3, _8, {
                            isChild: !0
                        }),
                        description: gj ? `${FA}
      ${gj}` : FA,
                        dimDescription: !0
                    }
                }),
                JY = O$7(t4, {
                    showProjectPath: H
                });
            return {
                id: `group:${W7}`,
                value: {
                    log: t4,
                    indexInFiltered: x4
                },
                label: A$7(t4, _8, {
                    isGroupHeader: !0,
                    forkCount: QY
                }),
                description: _q ? `${JY}
  ${_q}` : JY,
                dimDescription: !0,
                children: vz
            }
        })
    }, [Z, h6, _8, H, u6, V]), x6 = m7.default.useMemo(() => {
        if (Z) return [];
        return h6.map((C1, W7) => {
            let t4 = kA6(C1) + (C1.isSidechain ? " (sidechain)" : ""),
                x4 = dcK(t4, _8),
                DK = wF6(C1),
                _q = H && C1.projectPath ? ` · ${C1.projectPath}` : "",
                QY = u6.get(C1),
                vz = QY ? Y$7(QY, V) : null;
            return {
                label: x4,
                description: vz ? `${DK}${_q}
  ${vz}` : DK + _q,
                dimDescription: !0,
                value: W7.toString()
            }
        })
    }, [Z, h6, V, _8, H, u6]), i6 = o?.value.log ?? null, v8 = () => {
        if (!Z || !i6) return "";
        let C1 = xY(i6);
        if (!C1) return "";
        let W7 = h6.filter((DK) => xY(DK) === C1);
        if (!(W7.length > 1)) return "";
        let t4 = H6.has(C1);
        if (W7.indexOf(i6) > 0 || t4) return m7.default.createElement(A8, {
            chord: "left",
            action: "collapse"
        });
        return m7.default.createElement(A8, {
            chord: "right",
            action: "expand"
        })
    }, f1 = m7.default.useCallback(async () => {
        let C1 = i6 ? xY(i6) : void 0;
        if (!i6 || !C1) {
            X6("list"), O6("");
            return
        }
        if (i.trim()) {
            if (await AN(C1, i.trim(), i6.fullPath), Z && A) A()
        }
        X6("list"), O6("")
    }, [i6, i, A, Z]), g8 = m7.default.useCallback(() => {
        X6("list"), y6(""), d("tengu_session_search_toggled", {
            enabled: !1
        })
    }, [y6]), w6 = m7.default.useCallback(() => {
        X6("search"), d("tengu_session_search_toggled", {
            enabled: !0
        })
    }, []), D6 = m7.default.useCallback(async () => {
        L6.trim();
        return
    }, [L6, X, !1, W8]);
    m7.default.useEffect(() => {
        if (j === 0) return;
        v6.current?.abort(), G6((C1) => C1.status === "idle" ? C1 : {
            status: "idle"
        }), T6(!1), w8(null)
    }, [j]), m7.default.useEffect(() => {
        if (f6.status !== "idle" && f6.status !== "searching") {
            if (f6.status === "results" && f6.query !== L6 || f6.status === "error") G6({
                status: "idle"
            })
        }
    }, [L6, f6]), m7.default.useEffect(() => {
        return () => {
            v6.current?.abort()
        }
    }, []);
    let U6 = m7.default.useRef(f6.status);
    m7.default.useEffect(() => {
        let C1 = U6.current;
        if (U6.current = f6.status, C1 === "searching" && f6.status === "results") {
            if (Z && R8.length > 0) _6(R8[0]);
            else if (!Z && h6.length > 0) {
                let W7 = h6[0];
                _6({
                    id: "0",
                    value: {
                        log: W7,
                        indexInFiltered: 0
                    },
                    label: ""
                })
            }
        }
    }, [f6.status, Z, R8, h6]);
    let F6 = m7.default.useCallback((C1) => {
            let W7 = parseInt(C1, 10),
                $4 = h6[W7];
            if (!$4 || V6.current === W7.toString()) return;
            V6.current = W7.toString(), _6({
                id: W7.toString(),
                value: {
                    log: $4,
                    indexInFiltered: W7
                },
                label: ""
            }), t(W7 + 1)
        }, [h6]),
        z8 = m7.default.useCallback((C1) => {
            _6(C1);
            let W7 = h6.findIndex(($4) => xY($4) === xY(C1.value.log));
            if (W7 >= 0) t(W7 + 1)
        }, [h6]);
    G1("confirm:no", () => {
        v6.current?.abort(), G6({
            status: "idle"
        }), d("tengu_agentic_search_cancelled", {})
    }, {
        context: "Confirmation",
        isActive: Y6 !== "preview" && f6.status === "searching"
    }), G1("confirm:no", () => {
        X6("list"), O6("")
    }, {
        context: "Settings",
        isActive: Y6 === "rename" && f6.status !== "searching"
    }), G1("confirm:no", () => {
        y6(""), T6(!1), z?.()
    }, {
        context: "Confirmation",
        isActive: Y6 !== "preview" && Y6 !== "rename" && Y6 !== "search" && k6 && f6.status !== "searching"
    });

    function l6(C1) {
        if (Y6 === "preview") return;
        if (f6.status === "searching") return;
        if (Y6 === "rename");
        else if (Y6 === "search") {
            if (Z8(C1), C1.ctrl && C1.key === "n") C1.preventDefault(), g8();
            else if (C1.key === "return" || C1.key === "down") L6.trim()
        } else {
            if (k6) {
                if (C1.key === "return") {
                    C1.preventDefault(), D6(), T6(!1);
                    return
                } else if (C1.key === "down") {
                    if (C1.preventDefault(), T6(!1), h6.length === 0) X6("search");
                    return
                } else if (C1.key === "up") {
                    C1.preventDefault(), X6("search"), T6(!1);
                    return
                }
            }
            if (h6.length === 0 && !k6 && (C1.key === "up" || C1.key === "down" || C1.key === "return")) {
                C1.preventDefault(), X6("search");
                return
            }
            let W7 = !C1.ctrl && !C1.meta,
                $4 = C1.key.toLowerCase();
            if (C1.ctrl && C1.key === "a" && J) C1.preventDefault(), J(), d("tengu_session_all_projects_toggled", {
                enabled: H
            });
            else if (C1.ctrl && C1.key === "b") {
                C1.preventDefault();
                let t4 = !h;
                C(t4), d("tengu_session_branch_filter_toggled", {
                    enabled: !t4
                })
            } else if (C1.ctrl && C1.key === "w" && m) {
                C1.preventDefault();
                let t4 = !x;
                B(t4), d("tengu_session_worktree_filter_toggled", {
                    enabled: !t4
                })
            } else if ($4 === "/" && W7) C1.preventDefault(), X6("search"), T6(!1), d("tengu_session_search_toggled", {
                enabled: !0
            });
            else if (C1.ctrl && C1.key === "r" && i6) C1.preventDefault(), X6("rename"), O6(""), d("tengu_session_rename_started", {});
            else if ((C1.key === " " && W7 || C1.ctrl && C1.key === "v") && i6 && !k6) C1.preventDefault(), W6(i6), X6("preview"), d("tengu_session_preview_opened", {
                messageCount: i6.messageCount
            });
            else if (W7 && C1.key.length === 1 && C1.key !== " ") C1.preventDefault(), X6("search"), T6(!1), y6(C1.key), d("tengu_session_search_toggled", {
                enabled: !0
            })
        }
    }

    function j8(C1) {
        if (Y6 === "search") {
            N8(C1);
            return
        }
        let W7 = (C1.text.split(/\r\n|\r|\n/, 2)[0] ?? "").trim();
        if (Y6 === "preview" || Y6 === "rename" || f6.status === "searching" || k6 || !i6 || !W7) return;
        C1.preventDefault(), X6("search"), y6(W7), d("tengu_session_search_toggled", {
            enabled: !0
        })
    }
    let f8 = [],
        p8 = !!J && !H && z6,
        o8 = F ?? e;
    if (p8) f8.push(FcK(o8));
    if (!h && N) f8.push(N);
    if (m && !x && !H) {
        let C1 = g ?? e;
        if (!(p8 && o8 === C1)) f8.push(FcK(C1))
    }
    let n1 = !!J && !H && !z6,
        c1 = (f8.length > 0 || n1) && Y6 !== "search",
        uq = 8 + (c1 ? 1 : 0),
        h4 = 2,
        cq = Math.max(1, Math.floor((K - uq - h4) / 3));
    if (m7.default.useEffect(() => {
            if (!O) return;
            let C1 = cq * 2;
            if (r + C1 >= h6.length) O(cq * 3)
        }, [r, cq, h6.length, O]), q.length === 0) return null;
    if (Y6 === "preview" && M6 && Z) return m7.default.createElement(ucK, {
        log: M6,
        onExit: () => {
            X6("list"), W6(null)
        },
        onSelect: Y
    });
    return m7.default.createElement(u, {
        flexDirection: "column",
        height: K - 1,
        onKeyDown: l6,
        onPaste: j8
    }, m7.default.createElement(u, {
        flexShrink: 0
    }, m7.default.createElement(zA, {
        color: "suggestion",
        width: P
    })), m7.default.createElement(u, {
        flexShrink: 0
    }, m7.default.createElement(T, null, " ")), m7.default.createElement(u, {
        flexShrink: 0
    }, m7.default.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, "Resume Session", Y6 === "list" && h6.length > cq && m7.default.createElement(T, {
        dimColor: !0
    }, " ", "(", r, " of ", h6.length, ")"), $ && m7.default.createElement(T, {
        dimColor: !0
    }, " · Refreshing…"))), m7.default.createElement(wg, {
        query: L6,
        isFocused: Y6 === "search",
        isTerminalFocused: D,
        cursorOffset: c6
    }), c1 && (f8.length > 0 ? m7.default.createElement(u, {
        flexShrink: 0,
        paddingLeft: 2
    }, m7.default.createElement(T, {
        dimColor: !0
    }, m7.default.createElement(z1, null, f8))) : m7.default.createElement(u, {
        flexShrink: 0,
        height: 1
    })), m7.default.createElement(u, {
        flexShrink: 0
    }, m7.default.createElement(T, null, " ")), f6.status === "searching" && m7.default.createElement(u, {
        paddingLeft: 1,
        flexShrink: 0
    }, m7.default.createElement(Y5, null), m7.default.createElement(T, null, " Searching…")), f6.status === "results" && f6.results.length > 0 && m7.default.createElement(u, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, m7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Claude found these results:")), f6.status === "results" && f6.results.length === 0 && s6.length === 0 && m7.default.createElement(u, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, m7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "No matching sessions found.")), f6.status === "error" && s6.length === 0 && m7.default.createElement(u, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, m7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "No matching sessions found.")), Y6 === "search" && Boolean(L6.trim()) && s6.length === 0 && !x8 && !$ && f6.status === "idle" && m7.default.createElement(u, {
        paddingLeft: 1,
        marginBottom: 1,
        flexShrink: 0
    }, m7.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, 'No sessions match "', L6, '".')), Boolean(L6.trim()) && X && !1, f6.status === "searching" ? null : Y6 === "rename" && i6 ? m7.default.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, m7.default.createElement(T, {
        bold: !0
    }, "Rename session:"), m7.default.createElement(u, {
        paddingTop: 1
    }, m7.default.createElement(l4, {
        value: i,
        onChange: O6,
        onSubmit: f1,
        placeholder: kA6(i6, "Enter new session name"),
        columns: P,
        cursorOffset: J6,
        onChangeCursorOffset: $6,
        showCursor: !0
    }))) : Z ? m7.default.createElement(BcK, {
        nodes: R8,
        onSelect: (C1) => {
            Y(C1.value.log)
        },
        onFocus: z8,
        onCancel: z,
        focusNodeId: o?.id,
        visibleOptionCount: cq,
        layout: "expanded",
        isDisabled: Y6 === "search" || k6,
        hideIndexes: !1,
        isNodeExpanded: (C1) => {
            if (Y6 === "search" || !h) return !0;
            let W7 = typeof C1 === "string" && C1.startsWith("group:") ? C1.substring(6) : null;
            return W7 ? H6.has(W7) : !1
        },
        onExpand: (C1) => {
            let W7 = typeof C1 === "string" && C1.startsWith("group:") ? C1.substring(6) : null;
            if (W7) q6(($4) => new Set($4).add(W7)), d("tengu_session_group_expanded", {})
        },
        onCollapse: (C1) => {
            let W7 = typeof C1 === "string" && C1.startsWith("group:") ? C1.substring(6) : null;
            if (W7) q6(($4) => {
                let t4 = new Set($4);
                return t4.delete(W7), t4
            })
        },
        onUpFromFirstItem: w6
    }) : m7.default.createElement(A1, {
        options: x6,
        onChange: (C1) => {
            let W7 = parseInt(C1, 10),
                $4 = h6[W7];
            if ($4) Y($4)
        },
        visibleOptionCount: cq,
        onCancel: z,
        onFocus: F6,
        defaultFocusValue: o?.id.toString(),
        layout: "expanded",
        isDisabled: Y6 === "search" || k6,
        onUpFromFirstItem: w6
    }), m7.default.createElement(u, {
        paddingLeft: 2
    }, W.pending ? m7.default.createElement(T, {
        dimColor: !0
    }, "Press ", W.keyName, " again to exit") : Y6 === "rename" ? m7.default.createElement(T, {
        dimColor: !0
    }, m7.default.createElement(z1, null, m7.default.createElement(A8, {
        chord: "enter",
        action: "save"
    }), m7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : f6.status === "searching" ? m7.default.createElement(T, {
        dimColor: !0
    }, m7.default.createElement(z1, null, m7.default.createElement(T, null, "Searching with Claude…"), m7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : k6 ? m7.default.createElement(T, {
        dimColor: !0
    }, m7.default.createElement(z1, null, m7.default.createElement(A8, {
        chord: "enter",
        action: "search"
    }), m7.default.createElement(A8, {
        chord: "down",
        action: "skip"
    }), m7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))) : Y6 === "search" ? m7.default.createElement(T, {
        dimColor: !0
    }, m7.default.createElement(z1, null, m7.default.createElement(T, null, "Type to Search"), m7.default.createElement(A8, {
        chord: "enter",
        action: "select"
    }), m7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "clear"
    }))) : m7.default.createElement(T, {
        dimColor: !0
    }, m7.default.createElement(z1, null, J && m7.default.createElement(A8, {
        chord: "ctrl+a",
        action: H ? "only show current repo" : "show all projects",
        format: {
            modCase: "title",
            charCase: "upper"
        }
    }), N && m7.default.createElement(A8, {
        chord: "ctrl+b",
        action: h ? "only show current branch" : "show all branches",
        format: {
            modCase: "title",
            charCase: "upper"
        }
    }), m && m7.default.createElement(A8, {
        chord: "ctrl+w",
        action: x ? "only show current worktree" : "show all worktrees",
        format: {
            modCase: "title",
            charCase: "upper"
        }
    }), m7.default.createElement(A8, {
        chord: "space",
        action: "preview"
    }), m7.default.createElement(A8, {
        chord: "ctrl+r",
        action: "rename",
        format: {
            modCase: "title",
            charCase: "upper"
        }
    }), m7.default.createElement(T, null, "Type to search"), m7.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }), v8()))))
}
// @from(Ln 471220, Col 0)
function kQY(q) {
    if (q.type !== "user" && q.type !== "assistant") return "";
    let K = "message" in q ? q.message?.content : void 0;
    if (!K) return "";
    if (typeof K === "string") return K;
    if (Array.isArray(K)) return K.map((_) => {
        if (typeof _ === "string") return _;
        if ("text" in _ && typeof _.text === "string") return _.text;
        return ""
    }).filter(Boolean).join(" ");
    return ""
}
// @from(Ln 471233, Col 0)
function NQY(q) {
    let _ = (q.messages.length <= fQY ? q.messages : [...q.messages.slice(0, UcK), ...q.messages.slice(-UcK)]).map(kQY).filter(Boolean).join(" "),
        Y = `${[q.customTitle,q.summary,q.firstPrompt,q.gitBranch,q.tag,q.prNumber?`PR #${q.prNumber}`:void 0,q.prRepository].filter(Boolean).join(" ")} ${_}`.trim();
    return Y.length > QcK ? Y.slice(0, QcK) : Y
}
// @from(Ln 471239, Col 0)
function EQY(q) {
    let K = new Map;
    for (let _ of q) {
        let z = xY(_);
        if (z) {
            let Y = K.get(z);
            if (Y) Y.push(_);
            else K.set(z, [_])
        }
    }
    return K.forEach((_) => _.sort((z, Y) => new Date(Y.modified).getTime() - new Date(z.modified).getTime())), K
}
// @from(Ln 471251, Col 4)
m7
// @from(Ln 471251, Col 8)
DQY = 2
// @from(Ln 471252, Col 4)
ZQY = 4
// @from(Ln 471253, Col 4)
fQY = 2000
// @from(Ln 471254, Col 4)
UcK = 1000
// @from(Ln 471255, Col 4)
QcK = 50000
// @from(Ln 471256, Col 4)
GQY = 0.3
// @from(Ln 471257, Col 4)
vQY = 60000
// @from(Ln 471258, Col 4)
TQY = 50
// @from(Ln 471259, Col 4)
w$7 = L(() => {
    Y3();
    wr8();
    y8();
    Mk();
    C$();
    R_6();
    I4();
    G$6();
    g6();
    C7();
    C8();
    c7();
    zQ6();
    pK();
    U8();
    g4();
    tB();
    bK();
    gK();
    Nq();
    VR();
    u7();
    EP6();
    mcK();
    Ej();
    NY();
    pcK();
    m7 = K6(P6(), 1)
})
// @from(Ln 471290, Col 0)
function YW6(q) {
    return {
        markTypeInvoked(K) {
            q((_) => _.agentTypesInvokedThisSession.has(K) ? _ : {
                ..._,
                agentTypesInvokedThisSession: new Set(_.agentTypesInvokedThisSession).add(K)
            })
        },
        registerName(K, _) {
            q((z) => {
                if (z.agentNameRegistry.get(K) === _) return z;
                let Y = new Map(z.agentNameRegistry);
                return Y.set(K, _), {
                    ...z,
                    agentNameRegistry: Y
                }
            })
        },
        clearTodos(K) {
            q((_) => {
                if (!(K in _.todos)) return _;
                let {
                    [K]: z, ...Y
                } = _.todos;
                return {
                    ..._,
                    todos: Y
                }
            })
        }
    }
}
// @from(Ln 471322, Col 4)
yr8
// @from(Ln 471323, Col 4)
_u6 = L(() => {
    yr8 = {
        markTypeInvoked() {},
        registerName() {},
        clearTodos() {}
    }
})
// @from(Ln 471330, Col 4)
Lr8
// @from(Ln 471331, Col 4)
$$7 = L(() => {
    Lr8 = {
        add() {},
        addFunction() {
            return ""
        },
        remove() {},
        removeFunction() {},
        clear() {}
    }
})
// @from(Ln 471343, Col 0)
function AW6(q, K) {
    return {
        assign(_) {
            let z = q().teammateColors,
                Y = z.assignments.get(_);
            if (Y) return Y;
            let A = VJ[z.index % VJ.length];
            return K((O) => {
                if (O.teammateColors.assignments.has(_)) return O;
                let w = new Map(O.teammateColors.assignments);
                return w.set(_, A), {
                    ...O,
                    teammateColors: {
                        assignments: w,
                        index: O.teammateColors.index + 1
                    }
                }
            }), A
        },
        get(_) {
            return q().teammateColors.assignments.get(_)
        },
        clear() {
            K((_) => _.teammateColors.assignments.size === 0 && _.teammateColors.index === 0 ? _ : {
                ..._,
                teammateColors: {
                    assignments: new Map,
                    index: 0
                }
            })
        }
    }
}
// @from(Ln 471376, Col 4)
hr8
// @from(Ln 471377, Col 4)
zu6 = L(() => {
    Uf();
    hr8 = {
        assign: () => VJ[0],
        get: () => {
            return
        },
        clear() {}
    }
})
// @from(Ln 471387, Col 4)
Rr8
// @from(Ln 471388, Col 4)
j$7 = L(() => {
    Rr8 = {
        register() {},
        update() {},
        remove() {},
        evictTerminal() {},
        applyOffsetsAndEvict() {},
        get() {
            return
        },
        all() {
            return {}
        }
    }
})
// @from(Ln 471408, Col 0)
function bQY(q) {
    return q.slice(0, RQY).map((K) => {
        let _ = xY(K) ?? "?",
            z = kA6(K),
            Y = [_, z];
        if (K.tag) Y.push(`[tag: ${K.tag}]`);
        if (K.gitBranch) Y.push(`[branch: ${K.gitBranch}]`);
        if (K.projectPath) Y.push(`[path: ${K.projectPath}]`);
        return Y.join(" ")
    }).join(`
`)
}
// @from(Ln 471421, Col 0)
function IQY(q, K, _, z) {
    let Y = W36(),
        A = new Map(z.map((w) => [w, {
            path: w,
            source: "session"
        }])),
        O = {
            ...Y,
            toolPermissionContext: {
                ...Y.toolPermissionContext,
                additionalWorkingDirectories: A
            }
        };
    return {
        options: {
            commands: [],
            debug: !1,
            mainLoopModel: G5(),
            tools: q,
            verbose: !1,
            thinkingConfig: {
                type: "disabled"
            },
            mcpClients: [],
            mcpResources: {},
            isNonInteractiveSession: !0,
            agentDefinitions: {
                activeAgents: [],
                allAgents: []
            }
        },
        abortController: _,
        readFileState: CR(oI),
        getAppState: () => O,
        setAppState: () => {},
        setToolPermissionContext: () => {},
        taskRegistry: Rr8,
        sessionHooksRegistry: Lr8,
        setClassifierApprovals: vx8,
        setReplContext: () => {},
        setWebBrowserSlice: () => {},
        agentLifecycle: yr8,
        teammateColors: hr8,
        messages: K,
        turnStartIndex: 0,
        setInProgressToolUseIDs: () => {},
        addResponseLength: () => {},
        resetResponseLength: () => {},
        getFileHistoryState: () => {
            return
        },
        applyFileHistoryOp: () => {},
        applyAttributionOp: () => {}
    }
}
// @from(Ln 471477, Col 0)
function xQY(q) {
    let K = (_) => ({
        behavior: "deny",
        message: _,
        decisionReason: {
            type: "other",
            reason: "session_search_out_of_scope"
        }
    });
    return async (_, z, ...Y) => {
        let A = await LX(_, z, ...Y);
        if (A.behavior === "ask") return K(A.message);
        if (A.behavior === "allow") {
            let O = _.getPath?.(z),
                w = O && Wq(O);
            if (w && !q.some(($) => w === $ || w.startsWith($ + LQY))) return K(`${w} is outside the session transcript directories`)
        }
        return A
    }
}