
// @from(Ln 199815, Col 0)
function gy8(q) {
    let K = s(24),
        {
            inputState: _,
            children: z,
            terminalFocus: Y,
            invert: A,
            hidePlaceholderText: O,
            ...w
        } = q,
        {
            handleKeyDown: $,
            renderedValue: j,
            cursorLine: H,
            cursorColumn: J
        } = _,
        X = Boolean(w.focus && w.showCursor && Y),
        M;
    if (K[0] !== J || K[1] !== H || K[2] !== X) M = {
        line: H,
        column: J,
        active: X
    }, K[0] = J, K[1] = H, K[2] = X, K[3] = M;
    else M = K[3];
    let P = n46(M),
        W = eE.useRef(null),
        D;
    if (K[4] !== P) D = ($6) => {
        W.current = $6, P($6)
    }, K[4] = P, K[5] = D;
    else D = K[5];
    let Z = D,
        {
            handleKeyDown: G,
            handlePaste: f,
            isPasting: v
        } = E$4({
            onPaste: w.onPaste,
            handleKeyDown: ($6) => {
                if (w.onKeyDownBefore?.($6), $6.defaultPrevented || $6.didStopImmediatePropagation()) return;
                $($6)
            },
            onImagePaste: w.onImagePaste
        }),
        {
            onIsPastingChange: V
        } = w;
    eE.default.useEffect(() => {
        if (V) V(v)
    }, [v, V]);
    let k = w.focus !== !1,
        N, R;
    if (K[6] !== k) N = () => {
        if (!k || !W.current) return;
        let $6 = cE(W.current);
        return $6.focus(W.current), $6.subscribe(() => {
            let H6 = W.current;
            if (!H6 || $6.activeElement === H6) return;
            if (!$6.activeElement) {
                $6.focus(H6);
                return
            }
            let q6 = H6.parentNode;
            while (q6) {
                if (q6 === $6.activeElement) {
                    $6.focus(H6);
                    return
                }
                q6 = q6.parentNode
            }
        })
    }, R = [k], K[6] = k, K[7] = N, K[8] = R;
    else N = K[7], R = K[8];
    eE.useEffect(N, R);
    let {
        showPlaceholder: h,
        renderedPlaceholder: C
    } = T$4({
        placeholder: w.placeholder,
        value: w.value,
        showCursor: w.showCursor,
        focus: w.focus,
        terminalFocus: Y,
        invert: A,
        hidePlaceholderText: O
    }), x;
    if (K[9] !== G || K[10] !== f || K[11] !== k) x = k ? {
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: G,
        onPaste: f
    } : {}, K[9] = G, K[10] = f, K[11] = k, K[12] = x;
    else x = K[12];
    let B = x,
        m = w.value && w.value.trim().indexOf(" ") === -1 || w.value && w.value.endsWith(" "),
        S = Boolean(w.argumentHint && w.value && m && w.value.startsWith("/")),
        F = w.showCursor && w.highlights ? w.highlights.filter(($6) => $6.dimColor || w.cursorOffset < $6.start || w.cursorOffset >= $6.end) : w.highlights,
        {
            viewportCharOffset: U,
            viewportCharEnd: g
        } = _,
        c = F && U > 0 ? F.filter(($6) => $6.end > U && $6.start < g).map(($6) => ({
            ...$6,
            start: Math.max(0, $6.start - U),
            end: $6.end - U
        })) : F;
    if (c && c.length > 0) return eE.default.createElement(u, {
        ref: Z,
        ...B
    }, eE.default.createElement(C$4, {
        text: j,
        highlights: c
    }), S && eE.default.createElement(T, {
        dimColor: !0
    }, w.value?.endsWith(" ") ? "" : " ", w.argumentHint), z);
    let l = u,
        z6 = T,
        A6 = "truncate-end",
        e = h && w.placeholderElement ? w.placeholderElement : h && C ? eE.default.createElement(v5, null, C) : eE.default.createElement(v5, null, j),
        i = S && eE.default.createElement(T, {
            dimColor: !0
        }, w.value?.endsWith(" ") ? "" : " ", w.argumentHint),
        O6;
    if (K[13] !== z6 || K[14] !== z || K[15] !== w || K[16] !== e || K[17] !== i) O6 = eE.default.createElement(z6, {
        wrap: A6,
        dimColor: w.dimColor
    }, e, i, z), K[13] = z6, K[14] = z, K[15] = w, K[16] = e, K[17] = i, K[18] = O6;
    else O6 = K[18];
    let J6;
    if (K[19] !== l || K[20] !== B || K[21] !== Z || K[22] !== O6) J6 = eE.default.createElement(l, {
        ref: Z,
        ...B
    }, O6), K[19] = l, K[20] = B, K[21] = Z, K[22] = O6, K[23] = J6;
    else J6 = K[23];
    return J6
}
// @from(Ln 199951, Col 4)
eE
// @from(Ln 199952, Col 4)
ZB1 = L(() => {
    o6();
    V$4();
    y$4();
    lB();
    bs6();
    g6();
    b$4();
    eE = K6(P6(), 1)
})
// @from(Ln 199963, Col 0)
function $p(q, K, _) {
    return {
        r: Math.round(q.r + (K.r - q.r) * _),
        g: Math.round(q.g + (K.g - q.g) * _),
        b: Math.round(q.b + (K.b - q.b) * _)
    }
}
// @from(Ln 199971, Col 0)
function fR(q) {
    return `rgb(${q.r},${q.g},${q.b})`
}
// @from(Ln 199975, Col 0)
function Uy8(q) {
    let K = (q % 360 + 360) % 360,
        _ = 0.7,
        z = 0.6,
        Y = (1 - Math.abs(0.19999999999999996)) * 0.7,
        A = Y * (1 - Math.abs(K / 60 % 2 - 1)),
        O = 0.6 - Y / 2,
        w = 0,
        $ = 0,
        j = 0;
    if (K < 60) w = Y, $ = A;
    else if (K < 120) w = A, $ = Y;
    else if (K < 180) $ = Y, j = A;
    else if (K < 240) $ = A, j = Y;
    else if (K < 300) w = A, j = Y;
    else w = Y, j = A;
    return {
        r: Math.round((w + O) * 255),
        g: Math.round(($ + O) * 255),
        b: Math.round((j + O) * 255)
    }
}
// @from(Ln 199998, Col 0)
function t$6(q) {
    let K = I$4.get(q);
    if (K !== void 0) return K;
    let _ = q.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/),
        z = _ ? {
            r: parseInt(_[1], 10),
            g: parseInt(_[2], 10),
            b: parseInt(_[3], 10)
        } : null;
    return I$4.set(q, z), z
}
// @from(Ln 200009, Col 4)
bE6
// @from(Ln 200009, Col 9)
I$4
// @from(Ln 200010, Col 4)
Bd = L(() => {
    U4();
    bE6 = P1(() => {
        if (process.env.TERM === "xterm-ghostty") return ["·", "✢", "✳", "✶", "✻", "*"];
        return process.platform === "darwin" ? ["·", "✢", "✳", "✶", "✻", "✽"] : ["·", "✢", "*", "✶", "✻", "✽"]
    }, () => process.env.TERM);
    I$4 = new Map
})
// @from(Ln 200019, Col 0)
function l4(q) {
    let [K] = Zq(), _ = K2(), z = e$6.useMemo(() => S6(process.env.CLAUDE_CODE_ACCESSIBILITY), []), A = iO().prefersReducedMotion ?? !1, w = oE((D) => D.voiceState) === "recording", $ = oE((D) => D.voiceAudioLevels), j = e$6.useRef(Array(fd_).fill(0)), H = w && !A, [J, X] = _O(H ? 50 : null);
    Ny8(_, !!q.onImagePaste);
    let M = _ && !z,
        P;
    if (!M) P = (D) => D;
    else if (w && !A) {
        let D = j.current,
            Z = $.length > 0 ? $.at(-1) ?? 0 : 0,
            G = Math.min(Z * Gd_, 1);
        D[0] = (D[0] ?? 0) * u$4 + G * (1 - u$4);
        let f = D[0] ?? 0,
            v = Math.max(1, Math.min(Math.round(f * (fB1.length - 1)), fB1.length - 1)),
            V = Z < vd_,
            k = X / 1000 * 90 % 360,
            {
                r: N,
                g: R,
                b: h
            } = V ? {
                r: 128,
                g: 128,
                b: 128
            } : Uy8(k);
        P = () => Y8.rgb(N, R, h)(fB1[v])
    } else P = Y8.inverse;
    let W = Fy8({
        value: q.value,
        onChange: q.onChange,
        onSubmit: q.onSubmit,
        onExit: q.onExit,
        onExitMessage: q.onExitMessage,
        onLeftArrowOnEmpty: q.onLeftArrowOnEmpty,
        onHistoryReset: q.onHistoryReset,
        onHistoryUp: q.onHistoryUp,
        onHistoryDown: q.onHistoryDown,
        onClearInput: q.onClearInput,
        focus: q.focus,
        mask: q.mask,
        multiline: q.multiline,
        cursorChar: q.showCursor ? " " : "",
        highlightPastedText: q.highlightPastedText,
        invert: P,
        themeText: d7("text", K),
        columns: q.columns,
        maxVisibleLines: q.maxVisibleLines,
        onImagePaste: q.onImagePaste,
        disableCursorMovementForUpDownKeys: q.disableCursorMovementForUpDownKeys,
        disableEscapeDoublePress: q.disableEscapeDoublePress,
        externalOffset: q.cursorOffset,
        onOffsetChange: q.onChangeCursorOffset,
        inputFilter: q.inputFilter,
        inlineGhostText: q.inlineGhostText,
        dim: Y8.dim
    });
    return e$6.default.createElement(u, {
        ref: J
    }, e$6.default.createElement(gy8, {
        inputState: W,
        terminalFocus: _,
        highlights: q.highlights,
        invert: P,
        hidePlaceholderText: w,
        ...q
    }))
}
// @from(Ln 200085, Col 4)
e$6
// @from(Ln 200085, Col 9)
fB1 = " ▁▂▃▄▅▆▇█"
// @from(Ln 200086, Col 4)
fd_ = 1
// @from(Ln 200087, Col 4)
u$4 = 0.7
// @from(Ln 200088, Col 4)
Gd_ = 1.8
// @from(Ln 200089, Col 4)
vd_ = 0.15
// @from(Ln 200090, Col 4)
NY = L(() => {
    Y3();
    B$6();
    dm1();
    tE();
    PB1();
    g6();
    Q8();
    ZB1();
    Bd();
    e$6 = K6(P6(), 1)
})
// @from(Ln 200103, Col 0)
function Qy8(q) {
    let K = s(24),
        {
            bindings: _,
            pendingChordRef: z,
            pendingChord: Y,
            setPendingChord: A,
            activeContexts: O,
            registerActiveContext: w,
            unregisterActiveContext: $,
            handlerRegistryRef: j,
            children: H
        } = q,
        J;
    if (K[0] !== _) J = (V, k) => tE8(V, k, _), K[0] = _, K[1] = J;
    else J = K[1];
    let X = J,
        M;
    if (K[2] !== j) M = (V) => {
        let k = j.current;
        if (!k) return Td_;
        if (!k.has(V.action)) k.set(V.action, new Set);
        return k.get(V.action).add(V), () => {
            let N = k.get(V.action);
            if (N) {
                if (N.delete(V), N.size === 0) k.delete(V.action)
            }
        }
    }, K[2] = j, K[3] = M;
    else M = K[3];
    let P = M,
        W;
    if (K[4] !== O || K[5] !== j) W = (V) => {
        let k = j.current;
        if (!k) return !1;
        let N = k.get(V);
        if (!N || N.size === 0) return !1;
        for (let R of N)
            if (O.has(R.context)) return R.handler(), !0;
        return !1
    }, K[4] = O, K[5] = j, K[6] = W;
    else W = K[6];
    let D = W,
        Z;
    if (K[7] !== _ || K[8] !== z) Z = (V, k, N) => Zs6(V, k, N, _, z.current), K[7] = _, K[8] = z, K[9] = Z;
    else Z = K[9];
    let G;
    if (K[10] !== O || K[11] !== _ || K[12] !== X || K[13] !== D || K[14] !== Y || K[15] !== w || K[16] !== P || K[17] !== A || K[18] !== Z || K[19] !== $) G = {
        resolve: Z,
        setPendingChord: A,
        getDisplayText: X,
        bindings: _,
        pendingChord: Y,
        activeContexts: O,
        registerActiveContext: w,
        unregisterActiveContext: $,
        registerHandler: P,
        invokeAction: D
    }, K[10] = O, K[11] = _, K[12] = X, K[13] = D, K[14] = Y, K[15] = w, K[16] = P, K[17] = A, K[18] = Z, K[19] = $, K[20] = G;
    else G = K[20];
    let f = G,
        v;
    if (K[21] !== H || K[22] !== f) v = i46.default.createElement(m$4.Provider, {
        value: f
    }, H), K[21] = H, K[22] = f, K[23] = v;
    else v = K[23];
    return v
}
// @from(Ln 200172, Col 0)
function Td_() {}
// @from(Ln 200174, Col 0)
function lv() {
    return i46.useContext(m$4)
}
// @from(Ln 200178, Col 0)
function dy8(q, K) {
    let _ = s(5),
        z = K === void 0 ? !0 : K,
        Y = lv(),
        A, O;
    if (_[0] !== q || _[1] !== z || _[2] !== Y) A = () => {
        if (!Y || !z) return;
        return Y.registerActiveContext(q), () => {
            Y.unregisterActiveContext(q)
        }
    }, O = [q, Y, z], _[0] = q, _[1] = z, _[2] = Y, _[3] = A, _[4] = O;
    else A = _[3], O = _[4];
    i46.useLayoutEffect(A, O)
}
// @from(Ln 200192, Col 4)
i46
// @from(Ln 200192, Col 9)
m$4
// @from(Ln 200193, Col 4)
jp = L(() => {
    o6();
    fs6();
    i46 = K6(P6(), 1), m$4 = i46.createContext(null)
})
// @from(Ln 200199, Col 0)
function G1(q, K, _ = {}) {
    let {
        context: z = "Global",
        isActive: Y = !0
    } = _, A = lv();
    IE6.useEffect(() => {
        if (!A || !Y) return;
        return A.registerHandler({
            action: q,
            context: z,
            handler: K,
            singleKey: !0
        })
    }, [q, z, K, A, Y]);
    let O = IE6.useCallback((w, $, j) => {
        if (!A) return;
        let H = [...A.activeContexts, z, "Global"],
            J = F4(H),
            X = A.resolve(w, $, J);
        switch (X.type) {
            case "match":
                if (A.setPendingChord(null), X.action === q) {
                    if (K() !== !1) j.stopImmediatePropagation()
                }
                break;
            case "chord_started":
                A.setPendingChord(X.pending), j.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                A.setPendingChord(null);
                break;
            case "unbound":
                A.setPendingChord(null);
                break;
            case "none":
                break
        }
    }, [q, z, K, A]);
    XR(O, {
        isActive: Y
    })
}
// @from(Ln 200242, Col 0)
function L7(q, K = {}) {
    let {
        context: _ = "Global",
        isActive: z = !0
    } = K, Y = lv();
    IE6.useEffect(() => {
        if (!Y || !z) return;
        let O = [];
        for (let [w, $] of Object.entries(q)) O.push(Y.registerHandler({
            action: w,
            context: _,
            handler: $,
            singleKey: !0
        }));
        return () => {
            for (let w of O) w()
        }
    }, [_, q, Y, z]);
    let A = IE6.useCallback((O, w, $) => {
        if (!Y) return;
        let j = [...Y.activeContexts, _, "Global"],
            H = F4(j),
            J = Y.resolve(O, w, H);
        switch (J.type) {
            case "match":
                if (Y.setPendingChord(null), J.action in q) {
                    let X = q[J.action];
                    if (X && X() !== !1) $.stopImmediatePropagation()
                }
                break;
            case "chord_started":
                Y.setPendingChord(J.pending), $.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                Y.setPendingChord(null);
                break;
            case "unbound":
                Y.setPendingChord(null);
                break;
            case "none":
                break
        }
    }, [_, q, Y]);
    XR(A, {
        isActive: z
    })
}
// @from(Ln 200289, Col 4)
IE6
// @from(Ln 200290, Col 4)
C7 = L(() => {
    g6();
    jp();
    IE6 = K6(P6(), 1)
})
// @from(Ln 200302, Col 0)
function Q$4(q, K) {
    if (!q) return {
        directory: K || b8(),
        prefix: ""
    };
    let _ = Wq(q, K);
    if (q.endsWith("/") || q.endsWith(cy8)) return {
        directory: _,
        prefix: ""
    };
    let z = Nd_(_),
        Y = kd_(q);
    return {
        directory: z,
        prefix: Y
    }
}
// @from(Ln 200319, Col 0)
async function Ed_(q) {
    let K = B$4.get(q);
    if (K) return K;
    try {
        let Y = (await V8().readdir(q)).filter((A) => A.isDirectory() && !A.name.startsWith(".")).map((A) => ({
            name: A.name,
            path: F$4(q, A.name),
            type: "directory"
        })).slice(0, 100);
        return B$4.set(q, Y), Y
    } catch (_) {
        return j6(_), []
    }
}
// @from(Ln 200333, Col 0)
async function ly8(q, K = {}) {
    let {
        basePath: _ = b8(),
        maxResults: z = 10
    } = K, {
        directory: Y,
        prefix: A
    } = Q$4(q, _), O = await Ed_(Y), w = A.toLowerCase();
    return O.filter((j) => j.name.toLowerCase().startsWith(w)).slice(0, z).map((j) => ({
        id: j.path,
        displayText: j.name + "/",
        description: "directory",
        metadata: {
            type: "directory"
        }
    }))
}
// @from(Ln 200351, Col 0)
function d$4(q) {
    return q.startsWith("~/") || q.startsWith("/") || q.startsWith("./") || q.startsWith("../") || q === "~" || q === "." || q === ".."
}
// @from(Ln 200354, Col 0)
async function yd_(q, K = !1) {
    let _ = `${q}:${K}`,
        z = p$4.get(_);
    if (z) return z;
    try {
        let O = (await V8().readdir(q)).filter((w) => K || !w.name.startsWith(".")).map((w) => ({
            name: w.name,
            path: F$4(q, w.name),
            type: w.isDirectory() ? "directory" : "file"
        })).sort((w, $) => {
            if (w.type === "directory" && $.type !== "directory") return -1;
            if (w.type !== "directory" && $.type === "directory") return 1;
            return w.name.localeCompare($.name)
        }).slice(0, 100);
        return p$4.set(_, O), O
    } catch (Y) {
        return j6(Y), []
    }
}
// @from(Ln 200373, Col 0)
async function c$4(q, K = {}) {
    let {
        basePath: _ = b8(),
        maxResults: z = 10,
        includeFiles: Y = !0,
        includeHidden: A = !1
    } = K, {
        directory: O,
        prefix: w
    } = Q$4(q, _), $ = await yd_(O, A), j = w.toLowerCase(), H = $.filter((M) => {
        if (!Y && M.type === "file") return !1;
        return M.name.toLowerCase().startsWith(j)
    }).slice(0, z), J = q.includes("/") || q.includes(cy8), X = "";
    if (J) {
        let M = q.lastIndexOf("/"),
            P = q.lastIndexOf(cy8),
            W = Math.max(M, P);
        X = q.substring(0, W + 1)
    }
    if (X.startsWith("./") || X.startsWith("." + cy8)) X = X.slice(2);
    return H.map((M) => {
        let P = X + M.name;
        return {
            id: P,
            displayText: M.type === "directory" ? P + "/" : P,
            metadata: {
                type: M.type
            }
        }
    })
}
// @from(Ln 200404, Col 4)
g$4 = 500
// @from(Ln 200405, Col 4)
U$4 = 300000
// @from(Ln 200406, Col 4)
B$4
// @from(Ln 200406, Col 9)
p$4
// @from(Ln 200407, Col 4)
GB1 = L(() => {
    If6();
    n7();
    Yq();
    U8();
    b9();
    B$4 = new iN({
        max: g$4,
        ttl: U$4
    }), p$4 = new iN({
        max: g$4,
        ttl: U$4
    })
})
// @from(Ln 200422, Col 0)
function GR(q, K, _) {
    let z = lv(),
        Y = z?.bindings.findLast(($) => $.action === q && $.context === K)?.chord,
        A = Y === void 0,
        O = z ? "action_not_found" : "no_context",
        w = ny8.useRef(!1);
    return ny8.useEffect(() => {
        if (A && !w.current) w.current = !0, d("tengu_keybinding_fallback_used", {
            action: q,
            context: K,
            fallback: _,
            reason: O
        })
    }, [A, q, K, _, O]), Y ? g$6(Y) : _
}
// @from(Ln 200437, Col 4)
ny8
// @from(Ln 200438, Col 4)
iy8 = L(() => {
    C8();
    jp();
    ny8 = K6(P6(), 1)
})
// @from(Ln 200444, Col 0)
function hd_(q) {
    let {
        style: K,
        ..._
    } = q;
    return {
        ...Ld_[K ?? "default"],
        ...Rd_(_)
    }
}
// @from(Ln 200455, Col 0)
function Rd_(q) {
    let K = {};
    for (let _ in q)
        if (q[_] !== void 0) K[_] = q[_];
    return K
}
// @from(Ln 200462, Col 0)
function l$4(q, K = {}) {
    let _ = hd_(K),
        z = (j) => md_(j, _),
        Y = (j) => j.map(z).join(_.chordSep);
    if (q.length === 0) return "";
    if (q.length === 1) return Y(q[0]);
    let A = q.every((j) => j.length === 1) ? q.map((j) => j[0]) : void 0;
    if (!A) return q.map(Y).join("/");
    let O = Bd_(A, _),
        $ = A.every((j) => Id_.has(j.key)) && (!!O || A.every((j) => oy8(j, _).length === 0)) ? _.arrowSep : "/";
    if (O) {
        let j = A.map((H) => z({
            ...H,
            ...xd_
        }));
        return Fd_(O, _) + j.join($)
    }
    return A.map(z).join($)
}
// @from(Ln 200482, Col 0)
function vB1(q) {
    let K = [];
    if (q.ctrl) K.push("ctrl");
    if (q.shift) K.push("shift");
    if (q.alt || q.meta) K.push("alt");
    if (q.super) K.push("super");
    return K
}
// @from(Ln 200491, Col 0)
function ry8(q, K) {
    let _ = bd_[q][K.modCase];
    return typeof _ === "function" ? _(K.platform) : _
}
// @from(Ln 200496, Col 0)
function ud_(q, K) {
    let _ = Sd_[q];
    if (_) return _[Cd_[K.keyCase]];
    return K.charCase === "upper" ? q.toUpperCase() : q
}
// @from(Ln 200502, Col 0)
function n$4(q) {
    return q.shift && !q.ctrl && !q.alt && !q.meta && !q.super && q.key.length === 1 && q.key >= "a" && q.key <= "z"
}
// @from(Ln 200506, Col 0)
function md_(q, K) {
    if (K.shiftAsCase && n$4(q)) return q.key.toUpperCase();
    let _ = vB1(q),
        z = ud_(q.key, K);
    if (K.caretCtrl && _.length === 1 && _[0] === "ctrl") return `^${z}`;
    if (K.modCase === "glyph") return _.map((Y) => ry8(Y, K)).join("") + z;
    return [..._.map((Y) => ry8(Y, K)), z].join(K.modSep)
}
// @from(Ln 200515, Col 0)
function Bd_(q, K) {
    let [_, ...z] = q;
    if (!oy8(_, K).length) return;
    return z.every((A) => pd_(_, A, K)) ? _ : void 0
}
// @from(Ln 200521, Col 0)
function oy8(q, K) {
    if (K.shiftAsCase && n$4(q)) return [];
    return vB1(q)
}
// @from(Ln 200526, Col 0)
function pd_(q, K, _) {
    let z = oy8(q, _),
        Y = oy8(K, _);
    return z.length === Y.length && z.every((A, O) => A === Y[O])
}
// @from(Ln 200532, Col 0)
function Fd_(q, K) {
    let _ = vB1(q);
    if (K.caretCtrl && _.length === 1 && _[0] === "ctrl") return "^";
    if (K.modCase === "glyph") return _.map((z) => ry8(z, K)).join("");
    return _.map((z) => ry8(z, K)).join(K.modSep) + K.modSep
}
// @from(Ln 200538, Col 4)
Ld_
// @from(Ln 200538, Col 9)
Sd_
// @from(Ln 200538, Col 14)
Cd_
// @from(Ln 200538, Col 19)
bd_
// @from(Ln 200538, Col 24)
Id_
// @from(Ln 200538, Col 29)
xd_
// @from(Ln 200539, Col 4)
i$4 = L(() => {
    Ld_ = {
        default: {
            keyCase: "title",
            modCase: "lower",
            caretCtrl: !1,
            modSep: "+",
            arrowSep: "/",
            chordSep: " ",
            shiftAsCase: !1,
            charCase: "preserve",
            platform: "other"
        },
        compact: {
            keyCase: "lower",
            modCase: "lower",
            caretCtrl: !0,
            modSep: "+",
            arrowSep: "",
            chordSep: " ",
            shiftAsCase: !0,
            charCase: "preserve",
            platform: "other"
        },
        symbol: {
            keyCase: "glyph",
            modCase: "glyph",
            caretCtrl: !1,
            modSep: "",
            arrowSep: "",
            chordSep: " ",
            shiftAsCase: !0,
            charCase: "upper",
            platform: "other"
        }
    };
    Sd_ = {
        enter: ["Enter", "enter", "⏎"],
        escape: ["Esc", "esc", "⎋"],
        tab: ["Tab", "tab", "⇥"],
        " ": ["Space", "space", "␣"],
        backspace: ["Backspace", "backspace", "⌫"],
        delete: ["Delete", "delete", "⌦"],
        up: ["↑", "↑", "↑"],
        down: ["↓", "↓", "↓"],
        left: ["←", "←", "←"],
        right: ["→", "→", "→"],
        pageup: ["PageUp", "pgup", "⇞"],
        pagedown: ["PageDown", "pgdn", "⇟"],
        home: ["Home", "home", "↖"],
        end: ["End", "end", "↘"]
    }, Cd_ = {
        title: 0,
        lower: 1,
        glyph: 2
    }, bd_ = {
        ctrl: {
            lower: "ctrl",
            title: "Ctrl",
            glyph: "⌃"
        },
        shift: {
            lower: "shift",
            title: "Shift",
            glyph: "⇧"
        },
        alt: {
            lower: (q) => q === "macos" ? "opt" : "alt",
            title: (q) => q === "macos" ? "Opt" : "Alt",
            glyph: "⌥"
        },
        super: {
            lower: (q) => q === "macos" ? "cmd" : "super",
            title: (q) => q === "macos" ? "Cmd" : "Super",
            glyph: "⌘"
        }
    }, Id_ = new Set(["up", "down", "left", "right"]), xd_ = {
        ctrl: !1,
        alt: !1,
        shift: !1,
        meta: !1,
        super: !1
    }
})
// @from(Ln 200624, Col 0)
function A8(q) {
    let K = s(12),
        {
            chord: _,
            action: z,
            format: Y,
            parens: A,
            bold: O
        } = q,
        w = A === void 0 ? !1 : A,
        $ = O === void 0 ? !1 : O,
        j;
    if (K[0] !== _ || K[1] !== Y) j = l$4((typeof _ === "string" ? [_] : _).map(Ms6), Y), K[0] = _, K[1] = Y, K[2] = j;
    else j = K[2];
    let H = j;
    if (!H) return null;
    let J;
    if (K[3] !== $ || K[4] !== H) J = $ ? ay8.default.createElement(hA, {
        bold: !0
    }, H) : H, K[3] = $, K[4] = H, K[5] = J;
    else J = K[5];
    let X = J;
    if (w) {
        let P;
        if (K[6] !== z || K[7] !== X) P = ay8.default.createElement(hA, null, "(", X, " to ", z, ")"), K[6] = z, K[7] = X, K[8] = P;
        else P = K[8];
        return P
    }
    let M;
    if (K[9] !== z || K[10] !== X) M = ay8.default.createElement(hA, null, X, " to ", z), K[9] = z, K[10] = X, K[11] = M;
    else M = K[11];
    return M
}
// @from(Ln 200657, Col 4)
ay8
// @from(Ln 200658, Col 4)
u7 = L(() => {
    o6();
    I$6();
    i$4();
    ay8 = K6(P6(), 1)
})
// @from(Ln 200665, Col 0)
function v1(q) {
    let K = s(5),
        {
            action: _,
            context: z,
            fallback: Y,
            description: A,
            parens: O,
            bold: w
        } = q,
        $ = GR(_, z, Y),
        j;
    if (K[0] !== w || K[1] !== $ || K[2] !== A || K[3] !== O) j = TB1.createElement(A8, {
        chord: $,
        action: A,
        parens: O,
        bold: w
    }), K[0] = w, K[1] = $, K[2] = A, K[3] = O, K[4] = j;
    else j = K[4];
    return j
}
// @from(Ln 200686, Col 4)
TB1
// @from(Ln 200687, Col 4)
bK = L(() => {
    o6();
    iy8();
    u7();
    TB1 = K6(P6(), 1)
})
// @from(Ln 200694, Col 0)
function qj6(q) {
    if (typeof q === "string") return q;
    if (typeof q === "number") return String(q);
    if (!q) return "";
    if (Array.isArray(q)) return q.map(qj6).join("");
    if (r$4.default.isValidElement(q)) return qj6(q.props.children);
    return ""
}
// @from(Ln 200702, Col 4)
r$4
// @from(Ln 200703, Col 4)
VB1 = L(() => {
    r$4 = K6(P6(), 1)
})
// @from(Ln 200707, Col 0)
function D4(q) {
    let K = s(5),
        {
            status: _,
            withSpace: z
        } = q,
        Y = z === void 0 ? !1 : z,
        A = kB1[_],
        O = !A.color,
        w = Y && " ",
        $;
    if (K[0] !== A.color || K[1] !== A.icon || K[2] !== O || K[3] !== w) $ = o$4.default.createElement(T, {
        color: A.color,
        dimColor: O
    }, A.icon, w), K[0] = A.color, K[1] = A.icon, K[2] = O, K[3] = w, K[4] = $;
    else $ = K[4];
    return $
}
// @from(Ln 200725, Col 4)
o$4
// @from(Ln 200725, Col 9)
kB1
// @from(Ln 200726, Col 4)
Y2 = L(() => {
    o6();
    Qq();
    g6();
    o$4 = K6(P6(), 1), kB1 = {
        success: {
            icon: e6.tick,
            color: "success"
        },
        error: {
            icon: e6.cross,
            color: "error"
        },
        warning: {
            icon: e6.warning,
            color: "warning"
        },
        info: {
            icon: e6.info,
            color: "suggestion"
        },
        pending: {
            icon: e6.circle,
            color: void 0
        },
        loading: {
            icon: "…",
            color: void 0
        }
    }
})
// @from(Ln 200761, Col 0)
function a$4(q) {
    let K = s(15),
        {
            imageId: _,
            backgroundColor: z,
            isSelected: Y
        } = q,
        A = Y === void 0 ? !1 : Y,
        O = Kp((j) => j.storedImagePaths.get(_) ?? null) ?? null,
        w = `[Image #${_}]`;
    if (O && Vf()) {
        let j;
        if (K[0] !== O) j = gd_(O), K[0] = O, K[1] = j;
        else j = K[1];
        let H = j.href,
            J, X;
        if (K[2] !== z || K[3] !== w || K[4] !== A) J = Os.createElement(T, {
            backgroundColor: z,
            inverse: A
        }, w), X = Os.createElement(T, {
            backgroundColor: z,
            inverse: A,
            bold: A
        }, w), K[2] = z, K[3] = w, K[4] = A, K[5] = J, K[6] = X;
        else J = K[5], X = K[6];
        let M;
        if (K[7] !== H || K[8] !== J || K[9] !== X) M = Os.createElement(yq, {
            url: H,
            fallback: J
        }, X), K[7] = H, K[8] = J, K[9] = X, K[10] = M;
        else M = K[10];
        return M
    }
    let $;
    if (K[11] !== z || K[12] !== w || K[13] !== A) $ = Os.createElement(T, {
        backgroundColor: z,
        inverse: A
    }, w), K[11] = z, K[12] = w, K[13] = A, K[14] = $;
    else $ = K[14];
    return $
}
// @from(Ln 200802, Col 4)
Os
// @from(Ln 200803, Col 4)
s$4 = L(() => {
    o6();
    u46();
    vd();
    g6();
    N7();
    Os = K6(P6(), 1)
})
// @from(Ln 200812, Col 0)
function z1(q) {
    let K = s(5),
        {
            children: _
        } = q,
        z, Y;
    if (K[0] !== _) {
        Y = Symbol.for("react.early_return_sentinel");
        q: {
            let O = pd.Children.toArray(_).filter(Qd_);
            if (O.length === 0) {
                Y = null;
                break q
            }
            z = O.map(Ud_)
        }
        K[0] = _, K[1] = z, K[2] = Y
    } else z = K[1], Y = K[2];
    if (Y !== Symbol.for("react.early_return_sentinel")) return Y;
    let A;
    if (K[3] !== z) A = pd.default.createElement(pd.default.Fragment, null, z), K[3] = z, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 200837, Col 0)
function Ud_(q, K) {
    return pd.default.createElement(pd.default.Fragment, {
        key: pd.isValidElement(q) ? q.key ?? K : K
    }, K > 0 && pd.default.createElement(T, {
        dimColor: !0
    }, " · "), q)
}
// @from(Ln 200845, Col 0)
function Qd_(q) {
    return q !== ""
}
// @from(Ln 200848, Col 4)
pd
// @from(Ln 200849, Col 4)
Nq = L(() => {
    o6();
    g6();
    pd = K6(P6(), 1)
})
// @from(Ln 200855, Col 0)
function TR(q) {
    let K = s(30),
        {
            isFocused: _,
            isSelected: z,
            children: Y,
            description: A,
            showScrollDown: O,
            showScrollUp: w,
            styled: $,
            disabled: j,
            declareCursor: H
        } = q,
        J = z === void 0 ? !1 : z,
        X = $ === void 0 ? !0 : $,
        M = j === void 0 ? !1 : j,
        P;
    if (K[0] !== M || K[1] !== _ || K[2] !== J || K[3] !== X) P = function() {
        if (M) return "inactive";
        if (!X) return;
        if (J) return "success";
        if (_) return "suggestion"
    }(), K[0] = M, K[1] = _, K[2] = J, K[3] = X, K[4] = P;
    else P = K[4];
    let W = P,
        D = _ && !M && H !== !1,
        Z;
    if (K[5] !== D) Z = {
        line: 0,
        column: 0,
        active: D
    }, K[5] = D, K[6] = Z;
    else Z = K[6];
    let G = n46(Z),
        f;
    if (K[7] !== M || K[8] !== _ || K[9] !== O || K[10] !== w) f = vR.default.createElement(dd_, {
        disabled: M,
        isFocused: _,
        showScrollUp: w,
        showScrollDown: O
    }), K[7] = M, K[8] = _, K[9] = O, K[10] = w, K[11] = f;
    else f = K[11];
    let v;
    if (K[12] !== Y || K[13] !== M || K[14] !== X || K[15] !== W) v = X ? vR.default.createElement(T, {
        color: W,
        dimColor: M
    }, Y) : Y, K[12] = Y, K[13] = M, K[14] = X, K[15] = W, K[16] = v;
    else v = K[16];
    let V;
    if (K[17] !== M || K[18] !== J) V = J && !M && vR.default.createElement(T, {
        color: "success"
    }, e6.tick), K[17] = M, K[18] = J, K[19] = V;
    else V = K[19];
    let k;
    if (K[20] !== f || K[21] !== v || K[22] !== V) k = vR.default.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, f, v, V), K[20] = f, K[21] = v, K[22] = V, K[23] = k;
    else k = K[23];
    let N;
    if (K[24] !== A) N = A && vR.default.createElement(u, {
        paddingLeft: 2
    }, vR.default.createElement(T, {
        color: "inactive"
    }, A)), K[24] = A, K[25] = N;
    else N = K[25];
    let R;
    if (K[26] !== G || K[27] !== k || K[28] !== N) R = vR.default.createElement(u, {
        ref: G,
        flexDirection: "column"
    }, k, N), K[26] = G, K[27] = k, K[28] = N, K[29] = R;
    else R = K[29];
    return R
}
// @from(Ln 200930, Col 0)
function dd_(q) {
    let K = s(5),
        {
            disabled: _,
            isFocused: z,
            showScrollUp: Y,
            showScrollDown: A
        } = q;
    if (_) {
        let w;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = vR.default.createElement(T, null, " "), K[0] = w;
        else w = K[0];
        return w
    }
    if (z) {
        let w;
        if (K[1] === Symbol.for("react.memo_cache_sentinel")) w = vR.default.createElement(T, {
            color: "suggestion"
        }, e6.pointer), K[1] = w;
        else w = K[1];
        return w
    }
    if (A) {
        let w;
        if (K[2] === Symbol.for("react.memo_cache_sentinel")) w = vR.default.createElement(T, {
            dimColor: !0
        }, e6.arrowDown), K[2] = w;
        else w = K[2];
        return w
    }
    if (Y) {
        let w;
        if (K[3] === Symbol.for("react.memo_cache_sentinel")) w = vR.default.createElement(T, {
            dimColor: !0
        }, e6.arrowUp), K[3] = w;
        else w = K[3];
        return w
    }
    let O;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) O = vR.default.createElement(T, null, " "), K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 200973, Col 4)
vR
// @from(Ln 200974, Col 4)
xE6 = L(() => {
    o6();
    Qq();
    bs6();
    g6();
    vR = K6(P6(), 1)
})
// @from(Ln 200982, Col 0)
function r46(q) {
    let K = s(8),
        {
            isFocused: _,
            isSelected: z,
            children: Y,
            description: A,
            shouldShowDownArrow: O,
            shouldShowUpArrow: w,
            declareCursor: $
        } = q,
        j;
    if (K[0] !== Y || K[1] !== $ || K[2] !== A || K[3] !== _ || K[4] !== z || K[5] !== O || K[6] !== w) j = t$4.default.createElement(TR, {
        isFocused: _,
        isSelected: z,
        description: A,
        showScrollDown: O,
        showScrollUp: w,
        styled: !1,
        declareCursor: $
    }, Y), K[0] = Y, K[1] = $, K[2] = A, K[3] = _, K[4] = z, K[5] = O, K[6] = w, K[7] = j;
    else j = K[7];
    return j
}
// @from(Ln 201006, Col 4)
t$4
// @from(Ln 201007, Col 4)
sy8 = L(() => {
    o6();
    xE6();
    t$4 = K6(P6(), 1)
})
// @from(Ln 201013, Col 0)
function uE6(q) {
    let K = s(96),
        {
            option: _,
            isFocused: z,
            isSelected: Y,
            shouldShowDownArrow: A,
            shouldShowUpArrow: O,
            maxIndexWidth: w,
            index: $,
            inputValue: j,
            onInputChange: H,
            onSubmit: J,
            onExit: X,
            layout: M,
            children: P,
            showLabel: W,
            onOpenEditor: D,
            resetCursorOnUpdate: Z,
            onImagePaste: G,
            pastedContents: f,
            onRemoveImage: v,
            imagesSelected: V,
            selectedImageIndex: k,
            onImagesSelectedChange: N,
            onSelectedImageIndexChange: R
        } = q,
        h = W === void 0 ? !1 : W,
        C = Z === void 0 ? !1 : Z,
        x = k === void 0 ? 0 : k,
        B;
    if (K[0] !== f) B = f ? Object.values(f).filter(cd_) : [], K[0] = f, K[1] = B;
    else B = K[1];
    let m = B,
        S = h || _.showLabelWithValue === !0,
        [F, U] = bz.useState(j.length),
        g = bz.useRef(!1),
        c;
    if (K[2] !== j.length || K[3] !== z || K[4] !== C) c = () => {
        if (C && z)
            if (g.current) g.current = !1;
            else U(j.length)
    }, K[2] = j.length, K[3] = z, K[4] = C, K[5] = c;
    else c = K[5];
    let n;
    if (K[6] !== j || K[7] !== z || K[8] !== C) n = [C, z, j], K[6] = j, K[7] = z, K[8] = C, K[9] = n;
    else n = K[9];
    bz.useEffect(c, n);
    let l;
    if (K[10] !== j || K[11] !== H || K[12] !== D) l = () => {
        D?.(j, H)
    }, K[10] = j, K[11] = H, K[12] = D, K[13] = l;
    else l = K[13];
    let z6 = z && !!D,
        A6;
    if (K[14] !== z6) A6 = {
        context: "Chat",
        isActive: z6
    }, K[14] = z6, K[15] = A6;
    else A6 = K[15];
    G1("chat:externalEditor", l, A6);
    let e;
    if (K[16] !== G) e = () => {
        if (!G) return;
        TE6(vO(G5())).then((p6) => {
            if (p6) G(p6.base64, p6.mediaType, void 0, p6.dimensions)
        })
    }, K[16] = G, K[17] = e;
    else e = K[17];
    let i = z && !!G,
        O6;
    if (K[18] !== i) O6 = {
        context: "Chat",
        isActive: i
    }, K[18] = i, K[19] = O6;
    else O6 = K[19];
    G1("chat:imagePaste", e, O6);
    let J6;
    if (K[20] !== m || K[21] !== v) J6 = () => {
        if (m.length > 0 && v) v(m.at(-1).id)
    }, K[20] = m, K[21] = v, K[22] = J6;
    else J6 = K[22];
    let $6 = z && !V && j === "" && m.length > 0 && !!v,
        H6;
    if (K[23] !== $6) H6 = {
        context: "Attachments",
        isActive: $6
    }, K[23] = $6, K[24] = H6;
    else H6 = K[24];
    G1("attachments:remove", J6, H6);
    let q6, o;
    if (K[25] !== m.length || K[26] !== R || K[27] !== x) q6 = () => {
        if (m.length > 1) R?.((x + 1) % m.length)
    }, o = () => {
        if (m.length > 1) R?.((x - 1 + m.length) % m.length)
    }, K[25] = m.length, K[26] = R, K[27] = x, K[28] = q6, K[29] = o;
    else q6 = K[28], o = K[29];
    let _6;
    if (K[30] !== m || K[31] !== N || K[32] !== v || K[33] !== R || K[34] !== x) _6 = () => {
        let p6 = m[x];
        if (p6 && v)
            if (v(p6.id), m.length <= 1) N?.(!1);
            else R?.(Math.min(x, m.length - 2))
    }, K[30] = m, K[31] = N, K[32] = v, K[33] = R, K[34] = x, K[35] = _6;
    else _6 = K[35];
    let r;
    if (K[36] !== N) r = () => {
        N?.(!1)
    }, K[36] = N, K[37] = r;
    else r = K[37];
    let t;
    if (K[38] !== q6 || K[39] !== o || K[40] !== _6 || K[41] !== r) t = {
        "attachments:next": q6,
        "attachments:previous": o,
        "attachments:remove": _6,
        "attachments:exit": r
    }, K[38] = q6, K[39] = o, K[40] = _6, K[41] = r, K[42] = t;
    else t = K[42];
    let Y6 = z && !!V,
        X6;
    if (K[43] !== Y6) X6 = {
        context: "Attachments",
        isActive: Y6
    }, K[43] = Y6, K[44] = X6;
    else X6 = K[44];
    L7(t, X6);
    let M6, W6;
    if (K[45] !== V || K[46] !== z || K[47] !== N) M6 = () => {
        if (!z && V) N?.(!1)
    }, W6 = [z, V, N], K[45] = V, K[46] = z, K[47] = N, K[48] = M6, K[49] = W6;
    else M6 = K[48], W6 = K[49];
    bz.useEffect(M6, W6);
    let V6 = M === "expanded" ? w + 3 : w + 4,
        f6 = M === "compact" ? 0 : void 0,
        G6 = `${$}.`,
        k6;
    if (K[50] !== w || K[51] !== G6) k6 = G6.padEnd(w + 2), K[50] = w, K[51] = G6, K[52] = k6;
    else k6 = K[52];
    let T6;
    if (K[53] !== k6) T6 = bz.default.createElement(T, {
        dimColor: !0
    }, k6), K[53] = k6, K[54] = T6;
    else T6 = K[54];
    let v6;
    if (K[55] !== F || K[56] !== V || K[57] !== j || K[58] !== z || K[59] !== X || K[60] !== G || K[61] !== H || K[62] !== J || K[63] !== _ || K[64] !== S) v6 = S ? bz.default.createElement(bz.default.Fragment, null, bz.default.createElement(T, {
        color: z ? "suggestion" : void 0
    }, _.label), z ? bz.default.createElement(bz.default.Fragment, null, bz.default.createElement(T, {
        color: "suggestion"
    }, _.labelValueSeparator ?? ", "), bz.default.createElement(l4, {
        value: j,
        onChange: (p6) => {
            g.current = !0, H(p6), _.onChange(p6)
        },
        onSubmit: J,
        onExit: X,
        placeholder: _.placeholder,
        focus: !V,
        showCursor: !0,
        multiline: !0,
        cursorOffset: F,
        onChangeCursorOffset: U,
        columns: 80,
        onImagePaste: G,
        onPaste: (p6) => {
            g.current = !0;
            let q8 = j.slice(0, F),
                L8 = j.slice(F),
                w8 = q8 + p6 + L8;
            H(w8), _.onChange(w8), U(q8.length + p6.length)
        }
    })) : j && bz.default.createElement(T, null, _.labelValueSeparator ?? ", ", j)) : z ? bz.default.createElement(l4, {
        value: j,
        onChange: (p6) => {
            g.current = !0, H(p6), _.onChange(p6)
        },
        onSubmit: J,
        onExit: X,
        placeholder: _.placeholder || (typeof _.label === "string" ? _.label : void 0),
        focus: !V,
        showCursor: !0,
        multiline: !0,
        cursorOffset: F,
        onChangeCursorOffset: U,
        columns: 80,
        onImagePaste: G,
        onPaste: (p6) => {
            g.current = !0;
            let q8 = j.slice(0, F),
                L8 = j.slice(F),
                w8 = q8 + p6 + L8;
            H(w8), _.onChange(w8), U(q8.length + p6.length)
        }
    }) : bz.default.createElement(T, {
        color: j ? void 0 : "inactive"
    }, j || _.placeholder || _.label), K[55] = F, K[56] = V, K[57] = j, K[58] = z, K[59] = X, K[60] = G, K[61] = H, K[62] = J, K[63] = _, K[64] = S, K[65] = v6;
    else v6 = K[65];
    let L6;
    if (K[66] !== P || K[67] !== f6 || K[68] !== T6 || K[69] !== v6) L6 = bz.default.createElement(u, {
        flexDirection: "row",
        flexShrink: f6
    }, T6, P, v6), K[66] = P, K[67] = f6, K[68] = T6, K[69] = v6, K[70] = L6;
    else L6 = K[70];
    let y6;
    if (K[71] !== z || K[72] !== Y || K[73] !== A || K[74] !== O || K[75] !== L6) y6 = bz.default.createElement(r46, {
        isFocused: z,
        isSelected: Y,
        shouldShowDownArrow: A,
        shouldShowUpArrow: O,
        declareCursor: !1
    }, L6), K[71] = z, K[72] = Y, K[73] = A, K[74] = O, K[75] = L6, K[76] = y6;
    else y6 = K[76];
    let c6;
    if (K[77] !== V6 || K[78] !== z || K[79] !== Y || K[80] !== _.description || K[81] !== _.dimDescription) c6 = _.description && bz.default.createElement(u, {
        paddingLeft: V6
    }, bz.default.createElement(T, {
        dimColor: _.dimDescription !== !1,
        color: Y ? "success" : z ? "suggestion" : void 0
    }, _.description)), K[77] = V6, K[78] = z, K[79] = Y, K[80] = _.description, K[81] = _.dimDescription, K[82] = c6;
    else c6 = K[82];
    let Z8;
    if (K[83] !== V6 || K[84] !== m || K[85] !== V || K[86] !== z || K[87] !== x) Z8 = m.length > 0 && bz.default.createElement(u, {
        flexDirection: "row",
        gap: 1,
        paddingLeft: V6
    }, m.map((p6, q8) => bz.default.createElement(a$4, {
        key: p6.id,
        imageId: p6.id,
        isSelected: !!V && q8 === x
    })), bz.default.createElement(u, {
        flexGrow: 1,
        justifyContent: "flex-start",
        flexDirection: "row"
    }, bz.default.createElement(T, {
        dimColor: !0
    }, V ? bz.default.createElement(z1, null, m.length > 1 && bz.default.createElement(bz.default.Fragment, null, bz.default.createElement(v1, {
        action: "attachments:next",
        context: "Attachments",
        fallback: "→",
        description: "next"
    }), bz.default.createElement(v1, {
        action: "attachments:previous",
        context: "Attachments",
        fallback: "←",
        description: "prev"
    })), bz.default.createElement(v1, {
        action: "attachments:remove",
        context: "Attachments",
        fallback: "backspace",
        description: "remove"
    }), bz.default.createElement(v1, {
        action: "attachments:exit",
        context: "Attachments",
        fallback: "esc",
        description: "cancel"
    })) : z ? bz.default.createElement(A8, {
        chord: "down",
        action: "select",
        parens: !0
    }) : null))), K[83] = V6, K[84] = m, K[85] = V, K[86] = z, K[87] = x, K[88] = Z8;
    else Z8 = K[88];
    let N8;
    if (K[89] !== M) N8 = M === "expanded" && bz.default.createElement(T, null, " "), K[89] = M, K[90] = N8;
    else N8 = K[90];
    let R6;
    if (K[91] !== y6 || K[92] !== c6 || K[93] !== Z8 || K[94] !== N8) R6 = bz.default.createElement(u, {
        flexDirection: "column",
        flexShrink: 0
    }, y6, c6, Z8, N8), K[91] = y6, K[92] = c6, K[93] = Z8, K[94] = N8, K[95] = R6;
    else R6 = K[95];
    return R6
}
// @from(Ln 201285, Col 0)
function cd_(q) {
    return q.type === "image"
}
// @from(Ln 201288, Col 4)
bz
// @from(Ln 201289, Col 4)
NB1 = L(() => {
    o6();
    g6();
    C7();
    VE6();
    Jk();
    Sq();
    s$4();
    bK();
    Nq();
    u7();
    NY();
    sy8();
    bz = K6(P6(), 1)
})
// @from(Ln 201305, Col 0)
function A2(q, K) {
    let _ = s(8),
        z = K === void 0 ? !0 : K,
        A = mE6.useContext(zE6)?.setState,
        O, w;
    if (_[0] !== z || _[1] !== q || _[2] !== A) O = () => {
        if (!z || !A) return;
        return A((H) => {
            if (H.activeOverlays.has(q)) return H;
            let J = new Set(H.activeOverlays);
            return J.add(q), {
                ...H,
                activeOverlays: J
            }
        }), () => {
            A((H) => {
                if (!H.activeOverlays.has(q)) return H;
                let J = new Set(H.activeOverlays);
                return J.delete(q), {
                    ...H,
                    activeOverlays: J
                }
            })
        }
    }, w = [q, z, A], _[0] = z, _[1] = q, _[2] = A, _[3] = O, _[4] = w;
    else O = _[3], w = _[4];
    mE6.useEffect(O, w);
    let $, j;
    if (_[5] !== z) $ = () => {
        if (!z) return;
        return nd_
    }, j = [z], _[5] = z, _[6] = $, _[7] = j;
    else $ = _[6], j = _[7];
    mE6.useLayoutEffect($, j)
}
// @from(Ln 201341, Col 0)
function nd_() {
    return KO.get(process.stdout)?.invalidatePrevFrame()
}
// @from(Ln 201345, Col 0)
function e$4() {
    return M8(id_)
}
// @from(Ln 201349, Col 0)
function id_(q) {
    return q.activeOverlays.size > 0
}
// @from(Ln 201353, Col 0)
function o46() {
    return M8(rd_)
}
// @from(Ln 201357, Col 0)
function rd_(q) {
    for (let K of q.activeOverlays)
        if (!ld_.has(K)) return !0;
    return !1
}
// @from(Ln 201362, Col 4)
mE6
// @from(Ln 201362, Col 9)
ld_
// @from(Ln 201363, Col 4)
CP = L(() => {
    o6();
    Yk();
    N7();
    mE6 = K6(P6(), 1), ld_ = new Set(["autocomplete"])
})
// @from(Ln 201369, Col 4)
EB1
// @from(Ln 201369, Col 9)
Kj4 = ({
    isDisabled: q = !1,
    disableSelection: K = !1,
    state: _,
    options: z,
    isMultiSelect: Y = !1,
    onUpFromFirstItem: A,
    onDownFromLastItem: O,
    onInputModeToggle: w,
    inputValues: $,
    imagesSelected: j = !1,
    onEnterImageSelection: H,
    onExitImageSelection: J,
    hasInkFocus: X = !0
}) => {
    let {
        focusDirection: M
    } = oN6();
    A2("select", !!_.onCancel);
    let P = EB1.useMemo(() => {
            return z.find((G) => G.value === _.focusedValue)?.type === "input"
        }, [z, _.focusedValue]),
        W = EB1.useMemo(() => {
            let Z = {};
            if (!P) Z["select:next"] = () => {
                let G = z.at(-1);
                if (G && _.focusedValue === G.value) {
                    if (O) {
                        O();
                        return
                    }
                }
                _.focusNextOption()
            }, Z["select:previous"] = () => {
                let G = z[0];
                if (G && _.focusedValue === G.value && _.visibleFromIndex === 0) {
                    if (A) {
                        A();
                        return
                    }
                }
                _.focusPreviousOption()
            }, Z["select:accept"] = () => {
                if (K === !0) return;
                if (_.focusedValue === void 0) return;
                if (z.find((f) => f.value === _.focusedValue)?.disabled === !0) return;
                _.selectFocusedOption?.(), _.onChange?.(_.focusedValue)
            };
            if (_.onCancel) Z["select:cancel"] = () => {
                _.onCancel()
            };
            return Z
        }, [z, _, O, A, P, K, M]);
    return L7(W, {
        context: "Select",
        isActive: !q && !0
    }), {
        handleKeyDown: (Z) => {
            if (q) return;
            let G = eH8(Z.key),
                f = z.find((V) => V.value === _.focusedValue),
                v = f?.type === "input";
            if (Z.key === "tab") {
                if (Z.preventDefault(), w && _.focusedValue !== void 0) w(_.focusedValue);
                return
            }
            if (v) {
                if (j) {
                    if (Z.key === "up") Z.preventDefault(), J?.();
                    return
                }
                if (Z.key === "down" && H?.()) {
                    Z.stopImmediatePropagation();
                    return
                }
                if (Z.key === "down" || Z.ctrl && Z.key === "n") {
                    if (O) {
                        let V = z.at(-1);
                        if (V && _.focusedValue === V.value) {
                            O(), Z.stopImmediatePropagation();
                            return
                        }
                    }
                    _.focusNextOption(), Z.stopImmediatePropagation();
                    return
                }
                if (Z.key === "up" || Z.ctrl && Z.key === "p") {
                    if (A && _.visibleFromIndex === 0) {
                        let V = z[0];
                        if (V && _.focusedValue === V.value) {
                            A(), Z.stopImmediatePropagation();
                            return
                        }
                    }
                    _.focusPreviousOption(), Z.stopImmediatePropagation();
                    return
                }
                return
            }
            if (Z.key === "pagedown") {
                Z.preventDefault(), _.focusNextPage();
                return
            }
            if (Z.key === "pageup") {
                Z.preventDefault(), _.focusPreviousPage();
                return
            }
            if (K !== !0) {
                if (Y && VA6(Z.key) === " " && _.focusedValue !== void 0) {
                    if (f?.disabled !== !0) Z.preventDefault(), _.selectFocusedOption?.(), _.onChange?.(_.focusedValue);
                    return
                }
                if (K !== "numeric" && /^[0-9]$/.test(G)) {
                    Z.preventDefault();
                    let V = parseInt(G) - 1;
                    if (V >= 0 && V < _.options.length) {
                        let k = _.options[V];
                        if (k.disabled === !0) return;
                        if (k.type === "input") {
                            if (($?.get(k.value) ?? "").trim()) {
                                _.onChange?.(k.value);
                                return
                            }
                            if (k.allowEmptySubmitToCancel) {
                                _.onChange?.(k.value);
                                return
                            }
                            _.focusOption(k.value);
                            return
                        }
                        _.onChange?.(k.value);
                        return
                    }
                }
            }
        }
    }
}
// @from(Ln 201507, Col 4)
_j4 = L(() => {
    CP();
    uE8();
    C7();
    EB1 = K6(P6(), 1)
})
// @from(Ln 201513, Col 4)
ty8
// @from(Ln 201514, Col 4)
zj4 = L(() => {
    ty8 = class ty8 extends Map {
        first;
        last;
        constructor(q) {
            let K = [],
                _, z, Y, A = 0;
            for (let O of q) {
                let w = {
                    label: O.label,
                    value: O.value,
                    description: O.description,
                    previous: Y,
                    next: void 0,
                    index: A
                };
                if (Y) Y.next = w;
                _ ||= w, z = w, K.push([O.value, w]), A++, Y = w
            }
            super(K);
            this.first = _, this.last = z
        }
    }
})
// @from(Ln 201542, Col 0)
function ey8({
    visibleOptionCount: q = 5,
    options: K,
    initialFocusValue: _,
    onFocus: z,
    focusValue: Y
}) {
    let [A, O] = JM.useReducer(ad_, {
        visibleOptionCount: q,
        options: K,
        initialFocusValue: Y || _
    }, Yj4), w = JM.useRef(z);
    JM.useEffect(() => {
        w.current = z
    });
    let [$, j] = JM.useState(K);
    if (K !== $ && !od_(K, $)) O({
        type: "reset",
        state: Yj4({
            visibleOptionCount: q,
            options: K,
            initialFocusValue: Y ?? A.focusedValue ?? _,
            currentViewport: {
                visibleFromIndex: A.visibleFromIndex,
                visibleToIndex: A.visibleToIndex
            }
        })
    }), j(K);
    let H = JM.useCallback(() => {
            O({
                type: "focus-next-option"
            })
        }, []),
        J = JM.useCallback(() => {
            O({
                type: "focus-previous-option"
            })
        }, []),
        X = JM.useCallback(() => {
            O({
                type: "focus-next-page"
            })
        }, []),
        M = JM.useCallback(() => {
            O({
                type: "focus-previous-page"
            })
        }, []),
        P = JM.useCallback((f) => {
            if (f !== void 0) O({
                type: "set-focus",
                value: f
            })
        }, []),
        W = JM.useMemo(() => {
            return K.map((f, v) => ({
                ...f,
                index: v
            })).slice(A.visibleFromIndex, A.visibleToIndex)
        }, [K, A.visibleFromIndex, A.visibleToIndex]),
        D = JM.useMemo(() => {
            if (A.focusedValue === void 0) return;
            if (K.some((v) => v.value === A.focusedValue)) return A.focusedValue;
            return K[0]?.value
        }, [A.focusedValue, K]),
        Z = JM.useMemo(() => {
            return K.find((v) => v.value === D)?.type === "input"
        }, [D, K]);
    JM.useEffect(() => {
        if (D !== void 0) w.current?.(D)
    }, [D]), JM.useEffect(() => {
        if (Y !== void 0) O({
            type: "set-focus",
            value: Y
        })
    }, [Y]);
    let G = JM.useMemo(() => {
        if (D === void 0) return 0;
        let f = K.findIndex((v) => v.value === D);
        return f >= 0 ? f + 1 : 0
    }, [D, K]);
    return {
        focusedValue: D,
        focusedIndex: G,
        visibleFromIndex: A.visibleFromIndex,
        visibleToIndex: A.visibleToIndex,
        visibleOptions: W,
        isInInput: Z ?? !1,
        focusNextOption: H,
        focusPreviousOption: J,
        focusNextPage: X,
        focusPreviousPage: M,
        focusOption: P,
        options: K
    }
}
// @from(Ln 201638, Col 4)
JM
// @from(Ln 201638, Col 8)
ad_ = (q, K) => {
        switch (K.type) {
            case "focus-next-option": {
                if (q.focusedValue === void 0) return q;
                let _ = q.optionMap.get(q.focusedValue);
                if (!_) return q;
                let z = _.next || q.optionMap.first;
                if (!z) return q;
                if (!_.next && z === q.optionMap.first) return {
                    ...q,
                    focusedValue: z.value,
                    visibleFromIndex: 0,
                    visibleToIndex: q.visibleOptionCount
                };
                if (!(z.index >= q.visibleToIndex)) return {
                    ...q,
                    focusedValue: z.value
                };
                let A = Math.min(q.optionMap.size, q.visibleToIndex + 1),
                    O = A - q.visibleOptionCount;
                return {
                    ...q,
                    focusedValue: z.value,
                    visibleFromIndex: O,
                    visibleToIndex: A
                }
            }
            case "focus-previous-option": {
                if (q.focusedValue === void 0) return q;
                let _ = q.optionMap.get(q.focusedValue);
                if (!_) return q;
                let z = _.previous || q.optionMap.last;
                if (!z) return q;
                if (!_.previous && z === q.optionMap.last) {
                    let w = q.optionMap.size,
                        $ = Math.max(0, w - q.visibleOptionCount);
                    return {
                        ...q,
                        focusedValue: z.value,
                        visibleFromIndex: $,
                        visibleToIndex: w
                    }
                }
                if (!(z.index <= q.visibleFromIndex)) return {
                    ...q,
                    focusedValue: z.value
                };
                let A = Math.max(0, q.visibleFromIndex - 1),
                    O = A + q.visibleOptionCount;
                return {
                    ...q,
                    focusedValue: z.value,
                    visibleFromIndex: A,
                    visibleToIndex: O
                }
            }
            case "focus-next-page": {
                if (q.focusedValue === void 0) return q;
                let _ = q.optionMap.get(q.focusedValue);
                if (!_) return q;
                let z = Math.min(q.optionMap.size - 1, _.index + q.visibleOptionCount),
                    Y = q.optionMap.first;
                while (Y && Y.index < z)
                    if (Y.next) Y = Y.next;
                    else break;
                if (!Y) return q;
                let A = Math.min(q.optionMap.size, Y.index + 1),
                    O = Math.max(0, A - q.visibleOptionCount);
                return {
                    ...q,
                    focusedValue: Y.value,
                    visibleFromIndex: O,
                    visibleToIndex: A
                }
            }
            case "focus-previous-page": {
                if (q.focusedValue === void 0) return q;
                let _ = q.optionMap.get(q.focusedValue);
                if (!_) return q;
                let z = Math.max(0, _.index - q.visibleOptionCount),
                    Y = q.optionMap.first;
                while (Y && Y.index < z)
                    if (Y.next) Y = Y.next;
                    else break;
                if (!Y) return q;
                let A = Math.max(0, Y.index),
                    O = Math.min(q.optionMap.size, A + q.visibleOptionCount);
                return {
                    ...q,
                    focusedValue: Y.value,
                    visibleFromIndex: A,
                    visibleToIndex: O
                }
            }
            case "reset":
                return K.state;
            case "set-focus": {
                if (q.focusedValue === K.value) return q;
                let _ = q.optionMap.get(K.value);
                if (!_) return q;
                if (_.index >= q.visibleFromIndex && _.index < q.visibleToIndex) return {
                    ...q,
                    focusedValue: K.value
                };
                let z, Y;
                if (_.index < q.visibleFromIndex) z = _.index, Y = Math.min(q.optionMap.size, z + q.visibleOptionCount);
                else Y = Math.min(q.optionMap.size, _.index + 1), z = Math.max(0, Y - q.visibleOptionCount);
                return {
                    ...q,
                    focusedValue: K.value,
                    visibleFromIndex: z,
                    visibleToIndex: Y
                }
            }
        }
    }
// @from(Ln 201754, Col 4)
Yj4 = ({
        visibleOptionCount: q,
        options: K,
        initialFocusValue: _,
        currentViewport: z
    }) => {
        let Y = typeof q === "number" ? Math.min(q, K.length) : K.length,
            A = new ty8(K),
            O = _ !== void 0 && A.get(_),
            w = O ? _ : A.first?.value,
            $ = 0,
            j = Y;
        if (O) {
            let H = O.index;
            if (z)
                if (H >= z.visibleFromIndex && H < z.visibleToIndex) $ = z.visibleFromIndex, j = Math.min(A.size, z.visibleToIndex);
                else if (H < z.visibleFromIndex) $ = H, j = Math.min(A.size, $ + Y);
            else j = Math.min(A.size, H + 1), $ = Math.max(0, j - Y);
            else if (H >= Y) j = Math.min(A.size, H + 1), $ = Math.max(0, j - Y);
            $ = Math.max(0, Math.min($, A.size - 1)), j = Math.min(A.size, Math.max(Y, j))
        }
        return {
            optionMap: A,
            visibleOptionCount: Y,
            focusedValue: w,
            visibleFromIndex: $,
            visibleToIndex: j
        }
    }
// @from(Ln 201783, Col 4)
yB1 = L(() => {
    zj4();
    JM = K6(P6(), 1)
})
// @from(Ln 201788, Col 0)
function Aj4({
    visibleOptionCount: q = 5,
    options: K,
    defaultValue: _,
    onChange: z,
    onCancel: Y,
    onFocus: A,
    focusValue: O
}) {
    let [w, $] = qL8.useState(_), j = ey8({
        visibleOptionCount: q,
        options: K,
        initialFocusValue: void 0,
        onFocus: A,
        focusValue: O
    }), H = qL8.useCallback(() => {
        $(j.focusedValue)
    }, [j.focusedValue]);
    return {
        ...j,
        value: w,
        selectFocusedOption: H,
        onChange: z,
        onCancel: Y
    }
}
// @from(Ln 201814, Col 4)
qL8
// @from(Ln 201815, Col 4)
Oj4 = L(() => {
    yB1();
    qL8 = K6(P6(), 1)
})
// @from(Ln 201820, Col 0)
function A1(q) {
    let K = s(78),
        {
            isDisabled: _,
            hideIndexes: z,
            visibleOptionCount: Y,
            highlightText: A,
            options: O,
            defaultValue: w,
            onCancel: $,
            onChange: j,
            onFocus: H,
            defaultFocusValue: J,
            layout: X,
            disableSelection: M,
            inlineDescriptions: P,
            onUpFromFirstItem: W,
            onDownFromLastItem: D,
            onInputModeToggle: Z,
            onOpenEditor: G,
            onImagePaste: f,
            pastedContents: v,
            onRemoveImage: V
        } = q,
        k = _ === void 0 ? !1 : _,
        N = z === void 0 ? !1 : z,
        R = Y === void 0 ? 5 : Y,
        h = X === void 0 ? "compact" : X,
        C = M === void 0 ? !1 : M,
        x = P === void 0 ? !1 : P,
        [B, m] = n4.useState(!1),
        [S, F] = n4.useState(0),
        U;
    if (K[0] !== O) U = () => {
        let G6 = new Map;
        return O.forEach((k6) => {
            if (k6.type === "input" && k6.initialValue) G6.set(k6.value, k6.initialValue)
        }), G6
    }, K[0] = O, K[1] = U;
    else U = K[1];
    let [g, c] = n4.useState(U), n;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) n = new Map, K[2] = n;
    else n = K[2];
    let l = n4.useRef(n),
        z6, A6;
    if (K[3] !== g || K[4] !== O) A6 = () => {
        for (let G6 of O)
            if (G6.type === "input" && G6.initialValue !== void 0) {
                let k6 = l.current.get(G6.value) ?? "",
                    T6 = g.get(G6.value) ?? "",
                    v6 = G6.initialValue;
                if (v6 !== k6 && T6 === k6) c((L6) => {
                    let y6 = new Map(L6);
                    return y6.set(G6.value, v6), y6
                });
                l.current.set(G6.value, v6)
            }
    }, z6 = [O, g], K[3] = g, K[4] = O, K[5] = z6, K[6] = A6;
    else z6 = K[5], A6 = K[6];
    n4.useEffect(A6, z6);
    let e;
    if (K[7] !== J || K[8] !== w || K[9] !== $ || K[10] !== j || K[11] !== H || K[12] !== O || K[13] !== R) e = {
        visibleOptionCount: R,
        options: O,
        defaultValue: w,
        onChange: j,
        onCancel: $,
        onFocus: H,
        focusValue: J
    }, K[7] = J, K[8] = w, K[9] = $, K[10] = j, K[11] = H, K[12] = O, K[13] = R, K[14] = e;
    else e = K[14];
    let i = Aj4(e),
        [O6, J6] = n4.useState(!0),
        $6 = C || (N ? "numeric" : !1),
        H6;
    if (K[15] !== v) H6 = () => {
        if (v && Object.values(v).some(Yc_)) {
            let G6 = w7(Object.values(v), zc_);
            return m(!0), F(G6 - 1), !0
        }
        return !1
    }, K[15] = v, K[16] = H6;
    else H6 = K[16];
    let q6;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) q6 = () => {
        m(!1)
    }, K[17] = q6;
    else q6 = K[17];
    let o;
    if (K[18] !== O6 || K[19] !== B || K[20] !== g || K[21] !== k || K[22] !== D || K[23] !== Z || K[24] !== W || K[25] !== O || K[26] !== i || K[27] !== $6 || K[28] !== H6) o = {
        isDisabled: k,
        hasInkFocus: O6,
        disableSelection: $6,
        state: i,
        options: O,
        isMultiSelect: !1,
        onUpFromFirstItem: W,
        onDownFromLastItem: D,
        onInputModeToggle: Z,
        inputValues: g,
        imagesSelected: B,
        onEnterImageSelection: H6,
        onExitImageSelection: q6
    }, K[18] = O6, K[19] = B, K[20] = g, K[21] = k, K[22] = D, K[23] = Z, K[24] = W, K[25] = O, K[26] = i, K[27] = $6, K[28] = H6, K[29] = o;
    else o = K[29];
    let {
        handleKeyDown: _6
    } = Kj4(o), r = n4.useRef(null), t, Y6;
    if (K[30] !== k) t = () => {
        if (!k && r.current) cE(r.current).focus(r.current)
    }, Y6 = [k], K[30] = k, K[31] = t, K[32] = Y6;
    else t = K[31], Y6 = K[32];
    n4.useEffect(t, Y6);
    let X6, M6, W6, V6;
    if (K[33] !== _6 || K[34] !== N || K[35] !== A || K[36] !== B || K[37] !== x || K[38] !== g || K[39] !== k || K[40] !== h || K[41] !== $ || K[42] !== j || K[43] !== f || K[44] !== G || K[45] !== V || K[46] !== O.length || K[47] !== v || K[48] !== S || K[49] !== i.focusedValue || K[50] !== i.options || K[51] !== i.value || K[52] !== i.visibleFromIndex || K[53] !== i.visibleOptions || K[54] !== i.visibleToIndex) {
        V6 = Symbol.for("react.early_return_sentinel");
        q: {
            let G6 = {
                container: () => ({
                    flexDirection: "column",
                    ref: r,
                    ...k ? {} : {
                        tabIndex: 0,
                        onKeyDown: _6,
                        onFocus: () => J6(!0),
                        onBlur: () => J6(!1)
                    }
                }),
                highlightedText: _c_
            };
            if (h === "expanded") {
                let c6;
                if (K[59] !== i.options.length) c6 = i.options.length.toString(), K[59] = i.options.length, K[60] = c6;
                else c6 = K[60];
                let Z8 = c6.length;
                V6 = n4.default.createElement(u, {
                    ...G6.container()
                }, i.visibleOptions.map((N8, R6) => {
                    let p6 = N8.index === i.visibleFromIndex,
                        q8 = N8.index === i.visibleToIndex - 1,
                        L8 = i.visibleToIndex < O.length,
                        w8 = i.visibleFromIndex > 0,
                        x8 = i.visibleFromIndex + R6 + 1,
                        a6 = !k && i.focusedValue === N8.value,
                        D8 = i.value === N8.value;
                    if (N8.type === "input") {
                        let s6 = g.has(N8.value) ? g.get(N8.value) : N8.initialValue || "";
                        return n4.default.createElement(uE6, {
                            key: String(N8.value),
                            option: N8,
                            isFocused: a6,
                            isSelected: D8,
                            shouldShowDownArrow: L8 && q8,
                            shouldShowUpArrow: w8 && p6,
                            maxIndexWidth: Z8,
                            index: x8,
                            inputValue: s6,
                            onInputChange: (u6) => {
                                c((h6) => {
                                    let _8 = new Map(h6);
                                    return _8.set(N8.value, u6), _8
                                })
                            },
                            onSubmit: (u6) => {
                                let h6 = v && Object.values(v).some(Kc_);
                                if (u6.trim() || h6 || N8.allowEmptySubmitToCancel) j?.(N8.value);
                                else $?.()
                            },
                            onExit: $,
                            layout: "expanded",
                            showLabel: x,
                            onOpenEditor: G,
                            resetCursorOnUpdate: N8.resetCursorOnUpdate,
                            onImagePaste: f,
                            pastedContents: v,
                            onRemoveImage: V,
                            imagesSelected: B,
                            selectedImageIndex: S,
                            onImagesSelectedChange: m,
                            onSelectedImageIndexChange: F
                        })
                    }
                    let Q6 = N8.label;
                    if (typeof N8.label === "string" && A && N8.label.includes(A)) {
                        let s6 = N8.label,
                            u6 = s6.indexOf(A);
                        Q6 = n4.default.createElement(n4.default.Fragment, null, s6.slice(0, u6), n4.default.createElement(T, {
                            ...G6.highlightedText()
                        }, A), s6.slice(u6 + A.length))
                    }
                    let W8 = N8.disabled === !0,
                        G8 = W8 ? void 0 : D8 ? "success" : a6 ? "suggestion" : void 0;
                    return n4.default.createElement(u, {
                        key: String(N8.value),
                        flexDirection: "column",
                        flexShrink: 0
                    }, n4.default.createElement(r46, {
                        isFocused: a6,
                        isSelected: D8,
                        shouldShowDownArrow: L8 && q8,
                        shouldShowUpArrow: w8 && p6
                    }, n4.default.createElement(T, {
                        dimColor: W8,
                        color: G8
                    }, Q6)), N8.description && n4.default.createElement(u, {
                        paddingLeft: 2
                    }, n4.default.createElement(T, {
                        dimColor: W8 || N8.dimDescription !== !1,
                        color: G8
                    }, n4.default.createElement(v5, null, N8.description))), n4.default.createElement(T, null, " "))
                }));
                break q
            }
            if (h === "compact-vertical") {
                let c6;
                if (K[61] !== N || K[62] !== i.options) c6 = N ? 0 : i.options.length.toString().length, K[61] = N, K[62] = i.options, K[63] = c6;
                else c6 = K[63];
                let Z8 = c6;
                V6 = n4.default.createElement(u, {
                    ...G6.container()
                }, i.visibleOptions.map((N8, R6) => {
                    let p6 = N8.index === i.visibleFromIndex,
                        q8 = N8.index === i.visibleToIndex - 1,
                        L8 = i.visibleToIndex < O.length,
                        w8 = i.visibleFromIndex > 0,
                        x8 = i.visibleFromIndex + R6 + 1,
                        a6 = !k && i.focusedValue === N8.value,
                        D8 = i.value === N8.value;
                    if (N8.type === "input") {
                        let G8 = g.has(N8.value) ? g.get(N8.value) : N8.initialValue || "";
                        return n4.default.createElement(uE6, {
                            key: String(N8.value),
                            option: N8,
                            isFocused: a6,
                            isSelected: D8,
                            shouldShowDownArrow: L8 && q8,
                            shouldShowUpArrow: w8 && p6,
                            maxIndexWidth: Z8,
                            index: x8,
                            inputValue: G8,
                            onInputChange: (s6) => {
                                c((u6) => {
                                    let h6 = new Map(u6);
                                    return h6.set(N8.value, s6), h6
                                })
                            },
                            onSubmit: (s6) => {
                                let u6 = v && Object.values(v).some(qc_);
                                if (s6.trim() || u6 || N8.allowEmptySubmitToCancel) j?.(N8.value);
                                else $?.()
                            },
                            onExit: $,
                            layout: "compact",
                            showLabel: x,
                            onOpenEditor: G,
                            resetCursorOnUpdate: N8.resetCursorOnUpdate,
                            onImagePaste: f,
                            pastedContents: v,
                            onRemoveImage: V,
                            imagesSelected: B,
                            selectedImageIndex: S,
                            onImagesSelectedChange: m,
                            onSelectedImageIndexChange: F
                        })
                    }
                    let Q6 = N8.label;
                    if (typeof N8.label === "string" && A && N8.label.includes(A)) {
                        let G8 = N8.label,
                            s6 = G8.indexOf(A);
                        Q6 = n4.default.createElement(n4.default.Fragment, null, G8.slice(0, s6), n4.default.createElement(T, {
                            ...G6.highlightedText()
                        }, A), G8.slice(s6 + A.length))
                    }
                    let W8 = N8.disabled === !0;
                    return n4.default.createElement(u, {
                        key: String(N8.value),
                        flexDirection: "column",
                        flexShrink: 0
                    }, n4.default.createElement(r46, {
                        isFocused: a6,
                        isSelected: D8,
                        shouldShowDownArrow: L8 && q8,
                        shouldShowUpArrow: w8 && p6
                    }, n4.default.createElement(n4.default.Fragment, null, !N && n4.default.createElement(T, {
                        dimColor: !0
                    }, `${x8}.`.padEnd(Z8 + 1)), n4.default.createElement(T, {
                        dimColor: W8,
                        color: W8 ? void 0 : D8 ? "success" : a6 ? "suggestion" : void 0
                    }, Q6))), N8.description && n4.default.createElement(u, {
                        paddingLeft: N ? 4 : Z8 + 4
                    }, n4.default.createElement(T, {
                        dimColor: W8 || N8.dimDescription !== !1,
                        color: W8 ? void 0 : D8 ? "success" : a6 ? "suggestion" : void 0
                    }, n4.default.createElement(v5, null, N8.description))))
                }));
                break q
            }
            let k6;
            if (K[64] !== N || K[65] !== i.options) k6 = N ? 0 : i.options.length.toString().length,
            K[64] = N,
            K[65] = i.options,
            K[66] = k6;
            else k6 = K[66];
            let T6 = k6,
                v6 = i.visibleOptions.some(ed_),
                L6 = !x && !v6 && i.visibleOptions.some(td_),
                y6 = i.visibleOptions.map((c6, Z8) => {
                    let N8 = c6.index === i.visibleFromIndex,
                        R6 = c6.index === i.visibleToIndex - 1,
                        p6 = i.visibleToIndex < O.length,
                        q8 = i.visibleFromIndex > 0,
                        L8 = i.visibleFromIndex + Z8 + 1,
                        w8 = !k && i.focusedValue === c6.value,
                        x8 = i.value === c6.value,
                        a6 = c6.disabled === !0,
                        D8 = c6.label;
                    if (typeof c6.label === "string" && A && c6.label.includes(A)) {
                        let Q6 = c6.label,
                            W8 = Q6.indexOf(A);
                        D8 = n4.default.createElement(n4.default.Fragment, null, Q6.slice(0, W8), n4.default.createElement(T, {
                            ...G6.highlightedText()
                        }, A), Q6.slice(W8 + A.length))
                    }
                    return {
                        option: c6,
                        index: L8,
                        label: D8,
                        isFocused: w8,
                        isSelected: x8,
                        isOptionDisabled: a6,
                        shouldShowDownArrow: p6 && R6,
                        shouldShowUpArrow: q8 && N8
                    }
                });
            if (L6) {
                let c6;
                if (K[67] !== N || K[68] !== T6) c6 = (R6) => {
                    if (R6.option.type === "input") return 0;
                    let p6 = qj6(R6.option.label),
                        q8 = N ? 0 : T6 + 2,
                        L8 = R6.isSelected ? 2 : 0;
                    return 2 + q8 + N1(p6) + L8
                }, K[67] = N, K[68] = T6, K[69] = c6;
                else c6 = K[69];
                let Z8 = Math.max(...y6.map(c6)),
                    N8;
                if (K[70] !== N || K[71] !== T6 || K[72] !== Z8) N8 = (R6) => {
                    if (R6.option.type === "input") return null;
                    let p6 = qj6(R6.option.label),
                        q8 = N ? 0 : T6 + 2,
                        L8 = R6.isSelected ? 2 : 0,
                        w8 = 2 + q8 + N1(p6) + L8,
                        x8 = Z8 - w8;
                    return n4.default.createElement(Ac_, {
                        key: String(R6.option.value),
                        isFocused: R6.isFocused
                    }, n4.default.createElement(u, {
                        flexDirection: "row",
                        flexShrink: 0
                    }, R6.isFocused ? n4.default.createElement(T, {
                        color: "suggestion"
                    }, e6.pointer) : R6.shouldShowDownArrow ? n4.default.createElement(T, {
                        dimColor: !0
                    }, e6.arrowDown) : R6.shouldShowUpArrow ? n4.default.createElement(T, {
                        dimColor: !0
                    }, e6.arrowUp) : n4.default.createElement(T, null, " "), n4.default.createElement(T, null, " "), n4.default.createElement(T, {
                        dimColor: R6.isOptionDisabled,
                        color: R6.isOptionDisabled ? void 0 : R6.isSelected ? "success" : R6.isFocused ? "suggestion" : void 0
                    }, !N && n4.default.createElement(T, {
                        dimColor: !0
                    }, `${R6.index}.`.padEnd(T6 + 2)), R6.label), R6.isSelected && n4.default.createElement(T, null, " ", n4.default.createElement(D4, {
                        status: "success"
                    })), x8 > 0 && n4.default.createElement(T, null, " ".repeat(x8))), n4.default.createElement(u, {
                        flexGrow: 1,
                        marginLeft: 2
                    }, n4.default.createElement(T, {
                        wrap: "wrap",
                        dimColor: R6.isOptionDisabled || R6.option.dimDescription !== !1,
                        color: R6.isOptionDisabled ? void 0 : R6.isSelected ? "success" : R6.isFocused ? "suggestion" : void 0
                    }, n4.default.createElement(v5, null, R6.option.description || " "))))
                }, K[70] = N, K[71] = T6, K[72] = Z8, K[73] = N8;
                else N8 = K[73];
                V6 = n4.default.createElement(u, {
                    ...G6.container()
                }, y6.map(N8));
                break q
            }
            X6 = u,
            M6 = G6.container(),
            W6 = i.visibleOptions.map((c6, Z8) => {
                if (c6.type === "input") {
                    let Q6 = g.has(c6.value) ? g.get(c6.value) : c6.initialValue || "",
                        W8 = c6.index === i.visibleFromIndex,
                        G8 = c6.index === i.visibleToIndex - 1,
                        s6 = i.visibleToIndex < O.length,
                        u6 = i.visibleFromIndex > 0,
                        h6 = i.visibleFromIndex + Z8 + 1,
                        _8 = !k && i.focusedValue === c6.value,
                        R8 = i.value === c6.value;
                    return n4.default.createElement(uE6, {
                        key: String(c6.value),
                        option: c6,
                        isFocused: _8,
                        isSelected: R8,
                        shouldShowDownArrow: s6 && G8,
                        shouldShowUpArrow: u6 && W8,
                        maxIndexWidth: T6,
                        index: h6,
                        inputValue: Q6,
                        onInputChange: (x6) => {
                            c((i6) => {
                                let v8 = new Map(i6);
                                return v8.set(c6.value, x6), v8
                            })
                        },
                        onSubmit: (x6) => {
                            let i6 = v && Object.values(v).some(sd_);
                            if (x6.trim() || i6 || c6.allowEmptySubmitToCancel) j?.(c6.value);
                            else $?.()
                        },
                        onExit: $,
                        layout: "compact",
                        showLabel: x,
                        onOpenEditor: G,
                        resetCursorOnUpdate: c6.resetCursorOnUpdate,
                        onImagePaste: f,
                        pastedContents: v,
                        onRemoveImage: V,
                        imagesSelected: B,
                        selectedImageIndex: S,
                        onImagesSelectedChange: m,
                        onSelectedImageIndexChange: F
                    })
                }
                let N8 = c6.label;
                if (typeof c6.label === "string" && A && c6.label.includes(A)) {
                    let Q6 = c6.label,
                        W8 = Q6.indexOf(A);
                    N8 = n4.default.createElement(n4.default.Fragment, null, Q6.slice(0, W8), n4.default.createElement(T, {
                        ...G6.highlightedText()
                    }, A), Q6.slice(W8 + A.length))
                }
                let R6 = c6.index === i.visibleFromIndex,
                    p6 = c6.index === i.visibleToIndex - 1,
                    q8 = i.visibleToIndex < O.length,
                    L8 = i.visibleFromIndex > 0,
                    w8 = i.visibleFromIndex + Z8 + 1,
                    x8 = !k && i.focusedValue === c6.value,
                    a6 = i.value === c6.value,
                    D8 = c6.disabled === !0;
                return n4.default.createElement(r46, {
                    key: String(c6.value),
                    isFocused: x8,
                    isSelected: a6,
                    shouldShowDownArrow: q8 && p6,
                    shouldShowUpArrow: L8 && R6
                }, n4.default.createElement(u, {
                    flexDirection: "row",
                    flexShrink: 0
                }, !N && n4.default.createElement(T, {
                    dimColor: !0
                }, `${w8}.`.padEnd(T6 + 2)), n4.default.createElement(T, {
                    dimColor: D8,
                    color: D8 ? void 0 : a6 ? "success" : x8 ? "suggestion" : void 0
                }, N8, x && c6.description && n4.default.createElement(T, {
                    dimColor: D8 || c6.dimDescription !== !1
                }, " ", c6.description))), !x && c6.description && n4.default.createElement(u, {
                    flexShrink: 99,
                    marginLeft: 2
                }, n4.default.createElement(T, {
                    wrap: "wrap-trim",
                    dimColor: D8 || c6.dimDescription !== !1,
                    color: D8 ? void 0 : a6 ? "success" : x8 ? "suggestion" : void 0
                }, n4.default.createElement(v5, null, c6.description))))
            })
        }
        K[33] = _6, K[34] = N, K[35] = A, K[36] = B, K[37] = x, K[38] = g, K[39] = k, K[40] = h, K[41] = $, K[42] = j, K[43] = f, K[44] = G, K[45] = V, K[46] = O.length, K[47] = v, K[48] = S, K[49] = i.focusedValue, K[50] = i.options, K[51] = i.value, K[52] = i.visibleFromIndex, K[53] = i.visibleOptions, K[54] = i.visibleToIndex, K[55] = X6, K[56] = M6, K[57] = W6, K[58] = V6
    } else X6 = K[55], M6 = K[56], W6 = K[57], V6 = K[58];
    if (V6 !== Symbol.for("react.early_return_sentinel")) return V6;
    let f6;
    if (K[74] !== X6 || K[75] !== M6 || K[76] !== W6) f6 = n4.default.createElement(X6, {
        ...M6
    }, W6), K[74] = X6, K[75] = M6, K[76] = W6, K[77] = f6;
    else f6 = K[77];
    return f6
}
// @from(Ln 202307, Col 0)
function sd_(q) {
    return q.type === "image"
}
// @from(Ln 202311, Col 0)
function td_(q) {
    return q.description
}
// @from(Ln 202315, Col 0)
function ed_(q) {
    return q.type === "input"
}
// @from(Ln 202319, Col 0)
function qc_(q) {
    return q.type === "image"
}
// @from(Ln 202323, Col 0)
function Kc_(q) {
    return q.type === "image"
}
// @from(Ln 202327, Col 0)
function _c_() {
    return {
        bold: !0
    }
}
// @from(Ln 202333, Col 0)
function zc_(q) {
    return q.type === "image"
}
// @from(Ln 202337, Col 0)
function Yc_(q) {
    return q.type === "image"
}
// @from(Ln 202341, Col 0)
function Ac_(q) {
    let K = s(5),
        {
            isFocused: _,
            children: z
        } = q,
        Y;
    if (K[0] !== _) Y = {
        line: 0,
        column: 0,
        active: _
    }, K[0] = _, K[1] = Y;
    else Y = K[1];
    let A = n46(Y),
        O;
    if (K[2] !== z || K[3] !== A) O = n4.default.createElement(u, {
        ref: A,
        flexDirection: "row",
        flexShrink: 0
    }, z), K[2] = z, K[3] = A, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 202364, Col 4)
n4
// @from(Ln 202365, Col 4)
gK = L(() => {
    o6();
    Qq();
    lB();
    bs6();
    n5();
    g6();
    VB1();
    Y2();
    NB1();
    sy8();
    _j4();
    Oj4();
    n4 = K6(P6(), 1)
})
// @from(Ln 202381, Col 0)
function wj4(q, K, _, z = !0) {
    let {
        exit: Y
    } = hI(), [A, O] = a46.useState({
        pending: !1,
        keyName: null
    }), w = a46.useMemo(() => _ ?? Y, [_, Y]), $ = wp((M) => O({
        pending: M,
        keyName: "Ctrl-C"
    }), w), j = wp((M) => O({
        pending: M,
        keyName: "Ctrl-D"
    }), w), H = a46.useCallback(() => {
        if (K?.()) return;
        $()
    }, [$, K]), J = a46.useCallback(() => {
        j()
    }, [j]), X = a46.useMemo(() => ({
        "app:interrupt": H,
        "app:exit": J
    }), [H, J]);
    return q(X, {
        context: "Global",
        isActive: z
    }), A
}
// @from(Ln 202407, Col 4)
a46
// @from(Ln 202408, Col 4)
$j4 = L(() => {
    mu1();
    Cs6();
    a46 = K6(P6(), 1)
})
// @from(Ln 202414, Col 0)
function $3(q, K, _) {
    return wj4(L7, K, q, _)
}
// @from(Ln 202417, Col 4)
C$ = L(() => {
    C7();
    $j4()
})
// @from(Ln 202422, Col 0)
function bP() {
    return BE6.useContext(xs6) !== null
}
// @from(Ln 202426, Col 0)
function Fd(q) {
    let K = s(3),
        _ = BE6.useContext(xs6),
        z;
    if (K[0] !== _ || K[1] !== q) z = _ ? {
        rows: _.rows,
        columns: _.columns
    } : q, K[0] = _, K[1] = q, K[2] = z;
    else z = K[2];
    return z
}
// @from(Ln 202438, Col 0)
function jj4() {
    return BE6.useContext(xs6)?.scrollRef ?? null
}
// @from(Ln 202441, Col 4)
BE6
// @from(Ln 202441, Col 9)
xs6
// @from(Ln 202442, Col 4)
Mk = L(() => {
    o6();
    BE6 = K6(P6(), 1), xs6 = BE6.createContext(null)
})
// @from(Ln 202447, Col 0)
function zA(q) {
    let K = s(21),
        {
            width: _,
            color: z,
            char: Y,
            padding: A,
            title: O,
            titleAlign: w
        } = q,
        $ = Y === void 0 ? Og7 : Y,
        j = A === void 0 ? 0 : A,
        H = w === void 0 ? "center" : w,
        {
            columns: J
        } = s1(),
        X = Math.max(0, (_ ?? J) - j);
    if (O) {
        let D = N1(O) + 2,
            Z = Math.max(0, X - D),
            G = H === "start" ? Math.min(4, Z) : Math.floor(Z / 2),
            f = Z - G,
            v = !z,
            V;
        if (K[0] !== $ || K[1] !== G) V = $.repeat(G), K[0] = $, K[1] = G, K[2] = V;
        else V = K[2];
        let k;
        if (K[3] !== O) k = us6.default.createElement(T, {
            dimColor: !0
        }, us6.default.createElement(v5, null, O)), K[3] = O, K[4] = k;
        else k = K[4];
        let N;
        if (K[5] !== $ || K[6] !== f) N = $.repeat(f), K[5] = $, K[6] = f, K[7] = N;
        else N = K[7];
        let R;
        if (K[8] !== z || K[9] !== v || K[10] !== V || K[11] !== k || K[12] !== N) R = us6.default.createElement(T, {
            color: z,
            dimColor: v
        }, V, " ", k, " ", N), K[8] = z, K[9] = v, K[10] = V, K[11] = k, K[12] = N, K[13] = R;
        else R = K[13];
        return R
    }
    let M = !z,
        P;
    if (K[14] !== $ || K[15] !== X) P = $.repeat(X), K[14] = $, K[15] = X, K[16] = P;
    else P = K[16];
    let W;
    if (K[17] !== z || K[18] !== M || K[19] !== P) W = us6.default.createElement(T, {
        color: z,
        dimColor: M
    }, P), K[17] = z, K[18] = M, K[19] = P, K[20] = W;
    else W = K[20];
    return W
}
// @from(Ln 202501, Col 4)
us6
// @from(Ln 202502, Col 4)
VR = L(() => {
    o6();
    A3();
    I4();
    n5();
    g6();
    us6 = K6(P6(), 1)
})
// @from(Ln 202511, Col 0)
function A_(q) {
    let K = s(9),
        {
            children: _,
            color: z
        } = q;
    if (bP()) {
        let w;
        if (K[0] !== _) w = ms6.default.createElement(u, {
            flexDirection: "column",
            paddingX: hB1,
            flexShrink: 0
        }, _), K[0] = _, K[1] = w;
        else w = K[1];
        return w
    }
    let Y;
    if (K[2] !== z) Y = ms6.default.createElement(zA, {
        color: z
    }), K[2] = z, K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== _) A = ms6.default.createElement(u, {
        flexDirection: "column",
        paddingX: LB1
    }, _), K[4] = _, K[5] = A;
    else A = K[5];
    let O;
    if (K[6] !== Y || K[7] !== A) O = ms6.default.createElement(u, {
        flexDirection: "column",
        paddingTop: 1
    }, Y, A), K[6] = Y, K[7] = A, K[8] = O;
    else O = K[8];
    return O
}
// @from(Ln 202546, Col 4)
ms6
// @from(Ln 202546, Col 9)
LB1 = 2
// @from(Ln 202547, Col 4)
hB1 = 1
// @from(Ln 202548, Col 4)
Bs6 = 2
// @from(Ln 202549, Col 4)
DJ = L(() => {
    o6();
    Mk();
    g6();
    VR();
    ms6 = K6(P6(), 1)
})
// @from(Ln 202557, Col 0)
function R1(q) {
    let K = s(27),
        {
            title: _,
            subtitle: z,
            children: Y,
            onCancel: A,
            color: O,
            hideInputGuide: w,
            hideBorder: $,
            inputGuide: j,
            isCancelActive: H
        } = q,
        J = O === void 0 ? "permission" : O,
        X = H === void 0 ? !0 : H,
        M = $3(void 0, void 0, X),
        P;
    if (K[0] !== X) P = {
        context: "Confirmation",
        isActive: X
    }, K[0] = X, K[1] = P;
    else P = K[1];
    G1("confirm:no", A, P);
    let W;
    if (K[2] !== M.keyName || K[3] !== M.pending) W = M.pending ? qy.default.createElement(T, null, "Press ", M.keyName, " again to exit") : qy.default.createElement(z1, null, qy.default.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), qy.default.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })), K[2] = M.keyName, K[3] = M.pending, K[4] = W;
    else W = K[4];
    let D = W,
        Z;
    if (K[5] !== J || K[6] !== _) Z = qy.default.createElement(T, {
        bold: !0,
        color: J
    }, _), K[5] = J, K[6] = _, K[7] = Z;
    else Z = K[7];
    let G;
    if (K[8] !== z) G = z && qy.default.createElement(T, {
        dimColor: !0
    }, z), K[8] = z, K[9] = G;
    else G = K[9];
    let f;
    if (K[10] !== Z || K[11] !== G) f = qy.default.createElement(u, {
        flexDirection: "column"
    }, Z, G), K[10] = Z, K[11] = G, K[12] = f;
    else f = K[12];
    let v;
    if (K[13] !== Y || K[14] !== f) v = qy.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, f, Y), K[13] = Y, K[14] = f, K[15] = v;
    else v = K[15];
    let V;
    if (K[16] !== D || K[17] !== M || K[18] !== w || K[19] !== j) V = !w && qy.default.createElement(u, {
        marginTop: 1
    }, qy.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, j ? j(M) : D)), K[16] = D, K[17] = M, K[18] = w, K[19] = j, K[20] = V;
    else V = K[20];
    let k;
    if (K[21] !== v || K[22] !== V) k = qy.default.createElement(qy.default.Fragment, null, v, V), K[21] = v, K[22] = V, K[23] = k;
    else k = K[23];
    let N = k;
    if ($) return N;
    let R;
    if (K[24] !== J || K[25] !== N) R = qy.default.createElement(A_, {
        color: J
    }, N), K[24] = J, K[25] = N, K[26] = R;
    else R = K[26];
    return R
}
// @from(Ln 202634, Col 4)
qy
// @from(Ln 202635, Col 4)
S4 = L(() => {
    o6();
    C$();
    g6();
    C7();
    bK();
    Nq();
    u7();
    DJ();
    qy = K6(P6(), 1)
})
// @from(Ln 202647, Col 0)
function wc_(q) {
    if (q.startsWith("file-")) return "+";
    if (q.startsWith("mcp-resource-")) return eH;
    if (q.startsWith("mcp-template")) return eH;
    if (q.startsWith("agent-")) return "*";
    return "+"
}
// @from(Ln 202655, Col 0)
function $c_(q) {
    return q.startsWith("file-") || q.startsWith("mcp-resource-") || q.startsWith("mcp-template") || q.startsWith("agent-")
}
// @from(Ln 202659, Col 0)
function ps6(q) {
    let K = s(28),
        {
            suggestions: _,
            selectedSuggestion: z,
            maxColumnWidth: Y,
            overlay: A,
            noPad: O
        } = q,
        {
            rows: w
        } = s1(),
        $ = A ? Oc_ : Math.min(6, Math.max(1, w - 3));
    if (_.length === 0) return null;
    let j;
    if (K[0] !== Y || K[1] !== _) j = Y ?? Math.max(..._.map(Jc_)) + 5, K[0] = Y, K[1] = _, K[2] = j;
    else j = K[2];
    let H = j,
        J = Math.max(0, Math.min(z - Math.floor($ / 2), _.length - $)),
        X = Math.min(J + $, _.length),
        M, P, W, D, Z;
    if (K[3] !== X || K[4] !== H || K[5] !== $ || K[6] !== O || K[7] !== A || K[8] !== z || K[9] !== J || K[10] !== _) {
        let v = _.slice(J, X);
        P = O ? 0 : Math.max(0, $ - v.length), M = u, W = "column", D = A ? void 0 : "flex-end";
        let V;
        if (K[16] !== H || K[17] !== z || K[18] !== _) V = (k) => Ef.createElement(jc_, {
            key: k.id,
            item: k,
            maxColumnWidth: H,
            isSelected: k.id === _[z]?.id
        }), K[16] = H, K[17] = z, K[18] = _, K[19] = V;
        else V = K[19];
        Z = v.map(V), K[3] = X, K[4] = H, K[5] = $, K[6] = O, K[7] = A, K[8] = z, K[9] = J, K[10] = _, K[11] = M, K[12] = P, K[13] = W, K[14] = D, K[15] = Z
    } else M = K[11], P = K[12], W = K[13], D = K[14], Z = K[15];
    let G;
    if (K[20] !== P) G = Array.from({
        length: P
    }, Hc_), K[20] = P, K[21] = G;
    else G = K[21];
    let f;
    if (K[22] !== M || K[23] !== W || K[24] !== D || K[25] !== Z || K[26] !== G) f = Ef.createElement(M, {
        flexDirection: W,
        justifyContent: D
    }, Z, G), K[22] = M, K[23] = W, K[24] = D, K[25] = Z, K[26] = G, K[27] = f;
    else f = K[27];
    return f
}
// @from(Ln 202707, Col 0)
function Hc_(q, K) {
    return Ef.createElement(T, {
        key: `pad-${K}`
    }, " ")
}
// @from(Ln 202713, Col 0)
function Jc_(q) {
    return N1(q.displayText)
}
// @from(Ln 202716, Col 4)
Ef
// @from(Ln 202716, Col 8)
RB1
// @from(Ln 202716, Col 13)
Oc_ = 5
// @from(Ln 202717, Col 4)
jc_
// @from(Ln 202717, Col 9)
Hj4