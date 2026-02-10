
// @from(Ln 272597, Col 0)
function UX6(A) {
    if (Ym1 !== void 0) clearTimeout(Ym1), Ym1 = void 0;
    try {
        process.exit(A)
    } catch (q) {
        process.kill(process.pid, "SIGKILL")
    }
    throw Error("unreachable")
}
// @from(Ln 272607, Col 0)
function w3(A = 0, q = "other", K) {
    process.exitCode = A, nK(A, q, K).catch((Y) => {
        h(`Graceful shutdown failed: ${Y}`, {
            level: "error"
        }), XGA(), DGA(), UX6(A)
    })
}
// @from(Ln 272615, Col 0)
function nO4() {
    return jGA
}
// @from(Ln 272618, Col 0)
async function nK(A = 0, q = "other", K) {
    if (jGA) return;
    jGA = !0, Ym1 = setTimeout(() => {
        UX6(A)
    }, 5000), Ym1.unref(), process.exitCode = A;
    try {
        let {
            executeSessionEndHooks: z
        } = await Promise.resolve().then(() => (aM(), rO4));
        await z(q, K)
    } catch {}
    let Y;
    try {
        let z = (async () => {
            try {
                await elA()
            } catch {}
        })();
        await Promise.race([z, new Promise((w, H) => {
            Y = setTimeout(() => H(Error("Cleanup timeout")), 2000)
        })]), clearTimeout(Y), await mX6(), await OGA(), XGA(), DGA(), UX6(A)
    } catch {
        clearTimeout(Y), await mX6(), await OGA(), XGA(), DGA(), UX6(A)
    }
}
// @from(Ln 272643, Col 4)
iO4
// @from(Ln 272643, Col 9)
jGA = !1
// @from(Ln 272644, Col 4)
Ym1
// @from(Ln 272645, Col 4)
w$ = v(() => {
    q3();
    zq();
    Z6();
    Tz();
    qm1();
    JGA();
    v71();
    Mu();
    ZD1();
    f0();
    u6();
    B6();
    lq();
    iO4 = KA(() => {
        if (process.on("SIGINT", () => {
                H8("info", "shutdown_signal", {
                    signal: "SIGINT"
                }), nK(0)
            }), process.on("SIGTERM", () => {
                H8("info", "shutdown_signal", {
                    signal: "SIGTERM"
                }), nK(143)
            }), process.platform !== "win32") process.on("SIGHUP", () => {
            H8("info", "shutdown_signal", {
                signal: "SIGHUP"
            }), nK(129)
        });
        process.on("uncaughtException", (A) => {
            H8("error", "uncaught_exception", {
                error_name: A.name,
                error_message: A.message.slice(0, 2000)
            }), c("tengu_uncaught_exception", {
                error_name: A.name
            })
        }), process.on("unhandledRejection", (A) => {
            let q = A instanceof Error ? A.name : typeof A === "string" ? "string" : "unknown",
                K = A instanceof Error ? {
                    error_name: A.name,
                    error_message: A.message.slice(0, 2000),
                    error_stack: A.stack?.slice(0, 4000)
                } : {
                    error_message: String(A).slice(0, 2000)
                };
            H8("error", "unhandled_rejection", K), c("tengu_unhandled_rejection", {
                error_name: q
            })
        })
    })
})
// @from(Ln 272695, Col 0)
async function pX6(A) {
    try {
        return await A()
    } catch (q) {
        if (sA.isAxiosError(q) && q.response?.status === 401) {
            c("tengu_grove_oauth_401_received", {});
            let K = a4()?.accessToken;
            if (K) return await EO1(K), await A()
        }
        throw q
    }
}
// @from(Ln 272707, Col 0)
async function VM1() {
    try {
        return {
            success: !0,
            data: (await pX6(() => {
                let q = DH();
                if (q.error) throw Error(`Failed to get auth headers: ${q.error}`);
                return sA.get(`${P4().BASE_API_URL}/api/oauth/account/settings`, {
                    headers: {
                        ...q.headers,
                        "User-Agent": XH()
                    }
                })
            })).data
        }
    } catch (A) {
        return K1(A), {
            success: !1
        }
    }
}
// @from(Ln 272728, Col 0)
async function MGA() {
    try {
        await pX6(() => {
            let A = DH();
            if (A.error) throw Error(`Failed to get auth headers: ${A.error}`);
            return sA.post(`${P4().BASE_API_URL}/api/oauth/account/grove_notice_viewed`, {}, {
                headers: {
                    ...A.headers,
                    "User-Agent": XH()
                }
            })
        })
    } catch (A) {
        K1(A)
    }
}
// @from(Ln 272744, Col 0)
async function dX6(A) {
    try {
        await pX6(() => {
            let q = DH();
            if (q.error) throw Error(`Failed to get auth headers: ${q.error}`);
            return sA.patch(`${P4().BASE_API_URL}/api/oauth/account/settings`, {
                grove_enabled: A
            }, {
                headers: {
                    ...q.headers,
                    "User-Agent": XH()
                }
            })
        })
    } catch (q) {
        K1(q)
    }
}
// @from(Ln 272762, Col 0)
async function NM1() {
    if (!jR1()) return !1;
    let A = u3()?.accountUuid;
    if (!A) return !1;
    let K = f6().groveConfigCache?.[A],
        Y = Date.now();
    if (!K) return h("Grove: No cache, fetching config in background (dialog skipped this session)"), oO4(A), !1;
    if (Y - K.timestamp > v6Y) return h("Grove: Cache stale, returning cached data and refreshing in background"), oO4(A), K.grove_enabled;
    return h("Grove: Using fresh cached config"), K.grove_enabled
}
// @from(Ln 272772, Col 0)
async function oO4(A) {
    try {
        let q = await Ds();
        if (!q.success) return;
        let K = q.data.grove_enabled;
        jA((Y) => ({
            ...Y,
            groveConfigCache: {
                ...Y.groveConfigCache,
                [A]: {
                    grove_enabled: K,
                    timestamp: Date.now()
                }
            }
        }))
    } catch (q) {
        h(`Grove: Failed to fetch and store config: ${q}`)
    }
}
// @from(Ln 272791, Col 4)
v6Y = 86400000
// @from(Ln 272792, Col 4)
Ds
// @from(Ln 272793, Col 4)
TM1 = v(() => {
    y5();
    B0();
    y6();
    Uz();
    Z6();
    u6();
    J7();
    cA();
    zq();
    Ds = KA(async () => {
        try {
            let A = await pX6(() => {
                    let w = DH();
                    if (w.error) throw Error(`Failed to get auth headers: ${w.error}`);
                    return sA.get(`${P4().BASE_API_URL}/api/claude_code_grove`, {
                        headers: {
                            ...w.headers,
                            "User-Agent": Jr()
                        },
                        timeout: 3000
                    })
                }),
                {
                    grove_enabled: q,
                    domain_excluded: K,
                    notice_is_grace_period: Y,
                    notice_reminder_frequency: z
                } = A.data;
            return {
                success: !0,
                data: {
                    grove_enabled: q,
                    domain_excluded: K ?? !1,
                    notice_is_grace_period: Y ?? !0,
                    notice_reminder_frequency: z
                }
            }
        } catch (A) {
            return h(`Failed to fetch Grove notice config: ${A}`), {
                success: !1
            }
        }
    })
})
// @from(Ln 272838, Col 4)
YIw
// @from(Ln 272838, Col 9)
aO4
// @from(Ln 272839, Col 4)
sO4 = v(() => {
    i7();
    YIw = u.object({
        checksum: u.string(),
        version: u.string().optional()
    }), aO4 = u.object({
        uuid: u.string(),
        checksum: u.string(),
        settings: u.record(u.string(), u.unknown())
    })
})
// @from(Ln 272851, Col 0)
function tO4({
    isDisabled: A = !1,
    visibleOptionCount: q = 5,
    options: K,
    defaultValue: Y = [],
    onChange: z,
    onCancel: w,
    onFocus: H,
    focusValue: $,
    submitButtonText: O,
    onSubmit: _,
    onDownFromLastItem: J,
    onUpFromFirstItem: X,
    initialFocusLast: D
}) {
    let [j, M] = J31.useState(Y), [P, W] = J31.useState(!1), [G, f] = J31.useState(() => {
        let k = new Map;
        return K.forEach((y) => {
            if (y.type === "input" && y.initialValue) k.set(y.value, y.initialValue)
        }), k
    }), Z = J31.useCallback((k) => {
        let y = typeof k === "function" ? k(j) : k;
        M(y), z?.(y)
    }, [j, z]), N = e26({
        visibleOptionCount: q,
        options: K,
        initialFocusValue: D ? K[K.length - 1]?.value : void 0,
        onFocus: H,
        focusValue: $
    });
    DZ("multi-select");
    let T = J31.useCallback((k, y) => {
        f((S) => {
            let m = new Map(S);
            return m.set(k, y), m
        });
        let B = K.find((S) => S.value === k);
        if (B && B.type === "input") B.onChange(y);
        Z((S) => {
            if (y) {
                if (!S.includes(k)) return [...S, k];
                return S
            } else return S.filter((m) => m !== k)
        })
    }, [K, Z]);
    return D8((k, y, B) => {
        let S = mD1(k),
            b = K.find((U) => U.value === N.focusedValue)?.type === "input";
        if (b) {
            if (!(y.upArrow || y.downArrow || y.escape || y.tab || y.return || y.ctrl && (k === "n" || k === "p" || y.return))) return
        }
        let g = K[K.length - 1]?.value;
        if (y.tab && !y.shift) {
            if (O && _ && N.focusedValue === g && !P) W(!0);
            else if (!P) N.focusNextOption();
            return
        }
        if (y.tab && y.shift) {
            if (O && _ && P) W(!1), N.focusOption(g);
            else N.focusPreviousOption();
            return
        }
        if (y.downArrow || y.ctrl && k === "n" || !y.ctrl && !y.shift && k === "j") {
            if (P && J) J();
            else if (O && _ && N.focusedValue === g && !P) W(!0);
            else if (!O && J && N.focusedValue === g) J();
            else if (!P) N.focusNextOption();
            return
        }
        if (y.upArrow || y.ctrl && k === "p" || !y.ctrl && !y.shift && k === "k") {
            if (O && _ && P) W(!1), N.focusOption(g);
            else if (X && N.focusedValue === K[0]?.value) X();
            else N.focusPreviousOption();
            return
        }
        if (y.pageDown) {
            N.focusNextPage();
            return
        }
        if (y.pageUp) {
            N.focusPreviousPage();
            return
        }
        if (y.return || Kw6(k) === " ") {
            if (y.ctrl && y.return && b && _) {
                _();
                return
            }
            if (P && _) {
                _();
                return
            }
            if (N.focusedValue !== void 0) {
                let U = j.includes(N.focusedValue) ? j.filter((x) => x !== N.focusedValue) : [...j, N.focusedValue];
                Z(U)
            }
            return
        }
        if (/^[0-9]+$/.test(S)) {
            let U = parseInt(S) - 1;
            if (U >= 0 && U < K.length) {
                let x = K[U].value,
                    p = j.includes(x) ? j.filter((l) => l !== x) : [...j, x];
                Z(p)
            }
            return
        }
        if (y.escape) w(), B.stopImmediatePropagation()
    }, {
        isActive: !A
    }), {
        ...N,
        selectedValues: j,
        inputValues: G,
        isSubmitFocused: P,
        updateInputValue: T,
        onCancel: w
    }
}
// @from(Ln 272970, Col 4)
J31
// @from(Ln 272971, Col 4)
eO4 = v(() => {
    m1();
    oS();
    U$A();
    J31 = o(X1(), 1)
})
// @from(Ln 272978, Col 0)
function A_4(A) {
    let q = e(43),
        {
            isDisabled: K,
            visibleOptionCount: Y,
            options: z,
            defaultValue: w,
            onCancel: H,
            onChange: $,
            onFocus: O,
            focusValue: _,
            submitButtonText: J,
            onSubmit: X,
            onDownFromLastItem: D,
            onUpFromFirstItem: j,
            initialFocusLast: M,
            onOpenEditor: P,
            hideIndexes: W,
            onImagePaste: G,
            pastedContents: f,
            onRemoveImage: Z
        } = A,
        N = K === void 0 ? !1 : K,
        T = Y === void 0 ? 5 : Y,
        k;
    if (q[0] !== w) k = w === void 0 ? [] : w, q[0] = w, q[1] = k;
    else k = q[1];
    let y = k,
        B = W === void 0 ? !1 : W,
        S;
    if (q[2] !== y || q[3] !== _ || q[4] !== M || q[5] !== N || q[6] !== H || q[7] !== $ || q[8] !== D || q[9] !== O || q[10] !== X || q[11] !== j || q[12] !== z || q[13] !== J || q[14] !== T) S = {
        isDisabled: N,
        visibleOptionCount: T,
        options: z,
        defaultValue: y,
        onChange: $,
        onCancel: H,
        onFocus: O,
        focusValue: _,
        submitButtonText: J,
        onSubmit: X,
        onDownFromLastItem: D,
        onUpFromFirstItem: j,
        initialFocusLast: M
    }, q[2] = y, q[3] = _, q[4] = M, q[5] = N, q[6] = H, q[7] = $, q[8] = D, q[9] = O, q[10] = X, q[11] = j, q[12] = z, q[13] = J, q[14] = T, q[15] = S;
    else S = q[15];
    let m = tO4(S),
        b, g, U, x, p;
    if (q[16] !== B || q[17] !== N || q[18] !== H || q[19] !== G || q[20] !== P || q[21] !== Z || q[22] !== z.length || q[23] !== f || q[24] !== m) {
        let O1 = z.length.toString().length;
        g = I, p = "column", b = I, U = "column", x = m.visibleOptions.map((T1, N1) => {
            let j1 = !N && m.focusedValue === T1.value && !m.isSubmitFocused,
                q1 = m.selectedValues.includes(T1.value),
                t = T1.index === m.visibleFromIndex,
                J1 = T1.index === m.visibleToIndex - 1,
                D1 = m.visibleToIndex < z.length,
                Z1 = m.visibleFromIndex > 0,
                E1 = m.visibleFromIndex + N1 + 1;
            if (T1.type === "input") {
                let a = m.inputValues.get(T1.value) || "";
                return gW.default.createElement(I, {
                    key: String(T1.value),
                    gap: 1
                }, gW.default.createElement(UD1, {
                    option: T1,
                    isFocused: j1,
                    isSelected: !1,
                    shouldShowDownArrow: D1 && J1,
                    shouldShowUpArrow: Z1 && t,
                    maxIndexWidth: O1,
                    index: E1,
                    inputValue: a,
                    onInputChange: (A1) => {
                        m.updateInputValue(T1.value, A1)
                    },
                    onSubmit: E6Y,
                    onExit: () => {
                        H()
                    },
                    layout: "compact",
                    onOpenEditor: P,
                    onImagePaste: G,
                    pastedContents: f,
                    onRemoveImage: Z
                }, gW.default.createElement(V, {
                    color: q1 ? "success" : void 0
                }, "[", q1 ? l1.tick : " ", "]", " ")))
            }
            return gW.default.createElement(I, {
                key: String(T1.value),
                gap: 1
            }, gW.default.createElement(Uo, {
                isFocused: j1,
                isSelected: !1,
                shouldShowDownArrow: D1 && J1,
                shouldShowUpArrow: Z1 && t,
                description: T1.description
            }, !B && gW.default.createElement(V, {
                dimColor: !0
            }, `${E1}.`.padEnd(O1)), gW.default.createElement(V, {
                color: !B && q1 ? "success" : void 0
            }, "[", q1 ? l1.tick : " ", "]"), gW.default.createElement(V, {
                color: j1 ? "suggestion" : void 0
            }, T1.label)))
        }), q[16] = B, q[17] = N, q[18] = H, q[19] = G, q[20] = P, q[21] = Z, q[22] = z.length, q[23] = f, q[24] = m, q[25] = b, q[26] = g, q[27] = U, q[28] = x, q[29] = p
    } else b = q[25], g = q[26], U = q[27], x = q[28], p = q[29];
    let l;
    if (q[30] !== b || q[31] !== U || q[32] !== x) l = gW.default.createElement(b, {
        flexDirection: U
    }, x), q[30] = b, q[31] = U, q[32] = x, q[33] = l;
    else l = q[33];
    let r;
    if (q[34] !== X || q[35] !== m.isSubmitFocused || q[36] !== J) r = J && X && gW.default.createElement(I, {
        marginTop: 0,
        gap: 1
    }, m.isSubmitFocused ? gW.default.createElement(V, {
        color: "suggestion"
    }, l1.pointer) : gW.default.createElement(V, null, " "), gW.default.createElement(I, {
        marginLeft: 3
    }, gW.default.createElement(V, {
        color: m.isSubmitFocused ? "suggestion" : void 0,
        bold: !0
    }, J))), q[34] = X, q[35] = m.isSubmitFocused, q[36] = J, q[37] = r;
    else r = q[37];
    let s;
    if (q[38] !== g || q[39] !== l || q[40] !== r || q[41] !== p) s = gW.default.createElement(g, {
        flexDirection: p
    }, l, r), q[38] = g, q[39] = l, q[40] = r, q[41] = p, q[42] = s;
    else s = q[42];
    return s
}
// @from(Ln 273110, Col 0)
function E6Y() {}
// @from(Ln 273111, Col 4)
gW
// @from(Ln 273112, Col 4)
q_4 = v(() => {
    i1();
    b7();
    m1();
    o$A();
    s26();
    eO4();
    gW = o(X1(), 1)
})
// @from(Ln 273121, Col 4)
wY = v(() => {
    U5();
    q_4()
})
// @from(Ln 273126, Col 0)
function vM1(A) {
    let q = e(13),
        {
            title: K,
            subtitle: Y,
            color: z,
            workerBadge: w
        } = A,
        H = z === void 0 ? "permission" : z,
        $;
    if (q[0] !== H || q[1] !== K) $ = Qh.createElement(V, {
        bold: !0,
        color: H
    }, K), q[0] = H, q[1] = K, q[2] = $;
    else $ = q[2];
    let O;
    if (q[3] !== w) O = w && Qh.createElement(V, {
        dimColor: !0
    }, "· ", "@", w.name), q[3] = w, q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== $ || q[6] !== O) _ = Qh.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, $, O), q[5] = $, q[6] = O, q[7] = _;
    else _ = q[7];
    let J;
    if (q[8] !== Y) J = Y != null && (typeof Y === "string" ? Qh.createElement(V, {
        dimColor: !0,
        wrap: "truncate-start"
    }, Y) : Y), q[8] = Y, q[9] = J;
    else J = q[9];
    let X;
    if (q[10] !== _ || q[11] !== J) X = Qh.createElement(I, {
        flexDirection: "column"
    }, _, J), q[10] = _, q[11] = J, q[12] = X;
    else X = q[12];
    return X
}
// @from(Ln 273165, Col 4)
Qh
// @from(Ln 273166, Col 4)
cX6 = v(() => {
    i1();
    m1();
    Qh = o(X1(), 1)
})
// @from(Ln 273172, Col 0)
function Bw(A) {
    let q = e(15),
        {
            title: K,
            subtitle: Y,
            color: z,
            titleColor: w,
            innerPaddingX: H,
            workerBadge: $,
            titleRight: O,
            children: _
        } = A,
        J = z === void 0 ? "permission" : z,
        X = H === void 0 ? 1 : H,
        D;
    if (q[0] !== Y || q[1] !== K || q[2] !== w || q[3] !== $) D = gh.createElement(vM1, {
        title: K,
        subtitle: Y,
        color: w,
        workerBadge: $
    }), q[0] = Y, q[1] = K, q[2] = w, q[3] = $, q[4] = D;
    else D = q[4];
    let j;
    if (q[5] !== D || q[6] !== O) j = gh.createElement(I, {
        paddingX: 1,
        flexDirection: "column"
    }, gh.createElement(I, {
        justifyContent: "space-between"
    }, D, O)), q[5] = D, q[6] = O, q[7] = j;
    else j = q[7];
    let M;
    if (q[8] !== _ || q[9] !== X) M = gh.createElement(I, {
        flexDirection: "column",
        paddingX: X
    }, _), q[8] = _, q[9] = X, q[10] = M;
    else M = q[10];
    let P;
    if (q[11] !== J || q[12] !== j || q[13] !== M) P = gh.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: J,
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !1,
        marginTop: 1
    }, j, M), q[11] = J, q[12] = j, q[13] = M, q[14] = P;
    else P = q[14];
    return P
}
// @from(Ln 273221, Col 4)
gh
// @from(Ln 273222, Col 4)
Bv = v(() => {
    i1();
    m1();
    cX6();
    gh = o(X1(), 1)
})
// @from(Ln 273228, Col 4)
K_4
// @from(Ln 273228, Col 9)
X31
// @from(Ln 273229, Col 4)
lX6 = v(() => {
    K_4 = ["apiKeyHelper", "awsAuthRefresh", "awsCredentialExport", "otelHeadersHelper", "statusLine"], X31 = new Set(["ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_DEFAULT_OPUS_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_MODEL", "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION", "ANTHROPIC_SMALL_FAST_MODEL", "AWS_DEFAULT_REGION", "AWS_PROFILE", "AWS_REGION", "BASH_DEFAULT_TIMEOUT_MS", "BASH_MAX_OUTPUT_LENGTH", "BASH_MAX_TIMEOUT_MS", "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR", "CLAUDE_BASH_NO_LOGIN", "CLAUDE_CODE_API_KEY_HELPER_TTL_MS", "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "CLAUDE_CODE_DISABLE_TERMINAL_TITLE", "CLAUDE_CODE_ENABLE_TELEMETRY", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS", "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL", "CLAUDE_CODE_MAX_OUTPUT_TOKENS", "CLAUDE_CODE_SKIP_BEDROCK_AUTH", "CLAUDE_CODE_SKIP_FOUNDRY_AUTH", "CLAUDE_CODE_SKIP_VERTEX_AUTH", "CLAUDE_CODE_SUBAGENT_MODEL", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_VERTEX", "DISABLE_AUTOUPDATER", "DISABLE_BUG_COMMAND", "DISABLE_COST_WARNINGS", "DISABLE_ERROR_REPORTING", "DISABLE_TELEMETRY", "ENABLE_EXPERIMENTAL_MCP_CLI", "ENABLE_TOOL_SEARCH", "MAX_MCP_OUTPUT_TOKENS", "MAX_THINKING_TOKENS", "MCP_TIMEOUT", "MCP_TOOL_TIMEOUT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_LOG_USER_PROMPTS", "OTEL_LOGS_EXPORT_INTERVAL", "OTEL_LOGS_EXPORTER", "OTEL_METRIC_EXPORT_INTERVAL", "OTEL_METRICS_EXPORTER", "OTEL_METRICS_INCLUDE_ACCOUNT_UUID", "OTEL_METRICS_INCLUDE_SESSION_ID", "OTEL_METRICS_INCLUDE_VERSION", "OTEL_RESOURCE_ATTRIBUTES", "USE_BUILTIN_RIPGREP", "VERTEX_REGION_CLAUDE_3_5_HAIKU", "VERTEX_REGION_CLAUDE_3_5_SONNET", "VERTEX_REGION_CLAUDE_3_7_SONNET", "VERTEX_REGION_CLAUDE_4_0_OPUS", "VERTEX_REGION_CLAUDE_4_0_SONNET", "VERTEX_REGION_CLAUDE_4_1_OPUS", "VERTEX_REGION_CLAUDE_HAIKU_4_5"])
})
// @from(Ln 273233, Col 0)
function EM1(A) {
    if (!A) return {
        shellSettings: {},
        envVars: {},
        hasHooks: !1
    };
    let q = {};
    for (let z of K_4) {
        let w = A[z];
        if (typeof w === "string" && w.length > 0) q[z] = w
    }
    let K = {};
    if (A.env && typeof A.env === "object") {
        for (let [z, w] of Object.entries(A.env))
            if (typeof w === "string" && w.length > 0) {
                if (!X31.has(z.toUpperCase())) K[z] = w
            }
    }
    let Y = A.hooks !== void 0 && A.hooks !== null && typeof A.hooks === "object" && Object.keys(A.hooks).length > 0;
    return {
        shellSettings: q,
        envVars: K,
        hasHooks: Y,
        hooks: Y ? A.hooks : void 0
    }
}
// @from(Ln 273260, Col 0)
function iX6(A) {
    return Object.keys(A.shellSettings).length > 0 || Object.keys(A.envVars).length > 0 || A.hasHooks
}
// @from(Ln 273264, Col 0)
function Y_4(A, q) {
    let K = EM1(A),
        Y = EM1(q);
    if (!iX6(Y)) return !1;
    if (!iX6(K)) return !0;
    let z = Q1({
            shellSettings: K.shellSettings,
            envVars: K.envVars,
            hooks: K.hooks
        }),
        w = Q1({
            shellSettings: Y.shellSettings,
            envVars: Y.envVars,
            hooks: Y.hooks
        });
    return z !== w
}
// @from(Ln 273282, Col 0)
function z_4(A) {
    let q = [];
    for (let K of Object.keys(A.shellSettings)) q.push(K);
    for (let K of Object.keys(A.envVars)) q.push(K);
    if (A.hasHooks) q.push("hooks");
    return q
}
// @from(Ln 273289, Col 4)
PGA = v(() => {
    lX6();
    m6()
})
// @from(Ln 273294, Col 0)
function w_4(A) {
    let q = e(26),
        {
            settings: K,
            onAccept: Y,
            onReject: z
        } = A,
        w = EM1(K),
        H = z_4(w),
        $ = uq(),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = {
        context: "Confirmation"
    }, q[0] = O;
    else O = q[0];
    DA("confirm:no", z, O);
    let _;
    if (q[1] !== Y || q[2] !== z) _ = function(l) {
        if (l === "exit") {
            z();
            return
        }
        Y()
    }, q[1] = Y, q[2] = z, q[3] = _;
    else _ = q[3];
    let J = _,
        X = Bw,
        D = "warning",
        j = "warning",
        M = "Managed settings require approval",
        P = I,
        W = "column",
        G = 1,
        f = 1,
        Z;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) Z = sM.default.createElement(V, null, "Your organization has configured managed settings that could allow execution of arbitrary code or interception of your prompts and responses."), q[4] = Z;
    else Z = q[4];
    let N = I,
        T = "column",
        k;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) k = sM.default.createElement(V, {
        dimColor: !0
    }, "Settings requiring approval:"), q[5] = k;
    else k = q[5];
    let y = H.map(k6Y),
        B;
    if (q[6] !== N || q[7] !== k || q[8] !== y) B = sM.default.createElement(N, {
        flexDirection: T
    }, k, y), q[6] = N, q[7] = k, q[8] = y, q[9] = B;
    else B = q[9];
    let S;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) S = sM.default.createElement(V, null, "Only accept if you trust your organization's IT administration and expect these settings to be configured."), q[10] = S;
    else S = q[10];
    let m;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) m = [{
        label: "Yes, I trust these settings",
        value: "accept"
    }, {
        label: "No, exit Claude Code",
        value: "exit"
    }], q[11] = m;
    else m = q[11];
    let b;
    if (q[12] !== J) b = sM.default.createElement(kA, {
        options: m,
        onChange: (p) => J(p),
        onCancel: () => J("exit")
    }), q[12] = J, q[13] = b;
    else b = q[13];
    let g;
    if (q[14] !== $.keyName || q[15] !== $.pending) g = sM.default.createElement(V, {
        dimColor: !0
    }, $.pending ? sM.default.createElement(sM.default.Fragment, null, "Press ", $.keyName, " again to exit") : sM.default.createElement(sM.default.Fragment, null, "Enter to confirm · Esc to exit")), q[14] = $.keyName, q[15] = $.pending, q[16] = g;
    else g = q[16];
    let U;
    if (q[17] !== P || q[18] !== B || q[19] !== b || q[20] !== g || q[21] !== Z) U = sM.default.createElement(P, {
        flexDirection: W,
        gap: G,
        paddingTop: f
    }, Z, B, S, b, g), q[17] = P, q[18] = B, q[19] = b, q[20] = g, q[21] = Z, q[22] = U;
    else U = q[22];
    let x;
    if (q[23] !== X || q[24] !== U) x = sM.default.createElement(X, {
        color: D,
        titleColor: j,
        title: M
    }, U), q[23] = X, q[24] = U, q[25] = x;
    else x = q[25];
    return x
}
// @from(Ln 273385, Col 0)
function k6Y(A, q) {
    return sM.default.createElement(I, {
        key: q,
        paddingLeft: 2
    }, sM.default.createElement(V, null, sM.default.createElement(V, {
        dimColor: !0
    }, "· "), sM.default.createElement(V, null, A)))
}
// @from(Ln 273393, Col 4)
sM
// @from(Ln 273394, Col 4)
H_4 = v(() => {
    i1();
    m1();
    wY();
    Bv();
    R2();
    K7();
    PGA();
    sM = o(X1(), 1)
})
// @from(Ln 273411, Col 0)
function y6Y() {
    if (Ad !== null) return Ad;
    if (process.stdin.isTTY) {
        Ad = void 0;
        return
    }
    if (J6(!1)) {
        Ad = void 0;
        return
    }
    if (process.argv.includes("mcp")) {
        Ad = void 0;
        return
    }
    if (process.platform === "win32") {
        Ad = void 0;
        return
    }
    try {
        let A = L6Y("/dev/tty", "r"),
            q = new R6Y(A);
        return q.isTTY = !0, Ad = q, Ad
    } catch (A) {
        K1(A), Ad = void 0;
        return
    }
}
// @from(Ln 273439, Col 0)
function js(A = !1) {
    let q = y6Y(),
        K = {
            exitOnCtrlC: A
        };
    if (q) K.stdin = q;
    return K
}
// @from(Ln 273447, Col 4)
Ad = null
// @from(Ln 273448, Col 4)
Hm1 = v(() => {
    hA();
    y6()
})
// @from(Ln 273453, Col 0)
function S6Y(A, q) {
    let K = e(9),
        {
            addNotification: Y,
            removeNotification: z
        } = iq(),
        w;
    if (K[0] !== Y || K[1] !== z || K[2] !== A) w = () => {
        if (A.length === 0) {
            z("keybinding-config-warning");
            return
        }
        let $ = A.filter(I6Y).length,
            O = A.filter(h6Y).length,
            _;
        if ($ > 0 && O > 0) _ = `Found ${$} keybinding error${$>1?"s":""} and ${O} warning${O>1?"s":""}`;
        else if ($ > 0) _ = `Found ${$} keybinding error${$>1?"s":""}`;
        else _ = `Found ${O} keybinding warning${O>1?"s":""}`;
        _ = _ + " · /doctor for details", Y({
            key: "keybinding-config-warning",
            text: _,
            color: $ > 0 ? "error" : "warning",
            priority: $ > 0 ? "immediate" : "high",
            timeoutMs: 60000
        })
    }, K[0] = Y, K[1] = z, K[2] = A, K[3] = w;
    else w = K[3];
    let H;
    if (K[4] !== Y || K[5] !== q || K[6] !== z || K[7] !== A) H = [A, q, Y, z], K[4] = Y, K[5] = q, K[6] = z, K[7] = A, K[8] = H;
    else H = K[8];
    pX.useEffect(w, H)
}
// @from(Ln 273486, Col 0)
function h6Y(A) {
    return A.severity === "warning"
}
// @from(Ln 273490, Col 0)
function I6Y(A) {
    return A.severity === "error"
}
// @from(Ln 273494, Col 0)
function dX({
    children: A
}) {
    let [{
        bindings: q,
        warnings: K
    }, Y] = pX.useState(() => {
        let W = YS1();
        return h(`[keybindings] KeybindingSetup initialized with ${W.bindings.length} bindings, ${W.warnings.length} warnings`), W
    }), [z, w] = pX.useState(!1);
    S6Y(K, z);
    let H = pX.useRef(null),
        [$, O] = pX.useState(null),
        _ = pX.useRef(null),
        J = pX.useRef(new Map),
        X = pX.useRef(new Set),
        D = pX.useCallback((W) => {
            X.current.add(W)
        }, []),
        j = pX.useCallback((W) => {
            X.current.delete(W)
        }, []),
        M = pX.useCallback(() => {
            if (_.current) clearTimeout(_.current), _.current = null
        }, []),
        P = pX.useCallback((W) => {
            if (M(), W !== null) _.current = setTimeout(() => {
                h("[keybindings] Chord timeout - cancelling"), H.current = null, O(null)
            }, C6Y);
            H.current = W, O(W)
        }, [M]);
    return pX.useEffect(() => {
        Lq7();
        let W = Rq7((G) => {
            w(!0), Y(G), h(`[keybindings] Reloaded: ${G.bindings.length} bindings, ${G.warnings.length} warnings`)
        });
        return () => {
            W(), M()
        }
    }, [M]), pX.default.createElement(A36, {
        bindings: q,
        pendingChordRef: H,
        pendingChord: $,
        setPendingChord: P,
        activeContexts: X.current,
        registerActiveContext: D,
        unregisterActiveContext: j,
        handlerRegistryRef: J
    }, pX.default.createElement(x6Y, {
        bindings: q,
        pendingChordRef: H,
        setPendingChord: P,
        activeContexts: X.current,
        handlerRegistryRef: J
    }), A)
}
// @from(Ln 273551, Col 0)
function x6Y(A) {
    let q = e(6),
        {
            bindings: K,
            pendingChordRef: Y,
            setPendingChord: z,
            activeContexts: w,
            handlerRegistryRef: H
        } = A,
        $;
    if (q[0] !== w || q[1] !== K || q[2] !== H || q[3] !== Y || q[4] !== z) $ = (_, J, X) => {
        let D = H.current,
            j = new Set;
        if (D)
            for (let G of D.values())
                for (let f of G) j.add(f.context);
        let M = [...j, ...w, "Global"],
            P = Y.current !== null,
            W = tK6(_, J, M, K, Y.current);
        A: switch (W.type) {
            case "chord_started": {
                z(W.pending), X.stopImmediatePropagation();
                break A
            }
            case "match": {
                if (z(null), P) {
                    let G = new Set(M);
                    if (D) {
                        let f = D.get(W.action);
                        if (f && f.size > 0) {
                            for (let Z of f)
                                if (G.has(Z.context)) {
                                    Z.handler(), X.stopImmediatePropagation();
                                    break
                                }
                        }
                    }
                }
                break A
            }
            case "chord_cancelled": {
                z(null);
                break A
            }
            case "unbound": {
                z(null);
                break A
            }
            case "none":
        }
    }, q[0] = w, q[1] = K, q[2] = H, q[3] = Y, q[4] = z, q[5] = $;
    else $ = q[5];
    return D8($), null
}
// @from(Ln 273605, Col 4)
pX
// @from(Ln 273605, Col 8)
C6Y = 1000
// @from(Ln 273606, Col 4)
qd = v(() => {
    i1();
    m1();
    eg();
    AU();
    Z6();
    h2();
    eK6();
    pX = o(X1(), 1)
})
// @from(Ln 273616, Col 0)
async function $_4(A, q) {
    if (!q || !iX6(EM1(q))) return "no_check_needed";
    if (!Y_4(A, q)) return "no_check_needed";
    if (!wQ()) return "no_check_needed";
    return c("tengu_managed_settings_security_dialog_shown", {}), new Promise((K) => {
        (async () => {
            let {
                unmount: Y
            } = await _Z(nX6.default.createElement(u_, null, nX6.default.createElement(dX, null, nX6.default.createElement(w_4, {
                settings: q,
                onAccept: () => {
                    c("tengu_managed_settings_security_dialog_accepted", {}), Y(), K("approved")
                },
                onReject: () => {
                    c("tengu_managed_settings_security_dialog_rejected", {}), Y(), K("rejected")
                }
            }))), js(!1))
        })()
    })
}
// @from(Ln 273637, Col 0)
function O_4(A) {
    if (A === "rejected") return w3(1), !1;
    return !0
}
// @from(Ln 273641, Col 4)
nX6
// @from(Ln 273642, Col 4)
__4 = v(() => {
    m1();
    H_4();
    d8();
    B6();
    u6();
    w$();
    PGA();
    Hm1();
    qd();
    nX6 = o(X1(), 1)
})
// @from(Ln 273662, Col 0)
function D_4() {
    if (D31) return;
    if (ob()) D31 = new Promise((A) => {
        Kd = A, setTimeout(() => {
            if (Kd) h("Remote settings: Loading promise timed out, resolving anyway"), Kd(), Kd = null
        }, m6Y)
    })
}
// @from(Ln 273671, Col 0)
function F6Y() {
    return `${P4().BASE_API_URL}/api/claude_code/settings`
}
// @from(Ln 273675, Col 0)
function GGA(A) {
    if (Array.isArray(A)) return A.map(GGA);
    if (A !== null && typeof A === "object") {
        let q = {};
        for (let K of Object.keys(A).sort()) q[K] = GGA(A[K]);
        return q
    }
    return A
}
// @from(Ln 273685, Col 0)
function Q6Y(A) {
    let q = GGA(A),
        K = Q1(q);
    return `sha256:${b6Y("sha256").update(K).digest("hex")}`
}
// @from(Ln 273691, Col 0)
function ZGA() {
    return ob()
}
// @from(Ln 273694, Col 0)
async function j_4() {
    if (D31) await D31
}
// @from(Ln 273698, Col 0)
function g6Y() {
    try {
        let {
            key: q
        } = yO({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return {
            headers: {
                "x-api-key": q
            }
        }
    } catch {}
    let A = a4();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": uf
        }
    };
    return {
        headers: {},
        error: "No authentication available"
    }
}
// @from(Ln 273723, Col 0)
async function U6Y(A) {
    let q = null;
    for (let K = 1; K <= WGA + 1; K++) {
        if (q = await p6Y(A), q.success) return q;
        if (q.skipRetry) return q;
        if (K > WGA) return q;
        let Y = cU(K);
        h(`Remote settings: Retry ${K}/${WGA} after ${Y}ms`), await dS(Y)
    }
    return q
}
// @from(Ln 273734, Col 0)
async function p6Y(A) {
    try {
        await XM();
        let q = g6Y();
        if (q.error) return {
            success: !1,
            error: "Authentication required for remote settings",
            skipRetry: !0
        };
        let K = F6Y(),
            Y = {
                ...q.headers,
                "User-Agent": XH()
            };
        if (A) Y["If-None-Match"] = `"${A}"`;
        let z = await sA.get(K, {
            headers: Y,
            timeout: u6Y,
            validateStatus: ($) => $ === 200 || $ === 304 || $ === 404
        });
        if (z.status === 304) return h("Remote settings: Using cached settings (304)"), {
            success: !0,
            settings: null,
            checksum: A
        };
        if (z.status === 404) return h("Remote settings: No settings found (404)"), {
            success: !0,
            settings: {},
            checksum: void 0
        };
        let w = aO4.safeParse(z.data);
        if (!w.success) return h(`Remote settings: Invalid response format - ${w.error.message}`), {
            success: !1,
            error: "Invalid remote settings format"
        };
        let H = Dk.safeParse(w.data.settings);
        if (!H.success) return h(`Remote settings: Settings validation failed - ${H.error.message}`), {
            success: !1,
            error: "Invalid settings structure"
        };
        return h("Remote settings: Fetched successfully"), {
            success: !0,
            settings: H.data,
            checksum: w.data.checksum
        }
    } catch (q) {
        if (sA.isAxiosError(q)) {
            let K = q;
            if (K.response?.status === 404) return {
                success: !0,
                settings: {},
                checksum: ""
            };
            if (K.response?.status === 401 || K.response?.status === 403) return {
                success: !1,
                error: "Not authorized for remote settings",
                skipRetry: !0
            };
            if (K.code === "ECONNABORTED") return {
                success: !1,
                error: "Remote settings request timeout"
            };
            if (K.code === "ECONNREFUSED" || K.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server"
            }
        }
        return {
            success: !1,
            error: q instanceof Error ? q.message : "Unknown error"
        }
    }
}
// @from(Ln 273808, Col 0)
function d6Y(A) {
    try {
        let q = MR1();
        ek(q, Q1(A, null, 2), {
            encoding: "utf-8",
            mode: 384
        }), h(`Remote settings: Saved to ${q}`)
    } catch (q) {
        h(`Remote settings: Failed to save - ${q instanceof Error?q.message:"unknown error"}`)
    }
}
// @from(Ln 273820, Col 0)
function fGA() {
    P_4(), Hi8(), D31 = null, Kd = null;
    try {
        let A = MR1();
        if (J_4(A)) X_4(A)
    } catch {}
}
// @from(Ln 273827, Col 0)
async function VGA() {
    if (!ob()) return null;
    let A = I1A(),
        q = A ? Q6Y(A) : void 0;
    try {
        let K = await U6Y(q);
        if (!K.success) {
            if (A) return h("Remote settings: Using stale cache after fetch failure"), LO1(A), A;
            return null
        }
        if (K.settings === null && A) return h("Remote settings: Cache still valid (304 Not Modified)"), LO1(A), A;
        let Y = K.settings || {};
        if (Object.keys(Y).length > 0) {
            let w = await $_4(A, Y);
            if (!O_4(w)) return h("Remote settings: User rejected new settings, using cached settings"), A;
            return LO1(Y), d6Y(Y), h("Remote settings: Applied new settings successfully"), Y
        }
        LO1(Y);
        try {
            let w = MR1();
            if (J_4(w)) X_4(w), h("Remote settings: Deleted cached file (404 response)")
        } catch (w) {
            h(`Remote settings: Failed to delete cached file - ${w instanceof Error?w.message:"unknown error"}`)
        }
        return Y
    } catch {
        if (A) return h("Remote settings: Using stale cache after error"), LO1(A), A;
        return null
    }
}
// @from(Ln 273857, Col 0)
async function M_4() {
    if (ob() && !D31) D31 = new Promise((A) => {
        Kd = A
    });
    try {
        let A = await VGA();
        if (ob()) l6Y();
        if (A !== null) GO(), zX.notifyChange("policySettings")
    } finally {
        if (Kd) Kd(), Kd = null
    }
}
// @from(Ln 273869, Col 0)
async function rX6() {
    if (fGA(), !ob()) {
        GO(), zX.notifyChange("policySettings");
        return
    }
    await VGA(), h("Remote settings: Refreshed after auth change"), GO(), zX.notifyChange("policySettings")
}
// @from(Ln 273876, Col 0)
async function c6Y() {
    if (!ob()) return;
    let A = h1A(),
        q = A ? Q1(A) : null;
    try {
        await VGA();
        let K = h1A();
        if ((K ? Q1(K) : null) !== q) h("Remote settings: Changed during background poll"), GO(), zX.notifyChange("policySettings")
    } catch {}
}
// @from(Ln 273887, Col 0)
function l6Y() {
    if ($m1 !== null) return;
    if (!ob()) return;
    $m1 = setInterval(() => {
        c6Y()
    }, B6Y), Tq(async () => P_4())
}
// @from(Ln 273895, Col 0)
function P_4() {
    if ($m1 !== null) clearInterval($m1), $m1 = null
}
// @from(Ln 273898, Col 4)
u6Y = 1e4
// @from(Ln 273899, Col 4)
WGA = 5
// @from(Ln 273900, Col 4)
B6Y = 3600000
// @from(Ln 273901, Col 4)
$m1 = null
// @from(Ln 273902, Col 4)
D31 = null
// @from(Ln 273903, Col 4)
Kd = null
// @from(Ln 273904, Col 4)
m6Y = 30000
// @from(Ln 273905, Col 4)
Om1 = v(() => {
    y5();
    B0();
    Z6();
    Uz();
    J7();
    hQ();
    sO4();
    wq();
    Yq1();
    QU();
    IQ();
    Tz();
    __4();
    m6();
    x1A()
})
// @from(Ln 273922, Col 4)
oX6 = R((W_4) => {
    Object.defineProperty(W_4, "__esModule", {
        value: !0
    });
    W_4.AggregationTemporality = void 0;
    var i6Y;
    (function(A) {
        A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE"
    })(i6Y = W_4.AggregationTemporality || (W_4.AggregationTemporality = {}))
})
// @from(Ln 273932, Col 4)
Ms = R((Z_4) => {
    Object.defineProperty(Z_4, "__esModule", {
        value: !0
    });
    Z_4.DataPointType = Z_4.InstrumentType = void 0;
    var n6Y;
    (function(A) {
        A.COUNTER = "COUNTER", A.GAUGE = "GAUGE", A.HISTOGRAM = "HISTOGRAM", A.UP_DOWN_COUNTER = "UP_DOWN_COUNTER", A.OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER", A.OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE", A.OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER"
    })(n6Y = Z_4.InstrumentType || (Z_4.InstrumentType = {}));
    var r6Y;
    (function(A) {
        A[A.HISTOGRAM = 0] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 1] = "EXPONENTIAL_HISTOGRAM", A[A.GAUGE = 2] = "GAUGE", A[A.SUM = 3] = "SUM"
    })(r6Y = Z_4.DataPointType || (Z_4.DataPointType = {}))
})
// @from(Ln 273946, Col 4)
Uh = R((f_4) => {
    Object.defineProperty(f_4, "__esModule", {
        value: !0
    });
    f_4.equalsCaseInsensitive = f_4.binarySearchUB = f_4.setEquals = f_4.FlatMap = f_4.isPromiseAllSettledRejectionResult = f_4.PromiseAllSettled = f_4.callWithTimeout = f_4.TimeoutError = f_4.instrumentationScopeId = f_4.hashAttributes = f_4.isNotNullish = void 0;

    function o6Y(A) {
        return A !== void 0 && A !== null
    }
    f_4.isNotNullish = o6Y;

    function a6Y(A) {
        let q = Object.keys(A);
        if (q.length === 0) return "";
        return q = q.sort(), JSON.stringify(q.map((K) => [K, A[K]]))
    }
    f_4.hashAttributes = a6Y;

    function s6Y(A) {
        return `${A.name}:${A.version??""}:${A.schemaUrl??""}`
    }
    f_4.instrumentationScopeId = s6Y;
    class aX6 extends Error {
        constructor(A) {
            super(A);
            Object.setPrototypeOf(this, aX6.prototype)
        }
    }
    f_4.TimeoutError = aX6;

    function t6Y(A, q) {
        let K, Y = new Promise(function(w, H) {
            K = setTimeout(function() {
                H(new aX6("Operation timed out."))
            }, q)
        });
        return Promise.race([A, Y]).then((z) => {
            return clearTimeout(K), z
        }, (z) => {
            throw clearTimeout(K), z
        })
    }
    f_4.callWithTimeout = t6Y;
    async function e6Y(A) {
        return Promise.all(A.map(async (q) => {
            try {
                return {
                    status: "fulfilled",
                    value: await q
                }
            } catch (K) {
                return {
                    status: "rejected",
                    reason: K
                }
            }
        }))
    }
    f_4.PromiseAllSettled = e6Y;

    function AAY(A) {
        return A.status === "rejected"
    }
    f_4.isPromiseAllSettledRejectionResult = AAY;

    function qAY(A, q) {
        let K = [];
        return A.forEach((Y) => {
            K.push(...q(Y))
        }), K
    }
    f_4.FlatMap = qAY;

    function KAY(A, q) {
        if (A.size !== q.size) return !1;
        for (let K of A)
            if (!q.has(K)) return !1;
        return !0
    }
    f_4.setEquals = KAY;

    function YAY(A, q) {
        let K = 0,
            Y = A.length - 1,
            z = A.length;
        while (Y >= K) {
            let w = K + Math.trunc((Y - K) / 2);
            if (A[w] < q) K = w + 1;
            else z = w, Y = w - 1
        }
        return z
    }
    f_4.binarySearchUB = YAY;

    function zAY(A, q) {
        return A.toLowerCase() === q.toLowerCase()
    }
    f_4.equalsCaseInsensitive = zAY
})
// @from(Ln 274045, Col 4)
kM1 = R((N_4) => {
    Object.defineProperty(N_4, "__esModule", {
        value: !0
    });
    N_4.AggregatorKind = void 0;
    var PAY;
    (function(A) {
        A[A.DROP = 0] = "DROP", A[A.SUM = 1] = "SUM", A[A.LAST_VALUE = 2] = "LAST_VALUE", A[A.HISTOGRAM = 3] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 4] = "EXPONENTIAL_HISTOGRAM"
    })(PAY = N_4.AggregatorKind || (N_4.AggregatorKind = {}))
})
// @from(Ln 274055, Col 4)
k_4 = R((v_4) => {
    Object.defineProperty(v_4, "__esModule", {
        value: !0
    });
    v_4.DropAggregator = void 0;
    var WAY = kM1();
    class T_4 {
        kind = WAY.AggregatorKind.DROP;
        createAccumulation() {
            return
        }
        merge(A, q) {
            return
        }
        diff(A, q) {
            return
        }
        toMetricData(A, q, K, Y) {
            return
        }
    }
    v_4.DropAggregator = T_4
})
// @from(Ln 274078, Col 4)
C_4 = R((R_4) => {
    Object.defineProperty(R_4, "__esModule", {
        value: !0
    });
    R_4.HistogramAggregator = R_4.HistogramAccumulation = void 0;
    var GAY = kM1(),
        _m1 = Ms(),
        ZAY = Uh();

    function fAY(A) {
        let q = A.map(() => 0);
        return q.push(0), {
            buckets: {
                boundaries: A,
                counts: q
            },
            sum: 0,
            count: 0,
            hasMinMax: !1,
            min: 1 / 0,
            max: -1 / 0
        }
    }
    class Jm1 {
        startTime;
        _boundaries;
        _recordMinMax;
        _current;
        constructor(A, q, K = !0, Y = fAY(q)) {
            this.startTime = A, this._boundaries = q, this._recordMinMax = K, this._current = Y
        }
        record(A) {
            if (Number.isNaN(A)) return;
            if (this._current.count += 1, this._current.sum += A, this._recordMinMax) this._current.min = Math.min(A, this._current.min), this._current.max = Math.max(A, this._current.max), this._current.hasMinMax = !0;
            let q = (0, ZAY.binarySearchUB)(this._boundaries, A);
            this._current.buckets.counts[q] += 1
        }
        setStartTime(A) {
            this.startTime = A
        }
        toPointValue() {
            return this._current
        }
    }
    R_4.HistogramAccumulation = Jm1;
    class L_4 {
        _boundaries;
        _recordMinMax;
        kind = GAY.AggregatorKind.HISTOGRAM;
        constructor(A, q) {
            this._boundaries = A, this._recordMinMax = q
        }
        createAccumulation(A) {
            return new Jm1(A, this._boundaries, this._recordMinMax)
        }
        merge(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue(),
                z = K.buckets.counts,
                w = Y.buckets.counts,
                H = Array(z.length);
            for (let _ = 0; _ < z.length; _++) H[_] = z[_] + w[_];
            let $ = 1 / 0,
                O = -1 / 0;
            if (this._recordMinMax) {
                if (K.hasMinMax && Y.hasMinMax) $ = Math.min(K.min, Y.min), O = Math.max(K.max, Y.max);
                else if (K.hasMinMax) $ = K.min, O = K.max;
                else if (Y.hasMinMax) $ = Y.min, O = Y.max
            }
            return new Jm1(A.startTime, K.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: K.buckets.boundaries,
                    counts: H
                },
                count: K.count + Y.count,
                sum: K.sum + Y.sum,
                hasMinMax: this._recordMinMax && (K.hasMinMax || Y.hasMinMax),
                min: $,
                max: O
            })
        }
        diff(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue(),
                z = K.buckets.counts,
                w = Y.buckets.counts,
                H = Array(z.length);
            for (let $ = 0; $ < z.length; $++) H[$] = w[$] - z[$];
            return new Jm1(q.startTime, K.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: K.buckets.boundaries,
                    counts: H
                },
                count: Y.count - K.count,
                sum: Y.sum - K.sum,
                hasMinMax: !1,
                min: 1 / 0,
                max: -1 / 0
            })
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: _m1.DataPointType.HISTOGRAM,
                dataPoints: K.map(([z, w]) => {
                    let H = w.toPointValue(),
                        $ = A.type === _m1.InstrumentType.GAUGE || A.type === _m1.InstrumentType.UP_DOWN_COUNTER || A.type === _m1.InstrumentType.OBSERVABLE_GAUGE || A.type === _m1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: z,
                        startTime: w.startTime,
                        endTime: Y,
                        value: {
                            min: H.hasMinMax ? H.min : void 0,
                            max: H.hasMinMax ? H.max : void 0,
                            sum: !$ ? H.sum : void 0,
                            buckets: H.buckets,
                            count: H.count
                        }
                    }
                })
            }
        }
    }
    R_4.HistogramAggregator = L_4
})
// @from(Ln 274204, Col 4)
I_4 = R((S_4) => {
    Object.defineProperty(S_4, "__esModule", {
        value: !0
    });
    S_4.Buckets = void 0;
    class EGA {
        backing;
        indexBase;
        indexStart;
        indexEnd;
        constructor(A = new kGA, q = 0, K = 0, Y = 0) {
            this.backing = A, this.indexBase = q, this.indexStart = K, this.indexEnd = Y
        }
        get offset() {
            return this.indexStart
        }
        get length() {
            if (this.backing.length === 0) return 0;
            if (this.indexEnd === this.indexStart && this.at(0) === 0) return 0;
            return this.indexEnd - this.indexStart + 1
        }
        counts() {
            return Array.from({
                length: this.length
            }, (A, q) => this.at(q))
        }
        at(A) {
            let q = this.indexBase - this.indexStart;
            if (A < q) A += this.backing.length;
            return A -= q, this.backing.countAt(A)
        }
        incrementBucket(A, q) {
            this.backing.increment(A, q)
        }
        decrementBucket(A, q) {
            this.backing.decrement(A, q)
        }
        trim() {
            for (let A = 0; A < this.length; A++)
                if (this.at(A) !== 0) {
                    this.indexStart += A;
                    break
                } else if (A === this.length - 1) {
                this.indexStart = this.indexEnd = this.indexBase = 0;
                return
            }
            for (let A = this.length - 1; A >= 0; A--)
                if (this.at(A) !== 0) {
                    this.indexEnd -= this.length - A - 1;
                    break
                } this._rotate()
        }
        downscale(A) {
            this._rotate();
            let q = 1 + this.indexEnd - this.indexStart,
                K = 1 << A,
                Y = 0,
                z = 0;
            for (let w = this.indexStart; w <= this.indexEnd;) {
                let H = w % K;
                if (H < 0) H += K;
                for (let $ = H; $ < K && Y < q; $++) this._relocateBucket(z, Y), Y++, w++;
                z++
            }
            this.indexStart >>= A, this.indexEnd >>= A, this.indexBase = this.indexStart
        }
        clone() {
            return new EGA(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd)
        }
        _rotate() {
            let A = this.indexBase - this.indexStart;
            if (A === 0) return;
            else if (A > 0) this.backing.reverse(0, this.backing.length), this.backing.reverse(0, A), this.backing.reverse(A, this.backing.length);
            else this.backing.reverse(0, this.backing.length), this.backing.reverse(0, this.backing.length + A);
            this.indexBase = this.indexStart
        }
        _relocateBucket(A, q) {
            if (A === q) return;
            this.incrementBucket(A, this.backing.emptyBucket(q))
        }
    }
    S_4.Buckets = EGA;
    class kGA {
        _counts;
        constructor(A = [0]) {
            this._counts = A
        }
        get length() {
            return this._counts.length
        }
        countAt(A) {
            return this._counts[A]
        }
        growTo(A, q, K) {
            let Y = Array(A).fill(0);
            Y.splice(K, this._counts.length - q, ...this._counts.slice(q)), Y.splice(0, q, ...this._counts.slice(0, q)), this._counts = Y
        }
        reverse(A, q) {
            let K = Math.floor((A + q) / 2) - A;
            for (let Y = 0; Y < K; Y++) {
                let z = this._counts[A + Y];
                this._counts[A + Y] = this._counts[q - Y - 1], this._counts[q - Y - 1] = z
            }
        }
        emptyBucket(A) {
            let q = this._counts[A];
            return this._counts[A] = 0, q
        }
        increment(A, q) {
            this._counts[A] += q
        }
        decrement(A, q) {
            if (this._counts[A] >= q) this._counts[A] -= q;
            else this._counts[A] = 0
        }
        clone() {
            return new kGA([...this._counts])
        }
    }
})
// @from(Ln 274324, Col 4)
RGA = R((x_4) => {
    Object.defineProperty(x_4, "__esModule", {
        value: !0
    });
    x_4.getSignificand = x_4.getNormalBase2 = x_4.MIN_VALUE = x_4.MAX_NORMAL_EXPONENT = x_4.MIN_NORMAL_EXPONENT = x_4.SIGNIFICAND_WIDTH = void 0;
    x_4.SIGNIFICAND_WIDTH = 52;
    var NAY = 2146435072,
        TAY = 1048575,
        LGA = 1023;
    x_4.MIN_NORMAL_EXPONENT = -LGA + 1;
    x_4.MAX_NORMAL_EXPONENT = LGA;
    x_4.MIN_VALUE = Math.pow(2, -1022);

    function vAY(A) {
        let q = new DataView(new ArrayBuffer(8));
        return q.setFloat64(0, A), ((q.getUint32(0) & NAY) >> 20) - LGA
    }
    x_4.getNormalBase2 = vAY;

    function EAY(A) {
        let q = new DataView(new ArrayBuffer(8));
        q.setFloat64(0, A);
        let K = q.getUint32(0),
            Y = q.getUint32(4);
        return (K & TAY) * Math.pow(2, 32) + Y
    }
    x_4.getSignificand = EAY
})
// @from(Ln 274352, Col 4)
sX6 = R((u_4) => {
    Object.defineProperty(u_4, "__esModule", {
        value: !0
    });
    u_4.nextGreaterSquare = u_4.ldexp = void 0;

    function SAY(A, q) {
        if (A === 0 || A === Number.POSITIVE_INFINITY || A === Number.NEGATIVE_INFINITY || Number.isNaN(A)) return A;
        return A * Math.pow(2, q)
    }
    u_4.ldexp = SAY;

    function hAY(A) {
        return A--, A |= A >> 1, A |= A >> 2, A |= A >> 4, A |= A >> 8, A |= A >> 16, A++, A
    }
    u_4.nextGreaterSquare = hAY
})
// @from(Ln 274369, Col 4)
tX6 = R((F_4) => {
    Object.defineProperty(F_4, "__esModule", {
        value: !0
    });
    F_4.MappingError = void 0;
    class m_4 extends Error {}
    F_4.MappingError = m_4
})
// @from(Ln 274377, Col 4)
c_4 = R((p_4) => {
    Object.defineProperty(p_4, "__esModule", {
        value: !0
    });
    p_4.ExponentMapping = void 0;
    var LM1 = RGA(),
        xAY = sX6(),
        g_4 = tX6();
    class U_4 {
        _shift;
        constructor(A) {
            this._shift = -A
        }
        mapToIndex(A) {
            if (A < LM1.MIN_VALUE) return this._minNormalLowerBoundaryIndex();
            let q = LM1.getNormalBase2(A),
                K = this._rightShift(LM1.getSignificand(A) - 1, LM1.SIGNIFICAND_WIDTH);
            return q + K >> this._shift
        }
        lowerBoundary(A) {
            let q = this._minNormalLowerBoundaryIndex();
            if (A < q) throw new g_4.MappingError(`underflow: ${A} is < minimum lower boundary: ${q}`);
            let K = this._maxNormalLowerBoundaryIndex();
            if (A > K) throw new g_4.MappingError(`overflow: ${A} is > maximum lower boundary: ${K}`);
            return xAY.ldexp(1, A << this._shift)
        }
        get scale() {
            if (this._shift === 0) return 0;
            return -this._shift
        }
        _minNormalLowerBoundaryIndex() {
            let A = LM1.MIN_NORMAL_EXPONENT >> this._shift;
            if (this._shift < 2) A--;
            return A
        }
        _maxNormalLowerBoundaryIndex() {
            return LM1.MAX_NORMAL_EXPONENT >> this._shift
        }
        _rightShift(A, q) {
            return Math.floor(A * Math.pow(2, -q))
        }
    }
    p_4.ExponentMapping = U_4
})
// @from(Ln 274421, Col 4)
a_4 = R((r_4) => {
    Object.defineProperty(r_4, "__esModule", {
        value: !0
    });
    r_4.LogarithmMapping = void 0;
    var RM1 = RGA(),
        l_4 = sX6(),
        i_4 = tX6();
    class n_4 {
        _scale;
        _scaleFactor;
        _inverseFactor;
        constructor(A) {
            this._scale = A, this._scaleFactor = l_4.ldexp(Math.LOG2E, A), this._inverseFactor = l_4.ldexp(Math.LN2, -A)
        }
        mapToIndex(A) {
            if (A <= RM1.MIN_VALUE) return this._minNormalLowerBoundaryIndex() - 1;
            if (RM1.getSignificand(A) === 0) return (RM1.getNormalBase2(A) << this._scale) - 1;
            let q = Math.floor(Math.log(A) * this._scaleFactor),
                K = this._maxNormalLowerBoundaryIndex();
            if (q >= K) return K;
            return q
        }
        lowerBoundary(A) {
            let q = this._maxNormalLowerBoundaryIndex();
            if (A >= q) {
                if (A === q) return 2 * Math.exp((A - (1 << this._scale)) / this._scaleFactor);
                throw new i_4.MappingError(`overflow: ${A} is > maximum lower boundary: ${q}`)
            }
            let K = this._minNormalLowerBoundaryIndex();
            if (A <= K) {
                if (A === K) return RM1.MIN_VALUE;
                else if (A === K - 1) return Math.exp((A + (1 << this._scale)) / this._scaleFactor) / 2;
                throw new i_4.MappingError(`overflow: ${A} is < minimum lower boundary: ${K}`)
            }
            return Math.exp(A * this._inverseFactor)
        }
        get scale() {
            return this._scale
        }
        _minNormalLowerBoundaryIndex() {
            return RM1.MIN_NORMAL_EXPONENT << this._scale
        }
        _maxNormalLowerBoundaryIndex() {
            return (RM1.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1
        }
    }
    r_4.LogarithmMapping = n_4
})
// @from(Ln 274470, Col 4)
qJ4 = R((e_4) => {
    Object.defineProperty(e_4, "__esModule", {
        value: !0
    });
    e_4.getMapping = void 0;
    var bAY = c_4(),
        uAY = a_4(),
        BAY = tX6(),
        s_4 = -10,
        t_4 = 20,
        mAY = Array.from({
            length: 31
        }, (A, q) => {
            if (q > 10) return new uAY.LogarithmMapping(q - 10);
            return new bAY.ExponentMapping(q - 10)
        });

    function FAY(A) {
        if (A > t_4 || A < s_4) throw new BAY.MappingError(`expected scale >= ${s_4} && <= ${t_4}, got: ${A}`);
        return mAY[A + 10]
    }
    e_4.getMapping = FAY
})
// @from(Ln 274493, Col 4)
$J4 = R((wJ4) => {
    Object.defineProperty(wJ4, "__esModule", {
        value: !0
    });
    wJ4.ExponentialHistogramAggregator = wJ4.ExponentialHistogramAccumulation = void 0;
    var QAY = kM1(),
        Xm1 = Ms(),
        gAY = Fq(),
        KJ4 = I_4(),
        YJ4 = qJ4(),
        UAY = sX6();
    class yM1 {
        low;
        high;
        static combine(A, q) {
            return new yM1(Math.min(A.low, q.low), Math.max(A.high, q.high))
        }
        constructor(A, q) {
            this.low = A, this.high = q
        }
    }
    var pAY = 20,
        dAY = 160,
        yGA = 2;
    class eX6 {
        startTime;
        _maxSize;
        _recordMinMax;
        _sum;
        _count;
        _zeroCount;
        _min;
        _max;
        _positive;
        _negative;
        _mapping;
        constructor(A, q = dAY, K = !0, Y = 0, z = 0, w = 0, H = Number.POSITIVE_INFINITY, $ = Number.NEGATIVE_INFINITY, O = new KJ4.Buckets, _ = new KJ4.Buckets, J = (0, YJ4.getMapping)(pAY)) {
            if (this.startTime = A, this._maxSize = q, this._recordMinMax = K, this._sum = Y, this._count = z, this._zeroCount = w, this._min = H, this._max = $, this._positive = O, this._negative = _, this._mapping = J, this._maxSize < yGA) gAY.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize},                 changing to the minimum size of: ${yGA}`), this._maxSize = yGA
        }
        record(A) {
            this.updateByIncrement(A, 1)
        }
        setStartTime(A) {
            this.startTime = A
        }
        toPointValue() {
            return {
                hasMinMax: this._recordMinMax,
                min: this.min,
                max: this.max,
                sum: this.sum,
                positive: {
                    offset: this.positive.offset,
                    bucketCounts: this.positive.counts()
                },
                negative: {
                    offset: this.negative.offset,
                    bucketCounts: this.negative.counts()
                },
                count: this.count,
                scale: this.scale,
                zeroCount: this.zeroCount
            }
        }
        get sum() {
            return this._sum
        }
        get min() {
            return this._min
        }
        get max() {
            return this._max
        }
        get count() {
            return this._count
        }
        get zeroCount() {
            return this._zeroCount
        }
        get scale() {
            if (this._count === this._zeroCount) return 0;
            return this._mapping.scale
        }
        get positive() {
            return this._positive
        }
        get negative() {
            return this._negative
        }
        updateByIncrement(A, q) {
            if (Number.isNaN(A)) return;
            if (A > this._max) this._max = A;
            if (A < this._min) this._min = A;
            if (this._count += q, A === 0) {
                this._zeroCount += q;
                return
            }
            if (this._sum += A * q, A > 0) this._updateBuckets(this._positive, A, q);
            else this._updateBuckets(this._negative, -A, q)
        }
        merge(A) {
            if (this._count === 0) this._min = A.min, this._max = A.max;
            else if (A.count !== 0) {
                if (A.min < this.min) this._min = A.min;
                if (A.max > this.max) this._max = A.max
            }
            this.startTime = A.startTime, this._sum += A.sum, this._count += A.count, this._zeroCount += A.zeroCount;
            let q = this._minScale(A);
            this._downscale(this.scale - q), this._mergeBuckets(this.positive, A, A.positive, q), this._mergeBuckets(this.negative, A, A.negative, q)
        }
        diff(A) {
            this._min = 1 / 0, this._max = -1 / 0, this._sum -= A.sum, this._count -= A.count, this._zeroCount -= A.zeroCount;
            let q = this._minScale(A);
            this._downscale(this.scale - q), this._diffBuckets(this.positive, A, A.positive, q), this._diffBuckets(this.negative, A, A.negative, q)
        }
        clone() {
            return new eX6(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping)
        }
        _updateBuckets(A, q, K) {
            let Y = this._mapping.mapToIndex(q),
                z = !1,
                w = 0,
                H = 0;
            if (A.length === 0) A.indexStart = Y, A.indexEnd = A.indexStart, A.indexBase = A.indexStart;
            else if (Y < A.indexStart && A.indexEnd - Y >= this._maxSize) z = !0, H = Y, w = A.indexEnd;
            else if (Y > A.indexEnd && Y - A.indexStart >= this._maxSize) z = !0, H = A.indexStart, w = Y;
            if (z) {
                let $ = this._changeScale(w, H);
                this._downscale($), Y = this._mapping.mapToIndex(q)
            }
            this._incrementIndexBy(A, Y, K)
        }
        _incrementIndexBy(A, q, K) {
            if (K === 0) return;
            if (A.length === 0) A.indexStart = A.indexEnd = A.indexBase = q;
            if (q < A.indexStart) {
                let z = A.indexEnd - q;
                if (z >= A.backing.length) this._grow(A, z + 1);
                A.indexStart = q
            } else if (q > A.indexEnd) {
                let z = q - A.indexStart;
                if (z >= A.backing.length) this._grow(A, z + 1);
                A.indexEnd = q
            }
            let Y = q - A.indexBase;
            if (Y < 0) Y += A.backing.length;
            A.incrementBucket(Y, K)
        }
        _grow(A, q) {
            let K = A.backing.length,
                Y = A.indexBase - A.indexStart,
                z = K - Y,
                w = (0, UAY.nextGreaterSquare)(q);
            if (w > this._maxSize) w = this._maxSize;
            let H = w - Y;
            A.backing.growTo(w, z, H)
        }
        _changeScale(A, q) {
            let K = 0;
            while (A - q >= this._maxSize) A >>= 1, q >>= 1, K++;
            return K
        }
        _downscale(A) {
            if (A === 0) return;
            if (A < 0) throw Error(`impossible change of scale: ${this.scale}`);
            let q = this._mapping.scale - A;
            this._positive.downscale(A), this._negative.downscale(A), this._mapping = (0, YJ4.getMapping)(q)
        }
        _minScale(A) {
            let q = Math.min(this.scale, A.scale),
                K = yM1.combine(this._highLowAtScale(this.positive, this.scale, q), this._highLowAtScale(A.positive, A.scale, q)),
                Y = yM1.combine(this._highLowAtScale(this.negative, this.scale, q), this._highLowAtScale(A.negative, A.scale, q));
            return Math.min(q - this._changeScale(K.high, K.low), q - this._changeScale(Y.high, Y.low))
        }
        _highLowAtScale(A, q, K) {
            if (A.length === 0) return new yM1(0, -1);
            let Y = q - K;
            return new yM1(A.indexStart >> Y, A.indexEnd >> Y)
        }
        _mergeBuckets(A, q, K, Y) {
            let z = K.offset,
                w = q.scale - Y;
            for (let H = 0; H < K.length; H++) this._incrementIndexBy(A, z + H >> w, K.at(H))
        }
        _diffBuckets(A, q, K, Y) {
            let z = K.offset,
                w = q.scale - Y;
            for (let H = 0; H < K.length; H++) {
                let O = (z + H >> w) - A.indexBase;
                if (O < 0) O += A.backing.length;
                A.decrementBucket(O, K.at(H))
            }
            A.trim()
        }
    }
    wJ4.ExponentialHistogramAccumulation = eX6;
    class zJ4 {
        _maxSize;
        _recordMinMax;
        kind = QAY.AggregatorKind.EXPONENTIAL_HISTOGRAM;
        constructor(A, q) {
            this._maxSize = A, this._recordMinMax = q
        }
        createAccumulation(A) {
            return new eX6(A, this._maxSize, this._recordMinMax)
        }
        merge(A, q) {
            let K = q.clone();
            return K.merge(A), K
        }
        diff(A, q) {
            let K = q.clone();
            return K.diff(A), K
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: Xm1.DataPointType.EXPONENTIAL_HISTOGRAM,
                dataPoints: K.map(([z, w]) => {
                    let H = w.toPointValue(),
                        $ = A.type === Xm1.InstrumentType.GAUGE || A.type === Xm1.InstrumentType.UP_DOWN_COUNTER || A.type === Xm1.InstrumentType.OBSERVABLE_GAUGE || A.type === Xm1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: z,
                        startTime: w.startTime,
                        endTime: Y,
                        value: {
                            min: H.hasMinMax ? H.min : void 0,
                            max: H.hasMinMax ? H.max : void 0,
                            sum: !$ ? H.sum : void 0,
                            positive: {
                                offset: H.positive.offset,
                                bucketCounts: H.positive.bucketCounts
                            },
                            negative: {
                                offset: H.negative.offset,
                                bucketCounts: H.negative.bucketCounts
                            },
                            count: H.count,
                            scale: H.scale,
                            zeroCount: H.zeroCount
                        }
                    }
                })
            }
        }
    }
    wJ4.ExponentialHistogramAggregator = zJ4
})
// @from(Ln 274742, Col 4)
XJ4 = R((_J4) => {
    Object.defineProperty(_J4, "__esModule", {
        value: !0
    });
    _J4.LastValueAggregator = _J4.LastValueAccumulation = void 0;
    var lAY = kM1(),
        Dm1 = G9(),
        iAY = Ms();
    class jm1 {
        startTime;
        _current;
        sampleTime;
        constructor(A, q = 0, K = [0, 0]) {
            this.startTime = A, this._current = q, this.sampleTime = K
        }
        record(A) {
            this._current = A, this.sampleTime = (0, Dm1.millisToHrTime)(Date.now())
        }
        setStartTime(A) {
            this.startTime = A
        }
        toPointValue() {
            return this._current
        }
    }
    _J4.LastValueAccumulation = jm1;
    class OJ4 {
        kind = lAY.AggregatorKind.LAST_VALUE;
        createAccumulation(A) {
            return new jm1(A)
        }
        merge(A, q) {
            let K = (0, Dm1.hrTimeToMicroseconds)(q.sampleTime) >= (0, Dm1.hrTimeToMicroseconds)(A.sampleTime) ? q : A;
            return new jm1(A.startTime, K.toPointValue(), K.sampleTime)
        }
        diff(A, q) {
            let K = (0, Dm1.hrTimeToMicroseconds)(q.sampleTime) >= (0, Dm1.hrTimeToMicroseconds)(A.sampleTime) ? q : A;
            return new jm1(q.startTime, K.toPointValue(), K.sampleTime)
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: iAY.DataPointType.GAUGE,
                dataPoints: K.map(([z, w]) => {
                    return {
                        attributes: z,
                        startTime: w.startTime,
                        endTime: Y,
                        value: w.toPointValue()
                    }
                })
            }
        }
    }
    _J4.LastValueAggregator = OJ4
})
// @from(Ln 274799, Col 4)
PJ4 = R((jJ4) => {
    Object.defineProperty(jJ4, "__esModule", {
        value: !0
    });
    jJ4.SumAggregator = jJ4.SumAccumulation = void 0;
    var rAY = kM1(),
        oAY = Ms();
    class j31 {
        startTime;
        monotonic;
        _current;
        reset;
        constructor(A, q, K = 0, Y = !1) {
            this.startTime = A, this.monotonic = q, this._current = K, this.reset = Y
        }
        record(A) {
            if (this.monotonic && A < 0) return;
            this._current += A
        }
        setStartTime(A) {
            this.startTime = A
        }
        toPointValue() {
            return this._current
        }
    }
    jJ4.SumAccumulation = j31;
    class DJ4 {
        monotonic;
        kind = rAY.AggregatorKind.SUM;
        constructor(A) {
            this.monotonic = A
        }
        createAccumulation(A) {
            return new j31(A, this.monotonic)
        }
        merge(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue();
            if (q.reset) return new j31(q.startTime, this.monotonic, Y, q.reset);
            return new j31(A.startTime, this.monotonic, K + Y)
        }
        diff(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue();
            if (this.monotonic && K > Y) return new j31(q.startTime, this.monotonic, Y, !0);
            return new j31(q.startTime, this.monotonic, Y - K)
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: oAY.DataPointType.SUM,
                dataPoints: K.map(([z, w]) => {
                    return {
                        attributes: z,
                        startTime: w.startTime,
                        endTime: Y,
                        value: w.toPointValue()
                    }
                }),
                isMonotonic: this.monotonic
            }
        }
    }
    jJ4.SumAggregator = DJ4
})
// @from(Ln 274866, Col 4)
VJ4 = R((ph) => {
    Object.defineProperty(ph, "__esModule", {
        value: !0
    });
    ph.SumAggregator = ph.SumAccumulation = ph.LastValueAggregator = ph.LastValueAccumulation = ph.ExponentialHistogramAggregator = ph.ExponentialHistogramAccumulation = ph.HistogramAggregator = ph.HistogramAccumulation = ph.DropAggregator = void 0;
    var sAY = k_4();
    Object.defineProperty(ph, "DropAggregator", {
        enumerable: !0,
        get: function() {
            return sAY.DropAggregator
        }
    });
    var WJ4 = C_4();
    Object.defineProperty(ph, "HistogramAccumulation", {
        enumerable: !0,
        get: function() {
            return WJ4.HistogramAccumulation
        }
    });
    Object.defineProperty(ph, "HistogramAggregator", {
        enumerable: !0,
        get: function() {
            return WJ4.HistogramAggregator
        }
    });
    var GJ4 = $J4();
    Object.defineProperty(ph, "ExponentialHistogramAccumulation", {
        enumerable: !0,
        get: function() {
            return GJ4.ExponentialHistogramAccumulation
        }
    });
    Object.defineProperty(ph, "ExponentialHistogramAggregator", {
        enumerable: !0,
        get: function() {
            return GJ4.ExponentialHistogramAggregator
        }
    });
    var ZJ4 = XJ4();
    Object.defineProperty(ph, "LastValueAccumulation", {
        enumerable: !0,
        get: function() {
            return ZJ4.LastValueAccumulation
        }
    });
    Object.defineProperty(ph, "LastValueAggregator", {
        enumerable: !0,
        get: function() {
            return ZJ4.LastValueAggregator
        }
    });
    var fJ4 = PJ4();
    Object.defineProperty(ph, "SumAccumulation", {
        enumerable: !0,
        get: function() {
            return fJ4.SumAccumulation
        }
    });
    Object.defineProperty(ph, "SumAggregator", {
        enumerable: !0,
        get: function() {
            return fJ4.SumAggregator
        }
    })
})
// @from(Ln 274931, Col 4)
RJ4 = R((NJ4) => {
    Object.defineProperty(NJ4, "__esModule", {
        value: !0
    });
    NJ4.DEFAULT_AGGREGATION = NJ4.EXPONENTIAL_HISTOGRAM_AGGREGATION = NJ4.HISTOGRAM_AGGREGATION = NJ4.LAST_VALUE_AGGREGATION = NJ4.SUM_AGGREGATION = NJ4.DROP_AGGREGATION = NJ4.DefaultAggregation = NJ4.ExponentialHistogramAggregation = NJ4.ExplicitBucketHistogramAggregation = NJ4.HistogramAggregation = NJ4.LastValueAggregation = NJ4.SumAggregation = NJ4.DropAggregation = void 0;
    var eAY = Fq(),
        M31 = VJ4(),
        tB = Ms();
    class AD6 {
        static DEFAULT_INSTANCE = new M31.DropAggregator;
        createAggregator(A) {
            return AD6.DEFAULT_INSTANCE
        }
    }
    NJ4.DropAggregation = AD6;
    class Mm1 {
        static MONOTONIC_INSTANCE = new M31.SumAggregator(!0);
        static NON_MONOTONIC_INSTANCE = new M31.SumAggregator(!1);
        createAggregator(A) {
            switch (A.type) {
                case tB.InstrumentType.COUNTER:
                case tB.InstrumentType.OBSERVABLE_COUNTER:
                case tB.InstrumentType.HISTOGRAM:
                    return Mm1.MONOTONIC_INSTANCE;
                default:
                    return Mm1.NON_MONOTONIC_INSTANCE
            }
        }
    }
    NJ4.SumAggregation = Mm1;
    class qD6 {
        static DEFAULT_INSTANCE = new M31.LastValueAggregator;
        createAggregator(A) {
            return qD6.DEFAULT_INSTANCE
        }
    }
    NJ4.LastValueAggregation = qD6;
    class KD6 {
        static DEFAULT_INSTANCE = new M31.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 1e4], !0);
        createAggregator(A) {
            return KD6.DEFAULT_INSTANCE
        }
    }
    NJ4.HistogramAggregation = KD6;
    class CGA {
        _recordMinMax;
        _boundaries;
        constructor(A, q = !0) {
            if (this._recordMinMax = q, A == null) throw Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
            A = A.concat(), A = A.sort((z, w) => z - w);
            let K = A.lastIndexOf(-1 / 0),
                Y = A.indexOf(1 / 0);
            if (Y === -1) Y = void 0;
            this._boundaries = A.slice(K + 1, Y)
        }
        createAggregator(A) {
            return new M31.HistogramAggregator(this._boundaries, this._recordMinMax)
        }
    }
    NJ4.ExplicitBucketHistogramAggregation = CGA;
    class SGA {
        _maxSize;
        _recordMinMax;
        constructor(A = 160, q = !0) {
            this._maxSize = A, this._recordMinMax = q
        }
        createAggregator(A) {
            return new M31.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax)
        }
    }
    NJ4.ExponentialHistogramAggregation = SGA;
    class hGA {
        _resolve(A) {
            switch (A.type) {
                case tB.InstrumentType.COUNTER:
                case tB.InstrumentType.UP_DOWN_COUNTER:
                case tB.InstrumentType.OBSERVABLE_COUNTER:
                case tB.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                    return NJ4.SUM_AGGREGATION;
                case tB.InstrumentType.GAUGE:
                case tB.InstrumentType.OBSERVABLE_GAUGE:
                    return NJ4.LAST_VALUE_AGGREGATION;
                case tB.InstrumentType.HISTOGRAM: {
                    if (A.advice.explicitBucketBoundaries) return new CGA(A.advice.explicitBucketBoundaries);
                    return NJ4.HISTOGRAM_AGGREGATION
                }
            }
            return eAY.diag.warn(`Unable to recognize instrument type: ${A.type}`), NJ4.DROP_AGGREGATION
        }
        createAggregator(A) {
            return this._resolve(A).createAggregator(A)
        }
    }
    NJ4.DefaultAggregation = hGA;
    NJ4.DROP_AGGREGATION = new AD6;
    NJ4.SUM_AGGREGATION = new Mm1;
    NJ4.LAST_VALUE_AGGREGATION = new qD6;
    NJ4.HISTOGRAM_AGGREGATION = new KD6;
    NJ4.EXPONENTIAL_HISTOGRAM_AGGREGATION = new SGA;
    NJ4.DEFAULT_AGGREGATION = new hGA
})
// @from(Ln 275032, Col 4)
Pm1 = R((CJ4) => {
    Object.defineProperty(CJ4, "__esModule", {
        value: !0
    });
    CJ4.toAggregation = CJ4.AggregationType = void 0;
    var P31 = RJ4(),
        W31;
    (function(A) {
        A[A.DEFAULT = 0] = "DEFAULT", A[A.DROP = 1] = "DROP", A[A.SUM = 2] = "SUM", A[A.LAST_VALUE = 3] = "LAST_VALUE", A[A.EXPLICIT_BUCKET_HISTOGRAM = 4] = "EXPLICIT_BUCKET_HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 5] = "EXPONENTIAL_HISTOGRAM"
    })(W31 = CJ4.AggregationType || (CJ4.AggregationType = {}));

    function O8Y(A) {
        switch (A.type) {
            case W31.DEFAULT:
                return P31.DEFAULT_AGGREGATION;
            case W31.DROP:
                return P31.DROP_AGGREGATION;
            case W31.SUM:
                return P31.SUM_AGGREGATION;
            case W31.LAST_VALUE:
                return P31.LAST_VALUE_AGGREGATION;
            case W31.EXPONENTIAL_HISTOGRAM: {
                let q = A;
                return new P31.ExponentialHistogramAggregation(q.options?.maxSize, q.options?.recordMinMax)
            }
            case W31.EXPLICIT_BUCKET_HISTOGRAM: {
                let q = A;
                if (q.options == null) return P31.HISTOGRAM_AGGREGATION;
                else return new P31.ExplicitBucketHistogramAggregation(q.options?.boundaries, q.options?.recordMinMax)
            }
            default:
                throw Error("Unsupported Aggregation")
        }
    }
    CJ4.toAggregation = O8Y
})
// @from(Ln 275068, Col 4)
IGA = R((hJ4) => {
    Object.defineProperty(hJ4, "__esModule", {
        value: !0
    });
    hJ4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = hJ4.DEFAULT_AGGREGATION_SELECTOR = void 0;
    var _8Y = oX6(),
        J8Y = Pm1(),
        X8Y = (A) => {
            return {
                type: J8Y.AggregationType.DEFAULT
            }
        };
    hJ4.DEFAULT_AGGREGATION_SELECTOR = X8Y;
    var D8Y = (A) => _8Y.AggregationTemporality.CUMULATIVE;
    hJ4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = D8Y
})
// @from(Ln 275084, Col 4)
xGA = R((BJ4) => {
    Object.defineProperty(BJ4, "__esModule", {
        value: !0
    });
    BJ4.MetricReader = void 0;
    var xJ4 = Fq(),
        YD6 = Uh(),
        bJ4 = IGA();
    class uJ4 {
        _shutdown = !1;
        _metricProducers;
        _sdkMetricProducer;
        _aggregationTemporalitySelector;
        _aggregationSelector;
        _cardinalitySelector;
        constructor(A) {
            this._aggregationSelector = A?.aggregationSelector ?? bJ4.DEFAULT_AGGREGATION_SELECTOR, this._aggregationTemporalitySelector = A?.aggregationTemporalitySelector ?? bJ4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR, this._metricProducers = A?.metricProducers ?? [], this._cardinalitySelector = A?.cardinalitySelector
        }
        setMetricProducer(A) {
            if (this._sdkMetricProducer) throw Error("MetricReader can not be bound to a MeterProvider again.");
            this._sdkMetricProducer = A, this.onInitialized()
        }
        selectAggregation(A) {
            return this._aggregationSelector(A)
        }
        selectAggregationTemporality(A) {
            return this._aggregationTemporalitySelector(A)
        }
        selectCardinalityLimit(A) {
            return this._cardinalitySelector ? this._cardinalitySelector(A) : 2000
        }
        onInitialized() {}
        async collect(A) {
            if (this._sdkMetricProducer === void 0) throw Error("MetricReader is not bound to a MetricProducer");
            if (this._shutdown) throw Error("MetricReader is shutdown");
            let [q, ...K] = await Promise.all([this._sdkMetricProducer.collect({
                timeoutMillis: A?.timeoutMillis
            }), ...this._metricProducers.map((H) => H.collect({
                timeoutMillis: A?.timeoutMillis
            }))]), Y = q.errors.concat((0, YD6.FlatMap)(K, (H) => H.errors)), z = q.resourceMetrics.resource, w = q.resourceMetrics.scopeMetrics.concat((0, YD6.FlatMap)(K, (H) => H.resourceMetrics.scopeMetrics));
            return {
                resourceMetrics: {
                    resource: z,
                    scopeMetrics: w
                },
                errors: Y
            }
        }
        async shutdown(A) {
            if (this._shutdown) {
                xJ4.diag.error("Cannot call shutdown twice.");
                return
            }
            if (A?.timeoutMillis == null) await this.onShutdown();
            else await (0, YD6.callWithTimeout)(this.onShutdown(), A.timeoutMillis);
            this._shutdown = !0
        }
        async forceFlush(A) {
            if (this._shutdown) {
                xJ4.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
                return
            }
            if (A?.timeoutMillis == null) {
                await this.onForceFlush();
                return
            }
            await (0, YD6.callWithTimeout)(this.onForceFlush(), A.timeoutMillis)
        }
    }
    BJ4.MetricReader = uJ4
})
// @from(Ln 275155, Col 4)
pJ4 = R((gJ4) => {
    Object.defineProperty(gJ4, "__esModule", {
        value: !0
    });
    gJ4.PeriodicExportingMetricReader = void 0;
    var bGA = Fq(),
        zD6 = G9(),
        M8Y = xGA(),
        FJ4 = Uh();
    class QJ4 extends M8Y.MetricReader {
        _interval;
        _exporter;
        _exportInterval;
        _exportTimeout;
        constructor(A) {
            super({
                aggregationSelector: A.exporter.selectAggregation?.bind(A.exporter),
                aggregationTemporalitySelector: A.exporter.selectAggregationTemporality?.bind(A.exporter),
                metricProducers: A.metricProducers
            });
            if (A.exportIntervalMillis !== void 0 && A.exportIntervalMillis <= 0) throw Error("exportIntervalMillis must be greater than 0");
            if (A.exportTimeoutMillis !== void 0 && A.exportTimeoutMillis <= 0) throw Error("exportTimeoutMillis must be greater than 0");
            if (A.exportTimeoutMillis !== void 0 && A.exportIntervalMillis !== void 0 && A.exportIntervalMillis < A.exportTimeoutMillis) throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
            this._exportInterval = A.exportIntervalMillis ?? 60000, this._exportTimeout = A.exportTimeoutMillis ?? 30000, this._exporter = A.exporter
        }
        async _runOnce() {
            try {
                await (0, FJ4.callWithTimeout)(this._doRun(), this._exportTimeout)
            } catch (A) {
                if (A instanceof FJ4.TimeoutError) {
                    bGA.diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
                    return
                }(0, zD6.globalErrorHandler)(A)
            }
        }
        async _doRun() {
            let {
                resourceMetrics: A,
                errors: q
            } = await this.collect({
                timeoutMillis: this._exportTimeout
            });
            if (q.length > 0) bGA.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...q);
            if (A.resource.asyncAttributesPending) try {
                await A.resource.waitForAsyncAttributes?.()
            } catch (Y) {
                bGA.diag.debug("Error while resolving async portion of resource: ", Y), (0, zD6.globalErrorHandler)(Y)
            }
            if (A.scopeMetrics.length === 0) return;
            let K = await zD6.internal._export(this._exporter, A);
            if (K.code !== zD6.ExportResultCode.SUCCESS) throw Error(`PeriodicExportingMetricReader: metrics export failed (error ${K.error})`)
        }
        onInitialized() {
            if (this._interval = setInterval(() => {
                    this._runOnce()
                }, this._exportInterval), typeof this._interval !== "number") this._interval.unref()
        }
        async onForceFlush() {
            await this._runOnce(), await this._exporter.forceFlush()
        }
        async onShutdown() {
            if (this._interval) clearInterval(this._interval);
            await this.onForceFlush(), await this._exporter.shutdown()
        }
    }
    gJ4.PeriodicExportingMetricReader = QJ4
})
// @from(Ln 275222, Col 4)
nJ4 = R((lJ4) => {
    Object.defineProperty(lJ4, "__esModule", {
        value: !0
    });
    lJ4.InMemoryMetricExporter = void 0;
    var dJ4 = G9();
    class cJ4 {
        _shutdown = !1;
        _aggregationTemporality;
        _metrics = [];
        constructor(A) {
            this._aggregationTemporality = A
        }
        export (A, q) {
            if (this._shutdown) {
                setTimeout(() => q({
                    code: dJ4.ExportResultCode.FAILED
                }), 0);
                return
            }
            this._metrics.push(A), setTimeout(() => q({
                code: dJ4.ExportResultCode.SUCCESS
            }), 0)
        }
        getMetrics() {
            return this._metrics
        }
        forceFlush() {
            return Promise.resolve()
        }
        reset() {
            this._metrics = []
        }
        selectAggregationTemporality(A) {
            return this._aggregationTemporality
        }
        shutdown() {
            return this._shutdown = !0, Promise.resolve()
        }
    }
    lJ4.InMemoryMetricExporter = cJ4
})
// @from(Ln 275264, Col 4)
sJ4 = R((oJ4) => {
    Object.defineProperty(oJ4, "__esModule", {
        value: !0
    });
    oJ4.ConsoleMetricExporter = void 0;
    var rJ4 = G9(),
        P8Y = IGA();
    class uGA {
        _shutdown = !1;
        _temporalitySelector;
        constructor(A) {
            this._temporalitySelector = A?.temporalitySelector ?? P8Y.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR
        }
        export (A, q) {
            if (this._shutdown) {
                setImmediate(q, {
                    code: rJ4.ExportResultCode.FAILED
                });
                return
            }
            return uGA._sendMetrics(A, q)
        }
        forceFlush() {
            return Promise.resolve()
        }
        selectAggregationTemporality(A) {
            return this._temporalitySelector(A)
        }
        shutdown() {
            return this._shutdown = !0, Promise.resolve()
        }
        static _sendMetrics(A, q) {
            for (let K of A.scopeMetrics)
                for (let Y of K.metrics) console.dir({
                    descriptor: Y.descriptor,
                    dataPointType: Y.dataPointType,
                    dataPoints: Y.dataPoints
                }, {
                    depth: null
                });
            q({
                code: rJ4.ExportResultCode.SUCCESS
            })
        }
    }
    oJ4.ConsoleMetricExporter = uGA
})
// @from(Ln 275311, Col 4)
qX4 = R((eJ4) => {
    Object.defineProperty(eJ4, "__esModule", {
        value: !0
    });
    eJ4.ViewRegistry = void 0;
    class tJ4 {
        _registeredViews = [];
        addView(A) {
            this._registeredViews.push(A)
        }
        findViews(A, q) {
            return this._registeredViews.filter((Y) => {
                return this._matchInstrument(Y.instrumentSelector, A) && this._matchMeter(Y.meterSelector, q)
            })
        }
        _matchInstrument(A, q) {
            return (A.getType() === void 0 || q.type === A.getType()) && A.getNameFilter().match(q.name) && A.getUnitFilter().match(q.unit)
        }
        _matchMeter(A, q) {
            return A.getNameFilter().match(q.name) && (q.version === void 0 || A.getVersionFilter().match(q.version)) && (q.schemaUrl === void 0 || A.getSchemaUrlFilter().match(q.schemaUrl))
        }
    }
    eJ4.ViewRegistry = tJ4
})
// @from(Ln 275335, Col 4)
Wm1 = R((zX4) => {
    Object.defineProperty(zX4, "__esModule", {
        value: !0
    });
    zX4.isValidName = zX4.isDescriptorCompatibleWith = zX4.createInstrumentDescriptorWithView = zX4.createInstrumentDescriptor = void 0;
    var KX4 = Fq(),
        W8Y = Uh();

    function G8Y(A, q, K) {
        if (!YX4(A)) KX4.diag.warn(`Invalid metric name: "${A}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
        return {
            name: A,
            type: q,
            description: K?.description ?? "",
            unit: K?.unit ?? "",
            valueType: K?.valueType ?? KX4.ValueType.DOUBLE,
            advice: K?.advice ?? {}
        }
    }
    zX4.createInstrumentDescriptor = G8Y;

    function Z8Y(A, q) {
        return {
            name: A.name ?? q.name,
            description: A.description ?? q.description,
            type: q.type,
            unit: q.unit,
            valueType: q.valueType,
            advice: q.advice
        }
    }
    zX4.createInstrumentDescriptorWithView = Z8Y;

    function f8Y(A, q) {
        return (0, W8Y.equalsCaseInsensitive)(A.name, q.name) && A.unit === q.unit && A.type === q.type && A.valueType === q.valueType
    }
    zX4.isDescriptorCompatibleWith = f8Y;
    var V8Y = /^[a-z][a-z0-9_.\-/]{0,254}$/i;

    function YX4(A) {
        return A.match(V8Y) != null
    }
    zX4.isValidName = YX4
})
// @from(Ln 275379, Col 4)
wD6 = R((jX4) => {
    Object.defineProperty(jX4, "__esModule", {
        value: !0
    });
    jX4.isObservableInstrument = jX4.ObservableUpDownCounterInstrument = jX4.ObservableGaugeInstrument = jX4.ObservableCounterInstrument = jX4.ObservableInstrument = jX4.HistogramInstrument = jX4.GaugeInstrument = jX4.CounterInstrument = jX4.UpDownCounterInstrument = jX4.SyncInstrument = void 0;
    var CM1 = Fq(),
        E8Y = G9();
    class SM1 {
        _writableMetricStorage;
        _descriptor;
        constructor(A, q) {
            this._writableMetricStorage = A, this._descriptor = q
        }
        _record(A, q = {}, K = CM1.context.active()) {
            if (typeof A !== "number") {
                CM1.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${A}`);
                return
            }
            if (this._descriptor.valueType === CM1.ValueType.INT && !Number.isInteger(A)) {
                if (CM1.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
            }
            this._writableMetricStorage.record(A, q, K, (0, E8Y.millisToHrTime)(Date.now()))
        }
    }
    jX4.SyncInstrument = SM1;
    class HX4 extends SM1 {
        add(A, q, K) {
            this._record(A, q, K)
        }
    }
    jX4.UpDownCounterInstrument = HX4;
    class $X4 extends SM1 {
        add(A, q, K) {
            if (A < 0) {
                CM1.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${A}`);
                return
            }
            this._record(A, q, K)
        }
    }
    jX4.CounterInstrument = $X4;
    class OX4 extends SM1 {
        record(A, q, K) {
            this._record(A, q, K)
        }
    }
    jX4.GaugeInstrument = OX4;
    class _X4 extends SM1 {
        record(A, q, K) {
            if (A < 0) {
                CM1.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${A}`);
                return
            }
            this._record(A, q, K)
        }
    }
    jX4.HistogramInstrument = _X4;
    class hM1 {
        _observableRegistry;
        _metricStorages;
        _descriptor;
        constructor(A, q, K) {
            this._observableRegistry = K, this._descriptor = A, this._metricStorages = q
        }
        addCallback(A) {
            this._observableRegistry.addCallback(A, this)
        }
        removeCallback(A) {
            this._observableRegistry.removeCallback(A, this)
        }
    }
    jX4.ObservableInstrument = hM1;
    class JX4 extends hM1 {}
    jX4.ObservableCounterInstrument = JX4;
    class XX4 extends hM1 {}
    jX4.ObservableGaugeInstrument = XX4;
    class DX4 extends hM1 {}
    jX4.ObservableUpDownCounterInstrument = DX4;

    function k8Y(A) {
        return A instanceof hM1
    }
    jX4.isObservableInstrument = k8Y
})
// @from(Ln 275463, Col 4)
ZX4 = R((WX4) => {
    Object.defineProperty(WX4, "__esModule", {
        value: !0
    });
    WX4.Meter = void 0;
    var G31 = Wm1(),
        Z31 = wD6(),
        f31 = Ms();
    class PX4 {
        _meterSharedState;
        constructor(A) {
            this._meterSharedState = A
        }
        createGauge(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.GAUGE, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new Z31.GaugeInstrument(Y, K)
        }
        createHistogram(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.HISTOGRAM, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new Z31.HistogramInstrument(Y, K)
        }
        createCounter(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.COUNTER, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new Z31.CounterInstrument(Y, K)
        }
        createUpDownCounter(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.UP_DOWN_COUNTER, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new Z31.UpDownCounterInstrument(Y, K)
        }
        createObservableGauge(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.OBSERVABLE_GAUGE, q),
                Y = this._meterSharedState.registerAsyncMetricStorage(K);
            return new Z31.ObservableGaugeInstrument(K, Y, this._meterSharedState.observableRegistry)
        }
        createObservableCounter(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.OBSERVABLE_COUNTER, q),
                Y = this._meterSharedState.registerAsyncMetricStorage(K);
            return new Z31.ObservableCounterInstrument(K, Y, this._meterSharedState.observableRegistry)
        }
        createObservableUpDownCounter(A, q) {
            let K = (0, G31.createInstrumentDescriptor)(A, f31.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, q),
                Y = this._meterSharedState.registerAsyncMetricStorage(K);
            return new Z31.ObservableUpDownCounterInstrument(K, Y, this._meterSharedState.observableRegistry)
        }
        addBatchObservableCallback(A, q) {
            this._meterSharedState.observableRegistry.addBatchCallback(A, q)
        }
        removeBatchObservableCallback(A, q) {
            this._meterSharedState.observableRegistry.removeBatchCallback(A, q)
        }
    }
    WX4.Meter = PX4
})