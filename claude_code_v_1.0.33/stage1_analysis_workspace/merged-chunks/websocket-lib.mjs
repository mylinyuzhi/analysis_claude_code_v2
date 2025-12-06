
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
// @from(Start 5068071, End 5075384)
a9B = z((M_7, n9B) => {
  var {
    Writable: Ks8
  } = UA("node:stream"), Ds8 = UA("node:assert"), {
    parserStates: YU,
    opcodes: _3A,
    states: Hs8,
    emptyBuffer: f9B,
    sentCloseFrameState: h9B
  } = to(), {
    kReadyState: Cs8,
    kSentClose: g9B,
    kResponse: u9B,
    kReceivedClose: m9B
  } = CzA(), {
    channels: CiA
  } = p5A(), {
    isValidStatusCode: Es8,
    isValidOpcode: zs8,
    failWebsocketConnection: AM,
    websocketMessageReceived: d9B,
    utf8Decode: Us8,
    isControlFrame: c9B,
    isTextBinaryFrame: Tv1,
    isContinuationFrame: $s8
  } = UzA(), {
    WebsocketFrameSend: p9B
  } = ViA(), {
    closeWebSocketConnection: l9B
  } = Rv1(), {
    PerMessageDeflate: ws8
  } = b9B();
  class i9B extends Ks8 {
    #A = [];
    #Q = 0;
    #B = !1;
    #Z = YU.INFO;
    #G = {};
    #J = [];
    #I;
    constructor(A, Q) {
      super();
      if (this.ws = A, this.#I = Q == null ? new Map : Q, this.#I.has("permessage-deflate")) this.#I.set("permessage-deflate", new ws8(Q))
    }
    _write(A, Q, B) {
      this.#A.push(A), this.#Q += A.length, this.#B = !0, this.run(B)
    }
    run(A) {
      while (this.#B)
        if (this.#Z === YU.INFO) {
          if (this.#Q < 2) return A();
          let Q = this.consume(2),
            B = (Q[0] & 128) !== 0,
            G = Q[0] & 15,
            Z = (Q[1] & 128) === 128,
            I = !B && G !== _3A.CONTINUATION,
            Y = Q[1] & 127,
            J = Q[0] & 64,
            W = Q[0] & 32,
            X = Q[0] & 16;
          if (!zs8(G)) return AM(this.ws, "Invalid opcode received"), A();
          if (Z) return AM(this.ws, "Frame cannot be masked"), A();
          if (J !== 0 && !this.#I.has("permessage-deflate")) {
            AM(this.ws, "Expected RSV1 to be clear.");
            return
          }
          if (W !== 0 || X !== 0) {
            AM(this.ws, "RSV1, RSV2, RSV3 must be clear");
            return
          }
          if (I && !Tv1(G)) {
            AM(this.ws, "Invalid frame type was fragmented.");
            return
          }
          if (Tv1(G) && this.#J.length > 0) {
            AM(this.ws, "Expected continuation frame");
            return
          }
          if (this.#G.fragmented && I) {
            AM(this.ws, "Fragmented frame exceeded 125 bytes.");
            return
          }
          if ((Y > 125 || I) && c9B(G)) {
            AM(this.ws, "Control frame either too large or fragmented");
            return
          }
          if ($s8(G) && this.#J.length === 0 && !this.#G.compressed) {
            AM(this.ws, "Unexpected continuation frame");
            return
          }
          if (Y <= 125) this.#G.payloadLength = Y, this.#Z = YU.READ_DATA;
          else if (Y === 126) this.#Z = YU.PAYLOADLENGTH_16;
          else if (Y === 127) this.#Z = YU.PAYLOADLENGTH_64;
          if (Tv1(G)) this.#G.binaryType = G, this.#G.compressed = J !== 0;
          this.#G.opcode = G, this.#G.masked = Z, this.#G.fin = B, this.#G.fragmented = I
        } else if (this.#Z === YU.PAYLOADLENGTH_16) {
        if (this.#Q < 2) return A();
        let Q = this.consume(2);
        this.#G.payloadLength = Q.readUInt16BE(0), this.#Z = YU.READ_DATA
      } else if (this.#Z === YU.PAYLOADLENGTH_64) {
        if (this.#Q < 8) return A();
        let Q = this.consume(8),
          B = Q.readUInt32BE(0);
        if (B > 2147483647) {
          AM(this.ws, "Received payload length > 2^31 bytes.");
          return
        }
        let G = Q.readUInt32BE(4);
        this.#G.payloadLength = (B << 8) + G, this.#Z = YU.READ_DATA
      } else if (this.#Z === YU.READ_DATA) {
        if (this.#Q < this.#G.payloadLength) return A();
        let Q = this.consume(this.#G.payloadLength);
        if (c9B(this.#G.opcode)) this.#B = this.parseControlFrame(Q), this.#Z = YU.INFO;
        else if (!this.#G.compressed) {
          if (this.#J.push(Q), !this.#G.fragmented && this.#G.fin) {
            let B = Buffer.concat(this.#J);
            d9B(this.ws, this.#G.binaryType, B), this.#J.length = 0
          }
          this.#Z = YU.INFO
        } else {
          this.#I.get("permessage-deflate").decompress(Q, this.#G.fin, (B, G) => {
            if (B) {
              l9B(this.ws, 1007, B.message, B.message.length);
              return
            }
            if (this.#J.push(G), !this.#G.fin) {
              this.#Z = YU.INFO, this.#B = !0, this.run(A);
              return
            }
            d9B(this.ws, this.#G.binaryType, Buffer.concat(this.#J)), this.#B = !0, this.#Z = YU.INFO, this.#J.length = 0, this.run(A)
          }), this.#B = !1;
          break
        }
      }
    }
    consume(A) {
      if (A > this.#Q) throw Error("Called consume() before buffers satiated.");
      else if (A === 0) return f9B;
      if (this.#A[0].length === A) return this.#Q -= this.#A[0].length, this.#A.shift();
      let Q = Buffer.allocUnsafe(A),
        B = 0;
      while (B !== A) {
        let G = this.#A[0],
          {
            length: Z
          } = G;
        if (Z + B === A) {
          Q.set(this.#A.shift(), B);
          break
        } else if (Z + B > A) {
          Q.set(G.subarray(0, A - B), B), this.#A[0] = G.subarray(A - B);
          break
        } else Q.set(this.#A.shift(), B), B += G.length
      }
      return this.#Q -= A, Q
    }
    parseCloseBody(A) {
      Ds8(A.length !== 1);
      let Q;
      if (A.length >= 2) Q = A.readUInt16BE(0);
      if (Q !== void 0 && !Es8(Q)) return {
        code: 1002,
        reason: "Invalid status code",
        error: !0
      };
      let B = A.subarray(2);
      if (B[0] === 239 && B[1] === 187 && B[2] === 191) B = B.subarray(3);
      try {
        B = Us8(B)
      } catch {
        return {
          code: 1007,
          reason: "Invalid UTF-8",
          error: !0
        }
      }
      return {
        code: Q,
        reason: B,
        error: !1
      }
    }
    parseControlFrame(A) {
      let {
        opcode: Q,
        payloadLength: B
      } = this.#G;
      if (Q === _3A.CLOSE) {
        if (B === 1) return AM(this.ws, "Received close frame with a 1-byte body."), !1;
        if (this.#G.closeInfo = this.parseCloseBody(A), this.#G.closeInfo.error) {
          let {
            code: G,
            reason: Z
          } = this.#G.closeInfo;
          return l9B(this.ws, G, Z, Z.length), AM(this.ws, Z), !1
        }
        if (this.ws[g9B] !== h9B.SENT) {
          let G = f9B;
          if (this.#G.closeInfo.code) G = Buffer.allocUnsafe(2), G.writeUInt16BE(this.#G.closeInfo.code, 0);
          let Z = new p9B(G);
          this.ws[u9B].socket.write(Z.createFrame(_3A.CLOSE), (I) => {
            if (!I) this.ws[g9B] = h9B.SENT
          })
        }
        return this.ws[Cs8] = Hs8.CLOSING, this.ws[m9B] = !0, !1
      } else if (Q === _3A.PING) {
        if (!this.ws[m9B]) {
          let G = new p9B(A);
          if (this.ws[u9B].socket.write(G.createFrame(_3A.PONG)), CiA.ping.hasSubscribers) CiA.ping.publish({
            payload: A
          })
        }
      } else if (Q === _3A.PONG) {
        if (CiA.pong.hasSubscribers) CiA.pong.publish({
          payload: A
        })
      }
      return !0
    }
    get closingInfo() {
      return this.#G.closeInfo
    }
  }
  n9B.exports = {
    ByteParser: i9B
  }
})
// @from(Start 5075390, End 5076876)
A4B = z((O_7, e9B) => {
  var {
    WebsocketFrameSend: qs8
  } = ViA(), {
    opcodes: s9B,
    sendHints: k3A
  } = to(), Ns8 = Fx1(), r9B = Buffer[Symbol.species];
  class t9B {
    #A = new Ns8;
    #Q = !1;
    #B;
    constructor(A) {
      this.#B = A
    }
    add(A, Q, B) {
      if (B !== k3A.blob) {
        let Z = o9B(A, B);
        if (!this.#Q) this.#B.write(Z, Q);
        else {
          let I = {
            promise: null,
            callback: Q,
            frame: Z
          };
          this.#A.push(I)
        }
        return
      }
      let G = {
        promise: A.arrayBuffer().then((Z) => {
          G.promise = null, G.frame = o9B(Z, B)
        }),
        callback: Q,
        frame: null
      };
      if (this.#A.push(G), !this.#Q) this.#Z()
    }
    async #Z() {
      this.#Q = !0;
      let A = this.#A;
      while (!A.isEmpty()) {
        let Q = A.shift();
        if (Q.promise !== null) await Q.promise;
        this.#B.write(Q.frame, Q.callback), Q.callback = Q.frame = null
      }
      this.#Q = !1
    }
  }

  function o9B(A, Q) {
    return new qs8(Ls8(A, Q)).createFrame(Q === k3A.string ? s9B.TEXT : s9B.BINARY)
  }

  function Ls8(A, Q) {
    switch (Q) {
      case k3A.string:
        return Buffer.from(A);
      case k3A.arrayBuffer:
      case k3A.blob:
        return new r9B(A);
      case k3A.typedArray:
        return new r9B(A.buffer, A.byteOffset, A.byteLength)
    }
  }
  e9B.exports = {
    SendQueue: t9B
  }
})
// @from(Start 5076882, End 5085584)
X4B = z((R_7, W4B) => {
  var {
    webidl: j4
  } = zD(), {
    URLSerializer: Ms8
  } = QU(), {
    environmentSettingsObject: Q4B
  } = xw(), {
    staticPropertyDescriptors: jc,
    states: NzA,
    sentCloseFrameState: Os8,
    sendHints: EiA
  } = to(), {
    kWebSocketURL: B4B,
    kReadyState: Pv1,
    kController: Rs8,
    kBinaryType: ziA,
    kResponse: G4B,
    kSentClose: Ts8,
    kByteParser: Ps8
  } = CzA(), {
    isConnecting: js8,
    isEstablished: Ss8,
    isClosing: _s8,
    isValidSubprotocol: ks8,
    fireEvent: Z4B
  } = UzA(), {
    establishWebSocketConnection: ys8,
    closeWebSocketConnection: I4B
  } = Rv1(), {
    ByteParser: xs8
  } = a9B(), {
    kEnumerableProperty: QM,
    isBlobLike: Y4B
  } = S6(), {
    getGlobalDispatcher: vs8
  } = flA(), {
    types: J4B
  } = UA("node:util"), {
    ErrorEvent: bs8,
    CloseEvent: fs8
  } = P3A(), {
    SendQueue: hs8
  } = A4B();
  class g7 extends EventTarget {
    #A = {
      open: null,
      error: null,
      close: null,
      message: null
    };
    #Q = 0;
    #B = "";
    #Z = "";
    #G;
    constructor(A, Q = []) {
      super();
      j4.util.markAsUncloneable(this);
      let B = "WebSocket constructor";
      j4.argumentLengthCheck(arguments, 1, B);
      let G = j4.converters["DOMString or sequence<DOMString> or WebSocketInit"](Q, B, "options");
      A = j4.converters.USVString(A, B, "url"), Q = G.protocols;
      let Z = Q4B.settingsObject.baseUrl,
        I;
      try {
        I = new URL(A, Z)
      } catch (J) {
        throw new DOMException(J, "SyntaxError")
      }
      if (I.protocol === "http:") I.protocol = "ws:";
      else if (I.protocol === "https:") I.protocol = "wss:";
      if (I.protocol !== "ws:" && I.protocol !== "wss:") throw new DOMException(`Expected a ws: or wss: protocol, got ${I.protocol}`, "SyntaxError");
      if (I.hash || I.href.endsWith("#")) throw new DOMException("Got fragment", "SyntaxError");
      if (typeof Q === "string") Q = [Q];
      if (Q.length !== new Set(Q.map((J) => J.toLowerCase())).size) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      if (Q.length > 0 && !Q.every((J) => ks8(J))) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      this[B4B] = new URL(I.href);
      let Y = Q4B.settingsObject;
      this[Rs8] = ys8(I, Q, Y, this, (J, W) => this.#J(J, W), G), this[Pv1] = g7.CONNECTING, this[Ts8] = Os8.NOT_SENT, this[ziA] = "blob"
    }
    close(A = void 0, Q = void 0) {
      j4.brandCheck(this, g7);
      let B = "WebSocket.close";
      if (A !== void 0) A = j4.converters["unsigned short"](A, B, "code", {
        clamp: !0
      });
      if (Q !== void 0) Q = j4.converters.USVString(Q, B, "reason");
      if (A !== void 0) {
        if (A !== 1000 && (A < 3000 || A > 4999)) throw new DOMException("invalid code", "InvalidAccessError")
      }
      let G = 0;
      if (Q !== void 0) {
        if (G = Buffer.byteLength(Q), G > 123) throw new DOMException(`Reason must be less than 123 bytes; received ${G}`, "SyntaxError")
      }
      I4B(this, A, Q, G)
    }
    send(A) {
      j4.brandCheck(this, g7);
      let Q = "WebSocket.send";
      if (j4.argumentLengthCheck(arguments, 1, Q), A = j4.converters.WebSocketSendData(A, Q, "data"), js8(this)) throw new DOMException("Sent before connected.", "InvalidStateError");
      if (!Ss8(this) || _s8(this)) return;
      if (typeof A === "string") {
        let B = Buffer.byteLength(A);
        this.#Q += B, this.#G.add(A, () => {
          this.#Q -= B
        }, EiA.string)
      } else if (J4B.isArrayBuffer(A)) this.#Q += A.byteLength, this.#G.add(A, () => {
        this.#Q -= A.byteLength
      }, EiA.arrayBuffer);
      else if (ArrayBuffer.isView(A)) this.#Q += A.byteLength, this.#G.add(A, () => {
        this.#Q -= A.byteLength
      }, EiA.typedArray);
      else if (Y4B(A)) this.#Q += A.size, this.#G.add(A, () => {
        this.#Q -= A.size
      }, EiA.blob)
    }
    get readyState() {
      return j4.brandCheck(this, g7), this[Pv1]
    }
    get bufferedAmount() {
      return j4.brandCheck(this, g7), this.#Q
    }
    get url() {
      return j4.brandCheck(this, g7), Ms8(this[B4B])
    }
    get extensions() {
      return j4.brandCheck(this, g7), this.#Z
    }
    get protocol() {
      return j4.brandCheck(this, g7), this.#B
    }
    get onopen() {
      return j4.brandCheck(this, g7), this.#A.open
    }
    set onopen(A) {
      if (j4.brandCheck(this, g7), this.#A.open) this.removeEventListener("open", this.#A.open);
      if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
      else this.#A.open = null
    }
    get onerror() {
      return j4.brandCheck(this, g7), this.#A.error
    }
    set onerror(A) {
      if (j4.brandCheck(this, g7), this.#A.error) this.removeEventListener("error", this.#A.error);
      if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
      else this.#A.error = null
    }
    get onclose() {
      return j4.brandCheck(this, g7), this.#A.close
    }
    set onclose(A) {
      if (j4.brandCheck(this, g7), this.#A.close) this.removeEventListener("close", this.#A.close);
      if (typeof A === "function") this.#A.close = A, this.addEventListener("close", A);
      else this.#A.close = null
    }
    get onmessage() {
      return j4.brandCheck(this, g7), this.#A.message
    }
    set onmessage(A) {
      if (j4.brandCheck(this, g7), this.#A.message) this.removeEventListener("message", this.#A.message);
      if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
      else this.#A.message = null
    }
    get binaryType() {
      return j4.brandCheck(this, g7), this[ziA]
    }
    set binaryType(A) {
      if (j4.brandCheck(this, g7), A !== "blob" && A !== "arraybuffer") this[ziA] = "blob";
      else this[ziA] = A
    }
    #J(A, Q) {
      this[G4B] = A;
      let B = new xs8(this, Q);
      B.on("drain", gs8), B.on("error", us8.bind(this)), A.socket.ws = this, this[Ps8] = B, this.#G = new hs8(A.socket), this[Pv1] = NzA.OPEN;
      let G = A.headersList.get("sec-websocket-extensions");
      if (G !== null) this.#Z = G;
      let Z = A.headersList.get("sec-websocket-protocol");
      if (Z !== null) this.#B = Z;
      Z4B("open", this)
    }
  }
  g7.CONNECTING = g7.prototype.CONNECTING = NzA.CONNECTING;
  g7.OPEN = g7.prototype.OPEN = NzA.OPEN;
  g7.CLOSING = g7.prototype.CLOSING = NzA.CLOSING;
  g7.CLOSED = g7.prototype.CLOSED = NzA.CLOSED;
  Object.defineProperties(g7.prototype, {
    CONNECTING: jc,
    OPEN: jc,
    CLOSING: jc,
    CLOSED: jc,
    url: QM,
    readyState: QM,
    bufferedAmount: QM,
    onopen: QM,
    onerror: QM,
    onclose: QM,
    close: QM,
    onmessage: QM,
    binaryType: QM,
    send: QM,
    extensions: QM,
    protocol: QM,
    [Symbol.toStringTag]: {
      value: "WebSocket",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  });
  Object.defineProperties(g7, {
    CONNECTING: jc,
    OPEN: jc,
    CLOSING: jc,
    CLOSED: jc
  });
  j4.converters["sequence<DOMString>"] = j4.sequenceConverter(j4.converters.DOMString);
  j4.converters["DOMString or sequence<DOMString>"] = function(A, Q, B) {
    if (j4.util.Type(A) === "Object" && Symbol.iterator in A) return j4.converters["sequence<DOMString>"](A);
    return j4.converters.DOMString(A, Q, B)
  };
  j4.converters.WebSocketInit = j4.dictionaryConverter([{
    key: "protocols",
    converter: j4.converters["DOMString or sequence<DOMString>"],
    defaultValue: () => []
  }, {
    key: "dispatcher",
    converter: j4.converters.any,
    defaultValue: () => vs8()
  }, {
    key: "headers",
    converter: j4.nullableConverter(j4.converters.HeadersInit)
  }]);
  j4.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(A) {
    if (j4.util.Type(A) === "Object" && !(Symbol.iterator in A)) return j4.converters.WebSocketInit(A);
    return {
      protocols: j4.converters["DOMString or sequence<DOMString>"](A)
    }
  };
  j4.converters.WebSocketSendData = function(A) {
    if (j4.util.Type(A) === "Object") {
      if (Y4B(A)) return j4.converters.Blob(A, {
        strict: !1
      });
      if (ArrayBuffer.isView(A) || J4B.isArrayBuffer(A)) return j4.converters.BufferSource(A)
    }
    return j4.converters.USVString(A)
  };

  function gs8() {
    this.ws[G4B].socket.resume()
  }

  function us8(A) {
    let Q, B;
    if (A instanceof fs8) Q = A.reason, B = A.code;
    else Q = A.message;
    Z4B("error", this, () => new bs8("error", {
      error: A,
      message: Q
    })), I4B(this, B)
  }
  W4B.exports = {
    WebSocket: g7
  }
})
// @from(Start 5085590, End 5086041)
jv1 = z((T_7, V4B) => {
  function ms8(A) {
    return A.indexOf("\x00") === -1
  }

  function ds8(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; Q++)
      if (A.charCodeAt(Q) < 48 || A.charCodeAt(Q) > 57) return !1;
    return !0
  }

  function cs8(A) {
    return new Promise((Q) => {
      setTimeout(Q, A).unref()
    })
  }
  V4B.exports = {
    isValidLastEventId: ms8,
    isASCIINumber: ds8,
    delay: cs8
  }
})
// @from(Start 5086047, End 5090153)
C4B = z((P_7, H4B) => {
  var {
    Transform: ps8
  } = UA("node:stream"), {
    isASCIINumber: F4B,
    isValidLastEventId: K4B
  } = jv1(), xb = [239, 187, 191];
  class D4B extends ps8 {
    state = null;
    checkBOM = !0;
    crlfCheck = !1;
    eventEndCheck = !1;
    buffer = null;
    pos = 0;
    event = {
      data: void 0,
      event: void 0,
      id: void 0,
      retry: void 0
    };
    constructor(A = {}) {
      A.readableObjectMode = !0;
      super(A);
      if (this.state = A.eventSourceSettings || {}, A.push) this.push = A.push
    }
    _transform(A, Q, B) {
      if (A.length === 0) {
        B();
        return
      }
      if (this.buffer) this.buffer = Buffer.concat([this.buffer, A]);
      else this.buffer = A;
      if (this.checkBOM) switch (this.buffer.length) {
        case 1:
          if (this.buffer[0] === xb[0]) {
            B();
            return
          }
          this.checkBOM = !1, B();
          return;
        case 2:
          if (this.buffer[0] === xb[0] && this.buffer[1] === xb[1]) {
            B();
            return
          }
          this.checkBOM = !1;
          break;
        case 3:
          if (this.buffer[0] === xb[0] && this.buffer[1] === xb[1] && this.buffer[2] === xb[2]) {
            this.buffer = Buffer.alloc(0), this.checkBOM = !1, B();
            return
          }
          this.checkBOM = !1;
          break;
        default:
          if (this.buffer[0] === xb[0] && this.buffer[1] === xb[1] && this.buffer[2] === xb[2]) this.buffer = this.buffer.subarray(3);
          this.checkBOM = !1;
          break
      }
      while (this.pos < this.buffer.length) {
        if (this.eventEndCheck) {
          if (this.crlfCheck) {
            if (this.buffer[this.pos] === 10) {
              this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.crlfCheck = !1;
              continue
            }
            this.crlfCheck = !1
          }
          if (this.buffer[this.pos] === 10 || this.buffer[this.pos] === 13) {
            if (this.buffer[this.pos] === 13) this.crlfCheck = !0;
            if (this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.event.data !== void 0 || this.event.event || this.event.id || this.event.retry) this.processEvent(this.event);
            this.clearEvent();
            continue
          }
          this.eventEndCheck = !1;
          continue
        }
        if (this.buffer[this.pos] === 10 || this.buffer[this.pos] === 13) {
          if (this.buffer[this.pos] === 13) this.crlfCheck = !0;
          this.parseLine(this.buffer.subarray(0, this.pos), this.event), this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.eventEndCheck = !0;
          continue
        }
        this.pos++
      }
      B()
    }
    parseLine(A, Q) {
      if (A.length === 0) return;
      let B = A.indexOf(58);
      if (B === 0) return;
      let G = "",
        Z = "";
      if (B !== -1) {
        G = A.subarray(0, B).toString("utf8");
        let I = B + 1;
        if (A[I] === 32) ++I;
        Z = A.subarray(I).toString("utf8")
      } else G = A.toString("utf8"), Z = "";
      switch (G) {
        case "data":
          if (Q[G] === void 0) Q[G] = Z;
          else Q[G] += `
${Z}`;
          break;
        case "retry":
          if (F4B(Z)) Q[G] = Z;
          break;
        case "id":
          if (K4B(Z)) Q[G] = Z;
          break;
        case "event":
          if (Z.length > 0) Q[G] = Z;
          break
      }
    }
    processEvent(A) {
      if (A.retry && F4B(A.retry)) this.state.reconnectionTime = parseInt(A.retry, 10);
      if (A.id && K4B(A.id)) this.state.lastEventId = A.id;
      if (A.data !== void 0) this.push({
        type: A.event || "message",
        options: {
          data: A.data,
          lastEventId: this.state.lastEventId,
          origin: this.state.origin
        }
      })
    }
    clearEvent() {
      this.event = {
        data: void 0,
        event: void 0,
        id: void 0,
        retry: void 0
      }
    }
  }
  H4B.exports = {
    EventSourceStream: D4B
  }
})
// @from(Start 5090159, End 5095894)
L4B = z((j_7, N4B) => {
  var {
    pipeline: ls8
  } = UA("node:stream"), {
    fetching: is8
  } = VzA(), {
    makeRequest: ns8
  } = N3A(), {
    webidl: vb
  } = zD(), {
    EventSourceStream: as8
  } = C4B(), {
    parseMIMEType: ss8
  } = QU(), {
    createFastMessageEvent: rs8
  } = P3A(), {
    isNetworkError: E4B
  } = WzA(), {
    delay: os8
  } = jv1(), {
    kEnumerableProperty: eo
  } = S6(), {
    environmentSettingsObject: z4B
  } = xw(), U4B = !1, $4B = 3000, LzA = 0, w4B = 1, MzA = 2, ts8 = "anonymous", es8 = "use-credentials";
  class y3A extends EventTarget {
    #A = {
      open: null,
      error: null,
      message: null
    };
    #Q = null;
    #B = !1;
    #Z = LzA;
    #G = null;
    #J = null;
    #I;
    #V;
    constructor(A, Q = {}) {
      super();
      vb.util.markAsUncloneable(this);
      let B = "EventSource constructor";
      if (vb.argumentLengthCheck(arguments, 1, B), !U4B) U4B = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
        code: "UNDICI-ES"
      });
      A = vb.converters.USVString(A, B, "url"), Q = vb.converters.EventSourceInitDict(Q, B, "eventSourceInitDict"), this.#I = Q.dispatcher, this.#V = {
        lastEventId: "",
        reconnectionTime: $4B
      };
      let G = z4B,
        Z;
      try {
        Z = new URL(A, G.settingsObject.baseUrl), this.#V.origin = Z.origin
      } catch (J) {
        throw new DOMException(J, "SyntaxError")
      }
      this.#Q = Z.href;
      let I = ts8;
      if (Q.withCredentials) I = es8, this.#B = !0;
      let Y = {
        redirect: "follow",
        keepalive: !0,
        mode: "cors",
        credentials: I === "anonymous" ? "same-origin" : "omit",
        referrer: "no-referrer"
      };
      Y.client = z4B.settingsObject, Y.headersList = [
        ["accept", {
          name: "accept",
          value: "text/event-stream"
        }]
      ], Y.cache = "no-store", Y.initiator = "other", Y.urlList = [new URL(this.#Q)], this.#G = ns8(Y), this.#F()
    }
    get readyState() {
      return this.#Z
    }
    get url() {
      return this.#Q
    }
    get withCredentials() {
      return this.#B
    }
    #F() {
      if (this.#Z === MzA) return;
      this.#Z = LzA;
      let A = {
          request: this.#G,
          dispatcher: this.#I
        },
        Q = (B) => {
          if (E4B(B)) this.dispatchEvent(new Event("error")), this.close();
          this.#W()
        };
      A.processResponseEndOfBody = Q, A.processResponse = (B) => {
        if (E4B(B))
          if (B.aborted) {
            this.close(), this.dispatchEvent(new Event("error"));
            return
          } else {
            this.#W();
            return
          } let G = B.headersList.get("content-type", !0),
          Z = G !== null ? ss8(G) : "failure",
          I = Z !== "failure" && Z.essence === "text/event-stream";
        if (B.status !== 200 || I === !1) {
          this.close(), this.dispatchEvent(new Event("error"));
          return
        }
        this.#Z = w4B, this.dispatchEvent(new Event("open")), this.#V.origin = B.urlList[B.urlList.length - 1].origin;
        let Y = new as8({
          eventSourceSettings: this.#V,
          push: (J) => {
            this.dispatchEvent(rs8(J.type, J.options))
          }
        });
        ls8(B.body.stream, Y, (J) => {
          if (J?.aborted === !1) this.close(), this.dispatchEvent(new Event("error"))
        })
      }, this.#J = is8(A)
    }
    async #W() {
      if (this.#Z === MzA) return;
      if (this.#Z = LzA, this.dispatchEvent(new Event("error")), await os8(this.#V.reconnectionTime), this.#Z !== LzA) return;
      if (this.#V.lastEventId.length) this.#G.headersList.set("last-event-id", this.#V.lastEventId, !0);
      this.#F()
    }
    close() {
      if (vb.brandCheck(this, y3A), this.#Z === MzA) return;
      this.#Z = MzA, this.#J.abort(), this.#G = null
    }
    get onopen() {
      return this.#A.open
    }
    set onopen(A) {
      if (this.#A.open) this.removeEventListener("open", this.#A.open);
      if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
      else this.#A.open = null
    }
    get onmessage() {
      return this.#A.message
    }
    set onmessage(A) {
      if (this.#A.message) this.removeEventListener("message", this.#A.message);
      if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
      else this.#A.message = null
    }
    get onerror() {
      return this.#A.error
    }
    set onerror(A) {
      if (this.#A.error) this.removeEventListener("error", this.#A.error);
      if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
      else this.#A.error = null
    }
  }
  var q4B = {
    CONNECTING: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: LzA,
      writable: !1
    },
    OPEN: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: w4B,
      writable: !1
    },
    CLOSED: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: MzA,
      writable: !1
    }
  };
  Object.defineProperties(y3A, q4B);
  Object.defineProperties(y3A.prototype, q4B);
  Object.defineProperties(y3A.prototype, {
    close: eo,
    onerror: eo,
    onmessage: eo,
    onopen: eo,
    readyState: eo,
    url: eo,
    withCredentials: eo
  });
  vb.converters.EventSourceInitDict = vb.dictionaryConverter([{
    key: "withCredentials",
    converter: vb.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "dispatcher",
    converter: vb.converters.any
  }]);
  N4B.exports = {
    EventSource: y3A,
    defaultReconnectionTime: $4B
  }
})
// @from(Start 5095897, End 5096831)
function OzA(A) {
  return (Q, B, G) => {
    if (typeof B === "function") G = B, B = null;
    if (!Q || typeof Q !== "string" && typeof Q !== "object" && !(Q instanceof URL)) throw new UiA("invalid url");
    if (B != null && typeof B !== "object") throw new UiA("invalid opts");
    if (B && B.path != null) {
      if (typeof B.path !== "string") throw new UiA("invalid opts.path");
      let Y = B.path;
      if (!B.path.startsWith("/")) Y = `/${Y}`;
      Q = new URL($iA.parseOrigin(Q).origin + Y)
    } else {
      if (!B) B = typeof Q === "object" ? Q : {};
      Q = $iA.parseURL(Q)
    }
    let {
      agent: Z,
      dispatcher: I = Zr8()
    } = B;
    if (Z) throw new UiA("unsupported opts.agent. Did you mean opts.client?");
    return A.call(I, {
      ...B,
      origin: Q.origin,
      path: Q.search ? `${Q.pathname}${Q.search}` : Q.pathname,
      method: B.method || (B.body ? "PUT" : "GET")
    }, G)
  }
}
// @from(Start 5096836, End 5096839)
S_7
// @from(Start 5096841, End 5096844)
Ar8
// @from(Start 5096846, End 5096849)
__7
// @from(Start 5096851, End 5096854)
k_7
// @from(Start 5096856, End 5096859)
Qr8
// @from(Start 5096861, End 5096864)
y_7
// @from(Start 5096866, End 5096869)
Br8
// @from(Start 5096871, End 5096874)
x_7
// @from(Start 5096876, End 5096879)
Gr8
// @from(Start 5096881, End 5096884)
$iA
// @from(Start 5096886, End 5096889)
UiA
// @from(Start 5096891, End 5096894)
x3A
// @from(Start 5096896, End 5096899)
v_7
// @from(Start 5096901, End 5096904)
b_7
// @from(Start 5096906, End 5096909)
f_7
// @from(Start 5096911, End 5096914)
h_7
// @from(Start 5096916, End 5096919)
g_7
// @from(Start 5096921, End 5096924)
u_7
// @from(Start 5096926, End 5096929)
Zr8
// @from(Start 5096931, End 5096934)
Ir8
// @from(Start 5096936, End 5096939)
m_7
// @from(Start 5096941, End 5096944)
d_7
// @from(Start 5096946, End 5096949)
c_7
// @from(Start 5096951, End 5096954)
Sv1
// @from(Start 5096956, End 5096959)
_v1
// @from(Start 5096961, End 5096964)
Wr8
// @from(Start 5096966, End 5096969)
Xr8
// @from(Start 5096971, End 5096974)
wiA
// @from(Start 5096976, End 5096979)
p_7
// @from(Start 5096981, End 5096984)
Vr8
// @from(Start 5096986, End 5096989)
Fr8
// @from(Start 5096991, End 5096994)
Kr8
// @from(Start 5096996, End 5096999)
Dr8
// @from(Start 5097001, End 5097004)
Hr8
// @from(Start 5097006, End 5097009)
Cr8
// @from(Start 5097011, End 5097014)
l_7
// @from(Start 5097016, End 5097019)
i_7
// @from(Start 5097021, End 5097024)
Yr8
// @from(Start 5097026, End 5097029)
Jr8
// @from(Start 5097031, End 5097034)
Er8
// @from(Start 5097036, End 5097039)
n_7
// @from(Start 5097041, End 5097044)
a_7
// @from(Start 5097046, End 5097049)
s_7
// @from(Start 5097051, End 5097054)
r_7
// @from(Start 5097056, End 5097059)
o_7
// @from(Start 5097061, End 5097064)
t_7
// @from(Start 5097066, End 5097069)
e_7
// @from(Start 5097071, End 5097074)
Ak7
// @from(Start 5097076, End 5097079)
Qk7
// @from(Start 5097081, End 5097084)
zr8
// @from(Start 5097086, End 5097089)
Ur8
// @from(Start 5097091, End 5097094)
$r8
// @from(Start 5097096, End 5097099)
wr8
// @from(Start 5097101, End 5097104)
qr8
// @from(Start 5097106, End 5097109)
Nr8
// @from(Start 5097111, End 5097114)
Bk7
// @from(Start 5097120, End 5098549)
kv1 = L(() => {
  S_7 = iEA(), Ar8 = OEA(), __7 = V3A(), k_7 = Y0B(), Qr8 = F3A(), y_7 = Lx1(), Br8 = R0B(), x_7 = y0B(), Gr8 = R7(), $iA = S6(), {
    InvalidArgumentError: UiA
  } = Gr8, x3A = RQB(), v_7 = TEA(), b_7 = ax1(), f_7 = FBB(), h_7 = rx1(), g_7 = fx1(), u_7 = PlA(), {
    getGlobalDispatcher: Zr8,
    setGlobalDispatcher: Ir8
  } = flA(), m_7 = hlA(), d_7 = UlA(), c_7 = $lA();
  Object.assign(Ar8.prototype, x3A);
  Sv1 = Qr8, _v1 = Br8, Wr8 = {
    redirect: UBB(),
    retry: wBB(),
    dump: LBB(),
    dns: PBB()
  }, Xr8 = {
    parseHeaders: $iA.parseHeaders,
    headerNameToString: $iA.headerNameToString
  };
  wiA = Ir8;
  p_7 = VzA().fetch;
  Vr8 = no().Headers, Fr8 = WzA().Response, Kr8 = N3A().Request, Dr8 = yEA().FormData, Hr8 = globalThis.File ?? UA("node:buffer").File, Cr8 = p2B().FileReader;
  ({
    setGlobalOrigin: l_7,
    getGlobalOrigin: i_7
  } = xy1()), {
    CacheStorage: Yr8
  } = e2B(), {
    kConstruct: Jr8
  } = ZiA();
  Er8 = new Yr8(Jr8);
  ({
    deleteCookie: n_7,
    getCookies: a_7,
    getSetCookies: s_7,
    setCookie: r_7
  } = F9B()), {
    parseMIMEType: o_7,
    serializeAMimeType: t_7
  } = QU(), {
    CloseEvent: e_7,
    ErrorEvent: Ak7,
    MessageEvent: Qk7
  } = P3A();
  zr8 = X4B().WebSocket, Ur8 = OzA(x3A.request), $r8 = OzA(x3A.stream), wr8 = OzA(x3A.pipeline), qr8 = OzA(x3A.connect), Nr8 = OzA(x3A.upgrade);
  ({
    EventSource: Bk7
  } = L4B())
})
// @from(Start 5098592, End 5098722)
function yv1() {
  let A = XT();
  if (!A) return;
  return {
    cert: A.cert,
    key: A.key,
    passphrase: A.passphrase
  }
}
// @from(Start 5098724, End 5099022)
function xv1() {
  let A = XT();
  if (!A) return {};
  let Q = {
      cert: A.cert,
      key: A.key,
      passphrase: A.passphrase
    },
    B = new Sv1({
      connect: Q,
      pipelining: 1
    });
  return g("mTLS: Created undici agent with custom certificates"), {
    dispatcher: B
  }
}
// @from(Start 5099024, End 5099188)
function R4B() {
  if (!XT()) return;
  if (process.env.NODE_EXTRA_CA_CERTS) g("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs")
}
// @from(Start 5099193, End 5099195)
XT
// @from(Start 5099197, End 5099200)
O4B
// @from(Start 5099206, End 5100363)
v3A = L(() => {
  l2();
  kv1();
  V0();
  AQ();
  XT = s1(() => {
    let A = {};
    if (process.env.CLAUDE_CODE_CLIENT_CERT) try {
      A.cert = RA().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, {
        encoding: "utf8"
      }), g("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT")
    } catch (Q) {
      g(`mTLS: Failed to load client certificate: ${Q}`, {
        level: "error"
      })
    }
    if (process.env.CLAUDE_CODE_CLIENT_KEY) try {
      A.key = RA().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, {
        encoding: "utf8"
      }), g("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY")
    } catch (Q) {
      g(`mTLS: Failed to load client key: ${Q}`, {
        level: "error"
      })
    }
    if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) A.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, g("mTLS: Using client key passphrase");
    if (Object.keys(A).length === 0) return;
    return A
  }), O4B = s1(() => {
    let A = XT();
    if (!A) return;
    let Q = {
      ...A,
      keepAlive: !0
    };
    return g("mTLS: Creating HTTPS agent with custom certificates"), new Lr8(Q)
  })
})
// @from(Start 5100366, End 5100627)
function Mr8(A) {
  switch (A.family) {
    case 0:
    case 4:
    case 6:
      return A.family;
    case "IPv6":
      return 6;
    case "IPv4":
    case void 0:
      return 4;
    default:
      throw Error(`Unsupported address family: ${A.family}`)
  }
}
// @from(Start 5100629, End 5100758)
function Sc() {
  return process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY
}
// @from(Start 5100760, End 5100832)
function Or8() {
  return process.env.no_proxy || process.env.NO_PROXY
}
// @from(Start 5100834, End 5101371)
function qiA(A) {
  let Q = Or8();
  if (!Q) return !1;
  if (Q === "*") return !0;
  try {
    let B = new URL(A),
      G = B.hostname.toLowerCase(),
      Z = B.port || (B.protocol === "https:" ? "443" : "80"),
      I = `${G}:${Z}`;
    return Q.split(/[,\s]+/).filter(Boolean).some((J) => {
      if (J = J.toLowerCase().trim(), J.includes(":")) return I === J;
      if (J.startsWith(".")) {
        let W = J;
        return G === J.substring(1) || G.endsWith(W)
      }
      return G === J
    })
  } catch {
    return !1
  }
}
// @from(Start 5101373, End 5101673)
function j4B(A) {
  let Q = XT(),
    B = {
      ...Q && {
        cert: Q.cert,
        key: Q.key,
        passphrase: Q.passphrase
      }
    };
  if (Y0(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS)) B.lookup = (G, Z, I) => {
    I(null, G, Mr8(Z))
  };
  return new vv1.HttpsProxyAgent(A, B)
}
// @from(Start 5101675, End 5101766)
function RzA(A) {
  let Q = Sc();
  if (!Q) return;
  if (qiA(A)) return;
  return j4B(Q)
}
// @from(Start 5101768, End 5101874)
function b3A() {
  let A = Sc(),
    Q = xv1();
  if (A) return {
    dispatcher: S4B(A)
  };
  return Q
}
// @from(Start 5101876, End 5102354)
function _4B() {
  let A = Sc(),
    Q = O4B();
  if (A) {
    YQ.defaults.proxy = !1;
    let B = j4B(A);
    YQ.interceptors.request.use((G) => {
      if (G.url && qiA(G.url))
        if (Q) G.httpsAgent = Q, G.httpAgent = Q;
        else delete G.httpsAgent, delete G.httpAgent;
      else G.httpsAgent = B, G.httpAgent = B;
      return G
    }), wiA(S4B(A))
  } else if (Q) {
    YQ.defaults.httpsAgent = Q;
    let B = xv1();
    if (B.dispatcher) wiA(B.dispatcher)
  }
}
// @from(Start 5102356, End 5102671)
function k4B() {
  let A = Sc();
  if (!A) return {};
  let Q = new vv1.HttpsProxyAgent(A),
    B = new P4B.NodeHttpHandler({
      httpAgent: Q,
      httpsAgent: Q
    });
  return {
    requestHandler: B,
    credentials: T4B.defaultProvider({
      clientConfig: {
        requestHandler: B
      }
    })
  }
}
// @from(Start 5102676, End 5102679)
T4B
// @from(Start 5102681, End 5102684)
P4B
// @from(Start 5102686, End 5102689)
vv1
// @from(Start 5102691, End 5102694)
S4B
// @from(Start 5102700, End 5103114)
_c = L(() => {
  O3();
  l2();
  kv1();
  v3A();
  hQ();
  T4B = BA(Iy1(), 1), P4B = BA(IZ(), 1), vv1 = BA(LEA(), 1);
  S4B = s1((A) => {
    let Q = XT(),
      B = {
        httpProxy: A,
        httpsProxy: A,
        noProxy: process.env.NO_PROXY || process.env.no_proxy
      };
    if (Q) B.connect = {
      cert: Q.cert,
      key: Q.key,
      passphrase: Q.passphrase
    };
    return new _v1(B)
  })
})
// @from(Start 5103117, End 5103184)
function w_(A, Q) {
  return A.find((B) => B.includes(Q)) ?? null
}
// @from(Start 5103185, End 5103514)
async function x4B() {
  let Q = {
    region: hBA(),
    ...k4B()
  };
  if (!process.env.AWS_BEARER_TOKEN_BEDROCK) {
    let B = await h3A();
    if (B) Q.credentials = {
      accessKeyId: B.accessKeyId,
      secretAccessKey: B.secretAccessKey,
      sessionToken: B.sessionToken
    }
  }
  return new f3A.BedrockClient(Q)
}
// @from(Start 5103519, End 5103522)
f3A
// @from(Start 5103524, End 5103527)
y4B
// @from(Start 5103529, End 5103532)
v4B
// @from(Start 5103538, End 5104699)
bv1 = L(() => {
  l2();
  hQ();
  g1();
  _c();
  gB();
  f3A = BA(CgQ(), 1), y4B = s1(async function() {
    let A = await x4B(),
      Q = [],
      B;
    try {
      do {
        let G = new f3A.ListInferenceProfilesCommand({
            ...B && {
              nextToken: B
            },
            typeEquals: "SYSTEM_DEFINED"
          }),
          Z = await A.send(G);
        if (Z.inferenceProfileSummaries) Q.push(...Z.inferenceProfileSummaries);
        B = Z.nextToken
      } while (B);
      return Q.filter((G) => G.inferenceProfileId?.includes("anthropic")).map((G) => G.inferenceProfileId).filter(Boolean)
    } catch (G) {
      throw AA(G), G
    }
  });
  v4B = s1(async function(A) {
    try {
      let Q = await x4B(),
        B = new f3A.GetInferenceProfileCommand({
          inferenceProfileIdentifier: A
        }),
        G = await Q.send(B);
      if (!G.models || G.models.length === 0) return null;
      let Z = G.models[0];
      if (!Z?.modelArn) return null;
      let I = Z.modelArn.lastIndexOf("/");
      return I >= 0 ? Z.modelArn.substring(I + 1) : Z.modelArn
    } catch (Q) {
      return AA(Q), null
    }
  })
})
// @from(Start 5104702, End 5105524)
function b4B(A) {
  if (V6() === "foundry") return;
  let Q = A.toLowerCase();
  if (Q.includes("claude-sonnet-4-5") && Q.includes("[1m]")) return "Sonnet 4.5 (with 1M context)";
  if (Q.includes("claude-sonnet-4-5")) return "Sonnet 4.5";
  if (Q.includes("claude-sonnet-4") && Q.includes("[1m]")) return "Sonnet 4 (with 1M context)";
  if (Q.includes("claude-sonnet-4")) return "Sonnet 4";
  if (Q.includes("claude-opus-4-5")) return "Opus 4.5";
  if (Q.includes("claude-opus-4-1")) return "Opus 4.1";
  if (Q.includes("claude-opus-4")) return "Opus 4";
  if (Q.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
  if (Q.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
  if (Q.includes("claude-haiku-4-5")) return "Haiku 4.5";
  if (Q.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
  return
}
// @from(Start 5105529, End 5105532)
TzA
// @from(Start 5105534, End 5105537)
PzA
// @from(Start 5105539, End 5105542)
jzA
// @from(Start 5105544, End 5105547)
SzA
// @from(Start 5105549, End 5105551)
At
// @from(Start 5105553, End 5105556)
fv1
// @from(Start 5105558, End 5105561)
_zA
// @from(Start 5105563, End 5105566)
kzA
// @from(Start 5105568, End 5105571)
yzA
// @from(Start 5105577, End 5107310)
xzA = L(() => {
  lK();
  TzA = {
    firstParty: "claude-3-7-sonnet-20250219",
    bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    vertex: "claude-3-7-sonnet@20250219",
    foundry: "claude-3-7-sonnet"
  }, PzA = {
    firstParty: "claude-3-5-sonnet-20241022",
    bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    vertex: "claude-3-5-sonnet-v2@20241022",
    foundry: "claude-3-5-sonnet"
  }, jzA = {
    firstParty: "claude-3-5-haiku-20241022",
    bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    vertex: "claude-3-5-haiku@20241022",
    foundry: "claude-3-5-haiku"
  }, SzA = {
    firstParty: "claude-haiku-4-5-20251001",
    bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    vertex: "claude-haiku-4-5@20251001",
    foundry: "claude-haiku-4-5"
  }, At = {
    firstParty: "claude-sonnet-4-20250514",
    bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
    vertex: "claude-sonnet-4@20250514",
    foundry: "claude-sonnet-4"
  }, fv1 = {
    firstParty: "claude-sonnet-4-5-20250929",
    bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    vertex: "claude-sonnet-4-5@20250929",
    foundry: "claude-sonnet-4-5"
  }, _zA = {
    firstParty: "claude-opus-4-20250514",
    bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
    vertex: "claude-opus-4@20250514",
    foundry: "claude-opus-4"
  }, kzA = {
    firstParty: "claude-opus-4-1-20250805",
    bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
    vertex: "claude-opus-4-1@20250805",
    foundry: "claude-opus-4-1"
  }, yzA = {
    firstParty: "claude-opus-4-5-20251101",
    bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
    vertex: "claude-opus-4-5@20251101",
    foundry: "claude-opus-4-5"
  }
})
// @from(Start 5107313, End 5107904)
function q_(A) {
  let Q = [],
    B = !1;
  async function G() {
    if (B) return;
    if (Q.length === 0) return;
    B = !0;
    while (Q.length > 0) {
      let {
        args: Z,
        resolve: I,
        reject: Y,
        context: J
      } = Q.shift();
      try {
        let W = await A.apply(J, Z);
        I(W)
      } catch (W) {
        Y(W)
      }
    }
    if (B = !1, Q.length > 0) G()
  }
  return function(...Z) {
    return new Promise((I, Y) => {
      Q.push({
        args: Z,
        resolve: I,
        reject: Y,
        context: this
      }), G()
    })
  }
}
// @from(Start 5107906, End 5108128)
function NiA(A) {
  return {
    haiku35: jzA[A],
    haiku45: SzA[A],
    sonnet35: PzA[A],
    sonnet37: TzA[A],
    sonnet40: At[A],
    sonnet45: fv1[A],
    opus40: _zA[A],
    opus41: kzA[A],
    opus45: yzA[A]
  }
}
// @from(Start 5108129, End 5108972)
async function Rr8() {
  let A;
  try {
    A = await y4B()
  } catch (V) {
    return AA(V), NiA("bedrock")
  }
  if (!A?.length) return NiA("bedrock");
  let Q = w_(A, "claude-3-5-haiku-20241022"),
    B = w_(A, "claude-haiku-4-5-20251001"),
    G = w_(A, "claude-3-5-sonnet-20241022"),
    Z = w_(A, "claude-3-7-sonnet-20250219"),
    I = w_(A, "claude-sonnet-4-20250514"),
    Y = w_(A, "claude-sonnet-4-5-20250929"),
    J = w_(A, "claude-opus-4-20250514"),
    W = w_(A, "claude-opus-4-1-20250805"),
    X = w_(A, "claude-opus-4-5-20251101");
  return {
    haiku35: Q || jzA.bedrock,
    haiku45: B || SzA.bedrock,
    sonnet35: G || PzA.bedrock,
    sonnet37: Z || TzA.bedrock,
    sonnet40: I || At.bedrock,
    sonnet45: Y || fv1.bedrock,
    opus40: J || _zA.bedrock,
    opus41: W || kzA.bedrock,
    opus45: X || yzA.bedrock
  }
}
// @from(Start 5108974, End 5109093)
function Pr8() {
  if ($kA() !== null) return;
  if (V6() !== "bedrock") {
    RX1(NiA(V6()));
    return
  }
  Tr8()
}
// @from(Start 5109095, End 5109183)
function eI() {
  let A = $kA();
  if (A === null) return Pr8(), NiA(V6());
  return A
}
// @from(Start 5109188, End 5109191)
Tr8
// @from(Start 5109197, End 5109405)
hv1 = L(() => {
  _0();
  g1();
  bv1();
  xzA();
  lK();
  Tr8 = q_(async () => {
    if ($kA() !== null) return;
    try {
      let A = await Rr8();
      RX1(A)
    } catch (A) {
      AA(A)
    }
  })
})
// @from(Start 5109408, End 5109549)
function f4B() {
  if (process.platform === "darwin") {
    let A = em();
    tG(`security delete-generic-password -a $USER -s "${A}"`)
  }
}
// @from(Start 5109551, End 5109591)
function dw(A) {
  return A.slice(-20)
}
// @from(Start 5109596, End 5109631)
vzA = L(() => {
  _DA();
  hyA()
})
// @from(Start 5109633, End 5110673)
class vH {
  static instance = null;
  status = {
    isAuthenticating: !1,
    output: []
  };
  listeners = new Set;
  static getInstance() {
    if (!vH.instance) vH.instance = new vH;
    return vH.instance
  }
  getStatus() {
    return {
      ...this.status,
      output: [...this.status.output]
    }
  }
  startAuthentication() {
    this.status = {
      isAuthenticating: !0,
      output: []
    }, this.notifyListeners()
  }
  addOutput(A) {
    this.status.output.push(A), this.notifyListeners()
  }
  setError(A) {
    this.status.error = A, this.notifyListeners()
  }
  endAuthentication(A) {
    if (A) this.status = {
      isAuthenticating: !1,
      output: []
    };
    else this.status.isAuthenticating = !1;
    this.notifyListeners()
  }
  subscribe(A) {
    return this.listeners.add(A), () => {
      this.listeners.delete(A)
    }
  }
  notifyListeners() {
    this.listeners.forEach((A) => A(this.getStatus()))
  }
  static reset() {
    if (vH.instance) vH.instance.listeners.clear(), vH.instance = null
  }
}
// @from(Start 5110722, End 5111208)
function JU() {
  let A = Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY),
    B = (l0() || {}).apiKeyHelper,
    G = process.env.ANTHROPIC_AUTH_TOKEN || B || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
    {
      source: Z
    } = cw({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
  return !(A || G || (Z === "ANTHROPIC_API_KEY" || Z === "apiKeyHelper") && !Y0(process.env.CLAUDE_CODE_REMOTE))
}
// @from(Start 5111210, End 5111781)
function kc() {
  if (process.env.ANTHROPIC_AUTH_TOKEN) return {
    source: "ANTHROPIC_AUTH_TOKEN",
    hasToken: !0
  };
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
    source: "CLAUDE_CODE_OAUTH_TOKEN",
    hasToken: !0
  };
  if (sz1()) return {
    source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
    hasToken: !0
  };
  if (bzA()) return {
    source: "apiKeyHelper",
    hasToken: !0
  };
  let B = M6();
  if (wv(B?.scopes) && B?.accessToken) return {
    source: "claude.ai",
    hasToken: !0
  };
  return {
    source: "none",
    hasToken: !1
  }
}
// @from(Start 5111783, End 5111842)
function Kw() {
  let {
    key: A
  } = cw();
  return A
}
// @from(Start 5111844, End 5111991)
function g4B() {
  let {
    key: A,
    source: Q
  } = cw({
    skipRetrievingKeyFromApiKeyHelper: !0
  });
  return A !== null && Q !== "none"
}
// @from(Start 5111993, End 5113272)
function cw(A = {}) {
  if (Gz0() && process.env.ANTHROPIC_API_KEY) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  if (Y0(!1)) {
    let G = rz1();
    if (G) return {
      key: G,
      source: "ANTHROPIC_API_KEY"
    };
    if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    if (process.env.ANTHROPIC_API_KEY) return {
      key: process.env.ANTHROPIC_API_KEY,
      source: "ANTHROPIC_API_KEY"
    };
    return {
      key: null,
      source: "none"
    }
  }
  if (process.env.ANTHROPIC_API_KEY && N1().customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY))) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  let Q = rz1();
  if (Q) return {
    key: Q,
    source: "ANTHROPIC_API_KEY"
  };
  if (A.skipRetrievingKeyFromApiKeyHelper) {
    if (bzA()) return {
      key: null,
      source: "apiKeyHelper"
    }
  } else {
    let G = fzA(N6());
    if (G) return {
      key: G,
      source: "apiKeyHelper"
    }
  }
  let B = hzA();
  if (B) return B;
  return {
    key: null,
    source: "none"
  }
}
// @from(Start 5113274, End 5113327)
function bzA() {
  return (l0() || {}).apiKeyHelper
}
// @from(Start 5113329, End 5113503)
function u4B() {
  let A = bzA();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.apiKeyHelper === A || B?.apiKeyHelper === A
}
// @from(Start 5113505, End 5113560)
function gv1() {
  return (l0() || {}).awsAuthRefresh
}
// @from(Start 5113562, End 5113740)
function m4B() {
  let A = gv1();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.awsAuthRefresh === A || B?.awsAuthRefresh === A
}
// @from(Start 5113742, End 5113802)
function uv1() {
  return (l0() || {}).awsCredentialExport
}
// @from(Start 5113804, End 5113992)
function d4B() {
  let A = uv1();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.awsCredentialExport === A || B?.awsCredentialExport === A
}
// @from(Start 5113994, End 5114300)
function _r8() {
  let A = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!Number.isNaN(Q) && Q >= 0) return Q;
    g(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${A}`, {
      level: "error"
    })
  }
  return Sr8
}
// @from(Start 5114302, End 5114340)
function LiA() {
  fzA.cache.clear()
}
// @from(Start 5114342, End 5114438)
function c4B(A) {
  if (bzA()) {
    if (u4B()) {
      if (!TJ(!0)) return
    }
  }
  fzA(A)
}
// @from(Start 5114439, End 5115288)
async function yr8() {
  let A = gv1();
  if (!A) return !1;
  if (m4B()) {
    if (!TJ(!0) && !N6()) {
      let B = Error(`Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
      return uN("awsAuthRefresh invoked before trust check", B), GA("tengu_awsAuthRefresh_missing_trust", {}), !1
    }
  }
  try {
    return g("Fetching AWS caller identity for AWS auth refresh command"), await DT1(), g("Fetched AWS caller identity, skipping AWS auth refresh command"), !1
  } catch {
    return p4B(A)
  }
}
// @from(Start 5115290, End 5116035)
function p4B(A) {
  g("Running AWS auth refresh command");
  let Q = vH.getInstance();
  return Q.startAuthentication(), new Promise((B) => {
    let G = jr8(A);
    G.stdout.on("data", (Z) => {
      let I = Z.toString().trim();
      if (I) Q.addOutput(I), g(I, {
        level: "debug"
      })
    }), G.stderr.on("data", (Z) => {
      let I = Z.toString().trim();
      if (I) Q.setError(I), g(I, {
        level: "error"
      })
    }), G.on("close", (Z) => {
      if (Z === 0) g("AWS auth refresh completed successfully"), Q.endAuthentication(!0), B(!0);
      else {
        let I = tA.red("Error running awsAuthRefresh (in settings or ~/.claude.json):");
        console.error(I), Q.endAuthentication(!1), B(!1)
      }
    })
  })
}
// @from(Start 5116036, End 5117770)
async function xr8() {
  let A = uv1();
  if (!A) return null;
  if (d4B()) {
    if (!TJ(!0) && !N6()) {
      let B = Error(`Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
      return uN("awsCredentialExport invoked before trust check", B), GA("tengu_awsCredentialExport_missing_trust", {}), null
    }
  }
  try {
    return g("Fetching AWS caller identity for credential export command"), await DT1(), g("Fetched AWS caller identity, skipping AWS credential export command"), null
  } catch {
    try {
      g("Running AWS credential export command");
      let Q = tG(A)?.toString().trim();
      if (!Q) throw Error("awsCredentialExport did not return a valid value");
      let B = JSON.parse(Q);
      if (!BTQ(B)) throw Error("awsCredentialExport did not return valid AWS STS output structure");
      return g("AWS credentials retrieved from awsCredentialExport"), {
        accessKeyId: B.Credentials.AccessKeyId,
        secretAccessKey: B.Credentials.SecretAccessKey,
        sessionToken: B.Credentials.SessionToken
      }
    } catch (Q) {
      let B = tA.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
      if (Q instanceof Error && "stderr" in Q) console.error(B, String(Q.stderr));
      else if (Q instanceof Error) console.error(B, Q.message);
      else console.error(B, Q);
      return null
    }
  }
}
// @from(Start 5117772, End 5117810)
function MiA() {
  h3A.cache.clear()
}
// @from(Start 5117812, End 5117961)
function l4B() {
  let A = gv1(),
    Q = uv1();
  if (!A && !Q) return;
  if (m4B() || d4B()) {
    if (!TJ(!0) && !N6()) return
  }
  h3A(), eI()
}
// @from(Start 5117963, End 5118018)
function vr8(A) {
  return /^[a-zA-Z0-9-_]+$/.test(A)
}
// @from(Start 5118020, End 5119066)
function Po0(A) {
  if (!vr8(A)) throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
  let Q = N1();
  if (n4B(), process.platform === "darwin") try {
    let G = em(),
      Z = SDA(),
      I = Buffer.from(A, "utf-8").toString("hex"),
      Y = `add-generic-password -U -a "${Z}" -s "${G}" -X "${I}"
`;
    tG("security -i", {
      input: Y,
      stdio: ["pipe", "pipe", "pipe"]
    }), GA("tengu_api_key_saved_to_keychain", {})
  } catch (G) {
    AA(G), GA("tengu_api_key_keychain_error", {
      error: G.message
    }), Q.primaryApiKey = A, GA("tengu_api_key_saved_to_config", {})
  } else Q.primaryApiKey = A, GA("tengu_api_key_saved_to_config", {});
  if (!Q.customApiKeyResponses) Q.customApiKeyResponses = {
    approved: [],
    rejected: []
  };
  if (!Q.customApiKeyResponses.approved) Q.customApiKeyResponses.approved = [];
  let B = dw(A);
  if (!Q.customApiKeyResponses.approved.includes(B)) Q.customApiKeyResponses.approved.push(B);
  c0(Q), hzA.cache.clear?.()
}
// @from(Start 5119068, End 5119166)
function i4B() {
  n4B();
  let A = N1();
  A.primaryApiKey = void 0, c0(A), hzA.cache.clear?.()
}
// @from(Start 5119168, End 5119234)
function n4B() {
  try {
    f4B()
  } catch (A) {
    AA(A)
  }
}
// @from(Start 5119236, End 5120206)
function gzA(A) {
  if (!wv(A.scopes)) return GA("tengu_oauth_tokens_not_claude_ai", {}), {
    success: !0
  };
  if (!A.refreshToken || !A.expiresAt) return GA("tengu_oauth_tokens_inference_only", {}), {
    success: !0
  };
  let Q = Fw(),
    B = Q.name;
  try {
    let G = Q.read() || {};
    G.claudeAiOauth = {
      accessToken: A.accessToken,
      refreshToken: A.refreshToken,
      expiresAt: A.expiresAt,
      scopes: A.scopes,
      subscriptionType: A.subscriptionType,
      rateLimitTier: A.rateLimitTier
    };
    let Z = Q.update(G);
    if (Z.success) GA("tengu_oauth_tokens_saved", {
      storageBackend: B
    });
    else GA("tengu_oauth_tokens_save_failed", {
      storageBackend: B
    });
    return M6.cache?.clear?.(), x4A(), Z
  } catch (G) {
    return AA(G), GA("tengu_oauth_tokens_save_exception", {
      storageBackend: B,
      error: G.message
    }), {
      success: !1,
      warning: "Failed to save OAuth tokens"
    }
  }
}
// @from(Start 5120207, End 5121290)
async function Qt(A = 0) {
  let B = M6();
  if (!B?.refreshToken || !Ad(B.expiresAt)) return !1;
  if (!wv(B.scopes)) return !1;
  if (M6.cache?.clear?.(), B = M6(), !B?.refreshToken || !Ad(B.expiresAt)) return !1;
  let G = MQ();
  RA().mkdirSync(G);
  let I;
  try {
    I = await h4B.lock(G)
  } catch (Y) {
    if (Y.code === "ELOCKED") {
      if (A < 5) return GA("tengu_oauth_token_refresh_lock_retry", {
        retryCount: A + 1
      }), await new Promise((J) => setTimeout(J, 1000 + Math.random() * 1000)), Qt(A + 1);
      return GA("tengu_oauth_token_refresh_lock_retry_limit_reached", {
        maxRetries: 5
      }), !1
    }
    return AA(Y), GA("tengu_oauth_token_refresh_lock_error", {
      error: Y.message
    }), !1
  }
  try {
    if (M6.cache?.clear?.(), B = M6(), !B?.refreshToken || !Ad(B.expiresAt)) return GA("tengu_oauth_token_refresh_race_resolved", {}), !1;
    let Y = await Mo0(B.refreshToken);
    return gzA(Y), M6.cache?.clear?.(), !0
  } catch (Y) {
    return AA(Y instanceof Error ? Y : Error(String(Y))), !1
  } finally {
    await I()
  }
}
// @from(Start 5121292, End 5121359)
function BB() {
  if (!JU()) return !1;
  return wv(M6()?.scopes)
}
// @from(Start 5121361, End 5121557)
function a4B() {
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !1;
  if (BB()) return !1;
  return !0
}
// @from(Start 5121559, End 5121619)
function t6() {
  return JU() ? N1().oauthAccount : void 0
}
// @from(Start 5121621, End 5121823)
function pw() {
  let A = t6(),
    Q = f4();
  return Q === "max" || Q === "enterprise" || Q === "team" || Q === "pro" && (!o2("tengu_backstage_only") || A?.hasExtraUsageEnabled === !0) || Q === null
}
// @from(Start 5121825, End 5121970)
function f4() {
  if (yo0()) return ko0();
  if (!JU()) return null;
  let A = M6();
  if (!A) return null;
  return A.subscriptionType ?? null
}
// @from(Start 5121972, End 5122087)
function yc() {
  if (!JU()) return null;
  let A = M6();
  if (!A) return null;
  return A.rateLimitTier ?? null
}
// @from(Start 5122089, End 5122356)
function mv1() {
  switch (f4()) {
    case "enterprise":
      return "Claude Enterprise";
    case "team":
      return "Claude Team";
    case "max":
      return "Claude Max";
    case "pro":
      return "Claude Pro";
    default:
      return "Claude API"
  }
}
// @from(Start 5122358, End 5122513)
function N_() {
  return !!(Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY))
}
// @from(Start 5122515, End 5122573)
function s4B() {
  return (l0() || {}).otelHeadersHelper
}
// @from(Start 5122575, End 5122759)
function uzA() {
  let A = s4B();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.otelHeadersHelper === A || B?.otelHeadersHelper === A
}
// @from(Start 5122761, End 5123502)
function r4B() {
  let A = s4B();
  if (!A) return {};
  if (uzA()) {
    if (!TJ(!0)) return {}
  }
  try {
    let Q = tG(A)?.toString().trim();
    if (!Q) throw Error("otelHeadersHelper did not return a valid value");
    let B = JSON.parse(Q);
    if (typeof B !== "object" || B === null || Array.isArray(B)) throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
    for (let [G, Z] of Object.entries(B))
      if (typeof Z !== "string") throw Error(`otelHeadersHelper returned non-string value for key "${G}": ${typeof Z}`);
    return B
  } catch (Q) {
    throw AA(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${Q instanceof Error?Q.message:String(Q)}`)), Q
  }
}
// @from(Start 5123504, End 5123559)
function br8(A) {
  return A === "max" || A === "pro"
}
// @from(Start 5123561, End 5123633)
function OiA() {
  let A = f4();
  return BB() && A !== null && br8(A)
}
// @from(Start 5123635, End 5124112)
function RiA() {
  if (V6() !== "firstParty") return;
  let {
    source: Q
  } = kc(), B = {};
  if (BB()) B.subscription = mv1();
  else B.tokenSource = Q;
  let {
    key: G,
    source: Z
  } = cw();
  if (G) B.apiKeySource = Z;
  if (Q === "claude.ai" || Z === "/login managed key") {
    let Y = t6()?.organizationName;
    if (Y) B.organization = Y
  }
  let I = t6()?.emailAddress;
  if ((Q === "claude.ai" || Z === "/login managed key") && I) B.email = I;
  return B
}
// @from(Start 5124117, End 5124120)
h4B
// @from(Start 5124122, End 5124134)
Sr8 = 300000
// @from(Start 5124138, End 5124141)
fzA
// @from(Start 5124143, End 5124156)
kr8 = 3600000
// @from(Start 5124160, End 5124163)
h3A
// @from(Start 5124165, End 5124168)
hzA
// @from(Start 5124170, End 5124172)
M6
// @from(Start 5124178, End 5126741)
gB = L(() => {
  jQ();
  MB();
  _8();
  l2();
  hbA();
  g1();
  V0();
  F9();
  mbA();
  No0();
  AL();
  lbA();
  CS();
  AQ();
  hQ();
  _DA();
  _0();
  HT1();
  q0();
  lK();
  hv1();
  vzA();
  u2();
  h4B = BA(T4A(), 1);
  fzA = dz1((A) => {
    let Q = bzA();
    if (!Q) return null;
    if (u4B()) {
      if (!TJ(!0) && !A) {
        let G = Error(`Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
        uN("apiKeyHelper invoked before trust check", G), GA("tengu_apiKeyHelper_missing_trust7", {})
      }
    }
    try {
      let B = tG(Q)?.toString().trim();
      if (!B) throw Error("apiKeyHelper did not return a valid value");
      return B
    } catch (B) {
      let G = tA.red("Error getting API key from apiKeyHelper (in settings or ~/.claude.json):");
      if (B instanceof Error && "stderr" in B) console.error(G, String(B.stderr));
      else if (B instanceof Error) console.error(G, B.message);
      else console.error(G, B);
      return " "
    }
  }, _r8());
  h3A = dz1(async () => {
    let A = await yr8(),
      Q = await xr8();
    if (A || Q) await GTQ();
    return Q
  }, kr8);
  hzA = s1(() => {
    if (process.platform === "darwin") {
      let Q = em();
      try {
        let B = tG(`security find-generic-password -a $USER -w -s "${Q}"`);
        if (B) return {
          key: B,
          source: "/login managed key"
        }
      } catch (B) {
        AA(B)
      }
    }
    let A = N1();
    if (!A.primaryApiKey) return null;
    return {
      key: A.primaryApiKey,
      source: "/login managed key"
    }
  });
  M6 = s1(() => {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
      accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
      refreshToken: null,
      expiresAt: null,
      scopes: ["user:inference"],
      subscriptionType: null,
      rateLimitTier: null
    };
    let A = sz1();
    if (A) return {
      accessToken: A,
      refreshToken: null,
      expiresAt: null,
      scopes: ["user:inference"],
      subscriptionType: null,
      rateLimitTier: null
    };
    try {
      let G = Fw().read()?.claudeAiOauth;
      if (!G?.accessToken) return null;
      return G
    } catch (Q) {
      return AA(Q), null
    }
  })
})
// @from(Start 5126956, End 5127354)
function TJ(A) {
  let Q = xc(nK(), lw);
  if (Q.bypassPermissionsModeAccepted) return !0;
  let B = lv1();
  if (Q.projects?.[B]?.hasTrustDialogAccepted) return !0;
  let Z = W0();
  if (A) return Q.projects?.[Z]?.hasTrustDialogAccepted === !0;
  while (!0) {
    if (Q.projects?.[Z]?.hasTrustDialogAccepted) return !0;
    let Y = t4B(Z, "..");
    if (Y === Z) break;
    Z = Y
  }
  return !1
}
// @from(Start 5127356, End 5127721)
function c0(A) {
  try {
    B8B(nK(), lw, (Q) => ({
      ...A,
      projects: o4B(Q.projects)
    })), bb.config = null, bb.mtime = 0
  } catch (Q) {
    g(`Failed to save config with lock: ${Q}`, {
      level: "error"
    });
    let B = xc(nK(), lw);
    Q8B(nK(), {
      ...A,
      projects: o4B(B.projects)
    }, lw), bb.config = null, bb.mtime = 0
  }
}
// @from(Start 5127723, End 5128231)
function dv1(A) {
  if (A.installMethod !== void 0) return A;
  let Q = "unknown",
    B = A.autoUpdates ?? !0;
  switch (A.autoUpdaterStatus) {
    case "migrated":
      Q = "local";
      break;
    case "installed":
      Q = "native";
      break;
    case "disabled":
      B = !1;
      break;
    case "enabled":
    case "no_permissions":
    case "not_configured":
      Q = "global";
      break;
    case void 0:
      break
  }
  return {
    ...A,
    installMethod: Q,
    autoUpdates: B
  }
}
// @from(Start 5128233, End 5128497)
function o4B(A) {
  if (!A) return A;
  let Q = {},
    B = !1;
  for (let [G, Z] of Object.entries(A))
    if (Z.history !== void 0) {
      B = !0;
      let {
        history: I,
        ...Y
      } = Z;
      Q[G] = Y
    } else Q[G] = Z;
  return B ? Q : A
}
// @from(Start 5128499, End 5128893)
function N1() {
  try {
    let A = RA().existsSync(nK()) ? RA().statSync(nK()) : null;
    if (bb.config && A) {
      if (A.mtimeMs <= bb.mtime) return bb.config
    }
    let Q = dv1(xc(nK(), lw));
    if (A) bb = {
      config: Q,
      mtime: A.mtimeMs
    };
    else bb = {
      config: Q,
      mtime: Date.now()
    };
    return dv1(Q)
  } catch {
    return dv1(xc(nK(), lw))
  }
}
// @from(Start 5128895, End 5129091)
function TiA(A) {
  let Q = N1();
  if (Q.customApiKeyResponses?.approved?.includes(A)) return "approved";
  if (Q.customApiKeyResponses?.rejected?.includes(A)) return "rejected";
  return "new"
}
// @from(Start 5129093, End 5129410)
function Q8B(A, Q, B) {
  let G = e4B(A),
    Z = RA();
  if (!Z.existsSync(G)) Z.mkdirSync(G);
  let I = Object.fromEntries(Object.entries(Q).filter(([Y, J]) => JSON.stringify(J) !== JSON.stringify(B[Y])));
  L_(A, JSON.stringify(I, null, 2), {
    encoding: "utf-8",
    mode: !Z.existsSync(A) ? 384 : void 0
  })
}
// @from(Start 5129412, End 5130234)
function B8B(A, Q, B) {
  let G = e4B(A),
    Z = RA();
  if (!Z.existsSync(G)) Z.mkdirSync(G);
  let I;
  try {
    let Y = `${A}.lock`,
      J = Date.now();
    if (I = A8B.lockSync(A, {
        lockfilePath: Y
      }), Date.now() - J > 100) g("Lock acquisition took longer than expected - another Claude instance may be running");
    let X = xc(A, Q),
      V = B(X),
      F = Object.fromEntries(Object.entries(V).filter(([K, D]) => JSON.stringify(D) !== JSON.stringify(Q[K])));
    if (Z.existsSync(A)) try {
      let K = `${A}.backup`;
      Z.copyFileSync(A, K)
    } catch (K) {
      g(`Failed to backup config: ${K}`, {
        level: "error"
      })
    }
    L_(A, JSON.stringify(F, null, 2), {
      encoding: "utf-8",
      mode: !Z.existsSync(A) ? 384 : void 0
    })
  } finally {
    if (I) I()
  }
}
// @from(Start 5130236, End 5130302)
function PiA() {
  if (pv1) return;
  pv1 = !0, xc(nK(), lw, !0)
}
// @from(Start 5130304, End 5131759)
function xc(A, Q, B) {
  if (!pv1) throw Error("Config accessed before allowed.");
  let G = RA();
  if (!G.existsSync(A)) {
    let Z = `${A}.backup`;
    if (G.existsSync(Z)) process.stdout.write(`
Claude configuration file not found at: ${A}
A backup file exists at: ${Z}
You can manually restore it by running: cp "${Z}" "${A}"

`);
    return Yv(Q)
  }
  try {
    let Z = G.readFileSync(A, {
      encoding: "utf-8"
    });
    try {
      let I = JSON.parse(Z);
      return {
        ...Yv(Q),
        ...I
      }
    } catch (I) {
      let Y = I instanceof Error ? I.message : String(I);
      throw new mz(Y, A, Q)
    }
  } catch (Z) {
    if (Z instanceof mz && B) throw Z;
    if (Z instanceof mz) {
      g(`Config file corrupted, resetting to defaults: ${Z.message}`, {
        level: "error"
      }), AA(Z), process.stdout.write(`
Claude configuration file at ${A} is corrupted: ${Z.message}
`);
      let I = `${A}.corrupted.${Date.now()}`;
      try {
        G.copyFileSync(A, I), g(`Corrupted config backed up to: ${I}`, {
          level: "error"
        })
      } catch {}
      let Y = `${A}.backup`;
      if (process.stdout.write(`
Claude configuration file at ${A} is corrupted
The corrupted file has been backed up to: ${I}
`), G.existsSync(Y)) process.stdout.write(`A backup file exists at: ${Y}
You can manually restore it by running: cp "${Y}" "${A}"

`);
      else process.stdout.write(`
`)
    }
    return Yv(Q)
  }
}
// @from(Start 5131761, End 5131976)
function j5() {
  let A = lv1(),
    Q = xc(nK(), lw);
  if (!Q.projects) return cv1;
  let B = Q.projects[A] ?? cv1;
  if (typeof B.allowedTools === "string") B.allowedTools = f7(B.allowedTools) ?? [];
  return B
}
// @from(Start 5131978, End 5132360)
function AY(A) {
  let Q = lv1();
  try {
    B8B(nK(), lw, (B) => ({
      ...B,
      projects: {
        ...B.projects,
        [Q]: A
      }
    }))
  } catch (B) {
    g(`Failed to save config with lock: ${B}`, {
      level: "error"
    });
    let G = xc(nK(), lw);
    Q8B(nK(), {
      ...G,
      projects: {
        ...G.projects,
        [Q]: A
      }
    }, lw)
  }
}
// @from(Start 5132362, End 5132600)
function fb() {
  let A = N1();
  return !!(Y0(process.env.DISABLE_AUTOUPDATER) || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC || A.autoUpdates === !1 && (A.installMethod !== "native" || A.autoUpdatesProtectedForNative !== !0))
}
// @from(Start 5132602, End 5132996)
function jiA() {
  if (Y0(process.env.DISABLE_COST_WARNINGS)) return !1;
  if (BB()) return !1;
  let Q = kc(),
    B = Kw() !== null;
  if (!Q.hasToken && !B) return !1;
  let G = N1(),
    Z = G.oauthAccount?.organizationRole,
    I = G.oauthAccount?.workspaceRole;
  if (!Z || !I) return !1;
  return ["admin", "billing"].includes(Z) || ["workspace_admin", "workspace_billing"].includes(I)
}
// @from(Start 5132998, End 5133145)
function hb() {
  let A = N1();
  if (A.userID) return A.userID;
  let Q = hr8(32).toString("hex");
  return c0({
    ...A,
    userID: Q
  }), Q
}
// @from(Start 5133147, End 5133311)
function iv1() {
  let A = N1();
  if (A.anonymousId) return A.anonymousId;
  let Q = `claudecode.v1.${gr8()}`;
  return c0({
    ...A,
    anonymousId: Q
  }), Q
}
// @from(Start 5133313, End 5133437)
function G8B() {
  let A = N1();
  if (!A.firstStartTime) c0({
    ...A,
    firstStartTime: new Date().toISOString()
  })
}
// @from(Start 5133439, End 5133849)
function Gt(A) {
  let Q = uQ();
  if (A === "ExperimentalUltraClaudeMd") return Gt("User");
  switch (A) {
    case "User":
      return Bt(MQ(), "CLAUDE.md");
    case "Local":
      return Bt(Q, "CLAUDE.local.md");
    case "Project":
      return Bt(Q, "CLAUDE.md");
    case "Managed":
      return Bt(iw(), "CLAUDE.md");
    case "ExperimentalUltraClaudeMd":
      return Bt(MQ(), "ULTRACLAUDE.md")
  }
}
// @from(Start 5133851, End 5133907)
function nv1() {
  return Bt(iw(), ".claude", "rules")
}
// @from(Start 5133909, End 5133965)
function av1() {
  return Bt(MQ(), ".claude", "rules")
}
// @from(Start 5133970, End 5133973)
A8B
// @from(Start 5133975, End 5133978)
cv1
// @from(Start 5133980, End 5133982)
lw
// @from(Start 5133984, End 5133987)
Ny7
// @from(Start 5133989, End 5133992)
Ly7
// @from(Start 5133994, End 5133996)
bb
// @from(Start 5133998, End 5134006)
pv1 = !1
// @from(Start 5134010, End 5134013)
lv1
// @from(Start 5134019, End 5135662)
jQ = L(() => {
  UxA();
  l2();
  c5();
  hQ();
  U2();
  LF();
  RZ();
  _0();
  AQ();
  R9();
  gB();
  V0();
  g1();
  MB();
  A8B = BA(T4A(), 1), cv1 = {
    allowedTools: [],
    mcpContextUris: [],
    mcpServers: {},
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    hasTrustDialogAccepted: !1,
    projectOnboardingSeenCount: 0,
    hasClaudeMdExternalIncludesApproved: !1,
    hasClaudeMdExternalIncludesWarningShown: !1
  }, lw = {
    numStartups: 0,
    installMethod: void 0,
    autoUpdates: void 0,
    theme: "dark",
    preferredNotifChannel: "auto",
    verbose: !1,
    editorMode: "normal",
    autoCompactEnabled: !0,
    hasSeenTasksHint: !1,
    queuedCommandUpHintCount: 0,
    diffTool: "auto",
    customApiKeyResponses: {
      approved: [],
      rejected: []
    },
    env: {},
    tipsHistory: {},
    memoryUsageCount: 0,
    promptQueueUseCount: 0,
    todoFeatureEnabled: !0,
    showExpandedTodos: !1,
    messageIdleNotifThresholdMs: 60000,
    autoConnectIde: !1,
    autoInstallIdeExtension: !0,
    checkpointingShadowRepos: [],
    fileCheckpointingEnabled: !0,
    terminalProgressBarEnabled: !0,
    cachedStatsigGates: {},
    cachedDynamicConfigs: {},
    cachedGrowthBookFeatures: {},
    respectGitignore: !0
  };
  Ny7 = {
    ...lw,
    autoUpdates: !1
  }, Ly7 = {
    ...cv1
  };
  bb = {
    config: null,
    mtime: 0
  };
  lv1 = s1(() => {
    let A = uQ();
    try {
      return fr8(ur8("git rev-parse --show-toplevel", {
        cwd: A,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim())
    } catch {
      return t4B(A)
    }
  })
})
// @from(Start 5135664, End 5135777)
async function Z8B() {
  if (_iA === null && !SiA) SiA = dr8(), _iA = await SiA, SiA = null, Zt.cache.clear?.()
}
// @from(Start 5135779, End 5136684)
function vc(A) {
  let Q = Zt(A);
  return {
    customIDs: {
      sessionId: Q.sessionId,
      organizationUUID: Q.organizationUuid,
      accountUUID: Q.accountUuid
    },
    userID: Q.deviceId,
    appVersion: Q.appVersion,
    email: Q.email,
    custom: {
      userType: Q.userType,
      organizationUuid: Q.organizationUuid,
      accountUuid: Q.accountUuid,
      subscriptionType: Q.subscriptionType ?? "",
      firstTokenTime: Q.firstTokenTime ?? 0,
      ...Q.githubActionsMetadata && {
        githubActor: Q.githubActionsMetadata.actor,
        githubActorId: Q.githubActionsMetadata.actorId,
        githubRepository: Q.githubActionsMetadata.repository,
        githubRepositoryId: Q.githubActionsMetadata.repositoryId,
        githubRepositoryOwner: Q.githubActionsMetadata.repositoryOwner,
        githubRepositoryOwnerId: Q.githubActionsMetadata.repositoryOwnerId
      }
    }
  }
}
// @from(Start 5136686, End 5136720)
function I8B() {
  return Zt(!0)
}
// @from(Start 5136722, End 5136781)
function mr8() {
  if (_iA !== null) return _iA;
  return
}
// @from(Start 5136782, End 5136815)
async function dr8() {
  return
}
// @from(Start 5136820, End 5136830)
_iA = null
// @from(Start 5136834, End 5136844)
SiA = null
// @from(Start 5136848, End 5136850)
Zt
// @from(Start 5136856, End 5138243)
gb = L(() => {
  jQ();
  l2();
  _0();
  gB();
  _8();
  Zt = s1((A) => {
    let Q = hb(),
      B = N1(),
      G, Z;
    if (A) {
      if (G = f4() ?? void 0, G && B.claudeCodeFirstTokenDate) {
        let W = new Date(B.claudeCodeFirstTokenDate).getTime();
        if (!isNaN(W)) Z = W
      }
    }
    let I = t6(),
      Y = I?.organizationUuid,
      J = I?.accountUuid;
    return {
      deviceId: Q,
      sessionId: e1(),
      email: mr8(),
      appVersion: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION,
      organizationUuid: Y,
      accountUuid: J,
      userType: "external",
      subscriptionType: G,
      firstTokenTime: Z,
      ...process.env.GITHUB_ACTIONS === "true" && {
        githubActionsMetadata: {
          actor: process.env.GITHUB_ACTOR,
          actorId: process.env.GITHUB_ACTOR_ID,
          repository: process.env.GITHUB_REPOSITORY,
          repositoryId: process.env.GITHUB_REPOSITORY_ID,
          repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
          repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
        }
      }
    }
  })
})
// @from(Start 5138246, End 5138591)
function kiA(A) {
  try {
    let Q = String(A),
      B = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${Q}\\").ParentProcessId"` : `ps -o ppid= -p ${Q}`,
      G = tG(B, {
        timeout: 1000
      });
    return G ? G.trim() : null
  } catch {
    return null
  }
}
// @from(Start 5138593, End 5138937)
function Y8B(A) {
  try {
    let Q = String(A),
      B = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${Q}\\").CommandLine"` : `ps -o command= -p ${Q}`,
      G = tG(B, {
        timeout: 1000
      });
    return G ? G.trim() : null
  } catch {
    return null
  }
}
// @from(Start 5138942, End 5138967)
sv1 = L(() => {
  _8()
})
// @from(Start 5138970, End 5139137)
function ar8() {
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (d0.platform !== "darwin") return nr8() || "pycharm"
  }
  return d0.terminal
}
// @from(Start 5139142, End 5139145)
cr8
// @from(Start 5139147, End 5139250)
pr8 = () => {
    return process.platform === "linux" && process.env.CLAUDE_CODE_BUBBLEWRAP === "1"
  }
// @from(Start 5139254, End 5139257)
lr8
// @from(Start 5139259, End 5139262)
ir8
// @from(Start 5139264, End 5139267)
nr8
// @from(Start 5139269, End 5139271)
WU
// @from(Start 5139277, End 5140653)
It = L(() => {
  _8();
  sv1();
  l2();
  AQ();
  V0();
  c5();
  cr8 = s1(async () => {
    let {
      code: A
    } = await QQ("test", ["-f", "/.dockerenv"]);
    if (A !== 0) return !1;
    return process.platform === "linux"
  }), lr8 = s1(() => {
    if (process.platform !== "linux") return !1;
    let A = RA();
    try {
      if (A.existsSync("/lib/libc.musl-x86_64.so.1") || A.existsSync("/lib/libc.musl-aarch64.so.1")) return !0;
      let Q = tG("ldd /bin/ls 2>/dev/null");
      return Q !== null && Q.includes("musl")
    } catch {
      return g("musl detection failed, assuming glibc"), !1
    }
  }), ir8 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"], nr8 = s1(() => {
    if (process.platform === "darwin") return null;
    try {
      let Q = process.pid.toString();
      for (let B = 0; B < 10; B++) {
        let G = Y8B(Q);
        if (G) {
          let I = G.toLowerCase();
          for (let Y of ir8)
            if (I.includes(Y)) return Y
        }
        let Z = kiA(Q);
        if (!Z || Z === "0" || Z === Q) break;
        Q = Z
      }
    } catch {}
    return null
  });
  WU = {
    ...d0,
    terminal: ar8(),
    getIsDocker: cr8,
    getIsBubblewrapSandbox: pr8,
    isMuslEnvironment: lr8
  }
})
// @from(Start 5140656, End 5140937)
function J7(A, Q, B = !1) {
  let G = A;
  if (B) {
    let Z = A.indexOf(`
`);
    if (Z !== -1) {
      if (G = A.substring(0, Z), G.length + 1 > Q) return `${G.substring(0,Q-1)}…`;
      return `${G}…`
    }
  }
  if (G.length <= Q) return G;
  return `${G.substring(0,Q-1)}…`
}
// @from(Start 5140939, End 5141369)
function eC(A) {
  if (A < 60000) {
    if (A === 0) return "0s";
    if (A < 1) return `${(A/1000).toFixed(1)}s`;
    return `${Math.round(A/1000).toString()}s`
  }
  let Q = Math.floor(A / 3600000),
    B = Math.floor(A % 3600000 / 60000),
    G = Math.round(A % 60000 / 1000);
  if (G === 60) G = 0, B++;
  if (B === 60) B = 0, Q++;
  if (Q > 0) return `${Q}h ${B}m ${G}s`;
  if (B > 0) return `${B}m ${G}s`;
  return `${G}s`
}
// @from(Start 5141371, End 5141570)
function JZ(A) {
  let Q = A >= 1000;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    minimumFractionDigits: Q ? 1 : 0,
    maximumFractionDigits: 1
  }).format(A).toLowerCase()
}
// @from(Start 5141572, End 5142703)
function yiA(A, Q = {}) {
  let {
    style: B = "narrow",
    numeric: G = "always",
    now: Z = new Date
  } = Q, I = A.getTime() - Z.getTime(), Y = Math.trunc(I / 1000), J = [{
    unit: "year",
    seconds: 31536000,
    shortUnit: "y"
  }, {
    unit: "month",
    seconds: 2592000,
    shortUnit: "mo"
  }, {
    unit: "week",
    seconds: 604800,
    shortUnit: "w"
  }, {
    unit: "day",
    seconds: 86400,
    shortUnit: "d"
  }, {
    unit: "hour",
    seconds: 3600,
    shortUnit: "h"
  }, {
    unit: "minute",
    seconds: 60,
    shortUnit: "m"
  }, {
    unit: "second",
    seconds: 1,
    shortUnit: "s"
  }];
  for (let {
      unit: X,
      seconds: V,
      shortUnit: F
    }
    of J)
    if (Math.abs(Y) >= V) {
      let K = Math.trunc(Y / V);
      if (B === "narrow") return Y < 0 ? `${Math.abs(K)}${F} ago` : `in ${K}${F}`;
      return new Intl.RelativeTimeFormat("en", {
        style: "long",
        numeric: G
      }).format(K, X)
    } if (B === "narrow") return Y <= 0 ? "0s ago" : "in 0s";
  return new Intl.RelativeTimeFormat("en", {
    style: B,
    numeric: G
  }).format(0, "second")
}
// @from(Start 5142705, End 5142903)
function Yt(A, Q = {}) {
  let {
    now: B = new Date,
    ...G
  } = Q;
  if (A > B) return yiA(A, {
    ...G,
    now: B
  });
  return yiA(A, {
    ...G,
    numeric: "always",
    now: B
  })
}
// @from(Start 5142905, End 5143038)
function mzA(A) {
  return [Yt(A.modified, {
    style: "short"
  }), `${A.messageCount} messages`, A.gitBranch || "-"].join(" · ")
}
// @from(Start 5143040, End 5143899)
function g3A(A, Q = !1, B = !0) {
  if (!A) return;
  let G = new Date(A * 1000),
    Z = new Date,
    I = G.getMinutes();
  if ((G.getTime() - Z.getTime()) / 3600000 > 24) {
    let X = {
      month: "short",
      day: "numeric",
      hour: B ? "numeric" : void 0,
      minute: !B || I === 0 ? void 0 : "2-digit",
      hour12: B ? !0 : void 0
    };
    if (G.getFullYear() !== Z.getFullYear()) X.year = "numeric";
    return G.toLocaleString("en-US", X).replace(/ ([AP]M)/i, (F, K) => K.toLowerCase()) + (Q ? ` (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : "")
  }
  let J = G.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: I === 0 ? void 0 : "2-digit",
      hour12: !0
    }),
    W = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return J.replace(/ ([AP]M)/i, (X, V) => V.toLowerCase()) + (Q ? ` (${W})` : "")
}
// @from(Start 5143901, End 5144011)
function J8B(A, Q = !1, B = !0) {
  let G = new Date(A);
  return `${g3A(Math.floor(G.getTime()/1000),Q,B)}`
}
// @from(Start 5144013, End 5144095)
function dzA(A, Q = 4) {
  return `$${A>0.5?rr8(A,100).toFixed(2):A.toFixed(Q)}`
}
// @from(Start 5144097, End 5145190)
function sr8() {
  let A = ru();
  if (Object.keys(A).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
  let Q = {};
  for (let [G, Z] of Object.entries(A)) {
    let I = nw(G);
    if (!Q[I]) Q[I] = {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadInputTokens: 0,
      cacheCreationInputTokens: 0,
      webSearchRequests: 0,
      costUSD: 0,
      contextWindow: 0
    };
    let Y = Q[I];
    Y.inputTokens += Z.inputTokens, Y.outputTokens += Z.outputTokens, Y.cacheReadInputTokens += Z.cacheReadInputTokens, Y.cacheCreationInputTokens += Z.cacheCreationInputTokens, Y.webSearchRequests += Z.webSearchRequests, Y.costUSD += Z.costUSD
  }
  let B = "Usage by model:";
  for (let [G, Z] of Object.entries(Q)) {
    let I = `  ${JZ(Z.inputTokens)} input, ${JZ(Z.outputTokens)} output, ${JZ(Z.cacheReadInputTokens)} cache read, ${JZ(Z.cacheCreationInputTokens)} cache write` + (Z.webSearchRequests > 0 ? `, ${JZ(Z.webSearchRequests)} web search` : "") + ` (${dzA(Z.costUSD)})`;
    B += `
` + `${G}:`.padStart(21) + I
  }
  return B
}
// @from(Start 5145192, End 5145558)
function rv1() {
  let A = dzA(hK()) + (kE0() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
    Q = sr8();
  return tA.dim(`Total cost:            ${A}
Total duration (API):  ${eC(gN())}
Total duration (wall): ${eC(zFA())}
Total code changes:    ${Y2A()} ${Y2A()===1?"line":"lines"} added, ${J2A()} ${J2A()===1?"line":"lines"} removed
${Q}`)
}
// @from(Start 5145560, End 5146250)
function X8B() {
  W8B.useEffect(() => {
    let A = () => {
      if (jiA()) process.stdout.write(`
` + rv1() + `
`);
      let Q = j5();
      AY({
        ...Q,
        lastCost: hK(),
        lastAPIDuration: gN(),
        lastToolDuration: RE0(),
        lastDuration: zFA(),
        lastLinesAdded: Y2A(),
        lastLinesRemoved: J2A(),
        lastTotalInputTokens: TE0(),
        lastTotalOutputTokens: PE0(),
        lastTotalCacheCreationInputTokens: SE0(),
        lastTotalCacheReadInputTokens: jE0(),
        lastTotalWebSearchRequests: _E0(),
        lastSessionId: e1()
      })
    };
    return process.on("exit", A), () => {
      process.off("exit", A)
    }
  }, [])
}
// @from(Start 5146252, End 5146305)
function rr8(A, Q) {
  return Math.round(A * Q) / Q
}
// @from(Start 5146307, End 5146700)
function xiA(A, Q, B) {
  OE0(A, Q, B), hE0()?.add(A, {
    model: B
  }), $FA()?.add(Q.input_tokens, {
    type: "input",
    model: B
  }), $FA()?.add(Q.output_tokens, {
    type: "output",
    model: B
  }), $FA()?.add(Q.cache_read_input_tokens ?? 0, {
    type: "cacheRead",
    model: B
  }), $FA()?.add(Q.cache_creation_input_tokens ?? 0, {
    type: "cacheCreation",
    model: B
  })
}
// @from(Start 5146705, End 5146708)
W8B
// @from(Start 5146714, End 5146799)
M_ = L(() => {
  F9();
  t2();
  jQ();
  _0();
  _0();
  _0();
  W8B = BA(VA(), 1)
})
// @from(Start 5146802, End 5147120)
function or8(A, Q) {
  return Q.input_tokens / 1e6 * A.inputTokens + Q.output_tokens / 1e6 * A.outputTokens + (Q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens + (Q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens + (Q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}
// @from(Start 5147122, End 5147239)
function tr8(A) {
  return A.input_tokens + (A.cache_read_input_tokens ?? 0) + (A.cache_creation_input_tokens ?? 0)
}
// @from(Start 5147241, End 5147462)
function er8(A, Q) {
  let B = nw(A),
    G = V8B[B];
  if (G === Jt && tr8(Q) > 200000) return ov1;
  if (!G) return GA("tengu_unknown_model_cost", {
    model: A,
    shortName: B
  }), MX1(), V8B[nw(K8B)];
  return G
}
// @from(Start 5147464, End 5147526)
function fiA(A, Q) {
  let B = er8(A, Q);
  return or8(B, Q)
}
// @from(Start 5147528, End 5147618)
function F8B(A) {
  if (Number.isInteger(A)) return `$${A}`;
  return `$${A.toFixed(2)}`
}
// @from(Start 5147620, End 5147703)
function bc(A) {
  return `${F8B(A.inputTokens)}/${F8B(A.outputTokens)} per Mtok`
}
// @from(Start 5147708, End 5147710)
Jt
// @from(Start 5147712, End 5147715)
viA
// @from(Start 5147717, End 5147720)
biA
// @from(Start 5147722, End 5147725)
ov1
// @from(Start 5147727, End 5147730)
tv1
// @from(Start 5147732, End 5147735)
ev1
// @from(Start 5147737, End 5147740)
V8B
// @from(Start 5147746, End 5148959)
hiA = L(() => {
  M_();
  q0();
  xzA();
  t2();
  Jt = {
    inputTokens: 3,
    outputTokens: 15,
    promptCacheWriteTokens: 3.75,
    promptCacheReadTokens: 0.3,
    webSearchRequests: 0.01
  }, viA = {
    inputTokens: 15,
    outputTokens: 75,
    promptCacheWriteTokens: 18.75,
    promptCacheReadTokens: 1.5,
    webSearchRequests: 0.01
  }, biA = {
    inputTokens: 5,
    outputTokens: 25,
    promptCacheWriteTokens: 6.25,
    promptCacheReadTokens: 0.5,
    webSearchRequests: 0.01
  }, ov1 = {
    inputTokens: 6,
    outputTokens: 22.5,
    promptCacheWriteTokens: 7.5,
    promptCacheReadTokens: 0.6,
    webSearchRequests: 0.01
  }, tv1 = {
    inputTokens: 0.8,
    outputTokens: 4,
    promptCacheWriteTokens: 1,
    promptCacheReadTokens: 0.08,
    webSearchRequests: 0.01
  }, ev1 = {
    inputTokens: 1,
    outputTokens: 5,
    promptCacheWriteTokens: 1.25,
    promptCacheReadTokens: 0.1,
    webSearchRequests: 0.01
  }, V8B = {
    [nw(jzA.firstParty)]: tv1,
    [nw(SzA.firstParty)]: ev1,
    [nw(PzA.firstParty)]: Jt,
    [nw(TzA.firstParty)]: Jt,
    [nw(At.firstParty)]: Jt,
    [nw(_zA.firstParty)]: viA,
    [nw(kzA.firstParty)]: viA,
    [nw(yzA.firstParty)]: biA,
    ...{}
  }
})
// @from(Start 5148962, End 5149444)
function fc() {
  let A = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
  return `claude-cli/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${A})`
}
// @from(Start 5149446, End 5149766)
function Wt() {
  return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}`
}
// @from(Start 5149768, End 5150088)
function TV() {
  return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}`
}
// @from(Start 5150090, End 5150515)
function DI() {
  if (BB()) {
    let Q = M6();
    if (!Q?.accessToken) return {
      headers: {},
      error: "No OAuth token available"
    };
    return {
      headers: {
        Authorization: `Bearer ${Q.accessToken}`,
        "anthropic-beta": $4A
      }
    }
  }
  let A = Kw();
  if (!A) return {
    headers: {},
    error: "No API key available"
  };
  return {
    headers: {
      "x-api-key": A
    }
  }
}
// @from(Start 5150520, End 5150552)
AE = L(() => {
  gB();
  NX()
})
// @from(Start 5150554, End 5151238)
async function Qo8() {
  let A = t6()?.organizationUuid;
  if (!A) throw Error("No organization ID available");
  let Q = DI();
  if (Q.error) throw Error(`Auth error: ${Q.error}`);
  let B = {
    "Content-Type": "application/json",
    "User-Agent": TV(),
    ...Q.headers
  };
  try {
    let G = `https://api.anthropic.com/api/organization/${A}/claude_code_sonnet_1m_access`,
      Z = await YQ.get(G, {
        headers: B,
        timeout: 5000
      });
    return {
      hasAccess: Z.data.has_access,
      hasAccessNotAsDefault: Z.data.has_access_not_as_default,
      hasError: !1
    }
  } catch (G) {
    return AA(G), {
      hasAccess: !1,
      hasError: !0
    }
  }
}
// @from(Start 5151239, End 5151434)
async function Go8() {
  try {
    return await Bo8()
  } catch (A) {
    return g("Sonnet-1M access check failed, defaulting to no access"), {
      hasAccess: !1,
      hasError: !0
    }
  }
}
// @from(Start 5151436, End 5151986)
function hc() {
  let A = t6()?.organizationUuid;
  if (!A) return {
    hasAccess: !1,
    wasPartOfDefaultRollout: !1,
    needsRefresh: !1
  };
  let Q = N1(),
    B = (BB() ? Q.s1mAccessCache : Q.s1mNonSubscriberAccessCache)?.[A],
    G = Date.now();
  if (!B) return {
    hasAccess: !1,
    wasPartOfDefaultRollout: !1,
    needsRefresh: !0
  };
  let {
    hasAccess: Z,
    hasAccessNotAsDefault: I,
    timestamp: Y
  } = B, J = G - Y > Zo8;
  return {
    hasAccess: Z || (I ?? !1),
    wasPartOfDefaultRollout: Z,
    needsRefresh: J
  }
}
// @from(Start 5151987, End 5152066)
async function D8B() {
  let {
    needsRefresh: A
  } = hc();
  if (A) Io8()
}
// @from(Start 5152067, End 5152923)
async function Io8() {
  let A = t6()?.organizationUuid;
  if (!A) return;
  if (!BB()) {
    let Q = await dbA();
    if (!Q) return;
    let {
      uuid: B,
      rate_limit_tier: G
    } = Q.organization, Z = N1(), I = {
      ...Z.s1mNonSubscriberAccessCache,
      [B]: {
        hasAccess: G === "auto_prepaid_tier_3" || G === "manual_tier_3",
        timestamp: Date.now()
      }
    };
    c0({
      ...Z,
      s1mNonSubscriberAccessCache: I
    });
    return
  }
  try {
    let {
      hasAccess: Q,
      hasAccessNotAsDefault: B
    } = await Go8(), G = N1(), Z = {
      ...G.s1mAccessCache,
      [A]: {
        hasAccess: Q,
        hasAccessNotAsDefault: B,
        timestamp: Date.now()
      }
    };
    c0({
      ...G,
      s1mAccessCache: Z
    })
  } catch (Q) {
    g("Failed to fetch and cache Sonnet-1M access"), AA(Q)
  }
}
// @from(Start 5152928, End 5152941)
Ao8 = 3600000
// @from(Start 5152945, End 5152948)
Bo8
// @from(Start 5152950, End 5152963)
Zo8 = 3600000
// @from(Start 5152969, End 5153075)
giA = L(() => {
  O3();
  hbA();
  AE();
  V0();
  g1();
  jQ();
  gB();
  kDA();
  Bo8 = fbA(Qo8, Ao8)
})
// @from(Start 5153078, End 5153109)
function E8B() {
  return C8B
}
// @from(Start 5153111, End 5153299)
function Ab1(A) {
  let Q = 2166136261,
    B = A.length;
  for (let G = 0; G < B; G++) Q ^= A.charCodeAt(G), Q += (Q << 1) + (Q << 4) + (Q << 7) + (Q << 8) + (Q << 24);
  return Q >>> 0
}
// @from(Start 5153301, End 5153444)
function czA(A, Q, B) {
  if (B === 2) return Ab1(Ab1(A + Q) + "") % 1e4 / 1e4;
  if (B === 1) return Ab1(Q + A) % 1000 / 1000;
  return null
}
// @from(Start 5153446, End 5153520)
function Yo8(A) {
  if (A <= 0) return [];
  return Array(A).fill(1 / A)
}
// @from(Start 5153522, End 5153575)
function uiA(A, Q) {
  return A >= Q[0] && A < Q[1]
}
// @from(Start 5153577, End 5153693)
function z8B(A, Q) {
  let B = czA("__" + Q[0], A, 1);
  if (B === null) return !1;
  return B >= Q[1] && B < Q[2]
}
// @from(Start 5153695, End 5153798)
function U8B(A, Q) {
  for (let B = 0; B < Q.length; B++)
    if (uiA(A, Q[B])) return B;
  return -1
}
// @from(Start 5153800, End 5153951)
function Bb1(A) {
  try {
    let Q = A.replace(/([^\\])\//g, "$1\\/");
    return new RegExp(Q)
  } catch (Q) {
    console.error(Q);
    return
  }
}
// @from(Start 5153953, End 5154221)
function miA(A, Q) {
  if (!Q.length) return !1;
  let B = !1,
    G = !1;
  for (let Z = 0; Z < Q.length; Z++) {
    let I = Xo8(A, Q[Z].type, Q[Z].pattern);
    if (Q[Z].include === !1) {
      if (I) return !1
    } else if (B = !0, I) G = !0
  }
  return G || !B
}
// @from(Start 5154223, End 5154480)
function Jo8(A, Q, B) {
  try {
    let G = Q.replace(/[*.+?^${}()|[\]\\]/g, "\\$&").replace(/_____/g, ".*");
    if (B) G = "\\/?" + G.replace(/(^\/|\/$)/g, "") + "\\/?";
    return new RegExp("^" + G + "$", "i").test(A)
  } catch (G) {
    return !1
  }
}
// @from(Start 5154482, End 5154929)
function Wo8(A, Q) {
  try {
    let B = new URL(Q.replace(/^([^:/?]*)\./i, "https://$1.").replace(/\*/g, "_____"), "https://_____"),
      G = [
        [A.host, B.host, !1],
        [A.pathname, B.pathname, !0]
      ];
    if (B.hash) G.push([A.hash, B.hash, !1]);
    return B.searchParams.forEach((Z, I) => {
      G.push([A.searchParams.get(I) || "", Z, !1])
    }), !G.some((Z) => !Jo8(Z[0], Z[1], Z[2]))
  } catch (B) {
    return !1
  }
}
// @from(Start 5154931, End 5155243)
function Xo8(A, Q, B) {
  try {
    let G = new URL(A, "https://_");
    if (Q === "regex") {
      let Z = Bb1(B);
      if (!Z) return !1;
      return Z.test(G.href) || Z.test(G.href.substring(G.origin.length))
    } else if (Q === "simple") return Wo8(G, B);
    return !1
  } catch (G) {
    return !1
  }
}
// @from(Start 5155245, End 5155566)
function $8B(A, Q, B) {
  if (Q = Q === void 0 ? 1 : Q, Q < 0) Q = 0;
  else if (Q > 1) Q = 1;
  let G = Yo8(A);
  if (B = B || G, B.length !== A) B = G;
  let Z = B.reduce((Y, J) => J + Y, 0);
  if (Z < 0.99 || Z > 1.01) B = G;
  let I = 0;
  return B.map((Y) => {
    let J = I;
    return I += Y, [J, J + Q * Y]
  })
}
// @from(Start 5155568, End 5155926)
function w8B(A, Q, B) {
  if (!Q) return null;
  let G = Q.split("?")[1];
  if (!G) return null;
  let Z = G.replace(/#.*/, "").split("&").map((I) => I.split("=", 2)).filter((I) => {
    let [Y] = I;
    return Y === A
  }).map((I) => {
    let [, Y] = I;
    return parseInt(Y)
  });
  if (Z.length > 0 && Z[0] >= 0 && Z[0] < B) return Z[0];
  return null
}
// @from(Start 5155928, End 5156022)
function q8B(A) {
  try {
    return A()
  } catch (Q) {
    return console.error(Q), !1
  }
}
// @from(Start 5156023, End 5156561)
async function Xt(A, Q, B) {
  if (Q = Q || "", B = B || globalThis.crypto && globalThis.crypto.subtle || C8B.SubtleCrypto, !B) throw Error("No SubtleCrypto implementation found");
  try {
    let G = await B.importKey("raw", Qb1(Q), {
        name: "AES-CBC",
        length: 128
      }, !0, ["encrypt", "decrypt"]),
      [Z, I] = A.split("."),
      Y = await B.decrypt({
        name: "AES-CBC",
        iv: Qb1(Z)
      }, G, Qb1(I));
    return new TextDecoder().decode(Y)
  } catch (G) {
    throw Error("Failed to decrypt")
  }
}
// @from(Start 5156563, End 5156648)
function pzA(A) {
  if (typeof A === "string") return A;
  return JSON.stringify(A)
}
// @from(Start 5156650, End 5156920)
function aw(A) {
  if (typeof A === "number") A = A + "";
  if (!A || typeof A !== "string") A = "0";
  let Q = A.replace(/(^v|\+.*$)/g, "").split(/[-.]/);
  if (Q.length === 3) Q.push("~");
  return Q.map((B) => B.match(/^[0-9]+$/) ? B.padStart(5, " ") : B).join("-")
}
// @from(Start 5156922, End 5157015)
function N8B() {
  let A;
  try {
    A = "1.6.1"
  } catch (Q) {
    A = ""
  }
  return A
}
// @from(Start 5157017, End 5157312)
function L8B(A, Q) {
  let B, G;
  try {
    B = new URL(A), G = new URL(Q)
  } catch (Z) {
    return console.error(`Unable to merge query strings: ${Z}`), Q
  }
  return B.searchParams.forEach((Z, I) => {
    if (G.searchParams.has(I)) return;
    G.searchParams.set(I, Z)
  }), G.toString()
}
// @from(Start 5157314, End 5157378)
function H8B(A) {
  return typeof A === "object" && A !== null
}
// @from(Start 5157380, End 5157631)
function diA(A) {
  if (A.urlPatterns && A.variations.some((Q) => H8B(Q) && ("urlRedirect" in Q))) return "redirect";
  else if (A.variations.some((Q) => H8B(Q) && (Q.domMutations || ("js" in Q) || ("css" in Q)))) return "visual";
  return "unknown"
}
// @from(Start 5157632, End 5157898)
async function ciA(A, Q) {
  return new Promise((B) => {
    let G = !1,
      Z, I = (Y) => {
        if (G) return;
        G = !0, Z && clearTimeout(Z), B(Y || null)
      };
    if (Q) Z = setTimeout(() => I(), Q);
    A.then((Y) => I(Y)).catch(() => I())
  })
}
// @from(Start 5157903, End 5157906)
C8B
// @from(Start 5157908, End 5157969)
Qb1 = (A) => Uint8Array.from(atob(A), (Q) => Q.charCodeAt(0))
// @from(Start 5157975, End 5158194)
lzA = L(() => {
  C8B = {
    fetch: globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0,
    SubtleCrypto: globalThis.crypto ? globalThis.crypto.subtle : void 0,
    EventSource: globalThis.EventSource
  }
})
// @from(Start 5158197, End 5158270)
function R8B(A) {
  if (Object.assign(bH, A), !bH.backgroundSync) zo8()
}
// @from(Start 5783387, End 5783389)
yF
// @from(Start 5783391, End 5783394)
MEB
// @from(Start 5783396, End 5783399)
OEB
// @from(Start 5783401, End 5783403)
xt
// @from(Start 5783405, End 5783407)
CT
// @from(Start 5783409, End 5783411)
_6
// @from(Start 5783413, End 5783416)
K7A
// @from(Start 5783418, End 5783421)
kJ6
// @from(Start 5783423, End 5783425)
rb
// @from(Start 5783427, End 5783429)
vt
// @from(Start 5783431, End 5783433)
ow
// @from(Start 5783435, End 5783438)
D7A
// @from(Start 5783440, End 5783443)
gh1
// @from(Start 5783445, End 5783448)
REB
// @from(Start 5783450, End 5783453)
uh1
// @from(Start 5783455, End 5783458)
H7A
// @from(Start 5783460, End 5783462)
HT
// @from(Start 5783464, End 5783466)
bt
// @from(Start 5783468, End 5783471)
yJ6
// @from(Start 5783473, End 5783476)
TEB
// @from(Start 5783482, End 5789093)
IaA = L(() => {
  yF = function(A) {
    return A[A.Auto = 0] = "Auto", A[A.FlexStart = 1] = "FlexStart", A[A.Center = 2] = "Center", A[A.FlexEnd = 3] = "FlexEnd", A[A.Stretch = 4] = "Stretch", A[A.Baseline = 5] = "Baseline", A[A.SpaceBetween = 6] = "SpaceBetween", A[A.SpaceAround = 7] = "SpaceAround", A[A.SpaceEvenly = 8] = "SpaceEvenly", A
  }({}), MEB = function(A) {
    return A[A.BorderBox = 0] = "BorderBox", A[A.ContentBox = 1] = "ContentBox", A
  }({}), OEB = function(A) {
    return A[A.Width = 0] = "Width", A[A.Height = 1] = "Height", A
  }({}), xt = function(A) {
    return A[A.Inherit = 0] = "Inherit", A[A.LTR = 1] = "LTR", A[A.RTL = 2] = "RTL", A
  }({}), CT = function(A) {
    return A[A.Flex = 0] = "Flex", A[A.None = 1] = "None", A[A.Contents = 2] = "Contents", A
  }({}), _6 = function(A) {
    return A[A.Left = 0] = "Left", A[A.Top = 1] = "Top", A[A.Right = 2] = "Right", A[A.Bottom = 3] = "Bottom", A[A.Start = 4] = "Start", A[A.End = 5] = "End", A[A.Horizontal = 6] = "Horizontal", A[A.Vertical = 7] = "Vertical", A[A.All = 8] = "All", A
  }({}), K7A = function(A) {
    return A[A.None = 0] = "None", A[A.StretchFlexBasis = 1] = "StretchFlexBasis", A[A.AbsolutePositionWithoutInsetsExcludesPadding = 2] = "AbsolutePositionWithoutInsetsExcludesPadding", A[A.AbsolutePercentAgainstInnerSize = 4] = "AbsolutePercentAgainstInnerSize", A[A.All = 2147483647] = "All", A[A.Classic = 2147483646] = "Classic", A
  }({}), kJ6 = function(A) {
    return A[A.WebFlexBasis = 0] = "WebFlexBasis", A
  }({}), rb = function(A) {
    return A[A.Column = 0] = "Column", A[A.ColumnReverse = 1] = "ColumnReverse", A[A.Row = 2] = "Row", A[A.RowReverse = 3] = "RowReverse", A
  }({}), vt = function(A) {
    return A[A.Column = 0] = "Column", A[A.Row = 1] = "Row", A[A.All = 2] = "All", A
  }({}), ow = function(A) {
    return A[A.FlexStart = 0] = "FlexStart", A[A.Center = 1] = "Center", A[A.FlexEnd = 2] = "FlexEnd", A[A.SpaceBetween = 3] = "SpaceBetween", A[A.SpaceAround = 4] = "SpaceAround", A[A.SpaceEvenly = 5] = "SpaceEvenly", A
  }({}), D7A = function(A) {
    return A[A.Error = 0] = "Error", A[A.Warn = 1] = "Warn", A[A.Info = 2] = "Info", A[A.Debug = 3] = "Debug", A[A.Verbose = 4] = "Verbose", A[A.Fatal = 5] = "Fatal", A
  }({}), gh1 = function(A) {
    return A[A.Undefined = 0] = "Undefined", A[A.Exactly = 1] = "Exactly", A[A.AtMost = 2] = "AtMost", A
  }({}), REB = function(A) {
    return A[A.Default = 0] = "Default", A[A.Text = 1] = "Text", A
  }({}), uh1 = function(A) {
    return A[A.Visible = 0] = "Visible", A[A.Hidden = 1] = "Hidden", A[A.Scroll = 2] = "Scroll", A
  }({}), H7A = function(A) {
    return A[A.Static = 0] = "Static", A[A.Relative = 1] = "Relative", A[A.Absolute = 2] = "Absolute", A
  }({}), HT = function(A) {
    return A[A.Undefined = 0] = "Undefined", A[A.Point = 1] = "Point", A[A.Percent = 2] = "Percent", A[A.Auto = 3] = "Auto", A
  }({}), bt = function(A) {
    return A[A.NoWrap = 0] = "NoWrap", A[A.Wrap = 1] = "Wrap", A[A.WrapReverse = 2] = "WrapReverse", A
  }({}), yJ6 = {
    ALIGN_AUTO: yF.Auto,
    ALIGN_FLEX_START: yF.FlexStart,
    ALIGN_CENTER: yF.Center,
    ALIGN_FLEX_END: yF.FlexEnd,
    ALIGN_STRETCH: yF.Stretch,
    ALIGN_BASELINE: yF.Baseline,
    ALIGN_SPACE_BETWEEN: yF.SpaceBetween,
    ALIGN_SPACE_AROUND: yF.SpaceAround,
    ALIGN_SPACE_EVENLY: yF.SpaceEvenly,
    BOX_SIZING_BORDER_BOX: MEB.BorderBox,
    BOX_SIZING_CONTENT_BOX: MEB.ContentBox,
    DIMENSION_WIDTH: OEB.Width,
    DIMENSION_HEIGHT: OEB.Height,
    DIRECTION_INHERIT: xt.Inherit,
    DIRECTION_LTR: xt.LTR,
    DIRECTION_RTL: xt.RTL,
    DISPLAY_FLEX: CT.Flex,
    DISPLAY_NONE: CT.None,
    DISPLAY_CONTENTS: CT.Contents,
    EDGE_LEFT: _6.Left,
    EDGE_TOP: _6.Top,
    EDGE_RIGHT: _6.Right,
    EDGE_BOTTOM: _6.Bottom,
    EDGE_START: _6.Start,
    EDGE_END: _6.End,
    EDGE_HORIZONTAL: _6.Horizontal,
    EDGE_VERTICAL: _6.Vertical,
    EDGE_ALL: _6.All,
    ERRATA_NONE: K7A.None,
    ERRATA_STRETCH_FLEX_BASIS: K7A.StretchFlexBasis,
    ERRATA_ABSOLUTE_POSITION_WITHOUT_INSETS_EXCLUDES_PADDING: K7A.AbsolutePositionWithoutInsetsExcludesPadding,
    ERRATA_ABSOLUTE_PERCENT_AGAINST_INNER_SIZE: K7A.AbsolutePercentAgainstInnerSize,
    ERRATA_ALL: K7A.All,
    ERRATA_CLASSIC: K7A.Classic,
    EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS: kJ6.WebFlexBasis,
    FLEX_DIRECTION_COLUMN: rb.Column,
    FLEX_DIRECTION_COLUMN_REVERSE: rb.ColumnReverse,
    FLEX_DIRECTION_ROW: rb.Row,
    FLEX_DIRECTION_ROW_REVERSE: rb.RowReverse,
    GUTTER_COLUMN: vt.Column,
    GUTTER_ROW: vt.Row,
    GUTTER_ALL: vt.All,
    JUSTIFY_FLEX_START: ow.FlexStart,
    JUSTIFY_CENTER: ow.Center,
    JUSTIFY_FLEX_END: ow.FlexEnd,
    JUSTIFY_SPACE_BETWEEN: ow.SpaceBetween,
    JUSTIFY_SPACE_AROUND: ow.SpaceAround,
    JUSTIFY_SPACE_EVENLY: ow.SpaceEvenly,
    LOG_LEVEL_ERROR: D7A.Error,
    LOG_LEVEL_WARN: D7A.Warn,
    LOG_LEVEL_INFO: D7A.Info,
    LOG_LEVEL_DEBUG: D7A.Debug,
    LOG_LEVEL_VERBOSE: D7A.Verbose,
    LOG_LEVEL_FATAL: D7A.Fatal,
    MEASURE_MODE_UNDEFINED: gh1.Undefined,
    MEASURE_MODE_EXACTLY: gh1.Exactly,
    MEASURE_MODE_AT_MOST: gh1.AtMost,
    NODE_TYPE_DEFAULT: REB.Default,
    NODE_TYPE_TEXT: REB.Text,
    OVERFLOW_VISIBLE: uh1.Visible,
    OVERFLOW_HIDDEN: uh1.Hidden,
    OVERFLOW_SCROLL: uh1.Scroll,
    POSITION_TYPE_STATIC: H7A.Static,
    POSITION_TYPE_RELATIVE: H7A.Relative,
    POSITION_TYPE_ABSOLUTE: H7A.Absolute,
    UNIT_UNDEFINED: HT.Undefined,
    UNIT_POINT: HT.Point,
    UNIT_PERCENT: HT.Percent,
    UNIT_AUTO: HT.Auto,
    WRAP_NO_WRAP: bt.NoWrap,
    WRAP_WRAP: bt.Wrap,
    WRAP_WRAP_REVERSE: bt.WrapReverse
  }, TEB = yJ6
})
// @from(Start 5789096, End 5791752)
function mh1(A) {
  function Q(Z, I, Y) {
    let J = Z[I];
    Z[I] = function() {
      for (var W = arguments.length, X = Array(W), V = 0; V < W; V++) X[V] = arguments[V];
      return Y.call(this, J, ...X)
    }
  }
  for (let Z of ["setPosition", "setMargin", "setFlexBasis", "setWidth", "setHeight", "setMinWidth", "setMinHeight", "setMaxWidth", "setMaxHeight", "setPadding", "setGap"]) {
    let I = {
      [HT.Point]: A.Node.prototype[Z],
      [HT.Percent]: A.Node.prototype[`${Z}Percent`],
      [HT.Auto]: A.Node.prototype[`${Z}Auto`]
    };
    Q(A.Node.prototype, Z, function(Y) {
      for (var J = arguments.length, W = Array(J > 1 ? J - 1 : 0), X = 1; X < J; X++) W[X - 1] = arguments[X];
      let V = W.pop(),
        F, K;
      if (V === "auto") F = HT.Auto, K = void 0;
      else if (typeof V === "object") F = V.unit, K = V.valueOf();
      else if (F = typeof V === "string" && V.endsWith("%") ? HT.Percent : HT.Point, K = parseFloat(V), V !== void 0 && !Number.isNaN(V) && Number.isNaN(K)) throw Error(`Invalid value ${V} for ${Z}`);
      if (!I[F]) throw Error(`Failed to execute "${Z}": Unsupported unit '${V}'`);
      if (K !== void 0) return I[F].call(this, ...W, K);
      else return I[F].call(this, ...W)
    })
  }

  function B(Z) {
    return A.MeasureCallback.implement({
      measure: function() {
        let {
          width: I,
          height: Y
        } = Z(...arguments);
        return {
          width: I ?? NaN,
          height: Y ?? NaN
        }
      }
    })
  }
  Q(A.Node.prototype, "setMeasureFunc", function(Z, I) {
    if (I) return Z.call(this, B(I));
    else return this.unsetMeasureFunc()
  });

  function G(Z) {
    return A.DirtiedCallback.implement({
      dirtied: Z
    })
  }
  return Q(A.Node.prototype, "setDirtiedFunc", function(Z, I) {
    Z.call(this, G(I))
  }), Q(A.Config.prototype, "free", function() {
    A.Config.destroy(this)
  }), Q(A.Node, "create", (Z, I) => {
    return I ? A.Node.createWithConfig(I) : A.Node.createDefault()
  }), Q(A.Node.prototype, "free", function() {
    A.Node.destroy(this)
  }), Q(A.Node.prototype, "freeRecursive", function() {
    for (let Z = 0, I = this.getChildCount(); Z < I; ++Z) this.getChild(0).freeRecursive();
    this.free()
  }), Q(A.Node.prototype, "calculateLayout", function(Z) {
    let I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : NaN,
      Y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : NaN,
      J = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : xt.LTR;
    return Z.call(this, I, Y, J)
  }), {
    Config: A.Config,
    Node: A.Node,
    ...TEB
  }
}
// @from(Start 5791757, End 5791792)
PEB = L(() => {
  IaA();
  IaA()
})
// @from(Start 5791794, End 5791844)
async function jEB() {
  return mh1(await NEB())
}
// @from(Start 5791849, End 5791892)
ft = L(() => {
  LEB();
  PEB();
  IaA()
})
// @from(Start 5791895, End 5792219)
function dh1({
  onlyFirst: A = !1
} = {}) {
  let B = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
  return new RegExp(B, A ? void 0 : "g")
}
// @from(Start 5792221, End 5792359)
function cY(A) {
  if (typeof A !== "string") throw TypeError(`Expected a \`string\`, got \`${typeof A}\``);
  return A.replace(xJ6, "")
}
// @from(Start 5792364, End 5792367)
xJ6
// @from(Start 5792373, End 5792404)
ET = L(() => {
  xJ6 = dh1()
})
// @from(Start 5792407, End 5796107)
function SEB(A) {
  return A === 161 || A === 164 || A === 167 || A === 168 || A === 170 || A === 173 || A === 174 || A >= 176 && A <= 180 || A >= 182 && A <= 186 || A >= 188 && A <= 191 || A === 198 || A === 208 || A === 215 || A === 216 || A >= 222 && A <= 225 || A === 230 || A >= 232 && A <= 234 || A === 236 || A === 237 || A === 240 || A === 242 || A === 243 || A >= 247 && A <= 250 || A === 252 || A === 254 || A === 257 || A === 273 || A === 275 || A === 283 || A === 294 || A === 295 || A === 299 || A >= 305 && A <= 307 || A === 312 || A >= 319 && A <= 322 || A === 324 || A >= 328 && A <= 331 || A === 333 || A === 338 || A === 339 || A === 358 || A === 359 || A === 363 || A === 462 || A === 464 || A === 466 || A === 468 || A === 470 || A === 472 || A === 474 || A === 476 || A === 593 || A === 609 || A === 708 || A === 711 || A >= 713 && A <= 715 || A === 717 || A === 720 || A >= 728 && A <= 731 || A === 733 || A === 735 || A >= 768 && A <= 879 || A >= 913 && A <= 929 || A >= 931 && A <= 937 || A >= 945 && A <= 961 || A >= 963 && A <= 969 || A === 1025 || A >= 1040 && A <= 1103 || A === 1105 || A === 8208 || A >= 8211 && A <= 8214 || A === 8216 || A === 8217 || A === 8220 || A === 8221 || A >= 8224 && A <= 8226 || A >= 8228 && A <= 8231 || A === 8240 || A === 8242 || A === 8243 || A === 8245 || A === 8251 || A === 8254 || A === 8308 || A === 8319 || A >= 8321 && A <= 8324 || A === 8364 || A === 8451 || A === 8453 || A === 8457 || A === 8467 || A === 8470 || A === 8481 || A === 8482 || A === 8486 || A === 8491 || A === 8531 || A === 8532 || A >= 8539 && A <= 8542 || A >= 8544 && A <= 8555 || A >= 8560 && A <= 8569 || A === 8585 || A >= 8592 && A <= 8601 || A === 8632 || A === 8633 || A === 8658 || A === 8660 || A === 8679 || A === 8704 || A === 8706 || A === 8707 || A === 8711 || A === 8712 || A === 8715 || A === 8719 || A === 8721 || A === 8725 || A === 8730 || A >= 8733 && A <= 8736 || A === 8739 || A === 8741 || A >= 8743 && A <= 8748 || A === 8750 || A >= 8756 && A <= 8759 || A === 8764 || A === 8765 || A === 8776 || A === 8780 || A === 8786 || A === 8800 || A === 8801 || A >= 8804 && A <= 8807 || A === 8810 || A === 8811 || A === 8814 || A === 8815 || A === 8834 || A === 8835 || A === 8838 || A === 8839 || A === 8853 || A === 8857 || A === 8869 || A === 8895 || A === 8978 || A >= 9312 && A <= 9449 || A >= 9451 && A <= 9547 || A >= 9552 && A <= 9587 || A >= 9600 && A <= 9615 || A >= 9618 && A <= 9621 || A === 9632 || A === 9633 || A >= 9635 && A <= 9641 || A === 9650 || A === 9651 || A === 9654 || A === 9655 || A === 9660 || A === 9661 || A === 9664 || A === 9665 || A >= 9670 && A <= 9672 || A === 9675 || A >= 9678 && A <= 9681 || A >= 9698 && A <= 9701 || A === 9711 || A === 9733 || A === 9734 || A === 9737 || A === 9742 || A === 9743 || A === 9756 || A === 9758 || A === 9792 || A === 9794 || A === 9824 || A === 9825 || A >= 9827 && A <= 9829 || A >= 9831 && A <= 9834 || A === 9836 || A === 9837 || A === 9839 || A === 9886 || A === 9887 || A === 9919 || A >= 9926 && A <= 9933 || A >= 9935 && A <= 9939 || A >= 9941 && A <= 9953 || A === 9955 || A === 9960 || A === 9961 || A >= 9963 && A <= 9969 || A === 9972 || A >= 9974 && A <= 9977 || A === 9979 || A === 9980 || A === 9982 || A === 9983 || A === 10045 || A >= 10102 && A <= 10111 || A >= 11094 && A <= 11097 || A >= 12872 && A <= 12879 || A >= 57344 && A <= 63743 || A >= 65024 && A <= 65039 || A === 65533 || A >= 127232 && A <= 127242 || A >= 127248 && A <= 127277 || A >= 127280 && A <= 127337 || A >= 127344 && A <= 127373 || A === 127375 || A === 127376 || A >= 127387 && A <= 127404 || A >= 917760 && A <= 917999 || A >= 983040 && A <= 1048573 || A >= 1048576 && A <= 1114109
}
// @from(Start 5796109, End 5796205)
function RUA(A) {
  return A === 12288 || A >= 65281 && A <= 65376 || A >= 65504 && A <= 65510
}
// @from(Start 5796207, End 5799331)
function TUA(A) {
  return A >= 4352 && A <= 4447 || A === 8986 || A === 8987 || A === 9001 || A === 9002 || A >= 9193 && A <= 9196 || A === 9200 || A === 9203 || A === 9725 || A === 9726 || A === 9748 || A === 9749 || A >= 9776 && A <= 9783 || A >= 9800 && A <= 9811 || A === 9855 || A >= 9866 && A <= 9871 || A === 9875 || A === 9889 || A === 9898 || A === 9899 || A === 9917 || A === 9918 || A === 9924 || A === 9925 || A === 9934 || A === 9940 || A === 9962 || A === 9970 || A === 9971 || A === 9973 || A === 9978 || A === 9981 || A === 9989 || A === 9994 || A === 9995 || A === 10024 || A === 10060 || A === 10062 || A >= 10067 && A <= 10069 || A === 10071 || A >= 10133 && A <= 10135 || A === 10160 || A === 10175 || A === 11035 || A === 11036 || A === 11088 || A === 11093 || A >= 11904 && A <= 11929 || A >= 11931 && A <= 12019 || A >= 12032 && A <= 12245 || A >= 12272 && A <= 12287 || A >= 12289 && A <= 12350 || A >= 12353 && A <= 12438 || A >= 12441 && A <= 12543 || A >= 12549 && A <= 12591 || A >= 12593 && A <= 12686 || A >= 12688 && A <= 12773 || A >= 12783 && A <= 12830 || A >= 12832 && A <= 12871 || A >= 12880 && A <= 42124 || A >= 42128 && A <= 42182 || A >= 43360 && A <= 43388 || A >= 44032 && A <= 55203 || A >= 63744 && A <= 64255 || A >= 65040 && A <= 65049 || A >= 65072 && A <= 65106 || A >= 65108 && A <= 65126 || A >= 65128 && A <= 65131 || A >= 94176 && A <= 94180 || A >= 94192 && A <= 94198 || A >= 94208 && A <= 101589 || A >= 101631 && A <= 101662 || A >= 101760 && A <= 101874 || A >= 110576 && A <= 110579 || A >= 110581 && A <= 110587 || A === 110589 || A === 110590 || A >= 110592 && A <= 110882 || A === 110898 || A >= 110928 && A <= 110930 || A === 110933 || A >= 110948 && A <= 110951 || A >= 110960 && A <= 111355 || A >= 119552 && A <= 119638 || A >= 119648 && A <= 119670 || A === 126980 || A === 127183 || A === 127374 || A >= 127377 && A <= 127386 || A >= 127488 && A <= 127490 || A >= 127504 && A <= 127547 || A >= 127552 && A <= 127560 || A === 127568 || A === 127569 || A >= 127584 && A <= 127589 || A >= 127744 && A <= 127776 || A >= 127789 && A <= 127797 || A >= 127799 && A <= 127868 || A >= 127870 && A <= 127891 || A >= 127904 && A <= 127946 || A >= 127951 && A <= 127955 || A >= 127968 && A <= 127984 || A === 127988 || A >= 127992 && A <= 128062 || A === 128064 || A >= 128066 && A <= 128252 || A >= 128255 && A <= 128317 || A >= 128331 && A <= 128334 || A >= 128336 && A <= 128359 || A === 128378 || A === 128405 || A === 128406 || A === 128420 || A >= 128507 && A <= 128591 || A >= 128640 && A <= 128709 || A === 128716 || A >= 128720 && A <= 128722 || A >= 128725 && A <= 128728 || A >= 128732 && A <= 128735 || A === 128747 || A === 128748 || A >= 128756 && A <= 128764 || A >= 128992 && A <= 129003 || A === 129008 || A >= 129292 && A <= 129338 || A >= 129340 && A <= 129349 || A >= 129351 && A <= 129535 || A >= 129648 && A <= 129660 || A >= 129664 && A <= 129674 || A >= 129678 && A <= 129734 || A === 129736 || A >= 129741 && A <= 129756 || A >= 129759 && A <= 129770 || A >= 129775 && A <= 129784 || A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141
}
// @from(Start 5799336, End 5799350)
ch1 = () => {}
// @from(Start 5799353, End 5799467)
function vJ6(A) {
  if (!Number.isSafeInteger(A)) throw TypeError(`Expected a code point, got \`${typeof A}\`.`)
}
// @from(Start 5799469, End 5799591)
function ht(A, {
  ambiguousAsWide: Q = !1
} = {}) {
  if (vJ6(A), RUA(A) || TUA(A) || Q && SEB(A)) return 2;
  return 1
}
// @from(Start 5799596, End 5799631)
PUA = L(() => {
  ch1();
  ch1()
})
// @from(Start 5799637, End 5809907)
kEB = z((yd7, _EB) => {
  _EB.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g
  }
})
// @from(Start 5809910, End 5810810)
function $D(A) {
  if (typeof A !== "string" || A.length === 0) return 0;
  let Q = !0;
  for (let G = 0; G < A.length; G++) {
    let Z = A.charCodeAt(G);
    if (Z >= 127 || Z === 27) {
      Q = !1;
      break
    }
  }
  if (Q) {
    let G = 0;
    for (let Z = 0; Z < A.length; Z++)
      if (A.charCodeAt(Z) > 31) G++;
    return G
  }
  if (A.includes("\x1B")) {
    if (A = cY(A), A.length === 0) return 0
  }
  if (!fJ6(A)) {
    let G = 0;
    for (let Z of A) {
      let I = Z.codePointAt(0);
      if (!xEB(I)) G += ht(I, {
        ambiguousAsWide: !1
      })
    }
    return G
  }
  let B = 0;
  for (let {
      segment: G
    }
    of bJ6.segment(A)) {
    if (yEB.lastIndex = 0, yEB.test(G)) {
      B += hJ6(G);
      continue
    }
    for (let Z of G) {
      let I = Z.codePointAt(0);
      if (!xEB(I)) B += ht(I, {
        ambiguousAsWide: !1
      })
    }
  }
  return B
}
// @from(Start 5810812, End 5811111)
function fJ6(A) {
  for (let Q of A) {
    let B = Q.codePointAt(0);
    if (B >= 127744 && B <= 129791) return !0;
    if (B >= 9728 && B <= 10175) return !0;
    if (B >= 127462 && B <= 127487) return !0;
    if (B >= 65024 && B <= 65039) return !0;
    if (B === 8205) return !0
  }
  return !1
}
// @from(Start 5811113, End 5811400)
function hJ6(A) {
  let Q = A.codePointAt(0);
  if (Q >= 127462 && Q <= 127487) {
    let B = 0;
    for (let G of A) B++;
    return B === 1 ? 1 : 2
  }
  if (A.length === 2) {
    if (A.codePointAt(1) === 65039 && (Q >= 48 && Q <= 57 || Q === 35 || Q === 42)) return 1
  }
  return 2
}
// @from(Start 5811402, End 5812355)
function xEB(A) {
  if (A >= 32 && A < 127) return !1;
  if (A >= 160 && A < 768) return A === 173;
  if (A <= 31 || A >= 127 && A <= 159) return !0;
  if (A >= 8203 && A <= 8205 || A === 65279 || A >= 8288 && A <= 8292) return !0;
  if (A >= 65024 && A <= 65039 || A >= 917760 && A <= 917999) return !0;
  if (A >= 768 && A <= 879 || A >= 6832 && A <= 6911 || A >= 7616 && A <= 7679 || A >= 8400 && A <= 8447 || A >= 65056 && A <= 65071) return !0;
  if (A >= 2304 && A <= 3407) {
    let Q = A & 127;
    if (Q <= 3) return !0;
    if (Q >= 58 && Q <= 79) return !0;
    if (Q >= 81 && Q <= 87) return !0;
    if (Q >= 98 && Q <= 99) return !0
  }
  if (A >= 3633 && A <= 3642 || A >= 3655 && A <= 3662 || A >= 3761 && A <= 3772 || A >= 3784 && A <= 3789) return !0;
  if (A >= 1536 && A <= 1541 || A === 1757 || A === 1807 || A === 2274) return !0;
  if (A >= 55296 && A <= 57343) return !0;
  if (A >= 917504 && A <= 917631) return !0;
  return !1
}
// @from(Start 5812360, End 5812363)
vEB
// @from(Start 5812365, End 5812368)
bJ6
// @from(Start 5812370, End 5812373)
yEB
// @from(Start 5812379, End 5812482)
jUA = L(() => {
  ET();
  PUA();
  vEB = BA(kEB(), 1), bJ6 = new Intl.Segmenter, yEB = vEB.default()
})
// @from(Start 5812485, End 5812582)
function C7A(A) {
  let Q = 0;
  for (let B of A.split(`
`)) Q = Math.max(Q, $D(B));
  return Q
}
// @from(Start 5812587, End 5812613)
YaA = L(() => {
  jUA()
})
// @from(Start 5812616, End 5812799)
function SUA(A, Q) {
  if (Q <= 0) return A.split(`
`).length;
  let B = 0;
  for (let G of A.split(`
`)) {
    let Z = $D(G);
    B += Z === 0 ? 1 : Math.ceil(Z / Q)
  }
  return B
}
// @from(Start 5812804, End 5812830)
ph1 = L(() => {
  jUA()
})
// @from(Start 5812833, End 5813075)
function gJ6(A, Q) {
  if (A.length === 0) return {
    width: 0,
    height: 0
  };
  let B = `${Q}|${A}`,
    G = bEB[B];
  if (G) return G;
  let Z = SUA(A, Q),
    Y = {
      width: C7A(A),
      height: Z
    };
  return bEB[B] = Y, Y
}
// @from(Start 5813080, End 5813083)
bEB
// @from(Start 5813085, End 5813088)
lh1
// @from(Start 5813094, End 5813154)
fEB = L(() => {
  YaA();
  ph1();
  bEB = {};
  lh1 = gJ6
})
// @from(Start 5813160, End 5826036)
gEB = z((pd7, hEB) => {
  hEB.exports = () => {
    return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g
  }
})
// @from(Start 5826039, End 5826877)
function xZ(A, Q = {}) {
  if (typeof A !== "string" || A.length === 0) return 0;
  let {
    ambiguousIsNarrow: B = !0,
    countAnsiEscapeCodes: G = !1
  } = Q;
  if (!G) A = cY(A);
  if (A.length === 0) return 0;
  let Z = 0,
    I = {
      ambiguousAsWide: !B
    };
  for (let {
      segment: Y
    }
    of uJ6.segment(A)) {
    let J = Y.codePointAt(0);
    if (J <= 31 || J >= 127 && J <= 159) continue;
    if (J >= 8203 && J <= 8207 || J === 65279) continue;
    if (J >= 768 && J <= 879 || J >= 6832 && J <= 6911 || J >= 7616 && J <= 7679 || J >= 8400 && J <= 8447 || J >= 65056 && J <= 65071) continue;
    if (J >= 55296 && J <= 57343) continue;
    if (J >= 65024 && J <= 65039) continue;
    if (mJ6.test(Y)) continue;
    if (uEB.default().test(Y)) {
      Z += 2;
      continue
    }
    Z += ht(J, I)
  }
  return Z
}
// @from(Start 5826882, End 5826885)
uEB
// @from(Start 5826887, End 5826890)
uJ6
// @from(Start 5826892, End 5826895)
mJ6
// @from(Start 5826901, End 5827028)
E7A = L(() => {
  ET();
  PUA();
  uEB = BA(gEB(), 1), uJ6 = new Intl.Segmenter, mJ6 = /^\p{Default_Ignorable_Code_Point}$/u
})
// @from(Start 5827031, End 5829311)
function pJ6() {
  let A = new Map;
  for (let [Q, B] of Object.entries(GY)) {
    for (let [G, Z] of Object.entries(B)) GY[G] = {
      open: `\x1B[${Z[0]}m`,
      close: `\x1B[${Z[1]}m`
    }, B[G] = GY[G], A.set(Z[0], Z[1]);
    Object.defineProperty(GY, Q, {
      value: B,
      enumerable: !1
    })
  }
  return Object.defineProperty(GY, "codes", {
    value: A,
    enumerable: !1
  }), GY.color.close = "\x1B[39m", GY.bgColor.close = "\x1B[49m", GY.color.ansi = mEB(), GY.color.ansi256 = dEB(), GY.color.ansi16m = cEB(), GY.bgColor.ansi = mEB(10), GY.bgColor.ansi256 = dEB(10), GY.bgColor.ansi16m = cEB(10), Object.defineProperties(GY, {
    rgbToAnsi256: {
      value: (Q, B, G) => {
        if (Q === B && B === G) {
          if (Q < 8) return 16;
          if (Q > 248) return 231;
          return Math.round((Q - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(Q / 255 * 5) + 6 * Math.round(B / 255 * 5) + Math.round(G / 255 * 5)
      },
      enumerable: !1
    },
    hexToRgb: {
      value: (Q) => {
        let B = /[a-f\d]{6}|[a-f\d]{3}/i.exec(Q.toString(16));
        if (!B) return [0, 0, 0];
        let [G] = B;
        if (G.length === 3) G = [...G].map((I) => I + I).join("");
        let Z = Number.parseInt(G, 16);
        return [Z >> 16 & 255, Z >> 8 & 255, Z & 255]
      },
      enumerable: !1
    },
    hexToAnsi256: {
      value: (Q) => GY.rgbToAnsi256(...GY.hexToRgb(Q)),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value: (Q) => {
        if (Q < 8) return 30 + Q;
        if (Q < 16) return 90 + (Q - 8);
        let B, G, Z;
        if (Q >= 232) B = ((Q - 232) * 10 + 8) / 255, G = B, Z = B;
        else {
          Q -= 16;
          let J = Q % 36;
          B = Math.floor(Q / 36) / 5, G = Math.floor(J / 6) / 5, Z = J % 6 / 5
        }
        let I = Math.max(B, G, Z) * 2;
        if (I === 0) return 30;
        let Y = 30 + (Math.round(Z) << 2 | Math.round(G) << 1 | Math.round(B));
        if (I === 2) Y += 60;
        return Y
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: (Q, B, G) => GY.ansi256ToAnsi(GY.rgbToAnsi256(Q, B, G)),
      enumerable: !1
    },
    hexToAnsi: {
      value: (Q) => GY.ansi256ToAnsi(GY.hexToAnsi256(Q)),
      enumerable: !1
    }
  }), GY
}
// @from(Start 5829316, End 5829354)
mEB = (A = 0) => (Q) => `\x1B[${Q+A}m`
// @from(Start 5829358, End 5829404)
dEB = (A = 0) => (Q) => `\x1B[${38+A};5;${Q}m`
// @from(Start 5829408, End 5829470)
cEB = (A = 0) => (Q, B, G) => `\x1B[${38+A};2;${Q};${B};${G}m`
// @from(Start 5829474, End 5829476)
GY
// @from(Start 5829478, End 5829481)
ad7
// @from(Start 5829483, End 5829486)
dJ6
// @from(Start 5829488, End 5829491)
cJ6
// @from(Start 5829493, End 5829496)
sd7
// @from(Start 5829498, End 5829501)
lJ6
// @from(Start 5829503, End 5829505)
u7
// @from(Start 5829511, End 5830920)
z7A = L(() => {
  GY = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      gray: [90, 39],
      grey: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  }, ad7 = Object.keys(GY.modifier), dJ6 = Object.keys(GY.color), cJ6 = Object.keys(GY.bgColor), sd7 = [...dJ6, ...cJ6];
  lJ6 = pJ6(), u7 = lJ6
})
// @from(Start 5830923, End 5831048)
function U7A(A, Q, B) {
  return String(A).normalize().replaceAll(`\r
`, `
`).split(`
`).map((G) => rJ6(G, Q, B)).join(`
`)
}
// @from(Start 5831053, End 5831056)
WaA
// @from(Start 5831058, End 5831066)
iJ6 = 39
// @from(Start 5831070, End 5831082)
nh1 = "\x07"
// @from(Start 5831086, End 5831095)
iEB = "["
// @from(Start 5831099, End 5831108)
nJ6 = "]"
// @from(Start 5831112, End 5831121)
nEB = "m"
// @from(Start 5831125, End 5831128)
JaA
// @from(Start 5831130, End 5831189)
pEB = (A) => `${WaA.values().next().value}${iEB}${A}${nEB}`
// @from(Start 5831193, End 5831252)
lEB = (A) => `${WaA.values().next().value}${JaA}${A}${nh1}`
// @from(Start 5831256, End 5831299)
aJ6 = (A) => A.split(" ").map((Q) => xZ(Q))
// @from(Start 5831303, End 5831906)
ih1 = (A, Q, B) => {
    let G = [...Q],
      Z = !1,
      I = !1,
      Y = xZ(cY(A.at(-1)));
    for (let [J, W] of G.entries()) {
      let X = xZ(W);
      if (Y + X <= B) A[A.length - 1] += W;
      else A.push(W), Y = 0;
      if (WaA.has(W)) Z = !0, I = G.slice(J + 1, J + 1 + JaA.length).join("") === JaA;
      if (Z) {
        if (I) {
          if (W === nh1) Z = !1, I = !1
        } else if (W === nEB) Z = !1;
        continue
      }
      if (Y += X, Y === B && J < G.length - 1) A.push(""), Y = 0
    }
    if (!Y && A.at(-1).length > 0 && A.length > 1) A[A.length - 2] += A.pop()
  }
// @from(Start 5831910, End 5832136)
sJ6 = (A) => {
    let Q = A.split(" "),
      B = Q.length;
    while (B > 0) {
      if (xZ(Q[B - 1]) > 0) break;
      B--
    }
    if (B === Q.length) return A;
    return Q.slice(0, B).join(" ") + Q.slice(B).join("")
  }
// @from(Start 5832140, End 5833904)
rJ6 = (A, Q, B = {}) => {
    if (B.trim !== !1 && A.trim() === "") return "";
    let G = "",
      Z, I, Y = aJ6(A),
      J = [""];
    for (let [F, K] of A.split(" ").entries()) {
      if (B.trim !== !1) J[J.length - 1] = J.at(-1).trimStart();
      let D = xZ(J.at(-1));
      if (F !== 0) {
        if (D >= Q && (B.wordWrap === !1 || B.trim === !1)) J.push(""), D = 0;
        if (D > 0 || B.trim === !1) J[J.length - 1] += " ", D++
      }
      if (B.hard && Y[F] > Q) {
        let H = Q - D,
          C = 1 + Math.floor((Y[F] - H - 1) / Q);
        if (Math.floor((Y[F] - 1) / Q) < C) J.push("");
        ih1(J, K, Q);
        continue
      }
      if (D + Y[F] > Q && D > 0 && Y[F] > 0) {
        if (B.wordWrap === !1 && D < Q) {
          ih1(J, K, Q);
          continue
        }
        J.push("")
      }
      if (D + Y[F] > Q && B.wordWrap === !1) {
        ih1(J, K, Q);
        continue
      }
      J[J.length - 1] += K
    }
    if (B.trim !== !1) J = J.map((F) => sJ6(F));
    let W = J.join(`
`),
      X = [...W],
      V = 0;
    for (let [F, K] of X.entries()) {
      if (G += K, WaA.has(K)) {
        let {
          groups: H
        } = new RegExp(`(?:\\${iEB}(?<code>\\d+)m|\\${JaA}(?<uri>.*)${nh1})`).exec(W.slice(V)) || {
          groups: {}
        };
        if (H.code !== void 0) {
          let C = Number.parseFloat(H.code);
          Z = C === iJ6 ? void 0 : C
        } else if (H.uri !== void 0) I = H.uri.length === 0 ? void 0 : H.uri
      }
      let D = u7.codes.get(Number(Z));
      if (X[F + 1] === `
`) {
        if (I) G += lEB("");
        if (Z && D) G += pEB(D)
      } else if (K === `
`) {
        if (Z && D) G += pEB(Z);
        if (I) G += lEB(I)
      }
      V += K.length
    }
    return G
  }
// @from(Start 5833910, End 5834004)
ah1 = L(() => {
  E7A();
  ET();
  z7A();
  WaA = new Set(["\x1B", ""]), JaA = `${nJ6}8;;`
})
// @from(Start 5834007, End 5834512)
function sh1(A) {
  if (!Number.isInteger(A)) return !1;
  return A >= 4352 && (A <= 4447 || A === 9001 || A === 9002 || 11904 <= A && A <= 12871 && A !== 12351 || 12880 <= A && A <= 19903 || 19968 <= A && A <= 42182 || 43360 <= A && A <= 43388 || 44032 <= A && A <= 55203 || 63744 <= A && A <= 64255 || 65040 <= A && A <= 65049 || 65072 <= A && A <= 65131 || 65281 <= A && A <= 65376 || 65504 <= A && A <= 65510 || 110592 <= A && A <= 110593 || 127488 <= A && A <= 127569 || 131072 <= A && A <= 262141)
}
// @from(Start 5834514, End 5835228)
function j_(A, Q, B) {
  let G = [...A],
    Z = [],
    I = typeof B === "number" ? B : G.length,
    Y = !1,
    J, W = 0,
    X = "";
  for (let [V, F] of G.entries()) {
    let K = !1;
    if (sEB.includes(F)) {
      let D = /\d[^m]*/.exec(A.slice(V, V + 18));
      if (J = D && D.length > 0 ? D[0] : void 0, W < I) {
        if (Y = !0, J !== void 0) Z.push(J)
      }
    } else if (Y && F === "m") Y = !1, K = !0;
    if (!Y && !K) W++;
    if (!oJ6.test(F) && sh1(F.codePointAt())) {
      if (W++, typeof B !== "number") I++
    }
    if (W > Q && W <= I) X += F;
    else if (W === Q && !Y && J !== void 0) X = aEB(Z);
    else if (W >= I) {
      X += aEB(Z, !0, J);
      break
    }
  }
  return X
}
// @from(Start 5835233, End 5835236)
oJ6
// @from(Start 5835238, End 5835241)
sEB
// @from(Start 5835243, End 5835273)
XaA = (A) => `${sEB[0]}[${A}m`
// @from(Start 5835277, End 5835952)
aEB = (A, Q, B) => {
    let G = [];
    A = [...A];
    for (let Z of A) {
      let I = Z;
      if (Z.includes(";")) Z = Z.split(";")[0][0] + "0";
      let Y = u7.codes.get(Number.parseInt(Z, 10));
      if (Y) {
        let J = A.indexOf(Y.toString());
        if (J === -1) G.push(XaA(Q ? Y : I));
        else A.splice(J, 1)
      } else if (Q) {
        G.push(XaA(0));
        break
      } else G.push(XaA(I))
    }
    if (Q) {
      if (G = G.filter((Z, I) => G.indexOf(Z) === I), B !== void 0) {
        let Z = XaA(u7.codes.get(Number.parseInt(B, 10)));
        G = G.reduce((I, Y) => Y === Z ? [Y, ...I] : [...I, Y], [])
      }
    }
    return G.join("")
  }
// @from(Start 5835958, End 5836049)
rEB = L(() => {
  z7A();
  oJ6 = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/, sEB = ["\x1B", ""]
})
// @from(Start 5836052, End 5836245)
function VaA(A, Q, B) {
  if (A.charAt(Q) === " ") return Q;
  let G = B ? 1 : -1;
  for (let Z = 0; Z <= 3; Z++) {
    let I = Q + Z * G;
    if (A.charAt(I) === " ") return I
  }
  return Q
}
// @from(Start 5836247, End 5837452)
function rh1(A, Q, B = {}) {
  let {
    position: G = "end",
    space: Z = !1,
    preferTruncationOnSpace: I = !1
  } = B, {
    truncationCharacter: Y = "…"
  } = B;
  if (typeof A !== "string") throw TypeError(`Expected \`input\` to be a string, got ${typeof A}`);
  if (typeof Q !== "number") throw TypeError(`Expected \`columns\` to be a number, got ${typeof Q}`);
  if (Q < 1) return "";
  if (Q === 1) return Y;
  let J = xZ(A);
  if (J <= Q) return A;
  if (G === "start") {
    if (I) {
      let W = VaA(A, J - Q + 1, !0);
      return Y + j_(A, W, J).trim()
    }
    if (Z === !0) Y += " ";
    return Y + j_(A, J - Q + xZ(Y), J)
  }
  if (G === "middle") {
    if (Z === !0) Y = ` ${Y} `;
    let W = Math.floor(Q / 2);
    if (I) {
      let X = VaA(A, W),
        V = VaA(A, J - (Q - W) + 1, !0);
      return j_(A, 0, X) + Y + j_(A, V, J).trim()
    }
    return j_(A, 0, W) + Y + j_(A, J - (Q - W) + xZ(Y), J)
  }
  if (G === "end") {
    if (I) {
      let W = VaA(A, Q - 1);
      return j_(A, 0, W) + Y
    }
    if (Z === !0) Y = ` ${Y}`;
    return j_(A, 0, Q - xZ(Y)) + Y
  }
  throw Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${G}`)
}
// @from(Start 5837457, End 5837492)
oEB = L(() => {
  rEB();
  E7A()
})
// @from(Start 5837498, End 5837501)
tEB
// @from(Start 5837503, End 5838019)
tJ6 = (A, Q, B) => {
    let G = A + String(Q) + String(B),
      Z = tEB[G];
    if (Z) return Z;
    let I = A;
    if (B === "wrap") I = U7A(A, Q, {
      trim: !1,
      hard: !0
    });
    else if (B === "wrap-trim") I = U7A(A, Q, {
      trim: !0,
      hard: !0
    });
    if (B.startsWith("truncate")) {
      let Y = "end";
      if (B === "truncate-middle") Y = "middle";
      if (B === "truncate-start") Y = "start";
      I = rh1(A, Q, {
        position: Y
      })
    }
    return tEB[G] = I, I
  }
// @from(Start 5838023, End 5838025)
ob
// @from(Start 5838031, End 5838088)
FaA = L(() => {
  ah1();
  oEB();
  tEB = {}, ob = tJ6
})
// @from(Start 5838091, End 5838657)
function KaA(A, Q = {}, B) {
  let G = [],
    Z = A.textStyles ? {
      ...Q,
      ...A.textStyles
    } : Q;
  for (let I of A.childNodes) {
    if (I === void 0) continue;
    if (I.nodeName === "#text") {
      if (I.nodeValue.length > 0) G.push({
        text: I.nodeValue,
        styles: Z,
        hyperlink: B
      })
    } else if (I.nodeName === "ink-text" || I.nodeName === "ink-virtual-text") G.push(...KaA(I, Z, B));
    else if (I.nodeName === "ink-link") {
      let Y = I.attributes.href;
      G.push(...KaA(I, Z, Y || B))
    }
  }
  return G
}
// @from(Start 5838659, End 5838963)
function oh1(A) {
  let Q = "";
  for (let B of A.childNodes) {
    if (B === void 0) continue;
    if (B.nodeName === "#text") Q += B.nodeValue;
    else if (B.nodeName === "ink-text" || B.nodeName === "ink-virtual-text") Q += oh1(B);
    else if (B.nodeName === "ink-link") Q += oh1(B)
  }
  return Q
}
// @from(Start 5838968, End 5838971)
eEB
// @from(Start 5838977, End 5839007)
th1 = L(() => {
  eEB = oh1
})
// @from(Start 5839013, End 5839025)
eh1 = void 0
// @from(Start 5839029, End 5839032)
AzB
// @from(Start 5839034, End 5839122)
eJ6 = () => {
    if (eh1 === void 0) throw Error("Yoga not loaded");
    return eh1
  }
// @from(Start 5839126, End 5839500)
DaA = (A) => {
    let Q = eJ6(),
      G = {
        nodeName: A,
        style: {},
        attributes: {},
        childNodes: [],
        parentNode: void 0,
        yogaNode: A !== "ink-virtual-text" && A !== "ink-link" && A !== "ink-progress" ? Q.Node.create() : void 0
      };
    if (A === "ink-text") G.yogaNode?.setMeasureFunc(AW6.bind(null, G));
    return G
  }
// @from(Start 5839504, End 5839773)
HaA = (A, Q) => {
    if (Q.parentNode) _UA(Q.parentNode, Q);
    if (Q.parentNode = A, A.childNodes.push(Q), Q.yogaNode) A.yogaNode?.insertChild(Q.yogaNode, A.yogaNode.getChildCount());
    if (A.nodeName === "ink-text" || A.nodeName === "ink-virtual-text") CaA(A)
  }
// @from(Start 5839777, End 5840219)
Ag1 = (A, Q, B) => {
    if (Q.parentNode) _UA(Q.parentNode, Q);
    Q.parentNode = A;
    let G = A.childNodes.indexOf(B);
    if (G >= 0) {
      if (A.childNodes.splice(G, 0, Q), Q.yogaNode) A.yogaNode?.insertChild(Q.yogaNode, G);
      return
    }
    if (A.childNodes.push(Q), Q.yogaNode) A.yogaNode?.insertChild(Q.yogaNode, A.yogaNode.getChildCount());
    if (A.nodeName === "ink-text" || A.nodeName === "ink-virtual-text") CaA(A)
  }
// @from(Start 5840223, End 5840499)
_UA = (A, Q) => {
    if (Q.yogaNode) Q.parentNode?.yogaNode?.removeChild(Q.yogaNode);
    Q.parentNode = void 0;
    let B = A.childNodes.indexOf(Q);
    if (B >= 0) A.childNodes.splice(B, 1);
    if (A.nodeName === "ink-text" || A.nodeName === "ink-virtual-text") CaA(A)
  }
// @from(Start 5840503, End 5840551)
Qg1 = (A, Q, B) => {
    A.attributes[Q] = B
  }
// @from(Start 5840555, End 5840592)
Bg1 = (A, Q) => {
    A.style = Q
  }
// @from(Start 5840596, End 5840770)
QzB = (A) => {
    let Q = {
      nodeName: "#text",
      nodeValue: A,
      yogaNode: void 0,
      parentNode: void 0,
      style: {}
    };
    return kUA(Q, A), Q
  }
// @from(Start 5840774, End 5841047)
AW6 = function(A, Q) {
    let B = A.nodeName === "#text" ? A.nodeValue : eEB(A),
      G = lh1(B, Q);
    if (G.width <= Q) return G;
    if (G.width >= 1 && Q > 0 && Q < 1) return G;
    let Z = A.style?.textWrap ?? "wrap",
      I = ob(B, Q, Z);
    return lh1(I, Q)
  }
// @from(Start 5841051, End 5841144)
BzB = (A) => {
    if (!A?.parentNode) return;
    return A.yogaNode ?? BzB(A.parentNode)
  }
// @from(Start 5841148, End 5841190)
CaA = (A) => {
    BzB(A)?.markDirty()
  }
// @from(Start 5841194, End 5841289)
kUA = (A, Q) => {
    if (typeof Q !== "string") Q = String(Q);
    A.nodeValue = Q, CaA(A)
  }
// @from(Start 5841295, End 5841408)
EaA = L(() => {
  ft();
  fEB();
  FaA();
  th1();
  l2();
  AzB = s1(async () => {
    eh1 = await jEB()
  })
})
// @from(Start 5841414, End 5841535)
BW6 = (A, Q) => {
    if ("position" in Q) A.setPositionType(Q.position === "absolute" ? H7A.Absolute : H7A.Relative)
  }
// @from(Start 5841539, End 5842029)
GW6 = (A, Q) => {
    if ("margin" in Q) A.setMargin(_6.All, Q.margin ?? 0);
    if ("marginX" in Q) A.setMargin(_6.Horizontal, Q.marginX ?? 0);
    if ("marginY" in Q) A.setMargin(_6.Vertical, Q.marginY ?? 0);
    if ("marginLeft" in Q) A.setMargin(_6.Start, Q.marginLeft || 0);
    if ("marginRight" in Q) A.setMargin(_6.End, Q.marginRight || 0);
    if ("marginTop" in Q) A.setMargin(_6.Top, Q.marginTop || 0);
    if ("marginBottom" in Q) A.setMargin(_6.Bottom, Q.marginBottom || 0)
  }
// @from(Start 5842033, End 5842545)
ZW6 = (A, Q) => {
    if ("padding" in Q) A.setPadding(_6.All, Q.padding ?? 0);
    if ("paddingX" in Q) A.setPadding(_6.Horizontal, Q.paddingX ?? 0);
    if ("paddingY" in Q) A.setPadding(_6.Vertical, Q.paddingY ?? 0);
    if ("paddingLeft" in Q) A.setPadding(_6.Left, Q.paddingLeft || 0);
    if ("paddingRight" in Q) A.setPadding(_6.Right, Q.paddingRight || 0);
    if ("paddingTop" in Q) A.setPadding(_6.Top, Q.paddingTop || 0);
    if ("paddingBottom" in Q) A.setPadding(_6.Bottom, Q.paddingBottom || 0)
  }
// @from(Start 5842549, End 5844697)
IW6 = (A, Q) => {
    if ("flexGrow" in Q) A.setFlexGrow(Q.flexGrow ?? 0);
    if ("flexShrink" in Q) A.setFlexShrink(typeof Q.flexShrink === "number" ? Q.flexShrink : 1);
    if ("flexWrap" in Q) {
      if (Q.flexWrap === "nowrap") A.setFlexWrap(bt.NoWrap);
      if (Q.flexWrap === "wrap") A.setFlexWrap(bt.Wrap);
      if (Q.flexWrap === "wrap-reverse") A.setFlexWrap(bt.WrapReverse)
    }
    if ("flexDirection" in Q) {
      if (Q.flexDirection === "row") A.setFlexDirection(rb.Row);
      if (Q.flexDirection === "row-reverse") A.setFlexDirection(rb.RowReverse);
      if (Q.flexDirection === "column") A.setFlexDirection(rb.Column);
      if (Q.flexDirection === "column-reverse") A.setFlexDirection(rb.ColumnReverse)
    }
    if ("flexBasis" in Q)
      if (typeof Q.flexBasis === "number") A.setFlexBasis(Q.flexBasis);
      else if (typeof Q.flexBasis === "string") A.setFlexBasisPercent(Number.parseInt(Q.flexBasis, 10));
    else A.setFlexBasis(Number.NaN);
    if ("alignItems" in Q) {
      if (Q.alignItems === "stretch" || !Q.alignItems) A.setAlignItems(yF.Stretch);
      if (Q.alignItems === "flex-start") A.setAlignItems(yF.FlexStart);
      if (Q.alignItems === "center") A.setAlignItems(yF.Center);
      if (Q.alignItems === "flex-end") A.setAlignItems(yF.FlexEnd)
    }
    if ("alignSelf" in Q) {
      if (Q.alignSelf === "auto" || !Q.alignSelf) A.setAlignSelf(yF.Auto);
      if (Q.alignSelf === "flex-start") A.setAlignSelf(yF.FlexStart);
      if (Q.alignSelf === "center") A.setAlignSelf(yF.Center);
      if (Q.alignSelf === "flex-end") A.setAlignSelf(yF.FlexEnd)
    }
    if ("justifyContent" in Q) {
      if (Q.justifyContent === "flex-start" || !Q.justifyContent) A.setJustifyContent(ow.FlexStart);
      if (Q.justifyContent === "center") A.setJustifyContent(ow.Center);
      if (Q.justifyContent === "flex-end") A.setJustifyContent(ow.FlexEnd);
      if (Q.justifyContent === "space-between") A.setJustifyContent(ow.SpaceBetween);
      if (Q.justifyContent === "space-around") A.setJustifyContent(ow.SpaceAround);
      if (Q.justifyContent === "space-evenly") A.setJustifyContent(ow.SpaceEvenly)
    }
  }
// @from(Start 5844701, End 5845805)
YW6 = (A, Q) => {
    if ("width" in Q)
      if (typeof Q.width === "number") A.setWidth(Q.width);
      else if (typeof Q.width === "string") A.setWidthPercent(Number.parseInt(Q.width, 10));
    else A.setWidthAuto();
    if ("height" in Q)
      if (typeof Q.height === "number") A.setHeight(Q.height);
      else if (typeof Q.height === "string") A.setHeightPercent(Number.parseInt(Q.height, 10));
    else A.setHeightAuto();
    if ("minWidth" in Q)
      if (typeof Q.minWidth === "string") A.setMinWidthPercent(Number.parseInt(Q.minWidth, 10));
      else A.setMinWidth(Q.minWidth ?? 0);
    if ("minHeight" in Q)
      if (typeof Q.minHeight === "string") A.setMinHeightPercent(Number.parseInt(Q.minHeight, 10));
      else A.setMinHeight(Q.minHeight ?? 0);
    if ("maxWidth" in Q)
      if (typeof Q.maxWidth === "string") A.setMaxWidthPercent(Number.parseInt(Q.maxWidth, 10));
      else A.setMaxWidth(Q.maxWidth ?? 0);
    if ("maxHeight" in Q)
      if (typeof Q.maxHeight === "string") A.setMaxHeightPercent(Number.parseInt(Q.maxHeight, 10));
      else A.setMaxHeight(Q.maxHeight ?? 0)
  }
// @from(Start 5845809, End 5845909)
JW6 = (A, Q) => {
    if ("display" in Q) A.setDisplay(Q.display === "flex" ? CT.Flex : CT.None)
  }
// @from(Start 5845913, End 5846234)
WW6 = (A, Q) => {
    if ("borderStyle" in Q) {
      let B = Q.borderStyle ? 1 : 0;
      if (Q.borderTop !== !1) A.setBorder(_6.Top, B);
      if (Q.borderBottom !== !1) A.setBorder(_6.Bottom, B);
      if (Q.borderLeft !== !1) A.setBorder(_6.Left, B);
      if (Q.borderRight !== !1) A.setBorder(_6.Right, B)
    }
  }
// @from(Start 5846238, End 5846429)
XW6 = (A, Q) => {
    if ("gap" in Q) A.setGap(vt.All, Q.gap ?? 0);
    if ("columnGap" in Q) A.setGap(vt.Column, Q.columnGap ?? 0);
    if ("rowGap" in Q) A.setGap(vt.Row, Q.rowGap ?? 0)
  }
// @from(Start 5846433, End 5846550)
VW6 = (A, Q = {}) => {
    BW6(A, Q), GW6(A, Q), ZW6(A, Q), IW6(A, Q), YW6(A, Q), JW6(A, Q), WW6(A, Q), XW6(A, Q)
  }
// @from(Start 5846554, End 5846557)
Gg1
// @from(Start 5846563, End 5846601)
GzB = L(() => {
  ft();
  Gg1 = VW6
})
// @from(Start 5846607, End 5847086)
tb = z(($c7, YzB) => {
  var ZzB = ["nodebuffer", "arraybuffer", "fragments"],
    IzB = typeof Blob < "u";
  if (IzB) ZzB.push("blob");
  YzB.exports = {
    BINARY_TYPES: ZzB,
    EMPTY_BUFFER: Buffer.alloc(0),
    GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    hasBlob: IzB,
    kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
    kListener: Symbol("kListener"),
    kStatusCode: Symbol("status-code"),
    kWebSocket: Symbol("websocket"),
    NOOP: () => {}
  }
})
// @from(Start 5847092, End 5848633)
yUA = z((wc7, zaA) => {
  var {
    EMPTY_BUFFER: FW6
  } = tb(), Zg1 = Buffer[Symbol.species];

  function KW6(A, Q) {
    if (A.length === 0) return FW6;
    if (A.length === 1) return A[0];
    let B = Buffer.allocUnsafe(Q),
      G = 0;
    for (let Z = 0; Z < A.length; Z++) {
      let I = A[Z];
      B.set(I, G), G += I.length
    }
    if (G < Q) return new Zg1(B.buffer, B.byteOffset, G);
    return B
  }

  function JzB(A, Q, B, G, Z) {
    for (let I = 0; I < Z; I++) B[G + I] = A[I] ^ Q[I & 3]
  }

  function WzB(A, Q) {
    for (let B = 0; B < A.length; B++) A[B] ^= Q[B & 3]
  }

  function DW6(A) {
    if (A.length === A.buffer.byteLength) return A.buffer;
    return A.buffer.slice(A.byteOffset, A.byteOffset + A.length)
  }

  function Ig1(A) {
    if (Ig1.readOnly = !0, Buffer.isBuffer(A)) return A;
    let Q;
    if (A instanceof ArrayBuffer) Q = new Zg1(A);
    else if (ArrayBuffer.isView(A)) Q = new Zg1(A.buffer, A.byteOffset, A.byteLength);
    else Q = Buffer.from(A), Ig1.readOnly = !1;
    return Q
  }
  zaA.exports = {
    concat: KW6,
    mask: JzB,
    toArrayBuffer: DW6,
    toBuffer: Ig1,
    unmask: WzB
  };
  if (!process.env.WS_NO_BUFFER_UTIL) try {
    let A = (() => {
      throw new Error("Cannot require module " + "bufferutil");
    })();
    zaA.exports.mask = function(Q, B, G, Z, I) {
      if (I < 48) JzB(Q, B, G, Z, I);
      else A.mask(Q, B, G, Z, I)
    }, zaA.exports.unmask = function(Q, B) {
      if (Q.length < 32) WzB(Q, B);
      else A.unmask(Q, B)
    }
  } catch (A) {}
})
// @from(Start 5848639, End 5849155)
KzB = z((qc7, FzB) => {
  var XzB = Symbol("kDone"),
    Yg1 = Symbol("kRun");
  class VzB {
    constructor(A) {
      this[XzB] = () => {
        this.pending--, this[Yg1]()
      }, this.concurrency = A || 1 / 0, this.jobs = [], this.pending = 0
    }
    add(A) {
      this.jobs.push(A), this[Yg1]()
    } [Yg1]() {
      if (this.pending === this.concurrency) return;
      if (this.jobs.length) {
        let A = this.jobs.shift();
        this.pending++, A(this[XzB])
      }
    }
  }
  FzB.exports = VzB
})
// @from(Start 5849161, End 5856588)
vUA = z((Nc7, zzB) => {
  var xUA = UA("zlib"),
    DzB = yUA(),
    HW6 = KzB(),
    {
      kStatusCode: HzB
    } = tb(),
    CW6 = Buffer[Symbol.species],
    EW6 = Buffer.from([0, 0, 255, 255]),
    $aA = Symbol("permessage-deflate"),
    eb = Symbol("total-length"),
    $7A = Symbol("callback"),
    rc = Symbol("buffers"),
    w7A = Symbol("error"),
    UaA;
  class CzB {
    constructor(A, Q, B) {
      if (this._maxPayload = B | 0, this._options = A || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!Q, this._deflate = null, this._inflate = null, this.params = null, !UaA) {
        let G = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
        UaA = new HW6(G)
      }
    }
    static get extensionName() {
      return "permessage-deflate"
    }
    offer() {
      let A = {};
      if (this._options.serverNoContextTakeover) A.server_no_context_takeover = !0;
      if (this._options.clientNoContextTakeover) A.client_no_context_takeover = !0;
      if (this._options.serverMaxWindowBits) A.server_max_window_bits = this._options.serverMaxWindowBits;
      if (this._options.clientMaxWindowBits) A.client_max_window_bits = this._options.clientMaxWindowBits;
      else if (this._options.clientMaxWindowBits == null) A.client_max_window_bits = !0;
      return A
    }
    accept(A) {
      return A = this.normalizeParams(A), this.params = this._isServer ? this.acceptAsServer(A) : this.acceptAsClient(A), this.params
    }
    cleanup() {
      if (this._inflate) this._inflate.close(), this._inflate = null;
      if (this._deflate) {
        let A = this._deflate[$7A];
        if (this._deflate.close(), this._deflate = null, A) A(Error("The deflate stream was closed while data was being processed"))
      }
    }
    acceptAsServer(A) {
      let Q = this._options,
        B = A.find((G) => {
          if (Q.serverNoContextTakeover === !1 && G.server_no_context_takeover || G.server_max_window_bits && (Q.serverMaxWindowBits === !1 || typeof Q.serverMaxWindowBits === "number" && Q.serverMaxWindowBits > G.server_max_window_bits) || typeof Q.clientMaxWindowBits === "number" && !G.client_max_window_bits) return !1;
          return !0
        });
      if (!B) throw Error("None of the extension offers can be accepted");
      if (Q.serverNoContextTakeover) B.server_no_context_takeover = !0;
      if (Q.clientNoContextTakeover) B.client_no_context_takeover = !0;
      if (typeof Q.serverMaxWindowBits === "number") B.server_max_window_bits = Q.serverMaxWindowBits;
      if (typeof Q.clientMaxWindowBits === "number") B.client_max_window_bits = Q.clientMaxWindowBits;
      else if (B.client_max_window_bits === !0 || Q.clientMaxWindowBits === !1) delete B.client_max_window_bits;
      return B
    }
    acceptAsClient(A) {
      let Q = A[0];
      if (this._options.clientNoContextTakeover === !1 && Q.client_no_context_takeover) throw Error('Unexpected parameter "client_no_context_takeover"');
      if (!Q.client_max_window_bits) {
        if (typeof this._options.clientMaxWindowBits === "number") Q.client_max_window_bits = this._options.clientMaxWindowBits
      } else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits === "number" && Q.client_max_window_bits > this._options.clientMaxWindowBits) throw Error('Unexpected or invalid parameter "client_max_window_bits"');
      return Q
    }
    normalizeParams(A) {
      return A.forEach((Q) => {
        Object.keys(Q).forEach((B) => {
          let G = Q[B];
          if (G.length > 1) throw Error(`Parameter "${B}" must have only a single value`);
          if (G = G[0], B === "client_max_window_bits") {
            if (G !== !0) {
              let Z = +G;
              if (!Number.isInteger(Z) || Z < 8 || Z > 15) throw TypeError(`Invalid value for parameter "${B}": ${G}`);
              G = Z
            } else if (!this._isServer) throw TypeError(`Invalid value for parameter "${B}": ${G}`)
          } else if (B === "server_max_window_bits") {
            let Z = +G;
            if (!Number.isInteger(Z) || Z < 8 || Z > 15) throw TypeError(`Invalid value for parameter "${B}": ${G}`);
            G = Z
          } else if (B === "client_no_context_takeover" || B === "server_no_context_takeover") {
            if (G !== !0) throw TypeError(`Invalid value for parameter "${B}": ${G}`)
          } else throw Error(`Unknown parameter "${B}"`);
          Q[B] = G
        })
      }), A
    }
    decompress(A, Q, B) {
      UaA.add((G) => {
        this._decompress(A, Q, (Z, I) => {
          G(), B(Z, I)
        })
      })
    }
    compress(A, Q, B) {
      UaA.add((G) => {
        this._compress(A, Q, (Z, I) => {
          G(), B(Z, I)
        })
      })
    }
    _decompress(A, Q, B) {
      let G = this._isServer ? "client" : "server";
      if (!this._inflate) {
        let Z = `${G}_max_window_bits`,
          I = typeof this.params[Z] !== "number" ? xUA.Z_DEFAULT_WINDOWBITS : this.params[Z];
        this._inflate = xUA.createInflateRaw({
          ...this._options.zlibInflateOptions,
          windowBits: I
        }), this._inflate[$aA] = this, this._inflate[eb] = 0, this._inflate[rc] = [], this._inflate.on("error", UW6), this._inflate.on("data", EzB)
      }
      if (this._inflate[$7A] = B, this._inflate.write(A), Q) this._inflate.write(EW6);
      this._inflate.flush(() => {
        let Z = this._inflate[w7A];
        if (Z) {
          this._inflate.close(), this._inflate = null, B(Z);
          return
        }
        let I = DzB.concat(this._inflate[rc], this._inflate[eb]);
        if (this._inflate._readableState.endEmitted) this._inflate.close(), this._inflate = null;
        else if (this._inflate[eb] = 0, this._inflate[rc] = [], Q && this.params[`${G}_no_context_takeover`]) this._inflate.reset();
        B(null, I)
      })
    }
    _compress(A, Q, B) {
      let G = this._isServer ? "server" : "client";
      if (!this._deflate) {
        let Z = `${G}_max_window_bits`,
          I = typeof this.params[Z] !== "number" ? xUA.Z_DEFAULT_WINDOWBITS : this.params[Z];
        this._deflate = xUA.createDeflateRaw({
          ...this._options.zlibDeflateOptions,
          windowBits: I
        }), this._deflate[eb] = 0, this._deflate[rc] = [], this._deflate.on("data", zW6)
      }
      this._deflate[$7A] = B, this._deflate.write(A), this._deflate.flush(xUA.Z_SYNC_FLUSH, () => {
        if (!this._deflate) return;
        let Z = DzB.concat(this._deflate[rc], this._deflate[eb]);
        if (Q) Z = new CW6(Z.buffer, Z.byteOffset, Z.length - 4);
        if (this._deflate[$7A] = null, this._deflate[eb] = 0, this._deflate[rc] = [], Q && this.params[`${G}_no_context_takeover`]) this._deflate.reset();
        B(null, Z)
      })
    }
  }
  zzB.exports = CzB;

  function zW6(A) {
    this[rc].push(A), this[eb] += A.length
  }

  function EzB(A) {
    if (this[eb] += A.length, this[$aA]._maxPayload < 1 || this[eb] <= this[$aA]._maxPayload) {
      this[rc].push(A);
      return
    }
    this[w7A] = RangeError("Max payload size exceeded"), this[w7A].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[w7A][HzB] = 1009, this.removeListener("data", EzB), this.reset()
  }

  function UW6(A) {
    if (this[$aA]._inflate = null, this[w7A]) {
      this[$7A](this[w7A]);
      return
    }
    A[HzB] = 1007, this[$7A](A)
  }
})
// @from(Start 5856594, End 5858703)
q7A = z((Lc7, waA) => {
  var {
    isUtf8: UzB
  } = UA("buffer"), {
    hasBlob: $W6
  } = tb(), wW6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

  function qW6(A) {
    return A >= 1000 && A <= 1014 && A !== 1004 && A !== 1005 && A !== 1006 || A >= 3000 && A <= 4999
  }

  function Jg1(A) {
    let Q = A.length,
      B = 0;
    while (B < Q)
      if ((A[B] & 128) === 0) B++;
      else if ((A[B] & 224) === 192) {
      if (B + 1 === Q || (A[B + 1] & 192) !== 128 || (A[B] & 254) === 192) return !1;
      B += 2
    } else if ((A[B] & 240) === 224) {
      if (B + 2 >= Q || (A[B + 1] & 192) !== 128 || (A[B + 2] & 192) !== 128 || A[B] === 224 && (A[B + 1] & 224) === 128 || A[B] === 237 && (A[B + 1] & 224) === 160) return !1;
      B += 3
    } else if ((A[B] & 248) === 240) {
      if (B + 3 >= Q || (A[B + 1] & 192) !== 128 || (A[B + 2] & 192) !== 128 || (A[B + 3] & 192) !== 128 || A[B] === 240 && (A[B + 1] & 240) === 128 || A[B] === 244 && A[B + 1] > 143 || A[B] > 244) return !1;
      B += 4
    } else return !1;
    return !0
  }

  function NW6(A) {
    return $W6 && typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && (A[Symbol.toStringTag] === "Blob" || A[Symbol.toStringTag] === "File")
  }
  waA.exports = {
    isBlob: NW6,
    isValidStatusCode: qW6,
    isValidUTF8: Jg1,
    tokenChars: wW6
  };
  if (UzB) waA.exports.isValidUTF8 = function(A) {
    return A.length < 24 ? Jg1(A) : UzB(A)
  };
  else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
    let A = (() => {
      throw new Error("Cannot require module " + "utf-8-validate");
    })();
    waA.exports.isValidUTF8 = function(Q) {
      return Q.length < 32 ? Jg1(Q) : A(Q)
    }
  } catch (A) {}
})
// @from(Start 5858709, End 5869108)
Xg1 = z((Mc7, LzB) => {
  var {
    Writable: LW6
  } = UA("stream"), $zB = vUA(), {
    BINARY_TYPES: MW6,
    EMPTY_BUFFER: wzB,
    kStatusCode: OW6,
    kWebSocket: RW6
  } = tb(), {
    concat: Wg1,
    toArrayBuffer: TW6,
    unmask: PW6
  } = yUA(), {
    isValidStatusCode: jW6,
    isValidUTF8: qzB
  } = q7A(), qaA = Buffer[Symbol.species];
  class NzB extends LW6 {
    constructor(A = {}) {
      super();
      this._allowSynchronousEvents = A.allowSynchronousEvents !== void 0 ? A.allowSynchronousEvents : !0, this._binaryType = A.binaryType || MW6[0], this._extensions = A.extensions || {}, this._isServer = !!A.isServer, this._maxPayload = A.maxPayload | 0, this._skipUTF8Validation = !!A.skipUTF8Validation, this[RW6] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = 0
    }
    _write(A, Q, B) {
      if (this._opcode === 8 && this._state == 0) return B();
      this._bufferedBytes += A.length, this._buffers.push(A), this.startLoop(B)
    }
    consume(A) {
      if (this._bufferedBytes -= A, A === this._buffers[0].length) return this._buffers.shift();
      if (A < this._buffers[0].length) {
        let B = this._buffers[0];
        return this._buffers[0] = new qaA(B.buffer, B.byteOffset + A, B.length - A), new qaA(B.buffer, B.byteOffset, A)
      }
      let Q = Buffer.allocUnsafe(A);
      do {
        let B = this._buffers[0],
          G = Q.length - A;
        if (A >= B.length) Q.set(this._buffers.shift(), G);
        else Q.set(new Uint8Array(B.buffer, B.byteOffset, A), G), this._buffers[0] = new qaA(B.buffer, B.byteOffset + A, B.length - A);
        A -= B.length
      } while (A > 0);
      return Q
    }
    startLoop(A) {
      this._loop = !0;
      do switch (this._state) {
        case 0:
          this.getInfo(A);
          break;
        case 1:
          this.getPayloadLength16(A);
          break;
        case 2:
          this.getPayloadLength64(A);
          break;
        case 3:
          this.getMask();
          break;
        case 4:
          this.getData(A);
          break;
        case 5:
        case 6:
          this._loop = !1;
          return
      }
      while (this._loop);
      if (!this._errored) A()
    }
    getInfo(A) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return
      }
      let Q = this.consume(2);
      if ((Q[0] & 48) !== 0) {
        let G = this.createError(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
        A(G);
        return
      }
      let B = (Q[0] & 64) === 64;
      if (B && !this._extensions[$zB.extensionName]) {
        let G = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
        A(G);
        return
      }
      if (this._fin = (Q[0] & 128) === 128, this._opcode = Q[0] & 15, this._payloadLength = Q[1] & 127, this._opcode === 0) {
        if (B) {
          let G = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          A(G);
          return
        }
        if (!this._fragmented) {
          let G = this.createError(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
          A(G);
          return
        }
        this._opcode = this._fragmented
      } else if (this._opcode === 1 || this._opcode === 2) {
        if (this._fragmented) {
          let G = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
          A(G);
          return
        }
        this._compressed = B
      } else if (this._opcode > 7 && this._opcode < 11) {
        if (!this._fin) {
          let G = this.createError(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
          A(G);
          return
        }
        if (B) {
          let G = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          A(G);
          return
        }
        if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
          let G = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
          A(G);
          return
        }
      } else {
        let G = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
        A(G);
        return
      }
      if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
      if (this._masked = (Q[1] & 128) === 128, this._isServer) {
        if (!this._masked) {
          let G = this.createError(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK");
          A(G);
          return
        }
      } else if (this._masked) {
        let G = this.createError(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
        A(G);
        return
      }
      if (this._payloadLength === 126) this._state = 1;
      else if (this._payloadLength === 127) this._state = 2;
      else this.haveLength(A)
    }
    getPayloadLength16(A) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return
      }
      this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(A)
    }
    getPayloadLength64(A) {
      if (this._bufferedBytes < 8) {
        this._loop = !1;
        return
      }
      let Q = this.consume(8),
        B = Q.readUInt32BE(0);
      if (B > Math.pow(2, 21) - 1) {
        let G = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
        A(G);
        return
      }
      this._payloadLength = B * Math.pow(2, 32) + Q.readUInt32BE(4), this.haveLength(A)
    }
    haveLength(A) {
      if (this._payloadLength && this._opcode < 8) {
        if (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
          let Q = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
          A(Q);
          return
        }
      }
      if (this._masked) this._state = 3;
      else this._state = 4
    }
    getMask() {
      if (this._bufferedBytes < 4) {
        this._loop = !1;
        return
      }
      this._mask = this.consume(4), this._state = 4
    }
    getData(A) {
      let Q = wzB;
      if (this._payloadLength) {
        if (this._bufferedBytes < this._payloadLength) {
          this._loop = !1;
          return
        }
        if (Q = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) PW6(Q, this._mask)
      }
      if (this._opcode > 7) {
        this.controlMessage(Q, A);
        return
      }
      if (this._compressed) {
        this._state = 5, this.decompress(Q, A);
        return
      }
      if (Q.length) this._messageLength = this._totalPayloadLength, this._fragments.push(Q);
      this.dataMessage(A)
    }
    decompress(A, Q) {
      this._extensions[$zB.extensionName].decompress(A, this._fin, (G, Z) => {
        if (G) return Q(G);
        if (Z.length) {
          if (this._messageLength += Z.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
            let I = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
            Q(I);
            return
          }
          this._fragments.push(Z)
        }
        if (this.dataMessage(Q), this._state === 0) this.startLoop(Q)
      })
    }
    dataMessage(A) {
      if (!this._fin) {
        this._state = 0;
        return
      }
      let Q = this._messageLength,
        B = this._fragments;
      if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
        let G;
        if (this._binaryType === "nodebuffer") G = Wg1(B, Q);
        else if (this._binaryType === "arraybuffer") G = TW6(Wg1(B, Q));
        else if (this._binaryType === "blob") G = new Blob(B);
        else G = B;
        if (this._allowSynchronousEvents) this.emit("message", G, !0), this._state = 0;
        else this._state = 6, setImmediate(() => {
          this.emit("message", G, !0), this._state = 0, this.startLoop(A)
        })
      } else {
        let G = Wg1(B, Q);
        if (!this._skipUTF8Validation && !qzB(G)) {
          let Z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
          A(Z);
          return
        }
        if (this._state === 5 || this._allowSynchronousEvents) this.emit("message", G, !1), this._state = 0;
        else this._state = 6, setImmediate(() => {
          this.emit("message", G, !1), this._state = 0, this.startLoop(A)
        })
      }
    }
    controlMessage(A, Q) {
      if (this._opcode === 8) {
        if (A.length === 0) this._loop = !1, this.emit("conclude", 1005, wzB), this.end();
        else {
          let B = A.readUInt16BE(0);
          if (!jW6(B)) {
            let Z = this.createError(RangeError, `invalid status code ${B}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
            Q(Z);
            return
          }
          let G = new qaA(A.buffer, A.byteOffset + 2, A.length - 2);
          if (!this._skipUTF8Validation && !qzB(G)) {
            let Z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
            Q(Z);
            return
          }
          this._loop = !1, this.emit("conclude", B, G), this.end()
        }
        this._state = 0;
        return
      }
      if (this._allowSynchronousEvents) this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0;
      else this._state = 6, setImmediate(() => {
        this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0, this.startLoop(Q)
      })
    }
    createError(A, Q, B, G, Z) {
      this._loop = !1, this._errored = !0;
      let I = new A(B ? `Invalid WebSocket frame: ${Q}` : Q);
      return Error.captureStackTrace(I, this.createError), I.code = Z, I[OW6] = G, I
    }
  }
  LzB.exports = NzB
})
// @from(Start 5869114, End 5876569)
Fg1 = z((Rc7, RzB) => {
  var {
    Duplex: Oc7
  } = UA("stream"), {
    randomFillSync: SW6
  } = UA("crypto"), MzB = vUA(), {
    EMPTY_BUFFER: _W6,
    kWebSocket: kW6,
    NOOP: yW6
  } = tb(), {
    isBlob: N7A,
    isValidStatusCode: xW6
  } = q7A(), {
    mask: OzB,
    toBuffer: gt
  } = yUA(), WM = Symbol("kByteLength"), vW6 = Buffer.alloc(4), ut, L7A = 8192, zT = 0, bW6 = 1, fW6 = 2;
  class oc {
    constructor(A, Q, B) {
      if (this._extensions = Q || {}, B) this._generateMask = B, this._maskBuffer = Buffer.alloc(4);
      this._socket = A, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = zT, this.onerror = yW6, this[kW6] = void 0
    }
    static frame(A, Q) {
      let B, G = !1,
        Z = 2,
        I = !1;
      if (Q.mask) {
        if (B = Q.maskBuffer || vW6, Q.generateMask) Q.generateMask(B);
        else {
          if (L7A === 8192) {
            if (ut === void 0) ut = Buffer.alloc(8192);
            SW6(ut, 0, 8192), L7A = 0
          }
          B[0] = ut[L7A++], B[1] = ut[L7A++], B[2] = ut[L7A++], B[3] = ut[L7A++]
        }
        I = (B[0] | B[1] | B[2] | B[3]) === 0, Z = 6
      }
      let Y;
      if (typeof A === "string")
        if ((!Q.mask || I) && Q[WM] !== void 0) Y = Q[WM];
        else A = Buffer.from(A), Y = A.length;
      else Y = A.length, G = Q.mask && Q.readOnly && !I;
      let J = Y;
      if (Y >= 65536) Z += 8, J = 127;
      else if (Y > 125) Z += 2, J = 126;
      let W = Buffer.allocUnsafe(G ? Y + Z : Z);
      if (W[0] = Q.fin ? Q.opcode | 128 : Q.opcode, Q.rsv1) W[0] |= 64;
      if (W[1] = J, J === 126) W.writeUInt16BE(Y, 2);
      else if (J === 127) W[2] = W[3] = 0, W.writeUIntBE(Y, 4, 6);
      if (!Q.mask) return [W, A];
      if (W[1] |= 128, W[Z - 4] = B[0], W[Z - 3] = B[1], W[Z - 2] = B[2], W[Z - 1] = B[3], I) return [W, A];
      if (G) return OzB(A, B, W, Z, Y), [W];
      return OzB(A, B, A, 0, Y), [W, A]
    }
    close(A, Q, B, G) {
      let Z;
      if (A === void 0) Z = _W6;
      else if (typeof A !== "number" || !xW6(A)) throw TypeError("First argument must be a valid error code number");
      else if (Q === void 0 || !Q.length) Z = Buffer.allocUnsafe(2), Z.writeUInt16BE(A, 0);
      else {
        let Y = Buffer.byteLength(Q);
        if (Y > 123) throw RangeError("The message must not be greater than 123 bytes");
        if (Z = Buffer.allocUnsafe(2 + Y), Z.writeUInt16BE(A, 0), typeof Q === "string") Z.write(Q, 2);
        else Z.set(Q, 2)
      }
      let I = {
        [WM]: Z.length,
        fin: !0,
        generateMask: this._generateMask,
        mask: B,
        maskBuffer: this._maskBuffer,
        opcode: 8,
        readOnly: !1,
        rsv1: !1
      };
      if (this._state !== zT) this.enqueue([this.dispatch, Z, !1, I, G]);
      else this.sendFrame(oc.frame(Z, I), G)
    }
    ping(A, Q, B) {
      let G, Z;
      if (typeof A === "string") G = Buffer.byteLength(A), Z = !1;
      else if (N7A(A)) G = A.size, Z = !1;
      else A = gt(A), G = A.length, Z = gt.readOnly;
      if (G > 125) throw RangeError("The data size must not be greater than 125 bytes");
      let I = {
        [WM]: G,
        fin: !0,
        generateMask: this._generateMask,
        mask: Q,
        maskBuffer: this._maskBuffer,
        opcode: 9,
        readOnly: Z,
        rsv1: !1
      };
      if (N7A(A))
        if (this._state !== zT) this.enqueue([this.getBlobData, A, !1, I, B]);
        else this.getBlobData(A, !1, I, B);
      else if (this._state !== zT) this.enqueue([this.dispatch, A, !1, I, B]);
      else this.sendFrame(oc.frame(A, I), B)
    }
    pong(A, Q, B) {
      let G, Z;
      if (typeof A === "string") G = Buffer.byteLength(A), Z = !1;
      else if (N7A(A)) G = A.size, Z = !1;
      else A = gt(A), G = A.length, Z = gt.readOnly;
      if (G > 125) throw RangeError("The data size must not be greater than 125 bytes");
      let I = {
        [WM]: G,
        fin: !0,
        generateMask: this._generateMask,
        mask: Q,
        maskBuffer: this._maskBuffer,
        opcode: 10,
        readOnly: Z,
        rsv1: !1
      };
      if (N7A(A))
        if (this._state !== zT) this.enqueue([this.getBlobData, A, !1, I, B]);
        else this.getBlobData(A, !1, I, B);
      else if (this._state !== zT) this.enqueue([this.dispatch, A, !1, I, B]);
      else this.sendFrame(oc.frame(A, I), B)
    }
    send(A, Q, B) {
      let G = this._extensions[MzB.extensionName],
        Z = Q.binary ? 2 : 1,
        I = Q.compress,
        Y, J;
      if (typeof A === "string") Y = Buffer.byteLength(A), J = !1;
      else if (N7A(A)) Y = A.size, J = !1;
      else A = gt(A), Y = A.length, J = gt.readOnly;
      if (this._firstFragment) {
        if (this._firstFragment = !1, I && G && G.params[G._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) I = Y >= G._threshold;
        this._compress = I
      } else I = !1, Z = 0;
      if (Q.fin) this._firstFragment = !0;
      let W = {
        [WM]: Y,
        fin: Q.fin,
        generateMask: this._generateMask,
        mask: Q.mask,
        maskBuffer: this._maskBuffer,
        opcode: Z,
        readOnly: J,
        rsv1: I
      };
      if (N7A(A))
        if (this._state !== zT) this.enqueue([this.getBlobData, A, this._compress, W, B]);
        else this.getBlobData(A, this._compress, W, B);
      else if (this._state !== zT) this.enqueue([this.dispatch, A, this._compress, W, B]);
      else this.dispatch(A, this._compress, W, B)
    }
    getBlobData(A, Q, B, G) {
      this._bufferedBytes += B[WM], this._state = fW6, A.arrayBuffer().then((Z) => {
        if (this._socket.destroyed) {
          let Y = Error("The socket was closed while the blob was being read");
          process.nextTick(Vg1, this, Y, G);
          return
        }
        this._bufferedBytes -= B[WM];
        let I = gt(Z);
        if (!Q) this._state = zT, this.sendFrame(oc.frame(I, B), G), this.dequeue();
        else this.dispatch(I, Q, B, G)
      }).catch((Z) => {
        process.nextTick(hW6, this, Z, G)
      })
    }
    dispatch(A, Q, B, G) {
      if (!Q) {
        this.sendFrame(oc.frame(A, B), G);
        return
      }
      let Z = this._extensions[MzB.extensionName];
      this._bufferedBytes += B[WM], this._state = bW6, Z.compress(A, B.fin, (I, Y) => {
        if (this._socket.destroyed) {
          let J = Error("The socket was closed while data was being compressed");
          Vg1(this, J, G);
          return
        }
        this._bufferedBytes -= B[WM], this._state = zT, B.readOnly = !1, this.sendFrame(oc.frame(Y, B), G), this.dequeue()
      })
    }
    dequeue() {
      while (this._state === zT && this._queue.length) {
        let A = this._queue.shift();
        this._bufferedBytes -= A[3][WM], Reflect.apply(A[0], this, A.slice(1))
      }
    }
    enqueue(A) {
      this._bufferedBytes += A[3][WM], this._queue.push(A)
    }
    sendFrame(A, Q) {
      if (A.length === 2) this._socket.cork(), this._socket.write(A[0]), this._socket.write(A[1], Q), this._socket.uncork();
      else this._socket.write(A[0], Q)
    }
  }
  RzB.exports = oc;

  function Vg1(A, Q, B) {
    if (typeof B === "function") B(Q);
    for (let G = 0; G < A._queue.length; G++) {
      let Z = A._queue[G],
        I = Z[Z.length - 1];
      if (typeof I === "function") I(Q)
    }
  }

  function hW6(A, Q, B) {
    Vg1(A, Q, B), A.onerror(Q)
  }
})
// @from(Start 5876575, End 5879956)
vzB = z((Tc7, xzB) => {
  var {
    kForOnEventAttribute: bUA,
    kListener: Kg1
  } = tb(), TzB = Symbol("kCode"), PzB = Symbol("kData"), jzB = Symbol("kError"), SzB = Symbol("kMessage"), _zB = Symbol("kReason"), M7A = Symbol("kTarget"), kzB = Symbol("kType"), yzB = Symbol("kWasClean");
  class tc {
    constructor(A) {
      this[M7A] = null, this[kzB] = A
    }
    get target() {
      return this[M7A]
    }
    get type() {
      return this[kzB]
    }
  }
  Object.defineProperty(tc.prototype, "target", {
    enumerable: !0
  });
  Object.defineProperty(tc.prototype, "type", {
    enumerable: !0
  });
  class O7A extends tc {
    constructor(A, Q = {}) {
      super(A);
      this[TzB] = Q.code === void 0 ? 0 : Q.code, this[_zB] = Q.reason === void 0 ? "" : Q.reason, this[yzB] = Q.wasClean === void 0 ? !1 : Q.wasClean
    }
    get code() {
      return this[TzB]
    }
    get reason() {
      return this[_zB]
    }
    get wasClean() {
      return this[yzB]
    }
  }
  Object.defineProperty(O7A.prototype, "code", {
    enumerable: !0
  });
  Object.defineProperty(O7A.prototype, "reason", {
    enumerable: !0
  });
  Object.defineProperty(O7A.prototype, "wasClean", {
    enumerable: !0
  });
  class fUA extends tc {
    constructor(A, Q = {}) {
      super(A);
      this[jzB] = Q.error === void 0 ? null : Q.error, this[SzB] = Q.message === void 0 ? "" : Q.message
    }
    get error() {
      return this[jzB]
    }
    get message() {
      return this[SzB]
    }
  }
  Object.defineProperty(fUA.prototype, "error", {
    enumerable: !0
  });
  Object.defineProperty(fUA.prototype, "message", {
    enumerable: !0
  });
  class LaA extends tc {
    constructor(A, Q = {}) {
      super(A);
      this[PzB] = Q.data === void 0 ? null : Q.data
    }
    get data() {
      return this[PzB]
    }
  }
  Object.defineProperty(LaA.prototype, "data", {
    enumerable: !0
  });
  var gW6 = {
    addEventListener(A, Q, B = {}) {
      for (let Z of this.listeners(A))
        if (!B[bUA] && Z[Kg1] === Q && !Z[bUA]) return;
      let G;
      if (A === "message") G = function(I, Y) {
        let J = new LaA("message", {
          data: Y ? I : I.toString()
        });
        J[M7A] = this, NaA(Q, this, J)
      };
      else if (A === "close") G = function(I, Y) {
        let J = new O7A("close", {
          code: I,
          reason: Y.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });
        J[M7A] = this, NaA(Q, this, J)
      };
      else if (A === "error") G = function(I) {
        let Y = new fUA("error", {
          error: I,
          message: I.message
        });
        Y[M7A] = this, NaA(Q, this, Y)
      };
      else if (A === "open") G = function() {
        let I = new tc("open");
        I[M7A] = this, NaA(Q, this, I)
      };
      else return;
      if (G[bUA] = !!B[bUA], G[Kg1] = Q, B.once) this.once(A, G);
      else this.on(A, G)
    },
    removeEventListener(A, Q) {
      for (let B of this.listeners(A))
        if (B[Kg1] === Q && !B[bUA]) {
          this.removeListener(A, B);
          break
        }
    }
  };
  xzB.exports = {
    CloseEvent: O7A,
    ErrorEvent: fUA,
    Event: tc,
    EventTarget: gW6,
    MessageEvent: LaA
  };

  function NaA(A, Q, B) {
    if (typeof A === "object" && A.handleEvent) A.handleEvent.call(A, B);
    else A.call(Q, B)
  }
})
// @from(Start 5879962, End 5883241)
Dg1 = z((Pc7, bzB) => {
  var {
    tokenChars: hUA
  } = q7A();

  function S_(A, Q, B) {
    if (A[Q] === void 0) A[Q] = [B];
    else A[Q].push(B)
  }

  function uW6(A) {
    let Q = Object.create(null),
      B = Object.create(null),
      G = !1,
      Z = !1,
      I = !1,
      Y, J, W = -1,
      X = -1,
      V = -1,
      F = 0;
    for (; F < A.length; F++)
      if (X = A.charCodeAt(F), Y === void 0)
        if (V === -1 && hUA[X] === 1) {
          if (W === -1) W = F
        } else if (F !== 0 && (X === 32 || X === 9)) {
      if (V === -1 && W !== -1) V = F
    } else if (X === 59 || X === 44) {
      if (W === -1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (V === -1) V = F;
      let D = A.slice(W, V);
      if (X === 44) S_(Q, D, B), B = Object.create(null);
      else Y = D;
      W = V = -1
    } else throw SyntaxError(`Unexpected character at index ${F}`);
    else if (J === void 0)
      if (V === -1 && hUA[X] === 1) {
        if (W === -1) W = F
      } else if (X === 32 || X === 9) {
      if (V === -1 && W !== -1) V = F
    } else if (X === 59 || X === 44) {
      if (W === -1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (V === -1) V = F;
      if (S_(B, A.slice(W, V), !0), X === 44) S_(Q, Y, B), B = Object.create(null), Y = void 0;
      W = V = -1
    } else if (X === 61 && W !== -1 && V === -1) J = A.slice(W, F), W = V = -1;
    else throw SyntaxError(`Unexpected character at index ${F}`);
    else if (Z) {
      if (hUA[X] !== 1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (W === -1) W = F;
      else if (!G) G = !0;
      Z = !1
    } else if (I)
      if (hUA[X] === 1) {
        if (W === -1) W = F
      } else if (X === 34 && W !== -1) I = !1, V = F;
    else if (X === 92) Z = !0;
    else throw SyntaxError(`Unexpected character at index ${F}`);
    else if (X === 34 && A.charCodeAt(F - 1) === 61) I = !0;
    else if (V === -1 && hUA[X] === 1) {
      if (W === -1) W = F
    } else if (W !== -1 && (X === 32 || X === 9)) {
      if (V === -1) V = F
    } else if (X === 59 || X === 44) {
      if (W === -1) throw SyntaxError(`Unexpected character at index ${F}`);
      if (V === -1) V = F;
      let D = A.slice(W, V);
      if (G) D = D.replace(/\\/g, ""), G = !1;
      if (S_(B, J, D), X === 44) S_(Q, Y, B), B = Object.create(null), Y = void 0;
      J = void 0, W = V = -1
    } else throw SyntaxError(`Unexpected character at index ${F}`);
    if (W === -1 || I || X === 32 || X === 9) throw SyntaxError("Unexpected end of input");
    if (V === -1) V = F;
    let K = A.slice(W, V);
    if (Y === void 0) S_(Q, K, B);
    else {
      if (J === void 0) S_(B, K, !0);
      else if (G) S_(B, J, K.replace(/\\/g, ""));
      else S_(B, J, K);
      S_(Q, Y, B)
    }
    return Q
  }

  function mW6(A) {
    return Object.keys(A).map((Q) => {
      let B = A[Q];
      if (!Array.isArray(B)) B = [B];
      return B.map((G) => {
        return [Q].concat(Object.keys(G).map((Z) => {
          let I = G[Z];
          if (!Array.isArray(I)) I = [I];
          return I.map((Y) => Y === !0 ? Z : `${Z}=${Y}`).join("; ")
        })).join("; ")
      }).join(", ")
    }).join(", ")
  }
  bzB.exports = {
    format: mW6,
    parse: uW6
  }
})
// @from(Start 5883247, End 5901575)
TaA = z((_c7, azB) => {
  var dW6 = UA("events"),
    cW6 = UA("https"),
    pW6 = UA("http"),
    gzB = UA("net"),
    lW6 = UA("tls"),
    {
      randomBytes: iW6,
      createHash: nW6
    } = UA("crypto"),
    {
      Duplex: jc7,
      Readable: Sc7
    } = UA("stream"),
    {
      URL: Hg1
    } = UA("url"),
    ec = vUA(),
    aW6 = Xg1(),
    sW6 = Fg1(),
    {
      isBlob: rW6
    } = q7A(),
    {
      BINARY_TYPES: fzB,
      EMPTY_BUFFER: MaA,
      GUID: oW6,
      kForOnEventAttribute: Cg1,
      kListener: tW6,
      kStatusCode: eW6,
      kWebSocket: xF,
      NOOP: uzB
    } = tb(),
    {
      EventTarget: {
        addEventListener: AX6,
        removeEventListener: QX6
      }
    } = vzB(),
    {
      format: BX6,
      parse: GX6
    } = Dg1(),
    {
      toBuffer: ZX6
    } = yUA(),
    mzB = Symbol("kAborted"),
    Eg1 = [8, 13],
    Af = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
    IX6 = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
  class D8 extends dW6 {
    constructor(A, Q, B) {
      super();
      if (this._binaryType = fzB[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = MaA, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = D8.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, A !== null) {
        if (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, Q === void 0) Q = [];
        else if (!Array.isArray(Q))
          if (typeof Q === "object" && Q !== null) B = Q, Q = [];
          else Q = [Q];
        dzB(this, A, Q, B)
      } else this._autoPong = B.autoPong, this._isServer = !0
    }
    get binaryType() {
      return this._binaryType
    }
    set binaryType(A) {
      if (!fzB.includes(A)) return;
      if (this._binaryType = A, this._receiver) this._receiver._binaryType = A
    }
    get bufferedAmount() {
      if (!this._socket) return this._bufferedAmount;
      return this._socket._writableState.length + this._sender._bufferedBytes
    }
    get extensions() {
      return Object.keys(this._extensions).join()
    }
    get isPaused() {
      return this._paused
    }
    get onclose() {
      return null
    }
    get onerror() {
      return null
    }
    get onopen() {
      return null
    }
    get onmessage() {
      return null
    }
    get protocol() {
      return this._protocol
    }
    get readyState() {
      return this._readyState
    }
    get url() {
      return this._url
    }
    setSocket(A, Q, B) {
      let G = new aW6({
          allowSynchronousEvents: B.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: B.maxPayload,
          skipUTF8Validation: B.skipUTF8Validation
        }),
        Z = new sW6(A, this._extensions, B.generateMask);
      if (this._receiver = G, this._sender = Z, this._socket = A, G[xF] = this, Z[xF] = this, A[xF] = this, G.on("conclude", WX6), G.on("drain", XX6), G.on("error", VX6), G.on("message", FX6), G.on("ping", KX6), G.on("pong", DX6), Z.onerror = HX6, A.setTimeout) A.setTimeout(0);
      if (A.setNoDelay) A.setNoDelay();
      if (Q.length > 0) A.unshift(Q);
      A.on("close", lzB), A.on("data", RaA), A.on("end", izB), A.on("error", nzB), this._readyState = D8.OPEN, this.emit("open")
    }
    emitClose() {
      if (!this._socket) {
        this._readyState = D8.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
        return
      }
      if (this._extensions[ec.extensionName]) this._extensions[ec.extensionName].cleanup();
      this._receiver.removeAllListeners(), this._readyState = D8.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
    }
    close(A, Q) {
      if (this.readyState === D8.CLOSED) return;
      if (this.readyState === D8.CONNECTING) {
        tw(this, this._req, "WebSocket was closed before the connection was established");
        return
      }
      if (this.readyState === D8.CLOSING) {
        if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
        return
      }
      this._readyState = D8.CLOSING, this._sender.close(A, Q, !this._isServer, (B) => {
        if (B) return;
        if (this._closeFrameSent = !0, this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end()
      }), pzB(this)
    }
    pause() {
      if (this.readyState === D8.CONNECTING || this.readyState === D8.CLOSED) return;
      this._paused = !0, this._socket.pause()
    }
    ping(A, Q, B) {
      if (this.readyState === D8.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof A === "function") B = A, A = Q = void 0;
      else if (typeof Q === "function") B = Q, Q = void 0;
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== D8.OPEN) {
        zg1(this, A, B);
        return
      }
      if (Q === void 0) Q = !this._isServer;
      this._sender.ping(A || MaA, Q, B)
    }
    pong(A, Q, B) {
      if (this.readyState === D8.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof A === "function") B = A, A = Q = void 0;
      else if (typeof Q === "function") B = Q, Q = void 0;
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== D8.OPEN) {
        zg1(this, A, B);
        return
      }
      if (Q === void 0) Q = !this._isServer;
      this._sender.pong(A || MaA, Q, B)
    }
    resume() {
      if (this.readyState === D8.CONNECTING || this.readyState === D8.CLOSED) return;
      if (this._paused = !1, !this._receiver._writableState.needDrain) this._socket.resume()
    }
    send(A, Q, B) {
      if (this.readyState === D8.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof Q === "function") B = Q, Q = {};
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== D8.OPEN) {
        zg1(this, A, B);
        return
      }
      let G = {
        binary: typeof A !== "string",
        mask: !this._isServer,
        compress: !0,
        fin: !0,
        ...Q
      };
      if (!this._extensions[ec.extensionName]) G.compress = !1;
      this._sender.send(A || MaA, G, B)
    }
    terminate() {
      if (this.readyState === D8.CLOSED) return;
      if (this.readyState === D8.CONNECTING) {
        tw(this, this._req, "WebSocket was closed before the connection was established");
        return
      }
      if (this._socket) this._readyState = D8.CLOSING, this._socket.destroy()
    }
  }
  Object.defineProperty(D8, "CONNECTING", {
    enumerable: !0,
    value: Af.indexOf("CONNECTING")
  });
  Object.defineProperty(D8.prototype, "CONNECTING", {
    enumerable: !0,
    value: Af.indexOf("CONNECTING")
  });
  Object.defineProperty(D8, "OPEN", {
    enumerable: !0,
    value: Af.indexOf("OPEN")
  });
  Object.defineProperty(D8.prototype, "OPEN", {
    enumerable: !0,
    value: Af.indexOf("OPEN")
  });
  Object.defineProperty(D8, "CLOSING", {
    enumerable: !0,
    value: Af.indexOf("CLOSING")
  });
  Object.defineProperty(D8.prototype, "CLOSING", {
    enumerable: !0,
    value: Af.indexOf("CLOSING")
  });
  Object.defineProperty(D8, "CLOSED", {
    enumerable: !0,
    value: Af.indexOf("CLOSED")
  });
  Object.defineProperty(D8.prototype, "CLOSED", {
    enumerable: !0,
    value: Af.indexOf("CLOSED")
  });
  ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((A) => {
    Object.defineProperty(D8.prototype, A, {
      enumerable: !0
    })
  });
  ["open", "error", "close", "message"].forEach((A) => {
    Object.defineProperty(D8.prototype, `on${A}`, {
      enumerable: !0,
      get() {
        for (let Q of this.listeners(A))
          if (Q[Cg1]) return Q[tW6];
        return null
      },
      set(Q) {
        for (let B of this.listeners(A))
          if (B[Cg1]) {
            this.removeListener(A, B);
            break
          } if (typeof Q !== "function") return;
        this.addEventListener(A, Q, {
          [Cg1]: !0
        })
      }
    })
  });
  D8.prototype.addEventListener = AX6;
  D8.prototype.removeEventListener = QX6;
  azB.exports = D8;

  function dzB(A, Q, B, G) {
    let Z = {
      allowSynchronousEvents: !0,
      autoPong: !0,
      protocolVersion: Eg1[1],
      maxPayload: 104857600,
      skipUTF8Validation: !1,
      perMessageDeflate: !0,
      followRedirects: !1,
      maxRedirects: 10,
      ...G,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0
    };
    if (A._autoPong = Z.autoPong, !Eg1.includes(Z.protocolVersion)) throw RangeError(`Unsupported protocol version: ${Z.protocolVersion} (supported versions: ${Eg1.join(", ")})`);
    let I;
    if (Q instanceof Hg1) I = Q;
    else try {
      I = new Hg1(Q)
    } catch (C) {
      throw SyntaxError(`Invalid URL: ${Q}`)
    }
    if (I.protocol === "http:") I.protocol = "ws:";
    else if (I.protocol === "https:") I.protocol = "wss:";
    A._url = I.href;
    let Y = I.protocol === "wss:",
      J = I.protocol === "ws+unix:",
      W;
    if (I.protocol !== "ws:" && !Y && !J) W = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
    else if (J && !I.pathname) W = "The URL's pathname is empty";
    else if (I.hash) W = "The URL contains a fragment identifier";
    if (W) {
      let C = SyntaxError(W);
      if (A._redirects === 0) throw C;
      else {
        OaA(A, C);
        return
      }
    }
    let X = Y ? 443 : 80,
      V = iW6(16).toString("base64"),
      F = Y ? cW6.request : pW6.request,
      K = new Set,
      D;
    if (Z.createConnection = Z.createConnection || (Y ? JX6 : YX6), Z.defaultPort = Z.defaultPort || X, Z.port = I.port || X, Z.host = I.hostname.startsWith("[") ? I.hostname.slice(1, -1) : I.hostname, Z.headers = {
        ...Z.headers,
        "Sec-WebSocket-Version": Z.protocolVersion,
        "Sec-WebSocket-Key": V,
        Connection: "Upgrade",
        Upgrade: "websocket"
      }, Z.path = I.pathname + I.search, Z.timeout = Z.handshakeTimeout, Z.perMessageDeflate) D = new ec(Z.perMessageDeflate !== !0 ? Z.perMessageDeflate : {}, !1, Z.maxPayload), Z.headers["Sec-WebSocket-Extensions"] = BX6({
      [ec.extensionName]: D.offer()
    });
    if (B.length) {
      for (let C of B) {
        if (typeof C !== "string" || !IX6.test(C) || K.has(C)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
        K.add(C)
      }
      Z.headers["Sec-WebSocket-Protocol"] = B.join(",")
    }
    if (Z.origin)
      if (Z.protocolVersion < 13) Z.headers["Sec-WebSocket-Origin"] = Z.origin;
      else Z.headers.Origin = Z.origin;
    if (I.username || I.password) Z.auth = `${I.username}:${I.password}`;
    if (J) {
      let C = Z.path.split(":");
      Z.socketPath = C[0], Z.path = C[1]
    }
    let H;
    if (Z.followRedirects) {
      if (A._redirects === 0) {
        A._originalIpc = J, A._originalSecure = Y, A._originalHostOrSocketPath = J ? Z.socketPath : I.host;
        let C = G && G.headers;
        if (G = {
            ...G,
            headers: {}
          }, C)
          for (let [E, U] of Object.entries(C)) G.headers[E.toLowerCase()] = U
      } else if (A.listenerCount("redirect") === 0) {
        let C = J ? A._originalIpc ? Z.socketPath === A._originalHostOrSocketPath : !1 : A._originalIpc ? !1 : I.host === A._originalHostOrSocketPath;
        if (!C || A._originalSecure && !Y) {
          if (delete Z.headers.authorization, delete Z.headers.cookie, !C) delete Z.headers.host;
          Z.auth = void 0
        }
      }
      if (Z.auth && !G.headers.authorization) G.headers.authorization = "Basic " + Buffer.from(Z.auth).toString("base64");
      if (H = A._req = F(Z), A._redirects) A.emit("redirect", A.url, H)
    } else H = A._req = F(Z);
    if (Z.timeout) H.on("timeout", () => {
      tw(A, H, "Opening handshake has timed out")
    });
    if (H.on("error", (C) => {
        if (H === null || H[mzB]) return;
        H = A._req = null, OaA(A, C)
      }), H.on("response", (C) => {
        let E = C.headers.location,
          U = C.statusCode;
        if (E && Z.followRedirects && U >= 300 && U < 400) {
          if (++A._redirects > Z.maxRedirects) {
            tw(A, H, "Maximum redirects exceeded");
            return
          }
          H.abort();
          let q;
          try {
            q = new Hg1(E, Q)
          } catch (w) {
            let N = SyntaxError(`Invalid URL: ${E}`);
            OaA(A, N);
            return
          }
          dzB(A, q, B, G)
        } else if (!A.emit("unexpected-response", H, C)) tw(A, H, `Unexpected server response: ${C.statusCode}`)
      }), H.on("upgrade", (C, E, U) => {
        if (A.emit("upgrade", C), A.readyState !== D8.CONNECTING) return;
        H = A._req = null;
        let q = C.headers.upgrade;
        if (q === void 0 || q.toLowerCase() !== "websocket") {
          tw(A, E, "Invalid Upgrade header");
          return
        }
        let w = nW6("sha1").update(V + oW6).digest("base64");
        if (C.headers["sec-websocket-accept"] !== w) {
          tw(A, E, "Invalid Sec-WebSocket-Accept header");
          return
        }
        let N = C.headers["sec-websocket-protocol"],
          R;
        if (N !== void 0) {
          if (!K.size) R = "Server sent a subprotocol but none was requested";
          else if (!K.has(N)) R = "Server sent an invalid subprotocol"
        } else if (K.size) R = "Server sent no subprotocol";
        if (R) {
          tw(A, E, R);
          return
        }
        if (N) A._protocol = N;
        let T = C.headers["sec-websocket-extensions"];
        if (T !== void 0) {
          if (!D) {
            tw(A, E, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
            return
          }
          let y;
          try {
            y = GX6(T)
          } catch (x) {
            tw(A, E, "Invalid Sec-WebSocket-Extensions header");
            return
          }
          let v = Object.keys(y);
          if (v.length !== 1 || v[0] !== ec.extensionName) {
            tw(A, E, "Server indicated an extension that was not requested");
            return
          }
          try {
            D.accept(y[ec.extensionName])
          } catch (x) {
            tw(A, E, "Invalid Sec-WebSocket-Extensions header");
            return
          }
          A._extensions[ec.extensionName] = D
        }
        A.setSocket(E, U, {
          allowSynchronousEvents: Z.allowSynchronousEvents,
          generateMask: Z.generateMask,
          maxPayload: Z.maxPayload,
          skipUTF8Validation: Z.skipUTF8Validation
        })
      }), Z.finishRequest) Z.finishRequest(H, A);
    else H.end()
  }

  function OaA(A, Q) {
    A._readyState = D8.CLOSING, A._errorEmitted = !0, A.emit("error", Q), A.emitClose()
  }

  function YX6(A) {
    return A.path = A.socketPath, gzB.connect(A)
  }

  function JX6(A) {
    if (A.path = void 0, !A.servername && A.servername !== "") A.servername = gzB.isIP(A.host) ? "" : A.host;
    return lW6.connect(A)
  }

  function tw(A, Q, B) {
    A._readyState = D8.CLOSING;
    let G = Error(B);
    if (Error.captureStackTrace(G, tw), Q.setHeader) {
      if (Q[mzB] = !0, Q.abort(), Q.socket && !Q.socket.destroyed) Q.socket.destroy();
      process.nextTick(OaA, A, G)
    } else Q.destroy(G), Q.once("error", A.emit.bind(A, "error")), Q.once("close", A.emitClose.bind(A))
  }

  function zg1(A, Q, B) {
    if (Q) {
      let G = rW6(Q) ? Q.size : ZX6(Q).length;
      if (A._socket) A._sender._bufferedBytes += G;
      else A._bufferedAmount += G
    }
    if (B) {
      let G = Error(`WebSocket is not open: readyState ${A.readyState} (${Af[A.readyState]})`);
      process.nextTick(B, G)
    }
  }

  function WX6(A, Q) {
    let B = this[xF];
    if (B._closeFrameReceived = !0, B._closeMessage = Q, B._closeCode = A, B._socket[xF] === void 0) return;
    if (B._socket.removeListener("data", RaA), process.nextTick(czB, B._socket), A === 1005) B.close();
    else B.close(A, Q)
  }

  function XX6() {
    let A = this[xF];
    if (!A.isPaused) A._socket.resume()
  }

  function VX6(A) {
    let Q = this[xF];
    if (Q._socket[xF] !== void 0) Q._socket.removeListener("data", RaA), process.nextTick(czB, Q._socket), Q.close(A[eW6]);
    if (!Q._errorEmitted) Q._errorEmitted = !0, Q.emit("error", A)
  }

  function hzB() {
    this[xF].emitClose()
  }

  function FX6(A, Q) {
    this[xF].emit("message", A, Q)
  }

  function KX6(A) {
    let Q = this[xF];
    if (Q._autoPong) Q.pong(A, !this._isServer, uzB);
    Q.emit("ping", A)
  }

  function DX6(A) {
    this[xF].emit("pong", A)
  }

  function czB(A) {
    A.resume()
  }

  function HX6(A) {
    let Q = this[xF];
    if (Q.readyState === D8.CLOSED) return;
    if (Q.readyState === D8.OPEN) Q._readyState = D8.CLOSING, pzB(Q);
    if (this._socket.end(), !Q._errorEmitted) Q._errorEmitted = !0, Q.emit("error", A)
  }

  function pzB(A) {
    A._closeTimer = setTimeout(A._socket.destroy.bind(A._socket), 30000)
  }

  function lzB() {
    let A = this[xF];
    this.removeListener("close", lzB), this.removeListener("data", RaA), this.removeListener("end", izB), A._readyState = D8.CLOSING;
    let Q;
    if (!this._readableState.endEmitted && !A._closeFrameReceived && !A._receiver._writableState.errorEmitted && (Q = A._socket.read()) !== null) A._receiver.write(Q);
    if (A._receiver.end(), this[xF] = void 0, clearTimeout(A._closeTimer), A._receiver._writableState.finished || A._receiver._writableState.errorEmitted) A.emitClose();
    else A._receiver.on("error", hzB), A._receiver.on("finish", hzB)
  }

  function RaA(A) {
    if (!this[xF]._receiver.write(A)) this.pause()
  }

  function izB() {
    let A = this[xF];
    A._readyState = D8.CLOSING, A._receiver.end(), this.end()
  }

  function nzB() {
    let A = this[xF];
    if (this.removeListener("error", nzB), this.on("error", uzB), A) A._readyState = D8.CLOSING, this.destroy()
  }
})
// @from(Start 5901581, End 5903545)
tzB = z((yc7, ozB) => {
  var kc7 = TaA(),
    {
      Duplex: CX6
    } = UA("stream");

  function szB(A) {
    A.emit("close")
  }

  function EX6() {
    if (!this.destroyed && this._writableState.finished) this.destroy()
  }

  function rzB(A) {
    if (this.removeListener("error", rzB), this.destroy(), this.listenerCount("error") === 0) this.emit("error", A)
  }

  function zX6(A, Q) {
    let B = !0,
      G = new CX6({
        ...Q,
        autoDestroy: !1,
        emitClose: !1,
        objectMode: !1,
        writableObjectMode: !1
      });
    return A.on("message", function(I, Y) {
      let J = !Y && G._readableState.objectMode ? I.toString() : I;
      if (!G.push(J)) A.pause()
    }), A.once("error", function(I) {
      if (G.destroyed) return;
      B = !1, G.destroy(I)
    }), A.once("close", function() {
      if (G.destroyed) return;
      G.push(null)
    }), G._destroy = function(Z, I) {
      if (A.readyState === A.CLOSED) {
        I(Z), process.nextTick(szB, G);
        return
      }
      let Y = !1;
      if (A.once("error", function(W) {
          Y = !0, I(W)
        }), A.once("close", function() {
          if (!Y) I(Z);
          process.nextTick(szB, G)
        }), B) A.terminate()
    }, G._final = function(Z) {
      if (A.readyState === A.CONNECTING) {
        A.once("open", function() {
          G._final(Z)
        });
        return
      }
      if (A._socket === null) return;
      if (A._socket._writableState.finished) {
        if (Z(), G._readableState.endEmitted) G.destroy()
      } else A._socket.once("finish", function() {
        Z()
      }), A.close()
    }, G._read = function() {
      if (A.isPaused) A.resume()
    }, G._write = function(Z, I, Y) {
      if (A.readyState === A.CONNECTING) {
        A.once("open", function() {
          G._write(Z, I, Y)
        });
        return
      }
      A.send(Z, Y)
    }, G.on("end", EX6), G.on("error", rzB), G
  }
  ozB.exports = zX6
})
// @from(Start 5903551, End 5904521)
AUB = z((xc7, ezB) => {
  var {
    tokenChars: UX6
  } = q7A();

  function $X6(A) {
    let Q = new Set,
      B = -1,
      G = -1,
      Z = 0;
    for (Z; Z < A.length; Z++) {
      let Y = A.charCodeAt(Z);
      if (G === -1 && UX6[Y] === 1) {
        if (B === -1) B = Z
      } else if (Z !== 0 && (Y === 32 || Y === 9)) {
        if (G === -1 && B !== -1) G = Z
      } else if (Y === 44) {
        if (B === -1) throw SyntaxError(`Unexpected character at index ${Z}`);
        if (G === -1) G = Z;
        let J = A.slice(B, G);
        if (Q.has(J)) throw SyntaxError(`The "${J}" subprotocol is duplicated`);
        Q.add(J), B = G = -1
      } else throw SyntaxError(`Unexpected character at index ${Z}`)
    }
    if (B === -1 || G !== -1) throw SyntaxError("Unexpected end of input");
    let I = A.slice(B, Z);
    if (Q.has(I)) throw SyntaxError(`The "${I}" subprotocol is duplicated`);
    return Q.add(I), Q
  }
  ezB.exports = {
    parse: $X6
  }
})
// @from(Start 5904527, End 5912192)
IUB = z((bc7, ZUB) => {
  var wX6 = UA("events"),
    PaA = UA("http"),
    {
      Duplex: vc7
    } = UA("stream"),
    {
      createHash: qX6
    } = UA("crypto"),
    QUB = Dg1(),
    mt = vUA(),
    NX6 = AUB(),
    LX6 = TaA(),
    {
      GUID: MX6,
      kWebSocket: OX6
    } = tb(),
    RX6 = /^[+/0-9A-Za-z]{22}==$/;
  class GUB extends wX6 {
    constructor(A, Q) {
      super();
      if (A = {
          allowSynchronousEvents: !0,
          autoPong: !0,
          maxPayload: 104857600,
          skipUTF8Validation: !1,
          perMessageDeflate: !1,
          handleProtocols: null,
          clientTracking: !0,
          verifyClient: null,
          noServer: !1,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: LX6,
          ...A
        }, A.port == null && !A.server && !A.noServer || A.port != null && (A.server || A.noServer) || A.server && A.noServer) throw TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
      if (A.port != null) this._server = PaA.createServer((B, G) => {
        let Z = PaA.STATUS_CODES[426];
        G.writeHead(426, {
          "Content-Length": Z.length,
          "Content-Type": "text/plain"
        }), G.end(Z)
      }), this._server.listen(A.port, A.host, A.backlog, Q);
      else if (A.server) this._server = A.server;
      if (this._server) {
        let B = this.emit.bind(this, "connection");
        this._removeListeners = TX6(this._server, {
          listening: this.emit.bind(this, "listening"),
          error: this.emit.bind(this, "error"),
          upgrade: (G, Z, I) => {
            this.handleUpgrade(G, Z, I, B)
          }
        })
      }
      if (A.perMessageDeflate === !0) A.perMessageDeflate = {};
      if (A.clientTracking) this.clients = new Set, this._shouldEmitClose = !1;
      this.options = A, this._state = 0
    }
    address() {
      if (this.options.noServer) throw Error('The server is operating in "noServer" mode');
      if (!this._server) return null;
      return this._server.address()
    }
    close(A) {
      if (this._state === 2) {
        if (A) this.once("close", () => {
          A(Error("The server is not running"))
        });
        process.nextTick(gUA, this);
        return
      }
      if (A) this.once("close", A);
      if (this._state === 1) return;
      if (this._state = 1, this.options.noServer || this.options.server) {
        if (this._server) this._removeListeners(), this._removeListeners = this._server = null;
        if (this.clients)
          if (!this.clients.size) process.nextTick(gUA, this);
          else this._shouldEmitClose = !0;
        else process.nextTick(gUA, this)
      } else {
        let Q = this._server;
        this._removeListeners(), this._removeListeners = this._server = null, Q.close(() => {
          gUA(this)
        })
      }
    }
    shouldHandle(A) {
      if (this.options.path) {
        let Q = A.url.indexOf("?");
        if ((Q !== -1 ? A.url.slice(0, Q) : A.url) !== this.options.path) return !1
      }
      return !0
    }
    handleUpgrade(A, Q, B, G) {
      Q.on("error", BUB);
      let Z = A.headers["sec-websocket-key"],
        I = A.headers.upgrade,
        Y = +A.headers["sec-websocket-version"];
      if (A.method !== "GET") {
        dt(this, A, Q, 405, "Invalid HTTP method");
        return
      }
      if (I === void 0 || I.toLowerCase() !== "websocket") {
        dt(this, A, Q, 400, "Invalid Upgrade header");
        return
      }
      if (Z === void 0 || !RX6.test(Z)) {
        dt(this, A, Q, 400, "Missing or invalid Sec-WebSocket-Key header");
        return
      }
      if (Y !== 13 && Y !== 8) {
        dt(this, A, Q, 400, "Missing or invalid Sec-WebSocket-Version header", {
          "Sec-WebSocket-Version": "13, 8"
        });
        return
      }
      if (!this.shouldHandle(A)) {
        uUA(Q, 400);
        return
      }
      let J = A.headers["sec-websocket-protocol"],
        W = new Set;
      if (J !== void 0) try {
        W = NX6.parse(J)
      } catch (F) {
        dt(this, A, Q, 400, "Invalid Sec-WebSocket-Protocol header");
        return
      }
      let X = A.headers["sec-websocket-extensions"],
        V = {};
      if (this.options.perMessageDeflate && X !== void 0) {
        let F = new mt(this.options.perMessageDeflate, !0, this.options.maxPayload);
        try {
          let K = QUB.parse(X);
          if (K[mt.extensionName]) F.accept(K[mt.extensionName]), V[mt.extensionName] = F
        } catch (K) {
          dt(this, A, Q, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
          return
        }
      }
      if (this.options.verifyClient) {
        let F = {
          origin: A.headers[`${Y===8?"sec-websocket-origin":"origin"}`],
          secure: !!(A.socket.authorized || A.socket.encrypted),
          req: A
        };
        if (this.options.verifyClient.length === 2) {
          this.options.verifyClient(F, (K, D, H, C) => {
            if (!K) return uUA(Q, D || 401, H, C);
            this.completeUpgrade(V, Z, W, A, Q, B, G)
          });
          return
        }
        if (!this.options.verifyClient(F)) return uUA(Q, 401)
      }
      this.completeUpgrade(V, Z, W, A, Q, B, G)
    }
    completeUpgrade(A, Q, B, G, Z, I, Y) {
      if (!Z.readable || !Z.writable) return Z.destroy();
      if (Z[OX6]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
      if (this._state > 0) return uUA(Z, 503);
      let W = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${qX6("sha1").update(Q+MX6).digest("base64")}`],
        X = new this.options.WebSocket(null, void 0, this.options);
      if (B.size) {
        let V = this.options.handleProtocols ? this.options.handleProtocols(B, G) : B.values().next().value;
        if (V) W.push(`Sec-WebSocket-Protocol: ${V}`), X._protocol = V
      }
      if (A[mt.extensionName]) {
        let V = A[mt.extensionName].params,
          F = QUB.format({
            [mt.extensionName]: [V]
          });
        W.push(`Sec-WebSocket-Extensions: ${F}`), X._extensions = A
      }
      if (this.emit("headers", W, G), Z.write(W.concat(`\r
`).join(`\r
`)), Z.removeListener("error", BUB), X.setSocket(Z, I, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        }), this.clients) this.clients.add(X), X.on("close", () => {
        if (this.clients.delete(X), this._shouldEmitClose && !this.clients.size) process.nextTick(gUA, this)
      });
      Y(X, G)
    }
  }
  ZUB.exports = GUB;

  function TX6(A, Q) {
    for (let B of Object.keys(Q)) A.on(B, Q[B]);
    return function() {
      for (let G of Object.keys(Q)) A.removeListener(G, Q[G])
    }
  }

  function gUA(A) {
    A._state = 2, A.emit("close")
  }

  function BUB() {
    this.destroy()
  }

  function uUA(A, Q, B, G) {
    B = B || PaA.STATUS_CODES[Q], G = {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(B),
      ...G
    }, A.once("finish", A.destroy), A.end(`HTTP/1.1 ${Q} ${PaA.STATUS_CODES[Q]}\r
` + Object.keys(G).map((Z) => `${Z}: ${G[Z]}`).join(`\r
`) + `\r
\r
` + B)
  }

  function dt(A, Q, B, G, Z, I) {
    if (A.listenerCount("wsClientError")) {
      let Y = Error(Z);
      Error.captureStackTrace(Y, dt), A.emit("wsClientError", Y, B, Q)
    } else uUA(B, G, Z, I)
  }
})
// @from(Start 5912198, End 5912201)
PX6
// @from(Start 5912203, End 5912206)
jX6
// @from(Start 5912208, End 5912211)
SX6
// @from(Start 5912213, End 5912216)
mUA
// @from(Start 5912218, End 5912221)
_X6
// @from(Start 5912223, End 5912225)
__
// @from(Start 5912231, End 5912368)
dUA = L(() => {
  PX6 = BA(tzB(), 1), jX6 = BA(Xg1(), 1), SX6 = BA(Fg1(), 1), mUA = BA(TaA(), 1), _X6 = BA(IUB(), 1), __ = mUA.default
})
// @from(Start 5912374, End 5912377)
jaA
// @from(Start 5912383, End 5913134)
YUB = L(() => {
  dUA();
  jaA = global;
  jaA.WebSocket ||= __;
  jaA.window ||= global;
  jaA.self ||= global;
  jaA.window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ = [{
    type: 1,
    value: 7,
    isEnabled: !0
  }, {
    type: 2,
    value: "InternalApp",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalAppContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStdoutContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStderrContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStdinContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalFocusContext",
    isEnabled: !0,
    isValid: !0
  }]
})