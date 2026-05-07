
// @from(Ln 529949, Col 0)
function $Y8(q, K, _, z, Y = !1) {
    let A = z.text.slice(K, _);
    if (Y && !A.endsWith(`
`)) A = A + `
`;
    if (z.setRegister(A, Y), q === "yank") z.setOffset(K);
    else if (q === "delete") {
        let O = z.text.slice(0, K) + z.text.slice(_);
        z.setText(O);
        let w = Math.max(0, O.length - (ci(O).length || 1));
        z.setOffset(Math.min(K, w))
    } else if (q === "change") {
        let O = z.text.slice(0, K) + z.text.slice(_);
        z.setText(O), z.enterInsert(K)
    }
}
// @from(Ln 529966, Col 0)
function b35(q, K, _) {
    let z = K === 1 ? _.cursor.startOfLastLine() : _.cursor.goToLine(K);
    if (z.equals(_.cursor)) return;
    let Y = lM7(_.cursor, z, "G", q, K);
    $Y8(q, Y.from, Y.to, _, Y.linewise), _.recordChange({
        type: "operator",
        op: q,
        motion: "G",
        count: K
    })
}
// @from(Ln 529978, Col 0)
function I35(q, K, _) {
    let z = K === 1 ? _.cursor.startOfFirstLine() : _.cursor.goToLine(K);
    if (z.equals(_.cursor)) return;
    let Y = lM7(_.cursor, z, "gg", q, K);
    $Y8(q, Y.from, Y.to, _, Y.linewise), _.recordChange({
        type: "operator",
        op: q,
        motion: "gg",
        count: K
    })
}
// @from(Ln 529989, Col 4)
nM7 = L(() => {
    a$6();
    IZ();
    S35()
})
// @from(Ln 529995, Col 0)
function x35(q) {
    return q in iM7
}
// @from(Ln 529999, Col 0)
function u35(q) {
    return q in aM7
}
// @from(Ln 530003, Col 0)
function B35() {
    return {
        mode: "INSERT",
        insertedText: ""
    }
}
// @from(Ln 530010, Col 0)
function p35() {
    return {
        lastChange: null,
        lastFind: null,
        register: "",
        registerIsLinewise: !1
    }
}
// @from(Ln 530018, Col 4)
iM7
// @from(Ln 530018, Col 9)
rM7
// @from(Ln 530018, Col 14)
oM7
// @from(Ln 530018, Col 19)
aM7
// @from(Ln 530018, Col 24)
m35
// @from(Ln 530018, Col 29)
sM7 = 1e4
// @from(Ln 530019, Col 4)
tM7 = L(() => {
    iM7 = {
        d: "delete",
        c: "change",
        y: "yank"
    };
    rM7 = new Set(["h", "l", "j", "k", "w", "b", "e", "W", "B", "E", "0", "^", "$"]), oM7 = new Set(["f", "F", "t", "T"]), aM7 = {
        i: "inner",
        a: "around"
    };
    m35 = new Set(["w", "W", '"', "'", "`", "(", ")", "b", "[", "]", "{", "}", "B", "<", ">"])
})
// @from(Ln 530032, Col 0)
function eM7(q, K, _) {
    switch (q.type) {
        case "idle":
            return D9A(K, _);
        case "count":
            return Z9A(q, K, _);
        case "operator":
            return f9A(q, K, _);
        case "operatorCount":
            return G9A(q, K, _);
        case "operatorFind":
            return v9A(q, K, _);
        case "operatorTextObj":
            return T9A(q, K, _);
        case "find":
            return V9A(q, K, _);
        case "g":
            return k9A(q, K, _);
        case "operatorG":
            return N9A(q, K, _);
        case "replace":
            return E9A(q, K, _);
        case "indent":
            return y9A(q, K, _)
    }
}
// @from(Ln 530059, Col 0)
function F35(q, K, _) {
    if (x35(q)) return {
        next: {
            type: "operator",
            op: iM7[q],
            count: K
        }
    };
    if (rM7.has(q)) return {
        execute: () => {
            let z = OY8(q, _.cursor, K);
            _.setOffset(z.offset)
        }
    };
    if (oM7.has(q)) return {
        next: {
            type: "find",
            find: q,
            count: K
        }
    };
    if (q === "g") return {
        next: {
            type: "g",
            count: K
        }
    };
    if (q === "r") return {
        next: {
            type: "replace",
            count: K
        }
    };
    if (q === ">" || q === "<") return {
        next: {
            type: "indent",
            dir: q,
            count: K
        }
    };
    if (q === "~") return {
        execute: () => Us8(K, _)
    };
    if (q === "x") return {
        execute: () => Fs8(K, _)
    };
    if (q === "J") return {
        execute: () => Qs8(K, _)
    };
    if (q === "p" || q === "P") return {
        execute: () => C35(q === "p", K, _)
    };
    if (q === "D") return {
        execute: () => rW6("delete", "$", 1, _)
    };
    if (q === "C") return {
        execute: () => rW6("change", "$", 1, _)
    };
    if (q === "Y") return {
        execute: () => cM7("yank", K, _)
    };
    if (q === "G") return {
        execute: () => {
            if (K === 1) _.setOffset(_.cursor.startOfLastLine().offset);
            else _.setOffset(_.cursor.goToLine(K).offset)
        }
    };
    if (q === ".") return {
        execute: () => _.onDotRepeat?.()
    };
    if (q === ";" || q === ",") return {
        execute: () => L9A(q === ",", K, _)
    };
    if (q === "u") return {
        execute: () => _.onUndo?.()
    };
    if (q === "i") return {
        execute: () => _.enterInsert(_.cursor.offset)
    };
    if (q === "I") return {
        execute: () => _.enterInsert(_.cursor.firstNonBlankInLogicalLine().offset)
    };
    if (q === "a") return {
        execute: () => {
            let z = _.cursor.isAtEnd() ? _.cursor.offset : _.cursor.right().offset;
            _.enterInsert(z)
        }
    };
    if (q === "A") return {
        execute: () => _.enterInsert(_.cursor.endOfLogicalLine().offset)
    };
    if (q === "o") return {
        execute: () => wY8("below", _)
    };
    if (q === "O") return {
        execute: () => wY8("above", _)
    };
    return null
}
// @from(Ln 530159, Col 0)
function g35(q, K, _, z) {
    if (u35(_)) return {
        next: {
            type: "operatorTextObj",
            op: q,
            count: K,
            scope: aM7[_]
        }
    };
    if (oM7.has(_)) return {
        next: {
            type: "operatorFind",
            op: q,
            count: K,
            find: _
        }
    };
    if (rM7.has(_)) return {
        execute: () => rW6(q, _, K, z)
    };
    if (_ === "G") return {
        execute: () => b35(q, K, z)
    };
    if (_ === "g") return {
        next: {
            type: "operatorG",
            op: q,
            count: K
        }
    };
    return null
}
// @from(Ln 530192, Col 0)
function D9A(q, K) {
    if (/[1-9]/.test(q)) return {
        next: {
            type: "count",
            digits: q
        }
    };
    if (q === "0") return {
        execute: () => K.setOffset(K.cursor.startOfLogicalLine().offset)
    };
    let _ = F35(q, 1, K);
    if (_) return _;
    return {}
}
// @from(Ln 530207, Col 0)
function Z9A(q, K, _) {
    if (/[0-9]/.test(K)) {
        let A = q.digits + K,
            O = Math.min(parseInt(A, 10), sM7);
        return {
            next: {
                type: "count",
                digits: String(O)
            }
        }
    }
    let z = parseInt(q.digits, 10),
        Y = F35(K, z, _);
    if (Y) return Y;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530228, Col 0)
function f9A(q, K, _) {
    if (K === q.op[0]) return {
        execute: () => cM7(q.op, q.count, _)
    };
    if (/[0-9]/.test(K)) return {
        next: {
            type: "operatorCount",
            op: q.op,
            count: q.count,
            digits: K
        }
    };
    let z = g35(q.op, q.count, K, _);
    if (z) return z;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530249, Col 0)
function G9A(q, K, _) {
    if (/[0-9]/.test(K)) {
        let O = q.digits + K,
            w = Math.min(parseInt(O, 10), sM7);
        return {
            next: {
                ...q,
                digits: String(w)
            }
        }
    }
    let z = parseInt(q.digits, 10),
        Y = q.count * z,
        A = g35(q.op, Y, K, _);
    if (A) return A;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530271, Col 0)
function v9A(q, K, _) {
    return {
        execute: () => Bs8(q.op, q.find, K, q.count, _)
    }
}
// @from(Ln 530277, Col 0)
function T9A(q, K, _) {
    if (m35.has(K)) return {
        execute: () => ps8(q.op, q.scope, K, q.count, _)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530288, Col 0)
function V9A(q, K, _) {
    return {
        execute: () => {
            let z = _.cursor.findCharacter(K, q.find, q.count);
            if (z !== null) _.setOffset(z), _.setLastFind(q.find, K)
        }
    }
}
// @from(Ln 530297, Col 0)
function k9A(q, K, _) {
    if (K === "j" || K === "k") return {
        execute: () => {
            let z = OY8(`g${K}`, _.cursor, q.count);
            _.setOffset(z.offset)
        }
    };
    if (K === "g") {
        if (q.count > 1) return {
            execute: () => {
                let z = _.text.split(`
`),
                    Y = Math.min(q.count - 1, z.length - 1),
                    A = 0;
                for (let O = 0; O < Y; O++) A += (z[O]?.length ?? 0) + 1;
                _.setOffset(A)
            }
        };
        return {
            execute: () => _.setOffset(_.cursor.startOfFirstLine().offset)
        }
    }
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530326, Col 0)
function N9A(q, K, _) {
    if (K === "j" || K === "k") return {
        execute: () => rW6(q.op, `g${K}`, q.count, _)
    };
    if (K === "g") return {
        execute: () => I35(q.op, q.count, _)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530340, Col 0)
function E9A(q, K, _) {
    if (K === "") return {
        next: {
            type: "idle"
        }
    };
    return {
        execute: () => gs8(K, q.count, _)
    }
}
// @from(Ln 530351, Col 0)
function y9A(q, K, _) {
    if (K === q.dir) return {
        execute: () => ds8(q.dir, q.count, _)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 530362, Col 0)
function L9A(q, K, _) {
    let z = _.getLastFind();
    if (!z) return;
    let Y = z.type;
    if (q) Y = {
        f: "F",
        F: "f",
        t: "T",
        T: "t"
    } [Y];
    let A = _.cursor.findCharacter(z.char, Y, K);
    if (A !== null) _.setOffset(A)
}
// @from(Ln 530375, Col 4)
U35 = L(() => {
    nM7();
    tM7()
})
// @from(Ln 530380, Col 0)
function Q35(q) {
    let K = R66.default.useRef(B35()),
        [_, z] = R66.useState("INSERT"),
        Y = R66.default.useRef(p35()),
        {
            onModeChange: A,
            inputFilter: O
        } = q,
        w = Fy8({
            ...q,
            inputFilter: (D, Z) => {
                let G = O ? O(D, Z) : D,
                    f = K.current;
                if (f.mode === "INSERT" && !Z.ctrl && !Z.meta && [...D].length === 1) K.current = {
                    mode: "INSERT",
                    insertedText: f.insertedText + G
                };
                return G
            }
        }),
        $ = R66.useCallback((D) => {
            if (D !== void 0) w.setOffset(D);
            K.current = {
                mode: "INSERT",
                insertedText: ""
            }, z("INSERT"), A?.("INSERT")
        }, [w, A]),
        j = R66.useCallback(() => {
            let D = K.current;
            if (D.mode === "INSERT" && D.insertedText) Y.current.lastChange = {
                type: "insert",
                text: D.insertedText
            };
            let Z = w.offset;
            if (Z > 0 && q.value[Z - 1] !== `
`) w.setOffset(Z - 1);
            K.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            }, z("NORMAL"), A?.("NORMAL")
        }, [A, w, q.value]);

    function H(D, Z = !1) {
        return {
            cursor: D,
            text: q.value,
            setText: (G) => q.onChange(G),
            setOffset: (G) => w.setOffset(G),
            enterInsert: (G) => $(G),
            getRegister: () => Y.current.register,
            setRegister: (G, f) => {
                Y.current.register = G, Y.current.registerIsLinewise = f
            },
            getLastFind: () => Y.current.lastFind,
            setLastFind: (G, f) => {
                Y.current.lastFind = {
                    type: G,
                    char: f
                }
            },
            recordChange: Z ? () => {} : (G) => {
                Y.current.lastChange = G
            }
        }
    }

    function J(D, Z, G) {
        switch (D.type) {
            case "insert":
                if (D.text) {
                    let f = Z.insert(D.text);
                    G.setText(f.text), G.setOffset(f.offset)
                }
                break;
            case "x":
                Fs8(D.count, G);
                break;
            case "replace":
                gs8(D.char, D.count, G);
                break;
            case "toggleCase":
                Us8(D.count, G);
                break;
            case "indent":
                ds8(D.dir, D.count, G);
                break;
            case "join":
                Qs8(D.count, G);
                break;
            case "openLine":
                wY8(D.direction, G);
                break;
            case "operator":
                rW6(D.op, D.motion, D.count, G);
                break;
            case "operatorFind":
                Bs8(D.op, D.find, D.char, D.count, G);
                break;
            case "operatorTextObj":
                ps8(D.op, D.scope, D.objType, D.count, G);
                break
        }
    }

    function X() {
        let D = Y.current.lastChange;
        if (!D) return;
        let Z = FK.fromText(q.value, q.columns, w.offset);
        J(D, Z, H(Z, !0))
    }

    function M(D) {
        let Z = q.value,
            G = w.offset,
            f = () => {
                let V = Y.current.lastChange;
                if (!V) return;
                let k = FK.fromText(Z, q.columns, G);
                J(V, k, {
                    ...H(k, !0),
                    text: Z,
                    setText: (N) => {
                        Z = N, q.onChange(N)
                    },
                    setOffset: (N) => {
                        G = N, w.setOffset(N)
                    },
                    enterInsert: (N) => {
                        G = N, $(N)
                    }
                })
            },
            v = [...D];
        for (let V = 0; V < v.length; V++) {
            if (K.current.mode === "INSERT") {
                let h = v.slice(V).join(""),
                    C = FK.fromText(Z, q.columns, G).insert(h);
                q.onChange(C.text), w.setOffset(C.offset), K.current = {
                    mode: "INSERT",
                    insertedText: K.current.insertedText + h
                };
                return
            }
            let k = FK.fromText(Z, q.columns, G),
                N = {
                    ...H(k, !1),
                    text: Z,
                    setText: (h) => {
                        Z = h, q.onChange(h)
                    },
                    setOffset: (h) => {
                        G = h, w.setOffset(h)
                    },
                    enterInsert: (h) => {
                        G = h, $(h)
                    },
                    onDotRepeat: f
                },
                R = eM7(K.current.command, v[V], N);
            if (R.execute) R.execute();
            if (K.current.mode === "NORMAL") {
                if (R.next) K.current = {
                    mode: "NORMAL",
                    command: R.next
                };
                else if (R.execute) K.current = {
                    mode: "NORMAL",
                    command: {
                        type: "idle"
                    }
                }
            }
        }
    }

    function P(D) {
        let Z = K.current,
            G = FK.fromText(q.value, q.columns, w.offset),
            f = () => O?.(D.key, D);
        if (D.ctrl || D.meta) {
            w.handleKeyDown(D);
            return
        }
        if (D.key === "escape" && Z.mode === "INSERT") {
            if (f(), j(), !q.disableEscapeDoublePress) D.preventDefault();
            return
        }
        if (D.key === "escape" && Z.mode === "NORMAL") {
            if (f(), K.current = {
                    mode: "NORMAL",
                    command: {
                        type: "idle"
                    }
                }, !q.disableEscapeDoublePress) D.preventDefault();
            return
        }
        if (D.key === "return") {
            w.handleKeyDown(D);
            return
        }
        if (Z.mode === "INSERT") {
            if (D.key === "backspace" || D.key === "delete") {
                if (Z.insertedText.length > 0) K.current = {
                    mode: "INSERT",
                    insertedText: Z.insertedText.slice(0, -(ci(Z.insertedText).length || 1))
                }
            }
            w.handleKeyDown(D);
            return
        }
        if (Z.mode !== "NORMAL") return;
        if (Z.command.type === "idle" && (D.key === "up" || D.key === "down") && !D.shift) {
            w.handleKeyDown(D);
            return
        }
        if (f(), Z.command.type === "idle") {
            if (D.key === "j" && G.down().equals(G)) {
                if (!q.multiline || G.downLogicalLine().equals(G)) {
                    q.onHistoryDown?.(), D.preventDefault();
                    return
                }
            }
            if (D.key === "k" && G.up().equals(G)) {
                if (!q.multiline || G.upLogicalLine().equals(G)) {
                    q.onHistoryUp?.(), D.preventDefault();
                    return
                }
            }
        }
        let v = {
                ...H(G, !1),
                onUndo: q.onUndo,
                onDotRepeat: X
            },
            V = Z.command.type === "idle" || Z.command.type === "count" || Z.command.type === "operator" || Z.command.type === "operatorCount",
            k = D.key;
        if (D.key === "left") k = "h";
        else if (D.key === "right") k = "l";
        else if (D.key === "up") k = "k";
        else if (D.key === "down") k = "j";
        else if (V && D.key === "backspace") k = "h";
        else if (V && Z.command.type !== "count" && D.key === "delete") k = "x";
        else if (D.key === "" || h9A.has(D.key)) return;
        else if ([...D.key].length > 1) {
            M(D.key), D.preventDefault();
            return
        }
        let N = eM7(Z.command, k, v);
        if (N.execute) N.execute();
        if (K.current.mode === "NORMAL") {
            if (N.next) K.current = {
                mode: "NORMAL",
                command: N.next
            };
            else if (N.execute) K.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            }
        }
        if (D.key === "?" && Z.mode === "NORMAL" && Z.command.type === "idle") q.onChange("?");
        D.preventDefault()
    }
    let W = R66.useCallback((D) => {
        if (D === "INSERT") K.current = {
            mode: "INSERT",
            insertedText: ""
        };
        else K.current = {
            mode: "NORMAL",
            command: {
                type: "idle"
            }
        };
        z(D), A?.(D)
    }, [A]);
    return {
        ...w,
        handleKeyDown: P,
        mode: _,
        setMode: W
    }
}
// @from(Ln 530666, Col 4)
R66
// @from(Ln 530666, Col 9)
h9A
// @from(Ln 530667, Col 4)
d35 = L(() => {
    a$6();
    IZ();
    nM7();
    U35();
    tM7();
    PB1();
    R66 = K6(P6(), 1), h9A = new Set(["backspace", "delete", "tab", "home", "end", "pageup", "pagedown", "insert", "clear", "enter", "center", "undefined", "mouse", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"])
})
// @from(Ln 530677, Col 0)
function qP7(q) {
    let K = s(39),
        [_] = Zq(),
        z = K2();
    Ny8(z, !!q.onImagePaste);
    let {
        value: Y,
        onChange: A,
        onSubmit: O,
        onExit: w,
        onExitMessage: $,
        onLeftArrowOnEmpty: j,
        onHistoryReset: H,
        onHistoryUp: J,
        onHistoryDown: X,
        onClearInput: M,
        focus: P,
        mask: W,
        multiline: D
    } = q, Z = q.showCursor ? " " : "", G = q.highlightPastedText, f = z ? Y8.inverse : R9A, v;
    if (K[0] !== _) v = d7("text", _), K[0] = _, K[1] = v;
    else v = K[1];
    let V;
    if (K[2] !== q.columns || K[3] !== q.cursorOffset || K[4] !== q.disableCursorMovementForUpDownKeys || K[5] !== q.disableEscapeDoublePress || K[6] !== q.focus || K[7] !== q.highlightPastedText || K[8] !== q.inputFilter || K[9] !== q.mask || K[10] !== q.maxVisibleLines || K[11] !== q.multiline || K[12] !== q.onChange || K[13] !== q.onChangeCursorOffset || K[14] !== q.onClearInput || K[15] !== q.onExit || K[16] !== q.onExitMessage || K[17] !== q.onHistoryDown || K[18] !== q.onHistoryReset || K[19] !== q.onHistoryUp || K[20] !== q.onImagePaste || K[21] !== q.onLeftArrowOnEmpty || K[22] !== q.onModeChange || K[23] !== q.onSubmit || K[24] !== q.onUndo || K[25] !== q.value || K[26] !== Z || K[27] !== f || K[28] !== v) V = {
        value: Y,
        onChange: A,
        onSubmit: O,
        onExit: w,
        onExitMessage: $,
        onLeftArrowOnEmpty: j,
        onHistoryReset: H,
        onHistoryUp: J,
        onHistoryDown: X,
        onClearInput: M,
        focus: P,
        mask: W,
        multiline: D,
        cursorChar: Z,
        highlightPastedText: G,
        invert: f,
        themeText: v,
        columns: q.columns,
        maxVisibleLines: q.maxVisibleLines,
        onImagePaste: q.onImagePaste,
        disableCursorMovementForUpDownKeys: q.disableCursorMovementForUpDownKeys,
        disableEscapeDoublePress: q.disableEscapeDoublePress,
        externalOffset: q.cursorOffset,
        onOffsetChange: q.onChangeCursorOffset,
        inputFilter: q.inputFilter,
        onModeChange: q.onModeChange,
        onUndo: q.onUndo
    }, K[2] = q.columns, K[3] = q.cursorOffset, K[4] = q.disableCursorMovementForUpDownKeys, K[5] = q.disableEscapeDoublePress, K[6] = q.focus, K[7] = q.highlightPastedText, K[8] = q.inputFilter, K[9] = q.mask, K[10] = q.maxVisibleLines, K[11] = q.multiline, K[12] = q.onChange, K[13] = q.onChangeCursorOffset, K[14] = q.onClearInput, K[15] = q.onExit, K[16] = q.onExitMessage, K[17] = q.onHistoryDown, K[18] = q.onHistoryReset, K[19] = q.onHistoryUp, K[20] = q.onImagePaste, K[21] = q.onLeftArrowOnEmpty, K[22] = q.onModeChange, K[23] = q.onSubmit, K[24] = q.onUndo, K[25] = q.value, K[26] = Z, K[27] = f, K[28] = v, K[29] = V;
    else V = K[29];
    let k = Q35(V),
        {
            mode: N,
            setMode: R
        } = k,
        h, C;
    if (K[30] !== N || K[31] !== q.initialMode || K[32] !== R) h = () => {
        if (q.initialMode && q.initialMode !== N) R(q.initialMode)
    }, C = [q.initialMode, N, R], K[30] = N, K[31] = q.initialMode, K[32] = R, K[33] = h, K[34] = C;
    else h = K[33], C = K[34];
    ls8.default.useEffect(h, C);
    let x;
    if (K[35] !== z || K[36] !== q || K[37] !== k) x = ls8.default.createElement(u, {
        flexDirection: "column"
    }, ls8.default.createElement(gy8, {
        inputState: k,
        terminalFocus: z,
        highlights: q.highlights,
        ...q
    })), K[35] = z, K[36] = q, K[37] = k, K[38] = x;
    else x = K[38];
    return x
}
// @from(Ln 530754, Col 0)
function R9A(q) {
    return q
}
// @from(Ln 530757, Col 4)
ls8
// @from(Ln 530758, Col 4)
c35 = L(() => {
    o6();
    Y3();
    dm1();
    d35();
    g6();
    ZB1();
    ls8 = K6(P6(), 1)
})
// @from(Ln 530768, Col 0)
function l35(q, K, _, z = d) {
    if (!q.current) return;
    q.current = !1, z(K, _())
}
// @from(Ln 530772, Col 0)
async function S9A(q) {
    let {
        signal: K,
        executeCommand: _,
        getCommandLength: z,
        pendingResultLogRef: Y,
        onResult: A,
        logFn: O = d
    } = q, w = z();
    try {
        let $ = await _();
        if (K.aborted) return;
        if (A($), $) l35(Y, "tengu_status_line_result", () => {
            let j = $.split(`
`),
                H = 0;
            for (let J of j) {
                let X = N1(J);
                if (X > H) H = X
            }
            return {
                char_length: $.length,
                visual_width: H,
                line_count: j.length,
                command_length: w
            }
        }, O)
    } catch {}
}
// @from(Ln 530802, Col 0)
function KP7(q) {
    return q?.statusLine !== void 0
}
// @from(Ln 530806, Col 0)
function C9A(q, K, _, z, Y, A, O, w, $) {
    let j = lg(),
        H = sO(),
        J = HB({
            permissionMode: q,
            mainLoopModel: A,
            exceeds200kTokens: K
        }),
        X = _?.outputStyle || lk,
        M = ce6(z),
        P = ff(J, eM()),
        W = MV8(M, P),
        D = I8(),
        Z = NH(D),
        G = pF1(),
        f = {
            ...G.five_hour && {
                five_hour: {
                    used_percentage: G.five_hour.utilization * 100,
                    resets_at: G.five_hour.resets_at
                }
            },
            ...G.seven_day && {
                seven_day: {
                    used_percentage: G.seven_day.utilization * 100,
                    resets_at: G.seven_day.resets_at
                }
            }
        };
    return {
        ...J9(),
        cwd: $,
        ...Z && {
            session_name: Z
        },
        model: {
            id: J,
            display_name: YJ(J)
        },
        workspace: {
            current_dir: $,
            project_dir: Y7(),
            added_dirs: Y,
            ...O && {
                git_worktree: O
            }
        },
        version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION,
        output_style: {
            name: X
        },
        cost: {
            total_cost_usd: nX(),
            total_duration_ms: fD6(),
            total_api_duration_ms: VW(),
            total_lines_added: HY6(),
            total_lines_removed: JY6()
        },
        context_window: {
            total_input_tokens: XY6(),
            total_output_tokens: eu(),
            context_window_size: P,
            current_usage: M,
            used_percentage: W.used,
            remaining_percentage: W.remaining
        },
        exceeds_200k_tokens: K,
        ...(f.five_hour || f.seven_day) && {
            rate_limits: f
        },
        ...ce() && {
            vim: {
                mode: w ?? "INSERT"
            }
        },
        ...j && {
            agent: {
                name: j
            }
        },
        ...nK() && {
            remote: {
                session_id: I8()
            }
        },
        ...H && {
            worktree: {
                name: H.worktreeName,
                path: H.worktreePath,
                branch: H.worktreeBranch,
                original_cwd: H.originalCwd,
                original_branch: H.originalBranch
            }
        }
    }
}
// @from(Ln 530910, Col 0)
function _P7(q) {
    return fM(q)?.uuid ?? null
}
// @from(Ln 530914, Col 0)
function b9A({
    messagesRef: q,
    lastAssistantMessageId: K,
    vimMode: _
}) {
    let z = o$.useRef(void 0),
        Y = M8((m) => m.toolPermissionContext.mode),
        A = M8((m) => m.toolPermissionContext.additionalWorkingDirectories),
        O = M8((m) => m.statusLineText),
        w = R7(),
        $ = iO(),
        {
            addNotification: j
        } = EK(),
        H = s2(),
        J = o$.useRef($);
    J.current = $;
    let X = o$.useRef(_);
    X.current = _;
    let M = o$.useRef(Y);
    M.current = Y;
    let P = o$.useRef(A);
    P.current = A;
    let W = o$.useRef(H);
    W.current = H;
    let D = o$.useRef({
            messageId: null,
            exceeds200kTokens: !1,
            permissionMode: Y,
            vimMode: _,
            mainLoopModel: H
        }),
        Z = o$.useRef(void 0),
        G = o$.useRef(!0),
        f = o$.useRef(!0),
        v = o$.useRef(!0),
        V = o$.useCallback(async () => {
            z.current?.abort();
            let m = new AbortController;
            z.current = m;
            let S = q.current,
                F = G.current;
            G.current = !1;
            let U = D.current.exceeds200kTokens,
                g = _P7(S);
            if (g !== D.current.messageId) U = le6(S), D.current.messageId = g, D.current.exceeds200kTokens = U;
            let c = b8(),
                n = await gA1(c);
            await S9A({
                signal: m.signal,
                executeCommand: () => AJ7(C9A(M.current, U, J.current, S, Array.from(P.current.keys()), W.current, n, X.current, c), m.signal, void 0, F),
                getCommandLength: () => J.current?.statusLine?.command.length,
                pendingResultLogRef: v,
                onResult: (l) => {
                    w((z6) => {
                        if (z6.statusLineText === l) return z6;
                        return {
                            ...z6,
                            statusLineText: l
                        }
                    })
                }
            })
        }, [q, w]),
        k = o$.useCallback(() => {
            if (Z.current !== void 0) clearTimeout(Z.current);
            Z.current = setTimeout((m, S) => {
                m.current = void 0, S()
            }, 300, Z, V)
        }, [V]);
    o$.useEffect(() => {
        if (K !== D.current.messageId || Y !== D.current.permissionMode || _ !== D.current.vimMode || H !== D.current.mainLoopModel) D.current.permissionMode = Y, D.current.vimMode = _, D.current.mainLoopModel = H, k()
    }, [K, Y, _, H, k]);
    let N = $?.statusLine?.refreshInterval;
    o$.useEffect(() => {
        if (N === void 0) return;
        let m = Math.max(1, N) * 1000,
            S = setInterval(k, m);
        return () => clearInterval(S)
    }, [N, k]);
    let R = $?.statusLine?.command,
        h = o$.useRef(!0);
    o$.useEffect(() => {
        if (h.current) {
            h.current = !1;
            return
        }
        G.current = !0, f.current = !0, v.current = !0, V()
    }, [R, V]);
    let C = $?.statusLine;
    o$.useEffect(() => {
        if (!C) return;
        l35(f, "tengu_status_line_mount", () => ({
            command_length: C.command.length,
            padding: C.padding
        }))
    }, [C]);
    let x = o$.useRef(!1);
    o$.useEffect(() => {
        if (x.current) return;
        if (!C) return;
        if (x.current = !0, $?.disableAllHooks === !0) E("Status line is configured but disableAllHooks is true", {
            level: "warn"
        });
        if (!EA()) j({
            key: "statusline-trust-blocked",
            text: "statusline skipped · restart to fix",
            color: "warning",
            priority: "low"
        }), E("Status line command skipped: workspace trust not accepted", {
            level: "warn"
        })
    }, [C, $?.disableAllHooks, j]), o$.useEffect(() => {
        return V(), () => {
            if (z.current?.abort(), Z.current !== void 0) clearTimeout(Z.current)
        }
    }, []);
    let B = $?.statusLine?.padding ?? 0;
    return S66.createElement(u, {
        paddingX: B,
        gap: 2
    }, O ? S66.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, S66.createElement(v5, null, O)) : lq() ? S66.createElement(T, null, " ") : null)
}
// @from(Ln 531040, Col 4)
S66
// @from(Ln 531040, Col 9)
o$
// @from(Ln 531040, Col 13)
n35
// @from(Ln 531041, Col 4)
i35 = L(() => {
    C8();
    N7();
    y8();
    ec();
    kY();
    Tx();
    oy();
    tE();
    n5();
    g6();
    dI();
    h1();
    AJ();
    n7();
    K8();
    nO();
    pK();
    K9();
    _7();
    Sq();
    g4();
    kD();
    tD();
    K_8();
    S66 = K6(P6(), 1), o$ = K6(P6(), 1);
    n35 = o$.memo(b9A)
})
// @from(Ln 531070, Col 0)
function r35(q, K, _, z, Y = !0) {
    let A = q.length;
    if (A === 0) return {
        startIndex: 0,
        endIndex: 0,
        showLeftArrow: !1,
        showRightArrow: !1
    };
    let O = Math.max(0, Math.min(z, A - 1));
    if (q.reduce((M, P) => M + P, 0) <= K) return {
        startIndex: 0,
        endIndex: A,
        showLeftArrow: !1,
        showRightArrow: !1
    };
    let $ = [0];
    for (let M = 0; M < A; M++) $.push($[M] + q[M]);

    function j(M, P) {
        let W = $[P] - $[M];
        if (Y && M > 0) return W - 1;
        return W
    }

    function H(M, P) {
        let W = K;
        if (M > 0) W -= _;
        if (P < A) W -= _;
        return W
    }
    let J = 0,
        X = 1;
    while (X < A && j(J, X + 1) <= H(J, X + 1)) X++;
    if (O >= J && O < X) return {
        startIndex: J,
        endIndex: X,
        showLeftArrow: J > 0,
        showRightArrow: X < A
    };
    if (O >= X) {
        X = O + 1, J = O;
        while (J > 0 && j(J - 1, X) <= H(J - 1, X)) J--
    } else {
        J = O, X = O + 1;
        while (X < A && j(J, X + 1) <= H(J, X + 1)) X++
    }
    return {
        startIndex: J,
        endIndex: X,
        showLeftArrow: J > 0,
        showRightArrow: X < A
    }
}
// @from(Ln 531124, Col 0)
function YP7(q) {
    let K = s(48),
        {
            tasksSelected: _,
            isViewingTeammate: z,
            teammateFooterIndex: Y,
            isLeaderIdle: A,
            onOpenDialog: O
        } = q,
        w = Y === void 0 ? 0 : Y,
        $ = A === void 0 ? !1 : A,
        j = R7(),
        {
            columns: H
        } = s1(),
        J = M8(d9A),
        X = M8(Q9A),
        M;
    if (K[0] !== J) M = Object.values(J ?? {}).filter(U9A), K[0] = J, K[1] = M;
    else M = K[1];
    let P = M,
        D = M8(g9A) === "teammates",
        Z = !D && P.length > 0 && P.every(F9A),
        G;
    if (K[2] !== P) G = P.filter(p9A).sort(B9A), K[2] = P, K[3] = G;
    else G = K[3];
    let f = G,
        v;
    if (K[4] !== $) v = {
        name: "main",
        color: void 0,
        isIdle: $,
        taskId: void 0
    }, K[4] = $, K[5] = v;
    else v = K[5];
    let V = v,
        k;
    if (K[6] !== V || K[7] !== _ || K[8] !== f) {
        let S = f.map(m9A);
        if (!_) S.sort(u9A);
        k = [V, ...S].map(x9A), K[6] = V, K[7] = _, K[8] = f, K[9] = k
    } else k = K[9];
    let N = k,
        R;
    if (K[10] !== N) R = N.map(I9A), K[10] = N, K[11] = R;
    else R = K[11];
    let h = R;
    if (Z || !D && z) {
        let S = _ ? w : -1,
            F;
        if (K[12] !== f || K[13] !== X) F = X ? f.findIndex((_6) => _6.id === X) + 1 : 0, K[12] = f, K[13] = X, K[14] = F;
        else F = K[14];
        let U = F,
            g = Math.max(20, H - 20 - 4),
            c = S >= 0 ? S : 0,
            n;
        if (K[15] !== g || K[16] !== h || K[17] !== c) n = r35(h, g, 2, c), K[15] = g, K[16] = h, K[17] = c, K[18] = n;
        else n = K[18];
        let {
            startIndex: l,
            endIndex: z6,
            showLeftArrow: A6,
            showRightArrow: e
        } = n, i;
        if (K[19] !== N || K[20] !== z6 || K[21] !== l) i = N.slice(l, z6), K[19] = N, K[20] = z6, K[21] = l, K[22] = i;
        else i = K[22];
        let O6 = i,
            J6;
        if (K[23] !== A6) J6 = A6 && L9.createElement(T, {
            dimColor: !0
        }, e6.arrowLeft, " "), K[23] = A6, K[24] = J6;
        else J6 = K[24];
        let $6;
        if (K[25] !== S || K[26] !== j || K[27] !== U || K[28] !== O6) $6 = O6.map((_6, r) => {
            let t = r > 0;
            return L9.createElement(L9.Fragment, {
                key: _6.name
            }, t && L9.createElement(T, null, " "), L9.createElement(c9A, {
                name: _6.name,
                color: _6.color,
                isSelected: S === _6.idx,
                isViewed: U === _6.idx,
                isIdle: _6.isIdle,
                onClick: () => _6.taskId ? VG(_6.taskId, j) : kG(j)
            }))
        }), K[25] = S, K[26] = j, K[27] = U, K[28] = O6, K[29] = $6;
        else $6 = K[29];
        let H6;
        if (K[30] !== e) H6 = e && L9.createElement(T, {
            dimColor: !0
        }, " ", e6.arrowRight), K[30] = e, K[31] = H6;
        else H6 = K[31];
        let q6;
        if (K[32] === Symbol.for("react.memo_cache_sentinel")) q6 = L9.createElement(T, {
            dimColor: !0
        }, " · ", L9.createElement(A8, {
            chord: "shift+down",
            action: "expand"
        })), K[32] = q6;
        else q6 = K[32];
        let o;
        if (K[33] !== J6 || K[34] !== $6 || K[35] !== H6) o = L9.createElement(L9.Fragment, null, J6, $6, H6, q6), K[33] = J6, K[34] = $6, K[35] = H6, K[36] = o;
        else o = K[36];
        return o
    }
    if (ju6(J ?? {}, D)) return null;
    if (P.length === 0) return null;
    let C;
    if (K[37] !== P) C = xK8(P), K[37] = P, K[38] = C;
    else C = K[38];
    let x;
    if (K[39] !== O || K[40] !== C || K[41] !== _) x = L9.createElement(l9A, {
        selected: _,
        onClick: O
    }, C), K[39] = O, K[40] = C, K[41] = _, K[42] = x;
    else x = K[42];
    let B;
    if (K[43] !== P) B = tjK(P) && L9.createElement(T, {
        dimColor: !0
    }, " · ", e6.arrowDown, " to view"), K[43] = P, K[44] = B;
    else B = K[44];
    let m;
    if (K[45] !== B || K[46] !== x) m = L9.createElement(L9.Fragment, null, x, B), K[45] = B, K[46] = x, K[47] = m;
    else m = K[47];
    return m
}
// @from(Ln 531251, Col 0)
function I9A(q, K) {
    let _ = `@${q.name}`;
    return N1(_) + (K > 0 ? 1 : 0)
}
// @from(Ln 531256, Col 0)
function x9A(q, K) {
    return {
        ...q,
        idx: K
    }
}
// @from(Ln 531263, Col 0)
function u9A(q, K) {
    if (q.isIdle !== K.isIdle) return q.isIdle ? 1 : -1;
    return 0
}
// @from(Ln 531268, Col 0)
function m9A(q) {
    return {
        name: q.identity.agentName,
        color: n9A(q.identity.color),
        isIdle: q.isIdle,
        taskId: q.id
    }
}
// @from(Ln 531277, Col 0)
function B9A(q, K) {
    return q.identity.agentName.localeCompare(K.identity.agentName)
}
// @from(Ln 531281, Col 0)
function p9A(q) {
    return q.type === "in_process_teammate"
}
// @from(Ln 531285, Col 0)
function F9A(q) {
    return q.type === "in_process_teammate"
}
// @from(Ln 531289, Col 0)
function g9A(q) {
    return q.expandedView
}
// @from(Ln 531293, Col 0)
function U9A(q) {
    return yH(q) && !0
}
// @from(Ln 531297, Col 0)
function Q9A(q) {
    return q.viewingAgentTaskId
}
// @from(Ln 531301, Col 0)
function d9A(q) {
    return q.tasks
}
// @from(Ln 531305, Col 0)
function c9A(q) {
    let K = s(19),
        {
            name: _,
            color: z,
            isSelected: Y,
            isViewed: A,
            isIdle: O,
            onClick: w
        } = q,
        [$, j] = zP7.useState(!1),
        H = Y || $,
        J;
    if (H) {
        let W;
        if (K[0] !== z || K[1] !== A || K[2] !== _) W = z ? L9.createElement(T, {
            backgroundColor: z,
            color: "inverseText",
            bold: A
        }, "@", _) : L9.createElement(T, {
            color: "background",
            inverse: !0,
            bold: A
        }, "@", _), K[0] = z, K[1] = A, K[2] = _, K[3] = W;
        else W = K[3];
        J = W
    } else if (O) {
        let W;
        if (K[4] !== A || K[5] !== _) W = L9.createElement(T, {
            dimColor: !0,
            bold: A
        }, "@", _), K[4] = A, K[5] = _, K[6] = W;
        else W = K[6];
        J = W
    } else if (A) {
        let W;
        if (K[7] !== z || K[8] !== _) W = L9.createElement(T, {
            color: z,
            bold: !0
        }, "@", _), K[7] = z, K[8] = _, K[9] = W;
        else W = K[9];
        J = W
    } else {
        let W = !z,
            D;
        if (K[10] !== z || K[11] !== _ || K[12] !== W) D = L9.createElement(T, {
            color: z,
            dimColor: W
        }, "@", _), K[10] = z, K[11] = _, K[12] = W, K[13] = D;
        else D = K[13];
        J = D
    }
    if (!w) return J;
    let X, M;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) X = () => j(!0), M = () => j(!1), K[14] = X, K[15] = M;
    else X = K[14], M = K[15];
    let P;
    if (K[16] !== J || K[17] !== w) P = L9.createElement(u, {
        onClick: w,
        onMouseEnter: X,
        onMouseLeave: M
    }, J), K[16] = J, K[17] = w, K[18] = P;
    else P = K[18];
    return P
}
// @from(Ln 531371, Col 0)
function l9A(q) {
    let K = s(8),
        {
            selected: _,
            onClick: z,
            children: Y
        } = q,
        [A, O] = zP7.useState(!1),
        w = _ || A,
        $;
    if (K[0] !== Y || K[1] !== w) $ = L9.createElement(T, {
        color: "background",
        inverse: w
    }, Y), K[0] = Y, K[1] = w, K[2] = $;
    else $ = K[2];
    let j = $;
    if (!z) return j;
    let H, J;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) H = () => O(!0), J = () => O(!1), K[3] = H, K[4] = J;
    else H = K[3], J = K[4];
    let X;
    if (K[5] !== j || K[6] !== z) X = L9.createElement(u, {
        onClick: z,
        onMouseEnter: H,
        onMouseLeave: J
    }, j), K[5] = j, K[6] = z, K[7] = X;
    else X = K[7];
    return X
}
// @from(Ln 531401, Col 0)
function n9A(q) {
    if (!q) return;
    if (VJ.includes(q)) return QP[q];
    return
}
// @from(Ln 531406, Col 4)
L9
// @from(Ln 531406, Col 8)
zP7
// @from(Ln 531407, Col 4)
o35 = L(() => {
    o6();
    Qq();
    I4();
    n5();
    N7();
    Ru();
    vM();
    KU8();
    g6();
    Uf();
    u7();
    Y66();
    L9 = K6(P6(), 1), zP7 = K6(P6(), 1)
})
// @from(Ln 531423, Col 0)
function a35(q) {
    let K = s(14),
        {
            teamsSelected: _,
            showHint: z
        } = q,
        Y = M8(r9A),
        A;
    if (K[0] !== Y) A = Y ? w7(Object.values(Y.teammates), i9A) : 0, K[0] = Y, K[1] = A;
    else A = K[1];
    let O = A;
    if (O === 0) return null;
    let w;
    if (K[2] !== z || K[3] !== _) w = z && _ ? JW.createElement(JW.Fragment, null, JW.createElement(T, {
        dimColor: !0
    }, "· "), JW.createElement(T, {
        dimColor: !0
    }, JW.createElement(A8, {
        chord: "enter",
        action: "view"
    }))) : null, K[2] = z, K[3] = _, K[4] = w;
    else w = K[4];
    let $ = w,
        j = `${O} ${O===1?"teammate":"teammates"}`,
        H = _ ? "selected" : "normal",
        J;
    if (K[5] !== j || K[6] !== H || K[7] !== _) J = JW.createElement(T, {
        key: H,
        color: "background",
        inverse: _
    }, j), K[5] = j, K[6] = H, K[7] = _, K[8] = J;
    else J = K[8];
    let X;
    if (K[9] !== $) X = $ ? JW.createElement(T, null, " ", $) : null, K[9] = $, K[10] = X;
    else X = K[10];
    let M;
    if (K[11] !== J || K[12] !== X) M = JW.createElement(JW.Fragment, null, J, X), K[11] = J, K[12] = X, K[13] = M;
    else M = K[13];
    return M
}
// @from(Ln 531464, Col 0)
function i9A(q) {
    return q.name !== "team-lead"
}
// @from(Ln 531468, Col 0)
function r9A(q) {
    return q.teamContext
}
// @from(Ln 531471, Col 4)
JW
// @from(Ln 531472, Col 4)
s35 = L(() => {
    o6();
    g6();
    N7();
    u7();
    JW = K6(P6(), 1)
})
// @from(Ln 531480, Col 0)
function s9A(q, K) {
    let _ = Object.keys(q),
        z = Object.keys(K);
    if (_.length !== z.length) return !1;
    for (let Y of _)
        if (q[Y]?.content !== K[Y]?.content) return !1;
    return !0
}
// @from(Ln 531489, Col 0)
function t35() {
    let q = H9(),
        K = R7(),
        _ = M8((w) => w.settings?.subagentStatusLine?.command !== void 0),
        z = M8((w) => _ ? YY8(w.tasks).length : 0),
        {
            columns: Y
        } = s1(),
        A = jY8.useRef(!1),
        O = jY8.useRef(new Map);
    jY8.useEffect(() => {
        if (!_) {
            K((J) => Object.keys(J.taskDecorations).length === 0 ? J : {
                ...J,
                taskDecorations: {}
            });
            return
        }
        let w = !1,
            $ = () => {
                if (A.current) return;
                let J = q.getState(),
                    X = YY8(J.tasks);
                if (O35(O.current, X.map((P) => ({
                        id: P.id,
                        tokenCount: P.progress?.tokenCount ?? 0
                    }))), X.length === 0) {
                    K((P) => Object.keys(P.taskDecorations).length === 0 ? P : {
                        ...P,
                        taskDecorations: {}
                    });
                    return
                }
                A.current = !0;
                let M = new Map;
                for (let [P, W] of J.agentNameRegistry) M.set(W, P);
                w35(X, Math.max(0, Y - BM7), M, O.current).then((P) => {
                    if (w) return;
                    K((W) => {
                        let D = new Set(X.map((G) => G.id)),
                            Z = {};
                        for (let [G, f] of Object.entries(P))
                            if (D.has(G)) Z[G] = f;
                        return s9A(W.taskDecorations, Z) ? W : {
                            ...W,
                            taskDecorations: Z
                        }
                    })
                }).catch((P) => {
                    E(`subagentStatusLine tick failed: ${P}`, {
                        level: "error"
                    })
                }).finally(() => {
                    if (A.current = !1, YY8(q.getState().tasks).length === 0) $()
                })
            };
        if (z === 0) {
            $();
            return
        }
        let j = setTimeout($, o9A),
            H = setInterval($, a9A);
        return () => {
            w = !0, clearTimeout(j), clearInterval(H)
        }
    }, [_, z, Y, q, K])
}
// @from(Ln 531556, Col 4)
jY8
// @from(Ln 531556, Col 9)
o9A = 300
// @from(Ln 531557, Col 4)
a9A = 5000
// @from(Ln 531558, Col 4)
e35 = L(() => {
    AY8();
    I4();
    N7();
    K8();
    pM7();
    jY8 = K6(P6(), 1)
})
// @from(Ln 531567, Col 0)
function t9A(q) {
    let K = s(9),
        {
            value: _,
            onChange: z,
            historyFailedMatch: Y
        } = q,
        A = Y ? "no matching prompt:" : "search prompts:",
        O;
    if (K[0] !== A) O = oW6.createElement(T, {
        dimColor: !0
    }, A), K[0] = A, K[1] = O;
    else O = K[1];
    let w = N1(_) + 1,
        $;
    if (K[2] !== z || K[3] !== w || K[4] !== _) $ = oW6.createElement(l4, {
        value: _,
        onChange: z,
        cursorOffset: _.length,
        onChangeCursorOffset: e9A,
        columns: w,
        focus: !0,
        showCursor: !0,
        multiline: !1,
        dimColor: !0
    }), K[2] = z, K[3] = w, K[4] = _, K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] !== O || K[7] !== $) j = oW6.createElement(u, {
        gap: 1
    }, O, $), K[6] = O, K[7] = $, K[8] = j;
    else j = K[8];
    return j
}
// @from(Ln 531602, Col 0)
function e9A() {}
// @from(Ln 531603, Col 4)
oW6
// @from(Ln 531603, Col 9)
q95
// @from(Ln 531604, Col 4)
K95 = L(() => {
    o6();
    n5();
    g6();
    NY();
    oW6 = K6(P6(), 1);
    q95 = t9A
})
// @from(Ln 531613, Col 0)
function q_A(q, K) {
    if (q) return "draft";
    switch (K) {
        case "APPROVED":
            return "approved";
        case "CHANGES_REQUESTED":
            return "changes_requested";
        default:
            return "pending"
    }
}
// @from(Ln 531624, Col 0)
async function z95() {
    if (!await qX()) return null;
    let [K, _] = await Promise.all([rj(), UZ()]);
    if (K === _) return null;
    let {
        stdout: z,
        code: Y
    } = await w1("gh", ["pr", "view", "--json", "number,url,reviewDecision,isDraft,headRefName,state"], {
        timeout: _95,
        preserveOutputOnError: !1
    });
    if (Y !== 0 || !z.trim()) return null;
    try {
        let A = n8(z);
        if (A.headRefName === _ || A.headRefName === "main" || A.headRefName === "master") return null;
        if (A.state === "MERGED" || A.state === "CLOSED") return null;
        return {
            number: A.number,
            url: A.url,
            reviewState: q_A(A.isDraft, A.reviewDecision)
        }
    } catch {
        return null
    }
}
// @from(Ln 531650, Col 0)
function K_A(q) {
    let K = 0,
        _ = 0,
        z = 0;
    for (let Y of q ?? []) {
        let A = (Y.conclusion ?? Y.state)?.toUpperCase();
        if (A === "SUCCESS" || A === "NEUTRAL" || A === "SKIPPED") K++;
        else if (A === "FAILURE" || A === "ERROR") _++;
        else if (A == null || A === "ACTION_REQUIRED" || A === "PENDING" || A === "EXPECTED" || Y.status?.toUpperCase() !== "COMPLETED") z++;
        else _++
    }
    return {
        passed: K,
        failed: _,
        pending: z
    }
}
// @from(Ln 531667, Col 4)
_95 = 5000
// @from(Ln 531668, Col 4)
lwH
// @from(Ln 531669, Col 4)
Y95 = L(() => {
    Q4();
    pK();
    Lm();
    e8();
    lwH = yA6(async (q) => {
        let {
            stdout: K,
            code: _
        } = await w1("gh", ["pr", "view", q, "--json", "number,title,state,isDraft,statusCheckRollup,reviewDecision,mergeStateStatus,additions,deletions"], {
            timeout: _95,
            preserveOutputOnError: !1
        });
        if (_ !== 0 || !K.trim()) throw Error(`gh pr view failed (exit ${_})`);
        try {
            let z = n8(K);
            return {
                number: z.number,
                title: z.title,
                state: z.state === "MERGED" ? "MERGED" : z.state === "CLOSED" ? "CLOSED" : z.isDraft ? "DRAFT" : "OPEN",
                checks: K_A(z.statusCheckRollup),
                review: z.reviewDecision === "APPROVED" || z.reviewDecision === "CHANGES_REQUESTED" || z.reviewDecision === "REVIEW_REQUIRED" ? z.reviewDecision : null,
                mergeable: z.mergeStateStatus === "CLEAN" || z.mergeStateStatus === "HAS_HOOKS" || z.mergeStateStatus === "UNSTABLE",
                mergeStateStatus: z.mergeStateStatus,
                additions: z.additions,
                deletions: z.deletions
            }
        } catch {
            return null
        }
    }, 30000)
})
// @from(Ln 531702, Col 0)
function A95(q, K = !0) {
    let [_, z] = Nz6.useState(Y_A), Y = Nz6.useRef(null), A = Nz6.useRef(!1), O = Nz6.useRef(0);
    return Nz6.useEffect(() => {
        if (!K) return;
        if (A.current) return;
        let w = !1,
            $ = -1,
            j = Date.now();
        async function H() {
            if (w) return;
            let X = AV();
            if ($ !== X) $ = X, j = Date.now();
            else if (Date.now() - j >= z_A) return;
            let M = Date.now(),
                P = await z95();
            if (w) return;
            if (O.current = M, z((W) => {
                    let D = P?.number ?? null,
                        Z = P?.reviewState ?? null;
                    if (W.number === D && W.reviewState === Z) return W;
                    return {
                        number: D,
                        url: P?.url ?? null,
                        reviewState: Z,
                        lastUpdated: Date.now()
                    }
                }), Date.now() - M > __A) {
                A.current = !0;
                return
            }
            if (!w) Y.current = setTimeout(H, AP7)
        }
        let J = Date.now() - O.current;
        if (J >= AP7) H();
        else Y.current = setTimeout(H, AP7 - J);
        return () => {
            if (w = !0, Y.current) clearTimeout(Y.current), Y.current = null
        }
    }, [q, K]), _
}
// @from(Ln 531742, Col 4)
Nz6
// @from(Ln 531742, Col 9)
AP7 = 60000
// @from(Ln 531743, Col 4)
__A = 4000
// @from(Ln 531744, Col 4)
z_A = 3600000
// @from(Ln 531745, Col 4)
Y_A
// @from(Ln 531746, Col 4)
O95 = L(() => {
    y8();
    Y95();
    Nz6 = K6(P6(), 1), Y_A = {
        number: null,
        url: null,
        reviewState: null,
        lastUpdated: 0
    }
})
// @from(Ln 531757, Col 0)
function $95(q) {
    let K = s(27),
        {
            exitMessage: _,
            vimMode: z,
            mode: Y,
            toolPermissionContext: A,
            suppressHint: O,
            isLoading: w,
            tasksSelected: $,
            teamsSelected: j,
            tmuxSelected: H,
            teammateFooterIndex: J,
            isPasting: X,
            isSearching: M,
            historyQuery: P,
            setHistoryQuery: W,
            historyFailedMatch: D,
            onOpenTasksDialog: Z
        } = q;
    if (t35(), _.show) {
        let h;
        if (K[0] !== _.key) h = fq.createElement(T, {
            dimColor: !0,
            key: "exit-message"
        }, "Press ", _.key, " again to exit"), K[0] = _.key, K[1] = h;
        else h = K[1];
        return h
    }
    if (X) {
        let h;
        if (K[2] === Symbol.for("react.memo_cache_sentinel")) h = fq.createElement(T, {
            dimColor: !0,
            key: "pasting-message"
        }, "Pasting text…"), K[2] = h;
        else h = K[2];
        return h
    }
    let G;
    if (K[3] !== M || K[4] !== z) G = ce() && z === "INSERT" && !M, K[3] = M, K[4] = z, K[5] = G;
    else G = K[5];
    let f = G,
        v;
    if (K[6] !== D || K[7] !== P || K[8] !== M || K[9] !== W) v = M && fq.createElement(q95, {
        value: P,
        onChange: W,
        historyFailedMatch: D
    }), K[6] = D, K[7] = P, K[8] = M, K[9] = W, K[10] = v;
    else v = K[10];
    let V;
    if (K[11] !== f) V = f ? fq.createElement(T, {
        dimColor: !0,
        key: "vim-insert"
    }, "-- INSERT --") : null, K[11] = f, K[12] = V;
    else V = K[12];
    let k = !O && !f,
        N;
    if (K[13] !== w || K[14] !== Y || K[15] !== Z || K[16] !== k || K[17] !== $ || K[18] !== J || K[19] !== j || K[20] !== H || K[21] !== A) N = fq.createElement(O_A, {
        mode: Y,
        toolPermissionContext: A,
        showHint: k,
        isLoading: w,
        tasksSelected: $,
        teamsSelected: j,
        teammateFooterIndex: J,
        tmuxSelected: H,
        onOpenTasksDialog: Z
    }), K[13] = w, K[14] = Y, K[15] = Z, K[16] = k, K[17] = $, K[18] = J, K[19] = j, K[20] = H, K[21] = A, K[22] = N;
    else N = K[22];
    let R;
    if (K[23] !== v || K[24] !== V || K[25] !== N) R = fq.createElement(u, {
        justifyContent: "flex-start",
        gap: 1
    }, v, V, N), K[23] = v, K[24] = V, K[25] = N, K[26] = R;
    else R = K[26];
    return R
}
// @from(Ln 531835, Col 0)
function O_A({
    mode: q,
    toolPermissionContext: K,
    showHint: _,
    isLoading: z,
    tasksSelected: Y,
    teamsSelected: A,
    tmuxSelected: O,
    teammateFooterIndex: w,
    onOpenTasksDialog: $
}) {
    let {
        columns: j
    } = s1(), H = V3("chat:cycleMode", "Chat", "shift+tab"), J = M8((v6) => v6.tasks), X = M8((v6) => v6.taskDecorations), M = M8((v6) => v6.teamContext), P = H9(), [W] = b66.useState(() => P.getState().remoteSessionUrl), D = M8((v6) => v6.viewSelectionMode), Z = M8((v6) => v6.viewingAgentTaskId), G = M8((v6) => v6.expandedView), f = G === "teammates", v = A95(z, w95()), V = M8((v6) => !1), k = FW6(), N = oE((v6) => v6.voiceState), R = oE((v6) => v6.voiceWarmingUp), h = zA4(), C = aN6().getState, x = !1, B = b66.useMemo(() => w7(Object.values(J), (v6) => yH(v6) && !0), [J]), m = I48(), S = m !== void 0 && m.length > 0, F = V3("chat:cancel", "Chat", "esc").toLowerCase(), U = V3("app:toggleTodos", "Global", "ctrl+t"), g = V3("chat:killAgents", "Chat", "ctrl+x ctrl+k"), c = V3("voice:pushToTalk", "Chat", "Space"), [n] = b66.useState(() => (H8().voiceFooterHintSeenCount ?? 0) < A_A), l = b66.useRef(!1);
    b66.useEffect(() => {
        {
            if (!k || !n) return;
            if (l?.current) return;
            if (l) l.current = !0;
            let v6 = (H8().voiceFooterHintSeenCount ?? 0) + 1;
            d8((L6) => {
                if ((L6.voiceFooterHintSeenCount ?? 0) >= v6) return L6;
                return {
                    ...L6,
                    voiceFooterHintSeenCount: v6
                }
            })
        }
    }, [k, n]);
    let z6 = M8((v6) => v6.notifications.current?.key === "kill-agents-confirm"),
        A6 = z4() && !bF() && M !== void 0 && w7(Object.values(M.teammates), (v6) => v6.name !== "team-lead") > 0;
    if (q === "bash") return fq.createElement(T, {
        color: "bashBorder"
    }, "! for bash mode");
    let e = K?.mode,
        i = !Xg7(e),
        O6 = Z ? J[Z] : void 0,
        J6 = D === "viewing-agent" && O6?.type === "in_process_teammate",
        $6 = J6 && O6 != null && O6.status !== "running",
        H6 = B > 0 || J6,
        q6 = (i ? 1 : 0) + (H6 ? 1 : 0) + (A6 ? 1 : 0),
        o = w95() && v.number !== null && v.reviewState !== null && v.url !== null && q6 < 2 && (q6 === 0 || j >= 80),
        _6 = q6 < 2,
        t = !f && H6 && Object.values(J).some((v6) => v6.type === "in_process_teammate") || !f && J6,
        Y6 = e && i && !nK() ? fq.createElement(T, {
            color: LV(e),
            key: "mode"
        }, CQ6(e), " ", yr(e).toLowerCase(), " on", _6 && fq.createElement(T, {
            dimColor: !0
        }, " ", fq.createElement(A8, {
            chord: H,
            action: "cycle",
            parens: !0,
            format: {
                keyCase: "lower"
            }
        }))) : null,
        X6 = [...W ? [fq.createElement(yq, {
            url: W,
            key: "remote"
        }, fq.createElement(T, {
            color: "ide"
        }, e6.circleDouble, " remote"))] : [], ...[], ...z4() && A6 ? [fq.createElement(a35, {
            key: "teams",
            teamsSelected: A,
            showHint: _ && !H6
        })] : [], ...o ? [fq.createElement(qU8, {
            key: "pr-status",
            number: v.number,
            url: v.url,
            reviewState: v.reviewState
        })] : []],
        M6 = Object.values(J).some((v6) => v6.type === "in_process_teammate" && v6.status === "running"),
        W6 = Object.values(J).some((v6) => v6.type === "local_agent" && v6.status === "running"),
        V6 = _ ? w_A(z, F, U, g, S, G, M6, W6, z6, h) : [];
    if ($6) X6.push(fq.createElement(T, {
        dimColor: !0,
        key: "esc-return"
    }, fq.createElement(A8, {
        chord: F,
        action: "return to team lead",
        format: {
            keyCase: "lower"
        }
    })));
    else if (!t && _) X6.push(...V6);
    if (t) {
        let v6 = [...Y6 ? [Y6] : [], ...X6, ...$6 ? [] : V6];
        return fq.createElement(u, {
            flexDirection: "column"
        }, fq.createElement(u, null, fq.createElement(YP7, {
            tasksSelected: Y,
            isViewingTeammate: J6,
            teammateFooterIndex: w,
            isLeaderIdle: !z,
            onOpenDialog: $
        })), v6.length > 0 && fq.createElement(u, null, fq.createElement(z1, null, v6)))
    }
    let f6 = !1,
        G6 = H6 && !t && !ju6(J, f) ? fq.createElement(YP7, {
            tasksSelected: Y,
            isViewingTeammate: J6,
            teammateFooterIndex: w,
            isLeaderIdle: !z,
            onOpenDialog: $
        }) : null;
    if (X6.length === 0 && !G6 && !Y6 && _) X6.push(fq.createElement(T, {
        dimColor: !0,
        key: "shortcuts-hint"
    }, "? for shortcuts"));
    let k6 = H8().copyOnSelect ?? !0,
        T6 = h && (!k6 || ca());
    if (k && R) X6.push(fq.createElement(PM7, {
        key: "voice-warmup"
    }));
    else if (lq() && T6) {
        let v6 = y1() === "macos",
            L6 = v6 && (C()?.lastPressHadAlt ?? !1);
        X6.push(fq.createElement(T, {
            dimColor: !0,
            key: "selection-copy"
        }, fq.createElement(z1, null, !k6 && fq.createElement(A8, {
            chord: "ctrl+c",
            action: "copy"
        }), ca() && (L6 ? fq.createElement(T, null, "set macOptionClickForcesSelection in VS Code settings") : fq.createElement(T, null, v6 ? "option+click" : "shift+click", " to native select")))))
    } else if (X6.length > 0 && _ && k && N === "idle" && V6.length === 0 && n) X6.push(fq.createElement(T, {
        dimColor: !0,
        key: "voice-hint"
    }, "hold ", c, " to speak"));
    if ((G6 || f6) && _ && !A6) X6.push(fq.createElement(T, {
        dimColor: !0,
        key: "manage-tasks"
    }, Y ? fq.createElement(A8, {
        chord: "enter",
        action: "view tasks"
    }) : fq.createElement(A8, {
        chord: "down",
        action: "manage"
    })));
    if (X6.length === 0 && !G6 && !Y6) return lq() ? fq.createElement(T, null, " ") : null;
    return fq.createElement(u, {
        height: 1,
        overflow: "hidden"
    }, Y6 && fq.createElement(u, {
        flexShrink: 0
    }, Y6, (G6 || X6.length > 0) && fq.createElement(T, {
        dimColor: !0
    }, " · ")), G6 && fq.createElement(u, {
        flexShrink: 0
    }, G6, X6.length > 0 && fq.createElement(T, {
        dimColor: !0
    }, " · ")), X6.length > 0 && fq.createElement(T, {
        wrap: "truncate"
    }, fq.createElement(z1, null, X6)))
}
// @from(Ln 531991, Col 0)
function w_A(q, K, _, z, Y, A, O, w, $, j) {
    let H;
    if (O) switch (A) {
        case "none":
            H = "show tasks";
            break;
        case "tasks":
            H = "show teammates";
            break;
        case "teammates":
            H = "hide";
            break
    } else H = A === "tasks" ? "hide tasks" : "show tasks";
    let J = Y || O;
    return [...q && !j ? [fq.createElement(T, {
        dimColor: !0,
        key: "esc"
    }, fq.createElement(A8, {
        chord: K,
        action: "interrupt",
        format: {
            keyCase: "lower"
        }
    }))] : [], ...!q && w && !$ ? [fq.createElement(T, {
        dimColor: !0,
        key: "kill-agents"
    }, fq.createElement(A8, {
        chord: z,
        action: "stop agents",
        format: {
            keyCase: "lower"
        }
    }))] : [], ...J ? [fq.createElement(T, {
        dimColor: !0,
        key: "toggle-tasks"
    }, fq.createElement(A8, {
        chord: _,
        action: H,
        format: {
            keyCase: "lower"
        }
    }))] : []]
}
// @from(Ln 532035, Col 0)
function w95() {
    return H8().prStatusFooterEnabled ?? !0
}
// @from(Ln 532038, Col 4)
fq
// @from(Ln 532038, Col 8)
b66
// @from(Ln 532038, Col 13)
A_A = 3
// @from(Ln 532039, Col 4)
j95 = L(() => {
    o6();
    g6();
    Qq();
    K_8();
    RM();
    OP();
    o35();
    vM();
    AY8();
    Y66();
    fO();
    s35();
    sx();
    e35();
    N7();
    y8();
    K95();
    O95();
    u7();
    Nq();
    I4();
    yF8();
    WM7();
    Ps8();
    B$6();
    nO();
    la();
    BE8();
    h1();
    NK();
    Tq7();
    fq = K6(P6(), 1), b66 = K6(P6(), 1)
})
// @from(Ln 532074, Col 0)
function j_A({
    apiKeyStatus: q,
    debug: K,
    exitMessage: _,
    vimMode: z,
    mode: Y,
    isAutoUpdating: A,
    verbose: O,
    onChangeIsUpdating: w,
    suggestions: $,
    selectedSuggestion: j,
    maxColumnWidth: H,
    toolPermissionContext: J,
    helpOpen: X,
    suppressHint: M,
    isLoading: P,
    tasksSelected: W,
    teamsSelected: D,
    bridgeSelected: Z,
    tmuxSelected: G,
    teammateFooterIndex: f,
    ideSelection: v,
    mcpClients: V,
    isPasting: k = !1,
    isInputWrapped: N = !1,
    messages: R,
    isSearching: h,
    historyQuery: C,
    setHistoryQuery: x,
    historyFailedMatch: B,
    onOpenTasksDialog: m
}) {
    let S = iO(),
        {
            columns: F,
            rows: U
        } = s1(),
        g = aW6.useRef(R);
    g.current = R;
    let c = aW6.useMemo(() => _P7(R), [R]),
        n = lq(),
        l = M8((H6) => H6.briefTranscript),
        z6 = n && U < $_A,
        A6 = [!1, n && l && "focus"].filter((H6) => Boolean(H6)),
        e = us8(),
        i = M8((H6) => H6.coordinatorTaskIndex),
        O6 = W && (e === 0 || i < 0),
        J6 = M || KP7(S) || h,
        $6 = aW6.useMemo(() => n && $.length ? {
            suggestions: $,
            selectedSuggestion: j,
            maxColumnWidth: H
        } : null, [n, $, j, H]);
    if (VcK($6), $.length && !n) return PA.createElement(u, {
        paddingX: 2,
        paddingY: 0
    }, PA.createElement(ps6, {
        suggestions: $,
        selectedSuggestion: j,
        maxColumnWidth: H
    }));
    if (X) return PA.createElement(Vi8, {
        dimColor: !0,
        fixedWidth: !0,
        paddingX: 2
    });
    return PA.createElement(PA.Fragment, null, PA.createElement(u, {
        width: F,
        flexWrap: "wrap",
        alignItems: "flex-end",
        paddingLeft: 2,
        paddingRight: n ? 1 : 2,
        columnGap: 1
    }, PA.createElement(u, {
        flexDirection: "column",
        flexShrink: 1
    }, Y === "prompt" && !z6 && !_.show && !k && KP7(S) && PA.createElement(n35, {
        messagesRef: g,
        lastAssistantMessageId: c,
        vimMode: z
    }), PA.createElement($95, {
        exitMessage: _,
        vimMode: z,
        mode: Y,
        toolPermissionContext: J,
        suppressHint: J6,
        isLoading: P,
        tasksSelected: O6,
        teamsSelected: D,
        teammateFooterIndex: f,
        tmuxSelected: G,
        isPasting: k,
        isSearching: h,
        historyQuery: C,
        setHistoryQuery: x,
        historyFailedMatch: B,
        onOpenTasksDialog: m
    }), !1), PA.createElement(u, {
        flexShrink: 0,
        marginLeft: "auto",
        gap: 1
    }, n ? null : PA.createElement(vs8, {
        apiKeyStatus: q,
        debug: K,
        isAutoUpdating: A,
        verbose: O,
        messages: R,
        onChangeIsUpdating: w,
        ideSelection: v,
        mcpClients: V,
        isInputWrapped: N
    }), PA.createElement(H_A, {
        bridgeSelected: Z
    }), A6.length > 0 && PA.createElement(T, {
        dimColor: !0
    }, A6.join(" & ")))), !1)
}
// @from(Ln 532192, Col 0)
function H_A(q) {
    let K = s(11),
        {
            bridgeSelected: _
        } = q,
        z = M8(W_A),
        Y = M8(P_A),
        A = M8(M_A),
        O = M8(X_A),
        w = M8(J_A);
    if (!mx() || !z) return null;
    let $;
    if (K[0] !== Y || K[1] !== O || K[2] !== A) $ = vF8({
        error: void 0,
        connected: Y,
        sessionActive: A,
        reconnecting: O
    }), K[0] = Y, K[1] = O, K[2] = A, K[3] = $;
    else $ = K[3];
    let j = $;
    if (!w && j.label !== "Remote Control reconnecting") return null;
    let H = _ ? "background" : j.color,
        J;
    if (K[4] !== _) J = _ && PA.createElement(T, {
        dimColor: !0
    }, " · ", PA.createElement(A8, {
        chord: "enter",
        action: "view"
    })), K[4] = _, K[5] = J;
    else J = K[5];
    let X;
    if (K[6] !== _ || K[7] !== j.label || K[8] !== H || K[9] !== J) X = PA.createElement(T, {
        color: H,
        inverse: _,
        wrap: "truncate"
    }, j.label, J), K[6] = _, K[7] = j.label, K[8] = H, K[9] = J, K[10] = X;
    else X = K[10];
    return X
}
// @from(Ln 532232, Col 0)
function J_A(q) {
    return q.replBridgeExplicit
}
// @from(Ln 532236, Col 0)
function X_A(q) {
    return q.replBridgeReconnecting
}
// @from(Ln 532240, Col 0)
function M_A(q) {
    return q.replBridgeSessionActive
}
// @from(Ln 532244, Col 0)
function P_A(q) {
    return q.replBridgeConnected
}
// @from(Ln 532248, Col 0)
function W_A(q) {
    return q.replBridgeEnabled
}
// @from(Ln 532251, Col 4)
PA
// @from(Ln 532251, Col 8)
aW6
// @from(Ln 532251, Col 13)
$_A = 15
// @from(Ln 532252, Col 4)
H95
// @from(Ln 532253, Col 4)
J95 = L(() => {
    o6();
    aR();
    $96();
    Nr8();
    tE();
    I4();
    g6();
    dI();
    Jy6();
    N7();
    nO();
    DP6();
    AY8();
    u7();
    i35();
    Ts8();
    j95();
    KL8();
    gO7();
    PA = K6(P6(), 1), aW6 = K6(P6(), 1);
    H95 = aW6.memo(j_A)
})
// @from(Ln 532277, Col 0)
function D_A() {
    if (!z4()) return;
    let q = KH();
    if (!q) return;
    if (VJ.includes(q)) return QP[q];
    return
}
// @from(Ln 532285, Col 0)
function X95(q) {
    let K = s(3),
        {
            isLoading: _,
            themeColor: z
        } = q,
        A = z ?? void 0,
        O;
    if (K[0] !== A || K[1] !== _) O = vg.createElement(T, {
        color: A,
        dimColor: _
    }, e6.pointer, " "), K[0] = A, K[1] = _, K[2] = O;
    else O = K[2];
    return O
}
// @from(Ln 532301, Col 0)
function OP7(q) {
    let K = s(6),
        {
            mode: _,
            isLoading: z,
            viewingAgentName: Y,
            viewingAgentColor: A
        } = q,
        O;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = D_A(), K[0] = O;
    else O = K[0];
    let w = O,
        $ = A ? QP[A] : void 0,
        j;
    if (K[1] !== z || K[2] !== _ || K[3] !== $ || K[4] !== Y) j = vg.createElement(u, {
        alignItems: "flex-start",
        alignSelf: "flex-start",
        flexWrap: "nowrap",
        justifyContent: "flex-start"
    }, Y ? vg.createElement(X95, {
        isLoading: z,
        themeColor: $
    }) : _ === "bash" ? vg.createElement(T, {
        color: "bashBorder",
        dimColor: z
    }, "! ") : vg.createElement(X95, {
        isLoading: z,
        themeColor: z4() ? w : void 0
    })), K[1] = z, K[2] = _, K[3] = $, K[4] = Y, K[5] = j;
    else j = K[5];
    return j
}
// @from(Ln 532333, Col 4)
vg
// @from(Ln 532334, Col 4)
M95 = L(() => {
    o6();
    Qq();
    g6();
    Uf();
    zY();
    fO();
    vg = K6(P6(), 1)
})
// @from(Ln 532344, Col 0)
function G_A(q) {
    try {
        return n8(q)?.type === "idle_notification"
    } catch {
        return !1
    }
}
// @from(Ln 532352, Col 0)
function v_A(q) {
    return `<${TA}>
<${Mw}>+${q} more tasks completed</${Mw}>
<${rX}>completed</${rX}>
</${TA}>`
}
// @from(Ln 532359, Col 0)
function T_A(q) {
    let K = q.filter((w) => typeof w.value !== "string" || !G_A(w.value)),
        _ = K.filter((w) => w.mode === "task-notification"),
        z = K.filter((w) => w.mode !== "task-notification");
    if (_.length <= wP7) return [...z, ..._];
    let Y = _.slice(0, wP7 - 1),
        A = _.length - (wP7 - 1),
        O = {
            value: v_A(A),
            mode: "task-notification"
        };
    return [...z, ...Y, O]
}
// @from(Ln 532373, Col 0)
function V_A() {
    let q = cn(),
        K = M8((Y) => !!Y.viewingAgentTaskId),
        _ = M8((Y) => Y.isBriefOnly),
        z = P95.useMemo(() => {
            if (q.length === 0) return null;
            let Y = q.filter(KW4);
            if (Y.length === 0) return null;
            let A = T_A(Y);
            return aP(A.map((O) => {
                let w = O.value;
                if (O.mode === "bash" && typeof w === "string") w = `<bash-input>${w}</bash-input>`;
                return t8({
                    content: w
                })
            }))
        }, [q]);
    if (K || z === null) return null;
    return I66.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, z.map((Y, A) => I66.createElement(TjK, {
        key: A,
        isFirst: A === 0,
        useBriefLayout: _
    }, I66.createElement(Ku, {
        message: Y,
        lookups: Ke,
        addMargin: !1,
        tools: [],
        commands: [],
        verbose: !1,
        inProgressToolUseIDs: f_A,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
    }))))
}
// @from(Ln 532413, Col 4)
I66
// @from(Ln 532413, Col 9)
P95
// @from(Ln 532413, Col 14)
f_A
// @from(Ln 532413, Col 19)
wP7 = 3
// @from(Ln 532414, Col 4)
ns8
// @from(Ln 532415, Col 4)
$P7 = L(() => {
    g6();
    N7();
    rA();
    Zq7();
    Pm6();
    b$();
    _7();
    e8();
    _b6();
    I66 = K6(P6(), 1), P95 = K6(P6(), 1), f_A = new Set;
    ns8 = I66.memo(V_A)
})
// @from(Ln 532429, Col 0)
function W95(q) {
    let K = s(1),
        {
            hasStash: _
        } = q;
    if (!_) return null;
    let z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = HY8.createElement(u, {
        paddingLeft: 2
    }, HY8.createElement(T, {
        dimColor: !0
    }, e6.pointerSmall, " Stashed (auto-restores after submit)")), K[0] = z;
    else z = K[0];
    return z
}
// @from(Ln 532444, Col 4)
HY8
// @from(Ln 532445, Col 4)
D95 = L(() => {
    o6();
    Qq();
    g6();
    HY8 = K6(P6(), 1)
})
// @from(Ln 532452, Col 0)
function N_A(q, K) {
    if (q.length <= k_A) return {
        truncatedText: q,
        placeholderContent: ""
    };
    let _ = Math.floor(Z95 / 2),
        z = Math.floor(Z95 / 2),
        Y = q.slice(0, _),
        A = q.slice(-z),
        O = q.slice(_, -z),
        w = hE6(O),
        j = E_A(K, w);
    return {
        truncatedText: Y + j + A,
        placeholderContent: O
    }
}
// @from(Ln 532470, Col 0)
function E_A(q, K) {
    return `[...Truncated text #${q} +${K} lines...]`
}
// @from(Ln 532474, Col 0)
function f95(q, K) {
    let _ = Object.keys(K).map(Number),
        z = _.length > 0 ? Math.max(..._) + 1 : 1,
        {
            truncatedText: Y,
            placeholderContent: A
        } = N_A(q, z);
    if (!A) return {
        newInput: q,
        newPastedContents: K
    };
    return {
        newInput: Y,
        newPastedContents: {
            ...K,
            [z]: {
                id: z,
                type: "text",
                content: A
            }
        }
    }
}
// @from(Ln 532497, Col 4)
k_A = 1e4
// @from(Ln 532498, Col 4)
Z95 = 1000
// @from(Ln 532499, Col 4)
G95 = L(() => {
    II()
})
// @from(Ln 532503, Col 0)
function v95({
    input: q,
    pastedContents: K,
    onInputChange: _,
    setCursorOffset: z,
    setPastedContents: Y
}) {
    let [A, O] = JY8.useState(!1);
    JY8.useEffect(() => {
        if (A) return;
        if (q.length <= 1e4) return;
        let {
            newInput: w,
            newPastedContents: $
        } = f95(q, K);
        _(w), z(w.length), Y($), O(!0)
    }, [q, A, K, _, Y, z]), JY8.useEffect(() => {
        if (q === "") O(!1)
    }, [q])
}
// @from(Ln 532523, Col 4)
JY8
// @from(Ln 532524, Col 4)
T95 = L(() => {
    G95();
    JY8 = K6(P6(), 1)
})
// @from(Ln 532529, Col 0)
function L_A(q) {
    return !y_A.some((K) => K.test(q))
}
// @from(Ln 532533, Col 0)
function h_A(q, K) {
    let _ = [],
        z = new Set,
        Y = new Map;
    for (let A = 1; _.length < K && A <= K; A++)
        for (let O of q) {
            if (_.length >= K) break;
            if (!L_A(O)) continue;
            let w = Math.max(O.lastIndexOf("/"), O.lastIndexOf("\\")),
                $ = w >= 0 ? O.slice(w + 1) : O;
            if (!$ || z.has($)) continue;
            let j = w >= 0 ? O.slice(0, w) : ".";
            if ((Y.get(j) ?? 0) >= A) continue;
            _.push($), z.add($), Y.set(j, (Y.get(j) ?? 0) + 1)
        }
    return _.length >= K ? _ : []
}
// @from(Ln 532550, Col 0)
async function R_A() {
    if (X7.platform === "win32") return [];
    if (!await qX()) return [];
    try {
        let q = await UV8(),
            K = ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M"],
            _ = new Map,
            z = (A) => {
                for (let O of A.split(`
`)) {
                    let w = O.trim();
                    if (w) _.set(w, (_.get(w) ?? 0) + 1)
                }
            };
        if (q) {
            let {
                stdout: A
            } = await M7("git", [...K, `--author=${q}`], {
                cwd: b8()
            });
            z(A)
        }
        if (_.size < 10) {
            let {
                stdout: A
            } = await M7(D7(), K, {
                cwd: b8()
            });
            z(A)
        }
        let Y = Array.from(_.entries()).sort((A, O) => O[1] - A[1]).map(([A]) => A);
        return h_A(Y, 5)
    } catch (q) {
        return j6(q), []
    }
}
// @from(Ln 532586, Col 4)
y_A
// @from(Ln 532586, Col 9)
S_A = 604800000
// @from(Ln 532587, Col 4)
V95
// @from(Ln 532587, Col 9)
k95
// @from(Ln 532588, Col 4)
jP7 = L(() => {
    U4();
    uc();
    n7();
    h1();
    D_();
    Q4();
    pK();
    U8();
    B26();
    y_A = [/(?:^|\/)(?:package-lock\.json|yarn\.lock|bun\.lock|bun\.lockb|pnpm-lock\.yaml|Pipfile\.lock|poetry\.lock|Cargo\.lock|Gemfile\.lock|go\.sum|composer\.lock|uv\.lock)$/, /\.generated\./, /(?:^|\/)(?:dist|build|out|target|node_modules|\.next|__pycache__)\//, /\.(?:min\.js|min\.css|map|pyc|pyo)$/, /\.(?:json|ya?ml|toml|xml|ini|cfg|conf|env|lock|txt|md|mdx|rst|csv|log|svg)$/i, /(?:^|\/)\.?(?:eslintrc|prettierrc|babelrc|editorconfig|gitignore|gitattributes|dockerignore|npmrc)/, /(?:^|\/)(?:tsconfig|jsconfig|biome|vitest\.config|jest\.config|webpack\.config|vite\.config|rollup\.config)\.[a-z]+$/, /(?:^|\/)\.(?:github|vscode|idea|claude)\//, /(?:^|\/)(?:CHANGELOG|LICENSE|CONTRIBUTING|CODEOWNERS|README)(?:\.[a-z]+)?$/i];
    V95 = P1(() => {
        let q = Ew(),
            K = q.exampleFiles?.length ? LJ(q.exampleFiles) : "<filepath>",
            _ = ["fix lint errors", "fix typecheck errors", `how does ${K} work?`, `refactor ${K}`, "how do I log an error?", `edit ${K} to...`, `write a test for ${K}`, "create a util logging.py that..."];
        return `Try "${LJ(_)}"`
    }), k95 = P1(async () => {
        let q = Ew(),
            K = Date.now(),
            _ = q.exampleFilesGeneratedAt ?? 0;
        if (K - _ > S_A) q.exampleFiles = [];
        if (!q.exampleFiles?.length) R_A().then((z) => {
            if (z.length) u2((Y) => ({
                ...Y,
                exampleFiles: z,
                exampleFilesGeneratedAt: Date.now()
            }))
        })
    })
})
// @from(Ln 532619, Col 0)
function y95({
    input: q,
    submitCount: K,
    viewingAgentName: _
}) {
    let z = cn(),
        Y = M8((O) => O.promptSuggestionEnabled);
    return E95.useMemo(() => {
        if (q !== "") return;
        if (_) return `Message @${_.length>N95?_.slice(0,N95-1)+"…":_}…`;
        if (z.some(hj6) && (H8().queuedCommandUpHintCount || 0) < C_A) return "Press up to edit queued messages";
        if (K < 1 && Y) return V95()
    }, [q, z, K, Y, _])
}
// @from(Ln 532633, Col 4)
E95
// @from(Ln 532633, Col 9)
C_A = 3
// @from(Ln 532634, Col 4)
N95 = 20
// @from(Ln 532635, Col 4)
L95 = L(() => {
    Pm6();
    N7();
    h1();
    jP7();
    b$();
    E95 = K6(P6(), 1)
})
// @from(Ln 532644, Col 0)
function R95(q) {
    let [K, _] = is8.useState(!1);
    return is8.useEffect(() => {
        if (h95 || !q) return;
        h95 = !0, _(!0);
        let z = setTimeout(_, b_A, !1);
        return () => {
            clearTimeout(z), _(!1)
        }
    }, [q]), K
}
// @from(Ln 532655, Col 4)
is8
// @from(Ln 532655, Col 9)
b_A = 5000
// @from(Ln 532656, Col 4)
h95 = !1
// @from(Ln 532657, Col 4)
S95 = L(() => {
    is8 = K6(P6(), 1)
})
// @from(Ln 532661, Col 0)
function C95(q) {
    if (Z9()) return;
    return q.standaloneAgentContext?.name
}
// @from(Ln 532665, Col 4)
b95 = L(() => {
    zY()
})
// @from(Ln 532669, Col 0)
function I95() {
    let q = M8((J) => J.teamContext),
        K = M8((J) => J.standaloneAgentContext),
        _ = M8((J) => J.agent);
    M8((J) => J.viewingAgentTaskId);
    let z = H9(),
        [Y, A] = os8.useState(null);
    os8.useEffect(() => {
        ap().then(A)
    }, []);
    let O = z.getState();
    if (Lz() && !$D()) {
        let J = T_();
        if (J && Z9()) return {
            text: `@${J}`,
            bgColor: rs8(q?.selfAgentColor ?? KH())
        }
    }
    if (q?.teamName && q.teammates && Object.keys(q.teammates).length > 0) {
        let J = dp(O),
            X = rs8(J?.identity.color),
            M = bF(),
            P = h97()?.isNative ?? !1;
        if (Y === !1 && !M && !P) return {
            text: `View teammates: \`tmux -L ${gh6()} a\``,
            bgColor: X
        };
        if ((Y === !0 || M || P) && J) return {
            text: `@${J.identity.agentName}`,
            bgColor: X
        }
    }
    let $ = ab8(O);
    if ($.type === "named_agent") {
        let J = $.task,
            X;
        for (let [M, P] of O.agentNameRegistry)
            if (P === J.id) {
                X = M;
                break
            } return {
            text: X ? `@${X}` : J.description,
            bgColor: cs(J.agentType) ?? "cyan_FOR_SUBAGENTS_ONLY"
        }
    }
    let j = C95(O),
        H = K?.color;
    if (j || H) return {
        text: j ?? "",
        bgColor: rs8(H)
    };
    if (_) {
        let J = O.agentDefinitions.activeAgents.find((X) => X.agentType === _);
        return {
            text: _,
            bgColor: rs8(J?.color, "promptBorder")
        }
    }
    return null
}
// @from(Ln 532730, Col 0)
function rs8(q, K = "cyan_FOR_SUBAGENTS_ONLY") {
    return q && VJ.includes(q) ? QP[q] : K
}
// @from(Ln 532733, Col 4)
os8
// @from(Ln 532734, Col 4)
x95 = L(() => {
    N7();
    kh6();
    Uf();
    b95();
    yx();
    sx();
    zY();
    Rv();
    os8 = K6(P6(), 1)
})