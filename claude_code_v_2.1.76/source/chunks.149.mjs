
// @from(Ln 378066, Col 0)
function o4() {
    let A = S5(),
        q = xA(),
        K = Yv6.useCallback(() => {
            q((_) => {
                let w = OBY(_.notifications.queue);
                if (_.notifications.current !== null || !w) return _;
                return xf = setTimeout((O, $, H) => {
                    xf = null, O((j) => {
                        if (j.notifications.current?.key !== $) return j;
                        return {
                            ...j,
                            notifications: {
                                queue: j.notifications.queue,
                                current: null
                            }
                        }
                    }), H()
                }, w.timeoutMs ?? gp8, q, w.key, K), {
                    ..._,
                    notifications: {
                        queue: _.notifications.queue.filter((O) => O !== w),
                        current: w
                    }
                }
            })
        }, [q]),
        Y = Yv6.useCallback((_) => {
            if (_.priority === "immediate") {
                if (xf) clearTimeout(xf), xf = null;
                xf = setTimeout((w, O, $) => {
                    xf = null, w((H) => {
                        if (H.notifications.current?.key !== O.key) return H;
                        return {
                            ...H,
                            notifications: {
                                queue: H.notifications.queue.filter((j) => !O.invalidates?.includes(j.key)),
                                current: null
                            }
                        }
                    }), $()
                }, _.timeoutMs ?? gp8, q, _, K), q((w) => ({
                    ...w,
                    notifications: {
                        current: _,
                        queue: [...w.notifications.current ? [w.notifications.current] : [], ...w.notifications.queue].filter((O) => O.priority !== "immediate" && !_.invalidates?.includes(O.key))
                    }
                }));
                return
            }
            q((w) => {
                if (_.fold) {
                    if (w.notifications.current?.key === _.key) {
                        let j = _.fold(w.notifications.current, _);
                        if (xf) clearTimeout(xf), xf = null;
                        return xf = setTimeout((J, M, D) => {
                            xf = null, J((X) => {
                                if (X.notifications.current?.key !== M) return X;
                                return {
                                    ...X,
                                    notifications: {
                                        queue: X.notifications.queue,
                                        current: null
                                    }
                                }
                            }), D()
                        }, j.timeoutMs ?? gp8, q, j.key, K), {
                            ...w,
                            notifications: {
                                current: j,
                                queue: w.notifications.queue
                            }
                        }
                    }
                    let H = w.notifications.queue.findIndex((j) => j.key === _.key);
                    if (H !== -1) {
                        let j = _.fold(w.notifications.queue[H], _),
                            J = [...w.notifications.queue];
                        return J[H] = j, {
                            ...w,
                            notifications: {
                                current: w.notifications.current,
                                queue: J
                            }
                        }
                    }
                }
                if (!(!new Set(w.notifications.queue.map((H) => H.key)).has(_.key) && w.notifications.current?.key !== _.key)) return w;
                return {
                    ...w,
                    notifications: {
                        current: w.notifications.current,
                        queue: [...w.notifications.queue.filter((H) => H.priority !== "immediate" && !_.invalidates?.includes(H.key)), _]
                    }
                }
            }), K()
        }, [q, K]),
        z = Yv6.useCallback((_) => {
            q((w) => {
                let O = w.notifications.current?.key === _,
                    $ = w.notifications.queue.some((H) => H.key === _);
                if (!O && !$) return w;
                if (O && xf) clearTimeout(xf), xf = null;
                return {
                    ...w,
                    notifications: {
                        current: O ? null : w.notifications.current,
                        queue: w.notifications.queue.filter((H) => H.key !== _)
                    }
                }
            }), K()
        }, [q, K]);
    return Yv6.useEffect(() => {
        if (A.getState().notifications.queue.length > 0) K()
    }, []), {
        addNotification: Y,
        removeNotification: z
    }
}
// @from(Ln 378186, Col 0)
function OBY(A) {
    if (A.length === 0) return;
    return A.reduce((q, K) => oKq[K.priority] < oKq[q.priority] ? K : q)
}
// @from(Ln 378190, Col 4)
Yv6
// @from(Ln 378190, Col 9)
gp8 = 8000
// @from(Ln 378191, Col 4)
xf = null
// @from(Ln 378192, Col 4)
oKq
// @from(Ln 378193, Col 4)
wz = E(() => {
    NA();
    Yv6 = t(P6(), 1);
    oKq = {
        immediate: 0,
        high: 1,
        medium: 2,
        low: 3
    }
})
// @from(Ln 378203, Col 4)
pp8 = {}
// @from(Ln 378220, Col 0)
function Fp8() {
    if (pi6) return pi6;
    if (process.platform !== "darwin") return null;
    try {
        if (process.env.MODIFIERS_NODE_PATH) pi6 = x6(process.env.MODIFIERS_NODE_PATH);
        else {
            let A = JBY(jBY(HBY(import.meta.url)), "..", "modifiers-napi", `${process.arch}-darwin`, "modifiers.node");
            pi6 = $BY(import.meta.url)(A)
        }
        return pi6
    } catch {
        return null
    }
}
// @from(Ln 378235, Col 0)
function MBY() {
    let A = Fp8();
    if (!A) return [];
    return A.getModifiers()
}
// @from(Ln 378241, Col 0)
function DBY(A) {
    let q = Fp8();
    if (!q) return !1;
    return q.isModifierPressed(A)
}
// @from(Ln 378247, Col 0)
function XBY() {
    Fp8()
}
// @from(Ln 378250, Col 4)
pi6 = null
// @from(Ln 378251, Col 4)
Qp8 = () => {}
// @from(Ln 378253, Col 0)
function sKq() {
    if (aKq || process.platform !== "darwin") return;
    aKq = !0;
    try {
        let {
            prewarm: A
        } = (Qp8(), k4(pp8));
        A()
    } catch {}
}
// @from(Ln 378264, Col 0)
function tKq(A) {
    if (process.platform !== "darwin") return !1;
    let {
        isModifierPressed: q
    } = (Qp8(), k4(pp8));
    return q(A)
}
// @from(Ln 378271, Col 4)
aKq = !1
// @from(Ln 378273, Col 0)
function eKq(A) {
    let q = new Map(A);
    return function(K) {
        return (q.get(K) ?? A5q)(K)
    }
}
// @from(Ln 378280, Col 0)
function zy1({
    value: A,
    onChange: q,
    onSubmit: K,
    onExit: Y,
    onExitMessage: z,
    onHistoryUp: _,
    onHistoryDown: w,
    onHistoryReset: O,
    onClearInput: $,
    mask: H = "",
    multiline: j = !1,
    cursorChar: J,
    invert: M,
    columns: D,
    onImagePaste: X,
    disableCursorMovementForUpDownKeys: P = !1,
    disableEscapeDoublePress: W = !1,
    externalOffset: Z,
    onOffsetChange: G,
    inputFilter: f,
    inlineGhostText: v,
    dim: N
}) {
    if (Q8.terminal === "Apple_Terminal") sKq();
    let V = Z,
        L = G,
        h = RK.fromText(A, D, V),
        {
            addNotification: R,
            removeNotification: u
        } = o4(),
        I = gC((a) => {
            z?.(a, "Ctrl-C")
        }, () => Y?.(), () => {
            if (A) q(""), L(0), O?.()
        }),
        g = gC((a) => {
            if (!A || !a) return;
            R({
                key: "escape-again-to-clear",
                text: "Esc again to clear",
                priority: "immediate",
                timeoutMs: 1000
            })
        }, () => {
            if (u("escape-again-to-clear"), $?.(), A) {
                if (A.trim() !== "") M36(A);
                q(""), L(0), O?.()
            }
        });

    function B() {
        if (A.trim() !== "") M36(A), O?.();
        return RK.fromText("", D, 0)
    }
    let b = gC((a) => {
        if (A !== "") return;
        z?.(a, "Ctrl-D")
    }, () => {
        if (A !== "") return;
        Y?.()
    });

    function p() {
        if (h.text === "") return b(), h;
        return h.del()
    }

    function Q() {
        let {
            cursor: a,
            killed: i
        } = h.deleteToLineEnd();
        return Sd(i, "append"), a
    }

    function U() {
        let {
            cursor: a,
            killed: i
        } = h.deleteToLineStart();
        return Sd(i, "prepend"), a
    }

    function r() {
        let {
            cursor: a,
            killed: i
        } = h.deleteWordBefore();
        return Sd(i, "prepend"), a
    }

    function e() {
        let a = qX1();
        if (a.length > 0) {
            let i = h.offset,
                l = h.insert(a);
            return KX1(i, a.length), l
        }
        return h
    }

    function Y6() {
        let a = YX1();
        if (!a) return h;
        let {
            text: i,
            start: l,
            length: q6
        } = a, w6 = h.text.slice(0, l), O6 = h.text.slice(l + q6), L6 = w6 + i + O6, y6 = l + i.length;
        return zX1(i.length), RK.fromText(L6, D, y6)
    }
    let H6 = eKq([
            ["a", () => h.startOfLine()],
            ["b", () => h.left()],
            ["c", I],
            ["d", p],
            ["e", () => h.endOfLine()],
            ["f", () => h.right()],
            ["h", () => h.deleteTokenBefore() ?? h.backspace()],
            ["k", Q],
            ["l", () => B()],
            ["n", () => X6()],
            ["p", () => s()],
            ["u", U],
            ["w", r],
            ["y", e]
        ]),
        J6 = eKq([
            ["b", () => h.prevWord()],
            ["f", () => h.nextWord()],
            ["d", () => h.deleteWordAfter()],
            ["y", Y6]
        ]);

    function K6(a) {
        if (j && h.offset > 0 && h.text[h.offset - 1] === "\\") return ET8(), h.backspace().insert(`
`);
        if (a.meta || a.shift) return h.insert(`
`);
        if (Q8.terminal === "Apple_Terminal" && tKq("shift")) return h.insert(`
`);
        K?.(A)
    }

    function s() {
        if (P) return _?.(), h;
        let a = h.up();
        if (!a.equals(h)) return a;
        if (j) {
            let i = h.upLogicalLine();
            if (!i.equals(h)) return i
        }
        return _?.(), h
    }

    function X6() {
        if (P) return w?.(), h;
        let a = h.down();
        if (!a.equals(h)) return a;
        if (j) {
            let i = h.downLogicalLine();
            if (!i.equals(h)) return i
        }
        return w?.(), h
    }

    function z6(a) {
        switch (!0) {
            case a.escape:
                return () => {
                    if (W) return h;
                    return g(), h
                };
            case (a.leftArrow && (a.ctrl || a.meta || a.fn)):
                return () => h.prevWord();
            case (a.rightArrow && (a.ctrl || a.meta || a.fn)):
                return () => h.nextWord();
            case a.backspace:
                return a.meta || a.ctrl ? r : () => h.deleteTokenBefore() ?? h.backspace();
            case a.delete:
                return a.meta ? Q : () => h.del();
            case a.ctrl:
                return H6;
            case a.home:
                return () => h.startOfLine();
            case a.end:
                return () => h.endOfLine();
            case a.pageDown:
                return () => h.endOfLine();
            case a.pageUp:
                return () => h.startOfLine();
            case a.wheelUp:
            case a.wheelDown:
                return A5q;
            case a.return:
                return () => K6(a);
            case a.meta:
                return J6;
            case a.tab:
                return () => h;
            case (a.upArrow && !a.shift):
                return s;
            case (a.downArrow && !a.shift):
                return X6;
            case a.leftArrow:
                return () => h.left();
            case a.rightArrow:
                return () => h.right();
            default:
                return function(i) {
                    switch (!0) {
                        case (i === "\x1B[H" || i === "\x1B[1~"):
                            return h.startOfLine();
                        case (i === "\x1B[F" || i === "\x1B[4~"):
                            return h.endOfLine();
                        default: {
                            let l = sY(i).replace(/(?<=[^\\\r\n])\r$/, "").replace(/\r/g, `
`);
                            if (h.isAtStart() && Q84(i)) return h.insert(l).left();
                            return h.insert(l)
                        }
                    }
                }
        }
    }

    function N6(a, i) {
        if (a.ctrl && (i === "k" || i === "u" || i === "w")) return !0;
        if (a.meta && (a.backspace || a.delete)) return !0;
        return !1
    }

    function $6(a, i) {
        return (a.ctrl || a.meta) && i === "y"
    }

    function n(a, i) {
        let l = f ? f(a, i) : a;
        if (l === "" && a !== "") return;
        if (!i.backspace && !i.delete && a.includes("")) {
            let w6 = (a.match(/\x7f/g) || []).length,
                O6 = h;
            for (let L6 = 0; L6 < w6; L6++) O6 = O6.deleteTokenBefore() ?? O6.backspace();
            if (!h.equals(O6)) {
                if (h.text !== O6.text) q(O6.text);
                L(O6.offset)
            }
            RF6(), hF6();
            return
        }
        if (!N6(i, l)) RF6();
        if (!$6(i, l)) hF6();
        let q6 = z6(i)(l);
        if (q6) {
            if (!h.equals(q6)) {
                if (h.text !== q6.text) q(q6.text);
                L(q6.offset)
            }
            if (l.length > 1 && l.endsWith("\r") && !l.slice(0, -1).includes("\r") && l[l.length - 2] !== "\\") K?.(q6.text)
        }
    }
    let o = v && N && v.insertPosition === V ? {
        text: v.text,
        dim: N
    } : void 0;
    return {
        onInput: n,
        renderedValue: h.render(J, H, M, o),
        offset: V,
        setOffset: L
    }
}
// @from(Ln 378554, Col 4)
A5q = () => {}
// @from(Ln 378555, Col 4)
Up8 = E(() => {
    LG();
    du6();
    j36();
    J36();
    ZI();
    wz();
    d3();
    Tb()
})
// @from(Ln 378569, Col 0)
function q5q({
    onPaste: A,
    onInput: q,
    onImagePaste: K
}) {
    let [Y, z] = _16.default.useState({
        chunks: [],
        timeoutId: null
    }), [_, w] = _16.default.useState(!1), O = _16.default.useRef(!0), $ = _16.default.useMemo(() => y8() === "macos", []);
    _16.default.useEffect(() => {
        return () => {
            O.current = !1
        }
    }, []);
    let H = _16.default.useCallback(() => {
            if (!K || !O.current) return;
            oZ6().then((D) => {
                if (D && O.current) K(D.base64, D.mediaType, void 0, D.dimensions)
            }).catch((D) => {
                if (O.current) _6(D)
            }).finally(() => {
                if (O.current) w(!1)
            })
        }, [K]),
        j = CX6(H, ZBY),
        J = _16.default.useCallback((D) => {
            if (D) clearTimeout(D);
            return setTimeout((X, P, W, Z, G, f) => {
                X(({
                    chunks: v
                }) => {
                    let N = v.join("").replace(/\[I$/, "").replace(/\[O$/, ""),
                        V = N.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((h) => h.split(`
`)).filter((h) => h.trim()),
                        L = V.filter((h) => PG1(h));
                    if (P && L.length > 0) {
                        let h = /\/TemporaryItems\/.*screencaptureui.*\/Screenshot/i.test(N);
                        return Promise.all(L.map((R) => rf4(R))).then((R) => {
                            let u = R.filter((I) => I !== null);
                            if (u.length > 0) {
                                for (let g of u) {
                                    let B = WBY(g.path);
                                    P(g.base64, g.mediaType, B, g.dimensions, g.path)
                                }
                                let I = V.filter((g) => !PG1(g));
                                if (I.length > 0 && W) W(I.join(`
`));
                                Z(!1)
                            } else if (h && f) G();
                            else {
                                if (W) W(N);
                                Z(!1)
                            }
                        }), {
                            chunks: [],
                            timeoutId: null
                        }
                    }
                    if (f && P && N.length === 0) return G(), {
                        chunks: [],
                        timeoutId: null
                    };
                    if (W) W(N);
                    return Z(!1), {
                        chunks: [],
                        timeoutId: null
                    }
                })
            }, GBY, z, K, A, w, j, $)
        }, [j, $, K, A]);
    return {
        wrappedOnInput: (D, X, P) => {
            let W = P.keypress.isPasted;
            if (W) w(!0);
            let Z = D.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((f) => f.split(`
`)).some((f) => PG1(f.trim()));
            if (W && D.length === 0 && $ && K) {
                j(), w(!1);
                return
            }
            if (A && (D.length > DG1 || Y.timeoutId || Z || W)) {
                z(({
                    chunks: f,
                    timeoutId: v
                }) => {
                    return {
                        chunks: [...f, D],
                        timeoutId: J(v)
                    }
                });
                return
            }
            if (q(D, X), D.length > 10) w(!1)
        },
        pasteState: Y,
        isPasting: _
    }
}
// @from(Ln 378667, Col 4)
_16
// @from(Ln 378667, Col 9)
ZBY = 50
// @from(Ln 378668, Col 4)
GBY = 100
// @from(Ln 378669, Col 4)
K5q = E(() => {
    Pv();
    aZ6();
    YK();
    k1();
    _16 = t(P6(), 1)
})
// @from(Ln 378677, Col 0)
function Y5q({
    placeholder: A,
    value: q,
    showCursor: K,
    focus: Y,
    terminalFocus: z = !0,
    invert: _ = O1.inverse,
    hidePlaceholderText: w = !1
}) {
    let O = void 0;
    if (A) {
        if (w) O = K && Y && z ? _(" ") : "";
        else if (O = O1.dim(A), K && Y && z) O = A.length > 0 ? _(A[0]) + O1.dim(A.slice(1)) : _(" ")
    }
    let $ = q.length === 0 && Boolean(A);
    return {
        renderedPlaceholder: O,
        showPlaceholder: $
    }
}
// @from(Ln 378697, Col 4)
z5q = E(() => {
    aK()
})
// @from(Ln 378701, Col 0)
function w5q(A, q) {
    if (q.length === 0) return [{
        text: A,
        start: 0
    }];
    let K = [...q].sort((_, w) => {
            if (_.start !== w.start) return _.start - w.start;
            return w.priority - _.priority
        }),
        Y = [],
        z = [];
    for (let _ of K) {
        if (_.start === _.end) continue;
        if (!z.some((O) => _.start >= O.start && _.start < O.end || _.end > O.start && _.end <= O.end || _.start <= O.start && _.end >= O.end)) Y.push(_), z.push({
            start: _.start,
            end: _.end
        })
    }
    return new O5q(A).segment(Y)
}
// @from(Ln 378721, Col 0)
class O5q {
    text;
    tokens;
    visiblePos = 0;
    stringPos = 0;
    tokenIdx = 0;
    charIdx = 0;
    codes = [];
    constructor(A) {
        this.text = A;
        this.tokens = MX6(A)
    }
    segment(A) {
        let q = [];
        for (let Y of A) {
            let z = this.segmentTo(Y.start);
            if (z) q.push(z);
            let _ = this.segmentTo(Y.end);
            if (_) _.highlight = Y, q.push(_)
        }
        let K = this.segmentTo(1 / 0);
        if (K) q.push(K);
        return q
    }
    segmentTo(A) {
        if (this.tokenIdx >= this.tokens.length || A <= this.visiblePos) return null;
        let q = this.visiblePos;
        while (this.tokenIdx < this.tokens.length) {
            let $ = this.tokens[this.tokenIdx];
            if ($.type !== "ansi") break;
            this.codes.push($), this.stringPos += $.code.length, this.tokenIdx++
        }
        let K = this.stringPos,
            Y = [...this.codes];
        while (this.visiblePos < A && this.tokenIdx < this.tokens.length) {
            let $ = this.tokens[this.tokenIdx];
            if ($.type === "ansi") this.codes.push($), this.stringPos += $.code.length, this.tokenIdx++;
            else {
                let H = A - this.visiblePos,
                    j = $.value.length - this.charIdx,
                    J = Math.min(H, j);
                if (this.stringPos += J, this.visiblePos += J, this.charIdx += J, this.charIdx >= $.value.length) this.tokenIdx++, this.charIdx = 0
            }
        }
        if (this.stringPos === K) return null;
        let z = _5q(Y),
            _ = _5q(this.codes);
        this.codes = _;
        let w = Dk(z),
            O = Dk(vK6(_));
        return {
            text: w + this.text.substring(K, this.stringPos) + O,
            start: q
        }
    }
}
// @from(Ln 378778, Col 0)
function _5q(A) {
    return Ys(A).filter((q) => q.code !== q.endCode)
}
// @from(Ln 378781, Col 4)
$5q = E(() => {
    DX6()
})
// @from(Ln 378785, Col 0)
function H5q(A) {
    let q = A6(23),
        {
            text: K,
            highlights: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) {
        let f = w5q(K, Y);
        z = [
            []
        ];
        let v = 0;
        for (let N of f) {
            let V = N.text.split(`
`);
            for (let L = 0; L < V.length; L++) {
                if (L > 0) z.push([]), v = v + 1;
                let h = V[L];
                if (h.length > 0) z[z.length - 1].push({
                    text: h,
                    highlight: N.highlight,
                    start: v
                });
                v = v + h.length
            }
        }
        q[0] = Y, q[1] = K, q[2] = z
    } else z = q[2];
    let _;
    if (q[3] !== Y) _ = Y.some(fBY), q[3] = Y, q[4] = _;
    else _ = q[4];
    let w = _,
        O = 0,
        $ = 1;
    if (w) {
        let f = 1 / 0,
            v = -1 / 0;
        if (q[5] !== v || q[6] !== Y || q[7] !== f) {
            for (let N of Y)
                if (N.shimmerColor) f = Math.min(f, N.start), v = Math.max(v, N.end);
            q[5] = v, q[6] = Y, q[7] = f, q[8] = f, q[9] = v
        } else f = q[8], v = q[9];
        O = f - 10, $ = v - f + 20
    }
    let H;
    if (q[10] !== $ || q[11] !== w || q[12] !== z || q[13] !== O) H = {
        lines: z,
        hasShimmer: w,
        sweepStart: O,
        cycleLength: $
    }, q[10] = $, q[11] = w, q[12] = z, q[13] = O, q[14] = H;
    else H = q[14];
    let {
        lines: j,
        hasShimmer: J,
        sweepStart: M,
        cycleLength: D
    } = H, [X, P] = gJ(J ? 50 : null), W = J ? M + Math.floor(P / 50) % D : -100, Z;
    if (q[15] !== W || q[16] !== j) {
        let f;
        if (q[18] !== W) f = (v, N) => OH.createElement(m, {
            key: N
        }, v.length === 0 ? OH.createElement(T, null, " ") : v.map((V, L) => {
            if (V.highlight?.shimmerColor && V.highlight.color) return OH.createElement(T, {
                key: L
            }, V.text.split("").map((h, R) => OH.createElement(CZ6, {
                key: R,
                char: h,
                index: V.start + R,
                glimmerIndex: W,
                messageColor: V.highlight.color,
                shimmerColor: V.highlight.shimmerColor
            })));
            if (V.highlight?.color) return OH.createElement(T, {
                key: L,
                color: V.highlight.color
            }, OH.createElement(wK, null, V.text));
            if (V.highlight?.dimColor) return OH.createElement(T, {
                key: L,
                dimColor: !0
            }, OH.createElement(wK, null, V.text));
            return OH.createElement(T, {
                key: L
            }, OH.createElement(wK, null, V.text))
        })), q[18] = W, q[19] = f;
        else f = q[19];
        Z = j.map(f), q[15] = W, q[16] = j, q[17] = Z
    } else Z = q[17];
    let G;
    if (q[20] !== X || q[21] !== Z) G = OH.createElement(m, {
        ref: X,
        flexDirection: "column"
    }, Z), q[20] = X, q[21] = Z, q[22] = G;
    else G = q[22];
    return G
}
// @from(Ln 378883, Col 0)
function fBY(A) {
    return A.shimmerColor
}
// @from(Ln 378886, Col 4)
OH
// @from(Ln 378887, Col 4)
j5q = E(() => {
    e6();
    i6();
    iQ6();
    $5q();
    OH = t(P6(), 1)
})
// @from(Ln 378895, Col 0)
function _y1(A) {
    let q = A6(9),
        {
            inputState: K,
            children: Y,
            terminalFocus: z,
            invert: _,
            hidePlaceholderText: w,
            ...O
        } = A,
        {
            onInput: $,
            renderedValue: H
        } = K,
        {
            wrappedOnInput: j,
            isPasting: J
        } = q5q({
            onPaste: O.onPaste,
            onInput: (I, g) => {
                if (M && g.return) return;
                $(I, g)
            },
            onImagePaste: O.onImagePaste
        }),
        M = J,
        {
            onIsPastingChange: D
        } = O;
    $F.default.useEffect(() => {
        if (D) D(M)
    }, [M, D]);
    let {
        showPlaceholder: X,
        renderedPlaceholder: P
    } = Y5q({
        placeholder: O.placeholder,
        value: O.value,
        showCursor: O.showCursor,
        focus: O.focus,
        terminalFocus: z,
        invert: _,
        hidePlaceholderText: w
    });
    jA(j, {
        isActive: O.focus
    });
    let W = O.value && O.value.trim().indexOf(" ") === -1 || O.value && O.value.endsWith(" "),
        Z = Boolean(O.argumentHint && O.value && W && O.value.startsWith("/")),
        G = O.showCursor && O.highlights ? O.highlights.filter((I) => I.dimColor || O.cursorOffset < I.start || O.cursorOffset >= I.end) : O.highlights;
    if (G && G.length > 0) return $F.default.createElement(m, null, $F.default.createElement(H5q, {
        text: H,
        highlights: G
    }), Z && $F.default.createElement(T, {
        dimColor: !0
    }, O.value?.endsWith(" ") ? "" : " ", O.argumentHint), Y);
    let v = m,
        N = T,
        V = "truncate-end",
        L = X && O.placeholderElement ? O.placeholderElement : X && P ? $F.default.createElement(wK, null, P) : $F.default.createElement(wK, null, H),
        h = Z && $F.default.createElement(T, {
            dimColor: !0
        }, O.value?.endsWith(" ") ? "" : " ", O.argumentHint),
        R;
    if (q[0] !== N || q[1] !== Y || q[2] !== O || q[3] !== L || q[4] !== h) R = $F.default.createElement(N, {
        wrap: V,
        dimColor: O.dimColor
    }, L, h, Y), q[0] = N, q[1] = Y, q[2] = O, q[3] = L, q[4] = h, q[5] = R;
    else R = q[5];
    let u;
    if (q[6] !== v || q[7] !== R) u = $F.default.createElement(v, null, R), q[6] = v, q[7] = R, q[8] = u;
    else u = q[8];
    return u
}
// @from(Ln 378969, Col 4)
$F
// @from(Ln 378970, Col 4)
dp8 = E(() => {
    e6();
    i6();
    K5q();
    z5q();
    j5q();
    $F = t(P6(), 1)
})
// @from(Ln 378978, Col 4)
wy1
// @from(Ln 378978, Col 9)
Oy1
// @from(Ln 378978, Col 14)
pwO
// @from(Ln 378978, Col 19)
QwO
// @from(Ln 378978, Col 24)
UwO
// @from(Ln 378978, Col 29)
cp8
// @from(Ln 378979, Col 4)
$y1 = E(() => {
    YK();
    wy1 = y8() === "macos" ? "opt" : "alt", Oy1 = y8() === "windows" ? {
        displayText: `${wy1}+v`,
        check: (A, q) => q.meta && (A === "v" || A === "V")
    } : {
        displayText: "ctrl+v",
        check: (A, q) => q.ctrl && (A === "v" || A === "V")
    }, pwO = {
        displayText: `${wy1}+p`,
        check: (A, q) => q.meta && (A === "p" || A === "P")
    }, QwO = {
        displayText: `${wy1}+t`,
        check: (A, q) => q.meta && (A === "t" || A === "T")
    }, UwO = {
        displayText: `${wy1}+o`,
        check: (A, q) => q.meta && (A === "o" || A === "O")
    }, cp8 = {
        "†": "alt+t",
        π: "alt+p",
        ø: "alt+o"
    }
})
// @from(Ln 379003, Col 0)
function Hy1(A, q) {
    let {
        addNotification: K
    } = o4(), Y = zv6.useRef(A), z = zv6.useRef(0), _ = zv6.useRef(null);
    zv6.useEffect(() => {
        let w = Y.current;
        if (Y.current = A, !q || !A || w) return;
        if (_.current) clearTimeout(_.current);
        return _.current = setTimeout(async (O, $, H) => {
            O.current = null;
            let j = Date.now();
            if (j - $.current < NBY) return;
            if (await lf4()) $.current = j, H({
                key: TBY,
                text: `Image in clipboard · ${Oy1.displayText} to paste`,
                priority: "immediate",
                timeoutMs: 8000
            })
        }, vBY, _, z, K), () => {
            if (_.current) clearTimeout(_.current), _.current = null
        }
    }, [A, q, K])
}
// @from(Ln 379026, Col 4)
zv6
// @from(Ln 379026, Col 9)
TBY = "clipboard-image-hint"
// @from(Ln 379027, Col 4)
vBY = 1000
// @from(Ln 379028, Col 4)
NBY = 30000
// @from(Ln 379029, Col 4)
lp8 = E(() => {
    wz();
    aZ6();
    $y1();
    zv6 = t(P6(), 1)
})
// @from(Ln 379036, Col 0)
function J5(A) {
    let [q] = z7(), K = p_(), z = Kj().prefersReducedMotion ?? !1, w = (M1((P) => P.voiceState) ?? "idle") === "recording", O = M1((P) => P.voiceAudioLevels) ?? [], $ = Qi6.useRef(Array(VBY).fill(0)), H = w && !z, [j, J] = gJ(H ? 50 : null);
    Hy1(K, !!A.onImagePaste);
    let M = K && !t6(process.env.CLAUDE_CODE_ACCESSIBILITY),
        D;
    if (!M) D = (P) => P;
    else if (w && !z) {
        let P = $.current,
            W = O.length > 0 ? O[O.length - 1] ?? 0 : 0,
            Z = Math.min(W * kBY, 1);
        P[0] = (P[0] ?? 0) * M5q + Z * (1 - M5q);
        let G = P[0] ?? 0,
            f = Math.max(1, Math.min(Math.round(G * (ip8.length - 1)), ip8.length - 1)),
            v = W < EBY,
            N = J / 1000 * 90 % 360,
            {
                r: V,
                g: L,
                b: h
            } = v ? {
                r: 128,
                g: 128,
                b: 128
            } : yZ1(N);
        D = () => O1.rgb(V, L, h)(ip8[f])
    } else D = O1.inverse;
    let X = zy1({
        value: A.value,
        onChange: A.onChange,
        onSubmit: A.onSubmit,
        onExit: A.onExit,
        onExitMessage: A.onExitMessage,
        onHistoryReset: A.onHistoryReset,
        onHistoryUp: A.onHistoryUp,
        onHistoryDown: A.onHistoryDown,
        onClearInput: A.onClearInput,
        focus: A.focus,
        mask: A.mask,
        multiline: A.multiline,
        cursorChar: A.showCursor ? " " : "",
        highlightPastedText: A.highlightPastedText,
        invert: D,
        themeText: kA("text", q),
        columns: A.columns,
        onImagePaste: A.onImagePaste,
        disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
        disableEscapeDoublePress: A.disableEscapeDoublePress,
        externalOffset: A.cursorOffset,
        onOffsetChange: A.onChangeCursorOffset,
        inlineGhostText: A.inlineGhostText,
        dim: O1.dim
    });
    return Qi6.default.createElement(m, {
        ref: j
    }, Qi6.default.createElement(_y1, {
        inputState: X,
        terminalFocus: K,
        highlights: A.highlights,
        invert: D,
        hidePlaceholderText: w,
        ...A
    }))
}
// @from(Ln 379099, Col 4)
Qi6
// @from(Ln 379099, Col 9)
ip8 = " ▁▂▃▄▅▆▇█"
// @from(Ln 379100, Col 4)
VBY = 1
// @from(Ln 379101, Col 4)
M5q = 0.7
// @from(Ln 379102, Col 4)
kBY = 1.8
// @from(Ln 379103, Col 4)
EBY = 0.15
// @from(Ln 379104, Col 4)
AH = E(() => {
    aK();
    Up8();
    dp8();
    lp8();
    i6();
    A8();
    NA();
    nI();
    Vc();
    Qi6 = t(P6(), 1)
})
// @from(Ln 379123, Col 0)
async function _v6(A, q) {
    if (!A) return {
        resultType: "emptyPath"
    };
    let K = LBY(L4(A));
    try {
        if (!(await RBY(K)).isDirectory()) return {
            resultType: "notADirectory",
            directoryPath: A,
            absolutePath: K
        }
    } catch (z) {
        let _ = z.code;
        if (_ === "ENOENT" || _ === "ENOTDIR" || _ === "EACCES" || _ === "EPERM") return {
            resultType: "pathNotFound",
            directoryPath: A,
            absolutePath: K
        };
        throw z
    }
    let Y = uW6(q);
    for (let z of Y)
        if (Iv(K, z)) return {
            resultType: "alreadyInWorkingDirectory",
            directoryPath: A,
            workingDir: z
        };
    return {
        resultType: "success",
        absolutePath: K
    }
}
// @from(Ln 379156, Col 0)
function wv6(A) {
    switch (A.resultType) {
        case "emptyPath":
            return "Please provide a directory path.";
        case "pathNotFound":
            return `Path ${O1.bold(A.absolutePath)} was not found.`;
        case "notADirectory": {
            let q = yBY(A.absolutePath);
            return `${O1.bold(A.directoryPath)} is not a directory. Did you mean to add the parent directory ${O1.bold(q)}?`
        }
        case "alreadyInWorkingDirectory":
            return `${O1.bold(A.directoryPath)} is already accessible within the existing working directory ${O1.bold(A.workingDir)}.`;
        case "success":
            return `Added ${O1.bold(A.absolutePath)} as a working directory.`
    }
}
// @from(Ln 379172, Col 4)
jy1 = E(() => {
    aK();
    RY();
    F9()
})
// @from(Ln 379184, Col 0)
function G5q(A, q) {
    if (!A) return {
        directory: q || G1(),
        prefix: ""
    };
    let K = L4(A, q);
    if (A.endsWith("/") || A.endsWith(Jy1)) return {
        directory: K,
        prefix: ""
    };
    let Y = hBY(K),
        z = SBY(A);
    return {
        directory: Y,
        prefix: z
    }
}
// @from(Ln 379201, Col 0)
async function CBY(A) {
    let q = D5q.get(A);
    if (q) return q;
    try {
        let z = (await $1().readdir(A)).filter((_) => _.isDirectory() && !_.name.startsWith(".")).map((_) => ({
            name: _.name,
            path: P5q(A, _.name),
            type: "directory"
        })).slice(0, 100);
        return D5q.set(A, z), z
    } catch (K) {
        return _6(K), []
    }
}
// @from(Ln 379215, Col 0)
async function My1(A, q = {}) {
    let {
        basePath: K = G1(),
        maxResults: Y = 10
    } = q, {
        directory: z,
        prefix: _
    } = G5q(A, K), w = await CBY(z), O = _.toLowerCase();
    return w.filter((H) => H.name.toLowerCase().startsWith(O)).slice(0, Y).map((H) => ({
        id: H.path,
        displayText: H.name + "/",
        description: "directory",
        metadata: {
            type: "directory"
        }
    }))
}
// @from(Ln 379233, Col 0)
function f5q(A) {
    return A.startsWith("~/") || A.startsWith("/") || A.startsWith("./") || A.startsWith("../") || A === "~" || A === "." || A === ".."
}
// @from(Ln 379236, Col 0)
async function IBY(A, q = !1) {
    let K = `${A}:${q}`,
        Y = X5q.get(K);
    if (Y) return Y;
    try {
        let w = (await $1().readdir(A)).filter((O) => q || !O.name.startsWith(".")).map((O) => ({
            name: O.name,
            path: P5q(A, O.name),
            type: O.isDirectory() ? "directory" : "file"
        })).sort((O, $) => {
            if (O.type === "directory" && $.type !== "directory") return -1;
            if (O.type !== "directory" && $.type === "directory") return 1;
            return O.name.localeCompare($.name)
        }).slice(0, 100);
        return X5q.set(K, w), w
    } catch (z) {
        return _6(z), []
    }
}
// @from(Ln 379255, Col 0)
async function T5q(A, q = {}) {
    let {
        basePath: K = G1(),
        maxResults: Y = 10,
        includeFiles: z = !0,
        includeHidden: _ = !1
    } = q, {
        directory: w,
        prefix: O
    } = G5q(A, K), $ = await IBY(w, _), H = O.toLowerCase(), j = $.filter((D) => {
        if (!z && D.type === "file") return !1;
        return D.name.toLowerCase().startsWith(H)
    }).slice(0, Y), J = A.includes("/") || A.includes(Jy1), M = "";
    if (J) {
        let D = A.lastIndexOf("/"),
            X = A.lastIndexOf(Jy1),
            P = Math.max(D, X);
        M = A.substring(0, P + 1)
    }
    if (M.startsWith("./") || M.startsWith("." + Jy1)) M = M.slice(2);
    return j.map((D) => {
        let X = M + D.name;
        return {
            id: X,
            displayText: D.type === "directory" ? X + "/" : X,
            metadata: {
                type: D.type
            }
        }
    })
}
// @from(Ln 379286, Col 4)
W5q = 500
// @from(Ln 379287, Col 4)
Z5q = 300000
// @from(Ln 379288, Col 4)
D5q
// @from(Ln 379288, Col 9)
X5q
// @from(Ln 379289, Col 4)
np8 = E(() => {
    I$6();
    lA();
    SA();
    k1();
    F9();
    D5q = new kT({
        max: W5q,
        ttl: Z5q
    }), X5q = new kT({
        max: W5q,
        ttl: Z5q
    })
})
// @from(Ln 379304, Col 0)
function bBY(A) {
    if (A.startsWith("file-")) return "+";
    if (A.startsWith("mcp-resource-")) return "◇";
    if (A.startsWith("agent-")) return "*";
    return "+"
}
// @from(Ln 379311, Col 0)
function xBY(A) {
    return A.startsWith("file-") || A.startsWith("mcp-resource-") || A.startsWith("agent-")
}
// @from(Ln 379315, Col 0)
function Ov6(A) {
    let q = A6(25),
        {
            suggestions: K,
            selectedSuggestion: Y,
            maxColumnWidth: z,
            overlay: _
        } = A,
        w = _ === void 0 ? !1 : _,
        {
            rows: O
        } = KA(),
        $ = Math.min(6, Math.max(1, O - 3));
    if (K.length === 0) return null;
    let H;
    if (q[0] !== z || q[1] !== K) H = z ?? Math.max(...K.map(mBY)) + 5, q[0] = z, q[1] = K, q[2] = H;
    else H = q[2];
    let j = H,
        J = Math.max(0, Math.min(Y - Math.floor($ / 2), K.length - $)),
        M = Math.min(J + $, K.length),
        D, X, P, W, Z;
    if (q[3] !== M || q[4] !== j || q[5] !== $ || q[6] !== w || q[7] !== Y || q[8] !== J || q[9] !== K) {
        let f = K.slice(J, M);
        D = m, X = "column", P = w ? $ : void 0, W = "flex-end";
        let v;
        if (q[15] !== j || q[16] !== Y || q[17] !== K) v = (N) => uf.createElement(uBY, {
            key: N.id,
            item: N,
            maxColumnWidth: j,
            isSelected: N.id === K[Y]?.id
        }), q[15] = j, q[16] = Y, q[17] = K, q[18] = v;
        else v = q[18];
        Z = f.map(v), q[3] = M, q[4] = j, q[5] = $, q[6] = w, q[7] = Y, q[8] = J, q[9] = K, q[10] = D, q[11] = X, q[12] = P, q[13] = W, q[14] = Z
    } else D = q[10], X = q[11], P = q[12], W = q[13], Z = q[14];
    let G;
    if (q[19] !== D || q[20] !== X || q[21] !== P || q[22] !== W || q[23] !== Z) G = uf.createElement(D, {
        flexDirection: X,
        minHeight: P,
        justifyContent: W
    }, Z), q[19] = D, q[20] = X, q[21] = P, q[22] = W, q[23] = Z, q[24] = G;
    else G = q[24];
    return G
}
// @from(Ln 379359, Col 0)
function mBY(A) {
    return f8(A.displayText)
}
// @from(Ln 379362, Col 4)
uf
// @from(Ln 379362, Col 8)
rp8
// @from(Ln 379362, Col 13)
uBY
// @from(Ln 379362, Col 18)
NOO
// @from(Ln 379363, Col 4)
op8 = E(() => {
    e6();
    i6();
    _q();
    M4();
    q3();
    uf = t(P6(), 1), rp8 = t(P6(), 1);
    uBY = rp8.memo(function(q) {
        let K = A6(36),
            {
                item: Y,
                maxColumnWidth: z,
                isSelected: _
            } = q,
            w = KA().columns;
        if (xBY(Y.id)) {
            let R;
            if (K[0] !== Y.id) R = bBY(Y.id), K[0] = Y.id, K[1] = R;
            else R = K[1];
            let u = R,
                I = _ ? "suggestion" : void 0,
                g = !_,
                B = Y.id.startsWith("file-"),
                b = Y.id.startsWith("mcp-resource-"),
                p = Y.description ? 3 : 0,
                Q;
            if (B) {
                let Y6;
                if (K[2] !== Y.description) Y6 = Y.description ? Math.min(20, f8(Y.description)) : 0, K[2] = Y.description, K[3] = Y6;
                else Y6 = K[3];
                let H6 = Y6,
                    J6 = w - 2 - 4 - p - H6,
                    K6;
                if (K[4] !== Y.displayText || K[5] !== J6) K6 = q91(Y.displayText, J6), K[4] = Y.displayText, K[5] = J6, K[6] = K6;
                else K6 = K[6];
                Q = K6
            } else if (b) {
                let Y6;
                if (K[7] !== Y.displayText) Y6 = jq(Y.displayText, 30), K[7] = Y.displayText, K[8] = Y6;
                else Y6 = K[8];
                Q = Y6
            } else Q = Y.displayText;
            let U = w - 2 - f8(Q) - p - 4,
                r;
            if (Y.description) {
                let Y6 = Math.max(0, U),
                    H6;
                if (K[9] !== Y.description || K[10] !== Y6) H6 = jq(Y.description, Y6), K[9] = Y.description, K[10] = Y6, K[11] = H6;
                else H6 = K[11];
                r = `${u} ${Q} – ${H6}`
            } else r = `${u} ${Q}`;
            let e;
            if (K[12] !== g || K[13] !== r || K[14] !== I) e = uf.createElement(T, {
                color: I,
                dimColor: g,
                wrap: "truncate"
            }, r), K[12] = g, K[13] = r, K[14] = I, K[15] = e;
            else e = K[15];
            return e
        }
        let $ = Math.floor(w * 0.4),
            H = Math.min(z ?? f8(Y.displayText) + 5, $),
            j = Y.color || (_ ? "suggestion" : void 0),
            J = !_,
            M = Y.displayText;
        if (f8(M) > H - 2) {
            let R = H - 2,
                u;
            if (K[16] !== M || K[17] !== R) u = jq(M, R), K[16] = M, K[17] = R, K[18] = u;
            else u = K[18];
            M = u
        }
        let D = M + " ".repeat(Math.max(0, H - f8(M))),
            X = Y.tag ? `[${Y.tag}] ` : "",
            P = f8(X),
            W = Math.max(0, w - H - P - 4),
            Z;
        if (K[19] !== W || K[20] !== Y.description) Z = Y.description ? jq(Y.description, W) : "", K[19] = W, K[20] = Y.description, K[21] = Z;
        else Z = K[21];
        let G = Z,
            f;
        if (K[22] !== D || K[23] !== J || K[24] !== j) f = uf.createElement(T, {
            color: j,
            dimColor: J
        }, D), K[22] = D, K[23] = J, K[24] = j, K[25] = f;
        else f = K[25];
        let v;
        if (K[26] !== X) v = X ? uf.createElement(T, {
            dimColor: !0
        }, X) : null, K[26] = X, K[27] = v;
        else v = K[27];
        let N = _ ? "suggestion" : void 0,
            V = !_,
            L;
        if (K[28] !== N || K[29] !== V || K[30] !== G) L = uf.createElement(T, {
            color: N,
            dimColor: V
        }, G), K[28] = N, K[29] = V, K[30] = G, K[31] = L;
        else L = K[31];
        let h;
        if (K[32] !== f || K[33] !== v || K[34] !== L) h = uf.createElement(T, null, f, v, L), K[32] = f, K[33] = v, K[34] = L, K[35] = h;
        else h = K[35];
        return h
    });
    NOO = rp8.memo(Ov6)
})
// @from(Ln 379470, Col 0)
function v5q() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Y5.createElement(T, {
        dimColor: !0
    }, "Claude Code will be able to read files in this directory and make edits when auto-accept edits is on."), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 379480, Col 0)
function gBY(A) {
    let q = A6(5),
        {
            path: K
        } = A,
        Y;
    if (q[0] !== K) Y = Y5.createElement(T, {
        color: "permission"
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = Y5.createElement(v5q, null), q[2] = z;
    else z = q[2];
    let _;
    if (q[3] !== Y) _ = Y5.createElement(m, {
        flexDirection: "column",
        paddingX: 2,
        gap: 1
    }, Y, z), q[3] = Y, q[4] = _;
    else _ = q[4];
    return _
}
// @from(Ln 379503, Col 0)
function FBY(A) {
    let q = A6(14),
        {
            value: K,
            onChange: Y,
            onSubmit: z,
            error: _,
            suggestions: w,
            selectedSuggestion: O
        } = A,
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = Y5.createElement(T, null, "Enter the path to the directory:"), q[0] = $;
    else $ = q[0];
    let H;
    if (q[1] !== Y || q[2] !== z || q[3] !== K) H = Y5.createElement(m, {
        borderDimColor: !0,
        borderStyle: "round",
        marginY: 1,
        paddingLeft: 1
    }, Y5.createElement(J5, {
        showCursor: !0,
        placeholder: `Directory path${a6.ellipsis}`,
        value: K,
        onChange: Y,
        onSubmit: z,
        columns: 80,
        cursorOffset: K.length,
        onChangeCursorOffset: pBY
    })), q[1] = Y, q[2] = z, q[3] = K, q[4] = H;
    else H = q[4];
    let j;
    if (q[5] !== O || q[6] !== w) j = w.length > 0 && Y5.createElement(m, {
        marginBottom: 1
    }, Y5.createElement(Ov6, {
        suggestions: w,
        selectedSuggestion: O
    })), q[5] = O, q[6] = w, q[7] = j;
    else j = q[7];
    let J;
    if (q[8] !== _) J = _ && Y5.createElement(T, {
        color: "error"
    }, _), q[8] = _, q[9] = J;
    else J = q[9];
    let M;
    if (q[10] !== H || q[11] !== j || q[12] !== J) M = Y5.createElement(m, {
        flexDirection: "column"
    }, $, H, j, J), q[10] = H, q[11] = j, q[12] = J, q[13] = M;
    else M = q[13];
    return M
}
// @from(Ln 379554, Col 0)
function pBY() {}
// @from(Ln 379556, Col 0)
function Ui6(A) {
    let q = A6(31),
        {
            onAddDirectory: K,
            onCancel: Y,
            permissionContext: z,
            directoryPath: _
        } = A,
        [w, O] = dz6.useState(""),
        [$, H] = dz6.useState(null),
        j;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = [], q[0] = j;
    else j = q[0];
    let [J, M] = dz6.useState(j), [D, X] = dz6.useState(0), P;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) P = async (p) => {
        if (!p) {
            M([]), X(0);
            return
        }
        let Q = await My1(p);
        M(Q), X(0)
    }, q[1] = P;
    else P = q[1];
    let Z = CX6(P, 100),
        G, f;
    if (q[2] !== Z || q[3] !== w) G = () => {
        Z(w)
    }, f = [w, Z], q[2] = Z, q[3] = w, q[4] = G, q[5] = f;
    else G = q[4], f = q[5];
    dz6.useEffect(G, f);
    let v;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) v = (p) => {
        let Q = p.id + "/";
        O(Q), H(null)
    }, q[6] = v;
    else v = q[6];
    let N = v,
        V;
    if (q[7] !== K || q[8] !== z) V = async (p) => {
        let Q = await _v6(p, z);
        if (Q.resultType === "success") K(Q.absolutePath, !1);
        else H(wv6(Q))
    }, q[7] = K, q[8] = z, q[9] = V;
    else V = q[9];
    let L = V,
        h;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) h = {
        context: "Settings"
    }, q[10] = h;
    else h = q[10];
    D8("confirm:no", Y, h);
    let R;
    if (q[11] !== L || q[12] !== D || q[13] !== J) R = (p, Q) => {
        if (J.length > 0) {
            if (Q.tab) {
                let U = J[D];
                if (U) N(U);
                return
            }
            if (Q.return) {
                let U = J[D];
                if (U) L(U.id + "/");
                return
            }
            if (Q.upArrow || Q.ctrl && p === "p") {
                X((U) => U <= 0 ? J.length - 1 : U - 1);
                return
            }
            if (Q.downArrow || Q.ctrl && p === "n") {
                X((U) => U >= J.length - 1 ? 0 : U + 1);
                return
            }
        }
    }, q[11] = L, q[12] = D, q[13] = J, q[14] = R;
    else R = q[14];
    jA(R);
    let u;
    if (q[15] !== _ || q[16] !== K || q[17] !== Y) u = (p) => {
        if (!_) return;
        let Q = p;
        A: switch (Q) {
            case "yes-session": {
                K(_, !1);
                break A
            }
            case "yes-remember": {
                K(_, !0);
                break A
            }
            case "no":
                Y()
        }
    }, q[15] = _, q[16] = K, q[17] = Y, q[18] = u;
    else u = q[18];
    let I = u,
        g = _ ? void 0 : QBY,
        B;
    if (q[19] !== w || q[20] !== _ || q[21] !== $ || q[22] !== I || q[23] !== L || q[24] !== D || q[25] !== J) B = _ ? Y5.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, Y5.createElement(gBY, {
        path: _
    }), Y5.createElement(T8, {
        options: BBY,
        onChange: I,
        onCancel: () => I("no")
    })) : Y5.createElement(m, {
        flexDirection: "column",
        gap: 1,
        marginX: 2
    }, Y5.createElement(v5q, null), Y5.createElement(FBY, {
        value: w,
        onChange: O,
        onSubmit: L,
        error: $,
        suggestions: J,
        selectedSuggestion: D
    })), q[19] = w, q[20] = _, q[21] = $, q[22] = I, q[23] = L, q[24] = D, q[25] = J, q[26] = B;
    else B = q[26];
    let b;
    if (q[27] !== Y || q[28] !== g || q[29] !== B) b = Y5.createElement(m8, {
        title: "Add directory to workspace",
        onCancel: Y,
        color: "permission",
        isCancelActive: !1,
        inputGuide: g
    }, B), q[27] = Y, q[28] = g, q[29] = B, q[30] = b;
    else b = q[30];
    return b
}
// @from(Ln 379687, Col 0)
function QBY(A) {
    return A.pending ? Y5.createElement(T, null, "Press ", A.keyName, " again to exit") : Y5.createElement(C8, null, Y5.createElement(a1, {
        shortcut: "Tab",
        action: "complete"
    }), Y5.createElement(a1, {
        shortcut: "Enter",
        action: "add"
    }), Y5.createElement(O8, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
    }))
}
// @from(Ln 379701, Col 4)
Y5
// @from(Ln 379701, Col 8)
dz6
// @from(Ln 379701, Col 13)
BBY
// @from(Ln 379702, Col 4)
ap8 = E(() => {
    e6();
    i6();
    _7();
    AH();
    jy1();
    b7();
    v3();
    np8();
    op8();
    Pv();
    wq();
    Lq();
    OK();
    Xq();
    Y5 = t(P6(), 1), dz6 = t(P6(), 1), BBY = [{
        value: "yes-session",
        label: "Yes, for this session"
    }, {
        value: "yes-remember",
        label: "Yes, and remember this directory"
    }, {
        value: "no",
        label: "No"
    }]
})
// @from(Ln 379728, Col 4)
V5q = {}
// @from(Ln 379733, Col 0)
function UBY(A) {
    let q = A6(10),
        {
            message: K,
            args: Y,
            onDone: z
        } = A,
        _, w;
    if (q[0] !== z) _ = () => {
        let j = setTimeout(z, 0);
        return () => clearTimeout(j)
    }, w = [z], q[0] = z, q[1] = _, q[2] = w;
    else _ = q[1], w = q[2];
    N5q.useEffect(_, w);
    let O;
    if (q[3] !== Y) O = w16.default.createElement(T, {
        dimColor: !0
    }, a6.pointer, " /add-dir ", Y), q[3] = Y, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] !== K) $ = w16.default.createElement(t1, null, w16.default.createElement(T, null, K)), q[5] = K, q[6] = $;
    else $ = q[6];
    let H;
    if (q[7] !== O || q[8] !== $) H = w16.default.createElement(m, {
        flexDirection: "column"
    }, O, $), q[7] = O, q[8] = $, q[9] = H;
    else H = q[9];
    return H
}
// @from(Ln 379762, Col 0)
async function dBY(A, q, K) {
    let Y = (K ?? "").trim(),
        z = q.getAppState(),
        _ = async (O, $ = !1) => {
            let j = {
                    type: "addDirectories",
                    directories: [O],
                    destination: $ ? "localSettings" : "session"
                },
                J = q.getAppState(),
                M = Ez(J.toolPermissionContext, j);
            q.setAppState((W) => ({
                ...W,
                toolPermissionContext: M
            }));
            let D = XT();
            if (!D.includes(O)) ak6([...D, O]);
            vA.refreshConfig();
            let X;
            if ($) try {
                Ym(j), X = `Added ${O1.bold(O)} as a working directory and saved to local settings`
            } catch (W) {
                X = `Added ${O1.bold(O)} as a working directory. Failed to save to local settings: ${W instanceof Error?W.message:"Unknown error"}`
            } else X = `Added ${O1.bold(O)} as a working directory for this session`;
            let P = `${X} ${O1.dim("· /permissions to manage")}`;
            A(P)
        };
    if (!Y) return w16.default.createElement(Ui6, {
        permissionContext: z.toolPermissionContext,
        onAddDirectory: _,
        onCancel: () => {
            A("Did not add a working directory.")
        }
    });
    let w = await _v6(Y, z.toolPermissionContext);
    if (w.resultType !== "success") {
        let O = wv6(w);
        return w16.default.createElement(UBY, {
            message: O,
            args: K ?? "",
            onDone: () => A(O)
        })
    }
    return w16.default.createElement(Ui6, {
        directoryPath: w.absolutePath,
        permissionContext: z.toolPermissionContext,
        onAddDirectory: _,
        onCancel: () => {
            A(`Did not add ${O1.bold(w.absolutePath)} as a working directory.`)
        }
    })
}
// @from(Ln 379814, Col 4)
w16
// @from(Ln 379814, Col 9)
N5q
// @from(Ln 379815, Col 4)
k5q = E(() => {
    e6();
    b7();
    aK();
    i6();
    ap8();
    iq();
    F$();
    Lz();
    T1();
    jy1();
    w16 = t(P6(), 1), N5q = t(P6(), 1)
})
// @from(Ln 379828, Col 4)
cBY
// @from(Ln 379828, Col 9)
E5q
// @from(Ln 379829, Col 4)
y5q = E(() => {
    cBY = {
        type: "local-jsx",
        name: "add-dir",
        description: "Add a new working directory",
        argumentHint: "<path>",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (k5q(), V5q)),
        userFacingName() {
            return "add-dir"
        }
    }, E5q = cBY
})
// @from(Ln 379843, Col 4)
L5q
// @from(Ln 379844, Col 4)
R5q = E(() => {
    L5q = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 379851, Col 4)
h5q = {}
// @from(Ln 379856, Col 0)
function lBY(A) {
    let q = A6(21),
        {
            question: K,
            context: Y,
            onDone: z
        } = A,
        [_, w] = $v6.useState(null),
        [O, $] = $v6.useState(null),
        [H, j] = $v6.useState(0),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = () => j(iBY), q[0] = J;
    else J = q[0];
    OX(J, _ || O ? null : 80);
    let M;
    if (q[1] !== z) M = (v, N) => {
        if (N.escape || N.return || v === " ") z(void 0, {
            display: "skip"
        })
    }, q[1] = z, q[2] = M;
    else M = q[2];
    jA(M);
    let D, X;
    if (q[3] !== Y || q[4] !== K) D = () => {
        let v = sK();
        return async function() {
            try {
                let L = await nBY(Y),
                    h = await wZ4({
                        question: K,
                        cacheSafeParams: L
                    });
                if (!v.signal.aborted)
                    if (h.response) w(h.response);
                    else $("No response received")
            } catch (L) {
                let h = L;
                if (!v.signal.aborted) $(h.message || "Failed to get response")
            }
        }(), () => {
            v.abort()
        }
    }, X = [K, Y], q[3] = Y, q[4] = K, q[5] = D, q[6] = X;
    else D = q[5], X = q[6];
    $v6.useEffect(D, X);
    let P;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) P = Ow.createElement(T, {
        color: "warning",
        bold: !0
    }, "/btw", " "), q[7] = P;
    else P = q[7];
    let W;
    if (q[8] !== K) W = Ow.createElement(m, null, P, Ow.createElement(T, {
        dimColor: !0
    }, K)), q[8] = K, q[9] = W;
    else W = q[9];
    let Z;
    if (q[10] !== O || q[11] !== H || q[12] !== _) Z = Ow.createElement(m, {
        marginTop: 1,
        marginLeft: 2
    }, O ? Ow.createElement(T, {
        color: "error"
    }, O) : _ ? Ow.createElement(U_, null, _) : Ow.createElement(m, null, Ow.createElement(nQ6, {
        frame: H,
        messageColor: "warning"
    }), Ow.createElement(T, {
        color: "warning"
    }, "Answering..."))), q[10] = O, q[11] = H, q[12] = _, q[13] = Z;
    else Z = q[13];
    let G;
    if (q[14] !== O || q[15] !== _) G = (_ || O) && Ow.createElement(m, {
        marginTop: 1
    }, Ow.createElement(T, {
        dimColor: !0
    }, "Press Space, Enter, or Escape to dismiss")), q[14] = O, q[15] = _, q[16] = G;
    else G = q[16];
    let f;
    if (q[17] !== W || q[18] !== Z || q[19] !== G) f = Ow.createElement(m, {
        flexDirection: "column",
        paddingLeft: 2,
        marginTop: 1
    }, W, Z, G), q[17] = W, q[18] = Z, q[19] = G, q[20] = f;
    else f = q[20];
    return f
}
// @from(Ln 379942, Col 0)
function iBY(A) {
    return A + 1
}
// @from(Ln 379945, Col 0)
async function nBY(A) {
    let q = Ky1();
    if (q) return {
        systemPrompt: q.systemPrompt,
        userContext: q.userContext,
        systemContext: q.systemContext,
        toolUseContext: A,
        forkContextMessages: A.messages
    };
    let [K, Y, z] = await Promise.all([R0(A.options.tools, A.options.mainLoopModel, [], A.options.mcpClients), a2(), mw()]);
    return {
        systemPrompt: uq(K),
        userContext: Y,
        systemContext: z,
        toolUseContext: A,
        forkContextMessages: A.messages
    }
}
// @from(Ln 379963, Col 0)
async function rBY(A, q, K) {
    let Y = K?.trim();
    if (!Y) return A("Usage: /btw <your question>", {
        display: "system"
    }), null;
    return d1((z) => ({
        ...z,
        btwUseCount: z.btwUseCount + 1
    })), Ow.createElement(lBY, {
        question: Y,
        context: q,
        onDone: A
    })
}
// @from(Ln 379977, Col 4)
Ow
// @from(Ln 379977, Col 8)
$v6
// @from(Ln 379978, Col 4)
S5q = E(() => {
    e6();
    i6();
    FZ6();
    A16();
    jE();
    bv();
    ov();
    LZ1();
    Pv();
    U$();
    k8();
    Ow = t(P6(), 1), $v6 = t(P6(), 1)
})
// @from(Ln 379992, Col 4)
oBY
// @from(Ln 379992, Col 9)
sp8
// @from(Ln 379993, Col 4)
C5q = E(() => {
    FZ6();
    oBY = {
        type: "local-jsx",
        name: "btw",
        description: "Ask a quick side question without interrupting the main conversation",
        isEnabled: () => F96(),
        isHidden: !1,
        immediate: !0,
        argumentHint: "<question>",
        load: () => Promise.resolve().then(() => (S5q(), h5q)),
        userFacingName() {
            return "btw"
        }
    }, sp8 = oBY
})
// @from(Ln 380009, Col 4)
I5q
// @from(Ln 380010, Col 4)
b5q = E(() => {
    I5q = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 380017, Col 4)
x5q
// @from(Ln 380018, Col 4)
u5q = E(() => {
    x5q = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 380029, Col 0)
function Fl(A) {
    let q = A;
    return q = q.replace(/"(sk-ant[^\s"']{24,})"/g, '"[REDACTED_API_KEY]"'), q = q.replace(/(?<![A-Za-z0-9"'])(sk-ant-?[A-Za-z0-9_-]{10,})(?![A-Za-z0-9"'])/g, "[REDACTED_API_KEY]"), q = q.replace(/AWS key: "(AWS[A-Z0-9]{20,})"/g, 'AWS key: "[REDACTED_AWS_KEY]"'), q = q.replace(/(AKIA[A-Z0-9]{16})/g, "[REDACTED_AWS_KEY]"), q = q.replace(/(?<![A-Za-z0-9])(AIza[A-Za-z0-9_-]{35})(?![A-Za-z0-9])/g, "[REDACTED_GCP_KEY]"), q = q.replace(/(?<![A-Za-z0-9])([a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com)(?![A-Za-z0-9])/g, "[REDACTED_GCP_SERVICE_ACCOUNT]"), q = q.replace(/(["']?x-api-key["']?\s*[:=]\s*["']?)[^"',\s)}\]]+/gi, "$1[REDACTED_API_KEY]"), q = q.replace(/(["']?authorization["']?\s*[:=]\s*["']?(bearer\s+)?)[^"',\s)}\]]+/gi, "$1[REDACTED_TOKEN]"), q = q.replace(/(AWS[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_AWS_VALUE]"), q = q.replace(/(GOOGLE[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_GCP_VALUE]"), q = q.replace(/((API[-_]?KEY|TOKEN|SECRET|PASSWORD)\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED]"), q
}
// @from(Ln 380034, Col 0)
function B5q() {
    return L$6().map((A) => {
        let q = {
            ...A
        };
        if (q && typeof q.error === "string") q.error = Fl(q.error);
        return q
    })
}
// @from(Ln 380043, Col 0)
async function tBY() {
    try {
        let A = Cz();
        return await aBY(A, "utf-8")
    } catch {
        return null
    }
}
// @from(Ln 380052, Col 0)
function F5q({
    abortSignal: A,
    messages: q,
    initialDescription: K,
    onDone: Y,
    backgroundTasks: z = {}
}) {
    let [_, w] = GE.useState("userInput"), [O, $] = GE.useState(0), [H, j] = GE.useState(K ?? ""), [J, M] = GE.useState(null), [D, X] = GE.useState(null), [P, W] = GE.useState({
        isGit: !1,
        gitState: null
    }), [Z, G] = GE.useState(null), f = KA().columns - 4;
    GE.useEffect(() => {
        async function V() {
            let L = await IH(),
                h = null;
            if (L) h = await R58();
            W({
                isGit: L,
                gitState: h
            })
        }
        V()
    }, []);
    let v = GE.useCallback(async () => {
            w("submitting"), X(null), M(null);
            let V = B5q(),
                h = bX(q)?.requestId ?? null,
                [R, u] = await Promise.all([AQ8(), tBY()]),
                I = ep8(z),
                g = {
                    ...R,
                    ...I
                },
                B = {
                    latestAssistantMessageId: h,
                    message_count: q.length,
                    datetime: new Date().toISOString(),
                    description: H,
                    platform: Q8.platform,
                    gitRepo: P.isGit,
                    terminal: Q8.terminal,
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.76",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-03-14T00:12:49Z"
                    }.VERSION,
                    transcript: cM(q),
                    errors: V,
                    lastApiRequest: Cu1(),
                    ...Object.keys(g).length > 0 && {
                        subagentTranscripts: g
                    },
                    ...u && {
                        rawTranscriptJsonl: u
                    }
                },
                [b, p] = await Promise.all([qgY(B, A), AgY(H, A)]);
            if (G(p), b.success) {
                if (b.feedbackId) M(b.feedbackId), d("tengu_bug_report_submitted", {
                    feedback_id: b.feedbackId,
                    last_assistant_message_id: h
                }), Hv6("tengu_bug_report_description", {
                    feedback_id: b.feedbackId,
                    description: Fl(H)
                });
                w("done")
            } else {
                if (b.isZdrOrg) X("Feedback collection is not available for organizations with custom data retention policies.");
                else X("Could not submit feedback. Please try again later.");
                w("userInput")
            }
        }, [H, P.isGit, q]),
        N = GE.useCallback(() => {
            if (_ === "done") {
                if (D) Y("Error submitting feedback / bug report", {
                    display: "system"
                });
                else Y("Feedback / bug report submitted", {
                    display: "system"
                });
                return
            }
            Y("Feedback / bug report cancelled", {
                display: "system"
            })
        }, [_, D, Y]);
    return D8("confirm:no", N, {
        context: "Settings",
        isActive: _ === "userInput"
    }), jA((V, L) => {
        if (_ === "done") {
            if (L.return && Z) {
                let h = eBY(J ?? "", Z, H, B5q());
                R9(h)
            }
            if (D) Y("Error submitting feedback / bug report", {
                display: "system"
            });
            else Y("Feedback / bug report submitted", {
                display: "system"
            });
            return
        }
        if (D && _ !== "userInput") {
            Y("Error submitting feedback / bug report", {
                display: "system"
            });
            return
        }
        if (_ === "consent" && (L.return || V === " ")) v()
    }), B7.createElement(m8, {
        title: "Submit Feedback / Bug Report",
        onCancel: N,
        isCancelActive: _ !== "userInput",
        inputGuide: (V) => V.pending ? B7.createElement(T, null, "Press ", V.keyName, " again to exit") : _ === "userInput" ? B7.createElement(C8, null, B7.createElement(a1, {
            shortcut: "Enter",
            action: "continue"
        }), B7.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })) : _ === "consent" ? B7.createElement(C8, null, B7.createElement(a1, {
            shortcut: "Enter",
            action: "submit"
        }), B7.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })) : null
    }, _ === "userInput" && B7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, B7.createElement(T, null, "Describe the issue below:"), B7.createElement(J5, {
        value: H,
        onChange: (V) => {
            if (j(V), D) X(null)
        },
        columns: f,
        onSubmit: () => w("consent"),
        onExitMessage: () => Y("Feedback cancelled", {
            display: "system"
        }),
        cursorOffset: O,
        onChangeCursorOffset: $,
        showCursor: !0
    }), D && B7.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, B7.createElement(T, {
        color: "error"
    }, D), B7.createElement(T, {
        dimColor: !0
    }, "Edit and press Enter to retry, or Esc to cancel"))), _ === "consent" && B7.createElement(m, {
        flexDirection: "column"
    }, B7.createElement(T, null, "This report will include:"), B7.createElement(m, {
        marginLeft: 2,
        flexDirection: "column"
    }, B7.createElement(T, null, "- Your feedback / bug description:", " ", B7.createElement(T, {
        dimColor: !0
    }, H)), B7.createElement(T, null, "- Environment info:", " ", B7.createElement(T, {
        dimColor: !0
    }, Q8.platform, ", ", Q8.terminal, ", v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION)), P.gitState && B7.createElement(T, null, "- Git repo metadata:", " ", B7.createElement(T, {
        dimColor: !0
    }, P.gitState.branchName, P.gitState.commitHash ? `, ${P.gitState.commitHash.slice(0,7)}` : "", P.gitState.remoteUrl ? ` @ ${P.gitState.remoteUrl}` : "", !P.gitState.isHeadOnRemote && ", not synced", !P.gitState.isClean && ", has local changes")), B7.createElement(T, null, "- Current session transcript")), B7.createElement(m, {
        marginTop: 1
    }, B7.createElement(T, {
        wrap: "wrap",
        dimColor: !0
    }, "We will use your feedback to debug related issues or to improve", " ", "Claude Code's functionality (eg. to reduce the risk of bugs occurring in the future).")), B7.createElement(m, {
        marginTop: 1
    }, B7.createElement(T, null, "Press ", B7.createElement(T, {
        bold: !0
    }, "Enter"), " to confirm and submit."))), _ === "submitting" && B7.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, B7.createElement(T, null, "Submitting report…")), _ === "done" && B7.createElement(m, {
        flexDirection: "column"
    }, D ? B7.createElement(T, {
        color: "error"
    }, D) : B7.createElement(T, {
        color: "success"
    }, "Thank you for your report!"), J && B7.createElement(T, {
        dimColor: !0
    }, "Feedback ID: ", J), B7.createElement(m, {
        marginTop: 1
    }, B7.createElement(T, null, "Press "), B7.createElement(T, {
        bold: !0
    }, "Enter "), B7.createElement(T, null, "to open your browser and draft a GitHub issue, or any other key to close."))))
}
// @from(Ln 380254, Col 0)
function eBY(A, q, K, Y) {
    let z = Fl(q),
        w = `**Bug Description**
${Fl(K)}

**Environment Info**
- Platform: ${Q8.platform}
- Terminal: ${Q8.terminal}
- Version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.VERSION||"unknown"}
- Feedback ID: ${A}

**Errors**
\`\`\`json
`,
        O = "\n```\n",
        $ = B6(Y),
        H = `${sBY}/new?title=${encodeURIComponent(z)}&labels=user-reported,bug&body=`,
        j = `
**Note:** Content was truncated.
`,
        J = encodeURIComponent(w),
        M = encodeURIComponent("\n```\n"),
        D = encodeURIComponent(`
**Note:** Content was truncated.
`),
        X = encodeURIComponent($),
        P = m5q - H.length - J.length - M.length - D.length;
    if (P <= 0) {
        let v = encodeURIComponent("…"),
            N = 50,
            V = m5q - H.length - v.length - D.length - 50,
            L = w + $ + "\n```\n",
            h = encodeURIComponent(L);
        if (h.length > V) {
            h = h.slice(0, V);
            let R = h.lastIndexOf("%");
            if (R >= h.length - 2) h = h.slice(0, R)
        }
        return H + h + v + D
    }
    if (X.length <= P) return H + J + X + M;
    let W = encodeURIComponent("…"),
        Z = 50,
        G = X.slice(0, P - W.length - Z),
        f = G.lastIndexOf("%");
    if (f >= G.length - 2) G = G.slice(0, f);
    return H + J + G + W + M + D
}
// @from(Ln 380302, Col 0)
async function AgY(A, q) {
    try {
        let K = await WX({
                systemPrompt: uq(["Generate a concise, technical issue title (max 80 chars) for a public GitHub issue based on this bug report for Claude Code.", "Claude Code is an agentic coding CLI based on the Anthropic API.", "The title should:", "- Include the type of issue [Bug] or [Feature Request] as the first thing in the title", "- Be concise, specific and descriptive of the actual problem", "- Use technical terminology appropriate for a software issue", '- For error messages, extract the key error (e.g., "Missing Tool Result Block" rather than the full message)', "- Be direct and clear for developers to understand the problem", '- If you cannot determine a clear issue, use "Bug Report: [brief description]"', "- Any LLM API errors are from the Anthropic API, not from any other model provider", "Your response will be directly used as the title of the Github issue, and as such should not contain any other commentary or explaination", 'Examples of good titles include: "[Bug] Auto-Compact triggers to soon", "[Bug] Anthropic API Error: Missing Tool Result Block", "[Bug] Error: Invalid Model Name for Opus"']),
                userPrompt: A,
                signal: q,
                options: {
                    hasAppendSystemPrompt: !1,
                    toolChoice: void 0,
                    isNonInteractiveSession: !1,
                    agents: [],
                    querySource: "feedback",
                    mcpTools: []
                }
            }),
            Y = K.message.content[0]?.type === "text" ? K.message.content[0].text : "Bug Report";
        if (Y.startsWith(j$)) return g5q(A);
        return Y
    } catch (K) {
        return _6(K), g5q(A)
    }
}
// @from(Ln 380325, Col 0)
function g5q(A) {
    let q = A.split(`
`)[0] || "";
    if (q.length <= 60 && q.length > 5) return q;
    let K = q.slice(0, 60);
    if (q.length > 60) {
        let Y = K.lastIndexOf(" ");
        if (Y > 30) K = K.slice(0, Y);
        K += "..."
    }
    return K.length < 10 ? "Bug Report" : K
}
// @from(Ln 380338, Col 0)
function Dy1(A) {
    if (A instanceof Error) {
        let q = Error(Fl(A.message));
        if (A.stack) q.stack = Fl(A.stack);
        _6(q)
    } else {
        let q = Fl(String(A));
        _6(Error(q))
    }
}
// @from(Ln 380348, Col 0)
async function qgY(A, q) {
    try {
        await dz();
        let K = QO();
        if (K.error) return {
            success: !1
        };
        let Y = {
                "Content-Type": "application/json",
                "User-Agent": Gy(),
                ...K.headers
            },
            z = await X8.post("https://api.anthropic.com/api/claude_cli_feedback", {
                content: B6(A)
            }, {
                headers: Y,
                timeout: 30000,
                signal: q
            });
        if (z.status === 200) {
            let _ = z.data;
            if (_?.feedback_id) return {
                success: !0,
                feedbackId: _.feedback_id
            };
            return Dy1(Error("Failed to submit feedback: request did not return feedback_id")), {
                success: !1
            }
        }
        return Dy1(Error("Failed to submit feedback:" + z.status)), {
            success: !1
        }
    } catch (K) {
        if (X8.isCancel(K)) return {
            success: !1
        };
        if (X8.isAxiosError(K) && K.response?.status === 403) {
            let Y = K.response.data;
            if (Y?.error?.type === "permission_error" && Y?.error?.message?.includes("Custom data retention settings")) return Dy1(Error("Cannot submit feedback because custom data retention settings are enabled")), {
                success: !1,
                isZdrOrg: !0
            }
        }
        return Dy1(K), {
            success: !1
        }
    }
}
// @from(Ln 380396, Col 4)
B7
// @from(Ln 380396, Col 8)
GE
// @from(Ln 380396, Col 12)
m5q = 7250
// @from(Ln 380397, Col 4)
sBY = "https://github.com/anthropics/claude-code/issues"
// @from(Ln 380398, Col 4)
tp8 = E(() => {
    i6();
    _7();
    AH();
    k1();
    d3();
    $5();
    _q();
    RM();
    fA();
    V1();
    n96();
    gw();
    yB();
    kX();
    kK();
    JA();
    T1();
    Oq();
    g1();
    wq();
    Lq();
    Xq();
    OK();
    B7 = t(P6(), 1), GE = t(P6(), 1)
})
// @from(Ln 380424, Col 4)
Q5q = {}
// @from(Ln 380430, Col 0)
function p5q(A, q, K, Y = "", z = {}) {
    return qQ8.createElement(F5q, {
        abortSignal: q,
        messages: K,
        initialDescription: Y,
        onDone: A,
        backgroundTasks: z
    })
}
// @from(Ln 380439, Col 0)
async function KgY(A, q, K) {
    let Y = K || "";
    return p5q(A, q.abortController.signal, q.messages, Y)
}
// @from(Ln 380443, Col 4)
qQ8
// @from(Ln 380444, Col 4)
U5q = E(() => {
    tp8();
    qQ8 = t(P6(), 1)
})
// @from(Ln 380448, Col 4)
YgY
// @from(Ln 380448, Col 9)
KQ8
// @from(Ln 380449, Col 4)
d5q = E(() => {
    A8();
    AN();
    YgY = {
        aliases: ["bug"],
        type: "local-jsx",
        name: "feedback",
        description: "Submit feedback about Claude Code",
        argumentHint: "[report]",
        isEnabled: () => !(t6(process.env.CLAUDE_CODE_USE_BEDROCK) || t6(process.env.CLAUDE_CODE_USE_VERTEX) || t6(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_FEEDBACK_COMMAND || process.env.DISABLE_BUG_COMMAND || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC || !1 || !qD("allow_product_feedback")),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (U5q(), Q5q)),
        userFacingName() {
            return "feedback"
        }
    }, KQ8 = YgY
})
// @from(Ln 380467, Col 0)
function pl(A) {
    return !Array.isArray ? s5q(A) === "[object Array]" : Array.isArray(A)
}
// @from(Ln 380471, Col 0)
function _gY(A) {
    if (typeof A == "string") return A;
    let q = A + "";
    return q == "0" && 1 / A == -zgY ? "-0" : q
}
// @from(Ln 380477, Col 0)
function wgY(A) {
    return A == null ? "" : _gY(A)
}
// @from(Ln 380481, Col 0)
function HF(A) {
    return typeof A === "string"
}
// @from(Ln 380485, Col 0)
function o5q(A) {
    return typeof A === "number"
}
// @from(Ln 380489, Col 0)
function OgY(A) {
    return A === !0 || A === !1 || $gY(A) && s5q(A) == "[object Boolean]"
}
// @from(Ln 380493, Col 0)
function a5q(A) {
    return typeof A === "object"
}
// @from(Ln 380497, Col 0)
function $gY(A) {
    return a5q(A) && A !== null
}
// @from(Ln 380501, Col 0)
function fE(A) {
    return A !== void 0 && A !== null
}
// @from(Ln 380505, Col 0)
function YQ8(A) {
    return !A.trim().length
}
// @from(Ln 380509, Col 0)
function s5q(A) {
    return A == null ? A === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(A)
}
// @from(Ln 380512, Col 0)
class t5q {
    constructor(A) {
        this._keys = [], this._keyMap = {};
        let q = 0;
        A.forEach((K) => {
            let Y = e5q(K);
            this._keys.push(Y), this._keyMap[Y.id] = Y, q += Y.weight
        }), this._keys.forEach((K) => {
            K.weight /= q
        })
    }
    get(A) {
        return this._keyMap[A]
    }
    keys() {
        return this._keys
    }
    toJSON() {
        return JSON.stringify(this._keys)
    }
}
// @from(Ln 380534, Col 0)
function e5q(A) {
    let q = null,
        K = null,
        Y = null,
        z = 1,
        _ = null;
    if (HF(A) || pl(A)) Y = A, q = l5q(A), K = zQ8(A);
    else {
        if (!c5q.call(A, "name")) throw Error(MgY("name"));
        let w = A.name;
        if (Y = w, c5q.call(A, "weight")) {
            if (z = A.weight, z <= 0) throw Error(DgY(w))
        }
        q = l5q(w), K = zQ8(w), _ = A.getFn
    }
    return {
        path: q,
        id: K,
        weight: z,
        src: Y,
        getFn: _
    }
}
// @from(Ln 380558, Col 0)
function l5q(A) {
    return pl(A) ? A : A.split(".")
}
// @from(Ln 380562, Col 0)
function zQ8(A) {
    return pl(A) ? A.join(".") : A
}
// @from(Ln 380566, Col 0)
function XgY(A, q) {
    let K = [],
        Y = !1,
        z = (_, w, O) => {
            if (!fE(_)) return;
            if (!w[O]) K.push(_);
            else {
                let $ = w[O],
                    H = _[$];
                if (!fE(H)) return;
                if (O === w.length - 1 && (HF(H) || o5q(H) || OgY(H))) K.push(wgY(H));
                else if (pl(H)) {
                    Y = !0;
                    for (let j = 0, J = H.length; j < J; j += 1) z(H[j], w, O + 1)
                } else if (w.length) z(H, w, O + 1)
            }
        };
    return z(A, HF(q) ? q.split(".") : q, 0), Y ? K : K[0]
}
// @from(Ln 380586, Col 0)
function TgY(A = 1, q = 3) {
    let K = new Map,
        Y = Math.pow(10, q);
    return {
        get(z) {
            let _ = z.match(fgY).length;
            if (K.has(_)) return K.get(_);
            let w = 1 / Math.pow(_, 0.5 * A),
                O = parseFloat(Math.round(w * Y) / Y);
            return K.set(_, O), O
        },
        clear() {
            K.clear()
        }
    }
}
// @from(Ln 380602, Col 0)
class Wy1 {
    constructor({
        getFn: A = V5.getFn,
        fieldNormWeight: q = V5.fieldNormWeight
    } = {}) {
        this.norm = TgY(q, 3), this.getFn = A, this.isCreated = !1, this.setIndexRecords()
    }
    setSources(A = []) {
        this.docs = A
    }
    setIndexRecords(A = []) {
        this.records = A
    }
    setKeys(A = []) {
        this.keys = A, this._keysMap = {}, A.forEach((q, K) => {
            this._keysMap[q.id] = K
        })
    }
    create() {
        if (this.isCreated || !this.docs.length) return;
        if (this.isCreated = !0, HF(this.docs[0])) this.docs.forEach((A, q) => {
            this._addString(A, q)
        });
        else this.docs.forEach((A, q) => {
            this._addObject(A, q)
        });
        this.norm.clear()
    }
    add(A) {
        let q = this.size();
        if (HF(A)) this._addString(A, q);
        else this._addObject(A, q)
    }
    removeAt(A) {
        this.records.splice(A, 1);
        for (let q = A, K = this.size(); q < K; q += 1) this.records[q].i -= 1
    }
    getValueForItemAtKeyId(A, q) {
        return A[this._keysMap[q]]
    }
    size() {
        return this.records.length
    }
    _addString(A, q) {
        if (!fE(A) || YQ8(A)) return;
        let K = {
            v: A,
            i: q,
            n: this.norm.get(A)
        };
        this.records.push(K)
    }
    _addObject(A, q) {
        let K = {
            i: q,
            $: {}
        };
        this.keys.forEach((Y, z) => {
            let _ = Y.getFn ? Y.getFn(A) : this.getFn(A, Y.path);
            if (!fE(_)) return;
            if (pl(_)) {
                let w = [],
                    O = [{
                        nestedArrIndex: -1,
                        value: _
                    }];
                while (O.length) {
                    let {
                        nestedArrIndex: $,
                        value: H
                    } = O.pop();
                    if (!fE(H)) continue;
                    if (HF(H) && !YQ8(H)) {
                        let j = {
                            v: H,
                            i: $,
                            n: this.norm.get(H)
                        };
                        w.push(j)
                    } else if (pl(H)) H.forEach((j, J) => {
                        O.push({
                            nestedArrIndex: J,
                            value: j
                        })
                    })
                }
                K.$[z] = w
            } else if (HF(_) && !YQ8(_)) {
                let w = {
                    v: _,
                    n: this.norm.get(_)
                };
                K.$[z] = w
            }
        }), this.records.push(K)
    }
    toJSON() {
        return {
            keys: this.keys,
            records: this.records
        }
    }
}
// @from(Ln 380706, Col 0)
function A3q(A, q, {
    getFn: K = V5.getFn,
    fieldNormWeight: Y = V5.fieldNormWeight
} = {}) {
    let z = new Wy1({
        getFn: K,
        fieldNormWeight: Y
    });
    return z.setKeys(A.map(e5q)), z.setSources(q), z.create(), z
}
// @from(Ln 380717, Col 0)
function vgY(A, {
    getFn: q = V5.getFn,
    fieldNormWeight: K = V5.fieldNormWeight
} = {}) {
    let {
        keys: Y,
        records: z
    } = A, _ = new Wy1({
        getFn: q,
        fieldNormWeight: K
    });
    return _.setKeys(Y), _.setIndexRecords(z), _
}
// @from(Ln 380731, Col 0)
function Xy1(A, {
    errors: q = 0,
    currentLocation: K = 0,
    expectedLocation: Y = 0,
    distance: z = V5.distance,
    ignoreLocation: _ = V5.ignoreLocation
} = {}) {
    let w = q / A.length;
    if (_) return w;
    let O = Math.abs(Y - K);
    if (!z) return O ? 1 : w;
    return w + O / z
}
// @from(Ln 380745, Col 0)
function NgY(A = [], q = V5.minMatchCharLength) {
    let K = [],
        Y = -1,
        z = -1,
        _ = 0;
    for (let w = A.length; _ < w; _ += 1) {
        let O = A[_];
        if (O && Y === -1) Y = _;
        else if (!O && Y !== -1) {
            if (z = _ - 1, z - Y + 1 >= q) K.push([Y, z]);
            Y = -1
        }
    }
    if (A[_ - 1] && _ - Y >= q) K.push([Y, _ - 1]);
    return K
}
// @from(Ln 380762, Col 0)
function VgY(A, q, K, {
    location: Y = V5.location,
    distance: z = V5.distance,
    threshold: _ = V5.threshold,
    findAllMatches: w = V5.findAllMatches,
    minMatchCharLength: O = V5.minMatchCharLength,
    includeMatches: $ = V5.includeMatches,
    ignoreLocation: H = V5.ignoreLocation
} = {}) {
    if (q.length > cz6) throw Error(JgY(cz6));
    let j = q.length,
        J = A.length,
        M = Math.max(0, Math.min(Y, J)),
        D = _,
        X = M,
        P = O > 1 || $,
        W = P ? Array(J) : [],
        Z;
    while ((Z = A.indexOf(q, X)) > -1) {
        let L = Xy1(q, {
            currentLocation: Z,
            expectedLocation: M,
            distance: z,
            ignoreLocation: H
        });
        if (D = Math.min(L, D), X = Z + j, P) {
            let h = 0;
            while (h < j) W[Z + h] = 1, h += 1
        }
    }
    X = -1;
    let G = [],
        f = 1,
        v = j + J,
        N = 1 << j - 1;
    for (let L = 0; L < j; L += 1) {
        let h = 0,
            R = v;
        while (h < R) {
            if (Xy1(q, {
                    errors: L,
                    currentLocation: M + R,
                    expectedLocation: M,
                    distance: z,
                    ignoreLocation: H
                }) <= D) h = R;
            else v = R;
            R = Math.floor((v - h) / 2 + h)
        }
        v = R;
        let u = Math.max(1, M - R + 1),
            I = w ? J : Math.min(M + R, J) + j,
            g = Array(I + 2);
        g[I + 1] = (1 << L) - 1;
        for (let b = I; b >= u; b -= 1) {
            let p = b - 1,
                Q = K[A.charAt(p)];
            if (P) W[p] = +!!Q;
            if (g[b] = (g[b + 1] << 1 | 1) & Q, L) g[b] |= (G[b + 1] | G[b]) << 1 | 1 | G[b + 1];
            if (g[b] & N) {
                if (f = Xy1(q, {
                        errors: L,
                        currentLocation: p,
                        expectedLocation: M,
                        distance: z,
                        ignoreLocation: H
                    }), f <= D) {
                    if (D = f, X = p, X <= M) break;
                    u = Math.max(1, 2 * M - X)
                }
            }
        }
        if (Xy1(q, {
                errors: L + 1,
                currentLocation: M,
                expectedLocation: M,
                distance: z,
                ignoreLocation: H
            }) > D) break;
        G = g
    }
    let V = {
        isMatch: X >= 0,
        score: Math.max(0.001, f)
    };
    if (P) {
        let L = NgY(W, O);
        if (!L.length) V.isMatch = !1;
        else if ($) V.indices = L
    }
    return V
}
// @from(Ln 380855, Col 0)
function kgY(A) {
    let q = {};
    for (let K = 0, Y = A.length; K < Y; K += 1) {
        let z = A.charAt(K);
        q[z] = (q[z] || 0) | 1 << Y - K - 1
    }
    return q
}
// @from(Ln 380863, Col 0)
class jQ8 {
    constructor(A, {
        location: q = V5.location,
        threshold: K = V5.threshold,
        distance: Y = V5.distance,
        includeMatches: z = V5.includeMatches,
        findAllMatches: _ = V5.findAllMatches,
        minMatchCharLength: w = V5.minMatchCharLength,
        isCaseSensitive: O = V5.isCaseSensitive,
        ignoreLocation: $ = V5.ignoreLocation
    } = {}) {
        if (this.options = {
                location: q,
                threshold: K,
                distance: Y,
                includeMatches: z,
                findAllMatches: _,
                minMatchCharLength: w,
                isCaseSensitive: O,
                ignoreLocation: $
            }, this.pattern = O ? A : A.toLowerCase(), this.chunks = [], !this.pattern.length) return;
        let H = (J, M) => {
                this.chunks.push({
                    pattern: J,
                    alphabet: kgY(J),
                    startIndex: M
                })
            },
            j = this.pattern.length;
        if (j > cz6) {
            let J = 0,
                M = j % cz6,
                D = j - M;
            while (J < D) H(this.pattern.substr(J, cz6), J), J += cz6;
            if (M) {
                let X = j - cz6;
                H(this.pattern.substr(X), X)
            }
        } else H(this.pattern, 0)
    }
    searchIn(A) {
        let {
            isCaseSensitive: q,
            includeMatches: K
        } = this.options;
        if (!q) A = A.toLowerCase();
        if (this.pattern === A) {
            let D = {
                isMatch: !0,
                score: 0
            };
            if (K) D.indices = [
                [0, A.length - 1]
            ];
            return D
        }
        let {
            location: Y,
            distance: z,
            threshold: _,
            findAllMatches: w,
            minMatchCharLength: O,
            ignoreLocation: $
        } = this.options, H = [], j = 0, J = !1;
        this.chunks.forEach(({
            pattern: D,
            alphabet: X,
            startIndex: P
        }) => {
            let {
                isMatch: W,
                score: Z,
                indices: G
            } = VgY(A, D, X, {
                location: Y + P,
                distance: z,
                threshold: _,
                findAllMatches: w,
                minMatchCharLength: O,
                includeMatches: K,
                ignoreLocation: $
            });
            if (W) J = !0;
            if (j += Z, W && G) H = [...H, ...G]
        });
        let M = {
            isMatch: J,
            score: J ? j / this.chunks.length : 1
        };
        if (J && K) M.indices = H;
        return M
    }
}
// @from(Ln 380956, Col 0)
class Ql {
    constructor(A) {
        this.pattern = A
    }
    static isMultiMatch(A) {
        return i5q(A, this.multiRegex)
    }
    static isSingleMatch(A) {
        return i5q(A, this.singleRegex)
    }
    search() {}
}
// @from(Ln 380969, Col 0)
function i5q(A, q) {
    let K = A.match(q);
    return K ? K[1] : null
}
// @from(Ln 380974, Col 0)
function LgY(A, q = {}) {
    return A.split(ygY).map((K) => {
        let Y = K.trim().split(EgY).filter((_) => _ && !!_.trim()),
            z = [];
        for (let _ = 0, w = Y.length; _ < w; _ += 1) {
            let O = Y[_],
                $ = !1,
                H = -1;
            while (!$ && ++H < n5q) {
                let j = _Q8[H],
                    J = j.isMultiMatch(O);
                if (J) z.push(new j(J, q)), $ = !0
            }
            if ($) continue;
            H = -1;
            while (++H < n5q) {
                let j = _Q8[H],
                    J = j.isSingleMatch(O);
                if (J) {
                    z.push(new j(J, q));
                    break
                }
            }
        }
        return z
    })
}
// @from(Ln 381001, Col 0)
class O3q {
    constructor(A, {
        isCaseSensitive: q = V5.isCaseSensitive,
        includeMatches: K = V5.includeMatches,
        minMatchCharLength: Y = V5.minMatchCharLength,
        ignoreLocation: z = V5.ignoreLocation,
        findAllMatches: _ = V5.findAllMatches,
        location: w = V5.location,
        threshold: O = V5.threshold,
        distance: $ = V5.distance
    } = {}) {
        this.query = null, this.options = {
            isCaseSensitive: q,
            includeMatches: K,
            minMatchCharLength: Y,
            findAllMatches: _,
            ignoreLocation: z,
            location: w,
            threshold: O,
            distance: $
        }, this.pattern = q ? A : A.toLowerCase(), this.query = LgY(this.pattern, this.options)
    }
    static condition(A, q) {
        return q.useExtendedSearch
    }
    searchIn(A) {
        let q = this.query;
        if (!q) return {
            isMatch: !1,
            score: 1
        };
        let {
            includeMatches: K,
            isCaseSensitive: Y
        } = this.options;
        A = Y ? A : A.toLowerCase();
        let z = 0,
            _ = [],
            w = 0;
        for (let O = 0, $ = q.length; O < $; O += 1) {
            let H = q[O];
            _.length = 0, z = 0;
            for (let j = 0, J = H.length; j < J; j += 1) {
                let M = H[j],
                    {
                        isMatch: D,
                        indices: X,
                        score: P
                    } = M.search(A);
                if (D) {
                    if (z += 1, w += P, K) {
                        let W = M.constructor.type;
                        if (RgY.has(W)) _ = [..._, ...X];
                        else _.push(X)
                    }
                } else {
                    w = 0, z = 0, _.length = 0;
                    break
                }
            }
            if (z) {
                let j = {
                    isMatch: !0,
                    score: w / z
                };
                if (K) j.indices = _;
                return j
            }
        }
        return {
            isMatch: !1,
            score: 1
        }
    }
}
// @from(Ln 381077, Col 0)
function hgY(...A) {
    wQ8.push(...A)
}
// @from(Ln 381081, Col 0)
function OQ8(A, q) {
    for (let K = 0, Y = wQ8.length; K < Y; K += 1) {
        let z = wQ8[K];
        if (z.condition(A, q)) return new z(A, q)
    }
    return new jQ8(A, q)
}
// @from(Ln 381089, Col 0)
function $3q(A, q, {
    auto: K = !0
} = {}) {
    let Y = (z) => {
        let _ = Object.keys(z),
            w = SgY(z);
        if (!w && _.length > 1 && !HQ8(z)) return Y(r5q(z));
        if (CgY(z)) {
            let $ = w ? z[$Q8.PATH] : _[0],
                H = w ? z[$Q8.PATTERN] : z[$];
            if (!HF(H)) throw Error(jgY($));
            let j = {
                keyId: zQ8($),
                pattern: H
            };
            if (K) j.searcher = OQ8(H, q);
            return j
        }
        let O = {
            children: [],
            operator: _[0]
        };
        return _.forEach(($) => {
            let H = z[$];
            if (pl(H)) H.forEach((j) => {
                O.children.push(Y(j))
            })
        }), O
    };
    if (!HQ8(A)) A = r5q(A);
    return Y(A)
}
// @from(Ln 381122, Col 0)
function IgY(A, {
    ignoreFieldNorm: q = V5.ignoreFieldNorm
}) {
    A.forEach((K) => {
        let Y = 1;
        K.matches.forEach(({
            key: z,
            norm: _,
            score: w
        }) => {
            let O = z ? z.weight : null;
            Y *= Math.pow(w === 0 && O ? Number.EPSILON : w, (O || 1) * (q ? 1 : _))
        }), K.score = Y
    })
}
// @from(Ln 381138, Col 0)
function bgY(A, q) {
    let K = A.matches;
    if (q.matches = [], !fE(K)) return;
    K.forEach((Y) => {
        if (!fE(Y.indices) || !Y.indices.length) return;
        let {
            indices: z,
            value: _
        } = Y, w = {
            indices: z,
            value: _
        };
        if (Y.key) w.key = Y.key.src;
        if (Y.idx > -1) w.refIndex = Y.idx;
        q.matches.push(w)
    })
}
// @from(Ln 381156, Col 0)
function xgY(A, q) {
    q.score = A.score
}
// @from(Ln 381160, Col 0)
function ugY(A, q, {
    includeMatches: K = V5.includeMatches,
    includeScore: Y = V5.includeScore
} = {}) {
    let z = [];
    if (K) z.push(bgY);
    if (Y) z.push(xgY);
    return A.map((_) => {
        let {
            idx: w
        } = _, O = {
            item: q[w],
            refIndex: w
        };
        if (z.length) z.forEach(($) => {
            $(_, O)
        });
        return O
    })
}