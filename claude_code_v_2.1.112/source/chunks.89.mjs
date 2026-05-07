
// @from(Ln 236746, Col 9)
sW
// @from(Ln 236746, Col 13)
Gj
// @from(Ln 236747, Col 4)
vH = L(() => {
    U4();
    y8();
    z68();
    K8();
    Q8();
    m8();
    Q4();
    eK();
    Yq();
    pK();
    U8();
    a1();
    Li();
    Th();
    e8();
    WS8();
    vS8();
    Y68();
    TS8();
    A68();
    yD();
    iK6();
    Xc();
    m$();
    NQ1();
    Jy();
    aW();
    Y56();
    ZG4();
    yS8();
    Hv();
    EL6();
    __z = C6(() => CW().pick(Object.fromEntries(DG4.map((q) => [q, !0]))).strip());
    sW = P1(async () => {
        let q = await SG4(() => LG4({
            cacheOnly: !1
        }));
        return Gj.cache?.set(void 0, Promise.resolve(q)), q
    }), Gj = P1(async () => {
        if (S6(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL)) return sW();
        return SG4(() => LG4({
            cacheOnly: !0
        }))
    })
})
// @from(Ln 236793, Col 4)
aS8 = (q) => q.name === "up" || q.name === "k" || q.ctrl && q.name === "p"
// @from(Ln 236794, Col 4)
Pd1 = (q) => q.name === "down" || q.name === "j" || q.ctrl && q.name === "n"
// @from(Ln 236795, Col 4)
sS8 = (q) => q.name === "backspace"
// @from(Ln 236796, Col 4)
CG4 = (q) => "123456789".includes(q.name)
// @from(Ln 236797, Col 4)
SL6 = (q) => q.name === "enter" || q.name === "return"
// @from(Ln 236798, Col 4)
Wd1
// @from(Ln 236798, Col 9)
Dd1
// @from(Ln 236798, Col 14)
Zd1
// @from(Ln 236798, Col 19)
fd1
// @from(Ln 236798, Col 24)
E68
// @from(Ln 236799, Col 4)
tS8 = L(() => {
    Wd1 = class Wd1 extends Error {
        name = "AbortPromptError";
        message = "Prompt was aborted";
        constructor(q) {
            super();
            this.cause = q?.cause
        }
    };
    Dd1 = class Dd1 extends Error {
        name = "CancelPromptError";
        message = "Prompt was canceled"
    };
    Zd1 = class Zd1 extends Error {
        name = "ExitPromptError"
    };
    fd1 = class fd1 extends Error {
        name = "HookError"
    };
    E68 = class E68 extends Error {
        name = "ValidationError"
    }
})
// @from(Ln 236827, Col 0)
function M_z(q) {
    return {
        rl: q,
        hooks: [],
        hooksCleanup: [],
        hooksEffect: [],
        index: 0,
        handleChange() {}
    }
}
// @from(Ln 236838, Col 0)
function IG4(q, K) {
    let _ = M_z(q);
    return bG4.run(_, () => {
        function z(Y) {
            _.handleChange = () => {
                _.index = 0, Y()
            }, _.handleChange()
        }
        return K(z)
    })
}
// @from(Ln 236850, Col 0)
function HH6() {
    let q = bG4.getStore();
    if (!q) throw new fd1("[Inquirer] Hook functions can only be called from within a prompt");
    return q
}
// @from(Ln 236856, Col 0)
function Gd1() {
    return HH6().rl
}
// @from(Ln 236860, Col 0)
function vd1(q) {
    let K = (..._) => {
        let z = HH6(),
            Y = !1,
            A = z.handleChange;
        z.handleChange = () => {
            Y = !0
        };
        let O = q(..._);
        if (Y) A();
        return z.handleChange = A, O
    };
    return X_z.bind(K)
}
// @from(Ln 236875, Col 0)
function CL6(q) {
    let K = HH6(),
        {
            index: _
        } = K,
        z = {
            get() {
                return K.hooks[_]
            },
            set(A) {
                K.hooks[_] = A
            },
            initialized: _ in K.hooks
        },
        Y = q(z);
    return K.index++, Y
}
// @from(Ln 236893, Col 0)
function xG4() {
    HH6().handleChange()
}
// @from(Ln 236896, Col 4)
bG4
// @from(Ln 236896, Col 9)
JH6
// @from(Ln 236897, Col 4)
XH6 = L(() => {
    tS8();
    bG4 = new J_z;
    JH6 = {
        queue(q) {
            let K = HH6(),
                {
                    index: _
                } = K;
            K.hooksEffect.push(() => {
                K.hooksCleanup[_]?.();
                let z = q(Gd1());
                if (z != null && typeof z !== "function") throw new E68("useEffect return value must be a cleanup function or nothing.");
                K.hooksCleanup[_] = z
            })
        },
        run() {
            let q = HH6();
            vd1(() => {
                q.hooksEffect.forEach((K) => {
                    K()
                }), q.hooksEffect.length = 0
            })()
        },
        clearAll() {
            let q = HH6();
            q.hooksCleanup.forEach((K) => {
                K?.()
            }), q.hooksEffect.length = 0, q.hooksCleanup.length = 0
        }
    }
})
// @from(Ln 236930, Col 0)
function Bf(q) {
    return CL6((K) => {
        let _ = (Y) => {
            if (K.get() !== Y) K.set(Y), xG4()
        };
        if (K.initialized) return [K.get(), _];
        let z = typeof q === "function" ? q() : q;
        return K.set(z), [z, _]
    })
}
// @from(Ln 236940, Col 4)
eS8 = L(() => {
    XH6()
})
// @from(Ln 236944, Col 0)
function MH6(q, K) {
    CL6((_) => {
        let z = _.get();
        if (!Array.isArray(z) || K.some((A, O) => !Object.is(A, z[O]))) JH6.queue(q);
        _.set(K)
    })
}
// @from(Ln 236951, Col 4)
qC8 = L(() => {
    XH6()
})
// @from(Ln 236954, Col 4)
KC8 = p((SNw, uG4) => {
    var P_z = d6("node:tty"),
        W_z = P_z?.WriteStream?.prototype?.hasColors?.() ?? !1,
        N_ = (q, K) => {
            if (!W_z) return (Y) => Y;
            let _ = `\x1B[${q}m`,
                z = `\x1B[${K}m`;
            return (Y) => {
                let A = Y + "",
                    O = A.indexOf(z);
                if (O === -1) return _ + A + z;
                let w = _,
                    $ = 0;
                while (O !== -1) w += A.slice($, O) + _, $ = O + z.length, O = A.indexOf(z, $);
                return w += A.slice($) + z, w
            }
        },
        j_ = {};
    j_.reset = N_(0, 0);
    j_.bold = N_(1, 22);
    j_.dim = N_(2, 22);
    j_.italic = N_(3, 23);
    j_.underline = N_(4, 24);
    j_.overline = N_(53, 55);
    j_.inverse = N_(7, 27);
    j_.hidden = N_(8, 28);
    j_.strikethrough = N_(9, 29);
    j_.black = N_(30, 39);
    j_.red = N_(31, 39);
    j_.green = N_(32, 39);
    j_.yellow = N_(33, 39);
    j_.blue = N_(34, 39);
    j_.magenta = N_(35, 39);
    j_.cyan = N_(36, 39);
    j_.white = N_(37, 39);
    j_.gray = N_(90, 39);
    j_.bgBlack = N_(40, 49);
    j_.bgRed = N_(41, 49);
    j_.bgGreen = N_(42, 49);
    j_.bgYellow = N_(43, 49);
    j_.bgBlue = N_(44, 49);
    j_.bgMagenta = N_(45, 49);
    j_.bgCyan = N_(46, 49);
    j_.bgWhite = N_(47, 49);
    j_.bgGray = N_(100, 49);
    j_.redBright = N_(91, 39);
    j_.greenBright = N_(92, 39);
    j_.yellowBright = N_(93, 39);
    j_.blueBright = N_(94, 39);
    j_.magentaBright = N_(95, 39);
    j_.cyanBright = N_(96, 39);
    j_.whiteBright = N_(97, 39);
    j_.bgRedBright = N_(101, 49);
    j_.bgGreenBright = N_(102, 49);
    j_.bgYellowBright = N_(103, 49);
    j_.bgBlueBright = N_(104, 49);
    j_.bgMagentaBright = N_(105, 49);
    j_.bgCyanBright = N_(106, 49);
    j_.bgWhiteBright = N_(107, 49);
    uG4.exports = j_
})
// @from(Ln 237017, Col 0)
function D_z() {
    if (Dc.platform !== "win32") return Dc.env.TERM !== "linux";
    return Boolean(Dc.env.WT_SESSION) || Boolean(Dc.env.TERMINUS_SUBLIME) || Dc.env.ConEmuTask === "{cmd::Cmder}" || Dc.env.TERM_PROGRAM === "Terminus-Sublime" || Dc.env.TERM_PROGRAM === "vscode" || Dc.env.TERM === "xterm-256color" || Dc.env.TERM === "alacritty" || Dc.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
}
// @from(Ln 237021, Col 4)
mG4
// @from(Ln 237021, Col 9)
BG4
// @from(Ln 237021, Col 14)
Z_z
// @from(Ln 237021, Col 19)
f_z
// @from(Ln 237021, Col 24)
G_z
// @from(Ln 237021, Col 29)
v_z
// @from(Ln 237021, Col 34)
T_z
// @from(Ln 237021, Col 39)
bL6
// @from(Ln 237021, Col 44)
bNw
// @from(Ln 237022, Col 4)
_C8 = L(() => {
    mG4 = {
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
    }, BG4 = {
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
    }, Z_z = {
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
    }, f_z = {
        ...mG4,
        ...BG4
    }, G_z = {
        ...mG4,
        ...Z_z
    }, v_z = D_z(), T_z = v_z ? f_z : G_z, bL6 = T_z, bNw = Object.entries(BG4)
})
// @from(Ln 237296, Col 4)
$x
// @from(Ln 237296, Col 8)
pG4
// @from(Ln 237297, Col 4)
FG4 = L(() => {
    _C8();
    $x = K6(KC8(), 1), pG4 = {
        prefix: {
            idle: $x.default.blue("?"),
            done: $x.default.green(bL6.tick)
        },
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((q) => $x.default.yellow(q))
        },
        style: {
            answer: $x.default.cyan,
            message: $x.default.bold,
            error: (q) => $x.default.red(`> ${q}`),
            defaultAnswer: (q) => $x.default.dim(`(${q})`),
            help: $x.default.dim,
            highlight: $x.default.cyan,
            key: (q) => $x.default.cyan($x.default.bold(`<${q}>`))
        }
    }
})
// @from(Ln 237320, Col 0)
function gG4(q) {
    if (typeof q !== "object" || q === null) return !1;
    let K = q;
    while (Object.getPrototypeOf(K) !== null) K = Object.getPrototypeOf(K);
    return Object.getPrototypeOf(q) === K
}
// @from(Ln 237327, Col 0)
function UG4(...q) {
    let K = {};
    for (let _ of q)
        for (let [z, Y] of Object.entries(_)) {
            let A = K[z];
            K[z] = gG4(A) && gG4(Y) ? UG4(A, Y) : Y
        }
    return K
}
// @from(Ln 237337, Col 0)
function Bs(...q) {
    let K = [pG4, ...q.filter((_) => _ != null)];
    return UG4(...K)
}
// @from(Ln 237341, Col 4)
Td1 = L(() => {
    FG4()
})
// @from(Ln 237348, Col 0)
function PH6({
    status: q = "idle",
    theme: K
}) {
    let [_, z] = Bf(!1), [Y, A] = Bf(0), {
        prefix: O,
        spinner: w
    } = Bs(K);
    if (MH6(() => {
            if (q === "loading") {
                let j, H = -1,
                    J = setTimeout(QG4.bind(() => {
                        z(!0), j = setInterval(QG4.bind(() => {
                            H = H + 1, A(H % w.frames.length)
                        }), w.interval)
                    }), 300);
                return () => {
                    clearTimeout(J), clearInterval(j)
                }
            } else z(!1)
        }, [q]), _) return w.frames[Y];
    return typeof O === "string" ? O : O[q === "loading" ? "idle" : q]
}
// @from(Ln 237371, Col 4)
dG4 = L(() => {
    eS8();
    qC8();
    Td1()
})
// @from(Ln 237377, Col 0)
function y68(q, K) {
    return CL6((_) => {
        let z = _.get();
        if (!z || z.dependencies.length !== K.length || z.dependencies.some((Y, A) => Y !== K[A])) {
            let Y = q();
            return _.set({
                value: Y,
                dependencies: K
            }), Y
        }
        return z.value
    })
}
// @from(Ln 237390, Col 4)
cG4 = L(() => {
    XH6()
})
// @from(Ln 237394, Col 0)
function w56(q) {
    return Bf({
        current: q
    })[0]
}
// @from(Ln 237399, Col 4)
zC8 = L(() => {
    eS8()
})
// @from(Ln 237403, Col 0)
function WH6(q) {
    let K = w56(q);
    K.current = q, MH6((_) => {
        let z = !1,
            Y = vd1((A, O) => {
                if (z) return;
                K.current(O, _)
            });
        return _.input.on("keypress", Y), () => {
            z = !0, _.input.removeListener("keypress", Y)
        }
    }, [])
}
// @from(Ln 237416, Col 4)
lG4 = L(() => {
    zC8();
    qC8();
    XH6()
})
// @from(Ln 237421, Col 4)
iG4 = p((sNw, nG4) => {
    nG4.exports = k_z;

    function V_z(q) {
        let K = {
            defaultWidth: 0,
            output: process.stdout,
            tty: d6("tty")
        };
        if (!q) return K;
        return Object.keys(K).forEach(function(_) {
            if (!q[_]) q[_] = K[_]
        }), q
    }

    function k_z(q) {
        let K = V_z(q);
        if (K.output.getWindowSize) return K.output.getWindowSize()[0] || K.defaultWidth;
        if (K.tty.getWindowSize) return K.tty.getWindowSize()[1] || K.defaultWidth;
        if (K.output.columns) return K.output.columns;
        if (process.env.CLI_WIDTH) {
            let _ = parseInt(process.env.CLI_WIDTH, 10);
            if (!isNaN(_) && _ !== 0) return _
        }
        return K.defaultWidth
    }
})
// @from(Ln 237448, Col 4)
oG4 = p((tNw, rG4) => {
    rG4.exports = ({
        onlyFirst: q = !1
    } = {}) => {
        let K = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(K, q ? void 0 : "g")
    }
})
// @from(Ln 237456, Col 4)
sG4 = p((eNw, aG4) => {
    var N_z = oG4();
    aG4.exports = (q) => typeof q === "string" ? q.replace(N_z(), "") : q
})
// @from(Ln 237460, Col 4)
eG4 = p((qEw, Vd1) => {
    var tG4 = (q) => {
        if (Number.isNaN(q)) return !1;
        if (q >= 4352 && (q <= 4447 || q === 9001 || q === 9002 || 11904 <= q && q <= 12871 && q !== 12351 || 12880 <= q && q <= 19903 || 19968 <= q && q <= 42182 || 43360 <= q && q <= 43388 || 44032 <= q && q <= 55203 || 63744 <= q && q <= 64255 || 65040 <= q && q <= 65049 || 65072 <= q && q <= 65131 || 65281 <= q && q <= 65376 || 65504 <= q && q <= 65510 || 110592 <= q && q <= 110593 || 127488 <= q && q <= 127569 || 131072 <= q && q <= 262141)) return !0;
        return !1
    };
    Vd1.exports = tG4;
    Vd1.exports.default = tG4
})
// @from(Ln 237469, Col 4)
Kv4 = p((KEw, kd1) => {
    var E_z = sG4(),
        y_z = eG4(),
        L_z = k71(),
        qv4 = (q) => {
            if (typeof q !== "string" || q.length === 0) return 0;
            if (q = E_z(q), q.length === 0) return 0;
            q = q.replace(L_z(), "  ");
            let K = 0;
            for (let _ = 0; _ < q.length; _++) {
                let z = q.codePointAt(_);
                if (z <= 31 || z >= 127 && z <= 159) continue;
                if (z >= 768 && z <= 879) continue;
                if (z > 65535) _++;
                K += y_z(z) ? 2 : 1
            }
            return K
        };
    kd1.exports = qv4;
    kd1.exports.default = qv4
})
// @from(Ln 237490, Col 4)
zv4 = p((_Ew, _v4) => {
    _v4.exports = ({
        onlyFirst: q = !1
    } = {}) => {
        let K = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(K, q ? void 0 : "g")
    }
})
// @from(Ln 237498, Col 4)
Nd1 = p((zEw, Yv4) => {
    var h_z = zv4();
    Yv4.exports = (q) => typeof q === "string" ? q.replace(h_z(), "") : q
})
// @from(Ln 237502, Col 4)
Ov4 = p((YEw, Av4) => {
    Av4.exports = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50]
    }
})
// @from(Ln 237654, Col 4)
Ed1 = p((AEw, $v4) => {
    var L68 = Ov4(),
        wv4 = {};
    for (let q of Object.keys(L68)) wv4[L68[q]] = q;
    var UK = {
        rgb: {
            channels: 3,
            labels: "rgb"
        },
        hsl: {
            channels: 3,
            labels: "hsl"
        },
        hsv: {
            channels: 3,
            labels: "hsv"
        },
        hwb: {
            channels: 3,
            labels: "hwb"
        },
        cmyk: {
            channels: 4,
            labels: "cmyk"
        },
        xyz: {
            channels: 3,
            labels: "xyz"
        },
        lab: {
            channels: 3,
            labels: "lab"
        },
        lch: {
            channels: 3,
            labels: "lch"
        },
        hex: {
            channels: 1,
            labels: ["hex"]
        },
        keyword: {
            channels: 1,
            labels: ["keyword"]
        },
        ansi16: {
            channels: 1,
            labels: ["ansi16"]
        },
        ansi256: {
            channels: 1,
            labels: ["ansi256"]
        },
        hcg: {
            channels: 3,
            labels: ["h", "c", "g"]
        },
        apple: {
            channels: 3,
            labels: ["r16", "g16", "b16"]
        },
        gray: {
            channels: 1,
            labels: ["gray"]
        }
    };
    $v4.exports = UK;
    for (let q of Object.keys(UK)) {
        if (!("channels" in UK[q])) throw Error("missing channels property: " + q);
        if (!("labels" in UK[q])) throw Error("missing channel labels property: " + q);
        if (UK[q].labels.length !== UK[q].channels) throw Error("channel and label counts mismatch: " + q);
        let {
            channels: K,
            labels: _
        } = UK[q];
        delete UK[q].channels, delete UK[q].labels, Object.defineProperty(UK[q], "channels", {
            value: K
        }), Object.defineProperty(UK[q], "labels", {
            value: _
        })
    }
    UK.rgb.hsl = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255,
            Y = Math.min(K, _, z),
            A = Math.max(K, _, z),
            O = A - Y,
            w, $;
        if (A === Y) w = 0;
        else if (K === A) w = (_ - z) / O;
        else if (_ === A) w = 2 + (z - K) / O;
        else if (z === A) w = 4 + (K - _) / O;
        if (w = Math.min(w * 60, 360), w < 0) w += 360;
        let j = (Y + A) / 2;
        if (A === Y) $ = 0;
        else if (j <= 0.5) $ = O / (A + Y);
        else $ = O / (2 - A - Y);
        return [w, $ * 100, j * 100]
    };
    UK.rgb.hsv = function(q) {
        let K, _, z, Y, A, O = q[0] / 255,
            w = q[1] / 255,
            $ = q[2] / 255,
            j = Math.max(O, w, $),
            H = j - Math.min(O, w, $),
            J = function(X) {
                return (j - X) / 6 / H + 0.5
            };
        if (H === 0) Y = 0, A = 0;
        else {
            if (A = H / j, K = J(O), _ = J(w), z = J($), O === j) Y = z - _;
            else if (w === j) Y = 0.3333333333333333 + K - z;
            else if ($ === j) Y = 0.6666666666666666 + _ - K;
            if (Y < 0) Y += 1;
            else if (Y > 1) Y -= 1
        }
        return [Y * 360, A * 100, j * 100]
    };
    UK.rgb.hwb = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2],
            Y = UK.rgb.hsl(q)[0],
            A = 0.00392156862745098 * Math.min(K, Math.min(_, z));
        return z = 1 - 0.00392156862745098 * Math.max(K, Math.max(_, z)), [Y, A * 100, z * 100]
    };
    UK.rgb.cmyk = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255,
            Y = Math.min(1 - K, 1 - _, 1 - z),
            A = (1 - K - Y) / (1 - Y) || 0,
            O = (1 - _ - Y) / (1 - Y) || 0,
            w = (1 - z - Y) / (1 - Y) || 0;
        return [A * 100, O * 100, w * 100, Y * 100]
    };

    function R_z(q, K) {
        return (q[0] - K[0]) ** 2 + (q[1] - K[1]) ** 2 + (q[2] - K[2]) ** 2
    }
    UK.rgb.keyword = function(q) {
        let K = wv4[q];
        if (K) return K;
        let _ = 1 / 0,
            z;
        for (let Y of Object.keys(L68)) {
            let A = L68[Y],
                O = R_z(q, A);
            if (O < _) _ = O, z = Y
        }
        return z
    };
    UK.keyword.rgb = function(q) {
        return L68[q]
    };
    UK.rgb.xyz = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255;
        K = K > 0.04045 ? ((K + 0.055) / 1.055) ** 2.4 : K / 12.92, _ = _ > 0.04045 ? ((_ + 0.055) / 1.055) ** 2.4 : _ / 12.92, z = z > 0.04045 ? ((z + 0.055) / 1.055) ** 2.4 : z / 12.92;
        let Y = K * 0.4124 + _ * 0.3576 + z * 0.1805,
            A = K * 0.2126 + _ * 0.7152 + z * 0.0722,
            O = K * 0.0193 + _ * 0.1192 + z * 0.9505;
        return [Y * 100, A * 100, O * 100]
    };
    UK.rgb.lab = function(q) {
        let K = UK.rgb.xyz(q),
            _ = K[0],
            z = K[1],
            Y = K[2];
        _ /= 95.047, z /= 100, Y /= 108.883, _ = _ > 0.008856 ? _ ** 0.3333333333333333 : 7.787 * _ + 0.13793103448275862, z = z > 0.008856 ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862, Y = Y > 0.008856 ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862;
        let A = 116 * z - 16,
            O = 500 * (_ - z),
            w = 200 * (z - Y);
        return [A, O, w]
    };
    UK.hsl.rgb = function(q) {
        let K = q[0] / 360,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y, A, O;
        if (_ === 0) return O = z * 255, [O, O, O];
        if (z < 0.5) Y = z * (1 + _);
        else Y = z + _ - z * _;
        let w = 2 * z - Y,
            $ = [0, 0, 0];
        for (let j = 0; j < 3; j++) {
            if (A = K + 0.3333333333333333 * -(j - 1), A < 0) A++;
            if (A > 1) A--;
            if (6 * A < 1) O = w + (Y - w) * 6 * A;
            else if (2 * A < 1) O = Y;
            else if (3 * A < 2) O = w + (Y - w) * (0.6666666666666666 - A) * 6;
            else O = w;
            $[j] = O * 255
        }
        return $
    };
    UK.hsl.hsv = function(q) {
        let K = q[0],
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = _,
            A = Math.max(z, 0.01);
        z *= 2, _ *= z <= 1 ? z : 2 - z, Y *= A <= 1 ? A : 2 - A;
        let O = (z + _) / 2,
            w = z === 0 ? 2 * Y / (A + Y) : 2 * _ / (z + _);
        return [K, w * 100, O * 100]
    };
    UK.hsv.rgb = function(q) {
        let K = q[0] / 60,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = Math.floor(K) % 6,
            A = K - Math.floor(K),
            O = 255 * z * (1 - _),
            w = 255 * z * (1 - _ * A),
            $ = 255 * z * (1 - _ * (1 - A));
        switch (z *= 255, Y) {
            case 0:
                return [z, $, O];
            case 1:
                return [w, z, O];
            case 2:
                return [O, z, $];
            case 3:
                return [O, w, z];
            case 4:
                return [$, O, z];
            case 5:
                return [z, O, w]
        }
    };
    UK.hsv.hsl = function(q) {
        let K = q[0],
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = Math.max(z, 0.01),
            A, O;
        O = (2 - _) * z;
        let w = (2 - _) * Y;
        return A = _ * Y, A /= w <= 1 ? w : 2 - w, A = A || 0, O /= 2, [K, A * 100, O * 100]
    };
    UK.hwb.rgb = function(q) {
        let K = q[0] / 360,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = _ + z,
            A;
        if (Y > 1) _ /= Y, z /= Y;
        let O = Math.floor(6 * K),
            w = 1 - z;
        if (A = 6 * K - O, (O & 1) !== 0) A = 1 - A;
        let $ = _ + A * (w - _),
            j, H, J;
        switch (O) {
            default:
            case 6:
            case 0:
                j = w, H = $, J = _;
                break;
            case 1:
                j = $, H = w, J = _;
                break;
            case 2:
                j = _, H = w, J = $;
                break;
            case 3:
                j = _, H = $, J = w;
                break;
            case 4:
                j = $, H = _, J = w;
                break;
            case 5:
                j = w, H = _, J = $;
                break
        }
        return [j * 255, H * 255, J * 255]
    };
    UK.cmyk.rgb = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y = q[3] / 100,
            A = 1 - Math.min(1, K * (1 - Y) + Y),
            O = 1 - Math.min(1, _ * (1 - Y) + Y),
            w = 1 - Math.min(1, z * (1 - Y) + Y);
        return [A * 255, O * 255, w * 255]
    };
    UK.xyz.rgb = function(q) {
        let K = q[0] / 100,
            _ = q[1] / 100,
            z = q[2] / 100,
            Y, A, O;
        return Y = K * 3.2406 + _ * -1.5372 + z * -0.4986, A = K * -0.9689 + _ * 1.8758 + z * 0.0415, O = K * 0.0557 + _ * -0.204 + z * 1.057, Y = Y > 0.0031308 ? 1.055 * Y ** 0.4166666666666667 - 0.055 : Y * 12.92, A = A > 0.0031308 ? 1.055 * A ** 0.4166666666666667 - 0.055 : A * 12.92, O = O > 0.0031308 ? 1.055 * O ** 0.4166666666666667 - 0.055 : O * 12.92, Y = Math.min(Math.max(0, Y), 1), A = Math.min(Math.max(0, A), 1), O = Math.min(Math.max(0, O), 1), [Y * 255, A * 255, O * 255]
    };
    UK.xyz.lab = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2];
        K /= 95.047, _ /= 100, z /= 108.883, K = K > 0.008856 ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, _ = _ > 0.008856 ? _ ** 0.3333333333333333 : 7.787 * _ + 0.13793103448275862, z = z > 0.008856 ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862;
        let Y = 116 * _ - 16,
            A = 500 * (K - _),
            O = 200 * (_ - z);
        return [Y, A, O]
    };
    UK.lab.xyz = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2],
            Y, A, O;
        A = (K + 16) / 116, Y = _ / 500 + A, O = A - z / 200;
        let w = A ** 3,
            $ = Y ** 3,
            j = O ** 3;
        return A = w > 0.008856 ? w : (A - 0.13793103448275862) / 7.787, Y = $ > 0.008856 ? $ : (Y - 0.13793103448275862) / 7.787, O = j > 0.008856 ? j : (O - 0.13793103448275862) / 7.787, Y *= 95.047, A *= 100, O *= 108.883, [Y, A, O]
    };
    UK.lab.lch = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2],
            Y;
        if (Y = Math.atan2(z, _) * 360 / 2 / Math.PI, Y < 0) Y += 360;
        let O = Math.sqrt(_ * _ + z * z);
        return [K, O, Y]
    };
    UK.lch.lab = function(q) {
        let K = q[0],
            _ = q[1],
            Y = q[2] / 360 * 2 * Math.PI,
            A = _ * Math.cos(Y),
            O = _ * Math.sin(Y);
        return [K, A, O]
    };
    UK.rgb.ansi16 = function(q, K = null) {
        let [_, z, Y] = q, A = K === null ? UK.rgb.hsv(q)[2] : K;
        if (A = Math.round(A / 50), A === 0) return 30;
        let O = 30 + (Math.round(Y / 255) << 2 | Math.round(z / 255) << 1 | Math.round(_ / 255));
        if (A === 2) O += 60;
        return O
    };
    UK.hsv.ansi16 = function(q) {
        return UK.rgb.ansi16(UK.hsv.rgb(q), q[2])
    };
    UK.rgb.ansi256 = function(q) {
        let K = q[0],
            _ = q[1],
            z = q[2];
        if (K === _ && _ === z) {
            if (K < 8) return 16;
            if (K > 248) return 231;
            return Math.round((K - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(K / 255 * 5) + 6 * Math.round(_ / 255 * 5) + Math.round(z / 255 * 5)
    };
    UK.ansi16.rgb = function(q) {
        let K = q % 10;
        if (K === 0 || K === 7) {
            if (q > 50) K += 3.5;
            return K = K / 10.5 * 255, [K, K, K]
        }
        let _ = (~~(q > 50) + 1) * 0.5,
            z = (K & 1) * _ * 255,
            Y = (K >> 1 & 1) * _ * 255,
            A = (K >> 2 & 1) * _ * 255;
        return [z, Y, A]
    };
    UK.ansi256.rgb = function(q) {
        if (q >= 232) {
            let A = (q - 232) * 10 + 8;
            return [A, A, A]
        }
        q -= 16;
        let K, _ = Math.floor(q / 36) / 5 * 255,
            z = Math.floor((K = q % 36) / 6) / 5 * 255,
            Y = K % 6 / 5 * 255;
        return [_, z, Y]
    };
    UK.rgb.hex = function(q) {
        let _ = (((Math.round(q[0]) & 255) << 16) + ((Math.round(q[1]) & 255) << 8) + (Math.round(q[2]) & 255)).toString(16).toUpperCase();
        return "000000".substring(_.length) + _
    };
    UK.hex.rgb = function(q) {
        let K = q.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!K) return [0, 0, 0];
        let _ = K[0];
        if (K[0].length === 3) _ = _.split("").map((w) => {
            return w + w
        }).join("");
        let z = parseInt(_, 16),
            Y = z >> 16 & 255,
            A = z >> 8 & 255,
            O = z & 255;
        return [Y, A, O]
    };
    UK.rgb.hcg = function(q) {
        let K = q[0] / 255,
            _ = q[1] / 255,
            z = q[2] / 255,
            Y = Math.max(Math.max(K, _), z),
            A = Math.min(Math.min(K, _), z),
            O = Y - A,
            w, $;
        if (O < 1) w = A / (1 - O);
        else w = 0;
        if (O <= 0) $ = 0;
        else if (Y === K) $ = (_ - z) / O % 6;
        else if (Y === _) $ = 2 + (z - K) / O;
        else $ = 4 + (K - _) / O;
        return $ /= 6, $ %= 1, [$ * 360, O * 100, w * 100]
    };
    UK.hsl.hcg = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = _ < 0.5 ? 2 * K * _ : 2 * K * (1 - _),
            Y = 0;
        if (z < 1) Y = (_ - 0.5 * z) / (1 - z);
        return [q[0], z * 100, Y * 100]
    };
    UK.hsv.hcg = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = K * _,
            Y = 0;
        if (z < 1) Y = (_ - z) / (1 - z);
        return [q[0], z * 100, Y * 100]
    };
    UK.hcg.rgb = function(q) {
        let K = q[0] / 360,
            _ = q[1] / 100,
            z = q[2] / 100;
        if (_ === 0) return [z * 255, z * 255, z * 255];
        let Y = [0, 0, 0],
            A = K % 1 * 6,
            O = A % 1,
            w = 1 - O,
            $ = 0;
        switch (Math.floor(A)) {
            case 0:
                Y[0] = 1, Y[1] = O, Y[2] = 0;
                break;
            case 1:
                Y[0] = w, Y[1] = 1, Y[2] = 0;
                break;
            case 2:
                Y[0] = 0, Y[1] = 1, Y[2] = O;
                break;
            case 3:
                Y[0] = 0, Y[1] = w, Y[2] = 1;
                break;
            case 4:
                Y[0] = O, Y[1] = 0, Y[2] = 1;
                break;
            default:
                Y[0] = 1, Y[1] = 0, Y[2] = w
        }
        return $ = (1 - _) * z, [(_ * Y[0] + $) * 255, (_ * Y[1] + $) * 255, (_ * Y[2] + $) * 255]
    };
    UK.hcg.hsv = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = K + _ * (1 - K),
            Y = 0;
        if (z > 0) Y = K / z;
        return [q[0], Y * 100, z * 100]
    };
    UK.hcg.hsl = function(q) {
        let K = q[1] / 100,
            z = q[2] / 100 * (1 - K) + 0.5 * K,
            Y = 0;
        if (z > 0 && z < 0.5) Y = K / (2 * z);
        else if (z >= 0.5 && z < 1) Y = K / (2 * (1 - z));
        return [q[0], Y * 100, z * 100]
    };
    UK.hcg.hwb = function(q) {
        let K = q[1] / 100,
            _ = q[2] / 100,
            z = K + _ * (1 - K);
        return [q[0], (z - K) * 100, (1 - z) * 100]
    };
    UK.hwb.hcg = function(q) {
        let K = q[1] / 100,
            z = 1 - q[2] / 100,
            Y = z - K,
            A = 0;
        if (Y < 1) A = (z - Y) / (1 - Y);
        return [q[0], Y * 100, A * 100]
    };
    UK.apple.rgb = function(q) {
        return [q[0] / 65535 * 255, q[1] / 65535 * 255, q[2] / 65535 * 255]
    };
    UK.rgb.apple = function(q) {
        return [q[0] / 255 * 65535, q[1] / 255 * 65535, q[2] / 255 * 65535]
    };
    UK.gray.rgb = function(q) {
        return [q[0] / 100 * 255, q[0] / 100 * 255, q[0] / 100 * 255]
    };
    UK.gray.hsl = function(q) {
        return [0, 0, q[0]]
    };
    UK.gray.hsv = UK.gray.hsl;
    UK.gray.hwb = function(q) {
        return [0, 100, q[0]]
    };
    UK.gray.cmyk = function(q) {
        return [0, 0, 0, q[0]]
    };
    UK.gray.lab = function(q) {
        return [q[0], 0, 0]
    };
    UK.gray.hex = function(q) {
        let K = Math.round(q[0] / 100 * 255) & 255,
            z = ((K << 16) + (K << 8) + K).toString(16).toUpperCase();
        return "000000".substring(z.length) + z
    };
    UK.rgb.gray = function(q) {
        return [(q[0] + q[1] + q[2]) / 3 / 255 * 100]
    }
})
// @from(Ln 238173, Col 4)
Hv4 = p((OEw, jv4) => {
    var YC8 = Ed1();

    function S_z() {
        let q = {},
            K = Object.keys(YC8);
        for (let _ = K.length, z = 0; z < _; z++) q[K[z]] = {
            distance: -1,
            parent: null
        };
        return q
    }

    function C_z(q) {
        let K = S_z(),
            _ = [q];
        K[q].distance = 0;
        while (_.length) {
            let z = _.pop(),
                Y = Object.keys(YC8[z]);
            for (let A = Y.length, O = 0; O < A; O++) {
                let w = Y[O],
                    $ = K[w];
                if ($.distance === -1) $.distance = K[z].distance + 1, $.parent = z, _.unshift(w)
            }
        }
        return K
    }

    function b_z(q, K) {
        return function(_) {
            return K(q(_))
        }
    }

    function I_z(q, K) {
        let _ = [K[q].parent, q],
            z = YC8[K[q].parent][q],
            Y = K[q].parent;
        while (K[Y].parent) _.unshift(K[Y].parent), z = b_z(YC8[K[Y].parent][Y], z), Y = K[Y].parent;
        return z.conversion = _, z
    }
    jv4.exports = function(q) {
        let K = C_z(q),
            _ = {},
            z = Object.keys(K);
        for (let Y = z.length, A = 0; A < Y; A++) {
            let O = z[A];
            if (K[O].parent === null) continue;
            _[O] = I_z(O, K)
        }
        return _
    }
})
// @from(Ln 238227, Col 4)
Xv4 = p((wEw, Jv4) => {
    var yd1 = Ed1(),
        x_z = Hv4(),
        IL6 = {},
        u_z = Object.keys(yd1);

    function m_z(q) {
        let K = function(..._) {
            let z = _[0];
            if (z === void 0 || z === null) return z;
            if (z.length > 1) _ = z;
            return q(_)
        };
        if ("conversion" in q) K.conversion = q.conversion;
        return K
    }

    function B_z(q) {
        let K = function(..._) {
            let z = _[0];
            if (z === void 0 || z === null) return z;
            if (z.length > 1) _ = z;
            let Y = q(_);
            if (typeof Y === "object")
                for (let A = Y.length, O = 0; O < A; O++) Y[O] = Math.round(Y[O]);
            return Y
        };
        if ("conversion" in q) K.conversion = q.conversion;
        return K
    }
    u_z.forEach((q) => {
        IL6[q] = {}, Object.defineProperty(IL6[q], "channels", {
            value: yd1[q].channels
        }), Object.defineProperty(IL6[q], "labels", {
            value: yd1[q].labels
        });
        let K = x_z(q);
        Object.keys(K).forEach((z) => {
            let Y = K[z];
            IL6[q][z] = B_z(Y), IL6[q][z].raw = m_z(Y)
        })
    });
    Jv4.exports = IL6
})
// @from(Ln 238271, Col 4)
fv4 = p(($Ew, Zv4) => {
    var Mv4 = (q, K) => (..._) => {
            return `\x1B[${q(..._)+K}m`
        },
        Pv4 = (q, K) => (..._) => {
            let z = q(..._);
            return `\x1B[${38+K};5;${z}m`
        },
        Wv4 = (q, K) => (..._) => {
            let z = q(..._);
            return `\x1B[${38+K};2;${z[0]};${z[1]};${z[2]}m`
        },
        AC8 = (q) => q,
        Dv4 = (q, K, _) => [q, K, _],
        xL6 = (q, K, _) => {
            Object.defineProperty(q, K, {
                get: () => {
                    let z = _();
                    return Object.defineProperty(q, K, {
                        value: z,
                        enumerable: !0,
                        configurable: !0
                    }), z
                },
                enumerable: !0,
                configurable: !0
            })
        },
        Ld1, uL6 = (q, K, _, z) => {
            if (Ld1 === void 0) Ld1 = Xv4();
            let Y = z ? 10 : 0,
                A = {};
            for (let [O, w] of Object.entries(Ld1)) {
                let $ = O === "ansi16" ? "ansi" : O;
                if (O === K) A[$] = q(_, Y);
                else if (typeof w === "object") A[$] = q(w[K], Y)
            }
            return A
        };

    function p_z() {
        let q = new Map,
            K = {
                modifier: {
                    reset: [0, 0],
                    bold: [1, 22],
                    dim: [2, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    hidden: [8, 28],
                    strikethrough: [9, 29]
                },
                color: {
                    black: [30, 39],
                    red: [31, 39],
                    green: [32, 39],
                    yellow: [33, 39],
                    blue: [34, 39],
                    magenta: [35, 39],
                    cyan: [36, 39],
                    white: [37, 39],
                    blackBright: [90, 39],
                    redBright: [91, 39],
                    greenBright: [92, 39],
                    yellowBright: [93, 39],
                    blueBright: [94, 39],
                    magentaBright: [95, 39],
                    cyanBright: [96, 39],
                    whiteBright: [97, 39]
                },
                bgColor: {
                    bgBlack: [40, 49],
                    bgRed: [41, 49],
                    bgGreen: [42, 49],
                    bgYellow: [43, 49],
                    bgBlue: [44, 49],
                    bgMagenta: [45, 49],
                    bgCyan: [46, 49],
                    bgWhite: [47, 49],
                    bgBlackBright: [100, 49],
                    bgRedBright: [101, 49],
                    bgGreenBright: [102, 49],
                    bgYellowBright: [103, 49],
                    bgBlueBright: [104, 49],
                    bgMagentaBright: [105, 49],
                    bgCyanBright: [106, 49],
                    bgWhiteBright: [107, 49]
                }
            };
        K.color.gray = K.color.blackBright, K.bgColor.bgGray = K.bgColor.bgBlackBright, K.color.grey = K.color.blackBright, K.bgColor.bgGrey = K.bgColor.bgBlackBright;
        for (let [_, z] of Object.entries(K)) {
            for (let [Y, A] of Object.entries(z)) K[Y] = {
                open: `\x1B[${A[0]}m`,
                close: `\x1B[${A[1]}m`
            }, z[Y] = K[Y], q.set(A[0], A[1]);
            Object.defineProperty(K, _, {
                value: z,
                enumerable: !1
            })
        }
        return Object.defineProperty(K, "codes", {
            value: q,
            enumerable: !1
        }), K.color.close = "\x1B[39m", K.bgColor.close = "\x1B[49m", xL6(K.color, "ansi", () => uL6(Mv4, "ansi16", AC8, !1)), xL6(K.color, "ansi256", () => uL6(Pv4, "ansi256", AC8, !1)), xL6(K.color, "ansi16m", () => uL6(Wv4, "rgb", Dv4, !1)), xL6(K.bgColor, "ansi", () => uL6(Mv4, "ansi16", AC8, !0)), xL6(K.bgColor, "ansi256", () => uL6(Pv4, "ansi256", AC8, !0)), xL6(K.bgColor, "ansi16m", () => uL6(Wv4, "rgb", Dv4, !0)), K
    }
    Object.defineProperty(Zv4, "exports", {
        enumerable: !0,
        get: p_z
    })
})
// @from(Ln 238382, Col 4)
Tv4 = p((jEw, vv4) => {
    var h68 = Kv4(),
        F_z = Nd1(),
        g_z = fv4(),
        Rd1 = new Set(["\x1B", ""]),
        Gv4 = (q) => `${Rd1.values().next().value}[${q}m`,
        U_z = (q) => q.split(" ").map((K) => h68(K)),
        hd1 = (q, K, _) => {
            let z = [...K],
                Y = !1,
                A = h68(F_z(q[q.length - 1]));
            for (let [O, w] of z.entries()) {
                let $ = h68(w);
                if (A + $ <= _) q[q.length - 1] += w;
                else q.push(w), A = 0;
                if (Rd1.has(w)) Y = !0;
                else if (Y && w === "m") {
                    Y = !1;
                    continue
                }
                if (Y) continue;
                if (A += $, A === _ && O < z.length - 1) q.push(""), A = 0
            }
            if (!A && q[q.length - 1].length > 0 && q.length > 1) q[q.length - 2] += q.pop()
        },
        Q_z = (q) => {
            let K = q.split(" "),
                _ = K.length;
            while (_ > 0) {
                if (h68(K[_ - 1]) > 0) break;
                _--
            }
            if (_ === K.length) return q;
            return K.slice(0, _).join(" ") + K.slice(_).join("")
        },
        d_z = (q, K, _ = {}) => {
            if (_.trim !== !1 && q.trim() === "") return "";
            let z = "",
                Y = "",
                A, O = U_z(q),
                w = [""];
            for (let [$, j] of q.split(" ").entries()) {
                if (_.trim !== !1) w[w.length - 1] = w[w.length - 1].trimLeft();
                let H = h68(w[w.length - 1]);
                if ($ !== 0) {
                    if (H >= K && (_.wordWrap === !1 || _.trim === !1)) w.push(""), H = 0;
                    if (H > 0 || _.trim === !1) w[w.length - 1] += " ", H++
                }
                if (_.hard && O[$] > K) {
                    let J = K - H,
                        X = 1 + Math.floor((O[$] - J - 1) / K);
                    if (Math.floor((O[$] - 1) / K) < X) w.push("");
                    hd1(w, j, K);
                    continue
                }
                if (H + O[$] > K && H > 0 && O[$] > 0) {
                    if (_.wordWrap === !1 && H < K) {
                        hd1(w, j, K);
                        continue
                    }
                    w.push("")
                }
                if (H + O[$] > K && _.wordWrap === !1) {
                    hd1(w, j, K);
                    continue
                }
                w[w.length - 1] += j
            }
            if (_.trim !== !1) w = w.map(Q_z);
            z = w.join(`
`);
            for (let [$, j] of [...z].entries()) {
                if (Y += j, Rd1.has(j)) {
                    let J = parseFloat(/\d[^m]*/.exec(z.slice($, $ + 4)));
                    A = J === 39 ? null : J
                }
                let H = g_z.codes.get(Number(A));
                if (A && H) {
                    if (z[$ + 1] === `
`) Y += Gv4(H);
                    else if (j === `
`) Y += Gv4(A)
                }
            }
            return Y
        };
    vv4.exports = (q, K, _) => {
        return String(q).normalize().replace(/\r\n/g, `
`).split(`
`).map((z) => d_z(z, K, _)).join(`
`)
    }
})
// @from(Ln 238476, Col 0)
function R68(q, K) {
    return q.split(`
`).flatMap((_) => kv4.default(_, K, {
        trim: !1,
        hard: !0
    }).split(`
`).map((z) => z.trimEnd())).join(`
`)
}
// @from(Ln 238486, Col 0)
function OC8() {
    return Vv4.default({
        defaultWidth: 80,
        output: Gd1().output
    })
}
// @from(Ln 238492, Col 4)
Vv4
// @from(Ln 238492, Col 9)
kv4
// @from(Ln 238493, Col 4)
wC8 = L(() => {
    XH6();
    Vv4 = K6(iG4(), 1), kv4 = K6(Tv4(), 1)
})
// @from(Ln 238498, Col 0)
function c_z(q, K) {
    return R68(q, K).split(`
`)
}
// @from(Ln 238503, Col 0)
function l_z(q, K) {
    let _ = K.length,
        z = (q % _ + _) % _;
    return [...K.slice(z), ...K.slice(0, z)]
}
// @from(Ln 238509, Col 0)
function Nv4({
    items: q,
    width: K,
    renderItem: _,
    active: z,
    position: Y,
    pageSize: A
}) {
    let O = q.map((P, W) => ({
            item: P,
            index: W,
            isActive: W === z
        })),
        w = l_z(z - Y, O).slice(0, A),
        $ = (P) => w[P] == null ? [] : c_z(_(w[P]), K),
        j = Array.from({
            length: A
        }),
        H = $(Y).slice(0, A),
        J = Y + H.length <= A ? Y : A - H.length;
    j.splice(J, H.length, ...H);
    let X = J + H.length,
        M = Y + 1;
    while (X < A && M < w.length) {
        for (let P of $(M))
            if (j[X++] = P, X >= A) break;
        M++
    }
    X = J - 1, M = Y - 1;
    while (X >= 0 && M >= 0) {
        for (let P of $(M).reverse())
            if (j[X--] = P, X < 0) break;
        M--
    }
    return j.filter((P) => typeof P === "string")
}
// @from(Ln 238545, Col 4)
Ev4 = L(() => {
    wC8()
})
// @from(Ln 238549, Col 0)
function yv4({
    active: q,
    pageSize: K,
    total: _
}) {
    let z = Math.floor(K / 2);
    if (_ <= K || q < z) return q;
    if (q >= _ - z) return q + K - _;
    return z
}
// @from(Ln 238560, Col 0)
function Lv4({
    active: q,
    lastActive: K,
    total: _,
    pageSize: z,
    pointer: Y
}) {
    if (_ <= z) return q;
    if (K < q && q - K < z) return Math.min(Math.floor(z / 2), Y + q - K);
    return Y
}
// @from(Ln 238572, Col 0)
function Sd1({
    items: q,
    active: K,
    renderItem: _,
    pageSize: z,
    loop: Y = !0
}) {
    let A = w56({
            position: 0,
            lastActive: 0
        }),
        O = Y ? Lv4({
            active: K,
            lastActive: A.current.lastActive,
            total: q.length,
            pageSize: z,
            pointer: A.current.position
        }) : yv4({
            active: K,
            total: q.length,
            pageSize: z
        });
    return A.current.position = O, A.current.lastActive = K, Nv4({
        items: q,
        width: OC8(),
        renderItem: _,
        active: K,
        position: O,
        pageSize: z
    }).join(`
`)
}
// @from(Ln 238604, Col 4)
hv4 = L(() => {
    zC8();
    wC8();
    Ev4()
})
// @from(Ln 238609, Col 4)
Cv4 = p((vEw, Sv4) => {
    var n_z = d6("stream");
    class Rv4 extends n_z {
        #q = null;
        constructor(q = {}) {
            super(q);
            this.writable = this.readable = !0, this.muted = !1, this.on("pipe", this._onpipe), this.replace = q.replace, this._prompt = q.prompt || null, this._hadControl = !1
        }
        #K(q, K) {
            if (this._dest) return this._dest[q];
            if (this._src) return this._src[q];
            return K
        }
        #_(q, ...K) {
            if (typeof this._dest?.[q] === "function") this._dest[q](...K);
            if (typeof this._src?.[q] === "function") this._src[q](...K)
        }
        get isTTY() {
            if (this.#q !== null) return this.#q;
            return this.#K("isTTY", !1)
        }
        set isTTY(q) {
            this.#q = q
        }
        get rows() {
            return this.#K("rows")
        }
        get columns() {
            return this.#K("columns")
        }
        mute() {
            this.muted = !0
        }
        unmute() {
            this.muted = !1
        }
        _onpipe(q) {
            this._src = q
        }
        pipe(q, K) {
            return this._dest = q, super.pipe(q, K)
        }
        pause() {
            if (this._src) return this._src.pause()
        }
        resume() {
            if (this._src) return this._src.resume()
        }
        write(q) {
            if (this.muted) {
                if (!this.replace) return !0;
                if (q.match(/^\u001b/)) {
                    if (q.indexOf(this._prompt) === 0) q = q.slice(this._prompt.length), q = q.replace(/./g, this.replace), q = this._prompt + q;
                    return this._hadControl = !0, this.emit("data", q)
                } else {
                    if (this._prompt && this._hadControl && q.indexOf(this._prompt) === 0) this._hadControl = !1, this.emit("data", this._prompt), q = q.slice(this._prompt.length);
                    q = q.toString().replace(/./g, this.replace)
                }
            }
            this.emit("data", q)
        }
        end(q) {
            if (this.muted)
                if (q && this.replace) q = q.toString().replace(/./g, this.replace);
                else q = null;
            if (q) this.emit("data", q);
            this.emit("end")
        }
        destroy(...q) {
            return this.#_("destroy", ...q)
        }
        destroySoon(...q) {
            return this.#_("destroySoon", ...q)
        }
        close(...q) {
            return this.#_("close", ...q)
        }
    }
    Sv4.exports = Rv4
})
// @from(Ln 238689, Col 4)
Iv4 = p((i_z, Cd1) => {
    var hY = i_z;
    i_z.default = hY;
    var hw = "\x1B[",
        S68 = "\x1B]",
        mL6 = "\x07",
        $C8 = ";",
        bv4 = process.env.TERM_PROGRAM === "Apple_Terminal";
    hY.cursorTo = (q, K) => {
        if (typeof q !== "number") throw TypeError("The `x` argument is required");
        if (typeof K !== "number") return hw + (q + 1) + "G";
        return hw + (K + 1) + ";" + (q + 1) + "H"
    };
    hY.cursorMove = (q, K) => {
        if (typeof q !== "number") throw TypeError("The `x` argument is required");
        let _ = "";
        if (q < 0) _ += hw + -q + "D";
        else if (q > 0) _ += hw + q + "C";
        if (K < 0) _ += hw + -K + "A";
        else if (K > 0) _ += hw + K + "B";
        return _
    };
    hY.cursorUp = (q = 1) => hw + q + "A";
    hY.cursorDown = (q = 1) => hw + q + "B";
    hY.cursorForward = (q = 1) => hw + q + "C";
    hY.cursorBackward = (q = 1) => hw + q + "D";
    hY.cursorLeft = hw + "G";
    hY.cursorSavePosition = bv4 ? "\x1B7" : hw + "s";
    hY.cursorRestorePosition = bv4 ? "\x1B8" : hw + "u";
    hY.cursorGetPosition = hw + "6n";
    hY.cursorNextLine = hw + "E";
    hY.cursorPrevLine = hw + "F";
    hY.cursorHide = hw + "?25l";
    hY.cursorShow = hw + "?25h";
    hY.eraseLines = (q) => {
        let K = "";
        for (let _ = 0; _ < q; _++) K += hY.eraseLine + (_ < q - 1 ? hY.cursorUp() : "");
        if (q) K += hY.cursorLeft;
        return K
    };
    hY.eraseEndLine = hw + "K";
    hY.eraseStartLine = hw + "1K";
    hY.eraseLine = hw + "2K";
    hY.eraseDown = hw + "J";
    hY.eraseUp = hw + "1J";
    hY.eraseScreen = hw + "2J";
    hY.scrollUp = hw + "S";
    hY.scrollDown = hw + "T";
    hY.clearScreen = "\x1Bc";
    hY.clearTerminal = process.platform === "win32" ? `${hY.eraseScreen}${hw}0f` : `${hY.eraseScreen}${hw}3J${hw}H`;
    hY.beep = mL6;
    hY.link = (q, K) => {
        return [S68, "8", $C8, $C8, K, mL6, q, S68, "8", $C8, $C8, mL6].join("")
    };
    hY.image = (q, K = {}) => {
        let _ = `${S68}1337;File=inline=1`;
        if (K.width) _ += `;width=${K.width}`;
        if (K.height) _ += `;height=${K.height}`;
        if (K.preserveAspectRatio === !1) _ += ";preserveAspectRatio=0";
        return _ + ":" + q.toString("base64") + mL6
    };
    hY.iTerm = {
        setCwd: (q = process.cwd()) => `${S68}50;CurrentDir=${q}${mL6}`,
        annotation: (q, K = {}) => {
            let _ = `${S68}1337;`,
                z = typeof K.x < "u",
                Y = typeof K.y < "u";
            if ((z || Y) && !(z && Y && typeof K.length < "u")) throw Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
            if (q = q.replace(/\|/g, ""), _ += K.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", K.length > 0) _ += (z ? [q, K.length, K.x, K.y] : [K.length, q]).join("|");
            else _ += q;
            return _ + mL6
        }
    }
})
// @from(Ln 238764, Col 0)
function uv4(q) {
    return q > 0 ? $56.default.cursorDown(q) : ""
}
// @from(Ln 238767, Col 0)
class jC8 {
    rl;
    height = 0;
    extraLinesUnderPrompt = 0;
    cursorPos;
    constructor(q) {
        this.rl = q, this.rl = q, this.cursorPos = q.getCursorPos()
    }
    write(q) {
        this.rl.output.unmute(), this.rl.output.write(q), this.rl.output.mute()
    }
    render(q, K = "") {
        let _ = o_z(q),
            z = mv4.default(_),
            Y = z;
        if (this.rl.line.length > 0) Y = Y.slice(0, -this.rl.line.length);
        this.rl.setPrompt(Y), this.cursorPos = this.rl.getCursorPos();
        let A = OC8();
        if (q = R68(q, A), K = R68(K, A), z.length % A === 0) q += `
`;
        let O = q + (K ? `
` + K : ""),
            $ = Math.floor(z.length / A) - this.cursorPos.rows + (K ? xv4(K) : 0);
        if ($ > 0) O += $56.default.cursorUp($);
        O += $56.default.cursorTo(this.cursorPos.cols), this.write(uv4(this.extraLinesUnderPrompt) + $56.default.eraseLines(this.height) + O), this.extraLinesUnderPrompt = $, this.height = xv4(O)
    }
    checkCursorPos() {
        let q = this.rl.getCursorPos();
        if (q.cols !== this.cursorPos.cols) this.write($56.default.cursorTo(q.cols)), this.cursorPos = q
    }
    done({
        clearContent: q
    }) {
        this.rl.setPrompt("");
        let K = uv4(this.extraLinesUnderPrompt);
        K += q ? $56.default.eraseLines(this.height) : `
`, K += $56.default.cursorShow, this.write(K), this.rl.close()
    }
}
// @from(Ln 238806, Col 4)
mv4
// @from(Ln 238806, Col 9)
$56
// @from(Ln 238806, Col 14)
xv4 = (q) => q.split(`
`).length
// @from(Ln 238808, Col 4)
o_z = (q) => q.split(`
`).pop() ?? ""
// @from(Ln 238810, Col 4)
Bv4 = L(() => {
    wC8();
    mv4 = K6(Nd1(), 1), $56 = K6(Iv4(), 1)
})
// @from(Ln 238814, Col 4)
bd1
// @from(Ln 238815, Col 4)
pv4 = L(() => {
    bd1 = class bd1 extends Promise {
        static withResolver() {
            let q, K;
            return {
                promise: new Promise((z, Y) => {
                    q = z, K = Y
                }),
                resolve: q,
                reject: K
            }
        }
    }
})
// @from(Ln 238834, Col 0)
function DH6(q) {
    return (_, z = {}) => {
        let {
            input: Y = process.stdin,
            signal: A
        } = z, O = new Set, w = new gv4.default;
        w.pipe(z.output ?? process.stdout);
        let $ = Fv4.createInterface({
                terminal: !0,
                input: Y,
                output: w
            }),
            j = new jC8($),
            {
                promise: H,
                resolve: J,
                reject: X
            } = bd1.withResolver(),
            M = () => X(new Dd1);
        if (A) {
            let W = () => X(new Wd1({
                cause: A.reason
            }));
            if (A.aborted) return W(), Object.assign(H, {
                cancel: M
            });
            A.addEventListener("abort", W), O.add(() => A.removeEventListener("abort", W))
        }
        O.add(b16((W, D) => {
            X(new Zd1(`User force closed the prompt with ${W} ${D}`))
        }));
        let P = () => j.checkCursorPos();
        return $.input.on("keypress", P), O.add(() => $.input.removeListener("keypress", P)), IG4($, (W) => {
            let D = a_z.bind(() => JH6.clearAll());
            return $.on("close", D), O.add(() => $.removeListener("close", D)), W(() => {
                try {
                    let Z = q(_, (v) => {
                            setImmediate(() => J(v))
                        }),
                        [G, f] = typeof Z === "string" ? [Z] : Z;
                    j.render(G, f), JH6.run()
                } catch (Z) {
                    X(Z)
                }
            }), Object.assign(H.then((Z) => {
                return JH6.clearAll(), Z
            }, (Z) => {
                throw JH6.clearAll(), Z
            }).finally(() => {
                O.forEach((Z) => Z()), j.done({
                    clearContent: Boolean(z?.clearPromptOnDone)
                }), w.end()
            }).then(() => H), {
                cancel: M
            })
        })
    }
}
// @from(Ln 238892, Col 4)
gv4
// @from(Ln 238893, Col 4)
Uv4 = L(() => {
    jQ6();
    Bv4();
    pv4();
    XH6();
    tS8();
    gv4 = K6(Cv4(), 1)
})
// @from(Ln 238901, Col 0)
class ZH6 {
    separator = Qv4.default.dim(Array.from({
        length: 15
    }).join(bL6.line));
    type = "separator";
    constructor(q) {
        if (q) this.separator = q
    }
    static isSeparator(q) {
        return Boolean(q && typeof q === "object" && "type" in q && q.type === "separator")
    }
}
// @from(Ln 238913, Col 4)
Qv4
// @from(Ln 238914, Col 4)
dv4 = L(() => {
    _C8();
    Qv4 = K6(KC8(), 1)
})
// @from(Ln 238918, Col 4)
HC8 = L(() => {
    dG4();
    eS8();
    qC8();
    cG4();
    zC8();
    lG4();
    Td1();
    hv4();
    Uv4();
    dv4();
    tS8()
})
// @from(Ln 238931, Col 4)
Rw
// @from(Ln 238932, Col 4)
cv4 = L(() => {
    HC8();
    Rw = DH6((q, K) => {
        let {
            transformer: _ = (X) => X ? "yes" : "no"
        } = q, [z, Y] = Bf("idle"), [A, O] = Bf(""), w = Bs(q.theme), $ = PH6({
            status: z,
            theme: w
        });
        WH6((X, M) => {
            if (SL6(X)) {
                let P = q.default !== !1;
                if (/^(y|yes)/i.test(A)) P = !0;
                else if (/^(n|no)/i.test(A)) P = !1;
                O(_(P)), Y("done"), K(P)
            } else O(M.line)
        });
        let j = A,
            H = "";
        if (z === "done") j = w.style.answer(A);
        else H = ` ${w.style.defaultAnswer(q.default===!1?"y/N":"Y/n")}`;
        let J = w.style.message(q.message, z);
        return `${$} ${J}${H} ${j}`
    })
})
// @from(Ln 238957, Col 4)
OA
// @from(Ln 238958, Col 4)
lv4 = L(() => {
    HC8();
    OA = DH6((q, K) => {
        let {
            required: _,
            validate: z = () => !0
        } = q, Y = Bs(q.theme), [A, O] = Bf("idle"), [w = "", $] = Bf(q.default), [j, H] = Bf(), [J, X] = Bf(""), M = PH6({
            status: A,
            theme: Y
        });
        WH6(async (G, f) => {
            if (A !== "idle") return;
            if (SL6(G)) {
                let v = J || w;
                O("loading");
                let V = _ && !v ? "You must provide a value" : await z(v);
                if (V === !0) X(v), O("done"), K(v);
                else f.write(J), H(V || "You must provide a valid value"), O("idle")
            } else if (sS8(G) && !J) $(void 0);
            else if (G.name === "tab" && !J) $(void 0), f.clearLine(0), f.write(w), X(w);
            else X(f.line), H(void 0)
        });
        let P = Y.style.message(q.message, A),
            W = J;
        if (typeof q.transformer === "function") W = q.transformer(J, {
            isFinal: A === "done"
        });
        else if (A === "done") W = Y.style.answer(J);
        let D;
        if (w && A !== "done" && !J) D = Y.style.defaultAnswer(w);
        let Z = "";
        if (j) Z = Y.style.error(j);
        return [
            [M, P, D, W].filter((G) => G !== void 0).join(" "), Z
        ]
    })
})
// @from(Ln 238995, Col 4)
iv4 = p((s_z, Id1) => {
    var RY = s_z;
    s_z.default = RY;
    var Sw = "\x1B[",
        C68 = "\x1B]",
        BL6 = "\x07",
        JC8 = ";",
        nv4 = process.env.TERM_PROGRAM === "Apple_Terminal";
    RY.cursorTo = (q, K) => {
        if (typeof q !== "number") throw TypeError("The `x` argument is required");
        if (typeof K !== "number") return Sw + (q + 1) + "G";
        return Sw + (K + 1) + ";" + (q + 1) + "H"
    };
    RY.cursorMove = (q, K) => {
        if (typeof q !== "number") throw TypeError("The `x` argument is required");
        let _ = "";
        if (q < 0) _ += Sw + -q + "D";
        else if (q > 0) _ += Sw + q + "C";
        if (K < 0) _ += Sw + -K + "A";
        else if (K > 0) _ += Sw + K + "B";
        return _
    };
    RY.cursorUp = (q = 1) => Sw + q + "A";
    RY.cursorDown = (q = 1) => Sw + q + "B";
    RY.cursorForward = (q = 1) => Sw + q + "C";
    RY.cursorBackward = (q = 1) => Sw + q + "D";
    RY.cursorLeft = Sw + "G";
    RY.cursorSavePosition = nv4 ? "\x1B7" : Sw + "s";
    RY.cursorRestorePosition = nv4 ? "\x1B8" : Sw + "u";
    RY.cursorGetPosition = Sw + "6n";
    RY.cursorNextLine = Sw + "E";
    RY.cursorPrevLine = Sw + "F";
    RY.cursorHide = Sw + "?25l";
    RY.cursorShow = Sw + "?25h";
    RY.eraseLines = (q) => {
        let K = "";
        for (let _ = 0; _ < q; _++) K += RY.eraseLine + (_ < q - 1 ? RY.cursorUp() : "");
        if (q) K += RY.cursorLeft;
        return K
    };
    RY.eraseEndLine = Sw + "K";
    RY.eraseStartLine = Sw + "1K";
    RY.eraseLine = Sw + "2K";
    RY.eraseDown = Sw + "J";
    RY.eraseUp = Sw + "1J";
    RY.eraseScreen = Sw + "2J";
    RY.scrollUp = Sw + "S";
    RY.scrollDown = Sw + "T";
    RY.clearScreen = "\x1Bc";
    RY.clearTerminal = process.platform === "win32" ? `${RY.eraseScreen}${Sw}0f` : `${RY.eraseScreen}${Sw}3J${Sw}H`;
    RY.beep = BL6;
    RY.link = (q, K) => {
        return [C68, "8", JC8, JC8, K, BL6, q, C68, "8", JC8, JC8, BL6].join("")
    };
    RY.image = (q, K = {}) => {
        let _ = `${C68}1337;File=inline=1`;
        if (K.width) _ += `;width=${K.width}`;
        if (K.height) _ += `;height=${K.height}`;
        if (K.preserveAspectRatio === !1) _ += ";preserveAspectRatio=0";
        return _ + ":" + q.toString("base64") + BL6
    };
    RY.iTerm = {
        setCwd: (q = process.cwd()) => `${C68}50;CurrentDir=${q}${BL6}`,
        annotation: (q, K = {}) => {
            let _ = `${C68}1337;`,
                z = typeof K.x < "u",
                Y = typeof K.y < "u";
            if ((z || Y) && !(z && Y && typeof K.length < "u")) throw Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
            if (q = q.replace(/\|/g, ""), _ += K.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", K.length > 0) _ += (z ? [q, K.length, K.x, K.y] : [K.length, q]).join("|");
            else _ += q;
            return _ + BL6
        }
    }
})
// @from(Ln 239070, Col 0)
function pL6(q) {
    return !ZH6.isSeparator(q) && !q.disabled
}
// @from(Ln 239074, Col 0)
function qzz(q) {
    return q.map((K) => {
        if (ZH6.isSeparator(K)) return K;
        if (typeof K === "string") return {
            value: K,
            name: K,
            short: K,
            disabled: !1
        };
        let _ = K.name ?? String(K.value);
        return {
            value: K.value,
            name: _,
            description: K.description,
            short: K.short ?? _,
            disabled: K.disabled ?? !1
        }
    })
}
// @from(Ln 239093, Col 4)
xd1
// @from(Ln 239093, Col 9)
rv4
// @from(Ln 239093, Col 14)
e_z
// @from(Ln 239093, Col 19)
XC8
// @from(Ln 239094, Col 4)
ov4 = L(() => {
    HC8();
    _C8();
    xd1 = K6(KC8(), 1), rv4 = K6(iv4(), 1), e_z = {
        icon: {
            cursor: bL6.pointer
        },
        style: {
            disabled: (q) => xd1.default.dim(`- ${q}`),
            description: (q) => xd1.default.cyan(q)
        },
        helpMode: "auto"
    };
    XC8 = DH6((q, K) => {
        let {
            loop: _ = !0,
            pageSize: z = 7
        } = q, Y = w56(!0), A = Bs(e_z, q.theme), [O, w] = Bf("idle"), $ = PH6({
            status: O,
            theme: A
        }), j = w56(), H = y68(() => qzz(q.choices), [q.choices]), J = y68(() => {
            let V = H.findIndex(pL6),
                k = H.findLastIndex(pL6);
            if (V < 0) throw new E68("[select prompt] No selectable choices. All choices are disabled.");
            return {
                first: V,
                last: k
            }
        }, [H]), X = y68(() => {
            if (!("default" in q)) return -1;
            return H.findIndex((V) => pL6(V) && V.value === q.default)
        }, [q.default, H]), [M, P] = Bf(X === -1 ? J.first : X), W = H[M];
        WH6((V, k) => {
            if (clearTimeout(j.current), SL6(V)) w("done"), K(W.value);
            else if (aS8(V) || Pd1(V)) {
                if (k.clearLine(0), _ || aS8(V) && M !== J.first || Pd1(V) && M !== J.last) {
                    let N = aS8(V) ? -1 : 1,
                        R = M;
                    do R = (R + N + H.length) % H.length; while (!pL6(H[R]));
                    P(R)
                }
            } else if (CG4(V)) {
                k.clearLine(0);
                let N = Number(V.name) - 1,
                    R = H[N];
                if (R != null && pL6(R)) P(N)
            } else if (sS8(V)) k.clearLine(0);
            else {
                let N = k.line.toLowerCase(),
                    R = H.findIndex((h) => {
                        if (ZH6.isSeparator(h) || !pL6(h)) return !1;
                        return h.name.toLowerCase().startsWith(N)
                    });
                if (R >= 0) P(R);
                j.current = setTimeout(() => {
                    k.clearLine(0)
                }, 700)
            }
        }), MH6(() => () => {
            clearTimeout(j.current)
        }, []);
        let D = A.style.message(q.message, O),
            Z = "",
            G = "";
        if (A.helpMode === "always" || A.helpMode === "auto" && Y.current)
            if (Y.current = !1, H.length > z) G = `
${A.style.help("(Use arrow keys to reveal more choices)")}`;
            else Z = A.style.help("(Use arrow keys)");
        let f = Sd1({
            items: H,
            active: M,
            renderItem({
                item: V,
                isActive: k
            }) {
                if (ZH6.isSeparator(V)) return ` ${V.separator}`;
                if (V.disabled) {
                    let h = typeof V.disabled === "string" ? V.disabled : "(disabled)";
                    return A.style.disabled(`${V.name} ${h}`)
                }
                let N = k ? A.style.highlight : (h) => h,
                    R = k ? A.icon.cursor : " ";
                return N(`${R} ${V.name}`)
            },
            pageSize: z,
            loop: _
        });
        if (O === "done") return `${$} ${D} ${A.style.answer(W.short)}`;
        let v = W.description ? `
${A.style.description(W.description)}` : "";
        return `${[$,D,Z].filter(Boolean).join(" ")}
${f}${G}${v}${rv4.default.cursorHide}`
    })
})
// @from(Ln 239188, Col 4)
ud1 = L(() => {
    cv4();
    lv4();
    ov4()
})
// @from(Ln 239193, Col 4)
fH6 = "0.2"
// @from(Ln 239194, Col 4)
md1
// @from(Ln 239194, Col 9)
av4
// @from(Ln 239194, Col 14)
sv4
// @from(Ln 239194, Col 19)
tv4
// @from(Ln 239194, Col 24)
ev4
// @from(Ln 239194, Col 29)
qT4
// @from(Ln 239194, Col 34)
KT4
// @from(Ln 239194, Col 39)
_T4
// @from(Ln 239194, Col 44)
zT4
// @from(Ln 239194, Col 49)
YT4
// @from(Ln 239194, Col 54)
Kzz
// @from(Ln 239194, Col 59)
b68
// @from(Ln 239194, Col 64)
_zz
// @from(Ln 239195, Col 4)
I68 = L(() => {
    Hs();
    md1 = Ah({
        command: Aq(),
        args: sJ(Aq()).optional(),
        env: Xm(Aq(), Aq()).optional()
    }), av4 = Ah({
        name: Aq(),
        email: Aq().email().optional(),
        url: Aq().url().optional()
    }), sv4 = Ah({
        type: Aq(),
        url: Aq().url()
    }), tv4 = md1.partial(), ev4 = md1.extend({
        platform_overrides: Xm(Aq(), tv4).optional()
    }), qT4 = Ah({
        type: Mm(["python", "node", "binary"]),
        entry_point: Aq(),
        mcp_config: ev4
    }), KT4 = Ah({
        claude_desktop: Aq().optional(),
        platforms: sJ(Mm(["darwin", "win32", "linux"])).optional(),
        runtimes: Ah({
            python: Aq().optional(),
            node: Aq().optional()
        }).optional()
    }).passthrough(), _T4 = Ah({
        name: Aq(),
        description: Aq().optional()
    }), zT4 = Ah({
        name: Aq(),
        description: Aq().optional(),
        arguments: sJ(Aq()).optional(),
        text: Aq()
    }), YT4 = Ah({
        type: Mm(["string", "number", "boolean", "directory", "file"]),
        title: Aq(),
        description: Aq(),
        required: U0().optional(),
        default: gY6([Aq(), IC(), U0(), sJ(Aq())]).optional(),
        multiple: U0().optional(),
        sensitive: U0().optional(),
        min: IC().optional(),
        max: IC().optional()
    }), Kzz = Xm(Aq(), gY6([Aq(), IC(), U0(), sJ(Aq())])), b68 = Ah({
        $schema: Aq().optional(),
        dxt_version: Aq().optional().describe("@deprecated Use manifest_version instead"),
        manifest_version: Aq().optional(),
        name: Aq(),
        display_name: Aq().optional(),
        version: Aq(),
        description: Aq(),
        long_description: Aq().optional(),
        author: av4,
        repository: sv4.optional(),
        homepage: Aq().url().optional(),
        documentation: Aq().url().optional(),
        support: Aq().url().optional(),
        icon: Aq().optional(),
        screenshots: sJ(Aq()).optional(),
        server: qT4,
        tools: sJ(_T4).optional(),
        tools_generated: U0().optional(),
        prompts: sJ(zT4).optional(),
        prompts_generated: U0().optional(),
        keywords: sJ(Aq()).optional(),
        license: Aq().optional(),
        privacy_policies: sJ(Aq()).optional(),
        compatibility: KT4.optional(),
        user_config: Xm(Aq(), YT4).optional()
    }).refine((q) => !!(q.dxt_version || q.manifest_version), {
        message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
    }), _zz = Ah({
        status: Mm(["signed", "unsigned", "self-signed"]),
        publisher: Aq().optional(),
        issuer: Aq().optional(),
        valid_from: Aq().optional(),
        valid_to: Aq().optional(),
        fingerprint: Aq().optional()
    })
})
// @from(Ln 239287, Col 0)
function $T4(q) {
    let K = wT4(q, "package.json");
    if (AT4(K)) try {
        return JSON.parse(zzz(K, "utf-8"))
    } catch (_) {}
    return {}
}
// @from(Ln 239295, Col 0)
function Bd1(q) {
    if (typeof q.author === "string") return q.author;
    return q.author?.name || ""
}
// @from(Ln 239300, Col 0)
function pd1(q) {
    if (typeof q.author === "object") return q.author?.email || "";
    return ""
}
// @from(Ln 239305, Col 0)
function Fd1(q) {
    if (typeof q.author === "object") return q.author?.url || "";
    return ""
}
// @from(Ln 239310, Col 0)
function jT4(q) {
    if (typeof q.repository === "string") return q.repository;
    return q.repository?.url || ""
}
// @from(Ln 239315, Col 0)
function HT4(q, K) {
    let _ = q.name || OT4(K),
        z = Bd1(q) || "Unknown Author",
        Y = _,
        A = q.version || "1.0.0",
        O = q.description || "A MCPB bundle";
    return {
        name: _,
        authorName: z,
        displayName: Y,
        version: A,
        description: O
    }
}
// @from(Ln 239330, Col 0)
function JT4(q) {
    return {
        authorEmail: pd1(q),
        authorUrl: Fd1(q)
    }
}
// @from(Ln 239337, Col 0)
function XT4(q) {
    let _ = Ud1("node", q),
        z = gd1("node", _);
    return {
        serverType: "node",
        entryPoint: _,
        mcp_config: z
    }
}
// @from(Ln 239347, Col 0)
function MT4(q) {
    return {
        keywords: "",
        license: q.license || "MIT",
        repository: void 0
    }
}
// @from(Ln 239355, Col 0)
function gd1(q, K) {
    switch (q) {
        case "node":
            return {
                command: "node", args: ["${__dirname}/" + K], env: {}
            };
        case "python":
            return {
                command: "python", args: ["${__dirname}/" + K], env: {
                    PYTHONPATH: "${__dirname}/server/lib"
                }
            };
        case "binary":
            return {
                command: "${__dirname}/" + K, args: [], env: {}
            }
    }
}
// @from(Ln 239374, Col 0)
function Ud1(q, K) {
    switch (q) {
        case "node":
            return K?.main || "server/index.js";
        case "python":
            return "server/main.py";
        case "binary":
            return "server/my-server"
    }
}
// @from(Ln 239384, Col 0)
async function PT4(q, K) {
    let _ = q.name || OT4(K),
        z = await OA({
            message: "Extension name:",
            default: _,
            validate: ($) => $.trim().length > 0 || "Name is required"
        }),
        Y = await OA({
            message: "Author name:",
            default: Bd1(q),
            validate: ($) => $.trim().length > 0 || "Author name is required"
        }),
        A = await OA({
            message: "Display name (optional):",
            default: z
        }),
        O = await OA({
            message: "Version:",
            default: q.version || "1.0.0",
            validate: ($) => {
                if (!$.trim()) return "Version is required";
                if (!/^\d+\.\d+\.\d+/.test($)) return "Version must follow semantic versioning (e.g., 1.0.0)";
                return !0
            }
        }),
        w = await OA({
            message: "Description:",
            default: q.description || "",
            validate: ($) => $.trim().length > 0 || "Description is required"
        });
    return {
        name: z,
        authorName: Y,
        displayName: A,
        version: O,
        description: w
    }
}
// @from(Ln 239422, Col 0)
async function WT4(q) {
    let K = await OA({
            message: "Author email (optional):",
            default: pd1(q)
        }),
        _ = await OA({
            message: "Author URL (optional):",
            default: Fd1(q)
        });
    return {
        authorEmail: K,
        authorUrl: _
    }
}
// @from(Ln 239436, Col 0)
async function DT4(q) {
    let K = await XC8({
            message: "Server type:",
            choices: [{
                name: "Node.js",
                value: "node"
            }, {
                name: "Python",
                value: "python"
            }, {
                name: "Binary",
                value: "binary"
            }],
            default: "node"
        }),
        _ = await OA({
            message: "Entry point:",
            default: Ud1(K, q)
        }),
        z = gd1(K, _);
    return {
        serverType: K,
        entryPoint: _,
        mcp_config: z
    }
}
// @from(Ln 239462, Col 0)
async function ZT4() {
    let q = await Rw({
            message: "Does your MCP Server provide tools you want to advertise (optional)?",
            default: !0
        }),
        K = [],
        _ = !1;
    if (q) {
        let z = !0;
        while (z) {
            let Y = await OA({
                    message: "Tool name:",
                    validate: (O) => O.trim().length > 0 || "Tool name is required"
                }),
                A = await OA({
                    message: "Tool description (optional):"
                });
            K.push({
                name: Y,
                ...A ? {
                    description: A
                } : {}
            }), z = await Rw({
                message: "Add another tool?",
                default: !1
            })
        }
        _ = await Rw({
            message: "Does your server generate additional tools at runtime?",
            default: !1
        })
    }
    return {
        tools: K,
        toolsGenerated: _
    }
}
// @from(Ln 239499, Col 0)
async function fT4() {
    let q = await Rw({
            message: "Does your MCP Server provide prompts you want to advertise (optional)?",
            default: !1
        }),
        K = [],
        _ = !1;
    if (q) {
        let z = !0;
        while (z) {
            let Y = await OA({
                    message: "Prompt name:",
                    validate: (j) => j.trim().length > 0 || "Prompt name is required"
                }),
                A = await OA({
                    message: "Prompt description (optional):"
                }),
                O = await Rw({
                    message: "Does this prompt have arguments?",
                    default: !1
                }),
                w = [];
            if (O) {
                let j = !0;
                while (j) {
                    let H = await OA({
                        message: "Argument name:",
                        validate: (J) => {
                            if (!J.trim()) return "Argument name is required";
                            if (w.includes(J)) return "Argument names must be unique";
                            return !0
                        }
                    });
                    w.push(H), j = await Rw({
                        message: "Add another argument?",
                        default: !1
                    })
                }
            }
            let $ = await OA({
                message: O ? `Prompt text (use \${arguments.name} for arguments: ${w.join(", ")}):` : "Prompt text:",
                validate: (j) => j.trim().length > 0 || "Prompt text is required"
            });
            K.push({
                name: Y,
                ...A ? {
                    description: A
                } : {},
                ...w.length > 0 ? {
                    arguments: w
                } : {},
                text: $
            }), z = await Rw({
                message: "Add another prompt?",
                default: !1
            })
        }
        _ = await Rw({
            message: "Does your server generate additional prompts at runtime?",
            default: !1
        })
    }
    return {
        prompts: K,
        promptsGenerated: _
    }
}
// @from(Ln 239566, Col 0)
async function GT4(q) {
    let K = await OA({
            message: "Keywords (comma-separated, optional):",
            default: ""
        }),
        _ = await OA({
            message: "License:",
            default: q.license || "MIT"
        }),
        z = await Rw({
            message: "Add repository information?",
            default: !!q.repository
        }),
        Y;
    if (z) {
        let A = await OA({
            message: "Repository URL:",
            default: jT4(q)
        });
        if (A) Y = {
            type: "git",
            url: A
        }
    }
    return {
        keywords: K,
        license: _,
        repository: Y
    }
}
// @from(Ln 239596, Col 0)
async function vT4(q) {
    if (await Rw({
            message: "Add a detailed long description?",
            default: !1
        })) return await OA({
        message: "Long description (supports basic markdown):",
        default: q
    });
    return
}
// @from(Ln 239606, Col 0)
async function TT4() {
    let q = await OA({
            message: "Homepage URL (optional):",
            validate: (z) => {
                if (!z.trim()) return !0;
                try {
                    return new URL(z), !0
                } catch {
                    return "Must be a valid URL (e.g., https://example.com)"
                }
            }
        }),
        K = await OA({
            message: "Documentation URL (optional):",
            validate: (z) => {
                if (!z.trim()) return !0;
                try {
                    return new URL(z), !0
                } catch {
                    return "Must be a valid URL"
                }
            }
        }),
        _ = await OA({
            message: "Support URL (optional):",
            validate: (z) => {
                if (!z.trim()) return !0;
                try {
                    return new URL(z), !0
                } catch {
                    return "Must be a valid URL"
                }
            }
        });
    return {
        homepage: q,
        documentation: K,
        support: _
    }
}
// @from(Ln 239646, Col 0)
async function VT4() {
    let q = await OA({
            message: "Icon file path (optional, relative to manifest):",
            validate: (z) => {
                if (!z.trim()) return !0;
                if (z.includes("..")) return "Relative paths cannot include '..'";
                return !0
            }
        }),
        K = await Rw({
            message: "Add screenshots?",
            default: !1
        }),
        _ = [];
    if (K) {
        let z = !0;
        while (z) {
            let Y = await OA({
                message: "Screenshot file path (relative to manifest):",
                validate: (A) => {
                    if (!A.trim()) return "Screenshot path is required";
                    if (A.includes("..")) return "Relative paths cannot include '..'";
                    return !0
                }
            });
            _.push(Y), z = await Rw({
                message: "Add another screenshot?",
                default: !1
            })
        }
    }
    return {
        icon: q,
        screenshots: _
    }
}
// @from(Ln 239682, Col 0)
async function kT4(q) {
    if (!await Rw({
            message: "Add compatibility constraints?",
            default: !1
        })) return;
    let _ = await Rw({
            message: "Specify supported platforms?",
            default: !1
        }),
        z;
    if (_) {
        let A = [];
        if (await Rw({
                message: "Support macOS (darwin)?",
                default: !0
            })) A.push("darwin");
        if (await Rw({
                message: "Support Windows (win32)?",
                default: !0
            })) A.push("win32");
        if (await Rw({
                message: "Support Linux?",
                default: !0
            })) A.push("linux");
        z = A.length > 0 ? A : void 0
    }
    let Y;
    if (q !== "binary") {
        if (await Rw({
                message: "Specify runtime version constraints?",
                default: !1
            })) {
            if (q === "python") Y = {
                python: await OA({
                    message: "Python version constraint (e.g., >=3.8,<4.0):",
                    validate: (w) => w.trim().length > 0 || "Python version constraint is required"
                })
            };
            else if (q === "node") Y = {
                node: await OA({
                    message: "Node.js version constraint (e.g., >=16.0.0):",
                    validate: (w) => w.trim().length > 0 || "Node.js version constraint is required"
                })
            }
        }
    }
    return {
        ...z ? {
            platforms: z
        } : {},
        ...Y ? {
            runtimes: Y
        } : {}
    }
}
// @from(Ln 239737, Col 0)
async function NT4() {
    if (!await Rw({
            message: "Add user-configurable options?",
            default: !1
        })) return {};
    let K = {},
        _ = !0;
    while (_) {
        let z = await OA({
                message: "Configuration option key (unique identifier):",
                validate: (H) => {
                    if (!H.trim()) return "Key is required";
                    if (K[H]) return "Key must be unique";
                    return !0
                }
            }),
            Y = await XC8({
                message: "Option type:",
                choices: [{
                    name: "String",
                    value: "string"
                }, {
                    name: "Number",
                    value: "number"
                }, {
                    name: "Boolean",
                    value: "boolean"
                }, {
                    name: "Directory",
                    value: "directory"
                }, {
                    name: "File",
                    value: "file"
                }]
            }),
            A = await OA({
                message: "Option title (human-readable name):",
                validate: (H) => H.trim().length > 0 || "Title is required"
            }),
            O = await OA({
                message: "Option description:",
                validate: (H) => H.trim().length > 0 || "Description is required"
            }),
            w = await Rw({
                message: "Is this option required?",
                default: !1
            }),
            $ = await Rw({
                message: "Is this option sensitive (like a password)?",
                default: !1
            }),
            j = {
                type: Y,
                title: A,
                description: O,
                required: w,
                sensitive: $
            };
        if (!w) {
            let H;
            if (Y === "boolean") H = await Rw({
                message: "Default value:",
                default: !1
            });
            else if (Y === "number") {
                let J = await OA({
                    message: "Default value (number):",
                    validate: (X) => {
                        if (!X.trim()) return !0;
                        return !isNaN(Number(X)) || "Must be a valid number"
                    }
                });
                H = J ? Number(J) : void 0
            } else H = await OA({
                message: "Default value (optional):"
            });
            if (H !== void 0 && H !== "") j.default = H
        }
        if (Y === "number") {
            if (await Rw({
                    message: "Add min/max constraints?",
                    default: !1
                })) {
                let J = await OA({
                        message: "Minimum value (optional):",
                        validate: (M) => {
                            if (!M.trim()) return !0;
                            return !isNaN(Number(M)) || "Must be a valid number"
                        }
                    }),
                    X = await OA({
                        message: "Maximum value (optional):",
                        validate: (M) => {
                            if (!M.trim()) return !0;
                            return !isNaN(Number(M)) || "Must be a valid number"
                        }
                    });
                if (J) j.min = Number(J);
                if (X) j.max = Number(X)
            }
        }
        K[z] = j, _ = await Rw({
            message: "Add another configuration option?",
            default: !1
        })
    }
    return K
}
// @from(Ln 239846, Col 0)
function ET4(q, K, _, z, Y, A, O, w, $, j, H, J, X) {
    let {
        name: M,
        displayName: P,
        version: W,
        description: D,
        authorName: Z
    } = q, {
        authorEmail: G,
        authorUrl: f
    } = _, {
        serverType: v,
        entryPoint: V,
        mcp_config: k
    } = A, {
        keywords: N,
        license: R,
        repository: h
    } = X;
    return {
        manifest_version: fH6,
        name: M,
        ...P && P !== M ? {
            display_name: P
        } : {},
        version: W,
        description: D,
        ...K ? {
            long_description: K
        } : {},
        author: {
            name: Z,
            ...G ? {
                email: G
            } : {},
            ...f ? {
                url: f
            } : {}
        },
        ...z.homepage ? {
            homepage: z.homepage
        } : {},
        ...z.documentation ? {
            documentation: z.documentation
        } : {},
        ...z.support ? {
            support: z.support
        } : {},
        ...Y.icon ? {
            icon: Y.icon
        } : {},
        ...Y.screenshots.length > 0 ? {
            screenshots: Y.screenshots
        } : {},
        server: {
            type: v,
            entry_point: V,
            mcp_config: k
        },
        ...O.length > 0 ? {
            tools: O
        } : {},
        ...w ? {
            tools_generated: !0
        } : {},
        ...$.length > 0 ? {
            prompts: $
        } : {},
        ...j ? {
            prompts_generated: !0
        } : {},
        ...H ? {
            compatibility: H
        } : {},
        ...Object.keys(J).length > 0 ? {
            user_config: J
        } : {},
        ...N ? {
            keywords: N.split(",").map((C) => C.trim()).filter((C) => C)
        } : {},
        ...R ? {
            license: R
        } : {},
        ...h ? {
            repository: h
        } : {}
    }
}
// @from(Ln 239935, Col 0)
function yT4() {
    console.log(`
Next steps:`), console.log("1. Ensure all your production dependencies are in this directory"), console.log("2. Run 'mcpb pack' to create your .mcpb file")
}