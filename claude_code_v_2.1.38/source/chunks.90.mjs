
// @from(Ln 241512, Col 4)
hl7 = R((Cl7) => {
    Object.defineProperty(Cl7, "__esModule", {
        value: !0
    });
    Cl7.TraceStateImpl = void 0;
    var kl7 = El7(),
        Ll7 = 32,
        Qk9 = 512,
        Rl7 = ",",
        yl7 = "=";
    class GMA {
        constructor(A) {
            if (this._internalState = new Map, A) this._parse(A)
        }
        set(A, q) {
            let K = this._clone();
            if (K._internalState.has(A)) K._internalState.delete(A);
            return K._internalState.set(A, q), K
        }
        unset(A) {
            let q = this._clone();
            return q._internalState.delete(A), q
        }
        get(A) {
            return this._internalState.get(A)
        }
        serialize() {
            return this._keys().reduce((A, q) => {
                return A.push(q + yl7 + this.get(q)), A
            }, []).join(Rl7)
        }
        _parse(A) {
            if (A.length > Qk9) return;
            if (this._internalState = A.split(Rl7).reverse().reduce((q, K) => {
                    let Y = K.trim(),
                        z = Y.indexOf(yl7);
                    if (z !== -1) {
                        let w = Y.slice(0, z),
                            H = Y.slice(z + 1, K.length);
                        if ((0, kl7.validateKey)(w) && (0, kl7.validateValue)(H)) q.set(w, H)
                    }
                    return q
                }, new Map), this._internalState.size > Ll7) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, Ll7))
        }
        _keys() {
            return Array.from(this._internalState.keys()).reverse()
        }
        _clone() {
            let A = new GMA;
            return A._internalState = new Map(this._internalState), A
        }
    }
    Cl7.TraceStateImpl = GMA
})
// @from(Ln 241566, Col 4)
bl7 = R((Il7) => {
    Object.defineProperty(Il7, "__esModule", {
        value: !0
    });
    Il7.createTraceState = void 0;
    var gk9 = hl7();

    function Uk9(A) {
        return new gk9.TraceStateImpl(A)
    }
    Il7.createTraceState = Uk9
})
// @from(Ln 241578, Col 4)
ml7 = R((ul7) => {
    Object.defineProperty(ul7, "__esModule", {
        value: !0
    });
    ul7.context = void 0;
    var pk9 = jB1();
    ul7.context = pk9.ContextAPI.getInstance()
})
// @from(Ln 241586, Col 4)
gl7 = R((Fl7) => {
    Object.defineProperty(Fl7, "__esModule", {
        value: !0
    });
    Fl7.diag = void 0;
    var dk9 = CK1();
    Fl7.diag = dk9.DiagAPI.instance()
})
// @from(Ln 241594, Col 4)
dl7 = R((Ul7) => {
    Object.defineProperty(Ul7, "__esModule", {
        value: !0
    });
    Ul7.NOOP_METER_PROVIDER = Ul7.NoopMeterProvider = void 0;
    var ck9 = sjA();
    class ZMA {
        getMeter(A, q, K) {
            return ck9.NOOP_METER
        }
    }
    Ul7.NoopMeterProvider = ZMA;
    Ul7.NOOP_METER_PROVIDER = new ZMA
})
// @from(Ln 241608, Col 4)
nl7 = R((ll7) => {
    Object.defineProperty(ll7, "__esModule", {
        value: !0
    });
    ll7.MetricsAPI = void 0;
    var ik9 = dl7(),
        fMA = yK1(),
        cl7 = CK1(),
        VMA = "metrics";
    class NMA {
        constructor() {}
        static getInstance() {
            if (!this._instance) this._instance = new NMA;
            return this._instance
        }
        setGlobalMeterProvider(A) {
            return (0, fMA.registerGlobal)(VMA, A, cl7.DiagAPI.instance())
        }
        getMeterProvider() {
            return (0, fMA.getGlobal)(VMA) || ik9.NOOP_METER_PROVIDER
        }
        getMeter(A, q, K) {
            return this.getMeterProvider().getMeter(A, q, K)
        }
        disable() {
            (0, fMA.unregisterGlobal)(VMA, cl7.DiagAPI.instance())
        }
    }
    ll7.MetricsAPI = NMA
})
// @from(Ln 241638, Col 4)
al7 = R((rl7) => {
    Object.defineProperty(rl7, "__esModule", {
        value: !0
    });
    rl7.metrics = void 0;
    var nk9 = nl7();
    rl7.metrics = nk9.MetricsAPI.getInstance()
})
// @from(Ln 241646, Col 4)
Ai7 = R((tl7) => {
    Object.defineProperty(tl7, "__esModule", {
        value: !0
    });
    tl7.NoopTextMapPropagator = void 0;
    class sl7 {
        inject(A, q) {}
        extract(A, q) {
            return A
        }
        fields() {
            return []
        }
    }
    tl7.NoopTextMapPropagator = sl7
})
// @from(Ln 241662, Col 4)
zi7 = R((Ki7) => {
    Object.defineProperty(Ki7, "__esModule", {
        value: !0
    });
    Ki7.deleteBaggage = Ki7.setBaggage = Ki7.getActiveBaggage = Ki7.getBaggage = void 0;
    var rk9 = jB1(),
        ok9 = XB1(),
        TMA = (0, ok9.createContextKey)("OpenTelemetry Baggage Key");

    function qi7(A) {
        return A.getValue(TMA) || void 0
    }
    Ki7.getBaggage = qi7;

    function ak9() {
        return qi7(rk9.ContextAPI.getInstance().active())
    }
    Ki7.getActiveBaggage = ak9;

    function sk9(A, q) {
        return A.setValue(TMA, q)
    }
    Ki7.setBaggage = sk9;

    function tk9(A) {
        return A.deleteValue(TMA)
    }
    Ki7.deleteBaggage = tk9
})
// @from(Ln 241691, Col 4)
_i7 = R(($i7) => {
    Object.defineProperty($i7, "__esModule", {
        value: !0
    });
    $i7.PropagationAPI = void 0;
    var vMA = yK1(),
        KL9 = Ai7(),
        wi7 = ejA(),
        o_6 = zi7(),
        YL9 = UjA(),
        Hi7 = CK1(),
        EMA = "propagation",
        zL9 = new KL9.NoopTextMapPropagator;
    class kMA {
        constructor() {
            this.createBaggage = YL9.createBaggage, this.getBaggage = o_6.getBaggage, this.getActiveBaggage = o_6.getActiveBaggage, this.setBaggage = o_6.setBaggage, this.deleteBaggage = o_6.deleteBaggage
        }
        static getInstance() {
            if (!this._instance) this._instance = new kMA;
            return this._instance
        }
        setGlobalPropagator(A) {
            return (0, vMA.registerGlobal)(EMA, A, Hi7.DiagAPI.instance())
        }
        inject(A, q, K = wi7.defaultTextMapSetter) {
            return this._getGlobalPropagator().inject(A, q, K)
        }
        extract(A, q, K = wi7.defaultTextMapGetter) {
            return this._getGlobalPropagator().extract(A, q, K)
        }
        fields() {
            return this._getGlobalPropagator().fields()
        }
        disable() {
            (0, vMA.unregisterGlobal)(EMA, Hi7.DiagAPI.instance())
        }
        _getGlobalPropagator() {
            return (0, vMA.getGlobal)(EMA) || zL9
        }
    }
    $i7.PropagationAPI = kMA
})
// @from(Ln 241733, Col 4)
Di7 = R((Ji7) => {
    Object.defineProperty(Ji7, "__esModule", {
        value: !0
    });
    Ji7.propagation = void 0;
    var wL9 = _i7();
    Ji7.propagation = wL9.PropagationAPI.getInstance()
})
// @from(Ln 241741, Col 4)
Zi7 = R((Wi7) => {
    Object.defineProperty(Wi7, "__esModule", {
        value: !0
    });
    Wi7.TraceAPI = void 0;
    var LMA = yK1(),
        ji7 = DMA(),
        Mi7 = r_6(),
        lj1 = $MA(),
        Pi7 = CK1(),
        RMA = "trace";
    class yMA {
        constructor() {
            this._proxyTracerProvider = new ji7.ProxyTracerProvider, this.wrapSpanContext = Mi7.wrapSpanContext, this.isSpanContextValid = Mi7.isSpanContextValid, this.deleteSpan = lj1.deleteSpan, this.getSpan = lj1.getSpan, this.getActiveSpan = lj1.getActiveSpan, this.getSpanContext = lj1.getSpanContext, this.setSpan = lj1.setSpan, this.setSpanContext = lj1.setSpanContext
        }
        static getInstance() {
            if (!this._instance) this._instance = new yMA;
            return this._instance
        }
        setGlobalTracerProvider(A) {
            let q = (0, LMA.registerGlobal)(RMA, this._proxyTracerProvider, Pi7.DiagAPI.instance());
            if (q) this._proxyTracerProvider.setDelegate(A);
            return q
        }
        getTracerProvider() {
            return (0, LMA.getGlobal)(RMA) || this._proxyTracerProvider
        }
        getTracer(A, q) {
            return this.getTracerProvider().getTracer(A, q)
        }
        disable() {
            (0, LMA.unregisterGlobal)(RMA, Pi7.DiagAPI.instance()), this._proxyTracerProvider = new ji7.ProxyTracerProvider
        }
    }
    Wi7.TraceAPI = yMA
})
// @from(Ln 241777, Col 4)
Ni7 = R((fi7) => {
    Object.defineProperty(fi7, "__esModule", {
        value: !0
    });
    fi7.trace = void 0;
    var HL9 = Zi7();
    fi7.trace = HL9.TraceAPI.getInstance()
})
// @from(Ln 241785, Col 4)
Fq = R((S2) => {
    Object.defineProperty(S2, "__esModule", {
        value: !0
    });
    S2.trace = S2.propagation = S2.metrics = S2.diag = S2.context = S2.INVALID_SPAN_CONTEXT = S2.INVALID_TRACEID = S2.INVALID_SPANID = S2.isValidSpanId = S2.isValidTraceId = S2.isSpanContextValid = S2.createTraceState = S2.TraceFlags = S2.SpanStatusCode = S2.SpanKind = S2.SamplingDecision = S2.ProxyTracerProvider = S2.ProxyTracer = S2.defaultTextMapSetter = S2.defaultTextMapGetter = S2.ValueType = S2.createNoopMeter = S2.DiagLogLevel = S2.DiagConsoleLogger = S2.ROOT_CONTEXT = S2.createContextKey = S2.baggageEntryMetadataFromString = void 0;
    var $L9 = UjA();
    Object.defineProperty(S2, "baggageEntryMetadataFromString", {
        enumerable: !0,
        get: function() {
            return $L9.baggageEntryMetadataFromString
        }
    });
    var Ti7 = XB1();
    Object.defineProperty(S2, "createContextKey", {
        enumerable: !0,
        get: function() {
            return Ti7.createContextKey
        }
    });
    Object.defineProperty(S2, "ROOT_CONTEXT", {
        enumerable: !0,
        get: function() {
            return Ti7.ROOT_CONTEXT
        }
    });
    var OL9 = Zc7();
    Object.defineProperty(S2, "DiagConsoleLogger", {
        enumerable: !0,
        get: function() {
            return OL9.DiagConsoleLogger
        }
    });
    var _L9 = d_6();
    Object.defineProperty(S2, "DiagLogLevel", {
        enumerable: !0,
        get: function() {
            return _L9.DiagLogLevel
        }
    });
    var JL9 = sjA();
    Object.defineProperty(S2, "createNoopMeter", {
        enumerable: !0,
        get: function() {
            return JL9.createNoopMeter
        }
    });
    var XL9 = Sc7();
    Object.defineProperty(S2, "ValueType", {
        enumerable: !0,
        get: function() {
            return XL9.ValueType
        }
    });
    var vi7 = ejA();
    Object.defineProperty(S2, "defaultTextMapGetter", {
        enumerable: !0,
        get: function() {
            return vi7.defaultTextMapGetter
        }
    });
    Object.defineProperty(S2, "defaultTextMapSetter", {
        enumerable: !0,
        get: function() {
            return vi7.defaultTextMapSetter
        }
    });
    var DL9 = XMA();
    Object.defineProperty(S2, "ProxyTracer", {
        enumerable: !0,
        get: function() {
            return DL9.ProxyTracer
        }
    });
    var jL9 = DMA();
    Object.defineProperty(S2, "ProxyTracerProvider", {
        enumerable: !0,
        get: function() {
            return jL9.ProxyTracerProvider
        }
    });
    var ML9 = Gl7();
    Object.defineProperty(S2, "SamplingDecision", {
        enumerable: !0,
        get: function() {
            return ML9.SamplingDecision
        }
    });
    var PL9 = fl7();
    Object.defineProperty(S2, "SpanKind", {
        enumerable: !0,
        get: function() {
            return PL9.SpanKind
        }
    });
    var WL9 = Nl7();
    Object.defineProperty(S2, "SpanStatusCode", {
        enumerable: !0,
        get: function() {
            return WL9.SpanStatusCode
        }
    });
    var GL9 = zMA();
    Object.defineProperty(S2, "TraceFlags", {
        enumerable: !0,
        get: function() {
            return GL9.TraceFlags
        }
    });
    var ZL9 = bl7();
    Object.defineProperty(S2, "createTraceState", {
        enumerable: !0,
        get: function() {
            return ZL9.createTraceState
        }
    });
    var CMA = r_6();
    Object.defineProperty(S2, "isSpanContextValid", {
        enumerable: !0,
        get: function() {
            return CMA.isSpanContextValid
        }
    });
    Object.defineProperty(S2, "isValidTraceId", {
        enumerable: !0,
        get: function() {
            return CMA.isValidTraceId
        }
    });
    Object.defineProperty(S2, "isValidSpanId", {
        enumerable: !0,
        get: function() {
            return CMA.isValidSpanId
        }
    });
    var SMA = i_6();
    Object.defineProperty(S2, "INVALID_SPANID", {
        enumerable: !0,
        get: function() {
            return SMA.INVALID_SPANID
        }
    });
    Object.defineProperty(S2, "INVALID_TRACEID", {
        enumerable: !0,
        get: function() {
            return SMA.INVALID_TRACEID
        }
    });
    Object.defineProperty(S2, "INVALID_SPAN_CONTEXT", {
        enumerable: !0,
        get: function() {
            return SMA.INVALID_SPAN_CONTEXT
        }
    });
    var Ei7 = ml7();
    Object.defineProperty(S2, "context", {
        enumerable: !0,
        get: function() {
            return Ei7.context
        }
    });
    var ki7 = gl7();
    Object.defineProperty(S2, "diag", {
        enumerable: !0,
        get: function() {
            return ki7.diag
        }
    });
    var Li7 = al7();
    Object.defineProperty(S2, "metrics", {
        enumerable: !0,
        get: function() {
            return Li7.metrics
        }
    });
    var Ri7 = Di7();
    Object.defineProperty(S2, "propagation", {
        enumerable: !0,
        get: function() {
            return Ri7.propagation
        }
    });
    var yi7 = Ni7();
    Object.defineProperty(S2, "trace", {
        enumerable: !0,
        get: function() {
            return yi7.trace
        }
    });
    S2.default = {
        context: Ei7.context,
        diag: ki7.diag,
        metrics: Li7.metrics,
        propagation: Ri7.propagation,
        trace: yi7.trace
    }
})
// @from(Ln 241985, Col 0)
function FX() {
    if (!(J6(process.env.ENABLE_BETA_TRACING_DETAILED) && Boolean(process.env.BETA_TRACING_ENDPOINT))) return !1;
    return w4()
}
// @from(Ln 241990, Col 0)
function up(A, q = TL9) {
    if (A.length <= q) return {
        content: A,
        truncated: !1
    };
    return {
        content: A.slice(0, q) + `

[TRUNCATED - Content exceeds 60KB limit]`,
        truncated: !0
    }
}
// @from(Ln 242003, Col 0)
function IMA(A) {
    return NL9("sha256").update(A).digest("hex").slice(0, 12)
}
// @from(Ln 242007, Col 0)
function vL9(A) {
    return `sp_${IMA(A)}`
}
// @from(Ln 242011, Col 0)
function Si7(A) {
    let q = Q1(A.message.content);
    return `msg_${IMA(q)}`
}
// @from(Ln 242016, Col 0)
function hMA(A) {
    let q = A.trim().match(EL9);
    return q && q[1] ? q[1].trim() : null
}
// @from(Ln 242021, Col 0)
function kL9(A) {
    let q = [],
        K = [];
    for (let Y of A) {
        let z = Y.message.content;
        if (typeof z === "string") {
            let w = hMA(z);
            if (w) K.push(w);
            else q.push(`[USER]
${z}`)
        } else if (Array.isArray(z)) {
            for (let w of z)
                if (w.type === "text") {
                    let H = hMA(w.text);
                    if (H) K.push(H);
                    else q.push(`[USER]
${w.text}`)
                } else if (w.type === "tool_result") {
                let H = typeof w.content === "string" ? w.content : Q1(w.content),
                    $ = hMA(H);
                if ($) K.push($);
                else q.push(`[TOOL RESULT: ${w.tool_use_id}]
${H}`)
            }
        }
    }
    return {
        contextParts: q,
        systemReminders: K
    }
}
// @from(Ln 242053, Col 0)
function hi7(A, q) {
    if (!FX()) return;
    let {
        content: K,
        truncated: Y
    } = up(`[USER PROMPT]
${q}`);
    A.setAttributes({
        new_context: K,
        ...Y && {
            new_context_truncated: !0,
            new_context_original_length: q.length
        }
    })
}
// @from(Ln 242069, Col 0)
function Ii7(A, q, K) {
    if (!FX()) return;
    if (q?.systemPrompt) {
        let Y = vL9(q.systemPrompt),
            z = q.systemPrompt.slice(0, 500);
        if (A.setAttribute("system_prompt_hash", Y), A.setAttribute("system_prompt_preview", z), A.setAttribute("system_prompt_length", q.systemPrompt.length), !a_6.has(Y)) {
            a_6.add(Y);
            let {
                content: w,
                truncated: H
            } = up(q.systemPrompt);
            zj("system_prompt", {
                system_prompt_hash: Y,
                system_prompt: w,
                system_prompt_length: String(q.systemPrompt.length),
                ...H && {
                    system_prompt_truncated: "true"
                }
            })
        }
    }
    if (q?.tools) try {
        let z = _A(q.tools).map((w) => {
            let H = Q1(w),
                $ = IMA(H);
            return {
                name: typeof w.name === "string" ? w.name : "unknown",
                hash: $,
                json: H
            }
        });
        A.setAttribute("tools", Q1(z.map(({
            name: w,
            hash: H
        }) => ({
            name: w,
            hash: H
        })))), A.setAttribute("tools_count", z.length);
        for (let {
                name: w,
                hash: H,
                json: $
            }
            of z)
            if (!a_6.has(`tool_${H}`)) {
                a_6.add(`tool_${H}`);
                let {
                    content: O,
                    truncated: _
                } = up($);
                zj("tool", {
                    tool_name: AK(w),
                    tool_hash: H,
                    tool: O,
                    ..._ && {
                        tool_truncated: "true"
                    }
                })
            }
    } catch {
        A.setAttribute("tools_parse_error", !0)
    }
    if (K && K.length > 0 && q?.querySource) {
        let Y = q.querySource,
            z = Ci7.get(Y),
            w = 0;
        if (z)
            for (let $ = 0; $ < K.length; $++) {
                let O = K[$];
                if (O && Si7(O) === z) {
                    w = $ + 1;
                    break
                }
            }
        let H = K.slice(w).filter(($) => $.type === "user");
        if (H.length > 0) {
            let {
                contextParts: $,
                systemReminders: O
            } = kL9(H);
            if ($.length > 0) {
                let J = $.join(`

---

`),
                    {
                        content: X,
                        truncated: D
                    } = up(J);
                A.setAttributes({
                    new_context: X,
                    new_context_message_count: H.length,
                    ...D && {
                        new_context_truncated: !0,
                        new_context_original_length: J.length
                    }
                })
            }
            if (O.length > 0) {
                let J = O.join(`

---

`),
                    {
                        content: X,
                        truncated: D
                    } = up(J);
                A.setAttributes({
                    system_reminders: X,
                    system_reminders_count: O.length,
                    ...D && {
                        system_reminders_truncated: !0,
                        system_reminders_original_length: J.length
                    }
                })
            }
            let _ = K[K.length - 1];
            if (_) Ci7.set(Y, Si7(_))
        }
    }
}
// @from(Ln 242193, Col 0)
function xi7(A, q) {
    if (!FX() || !q) return;
    if (q.modelOutput !== void 0) {
        let {
            content: K,
            truncated: Y
        } = up(q.modelOutput);
        if (A["response.model_output"] = K, Y) A["response.model_output_truncated"] = !0, A["response.model_output_original_length"] = q.modelOutput.length
    }
}
// @from(Ln 242204, Col 0)
function bi7(A, q, K) {
    if (!FX()) return;
    let {
        content: Y,
        truncated: z
    } = up(`[TOOL RESULT: ${q}]
${K}`);
    if (A.new_context = Y, z) A.new_context_truncated = !0, A.new_context_original_length = K.length
}
// @from(Ln 242213, Col 4)
a_6
// @from(Ln 242213, Col 9)
Ci7
// @from(Ln 242213, Col 14)
TL9 = 61440
// @from(Ln 242214, Col 4)
EL9
// @from(Ln 242215, Col 4)
s_6 = v(() => {
    hA();
    aa();
    U$();
    B6();
    m6();
    a_6 = new Set, Ci7 = new Map;
    EL9 = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/
})
// @from(Ln 242225, Col 0)
function Bi7(A) {
    let q = 0;
    for (let K = 0; K < A.length; K++) {
        let Y = A.charCodeAt(K);
        q = (q << 5) - q + Y, q = q & q
    }
    return Math.abs(q) || 1
}
// @from(Ln 242234, Col 0)
function mi7(A) {
    let q = ui7.get(A);
    if (q !== void 0) return q;
    return xMA++, ui7.set(A, xMA), xMA
}
// @from(Ln 242240, Col 0)
function t_6() {
    let A = ID() ?? U6(),
        q = g5() ?? "main",
        K = Dr(),
        Y = bMA.get(A);
    if (Y) return Y;
    let z = {
        agentId: A,
        agentName: q,
        parentAgentId: K,
        processId: A === U6() ? 1 : mi7(A),
        threadId: Bi7(q)
    };
    return bMA.set(A, z), z
}
// @from(Ln 242256, Col 0)
function sa() {
    return (Date.now() - LL9) * 1000
}
// @from(Ln 242260, Col 0)
function e_6() {
    return `span_${++RL9}`
}
// @from(Ln 242264, Col 0)
function Fi7() {
    let A = process.env.CLAUDE_CODE_PERFETTO_TRACE;
    h(`[Perfetto] initializePerfettoTracing called, env value: ${A}`)
}
// @from(Ln 242269, Col 0)
function yL9(A) {
    if (!Rh) return;
    if (lD.push({
            name: "process_name",
            cat: "__metadata",
            ph: "M",
            ts: 0,
            pid: A.processId,
            tid: 0,
            args: {
                name: A.agentName
            }
        }), lD.push({
            name: "thread_name",
            cat: "__metadata",
            ph: "M",
            ts: 0,
            pid: A.processId,
            tid: A.threadId,
            args: {
                name: A.agentName
            }
        }), A.parentAgentId) lD.push({
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
// @from(Ln 242304, Col 0)
function Bp() {
    return Rh
}
// @from(Ln 242308, Col 0)
function AJ6(A, q, K) {
    if (!Rh) return;
    let Y = {
        agentId: A,
        agentName: q,
        parentAgentId: K,
        processId: mi7(A),
        threadId: Bi7(q)
    };
    bMA.set(A, Y), yL9(Y)
}
// @from(Ln 242320, Col 0)
function Qi7(A) {
    if (!Rh) return "";
    let q = e_6(),
        K = t_6();
    return QX.set(q, {
        name: "API Call",
        category: "api",
        startTime: sa(),
        agentInfo: K,
        args: {
            model: A.model,
            prompt_tokens: A.promptTokens,
            message_id: A.messageId,
            is_speculative: A.isSpeculative ?? !1,
            query_source: A.querySource
        }
    }), lD.push({
        name: "API Call",
        cat: "api",
        ph: "B",
        ts: QX.get(q).startTime,
        pid: K.processId,
        tid: K.threadId,
        args: QX.get(q).args
    }), q
}
// @from(Ln 242347, Col 0)
function gi7(A, q) {
    if (!Rh || !A) return;
    let K = QX.get(A);
    if (!K) return;
    let Y = sa(),
        z = Y - K.startTime,
        w = q.promptTokens ?? K.args.prompt_tokens,
        H = q.ttftMs,
        $ = q.ttltMs,
        O = q.outputTokens,
        _ = q.cacheReadTokens,
        J = H !== void 0 && w !== void 0 && H > 0 ? Math.round(w / (H / 1000) * 100) / 100 : void 0,
        X = $ !== void 0 && H !== void 0 ? $ - H : void 0,
        D = X !== void 0 && O !== void 0 && X > 0 ? Math.round(O / (X / 1000) * 100) / 100 : void 0,
        j = _ !== void 0 && w !== void 0 && w > 0 ? Math.round(_ / w * 1e4) / 100 : void 0,
        M = q.requestSetupMs,
        P = q.attemptStartTimes,
        W = {
            ...K.args,
            ttft_ms: H,
            ttlt_ms: $,
            prompt_tokens: w,
            output_tokens: O,
            cache_read_tokens: _,
            cache_creation_tokens: q.cacheCreationTokens,
            message_id: q.messageId ?? K.args.message_id,
            success: q.success ?? !0,
            error: q.error,
            duration_ms: z / 1000,
            request_setup_ms: M,
            itps: J,
            otps: D,
            cache_hit_rate_pct: j
        },
        G = M !== void 0 && M > 0 ? M * 1000 : 0;
    if (G > 0) {
        let f = K.startTime + G;
        if (lD.push({
                name: "Request Setup",
                cat: "api,setup",
                ph: "B",
                ts: K.startTime,
                pid: K.agentInfo.processId,
                tid: K.agentInfo.threadId,
                args: {
                    request_setup_ms: M,
                    attempt_count: P?.length ?? 1
                }
            }), P && P.length > 1) {
            let Z = P[0];
            for (let N = 0; N < P.length - 1; N++) {
                let T = K.startTime + (P[N] - Z) * 1000,
                    k = K.startTime + (P[N + 1] - Z) * 1000;
                lD.push({
                    name: `Attempt ${N+1} (retry)`,
                    cat: "api,retry",
                    ph: "B",
                    ts: T,
                    pid: K.agentInfo.processId,
                    tid: K.agentInfo.threadId,
                    args: {
                        attempt: N + 1
                    }
                }), lD.push({
                    name: `Attempt ${N+1} (retry)`,
                    cat: "api,retry",
                    ph: "E",
                    ts: k,
                    pid: K.agentInfo.processId,
                    tid: K.agentInfo.threadId
                })
            }
        }
        lD.push({
            name: "Request Setup",
            cat: "api,setup",
            ph: "E",
            ts: f,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId
        })
    }
    if (H !== void 0) {
        let f = K.startTime + G,
            Z = f + H * 1000;
        lD.push({
            name: "First Token",
            cat: "api,ttft",
            ph: "B",
            ts: f,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId,
            args: {
                ttft_ms: H,
                prompt_tokens: w,
                itps: J,
                cache_hit_rate_pct: j
            }
        }), lD.push({
            name: "First Token",
            cat: "api,ttft",
            ph: "E",
            ts: Z,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId
        });
        let N = $ !== void 0 ? $ - H - G / 1000 : void 0;
        if (N !== void 0 && N > 0) lD.push({
            name: "Sampling",
            cat: "api,sampling",
            ph: "B",
            ts: Z,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId,
            args: {
                sampling_ms: N,
                output_tokens: O,
                otps: D
            }
        }), lD.push({
            name: "Sampling",
            cat: "api,sampling",
            ph: "E",
            ts: Z + N * 1000,
            pid: K.agentInfo.processId,
            tid: K.agentInfo.threadId
        })
    }
    lD.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: Y,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: W
    }), QX.delete(A)
}
// @from(Ln 242486, Col 0)
function Ui7(A, q) {
    if (!Rh) return "";
    let K = e_6(),
        Y = t_6();
    return QX.set(K, {
        name: `Tool: ${A}`,
        category: "tool",
        startTime: sa(),
        agentInfo: Y,
        args: {
            tool_name: A,
            ...q
        }
    }), lD.push({
        name: `Tool: ${A}`,
        cat: "tool",
        ph: "B",
        ts: QX.get(K).startTime,
        pid: Y.processId,
        tid: Y.threadId,
        args: QX.get(K).args
    }), K
}
// @from(Ln 242510, Col 0)
function pi7(A, q) {
    if (!Rh || !A) return;
    let K = QX.get(A);
    if (!K) return;
    let Y = sa(),
        z = Y - K.startTime,
        w = {
            ...K.args,
            success: q?.success ?? !0,
            error: q?.error,
            result_tokens: q?.resultTokens,
            duration_ms: z / 1000
        };
    lD.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: Y,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: w
    }), QX.delete(A)
}
// @from(Ln 242534, Col 0)
function di7(A) {
    if (!Rh) return "";
    let q = e_6(),
        K = t_6();
    return QX.set(q, {
        name: "Waiting for User Input",
        category: "user_input",
        startTime: sa(),
        agentInfo: K,
        args: {
            context: A
        }
    }), lD.push({
        name: "Waiting for User Input",
        cat: "user_input",
        ph: "B",
        ts: QX.get(q).startTime,
        pid: K.processId,
        tid: K.threadId,
        args: QX.get(q).args
    }), q
}
// @from(Ln 242557, Col 0)
function ci7(A, q) {
    if (!Rh || !A) return;
    let K = QX.get(A);
    if (!K) return;
    let Y = sa(),
        z = Y - K.startTime,
        w = {
            ...K.args,
            decision: q?.decision,
            source: q?.source,
            duration_ms: z / 1000
        };
    lD.push({
        name: K.name,
        cat: K.category,
        ph: "E",
        ts: Y,
        pid: K.agentInfo.processId,
        tid: K.agentInfo.threadId,
        args: w
    }), QX.delete(A)
}
// @from(Ln 242580, Col 0)
function li7(A) {
    if (!Rh) return "";
    let q = e_6(),
        K = t_6();
    return QX.set(q, {
        name: "Interaction",
        category: "interaction",
        startTime: sa(),
        agentInfo: K,
        args: {
            user_prompt_length: A?.length
        }
    }), lD.push({
        name: "Interaction",
        cat: "interaction",
        ph: "B",
        ts: QX.get(q).startTime,
        pid: K.processId,
        tid: K.threadId,
        args: QX.get(q).args
    }), q
}
// @from(Ln 242603, Col 0)
function ii7(A) {
    if (!Rh || !A) return;
    let q = QX.get(A);
    if (!q) return;
    let K = sa(),
        Y = K - q.startTime;
    lD.push({
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
    }), QX.delete(A)
}
// @from(Ln 242622, Col 4)
Rh = !1
// @from(Ln 242623, Col 4)
lD
// @from(Ln 242623, Col 8)
QX
// @from(Ln 242623, Col 12)
bMA
// @from(Ln 242623, Col 17)
LL9 = 0
// @from(Ln 242624, Col 4)
RL9 = 0
// @from(Ln 242625, Col 4)
xMA = 1
// @from(Ln 242626, Col 4)
ui7
// @from(Ln 242627, Col 4)
MB1 = v(() => {
    hA();
    B6();
    m6();
    Cz();
    Tz();
    Z6();
    lD = [], QX = new Map, bMA = new Map, ui7 = new Map
})
// @from(Ln 242640, Col 0)
function gX(A) {
    return A.spanContext().spanId || ""
}
// @from(Ln 242644, Col 0)
function uMA() {
    {
        let A = process.env.CLAUDE_CODE_ENHANCED_TELEMETRY_BETA ?? process.env.ENABLE_ENHANCED_TELEMETRY_BETA;
        if (J6(A)) return !0;
        if (FY(A)) return !1;
        return x8("enhanced_telemetry_beta", !1)
    }
    return !1
}
// @from(Ln 242654, Col 0)
function yh() {
    return uMA() || FX()
}
// @from(Ln 242658, Col 0)
function mW() {
    return Hw.trace.getTracer("com.anthropic.claude_code.tracing", "1.0.0")
}
// @from(Ln 242662, Col 0)
function ij1(A, q = {}) {
    return {
        ...Uj1(),
        "span.type": A,
        ...q
    }
}
// @from(Ln 242670, Col 0)
function oi7(A) {
    let q = Bp() ? li7(A) : void 0;
    if (!yh()) {
        if (q) {
            let O = Hw.trace.getActiveSpan() || mW().startSpan("dummy"),
                _ = gX(O);
            return xw.set(_, {
                span: O,
                startTime: Date.now(),
                attributes: {},
                perfettoSpanId: q
            }), ta.enterWith(O), O
        }
        return Hw.trace.getActiveSpan() || mW().startSpan("dummy")
    }
    let K = mW(),
        z = J6(process.env.OTEL_LOG_USER_PROMPTS) ? A : "<REDACTED>";
    ni7++;
    let w = ij1("interaction", {
            user_prompt: z,
            user_prompt_length: A.length,
            "interaction.sequence": ni7
        }),
        H = K.startSpan("claude_code.interaction", {
            attributes: w
        });
    hi7(H, A);
    let $ = gX(H);
    return xw.set($, {
        span: H,
        startTime: Date.now(),
        attributes: w,
        perfettoSpanId: q
    }), ta.enterWith(H), H
}
// @from(Ln 242706, Col 0)
function PB1() {
    let A = ta.getStore();
    if (!A) return;
    let q = gX(A),
        K = xw.get(q);
    if (!K) return;
    if (K.ended) return;
    if (K.perfettoSpanId) ii7(K.perfettoSpanId);
    if (!yh()) {
        K.ended = !0, xw.delete(q), ta.exit(() => {});
        return
    }
    let Y = Date.now() - K.startTime;
    K.span.setAttributes({
        "interaction.duration_ms": Y
    }), K.span.end(), K.ended = !0, xw.delete(q), ta.exit(() => {})
}
// @from(Ln 242724, Col 0)
function ai7(A, q, K) {
    let Y = Bp() ? Qi7({
        model: A,
        querySource: q?.querySource,
        messageId: void 0
    }) : void 0;
    if (!yh()) {
        if (Y) {
            let J = Hw.trace.getActiveSpan() || mW().startSpan("dummy"),
                X = gX(J);
            return xw.set(X, {
                span: J,
                startTime: Date.now(),
                attributes: {
                    model: A
                },
                perfettoSpanId: Y
            }), J
        }
        return Hw.trace.getActiveSpan() || mW().startSpan("dummy")
    }
    let z = mW(),
        w = ta.getStore(),
        H = ij1("llm_request", {
            model: A,
            "llm_request.context": w ? "interaction" : "standalone"
        }),
        $ = w ? Hw.trace.setSpan(Hw.context.active(), w) : Hw.context.active(),
        O = z.startSpan("claude_code.llm_request", {
            attributes: H
        }, $);
    if (q?.querySource) O.setAttribute("query_source", q.querySource);
    Ii7(O, q, K);
    let _ = gX(O);
    return xw.set(_, {
        span: O,
        startTime: Date.now(),
        attributes: H,
        perfettoSpanId: Y
    }), O
}
// @from(Ln 242766, Col 0)
function BMA(A, q) {
    let K;
    if (A) {
        let w = gX(A);
        K = xw.get(w)
    } else
        for (let [, w] of Array.from(xw.entries()).reverse())
            if (w.attributes["span.type"] === "llm_request" || w.attributes.model) {
                K = w;
                break
            } if (!K) return;
    let Y = Date.now() - K.startTime;
    if (K.perfettoSpanId) gi7(K.perfettoSpanId, {
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
    if (!yh()) {
        xw.delete(gX(K.span));
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
        xi7(z, q)
    }
    K.span.setAttributes(z), K.span.end(), xw.delete(gX(K.span))
}
// @from(Ln 242813, Col 0)
function si7(A, q) {
    let K = Bp() ? Ui7(A, q) : void 0;
    if (!yh()) {
        if (K) {
            let _ = Hw.trace.getActiveSpan() || mW().startSpan("dummy"),
                J = gX(_);
            return xw.set(J, {
                span: _,
                startTime: Date.now(),
                attributes: {
                    "span.type": "tool",
                    tool_name: A
                },
                perfettoSpanId: K
            }), ea.enterWith(_), _
        }
        return Hw.trace.getActiveSpan() || mW().startSpan("dummy")
    }
    let Y = mW(),
        z = ta.getStore(),
        w = ij1("tool", {
            tool_name: A,
            ...q
        }),
        H = z ? Hw.trace.setSpan(Hw.context.active(), z) : Hw.context.active(),
        $ = Y.startSpan("claude_code.tool", {
            attributes: w
        }, H),
        O = gX($);
    return xw.set(O, {
        span: $,
        startTime: Date.now(),
        attributes: w,
        perfettoSpanId: K
    }), ea.enterWith($), $
}
// @from(Ln 242850, Col 0)
function ti7() {
    let A = Bp() ? di7("tool_permission") : void 0;
    if (!yh()) {
        if (A) {
            let $ = Hw.trace.getActiveSpan() || mW().startSpan("dummy"),
                O = gX($);
            return xw.set(O, {
                span: $,
                startTime: Date.now(),
                attributes: {
                    "span.type": "tool.blocked_on_user"
                },
                perfettoSpanId: A
            }), $
        }
        return Hw.trace.getActiveSpan() || mW().startSpan("dummy")
    }
    let q = mW(),
        K = ea.getStore(),
        Y = ij1("tool.blocked_on_user"),
        z = K ? Hw.trace.setSpan(Hw.context.active(), K) : Hw.context.active(),
        w = q.startSpan("claude_code.tool.blocked_on_user", {
            attributes: Y
        }, z),
        H = gX(w);
    return xw.set(H, {
        span: w,
        startTime: Date.now(),
        attributes: Y,
        perfettoSpanId: A
    }), w
}
// @from(Ln 242883, Col 0)
function mMA(A, q) {
    let K;
    for (let [, H] of Array.from(xw.entries()).reverse())
        if (H.attributes["span.type"] === "tool.blocked_on_user") {
            K = H;
            break
        } if (!K) return;
    if (K.perfettoSpanId) ci7(K.perfettoSpanId, {
        decision: A,
        source: q
    });
    if (!yh()) {
        let H = gX(K.span);
        xw.delete(H);
        return
    }
    let z = {
        duration_ms: Date.now() - K.startTime
    };
    if (A) z.decision = A;
    if (q) z.source = q;
    K.span.setAttributes(z), K.span.end();
    let w = gX(K.span);
    xw.delete(w)
}
// @from(Ln 242909, Col 0)
function ei7() {
    if (!yh()) return Hw.trace.getActiveSpan() || mW().startSpan("dummy");
    let A = mW(),
        q = ea.getStore(),
        K = ij1("tool.execution"),
        Y = q ? Hw.trace.setSpan(Hw.context.active(), q) : Hw.context.active(),
        z = A.startSpan("claude_code.tool.execution", {
            attributes: K
        }, Y),
        w = gX(z);
    return xw.set(w, {
        span: z,
        startTime: Date.now(),
        attributes: K
    }), z
}
// @from(Ln 242926, Col 0)
function FMA(A) {
    if (!yh()) return;
    let q;
    for (let [, w] of Array.from(xw.entries()).reverse())
        if (w.attributes["span.type"] === "tool.execution") {
            q = w;
            break
        } if (!q) return;
    let Y = {
        duration_ms: Date.now() - q.startTime
    };
    if (A) {
        if (A.success !== void 0) Y.success = A.success;
        if (A.error !== void 0) Y.error = A.error
    }
    q.span.setAttributes(Y), q.span.end();
    let z = gX(q.span);
    xw.delete(z)
}
// @from(Ln 242946, Col 0)
function qJ6(A, q) {
    let K;
    for (let [, H] of Array.from(xw.entries()).reverse())
        if (H.attributes["span.type"] === "tool") {
            K = H;
            break
        } if (!K) return;
    if (K.perfettoSpanId) pi7(K.perfettoSpanId, {
        success: !0,
        resultTokens: q
    });
    if (!yh()) {
        let H = gX(K.span);
        xw.delete(H), ea.exit(() => {});
        return
    }
    let z = {
        duration_ms: Date.now() - K.startTime
    };
    if (A) {
        let H = K.attributes.tool_name || "unknown";
        bi7(z, H, A)
    }
    if (q !== void 0) z.result_tokens = q;
    K.span.setAttributes(z), K.span.end();
    let w = gX(K.span);
    xw.delete(w), ea.exit(() => {})
}
// @from(Ln 242975, Col 0)
function CL9() {
    return J6(process.env.OTEL_LOG_TOOL_CONTENT)
}
// @from(Ln 242979, Col 0)
function An7(A, q) {
    if (!yh() || !CL9()) return;
    let K = ea.getStore();
    if (!K) return;
    let Y = {};
    for (let [z, w] of Object.entries(q))
        if (typeof w === "string") {
            let {
                content: H,
                truncated: $
            } = up(w);
            if (Y[z] = H, $) Y[`${z}_truncated`] = !0, Y[`${z}_original_length`] = w.length
        } else Y[z] = w;
    K.addEvent(A, Y)
}
// @from(Ln 242995, Col 0)
function qn7(A, q, K, Y) {
    if (!FX()) return Hw.trace.getActiveSpan() || mW().startSpan("dummy");
    let z = mW(),
        w = ea.getStore() || ta.getStore(),
        H = ij1("hook", {
            hook_event: A,
            hook_name: q,
            num_hooks: K,
            hook_definitions: Y
        }),
        $ = w ? Hw.trace.setSpan(Hw.context.active(), w) : Hw.context.active(),
        O = z.startSpan("claude_code.hook", {
            attributes: H
        }, $),
        _ = gX(O);
    return xw.set(_, {
        span: O,
        startTime: Date.now(),
        attributes: H
    }), O
}
// @from(Ln 243017, Col 0)
function Kn7(A, q) {
    if (!FX()) return;
    let K = gX(A),
        Y = xw.get(K);
    if (!Y) return;
    let w = {
        duration_ms: Date.now() - Y.startTime
    };
    if (q) {
        if (q.numSuccess !== void 0) w.num_success = q.numSuccess;
        if (q.numBlocking !== void 0) w.num_blocking = q.numBlocking;
        if (q.numNonBlockingError !== void 0) w.num_non_blocking_error = q.numNonBlockingError;
        if (q.numCancelled !== void 0) w.num_cancelled = q.numCancelled
    }
    Y.span.setAttributes(w), Y.span.end(), xw.delete(K)
}
// @from(Ln 243033, Col 4)
Hw
// @from(Ln 243033, Col 8)
ta
// @from(Ln 243033, Col 12)
ea
// @from(Ln 243033, Col 16)
xw
// @from(Ln 243033, Col 20)
ni7 = 0
// @from(Ln 243034, Col 4)
As = v(() => {
    U4();
    U_6();
    hA();
    s_6();
    MB1();
    Hw = o(Fq(), 1), ta = new ri7, ea = new ri7, xw = new Map
})
// @from(Ln 243042, Col 4)
LGw
// @from(Ln 243042, Col 9)
KJ6
// @from(Ln 243043, Col 4)
Yn7 = v(() => {
    i7();
    LGw = y4.enum(["allow", "deny", "ask"]), KJ6 = y4.object({
        toolName: y4.string(),
        ruleContent: y4.string().optional()
    })
})
// @from(Ln 243050, Col 4)
nj1
// @from(Ln 243050, Col 9)
YJ6
// @from(Ln 243051, Col 4)
QMA = v(() => {
    i7();
    Yn7();
    oj();
    nj1 = y4.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"]), YJ6 = y4.discriminatedUnion("type", [y4.object({
        type: y4.literal("addRules"),
        rules: y4.array(KJ6),
        behavior: y4.enum(["allow", "deny", "ask"]),
        destination: nj1
    }), y4.object({
        type: y4.literal("replaceRules"),
        rules: y4.array(KJ6),
        behavior: y4.enum(["allow", "deny", "ask"]),
        destination: nj1
    }), y4.object({
        type: y4.literal("removeRules"),
        rules: y4.array(KJ6),
        behavior: y4.enum(["allow", "deny", "ask"]),
        destination: nj1
    }), y4.object({
        type: y4.literal("setMode"),
        mode: kw8,
        destination: nj1
    }), y4.object({
        type: y4.literal("addDirectories"),
        directories: y4.array(y4.string()),
        destination: nj1
    }), y4.object({
        type: y4.literal("removeDirectories"),
        directories: y4.array(y4.string()),
        destination: nj1
    })])
})
// @from(Ln 243085, Col 0)
function zn7(A) {
    return !(("async" in A) && A.async === !0)
}
// @from(Ln 243089, Col 0)
function SK1(A) {
    return "async" in A && A.async === !0
}
// @from(Ln 243092, Col 4)
SL9
// @from(Ln 243092, Col 9)
hL9
// @from(Ln 243092, Col 14)
zJ6
// @from(Ln 243093, Col 4)
gMA = v(() => {
    i7();
    sw1();
    QMA();
    SL9 = u.object({
        async: u.literal(!0),
        asyncTimeout: u.number().optional()
    }), hL9 = u.object({
        continue: u.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
        suppressOutput: u.boolean().describe("Hide stdout from transcript (default: false)").optional(),
        stopReason: u.string().describe("Message shown when continue is false").optional(),
        decision: u.enum(["approve", "block"]).optional(),
        reason: u.string().describe("Explanation for the decision").optional(),
        systemMessage: u.string().describe("Warning message shown to the user").optional(),
        hookSpecificOutput: u.union([u.object({
            hookEventName: u.literal("PreToolUse"),
            permissionDecision: u.enum(["allow", "deny", "ask"]).optional(),
            permissionDecisionReason: u.string().optional(),
            updatedInput: u.record(u.string(), u.unknown()).optional(),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("UserPromptSubmit"),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("SessionStart"),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("Setup"),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("SubagentStart"),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("PostToolUse"),
            additionalContext: u.string().optional(),
            updatedMCPToolOutput: u.unknown().describe("Updates the output for MCP tools").optional()
        }), u.object({
            hookEventName: u.literal("PostToolUseFailure"),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("Notification"),
            additionalContext: u.string().optional()
        }), u.object({
            hookEventName: u.literal("PermissionRequest"),
            decision: u.union([u.object({
                behavior: u.literal("allow"),
                updatedInput: u.record(u.string(), u.unknown()).optional(),
                updatedPermissions: u.array(YJ6).optional()
            }), u.object({
                behavior: u.literal("deny"),
                message: u.string().optional(),
                interrupt: u.boolean().optional()
            })])
        })]).optional()
    }), zJ6 = u.union([SL9, hL9])
})
// @from(Ln 243150, Col 0)
function fR(A, q) {
    let K = Aq();
    if (A.aborted || q?.aborted) return K.abort(), {
        signal: K.signal,
        cleanup: () => {}
    };
    let Y = () => {
        K.abort()
    };
    A.addEventListener("abort", Y), q?.addEventListener("abort", Y);
    let z = () => {
        A.removeEventListener("abort", Y), q?.removeEventListener("abort", Y)
    };
    return {
        signal: K.signal,
        cleanup: z
    }
}
// @from(Ln 243168, Col 4)
WB1 = v(() => {
    G2()
})
// @from(Ln 243172, Col 0)
function wn7(A) {
    if (pMA = A, A && UMA.length > 0)
        for (let q of UMA.splice(0)) A(q)
}
// @from(Ln 243177, Col 0)
function dMA(A) {
    if (pMA) pMA(A);
    else UMA.push(A)
}
// @from(Ln 243182, Col 0)
function wJ6(A) {
    return IL9.includes(A)
}
// @from(Ln 243186, Col 0)
function Hn7(A, q, K) {
    if (!wJ6(K)) return;
    dMA({
        type: "started",
        hookId: A,
        hookName: q,
        hookEvent: K
    })
}
// @from(Ln 243196, Col 0)
function xL9(A) {
    if (!wJ6(A.hookEvent)) return;
    if (!J6(process.env.CLAUDE_CODE_REMOTE)) return;
    dMA({
        type: "progress",
        ...A
    })
}
// @from(Ln 243205, Col 0)
function HJ6(A) {
    if (!wJ6(A.hookEvent)) return () => {};
    if (!J6(process.env.CLAUDE_CODE_REMOTE)) return () => {};
    let q = "",
        K = setInterval(() => {
            let {
                stdout: Y,
                stderr: z,
                output: w
            } = A.getOutput();
            if (w === q) return;
            q = w, xL9({
                hookId: A.hookId,
                hookName: A.hookName,
                hookEvent: A.hookEvent,
                stdout: Y,
                stderr: z,
                output: w
            })
        }, 1000);
    return K.unref(), () => clearInterval(K)
}
// @from(Ln 243228, Col 0)
function Ch(A) {
    let q = A.stdout || A.stderr || A.output;
    if (q) h(`Hook ${A.hookName} (${A.hookEvent}) ${A.outcome}:
${q}`);
    if (!wJ6(A.hookEvent)) return;
    dMA({
        type: "response",
        ...A
    })
}
// @from(Ln 243238, Col 4)
IL9
// @from(Ln 243238, Col 9)
UMA
// @from(Ln 243238, Col 14)
pMA = null
// @from(Ln 243239, Col 4)
$J6 = v(() => {
    hA();
    Z6();
    IL9 = ["SessionStart", "Setup"], UMA = []
})
// @from(Ln 243245, Col 0)
function $n7({
    processId: A,
    hookId: q,
    asyncResponse: K,
    hookName: Y,
    hookEvent: z,
    command: w,
    shellCommand: H,
    toolName: $
}) {
    let O = K.asyncTimeout || 15000;
    h(`Hooks: Registering async hook ${A} (${Y}) with timeout ${O}ms`);
    let _ = HJ6({
        hookId: q,
        hookName: Y,
        hookEvent: z,
        getOutput: () => {
            let J = VR.get(A);
            return J ? {
                stdout: J.stdout,
                stderr: J.stderr,
                output: J.output
            } : {
                stdout: "",
                stderr: "",
                output: ""
            }
        }
    });
    VR.set(A, {
        processId: A,
        hookId: q,
        hookName: Y,
        hookEvent: z,
        toolName: $,
        command: w,
        startTime: Date.now(),
        timeout: O,
        stdout: "",
        stderr: "",
        output: "",
        responseAttachmentSent: !1,
        shellCommand: H,
        stopProgressInterval: _
    })
}
// @from(Ln 243292, Col 0)
function On7(A, q) {
    let K = VR.get(A);
    if (K) h(`Hooks: Adding stdout to ${A}: ${q.substring(0,50)}...`), K.stdout += q, K.output += q;
    else h(`Hooks: Attempted to add output to unknown process ${A}`)
}
// @from(Ln 243298, Col 0)
function _n7(A, q) {
    let K = VR.get(A);
    if (K) h(`Hooks: Adding stderr to ${A}: ${q.substring(0,50)}...`), K.stderr += q, K.output += q;
    else h(`Hooks: Attempted to add stderr to unknown process ${A}`)
}
// @from(Ln 243304, Col 0)
function cMA(A, q, K) {
    A.stopProgressInterval(), A.shellCommand?.cleanup(), Ch({
        hookId: A.hookId,
        hookName: A.hookName,
        hookEvent: A.hookEvent,
        output: A.output,
        stdout: A.stdout,
        stderr: A.stderr,
        exitCode: q,
        outcome: K
    })
}
// @from(Ln 243316, Col 0)
async function Jn7() {
    let A = [],
        q = VR.size;
    h(`Hooks: Found ${q} total hooks in registry`);
    let K = [];
    for (let Y of VR.values()) {
        if (h(`Hooks: Checking hook ${Y.processId} (${Y.hookName}) - attachmentSent: ${Y.responseAttachmentSent}, stdout length: ${Y.stdout.length}`), !Y.shellCommand) {
            h(`Hooks: Hook ${Y.processId} has no shell command, removing from registry`), Y.stopProgressInterval(), K.push(Y.processId);
            continue
        }
        if (h(`Hooks: Hook shell status ${Y.shellCommand.status}`), Y.shellCommand.status === "killed") {
            h(`Hooks: Hook ${Y.processId} is ${Y.shellCommand.status}, removing from registry`), Y.stopProgressInterval(), Y.shellCommand.cleanup(), K.push(Y.processId);
            continue
        }
        if (Y.shellCommand.status !== "completed") continue;
        if (Y.responseAttachmentSent || !Y.stdout.trim()) {
            h(`Hooks: Skipping hook ${Y.processId} - already delivered/sent or no stdout`), Y.stopProgressInterval(), K.push(Y.processId);
            continue
        }
        let z = Y.stdout.split(`
`);
        h(`Hooks: Processing ${z.length} lines of stdout for ${Y.processId}`);
        let H = (await Y.shellCommand.result).code,
            $ = {};
        for (let O of z)
            if (O.trim().startsWith("{")) {
                h(`Hooks: Found JSON line: ${O.trim().substring(0,100)}...`);
                try {
                    let _ = _A(O.trim());
                    if (!("async" in _)) {
                        h(`Hooks: Found sync response from ${Y.processId}: ${Q1(_)}`), $ = _;
                        break
                    }
                } catch {
                    h(`Hooks: Failed to parse JSON from ${Y.processId}: ${O.trim()}`)
                }
            } if (A.push({
                processId: Y.processId,
                response: $,
                hookName: Y.hookName,
                hookEvent: Y.hookEvent,
                toolName: Y.toolName,
                stdout: Y.stdout,
                stderr: Y.stderr,
                exitCode: H
            }), Y.responseAttachmentSent = !0, cMA(Y, H, H === 0 ? "success" : "error"), VR.delete(Y.processId), Y.hookEvent === "SessionStart") h(`Invalidating session env cache after SessionStart hook ${Y.processId} completed`), Id7()
    }
    for (let Y of K) VR.delete(Y);
    return h(`Hooks: checkForNewResponses returning ${A.length} responses`), A
}
// @from(Ln 243367, Col 0)
function Xn7(A) {
    for (let q of A) {
        let K = VR.get(q);
        if (K && K.responseAttachmentSent) h(`Hooks: Removing delivered hook ${q}`), K.stopProgressInterval(), VR.delete(q)
    }
}
// @from(Ln 243373, Col 0)
async function lMA() {
    for (let A of VR.values())
        if (A.shellCommand?.status === "completed") {
            let q = await A.shellCommand.result;
            cMA(A, q.code, q.code === 0 ? "success" : "error")
        } else {
            if (A.shellCommand && A.shellCommand.status !== "killed") A.shellCommand.kill();
            cMA(A, 1, "cancelled")
        } VR.clear()
}
// @from(Ln 243383, Col 4)
VR
// @from(Ln 243384, Col 4)
OJ6 = v(() => {
    Z6();
    g_6();
    m6();
    $J6();
    VR = new Map
})
// @from(Ln 243391, Col 0)
async function Dn7(A) {
    let q;
    do q = await A.next(); while (!q.done);
    return q.value
}
// @from(Ln 243396, Col 0)
async function* _J6(A, q = 1 / 0) {
    let K = (w) => {
            let H = w.next().then(({
                done: $,
                value: O
            }) => ({
                done: $,
                value: O,
                generator: w,
                promise: H
            }));
            return H
        },
        Y = [...A],
        z = new Set;
    while (z.size < q && Y.length > 0) {
        let w = Y.shift();
        z.add(K(w))
    }
    while (z.size > 0) {
        let {
            done: w,
            value: H,
            generator: $,
            promise: O
        } = await Promise.race(z);
        if (z.delete(O), !w) {
            if (z.add(K($)), H !== void 0) yield H
        } else if (Y.length > 0) {
            let _ = Y.shift();
            z.add(K(_))
        }
    }
}
// @from(Ln 243430, Col 0)
async function JJ6(A) {
    let q = [];
    for await (let K of A) q.push(K);
    return q
}
// @from(Ln 243435, Col 0)
async function* iMA(A) {
    for (let q of A) yield q
}
// @from(Ln 243438, Col 4)
iGw
// @from(Ln 243439, Col 4)
hK1 = v(() => {
    iGw = Symbol("NO_VALUE")
})
// @from(Ln 243443, Col 0)
function XJ6(A, q) {
    return Ej1(A, q)
}
// @from(Ln 243447, Col 0)
function jn7() {
    return {
        ...fjA,
        inputSchema: GB1,
        inputJSONSchema: {
            type: "object",
            properties: {
                ok: {
                    type: "boolean",
                    description: "Whether the condition was met"
                },
                reason: {
                    type: "string",
                    description: "Reason, if the condition was not met"
                }
            },
            required: ["ok"],
            additionalProperties: !1
        },
        async prompt() {
            return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response."
        }
    }
}
// @from(Ln 243472, Col 0)
function DJ6(A, q) {
    Pw6(A, q, "Stop", "", (K) => Mn7(K, cD), `You MUST call the ${cD} tool to complete this request. Call this tool now.`, {
        timeout: 5000
    })
}
// @from(Ln 243477, Col 4)
GB1
// @from(Ln 243478, Col 4)
jJ6 = v(() => {
    i7();
    nB();
    eU();
    N8();
    bu1();
    GB1 = u.object({
        ok: u.boolean().describe("Whether the condition was met"),
        reason: u.string().describe("Reason, if the condition was not met").optional()
    })
})
// @from(Ln 243492, Col 0)
async function Pn7(A, q, K, Y, z, w, H, $) {
    let O = $ || `hook-${bL9()}`;
    try {
        let _ = XJ6(A.prompt, Y);
        h(`Hooks: Processing prompt hook with prompt: ${_}`);
        let J = c6({
                content: _
            }),
            X = H && H.length > 0 ? [...H, J] : [J];
        h(`Hooks: Querying model with ${X.length} messages`);
        let D = A.timeout ? A.timeout * 1000 : 30000,
            j = Aq(),
            M = setTimeout(() => {
                j.abort()
            }, D),
            {
                signal: P,
                cleanup: W
            } = fR(z, j.signal);
        try {
            let G = await mp({
                messages: X,
                systemPrompt: [`You are evaluating a hook in Claude Code.

Your response must be a JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}`],
                maxThinkingTokens: 0,
                tools: w.options.tools,
                signal: P,
                options: {
                    async getToolPermissionContext() {
                        return (await w.getAppState()).toolPermissionContext
                    },
                    model: A.model ?? _J(),
                    toolChoice: void 0,
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    agents: [],
                    querySource: "hook_prompt",
                    mcpTools: [],
                    agentId: w.agentId,
                    outputFormat: {
                        type: "json_schema",
                        schema: {
                            type: "object",
                            properties: {
                                ok: {
                                    type: "boolean"
                                },
                                reason: {
                                    type: "string"
                                }
                            },
                            required: ["ok"],
                            additionalProperties: !1
                        }
                    }
                }
            });
            clearTimeout(M), W();
            let f = G.message.content.filter((k) => k.type === "text").map((k) => k.text).join("");
            w.setResponseLength((k) => k + f.length);
            let Z = f.trim();
            h(`Hooks: Model response: ${Z}`);
            let N = j9(Z);
            if (!N) return h(`Hooks: error parsing response as JSON: ${Z}`), {
                hook: A,
                outcome: "non_blocking_error",
                message: kq({
                    type: "hook_non_blocking_error",
                    hookName: q,
                    toolUseID: O,
                    hookEvent: K,
                    stderr: "JSON validation failed",
                    stdout: Z,
                    exitCode: 1
                })
            };
            let T = GB1.safeParse(N);
            if (!T.success) return h(`Hooks: model response does not conform to expected schema: ${T.error.message}`), {
                hook: A,
                outcome: "non_blocking_error",
                message: kq({
                    type: "hook_non_blocking_error",
                    hookName: q,
                    toolUseID: O,
                    hookEvent: K,
                    stderr: `Schema validation failed: ${T.error.message}`,
                    stdout: Z,
                    exitCode: 1
                })
            };
            if (!T.data.ok) return h(`Hooks: Prompt hook condition was not met: ${T.data.reason}`), {
                hook: A,
                outcome: "blocking",
                blockingError: {
                    blockingError: `Prompt hook condition was not met: ${T.data.reason}`,
                    command: A.prompt
                },
                preventContinuation: !0,
                stopReason: T.data.reason
            };
            return h("Hooks: Prompt hook condition was met"), {
                hook: A,
                outcome: "success",
                message: kq({
                    type: "hook_success",
                    hookName: q,
                    toolUseID: O,
                    hookEvent: K,
                    content: "Condition met"
                })
            }
        } catch (G) {
            if (clearTimeout(M), W(), P.aborted) return {
                hook: A,
                outcome: "cancelled"
            };
            throw G
        }
    } catch (_) {
        let J = _ instanceof Error ? _.message : String(_);
        return h(`Hooks: Prompt hook error: ${J}`), {
            hook: A,
            outcome: "non_blocking_error",
            message: kq({
                type: "hook_non_blocking_error",
                hookName: q,
                toolUseID: O,
                hookEvent: K,
                stderr: `Error executing prompt hook: ${J}`,
                stdout: "",
                exitCode: 1
            })
        }
    }
}
// @from(Ln 243630, Col 4)
Wn7 = v(() => {
    Z6();
    N8();
    yw();
    e7();
    WB1();
    G2();
    FW();
    AH();
    jJ6()
})
// @from(Ln 243642, Col 0)
function uL9(A) {
    let {
        tools: q,
        disallowedTools: K
    } = A, Y = q && q.length > 0, z = K && K.length > 0;
    if (Y && z) {
        let w = new Set(K),
            H = q.filter(($) => !w.has($));
        if (H.length === 0) return "None";
        return H.join(", ")
    } else if (Y) return q.join(", ");
    else if (z) return `All tools except ${K.join(", ")}`;
    return "All tools"
}
// @from(Ln 243656, Col 0)
async function Gn7(A, q, K) {
    let z = (K ? A.filter((H) => K.includes(H.agentType)) : A).map((H) => {
            let $ = "";
            if (H?.forkContext) $ = "Properties: " + (H?.forkContext ? "access to current context; " : "");
            let O = uL9(H);
            return `- ${H.agentType}: ${H.whenToUse} (${$}Tools: ${O})`
        }).join(`
`),
        w = `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${fK} tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

Available agent types and the tools they have access to:
${z}

When using the ${fK} tool, you must specify a subagent_type parameter to select which agent type to use.`;
    if (q) return w;
    return `${w}

When NOT to use the ${fK} tool:
- If you want to read a specific file path, use the ${Jq} or ${Jz} tool instead of the ${fK} tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the ${Jz} tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the ${Jq} tool instead of the ${fK} tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above


Usage notes:
- Always include a short description (3-5 words) summarizing what the agent will do${dK()!=="pro"?`
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses`:""}
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.${!J6(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)&&!MM()?`
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, the tool result will include an output_file path. To check on the agent's progress or retrieve its results, use the ${Jq} tool to read the output file, or use ${h4} with \`tail\` to see recent output. You can continue working while background agents run.`:""}
- Agents can be resumed using the \`resume\` parameter by passing the agent ID from a previous invocation. When resumed, the agent continues with its full previous context preserved. When NOT resuming, each invocation starts fresh and you should provide a detailed task description with all necessary context.
- When the agent is done, it will return a single message back to you along with its agent ID. You can use this ID to resume the agent later if needed for follow-up work.
- Provide clear, detailed prompts so the agent can work autonomously and return exactly the information you need.
- Agents with "access to current context" can see the full conversation history before the tool call. When using these agents, you can write concise prompts that reference earlier context (e.g., "investigate the error discussed above") instead of repeating information. The agent will receive all prior messages and understand the context.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${rj1.name} tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.${MM()?`
- The run_in_background, name, team_name, and mode parameters are not available in this context. Only synchronous subagents are supported.`:""}

Example usage:

<example_agent_descriptions>
"test-runner": use this agent after you are done writing code to run tests
"greeting-responder": use this agent to respond to user greetings with a friendly joke
</example_agent_descriptions>

<example>
user: "Please write a function that checks if a number is prime"
assistant: Sure let me write a function that checks if a number is prime
assistant: First let me use the ${f5} tool to write a function that checks if a number is prime
assistant: I'm going to use the ${f5} tool to write the following code:
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
assistant: Now let me use the test-runner agent to run the tests
assistant: Uses the ${rj1.name} tool to launch the test-runner agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the ${rj1.name} tool to launch the greeting-responder agent"
</example>
`
}
// @from(Ln 243734, Col 4)
Zn7 = v(() => {
    MJ6();
    _H();
    SD();
    J7();
    hA();
    Yv()
})
// @from(Ln 243743, Col 0)
function IK1(A) {
    if (A === "general-purpose") return;
    let K = fn1().get(A);
    if (K && cO.includes(K)) return lO[K];
    return
}
// @from(Ln 243750, Col 0)
function xK1(A, q) {
    let K = fn1();
    if (!q) {
        K.delete(A);
        return
    }
    if (cO.includes(q)) K.set(A, q)
}
// @from(Ln 243758, Col 4)
cO
// @from(Ln 243758, Col 8)
lO
// @from(Ln 243759, Col 4)
lM = v(() => {
    B6();
    cO = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"], lO = {
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
// @from(Ln 243776, Col 0)
function xv(A) {
    if (typeof A !== "string") return null;
    return mL9.test(A) ? A : null
}
// @from(Ln 243781, Col 0)
function NR(A) {
    let q = BL9(3).toString("hex");
    return A ? `a${A}-${q}` : `a${q}`
}
// @from(Ln 243785, Col 4)
mL9
// @from(Ln 243786, Col 4)
Sh = v(() => {
    mL9 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
})
// @from(Ln 243790, Col 0)
function fn7(A) {
    QL9 = A, i$.cache.clear?.(), l$.cache.clear?.()
}
// @from(Ln 243793, Col 4)
nMA = 40000
// @from(Ln 243794, Col 4)
QL9 = null
// @from(Ln 243795, Col 4)
rMA
// @from(Ln 243795, Col 9)
l$
// @from(Ln 243795, Col 13)
i$
// @from(Ln 243796, Col 4)
TR = v(() => {
    y6();
    dD();
    zq();
    h9();
    tq();
    f0();
    hA();
    rMA = KA(async () => {
        let A = Date.now();
        H8("info", "git_status_started");
        let q = Date.now(),
            K = await aj();
        if (H8("info", "git_is_git_check_completed", {
                duration_ms: Date.now() - q,
                is_git: K
            }), !K) return H8("info", "git_status_skipped_not_git", {
            duration_ms: Date.now() - A
        }), null;
        try {
            let Y = Date.now(),
                [z, w, H, $] = await Promise.all([sj(), tj(), IA(pq(), ["status", "--short"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: _
                }) => _.trim()), IA(pq(), ["log", "--oneline", "-n", "5"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: _
                }) => _.trim())]);
            H8("info", "git_commands_completed", {
                duration_ms: Date.now() - Y,
                status_length: H.length
            });
            let O = H.length > nMA ? H.substring(0, nMA) + `
... (truncated because it exceeds 40k characters. If you need more information, run "git status" using BashTool)` : H;
            return H8("info", "git_status_completed", {
                duration_ms: Date.now() - A,
                truncated: H.length > nMA
            }), `This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.
Current branch: ${z}

Main branch (you will usually use this for PRs): ${w}

Status:
${O||"(clean)"}

Recent commits:
${$}`
        } catch (Y) {
            return H8("error", "git_status_failed", {
                duration_ms: Date.now() - A
            }), K1(Y instanceof Error ? Y : Error(String(Y))), null
        }
    }), l$ = KA(async () => {
        let A = Date.now();
        H8("info", "system_context_started");
        let q = J6(process.env.CLAUDE_CODE_REMOTE) ? null : await rMA(),
            K = null;
        return H8("info", "system_context_completed", {
            duration_ms: Date.now() - A,
            has_git_status: q !== null,
            has_injection: K !== null
        }), {
            ...q ? {
                gitStatus: q
            } : {},
            ...{}
        }
    }), i$ = KA(async () => {
        let A = Date.now();
        H8("info", "user_context_started");
        let q = process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS,
            K = q ? null : Dp7();
        return H8("info", "user_context_completed", {
            duration_ms: Date.now() - A,
            claudemd_length: K?.length ?? 0,
            claudemd_disabled: Boolean(q)
        }), {
            ...K ? {
                claudeMd: K
            } : {}
        }
    })
})
// @from(Ln 243885, Col 0)
function oMA({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z.name === bW && Y === "plan") return !0;
        if (Bj1.has(z.name)) return !1;
        if (!q && VjA.has(z.name)) return !1;
        if (K && !L_6.has(z.name)) {
            if (l8() && MM()) {
                if (z.name === fK) return !0;
                if (np7.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}
// @from(Ln 243907, Col 0)
function qs(A, q, K = !1) {
    let {
        tools: Y,
        disallowedTools: z,
        source: w,
        permissionMode: H
    } = A, $ = oMA({
        tools: q,
        isBuiltIn: w === "built-in",
        isAsync: K,
        permissionMode: H
    }), O = new Set(z?.map((G) => {
        let {
            toolName: f
        } = lP(G);
        return f
    }) ?? []), _ = $.filter((G) => !O.has(G.name));
    if (Y === void 0 || Y.length === 1 && Y[0] === "*") return {
        hasWildcard: !0,
        validTools: [],
        invalidTools: [],
        resolvedTools: _
    };
    let X = new Map;
    for (let G of _) X.set(G.name, G);
    let D = [],
        j = [],
        M = [],
        P = new Set,
        W;
    for (let G of Y) {
        let {
            toolName: f,
            ruleContent: Z
        } = lP(G);
        if (f === fK) {
            if (D.push(G), Z) W = Z.split(",").map((T) => T.trim());
            continue
        }
        let N = X.get(f);
        if (N) {
            if (D.push(G), !P.has(N)) M.push(N), P.add(N)
        } else j.push(G)
    }
    return {
        hasWildcard: !1,
        validTools: D,
        invalidTools: j,
        resolvedTools: M,
        allowedAgentTypes: W
    }
}
// @from(Ln 243960, Col 0)
function Nn7(A, q) {
    let K = c6({
            content: A
        }),
        Y = q.message.content.find((O) => {
            if (O.type !== "tool_use" || O.name !== fK) return !1;
            let _ = O.input;
            return "prompt" in _ && _.prompt === A
        });
    if (!Y) return h(`Could not find matching AgentTool tool use for prompt: ${A.slice(0,50)}...`, {
        level: "error"
    }), [K];
    let z = {
            ...q,
            uuid: gL9(),
            message: {
                ...q.message,
                content: [Y]
            }
        },
        w = `### FORKING CONVERSATION CONTEXT ###
### ENTERING SUB-AGENT ROUTINE ###
Entered sub-agent context

PLEASE NOTE: 
- The messages above this point are from the main thread prior to sub-agent execution. They are provided as context only.
- Context messages may include tool_use blocks for tools that are not available in the sub-agent context. You should only use the tools specifically provided to you in the system prompt.
- Only complete the specific sub-agent task you have been assigned below.`,
        H = {
            status: "sub_agent_entered",
            description: "Entered sub-agent context",
            message: w
        },
        $ = c6({
            content: [{
                type: "tool_result",
                tool_use_id: Y.id,
                content: [{
                    type: "text",
                    text: w
                }]
            }],
            toolUseResult: H
        });
    return [z, $, K]
}
// @from(Ln 244006, Col 4)
Vn7
// @from(Ln 244007, Col 4)
bK1 = v(() => {
    mj1();
    S9();
    Yv();
    N8();
    Z6();
    i7();
    Vn7 = u.object({
        status: u.literal("sub_agent_entered"),
        description: u.string(),
        message: u.string()
    })
})
// @from(Ln 244020, Col 4)
UL9 = `You are a command execution specialist for Claude Code. Your role is to execute bash commands efficiently and safely.

Guidelines:
- Execute commands precisely as instructed
- For git operations, follow git safety protocols
- Report command output clearly and concisely
- If a command fails, explain the error and suggest solutions
- Use command chaining (&&) for dependent operations
- Quote paths with spaces properly
- For clear communication, avoid using emojis

Complete the requested operations efficiently.`
// @from(Ln 244032, Col 4)
Tn7
// @from(Ln 244033, Col 4)
vn7 = v(() => {
    Tn7 = {
        agentType: "Bash",
        whenToUse: "Command execution specialist for running bash commands. Use this for git operations, command execution, and other terminal tasks.",
        tools: [h4],
        source: "built-in",
        baseDir: "built-in",
        model: "inherit",
        getSystemPrompt: () => UL9
    }
})
// @from(Ln 244044, Col 4)
ZB1
// @from(Ln 244045, Col 4)
aMA = v(() => {
    ZB1 = {
        agentType: "general-purpose",
        whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
        tools: ["*"],
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: () => `You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Do what has been asked; nothing more, nothing less. When you complete the task simply respond with a detailed writeup.

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: Use Grep or Glob when you need to search broadly. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.
- In your final response always share relevant file names and code snippets. Any file paths you return in your response MUST be absolute. Do NOT use relative paths.
- For clear communication, avoid using emojis.`
    }
})
// @from(Ln 244070, Col 4)
En7
// @from(Ln 244071, Col 4)
kn7 = v(() => {
    En7 = {
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
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string"   // Project root directory path
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
// @from(Ln 244187, Col 4)
pL9
// @from(Ln 244187, Col 9)
bv
// @from(Ln 244188, Col 4)
fB1 = v(() => {
    _H();
    SD();
    DW();
    pL9 = `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

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
- Use ${Jz} for broad file pattern matching
- Use ${s9} for searching file contents with regex
- Use ${Jq} when you know the specific file path you need to read
- Use ${h4} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use ${h4} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Return file paths as absolute paths in your final response
- For clear communication, avoid using emojis
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.`, bv = {
        agentType: "Explore",
        whenToUse: 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.',
        disallowedTools: [fK, eO6, bq, f5, jM],
        source: "built-in",
        baseDir: "built-in",
        model: "haiku",
        getSystemPrompt: () => pL9,
        criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
    }
})
// @from(Ln 244237, Col 4)
dL9
// @from(Ln 244237, Col 9)
PJ6
// @from(Ln 244238, Col 4)
sMA = v(() => {
    fB1();
    DW();
    _H();
    SD();
    dL9 = `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

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
   - Find existing patterns and conventions using ${Jz}, ${s9}, and ${Jq}
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use ${h4} ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use ${h4} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

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

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`, PJ6 = {
        agentType: "Plan",
        whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
        disallowedTools: [fK, eO6, bq, f5, jM],
        source: "built-in",
        tools: bv.tools,
        baseDir: "built-in",
        model: "inherit",
        getSystemPrompt: () => dL9,
        criticalSystemReminder_EXPERIMENTAL: "CRITICAL: This is a READ-ONLY task. You CANNOT edit, write, or create files."
    }
})
// @from(Ln 244305, Col 0)
function iL9() {
    if (cC()) return `- When you cannot find an answer or the feature doesn't exist, direct the user to ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.ISSUES_EXPLAINER}`;
    return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug"
}
// @from(Ln 244309, Col 4)
cL9 = "https://code.claude.com/docs/en/claude_code_docs_map.md"
// @from(Ln 244310, Col 4)
Ln7 = "https://platform.claude.com/llms.txt"
// @from(Ln 244311, Col 4)
tMA = "claude-code-guide"
// @from(Ln 244312, Col 4)
lL9
// @from(Ln 244312, Col 9)
Rn7
// @from(Ln 244313, Col 4)
eMA = v(() => {
    _H();
    DW();
    t81();
    p8();
    J7();
    m6();
    lL9 = `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (${cL9}): Fetch this for questions about the Claude Code CLI tool, including:
  - Installation, setup, and getting started
  - Hooks (pre/post command execution)
  - Custom skills
  - MCP server configuration
  - IDE integrations (VS Code, JetBrains)
  - Settings files and configuration
  - Keyboard shortcuts and hotkeys
  - Subagents and plugins
  - Sandboxing and security

- **Claude Agent SDK docs** (${Ln7}): Fetch this for questions about building agents with the SDK, including:
  - SDK overview and getting started (Python and TypeScript)
  - Agent configuration + custom tools
  - Session management and permissions
  - MCP integration in agents
  - Hosting and deployment
  - Cost tracking and context management
  Note: Agent SDK docs are part of the Claude API documentation at the same URL.

- **Claude API docs** (${Ln7}): Fetch this for questions about the Claude API (formerly the Anthropic API), including:
  - Messages API and streaming
  - Tool use (function calling) and Anthropic-defined tools (computer use, code execution, web search, text editor, bash, programmatic tool calling, tool search tool, context editing, Files API, structured outputs)
  - Vision, PDF support, and citations
  - Extended thinking and structured outputs
  - MCP connector for remote MCP servers
  - Cloud provider integrations (Bedrock, Vertex AI, Foundry)

**Approach:**
1. Determine which domain the user's question falls into
2. Use ${xO} to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use ${JL} if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using ${Jq}, ${Jz}, and ${s9}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Avoid emojis in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`;
    Rn7 = {
        agentType: tMA,
        whenToUse: 'Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can resume using the "resume" parameter.',
        tools: [Jz, s9, Jq, xO, JL],
        source: "built-in",
        baseDir: "built-in",
        model: "haiku",
        permissionMode: "dontAsk",
        getSystemPrompt({
            toolUseContext: A
        }) {
            let q = A.options.commands,
                K = [],
                Y = q.filter((J) => J.type === "prompt");
            if (Y.length > 0) {
                let J = Y.map((X) => `- /${X.name}: ${X.description}`).join(`
`);
                K.push(`**Available custom skills in this project:**
${J}`)
            }
            let z = A.options.agentDefinitions.activeAgents.filter((J) => J.source !== "built-in");
            if (z.length > 0) {
                let J = z.map((X) => `- ${X.agentType}: ${X.whenToUse}`).join(`
`);
                K.push(`**Available custom agents configured:**
${J}`)
            }
            let w = A.options.mcpClients;
            if (w && w.length > 0) {
                let J = w.map((X) => `- ${X.name}`).join(`
`);
                K.push(`**Configured MCP servers:**
${J}`)
            }
            let H = q.filter((J) => J.type === "prompt" && J.source === "plugin");
            if (H.length > 0) {
                let J = H.map((X) => `- /${X.name}: ${X.description}`).join(`
`);
                K.push(`**Available plugin skills:**
${J}`)
            }
            let $ = C8();
            if (Object.keys($).length > 0) {
                let J = Q1($, null, 2);
                K.push(`**User's settings.json:**
\`\`\`json
${J}
\`\`\``)
            }
            let O = iL9(),
                _ = `${lL9}
${O}`;
            if (K.length > 0) return `${_}

---

# User's Current Configuration

The user has the following custom setup in their environment:

${K.join(`

`)}

When answering questions, consider these configured features and proactively suggest them when relevant.`;
            return _
        }
    }
})
// @from(Ln 244447, Col 4)
Rfw
// @from(Ln 244448, Col 4)
yn7 = v(() => {
    la();
    oL();
    Rfw = [dM, `${h4}(sleep:*)`, "mcp__slack__send_message", "mcp__slack__read_thread", "mcp__claude_ai_Slack__slack_send_message", "mcp__claude_ai_Slack__slack_read_thread"]
})
// @from(Ln 244454, Col 0)
function APA() {
    if (J6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && w4()) return [];
    let A = [Tn7, ZB1, En7, bv, PJ6];
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(Rn7);
    return A
}
// @from(Ln 244460, Col 4)
Cn7 = v(() => {
    vn7();
    aMA();
    kn7();
    fB1();
    sMA();
    eMA();
    yn7();
    hA();
    B6()
})
// @from(Ln 244472, Col 0)
function VB1(A) {
    return A.toLowerCase().includes("opus-4-6")
}
// @from(Ln 244476, Col 0)
function uK1(A) {
    if (A === void 0 || A === null || A === "") return;
    let q = typeof A === "number" ? A : parseInt(String(A), 10);
    if (!isNaN(q) && nL9(q)) return q;
    if (typeof A === "string" && WJ6.includes(A)) return A;
    return
}
// @from(Ln 244484, Col 0)
function qPA() {
    let A = l4();
    return uK1(A.effortLevel)
}
// @from(Ln 244489, Col 0)
function Sn7() {
    return uK1(process.env.CLAUDE_CODE_EFFORT_LEVEL)
}
// @from(Ln 244493, Col 0)
function nL9(A) {
    return Number.isInteger(A)
}
// @from(Ln 244497, Col 0)
function hn7(A) {
    if (typeof A === "string") return A;
    return "high"
}
// @from(Ln 244501, Col 4)
WJ6
// @from(Ln 244502, Col 4)
NB1 = v(() => {
    p8();
    WJ6 = ["low", "medium", "high", "max"]
})
// @from(Ln 244506, Col 4)
In7 = v(() => {
    N7();
    gB();
    Z6();
    m6()
})
// @from(Ln 244516, Col 0)
function iD(A) {
    return A.source === "built-in"
}
// @from(Ln 244520, Col 0)
function GJ6(A) {
    return A.source !== "built-in" && A.source !== "plugin"
}
// @from(Ln 244524, Col 0)
function ZJ6(A) {
    return A.source === "plugin"
}