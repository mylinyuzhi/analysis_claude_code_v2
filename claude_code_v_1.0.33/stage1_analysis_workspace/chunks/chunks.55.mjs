
// @from(Start 4969412, End 4985065)
N3A = z((B_7, K2B) => {
  var {
    extractBody: Ki8,
    mixinBody: Di8,
    cloneBody: Hi8,
    bodyUnusable: tBB
  } = G3A(), {
    Headers: J2B,
    fill: Ci8,
    HeadersList: nlA,
    setHeadersGuard: Yv1,
    getHeadersGuard: Ei8,
    setHeadersList: W2B,
    getHeadersList: eBB
  } = no(), {
    FinalizationRegistry: zi8
  } = oBB()(), llA = S6(), A2B = UA("node:util"), {
    isValidHTTPToken: Ui8,
    sameOrigin: Q2B,
    environmentSettingsObject: plA
  } = xw(), {
    forbiddenMethodsSet: $i8,
    corsSafeListedMethodsSet: wi8,
    referrerPolicy: qi8,
    requestRedirect: Ni8,
    requestMode: Li8,
    requestCredentials: Mi8,
    requestCache: Oi8,
    requestDuplex: Ri8
  } = PEA(), {
    kEnumerableProperty: bX,
    normalizedMethodRecordsBase: Ti8,
    normalizedMethodRecords: Pi8
  } = llA, {
    kHeaders: gw,
    kSignal: ilA,
    kState: KI,
    kDispatcher: Iv1
  } = Kc(), {
    webidl: W4
  } = zD(), {
    URLSerializer: ji8
  } = QU(), {
    kConstruct: alA
  } = tI(), Si8 = UA("node:assert"), {
    getMaxListeners: B2B,
    setMaxListeners: G2B,
    getEventListeners: _i8,
    defaultMaxListeners: Z2B
  } = UA("node:events"), ki8 = Symbol("abortController"), X2B = new zi8(({
    signal: A,
    abort: Q
  }) => {
    A.removeEventListener("abort", Q)
  }), slA = new WeakMap;

  function I2B(A) {
    return Q;

    function Q() {
      let B = A.deref();
      if (B !== void 0) {
        X2B.unregister(Q), this.removeEventListener("abort", Q), B.abort(this.reason);
        let G = slA.get(B.signal);
        if (G !== void 0) {
          if (G.size !== 0) {
            for (let Z of G) {
              let I = Z.deref();
              if (I !== void 0) I.abort(this.reason)
            }
            G.clear()
          }
          slA.delete(B.signal)
        }
      }
    }
  }
  var Y2B = !1;
  class YZ {
    constructor(A, Q = {}) {
      if (W4.util.markAsUncloneable(this), A === alA) return;
      let B = "Request constructor";
      W4.argumentLengthCheck(arguments, 1, B), A = W4.converters.RequestInfo(A, B, "input"), Q = W4.converters.RequestInit(Q, B, "init");
      let G = null,
        Z = null,
        I = plA.settingsObject.baseUrl,
        Y = null;
      if (typeof A === "string") {
        this[Iv1] = Q.dispatcher;
        let E;
        try {
          E = new URL(A, I)
        } catch (U) {
          throw TypeError("Failed to parse URL from " + A, {
            cause: U
          })
        }
        if (E.username || E.password) throw TypeError("Request cannot be constructed from a URL that includes credentials: " + A);
        G = rlA({
          urlList: [E]
        }), Z = "cors"
      } else this[Iv1] = Q.dispatcher || A[Iv1], Si8(A instanceof YZ), G = A[KI], Y = A[ilA];
      let J = plA.settingsObject.origin,
        W = "client";
      if (G.window?.constructor?.name === "EnvironmentSettingsObject" && Q2B(G.window, J)) W = G.window;
      if (Q.window != null) throw TypeError(`'window' option '${W}' must be null`);
      if ("window" in Q) W = "no-window";
      G = rlA({
        method: G.method,
        headersList: G.headersList,
        unsafeRequest: G.unsafeRequest,
        client: plA.settingsObject,
        window: W,
        priority: G.priority,
        origin: G.origin,
        referrer: G.referrer,
        referrerPolicy: G.referrerPolicy,
        mode: G.mode,
        credentials: G.credentials,
        cache: G.cache,
        redirect: G.redirect,
        integrity: G.integrity,
        keepalive: G.keepalive,
        reloadNavigation: G.reloadNavigation,
        historyNavigation: G.historyNavigation,
        urlList: [...G.urlList]
      });
      let X = Object.keys(Q).length !== 0;
      if (X) {
        if (G.mode === "navigate") G.mode = "same-origin";
        G.reloadNavigation = !1, G.historyNavigation = !1, G.origin = "client", G.referrer = "client", G.referrerPolicy = "", G.url = G.urlList[G.urlList.length - 1], G.urlList = [G.url]
      }
      if (Q.referrer !== void 0) {
        let E = Q.referrer;
        if (E === "") G.referrer = "no-referrer";
        else {
          let U;
          try {
            U = new URL(E, I)
          } catch (q) {
            throw TypeError(`Referrer "${E}" is not a valid URL.`, {
              cause: q
            })
          }
          if (U.protocol === "about:" && U.hostname === "client" || J && !Q2B(U, plA.settingsObject.baseUrl)) G.referrer = "client";
          else G.referrer = U
        }
      }
      if (Q.referrerPolicy !== void 0) G.referrerPolicy = Q.referrerPolicy;
      let V;
      if (Q.mode !== void 0) V = Q.mode;
      else V = Z;
      if (V === "navigate") throw W4.errors.exception({
        header: "Request constructor",
        message: "invalid request mode navigate."
      });
      if (V != null) G.mode = V;
      if (Q.credentials !== void 0) G.credentials = Q.credentials;
      if (Q.cache !== void 0) G.cache = Q.cache;
      if (G.cache === "only-if-cached" && G.mode !== "same-origin") throw TypeError("'only-if-cached' can be set only with 'same-origin' mode");
      if (Q.redirect !== void 0) G.redirect = Q.redirect;
      if (Q.integrity != null) G.integrity = String(Q.integrity);
      if (Q.keepalive !== void 0) G.keepalive = Boolean(Q.keepalive);
      if (Q.method !== void 0) {
        let E = Q.method,
          U = Pi8[E];
        if (U !== void 0) G.method = U;
        else {
          if (!Ui8(E)) throw TypeError(`'${E}' is not a valid HTTP method.`);
          let q = E.toUpperCase();
          if ($i8.has(q)) throw TypeError(`'${E}' HTTP method is unsupported.`);
          E = Ti8[q] ?? E, G.method = E
        }
        if (!Y2B && G.method === "patch") process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
          code: "UNDICI-FETCH-patch"
        }), Y2B = !0
      }
      if (Q.signal !== void 0) Y = Q.signal;
      this[KI] = G;
      let F = new AbortController;
      if (this[ilA] = F.signal, Y != null) {
        if (!Y || typeof Y.aborted !== "boolean" || typeof Y.addEventListener !== "function") throw TypeError("Failed to construct 'Request': member signal is not of type AbortSignal.");
        if (Y.aborted) F.abort(Y.reason);
        else {
          this[ki8] = F;
          let E = new WeakRef(F),
            U = I2B(E);
          try {
            if (typeof B2B === "function" && B2B(Y) === Z2B) G2B(1500, Y);
            else if (_i8(Y, "abort").length >= Z2B) G2B(1500, Y)
          } catch {}
          llA.addAbortListener(Y, U), X2B.register(F, {
            signal: Y,
            abort: U
          }, U)
        }
      }
      if (this[gw] = new J2B(alA), W2B(this[gw], G.headersList), Yv1(this[gw], "request"), V === "no-cors") {
        if (!wi8.has(G.method)) throw TypeError(`'${G.method} is unsupported in no-cors mode.`);
        Yv1(this[gw], "request-no-cors")
      }
      if (X) {
        let E = eBB(this[gw]),
          U = Q.headers !== void 0 ? Q.headers : new nlA(E);
        if (E.clear(), U instanceof nlA) {
          for (let {
              name: q,
              value: w
            }
            of U.rawValues()) E.append(q, w, !1);
          E.cookies = U.cookies
        } else Ci8(this[gw], U)
      }
      let K = A instanceof YZ ? A[KI].body : null;
      if ((Q.body != null || K != null) && (G.method === "GET" || G.method === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body.");
      let D = null;
      if (Q.body != null) {
        let [E, U] = Ki8(Q.body, G.keepalive);
        if (D = E, U && !eBB(this[gw]).contains("content-type", !0)) this[gw].append("content-type", U)
      }
      let H = D ?? K;
      if (H != null && H.source == null) {
        if (D != null && Q.duplex == null) throw TypeError("RequestInit: duplex option is required when sending a body.");
        if (G.mode !== "same-origin" && G.mode !== "cors") throw TypeError('If request is made from ReadableStream, mode should be "same-origin" or "cors"');
        G.useCORSPreflightFlag = !0
      }
      let C = H;
      if (D == null && K != null) {
        if (tBB(A)) throw TypeError("Cannot construct a Request with a Request object that has already been used.");
        let E = new TransformStream;
        K.stream.pipeThrough(E), C = {
          source: K.source,
          length: K.length,
          stream: E.readable
        }
      }
      this[KI].body = C
    }
    get method() {
      return W4.brandCheck(this, YZ), this[KI].method
    }
    get url() {
      return W4.brandCheck(this, YZ), ji8(this[KI].url)
    }
    get headers() {
      return W4.brandCheck(this, YZ), this[gw]
    }
    get destination() {
      return W4.brandCheck(this, YZ), this[KI].destination
    }
    get referrer() {
      if (W4.brandCheck(this, YZ), this[KI].referrer === "no-referrer") return "";
      if (this[KI].referrer === "client") return "about:client";
      return this[KI].referrer.toString()
    }
    get referrerPolicy() {
      return W4.brandCheck(this, YZ), this[KI].referrerPolicy
    }
    get mode() {
      return W4.brandCheck(this, YZ), this[KI].mode
    }
    get credentials() {
      return this[KI].credentials
    }
    get cache() {
      return W4.brandCheck(this, YZ), this[KI].cache
    }
    get redirect() {
      return W4.brandCheck(this, YZ), this[KI].redirect
    }
    get integrity() {
      return W4.brandCheck(this, YZ), this[KI].integrity
    }
    get keepalive() {
      return W4.brandCheck(this, YZ), this[KI].keepalive
    }
    get isReloadNavigation() {
      return W4.brandCheck(this, YZ), this[KI].reloadNavigation
    }
    get isHistoryNavigation() {
      return W4.brandCheck(this, YZ), this[KI].historyNavigation
    }
    get signal() {
      return W4.brandCheck(this, YZ), this[ilA]
    }
    get body() {
      return W4.brandCheck(this, YZ), this[KI].body ? this[KI].body.stream : null
    }
    get bodyUsed() {
      return W4.brandCheck(this, YZ), !!this[KI].body && llA.isDisturbed(this[KI].body.stream)
    }
    get duplex() {
      return W4.brandCheck(this, YZ), "half"
    }
    clone() {
      if (W4.brandCheck(this, YZ), tBB(this)) throw TypeError("unusable");
      let A = V2B(this[KI]),
        Q = new AbortController;
      if (this.signal.aborted) Q.abort(this.signal.reason);
      else {
        let B = slA.get(this.signal);
        if (B === void 0) B = new Set, slA.set(this.signal, B);
        let G = new WeakRef(Q);
        B.add(G), llA.addAbortListener(Q.signal, I2B(G))
      }
      return F2B(A, Q.signal, Ei8(this[gw]))
    } [A2B.inspect.custom](A, Q) {
      if (Q.depth === null) Q.depth = 2;
      Q.colors ??= !0;
      let B = {
        method: this.method,
        url: this.url,
        headers: this.headers,
        destination: this.destination,
        referrer: this.referrer,
        referrerPolicy: this.referrerPolicy,
        mode: this.mode,
        credentials: this.credentials,
        cache: this.cache,
        redirect: this.redirect,
        integrity: this.integrity,
        keepalive: this.keepalive,
        isReloadNavigation: this.isReloadNavigation,
        isHistoryNavigation: this.isHistoryNavigation,
        signal: this.signal
      };
      return `Request ${A2B.formatWithOptions(Q,B)}`
    }
  }
  Di8(YZ);

  function rlA(A) {
    return {
      method: A.method ?? "GET",
      localURLsOnly: A.localURLsOnly ?? !1,
      unsafeRequest: A.unsafeRequest ?? !1,
      body: A.body ?? null,
      client: A.client ?? null,
      reservedClient: A.reservedClient ?? null,
      replacesClientId: A.replacesClientId ?? "",
      window: A.window ?? "client",
      keepalive: A.keepalive ?? !1,
      serviceWorkers: A.serviceWorkers ?? "all",
      initiator: A.initiator ?? "",
      destination: A.destination ?? "",
      priority: A.priority ?? null,
      origin: A.origin ?? "client",
      policyContainer: A.policyContainer ?? "client",
      referrer: A.referrer ?? "client",
      referrerPolicy: A.referrerPolicy ?? "",
      mode: A.mode ?? "no-cors",
      useCORSPreflightFlag: A.useCORSPreflightFlag ?? !1,
      credentials: A.credentials ?? "same-origin",
      useCredentials: A.useCredentials ?? !1,
      cache: A.cache ?? "default",
      redirect: A.redirect ?? "follow",
      integrity: A.integrity ?? "",
      cryptoGraphicsNonceMetadata: A.cryptoGraphicsNonceMetadata ?? "",
      parserMetadata: A.parserMetadata ?? "",
      reloadNavigation: A.reloadNavigation ?? !1,
      historyNavigation: A.historyNavigation ?? !1,
      userActivation: A.userActivation ?? !1,
      taintedOrigin: A.taintedOrigin ?? !1,
      redirectCount: A.redirectCount ?? 0,
      responseTainting: A.responseTainting ?? "basic",
      preventNoCacheCacheControlHeaderModification: A.preventNoCacheCacheControlHeaderModification ?? !1,
      done: A.done ?? !1,
      timingAllowFailed: A.timingAllowFailed ?? !1,
      urlList: A.urlList,
      url: A.urlList[0],
      headersList: A.headersList ? new nlA(A.headersList) : new nlA
    }
  }

  function V2B(A) {
    let Q = rlA({
      ...A,
      body: null
    });
    if (A.body != null) Q.body = Hi8(Q, A.body);
    return Q
  }

  function F2B(A, Q, B) {
    let G = new YZ(alA);
    return G[KI] = A, G[ilA] = Q, G[gw] = new J2B(alA), W2B(G[gw], A.headersList), Yv1(G[gw], B), G
  }
  Object.defineProperties(YZ.prototype, {
    method: bX,
    url: bX,
    headers: bX,
    redirect: bX,
    clone: bX,
    signal: bX,
    duplex: bX,
    destination: bX,
    body: bX,
    bodyUsed: bX,
    isHistoryNavigation: bX,
    isReloadNavigation: bX,
    keepalive: bX,
    integrity: bX,
    cache: bX,
    credentials: bX,
    attribute: bX,
    referrerPolicy: bX,
    referrer: bX,
    mode: bX,
    [Symbol.toStringTag]: {
      value: "Request",
      configurable: !0
    }
  });
  W4.converters.Request = W4.interfaceConverter(YZ);
  W4.converters.RequestInfo = function(A, Q, B) {
    if (typeof A === "string") return W4.converters.USVString(A, Q, B);
    if (A instanceof YZ) return W4.converters.Request(A, Q, B);
    return W4.converters.USVString(A, Q, B)
  };
  W4.converters.AbortSignal = W4.interfaceConverter(AbortSignal);
  W4.converters.RequestInit = W4.dictionaryConverter([{
    key: "method",
    converter: W4.converters.ByteString
  }, {
    key: "headers",
    converter: W4.converters.HeadersInit
  }, {
    key: "body",
    converter: W4.nullableConverter(W4.converters.BodyInit)
  }, {
    key: "referrer",
    converter: W4.converters.USVString
  }, {
    key: "referrerPolicy",
    converter: W4.converters.DOMString,
    allowedValues: qi8
  }, {
    key: "mode",
    converter: W4.converters.DOMString,
    allowedValues: Li8
  }, {
    key: "credentials",
    converter: W4.converters.DOMString,
    allowedValues: Mi8
  }, {
    key: "cache",
    converter: W4.converters.DOMString,
    allowedValues: Oi8
  }, {
    key: "redirect",
    converter: W4.converters.DOMString,
    allowedValues: Ni8
  }, {
    key: "integrity",
    converter: W4.converters.DOMString
  }, {
    key: "keepalive",
    converter: W4.converters.boolean
  }, {
    key: "signal",
    converter: W4.nullableConverter((A) => W4.converters.AbortSignal(A, "RequestInit", "signal", {
      strict: !1
    }))
  }, {
    key: "window",
    converter: W4.converters.any
  }, {
    key: "duplex",
    converter: W4.converters.DOMString,
    allowedValues: Ri8
  }, {
    key: "dispatcher",
    converter: W4.converters.any
  }]);
  K2B.exports = {
    Request: YZ,
    makeRequest: rlA,
    fromInnerRequest: F2B,
    cloneRequest: V2B
  }
})
// @from(Start 4985071, End 5010286)
VzA = z((G_7, T2B) => {
  var {
    makeNetworkError: JG,
    makeAppropriateNetworkError: olA,
    filterResponse: Jv1,
    makeResponse: tlA,
    fromInnerResponse: yi8
  } = WzA(), {
    HeadersList: D2B
  } = no(), {
    Request: xi8,
    cloneRequest: vi8
  } = N3A(), Lc = UA("node:zlib"), {
    bytesMatch: bi8,
    makePolicyContainer: fi8,
    clonePolicyContainer: hi8,
    requestBadPort: gi8,
    TAOCheck: ui8,
    appendRequestOriginHeader: mi8,
    responseLocationURL: di8,
    requestCurrentURL: U_,
    setRequestReferrerPolicyOnRedirect: ci8,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: pi8,
    createOpaqueTimingInfo: Kv1,
    appendFetchMetadata: li8,
    corsCheck: ii8,
    crossOriginResourcePolicyCheck: ni8,
    determineRequestsReferrer: ai8,
    coarsenedSharedCurrentTime: XzA,
    createDeferredPromise: si8,
    isBlobLike: ri8,
    sameOrigin: Fv1,
    isCancelled: ao,
    isAborted: H2B,
    isErrorLike: oi8,
    fullyReadBody: ti8,
    readableStreamClose: ei8,
    isomorphicEncode: elA,
    urlIsLocal: An8,
    urlIsHttpHttpsScheme: Dv1,
    urlHasHttpsScheme: Qn8,
    clampAndCoarsenConnectionTimingInfo: Bn8,
    simpleRangeHeaderValue: Gn8,
    buildContentRange: Zn8,
    createInflate: In8,
    extractMimeType: Yn8
  } = xw(), {
    kState: U2B,
    kDispatcher: Jn8
  } = Kc(), so = UA("node:assert"), {
    safelyExtractBody: Hv1,
    extractBody: C2B
  } = G3A(), {
    redirectStatusSet: $2B,
    nullBodyStatus: w2B,
    safeMethodsSet: Wn8,
    requestBodyHeader: Xn8,
    subresourceSet: Vn8
  } = PEA(), Fn8 = UA("node:events"), {
    Readable: Kn8,
    pipeline: Dn8,
    finished: Hn8
  } = UA("node:stream"), {
    addAbortListener: Cn8,
    isErrored: En8,
    isReadable: AiA,
    bufferToLowerCasedHeaderName: E2B
  } = S6(), {
    dataURLProcessor: zn8,
    serializeAMimeType: Un8,
    minimizeSupportedMimeType: $n8
  } = QU(), {
    getGlobalDispatcher: wn8
  } = flA(), {
    webidl: qn8
  } = zD(), {
    STATUS_CODES: Nn8
  } = UA("node:http"), Ln8 = ["GET", "HEAD"], Mn8 = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici", Wv1;
  class Cv1 extends Fn8 {
    constructor(A) {
      super();
      this.dispatcher = A, this.connection = null, this.dump = !1, this.state = "ongoing"
    }
    terminate(A) {
      if (this.state !== "ongoing") return;
      this.state = "terminated", this.connection?.destroy(A), this.emit("terminated", A)
    }
    abort(A) {
      if (this.state !== "ongoing") return;
      if (this.state = "aborted", !A) A = new DOMException("The operation was aborted.", "AbortError");
      this.serializedAbortReason = A, this.connection?.destroy(A), this.emit("terminated", A)
    }
  }

  function On8(A) {
    q2B(A, "fetch")
  }

  function Rn8(A, Q = void 0) {
    qn8.argumentLengthCheck(arguments, 1, "globalThis.fetch");
    let B = si8(),
      G;
    try {
      G = new xi8(A, Q)
    } catch (V) {
      return B.reject(V), B.promise
    }
    let Z = G[U2B];
    if (G.signal.aborted) return Xv1(B, Z, null, G.signal.reason), B.promise;
    if (Z.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope") Z.serviceWorkers = "none";
    let Y = null,
      J = !1,
      W = null;
    return Cn8(G.signal, () => {
      J = !0, so(W != null), W.abort(G.signal.reason);
      let V = Y?.deref();
      Xv1(B, Z, V, G.signal.reason)
    }), W = L2B({
      request: Z,
      processResponseEndOfBody: On8,
      processResponse: (V) => {
        if (J) return;
        if (V.aborted) {
          Xv1(B, Z, Y, W.serializedAbortReason);
          return
        }
        if (V.type === "error") {
          B.reject(TypeError("fetch failed", {
            cause: V.error
          }));
          return
        }
        Y = new WeakRef(yi8(V, "immutable")), B.resolve(Y.deref()), B = null
      },
      dispatcher: G[Jn8]
    }), B.promise
  }

  function q2B(A, Q = "other") {
    if (A.type === "error" && A.aborted) return;
    if (!A.urlList?.length) return;
    let B = A.urlList[0],
      G = A.timingInfo,
      Z = A.cacheState;
    if (!Dv1(B)) return;
    if (G === null) return;
    if (!A.timingAllowPassed) G = Kv1({
      startTime: G.startTime
    }), Z = "";
    G.endTime = XzA(), A.timingInfo = G, N2B(G, B.href, Q, globalThis, Z)
  }
  var N2B = performance.markResourceTiming;

  function Xv1(A, Q, B, G) {
    if (A) A.reject(G);
    if (Q.body != null && AiA(Q.body?.stream)) Q.body.stream.cancel(G).catch((I) => {
      if (I.code === "ERR_INVALID_STATE") return;
      throw I
    });
    if (B == null) return;
    let Z = B[U2B];
    if (Z.body != null && AiA(Z.body?.stream)) Z.body.stream.cancel(G).catch((I) => {
      if (I.code === "ERR_INVALID_STATE") return;
      throw I
    })
  }

  function L2B({
    request: A,
    processRequestBodyChunkLength: Q,
    processRequestEndOfBody: B,
    processResponse: G,
    processResponseEndOfBody: Z,
    processResponseConsumeBody: I,
    useParallelQueue: Y = !1,
    dispatcher: J = wn8()
  }) {
    so(J);
    let W = null,
      X = !1;
    if (A.client != null) W = A.client.globalObject, X = A.client.crossOriginIsolatedCapability;
    let V = XzA(X),
      F = Kv1({
        startTime: V
      }),
      K = {
        controller: new Cv1(J),
        request: A,
        timingInfo: F,
        processRequestBodyChunkLength: Q,
        processRequestEndOfBody: B,
        processResponse: G,
        processResponseConsumeBody: I,
        processResponseEndOfBody: Z,
        taskDestination: W,
        crossOriginIsolatedCapability: X
      };
    if (so(!A.body || A.body.stream), A.window === "client") A.window = A.client?.globalObject?.constructor?.name === "Window" ? A.client : "no-window";
    if (A.origin === "client") A.origin = A.client.origin;
    if (A.policyContainer === "client")
      if (A.client != null) A.policyContainer = hi8(A.client.policyContainer);
      else A.policyContainer = fi8();
    if (!A.headersList.contains("accept", !0)) A.headersList.append("accept", "*/*", !0);
    if (!A.headersList.contains("accept-language", !0)) A.headersList.append("accept-language", "*", !0);
    if (A.priority === null);
    if (Vn8.has(A.destination));
    return M2B(K).catch((D) => {
      K.controller.terminate(D)
    }), K.controller
  }
  async function M2B(A, Q = !1) {
    let B = A.request,
      G = null;
    if (B.localURLsOnly && !An8(U_(B))) G = JG("local URLs only");
    if (pi8(B), gi8(B) === "blocked") G = JG("bad port");
    if (B.referrerPolicy === "") B.referrerPolicy = B.policyContainer.referrerPolicy;
    if (B.referrer !== "no-referrer") B.referrer = ai8(B);
    if (G === null) G = await (async () => {
      let I = U_(B);
      if (Fv1(I, B.url) && B.responseTainting === "basic" || I.protocol === "data:" || (B.mode === "navigate" || B.mode === "websocket")) return B.responseTainting = "basic", await z2B(A);
      if (B.mode === "same-origin") return JG('request mode cannot be "same-origin"');
      if (B.mode === "no-cors") {
        if (B.redirect !== "follow") return JG('redirect mode cannot be "follow" for "no-cors" request');
        return B.responseTainting = "opaque", await z2B(A)
      }
      if (!Dv1(U_(B))) return JG("URL scheme must be a HTTP(S) scheme");
      return B.responseTainting = "cors", await O2B(A)
    })();
    if (Q) return G;
    if (G.status !== 0 && !G.internalResponse) {
      if (B.responseTainting === "cors");
      if (B.responseTainting === "basic") G = Jv1(G, "basic");
      else if (B.responseTainting === "cors") G = Jv1(G, "cors");
      else if (B.responseTainting === "opaque") G = Jv1(G, "opaque");
      else so(!1)
    }
    let Z = G.status === 0 ? G : G.internalResponse;
    if (Z.urlList.length === 0) Z.urlList.push(...B.urlList);
    if (!B.timingAllowFailed) G.timingAllowPassed = !0;
    if (G.type === "opaque" && Z.status === 206 && Z.rangeRequested && !B.headers.contains("range", !0)) G = Z = JG();
    if (G.status !== 0 && (B.method === "HEAD" || B.method === "CONNECT" || w2B.includes(Z.status))) Z.body = null, A.controller.dump = !0;
    if (B.integrity) {
      let I = (J) => Vv1(A, JG(J));
      if (B.responseTainting === "opaque" || G.body == null) {
        I(G.error);
        return
      }
      let Y = (J) => {
        if (!bi8(J, B.integrity)) {
          I("integrity mismatch");
          return
        }
        G.body = Hv1(J)[0], Vv1(A, G)
      };
      await ti8(G.body, Y, I)
    } else Vv1(A, G)
  }

  function z2B(A) {
    if (ao(A) && A.request.redirectCount === 0) return Promise.resolve(olA(A));
    let {
      request: Q
    } = A, {
      protocol: B
    } = U_(Q);
    switch (B) {
      case "about:":
        return Promise.resolve(JG("about scheme is not supported"));
      case "blob:": {
        if (!Wv1) Wv1 = UA("node:buffer").resolveObjectURL;
        let G = U_(Q);
        if (G.search.length !== 0) return Promise.resolve(JG("NetworkError when attempting to fetch resource."));
        let Z = Wv1(G.toString());
        if (Q.method !== "GET" || !ri8(Z)) return Promise.resolve(JG("invalid method"));
        let I = tlA(),
          Y = Z.size,
          J = elA(`${Y}`),
          W = Z.type;
        if (!Q.headersList.contains("range", !0)) {
          let X = C2B(Z);
          I.statusText = "OK", I.body = X[0], I.headersList.set("content-length", J, !0), I.headersList.set("content-type", W, !0)
        } else {
          I.rangeRequested = !0;
          let X = Q.headersList.get("range", !0),
            V = Gn8(X, !0);
          if (V === "failure") return Promise.resolve(JG("failed to fetch the data URL"));
          let {
            rangeStartValue: F,
            rangeEndValue: K
          } = V;
          if (F === null) F = Y - K, K = F + K - 1;
          else {
            if (F >= Y) return Promise.resolve(JG("Range start is greater than the blob's size."));
            if (K === null || K >= Y) K = Y - 1
          }
          let D = Z.slice(F, K, W),
            H = C2B(D);
          I.body = H[0];
          let C = elA(`${D.size}`),
            E = Zn8(F, K, Y);
          I.status = 206, I.statusText = "Partial Content", I.headersList.set("content-length", C, !0), I.headersList.set("content-type", W, !0), I.headersList.set("content-range", E, !0)
        }
        return Promise.resolve(I)
      }
      case "data:": {
        let G = U_(Q),
          Z = zn8(G);
        if (Z === "failure") return Promise.resolve(JG("failed to fetch the data URL"));
        let I = Un8(Z.mimeType);
        return Promise.resolve(tlA({
          statusText: "OK",
          headersList: [
            ["content-type", {
              name: "Content-Type",
              value: I
            }]
          ],
          body: Hv1(Z.body)[0]
        }))
      }
      case "file:":
        return Promise.resolve(JG("not implemented... yet..."));
      case "http:":
      case "https:":
        return O2B(A).catch((G) => JG(G));
      default:
        return Promise.resolve(JG("unknown scheme"))
    }
  }

  function Tn8(A, Q) {
    if (A.request.done = !0, A.processResponseDone != null) queueMicrotask(() => A.processResponseDone(Q))
  }

  function Vv1(A, Q) {
    let B = A.timingInfo,
      G = () => {
        let I = Date.now();
        if (A.request.destination === "document") A.controller.fullTimingInfo = B;
        A.controller.reportTimingSteps = () => {
          if (A.request.url.protocol !== "https:") return;
          B.endTime = I;
          let {
            cacheState: J,
            bodyInfo: W
          } = Q;
          if (!Q.timingAllowPassed) B = Kv1(B), J = "";
          let X = 0;
          if (A.request.mode !== "navigator" || !Q.hasCrossOriginRedirects) {
            X = Q.status;
            let V = Yn8(Q.headersList);
            if (V !== "failure") W.contentType = $n8(V)
          }
          if (A.request.initiatorType != null) N2B(B, A.request.url.href, A.request.initiatorType, globalThis, J, W, X)
        };
        let Y = () => {
          if (A.request.done = !0, A.processResponseEndOfBody != null) queueMicrotask(() => A.processResponseEndOfBody(Q));
          if (A.request.initiatorType != null) A.controller.reportTimingSteps()
        };
        queueMicrotask(() => Y())
      };
    if (A.processResponse != null) queueMicrotask(() => {
      A.processResponse(Q), A.processResponse = null
    });
    let Z = Q.type === "error" ? Q : Q.internalResponse ?? Q;
    if (Z.body == null) G();
    else Hn8(Z.body.stream, () => {
      G()
    })
  }
  async function O2B(A) {
    let Q = A.request,
      B = null,
      G = null,
      Z = A.timingInfo;
    if (Q.serviceWorkers === "all");
    if (B === null) {
      if (Q.redirect === "follow") Q.serviceWorkers = "none";
      if (G = B = await R2B(A), Q.responseTainting === "cors" && ii8(Q, B) === "failure") return JG("cors failure");
      if (ui8(Q, B) === "failure") Q.timingAllowFailed = !0
    }
    if ((Q.responseTainting === "opaque" || B.type === "opaque") && ni8(Q.origin, Q.client, Q.destination, G) === "blocked") return JG("blocked");
    if ($2B.has(G.status)) {
      if (Q.redirect !== "manual") A.controller.connection.destroy(void 0, !1);
      if (Q.redirect === "error") B = JG("unexpected redirect");
      else if (Q.redirect === "manual") B = G;
      else if (Q.redirect === "follow") B = await Pn8(A, B);
      else so(!1)
    }
    return B.timingInfo = Z, B
  }

  function Pn8(A, Q) {
    let B = A.request,
      G = Q.internalResponse ? Q.internalResponse : Q,
      Z;
    try {
      if (Z = di8(G, U_(B).hash), Z == null) return Q
    } catch (Y) {
      return Promise.resolve(JG(Y))
    }
    if (!Dv1(Z)) return Promise.resolve(JG("URL scheme must be a HTTP(S) scheme"));
    if (B.redirectCount === 20) return Promise.resolve(JG("redirect count exceeded"));
    if (B.redirectCount += 1, B.mode === "cors" && (Z.username || Z.password) && !Fv1(B, Z)) return Promise.resolve(JG('cross origin not allowed for request mode "cors"'));
    if (B.responseTainting === "cors" && (Z.username || Z.password)) return Promise.resolve(JG('URL cannot contain credentials for request mode "cors"'));
    if (G.status !== 303 && B.body != null && B.body.source == null) return Promise.resolve(JG());
    if ([301, 302].includes(G.status) && B.method === "POST" || G.status === 303 && !Ln8.includes(B.method)) {
      B.method = "GET", B.body = null;
      for (let Y of Xn8) B.headersList.delete(Y)
    }
    if (!Fv1(U_(B), Z)) B.headersList.delete("authorization", !0), B.headersList.delete("proxy-authorization", !0), B.headersList.delete("cookie", !0), B.headersList.delete("host", !0);
    if (B.body != null) so(B.body.source != null), B.body = Hv1(B.body.source)[0];
    let I = A.timingInfo;
    if (I.redirectEndTime = I.postRedirectStartTime = XzA(A.crossOriginIsolatedCapability), I.redirectStartTime === 0) I.redirectStartTime = I.startTime;
    return B.urlList.push(Z), ci8(B, G), M2B(A, !0)
  }
  async function R2B(A, Q = !1, B = !1) {
    let G = A.request,
      Z = null,
      I = null,
      Y = null,
      J = null,
      W = !1;
    if (G.window === "no-window" && G.redirect === "error") Z = A, I = G;
    else I = vi8(G), Z = {
      ...A
    }, Z.request = I;
    let X = G.credentials === "include" || G.credentials === "same-origin" && G.responseTainting === "basic",
      V = I.body ? I.body.length : null,
      F = null;
    if (I.body == null && ["POST", "PUT"].includes(I.method)) F = "0";
    if (V != null) F = elA(`${V}`);
    if (F != null) I.headersList.append("content-length", F, !0);
    if (V != null && I.keepalive);
    if (I.referrer instanceof URL) I.headersList.append("referer", elA(I.referrer.href), !0);
    if (mi8(I), li8(I), !I.headersList.contains("user-agent", !0)) I.headersList.append("user-agent", Mn8);
    if (I.cache === "default" && (I.headersList.contains("if-modified-since", !0) || I.headersList.contains("if-none-match", !0) || I.headersList.contains("if-unmodified-since", !0) || I.headersList.contains("if-match", !0) || I.headersList.contains("if-range", !0))) I.cache = "no-store";
    if (I.cache === "no-cache" && !I.preventNoCacheCacheControlHeaderModification && !I.headersList.contains("cache-control", !0)) I.headersList.append("cache-control", "max-age=0", !0);
    if (I.cache === "no-store" || I.cache === "reload") {
      if (!I.headersList.contains("pragma", !0)) I.headersList.append("pragma", "no-cache", !0);
      if (!I.headersList.contains("cache-control", !0)) I.headersList.append("cache-control", "no-cache", !0)
    }
    if (I.headersList.contains("range", !0)) I.headersList.append("accept-encoding", "identity", !0);
    if (!I.headersList.contains("accept-encoding", !0))
      if (Qn8(U_(I))) I.headersList.append("accept-encoding", "br, gzip, deflate", !0);
      else I.headersList.append("accept-encoding", "gzip, deflate", !0);
    if (I.headersList.delete("host", !0), J == null) I.cache = "no-store";
    if (I.cache !== "no-store" && I.cache !== "reload");
    if (Y == null) {
      if (I.cache === "only-if-cached") return JG("only if cached");
      let K = await jn8(Z, X, B);
      if (!Wn8.has(I.method) && K.status >= 200 && K.status <= 399);
      if (W && K.status === 304);
      if (Y == null) Y = K
    }
    if (Y.urlList = [...I.urlList], I.headersList.contains("range", !0)) Y.rangeRequested = !0;
    if (Y.requestIncludesCredentials = X, Y.status === 407) {
      if (G.window === "no-window") return JG();
      if (ao(A)) return olA(A);
      return JG("proxy authentication required")
    }
    if (Y.status === 421 && !B && (G.body == null || G.body.source != null)) {
      if (ao(A)) return olA(A);
      A.controller.connection.destroy(), Y = await R2B(A, Q, !0)
    }
    return Y
  }
  async function jn8(A, Q = !1, B = !1) {
    so(!A.controller.connection || A.controller.connection.destroyed), A.controller.connection = {
      abort: null,
      destroyed: !1,
      destroy(H, C = !0) {
        if (!this.destroyed) {
          if (this.destroyed = !0, C) this.abort?.(H ?? new DOMException("The operation was aborted.", "AbortError"))
        }
      }
    };
    let G = A.request,
      Z = null,
      I = A.timingInfo;
    if (!0) G.cache = "no-store";
    let J = B ? "yes" : "no";
    if (G.mode === "websocket");
    let W = null;
    if (G.body == null && A.processRequestEndOfBody) queueMicrotask(() => A.processRequestEndOfBody());
    else if (G.body != null) {
      let H = async function*(U) {
        if (ao(A)) return;
        yield U, A.processRequestBodyChunkLength?.(U.byteLength)
      }, C = () => {
        if (ao(A)) return;
        if (A.processRequestEndOfBody) A.processRequestEndOfBody()
      }, E = (U) => {
        if (ao(A)) return;
        if (U.name === "AbortError") A.controller.abort();
        else A.controller.terminate(U)
      };
      W = async function*() {
        try {
          for await (let U of G.body.stream) yield* H(U);
          C()
        } catch (U) {
          E(U)
        }
      }()
    }
    try {
      let {
        body: H,
        status: C,
        statusText: E,
        headersList: U,
        socket: q
      } = await D({
        body: W
      });
      if (q) Z = tlA({
        status: C,
        statusText: E,
        headersList: U,
        socket: q
      });
      else {
        let w = H[Symbol.asyncIterator]();
        A.controller.next = () => w.next(), Z = tlA({
          status: C,
          statusText: E,
          headersList: U
        })
      }
    } catch (H) {
      if (H.name === "AbortError") return A.controller.connection.destroy(), olA(A, H);
      return JG(H)
    }
    let X = async () => {
      await A.controller.resume()
    }, V = (H) => {
      if (!ao(A)) A.controller.abort(H)
    }, F = new ReadableStream({
      async start(H) {
        A.controller.controller = H
      },
      async pull(H) {
        await X(H)
      },
      async cancel(H) {
        await V(H)
      },
      type: "bytes"
    });
    Z.body = {
      stream: F,
      source: null,
      length: null
    }, A.controller.onAborted = K, A.controller.on("terminated", K), A.controller.resume = async () => {
      while (!0) {
        let H, C;
        try {
          let {
            done: U,
            value: q
          } = await A.controller.next();
          if (H2B(A)) break;
          H = U ? void 0 : q
        } catch (U) {
          if (A.controller.ended && !I.encodedBodySize) H = void 0;
          else H = U, C = !0
        }
        if (H === void 0) {
          ei8(A.controller.controller), Tn8(A, Z);
          return
        }
        if (I.decodedBodySize += H?.byteLength ?? 0, C) {
          A.controller.terminate(H);
          return
        }
        let E = new Uint8Array(H);
        if (E.byteLength) A.controller.controller.enqueue(E);
        if (En8(F)) {
          A.controller.terminate();
          return
        }
        if (A.controller.controller.desiredSize <= 0) return
      }
    };

    function K(H) {
      if (H2B(A)) {
        if (Z.aborted = !0, AiA(F)) A.controller.controller.error(A.controller.serializedAbortReason)
      } else if (AiA(F)) A.controller.controller.error(TypeError("terminated", {
        cause: oi8(H) ? H : void 0
      }));
      A.controller.connection.destroy()
    }
    return Z;

    function D({
      body: H
    }) {
      let C = U_(G),
        E = A.controller.dispatcher;
      return new Promise((U, q) => E.dispatch({
        path: C.pathname + C.search,
        origin: C.origin,
        method: G.method,
        body: E.isMockActive ? G.body && (G.body.source || G.body.stream) : H,
        headers: G.headersList.entries,
        maxRedirections: 0,
        upgrade: G.mode === "websocket" ? "websocket" : void 0
      }, {
        body: null,
        abort: null,
        onConnect(w) {
          let {
            connection: N
          } = A.controller;
          if (I.finalConnectionTimingInfo = Bn8(void 0, I.postRedirectStartTime, A.crossOriginIsolatedCapability), N.destroyed) w(new DOMException("The operation was aborted.", "AbortError"));
          else A.controller.on("terminated", w), this.abort = N.abort = w;
          I.finalNetworkRequestStartTime = XzA(A.crossOriginIsolatedCapability)
        },
        onResponseStarted() {
          I.finalNetworkResponseStartTime = XzA(A.crossOriginIsolatedCapability)
        },
        onHeaders(w, N, R, T) {
          if (w < 200) return;
          let y = [],
            v = "",
            x = new D2B;
          for (let k = 0; k < N.length; k += 2) x.append(E2B(N[k]), N[k + 1].toString("latin1"), !0);
          let p = x.get("content-encoding", !0);
          if (p) y = p.toLowerCase().split(",").map((k) => k.trim());
          v = x.get("location", !0), this.body = new Kn8({
            read: R
          });
          let u = [],
            e = v && G.redirect === "follow" && $2B.has(w);
          if (y.length !== 0 && G.method !== "HEAD" && G.method !== "CONNECT" && !w2B.includes(w) && !e)
            for (let k = y.length - 1; k >= 0; --k) {
              let m = y[k];
              if (m === "x-gzip" || m === "gzip") u.push(Lc.createGunzip({
                flush: Lc.constants.Z_SYNC_FLUSH,
                finishFlush: Lc.constants.Z_SYNC_FLUSH
              }));
              else if (m === "deflate") u.push(In8({
                flush: Lc.constants.Z_SYNC_FLUSH,
                finishFlush: Lc.constants.Z_SYNC_FLUSH
              }));
              else if (m === "br") u.push(Lc.createBrotliDecompress({
                flush: Lc.constants.BROTLI_OPERATION_FLUSH,
                finishFlush: Lc.constants.BROTLI_OPERATION_FLUSH
              }));
              else {
                u.length = 0;
                break
              }
            }
          let l = this.onError.bind(this);
          return U({
            status: w,
            statusText: T,
            headersList: x,
            body: u.length ? Dn8(this.body, ...u, (k) => {
              if (k) this.onError(k)
            }).on("error", l) : this.body.on("error", l)
          }), !0
        },
        onData(w) {
          if (A.controller.dump) return;
          let N = w;
          return I.encodedBodySize += N.byteLength, this.body.push(N)
        },
        onComplete() {
          if (this.abort) A.controller.off("terminated", this.abort);
          if (A.controller.onAborted) A.controller.off("terminated", A.controller.onAborted);
          A.controller.ended = !0, this.body.push(null)
        },
        onError(w) {
          if (this.abort) A.controller.off("terminated", this.abort);
          this.body?.destroy(w), A.controller.terminate(w), q(w)
        },
        onUpgrade(w, N, R) {
          if (w !== 101) return;
          let T = new D2B;
          for (let y = 0; y < N.length; y += 2) T.append(E2B(N[y]), N[y + 1].toString("latin1"), !0);
          return U({
            status: w,
            statusText: Nn8[w],
            headersList: T,
            socket: R
          }), !0
        }
      }))
    }
  }
  T2B.exports = {
    fetch: Rn8,
    Fetch: Cv1,
    fetching: L2B,
    finalizeAndReportTiming: q2B
  }
})
// @from(Start 5010292, End 5010634)
Ev1 = z((Z_7, P2B) => {
  P2B.exports = {
    kState: Symbol("FileReader state"),
    kResult: Symbol("FileReader result"),
    kError: Symbol("FileReader error"),
    kLastProgressEventFired: Symbol("FileReader last progress event fired timestamp"),
    kEvents: Symbol("FileReader events"),
    kAborted: Symbol("FileReader aborted")
  }
})
// @from(Start 5010640, End 5012024)
S2B = z((I_7, j2B) => {
  var {
    webidl: uw
  } = zD(), QiA = Symbol("ProgressEvent state");
  class FzA extends Event {
    constructor(A, Q = {}) {
      A = uw.converters.DOMString(A, "ProgressEvent constructor", "type"), Q = uw.converters.ProgressEventInit(Q ?? {});
      super(A, Q);
      this[QiA] = {
        lengthComputable: Q.lengthComputable,
        loaded: Q.loaded,
        total: Q.total
      }
    }
    get lengthComputable() {
      return uw.brandCheck(this, FzA), this[QiA].lengthComputable
    }
    get loaded() {
      return uw.brandCheck(this, FzA), this[QiA].loaded
    }
    get total() {
      return uw.brandCheck(this, FzA), this[QiA].total
    }
  }
  uw.converters.ProgressEventInit = uw.dictionaryConverter([{
    key: "lengthComputable",
    converter: uw.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "loaded",
    converter: uw.converters["unsigned long long"],
    defaultValue: () => 0
  }, {
    key: "total",
    converter: uw.converters["unsigned long long"],
    defaultValue: () => 0
  }, {
    key: "bubbles",
    converter: uw.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "cancelable",
    converter: uw.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "composed",
    converter: uw.converters.boolean,
    defaultValue: () => !1
  }]);
  j2B.exports = {
    ProgressEvent: FzA
  }
})
// @from(Start 5012030, End 5018872)
k2B = z((Y_7, _2B) => {
  function Sn8(A) {
    if (!A) return "failure";
    switch (A.trim().toLowerCase()) {
      case "unicode-1-1-utf-8":
      case "unicode11utf8":
      case "unicode20utf8":
      case "utf-8":
      case "utf8":
      case "x-unicode20utf8":
        return "UTF-8";
      case "866":
      case "cp866":
      case "csibm866":
      case "ibm866":
        return "IBM866";
      case "csisolatin2":
      case "iso-8859-2":
      case "iso-ir-101":
      case "iso8859-2":
      case "iso88592":
      case "iso_8859-2":
      case "iso_8859-2:1987":
      case "l2":
      case "latin2":
        return "ISO-8859-2";
      case "csisolatin3":
      case "iso-8859-3":
      case "iso-ir-109":
      case "iso8859-3":
      case "iso88593":
      case "iso_8859-3":
      case "iso_8859-3:1988":
      case "l3":
      case "latin3":
        return "ISO-8859-3";
      case "csisolatin4":
      case "iso-8859-4":
      case "iso-ir-110":
      case "iso8859-4":
      case "iso88594":
      case "iso_8859-4":
      case "iso_8859-4:1988":
      case "l4":
      case "latin4":
        return "ISO-8859-4";
      case "csisolatincyrillic":
      case "cyrillic":
      case "iso-8859-5":
      case "iso-ir-144":
      case "iso8859-5":
      case "iso88595":
      case "iso_8859-5":
      case "iso_8859-5:1988":
        return "ISO-8859-5";
      case "arabic":
      case "asmo-708":
      case "csiso88596e":
      case "csiso88596i":
      case "csisolatinarabic":
      case "ecma-114":
      case "iso-8859-6":
      case "iso-8859-6-e":
      case "iso-8859-6-i":
      case "iso-ir-127":
      case "iso8859-6":
      case "iso88596":
      case "iso_8859-6":
      case "iso_8859-6:1987":
        return "ISO-8859-6";
      case "csisolatingreek":
      case "ecma-118":
      case "elot_928":
      case "greek":
      case "greek8":
      case "iso-8859-7":
      case "iso-ir-126":
      case "iso8859-7":
      case "iso88597":
      case "iso_8859-7":
      case "iso_8859-7:1987":
      case "sun_eu_greek":
        return "ISO-8859-7";
      case "csiso88598e":
      case "csisolatinhebrew":
      case "hebrew":
      case "iso-8859-8":
      case "iso-8859-8-e":
      case "iso-ir-138":
      case "iso8859-8":
      case "iso88598":
      case "iso_8859-8":
      case "iso_8859-8:1988":
      case "visual":
        return "ISO-8859-8";
      case "csiso88598i":
      case "iso-8859-8-i":
      case "logical":
        return "ISO-8859-8-I";
      case "csisolatin6":
      case "iso-8859-10":
      case "iso-ir-157":
      case "iso8859-10":
      case "iso885910":
      case "l6":
      case "latin6":
        return "ISO-8859-10";
      case "iso-8859-13":
      case "iso8859-13":
      case "iso885913":
        return "ISO-8859-13";
      case "iso-8859-14":
      case "iso8859-14":
      case "iso885914":
        return "ISO-8859-14";
      case "csisolatin9":
      case "iso-8859-15":
      case "iso8859-15":
      case "iso885915":
      case "iso_8859-15":
      case "l9":
        return "ISO-8859-15";
      case "iso-8859-16":
        return "ISO-8859-16";
      case "cskoi8r":
      case "koi":
      case "koi8":
      case "koi8-r":
      case "koi8_r":
        return "KOI8-R";
      case "koi8-ru":
      case "koi8-u":
        return "KOI8-U";
      case "csmacintosh":
      case "mac":
      case "macintosh":
      case "x-mac-roman":
        return "macintosh";
      case "iso-8859-11":
      case "iso8859-11":
      case "iso885911":
      case "tis-620":
      case "windows-874":
        return "windows-874";
      case "cp1250":
      case "windows-1250":
      case "x-cp1250":
        return "windows-1250";
      case "cp1251":
      case "windows-1251":
      case "x-cp1251":
        return "windows-1251";
      case "ansi_x3.4-1968":
      case "ascii":
      case "cp1252":
      case "cp819":
      case "csisolatin1":
      case "ibm819":
      case "iso-8859-1":
      case "iso-ir-100":
      case "iso8859-1":
      case "iso88591":
      case "iso_8859-1":
      case "iso_8859-1:1987":
      case "l1":
      case "latin1":
      case "us-ascii":
      case "windows-1252":
      case "x-cp1252":
        return "windows-1252";
      case "cp1253":
      case "windows-1253":
      case "x-cp1253":
        return "windows-1253";
      case "cp1254":
      case "csisolatin5":
      case "iso-8859-9":
      case "iso-ir-148":
      case "iso8859-9":
      case "iso88599":
      case "iso_8859-9":
      case "iso_8859-9:1989":
      case "l5":
      case "latin5":
      case "windows-1254":
      case "x-cp1254":
        return "windows-1254";
      case "cp1255":
      case "windows-1255":
      case "x-cp1255":
        return "windows-1255";
      case "cp1256":
      case "windows-1256":
      case "x-cp1256":
        return "windows-1256";
      case "cp1257":
      case "windows-1257":
      case "x-cp1257":
        return "windows-1257";
      case "cp1258":
      case "windows-1258":
      case "x-cp1258":
        return "windows-1258";
      case "x-mac-cyrillic":
      case "x-mac-ukrainian":
        return "x-mac-cyrillic";
      case "chinese":
      case "csgb2312":
      case "csiso58gb231280":
      case "gb2312":
      case "gb_2312":
      case "gb_2312-80":
      case "gbk":
      case "iso-ir-58":
      case "x-gbk":
        return "GBK";
      case "gb18030":
        return "gb18030";
      case "big5":
      case "big5-hkscs":
      case "cn-big5":
      case "csbig5":
      case "x-x-big5":
        return "Big5";
      case "cseucpkdfmtjapanese":
      case "euc-jp":
      case "x-euc-jp":
        return "EUC-JP";
      case "csiso2022jp":
      case "iso-2022-jp":
        return "ISO-2022-JP";
      case "csshiftjis":
      case "ms932":
      case "ms_kanji":
      case "shift-jis":
      case "shift_jis":
      case "sjis":
      case "windows-31j":
      case "x-sjis":
        return "Shift_JIS";
      case "cseuckr":
      case "csksc56011987":
      case "euc-kr":
      case "iso-ir-149":
      case "korean":
      case "ks_c_5601-1987":
      case "ks_c_5601-1989":
      case "ksc5601":
      case "ksc_5601":
      case "windows-949":
        return "EUC-KR";
      case "csiso2022kr":
      case "hz-gb-2312":
      case "iso-2022-cn":
      case "iso-2022-cn-ext":
      case "iso-2022-kr":
      case "replacement":
        return "replacement";
      case "unicodefffe":
      case "utf-16be":
        return "UTF-16BE";
      case "csunicode":
      case "iso-10646-ucs-2":
      case "ucs-2":
      case "unicode":
      case "unicodefeff":
      case "utf-16":
      case "utf-16le":
        return "UTF-16LE";
      case "x-user-defined":
        return "x-user-defined";
      default:
        return "failure"
    }
  }
  _2B.exports = {
    getEncoding: Sn8
  }
})
// @from(Start 5018878, End 5022460)
u2B = z((J_7, g2B) => {
  var {
    kState: L3A,
    kError: zv1,
    kResult: y2B,
    kAborted: KzA,
    kLastProgressEventFired: Uv1
  } = Ev1(), {
    ProgressEvent: _n8
  } = S2B(), {
    getEncoding: x2B
  } = k2B(), {
    serializeAMimeType: kn8,
    parseMIMEType: v2B
  } = QU(), {
    types: yn8
  } = UA("node:util"), {
    StringDecoder: b2B
  } = UA("string_decoder"), {
    btoa: f2B
  } = UA("node:buffer"), xn8 = {
    enumerable: !0,
    writable: !1,
    configurable: !1
  };

  function vn8(A, Q, B, G) {
    if (A[L3A] === "loading") throw new DOMException("Invalid state", "InvalidStateError");
    A[L3A] = "loading", A[y2B] = null, A[zv1] = null;
    let I = Q.stream().getReader(),
      Y = [],
      J = I.read(),
      W = !0;
    (async () => {
      while (!A[KzA]) try {
        let {
          done: X,
          value: V
        } = await J;
        if (W && !A[KzA]) queueMicrotask(() => {
          Mc("loadstart", A)
        });
        if (W = !1, !X && yn8.isUint8Array(V)) {
          if (Y.push(V), (A[Uv1] === void 0 || Date.now() - A[Uv1] >= 50) && !A[KzA]) A[Uv1] = Date.now(), queueMicrotask(() => {
            Mc("progress", A)
          });
          J = I.read()
        } else if (X) {
          queueMicrotask(() => {
            A[L3A] = "done";
            try {
              let F = bn8(Y, B, Q.type, G);
              if (A[KzA]) return;
              A[y2B] = F, Mc("load", A)
            } catch (F) {
              A[zv1] = F, Mc("error", A)
            }
            if (A[L3A] !== "loading") Mc("loadend", A)
          });
          break
        }
      } catch (X) {
        if (A[KzA]) return;
        queueMicrotask(() => {
          if (A[L3A] = "done", A[zv1] = X, Mc("error", A), A[L3A] !== "loading") Mc("loadend", A)
        });
        break
      }
    })()
  }

  function Mc(A, Q) {
    let B = new _n8(A, {
      bubbles: !1,
      cancelable: !1
    });
    Q.dispatchEvent(B)
  }

  function bn8(A, Q, B, G) {
    switch (Q) {
      case "DataURL": {
        let Z = "data:",
          I = v2B(B || "application/octet-stream");
        if (I !== "failure") Z += kn8(I);
        Z += ";base64,";
        let Y = new b2B("latin1");
        for (let J of A) Z += f2B(Y.write(J));
        return Z += f2B(Y.end()), Z
      }
      case "Text": {
        let Z = "failure";
        if (G) Z = x2B(G);
        if (Z === "failure" && B) {
          let I = v2B(B);
          if (I !== "failure") Z = x2B(I.parameters.get("charset"))
        }
        if (Z === "failure") Z = "UTF-8";
        return fn8(A, Z)
      }
      case "ArrayBuffer":
        return h2B(A).buffer;
      case "BinaryString": {
        let Z = "",
          I = new b2B("latin1");
        for (let Y of A) Z += I.write(Y);
        return Z += I.end(), Z
      }
    }
  }

  function fn8(A, Q) {
    let B = h2B(A),
      G = hn8(B),
      Z = 0;
    if (G !== null) Q = G, Z = G === "UTF-8" ? 3 : 2;
    let I = B.slice(Z);
    return new TextDecoder(Q).decode(I)
  }

  function hn8(A) {
    let [Q, B, G] = A;
    if (Q === 239 && B === 187 && G === 191) return "UTF-8";
    else if (Q === 254 && B === 255) return "UTF-16BE";
    else if (Q === 255 && B === 254) return "UTF-16LE";
    return null
  }

  function h2B(A) {
    let Q = A.reduce((G, Z) => {
        return G + Z.byteLength
      }, 0),
      B = 0;
    return A.reduce((G, Z) => {
      return G.set(Z, B), B += Z.byteLength, G
    }, new Uint8Array(Q))
  }
  g2B.exports = {
    staticPropertyDescriptors: xn8,
    readOperation: vn8,
    fireAProgressEvent: Mc
  }
})
// @from(Start 5022466, End 5027495)
p2B = z((W_7, c2B) => {
  var {
    staticPropertyDescriptors: M3A,
    readOperation: BiA,
    fireAProgressEvent: m2B
  } = u2B(), {
    kState: ro,
    kError: d2B,
    kResult: GiA,
    kEvents: T7,
    kAborted: gn8
  } = Ev1(), {
    webidl: _G
  } = zD(), {
    kEnumerableProperty: ZU
  } = S6();
  class WG extends EventTarget {
    constructor() {
      super();
      this[ro] = "empty", this[GiA] = null, this[d2B] = null, this[T7] = {
        loadend: null,
        error: null,
        abort: null,
        load: null,
        progress: null,
        loadstart: null
      }
    }
    readAsArrayBuffer(A) {
      _G.brandCheck(this, WG), _G.argumentLengthCheck(arguments, 1, "FileReader.readAsArrayBuffer"), A = _G.converters.Blob(A, {
        strict: !1
      }), BiA(this, A, "ArrayBuffer")
    }
    readAsBinaryString(A) {
      _G.brandCheck(this, WG), _G.argumentLengthCheck(arguments, 1, "FileReader.readAsBinaryString"), A = _G.converters.Blob(A, {
        strict: !1
      }), BiA(this, A, "BinaryString")
    }
    readAsText(A, Q = void 0) {
      if (_G.brandCheck(this, WG), _G.argumentLengthCheck(arguments, 1, "FileReader.readAsText"), A = _G.converters.Blob(A, {
          strict: !1
        }), Q !== void 0) Q = _G.converters.DOMString(Q, "FileReader.readAsText", "encoding");
      BiA(this, A, "Text", Q)
    }
    readAsDataURL(A) {
      _G.brandCheck(this, WG), _G.argumentLengthCheck(arguments, 1, "FileReader.readAsDataURL"), A = _G.converters.Blob(A, {
        strict: !1
      }), BiA(this, A, "DataURL")
    }
    abort() {
      if (this[ro] === "empty" || this[ro] === "done") {
        this[GiA] = null;
        return
      }
      if (this[ro] === "loading") this[ro] = "done", this[GiA] = null;
      if (this[gn8] = !0, m2B("abort", this), this[ro] !== "loading") m2B("loadend", this)
    }
    get readyState() {
      switch (_G.brandCheck(this, WG), this[ro]) {
        case "empty":
          return this.EMPTY;
        case "loading":
          return this.LOADING;
        case "done":
          return this.DONE
      }
    }
    get result() {
      return _G.brandCheck(this, WG), this[GiA]
    }
    get error() {
      return _G.brandCheck(this, WG), this[d2B]
    }
    get onloadend() {
      return _G.brandCheck(this, WG), this[T7].loadend
    }
    set onloadend(A) {
      if (_G.brandCheck(this, WG), this[T7].loadend) this.removeEventListener("loadend", this[T7].loadend);
      if (typeof A === "function") this[T7].loadend = A, this.addEventListener("loadend", A);
      else this[T7].loadend = null
    }
    get onerror() {
      return _G.brandCheck(this, WG), this[T7].error
    }
    set onerror(A) {
      if (_G.brandCheck(this, WG), this[T7].error) this.removeEventListener("error", this[T7].error);
      if (typeof A === "function") this[T7].error = A, this.addEventListener("error", A);
      else this[T7].error = null
    }
    get onloadstart() {
      return _G.brandCheck(this, WG), this[T7].loadstart
    }
    set onloadstart(A) {
      if (_G.brandCheck(this, WG), this[T7].loadstart) this.removeEventListener("loadstart", this[T7].loadstart);
      if (typeof A === "function") this[T7].loadstart = A, this.addEventListener("loadstart", A);
      else this[T7].loadstart = null
    }
    get onprogress() {
      return _G.brandCheck(this, WG), this[T7].progress
    }
    set onprogress(A) {
      if (_G.brandCheck(this, WG), this[T7].progress) this.removeEventListener("progress", this[T7].progress);
      if (typeof A === "function") this[T7].progress = A, this.addEventListener("progress", A);
      else this[T7].progress = null
    }
    get onload() {
      return _G.brandCheck(this, WG), this[T7].load
    }
    set onload(A) {
      if (_G.brandCheck(this, WG), this[T7].load) this.removeEventListener("load", this[T7].load);
      if (typeof A === "function") this[T7].load = A, this.addEventListener("load", A);
      else this[T7].load = null
    }
    get onabort() {
      return _G.brandCheck(this, WG), this[T7].abort
    }
    set onabort(A) {
      if (_G.brandCheck(this, WG), this[T7].abort) this.removeEventListener("abort", this[T7].abort);
      if (typeof A === "function") this[T7].abort = A, this.addEventListener("abort", A);
      else this[T7].abort = null
    }
  }
  WG.EMPTY = WG.prototype.EMPTY = 0;
  WG.LOADING = WG.prototype.LOADING = 1;
  WG.DONE = WG.prototype.DONE = 2;
  Object.defineProperties(WG.prototype, {
    EMPTY: M3A,
    LOADING: M3A,
    DONE: M3A,
    readAsArrayBuffer: ZU,
    readAsBinaryString: ZU,
    readAsText: ZU,
    readAsDataURL: ZU,
    abort: ZU,
    readyState: ZU,
    result: ZU,
    error: ZU,
    onloadstart: ZU,
    onprogress: ZU,
    onload: ZU,
    onabort: ZU,
    onerror: ZU,
    onloadend: ZU,
    [Symbol.toStringTag]: {
      value: "FileReader",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  });
  Object.defineProperties(WG, {
    EMPTY: M3A,
    LOADING: M3A,
    DONE: M3A
  });
  c2B.exports = {
    FileReader: WG
  }
})
// @from(Start 5027501, End 5027581)
ZiA = z((X_7, l2B) => {
  l2B.exports = {
    kConstruct: tI().kConstruct
  }
})
// @from(Start 5027587, End 5028053)
a2B = z((V_7, n2B) => {
  var un8 = UA("node:assert"),
    {
      URLSerializer: i2B
    } = QU(),
    {
      isValidHeaderName: mn8
    } = xw();

  function dn8(A, Q, B = !1) {
    let G = i2B(A, B),
      Z = i2B(Q, B);
    return G === Z
  }

  function cn8(A) {
    un8(A !== null);
    let Q = [];
    for (let B of A.split(","))
      if (B = B.trim(), mn8(B)) Q.push(B);
    return Q
  }
  n2B.exports = {
    urlEquals: dn8,
    getFieldValues: cn8
  }
})
// @from(Start 5028059, End 5039802)
o2B = z((F_7, r2B) => {
  var {
    kConstruct: pn8
  } = ZiA(), {
    urlEquals: ln8,
    getFieldValues: $v1
  } = a2B(), {
    kEnumerableProperty: oo,
    isDisturbed: in8
  } = S6(), {
    webidl: T9
  } = zD(), {
    Response: nn8,
    cloneResponse: an8,
    fromInnerResponse: sn8
  } = WzA(), {
    Request: yb,
    fromInnerRequest: rn8
  } = N3A(), {
    kState: WT
  } = Kc(), {
    fetching: on8
  } = VzA(), {
    urlIsHttpHttpsScheme: IiA,
    createDeferredPromise: O3A,
    readAllBytes: tn8
  } = xw(), wv1 = UA("node:assert");
  class $_ {
    #A;
    constructor() {
      if (arguments[0] !== pn8) T9.illegalConstructor();
      T9.util.markAsUncloneable(this), this.#A = arguments[1]
    }
    async match(A, Q = {}) {
      T9.brandCheck(this, $_);
      let B = "Cache.match";
      T9.argumentLengthCheck(arguments, 1, B), A = T9.converters.RequestInfo(A, B, "request"), Q = T9.converters.CacheQueryOptions(Q, B, "options");
      let G = this.#G(A, Q, 1);
      if (G.length === 0) return;
      return G[0]
    }
    async matchAll(A = void 0, Q = {}) {
      T9.brandCheck(this, $_);
      let B = "Cache.matchAll";
      if (A !== void 0) A = T9.converters.RequestInfo(A, B, "request");
      return Q = T9.converters.CacheQueryOptions(Q, B, "options"), this.#G(A, Q)
    }
    async add(A) {
      T9.brandCheck(this, $_);
      let Q = "Cache.add";
      T9.argumentLengthCheck(arguments, 1, Q), A = T9.converters.RequestInfo(A, Q, "request");
      let B = [A];
      return await this.addAll(B)
    }
    async addAll(A) {
      T9.brandCheck(this, $_);
      let Q = "Cache.addAll";
      T9.argumentLengthCheck(arguments, 1, Q);
      let B = [],
        G = [];
      for (let F of A) {
        if (F === void 0) throw T9.errors.conversionFailed({
          prefix: Q,
          argument: "Argument 1",
          types: ["undefined is not allowed"]
        });
        if (F = T9.converters.RequestInfo(F), typeof F === "string") continue;
        let K = F[WT];
        if (!IiA(K.url) || K.method !== "GET") throw T9.errors.exception({
          header: Q,
          message: "Expected http/s scheme when method is not GET."
        })
      }
      let Z = [];
      for (let F of A) {
        let K = new yb(F)[WT];
        if (!IiA(K.url)) throw T9.errors.exception({
          header: Q,
          message: "Expected http/s scheme."
        });
        K.initiator = "fetch", K.destination = "subresource", G.push(K);
        let D = O3A();
        Z.push(on8({
          request: K,
          processResponse(H) {
            if (H.type === "error" || H.status === 206 || H.status < 200 || H.status > 299) D.reject(T9.errors.exception({
              header: "Cache.addAll",
              message: "Received an invalid status code or the request failed."
            }));
            else if (H.headersList.contains("vary")) {
              let C = $v1(H.headersList.get("vary"));
              for (let E of C)
                if (E === "*") {
                  D.reject(T9.errors.exception({
                    header: "Cache.addAll",
                    message: "invalid vary field value"
                  }));
                  for (let U of Z) U.abort();
                  return
                }
            }
          },
          processResponseEndOfBody(H) {
            if (H.aborted) {
              D.reject(new DOMException("aborted", "AbortError"));
              return
            }
            D.resolve(H)
          }
        })), B.push(D.promise)
      }
      let Y = await Promise.all(B),
        J = [],
        W = 0;
      for (let F of Y) {
        let K = {
          type: "put",
          request: G[W],
          response: F
        };
        J.push(K), W++
      }
      let X = O3A(),
        V = null;
      try {
        this.#Q(J)
      } catch (F) {
        V = F
      }
      return queueMicrotask(() => {
        if (V === null) X.resolve(void 0);
        else X.reject(V)
      }), X.promise
    }
    async put(A, Q) {
      T9.brandCheck(this, $_);
      let B = "Cache.put";
      T9.argumentLengthCheck(arguments, 2, B), A = T9.converters.RequestInfo(A, B, "request"), Q = T9.converters.Response(Q, B, "response");
      let G = null;
      if (A instanceof yb) G = A[WT];
      else G = new yb(A)[WT];
      if (!IiA(G.url) || G.method !== "GET") throw T9.errors.exception({
        header: B,
        message: "Expected an http/s scheme when method is not GET"
      });
      let Z = Q[WT];
      if (Z.status === 206) throw T9.errors.exception({
        header: B,
        message: "Got 206 status"
      });
      if (Z.headersList.contains("vary")) {
        let K = $v1(Z.headersList.get("vary"));
        for (let D of K)
          if (D === "*") throw T9.errors.exception({
            header: B,
            message: "Got * vary field value"
          })
      }
      if (Z.body && (in8(Z.body.stream) || Z.body.stream.locked)) throw T9.errors.exception({
        header: B,
        message: "Response body is locked or disturbed"
      });
      let I = an8(Z),
        Y = O3A();
      if (Z.body != null) {
        let D = Z.body.stream.getReader();
        tn8(D).then(Y.resolve, Y.reject)
      } else Y.resolve(void 0);
      let J = [],
        W = {
          type: "put",
          request: G,
          response: I
        };
      J.push(W);
      let X = await Y.promise;
      if (I.body != null) I.body.source = X;
      let V = O3A(),
        F = null;
      try {
        this.#Q(J)
      } catch (K) {
        F = K
      }
      return queueMicrotask(() => {
        if (F === null) V.resolve();
        else V.reject(F)
      }), V.promise
    }
    async delete(A, Q = {}) {
      T9.brandCheck(this, $_);
      let B = "Cache.delete";
      T9.argumentLengthCheck(arguments, 1, B), A = T9.converters.RequestInfo(A, B, "request"), Q = T9.converters.CacheQueryOptions(Q, B, "options");
      let G = null;
      if (A instanceof yb) {
        if (G = A[WT], G.method !== "GET" && !Q.ignoreMethod) return !1
      } else wv1(typeof A === "string"), G = new yb(A)[WT];
      let Z = [],
        I = {
          type: "delete",
          request: G,
          options: Q
        };
      Z.push(I);
      let Y = O3A(),
        J = null,
        W;
      try {
        W = this.#Q(Z)
      } catch (X) {
        J = X
      }
      return queueMicrotask(() => {
        if (J === null) Y.resolve(!!W?.length);
        else Y.reject(J)
      }), Y.promise
    }
    async keys(A = void 0, Q = {}) {
      T9.brandCheck(this, $_);
      let B = "Cache.keys";
      if (A !== void 0) A = T9.converters.RequestInfo(A, B, "request");
      Q = T9.converters.CacheQueryOptions(Q, B, "options");
      let G = null;
      if (A !== void 0) {
        if (A instanceof yb) {
          if (G = A[WT], G.method !== "GET" && !Q.ignoreMethod) return []
        } else if (typeof A === "string") G = new yb(A)[WT]
      }
      let Z = O3A(),
        I = [];
      if (A === void 0)
        for (let Y of this.#A) I.push(Y[0]);
      else {
        let Y = this.#B(G, Q);
        for (let J of Y) I.push(J[0])
      }
      return queueMicrotask(() => {
        let Y = [];
        for (let J of I) {
          let W = rn8(J, new AbortController().signal, "immutable");
          Y.push(W)
        }
        Z.resolve(Object.freeze(Y))
      }), Z.promise
    }
    #Q(A) {
      let Q = this.#A,
        B = [...Q],
        G = [],
        Z = [];
      try {
        for (let I of A) {
          if (I.type !== "delete" && I.type !== "put") throw T9.errors.exception({
            header: "Cache.#batchCacheOperations",
            message: 'operation type does not match "delete" or "put"'
          });
          if (I.type === "delete" && I.response != null) throw T9.errors.exception({
            header: "Cache.#batchCacheOperations",
            message: "delete operation should not have an associated response"
          });
          if (this.#B(I.request, I.options, G).length) throw new DOMException("???", "InvalidStateError");
          let Y;
          if (I.type === "delete") {
            if (Y = this.#B(I.request, I.options), Y.length === 0) return [];
            for (let J of Y) {
              let W = Q.indexOf(J);
              wv1(W !== -1), Q.splice(W, 1)
            }
          } else if (I.type === "put") {
            if (I.response == null) throw T9.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "put operation should have an associated response"
            });
            let J = I.request;
            if (!IiA(J.url)) throw T9.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "expected http or https scheme"
            });
            if (J.method !== "GET") throw T9.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "not get method"
            });
            if (I.options != null) throw T9.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "options must not be defined"
            });
            Y = this.#B(I.request);
            for (let W of Y) {
              let X = Q.indexOf(W);
              wv1(X !== -1), Q.splice(X, 1)
            }
            Q.push([I.request, I.response]), G.push([I.request, I.response])
          }
          Z.push([I.request, I.response])
        }
        return Z
      } catch (I) {
        throw this.#A.length = 0, this.#A = B, I
      }
    }
    #B(A, Q, B) {
      let G = [],
        Z = B ?? this.#A;
      for (let I of Z) {
        let [Y, J] = I;
        if (this.#Z(A, Y, J, Q)) G.push(I)
      }
      return G
    }
    #Z(A, Q, B = null, G) {
      let Z = new URL(A.url),
        I = new URL(Q.url);
      if (G?.ignoreSearch) I.search = "", Z.search = "";
      if (!ln8(Z, I, !0)) return !1;
      if (B == null || G?.ignoreVary || !B.headersList.contains("vary")) return !0;
      let Y = $v1(B.headersList.get("vary"));
      for (let J of Y) {
        if (J === "*") return !1;
        let W = Q.headersList.get(J),
          X = A.headersList.get(J);
        if (W !== X) return !1
      }
      return !0
    }
    #G(A, Q, B = 1 / 0) {
      let G = null;
      if (A !== void 0) {
        if (A instanceof yb) {
          if (G = A[WT], G.method !== "GET" && !Q.ignoreMethod) return []
        } else if (typeof A === "string") G = new yb(A)[WT]
      }
      let Z = [];
      if (A === void 0)
        for (let Y of this.#A) Z.push(Y[1]);
      else {
        let Y = this.#B(G, Q);
        for (let J of Y) Z.push(J[1])
      }
      let I = [];
      for (let Y of Z) {
        let J = sn8(Y, "immutable");
        if (I.push(J.clone()), I.length >= B) break
      }
      return Object.freeze(I)
    }
  }
  Object.defineProperties($_.prototype, {
    [Symbol.toStringTag]: {
      value: "Cache",
      configurable: !0
    },
    match: oo,
    matchAll: oo,
    add: oo,
    addAll: oo,
    put: oo,
    delete: oo,
    keys: oo
  });
  var s2B = [{
    key: "ignoreSearch",
    converter: T9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "ignoreMethod",
    converter: T9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "ignoreVary",
    converter: T9.converters.boolean,
    defaultValue: () => !1
  }];
  T9.converters.CacheQueryOptions = T9.dictionaryConverter(s2B);
  T9.converters.MultiCacheQueryOptions = T9.dictionaryConverter([...s2B, {
    key: "cacheName",
    converter: T9.converters.DOMString
  }]);
  T9.converters.Response = T9.interfaceConverter(nn8);
  T9.converters["sequence<RequestInfo>"] = T9.sequenceConverter(T9.converters.RequestInfo);
  r2B.exports = {
    Cache: $_
  }
})
// @from(Start 5039808, End 5041771)
e2B = z((K_7, t2B) => {
  var {
    kConstruct: DzA
  } = ZiA(), {
    Cache: YiA
  } = o2B(), {
    webidl: xH
  } = zD(), {
    kEnumerableProperty: HzA
  } = S6();
  class Oc {
    #A = new Map;
    constructor() {
      if (arguments[0] !== DzA) xH.illegalConstructor();
      xH.util.markAsUncloneable(this)
    }
    async match(A, Q = {}) {
      if (xH.brandCheck(this, Oc), xH.argumentLengthCheck(arguments, 1, "CacheStorage.match"), A = xH.converters.RequestInfo(A), Q = xH.converters.MultiCacheQueryOptions(Q), Q.cacheName != null) {
        if (this.#A.has(Q.cacheName)) {
          let B = this.#A.get(Q.cacheName);
          return await new YiA(DzA, B).match(A, Q)
        }
      } else
        for (let B of this.#A.values()) {
          let Z = await new YiA(DzA, B).match(A, Q);
          if (Z !== void 0) return Z
        }
    }
    async has(A) {
      xH.brandCheck(this, Oc);
      let Q = "CacheStorage.has";
      return xH.argumentLengthCheck(arguments, 1, Q), A = xH.converters.DOMString(A, Q, "cacheName"), this.#A.has(A)
    }
    async open(A) {
      xH.brandCheck(this, Oc);
      let Q = "CacheStorage.open";
      if (xH.argumentLengthCheck(arguments, 1, Q), A = xH.converters.DOMString(A, Q, "cacheName"), this.#A.has(A)) {
        let G = this.#A.get(A);
        return new YiA(DzA, G)
      }
      let B = [];
      return this.#A.set(A, B), new YiA(DzA, B)
    }
    async delete(A) {
      xH.brandCheck(this, Oc);
      let Q = "CacheStorage.delete";
      return xH.argumentLengthCheck(arguments, 1, Q), A = xH.converters.DOMString(A, Q, "cacheName"), this.#A.delete(A)
    }
    async keys() {
      return xH.brandCheck(this, Oc), [...this.#A.keys()]
    }
  }
  Object.defineProperties(Oc.prototype, {
    [Symbol.toStringTag]: {
      value: "CacheStorage",
      configurable: !0
    },
    match: HzA,
    has: HzA,
    open: HzA,
    delete: HzA,
    keys: HzA
  });
  t2B.exports = {
    CacheStorage: Oc
  }
})
// @from(Start 5041777, End 5041889)
Q9B = z((D_7, A9B) => {
  A9B.exports = {
    maxAttributeValueSize: 1024,
    maxNameValuePairSize: 4096
  }
})
// @from(Start 5041895, End 5044799)
qv1 = z((H_7, Y9B) => {
  function en8(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B >= 0 && B <= 8 || B >= 10 && B <= 31 || B === 127) return !0
    }
    return !1
  }

  function B9B(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B < 33 || B > 126 || B === 34 || B === 40 || B === 41 || B === 60 || B === 62 || B === 64 || B === 44 || B === 59 || B === 58 || B === 92 || B === 47 || B === 91 || B === 93 || B === 63 || B === 61 || B === 123 || B === 125) throw Error("Invalid cookie name")
    }
  }

  function G9B(A) {
    let Q = A.length,
      B = 0;
    if (A[0] === '"') {
      if (Q === 1 || A[Q - 1] !== '"') throw Error("Invalid cookie value");
      --Q, ++B
    }
    while (B < Q) {
      let G = A.charCodeAt(B++);
      if (G < 33 || G > 126 || G === 34 || G === 44 || G === 59 || G === 92) throw Error("Invalid cookie value")
    }
  }

  function Z9B(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B < 32 || B === 127 || B === 59) throw Error("Invalid cookie path")
    }
  }

  function Aa8(A) {
    if (A.startsWith("-") || A.endsWith(".") || A.endsWith("-")) throw Error("Invalid cookie domain")
  }
  var Qa8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    Ba8 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    JiA = Array(61).fill(0).map((A, Q) => Q.toString().padStart(2, "0"));

  function I9B(A) {
    if (typeof A === "number") A = new Date(A);
    return `${Qa8[A.getUTCDay()]}, ${JiA[A.getUTCDate()]} ${Ba8[A.getUTCMonth()]} ${A.getUTCFullYear()} ${JiA[A.getUTCHours()]}:${JiA[A.getUTCMinutes()]}:${JiA[A.getUTCSeconds()]} GMT`
  }

  function Ga8(A) {
    if (A < 0) throw Error("Invalid cookie max-age")
  }

  function Za8(A) {
    if (A.name.length === 0) return null;
    B9B(A.name), G9B(A.value);
    let Q = [`${A.name}=${A.value}`];
    if (A.name.startsWith("__Secure-")) A.secure = !0;
    if (A.name.startsWith("__Host-")) A.secure = !0, A.domain = null, A.path = "/";
    if (A.secure) Q.push("Secure");
    if (A.httpOnly) Q.push("HttpOnly");
    if (typeof A.maxAge === "number") Ga8(A.maxAge), Q.push(`Max-Age=${A.maxAge}`);
    if (A.domain) Aa8(A.domain), Q.push(`Domain=${A.domain}`);
    if (A.path) Z9B(A.path), Q.push(`Path=${A.path}`);
    if (A.expires && A.expires.toString() !== "Invalid Date") Q.push(`Expires=${I9B(A.expires)}`);
    if (A.sameSite) Q.push(`SameSite=${A.sameSite}`);
    for (let B of A.unparsed) {
      if (!B.includes("=")) throw Error("Invalid unparsed");
      let [G, ...Z] = B.split("=");
      Q.push(`${G.trim()}=${Z.join("=")}`)
    }
    return Q.join("; ")
  }
  Y9B.exports = {
    isCTLExcludingHtab: en8,
    validateCookieName: B9B,
    validateCookiePath: Z9B,
    validateCookieValue: G9B,
    toIMFDate: I9B,
    stringify: Za8
  }
})
// @from(Start 5044805, End 5047141)
W9B = z((C_7, J9B) => {
  var {
    maxNameValuePairSize: Ia8,
    maxAttributeValueSize: Ya8
  } = Q9B(), {
    isCTLExcludingHtab: Ja8
  } = qv1(), {
    collectASequenceOfCodePointsFast: WiA
  } = QU(), Wa8 = UA("node:assert");

  function Xa8(A) {
    if (Ja8(A)) return null;
    let Q = "",
      B = "",
      G = "",
      Z = "";
    if (A.includes(";")) {
      let I = {
        position: 0
      };
      Q = WiA(";", A, I), B = A.slice(I.position)
    } else Q = A;
    if (!Q.includes("=")) Z = Q;
    else {
      let I = {
        position: 0
      };
      G = WiA("=", Q, I), Z = Q.slice(I.position + 1)
    }
    if (G = G.trim(), Z = Z.trim(), G.length + Z.length > Ia8) return null;
    return {
      name: G,
      value: Z,
      ...R3A(B)
    }
  }

  function R3A(A, Q = {}) {
    if (A.length === 0) return Q;
    Wa8(A[0] === ";"), A = A.slice(1);
    let B = "";
    if (A.includes(";")) B = WiA(";", A, {
      position: 0
    }), A = A.slice(B.length);
    else B = A, A = "";
    let G = "",
      Z = "";
    if (B.includes("=")) {
      let Y = {
        position: 0
      };
      G = WiA("=", B, Y), Z = B.slice(Y.position + 1)
    } else G = B;
    if (G = G.trim(), Z = Z.trim(), Z.length > Ya8) return R3A(A, Q);
    let I = G.toLowerCase();
    if (I === "expires") {
      let Y = new Date(Z);
      Q.expires = Y
    } else if (I === "max-age") {
      let Y = Z.charCodeAt(0);
      if ((Y < 48 || Y > 57) && Z[0] !== "-") return R3A(A, Q);
      if (!/^\d+$/.test(Z)) return R3A(A, Q);
      let J = Number(Z);
      Q.maxAge = J
    } else if (I === "domain") {
      let Y = Z;
      if (Y[0] === ".") Y = Y.slice(1);
      Y = Y.toLowerCase(), Q.domain = Y
    } else if (I === "path") {
      let Y = "";
      if (Z.length === 0 || Z[0] !== "/") Y = "/";
      else Y = Z;
      Q.path = Y
    } else if (I === "secure") Q.secure = !0;
    else if (I === "httponly") Q.httpOnly = !0;
    else if (I === "samesite") {
      let Y = "Default",
        J = Z.toLowerCase();
      if (J.includes("none")) Y = "None";
      if (J.includes("strict")) Y = "Strict";
      if (J.includes("lax")) Y = "Lax";
      Q.sameSite = Y
    } else Q.unparsed ??= [], Q.unparsed.push(`${G}=${Z}`);
    return R3A(A, Q)
  }
  J9B.exports = {
    parseSetCookie: Xa8,
    parseUnparsedAttributes: R3A
  }
})
// @from(Start 5047147, End 5050010)
F9B = z((E_7, V9B) => {
  var {
    parseSetCookie: Va8
  } = W9B(), {
    stringify: Fa8
  } = qv1(), {
    webidl: P5
  } = zD(), {
    Headers: XiA
  } = no();

  function Ka8(A) {
    P5.argumentLengthCheck(arguments, 1, "getCookies"), P5.brandCheck(A, XiA, {
      strict: !1
    });
    let Q = A.get("cookie"),
      B = {};
    if (!Q) return B;
    for (let G of Q.split(";")) {
      let [Z, ...I] = G.split("=");
      B[Z.trim()] = I.join("=")
    }
    return B
  }

  function Da8(A, Q, B) {
    P5.brandCheck(A, XiA, {
      strict: !1
    });
    let G = "deleteCookie";
    P5.argumentLengthCheck(arguments, 2, G), Q = P5.converters.DOMString(Q, G, "name"), B = P5.converters.DeleteCookieAttributes(B), X9B(A, {
      name: Q,
      value: "",
      expires: new Date(0),
      ...B
    })
  }

  function Ha8(A) {
    P5.argumentLengthCheck(arguments, 1, "getSetCookies"), P5.brandCheck(A, XiA, {
      strict: !1
    });
    let Q = A.getSetCookie();
    if (!Q) return [];
    return Q.map((B) => Va8(B))
  }

  function X9B(A, Q) {
    P5.argumentLengthCheck(arguments, 2, "setCookie"), P5.brandCheck(A, XiA, {
      strict: !1
    }), Q = P5.converters.Cookie(Q);
    let B = Fa8(Q);
    if (B) A.append("Set-Cookie", B)
  }
  P5.converters.DeleteCookieAttributes = P5.dictionaryConverter([{
    converter: P5.nullableConverter(P5.converters.DOMString),
    key: "path",
    defaultValue: () => null
  }, {
    converter: P5.nullableConverter(P5.converters.DOMString),
    key: "domain",
    defaultValue: () => null
  }]);
  P5.converters.Cookie = P5.dictionaryConverter([{
    converter: P5.converters.DOMString,
    key: "name"
  }, {
    converter: P5.converters.DOMString,
    key: "value"
  }, {
    converter: P5.nullableConverter((A) => {
      if (typeof A === "number") return P5.converters["unsigned long long"](A);
      return new Date(A)
    }),
    key: "expires",
    defaultValue: () => null
  }, {
    converter: P5.nullableConverter(P5.converters["long long"]),
    key: "maxAge",
    defaultValue: () => null
  }, {
    converter: P5.nullableConverter(P5.converters.DOMString),
    key: "domain",
    defaultValue: () => null
  }, {
    converter: P5.nullableConverter(P5.converters.DOMString),
    key: "path",
    defaultValue: () => null
  }, {
    converter: P5.nullableConverter(P5.converters.boolean),
    key: "secure",
    defaultValue: () => null
  }, {
    converter: P5.nullableConverter(P5.converters.boolean),
    key: "httpOnly",
    defaultValue: () => null
  }, {
    converter: P5.converters.USVString,
    key: "sameSite",
    allowedValues: ["Strict", "Lax", "None"]
  }, {
    converter: P5.sequenceConverter(P5.converters.DOMString),
    key: "unparsed",
    defaultValue: () => []
  }]);
  V9B.exports = {
    getCookies: Ka8,
    deleteCookie: Da8,
    getSetCookies: Ha8,
    setCookie: X9B
  }
})
// @from(Start 5050016, End 5055697)
P3A = z((z_7, D9B) => {
  var {
    webidl: E9
  } = zD(), {
    kEnumerableProperty: IU
  } = S6(), {
    kConstruct: K9B
  } = tI(), {
    MessagePort: Ca8
  } = UA("node:worker_threads");
  class mw extends Event {
    #A;
    constructor(A, Q = {}) {
      if (A === K9B) {
        super(arguments[1], arguments[2]);
        E9.util.markAsUncloneable(this);
        return
      }
      let B = "MessageEvent constructor";
      E9.argumentLengthCheck(arguments, 1, B), A = E9.converters.DOMString(A, B, "type"), Q = E9.converters.MessageEventInit(Q, B, "eventInitDict");
      super(A, Q);
      this.#A = Q, E9.util.markAsUncloneable(this)
    }
    get data() {
      return E9.brandCheck(this, mw), this.#A.data
    }
    get origin() {
      return E9.brandCheck(this, mw), this.#A.origin
    }
    get lastEventId() {
      return E9.brandCheck(this, mw), this.#A.lastEventId
    }
    get source() {
      return E9.brandCheck(this, mw), this.#A.source
    }
    get ports() {
      if (E9.brandCheck(this, mw), !Object.isFrozen(this.#A.ports)) Object.freeze(this.#A.ports);
      return this.#A.ports
    }
    initMessageEvent(A, Q = !1, B = !1, G = null, Z = "", I = "", Y = null, J = []) {
      return E9.brandCheck(this, mw), E9.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new mw(A, {
        bubbles: Q,
        cancelable: B,
        data: G,
        origin: Z,
        lastEventId: I,
        source: Y,
        ports: J
      })
    }
    static createFastMessageEvent(A, Q) {
      let B = new mw(K9B, A, Q);
      return B.#A = Q, B.#A.data ??= null, B.#A.origin ??= "", B.#A.lastEventId ??= "", B.#A.source ??= null, B.#A.ports ??= [], B
    }
  }
  var {
    createFastMessageEvent: Ea8
  } = mw;
  delete mw.createFastMessageEvent;
  class T3A extends Event {
    #A;
    constructor(A, Q = {}) {
      E9.argumentLengthCheck(arguments, 1, "CloseEvent constructor"), A = E9.converters.DOMString(A, "CloseEvent constructor", "type"), Q = E9.converters.CloseEventInit(Q);
      super(A, Q);
      this.#A = Q, E9.util.markAsUncloneable(this)
    }
    get wasClean() {
      return E9.brandCheck(this, T3A), this.#A.wasClean
    }
    get code() {
      return E9.brandCheck(this, T3A), this.#A.code
    }
    get reason() {
      return E9.brandCheck(this, T3A), this.#A.reason
    }
  }
  class Rc extends Event {
    #A;
    constructor(A, Q) {
      E9.argumentLengthCheck(arguments, 1, "ErrorEvent constructor");
      super(A, Q);
      E9.util.markAsUncloneable(this), A = E9.converters.DOMString(A, "ErrorEvent constructor", "type"), Q = E9.converters.ErrorEventInit(Q ?? {}), this.#A = Q
    }
    get message() {
      return E9.brandCheck(this, Rc), this.#A.message
    }
    get filename() {
      return E9.brandCheck(this, Rc), this.#A.filename
    }
    get lineno() {
      return E9.brandCheck(this, Rc), this.#A.lineno
    }
    get colno() {
      return E9.brandCheck(this, Rc), this.#A.colno
    }
    get error() {
      return E9.brandCheck(this, Rc), this.#A.error
    }
  }
  Object.defineProperties(mw.prototype, {
    [Symbol.toStringTag]: {
      value: "MessageEvent",
      configurable: !0
    },
    data: IU,
    origin: IU,
    lastEventId: IU,
    source: IU,
    ports: IU,
    initMessageEvent: IU
  });
  Object.defineProperties(T3A.prototype, {
    [Symbol.toStringTag]: {
      value: "CloseEvent",
      configurable: !0
    },
    reason: IU,
    code: IU,
    wasClean: IU
  });
  Object.defineProperties(Rc.prototype, {
    [Symbol.toStringTag]: {
      value: "ErrorEvent",
      configurable: !0
    },
    message: IU,
    filename: IU,
    lineno: IU,
    colno: IU,
    error: IU
  });
  E9.converters.MessagePort = E9.interfaceConverter(Ca8);
  E9.converters["sequence<MessagePort>"] = E9.sequenceConverter(E9.converters.MessagePort);
  var Nv1 = [{
    key: "bubbles",
    converter: E9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "cancelable",
    converter: E9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "composed",
    converter: E9.converters.boolean,
    defaultValue: () => !1
  }];
  E9.converters.MessageEventInit = E9.dictionaryConverter([...Nv1, {
    key: "data",
    converter: E9.converters.any,
    defaultValue: () => null
  }, {
    key: "origin",
    converter: E9.converters.USVString,
    defaultValue: () => ""
  }, {
    key: "lastEventId",
    converter: E9.converters.DOMString,
    defaultValue: () => ""
  }, {
    key: "source",
    converter: E9.nullableConverter(E9.converters.MessagePort),
    defaultValue: () => null
  }, {
    key: "ports",
    converter: E9.converters["sequence<MessagePort>"],
    defaultValue: () => []
  }]);
  E9.converters.CloseEventInit = E9.dictionaryConverter([...Nv1, {
    key: "wasClean",
    converter: E9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "code",
    converter: E9.converters["unsigned short"],
    defaultValue: () => 0
  }, {
    key: "reason",
    converter: E9.converters.USVString,
    defaultValue: () => ""
  }]);
  E9.converters.ErrorEventInit = E9.dictionaryConverter([...Nv1, {
    key: "message",
    converter: E9.converters.DOMString,
    defaultValue: () => ""
  }, {
    key: "filename",
    converter: E9.converters.USVString,
    defaultValue: () => ""
  }, {
    key: "lineno",
    converter: E9.converters["unsigned long"],
    defaultValue: () => 0
  }, {
    key: "colno",
    converter: E9.converters["unsigned long"],
    defaultValue: () => 0
  }, {
    key: "error",
    converter: E9.converters.any
  }]);
  D9B.exports = {
    MessageEvent: mw,
    CloseEvent: T3A,
    ErrorEvent: Rc,
    createFastMessageEvent: Ea8
  }
})
// @from(Start 5055703, End 5056594)
to = z((U_7, H9B) => {
  var za8 = {
      enumerable: !0,
      writable: !1,
      configurable: !1
    },
    Ua8 = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    },
    $a8 = {
      NOT_SENT: 0,
      PROCESSING: 1,
      SENT: 2
    },
    wa8 = {
      CONTINUATION: 0,
      TEXT: 1,
      BINARY: 2,
      CLOSE: 8,
      PING: 9,
      PONG: 10
    },
    qa8 = {
      INFO: 0,
      PAYLOADLENGTH_16: 2,
      PAYLOADLENGTH_64: 3,
      READ_DATA: 4
    },
    Na8 = Buffer.allocUnsafe(0),
    La8 = {
      string: 1,
      typedArray: 2,
      arrayBuffer: 3,
      blob: 4
    };
  H9B.exports = {
    uid: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    sentCloseFrameState: $a8,
    staticPropertyDescriptors: za8,
    states: Ua8,
    opcodes: wa8,
    maxUnsigned16Bit: 65535,
    parserStates: qa8,
    emptyBuffer: Na8,
    sendHints: La8
  }
})
// @from(Start 5056600, End 5056959)
CzA = z(($_7, C9B) => {
  C9B.exports = {
    kWebSocketURL: Symbol("url"),
    kReadyState: Symbol("ready state"),
    kController: Symbol("controller"),
    kResponse: Symbol("response"),
    kBinaryType: Symbol("binary type"),
    kSentClose: Symbol("sent close"),
    kReceivedClose: Symbol("received close"),
    kByteParser: Symbol("byte parser")
  }
})
// @from(Start 5056965, End 5060462)
UzA = z((w_7, M9B) => {
  var {
    kReadyState: EzA,
    kController: Ma8,
    kResponse: Oa8,
    kBinaryType: Ra8,
    kWebSocketURL: Ta8
  } = CzA(), {
    states: zzA,
    opcodes: Tc
  } = to(), {
    ErrorEvent: Pa8,
    createFastMessageEvent: ja8
  } = P3A(), {
    isUtf8: Sa8
  } = UA("node:buffer"), {
    collectASequenceOfCodePointsFast: _a8,
    removeHTTPWhitespace: E9B
  } = QU();

  function ka8(A) {
    return A[EzA] === zzA.CONNECTING
  }

  function ya8(A) {
    return A[EzA] === zzA.OPEN
  }

  function xa8(A) {
    return A[EzA] === zzA.CLOSING
  }

  function va8(A) {
    return A[EzA] === zzA.CLOSED
  }

  function Lv1(A, Q, B = (Z, I) => new Event(Z, I), G = {}) {
    let Z = B(A, G);
    Q.dispatchEvent(Z)
  }

  function ba8(A, Q, B) {
    if (A[EzA] !== zzA.OPEN) return;
    let G;
    if (Q === Tc.TEXT) try {
      G = L9B(B)
    } catch {
      U9B(A, "Received invalid UTF-8 in text frame.");
      return
    } else if (Q === Tc.BINARY)
      if (A[Ra8] === "blob") G = new Blob([B]);
      else G = fa8(B);
    Lv1("message", A, ja8, {
      origin: A[Ta8].origin,
      data: G
    })
  }

  function fa8(A) {
    if (A.byteLength === A.buffer.byteLength) return A.buffer;
    return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
  }

  function ha8(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B < 33 || B > 126 || B === 34 || B === 40 || B === 41 || B === 44 || B === 47 || B === 58 || B === 59 || B === 60 || B === 61 || B === 62 || B === 63 || B === 64 || B === 91 || B === 92 || B === 93 || B === 123 || B === 125) return !1
    }
    return !0
  }

  function ga8(A) {
    if (A >= 1000 && A < 1015) return A !== 1004 && A !== 1005 && A !== 1006;
    return A >= 3000 && A <= 4999
  }

  function U9B(A, Q) {
    let {
      [Ma8]: B, [Oa8]: G
    } = A;
    if (B.abort(), G?.socket && !G.socket.destroyed) G.socket.destroy();
    if (Q) Lv1("error", A, (Z, I) => new Pa8(Z, I), {
      error: Error(Q),
      message: Q
    })
  }

  function $9B(A) {
    return A === Tc.CLOSE || A === Tc.PING || A === Tc.PONG
  }

  function w9B(A) {
    return A === Tc.CONTINUATION
  }

  function q9B(A) {
    return A === Tc.TEXT || A === Tc.BINARY
  }

  function ua8(A) {
    return q9B(A) || w9B(A) || $9B(A)
  }

  function ma8(A) {
    let Q = {
        position: 0
      },
      B = new Map;
    while (Q.position < A.length) {
      let G = _a8(";", A, Q),
        [Z, I = ""] = G.split("=");
      B.set(E9B(Z, !0, !1), E9B(I, !1, !0)), Q.position++
    }
    return B
  }

  function da8(A) {
    for (let Q = 0; Q < A.length; Q++) {
      let B = A.charCodeAt(Q);
      if (B < 48 || B > 57) return !1
    }
    return !0
  }
  var N9B = typeof process.versions.icu === "string",
    z9B = N9B ? new TextDecoder("utf-8", {
      fatal: !0
    }) : void 0,
    L9B = N9B ? z9B.decode.bind(z9B) : function(A) {
      if (Sa8(A)) return A.toString("utf-8");
      throw TypeError("Invalid utf-8 received.")
    };
  M9B.exports = {
    isConnecting: ka8,
    isEstablished: ya8,
    isClosing: xa8,
    isClosed: va8,
    fireEvent: Lv1,
    isValidSubprotocol: ha8,
    isValidStatusCode: ga8,
    failWebsocketConnection: U9B,
    websocketMessageReceived: ba8,
    utf8Decode: L9B,
    isControlFrame: $9B,
    isContinuationFrame: w9B,
    isTextBinaryFrame: q9B,
    isValidOpcode: ua8,
    parseExtensions: ma8,
    isValidClientWindowBits: da8
  }
})
// @from(Start 5060468, End 5061749)
ViA = z((q_7, R9B) => {
  var {
    maxUnsigned16Bit: ca8
  } = to(), Mv1, $zA = null, j3A = 16386;
  try {
    Mv1 = UA("node:crypto")
  } catch {
    Mv1 = {
      randomFillSync: function(Q, B, G) {
        for (let Z = 0; Z < Q.length; ++Z) Q[Z] = Math.random() * 255 | 0;
        return Q
      }
    }
  }

  function pa8() {
    if (j3A === 16386) j3A = 0, Mv1.randomFillSync($zA ??= Buffer.allocUnsafe(16386), 0, 16386);
    return [$zA[j3A++], $zA[j3A++], $zA[j3A++], $zA[j3A++]]
  }
  class O9B {
    constructor(A) {
      this.frameData = A
    }
    createFrame(A) {
      let Q = this.frameData,
        B = pa8(),
        G = Q?.byteLength ?? 0,
        Z = G,
        I = 6;
      if (G > ca8) I += 8, Z = 127;
      else if (G > 125) I += 2, Z = 126;
      let Y = Buffer.allocUnsafe(G + I);
      Y[0] = Y[1] = 0, Y[0] |= 128, Y[0] = (Y[0] & 240) + A; /*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
      if (Y[I - 4] = B[0], Y[I - 3] = B[1], Y[I - 2] = B[2], Y[I - 1] = B[3], Y[1] = Z, Z === 126) Y.writeUInt16BE(G, 2);
      else if (Z === 127) Y[2] = Y[3] = 0, Y.writeUIntBE(G, 4, 6);
      Y[1] |= 128;
      for (let J = 0; J < G; ++J) Y[I + J] = Q[J] ^ B[J & 3];
      return Y
    }
  }
  R9B.exports = {
    WebsocketFrameSend: O9B
  }
})
// @from(Start 5061755, End 5066749)
Rv1 = z((N_7, y9B) => {
  var {
    uid: la8,
    states: wzA,
    sentCloseFrameState: FiA,
    emptyBuffer: ia8,
    opcodes: na8
  } = to(), {
    kReadyState: qzA,
    kSentClose: KiA,
    kByteParser: P9B,
    kReceivedClose: T9B,
    kResponse: j9B
  } = CzA(), {
    fireEvent: aa8,
    failWebsocketConnection: Pc,
    isClosing: sa8,
    isClosed: ra8,
    isEstablished: oa8,
    parseExtensions: ta8
  } = UzA(), {
    channels: S3A
  } = p5A(), {
    CloseEvent: ea8
  } = P3A(), {
    makeRequest: As8
  } = N3A(), {
    fetching: Qs8
  } = VzA(), {
    Headers: Bs8,
    getHeadersList: Gs8
  } = no(), {
    getDecodeSplit: Zs8
  } = xw(), {
    WebsocketFrameSend: Is8
  } = ViA(), Ov1;
  try {
    Ov1 = UA("node:crypto")
  } catch {}

  function Ys8(A, Q, B, G, Z, I) {
    let Y = A;
    Y.protocol = A.protocol === "ws:" ? "http:" : "https:";
    let J = As8({
      urlList: [Y],
      client: B,
      serviceWorkers: "none",
      referrer: "no-referrer",
      mode: "websocket",
      credentials: "include",
      cache: "no-store",
      redirect: "error"
    });
    if (I.headers) {
      let F = Gs8(new Bs8(I.headers));
      J.headersList = F
    }
    let W = Ov1.randomBytes(16).toString("base64");
    J.headersList.append("sec-websocket-key", W), J.headersList.append("sec-websocket-version", "13");
    for (let F of Q) J.headersList.append("sec-websocket-protocol", F);
    let X = "permessage-deflate; client_max_window_bits";
    return J.headersList.append("sec-websocket-extensions", X), Qs8({
      request: J,
      useParallelQueue: !0,
      dispatcher: I.dispatcher,
      processResponse(F) {
        if (F.type === "error" || F.status !== 101) {
          Pc(G, "Received network error or non-101 status code.");
          return
        }
        if (Q.length !== 0 && !F.headersList.get("Sec-WebSocket-Protocol")) {
          Pc(G, "Server did not respond with sent protocols.");
          return
        }
        if (F.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
          Pc(G, 'Server did not set Upgrade header to "websocket".');
          return
        }
        if (F.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
          Pc(G, 'Server did not set Connection header to "upgrade".');
          return
        }
        let K = F.headersList.get("Sec-WebSocket-Accept"),
          D = Ov1.createHash("sha1").update(W + la8).digest("base64");
        if (K !== D) {
          Pc(G, "Incorrect hash received in Sec-WebSocket-Accept header.");
          return
        }
        let H = F.headersList.get("Sec-WebSocket-Extensions"),
          C;
        if (H !== null) {
          if (C = ta8(H), !C.has("permessage-deflate")) {
            Pc(G, "Sec-WebSocket-Extensions header does not match.");
            return
          }
        }
        let E = F.headersList.get("Sec-WebSocket-Protocol");
        if (E !== null) {
          if (!Zs8("sec-websocket-protocol", J.headersList).includes(E)) {
            Pc(G, "Protocol was not set in the opening handshake.");
            return
          }
        }
        if (F.socket.on("data", S9B), F.socket.on("close", _9B), F.socket.on("error", k9B), S3A.open.hasSubscribers) S3A.open.publish({
          address: F.socket.address(),
          protocol: E,
          extensions: H
        });
        Z(F, C)
      }
    })
  }

  function Js8(A, Q, B, G) {
    if (sa8(A) || ra8(A));
    else if (!oa8(A)) Pc(A, "Connection was closed before it was established."), A[qzA] = wzA.CLOSING;
    else if (A[KiA] === FiA.NOT_SENT) {
      A[KiA] = FiA.PROCESSING;
      let Z = new Is8;
      if (Q !== void 0 && B === void 0) Z.frameData = Buffer.allocUnsafe(2), Z.frameData.writeUInt16BE(Q, 0);
      else if (Q !== void 0 && B !== void 0) Z.frameData = Buffer.allocUnsafe(2 + G), Z.frameData.writeUInt16BE(Q, 0), Z.frameData.write(B, 2, "utf-8");
      else Z.frameData = ia8;
      A[j9B].socket.write(Z.createFrame(na8.CLOSE)), A[KiA] = FiA.SENT, A[qzA] = wzA.CLOSING
    } else A[qzA] = wzA.CLOSING
  }

  function S9B(A) {
    if (!this.ws[P9B].write(A)) this.pause()
  }

  function _9B() {
    let {
      ws: A
    } = this, {
      [j9B]: Q
    } = A;
    Q.socket.off("data", S9B), Q.socket.off("close", _9B), Q.socket.off("error", k9B);
    let B = A[KiA] === FiA.SENT && A[T9B],
      G = 1005,
      Z = "",
      I = A[P9B].closingInfo;
    if (I && !I.error) G = I.code ?? 1005, Z = I.reason;
    else if (!A[T9B]) G = 1006;
    if (A[qzA] = wzA.CLOSED, aa8("close", A, (Y, J) => new ea8(Y, J), {
        wasClean: B,
        code: G,
        reason: Z
      }), S3A.close.hasSubscribers) S3A.close.publish({
      websocket: A,
      code: G,
      reason: Z
    })
  }

  function k9B(A) {
    let {
      ws: Q
    } = this;
    if (Q[qzA] = wzA.CLOSING, S3A.socketError.hasSubscribers) S3A.socketError.publish(A);
    this.destroy()
  }
  y9B.exports = {
    establishWebSocketConnection: Ys8,
    closeWebSocketConnection: Js8
  }
})
// @from(Start 5066755, End 5068065)
b9B = z((L_7, v9B) => {
  var {
    createInflateRaw: Ws8,
    Z_DEFAULT_WINDOWBITS: Xs8
  } = UA("node:zlib"), {
    isValidClientWindowBits: Vs8
  } = UzA(), Fs8 = Buffer.from([0, 0, 255, 255]), DiA = Symbol("kBuffer"), HiA = Symbol("kLength");
  class x9B {
    #A;
    #Q = {};
    constructor(A) {
      this.#Q.serverNoContextTakeover = A.has("server_no_context_takeover"), this.#Q.serverMaxWindowBits = A.get("server_max_window_bits")
    }
    decompress(A, Q, B) {
      if (!this.#A) {
        let G = Xs8;
        if (this.#Q.serverMaxWindowBits) {
          if (!Vs8(this.#Q.serverMaxWindowBits)) {
            B(Error("Invalid server_max_window_bits"));
            return
          }
          G = Number.parseInt(this.#Q.serverMaxWindowBits)
        }
        this.#A = Ws8({
          windowBits: G
        }), this.#A[DiA] = [], this.#A[HiA] = 0, this.#A.on("data", (Z) => {
          this.#A[DiA].push(Z), this.#A[HiA] += Z.length
        }), this.#A.on("error", (Z) => {
          this.#A = null, B(Z)
        })
      }
      if (this.#A.write(A), Q) this.#A.write(Fs8);
      this.#A.flush(() => {
        let G = Buffer.concat(this.#A[DiA], this.#A[HiA]);
        this.#A[DiA].length = 0, this.#A[HiA] = 0, B(null, G)
      })
    }
  }
  v9B.exports = {
    PerMessageDeflate: x9B
  }
})