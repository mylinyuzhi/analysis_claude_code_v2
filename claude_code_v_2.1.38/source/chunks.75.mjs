
// @from(Ln 201436, Col 0)
function kA(A) {
    let q = e(72),
        {
            isDisabled: K,
            hideIndexes: Y,
            visibleOptionCount: z,
            highlightText: w,
            options: H,
            defaultValue: $,
            onCancel: O,
            onChange: _,
            onFocus: J,
            defaultFocusValue: X,
            layout: D,
            disableSelection: j,
            inlineDescriptions: M,
            onUpFromFirstItem: P,
            onDownFromLastItem: W,
            onInputModeToggle: G,
            onOpenEditor: f,
            onImagePaste: Z,
            pastedContents: N,
            onRemoveImage: T
        } = A,
        k = K === void 0 ? !1 : K,
        y = Y === void 0 ? !1 : Y,
        B = z === void 0 ? 5 : z,
        S = D === void 0 ? "compact" : D,
        m = j === void 0 ? !1 : j,
        b = M === void 0 ? !1 : M,
        [g, U] = p4.useState(!1),
        [x, p] = p4.useState(0),
        l;
    if (q[0] !== H) l = () => {
        let Y1 = new Map;
        return H.forEach((_1) => {
            if (_1.type === "input" && _1.initialValue) Y1.set(_1.value, _1.initialValue)
        }), Y1
    }, q[0] = H, q[1] = l;
    else l = q[1];
    let [r, s] = p4.useState(l), O1;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) O1 = new Map, q[2] = O1;
    else O1 = q[2];
    let T1 = p4.useRef(O1),
        N1, j1;
    if (q[3] !== r || q[4] !== H) j1 = () => {
        for (let Y1 of H)
            if (Y1.type === "input" && Y1.initialValue !== void 0) {
                let _1 = T1.current.get(Y1.value) ?? "",
                    $1 = r.get(Y1.value) ?? "",
                    G1 = Y1.initialValue;
                if (G1 !== _1 && $1 === _1) s((L1) => {
                    let x1 = new Map(L1);
                    return x1.set(Y1.value, G1), x1
                });
                T1.current.set(Y1.value, G1)
            }
    }, N1 = [H, r], q[3] = r, q[4] = H, q[5] = N1, q[6] = j1;
    else N1 = q[5], j1 = q[6];
    p4.useEffect(j1, N1);
    let q1;
    if (q[7] !== X || q[8] !== $ || q[9] !== O || q[10] !== _ || q[11] !== J || q[12] !== H || q[13] !== B) q1 = {
        visibleOptionCount: B,
        options: H,
        defaultValue: $,
        onChange: _,
        onCancel: O,
        onFocus: J,
        focusValue: X
    }, q[7] = X, q[8] = $, q[9] = O, q[10] = _, q[11] = J, q[12] = H, q[13] = B, q[14] = q1;
    else q1 = q[14];
    let t = Hk7(q1),
        J1 = m || (y ? "numeric" : !1),
        D1;
    if (q[15] !== N) D1 = () => {
        if (N && Object.values(N).some(P59)) {
            let Y1 = Object.values(N).filter(M59).length;
            return U(!0), p(Y1 - 1), !0
        }
        return !1
    }, q[15] = N, q[16] = D1;
    else D1 = q[16];
    let Z1;
    if (q[17] !== g || q[18] !== r || q[19] !== k || q[20] !== W || q[21] !== G || q[22] !== P || q[23] !== H || q[24] !== t || q[25] !== J1 || q[26] !== D1) Z1 = {
        isDisabled: k,
        disableSelection: J1,
        state: t,
        options: H,
        isMultiSelect: !1,
        onUpFromFirstItem: P,
        onDownFromLastItem: W,
        onInputModeToggle: G,
        inputValues: r,
        imagesSelected: g,
        onEnterImageSelection: D1
    }, q[17] = g, q[18] = r, q[19] = k, q[20] = W, q[21] = G, q[22] = P, q[23] = H, q[24] = t, q[25] = J1, q[26] = D1, q[27] = Z1;
    else Z1 = q[27];
    jk7(Z1);
    let E1, a, A1, M1;
    if (q[28] !== y || q[29] !== w || q[30] !== g || q[31] !== b || q[32] !== r || q[33] !== k || q[34] !== S || q[35] !== O || q[36] !== _ || q[37] !== Z || q[38] !== f || q[39] !== T || q[40] !== H.length || q[41] !== N || q[42] !== x || q[43] !== t.focusedValue || q[44] !== t.options || q[45] !== t.value || q[46] !== t.visibleFromIndex || q[47] !== t.visibleOptions || q[48] !== t.visibleToIndex) {
        M1 = Symbol.for("react.early_return_sentinel");
        A: {
            let Y1 = {
                container: j59,
                highlightedText: D59
            };
            if (S === "expanded") {
                let f1;
                if (q[53] !== t.options.length) f1 = t.options.length.toString(), q[53] = t.options.length, q[54] = f1;
                else f1 = q[54];
                let R1 = f1.length;
                M1 = p4.default.createElement(I, {
                    ...Y1.container()
                }, t.visibleOptions.map((H1, y1) => {
                    let B1 = H1.index === t.visibleFromIndex,
                        A6 = H1.index === t.visibleToIndex - 1,
                        O6 = t.visibleToIndex < H.length,
                        P6 = t.visibleFromIndex > 0,
                        V6 = t.visibleFromIndex + y1 + 1,
                        q6 = !k && t.focusedValue === H1.value,
                        p1 = t.value === H1.value;
                    if (H1.type === "input") {
                        let N6 = r.has(H1.value) ? r.get(H1.value) : H1.initialValue || "";
                        return p4.default.createElement(UD1, {
                            key: String(H1.value),
                            option: H1,
                            isFocused: q6,
                            isSelected: p1,
                            shouldShowDownArrow: O6 && A6,
                            shouldShowUpArrow: P6 && B1,
                            maxIndexWidth: R1,
                            index: V6,
                            inputValue: N6,
                            onInputChange: (F6) => {
                                s((P1) => {
                                    let k1 = new Map(P1);
                                    return k1.set(H1.value, F6), k1
                                })
                            },
                            onSubmit: (F6) => {
                                let P1 = N && Object.values(N).some(X59);
                                if (F6.trim() || P1 || H1.allowEmptySubmitToCancel) _?.(H1.value);
                                else O?.()
                            },
                            onExit: O,
                            layout: "expanded",
                            showLabel: b,
                            onOpenEditor: f,
                            resetCursorOnUpdate: H1.resetCursorOnUpdate,
                            onImagePaste: Z,
                            pastedContents: N,
                            onRemoveImage: T,
                            imagesSelected: g,
                            selectedImageIndex: x,
                            onImagesSelectedChange: U,
                            onSelectedImageIndexChange: p
                        })
                    }
                    let K6 = H1.label;
                    if (typeof H1.label === "string" && w && H1.label.includes(w)) {
                        let N6 = H1.label,
                            F6 = N6.indexOf(w);
                        K6 = p4.default.createElement(p4.default.Fragment, null, N6.slice(0, F6), p4.default.createElement(V, {
                            ...Y1.highlightedText()
                        }, w), N6.slice(F6 + w.length))
                    }
                    let j6 = H1.disabled === !0,
                        M6 = j6 ? void 0 : p1 ? "success" : q6 ? "suggestion" : void 0;
                    return p4.default.createElement(I, {
                        key: String(H1.value),
                        flexDirection: "column",
                        flexShrink: 0
                    }, p4.default.createElement(Uo, {
                        isFocused: q6,
                        isSelected: p1,
                        shouldShowDownArrow: O6 && A6,
                        shouldShowUpArrow: P6 && B1
                    }, p4.default.createElement(V, {
                        dimColor: j6,
                        color: M6
                    }, K6)), H1.description && p4.default.createElement(I, {
                        paddingLeft: 2
                    }, p4.default.createElement(V, {
                        dimColor: j6 || H1.dimDescription !== !1,
                        color: M6
                    }, p4.default.createElement(W3, null, H1.description))), p4.default.createElement(V, null, " "))
                }));
                break A
            }
            if (S === "compact-vertical") {
                let f1;
                if (q[55] !== y || q[56] !== t.options) f1 = y ? 0 : t.options.length.toString().length, q[55] = y, q[56] = t.options, q[57] = f1;
                else f1 = q[57];
                let R1 = f1;
                M1 = p4.default.createElement(I, {
                    ...Y1.container()
                }, t.visibleOptions.map((H1, y1) => {
                    let B1 = H1.index === t.visibleFromIndex,
                        A6 = H1.index === t.visibleToIndex - 1,
                        O6 = t.visibleToIndex < H.length,
                        P6 = t.visibleFromIndex > 0,
                        V6 = t.visibleFromIndex + y1 + 1,
                        q6 = !k && t.focusedValue === H1.value,
                        p1 = t.value === H1.value;
                    if (H1.type === "input") {
                        let M6 = r.has(H1.value) ? r.get(H1.value) : H1.initialValue || "";
                        return p4.default.createElement(UD1, {
                            key: String(H1.value),
                            option: H1,
                            isFocused: q6,
                            isSelected: p1,
                            shouldShowDownArrow: O6 && A6,
                            shouldShowUpArrow: P6 && B1,
                            maxIndexWidth: R1,
                            index: V6,
                            inputValue: M6,
                            onInputChange: (N6) => {
                                s((F6) => {
                                    let P1 = new Map(F6);
                                    return P1.set(H1.value, N6), P1
                                })
                            },
                            onSubmit: (N6) => {
                                let F6 = N && Object.values(N).some(J59);
                                if (N6.trim() || F6 || H1.allowEmptySubmitToCancel) _?.(H1.value);
                                else O?.()
                            },
                            onExit: O,
                            layout: "compact",
                            showLabel: b,
                            onOpenEditor: f,
                            resetCursorOnUpdate: H1.resetCursorOnUpdate,
                            onImagePaste: Z,
                            pastedContents: N,
                            onRemoveImage: T,
                            imagesSelected: g,
                            selectedImageIndex: x,
                            onImagesSelectedChange: U,
                            onSelectedImageIndexChange: p
                        })
                    }
                    let K6 = H1.label;
                    if (typeof H1.label === "string" && w && H1.label.includes(w)) {
                        let M6 = H1.label,
                            N6 = M6.indexOf(w);
                        K6 = p4.default.createElement(p4.default.Fragment, null, M6.slice(0, N6), p4.default.createElement(V, {
                            ...Y1.highlightedText()
                        }, w), M6.slice(N6 + w.length))
                    }
                    let j6 = H1.disabled === !0;
                    return p4.default.createElement(I, {
                        key: String(H1.value),
                        flexDirection: "column",
                        flexShrink: 0
                    }, p4.default.createElement(Uo, {
                        isFocused: q6,
                        isSelected: p1,
                        shouldShowDownArrow: O6 && A6,
                        shouldShowUpArrow: P6 && B1
                    }, p4.default.createElement(p4.default.Fragment, null, !y && p4.default.createElement(V, {
                        dimColor: !0
                    }, `${V6}.`.padEnd(R1 + 1)), p4.default.createElement(V, {
                        dimColor: j6,
                        color: j6 ? void 0 : p1 ? "success" : q6 ? "suggestion" : void 0
                    }, K6))), H1.description && p4.default.createElement(I, {
                        paddingLeft: y ? 2 : R1 + 4
                    }, p4.default.createElement(V, {
                        dimColor: j6 || H1.dimDescription !== !1,
                        color: j6 ? void 0 : p1 ? "success" : q6 ? "suggestion" : void 0
                    }, p4.default.createElement(W3, null, H1.description))))
                }));
                break A
            }
            let _1;
            if (q[58] !== y || q[59] !== t.options) _1 = y ? 0 : t.options.length.toString().length,
            q[58] = y,
            q[59] = t.options,
            q[60] = _1;
            else _1 = q[60];
            let $1 = _1,
                G1 = t.visibleOptions.some(_59),
                L1 = !b && !G1 && t.visibleOptions.some(O59),
                x1 = t.visibleOptions.map((f1, R1) => {
                    let H1 = f1.index === t.visibleFromIndex,
                        y1 = f1.index === t.visibleToIndex - 1,
                        B1 = t.visibleToIndex < H.length,
                        A6 = t.visibleFromIndex > 0,
                        O6 = t.visibleFromIndex + R1 + 1,
                        P6 = !k && t.focusedValue === f1.value,
                        V6 = t.value === f1.value,
                        q6 = f1.disabled === !0,
                        p1 = f1.label;
                    if (typeof f1.label === "string" && w && f1.label.includes(w)) {
                        let K6 = f1.label,
                            j6 = K6.indexOf(w);
                        p1 = p4.default.createElement(p4.default.Fragment, null, K6.slice(0, j6), p4.default.createElement(V, {
                            ...Y1.highlightedText()
                        }, w), K6.slice(j6 + w.length))
                    }
                    return {
                        option: f1,
                        index: O6,
                        label: p1,
                        isFocused: P6,
                        isSelected: V6,
                        isOptionDisabled: q6,
                        shouldShowDownArrow: B1 && y1,
                        shouldShowUpArrow: A6 && H1
                    }
                });
            if (L1) {
                let f1;
                if (q[61] !== y || q[62] !== $1) f1 = (y1) => {
                    if (y1.option.type === "input") return 0;
                    let B1 = _w6(y1.option.label),
                        A6 = y ? 0 : $1 + 2,
                        O6 = y1.isSelected ? 2 : 0;
                    return 2 + A6 + UA(B1) + O6
                }, q[61] = y, q[62] = $1, q[63] = f1;
                else f1 = q[63];
                let R1 = Math.max(...x1.map(f1)),
                    H1;
                if (q[64] !== y || q[65] !== $1 || q[66] !== R1) H1 = (y1) => {
                    if (y1.option.type === "input") return null;
                    let B1 = _w6(y1.option.label),
                        A6 = y ? 0 : $1 + 2,
                        O6 = y1.isSelected ? 2 : 0,
                        P6 = 2 + A6 + UA(B1) + O6,
                        V6 = R1 - P6;
                    return p4.default.createElement(I, {
                        key: String(y1.option.value),
                        flexDirection: "row"
                    }, p4.default.createElement(I, {
                        flexDirection: "row",
                        flexShrink: 0
                    }, y1.isFocused ? p4.default.createElement(V, {
                        color: "suggestion"
                    }, l1.pointer) : y1.shouldShowDownArrow ? p4.default.createElement(V, {
                        dimColor: !0
                    }, l1.arrowDown) : y1.shouldShowUpArrow ? p4.default.createElement(V, {
                        dimColor: !0
                    }, l1.arrowUp) : p4.default.createElement(V, null, " "), p4.default.createElement(V, null, " "), p4.default.createElement(V, {
                        dimColor: y1.isOptionDisabled,
                        color: y1.isOptionDisabled ? void 0 : y1.isSelected ? "success" : y1.isFocused ? "suggestion" : void 0
                    }, !y && p4.default.createElement(V, {
                        dimColor: !0
                    }, `${y1.index}.`.padEnd($1 + 2)), y1.label), y1.isSelected && p4.default.createElement(V, {
                        color: "success"
                    }, " ", l1.tick), V6 > 0 && p4.default.createElement(V, null, " ".repeat(V6))), p4.default.createElement(I, {
                        flexGrow: 1,
                        marginLeft: 2
                    }, p4.default.createElement(V, {
                        wrap: "wrap",
                        dimColor: y1.isOptionDisabled || y1.option.dimDescription !== !1,
                        color: y1.isOptionDisabled ? void 0 : y1.isSelected ? "success" : y1.isFocused ? "suggestion" : void 0
                    }, p4.default.createElement(W3, null, y1.option.description || " "))))
                }, q[64] = y, q[65] = $1, q[66] = R1, q[67] = H1;
                else H1 = q[67];
                M1 = p4.default.createElement(I, {
                    ...Y1.container()
                }, x1.map(H1));
                break A
            }
            E1 = I,
            a = Y1.container(),
            A1 = t.visibleOptions.map((f1, R1) => {
                if (f1.type === "input") {
                    let K6 = r.has(f1.value) ? r.get(f1.value) : f1.initialValue || "",
                        j6 = f1.index === t.visibleFromIndex,
                        M6 = f1.index === t.visibleToIndex - 1,
                        N6 = t.visibleToIndex < H.length,
                        F6 = t.visibleFromIndex > 0,
                        P1 = t.visibleFromIndex + R1 + 1,
                        k1 = !k && t.focusedValue === f1.value,
                        o1 = t.value === f1.value;
                    return p4.default.createElement(UD1, {
                        key: String(f1.value),
                        option: f1,
                        isFocused: k1,
                        isSelected: o1,
                        shouldShowDownArrow: N6 && M6,
                        shouldShowUpArrow: F6 && j6,
                        maxIndexWidth: $1,
                        index: P1,
                        inputValue: K6,
                        onInputChange: (_6) => {
                            s((z6) => {
                                let w6 = new Map(z6);
                                return w6.set(f1.value, _6), w6
                            })
                        },
                        onSubmit: (_6) => {
                            let z6 = N && Object.values(N).some($59);
                            if (_6.trim() || z6 || f1.allowEmptySubmitToCancel) _?.(f1.value);
                            else O?.()
                        },
                        onExit: O,
                        layout: "compact",
                        showLabel: b,
                        onOpenEditor: f,
                        resetCursorOnUpdate: f1.resetCursorOnUpdate,
                        onImagePaste: Z,
                        pastedContents: N,
                        onRemoveImage: T,
                        imagesSelected: g,
                        selectedImageIndex: x,
                        onImagesSelectedChange: U,
                        onSelectedImageIndexChange: p
                    })
                }
                let H1 = f1.label;
                if (typeof f1.label === "string" && w && f1.label.includes(w)) {
                    let K6 = f1.label,
                        j6 = K6.indexOf(w);
                    H1 = p4.default.createElement(p4.default.Fragment, null, K6.slice(0, j6), p4.default.createElement(V, {
                        ...Y1.highlightedText()
                    }, w), K6.slice(j6 + w.length))
                }
                let y1 = f1.index === t.visibleFromIndex,
                    B1 = f1.index === t.visibleToIndex - 1,
                    A6 = t.visibleToIndex < H.length,
                    O6 = t.visibleFromIndex > 0,
                    P6 = t.visibleFromIndex + R1 + 1,
                    V6 = !k && t.focusedValue === f1.value,
                    q6 = t.value === f1.value,
                    p1 = f1.disabled === !0;
                return p4.default.createElement(Uo, {
                    key: String(f1.value),
                    isFocused: V6,
                    isSelected: q6,
                    shouldShowDownArrow: A6 && B1,
                    shouldShowUpArrow: O6 && y1
                }, p4.default.createElement(I, {
                    flexDirection: "row",
                    flexShrink: 0
                }, !y && p4.default.createElement(V, {
                    dimColor: !0
                }, `${P6}.`.padEnd($1 + 2)), p4.default.createElement(V, {
                    dimColor: p1,
                    color: p1 ? void 0 : q6 ? "success" : V6 ? "suggestion" : void 0
                }, H1, b && f1.description && p4.default.createElement(V, {
                    dimColor: p1 || f1.dimDescription !== !1
                }, " ", f1.description))), !b && f1.description && p4.default.createElement(I, {
                    flexShrink: 99,
                    marginLeft: 2
                }, p4.default.createElement(V, {
                    wrap: "wrap-trim",
                    dimColor: p1 || f1.dimDescription !== !1,
                    color: p1 ? void 0 : q6 ? "success" : V6 ? "suggestion" : void 0
                }, p4.default.createElement(W3, null, f1.description))))
            })
        }
        q[28] = y, q[29] = w, q[30] = g, q[31] = b, q[32] = r, q[33] = k, q[34] = S, q[35] = O, q[36] = _, q[37] = Z, q[38] = f, q[39] = T, q[40] = H.length, q[41] = N, q[42] = x, q[43] = t.focusedValue, q[44] = t.options, q[45] = t.value, q[46] = t.visibleFromIndex, q[47] = t.visibleOptions, q[48] = t.visibleToIndex, q[49] = E1, q[50] = a, q[51] = A1, q[52] = M1
    } else E1 = q[49], a = q[50], A1 = q[51], M1 = q[52];
    if (M1 !== Symbol.for("react.early_return_sentinel")) return M1;
    let z1;
    if (q[68] !== E1 || q[69] !== a || q[70] !== A1) z1 = p4.default.createElement(E1, {
        ...a
    }, A1), q[68] = E1, q[69] = a, q[70] = A1, q[71] = z1;
    else z1 = q[71];
    return z1
}
// @from(Ln 201899, Col 0)
function $59(A) {
    return A.type === "image"
}
// @from(Ln 201903, Col 0)
function O59(A) {
    return A.description
}
// @from(Ln 201907, Col 0)
function _59(A) {
    return A.type === "input"
}
// @from(Ln 201911, Col 0)
function J59(A) {
    return A.type === "image"
}
// @from(Ln 201915, Col 0)
function X59(A) {
    return A.type === "image"
}
// @from(Ln 201919, Col 0)
function D59() {
    return {
        bold: !0
    }
}
// @from(Ln 201925, Col 0)
function j59() {
    return {
        flexDirection: "column"
    }
}
// @from(Ln 201931, Col 0)
function M59(A) {
    return A.type === "image"
}
// @from(Ln 201935, Col 0)
function P59(A) {
    return A.type === "image"
}
// @from(Ln 201938, Col 4)
p4
// @from(Ln 201939, Col 4)
U5 = v(() => {
    i1();
    m1();
    s26();
    $k7();
    Mk7();
    b7();
    o$A();
    LY();
    p4 = o(X1(), 1)
})
// @from(Ln 201951, Col 0)
function Jw6(A) {
    let q = e(9),
        {
            ruleValue: K
        } = A;
    switch (K.toolName) {
        case qq.name:
            if (K.ruleContent)
                if (K.ruleContent.endsWith(":*")) {
                    let Y;
                    if (q[0] !== K.ruleContent) Y = K.ruleContent.slice(0, -2), q[0] = K.ruleContent, q[1] = Y;
                    else Y = q[1];
                    let z;
                    if (q[2] !== Y) z = jZ.createElement(V, {
                        dimColor: !0
                    }, "Any Bash command starting with", " ", jZ.createElement(V, {
                        bold: !0
                    }, Y)), q[2] = Y, q[3] = z;
                    else z = q[3];
                    return z
                } else {
                    let Y;
                    if (q[4] !== K.ruleContent) Y = jZ.createElement(V, {
                        dimColor: !0
                    }, "The Bash command ", jZ.createElement(V, {
                        bold: !0
                    }, K.ruleContent)), q[4] = K.ruleContent, q[5] = Y;
                    else Y = q[5];
                    return Y
                }
            else {
                let Y;
                if (q[6] === Symbol.for("react.memo_cache_sentinel")) Y = jZ.createElement(V, {
                    dimColor: !0
                }, "Any Bash command"), q[6] = Y;
                else Y = q[6];
                return Y
            }
        default:
            if (!K.ruleContent) {
                let Y;
                if (q[7] !== K.toolName) Y = jZ.createElement(V, {
                    dimColor: !0
                }, "Any use of the ", jZ.createElement(V, {
                    bold: !0
                }, K.toolName), " tool"), q[7] = K.toolName, q[8] = Y;
                else Y = q[8];
                return Y
            } else return null
    }
}
// @from(Ln 202002, Col 4)
jZ
// @from(Ln 202003, Col 4)
a$A = v(() => {
    i1();
    m1();
    i0();
    jZ = o(X1(), 1)
})
// @from(Ln 202010, Col 0)
function W59(A) {
    let q = e(15),
        {
            orientation: K,
            width: Y,
            dividerChar: z,
            dividerColor: w,
            dividerDimColor: H,
            boxProps: $
        } = A,
        O = K === void 0 ? "horizontal" : K,
        _ = Y === void 0 ? "auto" : Y,
        J = H === void 0 ? !0 : H,
        X = O === "vertical",
        D = z || (X ? "│" : "─");
    if (X) {
        let P;
        if (q[0] !== D) P = {
            topLeft: "",
            top: "",
            topRight: "",
            right: D,
            bottomRight: "",
            bottom: "",
            bottomLeft: "",
            left: ""
        }, q[0] = D, q[1] = P;
        else P = q[1];
        let W;
        if (q[2] !== $ || q[3] !== w || q[4] !== J || q[5] !== P) W = sU.default.createElement(I, {
            height: "100%",
            borderStyle: P,
            borderColor: w,
            borderDimColor: J,
            borderBottom: !1,
            borderTop: !1,
            borderLeft: !1,
            borderRight: !0,
            ...$
        }), q[2] = $, q[3] = w, q[4] = J, q[5] = P, q[6] = W;
        else W = q[6];
        return W
    }
    let j;
    if (q[7] !== D) j = {
        topLeft: "",
        top: "",
        topRight: "",
        right: "",
        bottomRight: "",
        bottom: D,
        bottomLeft: "",
        left: ""
    }, q[7] = D, q[8] = j;
    else j = q[8];
    let M;
    if (q[9] !== $ || q[10] !== w || q[11] !== J || q[12] !== j || q[13] !== _) M = sU.default.createElement(I, {
        width: _,
        borderStyle: j,
        borderColor: w,
        borderDimColor: J,
        flexGrow: 1,
        borderBottom: !0,
        borderTop: !1,
        borderLeft: !1,
        borderRight: !1,
        ...$
    }), q[9] = $, q[10] = w, q[11] = J, q[12] = j, q[13] = _, q[14] = M;
    else M = q[14];
    return M
}
// @from(Ln 202082, Col 0)
function G59(A) {
    let q = e(21),
        {
            orientation: K,
            title: Y,
            width: z,
            padding: w,
            titlePadding: H,
            titleColor: $,
            titleDimColor: O,
            dividerChar: _,
            dividerColor: J,
            dividerDimColor: X,
            boxProps: D
        } = A,
        j = K === void 0 ? "horizontal" : K,
        M = z === void 0 ? "auto" : z,
        P = w === void 0 ? 0 : w,
        W = H === void 0 ? 1 : H,
        G = $ === void 0 ? "text" : $,
        f = O === void 0 ? !0 : O,
        Z = X === void 0 ? !0 : X,
        N = j === "vertical",
        k = _ || (N ? "│" : "─"),
        y;
    if (q[0] !== D || q[1] !== J || q[2] !== Z || q[3] !== j || q[4] !== k) y = sU.default.createElement(W59, {
        orientation: j,
        dividerChar: k,
        dividerColor: J,
        dividerDimColor: Z,
        boxProps: D
    }), q[0] = D, q[1] = J, q[2] = Z, q[3] = j, q[4] = k, q[5] = y;
    else y = q[5];
    let B = y;
    if (N) return B;
    if (!Y) {
        let g;
        if (q[6] !== B || q[7] !== P) g = sU.default.createElement(I, {
            paddingLeft: P,
            paddingRight: P
        }, B), q[6] = B, q[7] = P, q[8] = g;
        else g = q[8];
        return g
    }
    let S;
    if (q[9] !== Y) S = sU.default.createElement(W3, null, Y), q[9] = Y, q[10] = S;
    else S = q[10];
    let m;
    if (q[11] !== S || q[12] !== G || q[13] !== f) m = sU.default.createElement(I, null, sU.default.createElement(V, {
        color: G,
        dimColor: f
    }, S)), q[11] = S, q[12] = G, q[13] = f, q[14] = m;
    else m = q[14];
    let b;
    if (q[15] !== B || q[16] !== P || q[17] !== m || q[18] !== W || q[19] !== M) b = sU.default.createElement(I, {
        flexDirection: "row",
        width: M,
        paddingLeft: P,
        paddingRight: P,
        gap: W
    }, B, m, B), q[15] = B, q[16] = P, q[17] = m, q[18] = W, q[19] = M, q[20] = b;
    else b = q[20];
    return b
}
// @from(Ln 202146, Col 4)
sU
// @from(Ln 202146, Col 8)
CY
// @from(Ln 202147, Col 4)
kW = v(() => {
    i1();
    m1();
    sU = o(X1(), 1);
    CY = G59
})
// @from(Ln 202154, Col 0)
function w8(A) {
    let q = e(11),
        {
            title: K,
            subtitle: Y,
            children: z,
            onCancel: w,
            color: H,
            borderDimColor: $,
            hideInputGuide: O,
            hideBorder: _,
            inputGuide: J,
            isCancelActive: X
        } = A,
        D;
    if (q[0] !== $ || q[1] !== z || q[2] !== H || q[3] !== _ || q[4] !== O || q[5] !== J || q[6] !== X || q[7] !== w || q[8] !== Y || q[9] !== K) D = LW.default.createElement(Z59, {
        title: K,
        subtitle: Y,
        onCancel: w,
        color: H,
        borderDimColor: $,
        hideInputGuide: O,
        hideBorder: _,
        inputGuide: J,
        isCancelActive: X
    }, z), q[0] = $, q[1] = z, q[2] = H, q[3] = _, q[4] = O, q[5] = J, q[6] = X, q[7] = w, q[8] = Y, q[9] = K, q[10] = D;
    else D = q[10];
    return D
}
// @from(Ln 202184, Col 0)
function Z59(A) {
    let q = e(33),
        {
            title: K,
            subtitle: Y,
            children: z,
            onCancel: w,
            color: H,
            borderDimColor: $,
            hideInputGuide: O,
            hideBorder: _,
            inputGuide: J,
            isCancelActive: X
        } = A,
        D = H === void 0 ? "permission" : H,
        j = $ === void 0 ? !0 : $,
        M = X === void 0 ? !0 : X,
        P = uq(),
        W;
    if (q[0] !== M) W = {
        context: "Confirmation",
        isActive: M
    }, q[0] = M, q[1] = W;
    else W = q[1];
    DA("confirm:no", w, W);
    let G;
    if (q[2] !== P.keyName || q[3] !== P.pending) G = P.pending ? LW.default.createElement(V, null, "Press ", P.keyName, " again to exit") : LW.default.createElement(oA, null, LW.default.createElement(YA, {
        shortcut: "Enter",
        action: "confirm"
    }), LW.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })), q[2] = P.keyName, q[3] = P.pending, q[4] = G;
    else G = q[4];
    let f = G,
        Z;
    if (q[5] !== j || q[6] !== D || q[7] !== _) Z = !_ && LW.default.createElement(CY, {
        dividerColor: D,
        dividerDimColor: j
    }), q[5] = j, q[6] = D, q[7] = _, q[8] = Z;
    else Z = q[8];
    let N = _ ? 0 : 1,
        T;
    if (q[9] !== D || q[10] !== K) T = LW.default.createElement(V, {
        bold: !0,
        color: D
    }, K), q[9] = D, q[10] = K, q[11] = T;
    else T = q[11];
    let k;
    if (q[12] !== Y) k = Y && LW.default.createElement(V, {
        dimColor: !0
    }, Y), q[12] = Y, q[13] = k;
    else k = q[13];
    let y;
    if (q[14] !== T || q[15] !== k) y = LW.default.createElement(I, {
        flexDirection: "column"
    }, T, k), q[14] = T, q[15] = k, q[16] = y;
    else y = q[16];
    let B;
    if (q[17] !== z || q[18] !== y || q[19] !== N) B = LW.default.createElement(I, {
        flexDirection: "column",
        paddingX: N,
        gap: 1
    }, y, z), q[17] = z, q[18] = y, q[19] = N, q[20] = B;
    else B = q[20];
    let S;
    if (q[21] !== B || q[22] !== Z) S = LW.default.createElement(I, {
        flexDirection: "column",
        paddingBottom: 1
    }, Z, B), q[21] = B, q[22] = Z, q[23] = S;
    else S = q[23];
    let m;
    if (q[24] !== f || q[25] !== P || q[26] !== _ || q[27] !== O || q[28] !== J) m = !O && LW.default.createElement(I, {
        paddingX: _ ? 0 : 1
    }, LW.default.createElement(V, {
        dimColor: !0,
        italic: !0
    }, J ? J(P) : f)), q[24] = f, q[25] = P, q[26] = _, q[27] = O, q[28] = J, q[29] = m;
    else m = q[29];
    let b;
    if (q[30] !== S || q[31] !== m) b = LW.default.createElement(LW.default.Fragment, null, S, m), q[30] = S, q[31] = m, q[32] = b;
    else b = q[32];
    return b
}
// @from(Ln 202270, Col 4)
LW
// @from(Ln 202271, Col 4)
Bq = v(() => {
    i1();
    m1();
    R2();
    kW();
    wK();
    BK();
    HK();
    K7();
    LW = o(X1(), 1)
})
// @from(Ln 202283, Col 0)
function f59(A) {
    return A === "projectSettings" || A === "policySettings" || A === "command"
}
// @from(Ln 202287, Col 0)
function Xw6(A) {
    return Sx1(A)
}
// @from(Ln 202291, Col 0)
function Rk7(A, q, K) {
    let Y = Xw6(q.source),
        z = Xw6(K.source),
        w = q.ruleValue.toolName;
    if (A === "deny") return `Remove the "${w}" deny rule from ${Y}, or remove the specific allow rule from ${z}`;
    return `Remove the "${w}" ask rule from ${Y}, or remove the specific allow rule from ${z}`
}
// @from(Ln 202299, Col 0)
function V59(A, q, K) {
    let {
        toolName: Y,
        ruleContent: z
    } = A.ruleValue;
    if (z === void 0) return {
        shadowed: !1
    };
    let w = q.find((H) => H.ruleValue.toolName === Y && H.ruleValue.ruleContent === void 0);
    if (!w) return {
        shadowed: !1
    };
    if (Y === h4 && K.sandboxAutoAllowEnabled) {
        if (!f59(w.source)) return {
            shadowed: !1
        }
    }
    return {
        shadowed: !0,
        shadowedBy: w,
        shadowType: "ask"
    }
}
// @from(Ln 202323, Col 0)
function N59(A, q) {
    let {
        toolName: K,
        ruleContent: Y
    } = A.ruleValue;
    if (Y === void 0) return {
        shadowed: !1
    };
    let z = q.find((w) => w.ruleValue.toolName === K && w.ruleValue.ruleContent === void 0);
    if (!z) return {
        shadowed: !1
    };
    return {
        shadowed: !0,
        shadowedBy: z,
        shadowType: "deny"
    }
}
// @from(Ln 202342, Col 0)
function pD1(A, q) {
    let K = [],
        Y = dD1(A),
        z = cD1(A),
        w = tU(A);
    for (let H of Y) {
        let $ = N59(H, w);
        if ($.shadowed) {
            let _ = Xw6($.shadowedBy.source);
            K.push({
                rule: H,
                reason: `Blocked by "${$.shadowedBy.ruleValue.toolName}" deny rule (from ${_})`,
                shadowedBy: $.shadowedBy,
                shadowType: "deny",
                fix: Rk7("deny", $.shadowedBy, H)
            });
            continue
        }
        let O = V59(H, z, q);
        if (O.shadowed) {
            let _ = Xw6(O.shadowedBy.source);
            K.push({
                rule: H,
                reason: `Shadowed by "${O.shadowedBy.ruleValue.toolName}" ask rule (from ${_})`,
                shadowedBy: O.shadowedBy,
                shadowType: "ask",
                fix: Rk7("ask", O.shadowedBy, H)
            })
        }
    }
    return K
}
// @from(Ln 202374, Col 4)
Dw6 = v(() => {
    PJ()
})
// @from(Ln 202378, Col 0)
function s$A(A) {
    switch (A) {
        case "localSettings":
            return {
                label: "Project settings (local)", description: `Saved in ${yO1("localSettings")}`, value: A
            };
        case "projectSettings":
            return {
                label: "Project settings", description: `Checked in at ${yO1("projectSettings")}`, value: A
            };
        case "userSettings":
            return {
                label: "User settings", description: "Saved in at ~/.claude/settings.json", value: A
            }
    }
}
// @from(Ln 202395, Col 0)
function yk7(A) {
    let q = e(24),
        {
            onAddRules: K,
            onCancel: Y,
            ruleValues: z,
            ruleBehavior: w,
            initialContext: H,
            setToolPermissionContext: $
        } = A,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = lD1.map(s$A), q[0] = O;
    else O = q[0];
    let _ = O,
        J;
    if (q[1] !== H || q[2] !== K || q[3] !== Y || q[4] !== w || q[5] !== z || q[6] !== $) J = (N) => {
        if (N === "cancel") {
            Y();
            return
        } else if (lD1.includes(N)) {
            let T = N,
                k = a2(H, {
                    type: "addRules",
                    rules: z,
                    behavior: w,
                    destination: T
                });
            eb({
                type: "addRules",
                rules: z,
                behavior: w,
                destination: T
            }), $(k);
            let y = z.map((b) => ({
                    ruleValue: b,
                    ruleBehavior: w,
                    source: T
                })),
                B = b8.isSandboxingEnabled() && b8.isAutoAllowBashIfSandboxedEnabled(),
                m = pD1(k, {
                    sandboxAutoAllowEnabled: B
                }).filter((b) => z.some((g) => g.toolName === b.rule.ruleValue.toolName && g.ruleContent === b.rule.ruleValue.ruleContent));
            K(y, m.length > 0 ? m : void 0)
        }
    }, q[1] = H, q[2] = K, q[3] = Y, q[4] = w, q[5] = z, q[6] = $, q[7] = J;
    else J = q[7];
    let X = J,
        D = `Add ${w} permission rule${z.length===1?"":"s"}`,
        j;
    if (q[8] !== z) j = z.map(T59), q[8] = z, q[9] = j;
    else j = q[9];
    let M;
    if (q[10] !== j) M = CM.createElement(I, {
        flexDirection: "column",
        paddingX: 2
    }, j), q[10] = j, q[11] = M;
    else M = q[11];
    let P = z.length === 1 ? "Where should this rule be saved?" : "Where should these rules be saved?",
        W;
    if (q[12] !== P) W = CM.createElement(V, null, P), q[12] = P, q[13] = W;
    else W = q[13];
    let G;
    if (q[14] !== X) G = CM.createElement(kA, {
        options: _,
        onChange: X
    }), q[14] = X, q[15] = G;
    else G = q[15];
    let f;
    if (q[16] !== W || q[17] !== G) f = CM.createElement(I, {
        flexDirection: "column",
        marginY: 1
    }, W, G), q[16] = W, q[17] = G, q[18] = f;
    else f = q[18];
    let Z;
    if (q[19] !== Y || q[20] !== M || q[21] !== f || q[22] !== D) Z = CM.createElement(w8, {
        title: D,
        onCancel: Y,
        color: "permission"
    }, M, f), q[19] = Y, q[20] = M, q[21] = f, q[22] = D, q[23] = Z;
    else Z = q[23];
    return Z
}
// @from(Ln 202478, Col 0)
function T59(A) {
    return CM.createElement(I, {
        flexDirection: "column",
        key: M9(A)
    }, CM.createElement(V, {
        bold: !0
    }, M9(A)), CM.createElement(Jw6, {
        ruleValue: A
    }))
}
// @from(Ln 202488, Col 4)
CM
// @from(Ln 202488, Col 8)
lD1
// @from(Ln 202489, Col 4)
jw6 = v(() => {
    i1();
    m1();
    U5();
    CO();
    CO();
    a$A();
    p8();
    Bq();
    Dw6();
    k2();
    CM = o(X1(), 1);
    lD1 = ["localSettings", "projectSettings", "userSettings"]
})
// @from(Ln 202504, Col 0)
function Mw6(A, q, K, Y, z, w, H) {
    Sk7(A, q, K, Y, z, w, H)
}
// @from(Ln 202508, Col 0)
function Pw6(A, q, K, Y, z, w, H) {
    let $ = H?.id || `function-hook-${Date.now()}-${Math.random()}`,
        O = {
            type: "function",
            id: $,
            timeout: H?.timeout || 5000,
            callback: z,
            errorMessage: w
        };
    return Sk7(A, q, K, Y, O), $
}
// @from(Ln 202520, Col 0)
function Sk7(A, q, K, Y, z, w, H) {
    A(($) => {
        let O = $.sessionHooks[q] || {
                hooks: {}
            },
            _ = O.hooks[K] || [],
            J = _.findIndex((j) => j.matcher === Y && j.skillRoot === H),
            X;
        if (J >= 0) {
            X = [..._];
            let j = X[J];
            X[J] = {
                matcher: j.matcher,
                skillRoot: j.skillRoot,
                hooks: [...j.hooks, {
                    hook: z,
                    onHookSuccess: w
                }]
            }
        } else X = [..._, {
            matcher: Y,
            skillRoot: H,
            hooks: [{
                hook: z,
                onHookSuccess: w
            }]
        }];
        let D = {
            ...O.hooks,
            [K]: X
        };
        return {
            ...$,
            sessionHooks: {
                ...$.sessionHooks,
                [q]: {
                    hooks: D
                }
            }
        }
    }), h(`Added session hook for event ${K} in session ${q}`)
}
// @from(Ln 202563, Col 0)
function hk7(A, q, K, Y) {
    A((z) => {
        let w = z.sessionHooks[q];
        if (!w) return z;
        let $ = (w.hooks[K] || []).map((_) => {
                let J = _.hooks.filter((X) => !nD1(X.hook, Y));
                return J.length > 0 ? {
                    ..._,
                    hooks: J
                } : null
            }).filter((_) => _ !== null),
            O = $.length > 0 ? {
                ...w.hooks,
                [K]: $
            } : {
                ...w.hooks
            };
        if ($.length === 0) delete O[K];
        return {
            ...z,
            sessionHooks: {
                ...z.sessionHooks,
                [q]: {
                    ...w,
                    hooks: O
                }
            }
        }
    }), h(`Removed session hook for event ${K} in session ${q}`)
}
// @from(Ln 202594, Col 0)
function Ck7(A) {
    return A.map((q) => ({
        matcher: q.matcher,
        skillRoot: q.skillRoot,
        hooks: q.hooks.map((K) => K.hook).filter((K) => K.type !== "function")
    }))
}
// @from(Ln 202602, Col 0)
function Ww6(A, q, K) {
    let Y = A.sessionHooks[q];
    if (!Y) return new Map;
    let z = new Map;
    if (K) {
        let w = Y.hooks[K];
        if (w) z.set(K, Ck7(w));
        return z
    }
    for (let w of ax) {
        let H = Y.hooks[w];
        if (H) z.set(w, Ck7(H))
    }
    return z
}
// @from(Ln 202618, Col 0)
function Ik7(A, q, K) {
    let Y = A.sessionHooks[q];
    if (!Y) return new Map;
    let z = new Map,
        w = (H) => {
            return H.map(($) => ({
                matcher: $.matcher,
                hooks: $.hooks.map((O) => O.hook).filter((O) => O.type === "function")
            })).filter(($) => $.hooks.length > 0)
        };
    if (K) {
        let H = Y.hooks[K];
        if (H) {
            let $ = w(H);
            if ($.length > 0) z.set(K, $)
        }
        return z
    }
    for (let H of ax) {
        let $ = Y.hooks[H];
        if ($) {
            let O = w($);
            if (O.length > 0) z.set(H, O)
        }
    }
    return z
}
// @from(Ln 202646, Col 0)
function xk7(A, q, K, Y, z) {
    let w = A.sessionHooks[q];
    if (!w) return;
    let H = w.hooks[K];
    if (!H) return;
    for (let $ of H)
        if ($.matcher === Y || Y === "") {
            let O = $.hooks.find((_) => nD1(_.hook, z));
            if (O) return O
        } return
}
// @from(Ln 202658, Col 0)
function iD1(A, q) {
    A((K) => {
        let Y = {
            ...K.sessionHooks
        };
        return delete Y[q], {
            ...K,
            sessionHooks: Y
        }
    }), h(`Cleared all session hooks for session ${q}`)
}
// @from(Ln 202669, Col 4)
eU = v(() => {
    sw1();
    Z6();
    XB()
})
// @from(Ln 202678, Col 0)
function nD1(A, q) {
    if (A.type !== q.type) return !1;
    switch (A.type) {
        case "command":
            return q.type === "command" && A.command === q.command;
        case "prompt":
            return q.type === "prompt" && A.prompt === q.prompt;
        case "agent":
            return q.type === "agent" && A.prompt === q.prompt;
        case "function":
            return !1
    }
}
// @from(Ln 202692, Col 0)
function MZ(A) {
    if ("statusMessage" in A && A.statusMessage) return A.statusMessage;
    switch (A.type) {
        case "command":
            return A.command;
        case "prompt":
            return A.prompt;
        case "agent":
            return A.prompt([]);
        case "callback":
            return "callback";
        case "function":
            return "function"
    }
}
// @from(Ln 202708, Col 0)
function bk7(A) {
    let q = [];
    if (y7("policySettings")?.allowManagedHooksOnly !== !0) {
        let H = ["userSettings", "projectSettings", "localSettings"],
            $ = new Set;
        for (let O of H) {
            let _ = Vw(O);
            if (_) {
                let X = v59(_);
                if ($.has(X)) continue;
                $.add(X)
            }
            let J = y7(O);
            if (!J?.hooks) continue;
            for (let [X, D] of Object.entries(J.hooks))
                for (let j of D)
                    for (let M of j.hooks) q.push({
                        event: X,
                        config: M,
                        matcher: j.matcher,
                        source: O
                    })
        }
    }
    let z = U6(),
        w = Ww6(A, z);
    for (let [H, $] of w.entries())
        for (let O of $)
            for (let _ of O.hooks) q.push({
                event: H,
                config: _,
                matcher: O.matcher,
                source: "sessionHook"
            });
    return q
}
// @from(Ln 202744, Col 0)
async function uk7(A, q, K = "", Y = "userSettings") {
    let w = (y7(Y) ?? {}).hooks ?? {},
        H = w[A] ?? [],
        $ = H.findIndex((X) => X.matcher === K),
        O;
    if ($ >= 0) {
        O = [...H];
        let X = O[$];
        O[$] = {
            matcher: X.matcher,
            hooks: [...X.hooks, q]
        }
    } else O = [...H, {
        matcher: K,
        hooks: [q]
    }];
    let _ = {
            ...w,
            [A]: O
        },
        {
            error: J
        } = Z7(Y, {
            hooks: _
        });
    if (J) throw Error(J.message);
    Dq1()
}
// @from(Ln 202772, Col 0)
async function Bk7(A) {
    if (A.source === "pluginHook") throw Error("Plugin hooks cannot be removed through settings. Disable the plugin instead.");
    if (A.source === "sessionHook") throw Error("Session hooks cannot be removed through settings. They are temporary and will be cleared when the session ends.");
    let q = y7(A.source) ?? {},
        K = q.hooks ?? {},
        z = (K[A.event] ?? []).map(($) => {
            if ($.matcher === A.matcher) {
                let O = $.hooks.filter((_) => !nD1(_, A.config));
                return O.length > 0 ? {
                    ...$,
                    hooks: O
                } : null
            }
            return $
        }).filter(($) => $ !== null),
        w = {
            ...K,
            [A.event]: z.length > 0 ? z : void 0
        },
        H = Object.values(w).some(($) => $ !== void 0);
    Z7(A.source, {
        ...q,
        hooks: H ? w : void 0
    }), Dq1()
}
// @from(Ln 202798, Col 0)
function mk7(A) {
    switch (A) {
        case "userSettings":
            return "User settings (~/.claude/settings.json)";
        case "projectSettings":
            return "Project settings (.claude/settings.json)";
        case "localSettings":
            return "Local settings (.claude/settings.local.json)";
        case "pluginHook":
            return "Plugin hooks (~/.claude/plugins/*/hooks/hooks.json)";
        case "sessionHook":
            return "Session hooks (in-memory, temporary)";
        default:
            return A
    }
}
// @from(Ln 202815, Col 0)
function t$A(A) {
    switch (A) {
        case "userSettings":
            return "User Settings";
        case "projectSettings":
            return "Project Settings";
        case "localSettings":
            return "Local Settings";
        case "pluginHook":
            return "Plugin Hooks";
        case "sessionHook":
            return "Session Hooks";
        default:
            return A
    }
}
// @from(Ln 202832, Col 0)
function Fk7(A) {
    switch (A) {
        case "userSettings":
            return "User";
        case "projectSettings":
            return "Project";
        case "localSettings":
            return "Local";
        case "pluginHook":
            return "Plugin";
        case "sessionHook":
            return "Session";
        default:
            return A
    }
}
// @from(Ln 202849, Col 0)
function Qk7(A, q, K) {
    let Y = lD1.reduce((z, w, H) => {
        return z[w] = H, z
    }, {});
    return [...A].sort((z, w) => {
        let H = q[K]?.[z] || [],
            $ = q[K]?.[w] || [],
            O = Array.from(new Set(H.map((j) => j.source))),
            _ = Array.from(new Set($.map((j) => j.source))),
            J = (j) => j === "pluginHook" ? 999 : Y[j],
            X = Math.min(...O.map(J)),
            D = Math.min(..._.map(J));
        if (X !== D) return X - D;
        return z.localeCompare(w)
    })
}
// @from(Ln 202865, Col 4)
XB = v(() => {
    p8();
    jw6();
    jq1();
    eU();
    B6()
})
// @from(Ln 202873, Col 0)
function e$A() {
    let A = y7("policySettings");
    if (A?.allowManagedHooksOnly === !0) return A.hooks ?? {};
    return C8().hooks ?? {}
}
// @from(Ln 202879, Col 0)
function Ap() {
    return y7("policySettings")?.allowManagedHooksOnly === !0
}
// @from(Ln 202883, Col 0)
function AOA(A) {
    if (!A) return null;
    let q = {},
        K = Object.keys(A).sort();
    for (let Y of K) {
        let z = A[Y];
        if (!z) continue;
        let w = [...z].sort((H, $) => {
            let O = H.matcher || "",
                _ = $.matcher || "";
            return O.localeCompare(_)
        });
        q[Y] = w.map((H) => ({
            matcher: H.matcher,
            hooks: [...H.hooks].sort(($, O) => MZ($).localeCompare(MZ(O)))
        }))
    }
    return q
}
// @from(Ln 202903, Col 0)
function qOA() {
    let A = e$A();
    co = AOA(A)
}
// @from(Ln 202908, Col 0)
function Dq1() {
    GO();
    let A = e$A();
    co = AOA(A)
}
// @from(Ln 202914, Col 0)
function gk7() {
    if (co === null) return null;
    let A = AOA(e$A()),
        q = Q1(co),
        K = Q1(A);
    if (q === K) return null;
    let Y = [],
        z = new Set(Object.keys(co || {})),
        w = new Set(Object.keys(A || {}));
    for (let H of w)
        if (!z.has(H)) Y.push(`Added hooks for event: ${H}`);
    for (let H of z)
        if (!w.has(H)) Y.push(`Removed all hooks for event: ${H}`);
    for (let H of z)
        if (w.has(H)) {
            let $ = co?.[H] || [],
                O = A?.[H] || [];
            if (Q1($) !== Q1(O)) {
                let _ = [],
                    J = new Map($.map((D) => [D.matcher || "", D])),
                    X = new Map(O.map((D) => [D.matcher || "", D]));
                for (let [D] of X)
                    if (!J.has(D)) _.push(`  - Added matcher: ${D||"(no matcher)"}`);
                for (let [D] of J)
                    if (!X.has(D)) _.push(`  - Removed matcher: ${D||"(no matcher)"}`);
                for (let [D, j] of X)
                    if (J.has(D)) {
                        let M = J.get(D);
                        if (Q1(M.hooks) !== Q1(j.hooks)) _.push(`  - Modified hooks for matcher: ${D||"(no matcher)"}`)
                    } if (_.length > 0) Y.push(`Modified hooks for event: ${H}`), Y.push(..._);
                else Y.push(`Modified hooks for event: ${H}`)
            }
        } return Y.length > 0 ? Y.join(`
`) : "Hooks configuration has been modified"
}
// @from(Ln 202950, Col 0)
function Uk7() {
    if (co === null) qOA();
    return co
}
// @from(Ln 202954, Col 4)
co = null
// @from(Ln 202955, Col 4)
jq1 = v(() => {
    p8();
    XB();
    B6();
    m6()
})
// @from(Ln 202962, Col 0)
function Gw6(A, q) {
    GO();
    let K = l4();
    h(`Settings changed from ${A}, updating app state`);
    let Y = Q76();
    Dq1(), q((z) => {
        let w = pk7(z.toolPermissionContext, Y);
        if (w.isBypassPermissionsModeAvailable && rD1()) w = oD1(w);
        return {
            ...z,
            settings: K,
            toolPermissionContext: w
        }
    })
}
// @from(Ln 202977, Col 4)
KOA = v(() => {
    p8();
    Z6();
    PJ();
    KL();
    qp();
    jq1()
})
// @from(Ln 202985, Col 4)
dk7 = () => {}
// @from(Ln 202987, Col 0)
function ck7() {
    return aD1 === !0
}
// @from(Ln 202991, Col 0)
function L59() {
    return process.env.CLAUDE_CODE_ENTRYPOINT ?? "cli"
}
// @from(Ln 202995, Col 0)
function Zw6() {
    return {
        fileStates: new Map,
        sessionBaselines: new Map,
        surface: L59(),
        startingHeadSha: null,
        promptCount: 0,
        promptCountAtLastCommit: 0,
        permissionPromptCount: 0,
        permissionPromptCountAtLastCommit: 0,
        escapeCount: 0,
        escapeCountAtLastCommit: 0
    }
}
// @from(Ln 203009, Col 4)
E59
// @from(Ln 203009, Col 9)
aD1 = null
// @from(Ln 203010, Col 4)
k59
// @from(Ln 203011, Col 4)
Mq1 = v(() => {
    B6();
    _8();
    Z6();
    y6();
    dk7();
    tq();
    e7();
    h9();
    YH1();
    E59 = ["github.com:anthropics/claude-cli-internal", "github.com/anthropics/claude-cli-internal", "github.com:anthropics/anthropic", "github.com/anthropics/anthropic", "github.com:anthropics/apps", "github.com/anthropics/apps", "github.com:anthropics/terraform-config", "github.com/anthropics/terraform-config", "github.com:anthropics/hex-export", "github.com/anthropics/hex-export", "github.com:anthropics/feedback-v2", "github.com/anthropics/feedback-v2"];
    k59 = rb(async () => {
        if (aD1 !== null) return aD1;
        let A = y8(),
            q = await Is1(A);
        if (!q) return aD1 = !1, !1;
        return aD1 = E59.some((K) => q.includes(K)), aD1
    })
})
// @from(Ln 203030, Col 0)
class YOA {
    queue = [];
    waiters = [];
    listeners = new Set;
    _revision = 0;
    get length() {
        return this.queue.length
    }
    get revision() {
        return this._revision
    }
    send(A) {
        this._revision++;
        let q = this.waiters.findIndex((K) => K.fn(A));
        if (q !== -1) {
            let K = this.waiters.splice(q, 1)[0];
            if (K) {
                K.resolve(A), this.notify();
                return
            }
        }
        this.queue.push(A), this.notify()
    }
    poll(A = () => !0) {
        let q = this.queue.findIndex(A);
        if (q === -1) return;
        return this.queue.splice(q, 1)[0]
    }
    receive(A = () => !0) {
        let q = this.queue.findIndex(A);
        if (q !== -1) {
            let K = this.queue.splice(q, 1)[0];
            if (K) return this.notify(), Promise.resolve(K)
        }
        return new Promise((K) => {
            this.waiters.push({
                fn: A,
                resolve: K
            })
        })
    }
    subscribe(A) {
        return this.listeners.add(A), () => {
            this.listeners.delete(A)
        }
    }
    notify() {
        for (let A of this.listeners) A()
    }
}
// @from(Ln 203081, Col 0)
function ik7(A) {
    let q = e(3),
        {
            children: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = new YOA, q[0] = Y;
    else Y = q[0];
    let z = Y,
        w;
    if (q[1] !== K) w = sD1.default.createElement(lk7.Provider, {
        value: z
    }, K), q[1] = K, q[2] = w;
    else w = q[2];
    return w
}
// @from(Ln 203098, Col 0)
function nk7() {
    let A = sD1.useContext(lk7);
    if (!A) throw Error("useMailbox must be used within a MailboxProvider");
    return A
}
// @from(Ln 203103, Col 4)
sD1
// @from(Ln 203103, Col 9)
lk7
// @from(Ln 203104, Col 4)
zOA = v(() => {
    i1();
    sD1 = o(X1(), 1), lk7 = sD1.createContext(void 0)
})
// @from(Ln 203109, Col 0)
function wOA(A, q) {
    if (process.env.MAX_THINKING_TOKENS) {
        let z = parseInt(process.env.MAX_THINKING_TOKENS, 10);
        if (z > 0) c("tengu_thinking", {
            provider: qb(),
            tokenCount: z
        });
        return z
    }
    let Y = A.filter((z) => z.type === "user" && !z.isMeta).map(R59).filter((z) => z !== void 0);
    if (q !== void 0) return Math.max(...Y, q);
    if (Y.length > 0) return Math.max(...Y);
    return
}
// @from(Ln 203124, Col 0)
function R59(A) {
    if (A.isMeta) return 0;
    if (A.thinkingMetadata) {
        let {
            maxThinkingTokens: q
        } = A.thinkingMetadata;
        if (q !== void 0 && q > 0) c("tengu_thinking", {
            provider: qb(),
            tokenCount: q
        });
        return q
    }
    return 0
}
// @from(Ln 203139, Col 0)
function rk7(A) {
    let q = [],
        K = A.matchAll(y59);
    for (let Y of K)
        if (Y.index !== void 0) q.push({
            word: Y[0],
            start: Y.index,
            end: Y.index + Y[0].length
        });
    return q
}
// @from(Ln 203151, Col 0)
function C59(A) {
    let q = A.toLowerCase(),
        K = E4();
    if (K === "foundry" || K === "firstParty") return !q.includes("claude-3-");
    return q.includes("sonnet-4") || q.includes("opus-4")
}
// @from(Ln 203158, Col 0)
function ok7(A) {
    return A.toLowerCase().includes("opus-4-6")
}
// @from(Ln 203162, Col 0)
function fw6() {
    if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
    let {
        settings: A
    } = E81();
    if (A.alwaysThinkingEnabled === !1) return !1;
    return C59(l3())
}
// @from(Ln 203170, Col 4)
y59
// @from(Ln 203171, Col 4)
tD1 = v(() => {
    u6();
    UH();
    p8();
    e7();
    y59 = /\bultrathink\b/gi
})
// @from(Ln 203187, Col 0)
function HOA() {
    return !1
}
// @from(Ln 203190, Col 0)
async function h59(A, q, K) {
    if (!HOA()) return await K();
    let Y = tk7("sha1").update(Q1(A)).digest("hex").slice(0, 12),
        z = ek7(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? h6(), `fixtures/${q}-${Y}.json`);
    if (b1().existsSync(z)) return _A(b1().readFileSync(z, {
        encoding: "utf8"
    }));
    if (xA.isCI) throw Error(`Fixture missing: ${z}. Re-run npm test locally, then commit the result.`);
    let w = await K();
    if (!b1().existsSync(Vw6(z))) b1().mkdirSync(Vw6(z));
    return c8(z, Q1(w, null, 2), {
        encoding: "utf8",
        flush: !1
    }), w
}
// @from(Ln 203205, Col 0)
async function Tw6(A, q) {
    if (!HOA()) return await q();
    let K = WJ(A.filter((H) => {
            if (H.type !== "user") return !0;
            if (H.isMeta) return !1;
            return !0
        })),
        Y = x59(K.map((H) => H.message.content), sk7),
        z = ek7(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? h6(), `fixtures/${Y.map((H)=>tk7("sha1").update(Q1(H)).digest("hex").slice(0,6)).join("-")}.json`);
    if (b1().existsSync(z)) {
        let H = _A(b1().readFileSync(z, {
            encoding: "utf8"
        }));
        return H.output.forEach(I59), H.output.map(($, O) => ak7($, u59, O, S59()))
    }
    if (xA.isCI) throw Error(`Anthropic API fixture missing: ${z}. Re-run npm test locally, then commit the result. Input messages:
${Q1(Y,null,2)}`);
    let w = await q();
    if (xA.isCI) return w;
    if (!b1().existsSync(Vw6(z))) b1().mkdirSync(Vw6(z));
    return c8(z, Q1({
        input: Y,
        output: w.map((H, $) => ak7(H, sk7, $))
    }, null, 2), {
        encoding: "utf8",
        flush: !1
    }), w
}
// @from(Ln 203234, Col 0)
function I59(A) {
    if (A.type === "stream_event") return;
    let q = A.message.model,
        K = A.message.usage,
        Y = bq6(q, K);
    Sq6(Y, K, q)
}
// @from(Ln 203242, Col 0)
function x59(A, q) {
    return A.map((K) => {
        if (typeof K === "string") return q(K);
        return K.map((Y) => {
            switch (Y.type) {
                case "tool_result":
                    if (typeof Y.content === "string") return {
                        ...Y,
                        content: q(Y.content)
                    };
                    if (Array.isArray(Y.content)) return {
                        ...Y,
                        content: Y.content.map((z) => {
                            switch (z.type) {
                                case "text":
                                    return {
                                        ...z, text: q(z.text)
                                    };
                                case "image":
                                    return z;
                                default:
                                    return
                            }
                        })
                    };
                    return Y;
                case "text":
                    return {
                        ...Y, text: q(Y.text)
                    };
                case "tool_use":
                    return {
                        ...Y, input: Nw6(Y.input, q)
                    };
                case "image":
                    return Y;
                default:
                    return
            }
        })
    })
}
// @from(Ln 203285, Col 0)
function Nw6(A, q) {
    return G61(A, (K, Y) => {
        if (Array.isArray(K)) return K.map((z) => Nw6(z, q));
        if (z21(K)) return Nw6(K, q);
        return q(K, Y, A)
    })
}
// @from(Ln 203293, Col 0)
function b59(A, q, K, Y) {
    return {
        uuid: Y ?? `UUID-${K}`,
        requestId: "REQUEST_ID",
        timestamp: A.timestamp,
        message: {
            ...A.message,
            content: A.message.content.map((z) => {
                switch (z.type) {
                    case "text":
                        return {
                            ...z, text: q(z.text), citations: z.citations || []
                        };
                    case "tool_use":
                        return {
                            ...z, input: Nw6(z.input, q)
                        };
                    default:
                        return z
                }
            }).filter(Boolean)
        },
        type: "assistant"
    }
}
// @from(Ln 203319, Col 0)
function ak7(A, q, K, Y) {
    if (A.type === "assistant") return b59(A, q, K, Y);
    else return A
}
// @from(Ln 203324, Col 0)
function sk7(A) {
    if (typeof A !== "string") return A;
    let q = h6(),
        K = O8(),
        Y = A.replace(/num_files="\d+"/g, 'num_files="[NUM]"').replace(/duration_ms="\d+"/g, 'duration_ms="[DURATION]"').replace(/cost_usd="\d+"/g, 'cost_usd="[COST]"').replaceAll(K, "[CONFIG_HOME]").replaceAll(q, "[CWD]").replace(/Available commands:.+/, "Available commands: [COMMANDS]");
    if (process.platform === "win32") {
        let z = q.replaceAll("\\", "/"),
            w = K.replaceAll("\\", "/"),
            H = Q1(q).slice(1, -1),
            $ = Q1(K).slice(1, -1);
        Y = Y.replaceAll(H, "[CWD]").replaceAll($, "[CONFIG_HOME]").replaceAll(z, "[CWD]").replaceAll(w, "[CONFIG_HOME]")
    }
    if (Y = Y.replace(/\[CWD\][^\s"'<>]*/g, (z) => z.replaceAll("\\\\", "/").replaceAll("\\", "/")).replace(/\[CONFIG_HOME\][^\s"'<>]*/g, (z) => z.replaceAll("\\\\", "/").replaceAll("\\", "/")), Y.includes("Files modified by user:")) return "Files modified by user: [FILES]";
    return Y
}
// @from(Ln 203340, Col 0)
function u59(A) {
    if (typeof A !== "string") return A;
    return A.replaceAll("[NUM]", "1").replaceAll("[DURATION]", "100").replaceAll("[CONFIG_HOME]", O8()).replaceAll("[CWD]", h6())
}
// @from(Ln 203344, Col 0)
async function* $OA(A, q) {
    if (!HOA()) return yield* q();
    let K = [],
        Y = await Tw6(A, async () => {
            for await (let z of q()) K.push(z);
            return K
        });
    if (Y.length > 0) {
        yield* Y;
        return
    }
    yield* K
}
// @from(Ln 203357, Col 0)
async function AL7(A, q, K) {
    return (await h59({
        messages: A,
        tools: q
    }, "token-count", async () => ({
        tokenCount: await K()
    }))).tokenCount
}
// @from(Ln 203365, Col 4)
OOA = v(() => {
    G5();
    N7();
    hA();
    _8();
    m6();
    pn1();
    rn1();
    N8();
    F_1();
    DL();
    m6()
})
// @from(Ln 203379, Col 0)
function YL7(A) {
    for (let q of A)
        if (q.role === "assistant" && Array.isArray(q.content)) {
            for (let K of q.content)
                if (typeof K === "object" && K !== null && "type" in K && (K.type === "thinking" || K.type === "redacted_thinking")) return !0
        } return !1
}
// @from(Ln 203387, Col 0)
function B59(A) {
    return A.map((q) => {
        if (!Array.isArray(q.content)) return q;
        let K = q.content.map((Y) => {
            if (Y.type === "tool_use") {
                let z = Y;
                return {
                    type: "tool_use",
                    id: z.id,
                    name: z.name,
                    input: z.input
                }
            }
            if (Y.type === "tool_result") {
                let z = Y;
                if (Array.isArray(z.content)) {
                    let w = z.content.filter((H) => !Kp(H));
                    if (w.length === 0) return {
                        ...z,
                        content: [{
                            type: "text",
                            text: "[tool references]"
                        }]
                    };
                    if (w.length !== z.content.length) return {
                        ...z,
                        content: w
                    }
                }
            }
            return Y
        });
        return {
            ...q,
            content: K
        }
    })
}
// @from(Ln 203425, Col 0)
async function zL7(A) {
    if (!A) return 0;
    return hx1([{
        role: "user",
        content: A
    }], [])
}
// @from(Ln 203432, Col 0)
async function hx1(A, q) {
    return AL7(A, q, async () => {
        try {
            let K = l3(),
                Y = vT(K),
                z = YL7(A);
            if (E4() === "bedrock") return Q59({
                model: dg(K),
                messages: A,
                tools: q,
                betas: Y,
                containsThinking: z
            });
            let w = await US({
                    maxRetries: 1,
                    model: K
                }),
                H = E4() === "vertex" ? Y.filter((O) => _L6.has(O)) : Y,
                $ = await w.beta.messages.countTokens({
                    model: dg(K),
                    messages: A.length > 0 ? A : [{
                        role: "user",
                        content: "foo"
                    }],
                    tools: q,
                    ...H.length > 0 ? {
                        betas: H
                    } : {},
                    ...z ? {
                        thinking: {
                            type: "enabled",
                            budget_tokens: _OA
                        }
                    } : {}
                });
            if (typeof $.input_tokens !== "number") return null;
            return $.input_tokens
        } catch (K) {
            return K1(K), null
        }
    })
}
// @from(Ln 203475, Col 0)
function A2(A, q = 4) {
    return Math.round(A.length / q)
}
// @from(Ln 203479, Col 0)
function m59(A) {
    switch (A) {
        case "json":
        case "jsonl":
        case "jsonc":
            return 2;
        default:
            return 4
    }
}
// @from(Ln 203490, Col 0)
function wL7(A, q) {
    return A2(A, m59(q))
}
// @from(Ln 203493, Col 0)
async function HL7(A, q) {
    let K = YL7(A),
        Y = J6(process.env.CLAUDE_CODE_USE_VERTEX) && un1(_J()) === "global",
        z = J6(process.env.CLAUDE_CODE_USE_BEDROCK) && K,
        w = J6(process.env.CLAUDE_CODE_USE_VERTEX) && K,
        H = Y || z || w ? jL() : _J(),
        $ = await US({
            maxRetries: 1,
            model: H
        }),
        O = B59(A),
        _ = O.length > 0 ? O : [{
            role: "user",
            content: "count"
        }],
        J = vT(H),
        X = E4() === "vertex" ? J.filter((G) => _L6.has(G)) : J,
        j = (await $.beta.messages.create({
            model: dg(H),
            max_tokens: K ? KL7 : 1,
            messages: _,
            tools: q.length > 0 ? q : void 0,
            ...X.length > 0 ? {
                betas: X
            } : {},
            metadata: ko(),
            ...vw6(),
            ...K ? {
                thinking: {
                    type: "enabled",
                    budget_tokens: _OA
                }
            } : {}
        })).usage,
        M = j.input_tokens,
        P = j.cache_creation_input_tokens || 0,
        W = j.cache_read_input_tokens || 0;
    return M + P + W
}
// @from(Ln 203533, Col 0)
function JOA(A) {
    let q = 0;
    for (let K of A) q += XOA(K);
    return q
}
// @from(Ln 203539, Col 0)
function XOA(A) {
    if ((A.type === "assistant" || A.type === "user") && A.message?.content) return $L7(A.message?.content);
    if (A.type === "attachment" && A.attachment) return A2(Q1(A.attachment));
    return 0
}
// @from(Ln 203545, Col 0)
function $L7(A) {
    if (!A) return 0;
    if (typeof A === "string") return A2(A);
    let q = 0;
    for (let K of A) q += F59(K);
    return q
}
// @from(Ln 203553, Col 0)
function F59(A) {
    if (typeof A === "string") return A2(A);
    if (A.type === "text") return A2(A.text);
    if (A.type === "image") return 2000;
    if (A.type === "tool_result") return $L7(A.content);
    return 0
}
// @from(Ln 203560, Col 0)
async function Q59({
    model: A,
    messages: q,
    tools: K,
    betas: Y,
    containsThinking: z
}) {
    try {
        let w = await pl8(),
            H = v1A(A) ? A : await d86(A);
        if (!H) return null;
        let $ = {
                anthropic_version: "bedrock-2023-05-31",
                messages: q.length > 0 ? q : [{
                    role: "user",
                    content: "foo"
                }],
                max_tokens: z ? KL7 : 1,
                ...K.length > 0 ? {
                    tools: K
                } : {},
                ...Y.length > 0 ? {
                    anthropic_beta: Y
                } : {},
                ...z ? {
                    thinking: {
                        type: "enabled",
                        budget_tokens: _OA
                    }
                } : {}
            },
            O = {
                modelId: H,
                input: {
                    invokeModel: {
                        body: new TextEncoder().encode(Q1($))
                    }
                }
            };
        return (await w.send(new qL7.CountTokensCommand(O))).inputTokens ?? null
    } catch (w) {
        return K1(w), null
    }
}
// @from(Ln 203604, Col 4)
qL7
// @from(Ln 203604, Col 9)
_OA = 1024
// @from(Ln 203605, Col 4)
KL7 = 2048
// @from(Ln 203606, Col 4)
vv = v(() => {
    Ax1();
    y6();
    e7();
    Wk();
    e11();
    yw();
    hA();
    OOA();
    UH();
    sL1();
    oL();
    m6();
    qL7 = o(p86(), 1)
})
// @from(Ln 203622, Col 0)
function Yp(A) {
    if (A?.type === "assistant" && "usage" in A.message && !(A.message.content[0]?.type === "text" && DOA.has(A.message.content[0].text)) && A.message.model !== eD1) return A.message.usage;
    return
}
// @from(Ln 203627, Col 0)
function Ix1(A) {
    return A.input_tokens + (A.cache_creation_input_tokens ?? 0) + (A.cache_read_input_tokens ?? 0) + A.output_tokens
}
// @from(Ln 203631, Col 0)
function PZ(A) {
    let q = A.length - 1;
    while (q >= 0) {
        let K = A[q],
            Y = K ? Yp(K) : void 0;
        if (Y) return Ix1(Y);
        q--
    }
    return 0
}
// @from(Ln 203642, Col 0)
function Ew6(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q],
            Y = K ? Yp(K) : void 0;
        if (Y) return {
            input_tokens: Y.input_tokens,
            output_tokens: Y.output_tokens,
            cache_creation_input_tokens: Y.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: Y.cache_read_input_tokens ?? 0
        }
    }
    return null
}
// @from(Ln 203656, Col 0)
function kw6(A) {
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "assistant") {
            let z = Yp(Y);
            if (z) return Ix1(z) > 200000;
            return !1
        }
    }
    return !1
}
// @from(Ln 203668, Col 0)
function OL7(A) {
    if (A < 1000) return `~${A}`;
    return `~${(A/1000).toFixed(1)}k`
}
// @from(Ln 203673, Col 0)
function Lw6(A) {
    let q = 0;
    for (let K of A.message.content)
        if (K.type === "text") q += K.text.length;
        else if (K.type === "thinking") q += K.thinking.length;
    else if (K.type === "redacted_thinking") q += K.data.length;
    else if (K.type === "tool_use") q += Q1(K.input).length;
    return q
}
// @from(Ln 203683, Col 0)
function Ev(A) {
    let q = A.length - 1;
    while (q >= 0) {
        let K = A[q],
            Y = K ? Yp(K) : void 0;
        if (Y) return Ix1(Y) + JOA(A.slice(q + 1));
        q--
    }
    return JOA(A)
}
// @from(Ln 203693, Col 4)
RW = v(() => {
    N8();
    vv();
    m6()
})
// @from(Ln 203698, Col 0)
class n0 {
    diff(A, q, K = {}) {
        let Y;
        if (typeof K === "function") Y = K, K = {};
        else if ("callback" in K) Y = K.callback;
        let z = this.castInput(A, K),
            w = this.castInput(q, K),
            H = this.removeEmpty(this.tokenize(z, K)),
            $ = this.removeEmpty(this.tokenize(w, K));
        return this.diffWithOptionsObj(H, $, K, Y)
    }
    diffWithOptionsObj(A, q, K, Y) {
        var z;
        let w = (G) => {
                if (G = this.postProcess(G, K), Y) {
                    setTimeout(function() {
                        Y(G)
                    }, 0);
                    return
                } else return G
            },
            H = q.length,
            $ = A.length,
            O = 1,
            _ = H + $;
        if (K.maxEditLength != null) _ = Math.min(_, K.maxEditLength);
        let J = (z = K.timeout) !== null && z !== void 0 ? z : 1 / 0,
            X = Date.now() + J,
            D = [{
                oldPos: -1,
                lastComponent: void 0
            }],
            j = this.extractCommon(D[0], q, A, 0, K);
        if (D[0].oldPos + 1 >= $ && j + 1 >= H) return w(this.buildValues(D[0].lastComponent, q, A));
        let M = -1 / 0,
            P = 1 / 0,
            W = () => {
                for (let G = Math.max(M, -O); G <= Math.min(P, O); G += 2) {
                    let f, Z = D[G - 1],
                        N = D[G + 1];
                    if (Z) D[G - 1] = void 0;
                    let T = !1;
                    if (N) {
                        let y = N.oldPos - G;
                        T = N && 0 <= y && y < H
                    }
                    let k = Z && Z.oldPos + 1 < $;
                    if (!T && !k) {
                        D[G] = void 0;
                        continue
                    }
                    if (!k || T && Z.oldPos < N.oldPos) f = this.addToPath(N, !0, !1, 0, K);
                    else f = this.addToPath(Z, !1, !0, 1, K);
                    if (j = this.extractCommon(f, q, A, G, K), f.oldPos + 1 >= $ && j + 1 >= H) return w(this.buildValues(f.lastComponent, q, A)) || !0;
                    else {
                        if (D[G] = f, f.oldPos + 1 >= $) P = Math.min(P, G - 1);
                        if (j + 1 >= H) M = Math.max(M, G + 1)
                    }
                }
                O++
            };
        if (Y)(function G() {
            setTimeout(function() {
                if (O > _ || Date.now() > X) return Y(void 0);
                if (!W()) G()
            }, 0)
        })();
        else
            while (O <= _ && Date.now() <= X) {
                let G = W();
                if (G) return G
            }
    }
    addToPath(A, q, K, Y, z) {
        let w = A.lastComponent;
        if (w && !z.oneChangePerToken && w.added === q && w.removed === K) return {
            oldPos: A.oldPos + Y,
            lastComponent: {
                count: w.count + 1,
                added: q,
                removed: K,
                previousComponent: w.previousComponent
            }
        };
        else return {
            oldPos: A.oldPos + Y,
            lastComponent: {
                count: 1,
                added: q,
                removed: K,
                previousComponent: w
            }
        }
    }
    extractCommon(A, q, K, Y, z) {
        let w = q.length,
            H = K.length,
            $ = A.oldPos,
            O = $ - Y,
            _ = 0;
        while (O + 1 < w && $ + 1 < H && this.equals(K[$ + 1], q[O + 1], z))
            if (O++, $++, _++, z.oneChangePerToken) A.lastComponent = {
                count: 1,
                previousComponent: A.lastComponent,
                added: !1,
                removed: !1
            };
        if (_ && !z.oneChangePerToken) A.lastComponent = {
            count: _,
            previousComponent: A.lastComponent,
            added: !1,
            removed: !1
        };
        return A.oldPos = $, O
    }
    equals(A, q, K) {
        if (K.comparator) return K.comparator(A, q);
        else return A === q || !!K.ignoreCase && A.toLowerCase() === q.toLowerCase()
    }
    removeEmpty(A) {
        let q = [];
        for (let K = 0; K < A.length; K++)
            if (A[K]) q.push(A[K]);
        return q
    }
    castInput(A, q) {
        return A
    }
    tokenize(A, q) {
        return Array.from(A)
    }
    join(A) {
        return A.join("")
    }
    postProcess(A, q) {
        return A
    }
    get useLongestToken() {
        return !1
    }
    buildValues(A, q, K) {
        let Y = [],
            z;
        while (A) Y.push(A), z = A.previousComponent, delete A.previousComponent, A = z;
        Y.reverse();
        let w = Y.length,
            H = 0,
            $ = 0,
            O = 0;
        for (; H < w; H++) {
            let _ = Y[H];
            if (!_.removed) {
                if (!_.added && this.useLongestToken) {
                    let J = q.slice($, $ + _.count);
                    J = J.map(function(X, D) {
                        let j = K[O + D];
                        return j.length > X.length ? j : X
                    }), _.value = this.join(J)
                } else _.value = this.join(q.slice($, $ + _.count));
                if ($ += _.count, !_.added) O += _.count
            } else _.value = this.join(K.slice(O, O + _.count)), O += _.count
        }
        return Y
    }
}
// @from(Ln 203863, Col 4)
_L7
// @from(Ln 203863, Col 9)
g59
// @from(Ln 203864, Col 4)
JL7 = v(() => {
    _L7 = class _L7 extends n0 {};
    g59 = new _L7
})
// @from(Ln 203869, Col 0)
function jOA(A, q) {
    let K;
    for (K = 0; K < A.length && K < q.length; K++)
        if (A[K] != q[K]) return A.slice(0, K);
    return A.slice(0, K)
}
// @from(Ln 203876, Col 0)
function MOA(A, q) {
    let K;
    if (!A || !q || A[A.length - 1] != q[q.length - 1]) return "";
    for (K = 0; K < A.length && K < q.length; K++)
        if (A[A.length - (K + 1)] != q[q.length - (K + 1)]) return A.slice(-K);
    return A.slice(-K)
}
// @from(Ln 203884, Col 0)
function Rw6(A, q, K) {
    if (A.slice(0, q.length) != q) throw Error(`string ${JSON.stringify(A)} doesn't start with prefix ${JSON.stringify(q)}; this is a bug`);
    return K + A.slice(q.length)
}
// @from(Ln 203889, Col 0)
function yw6(A, q, K) {
    if (!q) return A + K;
    if (A.slice(-q.length) != q) throw Error(`string ${JSON.stringify(A)} doesn't end with suffix ${JSON.stringify(q)}; this is a bug`);
    return A.slice(0, -q.length) + K
}
// @from(Ln 203895, Col 0)
function A01(A, q) {
    return Rw6(A, q, "")
}
// @from(Ln 203899, Col 0)
function xx1(A, q) {
    return yw6(A, q, "")
}
// @from(Ln 203903, Col 0)
function POA(A, q) {
    return q.slice(0, U59(A, q))
}
// @from(Ln 203907, Col 0)
function U59(A, q) {
    let K = 0;
    if (A.length > q.length) K = A.length - q.length;
    let Y = q.length;
    if (A.length < q.length) Y = A.length;
    let z = Array(Y),
        w = 0;
    z[0] = 0;
    for (let H = 1; H < Y; H++) {
        if (q[H] == q[w]) z[H] = z[w];
        else z[H] = w;
        while (w > 0 && q[H] != q[w]) w = z[w];
        if (q[H] == q[w]) w++
    }
    w = 0;
    for (let H = K; H < A.length; H++) {
        while (w > 0 && A[H] != q[w]) w = z[w];
        if (A[H] == q[w]) w++
    }
    return w
}
// @from(Ln 203929, Col 0)
function q01(A) {
    let q;
    for (q = A.length - 1; q >= 0; q--)
        if (!A[q].match(/\s/)) break;
    return A.substring(q + 1)
}
// @from(Ln 203936, Col 0)
function zp(A) {
    let q = A.match(/^\s*/);
    return q ? q[0] : ""
}
// @from(Ln 203941, Col 0)
function XL7(A, q, K, Y) {
    if (q && K) {
        let z = zp(q.value),
            w = q01(q.value),
            H = zp(K.value),
            $ = q01(K.value);
        if (A) {
            let O = jOA(z, H);
            A.value = yw6(A.value, H, O), q.value = A01(q.value, O), K.value = A01(K.value, O)
        }
        if (Y) {
            let O = MOA(w, $);
            Y.value = Rw6(Y.value, $, O), q.value = xx1(q.value, O), K.value = xx1(K.value, O)
        }
    } else if (K) {
        if (A) {
            let z = zp(K.value);
            K.value = K.value.substring(z.length)
        }
        if (Y) {
            let z = zp(Y.value);
            Y.value = Y.value.substring(z.length)
        }
    } else if (A && Y) {
        let z = zp(Y.value),
            w = zp(q.value),
            H = q01(q.value),
            $ = jOA(z, w);
        q.value = A01(q.value, $);
        let O = MOA(A01(z, $), H);
        q.value = xx1(q.value, O), Y.value = Rw6(Y.value, z, O), A.value = yw6(A.value, z, z.slice(0, z.length - O.length))
    } else if (Y) {
        let z = zp(Y.value),
            w = q01(q.value),
            H = POA(w, z);
        q.value = xx1(q.value, H)
    } else if (A) {
        let z = q01(A.value),
            w = zp(q.value),
            H = POA(z, w);
        q.value = A01(q.value, H)
    }
}
// @from(Ln 203985, Col 0)
function WOA(A, q, K) {
    return ML7.diff(A, q, K)
}
// @from(Ln 203988, Col 4)
Cw6 = "a-zA-Z0-9_\\u{AD}\\u{C0}-\\u{D6}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}"
// @from(Ln 203989, Col 4)
p59
// @from(Ln 203989, Col 9)
DL7
// @from(Ln 203989, Col 14)
d59
// @from(Ln 203989, Col 19)
jL7
// @from(Ln 203989, Col 24)
ML7
// @from(Ln 203990, Col 4)
PL7 = v(() => {
    p59 = new RegExp(`[${Cw6}]+|\\s+|[^${Cw6}]`, "ug");
    DL7 = class DL7 extends n0 {
        equals(A, q, K) {
            if (K.ignoreCase) A = A.toLowerCase(), q = q.toLowerCase();
            return A.trim() === q.trim()
        }
        tokenize(A, q = {}) {
            let K;
            if (q.intlSegmenter) {
                let w = q.intlSegmenter;
                if (w.resolvedOptions().granularity != "word") throw Error('The segmenter passed must have a granularity of "word"');
                K = [];
                for (let H of Array.from(w.segment(A))) {
                    let $ = H.segment;
                    if (K.length && /\s/.test(K[K.length - 1]) && /\s/.test($)) K[K.length - 1] += $;
                    else K.push($)
                }
            } else K = A.match(p59) || [];
            let Y = [],
                z = null;
            return K.forEach((w) => {
                if (/\s/.test(w))
                    if (z == null) Y.push(w);
                    else Y.push(Y.pop() + w);
                else if (z != null && /\s/.test(z))
                    if (Y[Y.length - 1] == z) Y.push(Y.pop() + w);
                    else Y.push(z + w);
                else Y.push(w);
                z = w
            }), Y
        }
        join(A) {
            return A.map((q, K) => {
                if (K == 0) return q;
                else return q.replace(/^\s+/, "")
            }).join("")
        }
        postProcess(A, q) {
            if (!A || q.oneChangePerToken) return A;
            let K = null,
                Y = null,
                z = null;
            if (A.forEach((w) => {
                    if (w.added) Y = w;
                    else if (w.removed) z = w;
                    else {
                        if (Y || z) XL7(K, z, Y, w);
                        K = w, Y = null, z = null
                    }
                }), Y || z) XL7(K, z, Y, null);
            return A
        }
    };
    d59 = new DL7;
    jL7 = class jL7 extends n0 {
        tokenize(A) {
            let q = new RegExp(`(\\r?\\n)|[${Cw6}]+|[^\\S\\n\\r]+|[^${Cw6}]`, "ug");
            return A.match(q) || []
        }
    };
    ML7 = new jL7
})
// @from(Ln 204054, Col 0)
function lo(A, q, K) {
    return GL7.diff(A, q, K)
}
// @from(Ln 204058, Col 0)
function GOA(A, q) {
    if (q.stripTrailingCr) A = A.replace(/\r\n/g, `
`);
    let K = [],
        Y = A.split(/(\n|\r\n)/);
    if (!Y[Y.length - 1]) Y.pop();
    for (let z = 0; z < Y.length; z++) {
        let w = Y[z];
        if (z % 2 && !q.newlineIsToken) K[K.length - 1] += w;
        else K.push(w)
    }
    return K
}
// @from(Ln 204071, Col 4)
WL7
// @from(Ln 204071, Col 9)
GL7
// @from(Ln 204072, Col 4)
Sw6 = v(() => {
    WL7 = class WL7 extends n0 {
        constructor() {
            super(...arguments);
            this.tokenize = GOA
        }
        equals(A, q, K) {
            if (K.ignoreWhitespace) {
                if (!K.newlineIsToken || !A.includes(`
`)) A = A.trim();
                if (!K.newlineIsToken || !q.includes(`
`)) q = q.trim()
            } else if (K.ignoreNewlineAtEof && !K.newlineIsToken) {
                if (A.endsWith(`
`)) A = A.slice(0, -1);
                if (q.endsWith(`
`)) q = q.slice(0, -1)
            }
            return super.equals(A, q, K)
        }
    };
    GL7 = new WL7
})
// @from(Ln 204096, Col 0)
function c59(A) {
    return A == "." || A == "!" || A == "?"
}
// @from(Ln 204099, Col 4)
ZL7
// @from(Ln 204099, Col 9)
l59
// @from(Ln 204100, Col 4)
fL7 = v(() => {
    ZL7 = class ZL7 extends n0 {
        tokenize(A) {
            var q;
            let K = [],
                Y = 0;
            for (let z = 0; z < A.length; z++) {
                if (z == A.length - 1) {
                    K.push(A.slice(Y));
                    break
                }
                if (c59(A[z]) && A[z + 1].match(/\s/)) {
                    K.push(A.slice(Y, z + 1)), z = Y = z + 1;
                    while ((q = A[z + 1]) === null || q === void 0 ? void 0 : q.match(/\s/)) z++;
                    K.push(A.slice(Y, z + 1)), Y = z + 1
                }
            }
            return K
        }
    };
    l59 = new ZL7
})
// @from(Ln 204122, Col 4)
VL7
// @from(Ln 204122, Col 9)
i59
// @from(Ln 204123, Col 4)
NL7 = v(() => {
    VL7 = class VL7 extends n0 {
        tokenize(A) {
            return A.split(/([{}:;,]|\s+)/)
        }
    };
    i59 = new VL7
})
// @from(Ln 204132, Col 0)
function hw6(A, q, K, Y, z) {
    if (q = q || [], K = K || [], Y) A = Y(z === void 0 ? "" : z, A);
    let w;
    for (w = 0; w < q.length; w += 1)
        if (q[w] === A) return K[w];
    let H;
    if (Object.prototype.toString.call(A) === "[object Array]") {
        q.push(A), H = Array(A.length), K.push(H);
        for (w = 0; w < A.length; w += 1) H[w] = hw6(A[w], q, K, Y, String(w));
        return q.pop(), K.pop(), H
    }
    if (A && A.toJSON) A = A.toJSON();
    if (typeof A === "object" && A !== null) {
        q.push(A), H = {}, K.push(H);
        let $ = [],
            O;
        for (O in A)
            if (Object.prototype.hasOwnProperty.call(A, O)) $.push(O);
        $.sort();
        for (w = 0; w < $.length; w += 1) O = $[w], H[O] = hw6(A[O], q, K, Y, O);
        q.pop(), K.pop()
    } else H = A;
    return H
}
// @from(Ln 204156, Col 4)
TL7
// @from(Ln 204156, Col 9)
n59
// @from(Ln 204157, Col 4)
vL7 = v(() => {
    Sw6();
    TL7 = class TL7 extends n0 {
        constructor() {
            super(...arguments);
            this.tokenize = GOA
        }
        get useLongestToken() {
            return !0
        }
        castInput(A, q) {
            let {
                undefinedReplacement: K,
                stringifyReplacer: Y = (z, w) => typeof w > "u" ? K : w
            } = q;
            return typeof A === "string" ? A : JSON.stringify(hw6(A, null, null, Y), null, "  ")
        }
        equals(A, q, K) {
            return super.equals(A.replace(/,([\r\n])/g, "$1"), q.replace(/,([\r\n])/g, "$1"), K)
        }
    };
    n59 = new TL7
})
// @from(Ln 204180, Col 4)
EL7
// @from(Ln 204180, Col 9)
r59
// @from(Ln 204181, Col 4)
kL7 = v(() => {
    EL7 = class EL7 extends n0 {
        tokenize(A) {
            return A.slice()
        }
        join(A) {
            return A
        }
        removeEmpty(A) {
            return A
        }
    };
    r59 = new EL7
})
// @from(Ln 204195, Col 4)
LL7 = () => {}
// @from(Ln 204197, Col 0)
function io(A, q, K, Y, z, w, H) {
    let $;
    if (!H) $ = {};
    else if (typeof H === "function") $ = {
        callback: H
    };
    else $ = H;
    if (typeof $.context > "u") $.context = 4;
    let O = $.context;
    if ($.newlineIsToken) throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
    if (!$.callback) return _(lo(K, Y, $));
    else {
        let {
            callback: J
        } = $;
        lo(K, Y, Object.assign(Object.assign({}, $), {
            callback: (X) => {
                let D = _(X);
                J(D)
            }
        }))
    }

    function _(J) {
        if (!J) return;
        J.push({
            value: "",
            lines: []
        });

        function X(f) {
            return f.map(function(Z) {
                return " " + Z
            })
        }
        let D = [],
            j = 0,
            M = 0,
            P = [],
            W = 1,
            G = 1;
        for (let f = 0; f < J.length; f++) {
            let Z = J[f],
                N = Z.lines || a59(Z.value);
            if (Z.lines = N, Z.added || Z.removed) {
                if (!j) {
                    let T = J[f - 1];
                    if (j = W, M = G, T) P = O > 0 ? X(T.lines.slice(-O)) : [], j -= P.length, M -= P.length
                }
                for (let T of N) P.push((Z.added ? "+" : "-") + T);
                if (Z.added) G += N.length;
                else W += N.length
            } else {
                if (j)
                    if (N.length <= O * 2 && f < J.length - 2)
                        for (let T of X(N)) P.push(T);
                    else {
                        let T = Math.min(N.length, O);
                        for (let y of X(N.slice(0, T))) P.push(y);
                        let k = {
                            oldStart: j,
                            oldLines: W - j + T,
                            newStart: M,
                            newLines: G - M + T,
                            lines: P
                        };
                        D.push(k), j = 0, M = 0, P = []
                    } W += N.length, G += N.length
            }
        }
        for (let f of D)
            for (let Z = 0; Z < f.lines.length; Z++)
                if (f.lines[Z].endsWith(`
`)) f.lines[Z] = f.lines[Z].slice(0, -1);
                else f.lines.splice(Z + 1, 0, "\\ No newline at end of file"), Z++;
        return {
            oldFileName: A,
            newFileName: q,
            oldHeader: z,
            newHeader: w,
            hunks: D
        }
    }
}
// @from(Ln 204282, Col 0)
function Iw6(A, q) {
    if (!q) q = RL7;
    if (Array.isArray(A)) {
        if (A.length > 1 && !q.includeFileHeaders) throw Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");
        return A.map((Y) => Iw6(Y, q)).join(`
`)
    }
    let K = [];
    if (q.includeIndex && A.oldFileName == A.newFileName) K.push("Index: " + A.oldFileName);
    if (q.includeUnderline) K.push("===================================================================");
    if (q.includeFileHeaders) K.push("--- " + A.oldFileName + (typeof A.oldHeader > "u" ? "" : "\t" + A.oldHeader)), K.push("+++ " + A.newFileName + (typeof A.newHeader > "u" ? "" : "\t" + A.newHeader));
    for (let Y = 0; Y < A.hunks.length; Y++) {
        let z = A.hunks[Y];
        if (z.oldLines === 0) z.oldStart -= 1;
        if (z.newLines === 0) z.newStart -= 1;
        K.push("@@ -" + z.oldStart + "," + z.oldLines + " +" + z.newStart + "," + z.newLines + " @@");
        for (let w of z.lines) K.push(w)
    }
    return K.join(`
`) + `
`
}
// @from(Ln 204305, Col 0)
function yL7(A, q, K, Y, z, w, H) {
    if (typeof H === "function") H = {
        callback: H
    };
    if (!(H === null || H === void 0 ? void 0 : H.callback)) {
        let $ = io(A, q, K, Y, z, w, H);
        if (!$) return;
        return Iw6($, H === null || H === void 0 ? void 0 : H.headerOptions)
    } else {
        let {
            callback: $
        } = H;
        io(A, q, K, Y, z, w, Object.assign(Object.assign({}, H), {
            callback: (O) => {
                if (!O) $(void 0);
                else $(Iw6(O, H.headerOptions))
            }
        }))
    }
}
// @from(Ln 204326, Col 0)
function ZOA(A, q, K, Y, z, w) {
    return yL7(A, A, q, K, Y, z, w)
}
// @from(Ln 204330, Col 0)
function a59(A) {
    let q = A.endsWith(`
`),
        K = A.split(`
`).map((Y) => Y + `
`);
    if (q) K.pop();
    else K.push(K.pop().slice(0, -1));
    return K
}
// @from(Ln 204340, Col 4)
RL7
// @from(Ln 204341, Col 4)
CL7 = v(() => {
    Sw6();
    RL7 = {
        includeIndex: !0,
        includeUnderline: !0,
        includeFileHeaders: !0
    }
})
// @from(Ln 204349, Col 4)
Pq1 = v(() => {
    JL7();
    PL7();
    Sw6();
    fL7();
    NL7();
    vL7();
    kL7();
    LL7();
    CL7()
})
// @from(Ln 204365, Col 0)
function e59() {
    let q = "";
    for (let K = 0; K < 4; K++) q += "abcdefghijklmnopqrstuvwxyz0123456789" [Math.floor(Math.random() * 36)];
    return `/tmp/claude/cache-break-${q}.diff`
}
// @from(Ln 204371, Col 0)
function z99(A) {
    return A.includes("haiku")
}
// @from(Ln 204375, Col 0)
function xw6(A, q) {
    if (q) return q;
    if (A === "compact") return "repl_main_thread";
    for (let K of A99)
        if (A.startsWith(K)) return A;
    return null
}
// @from(Ln 204383, Col 0)
function SL7(A) {
    return A.map((q) => {
        if (!("cache_control" in q)) return q;
        let {
            cache_control: K,
            ...Y
        } = q;
        return Y
    })
}
// @from(Ln 204394, Col 0)
function hL7(A) {
    let q = Q1(A);
    if (typeof Bun < "u") {
        let Y = Bun.hash(q);
        return typeof Y === "bigint" ? Number(Y & 0xffffffffn) : Y
    }
    let K = 0;
    for (let Y = 0; Y < q.length; Y++) K = (K << 5) - K + q.charCodeAt(Y) | 0;
    return K
}
// @from(Ln 204405, Col 0)
function w99(A) {
    let q = 0;
    for (let K of A) q += K.text.length;
    return q
}
// @from(Ln 204411, Col 0)
function H99(A, q, K) {
    let Y = A.map((w) => w.text).join(`

`),
        z = [...q].map((w) => {
            if (!("name" in w)) return "unknown";
            let H = "description" in w ? w.description : "",
                $ = "input_schema" in w ? Q1(w.input_schema) : "";
            return `${w.name}
  description: ${H}
  input_schema: ${$}`
        }).sort().join(`

`);
    return `Model: ${K}

=== System Prompt ===

${Y}

=== Tools (${q.length}) ===

${z}
`
}
// @from(Ln 204437, Col 0)
function IL7(A, q, K, Y, z, w) {
    try {
        let H = xw6(K, z);
        if (!H) return;
        let $ = SL7(A),
            O = SL7(q),
            _ = hL7($),
            J = hL7(O),
            X = q.map((N) => ("name" in N) ? N.name : "unknown"),
            D = w99(A),
            j = H99(A, q, Y),
            M = w ?? !1,
            P = K01.get(H);
        if (!P) {
            K01.set(H, {
                systemHash: _,
                toolsHash: J,
                toolNames: X,
                systemCharCount: D,
                model: Y,
                fastMode: M,
                callCount: 1,
                pendingChanges: null,
                prevCacheReadTokens: null,
                microcompacted: !1,
                diffableContent: j
            });
            return
        }
        P.callCount++;
        let W = _ !== P.systemHash,
            G = J !== P.toolsHash,
            f = Y !== P.model,
            Z = M !== P.fastMode;
        if (W || G || f || Z) {
            let N = new Set(P.toolNames),
                T = new Set(X);
            P.pendingChanges = {
                systemPromptChanged: W,
                toolSchemasChanged: G,
                modelChanged: f,
                fastModeChanged: Z,
                addedToolCount: X.filter((k) => !N.has(k)).length,
                removedToolCount: P.toolNames.filter((k) => !T.has(k)).length,
                systemCharDelta: D - P.systemCharCount,
                previousModel: P.model,
                newModel: Y,
                prevDiffableContent: P.diffableContent
            }
        } else P.pendingChanges = null;
        P.systemHash = _, P.toolsHash = J, P.toolNames = X, P.systemCharCount = D, P.model = Y, P.fastMode = M, P.diffableContent = j
    } catch (H) {
        K1(H instanceof Error ? H : Error(String(H)))
    }
}