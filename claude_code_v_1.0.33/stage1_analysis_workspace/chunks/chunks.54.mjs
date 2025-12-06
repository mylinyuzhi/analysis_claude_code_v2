
// @from(Start 4880612, End 4884765)
Lx1 = z((TS7, $0B) => {
  var {
    kProxy: $c8,
    kClose: wc8,
    kDestroy: qc8,
    kInterceptors: Nc8
  } = tI(), {
    URL: rEA
  } = UA("node:url"), Lc8 = F3A(), Mc8 = V3A(), Oc8 = a5A(), {
    InvalidArgumentError: TlA,
    RequestAbortedError: Rc8,
    SecureProxyConnectionError: Tc8
  } = R7(), C0B = TEA(), OlA = Symbol("proxy agent"), RlA = Symbol("proxy client"), oEA = Symbol("proxy headers"), Nx1 = Symbol("request tls settings"), E0B = Symbol("proxy tls settings"), z0B = Symbol("connect endpoint function");

  function Pc8(A) {
    return A === "https:" ? 443 : 80
  }

  function jc8(A, Q) {
    return new Mc8(A, Q)
  }
  var Sc8 = () => {};
  class U0B extends Oc8 {
    constructor(A) {
      super();
      if (!A || typeof A === "object" && !(A instanceof rEA) && !A.uri) throw new TlA("Proxy uri is mandatory");
      let {
        clientFactory: Q = jc8
      } = A;
      if (typeof Q !== "function") throw new TlA("Proxy opts.clientFactory must be a function.");
      let B = this.#A(A),
        {
          href: G,
          origin: Z,
          port: I,
          protocol: Y,
          username: J,
          password: W,
          hostname: X
        } = B;
      if (this[$c8] = {
          uri: G,
          protocol: Y
        }, this[Nc8] = A.interceptors?.ProxyAgent && Array.isArray(A.interceptors.ProxyAgent) ? A.interceptors.ProxyAgent : [], this[Nx1] = A.requestTls, this[E0B] = A.proxyTls, this[oEA] = A.headers || {}, A.auth && A.token) throw new TlA("opts.auth cannot be used in combination with opts.token");
      else if (A.auth) this[oEA]["proxy-authorization"] = `Basic ${A.auth}`;
      else if (A.token) this[oEA]["proxy-authorization"] = A.token;
      else if (J && W) this[oEA]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(J)}:${decodeURIComponent(W)}`).toString("base64")}`;
      let V = C0B({
        ...A.proxyTls
      });
      this[z0B] = C0B({
        ...A.requestTls
      }), this[RlA] = Q(B, {
        connect: V
      }), this[OlA] = new Lc8({
        ...A,
        connect: async (F, K) => {
          let D = F.host;
          if (!F.port) D += `:${Pc8(F.protocol)}`;
          try {
            let {
              socket: H,
              statusCode: C
            } = await this[RlA].connect({
              origin: Z,
              port: I,
              path: D,
              signal: F.signal,
              headers: {
                ...this[oEA],
                host: F.host
              },
              servername: this[E0B]?.servername || X
            });
            if (C !== 200) H.on("error", Sc8).destroy(), K(new Rc8(`Proxy response (${C}) !== 200 when HTTP Tunneling`));
            if (F.protocol !== "https:") {
              K(null, H);
              return
            }
            let E;
            if (this[Nx1]) E = this[Nx1].servername;
            else E = F.servername;
            this[z0B]({
              ...F,
              servername: E,
              httpSocket: H
            }, K)
          } catch (H) {
            if (H.code === "ERR_TLS_CERT_ALTNAME_INVALID") K(new Tc8(H));
            else K(H)
          }
        }
      })
    }
    dispatch(A, Q) {
      let B = _c8(A.headers);
      if (kc8(B), B && !("host" in B) && !("Host" in B)) {
        let {
          host: G
        } = new rEA(A.origin);
        B.host = G
      }
      return this[OlA].dispatch({
        ...A,
        headers: B
      }, Q)
    }
    #A(A) {
      if (typeof A === "string") return new rEA(A);
      else if (A instanceof rEA) return A;
      else return new rEA(A.uri)
    }
    async [wc8]() {
      await this[OlA].close(), await this[RlA].close()
    }
    async [qc8]() {
      await this[OlA].destroy(), await this[RlA].destroy()
    }
  }

  function _c8(A) {
    if (Array.isArray(A)) {
      let Q = {};
      for (let B = 0; B < A.length; B += 2) Q[A[B]] = A[B + 1];
      return Q
    }
    return A
  }

  function kc8(A) {
    if (A && Object.keys(A).find((B) => B.toLowerCase() === "proxy-authorization")) throw new TlA("Proxy-Authorization should be sent in ProxyAgent constructor")
  }
  $0B.exports = U0B
})
// @from(Start 4884771, End 4887660)
R0B = z((PS7, O0B) => {
  var yc8 = a5A(),
    {
      kClose: xc8,
      kDestroy: vc8,
      kClosed: w0B,
      kDestroyed: q0B,
      kDispatch: bc8,
      kNoProxyAgent: tEA,
      kHttpProxyAgent: qc,
      kHttpsProxyAgent: co
    } = tI(),
    N0B = Lx1(),
    fc8 = F3A(),
    hc8 = {
      "http:": 80,
      "https:": 443
    },
    L0B = !1;
  class M0B extends yc8 {
    #A = null;
    #Q = null;
    #B = null;
    constructor(A = {}) {
      super();
      if (this.#B = A, !L0B) L0B = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
        code: "UNDICI-EHPA"
      });
      let {
        httpProxy: Q,
        httpsProxy: B,
        noProxy: G,
        ...Z
      } = A;
      this[tEA] = new fc8(Z);
      let I = Q ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
      if (I) this[qc] = new N0B({
        ...Z,
        uri: I
      });
      else this[qc] = this[tEA];
      let Y = B ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
      if (Y) this[co] = new N0B({
        ...Z,
        uri: Y
      });
      else this[co] = this[qc];
      this.#J()
    } [bc8](A, Q) {
      let B = new URL(A.origin);
      return this.#Z(B).dispatch(A, Q)
    }
    async [xc8]() {
      if (await this[tEA].close(), !this[qc][w0B]) await this[qc].close();
      if (!this[co][w0B]) await this[co].close()
    }
    async [vc8](A) {
      if (await this[tEA].destroy(A), !this[qc][q0B]) await this[qc].destroy(A);
      if (!this[co][q0B]) await this[co].destroy(A)
    }
    #Z(A) {
      let {
        protocol: Q,
        host: B,
        port: G
      } = A;
      if (B = B.replace(/:\d*$/, "").toLowerCase(), G = Number.parseInt(G, 10) || hc8[Q] || 0, !this.#G(B, G)) return this[tEA];
      if (Q === "https:") return this[co];
      return this[qc]
    }
    #G(A, Q) {
      if (this.#I) this.#J();
      if (this.#Q.length === 0) return !0;
      if (this.#A === "*") return !1;
      for (let B = 0; B < this.#Q.length; B++) {
        let G = this.#Q[B];
        if (G.port && G.port !== Q) continue;
        if (!/^[.*]/.test(G.hostname)) {
          if (A === G.hostname) return !1
        } else if (A.endsWith(G.hostname.replace(/^\*/, ""))) return !1
      }
      return !0
    }
    #J() {
      let A = this.#B.noProxy ?? this.#V,
        Q = A.split(/[,\s]/),
        B = [];
      for (let G = 0; G < Q.length; G++) {
        let Z = Q[G];
        if (!Z) continue;
        let I = Z.match(/^(.+):(\d+)$/);
        B.push({
          hostname: (I ? I[1] : Z).toLowerCase(),
          port: I ? Number.parseInt(I[2], 10) : 0
        })
      }
      this.#A = A, this.#Q = B
    }
    get #I() {
      if (this.#B.noProxy !== void 0) return !1;
      return this.#A !== this.#V
    }
    get #V() {
      return process.env.no_proxy ?? process.env.NO_PROXY ?? ""
    }
  }
  O0B.exports = M0B
})
// @from(Start 4887666, End 4894367)
PlA = z((jS7, S0B) => {
  var K3A = UA("node:assert"),
    {
      kRetryHandlerDefaultRetry: T0B
    } = tI(),
    {
      RequestRetryError: eEA
    } = R7(),
    {
      isDisturbed: P0B,
      parseHeaders: gc8,
      parseRangeHeader: j0B,
      wrapRequestBody: uc8
    } = S6();

  function mc8(A) {
    let Q = Date.now();
    return new Date(A).getTime() - Q
  }
  class Mx1 {
    constructor(A, Q) {
      let {
        retryOptions: B,
        ...G
      } = A, {
        retry: Z,
        maxRetries: I,
        maxTimeout: Y,
        minTimeout: J,
        timeoutFactor: W,
        methods: X,
        errorCodes: V,
        retryAfter: F,
        statusCodes: K
      } = B ?? {};
      this.dispatch = Q.dispatch, this.handler = Q.handler, this.opts = {
        ...G,
        body: uc8(A.body)
      }, this.abort = null, this.aborted = !1, this.retryOpts = {
        retry: Z ?? Mx1[T0B],
        retryAfter: F ?? !0,
        maxTimeout: Y ?? 30000,
        minTimeout: J ?? 500,
        timeoutFactor: W ?? 2,
        maxRetries: I ?? 5,
        methods: X ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
        statusCodes: K ?? [500, 502, 503, 504, 429],
        errorCodes: V ?? ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "ENETDOWN", "ENETUNREACH", "EHOSTDOWN", "EHOSTUNREACH", "EPIPE", "UND_ERR_SOCKET"]
      }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((D) => {
        if (this.aborted = !0, this.abort) this.abort(D);
        else this.reason = D
      })
    }
    onRequestSent() {
      if (this.handler.onRequestSent) this.handler.onRequestSent()
    }
    onUpgrade(A, Q, B) {
      if (this.handler.onUpgrade) this.handler.onUpgrade(A, Q, B)
    }
    onConnect(A) {
      if (this.aborted) A(this.reason);
      else this.abort = A
    }
    onBodySent(A) {
      if (this.handler.onBodySent) return this.handler.onBodySent(A)
    }
    static[T0B](A, {
      state: Q,
      opts: B
    }, G) {
      let {
        statusCode: Z,
        code: I,
        headers: Y
      } = A, {
        method: J,
        retryOptions: W
      } = B, {
        maxRetries: X,
        minTimeout: V,
        maxTimeout: F,
        timeoutFactor: K,
        statusCodes: D,
        errorCodes: H,
        methods: C
      } = W, {
        counter: E
      } = Q;
      if (I && I !== "UND_ERR_REQ_RETRY" && !H.includes(I)) {
        G(A);
        return
      }
      if (Array.isArray(C) && !C.includes(J)) {
        G(A);
        return
      }
      if (Z != null && Array.isArray(D) && !D.includes(Z)) {
        G(A);
        return
      }
      if (E > X) {
        G(A);
        return
      }
      let U = Y?.["retry-after"];
      if (U) U = Number(U), U = Number.isNaN(U) ? mc8(U) : U * 1000;
      let q = U > 0 ? Math.min(U, F) : Math.min(V * K ** (E - 1), F);
      setTimeout(() => G(null), q)
    }
    onHeaders(A, Q, B, G) {
      let Z = gc8(Q);
      if (this.retryCount += 1, A >= 300)
        if (this.retryOpts.statusCodes.includes(A) === !1) return this.handler.onHeaders(A, Q, B, G);
        else return this.abort(new eEA("Request failed", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
      if (this.resume != null) {
        if (this.resume = null, A !== 206 && (this.start > 0 || A !== 200)) return this.abort(new eEA("server does not support the range header and the payload was partially consumed", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        let Y = j0B(Z["content-range"]);
        if (!Y) return this.abort(new eEA("Content-Range mismatch", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        if (this.etag != null && this.etag !== Z.etag) return this.abort(new eEA("ETag mismatch", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        let {
          start: J,
          size: W,
          end: X = W - 1
        } = Y;
        return K3A(this.start === J, "content-range mismatch"), K3A(this.end == null || this.end === X, "content-range mismatch"), this.resume = B, !0
      }
      if (this.end == null) {
        if (A === 206) {
          let Y = j0B(Z["content-range"]);
          if (Y == null) return this.handler.onHeaders(A, Q, B, G);
          let {
            start: J,
            size: W,
            end: X = W - 1
          } = Y;
          K3A(J != null && Number.isFinite(J), "content-range mismatch"), K3A(X != null && Number.isFinite(X), "invalid content-length"), this.start = J, this.end = X
        }
        if (this.end == null) {
          let Y = Z["content-length"];
          this.end = Y != null ? Number(Y) - 1 : null
        }
        if (K3A(Number.isFinite(this.start)), K3A(this.end == null || Number.isFinite(this.end), "invalid content-length"), this.resume = B, this.etag = Z.etag != null ? Z.etag : null, this.etag != null && this.etag.startsWith("W/")) this.etag = null;
        return this.handler.onHeaders(A, Q, B, G)
      }
      let I = new eEA("Request failed", A, {
        headers: Z,
        data: {
          count: this.retryCount
        }
      });
      return this.abort(I), !1
    }
    onData(A) {
      return this.start += A.length, this.handler.onData(A)
    }
    onComplete(A) {
      return this.retryCount = 0, this.handler.onComplete(A)
    }
    onError(A) {
      if (this.aborted || P0B(this.opts.body)) return this.handler.onError(A);
      if (this.retryCount - this.retryCountCheckpoint > 0) this.retryCount = this.retryCountCheckpoint + (this.retryCount - this.retryCountCheckpoint);
      else this.retryCount += 1;
      this.retryOpts.retry(A, {
        state: {
          counter: this.retryCount
        },
        opts: {
          retryOptions: this.retryOpts,
          ...this.opts
        }
      }, Q.bind(this));

      function Q(B) {
        if (B != null || this.aborted || P0B(this.opts.body)) return this.handler.onError(B);
        if (this.start !== 0) {
          let G = {
            range: `bytes=${this.start}-${this.end??""}`
          };
          if (this.etag != null) G["if-match"] = this.etag;
          this.opts = {
            ...this.opts,
            headers: {
              ...this.opts.headers,
              ...G
            }
          }
        }
        try {
          this.retryCountCheckpoint = this.retryCount, this.dispatch(this.opts, this)
        } catch (G) {
          this.handler.onError(G)
        }
      }
    }
  }
  S0B.exports = Mx1
})
// @from(Start 4894373, End 4894920)
y0B = z((SS7, k0B) => {
  var dc8 = OEA(),
    cc8 = PlA();
  class _0B extends dc8 {
    #A = null;
    #Q = null;
    constructor(A, Q = {}) {
      super(Q);
      this.#A = A, this.#Q = Q
    }
    dispatch(A, Q) {
      let B = new cc8({
        ...A,
        retryOptions: this.#Q
      }, {
        dispatch: this.#A.dispatch.bind(this.#A),
        handler: Q
      });
      return this.#A.dispatch(A, B)
    }
    close() {
      return this.#A.close()
    }
    destroy() {
      return this.#A.destroy()
    }
  }
  k0B.exports = _0B
})
// @from(Start 4894926, End 4900762)
jx1 = z((_S7, c0B) => {
  var h0B = UA("node:assert"),
    {
      Readable: pc8
    } = UA("node:stream"),
    {
      RequestAbortedError: g0B,
      NotSupportedError: lc8,
      InvalidArgumentError: ic8,
      AbortError: Ox1
    } = R7(),
    u0B = S6(),
    {
      ReadableStreamFrom: nc8
    } = S6(),
    vw = Symbol("kConsume"),
    AzA = Symbol("kReading"),
    Nc = Symbol("kBody"),
    x0B = Symbol("kAbort"),
    m0B = Symbol("kContentType"),
    v0B = Symbol("kContentLength"),
    ac8 = () => {};
  class d0B extends pc8 {
    constructor({
      resume: A,
      abort: Q,
      contentType: B = "",
      contentLength: G,
      highWaterMark: Z = 65536
    }) {
      super({
        autoDestroy: !0,
        read: A,
        highWaterMark: Z
      });
      this._readableState.dataEmitted = !1, this[x0B] = Q, this[vw] = null, this[Nc] = null, this[m0B] = B, this[v0B] = G, this[AzA] = !1
    }
    destroy(A) {
      if (!A && !this._readableState.endEmitted) A = new g0B;
      if (A) this[x0B]();
      return super.destroy(A)
    }
    _destroy(A, Q) {
      if (!this[AzA]) setImmediate(() => {
        Q(A)
      });
      else Q(A)
    }
    on(A, ...Q) {
      if (A === "data" || A === "readable") this[AzA] = !0;
      return super.on(A, ...Q)
    }
    addListener(A, ...Q) {
      return this.on(A, ...Q)
    }
    off(A, ...Q) {
      let B = super.off(A, ...Q);
      if (A === "data" || A === "readable") this[AzA] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
      return B
    }
    removeListener(A, ...Q) {
      return this.off(A, ...Q)
    }
    push(A) {
      if (this[vw] && A !== null) return Tx1(this[vw], A), this[AzA] ? super.push(A) : !0;
      return super.push(A)
    }
    async text() {
      return QzA(this, "text")
    }
    async json() {
      return QzA(this, "json")
    }
    async blob() {
      return QzA(this, "blob")
    }
    async bytes() {
      return QzA(this, "bytes")
    }
    async arrayBuffer() {
      return QzA(this, "arrayBuffer")
    }
    async formData() {
      throw new lc8
    }
    get bodyUsed() {
      return u0B.isDisturbed(this)
    }
    get body() {
      if (!this[Nc]) {
        if (this[Nc] = nc8(this), this[vw]) this[Nc].getReader(), h0B(this[Nc].locked)
      }
      return this[Nc]
    }
    async dump(A) {
      let Q = Number.isFinite(A?.limit) ? A.limit : 131072,
        B = A?.signal;
      if (B != null && (typeof B !== "object" || !("aborted" in B))) throw new ic8("signal must be an AbortSignal");
      if (B?.throwIfAborted(), this._readableState.closeEmitted) return null;
      return await new Promise((G, Z) => {
        if (this[v0B] > Q) this.destroy(new Ox1);
        let I = () => {
          this.destroy(B.reason ?? new Ox1)
        };
        B?.addEventListener("abort", I), this.on("close", function() {
          if (B?.removeEventListener("abort", I), B?.aborted) Z(B.reason ?? new Ox1);
          else G(null)
        }).on("error", ac8).on("data", function(Y) {
          if (Q -= Y.length, Q <= 0) this.destroy()
        }).resume()
      })
    }
  }

  function sc8(A) {
    return A[Nc] && A[Nc].locked === !0 || A[vw]
  }

  function rc8(A) {
    return u0B.isDisturbed(A) || sc8(A)
  }
  async function QzA(A, Q) {
    return h0B(!A[vw]), new Promise((B, G) => {
      if (rc8(A)) {
        let Z = A._readableState;
        if (Z.destroyed && Z.closeEmitted === !1) A.on("error", (I) => {
          G(I)
        }).on("close", () => {
          G(TypeError("unusable"))
        });
        else G(Z.errored ?? TypeError("unusable"))
      } else queueMicrotask(() => {
        A[vw] = {
          type: Q,
          stream: A,
          resolve: B,
          reject: G,
          length: 0,
          body: []
        }, A.on("error", function(Z) {
          Px1(this[vw], Z)
        }).on("close", function() {
          if (this[vw].body !== null) Px1(this[vw], new g0B)
        }), oc8(A[vw])
      })
    })
  }

  function oc8(A) {
    if (A.body === null) return;
    let {
      _readableState: Q
    } = A.stream;
    if (Q.bufferIndex) {
      let B = Q.bufferIndex,
        G = Q.buffer.length;
      for (let Z = B; Z < G; Z++) Tx1(A, Q.buffer[Z])
    } else
      for (let B of Q.buffer) Tx1(A, B);
    if (Q.endEmitted) f0B(this[vw]);
    else A.stream.on("end", function() {
      f0B(this[vw])
    });
    A.stream.resume();
    while (A.stream.read() != null);
  }

  function Rx1(A, Q) {
    if (A.length === 0 || Q === 0) return "";
    let B = A.length === 1 ? A[0] : Buffer.concat(A, Q),
      G = B.length,
      Z = G > 2 && B[0] === 239 && B[1] === 187 && B[2] === 191 ? 3 : 0;
    return B.utf8Slice(Z, G)
  }

  function b0B(A, Q) {
    if (A.length === 0 || Q === 0) return new Uint8Array(0);
    if (A.length === 1) return new Uint8Array(A[0]);
    let B = new Uint8Array(Buffer.allocUnsafeSlow(Q).buffer),
      G = 0;
    for (let Z = 0; Z < A.length; ++Z) {
      let I = A[Z];
      B.set(I, G), G += I.length
    }
    return B
  }

  function f0B(A) {
    let {
      type: Q,
      body: B,
      resolve: G,
      stream: Z,
      length: I
    } = A;
    try {
      if (Q === "text") G(Rx1(B, I));
      else if (Q === "json") G(JSON.parse(Rx1(B, I)));
      else if (Q === "arrayBuffer") G(b0B(B, I).buffer);
      else if (Q === "blob") G(new Blob(B, {
        type: Z[m0B]
      }));
      else if (Q === "bytes") G(b0B(B, I));
      Px1(A)
    } catch (Y) {
      Z.destroy(Y)
    }
  }

  function Tx1(A, Q) {
    A.length += Q.length, A.body.push(Q)
  }

  function Px1(A, Q) {
    if (A.body === null) return;
    if (Q) A.reject(Q);
    else A.resolve();
    A.type = null, A.stream = null, A.resolve = null, A.reject = null, A.length = 0, A.body = null
  }
  c0B.exports = {
    Readable: d0B,
    chunksDecode: Rx1
  }
})
// @from(Start 4900768, End 4902288)
Sx1 = z((kS7, a0B) => {
  var tc8 = UA("node:assert"),
    {
      ResponseStatusCodeError: p0B
    } = R7(),
    {
      chunksDecode: l0B
    } = jx1();
  async function ec8({
    callback: A,
    body: Q,
    contentType: B,
    statusCode: G,
    statusMessage: Z,
    headers: I
  }) {
    tc8(Q);
    let Y = [],
      J = 0;
    try {
      for await (let F of Q) if (Y.push(F), J += F.length, J > 131072) {
        Y = [], J = 0;
        break
      }
    } catch {
      Y = [], J = 0
    }
    let W = `Response status code ${G}${Z?`: ${Z}`:""}`;
    if (G === 204 || !B || !J) {
      queueMicrotask(() => A(new p0B(W, G, I)));
      return
    }
    let X = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    let V;
    try {
      if (i0B(B)) V = JSON.parse(l0B(Y, J));
      else if (n0B(B)) V = l0B(Y, J)
    } catch {} finally {
      Error.stackTraceLimit = X
    }
    queueMicrotask(() => A(new p0B(W, G, I, V)))
  }
  var i0B = (A) => {
      return A.length > 15 && A[11] === "/" && A[0] === "a" && A[1] === "p" && A[2] === "p" && A[3] === "l" && A[4] === "i" && A[5] === "c" && A[6] === "a" && A[7] === "t" && A[8] === "i" && A[9] === "o" && A[10] === "n" && A[12] === "j" && A[13] === "s" && A[14] === "o" && A[15] === "n"
    },
    n0B = (A) => {
      return A.length > 4 && A[4] === "/" && A[0] === "t" && A[1] === "e" && A[2] === "x" && A[3] === "t"
    };
  a0B.exports = {
    getResolveErrorBodyCallback: ec8,
    isContentTypeApplicationJson: i0B,
    isContentTypeText: n0B
  }
})
// @from(Start 4902294, End 4907038)
o0B = z((yS7, kx1) => {
  var Ap8 = UA("node:assert"),
    {
      Readable: Qp8
    } = jx1(),
    {
      InvalidArgumentError: D3A,
      RequestAbortedError: s0B
    } = R7(),
    bw = S6(),
    {
      getResolveErrorBodyCallback: Bp8
    } = Sx1(),
    {
      AsyncResource: Gp8
    } = UA("node:async_hooks");
  class _x1 extends Gp8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new D3A("invalid opts");
      let {
        signal: B,
        method: G,
        opaque: Z,
        body: I,
        onInfo: Y,
        responseHeaders: J,
        throwOnError: W,
        highWaterMark: X
      } = A;
      try {
        if (typeof Q !== "function") throw new D3A("invalid callback");
        if (X && (typeof X !== "number" || X < 0)) throw new D3A("invalid highWaterMark");
        if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new D3A("signal must be an EventEmitter or EventTarget");
        if (G === "CONNECT") throw new D3A("invalid method");
        if (Y && typeof Y !== "function") throw new D3A("invalid onInfo callback");
        super("UNDICI_REQUEST")
      } catch (V) {
        if (bw.isStream(I)) bw.destroy(I.on("error", bw.nop), V);
        throw V
      }
      if (this.method = G, this.responseHeaders = J || null, this.opaque = Z || null, this.callback = Q, this.res = null, this.abort = null, this.body = I, this.trailers = {}, this.context = null, this.onInfo = Y || null, this.throwOnError = W, this.highWaterMark = X, this.signal = B, this.reason = null, this.removeAbortListener = null, bw.isStream(I)) I.on("error", (V) => {
        this.onError(V)
      });
      if (this.signal)
        if (this.signal.aborted) this.reason = this.signal.reason ?? new s0B;
        else this.removeAbortListener = bw.addAbortListener(this.signal, () => {
          if (this.reason = this.signal.reason ?? new s0B, this.res) bw.destroy(this.res.on("error", bw.nop), this.reason);
          else if (this.abort) this.abort(this.reason);
          if (this.removeAbortListener) this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
        })
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Ap8(this.callback), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B, G) {
      let {
        callback: Z,
        opaque: I,
        abort: Y,
        context: J,
        responseHeaders: W,
        highWaterMark: X
      } = this, V = W === "raw" ? bw.parseRawHeaders(Q) : bw.parseHeaders(Q);
      if (A < 200) {
        if (this.onInfo) this.onInfo({
          statusCode: A,
          headers: V
        });
        return
      }
      let F = W === "raw" ? bw.parseHeaders(Q) : V,
        K = F["content-type"],
        D = F["content-length"],
        H = new Qp8({
          resume: B,
          abort: Y,
          contentType: K,
          contentLength: this.method !== "HEAD" && D ? Number(D) : null,
          highWaterMark: X
        });
      if (this.removeAbortListener) H.on("close", this.removeAbortListener);
      if (this.callback = null, this.res = H, Z !== null)
        if (this.throwOnError && A >= 400) this.runInAsyncScope(Bp8, null, {
          callback: Z,
          body: H,
          contentType: K,
          statusCode: A,
          statusMessage: G,
          headers: V
        });
        else this.runInAsyncScope(Z, null, null, {
          statusCode: A,
          headers: V,
          trailers: this.trailers,
          opaque: I,
          body: H,
          context: J
        })
    }
    onData(A) {
      return this.res.push(A)
    }
    onComplete(A) {
      bw.parseHeaders(A, this.trailers), this.res.push(null)
    }
    onError(A) {
      let {
        res: Q,
        callback: B,
        body: G,
        opaque: Z
      } = this;
      if (B) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(B, null, A, {
          opaque: Z
        })
      });
      if (Q) this.res = null, queueMicrotask(() => {
        bw.destroy(Q, A)
      });
      if (G) this.body = null, bw.destroy(G, A);
      if (this.removeAbortListener) Q?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
    }
  }

  function r0B(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      r0B.call(this, A, (Z, I) => {
        return Z ? G(Z) : B(I)
      })
    });
    try {
      this.dispatch(A, new _x1(A, Q))
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  kx1.exports = r0B;
  kx1.exports.RequestHandler = _x1
})
// @from(Start 4907044, End 4907829)
BzA = z((xS7, AQB) => {
  var {
    addAbortListener: Zp8
  } = S6(), {
    RequestAbortedError: Ip8
  } = R7(), H3A = Symbol("kListener"), E_ = Symbol("kSignal");

  function t0B(A) {
    if (A.abort) A.abort(A[E_]?.reason);
    else A.reason = A[E_]?.reason ?? new Ip8;
    e0B(A)
  }

  function Yp8(A, Q) {
    if (A.reason = null, A[E_] = null, A[H3A] = null, !Q) return;
    if (Q.aborted) {
      t0B(A);
      return
    }
    A[E_] = Q, A[H3A] = () => {
      t0B(A)
    }, Zp8(A[E_], A[H3A])
  }

  function e0B(A) {
    if (!A[E_]) return;
    if ("removeEventListener" in A[E_]) A[E_].removeEventListener("abort", A[H3A]);
    else A[E_].removeListener("abort", A[H3A]);
    A[E_] = null, A[H3A] = null
  }
  AQB.exports = {
    addSignal: Yp8,
    removeSignal: e0B
  }
})
// @from(Start 4907835, End 4912393)
IQB = z((vS7, ZQB) => {
  var Jp8 = UA("node:assert"),
    {
      finished: Wp8,
      PassThrough: Xp8
    } = UA("node:stream"),
    {
      InvalidArgumentError: C3A,
      InvalidReturnValueError: Vp8
    } = R7(),
    JT = S6(),
    {
      getResolveErrorBodyCallback: Fp8
    } = Sx1(),
    {
      AsyncResource: Kp8
    } = UA("node:async_hooks"),
    {
      addSignal: Dp8,
      removeSignal: QQB
    } = BzA();
  class BQB extends Kp8 {
    constructor(A, Q, B) {
      if (!A || typeof A !== "object") throw new C3A("invalid opts");
      let {
        signal: G,
        method: Z,
        opaque: I,
        body: Y,
        onInfo: J,
        responseHeaders: W,
        throwOnError: X
      } = A;
      try {
        if (typeof B !== "function") throw new C3A("invalid callback");
        if (typeof Q !== "function") throw new C3A("invalid factory");
        if (G && typeof G.on !== "function" && typeof G.addEventListener !== "function") throw new C3A("signal must be an EventEmitter or EventTarget");
        if (Z === "CONNECT") throw new C3A("invalid method");
        if (J && typeof J !== "function") throw new C3A("invalid onInfo callback");
        super("UNDICI_STREAM")
      } catch (V) {
        if (JT.isStream(Y)) JT.destroy(Y.on("error", JT.nop), V);
        throw V
      }
      if (this.responseHeaders = W || null, this.opaque = I || null, this.factory = Q, this.callback = B, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = Y, this.onInfo = J || null, this.throwOnError = X || !1, JT.isStream(Y)) Y.on("error", (V) => {
        this.onError(V)
      });
      Dp8(this, G)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Jp8(this.callback), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B, G) {
      let {
        factory: Z,
        opaque: I,
        context: Y,
        callback: J,
        responseHeaders: W
      } = this, X = W === "raw" ? JT.parseRawHeaders(Q) : JT.parseHeaders(Q);
      if (A < 200) {
        if (this.onInfo) this.onInfo({
          statusCode: A,
          headers: X
        });
        return
      }
      this.factory = null;
      let V;
      if (this.throwOnError && A >= 400) {
        let D = (W === "raw" ? JT.parseHeaders(Q) : X)["content-type"];
        V = new Xp8, this.callback = null, this.runInAsyncScope(Fp8, null, {
          callback: J,
          body: V,
          contentType: D,
          statusCode: A,
          statusMessage: G,
          headers: X
        })
      } else {
        if (Z === null) return;
        if (V = this.runInAsyncScope(Z, null, {
            statusCode: A,
            headers: X,
            opaque: I,
            context: Y
          }), !V || typeof V.write !== "function" || typeof V.end !== "function" || typeof V.on !== "function") throw new Vp8("expected Writable");
        Wp8(V, {
          readable: !1
        }, (K) => {
          let {
            callback: D,
            res: H,
            opaque: C,
            trailers: E,
            abort: U
          } = this;
          if (this.res = null, K || !H.readable) JT.destroy(H, K);
          if (this.callback = null, this.runInAsyncScope(D, null, K || null, {
              opaque: C,
              trailers: E
            }), K) U()
        })
      }
      return V.on("drain", B), this.res = V, (V.writableNeedDrain !== void 0 ? V.writableNeedDrain : V._writableState?.needDrain) !== !0
    }
    onData(A) {
      let {
        res: Q
      } = this;
      return Q ? Q.write(A) : !0
    }
    onComplete(A) {
      let {
        res: Q
      } = this;
      if (QQB(this), !Q) return;
      this.trailers = JT.parseHeaders(A), Q.end()
    }
    onError(A) {
      let {
        res: Q,
        callback: B,
        opaque: G,
        body: Z
      } = this;
      if (QQB(this), this.factory = null, Q) this.res = null, JT.destroy(Q, A);
      else if (B) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(B, null, A, {
          opaque: G
        })
      });
      if (Z) this.body = null, JT.destroy(Z, A)
    }
  }

  function GQB(A, Q, B) {
    if (B === void 0) return new Promise((G, Z) => {
      GQB.call(this, A, Q, (I, Y) => {
        return I ? Z(I) : G(Y)
      })
    });
    try {
      this.dispatch(A, new BQB(A, Q, B))
    } catch (G) {
      if (typeof B !== "function") throw G;
      let Z = A?.opaque;
      queueMicrotask(() => B(G, {
        opaque: Z
      }))
    }
  }
  ZQB.exports = GQB
})
// @from(Start 4912399, End 4917220)
KQB = z((bS7, FQB) => {
  var {
    Readable: JQB,
    Duplex: Hp8,
    PassThrough: Cp8
  } = UA("node:stream"), {
    InvalidArgumentError: GzA,
    InvalidReturnValueError: Ep8,
    RequestAbortedError: yx1
  } = R7(), eL = S6(), {
    AsyncResource: zp8
  } = UA("node:async_hooks"), {
    addSignal: Up8,
    removeSignal: $p8
  } = BzA(), YQB = UA("node:assert"), E3A = Symbol("resume");
  class WQB extends JQB {
    constructor() {
      super({
        autoDestroy: !0
      });
      this[E3A] = null
    }
    _read() {
      let {
        [E3A]: A
      } = this;
      if (A) this[E3A] = null, A()
    }
    _destroy(A, Q) {
      this._read(), Q(A)
    }
  }
  class XQB extends JQB {
    constructor(A) {
      super({
        autoDestroy: !0
      });
      this[E3A] = A
    }
    _read() {
      this[E3A]()
    }
    _destroy(A, Q) {
      if (!A && !this._readableState.endEmitted) A = new yx1;
      Q(A)
    }
  }
  class VQB extends zp8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new GzA("invalid opts");
      if (typeof Q !== "function") throw new GzA("invalid handler");
      let {
        signal: B,
        method: G,
        opaque: Z,
        onInfo: I,
        responseHeaders: Y
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new GzA("signal must be an EventEmitter or EventTarget");
      if (G === "CONNECT") throw new GzA("invalid method");
      if (I && typeof I !== "function") throw new GzA("invalid onInfo callback");
      super("UNDICI_PIPELINE");
      this.opaque = Z || null, this.responseHeaders = Y || null, this.handler = Q, this.abort = null, this.context = null, this.onInfo = I || null, this.req = new WQB().on("error", eL.nop), this.ret = new Hp8({
        readableObjectMode: A.objectMode,
        autoDestroy: !0,
        read: () => {
          let {
            body: J
          } = this;
          if (J?.resume) J.resume()
        },
        write: (J, W, X) => {
          let {
            req: V
          } = this;
          if (V.push(J, W) || V._readableState.destroyed) X();
          else V[E3A] = X
        },
        destroy: (J, W) => {
          let {
            body: X,
            req: V,
            res: F,
            ret: K,
            abort: D
          } = this;
          if (!J && !K._readableState.endEmitted) J = new yx1;
          if (D && J) D();
          eL.destroy(X, J), eL.destroy(V, J), eL.destroy(F, J), $p8(this), W(J)
        }
      }).on("prefinish", () => {
        let {
          req: J
        } = this;
        J.push(null)
      }), this.res = null, Up8(this, B)
    }
    onConnect(A, Q) {
      let {
        ret: B,
        res: G
      } = this;
      if (this.reason) {
        A(this.reason);
        return
      }
      YQB(!G, "pipeline cannot be retried"), YQB(!B.destroyed), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B) {
      let {
        opaque: G,
        handler: Z,
        context: I
      } = this;
      if (A < 200) {
        if (this.onInfo) {
          let J = this.responseHeaders === "raw" ? eL.parseRawHeaders(Q) : eL.parseHeaders(Q);
          this.onInfo({
            statusCode: A,
            headers: J
          })
        }
        return
      }
      this.res = new XQB(B);
      let Y;
      try {
        this.handler = null;
        let J = this.responseHeaders === "raw" ? eL.parseRawHeaders(Q) : eL.parseHeaders(Q);
        Y = this.runInAsyncScope(Z, null, {
          statusCode: A,
          headers: J,
          opaque: G,
          body: this.res,
          context: I
        })
      } catch (J) {
        throw this.res.on("error", eL.nop), J
      }
      if (!Y || typeof Y.on !== "function") throw new Ep8("expected Readable");
      Y.on("data", (J) => {
        let {
          ret: W,
          body: X
        } = this;
        if (!W.push(J) && X.pause) X.pause()
      }).on("error", (J) => {
        let {
          ret: W
        } = this;
        eL.destroy(W, J)
      }).on("end", () => {
        let {
          ret: J
        } = this;
        J.push(null)
      }).on("close", () => {
        let {
          ret: J
        } = this;
        if (!J._readableState.ended) eL.destroy(J, new yx1)
      }), this.body = Y
    }
    onData(A) {
      let {
        res: Q
      } = this;
      return Q.push(A)
    }
    onComplete(A) {
      let {
        res: Q
      } = this;
      Q.push(null)
    }
    onError(A) {
      let {
        ret: Q
      } = this;
      this.handler = null, eL.destroy(Q, A)
    }
  }

  function wp8(A, Q) {
    try {
      let B = new VQB(A, Q);
      return this.dispatch({
        ...A,
        body: B.req
      }, B), B.ret
    } catch (B) {
      return new Cp8().destroy(B)
    }
  }
  FQB.exports = wp8
})
// @from(Start 4917226, End 4919458)
$QB = z((fS7, UQB) => {
  var {
    InvalidArgumentError: xx1,
    SocketError: qp8
  } = R7(), {
    AsyncResource: Np8
  } = UA("node:async_hooks"), DQB = S6(), {
    addSignal: Lp8,
    removeSignal: HQB
  } = BzA(), CQB = UA("node:assert");
  class EQB extends Np8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new xx1("invalid opts");
      if (typeof Q !== "function") throw new xx1("invalid callback");
      let {
        signal: B,
        opaque: G,
        responseHeaders: Z
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new xx1("signal must be an EventEmitter or EventTarget");
      super("UNDICI_UPGRADE");
      this.responseHeaders = Z || null, this.opaque = G || null, this.callback = Q, this.abort = null, this.context = null, Lp8(this, B)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      CQB(this.callback), this.abort = A, this.context = null
    }
    onHeaders() {
      throw new qp8("bad upgrade", null)
    }
    onUpgrade(A, Q, B) {
      CQB(A === 101);
      let {
        callback: G,
        opaque: Z,
        context: I
      } = this;
      HQB(this), this.callback = null;
      let Y = this.responseHeaders === "raw" ? DQB.parseRawHeaders(Q) : DQB.parseHeaders(Q);
      this.runInAsyncScope(G, null, null, {
        headers: Y,
        socket: B,
        opaque: Z,
        context: I
      })
    }
    onError(A) {
      let {
        callback: Q,
        opaque: B
      } = this;
      if (HQB(this), Q) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, A, {
          opaque: B
        })
      })
    }
  }

  function zQB(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      zQB.call(this, A, (Z, I) => {
        return Z ? G(Z) : B(I)
      })
    });
    try {
      let B = new EQB(A, Q);
      this.dispatch({
        ...A,
        method: A.method || "GET",
        upgrade: A.protocol || "Websocket"
      }, B)
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  UQB.exports = zQB
})
// @from(Start 4919464, End 4921681)
OQB = z((hS7, MQB) => {
  var Mp8 = UA("node:assert"),
    {
      AsyncResource: Op8
    } = UA("node:async_hooks"),
    {
      InvalidArgumentError: vx1,
      SocketError: Rp8
    } = R7(),
    wQB = S6(),
    {
      addSignal: Tp8,
      removeSignal: qQB
    } = BzA();
  class NQB extends Op8 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new vx1("invalid opts");
      if (typeof Q !== "function") throw new vx1("invalid callback");
      let {
        signal: B,
        opaque: G,
        responseHeaders: Z
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new vx1("signal must be an EventEmitter or EventTarget");
      super("UNDICI_CONNECT");
      this.opaque = G || null, this.responseHeaders = Z || null, this.callback = Q, this.abort = null, Tp8(this, B)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Mp8(this.callback), this.abort = A, this.context = Q
    }
    onHeaders() {
      throw new Rp8("bad connect", null)
    }
    onUpgrade(A, Q, B) {
      let {
        callback: G,
        opaque: Z,
        context: I
      } = this;
      qQB(this), this.callback = null;
      let Y = Q;
      if (Y != null) Y = this.responseHeaders === "raw" ? wQB.parseRawHeaders(Q) : wQB.parseHeaders(Q);
      this.runInAsyncScope(G, null, null, {
        statusCode: A,
        headers: Y,
        socket: B,
        opaque: Z,
        context: I
      })
    }
    onError(A) {
      let {
        callback: Q,
        opaque: B
      } = this;
      if (qQB(this), Q) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, A, {
          opaque: B
        })
      })
    }
  }

  function LQB(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      LQB.call(this, A, (Z, I) => {
        return Z ? G(Z) : B(I)
      })
    });
    try {
      let B = new NQB(A, Q);
      this.dispatch({
        ...A,
        method: "CONNECT"
      }, B)
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  MQB.exports = LQB
})
// @from(Start 4921687, End 4921827)
RQB = z((Pp8, z3A) => {
  Pp8.request = o0B();
  Pp8.stream = IQB();
  Pp8.pipeline = KQB();
  Pp8.upgrade = $QB();
  Pp8.connect = OQB()
})
// @from(Start 4921833, End 4922226)
fx1 = z((gS7, TQB) => {
  var {
    UndiciError: xp8
  } = R7();
  class bx1 extends xp8 {
    constructor(A) {
      super(A);
      Error.captureStackTrace(this, bx1), this.name = "MockNotMatchedError", this.message = A || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED"
    }
  }
  TQB.exports = {
    MockNotMatchedError: bx1
  }
})
// @from(Start 4922232, End 4923052)
U3A = z((uS7, PQB) => {
  PQB.exports = {
    kAgent: Symbol("agent"),
    kOptions: Symbol("options"),
    kFactory: Symbol("factory"),
    kDispatches: Symbol("dispatches"),
    kDispatchKey: Symbol("dispatch key"),
    kDefaultHeaders: Symbol("default headers"),
    kDefaultTrailers: Symbol("default trailers"),
    kContentLength: Symbol("content length"),
    kMockAgent: Symbol("mock agent"),
    kMockAgentSet: Symbol("mock agent set"),
    kMockAgentGet: Symbol("mock agent get"),
    kMockDispatch: Symbol("mock dispatch"),
    kClose: Symbol("close"),
    kOriginalClose: Symbol("original agent close"),
    kOrigin: Symbol("origin"),
    kIsMockActive: Symbol("is mock active"),
    kNetConnect: Symbol("net connect"),
    kGetNetConnect: Symbol("get net connect"),
    kConnected: Symbol("connected")
  }
})
// @from(Start 4923058, End 4930006)
ZzA = z((mS7, gQB) => {
  var {
    MockNotMatchedError: po
  } = fx1(), {
    kDispatches: jlA,
    kMockAgent: vp8,
    kOriginalDispatch: bp8,
    kOrigin: fp8,
    kGetNetConnect: hp8
  } = U3A(), {
    buildURL: gp8
  } = S6(), {
    STATUS_CODES: up8
  } = UA("node:http"), {
    types: {
      isPromise: mp8
    }
  } = UA("node:util");

  function _b(A, Q) {
    if (typeof A === "string") return A === Q;
    if (A instanceof RegExp) return A.test(Q);
    if (typeof A === "function") return A(Q) === !0;
    return !1
  }

  function SQB(A) {
    return Object.fromEntries(Object.entries(A).map(([Q, B]) => {
      return [Q.toLocaleLowerCase(), B]
    }))
  }

  function _QB(A, Q) {
    if (Array.isArray(A)) {
      for (let B = 0; B < A.length; B += 2)
        if (A[B].toLocaleLowerCase() === Q.toLocaleLowerCase()) return A[B + 1];
      return
    } else if (typeof A.get === "function") return A.get(Q);
    else return SQB(A)[Q.toLocaleLowerCase()]
  }

  function ux1(A) {
    let Q = A.slice(),
      B = [];
    for (let G = 0; G < Q.length; G += 2) B.push([Q[G], Q[G + 1]]);
    return Object.fromEntries(B)
  }

  function kQB(A, Q) {
    if (typeof A.headers === "function") {
      if (Array.isArray(Q)) Q = ux1(Q);
      return A.headers(Q ? SQB(Q) : {})
    }
    if (typeof A.headers > "u") return !0;
    if (typeof Q !== "object" || typeof A.headers !== "object") return !1;
    for (let [B, G] of Object.entries(A.headers)) {
      let Z = _QB(Q, B);
      if (!_b(G, Z)) return !1
    }
    return !0
  }

  function jQB(A) {
    if (typeof A !== "string") return A;
    let Q = A.split("?");
    if (Q.length !== 2) return A;
    let B = new URLSearchParams(Q.pop());
    return B.sort(), [...Q, B.toString()].join("?")
  }

  function dp8(A, {
    path: Q,
    method: B,
    body: G,
    headers: Z
  }) {
    let I = _b(A.path, Q),
      Y = _b(A.method, B),
      J = typeof A.body < "u" ? _b(A.body, G) : !0,
      W = kQB(A, Z);
    return I && Y && J && W
  }

  function yQB(A) {
    if (Buffer.isBuffer(A)) return A;
    else if (A instanceof Uint8Array) return A;
    else if (A instanceof ArrayBuffer) return A;
    else if (typeof A === "object") return JSON.stringify(A);
    else return A.toString()
  }

  function xQB(A, Q) {
    let B = Q.query ? gp8(Q.path, Q.query) : Q.path,
      G = typeof B === "string" ? jQB(B) : B,
      Z = A.filter(({
        consumed: I
      }) => !I).filter(({
        path: I
      }) => _b(jQB(I), G));
    if (Z.length === 0) throw new po(`Mock dispatch not matched for path '${G}'`);
    if (Z = Z.filter(({
        method: I
      }) => _b(I, Q.method)), Z.length === 0) throw new po(`Mock dispatch not matched for method '${Q.method}' on path '${G}'`);
    if (Z = Z.filter(({
        body: I
      }) => typeof I < "u" ? _b(I, Q.body) : !0), Z.length === 0) throw new po(`Mock dispatch not matched for body '${Q.body}' on path '${G}'`);
    if (Z = Z.filter((I) => kQB(I, Q.headers)), Z.length === 0) {
      let I = typeof Q.headers === "object" ? JSON.stringify(Q.headers) : Q.headers;
      throw new po(`Mock dispatch not matched for headers '${I}' on path '${G}'`)
    }
    return Z[0]
  }

  function cp8(A, Q, B) {
    let G = {
        timesInvoked: 0,
        times: 1,
        persist: !1,
        consumed: !1
      },
      Z = typeof B === "function" ? {
        callback: B
      } : {
        ...B
      },
      I = {
        ...G,
        ...Q,
        pending: !0,
        data: {
          error: null,
          ...Z
        }
      };
    return A.push(I), I
  }

  function hx1(A, Q) {
    let B = A.findIndex((G) => {
      if (!G.consumed) return !1;
      return dp8(G, Q)
    });
    if (B !== -1) A.splice(B, 1)
  }

  function vQB(A) {
    let {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: I
    } = A;
    return {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: I
    }
  }

  function gx1(A) {
    let Q = Object.keys(A),
      B = [];
    for (let G = 0; G < Q.length; ++G) {
      let Z = Q[G],
        I = A[Z],
        Y = Buffer.from(`${Z}`);
      if (Array.isArray(I))
        for (let J = 0; J < I.length; ++J) B.push(Y, Buffer.from(`${I[J]}`));
      else B.push(Y, Buffer.from(`${I}`))
    }
    return B
  }

  function bQB(A) {
    return up8[A] || "unknown"
  }
  async function pp8(A) {
    let Q = [];
    for await (let B of A) Q.push(B);
    return Buffer.concat(Q).toString("utf8")
  }

  function fQB(A, Q) {
    let B = vQB(A),
      G = xQB(this[jlA], B);
    if (G.timesInvoked++, G.data.callback) G.data = {
      ...G.data,
      ...G.data.callback(A)
    };
    let {
      data: {
        statusCode: Z,
        data: I,
        headers: Y,
        trailers: J,
        error: W
      },
      delay: X,
      persist: V
    } = G, {
      timesInvoked: F,
      times: K
    } = G;
    if (G.consumed = !V && F >= K, G.pending = F < K, W !== null) return hx1(this[jlA], B), Q.onError(W), !0;
    if (typeof X === "number" && X > 0) setTimeout(() => {
      D(this[jlA])
    }, X);
    else D(this[jlA]);

    function D(C, E = I) {
      let U = Array.isArray(A.headers) ? ux1(A.headers) : A.headers,
        q = typeof E === "function" ? E({
          ...A,
          headers: U
        }) : E;
      if (mp8(q)) {
        q.then((T) => D(C, T));
        return
      }
      let w = yQB(q),
        N = gx1(Y),
        R = gx1(J);
      Q.onConnect?.((T) => Q.onError(T), null), Q.onHeaders?.(Z, N, H, bQB(Z)), Q.onData?.(Buffer.from(w)), Q.onComplete?.(R), hx1(C, B)
    }

    function H() {}
    return !0
  }

  function lp8() {
    let A = this[vp8],
      Q = this[fp8],
      B = this[bp8];
    return function(Z, I) {
      if (A.isMockActive) try {
        fQB.call(this, Z, I)
      } catch (Y) {
        if (Y instanceof po) {
          let J = A[hp8]();
          if (J === !1) throw new po(`${Y.message}: subsequent request to origin ${Q} was not allowed (net.connect disabled)`);
          if (hQB(J, Q)) B.call(this, Z, I);
          else throw new po(`${Y.message}: subsequent request to origin ${Q} was not allowed (net.connect is not enabled for this origin)`)
        } else throw Y
      } else B.call(this, Z, I)
    }
  }

  function hQB(A, Q) {
    let B = new URL(Q);
    if (A === !0) return !0;
    else if (Array.isArray(A) && A.some((G) => _b(G, B.host))) return !0;
    return !1
  }

  function ip8(A) {
    if (A) {
      let {
        agent: Q,
        ...B
      } = A;
      return B
    }
  }
  gQB.exports = {
    getResponseData: yQB,
    getMockDispatch: xQB,
    addMockDispatch: cp8,
    deleteMockDispatch: hx1,
    buildKey: vQB,
    generateKeyValues: gx1,
    matchValue: _b,
    getResponse: pp8,
    getStatusText: bQB,
    mockDispatch: fQB,
    buildMockDispatch: lp8,
    checkNetConnect: hQB,
    buildMockOptions: ip8,
    getHeaderByName: _QB,
    buildHeadersFromArray: ux1
  }
})
// @from(Start 4930012, End 4933649)
ix1 = z((rp8, lx1) => {
  var {
    getResponseData: np8,
    buildKey: ap8,
    addMockDispatch: mx1
  } = ZzA(), {
    kDispatches: SlA,
    kDispatchKey: _lA,
    kDefaultHeaders: dx1,
    kDefaultTrailers: cx1,
    kContentLength: px1,
    kMockDispatch: klA
  } = U3A(), {
    InvalidArgumentError: z_
  } = R7(), {
    buildURL: sp8
  } = S6();
  class IzA {
    constructor(A) {
      this[klA] = A
    }
    delay(A) {
      if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new z_("waitInMs must be a valid integer > 0");
      return this[klA].delay = A, this
    }
    persist() {
      return this[klA].persist = !0, this
    }
    times(A) {
      if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new z_("repeatTimes must be a valid integer > 0");
      return this[klA].times = A, this
    }
  }
  class uQB {
    constructor(A, Q) {
      if (typeof A !== "object") throw new z_("opts must be an object");
      if (typeof A.path > "u") throw new z_("opts.path must be defined");
      if (typeof A.method > "u") A.method = "GET";
      if (typeof A.path === "string")
        if (A.query) A.path = sp8(A.path, A.query);
        else {
          let B = new URL(A.path, "data://");
          A.path = B.pathname + B.search
        } if (typeof A.method === "string") A.method = A.method.toUpperCase();
      this[_lA] = ap8(A), this[SlA] = Q, this[dx1] = {}, this[cx1] = {}, this[px1] = !1
    }
    createMockScopeDispatchData({
      statusCode: A,
      data: Q,
      responseOptions: B
    }) {
      let G = np8(Q),
        Z = this[px1] ? {
          "content-length": G.length
        } : {},
        I = {
          ...this[dx1],
          ...Z,
          ...B.headers
        },
        Y = {
          ...this[cx1],
          ...B.trailers
        };
      return {
        statusCode: A,
        data: Q,
        headers: I,
        trailers: Y
      }
    }
    validateReplyParameters(A) {
      if (typeof A.statusCode > "u") throw new z_("statusCode must be defined");
      if (typeof A.responseOptions !== "object" || A.responseOptions === null) throw new z_("responseOptions must be an object")
    }
    reply(A) {
      if (typeof A === "function") {
        let Z = (Y) => {
            let J = A(Y);
            if (typeof J !== "object" || J === null) throw new z_("reply options callback must return an object");
            let W = {
              data: "",
              responseOptions: {},
              ...J
            };
            return this.validateReplyParameters(W), {
              ...this.createMockScopeDispatchData(W)
            }
          },
          I = mx1(this[SlA], this[_lA], Z);
        return new IzA(I)
      }
      let Q = {
        statusCode: A,
        data: arguments[1] === void 0 ? "" : arguments[1],
        responseOptions: arguments[2] === void 0 ? {} : arguments[2]
      };
      this.validateReplyParameters(Q);
      let B = this.createMockScopeDispatchData(Q),
        G = mx1(this[SlA], this[_lA], B);
      return new IzA(G)
    }
    replyWithError(A) {
      if (typeof A > "u") throw new z_("error must be defined");
      let Q = mx1(this[SlA], this[_lA], {
        error: A
      });
      return new IzA(Q)
    }
    defaultReplyHeaders(A) {
      if (typeof A > "u") throw new z_("headers must be defined");
      return this[dx1] = A, this
    }
    defaultReplyTrailers(A) {
      if (typeof A > "u") throw new z_("trailers must be defined");
      return this[cx1] = A, this
    }
    replyContentLength() {
      return this[px1] = !0, this
    }
  }
  rp8.MockInterceptor = uQB;
  rp8.MockScope = IzA
})
// @from(Start 4933655, End 4934694)
ax1 = z((dS7, aQB) => {
  var {
    promisify: ep8
  } = UA("node:util"), Al8 = iEA(), {
    buildMockDispatch: Ql8
  } = ZzA(), {
    kDispatches: mQB,
    kMockAgent: dQB,
    kClose: cQB,
    kOriginalClose: pQB,
    kOrigin: lQB,
    kOriginalDispatch: Bl8,
    kConnected: nx1
  } = U3A(), {
    MockInterceptor: Gl8
  } = ix1(), iQB = tI(), {
    InvalidArgumentError: Zl8
  } = R7();
  class nQB extends Al8 {
    constructor(A, Q) {
      super(A, Q);
      if (!Q || !Q.agent || typeof Q.agent.dispatch !== "function") throw new Zl8("Argument opts.agent must implement Agent");
      this[dQB] = Q.agent, this[lQB] = A, this[mQB] = [], this[nx1] = 1, this[Bl8] = this.dispatch, this[pQB] = this.close.bind(this), this.dispatch = Ql8.call(this), this.close = this[cQB]
    }
    get[iQB.kConnected]() {
      return this[nx1]
    }
    intercept(A) {
      return new Gl8(A, this[mQB])
    }
    async [cQB]() {
      await ep8(this[pQB])(), this[nx1] = 0, this[dQB][iQB.kClients].delete(this[lQB])
    }
  }
  aQB.exports = nQB
})
// @from(Start 4934700, End 4935739)
rx1 = z((cS7, BBB) => {
  var {
    promisify: Il8
  } = UA("node:util"), Yl8 = V3A(), {
    buildMockDispatch: Jl8
  } = ZzA(), {
    kDispatches: sQB,
    kMockAgent: rQB,
    kClose: oQB,
    kOriginalClose: tQB,
    kOrigin: eQB,
    kOriginalDispatch: Wl8,
    kConnected: sx1
  } = U3A(), {
    MockInterceptor: Xl8
  } = ix1(), ABB = tI(), {
    InvalidArgumentError: Vl8
  } = R7();
  class QBB extends Yl8 {
    constructor(A, Q) {
      super(A, Q);
      if (!Q || !Q.agent || typeof Q.agent.dispatch !== "function") throw new Vl8("Argument opts.agent must implement Agent");
      this[rQB] = Q.agent, this[eQB] = A, this[sQB] = [], this[sx1] = 1, this[Wl8] = this.dispatch, this[tQB] = this.close.bind(this), this.dispatch = Jl8.call(this), this.close = this[oQB]
    }
    get[ABB.kConnected]() {
      return this[sx1]
    }
    intercept(A) {
      return new Xl8(A, this[sQB])
    }
    async [oQB]() {
      await Il8(this[tQB])(), this[sx1] = 0, this[rQB][ABB.kClients].delete(this[eQB])
    }
  }
  BBB.exports = QBB
})
// @from(Start 4935745, End 4936254)
ZBB = z((pS7, GBB) => {
  var Fl8 = {
      pronoun: "it",
      is: "is",
      was: "was",
      this: "this"
    },
    Kl8 = {
      pronoun: "they",
      is: "are",
      was: "were",
      this: "these"
    };
  GBB.exports = class {
    constructor(Q, B) {
      this.singular = Q, this.plural = B
    }
    pluralize(Q) {
      let B = Q === 1,
        G = B ? Fl8 : Kl8,
        Z = B ? this.singular : this.plural;
      return {
        ...G,
        count: Q,
        noun: Z
      }
    }
  }
})
// @from(Start 4936260, End 4937269)
YBB = z((lS7, IBB) => {
  var {
    Transform: Dl8
  } = UA("node:stream"), {
    Console: Hl8
  } = UA("node:console"), Cl8 = process.versions.icu ? "✅" : "Y ", El8 = process.versions.icu ? "❌" : "N ";
  IBB.exports = class {
    constructor({
      disableColors: Q
    } = {}) {
      this.transform = new Dl8({
        transform(B, G, Z) {
          Z(null, B)
        }
      }), this.logger = new Hl8({
        stdout: this.transform,
        inspectOptions: {
          colors: !Q && !0
        }
      })
    }
    format(Q) {
      let B = Q.map(({
        method: G,
        path: Z,
        data: {
          statusCode: I
        },
        persist: Y,
        times: J,
        timesInvoked: W,
        origin: X
      }) => ({
        Method: G,
        Origin: X,
        Path: Z,
        "Status code": I,
        Persistent: Y ? Cl8 : El8,
        Invocations: W,
        Remaining: Y ? 1 / 0 : J - W
      }));
      return this.logger.table(B), this.transform.read().toString()
    }
  }
})
// @from(Start 4937275, End 4940117)
FBB = z((iS7, VBB) => {
  var {
    kClients: lo
  } = tI(), zl8 = F3A(), {
    kAgent: ox1,
    kMockAgentSet: ylA,
    kMockAgentGet: JBB,
    kDispatches: tx1,
    kIsMockActive: xlA,
    kNetConnect: io,
    kGetNetConnect: Ul8,
    kOptions: vlA,
    kFactory: blA
  } = U3A(), $l8 = ax1(), wl8 = rx1(), {
    matchValue: ql8,
    buildMockOptions: Nl8
  } = ZzA(), {
    InvalidArgumentError: WBB,
    UndiciError: Ll8
  } = R7(), Ml8 = OEA(), Ol8 = ZBB(), Rl8 = YBB();
  class XBB extends Ml8 {
    constructor(A) {
      super(A);
      if (this[io] = !0, this[xlA] = !0, A?.agent && typeof A.agent.dispatch !== "function") throw new WBB("Argument opts.agent must implement Agent");
      let Q = A?.agent ? A.agent : new zl8(A);
      this[ox1] = Q, this[lo] = Q[lo], this[vlA] = Nl8(A)
    }
    get(A) {
      let Q = this[JBB](A);
      if (!Q) Q = this[blA](A), this[ylA](A, Q);
      return Q
    }
    dispatch(A, Q) {
      return this.get(A.origin), this[ox1].dispatch(A, Q)
    }
    async close() {
      await this[ox1].close(), this[lo].clear()
    }
    deactivate() {
      this[xlA] = !1
    }
    activate() {
      this[xlA] = !0
    }
    enableNetConnect(A) {
      if (typeof A === "string" || typeof A === "function" || A instanceof RegExp)
        if (Array.isArray(this[io])) this[io].push(A);
        else this[io] = [A];
      else if (typeof A > "u") this[io] = !0;
      else throw new WBB("Unsupported matcher. Must be one of String|Function|RegExp.")
    }
    disableNetConnect() {
      this[io] = !1
    }
    get isMockActive() {
      return this[xlA]
    } [ylA](A, Q) {
      this[lo].set(A, Q)
    } [blA](A) {
      let Q = Object.assign({
        agent: this
      }, this[vlA]);
      return this[vlA] && this[vlA].connections === 1 ? new $l8(A, Q) : new wl8(A, Q)
    } [JBB](A) {
      let Q = this[lo].get(A);
      if (Q) return Q;
      if (typeof A !== "string") {
        let B = this[blA]("http://localhost:9999");
        return this[ylA](A, B), B
      }
      for (let [B, G] of Array.from(this[lo]))
        if (G && typeof B !== "string" && ql8(B, A)) {
          let Z = this[blA](A);
          return this[ylA](A, Z), Z[tx1] = G[tx1], Z
        }
    } [Ul8]() {
      return this[io]
    }
    pendingInterceptors() {
      let A = this[lo];
      return Array.from(A.entries()).flatMap(([Q, B]) => B[tx1].map((G) => ({
        ...G,
        origin: Q
      }))).filter(({
        pending: Q
      }) => Q)
    }
    assertNoPendingInterceptors({
      pendingInterceptorsFormatter: A = new Rl8
    } = {}) {
      let Q = this.pendingInterceptors();
      if (Q.length === 0) return;
      let B = new Ol8("interceptor", "interceptors").pluralize(Q.length);
      throw new Ll8(`
${B.count} ${B.noun} ${B.is} pending:

${A.format(Q)}
`.trim())
    }
  }
  VBB.exports = XBB
})
// @from(Start 4940123, End 4940701)
flA = z((nS7, CBB) => {
  var KBB = Symbol.for("undici.globalDispatcher.1"),
    {
      InvalidArgumentError: Tl8
    } = R7(),
    Pl8 = F3A();
  if (HBB() === void 0) DBB(new Pl8);

  function DBB(A) {
    if (!A || typeof A.dispatch !== "function") throw new Tl8("Argument agent must implement Agent");
    Object.defineProperty(globalThis, KBB, {
      value: A,
      writable: !0,
      enumerable: !1,
      configurable: !1
    })
  }

  function HBB() {
    return globalThis[KBB]
  }
  CBB.exports = {
    setGlobalDispatcher: DBB,
    getGlobalDispatcher: HBB
  }
})
// @from(Start 4940707, End 4941453)
hlA = z((aS7, EBB) => {
  EBB.exports = class {
    #A;
    constructor(Q) {
      if (typeof Q !== "object" || Q === null) throw TypeError("handler must be an object");
      this.#A = Q
    }
    onConnect(...Q) {
      return this.#A.onConnect?.(...Q)
    }
    onError(...Q) {
      return this.#A.onError?.(...Q)
    }
    onUpgrade(...Q) {
      return this.#A.onUpgrade?.(...Q)
    }
    onResponseStarted(...Q) {
      return this.#A.onResponseStarted?.(...Q)
    }
    onHeaders(...Q) {
      return this.#A.onHeaders?.(...Q)
    }
    onData(...Q) {
      return this.#A.onData?.(...Q)
    }
    onComplete(...Q) {
      return this.#A.onComplete?.(...Q)
    }
    onBodySent(...Q) {
      return this.#A.onBodySent?.(...Q)
    }
  }
})
// @from(Start 4941459, End 4941799)
UBB = z((sS7, zBB) => {
  var jl8 = UlA();
  zBB.exports = (A) => {
    let Q = A?.maxRedirections;
    return (B) => {
      return function(Z, I) {
        let {
          maxRedirections: Y = Q,
          ...J
        } = Z;
        if (!Y) return B(Z, I);
        let W = new jl8(B, Y, Z, I);
        return B(J, W)
      }
    }
  }
})
// @from(Start 4941805, End 4942144)
wBB = z((rS7, $BB) => {
  var Sl8 = PlA();
  $BB.exports = (A) => {
    return (Q) => {
      return function(G, Z) {
        return Q(G, new Sl8({
          ...G,
          retryOptions: {
            ...A,
            ...G.retryOptions
          }
        }, {
          handler: Z,
          dispatch: Q
        }))
      }
    }
  }
})
// @from(Start 4942150, End 4943790)
LBB = z((oS7, NBB) => {
  var _l8 = S6(),
    {
      InvalidArgumentError: kl8,
      RequestAbortedError: yl8
    } = R7(),
    xl8 = hlA();
  class qBB extends xl8 {
    #A = 1048576;
    #Q = null;
    #B = !1;
    #Z = !1;
    #G = 0;
    #J = null;
    #I = null;
    constructor({
      maxSize: A
    }, Q) {
      super(Q);
      if (A != null && (!Number.isFinite(A) || A < 1)) throw new kl8("maxSize must be a number greater than 0");
      this.#A = A ?? this.#A, this.#I = Q
    }
    onConnect(A) {
      this.#Q = A, this.#I.onConnect(this.#V.bind(this))
    }
    #V(A) {
      this.#Z = !0, this.#J = A
    }
    onHeaders(A, Q, B, G) {
      let I = _l8.parseHeaders(Q)["content-length"];
      if (I != null && I > this.#A) throw new yl8(`Response size (${I}) larger than maxSize (${this.#A})`);
      if (this.#Z) return !0;
      return this.#I.onHeaders(A, Q, B, G)
    }
    onError(A) {
      if (this.#B) return;
      A = this.#J ?? A, this.#I.onError(A)
    }
    onData(A) {
      if (this.#G = this.#G + A.length, this.#G >= this.#A)
        if (this.#B = !0, this.#Z) this.#I.onError(this.#J);
        else this.#I.onComplete([]);
      return !0
    }
    onComplete(A) {
      if (this.#B) return;
      if (this.#Z) {
        this.#I.onError(this.reason);
        return
      }
      this.#I.onComplete(A)
    }
  }

  function vl8({
    maxSize: A
  } = {
    maxSize: 1048576
  }) {
    return (Q) => {
      return function(G, Z) {
        let {
          dumpMaxSize: I = A
        } = G, Y = new qBB({
          maxSize: I
        }, Z);
        return Q(G, Y)
      }
    }
  }
  NBB.exports = vl8
})
// @from(Start 4943796, End 4949999)
PBB = z((tS7, TBB) => {
  var {
    isIP: bl8
  } = UA("node:net"), {
    lookup: fl8
  } = UA("node:dns"), hl8 = hlA(), {
    InvalidArgumentError: $3A,
    InformationalError: gl8
  } = R7(), MBB = Math.pow(2, 31) - 1;
  class OBB {
    #A = 0;
    #Q = 0;
    #B = new Map;
    dualStack = !0;
    affinity = null;
    lookup = null;
    pick = null;
    constructor(A) {
      this.#A = A.maxTTL, this.#Q = A.maxItems, this.dualStack = A.dualStack, this.affinity = A.affinity, this.lookup = A.lookup ?? this.#Z, this.pick = A.pick ?? this.#G
    }
    get full() {
      return this.#B.size === this.#Q
    }
    runLookup(A, Q, B) {
      let G = this.#B.get(A.hostname);
      if (G == null && this.full) {
        B(null, A.origin);
        return
      }
      let Z = {
        affinity: this.affinity,
        dualStack: this.dualStack,
        lookup: this.lookup,
        pick: this.pick,
        ...Q.dns,
        maxTTL: this.#A,
        maxItems: this.#Q
      };
      if (G == null) this.lookup(A, Z, (I, Y) => {
        if (I || Y == null || Y.length === 0) {
          B(I ?? new gl8("No DNS entries found"));
          return
        }
        this.setRecords(A, Y);
        let J = this.#B.get(A.hostname),
          W = this.pick(A, J, Z.affinity),
          X;
        if (typeof W.port === "number") X = `:${W.port}`;
        else if (A.port !== "") X = `:${A.port}`;
        else X = "";
        B(null, `${A.protocol}//${W.family===6?`[${W.address}]`:W.address}${X}`)
      });
      else {
        let I = this.pick(A, G, Z.affinity);
        if (I == null) {
          this.#B.delete(A.hostname), this.runLookup(A, Q, B);
          return
        }
        let Y;
        if (typeof I.port === "number") Y = `:${I.port}`;
        else if (A.port !== "") Y = `:${A.port}`;
        else Y = "";
        B(null, `${A.protocol}//${I.family===6?`[${I.address}]`:I.address}${Y}`)
      }
    }
    #Z(A, Q, B) {
      fl8(A.hostname, {
        all: !0,
        family: this.dualStack === !1 ? this.affinity : 0,
        order: "ipv4first"
      }, (G, Z) => {
        if (G) return B(G);
        let I = new Map;
        for (let Y of Z) I.set(`${Y.address}:${Y.family}`, Y);
        B(null, I.values())
      })
    }
    #G(A, Q, B) {
      let G = null,
        {
          records: Z,
          offset: I
        } = Q,
        Y;
      if (this.dualStack) {
        if (B == null)
          if (I == null || I === MBB) Q.offset = 0, B = 4;
          else Q.offset++, B = (Q.offset & 1) === 1 ? 6 : 4;
        if (Z[B] != null && Z[B].ips.length > 0) Y = Z[B];
        else Y = Z[B === 4 ? 6 : 4]
      } else Y = Z[B];
      if (Y == null || Y.ips.length === 0) return G;
      if (Y.offset == null || Y.offset === MBB) Y.offset = 0;
      else Y.offset++;
      let J = Y.offset % Y.ips.length;
      if (G = Y.ips[J] ?? null, G == null) return G;
      if (Date.now() - G.timestamp > G.ttl) return Y.ips.splice(J, 1), this.pick(A, Q, B);
      return G
    }
    setRecords(A, Q) {
      let B = Date.now(),
        G = {
          records: {
            4: null,
            6: null
          }
        };
      for (let Z of Q) {
        if (Z.timestamp = B, typeof Z.ttl === "number") Z.ttl = Math.min(Z.ttl, this.#A);
        else Z.ttl = this.#A;
        let I = G.records[Z.family] ?? {
          ips: []
        };
        I.ips.push(Z), G.records[Z.family] = I
      }
      this.#B.set(A.hostname, G)
    }
    getHandler(A, Q) {
      return new RBB(this, A, Q)
    }
  }
  class RBB extends hl8 {
    #A = null;
    #Q = null;
    #B = null;
    #Z = null;
    #G = null;
    constructor(A, {
      origin: Q,
      handler: B,
      dispatch: G
    }, Z) {
      super(B);
      this.#G = Q, this.#Z = B, this.#Q = {
        ...Z
      }, this.#A = A, this.#B = G
    }
    onError(A) {
      switch (A.code) {
        case "ETIMEDOUT":
        case "ECONNREFUSED": {
          if (this.#A.dualStack) {
            this.#A.runLookup(this.#G, this.#Q, (Q, B) => {
              if (Q) return this.#Z.onError(Q);
              let G = {
                ...this.#Q,
                origin: B
              };
              this.#B(G, this)
            });
            return
          }
          this.#Z.onError(A);
          return
        }
        case "ENOTFOUND":
          this.#A.deleteRecord(this.#G);
        default:
          this.#Z.onError(A);
          break
      }
    }
  }
  TBB.exports = (A) => {
    if (A?.maxTTL != null && (typeof A?.maxTTL !== "number" || A?.maxTTL < 0)) throw new $3A("Invalid maxTTL. Must be a positive number");
    if (A?.maxItems != null && (typeof A?.maxItems !== "number" || A?.maxItems < 1)) throw new $3A("Invalid maxItems. Must be a positive number and greater than zero");
    if (A?.affinity != null && A?.affinity !== 4 && A?.affinity !== 6) throw new $3A("Invalid affinity. Must be either 4 or 6");
    if (A?.dualStack != null && typeof A?.dualStack !== "boolean") throw new $3A("Invalid dualStack. Must be a boolean");
    if (A?.lookup != null && typeof A?.lookup !== "function") throw new $3A("Invalid lookup. Must be a function");
    if (A?.pick != null && typeof A?.pick !== "function") throw new $3A("Invalid pick. Must be a function");
    let Q = A?.dualStack ?? !0,
      B;
    if (Q) B = A?.affinity ?? null;
    else B = A?.affinity ?? 4;
    let G = {
        maxTTL: A?.maxTTL ?? 1e4,
        lookup: A?.lookup ?? null,
        pick: A?.pick ?? null,
        dualStack: Q,
        affinity: B,
        maxItems: A?.maxItems ?? 1 / 0
      },
      Z = new OBB(G);
    return (I) => {
      return function(J, W) {
        let X = J.origin.constructor === URL ? J.origin : new URL(J.origin);
        if (bl8(X.hostname) !== 0) return I(J, W);
        return Z.runLookup(X, J, (V, F) => {
          if (V) return W.onError(V);
          let K = null;
          K = {
            ...J,
            servername: X.hostname,
            origin: F,
            headers: {
              host: X.hostname,
              ...J.headers
            }
          }, I(K, Z.getHandler({
            origin: X,
            dispatch: I,
            handler: W
          }, J))
        }), !0
      }
    }
  }
})
// @from(Start 4950005, End 4959536)
no = z((eS7, vBB) => {
  var {
    kConstruct: ul8
  } = tI(), {
    kEnumerableProperty: w3A
  } = S6(), {
    iteratorMixin: ml8,
    isValidHeaderName: YzA,
    isValidHeaderValue: SBB
  } = xw(), {
    webidl: X3
  } = zD(), ex1 = UA("node:assert"), glA = UA("node:util"), vX = Symbol("headers map"), fw = Symbol("headers map sorted");

  function jBB(A) {
    return A === 10 || A === 13 || A === 9 || A === 32
  }

  function _BB(A) {
    let Q = 0,
      B = A.length;
    while (B > Q && jBB(A.charCodeAt(B - 1))) --B;
    while (B > Q && jBB(A.charCodeAt(Q))) ++Q;
    return Q === 0 && B === A.length ? A : A.substring(Q, B)
  }

  function kBB(A, Q) {
    if (Array.isArray(Q))
      for (let B = 0; B < Q.length; ++B) {
        let G = Q[B];
        if (G.length !== 2) throw X3.errors.exception({
          header: "Headers constructor",
          message: `expected name/value pair to be length 2, found ${G.length}.`
        });
        Av1(A, G[0], G[1])
      } else if (typeof Q === "object" && Q !== null) {
        let B = Object.keys(Q);
        for (let G = 0; G < B.length; ++G) Av1(A, B[G], Q[B[G]])
      } else throw X3.errors.conversionFailed({
        prefix: "Headers constructor",
        argument: "Argument 1",
        types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
      })
  }

  function Av1(A, Q, B) {
    if (B = _BB(B), !YzA(Q)) throw X3.errors.invalidArgument({
      prefix: "Headers.append",
      value: Q,
      type: "header name"
    });
    else if (!SBB(B)) throw X3.errors.invalidArgument({
      prefix: "Headers.append",
      value: B,
      type: "header value"
    });
    if (xBB(A) === "immutable") throw TypeError("immutable");
    return Qv1(A).append(Q, B, !1)
  }

  function yBB(A, Q) {
    return A[0] < Q[0] ? -1 : 1
  }
  class ulA {
    cookies = null;
    constructor(A) {
      if (A instanceof ulA) this[vX] = new Map(A[vX]), this[fw] = A[fw], this.cookies = A.cookies === null ? null : [...A.cookies];
      else this[vX] = new Map(A), this[fw] = null
    }
    contains(A, Q) {
      return this[vX].has(Q ? A : A.toLowerCase())
    }
    clear() {
      this[vX].clear(), this[fw] = null, this.cookies = null
    }
    append(A, Q, B) {
      this[fw] = null;
      let G = B ? A : A.toLowerCase(),
        Z = this[vX].get(G);
      if (Z) {
        let I = G === "cookie" ? "; " : ", ";
        this[vX].set(G, {
          name: Z.name,
          value: `${Z.value}${I}${Q}`
        })
      } else this[vX].set(G, {
        name: A,
        value: Q
      });
      if (G === "set-cookie")(this.cookies ??= []).push(Q)
    }
    set(A, Q, B) {
      this[fw] = null;
      let G = B ? A : A.toLowerCase();
      if (G === "set-cookie") this.cookies = [Q];
      this[vX].set(G, {
        name: A,
        value: Q
      })
    }
    delete(A, Q) {
      if (this[fw] = null, !Q) A = A.toLowerCase();
      if (A === "set-cookie") this.cookies = null;
      this[vX].delete(A)
    }
    get(A, Q) {
      return this[vX].get(Q ? A : A.toLowerCase())?.value ?? null
    }*[Symbol.iterator]() {
      for (let {
          0: A,
          1: {
            value: Q
          }
        }
        of this[vX]) yield [A, Q]
    }
    get entries() {
      let A = {};
      if (this[vX].size !== 0)
        for (let {
            name: Q,
            value: B
          }
          of this[vX].values()) A[Q] = B;
      return A
    }
    rawValues() {
      return this[vX].values()
    }
    get entriesList() {
      let A = [];
      if (this[vX].size !== 0)
        for (let {
            0: Q,
            1: {
              name: B,
              value: G
            }
          }
          of this[vX])
          if (Q === "set-cookie")
            for (let Z of this.cookies) A.push([B, Z]);
          else A.push([B, G]);
      return A
    }
    toSortedArray() {
      let A = this[vX].size,
        Q = Array(A);
      if (A <= 32) {
        if (A === 0) return Q;
        let B = this[vX][Symbol.iterator](),
          G = B.next().value;
        Q[0] = [G[0], G[1].value], ex1(G[1].value !== null);
        for (let Z = 1, I = 0, Y = 0, J = 0, W = 0, X, V; Z < A; ++Z) {
          V = B.next().value, X = Q[Z] = [V[0], V[1].value], ex1(X[1] !== null), J = 0, Y = Z;
          while (J < Y)
            if (W = J + (Y - J >> 1), Q[W][0] <= X[0]) J = W + 1;
            else Y = W;
          if (Z !== W) {
            I = Z;
            while (I > J) Q[I] = Q[--I];
            Q[J] = X
          }
        }
        if (!B.next().done) throw TypeError("Unreachable");
        return Q
      } else {
        let B = 0;
        for (let {
            0: G,
            1: {
              value: Z
            }
          }
          of this[vX]) Q[B++] = [G, Z], ex1(Z !== null);
        return Q.sort(yBB)
      }
    }
  }
  class kH {
    #A;
    #Q;
    constructor(A = void 0) {
      if (X3.util.markAsUncloneable(this), A === ul8) return;
      if (this.#Q = new ulA, this.#A = "none", A !== void 0) A = X3.converters.HeadersInit(A, "Headers contructor", "init"), kBB(this, A)
    }
    append(A, Q) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 2, "Headers.append");
      let B = "Headers.append";
      return A = X3.converters.ByteString(A, B, "name"), Q = X3.converters.ByteString(Q, B, "value"), Av1(this, A, Q)
    }
    delete(A) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 1, "Headers.delete");
      let Q = "Headers.delete";
      if (A = X3.converters.ByteString(A, Q, "name"), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: "Headers.delete",
        value: A,
        type: "header name"
      });
      if (this.#A === "immutable") throw TypeError("immutable");
      if (!this.#Q.contains(A, !1)) return;
      this.#Q.delete(A, !1)
    }
    get(A) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 1, "Headers.get");
      let Q = "Headers.get";
      if (A = X3.converters.ByteString(A, Q, "name"), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: Q,
        value: A,
        type: "header name"
      });
      return this.#Q.get(A, !1)
    }
    has(A) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 1, "Headers.has");
      let Q = "Headers.has";
      if (A = X3.converters.ByteString(A, Q, "name"), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: Q,
        value: A,
        type: "header name"
      });
      return this.#Q.contains(A, !1)
    }
    set(A, Q) {
      X3.brandCheck(this, kH), X3.argumentLengthCheck(arguments, 2, "Headers.set");
      let B = "Headers.set";
      if (A = X3.converters.ByteString(A, B, "name"), Q = X3.converters.ByteString(Q, B, "value"), Q = _BB(Q), !YzA(A)) throw X3.errors.invalidArgument({
        prefix: B,
        value: A,
        type: "header name"
      });
      else if (!SBB(Q)) throw X3.errors.invalidArgument({
        prefix: B,
        value: Q,
        type: "header value"
      });
      if (this.#A === "immutable") throw TypeError("immutable");
      this.#Q.set(A, Q, !1)
    }
    getSetCookie() {
      X3.brandCheck(this, kH);
      let A = this.#Q.cookies;
      if (A) return [...A];
      return []
    }
    get[fw]() {
      if (this.#Q[fw]) return this.#Q[fw];
      let A = [],
        Q = this.#Q.toSortedArray(),
        B = this.#Q.cookies;
      if (B === null || B.length === 1) return this.#Q[fw] = Q;
      for (let G = 0; G < Q.length; ++G) {
        let {
          0: Z,
          1: I
        } = Q[G];
        if (Z === "set-cookie")
          for (let Y = 0; Y < B.length; ++Y) A.push([Z, B[Y]]);
        else A.push([Z, I])
      }
      return this.#Q[fw] = A
    } [glA.inspect.custom](A, Q) {
      return Q.depth ??= A, `Headers ${glA.formatWithOptions(Q,this.#Q.entries)}`
    }
    static getHeadersGuard(A) {
      return A.#A
    }
    static setHeadersGuard(A, Q) {
      A.#A = Q
    }
    static getHeadersList(A) {
      return A.#Q
    }
    static setHeadersList(A, Q) {
      A.#Q = Q
    }
  }
  var {
    getHeadersGuard: xBB,
    setHeadersGuard: dl8,
    getHeadersList: Qv1,
    setHeadersList: cl8
  } = kH;
  Reflect.deleteProperty(kH, "getHeadersGuard");
  Reflect.deleteProperty(kH, "setHeadersGuard");
  Reflect.deleteProperty(kH, "getHeadersList");
  Reflect.deleteProperty(kH, "setHeadersList");
  ml8("Headers", kH, fw, 0, 1);
  Object.defineProperties(kH.prototype, {
    append: w3A,
    delete: w3A,
    get: w3A,
    has: w3A,
    set: w3A,
    getSetCookie: w3A,
    [Symbol.toStringTag]: {
      value: "Headers",
      configurable: !0
    },
    [glA.inspect.custom]: {
      enumerable: !1
    }
  });
  X3.converters.HeadersInit = function(A, Q, B) {
    if (X3.util.Type(A) === "Object") {
      let G = Reflect.get(A, Symbol.iterator);
      if (!glA.types.isProxy(A) && G === kH.prototype.entries) try {
        return Qv1(A).entriesList
      } catch {}
      if (typeof G === "function") return X3.converters["sequence<sequence<ByteString>>"](A, Q, B, G.bind(A));
      return X3.converters["record<ByteString, ByteString>"](A, Q, B)
    }
    throw X3.errors.conversionFailed({
      prefix: "Headers constructor",
      argument: "Argument 1",
      types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
    })
  };
  vBB.exports = {
    fill: kBB,
    compareHeaderName: yBB,
    Headers: kH,
    HeadersList: ulA,
    getHeadersGuard: xBB,
    setHeadersGuard: dl8,
    setHeadersList: cl8,
    getHeadersList: Qv1
  }
})
// @from(Start 4959542, End 4968608)
WzA = z((A_7, lBB) => {
  var {
    Headers: mBB,
    HeadersList: bBB,
    fill: pl8,
    getHeadersGuard: ll8,
    setHeadersGuard: dBB,
    setHeadersList: cBB
  } = no(), {
    extractBody: fBB,
    cloneBody: il8,
    mixinBody: nl8,
    hasFinalizationRegistry: al8,
    streamRegistry: sl8,
    bodyUnusable: rl8
  } = G3A(), Bv1 = S6(), hBB = UA("node:util"), {
    kEnumerableProperty: hw
  } = Bv1, {
    isValidReasonPhrase: ol8,
    isCancelled: tl8,
    isAborted: el8,
    isBlobLike: Ai8,
    serializeJavascriptValueToJSONString: Qi8,
    isErrorLike: Bi8,
    isomorphicEncode: Gi8,
    environmentSettingsObject: Zi8
  } = xw(), {
    redirectStatusSet: Ii8,
    nullBodyStatus: Yi8
  } = PEA(), {
    kState: RJ,
    kHeaders: kb
  } = Kc(), {
    webidl: p8
  } = zD(), {
    FormData: Ji8
  } = yEA(), {
    URLSerializer: gBB
  } = QU(), {
    kConstruct: dlA
  } = tI(), Gv1 = UA("node:assert"), {
    types: Wi8
  } = UA("node:util"), Xi8 = new TextEncoder("utf-8");
  class yH {
    static error() {
      return JzA(clA(), "immutable")
    }
    static json(A, Q = {}) {
      if (p8.argumentLengthCheck(arguments, 1, "Response.json"), Q !== null) Q = p8.converters.ResponseInit(Q);
      let B = Xi8.encode(Qi8(A)),
        G = fBB(B),
        Z = JzA(q3A({}), "response");
      return uBB(Z, Q, {
        body: G[0],
        type: "application/json"
      }), Z
    }
    static redirect(A, Q = 302) {
      p8.argumentLengthCheck(arguments, 1, "Response.redirect"), A = p8.converters.USVString(A), Q = p8.converters["unsigned short"](Q);
      let B;
      try {
        B = new URL(A, Zi8.settingsObject.baseUrl)
      } catch (I) {
        throw TypeError(`Failed to parse URL from ${A}`, {
          cause: I
        })
      }
      if (!Ii8.has(Q)) throw RangeError(`Invalid status code ${Q}`);
      let G = JzA(q3A({}), "immutable");
      G[RJ].status = Q;
      let Z = Gi8(gBB(B));
      return G[RJ].headersList.append("location", Z, !0), G
    }
    constructor(A = null, Q = {}) {
      if (p8.util.markAsUncloneable(this), A === dlA) return;
      if (A !== null) A = p8.converters.BodyInit(A);
      Q = p8.converters.ResponseInit(Q), this[RJ] = q3A({}), this[kb] = new mBB(dlA), dBB(this[kb], "response"), cBB(this[kb], this[RJ].headersList);
      let B = null;
      if (A != null) {
        let [G, Z] = fBB(A);
        B = {
          body: G,
          type: Z
        }
      }
      uBB(this, Q, B)
    }
    get type() {
      return p8.brandCheck(this, yH), this[RJ].type
    }
    get url() {
      p8.brandCheck(this, yH);
      let A = this[RJ].urlList,
        Q = A[A.length - 1] ?? null;
      if (Q === null) return "";
      return gBB(Q, !0)
    }
    get redirected() {
      return p8.brandCheck(this, yH), this[RJ].urlList.length > 1
    }
    get status() {
      return p8.brandCheck(this, yH), this[RJ].status
    }
    get ok() {
      return p8.brandCheck(this, yH), this[RJ].status >= 200 && this[RJ].status <= 299
    }
    get statusText() {
      return p8.brandCheck(this, yH), this[RJ].statusText
    }
    get headers() {
      return p8.brandCheck(this, yH), this[kb]
    }
    get body() {
      return p8.brandCheck(this, yH), this[RJ].body ? this[RJ].body.stream : null
    }
    get bodyUsed() {
      return p8.brandCheck(this, yH), !!this[RJ].body && Bv1.isDisturbed(this[RJ].body.stream)
    }
    clone() {
      if (p8.brandCheck(this, yH), rl8(this)) throw p8.errors.exception({
        header: "Response.clone",
        message: "Body has already been consumed."
      });
      let A = Zv1(this[RJ]);
      return JzA(A, ll8(this[kb]))
    } [hBB.inspect.custom](A, Q) {
      if (Q.depth === null) Q.depth = 2;
      Q.colors ??= !0;
      let B = {
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        body: this.body,
        bodyUsed: this.bodyUsed,
        ok: this.ok,
        redirected: this.redirected,
        type: this.type,
        url: this.url
      };
      return `Response ${hBB.formatWithOptions(Q,B)}`
    }
  }
  nl8(yH);
  Object.defineProperties(yH.prototype, {
    type: hw,
    url: hw,
    status: hw,
    ok: hw,
    redirected: hw,
    statusText: hw,
    headers: hw,
    clone: hw,
    body: hw,
    bodyUsed: hw,
    [Symbol.toStringTag]: {
      value: "Response",
      configurable: !0
    }
  });
  Object.defineProperties(yH, {
    json: hw,
    redirect: hw,
    error: hw
  });

  function Zv1(A) {
    if (A.internalResponse) return pBB(Zv1(A.internalResponse), A.type);
    let Q = q3A({
      ...A,
      body: null
    });
    if (A.body != null) Q.body = il8(Q, A.body);
    return Q
  }

  function q3A(A) {
    return {
      aborted: !1,
      rangeRequested: !1,
      timingAllowPassed: !1,
      requestIncludesCredentials: !1,
      type: "default",
      status: 200,
      timingInfo: null,
      cacheState: "",
      statusText: "",
      ...A,
      headersList: A?.headersList ? new bBB(A?.headersList) : new bBB,
      urlList: A?.urlList ? [...A.urlList] : []
    }
  }

  function clA(A) {
    let Q = Bi8(A);
    return q3A({
      type: "error",
      status: 0,
      error: Q ? A : Error(A ? String(A) : A),
      aborted: A && A.name === "AbortError"
    })
  }

  function Vi8(A) {
    return A.type === "error" && A.status === 0
  }

  function mlA(A, Q) {
    return Q = {
      internalResponse: A,
      ...Q
    }, new Proxy(A, {
      get(B, G) {
        return G in Q ? Q[G] : B[G]
      },
      set(B, G, Z) {
        return Gv1(!(G in Q)), B[G] = Z, !0
      }
    })
  }

  function pBB(A, Q) {
    if (Q === "basic") return mlA(A, {
      type: "basic",
      headersList: A.headersList
    });
    else if (Q === "cors") return mlA(A, {
      type: "cors",
      headersList: A.headersList
    });
    else if (Q === "opaque") return mlA(A, {
      type: "opaque",
      urlList: Object.freeze([]),
      status: 0,
      statusText: "",
      body: null
    });
    else if (Q === "opaqueredirect") return mlA(A, {
      type: "opaqueredirect",
      status: 0,
      statusText: "",
      headersList: [],
      body: null
    });
    else Gv1(!1)
  }

  function Fi8(A, Q = null) {
    return Gv1(tl8(A)), el8(A) ? clA(Object.assign(new DOMException("The operation was aborted.", "AbortError"), {
      cause: Q
    })) : clA(Object.assign(new DOMException("Request was cancelled."), {
      cause: Q
    }))
  }

  function uBB(A, Q, B) {
    if (Q.status !== null && (Q.status < 200 || Q.status > 599)) throw RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
    if ("statusText" in Q && Q.statusText != null) {
      if (!ol8(String(Q.statusText))) throw TypeError("Invalid statusText")
    }
    if ("status" in Q && Q.status != null) A[RJ].status = Q.status;
    if ("statusText" in Q && Q.statusText != null) A[RJ].statusText = Q.statusText;
    if ("headers" in Q && Q.headers != null) pl8(A[kb], Q.headers);
    if (B) {
      if (Yi8.includes(A.status)) throw p8.errors.exception({
        header: "Response constructor",
        message: `Invalid response status code ${A.status}`
      });
      if (A[RJ].body = B.body, B.type != null && !A[RJ].headersList.contains("content-type", !0)) A[RJ].headersList.append("content-type", B.type, !0)
    }
  }

  function JzA(A, Q) {
    let B = new yH(dlA);
    if (B[RJ] = A, B[kb] = new mBB(dlA), cBB(B[kb], A.headersList), dBB(B[kb], Q), al8 && A.body?.stream) sl8.register(B, new WeakRef(A.body.stream));
    return B
  }
  p8.converters.ReadableStream = p8.interfaceConverter(ReadableStream);
  p8.converters.FormData = p8.interfaceConverter(Ji8);
  p8.converters.URLSearchParams = p8.interfaceConverter(URLSearchParams);
  p8.converters.XMLHttpRequestBodyInit = function(A, Q, B) {
    if (typeof A === "string") return p8.converters.USVString(A, Q, B);
    if (Ai8(A)) return p8.converters.Blob(A, Q, B, {
      strict: !1
    });
    if (ArrayBuffer.isView(A) || Wi8.isArrayBuffer(A)) return p8.converters.BufferSource(A, Q, B);
    if (Bv1.isFormDataLike(A)) return p8.converters.FormData(A, Q, B, {
      strict: !1
    });
    if (A instanceof URLSearchParams) return p8.converters.URLSearchParams(A, Q, B);
    return p8.converters.DOMString(A, Q, B)
  };
  p8.converters.BodyInit = function(A, Q, B) {
    if (A instanceof ReadableStream) return p8.converters.ReadableStream(A, Q, B);
    if (A?.[Symbol.asyncIterator]) return A;
    return p8.converters.XMLHttpRequestBodyInit(A, Q, B)
  };
  p8.converters.ResponseInit = p8.dictionaryConverter([{
    key: "status",
    converter: p8.converters["unsigned short"],
    defaultValue: () => 200
  }, {
    key: "statusText",
    converter: p8.converters.ByteString,
    defaultValue: () => ""
  }, {
    key: "headers",
    converter: p8.converters.HeadersInit
  }]);
  lBB.exports = {
    isNetworkError: Vi8,
    makeNetworkError: clA,
    makeResponse: q3A,
    makeAppropriateNetworkError: Fi8,
    filterResponse: pBB,
    Response: yH,
    cloneResponse: Zv1,
    fromInnerResponse: JzA
  }
})
// @from(Start 4968614, End 4969406)
oBB = z((Q_7, rBB) => {
  var {
    kConnected: iBB,
    kSize: nBB
  } = tI();
  class aBB {
    constructor(A) {
      this.value = A
    }
    deref() {
      return this.value[iBB] === 0 && this.value[nBB] === 0 ? void 0 : this.value
    }
  }
  class sBB {
    constructor(A) {
      this.finalizer = A
    }
    register(A, Q) {
      if (A.on) A.on("disconnect", () => {
        if (A[iBB] === 0 && A[nBB] === 0) this.finalizer(Q)
      })
    }
    unregister(A) {}
  }
  rBB.exports = function() {
    if (process.env.NODE_V8_COVERAGE && process.version.startsWith("v18")) return process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
      WeakRef: aBB,
      FinalizationRegistry: sBB
    };
    return {
      WeakRef,
      FinalizationRegistry
    }
  }
})