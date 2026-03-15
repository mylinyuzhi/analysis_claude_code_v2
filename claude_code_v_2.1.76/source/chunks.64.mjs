
// @from(Ln 160290, Col 0)
class Gj8 {
    stdout;
    pending = [];
    sentinels = [];
    constructor(A) {
        this.stdout = A
    }
    send(A) {
        return new Promise((q) => {
            this.pending.push({
                match: A.match,
                resolve: (K) => q(K)
            }), this.stdout.write(A.request)
        })
    }
    flush() {
        return new Promise((A) => {
            this.sentinels.push(A), this.stdout.write(Fd3)
        })
    }
    onResponse(A) {
        let q = this.pending.findIndex((K) => K.match(A));
        if (q !== -1) {
            let [K] = this.pending.splice(q, 1);
            K.resolve(A);
            return
        }
        if (A.type === "da1" && this.sentinels.length > 0) {
            for (let K of this.pending.splice(0)) K.resolve(void 0);
            for (let K of this.sentinels.splice(0)) K()
        }
    }
}
// @from(Ln 160323, Col 4)
Fd3
// @from(Ln 160324, Col 4)
Vy7 = E(() => {
    uL();
    vm();
    Fd3 = Uz("c")
})
// @from(Ln 160329, Col 4)
ky7
// @from(Ln 160329, Col 9)
VX6
// @from(Ln 160330, Col 4)
sO1 = E(() => {
    ky7 = t(P6(), 1), VX6 = ky7.createContext(null)
})
// @from(Ln 160333, Col 4)
Ey7 = {}
// @from(Ln 160343, Col 0)
function pd3() {
    if (!process.stdin.isTTY || kX6) return;
    kX6 = !0, mC = "";
    try {
        process.stdin.setEncoding("utf8"), process.stdin.setRawMode(!0), process.stdin.ref(), Iu6 = () => {
            let A = process.stdin.read();
            while (A !== null) {
                if (typeof A === "string") Qd3(A);
                A = process.stdin.read()
            }
        }, process.stdin.on("readable", Iu6)
    } catch {
        kX6 = !1
    }
}
// @from(Ln 160359, Col 0)
function Qd3(A) {
    let q = 0;
    while (q < A.length) {
        let K = A[q],
            Y = K.charCodeAt(0);
        if (Y === 3) {
            $s(), process.exit(130);
            return
        }
        if (Y === 4) {
            $s();
            return
        }
        if (Y === 127 || Y === 8) {
            if (mC.length > 0) {
                let z = lQ(mC);
                mC = mC.slice(0, -(z.length || 1))
            }
            q++;
            continue
        }
        if (Y === 27) {
            q++;
            while (q < A.length && !(A.charCodeAt(q) >= 64 && A.charCodeAt(q) <= 126)) q++;
            if (q < A.length) q++;
            continue
        }
        if (Y < 32 && Y !== 9 && Y !== 10 && Y !== 13) {
            q++;
            continue
        }
        if (Y === 13) {
            mC += `
`, q++;
            continue
        }
        mC += K, q++
    }
}
// @from(Ln 160399, Col 0)
function $s() {
    if (!kX6) return;
    if (kX6 = !1, Iu6) process.stdin.removeListener("readable", Iu6), Iu6 = null
}
// @from(Ln 160404, Col 0)
function fj8() {
    $s();
    let A = mC.trim();
    return mC = "", A
}
// @from(Ln 160410, Col 0)
function Ud3() {
    return mC.trim().length > 0
}
// @from(Ln 160414, Col 0)
function Tj8(A) {
    mC = A
}
// @from(Ln 160418, Col 0)
function dd3() {
    return kX6
}
// @from(Ln 160421, Col 4)
mC = ""
// @from(Ln 160422, Col 4)
kX6 = !1
// @from(Ln 160423, Col 4)
Iu6 = null
// @from(Ln 160424, Col 4)
bu6 = E(() => {
    AL()
})
// @from(Ln 160428, Col 0)
function rd3(A, q, K, Y) {
    if (q.some((z) => z.kind === "key" || z.kind === "mouse")) i86();
    for (let z of q) {
        if (z.kind === "response") {
            A.querier.onResponse(z.response);
            continue
        }
        if (z.kind === "mouse") {
            od3(A, z);
            continue
        }
        let _ = z.sequence;
        if (_ === mV7) {
            A.handleTerminalFocus(!0);
            let O = new NX6("terminalfocus");
            A.internal_eventEmitter.emit("terminalfocus", O);
            continue
        }
        if (_ === BV7) {
            if (A.handleTerminalFocus(!1), A.props.selection.isDragging) oO1(A.props.selection), A.props.onSelectionChange();
            let O = new NX6("terminalblur");
            A.internal_eventEmitter.emit("terminalblur", O);
            continue
        }
        if (!cO1()) wj8(!0);
        if (z.name === "z" && z.ctrl && nd3) {
            A.handleSuspend();
            continue
        }
        A.handleInput(_);
        let w = new Cu6(z);
        A.internal_eventEmitter.emit("input", w)
    }
}
// @from(Ln 160463, Col 0)
function od3(A, q) {
    let K = A.props.selection,
        Y = q.col - 1,
        z = q.row - 1,
        _ = q.button & 3;
    if (q.action === "press") {
        if (_ !== 0) {
            A.clickCount = 0;
            return
        }
        if ((q.button & 32) !== 0) {
            A.props.onSelectionDrag(Y, z);
            return
        }
        let w = Date.now(),
            O = w - A.lastClickTime < Ly7 && Math.abs(Y - A.lastClickCol) <= Ry7 && Math.abs(z - A.lastClickRow) <= Ry7;
        if (A.clickCount = O ? A.clickCount + 1 : 1, A.lastClickTime = w, A.lastClickCol = Y, A.lastClickRow = z, A.clickCount >= 2) {
            if (A.pendingHyperlinkTimer) clearTimeout(A.pendingHyperlinkTimer), A.pendingHyperlinkTimer = null;
            let $ = A.clickCount === 2 ? 2 : 3;
            A.props.onMultiClick(Y, z, $);
            return
        }
        rO1(K, Y, z), A.props.onSelectionChange();
        return
    }
    if (_ !== 0) {
        if (!K.isDragging) return;
        oO1(K), A.props.onSelectionChange();
        return
    }
    if (oO1(K), !Os(K) && K.anchor) {
        if (!A.props.onClickAt(Y, z)) {
            let w = A.props.getHyperlinkAt(Y, z);
            if (w) {
                if (A.pendingHyperlinkTimer) clearTimeout(A.pendingHyperlinkTimer);
                A.pendingHyperlinkTimer = setTimeout((O, $) => {
                    O.pendingHyperlinkTimer = null, O.props.onOpenHyperlink($)
                }, Ly7, A, w)
            }
        }
    }
    A.props.onSelectionChange()
}
// @from(Ln 160506, Col 4)
Nm
// @from(Ln 160506, Col 8)
yy7
// @from(Ln 160506, Col 13)
cd3 = "\t"
// @from(Ln 160507, Col 4)
ld3 = "\x1B[Z"
// @from(Ln 160508, Col 4)
id3 = "\x1B"
// @from(Ln 160509, Col 4)
nd3
// @from(Ln 160509, Col 9)
Ly7 = 500
// @from(Ln 160510, Col 4)
Ry7 = 1
// @from(Ln 160511, Col 4)
tO1
// @from(Ln 160512, Col 4)
hy7 = E(() => {
    pO1();
    Yj8();
    UO1();
    dO1();
    Hj8();
    tE7();
    iO1();
    Dj8();
    aO1();
    Wj8();
    Zj8();
    Vy7();
    jX6();
    sO1();
    fH8();
    GK6();
    uL();
    d3();
    A8();
    lO1();
    T1();
    bu6();
    k1();
    H1();
    Nm = t(P6(), 1), yy7 = ["iTerm.app", "kitty", "WezTerm", "ghostty"], nd3 = process.platform !== "win32";
    tO1 = class tO1 extends Nm.PureComponent {
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
        internal_eventEmitter = new LK6;
        keyParseState = Oy7;
        incompleteEscapeTimer = null;
        NORMAL_TIMEOUT = 50;
        PASTE_TIMEOUT = 500;
        querier = new Gj8(this.props.stdout);
        lastClickTime = 0;
        lastClickCol = -1;
        lastClickRow = -1;
        clickCount = 0;
        pendingHyperlinkTimer = null;
        isRawModeSupported() {
            return this.props.stdin.isTTY
        }
        render() {
            return Nm.default.createElement(VX6.Provider, {
                value: {
                    columns: this.props.terminalColumns,
                    rows: this.props.terminalRows
                }
            }, Nm.default.createElement(QO1.Provider, {
                value: {
                    exit: this.handleExit
                }
            }, Nm.default.createElement(GX6.Provider, {
                value: {
                    stdin: this.props.stdin,
                    setRawMode: this.handleSetRawMode,
                    isRawModeSupported: this.isRawModeSupported(),
                    internal_exitOnCtrlC: this.props.exitOnCtrlC,
                    internal_eventEmitter: this.internal_eventEmitter,
                    internal_querier: this.querier
                }
            }, Nm.default.createElement(fX6.Provider, {
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
            }, Nm.default.createElement(mE7, null, Nm.default.createElement(Ay7, null, this.state.error ? Nm.default.createElement(Mj8, {
                error: this.state.error
            }) : this.props.children))))))
        }
        componentDidMount() {
            if (this.props.stdout.isTTY && !t6(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(ku6)
        }
        componentWillUnmount() {
            if (this.props.stdout.isTTY) this.props.stdout.write(xC);
            if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer), this.incompleteEscapeTimer = null;
            if (this.pendingHyperlinkTimer) clearTimeout(this.pendingHyperlinkTimer), this.pendingHyperlinkTimer = null;
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
                    if ($s(), q.ref(), q.setRawMode(!0), q.addListener("readable", this.handleReadable), this.props.stdout.write(yk7), this.props.stdout.write(VH8), yy7.includes(Q8.terminal ?? "")) this.props.stdout.write(gV7);
                    setImmediate(() => {
                        Promise.all([this.querier.send(Ny7()), this.querier.flush()]).then(([K]) => {
                            if (K) bk7(K.name), k(`XTVERSION: terminal identified as "${K.name}"`);
                            else k("XTVERSION: no reply (terminal ignored query)")
                        })
                    })
                }
                this.rawModeEnabledCount++;
                return
            }
            if (--this.rawModeEnabledCount === 0) {
                if (yy7.includes(Q8.terminal ?? "")) this.props.stdout.write(eD6);
                this.props.stdout.write(WK6), this.props.stdout.write(HX6), q.setRawMode(!1), q.removeListener("readable", this.handleReadable), q.unref()
            }
        };
        flushIncomplete = () => {
            if (this.incompleteEscapeTimer = null, !this.keyParseState.incomplete) return;
            this.processInput(null)
        };
        processInput = (A) => {
            let [q, K] = $y7(this.keyParseState, A);
            if (this.keyParseState = K, q.length > 0) SU.discreteUpdates(rd3, this, q, void 0, void 0);
            if (this.keyParseState.incomplete) {
                if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer);
                this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT)
            }
        };
        handleReadable = () => {
            try {
                let A;
                while ((A = this.props.stdin.read()) !== null) this.processInput(A)
            } catch (A) {
                _6(A);
                let {
                    stdin: q
                } = this.props;
                if (this.rawModeEnabledCount > 0 && !q.listeners("readable").includes(this.handleReadable)) k("handleReadable: re-attaching stdin readable listener after error recovery", {
                    level: "warn"
                }), q.addListener("readable", this.handleReadable)
            }
        };
        handleInput = (A) => {
            if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
            if (A === id3 && this.state.activeFocusId) this.setState({
                activeFocusId: void 0
            });
            if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
                if (A === cd3) this.focusNext();
                if (A === ld3) this.focusPrevious()
            }
        };
        handleExit = (A) => {
            if (this.isRawModeSupported()) this.handleSetRawMode(!1);
            this.props.onExit(A)
        };
        handleTerminalFocus = (A) => {
            wj8(A)
        };
        handleSuspend = () => {
            if (!this.isRawModeSupported()) return;
            let A = this.rawModeEnabledCount;
            while (this.rawModeEnabledCount > 0) this.handleSetRawMode(!1);
            if (this.props.stdout.isTTY) this.props.stdout.write(xC + WK6 + ZK6);
            this.internal_eventEmitter.emit("suspend");
            let q = () => {
                for (let K = 0; K < A; K++)
                    if (this.isRawModeSupported()) this.handleSetRawMode(!0);
                if (this.props.stdout.isTTY) {
                    if (!t6(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(ku6);
                    this.props.stdout.write(VH8)
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
// @from(Ln 160804, Col 0)
function Vm() {
    let A = mL.useContext(eO1);
    if (!A) throw Error("useTerminalNotification must be used within TerminalWriteProvider");
    let q = mL.useCallback(({
            message: w,
            title: O
        }) => {
            let $ = O ? `${O}:
${w}` : w;
            A(gP(QH.ITERM2, `

${$}`))
        }, [A]),
        K = mL.useCallback(({
            message: w,
            title: O,
            id: $
        }) => {
            A(gP(QH.KITTY, `i=${$}:d=0:p=title`, O)), A(gP(QH.KITTY, `i=${$}:p=body`, w)), A(gP(QH.KITTY, `i=${$}:d=1:a=focus`, ""))
        }, [A]),
        Y = mL.useCallback(({
            message: w,
            title: O
        }) => {
            A(gP(QH.GHOSTTY, "notify", O, w))
        }, [A]),
        z = mL.useCallback(() => {
            A(RU)
        }, [A]),
        _ = mL.useCallback((w, O) => {
            if (!Ik7()) return;
            if (!w) {
                A(gP(QH.ITERM2, fK6.PROGRESS, TK6.CLEAR, ""));
                return
            }
            let $ = Math.max(0, Math.min(100, Math.round(O ?? 0)));
            switch (w) {
                case "completed":
                    A(gP(QH.ITERM2, fK6.PROGRESS, TK6.CLEAR, ""));
                    break;
                case "error":
                    A(gP(QH.ITERM2, fK6.PROGRESS, TK6.ERROR, $));
                    break;
                case "indeterminate":
                    A(gP(QH.ITERM2, fK6.PROGRESS, TK6.INDETERMINATE, ""));
                    break;
                case "running":
                    A(gP(QH.ITERM2, fK6.PROGRESS, TK6.SET, $));
                    break;
                case null:
                    break
            }
        }, [A]);
    return mL.useMemo(() => ({
        notifyITerm2: q,
        notifyKitty: K,
        notifyGhostty: Y,
        notifyBell: z,
        progress: _
    }), [q, K, Y, z, _])
}
// @from(Ln 160865, Col 4)
mL
// @from(Ln 160865, Col 8)
eO1
// @from(Ln 160865, Col 13)
Sy7
// @from(Ln 160866, Col 4)
Hs = E(() => {
    $K6();
    vm();
    jX6();
    mL = t(P6(), 1), eO1 = mL.createContext(null), Sy7 = eO1.Provider
})
// @from(Ln 160873, Col 0)
function ad3() {}
// @from(Ln 160874, Col 4)
uU
// @from(Ln 160875, Col 4)
vj8 = E(() => {
    uU = ad3
})
// @from(Ln 160879, Col 0)
function Nj8(A) {
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
            let _ = K - 1,
                w = q[_],
                O = w.type;
            if (z === "cursorMove" && O === "cursorMove") {
                q[_] = {
                    type: "cursorMove",
                    x: w.x + Y.x,
                    y: w.y + Y.y
                };
                continue
            }
            if (z === "cursorTo" && O === "cursorTo") {
                q[_] = Y;
                continue
            }
            if (z === "styleStr" && O === "styleStr") {
                q[_] = Y;
                continue
            }
            if (z === "hyperlink" && O === "hyperlink" && Y.uri === w.uri) continue;
            if (z === "cursorShow" && O === "cursorHide" || z === "cursorHide" && O === "cursorShow") {
                q.pop(), K--;
                continue
            }
        }
        q.push(Y), K++
    }
    return q
}
// @from(Ln 160923, Col 0)
function js(A, q, K, Y, z) {
    return {
        screen: kK6(0, 0, K, Y, z),
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
// @from(Ln 160937, Col 4)
Cy7 = E(() => {
    EK6()
})
// @from(Ln 160940, Col 4)
xu6
// @from(Ln 160941, Col 4)
Vj8 = E(() => {
    xu6 = class xu6 extends uC {
        col;
        row;
        localCol = 0;
        localRow = 0;
        constructor(A, q) {
            super();
            this.col = A, this.row = q
        }
    }
})
// @from(Ln 160954, Col 0)
function Iy7(A, q, K) {
    let Y = dG.get(A);
    if (!Y) return null;
    if (q < Y.x || q >= Y.x + Y.width || K < Y.y || K >= Y.y + Y.height) return null;
    for (let z = A.childNodes.length - 1; z >= 0; z--) {
        let _ = A.childNodes[z];
        if (_.nodeName === "#text") continue;
        let w = Iy7(_, q, K);
        if (w) return w
    }
    return A
}
// @from(Ln 160967, Col 0)
function by7(A, q, K) {
    let Y = Iy7(A, q, K) ?? void 0;
    if (!Y) return !1;
    let z = new xu6(q, K),
        _ = !1;
    while (Y) {
        if (Y.onClick) {
            _ = !0;
            let w = dG.get(Y);
            if (w) z.localCol = q - w.x, z.localRow = K - w.y;
            if (Y.onClick(z), z.didStopImmediatePropagation()) return !0
        }
        Y = Y.parentNode
    }
    return _
}
// @from(Ln 160983, Col 4)
xy7 = E(() => {
    Zu6();
    Vj8()
})
// @from(Ln 160991, Col 0)
function uy7(A) {
    return Object.freeze({
        type: "stdout",
        content: LV7(A, 1)
    })
}
// @from(Ln 160997, Col 0)
class uu6 {
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
    lastYogaResetTime = performance.now();
    drainTimer = null;
    altScreenParkPatch;
    selection = Jy7();
    selectionBgCode;
    selectionListeners = new Set;
    altScreenActive = !1;
    altScreenMouseTracking = !1;
    prevFrameContaminated = !1;
    constructor(A) {
        this.options = A;
        if (L$8(this), this.options.patchConsole) this.restoreConsole = this.patchConsole();
        if (this.terminal = {
                stdout: A.stdout,
                stderr: A.stderr
            }, this.terminalColumns = A.stdout.columns || 80, this.terminalRows = A.stdout.rows || 24, this.altScreenParkPatch = uy7(this.terminalRows), this.stylePool = new dH8, this.charPool = new xO1, this.hyperlinkPool = new uO1, this.frontFrame = js(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = js(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.log = new qj8({
                isTTY: A.stdout.isTTY || !1,
                stylePool: this.stylePool
            }), this.scheduleRender = FN7(this.onRender, SK6, {
                leading: !0,
                trailing: !0
            }), this.isUnmounted = !1, this.unsubscribeExit = sn(this.unmount, {
                alwaysLast: !1
            }), A.stdout.isTTY) A.stdout.on("resize", this.handleResize), process.on("SIGCONT", this.handleResume), this.unsubscribeTTYHandlers = () => {
            A.stdout.off("resize", this.handleResize), process.off("SIGCONT", this.handleResume)
        };
        this.rootNode = ZO1("ink-root"), this.renderer = eH8(this.rootNode, this.stylePool), this.rootNode.onRender = this.scheduleRender, this.rootNode.onImmediateRender = this.onRender, this.rootNode.onComputeLayout = () => {
            if (this.isUnmounted) return;
            if (this.rootNode.yogaNode) this.rootNode.yogaNode.setWidth(this.terminalColumns), this.rootNode.yogaNode.calculateLayout(this.terminalColumns)
        }, this.container = SU.createContainer(this.rootNode, i$8, null, !1, null, "id", uU, uU, uU, uU)
    }
    handleResume = () => {
        if (!this.options.stdout.isTTY) return;
        if (this.altScreenActive) {
            this.options.stdout.write(kH8 + "\x1B[2J\x1B[H" + (this.altScreenMouseTracking ? NO1 : "")), this.resetFramesForAltScreen();
            return
        }
        this.frontFrame = js(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = js(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset()
    };
    handleResize = () => {
        if (this.terminalColumns = this.options.stdout.columns || 80, this.terminalRows = this.options.stdout.rows || 24, this.altScreenParkPatch = uy7(this.terminalRows), this.altScreenActive && !this.isPaused && this.options.stdout.isTTY) this.options.stdout.write(kH8 + "\x1B[2J\x1B[H" + (this.altScreenMouseTracking ? NO1 : "")), this.resetFramesForAltScreen();
        if (this.currentNode !== null) this.render(this.currentNode)
    };
    resolveExitPromise = () => {};
    rejectExitPromise = () => {};
    unsubscribeExit = () => {};
    enterAlternateScreen() {
        this.pause(), this.suspendStdin(), this.options.stdout.write((this.altScreenActive ? ZK6 : "\x1B[?1049h") + "\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H")
    }
    exitAlternateScreen() {
        if (this.options.stdout.write("\x1B[2J\x1B[H" + (this.altScreenActive ? NO1 : "\x1B[?1049l") + "\x1B[?25l"), this.resumeStdin(), this.altScreenActive) this.resetFramesForAltScreen();
        else this.repaint();
        this.resume(), this.options.stdout.write("\x1B[?1004h")
    }
    onRender() {
        if (this.isUnmounted || this.isPaused) return;
        if (this.drainTimer !== null) clearTimeout(this.drainTimer), this.drainTimer = null;
        wu1();
        let A = performance.now(),
            q = this.options.stdout.columns || 80,
            K = this.options.stdout.rows || 24,
            Y = this.renderer({
                frontFrame: this.frontFrame,
                backFrame: this.backFrame,
                isTTY: this.options.stdout.isTTY,
                terminalWidth: q,
                terminalRows: K,
                altScreen: this.altScreenActive,
                prevFrameContaminated: this.prevFrameContaminated
            }),
            z = performance.now() - A,
            _ = !1;
        if (this.altScreenActive) {
            if (_ = Os(this.selection), _) Ty7(Y.screen, this.selection, this.stylePool, this.selectionBgCode);
            if (Qk7() || _ || this.prevFrameContaminated) Y.screen.damage = {
                x: 0,
                y: 0,
                width: Y.screen.width,
                height: Y.screen.height
            }
        }
        let w = this.frontFrame;
        if (this.altScreenActive) w = {
            ...this.frontFrame,
            cursor: sd3
        };
        let O = performance.now(),
            $ = this.log.render(w, Y, this.altScreenActive),
            H = performance.now() - O;
        if (this.backFrame = this.frontFrame, this.frontFrame = Y, A - this.lastPoolResetTime > 300000) this.resetPools(), this.lastPoolResetTime = A;
        let j = 300000,
            J = 60000,
            M = A - this.lastYogaResetTime;
        if (M > j - J) DH8();
        if (M > j) {
            if (XH8()) {
                if (jk7(this.rootNode), this.rootNode.yogaNode) this.rootNode.yogaNode.setWidth(this.terminalColumns), this.rootNode.yogaNode.calculateLayout(this.terminalColumns);
                this.lastYogaResetTime = A
            }
        }
        let D = [];
        for (let f of $)
            if (f.type === "clearTerminal") D.push({
                desiredHeight: Y.screen.height,
                availableHeight: Y.viewport.height,
                reason: f.reason
            });
        let X = performance.now(),
            P = Nj8($),
            W = performance.now() - X;
        if (this.altScreenActive && P.length > 0) P.unshift(td3), P.push(this.altScreenParkPatch);
        let Z = performance.now();
        SH8(this.terminal, P, this.altScreenActive && !uk7);
        let G = performance.now() - Z;
        if (this.prevFrameContaminated = _, Y.scrollDrainPending) this.drainTimer = setTimeout(() => this.onRender(), SK6 >> 2);
        this.options.onFrame?.({
            durationMs: performance.now() - A,
            phases: {
                renderer: z,
                diff: H,
                optimize: W,
                write: G,
                patches: $.length
            },
            flickers: D
        })
    }
    pause() {
        SU.flushSyncFromReconciler(), this.onRender(), this.isPaused = !0
    }
    resume() {
        this.isPaused = !1, this.onRender()
    }
    repaint() {
        this.frontFrame = js(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = js(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset()
    }
    setAltScreenActive(A, q = !1) {
        if (this.altScreenActive === A) return;
        if (this.altScreenActive = A, this.altScreenMouseTracking = A && q, A) this.resetFramesForAltScreen();
        else this.repaint()
    }
    get isAltScreenActive() {
        return this.altScreenActive
    }
    resetFramesForAltScreen() {
        let A = this.terminalRows,
            q = this.terminalColumns,
            K = () => ({
                screen: kK6(q, A, this.stylePool, this.charPool, this.hyperlinkPool),
                viewport: {
                    width: q,
                    height: A + 1
                },
                cursor: {
                    x: 0,
                    y: 0,
                    visible: !0
                }
            });
        this.frontFrame = K(), this.backFrame = K(), this.log.reset(), this.prevFrameContaminated = !0
    }
    copySelectionNoClear() {
        if (!Os(this.selection)) return "";
        let A = fy7(this.selection, this.frontFrame.screen);
        if (A) Lk7(A).then((q) => this.options.stdout.write(q));
        return A
    }
    copySelection() {
        if (!Os(this.selection)) return "";
        let A = this.copySelectionNoClear();
        return Pj8(this.selection), this.notifySelectionChange(), A
    }
    clearTextSelection() {
        if (!Os(this.selection)) return;
        Pj8(this.selection), this.notifySelectionChange()
    }
    hasTextSelection() {
        return Os(this.selection)
    }
    subscribeToSelectionChange(A) {
        return this.selectionListeners.add(A), () => this.selectionListeners.delete(A)
    }
    notifySelectionChange() {
        this.onRender();
        for (let A of this.selectionListeners) A()
    }
    setSelectionBackground(A) {
        this.selectionBgCode = A ? vy7(A) : void 0
    }
    dispatchClick(A, q) {
        if (!this.altScreenActive) return !1;
        return by7(this.rootNode, A, q)
    }
    getHyperlinkAt(A, q) {
        if (!this.altScreenActive) return;
        let K = this.frontFrame.screen,
            Y = Pk(K, A, q),
            z = Y?.hyperlink;
        if (!z && Y?.width === 2 && A > 0) z = Pk(K, A - 1, q)?.hyperlink;
        return z
    }
    onHyperlinkClick;
    openHyperlink(A) {
        this.onHyperlinkClick?.(A)
    }
    handleMultiClick(A, q, K) {
        if (!this.altScreenActive) return;
        let Y = this.frontFrame.screen;
        if (rO1(this.selection, A, q), K === 2) Xy7(this.selection, Y, A, q);
        else Py7(this.selection, Y, q);
        if (!this.selection.focus) this.selection.focus = this.selection.anchor;
        this.notifySelectionChange()
    }
    handleSelectionDrag(A, q) {
        if (!this.altScreenActive) return;
        let K = this.selection;
        if (K.anchorSpan) Wy7(K, this.frontFrame.screen, A, q);
        else My7(K, A, q);
        this.notifySelectionChange()
    }
    stdinListeners = [];
    wasRawMode = !1;
    suspendStdin() {
        let A = this.options.stdin;
        if (!A.isTTY) return;
        let q = A.listeners("readable");
        k(`[stdin] suspendStdin: removing ${q.length} readable listener(s), wasRawMode=${A.isRaw??!1}`), q.forEach((Y) => {
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
        if (this.stdinListeners.length === 0 && !this.wasRawMode) k("[stdin] resumeStdin: called with no stored listeners and wasRawMode=false (possible desync)", {
            level: "warn"
        });
        if (k(`[stdin] resumeStdin: re-attaching ${this.stdinListeners.length} listener(s), wasRawMode=${this.wasRawMode}`), this.stdinListeners.forEach(({
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
    writeRaw(A) {
        this.options.stdout.write(A)
    }
    render(A) {
        this.currentNode = A;
        let q = kj8.default.createElement(tO1, {
            stdin: this.options.stdin,
            stdout: this.options.stdout,
            stderr: this.options.stderr,
            exitOnCtrlC: this.options.exitOnCtrlC,
            onExit: this.unmount,
            terminalColumns: this.terminalColumns,
            terminalRows: this.terminalRows,
            selection: this.selection,
            onSelectionChange: this.notifySelectionChange,
            onClickAt: this.dispatchClick,
            getHyperlinkAt: this.getHyperlinkAt,
            onOpenHyperlink: this.openHyperlink,
            onMultiClick: this.handleMultiClick,
            onSelectionDrag: this.handleSelectionDrag
        }, kj8.default.createElement(Sy7, {
            value: this.writeRaw
        }, A));
        SU.updateContainerSync(q, this.container, null, uU), SU.flushSyncWork()
    }
    unmount(A) {
        if (this.isUnmounted) return;
        if (this.onRender(), this.unsubscribeExit(), typeof this.restoreConsole === "function") this.restoreConsole();
        this.unsubscribeTTYHandlers?.();
        let q = this.log.renderPreviousOutput_DEPRECATED(this.frontFrame);
        if (SH8(this.terminal, Nj8(q)), this.options.stdout.isTTY) {
            if (this.altScreenActive) CK6(1, ZK6), CK6(1, vO1);
            CK6(1, eD6), CK6(1, WK6), CK6(1, HX6), CK6(1, xC), CK6(1, kO1)
        }
        if (this.isUnmounted = !0, this.scheduleRender.cancel?.(), this.drainTimer !== null) clearTimeout(this.drainTimer), this.drainTimer = null;
        if (SU.updateContainerSync(null, this.container, null, uU), SU.flushSyncWork(), FP.delete(this.options.stdout), this.rootNode.yogaNode?.free(), this.rootNode.yogaNode = void 0, A instanceof Error) this.rejectExitPromise(A);
        else this.resolveExitPromise()
    }
    async waitUntilExit() {
        return this.exitPromise ||= new Promise((A, q) => {
            this.resolveExitPromise = A, this.rejectExitPromise = q
        }), this.exitPromise
    }
    resetLineCount() {
        if (this.options.stdout.isTTY) this.backFrame = this.frontFrame, this.frontFrame = js(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset()
    }
    resetPools() {
        this.charPool = new xO1, this.hyperlinkPool = new uO1, OE7(this.frontFrame.screen, this.charPool, this.hyperlinkPool), this.backFrame.screen.charPool = this.charPool, this.backFrame.screen.hyperlinkPool = this.hyperlinkPool
    }
    patchConsole() {
        return dN7((A, q) => {
            if (A === "stdout") k(`console.log: ${q}`);
            if (A === "stderr") _6(Error(`console.error: ${q}`))
        })
    }
}
// @from(Ln 161327, Col 4)
kj8
// @from(Ln 161327, Col 9)
sd3
// @from(Ln 161327, Col 14)
td3
// @from(Ln 161328, Col 4)
my7 = E(() => {
    pN7();
    HL6();
    cN7();
    fH8();
    VE7();
    xH8();
    Vu6();
    Vu6();
    LE7();
    bU();
    hy7();
    Hs();
    k1();
    H1();
    vj8();
    jX6();
    Cy7();
    EK6();
    aO1();
    xy7();
    vm();
    GK6();
    uL();
    vm();
    Tu6();
    T1();
    r$8();
    kj8 = t(P6(), 1), sd3 = Object.freeze({
        x: 0,
        y: 0,
        visible: !1
    }), td3 = Object.freeze({
        type: "stdout",
        content: HK6
    })
})
// @from(Ln 161368, Col 0)
async function By7({
    stdout: A = process.stdout,
    stdin: q = process.stdin,
    stderr: K = process.stderr,
    exitOnCtrlC: Y = !0,
    patchConsole: z = !0,
    onFrame: _
} = {}) {
    await PO1();
    let w = new uu6({
        stdout: A,
        stdin: q,
        stderr: K,
        exitOnCtrlC: Y,
        patchConsole: z,
        onFrame: _
    });
    return FP.set(A, w), {
        render: (O) => w.render(O),
        unmount: () => w.unmount(),
        waitUntilExit: () => w.waitUntilExit()
    }
}
// @from(Ln 161391, Col 4)
Ac3 = (A, q) => {
        let K = Kc3(q),
            Y = {
                stdout: process.stdout,
                stdin: process.stdin,
                stderr: process.stderr,
                exitOnCtrlC: !0,
                patchConsole: !0,
                ...K
            },
            z = Yc3(Y.stdout, () => new uu6(Y));
        return z.render(A), {
            rerender: z.render,
            unmount() {
                z.unmount()
            },
            waitUntilExit: z.waitUntilExit,
            cleanup: () => FP.delete(Y.stdout)
        }
    }
// @from(Ln 161411, Col 4)
qc3 = async (A, q) => {
        k("[render] initLayout starting"), await PO1(), k("[render] initLayout complete");
        let K = Ac3(A, q);
        return k(`[render] first ink render: ${Math.round(process.uptime()*1000)}ms since process start`), K
    }
// @from(Ln 161415, Col 7)
gy7
// @from(Ln 161415, Col 12)
Kc3 = (A = {}) => {
        if (A instanceof ed3) return {
            stdout: A,
            stdin: process.stdin
        };
        return A
    }
// @from(Ln 161421, Col 7)
Yc3 = (A, q) => {
        let K = FP.get(A);
        if (!K) K = q(), FP.set(A, K);
        return K
    }
// @from(Ln 161426, Col 4)
Fy7 = E(() => {
    my7();
    Tu6();
    bU();
    H1();
    gy7 = qc3
})
// @from(Ln 161437, Col 0)
function Ej8() {
    if (mu6 === void 0) mu6 = py7();
    return mu6
}
// @from(Ln 161442, Col 0)
function yj8() {
    return mu6 = py7(), mu6
}
// @from(Ln 161446, Col 0)
function km(A) {
    if (A === "auto") return Ej8();
    return A
}
// @from(Ln 161451, Col 0)
function py7() {
    if (process.platform === "darwin") return _c3();
    return "dark"
}
// @from(Ln 161456, Col 0)
function _c3() {
    let A = zc3("defaults", ["read", "-g", "AppleInterfaceStyle"], {
        encoding: "utf8",
        timeout: 1000
    });
    if (A.status === 0 && A.stdout.trim() === "Dark") return "dark";
    return "light"
}
// @from(Ln 161464, Col 4)
mu6
// @from(Ln 161465, Col 4)
EX6 = () => {}
// @from(Ln 161467, Col 0)
function wc3() {
    return X1().theme
}
// @from(Ln 161471, Col 0)
function Oc3(A) {
    d1((q) => ({
        ...q,
        theme: A
    }))
}
// @from(Ln 161478, Col 0)
function K$1({
    children: A,
    initialState: q,
    onThemeSave: K = Oc3
}) {
    let [Y, z] = Em.useState(q ?? wc3), [_, w] = Em.useState(null), [O, $] = Em.useState(() => (q ?? Y) === "auto" ? Ej8() : "dark"), H = _ ?? Y;
    A$1.useEffect(() => {}, [H]);
    let j = H === "auto" ? O : H,
        J = Uy7.useMemo(() => ({
            themeSetting: Y,
            setThemeSetting: (M) => {
                if (z(M), w(null), M === "auto") $(yj8());
                K?.(M)
            },
            setPreviewTheme: (M) => {
                if (w(M), M === "auto") $(yj8())
            },
            savePreview: () => {
                if (_ !== null) z(_), w(null), K?.(_)
            },
            cancelPreview: () => {
                if (_ !== null) w(null)
            },
            currentTheme: j
        }), [Y, _, j, K]);
    return A$1.default.createElement(q$1.Provider, {
        value: J
    }, A)
}
// @from(Ln 161508, Col 0)
function z7() {
    let A = A6(3),
        {
            currentTheme: q,
            setThemeSetting: K
        } = Em.useContext(q$1),
        Y;
    if (A[0] !== q || A[1] !== K) Y = [q, K], A[0] = q, A[1] = K, A[2] = Y;
    else Y = A[2];
    return Y
}
// @from(Ln 161520, Col 0)
function yX6() {
    return Em.useContext(q$1).themeSetting
}
// @from(Ln 161524, Col 0)
function Y$1() {
    let A = A6(4),
        {
            setPreviewTheme: q,
            savePreview: K,
            cancelPreview: Y
        } = Em.useContext(q$1),
        z;
    if (A[0] !== Y || A[1] !== K || A[2] !== q) z = {
        setPreviewTheme: q,
        savePreview: K,
        cancelPreview: Y
    }, A[0] = Y, A[1] = K, A[2] = q, A[3] = z;
    else z = A[3];
    return z
}
// @from(Ln 161540, Col 4)
A$1
// @from(Ln 161540, Col 9)
Uy7
// @from(Ln 161540, Col 14)
Em
// @from(Ln 161540, Col 18)
Qy7 = "dark"
// @from(Ln 161541, Col 4)
q$1
// @from(Ln 161542, Col 4)
Bu6 = E(() => {
    e6();
    k8();
    EX6();
    A$1 = t(P6(), 1), Uy7 = t(P6(), 1), Em = t(P6(), 1), q$1 = Em.createContext({
        themeSetting: Qy7,
        setThemeSetting: () => {},
        setPreviewTheme: () => {},
        savePreview: () => {},
        cancelPreview: () => {},
        currentTheme: Qy7
    })
})
// @from(Ln 161556, Col 0)
function QW(A) {
    switch (A) {
        case "light":
            return $c3;
        case "light-ansi":
            return Hc3;
        case "dark-ansi":
            return jc3;
        case "light-daltonized":
            return Jc3;
        case "dark-daltonized":
            return Dc3;
        default:
            return Mc3
    }
}
// @from(Ln 161573, Col 0)
function z$1(A) {
    let q = A.match(/rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)/);
    if (q) {
        let K = parseInt(q[1], 10),
            Y = parseInt(q[2], 10),
            z = parseInt(q[3], 10),
            _ = Xc3.rgb(K, Y, z)("X");
        return _.slice(0, _.indexOf("X"))
    }
    return "\x1B[35m"
}
// @from(Ln 161584, Col 4)
Lj8
// @from(Ln 161584, Col 9)
Rq2
// @from(Ln 161584, Col 14)
$c3
// @from(Ln 161584, Col 19)
Hc3
// @from(Ln 161584, Col 24)
jc3
// @from(Ln 161584, Col 29)
Jc3
// @from(Ln 161584, Col 34)
Mc3
// @from(Ln 161584, Col 39)
Dc3
// @from(Ln 161584, Col 44)
Xc3
// @from(Ln 161585, Col 4)
ym = E(() => {
    aK();
    d3();
    Lj8 = ["dark", "light", "light-daltonized", "dark-daltonized", "light-ansi", "dark-ansi"], Rq2 = ["auto", ...Lj8], $c3 = {
        autoAccept: "rgb(135,0,255)",
        bashBorder: "rgb(255,0,135)",
        claude: "rgb(215,119,87)",
        claudeShimmer: "rgb(245,149,117)",
        claudeBlue_FOR_SYSTEM_SPINNER: "rgb(87,105,247)",
        claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(117,135,255)",
        permission: "rgb(87,105,247)",
        permissionShimmer: "rgb(137,155,255)",
        planMode: "rgb(0,102,102)",
        ide: "rgb(71,130,200)",
        promptBorder: "rgb(153,153,153)",
        promptBorderShimmer: "rgb(183,183,183)",
        text: "rgb(0,0,0)",
        inverseText: "rgb(255,255,255)",
        inactive: "rgb(102,102,102)",
        inactiveShimmer: "rgb(142,142,142)",
        subtle: "rgb(175,175,175)",
        suggestion: "rgb(87,105,247)",
        remember: "rgb(0,0,255)",
        background: "rgb(0,153,153)",
        success: "rgb(44,122,57)",
        error: "rgb(171,43,63)",
        warning: "rgb(150,108,30)",
        merged: "rgb(135,0,255)",
        warningShimmer: "rgb(200,158,80)",
        diffAdded: "rgb(105,219,124)",
        diffRemoved: "rgb(255,168,180)",
        diffAddedDimmed: "rgb(199,225,203)",
        diffRemovedDimmed: "rgb(253,210,216)",
        diffAddedWord: "rgb(47,157,68)",
        diffRemovedWord: "rgb(209,69,75)",
        red_FOR_SUBAGENTS_ONLY: "rgb(220,38,38)",
        blue_FOR_SUBAGENTS_ONLY: "rgb(37,99,235)",
        green_FOR_SUBAGENTS_ONLY: "rgb(22,163,74)",
        yellow_FOR_SUBAGENTS_ONLY: "rgb(202,138,4)",
        purple_FOR_SUBAGENTS_ONLY: "rgb(147,51,234)",
        orange_FOR_SUBAGENTS_ONLY: "rgb(234,88,12)",
        pink_FOR_SUBAGENTS_ONLY: "rgb(219,39,119)",
        cyan_FOR_SUBAGENTS_ONLY: "rgb(8,145,178)",
        professionalBlue: "rgb(106,155,204)",
        chromeYellow: "rgb(251,188,4)",
        clawd_body: "rgb(215,119,87)",
        clawd_background: "rgb(0,0,0)",
        userMessageBackground: "rgb(240, 240, 240)",
        bashMessageBackgroundColor: "rgb(250, 245, 250)",
        memoryBackgroundColor: "rgb(230, 245, 250)",
        rate_limit_fill: "rgb(87,105,247)",
        rate_limit_empty: "rgb(39,47,111)",
        fastMode: "rgb(255,106,0)",
        fastModeShimmer: "rgb(255,150,50)",
        selectionBackground: "rgb(181,211,255)",
        briefLabelYou: "rgb(37,99,235)",
        briefLabelClaude: "rgb(215,119,87)",
        rainbow_red: "rgb(235,95,87)",
        rainbow_orange: "rgb(245,139,87)",
        rainbow_yellow: "rgb(250,195,95)",
        rainbow_green: "rgb(145,200,130)",
        rainbow_blue: "rgb(130,170,220)",
        rainbow_indigo: "rgb(155,130,200)",
        rainbow_violet: "rgb(200,130,180)",
        rainbow_red_shimmer: "rgb(250,155,147)",
        rainbow_orange_shimmer: "rgb(255,185,137)",
        rainbow_yellow_shimmer: "rgb(255,225,155)",
        rainbow_green_shimmer: "rgb(185,230,180)",
        rainbow_blue_shimmer: "rgb(180,205,240)",
        rainbow_indigo_shimmer: "rgb(195,180,230)",
        rainbow_violet_shimmer: "rgb(230,180,210)"
    }, Hc3 = {
        autoAccept: "ansi:magenta",
        bashBorder: "ansi:magenta",
        claude: "ansi:redBright",
        claudeShimmer: "ansi:yellowBright",
        claudeBlue_FOR_SYSTEM_SPINNER: "ansi:blue",
        claudeBlueShimmer_FOR_SYSTEM_SPINNER: "ansi:blueBright",
        permission: "ansi:blue",
        permissionShimmer: "ansi:blueBright",
        planMode: "ansi:cyan",
        ide: "ansi:blueBright",
        promptBorder: "ansi:white",
        promptBorderShimmer: "ansi:whiteBright",
        text: "ansi:black",
        inverseText: "ansi:white",
        inactive: "ansi:blackBright",
        inactiveShimmer: "ansi:white",
        subtle: "ansi:blackBright",
        suggestion: "ansi:blue",
        remember: "ansi:blue",
        background: "ansi:cyan",
        success: "ansi:green",
        error: "ansi:red",
        warning: "ansi:yellow",
        merged: "ansi:magenta",
        warningShimmer: "ansi:yellowBright",
        diffAdded: "ansi:green",
        diffRemoved: "ansi:red",
        diffAddedDimmed: "ansi:green",
        diffRemovedDimmed: "ansi:red",
        diffAddedWord: "ansi:greenBright",
        diffRemovedWord: "ansi:redBright",
        red_FOR_SUBAGENTS_ONLY: "ansi:red",
        blue_FOR_SUBAGENTS_ONLY: "ansi:blue",
        green_FOR_SUBAGENTS_ONLY: "ansi:green",
        yellow_FOR_SUBAGENTS_ONLY: "ansi:yellow",
        purple_FOR_SUBAGENTS_ONLY: "ansi:magenta",
        orange_FOR_SUBAGENTS_ONLY: "ansi:redBright",
        pink_FOR_SUBAGENTS_ONLY: "ansi:magentaBright",
        cyan_FOR_SUBAGENTS_ONLY: "ansi:cyan",
        professionalBlue: "ansi:blueBright",
        chromeYellow: "ansi:yellow",
        clawd_body: "ansi:redBright",
        clawd_background: "ansi:black",
        userMessageBackground: "ansi:white",
        bashMessageBackgroundColor: "ansi:whiteBright",
        memoryBackgroundColor: "ansi:white",
        rate_limit_fill: "ansi:yellow",
        rate_limit_empty: "ansi:black",
        fastMode: "ansi:red",
        fastModeShimmer: "ansi:redBright",
        selectionBackground: "ansi:blueBright",
        briefLabelYou: "ansi:blue",
        briefLabelClaude: "ansi:redBright",
        rainbow_red: "ansi:red",
        rainbow_orange: "ansi:redBright",
        rainbow_yellow: "ansi:yellow",
        rainbow_green: "ansi:green",
        rainbow_blue: "ansi:cyan",
        rainbow_indigo: "ansi:blue",
        rainbow_violet: "ansi:magenta",
        rainbow_red_shimmer: "ansi:redBright",
        rainbow_orange_shimmer: "ansi:yellow",
        rainbow_yellow_shimmer: "ansi:yellowBright",
        rainbow_green_shimmer: "ansi:greenBright",
        rainbow_blue_shimmer: "ansi:cyanBright",
        rainbow_indigo_shimmer: "ansi:blueBright",
        rainbow_violet_shimmer: "ansi:magentaBright"
    }, jc3 = {
        autoAccept: "ansi:magentaBright",
        bashBorder: "ansi:magentaBright",
        claude: "ansi:redBright",
        claudeShimmer: "ansi:yellowBright",
        claudeBlue_FOR_SYSTEM_SPINNER: "ansi:blueBright",
        claudeBlueShimmer_FOR_SYSTEM_SPINNER: "ansi:blueBright",
        permission: "ansi:blueBright",
        permissionShimmer: "ansi:blueBright",
        planMode: "ansi:cyanBright",
        ide: "ansi:blue",
        promptBorder: "ansi:white",
        promptBorderShimmer: "ansi:whiteBright",
        text: "ansi:whiteBright",
        inverseText: "ansi:black",
        inactive: "ansi:white",
        inactiveShimmer: "ansi:whiteBright",
        subtle: "ansi:white",
        suggestion: "ansi:blueBright",
        remember: "ansi:blueBright",
        background: "ansi:cyanBright",
        success: "ansi:greenBright",
        error: "ansi:redBright",
        warning: "ansi:yellowBright",
        merged: "ansi:magentaBright",
        warningShimmer: "ansi:yellowBright",
        diffAdded: "ansi:green",
        diffRemoved: "ansi:red",
        diffAddedDimmed: "ansi:green",
        diffRemovedDimmed: "ansi:red",
        diffAddedWord: "ansi:greenBright",
        diffRemovedWord: "ansi:redBright",
        red_FOR_SUBAGENTS_ONLY: "ansi:redBright",
        blue_FOR_SUBAGENTS_ONLY: "ansi:blueBright",
        green_FOR_SUBAGENTS_ONLY: "ansi:greenBright",
        yellow_FOR_SUBAGENTS_ONLY: "ansi:yellowBright",
        purple_FOR_SUBAGENTS_ONLY: "ansi:magentaBright",
        orange_FOR_SUBAGENTS_ONLY: "ansi:redBright",
        pink_FOR_SUBAGENTS_ONLY: "ansi:magentaBright",
        cyan_FOR_SUBAGENTS_ONLY: "ansi:cyanBright",
        professionalBlue: "rgb(106,155,204)",
        chromeYellow: "ansi:yellowBright",
        clawd_body: "ansi:redBright",
        clawd_background: "ansi:black",
        userMessageBackground: "ansi:blackBright",
        bashMessageBackgroundColor: "ansi:black",
        memoryBackgroundColor: "ansi:blackBright",
        rate_limit_fill: "ansi:yellow",
        rate_limit_empty: "ansi:white",
        fastMode: "ansi:redBright",
        fastModeShimmer: "ansi:redBright",
        selectionBackground: "ansi:blue",
        briefLabelYou: "ansi:blueBright",
        briefLabelClaude: "ansi:redBright",
        rainbow_red: "ansi:red",
        rainbow_orange: "ansi:redBright",
        rainbow_yellow: "ansi:yellow",
        rainbow_green: "ansi:green",
        rainbow_blue: "ansi:cyan",
        rainbow_indigo: "ansi:blue",
        rainbow_violet: "ansi:magenta",
        rainbow_red_shimmer: "ansi:redBright",
        rainbow_orange_shimmer: "ansi:yellow",
        rainbow_yellow_shimmer: "ansi:yellowBright",
        rainbow_green_shimmer: "ansi:greenBright",
        rainbow_blue_shimmer: "ansi:cyanBright",
        rainbow_indigo_shimmer: "ansi:blueBright",
        rainbow_violet_shimmer: "ansi:magentaBright"
    }, Jc3 = {
        autoAccept: "rgb(135,0,255)",
        bashBorder: "rgb(0,102,204)",
        claude: "rgb(255,153,51)",
        claudeShimmer: "rgb(255,183,101)",
        claudeBlue_FOR_SYSTEM_SPINNER: "rgb(51,102,255)",
        claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(101,152,255)",
        permission: "rgb(51,102,255)",
        permissionShimmer: "rgb(101,152,255)",
        planMode: "rgb(51,102,102)",
        ide: "rgb(71,130,200)",
        promptBorder: "rgb(153,153,153)",
        promptBorderShimmer: "rgb(183,183,183)",
        text: "rgb(0,0,0)",
        inverseText: "rgb(255,255,255)",
        inactive: "rgb(102,102,102)",
        inactiveShimmer: "rgb(142,142,142)",
        subtle: "rgb(175,175,175)",
        suggestion: "rgb(51,102,255)",
        remember: "rgb(51,102,255)",
        background: "rgb(0,153,153)",
        success: "rgb(0,102,153)",
        error: "rgb(204,0,0)",
        warning: "rgb(255,153,0)",
        merged: "rgb(135,0,255)",
        warningShimmer: "rgb(255,183,50)",
        diffAdded: "rgb(153,204,255)",
        diffRemoved: "rgb(255,204,204)",
        diffAddedDimmed: "rgb(209,231,253)",
        diffRemovedDimmed: "rgb(255,233,233)",
        diffAddedWord: "rgb(51,102,204)",
        diffRemovedWord: "rgb(153,51,51)",
        red_FOR_SUBAGENTS_ONLY: "rgb(204,0,0)",
        blue_FOR_SUBAGENTS_ONLY: "rgb(0,102,204)",
        green_FOR_SUBAGENTS_ONLY: "rgb(0,204,0)",
        yellow_FOR_SUBAGENTS_ONLY: "rgb(255,204,0)",
        purple_FOR_SUBAGENTS_ONLY: "rgb(128,0,128)",
        orange_FOR_SUBAGENTS_ONLY: "rgb(255,128,0)",
        pink_FOR_SUBAGENTS_ONLY: "rgb(255,102,178)",
        cyan_FOR_SUBAGENTS_ONLY: "rgb(0,178,178)",
        professionalBlue: "rgb(106,155,204)",
        chromeYellow: "rgb(251,188,4)",
        clawd_body: "rgb(215,119,87)",
        clawd_background: "rgb(0,0,0)",
        userMessageBackground: "rgb(220, 220, 220)",
        bashMessageBackgroundColor: "rgb(250, 245, 250)",
        memoryBackgroundColor: "rgb(230, 245, 250)",
        rate_limit_fill: "rgb(51,102,255)",
        rate_limit_empty: "rgb(23,46,114)",
        fastMode: "rgb(255,106,0)",
        fastModeShimmer: "rgb(255,150,50)",
        selectionBackground: "rgb(181,211,255)",
        briefLabelYou: "rgb(37,99,235)",
        briefLabelClaude: "rgb(255,153,51)",
        rainbow_red: "rgb(235,95,87)",
        rainbow_orange: "rgb(245,139,87)",
        rainbow_yellow: "rgb(250,195,95)",
        rainbow_green: "rgb(145,200,130)",
        rainbow_blue: "rgb(130,170,220)",
        rainbow_indigo: "rgb(155,130,200)",
        rainbow_violet: "rgb(200,130,180)",
        rainbow_red_shimmer: "rgb(250,155,147)",
        rainbow_orange_shimmer: "rgb(255,185,137)",
        rainbow_yellow_shimmer: "rgb(255,225,155)",
        rainbow_green_shimmer: "rgb(185,230,180)",
        rainbow_blue_shimmer: "rgb(180,205,240)",
        rainbow_indigo_shimmer: "rgb(195,180,230)",
        rainbow_violet_shimmer: "rgb(230,180,210)"
    }, Mc3 = {
        autoAccept: "rgb(175,135,255)",
        bashBorder: "rgb(253,93,177)",
        claude: "rgb(215,119,87)",
        claudeShimmer: "rgb(235,159,127)",
        claudeBlue_FOR_SYSTEM_SPINNER: "rgb(147,165,255)",
        claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(177,195,255)",
        permission: "rgb(177,185,249)",
        permissionShimmer: "rgb(207,215,255)",
        planMode: "rgb(72,150,140)",
        ide: "rgb(71,130,200)",
        promptBorder: "rgb(136,136,136)",
        promptBorderShimmer: "rgb(166,166,166)",
        text: "rgb(255,255,255)",
        inverseText: "rgb(0,0,0)",
        inactive: "rgb(153,153,153)",
        inactiveShimmer: "rgb(193,193,193)",
        subtle: "rgb(80,80,80)",
        suggestion: "rgb(177,185,249)",
        remember: "rgb(177,185,249)",
        background: "rgb(0,204,204)",
        success: "rgb(78,186,101)",
        error: "rgb(255,107,128)",
        warning: "rgb(255,193,7)",
        merged: "rgb(175,135,255)",
        warningShimmer: "rgb(255,223,57)",
        diffAdded: "rgb(34,92,43)",
        diffRemoved: "rgb(122,41,54)",
        diffAddedDimmed: "rgb(71,88,74)",
        diffRemovedDimmed: "rgb(105,72,77)",
        diffAddedWord: "rgb(56,166,96)",
        diffRemovedWord: "rgb(179,89,107)",
        red_FOR_SUBAGENTS_ONLY: "rgb(220,38,38)",
        blue_FOR_SUBAGENTS_ONLY: "rgb(37,99,235)",
        green_FOR_SUBAGENTS_ONLY: "rgb(22,163,74)",
        yellow_FOR_SUBAGENTS_ONLY: "rgb(202,138,4)",
        purple_FOR_SUBAGENTS_ONLY: "rgb(147,51,234)",
        orange_FOR_SUBAGENTS_ONLY: "rgb(234,88,12)",
        pink_FOR_SUBAGENTS_ONLY: "rgb(219,39,119)",
        cyan_FOR_SUBAGENTS_ONLY: "rgb(8,145,178)",
        professionalBlue: "rgb(106,155,204)",
        chromeYellow: "rgb(251,188,4)",
        clawd_body: "rgb(215,119,87)",
        clawd_background: "rgb(0,0,0)",
        userMessageBackground: "rgb(55, 55, 55)",
        bashMessageBackgroundColor: "rgb(65, 60, 65)",
        memoryBackgroundColor: "rgb(55, 65, 70)",
        rate_limit_fill: "rgb(177,185,249)",
        rate_limit_empty: "rgb(80,83,112)",
        fastMode: "rgb(255,120,20)",
        fastModeShimmer: "rgb(255,165,70)",
        selectionBackground: "rgb(38,58,94)",
        briefLabelYou: "rgb(122,180,232)",
        briefLabelClaude: "rgb(215,119,87)",
        rainbow_red: "rgb(235,95,87)",
        rainbow_orange: "rgb(245,139,87)",
        rainbow_yellow: "rgb(250,195,95)",
        rainbow_green: "rgb(145,200,130)",
        rainbow_blue: "rgb(130,170,220)",
        rainbow_indigo: "rgb(155,130,200)",
        rainbow_violet: "rgb(200,130,180)",
        rainbow_red_shimmer: "rgb(250,155,147)",
        rainbow_orange_shimmer: "rgb(255,185,137)",
        rainbow_yellow_shimmer: "rgb(255,225,155)",
        rainbow_green_shimmer: "rgb(185,230,180)",
        rainbow_blue_shimmer: "rgb(180,205,240)",
        rainbow_indigo_shimmer: "rgb(195,180,230)",
        rainbow_violet_shimmer: "rgb(230,180,210)"
    }, Dc3 = {
        autoAccept: "rgb(175,135,255)",
        bashBorder: "rgb(51,153,255)",
        claude: "rgb(255,153,51)",
        claudeShimmer: "rgb(255,183,101)",
        claudeBlue_FOR_SYSTEM_SPINNER: "rgb(153,204,255)",
        claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(183,224,255)",
        permission: "rgb(153,204,255)",
        permissionShimmer: "rgb(183,224,255)",
        planMode: "rgb(102,153,153)",
        ide: "rgb(71,130,200)",
        promptBorder: "rgb(136,136,136)",
        promptBorderShimmer: "rgb(166,166,166)",
        text: "rgb(255,255,255)",
        inverseText: "rgb(0,0,0)",
        inactive: "rgb(153,153,153)",
        inactiveShimmer: "rgb(193,193,193)",
        subtle: "rgb(80,80,80)",
        suggestion: "rgb(153,204,255)",
        remember: "rgb(153,204,255)",
        background: "rgb(0,204,204)",
        success: "rgb(51,153,255)",
        error: "rgb(255,102,102)",
        warning: "rgb(255,204,0)",
        merged: "rgb(175,135,255)",
        warningShimmer: "rgb(255,234,50)",
        diffAdded: "rgb(0,68,102)",
        diffRemoved: "rgb(102,0,0)",
        diffAddedDimmed: "rgb(62,81,91)",
        diffRemovedDimmed: "rgb(62,44,44)",
        diffAddedWord: "rgb(0,119,179)",
        diffRemovedWord: "rgb(179,0,0)",
        red_FOR_SUBAGENTS_ONLY: "rgb(255,102,102)",
        blue_FOR_SUBAGENTS_ONLY: "rgb(102,178,255)",
        green_FOR_SUBAGENTS_ONLY: "rgb(102,255,102)",
        yellow_FOR_SUBAGENTS_ONLY: "rgb(255,255,102)",
        purple_FOR_SUBAGENTS_ONLY: "rgb(178,102,255)",
        orange_FOR_SUBAGENTS_ONLY: "rgb(255,178,102)",
        pink_FOR_SUBAGENTS_ONLY: "rgb(255,153,204)",
        cyan_FOR_SUBAGENTS_ONLY: "rgb(102,204,204)",
        professionalBlue: "rgb(106,155,204)",
        chromeYellow: "rgb(251,188,4)",
        clawd_body: "rgb(215,119,87)",
        clawd_background: "rgb(0,0,0)",
        userMessageBackground: "rgb(55, 55, 55)",
        bashMessageBackgroundColor: "rgb(65, 60, 65)",
        memoryBackgroundColor: "rgb(55, 65, 70)",
        rate_limit_fill: "rgb(153,204,255)",
        rate_limit_empty: "rgb(69,92,115)",
        fastMode: "rgb(255,120,20)",
        fastModeShimmer: "rgb(255,165,70)",
        selectionBackground: "rgb(38,58,94)",
        briefLabelYou: "rgb(122,180,232)",
        briefLabelClaude: "rgb(255,153,51)",
        rainbow_red: "rgb(235,95,87)",
        rainbow_orange: "rgb(245,139,87)",
        rainbow_yellow: "rgb(250,195,95)",
        rainbow_green: "rgb(145,200,130)",
        rainbow_blue: "rgb(130,170,220)",
        rainbow_indigo: "rgb(155,130,200)",
        rainbow_violet: "rgb(200,130,180)",
        rainbow_red_shimmer: "rgb(250,155,147)",
        rainbow_orange_shimmer: "rgb(255,185,137)",
        rainbow_yellow_shimmer: "rgb(255,225,155)",
        rainbow_green_shimmer: "rgb(185,230,180)",
        rainbow_blue_shimmer: "rgb(180,205,240)",
        rainbow_indigo_shimmer: "rgb(195,180,230)",
        rainbow_violet_shimmer: "rgb(230,180,210)"
    };
    Xc3 = Q8.terminal === "Apple_Terminal" ? new WO8({
        level: 2
    }) : O1
})
// @from(Ln 162002, Col 0)
function LX6(A, q) {
    if (!A) return;
    if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
    return q[A]
}
// @from(Ln 162008, Col 0)
function Pc3(A) {
    let q = A6(33),
        K, Y, z, _, w, O, $, H, j;
    if (q[0] !== A)({
        borderColor: z,
        borderTopColor: O,
        borderBottomColor: Y,
        borderLeftColor: _,
        borderRightColor: w,
        backgroundColor: K,
        children: $,
        ref: H,
        ...j
    } = A), q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = _, q[5] = w, q[6] = O, q[7] = $, q[8] = H, q[9] = j;
    else K = q[1], Y = q[2], z = q[3], _ = q[4], w = q[5], O = q[6], $ = q[7], H = q[8], j = q[9];
    let [J] = z7(), M, D, X, P, W, Z;
    if (q[10] !== K || q[11] !== Y || q[12] !== z || q[13] !== _ || q[14] !== w || q[15] !== O || q[16] !== J) {
        let v = QW(J);
        D = LX6(z, v), W = LX6(O, v), M = LX6(Y, v), X = LX6(_, v), P = LX6(w, v), Z = LX6(K, v), q[10] = K, q[11] = Y, q[12] = z, q[13] = _, q[14] = w, q[15] = O, q[16] = J, q[17] = M, q[18] = D, q[19] = X, q[20] = P, q[21] = W, q[22] = Z
    } else M = q[17], D = q[18], X = q[19], P = q[20], W = q[21], Z = q[22];
    let G = Z,
        f;
    if (q[23] !== $ || q[24] !== H || q[25] !== G || q[26] !== M || q[27] !== D || q[28] !== X || q[29] !== P || q[30] !== W || q[31] !== j) f = dy7.default.createElement(_X, {
        ref: H,
        borderColor: D,
        borderTopColor: W,
        borderBottomColor: M,
        borderLeftColor: X,
        borderRightColor: P,
        backgroundColor: G,
        ...j
    }, $), q[23] = $, q[24] = H, q[25] = G, q[26] = M, q[27] = D, q[28] = X, q[29] = P, q[30] = W, q[31] = j, q[32] = f;
    else f = q[32];
    return f
}
// @from(Ln 162043, Col 4)
dy7
// @from(Ln 162043, Col 9)
m
// @from(Ln 162044, Col 4)
cy7 = E(() => {
    e6();
    ym();
    Bu6();
    TX6();
    dy7 = t(P6(), 1);
    m = Pc3
})
// @from(Ln 162053, Col 0)
function Wc3(A, q) {
    if (!A) return;
    if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
    return q[A]
}
// @from(Ln 162059, Col 0)
function T(A) {
    let q = A6(15),
        {
            color: K,
            backgroundColor: Y,
            dimColor: z,
            bold: _,
            italic: w,
            underline: O,
            strikethrough: $,
            inverse: H,
            wrap: j,
            children: J
        } = A,
        M = z === void 0 ? !1 : z,
        D = _ === void 0 ? !1 : _,
        X = w === void 0 ? !1 : w,
        P = O === void 0 ? !1 : O,
        W = $ === void 0 ? !1 : $,
        Z = H === void 0 ? !1 : H,
        G = j === void 0 ? "wrap" : j,
        [f] = z7(),
        v, N;
    if (q[0] !== K || q[1] !== M || q[2] !== f) N = QW(f), v = M ? N.inactive : Wc3(K, N), q[0] = K, q[1] = M, q[2] = f, q[3] = v, q[4] = N;
    else v = q[3], N = q[4];
    let V = v,
        L = Y ? N[Y] : void 0,
        h;
    if (q[5] !== D || q[6] !== J || q[7] !== Z || q[8] !== X || q[9] !== L || q[10] !== V || q[11] !== W || q[12] !== P || q[13] !== G) h = ly7.default.createElement(Kz, {
        color: V,
        backgroundColor: L,
        bold: D,
        italic: X,
        underline: P,
        strikethrough: W,
        inverse: Z,
        wrap: G
    }, J), q[5] = D, q[6] = J, q[7] = Z, q[8] = X, q[9] = L, q[10] = V, q[11] = W, q[12] = P, q[13] = G, q[14] = h;
    else h = q[14];
    return h
}
// @from(Ln 162100, Col 4)
ly7
// @from(Ln 162101, Col 4)
RX6 = E(() => {
    e6();
    ym();
    Bu6();
    hK6();
    ly7 = t(P6(), 1)
})
// @from(Ln 162108, Col 4)
ry7 = x((pq2, ny7) => {
    var Zc3 = x6("os"),
        iy7 = x6("tty"),
        BL = yL6(),
        {
            env: wX
        } = process,
        Js;
    if (BL("no-color") || BL("no-colors") || BL("color=false") || BL("color=never")) Js = 0;
    else if (BL("color") || BL("colors") || BL("color=true") || BL("color=always")) Js = 1;
    if ("FORCE_COLOR" in wX)
        if (wX.FORCE_COLOR === "true") Js = 1;
        else if (wX.FORCE_COLOR === "false") Js = 0;
    else Js = wX.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(wX.FORCE_COLOR, 10), 3);

    function Rj8(A) {
        if (A === 0) return !1;
        return {
            level: A,
            hasBasic: !0,
            has256: A >= 2,
            has16m: A >= 3
        }
    }

    function hj8(A, q) {
        if (Js === 0) return 0;
        if (BL("color=16m") || BL("color=full") || BL("color=truecolor")) return 3;
        if (BL("color=256")) return 2;
        if (A && !q && Js === void 0) return 0;
        let K = Js || 0;
        if (wX.TERM === "dumb") return K;
        if (process.platform === "win32") {
            let Y = Zc3.release().split(".");
            if (Number(Y[0]) >= 10 && Number(Y[2]) >= 10586) return Number(Y[2]) >= 14931 ? 3 : 2;
            return 1
        }
        if ("CI" in wX) {
            if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((Y) => (Y in wX)) || wX.CI_NAME === "codeship") return 1;
            return K
        }
        if ("TEAMCITY_VERSION" in wX) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(wX.TEAMCITY_VERSION) ? 1 : 0;
        if (wX.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in wX) {
            let Y = parseInt((wX.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (wX.TERM_PROGRAM) {
                case "iTerm.app":
                    return Y >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2
            }
        }
        if (/-256(color)?$/i.test(wX.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(wX.TERM)) return 1;
        if ("COLORTERM" in wX) return 1;
        return K
    }

    function Gc3(A) {
        let q = hj8(A, A && A.isTTY);
        return Rj8(q)
    }
    ny7.exports = {
        supportsColor: Gc3,
        stdout: Rj8(hj8(!0, iy7.isatty(1))),
        stderr: Rj8(hj8(!0, iy7.isatty(2)))
    }
})
// @from(Ln 162176, Col 4)
sy7 = x((Qq2, ay7) => {
    var fc3 = ry7(),
        hX6 = yL6();

    function oy7(A) {
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

    function Sj8(A) {
        let {
            env: q
        } = process;
        if ("FORCE_HYPERLINK" in q) return !(q.FORCE_HYPERLINK.length > 0 && parseInt(q.FORCE_HYPERLINK, 10) === 0);
        if (hX6("no-hyperlink") || hX6("no-hyperlinks") || hX6("hyperlink=false") || hX6("hyperlink=never")) return !1;
        if (hX6("hyperlink=true") || hX6("hyperlink=always")) return !0;
        if ("NETLIFY" in q) return !0;
        if (!fc3.supportsColor(A)) return !1;
        if (A && !A.isTTY) return !1;
        if (process.platform === "win32") return !1;
        if ("CI" in q) return !1;
        if ("TEAMCITY_VERSION" in q) return !1;
        if ("TERM_PROGRAM" in q) {
            let K = oy7(q.TERM_PROGRAM_VERSION);
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
            let K = oy7(q.VTE_VERSION);
            return K.major > 0 || K.minor >= 50
        }
        return !1
    }
    ay7.exports = {
        supportsHyperlink: Sj8,
        stdout: Sj8(process.stdout),
        stderr: Sj8(process.stderr)
    }
})
// @from(Ln 162236, Col 0)
function cG(A) {
    if (A?.stdoutSupported ?? Cj8.default.stdout) return !0;
    let K = A?.env ?? process.env,
        Y = K.TERM_PROGRAM;
    if (Y && ty7.includes(Y)) return !0;
    let z = K.LC_TERMINAL;
    if (z && ty7.includes(z)) return !0;
    if (K.TERM?.includes("kitty")) return !0;
    return !1
}
// @from(Ln 162246, Col 4)
Cj8
// @from(Ln 162246, Col 9)
ty7
// @from(Ln 162247, Col 4)
mU = E(() => {
    Cj8 = t(sy7(), 1), ty7 = ["ghostty", "Hyper", "kitty", "alacritty", "iTerm.app", "iTerm2"]
})
// @from(Ln 162251, Col 0)
function y7(A) {
    let q = A6(5),
        {
            children: K,
            url: Y,
            fallback: z
        } = A,
        _ = K ?? Y;
    if (cG()) {
        let $;
        if (q[0] !== _ || q[1] !== Y) $ = _$1.default.createElement(Kz, null, _$1.default.createElement("ink-link", {
            href: Y
        }, _)), q[0] = _, q[1] = Y, q[2] = $;
        else $ = q[2];
        return $
    }
    let w = z ?? _,
        O;
    if (q[3] !== w) O = _$1.default.createElement(Kz, null, w), q[3] = w, q[4] = O;
    else O = q[4];
    return O
}
// @from(Ln 162273, Col 4)
_$1
// @from(Ln 162274, Col 4)
IK6 = E(() => {
    e6();
    mU();
    hK6();
    _$1 = t(P6(), 1)
})
// @from(Ln 162281, Col 0)
function SX6() {
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
// @from(Ln 162304, Col 0)
function ey7(A) {
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
// @from(Ln 162353, Col 0)
function vc3(A) {
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
    for (let _ = 0; _ <= A.length; _++) {
        let w = A[_];
        if (w === ";" || w === void 0) {
            let O = Y === "" ? null : parseInt(Y, 10);
            if (z) {
                if (O !== null) K.subparams.push(O)
            } else K.value = O;
            q.push(K), K = {
                value: null,
                subparams: [],
                colon: !1
            }, Y = "", z = !1
        } else if (w === ":") {
            let O = Y === "" ? null : parseInt(Y, 10);
            if (!z) K.value = O, K.colon = !0, z = !0;
            else if (O !== null) K.subparams.push(O);
            Y = ""
        } else if (w >= "0" && w <= "9") Y += w
    }
    return q
}
// @from(Ln 162389, Col 0)
function Ij8(A, q) {
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
            _ = A[q + 3]?.value,
            w = A[q + 4]?.value;
        if (z !== null && z !== void 0 && _ !== null && _ !== void 0 && w !== null && w !== void 0) return {
            r: z,
            g: _,
            b: w
        }
    }
    return null
}
// @from(Ln 162423, Col 0)
function AL7(A, q) {
    let K = vc3(A),
        Y = {
            ...q
        },
        z = 0;
    while (z < K.length) {
        let _ = K[z],
            w = _.value ?? 0;
        if (w === 0) {
            Y = SX6(), z++;
            continue
        }
        if (w === 1) {
            Y.bold = !0, z++;
            continue
        }
        if (w === 2) {
            Y.dim = !0, z++;
            continue
        }
        if (w === 3) {
            Y.italic = !0, z++;
            continue
        }
        if (w === 4) {
            Y.underline = _.colon ? Tc3[_.subparams[0]] ?? "single" : "single", z++;
            continue
        }
        if (w === 5 || w === 6) {
            Y.blink = !0, z++;
            continue
        }
        if (w === 7) {
            Y.inverse = !0, z++;
            continue
        }
        if (w === 8) {
            Y.hidden = !0, z++;
            continue
        }
        if (w === 9) {
            Y.strikethrough = !0, z++;
            continue
        }
        if (w === 21) {
            Y.underline = "double", z++;
            continue
        }
        if (w === 22) {
            Y.bold = !1, Y.dim = !1, z++;
            continue
        }
        if (w === 23) {
            Y.italic = !1, z++;
            continue
        }
        if (w === 24) {
            Y.underline = "none", z++;
            continue
        }
        if (w === 25) {
            Y.blink = !1, z++;
            continue
        }
        if (w === 27) {
            Y.inverse = !1, z++;
            continue
        }
        if (w === 28) {
            Y.hidden = !1, z++;
            continue
        }
        if (w === 29) {
            Y.strikethrough = !1, z++;
            continue
        }
        if (w === 53) {
            Y.overline = !0, z++;
            continue
        }
        if (w === 55) {
            Y.overline = !1, z++;
            continue
        }
        if (w >= 30 && w <= 37) {
            Y.fg = {
                type: "named",
                name: w$1[w - 30]
            }, z++;
            continue
        }
        if (w === 39) {
            Y.fg = {
                type: "default"
            }, z++;
            continue
        }
        if (w >= 40 && w <= 47) {
            Y.bg = {
                type: "named",
                name: w$1[w - 40]
            }, z++;
            continue
        }
        if (w === 49) {
            Y.bg = {
                type: "default"
            }, z++;
            continue
        }
        if (w >= 90 && w <= 97) {
            Y.fg = {
                type: "named",
                name: w$1[w - 90 + 8]
            }, z++;
            continue
        }
        if (w >= 100 && w <= 107) {
            Y.bg = {
                type: "named",
                name: w$1[w - 100 + 8]
            }, z++;
            continue
        }
        if (w === 38) {
            let O = Ij8(K, z);
            if (O) {
                Y.fg = "index" in O ? {
                    type: "indexed",
                    index: O.index
                } : {
                    type: "rgb",
                    ...O
                }, z += _.colon ? 1 : ("index" in O) ? 3 : 5;
                continue
            }
        }
        if (w === 48) {
            let O = Ij8(K, z);
            if (O) {
                Y.bg = "index" in O ? {
                    type: "indexed",
                    index: O.index
                } : {
                    type: "rgb",
                    ...O
                }, z += _.colon ? 1 : ("index" in O) ? 3 : 5;
                continue
            }
        }
        if (w === 58) {
            let O = Ij8(K, z);
            if (O) {
                Y.underlineColor = "index" in O ? {
                    type: "indexed",
                    index: O.index
                } : {
                    type: "rgb",
                    ...O
                }, z += _.colon ? 1 : ("index" in O) ? 3 : 5;
                continue
            }
        }
        if (w === 59) {
            Y.underlineColor = {
                type: "default"
            }, z++;
            continue
        }
        z++
    }
    return Y
}
// @from(Ln 162597, Col 4)
w$1
// @from(Ln 162597, Col 9)
Tc3
// @from(Ln 162598, Col 4)
qL7 = E(() => {
    w$1 = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "brightBlack", "brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta", "brightCyan", "brightWhite"], Tc3 = ["none", "single", "double", "curly", "dotted", "dashed"]
})
// @from(Ln 162602, Col 0)
function Nc3(A) {
    return A >= 9728 && A <= 9983 || A >= 9984 && A <= 10175 || A >= 127744 && A <= 129535 || A >= 129536 && A <= 129791 || A >= 127456 && A <= 127487
}
// @from(Ln 162606, Col 0)
function Vc3(A) {
    return A >= 4352 && A <= 4447 || A >= 11904 && A <= 40959 || A >= 44032 && A <= 55203 || A >= 63744 && A <= 64255 || A >= 65040 && A <= 65055 || A >= 65072 && A <= 65135 || A >= 65280 && A <= 65376 || A >= 65504 && A <= 65510 || A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141
}
// @from(Ln 162610, Col 0)
function kc3(A) {
    let q = 0;
    for (let K of A)
        if (q++, q > 1) return !0;
    return !1
}
// @from(Ln 162617, Col 0)
function Ec3(A) {
    if (kc3(A)) return 2;
    let q = A.codePointAt(0);
    if (q === void 0) return 1;
    if (Nc3(q) || Vc3(q)) return 2;
    return 1
}
// @from(Ln 162625, Col 0)
function* KL7(A) {
    for (let {
            segment: q
        }
        of bH().segment(A)) yield {
        value: q,
        width: Ec3(q)
    }
}
// @from(Ln 162635, Col 0)
function yc3(A) {
    if (A === "") return [];
    return A.split(/[;:]/).map((q) => q === "" ? 0 : parseInt(q, 10))
}
// @from(Ln 162640, Col 0)
function Lc3(A) {
    let q = A.slice(2);
    if (q.length === 0) return null;
    let K = q.charCodeAt(q.length - 1),
        Y = q.slice(0, -1),
        z = "",
        _ = Y,
        w = "";
    if (Y.length > 0 && "?>=".includes(Y[0])) z = Y[0], _ = Y.slice(1);
    let O = _.match(/([^0-9;:]+)$/);
    if (O) w = O[1], _ = _.slice(0, -w.length);
    let $ = yc3(_),
        H = $[0] ?? 1,
        j = $[1] ?? 1;
    if (K === K$.SGR && z === "") return {
        type: "sgr",
        params: _
    };
    if (K === K$.CUU) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "up",
            count: H
        }
    };
    if (K === K$.CUD) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "down",
            count: H
        }
    };
    if (K === K$.CUF) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "forward",
            count: H
        }
    };
    if (K === K$.CUB) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "back",
            count: H
        }
    };
    if (K === K$.CNL) return {
        type: "cursor",
        action: {
            type: "nextLine",
            count: H
        }
    };
    if (K === K$.CPL) return {
        type: "cursor",
        action: {
            type: "prevLine",
            count: H
        }
    };
    if (K === K$.CHA) return {
        type: "cursor",
        action: {
            type: "column",
            col: H
        }
    };
    if (K === K$.CUP || K === K$.HVP) return {
        type: "cursor",
        action: {
            type: "position",
            row: H,
            col: j
        }
    };
    if (K === K$.VPA) return {
        type: "cursor",
        action: {
            type: "row",
            row: H
        }
    };
    if (K === K$.ED) return {
        type: "erase",
        action: {
            type: "display",
            region: VV7[$[0] ?? 0] ?? "toEnd"
        }
    };
    if (K === K$.EL) return {
        type: "erase",
        action: {
            type: "line",
            region: kV7[$[0] ?? 0] ?? "toEnd"
        }
    };
    if (K === K$.ECH) return {
        type: "erase",
        action: {
            type: "chars",
            count: H
        }
    };
    if (K === K$.SU) return {
        type: "scroll",
        action: {
            type: "up",
            count: H
        }
    };
    if (K === K$.SD) return {
        type: "scroll",
        action: {
            type: "down",
            count: H
        }
    };
    if (K === K$.DECSTBM) return {
        type: "scroll",
        action: {
            type: "setRegion",
            top: H,
            bottom: j
        }
    };
    if (K === K$.SCOSC) return {
        type: "cursor",
        action: {
            type: "save"
        }
    };
    if (K === K$.SCORC) return {
        type: "cursor",
        action: {
            type: "restore"
        }
    };
    if (K === K$.DECSCUSR && w === " ") return {
        type: "cursor",
        action: {
            type: "style",
            ...OH8[H] ?? OH8[0]
        }
    };
    if (z === "?" && (K === K$.SM || K === K$.RM)) {
        let J = K === K$.SM;
        if (H === XO.CURSOR_VISIBLE) return {
            type: "cursor",
            action: J ? {
                type: "show"
            } : {
                type: "hide"
            }
        };
        if (H === XO.ALT_SCREEN_CLEAR || H === XO.ALT_SCREEN) return {
            type: "mode",
            action: {
                type: "alternateScreen",
                enabled: J
            }
        };
        if (H === XO.BRACKETED_PASTE) return {
            type: "mode",
            action: {
                type: "bracketedPaste",
                enabled: J
            }
        };
        if (H === XO.MOUSE_NORMAL) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: J ? "normal" : "off"
            }
        };
        if (H === XO.MOUSE_BUTTON) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: J ? "button" : "off"
            }
        };
        if (H === XO.MOUSE_ANY) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: J ? "any" : "off"
            }
        };
        if (H === XO.FOCUS_EVENTS) return {
            type: "mode",
            action: {
                type: "focusEvents",
                enabled: J
            }
        }
    }
    return {
        type: "unknown",
        sequence: A
    }
}
// @from(Ln 162847, Col 0)
function Rc3(A) {
    if (A.length < 2) return "unknown";
    if (A.charCodeAt(0) !== Tm.ESC) return "unknown";
    let q = A.charCodeAt(1);
    if (q === 91) return "csi";
    if (q === 93) return "osc";
    if (q === 79) return "ss3";
    return "esc"
}
// @from(Ln 162856, Col 0)
class O$1 {
    tokenizer = AX6();
    style = SX6();
    inLink = !1;
    linkUrl;
    reset() {
        this.tokenizer.reset(), this.style = SX6(), this.inLink = !1, this.linkUrl = void 0
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
            if (Y.charCodeAt(0) === Tm.BEL) {
                if (K) {
                    let z = [...KL7(K)];
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
            let Y = [...KL7(K)];
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
        switch (Rc3(A)) {
            case "csi": {
                let K = Lc3(A);
                if (!K) return [];
                if (K.type === "sgr") return this.style = AL7(K.params, this.style), [];
                return [K]
            }
            case "osc": {
                let K = A.slice(2);
                if (K.endsWith("\x07")) K = K.slice(0, -1);
                else if (K.endsWith("\x1B\\")) K = K.slice(0, -2);
                let Y = Rk7(K);
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
                    Y = ey7(K);
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
// @from(Ln 162952, Col 4)
YL7 = E(() => {
    $K6();
    uL();
    GK6();
    vm();
    qL7();
    JO1();
    AL()
})
// @from(Ln 162961, Col 4)
zL7 = E(() => {
    YL7()
})
// @from(Ln 162965, Col 0)
function hc3(A) {
    let K = new O$1().feed(A),
        Y = [],
        z;
    for (let _ of K) {
        if (_.type === "link") {
            if (_.action.type === "start") z = _.action.url;
            else z = void 0;
            continue
        }
        if (_.type === "text") {
            let w = _.graphemes.map((H) => H.value).join("");
            if (!w) continue;
            let O = Sc3(_.style);
            if (z) O.hyperlink = z;
            let $ = Y[Y.length - 1];
            if ($ && Ic3($.props, O)) $.text += w;
            else Y.push({
                text: w,
                props: O
            })
        }
    }
    return Y
}
// @from(Ln 162991, Col 0)
function Sc3(A) {
    let q = {};
    if (A.bold) q.bold = !0;
    if (A.dim) q.dim = !0;
    if (A.italic) q.italic = !0;
    if (A.underline !== "none") q.underline = !0;
    if (A.strikethrough) q.strikethrough = !0;
    if (A.inverse) q.inverse = !0;
    let K = _L7(A.fg);
    if (K) q.color = K;
    let Y = _L7(A.bg);
    if (Y) q.backgroundColor = Y;
    return q
}
// @from(Ln 163006, Col 0)
function _L7(A) {
    switch (A.type) {
        case "named":
            return Cc3[A.name];
        case "indexed":
            return `ansi256(${A.index})`;
        case "rgb":
            return `rgb(${A.r},${A.g},${A.b})`;
        case "default":
            return
    }
}
// @from(Ln 163019, Col 0)
function Ic3(A, q) {
    return A.color === q.color && A.backgroundColor === q.backgroundColor && A.bold === q.bold && A.dim === q.dim && A.italic === q.italic && A.underline === q.underline && A.strikethrough === q.strikethrough && A.inverse === q.inverse && A.hyperlink === q.hyperlink
}
// @from(Ln 163023, Col 0)
function bc3(A) {
    return A.color !== void 0 || A.backgroundColor !== void 0 || A.dim === !0 || A.bold === !0 || A.italic === !0 || A.underline === !0 || A.strikethrough === !0 || A.inverse === !0 || A.hyperlink !== void 0
}
// @from(Ln 163027, Col 0)
function xc3(A) {
    return A.color !== void 0 || A.backgroundColor !== void 0 || A.dim === !0 || A.bold === !0 || A.italic === !0 || A.underline === !0 || A.strikethrough === !0 || A.inverse === !0
}
// @from(Ln 163031, Col 0)
function wL7(A) {
    let q = A6(14),
        K, Y, z, _;
    if (q[0] !== A)({
        bold: K,
        dim: z,
        children: Y,
        ..._
    } = A), q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = _;
    else K = q[1], Y = q[2], z = q[3], _ = q[4];
    if (z) {
        let O;
        if (q[5] !== Y || q[6] !== _) O = lG.default.createElement(Kz, {
            ..._,
            dim: !0
        }, Y), q[5] = Y, q[6] = _, q[7] = O;
        else O = q[7];
        return O
    }
    if (K) {
        let O;
        if (q[8] !== Y || q[9] !== _) O = lG.default.createElement(Kz, {
            ..._,
            bold: !0
        }, Y), q[8] = Y, q[9] = _, q[10] = O;
        else O = q[10];
        return O
    }
    let w;
    if (q[11] !== Y || q[12] !== _) w = lG.default.createElement(Kz, {
        ..._
    }, Y), q[11] = Y, q[12] = _, q[13] = w;
    else w = q[13];
    return w
}
// @from(Ln 163066, Col 4)
lG
// @from(Ln 163066, Col 8)
wK
// @from(Ln 163066, Col 12)
Cc3
// @from(Ln 163067, Col 4)
OL7 = E(() => {
    e6();
    hK6();
    IK6();
    zL7();
    lG = t(P6(), 1), wK = lG.default.memo(function(q) {
        let K = A6(12),
            {
                children: Y,
                dimColor: z
            } = q;
        if (typeof Y !== "string") {
            let H;
            if (K[0] !== Y || K[1] !== z) H = z ? lG.default.createElement(Kz, {
                dim: !0
            }, String(Y)) : lG.default.createElement(Kz, null, String(Y)), K[0] = Y, K[1] = z, K[2] = H;
            else H = K[2];
            return H
        }
        if (Y === "") return null;
        let _, w;
        if (K[3] !== Y || K[4] !== z) {
            w = Symbol.for("react.early_return_sentinel");
            A: {
                let H = hc3(Y);
                if (H.length === 0) {
                    w = null;
                    break A
                }
                if (H.length === 1 && !bc3(H[0].props)) {
                    w = z ? lG.default.createElement(Kz, {
                        dim: !0
                    }, H[0].text) : lG.default.createElement(Kz, null, H[0].text);
                    break A
                }
                let j;
                if (K[7] !== z) j = (J, M) => {
                    let D = J.props.hyperlink;
                    if (z) J.props.dim = !0;
                    let X = xc3(J.props);
                    if (D) return X ? lG.default.createElement(y7, {
                        key: M,
                        url: D
                    }, lG.default.createElement(wL7, {
                        color: J.props.color,
                        backgroundColor: J.props.backgroundColor,
                        dim: J.props.dim,
                        bold: J.props.bold,
                        italic: J.props.italic,
                        underline: J.props.underline,
                        strikethrough: J.props.strikethrough,
                        inverse: J.props.inverse
                    }, J.text)) : lG.default.createElement(y7, {
                        key: M,
                        url: D
                    }, J.text);
                    return X ? lG.default.createElement(wL7, {
                        key: M,
                        color: J.props.color,
                        backgroundColor: J.props.backgroundColor,
                        dim: J.props.dim,
                        bold: J.props.bold,
                        italic: J.props.italic,
                        underline: J.props.underline,
                        strikethrough: J.props.strikethrough,
                        inverse: J.props.inverse
                    }, J.text) : J.text
                },
                K[7] = z,
                K[8] = j;
                else j = K[8];_ = H.map(j)
            }
            K[3] = Y, K[4] = z, K[5] = _, K[6] = w
        } else _ = K[5], w = K[6];
        if (w !== Symbol.for("react.early_return_sentinel")) return w;
        let O = _,
            $;
        if (K[9] !== O || K[10] !== z) $ = z ? lG.default.createElement(Kz, {
            dim: !0
        }, O) : lG.default.createElement(Kz, null, O), K[9] = O, K[10] = z, K[11] = $;
        else $ = K[11];
        return $
    });
    Cc3 = {
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
// @from(Ln 163170, Col 0)
function $$1(A) {
    let q = A6(6),
        {
            lines: K,
            width: Y
        } = A;
    if (K.length === 0) return null;
    let z;
    if (q[0] !== K) z = K.join(`
`), q[0] = K, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== K.length || q[3] !== z || q[4] !== Y) _ = $L7.default.createElement("ink-raw-ansi", {
        rawText: z,
        rawWidth: Y,
        rawHeight: K.length
    }), q[2] = K.length, q[3] = z, q[4] = Y, q[5] = _;
    else _ = q[5];
    return _
}
// @from(Ln 163190, Col 4)
$L7
// @from(Ln 163191, Col 4)
HL7 = E(() => {
    e6();
    $L7 = t(P6(), 1)
})
// @from(Ln 163196, Col 0)
function iG(A) {
    let q = A6(4),
        {
            count: K
        } = A,
        Y = K === void 0 ? 1 : K,
        z;
    if (q[0] !== Y) z = `
`.repeat(Y), q[0] = Y, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== z) _ = jL7.default.createElement("ink-text", null, z), q[2] = z, q[3] = _;
    else _ = q[3];
    return _
}
// @from(Ln 163211, Col 4)
jL7
// @from(Ln 163212, Col 4)
JL7 = E(() => {
    e6();
    jL7 = t(P6(), 1)
})
// @from(Ln 163217, Col 0)
function bj8() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = ML7.default.createElement(_X, {
        flexGrow: 1
    }), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 163226, Col 4)
ML7
// @from(Ln 163227, Col 4)
DL7 = E(() => {
    e6();
    TX6();
    ML7 = t(P6(), 1)
})
// @from(Ln 163233, Col 0)
function BU(A) {
    let q = A6(8),
        K, Y, z;
    if (q[0] !== A)({
        children: Y,
        fromLeftEdge: z,
        ...K
    } = A), q[0] = A, q[1] = K, q[2] = Y, q[3] = z;
    else K = q[1], Y = q[2], z = q[3];
    let _ = z ? "from-left-edge" : !0,
        w;
    if (q[4] !== K || q[5] !== Y || q[6] !== _) w = XL7.default.createElement(_X, {
        ...K,
        noSelect: _
    }, Y), q[4] = K, q[5] = Y, q[6] = _, q[7] = w;
    else w = q[7];
    return w
}
// @from(Ln 163251, Col 4)
XL7
// @from(Ln 163252, Col 4)
PL7 = E(() => {
    e6();
    TX6();
    XL7 = t(P6(), 1)
})
// @from(Ln 163257, Col 4)
WL7
// @from(Ln 163257, Col 9)
uc3 = () => WL7.useContext(GX6)
// @from(Ln 163258, Col 4)
Ms
// @from(Ln 163259, Col 4)
H$1 = E(() => {
    UO1();
    WL7 = t(P6(), 1), Ms = uc3
})