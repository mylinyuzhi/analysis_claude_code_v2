
// @from(Ln 167910, Col 4)
P6 = p((sy_) => {
    var Ib1 = Symbol.for("react.transitional.element"),
        uy_ = Symbol.for("react.portal"),
        my_ = Symbol.for("react.fragment"),
        By_ = Symbol.for("react.strict_mode"),
        py_ = Symbol.for("react.profiler"),
        Fy_ = Symbol.for("react.consumer"),
        gy_ = Symbol.for("react.context"),
        Uy_ = Symbol.for("react.forward_ref"),
        Qy_ = Symbol.for("react.suspense"),
        dy_ = Symbol.for("react.memo"),
        V44 = Symbol.for("react.lazy"),
        cy_ = Symbol.for("react.activity"),
        f44 = Symbol.iterator;

    function ly_(q) {
        if (q === null || typeof q !== "object") return null;
        return q = f44 && q[f44] || q["@@iterator"], typeof q === "function" ? q : null
    }
    var k44 = {
            isMounted: function() {
                return !1
            },
            enqueueForceUpdate: function() {},
            enqueueReplaceState: function() {},
            enqueueSetState: function() {}
        },
        N44 = Object.assign,
        E44 = {};

    function YN6(q, K, _) {
        this.props = q, this.context = K, this.refs = E44, this.updater = _ || k44
    }
    YN6.prototype.isReactComponent = {};
    YN6.prototype.setState = function(q, K) {
        if (typeof q !== "object" && typeof q !== "function" && q != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, q, K, "setState")
    };
    YN6.prototype.forceUpdate = function(q) {
        this.updater.enqueueForceUpdate(this, q, "forceUpdate")
    };

    function y44() {}
    y44.prototype = YN6.prototype;

    function xb1(q, K, _) {
        this.props = q, this.context = K, this.refs = E44, this.updater = _ || k44
    }
    var ub1 = xb1.prototype = new y44;
    ub1.constructor = xb1;
    N44(ub1, YN6.prototype);
    ub1.isPureReactComponent = !0;
    var G44 = Array.isArray;

    function bb1() {}
    var Xj = {
            H: null,
            A: null,
            T: null,
            S: null
        },
        L44 = Object.prototype.hasOwnProperty;

    function mb1(q, K, _) {
        var z = _.ref;
        return {
            $$typeof: Ib1,
            type: q,
            key: K,
            ref: z !== void 0 ? z : null,
            props: _
        }
    }

    function ny_(q, K) {
        return mb1(q.type, K, q.props)
    }

    function Bb1(q) {
        return typeof q === "object" && q !== null && q.$$typeof === Ib1
    }

    function iy_(q) {
        var K = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + q.replace(/[=:]/g, function(_) {
            return K[_]
        })
    }
    var v44 = /\/+/g;

    function Cb1(q, K) {
        return typeof q === "object" && q !== null && q.key != null ? iy_("" + q.key) : K.toString(36)
    }

    function ry_(q) {
        switch (q.status) {
            case "fulfilled":
                return q.value;
            case "rejected":
                throw q.reason;
            default:
                switch (typeof q.status === "string" ? q.then(bb1, bb1) : (q.status = "pending", q.then(function(K) {
                        q.status === "pending" && (q.status = "fulfilled", q.value = K)
                    }, function(K) {
                        q.status === "pending" && (q.status = "rejected", q.reason = K)
                    })), q.status) {
                    case "fulfilled":
                        return q.value;
                    case "rejected":
                        throw q.reason
                }
        }
        throw q
    }

    function zN6(q, K, _, z, Y) {
        var A = typeof q;
        if (A === "undefined" || A === "boolean") q = null;
        var O = !1;
        if (q === null) O = !0;
        else switch (A) {
            case "bigint":
            case "string":
            case "number":
                O = !0;
                break;
            case "object":
                switch (q.$$typeof) {
                    case Ib1:
                    case uy_:
                        O = !0;
                        break;
                    case V44:
                        return O = q._init, zN6(O(q._payload), K, _, z, Y)
                }
        }
        if (O) return Y = Y(q), O = z === "" ? "." + Cb1(q, 0) : z, G44(Y) ? (_ = "", O != null && (_ = O.replace(v44, "$&/") + "/"), zN6(Y, K, _, "", function(j) {
            return j
        })) : Y != null && (Bb1(Y) && (Y = ny_(Y, _ + (Y.key == null || q && q.key === Y.key ? "" : ("" + Y.key).replace(v44, "$&/") + "/") + O)), K.push(Y)), 1;
        O = 0;
        var w = z === "" ? "." : z + ":";
        if (G44(q))
            for (var $ = 0; $ < q.length; $++) z = q[$], A = w + Cb1(z, $), O += zN6(z, K, _, A, Y);
        else if ($ = ly_(q), typeof $ === "function")
            for (q = $.call(q), $ = 0; !(z = q.next()).done;) z = z.value, A = w + Cb1(z, $++), O += zN6(z, K, _, A, Y);
        else if (A === "object") {
            if (typeof q.then === "function") return zN6(ry_(q), K, _, z, Y);
            throw K = String(q), Error("Objects are not valid as a React child (found: " + (K === "[object Object]" ? "object with keys {" + Object.keys(q).join(", ") + "}" : K) + "). If you meant to render a collection of children, use an array instead.")
        }
        return O
    }

    function ek8(q, K, _) {
        if (q == null) return q;
        var z = [],
            Y = 0;
        return zN6(q, z, "", "", function(A) {
            return K.call(_, A, Y++)
        }), z
    }

    function oy_(q) {
        if (q._status === -1) {
            var K = q._result;
            K = K(), K.then(function(_) {
                if (q._status === 0 || q._status === -1) q._status = 1, q._result = _
            }, function(_) {
                if (q._status === 0 || q._status === -1) q._status = 2, q._result = _
            }), q._status === -1 && (q._status = 0, q._result = K)
        }
        if (q._status === 1) return q._result.default;
        throw q._result
    }
    var T44 = typeof reportError === "function" ? reportError : function(q) {
            if (typeof window === "object" && typeof window.ErrorEvent === "function") {
                var K = new window.ErrorEvent("error", {
                    bubbles: !0,
                    cancelable: !0,
                    message: typeof q === "object" && q !== null && typeof q.message === "string" ? String(q.message) : String(q),
                    error: q
                });
                if (!window.dispatchEvent(K)) return
            } else if (typeof process === "object" && typeof process.emit === "function") {
                process.emit("uncaughtException", q);
                return
            }
            console.error(q)
        },
        ay_ = {
            map: ek8,
            forEach: function(q, K, _) {
                ek8(q, function() {
                    K.apply(this, arguments)
                }, _)
            },
            count: function(q) {
                var K = 0;
                return ek8(q, function() {
                    K++
                }), K
            },
            toArray: function(q) {
                return ek8(q, function(K) {
                    return K
                }) || []
            },
            only: function(q) {
                if (!Bb1(q)) throw Error("React.Children.only expected to receive a single React element child.");
                return q
            }
        };
    sy_.Activity = cy_;
    sy_.Children = ay_;
    sy_.Component = YN6;
    sy_.Fragment = my_;
    sy_.Profiler = py_;
    sy_.PureComponent = xb1;
    sy_.StrictMode = By_;
    sy_.Suspense = Qy_;
    sy_.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Xj;
    sy_.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(q) {
            return Xj.H.useMemoCache(q)
        }
    };
    sy_.cache = function(q) {
        return function() {
            return q.apply(null, arguments)
        }
    };
    sy_.cacheSignal = function() {
        return null
    };
    sy_.cloneElement = function(q, K, _) {
        if (q === null || q === void 0) throw Error("The argument must be a React element, but you passed " + q + ".");
        var z = N44({}, q.props),
            Y = q.key;
        if (K != null)
            for (A in K.key !== void 0 && (Y = "" + K.key), K) !L44.call(K, A) || A === "key" || A === "__self" || A === "__source" || A === "ref" && K.ref === void 0 || (z[A] = K[A]);
        var A = arguments.length - 2;
        if (A === 1) z.children = _;
        else if (1 < A) {
            for (var O = Array(A), w = 0; w < A; w++) O[w] = arguments[w + 2];
            z.children = O
        }
        return mb1(q.type, Y, z)
    };
    sy_.createContext = function(q) {
        return q = {
            $$typeof: gy_,
            _currentValue: q,
            _currentValue2: q,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        }, q.Provider = q, q.Consumer = {
            $$typeof: Fy_,
            _context: q
        }, q
    };
    sy_.createElement = function(q, K, _) {
        var z, Y = {},
            A = null;
        if (K != null)
            for (z in K.key !== void 0 && (A = "" + K.key), K) L44.call(K, z) && z !== "key" && z !== "__self" && z !== "__source" && (Y[z] = K[z]);
        var O = arguments.length - 2;
        if (O === 1) Y.children = _;
        else if (1 < O) {
            for (var w = Array(O), $ = 0; $ < O; $++) w[$] = arguments[$ + 2];
            Y.children = w
        }
        if (q && q.defaultProps)
            for (z in O = q.defaultProps, O) Y[z] === void 0 && (Y[z] = O[z]);
        return mb1(q, A, Y)
    };
    sy_.createRef = function() {
        return {
            current: null
        }
    };
    sy_.forwardRef = function(q) {
        return {
            $$typeof: Uy_,
            render: q
        }
    };
    sy_.isValidElement = Bb1;
    sy_.lazy = function(q) {
        return {
            $$typeof: V44,
            _payload: {
                _status: -1,
                _result: q
            },
            _init: oy_
        }
    };
    sy_.memo = function(q, K) {
        return {
            $$typeof: dy_,
            type: q,
            compare: K === void 0 ? null : K
        }
    };
    sy_.startTransition = function(q) {
        var K = Xj.T,
            _ = {};
        Xj.T = _;
        try {
            var z = q(),
                Y = Xj.S;
            Y !== null && Y(_, z), typeof z === "object" && z !== null && typeof z.then === "function" && z.then(bb1, T44)
        } catch (A) {
            T44(A)
        } finally {
            K !== null && _.types !== null && (K.types = _.types), Xj.T = K
        }
    };
    sy_.unstable_useCacheRefresh = function() {
        return Xj.H.useCacheRefresh()
    };
    sy_.use = function(q) {
        return Xj.H.use(q)
    };
    sy_.useActionState = function(q, K, _) {
        return Xj.H.useActionState(q, K, _)
    };
    sy_.useCallback = function(q, K) {
        return Xj.H.useCallback(q, K)
    };
    sy_.useContext = function(q) {
        return Xj.H.useContext(q)
    };
    sy_.useDebugValue = function() {};
    sy_.useDeferredValue = function(q, K) {
        return Xj.H.useDeferredValue(q, K)
    };
    sy_.useEffect = function(q, K) {
        return Xj.H.useEffect(q, K)
    };
    sy_.useEffectEvent = function(q) {
        return Xj.H.useEffectEvent(q)
    };
    sy_.useId = function() {
        return Xj.H.useId()
    };
    sy_.useImperativeHandle = function(q, K, _) {
        return Xj.H.useImperativeHandle(q, K, _)
    };
    sy_.useInsertionEffect = function(q, K) {
        return Xj.H.useInsertionEffect(q, K)
    };
    sy_.useLayoutEffect = function(q, K) {
        return Xj.H.useLayoutEffect(q, K)
    };
    sy_.useMemo = function(q, K) {
        return Xj.H.useMemo(q, K)
    };
    sy_.useOptimistic = function(q, K) {
        return Xj.H.useOptimistic(q, K)
    };
    sy_.useReducer = function(q, K, _) {
        return Xj.H.useReducer(q, K, _)
    };
    sy_.useRef = function(q) {
        return Xj.H.useRef(q)
    };
    sy_.useState = function(q) {
        return Xj.H.useState(q)
    };
    sy_.useSyncExternalStore = function(q, K, _) {
        return Xj.H.useSyncExternalStore(q, K, _)
    };
    sy_.useTransition = function() {
        return Xj.H.useTransition()
    };
    sy_.version = "19.2.0"
})
// @from(Ln 168292, Col 4)
h44
// @from(Ln 168292, Col 9)
gL_
// @from(Ln 168292, Col 14)
s = function(q) {
    return gL_.H.useMemoCache(q)
}
// @from(Ln 168295, Col 4)
o6 = L(() => {
    h44 = K6(P6(), 1), gL_ = h44.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
})
// @from(Ln 168300, Col 0)
function pb1() {
    let {
        env: q
    } = R44, {
        TERM: K,
        TERM_PROGRAM: _
    } = q;
    if (R44.platform !== "win32") return K !== "linux";
    return Boolean(q.WT_SESSION) || Boolean(q.TERMINUS_SUBLIME) || q.ConEmuTask === "{cmd::Cmder}" || _ === "Terminus-Sublime" || _ === "vscode" || K === "xterm-256color" || K === "alacritty" || K === "rxvt-unicode" || K === "rxvt-unicode-256color" || q.TERMINAL_EMULATOR === "JetBrains-JediTerm"
}
// @from(Ln 168310, Col 4)
S44 = () => {}
// @from(Ln 168311, Col 4)
C44
// @from(Ln 168311, Col 9)
b44
// @from(Ln 168311, Col 14)
UL_
// @from(Ln 168311, Col 19)
QL_
// @from(Ln 168311, Col 24)
dL_
// @from(Ln 168311, Col 29)
cL_
// @from(Ln 168311, Col 34)
lL_
// @from(Ln 168311, Col 39)
e6
// @from(Ln 168311, Col 43)
ctO
// @from(Ln 168312, Col 4)
Qq = L(() => {
    S44();
    C44 = {
        circleQuestionMark: "(?)",
        questionMarkPrefix: "(?)",
        square: "█",
        squareDarkShade: "▓",
        squareMediumShade: "▒",
        squareLightShade: "░",
        squareTop: "▀",
        squareBottom: "▄",
        squareLeft: "▌",
        squareRight: "▐",
        squareCenter: "■",
        bullet: "●",
        dot: "․",
        ellipsis: "…",
        pointerSmall: "›",
        triangleUp: "▲",
        triangleUpSmall: "▴",
        triangleDown: "▼",
        triangleDownSmall: "▾",
        triangleLeftSmall: "◂",
        triangleRightSmall: "▸",
        home: "⌂",
        heart: "♥",
        musicNote: "♪",
        musicNoteBeamed: "♫",
        arrowUp: "↑",
        arrowDown: "↓",
        arrowLeft: "←",
        arrowRight: "→",
        arrowLeftRight: "↔",
        arrowUpDown: "↕",
        almostEqual: "≈",
        notEqual: "≠",
        lessOrEqual: "≤",
        greaterOrEqual: "≥",
        identical: "≡",
        infinity: "∞",
        subscriptZero: "₀",
        subscriptOne: "₁",
        subscriptTwo: "₂",
        subscriptThree: "₃",
        subscriptFour: "₄",
        subscriptFive: "₅",
        subscriptSix: "₆",
        subscriptSeven: "₇",
        subscriptEight: "₈",
        subscriptNine: "₉",
        oneHalf: "½",
        oneThird: "⅓",
        oneQuarter: "¼",
        oneFifth: "⅕",
        oneSixth: "⅙",
        oneEighth: "⅛",
        twoThirds: "⅔",
        twoFifths: "⅖",
        threeQuarters: "¾",
        threeFifths: "⅗",
        threeEighths: "⅜",
        fourFifths: "⅘",
        fiveSixths: "⅚",
        fiveEighths: "⅝",
        sevenEighths: "⅞",
        line: "─",
        lineBold: "━",
        lineDouble: "═",
        lineDashed0: "┄",
        lineDashed1: "┅",
        lineDashed2: "┈",
        lineDashed3: "┉",
        lineDashed4: "╌",
        lineDashed5: "╍",
        lineDashed6: "╴",
        lineDashed7: "╶",
        lineDashed8: "╸",
        lineDashed9: "╺",
        lineDashed10: "╼",
        lineDashed11: "╾",
        lineDashed12: "−",
        lineDashed13: "–",
        lineDashed14: "‐",
        lineDashed15: "⁃",
        lineVertical: "│",
        lineVerticalBold: "┃",
        lineVerticalDouble: "║",
        lineVerticalDashed0: "┆",
        lineVerticalDashed1: "┇",
        lineVerticalDashed2: "┊",
        lineVerticalDashed3: "┋",
        lineVerticalDashed4: "╎",
        lineVerticalDashed5: "╏",
        lineVerticalDashed6: "╵",
        lineVerticalDashed7: "╷",
        lineVerticalDashed8: "╹",
        lineVerticalDashed9: "╻",
        lineVerticalDashed10: "╽",
        lineVerticalDashed11: "╿",
        lineDownLeft: "┐",
        lineDownLeftArc: "╮",
        lineDownBoldLeftBold: "┓",
        lineDownBoldLeft: "┒",
        lineDownLeftBold: "┑",
        lineDownDoubleLeftDouble: "╗",
        lineDownDoubleLeft: "╖",
        lineDownLeftDouble: "╕",
        lineDownRight: "┌",
        lineDownRightArc: "╭",
        lineDownBoldRightBold: "┏",
        lineDownBoldRight: "┎",
        lineDownRightBold: "┍",
        lineDownDoubleRightDouble: "╔",
        lineDownDoubleRight: "╓",
        lineDownRightDouble: "╒",
        lineUpLeft: "┘",
        lineUpLeftArc: "╯",
        lineUpBoldLeftBold: "┛",
        lineUpBoldLeft: "┚",
        lineUpLeftBold: "┙",
        lineUpDoubleLeftDouble: "╝",
        lineUpDoubleLeft: "╜",
        lineUpLeftDouble: "╛",
        lineUpRight: "└",
        lineUpRightArc: "╰",
        lineUpBoldRightBold: "┗",
        lineUpBoldRight: "┖",
        lineUpRightBold: "┕",
        lineUpDoubleRightDouble: "╚",
        lineUpDoubleRight: "╙",
        lineUpRightDouble: "╘",
        lineUpDownLeft: "┤",
        lineUpBoldDownBoldLeftBold: "┫",
        lineUpBoldDownBoldLeft: "┨",
        lineUpDownLeftBold: "┥",
        lineUpBoldDownLeftBold: "┩",
        lineUpDownBoldLeftBold: "┪",
        lineUpDownBoldLeft: "┧",
        lineUpBoldDownLeft: "┦",
        lineUpDoubleDownDoubleLeftDouble: "╣",
        lineUpDoubleDownDoubleLeft: "╢",
        lineUpDownLeftDouble: "╡",
        lineUpDownRight: "├",
        lineUpBoldDownBoldRightBold: "┣",
        lineUpBoldDownBoldRight: "┠",
        lineUpDownRightBold: "┝",
        lineUpBoldDownRightBold: "┡",
        lineUpDownBoldRightBold: "┢",
        lineUpDownBoldRight: "┟",
        lineUpBoldDownRight: "┞",
        lineUpDoubleDownDoubleRightDouble: "╠",
        lineUpDoubleDownDoubleRight: "╟",
        lineUpDownRightDouble: "╞",
        lineDownLeftRight: "┬",
        lineDownBoldLeftBoldRightBold: "┳",
        lineDownLeftBoldRightBold: "┯",
        lineDownBoldLeftRight: "┰",
        lineDownBoldLeftBoldRight: "┱",
        lineDownBoldLeftRightBold: "┲",
        lineDownLeftRightBold: "┮",
        lineDownLeftBoldRight: "┭",
        lineDownDoubleLeftDoubleRightDouble: "╦",
        lineDownDoubleLeftRight: "╥",
        lineDownLeftDoubleRightDouble: "╤",
        lineUpLeftRight: "┴",
        lineUpBoldLeftBoldRightBold: "┻",
        lineUpLeftBoldRightBold: "┷",
        lineUpBoldLeftRight: "┸",
        lineUpBoldLeftBoldRight: "┹",
        lineUpBoldLeftRightBold: "┺",
        lineUpLeftRightBold: "┶",
        lineUpLeftBoldRight: "┵",
        lineUpDoubleLeftDoubleRightDouble: "╩",
        lineUpDoubleLeftRight: "╨",
        lineUpLeftDoubleRightDouble: "╧",
        lineUpDownLeftRight: "┼",
        lineUpBoldDownBoldLeftBoldRightBold: "╋",
        lineUpDownBoldLeftBoldRightBold: "╈",
        lineUpBoldDownLeftBoldRightBold: "╇",
        lineUpBoldDownBoldLeftRightBold: "╊",
        lineUpBoldDownBoldLeftBoldRight: "╉",
        lineUpBoldDownLeftRight: "╀",
        lineUpDownBoldLeftRight: "╁",
        lineUpDownLeftBoldRight: "┽",
        lineUpDownLeftRightBold: "┾",
        lineUpBoldDownBoldLeftRight: "╂",
        lineUpDownLeftBoldRightBold: "┿",
        lineUpBoldDownLeftBoldRight: "╃",
        lineUpBoldDownLeftRightBold: "╄",
        lineUpDownBoldLeftBoldRight: "╅",
        lineUpDownBoldLeftRightBold: "╆",
        lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
        lineUpDoubleDownDoubleLeftRight: "╫",
        lineUpDownLeftDoubleRightDouble: "╪",
        lineCross: "╳",
        lineBackslash: "╲",
        lineSlash: "╱"
    }, b44 = {
        tick: "✔",
        info: "ℹ",
        warning: "⚠",
        cross: "✘",
        squareSmall: "◻",
        squareSmallFilled: "◼",
        circle: "◯",
        circleFilled: "◉",
        circleDotted: "◌",
        circleDouble: "◎",
        circleCircle: "ⓞ",
        circleCross: "ⓧ",
        circlePipe: "Ⓘ",
        radioOn: "◉",
        radioOff: "◯",
        checkboxOn: "☒",
        checkboxOff: "☐",
        checkboxCircleOn: "ⓧ",
        checkboxCircleOff: "Ⓘ",
        pointer: "❯",
        triangleUpOutline: "△",
        triangleLeft: "◀",
        triangleRight: "▶",
        lozenge: "◆",
        lozengeOutline: "◇",
        hamburger: "☰",
        smiley: "㋡",
        mustache: "෴",
        star: "★",
        play: "▶",
        nodejs: "⬢",
        oneSeventh: "⅐",
        oneNinth: "⅑",
        oneTenth: "⅒"
    }, UL_ = {
        tick: "√",
        info: "i",
        warning: "‼",
        cross: "×",
        squareSmall: "□",
        squareSmallFilled: "■",
        circle: "( )",
        circleFilled: "(*)",
        circleDotted: "( )",
        circleDouble: "( )",
        circleCircle: "(○)",
        circleCross: "(×)",
        circlePipe: "(│)",
        radioOn: "(*)",
        radioOff: "( )",
        checkboxOn: "[×]",
        checkboxOff: "[ ]",
        checkboxCircleOn: "(×)",
        checkboxCircleOff: "( )",
        pointer: ">",
        triangleUpOutline: "∆",
        triangleLeft: "◄",
        triangleRight: "►",
        lozenge: "♦",
        lozengeOutline: "◊",
        hamburger: "≡",
        smiley: "☺",
        mustache: "┌─┐",
        star: "✶",
        play: "►",
        nodejs: "♦",
        oneSeventh: "1/7",
        oneNinth: "1/9",
        oneTenth: "1/10"
    }, QL_ = {
        ...C44,
        ...b44
    }, dL_ = {
        ...C44,
        ...UL_
    }, cL_ = pb1(), lL_ = cL_ ? QL_ : dL_, e6 = lL_, ctO = Object.entries(b44)
})
// @from(Ln 168587, Col 0)
class OR {
    _didStopImmediatePropagation = !1;
    didStopImmediatePropagation() {
        return this._didStopImmediatePropagation
    }
    stopImmediatePropagation() {
        this._didStopImmediatePropagation = !0
    }
}
// @from(Ln 168599, Col 4)
M$6
// @from(Ln 168600, Col 4)
qN8 = L(() => {
    M$6 = class M$6 extends nL_ {
        constructor() {
            super();
            this.setMaxListeners(0)
        }
        emit(q, ...K) {
            if (q === "error") return super.emit(q, ...K);
            let _ = this.rawListeners(q);
            if (_.length === 0) return !1;
            let z = K[0] instanceof OR ? K[0] : null;
            for (let Y of _)
                if (Y.apply(this, K), z?.didStopImmediatePropagation()) break;
            return !0
        }
    }
})
// @from(Ln 168617, Col 4)
I44
// @from(Ln 168617, Col 9)
x44
// @from(Ln 168617, Col 14)
Ca
// @from(Ln 168618, Col 4)
wa6 = L(() => {
    qN8();
    I44 = K6(P6(), 1), x44 = I44.createContext({
        stdin: process.stdin,
        internal_eventEmitter: new M$6,
        setRawMode() {},
        isRawModeSupported: !1,
        internal_exitOnCtrlC: !0,
        internal_querier: null
    });
    x44.displayName = "InternalStdinContext";
    Ca = x44
})
// @from(Ln 168631, Col 4)
u44
// @from(Ln 168631, Col 9)
iL_ = () => u44.useContext(Ca)
// @from(Ln 168632, Col 4)
FB
// @from(Ln 168633, Col 4)
KN8 = L(() => {
    wa6();
    u44 = K6(P6(), 1), FB = iL_
})
// @from(Ln 168638, Col 0)
function $a6() {
    if (_N8 === void 0) _N8 = oL_() ?? "dark";
    return _N8
}
// @from(Ln 168643, Col 0)
function m44(q) {
    _N8 = q
}
// @from(Ln 168647, Col 0)
function Ad(q) {
    if (q === "auto") return $a6();
    return q
}
// @from(Ln 168652, Col 0)
function B44(q) {
    let K = rL_(q);
    if (!K) return;
    return 0.2126 * K.r + 0.7152 * K.g + 0.0722 * K.b > 0.5 ? "light" : "dark"
}
// @from(Ln 168658, Col 0)
function rL_(q) {
    let K = /^rgba?:([0-9a-f]{1,4})\/([0-9a-f]{1,4})\/([0-9a-f]{1,4})/i.exec(q);
    if (K) return {
        r: AN6(K[1]),
        g: AN6(K[2]),
        b: AN6(K[3])
    };
    let _ = /^#([0-9a-f]+)$/i.exec(q);
    if (_ && _[1].length % 3 === 0) {
        let z = _[1],
            Y = z.length / 3;
        return {
            r: AN6(z.slice(0, Y)),
            g: AN6(z.slice(Y, 2 * Y)),
            b: AN6(z.slice(2 * Y))
        }
    }
    return
}
// @from(Ln 168678, Col 0)
function AN6(q) {
    let K = 16 ** q.length - 1;
    return parseInt(q, 16) / K
}
// @from(Ln 168683, Col 0)
function oL_() {
    let q = process.env.COLORFGBG;
    if (!q) return;
    let K = q.split(";"),
        _ = K[K.length - 1];
    if (_ === void 0 || _ === "") return;
    let z = Number(_);
    if (!Number.isInteger(z) || z < 0 || z > 15) return;
    return z <= 6 || z === 8 ? "dark" : "light"
}
// @from(Ln 168693, Col 4)
_N8
// @from(Ln 168695, Col 0)
function Fb1(q) {
    return q >= 48 && q <= 126
}
// @from(Ln 168698, Col 4)
ZI
// @from(Ln 168698, Col 8)
wR = "\x1B"
// @from(Ln 168699, Col 4)
dE = "\x07"
// @from(Ln 168700, Col 4)
D46 = ";"
// @from(Ln 168701, Col 4)
$R
// @from(Ln 168702, Col 4)
Z46 = L(() => {
    ZI = {
        NUL: 0,
        SOH: 1,
        STX: 2,
        ETX: 3,
        EOT: 4,
        ENQ: 5,
        ACK: 6,
        BEL: 7,
        BS: 8,
        HT: 9,
        LF: 10,
        VT: 11,
        FF: 12,
        CR: 13,
        SO: 14,
        SI: 15,
        DLE: 16,
        DC1: 17,
        DC2: 18,
        DC3: 19,
        DC4: 20,
        NAK: 21,
        SYN: 22,
        ETB: 23,
        CAN: 24,
        EM: 25,
        SUB: 26,
        ESC: 27,
        FS: 28,
        GS: 29,
        RS: 30,
        US: 31,
        DEL: 127
    }, $R = {
        CSI: 91,
        OSC: 93,
        DCS: 80,
        APC: 95,
        PM: 94,
        SOS: 88,
        ST: 92
    }
})
// @from(Ln 168748, Col 0)
function p44(q) {
    return q >= ON6.PARAM_START && q <= ON6.PARAM_END
}
// @from(Ln 168752, Col 0)
function zN8(q) {
    return q >= ON6.INTERMEDIATE_START && q <= ON6.INTERMEDIATE_END
}
// @from(Ln 168756, Col 0)
function F44(q) {
    return q >= ON6.FINAL_START && q <= ON6.FINAL_END
}
// @from(Ln 168760, Col 0)
function LA(...q) {
    if (q.length === 0) return gb1;
    if (q.length === 1) return `${gb1}${q[0]}`;
    let K = q.slice(0, -1),
        _ = q[q.length - 1];
    return `${gb1}${K.join(D46)}${_}`
}
// @from(Ln 168768, Col 0)
function Q44(q = 1) {
    return q === 0 ? "" : LA(q, "A")
}
// @from(Ln 168772, Col 0)
function aL_(q = 1) {
    return q === 0 ? "" : LA(q, "B")
}
// @from(Ln 168776, Col 0)
function sL_(q = 1) {
    return q === 0 ? "" : LA(q, "C")
}
// @from(Ln 168780, Col 0)
function tL_(q = 1) {
    return q === 0 ? "" : LA(q, "D")
}
// @from(Ln 168784, Col 0)
function d44(q) {
    return LA(q, "G")
}
// @from(Ln 168788, Col 0)
function Qb1(q, K) {
    return LA(q, K, "H")
}
// @from(Ln 168792, Col 0)
function P$6(q, K) {
    let _ = "";
    if (q < 0) _ += tL_(-q);
    else if (q > 0) _ += sL_(q);
    if (K < 0) _ += Q44(-K);
    else if (K > 0) _ += aL_(K);
    return _
}
// @from(Ln 168801, Col 0)
function c44(q) {
    if (q <= 0) return "";
    let K = "";
    for (let _ = 0; _ < q; _++)
        if (K += qh_, _ < q - 1) K += Q44(1);
    return K += eL_, K
}
// @from(Ln 168809, Col 0)
function l44(q = 1) {
    return q === 0 ? "" : LA(q, "S")
}
// @from(Ln 168813, Col 0)
function n44(q = 1) {
    return q === 0 ? "" : LA(q, "T")
}
// @from(Ln 168817, Col 0)
function i44(q, K) {
    return LA(q, K, "r")
}
// @from(Ln 168820, Col 4)
gb1
// @from(Ln 168820, Col 9)
ON6
// @from(Ln 168820, Col 14)
jH
// @from(Ln 168820, Col 18)
g44
// @from(Ln 168820, Col 23)
U44
// @from(Ln 168820, Col 28)
Ub1
// @from(Ln 168820, Col 33)
eL_
// @from(Ln 168820, Col 38)
fI
// @from(Ln 168820, Col 42)
zeO
// @from(Ln 168820, Col 47)
YeO
// @from(Ln 168820, Col 52)
qh_
// @from(Ln 168820, Col 57)
Od
// @from(Ln 168820, Col 61)
db1
// @from(Ln 168820, Col 66)
r44
// @from(Ln 168820, Col 71)
o44
// @from(Ln 168820, Col 76)
a44
// @from(Ln 168820, Col 81)
cb1
// @from(Ln 168820, Col 86)
lb1
// @from(Ln 168820, Col 91)
ja6
// @from(Ln 168820, Col 96)
ba
// @from(Ln 168820, Col 100)
Ha6
// @from(Ln 168820, Col 105)
W$6
// @from(Ln 168821, Col 4)
GI = L(() => {
    Z46();
    gb1 = wR + String.fromCharCode($R.CSI), ON6 = {
        PARAM_START: 48,
        PARAM_END: 63,
        INTERMEDIATE_START: 32,
        INTERMEDIATE_END: 47,
        FINAL_START: 64,
        FINAL_END: 126
    };
    jH = {
        CUU: 65,
        CUD: 66,
        CUF: 67,
        CUB: 68,
        CNL: 69,
        CPL: 70,
        CHA: 71,
        CUP: 72,
        CHT: 73,
        VPA: 100,
        HVP: 102,
        ED: 74,
        EL: 75,
        ECH: 88,
        IL: 76,
        DL: 77,
        ICH: 64,
        DCH: 80,
        SU: 83,
        SD: 84,
        SM: 104,
        RM: 108,
        SGR: 109,
        DSR: 110,
        DECSCUSR: 113,
        DECSTBM: 114,
        SCOSC: 115,
        SCORC: 117,
        CBT: 90
    }, g44 = ["toEnd", "toStart", "all", "scrollback"], U44 = ["toEnd", "toStart", "all"], Ub1 = [{
        style: "block",
        blinking: !0
    }, {
        style: "block",
        blinking: !0
    }, {
        style: "block",
        blinking: !1
    }, {
        style: "underline",
        blinking: !0
    }, {
        style: "underline",
        blinking: !1
    }, {
        style: "bar",
        blinking: !0
    }, {
        style: "bar",
        blinking: !1
    }];
    eL_ = LA("G");
    fI = LA("H");
    zeO = LA("s"), YeO = LA("u"), qh_ = LA(2, "K"), Od = LA(2, "J"), db1 = LA(3, "J");
    r44 = LA("r"), o44 = LA("200~"), a44 = LA("201~"), cb1 = LA("I"), lb1 = LA("O"), ja6 = LA(">1u"), ba = LA("<u"), Ha6 = LA(">4;2m"), W$6 = LA(">4m")
})
// @from(Ln 168892, Col 0)
function yP(...q) {
    let K = X7.terminal === "kitty" ? t44 : dE;
    return `${nb1}${q.join(D46)}${K}`
}
// @from(Ln 168897, Col 0)
function LP(q) {
    if (process.env.TMUX) return `\x1BPtmux;${q.replaceAll("\x1B","\x1B\x1B")}\x1B\\`;
    if (process.env.STY) return `\x1BP${q.replaceAll("\x1B","\x1B\x1B")}\x1B\\`;
    return q
}
// @from(Ln 168903, Col 0)
function e44() {
    if (process.platform === "darwin" && !process.env.SSH_CONNECTION) return "native";
    if (process.env.TMUX) return "tmux-buffer";
    return "osc52"
}
// @from(Ln 168909, Col 0)
function _h_(q) {
    return `${wR}Ptmux;${q.replaceAll(wR,wR+wR)}${t44}`
}
// @from(Ln 168912, Col 0)
async function zh_(q) {
    if (!process.env.TMUX) return !1;
    let K = process.env.LC_TERMINAL === "iTerm2" ? ["load-buffer", "-"] : ["load-buffer", "-w", "-"],
        {
            code: _
        } = await w1("tmux", K, {
            input: q,
            useCwd: !1,
            timeout: 2000
        });
    return _ === 0
}
// @from(Ln 168924, Col 0)
async function hP(q) {
    let K = Kh_.from(q, "utf8").toString("base64"),
        _ = yP(m2.CLIPBOARD, "c", K);
    if (!process.env.SSH_CONNECTION) Ah_(q, K);
    if (await zh_(q)) return _h_(`${wR}]52;c;${K}${dE}`);
    return _
}
// @from(Ln 168932, Col 0)
function Ah_(q, K) {
    let _ = {
        input: q,
        useCwd: !1,
        timeout: 2000
    };
    switch (process.platform) {
        case "darwin":
            w1("pbcopy", [], _);
            return;
        case "linux": {
            if (D$6 === null) return;
            if (D$6 === "wl-copy") {
                w1("wl-copy", [], _);
                return
            }
            if (D$6 === "xclip") {
                w1("xclip", ["-selection", "clipboard"], _);
                return
            }
            if (D$6 === "xsel") {
                w1("xsel", ["--clipboard", "--input"], _);
                return
            }
            w1("wl-copy", [], _).then((z) => {
                if (z.code === 0) {
                    D$6 = "wl-copy";
                    return
                }
                w1("xclip", ["-selection", "clipboard"], _).then((Y) => {
                    if (Y.code === 0) {
                        D$6 = "xclip";
                        return
                    }
                    w1("xsel", ["--clipboard", "--input"], _).then((A) => {
                        D$6 = A.code === 0 ? "xsel" : null
                    })
                })
            });
            return
        }
        case "win32": {
            if (K.length > Yh_) return;
            w1("powershell", ["-NoProfile", "-Command", `Set-Clipboard -Value ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${K}')))`], {
                useCwd: !1,
                timeout: 2000
            });
            return
        }
    }
}
// @from(Ln 168984, Col 0)
function qK4(q) {
    let K = q.indexOf(";"),
        _ = K >= 0 ? q.slice(0, K) : q,
        z = K >= 0 ? q.slice(K + 1) : "",
        Y = parseInt(_, 10);
    if (Y === m2.SET_TITLE_AND_ICON) return {
        type: "title",
        action: {
            type: "both",
            title: z
        }
    };
    if (Y === m2.SET_ICON) return {
        type: "title",
        action: {
            type: "iconName",
            name: z
        }
    };
    if (Y === m2.SET_TITLE) return {
        type: "title",
        action: {
            type: "windowTitle",
            title: z
        }
    };
    if (Y === m2.HYPERLINK) {
        let A = z.split(";"),
            O = A[0] ?? "",
            w = A.slice(1).join(";");
        if (w === "") return {
            type: "link",
            action: {
                type: "end"
            }
        };
        let $ = {};
        if (O)
            for (let j of O.split(":")) {
                let H = j.indexOf("=");
                if (H >= 0) $[j.slice(0, H)] = j.slice(H + 1)
            }
        return {
            type: "link",
            action: {
                type: "start",
                url: w,
                params: Object.keys($).length > 0 ? $ : void 0
            }
        }
    }
    if (Y === m2.TAB_STATUS) return {
        type: "tabStatus",
        action: Oh_(z)
    };
    return {
        type: "unknown",
        sequence: `\x1B]${q}`
    }
}
// @from(Ln 169045, Col 0)
function s44(q) {
    let K = q.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (K) return {
        type: "rgb",
        r: parseInt(K[1], 16),
        g: parseInt(K[2], 16),
        b: parseInt(K[3], 16)
    };
    let _ = q.match(/^rgb:([0-9a-f]{1,4})\/([0-9a-f]{1,4})\/([0-9a-f]{1,4})$/i);
    if (_) {
        let z = (Y) => Math.round(parseInt(Y, 16) / (16 ** Y.length - 1) * 255);
        return {
            type: "rgb",
            r: z(_[1]),
            g: z(_[2]),
            b: z(_[3])
        }
    }
    return null
}
// @from(Ln 169066, Col 0)
function Oh_(q) {
    let K = {};
    for (let [_, z] of wh_(q)) switch (_) {
        case "indicator":
            K.indicator = z === "" ? null : s44(z);
            break;
        case "status":
            K.status = z === "" ? null : z;
            break;
        case "status-color":
            K.statusColor = z === "" ? null : s44(z);
            break
    }
    return K
}
// @from(Ln 169082, Col 0)
function* wh_(q) {
    let K = "",
        _ = "",
        z = !1,
        Y = !1;
    for (let A of q)
        if (Y) {
            if (z) _ += A;
            else K += A;
            Y = !1
        } else if (A === "\\") Y = !0;
    else if (A === ";") yield [K, _], K = "", _ = "", z = !1;
    else if (A === "=" && !z) z = !0;
    else if (z) _ += A;
    else K += A;
    if (K || z) yield [K, _]
}
// @from(Ln 169100, Col 0)
function YN8(q, K) {
    if (!q) return AN8;
    let _ = {
            id: $h_(q),
            ...K
        },
        z = Object.entries(_).map(([Y, A]) => `${Y}=${A}`).join(":");
    return yP(m2.HYPERLINK, z, q)
}
// @from(Ln 169110, Col 0)
function $h_(q) {
    let K = 0;
    for (let _ = 0; _ < q.length; _++) K = (K << 5) - K + q.charCodeAt(_) | 0;
    return (K >>> 0).toString(36)
}
// @from(Ln 169116, Col 0)
function Ia() {
    return !1
}
// @from(Ln 169120, Col 0)
function _K4(q) {
    let K = [],
        _ = (z) => z.type === "rgb" ? `#${[z.r,z.g,z.b].map((Y)=>Y.toString(16).padStart(2,"0")).join("")}` : "";
    if ("indicator" in q) K.push(`indicator=${q.indicator?_(q.indicator):""}`);
    if ("status" in q) K.push(`status=${q.status?.replaceAll("\\","\\\\").replaceAll(";","\\;")??""}`);
    if ("statusColor" in q) K.push(`status-color=${q.statusColor?_(q.statusColor):""}`);
    return yP(m2.TAB_STATUS, K.join(";"))
}
// @from(Ln 169128, Col 4)
nb1
// @from(Ln 169128, Col 9)
t44
// @from(Ln 169128, Col 14)
D$6
// @from(Ln 169128, Col 19)
Yh_ = 30000
// @from(Ln 169129, Col 4)
m2
// @from(Ln 169129, Col 8)
AN8
// @from(Ln 169129, Col 13)
Z$6
// @from(Ln 169129, Col 18)
f$6
// @from(Ln 169129, Col 23)
ON8
// @from(Ln 169129, Col 28)
KK4
// @from(Ln 169129, Col 33)
wN6
// @from(Ln 169130, Col 4)
HX = L(() => {
    D_();
    Q4();
    Z46();
    nb1 = wR + String.fromCharCode($R.OSC), t44 = wR + "\\";
    m2 = {
        SET_TITLE_AND_ICON: 0,
        SET_ICON: 1,
        SET_TITLE: 2,
        SET_COLOR: 4,
        SET_CWD: 7,
        HYPERLINK: 8,
        ITERM2: 9,
        SET_FG_COLOR: 10,
        SET_BG_COLOR: 11,
        SET_CURSOR_COLOR: 12,
        CLIPBOARD: 52,
        KITTY: 99,
        RESET_COLOR: 104,
        RESET_FG_COLOR: 110,
        RESET_BG_COLOR: 111,
        RESET_CURSOR_COLOR: 112,
        SEMANTIC_PROMPT: 133,
        GHOSTTY: 777,
        TAB_STATUS: 21337
    };
    AN8 = yP(m2.HYPERLINK, "", ""), Z$6 = {
        NOTIFY: 0,
        BADGE: 2,
        PROGRESS: 4
    }, f$6 = {
        CLEAR: 0,
        SET: 1,
        ERROR: 2,
        INDETERMINATE: 3
    }, ON8 = `${nb1}${m2.ITERM2};${Z$6.PROGRESS};${f$6.CLEAR};${dE}`, KK4 = `${nb1}${m2.SET_TITLE_AND_ICON};${dE}`, wN6 = yP(m2.TAB_STATUS, "indicator=;status=;status-color=")
})
// @from(Ln 169168, Col 0)
function zK4(q) {
    return {
        request: yP(q, "?"),
        match: (K) => K.type === "osc" && K.code === q
    }
}
// @from(Ln 169175, Col 0)
function YK4() {
    return {
        request: LA(">0q"),
        match: (q) => q.type === "xtversion"
    }
}
// @from(Ln 169181, Col 0)
class ib1 {
    stdout;
    queue = [];
    constructor(q) {
        this.stdout = q
    }
    send(q) {
        return new Promise((K) => {
            this.queue.push({
                kind: "query",
                match: q.match,
                resolve: (_) => K(_)
            }), this.stdout.write(q.request)
        })
    }
    flush() {
        return new Promise((q) => {
            this.queue.push({
                kind: "sentinel",
                resolve: q
            }), this.stdout.write(jh_)
        })
    }
    cancel(q) {
        let K = this.queue.findIndex((z) => z.kind === "query" && z.match === q.match);
        if (K === -1) return;
        let [_] = this.queue.splice(K, 1);
        if (_?.kind === "query") _.resolve(void 0)
    }
    onResponse(q) {
        let K = this.queue.findIndex((_) => _.kind === "query" && _.match(q));
        if (K !== -1) {
            let [_] = this.queue.splice(K, 1);
            if (_?.kind === "query") _.resolve(q);
            return
        }
        if (q.type === "da1") {
            let _ = this.queue.findIndex((z) => z.kind === "sentinel");
            if (_ === -1) return;
            for (let z of this.queue.splice(0, _ + 1))
                if (z.kind === "query") z.resolve(void 0);
                else z.resolve()
        }
    }
}
// @from(Ln 169226, Col 4)
jh_
// @from(Ln 169227, Col 4)
rb1 = L(() => {
    GI();
    HX();
    jh_ = LA("c")
})
// @from(Ln 169233, Col 0)
function AK4(q) {
    return ob1.add(q), () => {
        ob1.delete(q)
    }
}
// @from(Ln 169239, Col 0)
function OK4() {
    for (let q of ob1) q()
}
// @from(Ln 169242, Col 4)
ob1
// @from(Ln 169243, Col 4)
ab1 = L(() => {
    ob1 = new Set
})
// @from(Ln 169250, Col 0)
function Jh_() {
    return {
        loggedTmuxCcDisable: !1,
        checkedTmuxMouseHint: !1,
        checkedTmuxFocusHint: !1,
        tmuxControlModeProbed: void 0,
        gbGateCached: void 0
    }
}
// @from(Ln 169260, Col 0)
function Xh_() {
    if (!process.env.TMUX) return !1;
    if (process.env.TERM_PROGRAM !== "iTerm.app") return !1;
    let q = process.env.TERM ?? "";
    return !q.startsWith("screen") && !q.startsWith("tmux")
}
// @from(Ln 169267, Col 0)
function Mh_(q) {
    if (q.tmuxControlModeProbed = Xh_(), q.tmuxControlModeProbed) return;
    if (!process.env.TMUX) return;
    if (process.env.TERM_PROGRAM) return;
    let K;
    try {
        K = Hh_("tmux", ["display-message", "-p", "#{client_control_mode}"], {
            encoding: "utf8",
            timeout: 2000
        })
    } catch {
        return
    }
    if (K.status !== 0) return;
    q.tmuxControlModeProbed = K.stdout.trim() === "1"
}
// @from(Ln 169284, Col 0)
function Xa6(q = Ja6) {
    if (q.tmuxControlModeProbed === void 0) Mh_(q);
    return q.tmuxControlModeProbed ?? !1
}
// @from(Ln 169289, Col 0)
function lq(q = Ja6) {
    if (c5(process.env.CLAUDE_CODE_NO_FLICKER)) return !1;
    if (S6(process.env.CLAUDE_CODE_NO_FLICKER)) return !0;
    if (Xa6(q)) {
        if (!q.loggedTmuxCcDisable) q.loggedTmuxCcDisable = !0, E("fullscreen disabled: tmux -CC (iTerm2 integration mode) detected · set CLAUDE_CODE_NO_FLICKER=1 to override");
        return !1
    }
    switch (v7().tui) {
        case "fullscreen":
            return !0;
        case "default":
            return !1
    }
    return q.gbGateCached ??= u8("tengu_pewter_brook", !1), q.gbGateCached
}
// @from(Ln 169305, Col 0)
function wK4() {
    if (S6(process.env.CLAUDE_CODE_NO_FLICKER)) return "on";
    if (c5(process.env.CLAUDE_CODE_NO_FLICKER)) return "off";
    return
}
// @from(Ln 169311, Col 0)
function sb1() {
    return !S6(process.env.CLAUDE_CODE_DISABLE_MOUSE)
}
// @from(Ln 169315, Col 0)
function Ph_(q = Ja6) {
    return wV() && lq(q)
}
// @from(Ln 169318, Col 0)
async function $K4(q = Ja6) {
    if (!process.env.TMUX) return null;
    if (!Ph_(q) || Xa6(q)) return null;
    if (q.checkedTmuxMouseHint) return null;
    q.checkedTmuxMouseHint = !0;
    let {
        stdout: K,
        code: _
    } = await w1("tmux", ["show", "-Av", "mouse"], {
        useCwd: !1,
        timeout: 2000
    });
    if (_ !== 0 || K.trim() === "on") return null;
    return "tmux detected · scroll with PgUp/PgDn · or add 'set -g mouse on' to ~/.tmux.conf for wheel scroll"
}
// @from(Ln 169333, Col 0)
async function jK4(q = Ja6) {
    if (!process.env.TMUX) return null;
    if (Xa6(q)) return null;
    if (q.checkedTmuxFocusHint) return null;
    q.checkedTmuxFocusHint = !0;
    let {
        stdout: K,
        code: _
    } = await w1("tmux", ["show", "-gv", "focus-events"], {
        useCwd: !1,
        timeout: 2000
    });
    if (_ !== 0 || K.trim() === "on") return null;
    return "tmux focus-events off · add 'set -g focus-events on' to ~/.tmux.conf and reattach for focus tracking"
}
// @from(Ln 169348, Col 4)
Ja6
// @from(Ln 169349, Col 4)
nO = L(() => {
    y8();
    B1();
    K8();
    Q8();
    Q4();
    a1();
    Ja6 = Jh_()
})
// @from(Ln 169358, Col 4)
HK4 = {}
// @from(Ln 169363, Col 0)
function Dh_(q, K, _) {
    let z, Y = !1,
        A = !1,
        O = _?.muxTimeoutMs ?? Wh_,
        w = Boolean(process.env.TMUX || process.env.STY) && !Xa6();
    async function $() {
        if (A) return;
        A = !0;
        try {
            let H = zK4(m2.SET_BG_COLOR),
                J = w ? {
                    ...H,
                    request: LP(H.request)
                } : H,
                X, M = w ? "dcs" : "direct";
            if (w) {
                if (X = await Promise.race([q.send(J), l7(O, void 0, {
                        unref: !0
                    }).then(() => {
                        return
                    })]), !X)
                    if (Y) q.cancel(J);
                    else q.flush(), M = "mux-bare", [X] = await Promise.all([q.send(H), q.flush()])
            } else [X] = await Promise.all([q.send(J), q.flush()]);
            if (Y) return;
            if (!X) {
                E(`systemTheme: OSC 11 query (via=${M}) got no response`, {
                    level: "debug"
                });
                return
            }
            let P = B44(X.data);
            if (E(`systemTheme: OSC 11 response=${X.data} detected=${P} via=${M}`, {
                    level: "debug"
                }), P === void 0 || P === z) return;
            z = P, m44(P), K(P)
        } finally {
            A = !1
        }
    }
    $();
    let j = AK4(() => void $());
    return () => {
        Y = !0, j()
    }
}
// @from(Ln 169409, Col 4)
Wh_ = 2000
// @from(Ln 169410, Col 4)
JK4 = L(() => {
    rb1();
    ab1();
    HX();
    K8();
    nO()
})
// @from(Ln 169418, Col 0)
function fh_() {
    return H8().theme
}
// @from(Ln 169422, Col 0)
function Gh_(q) {
    d8((K) => ({
        ...K,
        theme: q
    }))
}
// @from(Ln 169429, Col 0)
function $N8({
    children: q,
    initialState: K,
    onThemeSave: _ = Gh_
}) {
    let [z, Y] = Uv.useState(K ?? fh_), [A, O] = Uv.useState(null), [w, $] = Uv.useState(() => (K ?? z) === "auto" ? $a6() : "dark"), j = A ?? z, {
        internal_querier: H
    } = FB();
    Uv.useEffect(() => {
        {
            if (j !== "auto" || !H) return;
            let M, P = !1;
            return Promise.resolve().then(() => (JK4(), HK4)).then(({
                watchSystemTheme: W
            }) => {
                if (P) return;
                M = W(H, $)
            }), () => {
                P = !0, M?.()
            }
        }
    }, [j, H]);
    let J = j === "auto" ? w : j,
        X = Uv.useMemo(() => ({
            themeSetting: z,
            setThemeSetting: (M) => {
                if (Y(M), O(null), M === "auto") $($a6());
                _?.(M)
            },
            setPreviewTheme: (M) => {
                if (O(M), M === "auto") $($a6())
            },
            savePreview: () => {
                if (A !== null) Y(A), O(null), _?.(A)
            },
            cancelPreview: () => {
                if (A !== null) O(null)
            },
            currentTheme: J
        }), [z, A, J, _]);
    return Uv.default.createElement(wN8.Provider, {
        value: X
    }, q)
}
// @from(Ln 169474, Col 0)
function Zq() {
    let q = s(3),
        {
            currentTheme: K,
            setThemeSetting: _
        } = Uv.useContext(wN8),
        z;
    if (q[0] !== K || q[1] !== _) z = [K, _], q[0] = K, q[1] = _, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 169486, Col 0)
function $N6() {
    return Uv.useContext(wN8).themeSetting
}
// @from(Ln 169490, Col 0)
function jN8() {
    let q = s(4),
        {
            setPreviewTheme: K,
            savePreview: _,
            cancelPreview: z
        } = Uv.useContext(wN8),
        Y;
    if (q[0] !== z || q[1] !== _ || q[2] !== K) Y = {
        setPreviewTheme: K,
        savePreview: _,
        cancelPreview: z
    }, q[0] = z, q[1] = _, q[2] = K, q[3] = Y;
    else Y = q[3];
    return Y
}
// @from(Ln 169506, Col 4)
Uv
// @from(Ln 169506, Col 8)
XK4 = "dark"
// @from(Ln 169507, Col 4)
wN8
// @from(Ln 169508, Col 4)
jN6 = L(() => {
    o6();
    KN8();
    h1();
    Uv = K6(P6(), 1), wN8 = Uv.createContext({
        themeSetting: XK4,
        setThemeSetting: () => {},
        setPreviewTheme: () => {},
        savePreview: () => {},
        cancelPreview: () => {},
        currentTheme: XK4
    })
})
// @from(Ln 169522, Col 0)
function tb1(q, {
    include: K,
    exclude: _
} = {}) {
    let z = (Y) => {
        let A = (O) => typeof O === "string" ? Y === O : O.test(Y);
        if (K) return K.some(A);
        if (_) return !_.some(A);
        return !0
    };
    for (let [Y, A] of vh_(q.constructor.prototype)) {
        if (A === "constructor" || !z(A)) continue;
        let O = Reflect.getOwnPropertyDescriptor(Y, A);
        if (O && typeof O.value === "function") q[A] = q[A].bind(q)
    }
    return q
}
// @from(Ln 169539, Col 4)
vh_ = (q) => {
    let K = new Set;
    do
        for (let _ of Reflect.ownKeys(q)) K.add([q, _]); while ((q = Reflect.getPrototypeOf(q)) && q !== Object.prototype);
    return K
}
// @from(Ln 169546, Col 0)
function Th_() {}
// @from(Ln 169547, Col 4)
xa
// @from(Ln 169548, Col 4)
eb1 = L(() => {
    xa = Th_
})
// @from(Ln 169551, Col 4)
Vh_ = function() {
        return oJ.Date.now()
    }
// @from(Ln 169554, Col 4)
HN8
// @from(Ln 169555, Col 4)
MK4 = L(() => {
    GC();
    HN8 = Vh_
})
// @from(Ln 169560, Col 0)
function Nh_(q) {
    var K = q.length;
    while (K-- && kh_.test(q.charAt(K)));
    return K
}
// @from(Ln 169565, Col 4)
kh_
// @from(Ln 169565, Col 9)
PK4
// @from(Ln 169566, Col 4)
WK4 = L(() => {
    kh_ = /\s/;
    PK4 = Nh_
})
// @from(Ln 169571, Col 0)
function yh_(q) {
    return q ? q.slice(0, PK4(q) + 1).replace(Eh_, "") : q
}
// @from(Ln 169574, Col 4)
Eh_
// @from(Ln 169574, Col 9)
DK4
// @from(Ln 169575, Col 4)
ZK4 = L(() => {
    WK4();
    Eh_ = /^\s+/;
    DK4 = yh_
})
// @from(Ln 169581, Col 0)
function Ch_(q) {
    if (typeof q == "number") return q;
    if (T86(q)) return fK4;
    if (xO(q)) {
        var K = typeof q.valueOf == "function" ? q.valueOf() : q;
        q = xO(K) ? K + "" : K
    }
    if (typeof q != "string") return q === 0 ? q : +q;
    q = DK4(q);
    var _ = hh_.test(q);
    return _ || Rh_.test(q) ? Sh_(q.slice(2), _ ? 2 : 8) : Lh_.test(q) ? fK4 : +q
}
// @from(Ln 169593, Col 4)
fK4 = NaN
// @from(Ln 169594, Col 4)
Lh_
// @from(Ln 169594, Col 9)
hh_
// @from(Ln 169594, Col 14)
Rh_
// @from(Ln 169594, Col 19)
Sh_
// @from(Ln 169594, Col 24)
qI1
// @from(Ln 169595, Col 4)
GK4 = L(() => {
    ZK4();
    zV();
    IB6();
    Lh_ = /^[-+]0x[0-9a-f]+$/i, hh_ = /^0b[01]+$/i, Rh_ = /^0o[0-7]+$/i, Sh_ = parseInt;
    qI1 = Ch_
})
// @from(Ln 169603, Col 0)
function uh_(q, K, _) {
    var z, Y, A, O, w, $, j = 0,
        H = !1,
        J = !1,
        X = !0;
    if (typeof q != "function") throw TypeError(bh_);
    if (K = qI1(K) || 0, xO(_)) H = !!_.leading, J = "maxWait" in _, A = J ? Ih_(qI1(_.maxWait) || 0, K) : A, X = "trailing" in _ ? !!_.trailing : X;

    function M(k) {
        var N = z,
            R = Y;
        return z = Y = void 0, j = k, O = q.apply(R, N), O
    }

    function P(k) {
        return j = k, w = setTimeout(Z, K), H ? M(k) : O
    }

    function W(k) {
        var N = k - $,
            R = k - j,
            h = K - N;
        return J ? xh_(h, A - R) : h
    }

    function D(k) {
        var N = k - $,
            R = k - j;
        return $ === void 0 || N >= K || N < 0 || J && R >= A
    }

    function Z() {
        var k = HN8();
        if (D(k)) return G(k);
        w = setTimeout(Z, W(k))
    }

    function G(k) {
        if (w = void 0, X && z) return M(k);
        return z = Y = void 0, O
    }

    function f() {
        if (w !== void 0) clearTimeout(w);
        j = 0, z = $ = Y = w = void 0
    }

    function v() {
        return w === void 0 ? O : G(HN8())
    }

    function V() {
        var k = HN8(),
            N = D(k);
        if (z = arguments, Y = this, $ = k, N) {
            if (w === void 0) return P($);
            if (J) return clearTimeout(w), w = setTimeout(Z, K), M($)
        }
        if (w === void 0) w = setTimeout(Z, K);
        return O
    }
    return V.cancel = f, V.flush = v, V
}
// @from(Ln 169666, Col 4)
bh_ = "Expected a function"
// @from(Ln 169667, Col 4)
Ih_
// @from(Ln 169667, Col 9)
xh_
// @from(Ln 169667, Col 14)
vK4
// @from(Ln 169668, Col 4)
TK4 = L(() => {
    zV();
    MK4();
    GK4();
    Ih_ = Math.max, xh_ = Math.min;
    vK4 = uh_
})
// @from(Ln 169676, Col 0)
function Bh_(q, K, _) {
    var z = !0,
        Y = !0;
    if (typeof q != "function") throw TypeError(mh_);
    if (xO(_)) z = "leading" in _ ? !!_.leading : z, Y = "trailing" in _ ? !!_.trailing : Y;
    return vK4(q, K, {
        leading: z,
        maxWait: K,
        trailing: Y
    })
}
// @from(Ln 169687, Col 4)
mh_ = "Expected a function"
// @from(Ln 169688, Col 4)
VK4
// @from(Ln 169689, Col 4)
kK4 = L(() => {
    TK4();
    zV();
    VK4 = Bh_
})
// @from(Ln 169694, Col 4)
KI1 = 1
// @from(Ln 169695, Col 4)
JN8 = 8
// @from(Ln 169696, Col 4)
Ma6 = 32
// @from(Ln 169697, Col 4)
_I1 = 2
// @from(Ln 169698, Col 4)
zI1 = 0
// @from(Ln 169699, Col 4)
XN8 = () => {}
// @from(Ln 169700, Col 4)
YI1 = () => {}
// @from(Ln 169702, Col 0)
function DN8(q) {
    return {
        unit: 1,
        value: q
    }
}
// @from(Ln 169709, Col 0)
function vI(q) {
    return {
        unit: 2,
        value: q
    }
}
// @from(Ln 169716, Col 0)
function XJ(q, K) {
    switch (q.unit) {
        case 1:
            return q.value;
        case 2:
            return isNaN(K) ? NaN : q.value * K / 100;
        default:
            return NaN
    }
}
// @from(Ln 169727, Col 0)
function V9(q) {
    return !isNaN(q)
}
// @from(Ln 169731, Col 0)
function Qv(q, K) {
    return q === K || q !== q && K !== K
}
// @from(Ln 169735, Col 0)
function NK4() {
    return {
        direction: 0,
        flexDirection: 0,
        justifyContent: 0,
        alignItems: 4,
        alignSelf: 0,
        alignContent: 1,
        flexWrap: 0,
        overflow: 0,
        display: 0,
        positionType: 1,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: ua,
        margin: [, , , , , , , , , ].fill(jR),
        padding: [, , , , , , , , , ].fill(jR),
        border: [, , , , , , , , , ].fill(jR),
        position: [, , , , , , , , , ].fill(jR),
        gap: [, , , ].fill(jR),
        width: ua,
        height: ua,
        minWidth: jR,
        minHeight: jR,
        maxWidth: jR,
        maxHeight: jR
    }
}
// @from(Ln 169764, Col 0)
function f46(q, K, _, z = !1) {
    let Y = q[K];
    if (Y.unit === 0)
        if (K === Kk || K === TI) Y = q[6];
        else Y = q[7];
    if (Y.unit === 0) Y = q[8];
    if (Y.unit === 0) {
        if (K === Kk) Y = q[4];
        if (K === TI) Y = q[5]
    }
    if (Y.unit === 0) return 0;
    if (Y.unit === 3) return z ? NaN : 0;
    return XJ(Y, _)
}
// @from(Ln 169779, Col 0)
function dB(q, K) {
    let _ = q[K];
    if (_.unit === 0)
        if (K === Kk || K === TI) _ = q[6];
        else _ = q[7];
    if (_.unit === 0) _ = q[8];
    if (_.unit === 0) {
        if (K === Kk) _ = q[4];
        if (K === TI) _ = q[5]
    }
    return _
}
// @from(Ln 169792, Col 0)
function wd(q, K) {
    return dB(q, K).unit === 3
}
// @from(Ln 169796, Col 0)
function EK4(q) {
    for (let K = 0; K < 9; K++)
        if (q[K].unit === 3) return !0;
    return !1
}
// @from(Ln 169802, Col 0)
function MN8(q) {
    for (let K = 0; K < 9; K++)
        if (q[K].unit !== 0) return !0;
    return !1
}
// @from(Ln 169808, Col 0)
function AI1(q, K, _) {
    let z = q[6],
        Y = q[7],
        A = q[8],
        O = q[4],
        w = q[5],
        $ = isNaN(K) ? NaN : K / 100,
        j = q[0];
    if (j.unit === 0) j = z;
    if (j.unit === 0) j = A;
    if (j.unit === 0) j = O;
    if (_[0] = j.unit === 1 ? j.value : j.unit === 2 ? j.value * $ : 0, j = q[1], j.unit === 0) j = Y;
    if (j.unit === 0) j = A;
    if (_[1] = j.unit === 1 ? j.value : j.unit === 2 ? j.value * $ : 0, j = q[2], j.unit === 0) j = z;
    if (j.unit === 0) j = A;
    if (j.unit === 0) j = w;
    if (_[2] = j.unit === 1 ? j.value : j.unit === 2 ? j.value * $ : 0, j = q[3], j.unit === 0) j = Y;
    if (j.unit === 0) j = A;
    _[3] = j.unit === 1 ? j.value : j.unit === 2 ? j.value * $ : 0
}
// @from(Ln 169829, Col 0)
function Za6(q) {
    return q === 2 || q === 3
}
// @from(Ln 169833, Col 0)
function pK4(q) {
    return q === 3 || q === 1
}
// @from(Ln 169837, Col 0)
function FK4(q) {
    return Za6(q) ? 0 : 2
}
// @from(Ln 169841, Col 0)
function jI1(q) {
    switch (q) {
        case 2:
            return Kk;
        case 3:
            return TI;
        case 0:
            return QB;
        case 1:
            return ma
    }
}
// @from(Ln 169854, Col 0)
function HI1(q) {
    switch (q) {
        case 2:
            return TI;
        case 3:
            return Kk;
        case 0:
            return ma;
        case 1:
            return QB
    }
}
// @from(Ln 169867, Col 0)
function gK4() {
    let q = {
        pointScaleFactor: 1,
        errata: 0,
        useWebDefaults: !1,
        free() {},
        isExperimentalFeatureEnabled() {
            return !1
        },
        setExperimentalFeatureEnabled() {},
        setPointScaleFactor(K) {
            q.pointScaleFactor = K
        },
        getErrata() {
            return q.errata
        },
        setErrata(K) {
            q.errata = K
        },
        setUseWebDefaults(K) {
            q.useWebDefaults = K
        }
    };
    return q
}
// @from(Ln 169892, Col 0)
class WN8 {
    style;
    layout;
    parent;
    children;
    measureFunc;
    config;
    isDirty_;
    isReferenceBaseline_;
    _flexBasis = 0;
    _mainSize = 0;
    _crossSize = 0;
    _lineIndex = 0;
    _hasAutoMargin = !1;
    _hasPosition = !1;
    _hasPadding = !1;
    _hasBorder = !1;
    _hasMargin = !1;
    _lW = NaN;
    _lH = NaN;
    _lWM = 0;
    _lHM = 0;
    _lOW = NaN;
    _lOH = NaN;
    _lFW = !1;
    _lFH = !1;
    _lOutW = NaN;
    _lOutH = NaN;
    _hasL = !1;
    _mW = NaN;
    _mH = NaN;
    _mWM = 0;
    _mHM = 0;
    _mOW = NaN;
    _mOH = NaN;
    _mOutW = NaN;
    _mOutH = NaN;
    _hasM = !1;
    _fbBasis = NaN;
    _fbOwnerW = NaN;
    _fbOwnerH = NaN;
    _fbAvailMain = NaN;
    _fbAvailCross = NaN;
    _fbCrossMode = 0;
    _fbGen = -1;
    _cIn = null;
    _cOut = null;
    _cGen = -1;
    _cN = 0;
    _cWr = 0;
    _mGen = -1;
    constructor(q) {
        this.style = NK4(), this.layout = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            border: new Float64Array(4),
            padding: new Float64Array(4),
            margin: new Float64Array(4)
        }, this.parent = null, this.children = [], this.measureFunc = null, this.config = q ?? Fh_, this.isDirty_ = !0, this.isReferenceBaseline_ = !1, JI1++
    }
    insertChild(q, K) {
        q.parent = this, this.children.splice(K, 0, q), this.markDirty()
    }
    removeChild(q) {
        let K = this.children.indexOf(q);
        if (K >= 0) this.children.splice(K, 1), q.parent = null, this.markDirty()
    }
    getChild(q) {
        return this.children[q]
    }
    getChildCount() {
        return this.children.length
    }
    getParent() {
        return this.parent
    }
    free() {
        this.parent = null, this.children = [], this.measureFunc = null, this._cIn = null, this._cOut = null, JI1--
    }
    freeRecursive() {
        for (let q of this.children) q.freeRecursive();
        this.free()
    }
    reset() {
        this.style = NK4(), this.children = [], this.parent = null, this.measureFunc = null, this.isDirty_ = !0, this._hasAutoMargin = !1, this._hasPosition = !1, this._hasPadding = !1, this._hasBorder = !1, this._hasMargin = !1, this._hasL = !1, this._hasM = !1, this._cN = 0, this._cWr = 0, this._fbBasis = NaN, this._mGen = -1
    }
    markDirty() {
        if (this.isDirty_ = !0, this.parent && !this.parent.isDirty_) this.parent.markDirty()
    }
    isDirty() {
        return this.isDirty_
    }
    hasNewLayout() {
        return !0
    }
    markLayoutSeen() {}
    setMeasureFunc(q) {
        this.measureFunc = q, this.markDirty()
    }
    unsetMeasureFunc() {
        this.measureFunc = null, this.markDirty()
    }
    getComputedLeft() {
        return this.layout.left
    }
    getComputedTop() {
        return this.layout.top
    }
    getComputedWidth() {
        return this.layout.width
    }
    getComputedHeight() {
        return this.layout.height
    }
    getComputedRight() {
        let q = this.parent;
        return q ? q.layout.width - this.layout.left - this.layout.width : 0
    }
    getComputedBottom() {
        let q = this.parent;
        return q ? q.layout.height - this.layout.top - this.layout.height : 0
    }
    getComputedLayout() {
        return {
            left: this.layout.left,
            top: this.layout.top,
            right: this.getComputedRight(),
            bottom: this.getComputedBottom(),
            width: this.layout.width,
            height: this.layout.height
        }
    }
    getComputedBorder(q) {
        return this.layout.border[$I1(q)]
    }
    getComputedPadding(q) {
        return this.layout.padding[$I1(q)]
    }
    getComputedMargin(q) {
        return this.layout.margin[$I1(q)]
    }
    setWidth(q) {
        this.style.width = gB(q), this.markDirty()
    }
    setWidthPercent(q) {
        this.style.width = vI(q), this.markDirty()
    }
    setWidthAuto() {
        this.style.width = ua, this.markDirty()
    }
    setHeight(q) {
        this.style.height = gB(q), this.markDirty()
    }
    setHeightPercent(q) {
        this.style.height = vI(q), this.markDirty()
    }
    setHeightAuto() {
        this.style.height = ua, this.markDirty()
    }
    setMinWidth(q) {
        this.style.minWidth = gB(q), this.markDirty()
    }
    setMinWidthPercent(q) {
        this.style.minWidth = vI(q), this.markDirty()
    }
    setMinHeight(q) {
        this.style.minHeight = gB(q), this.markDirty()
    }
    setMinHeightPercent(q) {
        this.style.minHeight = vI(q), this.markDirty()
    }
    setMaxWidth(q) {
        this.style.maxWidth = gB(q), this.markDirty()
    }
    setMaxWidthPercent(q) {
        this.style.maxWidth = vI(q), this.markDirty()
    }
    setMaxHeight(q) {
        this.style.maxHeight = gB(q), this.markDirty()
    }
    setMaxHeightPercent(q) {
        this.style.maxHeight = vI(q), this.markDirty()
    }
    setFlexDirection(q) {
        this.style.flexDirection = q, this.markDirty()
    }
    setFlexGrow(q) {
        this.style.flexGrow = q ?? 0, this.markDirty()
    }
    setFlexShrink(q) {
        this.style.flexShrink = q ?? 0, this.markDirty()
    }
    setFlex(q) {
        if (q === void 0 || isNaN(q)) this.style.flexGrow = 0, this.style.flexShrink = 0;
        else if (q > 0) this.style.flexGrow = q, this.style.flexShrink = 1, this.style.flexBasis = DN8(0);
        else if (q < 0) this.style.flexGrow = 0, this.style.flexShrink = -q;
        else this.style.flexGrow = 0, this.style.flexShrink = 0;
        this.markDirty()
    }
    setFlexBasis(q) {
        this.style.flexBasis = gB(q), this.markDirty()
    }
    setFlexBasisPercent(q) {
        this.style.flexBasis = vI(q), this.markDirty()
    }
    setFlexBasisAuto() {
        this.style.flexBasis = ua, this.markDirty()
    }
    setFlexWrap(q) {
        this.style.flexWrap = q, this.markDirty()
    }
    setAlignItems(q) {
        this.style.alignItems = q, this.markDirty()
    }
    setAlignSelf(q) {
        this.style.alignSelf = q, this.markDirty()
    }
    setAlignContent(q) {
        this.style.alignContent = q, this.markDirty()
    }
    setJustifyContent(q) {
        this.style.justifyContent = q, this.markDirty()
    }
    setDisplay(q) {
        this.style.display = q, this.markDirty()
    }
    getDisplay() {
        return this.style.display
    }
    setPositionType(q) {
        this.style.positionType = q, this.markDirty()
    }
    setPosition(q, K) {
        this.style.position[q] = gB(K), this._hasPosition = MN8(this.style.position), this.markDirty()
    }
    setPositionPercent(q, K) {
        this.style.position[q] = vI(K), this._hasPosition = !0, this.markDirty()
    }
    setPositionAuto(q) {
        this.style.position[q] = ua, this._hasPosition = !0, this.markDirty()
    }
    setOverflow(q) {
        this.style.overflow = q, this.markDirty()
    }
    setDirection(q) {
        this.style.direction = q, this.markDirty()
    }
    setBoxSizing(q) {}
    setMargin(q, K) {
        let _ = gB(K);
        if (this.style.margin[q] = _, _.unit === 3) this._hasAutoMargin = !0;
        else this._hasAutoMargin = EK4(this.style.margin);
        this._hasMargin = this._hasAutoMargin || MN8(this.style.margin), this.markDirty()
    }
    setMarginPercent(q, K) {
        this.style.margin[q] = vI(K), this._hasAutoMargin = EK4(this.style.margin), this._hasMargin = !0, this.markDirty()
    }
    setMarginAuto(q) {
        this.style.margin[q] = ua, this._hasAutoMargin = !0, this._hasMargin = !0, this.markDirty()
    }
    setPadding(q, K) {
        this.style.padding[q] = gB(K), this._hasPadding = MN8(this.style.padding), this.markDirty()
    }
    setPaddingPercent(q, K) {
        this.style.padding[q] = vI(K), this._hasPadding = !0, this.markDirty()
    }
    setBorder(q, K) {
        this.style.border[q] = K === void 0 ? jR : DN8(K), this._hasBorder = MN8(this.style.border), this.markDirty()
    }
    setGap(q, K) {
        this.style.gap[q] = gB(K), this.markDirty()
    }
    setGapPercent(q, K) {
        this.style.gap[q] = vI(K), this.markDirty()
    }
    getFlexDirection() {
        return this.style.flexDirection
    }
    getJustifyContent() {
        return this.style.justifyContent
    }
    getAlignItems() {
        return this.style.alignItems
    }
    getAlignSelf() {
        return this.style.alignSelf
    }
    getAlignContent() {
        return this.style.alignContent
    }
    getFlexGrow() {
        return this.style.flexGrow
    }
    getFlexShrink() {
        return this.style.flexShrink
    }
    getFlexBasis() {
        return this.style.flexBasis
    }
    getFlexWrap() {
        return this.style.flexWrap
    }
    getWidth() {
        return this.style.width
    }
    getHeight() {
        return this.style.height
    }
    getOverflow() {
        return this.style.overflow
    }
    getPositionType() {
        return this.style.positionType
    }
    getDirection() {
        return this.style.direction
    }
    copyStyle(q) {}
    setDirtiedFunc(q) {}
    unsetDirtiedFunc() {}
    setIsReferenceBaseline(q) {
        this.isReferenceBaseline_ = q, this.markDirty()
    }
    isReferenceBaseline() {
        return this.isReferenceBaseline_
    }
    setAspectRatio(q) {}
    getAspectRatio() {
        return NaN
    }
    setAlwaysFormsContainingBlock(q) {}
    calculateLayout(q, K, _) {
        MI1 = 0, PI1 = 0, Pa6 = 0, $d++;
        let z = q === void 0 ? NaN : q,
            Y = K === void 0 ? NaN : K;
        Wa6(this, z, Y, V9(z) ? 1 : 0, V9(Y) ? 1 : 0, z, Y, !0);
        let A = this.layout.margin,
            O = XJ(dB(this.style.position, Kk), V9(z) ? z : 0),
            w = XJ(dB(this.style.position, QB), V9(z) ? z : 0);
        this.layout.left = A[Kk] + (V9(O) ? O : 0), this.layout.top = A[QB] + (V9(w) ? w : 0), lK4(this, this.config.pointScaleFactor, 0, 0)
    }
}
// @from(Ln 170237, Col 0)
function OI1(q, K, _, z, Y, A, O, w, $, j) {
    if (!q._cIn) q._cIn = new Float64Array(PN8 * 8), q._cOut = new Float64Array(PN8 * 2);
    if (j && q._cGen !== $d) q._cN = 0, q._cWr = 0;
    let H = q._cWr++ % PN8;
    if (q._cN < PN8) q._cN = q._cWr;
    let J = H * 8,
        X = q._cIn;
    X[J] = K, X[J + 1] = _, X[J + 2] = z, X[J + 3] = Y, X[J + 4] = A, X[J + 5] = O, X[J + 6] = w ? 1 : 0, X[J + 7] = $ ? 1 : 0, q._cOut[H * 2] = q.layout.width, q._cOut[H * 2 + 1] = q.layout.height, q._cGen = $d
}
// @from(Ln 170247, Col 0)
function wI1(q, K) {
    if (K) q._lOutW = q.layout.width, q._lOutH = q.layout.height;
    else q._mOutW = q.layout.width, q._mOutH = q.layout.height
}
// @from(Ln 170252, Col 0)
function fN8() {
    return {
        visited: MI1,
        measured: PI1,
        cacheHits: Pa6,
        live: JI1
    }
}
// @from(Ln 170261, Col 0)
function Wa6(q, K, _, z, Y, A, O, w, $ = !1, j = !1) {
    MI1++;
    let {
        style: H,
        layout: J
    } = q, X = q._cGen === $d && !w, M = w && q._mGen === $d;
    if ((!q.isDirty_ || X) && !M) {
        if (!q.isDirty_ && q._hasL && q._lWM === z && q._lHM === Y && q._lFW === $ && q._lFH === j && Qv(q._lW, K) && Qv(q._lH, _) && Qv(q._lOW, A) && Qv(q._lOH, O)) {
            Pa6++, J.width = q._lOutW, J.height = q._lOutH;
            return
        }
        if (q._cN > 0 && (X || !q.isDirty_)) {
            let Q6 = q._cIn;
            for (let W8 = 0; W8 < q._cN; W8++) {
                let G8 = W8 * 8;
                if (Q6[G8 + 2] === z && Q6[G8 + 3] === Y && Q6[G8 + 6] === ($ ? 1 : 0) && Q6[G8 + 7] === (j ? 1 : 0) && Qv(Q6[G8], K) && Qv(Q6[G8 + 1], _) && Qv(Q6[G8 + 4], A) && Qv(Q6[G8 + 5], O)) {
                    J.width = q._cOut[W8 * 2], J.height = q._cOut[W8 * 2 + 1], Pa6++;
                    return
                }
            }
        }
        if (!q.isDirty_ && !w && q._hasM && q._mWM === z && q._mHM === Y && Qv(q._mW, K) && Qv(q._mH, _) && Qv(q._mOW, A) && Qv(q._mOH, O)) {
            J.width = q._mOutW, J.height = q._mOutH, Pa6++;
            return
        }
    }
    let P = q.isDirty_;
    if (w) {
        if (q._lW = K, q._lH = _, q._lWM = z, q._lHM = Y, q._lOW = A, q._lOH = O, q._lFW = $, q._lFH = j, q._hasL = !0, q.isDirty_ = !1, P) q._hasM = !1
    } else if (q._mW = K, q._mH = _, q._mWM = z, q._mHM = Y, q._mOW = A, q._mOH = O, q._hasM = !0, q._mGen = $d, P) q._hasL = !1;
    let {
        padding: W,
        border: D,
        margin: Z
    } = J;
    if (q._hasPadding) AI1(H.padding, A, W);
    else W[0] = W[1] = W[2] = W[3] = 0;
    if (q._hasBorder) AI1(H.border, A, D);
    else D[0] = D[1] = D[2] = D[3] = 0;
    if (q._hasMargin) AI1(H.margin, A, Z);
    else Z[0] = Z[1] = Z[2] = Z[3] = 0;
    let G = W[0] + W[2] + D[0] + D[2],
        f = W[1] + W[3] + D[1] + D[3],
        v = $ ? NaN : XJ(H.width, A),
        V = j ? NaN : XJ(H.height, O),
        k = K,
        N = _,
        R = z,
        h = Y;
    if (V9(v)) k = v, R = 1;
    if (V9(V)) N = V, h = 1;
    if (k = UB(H, !0, k, A, O), N = UB(H, !1, N, A, O), q.measureFunc && q.children.length === 0) {
        let Q6 = R === 0 ? NaN : Math.max(0, k - G),
            W8 = h === 0 ? NaN : Math.max(0, N - f);
        PI1++;
        let G8 = q.measureFunc(Q6, R, W8, h);
        q.layout.width = R === 1 ? k : UB(H, !0, (G8.width ?? 0) + G, A, O), q.layout.height = h === 1 ? N : UB(H, !1, (G8.height ?? 0) + f, A, O), wI1(q, w), OI1(q, K, _, z, Y, A, O, $, j, P);
        return
    }
    if (q.children.length === 0) {
        q.layout.width = R === 1 ? k : UB(H, !0, G, A, O), q.layout.height = h === 1 ? N : UB(H, !1, f, A, O), wI1(q, w), OI1(q, K, _, z, Y, A, O, $, j, P);
        return
    }
    let C = H.flexDirection,
        x = FK4(C),
        B = Za6(C),
        m = B ? k : N,
        S = B ? N : k,
        F = B ? R : h,
        U = B ? h : R,
        g = B ? G : f,
        c = B ? f : G,
        n = V9(m) ? Math.max(0, m - g) : NaN,
        l = V9(S) ? Math.max(0, S - c) : NaN,
        z6 = hK4(H, B ? 0 : 1, n),
        A6 = [],
        e = [];
    cK4(q, A6, e);
    let i = V9(k) ? k : NaN,
        O6 = V9(N) ? N : NaN,
        J6 = H.flexWrap !== 0,
        $6 = hK4(H, B ? 1 : 0, l);
    for (let Q6 of A6) Q6._flexBasis = Uh_(Q6, C, n, l, U, i, O6);
    let H6 = [];
    if (!J6 || !V9(n) || A6.length === 0) {
        for (let Q6 of A6) Q6._lineIndex = 0;
        H6.push(A6)
    } else {
        let Q6 = 0,
            W8 = 0;
        for (let G8 = 0; G8 < A6.length; G8++) {
            let s6 = A6[G8],
                u6 = UB(s6.style, B, s6._flexBasis, i, O6),
                h6 = Math.max(0, u6) + JN6(s6, C, i),
                _8 = G8 > Q6 ? z6 : 0;
            if (G8 > Q6 && W8 + _8 + h6 > n) H6.push(A6.slice(Q6, G8)), Q6 = G8, W8 = h6;
            else W8 += _8 + h6;
            s6._lineIndex = H6.length
        }
        H6.push(A6.slice(Q6))
    }
    let q6 = H6.length,
        o = ch_(q, A6),
        _6 = Array(q6),
        r = Array(q6),
        t = o ? Array(q6).fill(0) : [],
        Y6 = 0,
        X6 = 0;
    for (let Q6 = 0; Q6 < q6; Q6++) {
        let W8 = H6[Q6],
            G8 = W8.length > 1 ? z6 * (W8.length - 1) : 0,
            s6 = G8;
        for (let i6 of W8) s6 += i6._flexBasis + JN6(i6, C, i);
        let u6 = n;
        if (!V9(u6)) {
            let i6 = B ? A : O,
                v8 = XJ(B ? H.minWidth : H.minHeight, i6),
                f1 = XJ(B ? H.maxWidth : H.maxHeight, i6);
            if (V9(f1) && s6 > f1 - g) u6 = Math.max(0, f1 - g);
            else if (V9(v8) && s6 < v8 - g) u6 = Math.max(0, v8 - g)
        }
        Qh_(W8, u6, s6, B, i, O6);
        let h6 = 0;
        for (let i6 of W8) {
            let v8 = i6.style,
                f1 = v8.alignSelf === 0 ? H.alignItems : v8.alignSelf,
                g8 = JN6(i6, x, i),
                w6 = NaN,
                D6 = 0,
                U6 = XJ(B ? v8.height : v8.width, B ? O6 : i),
                F6 = B ? QB : Kk,
                z8 = B ? ma : TI,
                l6 = i6._hasAutoMargin && (wd(v8.margin, F6) || wd(v8.margin, z8));
            if (V9(U6)) w6 = U6, D6 = 1;
            else if (f1 === 4 && !l6 && !J6 && V9(l) && U === 1) w6 = Math.max(0, l - g8), D6 = 1;
            else if (!J6 && V9(l)) w6 = Math.max(0, l - g8), D6 = 2;
            let j8 = B ? i6._mainSize : w6,
                f8 = B ? w6 : i6._mainSize;
            Wa6(i6, j8, f8, B ? 1 : D6, B ? D6 : 1, i, O6, w, B, !B), i6._crossSize = B ? i6.layout.height : i6.layout.width, h6 = Math.max(h6, i6._crossSize + g8)
        }
        if (o) {
            let i6 = 0,
                v8 = 0;
            for (let f1 of W8) {
                if (QK4(q, f1) !== 5) continue;
                let g8 = f46(f1.style.margin, QB, i),
                    w6 = f46(f1.style.margin, ma, i),
                    D6 = XI1(f1) + g8,
                    U6 = f1.layout.height + g8 + w6 - D6;
                if (D6 > i6) i6 = D6;
                if (U6 > v8) v8 = U6
            }
            if (t[Q6] = i6, i6 + v8 > h6) h6 = i6 + v8
        }
        let _8 = jI1(C),
            R8 = HI1(C),
            x6 = G8;
        for (let i6 of W8) {
            let v8 = i6.layout.margin;
            x6 += i6._mainSize + v8[_8] + v8[R8]
        }
        _6[Q6] = x6, r[Q6] = h6, Y6 = Math.max(Y6, x6), X6 += h6
    }
    let M6 = q6 > 1 ? $6 * (q6 - 1) : 0;
    X6 += M6;
    let W6 = H.overflow === 2,
        V6 = Y6 + g,
        f6 = F === 1 ? m : F === 2 && W6 ? Math.max(Math.min(m, V6), g) : J6 && q6 > 1 && F === 2 ? m : V6,
        G6 = X6 + c,
        k6 = U === 1 ? S : U === 2 && W6 ? Math.max(Math.min(S, G6), c) : G6;
    if (q.layout.width = UB(H, !0, B ? f6 : k6, A, O), q.layout.height = UB(H, !1, B ? k6 : f6, A, O), wI1(q, w), OI1(q, K, _, z, Y, A, O, $, j, P), !w) return;
    let T6 = (B ? q.layout.width : q.layout.height) - g,
        v6 = (B ? q.layout.height : q.layout.width) - c,
        L6 = jI1(C),
        y6 = HI1(C),
        c6 = B ? QB : Kk,
        Z8 = B ? ma : TI,
        N8 = pK4(C),
        R6 = B ? q.layout.width : q.layout.height,
        q8 = W[c6] + D[c6],
        L8 = $6,
        w8 = v6 - X6;
    if (q6 === 1 && !J6 && !o) r[0] = v6;
    else {
        let Q6 = Math.max(0, w8);
        switch (H.alignContent) {
            case 1:
                break;
            case 2:
                q8 += w8 / 2;
                break;
            case 3:
                q8 += w8;
                break;
            case 4:
                if (q6 > 0 && Q6 > 0) {
                    let W8 = Q6 / q6;
                    for (let G8 = 0; G8 < q6; G8++) r[G8] += W8
                }
                break;
            case 6:
                if (q6 > 1) L8 += Q6 / (q6 - 1);
                break;
            case 7:
                if (q6 > 0) L8 += Q6 / q6, q8 += Q6 / q6 / 2;
                break;
            case 8:
                if (q6 > 0) L8 += Q6 / (q6 + 1), q8 += Q6 / (q6 + 1);
                break;
            default:
                break
        }
    }
    let x8 = H.flexWrap === 2,
        a6 = B ? q.layout.height : q.layout.width,
        D8 = q8;
    for (let Q6 = 0; Q6 < q6; Q6++) {
        let W8 = H6[Q6],
            G8 = r[Q6],
            s6 = _6[Q6],
            u6 = W8.length;
        if (J6 || U !== 1)
            for (let w6 of W8) {
                let D6 = w6.style,
                    U6 = D6.alignSelf === 0 ? H.alignItems : D6.alignSelf,
                    F6 = V9(XJ(B ? D6.height : D6.width, B ? O6 : i)),
                    z8 = w6._hasAutoMargin && (wd(D6.margin, c6) || wd(D6.margin, Z8));
                if (U6 === 4 && !F6 && !z8) {
                    let l6 = JN6(w6, x, i),
                        j8 = Math.max(0, G8 - l6);
                    if (w6._crossSize !== j8) {
                        let f8 = B ? w6._mainSize : j8,
                            p8 = B ? j8 : w6._mainSize;
                        Wa6(w6, f8, p8, 1, 1, i, O6, w, B, !B), w6._crossSize = j8
                    }
                }
            }
        let h6 = W[L6] + D[L6],
            _8 = z6,
            R8 = 0;
        for (let w6 of W8) {
            if (!w6._hasAutoMargin) continue;
            if (wd(w6.style.margin, L6)) R8++;
            if (wd(w6.style.margin, y6)) R8++
        }
        let x6 = T6 - s6,
            i6 = Math.max(0, x6),
            v8 = R8 > 0 && i6 > 0 ? i6 / R8 : 0;
        if (R8 === 0) switch (H.justifyContent) {
            case 0:
                break;
            case 1:
                h6 += x6 / 2;
                break;
            case 2:
                h6 += x6;
                break;
            case 3:
                if (u6 > 1) _8 += i6 / (u6 - 1);
                break;
            case 4:
                if (u6 > 0) _8 += i6 / u6, h6 += i6 / u6 / 2;
                break;
            case 5:
                if (u6 > 0) _8 += i6 / (u6 + 1), h6 += i6 / (u6 + 1);
                break
        }
        let f1 = x8 ? a6 - D8 - G8 : D8,
            g8 = h6;
        for (let w6 of W8) {
            let D6 = w6.style.margin,
                U6 = w6.layout.margin,
                F6 = !1,
                z8 = !1,
                l6 = !1,
                j8 = !1,
                f8, p8, o8, n1;
            if (w6._hasAutoMargin) F6 = wd(D6, L6), z8 = wd(D6, y6), l6 = wd(D6, c6), j8 = wd(D6, Z8), f8 = F6 ? v8 : U6[L6], p8 = z8 ? v8 : U6[y6], o8 = l6 ? 0 : U6[c6], n1 = j8 ? 0 : U6[Z8];
            else f8 = U6[L6], p8 = U6[y6], o8 = U6[c6], n1 = U6[Z8];
            let c1 = N8 ? R6 - (g8 + f8) - w6._mainSize : g8 + f8,
                dq = w6.style.alignSelf === 0 ? H.alignItems : w6.style.alignSelf,
                uq = f1 + o8,
                h4 = G8 - w6._crossSize - o8 - n1;
            if (l6 && j8) uq += Math.max(0, h4) / 2;
            else if (l6) uq += Math.max(0, h4);
            else if (j8);
            else switch (dq) {
                case 1:
                case 4:
                    if (x8) uq += h4;
                    break;
                case 2:
                    uq += h4 / 2;
                    break;
                case 3:
                    if (!x8) uq += h4;
                    break;
                case 5:
                    if (o) uq = f1 + t[Q6] - XI1(w6);
                    break;
                default:
                    break
            }
            let cq = 0,
                C1 = 0;
            if (w6._hasPosition) {
                let W7 = XJ(dB(w6.style.position, Kk), i),
                    $4 = XJ(dB(w6.style.position, TI), i),
                    t4 = XJ(dB(w6.style.position, QB), i),
                    x4 = XJ(dB(w6.style.position, ma), i);
                cq = V9(W7) ? W7 : V9($4) ? -$4 : 0, C1 = V9(t4) ? t4 : V9(x4) ? -x4 : 0
            }
            if (B) w6.layout.left = c1 + cq, w6.layout.top = uq + C1;
            else w6.layout.left = uq + cq, w6.layout.top = c1 + C1;
            g8 += w6._mainSize + f8 + p8 + _8
        }
        D8 += G8 + L8
    }
    for (let Q6 of e) gh_(q, Q6, q.layout.width, q.layout.height, W, D)
}
// @from(Ln 170582, Col 0)
function gh_(q, K, _, z, Y, A) {
    let O = K.style,
        w = dB(O.position, Kk),
        $ = dB(O.position, TI),
        j = dB(O.position, QB),
        H = dB(O.position, ma),
        J = XJ(w, _),
        X = XJ($, _),
        M = XJ(j, z),
        P = XJ(H, z),
        W = _ - A[0] - A[2],
        D = z - A[1] - A[3],
        Z = XJ(O.width, W),
        G = XJ(O.height, D);
    if (!V9(Z) && V9(J) && V9(X)) Z = W - J - X;
    if (!V9(G) && V9(M) && V9(P)) G = D - M - P;
    Wa6(K, Z, G, V9(Z) ? 1 : 0, V9(G) ? 1 : 0, W, D, !0);
    let f = f46(O.margin, Kk, _),
        v = f46(O.margin, QB, _),
        V = f46(O.margin, TI, _),
        k = f46(O.margin, ma, _),
        N = q.style.flexDirection,
        R = pK4(N),
        h = Za6(N),
        C = q.style.flexWrap === 2,
        x = O.alignSelf === 0 ? q.style.alignItems : O.alignSelf,
        B;
    if (V9(J)) B = A[0] + J + f;
    else if (V9(X)) B = _ - A[2] - X - K.layout.width - V;
    else if (h) {
        let S = Y[0] + A[0],
            F = _ - Y[2] - A[2];
        B = R ? F - K.layout.width - V : yK4(q.style.justifyContent, S, F, K.layout.width) + f
    } else B = LK4(x, Y[0] + A[0], _ - Y[2] - A[2], K.layout.width, C) + f;
    let m;
    if (V9(M)) m = A[1] + M + v;
    else if (V9(P)) m = z - A[3] - P - K.layout.height - k;
    else if (h) m = LK4(x, Y[1] + A[1], z - Y[3] - A[3], K.layout.height, C) + v;
    else {
        let S = Y[1] + A[1],
            F = z - Y[3] - A[3];
        m = R ? F - K.layout.height - k : yK4(q.style.justifyContent, S, F, K.layout.height) + v
    }
    K.layout.left = B, K.layout.top = m
}
// @from(Ln 170628, Col 0)
function yK4(q, K, _, z) {
    switch (q) {
        case 1:
            return K + (_ - K - z) / 2;
        case 2:
            return _ - z;
        default:
            return K
    }
}
// @from(Ln 170639, Col 0)
function LK4(q, K, _, z, Y) {
    switch (q) {
        case 2:
            return K + (_ - K - z) / 2;
        case 3:
            return Y ? K : _ - z;
        default:
            return Y ? _ - z : K
    }
}
// @from(Ln 170650, Col 0)
function Uh_(q, K, _, z, Y, A, O) {
    if ((q._fbGen === $d || !q.isDirty_) && q._fbCrossMode === Y && Qv(q._fbOwnerW, A) && Qv(q._fbOwnerH, O) && Qv(q._fbAvailMain, _) && Qv(q._fbAvailCross, z)) return q._fbBasis;
    let $ = q.style,
        j = Za6(K),
        H = XJ($.flexBasis, _);
    if (V9(H)) {
        let h = Math.max(0, H);
        return q._fbBasis = h, q._fbOwnerW = A, q._fbOwnerH = O, q._fbAvailMain = _, q._fbAvailCross = z, q._fbCrossMode = Y, q._fbGen = $d, h
    }
    let J = j ? $.width : $.height,
        M = XJ(J, j ? A : O);
    if (V9(M)) {
        let h = Math.max(0, M);
        return q._fbBasis = h, q._fbOwnerW = A, q._fbOwnerH = O, q._fbAvailMain = _, q._fbAvailCross = z, q._fbCrossMode = Y, q._fbGen = $d, h
    }
    let P = j ? $.height : $.width,
        D = XJ(P, j ? O : A),
        Z = V9(D) ? 1 : 0;
    if (!V9(D) && V9(z)) D = z - JN6(q, FK4(K), A), Z = Y === 1 && dh_(q) ? 1 : 2;
    let G = NaN,
        f = 0;
    if (j && V9(_) && UK4(q)) G = _ - JN6(q, K, A), f = 2;
    Wa6(q, j ? G : D, j ? D : G, j ? f : Z, j ? Z : f, A, O, !1);
    let R = j ? q.layout.width : q.layout.height;
    return q._fbBasis = R, q._fbOwnerW = A, q._fbOwnerH = O, q._fbAvailMain = _, q._fbAvailCross = z, q._fbCrossMode = Y, q._fbGen = $d, R
}
// @from(Ln 170677, Col 0)
function UK4(q) {
    if (q.measureFunc) return !0;
    for (let K of q.children)
        if (UK4(K)) return !0;
    return !1
}
// @from(Ln 170684, Col 0)
function Qh_(q, K, _, z, Y, A) {
    let O = q.length,
        w = Array(O).fill(!1),
        $ = V9(K) ? K - _ : 0;
    for (let H = 0; H < O; H++) {
        let J = q[H],
            X = UB(J.style, z, J._flexBasis, Y, A);
        if (!V9(K) || ($ >= 0 ? J.style.flexGrow === 0 : J.style.flexShrink === 0)) J._mainSize = Math.max(0, X), w[H] = !0;
        else J._mainSize = J._flexBasis
    }
    let j = Array(O);
    for (let H = 0; H <= O; H++) {
        let J = 0,
            X = 0,
            M = 0,
            P = 0;
        for (let G = 0; G < O; G++) {
            let f = q[G];
            if (w[G]) J += f._mainSize - f._flexBasis;
            else X += f.style.flexGrow, M += f.style.flexShrink * f._flexBasis, P++
        }
        if (P === 0) break;
        let W = $ - J;
        if (W > 0 && X > 0 && X < 1) {
            let G = $ * X;
            if (G < W) W = G
        } else if (W < 0 && M > 0) {
            let G = 0;
            for (let f = 0; f < O; f++)
                if (!w[f]) G += q[f].style.flexShrink;
            if (G < 1) {
                let f = $ * G;
                if (f > W) W = f
            }
        }
        let D = 0;
        for (let G = 0; G < O; G++) {
            if (w[G]) continue;
            let f = q[G],
                v = f._flexBasis;
            if (W > 0 && X > 0) v += W * f.style.flexGrow / X;
            else if (W < 0 && M > 0) v += W * (f.style.flexShrink * f._flexBasis) / M;
            j[G] = v;
            let V = Math.max(0, UB(f.style, z, v, Y, A));
            f._mainSize = V, D += V - v
        }
        if (D === 0) break;
        let Z = !1;
        for (let G = 0; G < O; G++) {
            if (w[G]) continue;
            let f = q[G]._mainSize - j[G];
            if (D > 0 && f > 0 || D < 0 && f < 0) w[G] = !0, Z = !0
        }
        if (!Z) break
    }
}
// @from(Ln 170741, Col 0)
function dh_(q) {
    let K = q.parent;
    if (!K) return !1;
    return (q.style.alignSelf === 0 ? K.style.alignItems : q.style.alignSelf) === 4
}
// @from(Ln 170747, Col 0)
function QK4(q, K) {
    return K.style.alignSelf === 0 ? q.style.alignItems : K.style.alignSelf
}
// @from(Ln 170751, Col 0)
function XI1(q) {
    let K = null;
    for (let _ of q.children) {
        if (_._lineIndex > 0) break;
        if (_.style.positionType === 2) continue;
        if (_.style.display === 1) continue;
        if (QK4(q, _) === 5 || _.isReferenceBaseline_) {
            K = _;
            break
        }
        if (K === null) K = _
    }
    if (K === null) return q.layout.height;
    return XI1(K) + K.layout.top
}
// @from(Ln 170767, Col 0)
function ch_(q, K) {
    if (!Za6(q.style.flexDirection)) return !1;
    if (q.style.alignItems === 5) return !0;
    for (let _ of K)
        if (_.style.alignSelf === 5) return !0;
    return !1
}
// @from(Ln 170775, Col 0)
function JN6(q, K, _) {
    if (!q._hasMargin) return 0;
    let z = f46(q.style.margin, jI1(K), _),
        Y = f46(q.style.margin, HI1(K), _);
    return z + Y
}
// @from(Ln 170782, Col 0)
function hK4(q, K, _) {
    let z = q.gap[K];
    if (z.unit === 0) z = q.gap[2];
    let Y = XJ(z, _);
    return V9(Y) ? Math.max(0, Y) : 0
}
// @from(Ln 170789, Col 0)
function UB(q, K, _, z, Y) {
    let A = K ? q.minWidth : q.minHeight,
        O = K ? q.maxWidth : q.maxHeight,
        w = A.unit,
        $ = O.unit;
    if (w === 0 && $ === 0) return _;
    let j = K ? z : Y,
        H = _;
    if ($ === 1) {
        if (H > O.value) H = O.value
    } else if ($ === 2) {
        let J = O.value * j / 100;
        if (J === J && H > J) H = J
    }
    if (w === 1) {
        if (H < A.value) H = A.value
    } else if (w === 2) {
        let J = A.value * j / 100;
        if (J === J && H < J) H = J
    }
    return H
}
// @from(Ln 170812, Col 0)
function dK4(q) {
    for (let K of q.children) K.layout.left = 0, K.layout.top = 0, K.layout.width = 0, K.layout.height = 0, K.isDirty_ = !0, K._hasL = !1, K._hasM = !1, dK4(K)
}
// @from(Ln 170816, Col 0)
function cK4(q, K, _) {
    for (let z of q.children) {
        let Y = z.style.display;
        if (Y === 1) z.layout.left = 0, z.layout.top = 0, z.layout.width = 0, z.layout.height = 0, dK4(z);
        else if (Y === 2) z.layout.left = 0, z.layout.top = 0, z.layout.width = 0, z.layout.height = 0, cK4(z, K, _);
        else if (z.style.positionType === 2) _.push(z);
        else K.push(z)
    }
}
// @from(Ln 170826, Col 0)
function lK4(q, K, _, z) {
    if (K === 0) return;
    let Y = q.layout,
        A = Y.left,
        O = Y.top,
        w = Y.width,
        $ = Y.height,
        j = _ + A,
        H = z + O,
        J = q.measureFunc !== null;
    Y.left = HN6(A, K, !1, J), Y.top = HN6(O, K, !1, J);
    let X = j + w,
        M = H + $,
        P = !RK4(w * K),
        W = !RK4($ * K);
    Y.width = HN6(X, K, J && P, J && !P) - HN6(j, K, !1, J), Y.height = HN6(M, K, J && W, J && !W) - HN6(H, K, !1, J);
    for (let D of q.children) lK4(D, K, j, H)
}
// @from(Ln 170845, Col 0)
function RK4(q) {
    let K = q - Math.floor(q);
    return K < 0.0001 || K > 0.9999
}
// @from(Ln 170850, Col 0)
function HN6(q, K, _, z) {
    let Y = q * K,
        A = Y - Math.floor(Y);
    if (A < 0) A += 1;
    if (A < 0.0001) Y = Math.floor(Y);
    else if (A > 0.9999) Y = Math.ceil(Y);
    else if (_) Y = Math.ceil(Y);
    else if (z) Y = Math.floor(Y);
    else Y = Math.floor(Y) + (A >= 0.4999 ? 1 : 0);
    return Y / K
}
// @from(Ln 170862, Col 0)
function gB(q) {
    if (q === void 0) return jR;
    if (q === "auto") return ua;
    if (typeof q === "number") return Number.isFinite(q) ? DN8(q) : jR;
    if (typeof q === "string" && q.endsWith("%")) return vI(parseFloat(q));
    let K = parseFloat(q);
    return isNaN(K) ? jR : DN8(K)
}
// @from(Ln 170871, Col 0)
function $I1(q) {
    switch (q) {
        case 0:
        case 4:
            return Kk;
        case 1:
            return QB;
        case 2:
        case 5:
            return TI;
        case 3:
            return ma;
        default:
            return Kk
    }
}
// @from(Ln 170887, Col 4)
jR
// @from(Ln 170887, Col 8)
ua
// @from(Ln 170887, Col 12)
Kk = 0
// @from(Ln 170888, Col 4)
QB = 1
// @from(Ln 170889, Col 4)
TI = 2
// @from(Ln 170890, Col 4)
ma = 3
// @from(Ln 170891, Col 4)
Fh_
// @from(Ln 170891, Col 9)
PN8 = 4
// @from(Ln 170892, Col 4)
$d = 0
// @from(Ln 170893, Col 4)
MI1 = 0
// @from(Ln 170894, Col 4)
PI1 = 0
// @from(Ln 170895, Col 4)
Pa6 = 0
// @from(Ln 170896, Col 4)
JI1 = 0
// @from(Ln 170897, Col 4)
lh_
// @from(Ln 170897, Col 9)
nK4
// @from(Ln 170898, Col 4)
GN8 = L(() => {
    YI1();
    jR = {
        unit: 0,
        value: NaN
    }, ua = {
        unit: 3,
        value: NaN
    };
    Fh_ = gK4();
    lh_ = {
        Config: {
            create: gK4,
            destroy() {}
        },
        Node: {
            create: (q) => new WN8(q),
            createDefault: () => new WN8,
            createWithConfig: (q) => new WN8(q),
            destroy() {}
        }
    }, nK4 = lh_
})
// @from(Ln 170922, Col 0)
function iK4(q) {
    let K = process.argv.indexOf("--");
    return (K === -1 ? process.argv : process.argv.slice(0, K)).some((z) => q.has(z))
}
// @from(Ln 170927, Col 0)
function ah_() {
    if (process.env.NO_COLOR && process.env.FORCE_COLOR === void 0 && !oh_() && Y8.level > 0) return Y8.level = 0, !0;
    return !1
}
// @from(Ln 170932, Col 0)
function sh_() {
    if (process.env.TERM_PROGRAM === "vscode" && Y8.level === 2) return Y8.level = 3, !0;
    return !1
}
// @from(Ln 170937, Col 0)
function eh_() {
    if (!process.stdout.isTTY || process.env.NO_COLOR || process.env.FORCE_COLOR !== void 0 || rh_()) return !1;
    let q = process.env.TERM;
    if (q && th_.has(q) && Y8.level < 3) return Y8.level = 3, !0;
    return !1
}
// @from(Ln 170944, Col 0)
function qR_() {
    if (process.env.CLAUDE_CODE_TMUX_TRUECOLOR) return !1;
    if (process.env.TMUX && Y8.level > 2) return Y8.level = 2, !0;
    return !1
}
// @from(Ln 170950, Col 0)
function XN6(q, K) {
    let _ = q;
    if (K.inverse) _ = Y8.inverse(_);
    if (K.strikethrough) _ = Y8.strikethrough(_);
    if (K.underline) _ = Y8.underline(_);
    if (K.italic) _ = Y8.italic(_);
    if (K.bold) _ = Y8.bold(_);
    if (K.dim) _ = Y8.dim(_);
    if (K.color) _ = G46(_, K.color, "foreground");
    if (K.backgroundColor) _ = G46(_, K.backgroundColor, "background");
    return _
}
// @from(Ln 170963, Col 0)
function Ba(q, K) {
    if (!K) return q;
    return G46(q, K, "foreground")
}
// @from(Ln 170967, Col 4)
nh_
// @from(Ln 170967, Col 9)
ih_
// @from(Ln 170967, Col 14)
rh_ = () => iK4(nh_)
// @from(Ln 170968, Col 4)
oh_ = () => iK4(ih_)
// @from(Ln 170969, Col 4)
th_
// @from(Ln 170969, Col 9)
j6w
// @from(Ln 170969, Col 14)
H6w
// @from(Ln 170969, Col 19)
J6w
// @from(Ln 170969, Col 24)
X6w
// @from(Ln 170969, Col 29)
KR_
// @from(Ln 170969, Col 34)
_R_
// @from(Ln 170969, Col 39)
G46 = (q, K, _) => {
        if (!K) return q;
        if (K.startsWith("ansi:")) switch (K.substring(5)) {
            case "black":
                return _ === "foreground" ? Y8.black(q) : Y8.bgBlack(q);
            case "red":
                return _ === "foreground" ? Y8.red(q) : Y8.bgRed(q);
            case "green":
                return _ === "foreground" ? Y8.green(q) : Y8.bgGreen(q);
            case "yellow":
                return _ === "foreground" ? Y8.yellow(q) : Y8.bgYellow(q);
            case "blue":
                return _ === "foreground" ? Y8.blue(q) : Y8.bgBlue(q);
            case "magenta":
                return _ === "foreground" ? Y8.magenta(q) : Y8.bgMagenta(q);
            case "cyan":
                return _ === "foreground" ? Y8.cyan(q) : Y8.bgCyan(q);
            case "white":
                return _ === "foreground" ? Y8.white(q) : Y8.bgWhite(q);
            case "blackBright":
                return _ === "foreground" ? Y8.blackBright(q) : Y8.bgBlackBright(q);
            case "redBright":
                return _ === "foreground" ? Y8.redBright(q) : Y8.bgRedBright(q);
            case "greenBright":
                return _ === "foreground" ? Y8.greenBright(q) : Y8.bgGreenBright(q);
            case "yellowBright":
                return _ === "foreground" ? Y8.yellowBright(q) : Y8.bgYellowBright(q);
            case "blueBright":
                return _ === "foreground" ? Y8.blueBright(q) : Y8.bgBlueBright(q);
            case "magentaBright":
                return _ === "foreground" ? Y8.magentaBright(q) : Y8.bgMagentaBright(q);
            case "cyanBright":
                return _ === "foreground" ? Y8.cyanBright(q) : Y8.bgCyanBright(q);
            case "whiteBright":
                return _ === "foreground" ? Y8.whiteBright(q) : Y8.bgWhiteBright(q)
        }
        if (K.startsWith("#")) return _ === "foreground" ? Y8.hex(K)(q) : Y8.bgHex(K)(q);
        if (K.startsWith("ansi256")) {
            let z = _R_.exec(K);
            if (!z) return q;
            let Y = Number(z[1]);
            return _ === "foreground" ? Y8.ansi256(Y)(q) : Y8.bgAnsi256(Y)(q)
        }
        if (K.startsWith("rgb")) {
            let z = KR_.exec(K);
            if (!z) return q;
            let Y = Number(z[1]),
                A = Number(z[2]),
                O = Number(z[3]);
            return _ === "foreground" ? Y8.rgb(Y, A, O)(q) : Y8.bgRgb(Y, A, O)(q)
        }
        return q
    }
// @from(Ln 171022, Col 4)
G$6 = L(() => {
    Y3();
    nh_ = new Set(["--no-color", "--no-colors", "--color=false", "--color=never"]), ih_ = new Set(["--color", "--colors", "--color=true", "--color=always", "--color=256", "--color=16m", "--color=full", "--color=truecolor"]);
    th_ = new Set(["alacritty", "contour", "foot", "ghostty", "rio", "wezterm", "xterm-ghostty", "xterm-kitty"]);
    j6w = ah_(), H6w = sh_(), J6w = eh_(), X6w = qR_(), KR_ = /^rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/, _R_ = /^ansi256\(\s?(\d+)\s?\)$/
})
// @from(Ln 171028, Col 4)
oK4 = {}
// @from(Ln 171039, Col 0)
function zR_() {
    if (!process.stdin.isTTY || MN6 || process.argv.includes("-p") || process.argv.includes("--print")) return;
    MN6 = !0, cB = "";
    try {
        process.stdin.setEncoding("utf8"), process.stdin.setRawMode(!0), process.stdin.ref(), fa6 = () => {
            let q = process.stdin.read();
            while (q !== null) {
                if (typeof q === "string") rK4(q);
                q = process.stdin.read()
            }
        }, process.stdin.on("readable", fa6)
    } catch {
        MN6 = !1
    }
}
// @from(Ln 171055, Col 0)
function rK4(q) {
    let K = 0;
    while (K < q.length) {
        let _ = q[K],
            z = _.charCodeAt(0);
        if (z === 3) {
            v46(), process.exit(130);
            return
        }
        if (z === 4) {
            v46();
            return
        }
        if (z === 127 || z === 8) {
            if (cB.length > 0) {
                let Y = ci(cB);
                cB = cB.slice(0, -(Y.length || 1))
            }
            K++;
            continue
        }
        if (z === 27) {
            K++;
            let Y = K < q.length ? q.charCodeAt(K) : -1;
            if (Y === 91) {
                K++;
                while (K < q.length && q.charCodeAt(K) < 64) K++;
                if (K < q.length) K++
            } else if (Y === 93 || Y === 80 || Y === 88 || Y === 94 || Y === 95) {
                K++;
                while (K < q.length) {
                    let A = q.charCodeAt(K);
                    if (A === 7) {
                        K++;
                        break
                    }
                    if (A === 27 && K + 1 < q.length && q.charCodeAt(K + 1) === 92) {
                        K += 2;
                        break
                    }
                    K++
                }
            } else if (Y === 79) K += 2;
            else if (Y !== -1 && Y !== 27) K++;
            continue
        }
        if (z < 32 && z !== 9 && z !== 10 && z !== 13) {
            K++;
            continue
        }
        if (z === 13) {
            cB += `
`, K++;
            continue
        }
        cB += _, K++
    }
}
// @from(Ln 171114, Col 0)
function v46() {
    if (!MN6) return;
    if (MN6 = !1, fa6) process.stdin.removeListener("readable", fa6), fa6 = null
}
// @from(Ln 171119, Col 0)
function WI1() {
    v46();
    let q = cB.trim();
    return cB = "", q
}
// @from(Ln 171125, Col 0)
function YR_() {
    return cB.trim().length > 0
}
// @from(Ln 171129, Col 0)
function DI1(q) {
    cB = q
}
// @from(Ln 171133, Col 0)
function AR_() {
    return MN6
}
// @from(Ln 171136, Col 4)
cB = ""
// @from(Ln 171137, Col 4)
MN6 = !1
// @from(Ln 171138, Col 4)
fa6 = null
// @from(Ln 171139, Col 4)
Ga6 = L(() => {
    IZ()
})
// @from(Ln 171143, Col 0)
function T46(q) {
    let K = "ground",
        _ = "",
        z = q?.x10Mouse ?? !1;
    return {
        feed(Y) {
            let A = aK4(Y, K, _, !1, z);
            return K = A.state.state, _ = A.state.buffer, A.tokens
        },
        flush() {
            let Y = aK4("", K, _, !0, z);
            return K = Y.state.state, _ = Y.state.buffer, Y.tokens
        },
        reset() {
            K = "ground", _ = ""
        },
        buffer() {
            return _
        }
    }
}