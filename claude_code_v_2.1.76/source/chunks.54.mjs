
// @from(Ln 133360, Col 47)
OU
// @from(Ln 133360, Col 51)
rb6
// @from(Ln 133360, Col 56)
G_1
// @from(Ln 133360, Col 61)
f_1
// @from(Ln 133360, Col 66)
Cq6
// @from(Ln 133360, Col 71)
T_1
// @from(Ln 133360, Col 76)
v_1
// @from(Ln 133360, Col 81)
ob6
// @from(Ln 133360, Col 86)
G28
// @from(Ln 133360, Col 91)
QX7
// @from(Ln 133360, Col 96)
N_1
// @from(Ln 133360, Col 101)
f28
// @from(Ln 133360, Col 106)
T28
// @from(Ln 133360, Col 111)
v28
// @from(Ln 133360, Col 116)
UX7
// @from(Ln 133360, Col 121)
dX7 = "__json_buf"
// @from(Ln 133361, Col 4)
ab6
// @from(Ln 133362, Col 4)
iX7 = E(() => {
    zU();
    Z28();
    Sa();
    P_1();
    W28();
    ab6 = class ab6 {
        constructor(A, q) {
            VL.add(this), this.messages = [], this.receivedMessages = [], Ca.set(this, void 0), pM6.set(this, null), this.controller = new AbortController, cb6.set(this, void 0), W_1.set(this, () => {}), lb6.set(this, () => {}), ib6.set(this, void 0), Z_1.set(this, () => {}), nb6.set(this, () => {}), OU.set(this, {}), rb6.set(this, !1), G_1.set(this, !1), f_1.set(this, !1), Cq6.set(this, !1), T_1.set(this, void 0), v_1.set(this, void 0), ob6.set(this, void 0), N_1.set(this, (K) => {
                if (i7(this, G_1, !0, "f"), _U(K)) K = new Az;
                if (K instanceof Az) return i7(this, f_1, !0, "f"), this._emit("abort", K);
                if (K instanceof n7) return this._emit("error", K);
                if (K instanceof Error) {
                    let Y = new n7(K.message);
                    return Y.cause = K, this._emit("error", Y)
                }
                return this._emit("error", new n7(String(K)))
            }), i7(this, cb6, new Promise((K, Y) => {
                i7(this, W_1, K, "f"), i7(this, lb6, Y, "f")
            }), "f"), i7(this, ib6, new Promise((K, Y) => {
                i7(this, Z_1, K, "f"), i7(this, nb6, Y, "f")
            }), "f"), G8(this, cb6, "f").catch(() => {}), G8(this, ib6, "f").catch(() => {}), i7(this, pM6, A, "f"), i7(this, ob6, q?.logger ?? console, "f")
        }
        get response() {
            return G8(this, T_1, "f")
        }
        get request_id() {
            return G8(this, v_1, "f")
        }
        async withResponse() {
            i7(this, Cq6, !0, "f");
            let A = await G8(this, cb6, "f");
            if (!A) throw Error("Could not resolve a `Response` object");
            return {
                data: this,
                response: A,
                request_id: A.headers.get("request-id")
            }
        }
        static fromReadableStream(A) {
            let q = new ab6(null);
            return q._run(() => q._fromReadableStream(A)), q
        }
        static createMessage(A, q, K, {
            logger: Y
        } = {}) {
            let z = new ab6(q, {
                logger: Y
            });
            for (let _ of q.messages) z._addMessageParam(_);
            return i7(z, pM6, {
                ...q,
                stream: !0
            }, "f"), z._run(() => z._createMessage(A, {
                ...q,
                stream: !0
            }, {
                ...K,
                headers: {
                    ...K?.headers,
                    "X-Stainless-Helper-Method": "stream"
                }
            })), z
        }
        _run(A) {
            A().then(() => {
                this._emitFinal(), this._emit("end")
            }, G8(this, N_1, "f"))
        }
        _addMessageParam(A) {
            this.messages.push(A)
        }
        _addMessage(A, q = !0) {
            if (this.receivedMessages.push(A), q) this._emit("message", A)
        }
        async _createMessage(A, q, K) {
            let Y = K?.signal,
                z;
            if (Y) {
                if (Y.aborted) this.controller.abort();
                z = this.controller.abort.bind(this.controller), Y.addEventListener("abort", z)
            }
            try {
                G8(this, VL, "m", f28).call(this);
                let {
                    response: _,
                    data: w
                } = await A.create({
                    ...q,
                    stream: !0
                }, {
                    ...K,
                    signal: this.controller.signal
                }).withResponse();
                this._connected(_);
                for await (let O of w) G8(this, VL, "m", T28).call(this, O);
                if (w.controller.signal?.aborted) throw new Az;
                G8(this, VL, "m", v28).call(this)
            } finally {
                if (Y && z) Y.removeEventListener("abort", z)
            }
        }
        _connected(A) {
            if (this.ended) return;
            i7(this, T_1, A, "f"), i7(this, v_1, A?.headers.get("request-id"), "f"), G8(this, W_1, "f").call(this, A), this._emit("connect")
        }
        get ended() {
            return G8(this, rb6, "f")
        }
        get errored() {
            return G8(this, G_1, "f")
        }
        get aborted() {
            return G8(this, f_1, "f")
        }
        abort() {
            this.controller.abort()
        }
        on(A, q) {
            return (G8(this, OU, "f")[A] || (G8(this, OU, "f")[A] = [])).push({
                listener: q
            }), this
        }
        off(A, q) {
            let K = G8(this, OU, "f")[A];
            if (!K) return this;
            let Y = K.findIndex((z) => z.listener === q);
            if (Y >= 0) K.splice(Y, 1);
            return this
        }
        once(A, q) {
            return (G8(this, OU, "f")[A] || (G8(this, OU, "f")[A] = [])).push({
                listener: q,
                once: !0
            }), this
        }
        emitted(A) {
            return new Promise((q, K) => {
                if (i7(this, Cq6, !0, "f"), A !== "error") this.once("error", K);
                this.once(A, q)
            })
        }
        async done() {
            i7(this, Cq6, !0, "f"), await G8(this, ib6, "f")
        }
        get currentMessage() {
            return G8(this, Ca, "f")
        }
        async finalMessage() {
            return await this.done(), G8(this, VL, "m", G28).call(this)
        }
        async finalText() {
            return await this.done(), G8(this, VL, "m", QX7).call(this)
        }
        _emit(A, ...q) {
            if (G8(this, rb6, "f")) return;
            if (A === "end") i7(this, rb6, !0, "f"), G8(this, Z_1, "f").call(this);
            let K = G8(this, OU, "f")[A];
            if (K) G8(this, OU, "f")[A] = K.filter((Y) => !Y.once), K.forEach(({
                listener: Y
            }) => Y(...q));
            if (A === "abort") {
                let Y = q[0];
                if (!G8(this, Cq6, "f") && !K?.length) Promise.reject(Y);
                G8(this, lb6, "f").call(this, Y), G8(this, nb6, "f").call(this, Y), this._emit("end");
                return
            }
            if (A === "error") {
                let Y = q[0];
                if (!G8(this, Cq6, "f") && !K?.length) Promise.reject(Y);
                G8(this, lb6, "f").call(this, Y), G8(this, nb6, "f").call(this, Y), this._emit("end")
            }
        }
        _emitFinal() {
            if (this.receivedMessages.at(-1)) this._emit("finalMessage", G8(this, VL, "m", G28).call(this))
        }
        async _fromReadableStream(A, q) {
            let K = q?.signal,
                Y;
            if (K) {
                if (K.aborted) this.controller.abort();
                Y = this.controller.abort.bind(this.controller), K.addEventListener("abort", Y)
            }
            try {
                G8(this, VL, "m", f28).call(this), this._connected(null);
                let z = gG.fromReadableStream(A, this.controller);
                for await (let _ of z) G8(this, VL, "m", T28).call(this, _);
                if (z.controller.signal?.aborted) throw new Az;
                G8(this, VL, "m", v28).call(this)
            } finally {
                if (K && Y) K.removeEventListener("abort", Y)
            }
        } [(Ca = new WeakMap, pM6 = new WeakMap, cb6 = new WeakMap, W_1 = new WeakMap, lb6 = new WeakMap, ib6 = new WeakMap, Z_1 = new WeakMap, nb6 = new WeakMap, OU = new WeakMap, rb6 = new WeakMap, G_1 = new WeakMap, f_1 = new WeakMap, Cq6 = new WeakMap, T_1 = new WeakMap, v_1 = new WeakMap, ob6 = new WeakMap, N_1 = new WeakMap, VL = new WeakSet, G28 = function() {
            if (this.receivedMessages.length === 0) throw new n7("stream ended without producing a Message with role=assistant");
            return this.receivedMessages.at(-1)
        }, QX7 = function() {
            if (this.receivedMessages.length === 0) throw new n7("stream ended without producing a Message with role=assistant");
            let q = this.receivedMessages.at(-1).content.filter((K) => K.type === "text").map((K) => K.text);
            if (q.length === 0) throw new n7("stream ended without producing a content block with type=text");
            return q.join(" ")
        }, f28 = function() {
            if (this.ended) return;
            i7(this, Ca, void 0, "f")
        }, T28 = function(q) {
            if (this.ended) return;
            let K = G8(this, VL, "m", UX7).call(this, q);
            switch (this._emit("streamEvent", q, K), q.type) {
                case "content_block_delta": {
                    let Y = K.content.at(-1);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y.type === "text") this._emit("text", q.delta.text, Y.text || "");
                            break
                        }
                        case "citations_delta": {
                            if (Y.type === "text") this._emit("citation", q.delta.citation, Y.citations ?? []);
                            break
                        }
                        case "input_json_delta": {
                            if (cX7(Y) && Y.input) this._emit("inputJson", q.delta.partial_json, Y.input);
                            break
                        }
                        case "thinking_delta": {
                            if (Y.type === "thinking") this._emit("thinking", q.delta.thinking, Y.thinking);
                            break
                        }
                        case "signature_delta": {
                            if (Y.type === "thinking") this._emit("signature", Y.signature);
                            break
                        }
                        case "compaction_delta": {
                            if (Y.type === "compaction" && Y.content) this._emit("compaction", Y.content);
                            break
                        }
                        default:
                            lX7(q.delta)
                    }
                    break
                }
                case "message_stop": {
                    this._addMessageParam(K), this._addMessage(X28(K, G8(this, pM6, "f"), {
                        logger: G8(this, ob6, "f")
                    }), !0);
                    break
                }
                case "content_block_stop": {
                    this._emit("contentBlock", K.content.at(-1));
                    break
                }
                case "message_start": {
                    i7(this, Ca, K, "f");
                    break
                }
                case "content_block_start":
                case "message_delta":
                    break
            }
        }, v28 = function() {
            if (this.ended) throw new n7("stream has ended, this shouldn't happen");
            let q = G8(this, Ca, "f");
            if (!q) throw new n7("request ended without sending any chunks");
            return i7(this, Ca, void 0, "f"), X28(q, G8(this, pM6, "f"), {
                logger: G8(this, ob6, "f")
            })
        }, UX7 = function(q) {
            let K = G8(this, Ca, "f");
            if (q.type === "message_start") {
                if (K) throw new n7(`Unexpected event order, got ${q.type} before receiving "message_stop"`);
                return q.message
            }
            if (!K) throw new n7(`Unexpected event order, got ${q.type} before "message_start"`);
            switch (q.type) {
                case "message_stop":
                    return K;
                case "message_delta":
                    if (K.container = q.delta.container, K.stop_reason = q.delta.stop_reason, K.stop_sequence = q.delta.stop_sequence, K.usage.output_tokens = q.usage.output_tokens, K.context_management = q.context_management, q.usage.input_tokens != null) K.usage.input_tokens = q.usage.input_tokens;
                    if (q.usage.cache_creation_input_tokens != null) K.usage.cache_creation_input_tokens = q.usage.cache_creation_input_tokens;
                    if (q.usage.cache_read_input_tokens != null) K.usage.cache_read_input_tokens = q.usage.cache_read_input_tokens;
                    if (q.usage.server_tool_use != null) K.usage.server_tool_use = q.usage.server_tool_use;
                    if (q.usage.iterations != null) K.usage.iterations = q.usage.iterations;
                    return K;
                case "content_block_start":
                    return K.content.push(q.content_block), K;
                case "content_block_delta": {
                    let Y = K.content.at(q.index);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                text: (Y.text || "") + q.delta.text
                            };
                            break
                        }
                        case "citations_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                citations: [...Y.citations ?? [], q.delta.citation]
                            };
                            break
                        }
                        case "input_json_delta": {
                            if (Y && cX7(Y)) {
                                let z = Y[dX7] || "";
                                z += q.delta.partial_json;
                                let _ = {
                                    ...Y
                                };
                                if (Object.defineProperty(_, dX7, {
                                        value: z,
                                        enumerable: !1,
                                        writable: !0
                                    }), z) try {
                                    _.input = X_1(z)
                                } catch (w) {
                                    let O = new n7(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${w}. JSON: ${z}`);
                                    G8(this, N_1, "f").call(this, O)
                                }
                                K.content[q.index] = _
                            }
                            break
                        }
                        case "thinking_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                thinking: Y.thinking + q.delta.thinking
                            };
                            break
                        }
                        case "signature_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                signature: q.delta.signature
                            };
                            break
                        }
                        case "compaction_delta": {
                            if (Y?.type === "compaction") K.content[q.index] = {
                                ...Y,
                                content: (Y.content || "") + q.delta.content
                            };
                            break
                        }
                        default:
                            lX7(q.delta)
                    }
                    return K
                }
                case "content_block_stop":
                    return K
            }
        }, Symbol.asyncIterator)]() {
            let A = [],
                q = [],
                K = !1;
            return this.on("streamEvent", (Y) => {
                let z = q.shift();
                if (z) z.resolve(Y);
                else A.push(Y)
            }), this.on("end", () => {
                K = !0;
                for (let Y of q) Y.resolve(void 0);
                q.length = 0
            }), this.on("abort", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), this.on("error", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), {
                next: async () => {
                    if (!A.length) {
                        if (K) return {
                            value: void 0,
                            done: !0
                        };
                        return new Promise((z, _) => q.push({
                            resolve: z,
                            reject: _
                        })).then((z) => z ? {
                            value: z,
                            done: !1
                        } : {
                            value: void 0,
                            done: !0
                        })
                    }
                    return {
                        value: A.shift(),
                        done: !1
                    }
                },
                return: async () => {
                    return this.abort(), {
                        value: void 0,
                        done: !0
                    }
                }
            }
        }
        toReadableStream() {
            return new gG(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
        }
    }
})
// @from(Ln 133768, Col 4)
QM6
// @from(Ln 133769, Col 4)
V_1 = E(() => {
    QM6 = class QM6 extends Error {
        constructor(A) {
            let q = typeof A === "string" ? A : A.map((K) => {
                if (K.type === "text") return K.text;
                return `[${K.type}]`
            }).join(" ");
            super(q);
            this.name = "ToolError", this.content = A
        }
    }
})
// @from(Ln 133781, Col 4)
nX7 = 1e5
// @from(Ln 133782, Col 4)
rX7 = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`
// @from(Ln 133806, Col 0)
function aX7() {
    let A, q;
    return {
        promise: new Promise((Y, z) => {
            A = Y, q = z
        }),
        resolve: A,
        reject: q
    }
}
// @from(Ln 133816, Col 0)
async function kR3(A, q = A.messages.at(-1)) {
    if (!q || q.role !== "assistant" || !q.content || typeof q.content === "string") return null;
    let K = q.content.filter((z) => z.type === "tool_use");
    if (K.length === 0) return null;
    return {
        role: "user",
        content: await Promise.all(K.map(async (z) => {
            let _ = A.tools.find((w) => ("name" in w ? w.name : w.mcp_server_name) === z.name);
            if (!_ || !("run" in _)) return {
                type: "tool_result",
                tool_use_id: z.id,
                content: `Error: Tool '${z.name}' not found`,
                is_error: !0
            };
            try {
                let w = z.input;
                if ("parse" in _ && _.parse) w = _.parse(w);
                let O = await _.run(w);
                return {
                    type: "tool_result",
                    tool_use_id: z.id,
                    content: O
                }
            } catch (w) {
                return {
                    type: "tool_result",
                    tool_use_id: z.id,
                    content: w instanceof QM6 ? w.content : `Error: ${w instanceof Error?w.message:String(w)}`,
                    is_error: !0
                }
            }
        }))
    }
}
// @from(Ln 133850, Col 4)
sb6
// @from(Ln 133850, Col 9)
UM6
// @from(Ln 133850, Col 14)
Iq6
// @from(Ln 133850, Col 19)
bM
// @from(Ln 133850, Col 23)
tb6
// @from(Ln 133850, Col 28)
Kk
// @from(Ln 133850, Col 32)
$U
// @from(Ln 133850, Col 36)
Ia
// @from(Ln 133850, Col 40)
eb6
// @from(Ln 133850, Col 45)
oX7
// @from(Ln 133850, Col 50)
N28
// @from(Ln 133850, Col 55)
Ax6
// @from(Ln 133851, Col 4)
V28 = E(() => {
    zU();
    V_1();
    BW();
    qk();
    Qb6();
    Ax6 = class Ax6 {
        constructor(A, q, K) {
            sb6.add(this), this.client = A, UM6.set(this, !1), Iq6.set(this, !1), bM.set(this, void 0), tb6.set(this, void 0), Kk.set(this, void 0), $U.set(this, void 0), Ia.set(this, void 0), eb6.set(this, 0), i7(this, bM, {
                params: {
                    ...q,
                    messages: structuredClone(q.messages)
                }
            }, "f");
            let z = ["BetaToolRunner", ...j28(q.tools, q.messages)].join(", ");
            i7(this, tb6, {
                ...K,
                headers: oK([{
                    "x-stainless-helper": z
                }, K?.headers])
            }, "f"), i7(this, Ia, aX7(), "f")
        }
        async * [(UM6 = new WeakMap, Iq6 = new WeakMap, bM = new WeakMap, tb6 = new WeakMap, Kk = new WeakMap, $U = new WeakMap, Ia = new WeakMap, eb6 = new WeakMap, sb6 = new WeakSet, oX7 = async function() {
            let q = G8(this, bM, "f").params.compactionControl;
            if (!q || !q.enabled) return !1;
            let K = 0;
            if (G8(this, Kk, "f") !== void 0) try {
                let $ = await G8(this, Kk, "f");
                K = $.usage.input_tokens + ($.usage.cache_creation_input_tokens ?? 0) + ($.usage.cache_read_input_tokens ?? 0) + $.usage.output_tokens
            } catch {
                return !1
            }
            let Y = q.contextTokenThreshold ?? nX7;
            if (K < Y) return !1;
            let z = q.model ?? G8(this, bM, "f").params.model,
                _ = q.summaryPrompt ?? rX7,
                w = G8(this, bM, "f").params.messages;
            if (w[w.length - 1].role === "assistant") {
                let $ = w[w.length - 1];
                if (Array.isArray($.content)) {
                    let H = $.content.filter((j) => j.type !== "tool_use");
                    if (H.length === 0) w.pop();
                    else $.content = H
                }
            }
            let O = await this.client.beta.messages.create({
                model: z,
                messages: [...w, {
                    role: "user",
                    content: [{
                        type: "text",
                        text: _
                    }]
                }],
                max_tokens: G8(this, bM, "f").params.max_tokens
            }, {
                headers: {
                    "x-stainless-helper": "compaction"
                }
            });
            if (O.content[0]?.type !== "text") throw new n7("Expected text response for compaction");
            return G8(this, bM, "f").params.messages = [{
                role: "user",
                content: O.content
            }], !0
        }, Symbol.asyncIterator)]() {
            var A;
            if (G8(this, UM6, "f")) throw new n7("Cannot iterate over a consumed stream");
            i7(this, UM6, !0, "f"), i7(this, Iq6, !0, "f"), i7(this, $U, void 0, "f");
            try {
                while (!0) {
                    let q;
                    try {
                        if (G8(this, bM, "f").params.max_iterations && G8(this, eb6, "f") >= G8(this, bM, "f").params.max_iterations) break;
                        i7(this, Iq6, !1, "f"), i7(this, $U, void 0, "f"), i7(this, eb6, (A = G8(this, eb6, "f"), A++, A), "f"), i7(this, Kk, void 0, "f");
                        let {
                            max_iterations: K,
                            compactionControl: Y,
                            ...z
                        } = G8(this, bM, "f").params;
                        if (z.stream) q = this.client.beta.messages.stream({
                            ...z
                        }, G8(this, tb6, "f")), i7(this, Kk, q.finalMessage(), "f"), G8(this, Kk, "f").catch(() => {}), yield q;
                        else i7(this, Kk, this.client.beta.messages.create({
                            ...z,
                            stream: !1
                        }, G8(this, tb6, "f")), "f"), yield G8(this, Kk, "f");
                        if (!await G8(this, sb6, "m", oX7).call(this)) {
                            if (!G8(this, Iq6, "f")) {
                                let {
                                    role: O,
                                    content: $
                                } = await G8(this, Kk, "f");
                                G8(this, bM, "f").params.messages.push({
                                    role: O,
                                    content: $
                                })
                            }
                            let w = await G8(this, sb6, "m", N28).call(this, G8(this, bM, "f").params.messages.at(-1));
                            if (w) G8(this, bM, "f").params.messages.push(w);
                            else if (!G8(this, Iq6, "f")) break
                        }
                    } finally {
                        if (q) q.abort()
                    }
                }
                if (!G8(this, Kk, "f")) throw new n7("ToolRunner concluded without a message from the server");
                G8(this, Ia, "f").resolve(await G8(this, Kk, "f"))
            } catch (q) {
                throw i7(this, UM6, !1, "f"), G8(this, Ia, "f").promise.catch(() => {}), G8(this, Ia, "f").reject(q), i7(this, Ia, aX7(), "f"), q
            }
        }
        setMessagesParams(A) {
            if (typeof A === "function") G8(this, bM, "f").params = A(G8(this, bM, "f").params);
            else G8(this, bM, "f").params = A;
            i7(this, Iq6, !0, "f"), i7(this, $U, void 0, "f")
        }
        async generateToolResponse() {
            let A = await G8(this, Kk, "f") ?? this.params.messages.at(-1);
            if (!A) return null;
            return G8(this, sb6, "m", N28).call(this, A)
        }
        done() {
            return G8(this, Ia, "f").promise
        }
        async runUntilDone() {
            if (!G8(this, UM6, "f"))
                for await (let A of this);
            return this.done()
        }
        get params() {
            return G8(this, bM, "f").params
        }
        pushMessages(...A) {
            this.setMessagesParams((q) => ({
                ...q,
                messages: [...q.messages, ...A]
            }))
        }
        then(A, q) {
            return this.runUntilDone().then(A, q)
        }
    };
    N28 = async function(q) {
        if (G8(this, $U, "f") !== void 0) return G8(this, $U, "f");
        return i7(this, $U, kR3(G8(this, bM, "f").params, q), "f"), G8(this, $U, "f")
    }
})
// @from(Ln 133999, Col 4)
dM6
// @from(Ln 134000, Col 4)
k28 = E(() => {
    BW();
    e_8();
    dM6 = class dM6 {
        constructor(A, q) {
            this.iterator = A, this.controller = q
        }
        async * decoder() {
            let A = new Ra;
            for await (let q of this.iterator) for (let K of A.decode(q)) yield JSON.parse(K);
            for (let q of A.flush()) yield JSON.parse(q)
        } [Symbol.asyncIterator]() {
            return this.decoder()
        }
        static fromResponse(A, q) {
            if (!A.body) {
                if (q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new n7("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
                throw new n7("Attempted to iterate over a response with no body")
            }
            return new dM6(bb6(A.body), q)
        }
    }
})
// @from(Ln 134023, Col 4)
qx6
// @from(Ln 134024, Col 4)
E28 = E(() => {
    _m();
    qk();
    k28();
    Sa();
    ha();
    qx6 = class qx6 extends p$ {
        create(A, q) {
            let {
                betas: K,
                ...Y
            } = A;
            return this._client.post("/v1/messages/batches?beta=true", {
                body: Y,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...K ?? [], "message-batches-2024-09-24"].toString()
                }, q?.headers])
            })
        }
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(oO`/v1/messages/batches/${A}?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/messages/batches?beta=true", VC, {
                query: Y,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...K ?? [], "message-batches-2024-09-24"].toString()
                }, q?.headers])
            })
        }
        delete(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.delete(oO`/v1/messages/batches/${A}?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        cancel(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.post(oO`/v1/messages/batches/${A}/cancel?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "message-batches-2024-09-24"].toString()
                }, K?.headers])
            })
        }
        async results(A, q = {}, K) {
            let Y = await this.retrieve(A);
            if (!Y.results_url) throw new n7(`No batch \`results_url\`; Has it finished processing? ${Y.processing_status} - ${Y.id}`);
            let {
                betas: z
            } = q ?? {};
            return this._client.get(Y.results_url, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...z ?? [], "message-batches-2024-09-24"].toString(),
                    Accept: "application/binary"
                }, K?.headers]),
                stream: !0,
                __binaryResponse: !0
            })._thenUnwrap((_, w) => dM6.fromResponse(w.response, w.controller))
        }
    }
})
// @from(Ln 134109, Col 0)
function tX7(A) {
    if (!A.output_format) return A;
    if (A.output_config?.format) throw new n7("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
    let {
        output_format: q,
        ...K
    } = A;
    return {
        ...K,
        output_config: {
            ...A.output_config,
            format: q
        }
    }
}
// @from(Ln 134124, Col 4)
sX7
// @from(Ln 134124, Col 9)
yR3
// @from(Ln 134124, Col 14)
ba
// @from(Ln 134125, Col 4)
y28 = E(() => {
    Sa();
    D28();
    qk();
    Qb6();
    W28();
    iX7();
    V28();
    V_1();
    E28();
    E28();
    V28();
    V_1();
    sX7 = {
        "claude-1.3": "November 6th, 2024",
        "claude-1.3-100k": "November 6th, 2024",
        "claude-instant-1.1": "November 6th, 2024",
        "claude-instant-1.1-100k": "November 6th, 2024",
        "claude-instant-1.2": "November 6th, 2024",
        "claude-3-sonnet-20240229": "July 21st, 2025",
        "claude-3-opus-20240229": "January 5th, 2026",
        "claude-2.1": "July 21st, 2025",
        "claude-2.0": "July 21st, 2025",
        "claude-3-7-sonnet-latest": "February 19th, 2026",
        "claude-3-7-sonnet-20250219": "February 19th, 2026"
    }, yR3 = ["claude-opus-4-6"];
    ba = class ba extends p$ {
        constructor() {
            super(...arguments);
            this.batches = new qx6(this._client)
        }
        create(A, q) {
            let K = tX7(A),
                {
                    betas: Y,
                    ...z
                } = K;
            if (z.model in sX7) console.warn(`The model '${z.model}' is deprecated and will reach end-of-life on ${sX7[z.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
            if (z.model in yR3 && z.thinking && z.thinking.type === "enabled") console.warn(`Using Claude with ${z.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
            let _ = this._client._options.timeout;
            if (!z.stream && _ == null) {
                let O = D_1[z.model] ?? void 0;
                _ = this._client.calculateNonstreamingTimeout(z.max_tokens, O)
            }
            let w = M_1(z.tools, z.messages);
            return this._client.post("/v1/messages?beta=true", {
                body: z,
                timeout: _ ?? 600000,
                ...q,
                headers: oK([{
                    ...Y?.toString() != null ? {
                        "anthropic-beta": Y?.toString()
                    } : void 0
                }, w, q?.headers]),
                stream: K.stream ?? !1
            })
        }
        parse(A, q) {
            return q = {
                ...q,
                headers: oK([{
                    "anthropic-beta": [...A.betas ?? [], "structured-outputs-2025-12-15"].toString()
                }, q?.headers])
            }, this.create(A, q).then((K) => P28(K, A, {
                logger: this._client.logger ?? console
            }))
        }
        stream(A, q) {
            return ab6.createMessage(this, A, q)
        }
        countTokens(A, q) {
            let K = tX7(A),
                {
                    betas: Y,
                    ...z
                } = K;
            return this._client.post("/v1/messages/count_tokens?beta=true", {
                body: z,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "token-counting-2024-11-01"].toString()
                }, q?.headers])
            })
        }
        toolRunner(A, q) {
            return new Ax6(this._client, A, q)
        }
    };
    ba.Batches = qx6;
    ba.BetaToolRunner = Ax6;
    ba.ToolError = QM6
})
// @from(Ln 134218, Col 4)
Kx6
// @from(Ln 134219, Col 4)
L28 = E(() => {
    _m();
    qk();
    gM6();
    ha();
    Kx6 = class Kx6 extends p$ {
        create(A, q = {}, K) {
            let {
                betas: Y,
                ...z
            } = q ?? {};
            return this._client.post(oO`/v1/skills/${A}/versions?beta=true`, BM6({
                body: z,
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            }, this._client))
        }
        retrieve(A, q, K) {
            let {
                skill_id: Y,
                betas: z
            } = q;
            return this._client.get(oO`/v1/skills/${Y}/versions/${A}?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        list(A, q = {}, K) {
            let {
                betas: Y,
                ...z
            } = q ?? {};
            return this._client.getAPIList(oO`/v1/skills/${A}/versions?beta=true`, gb6, {
                query: z,
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        delete(A, q, K) {
            let {
                skill_id: Y,
                betas: z
            } = q;
            return this._client.delete(oO`/v1/skills/${Y}/versions/${A}?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...z ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
    }
})
// @from(Ln 134277, Col 4)
cM6
// @from(Ln 134278, Col 4)
R28 = E(() => {
    L28();
    L28();
    _m();
    qk();
    gM6();
    ha();
    cM6 = class cM6 extends p$ {
        constructor() {
            super(...arguments);
            this.versions = new Kx6(this._client)
        }
        create(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.post("/v1/skills?beta=true", BM6({
                body: Y,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...K ?? [], "skills-2025-10-02"].toString()
                }, q?.headers])
            }, this._client, !1))
        }
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(oO`/v1/skills/${A}?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/skills?beta=true", gb6, {
                query: Y,
                ...q,
                headers: oK([{
                    "anthropic-beta": [...K ?? [], "skills-2025-10-02"].toString()
                }, q?.headers])
            })
        }
        delete(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.delete(oO`/v1/skills/${A}?beta=true`, {
                ...K,
                headers: oK([{
                    "anthropic-beta": [...Y ?? [], "skills-2025-10-02"].toString()
                }, K?.headers])
            })
        }
    };
    cM6.Versions = Kx6
})
// @from(Ln 134341, Col 4)
gW
// @from(Ln 134342, Col 4)
h28 = E(() => {
    J28();
    J28();
    M28();
    M28();
    y28();
    y28();
    R28();
    R28();
    gW = class gW extends p$ {
        constructor() {
            super(...arguments);
            this.models = new db6(this._client), this.messages = new ba(this._client), this.files = new Ub6(this._client), this.skills = new cM6(this._client)
        }
    };
    gW.Models = db6;
    gW.Messages = ba;
    gW.Files = Ub6;
    gW.Skills = cM6
})
// @from(Ln 134362, Col 4)
xa
// @from(Ln 134363, Col 4)
S28 = E(() => {
    qk();
    xa = class xa extends p$ {
        create(A, q) {
            let {
                betas: K,
                ...Y
            } = A;
            return this._client.post("/v1/complete", {
                body: Y,
                timeout: this._client._options.timeout ?? 600000,
                ...q,
                headers: oK([{
                    ...K?.toString() != null ? {
                        "anthropic-beta": K?.toString()
                    } : void 0
                }, q?.headers]),
                stream: A.stream ?? !1
            })
        }
    }
})
// @from(Ln 134386, Col 0)
function eX7(A) {
    return A?.output_config?.format
}
// @from(Ln 134390, Col 0)
function C28(A, q, K) {
    let Y = eX7(q);
    if (!q || !("parse" in (Y ?? {}))) return {
        ...A,
        content: A.content.map((z) => {
            if (z.type === "text") return Object.defineProperty({
                ...z
            }, "parsed_output", {
                value: null,
                enumerable: !1
            });
            return z
        }),
        parsed_output: null
    };
    return I28(A, q, K)
}
// @from(Ln 134408, Col 0)
function I28(A, q, K) {
    let Y = null,
        z = A.content.map((_) => {
            if (_.type === "text") {
                let w = SR3(q, _.text);
                if (Y === null) Y = w;
                return Object.defineProperty({
                    ..._
                }, "parsed_output", {
                    value: w,
                    enumerable: !1
                })
            }
            return _
        });
    return {
        ...A,
        content: z,
        parsed_output: Y
    }
}
// @from(Ln 134430, Col 0)
function SR3(A, q) {
    let K = eX7(A);
    if (K?.type !== "json_schema") return null;
    try {
        if ("parse" in K) return K.parse(q);
        return JSON.parse(q)
    } catch (Y) {
        throw new n7(`Failed to parse structured output: ${Y}`)
    }
}
// @from(Ln 134440, Col 4)
b28 = E(() => {
    BW()
})
// @from(Ln 134444, Col 0)
function YP7(A) {
    return A.type === "tool_use" || A.type === "server_tool_use"
}
// @from(Ln 134448, Col 0)
function zP7(A) {}
// @from(Ln 134449, Col 4)
kL
// @from(Ln 134449, Col 8)
ua
// @from(Ln 134449, Col 12)
lM6
// @from(Ln 134449, Col 17)
Yx6
// @from(Ln 134449, Col 22)
k_1
// @from(Ln 134449, Col 27)
zx6
// @from(Ln 134449, Col 32)
_x6
// @from(Ln 134449, Col 37)
E_1
// @from(Ln 134449, Col 42)
wx6
// @from(Ln 134449, Col 47)
HU
// @from(Ln 134449, Col 51)
Ox6
// @from(Ln 134449, Col 56)
y_1
// @from(Ln 134449, Col 61)
L_1
// @from(Ln 134449, Col 66)
bq6
// @from(Ln 134449, Col 71)
R_1
// @from(Ln 134449, Col 76)
h_1
// @from(Ln 134449, Col 81)
$x6
// @from(Ln 134449, Col 86)
x28
// @from(Ln 134449, Col 91)
AP7
// @from(Ln 134449, Col 96)
u28
// @from(Ln 134449, Col 101)
m28
// @from(Ln 134449, Col 106)
B28
// @from(Ln 134449, Col 111)
g28
// @from(Ln 134449, Col 116)
qP7
// @from(Ln 134449, Col 121)
KP7 = "__json_buf"
// @from(Ln 134450, Col 4)
Hx6
// @from(Ln 134451, Col 4)
_P7 = E(() => {
    zU();
    Sa();
    P_1();
    Z28();
    b28();
    Hx6 = class Hx6 {
        constructor(A, q) {
            kL.add(this), this.messages = [], this.receivedMessages = [], ua.set(this, void 0), lM6.set(this, null), this.controller = new AbortController, Yx6.set(this, void 0), k_1.set(this, () => {}), zx6.set(this, () => {}), _x6.set(this, void 0), E_1.set(this, () => {}), wx6.set(this, () => {}), HU.set(this, {}), Ox6.set(this, !1), y_1.set(this, !1), L_1.set(this, !1), bq6.set(this, !1), R_1.set(this, void 0), h_1.set(this, void 0), $x6.set(this, void 0), u28.set(this, (K) => {
                if (i7(this, y_1, !0, "f"), _U(K)) K = new Az;
                if (K instanceof Az) return i7(this, L_1, !0, "f"), this._emit("abort", K);
                if (K instanceof n7) return this._emit("error", K);
                if (K instanceof Error) {
                    let Y = new n7(K.message);
                    return Y.cause = K, this._emit("error", Y)
                }
                return this._emit("error", new n7(String(K)))
            }), i7(this, Yx6, new Promise((K, Y) => {
                i7(this, k_1, K, "f"), i7(this, zx6, Y, "f")
            }), "f"), i7(this, _x6, new Promise((K, Y) => {
                i7(this, E_1, K, "f"), i7(this, wx6, Y, "f")
            }), "f"), G8(this, Yx6, "f").catch(() => {}), G8(this, _x6, "f").catch(() => {}), i7(this, lM6, A, "f"), i7(this, $x6, q?.logger ?? console, "f")
        }
        get response() {
            return G8(this, R_1, "f")
        }
        get request_id() {
            return G8(this, h_1, "f")
        }
        async withResponse() {
            i7(this, bq6, !0, "f");
            let A = await G8(this, Yx6, "f");
            if (!A) throw Error("Could not resolve a `Response` object");
            return {
                data: this,
                response: A,
                request_id: A.headers.get("request-id")
            }
        }
        static fromReadableStream(A) {
            let q = new Hx6(null);
            return q._run(() => q._fromReadableStream(A)), q
        }
        static createMessage(A, q, K, {
            logger: Y
        } = {}) {
            let z = new Hx6(q, {
                logger: Y
            });
            for (let _ of q.messages) z._addMessageParam(_);
            return i7(z, lM6, {
                ...q,
                stream: !0
            }, "f"), z._run(() => z._createMessage(A, {
                ...q,
                stream: !0
            }, {
                ...K,
                headers: {
                    ...K?.headers,
                    "X-Stainless-Helper-Method": "stream"
                }
            })), z
        }
        _run(A) {
            A().then(() => {
                this._emitFinal(), this._emit("end")
            }, G8(this, u28, "f"))
        }
        _addMessageParam(A) {
            this.messages.push(A)
        }
        _addMessage(A, q = !0) {
            if (this.receivedMessages.push(A), q) this._emit("message", A)
        }
        async _createMessage(A, q, K) {
            let Y = K?.signal,
                z;
            if (Y) {
                if (Y.aborted) this.controller.abort();
                z = this.controller.abort.bind(this.controller), Y.addEventListener("abort", z)
            }
            try {
                G8(this, kL, "m", m28).call(this);
                let {
                    response: _,
                    data: w
                } = await A.create({
                    ...q,
                    stream: !0
                }, {
                    ...K,
                    signal: this.controller.signal
                }).withResponse();
                this._connected(_);
                for await (let O of w) G8(this, kL, "m", B28).call(this, O);
                if (w.controller.signal?.aborted) throw new Az;
                G8(this, kL, "m", g28).call(this)
            } finally {
                if (Y && z) Y.removeEventListener("abort", z)
            }
        }
        _connected(A) {
            if (this.ended) return;
            i7(this, R_1, A, "f"), i7(this, h_1, A?.headers.get("request-id"), "f"), G8(this, k_1, "f").call(this, A), this._emit("connect")
        }
        get ended() {
            return G8(this, Ox6, "f")
        }
        get errored() {
            return G8(this, y_1, "f")
        }
        get aborted() {
            return G8(this, L_1, "f")
        }
        abort() {
            this.controller.abort()
        }
        on(A, q) {
            return (G8(this, HU, "f")[A] || (G8(this, HU, "f")[A] = [])).push({
                listener: q
            }), this
        }
        off(A, q) {
            let K = G8(this, HU, "f")[A];
            if (!K) return this;
            let Y = K.findIndex((z) => z.listener === q);
            if (Y >= 0) K.splice(Y, 1);
            return this
        }
        once(A, q) {
            return (G8(this, HU, "f")[A] || (G8(this, HU, "f")[A] = [])).push({
                listener: q,
                once: !0
            }), this
        }
        emitted(A) {
            return new Promise((q, K) => {
                if (i7(this, bq6, !0, "f"), A !== "error") this.once("error", K);
                this.once(A, q)
            })
        }
        async done() {
            i7(this, bq6, !0, "f"), await G8(this, _x6, "f")
        }
        get currentMessage() {
            return G8(this, ua, "f")
        }
        async finalMessage() {
            return await this.done(), G8(this, kL, "m", x28).call(this)
        }
        async finalText() {
            return await this.done(), G8(this, kL, "m", AP7).call(this)
        }
        _emit(A, ...q) {
            if (G8(this, Ox6, "f")) return;
            if (A === "end") i7(this, Ox6, !0, "f"), G8(this, E_1, "f").call(this);
            let K = G8(this, HU, "f")[A];
            if (K) G8(this, HU, "f")[A] = K.filter((Y) => !Y.once), K.forEach(({
                listener: Y
            }) => Y(...q));
            if (A === "abort") {
                let Y = q[0];
                if (!G8(this, bq6, "f") && !K?.length) Promise.reject(Y);
                G8(this, zx6, "f").call(this, Y), G8(this, wx6, "f").call(this, Y), this._emit("end");
                return
            }
            if (A === "error") {
                let Y = q[0];
                if (!G8(this, bq6, "f") && !K?.length) Promise.reject(Y);
                G8(this, zx6, "f").call(this, Y), G8(this, wx6, "f").call(this, Y), this._emit("end")
            }
        }
        _emitFinal() {
            if (this.receivedMessages.at(-1)) this._emit("finalMessage", G8(this, kL, "m", x28).call(this))
        }
        async _fromReadableStream(A, q) {
            let K = q?.signal,
                Y;
            if (K) {
                if (K.aborted) this.controller.abort();
                Y = this.controller.abort.bind(this.controller), K.addEventListener("abort", Y)
            }
            try {
                G8(this, kL, "m", m28).call(this), this._connected(null);
                let z = gG.fromReadableStream(A, this.controller);
                for await (let _ of z) G8(this, kL, "m", B28).call(this, _);
                if (z.controller.signal?.aborted) throw new Az;
                G8(this, kL, "m", g28).call(this)
            } finally {
                if (K && Y) K.removeEventListener("abort", Y)
            }
        } [(ua = new WeakMap, lM6 = new WeakMap, Yx6 = new WeakMap, k_1 = new WeakMap, zx6 = new WeakMap, _x6 = new WeakMap, E_1 = new WeakMap, wx6 = new WeakMap, HU = new WeakMap, Ox6 = new WeakMap, y_1 = new WeakMap, L_1 = new WeakMap, bq6 = new WeakMap, R_1 = new WeakMap, h_1 = new WeakMap, $x6 = new WeakMap, u28 = new WeakMap, kL = new WeakSet, x28 = function() {
            if (this.receivedMessages.length === 0) throw new n7("stream ended without producing a Message with role=assistant");
            return this.receivedMessages.at(-1)
        }, AP7 = function() {
            if (this.receivedMessages.length === 0) throw new n7("stream ended without producing a Message with role=assistant");
            let q = this.receivedMessages.at(-1).content.filter((K) => K.type === "text").map((K) => K.text);
            if (q.length === 0) throw new n7("stream ended without producing a content block with type=text");
            return q.join(" ")
        }, m28 = function() {
            if (this.ended) return;
            i7(this, ua, void 0, "f")
        }, B28 = function(q) {
            if (this.ended) return;
            let K = G8(this, kL, "m", qP7).call(this, q);
            switch (this._emit("streamEvent", q, K), q.type) {
                case "content_block_delta": {
                    let Y = K.content.at(-1);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y.type === "text") this._emit("text", q.delta.text, Y.text || "");
                            break
                        }
                        case "citations_delta": {
                            if (Y.type === "text") this._emit("citation", q.delta.citation, Y.citations ?? []);
                            break
                        }
                        case "input_json_delta": {
                            if (YP7(Y) && Y.input) this._emit("inputJson", q.delta.partial_json, Y.input);
                            break
                        }
                        case "thinking_delta": {
                            if (Y.type === "thinking") this._emit("thinking", q.delta.thinking, Y.thinking);
                            break
                        }
                        case "signature_delta": {
                            if (Y.type === "thinking") this._emit("signature", Y.signature);
                            break
                        }
                        default:
                            zP7(q.delta)
                    }
                    break
                }
                case "message_stop": {
                    this._addMessageParam(K), this._addMessage(C28(K, G8(this, lM6, "f"), {
                        logger: G8(this, $x6, "f")
                    }), !0);
                    break
                }
                case "content_block_stop": {
                    this._emit("contentBlock", K.content.at(-1));
                    break
                }
                case "message_start": {
                    i7(this, ua, K, "f");
                    break
                }
                case "content_block_start":
                case "message_delta":
                    break
            }
        }, g28 = function() {
            if (this.ended) throw new n7("stream has ended, this shouldn't happen");
            let q = G8(this, ua, "f");
            if (!q) throw new n7("request ended without sending any chunks");
            return i7(this, ua, void 0, "f"), C28(q, G8(this, lM6, "f"), {
                logger: G8(this, $x6, "f")
            })
        }, qP7 = function(q) {
            let K = G8(this, ua, "f");
            if (q.type === "message_start") {
                if (K) throw new n7(`Unexpected event order, got ${q.type} before receiving "message_stop"`);
                return q.message
            }
            if (!K) throw new n7(`Unexpected event order, got ${q.type} before "message_start"`);
            switch (q.type) {
                case "message_stop":
                    return K;
                case "message_delta":
                    if (K.stop_reason = q.delta.stop_reason, K.stop_sequence = q.delta.stop_sequence, K.usage.output_tokens = q.usage.output_tokens, q.usage.input_tokens != null) K.usage.input_tokens = q.usage.input_tokens;
                    if (q.usage.cache_creation_input_tokens != null) K.usage.cache_creation_input_tokens = q.usage.cache_creation_input_tokens;
                    if (q.usage.cache_read_input_tokens != null) K.usage.cache_read_input_tokens = q.usage.cache_read_input_tokens;
                    if (q.usage.server_tool_use != null) K.usage.server_tool_use = q.usage.server_tool_use;
                    return K;
                case "content_block_start":
                    return K.content.push({
                        ...q.content_block
                    }), K;
                case "content_block_delta": {
                    let Y = K.content.at(q.index);
                    switch (q.delta.type) {
                        case "text_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                text: (Y.text || "") + q.delta.text
                            };
                            break
                        }
                        case "citations_delta": {
                            if (Y?.type === "text") K.content[q.index] = {
                                ...Y,
                                citations: [...Y.citations ?? [], q.delta.citation]
                            };
                            break
                        }
                        case "input_json_delta": {
                            if (Y && YP7(Y)) {
                                let z = Y[KP7] || "";
                                z += q.delta.partial_json;
                                let _ = {
                                    ...Y
                                };
                                if (Object.defineProperty(_, KP7, {
                                        value: z,
                                        enumerable: !1,
                                        writable: !0
                                    }), z) _.input = X_1(z);
                                K.content[q.index] = _
                            }
                            break
                        }
                        case "thinking_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                thinking: Y.thinking + q.delta.thinking
                            };
                            break
                        }
                        case "signature_delta": {
                            if (Y?.type === "thinking") K.content[q.index] = {
                                ...Y,
                                signature: q.delta.signature
                            };
                            break
                        }
                        default:
                            zP7(q.delta)
                    }
                    return K
                }
                case "content_block_stop":
                    return K
            }
        }, Symbol.asyncIterator)]() {
            let A = [],
                q = [],
                K = !1;
            return this.on("streamEvent", (Y) => {
                let z = q.shift();
                if (z) z.resolve(Y);
                else A.push(Y)
            }), this.on("end", () => {
                K = !0;
                for (let Y of q) Y.resolve(void 0);
                q.length = 0
            }), this.on("abort", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), this.on("error", (Y) => {
                K = !0;
                for (let z of q) z.reject(Y);
                q.length = 0
            }), {
                next: async () => {
                    if (!A.length) {
                        if (K) return {
                            value: void 0,
                            done: !0
                        };
                        return new Promise((z, _) => q.push({
                            resolve: z,
                            reject: _
                        })).then((z) => z ? {
                            value: z,
                            done: !1
                        } : {
                            value: void 0,
                            done: !0
                        })
                    }
                    return {
                        value: A.shift(),
                        done: !1
                    }
                },
                return: async () => {
                    return this.abort(), {
                        value: void 0,
                        done: !0
                    }
                }
            }
        }
        toReadableStream() {
            return new gG(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
        }
    }
})
// @from(Ln 134842, Col 4)
jx6
// @from(Ln 134843, Col 4)
F28 = E(() => {
    _m();
    qk();
    k28();
    Sa();
    ha();
    jx6 = class jx6 extends p$ {
        create(A, q) {
            return this._client.post("/v1/messages/batches", {
                body: A,
                ...q
            })
        }
        retrieve(A, q) {
            return this._client.get(oO`/v1/messages/batches/${A}`, q)
        }
        list(A = {}, q) {
            return this._client.getAPIList("/v1/messages/batches", VC, {
                query: A,
                ...q
            })
        }
        delete(A, q) {
            return this._client.delete(oO`/v1/messages/batches/${A}`, q)
        }
        cancel(A, q) {
            return this._client.post(oO`/v1/messages/batches/${A}/cancel`, q)
        }
        async results(A, q) {
            let K = await this.retrieve(A);
            if (!K.results_url) throw new n7(`No batch \`results_url\`; Has it finished processing? ${K.processing_status} - ${K.id}`);
            return this._client.get(K.results_url, {
                ...q,
                headers: oK([{
                    Accept: "application/binary"
                }, q?.headers]),
                stream: !0,
                __binaryResponse: !0
            })._thenUnwrap((Y, z) => dM6.fromResponse(z.response, z.controller))
        }
    }
})
// @from(Ln 134885, Col 4)
Yk
// @from(Ln 134885, Col 8)
wP7
// @from(Ln 134885, Col 13)
IR3
// @from(Ln 134886, Col 4)
p28 = E(() => {
    qk();
    Qb6();
    _P7();
    b28();
    F28();
    F28();
    D28();
    Yk = class Yk extends p$ {
        constructor() {
            super(...arguments);
            this.batches = new jx6(this._client)
        }
        create(A, q) {
            if (A.model in wP7) console.warn(`The model '${A.model}' is deprecated and will reach end-of-life on ${wP7[A.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
            if (A.model in IR3 && A.thinking && A.thinking.type === "enabled") console.warn(`Using Claude with ${A.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
            let K = this._client._options.timeout;
            if (!A.stream && K == null) {
                let z = D_1[A.model] ?? void 0;
                K = this._client.calculateNonstreamingTimeout(A.max_tokens, z)
            }
            let Y = M_1(A.tools, A.messages);
            return this._client.post("/v1/messages", {
                body: A,
                timeout: K ?? 600000,
                ...q,
                headers: oK([Y, q?.headers]),
                stream: A.stream ?? !1
            })
        }
        parse(A, q) {
            return this.create(A, q).then((K) => I28(K, A, {
                logger: this._client.logger ?? console
            }))
        }
        stream(A, q) {
            return Hx6.createMessage(this, A, q, {
                logger: this._client.logger ?? console
            })
        }
        countTokens(A, q) {
            return this._client.post("/v1/messages/count_tokens", {
                body: A,
                ...q
            })
        }
    };
    wP7 = {
        "claude-1.3": "November 6th, 2024",
        "claude-1.3-100k": "November 6th, 2024",
        "claude-instant-1.1": "November 6th, 2024",
        "claude-instant-1.1-100k": "November 6th, 2024",
        "claude-instant-1.2": "November 6th, 2024",
        "claude-3-sonnet-20240229": "July 21st, 2025",
        "claude-3-opus-20240229": "January 5th, 2026",
        "claude-2.1": "July 21st, 2025",
        "claude-2.0": "July 21st, 2025",
        "claude-3-7-sonnet-latest": "February 19th, 2026",
        "claude-3-7-sonnet-20250219": "February 19th, 2026",
        "claude-3-5-haiku-latest": "February 19th, 2026",
        "claude-3-5-haiku-20241022": "February 19th, 2026"
    }, IR3 = ["claude-opus-4-6"];
    Yk.Batches = jx6
})
// @from(Ln 134951, Col 4)
iM6
// @from(Ln 134952, Col 4)
Q28 = E(() => {
    _m();
    qk();
    ha();
    iM6 = class iM6 extends p$ {
        retrieve(A, q = {}, K) {
            let {
                betas: Y
            } = q ?? {};
            return this._client.get(oO`/v1/models/${A}`, {
                ...K,
                headers: oK([{
                    ...Y?.toString() != null ? {
                        "anthropic-beta": Y?.toString()
                    } : void 0
                }, K?.headers])
            })
        }
        list(A = {}, q) {
            let {
                betas: K,
                ...Y
            } = A ?? {};
            return this._client.getAPIList("/v1/models", VC, {
                query: Y,
                ...q,
                headers: oK([{
                    ...K?.toString() != null ? {
                        "anthropic-beta": K?.toString()
                    } : void 0
                }, q?.headers])
            })
        }
    }
})
// @from(Ln 134987, Col 4)
Jx6 = E(() => {
    h28();
    S28();
    p28();
    Q28();
    uX7()
})
// @from(Ln 134994, Col 4)
Mx6 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 134999, Col 0)
class yz {
    constructor({
        baseURL: A = Mx6("ANTHROPIC_BASE_URL"),
        apiKey: q = Mx6("ANTHROPIC_API_KEY") ?? null,
        authToken: K = Mx6("ANTHROPIC_AUTH_TOKEN") ?? null,
        ...Y
    } = {}) {
        U28.add(this), C_1.set(this, void 0);
        let z = {
            apiKey: q,
            authToken: K,
            ...Y,
            baseURL: A || "https://api.anthropic.com"
        };
        if (!z.dangerouslyAllowBrowser && vX7()) throw new n7(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
        this.baseURL = z.baseURL, this.timeout = z.timeout ?? d28.DEFAULT_TIMEOUT, this.logger = z.logger ?? console;
        let _ = "warn";
        this.logLevel = _, this.logLevel = A28(z.logLevel, "ClientOptions.logLevel", this) ?? A28(Mx6("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? _, this.fetchOptions = z.fetchOptions, this.maxRetries = z.maxRetries ?? 2, this.fetch = z.fetch ?? VX7(), i7(this, C_1, EX7, "f"), this._options = z, this.apiKey = typeof q === "string" ? q : null, this.authToken = K
    }
    withOptions(A) {
        return new this.constructor({
            ...this._options,
            baseURL: this.baseURL,
            maxRetries: this.maxRetries,
            timeout: this.timeout,
            logger: this.logger,
            logLevel: this.logLevel,
            fetch: this.fetch,
            fetchOptions: this.fetchOptions,
            apiKey: this.apiKey,
            authToken: this.authToken,
            ...A
        })
    }
    defaultQuery() {
        return this._options.defaultQuery
    }
    validateHeaders({
        values: A,
        nulls: q
    }) {
        if (A.get("x-api-key") || A.get("authorization")) return;
        if (this.apiKey && A.get("x-api-key")) return;
        if (q.has("x-api-key")) return;
        if (this.authToken && A.get("authorization")) return;
        if (q.has("authorization")) return;
        throw Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')
    }
    async authHeaders(A) {
        return oK([await this.apiKeyAuth(A), await this.bearerAuth(A)])
    }
    async apiKeyAuth(A) {
        if (this.apiKey == null) return;
        return oK([{
            "X-Api-Key": this.apiKey
        }])
    }
    async bearerAuth(A) {
        if (this.authToken == null) return;
        return oK([{
            Authorization: `Bearer ${this.authToken}`
        }])
    }
    stringifyQuery(A) {
        return Object.entries(A).filter(([q, K]) => typeof K < "u").map(([q, K]) => {
            if (typeof K === "string" || typeof K === "number" || typeof K === "boolean") return `${encodeURIComponent(q)}=${encodeURIComponent(K)}`;
            if (K === null) return `${encodeURIComponent(q)}=`;
            throw new n7(`Cannot stringify type ${typeof K}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)
        }).join("&")
    }
    getUserAgent() {
        return `${this.constructor.name}/JS ${La}`
    }
    defaultIdempotencyKey() {
        return `stainless-node-retry-${n_8()}`
    }
    makeStatusError(A, q, K, Y) {
        return a7.generate(A, q, K, Y)
    }
    buildURL(A, q, K) {
        let Y = !G8(this, U28, "m", OP7).call(this) && K || this.baseURL,
            z = DX7(A) ? new URL(A) : new URL(Y + (Y.endsWith("/") && A.startsWith("/") ? A.slice(1) : A)),
            _ = this.defaultQuery();
        if (!XX7(_)) q = {
            ..._,
            ...q
        };
        if (typeof q === "object" && q && !Array.isArray(q)) z.search = this.stringifyQuery(q);
        return z.toString()
    }
    _calculateNonstreamingTimeout(A) {
        if (3600 * A / 128000 > 600) throw new n7("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
        return 600000
    }
    async prepareOptions(A) {}
    async prepareRequest(A, {
        url: q,
        options: K
    }) {}
    get(A, q) {
        return this.methodRequest("get", A, q)
    }
    post(A, q) {
        return this.methodRequest("post", A, q)
    }
    patch(A, q) {
        return this.methodRequest("patch", A, q)
    }
    put(A, q) {
        return this.methodRequest("put", A, q)
    }
    delete(A, q) {
        return this.methodRequest("delete", A, q)
    }
    methodRequest(A, q, K) {
        return this.request(Promise.resolve(K).then((Y) => {
            return {
                method: A,
                path: q,
                ...Y
            }
        }))
    }
    request(A, q = null) {
        return new hq6(this, this.makeRequest(A, q, void 0))
    }
    async makeRequest(A, q, K) {
        let Y = await A,
            z = Y.maxRetries ?? this.maxRetries;
        if (q == null) q = z;
        await this.prepareOptions(Y);
        let {
            req: _,
            url: w,
            timeout: O
        } = await this.buildRequest(Y, {
            retryCount: z - q
        });
        await this.prepareRequest(_, {
            url: w,
            options: Y
        });
        let $ = "log_" + (Math.random() * 16777216 | 0).toString(16).padStart(6, "0"),
            H = K === void 0 ? "" : `, retryOf: ${K}`,
            j = Date.now();
        if (KX(this).debug(`[${$}] sending request`, wU({
                retryOfRequestLogID: K,
                method: Y.method,
                url: w,
                options: Y,
                headers: _.headers
            })), Y.signal?.aborted) throw new Az;
        let J = new AbortController,
            M = await this.fetchWithTimeout(w, _, O, J).catch(yb6),
            D = Date.now();
        if (M instanceof globalThis.Error) {
            let W = `retrying, ${q} attempts remaining`;
            if (Y.signal?.aborted) throw new Az;
            let Z = _U(M) || /timed? ?out/i.test(String(M) + ("cause" in M ? String(M.cause) : ""));
            if (q) return KX(this).info(`[${$}] connection ${Z?"timed out":"failed"} - ${W}`), KX(this).debug(`[${$}] connection ${Z?"timed out":"failed"} (${W})`, wU({
                retryOfRequestLogID: K,
                url: w,
                durationMs: D - j,
                message: M.message
            })), this.retryRequest(Y, q, K ?? $);
            if (KX(this).info(`[${$}] connection ${Z?"timed out":"failed"} - error; no more retries left`), KX(this).debug(`[${$}] connection ${Z?"timed out":"failed"} (error; no more retries left)`, wU({
                    retryOfRequestLogID: K,
                    url: w,
                    durationMs: D - j,
                    message: M.message
                })), Z) throw new zm;
            throw new mW({
                cause: M
            })
        }
        let X = [...M.headers.entries()].filter(([W]) => W === "request-id").map(([W, Z]) => ", " + W + ": " + JSON.stringify(Z)).join(""),
            P = `[${$}${H}${X}] ${_.method} ${w} ${M.ok?"succeeded":"failed"} with status ${M.status} in ${D-j}ms`;
        if (!M.ok) {
            let W = await this.shouldRetry(M);
            if (q && W) {
                let V = `retrying, ${q} attempts remaining`;
                return await kX7(M.body), KX(this).info(`${P} - ${V}`), KX(this).debug(`[${$}] response error (${V})`, wU({
                    retryOfRequestLogID: K,
                    url: M.url,
                    status: M.status,
                    headers: M.headers,
                    durationMs: D - j
                })), this.retryRequest(Y, q, K ?? $, M.headers)
            }
            let Z = W ? "error; no more retries left" : "error; not retryable";
            KX(this).info(`${P} - ${Z}`);
            let G = await M.text().catch((V) => yb6(V).message),
                f = q_1(G),
                v = f ? void 0 : G;
            throw KX(this).debug(`[${$}] response error (${Z})`, wU({
                retryOfRequestLogID: K,
                url: M.url,
                status: M.status,
                headers: M.headers,
                message: v,
                durationMs: Date.now() - j
            })), this.makeStatusError(M.status, f, v, M.headers)
        }
        return KX(this).info(P), KX(this).debug(`[${$}] response start`, wU({
            retryOfRequestLogID: K,
            url: M.url,
            status: M.status,
            headers: M.headers,
            durationMs: D - j
        })), {
            response: M,
            options: Y,
            controller: J,
            requestLogID: $,
            retryOfRequestLogID: K,
            startTime: j
        }
    }
    getAPIList(A, q, K) {
        return this.requestAPIList(q, K && "then" in K ? K.then((Y) => ({
            method: "get",
            path: A,
            ...Y
        })) : {
            method: "get",
            path: A,
            ...K
        })
    }
    requestAPIList(A, q) {
        let K = this.makeRequest(q, null, void 0);
        return new H_1(this, K, A)
    }
    async fetchWithTimeout(A, q, K, Y) {
        let {
            signal: z,
            method: _,
            ...w
        } = q || {}, O = this._makeAbort(Y);
        if (z) z.addEventListener("abort", O, {
            once: !0
        });
        let $ = setTimeout(O, K),
            H = globalThis.ReadableStream && w.body instanceof globalThis.ReadableStream || typeof w.body === "object" && w.body !== null && Symbol.asyncIterator in w.body,
            j = {
                signal: Y.signal,
                ...H ? {
                    duplex: "half"
                } : {},
                method: "GET",
                ...w
            };
        if (_) j.method = _.toUpperCase();
        try {
            return await this.fetch.call(void 0, A, j)
        } finally {
            clearTimeout($)
        }
    }
    async shouldRetry(A) {
        let q = A.headers.get("x-should-retry");
        if (q === "true") return !0;
        if (q === "false") return !1;
        if (A.status === 408) return !0;
        if (A.status === 409) return !0;
        if (A.status === 429) return !0;
        if (A.status >= 500) return !0;
        return !1
    }
    async retryRequest(A, q, K, Y) {
        let z, _ = Y?.get("retry-after-ms");
        if (_) {
            let O = parseFloat(_);
            if (!Number.isNaN(O)) z = O
        }
        let w = Y?.get("retry-after");
        if (w && !z) {
            let O = parseFloat(w);
            if (!Number.isNaN(O)) z = O * 1000;
            else z = Date.parse(w) - Date.now()
        }
        if (!(z && 0 <= z && z < 60000)) {
            let O = A.maxRetries ?? this.maxRetries;
            z = this.calculateDefaultRetryTimeoutMillis(q, O)
        }
        return await ZX7(z), this.makeRequest(A, q - 1, K)
    }
    calculateDefaultRetryTimeoutMillis(A, q) {
        let z = q - A,
            _ = Math.min(0.5 * Math.pow(2, z), 8),
            w = 1 - Math.random() * 0.25;
        return _ * w * 1000
    }
    calculateNonstreamingTimeout(A, q) {
        if (3600000 * A / 128000 > 600000 || q != null && A > q) throw new n7("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
        return 600000
    }
    async buildRequest(A, {
        retryCount: q = 0
    } = {}) {
        let K = {
                ...A
            },
            {
                method: Y,
                path: z,
                query: _,
                defaultBaseURL: w
            } = K,
            O = this.buildURL(z, _, w);
        if ("timeout" in K) WX7("timeout", K.timeout);
        K.timeout = K.timeout ?? this.timeout;
        let {
            bodyHeaders: $,
            body: H
        } = this.buildBody({
            options: K
        }), j = await this.buildHeaders({
            options: A,
            method: Y,
            bodyHeaders: $,
            retryCount: q
        });
        return {
            req: {
                method: Y,
                headers: j,
                ...K.signal && {
                    signal: K.signal
                },
                ...globalThis.ReadableStream && H instanceof globalThis.ReadableStream && {
                    duplex: "half"
                },
                ...H && {
                    body: H
                },
                ...this.fetchOptions ?? {},
                ...K.fetchOptions ?? {}
            },
            url: O,
            timeout: K.timeout
        }
    }
    async buildHeaders({
        options: A,
        method: q,
        bodyHeaders: K,
        retryCount: Y
    }) {
        let z = {};
        if (this.idempotencyHeader && q !== "get") {
            if (!A.idempotencyKey) A.idempotencyKey = this.defaultIdempotencyKey();
            z[this.idempotencyHeader] = A.idempotencyKey
        }
        let _ = oK([z, {
            Accept: "application/json",
            "User-Agent": this.getUserAgent(),
            "X-Stainless-Retry-Count": String(Y),
            ...A.timeout ? {
                "X-Stainless-Timeout": String(Math.trunc(A.timeout / 1000))
            } : {},
            ...NX7(),
            ...this._options.dangerouslyAllowBrowser ? {
                "anthropic-dangerous-direct-browser-access": "true"
            } : void 0,
            "anthropic-version": "2023-06-01"
        }, await this.authHeaders(A), this._options.defaultHeaders, K, A.headers]);
        return this.validateHeaders(_), _.values
    }
    _makeAbort(A) {
        return () => A.abort()
    }
    buildBody({
        options: {
            body: A,
            headers: q
        }
    }) {
        if (!A) return {
            bodyHeaders: void 0,
            body: void 0
        };
        let K = oK([q]);
        if (ArrayBuffer.isView(A) || A instanceof ArrayBuffer || A instanceof DataView || typeof A === "string" && K.values.has("content-type") || globalThis.Blob && A instanceof globalThis.Blob || A instanceof FormData || A instanceof URLSearchParams || globalThis.ReadableStream && A instanceof globalThis.ReadableStream) return {
            bodyHeaders: void 0,
            body: A
        };
        else if (typeof A === "object" && ((Symbol.asyncIterator in A) || (Symbol.iterator in A) && ("next" in A) && typeof A.next === "function")) return {
            bodyHeaders: void 0,
            body: K_1(A)
        };
        else return G8(this, C_1, "f").call(this, {
            body: A,
            headers: K
        })
    }
}
// @from(Ln 135403, Col 4)
U28
// @from(Ln 135403, Col 9)
d28
// @from(Ln 135403, Col 14)
C_1
// @from(Ln 135403, Col 19)
OP7
// @from(Ln 135403, Col 24)
$P7 = "\\n\\nHuman:"
// @from(Ln 135404, Col 4)
HP7 = "\\n\\nAssistant:"
// @from(Ln 135405, Col 4)
kC
// @from(Ln 135406, Col 4)
jU = E(() => {
    zU();
    Rq6();
    a_8();
    BW();
    _m();
    H28();
    Jx6();
    O_1();
    S28();
    Q28();
    h28();
    p28();
    a_8();
    qk();
    __1();
    Rq6();
    d28 = yz, C_1 = new WeakMap, U28 = new WeakSet, OP7 = function() {
        return this.baseURL !== "https://api.anthropic.com"
    };
    yz.Anthropic = d28;
    yz.HUMAN_PROMPT = $P7;
    yz.AI_PROMPT = HP7;
    yz.DEFAULT_TIMEOUT = 600000;
    yz.AnthropicError = n7;
    yz.APIError = a7;
    yz.APIConnectionError = mW;
    yz.APIConnectionTimeoutError = zm;
    yz.APIUserAbortError = Az;
    yz.NotFoundError = Lq6;
    yz.ConflictError = hb6;
    yz.RateLimitError = Cb6;
    yz.BadRequestError = Lb6;
    yz.AuthenticationError = yq6;
    yz.InternalServerError = Ib6;
    yz.PermissionDeniedError = Rb6;
    yz.UnprocessableEntityError = Sb6;
    yz.toFile = j_1;
    kC = class kC extends yz {
        constructor() {
            super(...arguments);
            this.completions = new xa(this), this.messages = new Yk(this), this.models = new iM6(this), this.beta = new gW(this)
        }
    };
    kC.Completions = xa;
    kC.Messages = Yk;
    kC.Models = iM6;
    kC.Beta = gW
})
// @from(Ln 135455, Col 4)
wv = E(() => {
    jU();
    H28();
    O_1();
    jU();
    _m();
    BW()
})
// @from(Ln 135463, Col 4)
Q7 = "Bash"
// @from(Ln 135465, Col 0)
function wA(A, q) {
    if (!process.env.SRT_DEBUG) return;
    let K = q?.level || "info",
        Y = "[SandboxDebug]";
    switch (K) {
        case "error":
            console.error(`${Y} ${A}`);
            break;
        case "warn":
            console.warn(`${Y} ${A}`);
            break;
        default:
            console.error(`${Y} ${A}`)
    }
}
// @from(Ln 135497, Col 0)
function MP7(A) {
    let q = xR3();
    return q.on("connect", async (K, Y) => {
        Y.on("error", (z) => {
            wA(`Client socket error: ${z.message}`, {
                level: "error"
            })
        });
        try {
            let [z, _] = K.url.split(":"), w = _ === void 0 ? void 0 : parseInt(_, 10);
            if (!z || !w) {
                wA(`Invalid CONNECT request: ${K.url}`, {
                    level: "error"
                }), Y.end(`HTTP/1.1 400 Bad Request\r
\r
`);
                return
            }
            if (!await A.filter(w, z, Y)) {
                wA(`Connection blocked to ${z}:${w}`, {
                    level: "error"
                }), Y.end(`HTTP/1.1 403 Forbidden\r
Content-Type: text/plain\r
X-Proxy-Error: blocked-by-allowlist\r
\r
Connection blocked by network allowlist`);
                return
            }
            let $ = A.getMitmSocketPath?.(z);
            if ($) {
                wA(`Routing CONNECT ${z}:${w} through MITM proxy at ${$}`);
                let H = JP7({
                        path: $
                    }, () => {
                        H.write(`CONNECT ${z}:${w} HTTP/1.1\r
Host: ${z}:${w}\r
\r
`)
                    }),
                    j = "",
                    J = (M) => {
                        j += M.toString();
                        let D = j.indexOf(`\r
\r
`);
                        if (D !== -1) {
                            H.removeListener("data", J);
                            let X = j.substring(0, j.indexOf(`\r
`));
                            if (X.includes(" 200 ")) {
                                Y.write(`HTTP/1.1 200 Connection Established\r
\r
`);
                                let P = j.substring(D + 4);
                                if (P.length > 0) Y.write(P);
                                H.pipe(Y), Y.pipe(H)
                            } else wA(`MITM proxy rejected CONNECT: ${X}`, {
                                level: "error"
                            }), Y.end(`HTTP/1.1 502 Bad Gateway\r
\r
`), H.destroy()
                        }
                    };
                H.on("data", J), H.on("error", (M) => {
                    wA(`MITM proxy connection failed: ${M.message}`, {
                        level: "error"
                    }), Y.end(`HTTP/1.1 502 Bad Gateway\r
\r
`)
                }), Y.on("error", (M) => {
                    wA(`Client socket error: ${M.message}`, {
                        level: "error"
                    }), H.destroy()
                }), Y.on("end", () => H.end()), H.on("end", () => Y.end())
            } else {
                let H = JP7(w, z, () => {
                    Y.write(`HTTP/1.1 200 Connection Established\r
\r
`), H.pipe(Y), Y.pipe(H)
                });
                H.on("error", (j) => {
                    wA(`CONNECT tunnel failed: ${j.message}`, {
                        level: "error"
                    }), Y.end(`HTTP/1.1 502 Bad Gateway\r
\r
`)
                }), Y.on("error", (j) => {
                    wA(`Client socket error: ${j.message}`, {
                        level: "error"
                    }), H.destroy()
                }), Y.on("end", () => H.end()), H.on("end", () => Y.end())
            }
        } catch (z) {
            wA(`Error handling CONNECT: ${z}`, {
                level: "error"
            }), Y.end(`HTTP/1.1 500 Internal Server Error\r
\r
`)
        }
    }), q.on("request", async (K, Y) => {
        try {
            let z = new mR3(K.url),
                _ = z.hostname,
                w = z.port ? parseInt(z.port, 10) : z.protocol === "https:" ? 443 : 80;
            if (!await A.filter(w, _, K.socket)) {
                wA(`HTTP request blocked to ${_}:${w}`, {
                    level: "error"
                }), Y.writeHead(403, {
                    "Content-Type": "text/plain",
                    "X-Proxy-Error": "blocked-by-allowlist"
                }), Y.end("Connection blocked by network allowlist");
                return
            }
            let $ = A.getMitmSocketPath?.(_);
            if ($) {
                wA(`Routing HTTP ${K.method} ${_}:${w} through MITM proxy at ${$}`);
                let H = new bR3({
                        socketPath: $
                    }),
                    j = jP7({
                        agent: H,
                        path: K.url,
                        method: K.method,
                        headers: {
                            ...K.headers,
                            host: z.host
                        }
                    }, (J) => {
                        Y.writeHead(J.statusCode, J.headers), J.pipe(Y)
                    });
                j.on("error", (J) => {
                    if (wA(`MITM proxy request failed: ${J.message}`, {
                            level: "error"
                        }), !Y.headersSent) Y.writeHead(502, {
                        "Content-Type": "text/plain"
                    }), Y.end("Bad Gateway")
                }), K.pipe(j)
            } else {
                let j = (z.protocol === "https:" ? uR3 : jP7)({
                    hostname: _,
                    port: w,
                    path: z.pathname + z.search,
                    method: K.method,
                    headers: {
                        ...K.headers,
                        host: z.host
                    }
                }, (J) => {
                    Y.writeHead(J.statusCode, J.headers), J.pipe(Y)
                });
                j.on("error", (J) => {
                    if (wA(`Proxy request failed: ${J.message}`, {
                            level: "error"
                        }), !Y.headersSent) Y.writeHead(502, {
                        "Content-Type": "text/plain"
                    }), Y.end("Bad Gateway")
                }), K.pipe(j)
            }
        } catch (z) {
            wA(`Error handling HTTP request: ${z}`, {
                level: "error"
            }), Y.writeHead(500, {
                "Content-Type": "text/plain"
            }), Y.end("Internal Server Error")
        }
    }), q
}
// @from(Ln 135664, Col 4)
DP7 = () => {}
// @from(Ln 135665, Col 4)
TP7 = x((hh_, fP7) => {
    var {
        create: BR3,
        defineProperty: I_1,
        getOwnPropertyDescriptor: gR3,
        getOwnPropertyNames: FR3,
        getPrototypeOf: pR3
    } = Object, QR3 = Object.prototype.hasOwnProperty, UR3 = (A, q) => {
        for (var K in q) I_1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, XP7 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of FR3(q))
                if (!QR3.call(A, z) && z !== K) I_1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = gR3(q, z)) || Y.enumerable
                })
        }
        return A
    }, PP7 = (A, q, K) => (K = A != null ? BR3(pR3(A)) : {}, XP7(q || !A || !A.__esModule ? I_1(K, "default", {
        value: A,
        enumerable: !0
    }) : K, A)), dR3 = (A) => XP7(I_1({}, "__esModule", {
        value: !0
    }), A), WP7 = {};
    UR3(WP7, {
        Socks5Server: () => GP7,
        createServer: () => nR3,
        defaultConnectionHandler: () => l28
    });
    fP7.exports = dR3(WP7);
    var cR3 = PP7(x6("net")),
        ZP7 = ((A) => {
            return A[A.connect = 1] = "connect", A[A.bind = 2] = "bind", A[A.udp = 3] = "udp", A
        })(ZP7 || {}),
        c28 = ((A) => {
            return A[A.REQUEST_GRANTED = 0] = "REQUEST_GRANTED", A[A.GENERAL_FAILURE = 1] = "GENERAL_FAILURE", A[A.CONNECTION_NOT_ALLOWED = 2] = "CONNECTION_NOT_ALLOWED", A[A.NETWORK_UNREACHABLE = 3] = "NETWORK_UNREACHABLE", A[A.HOST_UNREACHABLE = 4] = "HOST_UNREACHABLE", A[A.CONNECTION_REFUSED = 5] = "CONNECTION_REFUSED", A[A.TTL_EXPIRED = 6] = "TTL_EXPIRED", A[A.COMMAND_NOT_SUPPORTED = 7] = "COMMAND_NOT_SUPPORTED", A[A.ADDRESS_TYPE_NOT_SUPPORTED = 8] = "ADDRESS_TYPE_NOT_SUPPORTED", A
        })(c28 || {}),
        lR3 = class {
            constructor(A, q) {
                this.errorHandler = () => {}, this.metadata = {}, this.socket = q, this.server = A, q.on("error", this.errorHandler), q.pause(), this.handleGreeting()
            }
            readBytes(A) {
                return new Promise((q) => {
                    let K = Buffer.allocUnsafe(A),
                        Y = 0,
                        z = (_) => {
                            let w = Math.min(_.length, A - Y);
                            if (_.copy(K, Y, 0, w), Y += w, Y < A) return;
                            this.socket.removeListener("data", z), this.socket.push(_.subarray(w)), q(K), this.socket.pause()
                        };
                    this.socket.on("data", z), this.socket.resume()
                })
            }
            async handleGreeting() {
                if ((await this.readBytes(1)).readUInt8() !== 5) return this.socket.destroy();
                let q = (await this.readBytes(1)).readUInt8();
                if (q > 128 || q === 0) return this.socket.destroy();
                let K = await this.readBytes(q),
                    Y = this.server.authHandler ? 2 : 0;
                if (!K.includes(Y)) return this.socket.write(Buffer.from([5, 255])), this.socket.destroy();
                if (this.socket.write(Buffer.from([5, Y])), this.server.authHandler) this.handleUserPassword();
                else this.handleConnectionRequest()
            }
            async handleUserPassword() {
                await this.readBytes(1);
                let A = (await this.readBytes(1)).readUint8(),
                    q = (await this.readBytes(A)).toString(),
                    K = (await this.readBytes(1)).readUint8(),
                    Y = (await this.readBytes(K)).toString();
                this.username = q, this.password = Y;
                let z = !1,
                    _ = () => {
                        if (z) return;
                        z = !0, this.socket.write(Buffer.from([1, 0])), this.handleConnectionRequest()
                    },
                    w = () => {
                        if (z) return;
                        z = !0, this.socket.write(Buffer.from([1, 1])), this.socket.destroy()
                    },
                    O = await this.server.authHandler(this, _, w);
                if (O === !0) _();
                else if (O === !1) w()
            }
            async handleConnectionRequest() {
                await this.readBytes(1);
                let A = (await this.readBytes(1))[0],
                    q = ZP7[A];
                if (!q) return this.socket.destroy();
                this.command = q, await this.readBytes(1);
                let K = (await this.readBytes(1)).readUInt8(),
                    Y = "";
                switch (K) {
                    case 1:
                        Y = (await this.readBytes(4)).join(".");
                        break;
                    case 3:
                        let H = (await this.readBytes(1)).readUInt8();
                        Y = (await this.readBytes(H)).toString();
                        break;
                    case 4:
                        let j = await this.readBytes(16);
                        for (let J = 0; J < 16; J++) {
                            if (J % 2 === 0 && J > 0) Y += ":";
                            Y += `${j[J]<16?"0":""}${j[J].toString(16)}`
                        }
                        break;
                    default:
                        this.socket.destroy();
                        return
                }
                let z = (await this.readBytes(2)).readUInt16BE();
                if (!this.server.supportedCommands.has(q)) return this.socket.write(Buffer.from([5, 7])), this.socket.destroy();
                this.destAddress = Y, this.destPort = z;
                let _ = !1,
                    w = () => {
                        if (_) return;
                        _ = !0, this.connect()
                    };
                if (!this.server.rulesetValidator) return w();
                let O = () => {
                        if (_) return;
                        _ = !0, this.socket.write(Buffer.from([5, 2, 0, 1, 0, 0, 0, 0, 0, 0])), this.socket.destroy()
                    },
                    $ = await this.server.rulesetValidator(this, w, O);
                if ($ === !0) w();
                else if ($ === !1) O()
            }
            connect() {
                this.socket.removeListener("error", this.errorHandler), this.server.connectionHandler(this, (A) => {
                    if (c28[A] === void 0) throw Error(`"${A}" is not a valid status.`);
                    if (this.socket.write(Buffer.from([5, c28[A], 0, 1, 0, 0, 0, 0, 0, 0])), A !== "REQUEST_GRANTED") this.socket.destroy()
                }), this.socket.resume()
            }
        },
        iR3 = PP7(x6("net"));

    function l28(A, q) {
        if (A.command !== "connect") return q("COMMAND_NOT_SUPPORTED");
        A.socket.on("error", () => {});
        let K = iR3.default.createConnection({
            host: A.destAddress,
            port: A.destPort
        });
        K.setNoDelay();
        let Y = !1;
        return K.on("error", (z) => {
            if (!Y) switch (z.code) {
                case "EINVAL":
                case "ENOENT":
                case "ENOTFOUND":
                case "ETIMEDOUT":
                case "EADDRNOTAVAIL":
                case "EHOSTUNREACH":
                    q("HOST_UNREACHABLE");
                    break;
                case "ENETUNREACH":
                    q("NETWORK_UNREACHABLE");
                    break;
                case "ECONNREFUSED":
                    q("CONNECTION_REFUSED");
                    break;
                default:
                    q("GENERAL_FAILURE")
            }
        }), K.on("ready", () => {
            Y = !0, q("REQUEST_GRANTED"), A.socket.pipe(K).pipe(A.socket)
        }), A.socket.on("close", () => K.destroy()), K
    }
    var GP7 = class {
        constructor() {
            this.supportedCommands = new Set(["connect"]), this.connectionHandler = l28, this.server = cR3.default.createServer((A) => {
                A.setNoDelay(), this._handleConnection(A)
            })
        }
        listen(...A) {
            return this.server.listen(...A), this
        }
        close(A) {
            return this.server.close(A), this
        }
        setAuthHandler(A) {
            return this.authHandler = A, this
        }
        disableAuthHandler() {
            return this.authHandler = void 0, this
        }
        setRulesetValidator(A) {
            return this.rulesetValidator = A, this
        }
        disableRulesetValidator() {
            return this.rulesetValidator = void 0, this
        }
        setConnectionHandler(A) {
            return this.connectionHandler = A, this
        }
        useDefaultConnectionHandler() {
            return this.connectionHandler = l28, this
        }
        _handleConnection(A) {
            return new lR3(this, A), this
        }
    };

    function nR3(A) {
        let q = new GP7;
        if (A?.auth) q.setAuthHandler((K) => {
            return K.username === A.auth.username && K.password === A.auth.password
        });
        if (A?.port) q.listen(A.port, A.hostname);
        return q
    }
})