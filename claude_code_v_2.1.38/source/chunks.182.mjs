
// @from(Ln 470665, Col 0)
function CDz({
    event: A,
    onResponse: q
}) {
    let {
        serverName: K,
        signal: Y
    } = A, z = A.params, {
        message: w,
        requestedSchema: H
    } = z, $ = Object.keys(H.properties).length > 0, [O, _] = P$.useState($ ? null : "accept"), [J, X] = P$.useState(() => {
        let H1 = {};
        if (H.properties) {
            for (let [y1, B1] of Object.entries(H.properties))
                if (typeof B1 === "object" && B1 !== null) {
                    if (B1.default !== void 0) H1[y1] = B1.default
                }
        }
        return H1
    }), [D, j] = P$.useState(() => {
        let H1 = {};
        for (let [y1, B1] of Object.entries(H.properties))
            if (Ic1(B1) && B1?.default !== void 0) {
                let A6 = yc1(String(B1.default), B1);
                if (!A6.isValid && A6.error) H1[y1] = A6.error
            } return H1
    });
    P$.useEffect(() => {
        if (!Y) return;
        let H1 = () => {
            q("cancel")
        };
        if (Y.aborted) {
            H1();
            return
        }
        return Y.addEventListener("abort", H1), () => {
            Y.removeEventListener("abort", H1)
        }
    }, [Y, q]);
    let M = P$.useMemo(() => {
            let H1 = H.required ?? [];
            return Object.entries(H.properties).map(([y1, B1]) => ({
                name: y1,
                schema: B1,
                isRequired: H1.includes(y1)
            }))
        }, [H]),
        [P, W] = P$.useState($ ? 0 : void 0),
        [G, f] = P$.useState(() => {
            let H1 = M[0];
            if (H1 && Ic1(H1.schema)) {
                let y1 = J[H1.name];
                if (y1 === void 0) return "";
                return String(y1)
            }
            return ""
        }),
        [Z, N] = P$.useState(G.length),
        [T, k] = P$.useState(() => new Set),
        [y, B] = P$.useState(0),
        S = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
        [m, b] = P$.useState(),
        [g, U] = P$.useState(0),
        x = P$.useRef(void 0),
        p = P$.useRef(new Map),
        l = P$.useRef({
            buffer: "",
            timer: void 0
        });
    P$.useEffect(() => {
        if (T.size === 0) return;
        let H1 = setInterval(() => {
            B((y1) => (y1 + 1) % S.length)
        }, 80);
        return () => clearInterval(H1)
    }, [T.size]);
    let {
        columns: r,
        rows: s
    } = Z8(), O1 = P !== void 0 ? M[P] : void 0, N1 = O1 !== void 0 && Ic1(O1.schema) && !VF(O1.schema) && !O;
    DZ("elicitation"), vc1("Claude Code needs your input", "elicitation_dialog");
    let j1 = P$.useCallback((H1) => {
        if (H1 === void 0) {
            f(""), N(0);
            return
        }
        let y1 = M[H1];
        if (y1 && Ic1(y1.schema) && !VF(y1.schema)) {
            let B1 = J[y1.name],
                A6 = B1 !== void 0 ? String(B1) : "";
            f(A6), N(A6.length)
        }
    }, [M, J]);

    function q1(H1, y1) {
        if (!PY1(y1)) return;
        let B1 = J[H1] ?? [],
            A6 = M.find((V6) => V6.name === H1)?.isRequired ?? !1,
            O6 = y1.minItems,
            P6 = y1.maxItems;
        if (O6 !== void 0 && B1.length < O6 && (B1.length > 0 || A6)) D1(H1, `Select at least ${O6} item${O6===1?"":"s"}`);
        else if (P6 !== void 0 && B1.length > P6) D1(H1, `Select at most ${P6} item${P6===1?"":"s"}`);
        else D1(H1)
    }

    function t(H1) {
        if (O1 && PY1(O1.schema)) q1(O1.name, O1.schema), b(void 0);
        else if (O1 && VF(O1.schema)) b(void 0);
        if (N1 && O1) {
            if (E1(O1.name, O1.schema, G), x.current !== void 0) clearTimeout(x.current), x.current = void 0;
            if (hc1(O1.schema) && G.trim() !== "" && D[O1.name]) a(O1.name, O1.schema, G)
        }
        let y1 = M.length + 2,
            B1 = P ?? (O === "accept" ? M.length : O === "decline" ? M.length + 1 : void 0),
            A6 = B1 !== void 0 ? (B1 + (H1 === "up" ? y1 - 1 : 1)) % y1 : 0;
        if (A6 < M.length) W(A6), _(null), j1(A6);
        else W(void 0), _(A6 === M.length ? "accept" : "decline"), f("")
    }

    function J1(H1, y1) {
        if (X((B1) => {
                let A6 = {
                    ...B1
                };
                if (y1 === void 0) delete A6[H1];
                else A6[H1] = y1;
                return A6
            }), y1 !== void 0 && D[H1] === "This field is required") D1(H1)
    }

    function D1(H1, y1) {
        j((B1) => {
            let A6 = {
                ...B1
            };
            if (y1) A6[H1] = y1;
            else delete A6[H1];
            return A6
        })
    }

    function Z1(H1) {
        if (!H1) return;
        J1(H1, void 0), D1(H1), f(""), N(0)
    }

    function E1(H1, y1, B1) {
        let A6 = B1.trim();
        if (A6 === "" && (y1.type !== "string" || ("format" in y1) && y1.format !== void 0)) {
            Z1(H1);
            return
        }
        if (A6 === "") {
            if (J[H1] !== void 0) J1(H1, "");
            return
        }
        let O6 = yc1(B1, y1);
        J1(H1, O6.isValid ? O6.value : B1), D1(H1, O6.isValid ? void 0 : O6.error)
    }

    function a(H1, y1, B1) {
        if (!Y) return;
        let A6 = p.current.get(H1);
        if (A6) A6.abort();
        let O6 = new AbortController;
        p.current.set(H1, O6), k((P6) => new Set([...P6, H1])), MWq(B1, y1, O6.signal).then((P6) => {
            if (p.current.delete(H1), k((V6) => {
                    let q6 = new Set(V6);
                    return q6.delete(H1), q6
                }), O6.signal.aborted) return;
            if (P6.isValid) {
                J1(H1, P6.value), D1(H1);
                let V6 = String(P6.value);
                f((q6) => {
                    if (q6 === B1) return N(V6.length), V6;
                    return q6
                })
            } else D1(H1, P6.error)
        }, () => {
            p.current.delete(H1), k((P6) => {
                let V6 = new Set(P6);
                return V6.delete(H1), V6
            })
        })
    }

    function A1(H1) {
        if (f(H1), O1) {
            if (E1(O1.name, O1.schema, H1), x.current !== void 0) clearTimeout(x.current), x.current = void 0;
            if (hc1(O1.schema) && H1.trim() !== "" && D[O1.name]) {
                let {
                    name: y1,
                    schema: B1
                } = O1;
                x.current = setTimeout(() => {
                    x.current = void 0, a(y1, B1, H1)
                }, 2000)
            }
        }
    }

    function M1() {
        t("down")
    }

    function z1(H1) {
        if (!O1) return;
        let {
            schema: y1,
            name: B1
        } = O1, A6 = l.current;
        if (A6.timer !== void 0) clearTimeout(A6.timer);
        A6.buffer += H1.toLowerCase(), A6.timer = setTimeout(() => {
            A6.buffer = "", A6.timer = void 0
        }, 2000);
        let O6, P6;
        if (y1.type === "boolean") O6 = [!0, !1], P6 = ["yes", "no"];
        else if (VF(y1)) {
            let q6 = _11(y1);
            O6 = q6, P6 = q6.map((p1) => kf1(y1, p1).toLowerCase())
        } else return;
        let V6 = P6.findIndex((q6) => q6.startsWith(A6.buffer));
        if (V6 !== -1) J1(B1, O6[V6])
    }
    DA("confirm:no", () => {
        if (N1 && O1) {
            let H1 = J[O1.name];
            f(H1 !== void 0 ? String(H1) : ""), N(0)
        }
        q("cancel")
    }, {
        context: "Settings",
        isActive: !!O1 && !O && !m
    }), D8((H1, y1) => {
        if (N1 && !y1.upArrow && !y1.downArrow && !y1.return && !y1.backspace) return;
        if (m && O1 && PY1(O1.schema)) {
            let P6 = O1.schema,
                V6 = Cc1(P6),
                q6 = J[O1.name] ?? [];
            if (y1.leftArrow || y1.escape) {
                b(void 0), q1(O1.name, P6);
                return
            }
            if (y1.upArrow) {
                if (g === 0) b(void 0), q1(O1.name, P6);
                else U(g - 1);
                return
            }
            if (y1.downArrow) {
                if (g >= V6.length - 1) b(void 0), t("down");
                else U(g + 1);
                return
            }
            if (H1 === " ") {
                let p1 = V6[g];
                if (p1 !== void 0) {
                    let K6 = q6.includes(p1) ? q6.filter((F6) => F6 !== p1) : [...q6, p1],
                        j6 = K6.length > 0 ? K6 : void 0;
                    J1(O1.name, j6);
                    let {
                        minItems: M6,
                        maxItems: N6
                    } = P6;
                    if (M6 !== void 0 && K6.length < M6 && (K6.length > 0 || O1.isRequired)) D1(O1.name, `Select at least ${M6} item${M6===1?"":"s"}`);
                    else if (N6 !== void 0 && K6.length > N6) D1(O1.name, `Select at most ${N6} item${N6===1?"":"s"}`);
                    else D1(O1.name)
                }
                return
            }
            if (y1.return) {
                let p1 = V6[g];
                if (p1 !== void 0 && !q6.includes(p1)) J1(O1.name, [...q6, p1]);
                b(void 0), t("down");
                return
            }
            if (H1) {
                let p1 = l.current;
                if (p1.timer !== void 0) clearTimeout(p1.timer);
                p1.buffer += H1.toLowerCase(), p1.timer = setTimeout(() => {
                    p1.buffer = "", p1.timer = void 0
                }, 2000);
                let j6 = V6.map((M6) => Sc1(P6, M6).toLowerCase()).findIndex((M6) => M6.startsWith(p1.buffer));
                if (j6 !== -1) U(j6);
                return
            }
            return
        }
        if (m && O1 && VF(O1.schema)) {
            let P6 = O1.schema,
                V6 = _11(P6);
            if (y1.leftArrow || y1.escape) {
                b(void 0);
                return
            }
            if (y1.upArrow) {
                if (g === 0) b(void 0);
                else U(g - 1);
                return
            }
            if (y1.downArrow) {
                if (g >= V6.length - 1) b(void 0), t("down");
                else U(g + 1);
                return
            }
            if (H1 === " ") {
                let q6 = V6[g];
                if (q6 !== void 0) J1(O1.name, q6);
                b(void 0);
                return
            }
            if (y1.return) {
                let q6 = V6[g];
                if (q6 !== void 0) J1(O1.name, q6);
                b(void 0), t("down");
                return
            }
            if (H1) {
                let q6 = l.current;
                if (q6.timer !== void 0) clearTimeout(q6.timer);
                q6.buffer += H1.toLowerCase(), q6.timer = setTimeout(() => {
                    q6.buffer = "", q6.timer = void 0
                }, 2000);
                let K6 = V6.map((j6) => kf1(P6, j6).toLowerCase()).findIndex((j6) => j6.startsWith(q6.buffer));
                if (K6 !== -1) U(K6);
                return
            }
            return
        }
        if (y1.return && O === "accept") {
            if (Y1() && Object.keys(D).length === 0) q("accept", J);
            else {
                let P6 = H.required || [];
                for (let q6 of P6)
                    if (J[q6] === void 0) D1(q6, "This field is required");
                let V6 = M.findIndex((q6) => P6.includes(q6.name) && J[q6.name] === void 0 || D[q6.name] !== void 0);
                if (V6 !== -1) W(V6), _(null), j1(V6)
            }
            return
        }
        if (y1.return && O === "decline") {
            q("decline");
            return
        }
        if (y1.upArrow || y1.downArrow) {
            let P6 = l.current;
            if (P6.buffer = "", P6.timer !== void 0) clearTimeout(P6.timer), P6.timer = void 0;
            t(y1.upArrow ? "up" : "down");
            return
        }
        if (O && (y1.leftArrow || y1.rightArrow)) {
            _(O === "accept" ? "decline" : "accept");
            return
        }
        if (!O1) return;
        let {
            schema: B1,
            name: A6
        } = O1, O6 = J[A6];
        if (B1.type === "boolean") {
            if (H1 === " ") {
                if (O6 === void 0) J1(A6, !0);
                else J1(A6, !O6);
                return
            }
            if (y1.return) {
                t("down");
                return
            }
            if (y1.backspace && O6 !== void 0) {
                Z1(A6);
                return
            }
            if (H1 && !y1.return) {
                z1(H1);
                return
            }
            return
        }
        if (VF(B1)) {
            if (y1.rightArrow) {
                let P6 = _11(B1),
                    V6 = O6,
                    q6 = V6 !== void 0 ? P6.indexOf(V6) : 0;
                b(A6), U(Math.max(0, q6));
                return
            }
            if (y1.return) {
                t("down");
                return
            }
            if (y1.backspace && O6 !== void 0) {
                Z1(A6);
                return
            }
            if (H1 && !y1.leftArrow) {
                let P6 = _11(B1),
                    V6 = l.current;
                if (V6.timer !== void 0) clearTimeout(V6.timer);
                V6.buffer += H1.toLowerCase(), V6.timer = setTimeout(() => {
                    V6.buffer = "", V6.timer = void 0
                }, 2000);
                let p1 = P6.map((K6) => kf1(B1, K6).toLowerCase()).findIndex((K6) => K6.startsWith(V6.buffer));
                if (p1 !== -1) b(A6), U(p1);
                return
            }
            return
        }
        if (PY1(B1)) {
            if (y1.rightArrow) {
                b(A6), U(0);
                return
            }
            if (y1.return) {
                t("down");
                return
            }
            if (y1.backspace && O6 !== void 0) {
                Z1(A6);
                return
            }
            if (H1 && !y1.leftArrow) {
                let P6 = Cc1(B1),
                    V6 = l.current;
                if (V6.timer !== void 0) clearTimeout(V6.timer);
                V6.buffer += H1.toLowerCase(), V6.timer = setTimeout(() => {
                    V6.buffer = "", V6.timer = void 0
                }, 2000);
                let p1 = P6.map((K6) => Sc1(B1, K6).toLowerCase()).findIndex((K6) => K6.startsWith(V6.buffer));
                if (p1 !== -1) b(A6), U(p1);
                return
            }
            return
        }
        if (y1.backspace) {
            if (N1 && G === "") {
                Z1(A6);
                return
            }
        }
    }, {
        isActive: !0
    });

    function Y1() {
        let H1 = H.required || [];
        for (let y1 of H1) {
            let B1 = J[y1];
            if (B1 === void 0 || B1 === null || B1 === "") return !1;
            if (Array.isArray(B1) && B1.length === 0) return !1
        }
        return !0
    }
    let _1 = 3,
        G1 = Math.max(2, Math.floor((s - 14) / _1)),
        L1 = P$.useMemo(() => {
            let H1 = M.length;
            if (H1 <= G1) return {
                start: 0,
                end: H1
            };
            let y1 = P ?? H1 - 1,
                B1 = Math.max(0, y1 - Math.floor(G1 / 2)),
                A6 = Math.min(B1 + G1, H1);
            return B1 = Math.max(0, A6 - G1), {
                start: B1,
                end: A6
            }
        }, [M.length, G1, P]),
        x1 = L1.start > 0,
        f1 = L1.end < M.length;

    function R1() {
        if (!M.length) return null;
        return j7.default.createElement(I, {
            flexDirection: "column"
        }, x1 && j7.default.createElement(I, {
            marginLeft: 2
        }, j7.default.createElement(V, {
            dimColor: !0
        }, l1.arrowUp, " ", L1.start, " more above")), M.slice(L1.start, L1.end).map((H1, y1) => {
            let B1 = L1.start + y1,
                {
                    name: A6,
                    schema: O6,
                    isRequired: P6
                } = H1,
                V6 = B1 === P && !O,
                q6 = J[A6],
                p1 = q6 !== void 0 && (!Array.isArray(q6) || q6.length > 0),
                K6 = D[A6],
                M6 = T.has(A6) ? j7.default.createElement(V, {
                    color: "warning"
                }, S[y]) : K6 ? j7.default.createElement(V, {
                    color: "error"
                }, l1.warning) : p1 ? j7.default.createElement(V, {
                    color: "success",
                    dimColor: !V6
                }, l1.tick) : P6 ? j7.default.createElement(V, {
                    color: "error"
                }, "*") : j7.default.createElement(V, null, " "),
                N6 = K6 ? "error" : p1 ? "success" : P6 ? "error" : "suggestion",
                F6 = V6 ? N6 : void 0,
                P1 = j7.default.createElement(V, {
                    color: F6,
                    bold: V6
                }, O6.title || A6),
                k1, o1 = null;
            if (PY1(O6)) {
                let _6 = Cc1(O6),
                    z6 = q6 ?? [];
                if (m === A6 && V6) k1 = j7.default.createElement(V, {
                    dimColor: !0
                }, l1.triangleDownSmall), o1 = j7.default.createElement(I, {
                    flexDirection: "column",
                    marginLeft: 6
                }, _6.map((r6, G6) => {
                    let L6 = Sc1(O6, r6),
                        OA = z6.includes(r6),
                        bA = G6 === g;
                    return j7.default.createElement(I, {
                        key: r6,
                        gap: 1
                    }, j7.default.createElement(V, {
                        color: "suggestion"
                    }, bA ? l1.pointer : " "), j7.default.createElement(V, {
                        color: OA ? "success" : void 0
                    }, OA ? l1.checkboxOn : l1.checkboxOff), j7.default.createElement(V, {
                        color: bA ? "suggestion" : void 0,
                        bold: bA
                    }, L6))
                }));
                else {
                    let r6 = V6 ? j7.default.createElement(V, {
                        dimColor: !0
                    }, l1.triangleRightSmall, " ") : null;
                    if (z6.length > 0) {
                        let G6 = z6.map((L6) => Sc1(O6, L6));
                        k1 = j7.default.createElement(V, null, r6, j7.default.createElement(V, {
                            color: F6,
                            bold: V6
                        }, G6.join(", ")))
                    } else k1 = j7.default.createElement(V, null, r6, j7.default.createElement(V, {
                        dimColor: !0,
                        italic: !0
                    }, "not set"))
                }
            } else if (VF(O6)) {
                let _6 = _11(O6);
                if (m === A6 && V6) k1 = j7.default.createElement(V, {
                    dimColor: !0
                }, l1.triangleDownSmall), o1 = j7.default.createElement(I, {
                    flexDirection: "column",
                    marginLeft: 6
                }, _6.map((w6, r6) => {
                    let G6 = kf1(O6, w6),
                        L6 = q6 === w6,
                        OA = r6 === g;
                    return j7.default.createElement(I, {
                        key: w6,
                        gap: 1
                    }, j7.default.createElement(V, {
                        color: "suggestion"
                    }, OA ? l1.pointer : " "), j7.default.createElement(V, {
                        color: L6 ? "success" : void 0
                    }, L6 ? l1.radioOn : l1.radioOff), j7.default.createElement(V, {
                        color: OA ? "suggestion" : void 0,
                        bold: OA
                    }, G6))
                }));
                else {
                    let w6 = V6 ? j7.default.createElement(V, {
                        dimColor: !0
                    }, l1.triangleRightSmall, " ") : null;
                    if (p1) k1 = j7.default.createElement(V, null, w6, j7.default.createElement(V, {
                        color: F6,
                        bold: V6
                    }, kf1(O6, q6)));
                    else k1 = j7.default.createElement(V, null, w6, j7.default.createElement(V, {
                        dimColor: !0,
                        italic: !0
                    }, "not set"))
                }
            } else if (O6.type === "boolean")
                if (V6) k1 = p1 ? j7.default.createElement(V, {
                    color: F6,
                    bold: !0
                }, q6 ? l1.checkboxOn : l1.checkboxOff) : j7.default.createElement(V, {
                    dimColor: !0
                }, l1.checkboxOff);
                else k1 = p1 ? j7.default.createElement(V, null, q6 ? l1.checkboxOn : l1.checkboxOff) : j7.default.createElement(V, {
                    dimColor: !0,
                    italic: !0
                }, "not set");
            else if (Ic1(O6))
                if (V6) k1 = j7.default.createElement(k3, {
                    value: G,
                    onChange: A1,
                    onSubmit: M1,
                    placeholder: "Type something…",
                    columns: Math.min(r - 20, 60),
                    cursorOffset: Z,
                    onChangeCursorOffset: N,
                    focus: !0,
                    showCursor: !0
                });
                else {
                    let _6 = p1 && hc1(O6) ? yDz(String(q6), O6) : String(q6);
                    k1 = p1 ? j7.default.createElement(V, null, _6) : j7.default.createElement(V, {
                        dimColor: !0,
                        italic: !0
                    }, "not set")
                }
            else k1 = p1 ? j7.default.createElement(V, null, String(q6)) : j7.default.createElement(V, {
                dimColor: !0,
                italic: !0
            }, "not set");
            return j7.default.createElement(I, {
                key: A6,
                flexDirection: "column"
            }, j7.default.createElement(I, {
                gap: 1
            }, j7.default.createElement(V, {
                color: N6
            }, V6 ? l1.pointer : " "), M6, j7.default.createElement(I, null, P1, j7.default.createElement(V, {
                color: F6
            }, ": "), k1)), o1, O6.description && j7.default.createElement(I, {
                marginLeft: 6
            }, j7.default.createElement(V, {
                dimColor: !0
            }, O6.description)), j7.default.createElement(I, {
                marginLeft: 6,
                height: 1
            }, K6 ? j7.default.createElement(V, {
                color: "error",
                italic: !0
            }, K6) : j7.default.createElement(V, null, " ")))
        }), f1 && j7.default.createElement(I, {
            marginLeft: 2
        }, j7.default.createElement(V, {
            dimColor: !0
        }, l1.arrowDown, " ", M.length - L1.end, " more below")))
    }
    return j7.default.createElement(w8, {
        title: `MCP server “${K}” requests your input`,
        subtitle: `
${w}`,
        color: "permission",
        onCancel: () => q("cancel"),
        isCancelActive: (!O1 || !!O) && !m,
        inputGuide: (H1) => H1.pending ? j7.default.createElement(V, null, "Press ", H1.keyName, " again to exit") : j7.default.createElement(oA, null, j7.default.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        }), j7.default.createElement(YA, {
            shortcut: "↑↓",
            action: "navigate"
        }), O1 && j7.default.createElement(YA, {
            shortcut: "Backspace",
            action: "unset"
        }), O1 && O1.schema.type === "boolean" && j7.default.createElement(YA, {
            shortcut: "Space",
            action: "toggle"
        }), O1 && VF(O1.schema) && (m ? j7.default.createElement(YA, {
            shortcut: "Space",
            action: "select"
        }) : j7.default.createElement(YA, {
            shortcut: "→",
            action: "expand"
        })), O1 && PY1(O1.schema) && (m ? j7.default.createElement(YA, {
            shortcut: "Space",
            action: "toggle"
        }) : j7.default.createElement(YA, {
            shortcut: "→",
            action: "expand"
        })))
    }, j7.default.createElement(I, {
        flexDirection: "column"
    }, R1(), j7.default.createElement(I, null, j7.default.createElement(V, {
        color: "success"
    }, O === "accept" ? l1.pointer : " "), j7.default.createElement(V, {
        bold: O === "accept",
        color: O === "accept" ? "success" : void 0,
        dimColor: O !== "accept"
    }, " Accept  "), j7.default.createElement(V, {
        color: "error"
    }, O === "decline" ? l1.pointer : " "), j7.default.createElement(V, {
        bold: O === "decline",
        color: O === "decline" ? "error" : void 0,
        dimColor: O !== "decline"
    }, " Decline"))))
}
// @from(Ln 471359, Col 0)
function SDz(A) {
    let q = e(49),
        {
            event: K,
            onResponse: Y
        } = A,
        {
            serverName: z,
            signal: w
        } = K,
        H = K.params,
        {
            message: $,
            url: O
        } = H,
        [_, J] = P$.useState("open");
    vc1("Claude Code needs your input", "elicitation_url_dialog"), DZ("elicitation-url");
    let X, D;
    if (q[0] !== Y || q[1] !== w) X = () => {
        if (w.aborted) {
            Y("cancel");
            return
        }
        let N1 = () => Y("cancel");
        return w.addEventListener("abort", N1), () => w.removeEventListener("abort", N1)
    }, D = [w, Y], q[0] = Y, q[1] = w, q[2] = X, q[3] = D;
    else X = q[2], D = q[3];
    P$.useEffect(X, D);
    let j, M = "",
        P = "";
    try {
        let N1, j1;
        if (q[4] !== O) j = new URL(O).hostname, N1 = O.indexOf(j), j1 = O.slice(0, N1), q[4] = O, q[5] = N1, q[6] = j1, q[7] = j;
        else N1 = q[5], j1 = q[6], j = q[7];
        M = j1;
        let q1;
        if (q[8] !== j || q[9] !== N1 || q[10] !== O) q1 = O.slice(N1 + j.length), q[8] = j, q[9] = N1, q[10] = O, q[11] = q1;
        else q1 = q[11];
        P = q1
    } catch {
        j = O
    }
    let W;
    if (q[12] !== _ || q[13] !== Y || q[14] !== O) W = (N1, j1) => {
        if (j1.leftArrow || j1.rightArrow) {
            J(IDz);
            return
        }
        if (j1.return)
            if (_ === "open") zY(O), Y("accept");
            else Y("decline")
    }, q[12] = _, q[13] = Y, q[14] = O, q[15] = W;
    else W = q[15];
    D8(W);
    let G = `MCP server “${z}” wants to open a URL`,
        f = `
${$}`,
        Z;
    if (q[16] !== Y) Z = () => Y("cancel"), q[16] = Y, q[17] = Z;
    else Z = q[17];
    let N;
    if (q[18] !== j) N = j7.default.createElement(V, {
        bold: !0
    }, j), q[18] = j, q[19] = N;
    else N = q[19];
    let T;
    if (q[20] !== N || q[21] !== P || q[22] !== M) T = j7.default.createElement(I, {
        marginBottom: 1,
        flexDirection: "column"
    }, j7.default.createElement(V, null, M, N, P)), q[20] = N, q[21] = P, q[22] = M, q[23] = T;
    else T = q[23];
    let k = _ === "open" ? l1.pointer : " ",
        y;
    if (q[24] !== k) y = j7.default.createElement(V, {
        color: "success"
    }, k), q[24] = k, q[25] = y;
    else y = q[25];
    let B = _ === "open",
        S = _ === "open" ? "success" : void 0,
        m = _ !== "open",
        b;
    if (q[26] !== B || q[27] !== S || q[28] !== m) b = j7.default.createElement(V, {
        bold: B,
        color: S,
        dimColor: m
    }, " Open in Browser  "), q[26] = B, q[27] = S, q[28] = m, q[29] = b;
    else b = q[29];
    let g = _ === "decline" ? l1.pointer : " ",
        U;
    if (q[30] !== g) U = j7.default.createElement(V, {
        color: "error"
    }, g), q[30] = g, q[31] = U;
    else U = q[31];
    let x = _ === "decline",
        p = _ === "decline" ? "error" : void 0,
        l = _ !== "decline",
        r;
    if (q[32] !== x || q[33] !== p || q[34] !== l) r = j7.default.createElement(V, {
        bold: x,
        color: p,
        dimColor: l
    }, " Decline"), q[32] = x, q[33] = p, q[34] = l, q[35] = r;
    else r = q[35];
    let s;
    if (q[36] !== y || q[37] !== b || q[38] !== U || q[39] !== r) s = j7.default.createElement(I, null, y, b, U, r), q[36] = y, q[37] = b, q[38] = U, q[39] = r, q[40] = s;
    else s = q[40];
    let O1;
    if (q[41] !== s || q[42] !== T) O1 = j7.default.createElement(I, {
        flexDirection: "column"
    }, T, s), q[41] = s, q[42] = T, q[43] = O1;
    else O1 = q[43];
    let T1;
    if (q[44] !== O1 || q[45] !== G || q[46] !== f || q[47] !== Z) T1 = j7.default.createElement(w8, {
        title: G,
        subtitle: f,
        color: "permission",
        onCancel: Z,
        isCancelActive: !0,
        inputGuide: hDz
    }, O1), q[44] = O1, q[45] = G, q[46] = f, q[47] = Z, q[48] = T1;
    else T1 = q[48];
    return T1
}
// @from(Ln 471483, Col 0)
function hDz(A) {
    return A.pending ? j7.default.createElement(V, null, "Press ", A.keyName, " again to exit") : j7.default.createElement(oA, null, j7.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }), j7.default.createElement(YA, {
        shortcut: "←→",
        action: "switch"
    }))
}
// @from(Ln 471495, Col 0)
function IDz(A) {
    return A === "open" ? "decline" : "open"
}
// @from(Ln 471498, Col 4)
j7
// @from(Ln 471498, Col 8)
P$
// @from(Ln 471498, Col 12)
Ic1 = (A) => ["string", "number", "integer"].includes(A.type)
// @from(Ln 471499, Col 4)
GWq = v(() => {
    i1();
    m1();
    K7();
    b7();
    KgA();
    HK();
    Bq();
    wK();
    BK();
    PWq();
    gO();
    mq();
    oS();
    Oj();
    j7 = o(X1(), 1), P$ = o(X1(), 1)
})
// @from(Ln 471517, Col 0)
function ZWq(A) {
    return `${Lf1.major(A,{loose:!0})}.${Lf1.minor(A,{loose:!0})}.${Lf1.patch(A,{loose:!0})}`
}
// @from(Ln 471521, Col 0)
function Iv6(A, q = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.38",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-02-10T00:04:56Z"
}.VERSION) {
    let [K, Y] = fWq.useState(() => ZWq(q));
    if (!A) return null;
    let z = ZWq(A);
    if (z !== K) return Y(z), z;
    return null
}
// @from(Ln 471535, Col 4)
fWq
// @from(Ln 471535, Col 9)
Lf1
// @from(Ln 471536, Col 4)
_gA = v(() => {
    fWq = o(X1(), 1), Lf1 = o(GS(), 1)
})
// @from(Ln 471540, Col 0)
function NWq({
    isUpdating: A,
    onChangeIsUpdating: q,
    onAutoUpdaterResult: K,
    autoUpdaterResult: Y,
    showSuccessMessage: z,
    verbose: w
}) {
    let [H, $] = xv6.useState({}), O = Iv6(Y?.version), _ = BY.useCallback(async () => {
        if (A) return;
        let J = {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION,
            X = l4()?.autoUpdatesChannel ?? "latest",
            D = await M91(X),
            j = xc();
        if ($({
                global: J,
                latest: D
            }), !j && J && D && !VWq.gte(J, D, {
                loose: !0
            }) && !AZ1(D)) {
            let M = Date.now();
            q(!0);
            let P = f6();
            if (P.installMethod !== "native") await _p1();
            let W = await om();
            if (h(`AutoUpdater: Detected installation type: ${W}`), W === "development") {
                h("AutoUpdater: Cannot auto-update development build"), q(!1);
                return
            }
            let G, f;
            if (W === "npm-local") h("AutoUpdater: Using local update method"), f = "local", G = await Ap1(X);
            else if (W === "npm-global") h("AutoUpdater: Using global update method"), f = "global", G = await Yp1();
            else if (W === "native") {
                h("AutoUpdater: Unexpected native installation in non-native updater"), q(!1);
                return
            } else {
                h("AutoUpdater: Unknown installation type, falling back to config");
                let Z = P.installMethod === "local";
                if (f = Z ? "local" : "global", Z) G = await Ap1(X);
                else G = await Yp1()
            }
            if (q(!1), G === "success") c("tengu_auto_updater_success", {
                fromVersion: J,
                toVersion: D,
                durationMs: Date.now() - M,
                wasMigrated: f === "local",
                installationType: W
            });
            else c("tengu_auto_updater_fail", {
                fromVersion: J,
                attemptedVersion: D,
                status: G,
                durationMs: Date.now() - M,
                wasMigrated: f === "local",
                installationType: W
            });
            K({
                version: D,
                status: G
            })
        }
    }, [K]);
    if (xv6.useEffect(() => {
            _()
        }, [_]), RX(_, 1800000), !Y?.version && (!H.global || !H.latest)) return null;
    if (!Y?.version && !A) return null;
    return BY.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, w && BY.createElement(V, {
        dimColor: !0
    }, "globalVersion: ", H.global, " · latestVersion:", " ", H.latest), A ? BY.createElement(BY.Fragment, null, BY.createElement(I, null, BY.createElement(V, {
        color: "text",
        dimColor: !0,
        wrap: "end"
    }, "Auto-updating…"))) : Y?.status === "success" && z && O && BY.createElement(V, {
        color: "success"
    }, "✓ Update installed · Restart to apply"), (Y?.status === "install_failed" || Y?.status === "no_permissions") && BY.createElement(V, {
        color: "error"
    }, "✗ Auto-update failed · Try ", BY.createElement(V, {
        bold: !0
    }, "claude doctor"), !Ye() && BY.createElement(BY.Fragment, null, " ", "or ", BY.createElement(V, {
        bold: !0
    }, "npm i -g ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.PACKAGE_URL)), Ye() && BY.createElement(BY.Fragment, null, " ", "or", " ", BY.createElement(V, {
        bold: !0
    }, "cd ~/.claude/local && npm update ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.PACKAGE_URL))))
}
// @from(Ln 471648, Col 4)
BY
// @from(Ln 471648, Col 8)
VWq
// @from(Ln 471648, Col 13)
xv6
// @from(Ln 471649, Col 4)
TWq = v(() => {
    m1();
    cA();
    we();
    D91();
    BI();
    XZ();
    u6();
    _gA();
    am();
    Z6();
    p8();
    BY = o(X1(), 1), VWq = o(GS(), 1), xv6 = o(X1(), 1)
})
// @from(Ln 471664, Col 0)
function xDz(A) {
    if (A.includes("timeout")) return "timeout";
    if (A.includes("Checksum mismatch")) return "checksum_mismatch";
    if (A.includes("ENOENT") || A.includes("not found")) return "not_found";
    if (A.includes("EACCES") || A.includes("permission")) return "permission_denied";
    if (A.includes("ENOSPC")) return "disk_full";
    if (A.includes("npm")) return "npm_error";
    if (A.includes("network") || A.includes("ECONNREFUSED") || A.includes("ENOTFOUND")) return "network_error";
    return "unknown"
}
// @from(Ln 471675, Col 0)
function vWq({
    isUpdating: A,
    onChangeIsUpdating: q,
    onAutoUpdaterResult: K,
    autoUpdaterResult: Y,
    showSuccessMessage: z,
    verbose: w
}) {
    let [H, $] = bv6.useState({}), O = Iv6(Y?.version), _ = O0.useRef(!1), J = l4()?.autoUpdatesChannel ?? "latest", X = O0.useCallback(async () => {
        if (A || xc()) return;
        q(!0);
        let D = Date.now();
        c("tengu_native_auto_updater_start", {});
        try {
            let j = await _c(J),
                M = {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION,
                P = Date.now() - D;
            if (j.lockFailed) {
                c("tengu_native_auto_updater_lock_contention", {
                    latency_ms: P
                });
                return
            }
            if ($({
                    current: M,
                    latest: j.latestVersion
                }), j.wasUpdated) c("tengu_native_auto_updater_success", {
                latency_ms: P
            }), K({
                version: j.latestVersion,
                status: "success"
            });
            else c("tengu_native_auto_updater_up_to_date", {
                latency_ms: P
            })
        } catch (j) {
            let M = Date.now() - D,
                P = j instanceof Error ? j.message : String(j);
            K1(j instanceof Error ? j : Error(String(j)));
            let W = xDz(P);
            c("tengu_native_auto_updater_fail", {
                latency_ms: M,
                error_timeout: W === "timeout",
                error_checksum: W === "checksum_mismatch",
                error_not_found: W === "not_found",
                error_permission: W === "permission_denied",
                error_disk_full: W === "disk_full",
                error_npm: W === "npm_error",
                error_network: W === "network_error"
            }), K({
                version: null,
                status: "install_failed"
            })
        } finally {
            q(!1)
        }
    }, [A, q, K]);
    if (bv6.useEffect(() => {
            if (!_.current) _.current = !0, X()
        }), RX(X, 1800000), !Y?.version && (!H.current || !H.latest)) return null;
    if (!Y?.version && !A) return null;
    return O0.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, w && O0.createElement(V, {
        dimColor: !0
    }, "current: ", H.current, " · ", J, ": ", H.latest), A ? O0.createElement(I, null, O0.createElement(V, {
        dimColor: !0,
        wrap: "end"
    }, "Checking for updates")) : Y?.status === "success" && z && O && O0.createElement(V, {
        color: "success"
    }, "✓ Update installed · Restart to update"), Y?.status === "install_failed" && O0.createElement(V, {
        color: "error"
    }, "✗ Auto-update failed · Try ", O0.createElement(V, {
        bold: !0
    }, "/status")))
}
// @from(Ln 471759, Col 4)
O0
// @from(Ln 471759, Col 8)
bv6
// @from(Ln 471760, Col 4)
EWq = v(() => {
    m1();
    cA();
    BI();
    XZ();
    u6();
    y6();
    _gA();
    p8();
    O0 = o(X1(), 1), bv6 = o(X1(), 1)
})
// @from(Ln 471772, Col 0)
function LWq(A) {
    let q = e(10),
        {
            verbose: K
        } = A,
        [Y, z] = JgA.useState(!1),
        [w, H] = JgA.useState("unknown"),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = async () => {
        if (xc()) return;
        let [P, W] = await Promise.all([Promise.resolve(l4()?.autoUpdatesChannel ?? "latest"), qZ1()]);
        H(W);
        let G = await lf6(P),
            f = G && !kWq.gte({
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION, G, {
                loose: !0
            }) && !AZ1(G);
        if (z(!!f), f) h(`PackageManagerAutoUpdater: Update available ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} -> ${G}`)
    }, q[0] = $;
    else $ = q[0];
    let O = $,
        _, J;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        O()
    }, J = [O], q[1] = _, q[2] = J;
    else _ = q[1], J = q[2];
    if (UN.useEffect(_, J), RX(O, 1800000), !Y) return null;
    let X = w === "homebrew" ? "brew upgrade claude-code" : w === "winget" ? "winget upgrade Anthropic.ClaudeCode" : w === "apk" ? "apk upgrade claude-code" : "your package manager update command",
        D;
    if (q[3] !== K) D = K && UN.createElement(V, {
        dimColor: !0
    }, "currentVersion: ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION), q[3] = K, q[4] = D;
    else D = q[4];
    let j;
    if (q[5] !== X) j = UN.createElement(V, {
        color: "warning"
    }, "Update available! Run: ", UN.createElement(V, {
        bold: !0
    }, X)), q[5] = X, q[6] = j;
    else j = q[6];
    let M;
    if (q[7] !== D || q[8] !== j) M = UN.createElement(UN.Fragment, null, D, j), q[7] = D, q[8] = j, q[9] = M;
    else M = q[9];
    return M
}
// @from(Ln 471830, Col 4)
UN
// @from(Ln 471830, Col 8)
kWq
// @from(Ln 471830, Col 13)
JgA
// @from(Ln 471831, Col 4)
RWq = v(() => {
    i1();
    m1();
    we();
    XZ();
    Z6();
    sf6();
    cA();
    p8();
    UN = o(X1(), 1), kWq = o(GS(), 1), JgA = o(X1(), 1)
})
// @from(Ln 471842, Col 0)
async function uv6() {
    let A = process.argv.includes("-p") || process.argv.includes("--print");
    if (!await WFA("auto_migrate_to_native", !1)) return !1;
    if (J6(!1) || !1 || A || J6(process.env.DISABLE_AUTO_MIGRATE_TO_NATIVE)) return !1;
    if (f6().installMethod === "native") return !1;
    return !0
}
// @from(Ln 471849, Col 0)
async function yWq() {
    c("tengu_auto_migrate_to_native_attempt", {});
    try {
        let A = l4()?.autoUpdatesChannel ?? "latest",
            q = await _c(A),
            K = [];
        if (q.latestVersion) {
            c("tengu_auto_migrate_to_native_success", {}), h("✅ Upgraded to native installation. Future sessions will use the native version.");
            let {
                removed: z,
                errors: w,
                warnings: H
            } = await Xp1(), $ = [];
            if (w.length > 0) w.forEach((J) => {
                $.push({
                    message: J,
                    userActionRequired: !1,
                    type: "error"
                })
            });
            if (H.length > 0) H.forEach((J) => {
                $.push({
                    message: J,
                    userActionRequired: !1,
                    type: "info"
                })
            });
            if (z > 0) $.push({
                message: `Cleaned up ${z} old npm installation(s)`,
                userActionRequired: !1,
                type: "info"
            });
            let O = Jp1();
            K = [...await tm(!0), ...O, ...$]
        } else c("tengu_auto_migrate_to_native_partial", {}), h("⚠️ Native installation setup encountered issues but cleanup completed."), K = await tm(!0);
        let Y = [];
        if (K.length > 0) {
            let z = K.filter((w) => w.userActionRequired);
            if (z.length > 0) {
                let w = ["⚠️  Manual action required after migration to native installer:", ...z.map((H) => `• ${H.message}`)].join(`
`);
                Y.push(w)
            }
            h("Migration completed with the following notes:"), K.forEach((w) => {
                h(`  • [${w.type}] ${w.message}`)
            })
        }
        return {
            success: !0,
            version: q.latestVersion,
            notifications: Y.length > 0 ? Y : void 0
        }
    } catch (A) {
        return c("tengu_auto_migrate_to_native_failure", {
            error: A instanceof Error ? A.message : String(A)
        }), K1(A instanceof Error ? A : Error(String(A))), {
            success: !1
        }
    }
}
// @from(Ln 471909, Col 4)
XgA = v(() => {
    BI();
    U4();
    u6();
    y6();
    Z6();
    hA();
    cA();
    p8()
})
// @from(Ln 471920, Col 0)
function CWq({
    onMigrationComplete: A,
    onChangeIsUpdating: q,
    onAutoUpdaterResult: K,
    verbose: Y
}) {
    let [z, w] = Bv6.useState("checking"), H = gc.useRef(!1);
    if (Bv6.useEffect(() => {
            async function $() {
                if (H.current) return;
                H.current = !0;
                try {
                    if (!await uv6()) {
                        w("idle");
                        return
                    }
                    if (Y) h("Starting auto-migration from npm to native installation");
                    c("tengu_auto_migrate_to_native_ui_shown", {}), w("migrating"), q?.(!0);
                    let _ = await yWq();
                    if (_.success) w("success"), c("tengu_auto_migrate_to_native_ui_success", {}), K?.({
                        status: "success",
                        version: _.version,
                        notifications: _.notifications
                    }), setTimeout(() => {
                        w("idle"), q?.(!1), A?.()
                    }, 5000);
                    else w("error"), c("tengu_auto_migrate_to_native_ui_error", {}), K?.({
                        status: "install_failed",
                        version: null
                    }), setTimeout(() => {
                        w("idle"), q?.(!1)
                    }, 1e4)
                } catch (O) {
                    K1(O instanceof Error ? O : Error(String(O))), w("error"), K?.({
                        status: "install_failed",
                        version: null
                    }), setTimeout(() => {
                        w("idle"), q?.(!1)
                    }, 1e4)
                }
            }
            $()
        }, [A, q, K, Y]), z === "idle" || z === "checking") return null;
    if (z === "migrating") return gc.createElement(V, {
        dimColor: !0
    }, "Migrating to native installation…");
    if (z === "success") return gc.createElement(V, {
        color: "success"
    }, l1.tick, " Migrated to native installation");
    if (z === "error") return gc.createElement(V, {
        color: "error"
    }, "Migration failed · Run /doctor for details");
    return null
}
// @from(Ln 471974, Col 4)
gc
// @from(Ln 471974, Col 8)
Bv6
// @from(Ln 471975, Col 4)
SWq = v(() => {
    m1();
    b7();
    XgA();
    u6();
    y6();
    Z6();
    gc = o(X1(), 1), Bv6 = o(X1(), 1)
})
// @from(Ln 471985, Col 0)
function hWq(A) {
    let q = e(22),
        {
            isUpdating: K,
            onChangeIsUpdating: Y,
            onAutoUpdaterResult: z,
            autoUpdaterResult: w,
            showSuccessMessage: H,
            verbose: $
        } = A,
        [O, _] = bE.useState(null),
        [J, X] = bE.useState(null),
        [D, j] = bE.useState(null),
        M, P;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) M = () => {
        (async function() {
            let N = await om(),
                T = N === "native",
                k = N === "package-manager";
            if (h(`AutoUpdaterWrapper: Installation type: ${N}`), _(T), X(k), !T && !k) {
                let y = await uv6();
                j(y)
            } else j(!1)
        })()
    }, P = [], q[0] = M, q[1] = P;
    else M = q[0], P = q[1];
    if (bE.useEffect(M, P), O === null || D === null || J === null) return null;
    if (J) {
        let f;
        if (q[2] !== w || q[3] !== K || q[4] !== z || q[5] !== Y || q[6] !== H || q[7] !== $) f = bE.createElement(LWq, {
            verbose: $,
            onAutoUpdaterResult: z,
            autoUpdaterResult: w,
            isUpdating: K,
            onChangeIsUpdating: Y,
            showSuccessMessage: H
        }), q[2] = w, q[3] = K, q[4] = z, q[5] = Y, q[6] = H, q[7] = $, q[8] = f;
        else f = q[8];
        return f
    }
    if (!O && D) {
        let f;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) f = async () => {
            try {
                let T = await om() === "native";
                _(T), j(!1)
            } catch (N) {
                h(`Error checking installation type after migration: ${N}`), _(!0), j(!1)
            }
        }, q[9] = f;
        else f = q[9];
        let Z;
        if (q[10] !== z || q[11] !== Y || q[12] !== $) Z = bE.createElement(CWq, {
            onMigrationComplete: f,
            onChangeIsUpdating: Y,
            onAutoUpdaterResult: z,
            verbose: $
        }), q[10] = z, q[11] = Y, q[12] = $, q[13] = Z;
        else Z = q[13];
        return Z
    }
    let W = O ? vWq : NWq,
        G;
    if (q[14] !== W || q[15] !== w || q[16] !== K || q[17] !== z || q[18] !== Y || q[19] !== H || q[20] !== $) G = bE.createElement(W, {
        verbose: $,
        onAutoUpdaterResult: z,
        autoUpdaterResult: w,
        isUpdating: K,
        onChangeIsUpdating: Y,
        showSuccessMessage: H
    }), q[14] = W, q[15] = w, q[16] = K, q[17] = z, q[18] = Y, q[19] = H, q[20] = $, q[21] = G;
    else G = q[21];
    return G
}
// @from(Ln 472059, Col 4)
bE
// @from(Ln 472060, Col 4)
IWq = v(() => {
    i1();
    TWq();
    EWq();
    RWq();
    SWq();
    am();
    Z6();
    XgA();
    cA();
    bE = o(X1(), 1)
})
// @from(Ln 472073, Col 0)
function xWq(A) {
    let q = e(8),
        {
            tokenUsage: K,
            model: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = Ac(K, Y), q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let {
        percentLeft: w,
        isAboveWarningThreshold: H,
        isAboveErrorThreshold: $
    } = z, O = FCA();
    if (!H || O) return null;
    let _;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) _ = xm(), q[3] = _;
    else _ = q[3];
    let J = _,
        X;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) X = oK1("warning"), q[4] = X;
    else X = q[4];
    let D = X,
        j;
    if (q[5] !== $ || q[6] !== w) j = WY1.createElement(I, {
        flexDirection: "row"
    }, J ? WY1.createElement(V, {
        dimColor: !0
    }, D ? `Context left until auto-compact: ${w}% · ${D}` : `Context left until auto-compact: ${w}%`) : WY1.createElement(V, {
        color: $ ? "error" : "warning"
    }, D ? `Context low (${w}% remaining) · ${D}` : `Context low (${w}% remaining) · Run /compact to compact & continue`)), q[5] = $, q[6] = w, q[7] = j;
    else j = q[7];
    return j
}
// @from(Ln 472107, Col 4)
WY1
// @from(Ln 472108, Col 4)
bWq = v(() => {
    i1();
    m1();
    xd();
    ZZ6();
    XX6();
    WY1 = o(X1(), 1)
})
// @from(Ln 472117, Col 0)
function uWq(A, q) {
    return Ac(A, q).isAboveWarningThreshold
}
// @from(Ln 472120, Col 4)
BWq = v(() => {
    xd()
})
// @from(Ln 472124, Col 0)
function Rf1(A) {
    return mWq.useMemo(() => {
        let q = A?.find((K) => K.name === "ide");
        if (!q) return null;
        return q.type === "connected" ? "connected" : "disconnected"
    }, [A])
}
// @from(Ln 472131, Col 4)
mWq
// @from(Ln 472132, Col 4)
mv6 = v(() => {
    mWq = o(X1(), 1)
})
// @from(Ln 472139, Col 0)
function FWq(A) {
    let q = e(7),
        {
            ideSelection: K,
            mcpClients: Y
        } = A,
        z = Rf1(Y),
        w = z === "connected" && (K?.filePath || K?.text && K.lineCount > 0);
    if (z === null || !w || !K) return null;
    if (K.text && K.lineCount > 0) {
        let H = K.lineCount === 1 ? "line" : "lines",
            $;
        if (q[0] !== K.lineCount || q[1] !== H) $ = xc1.createElement(V, {
            color: "ide",
            key: "selection-indicator"
        }, "⧉ ", K.lineCount, " ", H, " selected"), q[0] = K.lineCount, q[1] = H, q[2] = $;
        else $ = q[2];
        return $
    }
    if (K.filePath) {
        let H;
        if (q[3] !== K.filePath) H = bDz(K.filePath), q[3] = K.filePath, q[4] = H;
        else H = q[4];
        let $;
        if (q[5] !== H) $ = xc1.createElement(V, {
            color: "ide",
            key: "selection-indicator"
        }, "⧉ In ", H), q[5] = H, q[6] = $;
        else $ = q[6];
        return $
    }
}
// @from(Ln 472171, Col 4)
xc1
// @from(Ln 472172, Col 4)
QWq = v(() => {
    i1();
    m1();
    mv6();
    xc1 = o(X1(), 1)
})
// @from(Ln 472179, Col 0)
function UWq() {
    let [A, q] = gWq.useState(null);

    function K() {
        return
    }
    return RX(K, 1e4), A
}
// @from(Ln 472187, Col 4)
gWq
// @from(Ln 472187, Col 9)
uDz = 2147483648
// @from(Ln 472188, Col 4)
BDz = 2684354560
// @from(Ln 472189, Col 4)
pWq = v(() => {
    XZ();
    gWq = o(X1(), 1)
})
// @from(Ln 472194, Col 0)
function dWq() {
    let A = e(5),
        q = UWq();
    return null
}
// @from(Ln 472199, Col 4)
bc1
// @from(Ln 472200, Col 4)
cWq = v(() => {
    i1();
    m1();
    pWq();
    wq();
    bc1 = o(X1(), 1)
})
// @from(Ln 472208, Col 0)
function lWq() {
    let A = e(6),
        [q, K] = yf1.useState(0),
        Y = yf1.useRef(null),
        z = RK("app:toggleTranscript", "Global", "ctrl+o"),
        w, H;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = () => {
        if (!b8.isSandboxingEnabled()) return;
        let _ = b8.getSandboxViolationStore(),
            J = _.getTotalCount(),
            X = _.subscribe(() => {
                let D = _.getTotalCount(),
                    j = D - J;
                if (j > 0) {
                    if (K(j), J = D, Y.current) clearTimeout(Y.current);
                    Y.current = setTimeout(() => {
                        K(0)
                    }, 5000)
                }
            });
        return () => {
            if (X(), Y.current) clearTimeout(Y.current)
        }
    }, H = [], A[0] = w, A[1] = H;
    else w = A[0], H = A[1];
    if (yf1.useEffect(w, H), !b8.isSandboxingEnabled() || q === 0) return null;
    let $ = q === 1 ? "operation" : "operations",
        O;
    if (A[2] !== z || A[3] !== q || A[4] !== $) O = uc1.createElement(I, {
        paddingX: 0,
        paddingY: 0
    }, uc1.createElement(V, {
        color: "inactive"
    }, "⧈ Sandbox blocked ", q, " ", $, " ·", " ", z, " for details · /sandbox to disable")), A[2] = z, A[3] = q, A[4] = $, A[5] = O;
    else O = A[5];
    return O
}
// @from(Ln 472245, Col 4)
uc1
// @from(Ln 472245, Col 9)
yf1
// @from(Ln 472246, Col 4)
iWq = v(() => {
    i1();
    m1();
    k2();
    s2();
    uc1 = o(X1(), 1), yf1 = o(X1(), 1)
})
// @from(Ln 472254, Col 0)
function nWq({
    apiKeyStatus: A,
    autoUpdaterResult: q,
    debug: K,
    isAutoUpdating: Y,
    verbose: z,
    messages: w,
    onAutoUpdaterResult: H,
    onChangeIsUpdating: $,
    ideSelection: O,
    mcpClients: _,
    isInputWrapped: J = !1
}) {
    let X = Fv6.useMemo(() => {
            let l = EN(w);
            return PZ(l)
        }, [w]),
        D = l3(),
        j = uWq(X, D),
        M = Rf1(_),
        P = v6((l) => l.notifications),
        {
            addNotification: W,
            removeNotification: G
        } = iq(),
        f = Eo(),
        N = !(M === "connected" && (O?.filePath || O?.text && O.lineCount > 0)) || Y || q?.status !== "success",
        T = f.isUsingOverage,
        k = dK(),
        y = k === "team" || k === "enterprise",
        B = FI(),
        S = J && !j && A !== "invalid" && A !== "missing" && B !== void 0;
    Fv6.useEffect(() => {
        if (S && B) c("tengu_external_editor_hint_shown", {}), W({
            key: "external-editor-hint",
            jsx: D5.createElement(V, {
                dimColor: !0
            }, D5.createElement(NA, {
                action: "chat:externalEditor",
                context: "Chat",
                fallback: "ctrl+g",
                description: `edit in ${S_(B)}`
            })),
            priority: "immediate",
            timeoutMs: 5000
        });
        else G("external-editor-hint")
    }, [S, B, W, G]);
    let m = "idle",
        b = !1,
        g = 0,
        U = null,
        x = "",
        p = "";
    return D5.createElement(lK1, null, D5.createElement(I, {
        flexDirection: "column",
        alignItems: "flex-end",
        flexShrink: 1,
        overflowX: "hidden"
    }, D5.createElement(FWq, {
        ideSelection: O,
        mcpClients: _
    }), P.current && ("jsx" in P.current ? D5.createElement(I, {
        key: P.current.key
    }, P.current.jsx) : D5.createElement(V, {
        color: P.current.color,
        dimColor: !P.current.color
    }, P.current.text)), T && !y && D5.createElement(I, null, D5.createElement(V, {
        dimColor: !0
    }, "Now using extra usage")), A === "invalid" && D5.createElement(I, null, D5.createElement(V, {
        color: "error"
    }, "Not logged in · Run /login")), A === "missing" && D5.createElement(I, null, D5.createElement(V, {
        color: "error"
    }, "Not logged in · Run /login")), K && D5.createElement(I, null, D5.createElement(V, {
        color: "warning"
    }, "Debug mode")), A !== "invalid" && A !== "missing" && z && D5.createElement(I, null, D5.createElement(V, {
        dimColor: !0
    }, X, " tokens")), D5.createElement(xWq, {
        tokenUsage: X,
        model: D
    }), N && D5.createElement(hWq, {
        verbose: z,
        onAutoUpdaterResult: H,
        autoUpdaterResult: q,
        isUpdating: Y,
        onChangeIsUpdating: $,
        showSuccessMessage: !j
    }), null, null, D5.createElement(dWq, null), D5.createElement(lWq, null)))
}
// @from(Ln 472343, Col 4)
D5
// @from(Ln 472343, Col 8)
Fv6
// @from(Ln 472343, Col 13)
Qv6 = 5000
// @from(Ln 472344, Col 4)
gv6 = v(() => {
    m1();
    IWq();
    OX6();
    bWq();
    BWq();
    QWq();
    mv6();
    d8();
    e7();
    h2();
    cWq();
    u6();
    YF();
    q$();
    RW();
    N8();
    iWq();
    BK();
    s2();
    nu();
    J7();
    D5 = o(X1(), 1), Fv6 = o(X1(), 1)
})
// @from(Ln 472368, Col 0)
async function mDz(A, q) {
    let K = Math.ceil(A / rWq) * rWq;
    if (ZY1 && Uv6 >= K && DgA === q) return ZY1;
    if (ZY1) await ZY1;
    Uv6 = K, DgA = q, ZY1 = (async () => {
        let Y = [],
            z = 0;
        for await (let w of l26()) {
            if (q) {
                if (_B(w.display) !== q) continue
            }
            if (Y.push(w), z++, z >= Uv6) break
        }
        return Y
    })();
    try {
        return await ZY1
    } finally {
        ZY1 = null, Uv6 = 0, DgA = void 0
    }
}
// @from(Ln 472390, Col 0)
function oWq(A, q, K, Y, z) {
    let [w, H] = z_.useState(0), [$, O] = z_.useState(void 0), _ = z_.useRef(!1), {
        addNotification: J,
        removeNotification: X
    } = iq(), D = z_.useRef([]), j = z_.useRef(void 0), M = z_.useRef(0), P = z_.useRef(void 0), W = z_.useRef(q), G = z_.useRef(K), f = z_.useRef(z);
    W.current = q, G.current = K, f.current = z;
    let Z = z_.useCallback((m, b, g, U = !1) => {
            A(m, b, g), Y?.(U ? 0 : m.length)
        }, [A, Y]),
        N = z_.useCallback((m, b = !1) => {
            if (!m || !m.display) return;
            let g = _B(m.display),
                U = g === "bash" || g === "background" ? m.display.slice(1) : m.display;
            Z(U, g, m.pastedContents ?? {}, b)
        }, [Z]),
        T = z_.useCallback(() => {
            J({
                key: "search-history-hint",
                jsx: z_.default.createElement(V, {
                    dimColor: !0
                }, z_.default.createElement(NA, {
                    action: "history:search",
                    context: "Global",
                    fallback: "ctrl+r",
                    description: "search history"
                })),
                priority: "immediate",
                timeoutMs: Qv6
            })
        }, [J]),
        k = z_.useCallback(() => {
            let m = M.current;
            M.current++;
            let b = W.current,
                g = G.current,
                U = f.current;
            if (m === 0) {
                P.current = U === "bash" || U === "background" ? U : void 0;
                let p = b.trim() !== "";
                O(p ? {
                    display: b,
                    pastedContents: g,
                    mode: U
                } : void 0)
            }
            let x = P.current;
            (async () => {
                let p = m + 1;
                if (j.current !== x) D.current = [], j.current = x, M.current = 0;
                if (D.current.length < p) {
                    let r = await mDz(p, x);
                    if (r.length > D.current.length) D.current = r
                }
                if (m >= D.current.length) {
                    M.current--;
                    return
                }
                let l = m + 1;
                if (H(l), N(D.current[m], !0), l >= 2 && !_.current) _.current = !0, T()
            })()
        }, [N, T]),
        y = z_.useCallback(() => {
            let m = M.current;
            if (m > 1) M.current--, H(m - 1), N(D.current[m - 2]);
            else if (m === 1)
                if (M.current = 0, H(0), $) {
                    let b = $.mode;
                    if (b) Z($.display, b, $.pastedContents ?? {});
                    else N($)
                } else Z("", P.current ?? "prompt", {});
            return m <= 0
        }, [$, N, Z]),
        B = z_.useCallback(() => {
            O(void 0), H(0), M.current = 0, P.current = void 0, X("search-history-hint"), D.current = [], j.current = void 0
        }, [X]),
        S = z_.useCallback(() => {
            X("search-history-hint")
        }, [X]);
    return {
        historyIndex: w,
        setHistoryIndex: H,
        onHistoryUp: k,
        onHistoryDown: y,
        resetHistory: B,
        dismissSearchHint: S
    }
}
// @from(Ln 472477, Col 4)
z_
// @from(Ln 472477, Col 8)
rWq = 10
// @from(Ln 472478, Col 4)
ZY1 = null
// @from(Ln 472479, Col 4)
Uv6 = 0
// @from(Ln 472480, Col 4)
DgA = void 0
// @from(Ln 472481, Col 4)
aWq = v(() => {
    m1();
    nS();
    gv6();
    h2();
    BK();
    z_ = o(X1(), 1)
})
// @from(Ln 472490, Col 0)
function tWq(A) {
    return typeof A === "object" && A !== null && "userFacingName" in A && typeof A.userFacingName === "function" && "type" in A
}
// @from(Ln 472494, Col 0)
function pv6(A, q) {
    if (A.startsWith("/")) return null;
    let Y = A.slice(0, q).match(/(?<=\s)\/([a-zA-Z0-9_:-]*)$/);
    if (!Y || Y.index === void 0) return null;
    let z = Y.index,
        H = A.slice(z + 1).match(/^[a-zA-Z0-9_:-]*/),
        $ = H ? H[0] : "";
    if (q > z + 1 + $.length) return null;
    return {
        token: "/" + $,
        startPos: z,
        partialCommand: $
    }
}
// @from(Ln 472509, Col 0)
function MgA(A, q) {
    if (!A) return null;
    let K = PgA("/" + A, q);
    if (K.length === 0) return null;
    let Y = A.toLowerCase();
    for (let z of K) {
        if (!tWq(z.metadata)) continue;
        let w = z.metadata.userFacingName();
        if (w.toLowerCase().startsWith(Y)) {
            let H = w.slice(A.length);
            if (H) return {
                suffix: H,
                fullCommand: w
            }
        }
    }
    return null
}
// @from(Ln 472528, Col 0)
function NF(A) {
    return A.startsWith("/")
}
// @from(Ln 472532, Col 0)
function QDz(A) {
    if (!NF(A)) return !1;
    if (!A.includes(" ")) return !1;
    if (A.endsWith(" ")) return !1;
    return !0
}
// @from(Ln 472539, Col 0)
function gDz(A) {
    return `/${A} `
}
// @from(Ln 472543, Col 0)
function jgA(A) {
    let q = A.userFacingName();
    if (A.type === "prompt") {
        if (A.source === "plugin" && A.pluginInfo?.repository) return `${q}:${A.source}:${A.pluginInfo.repository}`;
        return `${q}:${A.source}`
    }
    return `${q}:${A.type}`
}
// @from(Ln 472552, Col 0)
function UDz(A, q) {
    if (!q || q.length === 0 || A === "") return;
    return q.find((K) => K.toLowerCase().startsWith(A))
}
// @from(Ln 472557, Col 0)
function sWq(A, q) {
    let K = A.userFacingName(),
        Y = q ? ` (${q})` : "",
        z = jZ1(A) + (A.type === "prompt" && A.argNames?.length ? ` (arguments: ${A.argNames.join(", ")})` : "");
    return {
        id: jgA(A),
        displayText: `/${K}${Y}`,
        description: z,
        metadata: A
    }
}
// @from(Ln 472569, Col 0)
function PgA(A, q) {
    if (!NF(A)) return [];
    if (QDz(A)) return [];
    let K = A.slice(1).toLowerCase().trim();
    if (K === "") {
        let $ = q.filter((W) => !W.isHidden),
            O = [],
            _ = $.filter((W) => W.type === "prompt").map((W) => ({
                cmd: W,
                score: bM6(W.userFacingName())
            })).filter((W) => W.score > 0).sort((W, G) => G.score - W.score);
        for (let W of _.slice(0, 5)) O.push(W.cmd);
        let J = new Set(O.map((W) => jgA(W))),
            X = [],
            D = [],
            j = [],
            M = [];
        $.forEach((W) => {
            if (J.has(jgA(W))) return;
            if (W.type === "prompt" && (W.source === "userSettings" || W.source === "localSettings")) X.push(W);
            else if (W.type === "prompt" && W.source === "projectSettings") D.push(W);
            else if (W.type === "prompt" && W.source === "policySettings") j.push(W);
            else M.push(W)
        });
        let P = (W, G) => W.userFacingName().localeCompare(G.userFacingName());
        return X.sort(P), D.sort(P), j.sort(P), M.sort(P), [...O, ...X, ...D, ...j, ...M].map((W) => sWq(W))
    }
    let Y = q.filter(($) => !$.isHidden).map(($) => {
        let O = $.userFacingName(),
            _ = O.split(FDz).filter(Boolean);
        return {
            nameKey: O,
            descriptionKey: $.description.split(" ").map((J) => pDz(J)).filter(Boolean),
            partKey: _.length > 1 ? _ : void 0,
            commandName: O,
            command: $,
            aliasKey: $.aliases
        }
    });
    return [...new wy(Y, {
        includeScore: !0,
        threshold: 0.3,
        location: 0,
        distance: 100,
        keys: [{
            name: "commandName",
            weight: 3
        }, {
            name: "partKey",
            weight: 2
        }, {
            name: "aliasKey",
            weight: 2
        }, {
            name: "descriptionKey",
            weight: 0.5
        }]
    }).search(K)].sort(($, O) => {
        let _ = $.item.commandName.toLowerCase(),
            J = O.item.commandName.toLowerCase(),
            X = $.item.aliasKey?.map((B) => B.toLowerCase()) ?? [],
            D = O.item.aliasKey?.map((B) => B.toLowerCase()) ?? [],
            j = _ === K,
            M = J === K;
        if (j && !M) return -1;
        if (M && !j) return 1;
        let P = X.some((B) => B === K),
            W = D.some((B) => B === K);
        if (P && !W) return -1;
        if (W && !P) return 1;
        let G = _.startsWith(K),
            f = J.startsWith(K);
        if (G && !f) return -1;
        if (f && !G) return 1;
        let Z = X.some((B) => B.startsWith(K)),
            N = D.some((B) => B.startsWith(K));
        if (Z && !N) return -1;
        if (N && !Z) return 1;
        let T = ($.score ?? 0) - (O.score ?? 0);
        if (Math.abs(T) > 0.1) return T;
        let k = $.item.command.type === "prompt" ? bM6($.item.command.userFacingName()) : 0;
        return (O.item.command.type === "prompt" ? bM6(O.item.command.userFacingName()) : 0) - k
    }).map(($) => {
        let O = $.item.command,
            _ = UDz(K, O.aliases);
        return sWq(O, _)
    })
}
// @from(Ln 472658, Col 0)
function WgA(A, q, K, Y, z, w) {
    let H, $;
    if (typeof A === "string") H = A, $ = q ? zI(H, K) : void 0;
    else {
        if (!tWq(A.metadata)) return;
        H = A.metadata.userFacingName(), $ = A.metadata
    }
    let O = gDz(H);
    if (Y(O), z(O.length), q && $) {
        if ($.type !== "prompt" || ($.argNames ?? []).length === 0) w(O, !0)
    }
}
// @from(Ln 472671, Col 0)
function pDz(A) {
    return A.toLowerCase().replace(/[^a-z0-9]/g, "")
}
// @from(Ln 472675, Col 0)
function eWq(A) {
    let q = [],
        K = /(^|[\s])(\/[a-zA-Z][a-zA-Z0-9:\-_]*)/g,
        Y = null;
    while ((Y = K.exec(A)) !== null) {
        let z = Y[1] ?? "",
            w = Y[2] ?? "",
            H = Y.index + z.length;
        q.push({
            start: H,
            end: H + w.length
        })
    }
    return q
}
// @from(Ln 472690, Col 4)
FDz
// @from(Ln 472691, Col 4)
GgA = v(() => {
    yf6();
    c$();
    uM6();
    FDz = /[:_-]/g
})
// @from(Ln 472698, Col 0)
function qGq(A) {
    return typeof A === "object" && A !== null && "op" in A && cDz.includes(A.op)
}
// @from(Ln 472702, Col 0)
function AGq(A) {
    if (A.startsWith("$")) return "variable";
    if (A.includes("/") || A.startsWith("~") || A.startsWith(".")) return "file";
    return "command"
}
// @from(Ln 472708, Col 0)
function lDz(A) {
    for (let q = A.length - 1; q >= 0; q--)
        if (typeof A[q] === "string") return {
            token: A[q],
            index: q
        };
    return null
}
// @from(Ln 472717, Col 0)
function iDz(A, q) {
    if (q === 0) return !0;
    let K = A[q - 1];
    return K !== void 0 && qGq(K)
}
// @from(Ln 472723, Col 0)
function nDz(A, q) {
    let K = A.slice(0, q),
        Y = K.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
    if (Y) return {
        prefix: Y[0],
        completionType: "variable"
    };
    let z = pz(K);
    if (!z.success) {
        let O = K.split(/\s+/),
            _ = O[O.length - 1] || "",
            X = O.length === 1 && !K.includes(" ") ? "command" : AGq(_);
        return {
            prefix: _,
            completionType: X
        }
    }
    let w = lDz(z.tokens);
    if (!w) {
        let O = z.tokens[z.tokens.length - 1];
        return {
            prefix: "",
            completionType: O && qGq(O) ? "command" : "command"
        }
    }
    if (K.endsWith(" ")) return {
        prefix: "",
        completionType: "file"
    };
    let H = AGq(w.token);
    if (H === "variable" || H === "file") return {
        prefix: w.token,
        completionType: H
    };
    let $ = iDz(z.tokens, w.index) ? "command" : "file";
    return {
        prefix: w.token,
        completionType: $
    }
}
// @from(Ln 472764, Col 0)
function rDz(A, q) {
    if (q === "variable") {
        let K = A.slice(1);
        return `compgen -v ${R7([K])} 2>/dev/null`
    } else if (q === "file") return `compgen -f ${R7([A])} 2>/dev/null | head -${ZgA} | while IFS= read -r f; do [ -d "$f" ] && echo "$f/" || echo "$f "; done`;
    else return `compgen -c ${R7([A])} 2>/dev/null`
}
// @from(Ln 472772, Col 0)
function oDz(A, q) {
    if (q === "variable") {
        let K = A.slice(1);
        return `print -rl -- \${(k)parameters[(I)${R7([K])}*]} 2>/dev/null`
    } else if (q === "file") return `for f in ${R7([A])}*(N[1,${ZgA}]); do [[ -d "$f" ]] && echo "$f/" || echo "$f "; done`;
    else return `print -rl -- \${(k)commands[(I)${R7([A])}*]} 2>/dev/null`
}
// @from(Ln 472779, Col 0)
async function aDz(A, q, K, Y) {
    let z;
    if (A === "bash") z = rDz(q, K);
    else if (A === "zsh") z = oDz(q, K);
    else return [];
    return (await (await bW6(z, Y, dDz)).result).stdout.split(`
`).filter(($) => $.trim()).slice(0, ZgA).map(($) => ({
        id: $,
        displayText: $,
        description: void 0,
        metadata: {
            completionType: K
        }
    }))
}
// @from(Ln 472794, Col 0)
async function KGq(A, q, K) {
    let Y = eG1();
    if (Y !== "bash" && Y !== "zsh") return [];
    try {
        let {
            prefix: z,
            completionType: w
        } = nDz(A, q);
        if (!z) return [];
        return (await aDz(Y, z, w, K)).map(($) => ({
            ...$,
            metadata: {
                ...$.metadata,
                inputSnapshot: A
            }
        }))
    } catch (z) {
        return h(`Shell completion failed: ${z}`), []
    }
}
// @from(Ln 472814, Col 4)
ZgA = 15
// @from(Ln 472815, Col 4)
dDz = 1000
// @from(Ln 472816, Col 4)
cDz
// @from(Ln 472817, Col 4)
YGq = v(() => {
    D91();
    VI();
    Z6();
    M_();
    cDz = ["|", "||", "&&", ";"]
})
// @from(Ln 472824, Col 0)
async function tDz() {
    let A = Date.now();
    if (fgA && A - zGq < sDz) return fgA;
    let q = [],
        K = new Set;
    try {
        for await (let Y of l26()) {
            if (Y.display && Y.display.startsWith("!")) {
                let z = Y.display.slice(1).trim();
                if (z && !K.has(z)) K.add(z), q.push(z)
            }
            if (q.length >= 50) break
        }
    } catch (Y) {
        h(`Failed to read bash history: ${Y}`)
    }
    return fgA = q, zGq = A, q
}
// @from(Ln 472842, Col 0)
async function wGq(A) {
    if (!A || A.length < 2) return null;
    if (!A.trim()) return null;
    let K = await tDz();
    for (let Y of K)
        if (Y.startsWith(A) && Y !== A) return {
            fullCommand: Y,
            suffix: Y.slice(A.length)
        };
    return null
}
// @from(Ln 472853, Col 4)
fgA = null
// @from(Ln 472854, Col 4)
zGq = 0
// @from(Ln 472855, Col 4)
sDz = 60000
// @from(Ln 472856, Col 4)
HGq = v(() => {
    nS();
    Z6()
})
// @from(Ln 472862, Col 0)
function $Gq(A) {
    switch (A.type) {
        case "file":
            return {
                id: `file-${A.path}`, displayText: A.displayText, description: A.description
            };
        case "mcp_resource":
            return {
                id: `mcp-resource-${A.server}__${A.uri}`, displayText: A.displayText, description: A.description
            };
        case "agent":
            return {
                id: `agent-${A.agentType}`, displayText: A.displayText, description: A.description, color: A.color
            }
    }
}
// @from(Ln 472879, Col 0)
function _Gq(A) {
    return K3(A, eDz)
}
// @from(Ln 472883, Col 0)
function A0z(A, q, K = !1) {
    if (!q && !K) return [];
    try {
        let Y = A.map((w) => ({
            type: "agent",
            displayText: `${w.agentType} (agent)`,
            description: _Gq(w.whenToUse),
            agentType: w.agentType,
            color: IK1(w.agentType)
        }));
        if (!q) return Y;
        let z = q.toLowerCase();
        return Y.filter((w) => w.agentType.toLowerCase().includes(z) || w.displayText.toLowerCase().includes(z))
    } catch (Y) {
        return K1(Y), []
    }
}
// @from(Ln 472900, Col 0)
async function NgA(A, q, K, Y = !1) {
    if (!A && !Y) return [];
    let [z, w] = await Promise.all([gAq(A, Y), Promise.resolve(A0z(K, A, Y))]), H = z.map((J) => ({
        type: "file",
        displayText: J.displayText,
        description: J.description,
        path: J.displayText,
        filename: OGq.basename(J.displayText),
        score: J.metadata?.score
    })), $ = Object.values(q).flat().map((J) => ({
        type: "mcp_resource",
        displayText: `${J.server}:${J.uri}`,
        description: _Gq(J.description || J.name || J.uri),
        server: J.server,
        uri: J.uri,
        name: J.name || J.uri
    }));
    if (!A) return [...H, ...$, ...w].slice(0, VgA).map($Gq);
    let O = [...$, ...w],
        _ = [];
    for (let J of H) _.push({
        source: J,
        score: J.score ?? 0.5
    });
    if (O.length > 0) {
        let X = new wy(O, {
            includeScore: !0,
            threshold: 0.6,
            keys: [{
                name: "displayText",
                weight: 2
            }, {
                name: "name",
                weight: 3
            }, {
                name: "server",
                weight: 1
            }, {
                name: "description",
                weight: 1
            }, {
                name: "agentType",
                weight: 3
            }]
        }).search(A, {
            limit: VgA
        });
        for (let D of X) _.push({
            source: D.item,
            score: D.score ?? 0.5
        })
    }
    return _.sort((J, X) => J.score - X.score), _.slice(0, VgA).map((J) => J.source).map($Gq)
}
// @from(Ln 472954, Col 4)
VgA = 15
// @from(Ln 472955, Col 4)
eDz = 60
// @from(Ln 472956, Col 4)
JGq = v(() => {
    yf6();
    lM();
    vq();
    y6();
    xf6()
})
// @from(Ln 472964, Col 0)
function Bc1(A) {
    return typeof A === "object" && A !== null && "type" in A && (A.type === "directory" || A.type === "file")
}
// @from(Ln 472968, Col 0)
function Cf1(A, q, K) {
    if (K.length === 0) return -1;
    if (q < 0) return 0;
    let Y = A[q];
    if (!Y) return 0;
    let z = K.findIndex((w) => w.id === Y.id);
    return z >= 0 ? z : 0
}
// @from(Ln 472977, Col 0)
function DGq(A) {
    let q = A.metadata;
    return q?.sessionId ? `/resume ${q.sessionId}` : `/resume ${A.displayText}`
}
// @from(Ln 472982, Col 0)
function jGq(A) {
    if (A.isQuoted) return A.token.slice(2).replace(/"$/, "");
    else if (A.token.startsWith("@")) return A.token.substring(1);
    else return A.token
}
// @from(Ln 472988, Col 0)
function TgA(A) {
    let {
        displayText: q,
        mode: K,
        hasAtPrefix: Y,
        needsQuotes: z,
        isQuoted: w,
        isComplete: H
    } = A, $ = H ? " " : "";
    if (w || z) return K === "bash" ? `"${q}"${$}` : `@"${q}"${$}`;
    else if (Y) return K === "bash" ? `${q}${$}` : `@${q}${$}`;
    else return q
}
// @from(Ln 473002, Col 0)
function vgA(A, q, K, Y, z, w) {
    let O = q.slice(0, K).lastIndexOf(" ") + 1,
        _;
    if (w === "variable") _ = "$" + A.displayText + " ";
    else if (w === "command") _ = A.displayText + " ";
    else _ = A.displayText;
    let J = q.slice(0, O) + _ + q.slice(K);
    Y(J), z(O + _.length)
}
// @from(Ln 473011, Col 0)
async function w0z(A, q) {
    try {
        if (dv6) dv6.abort();
        return dv6 = new AbortController, await KGq(A, q, dv6.signal)
    } catch {
        return c("tengu_shell_completion_failed", {}), []
    }
}
// @from(Ln 473020, Col 0)
function MGq(A, q, K, Y, z) {
    let w = z ? "/" : " ",
        H = A.slice(0, K),
        $ = A.slice(K + Y),
        O = "@" + q + w;
    return {
        newInput: H + O + $,
        cursorPos: H.length + O.length
    }
}
// @from(Ln 473031, Col 0)
function Uc(A, q, K = !1) {
    if (!A) return null;
    let Y = A.substring(0, q);
    if (K) {
        let _ = /@"([^"]*)"?$/,
            J = Y.match(_);
        if (J && J.index !== void 0) {
            let D = A.substring(q).match(/^[^"]*"?/),
                j = D ? D[0] : "";
            return {
                token: J[0] + j,
                startPos: J.index,
                isQuoted: !0
            }
        }
    }
    if (K) {
        let _ = Y.lastIndexOf("@");
        if (_ >= 0 && (_ === 0 || /\s/.test(Y[_ - 1]))) {
            let J = Y.substring(_),
                X = J.match(q0z);
            if (X && X[0].length === J.length) {
                let j = A.substring(q).match(XGq),
                    M = j ? j[0] : "";
                return {
                    token: X[0] + M,
                    startPos: _,
                    isQuoted: !1
                }
            }
        }
    }
    let z = K ? K0z : Y0z,
        w = Y.match(z);
    if (!w || w.index === void 0) return null;
    let $ = A.substring(q).match(XGq),
        O = $ ? $[0] : "";
    return {
        token: w[0] + O,
        startPos: w.index,
        isQuoted: !1
    }
}
// @from(Ln 473075, Col 0)
function H0z(A) {
    if (NF(A)) {
        let q = A.indexOf(" ");
        if (q === -1) return {
            commandName: A.slice(1),
            args: ""
        };
        return {
            commandName: A.slice(1, q),
            args: A.slice(q + 1)
        }
    }
    return null
}
// @from(Ln 473090, Col 0)
function PGq(A, q) {
    return !A && q.includes(" ") && !q.endsWith(" ")
}