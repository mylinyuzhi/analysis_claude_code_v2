
// @from(Ln 116607, Col 4)
PJA = U((pXG, wrQ) => {
  var {
    extractBody: GC3,
    mixinBody: ZC3,
    cloneBody: YC3,
    bodyUnusable: IrQ
  } = KJA(), {
    Headers: $rQ,
    fill: JC3,
    HeadersList: $eA,
    setHeadersGuard: ac1,
    getHeadersGuard: XC3,
    setHeadersList: CrQ,
    getHeadersList: DrQ
  } = BQA(), {
    FinalizationRegistry: IC3
  } = XrQ()(), EeA = b8(), WrQ = NA("node:util"), {
    isValidHTTPToken: DC3,
    sameOrigin: KrQ,
    environmentSettingsObject: HeA
  } = zL(), {
    forbiddenMethodsSet: WC3,
    corsSafeListedMethodsSet: KC3,
    referrerPolicy: VC3,
    requestRedirect: FC3,
    requestMode: HC3,
    requestCredentials: EC3,
    requestCache: zC3,
    requestDuplex: $C3
  } = qLA(), {
    kEnumerableProperty: fW,
    normalizedMethodRecordsBase: CC3,
    normalizedMethodRecords: UC3
  } = EeA, {
    kHeaders: NL,
    kSignal: zeA,
    kState: $J,
    kDispatcher: nc1
  } = Cn(), {
    webidl: m4
  } = xH(), {
    URLSerializer: qC3
  } = bq(), {
    kConstruct: CeA
  } = VX(), NC3 = NA("node:assert"), {
    getMaxListeners: VrQ,
    setMaxListeners: FrQ,
    getEventListeners: wC3,
    defaultMaxListeners: HrQ
  } = NA("node:events"), LC3 = Symbol("abortController"), UrQ = new IC3(({
    signal: A,
    abort: Q
  }) => {
    A.removeEventListener("abort", Q)
  }), UeA = new WeakMap;

  function ErQ(A) {
    return Q;

    function Q() {
      let B = A.deref();
      if (B !== void 0) {
        UrQ.unregister(Q), this.removeEventListener("abort", Q), B.abort(this.reason);
        let G = UeA.get(B.signal);
        if (G !== void 0) {
          if (G.size !== 0) {
            for (let Z of G) {
              let Y = Z.deref();
              if (Y !== void 0) Y.abort(this.reason)
            }
            G.clear()
          }
          UeA.delete(B.signal)
        }
      }
    }
  }
  var zrQ = !1;
  class tZ {
    constructor(A, Q = {}) {
      if (m4.util.markAsUncloneable(this), A === CeA) return;
      let B = "Request constructor";
      m4.argumentLengthCheck(arguments, 1, B), A = m4.converters.RequestInfo(A, B, "input"), Q = m4.converters.RequestInit(Q, B, "init");
      let G = null,
        Z = null,
        Y = HeA.settingsObject.baseUrl,
        J = null;
      if (typeof A === "string") {
        this[nc1] = Q.dispatcher;
        let z;
        try {
          z = new URL(A, Y)
        } catch ($) {
          throw TypeError("Failed to parse URL from " + A, {
            cause: $
          })
        }
        if (z.username || z.password) throw TypeError("Request cannot be constructed from a URL that includes credentials: " + A);
        G = qeA({
          urlList: [z]
        }), Z = "cors"
      } else this[nc1] = Q.dispatcher || A[nc1], NC3(A instanceof tZ), G = A[$J], J = A[zeA];
      let X = HeA.settingsObject.origin,
        I = "client";
      if (G.window?.constructor?.name === "EnvironmentSettingsObject" && KrQ(G.window, X)) I = G.window;
      if (Q.window != null) throw TypeError(`'window' option '${I}' must be null`);
      if ("window" in Q) I = "no-window";
      G = qeA({
        method: G.method,
        headersList: G.headersList,
        unsafeRequest: G.unsafeRequest,
        client: HeA.settingsObject,
        window: I,
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
      let D = Object.keys(Q).length !== 0;
      if (D) {
        if (G.mode === "navigate") G.mode = "same-origin";
        G.reloadNavigation = !1, G.historyNavigation = !1, G.origin = "client", G.referrer = "client", G.referrerPolicy = "", G.url = G.urlList[G.urlList.length - 1], G.urlList = [G.url]
      }
      if (Q.referrer !== void 0) {
        let z = Q.referrer;
        if (z === "") G.referrer = "no-referrer";
        else {
          let $;
          try {
            $ = new URL(z, Y)
          } catch (O) {
            throw TypeError(`Referrer "${z}" is not a valid URL.`, {
              cause: O
            })
          }
          if ($.protocol === "about:" && $.hostname === "client" || X && !KrQ($, HeA.settingsObject.baseUrl)) G.referrer = "client";
          else G.referrer = $
        }
      }
      if (Q.referrerPolicy !== void 0) G.referrerPolicy = Q.referrerPolicy;
      let W;
      if (Q.mode !== void 0) W = Q.mode;
      else W = Z;
      if (W === "navigate") throw m4.errors.exception({
        header: "Request constructor",
        message: "invalid request mode navigate."
      });
      if (W != null) G.mode = W;
      if (Q.credentials !== void 0) G.credentials = Q.credentials;
      if (Q.cache !== void 0) G.cache = Q.cache;
      if (G.cache === "only-if-cached" && G.mode !== "same-origin") throw TypeError("'only-if-cached' can be set only with 'same-origin' mode");
      if (Q.redirect !== void 0) G.redirect = Q.redirect;
      if (Q.integrity != null) G.integrity = String(Q.integrity);
      if (Q.keepalive !== void 0) G.keepalive = Boolean(Q.keepalive);
      if (Q.method !== void 0) {
        let z = Q.method,
          $ = UC3[z];
        if ($ !== void 0) G.method = $;
        else {
          if (!DC3(z)) throw TypeError(`'${z}' is not a valid HTTP method.`);
          let O = z.toUpperCase();
          if (WC3.has(O)) throw TypeError(`'${z}' HTTP method is unsupported.`);
          z = CC3[O] ?? z, G.method = z
        }
        if (!zrQ && G.method === "patch") process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
          code: "UNDICI-FETCH-patch"
        }), zrQ = !0
      }
      if (Q.signal !== void 0) J = Q.signal;
      this[$J] = G;
      let K = new AbortController;
      if (this[zeA] = K.signal, J != null) {
        if (!J || typeof J.aborted !== "boolean" || typeof J.addEventListener !== "function") throw TypeError("Failed to construct 'Request': member signal is not of type AbortSignal.");
        if (J.aborted) K.abort(J.reason);
        else {
          this[LC3] = K;
          let z = new WeakRef(K),
            $ = ErQ(z);
          try {
            if (typeof VrQ === "function" && VrQ(J) === HrQ) FrQ(1500, J);
            else if (wC3(J, "abort").length >= HrQ) FrQ(1500, J)
          } catch {}
          EeA.addAbortListener(J, $), UrQ.register(K, {
            signal: J,
            abort: $
          }, $)
        }
      }
      if (this[NL] = new $rQ(CeA), CrQ(this[NL], G.headersList), ac1(this[NL], "request"), W === "no-cors") {
        if (!KC3.has(G.method)) throw TypeError(`'${G.method} is unsupported in no-cors mode.`);
        ac1(this[NL], "request-no-cors")
      }
      if (D) {
        let z = DrQ(this[NL]),
          $ = Q.headers !== void 0 ? Q.headers : new $eA(z);
        if (z.clear(), $ instanceof $eA) {
          for (let {
              name: O,
              value: L
            }
            of $.rawValues()) z.append(O, L, !1);
          z.cookies = $.cookies
        } else JC3(this[NL], $)
      }
      let V = A instanceof tZ ? A[$J].body : null;
      if ((Q.body != null || V != null) && (G.method === "GET" || G.method === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body.");
      let F = null;
      if (Q.body != null) {
        let [z, $] = GC3(Q.body, G.keepalive);
        if (F = z, $ && !DrQ(this[NL]).contains("content-type", !0)) this[NL].append("content-type", $)
      }
      let H = F ?? V;
      if (H != null && H.source == null) {
        if (F != null && Q.duplex == null) throw TypeError("RequestInit: duplex option is required when sending a body.");
        if (G.mode !== "same-origin" && G.mode !== "cors") throw TypeError('If request is made from ReadableStream, mode should be "same-origin" or "cors"');
        G.useCORSPreflightFlag = !0
      }
      let E = H;
      if (F == null && V != null) {
        if (IrQ(A)) throw TypeError("Cannot construct a Request with a Request object that has already been used.");
        let z = new TransformStream;
        V.stream.pipeThrough(z), E = {
          source: V.source,
          length: V.length,
          stream: z.readable
        }
      }
      this[$J].body = E
    }
    get method() {
      return m4.brandCheck(this, tZ), this[$J].method
    }
    get url() {
      return m4.brandCheck(this, tZ), qC3(this[$J].url)
    }
    get headers() {
      return m4.brandCheck(this, tZ), this[NL]
    }
    get destination() {
      return m4.brandCheck(this, tZ), this[$J].destination
    }
    get referrer() {
      if (m4.brandCheck(this, tZ), this[$J].referrer === "no-referrer") return "";
      if (this[$J].referrer === "client") return "about:client";
      return this[$J].referrer.toString()
    }
    get referrerPolicy() {
      return m4.brandCheck(this, tZ), this[$J].referrerPolicy
    }
    get mode() {
      return m4.brandCheck(this, tZ), this[$J].mode
    }
    get credentials() {
      return this[$J].credentials
    }
    get cache() {
      return m4.brandCheck(this, tZ), this[$J].cache
    }
    get redirect() {
      return m4.brandCheck(this, tZ), this[$J].redirect
    }
    get integrity() {
      return m4.brandCheck(this, tZ), this[$J].integrity
    }
    get keepalive() {
      return m4.brandCheck(this, tZ), this[$J].keepalive
    }
    get isReloadNavigation() {
      return m4.brandCheck(this, tZ), this[$J].reloadNavigation
    }
    get isHistoryNavigation() {
      return m4.brandCheck(this, tZ), this[$J].historyNavigation
    }
    get signal() {
      return m4.brandCheck(this, tZ), this[zeA]
    }
    get body() {
      return m4.brandCheck(this, tZ), this[$J].body ? this[$J].body.stream : null
    }
    get bodyUsed() {
      return m4.brandCheck(this, tZ), !!this[$J].body && EeA.isDisturbed(this[$J].body.stream)
    }
    get duplex() {
      return m4.brandCheck(this, tZ), "half"
    }
    clone() {
      if (m4.brandCheck(this, tZ), IrQ(this)) throw TypeError("unusable");
      let A = qrQ(this[$J]),
        Q = new AbortController;
      if (this.signal.aborted) Q.abort(this.signal.reason);
      else {
        let B = UeA.get(this.signal);
        if (B === void 0) B = new Set, UeA.set(this.signal, B);
        let G = new WeakRef(Q);
        B.add(G), EeA.addAbortListener(Q.signal, ErQ(G))
      }
      return NrQ(A, Q.signal, XC3(this[NL]))
    } [WrQ.inspect.custom](A, Q) {
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
      return `Request ${WrQ.formatWithOptions(Q,B)}`
    }
  }
  ZC3(tZ);

  function qeA(A) {
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
      headersList: A.headersList ? new $eA(A.headersList) : new $eA
    }
  }

  function qrQ(A) {
    let Q = qeA({
      ...A,
      body: null
    });
    if (A.body != null) Q.body = YC3(Q, A.body);
    return Q
  }

  function NrQ(A, Q, B) {
    let G = new tZ(CeA);
    return G[$J] = A, G[zeA] = Q, G[NL] = new $rQ(CeA), CrQ(G[NL], A.headersList), ac1(G[NL], B), G
  }
  Object.defineProperties(tZ.prototype, {
    method: fW,
    url: fW,
    headers: fW,
    redirect: fW,
    clone: fW,
    signal: fW,
    duplex: fW,
    destination: fW,
    body: fW,
    bodyUsed: fW,
    isHistoryNavigation: fW,
    isReloadNavigation: fW,
    keepalive: fW,
    integrity: fW,
    cache: fW,
    credentials: fW,
    attribute: fW,
    referrerPolicy: fW,
    referrer: fW,
    mode: fW,
    [Symbol.toStringTag]: {
      value: "Request",
      configurable: !0
    }
  });
  m4.converters.Request = m4.interfaceConverter(tZ);
  m4.converters.RequestInfo = function (A, Q, B) {
    if (typeof A === "string") return m4.converters.USVString(A, Q, B);
    if (A instanceof tZ) return m4.converters.Request(A, Q, B);
    return m4.converters.USVString(A, Q, B)
  };
  m4.converters.AbortSignal = m4.interfaceConverter(AbortSignal);
  m4.converters.RequestInit = m4.dictionaryConverter([{
    key: "method",
    converter: m4.converters.ByteString
  }, {
    key: "headers",
    converter: m4.converters.HeadersInit
  }, {
    key: "body",
    converter: m4.nullableConverter(m4.converters.BodyInit)
  }, {
    key: "referrer",
    converter: m4.converters.USVString
  }, {
    key: "referrerPolicy",
    converter: m4.converters.DOMString,
    allowedValues: VC3
  }, {
    key: "mode",
    converter: m4.converters.DOMString,
    allowedValues: HC3
  }, {
    key: "credentials",
    converter: m4.converters.DOMString,
    allowedValues: EC3
  }, {
    key: "cache",
    converter: m4.converters.DOMString,
    allowedValues: zC3
  }, {
    key: "redirect",
    converter: m4.converters.DOMString,
    allowedValues: FC3
  }, {
    key: "integrity",
    converter: m4.converters.DOMString
  }, {
    key: "keepalive",
    converter: m4.converters.boolean
  }, {
    key: "signal",
    converter: m4.nullableConverter((A) => m4.converters.AbortSignal(A, "RequestInit", "signal", {
      strict: !1
    }))
  }, {
    key: "window",
    converter: m4.converters.any
  }, {
    key: "duplex",
    converter: m4.converters.DOMString,
    allowedValues: $C3
  }, {
    key: "dispatcher",
    converter: m4.converters.any
  }]);
  wrQ.exports = {
    Request: tZ,
    makeRequest: qeA,
    fromInnerRequest: NrQ,
    cloneRequest: qrQ
  }
})
// @from(Ln 117088, Col 4)
BOA = U((lXG, frQ) => {
  var {
    makeNetworkError: AZ,
    makeAppropriateNetworkError: NeA,
    filterResponse: oc1,
    makeResponse: weA,
    fromInnerResponse: OC3
  } = AOA(), {
    HeadersList: LrQ
  } = BQA(), {
    Request: MC3,
    cloneRequest: RC3
  } = PJA(), Tn = NA("node:zlib"), {
    bytesMatch: _C3,
    makePolicyContainer: jC3,
    clonePolicyContainer: TC3,
    requestBadPort: PC3,
    TAOCheck: SC3,
    appendRequestOriginHeader: xC3,
    responseLocationURL: yC3,
    requestCurrentURL: rv,
    setRequestReferrerPolicyOnRedirect: vC3,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: kC3,
    createOpaqueTimingInfo: Ap1,
    appendFetchMetadata: bC3,
    corsCheck: fC3,
    crossOriginResourcePolicyCheck: hC3,
    determineRequestsReferrer: gC3,
    coarsenedSharedCurrentTime: QOA,
    createDeferredPromise: uC3,
    isBlobLike: mC3,
    sameOrigin: ec1,
    isCancelled: GQA,
    isAborted: OrQ,
    isErrorLike: dC3,
    fullyReadBody: cC3,
    readableStreamClose: pC3,
    isomorphicEncode: LeA,
    urlIsLocal: lC3,
    urlIsHttpHttpsScheme: Qp1,
    urlHasHttpsScheme: iC3,
    clampAndCoarsenConnectionTimingInfo: nC3,
    simpleRangeHeaderValue: aC3,
    buildContentRange: oC3,
    createInflate: rC3,
    extractMimeType: sC3
  } = zL(), {
    kState: jrQ,
    kDispatcher: tC3
  } = Cn(), ZQA = NA("node:assert"), {
    safelyExtractBody: Bp1,
    extractBody: MrQ
  } = KJA(), {
    redirectStatusSet: TrQ,
    nullBodyStatus: PrQ,
    safeMethodsSet: eC3,
    requestBodyHeader: AU3,
    subresourceSet: QU3
  } = qLA(), BU3 = NA("node:events"), {
    Readable: GU3,
    pipeline: ZU3,
    finished: YU3
  } = NA("node:stream"), {
    addAbortListener: JU3,
    isErrored: XU3,
    isReadable: OeA,
    bufferToLowerCasedHeaderName: RrQ
  } = b8(), {
    dataURLProcessor: IU3,
    serializeAMimeType: DU3,
    minimizeSupportedMimeType: WU3
  } = bq(), {
    getGlobalDispatcher: KU3
  } = XeA(), {
    webidl: VU3
  } = xH(), {
    STATUS_CODES: FU3
  } = NA("node:http"), HU3 = ["GET", "HEAD"], EU3 = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici", rc1;
  class Gp1 extends BU3 {
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

  function zU3(A) {
    SrQ(A, "fetch")
  }

  function $U3(A, Q = void 0) {
    VU3.argumentLengthCheck(arguments, 1, "globalThis.fetch");
    let B = uC3(),
      G;
    try {
      G = new MC3(A, Q)
    } catch (W) {
      return B.reject(W), B.promise
    }
    let Z = G[jrQ];
    if (G.signal.aborted) return sc1(B, Z, null, G.signal.reason), B.promise;
    if (Z.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope") Z.serviceWorkers = "none";
    let J = null,
      X = !1,
      I = null;
    return JU3(G.signal, () => {
      X = !0, ZQA(I != null), I.abort(G.signal.reason);
      let W = J?.deref();
      sc1(B, Z, W, G.signal.reason)
    }), I = yrQ({
      request: Z,
      processResponseEndOfBody: zU3,
      processResponse: (W) => {
        if (X) return;
        if (W.aborted) {
          sc1(B, Z, J, I.serializedAbortReason);
          return
        }
        if (W.type === "error") {
          B.reject(TypeError("fetch failed", {
            cause: W.error
          }));
          return
        }
        J = new WeakRef(OC3(W, "immutable")), B.resolve(J.deref()), B = null
      },
      dispatcher: G[tC3]
    }), B.promise
  }

  function SrQ(A, Q = "other") {
    if (A.type === "error" && A.aborted) return;
    if (!A.urlList?.length) return;
    let B = A.urlList[0],
      G = A.timingInfo,
      Z = A.cacheState;
    if (!Qp1(B)) return;
    if (G === null) return;
    if (!A.timingAllowPassed) G = Ap1({
      startTime: G.startTime
    }), Z = "";
    G.endTime = QOA(), A.timingInfo = G, xrQ(G, B.href, Q, globalThis, Z)
  }
  var xrQ = performance.markResourceTiming;

  function sc1(A, Q, B, G) {
    if (A) A.reject(G);
    if (Q.body != null && OeA(Q.body?.stream)) Q.body.stream.cancel(G).catch((Y) => {
      if (Y.code === "ERR_INVALID_STATE") return;
      throw Y
    });
    if (B == null) return;
    let Z = B[jrQ];
    if (Z.body != null && OeA(Z.body?.stream)) Z.body.stream.cancel(G).catch((Y) => {
      if (Y.code === "ERR_INVALID_STATE") return;
      throw Y
    })
  }

  function yrQ({
    request: A,
    processRequestBodyChunkLength: Q,
    processRequestEndOfBody: B,
    processResponse: G,
    processResponseEndOfBody: Z,
    processResponseConsumeBody: Y,
    useParallelQueue: J = !1,
    dispatcher: X = KU3()
  }) {
    ZQA(X);
    let I = null,
      D = !1;
    if (A.client != null) I = A.client.globalObject, D = A.client.crossOriginIsolatedCapability;
    let W = QOA(D),
      K = Ap1({
        startTime: W
      }),
      V = {
        controller: new Gp1(X),
        request: A,
        timingInfo: K,
        processRequestBodyChunkLength: Q,
        processRequestEndOfBody: B,
        processResponse: G,
        processResponseConsumeBody: Y,
        processResponseEndOfBody: Z,
        taskDestination: I,
        crossOriginIsolatedCapability: D
      };
    if (ZQA(!A.body || A.body.stream), A.window === "client") A.window = A.client?.globalObject?.constructor?.name === "Window" ? A.client : "no-window";
    if (A.origin === "client") A.origin = A.client.origin;
    if (A.policyContainer === "client")
      if (A.client != null) A.policyContainer = TC3(A.client.policyContainer);
      else A.policyContainer = jC3();
    if (!A.headersList.contains("accept", !0)) A.headersList.append("accept", "*/*", !0);
    if (!A.headersList.contains("accept-language", !0)) A.headersList.append("accept-language", "*", !0);
    if (A.priority === null);
    if (QU3.has(A.destination));
    return vrQ(V).catch((F) => {
      V.controller.terminate(F)
    }), V.controller
  }
  async function vrQ(A, Q = !1) {
    let B = A.request,
      G = null;
    if (B.localURLsOnly && !lC3(rv(B))) G = AZ("local URLs only");
    if (kC3(B), PC3(B) === "blocked") G = AZ("bad port");
    if (B.referrerPolicy === "") B.referrerPolicy = B.policyContainer.referrerPolicy;
    if (B.referrer !== "no-referrer") B.referrer = gC3(B);
    if (G === null) G = await (async () => {
      let Y = rv(B);
      if (ec1(Y, B.url) && B.responseTainting === "basic" || Y.protocol === "data:" || (B.mode === "navigate" || B.mode === "websocket")) return B.responseTainting = "basic", await _rQ(A);
      if (B.mode === "same-origin") return AZ('request mode cannot be "same-origin"');
      if (B.mode === "no-cors") {
        if (B.redirect !== "follow") return AZ('redirect mode cannot be "follow" for "no-cors" request');
        return B.responseTainting = "opaque", await _rQ(A)
      }
      if (!Qp1(rv(B))) return AZ("URL scheme must be a HTTP(S) scheme");
      return B.responseTainting = "cors", await krQ(A)
    })();
    if (Q) return G;
    if (G.status !== 0 && !G.internalResponse) {
      if (B.responseTainting === "cors");
      if (B.responseTainting === "basic") G = oc1(G, "basic");
      else if (B.responseTainting === "cors") G = oc1(G, "cors");
      else if (B.responseTainting === "opaque") G = oc1(G, "opaque");
      else ZQA(!1)
    }
    let Z = G.status === 0 ? G : G.internalResponse;
    if (Z.urlList.length === 0) Z.urlList.push(...B.urlList);
    if (!B.timingAllowFailed) G.timingAllowPassed = !0;
    if (G.type === "opaque" && Z.status === 206 && Z.rangeRequested && !B.headers.contains("range", !0)) G = Z = AZ();
    if (G.status !== 0 && (B.method === "HEAD" || B.method === "CONNECT" || PrQ.includes(Z.status))) Z.body = null, A.controller.dump = !0;
    if (B.integrity) {
      let Y = (X) => tc1(A, AZ(X));
      if (B.responseTainting === "opaque" || G.body == null) {
        Y(G.error);
        return
      }
      let J = (X) => {
        if (!_C3(X, B.integrity)) {
          Y("integrity mismatch");
          return
        }
        G.body = Bp1(X)[0], tc1(A, G)
      };
      await cC3(G.body, J, Y)
    } else tc1(A, G)
  }

  function _rQ(A) {
    if (GQA(A) && A.request.redirectCount === 0) return Promise.resolve(NeA(A));
    let {
      request: Q
    } = A, {
      protocol: B
    } = rv(Q);
    switch (B) {
      case "about:":
        return Promise.resolve(AZ("about scheme is not supported"));
      case "blob:": {
        if (!rc1) rc1 = NA("node:buffer").resolveObjectURL;
        let G = rv(Q);
        if (G.search.length !== 0) return Promise.resolve(AZ("NetworkError when attempting to fetch resource."));
        let Z = rc1(G.toString());
        if (Q.method !== "GET" || !mC3(Z)) return Promise.resolve(AZ("invalid method"));
        let Y = weA(),
          J = Z.size,
          X = LeA(`${J}`),
          I = Z.type;
        if (!Q.headersList.contains("range", !0)) {
          let D = MrQ(Z);
          Y.statusText = "OK", Y.body = D[0], Y.headersList.set("content-length", X, !0), Y.headersList.set("content-type", I, !0)
        } else {
          Y.rangeRequested = !0;
          let D = Q.headersList.get("range", !0),
            W = aC3(D, !0);
          if (W === "failure") return Promise.resolve(AZ("failed to fetch the data URL"));
          let {
            rangeStartValue: K,
            rangeEndValue: V
          } = W;
          if (K === null) K = J - V, V = K + V - 1;
          else {
            if (K >= J) return Promise.resolve(AZ("Range start is greater than the blob's size."));
            if (V === null || V >= J) V = J - 1
          }
          let F = Z.slice(K, V, I),
            H = MrQ(F);
          Y.body = H[0];
          let E = LeA(`${F.size}`),
            z = oC3(K, V, J);
          Y.status = 206, Y.statusText = "Partial Content", Y.headersList.set("content-length", E, !0), Y.headersList.set("content-type", I, !0), Y.headersList.set("content-range", z, !0)
        }
        return Promise.resolve(Y)
      }
      case "data:": {
        let G = rv(Q),
          Z = IU3(G);
        if (Z === "failure") return Promise.resolve(AZ("failed to fetch the data URL"));
        let Y = DU3(Z.mimeType);
        return Promise.resolve(weA({
          statusText: "OK",
          headersList: [
            ["content-type", {
              name: "Content-Type",
              value: Y
            }]
          ],
          body: Bp1(Z.body)[0]
        }))
      }
      case "file:":
        return Promise.resolve(AZ("not implemented... yet..."));
      case "http:":
      case "https:":
        return krQ(A).catch((G) => AZ(G));
      default:
        return Promise.resolve(AZ("unknown scheme"))
    }
  }

  function CU3(A, Q) {
    if (A.request.done = !0, A.processResponseDone != null) queueMicrotask(() => A.processResponseDone(Q))
  }

  function tc1(A, Q) {
    let B = A.timingInfo,
      G = () => {
        let Y = Date.now();
        if (A.request.destination === "document") A.controller.fullTimingInfo = B;
        A.controller.reportTimingSteps = () => {
          if (A.request.url.protocol !== "https:") return;
          B.endTime = Y;
          let {
            cacheState: X,
            bodyInfo: I
          } = Q;
          if (!Q.timingAllowPassed) B = Ap1(B), X = "";
          let D = 0;
          if (A.request.mode !== "navigator" || !Q.hasCrossOriginRedirects) {
            D = Q.status;
            let W = sC3(Q.headersList);
            if (W !== "failure") I.contentType = WU3(W)
          }
          if (A.request.initiatorType != null) xrQ(B, A.request.url.href, A.request.initiatorType, globalThis, X, I, D)
        };
        let J = () => {
          if (A.request.done = !0, A.processResponseEndOfBody != null) queueMicrotask(() => A.processResponseEndOfBody(Q));
          if (A.request.initiatorType != null) A.controller.reportTimingSteps()
        };
        queueMicrotask(() => J())
      };
    if (A.processResponse != null) queueMicrotask(() => {
      A.processResponse(Q), A.processResponse = null
    });
    let Z = Q.type === "error" ? Q : Q.internalResponse ?? Q;
    if (Z.body == null) G();
    else YU3(Z.body.stream, () => {
      G()
    })
  }
  async function krQ(A) {
    let Q = A.request,
      B = null,
      G = null,
      Z = A.timingInfo;
    if (Q.serviceWorkers === "all");
    if (B === null) {
      if (Q.redirect === "follow") Q.serviceWorkers = "none";
      if (G = B = await brQ(A), Q.responseTainting === "cors" && fC3(Q, B) === "failure") return AZ("cors failure");
      if (SC3(Q, B) === "failure") Q.timingAllowFailed = !0
    }
    if ((Q.responseTainting === "opaque" || B.type === "opaque") && hC3(Q.origin, Q.client, Q.destination, G) === "blocked") return AZ("blocked");
    if (TrQ.has(G.status)) {
      if (Q.redirect !== "manual") A.controller.connection.destroy(void 0, !1);
      if (Q.redirect === "error") B = AZ("unexpected redirect");
      else if (Q.redirect === "manual") B = G;
      else if (Q.redirect === "follow") B = await UU3(A, B);
      else ZQA(!1)
    }
    return B.timingInfo = Z, B
  }

  function UU3(A, Q) {
    let B = A.request,
      G = Q.internalResponse ? Q.internalResponse : Q,
      Z;
    try {
      if (Z = yC3(G, rv(B).hash), Z == null) return Q
    } catch (J) {
      return Promise.resolve(AZ(J))
    }
    if (!Qp1(Z)) return Promise.resolve(AZ("URL scheme must be a HTTP(S) scheme"));
    if (B.redirectCount === 20) return Promise.resolve(AZ("redirect count exceeded"));
    if (B.redirectCount += 1, B.mode === "cors" && (Z.username || Z.password) && !ec1(B, Z)) return Promise.resolve(AZ('cross origin not allowed for request mode "cors"'));
    if (B.responseTainting === "cors" && (Z.username || Z.password)) return Promise.resolve(AZ('URL cannot contain credentials for request mode "cors"'));
    if (G.status !== 303 && B.body != null && B.body.source == null) return Promise.resolve(AZ());
    if ([301, 302].includes(G.status) && B.method === "POST" || G.status === 303 && !HU3.includes(B.method)) {
      B.method = "GET", B.body = null;
      for (let J of AU3) B.headersList.delete(J)
    }
    if (!ec1(rv(B), Z)) B.headersList.delete("authorization", !0), B.headersList.delete("proxy-authorization", !0), B.headersList.delete("cookie", !0), B.headersList.delete("host", !0);
    if (B.body != null) ZQA(B.body.source != null), B.body = Bp1(B.body.source)[0];
    let Y = A.timingInfo;
    if (Y.redirectEndTime = Y.postRedirectStartTime = QOA(A.crossOriginIsolatedCapability), Y.redirectStartTime === 0) Y.redirectStartTime = Y.startTime;
    return B.urlList.push(Z), vC3(B, G), vrQ(A, !0)
  }
  async function brQ(A, Q = !1, B = !1) {
    let G = A.request,
      Z = null,
      Y = null,
      J = null,
      X = null,
      I = !1;
    if (G.window === "no-window" && G.redirect === "error") Z = A, Y = G;
    else Y = RC3(G), Z = {
      ...A
    }, Z.request = Y;
    let D = G.credentials === "include" || G.credentials === "same-origin" && G.responseTainting === "basic",
      W = Y.body ? Y.body.length : null,
      K = null;
    if (Y.body == null && ["POST", "PUT"].includes(Y.method)) K = "0";
    if (W != null) K = LeA(`${W}`);
    if (K != null) Y.headersList.append("content-length", K, !0);
    if (W != null && Y.keepalive);
    if (Y.referrer instanceof URL) Y.headersList.append("referer", LeA(Y.referrer.href), !0);
    if (xC3(Y), bC3(Y), !Y.headersList.contains("user-agent", !0)) Y.headersList.append("user-agent", EU3);
    if (Y.cache === "default" && (Y.headersList.contains("if-modified-since", !0) || Y.headersList.contains("if-none-match", !0) || Y.headersList.contains("if-unmodified-since", !0) || Y.headersList.contains("if-match", !0) || Y.headersList.contains("if-range", !0))) Y.cache = "no-store";
    if (Y.cache === "no-cache" && !Y.preventNoCacheCacheControlHeaderModification && !Y.headersList.contains("cache-control", !0)) Y.headersList.append("cache-control", "max-age=0", !0);
    if (Y.cache === "no-store" || Y.cache === "reload") {
      if (!Y.headersList.contains("pragma", !0)) Y.headersList.append("pragma", "no-cache", !0);
      if (!Y.headersList.contains("cache-control", !0)) Y.headersList.append("cache-control", "no-cache", !0)
    }
    if (Y.headersList.contains("range", !0)) Y.headersList.append("accept-encoding", "identity", !0);
    if (!Y.headersList.contains("accept-encoding", !0))
      if (iC3(rv(Y))) Y.headersList.append("accept-encoding", "br, gzip, deflate", !0);
      else Y.headersList.append("accept-encoding", "gzip, deflate", !0);
    if (Y.headersList.delete("host", !0), X == null) Y.cache = "no-store";
    if (Y.cache !== "no-store" && Y.cache !== "reload");
    if (J == null) {
      if (Y.cache === "only-if-cached") return AZ("only if cached");
      let V = await qU3(Z, D, B);
      if (!eC3.has(Y.method) && V.status >= 200 && V.status <= 399);
      if (I && V.status === 304);
      if (J == null) J = V
    }
    if (J.urlList = [...Y.urlList], Y.headersList.contains("range", !0)) J.rangeRequested = !0;
    if (J.requestIncludesCredentials = D, J.status === 407) {
      if (G.window === "no-window") return AZ();
      if (GQA(A)) return NeA(A);
      return AZ("proxy authentication required")
    }
    if (J.status === 421 && !B && (G.body == null || G.body.source != null)) {
      if (GQA(A)) return NeA(A);
      A.controller.connection.destroy(), J = await brQ(A, Q, !0)
    }
    return J
  }
  async function qU3(A, Q = !1, B = !1) {
    ZQA(!A.controller.connection || A.controller.connection.destroyed), A.controller.connection = {
      abort: null,
      destroyed: !1,
      destroy(H, E = !0) {
        if (!this.destroyed) {
          if (this.destroyed = !0, E) this.abort?.(H ?? new DOMException("The operation was aborted.", "AbortError"))
        }
      }
    };
    let G = A.request,
      Z = null,
      Y = A.timingInfo;
    if (!0) G.cache = "no-store";
    let X = B ? "yes" : "no";
    if (G.mode === "websocket");
    let I = null;
    if (G.body == null && A.processRequestEndOfBody) queueMicrotask(() => A.processRequestEndOfBody());
    else if (G.body != null) {
      let H = async function* ($) {
        if (GQA(A)) return;
        yield $, A.processRequestBodyChunkLength?.($.byteLength)
      }, E = () => {
        if (GQA(A)) return;
        if (A.processRequestEndOfBody) A.processRequestEndOfBody()
      }, z = ($) => {
        if (GQA(A)) return;
        if ($.name === "AbortError") A.controller.abort();
        else A.controller.terminate($)
      };
      I = async function* () {
        try {
          for await (let $ of G.body.stream) yield* H($);
          E()
        } catch ($) {
          z($)
        }
      }()
    }
    try {
      let {
        body: H,
        status: E,
        statusText: z,
        headersList: $,
        socket: O
      } = await F({
        body: I
      });
      if (O) Z = weA({
        status: E,
        statusText: z,
        headersList: $,
        socket: O
      });
      else {
        let L = H[Symbol.asyncIterator]();
        A.controller.next = () => L.next(), Z = weA({
          status: E,
          statusText: z,
          headersList: $
        })
      }
    } catch (H) {
      if (H.name === "AbortError") return A.controller.connection.destroy(), NeA(A, H);
      return AZ(H)
    }
    let D = async () => {
      await A.controller.resume()
    }, W = (H) => {
      if (!GQA(A)) A.controller.abort(H)
    }, K = new ReadableStream({
      async start(H) {
        A.controller.controller = H
      },
      async pull(H) {
        await D(H)
      },
      async cancel(H) {
        await W(H)
      },
      type: "bytes"
    });
    Z.body = {
      stream: K,
      source: null,
      length: null
    }, A.controller.onAborted = V, A.controller.on("terminated", V), A.controller.resume = async () => {
      while (!0) {
        let H, E;
        try {
          let {
            done: $,
            value: O
          } = await A.controller.next();
          if (OrQ(A)) break;
          H = $ ? void 0 : O
        } catch ($) {
          if (A.controller.ended && !Y.encodedBodySize) H = void 0;
          else H = $, E = !0
        }
        if (H === void 0) {
          pC3(A.controller.controller), CU3(A, Z);
          return
        }
        if (Y.decodedBodySize += H?.byteLength ?? 0, E) {
          A.controller.terminate(H);
          return
        }
        let z = new Uint8Array(H);
        if (z.byteLength) A.controller.controller.enqueue(z);
        if (XU3(K)) {
          A.controller.terminate();
          return
        }
        if (A.controller.controller.desiredSize <= 0) return
      }
    };

    function V(H) {
      if (OrQ(A)) {
        if (Z.aborted = !0, OeA(K)) A.controller.controller.error(A.controller.serializedAbortReason)
      } else if (OeA(K)) A.controller.controller.error(TypeError("terminated", {
        cause: dC3(H) ? H : void 0
      }));
      A.controller.connection.destroy()
    }
    return Z;

    function F({
      body: H
    }) {
      let E = rv(G),
        z = A.controller.dispatcher;
      return new Promise(($, O) => z.dispatch({
        path: E.pathname + E.search,
        origin: E.origin,
        method: G.method,
        body: z.isMockActive ? G.body && (G.body.source || G.body.stream) : H,
        headers: G.headersList.entries,
        maxRedirections: 0,
        upgrade: G.mode === "websocket" ? "websocket" : void 0
      }, {
        body: null,
        abort: null,
        onConnect(L) {
          let {
            connection: M
          } = A.controller;
          if (Y.finalConnectionTimingInfo = nC3(void 0, Y.postRedirectStartTime, A.crossOriginIsolatedCapability), M.destroyed) L(new DOMException("The operation was aborted.", "AbortError"));
          else A.controller.on("terminated", L), this.abort = M.abort = L;
          Y.finalNetworkRequestStartTime = QOA(A.crossOriginIsolatedCapability)
        },
        onResponseStarted() {
          Y.finalNetworkResponseStartTime = QOA(A.crossOriginIsolatedCapability)
        },
        onHeaders(L, M, _, j) {
          if (L < 200) return;
          let x = [],
            b = "",
            S = new LrQ;
          for (let y = 0; y < M.length; y += 2) S.append(RrQ(M[y]), M[y + 1].toString("latin1"), !0);
          let u = S.get("content-encoding", !0);
          if (u) x = u.toLowerCase().split(",").map((y) => y.trim());
          b = S.get("location", !0), this.body = new GU3({
            read: _
          });
          let f = [],
            AA = b && G.redirect === "follow" && TrQ.has(L);
          if (x.length !== 0 && G.method !== "HEAD" && G.method !== "CONNECT" && !PrQ.includes(L) && !AA)
            for (let y = x.length - 1; y >= 0; --y) {
              let p = x[y];
              if (p === "x-gzip" || p === "gzip") f.push(Tn.createGunzip({
                flush: Tn.constants.Z_SYNC_FLUSH,
                finishFlush: Tn.constants.Z_SYNC_FLUSH
              }));
              else if (p === "deflate") f.push(rC3({
                flush: Tn.constants.Z_SYNC_FLUSH,
                finishFlush: Tn.constants.Z_SYNC_FLUSH
              }));
              else if (p === "br") f.push(Tn.createBrotliDecompress({
                flush: Tn.constants.BROTLI_OPERATION_FLUSH,
                finishFlush: Tn.constants.BROTLI_OPERATION_FLUSH
              }));
              else {
                f.length = 0;
                break
              }
            }
          let n = this.onError.bind(this);
          return $({
            status: L,
            statusText: j,
            headersList: S,
            body: f.length ? ZU3(this.body, ...f, (y) => {
              if (y) this.onError(y)
            }).on("error", n) : this.body.on("error", n)
          }), !0
        },
        onData(L) {
          if (A.controller.dump) return;
          let M = L;
          return Y.encodedBodySize += M.byteLength, this.body.push(M)
        },
        onComplete() {
          if (this.abort) A.controller.off("terminated", this.abort);
          if (A.controller.onAborted) A.controller.off("terminated", A.controller.onAborted);
          A.controller.ended = !0, this.body.push(null)
        },
        onError(L) {
          if (this.abort) A.controller.off("terminated", this.abort);
          this.body?.destroy(L), A.controller.terminate(L), O(L)
        },
        onUpgrade(L, M, _) {
          if (L !== 101) return;
          let j = new LrQ;
          for (let x = 0; x < M.length; x += 2) j.append(RrQ(M[x]), M[x + 1].toString("latin1"), !0);
          return $({
            status: L,
            statusText: FU3[L],
            headersList: j,
            socket: _
          }), !0
        }
      }))
    }
  }
  frQ.exports = {
    fetch: $U3,
    Fetch: Gp1,
    fetching: yrQ,
    finalizeAndReportTiming: SrQ
  }
})
// @from(Ln 117789, Col 4)
Zp1 = U((iXG, hrQ) => {
  hrQ.exports = {
    kState: Symbol("FileReader state"),
    kResult: Symbol("FileReader result"),
    kError: Symbol("FileReader error"),
    kLastProgressEventFired: Symbol("FileReader last progress event fired timestamp"),
    kEvents: Symbol("FileReader events"),
    kAborted: Symbol("FileReader aborted")
  }
})
// @from(Ln 117799, Col 4)
urQ = U((nXG, grQ) => {
  var {
    webidl: wL
  } = xH(), MeA = Symbol("ProgressEvent state");
  class GOA extends Event {
    constructor(A, Q = {}) {
      A = wL.converters.DOMString(A, "ProgressEvent constructor", "type"), Q = wL.converters.ProgressEventInit(Q ?? {});
      super(A, Q);
      this[MeA] = {
        lengthComputable: Q.lengthComputable,
        loaded: Q.loaded,
        total: Q.total
      }
    }
    get lengthComputable() {
      return wL.brandCheck(this, GOA), this[MeA].lengthComputable
    }
    get loaded() {
      return wL.brandCheck(this, GOA), this[MeA].loaded
    }
    get total() {
      return wL.brandCheck(this, GOA), this[MeA].total
    }
  }
  wL.converters.ProgressEventInit = wL.dictionaryConverter([{
    key: "lengthComputable",
    converter: wL.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "loaded",
    converter: wL.converters["unsigned long long"],
    defaultValue: () => 0
  }, {
    key: "total",
    converter: wL.converters["unsigned long long"],
    defaultValue: () => 0
  }, {
    key: "bubbles",
    converter: wL.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "cancelable",
    converter: wL.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "composed",
    converter: wL.converters.boolean,
    defaultValue: () => !1
  }]);
  grQ.exports = {
    ProgressEvent: GOA
  }
})
// @from(Ln 117852, Col 4)
drQ = U((aXG, mrQ) => {
  function NU3(A) {
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
  mrQ.exports = {
    getEncoding: NU3
  }
})
// @from(Ln 118131, Col 4)
rrQ = U((oXG, orQ) => {
  var {
    kState: SJA,
    kError: Yp1,
    kResult: crQ,
    kAborted: ZOA,
    kLastProgressEventFired: Jp1
  } = Zp1(), {
    ProgressEvent: wU3
  } = urQ(), {
    getEncoding: prQ
  } = drQ(), {
    serializeAMimeType: LU3,
    parseMIMEType: lrQ
  } = bq(), {
    types: OU3
  } = NA("node:util"), {
    StringDecoder: irQ
  } = NA("string_decoder"), {
    btoa: nrQ
  } = NA("node:buffer"), MU3 = {
    enumerable: !0,
    writable: !1,
    configurable: !1
  };

  function RU3(A, Q, B, G) {
    if (A[SJA] === "loading") throw new DOMException("Invalid state", "InvalidStateError");
    A[SJA] = "loading", A[crQ] = null, A[Yp1] = null;
    let Y = Q.stream().getReader(),
      J = [],
      X = Y.read(),
      I = !0;
    (async () => {
      while (!A[ZOA]) try {
        let {
          done: D,
          value: W
        } = await X;
        if (I && !A[ZOA]) queueMicrotask(() => {
          Pn("loadstart", A)
        });
        if (I = !1, !D && OU3.isUint8Array(W)) {
          if (J.push(W), (A[Jp1] === void 0 || Date.now() - A[Jp1] >= 50) && !A[ZOA]) A[Jp1] = Date.now(), queueMicrotask(() => {
            Pn("progress", A)
          });
          X = Y.read()
        } else if (D) {
          queueMicrotask(() => {
            A[SJA] = "done";
            try {
              let K = _U3(J, B, Q.type, G);
              if (A[ZOA]) return;
              A[crQ] = K, Pn("load", A)
            } catch (K) {
              A[Yp1] = K, Pn("error", A)
            }
            if (A[SJA] !== "loading") Pn("loadend", A)
          });
          break
        }
      } catch (D) {
        if (A[ZOA]) return;
        queueMicrotask(() => {
          if (A[SJA] = "done", A[Yp1] = D, Pn("error", A), A[SJA] !== "loading") Pn("loadend", A)
        });
        break
      }
    })()
  }

  function Pn(A, Q) {
    let B = new wU3(A, {
      bubbles: !1,
      cancelable: !1
    });
    Q.dispatchEvent(B)
  }

  function _U3(A, Q, B, G) {
    switch (Q) {
      case "DataURL": {
        let Z = "data:",
          Y = lrQ(B || "application/octet-stream");
        if (Y !== "failure") Z += LU3(Y);
        Z += ";base64,";
        let J = new irQ("latin1");
        for (let X of A) Z += nrQ(J.write(X));
        return Z += nrQ(J.end()), Z
      }
      case "Text": {
        let Z = "failure";
        if (G) Z = prQ(G);
        if (Z === "failure" && B) {
          let Y = lrQ(B);
          if (Y !== "failure") Z = prQ(Y.parameters.get("charset"))
        }
        if (Z === "failure") Z = "UTF-8";
        return jU3(A, Z)
      }
      case "ArrayBuffer":
        return arQ(A).buffer;
      case "BinaryString": {
        let Z = "",
          Y = new irQ("latin1");
        for (let J of A) Z += Y.write(J);
        return Z += Y.end(), Z
      }
    }
  }

  function jU3(A, Q) {
    let B = arQ(A),
      G = TU3(B),
      Z = 0;
    if (G !== null) Q = G, Z = G === "UTF-8" ? 3 : 2;
    let Y = B.slice(Z);
    return new TextDecoder(Q).decode(Y)
  }

  function TU3(A) {
    let [Q, B, G] = A;
    if (Q === 239 && B === 187 && G === 191) return "UTF-8";
    else if (Q === 254 && B === 255) return "UTF-16BE";
    else if (Q === 255 && B === 254) return "UTF-16LE";
    return null
  }

  function arQ(A) {
    let Q = A.reduce((G, Z) => {
        return G + Z.byteLength
      }, 0),
      B = 0;
    return A.reduce((G, Z) => {
      return G.set(Z, B), B += Z.byteLength, G
    }, new Uint8Array(Q))
  }
  orQ.exports = {
    staticPropertyDescriptors: MU3,
    readOperation: RU3,
    fireAProgressEvent: Pn
  }
})
// @from(Ln 118274, Col 4)
AsQ = U((rXG, erQ) => {
  var {
    staticPropertyDescriptors: xJA,
    readOperation: ReA,
    fireAProgressEvent: srQ
  } = rrQ(), {
    kState: YQA,
    kError: trQ,
    kResult: _eA,
    kEvents: ZG,
    kAborted: PU3
  } = Zp1(), {
    webidl: MZ
  } = xH(), {
    kEnumerableProperty: gq
  } = b8();
  class QZ extends EventTarget {
    constructor() {
      super();
      this[YQA] = "empty", this[_eA] = null, this[trQ] = null, this[ZG] = {
        loadend: null,
        error: null,
        abort: null,
        load: null,
        progress: null,
        loadstart: null
      }
    }
    readAsArrayBuffer(A) {
      MZ.brandCheck(this, QZ), MZ.argumentLengthCheck(arguments, 1, "FileReader.readAsArrayBuffer"), A = MZ.converters.Blob(A, {
        strict: !1
      }), ReA(this, A, "ArrayBuffer")
    }
    readAsBinaryString(A) {
      MZ.brandCheck(this, QZ), MZ.argumentLengthCheck(arguments, 1, "FileReader.readAsBinaryString"), A = MZ.converters.Blob(A, {
        strict: !1
      }), ReA(this, A, "BinaryString")
    }
    readAsText(A, Q = void 0) {
      if (MZ.brandCheck(this, QZ), MZ.argumentLengthCheck(arguments, 1, "FileReader.readAsText"), A = MZ.converters.Blob(A, {
          strict: !1
        }), Q !== void 0) Q = MZ.converters.DOMString(Q, "FileReader.readAsText", "encoding");
      ReA(this, A, "Text", Q)
    }
    readAsDataURL(A) {
      MZ.brandCheck(this, QZ), MZ.argumentLengthCheck(arguments, 1, "FileReader.readAsDataURL"), A = MZ.converters.Blob(A, {
        strict: !1
      }), ReA(this, A, "DataURL")
    }
    abort() {
      if (this[YQA] === "empty" || this[YQA] === "done") {
        this[_eA] = null;
        return
      }
      if (this[YQA] === "loading") this[YQA] = "done", this[_eA] = null;
      if (this[PU3] = !0, srQ("abort", this), this[YQA] !== "loading") srQ("loadend", this)
    }
    get readyState() {
      switch (MZ.brandCheck(this, QZ), this[YQA]) {
        case "empty":
          return this.EMPTY;
        case "loading":
          return this.LOADING;
        case "done":
          return this.DONE
      }
    }
    get result() {
      return MZ.brandCheck(this, QZ), this[_eA]
    }
    get error() {
      return MZ.brandCheck(this, QZ), this[trQ]
    }
    get onloadend() {
      return MZ.brandCheck(this, QZ), this[ZG].loadend
    }
    set onloadend(A) {
      if (MZ.brandCheck(this, QZ), this[ZG].loadend) this.removeEventListener("loadend", this[ZG].loadend);
      if (typeof A === "function") this[ZG].loadend = A, this.addEventListener("loadend", A);
      else this[ZG].loadend = null
    }
    get onerror() {
      return MZ.brandCheck(this, QZ), this[ZG].error
    }
    set onerror(A) {
      if (MZ.brandCheck(this, QZ), this[ZG].error) this.removeEventListener("error", this[ZG].error);
      if (typeof A === "function") this[ZG].error = A, this.addEventListener("error", A);
      else this[ZG].error = null
    }
    get onloadstart() {
      return MZ.brandCheck(this, QZ), this[ZG].loadstart
    }
    set onloadstart(A) {
      if (MZ.brandCheck(this, QZ), this[ZG].loadstart) this.removeEventListener("loadstart", this[ZG].loadstart);
      if (typeof A === "function") this[ZG].loadstart = A, this.addEventListener("loadstart", A);
      else this[ZG].loadstart = null
    }
    get onprogress() {
      return MZ.brandCheck(this, QZ), this[ZG].progress
    }
    set onprogress(A) {
      if (MZ.brandCheck(this, QZ), this[ZG].progress) this.removeEventListener("progress", this[ZG].progress);
      if (typeof A === "function") this[ZG].progress = A, this.addEventListener("progress", A);
      else this[ZG].progress = null
    }
    get onload() {
      return MZ.brandCheck(this, QZ), this[ZG].load
    }
    set onload(A) {
      if (MZ.brandCheck(this, QZ), this[ZG].load) this.removeEventListener("load", this[ZG].load);
      if (typeof A === "function") this[ZG].load = A, this.addEventListener("load", A);
      else this[ZG].load = null
    }
    get onabort() {
      return MZ.brandCheck(this, QZ), this[ZG].abort
    }
    set onabort(A) {
      if (MZ.brandCheck(this, QZ), this[ZG].abort) this.removeEventListener("abort", this[ZG].abort);
      if (typeof A === "function") this[ZG].abort = A, this.addEventListener("abort", A);
      else this[ZG].abort = null
    }
  }
  QZ.EMPTY = QZ.prototype.EMPTY = 0;
  QZ.LOADING = QZ.prototype.LOADING = 1;
  QZ.DONE = QZ.prototype.DONE = 2;
  Object.defineProperties(QZ.prototype, {
    EMPTY: xJA,
    LOADING: xJA,
    DONE: xJA,
    readAsArrayBuffer: gq,
    readAsBinaryString: gq,
    readAsText: gq,
    readAsDataURL: gq,
    abort: gq,
    readyState: gq,
    result: gq,
    error: gq,
    onloadstart: gq,
    onprogress: gq,
    onload: gq,
    onabort: gq,
    onerror: gq,
    onloadend: gq,
    [Symbol.toStringTag]: {
      value: "FileReader",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  });
  Object.defineProperties(QZ, {
    EMPTY: xJA,
    LOADING: xJA,
    DONE: xJA
  });
  erQ.exports = {
    FileReader: QZ
  }
})
// @from(Ln 118433, Col 4)
jeA = U((sXG, QsQ) => {
  QsQ.exports = {
    kConstruct: VX().kConstruct
  }
})
// @from(Ln 118438, Col 4)
ZsQ = U((tXG, GsQ) => {
  var SU3 = NA("node:assert"),
    {
      URLSerializer: BsQ
    } = bq(),
    {
      isValidHeaderName: xU3
    } = zL();

  function yU3(A, Q, B = !1) {
    let G = BsQ(A, B),
      Z = BsQ(Q, B);
    return G === Z
  }

  function vU3(A) {
    SU3(A !== null);
    let Q = [];
    for (let B of A.split(","))
      if (B = B.trim(), xU3(B)) Q.push(B);
    return Q
  }
  GsQ.exports = {
    urlEquals: yU3,
    getFieldValues: vU3
  }
})
// @from(Ln 118465, Col 4)
XsQ = U((eXG, JsQ) => {
  var {
    kConstruct: kU3
  } = jeA(), {
    urlEquals: bU3,
    getFieldValues: Xp1
  } = ZsQ(), {
    kEnumerableProperty: JQA,
    isDisturbed: fU3
  } = b8(), {
    webidl: J4
  } = xH(), {
    Response: hU3,
    cloneResponse: gU3,
    fromInnerResponse: uU3
  } = AOA(), {
    Request: Uu,
    fromInnerRequest: mU3
  } = PJA(), {
    kState: sT
  } = Cn(), {
    fetching: dU3
  } = BOA(), {
    urlIsHttpHttpsScheme: TeA,
    createDeferredPromise: yJA,
    readAllBytes: cU3
  } = zL(), Ip1 = NA("node:assert");
  class sv {
    #A;
    constructor() {
      if (arguments[0] !== kU3) J4.illegalConstructor();
      J4.util.markAsUncloneable(this), this.#A = arguments[1]
    }
    async match(A, Q = {}) {
      J4.brandCheck(this, sv);
      let B = "Cache.match";
      J4.argumentLengthCheck(arguments, 1, B), A = J4.converters.RequestInfo(A, B, "request"), Q = J4.converters.CacheQueryOptions(Q, B, "options");
      let G = this.#G(A, Q, 1);
      if (G.length === 0) return;
      return G[0]
    }
    async matchAll(A = void 0, Q = {}) {
      J4.brandCheck(this, sv);
      let B = "Cache.matchAll";
      if (A !== void 0) A = J4.converters.RequestInfo(A, B, "request");
      return Q = J4.converters.CacheQueryOptions(Q, B, "options"), this.#G(A, Q)
    }
    async add(A) {
      J4.brandCheck(this, sv);
      let Q = "Cache.add";
      J4.argumentLengthCheck(arguments, 1, Q), A = J4.converters.RequestInfo(A, Q, "request");
      let B = [A];
      return await this.addAll(B)
    }
    async addAll(A) {
      J4.brandCheck(this, sv);
      let Q = "Cache.addAll";
      J4.argumentLengthCheck(arguments, 1, Q);
      let B = [],
        G = [];
      for (let K of A) {
        if (K === void 0) throw J4.errors.conversionFailed({
          prefix: Q,
          argument: "Argument 1",
          types: ["undefined is not allowed"]
        });
        if (K = J4.converters.RequestInfo(K), typeof K === "string") continue;
        let V = K[sT];
        if (!TeA(V.url) || V.method !== "GET") throw J4.errors.exception({
          header: Q,
          message: "Expected http/s scheme when method is not GET."
        })
      }
      let Z = [];
      for (let K of A) {
        let V = new Uu(K)[sT];
        if (!TeA(V.url)) throw J4.errors.exception({
          header: Q,
          message: "Expected http/s scheme."
        });
        V.initiator = "fetch", V.destination = "subresource", G.push(V);
        let F = yJA();
        Z.push(dU3({
          request: V,
          processResponse(H) {
            if (H.type === "error" || H.status === 206 || H.status < 200 || H.status > 299) F.reject(J4.errors.exception({
              header: "Cache.addAll",
              message: "Received an invalid status code or the request failed."
            }));
            else if (H.headersList.contains("vary")) {
              let E = Xp1(H.headersList.get("vary"));
              for (let z of E)
                if (z === "*") {
                  F.reject(J4.errors.exception({
                    header: "Cache.addAll",
                    message: "invalid vary field value"
                  }));
                  for (let $ of Z) $.abort();
                  return
                }
            }
          },
          processResponseEndOfBody(H) {
            if (H.aborted) {
              F.reject(new DOMException("aborted", "AbortError"));
              return
            }
            F.resolve(H)
          }
        })), B.push(F.promise)
      }
      let J = await Promise.all(B),
        X = [],
        I = 0;
      for (let K of J) {
        let V = {
          type: "put",
          request: G[I],
          response: K
        };
        X.push(V), I++
      }
      let D = yJA(),
        W = null;
      try {
        this.#Q(X)
      } catch (K) {
        W = K
      }
      return queueMicrotask(() => {
        if (W === null) D.resolve(void 0);
        else D.reject(W)
      }), D.promise
    }
    async put(A, Q) {
      J4.brandCheck(this, sv);
      let B = "Cache.put";
      J4.argumentLengthCheck(arguments, 2, B), A = J4.converters.RequestInfo(A, B, "request"), Q = J4.converters.Response(Q, B, "response");
      let G = null;
      if (A instanceof Uu) G = A[sT];
      else G = new Uu(A)[sT];
      if (!TeA(G.url) || G.method !== "GET") throw J4.errors.exception({
        header: B,
        message: "Expected an http/s scheme when method is not GET"
      });
      let Z = Q[sT];
      if (Z.status === 206) throw J4.errors.exception({
        header: B,
        message: "Got 206 status"
      });
      if (Z.headersList.contains("vary")) {
        let V = Xp1(Z.headersList.get("vary"));
        for (let F of V)
          if (F === "*") throw J4.errors.exception({
            header: B,
            message: "Got * vary field value"
          })
      }
      if (Z.body && (fU3(Z.body.stream) || Z.body.stream.locked)) throw J4.errors.exception({
        header: B,
        message: "Response body is locked or disturbed"
      });
      let Y = gU3(Z),
        J = yJA();
      if (Z.body != null) {
        let F = Z.body.stream.getReader();
        cU3(F).then(J.resolve, J.reject)
      } else J.resolve(void 0);
      let X = [],
        I = {
          type: "put",
          request: G,
          response: Y
        };
      X.push(I);
      let D = await J.promise;
      if (Y.body != null) Y.body.source = D;
      let W = yJA(),
        K = null;
      try {
        this.#Q(X)
      } catch (V) {
        K = V
      }
      return queueMicrotask(() => {
        if (K === null) W.resolve();
        else W.reject(K)
      }), W.promise
    }
    async delete(A, Q = {}) {
      J4.brandCheck(this, sv);
      let B = "Cache.delete";
      J4.argumentLengthCheck(arguments, 1, B), A = J4.converters.RequestInfo(A, B, "request"), Q = J4.converters.CacheQueryOptions(Q, B, "options");
      let G = null;
      if (A instanceof Uu) {
        if (G = A[sT], G.method !== "GET" && !Q.ignoreMethod) return !1
      } else Ip1(typeof A === "string"), G = new Uu(A)[sT];
      let Z = [],
        Y = {
          type: "delete",
          request: G,
          options: Q
        };
      Z.push(Y);
      let J = yJA(),
        X = null,
        I;
      try {
        I = this.#Q(Z)
      } catch (D) {
        X = D
      }
      return queueMicrotask(() => {
        if (X === null) J.resolve(!!I?.length);
        else J.reject(X)
      }), J.promise
    }
    async keys(A = void 0, Q = {}) {
      J4.brandCheck(this, sv);
      let B = "Cache.keys";
      if (A !== void 0) A = J4.converters.RequestInfo(A, B, "request");
      Q = J4.converters.CacheQueryOptions(Q, B, "options");
      let G = null;
      if (A !== void 0) {
        if (A instanceof Uu) {
          if (G = A[sT], G.method !== "GET" && !Q.ignoreMethod) return []
        } else if (typeof A === "string") G = new Uu(A)[sT]
      }
      let Z = yJA(),
        Y = [];
      if (A === void 0)
        for (let J of this.#A) Y.push(J[0]);
      else {
        let J = this.#B(G, Q);
        for (let X of J) Y.push(X[0])
      }
      return queueMicrotask(() => {
        let J = [];
        for (let X of Y) {
          let I = mU3(X, new AbortController().signal, "immutable");
          J.push(I)
        }
        Z.resolve(Object.freeze(J))
      }), Z.promise
    }
    #Q(A) {
      let Q = this.#A,
        B = [...Q],
        G = [],
        Z = [];
      try {
        for (let Y of A) {
          if (Y.type !== "delete" && Y.type !== "put") throw J4.errors.exception({
            header: "Cache.#batchCacheOperations",
            message: 'operation type does not match "delete" or "put"'
          });
          if (Y.type === "delete" && Y.response != null) throw J4.errors.exception({
            header: "Cache.#batchCacheOperations",
            message: "delete operation should not have an associated response"
          });
          if (this.#B(Y.request, Y.options, G).length) throw new DOMException("???", "InvalidStateError");
          let J;
          if (Y.type === "delete") {
            if (J = this.#B(Y.request, Y.options), J.length === 0) return [];
            for (let X of J) {
              let I = Q.indexOf(X);
              Ip1(I !== -1), Q.splice(I, 1)
            }
          } else if (Y.type === "put") {
            if (Y.response == null) throw J4.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "put operation should have an associated response"
            });
            let X = Y.request;
            if (!TeA(X.url)) throw J4.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "expected http or https scheme"
            });
            if (X.method !== "GET") throw J4.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "not get method"
            });
            if (Y.options != null) throw J4.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "options must not be defined"
            });
            J = this.#B(Y.request);
            for (let I of J) {
              let D = Q.indexOf(I);
              Ip1(D !== -1), Q.splice(D, 1)
            }
            Q.push([Y.request, Y.response]), G.push([Y.request, Y.response])
          }
          Z.push([Y.request, Y.response])
        }
        return Z
      } catch (Y) {
        throw this.#A.length = 0, this.#A = B, Y
      }
    }
    #B(A, Q, B) {
      let G = [],
        Z = B ?? this.#A;
      for (let Y of Z) {
        let [J, X] = Y;
        if (this.#Z(A, J, X, Q)) G.push(Y)
      }
      return G
    }
    #Z(A, Q, B = null, G) {
      let Z = new URL(A.url),
        Y = new URL(Q.url);
      if (G?.ignoreSearch) Y.search = "", Z.search = "";
      if (!bU3(Z, Y, !0)) return !1;
      if (B == null || G?.ignoreVary || !B.headersList.contains("vary")) return !0;
      let J = Xp1(B.headersList.get("vary"));
      for (let X of J) {
        if (X === "*") return !1;
        let I = Q.headersList.get(X),
          D = A.headersList.get(X);
        if (I !== D) return !1
      }
      return !0
    }
    #G(A, Q, B = 1 / 0) {
      let G = null;
      if (A !== void 0) {
        if (A instanceof Uu) {
          if (G = A[sT], G.method !== "GET" && !Q.ignoreMethod) return []
        } else if (typeof A === "string") G = new Uu(A)[sT]
      }
      let Z = [];
      if (A === void 0)
        for (let J of this.#A) Z.push(J[1]);
      else {
        let J = this.#B(G, Q);
        for (let X of J) Z.push(X[1])
      }
      let Y = [];
      for (let J of Z) {
        let X = uU3(J, "immutable");
        if (Y.push(X.clone()), Y.length >= B) break
      }
      return Object.freeze(Y)
    }
  }
  Object.defineProperties(sv.prototype, {
    [Symbol.toStringTag]: {
      value: "Cache",
      configurable: !0
    },
    match: JQA,
    matchAll: JQA,
    add: JQA,
    addAll: JQA,
    put: JQA,
    delete: JQA,
    keys: JQA
  });
  var YsQ = [{
    key: "ignoreSearch",
    converter: J4.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "ignoreMethod",
    converter: J4.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "ignoreVary",
    converter: J4.converters.boolean,
    defaultValue: () => !1
  }];
  J4.converters.CacheQueryOptions = J4.dictionaryConverter(YsQ);
  J4.converters.MultiCacheQueryOptions = J4.dictionaryConverter([...YsQ, {
    key: "cacheName",
    converter: J4.converters.DOMString
  }]);
  J4.converters.Response = J4.interfaceConverter(hU3);
  J4.converters["sequence<RequestInfo>"] = J4.sequenceConverter(J4.converters.RequestInfo);
  JsQ.exports = {
    Cache: sv
  }
})
// @from(Ln 118848, Col 4)
DsQ = U((AIG, IsQ) => {
  var {
    kConstruct: YOA
  } = jeA(), {
    Cache: PeA
  } = XsQ(), {
    webidl: Cz
  } = xH(), {
    kEnumerableProperty: JOA
  } = b8();
  class Sn {
    #A = new Map;
    constructor() {
      if (arguments[0] !== YOA) Cz.illegalConstructor();
      Cz.util.markAsUncloneable(this)
    }
    async match(A, Q = {}) {
      if (Cz.brandCheck(this, Sn), Cz.argumentLengthCheck(arguments, 1, "CacheStorage.match"), A = Cz.converters.RequestInfo(A), Q = Cz.converters.MultiCacheQueryOptions(Q), Q.cacheName != null) {
        if (this.#A.has(Q.cacheName)) {
          let B = this.#A.get(Q.cacheName);
          return await new PeA(YOA, B).match(A, Q)
        }
      } else
        for (let B of this.#A.values()) {
          let Z = await new PeA(YOA, B).match(A, Q);
          if (Z !== void 0) return Z
        }
    }
    async has(A) {
      Cz.brandCheck(this, Sn);
      let Q = "CacheStorage.has";
      return Cz.argumentLengthCheck(arguments, 1, Q), A = Cz.converters.DOMString(A, Q, "cacheName"), this.#A.has(A)
    }
    async open(A) {
      Cz.brandCheck(this, Sn);
      let Q = "CacheStorage.open";
      if (Cz.argumentLengthCheck(arguments, 1, Q), A = Cz.converters.DOMString(A, Q, "cacheName"), this.#A.has(A)) {
        let G = this.#A.get(A);
        return new PeA(YOA, G)
      }
      let B = [];
      return this.#A.set(A, B), new PeA(YOA, B)
    }
    async delete(A) {
      Cz.brandCheck(this, Sn);
      let Q = "CacheStorage.delete";
      return Cz.argumentLengthCheck(arguments, 1, Q), A = Cz.converters.DOMString(A, Q, "cacheName"), this.#A.delete(A)
    }
    async keys() {
      return Cz.brandCheck(this, Sn), [...this.#A.keys()]
    }
  }
  Object.defineProperties(Sn.prototype, {
    [Symbol.toStringTag]: {
      value: "CacheStorage",
      configurable: !0
    },
    match: JOA,
    has: JOA,
    open: JOA,
    delete: JOA,
    keys: JOA
  });
  IsQ.exports = {
    CacheStorage: Sn
  }
})
// @from(Ln 118915, Col 4)
KsQ = U((QIG, WsQ) => {
  WsQ.exports = {
    maxAttributeValueSize: 1024,
    maxNameValuePairSize: 4096
  }
})
// @from(Ln 118921, Col 4)
Dp1 = U((BIG, zsQ) => {
  function pU3(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B >= 0 && B <= 8 || B >= 10 && B <= 31 || B === 127) return !0
    }
    return !1
  }

  function VsQ(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B < 33 || B > 126 || B === 34 || B === 40 || B === 41 || B === 60 || B === 62 || B === 64 || B === 44 || B === 59 || B === 58 || B === 92 || B === 47 || B === 91 || B === 93 || B === 63 || B === 61 || B === 123 || B === 125) throw Error("Invalid cookie name")
    }
  }

  function FsQ(A) {
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

  function HsQ(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B < 32 || B === 127 || B === 59) throw Error("Invalid cookie path")
    }
  }

  function lU3(A) {
    if (A.startsWith("-") || A.endsWith(".") || A.endsWith("-")) throw Error("Invalid cookie domain")
  }
  var iU3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    nU3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    SeA = Array(61).fill(0).map((A, Q) => Q.toString().padStart(2, "0"));

  function EsQ(A) {
    if (typeof A === "number") A = new Date(A);
    return `${iU3[A.getUTCDay()]}, ${SeA[A.getUTCDate()]} ${nU3[A.getUTCMonth()]} ${A.getUTCFullYear()} ${SeA[A.getUTCHours()]}:${SeA[A.getUTCMinutes()]}:${SeA[A.getUTCSeconds()]} GMT`
  }

  function aU3(A) {
    if (A < 0) throw Error("Invalid cookie max-age")
  }

  function oU3(A) {
    if (A.name.length === 0) return null;
    VsQ(A.name), FsQ(A.value);
    let Q = [`${A.name}=${A.value}`];
    if (A.name.startsWith("__Secure-")) A.secure = !0;
    if (A.name.startsWith("__Host-")) A.secure = !0, A.domain = null, A.path = "/";
    if (A.secure) Q.push("Secure");
    if (A.httpOnly) Q.push("HttpOnly");
    if (typeof A.maxAge === "number") aU3(A.maxAge), Q.push(`Max-Age=${A.maxAge}`);
    if (A.domain) lU3(A.domain), Q.push(`Domain=${A.domain}`);
    if (A.path) HsQ(A.path), Q.push(`Path=${A.path}`);
    if (A.expires && A.expires.toString() !== "Invalid Date") Q.push(`Expires=${EsQ(A.expires)}`);
    if (A.sameSite) Q.push(`SameSite=${A.sameSite}`);
    for (let B of A.unparsed) {
      if (!B.includes("=")) throw Error("Invalid unparsed");
      let [G, ...Z] = B.split("=");
      Q.push(`${G.trim()}=${Z.join("=")}`)
    }
    return Q.join("; ")
  }
  zsQ.exports = {
    isCTLExcludingHtab: pU3,
    validateCookieName: VsQ,
    validateCookiePath: HsQ,
    validateCookieValue: FsQ,
    toIMFDate: EsQ,
    stringify: oU3
  }
})
// @from(Ln 119002, Col 4)
CsQ = U((GIG, $sQ) => {
  var {
    maxNameValuePairSize: rU3,
    maxAttributeValueSize: sU3
  } = KsQ(), {
    isCTLExcludingHtab: tU3
  } = Dp1(), {
    collectASequenceOfCodePointsFast: xeA
  } = bq(), eU3 = NA("node:assert");

  function Aq3(A) {
    if (tU3(A)) return null;
    let Q = "",
      B = "",
      G = "",
      Z = "";
    if (A.includes(";")) {
      let Y = {
        position: 0
      };
      Q = xeA(";", A, Y), B = A.slice(Y.position)
    } else Q = A;
    if (!Q.includes("=")) Z = Q;
    else {
      let Y = {
        position: 0
      };
      G = xeA("=", Q, Y), Z = Q.slice(Y.position + 1)
    }
    if (G = G.trim(), Z = Z.trim(), G.length + Z.length > rU3) return null;
    return {
      name: G,
      value: Z,
      ...vJA(B)
    }
  }

  function vJA(A, Q = {}) {
    if (A.length === 0) return Q;
    eU3(A[0] === ";"), A = A.slice(1);
    let B = "";
    if (A.includes(";")) B = xeA(";", A, {
      position: 0
    }), A = A.slice(B.length);
    else B = A, A = "";
    let G = "",
      Z = "";
    if (B.includes("=")) {
      let J = {
        position: 0
      };
      G = xeA("=", B, J), Z = B.slice(J.position + 1)
    } else G = B;
    if (G = G.trim(), Z = Z.trim(), Z.length > sU3) return vJA(A, Q);
    let Y = G.toLowerCase();
    if (Y === "expires") {
      let J = new Date(Z);
      Q.expires = J
    } else if (Y === "max-age") {
      let J = Z.charCodeAt(0);
      if ((J < 48 || J > 57) && Z[0] !== "-") return vJA(A, Q);
      if (!/^\d+$/.test(Z)) return vJA(A, Q);
      let X = Number(Z);
      Q.maxAge = X
    } else if (Y === "domain") {
      let J = Z;
      if (J[0] === ".") J = J.slice(1);
      J = J.toLowerCase(), Q.domain = J
    } else if (Y === "path") {
      let J = "";
      if (Z.length === 0 || Z[0] !== "/") J = "/";
      else J = Z;
      Q.path = J
    } else if (Y === "secure") Q.secure = !0;
    else if (Y === "httponly") Q.httpOnly = !0;
    else if (Y === "samesite") {
      let J = "Default",
        X = Z.toLowerCase();
      if (X.includes("none")) J = "None";
      if (X.includes("strict")) J = "Strict";
      if (X.includes("lax")) J = "Lax";
      Q.sameSite = J
    } else Q.unparsed ??= [], Q.unparsed.push(`${G}=${Z}`);
    return vJA(A, Q)
  }
  $sQ.exports = {
    parseSetCookie: Aq3,
    parseUnparsedAttributes: vJA
  }
})
// @from(Ln 119092, Col 4)
NsQ = U((ZIG, qsQ) => {
  var {
    parseSetCookie: Qq3
  } = CsQ(), {
    stringify: Bq3
  } = Dp1(), {
    webidl: P5
  } = xH(), {
    Headers: yeA
  } = BQA();

  function Gq3(A) {
    P5.argumentLengthCheck(arguments, 1, "getCookies"), P5.brandCheck(A, yeA, {
      strict: !1
    });
    let Q = A.get("cookie"),
      B = {};
    if (!Q) return B;
    for (let G of Q.split(";")) {
      let [Z, ...Y] = G.split("=");
      B[Z.trim()] = Y.join("=")
    }
    return B
  }

  function Zq3(A, Q, B) {
    P5.brandCheck(A, yeA, {
      strict: !1
    });
    let G = "deleteCookie";
    P5.argumentLengthCheck(arguments, 2, G), Q = P5.converters.DOMString(Q, G, "name"), B = P5.converters.DeleteCookieAttributes(B), UsQ(A, {
      name: Q,
      value: "",
      expires: new Date(0),
      ...B
    })
  }

  function Yq3(A) {
    P5.argumentLengthCheck(arguments, 1, "getSetCookies"), P5.brandCheck(A, yeA, {
      strict: !1
    });
    let Q = A.getSetCookie();
    if (!Q) return [];
    return Q.map((B) => Qq3(B))
  }

  function UsQ(A, Q) {
    P5.argumentLengthCheck(arguments, 2, "setCookie"), P5.brandCheck(A, yeA, {
      strict: !1
    }), Q = P5.converters.Cookie(Q);
    let B = Bq3(Q);
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
  qsQ.exports = {
    getCookies: Gq3,
    deleteCookie: Zq3,
    getSetCookies: Yq3,
    setCookie: UsQ
  }
})
// @from(Ln 119204, Col 4)
bJA = U((YIG, LsQ) => {
  var {
    webidl: a9
  } = xH(), {
    kEnumerableProperty: uq
  } = b8(), {
    kConstruct: wsQ
  } = VX(), {
    MessagePort: Jq3
  } = NA("node:worker_threads");
  class LL extends Event {
    #A;
    constructor(A, Q = {}) {
      if (A === wsQ) {
        super(arguments[1], arguments[2]);
        a9.util.markAsUncloneable(this);
        return
      }
      let B = "MessageEvent constructor";
      a9.argumentLengthCheck(arguments, 1, B), A = a9.converters.DOMString(A, B, "type"), Q = a9.converters.MessageEventInit(Q, B, "eventInitDict");
      super(A, Q);
      this.#A = Q, a9.util.markAsUncloneable(this)
    }
    get data() {
      return a9.brandCheck(this, LL), this.#A.data
    }
    get origin() {
      return a9.brandCheck(this, LL), this.#A.origin
    }
    get lastEventId() {
      return a9.brandCheck(this, LL), this.#A.lastEventId
    }
    get source() {
      return a9.brandCheck(this, LL), this.#A.source
    }
    get ports() {
      if (a9.brandCheck(this, LL), !Object.isFrozen(this.#A.ports)) Object.freeze(this.#A.ports);
      return this.#A.ports
    }
    initMessageEvent(A, Q = !1, B = !1, G = null, Z = "", Y = "", J = null, X = []) {
      return a9.brandCheck(this, LL), a9.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new LL(A, {
        bubbles: Q,
        cancelable: B,
        data: G,
        origin: Z,
        lastEventId: Y,
        source: J,
        ports: X
      })
    }
    static createFastMessageEvent(A, Q) {
      let B = new LL(wsQ, A, Q);
      return B.#A = Q, B.#A.data ??= null, B.#A.origin ??= "", B.#A.lastEventId ??= "", B.#A.source ??= null, B.#A.ports ??= [], B
    }
  }
  var {
    createFastMessageEvent: Xq3
  } = LL;
  delete LL.createFastMessageEvent;
  class kJA extends Event {
    #A;
    constructor(A, Q = {}) {
      a9.argumentLengthCheck(arguments, 1, "CloseEvent constructor"), A = a9.converters.DOMString(A, "CloseEvent constructor", "type"), Q = a9.converters.CloseEventInit(Q);
      super(A, Q);
      this.#A = Q, a9.util.markAsUncloneable(this)
    }
    get wasClean() {
      return a9.brandCheck(this, kJA), this.#A.wasClean
    }
    get code() {
      return a9.brandCheck(this, kJA), this.#A.code
    }
    get reason() {
      return a9.brandCheck(this, kJA), this.#A.reason
    }
  }
  class xn extends Event {
    #A;
    constructor(A, Q) {
      a9.argumentLengthCheck(arguments, 1, "ErrorEvent constructor");
      super(A, Q);
      a9.util.markAsUncloneable(this), A = a9.converters.DOMString(A, "ErrorEvent constructor", "type"), Q = a9.converters.ErrorEventInit(Q ?? {}), this.#A = Q
    }
    get message() {
      return a9.brandCheck(this, xn), this.#A.message
    }
    get filename() {
      return a9.brandCheck(this, xn), this.#A.filename
    }
    get lineno() {
      return a9.brandCheck(this, xn), this.#A.lineno
    }
    get colno() {
      return a9.brandCheck(this, xn), this.#A.colno
    }
    get error() {
      return a9.brandCheck(this, xn), this.#A.error
    }
  }
  Object.defineProperties(LL.prototype, {
    [Symbol.toStringTag]: {
      value: "MessageEvent",
      configurable: !0
    },
    data: uq,
    origin: uq,
    lastEventId: uq,
    source: uq,
    ports: uq,
    initMessageEvent: uq
  });
  Object.defineProperties(kJA.prototype, {
    [Symbol.toStringTag]: {
      value: "CloseEvent",
      configurable: !0
    },
    reason: uq,
    code: uq,
    wasClean: uq
  });
  Object.defineProperties(xn.prototype, {
    [Symbol.toStringTag]: {
      value: "ErrorEvent",
      configurable: !0
    },
    message: uq,
    filename: uq,
    lineno: uq,
    colno: uq,
    error: uq
  });
  a9.converters.MessagePort = a9.interfaceConverter(Jq3);
  a9.converters["sequence<MessagePort>"] = a9.sequenceConverter(a9.converters.MessagePort);
  var Wp1 = [{
    key: "bubbles",
    converter: a9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "cancelable",
    converter: a9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "composed",
    converter: a9.converters.boolean,
    defaultValue: () => !1
  }];
  a9.converters.MessageEventInit = a9.dictionaryConverter([...Wp1, {
    key: "data",
    converter: a9.converters.any,
    defaultValue: () => null
  }, {
    key: "origin",
    converter: a9.converters.USVString,
    defaultValue: () => ""
  }, {
    key: "lastEventId",
    converter: a9.converters.DOMString,
    defaultValue: () => ""
  }, {
    key: "source",
    converter: a9.nullableConverter(a9.converters.MessagePort),
    defaultValue: () => null
  }, {
    key: "ports",
    converter: a9.converters["sequence<MessagePort>"],
    defaultValue: () => []
  }]);
  a9.converters.CloseEventInit = a9.dictionaryConverter([...Wp1, {
    key: "wasClean",
    converter: a9.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "code",
    converter: a9.converters["unsigned short"],
    defaultValue: () => 0
  }, {
    key: "reason",
    converter: a9.converters.USVString,
    defaultValue: () => ""
  }]);
  a9.converters.ErrorEventInit = a9.dictionaryConverter([...Wp1, {
    key: "message",
    converter: a9.converters.DOMString,
    defaultValue: () => ""
  }, {
    key: "filename",
    converter: a9.converters.USVString,
    defaultValue: () => ""
  }, {
    key: "lineno",
    converter: a9.converters["unsigned long"],
    defaultValue: () => 0
  }, {
    key: "colno",
    converter: a9.converters["unsigned long"],
    defaultValue: () => 0
  }, {
    key: "error",
    converter: a9.converters.any
  }]);
  LsQ.exports = {
    MessageEvent: LL,
    CloseEvent: kJA,
    ErrorEvent: xn,
    createFastMessageEvent: Xq3
  }
})
// @from(Ln 119411, Col 4)
XQA = U((JIG, OsQ) => {
  var Iq3 = {
      enumerable: !0,
      writable: !1,
      configurable: !1
    },
    Dq3 = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    },
    Wq3 = {
      NOT_SENT: 0,
      PROCESSING: 1,
      SENT: 2
    },
    Kq3 = {
      CONTINUATION: 0,
      TEXT: 1,
      BINARY: 2,
      CLOSE: 8,
      PING: 9,
      PONG: 10
    },
    Vq3 = {
      INFO: 0,
      PAYLOADLENGTH_16: 2,
      PAYLOADLENGTH_64: 3,
      READ_DATA: 4
    },
    Fq3 = Buffer.allocUnsafe(0),
    Hq3 = {
      string: 1,
      typedArray: 2,
      arrayBuffer: 3,
      blob: 4
    };
  OsQ.exports = {
    uid: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    sentCloseFrameState: Wq3,
    staticPropertyDescriptors: Iq3,
    states: Dq3,
    opcodes: Kq3,
    maxUnsigned16Bit: 65535,
    parserStates: Vq3,
    emptyBuffer: Fq3,
    sendHints: Hq3
  }
})
// @from(Ln 119461, Col 4)
XOA = U((XIG, MsQ) => {
  MsQ.exports = {
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
// @from(Ln 119473, Col 4)
WOA = U((IIG, vsQ) => {
  var {
    kReadyState: IOA,
    kController: Eq3,
    kResponse: zq3,
    kBinaryType: $q3,
    kWebSocketURL: Cq3
  } = XOA(), {
    states: DOA,
    opcodes: yn
  } = XQA(), {
    ErrorEvent: Uq3,
    createFastMessageEvent: qq3
  } = bJA(), {
    isUtf8: Nq3
  } = NA("node:buffer"), {
    collectASequenceOfCodePointsFast: wq3,
    removeHTTPWhitespace: RsQ
  } = bq();

  function Lq3(A) {
    return A[IOA] === DOA.CONNECTING
  }

  function Oq3(A) {
    return A[IOA] === DOA.OPEN
  }

  function Mq3(A) {
    return A[IOA] === DOA.CLOSING
  }

  function Rq3(A) {
    return A[IOA] === DOA.CLOSED
  }

  function Kp1(A, Q, B = (Z, Y) => new Event(Z, Y), G = {}) {
    let Z = B(A, G);
    Q.dispatchEvent(Z)
  }

  function _q3(A, Q, B) {
    if (A[IOA] !== DOA.OPEN) return;
    let G;
    if (Q === yn.TEXT) try {
      G = ysQ(B)
    } catch {
      jsQ(A, "Received invalid UTF-8 in text frame.");
      return
    } else if (Q === yn.BINARY)
      if (A[$q3] === "blob") G = new Blob([B]);
      else G = jq3(B);
    Kp1("message", A, qq3, {
      origin: A[Cq3].origin,
      data: G
    })
  }

  function jq3(A) {
    if (A.byteLength === A.buffer.byteLength) return A.buffer;
    return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
  }

  function Tq3(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B < 33 || B > 126 || B === 34 || B === 40 || B === 41 || B === 44 || B === 47 || B === 58 || B === 59 || B === 60 || B === 61 || B === 62 || B === 63 || B === 64 || B === 91 || B === 92 || B === 93 || B === 123 || B === 125) return !1
    }
    return !0
  }

  function Pq3(A) {
    if (A >= 1000 && A < 1015) return A !== 1004 && A !== 1005 && A !== 1006;
    return A >= 3000 && A <= 4999
  }

  function jsQ(A, Q) {
    let {
      [Eq3]: B, [zq3]: G
    } = A;
    if (B.abort(), G?.socket && !G.socket.destroyed) G.socket.destroy();
    if (Q) Kp1("error", A, (Z, Y) => new Uq3(Z, Y), {
      error: Error(Q),
      message: Q
    })
  }

  function TsQ(A) {
    return A === yn.CLOSE || A === yn.PING || A === yn.PONG
  }

  function PsQ(A) {
    return A === yn.CONTINUATION
  }

  function SsQ(A) {
    return A === yn.TEXT || A === yn.BINARY
  }

  function Sq3(A) {
    return SsQ(A) || PsQ(A) || TsQ(A)
  }

  function xq3(A) {
    let Q = {
        position: 0
      },
      B = new Map;
    while (Q.position < A.length) {
      let G = wq3(";", A, Q),
        [Z, Y = ""] = G.split("=");
      B.set(RsQ(Z, !0, !1), RsQ(Y, !1, !0)), Q.position++
    }
    return B
  }

  function yq3(A) {
    for (let Q = 0; Q < A.length; Q++) {
      let B = A.charCodeAt(Q);
      if (B < 48 || B > 57) return !1
    }
    return !0
  }
  var xsQ = typeof process.versions.icu === "string",
    _sQ = xsQ ? new TextDecoder("utf-8", {
      fatal: !0
    }) : void 0,
    ysQ = xsQ ? _sQ.decode.bind(_sQ) : function (A) {
      if (Nq3(A)) return A.toString("utf-8");
      throw TypeError("Invalid utf-8 received.")
    };
  vsQ.exports = {
    isConnecting: Lq3,
    isEstablished: Oq3,
    isClosing: Mq3,
    isClosed: Rq3,
    fireEvent: Kp1,
    isValidSubprotocol: Tq3,
    isValidStatusCode: Pq3,
    failWebsocketConnection: jsQ,
    websocketMessageReceived: _q3,
    utf8Decode: ysQ,
    isControlFrame: TsQ,
    isContinuationFrame: PsQ,
    isTextBinaryFrame: SsQ,
    isValidOpcode: Sq3,
    parseExtensions: xq3,
    isValidClientWindowBits: yq3
  }
})
// @from(Ln 119624, Col 4)
veA = U((DIG, bsQ) => {
  var {
    maxUnsigned16Bit: vq3
  } = XQA(), Vp1, KOA = null, fJA = 16386;
  try {
    Vp1 = NA("node:crypto")
  } catch {
    Vp1 = {
      randomFillSync: function (Q, B, G) {
        for (let Z = 0; Z < Q.length; ++Z) Q[Z] = Math.random() * 255 | 0;
        return Q
      }
    }
  }

  function kq3() {
    if (fJA === 16386) fJA = 0, Vp1.randomFillSync(KOA ??= Buffer.allocUnsafe(16386), 0, 16386);
    return [KOA[fJA++], KOA[fJA++], KOA[fJA++], KOA[fJA++]]
  }
  class ksQ {
    constructor(A) {
      this.frameData = A
    }
    createFrame(A) {
      let Q = this.frameData,
        B = kq3(),
        G = Q?.byteLength ?? 0,
        Z = G,
        Y = 6;
      if (G > vq3) Y += 8, Z = 127;
      else if (G > 125) Y += 2, Z = 126;
      let J = Buffer.allocUnsafe(G + Y);
      J[0] = J[1] = 0, J[0] |= 128, J[0] = (J[0] & 240) + A; /*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */
      if (J[Y - 4] = B[0], J[Y - 3] = B[1], J[Y - 2] = B[2], J[Y - 1] = B[3], J[1] = Z, Z === 126) J.writeUInt16BE(G, 2);
      else if (Z === 127) J[2] = J[3] = 0, J.writeUIntBE(G, 4, 6);
      J[1] |= 128;
      for (let X = 0; X < G; ++X) J[Y + X] = Q[X] ^ B[X & 3];
      return J
    }
  }
  bsQ.exports = {
    WebsocketFrameSend: ksQ
  }
})
// @from(Ln 119668, Col 4)
Hp1 = U((WIG, csQ) => {
  var {
    uid: bq3,
    states: VOA,
    sentCloseFrameState: keA,
    emptyBuffer: fq3,
    opcodes: hq3
  } = XQA(), {
    kReadyState: FOA,
    kSentClose: beA,
    kByteParser: hsQ,
    kReceivedClose: fsQ,
    kResponse: gsQ
  } = XOA(), {
    fireEvent: gq3,
    failWebsocketConnection: vn,
    isClosing: uq3,
    isClosed: mq3,
    isEstablished: dq3,
    parseExtensions: cq3
  } = WOA(), {
    channels: hJA
  } = tYA(), {
    CloseEvent: pq3
  } = bJA(), {
    makeRequest: lq3
  } = PJA(), {
    fetching: iq3
  } = BOA(), {
    Headers: nq3,
    getHeadersList: aq3
  } = BQA(), {
    getDecodeSplit: oq3
  } = zL(), {
    WebsocketFrameSend: rq3
  } = veA(), Fp1;
  try {
    Fp1 = NA("node:crypto")
  } catch {}

  function sq3(A, Q, B, G, Z, Y) {
    let J = A;
    J.protocol = A.protocol === "ws:" ? "http:" : "https:";
    let X = lq3({
      urlList: [J],
      client: B,
      serviceWorkers: "none",
      referrer: "no-referrer",
      mode: "websocket",
      credentials: "include",
      cache: "no-store",
      redirect: "error"
    });
    if (Y.headers) {
      let K = aq3(new nq3(Y.headers));
      X.headersList = K
    }
    let I = Fp1.randomBytes(16).toString("base64");
    X.headersList.append("sec-websocket-key", I), X.headersList.append("sec-websocket-version", "13");
    for (let K of Q) X.headersList.append("sec-websocket-protocol", K);
    let D = "permessage-deflate; client_max_window_bits";
    return X.headersList.append("sec-websocket-extensions", D), iq3({
      request: X,
      useParallelQueue: !0,
      dispatcher: Y.dispatcher,
      processResponse(K) {
        if (K.type === "error" || K.status !== 101) {
          vn(G, "Received network error or non-101 status code.");
          return
        }
        if (Q.length !== 0 && !K.headersList.get("Sec-WebSocket-Protocol")) {
          vn(G, "Server did not respond with sent protocols.");
          return
        }
        if (K.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
          vn(G, 'Server did not set Upgrade header to "websocket".');
          return
        }
        if (K.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
          vn(G, 'Server did not set Connection header to "upgrade".');
          return
        }
        let V = K.headersList.get("Sec-WebSocket-Accept"),
          F = Fp1.createHash("sha1").update(I + bq3).digest("base64");
        if (V !== F) {
          vn(G, "Incorrect hash received in Sec-WebSocket-Accept header.");
          return
        }
        let H = K.headersList.get("Sec-WebSocket-Extensions"),
          E;
        if (H !== null) {
          if (E = cq3(H), !E.has("permessage-deflate")) {
            vn(G, "Sec-WebSocket-Extensions header does not match.");
            return
          }
        }
        let z = K.headersList.get("Sec-WebSocket-Protocol");
        if (z !== null) {
          if (!oq3("sec-websocket-protocol", X.headersList).includes(z)) {
            vn(G, "Protocol was not set in the opening handshake.");
            return
          }
        }
        if (K.socket.on("data", usQ), K.socket.on("close", msQ), K.socket.on("error", dsQ), hJA.open.hasSubscribers) hJA.open.publish({
          address: K.socket.address(),
          protocol: z,
          extensions: H
        });
        Z(K, E)
      }
    })
  }

  function tq3(A, Q, B, G) {
    if (uq3(A) || mq3(A));
    else if (!dq3(A)) vn(A, "Connection was closed before it was established."), A[FOA] = VOA.CLOSING;
    else if (A[beA] === keA.NOT_SENT) {
      A[beA] = keA.PROCESSING;
      let Z = new rq3;
      if (Q !== void 0 && B === void 0) Z.frameData = Buffer.allocUnsafe(2), Z.frameData.writeUInt16BE(Q, 0);
      else if (Q !== void 0 && B !== void 0) Z.frameData = Buffer.allocUnsafe(2 + G), Z.frameData.writeUInt16BE(Q, 0), Z.frameData.write(B, 2, "utf-8");
      else Z.frameData = fq3;
      A[gsQ].socket.write(Z.createFrame(hq3.CLOSE)), A[beA] = keA.SENT, A[FOA] = VOA.CLOSING
    } else A[FOA] = VOA.CLOSING
  }

  function usQ(A) {
    if (!this.ws[hsQ].write(A)) this.pause()
  }

  function msQ() {
    let {
      ws: A
    } = this, {
      [gsQ]: Q
    } = A;
    Q.socket.off("data", usQ), Q.socket.off("close", msQ), Q.socket.off("error", dsQ);
    let B = A[beA] === keA.SENT && A[fsQ],
      G = 1005,
      Z = "",
      Y = A[hsQ].closingInfo;
    if (Y && !Y.error) G = Y.code ?? 1005, Z = Y.reason;
    else if (!A[fsQ]) G = 1006;
    if (A[FOA] = VOA.CLOSED, gq3("close", A, (J, X) => new pq3(J, X), {
        wasClean: B,
        code: G,
        reason: Z
      }), hJA.close.hasSubscribers) hJA.close.publish({
      websocket: A,
      code: G,
      reason: Z
    })
  }

  function dsQ(A) {
    let {
      ws: Q
    } = this;
    if (Q[FOA] = VOA.CLOSING, hJA.socketError.hasSubscribers) hJA.socketError.publish(A);
    this.destroy()
  }
  csQ.exports = {
    establishWebSocketConnection: sq3,
    closeWebSocketConnection: tq3
  }
})
// @from(Ln 119834, Col 4)
isQ = U((KIG, lsQ) => {
  var {
    createInflateRaw: eq3,
    Z_DEFAULT_WINDOWBITS: AN3
  } = NA("node:zlib"), {
    isValidClientWindowBits: QN3
  } = WOA(), BN3 = Buffer.from([0, 0, 255, 255]), feA = Symbol("kBuffer"), heA = Symbol("kLength");
  class psQ {
    #A;
    #Q = {};
    constructor(A) {
      this.#Q.serverNoContextTakeover = A.has("server_no_context_takeover"), this.#Q.serverMaxWindowBits = A.get("server_max_window_bits")
    }
    decompress(A, Q, B) {
      if (!this.#A) {
        let G = AN3;
        if (this.#Q.serverMaxWindowBits) {
          if (!QN3(this.#Q.serverMaxWindowBits)) {
            B(Error("Invalid server_max_window_bits"));
            return
          }
          G = Number.parseInt(this.#Q.serverMaxWindowBits)
        }
        this.#A = eq3({
          windowBits: G
        }), this.#A[feA] = [], this.#A[heA] = 0, this.#A.on("data", (Z) => {
          this.#A[feA].push(Z), this.#A[heA] += Z.length
        }), this.#A.on("error", (Z) => {
          this.#A = null, B(Z)
        })
      }
      if (this.#A.write(A), Q) this.#A.write(BN3);
      this.#A.flush(() => {
        let G = Buffer.concat(this.#A[feA], this.#A[heA]);
        this.#A[feA].length = 0, this.#A[heA] = 0, B(null, G)
      })
    }
  }
  lsQ.exports = {
    PerMessageDeflate: psQ
  }
})