
// @from(Ln 242497, Col 0)
function hz4(A, q, K) {
    if (!a$()) return;
    if (q?.systemPrompt) {
        let Y = OF9(q.systemPrompt),
            z = q.systemPrompt.slice(0, 500);
        if (A.setAttribute("system_prompt_hash", Y), A.setAttribute("system_prompt_preview", z), A.setAttribute("system_prompt_length", q.systemPrompt.length), !xp6.has(Y)) {
            xp6.add(Y);
            let {
                content: _,
                truncated: w
            } = pB(q.systemPrompt);
            pw("system_prompt", {
                system_prompt_hash: Y,
                system_prompt: _,
                system_prompt_length: String(q.systemPrompt.length),
                ...w && {
                    system_prompt_truncated: "true"
                }
            })
        }
    }
    if (q?.tools) try {
        let z = i1(q.tools).map((_) => {
            let w = B6(_),
                O = _k8(w);
            return {
                name: typeof _.name === "string" ? _.name : "unknown",
                hash: O,
                json: w
            }
        });
        A.setAttribute("tools", B6(z.map(({
            name: _,
            hash: w
        }) => ({
            name: _,
            hash: w
        })))), A.setAttribute("tools_count", z.length);
        for (let {
                name: _,
                hash: w,
                json: O
            }
            of z)
            if (!xp6.has(`tool_${w}`)) {
                xp6.add(`tool_${w}`);
                let {
                    content: $,
                    truncated: H
                } = pB(O);
                pw("tool", {
                    tool_name: hq(_),
                    tool_hash: w,
                    tool: $,
                    ...H && {
                        tool_truncated: "true"
                    }
                })
            }
    } catch {
        A.setAttribute("tools_parse_error", !0)
    }
    if (K && K.length > 0 && q?.querySource) {
        let Y = q.querySource,
            z = zk8.get(Y),
            _ = 0;
        if (z)
            for (let O = 0; O < K.length; O++) {
                let $ = K[O];
                if ($ && yz4($) === z) {
                    _ = O + 1;
                    break
                }
            }
        let w = K.slice(_).filter((O) => O.type === "user");
        if (w.length > 0) {
            let {
                contextParts: O,
                systemReminders: $
            } = HF9(w);
            if (O.length > 0) {
                let j = O.join(`

---

`),
                    {
                        content: J,
                        truncated: M
                    } = pB(j);
                A.setAttributes({
                    new_context: J,
                    new_context_message_count: w.length,
                    ...M && {
                        new_context_truncated: !0,
                        new_context_original_length: j.length
                    }
                })
            }
            if ($.length > 0) {
                let j = $.join(`

---

`),
                    {
                        content: J,
                        truncated: M
                    } = pB(j);
                A.setAttributes({
                    system_reminders: J,
                    system_reminders_count: $.length,
                    ...M && {
                        system_reminders_truncated: !0,
                        system_reminders_original_length: j.length
                    }
                })
            }
            let H = K[K.length - 1];
            if (H) zk8.set(Y, yz4(H))
        }
    }
}
// @from(Ln 242621, Col 0)
function Sz4(A, q) {
    if (!a$() || !q) return;
    if (q.modelOutput !== void 0) {
        let {
            content: K,
            truncated: Y
        } = pB(q.modelOutput);
        if (A["response.model_output"] = K, Y) A["response.model_output_truncated"] = !0, A["response.model_output_original_length"] = q.modelOutput.length
    }
}
// @from(Ln 242632, Col 0)
function Cz4(A, q, K) {
    if (!a$()) return;
    let {
        content: Y,
        truncated: z
    } = pB(`[TOOL INPUT: ${q}]
${K}`);
    A.setAttributes({
        tool_input: Y,
        ...z && {
            tool_input_truncated: !0,
            tool_input_original_length: K.length
        }
    })
}
// @from(Ln 242648, Col 0)
function Iz4(A, q, K) {
    if (!a$()) return;
    let {
        content: Y,
        truncated: z
    } = pB(`[TOOL RESULT: ${q}]
${K}`);
    if (A.new_context = Y, z) A.new_context_truncated = !0, A.new_context_original_length = K.length
}
// @from(Ln 242657, Col 4)
xp6
// @from(Ln 242657, Col 9)
zk8
// @from(Ln 242657, Col 14)
wF9 = 61440
// @from(Ln 242658, Col 4)
$F9
// @from(Ln 242659, Col 4)
up6 = E(() => {
    A8();
    FB();
    o$();
    T1();
    HA();
    g1();
    xp6 = new Set, zk8 = new Map;
    $F9 = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/
})
// @from(Ln 242670, Col 0)
function xz4(A) {
    let q = 0;
    for (let K = 0; K < A.length; K++) {
        let Y = A.charCodeAt(K);
        q = (q << 5) - q + Y, q = q & q
    }
    return Math.abs(q) || 1
}
// @from(Ln 242679, Col 0)
function uz4(A) {
    let q = Ok8.get(A);
    if (q !== void 0) return q;
    return wk8++, Ok8.set(A, wk8), wk8
}
// @from(Ln 242685, Col 0)
function y01() {
    let A = nM() ?? R1(),
        q = i3() ?? "main",
        K = Zt(),
        Y = E01.get(A);
    if (Y) return Y;
    let z = {
        agentId: A,
        agentName: q,
        parentAgentId: K,
        processId: A === R1() ? 1 : uz4(A),
        threadId: xz4(q)
    };
    return E01.set(A, z), bz4++, z
}
// @from(Ln 242701, Col 0)
function tt() {
    return (Date.now() - jF9) * 1000
}
// @from(Ln 242705, Col 0)
function L01() {
    return `span_${++JF9}`
}
// @from(Ln 242709, Col 0)
function mz4() {
    let A = process.env.CLAUDE_CODE_PERFETTO_TRACE;
    k(`[Perfetto] initializePerfettoTracing called, env value: ${A}`)
}
// @from(Ln 242714, Col 0)
function MF9(A) {
    if (!LR) return;
    if (aM.push({
            name: "process_name",
            cat: "__metadata",
            ph: "M",
            ts: 0,
            pid: A.processId,
            tid: 0,
            args: {
                name: A.agentName
            }
        }), aM.push({
            name: "thread_name",
            cat: "__metadata",
            ph: "M",
            ts: 0,
            pid: A.processId,
            tid: A.threadId,
            args: {
                name: A.agentName
            }
        }), A.parentAgentId) aM.push({
        name: "parent_agent",
        cat: "__metadata",
        ph: "M",
        ts: 0,
        pid: A.processId,
        tid: 0,
        args: {
            parent_agent_id: A.parentAgentId
        }
    })
}
// @from(Ln 242749, Col 0)
function qc() {
    return LR
}
// @from(Ln 242753, Col 0)
function R01(A, q, K) {
    if (!LR) return;
    let Y = {
        agentId: A,
        agentName: q,
        parentAgentId: K,
        processId: uz4(A),
        threadId: xz4(q)
    };
    E01.set(A, Y), bz4++, MF9(Y)
}
// @from(Ln 242765, Col 0)
function a36(A) {
    if (!LR) return;
    E01.delete(A), Ok8.delete(A)
}
// @from(Ln 242770, Col 0)
function Bz4(A) {
    if (!LR) return "";
    let q = L01(),
        K = y01();
    return AM.set(q, {
        name: "API Call",
        category: "api",
        startTime: tt(),
        agentInfo: K,
        args: {
            model: A.model,
            prompt_tokens: A.promptTokens,
            message_id: A.messageId,
            is_speculative: A.isSpeculative ?? !1,
            query_source: A.querySource
        }
    }), aM.push({
        name: "API Call",
        cat: "api",
        ph: "B",
        ts: AM.get(q).startTime,
        pid: K.processId,
        tid: K.threadId,
        args: AM.get(q).args
    }), q
}
// @from(Ln 242797, Col 0)
function gz4(A, q) {
    if (!LR || !A) return;
    let K = AM.get(A);
    if (!K) return;
    let Y = tt(),
        z = Y - K.startTime,
        _ = q.promptTokens ?? K.args.prompt_tokens,
        w = q.ttftMs,
        O = q.ttltMs,
        $ = q.outputTokens,
        H = q.cacheReadTokens,
        j = w !== void 0 && _ !== void 0 && w > 0 ? Math.round(_ / (w / 1000) * 100) / 100 : void 0,
        J = O !== void 0 && w !== void 0 ? O - w : void 0,
        M = J !== void 0 && $ !== void 0 && J > 0 ? Math.round($ / (J / 1000) * 100) / 100 : void 0,
        D = H !== void 0 && _ !== void 0 && _ > 0 ? Math.round(H / _ * 1e4) / 100 : void 0,
        X = q.requestSetupMs,
        P = q.attemptStartTimes,
        W = {
            ...K.args,
            ttft_ms: w,
            ttlt_ms: O,
            prompt_tokens: _,
            output_tokens: $,
            cache_read_tokens: H,
            cache_creation_tokens: q.cacheCreationTokens,
            message_id: q.messageId ?? K.args.message_id,
            success: q.success ?? !0,
            error: q.error,
            duration_ms: z / 1000,
            request_setup_ms: X,
            itps: j,
            otps: M,
            cache_hit_rate_pct: D
        },
        Z = X !== void 0 && X > 0 ? X * 1000 : 0;
    if (Z > 0) {
        let G = K.startTime + Z;
        if (aM.push({
                name: "Request Setup",
                cat: "api,setup",
                ph: "B",
                ts: K.startTime,
                pid: K.agentInfo.processId,
                tid: K.agentInfo.threadId,
                args: {
                    request_setup_ms: X,
                    attempt_count: P?.length ?? 1
                }
            }), P && P.length > 1) {
            let f = P[0];
            for (let v = 0; v < P.length - 1; v++) {
                let N = K.startTime + (P[v] - f) * 1000,
                    V = K.startTime + (P[v + 1] - f) * 1000;
                aM.push({
                    name: `Attempt ${v+1} (retry)`,
                    cat: "api,retry",
                    ph: "B",
                    ts: N,
                    pid: K.agentInfo.processId,
                    tid: K.agentInfo.threadId,
                    args: {
                        attempt: v + 1
                    }
                }), aM.push({
                    name: `Attempt ${v+1} (retry)`,
                    cat: "api,retry",
                    ph: "E",
                    ts: V,
                    pid: K.agentInfo.processId,
                    tid: K.agentInfo.threadId
                })
            }
        }
        aM.push({
            name: "Request Setup",
            cat: "api,setup",
            ph: "E",
            ts: G,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId
        })
    }
    if (w !== void 0) {
        let G = K.startTime + Z,
            f = G + w * 1000;
        aM.push({
            name: "First Token",
            cat: "api,ttft",
            ph: "B",
            ts: G,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId,
            args: {
                ttft_ms: w,
                prompt_tokens: _,
                itps: j,
                cache_hit_rate_pct: D
            }
        }), aM.push({
            name: "First Token",
            cat: "api,ttft",
            ph: "E",
            ts: f,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId
        });
        let v = O !== void 0 ? O - w - Z / 1000 : void 0;
        if (v !== void 0 && v > 0) aM.push({
            name: "Sampling",
            cat: "api,sampling",
            ph: "B",
            ts: f,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId,
            args: {
                sampling_ms: v,
                output_tokens: $,
                otps: M
            }
        }), aM.push({
            name: "Sampling",
            cat: "api,sampling",
            ph: "E",
            ts: f + v * 1000,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId
        })
    }
    aM.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: Y,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: W
    }), AM.delete(A)
}
// @from(Ln 242936, Col 0)
function Fz4(A, q) {
    if (!LR) return "";
    let K = L01(),
        Y = y01();
    return AM.set(K, {
        name: `Tool: ${A}`,
        category: "tool",
        startTime: tt(),
        agentInfo: Y,
        args: {
            tool_name: A,
            ...q
        }
    }), aM.push({
        name: `Tool: ${A}`,
        cat: "tool",
        ph: "B",
        ts: AM.get(K).startTime,
        pid: Y.processId,
        tid: Y.threadId,
        args: AM.get(K).args
    }), K
}
// @from(Ln 242960, Col 0)
function pz4(A, q) {
    if (!LR || !A) return;
    let K = AM.get(A);
    if (!K) return;
    let Y = tt(),
        z = Y - K.startTime,
        _ = {
            ...K.args,
            success: q?.success ?? !0,
            error: q?.error,
            result_tokens: q?.resultTokens,
            duration_ms: z / 1000
        };
    aM.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: Y,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: _
    }), AM.delete(A)
}
// @from(Ln 242984, Col 0)
function Qz4(A) {
    if (!LR) return "";
    let q = L01(),
        K = y01();
    return AM.set(q, {
        name: "Waiting for User Input",
        category: "user_input",
        startTime: tt(),
        agentInfo: K,
        args: {
            context: A
        }
    }), aM.push({
        name: "Waiting for User Input",
        cat: "user_input",
        ph: "B",
        ts: AM.get(q).startTime,
        pid: K.processId,
        tid: K.threadId,
        args: AM.get(q).args
    }), q
}
// @from(Ln 243007, Col 0)
function Uz4(A, q) {
    if (!LR || !A) return;
    let K = AM.get(A);
    if (!K) return;
    let Y = tt(),
        z = Y - K.startTime,
        _ = {
            ...K.args,
            decision: q?.decision,
            source: q?.source,
            duration_ms: z / 1000
        };
    aM.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: Y,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: _
    }), AM.delete(A)
}
// @from(Ln 243030, Col 0)
function dz4(A) {
    if (!LR) return "";
    let q = L01(),
        K = y01();
    return AM.set(q, {
        name: "Interaction",
        category: "interaction",
        startTime: tt(),
        agentInfo: K,
        args: {
            user_prompt_length: A?.length
        }
    }), aM.push({
        name: "Interaction",
        cat: "interaction",
        ph: "B",
        ts: AM.get(q).startTime,
        pid: K.processId,
        tid: K.threadId,
        args: AM.get(q).args
    }), q
}
// @from(Ln 243053, Col 0)
function cz4(A) {
    if (!LR || !A) return;
    let q = AM.get(A);
    if (!q) return;
    let K = tt(),
        Y = K - q.startTime;
    aM.push({
        name: q.name,
        cat: q.category,
        ph: "E",
        ts: K,
        pid: q.agentInfo.processId,
        tid: q.agentInfo.threadId,
        args: {
            ...q.args,
            duration_ms: Y / 1000
        }
    }), AM.delete(A)
}
// @from(Ln 243072, Col 4)
LR = !1
// @from(Ln 243073, Col 4)
aM
// @from(Ln 243073, Col 8)
AM
// @from(Ln 243073, Col 12)
E01
// @from(Ln 243073, Col 17)
bz4 = 0
// @from(Ln 243074, Col 4)
jF9 = 0
// @from(Ln 243075, Col 4)
JF9 = 0
// @from(Ln 243076, Col 4)
wk8 = 1
// @from(Ln 243077, Col 4)
Ok8
// @from(Ln 243078, Col 4)
gW6 = E(() => {
    A8();
    T1();
    g1();
    zz();
    KY();
    H1();
    s8();
    aM = [], AM = new Map, E01 = new Map, Ok8 = new Map
})
// @from(Ln 243092, Col 0)
function pj(A) {
    return A.spanContext().spanId || ""
}
// @from(Ln 243096, Col 0)
function XF9() {
    if (iz4) return;
    iz4 = !0;
    let A = setInterval(() => {
        let q = Date.now() - DF9;
        for (let [K, Y] of W2) {
            let z = Y.deref();
            if (z === void 0) W2.delete(K), pv.delete(K);
            else if (z.startTime < q) {
                if (!z.ended) z.span.end();
                W2.delete(K), pv.delete(K)
            }
        }
    }, 60000);
    if (typeof A.unref === "function") A.unref()
}
// @from(Ln 243113, Col 0)
function $k8() {
    {
        let A = process.env.CLAUDE_CODE_ENHANCED_TELEMETRY_BETA ?? process.env.ENABLE_ENHANCED_TELEMETRY_BETA;
        if (t6(A)) return !0;
        if (xz(A)) return !1;
        return w8("enhanced_telemetry_beta", !1)
    }
    return !1
}
// @from(Ln 243123, Col 0)
function CI() {
    return $k8() || a$()
}
// @from(Ln 243127, Col 0)
function MZ() {
    return Z2.trace.getTracer("com.anthropic.claude_code.tracing", "1.0.0")
}
// @from(Ln 243131, Col 0)
function FW6(A, q = {}) {
    return {
        ...mW6(),
        "span.type": A,
        ...q
    }
}
// @from(Ln 243139, Col 0)
function rz4(A) {
    XF9();
    let q = qc() ? dz4(A) : void 0;
    if (!CI()) {
        if (q) {
            let H = Z2.trace.getActiveSpan() || MZ().startSpan("dummy"),
                j = pj(H),
                J = {
                    span: H,
                    startTime: Date.now(),
                    attributes: {},
                    perfettoSpanId: q
                };
            return W2.set(j, new WeakRef(J)), et.enterWith(J), H
        }
        return Z2.trace.getActiveSpan() || MZ().startSpan("dummy")
    }
    let K = MZ(),
        z = t6(process.env.OTEL_LOG_USER_PROMPTS) ? A : "<REDACTED>";
    lz4++;
    let _ = FW6("interaction", {
            user_prompt: z,
            user_prompt_length: A.length,
            "interaction.sequence": lz4
        }),
        w = K.startSpan("claude_code.interaction", {
            attributes: _
        });
    Rz4(w, A);
    let O = pj(w),
        $ = {
            span: w,
            startTime: Date.now(),
            attributes: _,
            perfettoSpanId: q
        };
    return W2.set(O, new WeakRef($)), et.enterWith($), w
}
// @from(Ln 243178, Col 0)
function mp6() {
    let A = et.getStore();
    if (!A) return;
    if (A.ended) return;
    if (A.perfettoSpanId) cz4(A.perfettoSpanId);
    if (!CI()) {
        A.ended = !0, W2.delete(pj(A.span)), et.enterWith(void 0);
        return
    }
    let q = Date.now() - A.startTime;
    A.span.setAttributes({
        "interaction.duration_ms": q
    }), A.span.end(), A.ended = !0, W2.delete(pj(A.span)), et.enterWith(void 0)
}
// @from(Ln 243193, Col 0)
function oz4(A, q, K, Y) {
    let z = qc() ? Bz4({
        model: A,
        querySource: q?.querySource,
        messageId: void 0
    }) : void 0;
    if (!CI()) {
        if (z) {
            let M = Z2.trace.getActiveSpan() || MZ().startSpan("dummy"),
                D = pj(M),
                X = {
                    span: M,
                    startTime: Date.now(),
                    attributes: {
                        model: A
                    },
                    perfettoSpanId: z
                };
            return W2.set(D, new WeakRef(X)), pv.set(D, X), M
        }
        return Z2.trace.getActiveSpan() || MZ().startSpan("dummy")
    }
    let _ = MZ(),
        w = et.getStore(),
        O = FW6("llm_request", {
            model: A,
            "llm_request.context": w ? "interaction" : "standalone",
            speed: Y ? "fast" : "normal"
        }),
        $ = w ? Z2.trace.setSpan(Z2.context.active(), w.span) : Z2.context.active(),
        H = _.startSpan("claude_code.llm_request", {
            attributes: O
        }, $);
    if (q?.querySource) H.setAttribute("query_source", q.querySource);
    hz4(H, q, K);
    let j = pj(H),
        J = {
            span: H,
            startTime: Date.now(),
            attributes: O,
            perfettoSpanId: z
        };
    return W2.set(j, new WeakRef(J)), pv.set(j, J), H
}
// @from(Ln 243238, Col 0)
function Hk8(A, q) {
    let K;
    if (A) {
        let w = pj(A);
        K = W2.get(w)?.deref()
    } else
        for (let [, w] of Array.from(W2.entries()).reverse()) {
            let O = w.deref();
            if (O === void 0) continue;
            if (O.attributes["span.type"] === "llm_request" || O.attributes.model) {
                K = O;
                break
            }
        }
    if (!K) return;
    let Y = Date.now() - K.startTime;
    if (K.perfettoSpanId) gz4(K.perfettoSpanId, {
        ttftMs: q?.ttftMs,
        ttltMs: Y,
        promptTokens: q?.inputTokens,
        outputTokens: q?.outputTokens,
        cacheReadTokens: q?.cacheReadTokens,
        cacheCreationTokens: q?.cacheCreationTokens,
        success: q?.success,
        error: q?.error,
        requestSetupMs: q?.requestSetupMs,
        attemptStartTimes: q?.attemptStartTimes
    });
    if (!CI()) {
        let w = pj(K.span);
        W2.delete(w), pv.delete(w);
        return
    }
    let z = {
        duration_ms: Y
    };
    if (q) {
        if (q.inputTokens !== void 0) z.input_tokens = q.inputTokens;
        if (q.outputTokens !== void 0) z.output_tokens = q.outputTokens;
        if (q.cacheReadTokens !== void 0) z.cache_read_tokens = q.cacheReadTokens;
        if (q.cacheCreationTokens !== void 0) z.cache_creation_tokens = q.cacheCreationTokens;
        if (q.success !== void 0) z.success = q.success;
        if (q.statusCode !== void 0) z.status_code = q.statusCode;
        if (q.error !== void 0) z.error = q.error;
        if (q.attempt !== void 0) z.attempt = q.attempt;
        if (q.hasToolCall !== void 0) z["response.has_tool_call"] = q.hasToolCall;
        if (q.ttftMs !== void 0) z.ttft_ms = q.ttftMs;
        Sz4(z, q)
    }
    K.span.setAttributes(z), K.span.end();
    let _ = pj(K.span);
    W2.delete(_), pv.delete(_)
}
// @from(Ln 243292, Col 0)
function az4(A, q, K) {
    let Y = qc() ? Fz4(A, q) : void 0;
    if (!CI()) {
        if (Y) {
            let J = Z2.trace.getActiveSpan() || MZ().startSpan("dummy"),
                M = pj(J),
                D = {
                    span: J,
                    startTime: Date.now(),
                    attributes: {
                        "span.type": "tool",
                        tool_name: A
                    },
                    perfettoSpanId: Y
                };
            return W2.set(M, new WeakRef(D)), Kc.enterWith(D), J
        }
        return Z2.trace.getActiveSpan() || MZ().startSpan("dummy")
    }
    let z = MZ(),
        _ = et.getStore(),
        w = FW6("tool", {
            tool_name: A,
            ...q
        }),
        O = _ ? Z2.trace.setSpan(Z2.context.active(), _.span) : Z2.context.active(),
        $ = z.startSpan("claude_code.tool", {
            attributes: w
        }, O);
    if (K) Cz4($, A, K);
    let H = pj($),
        j = {
            span: $,
            startTime: Date.now(),
            attributes: w,
            perfettoSpanId: Y
        };
    return W2.set(H, new WeakRef(j)), Kc.enterWith(j), $
}
// @from(Ln 243332, Col 0)
function sz4() {
    let A = qc() ? Qz4("tool_permission") : void 0;
    if (!CI()) {
        if (A) {
            let $ = Z2.trace.getActiveSpan() || MZ().startSpan("dummy"),
                H = pj($),
                j = {
                    span: $,
                    startTime: Date.now(),
                    attributes: {
                        "span.type": "tool.blocked_on_user"
                    },
                    perfettoSpanId: A
                };
            return W2.set(H, new WeakRef(j)), pv.set(H, j), $
        }
        return Z2.trace.getActiveSpan() || MZ().startSpan("dummy")
    }
    let q = MZ(),
        K = Kc.getStore(),
        Y = FW6("tool.blocked_on_user"),
        z = K ? Z2.trace.setSpan(Z2.context.active(), K.span) : Z2.context.active(),
        _ = q.startSpan("claude_code.tool.blocked_on_user", {
            attributes: Y
        }, z),
        w = pj(_),
        O = {
            span: _,
            startTime: Date.now(),
            attributes: Y,
            perfettoSpanId: A
        };
    return W2.set(w, new WeakRef(O)), pv.set(w, O), _
}
// @from(Ln 243367, Col 0)
function jk8(A, q) {
    let K;
    for (let [, w] of Array.from(W2.entries()).reverse()) {
        let O = w.deref();
        if (O === void 0) continue;
        if (O.attributes["span.type"] === "tool.blocked_on_user") {
            K = O;
            break
        }
    }
    if (!K) return;
    if (K.perfettoSpanId) Uz4(K.perfettoSpanId, {
        decision: A,
        source: q
    });
    if (!CI()) {
        let w = pj(K.span);
        W2.delete(w), pv.delete(w);
        return
    }
    let z = {
        duration_ms: Date.now() - K.startTime
    };
    if (A) z.decision = A;
    if (q) z.source = q;
    K.span.setAttributes(z), K.span.end();
    let _ = pj(K.span);
    W2.delete(_), pv.delete(_)
}
// @from(Ln 243397, Col 0)
function tz4() {
    if (!CI()) return Z2.trace.getActiveSpan() || MZ().startSpan("dummy");
    let A = MZ(),
        q = Kc.getStore(),
        K = FW6("tool.execution"),
        Y = q ? Z2.trace.setSpan(Z2.context.active(), q.span) : Z2.context.active(),
        z = A.startSpan("claude_code.tool.execution", {
            attributes: K
        }, Y),
        _ = pj(z),
        w = {
            span: z,
            startTime: Date.now(),
            attributes: K
        };
    return W2.set(_, new WeakRef(w)), pv.set(_, w), z
}
// @from(Ln 243415, Col 0)
function Jk8(A) {
    if (!CI()) return;
    let q;
    for (let [, _] of Array.from(W2.entries()).reverse()) {
        let w = _.deref();
        if (w === void 0) continue;
        if (w.attributes["span.type"] === "tool.execution") {
            q = w;
            break
        }
    }
    if (!q) return;
    let Y = {
        duration_ms: Date.now() - q.startTime
    };
    if (A) {
        if (A.success !== void 0) Y.success = A.success;
        if (A.error !== void 0) Y.error = A.error
    }
    q.span.setAttributes(Y), q.span.end();
    let z = pj(q.span);
    W2.delete(z), pv.delete(z)
}
// @from(Ln 243439, Col 0)
function h01(A, q) {
    let K = Kc.getStore();
    if (!K) return;
    if (K.perfettoSpanId) pz4(K.perfettoSpanId, {
        success: !0,
        resultTokens: q
    });
    if (!CI()) {
        let w = pj(K.span);
        W2.delete(w), Kc.enterWith(void 0);
        return
    }
    let z = {
        duration_ms: Date.now() - K.startTime
    };
    if (A) {
        let w = K.attributes.tool_name || "unknown";
        Iz4(z, w, A)
    }
    if (q !== void 0) z.result_tokens = q;
    K.span.setAttributes(z), K.span.end();
    let _ = pj(K.span);
    W2.delete(_), Kc.enterWith(void 0)
}
// @from(Ln 243464, Col 0)
function PF9() {
    return t6(process.env.OTEL_LOG_TOOL_CONTENT)
}
// @from(Ln 243468, Col 0)
function ez4(A, q) {
    if (!CI() || !PF9()) return;
    let K = Kc.getStore();
    if (!K) return;
    let Y = {};
    for (let [z, _] of Object.entries(q))
        if (typeof _ === "string") {
            let {
                content: w,
                truncated: O
            } = pB(_);
            if (Y[z] = w, O) Y[`${z}_truncated`] = !0, Y[`${z}_original_length`] = _.length
        } else Y[z] = _;
    K.span.addEvent(A, Y)
}
// @from(Ln 243484, Col 0)
function A_4(A, q, K, Y) {
    if (!a$()) return Z2.trace.getActiveSpan() || MZ().startSpan("dummy");
    let z = MZ(),
        _ = Kc.getStore() ?? et.getStore(),
        w = FW6("hook", {
            hook_event: A,
            hook_name: q,
            num_hooks: K,
            hook_definitions: Y
        }),
        O = _ ? Z2.trace.setSpan(Z2.context.active(), _.span) : Z2.context.active(),
        $ = z.startSpan("claude_code.hook", {
            attributes: w
        }, O),
        H = pj($),
        j = {
            span: $,
            startTime: Date.now(),
            attributes: w
        };
    return W2.set(H, new WeakRef(j)), pv.set(H, j), $
}
// @from(Ln 243507, Col 0)
function q_4(A, q) {
    if (!a$()) return;
    let K = pj(A),
        Y = W2.get(K)?.deref();
    if (!Y) return;
    let _ = {
        duration_ms: Date.now() - Y.startTime
    };
    if (q) {
        if (q.numSuccess !== void 0) _.num_success = q.numSuccess;
        if (q.numBlocking !== void 0) _.num_blocking = q.numBlocking;
        if (q.numNonBlockingError !== void 0) _.num_non_blocking_error = q.numNonBlockingError;
        if (q.numCancelled !== void 0) _.num_cancelled = q.numCancelled
    }
    Y.span.setAttributes(_), Y.span.end(), W2.delete(K), pv.delete(K)
}
// @from(Ln 243523, Col 4)
Z2
// @from(Ln 243523, Col 8)
et
// @from(Ln 243523, Col 12)
Kc
// @from(Ln 243523, Col 16)
W2
// @from(Ln 243523, Col 20)
pv
// @from(Ln 243523, Col 24)
lz4 = 0
// @from(Ln 243524, Col 4)
iz4 = !1
// @from(Ln 243525, Col 4)
DF9 = 1800000
// @from(Ln 243526, Col 4)
Ae = E(() => {
    HA();
    v01();
    A8();
    up6();
    gW6();
    Z2 = t(yq(), 1), et = new nz4, Kc = new nz4, W2 = new Map, pv = new Map
})
// @from(Ln 243535, Col 0)
function WF9(A) {
    let q = A.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
    if (q?.[1] && q?.[2]) return {
        prNumber: parseInt(q[2], 10),
        prUrl: A,
        prRepository: q[1]
    };
    return null
}
// @from(Ln 243545, Col 0)
function K_4(A) {
    return A.match(/\[[\w./-]+(?: \(root-commit\))? ([0-9a-f]+)\]/)?.[1]
}
// @from(Ln 243549, Col 0)
function Y_4(A, q, K) {
    if (q !== 0) return;
    if (A.match(/\bgit\s+commit\b/)) {
        if (d("tengu_git_operation", {
                operation: "commit"
            }), A.match(/--amend\b/)) d("tengu_git_operation", {
            operation: "commit_amend"
        });
        Wu1()?.add(1)
    }
    if (A.match(/\bgh\s+pr\s+create\b/)) {
        if (d("tengu_git_operation", {
                operation: "pr_create"
            }), mk6()?.add(1), K) {
            let w = K.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/);
            if (w) {
                let O = WF9(w[0]);
                if (O) Promise.resolve().then(() => (Oq(), YV8)).then(({
                    linkSessionToPR: $
                }) => {
                    Promise.resolve().then(() => (T1(), qm1)).then(({
                        getSessionId: H
                    }) => {
                        let j = H();
                        if (j) $(j, O.prNumber, O.prUrl, O.prRepository)
                    })
                })
            }
        }
    }
    if (A.match(/\bglab\s+mr\s+create\b/)) d("tengu_git_operation", {
        operation: "pr_create"
    }), mk6()?.add(1);
    let z = A.match(/\bcurl\b/) && (A.match(/-X\s*POST\b/i) || A.match(/--request\s*=?\s*POST\b/i) || A.match(/\s-d\s/)),
        _ = A.match(/https?:\/\/[^\s'"]*\/(pulls|pull-requests|merge[-_]requests)(?!\/\d)/i);
    if (z && _) d("tengu_git_operation", {
        operation: "pr_create"
    }), mk6()?.add(1)
}
// @from(Ln 243588, Col 4)
Mk8 = E(() => {
    V1();
    T1()
})
// @from(Ln 243592, Col 4)
z_4 = "PowerShell"
// @from(Ln 243597, Col 0)
function sH() {
    return !1
}
// @from(Ln 243601, Col 0)
function O_4(A) {
    return A.some((q) => {
        if (q.type !== "user") return !1;
        let K = q.message.content;
        if (!Array.isArray(K)) return !1;
        return K.some((Y) => Y.type === "text" && Y.text.includes(w_4))
    })
}
// @from(Ln 243610, Col 0)
function $_4(A, q) {
    let K = {
            ...q,
            uuid: ZF9(),
            message: {
                ...q.message,
                content: [...q.message.content]
            }
        },
        Y = q.message.content.filter((w) => w.type === "tool_use");
    if (Y.length === 0) return k(`No tool_use blocks found in assistant message for fork directive: ${A.slice(0,50)}...`, {
        level: "error"
    }), [p1({
        content: [{
            type: "text",
            text: __4(A)
        }]
    })];
    let z = Y.map((w) => ({
            type: "tool_result",
            tool_use_id: w.id,
            content: [{
                type: "text",
                text: fF9
            }]
        })),
        _ = p1({
            content: [...z, {
                type: "text",
                text: __4(A)
            }]
        });
    return [K, _]
}
// @from(Ln 243645, Col 0)
function __4(A) {
    return `STOP. READ THIS FIRST.

${w_4}. You are NOT the main agent.

RULES (non-negotiable):
1. Your system prompt says "default to forking." IGNORE IT — that's for the parent. You ARE the fork. Do NOT spawn sub-agents; execute directly.
2. Do NOT converse, ask questions, or suggest next steps
3. Do NOT editorialize or add meta-commentary
4. USE your tools directly: Bash, Read, Write, etc.
5. If you modify files, commit your changes before reporting. Include the commit hash in your report.
6. Do NOT emit text between tool calls. Use tools silently, then report once at the end.
7. Stay strictly within your directive's scope. If you discover related systems outside your scope, mention them in one sentence at most — other workers cover those areas.
8. Keep your report under 500 words unless the directive specifies otherwise. Be factual and concise.
9. Your response MUST begin with "Scope:". No preamble, no thinking-out-loud.
10. REPORT structured facts, then stop

Your directive: ${A}

Output format (plain text labels, not markdown headers):
  Scope: <echo back your assigned scope in one sentence>
  Result: <the answer or key findings, limited to the scope above>
  Key files: <relevant file paths — include for research tasks>
  Files changed: <list with commit hash — include only if you modified files>
  Issues: <list — include only if there are issues to flag>`
}
// @from(Ln 243672, Col 0)
function H_4(A, q) {
    return `You've inherited the conversation context above from a parent agent working in ${A}. You are operating in an isolated git worktree at ${q} — same repository, same relative file structure, separate working copy. Paths in the inherited context refer to the parent's working directory; translate them to your worktree root. Re-read files before editing if the parent may have modified them since they appear in the context. Your changes stay in this worktree and will not affect the parent's files.`
}
// @from(Ln 243675, Col 4)
GF9 = "fork"
// @from(Ln 243676, Col 4)
pW6
// @from(Ln 243676, Col 9)
w_4 = "You are a forked worker process"
// @from(Ln 243677, Col 4)
fF9 = "Fork started — processing in background"
// @from(Ln 243678, Col 4)
Yc = E(() => {
    HA();
    Fv();
    T1();
    JA();
    H1();
    pW6 = {
        agentType: GF9,
        whenToUse: "Implicit fork — inherits full conversation context. Not selectable via subagent_type; triggered by omitting subagent_type when the fork experiment is active.",
        tools: ["*"],
        maxTurns: 200,
        model: "inherit",
        permissionMode: "bubble",
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: () => ""
    }
})
// @from(Ln 243697, Col 0)
function TF9(A) {
    let {
        tools: q,
        disallowedTools: K
    } = A, Y = q && q.length > 0, z = K && K.length > 0;
    if (Y && z) {
        let _ = new Set(K),
            w = q.filter((O) => !_.has(O));
        if (w.length === 0) return "None";
        return w.join(", ")
    } else if (Y) return q.join(", ");
    else if (z) return `All tools except ${K.join(", ")}`;
    return "All tools"
}
// @from(Ln 243711, Col 0)
async function j_4(A, q, K) {
    let Y = K ? A.filter((P) => K.includes(P.agentType)) : A,
        z = sH(),
        _ = z ? `

## When to fork

Fork yourself (omit \`subagent_type\`) when the intermediate tool output isn't worth keeping in your context. The criterion is qualitative — "will I need this output again" — not task size.
- **Research**: fork open-ended questions. If research can be broken into independent questions, launch parallel forks in one message. A fork beats \`subagent_type=Explore\` for this — it inherits context and shares your cache.
- **Implementation**: prefer to fork implementation work that requires more than a couple of edits. Do research before jumping to implementation.

Forks are cheap because they share your prompt cache. Don't set \`model\` on a fork — a different model can't reuse the parent's cache.

**Don't peek.** The tool result includes an \`output_file\` path — do not Read or tail it unless the user explicitly asks for a progress check. You get a completion notification; trust it. Reading the transcript mid-flight pulls the fork's tool noise into your context, which defeats the point of forking.

**Don't race.** After launching, you know nothing about what the fork found. Never fabricate or predict fork results in any format — not as prose, summary, or structured output. The notification arrives as a user-role message in a later turn; it is never something you write yourself. If the user asks a follow-up before the notification lands, tell them the fork is still running — give status, not a guess.
` : "",
        w = z ? `

## Writing the prompt

How you write the prompt depends on whether the agent inherits your context.

**When you omit \`subagent_type\`** — the agent inherits your full conversation context. It already knows everything you know. The prompt is a *directive*: what to do, not what the situation is.
- Be specific about scope: what's in, what's out, what another agent is handling.
- Don't re-explain background — the agent has it.
- If you need a short response, say so ("report in under 200 words").
- Lookups: hand over the exact command. Investigations: hand over the question — prescribed steps become dead weight when the premise is wrong.

**When you specify \`subagent_type\`** — the agent starts fresh with that type's configuration. It has zero context: hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters.
- Brief it like a smart colleague who just walked into the room. Explain what you're trying to accomplish and why.
- Describe what you've already learned or ruled out.
- Give enough context about the surrounding problem that the agent can make judgment calls rather than just following a narrow instruction.
- Terse, command-style prompts produce shallow, generic work.

**Either way — never delegate understanding.** Don't write "based on your findings, fix the bug" or "based on the research, implement it." Those phrases push synthesis onto the agent instead of doing it yourself. Write prompts that prove you understood: include file paths, line numbers, what specifically to change.
` : "",
        O = `Example usage:

<example>
user: "What's left on this branch before we can ship?"
assistant: <thinking>Forking this — it's a survey question. I want the punch list, not the git output in my context.</thinking>
${r4}({
  description: "Branch ship-readiness audit",
  prompt: "Audit what's left before this branch can ship. Check: uncommitted changes, commits ahead of main, whether tests exist, whether the GrowthBook gate is wired up, whether CI-relevant files changed. Report a punch list — done vs. missing. Under 200 words."
})
assistant: Ship-readiness audit running.
<commentary>
Turn ends here. The coordinator knows nothing about the findings yet. What follows is a SEPARATE turn — the notification arrives from outside, as a user-role message. It is not something the coordinator writes.
</commentary>
[later turn — notification arrives as user message]
assistant: Audit's back. Three blockers: no tests for the new prompt path, GrowthBook gate wired but not in build_flags.yaml, and one uncommitted file.
</example>

<example>
user: "so is the gate wired up or not"
<commentary>
User asks mid-wait. The audit fork was launched to answer exactly this, and it hasn't returned. The coordinator does not have this answer. Give status, not a fabricated result.
</commentary>
assistant: Still waiting on the audit — that's one of the things it's checking. Should land shortly.
</example>

<example>
user: "Can you get a second opinion on whether this migration is safe?"
assistant: <thinking>I'll ask the code-reviewer agent — it won't see my analysis, so it can give an independent read.</thinking>
<commentary>
A subagent_type is specified, so the agent starts fresh. It needs full context in the prompt. The briefing explains what to assess and why.
</commentary>
${r4}({
  description: "Independent migration review",
  subagent_type: "code-reviewer",
  prompt: "Review migration 0042_user_schema.sql for safety. Context: we're adding a NOT NULL column to a 50M-row table. Existing rows get a backfill default. I want a second opinion on whether the backfill approach is safe under concurrent writes — I've checked locking behavior but want independent verification. Report: is this safe, and if not, what specifically breaks?"
})
</example>
`,
        $ = `Example usage:

<example_agent_descriptions>
"test-runner": use this agent after you are done writing code to run tests
"greeting-responder": use this agent to respond to user greetings with a friendly joke
</example_agent_descriptions>

<example>
user: "Please write a function that checks if a number is prime"
assistant: I'm going to use the ${_K} tool to write the following code:
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
Since a significant piece of code was written and the task was completed, now use the test-runner agent to run the tests
</commentary>
assistant: Uses the ${QW6.name} tool to launch the test-runner agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the ${QW6.name} tool to launch the greeting-responder agent"
</example>
`,
        H = Y.map((P) => {
            let W = TF9(P);
            return `- ${P.agentType}: ${P.whenToUse} (Tools: ${W})`
        }).join(`
`),
        j = `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${r4} tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types and the tools they have access to:
${H}

${z?`When using the ${r4} tool, specify a subagent_type to use a specialized agent, or omit it to fork yourself — a fork inherits your full conversation context.`:`When using the ${r4} tool, specify a subagent_type parameter to select which agent type to use. If omitted, the general-purpose agent is used.`}`;
    if (q) return j;
    let J = n$(),
        M = J ? "`find` via the Bash tool" : `the ${qz} tool`,
        D = J ? "`grep` via the Bash tool" : `the ${qz} tool`,
        X = z ? "" : `
When NOT to use the ${r4} tool:
- If you want to read a specific file path, use the ${s7} tool or ${M} instead of the ${r4} tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use ${D} instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the ${s7} tool instead of the ${r4} tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above
`;
    return `${j}
${X}

Usage notes:
- Always include a short description (3-5 words) summarizing what the agent will do${CK()!=="pro"?`
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses`:""}
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.${!t6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)&&!eP()&&!z?`
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, you will be automatically notified when it completes — do NOT sleep, poll, or proactively check on its progress. Continue with other work or respond to the user instead.
- **Foreground vs background**: Use foreground (default) when you need the agent's results before you can proceed — e.g., research agents whose findings inform your next steps. Use background when you have genuinely independent work to do in parallel.`:""}
- Agents can be resumed using the \`resume\` parameter by passing the agent ID from a previous invocation. When resumed, the agent continues with its full previous context preserved. ${z?"When NOT resuming and you specify a subagent_type, each invocation starts fresh and you should provide a detailed task description with all necessary context.":"When NOT resuming, each invocation starts fresh and you should provide a detailed task description with all necessary context."}
- When the agent is done, it will return a single message back to you along with its agent ID. You can use this ID to resume the agent later if needed for follow-up work.
${!z?`- Provide clear, detailed prompts so the agent can work autonomously and return exactly the information you need.
`:""}- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.)${z?"":", since it is not aware of the user's intent"}
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${QW6.name} tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.
- You can optionally set \`isolation: "worktree"\` to run the agent in a temporary git worktree, giving it an isolated copy of the repository. The worktree is automatically cleaned up if the agent makes no changes; if changes are made, the worktree path and branch are returned in the result.${eP()?`
- The run_in_background, name, team_name, and mode parameters are not available in this context. Only synchronous subagents are supported.`:$Y()?`
- The name, team_name, and mode parameters are not available in this context — teammates cannot spawn other teammates. Omit them to spawn a subagent.`:""}${_}${w}

${z?O:$}`
}
// @from(Ln 243865, Col 4)
J_4 = E(() => {
    S01();
    J_();
    Q$();
    fA();
    A8();
    XI();
    qZ();
    zz();
    Yc()
})
// @from(Ln 243877, Col 0)
function s36(A) {
    if (A === "general-purpose") return;
    let K = yt6().get(A);
    if (K && s$.includes(K)) return t$[K];
    return
}
// @from(Ln 243884, Col 0)
function t36(A, q) {
    let K = yt6();
    if (!q) {
        K.delete(A);
        return
    }
    if (s$.includes(q)) K.set(A, q)
}
// @from(Ln 243892, Col 4)
s$
// @from(Ln 243892, Col 8)
t$
// @from(Ln 243893, Col 4)
H0 = E(() => {
    T1();
    s$ = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"], t$ = {
        red: "red_FOR_SUBAGENTS_ONLY",
        blue: "blue_FOR_SUBAGENTS_ONLY",
        green: "green_FOR_SUBAGENTS_ONLY",
        yellow: "yellow_FOR_SUBAGENTS_ONLY",
        purple: "purple_FOR_SUBAGENTS_ONLY",
        orange: "orange_FOR_SUBAGENTS_ONLY",
        pink: "pink_FOR_SUBAGENTS_ONLY",
        cyan: "cyan_FOR_SUBAGENTS_ONLY"
    }
})
// @from(Ln 243907, Col 0)
function zc(A) {
    return e36.includes(A)
}
// @from(Ln 243911, Col 0)
function UW6(A) {
    return vF9.includes(A)
}
// @from(Ln 243914, Col 4)
e36
// @from(Ln 243914, Col 9)
vF9
// @from(Ln 243915, Col 4)
dW6 = E(() => {
    e36 = ["sonnet", "opus", "haiku", "best", "sonnet[1m]", "opus[1m]", "opusplan"];
    vF9 = ["sonnet", "opus", "haiku"]
})
// @from(Ln 243920, Col 0)
function Dk8() {
    return "inherit"
}
// @from(Ln 243924, Col 0)
function C01(A, q, K, Y) {
    if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return H5(process.env.CLAUDE_CODE_SUBAGENT_MODEL);
    let z = f31(q),
        _ = ($, H) => {
            if (z && QA() === "bedrock") {
                if (f31(H)) return $;
                return bK7($, z)
            }
            return $
        };
    if (K) {
        if (M_4(K, q)) return q;
        let $ = H5(K);
        return _($, K)
    }
    let w = A ?? Dk8();
    if (w === "inherit") return II({
        permissionMode: Y ?? "default",
        mainLoopModel: q,
        exceeds200kTokens: !1
    });
    if (M_4(w, q)) return q;
    let O = H5(w);
    return _(O, w)
}
// @from(Ln 243950, Col 0)
function M_4(A, q) {
    let K = IY(q);
    switch (A.toLowerCase()) {
        case "opus":
            return K.includes("opus");
        case "sonnet":
            return K.includes("sonnet");
        case "haiku":
            return K.includes("haiku");
        default:
            return !1
    }
}
// @from(Ln 243964, Col 0)
function I01(A) {
    if (!A) return "Inherit from parent (default)";
    if (A === "inherit") return "Inherit from parent";
    return A.charAt(0).toUpperCase() + A.slice(1)
}
// @from(Ln 243970, Col 0)
function D_4() {
    return [{
        value: "sonnet",
        label: "Sonnet",
        description: "Balanced performance - best for most agents"
    }, {
        value: "opus",
        label: "Opus",
        description: "Most capable for complex reasoning tasks"
    }, {
        value: "haiku",
        label: "Haiku",
        description: "Fast and efficient for simple tasks"
    }, {
        value: "inherit",
        label: "Inherit from parent",
        description: "Use the same model as the main conversation"
    }]
}
// @from(Ln 243989, Col 4)
Zs2
// @from(Ln 243990, Col 4)
A96 = E(() => {
    vC6();
    Nz();
    dW6();
    z4();
    Zs2 = [...e36, "inherit"]
})
// @from(Ln 244001, Col 0)
function nk(A) {
    if (typeof A !== "string") return null;
    return VF9.test(A) ? A : null
}
// @from(Ln 244006, Col 0)
function bI(A) {
    let q = NF9(8).toString("hex");
    return A ? `a${A}-${q}` : `a${q}`
}
// @from(Ln 244010, Col 4)
VF9
// @from(Ln 244011, Col 4)
xI = E(() => {
    VF9 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
})
// @from(Ln 244015, Col 0)
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}
// @from(Ln 244037, Col 0)
function _c(A, q, K = !1, Y = !1) {
    let {
        tools: z,
        disallowedTools: _,
        source: w,
        permissionMode: O
    } = A, $ = Y ? q : Xk8({
        tools: q,
        isBuiltIn: w === "built-in",
        isAsync: K,
        permissionMode: O
    }), H = new Set(_?.map((G) => {
        let {
            toolName: f
        } = CH(G);
        return f
    }) ?? []), j = $.filter((G) => !H.has(G.name));
    if (z === void 0 || z.length === 1 && z[0] === "*") return {
        hasWildcard: !0,
        validTools: [],
        invalidTools: [],
        resolvedTools: j
    };
    let M = new Map;
    for (let G of j) M.set(G.name, G);
    let D = [],
        X = [],
        P = [],
        W = new Set,
        Z;
    for (let G of z) {
        let {
            toolName: f,
            ruleContent: v
        } = CH(G);
        if (f === r4) {
            if (v) Z = v.split(",").map((V) => V.trim());
            if (!Y) {
                D.push(G);
                continue
            }
        }
        let N = M.get(f);
        if (N) {
            if (D.push(G), !W.has(N)) P.push(N), W.add(N)
        } else X.push(G)
    }
    return {
        hasWildcard: !1,
        validTools: D,
        invalidTools: X,
        resolvedTools: P,
        allowedAgentTypes: Z
    }
}
// @from(Ln 244092, Col 4)
cW6 = E(() => {
    SP();
    kp6();
    Qz();
    qZ()
})
// @from(Ln 244099, Col 0)
function yF9() {
    let A = w8("tengu_tight_weave", !0);
    return `${kF9} ${A?"When you complete the task, respond with a concise report covering what was done and any key findings — the caller will relay this to the user, so it only needs the essentials.":"When you complete the task simply respond with a detailed writeup."}

${EF9}
${A?"- In your final response, share file paths (always absolute, never relative) that are relevant to the task. Include code snippets only when the exact text is load-bearing — do not recap code you merely read.":"- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths."}
- For clear communication, avoid using emojis.`
}
// @from(Ln 244107, Col 4)
kF9 = "You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less."
// @from(Ln 244108, Col 4)
EF9 = `Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: search broadly when you don't know where something lives. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.`
// @from(Ln 244120, Col 4)
q96
// @from(Ln 244121, Col 4)
b01 = E(() => {
    HA();
    q96 = {
        agentType: "general-purpose",
        whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
        tools: ["*"],
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: yF9
    }
})
// @from(Ln 244132, Col 4)
X_4
// @from(Ln 244133, Col 4)
P_4 = E(() => {
    X_4 = {
        agentType: "statusline-setup",
        whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
        tools: ["Read", "Edit"],
        source: "built-in",
        baseDir: "built-in",
        model: "sonnet",
        color: "orange",
        getSystemPrompt: () => `You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc  
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\\n)\\s*(?:export\\s+)?PS1\\s*=\\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \\u → $(whoami)
   - \\h → $(hostname -s)  
   - \\H → $(hostname)
   - \\w → $(pwd)
   - \\W → $(basename "$(pwd)")
   - \\$ → $
   - \\n → \\n
   - \\t → $(date +%H:%M:%S)
   - \\d → $(date "+%a %b %d")
   - \\@ → $(date +%I:%M%p)
   - \\# → #
   - \\! → !

4. When using ANSI color codes, be sure to use \`printf\`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output, you MUST remove them.

6. If no PS1 is found and user did not provide other instructions, ask for further instructions.

How to use the statusLine command:
1. The statusLine command will receive the following JSON input via stdin:
   {
     "session_id": "string", // Unique session ID
     "session_name": "string", // Optional: Human-readable session name set via /rename
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string",  // Project root directory path
       "added_dirs": ["string"]  // Directories added via /add-dir
     },
     "version": "string",        // Claude Code app version (e.g., "1.0.71")
     "output_style": {
       "name": "string",         // Output style name (e.g., "default", "Explanatory", "Learning")
     },
     "context_window": {
       "total_input_tokens": number,       // Total input tokens used in session (cumulative)
       "total_output_tokens": number,      // Total output tokens used in session (cumulative)
       "context_window_size": number,      // Context window size for current model (e.g., 200000)
       "current_usage": {                   // Token usage from last API call (null if no messages yet)
         "input_tokens": number,           // Input tokens for current context
         "output_tokens": number,          // Output tokens generated
         "cache_creation_input_tokens": number,  // Tokens written to cache
         "cache_read_input_tokens": number       // Tokens read from cache
       } | null,
       "used_percentage": number | null,      // Pre-calculated: % of context used (0-100), null if no messages yet
       "remaining_percentage": number | null  // Pre-calculated: % of context remaining (0-100), null if no messages yet
     },
     "vim": {                     // Optional, only present when vim mode is enabled
       "mode": "INSERT" | "NORMAL"  // Current vim editor mode
     },
     "agent": {                    // Optional, only present when Claude is started with --agent flag
       "name": "string",           // Agent name (e.g., "code-architect", "test-runner")
       "type": "string"            // Optional: Agent type identifier
     },
     "worktree": {                 // Optional, only present when in a --worktree session
       "name": "string",           // Worktree name/slug (e.g., "my-feature")
       "path": "string",           // Full path to the worktree directory
       "branch": "string",         // Optional: Git branch name for the worktree
       "original_cwd": "string",   // The directory Claude was in before entering the worktree
       "original_branch": "string" // Optional: Branch that was checked out before entering the worktree
     }
   }
   
   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')

   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

   To display context remaining percentage (simplest approach using pre-calculated field):
   - input=$(cat); remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty'); [ -n "$remaining" ] && echo "Context: $remaining% remaining"

   Or to display context used percentage:
   - input=$(cat); used=$(echo "$input" | jq -r '.context_window.used_percentage // empty'); [ -n "$used" ] && echo "Context: $used% used"

2. For longer commands, you can save a new file in the user's ~/.claude directory, e.g.:
   - ~/.claude/statusline-command.sh and reference that file in the settings.

3. Update the user's ~/.claude/settings.json with:
   {
     "statusLine": {
       "type": "command", 
       "command": "your_command_here"
     }
   }

4. If ~/.claude/settings.json is a symlink, update the target file instead.

Guidelines:
- Preserve existing settings when updating
- Return a summary of what was configured, including the name of the script file if used
- If the script includes git commands, they should skip optional locks
- IMPORTANT: At the end of your response, inform the parent agent that this "statusline-setup" agent must be used for further status line changes.
  Also ensure that the user is informed that they can ask Claude to continue to make changes to the status line.
`
    }
})
// @from(Ln 244259, Col 0)
function LF9() {
    let A = n$(),
        q = A ? `- Use \`find\` via ${Q7} for broad file pattern matching` : `- Use ${qz} for broad file pattern matching`,
        K = A ? `- Use \`grep\` via ${Q7} for searching file contents with regex` : `- Use ${N9} for searching file contents with regex`;
    return `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
${q}
${K}
- Use ${s7} when you know the specific file path you need to read
- Use ${Q7} ONLY for read-only operations (ls, git status, git log, git diff, find${A?", grep":""}, cat, head, tail)
- NEVER use ${Q7} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.`
}
// @from(Ln 244299, Col 4)
W_4 = 3
// @from(Ln 244300, Col 4)
RF9 = 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.'
// @from(Ln 244301, Col 4)
QB
// @from(Ln 244302, Col 4)
Bp6 = E(() => {
    J_();
    Q$();
    uP();
    XI();
    QB = {
        agentType: "Explore",
        whenToUse: RF9,
        disallowedTools: [r4, Uk, R4, _K, bJ],
        source: "built-in",
        baseDir: "built-in",
        model: "haiku",
        getSystemPrompt: () => LF9(),
        criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
    }
})
// @from(Ln 244319, Col 0)
function hF9() {
    return `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using ${n$()?`\`find\`, \`grep\`, and ${s7}`:`${qz}, ${N9}, and ${s7}`}
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use ${Q7} ONLY for read-only operations (ls, git status, git log, git diff, find${n$()?", grep":""}, cat, head, tail)
   - NEVER use ${Q7} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts - [Brief reason: e.g., "Core logic to modify"]
- path/to/file2.ts - [Brief reason: e.g., "Interfaces to implement"]
- path/to/file3.ts - [Brief reason: e.g., "Pattern to follow"]

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`
}
// @from(Ln 244371, Col 4)
x01
// @from(Ln 244372, Col 4)
Pk8 = E(() => {
    Bp6();
    uP();
    J_();
    Q$();
    XI();
    x01 = {
        agentType: "Plan",
        whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
        disallowedTools: [r4, Uk, R4, _K, bJ],
        source: "built-in",
        tools: QB.tools,
        baseDir: "built-in",
        model: "inherit",
        getSystemPrompt: () => hF9(),
        criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
    }
})
// @from(Ln 244391, Col 0)
function CF9() {
    let A = n$() ? `${s7}, \`find\`, and \`grep\`` : `${s7}, ${qz}, and ${N9}`;
    return `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (${SF9}): Fetch this for questions about the Claude Code CLI tool, including:
  - Installation, setup, and getting started
  - Hooks (pre/post command execution)
  - Custom skills
  - MCP server configuration
  - IDE integrations (VS Code, JetBrains)
  - Settings files and configuration
  - Keyboard shortcuts and hotkeys
  - Subagents and plugins
  - Sandboxing and security

- **Claude Agent SDK docs** (${Z_4}): Fetch this for questions about building agents with the SDK, including:
  - SDK overview and getting started (Python and TypeScript)
  - Agent configuration + custom tools
  - Session management and permissions
  - MCP integration in agents
  - Hosting and deployment
  - Cost tracking and context management
  Note: Agent SDK docs are part of the Claude API documentation at the same URL.

- **Claude API docs** (${Z_4}): Fetch this for questions about the Claude API (formerly the Anthropic API), including:
  - Messages API and streaming
  - Tool use (function calling) and Anthropic-defined tools (computer use, code execution, web search, text editor, bash, programmatic tool calling, tool search tool, context editing, Files API, structured outputs)
  - Vision, PDF support, and citations
  - Extended thinking and structured outputs
  - MCP connector for remote MCP servers
  - Cloud provider integrations (Bedrock, Vertex AI, Foundry)

**Approach:**
1. Determine which domain the user's question falls into
2. Use ${sO} to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use ${jv} if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using ${A}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`
}
// @from(Ln 244453, Col 0)
function IF9() {
    if (uI()) return `- When you cannot find an answer or the feature doesn't exist, direct the user to ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.ISSUES_EXPLAINER}`;
    return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug"
}
// @from(Ln 244457, Col 4)
SF9 = "https://code.claude.com/docs/en/claude_code_docs_map.md"
// @from(Ln 244458, Col 4)
Z_4 = "https://platform.claude.com/llms.txt"
// @from(Ln 244459, Col 4)
Wk8 = "claude-code-guide"
// @from(Ln 244460, Col 4)
G_4
// @from(Ln 244461, Col 4)
Zk8 = E(() => {
    J_();
    uP();
    cq6();
    XI();
    i8();
    fA();
    g1();
    G_4 = {
        agentType: Wk8,
        whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
        tools: n$() ? [Q7, s7, sO, jv] : [qz, N9, s7, sO, jv],
        source: "built-in",
        baseDir: "built-in",
        model: "haiku",
        permissionMode: "dontAsk",
        getSystemPrompt({
            toolUseContext: A
        }) {
            let q = A.options.commands,
                K = [],
                Y = q.filter((j) => j.type === "prompt");
            if (Y.length > 0) {
                let j = Y.map((J) => `- /${J.name}: ${J.description}`).join(`
`);
                K.push(`**Available custom skills in this project:**
${j}`)
            }
            let z = A.options.agentDefinitions.activeAgents.filter((j) => j.source !== "built-in");
            if (z.length > 0) {
                let j = z.map((J) => `- ${J.agentType}: ${J.whenToUse}`).join(`
`);
                K.push(`**Available custom agents configured:**
${j}`)
            }
            let _ = A.options.mcpClients;
            if (_ && _.length > 0) {
                let j = _.map((J) => `- ${J.name}`).join(`
`);
                K.push(`**Configured MCP servers:**
${j}`)
            }
            let w = q.filter((j) => j.type === "prompt" && j.source === "plugin");
            if (w.length > 0) {
                let j = w.map((J) => `- /${J.name}: ${J.description}`).join(`
`);
                K.push(`**Available plugin skills:**
${j}`)
            }
            let O = PA();
            if (Object.keys(O).length > 0) {
                let j = B6(O, null, 2);
                K.push(`**User's settings.json:**
\`\`\`json
${j}
\`\`\``)
            }
            let $ = IF9(),
                H = `${CF9()}
${$}`;
            if (K.length > 0) return `${H}

---

# User's Current Configuration

The user has the following custom setup in their environment:

${K.join(`

`)}

When answering questions, consider these configured features and proactively suggest them when relevant.`;
            return H
        }
    }
})
// @from(Ln 244538, Col 4)
ft2
// @from(Ln 244539, Col 4)
f_4 = E(() => {
    Q$();
    ft2 = `You are a verification specialist. Your job is not to confirm the implementation works — it's to try to break it.

You have two documented failure patterns. First, verification avoidance: when faced with a check, you find reasons not to run it — you read code, narrate what you would test, write "PASS," and move on. Second, being seduced by the first 80%: you see a polished UI or a passing test suite and feel inclined to pass it, not noticing half the buttons do nothing, the state vanishes on refresh, or the backend crashes on bad input. The first 80% is the easy part. Your entire value is in finding the last 20%. The caller may spot-check your commands by re-running them — if a PASS step has no command output, or output that doesn't match re-execution, your report gets rejected.

=== CRITICAL: DO NOT MODIFY THE PROJECT ===
You are STRICTLY PROHIBITED from:
- Creating, modifying, or deleting any files IN THE PROJECT DIRECTORY
- Installing dependencies or packages
- Running git write operations (add, commit, push)

You MAY write ephemeral test scripts to a temp directory (/tmp or $TMPDIR) via ${Q7} redirection when inline commands aren't sufficient — e.g., a multi-step race harness or a Playwright test. Clean up after yourself.

Check your ACTUAL available tools rather than assuming from this prompt. You may have browser automation (mcp__claude-in-chrome__*, mcp__playwright__*), ${sO}, or other MCP tools depending on the session — do not skip capabilities you didn't think to check for.

=== WHAT YOU RECEIVE ===
You will receive: the original task description, files changed, approach taken, and optionally a plan file path.

=== VERIFICATION STRATEGY ===
Adapt your strategy based on what was changed:

**Frontend changes**: Start dev server → check your tools for browser automation (mcp__claude-in-chrome__*, mcp__playwright__*) and USE them to navigate, screenshot, click, and read console — do NOT say "needs a real browser" without attempting → curl a sample of page subresources (image-optimizer URLs like /_next/image, same-origin API routes, static assets) since HTML can serve 200 while everything it references fails → run frontend tests
**Backend/API changes**: Start server → curl/fetch endpoints → verify response shapes against expected values (not just status codes) → test error handling → check edge cases
**CLI/script changes**: Run with representative inputs → verify stdout/stderr/exit codes → test edge inputs (empty, malformed, boundary) → verify --help / usage output is accurate
**Infrastructure/config changes**: Validate syntax → dry-run where possible (terraform plan, kubectl apply --dry-run=server, docker build, nginx -t) → check env vars / secrets are actually referenced, not just defined
**Library/package changes**: Build → full test suite → import the library from a fresh context and exercise the public API as a consumer would → verify exported types match README/docs examples
**Bug fixes**: Reproduce the original bug → verify fix → run regression tests → check related functionality for side effects
**Mobile (iOS/Android)**: Clean build → install on simulator/emulator → dump accessibility/UI tree (idb ui describe-all / uiautomator dump), find elements by label, tap by tree coords, re-dump to verify; screenshots secondary → kill and relaunch to test persistence → check crash logs (logcat / device console)
**Data/ML pipeline**: Run with sample input → verify output shape/schema/types → test empty input, single row, NaN/null handling → check for silent data loss (row counts in vs out)
**Database migrations**: Run migration up → verify schema matches intent → run migration down (reversibility) → test against existing data, not just empty DB
**Refactoring (no behavior change)**: Existing test suite MUST pass unchanged → diff the public API surface (no new/removed exports) → spot-check observable behavior is identical (same inputs → same outputs)
**Other change types**: The pattern is always the same — (a) figure out how to exercise this change directly (run/call/invoke/deploy it), (b) check outputs against expectations, (c) try to break it with inputs/conditions the implementer didn't test. The strategies above are worked examples for common cases.

=== REQUIRED STEPS (universal baseline) ===
1. Read the project's CLAUDE.md / README for build/test commands and conventions. Check package.json / Makefile / pyproject.toml for script names. If the implementer pointed you to a plan or spec file, read it — that's the success criteria.
2. Run the build (if applicable). A broken build is an automatic FAIL.
3. Run the project's test suite (if it has one). Failing tests are an automatic FAIL.
4. Run linters/type-checkers if configured (eslint, tsc, mypy, etc.).
5. Check for regressions in related code.

Then apply the type-specific strategy above. Match rigor to stakes: a one-off script doesn't need race-condition probes; production payments code needs everything.

Test suite results are context, not evidence. Run the suite, note pass/fail, then move on to your real verification. The implementer is an LLM too — its tests may be heavy on mocks, circular assertions, or happy-path coverage that proves nothing about whether the system actually works end-to-end.

=== RECOGNIZE YOUR OWN RATIONALIZATIONS ===
You will feel the urge to skip checks. These are the exact excuses you reach for — recognize them and do the opposite:
- "The code looks correct based on my reading" — reading is not verification. Run it.
- "The implementer's tests already pass" — the implementer is an LLM. Verify independently.
- "This is probably fine" — probably is not verified. Run it.
- "Let me start the server and check the code" — no. Start the server and hit the endpoint.
- "I don't have a browser" — did you actually check for mcp__claude-in-chrome__* / mcp__playwright__*? If present, use them. If an MCP tool fails, troubleshoot (server running? selector right?). The fallback exists so you don't invent your own "can't do this" story.
- "This would take too long" — not your call.
If you catch yourself writing an explanation instead of a command, stop. Run the command.

=== ADVERSARIAL PROBES (adapt to the change type) ===
Functional tests confirm the happy path. Also try to break it:
- **Concurrency** (servers/APIs): parallel requests to create-if-not-exists paths — duplicate sessions? lost writes?
- **Boundary values**: 0, -1, empty string, very long strings, unicode, MAX_INT
- **Idempotency**: same mutating request twice — duplicate created? error? correct no-op?
- **Orphan operations**: delete/reference IDs that don't exist
These are seeds, not a checklist — pick the ones that fit what you're verifying.

=== BEFORE ISSUING PASS ===
Your report must include at least one adversarial probe you ran (concurrency, boundary, idempotency, orphan op, or similar) and its result — even if the result was "handled correctly." If all your checks are "returns 200" or "test suite passes," you have confirmed the happy path, not verified correctness. Go back and try to break something.

=== BEFORE ISSUING FAIL ===
You found something that looks broken. Before reporting FAIL, check you haven't missed why it's actually fine:
- **Already handled**: is there defensive code elsewhere (validation upstream, error recovery downstream) that prevents this?
- **Intentional**: does CLAUDE.md / comments / commit message explain this as deliberate?
- **Not actionable**: is this a real limitation but unfixable without breaking an external contract (stable API, protocol spec, backwards compat)? If so, note it as an observation, not a FAIL — a "bug" that can't be fixed isn't actionable.
Don't use these as excuses to wave away real issues — but don't FAIL on intentional behavior either.

=== OUTPUT FORMAT (REQUIRED) ===
Every check MUST follow this structure. A check without a Command run block is not a PASS — it's a skip.

\`\`\`
### Check: [what you're verifying]
**Command run:**
  [exact command you executed]
**Output observed:**
  [actual terminal output — copy-paste, not paraphrased. Truncate if very long but keep the relevant part.]
**Result: PASS** (or FAIL — with Expected vs Actual)
\`\`\`

Bad (rejected):
\`\`\`
### Check: POST /api/register validation
**Result: PASS**
Evidence: Reviewed the route handler in routes/auth.py. The logic correctly validates
email format and password length before DB insert.
\`\`\`
(No command run. Reading code is not verification.)

Good:
\`\`\`
### Check: POST /api/register rejects short password
**Command run:**
  curl -s -X POST localhost:8000/api/register -H 'Content-Type: application/json' \\
    -d '{"email":"t@t.co","password":"short"}' | python3 -m json.tool
**Output observed:**
  {
    "error": "password must be at least 8 characters"
  }
  (HTTP 400)
**Expected vs Actual:** Expected 400 with password-length error. Got exactly that.
**Result: PASS**
\`\`\`

End with exactly this line (parsed by caller):

VERDICT: PASS
or
VERDICT: FAIL
or
VERDICT: PARTIAL

PARTIAL is for environmental limitations only (no test framework, tool unavailable, server can't start) — not for "I'm unsure whether this is a bug." If you can run the check, you must decide PASS or FAIL.

Use the literal string \`VERDICT: \` followed by exactly one of \`PASS\`, \`FAIL\`, \`PARTIAL\`. No markdown bold, no punctuation, no variation.
- **FAIL**: include what failed, exact error output, reproduction steps.
- **PARTIAL**: what was verified, what could not be and why (missing tool/env), what the implementer should know.`
})
// @from(Ln 244663, Col 0)
function u01() {
    if (t6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && q7()) return [];
    let A = [q96, X_4, QB, x01];
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(G_4);
    return A
}
// @from(Ln 244669, Col 4)
T_4 = E(() => {
    b01();
    P_4();
    Bp6();
    Pk8();
    Zk8();
    f_4();
    A8();
    T1();
    HA()
})
// @from(Ln 244680, Col 0)
async function xF9(A) {
    try {
        return !!await EM(A)
    } catch {
        return !1
    }
}
// @from(Ln 244688, Col 0)
function v_4() {
    K96.cache?.set?.(void 0, Promise.resolve(!1))
}
// @from(Ln 244691, Col 4)
K96
// @from(Ln 244692, Col 4)
m01 = E(() => {
    U4();
    Oy();
    K96 = e1(async () => {
        return xF9("git")
    })
})
// @from(Ln 244700, Col 0)
function lW6(A, q) {
    let Y = A.slice(0, 2).map((w) => {
            let O = w.reason || w.error || "unknown error";
            return q ? `${w.name} (${O})` : w.name
        }).join(q ? "; " : ", "),
        z = A.length - 2,
        _ = z > 0 ? ` and ${z} more` : "";
    return `${Y}${_}`
}
// @from(Ln 244710, Col 0)
function gp6(A) {
    switch (A.source) {
        case "github":
            return A.repo;
        case "url":
            return A.url;
        case "git":
            return A.url;
        case "directory":
            return A.path;
        case "file":
            return A.path;
        default:
            return "Unknown source"
    }
}
// @from(Ln 244727, Col 0)
function UB(A, q) {
    return `${A}@${q}`
}
// @from(Ln 244730, Col 0)
async function mI(A) {
    let q = [],
        K = [];
    for (let [Y, z] of Object.entries(A)) {
        if (!Y96(z.source)) continue;
        let _ = null;
        try {
            _ = await j0(Y)
        } catch (w) {
            let O = w instanceof Error ? w.message : String(w);
            K.push({
                name: Y,
                error: O
            }), _6(w instanceof Error ? w : Error(`Failed to load marketplace ${Y}: ${w}`))
        }
        q.push({
            name: Y,
            config: z,
            data: _
        })
    }
    return {
        marketplaces: q,
        failures: K
    }
}
// @from(Ln 244757, Col 0)
function iW6(A, q) {
    if (A.length === 0) return null;
    if (q > 0) return {
        type: "warning",
        message: A.length === 1 ? `Warning: Failed to load marketplace '${A[0].name}': ${A[0].error}` : `Warning: Failed to load ${A.length} marketplaces: ${uF9(A)}`
    };
    return {
        type: "error",
        message: `Failed to load all marketplaces. Errors: ${mF9(A)}`
    }
}
// @from(Ln 244769, Col 0)
function uF9(A) {
    return A.map((q) => q.name).join(", ")
}
// @from(Ln 244773, Col 0)
function mF9(A) {
    return A.map((q) => `${q.name}: ${q.error}`).join("; ")
}
// @from(Ln 244777, Col 0)
function Ke() {
    let A = L8("policySettings");
    if (!A?.strictKnownMarketplaces) return null;
    return A.strictKnownMarketplaces
}
// @from(Ln 244783, Col 0)
function Gk8() {
    let A = L8("policySettings");
    if (!A?.blockedMarketplaces) return null;
    return A.blockedMarketplaces
}
// @from(Ln 244789, Col 0)
function V_4() {
    return L8("policySettings")?.pluginTrustMessage
}
// @from(Ln 244793, Col 0)
function k_4() {
    let A = L8("policySettings")?.enabledPlugins;
    if (!A) return null;
    let q = new Set;
    for (let [K, Y] of Object.entries(A)) {
        if (typeof Y !== "boolean" || !K.includes("@")) continue;
        let z = K.split("@")[0];
        if (z) q.add(z)
    }
    return q.size > 0 ? q : null
}
// @from(Ln 244805, Col 0)
function BF9(A, q) {
    if (A.source !== q.source) return !1;
    switch (A.source) {
        case "url":
            return A.url === q.url;
        case "github":
            return A.repo === q.repo && (A.ref || void 0) === (q.ref || void 0) && (A.path || void 0) === (q.path || void 0);
        case "git":
            return A.url === q.url && (A.ref || void 0) === (q.ref || void 0) && (A.path || void 0) === (q.path || void 0);
        case "npm":
            return A.package === q.package;
        case "file":
            return A.path === q.path;
        case "directory":
            return A.path === q.path;
        default:
            return !1
    }
}
// @from(Ln 244825, Col 0)
function fk8(A) {
    switch (A.source) {
        case "github":
            return "github.com";
        case "git": {
            let q = A.url.match(/^[^@]+@([^:]+):/);
            if (q?.[1]) return q[1];
            try {
                return new URL(A.url).hostname
            } catch {
                return null
            }
        }
        case "url":
            try {
                return new URL(A.url).hostname
            } catch {
                return null
            }
        default:
            return null
    }
}
// @from(Ln 244849, Col 0)
function gF9(A, q) {
    let K = fk8(A);
    if (!K) return !1;
    try {
        return new RegExp(q.hostPattern).test(K)
    } catch {
        return _6(Error(`Invalid hostPattern regex: ${q.hostPattern}`)), !1
    }
}
// @from(Ln 244859, Col 0)
function FF9(A, q) {
    if (A.source !== "file" && A.source !== "directory") return !1;
    try {
        return new RegExp(q.pathPattern).test(A.path)
    } catch {
        return _6(Error(`Invalid pathPattern regex: ${q.pathPattern}`)), !1
    }
}
// @from(Ln 244868, Col 0)
function E_4() {
    let A = Ke();
    if (!A) return [];
    return A.filter((q) => q.source === "hostPattern").map((q) => q.hostPattern)
}
// @from(Ln 244874, Col 0)
function N_4(A) {
    let q = A.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/);
    if (q && q[1]) return q[1];
    let K = A.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/);
    if (K && K[1]) return K[1];
    return null
}
// @from(Ln 244882, Col 0)
function qe(A, q) {
    if (!A) return !0;
    return (A || void 0) === (q || void 0)
}
// @from(Ln 244887, Col 0)
function pF9(A, q) {
    if (A.source === q.source) switch (A.source) {
        case "github": {
            let K = q;
            if (A.repo !== K.repo) return !1;
            return qe(K.ref, A.ref) && qe(K.path, A.path)
        }
        case "git": {
            let K = q;
            if (A.url !== K.url) return !1;
            return qe(K.ref, A.ref) && qe(K.path, A.path)
        }
        case "url":
            return A.url === q.url;
        case "npm":
            return A.package === q.package;
        case "file":
            return A.path === q.path;
        case "directory":
            return A.path === q.path;
        default:
            return !1
    }
    if (A.source === "git" && q.source === "github") {
        if (N_4(A.url) === q.repo) return qe(q.ref, A.ref) && qe(q.path, A.path)
    }
    if (A.source === "github" && q.source === "git") {
        if (N_4(q.url) === A.repo) return qe(q.ref, A.ref) && qe(q.path, A.path)
    }
    return !1
}
// @from(Ln 244919, Col 0)
function Fp6(A) {
    let q = Gk8();
    if (q === null) return !1;
    return q.some((K) => pF9(A, K))
}
// @from(Ln 244925, Col 0)
function Y96(A) {
    if (Fp6(A)) return !1;
    let q = Ke();
    if (q === null) return !0;
    return q.some((K) => {
        if (K.source === "hostPattern") return gF9(A, K);
        if (K.source === "pathPattern") return FF9(A, K);
        return BF9(A, K)
    })
}
// @from(Ln 244936, Col 0)
function z96(A) {
    switch (A.source) {
        case "github":
            return `github:${A.repo}${A.ref?`@${A.ref}`:""}`;
        case "url":
            return A.url;
        case "git":
            return `git:${A.url}${A.ref?`@${A.ref}`:""}`;
        case "npm":
            return `npm:${A.package}`;
        case "file":
            return `file:${A.path}`;
        case "directory":
            return `dir:${A.path}`;
        case "hostPattern":
            return `hostPattern:${A.hostPattern}`;
        case "pathPattern":
            return `pathPattern:${A.pathPattern}`;
        default:
            return "unknown source"
    }
}
// @from(Ln 244958, Col 0)
async function y_4({
    configuredMarketplaceCount: A,
    failedMarketplaceCount: q
}) {
    if (!await K96()) return "git-not-installed";
    let Y = Ke();
    if (Y !== null) {
        if (Y.length === 0) return "all-blocked-by-policy";
        if (A === 0) return "policy-restricts-sources"
    }
    if (A === 0) return "no-marketplaces-configured";
    if (q > 0 && q === A) return "all-marketplaces-failed";
    return "all-plugins-installed"
}
// @from(Ln 244972, Col 4)
dB = E(() => {
    Aw();
    k1();
    i8();
    m01()
})
// @from(Ln 244982, Col 0)
function pp6() {
    let A = {};
    for (let q of XT())
        for (let K of R_4) {
            let {
                settings: Y
            } = Ye(L_4(q, ".claude", K));
            if (!Y?.enabledPlugins) continue;
            Object.assign(A, Y.enabledPlugins)
        }
    return A
}
// @from(Ln 244995, Col 0)
function h_4() {
    let A = {};
    for (let q of XT())
        for (let K of R_4) {
            let {
                settings: Y
            } = Ye(L_4(q, ".claude", K));
            if (!Y?.extraKnownMarketplaces) continue;
            Object.assign(A, Y.extraKnownMarketplaces)
        }
    return A
}
// @from(Ln 245007, Col 4)
R_4
// @from(Ln 245008, Col 4)
B01 = E(() => {
    T1();
    i8();
    R_4 = ["settings.json", "settings.local.json"]
})
// @from(Ln 245014, Col 0)
function n3(A) {
    if (A.includes("@")) {
        let q = A.split("@");
        return {
            name: q[0] || "",
            marketplace: q[1]
        }
    }
    return {
        name: A
    }
}
// @from(Ln 245027, Col 0)
function cB(A) {
    if (A === "managed") throw Error("Cannot install plugins to managed scope");
    return QF9[A]
}
// @from(Ln 245032, Col 0)
function S_4(A) {
    return Tk8[A]
}
// @from(Ln 245035, Col 4)
Tk8
// @from(Ln 245035, Col 9)
QF9
// @from(Ln 245036, Col 4)
BI = E(() => {
    Tk8 = {
        policySettings: "managed",
        userSettings: "user",
        projectSettings: "project",
        localSettings: "local",
        flagSettings: "flag"
    };
    QF9 = {
        user: "userSettings",
        project: "projectSettings",
        local: "localSettings"
    }
})
// @from(Ln 245055, Col 0)
function Qp6() {
    return _96(eH(), "installed_plugins.json")
}
// @from(Ln 245059, Col 0)
function UF9() {
    return _96(eH(), "installed_plugins_v2.json")
}
// @from(Ln 245063, Col 0)
function dF9() {
    if (vk8) return;
    let A = $1(),
        q = Qp6(),
        K = UF9();
    try {
        let Y = A.existsSync(K),
            z = A.existsSync(q);
        if (Y) {
            A.renameSync(K, q), k("Renamed installed_plugins_v2.json to installed_plugins.json");
            let _ = DZ();
            C_4(_)
        } else if (z) {
            let _ = A.readFileSync(q, {
                    encoding: "utf-8"
                }),
                w = i1(_);
            if ((typeof w?.version === "number" ? w.version : 1) === 1) {
                let $ = CC6().parse(w),
                    H = kk8($);
                fz(q, B6(H, null, 2), {
                    encoding: "utf-8",
                    flush: !0
                }), k(`Converted installed_plugins.json from V1 to V2 format (${Object.keys($.plugins).length} plugins)`), C_4(H)
            }
        }
        vk8 = !0
    } catch (Y) {
        let z = _1(Y);
        k(`Failed to migrate plugin files: ${z}`, {
            level: "error"
        }), _6(Y instanceof Error ? Y : Error(`Failed to migrate plugin files: ${z}`)), vk8 = !0
    }
}
// @from(Ln 245098, Col 0)
function C_4(A) {
    let q = $1(),
        K = rW6();
    try {
        let Y = new Set;
        for (let _ of Object.values(A.plugins))
            for (let w of _) Y.add(w.installPath);
        let z = q.readdirSync(K);
        for (let _ of z) {
            if (!_.isDirectory()) continue;
            let w = _.name,
                O = _96(K, w);
            if (q.readdirSync(O).some((j) => {
                    if (!j.isDirectory()) return !1;
                    let J = _96(O, j.name);
                    return q.readdirSync(J).some((D) => D.isDirectory())
                })) continue;
            if (!Y.has(O)) q.rmSync(O, {
                recursive: !0,
                force: !0
            }), k(`Cleaned up legacy cache directory: ${w}`)
        }
    } catch (Y) {
        let z = _1(Y);
        k(`Failed to clean up legacy cache: ${z}`, {
            level: "warn"
        })
    }
}
// @from(Ln 245128, Col 0)
function Vk8() {
    let A = $1(),
        q = Qp6(),
        K;
    try {
        K = A.readFileSync(q, {
            encoding: "utf-8"
        })
    } catch (_) {
        if (_.code === "ENOENT") return null;
        throw _
    }
    let Y = i1(K);
    return {
        version: typeof Y?.version === "number" ? Y.version : 1,
        data: Y
    }
}
// @from(Ln 245147, Col 0)
function kk8(A) {
    let q = {};
    for (let [K, Y] of Object.entries(A.plugins)) {
        let z = FI(K, Y.version);
        q[K] = [{
            scope: "user",
            installPath: z,
            version: Y.version,
            installedAt: Y.installedAt,
            lastUpdated: Y.lastUpdated,
            gitCommitSha: Y.gitCommitSha
        }]
    }
    return {
        version: 2,
        plugins: q
    }
}
// @from(Ln 245166, Col 0)
function DZ() {
    if (lB !== null) return lB;
    let A = Qp6();
    try {
        let q = Vk8();
        if (q) {
            if (q.version === 2) {
                let z = IC6().parse(q.data);
                return lB = z, k(`Loaded ${Object.keys(z.plugins).length} installed plugins from ${A}`), z
            }
            let K = CC6().parse(q.data),
                Y = kk8(K);
            return lB = Y, k(`Loaded and converted ${Object.keys(K.plugins).length} plugins from V1 format`), Y
        }
        return k("installed_plugins.json doesn't exist, returning empty V2 object"), lB = {
            version: 2,
            plugins: {}
        }, lB
    } catch (q) {
        let K = _1(q);
        return k(`Failed to load installed_plugins.json: ${K}. Starting with empty state.`, {
            level: "error"
        }), _6(q instanceof Error ? q : Error(`Failed to load installed_plugins.json: ${K}`)), lB = {
            version: 2,
            plugins: {}
        }, lB
    }
}
// @from(Ln 245195, Col 0)
function F01(A) {
    let q = $1(),
        K = Qp6();
    try {
        q.mkdirSync(eH());
        let Y = B6(A, null, 2);
        fz(K, Y, {
            encoding: "utf-8",
            flush: !0
        }), lB = A, k(`Saved ${Object.keys(A.plugins).length} installed plugins to ${K}`)
    } catch (Y) {
        let z = _1(Y);
        throw _6(Y instanceof Error ? Y : Error(`Failed to save installed_plugins.json: ${z}`)), Y
    }
}
// @from(Ln 245211, Col 0)
function b_4(A, q, K) {
    let Y = gI(),
        z = Y.plugins[A];
    if (!z) return;
    if (Y.plugins[A] = z.filter((_) => !(_.scope === q && _.projectPath === K)), Y.plugins[A].length === 0) delete Y.plugins[A];
    F01(Y), k(`Removed installation for ${A} at scope ${q}`)
}
// @from(Ln 245219, Col 0)
function Up6() {
    if (Nk8 === null) Nk8 = DZ();
    return Nk8
}
// @from(Ln 245224, Col 0)
function gI() {
    try {
        let A = Vk8();
        if (A) {
            if (A.version === 2) return IC6().parse(A.data);
            let q = CC6().parse(A.data);
            return kk8(q)
        }
        return {
            version: 2,
            plugins: {}
        }
    } catch (A) {
        let q = _1(A);
        return k(`Failed to load installed plugins from disk: ${q}`, {
            level: "error"
        }), {
            version: 2,
            plugins: {}
        }
    }
}