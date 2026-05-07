
// @from(Ln 186111, Col 0)
class Os6 {
    options;
    log;
    terminal;
    scheduleRender;
    isUnmounted = !1;
    isPaused = !1;
    container;
    rootNode;
    focusManager;
    renderer;
    stylePool;
    charPool;
    hyperlinkPool;
    exitPromise;
    restoreConsole;
    restoreStderr;
    unsubscribeTTYHandlers;
    terminalColumns;
    terminalRows;
    currentNode = null;
    frontFrame;
    backFrame;
    lastPoolResetTime = performance.now();
    drainTimer = null;
    lastYogaCounters = {
        ms: 0,
        visited: 0,
        measured: 0,
        cacheHits: 0,
        live: 0
    };
    altScreenParkPatch;
    selection = x34();
    searchHighlightQuery = "";
    searchPositions = null;
    selectionListeners = new Set;
    hoveredNodes = new Set;
    hasRendered = !1;
    renderCalled = !1;
    isExiting = !1;
    altScreenActive = !1;
    altScreenMouseTracking = !1;
    prevFrameContaminated = !1;
    prevOverlaySig = "";
    needsEraseBeforePaint = !1;
    cursorDeclaration = null;
    displayCursor = null;
    constructor(q) {
        this.options = q;
        if (tb1(this), this.options.patchConsole) this.restoreConsole = this.patchConsole(), this.restoreStderr = this.patchStderr();
        this.terminal = {
            stdout: q.stdout,
            stderr: q.stderr
        }, this.terminalColumns = q.stdout.columns || 80, this.terminalRows = q.stdout.rows || 24, this.altScreenParkPatch = XY4(this.terminalRows), this.stylePool = new rN8, this.charPool = new ua6, this.hyperlinkPool = new ma6, this.frontFrame = b46(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = b46(this.terminalRows, this.terminalColumns, this.stylePool, this.charPool, this.hyperlinkPool), this.log = new $u1({
            isTTY: q.stdout.isTTY || !1,
            stylePool: this.stylePool
        });
        let K = () => queueMicrotask(this.onRender);
        this.scheduleRender = VK4(K, C$6, {
            leading: !0,
            trailing: !0
        }), this.isUnmounted = !1, this.unsubscribeExit = b16(this.unmount, {
            alwaysLast: !1
        }), this.rootNode = Ra6("ink-root"), this.focusManager = new VN6((_, z) => iB.dispatchDiscrete(_, z)), this.rootNode.focusManager = this.focusManager, this.renderer = Eu1(this.rootNode, this.stylePool), this.rootNode.onRender = this.scheduleRender, this.rootNode.onImmediateRender = this.onRender, this.rootNode.onComputeLayout = () => {
            if (this.isUnmounted) return;
            if (this.rootNode.yogaNode) {
                let _ = performance.now(),
                    z = this.rootNode.yogaNode;
                if (this.options.stdout.isTTY || this.options.stdout.columns) z.setWidth(this.terminalColumns), z.calculateLayout(this.terminalColumns);
                else if (z.setWidthAuto(), z.calculateLayout(), z.getComputedWidth() > yu1) z.setWidth(yu1), z.calculateLayout(yu1);
                let Y = performance.now() - _;
                Z34(Y);
                let A = fN8();
                this.lastYogaCounters = {
                    ms: Y,
                    ...A
                }
            }
        }, this.container = Jd.createContainer(this.rootNode, KI1, null, !1, null, "id", xa, xa, xa, xa)
    }
    handleResume = () => {
        if (!this.options.stdout.isTTY) return;
        if (this.altScreenActive) {
            this.reenterAltScreen();
            return
        }
        this.frontFrame = b46(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = b46(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset(), this.displayCursor = null
    };
    handleResize = () => {
        let q = this.options.stdout.columns || 80,
            K = this.options.stdout.rows || 24;
        if (q === this.terminalColumns && K === this.terminalRows) return;
        if (this.terminalColumns = q, this.terminalRows = K, this.altScreenParkPatch = XY4(this.terminalRows), this.altScreenActive && !this.isPaused && this.options.stdout.isTTY) {
            if (this.altScreenMouseTracking) this.options.stdout.write(S$6);
            this.resetFramesForAltScreen(), this.needsEraseBeforePaint = !0
        }
        if (this.currentNode !== null) this.render(this.currentNode)
    };
    resolveExitPromise = () => {};
    rejectExitPromise = () => {};
    unsubscribeExit = () => {};
    enterAlternateScreen() {
        this.pause(), this.suspendStdin(), this.options.stdout.write(ba + W$6 + (this.altScreenMouseTracking ? da : "") + (this.altScreenActive ? "" : "\x1B[?1049h") + "\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H")
    }
    exitAlternateScreen() {
        if (this.options.stdout.write((this.altScreenActive ? oa6 : "") + "\x1B[2J\x1B[H" + (this.altScreenMouseTracking ? S$6 : "") + (this.altScreenActive ? "" : "\x1B[?1049l") + "\x1B[?25l"), this.resumeStdin(), this.altScreenActive) this.resetFramesForAltScreen();
        else this.repaint();
        this.resume(), this.options.stdout.write("\x1B[?1004h" + (aa6() ? ba + ja6 + Ha6 : ""))
    }
    ensureInteractive = () => {
        if (this.unsubscribeTTYHandlers || !this.options.stdout.isTTY) return;
        if (!S6(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.options.stdout.write(CN6);
        this.options.stdout.on("resize", this.handleResize), process.on("SIGCONT", this.handleResume), this.unsubscribeTTYHandlers = () => {
            this.options.stdout.off("resize", this.handleResize), process.off("SIGCONT", this.handleResume)
        }
    };
    skipSyncMarkers() {
        if (!this.options.stdout.isTTY) return !0;
        if (!IN6()) return !0;
        if (!this.unsubscribeTTYHandlers) return !0;
        return !1
    }
    onRender() {
        if (this.isUnmounted || this.isPaused) return;
        if (this.hasRendered && !this.isExiting) this.ensureInteractive();
        if (this.hasRendered = !0, this.drainTimer !== null) clearTimeout(this.drainTimer), this.drainTimer = null;
        I61();
        let q = performance.now(),
            K = this.options.stdout.columns || 80,
            _ = this.options.stdout.rows || 24,
            {
                anchor: z,
                focus: Y
            } = this.selection,
            A = this.searchPositions,
            O = `${z?.row},${z?.col},${Y?.row},${Y?.col}|${this.searchHighlightQuery}|${A?.currentIdx},${A?.rowOffset},${A?.positions.length}`,
            w = this.prevFrameContaminated || O !== this.prevOverlaySig;
        this.prevOverlaySig = O;
        let $ = z !== null && Y !== null || !!this.searchHighlightQuery || !!A,
            j = this.renderer({
                frontFrame: this.frontFrame,
                backFrame: this.backFrame,
                isTTY: this.options.stdout.isTTY,
                terminalWidth: K,
                terminalRows: _,
                altScreen: this.altScreenActive,
                prevFrameContaminated: w,
                overlayActive: $
            }),
            H = performance.now() - q,
            J = KY4();
        if (J && this.selection.anchor && this.selection.anchor.row >= J.viewportTop && this.selection.anchor.row <= J.viewportBottom) {
            let {
                delta: g,
                viewportTop: c,
                viewportBottom: n
            } = J;
            if (this.selection.isDragging) {
                if (kI(this.selection)) qE8(this.selection, this.frontFrame.screen, c, c + g - 1, "above");
                eN8(this.selection, -g, c, n)
            } else if (!this.selection.focus || this.selection.focus.row >= c && this.selection.focus.row <= n) {
                if (kI(this.selection)) qE8(this.selection, this.frontFrame.screen, c, c + g - 1, "above");
                if (d34(this.selection, -g, c, n))
                    for (let z6 of this.selectionListeners) z6()
            }
        }
        let X = !1,
            M = !1;
        if (this.altScreenActive) {
            if (X = kI(this.selection), X) n34(j.screen, this.selection, this.stylePool);
            if (M = wY4(j.screen, this.searchHighlightQuery, this.stylePool), this.searchPositions) {
                let g = this.searchPositions,
                    c = YY4(j.screen, this.stylePool, g.positions, g.rowOffset, g.currentIdx);
                M = M || c
            }
        }
        if (rz4() || X || M || w) j.screen.damage = {
            x: 0,
            y: 0,
            width: j.screen.width,
            height: j.screen.height
        };
        let P = this.frontFrame;
        if (this.altScreenActive) P = {
            ...this.frontFrame,
            cursor: ox_
        };
        let W = performance.now(),
            D = this.log.render(P, j, this.altScreenActive, DE8),
            Z = performance.now() - W;
        if (this.backFrame = this.frontFrame, this.frontFrame = j, q - this.lastPoolResetTime > 300000) this.resetPools(), this.lastPoolResetTime = q;
        let G = [];
        for (let g of D)
            if (g.type === "clearTerminal") {
                if (G.push({
                        desiredHeight: j.screen.height,
                        availableHeight: j.viewport.height,
                        reason: g.reason
                    }), Dx1() && g.debug) {
                    let c = t54(this.rootNode, g.debug.triggerY);
                    E(`[REPAINT] full reset · ${g.reason} · row ${g.debug.triggerY}
  prev: "${g.debug.prevLine}"
  next: "${g.debug.nextLine}"
  culprit: ${c.length?c.join(" < "):"(no owner chain captured)"}`, {
                        level: "warn"
                    })
                }
            } let f = performance.now(),
            v = Hu1(D),
            V = performance.now() - f,
            k = v.length > 0;
        if (this.altScreenActive && k) {
            if (this.needsEraseBeforePaint) this.needsEraseBeforePaint = !1, v.unshift(sx_);
            else v.unshift(ax_);
            v.push(this.altScreenParkPatch)
        }
        let N = this.cursorDeclaration,
            R = N !== null ? S$.get(N.node) : void 0,
            h = N !== null && R !== void 0 ? {
                x: R.x + N.relativeX,
                y: R.y + N.relativeY
            } : null,
            C = this.displayCursor,
            x = h !== null && (C === null || C.x !== h.x || C.y !== h.y);
        if (k || x || h === null && C !== null) {
            if (C !== null && !this.altScreenActive && k) {
                let g = P.cursor.x - C.x,
                    c = P.cursor.y - C.y;
                if (g !== 0 || c !== 0) v.unshift({
                    type: "stdout",
                    content: P$6(g, c)
                })
            }
            if (h !== null) {
                if (this.altScreenActive) {
                    let g = Math.min(Math.max(h.y + 1, 1), _),
                        c = Math.min(Math.max(h.x + 1, 1), K);
                    v.push({
                        type: "stdout",
                        content: Qb1(g, c)
                    })
                } else {
                    let g = !k && C !== null ? C : {
                            x: j.cursor.x,
                            y: j.cursor.y
                        },
                        c = h.x - g.x,
                        n = h.y - g.y;
                    if (c !== 0 || n !== 0) v.push({
                        type: "stdout",
                        content: P$6(c, n)
                    })
                }
                this.displayCursor = h
            } else {
                if (C !== null && !this.altScreenActive && !k) {
                    let g = j.cursor.x - C.x,
                        c = j.cursor.y - C.y;
                    if (g !== 0 || c !== 0) v.push({
                        type: "stdout",
                        content: P$6(g, c)
                    })
                }
                this.displayCursor = null
            }
        }
        let B = performance.now();
        nx1(this.terminal, v, this.skipSyncMarkers());
        let m = performance.now() - B;
        if (this.prevFrameContaminated = !1, j.scrollDrainPending) this.drainTimer = setTimeout(() => this.onRender(), C$6 >> 2);
        let S = f34(),
            F = v34(),
            U = this.lastYogaCounters;
        T34(), this.lastYogaCounters = {
            ms: 0,
            visited: 0,
            measured: 0,
            cacheHits: 0,
            live: 0
        }, this.options.onFrame?.({
            durationMs: performance.now() - q,
            phases: {
                renderer: H,
                diff: Z,
                optimize: V,
                write: m,
                patches: D.length,
                yoga: S,
                commit: F,
                yogaVisited: U.visited,
                yogaMeasured: U.measured,
                yogaCacheHits: U.cacheHits,
                yogaLive: U.live
            },
            flickers: G
        })
    }
    pause() {
        Jd.flushSyncFromReconciler(), this.onRender(), this.isPaused = !0
    }
    resume() {
        this.isPaused = !1, this.onRender()
    }
    repaint() {
        this.frontFrame = b46(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.backFrame = b46(this.backFrame.viewport.height, this.backFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset(), this.displayCursor = null
    }
    forceRedraw() {
        if (!this.options.stdout.isTTY || this.isUnmounted || this.isPaused) return;
        if (this.options.stdout.write(Od + fI), this.altScreenActive) this.resetFramesForAltScreen();
        else this.repaint(), this.prevFrameContaminated = !0;
        this.onRender()
    }
    invalidatePrevFrame() {
        this.prevFrameContaminated = !0
    }
    setAltScreenActive(q, K = !1) {
        if (this.altScreenActive === q) return;
        if (this.altScreenActive = q, this.altScreenMouseTracking = q && K, q) this.ensureInteractive(), this.resetFramesForAltScreen();
        else this.repaint()
    }
    get isAltScreenActive() {
        return this.altScreenActive
    }
    reassertTerminalModes = (q = !1) => {
        if (!this.options.stdout.isTTY) return;
        if (this.isPaused) return;
        if (aa6()) this.options.stdout.write(ba + ja6 + Ha6);
        if (!this.altScreenActive) return;
        if (this.altScreenMouseTracking) this.options.stdout.write(S$6);
        if (q) this.reenterAltScreen()
    };
    detachForShutdown() {
        if (!this.isUnmounted && !this.altScreenActive && this.displayCursor !== null && this.options.stdout.isTTY) {
            let K = this.frontFrame.cursor.x - this.displayCursor.x,
                _ = this.frontFrame.cursor.y - this.displayCursor.y;
            if (K !== 0 || _ !== 0) sB(1, P$6(K, _));
            this.displayCursor = null
        }
        this.isUnmounted = !0, this.scheduleRender.cancel?.();
        let q = this.options.stdin;
        if (this.drainStdin(), q.isTTY && q.isRaw && q.setRawMode) q.setRawMode(!1);
        for (let K of new Set([q, process.stdin])) K.removeAllListeners("readable"), K.removeAllListeners("data"), K.removeAllListeners("keypress"), K.pause(), K.unref?.()
    }
    drainStdin() {
        MY4(this.options.stdin)
    }
    reenterAltScreen() {
        this.options.stdout.write(oa6 + Od + fI + (this.altScreenMouseTracking ? S$6 : "")), this.resetFramesForAltScreen()
    }
    resetFramesForAltScreen() {
        let q = this.terminalRows,
            K = this.terminalColumns,
            _ = () => ({
                screen: ga(K, q, this.stylePool, this.charPool, this.hyperlinkPool),
                viewport: {
                    width: K,
                    height: q + 1
                },
                cursor: {
                    x: 0,
                    y: 0,
                    visible: !0
                }
            });
        this.frontFrame = _(), this.backFrame = _(), this.log.reset(), this.displayCursor = null, this.prevFrameContaminated = !0
    }
    copySelectionNoClear() {
        if (!kI(this.selection)) return "";
        let q = l34(this.selection, this.frontFrame.screen);
        if (q) hP(q).then((K) => {
            if (K) this.options.stdout.write(K)
        });
        return q
    }
    copySelection() {
        if (!kI(this.selection)) return "";
        let q = this.copySelectionNoClear();
        return ga6(this.selection), this.notifySelectionChange(), q
    }
    clearTextSelection() {
        if (!kI(this.selection)) return;
        ga6(this.selection), this.notifySelectionChange()
    }
    setSearchHighlight(q) {
        if (this.searchHighlightQuery === q) return;
        this.searchHighlightQuery = q, this.scheduleRender()
    }
    scanElementSubtree(q) {
        if (!this.searchHighlightQuery || !q.yogaNode) return [];
        let K = Math.ceil(q.yogaNode.getComputedWidth()),
            _ = Math.ceil(q.yogaNode.getComputedHeight());
        if (K <= 0 || _ <= 0) return [];
        let z = q.yogaNode.getComputedLeft(),
            Y = q.yogaNode.getComputedTop(),
            A = ga(K, _, this.stylePool, this.charPool, this.hyperlinkPool),
            O = new x$6({
                width: K,
                height: _,
                stylePool: this.stylePool,
                screen: A
            });
        Ys6(q, O, {
            offsetX: -z,
            offsetY: -Y,
            prevScreen: void 0
        });
        let w = O.get();
        WD(q);
        let $ = zY4(w, this.searchHighlightQuery);
        return E(`scanElementSubtree: q='${this.searchHighlightQuery}' el=${K}x${_}@(${z},${Y}) n=${$.length} [${$.slice(0,10).map((j)=>`${j.row}:${j.col}`).join(",")}${$.length>10?",…":""}]`), $
    }
    setSearchPositions(q) {
        this.searchPositions = q, this.scheduleRender()
    }
    setSelectionBgColor(q) {
        let K = G46("\x00", q, "background"),
            _ = K.indexOf("\x00");
        if (_ <= 0 || _ === K.length - 1) {
            this.stylePool.setSelectionBg(null);
            return
        }
        this.stylePool.setSelectionBg({
            type: "ansi",
            code: K.slice(0, _),
            endCode: K.slice(_ + 1)
        })
    }
    captureScrolledRows(q, K, _) {
        qE8(this.selection, this.frontFrame.screen, q, K, _)
    }
    shiftSelectionForScroll(q, K, _) {
        let z = kI(this.selection);
        if (Q34(this.selection, q, K, _, this.frontFrame.screen.width), z && !kI(this.selection)) this.notifySelectionChange()
    }
    moveSelectionFocus(q) {
        if (!this.altScreenActive) return;
        let {
            focus: K
        } = this.selection;
        if (!K) return;
        let {
            width: _,
            height: z
        } = this.frontFrame.screen, Y = _ - 1, A = z - 1, {
            col: O,
            row: w
        } = K;
        switch (q) {
            case "left":
                if (O > 0) O--;
                else if (w > 0) O = Y, w--;
                break;
            case "right":
                if (O < Y) O++;
                else if (w < A) O = 0, w++;
                break;
            case "up":
                if (w > 0) w--;
                break;
            case "down":
                if (w < A) w++;
                break;
            case "lineStart":
                O = 0;
                break;
            case "lineEnd":
                O = Y;
                break
        }
        if (O === K.col && w === K.row) return;
        U34(this.selection, O, w), this.notifySelectionChange()
    }
    hasTextSelection() {
        return kI(this.selection)
    }
    subscribeToSelectionChange(q) {
        return this.selectionListeners.add(q), () => this.selectionListeners.delete(q)
    }
    notifySelectionChange() {
        this.scheduleRender();
        for (let q of this.selectionListeners) q()
    }
    dispatchClick(q, K) {
        if (!this.altScreenActive) return !1;
        let _ = pa6(this.frontFrame.screen, q, K),
            z = this.getHyperlinkAt(q, K);
        return Tz4(this.rootNode, q, K, _, z)
    }
    dispatchHover(q, K) {
        if (!this.altScreenActive) return;
        let _ = pa6(this.frontFrame.screen, q, K);
        Vz4(this.rootNode, q, K, this.hoveredNodes, _)
    }
    dispatchPasteEvent(q) {
        let K = this.focusManager.activeElement ?? this.rootNode;
        iB.dispatchDiscrete(K, new zu1(q))
    }
    dispatchWheelEvent(q) {
        let K = this.focusManager.activeElement ?? this.rootNode,
            _ = q.name === "wheeldown" ? 1 : -1;
        iB.dispatchContinuous(K, new Yu1(_, {
            ctrl: q.ctrl,
            shift: q.shift,
            meta: q.meta || q.option
        }))
    }
    dispatchKeyboardEvent(q) {
        let _ = this.focusManager.activeElement ?? this.rootNode,
            z = new Ks6(q);
        if (iB.dispatchDiscrete(_, z), !z.defaultPrevented && q.name === "tab" && !q.ctrl && !q.meta)
            if (q.shift) this.focusManager.focusPrevious(this.rootNode);
            else this.focusManager.focusNext(this.rootNode)
    }
    getHyperlinkAt(q, K) {
        if (!this.altScreenActive) return;
        let _ = this.frontFrame.screen,
            z = Tf(_, q, K),
            Y = z?.hyperlink;
        if (!Y && z?.width === 2 && q > 0) Y = Tf(_, q - 1, K)?.hyperlink;
        return Y ?? p34(_, q, K)
    }
    onHyperlinkClick;
    openHyperlink(q) {
        this.onHyperlinkClick?.(q)
    }
    handleMultiClick(q, K, _) {
        if (!this.altScreenActive) return;
        let z = this.frontFrame.screen;
        if (tN8(this.selection, q, K), _ === 2) B34(this.selection, z, q, K);
        else F34(this.selection, z, K);
        if (!this.selection.focus) this.selection.focus = this.selection.anchor;
        this.notifySelectionChange()
    }
    handleSelectionDrag(q, K) {
        if (!this.altScreenActive) return;
        let _ = this.selection;
        if (_.anchorSpan) g34(_, this.frontFrame.screen, q, K);
        else u34(_, q, K);
        this.notifySelectionChange()
    }
    stdinListeners = [];
    wasRawMode = !1;
    suspendStdin() {
        let q = this.options.stdin;
        if (!q.isTTY) return;
        let K = q.listeners("readable");
        E(`[stdin] suspendStdin: removing ${K.length} readable listener(s), wasRawMode=${q.isRaw??!1}`), K.forEach((z) => {
            this.stdinListeners.push({
                event: "readable",
                listener: z
            }), q.removeListener("readable", z)
        });
        let _ = q;
        if (_.isRaw && _.setRawMode) _.setRawMode(!1), this.wasRawMode = !0
    }
    resumeStdin() {
        let q = this.options.stdin;
        if (!q.isTTY) return;
        if (this.stdinListeners.length === 0 && !this.wasRawMode) E("[stdin] resumeStdin: called with no stored listeners and wasRawMode=false (possible desync)", {
            level: "warn"
        });
        if (E(`[stdin] resumeStdin: re-attaching ${this.stdinListeners.length} listener(s), wasRawMode=${this.wasRawMode}`), this.stdinListeners.forEach(({
                event: K,
                listener: _
            }) => {
                q.addListener(K, _)
            }), this.stdinListeners = [], this.wasRawMode) {
            let K = q;
            if (K.setRawMode) K.setRawMode(!0);
            this.wasRawMode = !1
        }
    }
    writeRaw(q) {
        this.options.stdout.write(q)
    }
    setCursorDeclaration = (q, K) => {
        if (q === null && K !== void 0 && this.cursorDeclaration?.node !== K) return;
        this.cursorDeclaration = q
    };
    render(q) {
        this.renderCalled = !0, this.currentNode = q;
        let K = Lu1.default.createElement(vE8, {
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
            onHoverAt: this.dispatchHover,
            getHyperlinkAt: this.getHyperlinkAt,
            onOpenHyperlink: this.openHyperlink,
            onMultiClick: this.handleMultiClick,
            onSelectionDrag: this.handleSelectionDrag,
            onStdinResume: this.reassertTerminalModes,
            onRawModeEnter: this.ensureInteractive,
            onCursorDeclaration: this.setCursorDeclaration,
            dispatchKeyboardEvent: this.dispatchKeyboardEvent,
            dispatchPasteEvent: this.dispatchPasteEvent,
            dispatchWheelEvent: this.dispatchWheelEvent,
            focusManager: this.focusManager,
            rootNode: this.rootNode
        }, Lu1.default.createElement(jY4, {
            value: this.writeRaw
        }, q));
        Jd.updateContainerSync(K, this.container, null, xa), Jd.flushSyncWork()
    }
    unmount(q) {
        if (this.isUnmounted) return;
        if (this.isExiting = !0, this.onRender(), this.unsubscribeExit(), typeof this.restoreConsole === "function") this.restoreConsole();
        if (this.restoreStderr?.(), this.unsubscribeTTYHandlers?.(), this.renderCalled) {
            let K = this.log.renderPreviousOutput_DEPRECATED(this.frontFrame);
            nx1(this.terminal, Hu1(K), this.skipSyncMarkers())
        }
        if (this.options.stdout.isTTY) {
            if (this.altScreenActive) sB(1, bN6);
            if (sB(1, da), this.drainStdin(), sB(1, W$6), sB(1, ba), sB(1, R$6), sB(1, SN6), sB(1, RN6), sB(1, aB), sB(1, ON8), Ia()) sB(1, LP(wN6))
        }
        if (this.isUnmounted = !0, this.scheduleRender.cancel?.(), this.drainTimer !== null) clearTimeout(this.drainTimer), this.drainTimer = null;
        if (Jd.updateContainerSync(null, this.container, null, xa), Jd.flushSyncWork(), KO.delete(this.options.stdout), this.rootNode.yogaNode?.free(), this.rootNode.yogaNode = void 0, q instanceof Error) this.rejectExitPromise(q);
        else this.resolveExitPromise()
    }
    async waitUntilExit() {
        return this.exitPromise ||= new Promise((q, K) => {
            this.resolveExitPromise = q, this.rejectExitPromise = K
        }), this.exitPromise
    }
    resetLineCount() {
        if (this.options.stdout.isTTY) this.backFrame = this.frontFrame, this.frontFrame = b46(this.frontFrame.viewport.height, this.frontFrame.viewport.width, this.stylePool, this.charPool, this.hyperlinkPool), this.log.reset(), this.displayCursor = null
    }
    resetPools() {
        this.charPool = new ua6, this.hyperlinkPool = new ma6, y34(this.frontFrame.screen, this.charPool, this.hyperlinkPool), this.backFrame.screen.charPool = this.charPool, this.backFrame.screen.hyperlinkPool = this.hyperlinkPool
    }
    patchConsole() {
        let q = console,
            K = {},
            _ = (...Y) => E(`console.log: ${JY4(...Y)}`),
            z = (...Y) => j6(Error(`console.error: ${JY4(...Y)}`));
        for (let Y of tx_) K[Y] = q[Y], q[Y] = _;
        for (let Y of ex_) K[Y] = q[Y], q[Y] = z;
        return K.assert = q.assert, q.assert = (Y, ...A) => {
            if (!Y) z(...A)
        }, () => Object.assign(q, K)
    }
    patchStderr() {
        let q = process.stderr,
            K = q.write,
            _ = !1,
            z = (Y, A, O) => {
                let w = typeof A === "function" ? A : O;
                if (_) {
                    let $ = typeof A === "string" ? A : void 0;
                    return K.call(q, Y, $, w)
                }
                _ = !0;
                try {
                    let $ = typeof Y === "string" ? Y : Buffer.from(Y).toString("utf8");
                    if (E(`[stderr] ${$}`, {
                            level: "warn"
                        }), this.altScreenActive && !this.isUnmounted && !this.isPaused) this.prevFrameContaminated = !0, this.scheduleRender()
                } finally {
                    _ = !1, w?.()
                }
                return !0
            };
        return q.write = z, () => {
            if (q.write === z) q.write = K
        }
    }
}
// @from(Ln 186786, Col 0)
function MY4(q = process.stdin) {
    if (!q.isTTY) return;
    try {
        while (q.read() !== null);
    } catch {}
    if (process.platform === "win32") return;
    let K = q,
        _ = K.isRaw === !0,
        z = -1;
    try {
        if (!_) K.setRawMode?.(!0);
        z = ix_("/dev/tty", HY4.O_RDONLY | HY4.O_NONBLOCK);
        let Y = Buffer.alloc(1024);
        for (let A = 0; A < 64; A++)
            if (rx_(z, Y, 0, Y.length, null) <= 0) break
    } catch {} finally {
        if (z >= 0) try {
            nx_(z)
        } catch {}
        if (!_) try {
            K.setRawMode?.(!1)
        } catch {}
    }
}
// @from(Ln 186810, Col 4)
Lu1
// @from(Ln 186810, Col 9)
yu1 = 8192
// @from(Ln 186811, Col 4)
ox_
// @from(Ln 186811, Col 9)
ax_
// @from(Ln 186811, Col 14)
sx_
// @from(Ln 186811, Col 19)
tx_
// @from(Ln 186811, Col 24)
ex_
// @from(Ln 186812, Col 4)
hu1 = L(() => {
    eb1();
    kK4();
    XN8();
    jQ6();
    y8();
    GN8();
    C8();
    K8();
    Q8();
    U8();
    G$6();
    Zz4();
    TN6();
    _u1();
    fz4();
    Gz4();
    lB();
    vz4();
    kz4();
    Yk();
    Lz4();
    v$6();
    EE8();
    xa6();
    RE8();
    AY4();
    OY4();
    Xd();
    $Y4();
    KE8();
    la();
    GI();
    R46();
    HX();
    Gd();
    Lu1 = K6(P6(), 1), ox_ = Object.freeze({
        x: 0,
        y: 0,
        visible: !1
    }), ax_ = Object.freeze({
        type: "stdout",
        content: fI
    }), sx_ = Object.freeze({
        type: "stdout",
        content: Od + fI
    });
    tx_ = ["log", "info", "debug", "dir", "dirxml", "count", "countReset", "group", "groupCollapsed", "groupEnd", "table", "time", "timeEnd", "timeLog"], ex_ = ["warn", "error", "trace"]
})
// @from(Ln 186864, Col 0)
async function PY4({
    stdout: q = process.stdout,
    stdin: K = process.stdin,
    stderr: _ = process.stderr,
    exitOnCtrlC: z = !0,
    patchConsole: Y = !0,
    onFrame: A
} = {}) {
    await Promise.resolve();
    let O = new Os6({
        stdout: q,
        stdin: K,
        stderr: _,
        exitOnCtrlC: z,
        patchConsole: Y,
        onFrame: A
    });
    return KO.set(q, O), {
        render: (w) => O.render(w),
        unmount: () => O.unmount(),
        waitUntilExit: () => O.waitUntilExit()
    }
}
// @from(Ln 186887, Col 4)
Ku_ = (q, K) => {
        let _ = zu_(K),
            z = {
                stdout: process.stdout,
                stdin: process.stdin,
                stderr: process.stderr,
                exitOnCtrlC: !0,
                patchConsole: !0,
                ..._
            },
            Y = Yu_(z.stdout, () => new Os6(z));
        return Y.render(q), {
            rerender: Y.render,
            unmount() {
                Y.unmount()
            },
            waitUntilExit: Y.waitUntilExit,
            cleanup: () => KO.delete(z.stdout)
        }
    }
// @from(Ln 186907, Col 4)
_u_ = async (q, K) => {
        await Promise.resolve();
        let _ = Ku_(q, K);
        return E(`[render] first ink render: ${Math.round(process.uptime()*1000)}ms since process start`), _
    }
// @from(Ln 186911, Col 7)
WY4
// @from(Ln 186911, Col 12)
zu_ = (q = {}) => {
        if (q instanceof qu_) return {
            stdout: q,
            stdin: process.stdin
        };
        return q
    }
// @from(Ln 186917, Col 7)
Yu_ = (q, K) => {
        let _ = KO.get(q);
        if (!_) _ = K(), KO.set(q, _);
        return _
    }
// @from(Ln 186922, Col 4)
DY4 = L(() => {
    K8();
    hu1();
    Yk();
    WY4 = _u_
})
// @from(Ln 186929, Col 0)
function DD(q) {
    switch (q) {
        case "light":
            return Ou_;
        case "light-ansi":
            return wu_;
        case "dark-ansi":
            return $u_;
        case "light-daltonized":
            return ju_;
        case "dark-daltonized":
            return Ju_;
        default:
            return Hu_
    }
}
// @from(Ln 186946, Col 0)
function SE8(q) {
    let K = q.match(/rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)/);
    if (K) {
        let _ = parseInt(K[1], 10),
            z = parseInt(K[2], 10),
            Y = parseInt(K[3], 10),
            A = Xu_.rgb(_, z, Y)("X");
        return A.slice(0, A.indexOf("X"))
    }
    return "\x1B[35m"
}
// @from(Ln 186957, Col 4)
Au_
// @from(Ln 186957, Col 9)
ZY4
// @from(Ln 186957, Col 14)
Ou_
// @from(Ln 186957, Col 19)
wu_
// @from(Ln 186957, Col 24)
$u_
// @from(Ln 186957, Col 29)
ju_
// @from(Ln 186957, Col 34)
Hu_
// @from(Ln 186957, Col 39)
Ju_
// @from(Ln 186957, Col 44)
Xu_
// @from(Ln 186958, Col 4)
tB = L(() => {
    Y3();
    D_();
    Au_ = ["dark", "light", "light-daltonized", "dark-daltonized", "light-ansi", "dark-ansi"], ZY4 = ["auto", ...Au_], Ou_ = {
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
        userMessageBackgroundHover: "rgb(252, 252, 252)",
        messageActionsBackground: "rgb(232, 236, 244)",
        selectionBg: "rgb(180, 213, 255)",
        bashMessageBackgroundColor: "rgb(250, 245, 250)",
        memoryBackgroundColor: "rgb(230, 245, 250)",
        rate_limit_fill: "rgb(87,105,247)",
        rate_limit_empty: "rgb(39,47,111)",
        fastMode: "rgb(255,106,0)",
        fastModeShimmer: "rgb(255,150,50)",
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
    }, wu_ = {
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
        userMessageBackgroundHover: "ansi:whiteBright",
        messageActionsBackground: "ansi:white",
        selectionBg: "ansi:cyan",
        bashMessageBackgroundColor: "ansi:whiteBright",
        memoryBackgroundColor: "ansi:white",
        rate_limit_fill: "ansi:yellow",
        rate_limit_empty: "ansi:black",
        fastMode: "ansi:red",
        fastModeShimmer: "ansi:redBright",
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
    }, $u_ = {
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
        userMessageBackgroundHover: "ansi:white",
        messageActionsBackground: "ansi:blackBright",
        selectionBg: "ansi:blue",
        bashMessageBackgroundColor: "ansi:black",
        memoryBackgroundColor: "ansi:blackBright",
        rate_limit_fill: "ansi:yellow",
        rate_limit_empty: "ansi:white",
        fastMode: "ansi:redBright",
        fastModeShimmer: "ansi:redBright",
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
    }, ju_ = {
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
        userMessageBackgroundHover: "rgb(232, 232, 232)",
        messageActionsBackground: "rgb(210, 216, 226)",
        selectionBg: "rgb(180, 213, 255)",
        bashMessageBackgroundColor: "rgb(250, 245, 250)",
        memoryBackgroundColor: "rgb(230, 245, 250)",
        rate_limit_fill: "rgb(51,102,255)",
        rate_limit_empty: "rgb(23,46,114)",
        fastMode: "rgb(255,106,0)",
        fastModeShimmer: "rgb(255,150,50)",
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
    }, Hu_ = {
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
        userMessageBackgroundHover: "rgb(70, 70, 70)",
        messageActionsBackground: "rgb(44, 50, 62)",
        selectionBg: "rgb(38, 79, 120)",
        bashMessageBackgroundColor: "rgb(65, 60, 65)",
        memoryBackgroundColor: "rgb(55, 65, 70)",
        rate_limit_fill: "rgb(177,185,249)",
        rate_limit_empty: "rgb(80,83,112)",
        fastMode: "rgb(255,120,20)",
        fastModeShimmer: "rgb(255,165,70)",
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
    }, Ju_ = {
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
        userMessageBackgroundHover: "rgb(70, 70, 70)",
        messageActionsBackground: "rgb(44, 50, 62)",
        selectionBg: "rgb(38, 79, 120)",
        bashMessageBackgroundColor: "rgb(65, 60, 65)",
        memoryBackgroundColor: "rgb(55, 65, 70)",
        rate_limit_fill: "rgb(153,204,255)",
        rate_limit_empty: "rgb(69,92,115)",
        fastMode: "rgb(255,120,20)",
        fastModeShimmer: "rgb(255,165,70)",
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
    Xu_ = X7.terminal === "Apple_Terminal" ? new JY1({
        level: 2
    }) : Y8
})
// @from(Ln 187387, Col 0)
function d7(q, K, _ = "foreground") {
    return (z) => {
        if (!q) return z;
        if (q.startsWith("rgb(") || q.startsWith("#") || q.startsWith("ansi256(") || q.startsWith("ansi:")) return G46(z, q, _);
        return G46(z, DD(K)[q], _)
    }
}
// @from(Ln 187394, Col 4)
u$6 = L(() => {
    G$6();
    tB()
})
// @from(Ln 187399, Col 0)
function QN6(q, K) {
    if (!q) return;
    if (q.startsWith("rgb(") || q.startsWith("#") || q.startsWith("ansi256(") || q.startsWith("ansi:")) return q;
    return K[q]
}
// @from(Ln 187405, Col 0)
function Mu_(q) {
    let K = s(33),
        _, z, Y, A, O, w, $, j, H;
    if (K[0] !== q)({
        borderColor: Y,
        borderTopColor: w,
        borderBottomColor: z,
        borderLeftColor: A,
        borderRightColor: O,
        backgroundColor: _,
        children: $,
        ref: j,
        ...H
    } = q), K[0] = q, K[1] = _, K[2] = z, K[3] = Y, K[4] = A, K[5] = O, K[6] = w, K[7] = $, K[8] = j, K[9] = H;
    else _ = K[1], z = K[2], Y = K[3], A = K[4], O = K[5], w = K[6], $ = K[7], j = K[8], H = K[9];
    let [J] = Zq(), X, M, P, W, D, Z;
    if (K[10] !== _ || K[11] !== z || K[12] !== Y || K[13] !== A || K[14] !== O || K[15] !== w || K[16] !== J) {
        let v = DD(J);
        M = QN6(Y, v), D = QN6(w, v), X = QN6(z, v), P = QN6(A, v), W = QN6(O, v), Z = QN6(_, v), K[10] = _, K[11] = z, K[12] = Y, K[13] = A, K[14] = O, K[15] = w, K[16] = J, K[17] = X, K[18] = M, K[19] = P, K[20] = W, K[21] = D, K[22] = Z
    } else X = K[17], M = K[18], P = K[19], W = K[20], D = K[21], Z = K[22];
    let G = Z,
        f;
    if (K[23] !== $ || K[24] !== j || K[25] !== G || K[26] !== X || K[27] !== M || K[28] !== P || K[29] !== W || K[30] !== D || K[31] !== H) f = fY4.default.createElement(JH, {
        ref: j,
        borderColor: M,
        borderTopColor: D,
        borderBottomColor: X,
        borderLeftColor: P,
        borderRightColor: W,
        backgroundColor: G,
        ...H
    }, $), K[23] = $, K[24] = j, K[25] = G, K[26] = X, K[27] = M, K[28] = P, K[29] = W, K[30] = D, K[31] = H, K[32] = f;
    else f = K[32];
    return f
}
// @from(Ln 187440, Col 4)
fY4
// @from(Ln 187440, Col 9)
u
// @from(Ln 187441, Col 4)
GY4 = L(() => {
    o6();
    na();
    tB();
    jN6();
    fY4 = K6(P6(), 1);
    u = Mu_
})
// @from(Ln 187450, Col 0)
function Pu_(q, K) {
    if (!q) return;
    if (q.startsWith("rgb(") || q.startsWith("#") || q.startsWith("ansi256(") || q.startsWith("ansi:")) return q;
    return K[q]
}
// @from(Ln 187456, Col 0)
function T(q) {
    let K = s(10),
        {
            color: _,
            backgroundColor: z,
            dimColor: Y,
            bold: A,
            italic: O,
            underline: w,
            strikethrough: $,
            inverse: j,
            wrap: H,
            children: J
        } = q,
        X = Y === void 0 ? !1 : Y,
        M = A === void 0 ? !1 : A,
        P = O === void 0 ? !1 : O,
        W = w === void 0 ? !1 : w,
        D = $ === void 0 ? !1 : $,
        Z = j === void 0 ? !1 : j,
        G = H === void 0 ? "wrap" : H,
        [f] = Zq(),
        v = DD(f),
        V = ws6.useContext(Ru1),
        k = X && !V ? v.inactive : Pu_(_, v),
        N = z ? v[z] : void 0,
        R;
    if (K[0] !== M || K[1] !== J || K[2] !== Z || K[3] !== P || K[4] !== N || K[5] !== k || K[6] !== D || K[7] !== W || K[8] !== G) R = ws6.default.createElement(hA, {
        color: k,
        backgroundColor: N,
        bold: M,
        italic: P,
        underline: W,
        strikethrough: D,
        inverse: Z,
        wrap: G
    }, J), K[0] = M, K[1] = J, K[2] = Z, K[3] = P, K[4] = N, K[5] = k, K[6] = D, K[7] = W, K[8] = G, K[9] = R;
    else R = K[9];
    return R
}
// @from(Ln 187496, Col 4)
ws6
// @from(Ln 187496, Col 9)
Ru1
// @from(Ln 187497, Col 4)
dN6 = L(() => {
    o6();
    I$6();
    tB();
    jN6();
    ws6 = K6(P6(), 1), Ru1 = ws6.default.createContext(!1)
})
// @from(Ln 187504, Col 4)
VY4 = p((H5w, TY4) => {
    var Wu_ = d6("os"),
        vY4 = d6("tty"),
        LI = jH8(),
        {
            env: ZD
        } = process,
        x46;
    if (LI("no-color") || LI("no-colors") || LI("color=false") || LI("color=never")) x46 = 0;
    else if (LI("color") || LI("colors") || LI("color=true") || LI("color=always")) x46 = 1;
    if ("FORCE_COLOR" in ZD)
        if (ZD.FORCE_COLOR === "true") x46 = 1;
        else if (ZD.FORCE_COLOR === "false") x46 = 0;
    else x46 = ZD.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(ZD.FORCE_COLOR, 10), 3);

    function Su1(q) {
        if (q === 0) return !1;
        return {
            level: q,
            hasBasic: !0,
            has256: q >= 2,
            has16m: q >= 3
        }
    }

    function Cu1(q, K) {
        if (x46 === 0) return 0;
        if (LI("color=16m") || LI("color=full") || LI("color=truecolor")) return 3;
        if (LI("color=256")) return 2;
        if (q && !K && x46 === void 0) return 0;
        let _ = x46 || 0;
        if (ZD.TERM === "dumb") return _;
        if (process.platform === "win32") {
            let z = Wu_.release().split(".");
            if (Number(z[0]) >= 10 && Number(z[2]) >= 10586) return Number(z[2]) >= 14931 ? 3 : 2;
            return 1
        }
        if ("CI" in ZD) {
            if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((z) => (z in ZD)) || ZD.CI_NAME === "codeship") return 1;
            return _
        }
        if ("TEAMCITY_VERSION" in ZD) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(ZD.TEAMCITY_VERSION) ? 1 : 0;
        if (ZD.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in ZD) {
            let z = parseInt((ZD.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (ZD.TERM_PROGRAM) {
                case "iTerm.app":
                    return z >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2
            }
        }
        if (/-256(color)?$/i.test(ZD.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(ZD.TERM)) return 1;
        if ("COLORTERM" in ZD) return 1;
        return _
    }

    function Du_(q) {
        let K = Cu1(q, q && q.isTTY);
        return Su1(K)
    }
    TY4.exports = {
        supportsColor: Du_,
        stdout: Su1(Cu1(!0, vY4.isatty(1))),
        stderr: Su1(Cu1(!0, vY4.isatty(2)))
    }
})
// @from(Ln 187572, Col 4)
EY4 = p((J5w, NY4) => {
    var Zu_ = VY4(),
        cN6 = jH8();

    function kY4(q) {
        if (/^\d{3,4}$/.test(q)) {
            let _ = /(\d{1,2})(\d{2})/.exec(q);
            return {
                major: 0,
                minor: parseInt(_[1], 10),
                patch: parseInt(_[2], 10)
            }
        }
        let K = (q || "").split(".").map((_) => parseInt(_, 10));
        return {
            major: K[0],
            minor: K[1],
            patch: K[2]
        }
    }

    function bu1(q) {
        let {
            env: K
        } = process;
        if ("FORCE_HYPERLINK" in K) return !(K.FORCE_HYPERLINK.length > 0 && parseInt(K.FORCE_HYPERLINK, 10) === 0);
        if (cN6("no-hyperlink") || cN6("no-hyperlinks") || cN6("hyperlink=false") || cN6("hyperlink=never")) return !1;
        if (cN6("hyperlink=true") || cN6("hyperlink=always")) return !0;
        if ("NETLIFY" in K) return !0;
        if (!Zu_.supportsColor(q)) return !1;
        if (q && !q.isTTY) return !1;
        if (process.platform === "win32") return !1;
        if ("CI" in K) return !1;
        if ("TEAMCITY_VERSION" in K) return !1;
        if ("TERM_PROGRAM" in K) {
            let _ = kY4(K.TERM_PROGRAM_VERSION);
            switch (K.TERM_PROGRAM) {
                case "iTerm.app":
                    if (_.major === 3) return _.minor >= 1;
                    return _.major > 3;
                case "WezTerm":
                    return _.major >= 20200620;
                case "vscode":
                    return _.major > 1 || _.major === 1 && _.minor >= 72
            }
        }
        if ("VTE_VERSION" in K) {
            if (K.VTE_VERSION === "0.50.0") return !1;
            let _ = kY4(K.VTE_VERSION);
            return _.major > 0 || _.minor >= 50
        }
        return !1
    }
    NY4.exports = {
        supportsHyperlink: bu1,
        stdout: bu1(process.stdout),
        stderr: bu1(process.stderr)
    }
})
// @from(Ln 187632, Col 0)
function Vf(q) {
    let K = q?.env ?? process.env,
        _ = q?.stdoutSupported ?? LY4.default.supportsHyperlink(process.stdout);
    if ("FORCE_HYPERLINK" in K) return _;
    if (_) return !0;
    let z = K.TERM_PROGRAM;
    if (z && yY4.includes(z)) return !0;
    if (z === "tmux") {
        let [O, w] = (K.TERM_PROGRAM_VERSION ?? "").split("."), $ = parseInt(O ?? "", 10), j = parseInt(w ?? "", 10);
        if ($ > 3 || $ === 3 && j >= 4) return !0
    }
    let Y = K.LC_TERMINAL;
    if (Y && yY4.includes(Y)) return !0;
    if (K.TERM?.includes("kitty")) return !0;
    return !1
}
// @from(Ln 187648, Col 4)
LY4
// @from(Ln 187648, Col 9)
yY4
// @from(Ln 187649, Col 4)
vd = L(() => {
    LY4 = K6(EY4(), 1), yY4 = ["ghostty", "Hyper", "kitty", "alacritty", "iTerm.app", "iTerm2"]
})
// @from(Ln 187653, Col 0)
function yq(q) {
    let K = s(5),
        {
            children: _,
            url: z,
            fallback: Y
        } = q,
        A = _ ?? z;
    if (Vf()) {
        let $;
        if (K[0] !== A || K[1] !== z) $ = CE8.default.createElement(hA, null, CE8.default.createElement("ink-link", {
            href: z
        }, A)), K[0] = A, K[1] = z, K[2] = $;
        else $ = K[2];
        return $
    }
    let O = Y ?? A,
        w;
    if (K[3] !== O) w = CE8.default.createElement(hA, null, O), K[3] = O, K[4] = w;
    else w = K[4];
    return w
}
// @from(Ln 187675, Col 4)
CE8
// @from(Ln 187676, Col 4)
u46 = L(() => {
    o6();
    vd();
    I$6();
    CE8 = K6(P6(), 1)
})
// @from(Ln 187683, Col 0)
function hY4(q) {
    if (q.length === 0) return null;
    let K = q[0];
    if (K === "c") return {
        type: "reset"
    };
    if (K === "7") return {
        type: "cursor",
        action: {
            type: "save"
        }
    };
    if (K === "8") return {
        type: "cursor",
        action: {
            type: "restore"
        }
    };
    if (K === "D") return {
        type: "cursor",
        action: {
            type: "move",
            direction: "down",
            count: 1
        }
    };
    if (K === "M") return {
        type: "cursor",
        action: {
            type: "move",
            direction: "up",
            count: 1
        }
    };
    if (K === "E") return {
        type: "cursor",
        action: {
            type: "nextLine",
            count: 1
        }
    };
    if (K === "H") return null;
    if ("()".includes(K) && q.length >= 2) return null;
    return {
        type: "unknown",
        sequence: `\x1B${q}`
    }
}
// @from(Ln 187732, Col 0)
function lN6() {
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
// @from(Ln 187755, Col 0)
function Gu_(q) {
    if (q === "") return [{
        value: 0,
        subparams: [],
        colon: !1
    }];
    let K = [],
        _ = {
            value: null,
            subparams: [],
            colon: !1
        },
        z = "",
        Y = !1;
    for (let A = 0; A <= q.length; A++) {
        let O = q[A];
        if (O === ";" || O === void 0) {
            let w = z === "" ? null : parseInt(z, 10);
            if (Y) {
                if (w !== null) _.subparams.push(w)
            } else _.value = w;
            K.push(_), _ = {
                value: null,
                subparams: [],
                colon: !1
            }, z = "", Y = !1
        } else if (O === ":") {
            let w = z === "" ? null : parseInt(z, 10);
            if (!Y) _.value = w, _.colon = !0, Y = !0;
            else if (w !== null) _.subparams.push(w);
            z = ""
        } else if (O >= "0" && O <= "9") z += O
    }
    return K
}
// @from(Ln 187791, Col 0)
function Iu1(q, K) {
    let _ = q[K];
    if (!_) return null;
    if (_.colon && _.subparams.length >= 1) {
        if (_.subparams[0] === 5 && _.subparams.length >= 2) return {
            index: _.subparams[1]
        };
        if (_.subparams[0] === 2 && _.subparams.length >= 4) {
            let Y = _.subparams.length >= 5 ? 1 : 0;
            return {
                r: _.subparams[1 + Y],
                g: _.subparams[2 + Y],
                b: _.subparams[3 + Y]
            }
        }
    }
    let z = q[K + 1];
    if (!z) return null;
    if (z.value === 5 && q[K + 2]?.value !== null && q[K + 2]?.value !== void 0) return {
        index: q[K + 2].value
    };
    if (z.value === 2) {
        let Y = q[K + 2]?.value,
            A = q[K + 3]?.value,
            O = q[K + 4]?.value;
        if (Y !== null && Y !== void 0 && A !== null && A !== void 0 && O !== null && O !== void 0) return {
            r: Y,
            g: A,
            b: O
        }
    }
    return null
}
// @from(Ln 187825, Col 0)
function RY4(q, K) {
    let _ = Gu_(q),
        z = {
            ...K
        },
        Y = 0;
    while (Y < _.length) {
        let A = _[Y],
            O = A.value ?? 0;
        if (O === 0) {
            z = lN6(), Y++;
            continue
        }
        if (O === 1) {
            z.bold = !0, Y++;
            continue
        }
        if (O === 2) {
            z.dim = !0, Y++;
            continue
        }
        if (O === 3) {
            z.italic = !0, Y++;
            continue
        }
        if (O === 4) {
            z.underline = A.colon ? fu_[A.subparams[0]] ?? "single" : "single", Y++;
            continue
        }
        if (O === 5 || O === 6) {
            z.blink = !0, Y++;
            continue
        }
        if (O === 7) {
            z.inverse = !0, Y++;
            continue
        }
        if (O === 8) {
            z.hidden = !0, Y++;
            continue
        }
        if (O === 9) {
            z.strikethrough = !0, Y++;
            continue
        }
        if (O === 21) {
            z.underline = "double", Y++;
            continue
        }
        if (O === 22) {
            z.bold = !1, z.dim = !1, Y++;
            continue
        }
        if (O === 23) {
            z.italic = !1, Y++;
            continue
        }
        if (O === 24) {
            z.underline = "none", Y++;
            continue
        }
        if (O === 25) {
            z.blink = !1, Y++;
            continue
        }
        if (O === 27) {
            z.inverse = !1, Y++;
            continue
        }
        if (O === 28) {
            z.hidden = !1, Y++;
            continue
        }
        if (O === 29) {
            z.strikethrough = !1, Y++;
            continue
        }
        if (O === 53) {
            z.overline = !0, Y++;
            continue
        }
        if (O === 55) {
            z.overline = !1, Y++;
            continue
        }
        if (O >= 30 && O <= 37) {
            z.fg = {
                type: "named",
                name: bE8[O - 30]
            }, Y++;
            continue
        }
        if (O === 39) {
            z.fg = {
                type: "default"
            }, Y++;
            continue
        }
        if (O >= 40 && O <= 47) {
            z.bg = {
                type: "named",
                name: bE8[O - 40]
            }, Y++;
            continue
        }
        if (O === 49) {
            z.bg = {
                type: "default"
            }, Y++;
            continue
        }
        if (O >= 90 && O <= 97) {
            z.fg = {
                type: "named",
                name: bE8[O - 90 + 8]
            }, Y++;
            continue
        }
        if (O >= 100 && O <= 107) {
            z.bg = {
                type: "named",
                name: bE8[O - 100 + 8]
            }, Y++;
            continue
        }
        if (O === 38) {
            let w = Iu1(_, Y);
            if (w) {
                z.fg = "index" in w ? {
                    type: "indexed",
                    index: w.index
                } : {
                    type: "rgb",
                    ...w
                }, Y += A.colon ? 1 : ("index" in w) ? 3 : 5;
                continue
            }
        }
        if (O === 48) {
            let w = Iu1(_, Y);
            if (w) {
                z.bg = "index" in w ? {
                    type: "indexed",
                    index: w.index
                } : {
                    type: "rgb",
                    ...w
                }, Y += A.colon ? 1 : ("index" in w) ? 3 : 5;
                continue
            }
        }
        if (O === 58) {
            let w = Iu1(_, Y);
            if (w) {
                z.underlineColor = "index" in w ? {
                    type: "indexed",
                    index: w.index
                } : {
                    type: "rgb",
                    ...w
                }, Y += A.colon ? 1 : ("index" in w) ? 3 : 5;
                continue
            }
        }
        if (O === 59) {
            z.underlineColor = {
                type: "default"
            }, Y++;
            continue
        }
        Y++
    }
    return z
}
// @from(Ln 187999, Col 4)
bE8
// @from(Ln 187999, Col 9)
fu_
// @from(Ln 188000, Col 4)
SY4 = L(() => {
    bE8 = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "brightBlack", "brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta", "brightCyan", "brightWhite"], fu_ = ["none", "single", "double", "curly", "dotted", "dashed"]
})
// @from(Ln 188004, Col 0)
function vu_(q) {
    return q >= 9728 && q <= 9983 || q >= 9984 && q <= 10175 || q >= 127744 && q <= 129535 || q >= 129536 && q <= 129791 || q >= 127456 && q <= 127487
}
// @from(Ln 188008, Col 0)
function Tu_(q) {
    return q >= 4352 && q <= 4447 || q >= 11904 && q <= 40959 || q >= 44032 && q <= 55203 || q >= 63744 && q <= 64255 || q >= 65040 && q <= 65055 || q >= 65072 && q <= 65135 || q >= 65280 && q <= 65376 || q >= 65504 && q <= 65510 || q >= 131072 && q <= 196605 || q >= 196608 && q <= 262141
}
// @from(Ln 188012, Col 0)
function Vu_(q) {
    let K = 0;
    for (let _ of q)
        if (K++, K > 1) return !0;
    return !1
}
// @from(Ln 188019, Col 0)
function ku_(q) {
    if (Vu_(q)) return 2;
    let K = q.codePointAt(0);
    if (K === void 0) return 1;
    if (vu_(K) || Tu_(K)) return 2;
    return 1
}
// @from(Ln 188027, Col 0)
function* CY4(q) {
    for (let {
            segment: K
        }
        of rH().segment(q)) yield {
        value: K,
        width: ku_(K)
    }
}
// @from(Ln 188037, Col 0)
function Nu_(q) {
    if (q === "") return [];
    return q.split(/[;:]/).map((K) => K === "" ? 0 : parseInt(K, 10))
}
// @from(Ln 188042, Col 0)
function Eu_(q) {
    let K = q.slice(2);
    if (K.length === 0) return null;
    let _ = K.charCodeAt(K.length - 1),
        z = K.slice(0, -1),
        Y = "",
        A = z,
        O = "";
    if (z.length > 0 && "?>=".includes(z[0])) Y = z[0], A = z.slice(1);
    let w = A.match(/([^0-9;:]+)$/);
    if (w) O = w[1], A = A.slice(0, -O.length);
    let $ = Nu_(A),
        j = $[0] ?? 1,
        H = $[1] ?? 1;
    if (_ === jH.SGR && Y === "") return {
        type: "sgr",
        params: A
    };
    if (_ === jH.CUU) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "up",
            count: j
        }
    };
    if (_ === jH.CUD) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "down",
            count: j
        }
    };
    if (_ === jH.CUF) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "forward",
            count: j
        }
    };
    if (_ === jH.CUB) return {
        type: "cursor",
        action: {
            type: "move",
            direction: "back",
            count: j
        }
    };
    if (_ === jH.CNL) return {
        type: "cursor",
        action: {
            type: "nextLine",
            count: j
        }
    };
    if (_ === jH.CPL) return {
        type: "cursor",
        action: {
            type: "prevLine",
            count: j
        }
    };
    if (_ === jH.CHA) return {
        type: "cursor",
        action: {
            type: "column",
            col: j
        }
    };
    if (_ === jH.CUP || _ === jH.HVP) return {
        type: "cursor",
        action: {
            type: "position",
            row: j,
            col: H
        }
    };
    if (_ === jH.VPA) return {
        type: "cursor",
        action: {
            type: "row",
            row: j
        }
    };
    if (_ === jH.ED) return {
        type: "erase",
        action: {
            type: "display",
            region: g44[$[0] ?? 0] ?? "toEnd"
        }
    };
    if (_ === jH.EL) return {
        type: "erase",
        action: {
            type: "line",
            region: U44[$[0] ?? 0] ?? "toEnd"
        }
    };
    if (_ === jH.ECH) return {
        type: "erase",
        action: {
            type: "chars",
            count: j
        }
    };
    if (_ === jH.SU) return {
        type: "scroll",
        action: {
            type: "up",
            count: j
        }
    };
    if (_ === jH.SD) return {
        type: "scroll",
        action: {
            type: "down",
            count: j
        }
    };
    if (_ === jH.DECSTBM) return {
        type: "scroll",
        action: {
            type: "setRegion",
            top: j,
            bottom: H
        }
    };
    if (_ === jH.SCOSC) return {
        type: "cursor",
        action: {
            type: "save"
        }
    };
    if (_ === jH.SCORC) return {
        type: "cursor",
        action: {
            type: "restore"
        }
    };
    if (_ === jH.DECSCUSR && O === " ") return {
        type: "cursor",
        action: {
            type: "style",
            ...Ub1[j] ?? Ub1[0]
        }
    };
    if (Y === "?" && (_ === jH.SM || _ === jH.RM)) {
        let J = _ === jH.SM;
        if (j === yw.CURSOR_VISIBLE) return {
            type: "cursor",
            action: J ? {
                type: "show"
            } : {
                type: "hide"
            }
        };
        if (j === yw.ALT_SCREEN_CLEAR || j === yw.ALT_SCREEN) return {
            type: "mode",
            action: {
                type: "alternateScreen",
                enabled: J
            }
        };
        if (j === yw.BRACKETED_PASTE) return {
            type: "mode",
            action: {
                type: "bracketedPaste",
                enabled: J
            }
        };
        if (j === yw.MOUSE_NORMAL) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: J ? "normal" : "off"
            }
        };
        if (j === yw.MOUSE_BUTTON) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: J ? "button" : "off"
            }
        };
        if (j === yw.MOUSE_ANY) return {
            type: "mode",
            action: {
                type: "mouseTracking",
                mode: J ? "any" : "off"
            }
        };
        if (j === yw.FOCUS_EVENTS) return {
            type: "mode",
            action: {
                type: "focusEvents",
                enabled: J
            }
        }
    }
    return {
        type: "unknown",
        sequence: q
    }
}
// @from(Ln 188249, Col 0)
function yu_(q) {
    if (q.length < 2) return "unknown";
    if (q.charCodeAt(0) !== ZI.ESC) return "unknown";
    let K = q.charCodeAt(1);
    if (K === 91) return "csi";
    if (K === 93) return "osc";
    if (K === 79) return "ss3";
    return "esc"
}
// @from(Ln 188258, Col 0)
class IE8 {
    tokenizer = T46();
    style = lN6();
    inLink = !1;
    linkUrl;
    reset() {
        this.tokenizer.reset(), this.style = lN6(), this.inLink = !1, this.linkUrl = void 0
    }
    feed(q) {
        let K = this.tokenizer.feed(q),
            _ = [];
        for (let z of K) {
            let Y = this.processToken(z);
            _.push(...Y)
        }
        return _
    }
    processToken(q) {
        switch (q.type) {
            case "text":
                return this.processText(q.value);
            case "sequence":
                return this.processSequence(q.value)
        }
    }
    processText(q) {
        let K = [],
            _ = "";
        for (let z of q)
            if (z.charCodeAt(0) === ZI.BEL) {
                if (_) {
                    let Y = [...CY4(_)];
                    if (Y.length > 0) K.push({
                        type: "text",
                        graphemes: Y,
                        style: {
                            ...this.style
                        }
                    });
                    _ = ""
                }
                K.push({
                    type: "bell"
                })
            } else _ += z;
        if (_) {
            let z = [...CY4(_)];
            if (z.length > 0) K.push({
                type: "text",
                graphemes: z,
                style: {
                    ...this.style
                }
            })
        }
        return K
    }
    processSequence(q) {
        switch (yu_(q)) {
            case "csi": {
                let _ = Eu_(q);
                if (!_) return [];
                if (_.type === "sgr") return this.style = RY4(_.params, this.style), [];
                return [_]
            }
            case "osc": {
                let _ = q.slice(2);
                if (_.endsWith("\x07")) _ = _.slice(0, -1);
                else if (_.endsWith("\x1B\\")) _ = _.slice(0, -2);
                let z = qK4(_);
                if (z) {
                    if (z.type === "link")
                        if (z.action.type === "start") this.inLink = !0, this.linkUrl = z.action.url;
                        else this.inLink = !1, this.linkUrl = void 0;
                    return [z]
                }
                return []
            }
            case "esc": {
                let _ = q.slice(1),
                    z = hY4(_);
                return z ? [z] : []
            }
            case "ss3":
                return [{
                    type: "unknown",
                    sequence: q
                }];
            default:
                return [{
                    type: "unknown",
                    sequence: q
                }]
        }
    }
}
// @from(Ln 188354, Col 4)
bY4 = L(() => {
    IZ();
    Z46();
    GI();
    R46();
    HX();
    SY4();
    va6()
})
// @from(Ln 188363, Col 4)
IY4 = L(() => {
    bY4()
})
// @from(Ln 188367, Col 0)
function Lu_(q) {
    let _ = new IE8().feed(q),
        z = [],
        Y;
    for (let A of _) {
        if (A.type === "link") {
            if (A.action.type === "start") Y = A.action.url;
            else Y = void 0;
            continue
        }
        if (A.type === "text") {
            let O = A.graphemes.map((j) => j.value).join("");
            if (!O) continue;
            let w = hu_(A.style);
            if (Y) w.hyperlink = Y;
            let $ = z[z.length - 1];
            if ($ && Su_($.props, w)) $.text += O;
            else z.push({
                text: O,
                props: w
            })
        }
    }
    return z
}
// @from(Ln 188393, Col 0)
function hu_(q) {
    let K = {};
    if (q.bold) K.bold = !0;
    if (q.dim) K.dim = !0;
    if (q.italic) K.italic = !0;
    if (q.underline !== "none") K.underline = !0;
    if (q.strikethrough) K.strikethrough = !0;
    if (q.inverse) K.inverse = !0;
    let _ = xY4(q.fg);
    if (_) K.color = _;
    let z = xY4(q.bg);
    if (z) K.backgroundColor = z;
    return K
}
// @from(Ln 188408, Col 0)
function xY4(q) {
    switch (q.type) {
        case "named":
            return Ru_[q.name];
        case "indexed":
            return `ansi256(${q.index})`;
        case "rgb":
            return `rgb(${q.r},${q.g},${q.b})`;
        case "default":
            return
    }
}
// @from(Ln 188421, Col 0)
function Su_(q, K) {
    return q.color === K.color && q.backgroundColor === K.backgroundColor && q.bold === K.bold && q.dim === K.dim && q.italic === K.italic && q.underline === K.underline && q.strikethrough === K.strikethrough && q.inverse === K.inverse && q.hyperlink === K.hyperlink
}
// @from(Ln 188425, Col 0)
function Cu_(q) {
    return q.color !== void 0 || q.backgroundColor !== void 0 || q.dim === !0 || q.bold === !0 || q.italic === !0 || q.underline === !0 || q.strikethrough === !0 || q.inverse === !0 || q.hyperlink !== void 0
}
// @from(Ln 188429, Col 0)
function bu_(q) {
    return q.color !== void 0 || q.backgroundColor !== void 0 || q.dim === !0 || q.bold === !0 || q.italic === !0 || q.underline === !0 || q.strikethrough === !0 || q.inverse === !0
}
// @from(Ln 188433, Col 0)
function uY4(q) {
    let K = s(14),
        _, z, Y, A;
    if (K[0] !== q)({
        bold: _,
        dim: Y,
        children: z,
        ...A
    } = q), K[0] = q, K[1] = _, K[2] = z, K[3] = Y, K[4] = A;
    else _ = K[1], z = K[2], Y = K[3], A = K[4];
    if (Y) {
        let w;
        if (K[5] !== z || K[6] !== A) w = Ak.default.createElement(hA, {
            ...A,
            dim: !0
        }, z), K[5] = z, K[6] = A, K[7] = w;
        else w = K[7];
        return w
    }
    if (_) {
        let w;
        if (K[8] !== z || K[9] !== A) w = Ak.default.createElement(hA, {
            ...A,
            bold: !0
        }, z), K[8] = z, K[9] = A, K[10] = w;
        else w = K[10];
        return w
    }
    let O;
    if (K[11] !== z || K[12] !== A) O = Ak.default.createElement(hA, {
        ...A
    }, z), K[11] = z, K[12] = A, K[13] = O;
    else O = K[13];
    return O
}
// @from(Ln 188468, Col 4)
Ak
// @from(Ln 188468, Col 8)
v5
// @from(Ln 188468, Col 12)
Ru_
// @from(Ln 188469, Col 4)
mY4 = L(() => {
    o6();
    u46();
    I$6();
    IY4();
    Ak = K6(P6(), 1), v5 = Ak.default.memo(function(K) {
        let _ = s(12),
            {
                children: z,
                dimColor: Y
            } = K;
        if (typeof z !== "string") {
            let j;
            if (_[0] !== z || _[1] !== Y) j = Y ? Ak.default.createElement(hA, {
                dim: !0
            }, String(z)) : Ak.default.createElement(hA, null, String(z)), _[0] = z, _[1] = Y, _[2] = j;
            else j = _[2];
            return j
        }
        if (z === "") return null;
        let A, O;
        if (_[3] !== z || _[4] !== Y) {
            O = Symbol.for("react.early_return_sentinel");
            q: {
                let j = Lu_(z);
                if (j.length === 0) {
                    O = null;
                    break q
                }
                if (j.length === 1 && !Cu_(j[0].props)) {
                    O = Y ? Ak.default.createElement(hA, {
                        dim: !0
                    }, j[0].text) : Ak.default.createElement(hA, null, j[0].text);
                    break q
                }
                let H;
                if (_[7] !== Y) H = (J, X) => {
                    let M = J.props.hyperlink;
                    if (Y) J.props.dim = !0;
                    let P = bu_(J.props);
                    if (M) return P ? Ak.default.createElement(yq, {
                        key: X,
                        url: M
                    }, Ak.default.createElement(uY4, {
                        color: J.props.color,
                        backgroundColor: J.props.backgroundColor,
                        dim: J.props.dim,
                        bold: J.props.bold,
                        italic: J.props.italic,
                        underline: J.props.underline,
                        strikethrough: J.props.strikethrough,
                        inverse: J.props.inverse
                    }, J.text)) : Ak.default.createElement(yq, {
                        key: X,
                        url: M
                    }, J.text);
                    return P ? Ak.default.createElement(uY4, {
                        key: X,
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
                _[7] = Y,
                _[8] = H;
                else H = _[8];A = j.map(H)
            }
            _[3] = z, _[4] = Y, _[5] = A, _[6] = O
        } else A = _[5], O = _[6];
        if (O !== Symbol.for("react.early_return_sentinel")) return O;
        let w = A,
            $;
        if (_[9] !== w || _[10] !== Y) $ = Y ? Ak.default.createElement(hA, {
            dim: !0
        }, w) : Ak.default.createElement(hA, null, w), _[9] = w, _[10] = Y, _[11] = $;
        else $ = _[11];
        return $
    });
    Ru_ = {
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
// @from(Ln 188572, Col 0)
function Iu_(q) {
    let K = s(30),
        _, z, Y, A, O, w;
    if (K[0] !== q)({
        onAction: Y,
        tabIndex: w,
        autoFocus: _,
        children: z,
        ref: A,
        ...O
    } = q), K[0] = q, K[1] = _, K[2] = z, K[3] = Y, K[4] = A, K[5] = O, K[6] = w;
    else _ = K[1], z = K[2], Y = K[3], A = K[4], O = K[5], w = K[6];
    let $ = w === void 0 ? 0 : w,
        [j, H] = Td.useState(!1),
        [J, X] = Td.useState(!1),
        [M, P] = Td.useState(!1),
        W = Td.useRef(null),
        D, Z;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) D = () => () => {
        if (W.current) clearTimeout(W.current)
    }, Z = [], K[7] = D, K[8] = Z;
    else D = K[7], Z = K[8];
    Td.useEffect(D, Z);
    let G;
    if (K[9] !== Y) G = (g) => {
        if (g.key === "return" || g.key === " ") {
            if (g.preventDefault(), P(!0), Y(), W.current) clearTimeout(W.current);
            W.current = setTimeout(xu_, 100, P)
        }
    }, K[9] = Y, K[10] = G;
    else G = K[10];
    let f = G,
        v;
    if (K[11] !== Y) v = (g) => {
        Y()
    }, K[11] = Y, K[12] = v;
    else v = K[12];
    let V = v,
        k;
    if (K[13] === Symbol.for("react.memo_cache_sentinel")) k = (g) => H(!0), K[13] = k;
    else k = K[13];
    let N = k,
        R;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) R = (g) => H(!1), K[14] = R;
    else R = K[14];
    let h = R,
        C;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) C = () => X(!0), K[15] = C;
    else C = K[15];
    let x = C,
        B;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) B = () => X(!1), K[16] = B;
    else B = K[16];
    let m = B,
        S;
    if (K[17] !== z || K[18] !== M || K[19] !== j || K[20] !== J) S = typeof z === "function" ? z({
        focused: j,
        hovered: J,
        active: M
    }) : z, K[17] = z, K[18] = M, K[19] = j, K[20] = J, K[21] = S;
    else S = K[21];
    let F = S,
        U;
    if (K[22] !== _ || K[23] !== F || K[24] !== V || K[25] !== f || K[26] !== A || K[27] !== O || K[28] !== $) U = Td.default.createElement(JH, {
        ref: A,
        tabIndex: $,
        autoFocus: _,
        onKeyDown: f,
        onClick: V,
        onFocus: N,
        onBlur: h,
        onMouseEnter: x,
        onMouseLeave: m,
        ...O
    }, F), K[22] = _, K[23] = F, K[24] = V, K[25] = f, K[26] = A, K[27] = O, K[28] = $, K[29] = U;
    else U = K[29];
    return U
}
// @from(Ln 188651, Col 0)
function xu_(q) {
    return q(!1)
}
// @from(Ln 188654, Col 4)
Td
// @from(Ln 188654, Col 8)
xE8
// @from(Ln 188655, Col 4)
BY4 = L(() => {
    o6();
    na();
    Td = K6(P6(), 1);
    xE8 = Iu_
})
// @from(Ln 188662, Col 0)
function Ok(q) {
    let K = s(4),
        {
            count: _
        } = q,
        z = _ === void 0 ? 1 : _,
        Y;
    if (K[0] !== z) Y = `
`.repeat(z), K[0] = z, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== Y) A = pY4.default.createElement("ink-text", null, Y), K[2] = Y, K[3] = A;
    else A = K[3];
    return A
}
// @from(Ln 188677, Col 4)
pY4
// @from(Ln 188678, Col 4)
FY4 = L(() => {
    o6();
    pY4 = K6(P6(), 1)
})
// @from(Ln 188683, Col 0)
function PJ(q) {
    let K = s(9),
        _, z, Y;
    if (K[0] !== q)({
        children: z,
        fromLeftEdge: Y,
        ..._
    } = q), K[0] = q, K[1] = _, K[2] = z, K[3] = Y;
    else _ = K[1], z = K[2], Y = K[3];
    let A = Y ? "stretch" : void 0,
        O = Y ? "from-left-edge" : !0,
        w;
    if (K[4] !== _ || K[5] !== z || K[6] !== A || K[7] !== O) w = gY4.default.createElement(JH, {
        alignSelf: A,
        ..._,
        noSelect: O
    }, z), K[4] = _, K[5] = z, K[6] = A, K[7] = O, K[8] = w;
    else w = K[8];
    return w
}
// @from(Ln 188703, Col 4)
gY4
// @from(Ln 188704, Col 4)
xu1 = L(() => {
    o6();
    na();
    gY4 = K6(P6(), 1)
})
// @from(Ln 188710, Col 0)
function nN6(q) {
    let K = s(6),
        {
            lines: _,
            width: z
        } = q;
    if (_.length === 0) return null;
    let Y;
    if (K[0] !== _) Y = _.join(`
`), K[0] = _, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== _.length || K[3] !== Y || K[4] !== z) A = UY4.default.createElement("ink-raw-ansi", {
        rawText: Y,
        rawWidth: z,
        rawHeight: _.length
    }), K[2] = _.length, K[3] = Y, K[4] = z, K[5] = A;
    else A = K[5];
    return A
}
// @from(Ln 188730, Col 4)
UY4
// @from(Ln 188731, Col 4)
QY4 = L(() => {
    o6();
    UY4 = K6(P6(), 1)
})
// @from(Ln 188736, Col 0)
function uu1() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = dY4.default.createElement(JH, {
        flexGrow: 1
    }), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 188745, Col 4)
dY4
// @from(Ln 188746, Col 4)
cY4 = L(() => {
    o6();
    na();
    dY4 = K6(P6(), 1)
})
// @from(Ln 188752, Col 0)
function m46() {
    let q = ia.useContext(C46),
        K = ia.useRef(null),
        _ = ia.useRef({
            isVisible: !0
        }),
        z = ia.useCallback((Y) => {
            K.current = Y
        }, []);
    return ia.useLayoutEffect(() => {
        let Y = K.current;
        if (!Y?.yogaNode || !q) return;
        let A = Y.yogaNode.getComputedHeight(),
            O = q.rows,
            w = Y.yogaNode.getComputedTop(),
            $ = Y.parentNode,
            j = Y.yogaNode;
        while ($) {
            if ($.yogaNode) w += $.yogaNode.getComputedTop(), j = $.yogaNode;
            if ($.scrollTop) w -= $.scrollTop;
            $ = $.parentNode
        }
        let H = j.getComputedHeight(),
            J = w + A,
            X = H > O ? 1 : 0,
            M = Math.max(0, H - O) + X,
            P = M + O,
            W = J > M && w < P;
        if (W !== _.current.isVisible) _.current = {
            isVisible: W
        }
    }), [z, _.current]
}
// @from(Ln 188785, Col 4)
ia
// @from(Ln 188786, Col 4)
$s6 = L(() => {
    qs6();
    ia = K6(P6(), 1)
})
// @from(Ln 188791, Col 0)
function _O(q = 16) {
    let K = iN6.useContext(BN6),
        [_, {
            isVisible: z
        }] = m46(),
        [Y, A] = iN6.useState(() => K?.now() ?? 0),
        O = z && q !== null;
    return iN6.useEffect(() => {
        if (!K || !O) return;
        let w = K.now(),
            $ = () => {
                let j = K.now();
                if (j - w >= q) w = j, A(j)
            };
        return K.subscribe($, !0)
    }, [K, q, O]), [_, Y]
}
// @from(Ln 188808, Col 4)
iN6
// @from(Ln 188809, Col 4)
lY4 = L(() => {
    fE8();
    $s6();
    iN6 = K6(P6(), 1)
})
// @from(Ln 188814, Col 4)
nY4
// @from(Ln 188814, Col 9)
uu_ = () => nY4.useContext(mN6)
// @from(Ln 188815, Col 4)
hI
// @from(Ln 188816, Col 4)
mu1 = L(() => {
    ZE8();
    nY4 = K6(P6(), 1), hI = uu_
})
// @from(Ln 188821, Col 0)
function oN6() {
    let {
        focusManager: q,
        rootNode: K
    } = rN6.useContext(mN6), _ = rN6.useSyncExternalStore(q?.subscribe ?? iY4, () => q?.activeElement ?? null);
    return rN6.useMemo(() => ({
        activeElement: _,
        focusNext: () => {
            if (q && K) q.focusNext(K)
        },
        focusPrevious: () => {
            if (q && K) q.focusPrevious(K)
        },
        focusDirection: (z) => {
            if (q && K) return q.focusDirection(z, K);
            return !1
        },
        focus: (z) => q?.focus(z),
        blur: () => q?.blur(),
        subscribe: q?.subscribe ?? iY4
    }), [_, q, K])
}
// @from(Ln 188843, Col 4)
rN6
// @from(Ln 188843, Col 9)
iY4 = () => () => {}
// @from(Ln 188844, Col 4)
uE8 = L(() => {
    ZE8();
    rN6 = K6(P6(), 1)
})
// @from(Ln 188848, Col 4)
sY4 = p((H3w, aY4) => {
    var mu_ = "Expected a function",
        rY4 = NaN,
        Bu_ = "[object Symbol]",
        pu_ = /^\s+|\s+$/g,
        Fu_ = /^[-+]0x[0-9a-f]+$/i,
        gu_ = /^0b[01]+$/i,
        Uu_ = /^0o[0-7]+$/i,
        Qu_ = parseInt,
        du_ = typeof global == "object" && global && global.Object === Object && global,
        cu_ = typeof self == "object" && self && self.Object === Object && self,
        lu_ = du_ || cu_ || Function("return this")(),
        nu_ = Object.prototype,
        iu_ = nu_.toString,
        ru_ = Math.max,
        ou_ = Math.min,
        Bu1 = function() {
            return lu_.Date.now()
        };

    function au_(q, K, _) {
        var z, Y, A, O, w, $, j = 0,
            H = !1,
            J = !1,
            X = !0;
        if (typeof q != "function") throw TypeError(mu_);
        if (K = oY4(K) || 0, pu1(_)) H = !!_.leading, J = "maxWait" in _, A = J ? ru_(oY4(_.maxWait) || 0, K) : A, X = "trailing" in _ ? !!_.trailing : X;

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
            return J ? ou_(h, A - R) : h
        }

        function D(k) {
            var N = k - $,
                R = k - j;
            return $ === void 0 || N >= K || N < 0 || J && R >= A
        }

        function Z() {
            var k = Bu1();
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
            return w === void 0 ? O : G(Bu1())
        }

        function V() {
            var k = Bu1(),
                N = D(k);
            if (z = arguments, Y = this, $ = k, N) {
                if (w === void 0) return P($);
                if (J) return w = setTimeout(Z, K), M($)
            }
            if (w === void 0) w = setTimeout(Z, K);
            return O
        }
        return V.cancel = f, V.flush = v, V
    }

    function pu1(q) {
        var K = typeof q;
        return !!q && (K == "object" || K == "function")
    }

    function su_(q) {
        return !!q && typeof q == "object"
    }

    function tu_(q) {
        return typeof q == "symbol" || su_(q) && iu_.call(q) == Bu_
    }

    function oY4(q) {
        if (typeof q == "number") return q;
        if (tu_(q)) return rY4;
        if (pu1(q)) {
            var K = typeof q.valueOf == "function" ? q.valueOf() : q;
            q = pu1(K) ? K + "" : K
        }
        if (typeof q != "string") return q === 0 ? q : +q;
        q = q.replace(pu_, "");
        var _ = gu_.test(q);
        return _ || Uu_.test(q) ? Qu_(q.slice(2), _ ? 2 : 8) : Fu_.test(q) ? rY4 : +q
    }
    aY4.exports = au_
})
// @from(Ln 188960, Col 0)
function fD(q, K) {
    let _ = kf.useRef(q);
    tY4(() => {
        _.current = q
    }, [q]), kf.useEffect(() => {
        if (K === null) return;
        let z = setInterval(() => {
            _.current()
        }, K);
        return () => {
            clearInterval(z)
        }
    }, [K])
}
// @from(Ln 188975, Col 0)
function eY4(q) {
    let K = kf.useRef(() => {
        throw Error("Cannot call an event handler while rendering.")
    });
    return tY4(() => {
        K.current = q
    }, [q]), kf.useCallback((..._) => {
        var z;
        return (z = K.current) == null ? void 0 : z.call(K, ..._)
    }, [K])
}
// @from(Ln 188987, Col 0)
function eu_(q) {
    let K = kf.useRef(q);
    K.current = q, kf.useEffect(() => () => {
        K.current()
    }, [])
}
// @from(Ln 188994, Col 0)
function ra(q, K = 500, _) {
    let z = kf.useRef();
    eu_(() => {
        if (z.current) z.current.cancel()
    });
    let Y = kf.useMemo(() => {
        let A = Fu1.default(q, K, _),
            O = (...w) => {
                return A(...w)
            };
        return O.cancel = () => {
            A.cancel()
        }, O.isPending = () => {
            return !!z.current
        }, O.flush = () => {
            return A.flush()
        }, O
    }, [q, K, _]);
    return kf.useEffect(() => {
        z.current = Fu1.default(q, K, _)
    }, [q, K, _]), Y
}
// @from(Ln 189016, Col 4)
kf
// @from(Ln 189016, Col 8)
Fu1
// @from(Ln 189016, Col 13)
tY4
// @from(Ln 189017, Col 4)
wk = L(() => {
    kf = K6(P6(), 1), Fu1 = K6(sY4(), 1), tY4 = typeof window < "u" ? kf.useLayoutEffect : kf.useEffect
})
// @from(Ln 189020, Col 4)
mE8
// @from(Ln 189020, Col 9)
qm_ = (q, K = {}) => {
        let {
            setRawMode: _,
            internal_exitOnCtrlC: z,
            internal_eventEmitter: Y
        } = FB();
        mE8.useLayoutEffect(() => {
            if (K.isActive === !1) return;
            return _(!0), () => {
                _(!1)
            }
        }, [K.isActive, _]);
        let A = eY4((O) => {
            if (K.isActive === !1) return;
            let {
                input: w,
                key: $
            } = O;
            if (!(w === "c" && $.ctrl) || !z) q(w, $, O)
        });
        mE8.useEffect(() => {
            return Y?.on("input", A), () => {
                Y?.removeListener("input", A)
            }
        }, [Y, A])
    }
// @from(Ln 189046, Col 4)
XR
// @from(Ln 189047, Col 4)
qA4 = L(() => {
    wk();
    KN8();
    mE8 = K6(P6(), 1), XR = qm_
})
// @from(Ln 189053, Col 0)
function KA4(q) {
    let K = Vd.useContext(BN6),
        [_, z] = Vd.useState(() => K?.now() ?? 0);
    return Vd.useEffect(() => {
        if (!K) return;
        let Y = K.now(),
            A = () => {
                let O = K.now();
                if (O - Y >= q) Y = O, z(O)
            };
        return K.subscribe(A, !1)
    }, [K, q]), _
}
// @from(Ln 189067, Col 0)
function gu1(q, K) {
    let _ = Vd.useRef(q);
    _.current = q;
    let z = Vd.useContext(BN6);
    Vd.useEffect(() => {
        if (!z || K === null) return;
        let Y = z.now(),
            A = () => {
                let O = z.now();
                if (O - Y >= K) Y = O, _.current()
            };
        return z.subscribe(A, !1)
    }, [z, K])
}
// @from(Ln 189081, Col 4)
Vd
// @from(Ln 189082, Col 4)
_A4 = L(() => {
    fE8();
    Vd = K6(P6(), 1)
})