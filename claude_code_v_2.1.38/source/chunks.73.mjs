
// @from(Ln 195532, Col 4)
Gv7 = v(() => {
    mK6();
    GqA();
    ZqA();
    gK6();
    TqA();
    _77();
    lK6();
    yqA();
    gC1();
    CqA();
    SqA();
    iK6();
    o4A();
    v71();
    Mu();
    G5();
    hA();
    MJ1();
    B6();
    lC1();
    v3();
    lS = o(X1(), 1), Wv7 = ["iTerm.app", "kitty", "WezTerm", "ghostty"], AK9 = process.platform !== "win32";
    v26 = class v26 extends lS.PureComponent {
        static displayName = "InternalApp";
        static getDerivedStateFromError(A) {
            return {
                error: A
            }
        }
        state = {
            isFocusEnabled: !0,
            activeFocusId: void 0,
            focusables: [],
            error: void 0
        };
        rawModeEnabledCount = 0;
        internal_eventEmitter = new V71;
        keyParseState = M77;
        incompleteEscapeTimer = null;
        NORMAL_TIMEOUT = 50;
        PASTE_TIMEOUT = 500;
        isRawModeSupported() {
            return this.props.stdin.isTTY
        }
        render() {
            return lS.default.createElement(fJ1.Provider, {
                value: {
                    columns: this.props.terminalColumns,
                    rows: this.props.terminalRows
                }
            }, lS.default.createElement(FK6.Provider, {
                value: {
                    exit: this.handleExit
                }
            }, lS.default.createElement(pK6, {
                initialState: this.props.initialTheme,
                onThemeChange: this.props.onThemeChange,
                onThemeSave: this.props.onThemeSave
            }, lS.default.createElement(QK6.Provider, {
                value: {
                    stdin: this.props.stdin,
                    setRawMode: this.handleSetRawMode,
                    isRawModeSupported: this.isRawModeSupported(),
                    internal_exitOnCtrlC: this.props.exitOnCtrlC,
                    internal_eventEmitter: this.internal_eventEmitter
                }
            }, lS.default.createElement(jJ1.Provider, {
                value: {
                    activeId: this.state.activeFocusId,
                    add: this.addFocusable,
                    remove: this.removeFocusable,
                    activate: this.activateFocusable,
                    deactivate: this.deactivateFocusable,
                    enableFocus: this.enableFocus,
                    disableFocus: this.disableFocus,
                    focusNext: this.focusNext,
                    focusPrevious: this.focusPrevious,
                    focus: this.focus
                }
            }, lS.default.createElement(c87, null, lS.default.createElement(X77, null, this.state.error ? lS.default.createElement(LqA, {
                error: this.state.error
            }) : this.props.children)))))))
        }
        componentDidMount() {
            if (this.props.stdout.isTTY && !J6(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(dC1)
        }
        componentWillUnmount() {
            if (this.props.stdout.isTTY) this.props.stdout.write(PS);
            if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer), this.incompleteEscapeTimer = null;
            if (this.isRawModeSupported()) this.handleSetRawMode(!1)
        }
        componentDidCatch(A) {
            this.handleExit(A)
        }
        handleSetRawMode = (A) => {
            let {
                stdin: q
            } = this.props;
            if (!this.isRawModeSupported())
                if (q === process.stdin) throw Error(`Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
                else throw Error(`Raw mode is not supported on the stdin provided to Ink.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
            if (q.setEncoding("utf8"), A) {
                if (this.rawModeEnabledCount === 0) {
                    if (yr(), q.ref(), q.setRawMode(!0), q.addListener("readable", this.handleReadable), this.props.stdout.write(N77), this.props.stdout.write(hqA), Wv7.includes(xA.terminal ?? "")) this.props.stdout.write(GA7)
                }
                this.rawModeEnabledCount++;
                return
            }
            if (--this.rawModeEnabledCount === 0) {
                if (Wv7.includes(xA.terminal ?? "")) this.props.stdout.write(e_1);
                this.props.stdout.write(T71), this.props.stdout.write(VJ1), q.setRawMode(!1), q.removeListener("readable", this.handleReadable), q.unref()
            }
        };
        flushIncomplete = () => {
            if (this.incompleteEscapeTimer = null, !this.keyParseState.incomplete) return;
            this.processInput(null)
        };
        processInput = (A) => {
            let [q, K] = P77(this.keyParseState, A);
            if (this.keyParseState = K, q.length > 0) ag.discreteUpdates(qK9, this, q, void 0, void 0);
            if (this.keyParseState.incomplete) {
                if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer);
                this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT)
            }
        };
        handleReadable = () => {
            let A;
            while ((A = this.props.stdin.read()) !== null) this.processInput(A)
        };
        handleInput = (A) => {
            if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
            if (A === eq9 && this.state.activeFocusId) this.setState({
                activeFocusId: void 0
            });
            if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
                if (A === sq9) this.focusNext();
                if (A === tq9) this.focusPrevious()
            }
        };
        handleExit = (A) => {
            if (this.isRawModeSupported()) this.handleSetRawMode(!1);
            this.props.onExit(A)
        };
        handleTerminalFocus = (A) => {
            d87(A)
        };
        handleSuspend = () => {
            if (!this.isRawModeSupported()) return;
            u8("suspend");
            let A = this.rawModeEnabledCount;
            while (this.rawModeEnabledCount > 0) this.handleSetRawMode(!1);
            if (this.props.stdout.isTTY) this.props.stdout.write(PS), this.props.stdout.write(T71);
            this.internal_eventEmitter.emit("suspend");
            let q = () => {
                for (let K = 0; K < A; K++)
                    if (this.isRawModeSupported()) this.handleSetRawMode(!0);
                if (this.props.stdout.isTTY) {
                    if (!J6(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(dC1);
                    this.props.stdout.write(hqA)
                }
                this.internal_eventEmitter.emit("resume"), process.removeListener("SIGCONT", q)
            };
            process.on("SIGCONT", q), process.kill(process.pid, "SIGSTOP")
        };
        enableFocus = () => {
            this.setState({
                isFocusEnabled: !0
            })
        };
        disableFocus = () => {
            this.setState({
                isFocusEnabled: !1
            })
        };
        focus = (A) => {
            this.setState((q) => {
                if (!q.focusables.some((Y) => Y?.id === A)) return q;
                return {
                    activeFocusId: A
                }
            })
        };
        focusNext = () => {
            this.setState((A) => {
                let q = A.focusables.find((Y) => Y.isActive)?.id;
                return {
                    activeFocusId: this.findNextFocusable(A) ?? q
                }
            })
        };
        focusPrevious = () => {
            this.setState((A) => {
                let q = A.focusables.findLast((Y) => Y.isActive)?.id;
                return {
                    activeFocusId: this.findPreviousFocusable(A) ?? q
                }
            })
        };
        addFocusable = (A, {
            autoFocus: q
        }) => {
            this.setState((K) => {
                let Y = K.activeFocusId;
                if (!Y && q) Y = A;
                return {
                    activeFocusId: Y,
                    focusables: [...K.focusables, {
                        id: A,
                        isActive: !0
                    }]
                }
            })
        };
        removeFocusable = (A) => {
            this.setState((q) => ({
                activeFocusId: q.activeFocusId === A ? void 0 : q.activeFocusId,
                focusables: q.focusables.filter((K) => {
                    return K.id !== A
                })
            }))
        };
        activateFocusable = (A) => {
            this.setState((q) => ({
                focusables: q.focusables.map((K) => {
                    if (K.id !== A) return K;
                    return {
                        id: A,
                        isActive: !0
                    }
                })
            }))
        };
        deactivateFocusable = (A) => {
            this.setState((q) => ({
                activeFocusId: q.activeFocusId === A ? void 0 : q.activeFocusId,
                focusables: q.focusables.map((K) => {
                    if (K.id !== A) return K;
                    return {
                        id: A,
                        isActive: !1
                    }
                })
            }))
        };
        findNextFocusable = (A) => {
            let q = A.focusables.findIndex((K) => {
                return K.id === A.activeFocusId
            });
            for (let K = q + 1; K < A.focusables.length; K++) {
                let Y = A.focusables[K];
                if (Y?.isActive) return Y.id
            }
            return
        };
        findPreviousFocusable = (A) => {
            let q = A.focusables.findIndex((K) => {
                return K.id === A.activeFocusId
            });
            for (let K = q - 1; K >= 0; K--) {
                let Y = A.focusables[K];
                if (Y?.isActive) return Y.id
            }
            return
        }
    }
})
// @from(Ln 195802, Col 0)
function fv(...A) {
    let q = xA.terminal === "kitty" ? KK9 : fr;
    return `${Zv7}${A.join(Vr)}${q}`
}
// @from(Ln 195807, Col 0)
function fv7(A) {
    let q = A.indexOf(";"),
        K = q >= 0 ? A.slice(0, q) : A,
        Y = q >= 0 ? A.slice(q + 1) : "",
        z = parseInt(K, 10);
    if (z === d0.SET_TITLE_AND_ICON) return {
        type: "title",
        action: {
            type: "both",
            title: Y
        }
    };
    if (z === d0.SET_ICON) return {
        type: "title",
        action: {
            type: "iconName",
            name: Y
        }
    };
    if (z === d0.SET_TITLE) return {
        type: "title",
        action: {
            type: "windowTitle",
            title: Y
        }
    };
    if (z === d0.HYPERLINK) {
        let w = Y.split(";"),
            H = w[0] ?? "",
            $ = w.slice(1).join(";");
        if ($ === "") return {
            type: "link",
            action: {
                type: "end"
            }
        };
        let O = {};
        if (H)
            for (let _ of H.split(":")) {
                let J = _.indexOf("=");
                if (J >= 0) O[_.slice(0, J)] = _.slice(J + 1)
            }
        return {
            type: "link",
            action: {
                type: "start",
                url: $,
                params: Object.keys(O).length > 0 ? O : void 0
            }
        }
    }
    return {
        type: "unknown",
        sequence: `\x1B]${A}`
    }
}
// @from(Ln 195864, Col 0)
function Vv7(A, q) {
    let K = q ? Object.entries(q).map(([Y, z]) => `${Y}=${z}`).join(":") : "";
    return fv(d0.HYPERLINK, K, A)
}
// @from(Ln 195868, Col 4)
Zv7
// @from(Ln 195868, Col 9)
KK9
// @from(Ln 195868, Col 14)
d0
// @from(Ln 195868, Col 18)
co2
// @from(Ln 195868, Col 23)
wq1
// @from(Ln 195868, Col 28)
Hq1
// @from(Ln 195868, Col 33)
E26
// @from(Ln 195869, Col 4)
ZD1 = v(() => {
    j71();
    G5();
    Zv7 = Zr + String.fromCharCode(XS.OSC), KK9 = Zr + "\\";
    d0 = {
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
        GHOSTTY: 777
    };
    co2 = fv(d0.HYPERLINK, "", ""), wq1 = {
        NOTIFY: 0,
        BADGE: 2,
        PROGRESS: 4
    }, Hq1 = {
        CLEAR: 0,
        SET: 1,
        ERROR: 2,
        INDETERMINATE: 3
    }, E26 = `${Zv7}${d0.ITERM2};${wq1.PROGRESS};${Hq1.CLEAR};${fr}`
})
// @from(Ln 195905, Col 0)
function zK9() {
    return process.platform === "win32" && !!process.env.WT_SESSION
}
// @from(Ln 195909, Col 0)
function wK9() {
    if (process.env.TERM_PROGRAM === "mintty") return !0;
    if (process.platform === "win32" && process.env.MSYSTEM) return !0;
    return !1
}
// @from(Ln 195915, Col 0)
function HK9() {
    if (zK9()) return !0;
    if (process.platform === "win32" && process.env.TERM_PROGRAM === "vscode" && process.env.TERM_PROGRAM_VERSION) return !0;
    if (wK9()) return !0;
    return !1
}
// @from(Ln 195922, Col 0)
function Mx1() {
    if (process.platform === "win32")
        if (HK9()) return ZK6 + I4A + h4A;
        else return ZK6 + YK9;
    return ZK6 + I4A + h4A
}
// @from(Ln 195928, Col 4)
YK9
// @from(Ln 195928, Col 9)
no2
// @from(Ln 195929, Col 4)
$$A = v(() => {
    Mu();
    YK9 = uO(0, "f");
    no2 = Mx1()
})
// @from(Ln 195935, Col 0)
function Nv7() {
    if (!process.stdout.isTTY) return !1;
    if (process.env.WT_SESSION) return !1;
    if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return !0;
    let A = Px1.coerce(process.env.TERM_PROGRAM_VERSION);
    if (!A) return !1;
    if (process.env.TERM_PROGRAM === "ghostty") return Px1.gte(A, "1.2.0");
    if (process.env.TERM_PROGRAM === "iTerm.app") return Px1.gte(A, "3.6.6");
    return !1
}
// @from(Ln 195946, Col 0)
function Tv7() {
    let A = process.env.TERM_PROGRAM,
        q = process.env.TERM;
    if (A === "iTerm.app" || A === "WezTerm" || A === "WarpTerminal" || A === "ghostty" || A === "contour" || A === "vscode" || A === "alacritty") return !0;
    if (q?.includes("kitty") || process.env.KITTY_WINDOW_ID) return !0;
    if (q === "xterm-ghostty") return !0;
    if (q?.startsWith("foot")) return !0;
    if (q?.includes("alacritty")) return !0;
    if (process.env.ZED_TERM) return !0;
    if (process.env.WT_SESSION) return !0;
    let K = process.env.VTE_VERSION;
    if (K) {
        if (parseInt(K, 10) >= 6800) return !0
    }
    return !1
}
// @from(Ln 195963, Col 0)
function O$A(A, q) {
    if (q.length === 0) return;
    let K = f77;
    for (let Y of q) switch (Y.type) {
        case "stdout":
            K += Y.content;
            break;
        case "clear":
            if (Y.count > 0) K += DA7(Y.count);
            break;
        case "clearTerminal":
            K += Mx1();
            break;
        case "cursorHide":
            K += dC1;
            break;
        case "cursorShow":
            K += PS;
            break;
        case "cursorMove":
            K += XA7(Y.x, Y.y);
            break;
        case "cursorTo":
            K += JA7(Y.col);
            break;
        case "carriageReturn":
            K += "\r";
            break;
        case "hyperlink":
            K += Vv7(Y.uri);
            break;
        case "style":
            K += cG(Y.codes);
            break;
        case "styleStr":
            K += Y.str;
            break
    }
    K += V77, A.stdout.write(K)
}
// @from(Ln 196003, Col 4)
Px1
// @from(Ln 196004, Col 4)
k26 = v(() => {
    f71();
    Mu();
    v71();
    ZD1();
    $$A();
    Px1 = o(GS(), 1)
})
// @from(Ln 196013, Col 0)
function YB() {
    let A = cL.useContext(vv7);
    if (!A) throw Error("useTerminalNotification must be used within TerminalWriteProvider");
    let q = cL.useCallback(({
            message: H,
            title: $
        }) => {
            let O = $ ? `${$}:
${H}` : H;
            A(fv(d0.ITERM2, `

${O}`))
        }, [A]),
        K = cL.useCallback(({
            message: H,
            title: $,
            id: O
        }) => {
            A(fv(d0.KITTY, `i=${O}:d=0:p=title`, $)), A(fv(d0.KITTY, `i=${O}:p=body`, H)), A(fv(d0.KITTY, `i=${O}:d=1:a=focus`, ""))
        }, [A]),
        Y = cL.useCallback(({
            message: H,
            title: $
        }) => {
            A(fv(d0.GHOSTTY, "notify", $, H))
        }, [A]),
        z = cL.useCallback(() => {
            A(fr)
        }, [A]),
        w = cL.useCallback((H, $) => {
            if (!Nv7()) return;
            if (!H) {
                A(fv(d0.ITERM2, wq1.PROGRESS, Hq1.CLEAR, ""));
                return
            }
            let O = Math.max(0, Math.min(100, Math.round($ ?? 0)));
            switch (H) {
                case "completed":
                    A(fv(d0.ITERM2, wq1.PROGRESS, Hq1.CLEAR, ""));
                    break;
                case "error":
                    A(fv(d0.ITERM2, wq1.PROGRESS, Hq1.ERROR, O));
                    break;
                case "indeterminate":
                    A(fv(d0.ITERM2, wq1.PROGRESS, Hq1.INDETERMINATE, ""));
                    break;
                case "running":
                    A(fv(d0.ITERM2, wq1.PROGRESS, Hq1.SET, O));
                    break;
                case null:
                    break
            }
        }, [A]);
    return cL.useMemo(() => ({
        notifyITerm2: q,
        notifyKitty: K,
        notifyGhostty: Y,
        notifyBell: z,
        progress: w
    }), [q, K, Y, z, w])
}
// @from(Ln 196074, Col 4)
cL
// @from(Ln 196074, Col 8)
vv7
// @from(Ln 196074, Col 13)
Ev7
// @from(Ln 196075, Col 4)
$q1 = v(() => {
    j71();
    ZD1();
    k26();
    cL = o(X1(), 1), vv7 = cL.createContext(null), Ev7 = vv7.Provider
})
// @from(Ln 196082, Col 0)
function _$A(A) {
    if (A.length <= 1) return A;
    let q = [],
        K = 0;
    for (let Y of A) {
        let z = Y.type;
        if (z === "stdout") {
            if (Y.content === "") continue
        } else if (z === "cursorMove") {
            if (Y.x === 0 && Y.y === 0) continue
        } else if (z === "clear") {
            if (Y.count === 0) continue
        }
        if (K > 0) {
            let w = K - 1,
                H = q[w],
                $ = H.type;
            if (z === "cursorMove" && $ === "cursorMove") {
                q[w] = {
                    type: "cursorMove",
                    x: H.x + Y.x,
                    y: H.y + Y.y
                };
                continue
            }
            if (z === "cursorTo" && $ === "cursorTo") {
                q[w] = Y;
                continue
            }
            if ((z === "style" || z === "styleStr") && ($ === "style" || $ === "styleStr")) {
                q[w] = Y;
                continue
            }
            if (z === "hyperlink" && $ === "hyperlink" && Y.uri === H.uri) continue;
            if (z === "cursorShow" && $ === "cursorHide" || z === "cursorHide" && $ === "cursorShow") {
                q.pop(), K--;
                continue
            }
        }
        q.push(Y), K++
    }
    return q
}
// @from(Ln 196126, Col 0)
function ho(A, q, K, Y, z) {
    return {
        screen: bC1(0, 0, K, Y, z),
        viewport: {
            width: q,
            height: A
        },
        cursor: {
            x: 0,
            y: 0,
            visible: !0
        }
    }
}
// @from(Ln 196140, Col 4)
kv7 = v(() => {
    JJ1()
})
// @from(Ln 196146, Col 0)
class Gx1 {
    options;
    log;
    terminal;
    scheduleRender;
    isUnmounted = !1;
    isPaused = !1;
    container;
    rootNode;
    renderer;
    stylePool;
    charPool;
    hyperlinkPool;
    exitPromise;
    restoreConsole;
    unsubscribeTTYHandlers;
    terminalColumns;
    terminalRows;
    currentNode = null;
    frontFrame;
    backFrame;
    lastPoolResetTime = performance.now();
    constructor(A) {
        this.options = A;
        if (t7A(this), this.options.patchConsole) this.restoreConsole = this.patchConsole();
        if (this.terminal = {
                stdout: A.stdout,
                stderr: A.stderr
            }, this.terminalColumns = A.stdout.columns || 80, this.terminalRows = A.stdout.rows || 24, this.stylePool = new OqA, this.charPool = new hK6, this.hyperlinkPool = new IK6, this.frontFrame = ho(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = ho(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.log = new MqA({
                debug: A.debug,
                isTTY: A.stdout.isTTY || !1,
                stylePool: this.stylePool
            }), this.scheduleRender = A.debug ? this.onRender : s7A(this.onRender, WJ1, {
                leading: !0,
                trailing: !0
            }), this.isUnmounted = !1, this.unsubscribeExit = $o1(this.unmount, {
                alwaysLast: !1
            }), A.stdout.isTTY) A.stdout.on("resize", this.handleResize), process.on("SIGCONT", this.handleResume), this.unsubscribeTTYHandlers = () => {
            A.stdout.off("resize", this.handleResize), process.off("SIGCONT", this.handleResume)
        };
        this.rootNode = vK6("ink-root"), this.renderer = DqA(this.rootNode, this.stylePool), this.rootNode.onRender = this.scheduleRender, this.rootNode.onImmediateRender = this.onRender, this.rootNode.onComputeLayout = () => {
            if (this.isUnmounted) return;
            if (this.rootNode.yogaNode) this.rootNode.yogaNode.setWidth(this.terminalColumns), this.rootNode.yogaNode.calculateLayout(this.terminalColumns)
        }, this.container = ag.createContainer(this.rootNode, G4A, null, !1, null, "id", OQ, OQ, OQ, OQ)
    }
    handleResume = () => {
        if (!this.options.stdout.isTTY) return;
        this.frontFrame = ho(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = ho(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset()
    };
    handleResize = () => {
        if (this.terminalColumns = this.options.stdout.columns || 80, this.terminalRows = this.options.stdout.rows || 24, this.currentNode !== null) this.render(this.currentNode)
    };
    resolveExitPromise = () => {};
    rejectExitPromise = () => {};
    unsubscribeExit = () => {};
    setTheme(A) {
        this.options.theme = A
    }
    handleThemeChange = (A) => {
        this.setTheme(A)
    };
    handleThemeSave = (A) => {
        u8("theme"), jA((q) => ({
            ...q,
            theme: A
        }))
    };
    onRender() {
        if (this.isUnmounted || this.isPaused) return;
        let A = performance.now(),
            q = this.options.stdout.columns || 80,
            K = this.options.stdout.rows || 24,
            Y = this.renderer({
                frontFrame: this.frontFrame,
                backFrame: this.backFrame,
                isTTY: this.options.stdout.isTTY,
                terminalWidth: q,
                terminalRows: K
            }),
            z = this.log.render(this.frontFrame, Y);
        if (this.backFrame = this.frontFrame, this.frontFrame = Y, A - this.lastPoolResetTime > 300000) this.resetPools(), this.lastPoolResetTime = A;
        let w = [];
        for (let H of z)
            if (H.type === "clearTerminal") w.push({
                desiredHeight: Y.screen.height,
                availableHeight: Y.viewport.height,
                reason: H.reason
            });
        O$A(this.terminal, _$A(z)), this.options.onFrame?.({
            durationMs: performance.now() - A,
            flickers: w
        })
    }
    pause() {
        ag.flushSyncFromReconciler(), this.onRender(), this.isPaused = !0
    }
    resume() {
        this.isPaused = !1, this.onRender()
    }
    repaint() {
        this.frontFrame = ho(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = ho(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset()
    }
    stdinListeners = [];
    wasRawMode = !1;
    suspendStdin() {
        let A = this.options.stdin;
        if (!A.isTTY) return;
        A.listeners("readable").forEach((Y) => {
            this.stdinListeners.push({
                event: "readable",
                listener: Y
            }), A.removeListener("readable", Y)
        });
        let K = A;
        if (K.isRaw && K.setRawMode) K.setRawMode(!1), this.wasRawMode = !0
    }
    resumeStdin() {
        let A = this.options.stdin;
        if (!A.isTTY) return;
        if (this.stdinListeners.forEach(({
                event: q,
                listener: K
            }) => {
                A.addListener(q, K)
            }), this.stdinListeners = [], this.wasRawMode) {
            let q = A;
            if (q.setRawMode) q.setRawMode(!0);
            this.wasRawMode = !1
        }
    }
    render(A) {
        this.currentNode = A;
        let q = J$A.default.createElement(v26, {
            initialTheme: this.options.theme,
            stdin: this.options.stdin,
            stdout: this.options.stdout,
            stderr: this.options.stderr,
            exitOnCtrlC: this.options.exitOnCtrlC,
            onExit: this.unmount,
            terminalColumns: this.terminalColumns,
            terminalRows: this.terminalRows,
            onThemeChange: this.handleThemeChange,
            onThemeSave: this.handleThemeSave
        }, J$A.default.createElement(Ev7, {
            value: (K) => this.options.stdout.write(K)
        }, A));
        ag.updateContainerSync(q, this.container, null, OQ), ag.flushSyncWork()
    }
    unmount(A) {
        if (this.isUnmounted) return;
        if (this.onRender(), this.unsubscribeExit(), typeof this.restoreConsole === "function") this.restoreConsole();
        this.unsubscribeTTYHandlers?.();
        let q = this.log.renderPreviousOutput_DEPRECATED(this.frontFrame);
        if (O$A(this.terminal, _$A(q)), this.options.stdout.isTTY) Wx1(1, e_1), Wx1(1, T71), Wx1(1, VJ1), Wx1(1, PS), Wx1(1, E26);
        if (this.isUnmounted = !0, this.scheduleRender.cancel?.(), ag.updateContainerSync(null, this.container, null, OQ), ag.flushSyncWork(), fL.delete(this.options.stdout), A instanceof Error) this.rejectExitPromise(A);
        else this.resolveExitPromise()
    }
    async waitUntilExit() {
        return this.exitPromise ||= new Promise((A, q) => {
            this.resolveExitPromise = A, this.rejectExitPromise = q
        }), this.exitPromise
    }
    resetLineCount() {
        if (this.options.stdout.isTTY && !this.options.debug) this.backFrame = this.frontFrame, this.frontFrame = ho(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset()
    }
    resetPools() {
        this.charPool = new hK6, this.hyperlinkPool = new IK6, E87(this.frontFrame.screen, this.charPool, this.hyperlinkPool), this.backFrame.screen.charPool = this.charPool, this.backFrame.screen.hyperlinkPool = this.hyperlinkPool
    }
    patchConsole() {
        if (this.options.debug) return;
        return R67((A, q) => {
            if (A === "stdout") h(`console.log: ${q}`);
            if (A === "stderr") K1(Error(`console.error: ${q}`))
        })
    }
}
// @from(Ln 196322, Col 4)
J$A
// @from(Ln 196323, Col 4)
Lv7 = v(() => {
    E67();
    zh6();
    y67();
    o4A();
    I87();
    i4A();
    u87();
    DJ1();
    Gv7();
    $q1();
    y6();
    Z6();
    SR6();
    k26();
    kv7();
    JJ1();
    v71();
    Mu();
    ZD1();
    cA();
    v3();
    f4A();
    J$A = o(X1(), 1)
})
// @from(Ln 196351, Col 0)
async function Rv7({
    stdout: A = process.stdout,
    stdin: q = process.stdin,
    stderr: K = process.stderr,
    debug: Y = !1,
    exitOnCtrlC: z = !0,
    patchConsole: w = !0,
    theme: H = f6().theme,
    onFrame: $
} = {}) {
    await U4A();
    let O = new Gx1({
        stdout: A,
        stdin: q,
        stderr: K,
        debug: Y,
        exitOnCtrlC: z,
        patchConsole: w,
        theme: H,
        onFrame: $
    });
    return fL.set(A, O), {
        render: (_) => O.render(_),
        unmount: () => O.unmount(),
        waitUntilExit: () => O.waitUntilExit()
    }
}
// @from(Ln 196378, Col 4)
OK9 = (A, q) => {
        let K = JK9(q),
            Y = {
                stdout: process.stdout,
                stdin: process.stdin,
                stderr: process.stderr,
                debug: !1,
                exitOnCtrlC: !0,
                patchConsole: !0,
                ...K,
                theme: K.theme ?? f6().theme
            },
            z = XK9(Y.stdout, () => new Gx1(Y));
        return z.render(A), {
            rerender: z.render,
            unmount() {
                z.unmount()
            },
            waitUntilExit: z.waitUntilExit,
            cleanup: () => fL.delete(Y.stdout)
        }
    }
// @from(Ln 196400, Col 4)
_K9 = async (A, q) => {
        h("[render] initLayout starting"), await U4A(), h("[render] initLayout complete");
        let K = OK9(A, q);
        return h(`[render] first ink render: ${Math.round(process.uptime()*1000)}ms since process start`), K
    }
// @from(Ln 196404, Col 7)
_Z
// @from(Ln 196404, Col 11)
JK9 = (A = {}) => {
        if (A instanceof $K9) return {
            stdout: A,
            stdin: process.stdin
        };
        return A
    }
// @from(Ln 196410, Col 7)
XK9 = (A, q) => {
        let K = fL.get(A);
        if (!K) K = q(), fL.set(A, K);
        return K
    }
// @from(Ln 196415, Col 4)
yv7 = v(() => {
    Lv7();
    p4A();
    DJ1();
    cA();
    Z6();
    _Z = _K9
})
// @from(Ln 196424, Col 0)
function Zx1(A, q) {
    if (!A) return;
    if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
    return q[A]
}
// @from(Ln 196430, Col 0)
function DK9(A) {
    let q = e(29),
        K, Y, z, w, H, $, O, _;
    if (q[0] !== A)({
        borderColor: Y,
        borderTopColor: H,
        borderBottomColor: K,
        borderLeftColor: z,
        borderRightColor: w,
        children: $,
        ref: O,
        ..._
    } = A), q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = w, q[5] = H, q[6] = $, q[7] = O, q[8] = _;
    else K = q[1], Y = q[2], z = q[3], w = q[4], H = q[5], $ = q[6], O = q[7], _ = q[8];
    let [J] = T7(), X, D, j, M, P;
    if (q[9] !== K || q[10] !== Y || q[11] !== z || q[12] !== w || q[13] !== H || q[14] !== J) {
        let f = MW(J);
        D = Zx1(Y, f), M = Zx1(H, f), X = Zx1(K, f), j = Zx1(z, f), P = Zx1(w, f), q[9] = K, q[10] = Y, q[11] = z, q[12] = w, q[13] = H, q[14] = J, q[15] = X, q[16] = D, q[17] = j, q[18] = M, q[19] = P
    } else X = q[15], D = q[16], j = q[17], M = q[18], P = q[19];
    let W = P,
        G;
    if (q[20] !== $ || q[21] !== O || q[22] !== X || q[23] !== D || q[24] !== j || q[25] !== W || q[26] !== M || q[27] !== _) G = Cv7.default.createElement(PW, {
        ref: O,
        borderColor: D,
        borderTopColor: M,
        borderBottomColor: X,
        borderLeftColor: j,
        borderRightColor: W,
        ..._
    }, $), q[20] = $, q[21] = O, q[22] = X, q[23] = D, q[24] = j, q[25] = W, q[26] = M, q[27] = _, q[28] = G;
    else G = q[28];
    return G
}
// @from(Ln 196463, Col 4)
Cv7
// @from(Ln 196463, Col 9)
I
// @from(Ln 196464, Col 4)
Sv7 = v(() => {
    i1();
    Wu();
    gC1();
    QC1();
    Cv7 = o(X1(), 1);
    I = DK9
})
// @from(Ln 196472, Col 4)
xv7 = R((na2, Iv7) => {
    var jK9 = h1("os"),
        hv7 = h1("tty"),
        lL = cN1(),
        {
            env: c0
        } = process,
        Io;
    if (lL("no-color") || lL("no-colors") || lL("color=false") || lL("color=never")) Io = 0;
    else if (lL("color") || lL("colors") || lL("color=true") || lL("color=always")) Io = 1;
    if ("FORCE_COLOR" in c0)
        if (c0.FORCE_COLOR === "true") Io = 1;
        else if (c0.FORCE_COLOR === "false") Io = 0;
    else Io = c0.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(c0.FORCE_COLOR, 10), 3);

    function X$A(A) {
        if (A === 0) return !1;
        return {
            level: A,
            hasBasic: !0,
            has256: A >= 2,
            has16m: A >= 3
        }
    }

    function D$A(A, q) {
        if (Io === 0) return 0;
        if (lL("color=16m") || lL("color=full") || lL("color=truecolor")) return 3;
        if (lL("color=256")) return 2;
        if (A && !q && Io === void 0) return 0;
        let K = Io || 0;
        if (c0.TERM === "dumb") return K;
        if (process.platform === "win32") {
            let Y = jK9.release().split(".");
            if (Number(Y[0]) >= 10 && Number(Y[2]) >= 10586) return Number(Y[2]) >= 14931 ? 3 : 2;
            return 1
        }
        if ("CI" in c0) {
            if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((Y) => (Y in c0)) || c0.CI_NAME === "codeship") return 1;
            return K
        }
        if ("TEAMCITY_VERSION" in c0) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(c0.TEAMCITY_VERSION) ? 1 : 0;
        if (c0.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in c0) {
            let Y = parseInt((c0.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (c0.TERM_PROGRAM) {
                case "iTerm.app":
                    return Y >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2
            }
        }
        if (/-256(color)?$/i.test(c0.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(c0.TERM)) return 1;
        if ("COLORTERM" in c0) return 1;
        return K
    }

    function MK9(A) {
        let q = D$A(A, A && A.isTTY);
        return X$A(q)
    }
    Iv7.exports = {
        supportsColor: MK9,
        stdout: X$A(D$A(!0, hv7.isatty(1))),
        stderr: X$A(D$A(!0, hv7.isatty(2)))
    }
})
// @from(Ln 196540, Col 4)
Bv7 = R((ra2, uv7) => {
    var PK9 = xv7(),
        fD1 = cN1();

    function bv7(A) {
        if (/^\d{3,4}$/.test(A)) {
            let K = /(\d{1,2})(\d{2})/.exec(A);
            return {
                major: 0,
                minor: parseInt(K[1], 10),
                patch: parseInt(K[2], 10)
            }
        }
        let q = (A || "").split(".").map((K) => parseInt(K, 10));
        return {
            major: q[0],
            minor: q[1],
            patch: q[2]
        }
    }

    function j$A(A) {
        let {
            env: q
        } = process;
        if ("FORCE_HYPERLINK" in q) return !(q.FORCE_HYPERLINK.length > 0 && parseInt(q.FORCE_HYPERLINK, 10) === 0);
        if (fD1("no-hyperlink") || fD1("no-hyperlinks") || fD1("hyperlink=false") || fD1("hyperlink=never")) return !1;
        if (fD1("hyperlink=true") || fD1("hyperlink=always")) return !0;
        if ("NETLIFY" in q) return !0;
        if (!PK9.supportsColor(A)) return !1;
        if (A && !A.isTTY) return !1;
        if (process.platform === "win32") return !1;
        if ("CI" in q) return !1;
        if ("TEAMCITY_VERSION" in q) return !1;
        if ("TERM_PROGRAM" in q) {
            let K = bv7(q.TERM_PROGRAM_VERSION);
            switch (q.TERM_PROGRAM) {
                case "iTerm.app":
                    if (K.major === 3) return K.minor >= 1;
                    return K.major > 3;
                case "WezTerm":
                    return K.major >= 20200620;
                case "vscode":
                    return K.major > 1 || K.major === 1 && K.minor >= 72
            }
        }
        if ("VTE_VERSION" in q) {
            if (q.VTE_VERSION === "0.50.0") return !1;
            let K = bv7(q.VTE_VERSION);
            return K.major > 0 || K.minor >= 50
        }
        return !1
    }
    uv7.exports = {
        supportsHyperlink: j$A,
        stdout: j$A(process.stdout),
        stderr: j$A(process.stderr)
    }
})
// @from(Ln 196600, Col 0)
function Vv() {
    if (Fv7.default.stdout) return !0;
    let A = process.env.TERM_PROGRAM;
    if (A && mv7.includes(A)) return !0;
    let q = process.env.LC_TERMINAL;
    if (q && mv7.includes(q)) return !0;
    if (process.env.TERM?.includes("kitty")) return !0;
    return !1
}
// @from(Ln 196609, Col 4)
Fv7
// @from(Ln 196609, Col 9)
mv7
// @from(Ln 196610, Col 4)
xo = v(() => {
    Fv7 = o(Bv7(), 1), mv7 = ["ghostty", "Hyper", "kitty", "alacritty", "iTerm.app", "iTerm2"]
})
// @from(Ln 196614, Col 0)
function d7(A) {
    let q = e(5),
        {
            children: K,
            url: Y,
            fallback: z
        } = A,
        w = K ?? Y;
    if (Vv()) {
        let O;
        if (q[0] !== w || q[1] !== Y) O = L26.default.createElement(E_, null, L26.default.createElement("ink-link", {
            href: Y
        }, w)), q[0] = w, q[1] = Y, q[2] = O;
        else O = q[2];
        return O
    }
    let H = z ?? w,
        $;
    if (q[3] !== H) $ = L26.default.createElement(E_, null, H), q[3] = H, q[4] = $;
    else $ = q[4];
    return $
}
// @from(Ln 196636, Col 4)
L26
// @from(Ln 196637, Col 4)
VD1 = v(() => {
    i1();
    xo();
    PJ1();
    L26 = o(X1(), 1)
})
// @from(Ln 196644, Col 0)
function ND1() {
    return {
        bold: !1,
        dim: !1,
        italic: !1,
        underline: "none",
        blink: !1,
        inverse: !1,
        hidden: !1,
        strikethrough: !1,
        overline: !1,
        fg: {
            type: "default"
        },
        bg: {
            type: "default"
        },
        underlineColor: {
            type: "default"
        }
    }
}
// @from(Ln 196667, Col 0)
function Qv7(A) {
    if (A.length === 0) return null;
    let q = A[0];
    if (q === "c") return {
        type: "reset"
    };
    if (q === "7") return {
        type: "cursor",
        action: {
            type: "save"
        }
    };
    if (q === "8") return {
        type: "cursor",
        action: {
            type: "restore"
        }
    };
    if (q === "D") return {
        type: "cursor",
        action: {
            type: "move",
            direction: "down",
            count: 1
        }
    };
    if (q === "M") return {
        type: "cursor",
        action: {
            type: "move",
            direction: "up",
            count: 1
        }
    };
    if (q === "E") return {
        type: "cursor",
        action: {
            type: "nextLine",
            count: 1
        }
    };
    if (q === "H") return null;
    if ("()".includes(q) && A.length >= 2) return null;
    return {
        type: "unknown",
        sequence: `\x1B${A}`
    }
}
// @from(Ln 196716, Col 0)
function GK9(A) {
    if (A === "") return [{
        value: 0,
        subparams: [],
        colon: !1
    }];
    let q = [],
        K = {
            value: null,
            subparams: [],
            colon: !1
        },
        Y = "",
        z = !1;
    for (let w = 0; w <= A.length; w++) {
        let H = A[w];
        if (H === ";" || H === void 0) {
            let $ = Y === "" ? null : parseInt(Y, 10);
            if (z) {
                if ($ !== null) K.subparams.push($)
            } else K.value = $;
            q.push(K), K = {
                value: null,
                subparams: [],
                colon: !1
            }, Y = "", z = !1
        } else if (H === ":") {
            let $ = Y === "" ? null : parseInt(Y, 10);
            if (!z) K.value = $, K.colon = !0, z = !0;
            else if ($ !== null) K.subparams.push($);
            Y = ""
        } else if (H >= "0" && H <= "9") Y += H
    }
    return q
}
// @from(Ln 196752, Col 0)
function M$A(A, q) {
    let K = A[q];
    if (!K) return null;
    if (K.colon && K.subparams.length >= 1) {
        if (K.subparams[0] === 5 && K.subparams.length >= 2) return {
            index: K.subparams[1]
        };
        if (K.subparams[0] === 2 && K.subparams.length >= 4) {
            let z = K.subparams.length >= 5 ? 1 : 0;
            return {
                r: K.subparams[1 + z],
                g: K.subparams[2 + z],
                b: K.subparams[3 + z]
            }
        }
    }
    let Y = A[q + 1];
    if (!Y) return null;
    if (Y.value === 5 && A[q + 2]?.value !== null && A[q + 2]?.value !== void 0) return {
        index: A[q + 2].value
    };
    if (Y.value === 2) {
        let z = A[q + 2]?.value,
            w = A[q + 3]?.value,
            H = A[q + 4]?.value;
        if (z !== null && z !== void 0 && w !== null && w !== void 0 && H !== null && H !== void 0) return {
            r: z,
            g: w,
            b: H
        }
    }
    return null
}
// @from(Ln 196786, Col 0)
function gv7(A, q) {
    let K = GK9(A),
        Y = {
            ...q
        },
        z = 0;
    while (z < K.length) {
        let w = K[z],
            H = w.value ?? 0;
        if (H === 0) {
            Y = ND1(), z++;
            continue
        }
        if (H === 1) {
            Y.bold = !0, z++;
            continue
        }
        if (H === 2) {
            Y.dim = !0, z++;
            continue
        }
        if (H === 3) {
            Y.italic = !0, z++;
            continue
        }
        if (H === 4) {
            Y.underline = w.colon ? WK9[w.subparams[0]] ?? "single" : "single", z++;
            continue
        }
        if (H === 5 || H === 6) {
            Y.blink = !0, z++;
            continue
        }
        if (H === 7) {
            Y.inverse = !0, z++;
            continue
        }
        if (H === 8) {
            Y.hidden = !0, z++;
            continue
        }
        if (H === 9) {
            Y.strikethrough = !0, z++;
            continue
        }
        if (H === 21) {
            Y.underline = "double", z++;
            continue
        }
        if (H === 22) {
            Y.bold = !1, Y.dim = !1, z++;
            continue
        }
        if (H === 23) {
            Y.italic = !1, z++;
            continue
        }
        if (H === 24) {
            Y.underline = "none", z++;
            continue
        }
        if (H === 25) {
            Y.blink = !1, z++;
            continue
        }
        if (H === 27) {
            Y.inverse = !1, z++;
            continue
        }
        if (H === 28) {
            Y.hidden = !1, z++;
            continue
        }
        if (H === 29) {
            Y.strikethrough = !1, z++;
            continue
        }
        if (H === 53) {
            Y.overline = !0, z++;
            continue
        }
        if (H === 55) {
            Y.overline = !1, z++;
            continue
        }
        if (H >= 30 && H <= 37) {
            Y.fg = {
                type: "named",
                name: R26[H - 30]
            }, z++;
            continue
        }
        if (H === 39) {
            Y.fg = {
                type: "default"
            }, z++;
            continue
        }
        if (H >= 40 && H <= 47) {
            Y.bg = {
                type: "named",
                name: R26[H - 40]
            }, z++;
            continue
        }
        if (H === 49) {
            Y.bg = {
                type: "default"
            }, z++;
            continue
        }
        if (H >= 90 && H <= 97) {
            Y.fg = {
                type: "named",
                name: R26[H - 90 + 8]
            }, z++;
            continue
        }
        if (H >= 100 && H <= 107) {
            Y.bg = {
                type: "named",
                name: R26[H - 100 + 8]
            }, z++;
            continue
        }
        if (H === 38) {
            let $ = M$A(K, z);
            if ($) {
                Y.fg = "index" in $ ? {
                    type: "indexed",
                    index: $.index
                } : {
                    type: "rgb",
                    ...$
                }, z += w.colon ? 1 : ("index" in $) ? 3 : 5;
                continue
            }
        }
        if (H === 48) {
            let $ = M$A(K, z);
            if ($) {
                Y.bg = "index" in $ ? {
                    type: "indexed",
                    index: $.index
                } : {
                    type: "rgb",
                    ...$
                }, z += w.colon ? 1 : ("index" in $) ? 3 : 5;
                continue
            }
        }
        if (H === 58) {
            let $ = M$A(K, z);
            if ($) {
                Y.underlineColor = "index" in $ ? {
                    type: "indexed",
                    index: $.index
                } : {
                    type: "rgb",
                    ...$
                }, z += w.colon ? 1 : ("index" in $) ? 3 : 5;
                continue
            }
        }
        if (H === 59) {
            Y.underlineColor = {
                type: "default"
            }, z++;
            continue
        }
        z++
    }
    return Y
}
// @from(Ln 196960, Col 4)
R26
// @from(Ln 196960, Col 9)
WK9
// @from(Ln 196961, Col 4)
Uv7 = v(() => {
    R26 = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "brightBlack", "brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta", "brightCyan", "brightWhite"], WK9 = ["none", "single", "double", "curly", "dotted", "dashed"]
})
// @from(Ln 196965, Col 0)
function ZK9(A) {
    return A >= 9728 && A <= 9983 || A >= 9984 && A <= 10175 || A >= 127744 && A <= 129535 || A >= 129536 && A <= 129791 || A >= 127456 && A <= 127487
}
// @from(Ln 196969, Col 0)
function fK9(A) {
    return A >= 4352 && A <= 4447 || A >= 11904 && A <= 40959 || A >= 44032 && A <= 55203 || A >= 63744 && A <= 64255 || A >= 65040 && A <= 65055 || A >= 65072 && A <= 65135 || A >= 65280 && A <= 65376 || A >= 65504 && A <= 65510 || A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141
}
// @from(Ln 196973, Col 0)
function VK9(A) {
    if ([...A].length > 1) return 2;
    let q = A.codePointAt(0);
    if (q === void 0) return 1;
    if (ZK9(q) || fK9(q)) return 2;
    return 1
}
// @from(Ln 196981, Col 0)
function* pv7(A) {
    for (let {
            segment: q
        }
        of T_().segment(A)) yield {
        value: q,
        width: VK9(q)
    }
}
// @from(Ln 196991, Col 0)
function NK9(A) {
    if (A === "") return [];
    return A.split(/[;:]/).map((q) => q === "" ? 0 : parseInt(q, 10))
}
// @from(Ln 196996, Col 0)
function TK9(A) {
    let q = A.slice(2);
    if (q.length === 0) return null;
    let K = q.charCodeAt(q.length - 1),
        Y = q.slice(0, -1),
        z = "",
        w = Y,
        H = "";
    if (Y.length > 0 && "?>=".includes(Y[0])) z = Y[0], w = Y.slice(1);
    let $ = w.match(/([^0-9;:]+)$/);
    if ($) H = $[1], w = w.slice(0, -H.length);
    let O = NK9(w),
        _ = O[0] ?? 1,
        J = O[1] ?? 1;
    if (K === B$.SGR && z === "") return {
        type: "sgr",
        params: w
    };
    if (K === B$.CUU) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "up",
            count: _
        }
    };
    if (K === B$.CUD) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "down",
            count: _
        }
    };
    if (K === B$.CUF) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "forward",
            count: _
        }
    };
    if (K === B$.CUB) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "back",
            count: _
        }
    };
    if (K === B$.CNL) return {
        type: "cursor",
        action: {
            type: "nextLine",
            count: _
        }
    };
    if (K === B$.CPL) return {
        type: "cursor",
        action: {
            type: "prevLine",
            count: _
        }
    };
    if (K === B$.CHA) return {
        type: "cursor",
        action: {
            type: "column",
            col: _
        }
    };
    if (K === B$.CUP || K === B$.HVP) return {
        type: "cursor",
        action: {
            type: "position",
            row: _,
            col: J
        }
    };
    if (K === B$.VPA) return {
        type: "cursor",
        action: {
            type: "row",
            row: _
        }
    };
    if (K === B$.ED) return {
        type: "erase",
        action: {
            type: "display",
            region: $A7[O[0] ?? 0] ?? "toEnd"
        }
    };
    if (K === B$.EL) return {
        type: "erase",
        action: {
            type: "line",
            region: OA7[O[0] ?? 0] ?? "toEnd"
        }
    };
    if (K === B$.ECH) return {
        type: "erase",
        action: {
            type: "chars",
            count: _
        }
    };
    if (K === B$.SU) return {
        type: "scroll",
        action: {
            type: "up",
            count: _
        }
    };
    if (K === B$.SD) return {
        type: "scroll",
        action: {
            type: "down",
            count: _
        }
    };
    if (K === B$.DECSTBM) return {
        type: "scroll",
        action: {
            type: "setRegion",
            top: _,
            bottom: J
        }
    };
    if (K === B$.SCOSC) return {
        type: "cursor",
        action: {
            type: "save"
        }
    };
    if (K === B$.SCORC) return {
        type: "cursor",
        action: {
            type: "restore"
        }
    };
    if (K === B$.DECSCUSR && H === " ") return {
        type: "cursor",
        action: {
            type: "style",
            ...S4A[_] ?? S4A[0]
        }
    };
    if (z === "?" && (K === B$.SM || K === B$.RM)) {
        let X = K === B$.SM;
        if (_ === GM.CURSOR_VISIBLE) return {
            type: "cursor",
            action: X ? {
                type: "show"
            } : {
                type: "hide"
            }
        };
        if (_ === GM.ALT_SCREEN_CLEAR || _ === GM.ALT_SCREEN) return {
            type: "mode",
            action: {
                type: "alternateScreen",
                enabled: X
            }
        };
        if (_ === GM.BRACKETED_PASTE) return {
            type: "mode",
            action: {
                type: "bracketedPaste",
                enabled: X
            }
        };
        if (_ === GM.MOUSE_NORMAL) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: X ? "normal" : "off"
            }
        };
        if (_ === GM.MOUSE_BUTTON) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: X ? "button" : "off"
            }
        };
        if (_ === GM.MOUSE_ANY) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: X ? "any" : "off"
            }
        };
        if (_ === GM.FOCUS_EVENTS) return {
            type: "mode",
            action: {
                type: "focusEvents",
                enabled: X
            }
        }
    }
    return {
        type: "unknown",
        sequence: A
    }
}
// @from(Ln 197203, Col 0)
function vK9(A) {
    if (A.length < 2) return "unknown";
    if (A.charCodeAt(0) !== ju.ESC) return "unknown";
    let q = A.charCodeAt(1);
    if (q === 91) return "csi";
    if (q === 93) return "osc";
    if (q === 79) return "ss3";
    return "esc"
}
// @from(Ln 197212, Col 0)
class y26 {
    tokenizer = AJ1();
    style = ND1();
    inLink = !1;
    linkUrl;
    reset() {
        this.tokenizer.reset(), this.style = ND1(), this.inLink = !1, this.linkUrl = void 0
    }
    feed(A) {
        let q = this.tokenizer.feed(A),
            K = [];
        for (let Y of q) {
            let z = this.processToken(Y);
            K.push(...z)
        }
        return K
    }
    processToken(A) {
        switch (A.type) {
            case "text":
                return this.processText(A.value);
            case "sequence":
                return this.processSequence(A.value)
        }
    }
    processText(A) {
        let q = [],
            K = "";
        for (let Y of A)
            if (Y.charCodeAt(0) === ju.BEL) {
                if (K) {
                    let z = [...pv7(K)];
                    if (z.length > 0) q.push({
                        type: "text",
                        graphemes: z,
                        style: {
                            ...this.style
                        }
                    });
                    K = ""
                }
                q.push({
                    type: "bell"
                })
            } else K += Y;
        if (K) {
            let Y = [...pv7(K)];
            if (Y.length > 0) q.push({
                type: "text",
                graphemes: Y,
                style: {
                    ...this.style
                }
            })
        }
        return q
    }
    processSequence(A) {
        switch (vK9(A)) {
            case "csi": {
                let K = TK9(A);
                if (!K) return [];
                if (K.type === "sgr") return this.style = gv7(K.params, this.style), [];
                return [K]
            }
            case "osc": {
                let K = A.slice(2);
                if (K.endsWith("\x07")) K = K.slice(0, -1);
                else if (K.endsWith("\x1B\\")) K = K.slice(0, -2);
                let Y = fv7(K);
                if (Y) {
                    if (Y.type === "link")
                        if (Y.action.type === "start") this.inLink = !0, this.linkUrl = Y.action.url;
                        else this.inLink = !1, this.linkUrl = void 0;
                    return [Y]
                }
                return []
            }
            case "esc": {
                let K = A.slice(1),
                    Y = Qv7(K);
                return Y ? [Y] : []
            }
            case "ss3":
                return [{
                    type: "unknown",
                    sequence: A
                }];
            default:
                return [{
                    type: "unknown",
                    sequence: A
                }]
        }
    }
}
// @from(Ln 197308, Col 4)
dv7 = v(() => {
    j71();
    Mu();
    v71();
    ZD1();
    Uv7();
    fK6();
    OS()
})
// @from(Ln 197317, Col 4)
cv7 = v(() => {
    dv7()
})
// @from(Ln 197321, Col 0)
function EK9(A) {
    let K = new y26().feed(A),
        Y = [],
        z;
    for (let w of K) {
        if (w.type === "link") {
            if (w.action.type === "start") z = w.action.url;
            else z = void 0;
            continue
        }
        if (w.type === "text") {
            let H = w.graphemes.map((_) => _.value).join("");
            if (!H) continue;
            let $ = kK9(w.style);
            if (z) $.hyperlink = z;
            let O = Y[Y.length - 1];
            if (O && RK9(O.props, $)) O.text += H;
            else Y.push({
                text: H,
                props: $
            })
        }
    }
    return Y
}
// @from(Ln 197347, Col 0)
function kK9(A) {
    let q = {};
    if (A.bold) q.bold = !0;
    if (A.dim) q.dim = !0;
    if (A.italic) q.italic = !0;
    if (A.underline !== "none") q.underline = !0;
    if (A.strikethrough) q.strikethrough = !0;
    if (A.inverse) q.inverse = !0;
    let K = lv7(A.fg);
    if (K) q.color = K;
    let Y = lv7(A.bg);
    if (Y) q.backgroundColor = Y;
    return q
}
// @from(Ln 197362, Col 0)
function lv7(A) {
    switch (A.type) {
        case "named":
            return LK9[A.name];
        case "indexed":
            return `ansi256(${A.index})`;
        case "rgb":
            return `rgb(${A.r},${A.g},${A.b})`;
        case "default":
            return
    }
}
// @from(Ln 197375, Col 0)
function RK9(A, q) {
    return A.color === q.color && A.backgroundColor === q.backgroundColor && A.bold === q.bold && A.dim === q.dim && A.italic === q.italic && A.underline === q.underline && A.strikethrough === q.strikethrough && A.inverse === q.inverse && A.hyperlink === q.hyperlink
}
// @from(Ln 197379, Col 0)
function iv7(A) {
    let q = e(14),
        K, Y, z, w;
    if (q[0] !== A)({
        bold: K,
        dim: z,
        children: Y,
        ...w
    } = A), q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = w;
    else K = q[1], Y = q[2], z = q[3], w = q[4];
    if (z) {
        let $;
        if (q[5] !== Y || q[6] !== w) $ = JZ.default.createElement(E_, {
            ...w,
            dim: !0
        }, Y), q[5] = Y, q[6] = w, q[7] = $;
        else $ = q[7];
        return $
    }
    if (K) {
        let $;
        if (q[8] !== Y || q[9] !== w) $ = JZ.default.createElement(E_, {
            ...w,
            bold: !0
        }, Y), q[8] = Y, q[9] = w, q[10] = $;
        else $ = q[10];
        return $
    }
    let H;
    if (q[11] !== Y || q[12] !== w) H = JZ.default.createElement(E_, {
        ...w
    }, Y), q[11] = Y, q[12] = w, q[13] = H;
    else H = q[13];
    return H
}
// @from(Ln 197414, Col 4)
JZ
// @from(Ln 197414, Col 8)
W3
// @from(Ln 197414, Col 12)
LK9
// @from(Ln 197415, Col 4)
nv7 = v(() => {
    i1();
    PJ1();
    VD1();
    cv7();
    JZ = o(X1(), 1), W3 = JZ.default.memo(function(q) {
        let K = e(12),
            {
                children: Y,
                dimColor: z
            } = q;
        if (typeof Y !== "string") {
            let _;
            if (K[0] !== Y || K[1] !== z) _ = z ? JZ.default.createElement(E_, {
                dim: !0
            }, String(Y)) : JZ.default.createElement(E_, null, String(Y)), K[0] = Y, K[1] = z, K[2] = _;
            else _ = K[2];
            return _
        }
        if (Y === "") return null;
        let w, H;
        if (K[3] !== Y || K[4] !== z) {
            H = Symbol.for("react.early_return_sentinel");
            A: {
                let _ = EK9(Y);
                if (_.length === 0) {
                    H = null;
                    break A
                }
                if (_.length === 1 && Object.keys(_[0].props).length === 0) {
                    H = z ? JZ.default.createElement(E_, {
                        dim: !0
                    }, _[0].text) : JZ.default.createElement(E_, null, _[0].text);
                    break A
                }
                let J;
                if (K[7] !== z) J = (X, D) => {
                    let {
                        hyperlink: j,
                        ...M
                    } = X.props;
                    if (z) M.dim = !0;
                    let P = Object.keys(M).length > 0;
                    if (j) return P ? JZ.default.createElement(d7, {
                        key: D,
                        url: j
                    }, JZ.default.createElement(iv7, {
                        ...M
                    }, X.text)) : JZ.default.createElement(d7, {
                        key: D,
                        url: j
                    }, X.text);
                    return P ? JZ.default.createElement(iv7, {
                        key: D,
                        ...M
                    }, X.text) : X.text
                },
                K[7] = z,
                K[8] = J;
                else J = K[8];w = _.map(J)
            }
            K[3] = Y, K[4] = z, K[5] = w, K[6] = H
        } else w = K[5], H = K[6];
        if (H !== Symbol.for("react.early_return_sentinel")) return H;
        let $ = w,
            O;
        if (K[9] !== $ || K[10] !== z) O = z ? JZ.default.createElement(E_, {
            dim: !0
        }, $) : JZ.default.createElement(E_, null, $), K[9] = $, K[10] = z, K[11] = O;
        else O = K[11];
        return O
    });
    LK9 = {
        black: "ansi:black",
        red: "ansi:red",
        green: "ansi:green",
        yellow: "ansi:yellow",
        blue: "ansi:blue",
        magenta: "ansi:magenta",
        cyan: "ansi:cyan",
        white: "ansi:white",
        brightBlack: "ansi:blackBright",
        brightRed: "ansi:redBright",
        brightGreen: "ansi:greenBright",
        brightYellow: "ansi:yellowBright",
        brightBlue: "ansi:blueBright",
        brightMagenta: "ansi:magentaBright",
        brightCyan: "ansi:cyanBright",
        brightWhite: "ansi:whiteBright"
    }
})
// @from(Ln 197507, Col 0)
function LX(A) {
    let q = e(4),
        {
            count: K
        } = A,
        Y = K === void 0 ? 1 : K,
        z;
    if (q[0] !== Y) z = `
`.repeat(Y), q[0] = Y, q[1] = z;
    else z = q[1];
    let w;
    if (q[2] !== z) w = rv7.default.createElement("ink-text", null, z), q[2] = z, q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 197522, Col 4)
rv7
// @from(Ln 197523, Col 4)
ov7 = v(() => {
    i1();
    rv7 = o(X1(), 1)
})
// @from(Ln 197528, Col 0)
function P$A() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = av7.default.createElement(PW, {
        flexGrow: 1
    }), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 197537, Col 4)
av7
// @from(Ln 197538, Col 4)
sv7 = v(() => {
    i1();
    QC1();
    av7 = o(X1(), 1)
})
// @from(Ln 197543, Col 4)
tv7
// @from(Ln 197543, Col 9)
yK9 = () => tv7.useContext(QK6)
// @from(Ln 197544, Col 4)
bo
// @from(Ln 197545, Col 4)
C26 = v(() => {
    ZqA();
    tv7 = o(X1(), 1), bo = yK9
})
// @from(Ln 197549, Col 4)
KE7 = R((hs2, qE7) => {
    var CK9 = "Expected a function",
        ev7 = NaN,
        SK9 = "[object Symbol]",
        hK9 = /^\s+|\s+$/g,
        IK9 = /^[-+]0x[0-9a-f]+$/i,
        xK9 = /^0b[01]+$/i,
        bK9 = /^0o[0-7]+$/i,
        uK9 = parseInt,
        BK9 = typeof global == "object" && global && global.Object === Object && global,
        mK9 = typeof self == "object" && self && self.Object === Object && self,
        FK9 = BK9 || mK9 || Function("return this")(),
        QK9 = Object.prototype,
        gK9 = QK9.toString,
        UK9 = Math.max,
        pK9 = Math.min,
        W$A = function() {
            return FK9.Date.now()
        };

    function dK9(A, q, K) {
        var Y, z, w, H, $, O, _ = 0,
            J = !1,
            X = !1,
            D = !0;
        if (typeof A != "function") throw TypeError(CK9);
        if (q = AE7(q) || 0, G$A(K)) J = !!K.leading, X = "maxWait" in K, w = X ? UK9(AE7(K.maxWait) || 0, q) : w, D = "trailing" in K ? !!K.trailing : D;

        function j(k) {
            var y = Y,
                B = z;
            return Y = z = void 0, _ = k, H = A.apply(B, y), H
        }

        function M(k) {
            return _ = k, $ = setTimeout(G, q), J ? j(k) : H
        }

        function P(k) {
            var y = k - O,
                B = k - _,
                S = q - y;
            return X ? pK9(S, w - B) : S
        }

        function W(k) {
            var y = k - O,
                B = k - _;
            return O === void 0 || y >= q || y < 0 || X && B >= w
        }

        function G() {
            var k = W$A();
            if (W(k)) return f(k);
            $ = setTimeout(G, P(k))
        }

        function f(k) {
            if ($ = void 0, D && Y) return j(k);
            return Y = z = void 0, H
        }

        function Z() {
            if ($ !== void 0) clearTimeout($);
            _ = 0, Y = O = z = $ = void 0
        }

        function N() {
            return $ === void 0 ? H : f(W$A())
        }

        function T() {
            var k = W$A(),
                y = W(k);
            if (Y = arguments, z = this, O = k, y) {
                if ($ === void 0) return M(O);
                if (X) return $ = setTimeout(G, q), j(O)
            }
            if ($ === void 0) $ = setTimeout(G, q);
            return H
        }
        return T.cancel = Z, T.flush = N, T
    }

    function G$A(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function cK9(A) {
        return !!A && typeof A == "object"
    }

    function lK9(A) {
        return typeof A == "symbol" || cK9(A) && gK9.call(A) == SK9
    }

    function AE7(A) {
        if (typeof A == "number") return A;
        if (lK9(A)) return ev7;
        if (G$A(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = G$A(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(hK9, "");
        var K = xK9.test(A);
        return K || bK9.test(A) ? uK9(A.slice(2), K ? 2 : 8) : IK9.test(A) ? ev7 : +A
    }
    qE7.exports = dK9
})
// @from(Ln 197661, Col 0)
function RX(A, q) {
    let K = yM.useRef(A);
    YE7(() => {
        K.current = A
    }, [A]), yM.useEffect(() => {
        if (q === null) return;
        let Y = setInterval(() => {
            K.current()
        }, q);
        return () => {
            clearInterval(Y)
        }
    }, [q])
}
// @from(Ln 197676, Col 0)
function zE7(A) {
    let q = yM.useRef(() => {
        throw Error("Cannot call an event handler while rendering.")
    });
    return YE7(() => {
        q.current = A
    }, [A]), yM.useCallback((...K) => {
        var Y;
        return (Y = q.current) == null ? void 0 : Y.call(q, ...K)
    }, [q])
}
// @from(Ln 197688, Col 0)
function iK9(A) {
    let q = yM.useRef(A);
    q.current = A, yM.useEffect(() => () => {
        q.current()
    }, [])
}
// @from(Ln 197695, Col 0)
function TD1(A, q = 500, K) {
    let Y = yM.useRef();
    iK9(() => {
        if (Y.current) Y.current.cancel()
    });
    let z = yM.useMemo(() => {
        let w = Z$A.default(A, q, K),
            H = (...$) => {
                return w(...$)
            };
        return H.cancel = () => {
            w.cancel()
        }, H.isPending = () => {
            return !!Y.current
        }, H.flush = () => {
            return w.flush()
        }, H
    }, [A, q, K]);
    return yM.useEffect(() => {
        Y.current = Z$A.default(A, q, K)
    }, [A, q, K]), z
}
// @from(Ln 197717, Col 4)
yM
// @from(Ln 197717, Col 8)
Z$A
// @from(Ln 197717, Col 13)
YE7
// @from(Ln 197718, Col 4)
XZ = v(() => {
    yM = o(X1(), 1), Z$A = o(KE7(), 1), YE7 = typeof window < "u" ? yM.useLayoutEffect : yM.useEffect
})
// @from(Ln 197721, Col 4)
S26
// @from(Ln 197721, Col 9)
nK9 = (A, q = {}) => {
        let {
            setRawMode: K,
            internal_exitOnCtrlC: Y,
            internal_eventEmitter: z
        } = bo(), w = zE7(A);
        S26.useLayoutEffect(() => {
            if (q.isActive === !1) return;
            return K(!0), () => {
                K(!1)
            }
        }, [q.isActive, K]), S26.useEffect(() => {
            if (q.isActive === !1) return;
            let H = ($) => {
                let {
                    input: O,
                    key: _
                } = $;
                if (!(O === "c" && _.ctrl) || !Y) w(O, _, $)
            };
            return z?.on("input", H), () => {
                z?.removeListener("input", H)
            }
        }, [q.isActive, Y, z, w])
    }
// @from(Ln 197746, Col 4)
D8
// @from(Ln 197747, Col 4)
wE7 = v(() => {
    C26();
    XZ();
    S26 = o(X1(), 1), D8 = nK9
})
// @from(Ln 197752, Col 4)
HE7
// @from(Ln 197752, Col 9)
rK9 = () => HE7.useContext(FK6)
// @from(Ln 197753, Col 4)
vD1
// @from(Ln 197754, Col 4)
f$A = v(() => {
    GqA();
    HE7 = o(X1(), 1), vD1 = rK9
})
// @from(Ln 197758, Col 4)
iU
// @from(Ln 197758, Col 8)
oK9 = ({
        isActive: A = !0,
        autoFocus: q = !1,
        id: K
    } = {}) => {
        let {
            isRawModeSupported: Y,
            setRawMode: z
        } = bo(), {
            activeId: w,
            add: H,
            remove: $,
            activate: O,
            deactivate: _,
            focus: J
        } = iU.useContext(jJ1), X = iU.useMemo(() => {
            return K ?? Math.random().toString().slice(2, 7)
        }, [K]);
        return iU.useEffect(() => {
            return H(X, {
                autoFocus: q
            }), () => {
                $(X)
            }
        }, [X, q]), iU.useEffect(() => {
            if (A) O(X);
            else _(X)
        }, [A, X]), iU.useLayoutEffect(() => {
            if (!Y || !A) return;
            return z(!0), () => {
                z(!1)
            }
        }, [A]), {
            isFocused: Boolean(X) && w === X,
            focus: J
        }
    }
// @from(Ln 197795, Col 4)
$E7
// @from(Ln 197796, Col 4)
OE7 = v(() => {
    gK6();
    C26();
    iU = o(X1(), 1), $E7 = oK9
})
// @from(Ln 197801, Col 4)
_E7
// @from(Ln 197801, Col 9)
aK9 = () => {
        let A = _E7.useContext(jJ1);
        return {
            enableFocus: A.enableFocus,
            disableFocus: A.disableFocus,
            focusNext: A.focusNext,
            focusPrevious: A.focusPrevious,
            focus: A.focus
        }
    }
// @from(Ln 197811, Col 4)
JE7
// @from(Ln 197812, Col 4)
XE7 = v(() => {
    gK6();
    _E7 = o(X1(), 1), JE7 = aK9
})
// @from(Ln 197816, Col 4)
sK9 = (A) => ({
        width: A.yogaNode?.getComputedWidth() ?? 0,
        height: A.yogaNode?.getComputedHeight() ?? 0
    })
// @from(Ln 197820, Col 4)
ED1
// @from(Ln 197821, Col 4)
DE7 = v(() => {
    ED1 = sK9
})
// @from(Ln 197825, Col 0)
function wB() {
    let A = zB.useContext(fJ1),
        q = zB.useRef(null),
        K = zB.useRef([]),
        Y = zB.useRef({
            isVisible: !0
        }),
        z = zB.useCallback((w) => {
            if (q.current = w, w?.yogaNode) {
                let H = [],
                    $ = w.yogaNode.getParent();
                while ($) H.push($), $ = $.getParent();
                K.current = H
            } else K.current = []
        }, []);
    return zB.useLayoutEffect(() => {
        let w = q.current,
            H = K.current;
        if (!w?.yogaNode || !A) return;
        let $ = w.yogaNode.getComputedHeight(),
            O = A.rows,
            _ = w.yogaNode.getComputedTop();
        for (let W = 0; W < H.length; W++) _ += H[W].getComputedTop();
        let X = H[H.length - 1]?.getComputedHeight() ?? 0,
            D = _ + $,
            j = Math.max(0, X - O),
            M = j + O,
            P = D > j && _ < M;
        if (P !== Y.current.isVisible) Y.current = {
            isVisible: P
        }
    }), [z, Y.current]
}
// @from(Ln 197858, Col 4)
zB
// @from(Ln 197859, Col 4)
h26 = v(() => {
    iK6();
    zB = o(X1(), 1)
})
// @from(Ln 197864, Col 0)
function Nv(A = 16) {
    let q = kD1.useContext(GJ1),
        [K, {
            isVisible: Y
        }] = wB(),
        [z, w] = kD1.useState(() => q?.now() ?? 0),
        H = Y && A !== null;
    return kD1.useEffect(() => {
        if (!q || !H) return;
        let $ = q.now(),
            O = () => {
                let _ = q.now();
                if (_ - $ >= A) $ = _, w(_)
            };
        return q.subscribe(O, !0)
    }, [q, A, H]), [K, z]
}
// @from(Ln 197881, Col 4)
kD1
// @from(Ln 197882, Col 4)
jE7 = v(() => {
    lK6();
    h26();
    kD1 = o(X1(), 1)
})
// @from(Ln 197888, Col 0)
function ME7(A) {
    let q = HB.useContext(GJ1),
        [K, Y] = HB.useState(() => q?.now() ?? 0);
    return HB.useEffect(() => {
        if (!q) return;
        let z = q.now(),
            w = () => {
                let H = q.now();
                if (H - z >= A) z = H, Y(H)
            };
        return q.subscribe(w, !1)
    }, [q, A]), K
}
// @from(Ln 197902, Col 0)
function V$A(A, q) {
    let K = HB.useRef(A);
    K.current = A;
    let Y = HB.useContext(GJ1);
    HB.useEffect(() => {
        if (!Y || q === null) return;
        let z = Y.now(),
            w = () => {
                let H = Y.now();
                if (H - z >= q) z = H, K.current()
            };
        return Y.subscribe(w, !1)
    }, [Y, q])
}
// @from(Ln 197916, Col 4)
HB
// @from(Ln 197917, Col 4)
PE7 = v(() => {
    lK6();
    HB = o(X1(), 1)
})
// @from(Ln 197921, Col 4)
WE7 = {}
// @from(Ln 197954, Col 4)
m1 = v(() => {
    yv7();
    QC1();
    Sv7();
    PJ1();
    UC1();
    nv7();
    VD1();
    ov7();
    sv7();
    wE7();
    f$A();
    C26();
    OE7();
    XE7();
    DE7();
    gC1();
    Tr();
    PK6();
    CqA();
    SqA();
    mK6();
    h26();
    RqA();
    jE7();
    PE7()
})
// @from(Ln 197982, Col 0)
function iS(A, q, K) {
    let Y = uo.useRef(0),
        z = uo.useRef(void 0),
        w = uo.useCallback(() => {
            if (z.current) clearTimeout(z.current), z.current = void 0
        }, []);
    return uo.useEffect(() => {
        return () => {
            w()
        }
    }, [w]), uo.useCallback(() => {
        let H = Date.now();
        if (H - Y.current <= GE7 && z.current !== void 0) w(), A(!1), q();
        else K?.(), A(!0), w(), z.current = setTimeout(() => {
            A(!1), z.current = void 0
        }, GE7);
        Y.current = H
    }, [A, q, K, w])
}
// @from(Ln 198001, Col 4)
uo
// @from(Ln 198001, Col 8)
GE7 = 800
// @from(Ln 198002, Col 4)
fx1 = v(() => {
    uo = o(X1(), 1)
})
// @from(Ln 198006, Col 0)
function ZE7(A, q, K) {
    let {
        exit: Y
    } = vD1(), [z, w] = Bo.useState({
        pending: !1,
        keyName: null
    }), H = Bo.useMemo(() => K ?? Y, [K, Y]), $ = iS((D) => w({
        pending: D,
        keyName: "Ctrl-C"
    }), H), O = iS((D) => w({
        pending: D,
        keyName: "Ctrl-D"
    }), H), _ = Bo.useCallback(() => {
        if (q?.()) return;
        $()
    }, [$, q]), J = Bo.useCallback(() => {
        O()
    }, [O]), X = Bo.useMemo(() => ({
        "app:interrupt": _,
        "app:exit": J
    }), [_, J]);
    return A(X, {
        context: "Global"
    }), z
}
// @from(Ln 198031, Col 4)
Bo
// @from(Ln 198032, Col 4)
fE7 = v(() => {
    fx1();
    f$A();
    Bo = o(X1(), 1)
})
// @from(Ln 198038, Col 0)
function DA(A, q, K = {}) {
    let {
        context: Y = "Global",
        isActive: z = !0
    } = K, w = VL();
    LD1.useEffect(() => {
        if (!w || !z) return;
        return w.registerHandler({
            action: A,
            context: Y,
            handler: q
        })
    }, [A, Y, q, w, z]);
    let H = LD1.useCallback(($, O, _) => {
        if (!w) return;
        let J = [...w.activeContexts, Y, "Global"],
            X = [...new Set(J)],
            D = w.resolve($, O, X);
        switch (D.type) {
            case "match":
                if (w.setPendingChord(null), D.action === A) q(), _.stopImmediatePropagation();
                break;
            case "chord_started":
                w.setPendingChord(D.pending), _.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                w.setPendingChord(null);
                break;
            case "unbound":
                w.setPendingChord(null), _.stopImmediatePropagation();
                break;
            case "none":
                break
        }
    }, [A, Y, q, w]);
    D8(H, {
        isActive: z
    })
}
// @from(Ln 198078, Col 0)
function c7(A, q = {}) {
    let {
        context: K = "Global",
        isActive: Y = !0
    } = q, z = VL();
    LD1.useEffect(() => {
        if (!z || !Y) return;
        let H = [];
        for (let [$, O] of Object.entries(A)) H.push(z.registerHandler({
            action: $,
            context: K,
            handler: O
        }));
        return () => {
            for (let $ of H) $()
        }
    }, [K, A, z, Y]);
    let w = LD1.useCallback((H, $, O) => {
        if (!z) return;
        let _ = [...z.activeContexts, K, "Global"],
            J = [...new Set(_)],
            X = z.resolve(H, $, J);
        switch (X.type) {
            case "match":
                if (z.setPendingChord(null), X.action in A) {
                    let D = A[X.action];
                    if (D) D(), O.stopImmediatePropagation()
                }
                break;
            case "chord_started":
                z.setPendingChord(X.pending), O.stopImmediatePropagation();
                break;
            case "chord_cancelled":
                z.setPendingChord(null);
                break;
            case "unbound":
                z.setPendingChord(null), O.stopImmediatePropagation();
                break;
            case "none":
                break
        }
    }, [K, A, z]);
    D8(w, {
        isActive: Y
    })
}
// @from(Ln 198124, Col 4)
LD1
// @from(Ln 198125, Col 4)
K7 = v(() => {
    m1();
    eg();
    LD1 = o(X1(), 1)
})
// @from(Ln 198131, Col 0)
function uq(A, q) {
    return ZE7(c7, q, A)
}
// @from(Ln 198134, Col 4)
R2 = v(() => {
    fE7();
    K7()
})
// @from(Ln 198139, Col 0)
function rU(A, q = "append") {
    if (A.length > 0) {
        if (N$A && iL.length > 0)
            if (q === "prepend") iL[0] = A + iL[0];
            else iL[0] = iL[0] + A;
        else if (iL.unshift(A), iL.length > tK9) iL.pop();
        N$A = !0, b26 = !1
    }
}
// @from(Ln 198149, Col 0)
function u26() {
    return iL[0] ?? ""
}
// @from(Ln 198153, Col 0)
function Nx1() {
    N$A = !1
}
// @from(Ln 198157, Col 0)
function B26(A, q) {
    VE7 = A, T$A = q, b26 = !0, I26 = 0
}
// @from(Ln 198161, Col 0)
function m26() {
    if (!b26 || iL.length <= 1) return null;
    return I26 = (I26 + 1) % iL.length, {
        text: iL[I26] ?? "",
        start: VE7,
        length: T$A
    }
}
// @from(Ln 198170, Col 0)
function F26(A) {
    T$A = A
}
// @from(Ln 198174, Col 0)
function Tx1() {
    b26 = !1
}
// @from(Ln 198177, Col 0)
class z3 {
    measuredText;
    selection;
    offset;
    constructor(A, q = 0, K = 0) {
        this.measuredText = A;
        this.selection = K;
        this.offset = Math.max(0, Math.min(this.text.length, q))
    }
    static fromText(A, q, K = 0, Y = 0) {
        return new z3(new NE7(A, q - 1), K, Y)
    }
    render(A, q, K, Y) {
        let {
            line: z,
            column: w
        } = this.getPosition();
        return this.measuredText.getWrappedText().map((H, $, O) => {
            let _ = H;
            if (q && $ === O.length - 1) {
                let G = Array.from(T_().segment(H)),
                    f = Math.min(6, G.length),
                    Z = G.length - f,
                    N = G.length > f ? G[Z].index : 0;
                _ = q.repeat(Z) + H.slice(N)
            }
            if (z !== $) return _.trimEnd();
            let J = this.measuredText.displayWidthToStringIndex(_, w),
                X = Array.from(T_().segment(_)).map(({
                    segment: G,
                    index: f
                }) => ({
                    segment: G,
                    index: f
                })),
                D = "",
                j = A,
                M = "";
            for (let {
                    segment: G,
                    index: f
                }
                of X) {
                let Z = f + G.length;
                if (Z <= J) D += G;
                else if (f < J && Z > J) j = G;
                else if (f === J) j = G;
                else M += G
            }
            let P, W = "";
            if (Y && $ === O.length - 1 && this.isAtEnd() && Y.text.length > 0) {
                let G = OC1(Y.text) || Y.text[0];
                P = A ? K(G) : G;
                let f = Y.text.slice(G.length);
                if (f.length > 0) W = Y.dim(f)
            } else P = A ? K(j) : j;
            return D + P + W + M.trimEnd()
        }).join(`
`)
    }
    left() {
        if (this.offset === 0) return this;
        let A = this.measuredText.prevOffset(this.offset);
        return new z3(this.measuredText, A)
    }
    right() {
        if (this.offset >= this.text.length) return this;
        let A = this.measuredText.nextOffset(this.offset);
        return new z3(this.measuredText, Math.min(A, this.text.length))
    }
    up() {
        let {
            line: A,
            column: q
        } = this.getPosition();
        if (A === 0) return this;
        let K = this.measuredText.getWrappedText()[A - 1];
        if (!K) return this;
        let Y = UA(K);
        if (q > Y) {
            let w = this.getOffset({
                line: A - 1,
                column: Y
            });
            return new z3(this.measuredText, w, 0)
        }
        let z = this.getOffset({
            line: A - 1,
            column: q
        });
        return new z3(this.measuredText, z, 0)
    }
    down() {
        let {
            line: A,
            column: q
        } = this.getPosition();
        if (A >= this.measuredText.lineCount - 1) return this;
        let K = this.measuredText.getWrappedText()[A + 1];
        if (!K) return this;
        let Y = UA(K);
        if (q > Y) {
            let w = this.getOffset({
                line: A + 1,
                column: Y
            });
            return new z3(this.measuredText, w, 0)
        }
        let z = this.getOffset({
            line: A + 1,
            column: q
        });
        return new z3(this.measuredText, z, 0)
    }
    startOfCurrentLine() {
        let {
            line: A
        } = this.getPosition();
        return new z3(this.measuredText, this.getOffset({
            line: A,
            column: 0
        }), 0)
    }
    startOfLine() {
        let {
            line: A,
            column: q
        } = this.getPosition();
        if (q === 0 && A > 0) return new z3(this.measuredText, this.getOffset({
            line: A - 1,
            column: 0
        }), 0);
        return this.startOfCurrentLine()
    }
    firstNonBlankInLine() {
        let {
            line: A
        } = this.getPosition(), K = (this.measuredText.getWrappedText()[A] || "").match(/^\s*\S/), Y = K?.index ? K.index + K[0].length - 1 : 0, z = this.getOffset({
            line: A,
            column: Y
        });
        return new z3(this.measuredText, z, 0)
    }
    endOfLine() {
        let {
            line: A
        } = this.getPosition(), q = this.measuredText.getLineLength(A), K = this.getOffset({
            line: A,
            column: q
        });
        return new z3(this.measuredText, K, 0)
    }
    findLogicalLineStart(A = this.offset) {
        let q = this.text.lastIndexOf(`
`, A - 1);
        return q === -1 ? 0 : q + 1
    }
    findLogicalLineEnd(A = this.offset) {
        let q = this.text.indexOf(`
`, A);
        return q === -1 ? this.text.length : q
    }
    getLogicalLineBounds() {
        return {
            start: this.findLogicalLineStart(),
            end: this.findLogicalLineEnd()
        }
    }
    createCursorWithColumn(A, q, K) {
        let Y = q - A,
            z = Math.min(K, Y),
            w = A + z,
            H = this.measuredText.snapToGraphemeBoundary(w);
        return new z3(this.measuredText, H, 0)
    }
    endOfLogicalLine() {
        return new z3(this.measuredText, this.findLogicalLineEnd(), 0)
    }
    startOfLogicalLine() {
        return new z3(this.measuredText, this.findLogicalLineStart(), 0)
    }
    firstNonBlankInLogicalLine() {
        let {
            start: A,
            end: q
        } = this.getLogicalLineBounds(), Y = this.text.slice(A, q).match(/\S/), z = A + (Y?.index ?? 0);
        return new z3(this.measuredText, z, 0)
    }
    upLogicalLine() {
        let {
            start: A
        } = this.getLogicalLineBounds();
        if (A === 0) return new z3(this.measuredText, 0, 0);
        let q = this.offset - A,
            K = A - 1,
            Y = this.findLogicalLineStart(K);
        return this.createCursorWithColumn(Y, K, q)
    }
    downLogicalLine() {
        let {
            start: A,
            end: q
        } = this.getLogicalLineBounds();
        if (q >= this.text.length) return new z3(this.measuredText, this.text.length, 0);
        let K = this.offset - A,
            Y = q + 1,
            z = this.findLogicalLineEnd(Y);
        return this.createCursorWithColumn(Y, z, K)
    }
    nextWord() {
        if (this.isAtEnd()) return this;
        let A = this.measuredText.getWordBoundaries();
        for (let q of A)
            if (q.isWordLike && q.start > this.offset) return new z3(this.measuredText, q.start);
        return new z3(this.measuredText, this.text.length)
    }
    endOfWord() {
        if (this.isAtEnd()) return this;
        let A = this.measuredText.getWordBoundaries();
        for (let q of A) {
            if (!q.isWordLike) continue;
            if (this.offset >= q.start && this.offset < q.end - 1) return new z3(this.measuredText, q.end - 1);
            if (this.offset === q.end - 1) {
                for (let K of A)
                    if (K.isWordLike && K.start > this.offset) return new z3(this.measuredText, K.end - 1);
                return this
            }
        }
        for (let q of A)
            if (q.isWordLike && q.start > this.offset) return new z3(this.measuredText, q.end - 1);
        return this
    }
    prevWord() {
        if (this.isAtStart()) return this;
        let A = this.measuredText.getWordBoundaries(),
            q = null;
        for (let K of A) {
            if (!K.isWordLike) continue;
            if (K.start < this.offset) {
                if (this.offset > K.start && this.offset <= K.end) return new z3(this.measuredText, K.start);
                q = K.start
            }
        }
        if (q !== null) return new z3(this.measuredText, q);
        return new z3(this.measuredText, 0)
    }
    nextVimWord() {
        if (this.isAtEnd()) return this;
        let A = this.offset,
            q = (Y) => this.measuredText.nextOffset(Y),
            K = this.graphemeAt(A);
        if (!K) return this;
        if (nU(K))
            while (A < this.text.length && nU(this.graphemeAt(A))) A = q(A);
        else if (mo(K))
            while (A < this.text.length && mo(this.graphemeAt(A))) A = q(A);
        while (A < this.text.length && Vx1.test(this.graphemeAt(A))) A = q(A);
        return new z3(this.measuredText, A)
    }
    endOfVimWord() {
        if (this.isAtEnd()) return this;
        let A = this.text,
            q = this.offset,
            K = (z) => this.measuredText.nextOffset(z);
        if (this.graphemeAt(q) === "") return this;
        q = K(q);
        while (q < A.length && Vx1.test(this.graphemeAt(q))) q = K(q);
        if (q >= A.length) return new z3(this.measuredText, A.length);
        let Y = this.graphemeAt(q);
        if (nU(Y))
            while (q < A.length) {
                let z = K(q);
                if (z >= A.length || !nU(this.graphemeAt(z))) break;
                q = z
            } else if (mo(Y))
                while (q < A.length) {
                    let z = K(q);
                    if (z >= A.length || !mo(this.graphemeAt(z))) break;
                    q = z
                }
        return new z3(this.measuredText, q)
    }
    prevVimWord() {
        if (this.isAtStart()) return this;
        let A = this.offset,
            q = (Y) => this.measuredText.prevOffset(Y);
        A = q(A);
        while (A > 0 && Vx1.test(this.graphemeAt(A))) A = q(A);
        if (A === 0 && Vx1.test(this.graphemeAt(0))) return new z3(this.measuredText, 0);
        let K = this.graphemeAt(A);
        if (nU(K))
            while (A > 0) {
                let Y = q(A);
                if (!nU(this.graphemeAt(Y))) break;
                A = Y
            } else if (mo(K))
                while (A > 0) {
                    let Y = q(A);
                    if (!mo(this.graphemeAt(Y))) break;
                    A = Y
                }
        return new z3(this.measuredText, A)
    }
    nextWORD() {
        let A = this;
        while (!A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
        while (A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
        return A
    }
    endOfWORD() {
        if (this.isAtEnd()) return this;
        let A = this;
        if (!A.isOverWhitespace() && (A.right().isOverWhitespace() || A.right().isAtEnd())) return A = A.right(), A.endOfWORD();
        if (A.isOverWhitespace()) A = A.nextWORD();
        while (!A.right().isOverWhitespace() && !A.isAtEnd()) A = A.right();
        return A
    }
    prevWORD() {
        let A = this;
        if (A.left().isOverWhitespace()) A = A.left();
        while (A.isOverWhitespace() && !A.isAtStart()) A = A.left();
        if (!A.isOverWhitespace())
            while (!A.left().isOverWhitespace() && !A.isAtStart()) A = A.left();
        return A
    }
    modifyText(A, q = "") {
        let K = this.offset,
            Y = A.offset,
            z = this.text.slice(0, K) + q + this.text.slice(Y);
        return z3.fromText(z, this.columns, K + q.normalize("NFC").length)
    }
    insert(A) {
        return this.modifyText(this, A)
    }
    del() {
        if (this.isAtEnd()) return this;
        return this.modifyText(this.right())
    }
    backspace() {
        if (this.isAtStart()) return this;
        return this.left().modifyText(this)
    }
    deleteToLineStart() {
        let A = this.startOfCurrentLine(),
            q = this.text.slice(A.offset, this.offset);
        return {
            cursor: A.modifyText(this),
            killed: q
        }
    }
    deleteToLineEnd() {
        if (this.text[this.offset] === `
`) return {
            cursor: this.modifyText(this.right()),
            killed: `
`
        };
        let A = this.endOfLine(),
            q = this.text.slice(this.offset, A.offset);
        return {
            cursor: this.modifyText(A),
            killed: q
        }
    }
    deleteToLogicalLineEnd() {
        if (this.text[this.offset] === `
`) return this.modifyText(this.right());
        return this.modifyText(this.endOfLogicalLine())
    }
    deleteWordBefore() {
        if (this.isAtStart()) return {
            cursor: this,
            killed: ""
        };
        let A = this.prevWord(),
            q = this.text.slice(A.offset, this.offset);
        return {
            cursor: A.modifyText(this),
            killed: q
        }
    }
    deleteTokenBefore() {
        if (this.isAtStart()) return null;
        let A = this.text[this.offset];
        if (A !== void 0 && !/\s/.test(A)) return null;
        let K = this.text.slice(0, this.offset).match(/(^|\s)\[(Pasted text #\d+(?: \+\d+ lines)?|\.\.\.Truncated text #\d+ \+\d+ lines\.\.\.)\]$/);
        if (K) {
            let Y = K.index + K[1].length;
            return new z3(this.measuredText, Y).modifyText(this)
        }
        return null
    }
    deleteWordAfter() {
        if (this.isAtEnd()) return this;
        return this.modifyText(this.nextWord())
    }
    graphemeAt(A) {
        if (A >= this.text.length) return "";
        let q = this.measuredText.nextOffset(A);
        return this.text.slice(A, q)
    }
    isOverWhitespace() {
        let A = this.text[this.offset] ?? "";
        return /\s/.test(A)
    }
    equals(A) {
        return this.offset === A.offset && this.measuredText === A.measuredText
    }
    isAtStart() {
        return this.offset === 0
    }
    isAtEnd() {
        return this.offset >= this.text.length
    }
    startOfFirstLine() {
        return new z3(this.measuredText, 0, 0)
    }
    startOfLastLine() {
        let A = this.text.lastIndexOf(`
`);
        if (A === -1) return this.startOfLine();
        return new z3(this.measuredText, A + 1, 0)
    }
    goToLine(A) {
        let q = this.text.split(`
`),
            K = Math.min(Math.max(0, A - 1), q.length - 1),
            Y = 0;
        for (let z = 0; z < K; z++) Y += (q[z]?.length ?? 0) + 1;
        return new z3(this.measuredText, Y, 0)
    }
    endOfFile() {
        return new z3(this.measuredText, this.text.length, 0)
    }
    get text() {
        return this.measuredText.text
    }
    get columns() {
        return this.measuredText.columns + 1
    }
    getPosition() {
        return this.measuredText.getPositionFromOffset(this.offset)
    }
    getOffset(A) {
        return this.measuredText.getOffsetFromPosition(A)
    }
    findCharacter(A, q, K = 1) {
        let Y = this.text,
            z = q === "f" || q === "t",
            w = q === "t" || q === "T",
            H = 0;
        if (z) {
            let $ = this.measuredText.nextOffset(this.offset);
            while ($ < Y.length) {
                if (this.graphemeAt($) === A) {
                    if (H++, H === K) return w ? Math.max(this.offset, this.measuredText.prevOffset($)) : $
                }
                $ = this.measuredText.nextOffset($)
            }
        } else {
            if (this.offset === 0) return null;
            let $ = this.measuredText.prevOffset(this.offset);
            while ($ >= 0) {
                if (this.graphemeAt($) === A) {
                    if (H++, H === K) return w ? Math.min(this.offset, this.measuredText.nextOffset($)) : $
                }
                if ($ === 0) break;
                $ = this.measuredText.prevOffset($)
            }
        }
        return null
    }
}
// @from(Ln 198650, Col 0)
class x26 {
    text;
    startOffset;
    isPrecededByNewline;
    endsWithNewline;
    constructor(A, q, K, Y = !1) {
        this.text = A;
        this.startOffset = q;
        this.isPrecededByNewline = K;
        this.endsWithNewline = Y
    }
    equals(A) {
        return this.text === A.text && this.startOffset === A.startOffset
    }
    get length() {
        return this.text.length + (this.endsWithNewline ? 1 : 0)
    }
}