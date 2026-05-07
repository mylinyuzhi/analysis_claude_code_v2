
// @from(Ln 523832, Col 0)
function NK5(q) {
    let K = s(34),
        {
            toolUseConfirm: _,
            toolUseContext: z,
            onDone: Y,
            onReject: A,
            verbose: O,
            workerBadge: w,
            setStickyFooter: $
        } = q,
        {
            tool: j,
            input: H
        } = _,
        J;
    if (K[0] !== H || K[1] !== j.inputSchema) J = j.inputSchema.safeParse(H), K[0] = H, K[1] = j.inputSchema, K[2] = J;
    else J = K[2];
    let X = J,
        M = BW6.useRef(!1),
        P;
    if (K[3] !== Y || K[4] !== A || K[5] !== _) P = () => {
        Y(), A(), _.onReject()
    }, K[3] = Y, K[4] = A, K[5] = _, K[6] = P;
    else P = K[6];
    let W;
    if (K[7] !== X.success) W = {
        context: "Confirmation",
        isActive: X.success
    }, K[7] = X.success, K[8] = W;
    else W = K[8];
    G1("app:interrupt", P, W);
    let D;
    if (K[9] !== X.success || K[10] !== _) D = X.success ? f5A(_) : "", K[9] = X.success, K[10] = _, K[11] = D;
    else D = K[11];
    Fz8(D, "permission_prompt");
    let G;
    if (K[12] !== X.error || K[13] !== X.success || K[14] !== Y || K[15] !== j.name || K[16] !== _) G = () => {
        if (X.success || M.current) return;
        M.current = !0;
        let N = ab6(j.name, X.error);
        j6(Error(`Permission dialog opened with invalid input — upstream should have validated. ${N}`)), _.onReject(N), Y()
    }, K[12] = X.error, K[13] = X.success, K[14] = Y, K[15] = j.name, K[16] = _, K[17] = G;
    else G = K[17];
    let f;
    if (K[18] !== X || K[19] !== Y || K[20] !== j || K[21] !== _) f = [X, j, _, Y], K[18] = X, K[19] = Y, K[20] = j, K[21] = _, K[22] = f;
    else f = K[22];
    if (BW6.useEffect(G, f), !X.success) return null;
    let v;
    if (K[23] !== _.tool) v = Z5A(_.tool), K[23] = _.tool, K[24] = v;
    else v = K[24];
    let V = v,
        k;
    if (K[25] !== V || K[26] !== Y || K[27] !== A || K[28] !== $ || K[29] !== _ || K[30] !== z || K[31] !== O || K[32] !== w) k = BW6.createElement(V, {
        toolUseContext: z,
        toolUseConfirm: _,
        onDone: Y,
        onReject: A,
        verbose: O,
        workerBadge: w,
        setStickyFooter: $
    }), K[25] = V, K[26] = Y, K[27] = A, K[28] = $, K[29] = _, K[30] = z, K[31] = O, K[32] = w, K[33] = k;
    else k = K[33];
    return k
}
// @from(Ln 523897, Col 4)
BW6
// @from(Ln 523897, Col 9)
J5A = null
// @from(Ln 523898, Col 4)
X5A = null
// @from(Ln 523899, Col 4)
M5A = null
// @from(Ln 523900, Col 4)
P5A = null
// @from(Ln 523901, Col 4)
W5A
// @from(Ln 523901, Col 9)
D5A
// @from(Ln 523902, Col 4)
EK5 = L(() => {
    o6();
    v37();
    n58();
    nX7();
    C7();
    Xd8();
    AZ();
    A_6();
    aF();
    rl();
    yb6();
    c96();
    DM6();
    PI6();
    XU8();
    ib6();
    U8();
    sb6();
    _45();
    i45();
    o45();
    HM7();
    JM7();
    t45();
    qK5();
    YK5();
    $K5();
    ZK5();
    GK5();
    TK5();
    BW6 = K6(P6(), 1), W5A = (md8(), B7(U37)).MonitorTool, D5A = (kK5(), B7(VK5)).MonitorPermissionRequest
})
// @from(Ln 523935, Col 0)
async function yK5(q, K, _) {
    let z = new Date,
        Y = z.toISOString(),
        A = -z.getTimezoneOffset(),
        O = Math.floor(Math.abs(A) / 60),
        w = Math.abs(A) % 60,
        j = `${A>=0?"+":"-"}${String(O).padStart(2,"0")}:${String(w).padStart(2,"0")}`,
        H = z.toLocaleDateString("en-US", {
            weekday: "long"
        }),
        J = sK(["You are a date/time parser that converts natural language into ISO 8601 format.", "You MUST respond with ONLY the ISO 8601 formatted string, with no explanation or additional text.", "If the input is ambiguous, prefer future dates over past dates.", "For times without dates, use today's date.", "For dates without times, do not include a time component.", 'If the input is incomplete or you cannot confidently parse it into a valid date, respond with exactly "INVALID" (nothing else).', 'Examples of INVALID input: partial dates like "2025-01-", lone numbers like "13", gibberish.', 'Examples of valid natural language: "tomorrow", "next Monday", "jan 1st 2025", "in 2 hours", "yesterday".']),
        X = K === "date" ? "YYYY-MM-DD (date only, no time)" : `YYYY-MM-DDTHH:MM:SS${j} (full date-time with timezone)`,
        M = `Current context:
- Current date and time: ${Y} (UTC)
- Local timezone: ${j}
- Day of week: ${H}

User input: "${q}"

Output format: ${X}

Parse the user's input into ISO 8601 format. Return ONLY the formatted string, or "INVALID" if the input is incomplete or unparseable.`;
    try {
        let P = await ov({
                systemPrompt: J,
                userPrompt: M,
                signal: _,
                options: {
                    querySource: "mcp_datetime_parse",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: [],
                    enablePromptCaching: !1
                }
            }),
            W = s5(P.message.content).trim();
        if (!W || W === "INVALID") return {
            success: !1,
            error: "Unable to parse date/time from input"
        };
        if (!/^\d{4}/.test(W)) return {
            success: !1,
            error: "Unable to parse date/time from input"
        };
        return {
            success: !0,
            value: W
        }
    } catch (P) {
        return j6(P), {
            success: !1,
            error: "Unable to parse date/time. Please enter in ISO 8601 format manually."
        }
    }
}
// @from(Ln 523992, Col 0)
function LK5(q) {
    return /^\d{4}-\d{2}-\d{2}(T|$)/.test(q.trim())
}
// @from(Ln 523995, Col 4)
hK5 = L(() => {
    O2();
    U8();
    _7()
})
// @from(Ln 524001, Col 0)
function pW6(q) {
    return q.type === "array" && "items" in q && typeof q.items === "object" && q.items !== null && (("enum" in q.items) || ("anyOf" in q.items))
}
// @from(Ln 524005, Col 0)
function iz8(q) {
    if ("anyOf" in q.items) return q.items.anyOf.map((K) => K.const);
    if ("enum" in q.items) return q.items.enum;
    return []
}
// @from(Ln 524011, Col 0)
function G5A(q) {
    if ("anyOf" in q.items) return q.items.anyOf.map((K) => K.title);
    if ("enum" in q.items) return q.items.enum;
    return []
}
// @from(Ln 524017, Col 0)
function rz8(q, K) {
    let _ = iz8(q).indexOf(K);
    return _ >= 0 ? G5A(q)[_] ?? K : K
}
// @from(Ln 524022, Col 0)
function Mm6(q) {
    if ("oneOf" in q) return q.oneOf.map((K) => K.const);
    if ("enum" in q) return q.enum;
    return []
}
// @from(Ln 524028, Col 0)
function v5A(q) {
    if ("oneOf" in q) return q.oneOf.map((K) => K.title);
    if ("enum" in q) return ("enumNames" in q ? q.enumNames : void 0) ?? q.enum;
    return []
}
// @from(Ln 524034, Col 0)
function oz8(q, K) {
    let _ = Mm6(q).indexOf(K);
    return _ >= 0 ? v5A(q)[_] ?? K : K
}
// @from(Ln 524039, Col 0)
function T5A(q) {
    if (dn(q)) {
        let [K, ..._] = Mm6(q);
        if (!K) return y.never();
        return y.enum([K, ..._])
    }
    if (q.type === "string") {
        let K = y.string();
        if (q.minLength !== void 0) K = K.min(q.minLength, {
            message: `Must be at least ${q.minLength} ${O7(q.minLength,"character")}`
        });
        if (q.maxLength !== void 0) K = K.max(q.maxLength, {
            message: `Must be at most ${q.maxLength} ${O7(q.maxLength,"character")}`
        });
        switch (q.format) {
            case "email":
                K = K.email({
                    message: "Must be a valid email address, e.g. user@example.com"
                });
                break;
            case "uri":
                K = K.url({
                    message: "Must be a valid URI, e.g. https://example.com"
                });
                break;
            case "date":
                K = K.date("Must be a valid date, e.g. 2024-03-15, today, next Monday");
                break;
            case "date-time":
                K = K.datetime({
                    offset: !0,
                    message: "Must be a valid date-time, e.g. 2024-03-15T14:30:00Z, tomorrow at 3pm"
                });
                break;
            default:
                break
        }
        return K
    }
    if (q.type === "number" || q.type === "integer") {
        let K = q.type === "integer" ? "an integer" : "a number",
            _ = q.type === "integer",
            z = (O) => Number.isInteger(O) && !_ ? `${O}.0` : String(O),
            Y = q.minimum !== void 0 && q.maximum !== void 0 ? `Must be ${K} between ${z(q.minimum)} and ${z(q.maximum)}` : q.minimum !== void 0 ? `Must be ${K} >= ${z(q.minimum)}` : q.maximum !== void 0 ? `Must be ${K} <= ${z(q.maximum)}` : `Must be ${K}`,
            A = y.coerce.number({
                error: Y
            });
        if (q.type === "integer") A = A.int({
            message: Y
        });
        if (q.minimum !== void 0) A = A.min(q.minimum, {
            message: Y
        });
        if (q.maximum !== void 0) A = A.max(q.maximum, {
            message: Y
        });
        return A
    }
    if (q.type === "boolean") return y.coerce.boolean();
    throw Error(`Unsupported schema: ${I6(q)}`)
}
// @from(Ln 524101, Col 0)
function nz8(q, K) {
    let z = T5A(K).safeParse(q);
    if (z.success) return {
        value: z.data,
        isValid: !0
    };
    return {
        isValid: !1,
        error: z.error.issues.map((Y) => Y.message).join("; ")
    }
}
// @from(Ln 524113, Col 0)
function az8(q) {
    return q.type === "string" && "format" in q && (q.format === "date" || q.format === "date-time")
}
// @from(Ln 524116, Col 0)
async function RK5(q, K, _) {
    let z = nz8(q, K);
    if (z.isValid) return z;
    if (az8(K) && !LK5(q)) {
        let Y = await yK5(q, K.format, _);
        if (Y.success) {
            let A = nz8(Y.value, K);
            if (A.isValid) return A
        }
    }
    return z
}
// @from(Ln 524128, Col 4)
dn = (q) => {
    return q.type === "string" && (("enum" in q) || ("oneOf" in q))
}
// @from(Ln 524131, Col 4)
SK5 = L(() => {
    p7();
    e8();
    hK5()
})
// @from(Ln 524137, Col 0)
function k5A(q) {
    q.buffer = "", q.timer = void 0
}
// @from(Ln 524141, Col 0)
function N5A() {
    let q = s(4),
        [K, _] = o1.useState(0),
        z, Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = () => {
        let w = setInterval(_, 80, V5A);
        return () => clearInterval(w)
    }, Y = [], q[0] = z, q[1] = Y;
    else z = q[0], Y = q[1];
    o1.useEffect(z, Y);
    let A = CK5[K],
        O;
    if (q[2] !== A) O = o1.default.createElement(T, {
        color: "warning"
    }, A), q[2] = A, q[3] = O;
    else O = q[3];
    return O
}
// @from(Ln 524160, Col 0)
function E5A(q, K) {
    try {
        let _ = new Date(q);
        if (Number.isNaN(_.getTime())) return q;
        if (("format" in K ? K.format : void 0) === "date-time") return _.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        });
        let Y = q.split("-");
        if (Y.length === 3) return new Date(Number(Y[0]), Number(Y[1]) - 1, Number(Y[2])).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
        return q
    } catch {
        return q
    }
}
// @from(Ln 524186, Col 0)
function bK5(q) {
    let K = s(7),
        {
            event: _,
            onResponse: z,
            onWaitingDismiss: Y
        } = q;
    if (_.params.mode === "url") {
        let O;
        if (K[0] !== _ || K[1] !== z || K[2] !== Y) O = o1.default.createElement(L5A, {
            event: _,
            onResponse: z,
            onWaitingDismiss: Y
        }), K[0] = _, K[1] = z, K[2] = Y, K[3] = O;
        else O = K[3];
        return O
    }
    let A;
    if (K[4] !== _ || K[5] !== z) A = o1.default.createElement(y5A, {
        event: _,
        onResponse: z
    }), K[4] = _, K[5] = z, K[6] = A;
    else A = K[6];
    return A
}
// @from(Ln 524212, Col 0)
function y5A({
    event: q,
    onResponse: K
}) {
    let {
        serverName: _,
        signal: z
    } = q, Y = q.params, {
        message: A,
        requestedSchema: O
    } = Y, w = Object.keys(O.properties).length > 0, [$, j] = o1.useState(w ? null : "accept"), [H, J] = o1.useState(() => {
        let W6 = {};
        if (O.properties) {
            for (let [V6, f6] of Object.entries(O.properties))
                if (typeof f6 === "object" && f6 !== null) {
                    if (f6.default !== void 0) W6[V6] = f6.default
                }
        }
        return W6
    }), [X, M] = o1.useState(() => {
        let W6 = {};
        for (let [V6, f6] of Object.entries(O.properties))
            if (sz8(f6) && f6?.default !== void 0) {
                let G6 = nz8(String(f6.default), f6);
                if (!G6.isValid && G6.error) W6[V6] = G6.error
            } return W6
    });
    o1.useEffect(() => {
        if (!z) return;
        let W6 = () => {
            K("cancel")
        };
        if (z.aborted) {
            W6();
            return
        }
        return z.addEventListener("abort", W6), () => {
            z.removeEventListener("abort", W6)
        }
    }, [z, K]);
    let {
        setRawMode: P
    } = FB();
    o1.useLayoutEffect(() => {
        return P(!0), () => P(!1)
    }, [P]);
    let W = o1.useMemo(() => {
            let W6 = O.required ?? [];
            return Object.entries(O.properties).map(([V6, f6]) => ({
                name: V6,
                schema: f6,
                isRequired: W6.includes(V6)
            }))
        }, [O]),
        [D, Z] = o1.useState(w ? 0 : void 0),
        [G, f] = o1.useState(() => {
            let W6 = W[0];
            if (W6 && sz8(W6.schema)) {
                let V6 = H[W6.name];
                if (V6 === void 0) return "";
                return String(V6)
            }
            return ""
        }),
        [v, V] = o1.useState(G.length),
        [k, N] = o1.useState(() => new Set),
        [R, h] = o1.useState(),
        [C, x] = o1.useState(0),
        B = o1.useRef(void 0),
        m = o1.useRef(new Map),
        S = o1.useRef({
            buffer: "",
            timer: void 0
        });
    o1.useEffect(() => () => {
        if (B.current !== void 0) clearTimeout(B.current);
        let W6 = S.current;
        if (W6.timer !== void 0) clearTimeout(W6.timer);
        for (let V6 of m.current.values()) V6.abort();
        m.current.clear()
    }, []);
    let {
        columns: F,
        rows: U
    } = s1(), g = D !== void 0 ? W[D] : void 0, n = g !== void 0 && sz8(g.schema) && !dn(g.schema) && !$;
    A2("elicitation"), Fz8("Claude Code needs your input", "elicitation_dialog");
    let l = o1.useCallback((W6) => {
        if (W6 === void 0) {
            f(""), V(0);
            return
        }
        let V6 = W[W6];
        if (V6 && sz8(V6.schema) && !dn(V6.schema)) {
            let f6 = H[V6.name],
                G6 = f6 !== void 0 ? String(f6) : "";
            f(G6), V(G6.length)
        }
    }, [W, H]);

    function z6(W6, V6) {
        if (!pW6(V6)) return;
        let f6 = H[W6] ?? [],
            G6 = W.find((v6) => v6.name === W6)?.isRequired ?? !1,
            k6 = V6.minItems,
            T6 = V6.maxItems;
        if (k6 !== void 0 && f6.length < k6 && (f6.length > 0 || G6)) i(W6, `Select at least ${k6} ${O7(k6,"item")}`);
        else if (T6 !== void 0 && f6.length > T6) i(W6, `Select at most ${T6} ${O7(T6,"item")}`);
        else i(W6)
    }

    function A6(W6) {
        if (g && pW6(g.schema)) z6(g.name, g.schema), h(void 0);
        else if (g && dn(g.schema)) h(void 0);
        if (n && g) {
            if (J6(g.name, g.schema, G), B.current !== void 0) clearTimeout(B.current), B.current = void 0;
            if (az8(g.schema) && G.trim() !== "" && X[g.name]) $6(g.name, g.schema, G)
        }
        let V6 = W.length + 2,
            f6 = D ?? ($ === "accept" ? W.length : $ === "decline" ? W.length + 1 : void 0),
            G6 = f6 !== void 0 ? (f6 + (W6 === "up" ? V6 - 1 : 1)) % V6 : 0;
        if (G6 < W.length) Z(G6), j(null), l(G6);
        else Z(void 0), j(G6 === W.length ? "accept" : "decline"), f("")
    }

    function e(W6, V6) {
        if (J((f6) => {
                let G6 = {
                    ...f6
                };
                if (V6 === void 0) delete G6[W6];
                else G6[W6] = V6;
                return G6
            }), V6 !== void 0 && X[W6] === "This field is required") i(W6)
    }

    function i(W6, V6) {
        M((f6) => {
            let G6 = {
                ...f6
            };
            if (V6) G6[W6] = V6;
            else delete G6[W6];
            return G6
        })
    }

    function O6(W6) {
        if (!W6) return;
        e(W6, void 0), i(W6), f(""), V(0)
    }

    function J6(W6, V6, f6) {
        let G6 = f6.trim();
        if (G6 === "" && (V6.type !== "string" || ("format" in V6) && V6.format !== void 0)) {
            O6(W6);
            return
        }
        if (G6 === "") {
            if (H[W6] !== void 0) e(W6, "");
            return
        }
        let k6 = nz8(f6, V6);
        e(W6, k6.isValid ? k6.value : f6), i(W6, k6.isValid ? void 0 : k6.error)
    }

    function $6(W6, V6, f6) {
        if (!z) return;
        let G6 = m.current.get(W6);
        if (G6) G6.abort();
        let k6 = new AbortController;
        m.current.set(W6, k6), N((T6) => new Set(T6).add(W6)), RK5(f6, V6, k6.signal).then((T6) => {
            if (m.current.delete(W6), N((v6) => {
                    let L6 = new Set(v6);
                    return L6.delete(W6), L6
                }), k6.signal.aborted) return;
            if (T6.isValid) {
                e(W6, T6.value), i(W6);
                let v6 = String(T6.value);
                f((L6) => {
                    if (L6 === f6) return V(v6.length), v6;
                    return L6
                })
            } else i(W6, T6.error)
        }, () => {
            m.current.delete(W6), N((T6) => {
                let v6 = new Set(T6);
                return v6.delete(W6), v6
            })
        })
    }

    function H6(W6) {
        if (f(W6), g) {
            if (J6(g.name, g.schema, W6), B.current !== void 0) clearTimeout(B.current), B.current = void 0;
            if (az8(g.schema) && W6.trim() !== "" && X[g.name]) {
                let {
                    name: V6,
                    schema: f6
                } = g;
                B.current = setTimeout((G6, k6, T6, v6, L6) => {
                    G6.current = void 0, k6(T6, v6, L6)
                }, 2000, B, $6, V6, f6, W6)
            }
        }
    }

    function q6() {
        A6("down")
    }

    function o(W6, V6, f6) {
        let G6 = S.current;
        if (G6.timer !== void 0) clearTimeout(G6.timer);
        G6.buffer += W6.toLowerCase(), G6.timer = setTimeout(k5A, 2000, G6);
        let k6 = V6.findIndex((T6) => T6.startsWith(G6.buffer));
        if (k6 !== -1) f6(k6)
    }
    G1("confirm:no", () => {
        if (n && g) {
            let W6 = H[g.name];
            f(W6 !== void 0 ? String(W6) : ""), V(0)
        }
        K("cancel")
    }, {
        context: "Settings",
        isActive: !!g && !$ && !R
    });

    function _6(W6) {
        let V6 = W6.key.length === 1 && W6.key !== " " && !W6.ctrl && !W6.meta ? W6.key : "";
        if (n && W6.key !== "up" && W6.key !== "down" && W6.key !== "return" && W6.key !== "backspace") return;
        if (R && g && pW6(g.schema)) {
            let T6 = g.schema,
                v6 = iz8(T6),
                L6 = H[g.name] ?? [];
            if (W6.key === "left" || W6.key === "escape") {
                W6.preventDefault(), h(void 0), z6(g.name, T6);
                return
            }
            if (W6.key === "up") {
                if (W6.preventDefault(), C === 0) h(void 0), z6(g.name, T6);
                else x(C - 1);
                return
            }
            if (W6.key === "down") {
                if (W6.preventDefault(), C >= v6.length - 1) h(void 0), A6("down");
                else x(C + 1);
                return
            }
            if (W6.key === " ") {
                W6.preventDefault();
                let y6 = v6[C];
                if (y6 !== void 0) {
                    let c6 = L6.includes(y6) ? L6.filter((p6) => p6 !== y6) : [...L6, y6],
                        Z8 = c6.length > 0 ? c6 : void 0;
                    e(g.name, Z8);
                    let {
                        minItems: N8,
                        maxItems: R6
                    } = T6;
                    if (N8 !== void 0 && c6.length < N8 && (c6.length > 0 || g.isRequired)) i(g.name, `Select at least ${N8} ${O7(N8,"item")}`);
                    else if (R6 !== void 0 && c6.length > R6) i(g.name, `Select at most ${R6} ${O7(R6,"item")}`);
                    else i(g.name)
                }
                return
            }
            if (W6.key === "return") {
                W6.preventDefault();
                let y6 = v6[C];
                if (y6 !== void 0 && !L6.includes(y6)) e(g.name, [...L6, y6]);
                h(void 0), A6("down");
                return
            }
            if (V6) {
                W6.preventDefault();
                let y6 = v6.map((c6) => rz8(T6, c6).toLowerCase());
                o(V6, y6, x);
                return
            }
            return
        }
        if (R && g && dn(g.schema)) {
            let T6 = g.schema,
                v6 = Mm6(T6);
            if (W6.key === "left" || W6.key === "escape") {
                W6.preventDefault(), h(void 0);
                return
            }
            if (W6.key === "up") {
                if (W6.preventDefault(), C === 0) h(void 0);
                else x(C - 1);
                return
            }
            if (W6.key === "down") {
                if (W6.preventDefault(), C >= v6.length - 1) h(void 0), A6("down");
                else x(C + 1);
                return
            }
            if (W6.key === " ") {
                W6.preventDefault();
                let L6 = v6[C];
                if (L6 !== void 0) e(g.name, L6);
                h(void 0);
                return
            }
            if (W6.key === "return") {
                W6.preventDefault();
                let L6 = v6[C];
                if (L6 !== void 0) e(g.name, L6);
                h(void 0), A6("down");
                return
            }
            if (V6) {
                W6.preventDefault();
                let L6 = v6.map((y6) => oz8(T6, y6).toLowerCase());
                o(V6, L6, x);
                return
            }
            return
        }
        if (W6.key === "return" && $ === "accept") {
            if (W6.preventDefault(), r() && Object.keys(X).length === 0) K("accept", H);
            else {
                let T6 = O.required || [];
                for (let L6 of T6)
                    if (H[L6] === void 0) i(L6, "This field is required");
                let v6 = W.findIndex((L6) => T6.includes(L6.name) && H[L6.name] === void 0 || X[L6.name] !== void 0);
                if (v6 !== -1) Z(v6), j(null), l(v6)
            }
            return
        }
        if (W6.key === "return" && $ === "decline") {
            W6.preventDefault(), K("decline");
            return
        }
        if (W6.key === "up" || W6.key === "down") {
            W6.preventDefault();
            let T6 = S.current;
            if (T6.buffer = "", T6.timer !== void 0) clearTimeout(T6.timer), T6.timer = void 0;
            A6(W6.key === "up" ? "up" : "down");
            return
        }
        if ($ && (W6.key === "left" || W6.key === "right")) {
            W6.preventDefault(), j($ === "accept" ? "decline" : "accept");
            return
        }
        if (!g) return;
        let {
            schema: f6,
            name: G6
        } = g, k6 = H[G6];
        if (f6.type === "boolean") {
            if (W6.key === " ") {
                W6.preventDefault(), e(G6, k6 === void 0 ? !0 : !k6);
                return
            }
            if (W6.key === "return") {
                W6.preventDefault(), A6("down");
                return
            }
            if (W6.key === "backspace" && k6 !== void 0) {
                W6.preventDefault(), O6(G6);
                return
            }
            if (V6 && W6.key !== "return") {
                W6.preventDefault(), o(V6, ["yes", "no"], (T6) => e(G6, T6 === 0));
                return
            }
            return
        }
        if (dn(f6) || pW6(f6)) {
            if (W6.key === "return") {
                W6.preventDefault(), A6("down");
                return
            }
            if (W6.key === "backspace" && k6 !== void 0) {
                W6.preventDefault(), O6(G6);
                return
            }
            let T6, v6 = 0;
            if (dn(f6)) {
                let L6 = Mm6(f6);
                if (T6 = L6.map((y6) => oz8(f6, y6).toLowerCase()), k6 !== void 0) v6 = Math.max(0, L6.indexOf(k6))
            } else T6 = iz8(f6).map((y6) => rz8(f6, y6).toLowerCase());
            if (W6.key === "right") {
                W6.preventDefault(), h(G6), x(v6);
                return
            }
            if (V6 && W6.key !== "left") {
                W6.preventDefault(), o(V6, T6, (L6) => {
                    h(G6), x(L6)
                });
                return
            }
            return
        }
        if (W6.key === "backspace") {
            if (n && G === "") {
                W6.preventDefault(), O6(G6);
                return
            }
        }
    }

    function r() {
        let W6 = O.required || [];
        for (let V6 of W6) {
            let f6 = H[V6];
            if (f6 === void 0 || f6 === null || f6 === "") return !1;
            if (Array.isArray(f6) && f6.length === 0) return !1
        }
        return !0
    }
    let t = 3,
        X6 = Math.max(2, Math.floor((U - 14) / t)),
        M6 = o1.useMemo(() => {
            let W6 = W.length;
            if (W6 <= X6) return {
                start: 0,
                end: W6
            };
            let V6 = D ?? W6 - 1,
                f6 = Math.max(0, V6 - Math.floor(X6 / 2)),
                G6 = Math.min(f6 + X6, W6);
            return f6 = Math.max(0, G6 - X6), {
                start: f6,
                end: G6
            }
        }, [W.length, X6, D]);
    return o1.default.createElement(R1, {
        title: `MCP server “${_}” requests your input`,
        subtitle: `
${A}`,
        color: "permission",
        onCancel: () => K("cancel"),
        isCancelActive: (!g || !!$) && !R,
        inputGuide: (W6) => W6.pending ? o1.default.createElement(T, null, "Press ", W6.keyName, " again to exit") : o1.default.createElement(z1, null, o1.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        }), o1.default.createElement(A8, {
            chord: ["up", "down"],
            format: {
                arrowSep: ""
            },
            action: "navigate"
        }), g && o1.default.createElement(A8, {
            chord: "backspace",
            action: "unset"
        }), g && g.schema.type === "boolean" && o1.default.createElement(A8, {
            chord: "space",
            action: "toggle"
        }), g && dn(g.schema) && (R ? o1.default.createElement(A8, {
            chord: "space",
            action: "select"
        }) : o1.default.createElement(A8, {
            chord: "right",
            action: "expand"
        })), g && pW6(g.schema) && (R ? o1.default.createElement(A8, {
            chord: "space",
            action: "toggle"
        }) : o1.default.createElement(A8, {
            chord: "right",
            action: "expand"
        })))
    }, o1.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: _6
    }, o1.default.createElement(h5A, {
        schemaFields: W,
        scrollWindow: M6,
        currentFieldIndex: D,
        focusedButton: $,
        formValues: H,
        validationErrors: X,
        resolvingFields: k,
        expandedAccordion: R,
        accordionOptionIndex: C,
        textInputValue: G,
        textInputCursorOffset: v,
        setTextInputCursorOffset: V,
        handleTextInputChange: H6,
        handleTextInputSubmit: q6,
        columns: F
    }), o1.default.createElement(u, null, o1.default.createElement(T, {
        color: "success"
    }, $ === "accept" ? e6.pointer : " "), o1.default.createElement(T, {
        bold: $ === "accept",
        color: $ === "accept" ? "success" : void 0,
        dimColor: $ !== "accept"
    }, " Accept  "), o1.default.createElement(T, {
        color: "error"
    }, $ === "decline" ? e6.pointer : " "), o1.default.createElement(T, {
        bold: $ === "decline",
        color: $ === "decline" ? "error" : void 0,
        dimColor: $ !== "decline"
    }, " Decline"))))
}
// @from(Ln 524714, Col 0)
function L5A({
    event: q,
    onResponse: K,
    onWaitingDismiss: _
}) {
    let {
        serverName: z,
        signal: Y,
        waitingState: A
    } = q, O = q.params, {
        message: w,
        url: $
    } = O, [j, H] = o1.useState("prompt"), J = o1.useRef("prompt"), [X, M] = o1.useState("accept"), P = A?.showCancel ?? !1, {
        setRawMode: W
    } = FB();
    o1.useLayoutEffect(() => {
        return W(!0), () => W(!1)
    }, [W]), Fz8("Claude Code needs your input", "elicitation_url_dialog"), A2("elicitation-url"), J.current = j;
    let D = o1.useRef(_);
    D.current = _, o1.useEffect(() => {
        let k = () => {
            if (J.current === "waiting") D.current?.("cancel");
            else K("cancel")
        };
        if (Y.aborted) {
            k();
            return
        }
        return Y.addEventListener("abort", k), () => Y.removeEventListener("abort", k)
    }, [Y, K]);
    let Z = "",
        G = "",
        f = "";
    try {
        Z = new URL($).hostname;
        let N = $.indexOf(Z);
        G = $.slice(0, N), f = $.slice(N + Z.length)
    } catch {
        Z = $
    }
    o1.useEffect(() => {
        if (j === "waiting" && q.completed) _?.(P ? "retry" : "dismiss")
    }, [j, q.completed, _, P]);
    let v = o1.useCallback(() => {
        J3($), K("accept"), H("waiting"), J.current = "waiting", M("open")
    }, [K, $]);

    function V(k) {
        if (j === "prompt") {
            if (k.key === "left" || k.key === "right") {
                k.preventDefault(), M((N) => N === "accept" ? "decline" : "accept");
                return
            }
            if (k.key === "return")
                if (k.preventDefault(), X === "accept") v();
                else K("decline")
        } else {
            let N = P ? ["open", "action", "cancel"] : ["open", "action"];
            if (k.key === "left" || k.key === "right") {
                k.preventDefault();
                let R = k.key === "right";
                M((h) => {
                    let C = N.indexOf(h);
                    return N[(C + (R ? 1 : -1) + N.length) % N.length]
                });
                return
            }
            if (k.key === "return")
                if (k.preventDefault(), X === "open") J3($);
                else if (X === "cancel") _?.("cancel");
            else _?.(P ? "retry" : "dismiss")
        }
    }
    if (j === "waiting") {
        let k = A?.actionLabel ?? "Continue without waiting";
        return o1.default.createElement(R1, {
            title: `MCP server “${z}” — waiting for completion`,
            subtitle: `
${w}`,
            color: "permission",
            onCancel: () => _?.("cancel"),
            isCancelActive: !0,
            inputGuide: (N) => N.pending ? o1.default.createElement(T, null, "Press ", N.keyName, " again to exit") : o1.default.createElement(z1, null, o1.default.createElement(v1, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
            }), o1.default.createElement(A8, {
                chord: ["left", "right"],
                action: "switch"
            }))
        }, o1.default.createElement(u, {
            flexDirection: "column",
            tabIndex: 0,
            autoFocus: !0,
            onKeyDown: V
        }, o1.default.createElement(u, {
            marginBottom: 1,
            flexDirection: "column"
        }, o1.default.createElement(T, null, G, o1.default.createElement(T, {
            bold: !0
        }, Z), f)), o1.default.createElement(u, {
            marginBottom: 1
        }, o1.default.createElement(T, {
            dimColor: !0,
            italic: !0
        }, "Waiting for the server to confirm completion…")), o1.default.createElement(u, null, o1.default.createElement(T, {
            color: "success"
        }, X === "open" ? e6.pointer : " "), o1.default.createElement(T, {
            bold: X === "open",
            color: X === "open" ? "success" : void 0,
            dimColor: X !== "open"
        }, " Reopen URL  "), o1.default.createElement(T, {
            color: "success"
        }, X === "action" ? e6.pointer : " "), o1.default.createElement(T, {
            bold: X === "action",
            color: X === "action" ? "success" : void 0,
            dimColor: X !== "action"
        }, ` ${k}`), P && o1.default.createElement(o1.default.Fragment, null, o1.default.createElement(T, null, " "), o1.default.createElement(T, {
            color: "error"
        }, X === "cancel" ? e6.pointer : " "), o1.default.createElement(T, {
            bold: X === "cancel",
            color: X === "cancel" ? "error" : void 0,
            dimColor: X !== "cancel"
        }, " Cancel")))))
    }
    return o1.default.createElement(R1, {
        title: `MCP server “${z}” wants to open a URL`,
        subtitle: `
${w}`,
        color: "permission",
        onCancel: () => K("cancel"),
        isCancelActive: !0,
        inputGuide: (k) => k.pending ? o1.default.createElement(T, null, "Press ", k.keyName, " again to exit") : o1.default.createElement(z1, null, o1.default.createElement(v1, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        }), o1.default.createElement(A8, {
            chord: ["left", "right"],
            action: "switch"
        }))
    }, o1.default.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: V
    }, o1.default.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, o1.default.createElement(T, null, G, o1.default.createElement(T, {
        bold: !0
    }, Z), f)), o1.default.createElement(u, null, o1.default.createElement(T, {
        color: "success"
    }, X === "accept" ? e6.pointer : " "), o1.default.createElement(T, {
        bold: X === "accept",
        color: X === "accept" ? "success" : void 0,
        dimColor: X !== "accept"
    }, " Accept  "), o1.default.createElement(T, {
        color: "error"
    }, X === "decline" ? e6.pointer : " "), o1.default.createElement(T, {
        bold: X === "decline",
        color: X === "decline" ? "error" : void 0,
        dimColor: X !== "decline"
    }, " Decline"))))
}
// @from(Ln 524881, Col 0)
function h5A(q) {
    let K = s(43),
        {
            schemaFields: _,
            scrollWindow: z,
            currentFieldIndex: Y,
            focusedButton: A,
            formValues: O,
            validationErrors: w,
            resolvingFields: $,
            expandedAccordion: j,
            accordionOptionIndex: H,
            textInputValue: J,
            textInputCursorOffset: X,
            setTextInputCursorOffset: M,
            handleTextInputChange: P,
            handleTextInputSubmit: W,
            columns: D
        } = q;
    if (!_.length) return null;
    let Z = z.start > 0,
        G = z.end < _.length,
        f;
    if (K[0] !== Z || K[1] !== z.start) f = Z && o1.default.createElement(u, {
        marginLeft: 2
    }, o1.default.createElement(T, {
        dimColor: !0
    }, e6.arrowUp, " ", z.start, " more above")), K[0] = Z, K[1] = z.start, K[2] = f;
    else f = K[2];
    let v;
    if (K[3] !== H || K[4] !== D || K[5] !== Y || K[6] !== j || K[7] !== A || K[8] !== O || K[9] !== P || K[10] !== W || K[11] !== $ || K[12] !== _ || K[13] !== z.end || K[14] !== z.start || K[15] !== M || K[16] !== X || K[17] !== J || K[18] !== w) {
        let N;
        if (K[20] !== H || K[21] !== D || K[22] !== Y || K[23] !== j || K[24] !== A || K[25] !== O || K[26] !== P || K[27] !== W || K[28] !== $ || K[29] !== z.start || K[30] !== M || K[31] !== X || K[32] !== J || K[33] !== w) N = (R, h) => {
            let C = z.start + h,
                {
                    name: x,
                    schema: B,
                    isRequired: m
                } = R,
                S = C === Y && !A,
                F = O[x],
                U = F !== void 0 && (!Array.isArray(F) || F.length > 0),
                g = w[x],
                n = $.has(x) ? o1.default.createElement(N5A, null) : g ? o1.default.createElement(T, {
                    color: "error"
                }, e6.warning) : U ? o1.default.createElement(T, {
                    color: "success",
                    dimColor: !S
                }, e6.tick) : m ? o1.default.createElement(T, {
                    color: "error"
                }, "*") : o1.default.createElement(T, null, " "),
                l = g ? "error" : U ? "success" : m ? "error" : "suggestion",
                z6 = S ? l : void 0,
                A6 = o1.default.createElement(T, {
                    color: z6,
                    bold: S
                }, B.title || x),
                e, i = null;
            if (pW6(B)) {
                let O6 = iz8(B),
                    J6 = F ?? [];
                if (j === x && S) e = o1.default.createElement(T, {
                    dimColor: !0
                }, e6.triangleDownSmall), i = o1.default.createElement(u, {
                    flexDirection: "column",
                    marginLeft: 6
                }, O6.map((H6, q6) => {
                    let o = rz8(B, H6),
                        _6 = J6.includes(H6),
                        r = q6 === H;
                    return o1.default.createElement(u, {
                        key: H6,
                        gap: 1
                    }, o1.default.createElement(T, {
                        color: "suggestion"
                    }, r ? e6.pointer : " "), o1.default.createElement(T, {
                        color: _6 ? "success" : void 0
                    }, _6 ? e6.checkboxOn : e6.checkboxOff), o1.default.createElement(T, {
                        color: r ? "suggestion" : void 0,
                        bold: r
                    }, o))
                }));
                else {
                    let H6 = S ? o1.default.createElement(T, {
                        dimColor: !0
                    }, e6.triangleRightSmall, " ") : null;
                    if (J6.length > 0) {
                        let q6 = J6.map((o) => rz8(B, o));
                        e = o1.default.createElement(T, null, H6, o1.default.createElement(T, {
                            color: z6,
                            bold: S
                        }, q6.join(", ")))
                    } else e = o1.default.createElement(T, null, H6, o1.default.createElement(T, {
                        dimColor: !0,
                        italic: !0
                    }, "not set"))
                }
            } else if (dn(B)) {
                let O6 = Mm6(B);
                if (j === x && S) e = o1.default.createElement(T, {
                    dimColor: !0
                }, e6.triangleDownSmall), i = o1.default.createElement(u, {
                    flexDirection: "column",
                    marginLeft: 6
                }, O6.map(($6, H6) => {
                    let q6 = oz8(B, $6),
                        o = F === $6,
                        _6 = H6 === H;
                    return o1.default.createElement(u, {
                        key: $6,
                        gap: 1
                    }, o1.default.createElement(T, {
                        color: "suggestion"
                    }, _6 ? e6.pointer : " "), o1.default.createElement(T, {
                        color: o ? "success" : void 0
                    }, o ? e6.radioOn : e6.radioOff), o1.default.createElement(T, {
                        color: _6 ? "suggestion" : void 0,
                        bold: _6
                    }, q6))
                }));
                else {
                    let $6 = S ? o1.default.createElement(T, {
                        dimColor: !0
                    }, e6.triangleRightSmall, " ") : null;
                    if (U) e = o1.default.createElement(T, null, $6, o1.default.createElement(T, {
                        color: z6,
                        bold: S
                    }, oz8(B, F)));
                    else e = o1.default.createElement(T, null, $6, o1.default.createElement(T, {
                        dimColor: !0,
                        italic: !0
                    }, "not set"))
                }
            } else if (B.type === "boolean")
                if (S) e = U ? o1.default.createElement(T, {
                    color: z6,
                    bold: !0
                }, F ? e6.checkboxOn : e6.checkboxOff) : o1.default.createElement(T, {
                    dimColor: !0
                }, e6.checkboxOff);
                else e = U ? o1.default.createElement(T, null, F ? e6.checkboxOn : e6.checkboxOff) : o1.default.createElement(T, {
                    dimColor: !0,
                    italic: !0
                }, "not set");
            else if (sz8(B))
                if (S) e = o1.default.createElement(l4, {
                    value: J,
                    onChange: P,
                    onSubmit: W,
                    placeholder: "Type something…",
                    columns: Math.min(D - 20, 60),
                    cursorOffset: X,
                    onChangeCursorOffset: M,
                    focus: !0,
                    showCursor: !0
                });
                else {
                    let O6 = U && az8(B) ? E5A(String(F), B) : String(F);
                    e = U ? o1.default.createElement(T, null, O6) : o1.default.createElement(T, {
                        dimColor: !0,
                        italic: !0
                    }, "not set")
                }
            else e = U ? o1.default.createElement(T, null, String(F)) : o1.default.createElement(T, {
                dimColor: !0,
                italic: !0
            }, "not set");
            return o1.default.createElement(u, {
                key: x,
                flexDirection: "column"
            }, o1.default.createElement(u, {
                gap: 1
            }, o1.default.createElement(T, {
                color: l
            }, S ? e6.pointer : " "), n, o1.default.createElement(u, null, A6, o1.default.createElement(T, {
                color: z6
            }, ": "), e)), i, B.description && o1.default.createElement(u, {
                marginLeft: 6
            }, o1.default.createElement(T, {
                dimColor: !0
            }, B.description)), o1.default.createElement(u, {
                marginLeft: 6,
                height: 1
            }, g ? o1.default.createElement(T, {
                color: "error",
                italic: !0
            }, g) : o1.default.createElement(T, null, " ")))
        }, K[20] = H, K[21] = D, K[22] = Y, K[23] = j, K[24] = A, K[25] = O, K[26] = P, K[27] = W, K[28] = $, K[29] = z.start, K[30] = M, K[31] = X, K[32] = J, K[33] = w, K[34] = N;
        else N = K[34];
        v = _.slice(z.start, z.end).map(N), K[3] = H, K[4] = D, K[5] = Y, K[6] = j, K[7] = A, K[8] = O, K[9] = P, K[10] = W, K[11] = $, K[12] = _, K[13] = z.end, K[14] = z.start, K[15] = M, K[16] = X, K[17] = J, K[18] = w, K[19] = v
    } else v = K[19];
    let V;
    if (K[35] !== G || K[36] !== _.length || K[37] !== z.end) V = G && o1.default.createElement(u, {
        marginLeft: 2
    }, o1.default.createElement(T, {
        dimColor: !0
    }, e6.arrowDown, " ", _.length - z.end, " more below")), K[35] = G, K[36] = _.length, K[37] = z.end, K[38] = V;
    else V = K[38];
    let k;
    if (K[39] !== f || K[40] !== v || K[41] !== V) k = o1.default.createElement(u, {
        flexDirection: "column"
    }, f, v, V), K[39] = f, K[40] = v, K[41] = V, K[42] = k;
    else k = K[42];
    return k
}
// @from(Ln 525086, Col 4)
o1
// @from(Ln 525086, Col 8)
sz8 = (q) => ["string", "number", "integer"].includes(q.type)
// @from(Ln 525087, Col 4)
CK5 = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
// @from(Ln 525088, Col 4)
V5A = (q) => (q + 1) % CK5.length
// @from(Ln 525089, Col 4)
IK5 = L(() => {
    o6();
    Qq();
    CP();
    nX7();
    I4();
    g6();
    C7();
    Nj();
    SK5();
    bK();
    Nq();
    S4();
    u7();
    NY();
    o1 = K6(P6(), 1)
})
// @from(Ln 525107, Col 0)
function xK5(q) {
    let K = s(15),
        {
            title: _,
            toolInputSummary: z,
            request: Y,
            onRespond: A,
            onAbort: O
        } = q,
        w;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        isActive: !0
    }, K[0] = w;
    else w = K[0];
    G1("app:interrupt", O, w);
    let $;
    if (K[1] !== Y.options) $ = Y.options.map(R5A), K[1] = Y.options, K[2] = $;
    else $ = K[2];
    let j = $,
        H;
    if (K[3] !== z) H = z ? N66.createElement(T, {
        dimColor: !0
    }, z) : void 0, K[3] = z, K[4] = H;
    else H = K[4];
    let J;
    if (K[5] !== A) J = (P) => {
        A(P)
    }, K[5] = A, K[6] = J;
    else J = K[6];
    let X;
    if (K[7] !== j || K[8] !== J) X = N66.createElement(u, {
        flexDirection: "column",
        paddingY: 1
    }, N66.createElement(A1, {
        options: j,
        onChange: J
    })), K[7] = j, K[8] = J, K[9] = X;
    else X = K[9];
    let M;
    if (K[10] !== Y.message || K[11] !== H || K[12] !== X || K[13] !== _) M = N66.createElement(IY, {
        title: _,
        subtitle: Y.message,
        titleRight: H
    }, X), K[10] = Y.message, K[11] = H, K[12] = X, K[13] = _, K[14] = M;
    else M = K[14];
    return M
}
// @from(Ln 525155, Col 0)
function R5A(q) {
    return {
        label: q.label,
        value: q.key,
        description: q.description
    }
}
// @from(Ln 525162, Col 4)
N66
// @from(Ln 525163, Col 4)
uK5 = L(() => {
    o6();
    g6();
    C7();
    gK();
    pD();
    N66 = K6(P6(), 1)
})
// @from(Ln 525172, Col 0)
function cn() {
    return mK5.useSyncExternalStore(yj6, zR8)
}
// @from(Ln 525175, Col 4)
mK5
// @from(Ln 525176, Col 4)
Pm6 = L(() => {
    b$();
    mK5 = K6(P6(), 1)
})
// @from(Ln 525181, Col 0)
function BK5(q, K) {
    let _ = Xs8.useRef(void 0);
    Xs8.useEffect(() => {
        let z = ky(q);
        if (_.current !== z) _.current = z;
        if (z) z.client.setNotificationHandler(C5A(), (Y) => {
            if (_.current !== z) return;
            try {
                let A = Y.params,
                    O = A.lineStart !== void 0 ? A.lineStart + 1 : void 0,
                    w = A.lineEnd !== void 0 ? A.lineEnd + 1 : void 0;
                K({
                    filePath: A.filePath,
                    lineStart: O,
                    lineEnd: w
                })
            } catch (A) {
                j6(A)
            }
        })
    }, [q, K])
}
// @from(Ln 525203, Col 4)
Xs8
// @from(Ln 525203, Col 9)
S5A = "at_mentioned"
// @from(Ln 525204, Col 4)
C5A
// @from(Ln 525205, Col 4)
pK5 = L(() => {
    U8();
    p7();
    kj();
    Xs8 = K6(P6(), 1), C5A = C6(() => y.object({
        method: y.literal(S5A),
        params: y.object({
            filePath: y.string(),
            lineStart: y.number().optional(),
            lineEnd: y.number().optional()
        })
    }))
})
// @from(Ln 525219, Col 0)
function Wm6(q) {
    return FK5.useMemo(() => {
        let K = q?.find((Y) => Y.name === "ide");
        if (!K) return {
            status: null,
            ideName: null
        };
        let _ = K.config,
            z = _.type === "sse-ide" || _.type === "ws-ide" ? _.ideName : null;
        if (K.type === "connected") return {
            status: "connected",
            ideName: z
        };
        if (K.type === "pending") return {
            status: "pending",
            ideName: z
        };
        return {
            status: "disconnected",
            ideName: z
        }
    }, [q])
}
// @from(Ln 525242, Col 4)
FK5
// @from(Ln 525243, Col 4)
Ms8 = L(() => {
    FK5 = K6(P6(), 1)
})
// @from(Ln 525247, Col 0)
function FW6() {
    let q = M8((z) => z.settings.voiceEnabled === !0),
        K = M8((z) => z.authVersion),
        _ = gK5.useMemo(Vd8, [K]);
    return q && _ && K_6()
}
// @from(Ln 525253, Col 4)
gK5
// @from(Ln 525254, Col 4)
Ps8 = L(() => {
    N7();
    __6();
    gK5 = K6(P6(), 1)
})
// @from(Ln 525260, Col 0)
function Ws8() {
    return UK5.useSyncExternalStore(Ee6.subscribe, Ee6.getState)
}
// @from(Ln 525263, Col 4)
UK5
// @from(Ln 525264, Col 4)
XM7 = L(() => {
    ye6();
    UK5 = K6(P6(), 1)
})
// @from(Ln 525269, Col 0)
function QK5(q) {
    return `${Dm6.major(q,{loose:!0})}.${Dm6.minor(q,{loose:!0})}.${Dm6.patch(q,{loose:!0})}`
}
// @from(Ln 525273, Col 0)
function Ds8(q, K = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.112",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-04-16T18:33:19Z"
}.VERSION) {
    let [_, z] = dK5.useState(() => QK5(K));
    if (!q) return null;
    let Y = QK5(q);
    if (Y !== _) return z(Y), Y;
    return null
}
// @from(Ln 525287, Col 4)
dK5
// @from(Ln 525287, Col 9)
Dm6
// @from(Ln 525288, Col 4)
MM7 = L(() => {
    dK5 = K6(P6(), 1), Dm6 = K6(Pd(), 1)
})
// @from(Ln 525292, Col 0)
function cK5({
    isUpdating: q,
    onChangeIsUpdating: K,
    showSuccessMessage: _,
    verbose: z
}) {
    let Y = M8((M) => M.autoUpdaterResult),
        A = R7(),
        [O, w] = E66.useState({}),
        [$, j] = E66.useState(!1),
        H = Ds8(Y?.version);
    E66.useEffect(() => {
        AX6().then(j)
    }, []);
    let J = E66.useRef(q);
    E66.useEffect(() => {
        J.current = q
    });
    let X = uH.useCallback(async () => {
        if (J.current) return;
        if (Yd()) return;
        let M = {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION,
            P = vu(),
            W = await iS6(P),
            D = await l36();
        if (D && W && RP(W, D)) {
            if (E(`AutoUpdater: maxVersion ${D} is set, capping update from ${W} to ${D}`), QW(M, D)) {
                E(`AutoUpdater: current version ${M} is already at or above maxVersion ${D}, skipping update`), w({
                    global: M,
                    latest: W
                });
                return
            }
            W = D
        }
        if (w({
                global: M,
                latest: W
            }), M && W && !QW(M, W) && !Lt(W)) {
            let Z = Date.now();
            K(!0);
            let G = H8();
            if (G.installMethod !== "native" && !S6(process.env.DISABLE_INSTALLATION_CHECKS)) await q48();
            let f = await Rt();
            if (E(`AutoUpdater: Detected installation type: ${f}`), f === "development") {
                E("AutoUpdater: Cannot auto-update development build"), K(!1);
                return
            }
            let v, V;
            if (f === "npm-local") E("AutoUpdater: Using local update method"), V = "local", v = await Qq8(P);
            else if (f === "npm-global") E("AutoUpdater: Using global update method"), V = "global", v = await iq8();
            else if (f === "native") {
                E("AutoUpdater: Unexpected native installation in non-native updater"), K(!1);
                return
            } else {
                E("AutoUpdater: Unknown installation type, falling back to config");
                let k = G.installMethod === "local";
                if (V = k ? "local" : "global", k) v = await Qq8(P);
                else v = await iq8()
            }
            if (K(!1), v === "success") d("tengu_auto_updater_success", {
                fromVersion: M,
                toVersion: W,
                durationMs: Date.now() - Z,
                wasMigrated: V === "local",
                installationType: f
            });
            else d("tengu_auto_updater_fail", {
                fromVersion: M,
                attemptedVersion: W,
                status: v,
                durationMs: Date.now() - Z,
                wasMigrated: V === "local",
                installationType: f
            });
            A((k) => {
                let N = k.autoUpdaterResult;
                if (N?.version === W && N?.status === v) return k;
                return {
                    ...k,
                    autoUpdaterResult: {
                        version: W,
                        status: v
                    }
                }
            })
        }
    }, [A]);
    if (E66.useEffect(() => {
            X()
        }, [X]), fD(X, 1800000), !Y?.version && (!O.global || !O.latest)) return null;
    if (!Y?.version && !q) return null;
    return uH.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, z && uH.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "globalVersion: ", O.global, " · latestVersion:", " ", O.latest), q ? uH.createElement(uH.Fragment, null, uH.createElement(u, null, uH.createElement(T, {
        color: "text",
        dimColor: !0,
        wrap: "truncate"
    }, "Auto-updating…"))) : Y?.status === "success" && _ && H && uH.createElement(T, {
        color: "success",
        wrap: "truncate"
    }, "✓ Update installed · Restart to apply"), (Y?.status === "install_failed" || Y?.status === "no_permissions") && uH.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "✗ Auto-update failed · Try ", uH.createElement(T, {
        bold: !0
    }, "claude doctor"), " or", " ", uH.createElement(T, {
        bold: !0
    }, $ ? `cd ~/.claude/local && npm update ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}` : `npm i -g ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}`)))
}
// @from(Ln 525413, Col 4)
uH
// @from(Ln 525413, Col 8)
E66
// @from(Ln 525414, Col 4)
lK5 = L(() => {
    C8();
    wk();
    MM7();
    g6();
    N7();
    ht();
    h1();
    K8();
    n36();
    Q8();
    OX6();
    El();
    h_6();
    uH = K6(P6(), 1), E66 = K6(P6(), 1)
})
// @from(Ln 525431, Col 0)
function b5A(q) {
    if (q.includes("timeout")) return "timeout";
    if (q.includes("Checksum mismatch")) return "checksum_mismatch";
    if (q.includes("ENOENT") || q.includes("not found")) return "not_found";
    if (q.includes("EACCES") || q.includes("permission")) return "permission_denied";
    if (q.includes("ENOSPC")) return "disk_full";
    if (q.includes("npm")) return "npm_error";
    if (q.includes("network") || q.includes("ECONNREFUSED") || q.includes("ENOTFOUND")) return "network_error";
    return "unknown"
}
// @from(Ln 525442, Col 0)
function nK5({
    isUpdating: q,
    onChangeIsUpdating: K,
    showSuccessMessage: _,
    verbose: z
}) {
    let Y = M8((Z) => Z.autoUpdaterResult),
        A = R7(),
        [O, w] = kz6.useState({}),
        [$, j] = kz6.useState(null),
        H = Ds8(Y?.version),
        J = vu(),
        X = kz6.useRef(q);
    kz6.useEffect(() => {
        X.current = q
    });
    let M = uG.useCallback(async () => {
        if (X.current) return;
        if (Yd()) return;
        K(!0);
        let Z = Date.now();
        d("tengu_native_auto_updater_start", {});
        try {
            let G = await l36();
            if (G && RP({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION, G)) {
                let k = await p9K();
                j(k ?? "affects your version")
            }
            let f = await PX6(J),
                v = {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION,
                V = Date.now() - Z;
            if (f.lockFailed) {
                d("tengu_native_auto_updater_lock_contention", {
                    latency_ms: V
                });
                return
            }
            if (w({
                    current: v,
                    latest: f.latestVersion
                }), f.wasUpdated) d("tengu_native_auto_updater_success", {
                latency_ms: V
            }), A((k) => {
                let N = k.autoUpdaterResult;
                if (N?.version === f.latestVersion && N?.status === "success") return k;
                return {
                    ...k,
                    autoUpdaterResult: {
                        version: f.latestVersion,
                        status: "success"
                    }
                }
            });
            else d("tengu_native_auto_updater_up_to_date", {
                latency_ms: V
            })
        } catch (G) {
            let f = Date.now() - Z,
                v = G instanceof Error ? G.message : String(G);
            j6(G);
            let V = b5A(v);
            d("tengu_native_auto_updater_fail", {
                latency_ms: f,
                error_timeout: V === "timeout",
                error_checksum: V === "checksum_mismatch",
                error_not_found: V === "not_found",
                error_permission: V === "permission_denied",
                error_disk_full: V === "disk_full",
                error_npm: V === "npm_error",
                error_network: V === "network_error"
            }), A((k) => {
                let N = k.autoUpdaterResult;
                if (N?.version === null && N?.status === "install_failed") return k;
                return {
                    ...k,
                    autoUpdaterResult: {
                        version: null,
                        status: "install_failed"
                    }
                }
            })
        } finally {
            K(!1)
        }
    }, [A, J]);
    kz6.useEffect(() => {
        M()
    }, [M]), fD(M, 1800000);
    let P = !!Y?.version,
        W = !!O.current && !!O.latest;
    if (!(!!$ || P || q && W)) return null;
    return uG.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, z && uG.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "current: ", O.current, " · ", J, ": ", O.latest), q ? uG.createElement(u, null, uG.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "Checking for updates")) : Y?.status === "success" && _ && H && uG.createElement(T, {
        color: "success",
        wrap: "truncate"
    }, "✓ Update installed · Restart to update"), Y?.status === "install_failed" && uG.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "✗ Auto-update failed · Try ", uG.createElement(T, {
        bold: !0
    }, "/status")), $ && !1)
}
// @from(Ln 525566, Col 4)
uG
// @from(Ln 525566, Col 8)
kz6
// @from(Ln 525567, Col 4)
iK5 = L(() => {
    C8();
    K8();
    U8();
    wk();
    MM7();
    g6();
    N7();
    ht();
    h1();
    El();
    h_6();
    uG = K6(P6(), 1), kz6 = K6(P6(), 1)
})
// @from(Ln 525582, Col 0)
function rK5(q) {
    let K = s(10),
        {
            verbose: _
        } = q,
        [z, Y] = Zs8.useState(!1),
        [A, O] = Zs8.useState("unknown"),
        [w, $] = Zs8.useState(null),
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = async () => {
        if (Yd()) return;
        let [Z, G] = await Promise.all([vu(), oS6()]);
        O(G);
        let f = Z,
            v = null;
        if (G === "homebrew") v = Dp8(), $(v), f = v === "claude-code@latest" ? "latest" : "stable";
        let V = G === "homebrew" ? await Mp8(v ?? "claude-code", f) : await nq8(f),
            k = await l36();
        if (k && V && RP(V, k)) {
            if (E(`PackageManagerAutoUpdater: maxVersion ${k} is set, capping update from ${V} to ${k}`), QW({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION, k)) {
                E(`PackageManagerAutoUpdater: current version ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} is already at or above maxVersion ${k}, skipping update`), Y(!1);
                return
            }
            V = k
        }
        let N = V && !QW({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION, V) && !Lt(V);
        if (Y(!!N), N) E(`PackageManagerAutoUpdater: Update available ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} -> ${V}`)
    }, K[0] = j;
    else j = K[0];
    let H = j,
        J, X;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        H()
    }, X = [H], K[1] = J, K[2] = X;
    else J = K[1], X = K[2];
    if (NL.useEffect(J, X), fD(H, 1800000), !z) return null;
    let M = A === "homebrew" ? `brew upgrade ${w??"claude-code"}` : A === "winget" ? "winget upgrade Anthropic.ClaudeCode" : A === "apk" ? "apk upgrade claude-code" : "your package manager update command",
        P;
    if (K[3] !== _) P = _ && NL.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "currentVersion: ", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION), K[3] = _, K[4] = P;
    else P = K[4];
    let W;
    if (K[5] !== M) W = NL.createElement(T, {
        color: "warning",
        wrap: "truncate"
    }, "Update available! Run: ", NL.createElement(T, {
        bold: !0
    }, M)), K[5] = M, K[6] = W;
    else W = K[6];
    let D;
    if (K[7] !== P || K[8] !== W) D = NL.createElement(NL.Fragment, null, P, W), K[7] = P, K[8] = W, K[9] = D;
    else D = K[9];
    return D
}
// @from(Ln 525659, Col 4)
NL
// @from(Ln 525659, Col 8)
Zs8
// @from(Ln 525660, Col 4)
oK5 = L(() => {
    o6();
    wk();
    g6();
    ht();
    h1();
    K8();
    Zp8();
    h_6();
    NL = K6(P6(), 1), Zs8 = K6(P6(), 1)
})
// @from(Ln 525672, Col 0)
function aK5(q) {
    let K = s(13),
        {
            isUpdating: _,
            onChangeIsUpdating: z,
            showSuccessMessage: Y,
            verbose: A
        } = q,
        [O, w] = ln.useState(null),
        [$, j] = ln.useState(null),
        H, J;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = () => {
        (async function() {
            let D = await Rt();
            E(`AutoUpdaterWrapper: Installation type: ${D}`), w(D === "native"), j(D === "package-manager")
        })()
    }, J = [], K[0] = H, K[1] = J;
    else H = K[0], J = K[1];
    if (ln.useEffect(H, J), O === null || $ === null) return null;
    if ($) {
        let P;
        if (K[2] !== _ || K[3] !== z || K[4] !== Y || K[5] !== A) P = ln.createElement(rK5, {
            verbose: A,
            isUpdating: _,
            onChangeIsUpdating: z,
            showSuccessMessage: Y
        }), K[2] = _, K[3] = z, K[4] = Y, K[5] = A, K[6] = P;
        else P = K[6];
        return P
    }
    let X = O ? nK5 : cK5,
        M;
    if (K[7] !== X || K[8] !== _ || K[9] !== z || K[10] !== Y || K[11] !== A) M = ln.createElement(X, {
        verbose: A,
        isUpdating: _,
        onChangeIsUpdating: z,
        showSuccessMessage: Y
    }), K[7] = X, K[8] = _, K[9] = z, K[10] = Y, K[11] = A, K[12] = M;
    else M = K[12];
    return M
}
// @from(Ln 525713, Col 4)
ln
// @from(Ln 525714, Col 4)
sK5 = L(() => {
    o6();
    h1();
    K8();
    n36();
    lK5();
    iK5();
    oK5();
    ln = K6(P6(), 1)
})
// @from(Ln 525728, Col 0)
function tK5(q) {
    let K = s(7),
        {
            ideSelection: _,
            mcpClients: z
        } = q,
        {
            status: Y
        } = Wm6(z),
        A = Y === "connected" && (_?.filePath || _?.text && _.lineCount > 0);
    if (Y === null || !A || !_) return null;
    if (_.text && _.lineCount > 0) {
        let O = _.lineCount === 1 ? "line" : "lines",
            w;
        if (K[0] !== _.lineCount || K[1] !== O) w = tz8.createElement(T, {
            color: "ide",
            key: "selection-indicator",
            wrap: "truncate"
        }, "⧉ ", _.lineCount, " ", O, " selected"), K[0] = _.lineCount, K[1] = O, K[2] = w;
        else w = K[2];
        return w
    }
    if (_.filePath) {
        let O;
        if (K[3] !== _.filePath) O = I5A(_.filePath), K[3] = _.filePath, K[4] = O;
        else O = K[4];
        let w;
        if (K[5] !== O) w = tz8.createElement(T, {
            color: "ide",
            key: "selection-indicator",
            wrap: "truncate"
        }, "⧉ In ", O), K[5] = O, K[6] = w;
        else w = K[6];
        return w
    }
}
// @from(Ln 525764, Col 4)
tz8
// @from(Ln 525765, Col 4)
eK5 = L(() => {
    o6();
    Ms8();
    g6();
    tz8 = K6(P6(), 1)
})
// @from(Ln 525772, Col 0)
function K55() {
    let [q, K] = fs8.useState(null), _ = fs8.useRef("normal");
    return fD(() => {
        let {
            heapUsed: z,
            rss: Y
        } = process.memoryUsage(), A = z >= u5A ? "critical" : z >= x5A ? "high" : "normal";
        if (q55[A] > q55[_.current]) d("tengu_memory_threshold_crossed", {
            rss_mb: Math.round(Y / 1024 / 1024),
            heap_used_mb: Math.round(z / 1024 / 1024),
            status: A
        }), _.current = A;
        K((O) => {
            if (A === "normal") return O === null ? O : null;
            return {
                heapUsed: z,
                status: A
            }
        })
    }, 1e4), q
}
// @from(Ln 525793, Col 4)
fs8
// @from(Ln 525793, Col 9)
x5A = 1610612736
// @from(Ln 525794, Col 4)
u5A = 2684354560
// @from(Ln 525795, Col 4)
q55
// @from(Ln 525796, Col 4)
_55 = L(() => {
    wk();
    C8();
    fs8 = K6(P6(), 1), q55 = {
        normal: 0,
        high: 1,
        critical: 2
    }
})
// @from(Ln 525806, Col 0)
function z55() {
    return null
}
// @from(Ln 525809, Col 4)
ez8
// @from(Ln 525810, Col 4)
Y55 = L(() => {
    _55();
    g6();
    c7();
    ez8 = K6(P6(), 1)
})
// @from(Ln 525817, Col 0)
function A55(q) {
    let K = s(14),
        {
            tokenUsage: _,
            model: z
        } = q,
        Y = M8(p5A),
        A;
    if (K[0] !== Y || K[1] !== z || K[2] !== _) A = UM6(_, z, Y), K[0] = Y, K[1] = z, K[2] = _, K[3] = A;
    else A = K[3];
    let {
        percentLeft: O,
        isAboveWarningThreshold: w,
        isAboveErrorThreshold: $
    } = A, j = Ws8();
    if (!w || j) return null;
    let H;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) H = z0(), K[4] = H;
    else H = K[4];
    let J = H,
        X;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) X = nC6("warning"), K[5] = X;
    else X = K[5];
    let M = X,
        P = O,
        W = bx() && !Z38(z, Y),
        D = !1;
    if (W || D) {
        let f = Yn(z, Y),
            v;
        if (K[6] !== f || K[7] !== _) v = Math.round((f - _) / f * 100), K[6] = f, K[7] = _, K[8] = v;
        else v = K[8];
        P = Math.max(0, v)
    }
    let Z = W ? `${100-P}% context used` : `${P}% until auto-compact`,
        G;
    if (K[10] !== Z || K[11] !== $ || K[12] !== O) G = gW6.createElement(u, {
        flexDirection: "row"
    }, J ? gW6.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, M ? `${Z} · ${M}` : Z) : gW6.createElement(T, {
        color: $ ? "error" : "warning",
        wrap: "truncate"
    }, M ? `Context low (${O}% remaining) · ${M}` : S6(process.env.DISABLE_COMPACT) ? `Context low (${O}% remaining)` : `Context low (${O}% remaining) · Run /compact to compact & continue`)), K[10] = Z, K[11] = $, K[12] = O, K[13] = G;
    else G = K[13];
    return G
}
// @from(Ln 525866, Col 0)
function p5A(q) {
    return q.autoCompactWindow
}
// @from(Ln 525869, Col 4)
gW6
// @from(Ln 525869, Col 9)
B5A
// @from(Ln 525870, Col 4)
O55 = L(() => {
    o6();
    g6();
    rR();
    XM7();
    XR6();
    N7();
    Q8();
    Ig8();
    gW6 = K6(P6(), 1), B5A = K6(P6(), 1)
})
// @from(Ln 525882, Col 0)
function w55() {
    let q = s(6),
        [K, _] = Zm6.useState(0),
        z = Zm6.useRef(null),
        Y = V3("app:toggleTranscript", "Global", "ctrl+o"),
        A, O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = () => {
        if (!Z7.isSandboxingEnabled()) return;
        let j = Z7.getSandboxViolationStore(),
            H = j.getTotalCount(),
            J = j.subscribe(() => {
                let X = j.getTotalCount(),
                    M = X - H;
                if (M > 0) {
                    if (_(M), H = X, z.current) clearTimeout(z.current);
                    z.current = setTimeout(_, 5000, 0)
                }
            });
        return () => {
            if (J(), z.current) clearTimeout(z.current)
        }
    }, O = [], q[0] = A, q[1] = O;
    else A = q[0], O = q[1];
    if (Zm6.useEffect(A, O), !Z7.isSandboxingEnabled() || K === 0) return null;
    let w = K === 1 ? "operation" : "operations",
        $;
    if (q[2] !== Y || q[3] !== K || q[4] !== w) $ = qY8.createElement(u, {
        paddingX: 0,
        paddingY: 0
    }, qY8.createElement(T, {
        color: "inactive",
        wrap: "truncate"
    }, "⧈ Sandbox blocked ", K, " ", w, " ·", " ", Y, " for details · /sandbox to disable")), q[2] = Y, q[3] = K, q[4] = w, q[5] = $;
    else $ = q[5];
    return $
}
// @from(Ln 525918, Col 4)
qY8
// @from(Ln 525918, Col 9)
Zm6
// @from(Ln 525919, Col 4)
$55 = L(() => {
    o6();
    g6();
    RM();
    yY();
    qY8 = K6(P6(), 1), Zm6 = K6(P6(), 1)
})
// @from(Ln 525926, Col 4)
H55 = {}
// @from(Ln 525932, Col 0)
function Q5A(q) {
    let K = s(2),
        _;
    if (K[0] !== q) _ = GN.createElement(d5A, {
        ...q
    }), K[0] = q, K[1] = _;
    else _ = K[1];
    return _
}
// @from(Ln 525942, Col 0)
function d5A({
    voiceState: q
}) {
    switch (q) {
        case "recording":
            return GN.createElement(T, {
                dimColor: !0
            }, "listening…");
        case "processing":
            return GN.createElement(c5A, null);
        case "idle":
            return null
    }
}
// @from(Ln 525957, Col 0)
function PM7() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = GN.createElement(T, {
        dimColor: !0
    }, "keep holding…"), q[0] = K;
    else K = q[0];
    return K
}
// @from(Ln 525967, Col 0)
function c5A() {
    let q = s(8),
        _ = iO().prefersReducedMotion ?? !1,
        [z, Y] = _O(_ ? null : 50);
    if (_) {
        let J;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = GN.createElement(T, {
            color: "warning"
        }, "Voice: processing…"), q[0] = J;
        else J = q[0];
        return J
    }
    let A = Y / 1000,
        O = (Math.sin(A * Math.PI * 2 / U5A) + 1) / 2,
        w;
    if (q[1] !== O) w = fR($p(F5A, g5A, O)), q[1] = O, q[2] = w;
    else w = q[2];
    let $ = w,
        j;
    if (q[3] !== $) j = GN.createElement(T, {
        color: $
    }, "Voice: processing…"), q[3] = $, q[4] = j;
    else j = q[4];
    let H;
    if (q[5] !== z || q[6] !== j) H = GN.createElement(u, {
        ref: z
    }, j), q[5] = z, q[6] = j, q[7] = H;
    else H = q[7];
    return H
}
// @from(Ln 525997, Col 4)
GN
// @from(Ln 525997, Col 8)
F5A
// @from(Ln 525997, Col 13)
g5A
// @from(Ln 525997, Col 18)
U5A = 2
// @from(Ln 525998, Col 4)
WM7 = L(() => {
    o6();
    A3();
    tE();
    g6();
    N7();
    Bd();
    GN = K6(P6(), 1), F5A = {
        r: 153,
        g: 153,
        b: 153
    }, g5A = {
        r: 185,
        g: 185,
        b: 185
    }
})
// @from(Ln 526016, Col 0)
function vs8({
    apiKeyStatus: q,
    debug: K,
    isAutoUpdating: _,
    verbose: z,
    messages: Y,
    onChangeIsUpdating: A,
    ideSelection: O,
    mcpClients: w,
    isInputWrapped: $ = !1
}) {
    let j = M8((B) => B.autoUpdaterResult?.status),
        H = Gg.useMemo(() => {
            let B = H2(Y);
            return sI(B)
        }, [Y]),
        J = s2(),
        X = M8((B) => B.autoCompactWindow),
        M = UM6(H, J, X).isAboveWarningThreshold,
        P = Ws8(),
        W = M8((B) => B.isBriefOnly),
        {
            status: D
        } = Wm6(w),
        Z = M8((B) => B.notifications),
        {
            addNotification: G,
            removeNotification: f
        } = EK(),
        v = h96();
    Gg.useEffect(() => {
        return Fi1((B, m) => {
            G({
                key: "env-hook",
                text: B,
                color: m ? "error" : void 0,
                priority: m ? "medium" : "low",
                timeoutMs: m ? 8000 : 5000
            })
        }), () => Fi1(null)
    }, [G]);
    let k = !(D === "connected" && (O?.filePath || O?.text && O.lineCount > 0)) || _ || j !== "success",
        N = v.isUsingOverage,
        R = MK(),
        h = R === "team" || R === "enterprise",
        C = XL(),
        x = $ && !M && q !== "invalid" && q !== "missing" && C !== void 0;
    return Gg.useEffect(() => {
        if (x && C) d("tengu_external_editor_hint_shown", {}), G({
            key: "external-editor-hint",
            jsx: mK.createElement(T, {
                dimColor: !0
            }, mK.createElement(v1, {
                action: "chat:externalEditor",
                context: "Chat",
                fallback: "ctrl+g",
                description: `edit in ${kH(C)}`
            })),
            priority: "immediate",
            timeoutMs: 5000
        });
        else f("external-editor-hint")
    }, [x, C, G, f]), Gg.useEffect(() => {
        if (M && !P && !W) G({
            key: "token-warning",
            jsx: mK.createElement(A55, {
                tokenUsage: H,
                model: J
            }),
            priority: "medium",
            timeoutMs: 18000000,
            fold: (B, m) => m
        });
        else f("token-warning")
    }, [M, P, W, H, J, G, f]), mK.createElement(oX6, null, mK.createElement(u, {
        flexDirection: "column",
        alignItems: "flex-end",
        flexShrink: 0,
        overflowX: "hidden"
    }, mK.createElement(n5A, {
        ideSelection: O,
        mcpClients: w,
        notifications: Z,
        isInOverageMode: N ?? !1,
        isTeamOrEnterprise: h,
        apiKeyStatus: q,
        debug: K,
        verbose: z,
        tokenUsage: H,
        shouldShowAutoUpdater: k,
        isAutoUpdating: _,
        isShowingCompactMessage: M,
        onChangeIsUpdating: A
    })))
}
// @from(Ln 526112, Col 0)
function n5A({
    ideSelection: q,
    mcpClients: K,
    notifications: _,
    isInOverageMode: z,
    isTeamOrEnterprise: Y,
    apiKeyStatus: A,
    debug: O,
    verbose: w,
    tokenUsage: $,
    shouldShowAutoUpdater: j,
    isAutoUpdating: H,
    isShowingCompactMessage: J,
    onChangeIsUpdating: X
}) {
    let [M, P] = Gg.useState(null);
    Gg.useEffect(() => {
        if (MK() !== "pro" || !u8("tengu_amber_swift", !1)) {
            P((k) => k === null ? k : null);
            return
        }
        let v = () => {
            let k = r5A($, Ri());
            P((N) => N === k ? N : k)
        };
        v();
        let V = setInterval(v, 30000);
        return () => clearInterval(V)
    }, [$]);
    let [W, D] = Gg.useState(null);
    Gg.useEffect(() => {
        if (!sQ()) return;
        let v = setInterval((V) => {
            let k = oR1(),
                N = k >= 1e4 ? C5(k) : null;
            V((R) => N === R ? R : N)
        }, 1000, D);
        return () => clearInterval(v)
    }, []);
    let Z = oE((v) => v.voiceState),
        G = FW6(),
        f = oE((v) => v.voiceError);
    if (G && (Z === "recording" || Z === "processing")) return mK.createElement(l5A, {
        voiceState: Z
    });
    return mK.createElement(mK.Fragment, null, mK.createElement(tK5, {
        ideSelection: q,
        mcpClients: K
    }), z && !Y && mK.createElement(u, null, mK.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "Now using extra usage")), W && mK.createElement(u, null, mK.createElement(T, {
        color: "warning",
        wrap: "truncate"
    }, "apiKeyHelper is taking a while", " "), mK.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "(", W, ")")), (A === "invalid" || A === "missing") && mK.createElement(u, null, mK.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, S6(process.env.CLAUDE_CODE_REMOTE) ? "Authentication error · Try again" : "Not logged in · Run /login")), O && mK.createElement(u, null, mK.createElement(T, {
        color: "warning",
        wrap: "truncate"
    }, "Debug mode")), A !== "invalid" && A !== "missing" && w && mK.createElement(u, null, mK.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, $, " tokens")), M && mK.createElement(u, null, mK.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, M)), j && mK.createElement(aK5, {
        verbose: w,
        isUpdating: H,
        onChangeIsUpdating: X,
        showSuccessMessage: !J
    }), G && f && mK.createElement(u, null, mK.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, f)), mK.createElement(z55, null), mK.createElement(w55, null), _.current && ("jsx" in _.current ? mK.createElement(T, {
        wrap: "truncate",
        key: _.current.key
    }, _.current.jsx) : mK.createElement(T, {
        color: _.current.color,
        dimColor: !_.current.color,
        wrap: "truncate"
    }, _.current.text)))
}
// @from(Ln 526199, Col 0)
function r5A(q, K, _ = Date.now()) {
    if (K === null) return null;
    if (q < i5A) return null;
    if (_ - K <= ke6) return null;
    return `~${Math.round(q/1000)}k uncached · /clear to start fresh`
}
// @from(Ln 526205, Col 4)
mK
// @from(Ln 526205, Col 8)
Gg
// @from(Ln 526205, Col 12)
l5A
// @from(Ln 526205, Col 17)
Gs8 = 5000
// @from(Ln 526206, Col 4)
i5A = 50000
// @from(Ln 526207, Col 4)
Ts8 = L(() => {
    kY();
    C8();
    N7();
    y8();
    B$6();
    Ms8();
    oy();
    Ps8();
    g6();
    B1();
    FK6();
    hK8();
    rR();
    XM7();
    T7();
    Tn();
    Q8();
    c7();
    V18();
    kj();
    _7();
    kD();
    sK5();
    bK();
    eK5();
    Y55();
    lg8();
    O55();
    $55();
    mK = K6(P6(), 1), Gg = K6(P6(), 1), l5A = (WM7(), B7(H55)).VoiceIndicator
})
// @from(Ln 526239, Col 0)
async function o5A(q, K) {
    let _ = Math.ceil(q / J55) * J55;
    if (QW6 && Vs8 >= _ && DM7 === K) return QW6;
    if (QW6) await QW6;
    Vs8 = _, DM7 = K, QW6 = (async () => {
        let z = [],
            Y = 0;
        for await (let A of my8()) {
            if (K) {
                if (ZR(A.display) !== K) continue
            }
            if (z.push(A), Y++, Y >= Vs8) break
        }
        return z
    })();
    try {
        return await QW6
    } finally {
        QW6 = null, Vs8 = 0, DM7 = void 0
    }
}
// @from(Ln 526261, Col 0)
function X55(q, K, _, z, Y) {
    let [A, O] = UJ.useState(0), [w, $] = UJ.useState(void 0), j = UJ.useRef(!1), {
        addNotification: H,
        removeNotification: J
    } = EK(), X = UJ.useRef([]), M = UJ.useRef(void 0), P = UJ.useRef(0), W = UJ.useRef(void 0), D = UJ.useRef(K), Z = UJ.useRef(_), G = UJ.useRef(Y);
    D.current = K, Z.current = _, G.current = Y;
    let f = UJ.useCallback((C, x, B, m = !1) => {
            q(C, x, B), z?.(m ? 0 : C.length)
        }, [q, z]),
        v = UJ.useCallback((C, x = !1) => {
            if (!C || !C.display) return;
            let B = ZR(C.display),
                m = B === "bash" ? C.display.slice(1) : C.display;
            f(m, B, C.pastedContents ?? {}, x)
        }, [f]),
        V = UJ.useCallback(() => {
            H({
                key: "search-history-hint",
                jsx: UJ.default.createElement(T, {
                    dimColor: !0
                }, UJ.default.createElement(v1, {
                    action: "history:search",
                    context: "Global",
                    fallback: "ctrl+r",
                    description: "search history"
                })),
                priority: "immediate",
                timeoutMs: Gs8
            })
        }, [H]),
        k = UJ.useCallback(() => {
            let C = P.current;
            P.current++;
            let x = D.current,
                B = Z.current,
                m = G.current;
            if (C === 0) {
                W.current = m === "bash" ? m : void 0;
                let F = x.trim() !== "";
                $(F ? {
                    display: x,
                    pastedContents: B,
                    mode: m
                } : void 0)
            }
            let S = W.current;
            (async () => {
                let F = C + 1;
                if (M.current !== S) X.current = [], M.current = S, P.current = 0;
                if (X.current.length < F) {
                    let g = await o5A(F, S);
                    if (g.length > X.current.length) X.current = g
                }
                if (C >= X.current.length) {
                    P.current--;
                    return
                }
                let U = C + 1;
                if (O(U), v(X.current[C], !0), U >= 2 && !j.current) j.current = !0, V()
            })()
        }, [v, V]),
        N = UJ.useCallback(() => {
            let C = P.current;
            if (C > 1) P.current--, O(C - 1), v(X.current[C - 2]);
            else if (C === 1)
                if (P.current = 0, O(0), w) {
                    let x = w.mode;
                    if (x) f(w.display, x, w.pastedContents ?? {});
                    else v(w)
                } else f("", W.current ?? "prompt", {});
            return C <= 0
        }, [w, v, f]),
        R = UJ.useCallback(() => {
            $(void 0), O(0), P.current = 0, W.current = void 0, J("search-history-hint"), X.current = [], M.current = void 0
        }, [J]),
        h = UJ.useCallback(() => {
            J("search-history-hint")
        }, [J]);
    return {
        historyIndex: A,
        setHistoryIndex: O,
        onHistoryUp: k,
        onHistoryDown: N,
        resetHistory: R,
        dismissSearchHint: h
    }
}
// @from(Ln 526348, Col 4)
UJ
// @from(Ln 526348, Col 8)
J55 = 10
// @from(Ln 526349, Col 4)
QW6 = null
// @from(Ln 526350, Col 4)
Vs8 = 0
// @from(Ln 526351, Col 4)
DM7 = void 0
// @from(Ln 526352, Col 4)
M55 = L(() => {
    kY();
    bK();
    Ts8();
    II();
    g6();
    UJ = K6(P6(), 1)
})
// @from(Ln 526361, Col 0)
function P55(q, K, _, z, Y, A, O, w, $, j, H) {
    let [J, X] = r$.useState(""), [M, P] = r$.useState(!1), [W, D] = r$.useState(""), [Z, G] = r$.useState(0), [f, v] = r$.useState("prompt"), [V, k] = r$.useState({}), [N, R] = r$.useState(void 0), h = r$.useRef(void 0), C = r$.useRef(new Set), x = r$.useRef(null), B = r$.useCallback(() => {
        if (h.current) h.current.return(void 0), h.current = void 0
    }, []), m = r$.useCallback(() => {
        $(!1), X(""), P(!1), D(""), G(0), v("prompt"), k({}), R(void 0), B(), C.current.clear()
    }, [$, B]), S = r$.useCallback(async (e, i) => {
        if (!w) return;
        if (J.length === 0) {
            B(), C.current.clear(), R(void 0), P(!1), _(W), z(Z), A(f), j(V);
            return
        }
        if (!e) B(), h.current = HB1(), C.current.clear();
        if (!h.current) return;
        while (!0) {
            if (i?.aborted) return;
            let O6 = await h.current.next();
            if (O6.done) {
                P(!0);
                return
            }
            let J6 = O6.value.display,
                $6 = J6.lastIndexOf(J);
            if ($6 !== -1 && !C.current.has(J6)) {
                C.current.add(J6), R(O6.value), P(!1);
                let H6 = ZR(J6);
                A(H6), _(J6), j(O6.value.pastedContents);
                let o = Ap(J6).lastIndexOf(J);
                z(o !== -1 ? o : $6);
                return
            }
        }
    }, [w, J, B, _, z, A, j, W, Z, f, V]), F = r$.useCallback(() => {
        $(!0), D(K), G(Y), v(O), k(H), h.current = HB1(), C.current.clear()
    }, [$, K, Y, O, H]), U = r$.useCallback(() => {
        S(!0)
    }, [S]), g = r$.useCallback(() => {
        if (N) {
            let e = ZR(N.display),
                i = Ap(N.display);
            _(i), A(e), j(N.pastedContents)
        } else j(V);
        m()
    }, [N, _, A, j, V, m]), c = r$.useCallback(() => {
        _(W), z(Z), j(V), m()
    }, [_, z, j, W, Z, V, m]), n = r$.useCallback(() => {
        if (J.length === 0) q({
            display: W,
            pastedContents: V
        });
        else if (N) {
            let e = ZR(N.display),
                i = Ap(N.display);
            A(e), q({
                display: i,
                pastedContents: N.pastedContents
            })
        }
        m()
    }, [J, N, q, A, W, V, m]);
    G1("history:search", F, {
        context: "Global",
        isActive: !w
    });
    let l = r$.useMemo(() => ({
        "historySearch:next": U,
        "historySearch:accept": g,
        "historySearch:cancel": c,
        "historySearch:execute": n
    }), [U, g, c, n]);
    L7(l, {
        context: "HistorySearch",
        isActive: w
    });
    let z6 = (e) => {
            if (!w) return;
            if (e.key === "backspace" && J === "") e.preventDefault(), c()
        },
        A6 = r$.useRef(S);
    return A6.current = S, r$.useEffect(() => {
        x.current?.abort();
        let e = new AbortController;
        return x.current = e, A6.current(!1, e.signal), () => {
            e.abort()
        }
    }, [J]), {
        historyQuery: J,
        setHistoryQuery: X,
        historyMatch: N,
        historyFailedMatch: M,
        handleKeyDown: z6
    }
}
// @from(Ln 526453, Col 4)
r$
// @from(Ln 526454, Col 4)
W55 = L(() => {
    II();
    C7();
    r$ = K6(P6(), 1)
})
// @from(Ln 526460, Col 0)
function D55({
    maxBufferSize: q,
    debounceMs: K
}) {
    let [_, z] = nn.useState([]), [Y, A] = nn.useState(-1), O = nn.useRef(0), w = nn.useRef(null), $ = nn.useCallback((X, M, P = {}) => {
        let W = Date.now();
        if (w.current) clearTimeout(w.current), w.current = null;
        if (W - O.current < K) {
            w.current = setTimeout($, K, X, M, P);
            return
        }
        O.current = W, z((D) => {
            let Z = Y >= 0 ? D.slice(0, Y + 1) : D,
                G = Z[Z.length - 1];
            if (G && G.text === X) return Z;
            let f = [...Z, {
                text: X,
                cursorOffset: M,
                pastedContents: P,
                timestamp: W
            }];
            if (f.length > q) return f.slice(-q);
            return f
        }), A((D) => {
            let Z = D >= 0 ? D + 1 : _.length;
            return Math.min(Z, q - 1)
        })
    }, [K, q, Y, _.length]), j = nn.useCallback(() => {
        if (Y < 0 || _.length === 0) return;
        let X = Math.max(0, Y - 1),
            M = _[X];
        if (M) return A(X), M;
        return
    }, [_, Y]), H = nn.useCallback(() => {
        if (z([]), A(-1), O.current = 0, w.current) clearTimeout(w.current), w.current = null
    }, [O, w]), J = Y > 0 && _.length > 1;
    return {
        pushToBuffer: $,
        undo: j,
        canUndo: J,
        clearBuffer: H
    }
}
// @from(Ln 526503, Col 4)
nn
// @from(Ln 526504, Col 4)
Z55 = L(() => {
    nn = K6(P6(), 1)
})
// @from(Ln 526508, Col 0)
function f55({
    inputValue: q,
    isAssistantResponding: K
}) {
    let _ = M8((f) => f.promptSuggestion),
        z = R7(),
        Y = K2(),
        {
            text: A,
            promptId: O,
            shownAt: w,
            acceptedAt: $,
            generationRequestId: j
        } = _,
        H = K || q.length > 0 ? null : A,
        J = A && w > 0,
        X = y66.useRef(0),
        M = y66.useRef(!0),
        P = y66.useRef(0);
    if (w > 0 && w !== P.current) P.current = w, M.current = Y, X.current = 0;
    else if (w === 0) P.current = 0;
    if (q.length > 0 && X.current === 0 && J) X.current = Date.now();
    let W = y66.useCallback(() => {
            gD(z), z((f) => ({
                ...f,
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                }
            }))
        }, [z]),
        D = y66.useCallback(() => {
            if (!J) return;
            z((f) => ({
                ...f,
                promptSuggestion: {
                    ...f.promptSuggestion,
                    acceptedAt: Date.now()
                }
            }))
        }, [J, z]),
        Z = y66.useCallback(() => {
            z((f) => {
                if (f.promptSuggestion.shownAt !== 0 || !f.promptSuggestion.text) return f;
                return {
                    ...f,
                    promptSuggestion: {
                        ...f.promptSuggestion,
                        shownAt: Date.now()
                    }
                }
            })
        }, [z]),
        G = y66.useCallback((f, v) => {
            if (!J) return;
            let V = $ > w,
                k = V || f === A,
                N = k ? $ || Date.now() : Date.now();
            if (d("tengu_prompt_suggestion", {
                    source: "cli",
                    outcome: k ? "accepted" : "ignored",
                    prompt_id: O,
                    ...j && {
                        generationRequestId: j
                    },
                    ...k && {
                        acceptMethod: V ? "tab" : "enter"
                    },
                    ...k && {
                        timeToAcceptMs: N - w
                    },
                    ...!k && {
                        timeToIgnoreMs: N - w
                    },
                    ...X.current > 0 && {
                        timeToFirstKeystrokeMs: X.current - w
                    },
                    wasFocusedWhenShown: M.current,
                    similarity: Math.round(f.length / (A?.length || 1) * 100) / 100,
                    ...!1
                }), !v?.skipReset) W()
        }, [J, $, w, A, O, j, W]);
    return {
        suggestion: H,
        markAccepted: D,
        markShown: Z,
        logOutcomeAtSubmission: G
    }
}
// @from(Ln 526600, Col 4)
y66
// @from(Ln 526601, Col 4)
G55 = L(() => {
    ea6();
    C8();
    jt();
    N7();
    y66 = K6(P6(), 1)
})
// @from(Ln 526609, Col 0)
function fm6(q) {
    return "'" + q[0].replaceAll("'", `'"'"'`) + "'"
}
// @from(Ln 526613, Col 0)
function s5A(q) {
    if (q.startsWith("$")) return "variable";
    if (q.includes("/") || q.startsWith("~") || q.startsWith(".")) return "file";
    return "command"
}
// @from(Ln 526619, Col 0)
function t5A(q, K) {
    let _ = q.slice(0, K),
        z = _.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
    if (z) return {
        prefix: z[0],
        completionType: "variable"
    };
    let Y = _.split(/\s+/),
        A = Y.at(-1) || "",
        O = Y.length === 1 && !_.includes(" "),
        w = s5A(A);
    return {
        prefix: A,
        completionType: w !== "command" ? w : O ? "command" : "file"
    }
}
// @from(Ln 526636, Col 0)
function e5A(q, K) {
    if (K === "variable") {
        let _ = q.slice(1);
        return `compgen -v ${fm6([_])} 2>/dev/null`
    } else if (K === "file") return `compgen -f ${fm6([q])} 2>/dev/null | head -${ZM7} | while IFS= read -r f; do [ -d "$f" ] && echo "$f/" || echo "$f "; done`;
    else return `compgen -c ${fm6([q])} 2>/dev/null`
}
// @from(Ln 526644, Col 0)
function q3A(q, K) {
    if (K === "variable") {
        let _ = q.slice(1);
        return `print -rl -- \${(k)parameters[(I)${fm6([_])}*]} 2>/dev/null`
    } else if (K === "file") return `for f in ${fm6([q])}*(N[1,${ZM7}]); do [[ -d "$f" ]] && echo "$f/" || echo "$f "; done`;
    else return `print -rl -- \${(k)commands[(I)${fm6([q])}*]} 2>/dev/null`
}
// @from(Ln 526651, Col 0)
async function K3A(q, K, _, z, Y) {
    let A;
    if (q === "bash") A = e5A(K, _);
    else if (q === "zsh") A = q3A(K, _);
    else return [];
    return (await (await al(A, z, "bash", {
        timeout: a5A,
        sessionEnvVars: Y
    })).result).stdout.split(`
`).filter(($) => $.trim()).slice(0, ZM7).map(($) => ({
        id: $,
        displayText: $,
        description: void 0,
        metadata: {
            completionType: _
        }
    }))
}
// @from(Ln 526669, Col 0)
async function v55(q, K, _, z) {
    let Y = nS6();
    if (Y !== "bash" && Y !== "zsh") return [];
    try {
        let {
            prefix: A,
            completionType: O
        } = t5A(q, K);
        if (!A) return [];
        return (await K3A(Y, A, O, _, z)).map(($) => ({
            ...$,
            metadata: {
                ...$.metadata,
                inputSnapshot: q
            }
        }))
    } catch (A) {
        return E(`Shell completion failed: ${A}`), []
    }
}
// @from(Ln 526689, Col 4)
ZM7 = 15
// @from(Ln 526690, Col 4)
a5A = 1000
// @from(Ln 526691, Col 4)
T55 = L(() => {
    K8();
    OX6();
    $G()
})
// @from(Ln 526697, Col 0)
function _3A(q) {
    if (fM7?.commands === q) return fM7.fuse;
    let K = q.filter((z) => !z.isHidden).map((z) => {
            let Y = z.name,
                A = y_(z),
                O = Y.split(V55).filter(Boolean),
                w = A !== Y ? A.split(V55).filter(Boolean) : [];
            return {
                descriptionKey: (z.description ?? "").split(" ").map(($) => O3A($)).filter(Boolean),
                partKey: O.length > 1 ? O : void 0,
                displayPartKey: w.length > 1 ? w : void 0,
                commandName: Y,
                displayName: A,
                command: z,
                aliasKey: z.aliases
            }
        }),
        _ = new Lu(K, {
            includeScore: !0,
            threshold: 0.3,
            location: 0,
            distance: 100,
            keys: [{
                name: "commandName",
                weight: 3
            }, {
                name: "displayName",
                weight: 2
            }, {
                name: "partKey",
                weight: 2
            }, {
                name: "aliasKey",
                weight: 2
            }, {
                name: "displayPartKey",
                weight: 1
            }, {
                name: "descriptionKey",
                weight: 0.5
            }]
        });
    return fM7 = {
        commands: q,
        fuse: _
    }, _
}
// @from(Ln 526745, Col 0)
function k55(q) {
    return typeof q === "object" && q !== null && "name" in q && typeof q.name === "string" && "type" in q
}
// @from(Ln 526749, Col 0)
function Ns8(q, K) {
    if (q.startsWith("/")) return null;
    let z = q.slice(0, K).match(/[\s。、？！]\/([a-zA-Z0-9_:-]*)$/);
    if (!z || z.index === void 0) return null;
    let Y = z.index + 1,
        O = q.slice(Y + 1).match(/^[a-zA-Z0-9_:-]*/),
        w = O ? O[0] : "";
    if (K > Y + 1 + w.length) return null;
    return {
        token: "/" + w,
        startPos: Y,
        partialCommand: w
    }
}
// @from(Ln 526764, Col 0)
function vM7(q, K) {
    if (!q) return null;
    let _ = TM7("/" + q, K);
    if (_.length === 0) return null;
    let z = q.toLowerCase();
    for (let Y of _) {
        if (!k55(Y.metadata)) continue;
        for (let A of [Y.metadata.name, y_(Y.metadata)])
            if (A.toLowerCase().startsWith(z)) {
                let O = A.slice(q.length);
                if (O) return {
                    suffix: O,
                    fullCommand: A
                }
            }
    }
    return null
}
// @from(Ln 526783, Col 0)
function L66(q) {
    return q.startsWith("/")
}
// @from(Ln 526787, Col 0)
function z3A(q) {
    if (!L66(q)) return !1;
    if (!q.includes(" ")) return !1;
    if (q.endsWith(" ")) return !1;
    return !0
}
// @from(Ln 526794, Col 0)
function Y3A(q) {
    return `/${q} `
}