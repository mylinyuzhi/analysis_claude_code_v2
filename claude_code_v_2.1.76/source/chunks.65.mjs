
// @from(Ln 163263, Col 4)
TL7 = x((hK2, fL7) => {
    var mc3 = "Expected a function",
        ZL7 = NaN,
        Bc3 = "[object Symbol]",
        gc3 = /^\s+|\s+$/g,
        Fc3 = /^[-+]0x[0-9a-f]+$/i,
        pc3 = /^0b[01]+$/i,
        Qc3 = /^0o[0-7]+$/i,
        Uc3 = parseInt,
        dc3 = typeof global == "object" && global && global.Object === Object && global,
        cc3 = typeof self == "object" && self && self.Object === Object && self,
        lc3 = dc3 || cc3 || Function("return this")(),
        ic3 = Object.prototype,
        nc3 = ic3.toString,
        rc3 = Math.max,
        oc3 = Math.min,
        xj8 = function() {
            return lc3.Date.now()
        };

    function ac3(A, q, K) {
        var Y, z, _, w, O, $, H = 0,
            j = !1,
            J = !1,
            M = !0;
        if (typeof A != "function") throw TypeError(mc3);
        if (q = GL7(q) || 0, uj8(K)) j = !!K.leading, J = "maxWait" in K, _ = J ? rc3(GL7(K.maxWait) || 0, q) : _, M = "trailing" in K ? !!K.trailing : M;

        function D(V) {
            var L = Y,
                h = z;
            return Y = z = void 0, H = V, w = A.apply(h, L), w
        }

        function X(V) {
            return H = V, O = setTimeout(Z, q), j ? D(V) : w
        }

        function P(V) {
            var L = V - $,
                h = V - H,
                R = q - L;
            return J ? oc3(R, _ - h) : R
        }

        function W(V) {
            var L = V - $,
                h = V - H;
            return $ === void 0 || L >= q || L < 0 || J && h >= _
        }

        function Z() {
            var V = xj8();
            if (W(V)) return G(V);
            O = setTimeout(Z, P(V))
        }

        function G(V) {
            if (O = void 0, M && Y) return D(V);
            return Y = z = void 0, w
        }

        function f() {
            if (O !== void 0) clearTimeout(O);
            H = 0, Y = $ = z = O = void 0
        }

        function v() {
            return O === void 0 ? w : G(xj8())
        }

        function N() {
            var V = xj8(),
                L = W(V);
            if (Y = arguments, z = this, $ = V, L) {
                if (O === void 0) return X($);
                if (J) return O = setTimeout(Z, q), D($)
            }
            if (O === void 0) O = setTimeout(Z, q);
            return w
        }
        return N.cancel = f, N.flush = v, N
    }

    function uj8(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function sc3(A) {
        return !!A && typeof A == "object"
    }

    function tc3(A) {
        return typeof A == "symbol" || sc3(A) && nc3.call(A) == Bc3
    }

    function GL7(A) {
        if (typeof A == "number") return A;
        if (tc3(A)) return ZL7;
        if (uj8(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = uj8(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(gc3, "");
        var K = pc3.test(A);
        return K || Qc3.test(A) ? Uc3(A.slice(2), K ? 2 : 8) : Fc3.test(A) ? ZL7 : +A
    }
    fL7.exports = ac3
})
// @from(Ln 163375, Col 0)
function OX(A, q) {
    let K = pP.useRef(A);
    vL7(() => {
        K.current = A
    }, [A]), pP.useEffect(() => {
        if (q === null) return;
        let Y = setInterval(() => {
            K.current()
        }, q);
        return () => {
            clearInterval(Y)
        }
    }, [q])
}
// @from(Ln 163390, Col 0)
function NL7(A) {
    let q = pP.useRef(() => {
        throw Error("Cannot call an event handler while rendering.")
    });
    return vL7(() => {
        q.current = A
    }, [A]), pP.useCallback((...K) => {
        var Y;
        return (Y = q.current) == null ? void 0 : Y.call(q, ...K)
    }, [q])
}
// @from(Ln 163402, Col 0)
function ec3(A) {
    let q = pP.useRef(A);
    q.current = A, pP.useEffect(() => () => {
        q.current()
    }, [])
}
// @from(Ln 163409, Col 0)
function CX6(A, q = 500, K) {
    let Y = pP.useRef();
    ec3(() => {
        if (Y.current) Y.current.cancel()
    });
    let z = pP.useMemo(() => {
        let _ = mj8.default(A, q, K),
            w = (...O) => {
                return _(...O)
            };
        return w.cancel = () => {
            _.cancel()
        }, w.isPending = () => {
            return !!Y.current
        }, w.flush = () => {
            return _.flush()
        }, w
    }, [A, q, K]);
    return pP.useEffect(() => {
        Y.current = mj8.default(A, q, K)
    }, [A, q, K]), z
}
// @from(Ln 163431, Col 4)
pP
// @from(Ln 163431, Col 8)
mj8
// @from(Ln 163431, Col 13)
vL7
// @from(Ln 163432, Col 4)
Pv = E(() => {
    pP = t(P6(), 1), mj8 = t(TL7(), 1), vL7 = typeof window < "u" ? pP.useLayoutEffect : pP.useEffect
})
// @from(Ln 163435, Col 4)
j$1
// @from(Ln 163435, Col 9)
Al3 = (A, q = {}) => {
        let {
            setRawMode: K,
            internal_exitOnCtrlC: Y,
            internal_eventEmitter: z
        } = Ms();
        j$1.useLayoutEffect(() => {
            if (q.isActive === !1) return;
            return K(!0), () => {
                K(!1)
            }
        }, [q.isActive, K]);
        let _ = NL7((w) => {
            if (q.isActive === !1) return;
            let {
                input: O,
                key: $
            } = w;
            if (!(O === "c" && $.ctrl) || !Y) A(O, $, w)
        });
        j$1.useEffect(() => {
            return z?.on("input", _), () => {
                z?.removeListener("input", _)
            }
        }, [z, _])
    }
// @from(Ln 163461, Col 4)
jA
// @from(Ln 163462, Col 4)
VL7 = E(() => {
    H$1();
    Pv();
    j$1 = t(P6(), 1), jA = Al3
})
// @from(Ln 163467, Col 4)
kL7
// @from(Ln 163467, Col 9)
ql3 = () => kL7.useContext(QO1)
// @from(Ln 163468, Col 4)
IX6
// @from(Ln 163469, Col 4)
Bj8 = E(() => {
    Yj8();
    kL7 = t(P6(), 1), IX6 = ql3
})
// @from(Ln 163473, Col 4)
gU
// @from(Ln 163473, Col 8)
Kl3 = ({
        isActive: A = !0,
        autoFocus: q = !1,
        id: K
    } = {}) => {
        let {
            isRawModeSupported: Y,
            setRawMode: z
        } = Ms(), {
            activeId: _,
            add: w,
            remove: O,
            activate: $,
            deactivate: H,
            focus: j
        } = gU.useContext(fX6), J = gU.useMemo(() => {
            return K ?? Math.random().toString().slice(2, 7)
        }, [K]);
        return gU.useEffect(() => {
            return w(J, {
                autoFocus: q
            }), () => {
                O(J)
            }
        }, [J, q]), gU.useEffect(() => {
            if (A) $(J);
            else H(J)
        }, [A, J]), gU.useLayoutEffect(() => {
            if (!Y || !A) return;
            return z(!0), () => {
                z(!1)
            }
        }, [A]), {
            isFocused: Boolean(J) && _ === J,
            focus: j
        }
    }
// @from(Ln 163510, Col 4)
EL7
// @from(Ln 163511, Col 4)
yL7 = E(() => {
    dO1();
    H$1();
    gU = t(P6(), 1), EL7 = Kl3
})
// @from(Ln 163516, Col 4)
LL7
// @from(Ln 163516, Col 9)
Yl3 = () => {
        let A = LL7.useContext(fX6);
        return {
            enableFocus: A.enableFocus,
            disableFocus: A.disableFocus,
            focusNext: A.focusNext,
            focusPrevious: A.focusPrevious,
            focus: A.focus
        }
    }
// @from(Ln 163526, Col 4)
RL7
// @from(Ln 163527, Col 4)
hL7 = E(() => {
    dO1();
    LL7 = t(P6(), 1), RL7 = Yl3
})
// @from(Ln 163531, Col 4)
zl3 = (A) => ({
        width: A.yogaNode?.getComputedWidth() ?? 0,
        height: A.yogaNode?.getComputedHeight() ?? 0
    })
// @from(Ln 163535, Col 4)
bX6
// @from(Ln 163536, Col 4)
SL7 = E(() => {
    bX6 = zl3
})
// @from(Ln 163540, Col 0)
function kA(A, q, K = "foreground") {
    return (Y) => {
        if (!A) return Y;
        if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return _X6(Y, A, K);
        return _X6(Y, QW(q)[A], K)
    }
}
// @from(Ln 163547, Col 4)
bK6 = E(() => {
    ym();
    OX6()
})
// @from(Ln 163552, Col 0)
function Ds() {
    let A = FU.useContext(VX6),
        q = FU.useRef(null),
        K = FU.useRef({
            isVisible: !0
        }),
        Y = FU.useCallback((z) => {
            q.current = z
        }, []);
    return FU.useLayoutEffect(() => {
        let z = q.current;
        if (!z?.yogaNode || !A) return;
        let _ = z.yogaNode.getComputedHeight(),
            w = A.rows,
            O = z.yogaNode.getComputedTop(),
            $ = z.parentNode,
            H = z.yogaNode;
        while ($) {
            if ($.yogaNode) O += $.yogaNode.getComputedTop(), H = $.yogaNode;
            if ($.scrollTop) O -= $.scrollTop;
            $ = $.parentNode
        }
        let j = H.getComputedHeight(),
            J = O + _,
            M = j > w ? 1 : 0,
            D = Math.max(0, j - w) + M,
            X = D + w,
            P = J > D && O < X;
        if (P !== K.current.isVisible) K.current = {
            isVisible: P
        }
    }), [Y, K.current]
}
// @from(Ln 163585, Col 4)
FU
// @from(Ln 163586, Col 4)
gu6 = E(() => {
    sO1();
    FU = t(P6(), 1)
})
// @from(Ln 163591, Col 0)
function M$1(A) {
    let q = J$1.useContext(eO1);
    J$1.useEffect(() => {
        if (A === null || !q) return;
        let K = sY(A);
        if (process.platform === "win32") process.title = K;
        else q(gP(QH.SET_TITLE_AND_ICON, K))
    }, [A, q])
}
// @from(Ln 163600, Col 4)
J$1
// @from(Ln 163601, Col 4)
CL7 = E(() => {
    LG();
    Hs();
    vm();
    J$1 = t(P6(), 1)
})
// @from(Ln 163608, Col 0)
function gJ(A = 16) {
    let q = xX6.useContext(vX6),
        [K, {
            isVisible: Y
        }] = Ds(),
        [z, _] = xX6.useState(() => q?.now() ?? 0),
        w = Y && A !== null;
    return xX6.useEffect(() => {
        if (!q || !w) return;
        let O = q.now(),
            $ = () => {
                let H = q.now();
                if (H - O >= A) O = H, _(H)
            };
        return q.subscribe($, !0)
    }, [q, A, w]), [K, z]
}
// @from(Ln 163625, Col 4)
xX6
// @from(Ln 163626, Col 4)
IL7 = E(() => {
    iO1();
    gu6();
    xX6 = t(P6(), 1)
})
// @from(Ln 163632, Col 0)
function bL7(A) {
    let q = Lm.useContext(vX6),
        [K, Y] = Lm.useState(() => q?.now() ?? 0);
    return Lm.useEffect(() => {
        if (!q) return;
        let z = q.now(),
            _ = () => {
                let w = q.now();
                if (w - z >= A) z = w, Y(w)
            };
        return q.subscribe(_, !1)
    }, [q, A]), K
}
// @from(Ln 163646, Col 0)
function gj8(A, q) {
    let K = Lm.useRef(A);
    K.current = A;
    let Y = Lm.useContext(vX6);
    Lm.useEffect(() => {
        if (!Y || q === null) return;
        let z = Y.now(),
            _ = () => {
                let w = Y.now();
                if (w - z >= q) z = w, K.current()
            };
        return Y.subscribe(_, !1)
    }, [Y, q])
}
// @from(Ln 163660, Col 4)
Lm
// @from(Ln 163661, Col 4)
xL7 = E(() => {
    iO1();
    Lm = t(P6(), 1)
})
// @from(Ln 163666, Col 0)
function uL7() {
    Fu6.useContext(GX6);
    let A = FP.get(process.stdout);
    return Fu6.useMemo(() => {
        if (!A) return {
            copySelection: () => "",
            copySelectionNoClear: () => "",
            clearSelection: () => {},
            hasSelection: () => !1,
            getState: () => null,
            subscribe: () => () => {},
            shiftAnchor: () => {}
        };
        return {
            copySelection: () => A.copySelection(),
            copySelectionNoClear: () => A.copySelectionNoClear(),
            clearSelection: () => A.clearTextSelection(),
            hasSelection: () => A.hasTextSelection(),
            getState: () => A.selection,
            subscribe: (q) => A.subscribeToSelectionChange(q),
            shiftAnchor: (q, K, Y) => Zy7(A.selection, q, K, Y)
        }
    }, [A])
}
// @from(Ln 163690, Col 4)
Fu6
// @from(Ln 163691, Col 4)
Fj8 = E(() => {
    UO1();
    bU();
    aO1();
    Fu6 = t(P6(), 1)
})
// @from(Ln 163697, Col 4)
pu6 = {}
// @from(Ln 163737, Col 0)
function BL7(A) {
    return mL7.createElement(K$1, null, A)
}
// @from(Ln 163740, Col 0)
async function BC(A, q) {
    return gy7(BL7(A), q)
}
// @from(Ln 163743, Col 0)
async function _l3(A) {
    let q = await By7(A);
    return {
        ...q,
        render: (K) => q.render(BL7(K))
    }
}
// @from(Ln 163750, Col 4)
mL7
// @from(Ln 163751, Col 4)
i6 = E(() => {
    Fy7();
    Bu6();
    TX6();
    cy7();
    hK6();
    RX6();
    OL7();
    HL7();
    IK6();
    JL7();
    DL7();
    PL7();
    VL7();
    Bj8();
    H$1();
    yL7();
    hL7();
    SL7();
    Bu6();
    bK6();
    OO1();
    Wj8();
    Vj8();
    Zj8();
    pO1();
    gu6();
    Su6();
    CL7();
    IL7();
    xL7();
    Fj8();
    mL7 = t(P6(), 1)
})
// @from(Ln 163786, Col 0)
function Qu6(A) {
    let q = A.split("+"),
        K = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1,
            super: !1
        };
    for (let Y of q) {
        let z = Y.toLowerCase();
        switch (z) {
            case "ctrl":
            case "control":
                K.ctrl = !0;
                break;
            case "alt":
            case "opt":
            case "option":
                K.alt = !0;
                break;
            case "shift":
                K.shift = !0;
                break;
            case "meta":
                K.meta = !0;
                break;
            case "cmd":
            case "command":
            case "super":
            case "win":
                K.super = !0;
                break;
            case "esc":
                K.key = "escape";
                break;
            case "return":
                K.key = "enter";
                break;
            case "space":
                K.key = " ";
                break;
            case "↑":
                K.key = "up";
                break;
            case "↓":
                K.key = "down";
                break;
            case "←":
                K.key = "left";
                break;
            case "→":
                K.key = "right";
                break;
            default:
                K.key = z;
                break
        }
    }
    return K
}
// @from(Ln 163849, Col 0)
function pj8(A) {
    if (A === " ") return [Qu6("space")];
    return A.trim().split(/\s+/).map(Qu6)
}
// @from(Ln 163854, Col 0)
function wl3(A) {
    let q = [];
    if (A.ctrl) q.push("ctrl");
    if (A.alt) q.push("alt");
    if (A.shift) q.push("shift");
    if (A.meta) q.push("meta");
    if (A.super) q.push("cmd");
    let K = Ol3(A.key);
    return q.push(K), q.join("+")
}
// @from(Ln 163865, Col 0)
function Ol3(A) {
    switch (A) {
        case "escape":
            return "Esc";
        case " ":
            return "Space";
        case "tab":
            return "tab";
        case "enter":
            return "Enter";
        case "backspace":
            return "Backspace";
        case "delete":
            return "Delete";
        case "up":
            return "↑";
        case "down":
            return "↓";
        case "left":
            return "←";
        case "right":
            return "→";
        case "pageup":
            return "PageUp";
        case "pagedown":
            return "PageDown";
        case "home":
            return "Home";
        case "end":
            return "End";
        default:
            return A
    }
}
// @from(Ln 163900, Col 0)
function D$1(A) {
    return A.map(wl3).join(" ")
}
// @from(Ln 163904, Col 0)
function X$1(A) {
    let q = [];
    for (let K of A)
        for (let [Y, z] of Object.entries(K.bindings)) q.push({
            chord: pj8(Y),
            action: z,
            context: K.context
        });
    return q
}
// @from(Ln 163915, Col 0)
function $l3(A) {
    return {
        ctrl: A.ctrl,
        shift: A.shift,
        meta: A.meta,
        super: A.super
    }
}
// @from(Ln 163924, Col 0)
function Qj8(A, q) {
    if (q.escape) return "escape";
    if (q.return) return "enter";
    if (q.tab) return "tab";
    if (q.backspace) return "backspace";
    if (q.delete) return "delete";
    if (q.upArrow) return "up";
    if (q.downArrow) return "down";
    if (q.leftArrow) return "left";
    if (q.rightArrow) return "right";
    if (q.pageUp) return "pageup";
    if (q.pageDown) return "pagedown";
    if (q.wheelUp) return "wheelup";
    if (q.wheelDown) return "wheeldown";
    if (q.home) return "home";
    if (q.end) return "end";
    if (A.length === 1) return A.toLowerCase();
    return null
}
// @from(Ln 163944, Col 0)
function gL7(A, q) {
    if (A.ctrl !== q.ctrl) return !1;
    if (A.shift !== q.shift) return !1;
    let K = q.alt || q.meta;
    if (A.meta !== K) return !1;
    if (A.super !== q.super) return !1;
    return !0
}
// @from(Ln 163953, Col 0)
function FL7(A, q, K) {
    if (Qj8(A, q) !== K.key) return !1;
    let z = $l3(q);
    if (q.escape) return gL7({
        ...z,
        meta: !1
    }, K);
    return gL7(z, K)
}
// @from(Ln 163963, Col 0)
function P$1(A, q, K) {
    for (let Y = K.length - 1; Y >= 0; Y--) {
        let z = K[Y];
        if (z && z.action === A && z.context === q) return D$1(z.chord)
    }
    return
}
// @from(Ln 163971, Col 0)
function Hl3(A, q) {
    let K = Qj8(A, q);
    if (!K) return null;
    let Y = q.escape ? !1 : q.meta;
    return {
        key: K,
        ctrl: q.ctrl,
        alt: Y,
        shift: q.shift,
        meta: Y,
        super: q.super
    }
}
// @from(Ln 163985, Col 0)
function W$1(A, q) {
    return A.key === q.key && A.ctrl === q.ctrl && A.shift === q.shift && (A.alt || A.meta) === (q.alt || q.meta) && A.super === q.super
}
// @from(Ln 163989, Col 0)
function jl3(A, q) {
    if (A.length >= q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (!W$1(Y, z)) return !1
    }
    return !0
}
// @from(Ln 164000, Col 0)
function Jl3(A, q) {
    if (A.length !== q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (!W$1(Y, z)) return !1
    }
    return !0
}
// @from(Ln 164011, Col 0)
function Z$1(A, q, K, Y, z) {
    if (q.escape && z !== null) return {
        type: "chord_cancelled"
    };
    let _ = Hl3(A, q);
    if (!_) {
        if (z !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let w = z ? [...z, _] : [_],
        O = Y.filter((j) => K.includes(j.context));
    if (O.some((j) => j.chord.length > w.length && jl3(w, j))) return {
        type: "chord_started",
        pending: w
    };
    let H;
    for (let j of O)
        if (Jl3(w, j)) H = j;
    if (H) {
        if (H.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: H.action
        }
    }
    if (z !== null) return {
        type: "chord_cancelled"
    };
    return {
        type: "none"
    }
}
// @from(Ln 164049, Col 4)
Uu6 = () => {}
// @from(Ln 164051, Col 0)
function G$1(A) {
    let q = A6(27),
        {
            bindings: K,
            pendingChordRef: Y,
            pendingChord: z,
            setPendingChord: _,
            activeContexts: w,
            registerActiveContext: O,
            unregisterActiveContext: $,
            handlerRegistryRef: H,
            children: j
        } = A,
        J;
    if (q[0] !== K) J = (V, L) => P$1(V, L, K), q[0] = K, q[1] = J;
    else J = q[1];
    let M = J,
        D;
    if (q[2] !== H) D = (V) => {
        let L = H.current;
        if (!L) return Ml3;
        if (!L.has(V.action)) L.set(V.action, new Set);
        return L.get(V.action).add(V), () => {
            let h = L.get(V.action);
            if (h) {
                if (h.delete(V), h.size === 0) L.delete(V.action)
            }
        }
    }, q[2] = H, q[3] = D;
    else D = q[3];
    let X = D,
        P;
    if (q[4] !== w || q[5] !== H) P = (V) => {
        let L = H.current;
        if (!L) return !1;
        let h = L.get(V);
        if (!h || h.size === 0) return !1;
        for (let R of h)
            if (w.has(R.context)) return R.handler(), !0;
        return !1
    }, q[4] = w, q[5] = H, q[6] = P;
    else P = q[6];
    let W = P,
        Z;
    if (q[7] !== K || q[8] !== Y) Z = (V, L, h) => Z$1(V, L, h, K, Y.current), q[7] = K, q[8] = Y, q[9] = Z;
    else Z = q[9];
    let G;
    if (q[10] !== M) G = (V, L) => M(V, L), q[10] = M, q[11] = G;
    else G = q[11];
    let f;
    if (q[12] !== w || q[13] !== K || q[14] !== M || q[15] !== W || q[16] !== z || q[17] !== O || q[18] !== X || q[19] !== _ || q[20] !== Z || q[21] !== G || q[22] !== $) f = {
        resolve: Z,
        setPendingChord: _,
        getDisplayText: M,
        getPlatformDisplayText: G,
        bindings: K,
        pendingChord: z,
        activeContexts: w,
        registerActiveContext: O,
        unregisterActiveContext: $,
        registerHandler: X,
        invokeAction: W
    }, q[12] = w, q[13] = K, q[14] = M, q[15] = W, q[16] = z, q[17] = O, q[18] = X, q[19] = _, q[20] = Z, q[21] = G, q[22] = $, q[23] = f;
    else f = q[23];
    let v = f,
        N;
    if (q[24] !== j || q[25] !== v) N = pL7.default.createElement(QL7.Provider, {
        value: v
    }, j), q[24] = j, q[25] = v, q[26] = N;
    else N = q[26];
    return N
}
// @from(Ln 164124, Col 0)
function Ml3() {}
// @from(Ln 164126, Col 0)
function Wv() {
    return uX6.useContext(QL7)
}
// @from(Ln 164130, Col 0)
function f$1(A, q) {
    let K = A6(5),
        Y = q === void 0 ? !0 : q,
        z = Wv(),
        _, w;
    if (K[0] !== A || K[1] !== Y || K[2] !== z) _ = () => {
        if (!z || !Y) return;
        return z.registerActiveContext(A), () => {
            z.unregisterActiveContext(A)
        }
    }, w = [A, z, Y], K[0] = A, K[1] = Y, K[2] = z, K[3] = _, K[4] = w;
    else _ = K[3], w = K[4];
    uX6.useLayoutEffect(_, w)
}
// @from(Ln 164144, Col 4)
pL7
// @from(Ln 164144, Col 9)
uX6
// @from(Ln 164144, Col 14)
QL7
// @from(Ln 164145, Col 4)
Rm = E(() => {
    e6();
    Uu6();
    pL7 = t(P6(), 1), uX6 = t(P6(), 1), QL7 = uX6.createContext(null)
})
// @from(Ln 164151, Col 0)
function D8(A, q, K = {}) {
    let {
        context: Y = "Global",
        isActive: z = !0
    } = K, _ = Wv();
    mX6.useEffect(() => {
        if (!_ || !z) return;
        return _.registerHandler({
            action: A,
            context: Y,
            handler: q
        })
    }, [A, Y, q, _, z]);
    let w = mX6.useCallback((O, $, H) => {
        if (!_) return;
        let j = [..._.activeContexts, Y, "Global"],
            J = [...new Set(j)],
            M = _.resolve(O, $, J);
        switch (M.type) {
            case "match":
                if (_.setPendingChord(null), M.action === A) q(), H.stopImmediatePropagation();
                break;
            case "chord_started":
                _.setPendingChord(M.pending), H.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                _.setPendingChord(null);
                break;
            case "unbound":
                _.setPendingChord(null), H.stopImmediatePropagation();
                break;
            case "none":
                break
        }
    }, [A, Y, q, _]);
    jA(w, {
        isActive: z
    })
}
// @from(Ln 164191, Col 0)
function tA(A, q = {}) {
    let {
        context: K = "Global",
        isActive: Y = !0
    } = q, z = Wv();
    mX6.useEffect(() => {
        if (!z || !Y) return;
        let w = [];
        for (let [O, $] of Object.entries(A)) w.push(z.registerHandler({
            action: O,
            context: K,
            handler: $
        }));
        return () => {
            for (let O of w) O()
        }
    }, [K, A, z, Y]);
    let _ = mX6.useCallback((w, O, $) => {
        if (!z) return;
        let H = [...z.activeContexts, K, "Global"],
            j = [...new Set(H)],
            J = z.resolve(w, O, j);
        switch (J.type) {
            case "match":
                if (z.setPendingChord(null), J.action in A) {
                    let M = A[J.action];
                    if (M) M(), $.stopImmediatePropagation()
                }
                break;
            case "chord_started":
                z.setPendingChord(J.pending), $.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                z.setPendingChord(null);
                break;
            case "unbound":
                z.setPendingChord(null), $.stopImmediatePropagation();
                break;
            case "none":
                break
        }
    }, [K, A, z]);
    jA(_, {
        isActive: Y
    })
}
// @from(Ln 164237, Col 4)
mX6
// @from(Ln 164238, Col 4)
_7 = E(() => {
    i6();
    Rm();
    mX6 = t(P6(), 1)
})
// @from(Ln 164244, Col 0)
function gC(A, q, K) {
    let Y = Xs.useRef(0),
        z = Xs.useRef(void 0),
        _ = Xs.useCallback(() => {
            if (z.current) clearTimeout(z.current), z.current = void 0
        }, []);
    return Xs.useEffect(() => {
        return () => {
            _()
        }
    }, [_]), Xs.useCallback(() => {
        let w = Date.now();
        if (w - Y.current <= UL7 && z.current !== void 0) _(), A(!1), q();
        else K?.(), A(!0), _(), z.current = setTimeout((H, j) => {
            H(!1), j.current = void 0
        }, UL7, A, z);
        Y.current = w
    }, [A, q, K, _])
}
// @from(Ln 164263, Col 4)
Xs
// @from(Ln 164263, Col 8)
UL7 = 800
// @from(Ln 164264, Col 4)
du6 = E(() => {
    Xs = t(P6(), 1)
})
// @from(Ln 164268, Col 0)
function dL7(A, q, K) {
    let {
        exit: Y
    } = IX6(), [z, _] = Ps.useState({
        pending: !1,
        keyName: null
    }), w = Ps.useMemo(() => K ?? Y, [K, Y]), O = gC((M) => _({
        pending: M,
        keyName: "Ctrl-C"
    }), w), $ = gC((M) => _({
        pending: M,
        keyName: "Ctrl-D"
    }), w), H = Ps.useCallback(() => {
        if (q?.()) return;
        O()
    }, [O, q]), j = Ps.useCallback(() => {
        $()
    }, [$]), J = Ps.useMemo(() => ({
        "app:interrupt": H,
        "app:exit": j
    }), [H, j]);
    return A(J, {
        context: "Global"
    }), z
}
// @from(Ln 164293, Col 4)
Ps
// @from(Ln 164294, Col 4)
cL7 = E(() => {
    du6();
    Bj8();
    Ps = t(P6(), 1)
})
// @from(Ln 164300, Col 0)
function IK(A, q) {
    return dL7(tA, q, A)
}
// @from(Ln 164303, Col 4)
PO = E(() => {
    cL7();
    _7()
})
// @from(Ln 164308, Col 0)
function KA() {
    let A = lL7.useContext(VX6);
    if (!A) throw Error("useTerminalSize must be used within an Ink App component");
    return A
}
// @from(Ln 164313, Col 4)
lL7
// @from(Ln 164314, Col 4)
_q = E(() => {
    sO1();
    lL7 = t(P6(), 1)
})
// @from(Ln 164319, Col 0)
function Wk(A) {
    let q = A6(7),
        {
            width: K,
            color: Y,
            char: z,
            padding: _
        } = A,
        w = z === void 0 ? "─" : z,
        O = _ === void 0 ? 0 : _,
        {
            columns: $
        } = KA(),
        H = Math.max(0, (K ?? $) - O),
        j = !Y,
        J;
    if (q[0] !== w || q[1] !== H) J = w.repeat(H), q[0] = w, q[1] = H, q[2] = J;
    else J = q[2];
    let M;
    if (q[3] !== Y || q[4] !== j || q[5] !== J) M = iL7.default.createElement(T, {
        color: Y,
        dimColor: j
    }, J), q[3] = Y, q[4] = j, q[5] = J, q[6] = M;
    else M = q[6];
    return M
}
// @from(Ln 164345, Col 4)
iL7
// @from(Ln 164346, Col 4)
cu6 = E(() => {
    e6();
    i6();
    _q();
    iL7 = t(P6(), 1)
})
// @from(Ln 164353, Col 0)
function S3(A) {
    let q = A6(7),
        {
            children: K,
            color: Y
        } = A,
        z;
    if (q[0] !== Y) z = T$1.default.createElement(Wk, {
        color: Y
    }), q[0] = Y, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== K) _ = T$1.default.createElement(m, {
        flexDirection: "column",
        paddingX: 2
    }, K), q[2] = K, q[3] = _;
    else _ = q[3];
    let w;
    if (q[4] !== z || q[5] !== _) w = T$1.default.createElement(m, {
        flexDirection: "column",
        paddingTop: 1
    }, z, _), q[4] = z, q[5] = _, q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 164378, Col 4)
T$1
// @from(Ln 164379, Col 4)
FJ = E(() => {
    e6();
    i6();
    cu6();
    T$1 = t(P6(), 1)
})
// @from(Ln 164386, Col 0)
function a1(A) {
    let q = A6(9),
        {
            shortcut: K,
            action: Y,
            parens: z,
            bold: _
        } = A,
        w = z === void 0 ? !1 : z,
        O = _ === void 0 ? !1 : _,
        $;
    if (q[0] !== O || q[1] !== K) $ = O ? v$1.default.createElement(Kz, {
        bold: !0
    }, K) : K, q[0] = O, q[1] = K, q[2] = $;
    else $ = q[2];
    let H = $;
    if (w) {
        let J;
        if (q[3] !== Y || q[4] !== H) J = v$1.default.createElement(Kz, null, "(", H, " to ", Y, ")"), q[3] = Y, q[4] = H, q[5] = J;
        else J = q[5];
        return J
    }
    let j;
    if (q[6] !== Y || q[7] !== H) j = v$1.default.createElement(Kz, null, H, " to ", Y), q[6] = Y, q[7] = H, q[8] = j;
    else j = q[8];
    return j
}
// @from(Ln 164413, Col 4)
v$1
// @from(Ln 164414, Col 4)
Lq = E(() => {
    e6();
    hK6();
    v$1 = t(P6(), 1)
})
// @from(Ln 164420, Col 0)
function Rq(A, q, K) {
    let Y = Wv(),
        z = Y?.getDisplayText(A, q),
        _ = z === void 0,
        w = Y ? "action_not_found" : "no_context",
        O = N$1.useRef(!1);
    return N$1.useEffect(() => {
        if (_ && !O.current) O.current = !0, d("tengu_keybinding_fallback_used", {
            action: A,
            context: q,
            fallback: K,
            reason: w
        })
    }, [_, A, q, K, w]), _ ? K : z
}
// @from(Ln 164435, Col 4)
N$1
// @from(Ln 164436, Col 4)
Rj = E(() => {
    Rm();
    V1();
    N$1 = t(P6(), 1)
})
// @from(Ln 164442, Col 0)
function O8(A) {
    let q = A6(5),
        {
            action: K,
            context: Y,
            fallback: z,
            description: _,
            parens: w,
            bold: O
        } = A,
        $ = Rq(K, Y, z),
        H;
    if (q[0] !== O || q[1] !== _ || q[2] !== w || q[3] !== $) H = Uj8.createElement(a1, {
        shortcut: $,
        action: _,
        parens: w,
        bold: O
    }), q[0] = O, q[1] = _, q[2] = w, q[3] = $, q[4] = H;
    else H = q[4];
    return H
}
// @from(Ln 164463, Col 4)
Uj8
// @from(Ln 164464, Col 4)
OK = E(() => {
    e6();
    Lq();
    Rj();
    Uj8 = t(P6(), 1)
})
// @from(Ln 164471, Col 0)
function C8(A) {
    let q = A6(5),
        {
            children: K
        } = A,
        Y, z;
    if (q[0] !== K) {
        z = Symbol.for("react.early_return_sentinel");
        A: {
            let w = hm.Children.toArray(K);
            if (w.length === 0) {
                z = null;
                break A
            }
            Y = w.map(Dl3)
        }
        q[0] = K, q[1] = Y, q[2] = z
    } else Y = q[1], z = q[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    let _;
    if (q[3] !== Y) _ = hm.default.createElement(hm.default.Fragment, null, Y), q[3] = Y, q[4] = _;
    else _ = q[4];
    return _
}
// @from(Ln 164496, Col 0)
function Dl3(A, q) {
    return hm.default.createElement(hm.default.Fragment, {
        key: hm.isValidElement(A) ? A.key ?? q : q
    }, q > 0 && hm.default.createElement(T, {
        dimColor: !0
    }, " · "), A)
}
// @from(Ln 164503, Col 4)
hm
// @from(Ln 164504, Col 4)
Xq = E(() => {
    e6();
    i6();
    hm = t(P6(), 1)
})
// @from(Ln 164510, Col 0)
function m8(A) {
    let q = A6(27),
        {
            title: K,
            subtitle: Y,
            children: z,
            onCancel: _,
            color: w,
            hideInputGuide: O,
            hideBorder: $,
            inputGuide: H,
            isCancelActive: j
        } = A,
        J = w === void 0 ? "permission" : w,
        M = j === void 0 ? !0 : j,
        D = IK(),
        X;
    if (q[0] !== M) X = {
        context: "Confirmation",
        isActive: M
    }, q[0] = M, q[1] = X;
    else X = q[1];
    D8("confirm:no", _, X);
    let P;
    if (q[2] !== D.keyName || q[3] !== D.pending) P = D.pending ? Zv.default.createElement(T, null, "Press ", D.keyName, " again to exit") : Zv.default.createElement(C8, null, Zv.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), Zv.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })), q[2] = D.keyName, q[3] = D.pending, q[4] = P;
    else P = q[4];
    let W = P,
        Z;
    if (q[5] !== J || q[6] !== K) Z = Zv.default.createElement(T, {
        bold: !0,
        color: J
    }, K), q[5] = J, q[6] = K, q[7] = Z;
    else Z = q[7];
    let G;
    if (q[8] !== Y) G = Y && Zv.default.createElement(T, {
        dimColor: !0
    }, Y), q[8] = Y, q[9] = G;
    else G = q[9];
    let f;
    if (q[10] !== Z || q[11] !== G) f = Zv.default.createElement(m, {
        flexDirection: "column"
    }, Z, G), q[10] = Z, q[11] = G, q[12] = f;
    else f = q[12];
    let v;
    if (q[13] !== z || q[14] !== f) v = Zv.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, f, z), q[13] = z, q[14] = f, q[15] = v;
    else v = q[15];
    let N;
    if (q[16] !== W || q[17] !== D || q[18] !== O || q[19] !== H) N = !O && Zv.default.createElement(m, {
        marginTop: 1
    }, Zv.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, H ? H(D) : W)), q[16] = W, q[17] = D, q[18] = O, q[19] = H, q[20] = N;
    else N = q[20];
    let V;
    if (q[21] !== v || q[22] !== N) V = Zv.default.createElement(Zv.default.Fragment, null, v, N), q[21] = v, q[22] = N, q[23] = V;
    else V = q[23];
    let L = V;
    if ($) return L;
    let h;
    if (q[24] !== J || q[25] !== L) h = Zv.default.createElement(S3, {
        color: J
    }, L), q[24] = J, q[25] = L, q[26] = h;
    else h = q[26];
    return h
}
// @from(Ln 164587, Col 4)
Zv
// @from(Ln 164588, Col 4)
wq = E(() => {
    e6();
    i6();
    PO();
    FJ();
    Lq();
    OK();
    Xq();
    _7();
    Zv = t(P6(), 1)
})
// @from(Ln 164599, Col 4)
rL7 = {}
// @from(Ln 164605, Col 0)
function dj8(A) {
    let q = A6(23),
        {
            onDone: K,
            installationStatus: Y
        } = A;
    Xl3();
    let z;
    if (q[0] !== K) z = {
        "confirm:yes": K,
        "confirm:no": K
    }, q[0] = K, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) _ = {
        context: "Confirmation"
    }, q[2] = _;
    else _ = q[2];
    tA(z, _);
    let w;
    if (q[3] !== Y?.ideType) w = Y?.ideType ?? BX6(), q[3] = Y?.ideType, q[4] = w;
    else w = q[4];
    let O = w,
        $ = FC(O),
        H;
    if (q[5] !== O) H = Y$(O), q[5] = O, q[6] = H;
    else H = q[6];
    let j = H,
        J = Y?.installedVersion,
        M = $ ? "plugin" : "extension",
        D = Q8.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K",
        X;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) X = hj.default.createElement(T, {
        color: "claude"
    }, "✻ "), q[7] = X;
    else X = q[7];
    let P;
    if (q[8] !== j) P = hj.default.createElement(hj.default.Fragment, null, X, hj.default.createElement(T, null, "Welcome to Claude Code for ", j)), q[8] = j, q[9] = P;
    else P = q[9];
    let W = J ? `installed ${M} v${J}` : void 0,
        Z;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) Z = hj.default.createElement(T, {
        color: "suggestion"
    }, "⧉ open files"), q[10] = Z;
    else Z = q[10];
    let G;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) G = hj.default.createElement(T, null, "• Claude has context of ", Z, " ", "and ", hj.default.createElement(T, {
        color: "suggestion"
    }, "⧉ selected lines")), q[11] = G;
    else G = q[11];
    let f;
    if (q[12] === Symbol.for("react.memo_cache_sentinel")) f = hj.default.createElement(T, {
        color: "diffAddedWord"
    }, "+11"), q[12] = f;
    else f = q[12];
    let v;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) v = hj.default.createElement(T, null, "• Review Claude Code's changes", " ", f, " ", hj.default.createElement(T, {
        color: "diffRemovedWord"
    }, "-22"), " in the comfort of your IDE"), q[13] = v;
    else v = q[13];
    let N;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) N = hj.default.createElement(T, null, "• Cmd+Esc", hj.default.createElement(T, {
        dimColor: !0
    }, " for Quick Launch")), q[14] = N;
    else N = q[14];
    let V;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) V = hj.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, G, v, N, hj.default.createElement(T, null, "• ", D, hj.default.createElement(T, {
        dimColor: !0
    }, " to reference files or lines in your input"))), q[15] = V;
    else V = q[15];
    let L;
    if (q[16] !== K || q[17] !== P || q[18] !== W) L = hj.default.createElement(m8, {
        title: P,
        subtitle: W,
        color: "ide",
        onCancel: K,
        hideInputGuide: !0
    }, V), q[16] = K, q[17] = P, q[18] = W, q[19] = L;
    else L = q[19];
    let h;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) h = hj.default.createElement(m, {
        paddingX: 1
    }, hj.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, "Press Enter to continue")), q[20] = h;
    else h = q[20];
    let R;
    if (q[21] !== L) R = hj.default.createElement(hj.default.Fragment, null, L, h), q[21] = L, q[22] = R;
    else R = q[22];
    return R
}
// @from(Ln 164701, Col 0)
function nL7() {
    let A = X1(),
        q = LT.terminal || "unknown";
    return A.hasIdeOnboardingBeenShown?.[q] === !0
}
// @from(Ln 164707, Col 0)
function Xl3() {
    if (nL7()) return;
    let A = LT.terminal || "unknown";
    d1((q) => ({
        ...q,
        hasIdeOnboardingBeenShown: {
            ...q.hasIdeOnboardingBeenShown,
            [A]: !0
        }
    }))
}
// @from(Ln 164718, Col 4)
hj
// @from(Ln 164719, Col 4)
cj8 = E(() => {
    e6();
    i6();
    Sw();
    d3();
    _7();
    k8();
    Zr();
    wq();
    hj = t(P6(), 1)
})
// @from(Ln 164740, Col 0)
function AR7(A) {
    try {
        return process.kill(A, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 164748, Col 0)
function Zl3() {
    let A = null;
    return () => {
        if (!A) A = tyA(process.ppid, 10).then((q) => new Set(q));
        return A
    }
}
// @from(Ln 164756, Col 0)
function E$1(A) {
    if (!A) return !1;
    let q = gX6[A];
    return q && q.ideKind === "vscode"
}
// @from(Ln 164762, Col 0)
function FC(A) {
    if (!A) return !1;
    let q = gX6[A];
    return q && q.ideKind === "jetbrains"
}
// @from(Ln 164768, Col 0)
function BX6() {
    if (!FM()) return null;
    return Q8.terminal
}
// @from(Ln 164772, Col 0)
async function y$1() {
    try {
        let A = await Gl3();
        return (await Promise.all(A.map(async (K) => {
            try {
                let z = (await $1().readdir(K)).filter((w) => w.name.endsWith(".lock"));
                return (await Promise.all(z.map(async (w) => {
                    let O = lj8(K, w.name);
                    try {
                        let $ = await $1().stat(O);
                        return {
                            path: O,
                            mtime: $.mtime
                        }
                    } catch {
                        return null
                    }
                }))).filter((w) => w !== null)
            } catch (Y) {
                return _6(Y), []
            }
        }))).flat().sort((K, Y) => Y.mtime.getTime() - K.mtime.getTime()).map((K) => K.path)
    } catch (A) {
        return _6(A), []
    }
}
// @from(Ln 164798, Col 0)
async function qR7(A) {
    try {
        let q = await $1().readFile(A, {
                encoding: "utf-8"
            }),
            K = [],
            Y, z, _ = !1,
            w = !1,
            O;
        try {
            let j = i1(q);
            if (j.workspaceFolders) K = j.workspaceFolders;
            Y = j.pid, z = j.ideName, _ = j.transport === "ws", w = j.runningInWindows === !0, O = j.authToken
        } catch (j) {
            K = q.split(`
`).map((J) => J.trim())
        }
        let $ = A.split(k$1).pop();
        if (!$) return null;
        let H = $.replace(".lock", "");
        return {
            workspaceFolders: K,
            port: parseInt(H),
            pid: Y,
            ideName: z,
            useWebSocket: _,
            runningInWindows: w,
            authToken: O
        }
    } catch (q) {
        return _6(q), null
    }
}
// @from(Ln 164831, Col 0)
async function nj8(A, q, K = 500) {
    try {
        return new Promise((Y) => {
            let z = Wl3({
                host: A,
                port: q,
                timeout: K
            });
            z.on("connect", () => {
                z.destroy(), Y(!0)
            }), z.on("error", () => {
                Y(!1)
            }), z.on("timeout", () => {
                z.destroy(), Y(!1)
            })
        })
    } catch (Y) {
        return !1
    }
}
// @from(Ln 164851, Col 0)
async function Gl3() {
    let A = [],
        q = $1(),
        K = y8(),
        Y = lj8(c8(), "ide");
    try {
        await q.stat(Y), A.push(Y)
    } catch {}
    if (K !== "wsl") return A;
    let z = process.env.USERPROFILE;
    if (!z) try {
        let _ = yT("powershell.exe -Command '$env:USERPROFILE'");
        if (_) z = _.trim()
    } catch {
        k("Unable to get Windows USERPROFILE via PowerShell - IDE detection may be incomplete")
    }
    if (z) {
        let w = new nD6(process.env.WSL_DISTRO_NAME).toLocalPath(z),
            O = ij8(w, ".claude", "ide");
        try {
            await q.stat(O), A.push(O)
        } catch {}
    }
    try {
        let w = await q.readdir("/mnt/c/Users");
        for (let O of w) {
            if (O.name === "Public" || O.name === "Default" || O.name === "Default User" || O.name === "All Users") continue;
            let $ = lj8("/mnt/c/Users", O.name, ".claude", "ide");
            try {
                await q.stat($), A.push($)
            } catch {}
        }
    } catch (_) {
        let w = _.code;
        if (w === "ENOENT" || w === "EACCES" || w === "EPERM") k(`WSL IDE lockfile path detection failed (${w}): ${_1(_)}`);
        else _6(_)
    }
    return A
}
// @from(Ln 164890, Col 0)
async function fl3() {
    try {
        let A = await y$1();
        for (let q of A) {
            let K = await qR7(q);
            if (!K) {
                try {
                    await $1().unlink(q)
                } catch (_) {
                    _6(_)
                }
                continue
            }
            let Y = await jR7(K.runningInWindows, K.port),
                z = !1;
            if (K.pid) {
                if (!AR7(K.pid)) {
                    if (y8() !== "wsl") z = !0;
                    else if (!await nj8(Y, K.port)) z = !0
                }
            } else if (!await nj8(Y, K.port)) z = !0;
            if (z) try {
                await $1().unlink(q)
            } catch (_) {
                _6(_)
            }
        }
    } catch (A) {
        _6(A)
    }
}
// @from(Ln 164921, Col 0)
async function Tl3(A) {
    try {
        let q = await Nl3(A);
        if (d("tengu_ext_installed", {}), !X1().diffTool) d1((Y) => ({
            ...Y,
            diffTool: "auto"
        }));
        return {
            installed: !0,
            error: null,
            installedVersion: q,
            ideType: A
        }
    } catch (q) {
        d("tengu_ext_install_error", {});
        let K = q instanceof Error ? q.message : String(q);
        return _6(q), {
            installed: !1,
            error: K,
            installedVersion: null,
            ideType: A
        }
    }
}
// @from(Ln 164945, Col 0)
async function aL7() {
    if (V$1) V$1.abort();
    V$1 = sK();
    let A = V$1.signal;
    await fl3();
    let q = Date.now();
    while (Date.now() - q < 30000 && !A.aborted) {
        let K = await pX6(!1);
        if (A.aborted) return null;
        if (K.length === 1) return K[0];
        await new Promise((Y) => setTimeout(Y, 1000).unref())
    }
    return null
}
// @from(Ln 164959, Col 0)
async function pX6(A) {
    let q = [];
    try {
        let K = process.env.CLAUDE_CODE_SSE_PORT,
            Y = K ? parseInt(K) : null,
            z = AA().normalize("NFC"),
            _ = await y$1(),
            w = await Promise.all(_.map(qR7)),
            O = Zl3(),
            $ = y8() !== "wsl" && FM();
        for (let H of w) {
            if (!H) continue;
            let j = !1;
            if (t6(process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK)) j = !0;
            else if (H.port === Y) j = !0;
            else j = H.workspaceFolders.some((X) => {
                if (!X) return !1;
                let P = X;
                if (y8() === "wsl" && H.runningInWindows && process.env.WSL_DISTRO_NAME) {
                    if (!RN7(X, process.env.WSL_DISTRO_NAME)) return !1;
                    let Z = ij8(P).normalize("NFC");
                    if (z === Z || z.startsWith(Z + k$1)) return !0;
                    P = new nD6(process.env.WSL_DISTRO_NAME).toLocalPath(X)
                }
                let W = ij8(P).normalize("NFC");
                if (y8() === "windows") {
                    let Z = z.replace(/^[a-zA-Z]:/, (f) => f.toUpperCase()),
                        G = W.replace(/^[a-zA-Z]:/, (f) => f.toUpperCase());
                    return Z === G || Z.startsWith(G + k$1)
                }
                return z === W || z.startsWith(W + k$1)
            });
            if (!j && !A) continue;
            if ($) {
                if (!(Y !== null && H.port === Y)) {
                    if (!H.pid || !AR7(H.pid)) continue;
                    if (process.ppid !== H.pid) {
                        if (!(await O()).has(H.pid)) continue
                    }
                }
            }
            let J = H.ideName ?? (FM() ? Y$(LT.terminal) : "IDE"),
                M = await jR7(H.runningInWindows, H.port),
                D;
            if (H.useWebSocket) D = `ws://${M}:${H.port}`;
            else D = `http://${M}:${H.port}/sse`;
            q.push({
                url: D,
                name: J,
                workspaceFolders: H.workspaceFolders,
                port: H.port,
                isValid: j,
                authToken: H.authToken,
                ideRunningInWindows: H.runningInWindows
            })
        }
        if (!A && Y) {
            let H = q.filter((j) => j.isValid && j.port === Y);
            if (H.length === 1) return H
        }
    } catch (K) {
        _6(K)
    }
    return q
}
// @from(Ln 165024, Col 0)
async function KR7(A) {
    await A.notification({
        method: "ide_connected",
        params: {
            pid: process.pid
        }
    })
}
// @from(Ln 165033, Col 0)
function L$1(A) {
    return A.some((q) => q.type === "connected" && q.name === "ide")
}
// @from(Ln 165036, Col 0)
async function sL7(A) {
    if (E$1(A)) {
        let q = await YR7(A);
        if (q) try {
            if ((await RA(q, ["--list-extensions"], {
                    env: oj8()
                })).stdout?.includes(vl3)) return !0
        } catch {}
    } else if (FC(A)) return await EN7(A);
    return !1
}
// @from(Ln 165047, Col 0)
async function Nl3(A) {
    if (E$1(A)) {
        let q = await YR7(A);
        if (q) {
            let K = await Vl3(q);
            if (!K || iD6(K, tL7())) {
                await new Promise((z) => {
                    setTimeout(z, 500)
                });
                let Y = await RA(q, ["--force", "--install-extension", "anthropic.claude-code"], {
                    env: oj8()
                });
                if (Y.code !== 0) throw Error(`${Y.code}: ${Y.error} ${Y.stderr}`);
                K = tL7()
            }
            return K
        }
    }
    return null
}
// @from(Ln 165068, Col 0)
function oj8() {
    if (y8() === "linux") return {
        ...process.env,
        DISPLAY: ""
    };
    return
}
// @from(Ln 165076, Col 0)
function tL7() {
    return {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION
}
// @from(Ln 165086, Col 0)
async function Vl3(A) {
    let {
        stdout: q
    } = await z8(A, ["--list-extensions", "--show-versions"], {
        env: oj8()
    }), K = q?.split(`
`) || [];
    for (let Y of K) {
        let [z, _] = Y.split("@");
        if (z === "anthropic.claude-code" && _) return _
    }
    return null
}
// @from(Ln 165100, Col 0)
function kl3() {
    try {
        if (y8() !== "macos") return null;
        let q = process.ppid;
        for (let K = 0; K < 10; K++) {
            if (!q || q === 0 || q === 1) break;
            let Y = yT(`ps -o command= -p ${q}`)?.trim();
            if (Y) {
                let _ = {
                        "Visual Studio Code.app": "code",
                        "Cursor.app": "cursor",
                        "Windsurf.app": "windsurf",
                        "Visual Studio Code - Insiders.app": "code",
                        "VSCodium.app": "codium"
                    },
                    w = "/Contents/MacOS/Electron";
                for (let [O, $] of Object.entries(_)) {
                    let H = Y.indexOf(O + "/Contents/MacOS/Electron");
                    if (H !== -1) {
                        let j = H + O.length;
                        return Y.substring(0, j) + "/Contents/Resources/app/bin/" + $
                    }
                }
            }
            let z = yT(`ps -o ppid= -p ${q}`)?.trim();
            if (!z) break;
            q = parseInt(z.trim())
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 165133, Col 0)
async function YR7(A) {
    let q = kl3();
    if (q) try {
        return await $1().stat(q), q
    } catch {}
    let K = y8() === "windows" ? ".cmd" : "";
    switch (A) {
        case "vscode":
            return "code" + K;
        case "cursor":
            return "cursor" + K;
        case "windsurf":
            return "windsurf" + K;
        default:
            break
    }
    return null
}
// @from(Ln 165151, Col 0)
async function zR7() {
    return (await z8("cursor", ["--version"])).code === 0
}
// @from(Ln 165154, Col 0)
async function _R7() {
    return (await z8("windsurf", ["--version"])).code === 0
}
// @from(Ln 165157, Col 0)
async function wR7() {
    let A = await z8("code", ["--help"]);
    return A.code === 0 && Boolean(A.stdout?.includes("Visual Studio Code"))
}
// @from(Ln 165161, Col 0)
async function El3() {
    let A = [];
    try {
        let q = y8();
        if (q === "macos") {
            let Y = (await q9('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep', {
                shell: !0,
                reject: !1
            })).stdout ?? "";
            for (let [z, _] of Object.entries(gX6))
                for (let w of _.processKeywordsMac)
                    if (Y.includes(w)) {
                        A.push(z);
                        break
                    }
        } else if (q === "windows") {
            let z = ((await q9('tasklist | findstr /I "Code.exe Cursor.exe Windsurf.exe idea64.exe pycharm64.exe webstorm64.exe phpstorm64.exe rubymine64.exe clion64.exe goland64.exe rider64.exe datagrip64.exe appcode.exe dataspell64.exe aqua64.exe gateway64.exe fleet.exe studio64.exe"', {
                shell: !0,
                reject: !1
            })).stdout ?? "").toLowerCase();
            for (let [_, w] of Object.entries(gX6))
                for (let O of w.processKeywordsWindows)
                    if (z.includes(O.toLowerCase())) {
                        A.push(_);
                        break
                    }
        } else if (q === "linux") {
            let z = ((await q9('ps aux | grep -E "code|cursor|windsurf|idea|pycharm|webstorm|phpstorm|rubymine|clion|goland|rider|datagrip|dataspell|aqua|gateway|fleet|android-studio" | grep -v grep', {
                shell: !0,
                reject: !1
            })).stdout ?? "").toLowerCase();
            for (let [_, w] of Object.entries(gX6))
                for (let O of w.processKeywordsLinux)
                    if (z.includes(O)) {
                        if (_ !== "vscode") {
                            A.push(_);
                            break
                        } else if (!z.includes("cursor") && !z.includes("appcode")) {
                            A.push(_);
                            break
                        }
                    }
        }
    } catch (q) {
        _6(q)
    }
    return A
}
// @from(Ln 165209, Col 0)
async function aj8() {
    let A = await El3();
    return rj8 = A, A
}
// @from(Ln 165213, Col 0)
async function OR7() {
    if (rj8 === null) return aj8();
    return rj8
}
// @from(Ln 165218, Col 0)
function R$1(A) {
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return sj8(q)
}
// @from(Ln 165223, Col 0)
function sj8(A) {
    let q = A?.config;
    return q?.type === "sse-ide" || q?.type === "ws-ide" ? q.ideName : FM() ? Y$(LT.terminal) : null
}
// @from(Ln 165228, Col 0)
function Y$(A) {
    if (!A) return "IDE";
    let q = gX6[A];
    if (q) return q.displayName;
    let K = eL7[A.toLowerCase().trim()];
    if (K) return K;
    let Y = A.split(" ")[0],
        z = Y ? Pl3(Y).toLowerCase() : null;
    if (z) {
        let _ = eL7[z];
        if (_) return _;
        return EU(z)
    }
    return EU(A)
}
// @from(Ln 165244, Col 0)
function Gv(A) {
    if (!A) return;
    let q = A.find((K) => K.type === "connected" && K.name === "ide");
    return q?.type === "connected" ? q : void 0
}
// @from(Ln 165249, Col 0)
async function $R7(A) {
    try {
        await pC("closeAllDiffTabs", {}, A)
    } catch (q) {}
}
// @from(Ln 165254, Col 0)
async function HR7(A, q, K, Y) {
    aL7().then(A);
    let z = X1().autoInstallIdeExtension ?? !0;
    if (!t6(process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL) && z) {
        let _ = q ?? BX6();
        if (_) {
            if (E$1(_)) sL7(_).then(async (w) => {
                Tl3(_).catch((O) => {
                    return {
                        installed: !1,
                        error: O.message || "Installation failed",
                        installedVersion: null,
                        ideType: _
                    }
                }).then((O) => {
                    if (Y(O), O?.installed) aL7().then(A);
                    if (!w && O?.installed === !0 && !oL7().hasIdeOnboardingDialogBeenShown()) K()
                })
            });
            else if (FC(_)) sL7(_).then(async (w) => {
                if (w && !oL7().hasIdeOnboardingDialogBeenShown()) K()
            })
        }
    }
}
// @from(Ln 165279, Col 4)
oL7 = () => (cj8(), k4(rL7))
// @from(Ln 165280, Col 4)
gX6
// @from(Ln 165280, Col 9)
lu6
// @from(Ln 165280, Col 14)
FX6
// @from(Ln 165280, Col 19)
FM
// @from(Ln 165280, Col 23)
V$1 = null
// @from(Ln 165281, Col 4)
vl3 = "anthropic.claude-code"
// @from(Ln 165282, Col 4)
rj8 = null
// @from(Ln 165283, Col 4)
eL7
// @from(Ln 165283, Col 9)
jR7
// @from(Ln 165284, Col 4)
Sw = E(() => {
    d3();
    A8();
    _H6();
    Eq();
    WW();
    k8();
    V1();
    Ou6();
    U4();
    T1();
    SA();
    k1();
    YK();
    QP();
    k$8();
    E$8();
    H1();
    U$();
    Zr();
    g1();
    s8();
    gX6 = {
        cursor: {
            ideKind: "vscode",
            displayName: "Cursor",
            processKeywordsMac: ["Cursor Helper", "Cursor.app"],
            processKeywordsWindows: ["cursor.exe"],
            processKeywordsLinux: ["cursor"]
        },
        windsurf: {
            ideKind: "vscode",
            displayName: "Windsurf",
            processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
            processKeywordsWindows: ["windsurf.exe"],
            processKeywordsLinux: ["windsurf"]
        },
        vscode: {
            ideKind: "vscode",
            displayName: "VS Code",
            processKeywordsMac: ["Visual Studio Code", "Code Helper"],
            processKeywordsWindows: ["code.exe"],
            processKeywordsLinux: ["code"]
        },
        intellij: {
            ideKind: "jetbrains",
            displayName: "IntelliJ IDEA",
            processKeywordsMac: ["IntelliJ IDEA"],
            processKeywordsWindows: ["idea64.exe"],
            processKeywordsLinux: ["idea", "intellij"]
        },
        pycharm: {
            ideKind: "jetbrains",
            displayName: "PyCharm",
            processKeywordsMac: ["PyCharm"],
            processKeywordsWindows: ["pycharm64.exe"],
            processKeywordsLinux: ["pycharm"]
        },
        webstorm: {
            ideKind: "jetbrains",
            displayName: "WebStorm",
            processKeywordsMac: ["WebStorm"],
            processKeywordsWindows: ["webstorm64.exe"],
            processKeywordsLinux: ["webstorm"]
        },
        phpstorm: {
            ideKind: "jetbrains",
            displayName: "PhpStorm",
            processKeywordsMac: ["PhpStorm"],
            processKeywordsWindows: ["phpstorm64.exe"],
            processKeywordsLinux: ["phpstorm"]
        },
        rubymine: {
            ideKind: "jetbrains",
            displayName: "RubyMine",
            processKeywordsMac: ["RubyMine"],
            processKeywordsWindows: ["rubymine64.exe"],
            processKeywordsLinux: ["rubymine"]
        },
        clion: {
            ideKind: "jetbrains",
            displayName: "CLion",
            processKeywordsMac: ["CLion"],
            processKeywordsWindows: ["clion64.exe"],
            processKeywordsLinux: ["clion"]
        },
        goland: {
            ideKind: "jetbrains",
            displayName: "GoLand",
            processKeywordsMac: ["GoLand"],
            processKeywordsWindows: ["goland64.exe"],
            processKeywordsLinux: ["goland"]
        },
        rider: {
            ideKind: "jetbrains",
            displayName: "Rider",
            processKeywordsMac: ["Rider"],
            processKeywordsWindows: ["rider64.exe"],
            processKeywordsLinux: ["rider"]
        },
        datagrip: {
            ideKind: "jetbrains",
            displayName: "DataGrip",
            processKeywordsMac: ["DataGrip"],
            processKeywordsWindows: ["datagrip64.exe"],
            processKeywordsLinux: ["datagrip"]
        },
        appcode: {
            ideKind: "jetbrains",
            displayName: "AppCode",
            processKeywordsMac: ["AppCode"],
            processKeywordsWindows: ["appcode.exe"],
            processKeywordsLinux: ["appcode"]
        },
        dataspell: {
            ideKind: "jetbrains",
            displayName: "DataSpell",
            processKeywordsMac: ["DataSpell"],
            processKeywordsWindows: ["dataspell64.exe"],
            processKeywordsLinux: ["dataspell"]
        },
        aqua: {
            ideKind: "jetbrains",
            displayName: "Aqua",
            processKeywordsMac: [],
            processKeywordsWindows: ["aqua64.exe"],
            processKeywordsLinux: []
        },
        gateway: {
            ideKind: "jetbrains",
            displayName: "Gateway",
            processKeywordsMac: [],
            processKeywordsWindows: ["gateway64.exe"],
            processKeywordsLinux: []
        },
        fleet: {
            ideKind: "jetbrains",
            displayName: "Fleet",
            processKeywordsMac: [],
            processKeywordsWindows: ["fleet.exe"],
            processKeywordsLinux: []
        },
        androidstudio: {
            ideKind: "jetbrains",
            displayName: "Android Studio",
            processKeywordsMac: ["Android Studio"],
            processKeywordsWindows: ["studio64.exe"],
            processKeywordsLinux: ["android-studio"]
        }
    };
    lu6 = e1(() => {
        return E$1(Q8.terminal)
    }), FX6 = e1(() => {
        return FC(LT.terminal)
    }), FM = e1(() => {
        return lu6() || FX6() || Boolean(process.env.FORCE_CODE_TERMINAL)
    });
    eL7 = {
        code: "VS Code",
        cursor: "Cursor",
        windsurf: "Windsurf",
        antigravity: "Antigravity",
        vi: "Vim",
        vim: "Vim",
        nano: "nano",
        notepad: "Notepad",
        "start /wait notepad": "Notepad",
        emacs: "Emacs",
        subl: "Sublime Text",
        atom: "Atom"
    };
    jR7 = e1(async (A, q) => {
        if (process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE) return process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE;
        if (y8() !== "wsl" || !A) return "127.0.0.1";
        try {
            let K = await q9("ip route show | grep -i default", {
                shell: !0,
                reject: !1
            });
            if (K.exitCode === 0 && K.stdout) {
                let Y = K.stdout.match(/default via (\d+\.\d+\.\d+\.\d+)/);
                if (Y) {
                    let z = Y[1];
                    if (await nj8(z, q)) return z
                }
            }
        } catch (K) {}
        return "127.0.0.1"
    }, (A, q) => `${A}:${q}`)
})
// @from(Ln 165475, Col 0)
function yl3() {
    let A = Lu1();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
    if (!q) return k("CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR not set, no file descriptor token available", {
        level: "debug"
    }), s86(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return k(`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`, {
        level: "error"
    }), s86(null), null;
    try {
        let Y = $1(),
            z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            _ = Y.readFileSync(z, {
                encoding: "utf8"
            }).trim();
        if (!_) return k("File descriptor contained empty token", {
            level: "error"
        }), s86(null), null;
        return k(`Successfully read token from file descriptor ${K}`), s86(_), _
    } catch (Y) {
        return k(`Failed to read token from file descriptor ${K}: ${_1(Y)}`, {
            level: "error"
        }), s86(null), null
    }
}
// @from(Ln 165503, Col 0)
function UW() {
    let A = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
    if (A) return A;
    return yl3()
}
// @from(Ln 165509, Col 0)
function QX6() {
    let A = UW();
    if (!A) return {};
    if (A.startsWith("sk-ant-sid")) {
        let q = {
                Cookie: `sessionKey=${A}`
            },
            K = process.env.CLAUDE_CODE_ORGANIZATION_UUID;
        if (K) q["X-Organization-Uuid"] = K;
        return q
    }
    return {
        Authorization: `Bearer ${A}`
    }
}
// @from(Ln 165525, Col 0)
function iu6(A) {
    process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN = A
}
// @from(Ln 165528, Col 4)
gL = E(() => {
    H1();
    SA();
    T1();
    s8()
})
// @from(Ln 165535, Col 0)
function Ll3(A) {
    let q = A,
        K = "",
        Y = 0,
        z = 10;
    while (q !== K && Y < z) K = q, q = q.normalize("NFKC"), q = q.replace(/[\p{Cf}\p{Co}\p{Cn}]/gu, ""), q = q.replace(/[\u200B-\u200F]/g, "").replace(/[\u202A-\u202E]/g, "").replace(/[\u2066-\u2069]/g, "").replace(/[\uFEFF]/g, "").replace(/[\uE000-\uF8FF]/g, ""), Y++;
    if (Y >= z) throw Error(`Unicode sanitization reached maximum iterations (${z}) for input: ${A.slice(0,100)}`);
    return q
}
// @from(Ln 165545, Col 0)
function Ws(A) {
    if (typeof A === "string") return Ll3(A);
    if (Array.isArray(A)) return A.map(Ws);
    if (A !== null && typeof A === "object") {
        let q = {};
        for (let [K, Y] of Object.entries(A)) q[Ws(K)] = Ws(Y);
        return q
    }
    return A
}
// @from(Ln 165555, Col 4)
ej8 = x((v92, S$1) => {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var JR7, MR7, DR7, XR7, PR7, WR7, ZR7, GR7, fR7, h$1, tj8, TR7, vR7, UX6, NR7, VR7, kR7, ER7, yR7, LR7, RR7, hR7, SR7;
    (function(A) {
        var q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(Y) {
            A(K(q, K(Y)))
        });
        else if (typeof S$1 === "object" && typeof v92 === "object") A(K(q, K(v92)));
        else A(K(q));

        function K(Y, z) {
            if (Y !== q)
                if (typeof Object.create === "function") Object.defineProperty(Y, "__esModule", {
                    value: !0
                });
                else Y.__esModule = !0;
            return function(_, w) {
                return Y[_] = z ? z(_, w) : w
            }
        }
    })(function(A) {
        var q = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(K, Y) {
            K.__proto__ = Y
        } || function(K, Y) {
            for (var z in Y)
                if (Y.hasOwnProperty(z)) K[z] = Y[z]
        };
        JR7 = function(K, Y) {
            q(K, Y);

            function z() {
                this.constructor = K
            }
            K.prototype = Y === null ? Object.create(Y) : (z.prototype = Y.prototype, new z)
        }, MR7 = Object.assign || function(K) {
            for (var Y, z = 1, _ = arguments.length; z < _; z++) {
                Y = arguments[z];
                for (var w in Y)
                    if (Object.prototype.hasOwnProperty.call(Y, w)) K[w] = Y[w]
            }
            return K
        }, DR7 = function(K, Y) {
            var z = {};
            for (var _ in K)
                if (Object.prototype.hasOwnProperty.call(K, _) && Y.indexOf(_) < 0) z[_] = K[_];
            if (K != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var w = 0, _ = Object.getOwnPropertySymbols(K); w < _.length; w++)
                    if (Y.indexOf(_[w]) < 0 && Object.prototype.propertyIsEnumerable.call(K, _[w])) z[_[w]] = K[_[w]]
            }
            return z
        }, XR7 = function(K, Y, z, _) {
            var w = arguments.length,
                O = w < 3 ? Y : _ === null ? _ = Object.getOwnPropertyDescriptor(Y, z) : _,
                $;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") O = Reflect.decorate(K, Y, z, _);
            else
                for (var H = K.length - 1; H >= 0; H--)
                    if ($ = K[H]) O = (w < 3 ? $(O) : w > 3 ? $(Y, z, O) : $(Y, z)) || O;
            return w > 3 && O && Object.defineProperty(Y, z, O), O
        }, PR7 = function(K, Y) {
            return function(z, _) {
                Y(z, _, K)
            }
        }, WR7 = function(K, Y) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(K, Y)
        }, ZR7 = function(K, Y, z, _) {
            function w(O) {
                return O instanceof z ? O : new z(function($) {
                    $(O)
                })
            }
            return new(z || (z = Promise))(function(O, $) {
                function H(M) {
                    try {
                        J(_.next(M))
                    } catch (D) {
                        $(D)
                    }
                }

                function j(M) {
                    try {
                        J(_.throw(M))
                    } catch (D) {
                        $(D)
                    }
                }

                function J(M) {
                    M.done ? O(M.value) : w(M.value).then(H, j)
                }
                J((_ = _.apply(K, Y || [])).next())
            })
        }, GR7 = function(K, Y) {
            var z = {
                    label: 0,
                    sent: function() {
                        if (O[0] & 1) throw O[1];
                        return O[1]
                    },
                    trys: [],
                    ops: []
                },
                _, w, O, $;
            return $ = {
                next: H(0),
                throw: H(1),
                return: H(2)
            }, typeof Symbol === "function" && ($[Symbol.iterator] = function() {
                return this
            }), $;

            function H(J) {
                return function(M) {
                    return j([J, M])
                }
            }

            function j(J) {
                if (_) throw TypeError("Generator is already executing.");
                while (z) try {
                    if (_ = 1, w && (O = J[0] & 2 ? w.return : J[0] ? w.throw || ((O = w.return) && O.call(w), 0) : w.next) && !(O = O.call(w, J[1])).done) return O;
                    if (w = 0, O) J = [J[0] & 2, O.value];
                    switch (J[0]) {
                        case 0:
                        case 1:
                            O = J;
                            break;
                        case 4:
                            return z.label++, {
                                value: J[1],
                                done: !1
                            };
                        case 5:
                            z.label++, w = J[1], J = [0];
                            continue;
                        case 7:
                            J = z.ops.pop(), z.trys.pop();
                            continue;
                        default:
                            if ((O = z.trys, !(O = O.length > 0 && O[O.length - 1])) && (J[0] === 6 || J[0] === 2)) {
                                z = 0;
                                continue
                            }
                            if (J[0] === 3 && (!O || J[1] > O[0] && J[1] < O[3])) {
                                z.label = J[1];
                                break
                            }
                            if (J[0] === 6 && z.label < O[1]) {
                                z.label = O[1], O = J;
                                break
                            }
                            if (O && z.label < O[2]) {
                                z.label = O[2], z.ops.push(J);
                                break
                            }
                            if (O[2]) z.ops.pop();
                            z.trys.pop();
                            continue
                    }
                    J = Y.call(K, z)
                } catch (M) {
                    J = [6, M], w = 0
                } finally {
                    _ = O = 0
                }
                if (J[0] & 5) throw J[1];
                return {
                    value: J[0] ? J[1] : void 0,
                    done: !0
                }
            }
        }, SR7 = function(K, Y, z, _) {
            if (_ === void 0) _ = z;
            K[_] = Y[z]
        }, fR7 = function(K, Y) {
            for (var z in K)
                if (z !== "default" && !Y.hasOwnProperty(z)) Y[z] = K[z]
        }, h$1 = function(K) {
            var Y = typeof Symbol === "function" && Symbol.iterator,
                z = Y && K[Y],
                _ = 0;
            if (z) return z.call(K);
            if (K && typeof K.length === "number") return {
                next: function() {
                    if (K && _ >= K.length) K = void 0;
                    return {
                        value: K && K[_++],
                        done: !K
                    }
                }
            };
            throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, tj8 = function(K, Y) {
            var z = typeof Symbol === "function" && K[Symbol.iterator];
            if (!z) return K;
            var _ = z.call(K),
                w, O = [],
                $;
            try {
                while ((Y === void 0 || Y-- > 0) && !(w = _.next()).done) O.push(w.value)
            } catch (H) {
                $ = {
                    error: H
                }
            } finally {
                try {
                    if (w && !w.done && (z = _.return)) z.call(_)
                } finally {
                    if ($) throw $.error
                }
            }
            return O
        }, TR7 = function() {
            for (var K = [], Y = 0; Y < arguments.length; Y++) K = K.concat(tj8(arguments[Y]));
            return K
        }, vR7 = function() {
            for (var K = 0, Y = 0, z = arguments.length; Y < z; Y++) K += arguments[Y].length;
            for (var _ = Array(K), w = 0, Y = 0; Y < z; Y++)
                for (var O = arguments[Y], $ = 0, H = O.length; $ < H; $++, w++) _[w] = O[$];
            return _
        }, UX6 = function(K) {
            return this instanceof UX6 ? (this.v = K, this) : new UX6(K)
        }, NR7 = function(K, Y, z) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var _ = z.apply(K, Y || []),
                w, O = [];
            return w = {}, $("next"), $("throw"), $("return"), w[Symbol.asyncIterator] = function() {
                return this
            }, w;

            function $(X) {
                if (_[X]) w[X] = function(P) {
                    return new Promise(function(W, Z) {
                        O.push([X, P, W, Z]) > 1 || H(X, P)
                    })
                }
            }

            function H(X, P) {
                try {
                    j(_[X](P))
                } catch (W) {
                    D(O[0][3], W)
                }
            }

            function j(X) {
                X.value instanceof UX6 ? Promise.resolve(X.value.v).then(J, M) : D(O[0][2], X)
            }

            function J(X) {
                H("next", X)
            }

            function M(X) {
                H("throw", X)
            }

            function D(X, P) {
                if (X(P), O.shift(), O.length) H(O[0][0], O[0][1])
            }
        }, VR7 = function(K) {
            var Y, z;
            return Y = {}, _("next"), _("throw", function(w) {
                throw w
            }), _("return"), Y[Symbol.iterator] = function() {
                return this
            }, Y;

            function _(w, O) {
                Y[w] = K[w] ? function($) {
                    return (z = !z) ? {
                        value: UX6(K[w]($)),
                        done: w === "return"
                    } : O ? O($) : $
                } : O
            }
        }, kR7 = function(K) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var Y = K[Symbol.asyncIterator],
                z;
            return Y ? Y.call(K) : (K = typeof h$1 === "function" ? h$1(K) : K[Symbol.iterator](), z = {}, _("next"), _("throw"), _("return"), z[Symbol.asyncIterator] = function() {
                return this
            }, z);

            function _(O) {
                z[O] = K[O] && function($) {
                    return new Promise(function(H, j) {
                        $ = K[O]($), w(H, j, $.done, $.value)
                    })
                }
            }

            function w(O, $, H, j) {
                Promise.resolve(j).then(function(J) {
                    O({
                        value: J,
                        done: H
                    })
                }, $)
            }
        }, ER7 = function(K, Y) {
            if (Object.defineProperty) Object.defineProperty(K, "raw", {
                value: Y
            });
            else K.raw = Y;
            return K
        }, yR7 = function(K) {
            if (K && K.__esModule) return K;
            var Y = {};
            if (K != null) {
                for (var z in K)
                    if (Object.hasOwnProperty.call(K, z)) Y[z] = K[z]
            }
            return Y.default = K, Y
        }, LR7 = function(K) {
            return K && K.__esModule ? K : {
                default: K
            }
        }, RR7 = function(K, Y) {
            if (!Y.has(K)) throw TypeError("attempted to get private field on non-instance");
            return Y.get(K)
        }, hR7 = function(K, Y, z) {
            if (!Y.has(K)) throw TypeError("attempted to set private field on non-instance");
            return Y.set(K, z), z
        }, A("__extends", JR7), A("__assign", MR7), A("__rest", DR7), A("__decorate", XR7), A("__param", PR7), A("__metadata", WR7), A("__awaiter", ZR7), A("__generator", GR7), A("__exportStar", fR7), A("__createBinding", SR7), A("__values", h$1), A("__read", tj8), A("__spread", TR7), A("__spreadArrays", vR7), A("__await", UX6), A("__asyncGenerator", NR7), A("__asyncDelegator", VR7), A("__asyncValues", kR7), A("__makeTemplateObject", ER7), A("__importStar", yR7), A("__importDefault", LR7), A("__classPrivateFieldGet", RR7), A("__classPrivateFieldSet", hR7)
    })
})
// @from(Ln 165901, Col 4)
AJ8 = x((CR7) => {
    Object.defineProperty(CR7, "__esModule", {
        value: !0
    });
    CR7.MAX_HASHABLE_LENGTH = CR7.INIT = CR7.KEY = CR7.DIGEST_LENGTH = CR7.BLOCK_SIZE = void 0;
    CR7.BLOCK_SIZE = 64;
    CR7.DIGEST_LENGTH = 32;
    CR7.KEY = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
    CR7.INIT = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    CR7.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1
})
// @from(Ln 165912, Col 4)
uR7 = x((bR7) => {
    Object.defineProperty(bR7, "__esModule", {
        value: !0
    });
    bR7.RawSha256 = void 0;
    var FL = AJ8(),
        Il3 = function() {
            function A() {
                this.state = Int32Array.from(FL.INIT), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1
            }
            return A.prototype.update = function(q) {
                if (this.finished) throw Error("Attempted to update an already finished hash.");
                var K = 0,
                    Y = q.byteLength;
                if (this.bytesHashed += Y, this.bytesHashed * 8 > FL.MAX_HASHABLE_LENGTH) throw Error("Cannot hash more than 2^53 - 1 bits");
                while (Y > 0)
                    if (this.buffer[this.bufferLength++] = q[K++], Y--, this.bufferLength === FL.BLOCK_SIZE) this.hashBuffer(), this.bufferLength = 0
            }, A.prototype.digest = function() {
                if (!this.finished) {
                    var q = this.bytesHashed * 8,
                        K = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength),
                        Y = this.bufferLength;
                    if (K.setUint8(this.bufferLength++, 128), Y % FL.BLOCK_SIZE >= FL.BLOCK_SIZE - 8) {
                        for (var z = this.bufferLength; z < FL.BLOCK_SIZE; z++) K.setUint8(z, 0);
                        this.hashBuffer(), this.bufferLength = 0
                    }
                    for (var z = this.bufferLength; z < FL.BLOCK_SIZE - 8; z++) K.setUint8(z, 0);
                    K.setUint32(FL.BLOCK_SIZE - 8, Math.floor(q / 4294967296), !0), K.setUint32(FL.BLOCK_SIZE - 4, q), this.hashBuffer(), this.finished = !0
                }
                var _ = new Uint8Array(FL.DIGEST_LENGTH);
                for (var z = 0; z < 8; z++) _[z * 4] = this.state[z] >>> 24 & 255, _[z * 4 + 1] = this.state[z] >>> 16 & 255, _[z * 4 + 2] = this.state[z] >>> 8 & 255, _[z * 4 + 3] = this.state[z] >>> 0 & 255;
                return _
            }, A.prototype.hashBuffer = function() {
                var q = this,
                    K = q.buffer,
                    Y = q.state,
                    z = Y[0],
                    _ = Y[1],
                    w = Y[2],
                    O = Y[3],
                    $ = Y[4],
                    H = Y[5],
                    j = Y[6],
                    J = Y[7];
                for (var M = 0; M < FL.BLOCK_SIZE; M++) {
                    if (M < 16) this.temp[M] = (K[M * 4] & 255) << 24 | (K[M * 4 + 1] & 255) << 16 | (K[M * 4 + 2] & 255) << 8 | K[M * 4 + 3] & 255;
                    else {
                        var D = this.temp[M - 2],
                            X = (D >>> 17 | D << 15) ^ (D >>> 19 | D << 13) ^ D >>> 10;
                        D = this.temp[M - 15];
                        var P = (D >>> 7 | D << 25) ^ (D >>> 18 | D << 14) ^ D >>> 3;
                        this.temp[M] = (X + this.temp[M - 7] | 0) + (P + this.temp[M - 16] | 0)
                    }
                    var W = ((($ >>> 6 | $ << 26) ^ ($ >>> 11 | $ << 21) ^ ($ >>> 25 | $ << 7)) + ($ & H ^ ~$ & j) | 0) + (J + (FL.KEY[M] + this.temp[M] | 0) | 0) | 0,
                        Z = ((z >>> 2 | z << 30) ^ (z >>> 13 | z << 19) ^ (z >>> 22 | z << 10)) + (z & _ ^ z & w ^ _ & w) | 0;
                    J = j, j = H, H = $, $ = O + W | 0, O = w, w = _, _ = z, z = W + Z | 0
                }
                Y[0] += z, Y[1] += _, Y[2] += w, Y[3] += O, Y[4] += $, Y[5] += H, Y[6] += j, Y[7] += J
            }, A
        }();
    bR7.RawSha256 = Il3
})
// @from(Ln 165974, Col 4)
gR7 = x((mR7) => {
    Object.defineProperty(mR7, "__esModule", {
        value: !0
    });
    mR7.toUtf8 = mR7.fromUtf8 = void 0;
    var bl3 = (A) => {
        let q = [];
        for (let K = 0, Y = A.length; K < Y; K++) {
            let z = A.charCodeAt(K);
            if (z < 128) q.push(z);
            else if (z < 2048) q.push(z >> 6 | 192, z & 63 | 128);
            else if (K + 1 < A.length && (z & 64512) === 55296 && (A.charCodeAt(K + 1) & 64512) === 56320) {
                let _ = 65536 + ((z & 1023) << 10) + (A.charCodeAt(++K) & 1023);
                q.push(_ >> 18 | 240, _ >> 12 & 63 | 128, _ >> 6 & 63 | 128, _ & 63 | 128)
            } else q.push(z >> 12 | 224, z >> 6 & 63 | 128, z & 63 | 128)
        }
        return Uint8Array.from(q)
    };
    mR7.fromUtf8 = bl3;
    var xl3 = (A) => {
        let q = "";
        for (let K = 0, Y = A.length; K < Y; K++) {
            let z = A[K];
            if (z < 128) q += String.fromCharCode(z);
            else if (192 <= z && z < 224) {
                let _ = A[++K];
                q += String.fromCharCode((z & 31) << 6 | _ & 63)
            } else if (240 <= z && z < 365) {
                let w = "%" + [z, A[++K], A[++K], A[++K]].map((O) => O.toString(16)).join("%");
                q += decodeURIComponent(w)
            } else q += String.fromCharCode((z & 15) << 12 | (A[++K] & 63) << 6 | A[++K] & 63)
        }
        return q
    };
    mR7.toUtf8 = xl3
})
// @from(Ln 166010, Col 4)
QR7 = x((FR7) => {
    Object.defineProperty(FR7, "__esModule", {
        value: !0
    });
    FR7.toUtf8 = FR7.fromUtf8 = void 0;

    function ml3(A) {
        return new TextEncoder().encode(A)
    }
    FR7.fromUtf8 = ml3;

    function Bl3(A) {
        return new TextDecoder("utf-8").decode(A)
    }
    FR7.toUtf8 = Bl3
})
// @from(Ln 166026, Col 4)
qJ8 = x((cR7) => {
    Object.defineProperty(cR7, "__esModule", {
        value: !0
    });
    cR7.toUtf8 = cR7.fromUtf8 = void 0;
    var UR7 = gR7(),
        dR7 = QR7(),
        Fl3 = (A) => typeof TextEncoder === "function" ? (0, dR7.fromUtf8)(A) : (0, UR7.fromUtf8)(A);
    cR7.fromUtf8 = Fl3;
    var pl3 = (A) => typeof TextDecoder === "function" ? (0, dR7.toUtf8)(A) : (0, UR7.toUtf8)(A);
    cR7.toUtf8 = pl3
})
// @from(Ln 166038, Col 4)
rR7 = x((iR7) => {
    Object.defineProperty(iR7, "__esModule", {
        value: !0
    });
    iR7.convertToBuffer = void 0;
    var Ul3 = qJ8(),
        dl3 = typeof Buffer < "u" && Buffer.from ? function(A) {
            return Buffer.from(A, "utf8")
        } : Ul3.fromUtf8;

    function cl3(A) {
        if (A instanceof Uint8Array) return A;
        if (typeof A === "string") return dl3(A);
        if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(A)
    }
    iR7.convertToBuffer = cl3
})
// @from(Ln 166056, Col 4)
sR7 = x((oR7) => {
    Object.defineProperty(oR7, "__esModule", {
        value: !0
    });
    oR7.isEmptyData = void 0;

    function ll3(A) {
        if (typeof A === "string") return A.length === 0;
        return A.byteLength === 0
    }
    oR7.isEmptyData = ll3
})
// @from(Ln 166068, Col 4)
Ah7 = x((tR7) => {
    Object.defineProperty(tR7, "__esModule", {
        value: !0
    });
    tR7.numToUint8 = void 0;

    function il3(A) {
        return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
    }
    tR7.numToUint8 = il3
})
// @from(Ln 166079, Col 4)
Yh7 = x((qh7) => {
    Object.defineProperty(qh7, "__esModule", {
        value: !0
    });
    qh7.uint32ArrayFrom = void 0;

    function nl3(A) {
        if (!Uint32Array.from) {
            var q = new Uint32Array(A.length),
                K = 0;
            while (K < A.length) q[K] = A[K], K += 1;
            return q
        }
        return Uint32Array.from(A)
    }
    qh7.uint32ArrayFrom = nl3
})
// @from(Ln 166096, Col 4)
zh7 = x((dX6) => {
    Object.defineProperty(dX6, "__esModule", {
        value: !0
    });
    dX6.uint32ArrayFrom = dX6.numToUint8 = dX6.isEmptyData = dX6.convertToBuffer = void 0;
    var rl3 = rR7();
    Object.defineProperty(dX6, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return rl3.convertToBuffer
        }
    });
    var ol3 = sR7();
    Object.defineProperty(dX6, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return ol3.isEmptyData
        }
    });
    var al3 = Ah7();
    Object.defineProperty(dX6, "numToUint8", {
        enumerable: !0,
        get: function() {
            return al3.numToUint8
        }
    });
    var sl3 = Yh7();
    Object.defineProperty(dX6, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return sl3.uint32ArrayFrom
        }
    })
})
// @from(Ln 166130, Col 4)
$h7 = x((wh7) => {
    Object.defineProperty(wh7, "__esModule", {
        value: !0
    });
    wh7.Sha256 = void 0;
    var _h7 = ej8(),
        I$1 = AJ8(),
        C$1 = uR7(),
        KJ8 = zh7(),
        el3 = function() {
            function A(q) {
                this.secret = q, this.hash = new C$1.RawSha256, this.reset()
            }
            return A.prototype.update = function(q) {
                if ((0, KJ8.isEmptyData)(q) || this.error) return;
                try {
                    this.hash.update((0, KJ8.convertToBuffer)(q))
                } catch (K) {
                    this.error = K
                }
            }, A.prototype.digestSync = function() {
                if (this.error) throw this.error;
                if (this.outer) {
                    if (!this.outer.finished) this.outer.update(this.hash.digest());
                    return this.outer.digest()
                }
                return this.hash.digest()
            }, A.prototype.digest = function() {
                return _h7.__awaiter(this, void 0, void 0, function() {
                    return _h7.__generator(this, function(q) {
                        return [2, this.digestSync()]
                    })
                })
            }, A.prototype.reset = function() {
                if (this.hash = new C$1.RawSha256, this.secret) {
                    this.outer = new C$1.RawSha256;
                    var q = Ai3(this.secret),
                        K = new Uint8Array(I$1.BLOCK_SIZE);
                    K.set(q);
                    for (var Y = 0; Y < I$1.BLOCK_SIZE; Y++) q[Y] ^= 54, K[Y] ^= 92;
                    this.hash.update(q), this.outer.update(K);
                    for (var Y = 0; Y < q.byteLength; Y++) q[Y] = 0
                }
            }, A
        }();
    wh7.Sha256 = el3;

    function Ai3(A) {
        var q = (0, KJ8.convertToBuffer)(A);
        if (q.byteLength > I$1.BLOCK_SIZE) {
            var K = new C$1.RawSha256;
            K.update(q), q = K.digest()
        }
        var Y = new Uint8Array(I$1.BLOCK_SIZE);
        return Y.set(q), Y
    }
})
// @from(Ln 166187, Col 4)
Hh7 = x((YJ8) => {
    Object.defineProperty(YJ8, "__esModule", {
        value: !0
    });
    var qi3 = ej8();
    qi3.__exportStar($h7(), YJ8)
})
// @from(Ln 166194, Col 4)
fh7 = x((B92, Gh7) => {
    var {
        defineProperty: b$1,
        getOwnPropertyDescriptor: Ki3,
        getOwnPropertyNames: Yi3
    } = Object, zi3 = Object.prototype.hasOwnProperty, x$1 = (A, q) => b$1(A, "name", {
        value: q,
        configurable: !0
    }), _i3 = (A, q) => {
        for (var K in q) b$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, wi3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Yi3(q))
                if (!zi3.call(A, z) && z !== K) b$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Ki3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Oi3 = (A) => wi3(b$1({}, "__esModule", {
        value: !0
    }), A), jh7 = {};
    _i3(jh7, {
        AlgorithmId: () => Xh7,
        EndpointURLScheme: () => Dh7,
        FieldPosition: () => Ph7,
        HttpApiKeyAuthLocation: () => Mh7,
        HttpAuthLocation: () => Jh7,
        IniSectionType: () => Wh7,
        RequestHandlerProtocol: () => Zh7,
        SMITHY_CONTEXT_KEY: () => Mi3,
        getDefaultClientConfiguration: () => ji3,
        resolveDefaultRuntimeConfig: () => Ji3
    });
    Gh7.exports = Oi3(jh7);
    var Jh7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(Jh7 || {}),
        Mh7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(Mh7 || {}),
        Dh7 = ((A) => {
            return A.HTTP = "http", A.HTTPS = "https", A
        })(Dh7 || {}),
        Xh7 = ((A) => {
            return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
        })(Xh7 || {}),
        $i3 = x$1((A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => "sha256",
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => "md5",
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        }, "getChecksumConfiguration"),
        Hi3 = x$1((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        ji3 = x$1((A) => {
            return $i3(A)
        }, "getDefaultClientConfiguration"),
        Ji3 = x$1((A) => {
            return Hi3(A)
        }, "resolveDefaultRuntimeConfig"),
        Ph7 = ((A) => {
            return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
        })(Ph7 || {}),
        Mi3 = "__smithy_context",
        Wh7 = ((A) => {
            return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
        })(Wh7 || {}),
        Zh7 = ((A) => {
            return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
        })(Zh7 || {})
})
// @from(Ln 166286, Col 4)
Eh7 = x((g92, kh7) => {
    var {
        defineProperty: u$1,
        getOwnPropertyDescriptor: Di3,
        getOwnPropertyNames: Xi3
    } = Object, Pi3 = Object.prototype.hasOwnProperty, Zs = (A, q) => u$1(A, "name", {
        value: q,
        configurable: !0
    }), Wi3 = (A, q) => {
        for (var K in q) u$1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Zi3 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Xi3(q))
                if (!Pi3.call(A, z) && z !== K) u$1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Di3(q, z)) || Y.enumerable
                })
        }
        return A
    }, Gi3 = (A) => Zi3(u$1({}, "__esModule", {
        value: !0
    }), A), Th7 = {};
    Wi3(Th7, {
        Field: () => vi3,
        Fields: () => Ni3,
        HttpRequest: () => Vi3,
        HttpResponse: () => ki3,
        IHttpRequest: () => vh7.HttpRequest,
        getHttpHandlerExtensionConfiguration: () => fi3,
        isValidHostname: () => Vh7,
        resolveHttpHandlerRuntimeConfig: () => Ti3
    });
    kh7.exports = Gi3(Th7);
    var fi3 = Zs((A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        }, "getHttpHandlerExtensionConfiguration"),
        Ti3 = Zs((A) => {
            return {
                httpHandler: A.httpHandler()
            }
        }, "resolveHttpHandlerRuntimeConfig"),
        vh7 = fh7(),
        vi3 = class {
            static {
                Zs(this, "Field")
            }
            constructor({
                name: A,
                kind: q = vh7.FieldPosition.HEADER,
                values: K = []
            }) {
                this.name = A, this.kind = q, this.values = K
            }
            add(A) {
                this.values.push(A)
            }
            set(A) {
                this.values = A
            }
            remove(A) {
                this.values = this.values.filter((q) => q !== A)
            }
            toString() {
                return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
            }
            get() {
                return this.values
            }
        },
        Ni3 = class {
            constructor({
                fields: A = [],
                encoding: q = "utf-8"
            }) {
                this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = q
            }
            static {
                Zs(this, "Fields")
            }
            setField(A) {
                this.entries[A.name.toLowerCase()] = A
            }
            getField(A) {
                return this.entries[A.toLowerCase()]
            }
            removeField(A) {
                delete this.entries[A.toLowerCase()]
            }
            getByType(A) {
                return Object.values(this.entries).filter((q) => q.kind === A)
            }
        },
        Vi3 = class A {
            static {
                Zs(this, "HttpRequest")
            }
            constructor(q) {
                this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
            }
            static clone(q) {
                let K = new A({
                    ...q,
                    headers: {
                        ...q.headers
                    }
                });
                if (K.query) K.query = Nh7(K.query);
                return K
            }
            static isInstance(q) {
                if (!q) return !1;
                let K = q;
                return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
            }
            clone() {
                return A.clone(this)
            }
        };

    function Nh7(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    Zs(Nh7, "cloneQuery");
    var ki3 = class {
        static {
            Zs(this, "HttpResponse")
        }
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    };

    function Vh7(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Zs(Vh7, "isValidHostname")
})