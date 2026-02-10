
// @from(Ln 473094, Col 0)
function WGq({
    commands: A,
    onInputChange: q,
    onSubmit: K,
    setCursorOffset: Y,
    input: z,
    cursorOffset: w,
    mode: H,
    agents: $,
    setSuggestionsState: O,
    suggestionsState: {
        suggestions: _,
        selectedSuggestion: J,
        commandArgumentHint: X
    },
    suppressSuggestions: D = !1,
    markAccepted: j,
    hasImages: M = !1,
    onQueue: P
}) {
    let {
        addNotification: W
    } = iq(), G = RK("chat:thinkingToggle", "Chat", "alt+t"), [f, Z] = Mw.useState("none"), N = Mw.useMemo(() => {
        let $1 = A.filter((L1) => !L1.isHidden);
        if ($1.length === 0) return;
        return Math.max(...$1.map((L1) => L1.userFacingName().length)) + 6
    }, [A]), [T, k] = Mw.useState(void 0), y = v6(($1) => $1.mcp.resources), B = v6(($1) => $1.teamContext), S = v6(($1) => $1.promptSuggestion), m = VL(), [b, g] = Mw.useState(void 0), U = Mw.useMemo(() => {
        if (H !== "prompt" || D) return;
        let $1 = pv6(z, w);
        if (!$1) return;
        let G1 = MgA($1.partialCommand, A);
        if (!G1) return;
        return {
            text: G1.suffix,
            fullCommand: G1.fullCommand,
            insertPosition: $1.startPos + 1 + $1.partialCommand.length
        }
    }, [z, w, H, A, D]), x = D ? void 0 : H === "prompt" ? U : b, p = Mw.useRef(w);
    p.current = w;
    let l = Mw.useRef(""),
        r = Mw.useRef(""),
        s = Mw.useRef(""),
        O1 = Mw.useRef(""),
        T1 = Mw.useRef(_);
    T1.current = _;
    let N1 = Mw.useRef(null),
        j1 = Mw.useCallback(() => {
            O(() => ({
                commandArgumentHint: void 0,
                suggestions: [],
                selectedSuggestion: -1
            })), Z("none"), k(void 0), g(void 0)
        }, [O]),
        q1 = Mw.useCallback(async ($1, G1 = !1) => {
            l.current = $1;
            let L1 = await NgA($1, y, $, G1);
            if (l.current !== $1) return;
            if (L1.length === 0) {
                O(() => ({
                    commandArgumentHint: void 0,
                    suggestions: [],
                    selectedSuggestion: -1
                })), Z("none"), k(void 0);
                return
            }
            O((x1) => ({
                commandArgumentHint: void 0,
                suggestions: L1,
                selectedSuggestion: Cf1(x1.suggestions, x1.selectedSuggestion, L1)
            })), Z(L1.length > 0 ? "file" : "none"), k(void 0)
        }, [y, O, Z, k, $]),
        t = TD1(q1, 200),
        J1 = Mw.useCallback(async ($1, G1) => {
            let L1 = G1 ?? p.current;
            if (D) {
                t.cancel(), j1();
                return
            }
            if (H === "prompt") {
                let R1 = pv6($1, L1);
                if (R1) {
                    if (MgA(R1.partialCommand, A)) {
                        O(() => ({
                            commandArgumentHint: void 0,
                            suggestions: [],
                            selectedSuggestion: -1
                        })), Z("none"), k(void 0);
                        return
                    }
                }
            }
            if (H === "bash" && $1.trim()) {
                O1.current = $1;
                let R1 = await wGq($1);
                if (O1.current !== $1) return;
                if (R1) {
                    g({
                        text: R1.suffix,
                        fullCommand: R1.fullCommand,
                        insertPosition: $1.length
                    }), O(() => ({
                        commandArgumentHint: void 0,
                        suggestions: [],
                        selectedSuggestion: -1
                    })), Z("none"), k(void 0);
                    return
                } else g(void 0)
            }
            if (l8()) {
                let R1 = $1.substring(0, L1).match(/(^|\s)@([\w-]*)$/);
                if (R1 && B) {
                    let H1 = R1[2] ?? "",
                        y1 = Object.values(B.teammates ?? {}).filter((B1) => B1.name !== "team-lead").filter((B1) => B1.name.toLowerCase().startsWith(H1.toLowerCase())).map((B1) => ({
                            id: `dm-${B1.name}`,
                            displayText: `@${B1.name}`,
                            description: "send message"
                        }));
                    if (y1.length > 0) {
                        O((B1) => ({
                            commandArgumentHint: void 0,
                            suggestions: y1,
                            selectedSuggestion: Cf1(B1.suggestions, B1.selectedSuggestion, y1)
                        })), Z("agent"), k(void 0);
                        return
                    }
                }
            }
            let x1 = $1.substring(0, L1).match(z0z),
                f1 = L1 === $1.length && L1 > 0 && $1.length > 0 && $1[L1 - 1] === " ";
            if (H === "prompt" && NF($1) && L1 > 0) {
                let R1 = H0z($1);
                if (R1 && R1.commandName === "add-dir" && R1.args) {
                    let {
                        args: H1
                    } = R1;
                    if (H1.match(/\s+$/)) {
                        t.cancel(), j1();
                        return
                    }
                    let y1 = await Tf6(H1);
                    if (y1.length > 0) {
                        O((B1) => ({
                            suggestions: y1,
                            selectedSuggestion: Cf1(B1.suggestions, B1.selectedSuggestion, y1),
                            commandArgumentHint: void 0
                        })), Z("directory");
                        return
                    }
                    t.cancel(), j1();
                    return
                }
                if (R1 && R1.commandName === "resume" && R1.args !== void 0 && $1.includes(" ")) {
                    let {
                        args: H1
                    } = R1, B1 = (await $F(H1, {
                        limit: 10
                    })).map((A6) => {
                        let O6 = Xw(A6);
                        return {
                            id: `resume-title-${O6}`,
                            displayText: A6.customTitle,
                            description: _C1(A6),
                            metadata: {
                                sessionId: O6
                            }
                        }
                    });
                    if (B1.length > 0) {
                        O((A6) => ({
                            suggestions: B1,
                            selectedSuggestion: Cf1(A6.suggestions, A6.selectedSuggestion, B1),
                            commandArgumentHint: void 0
                        })), Z("custom-title");
                        return
                    }
                    j1();
                    return
                }
            }
            if (H === "prompt" && NF($1) && L1 > 0 && !PGq(f1, $1)) {
                let R1 = void 0;
                if ($1.length > 1) {
                    let y1 = $1.indexOf(" "),
                        B1 = y1 === -1 ? $1.slice(1) : $1.slice(1, y1),
                        A6 = y1 !== -1 && $1.slice(y1 + 1).trim().length > 0,
                        O6 = y1 !== -1 && $1.length === y1 + 1;
                    if (y1 !== -1) {
                        let P6 = A.find((V6) => V6.userFacingName() === B1);
                        if (P6 || A6) {
                            if (P6?.argumentHint && O6) R1 = P6.argumentHint;
                            else if (P6?.type === "prompt" && P6.argNames?.length && $1.endsWith(" ")) {
                                let V6 = $1.slice(y1 + 1),
                                    q6 = u0A(V6);
                                R1 = NU7(P6.argNames, q6)
                            }
                            O(() => ({
                                commandArgumentHint: R1,
                                suggestions: [],
                                selectedSuggestion: -1
                            })), Z("none"), k(void 0);
                            return
                        }
                    }
                }
                let H1 = PgA($1, A);
                if (O((y1) => {
                        let A6 = y1.suggestions.length !== H1.length || y1.suggestions.some((O6, P6) => O6.id !== H1[P6]?.id) ? H1.length > 0 ? 0 : -1 : y1.selectedSuggestion;
                        return {
                            commandArgumentHint: R1,
                            suggestions: H1,
                            selectedSuggestion: A6
                        }
                    }), Z(H1.length > 0 ? "command" : "none"), H1.length > 0) k(N);
                return
            }
            if (f === "command") t.cancel(), j1();
            else if (NF($1) && PGq(f1, $1)) O((R1) => R1.commandArgumentHint ? {
                ...R1,
                commandArgumentHint: void 0
            } : R1);
            if (f === "custom-title") j1();
            if (f === "agent" && T1.current.some((R1) => R1.id?.startsWith("dm-"))) {
                if (!$1.substring(0, L1).match(/(^|\s)@([\w-]*)$/)) j1()
            }
            if (x1 && H !== "bash") {
                let R1 = Uc($1, L1, !0);
                if (R1 && R1.token.startsWith("@")) {
                    let H1 = jGq(R1);
                    if (l6q(H1)) {
                        s.current = H1;
                        let y1 = await i6q(H1, {
                            maxResults: 10
                        });
                        if (s.current !== H1) return;
                        if (y1.length > 0) {
                            O((B1) => ({
                                suggestions: y1,
                                selectedSuggestion: Cf1(B1.suggestions, B1.selectedSuggestion, y1),
                                commandArgumentHint: void 0
                            })), Z("directory");
                            return
                        }
                    }
                    if (l.current === H1) return;
                    t(H1, !0);
                    return
                }
            }
            if (f === "file") {
                let R1 = Uc($1, L1, !0);
                if (R1) {
                    let H1 = jGq(R1);
                    if (l.current === H1) return;
                    t(H1, !1)
                } else t.cancel(), j1()
            }
            if (f === "shell") {
                let R1 = T1.current[0]?.metadata?.inputSnapshot;
                if (H !== "bash" || $1 !== R1) t.cancel(), j1()
            }
        }, [f, A, O, j1, t, H, D, N]);
    Mw.useEffect(() => {
        if (N1.current === z) return;
        if (r.current !== z) r.current = z, l.current = "";
        N1.current = null, J1(z)
    }, [z, J1]);
    let D1 = Mw.useCallback(async () => {
            if (x) {
                if (H === "bash") {
                    u8("bash-history-completion"), q(x.fullCommand), Y(x.fullCommand.length), g(void 0);
                    return
                }
                let $1 = pv6(z, w);
                if ($1) {
                    u8("tab-completion");
                    let G1 = z.slice(0, $1.startPos),
                        L1 = z.slice($1.startPos + $1.token.length),
                        x1 = G1 + "/" + x.fullCommand + " " + L1,
                        f1 = $1.startPos + 1 + x.fullCommand.length + 1;
                    q(x1), Y(f1);
                    return
                }
            }
            if (_.length > 0) {
                u8("tab-completion"), t.cancel();
                let $1 = J === -1 ? 0 : J,
                    G1 = _[$1];
                if (f === "command" && $1 < _.length) {
                    if (G1) WgA(G1, !1, A, q, Y, K), j1()
                } else if (f === "custom-title" && _.length > 0) {
                    if (G1) {
                        let L1 = DGq(G1);
                        q(L1), Y(L1.length), j1()
                    }
                } else if (f === "directory" && _.length > 0) {
                    let L1 = _[$1];
                    if (L1) {
                        let x1 = NF(z),
                            f1;
                        if (x1) {
                            let R1 = z.indexOf(" "),
                                H1 = z.slice(0, R1 + 1),
                                y1 = Bc1(L1.metadata) && L1.metadata.type === "directory" ? "/" : " ";
                            if (f1 = H1 + L1.id + y1, q(f1), Y(f1.length), Bc1(L1.metadata) && L1.metadata.type === "directory") O((B1) => ({
                                ...B1,
                                commandArgumentHint: void 0
                            })), J1(f1, f1.length);
                            else j1()
                        } else {
                            let H1 = Uc(z, w, !0) ?? Uc(z, w, !1);
                            if (H1) {
                                let y1 = Bc1(L1.metadata) && L1.metadata.type === "directory",
                                    B1 = MGq(z, L1.id, H1.startPos, H1.token.length, y1);
                                if (f1 = B1.newInput, q(f1), Y(B1.cursorPos), y1) O((A6) => ({
                                    ...A6,
                                    commandArgumentHint: void 0
                                })), J1(f1, B1.cursorPos);
                                else j1()
                            } else j1()
                        }
                    }
                } else if (f === "shell" && _.length > 0) {
                    let L1 = _[$1];
                    if (L1) {
                        let x1 = L1.metadata;
                        vgA(L1, z, w, q, Y, x1?.completionType), j1()
                    }
                } else if (f === "agent" && _.length > 0 && _[$1]?.id?.startsWith("dm-")) {
                    let L1 = _[$1];
                    if (L1) {
                        let f1 = z.slice(0, w).match(/(^|\s)@[\w-]*$/);
                        if (f1 && f1.index !== void 0) {
                            let R1 = f1.index + (f1[1]?.length ?? 0),
                                H1 = z.slice(0, R1),
                                y1 = z.slice(w),
                                B1 = H1 + L1.displayText + " " + y1;
                            q(B1), Y(H1.length + L1.displayText.length + 1), j1()
                        }
                    }
                } else if (f === "file" && _.length > 0) {
                    let L1 = Uc(z, w, !0);
                    if (!L1) {
                        j1();
                        return
                    }
                    let x1 = QAq(_),
                        f1 = L1.token.startsWith("@"),
                        R1;
                    if (L1.isQuoted) R1 = L1.token.slice(2).replace(/"$/, "").length;
                    else if (f1) R1 = L1.token.length - 1;
                    else R1 = L1.token.length;
                    if (x1.length > R1) {
                        let H1 = TgA({
                            displayText: x1,
                            mode: H,
                            hasAtPrefix: f1,
                            needsQuotes: !1,
                            isQuoted: L1.isQuoted,
                            isComplete: !1
                        });
                        If6(H1, z, L1.token, L1.startPos, q, Y), J1(z.replace(L1.token, H1), w)
                    } else if ($1 < _.length) {
                        let H1 = _[$1];
                        if (H1) {
                            let y1 = H1.displayText.includes(" "),
                                B1 = TgA({
                                    displayText: H1.displayText,
                                    mode: H,
                                    hasAtPrefix: f1,
                                    needsQuotes: y1,
                                    isQuoted: L1.isQuoted,
                                    isComplete: !0
                                });
                            If6(B1, z, L1.token, L1.startPos, q, Y), j1()
                        }
                    }
                }
            } else if (z.trim() !== "") {
                let $1, G1;
                if (H === "bash") {
                    $1 = "shell";
                    let L1 = await w0z(z, w);
                    if (L1.length === 1) {
                        let x1 = L1[0];
                        if (x1) {
                            let f1 = x1.metadata;
                            vgA(x1, z, w, q, Y, f1?.completionType)
                        }
                        G1 = []
                    } else G1 = L1
                } else {
                    $1 = "file";
                    let L1 = Uc(z, w, !0);
                    if (L1) {
                        let x1 = L1.token.startsWith("@"),
                            f1 = x1 ? L1.token.substring(1) : L1.token;
                        G1 = await NgA(f1, y, $, x1)
                    } else G1 = []
                }
                if (G1.length > 0) O((L1) => ({
                    commandArgumentHint: void 0,
                    suggestions: G1,
                    selectedSuggestion: Cf1(L1.suggestions, L1.selectedSuggestion, G1)
                })), Z($1), k(void 0)
            }
        }, [_, J, z, f, A, H, q, Y, K, j1, w, J1, y, O, $, t, x]),
        Z1 = Mw.useCallback(() => {
            if (J < 0 || _.length === 0) return;
            let $1 = _[J];
            if (f === "command" && J < _.length) {
                if ($1) WgA($1, !0, A, q, Y, K), t.cancel(), j1()
            } else if (f === "custom-title" && J < _.length) {
                if ($1) {
                    let G1 = DGq($1);
                    q(G1), Y(G1.length), K(G1, !0), t.cancel(), j1()
                }
            } else if (f === "shell" && J < _.length) {
                let G1 = _[J];
                if (G1) {
                    let L1 = G1.metadata;
                    vgA(G1, z, w, q, Y, L1?.completionType), t.cancel(), j1()
                }
            } else if (f === "agent" && J < _.length && $1?.id?.startsWith("dm-")) {
                let L1 = z.slice(0, w).match(/(^|\s)@[\w-]*$/);
                if (L1 && L1.index !== void 0) {
                    let x1 = L1.index + (L1[1]?.length ?? 0),
                        f1 = z.slice(0, x1),
                        R1 = z.slice(w),
                        H1 = f1 + $1.displayText + " " + R1;
                    q(H1), Y(f1.length + $1.displayText.length + 1), t.cancel(), j1()
                }
            } else if (f === "file" && J < _.length) {
                let G1 = Uc(z, w, !0);
                if (G1) {
                    if ($1) {
                        let L1 = G1.token.startsWith("@"),
                            x1 = $1.displayText.includes(" "),
                            f1 = TgA({
                                displayText: $1.displayText,
                                mode: H,
                                hasAtPrefix: L1,
                                needsQuotes: x1,
                                isQuoted: G1.isQuoted,
                                isComplete: !0
                            });
                        If6(f1, z, G1.token, G1.startPos, q, Y), t.cancel(), j1()
                    }
                }
            } else if (f === "directory" && J < _.length) {
                if ($1) {
                    let G1 = NF(z),
                        L1, x1;
                    if (G1) {
                        let f1 = z.indexOf(" "),
                            R1 = z.slice(0, f1 + 1),
                            H1 = Bc1($1.metadata) && $1.metadata.type === "directory" ? "/" : " ";
                        L1 = R1 + $1.id + H1, x1 = L1.length, q(L1), Y(x1)
                    } else {
                        let R1 = Uc(z, w, !0) ?? Uc(z, w, !1);
                        if (R1) {
                            let H1 = Bc1($1.metadata) && $1.metadata.type === "directory",
                                y1 = MGq(z, $1.id, R1.startPos, R1.token.length, H1);
                            L1 = y1.newInput, x1 = y1.cursorPos, q(L1), Y(x1)
                        }
                    }
                    t.cancel(), j1()
                }
            }
        }, [_, J, f, A, z, w, H, q, Y, K, j1, t]),
        E1 = Mw.useCallback(() => {
            D1()
        }, [D1]),
        a = Mw.useCallback(() => {
            t.cancel(), j1(), N1.current = z
        }, [t, j1, z]),
        A1 = Mw.useCallback(() => {
            O(($1) => ({
                ...$1,
                selectedSuggestion: $1.selectedSuggestion <= 0 ? _.length - 1 : $1.selectedSuggestion - 1
            }))
        }, [_.length, O]),
        M1 = Mw.useCallback(() => {
            O(($1) => ({
                ...$1,
                selectedSuggestion: $1.selectedSuggestion >= _.length - 1 ? 0 : $1.selectedSuggestion + 1
            }))
        }, [_.length, O]),
        z1 = Mw.useMemo(() => ({
            "autocomplete:accept": E1,
            "autocomplete:dismiss": a,
            "autocomplete:previous": A1,
            "autocomplete:next": M1
        }), [E1, a, A1, M1]),
        Y1 = _.length > 0 || !!x,
        _1 = BD1();
    return DZ("autocomplete", Y1), q36("Autocomplete", Y1), c7(z1, {
        context: "Autocomplete",
        isActive: Y1 && !_1
    }), D8(($1, G1, L1) => {
        if (G1.rightArrow) {
            let {
                text: f1,
                shownAt: R1
            } = S;
            if (f1 && R1 > 0 && z === "") {
                j(), q(f1), Y(f1.length), L1.stopImmediatePropagation();
                return
            }
        }
        if (G1.tab && !G1.shift) {
            if (_.length > 0 || x) return;
            if (!NF(z) && P?.()) return;
            let {
                text: f1,
                shownAt: R1
            } = S;
            if (f1 && R1 > 0 && z === "") {
                j(), q(f1), Y(f1.length);
                return
            }
            if (z.trim() === "") W({
                key: "thinking-toggle-hint",
                jsx: EgA.createElement(V, {
                    dimColor: !0
                }, "Use ", G, " to toggle thinking"),
                priority: "immediate",
                timeoutMs: 3000
            });
            return
        }
        if (_.length === 0) return;
        let x1 = m?.pendingChord != null;
        if (G1.ctrl && $1 === "n" && !x1) {
            M1();
            return
        }
        if (G1.ctrl && $1 === "p" && !x1) {
            A1();
            return
        }
        if (G1.return) {
            if (M) {
                j1();
                return
            }
            Z1()
        }
    }), {
        suggestions: _,
        selectedSuggestion: J,
        suggestionType: f,
        maxColumnWidth: T,
        commandArgumentHint: X,
        inlineGhostText: x
    }
}
// @from(Ln 473650, Col 4)
Mw
// @from(Ln 473650, Col 8)
EgA
// @from(Ln 473650, Col 13)
q0z
// @from(Ln 473650, Col 18)
XGq
// @from(Ln 473650, Col 23)
K0z
// @from(Ln 473650, Col 28)
Y0z
// @from(Ln 473650, Col 33)
z0z
// @from(Ln 473650, Col 38)
dv6 = null
// @from(Ln 473651, Col 4)
GGq = v(() => {
    m1();
    K7();
    eg();
    GgA();
    FhA();
    lq();
    xf6();
    YGq();
    HGq();
    JGq();
    XZ();
    d8();
    u6();
    v3();
    s2();
    h2();
    oS();
    m1();
    vq();
    S9();
    bu1();
    Mw = o(X1(), 1), EgA = o(X1(), 1), q0z = /^@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*/u, XGq = /^[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+/u, K0z = /(@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+)$/u, Y0z = /[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+$/u, z0z = /(^|\s)@([\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|"[^"]*"?)$/u
})
// @from(Ln 473676, Col 0)
function NGq() {
    return {
        mode: "INSERT",
        insertedText: ""
    }
}
// @from(Ln 473683, Col 0)
function TGq() {
    return {
        lastChange: null,
        lastFind: null,
        register: "",
        registerIsLinewise: !1
    }
}
// @from(Ln 473691, Col 4)
ZGq
// @from(Ln 473691, Col 9)
kgA
// @from(Ln 473691, Col 14)
LgA
// @from(Ln 473691, Col 19)
fGq
// @from(Ln 473691, Col 24)
VGq
// @from(Ln 473691, Col 29)
RgA = 1e4
// @from(Ln 473692, Col 4)
ygA = v(() => {
    ZGq = {
        d: "delete",
        c: "change",
        y: "yank"
    }, kgA = new Set(["h", "l", "j", "k", "w", "b", "e", "W", "B", "E", "0", "^", "$"]), LgA = new Set(["f", "F", "t", "T"]), fGq = {
        i: "inner",
        a: "around"
    }, VGq = new Set(["w", "W", '"', "'", "`", "(", ")", "b", "[", "]", "{", "}", "B", "<", ">"])
})
// @from(Ln 473703, Col 0)
function cv6(A, q, K) {
    let Y = q;
    for (let z = 0; z < K; z++) {
        let w = $0z(A, Y);
        if (w.equals(Y)) break;
        Y = w
    }
    return Y
}
// @from(Ln 473713, Col 0)
function $0z(A, q) {
    switch (A) {
        case "h":
            return q.left();
        case "l":
            return q.right();
        case "j":
            return q.downLogicalLine();
        case "k":
            return q.upLogicalLine();
        case "w":
            return q.nextVimWord();
        case "b":
            return q.prevVimWord();
        case "e":
            return q.endOfVimWord();
        case "W":
            return q.nextWORD();
        case "B":
            return q.prevWORD();
        case "E":
            return q.endOfWORD();
        case "0":
            return q.startOfLogicalLine();
        case "^":
            return q.firstNonBlankInLogicalLine();
        case "$":
            return q.endOfLogicalLine();
        case "G":
            return q.startOfLastLine();
        default:
            return q
    }
}
// @from(Ln 473748, Col 0)
function vGq(A) {
    return "eE$".includes(A)
}
// @from(Ln 473752, Col 0)
function EGq(A) {
    return "jkG".includes(A) || A === "gg"
}
// @from(Ln 473756, Col 0)
function LGq(A, q, K, Y) {
    if (K === "w") return kGq(A, q, Y, nU);
    if (K === "W") return kGq(A, q, Y, (w) => !Q26(w));
    let z = O0z[K];
    if (z) {
        let [w, H] = z;
        return w === H ? _0z(A, q, w, Y) : J0z(A, q, w, H, Y)
    }
    return null
}
// @from(Ln 473767, Col 0)
function kGq(A, q, K, Y) {
    let z = [];
    for (let {
            segment: j,
            index: M
        }
        of T_().segment(A)) z.push({
        segment: j,
        index: M
    });
    let w = z.length - 1;
    for (let j = 0; j < z.length; j++) {
        let M = z[j],
            P = j + 1 < z.length ? z[j + 1].index : A.length;
        if (q >= M.index && q < P) {
            w = j;
            break
        }
    }
    let H = (j) => z[j]?.segment ?? "",
        $ = (j) => j < z.length ? z[j].index : A.length,
        O = (j) => Q26(H(j)),
        _ = (j) => Y(H(j)),
        J = (j) => mo(H(j)),
        X = w,
        D = w;
    if (_(w)) {
        while (X > 0 && _(X - 1)) X--;
        while (D < z.length && _(D)) D++
    } else if (O(w)) {
        while (X > 0 && O(X - 1)) X--;
        while (D < z.length && O(D)) D++;
        return {
            start: $(X),
            end: $(D)
        }
    } else if (J(w)) {
        while (X > 0 && J(X - 1)) X--;
        while (D < z.length && J(D)) D++
    }
    if (!K) {
        if (D < z.length && O(D))
            while (D < z.length && O(D)) D++;
        else if (X > 0 && O(X - 1))
            while (X > 0 && O(X - 1)) X--
    }
    return {
        start: $(X),
        end: $(D)
    }
}
// @from(Ln 473819, Col 0)
function _0z(A, q, K, Y) {
    let z = A.lastIndexOf(`
`, q - 1) + 1,
        w = A.indexOf(`
`, q),
        H = w === -1 ? A.length : w,
        $ = A.slice(z, H),
        O = q - z,
        _ = [];
    for (let J = 0; J < $.length; J++)
        if ($[J] === K) _.push(J);
    for (let J = 0; J < _.length - 1; J += 2) {
        let X = _[J],
            D = _[J + 1];
        if (X <= O && O <= D) return Y ? {
            start: z + X + 1,
            end: z + D
        } : {
            start: z + X,
            end: z + D + 1
        }
    }
    return null
}
// @from(Ln 473844, Col 0)
function J0z(A, q, K, Y, z) {
    let w = 0,
        H = -1;
    for (let O = q; O >= 0; O--)
        if (A[O] === Y && O !== q) w++;
        else if (A[O] === K) {
        if (w === 0) {
            H = O;
            break
        }
        w--
    }
    if (H === -1) return null;
    w = 0;
    let $ = -1;
    for (let O = H + 1; O < A.length; O++)
        if (A[O] === K) w++;
        else if (A[O] === Y) {
        if (w === 0) {
            $ = O;
            break
        }
        w--
    }
    if ($ === -1) return null;
    return z ? {
        start: H + 1,
        end: $
    } : {
        start: H,
        end: $ + 1
    }
}
// @from(Ln 473877, Col 4)
O0z
// @from(Ln 473878, Col 4)
RGq = v(() => {
    RD1();
    OS();
    O0z = {
        "(": ["(", ")"],
        ")": ["(", ")"],
        b: ["(", ")"],
        "[": ["[", "]"],
        "]": ["[", "]"],
        "{": ["{", "}"],
        "}": ["{", "}"],
        B: ["{", "}"],
        "<": ["<", ">"],
        ">": ["<", ">"],
        '"': ['"', '"'],
        "'": ["'", "'"],
        "`": ["`", "`"]
    }
})
// @from(Ln 473898, Col 0)
function Sf1(A, q, K, Y) {
    let z = cv6(q, Y.cursor, K);
    if (z.equals(Y.cursor)) return;
    let w = SgA(Y.cursor, z, q, A, K);
    Fc1(A, w.from, w.to, Y, w.linewise), Y.recordChange({
        type: "operator",
        op: A,
        motion: q,
        count: K
    })
}
// @from(Ln 473910, Col 0)
function lv6(A, q, K, Y, z) {
    let w = z.cursor.findCharacter(K, q, Y);
    if (w === null) return;
    let H = new z3(z.cursor.measuredText, w),
        $ = X0z(z.cursor, H, q);
    Fc1(A, $.from, $.to, z), z.setLastFind(q, K), z.recordChange({
        type: "operatorFind",
        op: A,
        find: q,
        char: K,
        count: Y
    })
}
// @from(Ln 473924, Col 0)
function iv6(A, q, K, Y, z) {
    let w = LGq(z.text, z.cursor.offset, K, q === "inner");
    if (!w) return;
    Fc1(A, w.start, w.end, z), z.recordChange({
        type: "operatorTextObj",
        op: A,
        objType: K,
        scope: q,
        count: Y
    })
}
// @from(Ln 473936, Col 0)
function CgA(A, q, K) {
    let Y = K.text,
        z = Y.split(`
`),
        w = Y.slice(0, K.cursor.offset).split(`
`).length - 1,
        H = Math.min(q, z.length - w),
        $ = K.cursor.startOfLogicalLine().offset,
        O = $;
    for (let J = 0; J < H; J++) {
        let X = Y.indexOf(`
`, O);
        O = X === -1 ? Y.length : X + 1
    }
    let _ = Y.slice($, O);
    if (!_.endsWith(`
`)) _ = _ + `
`;
    if (K.setRegister(_, !0), A === "yank") K.setOffset($);
    else if (A === "delete") {
        let J = $,
            X = O;
        if (X === Y.length && J > 0 && Y[J - 1] === `
`) J -= 1;
        let D = Y.slice(0, J) + Y.slice(X);
        K.setText(D || "");
        let j = Math.max(0, D.length - (pg(D).length || 1));
        K.setOffset(Math.min(J, j))
    } else if (A === "change")
        if (z.length === 1) K.setText(""), K.enterInsert(0);
        else {
            let J = z.slice(0, w),
                X = z.slice(w + H),
                D = [...J, "", ...X].join(`
`);
            K.setText(D), K.enterInsert($)
        } K.recordChange({
        type: "operator",
        op: A,
        motion: A[0],
        count: q
    })
}
// @from(Ln 473980, Col 0)
function nv6(A, q) {
    let K = q.cursor.offset;
    if (K >= q.text.length) return;
    let Y = q.cursor;
    for (let O = 0; O < A && !Y.isAtEnd(); O++) Y = Y.right();
    let z = Y.offset,
        w = q.text.slice(K, z),
        H = q.text.slice(0, K) + q.text.slice(z);
    q.setRegister(w, !1), q.setText(H);
    let $ = Math.max(0, H.length - (pg(H).length || 1));
    q.setOffset(Math.min(K, $)), q.recordChange({
        type: "x",
        count: A
    })
}
// @from(Ln 473996, Col 0)
function rv6(A, q, K) {
    let Y = K.cursor.offset,
        z = K.text;
    for (let w = 0; w < q && Y < z.length; w++) {
        let H = OC1(z.slice(Y)).length || 1;
        z = z.slice(0, Y) + A + z.slice(Y + H), Y += A.length
    }
    K.setText(z), K.setOffset(Math.max(0, Y - A.length)), K.recordChange({
        type: "replace",
        char: A,
        count: q
    })
}
// @from(Ln 474010, Col 0)
function ov6(A, q) {
    let K = q.cursor.offset;
    if (K >= q.text.length) return;
    let Y = q.text,
        z = K,
        w = 0;
    while (z < Y.length && w < A) {
        let H = OC1(Y.slice(z)),
            $ = H.length,
            O = H === H.toUpperCase() ? H.toLowerCase() : H.toUpperCase();
        Y = Y.slice(0, z) + O + Y.slice(z + $), z += O.length, w++
    }
    q.setText(Y), q.setOffset(z), q.recordChange({
        type: "toggleCase",
        count: A
    })
}
// @from(Ln 474028, Col 0)
function av6(A, q) {
    let Y = q.text.split(`
`),
        {
            line: z
        } = q.cursor.getPosition();
    if (z >= Y.length - 1) return;
    let w = Math.min(A, Y.length - z - 1),
        H = Y[z],
        $ = H.length;
    for (let J = 1; J <= w; J++) {
        let X = (Y[z + J] ?? "").trimStart();
        if (X.length > 0) {
            if (!H.endsWith(" ") && H.length > 0) H += " ";
            H += X
        }
    }
    let O = [...Y.slice(0, z), H, ...Y.slice(z + w + 1)],
        _ = O.join(`
`);
    q.setText(_), q.setOffset(tv6(O, z) + $), q.recordChange({
        type: "join",
        count: A
    })
}
// @from(Ln 474054, Col 0)
function yGq(A, q, K) {
    let Y = K.getRegister();
    if (!Y) return;
    let z = Y.endsWith(`
`),
        w = z ? Y.slice(0, -1) : Y;
    if (z) {
        let $ = K.text.split(`
`),
            {
                line: O
            } = K.cursor.getPosition(),
            _ = A ? O + 1 : O,
            J = w.split(`
`),
            X = [];
        for (let M = 0; M < q; M++) X.push(...J);
        let D = [...$.slice(0, _), ...X, ...$.slice(_)],
            j = D.join(`
`);
        K.setText(j), K.setOffset(tv6(D, _))
    } else {
        let H = w.repeat(q),
            $ = A && K.cursor.offset < K.text.length ? K.cursor.measuredText.nextOffset(K.cursor.offset) : K.cursor.offset,
            O = K.text.slice(0, $) + H + K.text.slice($),
            _ = pg(H),
            J = $ + H.length - (_.length || 1);
        K.setText(O), K.setOffset(Math.max($, J))
    }
}
// @from(Ln 474085, Col 0)
function sv6(A, q, K) {
    let z = K.text.split(`
`),
        {
            line: w
        } = K.cursor.getPosition(),
        H = Math.min(q, z.length - w),
        $ = "  ";
    for (let X = 0; X < H; X++) {
        let D = w + X,
            j = z[D] ?? "";
        if (A === ">") z[D] = "  " + j;
        else if (j.startsWith("  ")) z[D] = j.slice(2);
        else if (j.startsWith("\t")) z[D] = j.slice(1);
        else {
            let M = 0,
                P = 0;
            while (P < j.length && M < 2 && /\s/.test(j[P])) M++, P++;
            z[D] = j.slice(P)
        }
    }
    let O = z.join(`
`),
        J = ((z[w] ?? "").match(/^\s*/)?.[0] ?? "").length;
    K.setText(O), K.setOffset(tv6(z, w) + J), K.recordChange({
        type: "indent",
        dir: A,
        count: q
    })
}
// @from(Ln 474116, Col 0)
function mc1(A, q) {
    let Y = q.text.split(`
`),
        {
            line: z
        } = q.cursor.getPosition(),
        w = A === "below" ? z + 1 : z,
        H = [...Y.slice(0, w), "", ...Y.slice(w)],
        $ = H.join(`
`);
    q.setText($), q.enterInsert(tv6(H, w)), q.recordChange({
        type: "openLine",
        direction: A
    })
}
// @from(Ln 474132, Col 0)
function tv6(A, q) {
    return A.slice(0, q).join(`
`).length + (q > 0 ? 1 : 0)
}
// @from(Ln 474137, Col 0)
function SgA(A, q, K, Y, z) {
    let w = Math.min(A.offset, q.offset),
        H = Math.max(A.offset, q.offset),
        $ = !1;
    if (Y === "change" && (K === "w" || K === "W")) {
        let O = A;
        for (let J = 0; J < z - 1; J++) O = K === "w" ? O.nextVimWord() : O.nextWORD();
        let _ = K === "w" ? O.endOfVimWord() : O.endOfWORD();
        H = A.measuredText.nextOffset(_.offset)
    } else if (EGq(K)) {
        $ = !0;
        let O = A.text,
            _ = O.indexOf(`
`, H);
        if (_ === -1) {
            if (H = O.length, w > 0 && O[w - 1] === `
`) w -= 1
        } else H = _ + 1
    } else if (vGq(K) && A.offset <= q.offset) H = A.measuredText.nextOffset(H);
    return {
        from: w,
        to: H,
        linewise: $
    }
}
// @from(Ln 474163, Col 0)
function X0z(A, q, K) {
    let Y = Math.min(A.offset, q.offset),
        z = Math.max(A.offset, q.offset),
        w = A.measuredText.nextOffset(z);
    return {
        from: Y,
        to: w
    }
}
// @from(Ln 474173, Col 0)
function Fc1(A, q, K, Y, z = !1) {
    let w = Y.text.slice(q, K);
    if (z && !w.endsWith(`
`)) w = w + `
`;
    if (Y.setRegister(w, z), A === "yank") Y.setOffset(q);
    else if (A === "delete") {
        let H = Y.text.slice(0, q) + Y.text.slice(K);
        Y.setText(H);
        let $ = Math.max(0, H.length - (pg(H).length || 1));
        Y.setOffset(Math.min(q, $))
    } else if (A === "change") {
        let H = Y.text.slice(0, q) + Y.text.slice(K);
        Y.setText(H), Y.enterInsert(q)
    }
}
// @from(Ln 474190, Col 0)
function CGq(A, q, K) {
    let Y = q === 1 ? K.cursor.startOfLastLine() : K.cursor.goToLine(q);
    if (Y.equals(K.cursor)) return;
    let z = SgA(K.cursor, Y, "G", A, q);
    Fc1(A, z.from, z.to, K, z.linewise), K.recordChange({
        type: "operator",
        op: A,
        motion: "G",
        count: q
    })
}
// @from(Ln 474202, Col 0)
function SGq(A, q, K) {
    let Y = q === 1 ? K.cursor.startOfFirstLine() : K.cursor.goToLine(q);
    if (Y.equals(K.cursor)) return;
    let z = SgA(K.cursor, Y, "gg", A, q);
    Fc1(A, z.from, z.to, K, z.linewise), K.recordChange({
        type: "operator",
        op: A,
        motion: "gg",
        count: q
    })
}
// @from(Ln 474213, Col 4)
hgA = v(() => {
    RD1();
    OS();
    RGq()
})
// @from(Ln 474219, Col 0)
function hGq(A, q, K) {
    switch (A.type) {
        case "idle":
            return D0z(q, K);
        case "count":
            return j0z(A, q, K);
        case "operator":
            return M0z(A, q, K);
        case "operatorCount":
            return P0z(A, q, K);
        case "operatorFind":
            return W0z(A, q, K);
        case "operatorTextObj":
            return G0z(A, q, K);
        case "find":
            return Z0z(A, q, K);
        case "g":
            return f0z(A, q, K);
        case "operatorG":
            return V0z(A, q, K);
        case "replace":
            return N0z(A, q, K);
        case "indent":
            return T0z(A, q, K)
    }
}
// @from(Ln 474246, Col 0)
function IGq(A, q, K) {
    let Y = ZGq[A];
    if (Y) return {
        next: {
            type: "operator",
            op: Y,
            count: q
        }
    };
    if (kgA.has(A)) return {
        execute: () => {
            let z = cv6(A, K.cursor, q);
            K.setOffset(z.offset)
        }
    };
    if (LgA.has(A)) return {
        next: {
            type: "find",
            find: A,
            count: q
        }
    };
    if (A === "g") return {
        next: {
            type: "g",
            count: q
        }
    };
    if (A === "r") return {
        next: {
            type: "replace",
            count: q
        }
    };
    if (A === ">" || A === "<") return {
        next: {
            type: "indent",
            dir: A,
            count: q
        }
    };
    if (A === "~") return {
        execute: () => ov6(q, K)
    };
    if (A === "x") return {
        execute: () => nv6(q, K)
    };
    if (A === "J") return {
        execute: () => av6(q, K)
    };
    if (A === "p" || A === "P") return {
        execute: () => yGq(A === "p", q, K)
    };
    if (A === "D") return {
        execute: () => Sf1("delete", "$", 1, K)
    };
    if (A === "C") return {
        execute: () => Sf1("change", "$", 1, K)
    };
    if (A === "Y") return {
        execute: () => CgA("yank", q, K)
    };
    if (A === "G") return {
        execute: () => {
            if (q === 1) K.setOffset(K.cursor.startOfLastLine().offset);
            else K.setOffset(K.cursor.goToLine(q).offset)
        }
    };
    if (A === ".") return {
        execute: () => K.onDotRepeat?.()
    };
    if (A === ";" || A === ",") return {
        execute: () => v0z(A === ",", q, K)
    };
    if (A === "u") return {
        execute: () => K.onUndo?.()
    };
    if (A === "i") return {
        execute: () => K.enterInsert(K.cursor.offset)
    };
    if (A === "I") return {
        execute: () => K.enterInsert(K.cursor.firstNonBlankInLogicalLine().offset)
    };
    if (A === "a") return {
        execute: () => {
            let z = K.cursor.isAtEnd() ? K.cursor.offset : K.cursor.right().offset;
            K.enterInsert(z)
        }
    };
    if (A === "A") return {
        execute: () => K.enterInsert(K.cursor.endOfLogicalLine().offset)
    };
    if (A === "o") return {
        execute: () => mc1("below", K)
    };
    if (A === "O") return {
        execute: () => mc1("above", K)
    };
    return null
}
// @from(Ln 474347, Col 0)
function xGq(A, q, K, Y) {
    let z = fGq[K];
    if (z) return {
        next: {
            type: "operatorTextObj",
            op: A,
            count: q,
            scope: z
        }
    };
    if (LgA.has(K)) return {
        next: {
            type: "operatorFind",
            op: A,
            count: q,
            find: K
        }
    };
    if (kgA.has(K)) return {
        execute: () => Sf1(A, K, q, Y)
    };
    if (K === "G") return {
        execute: () => CGq(A, q, Y)
    };
    if (K === "g") return {
        next: {
            type: "operatorG",
            op: A,
            count: q
        }
    };
    return null
}
// @from(Ln 474381, Col 0)
function D0z(A, q) {
    if (/[1-9]/.test(A)) return {
        next: {
            type: "count",
            digits: A
        }
    };
    if (A === "0") return {
        execute: () => q.setOffset(q.cursor.startOfLogicalLine().offset)
    };
    let K = IGq(A, 1, q);
    if (K) return K;
    return {}
}
// @from(Ln 474396, Col 0)
function j0z(A, q, K) {
    if (/[0-9]/.test(q)) {
        let w = A.digits + q,
            H = Math.min(parseInt(w, 10), RgA);
        return {
            next: {
                type: "count",
                digits: String(H)
            }
        }
    }
    let Y = parseInt(A.digits, 10),
        z = IGq(q, Y, K);
    if (z) return z;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474417, Col 0)
function M0z(A, q, K) {
    if (q === A.op[0]) return {
        execute: () => CgA(A.op, A.count, K)
    };
    if (/[0-9]/.test(q)) return {
        next: {
            type: "operatorCount",
            op: A.op,
            count: A.count,
            digits: q
        }
    };
    let Y = xGq(A.op, A.count, q, K);
    if (Y) return Y;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474438, Col 0)
function P0z(A, q, K) {
    if (/[0-9]/.test(q)) {
        let H = A.digits + q,
            $ = Math.min(parseInt(H, 10), RgA);
        return {
            next: {
                ...A,
                digits: String($)
            }
        }
    }
    let Y = parseInt(A.digits, 10),
        z = A.count * Y,
        w = xGq(A.op, z, q, K);
    if (w) return w;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474460, Col 0)
function W0z(A, q, K) {
    return {
        execute: () => lv6(A.op, A.find, q, A.count, K)
    }
}
// @from(Ln 474466, Col 0)
function G0z(A, q, K) {
    if (VGq.has(q)) return {
        execute: () => iv6(A.op, A.scope, q, A.count, K)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474477, Col 0)
function Z0z(A, q, K) {
    return {
        execute: () => {
            let Y = K.cursor.findCharacter(q, A.find, A.count);
            if (Y !== null) K.setOffset(Y), K.setLastFind(A.find, q)
        }
    }
}
// @from(Ln 474486, Col 0)
function f0z(A, q, K) {
    if (q === "g") {
        if (A.count > 1) return {
            execute: () => {
                let Y = K.text.split(`
`),
                    z = Math.min(A.count - 1, Y.length - 1),
                    w = 0;
                for (let H = 0; H < z; H++) w += (Y[H]?.length ?? 0) + 1;
                K.setOffset(w)
            }
        };
        return {
            execute: () => K.setOffset(K.cursor.startOfFirstLine().offset)
        }
    }
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474509, Col 0)
function V0z(A, q, K) {
    if (q === "g") return {
        execute: () => SGq(A.op, A.count, K)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474520, Col 0)
function N0z(A, q, K) {
    return {
        execute: () => rv6(q, A.count, K)
    }
}
// @from(Ln 474526, Col 0)
function T0z(A, q, K) {
    if (q === A.dir) return {
        execute: () => sv6(A.dir, A.count, K)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 474537, Col 0)
function v0z(A, q, K) {
    let Y = K.getLastFind();
    if (!Y) return;
    let z = Y.type;
    if (A) z = {
        f: "F",
        F: "f",
        t: "T",
        T: "t"
    } [z];
    let w = K.cursor.findCharacter(Y.char, z, q);
    if (w !== null) K.setOffset(w)
}
// @from(Ln 474550, Col 4)
bGq = v(() => {
    ygA();
    hgA()
})
// @from(Ln 474555, Col 0)
function uGq(A) {
    let q = pc.default.useRef(NGq()),
        [K, Y] = pc.useState("INSERT"),
        z = pc.default.useRef(TGq()),
        w = Zf6({
            ...A,
            inputFilter: A.inputFilter
        }),
        {
            onModeChange: H
        } = A,
        $ = pc.useCallback((j) => {
            if (j !== void 0) w.setOffset(j);
            q.current = {
                mode: "INSERT",
                insertedText: ""
            }, Y("INSERT"), H?.("INSERT")
        }, [w, H]),
        O = pc.useCallback(() => {
            let j = q.current;
            if (j.mode === "INSERT" && j.insertedText) z.current.lastChange = {
                type: "insert",
                text: j.insertedText
            };
            let M = w.offset;
            if (M > 0 && A.value[M - 1] !== `
`) w.setOffset(M - 1);
            q.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            }, Y("NORMAL"), H?.("NORMAL")
        }, [H, w, A.value]);

    function _(j, M = !1) {
        return {
            cursor: j,
            text: A.value,
            setText: (P) => A.onChange(P),
            setOffset: (P) => w.setOffset(P),
            enterInsert: (P) => $(P),
            getRegister: () => z.current.register,
            setRegister: (P, W) => {
                z.current.register = P, z.current.registerIsLinewise = W
            },
            getLastFind: () => z.current.lastFind,
            setLastFind: (P, W) => {
                z.current.lastFind = {
                    type: P,
                    char: W
                }
            },
            recordChange: M ? () => {} : (P) => {
                z.current.lastChange = P
            }
        }
    }

    function J() {
        let j = z.current.lastChange;
        if (!j) return;
        let M = z3.fromText(A.value, A.columns, w.offset),
            P = _(M, !0);
        switch (j.type) {
            case "insert":
                if (j.text) {
                    let W = M.insert(j.text);
                    A.onChange(W.text), w.setOffset(W.offset)
                }
                break;
            case "x":
                nv6(j.count, P);
                break;
            case "replace":
                rv6(j.char, j.count, P);
                break;
            case "toggleCase":
                ov6(j.count, P);
                break;
            case "indent":
                sv6(j.dir, j.count, P);
                break;
            case "join":
                av6(j.count, P);
                break;
            case "openLine":
                mc1(j.direction, P);
                break;
            case "operator":
                Sf1(j.op, j.motion, j.count, P);
                break;
            case "operatorFind":
                lv6(j.op, j.find, j.char, j.count, P);
                break;
            case "operatorTextObj":
                iv6(j.op, j.scope, j.objType, j.count, P);
                break
        }
    }

    function X(j, M) {
        let P = z3.fromText(A.value, A.columns, w.offset),
            W = q.current;
        if (M.ctrl) {
            w.onInput(j, M);
            return
        }
        if (M.escape && W.mode === "INSERT") {
            O();
            return
        }
        if (M.return) {
            w.onInput(j, M);
            return
        }
        if (W.mode === "INSERT") {
            if (M.backspace || M.delete) {
                if (W.insertedText.length > 0) q.current = {
                    mode: "INSERT",
                    insertedText: W.insertedText.slice(0, -(pg(W.insertedText).length || 1))
                }
            } else q.current = {
                mode: "INSERT",
                insertedText: W.insertedText + j
            };
            w.onInput(j, M);
            return
        }
        if (W.mode !== "NORMAL") return;
        if (W.command.type === "idle" && (M.upArrow || M.downArrow || M.leftArrow || M.rightArrow)) {
            w.onInput(j, M);
            return
        }
        let G = {
                ..._(P, !1),
                onUndo: A.onUndo,
                onDotRepeat: J
            },
            f = j;
        if (M.leftArrow) f = "h";
        else if (M.rightArrow) f = "l";
        else if (M.upArrow) f = "k";
        else if (M.downArrow) f = "j";
        let Z = hGq(W.command, f, G);
        if (Z.execute) Z.execute();
        if (q.current.mode === "NORMAL") {
            if (Z.next) q.current = {
                mode: "NORMAL",
                command: Z.next
            };
            else if (Z.execute) q.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            }
        }
        if (j === "?" && W.mode === "NORMAL" && W.command.type === "idle") A.onChange("?")
    }
    let D = pc.useCallback((j) => {
        if (j === "INSERT") q.current = {
            mode: "INSERT",
            insertedText: ""
        };
        else q.current = {
            mode: "NORMAL",
            command: {
                type: "idle"
            }
        };
        Y(j), H?.(j)
    }, [H]);
    return {
        ...w,
        onInput: X,
        mode: K,
        setMode: D
    }
}
// @from(Ln 474735, Col 4)
pc
// @from(Ln 474736, Col 4)
BGq = v(() => {
    xhA();
    RD1();
    OS();
    ygA();
    bGq();
    hgA();
    pc = o(X1(), 1)
})
// @from(Ln 474746, Col 0)
function IgA(A) {
    let q = e(36),
        [K] = T7(),
        Y = k_();
    Vf6(Y, !!A.onImagePaste);
    let {
        value: z,
        onChange: w,
        onSubmit: H,
        onExit: $,
        onExitMessage: O,
        onHistoryReset: _,
        onHistoryUp: J,
        onHistoryDown: X,
        onClearInput: D,
        focus: j,
        mask: M,
        multiline: P
    } = A, W = A.showCursor ? " " : "", G = A.highlightPastedText, f = Y ? H6.inverse : E0z, Z;
    if (q[0] !== K) Z = k8("text", K), q[0] = K, q[1] = Z;
    else Z = q[1];
    let N;
    if (q[2] !== A.columns || q[3] !== A.cursorOffset || q[4] !== A.disableCursorMovementForUpDownKeys || q[5] !== A.focus || q[6] !== A.highlightPastedText || q[7] !== A.isLoading || q[8] !== A.mask || q[9] !== A.multiline || q[10] !== A.onChange || q[11] !== A.onChangeCursorOffset || q[12] !== A.onClearInput || q[13] !== A.onExit || q[14] !== A.onExitMessage || q[15] !== A.onHistoryDown || q[16] !== A.onHistoryReset || q[17] !== A.onHistoryUp || q[18] !== A.onImagePaste || q[19] !== A.onModeChange || q[20] !== A.onSubmit || q[21] !== A.onUndo || q[22] !== A.value || q[23] !== W || q[24] !== f || q[25] !== Z) N = {
        value: z,
        onChange: w,
        onSubmit: H,
        onExit: $,
        onExitMessage: O,
        onHistoryReset: _,
        onHistoryUp: J,
        onHistoryDown: X,
        onClearInput: D,
        focus: j,
        mask: M,
        multiline: P,
        cursorChar: W,
        highlightPastedText: G,
        invert: f,
        themeText: Z,
        columns: A.columns,
        onImagePaste: A.onImagePaste,
        disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
        externalOffset: A.cursorOffset,
        onOffsetChange: A.onChangeCursorOffset,
        onModeChange: A.onModeChange,
        isMessageLoading: A.isLoading,
        onUndo: A.onUndo
    }, q[2] = A.columns, q[3] = A.cursorOffset, q[4] = A.disableCursorMovementForUpDownKeys, q[5] = A.focus, q[6] = A.highlightPastedText, q[7] = A.isLoading, q[8] = A.mask, q[9] = A.multiline, q[10] = A.onChange, q[11] = A.onChangeCursorOffset, q[12] = A.onClearInput, q[13] = A.onExit, q[14] = A.onExitMessage, q[15] = A.onHistoryDown, q[16] = A.onHistoryReset, q[17] = A.onHistoryUp, q[18] = A.onImagePaste, q[19] = A.onModeChange, q[20] = A.onSubmit, q[21] = A.onUndo, q[22] = A.value, q[23] = W, q[24] = f, q[25] = Z, q[26] = N;
    else N = q[26];
    let T = uGq(N),
        {
            mode: k,
            setMode: y
        } = T,
        B, S;
    if (q[27] !== k || q[28] !== A.initialMode || q[29] !== y) B = () => {
        if (A.initialMode && A.initialMode !== k) y(A.initialMode)
    }, S = [A.initialMode, k, y], q[27] = k, q[28] = A.initialMode, q[29] = y, q[30] = B, q[31] = S;
    else B = q[30], S = q[31];
    ev6.default.useEffect(B, S);
    let m;
    if (q[32] !== Y || q[33] !== A || q[34] !== T) m = ev6.default.createElement(I, {
        flexDirection: "column"
    }, ev6.default.createElement(ff6, {
        inputState: T,
        terminalFocus: Y,
        highlights: A.highlights,
        ...A
    })), q[32] = Y, q[33] = A, q[34] = T, q[35] = m;
    else m = q[35];
    return m
}
// @from(Ln 474819, Col 0)
function E0z(A) {
    return A
}
// @from(Ln 474822, Col 4)
ev6
// @from(Ln 474823, Col 4)
mGq = v(() => {
    i1();
    m1();
    q3();
    BGq();
    bhA();
    mhA();
    ev6 = o(X1(), 1)
})
// @from(Ln 474833, Col 0)
function hf1(A, q) {
    let K = l8() && q && PM(q);
    switch (A.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (K) return "delegate";
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions":
            return "default";
        case "dontAsk":
            return "default"
    }
}
// @from(Ln 474854, Col 0)
function FGq(A, q) {
    return {
        nextMode: hf1(A, q),
        context: A
    }
}
// @from(Ln 474860, Col 4)
xgA = v(() => {
    S9();
    Cz()
})
// @from(Ln 474865, Col 0)
function QGq(A, q, K, Y, z = !0) {
    let w = A.length;
    if (w === 0) return {
        startIndex: 0,
        endIndex: 0,
        showLeftArrow: !1,
        showRightArrow: !1
    };
    let H = Math.max(0, Math.min(Y, w - 1));
    if (A.reduce((j, M) => j + M, 0) <= q) return {
        startIndex: 0,
        endIndex: w,
        showLeftArrow: !1,
        showRightArrow: !1
    };
    let O = [0];
    for (let j = 0; j < w; j++) O.push(O[j] + A[j]);

    function _(j, M) {
        let P = O[M] - O[j];
        if (z && j > 0) return P - 1;
        return P
    }

    function J(j, M) {
        let P = q;
        if (j > 0) P -= K;
        if (M < w) P -= K;
        return P
    }
    let X = 0,
        D = 1;
    while (D < w && _(X, D + 1) <= J(X, D + 1)) D++;
    if (H >= X && H < D) return {
        startIndex: X,
        endIndex: D,
        showLeftArrow: X > 0,
        showRightArrow: D < w
    };
    if (H >= D) {
        D = H + 1, X = H;
        while (X > 0 && _(X - 1, D) <= J(X - 1, D)) X--
    } else {
        X = H, D = H + 1;
        while (D < w && _(X, D + 1) <= J(X, D + 1)) D++
    }
    return {
        startIndex: X,
        endIndex: D,
        showLeftArrow: X > 0,
        showRightArrow: D < w
    }
}
// @from(Ln 474919, Col 0)
function If1(A) {
    return A === "completed" || A === "failed" || A === "killed"
}
// @from(Ln 474923, Col 0)
function J11(A, q) {
    if (!q) return !1;
    let K = !1;
    for (let Y of Object.values(A)) {
        if (!IN(Y) || KY() && Y.type === "local_agent") continue;
        if (K = !0, Y.type !== "in_process_teammate") return !1
    }
    return K
}
// @from(Ln 474932, Col 4)
k0z
// @from(Ln 474933, Col 4)
Qc1 = v(() => {
    i1();
    m1();
    cM();
    k0z = o(X1(), 1)
})
// @from(Ln 474940, Col 0)
function bgA(A) {
    let q = e(69),
        {
            tasksSelected: K,
            showHint: Y,
            isViewingTeammate: z,
            teammateFooterIndex: w,
            isLeaderIdle: H
        } = A,
        $ = w === void 0 ? 0 : w,
        O = H === void 0 ? !1 : H,
        {
            columns: _
        } = Z8(),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = f6(), q[0] = J;
    else J = q[0];
    let X = J.hasSeenTasksHint,
        D = v6(B0z),
        j = v6(u0z),
        M;
    if (q[1] !== D) M = Object.values(D ?? {}).filter(b0z), q[1] = D, q[2] = M;
    else M = q[2];
    let P = M,
        G = v6(x0z) === "teammates",
        f = !G && P.length > 0 && P.every(I0z),
        Z;
    if (q[3] !== P) Z = P.filter(h0z).sort(S0z), q[3] = P, q[4] = Z;
    else Z = q[4];
    let N = Z,
        T;
    if (q[5] !== O) T = {
        name: "main",
        color: void 0,
        isIdle: O
    }, q[5] = O, q[6] = T;
    else T = q[6];
    let k = T,
        y;
    if (q[7] !== k || q[8] !== K || q[9] !== N) {
        let U = N.map(C0z);
        if (!K) U.sort(y0z);
        y = [k, ...U].map(R0z), q[7] = k, q[8] = K, q[9] = N, q[10] = y
    } else y = q[10];
    let B = y,
        S;
    if (q[11] !== B) S = B.map(L0z), q[11] = B, q[12] = S;
    else S = q[12];
    let m = S;
    if (f || !G && z) {
        let U = K ? $ : -1,
            x;
        if (q[13] !== N || q[14] !== j) x = j ? N.findIndex((Y1) => Y1.id === j) + 1 : 0, q[13] = N, q[14] = j, q[15] = x;
        else x = q[15];
        let p = x,
            l;
        if (q[16] !== Y || q[17] !== K) l = Y && !X && !K ? o4.createElement(o4.Fragment, null, o4.createElement(V, {
            dimColor: !0
        }, " · "), o4.createElement(V, {
            dimColor: !0
        }, o4.createElement(YA, {
            shortcut: "↓",
            action: "view"
        }))) : null, q[16] = Y, q[17] = K, q[18] = l;
        else l = q[18];
        let r = l,
            O1 = Math.max(20, _ - (r ? 15 : 0) - 4),
            T1 = U >= 0 ? U : 0,
            N1;
        if (q[19] !== O1 || q[20] !== m || q[21] !== T1) N1 = QGq(m, O1, 2, T1), q[19] = O1, q[20] = m, q[21] = T1, q[22] = N1;
        else N1 = q[22];
        let {
            startIndex: j1,
            endIndex: q1,
            showLeftArrow: t,
            showRightArrow: J1
        } = N1, D1;
        if (q[23] !== B || q[24] !== q1 || q[25] !== j1) D1 = B.slice(j1, q1), q[23] = B, q[24] = q1, q[25] = j1, q[26] = D1;
        else D1 = q[26];
        let Z1 = D1,
            E1;
        if (q[27] !== t) E1 = t && o4.createElement(V, {
            dimColor: !0
        }, l1.arrowLeft, " "), q[27] = t, q[28] = E1;
        else E1 = q[28];
        let a;
        if (q[29] !== U || q[30] !== p || q[31] !== Z1) a = Z1.map((Y1, _1) => {
            let $1 = _1 > 0;
            return o4.createElement(o4.Fragment, {
                key: Y1.name
            }, $1 && o4.createElement(V, null, " "), o4.createElement(m0z, {
                name: Y1.name,
                color: Y1.color,
                isSelected: U === Y1.idx,
                isViewed: p === Y1.idx,
                isIdle: Y1.isIdle
            }))
        }), q[29] = U, q[30] = p, q[31] = Z1, q[32] = a;
        else a = q[32];
        let A1;
        if (q[33] !== J1) A1 = J1 && o4.createElement(V, {
            dimColor: !0
        }, " ", l1.arrowRight), q[33] = J1, q[34] = A1;
        else A1 = q[34];
        let M1;
        if (q[35] === Symbol.for("react.memo_cache_sentinel")) M1 = o4.createElement(V, {
            dimColor: !0
        }, " · shift+↑ to expand"), q[35] = M1;
        else M1 = q[35];
        let z1;
        if (q[36] !== E1 || q[37] !== a || q[38] !== A1 || q[39] !== r) z1 = o4.createElement(o4.Fragment, null, E1, a, A1, r, M1), q[36] = E1, q[37] = a, q[38] = A1, q[39] = r, q[40] = z1;
        else z1 = q[40];
        return z1
    }
    if (J11(D ?? {}, G)) return null;
    let b;
    if (q[41] !== Y || q[42] !== K) b = Y && (K || !X) ? o4.createElement(o4.Fragment, null, o4.createElement(V, {
        dimColor: !0
    }, " · "), o4.createElement(V, {
        dimColor: !0
    }, K ? o4.createElement(YA, {
        shortcut: "Enter",
        action: "view tasks"
    }) : o4.createElement(YA, {
        shortcut: "↓",
        action: "view"
    }))) : null, q[41] = Y, q[42] = K, q[43] = b;
    else b = q[43];
    let g = b;
    if (P.length === 0) return null;
    if (P.length === 1 && _ >= 150) {
        let U = P[0],
            x, p, l, r;
        if (q[44] !== U || q[45] !== K) {
            let N1 = Q0z(U);
            x = V, p = "background", l = K, r = DY(N1, 40, !0), q[44] = U, q[45] = K, q[46] = x, q[47] = p, q[48] = l, q[49] = r
        } else x = q[46], p = q[47], l = q[48], r = q[49];
        let s;
        if (q[50] !== U.status) s = o4.createElement(V, {
            dimColor: !0
        }, "(", U.status, ")"), q[50] = U.status, q[51] = s;
        else s = q[51];
        let O1;
        if (q[52] !== x || q[53] !== p || q[54] !== l || q[55] !== r || q[56] !== s) O1 = o4.createElement(x, {
            color: p,
            inverse: l
        }, r, " ", s), q[52] = x, q[53] = p, q[54] = l, q[55] = r, q[56] = s, q[57] = O1;
        else O1 = q[57];
        let T1;
        if (q[58] !== g || q[59] !== O1) T1 = o4.createElement(o4.Fragment, null, O1, g), q[58] = g, q[59] = O1, q[60] = T1;
        else T1 = q[60];
        return T1
    }
    if (P.length >= 1) {
        let U;
        if (q[61] !== P) U = g0z(P), q[61] = P, q[62] = U;
        else U = q[62];
        let x = U,
            p;
        if (q[63] !== x || q[64] !== K) p = o4.createElement(V, {
            color: "background",
            inverse: K
        }, x), q[63] = x, q[64] = K, q[65] = p;
        else p = q[65];
        let l;
        if (q[66] !== g || q[67] !== p) l = o4.createElement(o4.Fragment, null, p, g), q[66] = g, q[67] = p, q[68] = l;
        else l = q[68];
        return l
    }
    return null
}
// @from(Ln 475112, Col 0)
function L0z(A, q) {
    let K = `@${A.name}`;
    return UA(K) + (q > 0 ? 1 : 0)
}
// @from(Ln 475117, Col 0)
function R0z(A, q) {
    return {
        ...A,
        idx: q
    }
}
// @from(Ln 475124, Col 0)
function y0z(A, q) {
    if (A.isIdle !== q.isIdle) return A.isIdle ? 1 : -1;
    return 0
}
// @from(Ln 475129, Col 0)
function C0z(A) {
    return {
        name: A.identity.agentName,
        color: F0z(A.identity.color),
        isIdle: A.isIdle
    }
}
// @from(Ln 475137, Col 0)
function S0z(A, q) {
    return A.identity.agentName.localeCompare(q.identity.agentName)
}
// @from(Ln 475141, Col 0)
function h0z(A) {
    return A.type === "in_process_teammate"
}
// @from(Ln 475145, Col 0)
function I0z(A) {
    return A.type === "in_process_teammate"
}
// @from(Ln 475149, Col 0)
function x0z(A) {
    return A.expandedView
}
// @from(Ln 475153, Col 0)
function b0z(A) {
    return IN(A) && !(KY() && A.type === "local_agent")
}
// @from(Ln 475157, Col 0)
function u0z(A) {
    return A.viewingAgentTaskId
}
// @from(Ln 475161, Col 0)
function B0z(A) {
    return A.tasks
}
// @from(Ln 475165, Col 0)
function m0z(A) {
    let q = e(14),
        {
            name: K,
            color: Y,
            isSelected: z,
            isViewed: w,
            isIdle: H
        } = A;
    if (z) {
        let _;
        if (q[0] !== Y || q[1] !== w || q[2] !== K) _ = Y ? o4.createElement(V, {
            backgroundColor: Y,
            color: "inverseText",
            bold: w
        }, "@", K) : o4.createElement(V, {
            color: "background",
            inverse: !0,
            bold: w
        }, "@", K), q[0] = Y, q[1] = w, q[2] = K, q[3] = _;
        else _ = q[3];
        return _
    }
    if (H) {
        let _;
        if (q[4] !== w || q[5] !== K) _ = o4.createElement(V, {
            dimColor: !0,
            bold: w
        }, "@", K), q[4] = w, q[5] = K, q[6] = _;
        else _ = q[6];
        return _
    }
    if (w) {
        let _;
        if (q[7] !== Y || q[8] !== K) _ = o4.createElement(V, {
            color: Y,
            bold: !0
        }, "@", K), q[7] = Y, q[8] = K, q[9] = _;
        else _ = q[9];
        return _
    }
    let $ = !Y,
        O;
    if (q[10] !== Y || q[11] !== K || q[12] !== $) O = o4.createElement(V, {
        color: Y,
        dimColor: $
    }, "@", K), q[10] = Y, q[11] = K, q[12] = $, q[13] = O;
    else O = q[13];
    return O
}
// @from(Ln 475216, Col 0)
function F0z(A) {
    if (!A) return;
    if (cO.includes(A)) return lO[A];
    return
}
// @from(Ln 475222, Col 0)
function Q0z(A) {
    switch (A.type) {
        case "local_bash":
            return A.command;
        case "local_agent":
            return A.description;
        case "remote_agent":
            return A.title;
        case "in_process_teammate":
            return `@${A.identity.agentName}`
    }
}
// @from(Ln 475235, Col 0)
function g0z(A) {
    let q = A.length;
    if (A.every((Y) => Y.type === A[0].type)) switch (A[0].type) {
        case "local_bash":
            return q === 1 ? "1 bash" : `${q} bashes`;
        case "in_process_teammate": {
            let Y = new Set(A.map((z) => z.type === "in_process_teammate" ? z.identity.teamName : "")).size;
            return Y === 1 ? "1 team" : `${Y} teams`
        }
        case "local_agent":
            return q === 1 ? "1 local agent" : `${q} local agents`;
        case "remote_agent":
            return q === 1 ? "1 remote session" : `${q} remote sessions`
    }
    return `${q} background ${q===1?"task":"tasks"}`
}
// @from(Ln 475251, Col 4)
o4
// @from(Ln 475252, Col 4)
gGq = v(() => {
    i1();
    m1();
    b7();
    cA();
    d8();
    wK();
    mq();
    vq();
    LY();
    cM();
    lM();
    Qc1();
    o4 = o(X1(), 1)
})
// @from(Ln 475268, Col 0)
function UGq(A) {
    let q = e(14),
        {
            teamsSelected: K,
            showHint: Y
        } = A,
        z = v6(p0z),
        w;
    if (q[0] !== z) w = z ? Object.values(z.teammates).filter(U0z).length : 0, q[0] = z, q[1] = w;
    else w = q[1];
    let H = w;
    if (H === 0) return null;
    let $;
    if (q[2] !== Y || q[3] !== K) $ = Y && K ? uj.createElement(uj.Fragment, null, uj.createElement(V, {
        dimColor: !0
    }, "· "), uj.createElement(V, {
        dimColor: !0
    }, "Enter to view")) : null, q[2] = Y, q[3] = K, q[4] = $;
    else $ = q[4];
    let O = $,
        _ = `${H} ${H===1?"teammate":"teammates"}`,
        J = K ? "selected" : "normal",
        X;
    if (q[5] !== _ || q[6] !== J || q[7] !== K) X = uj.createElement(V, {
        key: J,
        color: "background",
        inverse: K
    }, _), q[5] = _, q[6] = J, q[7] = K, q[8] = X;
    else X = q[8];
    let D;
    if (q[9] !== O) D = O ? uj.createElement(V, null, " ", O) : null, q[9] = O, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== X || q[12] !== D) j = uj.createElement(uj.Fragment, null, X, D), q[11] = X, q[12] = D, q[13] = j;
    else j = q[13];
    return j
}
// @from(Ln 475306, Col 0)
function U0z(A) {
    return A.name !== "team-lead"
}
// @from(Ln 475310, Col 0)
function p0z(A) {
    return A.teamContext
}
// @from(Ln 475313, Col 4)
uj
// @from(Ln 475314, Col 4)
pGq = v(() => {
    i1();
    m1();
    d8();
    uj = o(X1(), 1)
})
// @from(Ln 475321, Col 0)
function d0z(A) {
    let q = e(9),
        {
            value: K,
            onChange: Y,
            historyFailedMatch: z
        } = A,
        w = z ? "no matching prompt:" : "search prompts:",
        H;
    if (q[0] !== w) H = fY1.createElement(V, {
        dimColor: !0
    }, w), q[0] = w, q[1] = H;
    else H = q[1];
    let $ = UA(K) + 1,
        O;
    if (q[2] !== Y || q[3] !== $ || q[4] !== K) O = fY1.createElement(k3, {
        value: K,
        onChange: Y,
        cursorOffset: K.length,
        onChangeCursorOffset: c0z,
        columns: $,
        focus: !0,
        showCursor: !0,
        multiline: !1,
        dimColor: !0
    }), q[2] = Y, q[3] = $, q[4] = K, q[5] = O;
    else O = q[5];
    let _;
    if (q[6] !== H || q[7] !== O) _ = fY1.createElement(I, {
        gap: 1
    }, H, O), q[6] = H, q[7] = O, q[8] = _;
    else _ = q[8];
    return _
}
// @from(Ln 475356, Col 0)
function c0z() {}
// @from(Ln 475357, Col 4)
fY1
// @from(Ln 475357, Col 9)
dGq
// @from(Ln 475358, Col 4)
cGq = v(() => {
    i1();
    m1();
    gO();
    LY();
    fY1 = o(X1(), 1);
    dGq = d0z
})
// @from(Ln 475367, Col 0)
function n0z(A, q) {
    if (A === q) return !0;
    if (!A || !q) return !1;
    return A.filesCount === q.filesCount && A.linesAdded === q.linesAdded && A.linesRemoved === q.linesRemoved
}
// @from(Ln 475373, Col 0)
function r0z(A, q) {
    if (A.size !== q.size) return !1;
    for (let [K, Y] of A) {
        let z = q.get(K);
        if (!z) return !1;
        if (Y.added !== z.added || Y.removed !== z.removed || Y.isBinary !== z.isBinary) return !1
    }
    return !0
}
// @from(Ln 475383, Col 0)
function o0z(A, q, K) {
    let Y = K?.stats ?? null,
        z = K?.perFileStats ?? new Map;
    if (!n0z(A, Y)) return !0;
    if (!r0z(q, z)) return !0;
    return !1
}
// @from(Ln 475391, Col 0)
function lGq() {
    let A = v6(($) => $.fileHistory.trackedFiles),
        q = v6(($) => $.gitDiff),
        K = L7(),
        Y = dc.useRef(null),
        z = dc.useRef(!1),
        w = A.size > 0,
        H = dc.useCallback(async () => {
            if (!x8("tengu_code_diff_cli", !1)) return;
            let $ = await mF4();
            K((O) => {
                if (!o0z(O.gitDiff.stats, O.gitDiff.perFileStats, $)) return O;
                return {
                    ...O,
                    gitDiff: {
                        ...O.gitDiff,
                        stats: $?.stats ?? null,
                        perFileStats: $?.perFileStats ?? new Map,
                        hunks: $?.hunks ?? new Map,
                        lastUpdated: Date.now()
                    }
                }
            })
        }, [K]);
    return dc.useEffect(() => {
        if (!w) return;
        let $ = !1,
            O = !0;
        async function _() {
            let J = Date.now();
            await H();
            let X = Date.now() - J;
            if (O && X > i0z) {
                z.current = !0;
                return
            }
            if (O = !1, !$) Y.current = setTimeout(() => void _(), l0z)
        }
        return _(), () => {
            if ($ = !0, Y.current) clearTimeout(Y.current), Y.current = null
        }
    }, [w, H]), dc.useMemo(() => {
        if (z.current) return null;
        if (!w) return null;
        if (!q.stats) return null;
        return {
            stats: q.stats,
            perFileStats: q.perFileStats,
            hunks: q.hunks
        }
    }, [w, q.stats, q.perFileStats, q.hunks])
}
// @from(Ln 475443, Col 4)
dc
// @from(Ln 475443, Col 8)
l0z = 20000
// @from(Ln 475444, Col 4)
i0z = 2000
// @from(Ln 475445, Col 4)
iGq = v(() => {
    d8();
    rQ1();
    U4();
    dc = o(X1(), 1)
})
// @from(Ln 475452, Col 0)
function s0z(A, q) {
    if (A) return "draft";
    switch (q) {
        case "APPROVED":
            return "approved";
        case "CHANGES_REQUESTED":
            return "changes_requested";
        default:
            return "pending"
    }
}
// @from(Ln 475463, Col 0)
async function nGq() {
    if (!await aj()) return null;
    let [q, K] = await Promise.all([sj(), tj()]);
    if (q === K) return null;
    let {
        stdout: Y,
        code: z
    } = await IA("gh", ["pr", "view", "--json", "number,url,reviewDecision,isDraft,headRefName,state"], {
        timeout: a0z,
        preserveOutputOnError: !1
    });
    if (z !== 0 || !Y.trim()) return null;
    try {
        let w = _A(Y),
            H = await tj();
        if (w.headRefName === H || w.headRefName === "main" || w.headRefName === "master") return null;
        return {
            number: w.number,
            url: w.url,
            reviewState: w.state === "MERGED" ? "merged" : s0z(w.isDraft, w.reviewDecision)
        }
    } catch {
        return null
    }
}
// @from(Ln 475488, Col 4)
a0z = 5000
// @from(Ln 475489, Col 4)
rGq = v(() => {
    tq();
    h9();
    m6()
})
// @from(Ln 475495, Col 0)
function oGq() {
    let A = L7(),
        q = xf1.useRef(null),
        K = xf1.useCallback(async () => {
            let Y = await nGq();
            A((z) => {
                let w = Y?.number ?? null,
                    H = Y?.reviewState ?? null;
                if (z.prStatus.number === w && z.prStatus.reviewState === H) return z;
                return {
                    ...z,
                    prStatus: {
                        number: w,
                        url: Y?.url ?? null,
                        reviewState: H,
                        lastUpdated: Date.now()
                    }
                }
            })
        }, [A]);
    xf1.useEffect(() => {
        let Y = !1;
        async function z() {
            let w = Date.now();
            if (await K(), Date.now() - w > e0z) return;
            if (!Y) q.current = setTimeout(() => void z(), t0z)
        }
        return z(), () => {
            if (Y = !0, q.current) clearTimeout(q.current), q.current = null
        }
    }, [K])
}
// @from(Ln 475527, Col 4)
xf1
// @from(Ln 475527, Col 9)
t0z = 60000
// @from(Ln 475528, Col 4)
e0z = 4000
// @from(Ln 475529, Col 4)
aGq = v(() => {
    d8();
    rGq();
    xf1 = o(X1(), 1)
})
// @from(Ln 475535, Col 0)
function eGq(A) {
    let q = e(28),
        {
            exitMessage: K,
            vimMode: Y,
            mode: z,
            toolPermissionContext: w,
            suppressHint: H,
            isLoading: $,
            hasInput: O,
            tasksSelected: _,
            teamsSelected: J,
            diffSelected: X,
            teammateFooterIndex: D,
            isPasting: j,
            isSearching: M,
            historyQuery: P,
            setHistoryQuery: W,
            historyFailedMatch: G
        } = A;
    if (K.show) {
        let m;
        if (q[0] !== K.key) m = m7.createElement(V, {
            dimColor: !0,
            key: "exit-message"
        }, "Press ", K.key, " again to exit"), q[0] = K.key, q[1] = m;
        else m = q[1];
        return m
    }
    if (j) {
        let m;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) m = m7.createElement(V, {
            dimColor: !0,
            key: "pasting-message"
        }, "Pasting text…"), q[2] = m;
        else m = q[2];
        return m
    }
    let f;
    if (q[3] !== M || q[4] !== Y) f = _e() && Y === "INSERT" && !M, q[3] = M, q[4] = Y, q[5] = f;
    else f = q[5];
    let Z = f,
        N;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) N = AZq() && m7.createElement(Gjz, null), q[6] = N;
    else N = q[6];
    let T;
    if (q[7] !== G || q[8] !== P || q[9] !== M || q[10] !== W) T = M && m7.createElement(dGq, {
        value: P,
        onChange: W,
        historyFailedMatch: G
    }), q[7] = G, q[8] = P, q[9] = M, q[10] = W, q[11] = T;
    else T = q[11];
    let k;
    if (q[12] !== Z) k = Z ? m7.createElement(V, {
        dimColor: !0,
        key: "vim-insert"
    }, "-- INSERT --") : null, q[12] = Z, q[13] = k;
    else k = q[13];
    let y = !H && !Z,
        B;
    if (q[14] !== X || q[15] !== O || q[16] !== $ || q[17] !== z || q[18] !== y || q[19] !== _ || q[20] !== D || q[21] !== J || q[22] !== w) B = m7.createElement(qjz, {
        mode: z,
        toolPermissionContext: w,
        showHint: y,
        isLoading: $,
        hasInput: O,
        tasksSelected: _,
        teamsSelected: J,
        diffSelected: X,
        teammateFooterIndex: D
    }), q[14] = X, q[15] = O, q[16] = $, q[17] = z, q[18] = y, q[19] = _, q[20] = D, q[21] = J, q[22] = w, q[23] = B;
    else B = q[23];
    let S;
    if (q[24] !== T || q[25] !== k || q[26] !== B) S = m7.createElement(I, {
        justifyContent: "flex-start",
        gap: 1
    }, N, T, k, B), q[24] = T, q[25] = k, q[26] = B, q[27] = S;
    else S = q[27];
    return S
}
// @from(Ln 475616, Col 0)
function qjz(A) {
    let q = e(24),
        {
            mode: K,
            toolPermissionContext: Y,
            showHint: z,
            isLoading: w,
            hasInput: H,
            tasksSelected: $,
            teamsSelected: O,
            diffSelected: _,
            teammateFooterIndex: J
        } = A,
        {
            columns: X
        } = Z8(),
        D = RK("chat:cycleMode", "Chat", "shift+tab"),
        j = v6(Mjz),
        M = v6(jjz),
        P = v6(Djz),
        W = v6(Xjz),
        G = v6(Jjz),
        f = v6(_jz),
        Z = f === "teammates",
        N = v6(Ojz),
        k = qE6.useSyncExternalStore(sGq?.subscribeToProactiveChanges ?? Ajz, sGq?.getNextTickAt ?? tGq, tGq) !== null,
        y = !1,
        B;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) B = !1, q[0] = B;
    else B = q[0];
    let S = B,
        m;
    if (q[1] !== j) m = Object.values(j).filter((H1) => IN(H1) && !(S && H1.type === "local_agent")), q[1] = j, q[2] = m;
    else m = q[2];
    let b = m.length,
        g = VP1(),
        U = v6($jz),
        x;
    if (q[3] !== U || q[4] !== g) x = g !== void 0 && g.length > 0 || Object.values(U).some(Hjz), q[3] = U, q[4] = g, q[5] = x;
    else x = q[5];
    let p = x,
        l = RK("chat:cancel", "Chat", "esc").toLowerCase(),
        r = RK("app:toggleTodos", "Global", "ctrl+t"),
        s = lGq(),
        O1;
    if (q[6] !== s?.stats) O1 = x8("tengu_code_diff_cli", !1) ? s?.stats ?? null : null, q[6] = s?.stats, q[7] = O1;
    else O1 = q[7];
    let T1 = O1,
        N1;
    if (q[8] !== M) N1 = l8() && !Rm() && M !== void 0 && Object.values(M.teammates).filter(wjz).length > 0, q[8] = M, q[9] = N1;
    else N1 = q[9];
    let j1 = N1;
    if (K === "bash") {
        let H1;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) H1 = m7.createElement(V, {
            color: "bashBorder"
        }, "! for bash mode"), q[10] = H1;
        else H1 = q[10];
        return H1
    }
    if (K === "background") {
        let H1;
        if (q[11] === Symbol.for("react.memo_cache_sentinel")) H1 = m7.createElement(V, {
            color: "background"
        }, "& to background"), q[11] = H1;
        else H1 = q[11];
        return H1
    }
    let q1 = Y?.mode,
        t = !Lw8(q1),
        J1 = W === "viewing-agent",
        D1 = G ? j[G] : void 0,
        Z1 = J1 && D1 != null && D1.status !== "running",
        E1 = b > 0 || J1,
        a = (S || t ? 1 : 0) + (E1 ? 1 : 0) + (j1 ? 1 : 0),
        z1 = (f6().codeDiffFooterEnabled ?? !0) && T1 && T1.filesCount > 0 && a < 2 && (a === 0 || X >= 100),
        Y1 = AZq() && N.number !== null && N.reviewState !== null && N.url !== null && a < 2 && (a === 0 || X >= 100),
        _1 = a < 2,
        G1 = !Z && E1 && Object.values(j).some(zjz) || !Z && J1,
        L1 = [...P ? [m7.createElement(d7, {
            url: P,
            key: "remote"
        }, m7.createElement(V, {
            color: "ide"
        }, l1.circleDouble, " remote"))] : [], ...q1 && t ? [m7.createElement(V, {
            color: cP(q1),
            key: "mode"
        }, Rv1(q1), " ", !1, CQ(q1).toLowerCase(), " on", _1 && m7.createElement(V, {
            dimColor: !0
        }, " ", m7.createElement(YA, {
            shortcut: D,
            action: "cycle",
            parens: !0
        })))] : [], ...E1 && !G1 && !J11(j, Z) ? [m7.createElement(bgA, {
            key: "tasks",
            tasksSelected: $,
            showHint: z && !j1,
            isViewingTeammate: J1,
            teammateFooterIndex: J,
            isLeaderIdle: !w
        })] : [], ...l8() && j1 ? [m7.createElement(UGq, {
            key: "teams",
            teamsSelected: O,
            showHint: z && !E1
        })] : [], ...z1 ? [m7.createElement(V, {
            key: "code-changes",
            dimColor: !_,
            inverse: _,
            color: _ ? "background" : void 0
        }, T1.filesCount, " ", T1.filesCount === 1 ? "file" : "files", " ", m7.createElement(V, {
            color: "diffAddedWord"
        }, "+", T1.linesAdded), " ", m7.createElement(V, {
            color: "diffRemovedWord"
        }, "-", T1.linesRemoved), _ && z && m7.createElement(V, {
            dimColor: !0
        }, " · Enter to view"))] : [], ...Y1 ? [m7.createElement(V, {
            key: "pr-status",
            dimColor: !0
        }, m7.createElement(V, {
            color: Wjz(N.reviewState)
        }, "PR"), " ", m7.createElement(d7, {
            url: N.url
        }, m7.createElement(V, {
            underline: !0
        }, "#", N.number)))] : []],
        x1 = Object.values(j).some(Yjz),
        f1 = z ? Pjz(w, l, r, p, f, x1) : [];
    if (Z1) L1.push(m7.createElement(V, {
        dimColor: !0,
        key: "esc-return"
    }, m7.createElement(YA, {
        shortcut: l,
        action: "return to team lead"
    })));
    else if (!G1 && z) L1.push(...f1);
    if (G1) {
        let H1 = Z1 ? L1 : [...L1, ...f1],
            y1 = !w,
            B1;
        if (q[14] !== J1 || q[15] !== y1 || q[16] !== $ || q[17] !== J) B1 = m7.createElement(I, null, m7.createElement(bgA, {
            tasksSelected: $,
            showHint: !1,
            isViewingTeammate: J1,
            teammateFooterIndex: J,
            isLeaderIdle: y1
        })), q[14] = J1, q[15] = y1, q[16] = $, q[17] = J, q[18] = B1;
        else B1 = q[18];
        let A6 = H1.length > 0 && m7.createElement(I, null, m7.createElement(oA, null, H1)),
            O6;
        if (q[19] !== B1 || q[20] !== A6) O6 = m7.createElement(I, {
            flexDirection: "column"
        }, B1, A6), q[19] = B1, q[20] = A6, q[21] = O6;
        else O6 = q[21];
        return O6
    }
    let R1 = S && Object.values(j).some(Kjz);
    if (L1.length === 0 && z) {
        let H1;
        if (q[22] === Symbol.for("react.memo_cache_sentinel")) H1 = m7.createElement(V, {
            dimColor: !0,
            key: "shortcuts-hint"
        }, "? for shortcuts"), q[22] = H1;
        else H1 = q[22];
        L1.push(H1)
    }
    if (R1 && z) {
        let H1;
        if (q[23] === Symbol.for("react.memo_cache_sentinel")) H1 = m7.createElement(V, {
            dimColor: !0,
            key: "manage-tasks"
        }, m7.createElement(YA, {
            shortcut: "↓",
            action: "manage tasks"
        })), q[23] = H1;
        else H1 = q[23];
        L1.push(H1)
    }
    if (L1.length === 0) return null;
    return m7.createElement(I, null, m7.createElement(oA, null, L1))
}
// @from(Ln 475797, Col 0)
function Kjz(A) {
    return A.type === "local_agent" && !If1(A.status)
}
// @from(Ln 475801, Col 0)
function Yjz(A) {
    return A.type === "in_process_teammate" && A.status === "running"
}
// @from(Ln 475805, Col 0)
function zjz(A) {
    return A.type === "in_process_teammate"
}
// @from(Ln 475809, Col 0)
function wjz(A) {
    return A.name !== "team-lead"
}
// @from(Ln 475813, Col 0)
function Hjz(A) {
    return A.length > 0
}
// @from(Ln 475817, Col 0)
function $jz(A) {
    return A.todos
}
// @from(Ln 475821, Col 0)
function Ojz(A) {
    return A.prStatus
}
// @from(Ln 475825, Col 0)
function _jz(A) {
    return A.expandedView
}
// @from(Ln 475829, Col 0)
function Jjz(A) {
    return A.viewingAgentTaskId
}
// @from(Ln 475833, Col 0)
function Xjz(A) {
    return A.viewSelectionMode
}
// @from(Ln 475837, Col 0)
function Djz(A) {
    return A.remoteSessionUrl
}
// @from(Ln 475841, Col 0)
function jjz(A) {
    return A.teamContext
}
// @from(Ln 475845, Col 0)
function Mjz(A) {
    return A.tasks
}
// @from(Ln 475849, Col 0)
function Pjz(A, q, K, Y, z, w) {
    let H;
    if (w) switch (z) {
        case "none":
            H = "show tasks";
            break;
        case "tasks":
            H = "show teammates";
            break;
        case "teammates":
            H = "hide";
            break
    } else H = z === "tasks" ? "hide tasks" : "show tasks";
    let $ = Y || w;
    return [...A ? [m7.createElement(V, {
        dimColor: !0,
        key: "esc"
    }, m7.createElement(YA, {
        shortcut: q,
        action: "interrupt"
    }))] : [], ...$ ? [m7.createElement(V, {
        dimColor: !0,
        key: "toggle-tasks"
    }, m7.createElement(YA, {
        shortcut: K,
        action: H
    }))] : []]
}
// @from(Ln 475878, Col 0)
function Wjz(A) {
    switch (A) {
        case "approved":
            return "success";
        case "changes_requested":
            return "error";
        case "pending":
            return "warning";
        case "merged":
            return "merged";
        case "draft":
            return
    }
}
// @from(Ln 475893, Col 0)
function Gjz() {
    return oGq(), null
}
// @from(Ln 475897, Col 0)
function AZq() {
    return x8("tengu_pr_status_cli", !1) && (f6().prStatusFooterEnabled ?? !0)
}
// @from(Ln 475900, Col 4)
m7
// @from(Ln 475900, Col 8)
qE6
// @from(Ln 475900, Col 13)
sGq = null
// @from(Ln 475901, Col 4)
Ajz = (A) => () => {}
// @from(Ln 475902, Col 4)
tGq = () => null
// @from(Ln 475903, Col 4)
qZq = v(() => {
    i1();
    m1();
    b7();
    DZ1();
    s2();
    oj();
    gGq();
    Qc1();
    S9();
    pGq();
    JI();
    d8();
    cGq();
    iGq();
    aGq();
    wK();
    HK();
    mq();
    Nj6();
    vq();
    U4();
    cA();
    m7 = o(X1(), 1), qE6 = o(X1(), 1)
})
// @from(Ln 475929, Col 0)
function ugA(A) {
    return A?.statusLine !== void 0
}
// @from(Ln 475933, Col 0)
function Zjz(A, q, K, Y, z) {
    let w = PN1(),
        H = $71({
            permissionMode: A,
            mainLoopModel: l3(),
            exceeds200kTokens: q
        }),
        $ = K?.outputStyle || Wj,
        O = Ew6(Y),
        _ = yG(H, FP()),
        J = mcA(O, _);
    return {
        ...aX(),
        model: {
            id: H,
            display_name: dG(H)
        },
        workspace: {
            current_dir: h6(),
            project_dir: y8()
        },
        version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION,
        output_style: {
            name: $
        },
        cost: {
            total_cost_usd: W0(),
            total_duration_ms: oz1(),
            total_api_duration_ms: wT(),
            total_lines_added: q61(),
            total_lines_removed: K61()
        },
        context_window: {
            total_input_tokens: AN1(),
            total_output_tokens: qN1(),
            context_window_size: _,
            current_usage: O,
            used_percentage: J.used,
            remaining_percentage: J.remaining
        },
        exceeds_200k_tokens: q,
        ..._e() && {
            vim: {
                mode: z ?? "INSERT"
            }
        },
        ...w && {
            agent: {
                name: w
            }
        },
        ...Nq() && {
            remote: {
                session_id: U6()
            }
        }
    }
}
// @from(Ln 475999, Col 0)
function KZq(A) {
    let q = A.findLast((K) => K.type === "assistant");
    return q?.uuid || q?.message?.id || null
}
// @from(Ln 476004, Col 0)
function YZq({
    messages: A,
    vimMode: q
}) {
    let K = Mf.useRef(void 0),
        Y = v6((W) => W.toolPermissionContext.mode),
        z = v6((W) => W.statusLineText),
        w = L7(),
        H = $j(),
        $ = Mf.useRef(A);
    $.current = A;
    let O = Mf.useRef(H);
    O.current = H;
    let _ = Mf.useRef(q);
    _.current = q;
    let J = Mf.useRef(Y);
    J.current = Y;
    let X = Mf.useRef({
            messageId: null,
            exceeds200kTokens: !1,
            permissionMode: Y,
            vimMode: q
        }),
        D = Mf.useRef(void 0),
        j = Mf.useCallback(async (W) => {
            K.current?.abort();
            let G = new AbortController;
            K.current = G;
            let f = W ?? $.current;
            try {
                let Z = X.current.exceeds200kTokens,
                    N = KZq(f);
                if (N !== X.current.messageId) Z = kw6(f), X.current.messageId = N, X.current.exceeds200kTokens = Z;
                let T = Zjz(J.current, Z, O.current, f, _.current),
                    k = await JyA(T, G.signal);
                if (!G.signal.aborted) w((y) => {
                    if (y.statusLineText === k) return y;
                    return {
                        ...y,
                        statusLineText: k
                    }
                })
            } catch {}
        }, [w]),
        M = Mf.useCallback(() => {
            if (D.current !== void 0) clearTimeout(D.current);
            D.current = setTimeout(() => {
                D.current = void 0, j()
            }, 300)
        }, [j]);
    Mf.useEffect(() => {
        if (KZq(A) !== X.current.messageId || Y !== X.current.permissionMode || q !== X.current.vimMode) X.current.permissionMode = Y, X.current.vimMode = q, M()
    }, [A, Y, q, M]), Mf.useEffect(() => {
        let W = H?.statusLine;
        if (W) {
            if (c("tengu_status_line_mount", {
                    command_length: W.command.length,
                    padding: W.padding
                }), H.disableAllHooks === !0) h("Status line is configured but disableAllHooks is true", {
                level: "warn"
            })
        }
    }, []), Mf.useEffect(() => {
        return j(), () => {
            if (K.current?.abort(), D.current !== void 0) clearTimeout(D.current)
        }
    }, []);
    let P = H?.statusLine?.padding ?? 0;
    return VY1.createElement(I, {
        paddingX: P,
        gap: 2
    }, z && VY1.createElement(V, {
        dimColor: !0
    }, VY1.createElement(W3, null, z)))
}
// @from(Ln 476079, Col 4)
VY1
// @from(Ln 476079, Col 9)
Mf
// @from(Ln 476080, Col 4)
zZq = v(() => {
    m1();
    aM();
    B6();
    N7();
    cp();
    e7();
    aM();
    u6();
    Z6();
    d8();
    Em();
    DL();
    hf();
    RW();
    DZ1();
    VY1 = o(X1(), 1), Mf = o(X1(), 1)
})
// @from(Ln 476099, Col 0)
function wZq({
    selectedIndex: A
}) {
    let q = v6((_) => _.tasks),
        K = zD.useRef([]),
        [, Y] = zD.useState(0);
    zD.useEffect(() => {
        let _ = setInterval(() => {
            Y((J) => J + 1)
        }, 1000);
        return () => clearInterval(_)
    }, []);
    let z = zD.useMemo(() => {
            let _ = new Map;
            for (let J of Object.values(q))
                if (J.type === "local_agent") _.set(J.id, J);
            return _
        }, [q]),
        w = new Set(K.current),
        H = [...z.keys()].filter((_) => !w.has(_)).sort((_, J) => {
            let X = z.get(_),
                D = z.get(J);
            if (!X || !D) return 0;
            return X.startTime - D.startTime
        });
    if (H.length > 0) K.current = [...K.current, ...H];
    if (!KY()) return null;
    let $ = 3000,
        O = [];
    for (let _ of K.current) {
        let J = z.get(_);
        if (!J) continue;
        if (!If1(J.status)) O.push(J);
        else if (J.status === "killed" && J.endTime) {
            if (Date.now() - J.endTime < $) O.push(J)
        }
    }
    if (O.length === 0) return null;
    return zD.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, O.map((_, J) => zD.createElement(Njz, {
        key: _.id,
        task: _,
        isSelected: A === J
    })))
}
// @from(Ln 476147, Col 0)
function HZq() {
    let A = v6(Vjz),
        q;
    A: {
        if (!KY()) {
            q = 0;
            break A
        }
        let K = Date.now(),
            Y = Object.values(A).filter(fjz),
            z = 0;
        for (let w of Y)
            if (!If1(w.status)) z++;
            else if (w.status === "killed" && w.endTime && K - w.endTime < 3000) z++;q = z
    }
    return q
}
// @from(Ln 476165, Col 0)
function fjz(A) {
    return A.type === "local_agent"
}
// @from(Ln 476169, Col 0)
function Vjz(A) {
    return A.tasks
}
// @from(Ln 476173, Col 0)
function Njz(A) {
    let q = e(30),
        {
            task: K,
            isSelected: Y
        } = A,
        {
            columns: z
        } = Z8(),
        w = !If1(K.status),
        H = w ? Date.now() - K.startTime : (K.endTime ?? K.startTime) - K.startTime,
        $;
    if (q[0] !== H) $ = Xz(H), q[0] = H, q[1] = $;
    else $ = q[1];
    let O = $,
        _ = K.progress?.tokenCount,
        J = K.progress?.lastActivity,
        X = J ? l1.arrowDown : l1.arrowUp,
        D;
    if (q[2] !== X || q[3] !== _) D = _ !== void 0 && _ > 0 ? ` · ${X} ${Y3(_)} tokens` : "", q[2] = X, q[3] = _, q[4] = D;
    else D = q[4];
    let j = D,
        M = K.progress?.summary,
        P = M || K.description,
        W, G;
    if (q[5] !== M || q[6] !== K.id) W = () => {
        h(`[CoordinatorAgentStatus] Summary updated for task ${K.id}: ${M??"(none)"}`)
    }, G = [M, K.id], q[5] = M, q[6] = K.id, q[7] = W, q[8] = G;
    else W = q[7], G = q[8];
    zD.useEffect(W, G);
    let f;
    if (q[9] !== J?.activityDescription || q[10] !== M || q[11] !== K.progress) f = M ? void 0 : (K.progress?.recentActivities && rB(K.progress.recentActivities)) ?? J?.activityDescription, q[9] = J?.activityDescription, q[10] = M, q[11] = K.progress, q[12] = f;
    else f = q[12];
    let Z = f,
        N = Z ? ` · ${Z}` : "",
        T = Y ? l1.pointer + " " : "  ",
        k = ` · ${O}${j}${N}`,
        y = z - UA(T) - UA(k),
        B = Math.max(0, y),
        S;
    if (q[13] !== P || q[14] !== B) S = TV(P, B, "truncate-end"), q[13] = P, q[14] = B, q[15] = S;
    else S = q[15];
    let m = S;
    if (!w) {
        let U = !Y,
            x;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) x = zD.createElement(V, {
            color: "warning"
        }, " · ", l1.cross, " Stopped"), q[16] = x;
        else x = q[16];
        let p;
        if (q[17] !== O || q[18] !== T || q[19] !== U || q[20] !== j || q[21] !== m) p = zD.createElement(V, {
            dimColor: U
        }, T, m, " · ", O, j, x), q[17] = O, q[18] = T, q[19] = U, q[20] = j, q[21] = m, q[22] = p;
        else p = q[22];
        return p
    }
    let b = !Y,
        g;
    if (q[23] !== N || q[24] !== O || q[25] !== T || q[26] !== b || q[27] !== j || q[28] !== m) g = zD.createElement(V, {
        dimColor: b
    }, T, m, " · ", O, j, N), q[23] = N, q[24] = O, q[25] = T, q[26] = b, q[27] = j, q[28] = m, q[29] = g;
    else g = q[29];
    return g
}
// @from(Ln 476238, Col 4)
zD
// @from(Ln 476239, Col 4)
BgA = v(() => {
    i1();
    m1();
    d8();
    cM();
    b7();
    vq();
    Qc1();
    Eh();
    LY();
    mq();
    Z6();
    zD = o(X1(), 1)
})