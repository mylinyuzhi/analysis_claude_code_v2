
// @from(Start 4781946, End 4800409)
xw = z((VS7, SAB) => {
  var {
    Transform: Fg8
  } = UA("node:stream"), HAB = UA("node:zlib"), {
    redirectStatusSet: Kg8,
    referrerPolicySet: Dg8,
    badPortsSet: Hg8
  } = PEA(), {
    getGlobalOrigin: CAB
  } = xy1(), {
    collectASequenceOfCodePoints: xo,
    collectAnHTTPQuotedString: Cg8,
    removeChars: Eg8,
    parseMIMEType: zg8
  } = QU(), {
    performance: Ug8
  } = UA("node:perf_hooks"), {
    isBlobLike: $g8,
    ReadableStreamFrom: wg8,
    isValidHTTPToken: EAB,
    normalizedMethodRecordsBase: qg8
  } = S6(), vo = UA("node:assert"), {
    isUint8Array: Ng8
  } = UA("node:util/types"), {
    webidl: SEA
  } = zD(), zAB = [], QlA;
  try {
    QlA = UA("node:crypto");
    let A = ["sha256", "sha384", "sha512"];
    zAB = QlA.getHashes().filter((Q) => A.includes(Q))
  } catch {}

  function UAB(A) {
    let Q = A.urlList,
      B = Q.length;
    return B === 0 ? null : Q[B - 1].toString()
  }

  function Lg8(A, Q) {
    if (!Kg8.has(A.status)) return null;
    let B = A.headersList.get("location", !0);
    if (B !== null && wAB(B)) {
      if (!$AB(B)) B = Mg8(B);
      B = new URL(B, UAB(A))
    }
    if (B && !B.hash) B.hash = Q;
    return B
  }

  function $AB(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B > 126 || B < 32) return !1
    }
    return !0
  }

  function Mg8(A) {
    return Buffer.from(A, "binary").toString("utf8")
  }

  function kEA(A) {
    return A.urlList[A.urlList.length - 1]
  }

  function Og8(A) {
    let Q = kEA(A);
    if (OAB(Q) && Hg8.has(Q.port)) return "blocked";
    return "allowed"
  }

  function Rg8(A) {
    return A instanceof Error || (A?.constructor?.name === "Error" || A?.constructor?.name === "DOMException")
  }

  function Tg8(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (!(B === 9 || B >= 32 && B <= 126 || B >= 128 && B <= 255)) return !1
    }
    return !0
  }
  var Pg8 = EAB;

  function wAB(A) {
    return (A[0] === "\t" || A[0] === " " || A[A.length - 1] === "\t" || A[A.length - 1] === " " || A.includes(`
`) || A.includes("\r") || A.includes("\x00")) === !1
  }

  function jg8(A, Q) {
    let {
      headersList: B
    } = Q, G = (B.get("referrer-policy", !0) ?? "").split(","), Z = "";
    if (G.length > 0)
      for (let I = G.length; I !== 0; I--) {
        let Y = G[I - 1].trim();
        if (Dg8.has(Y)) {
          Z = Y;
          break
        }
      }
    if (Z !== "") A.referrerPolicy = Z
  }

  function Sg8() {
    return "allowed"
  }

  function _g8() {
    return "success"
  }

  function kg8() {
    return "success"
  }

  function yg8(A) {
    let Q = null;
    Q = A.mode, A.headersList.set("sec-fetch-mode", Q, !0)
  }

  function xg8(A) {
    let Q = A.origin;
    if (Q === "client" || Q === void 0) return;
    if (A.responseTainting === "cors" || A.mode === "websocket") A.headersList.append("origin", Q, !0);
    else if (A.method !== "GET" && A.method !== "HEAD") {
      switch (A.referrerPolicy) {
        case "no-referrer":
          Q = null;
          break;
        case "no-referrer-when-downgrade":
        case "strict-origin":
        case "strict-origin-when-cross-origin":
          if (A.origin && hy1(A.origin) && !hy1(kEA(A))) Q = null;
          break;
        case "same-origin":
          if (!BlA(A, kEA(A))) Q = null;
          break;
        default:
      }
      A.headersList.append("origin", Q, !0)
    }
  }

  function t5A(A, Q) {
    return A
  }

  function vg8(A, Q, B) {
    if (!A?.startTime || A.startTime < Q) return {
      domainLookupStartTime: Q,
      domainLookupEndTime: Q,
      connectionStartTime: Q,
      connectionEndTime: Q,
      secureConnectionStartTime: Q,
      ALPNNegotiatedProtocol: A?.ALPNNegotiatedProtocol
    };
    return {
      domainLookupStartTime: t5A(A.domainLookupStartTime, B),
      domainLookupEndTime: t5A(A.domainLookupEndTime, B),
      connectionStartTime: t5A(A.connectionStartTime, B),
      connectionEndTime: t5A(A.connectionEndTime, B),
      secureConnectionStartTime: t5A(A.secureConnectionStartTime, B),
      ALPNNegotiatedProtocol: A.ALPNNegotiatedProtocol
    }
  }

  function bg8(A) {
    return t5A(Ug8.now(), A)
  }

  function fg8(A) {
    return {
      startTime: A.startTime ?? 0,
      redirectStartTime: 0,
      redirectEndTime: 0,
      postRedirectStartTime: A.startTime ?? 0,
      finalServiceWorkerStartTime: 0,
      finalNetworkResponseStartTime: 0,
      finalNetworkRequestStartTime: 0,
      endTime: 0,
      encodedBodySize: 0,
      decodedBodySize: 0,
      finalConnectionTimingInfo: null
    }
  }

  function qAB() {
    return {
      referrerPolicy: "strict-origin-when-cross-origin"
    }
  }

  function hg8(A) {
    return {
      referrerPolicy: A.referrerPolicy
    }
  }

  function gg8(A) {
    let Q = A.referrerPolicy;
    vo(Q);
    let B = null;
    if (A.referrer === "client") {
      let J = CAB();
      if (!J || J.origin === "null") return "no-referrer";
      B = new URL(J)
    } else if (A.referrer instanceof URL) B = A.referrer;
    let G = fy1(B),
      Z = fy1(B, !0);
    if (G.toString().length > 4096) G = Z;
    let I = BlA(A, G),
      Y = _EA(G) && !_EA(A.url);
    switch (Q) {
      case "origin":
        return Z != null ? Z : fy1(B, !0);
      case "unsafe-url":
        return G;
      case "same-origin":
        return I ? Z : "no-referrer";
      case "origin-when-cross-origin":
        return I ? G : Z;
      case "strict-origin-when-cross-origin": {
        let J = kEA(A);
        if (BlA(G, J)) return G;
        if (_EA(G) && !_EA(J)) return "no-referrer";
        return Z
      }
      case "strict-origin":
      case "no-referrer-when-downgrade":
      default:
        return Y ? "no-referrer" : Z
    }
  }

  function fy1(A, Q) {
    if (vo(A instanceof URL), A = new URL(A), A.protocol === "file:" || A.protocol === "about:" || A.protocol === "blank:") return "no-referrer";
    if (A.username = "", A.password = "", A.hash = "", Q) A.pathname = "", A.search = "";
    return A
  }

  function _EA(A) {
    if (!(A instanceof URL)) return !1;
    if (A.href === "about:blank" || A.href === "about:srcdoc") return !0;
    if (A.protocol === "data:") return !0;
    if (A.protocol === "file:") return !0;
    return Q(A.origin);

    function Q(B) {
      if (B == null || B === "null") return !1;
      let G = new URL(B);
      if (G.protocol === "https:" || G.protocol === "wss:") return !0;
      if (/^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(G.hostname) || (G.hostname === "localhost" || G.hostname.includes("localhost.")) || G.hostname.endsWith(".localhost")) return !0;
      return !1
    }
  }

  function ug8(A, Q) {
    if (QlA === void 0) return !0;
    let B = NAB(Q);
    if (B === "no metadata") return !0;
    if (B.length === 0) return !0;
    let G = dg8(B),
      Z = cg8(B, G);
    for (let I of Z) {
      let {
        algo: Y,
        hash: J
      } = I, W = QlA.createHash(Y).update(A).digest("base64");
      if (W[W.length - 1] === "=")
        if (W[W.length - 2] === "=") W = W.slice(0, -2);
        else W = W.slice(0, -1);
      if (pg8(W, J)) return !0
    }
    return !1
  }
  var mg8 = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;

  function NAB(A) {
    let Q = [],
      B = !0;
    for (let G of A.split(" ")) {
      B = !1;
      let Z = mg8.exec(G);
      if (Z === null || Z.groups === void 0 || Z.groups.algo === void 0) continue;
      let I = Z.groups.algo.toLowerCase();
      if (zAB.includes(I)) Q.push(Z.groups)
    }
    if (B === !0) return "no metadata";
    return Q
  }

  function dg8(A) {
    let Q = A[0].algo;
    if (Q[3] === "5") return Q;
    for (let B = 1; B < A.length; ++B) {
      let G = A[B];
      if (G.algo[3] === "5") {
        Q = "sha512";
        break
      } else if (Q[3] === "3") continue;
      else if (G.algo[3] === "3") Q = "sha384"
    }
    return Q
  }

  function cg8(A, Q) {
    if (A.length === 1) return A;
    let B = 0;
    for (let G = 0; G < A.length; ++G)
      if (A[G].algo === Q) A[B++] = A[G];
    return A.length = B, A
  }

  function pg8(A, Q) {
    if (A.length !== Q.length) return !1;
    for (let B = 0; B < A.length; ++B)
      if (A[B] !== Q[B]) {
        if (A[B] === "+" && Q[B] === "-" || A[B] === "/" && Q[B] === "_") continue;
        return !1
      } return !0
  }

  function lg8(A) {}

  function BlA(A, Q) {
    if (A.origin === Q.origin && A.origin === "null") return !0;
    if (A.protocol === Q.protocol && A.hostname === Q.hostname && A.port === Q.port) return !0;
    return !1
  }

  function ig8() {
    let A, Q;
    return {
      promise: new Promise((G, Z) => {
        A = G, Q = Z
      }),
      resolve: A,
      reject: Q
    }
  }

  function ng8(A) {
    return A.controller.state === "aborted"
  }

  function ag8(A) {
    return A.controller.state === "aborted" || A.controller.state === "terminated"
  }

  function sg8(A) {
    return qg8[A.toLowerCase()] ?? A
  }

  function rg8(A) {
    let Q = JSON.stringify(A);
    if (Q === void 0) throw TypeError("Value is not JSON serializable");
    return vo(typeof Q === "string"), Q
  }
  var og8 = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

  function LAB(A, Q, B = 0, G = 1) {
    class Z {
      #A;
      #Q;
      #B;
      constructor(I, Y) {
        this.#A = I, this.#Q = Y, this.#B = 0
      }
      next() {
        if (typeof this !== "object" || this === null || !(#A in this)) throw TypeError(`'next' called on an object that does not implement interface ${A} Iterator.`);
        let I = this.#B,
          Y = this.#A[Q],
          J = Y.length;
        if (I >= J) return {
          value: void 0,
          done: !0
        };
        let {
          [B]: W, [G]: X
        } = Y[I];
        this.#B = I + 1;
        let V;
        switch (this.#Q) {
          case "key":
            V = W;
            break;
          case "value":
            V = X;
            break;
          case "key+value":
            V = [W, X];
            break
        }
        return {
          value: V,
          done: !1
        }
      }
    }
    return delete Z.prototype.constructor, Object.setPrototypeOf(Z.prototype, og8), Object.defineProperties(Z.prototype, {
        [Symbol.toStringTag]: {
          writable: !1,
          enumerable: !1,
          configurable: !0,
          value: `${A} Iterator`
        },
        next: {
          writable: !0,
          enumerable: !0,
          configurable: !0
        }
      }),
      function(I, Y) {
        return new Z(I, Y)
      }
  }

  function tg8(A, Q, B, G = 0, Z = 1) {
    let I = LAB(A, B, G, Z),
      Y = {
        keys: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function() {
            return SEA.brandCheck(this, Q), I(this, "key")
          }
        },
        values: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function() {
            return SEA.brandCheck(this, Q), I(this, "value")
          }
        },
        entries: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function() {
            return SEA.brandCheck(this, Q), I(this, "key+value")
          }
        },
        forEach: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function(W, X = globalThis) {
            if (SEA.brandCheck(this, Q), SEA.argumentLengthCheck(arguments, 1, `${A}.forEach`), typeof W !== "function") throw TypeError(`Failed to execute 'forEach' on '${A}': parameter 1 is not of type 'Function'.`);
            for (let {
                0: V,
                1: F
              }
              of I(this, "key+value")) W.call(X, F, V, this)
          }
        }
      };
    return Object.defineProperties(Q.prototype, {
      ...Y,
      [Symbol.iterator]: {
        writable: !0,
        enumerable: !1,
        configurable: !0,
        value: Y.entries.value
      }
    })
  }
  async function eg8(A, Q, B) {
    let G = Q,
      Z = B,
      I;
    try {
      I = A.stream.getReader()
    } catch (Y) {
      Z(Y);
      return
    }
    try {
      G(await MAB(I))
    } catch (Y) {
      Z(Y)
    }
  }

  function Au8(A) {
    return A instanceof ReadableStream || A[Symbol.toStringTag] === "ReadableStream" && typeof A.tee === "function"
  }

  function Qu8(A) {
    try {
      A.close(), A.byobRequest?.respond(0)
    } catch (Q) {
      if (!Q.message.includes("Controller is already closed") && !Q.message.includes("ReadableStream is already closed")) throw Q
    }
  }
  var Bu8 = /[^\x00-\xFF]/;

  function AlA(A) {
    return vo(!Bu8.test(A)), A
  }
  async function MAB(A) {
    let Q = [],
      B = 0;
    while (!0) {
      let {
        done: G,
        value: Z
      } = await A.read();
      if (G) return Buffer.concat(Q, B);
      if (!Ng8(Z)) throw TypeError("Received non-Uint8Array chunk");
      Q.push(Z), B += Z.length
    }
  }

  function Gu8(A) {
    vo("protocol" in A);
    let Q = A.protocol;
    return Q === "about:" || Q === "blob:" || Q === "data:"
  }

  function hy1(A) {
    return typeof A === "string" && A[5] === ":" && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && A[4] === "s" || A.protocol === "https:"
  }

  function OAB(A) {
    vo("protocol" in A);
    let Q = A.protocol;
    return Q === "http:" || Q === "https:"
  }

  function Zu8(A, Q) {
    let B = A;
    if (!B.startsWith("bytes")) return "failure";
    let G = {
      position: 5
    };
    if (Q) xo((W) => W === "\t" || W === " ", B, G);
    if (B.charCodeAt(G.position) !== 61) return "failure";
    if (G.position++, Q) xo((W) => W === "\t" || W === " ", B, G);
    let Z = xo((W) => {
        let X = W.charCodeAt(0);
        return X >= 48 && X <= 57
      }, B, G),
      I = Z.length ? Number(Z) : null;
    if (Q) xo((W) => W === "\t" || W === " ", B, G);
    if (B.charCodeAt(G.position) !== 45) return "failure";
    if (G.position++, Q) xo((W) => W === "\t" || W === " ", B, G);
    let Y = xo((W) => {
        let X = W.charCodeAt(0);
        return X >= 48 && X <= 57
      }, B, G),
      J = Y.length ? Number(Y) : null;
    if (G.position < B.length) return "failure";
    if (J === null && I === null) return "failure";
    if (I > J) return "failure";
    return {
      rangeStartValue: I,
      rangeEndValue: J
    }
  }

  function Iu8(A, Q, B) {
    let G = "bytes ";
    return G += AlA(`${A}`), G += "-", G += AlA(`${Q}`), G += "/", G += AlA(`${B}`), G
  }
  class RAB extends Fg8 {
    #A;
    constructor(A) {
      super();
      this.#A = A
    }
    _transform(A, Q, B) {
      if (!this._inflateStream) {
        if (A.length === 0) {
          B();
          return
        }
        this._inflateStream = (A[0] & 15) === 8 ? HAB.createInflate(this.#A) : HAB.createInflateRaw(this.#A), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (G) => this.destroy(G))
      }
      this._inflateStream.write(A, Q, B)
    }
    _final(A) {
      if (this._inflateStream) this._inflateStream.end(), this._inflateStream = null;
      A()
    }
  }

  function Yu8(A) {
    return new RAB(A)
  }

  function Ju8(A) {
    let Q = null,
      B = null,
      G = null,
      Z = TAB("content-type", A);
    if (Z === null) return "failure";
    for (let I of Z) {
      let Y = zg8(I);
      if (Y === "failure" || Y.essence === "*/*") continue;
      if (G = Y, G.essence !== B) {
        if (Q = null, G.parameters.has("charset")) Q = G.parameters.get("charset");
        B = G.essence
      } else if (!G.parameters.has("charset") && Q !== null) G.parameters.set("charset", Q)
    }
    if (G == null) return "failure";
    return G
  }

  function Wu8(A) {
    let Q = A,
      B = {
        position: 0
      },
      G = [],
      Z = "";
    while (B.position < Q.length) {
      if (Z += xo((I) => I !== '"' && I !== ",", Q, B), B.position < Q.length)
        if (Q.charCodeAt(B.position) === 34) {
          if (Z += Cg8(Q, B), B.position < Q.length) continue
        } else vo(Q.charCodeAt(B.position) === 44), B.position++;
      Z = Eg8(Z, !0, !0, (I) => I === 9 || I === 32), G.push(Z), Z = ""
    }
    return G
  }

  function TAB(A, Q) {
    let B = Q.get(A, !0);
    if (B === null) return null;
    return Wu8(B)
  }
  var Xu8 = new TextDecoder;

  function Vu8(A) {
    if (A.length === 0) return "";
    if (A[0] === 239 && A[1] === 187 && A[2] === 191) A = A.subarray(3);
    return Xu8.decode(A)
  }
  class PAB {
    get baseUrl() {
      return CAB()
    }
    get origin() {
      return this.baseUrl?.origin
    }
    policyContainer = qAB()
  }
  class jAB {
    settingsObject = new PAB
  }
  var Fu8 = new jAB;
  SAB.exports = {
    isAborted: ng8,
    isCancelled: ag8,
    isValidEncodedURL: $AB,
    createDeferredPromise: ig8,
    ReadableStreamFrom: wg8,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: lg8,
    clampAndCoarsenConnectionTimingInfo: vg8,
    coarsenedSharedCurrentTime: bg8,
    determineRequestsReferrer: gg8,
    makePolicyContainer: qAB,
    clonePolicyContainer: hg8,
    appendFetchMetadata: yg8,
    appendRequestOriginHeader: xg8,
    TAOCheck: kg8,
    corsCheck: _g8,
    crossOriginResourcePolicyCheck: Sg8,
    createOpaqueTimingInfo: fg8,
    setRequestReferrerPolicyOnRedirect: jg8,
    isValidHTTPToken: EAB,
    requestBadPort: Og8,
    requestCurrentURL: kEA,
    responseURL: UAB,
    responseLocationURL: Lg8,
    isBlobLike: $g8,
    isURLPotentiallyTrustworthy: _EA,
    isValidReasonPhrase: Tg8,
    sameOrigin: BlA,
    normalizeMethod: sg8,
    serializeJavascriptValueToJSONString: rg8,
    iteratorMixin: tg8,
    createIterator: LAB,
    isValidHeaderName: Pg8,
    isValidHeaderValue: wAB,
    isErrorLike: Rg8,
    fullyReadBody: eg8,
    bytesMatch: ug8,
    isReadableStreamLike: Au8,
    readableStreamClose: Qu8,
    isomorphicEncode: AlA,
    urlIsLocal: Gu8,
    urlHasHttpsScheme: hy1,
    urlIsHttpHttpsScheme: OAB,
    readAllBytes: MAB,
    simpleRangeHeaderValue: Zu8,
    buildContentRange: Iu8,
    parseMetadata: NAB,
    createInflate: Yu8,
    extractMimeType: Ju8,
    getDecodeSplit: TAB,
    utf8DecodeBytes: Vu8,
    environmentSettingsObject: Fu8
  }
})
// @from(Start 4800415, End 4800618)
Kc = z((FS7, _AB) => {
  _AB.exports = {
    kUrl: Symbol("url"),
    kHeaders: Symbol("headers"),
    kSignal: Symbol("signal"),
    kState: Symbol("state"),
    kDispatcher: Symbol("dispatcher")
  }
})
// @from(Start 4800624, End 4802062)
gy1 = z((KS7, kAB) => {
  var {
    Blob: Ku8,
    File: Du8
  } = UA("node:buffer"), {
    kState: Tb
  } = Kc(), {
    webidl: W_
  } = zD();
  class X_ {
    constructor(A, Q, B = {}) {
      let G = Q,
        Z = B.type,
        I = B.lastModified ?? Date.now();
      this[Tb] = {
        blobLike: A,
        name: G,
        type: Z,
        lastModified: I
      }
    }
    stream(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.stream(...A)
    }
    arrayBuffer(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.arrayBuffer(...A)
    }
    slice(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.slice(...A)
    }
    text(...A) {
      return W_.brandCheck(this, X_), this[Tb].blobLike.text(...A)
    }
    get size() {
      return W_.brandCheck(this, X_), this[Tb].blobLike.size
    }
    get type() {
      return W_.brandCheck(this, X_), this[Tb].blobLike.type
    }
    get name() {
      return W_.brandCheck(this, X_), this[Tb].name
    }
    get lastModified() {
      return W_.brandCheck(this, X_), this[Tb].lastModified
    }
    get[Symbol.toStringTag]() {
      return "File"
    }
  }
  W_.converters.Blob = W_.interfaceConverter(Ku8);

  function Hu8(A) {
    return A instanceof Du8 || A && (typeof A.stream === "function" || typeof A.arrayBuffer === "function") && A[Symbol.toStringTag] === "File"
  }
  kAB.exports = {
    FileLike: X_,
    isFileLike: Hu8
  }
})
// @from(Start 4802068, End 4806219)
yEA = z((DS7, fAB) => {
  var {
    isBlobLike: GlA,
    iteratorMixin: Cu8
  } = xw(), {
    kState: oC
  } = Kc(), {
    kEnumerableProperty: e5A
  } = S6(), {
    FileLike: yAB,
    isFileLike: Eu8
  } = gy1(), {
    webidl: yZ
  } = zD(), {
    File: bAB
  } = UA("node:buffer"), xAB = UA("node:util"), vAB = globalThis.File ?? bAB;
  class V_ {
    constructor(A) {
      if (yZ.util.markAsUncloneable(this), A !== void 0) throw yZ.errors.conversionFailed({
        prefix: "FormData constructor",
        argument: "Argument 1",
        types: ["undefined"]
      });
      this[oC] = []
    }
    append(A, Q, B = void 0) {
      yZ.brandCheck(this, V_);
      let G = "FormData.append";
      if (yZ.argumentLengthCheck(arguments, 2, G), arguments.length === 3 && !GlA(Q)) throw TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");
      A = yZ.converters.USVString(A, G, "name"), Q = GlA(Q) ? yZ.converters.Blob(Q, G, "value", {
        strict: !1
      }) : yZ.converters.USVString(Q, G, "value"), B = arguments.length === 3 ? yZ.converters.USVString(B, G, "filename") : void 0;
      let Z = uy1(A, Q, B);
      this[oC].push(Z)
    }
    delete(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.delete";
      yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name"), this[oC] = this[oC].filter((B) => B.name !== A)
    }
    get(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.get";
      yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name");
      let B = this[oC].findIndex((G) => G.name === A);
      if (B === -1) return null;
      return this[oC][B].value
    }
    getAll(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.getAll";
      return yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name"), this[oC].filter((B) => B.name === A).map((B) => B.value)
    }
    has(A) {
      yZ.brandCheck(this, V_);
      let Q = "FormData.has";
      return yZ.argumentLengthCheck(arguments, 1, Q), A = yZ.converters.USVString(A, Q, "name"), this[oC].findIndex((B) => B.name === A) !== -1
    }
    set(A, Q, B = void 0) {
      yZ.brandCheck(this, V_);
      let G = "FormData.set";
      if (yZ.argumentLengthCheck(arguments, 2, G), arguments.length === 3 && !GlA(Q)) throw TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");
      A = yZ.converters.USVString(A, G, "name"), Q = GlA(Q) ? yZ.converters.Blob(Q, G, "name", {
        strict: !1
      }) : yZ.converters.USVString(Q, G, "name"), B = arguments.length === 3 ? yZ.converters.USVString(B, G, "name") : void 0;
      let Z = uy1(A, Q, B),
        I = this[oC].findIndex((Y) => Y.name === A);
      if (I !== -1) this[oC] = [...this[oC].slice(0, I), Z, ...this[oC].slice(I + 1).filter((Y) => Y.name !== A)];
      else this[oC].push(Z)
    } [xAB.inspect.custom](A, Q) {
      let B = this[oC].reduce((Z, I) => {
        if (Z[I.name])
          if (Array.isArray(Z[I.name])) Z[I.name].push(I.value);
          else Z[I.name] = [Z[I.name], I.value];
        else Z[I.name] = I.value;
        return Z
      }, {
        __proto__: null
      });
      Q.depth ??= A, Q.colors ??= !0;
      let G = xAB.formatWithOptions(Q, B);
      return `FormData ${G.slice(G.indexOf("]")+2)}`
    }
  }
  Cu8("FormData", V_, oC, "name", "value");
  Object.defineProperties(V_.prototype, {
    append: e5A,
    delete: e5A,
    get: e5A,
    getAll: e5A,
    has: e5A,
    set: e5A,
    [Symbol.toStringTag]: {
      value: "FormData",
      configurable: !0
    }
  });

  function uy1(A, Q, B) {
    if (typeof Q === "string");
    else {
      if (!Eu8(Q)) Q = Q instanceof Blob ? new vAB([Q], "blob", {
        type: Q.type
      }) : new yAB(Q, "blob", {
        type: Q.type
      });
      if (B !== void 0) {
        let G = {
          type: Q.type,
          lastModified: Q.lastModified
        };
        Q = Q instanceof bAB ? new vAB([Q], B, G) : new yAB(Q, B, G)
      }
    }
    return {
      name: A,
      value: Q
    }
  }
  fAB.exports = {
    FormData: V_,
    makeEntry: uy1
  }
})
// @from(Start 4806225, End 4811459)
cAB = z((HS7, dAB) => {
  var {
    isUSVString: hAB,
    bufferToLowerCasedHeaderName: zu8
  } = S6(), {
    utf8DecodeBytes: Uu8
  } = xw(), {
    HTTP_TOKEN_CODEPOINTS: $u8,
    isomorphicDecode: gAB
  } = QU(), {
    isFileLike: wu8
  } = gy1(), {
    makeEntry: qu8
  } = yEA(), ZlA = UA("node:assert"), {
    File: Nu8
  } = UA("node:buffer"), Lu8 = globalThis.File ?? Nu8, Mu8 = Buffer.from('form-data; name="'), uAB = Buffer.from("; filename"), Ou8 = Buffer.from("--"), Ru8 = Buffer.from(`--\r
`);

  function Tu8(A) {
    for (let Q = 0; Q < A.length; ++Q)
      if ((A.charCodeAt(Q) & -128) !== 0) return !1;
    return !0
  }

  function Pu8(A) {
    let Q = A.length;
    if (Q < 27 || Q > 70) return !1;
    for (let B = 0; B < Q; ++B) {
      let G = A.charCodeAt(B);
      if (!(G >= 48 && G <= 57 || G >= 65 && G <= 90 || G >= 97 && G <= 122 || G === 39 || G === 45 || G === 95)) return !1
    }
    return !0
  }

  function ju8(A, Q) {
    ZlA(Q !== "failure" && Q.essence === "multipart/form-data");
    let B = Q.parameters.get("boundary");
    if (B === void 0) return "failure";
    let G = Buffer.from(`--${B}`, "utf8"),
      Z = [],
      I = {
        position: 0
      };
    while (A[I.position] === 13 && A[I.position + 1] === 10) I.position += 2;
    let Y = A.length;
    while (A[Y - 1] === 10 && A[Y - 2] === 13) Y -= 2;
    if (Y !== A.length) A = A.subarray(0, Y);
    while (!0) {
      if (A.subarray(I.position, I.position + G.length).equals(G)) I.position += G.length;
      else return "failure";
      if (I.position === A.length - 2 && IlA(A, Ou8, I) || I.position === A.length - 4 && IlA(A, Ru8, I)) return Z;
      if (A[I.position] !== 13 || A[I.position + 1] !== 10) return "failure";
      I.position += 2;
      let J = Su8(A, I);
      if (J === "failure") return "failure";
      let {
        name: W,
        filename: X,
        contentType: V,
        encoding: F
      } = J;
      I.position += 2;
      let K;
      {
        let H = A.indexOf(G.subarray(2), I.position);
        if (H === -1) return "failure";
        if (K = A.subarray(I.position, H - 4), I.position += K.length, F === "base64") K = Buffer.from(K.toString(), "base64")
      }
      if (A[I.position] !== 13 || A[I.position + 1] !== 10) return "failure";
      else I.position += 2;
      let D;
      if (X !== null) {
        if (V ??= "text/plain", !Tu8(V)) V = "";
        D = new Lu8([K], X, {
          type: V
        })
      } else D = Uu8(Buffer.from(K));
      ZlA(hAB(W)), ZlA(typeof D === "string" && hAB(D) || wu8(D)), Z.push(qu8(W, D, X))
    }
  }

  function Su8(A, Q) {
    let B = null,
      G = null,
      Z = null,
      I = null;
    while (!0) {
      if (A[Q.position] === 13 && A[Q.position + 1] === 10) {
        if (B === null) return "failure";
        return {
          name: B,
          filename: G,
          contentType: Z,
          encoding: I
        }
      }
      let Y = A3A((J) => J !== 10 && J !== 13 && J !== 58, A, Q);
      if (Y = my1(Y, !0, !0, (J) => J === 9 || J === 32), !$u8.test(Y.toString())) return "failure";
      if (A[Q.position] !== 58) return "failure";
      switch (Q.position++, A3A((J) => J === 32 || J === 9, A, Q), zu8(Y)) {
        case "content-disposition": {
          if (B = G = null, !IlA(A, Mu8, Q)) return "failure";
          if (Q.position += 17, B = mAB(A, Q), B === null) return "failure";
          if (IlA(A, uAB, Q)) {
            let J = Q.position + uAB.length;
            if (A[J] === 42) Q.position += 1, J += 1;
            if (A[J] !== 61 || A[J + 1] !== 34) return "failure";
            if (Q.position += 12, G = mAB(A, Q), G === null) return "failure"
          }
          break
        }
        case "content-type": {
          let J = A3A((W) => W !== 10 && W !== 13, A, Q);
          J = my1(J, !1, !0, (W) => W === 9 || W === 32), Z = gAB(J);
          break
        }
        case "content-transfer-encoding": {
          let J = A3A((W) => W !== 10 && W !== 13, A, Q);
          J = my1(J, !1, !0, (W) => W === 9 || W === 32), I = gAB(J);
          break
        }
        default:
          A3A((J) => J !== 10 && J !== 13, A, Q)
      }
      if (A[Q.position] !== 13 && A[Q.position + 1] !== 10) return "failure";
      else Q.position += 2
    }
  }

  function mAB(A, Q) {
    ZlA(A[Q.position - 1] === 34);
    let B = A3A((G) => G !== 10 && G !== 13 && G !== 34, A, Q);
    if (A[Q.position] !== 34) return null;
    else Q.position++;
    return B = new TextDecoder().decode(B).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), B
  }

  function A3A(A, Q, B) {
    let G = B.position;
    while (G < Q.length && A(Q[G])) ++G;
    return Q.subarray(B.position, B.position = G)
  }

  function my1(A, Q, B, G) {
    let Z = 0,
      I = A.length - 1;
    if (Q)
      while (Z < A.length && G(A[Z])) Z++;
    if (B)
      while (I > 0 && G(A[I])) I--;
    return Z === 0 && I === A.length - 1 ? A : A.subarray(Z, I + 1)
  }

  function IlA(A, Q, B) {
    if (A.length < Q.length) return !1;
    for (let G = 0; G < Q.length; G++)
      if (Q[G] !== A[B.position + G]) return !1;
    return !0
  }
  dAB.exports = {
    multipartFormDataParser: ju8,
    validateBoundary: Pu8
  }
})
// @from(Start 4811465, End 4818772)
G3A = z((CS7, oAB) => {
  var xEA = S6(),
    {
      ReadableStreamFrom: _u8,
      isBlobLike: pAB,
      isReadableStreamLike: ku8,
      readableStreamClose: yu8,
      createDeferredPromise: xu8,
      fullyReadBody: vu8,
      extractMimeType: bu8,
      utf8DecodeBytes: nAB
    } = xw(),
    {
      FormData: lAB
    } = yEA(),
    {
      kState: B3A
    } = Kc(),
    {
      webidl: fu8
    } = zD(),
    {
      Blob: hu8
    } = UA("node:buffer"),
    dy1 = UA("node:assert"),
    {
      isErrored: aAB,
      isDisturbed: gu8
    } = UA("node:stream"),
    {
      isArrayBuffer: uu8
    } = UA("node:util/types"),
    {
      serializeAMimeType: mu8
    } = QU(),
    {
      multipartFormDataParser: du8
    } = cAB(),
    cy1;
  try {
    let A = UA("node:crypto");
    cy1 = (Q) => A.randomInt(0, Q)
  } catch {
    cy1 = (A) => Math.floor(Math.random(A))
  }
  var YlA = new TextEncoder;

  function cu8() {}
  var py1 = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0,
    ly1;
  if (py1) ly1 = new FinalizationRegistry((A) => {
    let Q = A.deref();
    if (Q && !Q.locked && !gu8(Q) && !aAB(Q)) Q.cancel("Response object has been garbage collected").catch(cu8)
  });

  function sAB(A, Q = !1) {
    let B = null;
    if (A instanceof ReadableStream) B = A;
    else if (pAB(A)) B = A.stream();
    else B = new ReadableStream({
      async pull(W) {
        let X = typeof Z === "string" ? YlA.encode(Z) : Z;
        if (X.byteLength) W.enqueue(X);
        queueMicrotask(() => yu8(W))
      },
      start() {},
      type: "bytes"
    });
    dy1(ku8(B));
    let G = null,
      Z = null,
      I = null,
      Y = null;
    if (typeof A === "string") Z = A, Y = "text/plain;charset=UTF-8";
    else if (A instanceof URLSearchParams) Z = A.toString(), Y = "application/x-www-form-urlencoded;charset=UTF-8";
    else if (uu8(A)) Z = new Uint8Array(A.slice());
    else if (ArrayBuffer.isView(A)) Z = new Uint8Array(A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength));
    else if (xEA.isFormDataLike(A)) {
      let W = `----formdata-undici-0${`${cy1(100000000000)}`.padStart(11,"0")}`,
        X = `--${W}\r
Content-Disposition: form-data`; /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
      let V = (E) => E.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
        F = (E) => E.replace(/\r?\n|\r/g, `\r
`),
        K = [],
        D = new Uint8Array([13, 10]);
      I = 0;
      let H = !1;
      for (let [E, U] of A)
        if (typeof U === "string") {
          let q = YlA.encode(X + `; name="${V(F(E))}"\r
\r
${F(U)}\r
`);
          K.push(q), I += q.byteLength
        } else {
          let q = YlA.encode(`${X}; name="${V(F(E))}"` + (U.name ? `; filename="${V(U.name)}"` : "") + `\r
Content-Type: ${U.type||"application/octet-stream"}\r
\r
`);
          if (K.push(q, U, D), typeof U.size === "number") I += q.byteLength + U.size + D.byteLength;
          else H = !0
        } let C = YlA.encode(`--${W}--`);
      if (K.push(C), I += C.byteLength, H) I = null;
      Z = A, G = async function*() {
        for (let E of K)
          if (E.stream) yield* E.stream();
          else yield E
      }, Y = `multipart/form-data; boundary=${W}`
    } else if (pAB(A)) {
      if (Z = A, I = A.size, A.type) Y = A.type
    } else if (typeof A[Symbol.asyncIterator] === "function") {
      if (Q) throw TypeError("keepalive");
      if (xEA.isDisturbed(A) || A.locked) throw TypeError("Response body object should not be disturbed or locked");
      B = A instanceof ReadableStream ? A : _u8(A)
    }
    if (typeof Z === "string" || xEA.isBuffer(Z)) I = Buffer.byteLength(Z);
    if (G != null) {
      let W;
      B = new ReadableStream({
        async start() {
          W = G(A)[Symbol.asyncIterator]()
        },
        async pull(X) {
          let {
            value: V,
            done: F
          } = await W.next();
          if (F) queueMicrotask(() => {
            X.close(), X.byobRequest?.respond(0)
          });
          else if (!aAB(B)) {
            let K = new Uint8Array(V);
            if (K.byteLength) X.enqueue(K)
          }
          return X.desiredSize > 0
        },
        async cancel(X) {
          await W.return()
        },
        type: "bytes"
      })
    }
    return [{
      stream: B,
      source: Z,
      length: I
    }, Y]
  }

  function pu8(A, Q = !1) {
    if (A instanceof ReadableStream) dy1(!xEA.isDisturbed(A), "The body has already been consumed."), dy1(!A.locked, "The stream is locked.");
    return sAB(A, Q)
  }

  function lu8(A, Q) {
    let [B, G] = Q.stream.tee();
    if (py1) ly1.register(A, new WeakRef(B));
    return Q.stream = B, {
      stream: G,
      length: Q.length,
      source: Q.source
    }
  }

  function iu8(A) {
    if (A.aborted) throw new DOMException("The operation was aborted.", "AbortError")
  }

  function nu8(A) {
    return {
      blob() {
        return Q3A(this, (B) => {
          let G = iAB(this);
          if (G === null) G = "";
          else if (G) G = mu8(G);
          return new hu8([B], {
            type: G
          })
        }, A)
      },
      arrayBuffer() {
        return Q3A(this, (B) => {
          return new Uint8Array(B).buffer
        }, A)
      },
      text() {
        return Q3A(this, nAB, A)
      },
      json() {
        return Q3A(this, su8, A)
      },
      formData() {
        return Q3A(this, (B) => {
          let G = iAB(this);
          if (G !== null) switch (G.essence) {
            case "multipart/form-data": {
              let Z = du8(B, G);
              if (Z === "failure") throw TypeError("Failed to parse body as FormData.");
              let I = new lAB;
              return I[B3A] = Z, I
            }
            case "application/x-www-form-urlencoded": {
              let Z = new URLSearchParams(B.toString()),
                I = new lAB;
              for (let [Y, J] of Z) I.append(Y, J);
              return I
            }
          }
          throw TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')
        }, A)
      },
      bytes() {
        return Q3A(this, (B) => {
          return new Uint8Array(B)
        }, A)
      }
    }
  }

  function au8(A) {
    Object.assign(A.prototype, nu8(A))
  }
  async function Q3A(A, Q, B) {
    if (fu8.brandCheck(A, B), rAB(A)) throw TypeError("Body is unusable: Body has already been read");
    iu8(A[B3A]);
    let G = xu8(),
      Z = (Y) => G.reject(Y),
      I = (Y) => {
        try {
          G.resolve(Q(Y))
        } catch (J) {
          Z(J)
        }
      };
    if (A[B3A].body == null) return I(Buffer.allocUnsafe(0)), G.promise;
    return await vu8(A[B3A].body, I, Z), G.promise
  }

  function rAB(A) {
    let Q = A[B3A].body;
    return Q != null && (Q.stream.locked || xEA.isDisturbed(Q.stream))
  }

  function su8(A) {
    return JSON.parse(nAB(A))
  }

  function iAB(A) {
    let Q = A[B3A].headersList,
      B = bu8(Q);
    if (B === "failure") return null;
    return B
  }
  oAB.exports = {
    extractBody: sAB,
    safelyExtractBody: pu8,
    cloneBody: lu8,
    mixinBody: au8,
    streamRegistry: ly1,
    hasFinalizationRegistry: py1,
    bodyUnusable: rAB
  }
})
// @from(Start 4818778, End 4841781)
X1B = z((ES7, W1B) => {
  var J4 = UA("node:assert"),
    a4 = S6(),
    {
      channels: tAB
    } = p5A(),
    iy1 = Ry1(),
    {
      RequestContentLengthMismatchError: bo,
      ResponseContentLengthMismatchError: ru8,
      RequestAbortedError: Z1B,
      HeadersTimeoutError: ou8,
      HeadersOverflowError: tu8,
      SocketError: KlA,
      InformationalError: Z3A,
      BodyTimeoutError: eu8,
      HTTPParserError: Am8,
      ResponseExceededMaxSizeError: Qm8
    } = R7(),
    {
      kUrl: I1B,
      kReset: BU,
      kClient: ry1,
      kParser: OJ,
      kBlocking: fEA,
      kRunning: SH,
      kPending: Bm8,
      kSize: eAB,
      kWriting: Hc,
      kQueue: QT,
      kNoRef: vEA,
      kKeepAliveDefaultTimeout: Gm8,
      kHostHeader: Zm8,
      kPendingIdx: Im8,
      kRunningIdx: sL,
      kError: rL,
      kPipelining: VlA,
      kSocket: I3A,
      kKeepAliveTimeoutValue: DlA,
      kMaxHeadersSize: ny1,
      kKeepAliveMaxTimeout: Ym8,
      kKeepAliveTimeoutThreshold: Jm8,
      kHeadersTimeout: Wm8,
      kBodyTimeout: Xm8,
      kStrictContentLength: oy1,
      kMaxRequests: A1B,
      kCounter: Vm8,
      kMaxResponseSize: Fm8,
      kOnError: Km8,
      kResume: Dc,
      kHTTPContext: Y1B
    } = tI(),
    F_ = neQ(),
    Dm8 = Buffer.alloc(0),
    JlA = Buffer[Symbol.species],
    WlA = a4.addListener,
    Hm8 = a4.removeAllListeners,
    ay1;
  async function Cm8() {
    let A = process.env.JEST_WORKER_ID ? ky1() : void 0,
      Q;
    try {
      Q = await WebAssembly.compile(reQ())
    } catch (B) {
      Q = await WebAssembly.compile(A || ky1())
    }
    return await WebAssembly.instantiate(Q, {
      env: {
        wasm_on_url: (B, G, Z) => {
          return 0
        },
        wasm_on_status: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onStatus(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_message_begin: (B) => {
          return J4(RV.ptr === B), RV.onMessageBegin() || 0
        },
        wasm_on_header_field: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onHeaderField(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_header_value: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onHeaderValue(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_headers_complete: (B, G, Z, I) => {
          return J4(RV.ptr === B), RV.onHeadersComplete(G, Boolean(Z), Boolean(I)) || 0
        },
        wasm_on_body: (B, G, Z) => {
          J4(RV.ptr === B);
          let I = G - D_ + K_.byteOffset;
          return RV.onBody(new JlA(K_.buffer, I, Z)) || 0
        },
        wasm_on_message_complete: (B) => {
          return J4(RV.ptr === B), RV.onMessageComplete() || 0
        }
      }
    })
  }
  var sy1 = null,
    ty1 = Cm8();
  ty1.catch();
  var RV = null,
    K_ = null,
    XlA = 0,
    D_ = null,
    Em8 = 0,
    bEA = 1,
    Y3A = 2 | bEA,
    FlA = 4 | bEA,
    ey1 = 8 | Em8;
  class J1B {
    constructor(A, Q, {
      exports: B
    }) {
      J4(Number.isFinite(A[ny1]) && A[ny1] > 0), this.llhttp = B, this.ptr = this.llhttp.llhttp_alloc(F_.TYPE.RESPONSE), this.client = A, this.socket = Q, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = A[ny1], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = A[Fm8]
    }
    setTimeout(A, Q) {
      if (A !== this.timeoutValue || Q & bEA ^ this.timeoutType & bEA) {
        if (this.timeout) iy1.clearTimeout(this.timeout), this.timeout = null;
        if (A)
          if (Q & bEA) this.timeout = iy1.setFastTimeout(Q1B, A, new WeakRef(this));
          else this.timeout = setTimeout(Q1B, A, new WeakRef(this)), this.timeout.unref();
        this.timeoutValue = A
      } else if (this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      this.timeoutType = Q
    }
    resume() {
      if (this.socket.destroyed || !this.paused) return;
      if (J4(this.ptr != null), J4(RV == null), this.llhttp.llhttp_resume(this.ptr), J4(this.timeoutType === FlA), this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      this.paused = !1, this.execute(this.socket.read() || Dm8), this.readMore()
    }
    readMore() {
      while (!this.paused && this.ptr) {
        let A = this.socket.read();
        if (A === null) break;
        this.execute(A)
      }
    }
    execute(A) {
      J4(this.ptr != null), J4(RV == null), J4(!this.paused);
      let {
        socket: Q,
        llhttp: B
      } = this;
      if (A.length > XlA) {
        if (D_) B.free(D_);
        XlA = Math.ceil(A.length / 4096) * 4096, D_ = B.malloc(XlA)
      }
      new Uint8Array(B.memory.buffer, D_, XlA).set(A);
      try {
        let G;
        try {
          K_ = A, RV = this, G = B.llhttp_execute(this.ptr, D_, A.length)
        } catch (I) {
          throw I
        } finally {
          RV = null, K_ = null
        }
        let Z = B.llhttp_get_error_pos(this.ptr) - D_;
        if (G === F_.ERROR.PAUSED_UPGRADE) this.onUpgrade(A.slice(Z));
        else if (G === F_.ERROR.PAUSED) this.paused = !0, Q.unshift(A.slice(Z));
        else if (G !== F_.ERROR.OK) {
          let I = B.llhttp_get_error_reason(this.ptr),
            Y = "";
          if (I) {
            let J = new Uint8Array(B.memory.buffer, I).indexOf(0);
            Y = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(B.memory.buffer, I, J).toString() + ")"
          }
          throw new Am8(Y, F_.ERROR[G], A.slice(Z))
        }
      } catch (G) {
        a4.destroy(Q, G)
      }
    }
    destroy() {
      J4(this.ptr != null), J4(RV == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && iy1.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1
    }
    onStatus(A) {
      this.statusText = A.toString()
    }
    onMessageBegin() {
      let {
        socket: A,
        client: Q
      } = this;
      if (A.destroyed) return -1;
      let B = Q[QT][Q[sL]];
      if (!B) return -1;
      B.onResponseStarted()
    }
    onHeaderField(A) {
      let Q = this.headers.length;
      if ((Q & 1) === 0) this.headers.push(A);
      else this.headers[Q - 1] = Buffer.concat([this.headers[Q - 1], A]);
      this.trackHeader(A.length)
    }
    onHeaderValue(A) {
      let Q = this.headers.length;
      if ((Q & 1) === 1) this.headers.push(A), Q += 1;
      else this.headers[Q - 1] = Buffer.concat([this.headers[Q - 1], A]);
      let B = this.headers[Q - 2];
      if (B.length === 10) {
        let G = a4.bufferToLowerCasedHeaderName(B);
        if (G === "keep-alive") this.keepAlive += A.toString();
        else if (G === "connection") this.connection += A.toString()
      } else if (B.length === 14 && a4.bufferToLowerCasedHeaderName(B) === "content-length") this.contentLength += A.toString();
      this.trackHeader(A.length)
    }
    trackHeader(A) {
      if (this.headersSize += A, this.headersSize >= this.headersMaxSize) a4.destroy(this.socket, new tu8)
    }
    onUpgrade(A) {
      let {
        upgrade: Q,
        client: B,
        socket: G,
        headers: Z,
        statusCode: I
      } = this;
      J4(Q), J4(B[I3A] === G), J4(!G.destroyed), J4(!this.paused), J4((Z.length & 1) === 0);
      let Y = B[QT][B[sL]];
      J4(Y), J4(Y.upgrade || Y.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, G.unshift(A), G[OJ].destroy(), G[OJ] = null, G[ry1] = null, G[rL] = null, Hm8(G), B[I3A] = null, B[Y1B] = null, B[QT][B[sL]++] = null, B.emit("disconnect", B[I1B], [B], new Z3A("upgrade"));
      try {
        Y.onUpgrade(I, Z, G)
      } catch (J) {
        a4.destroy(G, J)
      }
      B[Dc]()
    }
    onHeadersComplete(A, Q, B) {
      let {
        client: G,
        socket: Z,
        headers: I,
        statusText: Y
      } = this;
      if (Z.destroyed) return -1;
      let J = G[QT][G[sL]];
      if (!J) return -1;
      if (J4(!this.upgrade), J4(this.statusCode < 200), A === 100) return a4.destroy(Z, new KlA("bad response", a4.getSocketInfo(Z))), -1;
      if (Q && !J.upgrade) return a4.destroy(Z, new KlA("bad upgrade", a4.getSocketInfo(Z))), -1;
      if (J4(this.timeoutType === Y3A), this.statusCode = A, this.shouldKeepAlive = B || J.method === "HEAD" && !Z[BU] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
        let X = J.bodyTimeout != null ? J.bodyTimeout : G[Xm8];
        this.setTimeout(X, FlA)
      } else if (this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      if (J.method === "CONNECT") return J4(G[SH] === 1), this.upgrade = !0, 2;
      if (Q) return J4(G[SH] === 1), this.upgrade = !0, 2;
      if (J4((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && G[VlA]) {
        let X = this.keepAlive ? a4.parseKeepAliveTimeout(this.keepAlive) : null;
        if (X != null) {
          let V = Math.min(X - G[Jm8], G[Ym8]);
          if (V <= 0) Z[BU] = !0;
          else G[DlA] = V
        } else G[DlA] = G[Gm8]
      } else Z[BU] = !0;
      let W = J.onHeaders(A, I, this.resume, Y) === !1;
      if (J.aborted) return -1;
      if (J.method === "HEAD") return 1;
      if (A < 200) return 1;
      if (Z[fEA]) Z[fEA] = !1, G[Dc]();
      return W ? F_.ERROR.PAUSED : 0
    }
    onBody(A) {
      let {
        client: Q,
        socket: B,
        statusCode: G,
        maxResponseSize: Z
      } = this;
      if (B.destroyed) return -1;
      let I = Q[QT][Q[sL]];
      if (J4(I), J4(this.timeoutType === FlA), this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      if (J4(G >= 200), Z > -1 && this.bytesRead + A.length > Z) return a4.destroy(B, new Qm8), -1;
      if (this.bytesRead += A.length, I.onData(A) === !1) return F_.ERROR.PAUSED
    }
    onMessageComplete() {
      let {
        client: A,
        socket: Q,
        statusCode: B,
        upgrade: G,
        headers: Z,
        contentLength: I,
        bytesRead: Y,
        shouldKeepAlive: J
      } = this;
      if (Q.destroyed && (!B || J)) return -1;
      if (G) return;
      J4(B >= 100), J4((this.headers.length & 1) === 0);
      let W = A[QT][A[sL]];
      if (J4(W), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, B < 200) return;
      if (W.method !== "HEAD" && I && Y !== parseInt(I, 10)) return a4.destroy(Q, new ru8), -1;
      if (W.onComplete(Z), A[QT][A[sL]++] = null, Q[Hc]) return J4(A[SH] === 0), a4.destroy(Q, new Z3A("reset")), F_.ERROR.PAUSED;
      else if (!J) return a4.destroy(Q, new Z3A("reset")), F_.ERROR.PAUSED;
      else if (Q[BU] && A[SH] === 0) return a4.destroy(Q, new Z3A("reset")), F_.ERROR.PAUSED;
      else if (A[VlA] == null || A[VlA] === 1) setImmediate(() => A[Dc]());
      else A[Dc]()
    }
  }

  function Q1B(A) {
    let {
      socket: Q,
      timeoutType: B,
      client: G,
      paused: Z
    } = A.deref();
    if (B === Y3A) {
      if (!Q[Hc] || Q.writableNeedDrain || G[SH] > 1) J4(!Z, "cannot be paused while waiting for headers"), a4.destroy(Q, new ou8)
    } else if (B === FlA) {
      if (!Z) a4.destroy(Q, new eu8)
    } else if (B === ey1) J4(G[SH] === 0 && G[DlA]), a4.destroy(Q, new Z3A("socket idle timeout"))
  }
  async function zm8(A, Q) {
    if (A[I3A] = Q, !sy1) sy1 = await ty1, ty1 = null;
    Q[vEA] = !1, Q[Hc] = !1, Q[BU] = !1, Q[fEA] = !1, Q[OJ] = new J1B(A, Q, sy1), WlA(Q, "error", function(G) {
      J4(G.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      let Z = this[OJ];
      if (G.code === "ECONNRESET" && Z.statusCode && !Z.shouldKeepAlive) {
        Z.onMessageComplete();
        return
      }
      this[rL] = G, this[ry1][Km8](G)
    }), WlA(Q, "readable", function() {
      let G = this[OJ];
      if (G) G.readMore()
    }), WlA(Q, "end", function() {
      let G = this[OJ];
      if (G.statusCode && !G.shouldKeepAlive) {
        G.onMessageComplete();
        return
      }
      a4.destroy(this, new KlA("other side closed", a4.getSocketInfo(this)))
    }), WlA(Q, "close", function() {
      let G = this[ry1],
        Z = this[OJ];
      if (Z) {
        if (!this[rL] && Z.statusCode && !Z.shouldKeepAlive) Z.onMessageComplete();
        this[OJ].destroy(), this[OJ] = null
      }
      let I = this[rL] || new KlA("closed", a4.getSocketInfo(this));
      if (G[I3A] = null, G[Y1B] = null, G.destroyed) {
        J4(G[Bm8] === 0);
        let Y = G[QT].splice(G[sL]);
        for (let J = 0; J < Y.length; J++) {
          let W = Y[J];
          a4.errorRequest(G, W, I)
        }
      } else if (G[SH] > 0 && I.code !== "UND_ERR_INFO") {
        let Y = G[QT][G[sL]];
        G[QT][G[sL]++] = null, a4.errorRequest(G, Y, I)
      }
      G[Im8] = G[sL], J4(G[SH] === 0), G.emit("disconnect", G[I1B], [G], I), G[Dc]()
    });
    let B = !1;
    return Q.on("close", () => {
      B = !0
    }), {
      version: "h1",
      defaultPipelining: 1,
      write(...G) {
        return wm8(A, ...G)
      },
      resume() {
        Um8(A)
      },
      destroy(G, Z) {
        if (B) queueMicrotask(Z);
        else Q.destroy(G).on("close", Z)
      },
      get destroyed() {
        return Q.destroyed
      },
      busy(G) {
        if (Q[Hc] || Q[BU] || Q[fEA]) return !0;
        if (G) {
          if (A[SH] > 0 && !G.idempotent) return !0;
          if (A[SH] > 0 && (G.upgrade || G.method === "CONNECT")) return !0;
          if (A[SH] > 0 && a4.bodyLength(G.body) !== 0 && (a4.isStream(G.body) || a4.isAsyncIterable(G.body) || a4.isFormDataLike(G.body))) return !0
        }
        return !1
      }
    }
  }

  function Um8(A) {
    let Q = A[I3A];
    if (Q && !Q.destroyed) {
      if (A[eAB] === 0) {
        if (!Q[vEA] && Q.unref) Q.unref(), Q[vEA] = !0
      } else if (Q[vEA] && Q.ref) Q.ref(), Q[vEA] = !1;
      if (A[eAB] === 0) {
        if (Q[OJ].timeoutType !== ey1) Q[OJ].setTimeout(A[DlA], ey1)
      } else if (A[SH] > 0 && Q[OJ].statusCode < 200) {
        if (Q[OJ].timeoutType !== Y3A) {
          let B = A[QT][A[sL]],
            G = B.headersTimeout != null ? B.headersTimeout : A[Wm8];
          Q[OJ].setTimeout(G, Y3A)
        }
      }
    }
  }

  function $m8(A) {
    return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
  }

  function wm8(A, Q) {
    let {
      method: B,
      path: G,
      host: Z,
      upgrade: I,
      blocking: Y,
      reset: J
    } = Q, {
      body: W,
      headers: X,
      contentLength: V
    } = Q, F = B === "PUT" || B === "POST" || B === "PATCH" || B === "QUERY" || B === "PROPFIND" || B === "PROPPATCH";
    if (a4.isFormDataLike(W)) {
      if (!ay1) ay1 = G3A().extractBody;
      let [E, U] = ay1(W);
      if (Q.contentType == null) X.push("content-type", U);
      W = E.stream, V = E.length
    } else if (a4.isBlobLike(W) && Q.contentType == null && W.type) X.push("content-type", W.type);
    if (W && typeof W.read === "function") W.read(0);
    let K = a4.bodyLength(W);
    if (V = K ?? V, V === null) V = Q.contentLength;
    if (V === 0 && !F) V = null;
    if ($m8(B) && V > 0 && Q.contentLength !== null && Q.contentLength !== V) {
      if (A[oy1]) return a4.errorRequest(A, Q, new bo), !1;
      process.emitWarning(new bo)
    }
    let D = A[I3A],
      H = (E) => {
        if (Q.aborted || Q.completed) return;
        a4.errorRequest(A, Q, E || new Z1B), a4.destroy(W), a4.destroy(D, new Z3A("aborted"))
      };
    try {
      Q.onConnect(H)
    } catch (E) {
      a4.errorRequest(A, Q, E)
    }
    if (Q.aborted) return !1;
    if (B === "HEAD") D[BU] = !0;
    if (I || B === "CONNECT") D[BU] = !0;
    if (J != null) D[BU] = J;
    if (A[A1B] && D[Vm8]++ >= A[A1B]) D[BU] = !0;
    if (Y) D[fEA] = !0;
    let C = `${B} ${G} HTTP/1.1\r
`;
    if (typeof Z === "string") C += `host: ${Z}\r
`;
    else C += A[Zm8];
    if (I) C += `connection: upgrade\r
upgrade: ${I}\r
`;
    else if (A[VlA] && !D[BU]) C += `connection: keep-alive\r
`;
    else C += `connection: close\r
`;
    if (Array.isArray(X))
      for (let E = 0; E < X.length; E += 2) {
        let U = X[E + 0],
          q = X[E + 1];
        if (Array.isArray(q))
          for (let w = 0; w < q.length; w++) C += `${U}: ${q[w]}\r
`;
        else C += `${U}: ${q}\r
`
      }
    if (tAB.sendHeaders.hasSubscribers) tAB.sendHeaders.publish({
      request: Q,
      headers: C,
      socket: D
    });
    if (!W || K === 0) B1B(H, null, A, Q, D, V, C, F);
    else if (a4.isBuffer(W)) B1B(H, W, A, Q, D, V, C, F);
    else if (a4.isBlobLike(W))
      if (typeof W.stream === "function") G1B(H, W.stream(), A, Q, D, V, C, F);
      else Nm8(H, W, A, Q, D, V, C, F);
    else if (a4.isStream(W)) qm8(H, W, A, Q, D, V, C, F);
    else if (a4.isIterable(W)) G1B(H, W, A, Q, D, V, C, F);
    else J4(!1);
    return !0
  }

  function qm8(A, Q, B, G, Z, I, Y, J) {
    J4(I !== 0 || B[SH] === 0, "stream body cannot be pipelined");
    let W = !1,
      X = new Ax1({
        abort: A,
        socket: Z,
        request: G,
        contentLength: I,
        client: B,
        expectsPayload: J,
        header: Y
      }),
      V = function(H) {
        if (W) return;
        try {
          if (!X.write(H) && this.pause) this.pause()
        } catch (C) {
          a4.destroy(this, C)
        }
      },
      F = function() {
        if (W) return;
        if (Q.resume) Q.resume()
      },
      K = function() {
        if (queueMicrotask(() => {
            Q.removeListener("error", D)
          }), !W) {
          let H = new Z1B;
          queueMicrotask(() => D(H))
        }
      },
      D = function(H) {
        if (W) return;
        if (W = !0, J4(Z.destroyed || Z[Hc] && B[SH] <= 1), Z.off("drain", F).off("error", D), Q.removeListener("data", V).removeListener("end", D).removeListener("close", K), !H) try {
          X.end()
        } catch (C) {
          H = C
        }
        if (X.destroy(H), H && (H.code !== "UND_ERR_INFO" || H.message !== "reset")) a4.destroy(Q, H);
        else a4.destroy(Q)
      };
    if (Q.on("data", V).on("end", D).on("error", D).on("close", K), Q.resume) Q.resume();
    if (Z.on("drain", F).on("error", D), Q.errorEmitted ?? Q.errored) setImmediate(() => D(Q.errored));
    else if (Q.endEmitted ?? Q.readableEnded) setImmediate(() => D(null));
    if (Q.closeEmitted ?? Q.closed) setImmediate(K)
  }

  function B1B(A, Q, B, G, Z, I, Y, J) {
    try {
      if (!Q)
        if (I === 0) Z.write(`${Y}content-length: 0\r
\r
`, "latin1");
        else J4(I === null, "no body must not have content length"), Z.write(`${Y}\r
`, "latin1");
      else if (a4.isBuffer(Q)) {
        if (J4(I === Q.byteLength, "buffer body must have content length"), Z.cork(), Z.write(`${Y}content-length: ${I}\r
\r
`, "latin1"), Z.write(Q), Z.uncork(), G.onBodySent(Q), !J && G.reset !== !1) Z[BU] = !0
      }
      G.onRequestSent(), B[Dc]()
    } catch (W) {
      A(W)
    }
  }
  async function Nm8(A, Q, B, G, Z, I, Y, J) {
    J4(I === Q.size, "blob body must have content length");
    try {
      if (I != null && I !== Q.size) throw new bo;
      let W = Buffer.from(await Q.arrayBuffer());
      if (Z.cork(), Z.write(`${Y}content-length: ${I}\r
\r
`, "latin1"), Z.write(W), Z.uncork(), G.onBodySent(W), G.onRequestSent(), !J && G.reset !== !1) Z[BU] = !0;
      B[Dc]()
    } catch (W) {
      A(W)
    }
  }
  async function G1B(A, Q, B, G, Z, I, Y, J) {
    J4(I !== 0 || B[SH] === 0, "iterator body cannot be pipelined");
    let W = null;

    function X() {
      if (W) {
        let K = W;
        W = null, K()
      }
    }
    let V = () => new Promise((K, D) => {
      if (J4(W === null), Z[rL]) D(Z[rL]);
      else W = K
    });
    Z.on("close", X).on("drain", X);
    let F = new Ax1({
      abort: A,
      socket: Z,
      request: G,
      contentLength: I,
      client: B,
      expectsPayload: J,
      header: Y
    });
    try {
      for await (let K of Q) {
        if (Z[rL]) throw Z[rL];
        if (!F.write(K)) await V()
      }
      F.end()
    } catch (K) {
      F.destroy(K)
    } finally {
      Z.off("close", X).off("drain", X)
    }
  }
  class Ax1 {
    constructor({
      abort: A,
      socket: Q,
      request: B,
      contentLength: G,
      client: Z,
      expectsPayload: I,
      header: Y
    }) {
      this.socket = Q, this.request = B, this.contentLength = G, this.client = Z, this.bytesWritten = 0, this.expectsPayload = I, this.header = Y, this.abort = A, Q[Hc] = !0
    }
    write(A) {
      let {
        socket: Q,
        request: B,
        contentLength: G,
        client: Z,
        bytesWritten: I,
        expectsPayload: Y,
        header: J
      } = this;
      if (Q[rL]) throw Q[rL];
      if (Q.destroyed) return !1;
      let W = Buffer.byteLength(A);
      if (!W) return !0;
      if (G !== null && I + W > G) {
        if (Z[oy1]) throw new bo;
        process.emitWarning(new bo)
      }
      if (Q.cork(), I === 0) {
        if (!Y && B.reset !== !1) Q[BU] = !0;
        if (G === null) Q.write(`${J}transfer-encoding: chunked\r
`, "latin1");
        else Q.write(`${J}content-length: ${G}\r
\r
`, "latin1")
      }
      if (G === null) Q.write(`\r
${W.toString(16)}\r
`, "latin1");
      this.bytesWritten += W;
      let X = Q.write(A);
      if (Q.uncork(), B.onBodySent(A), !X) {
        if (Q[OJ].timeout && Q[OJ].timeoutType === Y3A) {
          if (Q[OJ].timeout.refresh) Q[OJ].timeout.refresh()
        }
      }
      return X
    }
    end() {
      let {
        socket: A,
        contentLength: Q,
        client: B,
        bytesWritten: G,
        expectsPayload: Z,
        header: I,
        request: Y
      } = this;
      if (Y.onRequestSent(), A[Hc] = !1, A[rL]) throw A[rL];
      if (A.destroyed) return;
      if (G === 0)
        if (Z) A.write(`${I}content-length: 0\r
\r
`, "latin1");
        else A.write(`${I}\r
`, "latin1");
      else if (Q === null) A.write(`\r
0\r
\r
`, "latin1");
      if (Q !== null && G !== Q)
        if (B[oy1]) throw new bo;
        else process.emitWarning(new bo);
      if (A[OJ].timeout && A[OJ].timeoutType === Y3A) {
        if (A[OJ].timeout.refresh) A[OJ].timeout.refresh()
      }
      B[Dc]()
    }
    destroy(A) {
      let {
        socket: Q,
        client: B,
        abort: G
      } = this;
      if (Q[Hc] = !1, A) J4(B[SH] <= 1, "pipeline should only contain this request"), G(A)
    }
  }
  W1B.exports = zm8
})
// @from(Start 4841787, End 4851736)
z1B = z((zS7, E1B) => {
  var oL = UA("node:assert"),
    {
      pipeline: Lm8
    } = UA("node:stream"),
    T5 = S6(),
    {
      RequestContentLengthMismatchError: Qx1,
      RequestAbortedError: V1B,
      SocketError: hEA,
      InformationalError: Bx1
    } = R7(),
    {
      kUrl: HlA,
      kReset: ElA,
      kClient: J3A,
      kRunning: zlA,
      kPending: Mm8,
      kQueue: Cc,
      kPendingIdx: Gx1,
      kRunningIdx: BT,
      kError: ZT,
      kSocket: _F,
      kStrictContentLength: Om8,
      kOnError: Zx1,
      kMaxConcurrentStreams: C1B,
      kHTTP2Session: GT,
      kResume: Ec,
      kSize: Rm8,
      kHTTPContext: Tm8
    } = tI(),
    Pb = Symbol("open streams"),
    F1B, K1B = !1,
    ClA;
  try {
    ClA = UA("node:http2")
  } catch {
    ClA = {
      constants: {}
    }
  }
  var {
    constants: {
      HTTP2_HEADER_AUTHORITY: Pm8,
      HTTP2_HEADER_METHOD: jm8,
      HTTP2_HEADER_PATH: Sm8,
      HTTP2_HEADER_SCHEME: _m8,
      HTTP2_HEADER_CONTENT_LENGTH: km8,
      HTTP2_HEADER_EXPECT: ym8,
      HTTP2_HEADER_STATUS: xm8
    }
  } = ClA;

  function vm8(A) {
    let Q = [];
    for (let [B, G] of Object.entries(A))
      if (Array.isArray(G))
        for (let Z of G) Q.push(Buffer.from(B), Buffer.from(Z));
      else Q.push(Buffer.from(B), Buffer.from(G));
    return Q
  }
  async function bm8(A, Q) {
    if (A[_F] = Q, !K1B) K1B = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
      code: "UNDICI-H2"
    });
    let B = ClA.connect(A[HlA], {
      createConnection: () => Q,
      peerMaxConcurrentStreams: A[C1B]
    });
    B[Pb] = 0, B[J3A] = A, B[_F] = Q, T5.addListener(B, "error", hm8), T5.addListener(B, "frameError", gm8), T5.addListener(B, "end", um8), T5.addListener(B, "goaway", mm8), T5.addListener(B, "close", function() {
      let {
        [J3A]: Z
      } = this, {
        [_F]: I
      } = Z, Y = this[_F][ZT] || this[ZT] || new hEA("closed", T5.getSocketInfo(I));
      if (Z[GT] = null, Z.destroyed) {
        oL(Z[Mm8] === 0);
        let J = Z[Cc].splice(Z[BT]);
        for (let W = 0; W < J.length; W++) {
          let X = J[W];
          T5.errorRequest(Z, X, Y)
        }
      }
    }), B.unref(), A[GT] = B, Q[GT] = B, T5.addListener(Q, "error", function(Z) {
      oL(Z.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[ZT] = Z, this[J3A][Zx1](Z)
    }), T5.addListener(Q, "end", function() {
      T5.destroy(this, new hEA("other side closed", T5.getSocketInfo(this)))
    }), T5.addListener(Q, "close", function() {
      let Z = this[ZT] || new hEA("closed", T5.getSocketInfo(this));
      if (A[_F] = null, this[GT] != null) this[GT].destroy(Z);
      A[Gx1] = A[BT], oL(A[zlA] === 0), A.emit("disconnect", A[HlA], [A], Z), A[Ec]()
    });
    let G = !1;
    return Q.on("close", () => {
      G = !0
    }), {
      version: "h2",
      defaultPipelining: 1 / 0,
      write(...Z) {
        return cm8(A, ...Z)
      },
      resume() {
        fm8(A)
      },
      destroy(Z, I) {
        if (G) queueMicrotask(I);
        else Q.destroy(Z).on("close", I)
      },
      get destroyed() {
        return Q.destroyed
      },
      busy() {
        return !1
      }
    }
  }

  function fm8(A) {
    let Q = A[_F];
    if (Q?.destroyed === !1)
      if (A[Rm8] === 0 && A[C1B] === 0) Q.unref(), A[GT].unref();
      else Q.ref(), A[GT].ref()
  }

  function hm8(A) {
    oL(A.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[_F][ZT] = A, this[J3A][Zx1](A)
  }

  function gm8(A, Q, B) {
    if (B === 0) {
      let G = new Bx1(`HTTP/2: "frameError" received - type ${A}, code ${Q}`);
      this[_F][ZT] = G, this[J3A][Zx1](G)
    }
  }

  function um8() {
    let A = new hEA("other side closed", T5.getSocketInfo(this[_F]));
    this.destroy(A), T5.destroy(this[_F], A)
  }

  function mm8(A) {
    let Q = this[ZT] || new hEA(`HTTP/2: "GOAWAY" frame received with code ${A}`, T5.getSocketInfo(this)),
      B = this[J3A];
    if (B[_F] = null, B[Tm8] = null, this[GT] != null) this[GT].destroy(Q), this[GT] = null;
    if (T5.destroy(this[_F], Q), B[BT] < B[Cc].length) {
      let G = B[Cc][B[BT]];
      B[Cc][B[BT]++] = null, T5.errorRequest(B, G, Q), B[Gx1] = B[BT]
    }
    oL(B[zlA] === 0), B.emit("disconnect", B[HlA], [B], Q), B[Ec]()
  }

  function dm8(A) {
    return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
  }

  function cm8(A, Q) {
    let B = A[GT],
      {
        method: G,
        path: Z,
        host: I,
        upgrade: Y,
        expectContinue: J,
        signal: W,
        headers: X
      } = Q,
      {
        body: V
      } = Q;
    if (Y) return T5.errorRequest(A, Q, Error("Upgrade not supported for H2")), !1;
    let F = {};
    for (let N = 0; N < X.length; N += 2) {
      let R = X[N + 0],
        T = X[N + 1];
      if (Array.isArray(T))
        for (let y = 0; y < T.length; y++)
          if (F[R]) F[R] += `,${T[y]}`;
          else F[R] = T[y];
      else F[R] = T
    }
    let K, {
      hostname: D,
      port: H
    } = A[HlA];
    F[Pm8] = I || `${D}${H?`:${H}`:""}`, F[jm8] = G;
    let C = (N) => {
      if (Q.aborted || Q.completed) return;
      if (N = N || new V1B, T5.errorRequest(A, Q, N), K != null) T5.destroy(K, N);
      T5.destroy(V, N), A[Cc][A[BT]++] = null, A[Ec]()
    };
    try {
      Q.onConnect(C)
    } catch (N) {
      T5.errorRequest(A, Q, N)
    }
    if (Q.aborted) return !1;
    if (G === "CONNECT") {
      if (B.ref(), K = B.request(F, {
          endStream: !1,
          signal: W
        }), K.id && !K.pending) Q.onUpgrade(null, null, K), ++B[Pb], A[Cc][A[BT]++] = null;
      else K.once("ready", () => {
        Q.onUpgrade(null, null, K), ++B[Pb], A[Cc][A[BT]++] = null
      });
      return K.once("close", () => {
        if (B[Pb] -= 1, B[Pb] === 0) B.unref()
      }), !0
    }
    F[Sm8] = Z, F[_m8] = "https";
    let E = G === "PUT" || G === "POST" || G === "PATCH";
    if (V && typeof V.read === "function") V.read(0);
    let U = T5.bodyLength(V);
    if (T5.isFormDataLike(V)) {
      F1B ??= G3A().extractBody;
      let [N, R] = F1B(V);
      F["content-type"] = R, V = N.stream, U = N.length
    }
    if (U == null) U = Q.contentLength;
    if (U === 0 || !E) U = null;
    if (dm8(G) && U > 0 && Q.contentLength != null && Q.contentLength !== U) {
      if (A[Om8]) return T5.errorRequest(A, Q, new Qx1), !1;
      process.emitWarning(new Qx1)
    }
    if (U != null) oL(V, "no body must not have content length"), F[km8] = `${U}`;
    B.ref();
    let q = G === "GET" || G === "HEAD" || V === null;
    if (J) F[ym8] = "100-continue", K = B.request(F, {
      endStream: q,
      signal: W
    }), K.once("continue", w);
    else K = B.request(F, {
      endStream: q,
      signal: W
    }), w();
    return ++B[Pb], K.once("response", (N) => {
      let {
        [xm8]: R, ...T
      } = N;
      if (Q.onResponseStarted(), Q.aborted) {
        let y = new V1B;
        T5.errorRequest(A, Q, y), T5.destroy(K, y);
        return
      }
      if (Q.onHeaders(Number(R), vm8(T), K.resume.bind(K), "") === !1) K.pause();
      K.on("data", (y) => {
        if (Q.onData(y) === !1) K.pause()
      })
    }), K.once("end", () => {
      if (K.state?.state == null || K.state.state < 6) Q.onComplete([]);
      if (B[Pb] === 0) B.unref();
      C(new Bx1("HTTP/2: stream half-closed (remote)")), A[Cc][A[BT]++] = null, A[Gx1] = A[BT], A[Ec]()
    }), K.once("close", () => {
      if (B[Pb] -= 1, B[Pb] === 0) B.unref()
    }), K.once("error", function(N) {
      C(N)
    }), K.once("frameError", (N, R) => {
      C(new Bx1(`HTTP/2: "frameError" received - type ${N}, code ${R}`))
    }), !0;

    function w() {
      if (!V || U === 0) D1B(C, K, null, A, Q, A[_F], U, E);
      else if (T5.isBuffer(V)) D1B(C, K, V, A, Q, A[_F], U, E);
      else if (T5.isBlobLike(V))
        if (typeof V.stream === "function") H1B(C, K, V.stream(), A, Q, A[_F], U, E);
        else lm8(C, K, V, A, Q, A[_F], U, E);
      else if (T5.isStream(V)) pm8(C, A[_F], E, K, V, A, Q, U);
      else if (T5.isIterable(V)) H1B(C, K, V, A, Q, A[_F], U, E);
      else oL(!1)
    }
  }

  function D1B(A, Q, B, G, Z, I, Y, J) {
    try {
      if (B != null && T5.isBuffer(B)) oL(Y === B.byteLength, "buffer body must have content length"), Q.cork(), Q.write(B), Q.uncork(), Q.end(), Z.onBodySent(B);
      if (!J) I[ElA] = !0;
      Z.onRequestSent(), G[Ec]()
    } catch (W) {
      A(W)
    }
  }

  function pm8(A, Q, B, G, Z, I, Y, J) {
    oL(J !== 0 || I[zlA] === 0, "stream body cannot be pipelined");
    let W = Lm8(Z, G, (V) => {
      if (V) T5.destroy(W, V), A(V);
      else {
        if (T5.removeAllListeners(W), Y.onRequestSent(), !B) Q[ElA] = !0;
        I[Ec]()
      }
    });
    T5.addListener(W, "data", X);

    function X(V) {
      Y.onBodySent(V)
    }
  }
  async function lm8(A, Q, B, G, Z, I, Y, J) {
    oL(Y === B.size, "blob body must have content length");
    try {
      if (Y != null && Y !== B.size) throw new Qx1;
      let W = Buffer.from(await B.arrayBuffer());
      if (Q.cork(), Q.write(W), Q.uncork(), Q.end(), Z.onBodySent(W), Z.onRequestSent(), !J) I[ElA] = !0;
      G[Ec]()
    } catch (W) {
      A(W)
    }
  }
  async function H1B(A, Q, B, G, Z, I, Y, J) {
    oL(Y !== 0 || G[zlA] === 0, "iterator body cannot be pipelined");
    let W = null;

    function X() {
      if (W) {
        let F = W;
        W = null, F()
      }
    }
    let V = () => new Promise((F, K) => {
      if (oL(W === null), I[ZT]) K(I[ZT]);
      else W = F
    });
    Q.on("close", X).on("drain", X);
    try {
      for await (let F of B) {
        if (I[ZT]) throw I[ZT];
        let K = Q.write(F);
        if (Z.onBodySent(F), !K) await V()
      }
      if (Q.end(), Z.onRequestSent(), !J) I[ElA] = !0;
      G[Ec]()
    } catch (F) {
      A(F)
    } finally {
      Q.off("close", X).off("drain", X)
    }
  }
  E1B.exports = bm8
})
// @from(Start 4851742, End 4855902)
UlA = z((US7, q1B) => {
  var H_ = S6(),
    {
      kBodyUsed: gEA
    } = tI(),
    Yx1 = UA("node:assert"),
    {
      InvalidArgumentError: im8
    } = R7(),
    nm8 = UA("node:events"),
    am8 = [300, 301, 302, 303, 307, 308],
    U1B = Symbol("body");
  class Ix1 {
    constructor(A) {
      this[U1B] = A, this[gEA] = !1
    }
    async * [Symbol.asyncIterator]() {
      Yx1(!this[gEA], "disturbed"), this[gEA] = !0, yield* this[U1B]
    }
  }
  class w1B {
    constructor(A, Q, B, G) {
      if (Q != null && (!Number.isInteger(Q) || Q < 0)) throw new im8("maxRedirections must be a positive number");
      if (H_.validateHandler(G, B.method, B.upgrade), this.dispatch = A, this.location = null, this.abort = null, this.opts = {
          ...B,
          maxRedirections: 0
        }, this.maxRedirections = Q, this.handler = G, this.history = [], this.redirectionLimitReached = !1, H_.isStream(this.opts.body)) {
        if (H_.bodyLength(this.opts.body) === 0) this.opts.body.on("data", function() {
          Yx1(!1)
        });
        if (typeof this.opts.body.readableDidRead !== "boolean") this.opts.body[gEA] = !1, nm8.prototype.on.call(this.opts.body, "data", function() {
          this[gEA] = !0
        })
      } else if (this.opts.body && typeof this.opts.body.pipeTo === "function") this.opts.body = new Ix1(this.opts.body);
      else if (this.opts.body && typeof this.opts.body !== "string" && !ArrayBuffer.isView(this.opts.body) && H_.isIterable(this.opts.body)) this.opts.body = new Ix1(this.opts.body)
    }
    onConnect(A) {
      this.abort = A, this.handler.onConnect(A, {
        history: this.history
      })
    }
    onUpgrade(A, Q, B) {
      this.handler.onUpgrade(A, Q, B)
    }
    onError(A) {
      this.handler.onError(A)
    }
    onHeaders(A, Q, B, G) {
      if (this.location = this.history.length >= this.maxRedirections || H_.isDisturbed(this.opts.body) ? null : sm8(A, Q), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
        if (this.request) this.request.abort(Error("max redirects"));
        this.redirectionLimitReached = !0, this.abort(Error("max redirects"));
        return
      }
      if (this.opts.origin) this.history.push(new URL(this.opts.path, this.opts.origin));
      if (!this.location) return this.handler.onHeaders(A, Q, B, G);
      let {
        origin: Z,
        pathname: I,
        search: Y
      } = H_.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), J = Y ? `${I}${Y}` : I;
      if (this.opts.headers = rm8(this.opts.headers, A === 303, this.opts.origin !== Z), this.opts.path = J, this.opts.origin = Z, this.opts.maxRedirections = 0, this.opts.query = null, A === 303 && this.opts.method !== "HEAD") this.opts.method = "GET", this.opts.body = null
    }
    onData(A) {
      if (this.location);
      else return this.handler.onData(A)
    }
    onComplete(A) {
      if (this.location) this.location = null, this.abort = null, this.dispatch(this.opts, this);
      else this.handler.onComplete(A)
    }
    onBodySent(A) {
      if (this.handler.onBodySent) this.handler.onBodySent(A)
    }
  }

  function sm8(A, Q) {
    if (am8.indexOf(A) === -1) return null;
    for (let B = 0; B < Q.length; B += 2)
      if (Q[B].length === 8 && H_.headerNameToString(Q[B]) === "location") return Q[B + 1]
  }

  function $1B(A, Q, B) {
    if (A.length === 4) return H_.headerNameToString(A) === "host";
    if (Q && H_.headerNameToString(A).startsWith("content-")) return !0;
    if (B && (A.length === 13 || A.length === 6 || A.length === 19)) {
      let G = H_.headerNameToString(A);
      return G === "authorization" || G === "cookie" || G === "proxy-authorization"
    }
    return !1
  }

  function rm8(A, Q, B) {
    let G = [];
    if (Array.isArray(A)) {
      for (let Z = 0; Z < A.length; Z += 2)
        if (!$1B(A[Z], Q, B)) G.push(A[Z], A[Z + 1])
    } else if (A && typeof A === "object") {
      for (let Z of Object.keys(A))
        if (!$1B(Z, Q, B)) G.push(Z, A[Z])
    } else Yx1(A == null, "headers must be an object or an array");
    return G
  }
  q1B.exports = w1B
})
// @from(Start 4855908, End 4856305)
$lA = z(($S7, N1B) => {
  var om8 = UlA();

  function tm8({
    maxRedirections: A
  }) {
    return (Q) => {
      return function(G, Z) {
        let {
          maxRedirections: I = A
        } = G;
        if (!I) return Q(G, Z);
        let Y = new om8(Q, I, G, Z);
        return G = {
          ...G,
          maxRedirections: 0
        }, Q(G, Y)
      }
    }
  }
  N1B.exports = tm8
})
// @from(Start 4856311, End 4867636)
iEA = z((wS7, y1B) => {
  var jb = UA("node:assert"),
    P1B = UA("node:net"),
    em8 = UA("node:http"),
    fo = S6(),
    {
      channels: W3A
    } = p5A(),
    Ad8 = HeQ(),
    Qd8 = a5A(),
    {
      InvalidArgumentError: NW,
      InformationalError: Bd8,
      ClientDestroyedError: Gd8
    } = R7(),
    Zd8 = TEA(),
    {
      kUrl: C_,
      kServerName: zc,
      kClient: Id8,
      kBusy: Jx1,
      kConnect: Yd8,
      kResuming: ho,
      kRunning: pEA,
      kPending: lEA,
      kSize: cEA,
      kQueue: IT,
      kConnected: Jd8,
      kConnecting: X3A,
      kNeedDrain: $c,
      kKeepAliveDefaultTimeout: L1B,
      kHostHeader: Wd8,
      kPendingIdx: YT,
      kRunningIdx: Sb,
      kError: Xd8,
      kPipelining: wlA,
      kKeepAliveTimeoutValue: Vd8,
      kMaxHeadersSize: Fd8,
      kKeepAliveMaxTimeout: Kd8,
      kKeepAliveTimeoutThreshold: Dd8,
      kHeadersTimeout: Hd8,
      kBodyTimeout: Cd8,
      kStrictContentLength: Ed8,
      kConnector: uEA,
      kMaxRedirections: zd8,
      kMaxRequests: Wx1,
      kCounter: Ud8,
      kClose: $d8,
      kDestroy: wd8,
      kDispatch: qd8,
      kInterceptors: M1B,
      kLocalAddress: mEA,
      kMaxResponseSize: Nd8,
      kOnError: Ld8,
      kHTTPContext: LW,
      kMaxConcurrentStreams: Md8,
      kResume: dEA
    } = tI(),
    Od8 = X1B(),
    Rd8 = z1B(),
    O1B = !1,
    Uc = Symbol("kClosedResolve"),
    R1B = () => {};

  function j1B(A) {
    return A[wlA] ?? A[LW]?.defaultPipelining ?? 1
  }
  class S1B extends Qd8 {
    constructor(A, {
      interceptors: Q,
      maxHeaderSize: B,
      headersTimeout: G,
      socketTimeout: Z,
      requestTimeout: I,
      connectTimeout: Y,
      bodyTimeout: J,
      idleTimeout: W,
      keepAlive: X,
      keepAliveTimeout: V,
      maxKeepAliveTimeout: F,
      keepAliveMaxTimeout: K,
      keepAliveTimeoutThreshold: D,
      socketPath: H,
      pipelining: C,
      tls: E,
      strictContentLength: U,
      maxCachedSessions: q,
      maxRedirections: w,
      connect: N,
      maxRequestsPerClient: R,
      localAddress: T,
      maxResponseSize: y,
      autoSelectFamily: v,
      autoSelectFamilyAttemptTimeout: x,
      maxConcurrentStreams: p,
      allowH2: u
    } = {}) {
      super();
      if (X !== void 0) throw new NW("unsupported keepAlive, use pipelining=0 instead");
      if (Z !== void 0) throw new NW("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
      if (I !== void 0) throw new NW("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
      if (W !== void 0) throw new NW("unsupported idleTimeout, use keepAliveTimeout instead");
      if (F !== void 0) throw new NW("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
      if (B != null && !Number.isFinite(B)) throw new NW("invalid maxHeaderSize");
      if (H != null && typeof H !== "string") throw new NW("invalid socketPath");
      if (Y != null && (!Number.isFinite(Y) || Y < 0)) throw new NW("invalid connectTimeout");
      if (V != null && (!Number.isFinite(V) || V <= 0)) throw new NW("invalid keepAliveTimeout");
      if (K != null && (!Number.isFinite(K) || K <= 0)) throw new NW("invalid keepAliveMaxTimeout");
      if (D != null && !Number.isFinite(D)) throw new NW("invalid keepAliveTimeoutThreshold");
      if (G != null && (!Number.isInteger(G) || G < 0)) throw new NW("headersTimeout must be a positive integer or zero");
      if (J != null && (!Number.isInteger(J) || J < 0)) throw new NW("bodyTimeout must be a positive integer or zero");
      if (N != null && typeof N !== "function" && typeof N !== "object") throw new NW("connect must be a function or an object");
      if (w != null && (!Number.isInteger(w) || w < 0)) throw new NW("maxRedirections must be a positive number");
      if (R != null && (!Number.isInteger(R) || R < 0)) throw new NW("maxRequestsPerClient must be a positive number");
      if (T != null && (typeof T !== "string" || P1B.isIP(T) === 0)) throw new NW("localAddress must be valid string IP address");
      if (y != null && (!Number.isInteger(y) || y < -1)) throw new NW("maxResponseSize must be a positive number");
      if (x != null && (!Number.isInteger(x) || x < -1)) throw new NW("autoSelectFamilyAttemptTimeout must be a positive number");
      if (u != null && typeof u !== "boolean") throw new NW("allowH2 must be a valid boolean value");
      if (p != null && (typeof p !== "number" || p < 1)) throw new NW("maxConcurrentStreams must be a positive integer, greater than 0");
      if (typeof N !== "function") N = Zd8({
        ...E,
        maxCachedSessions: q,
        allowH2: u,
        socketPath: H,
        timeout: Y,
        ...v ? {
          autoSelectFamily: v,
          autoSelectFamilyAttemptTimeout: x
        } : void 0,
        ...N
      });
      if (Q?.Client && Array.isArray(Q.Client)) {
        if (this[M1B] = Q.Client, !O1B) O1B = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
          code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
        })
      } else this[M1B] = [Td8({
        maxRedirections: w
      })];
      this[C_] = fo.parseOrigin(A), this[uEA] = N, this[wlA] = C != null ? C : 1, this[Fd8] = B || em8.maxHeaderSize, this[L1B] = V == null ? 4000 : V, this[Kd8] = K == null ? 600000 : K, this[Dd8] = D == null ? 2000 : D, this[Vd8] = this[L1B], this[zc] = null, this[mEA] = T != null ? T : null, this[ho] = 0, this[$c] = 0, this[Wd8] = `host: ${this[C_].hostname}${this[C_].port?`:${this[C_].port}`:""}\r
`, this[Cd8] = J != null ? J : 300000, this[Hd8] = G != null ? G : 300000, this[Ed8] = U == null ? !0 : U, this[zd8] = w, this[Wx1] = R, this[Uc] = null, this[Nd8] = y > -1 ? y : -1, this[Md8] = p != null ? p : 100, this[LW] = null, this[IT] = [], this[Sb] = 0, this[YT] = 0, this[dEA] = (e) => Xx1(this, e), this[Ld8] = (e) => _1B(this, e)
    }
    get pipelining() {
      return this[wlA]
    }
    set pipelining(A) {
      this[wlA] = A, this[dEA](!0)
    }
    get[lEA]() {
      return this[IT].length - this[YT]
    }
    get[pEA]() {
      return this[YT] - this[Sb]
    }
    get[cEA]() {
      return this[IT].length - this[Sb]
    }
    get[Jd8]() {
      return !!this[LW] && !this[X3A] && !this[LW].destroyed
    }
    get[Jx1]() {
      return Boolean(this[LW]?.busy(null) || this[cEA] >= (j1B(this) || 1) || this[lEA] > 0)
    } [Yd8](A) {
      k1B(this), this.once("connect", A)
    } [qd8](A, Q) {
      let B = A.origin || this[C_].origin,
        G = new Ad8(B, A, Q);
      if (this[IT].push(G), this[ho]);
      else if (fo.bodyLength(G.body) == null && fo.isIterable(G.body)) this[ho] = 1, queueMicrotask(() => Xx1(this));
      else this[dEA](!0);
      if (this[ho] && this[$c] !== 2 && this[Jx1]) this[$c] = 2;
      return this[$c] < 2
    }
    async [$d8]() {
      return new Promise((A) => {
        if (this[cEA]) this[Uc] = A;
        else A(null)
      })
    }
    async [wd8](A) {
      return new Promise((Q) => {
        let B = this[IT].splice(this[YT]);
        for (let Z = 0; Z < B.length; Z++) {
          let I = B[Z];
          fo.errorRequest(this, I, A)
        }
        let G = () => {
          if (this[Uc]) this[Uc](), this[Uc] = null;
          Q(null)
        };
        if (this[LW]) this[LW].destroy(A, G), this[LW] = null;
        else queueMicrotask(G);
        this[dEA]()
      })
    }
  }
  var Td8 = $lA();

  function _1B(A, Q) {
    if (A[pEA] === 0 && Q.code !== "UND_ERR_INFO" && Q.code !== "UND_ERR_SOCKET") {
      jb(A[YT] === A[Sb]);
      let B = A[IT].splice(A[Sb]);
      for (let G = 0; G < B.length; G++) {
        let Z = B[G];
        fo.errorRequest(A, Z, Q)
      }
      jb(A[cEA] === 0)
    }
  }
  async function k1B(A) {
    jb(!A[X3A]), jb(!A[LW]);
    let {
      host: Q,
      hostname: B,
      protocol: G,
      port: Z
    } = A[C_];
    if (B[0] === "[") {
      let I = B.indexOf("]");
      jb(I !== -1);
      let Y = B.substring(1, I);
      jb(P1B.isIP(Y)), B = Y
    }
    if (A[X3A] = !0, W3A.beforeConnect.hasSubscribers) W3A.beforeConnect.publish({
      connectParams: {
        host: Q,
        hostname: B,
        protocol: G,
        port: Z,
        version: A[LW]?.version,
        servername: A[zc],
        localAddress: A[mEA]
      },
      connector: A[uEA]
    });
    try {
      let I = await new Promise((Y, J) => {
        A[uEA]({
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          servername: A[zc],
          localAddress: A[mEA]
        }, (W, X) => {
          if (W) J(W);
          else Y(X)
        })
      });
      if (A.destroyed) {
        fo.destroy(I.on("error", R1B), new Gd8);
        return
      }
      jb(I);
      try {
        A[LW] = I.alpnProtocol === "h2" ? await Rd8(A, I) : await Od8(A, I)
      } catch (Y) {
        throw I.destroy().on("error", R1B), Y
      }
      if (A[X3A] = !1, I[Ud8] = 0, I[Wx1] = A[Wx1], I[Id8] = A, I[Xd8] = null, W3A.connected.hasSubscribers) W3A.connected.publish({
        connectParams: {
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          version: A[LW]?.version,
          servername: A[zc],
          localAddress: A[mEA]
        },
        connector: A[uEA],
        socket: I
      });
      A.emit("connect", A[C_], [A])
    } catch (I) {
      if (A.destroyed) return;
      if (A[X3A] = !1, W3A.connectError.hasSubscribers) W3A.connectError.publish({
        connectParams: {
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          version: A[LW]?.version,
          servername: A[zc],
          localAddress: A[mEA]
        },
        connector: A[uEA],
        error: I
      });
      if (I.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
        jb(A[pEA] === 0);
        while (A[lEA] > 0 && A[IT][A[YT]].servername === A[zc]) {
          let Y = A[IT][A[YT]++];
          fo.errorRequest(A, Y, I)
        }
      } else _1B(A, I);
      A.emit("connectionError", A[C_], [A], I)
    }
    A[dEA]()
  }

  function T1B(A) {
    A[$c] = 0, A.emit("drain", A[C_], [A])
  }

  function Xx1(A, Q) {
    if (A[ho] === 2) return;
    if (A[ho] = 2, Pd8(A, Q), A[ho] = 0, A[Sb] > 256) A[IT].splice(0, A[Sb]), A[YT] -= A[Sb], A[Sb] = 0
  }

  function Pd8(A, Q) {
    while (!0) {
      if (A.destroyed) {
        jb(A[lEA] === 0);
        return
      }
      if (A[Uc] && !A[cEA]) {
        A[Uc](), A[Uc] = null;
        return
      }
      if (A[LW]) A[LW].resume();
      if (A[Jx1]) A[$c] = 2;
      else if (A[$c] === 2) {
        if (Q) A[$c] = 1, queueMicrotask(() => T1B(A));
        else T1B(A);
        continue
      }
      if (A[lEA] === 0) return;
      if (A[pEA] >= (j1B(A) || 1)) return;
      let B = A[IT][A[YT]];
      if (A[C_].protocol === "https:" && A[zc] !== B.servername) {
        if (A[pEA] > 0) return;
        A[zc] = B.servername, A[LW]?.destroy(new Bd8("servername changed"), () => {
          A[LW] = null, Xx1(A)
        })
      }
      if (A[X3A]) return;
      if (!A[LW]) {
        k1B(A);
        return
      }
      if (A[LW].destroyed) return;
      if (A[LW].busy(B)) return;
      if (!B.aborted && A[LW].write(B)) A[YT]++;
      else A[IT].splice(A[YT], 1)
    }
  }
  y1B.exports = S1B
})
// @from(Start 4867642, End 4868590)
Fx1 = z((qS7, x1B) => {
  class Vx1 {
    constructor() {
      this.bottom = 0, this.top = 0, this.list = Array(2048), this.next = null
    }
    isEmpty() {
      return this.top === this.bottom
    }
    isFull() {
      return (this.top + 1 & 2047) === this.bottom
    }
    push(A) {
      this.list[this.top] = A, this.top = this.top + 1 & 2047
    }
    shift() {
      let A = this.list[this.bottom];
      if (A === void 0) return null;
      return this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & 2047, A
    }
  }
  x1B.exports = class {
    constructor() {
      this.head = this.tail = new Vx1
    }
    isEmpty() {
      return this.head.isEmpty()
    }
    push(Q) {
      if (this.head.isFull()) this.head = this.head.next = new Vx1;
      this.head.push(Q)
    }
    shift() {
      let Q = this.tail,
        B = Q.shift();
      if (Q.isEmpty() && Q.next !== null) this.tail = Q.next;
      return B
    }
  }
})
// @from(Start 4868596, End 4869168)
f1B = z((NS7, b1B) => {
  var {
    kFree: jd8,
    kConnected: Sd8,
    kPending: _d8,
    kQueued: kd8,
    kRunning: yd8,
    kSize: xd8
  } = tI(), go = Symbol("pool");
  class v1B {
    constructor(A) {
      this[go] = A
    }
    get connected() {
      return this[go][Sd8]
    }
    get free() {
      return this[go][jd8]
    }
    get pending() {
      return this[go][_d8]
    }
    get queued() {
      return this[go][kd8]
    }
    get running() {
      return this[go][yd8]
    }
    get size() {
      return this[go][xd8]
    }
  }
  b1B.exports = v1B
})
// @from(Start 4869174, End 4872604)
Ex1 = z((LS7, a1B) => {
  var vd8 = a5A(),
    bd8 = Fx1(),
    {
      kConnected: Kx1,
      kSize: h1B,
      kRunning: g1B,
      kPending: u1B,
      kQueued: nEA,
      kBusy: fd8,
      kFree: hd8,
      kUrl: gd8,
      kClose: ud8,
      kDestroy: md8,
      kDispatch: dd8
    } = tI(),
    cd8 = f1B(),
    GU = Symbol("clients"),
    tC = Symbol("needDrain"),
    aEA = Symbol("queue"),
    Dx1 = Symbol("closed resolve"),
    Hx1 = Symbol("onDrain"),
    m1B = Symbol("onConnect"),
    d1B = Symbol("onDisconnect"),
    c1B = Symbol("onConnectionError"),
    Cx1 = Symbol("get dispatcher"),
    l1B = Symbol("add client"),
    i1B = Symbol("remove client"),
    p1B = Symbol("stats");
  class n1B extends vd8 {
    constructor() {
      super();
      this[aEA] = new bd8, this[GU] = [], this[nEA] = 0;
      let A = this;
      this[Hx1] = function(B, G) {
        let Z = A[aEA],
          I = !1;
        while (!I) {
          let Y = Z.shift();
          if (!Y) break;
          A[nEA]--, I = !this.dispatch(Y.opts, Y.handler)
        }
        if (this[tC] = I, !this[tC] && A[tC]) A[tC] = !1, A.emit("drain", B, [A, ...G]);
        if (A[Dx1] && Z.isEmpty()) Promise.all(A[GU].map((Y) => Y.close())).then(A[Dx1])
      }, this[m1B] = (Q, B) => {
        A.emit("connect", Q, [A, ...B])
      }, this[d1B] = (Q, B, G) => {
        A.emit("disconnect", Q, [A, ...B], G)
      }, this[c1B] = (Q, B, G) => {
        A.emit("connectionError", Q, [A, ...B], G)
      }, this[p1B] = new cd8(this)
    }
    get[fd8]() {
      return this[tC]
    }
    get[Kx1]() {
      return this[GU].filter((A) => A[Kx1]).length
    }
    get[hd8]() {
      return this[GU].filter((A) => A[Kx1] && !A[tC]).length
    }
    get[u1B]() {
      let A = this[nEA];
      for (let {
          [u1B]: Q
        }
        of this[GU]) A += Q;
      return A
    }
    get[g1B]() {
      let A = 0;
      for (let {
          [g1B]: Q
        }
        of this[GU]) A += Q;
      return A
    }
    get[h1B]() {
      let A = this[nEA];
      for (let {
          [h1B]: Q
        }
        of this[GU]) A += Q;
      return A
    }
    get stats() {
      return this[p1B]
    }
    async [ud8]() {
      if (this[aEA].isEmpty()) await Promise.all(this[GU].map((A) => A.close()));
      else await new Promise((A) => {
        this[Dx1] = A
      })
    }
    async [md8](A) {
      while (!0) {
        let Q = this[aEA].shift();
        if (!Q) break;
        Q.handler.onError(A)
      }
      await Promise.all(this[GU].map((Q) => Q.destroy(A)))
    } [dd8](A, Q) {
      let B = this[Cx1]();
      if (!B) this[tC] = !0, this[aEA].push({
        opts: A,
        handler: Q
      }), this[nEA]++;
      else if (!B.dispatch(A, Q)) B[tC] = !0, this[tC] = !this[Cx1]();
      return !this[tC]
    } [l1B](A) {
      if (A.on("drain", this[Hx1]).on("connect", this[m1B]).on("disconnect", this[d1B]).on("connectionError", this[c1B]), this[GU].push(A), this[tC]) queueMicrotask(() => {
        if (this[tC]) this[Hx1](A[gd8], [this, A])
      });
      return this
    } [i1B](A) {
      A.close(() => {
        let Q = this[GU].indexOf(A);
        if (Q !== -1) this[GU].splice(Q, 1)
      }), this[tC] = this[GU].some((Q) => !Q[tC] && Q.closed !== !0 && Q.destroyed !== !0)
    }
  }
  a1B.exports = {
    PoolBase: n1B,
    kClients: GU,
    kNeedDrain: tC,
    kAddClient: l1B,
    kRemoveClient: i1B,
    kGetDispatcher: Cx1
  }
})
// @from(Start 4872610, End 4874549)
V3A = z((MS7, A0B) => {
  var {
    PoolBase: pd8,
    kClients: s1B,
    kNeedDrain: ld8,
    kAddClient: id8,
    kGetDispatcher: nd8
  } = Ex1(), ad8 = iEA(), {
    InvalidArgumentError: zx1
  } = R7(), r1B = S6(), {
    kUrl: o1B,
    kInterceptors: sd8
  } = tI(), rd8 = TEA(), Ux1 = Symbol("options"), $x1 = Symbol("connections"), t1B = Symbol("factory");

  function od8(A, Q) {
    return new ad8(A, Q)
  }
  class e1B extends pd8 {
    constructor(A, {
      connections: Q,
      factory: B = od8,
      connect: G,
      connectTimeout: Z,
      tls: I,
      maxCachedSessions: Y,
      socketPath: J,
      autoSelectFamily: W,
      autoSelectFamilyAttemptTimeout: X,
      allowH2: V,
      ...F
    } = {}) {
      super();
      if (Q != null && (!Number.isFinite(Q) || Q < 0)) throw new zx1("invalid connections");
      if (typeof B !== "function") throw new zx1("factory must be a function.");
      if (G != null && typeof G !== "function" && typeof G !== "object") throw new zx1("connect must be a function or an object");
      if (typeof G !== "function") G = rd8({
        ...I,
        maxCachedSessions: Y,
        allowH2: V,
        socketPath: J,
        timeout: Z,
        ...W ? {
          autoSelectFamily: W,
          autoSelectFamilyAttemptTimeout: X
        } : void 0,
        ...G
      });
      this[sd8] = F.interceptors?.Pool && Array.isArray(F.interceptors.Pool) ? F.interceptors.Pool : [], this[$x1] = Q || null, this[o1B] = r1B.parseOrigin(A), this[Ux1] = {
        ...r1B.deepClone(F),
        connect: G,
        allowH2: V
      }, this[Ux1].interceptors = F.interceptors ? {
        ...F.interceptors
      } : void 0, this[t1B] = B
    } [nd8]() {
      for (let A of this[s1B])
        if (!A[ld8]) return A;
      if (!this[$x1] || this[s1B].length < this[$x1]) {
        let A = this[t1B](this[o1B], this[Ux1]);
        return this[id8](A), A
      }
    }
  }
  A0B.exports = e1B
})
// @from(Start 4874555, End 4877916)
Y0B = z((OS7, I0B) => {
  var {
    BalancedPoolMissingUpstreamError: td8,
    InvalidArgumentError: ed8
  } = R7(), {
    PoolBase: Ac8,
    kClients: _H,
    kNeedDrain: sEA,
    kAddClient: Qc8,
    kRemoveClient: Bc8,
    kGetDispatcher: Gc8
  } = Ex1(), Zc8 = V3A(), {
    kUrl: wx1,
    kInterceptors: Ic8
  } = tI(), {
    parseOrigin: Q0B
  } = S6(), B0B = Symbol("factory"), qlA = Symbol("options"), G0B = Symbol("kGreatestCommonDivisor"), uo = Symbol("kCurrentWeight"), mo = Symbol("kIndex"), tL = Symbol("kWeight"), NlA = Symbol("kMaxWeightPerServer"), LlA = Symbol("kErrorPenalty");

  function Yc8(A, Q) {
    if (A === 0) return Q;
    while (Q !== 0) {
      let B = Q;
      Q = A % Q, A = B
    }
    return A
  }

  function Jc8(A, Q) {
    return new Zc8(A, Q)
  }
  class Z0B extends Ac8 {
    constructor(A = [], {
      factory: Q = Jc8,
      ...B
    } = {}) {
      super();
      if (this[qlA] = B, this[mo] = -1, this[uo] = 0, this[NlA] = this[qlA].maxWeightPerServer || 100, this[LlA] = this[qlA].errorPenalty || 15, !Array.isArray(A)) A = [A];
      if (typeof Q !== "function") throw new ed8("factory must be a function.");
      this[Ic8] = B.interceptors?.BalancedPool && Array.isArray(B.interceptors.BalancedPool) ? B.interceptors.BalancedPool : [], this[B0B] = Q;
      for (let G of A) this.addUpstream(G);
      this._updateBalancedPoolStats()
    }
    addUpstream(A) {
      let Q = Q0B(A).origin;
      if (this[_H].find((G) => G[wx1].origin === Q && G.closed !== !0 && G.destroyed !== !0)) return this;
      let B = this[B0B](Q, Object.assign({}, this[qlA]));
      this[Qc8](B), B.on("connect", () => {
        B[tL] = Math.min(this[NlA], B[tL] + this[LlA])
      }), B.on("connectionError", () => {
        B[tL] = Math.max(1, B[tL] - this[LlA]), this._updateBalancedPoolStats()
      }), B.on("disconnect", (...G) => {
        let Z = G[2];
        if (Z && Z.code === "UND_ERR_SOCKET") B[tL] = Math.max(1, B[tL] - this[LlA]), this._updateBalancedPoolStats()
      });
      for (let G of this[_H]) G[tL] = this[NlA];
      return this._updateBalancedPoolStats(), this
    }
    _updateBalancedPoolStats() {
      let A = 0;
      for (let Q = 0; Q < this[_H].length; Q++) A = Yc8(this[_H][Q][tL], A);
      this[G0B] = A
    }
    removeUpstream(A) {
      let Q = Q0B(A).origin,
        B = this[_H].find((G) => G[wx1].origin === Q && G.closed !== !0 && G.destroyed !== !0);
      if (B) this[Bc8](B);
      return this
    }
    get upstreams() {
      return this[_H].filter((A) => A.closed !== !0 && A.destroyed !== !0).map((A) => A[wx1].origin)
    } [Gc8]() {
      if (this[_H].length === 0) throw new td8;
      if (!this[_H].find((Z) => !Z[sEA] && Z.closed !== !0 && Z.destroyed !== !0)) return;
      if (this[_H].map((Z) => Z[sEA]).reduce((Z, I) => Z && I, !0)) return;
      let B = 0,
        G = this[_H].findIndex((Z) => !Z[sEA]);
      while (B++ < this[_H].length) {
        this[mo] = (this[mo] + 1) % this[_H].length;
        let Z = this[_H][this[mo]];
        if (Z[tL] > this[_H][G][tL] && !Z[sEA]) G = this[mo];
        if (this[mo] === 0) {
          if (this[uo] = this[uo] - this[G0B], this[uo] <= 0) this[uo] = this[NlA]
        }
        if (Z[tL] >= this[uo] && !Z[sEA]) return Z
      }
      return this[uo] = this[_H][G][tL], this[mo] = G, this[_H][G]
    }
  }
  I0B.exports = Z0B
})
// @from(Start 4877922, End 4880606)
F3A = z((RS7, H0B) => {
  var {
    InvalidArgumentError: MlA
  } = R7(), {
    kClients: wc,
    kRunning: J0B,
    kClose: Wc8,
    kDestroy: Xc8,
    kDispatch: Vc8,
    kInterceptors: Fc8
  } = tI(), Kc8 = a5A(), Dc8 = V3A(), Hc8 = iEA(), Cc8 = S6(), Ec8 = $lA(), W0B = Symbol("onConnect"), X0B = Symbol("onDisconnect"), V0B = Symbol("onConnectionError"), zc8 = Symbol("maxRedirections"), F0B = Symbol("onDrain"), K0B = Symbol("factory"), qx1 = Symbol("options");

  function Uc8(A, Q) {
    return Q && Q.connections === 1 ? new Hc8(A, Q) : new Dc8(A, Q)
  }
  class D0B extends Kc8 {
    constructor({
      factory: A = Uc8,
      maxRedirections: Q = 0,
      connect: B,
      ...G
    } = {}) {
      super();
      if (typeof A !== "function") throw new MlA("factory must be a function.");
      if (B != null && typeof B !== "function" && typeof B !== "object") throw new MlA("connect must be a function or an object");
      if (!Number.isInteger(Q) || Q < 0) throw new MlA("maxRedirections must be a positive number");
      if (B && typeof B !== "function") B = {
        ...B
      };
      this[Fc8] = G.interceptors?.Agent && Array.isArray(G.interceptors.Agent) ? G.interceptors.Agent : [Ec8({
        maxRedirections: Q
      })], this[qx1] = {
        ...Cc8.deepClone(G),
        connect: B
      }, this[qx1].interceptors = G.interceptors ? {
        ...G.interceptors
      } : void 0, this[zc8] = Q, this[K0B] = A, this[wc] = new Map, this[F0B] = (Z, I) => {
        this.emit("drain", Z, [this, ...I])
      }, this[W0B] = (Z, I) => {
        this.emit("connect", Z, [this, ...I])
      }, this[X0B] = (Z, I, Y) => {
        this.emit("disconnect", Z, [this, ...I], Y)
      }, this[V0B] = (Z, I, Y) => {
        this.emit("connectionError", Z, [this, ...I], Y)
      }
    }
    get[J0B]() {
      let A = 0;
      for (let Q of this[wc].values()) A += Q[J0B];
      return A
    } [Vc8](A, Q) {
      let B;
      if (A.origin && (typeof A.origin === "string" || A.origin instanceof URL)) B = String(A.origin);
      else throw new MlA("opts.origin must be a non-empty string or URL.");
      let G = this[wc].get(B);
      if (!G) G = this[K0B](A.origin, this[qx1]).on("drain", this[F0B]).on("connect", this[W0B]).on("disconnect", this[X0B]).on("connectionError", this[V0B]), this[wc].set(B, G);
      return G.dispatch(A, Q)
    }
    async [Wc8]() {
      let A = [];
      for (let Q of this[wc].values()) A.push(Q.close());
      this[wc].clear(), await Promise.all(A)
    }
    async [Xc8](A) {
      let Q = [];
      for (let B of this[wc].values()) Q.push(B.destroy(A));
      this[wc].clear(), await Promise.all(Q)
    }
  }
  H0B.exports = D0B
})