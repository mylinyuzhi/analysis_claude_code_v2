
// @from(Start 6743701, End 6756665)
WRB = L(() => {
  Kv();
  Yr();
  QvA();
  tH1();
  i$A = class i$A {
    constructor() {
      EM.add(this), this.messages = [], this.receivedMessages = [], Tp.set(this, void 0), this.controller = new AbortController, m$A.set(this, void 0), _rA.set(this, () => {}), d$A.set(this, () => {}), c$A.set(this, void 0), krA.set(this, () => {}), p$A.set(this, () => {}), Df.set(this, {}), l$A.set(this, !1), yrA.set(this, !1), xrA.set(this, !1), FGA.set(this, !1), vrA.set(this, void 0), brA.set(this, void 0), Gd1.set(this, (A) => {
        if (fB(this, yrA, !0, "f"), Dv(A)) A = new yY;
        if (A instanceof yY) return fB(this, xrA, !0, "f"), this._emit("abort", A);
        if (A instanceof vB) return this._emit("error", A);
        if (A instanceof Error) {
          let Q = new vB(A.message);
          return Q.cause = A, this._emit("error", Q)
        }
        return this._emit("error", new vB(String(A)))
      }), fB(this, m$A, new Promise((A, Q) => {
        fB(this, _rA, A, "f"), fB(this, d$A, Q, "f")
      }), "f"), fB(this, c$A, new Promise((A, Q) => {
        fB(this, krA, A, "f"), fB(this, p$A, Q, "f")
      }), "f"), N0(this, m$A, "f").catch(() => {}), N0(this, c$A, "f").catch(() => {})
    }
    get response() {
      return N0(this, vrA, "f")
    }
    get request_id() {
      return N0(this, brA, "f")
    }
    async withResponse() {
      let A = await N0(this, m$A, "f");
      if (!A) throw Error("Could not resolve a `Response` object");
      return {
        data: this,
        response: A,
        request_id: A.headers.get("request-id")
      }
    }
    static fromReadableStream(A) {
      let Q = new i$A;
      return Q._run(() => Q._fromReadableStream(A)), Q
    }
    static createMessage(A, Q, B) {
      let G = new i$A;
      for (let Z of Q.messages) G._addMessageParam(Z);
      return G._run(() => G._createMessage(A, {
        ...Q,
        stream: !0
      }, {
        ...B,
        headers: {
          ...B?.headers,
          "X-Stainless-Helper-Method": "stream"
        }
      })), G
    }
    _run(A) {
      A().then(() => {
        this._emitFinal(), this._emit("end")
      }, N0(this, Gd1, "f"))
    }
    _addMessageParam(A) {
      this.messages.push(A)
    }
    _addMessage(A, Q = !0) {
      if (this.receivedMessages.push(A), Q) this._emit("message", A)
    }
    async _createMessage(A, Q, B) {
      let G = B?.signal,
        Z;
      if (G) {
        if (G.aborted) this.controller.abort();
        Z = this.controller.abort.bind(this.controller), G.addEventListener("abort", Z)
      }
      try {
        N0(this, EM, "m", Zd1).call(this);
        let {
          response: I,
          data: Y
        } = await A.create({
          ...Q,
          stream: !0
        }, {
          ...B,
          signal: this.controller.signal
        }).withResponse();
        this._connected(I);
        for await (let J of Y) N0(this, EM, "m", Id1).call(this, J);
        if (Y.controller.signal?.aborted) throw new yY;
        N0(this, EM, "m", Yd1).call(this)
      } finally {
        if (G && Z) G.removeEventListener("abort", Z)
      }
    }
    _connected(A) {
      if (this.ended) return;
      fB(this, vrA, A, "f"), fB(this, brA, A?.headers.get("request-id"), "f"), N0(this, _rA, "f").call(this, A), this._emit("connect")
    }
    get ended() {
      return N0(this, l$A, "f")
    }
    get errored() {
      return N0(this, yrA, "f")
    }
    get aborted() {
      return N0(this, xrA, "f")
    }
    abort() {
      this.controller.abort()
    }
    on(A, Q) {
      return (N0(this, Df, "f")[A] || (N0(this, Df, "f")[A] = [])).push({
        listener: Q
      }), this
    }
    off(A, Q) {
      let B = N0(this, Df, "f")[A];
      if (!B) return this;
      let G = B.findIndex((Z) => Z.listener === Q);
      if (G >= 0) B.splice(G, 1);
      return this
    }
    once(A, Q) {
      return (N0(this, Df, "f")[A] || (N0(this, Df, "f")[A] = [])).push({
        listener: Q,
        once: !0
      }), this
    }
    emitted(A) {
      return new Promise((Q, B) => {
        if (fB(this, FGA, !0, "f"), A !== "error") this.once("error", B);
        this.once(A, Q)
      })
    }
    async done() {
      fB(this, FGA, !0, "f"), await N0(this, c$A, "f")
    }
    get currentMessage() {
      return N0(this, Tp, "f")
    }
    async finalMessage() {
      return await this.done(), N0(this, EM, "m", Bd1).call(this)
    }
    async finalText() {
      return await this.done(), N0(this, EM, "m", GRB).call(this)
    }
    _emit(A, ...Q) {
      if (N0(this, l$A, "f")) return;
      if (A === "end") fB(this, l$A, !0, "f"), N0(this, krA, "f").call(this);
      let B = N0(this, Df, "f")[A];
      if (B) N0(this, Df, "f")[A] = B.filter((G) => !G.once), B.forEach(({
        listener: G
      }) => G(...Q));
      if (A === "abort") {
        let G = Q[0];
        if (!N0(this, FGA, "f") && !B?.length) Promise.reject(G);
        N0(this, d$A, "f").call(this, G), N0(this, p$A, "f").call(this, G), this._emit("end");
        return
      }
      if (A === "error") {
        let G = Q[0];
        if (!N0(this, FGA, "f") && !B?.length) Promise.reject(G);
        N0(this, d$A, "f").call(this, G), N0(this, p$A, "f").call(this, G), this._emit("end")
      }
    }
    _emitFinal() {
      if (this.receivedMessages.at(-1)) this._emit("finalMessage", N0(this, EM, "m", Bd1).call(this))
    }
    async _fromReadableStream(A, Q) {
      let B = Q?.signal,
        G;
      if (B) {
        if (B.aborted) this.controller.abort();
        G = this.controller.abort.bind(this.controller), B.addEventListener("abort", G)
      }
      try {
        N0(this, EM, "m", Zd1).call(this), this._connected(null);
        let Z = lC.fromReadableStream(A, this.controller);
        for await (let I of Z) N0(this, EM, "m", Id1).call(this, I);
        if (Z.controller.signal?.aborted) throw new yY;
        N0(this, EM, "m", Yd1).call(this)
      } finally {
        if (B && G) B.removeEventListener("abort", G)
      }
    } [(Tp = new WeakMap, m$A = new WeakMap, _rA = new WeakMap, d$A = new WeakMap, c$A = new WeakMap, krA = new WeakMap, p$A = new WeakMap, Df = new WeakMap, l$A = new WeakMap, yrA = new WeakMap, xrA = new WeakMap, FGA = new WeakMap, vrA = new WeakMap, brA = new WeakMap, Gd1 = new WeakMap, EM = new WeakSet, Bd1 = function() {
      if (this.receivedMessages.length === 0) throw new vB("stream ended without producing a Message with role=assistant");
      return this.receivedMessages.at(-1)
    }, GRB = function() {
      if (this.receivedMessages.length === 0) throw new vB("stream ended without producing a Message with role=assistant");
      let Q = this.receivedMessages.at(-1).content.filter((B) => B.type === "text").map((B) => B.text);
      if (Q.length === 0) throw new vB("stream ended without producing a content block with type=text");
      return Q.join(" ")
    }, Zd1 = function() {
      if (this.ended) return;
      fB(this, Tp, void 0, "f")
    }, Id1 = function(Q) {
      if (this.ended) return;
      let B = N0(this, EM, "m", ZRB).call(this, Q);
      switch (this._emit("streamEvent", Q, B), Q.type) {
        case "content_block_delta": {
          let G = B.content.at(-1);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G.type === "text") this._emit("text", Q.delta.text, G.text || "");
              break
            }
            case "citations_delta": {
              if (G.type === "text") this._emit("citation", Q.delta.citation, G.citations ?? []);
              break
            }
            case "input_json_delta": {
              if (YRB(G) && G.input) this._emit("inputJson", Q.delta.partial_json, G.input);
              break
            }
            case "thinking_delta": {
              if (G.type === "thinking") this._emit("thinking", Q.delta.thinking, G.thinking);
              break
            }
            case "signature_delta": {
              if (G.type === "thinking") this._emit("signature", G.signature);
              break
            }
            default:
              JRB(Q.delta)
          }
          break
        }
        case "message_stop": {
          this._addMessageParam(B), this._addMessage(B, !0);
          break
        }
        case "content_block_stop": {
          this._emit("contentBlock", B.content.at(-1));
          break
        }
        case "message_start": {
          fB(this, Tp, B, "f");
          break
        }
        case "content_block_start":
        case "message_delta":
          break
      }
    }, Yd1 = function() {
      if (this.ended) throw new vB("stream has ended, this shouldn't happen");
      let Q = N0(this, Tp, "f");
      if (!Q) throw new vB("request ended without sending any chunks");
      return fB(this, Tp, void 0, "f"), Q
    }, ZRB = function(Q) {
      let B = N0(this, Tp, "f");
      if (Q.type === "message_start") {
        if (B) throw new vB(`Unexpected event order, got ${Q.type} before receiving "message_stop"`);
        return Q.message
      }
      if (!B) throw new vB(`Unexpected event order, got ${Q.type} before "message_start"`);
      switch (Q.type) {
        case "message_stop":
          return B;
        case "message_delta":
          if (B.stop_reason = Q.delta.stop_reason, B.stop_sequence = Q.delta.stop_sequence, B.usage.output_tokens = Q.usage.output_tokens, Q.usage.input_tokens != null) B.usage.input_tokens = Q.usage.input_tokens;
          if (Q.usage.cache_creation_input_tokens != null) B.usage.cache_creation_input_tokens = Q.usage.cache_creation_input_tokens;
          if (Q.usage.cache_read_input_tokens != null) B.usage.cache_read_input_tokens = Q.usage.cache_read_input_tokens;
          if (Q.usage.server_tool_use != null) B.usage.server_tool_use = Q.usage.server_tool_use;
          return B;
        case "content_block_start":
          return B.content.push({
            ...Q.content_block
          }), B;
        case "content_block_delta": {
          let G = B.content.at(Q.index);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                text: (G.text || "") + Q.delta.text
              };
              break
            }
            case "citations_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                citations: [...G.citations ?? [], Q.delta.citation]
              };
              break
            }
            case "input_json_delta": {
              if (G && YRB(G)) {
                let Z = G[IRB] || "";
                Z += Q.delta.partial_json;
                let I = {
                  ...G
                };
                if (Object.defineProperty(I, IRB, {
                    value: Z,
                    enumerable: !1,
                    writable: !0
                  }), Z) I.input = axA(Z);
                B.content[Q.index] = I
              }
              break
            }
            case "thinking_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                thinking: G.thinking + Q.delta.thinking
              };
              break
            }
            case "signature_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                signature: Q.delta.signature
              };
              break
            }
            default:
              JRB(Q.delta)
          }
          return B
        }
        case "content_block_stop":
          return B
      }
    }, Symbol.asyncIterator)]() {
      let A = [],
        Q = [],
        B = !1;
      return this.on("streamEvent", (G) => {
        let Z = Q.shift();
        if (Z) Z.resolve(G);
        else A.push(G)
      }), this.on("end", () => {
        B = !0;
        for (let G of Q) G.resolve(void 0);
        Q.length = 0
      }), this.on("abort", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), this.on("error", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), {
        next: async () => {
          if (!A.length) {
            if (B) return {
              value: void 0,
              done: !0
            };
            return new Promise((Z, I) => Q.push({
              resolve: Z,
              reject: I
            })).then((Z) => Z ? {
              value: Z,
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
      return new lC(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
    }
  }
})
// @from(Start 6756671, End 6756674)
n$A
// @from(Start 6756680, End 6757782)
Jd1 = L(() => {
  d_();
  CM();
  sm1();
  Yr();
  Mp();
  n$A = class n$A extends pY {
    create(A, Q) {
      return this._client.post("/v1/messages/batches", {
        body: A,
        ...Q
      })
    }
    retrieve(A, Q) {
      return this._client.get(IY`/v1/messages/batches/${A}`, Q)
    }
    list(A = {}, Q) {
      return this._client.getAPIList("/v1/messages/batches", NT, {
        query: A,
        ...Q
      })
    }
    delete(A, Q) {
      return this._client.delete(IY`/v1/messages/batches/${A}`, Q)
    }
    cancel(A, Q) {
      return this._client.post(IY`/v1/messages/batches/${A}/cancel`, Q)
    }
    async results(A, Q) {
      let B = await this.retrieve(A);
      if (!B.results_url) throw new vB(`No batch \`results_url\`; Has it finished processing? ${B.processing_status} - ${B.id}`);
      return this._client.get(B.results_url, {
        ...Q,
        headers: r4([{
          Accept: "application/binary"
        }, Q?.headers]),
        stream: !0,
        __binaryResponse: !0
      })._thenUnwrap((G, Z) => XGA.fromResponse(Z.response, Z.controller))
    }
  }
})
// @from(Start 6757788, End 6757790)
Gq
// @from(Start 6757792, End 6757795)
XRB
// @from(Start 6757801, End 6759365)
Wd1 = L(() => {
  WRB();
  Jd1();
  Jd1();
  im1();
  Gq = class Gq extends pY {
    constructor() {
      super(...arguments);
      this.batches = new n$A(this._client)
    }
    create(A, Q) {
      if (A.model in XRB) console.warn(`The model '${A.model}' is deprecated and will reach end-of-life on ${XRB[A.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
      let B = this._client._options.timeout;
      if (!A.stream && B == null) {
        let G = jrA[A.model] ?? void 0;
        B = this._client.calculateNonstreamingTimeout(A.max_tokens, G)
      }
      return this._client.post("/v1/messages", {
        body: A,
        timeout: B ?? 600000,
        ...Q,
        stream: A.stream ?? !1
      })
    }
    stream(A, Q) {
      return i$A.createMessage(this, A, Q)
    }
    countTokens(A, Q) {
      return this._client.post("/v1/messages/count_tokens", {
        body: A,
        ...Q
      })
    }
  };
  XRB = {
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
  };
  Gq.Batches = n$A
})
// @from(Start 6759371, End 6759374)
KGA
// @from(Start 6759380, End 6760106)
Xd1 = L(() => {
  d_();
  CM();
  Mp();
  KGA = class KGA extends pY {
    retrieve(A, Q = {}, B) {
      let {
        betas: G
      } = Q ?? {};
      return this._client.get(IY`/v1/models/${A}`, {
        ...B,
        headers: r4([{
          ...G?.toString() != null ? {
            "anthropic-beta": G?.toString()
          } : void 0
        }, B?.headers])
      })
    }
    list(A = {}, Q) {
      let {
        betas: B,
        ...G
      } = A ?? {};
      return this._client.getAPIList("/v1/models", NT, {
        query: G,
        ...Q,
        headers: r4([{
          ...B?.toString() != null ? {
            "anthropic-beta": B?.toString()
          } : void 0
        }, Q?.headers])
      })
    }
  }
})
// @from(Start 6760112, End 6760174)
a$A = L(() => {
  Ad1();
  Qd1();
  Wd1();
  Xd1();
  oOB()
})
// @from(Start 6760180, End 6760380)
s$A = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Start 6760382, End 6773348)
class FG {
  constructor({
    baseURL: A = s$A("ANTHROPIC_BASE_URL"),
    apiKey: Q = s$A("ANTHROPIC_API_KEY") ?? null,
    authToken: B = s$A("ANTHROPIC_AUTH_TOKEN") ?? null,
    ...G
  } = {}) {
    Vd1.add(this), hrA.set(this, void 0);
    let Z = {
      apiKey: Q,
      authToken: B,
      ...G,
      baseURL: A || "https://api.anthropic.com"
    };
    if (!Z.dangerouslyAllowBrowser && lOB()) throw new vB(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
    this.baseURL = Z.baseURL, this.timeout = Z.timeout ?? Fd1.DEFAULT_TIMEOUT, this.logger = Z.logger ?? console;
    let I = "warn";
    this.logLevel = I, this.logLevel = ZC1(Z.logLevel, "ClientOptions.logLevel", this) ?? ZC1(s$A("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? I, this.fetchOptions = Z.fetchOptions, this.maxRetries = Z.maxRetries ?? 2, this.fetch = Z.fetch ?? Zc0(), fB(this, hrA, nOB, "f"), this._options = Z, this.apiKey = typeof Q === "string" ? Q : null, this.authToken = B
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
    nulls: Q
  }) {
    if (A.get("x-api-key") || A.get("authorization")) return;
    if (this.apiKey && A.get("x-api-key")) return;
    if (Q.has("x-api-key")) return;
    if (this.authToken && A.get("authorization")) return;
    if (Q.has("authorization")) return;
    throw Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')
  }
  async authHeaders(A) {
    return r4([await this.apiKeyAuth(A), await this.bearerAuth(A)])
  }
  async apiKeyAuth(A) {
    if (this.apiKey == null) return;
    return r4([{
      "X-Api-Key": this.apiKey
    }])
  }
  async bearerAuth(A) {
    if (this.authToken == null) return;
    return r4([{
      Authorization: `Bearer ${this.authToken}`
    }])
  }
  stringifyQuery(A) {
    return Object.entries(A).filter(([Q, B]) => typeof B < "u").map(([Q, B]) => {
      if (typeof B === "string" || typeof B === "number" || typeof B === "boolean") return `${encodeURIComponent(Q)}=${encodeURIComponent(B)}`;
      if (B === null) return `${encodeURIComponent(Q)}=`;
      throw new vB(`Cannot stringify type ${typeof B}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`)
    }).join("&")
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${Lp}`
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${xm1()}`
  }
  makeStatusError(A, Q, B, G) {
    return n2.generate(A, Q, B, G)
  }
  buildURL(A, Q, B) {
    let G = !N0(this, Vd1, "m", VRB).call(this) && B || this.baseURL,
      Z = Vc0(A) ? new URL(A) : new URL(G + (G.endsWith("/") && A.startsWith("/") ? A.slice(1) : A)),
      I = this.defaultQuery();
    if (!Fc0(I)) Q = {
      ...I,
      ...Q
    };
    if (typeof Q === "object" && Q && !Array.isArray(Q)) Z.search = this.stringifyQuery(Q);
    return Z.toString()
  }
  _calculateNonstreamingTimeout(A) {
    if (3600 * A / 128000 > 600) throw new vB("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    return 600000
  }
  async prepareOptions(A) {}
  async prepareRequest(A, {
    url: Q,
    options: B
  }) {}
  get(A, Q) {
    return this.methodRequest("get", A, Q)
  }
  post(A, Q) {
    return this.methodRequest("post", A, Q)
  }
  patch(A, Q) {
    return this.methodRequest("patch", A, Q)
  }
  put(A, Q) {
    return this.methodRequest("put", A, Q)
  }
  delete(A, Q) {
    return this.methodRequest("delete", A, Q)
  }
  methodRequest(A, Q, B) {
    return this.request(Promise.resolve(B).then((G) => {
      return {
        method: A,
        path: Q,
        ...G
      }
    }))
  }
  request(A, Q = null) {
    return new Ze(this, this.makeRequest(A, Q, void 0))
  }
  async makeRequest(A, Q, B) {
    let G = await A,
      Z = G.maxRetries ?? this.maxRetries;
    if (Q == null) Q = Z;
    await this.prepareOptions(G);
    let {
      req: I,
      url: Y,
      timeout: J
    } = await this.buildRequest(G, {
      retryCount: Z - Q
    });
    await this.prepareRequest(I, {
      url: Y,
      options: G
    });
    let W = "log_" + (Math.random() * 16777216 | 0).toString(16).padStart(6, "0"),
      X = B === void 0 ? "" : `, retryOf: ${B}`,
      V = Date.now();
    if (qF(this).debug(`[${W}] sending request`, Hv({
        retryOfRequestLogID: B,
        method: G.method,
        url: Y,
        options: G,
        headers: I.headers
      })), G.signal?.aborted) throw new yY;
    let F = new AbortController,
      K = await this.fetchWithTimeout(Y, I, J, F).catch(MKA),
      D = Date.now();
    if (K instanceof globalThis.Error) {
      let E = `retrying, ${Q} attempts remaining`;
      if (G.signal?.aborted) throw new yY;
      let U = Dv(K) || /timed? ?out/i.test(String(K) + ("cause" in K ? String(K.cause) : ""));
      if (Q) return qF(this).info(`[${W}] connection ${U?"timed out":"failed"} - ${E}`), qF(this).debug(`[${W}] connection ${U?"timed out":"failed"} (${E})`, Hv({
        retryOfRequestLogID: B,
        url: Y,
        durationMs: D - V,
        message: K.message
      })), this.retryRequest(G, Q, B ?? W);
      if (qF(this).info(`[${W}] connection ${U?"timed out":"failed"} - error; no more retries left`), qF(this).debug(`[${W}] connection ${U?"timed out":"failed"} (error; no more retries left)`, Hv({
          retryOfRequestLogID: B,
          url: Y,
          durationMs: D - V,
          message: K.message
        })), U) throw new IS;
      throw new cC({
        cause: K
      })
    }
    let H = [...K.headers.entries()].filter(([E]) => E === "request-id").map(([E, U]) => ", " + E + ": " + JSON.stringify(U)).join(""),
      C = `[${W}${X}${H}] ${I.method} ${Y} ${K.ok?"succeeded":"failed"} with status ${K.status} in ${D-V}ms`;
    if (!K.ok) {
      let E = await this.shouldRetry(K);
      if (Q && E) {
        let T = `retrying, ${Q} attempts remaining`;
        return await Ic0(K.body), qF(this).info(`${C} - ${T}`), qF(this).debug(`[${W}] response error (${T})`, Hv({
          retryOfRequestLogID: B,
          url: K.url,
          status: K.status,
          headers: K.headers,
          durationMs: D - V
        })), this.retryRequest(G, Q, B ?? W, K.headers)
      }
      let U = E ? "error; no more retries left" : "error; not retryable";
      qF(this).info(`${C} - ${U}`);
      let q = await K.text().catch((T) => MKA(T).message),
        w = oxA(q),
        N = w ? void 0 : q;
      throw qF(this).debug(`[${W}] response error (${U})`, Hv({
        retryOfRequestLogID: B,
        url: K.url,
        status: K.status,
        headers: K.headers,
        message: N,
        durationMs: Date.now() - V
      })), this.makeStatusError(K.status, w, N, K.headers)
    }
    return qF(this).info(C), qF(this).debug(`[${W}] response start`, Hv({
      retryOfRequestLogID: B,
      url: K.url,
      status: K.status,
      headers: K.headers,
      durationMs: D - V
    })), {
      response: K,
      options: G,
      controller: F,
      requestLogID: W,
      retryOfRequestLogID: B,
      startTime: V
    }
  }
  getAPIList(A, Q, B) {
    return this.requestAPIList(Q, {
      method: "get",
      path: A,
      ...B
    })
  }
  requestAPIList(A, Q) {
    let B = this.makeRequest(Q, null, void 0);
    return new TrA(this, B, A)
  }
  async fetchWithTimeout(A, Q, B, G) {
    let {
      signal: Z,
      method: I,
      ...Y
    } = Q || {};
    if (Z) Z.addEventListener("abort", () => G.abort());
    let J = setTimeout(() => G.abort(), B),
      W = globalThis.ReadableStream && Y.body instanceof globalThis.ReadableStream || typeof Y.body === "object" && Y.body !== null && Symbol.asyncIterator in Y.body,
      X = {
        signal: G.signal,
        ...W ? {
          duplex: "half"
        } : {},
        method: "GET",
        ...Y
      };
    if (I) X.method = I.toUpperCase();
    try {
      return await this.fetch.call(void 0, A, X)
    } finally {
      clearTimeout(J)
    }
  }
  async shouldRetry(A) {
    let Q = A.headers.get("x-should-retry");
    if (Q === "true") return !0;
    if (Q === "false") return !1;
    if (A.status === 408) return !0;
    if (A.status === 409) return !0;
    if (A.status === 429) return !0;
    if (A.status >= 500) return !0;
    return !1
  }
  async retryRequest(A, Q, B, G) {
    let Z, I = G?.get("retry-after-ms");
    if (I) {
      let J = parseFloat(I);
      if (!Number.isNaN(J)) Z = J
    }
    let Y = G?.get("retry-after");
    if (Y && !Z) {
      let J = parseFloat(Y);
      if (!Number.isNaN(J)) Z = J * 1000;
      else Z = Date.parse(Y) - Date.now()
    }
    if (!(Z && 0 <= Z && Z < 60000)) {
      let J = A.maxRetries ?? this.maxRetries;
      Z = this.calculateDefaultRetryTimeoutMillis(Q, J)
    }
    return await mOB(Z), this.makeRequest(A, Q - 1, B)
  }
  calculateDefaultRetryTimeoutMillis(A, Q) {
    let Z = Q - A,
      I = Math.min(0.5 * Math.pow(2, Z), 8),
      Y = 1 - Math.random() * 0.25;
    return I * Y * 1000
  }
  calculateNonstreamingTimeout(A, Q) {
    if (3600000 * A / 128000 > 600000 || Q != null && A > Q) throw new vB("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    return 600000
  }
  async buildRequest(A, {
    retryCount: Q = 0
  } = {}) {
    let B = {
        ...A
      },
      {
        method: G,
        path: Z,
        query: I,
        defaultBaseURL: Y
      } = B,
      J = this.buildURL(Z, I, Y);
    if ("timeout" in B) Dc0("timeout", B.timeout);
    B.timeout = B.timeout ?? this.timeout;
    let {
      bodyHeaders: W,
      body: X
    } = this.buildBody({
      options: B
    }), V = await this.buildHeaders({
      options: A,
      method: G,
      bodyHeaders: W,
      retryCount: Q
    });
    return {
      req: {
        method: G,
        headers: V,
        ...B.signal && {
          signal: B.signal
        },
        ...globalThis.ReadableStream && X instanceof globalThis.ReadableStream && {
          duplex: "half"
        },
        ...X && {
          body: X
        },
        ...this.fetchOptions ?? {},
        ...B.fetchOptions ?? {}
      },
      url: J,
      timeout: B.timeout
    }
  }
  async buildHeaders({
    options: A,
    method: Q,
    bodyHeaders: B,
    retryCount: G
  }) {
    let Z = {};
    if (this.idempotencyHeader && Q !== "get") {
      if (!A.idempotencyKey) A.idempotencyKey = this.defaultIdempotencyKey();
      Z[this.idempotencyHeader] = A.idempotencyKey
    }
    let I = r4([Z, {
      Accept: "application/json",
      "User-Agent": this.getUserAgent(),
      "X-Stainless-Retry-Count": String(G),
      ...A.timeout ? {
        "X-Stainless-Timeout": String(Math.trunc(A.timeout / 1000))
      } : {},
      ...iOB(),
      ...this._options.dangerouslyAllowBrowser ? {
        "anthropic-dangerous-direct-browser-access": "true"
      } : void 0,
      "anthropic-version": "2023-06-01"
    }, await this.authHeaders(A), this._options.defaultHeaders, B, A.headers]);
    return this.validateHeaders(I), I.values
  }
  buildBody({
    options: {
      body: A,
      headers: Q
    }
  }) {
    if (!A) return {
      bodyHeaders: void 0,
      body: void 0
    };
    let B = r4([Q]);
    if (ArrayBuffer.isView(A) || A instanceof ArrayBuffer || A instanceof DataView || typeof A === "string" && B.values.has("content-type") || globalThis.Blob && A instanceof globalThis.Blob || A instanceof FormData || A instanceof URLSearchParams || globalThis.ReadableStream && A instanceof globalThis.ReadableStream) return {
      bodyHeaders: void 0,
      body: A
    };
    else if (typeof A === "object" && ((Symbol.asyncIterator in A) || (Symbol.iterator in A) && ("next" in A) && typeof A.next === "function")) return {
      bodyHeaders: void 0,
      body: sxA(A)
    };
    else return N0(this, hrA, "f").call(this, {
      body: A,
      headers: B
    })
  }
}
// @from(Start 6773353, End 6773356)
Vd1
// @from(Start 6773358, End 6773361)
Fd1
// @from(Start 6773363, End 6773366)
hrA
// @from(Start 6773368, End 6773371)
VRB
// @from(Start 6773373, End 6773393)
FRB = "\\n\\nHuman:"
// @from(Start 6773397, End 6773421)
KRB = "\\n\\nAssistant:"
// @from(Start 6773425, End 6773427)
MT
// @from(Start 6773433, End 6774506)
Hf = L(() => {
  Kv();
  Jr();
  vm1();
  pC();
  d_();
  cm1();
  a$A();
  OrA();
  Qd1();
  Xd1();
  Ad1();
  Wd1();
  vm1();
  CM();
  AvA();
  Jr();
  Fd1 = FG, hrA = new WeakMap, Vd1 = new WeakSet, VRB = function() {
    return this.baseURL !== "https://api.anthropic.com"
  };
  FG.Anthropic = Fd1;
  FG.HUMAN_PROMPT = FRB;
  FG.AI_PROMPT = KRB;
  FG.DEFAULT_TIMEOUT = 600000;
  FG.AnthropicError = vB;
  FG.APIError = n2;
  FG.APIConnectionError = cC;
  FG.APIConnectionTimeoutError = IS;
  FG.APIUserAbortError = yY;
  FG.NotFoundError = Ir;
  FG.ConflictError = TKA;
  FG.RateLimitError = jKA;
  FG.BadRequestError = OKA;
  FG.AuthenticationError = Zr;
  FG.InternalServerError = SKA;
  FG.PermissionDeniedError = RKA;
  FG.UnprocessableEntityError = PKA;
  FG.toFile = PrA;
  MT = class MT extends FG {
    constructor() {
      super(...arguments);
      this.completions = new Rp(this), this.messages = new Gq(this), this.models = new KGA(this), this.beta = new pH(this)
    }
  };
  MT.Completions = Rp;
  MT.Messages = Gq;
  MT.Models = KGA;
  MT.Beta = pH
})
// @from(Start 6774512, End 6785858)
Dd1 = z((e0G, urA) => {
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  var DRB, HRB, CRB, ERB, zRB, URB, $RB, wRB, qRB, grA, Kd1, NRB, LRB, DGA, MRB, ORB, RRB, TRB, PRB, jRB, SRB, _RB, kRB;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof urA === "object" && typeof e0G === "object") A(B(Q, B(e0G)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function(I, Y) {
        return G[I] = Z ? Z(I, Y) : Y
      }
    }
  })(function(A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function(B, G) {
      B.__proto__ = G
    } || function(B, G) {
      for (var Z in G)
        if (G.hasOwnProperty(Z)) B[Z] = G[Z]
    };
    DRB = function(B, G) {
      Q(B, G);

      function Z() {
        this.constructor = B
      }
      B.prototype = G === null ? Object.create(G) : (Z.prototype = G.prototype, new Z)
    }, HRB = Object.assign || function(B) {
      for (var G, Z = 1, I = arguments.length; Z < I; Z++) {
        G = arguments[Z];
        for (var Y in G)
          if (Object.prototype.hasOwnProperty.call(G, Y)) B[Y] = G[Y]
      }
      return B
    }, CRB = function(B, G) {
      var Z = {};
      for (var I in B)
        if (Object.prototype.hasOwnProperty.call(B, I) && G.indexOf(I) < 0) Z[I] = B[I];
      if (B != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var Y = 0, I = Object.getOwnPropertySymbols(B); Y < I.length; Y++)
          if (G.indexOf(I[Y]) < 0 && Object.prototype.propertyIsEnumerable.call(B, I[Y])) Z[I[Y]] = B[I[Y]]
      }
      return Z
    }, ERB = function(B, G, Z, I) {
      var Y = arguments.length,
        J = Y < 3 ? G : I === null ? I = Object.getOwnPropertyDescriptor(G, Z) : I,
        W;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") J = Reflect.decorate(B, G, Z, I);
      else
        for (var X = B.length - 1; X >= 0; X--)
          if (W = B[X]) J = (Y < 3 ? W(J) : Y > 3 ? W(G, Z, J) : W(G, Z)) || J;
      return Y > 3 && J && Object.defineProperty(G, Z, J), J
    }, zRB = function(B, G) {
      return function(Z, I) {
        G(Z, I, B)
      }
    }, URB = function(B, G) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(B, G)
    }, $RB = function(B, G, Z, I) {
      function Y(J) {
        return J instanceof Z ? J : new Z(function(W) {
          W(J)
        })
      }
      return new(Z || (Z = Promise))(function(J, W) {
        function X(K) {
          try {
            F(I.next(K))
          } catch (D) {
            W(D)
          }
        }

        function V(K) {
          try {
            F(I.throw(K))
          } catch (D) {
            W(D)
          }
        }

        function F(K) {
          K.done ? J(K.value) : Y(K.value).then(X, V)
        }
        F((I = I.apply(B, G || [])).next())
      })
    }, wRB = function(B, G) {
      var Z = {
          label: 0,
          sent: function() {
            if (J[0] & 1) throw J[1];
            return J[1]
          },
          trys: [],
          ops: []
        },
        I, Y, J, W;
      return W = {
        next: X(0),
        throw: X(1),
        return: X(2)
      }, typeof Symbol === "function" && (W[Symbol.iterator] = function() {
        return this
      }), W;

      function X(F) {
        return function(K) {
          return V([F, K])
        }
      }

      function V(F) {
        if (I) throw TypeError("Generator is already executing.");
        while (Z) try {
          if (I = 1, Y && (J = F[0] & 2 ? Y.return : F[0] ? Y.throw || ((J = Y.return) && J.call(Y), 0) : Y.next) && !(J = J.call(Y, F[1])).done) return J;
          if (Y = 0, J) F = [F[0] & 2, J.value];
          switch (F[0]) {
            case 0:
            case 1:
              J = F;
              break;
            case 4:
              return Z.label++, {
                value: F[1],
                done: !1
              };
            case 5:
              Z.label++, Y = F[1], F = [0];
              continue;
            case 7:
              F = Z.ops.pop(), Z.trys.pop();
              continue;
            default:
              if ((J = Z.trys, !(J = J.length > 0 && J[J.length - 1])) && (F[0] === 6 || F[0] === 2)) {
                Z = 0;
                continue
              }
              if (F[0] === 3 && (!J || F[1] > J[0] && F[1] < J[3])) {
                Z.label = F[1];
                break
              }
              if (F[0] === 6 && Z.label < J[1]) {
                Z.label = J[1], J = F;
                break
              }
              if (J && Z.label < J[2]) {
                Z.label = J[2], Z.ops.push(F);
                break
              }
              if (J[2]) Z.ops.pop();
              Z.trys.pop();
              continue
          }
          F = G.call(B, Z)
        } catch (K) {
          F = [6, K], Y = 0
        } finally {
          I = J = 0
        }
        if (F[0] & 5) throw F[1];
        return {
          value: F[0] ? F[1] : void 0,
          done: !0
        }
      }
    }, kRB = function(B, G, Z, I) {
      if (I === void 0) I = Z;
      B[I] = G[Z]
    }, qRB = function(B, G) {
      for (var Z in B)
        if (Z !== "default" && !G.hasOwnProperty(Z)) G[Z] = B[Z]
    }, grA = function(B) {
      var G = typeof Symbol === "function" && Symbol.iterator,
        Z = G && B[G],
        I = 0;
      if (Z) return Z.call(B);
      if (B && typeof B.length === "number") return {
        next: function() {
          if (B && I >= B.length) B = void 0;
          return {
            value: B && B[I++],
            done: !B
          }
        }
      };
      throw TypeError(G ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, Kd1 = function(B, G) {
      var Z = typeof Symbol === "function" && B[Symbol.iterator];
      if (!Z) return B;
      var I = Z.call(B),
        Y, J = [],
        W;
      try {
        while ((G === void 0 || G-- > 0) && !(Y = I.next()).done) J.push(Y.value)
      } catch (X) {
        W = {
          error: X
        }
      } finally {
        try {
          if (Y && !Y.done && (Z = I.return)) Z.call(I)
        } finally {
          if (W) throw W.error
        }
      }
      return J
    }, NRB = function() {
      for (var B = [], G = 0; G < arguments.length; G++) B = B.concat(Kd1(arguments[G]));
      return B
    }, LRB = function() {
      for (var B = 0, G = 0, Z = arguments.length; G < Z; G++) B += arguments[G].length;
      for (var I = Array(B), Y = 0, G = 0; G < Z; G++)
        for (var J = arguments[G], W = 0, X = J.length; W < X; W++, Y++) I[Y] = J[W];
      return I
    }, DGA = function(B) {
      return this instanceof DGA ? (this.v = B, this) : new DGA(B)
    }, MRB = function(B, G, Z) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var I = Z.apply(B, G || []),
        Y, J = [];
      return Y = {}, W("next"), W("throw"), W("return"), Y[Symbol.asyncIterator] = function() {
        return this
      }, Y;

      function W(H) {
        if (I[H]) Y[H] = function(C) {
          return new Promise(function(E, U) {
            J.push([H, C, E, U]) > 1 || X(H, C)
          })
        }
      }

      function X(H, C) {
        try {
          V(I[H](C))
        } catch (E) {
          D(J[0][3], E)
        }
      }

      function V(H) {
        H.value instanceof DGA ? Promise.resolve(H.value.v).then(F, K) : D(J[0][2], H)
      }

      function F(H) {
        X("next", H)
      }

      function K(H) {
        X("throw", H)
      }

      function D(H, C) {
        if (H(C), J.shift(), J.length) X(J[0][0], J[0][1])
      }
    }, ORB = function(B) {
      var G, Z;
      return G = {}, I("next"), I("throw", function(Y) {
        throw Y
      }), I("return"), G[Symbol.iterator] = function() {
        return this
      }, G;

      function I(Y, J) {
        G[Y] = B[Y] ? function(W) {
          return (Z = !Z) ? {
            value: DGA(B[Y](W)),
            done: Y === "return"
          } : J ? J(W) : W
        } : J
      }
    }, RRB = function(B) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var G = B[Symbol.asyncIterator],
        Z;
      return G ? G.call(B) : (B = typeof grA === "function" ? grA(B) : B[Symbol.iterator](), Z = {}, I("next"), I("throw"), I("return"), Z[Symbol.asyncIterator] = function() {
        return this
      }, Z);

      function I(J) {
        Z[J] = B[J] && function(W) {
          return new Promise(function(X, V) {
            W = B[J](W), Y(X, V, W.done, W.value)
          })
        }
      }

      function Y(J, W, X, V) {
        Promise.resolve(V).then(function(F) {
          J({
            value: F,
            done: X
          })
        }, W)
      }
    }, TRB = function(B, G) {
      if (Object.defineProperty) Object.defineProperty(B, "raw", {
        value: G
      });
      else B.raw = G;
      return B
    }, PRB = function(B) {
      if (B && B.__esModule) return B;
      var G = {};
      if (B != null) {
        for (var Z in B)
          if (Object.hasOwnProperty.call(B, Z)) G[Z] = B[Z]
      }
      return G.default = B, G
    }, jRB = function(B) {
      return B && B.__esModule ? B : {
        default: B
      }
    }, SRB = function(B, G) {
      if (!G.has(B)) throw TypeError("attempted to get private field on non-instance");
      return G.get(B)
    }, _RB = function(B, G, Z) {
      if (!G.has(B)) throw TypeError("attempted to set private field on non-instance");
      return G.set(B, Z), Z
    }, A("__extends", DRB), A("__assign", HRB), A("__rest", CRB), A("__decorate", ERB), A("__param", zRB), A("__metadata", URB), A("__awaiter", $RB), A("__generator", wRB), A("__exportStar", qRB), A("__createBinding", kRB), A("__values", grA), A("__read", Kd1), A("__spread", NRB), A("__spreadArrays", LRB), A("__await", DGA), A("__asyncGenerator", MRB), A("__asyncDelegator", ORB), A("__asyncValues", RRB), A("__makeTemplateObject", TRB), A("__importStar", PRB), A("__importDefault", jRB), A("__classPrivateFieldGet", SRB), A("__classPrivateFieldSet", _RB)
  })
})
// @from(Start 6785864, End 6787034)
Hd1 = z((yRB) => {
  Object.defineProperty(yRB, "__esModule", {
    value: !0
  });
  yRB.MAX_HASHABLE_LENGTH = yRB.INIT = yRB.KEY = yRB.DIGEST_LENGTH = yRB.BLOCK_SIZE = void 0;
  yRB.BLOCK_SIZE = 64;
  yRB.DIGEST_LENGTH = 32;
  yRB.KEY = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
  yRB.INIT = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
  yRB.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1
})
// @from(Start 6787040, End 6790184)
fRB = z((vRB) => {
  Object.defineProperty(vRB, "__esModule", {
    value: !0
  });
  vRB.RawSha256 = void 0;
  var zM = Hd1(),
    Gw6 = function() {
      function A() {
        this.state = Int32Array.from(zM.INIT), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1
      }
      return A.prototype.update = function(Q) {
        if (this.finished) throw Error("Attempted to update an already finished hash.");
        var B = 0,
          G = Q.byteLength;
        if (this.bytesHashed += G, this.bytesHashed * 8 > zM.MAX_HASHABLE_LENGTH) throw Error("Cannot hash more than 2^53 - 1 bits");
        while (G > 0)
          if (this.buffer[this.bufferLength++] = Q[B++], G--, this.bufferLength === zM.BLOCK_SIZE) this.hashBuffer(), this.bufferLength = 0
      }, A.prototype.digest = function() {
        if (!this.finished) {
          var Q = this.bytesHashed * 8,
            B = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength),
            G = this.bufferLength;
          if (B.setUint8(this.bufferLength++, 128), G % zM.BLOCK_SIZE >= zM.BLOCK_SIZE - 8) {
            for (var Z = this.bufferLength; Z < zM.BLOCK_SIZE; Z++) B.setUint8(Z, 0);
            this.hashBuffer(), this.bufferLength = 0
          }
          for (var Z = this.bufferLength; Z < zM.BLOCK_SIZE - 8; Z++) B.setUint8(Z, 0);
          B.setUint32(zM.BLOCK_SIZE - 8, Math.floor(Q / 4294967296), !0), B.setUint32(zM.BLOCK_SIZE - 4, Q), this.hashBuffer(), this.finished = !0
        }
        var I = new Uint8Array(zM.DIGEST_LENGTH);
        for (var Z = 0; Z < 8; Z++) I[Z * 4] = this.state[Z] >>> 24 & 255, I[Z * 4 + 1] = this.state[Z] >>> 16 & 255, I[Z * 4 + 2] = this.state[Z] >>> 8 & 255, I[Z * 4 + 3] = this.state[Z] >>> 0 & 255;
        return I
      }, A.prototype.hashBuffer = function() {
        var Q = this,
          B = Q.buffer,
          G = Q.state,
          Z = G[0],
          I = G[1],
          Y = G[2],
          J = G[3],
          W = G[4],
          X = G[5],
          V = G[6],
          F = G[7];
        for (var K = 0; K < zM.BLOCK_SIZE; K++) {
          if (K < 16) this.temp[K] = (B[K * 4] & 255) << 24 | (B[K * 4 + 1] & 255) << 16 | (B[K * 4 + 2] & 255) << 8 | B[K * 4 + 3] & 255;
          else {
            var D = this.temp[K - 2],
              H = (D >>> 17 | D << 15) ^ (D >>> 19 | D << 13) ^ D >>> 10;
            D = this.temp[K - 15];
            var C = (D >>> 7 | D << 25) ^ (D >>> 18 | D << 14) ^ D >>> 3;
            this.temp[K] = (H + this.temp[K - 7] | 0) + (C + this.temp[K - 16] | 0)
          }
          var E = (((W >>> 6 | W << 26) ^ (W >>> 11 | W << 21) ^ (W >>> 25 | W << 7)) + (W & X ^ ~W & V) | 0) + (F + (zM.KEY[K] + this.temp[K] | 0) | 0) | 0,
            U = ((Z >>> 2 | Z << 30) ^ (Z >>> 13 | Z << 19) ^ (Z >>> 22 | Z << 10)) + (Z & I ^ Z & Y ^ I & Y) | 0;
          F = V, V = X, X = W, W = J + E | 0, J = Y, Y = I, I = Z, Z = E + U | 0
        }
        G[0] += Z, G[1] += I, G[2] += Y, G[3] += J, G[4] += W, G[5] += X, G[6] += V, G[7] += F
      }, A
    }();
  vRB.RawSha256 = Gw6
})
// @from(Start 6790190, End 6791478)
uRB = z((hRB) => {
  Object.defineProperty(hRB, "__esModule", {
    value: !0
  });
  hRB.toUtf8 = hRB.fromUtf8 = void 0;
  var Zw6 = (A) => {
    let Q = [];
    for (let B = 0, G = A.length; B < G; B++) {
      let Z = A.charCodeAt(B);
      if (Z < 128) Q.push(Z);
      else if (Z < 2048) Q.push(Z >> 6 | 192, Z & 63 | 128);
      else if (B + 1 < A.length && (Z & 64512) === 55296 && (A.charCodeAt(B + 1) & 64512) === 56320) {
        let I = 65536 + ((Z & 1023) << 10) + (A.charCodeAt(++B) & 1023);
        Q.push(I >> 18 | 240, I >> 12 & 63 | 128, I >> 6 & 63 | 128, I & 63 | 128)
      } else Q.push(Z >> 12 | 224, Z >> 6 & 63 | 128, Z & 63 | 128)
    }
    return Uint8Array.from(Q)
  };
  hRB.fromUtf8 = Zw6;
  var Iw6 = (A) => {
    let Q = "";
    for (let B = 0, G = A.length; B < G; B++) {
      let Z = A[B];
      if (Z < 128) Q += String.fromCharCode(Z);
      else if (192 <= Z && Z < 224) {
        let I = A[++B];
        Q += String.fromCharCode((Z & 31) << 6 | I & 63)
      } else if (240 <= Z && Z < 365) {
        let Y = "%" + [Z, A[++B], A[++B], A[++B]].map((J) => J.toString(16)).join("%");
        Q += decodeURIComponent(Y)
      } else Q += String.fromCharCode((Z & 15) << 12 | (A[++B] & 63) << 6 | A[++B] & 63)
    }
    return Q
  };
  hRB.toUtf8 = Iw6
})
// @from(Start 6791484, End 6791784)
cRB = z((mRB) => {
  Object.defineProperty(mRB, "__esModule", {
    value: !0
  });
  mRB.toUtf8 = mRB.fromUtf8 = void 0;

  function Jw6(A) {
    return new TextEncoder().encode(A)
  }
  mRB.fromUtf8 = Jw6;

  function Ww6(A) {
    return new TextDecoder("utf-8").decode(A)
  }
  mRB.toUtf8 = Ww6
})
// @from(Start 6791790, End 6792185)
Cd1 = z((iRB) => {
  Object.defineProperty(iRB, "__esModule", {
    value: !0
  });
  iRB.toUtf8 = iRB.fromUtf8 = void 0;
  var pRB = uRB(),
    lRB = cRB(),
    Vw6 = (A) => typeof TextEncoder === "function" ? (0, lRB.fromUtf8)(A) : (0, pRB.fromUtf8)(A);
  iRB.fromUtf8 = Vw6;
  var Fw6 = (A) => typeof TextDecoder === "function" ? (0, lRB.toUtf8)(A) : (0, pRB.toUtf8)(A);
  iRB.toUtf8 = Fw6
})
// @from(Start 6792191, End 6792741)
rRB = z((aRB) => {
  Object.defineProperty(aRB, "__esModule", {
    value: !0
  });
  aRB.convertToBuffer = void 0;
  var Dw6 = Cd1(),
    Hw6 = typeof Buffer < "u" && Buffer.from ? function(A) {
      return Buffer.from(A, "utf8")
    } : Dw6.fromUtf8;

  function Cw6(A) {
    if (A instanceof Uint8Array) return A;
    if (typeof A === "string") return Hw6(A);
    if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(A)
  }
  aRB.convertToBuffer = Cw6
})
// @from(Start 6792747, End 6792994)
eRB = z((oRB) => {
  Object.defineProperty(oRB, "__esModule", {
    value: !0
  });
  oRB.isEmptyData = void 0;

  function Ew6(A) {
    if (typeof A === "string") return A.length === 0;
    return A.byteLength === 0
  }
  oRB.isEmptyData = Ew6
})
// @from(Start 6793000, End 6793262)
BTB = z((ATB) => {
  Object.defineProperty(ATB, "__esModule", {
    value: !0
  });
  ATB.numToUint8 = void 0;

  function zw6(A) {
    return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
  }
  ATB.numToUint8 = zw6
})
// @from(Start 6793268, End 6793624)
ITB = z((GTB) => {
  Object.defineProperty(GTB, "__esModule", {
    value: !0
  });
  GTB.uint32ArrayFrom = void 0;

  function Uw6(A) {
    if (!Uint32Array.from) {
      var Q = new Uint32Array(A.length),
        B = 0;
      while (B < A.length) Q[B] = A[B], B += 1;
      return Q
    }
    return Uint32Array.from(A)
  }
  GTB.uint32ArrayFrom = Uw6
})
// @from(Start 6793630, End 6794410)
YTB = z((HGA) => {
  Object.defineProperty(HGA, "__esModule", {
    value: !0
  });
  HGA.uint32ArrayFrom = HGA.numToUint8 = HGA.isEmptyData = HGA.convertToBuffer = void 0;
  var $w6 = rRB();
  Object.defineProperty(HGA, "convertToBuffer", {
    enumerable: !0,
    get: function() {
      return $w6.convertToBuffer
    }
  });
  var ww6 = eRB();
  Object.defineProperty(HGA, "isEmptyData", {
    enumerable: !0,
    get: function() {
      return ww6.isEmptyData
    }
  });
  var qw6 = BTB();
  Object.defineProperty(HGA, "numToUint8", {
    enumerable: !0,
    get: function() {
      return qw6.numToUint8
    }
  });
  var Nw6 = ITB();
  Object.defineProperty(HGA, "uint32ArrayFrom", {
    enumerable: !0,
    get: function() {
      return Nw6.uint32ArrayFrom
    }
  })
})
// @from(Start 6794416, End 6796177)
VTB = z((WTB) => {
  Object.defineProperty(WTB, "__esModule", {
    value: !0
  });
  WTB.Sha256 = void 0;
  var JTB = Dd1(),
    drA = Hd1(),
    mrA = fRB(),
    Ed1 = YTB(),
    Mw6 = function() {
      function A(Q) {
        this.secret = Q, this.hash = new mrA.RawSha256, this.reset()
      }
      return A.prototype.update = function(Q) {
        if ((0, Ed1.isEmptyData)(Q) || this.error) return;
        try {
          this.hash.update((0, Ed1.convertToBuffer)(Q))
        } catch (B) {
          this.error = B
        }
      }, A.prototype.digestSync = function() {
        if (this.error) throw this.error;
        if (this.outer) {
          if (!this.outer.finished) this.outer.update(this.hash.digest());
          return this.outer.digest()
        }
        return this.hash.digest()
      }, A.prototype.digest = function() {
        return JTB.__awaiter(this, void 0, void 0, function() {
          return JTB.__generator(this, function(Q) {
            return [2, this.digestSync()]
          })
        })
      }, A.prototype.reset = function() {
        if (this.hash = new mrA.RawSha256, this.secret) {
          this.outer = new mrA.RawSha256;
          var Q = Ow6(this.secret),
            B = new Uint8Array(drA.BLOCK_SIZE);
          B.set(Q);
          for (var G = 0; G < drA.BLOCK_SIZE; G++) Q[G] ^= 54, B[G] ^= 92;
          this.hash.update(Q), this.outer.update(B);
          for (var G = 0; G < Q.byteLength; G++) Q[G] = 0
        }
      }, A
    }();
  WTB.Sha256 = Mw6;

  function Ow6(A) {
    var Q = (0, Ed1.convertToBuffer)(A);
    if (Q.byteLength > drA.BLOCK_SIZE) {
      var B = new mrA.RawSha256;
      B.update(Q), Q = B.digest()
    }
    var G = new Uint8Array(drA.BLOCK_SIZE);
    return G.set(Q), G
  }
})
// @from(Start 6796183, End 6796319)
FTB = z((zd1) => {
  Object.defineProperty(zd1, "__esModule", {
    value: !0
  });
  var Rw6 = Dd1();
  Rw6.__exportStar(VTB(), zd1)
})
// @from(Start 6796325, End 6799108)
qTB = z((CQG, wTB) => {
  var {
    defineProperty: crA,
    getOwnPropertyDescriptor: Tw6,
    getOwnPropertyNames: Pw6
  } = Object, jw6 = Object.prototype.hasOwnProperty, prA = (A, Q) => crA(A, "name", {
    value: Q,
    configurable: !0
  }), Sw6 = (A, Q) => {
    for (var B in Q) crA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, _w6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Pw6(Q))
        if (!jw6.call(A, Z) && Z !== B) crA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Tw6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, kw6 = (A) => _w6(crA({}, "__esModule", {
    value: !0
  }), A), KTB = {};
  Sw6(KTB, {
    AlgorithmId: () => ETB,
    EndpointURLScheme: () => CTB,
    FieldPosition: () => zTB,
    HttpApiKeyAuthLocation: () => HTB,
    HttpAuthLocation: () => DTB,
    IniSectionType: () => UTB,
    RequestHandlerProtocol: () => $TB,
    SMITHY_CONTEXT_KEY: () => fw6,
    getDefaultClientConfiguration: () => vw6,
    resolveDefaultRuntimeConfig: () => bw6
  });
  wTB.exports = kw6(KTB);
  var DTB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(DTB || {}),
    HTB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(HTB || {}),
    CTB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(CTB || {}),
    ETB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(ETB || {}),
    yw6 = prA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    xw6 = prA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    vw6 = prA((A) => {
      return yw6(A)
    }, "getDefaultClientConfiguration"),
    bw6 = prA((A) => {
      return xw6(A)
    }, "resolveDefaultRuntimeConfig"),
    zTB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(zTB || {}),
    fw6 = "__smithy_context",
    UTB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(UTB || {}),
    $TB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })($TB || {})
})
// @from(Start 6799114, End 6803621)
TTB = z((EQG, RTB) => {
  var {
    defineProperty: lrA,
    getOwnPropertyDescriptor: hw6,
    getOwnPropertyNames: gw6
  } = Object, uw6 = Object.prototype.hasOwnProperty, Pp = (A, Q) => lrA(A, "name", {
    value: Q,
    configurable: !0
  }), mw6 = (A, Q) => {
    for (var B in Q) lrA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, dw6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gw6(Q))
        if (!uw6.call(A, Z) && Z !== B) lrA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hw6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cw6 = (A) => dw6(lrA({}, "__esModule", {
    value: !0
  }), A), NTB = {};
  mw6(NTB, {
    Field: () => iw6,
    Fields: () => nw6,
    HttpRequest: () => aw6,
    HttpResponse: () => sw6,
    IHttpRequest: () => LTB.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => pw6,
    isValidHostname: () => OTB,
    resolveHttpHandlerRuntimeConfig: () => lw6
  });
  RTB.exports = cw6(NTB);
  var pw6 = Pp((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    lw6 = Pp((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    LTB = qTB(),
    iw6 = class {
      static {
        Pp(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = LTB.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    nw6 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Pp(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    aw6 = class A {
      static {
        Pp(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = MTB(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function MTB(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Pp(MTB, "cloneQuery");
  var sw6 = class {
    static {
      Pp(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function OTB(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Pp(OTB, "isValidHostname")
})
// @from(Start 6803627, End 6804680)
_TB = z((wQG, STB) => {
  var {
    defineProperty: irA,
    getOwnPropertyDescriptor: rw6,
    getOwnPropertyNames: ow6
  } = Object, tw6 = Object.prototype.hasOwnProperty, Ud1 = (A, Q) => irA(A, "name", {
    value: Q,
    configurable: !0
  }), ew6 = (A, Q) => {
    for (var B in Q) irA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Aq6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ow6(Q))
        if (!tw6.call(A, Z) && Z !== B) irA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = rw6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Qq6 = (A) => Aq6(irA({}, "__esModule", {
    value: !0
  }), A), PTB = {};
  ew6(PTB, {
    escapeUri: () => jTB,
    escapeUriPath: () => Gq6
  });
  STB.exports = Qq6(PTB);
  var jTB = Ud1((A) => encodeURIComponent(A).replace(/[!'()*]/g, Bq6), "escapeUri"),
    Bq6 = Ud1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    Gq6 = Ud1((A) => A.split("/").map(jTB).join("/"), "escapeUriPath")
})
// @from(Start 6804686, End 6805937)
vTB = z((qQG, xTB) => {
  var {
    defineProperty: nrA,
    getOwnPropertyDescriptor: Zq6,
    getOwnPropertyNames: Iq6
  } = Object, Yq6 = Object.prototype.hasOwnProperty, Jq6 = (A, Q) => nrA(A, "name", {
    value: Q,
    configurable: !0
  }), Wq6 = (A, Q) => {
    for (var B in Q) nrA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Xq6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Iq6(Q))
        if (!Yq6.call(A, Z) && Z !== B) nrA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Zq6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Vq6 = (A) => Xq6(nrA({}, "__esModule", {
    value: !0
  }), A), kTB = {};
  Wq6(kTB, {
    buildQueryString: () => yTB
  });
  xTB.exports = Vq6(kTB);
  var $d1 = _TB();

  function yTB(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = (0, $d1.escapeUri)(B), Array.isArray(G))
        for (let Z = 0, I = G.length; Z < I; Z++) Q.push(`${B}=${(0,$d1.escapeUri)(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${(0,$d1.escapeUri)(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  Jq6(yTB, "buildQueryString")
})
// @from(Start 6805943, End 6806430)
hTB = z((bTB) => {
  Object.defineProperty(bTB, "__esModule", {
    value: !0
  });
  bTB.fromBase64 = void 0;
  var Fq6 = hI(),
    Kq6 = /^[A-Za-z0-9+/]*={0,2}$/,
    Dq6 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!Kq6.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, Fq6.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  bTB.fromBase64 = Dq6
})
// @from(Start 6806436, End 6807015)
mTB = z((gTB) => {
  Object.defineProperty(gTB, "__esModule", {
    value: !0
  });
  gTB.toBase64 = void 0;
  var Hq6 = hI(),
    Cq6 = O2(),
    Eq6 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, Cq6.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Hq6.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  gTB.toBase64 = Eq6
})
// @from(Start 6807021, End 6807717)
pTB = z((MQG, arA) => {
  var {
    defineProperty: dTB,
    getOwnPropertyDescriptor: zq6,
    getOwnPropertyNames: Uq6
  } = Object, $q6 = Object.prototype.hasOwnProperty, wd1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Uq6(Q))
        if (!$q6.call(A, Z) && Z !== B) dTB(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = zq6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cTB = (A, Q, B) => (wd1(A, Q, "default"), B && wd1(B, Q, "default")), wq6 = (A) => wd1(dTB({}, "__esModule", {
    value: !0
  }), A), qd1 = {};
  arA.exports = wq6(qd1);
  cTB(qd1, hTB(), arA.exports);
  cTB(qd1, mTB(), arA.exports)
})
// @from(Start 6807723, End 6813688)
Ld1 = z((OQG, oTB) => {
  var {
    defineProperty: rrA,
    getOwnPropertyDescriptor: qq6,
    getOwnPropertyNames: Nq6
  } = Object, Lq6 = Object.prototype.hasOwnProperty, c_ = (A, Q) => rrA(A, "name", {
    value: Q,
    configurable: !0
  }), Mq6 = (A, Q) => {
    for (var B in Q) rrA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Oq6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Nq6(Q))
        if (!Lq6.call(A, Z) && Z !== B) rrA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qq6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Rq6 = (A) => Oq6(rrA({}, "__esModule", {
    value: !0
  }), A), iTB = {};
  Mq6(iTB, {
    FetchHttpHandler: () => Pq6,
    keepAliveSupport: () => srA,
    streamCollector: () => Sq6
  });
  oTB.exports = Rq6(iTB);
  var lTB = TTB(),
    Tq6 = vTB();

  function Nd1(A, Q) {
    return new Request(A, Q)
  }
  c_(Nd1, "createRequest");

  function nTB(A = 0) {
    return new Promise((Q, B) => {
      if (A) setTimeout(() => {
        let G = Error(`Request did not complete within ${A} ms`);
        G.name = "TimeoutError", B(G)
      }, A)
    })
  }
  c_(nTB, "requestTimeout");
  var srA = {
      supported: void 0
    },
    Pq6 = class A {
      static {
        c_(this, "FetchHttpHandler")
      }
      static create(Q) {
        if (typeof Q?.handle === "function") return Q;
        return new A(Q)
      }
      constructor(Q) {
        if (typeof Q === "function") this.configProvider = Q().then((B) => B || {});
        else this.config = Q ?? {}, this.configProvider = Promise.resolve(this.config);
        if (srA.supported === void 0) srA.supported = Boolean(typeof Request < "u" && "keepalive" in Nd1("https://[::1]"))
      }
      destroy() {}
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) this.config = await this.configProvider;
        let G = this.config.requestTimeout,
          Z = this.config.keepAlive === !0,
          I = this.config.credentials;
        if (B?.aborted) {
          let U = Error("Request aborted");
          return U.name = "AbortError", Promise.reject(U)
        }
        let Y = Q.path,
          J = (0, Tq6.buildQueryString)(Q.query || {});
        if (J) Y += `?${J}`;
        if (Q.fragment) Y += `#${Q.fragment}`;
        let W = "";
        if (Q.username != null || Q.password != null) {
          let U = Q.username ?? "",
            q = Q.password ?? "";
          W = `${U}:${q}@`
        }
        let {
          port: X,
          method: V
        } = Q, F = `${Q.protocol}//${W}${Q.hostname}${X?`:${X}`:""}${Y}`, K = V === "GET" || V === "HEAD" ? void 0 : Q.body, D = {
          body: K,
          headers: new Headers(Q.headers),
          method: V,
          credentials: I
        };
        if (this.config?.cache) D.cache = this.config.cache;
        if (K) D.duplex = "half";
        if (typeof AbortController < "u") D.signal = B;
        if (srA.supported) D.keepalive = Z;
        if (typeof this.config.requestInit === "function") Object.assign(D, this.config.requestInit(Q));
        let H = c_(() => {}, "removeSignalEventListener"),
          C = Nd1(F, D),
          E = [fetch(C).then((U) => {
            let q = U.headers,
              w = {};
            for (let R of q.entries()) w[R[0]] = R[1];
            if (U.body == null) return U.blob().then((R) => ({
              response: new lTB.HttpResponse({
                headers: w,
                reason: U.statusText,
                statusCode: U.status,
                body: R
              })
            }));
            return {
              response: new lTB.HttpResponse({
                headers: w,
                reason: U.statusText,
                statusCode: U.status,
                body: U.body
              })
            }
          }), nTB(G)];
        if (B) E.push(new Promise((U, q) => {
          let w = c_(() => {
            let N = Error("Request aborted");
            N.name = "AbortError", q(N)
          }, "onAbort");
          if (typeof B.addEventListener === "function") {
            let N = B;
            N.addEventListener("abort", w, {
              once: !0
            }), H = c_(() => N.removeEventListener("abort", w), "removeSignalEventListener")
          } else B.onabort = w
        }));
        return Promise.race(E).finally(H)
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return G[Q] = B, G
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
    },
    jq6 = pTB(),
    Sq6 = c_(async (A) => {
      if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
        if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
        return aTB(A)
      }
      return sTB(A)
    }, "streamCollector");
  async function aTB(A) {
    let Q = await rTB(A),
      B = (0, jq6.fromBase64)(Q);
    return new Uint8Array(B)
  }
  c_(aTB, "collectBlob");
  async function sTB(A) {
    let Q = [],
      B = A.getReader(),
      G = !1,
      Z = 0;
    while (!G) {
      let {
        done: J,
        value: W
      } = await B.read();
      if (W) Q.push(W), Z += W.length;
      G = J
    }
    let I = new Uint8Array(Z),
      Y = 0;
    for (let J of Q) I.set(J, Y), Y += J.length;
    return I
  }
  c_(sTB, "collectStream");

  function rTB(A) {
    return new Promise((Q, B) => {
      let G = new FileReader;
      G.onloadend = () => {
        if (G.readyState !== 2) return B(Error("Reader aborted too early"));
        let Z = G.result ?? "",
          I = Z.indexOf(","),
          Y = I > -1 ? I + 1 : Z.length;
        Q(Z.substring(Y))
      }, G.onabort = () => B(Error("Read aborted")), G.onerror = () => B(G.error), G.readAsDataURL(A)
    })
  }
  c_(rTB, "readToBase64")
})
// @from(Start 6813694, End 6816597)
Md1 = z((RQG, YPB) => {
  var {
    defineProperty: orA,
    getOwnPropertyDescriptor: _q6,
    getOwnPropertyNames: kq6
  } = Object, yq6 = Object.prototype.hasOwnProperty, trA = (A, Q) => orA(A, "name", {
    value: Q,
    configurable: !0
  }), xq6 = (A, Q) => {
    for (var B in Q) orA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vq6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kq6(Q))
        if (!yq6.call(A, Z) && Z !== B) orA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _q6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bq6 = (A) => vq6(orA({}, "__esModule", {
    value: !0
  }), A), tTB = {};
  xq6(tTB, {
    AlgorithmId: () => BPB,
    EndpointURLScheme: () => QPB,
    FieldPosition: () => GPB,
    HttpApiKeyAuthLocation: () => APB,
    HttpAuthLocation: () => eTB,
    IniSectionType: () => ZPB,
    RequestHandlerProtocol: () => IPB,
    SMITHY_CONTEXT_KEY: () => mq6,
    getDefaultClientConfiguration: () => gq6,
    resolveDefaultRuntimeConfig: () => uq6
  });
  YPB.exports = bq6(tTB);
  var eTB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(eTB || {}),
    APB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(APB || {}),
    QPB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(QPB || {}),
    BPB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(BPB || {}),
    fq6 = trA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        _checksumAlgorithms: Q,
        addChecksumAlgorithm(B) {
          this._checksumAlgorithms.push(B)
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms
        }
      }
    }, "getChecksumConfiguration"),
    hq6 = trA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    gq6 = trA((A) => {
      return {
        ...fq6(A)
      }
    }, "getDefaultClientConfiguration"),
    uq6 = trA((A) => {
      return {
        ...hq6(A)
      }
    }, "resolveDefaultRuntimeConfig"),
    GPB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(GPB || {}),
    mq6 = "__smithy_context",
    ZPB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(ZPB || {}),
    IPB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(IPB || {})
})
// @from(Start 6816603, End 6820952)
Od1 = z((TQG, HPB) => {
  var {
    defineProperty: erA,
    getOwnPropertyDescriptor: dq6,
    getOwnPropertyNames: cq6
  } = Object, pq6 = Object.prototype.hasOwnProperty, jp = (A, Q) => erA(A, "name", {
    value: Q,
    configurable: !0
  }), lq6 = (A, Q) => {
    for (var B in Q) erA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, iq6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of cq6(Q))
        if (!pq6.call(A, Z) && Z !== B) erA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = dq6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, nq6 = (A) => iq6(erA({}, "__esModule", {
    value: !0
  }), A), JPB = {};
  lq6(JPB, {
    Field: () => oq6,
    Fields: () => tq6,
    HttpRequest: () => eq6,
    HttpResponse: () => AN6,
    getHttpHandlerExtensionConfiguration: () => aq6,
    isValidHostname: () => DPB,
    resolveHttpHandlerRuntimeConfig: () => sq6
  });
  HPB.exports = nq6(JPB);
  var aq6 = jp((A) => {
      let Q = A.httpHandler;
      return {
        setHttpHandler(B) {
          Q = B
        },
        httpHandler() {
          return Q
        },
        updateHttpClientConfig(B, G) {
          Q.updateHttpClientConfig(B, G)
        },
        httpHandlerConfigs() {
          return Q.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    sq6 = jp((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    rq6 = Md1(),
    WPB = class {
      constructor({
        name: Q,
        kind: B = rq6.FieldPosition.HEADER,
        values: G = []
      }) {
        this.name = Q, this.kind = B, this.values = G
      }
      add(Q) {
        this.values.push(Q)
      }
      set(Q) {
        this.values = Q
      }
      remove(Q) {
        this.values = this.values.filter((B) => B !== Q)
      }
      toString() {
        return this.values.map((Q) => Q.includes(",") || Q.includes(" ") ? `"${Q}"` : Q).join(", ")
      }
      get() {
        return this.values
      }
    };
  jp(WPB, "Field");
  var oq6 = WPB,
    XPB = class {
      constructor({
        fields: Q = [],
        encoding: B = "utf-8"
      }) {
        this.entries = {}, Q.forEach(this.setField.bind(this)), this.encoding = B
      }
      setField(Q) {
        this.entries[Q.name.toLowerCase()] = Q
      }
      getField(Q) {
        return this.entries[Q.toLowerCase()]
      }
      removeField(Q) {
        delete this.entries[Q.toLowerCase()]
      }
      getByType(Q) {
        return Object.values(this.entries).filter((B) => B.kind === Q)
      }
    };
  jp(XPB, "Fields");
  var tq6 = XPB,
    VPB = class A {
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        let Q = new A({
          ...this,
          headers: {
            ...this.headers
          }
        });
        if (Q.query) Q.query = FPB(Q.query);
        return Q
      }
    };
  jp(VPB, "HttpRequest");
  var eq6 = VPB;

  function FPB(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  jp(FPB, "cloneQuery");
  var KPB = class {
    constructor(Q) {
      this.statusCode = Q.statusCode, this.reason = Q.reason, this.headers = Q.headers || {}, this.body = Q.body
    }
    static isInstance(Q) {
      if (!Q) return !1;
      let B = Q;
      return typeof B.statusCode === "number" && typeof B.headers === "object"
    }
  };
  jp(KPB, "HttpResponse");
  var AN6 = KPB;

  function DPB(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  jp(DPB, "isValidHostname")
})
// @from(Start 6820958, End 6823861)
MPB = z((PQG, LPB) => {
  var {
    defineProperty: AoA,
    getOwnPropertyDescriptor: QN6,
    getOwnPropertyNames: BN6
  } = Object, GN6 = Object.prototype.hasOwnProperty, QoA = (A, Q) => AoA(A, "name", {
    value: Q,
    configurable: !0
  }), ZN6 = (A, Q) => {
    for (var B in Q) AoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, IN6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of BN6(Q))
        if (!GN6.call(A, Z) && Z !== B) AoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = QN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, YN6 = (A) => IN6(AoA({}, "__esModule", {
    value: !0
  }), A), CPB = {};
  ZN6(CPB, {
    AlgorithmId: () => $PB,
    EndpointURLScheme: () => UPB,
    FieldPosition: () => wPB,
    HttpApiKeyAuthLocation: () => zPB,
    HttpAuthLocation: () => EPB,
    IniSectionType: () => qPB,
    RequestHandlerProtocol: () => NPB,
    SMITHY_CONTEXT_KEY: () => FN6,
    getDefaultClientConfiguration: () => XN6,
    resolveDefaultRuntimeConfig: () => VN6
  });
  LPB.exports = YN6(CPB);
  var EPB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(EPB || {}),
    zPB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(zPB || {}),
    UPB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(UPB || {}),
    $PB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })($PB || {}),
    JN6 = QoA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        _checksumAlgorithms: Q,
        addChecksumAlgorithm(B) {
          this._checksumAlgorithms.push(B)
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms
        }
      }
    }, "getChecksumConfiguration"),
    WN6 = QoA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    XN6 = QoA((A) => {
      return {
        ...JN6(A)
      }
    }, "getDefaultClientConfiguration"),
    VN6 = QoA((A) => {
      return {
        ...WN6(A)
      }
    }, "resolveDefaultRuntimeConfig"),
    wPB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(wPB || {}),
    FN6 = "__smithy_context",
    qPB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(qPB || {}),
    NPB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(NPB || {})
})
// @from(Start 6823867, End 6824965)
jPB = z((jQG, PPB) => {
  var {
    defineProperty: BoA,
    getOwnPropertyDescriptor: KN6,
    getOwnPropertyNames: DN6
  } = Object, HN6 = Object.prototype.hasOwnProperty, RPB = (A, Q) => BoA(A, "name", {
    value: Q,
    configurable: !0
  }), CN6 = (A, Q) => {
    for (var B in Q) BoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, EN6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of DN6(Q))
        if (!HN6.call(A, Z) && Z !== B) BoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = KN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, zN6 = (A) => EN6(BoA({}, "__esModule", {
    value: !0
  }), A), TPB = {};
  CN6(TPB, {
    getSmithyContext: () => UN6,
    normalizeProvider: () => $N6
  });
  PPB.exports = zN6(TPB);
  var OPB = MPB(),
    UN6 = RPB((A) => A[OPB.SMITHY_CONTEXT_KEY] || (A[OPB.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
    $N6 = RPB((A) => {
      if (typeof A === "function") return A;
      let Q = Promise.resolve(A);
      return () => Q
    }, "normalizeProvider")
})
// @from(Start 6824971, End 6825924)
Rd1 = z((SQG, _PB) => {
  var {
    defineProperty: GoA,
    getOwnPropertyDescriptor: wN6,
    getOwnPropertyNames: qN6
  } = Object, NN6 = Object.prototype.hasOwnProperty, LN6 = (A, Q) => GoA(A, "name", {
    value: Q,
    configurable: !0
  }), MN6 = (A, Q) => {
    for (var B in Q) GoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ON6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qN6(Q))
        if (!NN6.call(A, Z) && Z !== B) GoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, RN6 = (A) => ON6(GoA({}, "__esModule", {
    value: !0
  }), A), SPB = {};
  MN6(SPB, {
    isArrayBuffer: () => TN6
  });
  _PB.exports = RN6(SPB);
  var TN6 = LN6((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 6825930, End 6827276)
vPB = z((_QG, xPB) => {
  var {
    defineProperty: ZoA,
    getOwnPropertyDescriptor: PN6,
    getOwnPropertyNames: jN6
  } = Object, SN6 = Object.prototype.hasOwnProperty, kPB = (A, Q) => ZoA(A, "name", {
    value: Q,
    configurable: !0
  }), _N6 = (A, Q) => {
    for (var B in Q) ZoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, kN6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jN6(Q))
        if (!SN6.call(A, Z) && Z !== B) ZoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = PN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yN6 = (A) => kN6(ZoA({}, "__esModule", {
    value: !0
  }), A), yPB = {};
  _N6(yPB, {
    fromArrayBuffer: () => vN6,
    fromString: () => bN6
  });
  xPB.exports = yN6(yPB);
  var xN6 = Rd1(),
    Td1 = UA("buffer"),
    vN6 = kPB((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, xN6.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Td1.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    bN6 = kPB((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Td1.Buffer.from(A, Q) : Td1.Buffer.from(A)
    }, "fromString")
})
// @from(Start 6827282, End 6828945)
r$A = z((kQG, gPB) => {
  var {
    defineProperty: IoA,
    getOwnPropertyDescriptor: fN6,
    getOwnPropertyNames: hN6
  } = Object, gN6 = Object.prototype.hasOwnProperty, Pd1 = (A, Q) => IoA(A, "name", {
    value: Q,
    configurable: !0
  }), uN6 = (A, Q) => {
    for (var B in Q) IoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, mN6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of hN6(Q))
        if (!gN6.call(A, Z) && Z !== B) IoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = fN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, dN6 = (A) => mN6(IoA({}, "__esModule", {
    value: !0
  }), A), bPB = {};
  uN6(bPB, {
    fromUtf8: () => hPB,
    toUint8Array: () => cN6,
    toUtf8: () => pN6
  });
  gPB.exports = dN6(bPB);
  var fPB = vPB(),
    hPB = Pd1((A) => {
      let Q = (0, fPB.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    cN6 = Pd1((A) => {
      if (typeof A === "string") return hPB(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    pN6 = Pd1((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, fPB.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Start 6828951, End 6830477)
iPB = z((yQG, lPB) => {
  var {
    defineProperty: YoA,
    getOwnPropertyDescriptor: lN6,
    getOwnPropertyNames: iN6
  } = Object, nN6 = Object.prototype.hasOwnProperty, uPB = (A, Q) => YoA(A, "name", {
    value: Q,
    configurable: !0
  }), aN6 = (A, Q) => {
    for (var B in Q) YoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, sN6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of iN6(Q))
        if (!nN6.call(A, Z) && Z !== B) YoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = lN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rN6 = (A) => sN6(YoA({}, "__esModule", {
    value: !0
  }), A), mPB = {};
  aN6(mPB, {
    fromHex: () => cPB,
    toHex: () => pPB
  });
  lPB.exports = rN6(mPB);
  var dPB = {},
    jd1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    dPB[A] = Q, jd1[Q] = A
  }

  function cPB(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in jd1) Q[B / 2] = jd1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }
  uPB(cPB, "fromHex");

  function pPB(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += dPB[A[B]];
    return Q
  }
  uPB(pPB, "toHex")
})
// @from(Start 6830483, End 6831536)
rPB = z((xQG, sPB) => {
  var {
    defineProperty: JoA,
    getOwnPropertyDescriptor: oN6,
    getOwnPropertyNames: tN6
  } = Object, eN6 = Object.prototype.hasOwnProperty, Sd1 = (A, Q) => JoA(A, "name", {
    value: Q,
    configurable: !0
  }), AL6 = (A, Q) => {
    for (var B in Q) JoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, QL6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of tN6(Q))
        if (!eN6.call(A, Z) && Z !== B) JoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = oN6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, BL6 = (A) => QL6(JoA({}, "__esModule", {
    value: !0
  }), A), nPB = {};
  AL6(nPB, {
    escapeUri: () => aPB,
    escapeUriPath: () => ZL6
  });
  sPB.exports = BL6(nPB);
  var aPB = Sd1((A) => encodeURIComponent(A).replace(/[!'()*]/g, GL6), "escapeUri"),
    GL6 = Sd1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    ZL6 = Sd1((A) => A.split("/").map(aPB).join("/"), "escapeUriPath")
})