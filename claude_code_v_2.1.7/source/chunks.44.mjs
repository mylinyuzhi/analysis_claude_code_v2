
// @from(Ln 113372, Col 4)
Kc1 = U((EXG, TnQ) => {
  var {
    kProxy: WE3,
    kClose: KE3,
    kDestroy: VE3,
    kInterceptors: FE3
  } = VX(), {
    URL: dLA
  } = NA("node:url"), HE3 = UJA(), EE3 = CJA(), zE3 = BJA(), {
    InvalidArgumentError: stA,
    RequestAbortedError: $E3,
    SecureProxyConnectionError: CE3
  } = GG(), MnQ = ULA(), otA = Symbol("proxy agent"), rtA = Symbol("proxy client"), cLA = Symbol("proxy headers"), Wc1 = Symbol("request tls settings"), RnQ = Symbol("proxy tls settings"), _nQ = Symbol("connect endpoint function");

  function UE3(A) {
    return A === "https:" ? 443 : 80
  }

  function qE3(A, Q) {
    return new EE3(A, Q)
  }
  var NE3 = () => {};
  class jnQ extends zE3 {
    constructor(A) {
      super();
      if (!A || typeof A === "object" && !(A instanceof dLA) && !A.uri) throw new stA("Proxy uri is mandatory");
      let {
        clientFactory: Q = qE3
      } = A;
      if (typeof Q !== "function") throw new stA("Proxy opts.clientFactory must be a function.");
      let B = this.#A(A),
        {
          href: G,
          origin: Z,
          port: Y,
          protocol: J,
          username: X,
          password: I,
          hostname: D
        } = B;
      if (this[WE3] = {
          uri: G,
          protocol: J
        }, this[FE3] = A.interceptors?.ProxyAgent && Array.isArray(A.interceptors.ProxyAgent) ? A.interceptors.ProxyAgent : [], this[Wc1] = A.requestTls, this[RnQ] = A.proxyTls, this[cLA] = A.headers || {}, A.auth && A.token) throw new stA("opts.auth cannot be used in combination with opts.token");
      else if (A.auth) this[cLA]["proxy-authorization"] = `Basic ${A.auth}`;
      else if (A.token) this[cLA]["proxy-authorization"] = A.token;
      else if (X && I) this[cLA]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(X)}:${decodeURIComponent(I)}`).toString("base64")}`;
      let W = MnQ({
        ...A.proxyTls
      });
      this[_nQ] = MnQ({
        ...A.requestTls
      }), this[rtA] = Q(B, {
        connect: W
      }), this[otA] = new HE3({
        ...A,
        connect: async (K, V) => {
          let F = K.host;
          if (!K.port) F += `:${UE3(K.protocol)}`;
          try {
            let {
              socket: H,
              statusCode: E
            } = await this[rtA].connect({
              origin: Z,
              port: Y,
              path: F,
              signal: K.signal,
              headers: {
                ...this[cLA],
                host: K.host
              },
              servername: this[RnQ]?.servername || D
            });
            if (E !== 200) H.on("error", NE3).destroy(), V(new $E3(`Proxy response (${E}) !== 200 when HTTP Tunneling`));
            if (K.protocol !== "https:") {
              V(null, H);
              return
            }
            let z;
            if (this[Wc1]) z = this[Wc1].servername;
            else z = K.servername;
            this[_nQ]({
              ...K,
              servername: z,
              httpSocket: H
            }, V)
          } catch (H) {
            if (H.code === "ERR_TLS_CERT_ALTNAME_INVALID") V(new CE3(H));
            else V(H)
          }
        }
      })
    }
    dispatch(A, Q) {
      let B = wE3(A.headers);
      if (LE3(B), B && !("host" in B) && !("Host" in B)) {
        let {
          host: G
        } = new dLA(A.origin);
        B.host = G
      }
      return this[otA].dispatch({
        ...A,
        headers: B
      }, Q)
    }
    #A(A) {
      if (typeof A === "string") return new dLA(A);
      else if (A instanceof dLA) return A;
      else return new dLA(A.uri)
    }
    async [KE3]() {
      await this[otA].close(), await this[rtA].close()
    }
    async [VE3]() {
      await this[otA].destroy(), await this[rtA].destroy()
    }
  }

  function wE3(A) {
    if (Array.isArray(A)) {
      let Q = {};
      for (let B = 0; B < A.length; B += 2) Q[A[B]] = A[B + 1];
      return Q
    }
    return A
  }

  function LE3(A) {
    if (A && Object.keys(A).find((B) => B.toLowerCase() === "proxy-authorization")) throw new stA("Proxy-Authorization should be sent in ProxyAgent constructor")
  }
  TnQ.exports = jnQ
})
// @from(Ln 113506, Col 4)
bnQ = U((zXG, knQ) => {
  var OE3 = BJA(),
    {
      kClose: ME3,
      kDestroy: RE3,
      kClosed: PnQ,
      kDestroyed: SnQ,
      kDispatch: _E3,
      kNoProxyAgent: pLA,
      kHttpProxyAgent: _n,
      kHttpsProxyAgent: t0A
    } = VX(),
    xnQ = Kc1(),
    jE3 = UJA(),
    TE3 = {
      "http:": 80,
      "https:": 443
    },
    ynQ = !1;
  class vnQ extends OE3 {
    #A = null;
    #Q = null;
    #B = null;
    constructor(A = {}) {
      super();
      if (this.#B = A, !ynQ) ynQ = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
        code: "UNDICI-EHPA"
      });
      let {
        httpProxy: Q,
        httpsProxy: B,
        noProxy: G,
        ...Z
      } = A;
      this[pLA] = new jE3(Z);
      let Y = Q ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
      if (Y) this[_n] = new xnQ({
        ...Z,
        uri: Y
      });
      else this[_n] = this[pLA];
      let J = B ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
      if (J) this[t0A] = new xnQ({
        ...Z,
        uri: J
      });
      else this[t0A] = this[_n];
      this.#X()
    } [_E3](A, Q) {
      let B = new URL(A.origin);
      return this.#Z(B).dispatch(A, Q)
    }
    async [ME3]() {
      if (await this[pLA].close(), !this[_n][PnQ]) await this[_n].close();
      if (!this[t0A][PnQ]) await this[t0A].close()
    }
    async [RE3](A) {
      if (await this[pLA].destroy(A), !this[_n][SnQ]) await this[_n].destroy(A);
      if (!this[t0A][SnQ]) await this[t0A].destroy(A)
    }
    #Z(A) {
      let {
        protocol: Q,
        host: B,
        port: G
      } = A;
      if (B = B.replace(/:\d*$/, "").toLowerCase(), G = Number.parseInt(G, 10) || TE3[Q] || 0, !this.#G(B, G)) return this[pLA];
      if (Q === "https:") return this[t0A];
      return this[_n]
    }
    #G(A, Q) {
      if (this.#Y) this.#X();
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
    #X() {
      let A = this.#B.noProxy ?? this.#W,
        Q = A.split(/[,\s]/),
        B = [];
      for (let G = 0; G < Q.length; G++) {
        let Z = Q[G];
        if (!Z) continue;
        let Y = Z.match(/^(.+):(\d+)$/);
        B.push({
          hostname: (Y ? Y[1] : Z).toLowerCase(),
          port: Y ? Number.parseInt(Y[2], 10) : 0
        })
      }
      this.#A = A, this.#Q = B
    }
    get #Y() {
      if (this.#B.noProxy !== void 0) return !1;
      return this.#A !== this.#W
    }
    get #W() {
      return process.env.no_proxy ?? process.env.NO_PROXY ?? ""
    }
  }
  knQ.exports = vnQ
})
// @from(Ln 113614, Col 4)
ttA = U(($XG, unQ) => {
  var qJA = NA("node:assert"),
    {
      kRetryHandlerDefaultRetry: fnQ
    } = VX(),
    {
      RequestRetryError: lLA
    } = GG(),
    {
      isDisturbed: hnQ,
      parseHeaders: PE3,
      parseRangeHeader: gnQ,
      wrapRequestBody: SE3
    } = b8();

  function xE3(A) {
    let Q = Date.now();
    return new Date(A).getTime() - Q
  }
  class Vc1 {
    constructor(A, Q) {
      let {
        retryOptions: B,
        ...G
      } = A, {
        retry: Z,
        maxRetries: Y,
        maxTimeout: J,
        minTimeout: X,
        timeoutFactor: I,
        methods: D,
        errorCodes: W,
        retryAfter: K,
        statusCodes: V
      } = B ?? {};
      this.dispatch = Q.dispatch, this.handler = Q.handler, this.opts = {
        ...G,
        body: SE3(A.body)
      }, this.abort = null, this.aborted = !1, this.retryOpts = {
        retry: Z ?? Vc1[fnQ],
        retryAfter: K ?? !0,
        maxTimeout: J ?? 30000,
        minTimeout: X ?? 500,
        timeoutFactor: I ?? 2,
        maxRetries: Y ?? 5,
        methods: D ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
        statusCodes: V ?? [500, 502, 503, 504, 429],
        errorCodes: W ?? ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "ENETDOWN", "ENETUNREACH", "EHOSTDOWN", "EHOSTUNREACH", "EPIPE", "UND_ERR_SOCKET"]
      }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((F) => {
        if (this.aborted = !0, this.abort) this.abort(F);
        else this.reason = F
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
    static[fnQ](A, {
      state: Q,
      opts: B
    }, G) {
      let {
        statusCode: Z,
        code: Y,
        headers: J
      } = A, {
        method: X,
        retryOptions: I
      } = B, {
        maxRetries: D,
        minTimeout: W,
        maxTimeout: K,
        timeoutFactor: V,
        statusCodes: F,
        errorCodes: H,
        methods: E
      } = I, {
        counter: z
      } = Q;
      if (Y && Y !== "UND_ERR_REQ_RETRY" && !H.includes(Y)) {
        G(A);
        return
      }
      if (Array.isArray(E) && !E.includes(X)) {
        G(A);
        return
      }
      if (Z != null && Array.isArray(F) && !F.includes(Z)) {
        G(A);
        return
      }
      if (z > D) {
        G(A);
        return
      }
      let $ = J?.["retry-after"];
      if ($) $ = Number($), $ = Number.isNaN($) ? xE3($) : $ * 1000;
      let O = $ > 0 ? Math.min($, K) : Math.min(W * V ** (z - 1), K);
      setTimeout(() => G(null), O)
    }
    onHeaders(A, Q, B, G) {
      let Z = PE3(Q);
      if (this.retryCount += 1, A >= 300)
        if (this.retryOpts.statusCodes.includes(A) === !1) return this.handler.onHeaders(A, Q, B, G);
        else return this.abort(new lLA("Request failed", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
      if (this.resume != null) {
        if (this.resume = null, A !== 206 && (this.start > 0 || A !== 200)) return this.abort(new lLA("server does not support the range header and the payload was partially consumed", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        let J = gnQ(Z["content-range"]);
        if (!J) return this.abort(new lLA("Content-Range mismatch", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        if (this.etag != null && this.etag !== Z.etag) return this.abort(new lLA("ETag mismatch", A, {
          headers: Z,
          data: {
            count: this.retryCount
          }
        })), !1;
        let {
          start: X,
          size: I,
          end: D = I - 1
        } = J;
        return qJA(this.start === X, "content-range mismatch"), qJA(this.end == null || this.end === D, "content-range mismatch"), this.resume = B, !0
      }
      if (this.end == null) {
        if (A === 206) {
          let J = gnQ(Z["content-range"]);
          if (J == null) return this.handler.onHeaders(A, Q, B, G);
          let {
            start: X,
            size: I,
            end: D = I - 1
          } = J;
          qJA(X != null && Number.isFinite(X), "content-range mismatch"), qJA(D != null && Number.isFinite(D), "invalid content-length"), this.start = X, this.end = D
        }
        if (this.end == null) {
          let J = Z["content-length"];
          this.end = J != null ? Number(J) - 1 : null
        }
        if (qJA(Number.isFinite(this.start)), qJA(this.end == null || Number.isFinite(this.end), "invalid content-length"), this.resume = B, this.etag = Z.etag != null ? Z.etag : null, this.etag != null && this.etag.startsWith("W/")) this.etag = null;
        return this.handler.onHeaders(A, Q, B, G)
      }
      let Y = new lLA("Request failed", A, {
        headers: Z,
        data: {
          count: this.retryCount
        }
      });
      return this.abort(Y), !1
    }
    onData(A) {
      return this.start += A.length, this.handler.onData(A)
    }
    onComplete(A) {
      return this.retryCount = 0, this.handler.onComplete(A)
    }
    onError(A) {
      if (this.aborted || hnQ(this.opts.body)) return this.handler.onError(A);
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
        if (B != null || this.aborted || hnQ(this.opts.body)) return this.handler.onError(B);
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
  unQ.exports = Vc1
})
// @from(Ln 113831, Col 4)
cnQ = U((CXG, dnQ) => {
  var yE3 = $LA(),
    vE3 = ttA();
  class mnQ extends yE3 {
    #A = null;
    #Q = null;
    constructor(A, Q = {}) {
      super(Q);
      this.#A = A, this.#Q = Q
    }
    dispatch(A, Q) {
      let B = new vE3({
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
  dnQ.exports = mnQ
})
// @from(Ln 113860, Col 4)
$c1 = U((UXG, enQ) => {
  var anQ = NA("node:assert"),
    {
      Readable: kE3
    } = NA("node:stream"),
    {
      RequestAbortedError: onQ,
      NotSupportedError: bE3,
      InvalidArgumentError: fE3,
      AbortError: Fc1
    } = GG(),
    rnQ = b8(),
    {
      ReadableStreamFrom: hE3
    } = b8(),
    $L = Symbol("kConsume"),
    iLA = Symbol("kReading"),
    jn = Symbol("kBody"),
    pnQ = Symbol("kAbort"),
    snQ = Symbol("kContentType"),
    lnQ = Symbol("kContentLength"),
    gE3 = () => {};
  class tnQ extends kE3 {
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
      this._readableState.dataEmitted = !1, this[pnQ] = Q, this[$L] = null, this[jn] = null, this[snQ] = B, this[lnQ] = G, this[iLA] = !1
    }
    destroy(A) {
      if (!A && !this._readableState.endEmitted) A = new onQ;
      if (A) this[pnQ]();
      return super.destroy(A)
    }
    _destroy(A, Q) {
      if (!this[iLA]) setImmediate(() => {
        Q(A)
      });
      else Q(A)
    }
    on(A, ...Q) {
      if (A === "data" || A === "readable") this[iLA] = !0;
      return super.on(A, ...Q)
    }
    addListener(A, ...Q) {
      return this.on(A, ...Q)
    }
    off(A, ...Q) {
      let B = super.off(A, ...Q);
      if (A === "data" || A === "readable") this[iLA] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
      return B
    }
    removeListener(A, ...Q) {
      return this.off(A, ...Q)
    }
    push(A) {
      if (this[$L] && A !== null) return Ec1(this[$L], A), this[iLA] ? super.push(A) : !0;
      return super.push(A)
    }
    async text() {
      return nLA(this, "text")
    }
    async json() {
      return nLA(this, "json")
    }
    async blob() {
      return nLA(this, "blob")
    }
    async bytes() {
      return nLA(this, "bytes")
    }
    async arrayBuffer() {
      return nLA(this, "arrayBuffer")
    }
    async formData() {
      throw new bE3
    }
    get bodyUsed() {
      return rnQ.isDisturbed(this)
    }
    get body() {
      if (!this[jn]) {
        if (this[jn] = hE3(this), this[$L]) this[jn].getReader(), anQ(this[jn].locked)
      }
      return this[jn]
    }
    async dump(A) {
      let Q = Number.isFinite(A?.limit) ? A.limit : 131072,
        B = A?.signal;
      if (B != null && (typeof B !== "object" || !("aborted" in B))) throw new fE3("signal must be an AbortSignal");
      if (B?.throwIfAborted(), this._readableState.closeEmitted) return null;
      return await new Promise((G, Z) => {
        if (this[lnQ] > Q) this.destroy(new Fc1);
        let Y = () => {
          this.destroy(B.reason ?? new Fc1)
        };
        B?.addEventListener("abort", Y), this.on("close", function () {
          if (B?.removeEventListener("abort", Y), B?.aborted) Z(B.reason ?? new Fc1);
          else G(null)
        }).on("error", gE3).on("data", function (J) {
          if (Q -= J.length, Q <= 0) this.destroy()
        }).resume()
      })
    }
  }

  function uE3(A) {
    return A[jn] && A[jn].locked === !0 || A[$L]
  }

  function mE3(A) {
    return rnQ.isDisturbed(A) || uE3(A)
  }
  async function nLA(A, Q) {
    return anQ(!A[$L]), new Promise((B, G) => {
      if (mE3(A)) {
        let Z = A._readableState;
        if (Z.destroyed && Z.closeEmitted === !1) A.on("error", (Y) => {
          G(Y)
        }).on("close", () => {
          G(TypeError("unusable"))
        });
        else G(Z.errored ?? TypeError("unusable"))
      } else queueMicrotask(() => {
        A[$L] = {
          type: Q,
          stream: A,
          resolve: B,
          reject: G,
          length: 0,
          body: []
        }, A.on("error", function (Z) {
          zc1(this[$L], Z)
        }).on("close", function () {
          if (this[$L].body !== null) zc1(this[$L], new onQ)
        }), dE3(A[$L])
      })
    })
  }

  function dE3(A) {
    if (A.body === null) return;
    let {
      _readableState: Q
    } = A.stream;
    if (Q.bufferIndex) {
      let B = Q.bufferIndex,
        G = Q.buffer.length;
      for (let Z = B; Z < G; Z++) Ec1(A, Q.buffer[Z])
    } else
      for (let B of Q.buffer) Ec1(A, B);
    if (Q.endEmitted) nnQ(this[$L]);
    else A.stream.on("end", function () {
      nnQ(this[$L])
    });
    A.stream.resume();
    while (A.stream.read() != null);
  }

  function Hc1(A, Q) {
    if (A.length === 0 || Q === 0) return "";
    let B = A.length === 1 ? A[0] : Buffer.concat(A, Q),
      G = B.length,
      Z = G > 2 && B[0] === 239 && B[1] === 187 && B[2] === 191 ? 3 : 0;
    return B.utf8Slice(Z, G)
  }

  function inQ(A, Q) {
    if (A.length === 0 || Q === 0) return new Uint8Array(0);
    if (A.length === 1) return new Uint8Array(A[0]);
    let B = new Uint8Array(Buffer.allocUnsafeSlow(Q).buffer),
      G = 0;
    for (let Z = 0; Z < A.length; ++Z) {
      let Y = A[Z];
      B.set(Y, G), G += Y.length
    }
    return B
  }

  function nnQ(A) {
    let {
      type: Q,
      body: B,
      resolve: G,
      stream: Z,
      length: Y
    } = A;
    try {
      if (Q === "text") G(Hc1(B, Y));
      else if (Q === "json") G(JSON.parse(Hc1(B, Y)));
      else if (Q === "arrayBuffer") G(inQ(B, Y).buffer);
      else if (Q === "blob") G(new Blob(B, {
        type: Z[snQ]
      }));
      else if (Q === "bytes") G(inQ(B, Y));
      zc1(A)
    } catch (J) {
      Z.destroy(J)
    }
  }

  function Ec1(A, Q) {
    A.length += Q.length, A.body.push(Q)
  }

  function zc1(A, Q) {
    if (A.body === null) return;
    if (Q) A.reject(Q);
    else A.resolve();
    A.type = null, A.stream = null, A.resolve = null, A.reject = null, A.length = 0, A.body = null
  }
  enQ.exports = {
    Readable: tnQ,
    chunksDecode: Hc1
  }
})
// @from(Ln 114084, Col 4)
Cc1 = U((qXG, ZaQ) => {
  var cE3 = NA("node:assert"),
    {
      ResponseStatusCodeError: AaQ
    } = GG(),
    {
      chunksDecode: QaQ
    } = $c1();
  async function pE3({
    callback: A,
    body: Q,
    contentType: B,
    statusCode: G,
    statusMessage: Z,
    headers: Y
  }) {
    cE3(Q);
    let J = [],
      X = 0;
    try {
      for await (let K of Q) if (J.push(K), X += K.length, X > 131072) {
        J = [], X = 0;
        break
      }
    } catch {
      J = [], X = 0
    }
    let I = `Response status code ${G}${Z?`: ${Z}`:""}`;
    if (G === 204 || !B || !X) {
      queueMicrotask(() => A(new AaQ(I, G, Y)));
      return
    }
    let D = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    let W;
    try {
      if (BaQ(B)) W = JSON.parse(QaQ(J, X));
      else if (GaQ(B)) W = QaQ(J, X)
    } catch {} finally {
      Error.stackTraceLimit = D
    }
    queueMicrotask(() => A(new AaQ(I, G, Y, W)))
  }
  var BaQ = (A) => {
      return A.length > 15 && A[11] === "/" && A[0] === "a" && A[1] === "p" && A[2] === "p" && A[3] === "l" && A[4] === "i" && A[5] === "c" && A[6] === "a" && A[7] === "t" && A[8] === "i" && A[9] === "o" && A[10] === "n" && A[12] === "j" && A[13] === "s" && A[14] === "o" && A[15] === "n"
    },
    GaQ = (A) => {
      return A.length > 4 && A[4] === "/" && A[0] === "t" && A[1] === "e" && A[2] === "x" && A[3] === "t"
    };
  ZaQ.exports = {
    getResolveErrorBodyCallback: pE3,
    isContentTypeApplicationJson: BaQ,
    isContentTypeText: GaQ
  }
})
// @from(Ln 114139, Col 4)
XaQ = U((NXG, qc1) => {
  var lE3 = NA("node:assert"),
    {
      Readable: iE3
    } = $c1(),
    {
      InvalidArgumentError: NJA,
      RequestAbortedError: YaQ
    } = GG(),
    CL = b8(),
    {
      getResolveErrorBodyCallback: nE3
    } = Cc1(),
    {
      AsyncResource: aE3
    } = NA("node:async_hooks");
  class Uc1 extends aE3 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new NJA("invalid opts");
      let {
        signal: B,
        method: G,
        opaque: Z,
        body: Y,
        onInfo: J,
        responseHeaders: X,
        throwOnError: I,
        highWaterMark: D
      } = A;
      try {
        if (typeof Q !== "function") throw new NJA("invalid callback");
        if (D && (typeof D !== "number" || D < 0)) throw new NJA("invalid highWaterMark");
        if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new NJA("signal must be an EventEmitter or EventTarget");
        if (G === "CONNECT") throw new NJA("invalid method");
        if (J && typeof J !== "function") throw new NJA("invalid onInfo callback");
        super("UNDICI_REQUEST")
      } catch (W) {
        if (CL.isStream(Y)) CL.destroy(Y.on("error", CL.nop), W);
        throw W
      }
      if (this.method = G, this.responseHeaders = X || null, this.opaque = Z || null, this.callback = Q, this.res = null, this.abort = null, this.body = Y, this.trailers = {}, this.context = null, this.onInfo = J || null, this.throwOnError = I, this.highWaterMark = D, this.signal = B, this.reason = null, this.removeAbortListener = null, CL.isStream(Y)) Y.on("error", (W) => {
        this.onError(W)
      });
      if (this.signal)
        if (this.signal.aborted) this.reason = this.signal.reason ?? new YaQ;
        else this.removeAbortListener = CL.addAbortListener(this.signal, () => {
          if (this.reason = this.signal.reason ?? new YaQ, this.res) CL.destroy(this.res.on("error", CL.nop), this.reason);
          else if (this.abort) this.abort(this.reason);
          if (this.removeAbortListener) this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
        })
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      lE3(this.callback), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B, G) {
      let {
        callback: Z,
        opaque: Y,
        abort: J,
        context: X,
        responseHeaders: I,
        highWaterMark: D
      } = this, W = I === "raw" ? CL.parseRawHeaders(Q) : CL.parseHeaders(Q);
      if (A < 200) {
        if (this.onInfo) this.onInfo({
          statusCode: A,
          headers: W
        });
        return
      }
      let K = I === "raw" ? CL.parseHeaders(Q) : W,
        V = K["content-type"],
        F = K["content-length"],
        H = new iE3({
          resume: B,
          abort: J,
          contentType: V,
          contentLength: this.method !== "HEAD" && F ? Number(F) : null,
          highWaterMark: D
        });
      if (this.removeAbortListener) H.on("close", this.removeAbortListener);
      if (this.callback = null, this.res = H, Z !== null)
        if (this.throwOnError && A >= 400) this.runInAsyncScope(nE3, null, {
          callback: Z,
          body: H,
          contentType: V,
          statusCode: A,
          statusMessage: G,
          headers: W
        });
        else this.runInAsyncScope(Z, null, null, {
          statusCode: A,
          headers: W,
          trailers: this.trailers,
          opaque: Y,
          body: H,
          context: X
        })
    }
    onData(A) {
      return this.res.push(A)
    }
    onComplete(A) {
      CL.parseHeaders(A, this.trailers), this.res.push(null)
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
        CL.destroy(Q, A)
      });
      if (G) this.body = null, CL.destroy(G, A);
      if (this.removeAbortListener) Q?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
    }
  }

  function JaQ(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      JaQ.call(this, A, (Z, Y) => {
        return Z ? G(Z) : B(Y)
      })
    });
    try {
      this.dispatch(A, new Uc1(A, Q))
    } catch (B) {
      if (typeof Q !== "function") throw B;
      let G = A?.opaque;
      queueMicrotask(() => Q(B, {
        opaque: G
      }))
    }
  }
  qc1.exports = JaQ;
  qc1.exports.RequestHandler = Uc1
})
// @from(Ln 114287, Col 4)
aLA = U((wXG, WaQ) => {
  var {
    addAbortListener: oE3
  } = b8(), {
    RequestAbortedError: rE3
  } = GG(), wJA = Symbol("kListener"), av = Symbol("kSignal");

  function IaQ(A) {
    if (A.abort) A.abort(A[av]?.reason);
    else A.reason = A[av]?.reason ?? new rE3;
    DaQ(A)
  }

  function sE3(A, Q) {
    if (A.reason = null, A[av] = null, A[wJA] = null, !Q) return;
    if (Q.aborted) {
      IaQ(A);
      return
    }
    A[av] = Q, A[wJA] = () => {
      IaQ(A)
    }, oE3(A[av], A[wJA])
  }

  function DaQ(A) {
    if (!A[av]) return;
    if ("removeEventListener" in A[av]) A[av].removeEventListener("abort", A[wJA]);
    else A[av].removeListener("abort", A[wJA]);
    A[av] = null, A[wJA] = null
  }
  WaQ.exports = {
    addSignal: sE3,
    removeSignal: DaQ
  }
})
// @from(Ln 114322, Col 4)
EaQ = U((LXG, HaQ) => {
  var tE3 = NA("node:assert"),
    {
      finished: eE3,
      PassThrough: Az3
    } = NA("node:stream"),
    {
      InvalidArgumentError: LJA,
      InvalidReturnValueError: Qz3
    } = GG(),
    rT = b8(),
    {
      getResolveErrorBodyCallback: Bz3
    } = Cc1(),
    {
      AsyncResource: Gz3
    } = NA("node:async_hooks"),
    {
      addSignal: Zz3,
      removeSignal: KaQ
    } = aLA();
  class VaQ extends Gz3 {
    constructor(A, Q, B) {
      if (!A || typeof A !== "object") throw new LJA("invalid opts");
      let {
        signal: G,
        method: Z,
        opaque: Y,
        body: J,
        onInfo: X,
        responseHeaders: I,
        throwOnError: D
      } = A;
      try {
        if (typeof B !== "function") throw new LJA("invalid callback");
        if (typeof Q !== "function") throw new LJA("invalid factory");
        if (G && typeof G.on !== "function" && typeof G.addEventListener !== "function") throw new LJA("signal must be an EventEmitter or EventTarget");
        if (Z === "CONNECT") throw new LJA("invalid method");
        if (X && typeof X !== "function") throw new LJA("invalid onInfo callback");
        super("UNDICI_STREAM")
      } catch (W) {
        if (rT.isStream(J)) rT.destroy(J.on("error", rT.nop), W);
        throw W
      }
      if (this.responseHeaders = I || null, this.opaque = Y || null, this.factory = Q, this.callback = B, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = J, this.onInfo = X || null, this.throwOnError = D || !1, rT.isStream(J)) J.on("error", (W) => {
        this.onError(W)
      });
      Zz3(this, G)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      tE3(this.callback), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B, G) {
      let {
        factory: Z,
        opaque: Y,
        context: J,
        callback: X,
        responseHeaders: I
      } = this, D = I === "raw" ? rT.parseRawHeaders(Q) : rT.parseHeaders(Q);
      if (A < 200) {
        if (this.onInfo) this.onInfo({
          statusCode: A,
          headers: D
        });
        return
      }
      this.factory = null;
      let W;
      if (this.throwOnError && A >= 400) {
        let F = (I === "raw" ? rT.parseHeaders(Q) : D)["content-type"];
        W = new Az3, this.callback = null, this.runInAsyncScope(Bz3, null, {
          callback: X,
          body: W,
          contentType: F,
          statusCode: A,
          statusMessage: G,
          headers: D
        })
      } else {
        if (Z === null) return;
        if (W = this.runInAsyncScope(Z, null, {
            statusCode: A,
            headers: D,
            opaque: Y,
            context: J
          }), !W || typeof W.write !== "function" || typeof W.end !== "function" || typeof W.on !== "function") throw new Qz3("expected Writable");
        eE3(W, {
          readable: !1
        }, (V) => {
          let {
            callback: F,
            res: H,
            opaque: E,
            trailers: z,
            abort: $
          } = this;
          if (this.res = null, V || !H.readable) rT.destroy(H, V);
          if (this.callback = null, this.runInAsyncScope(F, null, V || null, {
              opaque: E,
              trailers: z
            }), V) $()
        })
      }
      return W.on("drain", B), this.res = W, (W.writableNeedDrain !== void 0 ? W.writableNeedDrain : W._writableState?.needDrain) !== !0
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
      if (KaQ(this), !Q) return;
      this.trailers = rT.parseHeaders(A), Q.end()
    }
    onError(A) {
      let {
        res: Q,
        callback: B,
        opaque: G,
        body: Z
      } = this;
      if (KaQ(this), this.factory = null, Q) this.res = null, rT.destroy(Q, A);
      else if (B) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(B, null, A, {
          opaque: G
        })
      });
      if (Z) this.body = null, rT.destroy(Z, A)
    }
  }

  function FaQ(A, Q, B) {
    if (B === void 0) return new Promise((G, Z) => {
      FaQ.call(this, A, Q, (Y, J) => {
        return Y ? Z(Y) : G(J)
      })
    });
    try {
      this.dispatch(A, new VaQ(A, Q, B))
    } catch (G) {
      if (typeof B !== "function") throw G;
      let Z = A?.opaque;
      queueMicrotask(() => B(G, {
        opaque: Z
      }))
    }
  }
  HaQ.exports = FaQ
})
// @from(Ln 114480, Col 4)
waQ = U((OXG, NaQ) => {
  var {
    Readable: $aQ,
    Duplex: Yz3,
    PassThrough: Jz3
  } = NA("node:stream"), {
    InvalidArgumentError: oLA,
    InvalidReturnValueError: Xz3,
    RequestAbortedError: Nc1
  } = GG(), qR = b8(), {
    AsyncResource: Iz3
  } = NA("node:async_hooks"), {
    addSignal: Dz3,
    removeSignal: Wz3
  } = aLA(), zaQ = NA("node:assert"), OJA = Symbol("resume");
  class CaQ extends $aQ {
    constructor() {
      super({
        autoDestroy: !0
      });
      this[OJA] = null
    }
    _read() {
      let {
        [OJA]: A
      } = this;
      if (A) this[OJA] = null, A()
    }
    _destroy(A, Q) {
      this._read(), Q(A)
    }
  }
  class UaQ extends $aQ {
    constructor(A) {
      super({
        autoDestroy: !0
      });
      this[OJA] = A
    }
    _read() {
      this[OJA]()
    }
    _destroy(A, Q) {
      if (!A && !this._readableState.endEmitted) A = new Nc1;
      Q(A)
    }
  }
  class qaQ extends Iz3 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new oLA("invalid opts");
      if (typeof Q !== "function") throw new oLA("invalid handler");
      let {
        signal: B,
        method: G,
        opaque: Z,
        onInfo: Y,
        responseHeaders: J
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new oLA("signal must be an EventEmitter or EventTarget");
      if (G === "CONNECT") throw new oLA("invalid method");
      if (Y && typeof Y !== "function") throw new oLA("invalid onInfo callback");
      super("UNDICI_PIPELINE");
      this.opaque = Z || null, this.responseHeaders = J || null, this.handler = Q, this.abort = null, this.context = null, this.onInfo = Y || null, this.req = new CaQ().on("error", qR.nop), this.ret = new Yz3({
        readableObjectMode: A.objectMode,
        autoDestroy: !0,
        read: () => {
          let {
            body: X
          } = this;
          if (X?.resume) X.resume()
        },
        write: (X, I, D) => {
          let {
            req: W
          } = this;
          if (W.push(X, I) || W._readableState.destroyed) D();
          else W[OJA] = D
        },
        destroy: (X, I) => {
          let {
            body: D,
            req: W,
            res: K,
            ret: V,
            abort: F
          } = this;
          if (!X && !V._readableState.endEmitted) X = new Nc1;
          if (F && X) F();
          qR.destroy(D, X), qR.destroy(W, X), qR.destroy(K, X), Wz3(this), I(X)
        }
      }).on("prefinish", () => {
        let {
          req: X
        } = this;
        X.push(null)
      }), this.res = null, Dz3(this, B)
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
      zaQ(!G, "pipeline cannot be retried"), zaQ(!B.destroyed), this.abort = A, this.context = Q
    }
    onHeaders(A, Q, B) {
      let {
        opaque: G,
        handler: Z,
        context: Y
      } = this;
      if (A < 200) {
        if (this.onInfo) {
          let X = this.responseHeaders === "raw" ? qR.parseRawHeaders(Q) : qR.parseHeaders(Q);
          this.onInfo({
            statusCode: A,
            headers: X
          })
        }
        return
      }
      this.res = new UaQ(B);
      let J;
      try {
        this.handler = null;
        let X = this.responseHeaders === "raw" ? qR.parseRawHeaders(Q) : qR.parseHeaders(Q);
        J = this.runInAsyncScope(Z, null, {
          statusCode: A,
          headers: X,
          opaque: G,
          body: this.res,
          context: Y
        })
      } catch (X) {
        throw this.res.on("error", qR.nop), X
      }
      if (!J || typeof J.on !== "function") throw new Xz3("expected Readable");
      J.on("data", (X) => {
        let {
          ret: I,
          body: D
        } = this;
        if (!I.push(X) && D.pause) D.pause()
      }).on("error", (X) => {
        let {
          ret: I
        } = this;
        qR.destroy(I, X)
      }).on("end", () => {
        let {
          ret: X
        } = this;
        X.push(null)
      }).on("close", () => {
        let {
          ret: X
        } = this;
        if (!X._readableState.ended) qR.destroy(X, new Nc1)
      }), this.body = J
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
      this.handler = null, qR.destroy(Q, A)
    }
  }

  function Kz3(A, Q) {
    try {
      let B = new qaQ(A, Q);
      return this.dispatch({
        ...A,
        body: B.req
      }, B), B.ret
    } catch (B) {
      return new Jz3().destroy(B)
    }
  }
  NaQ.exports = Kz3
})
// @from(Ln 114676, Col 4)
TaQ = U((MXG, jaQ) => {
  var {
    InvalidArgumentError: wc1,
    SocketError: Vz3
  } = GG(), {
    AsyncResource: Fz3
  } = NA("node:async_hooks"), LaQ = b8(), {
    addSignal: Hz3,
    removeSignal: OaQ
  } = aLA(), MaQ = NA("node:assert");
  class RaQ extends Fz3 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new wc1("invalid opts");
      if (typeof Q !== "function") throw new wc1("invalid callback");
      let {
        signal: B,
        opaque: G,
        responseHeaders: Z
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new wc1("signal must be an EventEmitter or EventTarget");
      super("UNDICI_UPGRADE");
      this.responseHeaders = Z || null, this.opaque = G || null, this.callback = Q, this.abort = null, this.context = null, Hz3(this, B)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      MaQ(this.callback), this.abort = A, this.context = null
    }
    onHeaders() {
      throw new Vz3("bad upgrade", null)
    }
    onUpgrade(A, Q, B) {
      MaQ(A === 101);
      let {
        callback: G,
        opaque: Z,
        context: Y
      } = this;
      OaQ(this), this.callback = null;
      let J = this.responseHeaders === "raw" ? LaQ.parseRawHeaders(Q) : LaQ.parseHeaders(Q);
      this.runInAsyncScope(G, null, null, {
        headers: J,
        socket: B,
        opaque: Z,
        context: Y
      })
    }
    onError(A) {
      let {
        callback: Q,
        opaque: B
      } = this;
      if (OaQ(this), Q) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, A, {
          opaque: B
        })
      })
    }
  }

  function _aQ(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      _aQ.call(this, A, (Z, Y) => {
        return Z ? G(Z) : B(Y)
      })
    });
    try {
      let B = new RaQ(A, Q);
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
  jaQ.exports = _aQ
})
// @from(Ln 114761, Col 4)
kaQ = U((RXG, vaQ) => {
  var Ez3 = NA("node:assert"),
    {
      AsyncResource: zz3
    } = NA("node:async_hooks"),
    {
      InvalidArgumentError: Lc1,
      SocketError: $z3
    } = GG(),
    PaQ = b8(),
    {
      addSignal: Cz3,
      removeSignal: SaQ
    } = aLA();
  class xaQ extends zz3 {
    constructor(A, Q) {
      if (!A || typeof A !== "object") throw new Lc1("invalid opts");
      if (typeof Q !== "function") throw new Lc1("invalid callback");
      let {
        signal: B,
        opaque: G,
        responseHeaders: Z
      } = A;
      if (B && typeof B.on !== "function" && typeof B.addEventListener !== "function") throw new Lc1("signal must be an EventEmitter or EventTarget");
      super("UNDICI_CONNECT");
      this.opaque = G || null, this.responseHeaders = Z || null, this.callback = Q, this.abort = null, Cz3(this, B)
    }
    onConnect(A, Q) {
      if (this.reason) {
        A(this.reason);
        return
      }
      Ez3(this.callback), this.abort = A, this.context = Q
    }
    onHeaders() {
      throw new $z3("bad connect", null)
    }
    onUpgrade(A, Q, B) {
      let {
        callback: G,
        opaque: Z,
        context: Y
      } = this;
      SaQ(this), this.callback = null;
      let J = Q;
      if (J != null) J = this.responseHeaders === "raw" ? PaQ.parseRawHeaders(Q) : PaQ.parseHeaders(Q);
      this.runInAsyncScope(G, null, null, {
        statusCode: A,
        headers: J,
        socket: B,
        opaque: Z,
        context: Y
      })
    }
    onError(A) {
      let {
        callback: Q,
        opaque: B
      } = this;
      if (SaQ(this), Q) this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, A, {
          opaque: B
        })
      })
    }
  }

  function yaQ(A, Q) {
    if (Q === void 0) return new Promise((B, G) => {
      yaQ.call(this, A, (Z, Y) => {
        return Z ? G(Z) : B(Y)
      })
    });
    try {
      let B = new xaQ(A, Q);
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
  vaQ.exports = yaQ
})
// @from(Ln 114850, Col 4)
baQ = U((Uz3, MJA) => {
  Uz3.request = XaQ();
  Uz3.stream = EaQ();
  Uz3.pipeline = waQ();
  Uz3.upgrade = TaQ();
  Uz3.connect = kaQ()
})
// @from(Ln 114857, Col 4)
Mc1 = U((_XG, faQ) => {
  var {
    UndiciError: Mz3
  } = GG();
  class Oc1 extends Mz3 {
    constructor(A) {
      super(A);
      Error.captureStackTrace(this, Oc1), this.name = "MockNotMatchedError", this.message = A || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED"
    }
  }
  faQ.exports = {
    MockNotMatchedError: Oc1
  }
})
// @from(Ln 114871, Col 4)
RJA = U((jXG, haQ) => {
  haQ.exports = {
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
// @from(Ln 114894, Col 4)
rLA = U((TXG, oaQ) => {
  var {
    MockNotMatchedError: e0A
  } = Mc1(), {
    kDispatches: etA,
    kMockAgent: Rz3,
    kOriginalDispatch: _z3,
    kOrigin: jz3,
    kGetNetConnect: Tz3
  } = RJA(), {
    buildURL: Pz3
  } = b8(), {
    STATUS_CODES: Sz3
  } = NA("node:http"), {
    types: {
      isPromise: xz3
    }
  } = NA("node:util");

  function $u(A, Q) {
    if (typeof A === "string") return A === Q;
    if (A instanceof RegExp) return A.test(Q);
    if (typeof A === "function") return A(Q) === !0;
    return !1
  }

  function uaQ(A) {
    return Object.fromEntries(Object.entries(A).map(([Q, B]) => {
      return [Q.toLocaleLowerCase(), B]
    }))
  }

  function maQ(A, Q) {
    if (Array.isArray(A)) {
      for (let B = 0; B < A.length; B += 2)
        if (A[B].toLocaleLowerCase() === Q.toLocaleLowerCase()) return A[B + 1];
      return
    } else if (typeof A.get === "function") return A.get(Q);
    else return uaQ(A)[Q.toLocaleLowerCase()]
  }

  function jc1(A) {
    let Q = A.slice(),
      B = [];
    for (let G = 0; G < Q.length; G += 2) B.push([Q[G], Q[G + 1]]);
    return Object.fromEntries(B)
  }

  function daQ(A, Q) {
    if (typeof A.headers === "function") {
      if (Array.isArray(Q)) Q = jc1(Q);
      return A.headers(Q ? uaQ(Q) : {})
    }
    if (typeof A.headers > "u") return !0;
    if (typeof Q !== "object" || typeof A.headers !== "object") return !1;
    for (let [B, G] of Object.entries(A.headers)) {
      let Z = maQ(Q, B);
      if (!$u(G, Z)) return !1
    }
    return !0
  }

  function gaQ(A) {
    if (typeof A !== "string") return A;
    let Q = A.split("?");
    if (Q.length !== 2) return A;
    let B = new URLSearchParams(Q.pop());
    return B.sort(), [...Q, B.toString()].join("?")
  }

  function yz3(A, {
    path: Q,
    method: B,
    body: G,
    headers: Z
  }) {
    let Y = $u(A.path, Q),
      J = $u(A.method, B),
      X = typeof A.body < "u" ? $u(A.body, G) : !0,
      I = daQ(A, Z);
    return Y && J && X && I
  }

  function caQ(A) {
    if (Buffer.isBuffer(A)) return A;
    else if (A instanceof Uint8Array) return A;
    else if (A instanceof ArrayBuffer) return A;
    else if (typeof A === "object") return JSON.stringify(A);
    else return A.toString()
  }

  function paQ(A, Q) {
    let B = Q.query ? Pz3(Q.path, Q.query) : Q.path,
      G = typeof B === "string" ? gaQ(B) : B,
      Z = A.filter(({
        consumed: Y
      }) => !Y).filter(({
        path: Y
      }) => $u(gaQ(Y), G));
    if (Z.length === 0) throw new e0A(`Mock dispatch not matched for path '${G}'`);
    if (Z = Z.filter(({
        method: Y
      }) => $u(Y, Q.method)), Z.length === 0) throw new e0A(`Mock dispatch not matched for method '${Q.method}' on path '${G}'`);
    if (Z = Z.filter(({
        body: Y
      }) => typeof Y < "u" ? $u(Y, Q.body) : !0), Z.length === 0) throw new e0A(`Mock dispatch not matched for body '${Q.body}' on path '${G}'`);
    if (Z = Z.filter((Y) => daQ(Y, Q.headers)), Z.length === 0) {
      let Y = typeof Q.headers === "object" ? JSON.stringify(Q.headers) : Q.headers;
      throw new e0A(`Mock dispatch not matched for headers '${Y}' on path '${G}'`)
    }
    return Z[0]
  }

  function vz3(A, Q, B) {
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
      Y = {
        ...G,
        ...Q,
        pending: !0,
        data: {
          error: null,
          ...Z
        }
      };
    return A.push(Y), Y
  }

  function Rc1(A, Q) {
    let B = A.findIndex((G) => {
      if (!G.consumed) return !1;
      return yz3(G, Q)
    });
    if (B !== -1) A.splice(B, 1)
  }

  function laQ(A) {
    let {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: Y
    } = A;
    return {
      path: Q,
      method: B,
      body: G,
      headers: Z,
      query: Y
    }
  }

  function _c1(A) {
    let Q = Object.keys(A),
      B = [];
    for (let G = 0; G < Q.length; ++G) {
      let Z = Q[G],
        Y = A[Z],
        J = Buffer.from(`${Z}`);
      if (Array.isArray(Y))
        for (let X = 0; X < Y.length; ++X) B.push(J, Buffer.from(`${Y[X]}`));
      else B.push(J, Buffer.from(`${Y}`))
    }
    return B
  }

  function iaQ(A) {
    return Sz3[A] || "unknown"
  }
  async function kz3(A) {
    let Q = [];
    for await (let B of A) Q.push(B);
    return Buffer.concat(Q).toString("utf8")
  }

  function naQ(A, Q) {
    let B = laQ(A),
      G = paQ(this[etA], B);
    if (G.timesInvoked++, G.data.callback) G.data = {
      ...G.data,
      ...G.data.callback(A)
    };
    let {
      data: {
        statusCode: Z,
        data: Y,
        headers: J,
        trailers: X,
        error: I
      },
      delay: D,
      persist: W
    } = G, {
      timesInvoked: K,
      times: V
    } = G;
    if (G.consumed = !W && K >= V, G.pending = K < V, I !== null) return Rc1(this[etA], B), Q.onError(I), !0;
    if (typeof D === "number" && D > 0) setTimeout(() => {
      F(this[etA])
    }, D);
    else F(this[etA]);

    function F(E, z = Y) {
      let $ = Array.isArray(A.headers) ? jc1(A.headers) : A.headers,
        O = typeof z === "function" ? z({
          ...A,
          headers: $
        }) : z;
      if (xz3(O)) {
        O.then((j) => F(E, j));
        return
      }
      let L = caQ(O),
        M = _c1(J),
        _ = _c1(X);
      Q.onConnect?.((j) => Q.onError(j), null), Q.onHeaders?.(Z, M, H, iaQ(Z)), Q.onData?.(Buffer.from(L)), Q.onComplete?.(_), Rc1(E, B)
    }

    function H() {}
    return !0
  }

  function bz3() {
    let A = this[Rz3],
      Q = this[jz3],
      B = this[_z3];
    return function (Z, Y) {
      if (A.isMockActive) try {
        naQ.call(this, Z, Y)
      } catch (J) {
        if (J instanceof e0A) {
          let X = A[Tz3]();
          if (X === !1) throw new e0A(`${J.message}: subsequent request to origin ${Q} was not allowed (net.connect disabled)`);
          if (aaQ(X, Q)) B.call(this, Z, Y);
          else throw new e0A(`${J.message}: subsequent request to origin ${Q} was not allowed (net.connect is not enabled for this origin)`)
        } else throw J
      } else B.call(this, Z, Y)
    }
  }

  function aaQ(A, Q) {
    let B = new URL(Q);
    if (A === !0) return !0;
    else if (Array.isArray(A) && A.some((G) => $u(G, B.host))) return !0;
    return !1
  }

  function fz3(A) {
    if (A) {
      let {
        agent: Q,
        ...B
      } = A;
      return B
    }
  }
  oaQ.exports = {
    getResponseData: caQ,
    getMockDispatch: paQ,
    addMockDispatch: vz3,
    deleteMockDispatch: Rc1,
    buildKey: laQ,
    generateKeyValues: _c1,
    matchValue: $u,
    getResponse: kz3,
    getStatusText: iaQ,
    mockDispatch: naQ,
    buildMockDispatch: bz3,
    checkNetConnect: aaQ,
    buildMockOptions: fz3,
    getHeaderByName: maQ,
    buildHeadersFromArray: jc1
  }
})
// @from(Ln 115178, Col 4)
vc1 = U((mz3, yc1) => {
  var {
    getResponseData: hz3,
    buildKey: gz3,
    addMockDispatch: Tc1
  } = rLA(), {
    kDispatches: AeA,
    kDispatchKey: QeA,
    kDefaultHeaders: Pc1,
    kDefaultTrailers: Sc1,
    kContentLength: xc1,
    kMockDispatch: BeA
  } = RJA(), {
    InvalidArgumentError: ov
  } = GG(), {
    buildURL: uz3
  } = b8();
  class sLA {
    constructor(A) {
      this[BeA] = A
    }
    delay(A) {
      if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new ov("waitInMs must be a valid integer > 0");
      return this[BeA].delay = A, this
    }
    persist() {
      return this[BeA].persist = !0, this
    }
    times(A) {
      if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new ov("repeatTimes must be a valid integer > 0");
      return this[BeA].times = A, this
    }
  }
  class raQ {
    constructor(A, Q) {
      if (typeof A !== "object") throw new ov("opts must be an object");
      if (typeof A.path > "u") throw new ov("opts.path must be defined");
      if (typeof A.method > "u") A.method = "GET";
      if (typeof A.path === "string")
        if (A.query) A.path = uz3(A.path, A.query);
        else {
          let B = new URL(A.path, "data://");
          A.path = B.pathname + B.search
        } if (typeof A.method === "string") A.method = A.method.toUpperCase();
      this[QeA] = gz3(A), this[AeA] = Q, this[Pc1] = {}, this[Sc1] = {}, this[xc1] = !1
    }
    createMockScopeDispatchData({
      statusCode: A,
      data: Q,
      responseOptions: B
    }) {
      let G = hz3(Q),
        Z = this[xc1] ? {
          "content-length": G.length
        } : {},
        Y = {
          ...this[Pc1],
          ...Z,
          ...B.headers
        },
        J = {
          ...this[Sc1],
          ...B.trailers
        };
      return {
        statusCode: A,
        data: Q,
        headers: Y,
        trailers: J
      }
    }
    validateReplyParameters(A) {
      if (typeof A.statusCode > "u") throw new ov("statusCode must be defined");
      if (typeof A.responseOptions !== "object" || A.responseOptions === null) throw new ov("responseOptions must be an object")
    }
    reply(A) {
      if (typeof A === "function") {
        let Z = (J) => {
            let X = A(J);
            if (typeof X !== "object" || X === null) throw new ov("reply options callback must return an object");
            let I = {
              data: "",
              responseOptions: {},
              ...X
            };
            return this.validateReplyParameters(I), {
              ...this.createMockScopeDispatchData(I)
            }
          },
          Y = Tc1(this[AeA], this[QeA], Z);
        return new sLA(Y)
      }
      let Q = {
        statusCode: A,
        data: arguments[1] === void 0 ? "" : arguments[1],
        responseOptions: arguments[2] === void 0 ? {} : arguments[2]
      };
      this.validateReplyParameters(Q);
      let B = this.createMockScopeDispatchData(Q),
        G = Tc1(this[AeA], this[QeA], B);
      return new sLA(G)
    }
    replyWithError(A) {
      if (typeof A > "u") throw new ov("error must be defined");
      let Q = Tc1(this[AeA], this[QeA], {
        error: A
      });
      return new sLA(Q)
    }
    defaultReplyHeaders(A) {
      if (typeof A > "u") throw new ov("headers must be defined");
      return this[Pc1] = A, this
    }
    defaultReplyTrailers(A) {
      if (typeof A > "u") throw new ov("trailers must be defined");
      return this[Sc1] = A, this
    }
    replyContentLength() {
      return this[xc1] = !0, this
    }
  }
  mz3.MockInterceptor = raQ;
  mz3.MockScope = sLA
})
// @from(Ln 115302, Col 4)
bc1 = U((PXG, ZoQ) => {
  var {
    promisify: pz3
  } = NA("node:util"), lz3 = hLA(), {
    buildMockDispatch: iz3
  } = rLA(), {
    kDispatches: saQ,
    kMockAgent: taQ,
    kClose: eaQ,
    kOriginalClose: AoQ,
    kOrigin: QoQ,
    kOriginalDispatch: nz3,
    kConnected: kc1
  } = RJA(), {
    MockInterceptor: az3
  } = vc1(), BoQ = VX(), {
    InvalidArgumentError: oz3
  } = GG();
  class GoQ extends lz3 {
    constructor(A, Q) {
      super(A, Q);
      if (!Q || !Q.agent || typeof Q.agent.dispatch !== "function") throw new oz3("Argument opts.agent must implement Agent");
      this[taQ] = Q.agent, this[QoQ] = A, this[saQ] = [], this[kc1] = 1, this[nz3] = this.dispatch, this[AoQ] = this.close.bind(this), this.dispatch = iz3.call(this), this.close = this[eaQ]
    }
    get[BoQ.kConnected]() {
      return this[kc1]
    }
    intercept(A) {
      return new az3(A, this[saQ])
    }
    async [eaQ]() {
      await pz3(this[AoQ])(), this[kc1] = 0, this[taQ][BoQ.kClients].delete(this[QoQ])
    }
  }
  ZoQ.exports = GoQ
})
// @from(Ln 115338, Col 4)
hc1 = U((SXG, VoQ) => {
  var {
    promisify: rz3
  } = NA("node:util"), sz3 = CJA(), {
    buildMockDispatch: tz3
  } = rLA(), {
    kDispatches: YoQ,
    kMockAgent: JoQ,
    kClose: XoQ,
    kOriginalClose: IoQ,
    kOrigin: DoQ,
    kOriginalDispatch: ez3,
    kConnected: fc1
  } = RJA(), {
    MockInterceptor: A$3
  } = vc1(), WoQ = VX(), {
    InvalidArgumentError: Q$3
  } = GG();
  class KoQ extends sz3 {
    constructor(A, Q) {
      super(A, Q);
      if (!Q || !Q.agent || typeof Q.agent.dispatch !== "function") throw new Q$3("Argument opts.agent must implement Agent");
      this[JoQ] = Q.agent, this[DoQ] = A, this[YoQ] = [], this[fc1] = 1, this[ez3] = this.dispatch, this[IoQ] = this.close.bind(this), this.dispatch = tz3.call(this), this.close = this[XoQ]
    }
    get[WoQ.kConnected]() {
      return this[fc1]
    }
    intercept(A) {
      return new A$3(A, this[YoQ])
    }
    async [XoQ]() {
      await rz3(this[IoQ])(), this[fc1] = 0, this[JoQ][WoQ.kClients].delete(this[DoQ])
    }
  }
  VoQ.exports = KoQ
})
// @from(Ln 115374, Col 4)
HoQ = U((xXG, FoQ) => {
  var B$3 = {
      pronoun: "it",
      is: "is",
      was: "was",
      this: "this"
    },
    G$3 = {
      pronoun: "they",
      is: "are",
      was: "were",
      this: "these"
    };
  FoQ.exports = class {
    constructor(Q, B) {
      this.singular = Q, this.plural = B
    }
    pluralize(Q) {
      let B = Q === 1,
        G = B ? B$3 : G$3,
        Z = B ? this.singular : this.plural;
      return {
        ...G,
        count: Q,
        noun: Z
      }
    }
  }
})
// @from(Ln 115403, Col 4)
zoQ = U((yXG, EoQ) => {
  var {
    Transform: Z$3
  } = NA("node:stream"), {
    Console: Y$3
  } = NA("node:console"), J$3 = process.versions.icu ? "✅" : "Y ", X$3 = process.versions.icu ? "❌" : "N ";
  EoQ.exports = class {
    constructor({
      disableColors: Q
    } = {}) {
      this.transform = new Z$3({
        transform(B, G, Z) {
          Z(null, B)
        }
      }), this.logger = new Y$3({
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
          statusCode: Y
        },
        persist: J,
        times: X,
        timesInvoked: I,
        origin: D
      }) => ({
        Method: G,
        Origin: D,
        Path: Z,
        "Status code": Y,
        Persistent: J ? J$3 : X$3,
        Invocations: I,
        Remaining: J ? 1 / 0 : X - I
      }));
      return this.logger.table(B), this.transform.read().toString()
    }
  }
})
// @from(Ln 115448, Col 4)
NoQ = U((vXG, qoQ) => {
  var {
    kClients: AQA
  } = VX(), I$3 = UJA(), {
    kAgent: gc1,
    kMockAgentSet: GeA,
    kMockAgentGet: $oQ,
    kDispatches: uc1,
    kIsMockActive: ZeA,
    kNetConnect: QQA,
    kGetNetConnect: D$3,
    kOptions: YeA,
    kFactory: JeA
  } = RJA(), W$3 = bc1(), K$3 = hc1(), {
    matchValue: V$3,
    buildMockOptions: F$3
  } = rLA(), {
    InvalidArgumentError: CoQ,
    UndiciError: H$3
  } = GG(), E$3 = $LA(), z$3 = HoQ(), $$3 = zoQ();
  class UoQ extends E$3 {
    constructor(A) {
      super(A);
      if (this[QQA] = !0, this[ZeA] = !0, A?.agent && typeof A.agent.dispatch !== "function") throw new CoQ("Argument opts.agent must implement Agent");
      let Q = A?.agent ? A.agent : new I$3(A);
      this[gc1] = Q, this[AQA] = Q[AQA], this[YeA] = F$3(A)
    }
    get(A) {
      let Q = this[$oQ](A);
      if (!Q) Q = this[JeA](A), this[GeA](A, Q);
      return Q
    }
    dispatch(A, Q) {
      return this.get(A.origin), this[gc1].dispatch(A, Q)
    }
    async close() {
      await this[gc1].close(), this[AQA].clear()
    }
    deactivate() {
      this[ZeA] = !1
    }
    activate() {
      this[ZeA] = !0
    }
    enableNetConnect(A) {
      if (typeof A === "string" || typeof A === "function" || A instanceof RegExp)
        if (Array.isArray(this[QQA])) this[QQA].push(A);
        else this[QQA] = [A];
      else if (typeof A > "u") this[QQA] = !0;
      else throw new CoQ("Unsupported matcher. Must be one of String|Function|RegExp.")
    }
    disableNetConnect() {
      this[QQA] = !1
    }
    get isMockActive() {
      return this[ZeA]
    } [GeA](A, Q) {
      this[AQA].set(A, Q)
    } [JeA](A) {
      let Q = Object.assign({
        agent: this
      }, this[YeA]);
      return this[YeA] && this[YeA].connections === 1 ? new W$3(A, Q) : new K$3(A, Q)
    } [$oQ](A) {
      let Q = this[AQA].get(A);
      if (Q) return Q;
      if (typeof A !== "string") {
        let B = this[JeA]("http://localhost:9999");
        return this[GeA](A, B), B
      }
      for (let [B, G] of Array.from(this[AQA]))
        if (G && typeof B !== "string" && V$3(B, A)) {
          let Z = this[JeA](A);
          return this[GeA](A, Z), Z[uc1] = G[uc1], Z
        }
    } [D$3]() {
      return this[QQA]
    }
    pendingInterceptors() {
      let A = this[AQA];
      return Array.from(A.entries()).flatMap(([Q, B]) => B[uc1].map((G) => ({
        ...G,
        origin: Q
      }))).filter(({
        pending: Q
      }) => Q)
    }
    assertNoPendingInterceptors({
      pendingInterceptorsFormatter: A = new $$3
    } = {}) {
      let Q = this.pendingInterceptors();
      if (Q.length === 0) return;
      let B = new z$3("interceptor", "interceptors").pluralize(Q.length);
      throw new H$3(`
${B.count} ${B.noun} ${B.is} pending:

${A.format(Q)}
`.trim())
    }
  }
  qoQ.exports = UoQ
})
// @from(Ln 115550, Col 4)
XeA = U((kXG, MoQ) => {
  var woQ = Symbol.for("undici.globalDispatcher.1"),
    {
      InvalidArgumentError: C$3
    } = GG(),
    U$3 = UJA();
  if (OoQ() === void 0) LoQ(new U$3);

  function LoQ(A) {
    if (!A || typeof A.dispatch !== "function") throw new C$3("Argument agent must implement Agent");
    Object.defineProperty(globalThis, woQ, {
      value: A,
      writable: !0,
      enumerable: !1,
      configurable: !1
    })
  }

  function OoQ() {
    return globalThis[woQ]
  }
  MoQ.exports = {
    setGlobalDispatcher: LoQ,
    getGlobalDispatcher: OoQ
  }
})
// @from(Ln 115576, Col 4)
IeA = U((bXG, RoQ) => {
  RoQ.exports = class {
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
// @from(Ln 115609, Col 4)
joQ = U((fXG, _oQ) => {
  var q$3 = dtA();
  _oQ.exports = (A) => {
    let Q = A?.maxRedirections;
    return (B) => {
      return function (Z, Y) {
        let {
          maxRedirections: J = Q,
          ...X
        } = Z;
        if (!J) return B(Z, Y);
        let I = new q$3(B, J, Z, Y);
        return B(X, I)
      }
    }
  }
})
// @from(Ln 115626, Col 4)
PoQ = U((hXG, ToQ) => {
  var N$3 = ttA();
  ToQ.exports = (A) => {
    return (Q) => {
      return function (G, Z) {
        return Q(G, new N$3({
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
// @from(Ln 115645, Col 4)
yoQ = U((gXG, xoQ) => {
  var w$3 = b8(),
    {
      InvalidArgumentError: L$3,
      RequestAbortedError: O$3
    } = GG(),
    M$3 = IeA();
  class SoQ extends M$3 {
    #A = 1048576;
    #Q = null;
    #B = !1;
    #Z = !1;
    #G = 0;
    #X = null;
    #Y = null;
    constructor({
      maxSize: A
    }, Q) {
      super(Q);
      if (A != null && (!Number.isFinite(A) || A < 1)) throw new L$3("maxSize must be a number greater than 0");
      this.#A = A ?? this.#A, this.#Y = Q
    }
    onConnect(A) {
      this.#Q = A, this.#Y.onConnect(this.#W.bind(this))
    }
    #W(A) {
      this.#Z = !0, this.#X = A
    }
    onHeaders(A, Q, B, G) {
      let Y = w$3.parseHeaders(Q)["content-length"];
      if (Y != null && Y > this.#A) throw new O$3(`Response size (${Y}) larger than maxSize (${this.#A})`);
      if (this.#Z) return !0;
      return this.#Y.onHeaders(A, Q, B, G)
    }
    onError(A) {
      if (this.#B) return;
      A = this.#X ?? A, this.#Y.onError(A)
    }
    onData(A) {
      if (this.#G = this.#G + A.length, this.#G >= this.#A)
        if (this.#B = !0, this.#Z) this.#Y.onError(this.#X);
        else this.#Y.onComplete([]);
      return !0
    }
    onComplete(A) {
      if (this.#B) return;
      if (this.#Z) {
        this.#Y.onError(this.reason);
        return
      }
      this.#Y.onComplete(A)
    }
  }

  function R$3({
    maxSize: A
  } = {
    maxSize: 1048576
  }) {
    return (Q) => {
      return function (G, Z) {
        let {
          dumpMaxSize: Y = A
        } = G, J = new SoQ({
          maxSize: Y
        }, Z);
        return Q(G, J)
      }
    }
  }
  xoQ.exports = R$3
})
// @from(Ln 115717, Col 4)
hoQ = U((uXG, foQ) => {
  var {
    isIP: _$3
  } = NA("node:net"), {
    lookup: j$3
  } = NA("node:dns"), T$3 = IeA(), {
    InvalidArgumentError: _JA,
    InformationalError: P$3
  } = GG(), voQ = Math.pow(2, 31) - 1;
  class koQ {
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
      if (G == null) this.lookup(A, Z, (Y, J) => {
        if (Y || J == null || J.length === 0) {
          B(Y ?? new P$3("No DNS entries found"));
          return
        }
        this.setRecords(A, J);
        let X = this.#B.get(A.hostname),
          I = this.pick(A, X, Z.affinity),
          D;
        if (typeof I.port === "number") D = `:${I.port}`;
        else if (A.port !== "") D = `:${A.port}`;
        else D = "";
        B(null, `${A.protocol}//${I.family===6?`[${I.address}]`:I.address}${D}`)
      });
      else {
        let Y = this.pick(A, G, Z.affinity);
        if (Y == null) {
          this.#B.delete(A.hostname), this.runLookup(A, Q, B);
          return
        }
        let J;
        if (typeof Y.port === "number") J = `:${Y.port}`;
        else if (A.port !== "") J = `:${A.port}`;
        else J = "";
        B(null, `${A.protocol}//${Y.family===6?`[${Y.address}]`:Y.address}${J}`)
      }
    }
    #Z(A, Q, B) {
      j$3(A.hostname, {
        all: !0,
        family: this.dualStack === !1 ? this.affinity : 0,
        order: "ipv4first"
      }, (G, Z) => {
        if (G) return B(G);
        let Y = new Map;
        for (let J of Z) Y.set(`${J.address}:${J.family}`, J);
        B(null, Y.values())
      })
    }
    #G(A, Q, B) {
      let G = null,
        {
          records: Z,
          offset: Y
        } = Q,
        J;
      if (this.dualStack) {
        if (B == null)
          if (Y == null || Y === voQ) Q.offset = 0, B = 4;
          else Q.offset++, B = (Q.offset & 1) === 1 ? 6 : 4;
        if (Z[B] != null && Z[B].ips.length > 0) J = Z[B];
        else J = Z[B === 4 ? 6 : 4]
      } else J = Z[B];
      if (J == null || J.ips.length === 0) return G;
      if (J.offset == null || J.offset === voQ) J.offset = 0;
      else J.offset++;
      let X = J.offset % J.ips.length;
      if (G = J.ips[X] ?? null, G == null) return G;
      if (Date.now() - G.timestamp > G.ttl) return J.ips.splice(X, 1), this.pick(A, Q, B);
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
        let Y = G.records[Z.family] ?? {
          ips: []
        };
        Y.ips.push(Z), G.records[Z.family] = Y
      }
      this.#B.set(A.hostname, G)
    }
    getHandler(A, Q) {
      return new boQ(this, A, Q)
    }
  }
  class boQ extends T$3 {
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
  foQ.exports = (A) => {
    if (A?.maxTTL != null && (typeof A?.maxTTL !== "number" || A?.maxTTL < 0)) throw new _JA("Invalid maxTTL. Must be a positive number");
    if (A?.maxItems != null && (typeof A?.maxItems !== "number" || A?.maxItems < 1)) throw new _JA("Invalid maxItems. Must be a positive number and greater than zero");
    if (A?.affinity != null && A?.affinity !== 4 && A?.affinity !== 6) throw new _JA("Invalid affinity. Must be either 4 or 6");
    if (A?.dualStack != null && typeof A?.dualStack !== "boolean") throw new _JA("Invalid dualStack. Must be a boolean");
    if (A?.lookup != null && typeof A?.lookup !== "function") throw new _JA("Invalid lookup. Must be a function");
    if (A?.pick != null && typeof A?.pick !== "function") throw new _JA("Invalid pick. Must be a function");
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
      Z = new koQ(G);
    return (Y) => {
      return function (X, I) {
        let D = X.origin.constructor === URL ? X.origin : new URL(X.origin);
        if (_$3(D.hostname) !== 0) return Y(X, I);
        return Z.runLookup(D, X, (W, K) => {
          if (W) return I.onError(W);
          let V = null;
          V = {
            ...X,
            servername: D.hostname,
            origin: K,
            headers: {
              host: D.hostname,
              ...X.headers
            }
          }, Y(V, Z.getHandler({
            origin: D,
            dispatch: Y,
            handler: I
          }, X))
        }), !0
      }
    }
  }
})
// @from(Ln 115925, Col 4)
BQA = U((mXG, loQ) => {
  var {
    kConstruct: S$3
  } = VX(), {
    kEnumerableProperty: jJA
  } = b8(), {
    iteratorMixin: x$3,
    isValidHeaderName: tLA,
    isValidHeaderValue: uoQ
  } = zL(), {
    webidl: B7
  } = xH(), mc1 = NA("node:assert"), DeA = NA("node:util"), bW = Symbol("headers map"), UL = Symbol("headers map sorted");

  function goQ(A) {
    return A === 10 || A === 13 || A === 9 || A === 32
  }

  function moQ(A) {
    let Q = 0,
      B = A.length;
    while (B > Q && goQ(A.charCodeAt(B - 1))) --B;
    while (B > Q && goQ(A.charCodeAt(Q))) ++Q;
    return Q === 0 && B === A.length ? A : A.substring(Q, B)
  }

  function doQ(A, Q) {
    if (Array.isArray(Q))
      for (let B = 0; B < Q.length; ++B) {
        let G = Q[B];
        if (G.length !== 2) throw B7.errors.exception({
          header: "Headers constructor",
          message: `expected name/value pair to be length 2, found ${G.length}.`
        });
        dc1(A, G[0], G[1])
      } else if (typeof Q === "object" && Q !== null) {
        let B = Object.keys(Q);
        for (let G = 0; G < B.length; ++G) dc1(A, B[G], Q[B[G]])
      } else throw B7.errors.conversionFailed({
        prefix: "Headers constructor",
        argument: "Argument 1",
        types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
      })
  }

  function dc1(A, Q, B) {
    if (B = moQ(B), !tLA(Q)) throw B7.errors.invalidArgument({
      prefix: "Headers.append",
      value: Q,
      type: "header name"
    });
    else if (!uoQ(B)) throw B7.errors.invalidArgument({
      prefix: "Headers.append",
      value: B,
      type: "header value"
    });
    if (poQ(A) === "immutable") throw TypeError("immutable");
    return cc1(A).append(Q, B, !1)
  }

  function coQ(A, Q) {
    return A[0] < Q[0] ? -1 : 1
  }
  class WeA {
    cookies = null;
    constructor(A) {
      if (A instanceof WeA) this[bW] = new Map(A[bW]), this[UL] = A[UL], this.cookies = A.cookies === null ? null : [...A.cookies];
      else this[bW] = new Map(A), this[UL] = null
    }
    contains(A, Q) {
      return this[bW].has(Q ? A : A.toLowerCase())
    }
    clear() {
      this[bW].clear(), this[UL] = null, this.cookies = null
    }
    append(A, Q, B) {
      this[UL] = null;
      let G = B ? A : A.toLowerCase(),
        Z = this[bW].get(G);
      if (Z) {
        let Y = G === "cookie" ? "; " : ", ";
        this[bW].set(G, {
          name: Z.name,
          value: `${Z.value}${Y}${Q}`
        })
      } else this[bW].set(G, {
        name: A,
        value: Q
      });
      if (G === "set-cookie")(this.cookies ??= []).push(Q)
    }
    set(A, Q, B) {
      this[UL] = null;
      let G = B ? A : A.toLowerCase();
      if (G === "set-cookie") this.cookies = [Q];
      this[bW].set(G, {
        name: A,
        value: Q
      })
    }
    delete(A, Q) {
      if (this[UL] = null, !Q) A = A.toLowerCase();
      if (A === "set-cookie") this.cookies = null;
      this[bW].delete(A)
    }
    get(A, Q) {
      return this[bW].get(Q ? A : A.toLowerCase())?.value ?? null
    }*[Symbol.iterator]() {
      for (let {
          0: A,
          1: {
            value: Q
          }
        }
        of this[bW]) yield [A, Q]
    }
    get entries() {
      let A = {};
      if (this[bW].size !== 0)
        for (let {
            name: Q,
            value: B
          }
          of this[bW].values()) A[Q] = B;
      return A
    }
    rawValues() {
      return this[bW].values()
    }
    get entriesList() {
      let A = [];
      if (this[bW].size !== 0)
        for (let {
            0: Q,
            1: {
              name: B,
              value: G
            }
          }
          of this[bW])
          if (Q === "set-cookie")
            for (let Z of this.cookies) A.push([B, Z]);
          else A.push([B, G]);
      return A
    }
    toSortedArray() {
      let A = this[bW].size,
        Q = Array(A);
      if (A <= 32) {
        if (A === 0) return Q;
        let B = this[bW][Symbol.iterator](),
          G = B.next().value;
        Q[0] = [G[0], G[1].value], mc1(G[1].value !== null);
        for (let Z = 1, Y = 0, J = 0, X = 0, I = 0, D, W; Z < A; ++Z) {
          W = B.next().value, D = Q[Z] = [W[0], W[1].value], mc1(D[1] !== null), X = 0, J = Z;
          while (X < J)
            if (I = X + (J - X >> 1), Q[I][0] <= D[0]) X = I + 1;
            else J = I;
          if (Z !== I) {
            Y = Z;
            while (Y > X) Q[Y] = Q[--Y];
            Q[X] = D
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
          of this[bW]) Q[B++] = [G, Z], mc1(Z !== null);
        return Q.sort(coQ)
      }
    }
  }
  class zz {
    #A;
    #Q;
    constructor(A = void 0) {
      if (B7.util.markAsUncloneable(this), A === S$3) return;
      if (this.#Q = new WeA, this.#A = "none", A !== void 0) A = B7.converters.HeadersInit(A, "Headers contructor", "init"), doQ(this, A)
    }
    append(A, Q) {
      B7.brandCheck(this, zz), B7.argumentLengthCheck(arguments, 2, "Headers.append");
      let B = "Headers.append";
      return A = B7.converters.ByteString(A, B, "name"), Q = B7.converters.ByteString(Q, B, "value"), dc1(this, A, Q)
    }
    delete(A) {
      B7.brandCheck(this, zz), B7.argumentLengthCheck(arguments, 1, "Headers.delete");
      let Q = "Headers.delete";
      if (A = B7.converters.ByteString(A, Q, "name"), !tLA(A)) throw B7.errors.invalidArgument({
        prefix: "Headers.delete",
        value: A,
        type: "header name"
      });
      if (this.#A === "immutable") throw TypeError("immutable");
      if (!this.#Q.contains(A, !1)) return;
      this.#Q.delete(A, !1)
    }
    get(A) {
      B7.brandCheck(this, zz), B7.argumentLengthCheck(arguments, 1, "Headers.get");
      let Q = "Headers.get";
      if (A = B7.converters.ByteString(A, Q, "name"), !tLA(A)) throw B7.errors.invalidArgument({
        prefix: Q,
        value: A,
        type: "header name"
      });
      return this.#Q.get(A, !1)
    }
    has(A) {
      B7.brandCheck(this, zz), B7.argumentLengthCheck(arguments, 1, "Headers.has");
      let Q = "Headers.has";
      if (A = B7.converters.ByteString(A, Q, "name"), !tLA(A)) throw B7.errors.invalidArgument({
        prefix: Q,
        value: A,
        type: "header name"
      });
      return this.#Q.contains(A, !1)
    }
    set(A, Q) {
      B7.brandCheck(this, zz), B7.argumentLengthCheck(arguments, 2, "Headers.set");
      let B = "Headers.set";
      if (A = B7.converters.ByteString(A, B, "name"), Q = B7.converters.ByteString(Q, B, "value"), Q = moQ(Q), !tLA(A)) throw B7.errors.invalidArgument({
        prefix: B,
        value: A,
        type: "header name"
      });
      else if (!uoQ(Q)) throw B7.errors.invalidArgument({
        prefix: B,
        value: Q,
        type: "header value"
      });
      if (this.#A === "immutable") throw TypeError("immutable");
      this.#Q.set(A, Q, !1)
    }
    getSetCookie() {
      B7.brandCheck(this, zz);
      let A = this.#Q.cookies;
      if (A) return [...A];
      return []
    }
    get[UL]() {
      if (this.#Q[UL]) return this.#Q[UL];
      let A = [],
        Q = this.#Q.toSortedArray(),
        B = this.#Q.cookies;
      if (B === null || B.length === 1) return this.#Q[UL] = Q;
      for (let G = 0; G < Q.length; ++G) {
        let {
          0: Z,
          1: Y
        } = Q[G];
        if (Z === "set-cookie")
          for (let J = 0; J < B.length; ++J) A.push([Z, B[J]]);
        else A.push([Z, Y])
      }
      return this.#Q[UL] = A
    } [DeA.inspect.custom](A, Q) {
      return Q.depth ??= A, `Headers ${DeA.formatWithOptions(Q,this.#Q.entries)}`
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
    getHeadersGuard: poQ,
    setHeadersGuard: y$3,
    getHeadersList: cc1,
    setHeadersList: v$3
  } = zz;
  Reflect.deleteProperty(zz, "getHeadersGuard");
  Reflect.deleteProperty(zz, "setHeadersGuard");
  Reflect.deleteProperty(zz, "getHeadersList");
  Reflect.deleteProperty(zz, "setHeadersList");
  x$3("Headers", zz, UL, 0, 1);
  Object.defineProperties(zz.prototype, {
    append: jJA,
    delete: jJA,
    get: jJA,
    has: jJA,
    set: jJA,
    getSetCookie: jJA,
    [Symbol.toStringTag]: {
      value: "Headers",
      configurable: !0
    },
    [DeA.inspect.custom]: {
      enumerable: !1
    }
  });
  B7.converters.HeadersInit = function (A, Q, B) {
    if (B7.util.Type(A) === "Object") {
      let G = Reflect.get(A, Symbol.iterator);
      if (!DeA.types.isProxy(A) && G === zz.prototype.entries) try {
        return cc1(A).entriesList
      } catch {}
      if (typeof G === "function") return B7.converters["sequence<sequence<ByteString>>"](A, Q, B, G.bind(A));
      return B7.converters["record<ByteString, ByteString>"](A, Q, B)
    }
    throw B7.errors.conversionFailed({
      prefix: "Headers constructor",
      argument: "Argument 1",
      types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
    })
  };
  loQ.exports = {
    fill: doQ,
    compareHeaderName: coQ,
    Headers: zz,
    HeadersList: WeA,
    getHeadersGuard: poQ,
    setHeadersGuard: y$3,
    setHeadersList: v$3,
    getHeadersList: cc1
  }
})
// @from(Ln 116253, Col 4)
AOA = U((dXG, QrQ) => {
  var {
    Headers: soQ,
    HeadersList: ioQ,
    fill: k$3,
    getHeadersGuard: b$3,
    setHeadersGuard: toQ,
    setHeadersList: eoQ
  } = BQA(), {
    extractBody: noQ,
    cloneBody: f$3,
    mixinBody: h$3,
    hasFinalizationRegistry: g$3,
    streamRegistry: u$3,
    bodyUnusable: m$3
  } = KJA(), pc1 = b8(), aoQ = NA("node:util"), {
    kEnumerableProperty: qL
  } = pc1, {
    isValidReasonPhrase: d$3,
    isCancelled: c$3,
    isAborted: p$3,
    isBlobLike: l$3,
    serializeJavascriptValueToJSONString: i$3,
    isErrorLike: n$3,
    isomorphicEncode: a$3,
    environmentSettingsObject: o$3
  } = zL(), {
    redirectStatusSet: r$3,
    nullBodyStatus: s$3
  } = qLA(), {
    kState: mI,
    kHeaders: Cu
  } = Cn(), {
    webidl: n3
  } = xH(), {
    FormData: t$3
  } = MLA(), {
    URLSerializer: ooQ
  } = bq(), {
    kConstruct: VeA
  } = VX(), lc1 = NA("node:assert"), {
    types: e$3
  } = NA("node:util"), AC3 = new TextEncoder("utf-8");
  class $z {
    static error() {
      return eLA(FeA(), "immutable")
    }
    static json(A, Q = {}) {
      if (n3.argumentLengthCheck(arguments, 1, "Response.json"), Q !== null) Q = n3.converters.ResponseInit(Q);
      let B = AC3.encode(i$3(A)),
        G = noQ(B),
        Z = eLA(TJA({}), "response");
      return roQ(Z, Q, {
        body: G[0],
        type: "application/json"
      }), Z
    }
    static redirect(A, Q = 302) {
      n3.argumentLengthCheck(arguments, 1, "Response.redirect"), A = n3.converters.USVString(A), Q = n3.converters["unsigned short"](Q);
      let B;
      try {
        B = new URL(A, o$3.settingsObject.baseUrl)
      } catch (Y) {
        throw TypeError(`Failed to parse URL from ${A}`, {
          cause: Y
        })
      }
      if (!r$3.has(Q)) throw RangeError(`Invalid status code ${Q}`);
      let G = eLA(TJA({}), "immutable");
      G[mI].status = Q;
      let Z = a$3(ooQ(B));
      return G[mI].headersList.append("location", Z, !0), G
    }
    constructor(A = null, Q = {}) {
      if (n3.util.markAsUncloneable(this), A === VeA) return;
      if (A !== null) A = n3.converters.BodyInit(A);
      Q = n3.converters.ResponseInit(Q), this[mI] = TJA({}), this[Cu] = new soQ(VeA), toQ(this[Cu], "response"), eoQ(this[Cu], this[mI].headersList);
      let B = null;
      if (A != null) {
        let [G, Z] = noQ(A);
        B = {
          body: G,
          type: Z
        }
      }
      roQ(this, Q, B)
    }
    get type() {
      return n3.brandCheck(this, $z), this[mI].type
    }
    get url() {
      n3.brandCheck(this, $z);
      let A = this[mI].urlList,
        Q = A[A.length - 1] ?? null;
      if (Q === null) return "";
      return ooQ(Q, !0)
    }
    get redirected() {
      return n3.brandCheck(this, $z), this[mI].urlList.length > 1
    }
    get status() {
      return n3.brandCheck(this, $z), this[mI].status
    }
    get ok() {
      return n3.brandCheck(this, $z), this[mI].status >= 200 && this[mI].status <= 299
    }
    get statusText() {
      return n3.brandCheck(this, $z), this[mI].statusText
    }
    get headers() {
      return n3.brandCheck(this, $z), this[Cu]
    }
    get body() {
      return n3.brandCheck(this, $z), this[mI].body ? this[mI].body.stream : null
    }
    get bodyUsed() {
      return n3.brandCheck(this, $z), !!this[mI].body && pc1.isDisturbed(this[mI].body.stream)
    }
    clone() {
      if (n3.brandCheck(this, $z), m$3(this)) throw n3.errors.exception({
        header: "Response.clone",
        message: "Body has already been consumed."
      });
      let A = ic1(this[mI]);
      return eLA(A, b$3(this[Cu]))
    } [aoQ.inspect.custom](A, Q) {
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
      return `Response ${aoQ.formatWithOptions(Q,B)}`
    }
  }
  h$3($z);
  Object.defineProperties($z.prototype, {
    type: qL,
    url: qL,
    status: qL,
    ok: qL,
    redirected: qL,
    statusText: qL,
    headers: qL,
    clone: qL,
    body: qL,
    bodyUsed: qL,
    [Symbol.toStringTag]: {
      value: "Response",
      configurable: !0
    }
  });
  Object.defineProperties($z, {
    json: qL,
    redirect: qL,
    error: qL
  });

  function ic1(A) {
    if (A.internalResponse) return ArQ(ic1(A.internalResponse), A.type);
    let Q = TJA({
      ...A,
      body: null
    });
    if (A.body != null) Q.body = f$3(Q, A.body);
    return Q
  }

  function TJA(A) {
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
      headersList: A?.headersList ? new ioQ(A?.headersList) : new ioQ,
      urlList: A?.urlList ? [...A.urlList] : []
    }
  }

  function FeA(A) {
    let Q = n$3(A);
    return TJA({
      type: "error",
      status: 0,
      error: Q ? A : Error(A ? String(A) : A),
      aborted: A && A.name === "AbortError"
    })
  }

  function QC3(A) {
    return A.type === "error" && A.status === 0
  }

  function KeA(A, Q) {
    return Q = {
      internalResponse: A,
      ...Q
    }, new Proxy(A, {
      get(B, G) {
        return G in Q ? Q[G] : B[G]
      },
      set(B, G, Z) {
        return lc1(!(G in Q)), B[G] = Z, !0
      }
    })
  }

  function ArQ(A, Q) {
    if (Q === "basic") return KeA(A, {
      type: "basic",
      headersList: A.headersList
    });
    else if (Q === "cors") return KeA(A, {
      type: "cors",
      headersList: A.headersList
    });
    else if (Q === "opaque") return KeA(A, {
      type: "opaque",
      urlList: Object.freeze([]),
      status: 0,
      statusText: "",
      body: null
    });
    else if (Q === "opaqueredirect") return KeA(A, {
      type: "opaqueredirect",
      status: 0,
      statusText: "",
      headersList: [],
      body: null
    });
    else lc1(!1)
  }

  function BC3(A, Q = null) {
    return lc1(c$3(A)), p$3(A) ? FeA(Object.assign(new DOMException("The operation was aborted.", "AbortError"), {
      cause: Q
    })) : FeA(Object.assign(new DOMException("Request was cancelled."), {
      cause: Q
    }))
  }

  function roQ(A, Q, B) {
    if (Q.status !== null && (Q.status < 200 || Q.status > 599)) throw RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
    if ("statusText" in Q && Q.statusText != null) {
      if (!d$3(String(Q.statusText))) throw TypeError("Invalid statusText")
    }
    if ("status" in Q && Q.status != null) A[mI].status = Q.status;
    if ("statusText" in Q && Q.statusText != null) A[mI].statusText = Q.statusText;
    if ("headers" in Q && Q.headers != null) k$3(A[Cu], Q.headers);
    if (B) {
      if (s$3.includes(A.status)) throw n3.errors.exception({
        header: "Response constructor",
        message: `Invalid response status code ${A.status}`
      });
      if (A[mI].body = B.body, B.type != null && !A[mI].headersList.contains("content-type", !0)) A[mI].headersList.append("content-type", B.type, !0)
    }
  }

  function eLA(A, Q) {
    let B = new $z(VeA);
    if (B[mI] = A, B[Cu] = new soQ(VeA), eoQ(B[Cu], A.headersList), toQ(B[Cu], Q), g$3 && A.body?.stream) u$3.register(B, new WeakRef(A.body.stream));
    return B
  }
  n3.converters.ReadableStream = n3.interfaceConverter(ReadableStream);
  n3.converters.FormData = n3.interfaceConverter(t$3);
  n3.converters.URLSearchParams = n3.interfaceConverter(URLSearchParams);
  n3.converters.XMLHttpRequestBodyInit = function (A, Q, B) {
    if (typeof A === "string") return n3.converters.USVString(A, Q, B);
    if (l$3(A)) return n3.converters.Blob(A, Q, B, {
      strict: !1
    });
    if (ArrayBuffer.isView(A) || e$3.isArrayBuffer(A)) return n3.converters.BufferSource(A, Q, B);
    if (pc1.isFormDataLike(A)) return n3.converters.FormData(A, Q, B, {
      strict: !1
    });
    if (A instanceof URLSearchParams) return n3.converters.URLSearchParams(A, Q, B);
    return n3.converters.DOMString(A, Q, B)
  };
  n3.converters.BodyInit = function (A, Q, B) {
    if (A instanceof ReadableStream) return n3.converters.ReadableStream(A, Q, B);
    if (A?.[Symbol.asyncIterator]) return A;
    return n3.converters.XMLHttpRequestBodyInit(A, Q, B)
  };
  n3.converters.ResponseInit = n3.dictionaryConverter([{
    key: "status",
    converter: n3.converters["unsigned short"],
    defaultValue: () => 200
  }, {
    key: "statusText",
    converter: n3.converters.ByteString,
    defaultValue: () => ""
  }, {
    key: "headers",
    converter: n3.converters.HeadersInit
  }]);
  QrQ.exports = {
    isNetworkError: QC3,
    makeNetworkError: FeA,
    makeResponse: TJA,
    makeAppropriateNetworkError: BC3,
    filterResponse: ArQ,
    Response: $z,
    cloneResponse: ic1,
    fromInnerResponse: eLA
  }
})
// @from(Ln 116572, Col 4)
XrQ = U((cXG, JrQ) => {
  var {
    kConnected: BrQ,
    kSize: GrQ
  } = VX();
  class ZrQ {
    constructor(A) {
      this.value = A
    }
    deref() {
      return this.value[BrQ] === 0 && this.value[GrQ] === 0 ? void 0 : this.value
    }
  }
  class YrQ {
    constructor(A) {
      this.finalizer = A
    }
    register(A, Q) {
      if (A.on) A.on("disconnect", () => {
        if (A[BrQ] === 0 && A[GrQ] === 0) this.finalizer(Q)
      })
    }
    unregister(A) {}
  }
  JrQ.exports = function () {
    if (process.env.NODE_V8_COVERAGE && process.version.startsWith("v18")) return process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
      WeakRef: ZrQ,
      FinalizationRegistry: YrQ
    };
    return {
      WeakRef,
      FinalizationRegistry
    }
  }
})