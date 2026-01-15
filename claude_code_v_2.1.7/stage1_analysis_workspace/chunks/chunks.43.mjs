
// @from(Ln 110097, Col 4)
zL = U((tJG, ulQ) => {
  var {
    Transform: BK3
  } = NA("node:stream"), OlQ = NA("node:zlib"), {
    redirectStatusSet: GK3,
    referrerPolicySet: ZK3,
    badPortsSet: YK3
  } = qLA(), {
    getGlobalOrigin: MlQ
  } = wd1(), {
    collectASequenceOfCodePoints: p0A,
    collectAnHTTPQuotedString: JK3,
    removeChars: XK3,
    parseMIMEType: IK3
  } = bq(), {
    performance: DK3
  } = NA("node:perf_hooks"), {
    isBlobLike: WK3,
    ReadableStreamFrom: KK3,
    isValidHTTPToken: RlQ,
    normalizedMethodRecordsBase: VK3
  } = b8(), l0A = NA("node:assert"), {
    isUint8Array: FK3
  } = NA("node:util/types"), {
    webidl: wLA
  } = xH(), _lQ = [], MtA;
  try {
    MtA = NA("node:crypto");
    let A = ["sha256", "sha384", "sha512"];
    _lQ = MtA.getHashes().filter((Q) => A.includes(Q))
  } catch {}

  function jlQ(A) {
    let Q = A.urlList,
      B = Q.length;
    return B === 0 ? null : Q[B - 1].toString()
  }

  function HK3(A, Q) {
    if (!GK3.has(A.status)) return null;
    let B = A.headersList.get("location", !0);
    if (B !== null && PlQ(B)) {
      if (!TlQ(B)) B = EK3(B);
      B = new URL(B, jlQ(A))
    }
    if (B && !B.hash) B.hash = Q;
    return B
  }

  function TlQ(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (B > 126 || B < 32) return !1
    }
    return !0
  }

  function EK3(A) {
    return Buffer.from(A, "binary").toString("utf8")
  }

  function OLA(A) {
    return A.urlList[A.urlList.length - 1]
  }

  function zK3(A) {
    let Q = OLA(A);
    if (klQ(Q) && YK3.has(Q.port)) return "blocked";
    return "allowed"
  }

  function $K3(A) {
    return A instanceof Error || (A?.constructor?.name === "Error" || A?.constructor?.name === "DOMException")
  }

  function CK3(A) {
    for (let Q = 0; Q < A.length; ++Q) {
      let B = A.charCodeAt(Q);
      if (!(B === 9 || B >= 32 && B <= 126 || B >= 128 && B <= 255)) return !1
    }
    return !0
  }
  var UK3 = RlQ;

  function PlQ(A) {
    return (A[0] === "\t" || A[0] === " " || A[A.length - 1] === "\t" || A[A.length - 1] === " " || A.includes(`
`) || A.includes("\r") || A.includes("\x00")) === !1
  }

  function qK3(A, Q) {
    let {
      headersList: B
    } = Q, G = (B.get("referrer-policy", !0) ?? "").split(","), Z = "";
    if (G.length > 0)
      for (let Y = G.length; Y !== 0; Y--) {
        let J = G[Y - 1].trim();
        if (ZK3.has(J)) {
          Z = J;
          break
        }
      }
    if (Z !== "") A.referrerPolicy = Z
  }

  function NK3() {
    return "allowed"
  }

  function wK3() {
    return "success"
  }

  function LK3() {
    return "success"
  }

  function OK3(A) {
    let Q = null;
    Q = A.mode, A.headersList.set("sec-fetch-mode", Q, !0)
  }

  function MK3(A) {
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
          if (A.origin && Rd1(A.origin) && !Rd1(OLA(A))) Q = null;
          break;
        case "same-origin":
          if (!RtA(A, OLA(A))) Q = null;
          break;
        default:
      }
      A.headersList.append("origin", Q, !0)
    }
  }

  function JJA(A, Q) {
    return A
  }

  function RK3(A, Q, B) {
    if (!A?.startTime || A.startTime < Q) return {
      domainLookupStartTime: Q,
      domainLookupEndTime: Q,
      connectionStartTime: Q,
      connectionEndTime: Q,
      secureConnectionStartTime: Q,
      ALPNNegotiatedProtocol: A?.ALPNNegotiatedProtocol
    };
    return {
      domainLookupStartTime: JJA(A.domainLookupStartTime, B),
      domainLookupEndTime: JJA(A.domainLookupEndTime, B),
      connectionStartTime: JJA(A.connectionStartTime, B),
      connectionEndTime: JJA(A.connectionEndTime, B),
      secureConnectionStartTime: JJA(A.secureConnectionStartTime, B),
      ALPNNegotiatedProtocol: A.ALPNNegotiatedProtocol
    }
  }

  function _K3(A) {
    return JJA(DK3.now(), A)
  }

  function jK3(A) {
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

  function SlQ() {
    return {
      referrerPolicy: "strict-origin-when-cross-origin"
    }
  }

  function TK3(A) {
    return {
      referrerPolicy: A.referrerPolicy
    }
  }

  function PK3(A) {
    let Q = A.referrerPolicy;
    l0A(Q);
    let B = null;
    if (A.referrer === "client") {
      let X = MlQ();
      if (!X || X.origin === "null") return "no-referrer";
      B = new URL(X)
    } else if (A.referrer instanceof URL) B = A.referrer;
    let G = Md1(B),
      Z = Md1(B, !0);
    if (G.toString().length > 4096) G = Z;
    let Y = RtA(A, G),
      J = LLA(G) && !LLA(A.url);
    switch (Q) {
      case "origin":
        return Z != null ? Z : Md1(B, !0);
      case "unsafe-url":
        return G;
      case "same-origin":
        return Y ? Z : "no-referrer";
      case "origin-when-cross-origin":
        return Y ? G : Z;
      case "strict-origin-when-cross-origin": {
        let X = OLA(A);
        if (RtA(G, X)) return G;
        if (LLA(G) && !LLA(X)) return "no-referrer";
        return Z
      }
      case "strict-origin":
      case "no-referrer-when-downgrade":
      default:
        return J ? "no-referrer" : Z
    }
  }

  function Md1(A, Q) {
    if (l0A(A instanceof URL), A = new URL(A), A.protocol === "file:" || A.protocol === "about:" || A.protocol === "blank:") return "no-referrer";
    if (A.username = "", A.password = "", A.hash = "", Q) A.pathname = "", A.search = "";
    return A
  }

  function LLA(A) {
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

  function SK3(A, Q) {
    if (MtA === void 0) return !0;
    let B = xlQ(Q);
    if (B === "no metadata") return !0;
    if (B.length === 0) return !0;
    let G = yK3(B),
      Z = vK3(B, G);
    for (let Y of Z) {
      let {
        algo: J,
        hash: X
      } = Y, I = MtA.createHash(J).update(A).digest("base64");
      if (I[I.length - 1] === "=")
        if (I[I.length - 2] === "=") I = I.slice(0, -2);
        else I = I.slice(0, -1);
      if (kK3(I, X)) return !0
    }
    return !1
  }
  var xK3 = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;

  function xlQ(A) {
    let Q = [],
      B = !0;
    for (let G of A.split(" ")) {
      B = !1;
      let Z = xK3.exec(G);
      if (Z === null || Z.groups === void 0 || Z.groups.algo === void 0) continue;
      let Y = Z.groups.algo.toLowerCase();
      if (_lQ.includes(Y)) Q.push(Z.groups)
    }
    if (B === !0) return "no metadata";
    return Q
  }

  function yK3(A) {
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

  function vK3(A, Q) {
    if (A.length === 1) return A;
    let B = 0;
    for (let G = 0; G < A.length; ++G)
      if (A[G].algo === Q) A[B++] = A[G];
    return A.length = B, A
  }

  function kK3(A, Q) {
    if (A.length !== Q.length) return !1;
    for (let B = 0; B < A.length; ++B)
      if (A[B] !== Q[B]) {
        if (A[B] === "+" && Q[B] === "-" || A[B] === "/" && Q[B] === "_") continue;
        return !1
      } return !0
  }

  function bK3(A) {}

  function RtA(A, Q) {
    if (A.origin === Q.origin && A.origin === "null") return !0;
    if (A.protocol === Q.protocol && A.hostname === Q.hostname && A.port === Q.port) return !0;
    return !1
  }

  function fK3() {
    let A, Q;
    return {
      promise: new Promise((G, Z) => {
        A = G, Q = Z
      }),
      resolve: A,
      reject: Q
    }
  }

  function hK3(A) {
    return A.controller.state === "aborted"
  }

  function gK3(A) {
    return A.controller.state === "aborted" || A.controller.state === "terminated"
  }

  function uK3(A) {
    return VK3[A.toLowerCase()] ?? A
  }

  function mK3(A) {
    let Q = JSON.stringify(A);
    if (Q === void 0) throw TypeError("Value is not JSON serializable");
    return l0A(typeof Q === "string"), Q
  }
  var dK3 = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

  function ylQ(A, Q, B = 0, G = 1) {
    class Z {
      #A;
      #Q;
      #B;
      constructor(Y, J) {
        this.#A = Y, this.#Q = J, this.#B = 0
      }
      next() {
        if (typeof this !== "object" || this === null || !(#A in this)) throw TypeError(`'next' called on an object that does not implement interface ${A} Iterator.`);
        let Y = this.#B,
          J = this.#A[Q],
          X = J.length;
        if (Y >= X) return {
          value: void 0,
          done: !0
        };
        let {
          [B]: I, [G]: D
        } = J[Y];
        this.#B = Y + 1;
        let W;
        switch (this.#Q) {
          case "key":
            W = I;
            break;
          case "value":
            W = D;
            break;
          case "key+value":
            W = [I, D];
            break
        }
        return {
          value: W,
          done: !1
        }
      }
    }
    return delete Z.prototype.constructor, Object.setPrototypeOf(Z.prototype, dK3), Object.defineProperties(Z.prototype, {
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
      function (Y, J) {
        return new Z(Y, J)
      }
  }

  function cK3(A, Q, B, G = 0, Z = 1) {
    let Y = ylQ(A, B, G, Z),
      J = {
        keys: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function () {
            return wLA.brandCheck(this, Q), Y(this, "key")
          }
        },
        values: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function () {
            return wLA.brandCheck(this, Q), Y(this, "value")
          }
        },
        entries: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function () {
            return wLA.brandCheck(this, Q), Y(this, "key+value")
          }
        },
        forEach: {
          writable: !0,
          enumerable: !0,
          configurable: !0,
          value: function (I, D = globalThis) {
            if (wLA.brandCheck(this, Q), wLA.argumentLengthCheck(arguments, 1, `${A}.forEach`), typeof I !== "function") throw TypeError(`Failed to execute 'forEach' on '${A}': parameter 1 is not of type 'Function'.`);
            for (let {
                0: W,
                1: K
              }
              of Y(this, "key+value")) I.call(D, K, W, this)
          }
        }
      };
    return Object.defineProperties(Q.prototype, {
      ...J,
      [Symbol.iterator]: {
        writable: !0,
        enumerable: !1,
        configurable: !0,
        value: J.entries.value
      }
    })
  }
  async function pK3(A, Q, B) {
    let G = Q,
      Z = B,
      Y;
    try {
      Y = A.stream.getReader()
    } catch (J) {
      Z(J);
      return
    }
    try {
      G(await vlQ(Y))
    } catch (J) {
      Z(J)
    }
  }

  function lK3(A) {
    return A instanceof ReadableStream || A[Symbol.toStringTag] === "ReadableStream" && typeof A.tee === "function"
  }

  function iK3(A) {
    try {
      A.close(), A.byobRequest?.respond(0)
    } catch (Q) {
      if (!Q.message.includes("Controller is already closed") && !Q.message.includes("ReadableStream is already closed")) throw Q
    }
  }
  var nK3 = /[^\x00-\xFF]/;

  function OtA(A) {
    return l0A(!nK3.test(A)), A
  }
  async function vlQ(A) {
    let Q = [],
      B = 0;
    while (!0) {
      let {
        done: G,
        value: Z
      } = await A.read();
      if (G) return Buffer.concat(Q, B);
      if (!FK3(Z)) throw TypeError("Received non-Uint8Array chunk");
      Q.push(Z), B += Z.length
    }
  }

  function aK3(A) {
    l0A("protocol" in A);
    let Q = A.protocol;
    return Q === "about:" || Q === "blob:" || Q === "data:"
  }

  function Rd1(A) {
    return typeof A === "string" && A[5] === ":" && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && A[4] === "s" || A.protocol === "https:"
  }

  function klQ(A) {
    l0A("protocol" in A);
    let Q = A.protocol;
    return Q === "http:" || Q === "https:"
  }

  function oK3(A, Q) {
    let B = A;
    if (!B.startsWith("bytes")) return "failure";
    let G = {
      position: 5
    };
    if (Q) p0A((I) => I === "\t" || I === " ", B, G);
    if (B.charCodeAt(G.position) !== 61) return "failure";
    if (G.position++, Q) p0A((I) => I === "\t" || I === " ", B, G);
    let Z = p0A((I) => {
        let D = I.charCodeAt(0);
        return D >= 48 && D <= 57
      }, B, G),
      Y = Z.length ? Number(Z) : null;
    if (Q) p0A((I) => I === "\t" || I === " ", B, G);
    if (B.charCodeAt(G.position) !== 45) return "failure";
    if (G.position++, Q) p0A((I) => I === "\t" || I === " ", B, G);
    let J = p0A((I) => {
        let D = I.charCodeAt(0);
        return D >= 48 && D <= 57
      }, B, G),
      X = J.length ? Number(J) : null;
    if (G.position < B.length) return "failure";
    if (X === null && Y === null) return "failure";
    if (Y > X) return "failure";
    return {
      rangeStartValue: Y,
      rangeEndValue: X
    }
  }

  function rK3(A, Q, B) {
    let G = "bytes ";
    return G += OtA(`${A}`), G += "-", G += OtA(`${Q}`), G += "/", G += OtA(`${B}`), G
  }
  class blQ extends BK3 {
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
        this._inflateStream = (A[0] & 15) === 8 ? OlQ.createInflate(this.#A) : OlQ.createInflateRaw(this.#A), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (G) => this.destroy(G))
      }
      this._inflateStream.write(A, Q, B)
    }
    _final(A) {
      if (this._inflateStream) this._inflateStream.end(), this._inflateStream = null;
      A()
    }
  }

  function sK3(A) {
    return new blQ(A)
  }

  function tK3(A) {
    let Q = null,
      B = null,
      G = null,
      Z = flQ("content-type", A);
    if (Z === null) return "failure";
    for (let Y of Z) {
      let J = IK3(Y);
      if (J === "failure" || J.essence === "*/*") continue;
      if (G = J, G.essence !== B) {
        if (Q = null, G.parameters.has("charset")) Q = G.parameters.get("charset");
        B = G.essence
      } else if (!G.parameters.has("charset") && Q !== null) G.parameters.set("charset", Q)
    }
    if (G == null) return "failure";
    return G
  }

  function eK3(A) {
    let Q = A,
      B = {
        position: 0
      },
      G = [],
      Z = "";
    while (B.position < Q.length) {
      if (Z += p0A((Y) => Y !== '"' && Y !== ",", Q, B), B.position < Q.length)
        if (Q.charCodeAt(B.position) === 34) {
          if (Z += JK3(Q, B), B.position < Q.length) continue
        } else l0A(Q.charCodeAt(B.position) === 44), B.position++;
      Z = XK3(Z, !0, !0, (Y) => Y === 9 || Y === 32), G.push(Z), Z = ""
    }
    return G
  }

  function flQ(A, Q) {
    let B = Q.get(A, !0);
    if (B === null) return null;
    return eK3(B)
  }
  var AV3 = new TextDecoder;

  function QV3(A) {
    if (A.length === 0) return "";
    if (A[0] === 239 && A[1] === 187 && A[2] === 191) A = A.subarray(3);
    return AV3.decode(A)
  }
  class hlQ {
    get baseUrl() {
      return MlQ()
    }
    get origin() {
      return this.baseUrl?.origin
    }
    policyContainer = SlQ()
  }
  class glQ {
    settingsObject = new hlQ
  }
  var BV3 = new glQ;
  ulQ.exports = {
    isAborted: hK3,
    isCancelled: gK3,
    isValidEncodedURL: TlQ,
    createDeferredPromise: fK3,
    ReadableStreamFrom: KK3,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: bK3,
    clampAndCoarsenConnectionTimingInfo: RK3,
    coarsenedSharedCurrentTime: _K3,
    determineRequestsReferrer: PK3,
    makePolicyContainer: SlQ,
    clonePolicyContainer: TK3,
    appendFetchMetadata: OK3,
    appendRequestOriginHeader: MK3,
    TAOCheck: LK3,
    corsCheck: wK3,
    crossOriginResourcePolicyCheck: NK3,
    createOpaqueTimingInfo: jK3,
    setRequestReferrerPolicyOnRedirect: qK3,
    isValidHTTPToken: RlQ,
    requestBadPort: zK3,
    requestCurrentURL: OLA,
    responseURL: jlQ,
    responseLocationURL: HK3,
    isBlobLike: WK3,
    isURLPotentiallyTrustworthy: LLA,
    isValidReasonPhrase: CK3,
    sameOrigin: RtA,
    normalizeMethod: uK3,
    serializeJavascriptValueToJSONString: mK3,
    iteratorMixin: cK3,
    createIterator: ylQ,
    isValidHeaderName: UK3,
    isValidHeaderValue: PlQ,
    isErrorLike: $K3,
    fullyReadBody: pK3,
    bytesMatch: SK3,
    isReadableStreamLike: lK3,
    readableStreamClose: iK3,
    isomorphicEncode: OtA,
    urlIsLocal: aK3,
    urlHasHttpsScheme: Rd1,
    urlIsHttpHttpsScheme: klQ,
    readAllBytes: vlQ,
    simpleRangeHeaderValue: oK3,
    buildContentRange: rK3,
    parseMetadata: xlQ,
    createInflate: sK3,
    extractMimeType: tK3,
    getDecodeSplit: flQ,
    utf8DecodeBytes: QV3,
    environmentSettingsObject: BV3
  }
})
// @from(Ln 110804, Col 4)
Cn = U((eJG, mlQ) => {
  mlQ.exports = {
    kUrl: Symbol("url"),
    kHeaders: Symbol("headers"),
    kSignal: Symbol("signal"),
    kState: Symbol("state"),
    kDispatcher: Symbol("dispatcher")
  }
})
// @from(Ln 110813, Col 4)
_d1 = U((AXG, dlQ) => {
  var {
    Blob: GV3,
    File: ZV3
  } = NA("node:buffer"), {
    kState: Fu
  } = Cn(), {
    webidl: uv
  } = xH();
  class mv {
    constructor(A, Q, B = {}) {
      let G = Q,
        Z = B.type,
        Y = B.lastModified ?? Date.now();
      this[Fu] = {
        blobLike: A,
        name: G,
        type: Z,
        lastModified: Y
      }
    }
    stream(...A) {
      return uv.brandCheck(this, mv), this[Fu].blobLike.stream(...A)
    }
    arrayBuffer(...A) {
      return uv.brandCheck(this, mv), this[Fu].blobLike.arrayBuffer(...A)
    }
    slice(...A) {
      return uv.brandCheck(this, mv), this[Fu].blobLike.slice(...A)
    }
    text(...A) {
      return uv.brandCheck(this, mv), this[Fu].blobLike.text(...A)
    }
    get size() {
      return uv.brandCheck(this, mv), this[Fu].blobLike.size
    }
    get type() {
      return uv.brandCheck(this, mv), this[Fu].blobLike.type
    }
    get name() {
      return uv.brandCheck(this, mv), this[Fu].name
    }
    get lastModified() {
      return uv.brandCheck(this, mv), this[Fu].lastModified
    }
    get[Symbol.toStringTag]() {
      return "File"
    }
  }
  uv.converters.Blob = uv.interfaceConverter(GV3);

  function YV3(A) {
    return A instanceof ZV3 || A && (typeof A.stream === "function" || typeof A.arrayBuffer === "function") && A[Symbol.toStringTag] === "File"
  }
  dlQ.exports = {
    FileLike: mv,
    isFileLike: YV3
  }
})
// @from(Ln 110872, Col 4)
MLA = U((QXG, nlQ) => {
  var {
    isBlobLike: _tA,
    iteratorMixin: JV3
  } = zL(), {
    kState: DC
  } = Cn(), {
    kEnumerableProperty: XJA
  } = b8(), {
    FileLike: clQ,
    isFileLike: XV3
  } = _d1(), {
    webidl: uY
  } = xH(), {
    File: ilQ
  } = NA("node:buffer"), plQ = NA("node:util"), llQ = globalThis.File ?? ilQ;
  class dv {
    constructor(A) {
      if (uY.util.markAsUncloneable(this), A !== void 0) throw uY.errors.conversionFailed({
        prefix: "FormData constructor",
        argument: "Argument 1",
        types: ["undefined"]
      });
      this[DC] = []
    }
    append(A, Q, B = void 0) {
      uY.brandCheck(this, dv);
      let G = "FormData.append";
      if (uY.argumentLengthCheck(arguments, 2, G), arguments.length === 3 && !_tA(Q)) throw TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");
      A = uY.converters.USVString(A, G, "name"), Q = _tA(Q) ? uY.converters.Blob(Q, G, "value", {
        strict: !1
      }) : uY.converters.USVString(Q, G, "value"), B = arguments.length === 3 ? uY.converters.USVString(B, G, "filename") : void 0;
      let Z = jd1(A, Q, B);
      this[DC].push(Z)
    }
    delete(A) {
      uY.brandCheck(this, dv);
      let Q = "FormData.delete";
      uY.argumentLengthCheck(arguments, 1, Q), A = uY.converters.USVString(A, Q, "name"), this[DC] = this[DC].filter((B) => B.name !== A)
    }
    get(A) {
      uY.brandCheck(this, dv);
      let Q = "FormData.get";
      uY.argumentLengthCheck(arguments, 1, Q), A = uY.converters.USVString(A, Q, "name");
      let B = this[DC].findIndex((G) => G.name === A);
      if (B === -1) return null;
      return this[DC][B].value
    }
    getAll(A) {
      uY.brandCheck(this, dv);
      let Q = "FormData.getAll";
      return uY.argumentLengthCheck(arguments, 1, Q), A = uY.converters.USVString(A, Q, "name"), this[DC].filter((B) => B.name === A).map((B) => B.value)
    }
    has(A) {
      uY.brandCheck(this, dv);
      let Q = "FormData.has";
      return uY.argumentLengthCheck(arguments, 1, Q), A = uY.converters.USVString(A, Q, "name"), this[DC].findIndex((B) => B.name === A) !== -1
    }
    set(A, Q, B = void 0) {
      uY.brandCheck(this, dv);
      let G = "FormData.set";
      if (uY.argumentLengthCheck(arguments, 2, G), arguments.length === 3 && !_tA(Q)) throw TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");
      A = uY.converters.USVString(A, G, "name"), Q = _tA(Q) ? uY.converters.Blob(Q, G, "name", {
        strict: !1
      }) : uY.converters.USVString(Q, G, "name"), B = arguments.length === 3 ? uY.converters.USVString(B, G, "name") : void 0;
      let Z = jd1(A, Q, B),
        Y = this[DC].findIndex((J) => J.name === A);
      if (Y !== -1) this[DC] = [...this[DC].slice(0, Y), Z, ...this[DC].slice(Y + 1).filter((J) => J.name !== A)];
      else this[DC].push(Z)
    } [plQ.inspect.custom](A, Q) {
      let B = this[DC].reduce((Z, Y) => {
        if (Z[Y.name])
          if (Array.isArray(Z[Y.name])) Z[Y.name].push(Y.value);
          else Z[Y.name] = [Z[Y.name], Y.value];
        else Z[Y.name] = Y.value;
        return Z
      }, {
        __proto__: null
      });
      Q.depth ??= A, Q.colors ??= !0;
      let G = plQ.formatWithOptions(Q, B);
      return `FormData ${G.slice(G.indexOf("]")+2)}`
    }
  }
  JV3("FormData", dv, DC, "name", "value");
  Object.defineProperties(dv.prototype, {
    append: XJA,
    delete: XJA,
    get: XJA,
    getAll: XJA,
    has: XJA,
    set: XJA,
    [Symbol.toStringTag]: {
      value: "FormData",
      configurable: !0
    }
  });

  function jd1(A, Q, B) {
    if (typeof Q === "string");
    else {
      if (!XV3(Q)) Q = Q instanceof Blob ? new llQ([Q], "blob", {
        type: Q.type
      }) : new clQ(Q, "blob", {
        type: Q.type
      });
      if (B !== void 0) {
        let G = {
          type: Q.type,
          lastModified: Q.lastModified
        };
        Q = Q instanceof ilQ ? new llQ([Q], B, G) : new clQ(Q, B, G)
      }
    }
    return {
      name: A,
      value: Q
    }
  }
  nlQ.exports = {
    FormData: dv,
    makeEntry: jd1
  }
})
// @from(Ln 110996, Col 4)
elQ = U((BXG, tlQ) => {
  var {
    isUSVString: alQ,
    bufferToLowerCasedHeaderName: IV3
  } = b8(), {
    utf8DecodeBytes: DV3
  } = zL(), {
    HTTP_TOKEN_CODEPOINTS: WV3,
    isomorphicDecode: olQ
  } = bq(), {
    isFileLike: KV3
  } = _d1(), {
    makeEntry: VV3
  } = MLA(), jtA = NA("node:assert"), {
    File: FV3
  } = NA("node:buffer"), HV3 = globalThis.File ?? FV3, EV3 = Buffer.from('form-data; name="'), rlQ = Buffer.from("; filename"), zV3 = Buffer.from("--"), $V3 = Buffer.from(`--\r
`);

  function CV3(A) {
    for (let Q = 0; Q < A.length; ++Q)
      if ((A.charCodeAt(Q) & -128) !== 0) return !1;
    return !0
  }

  function UV3(A) {
    let Q = A.length;
    if (Q < 27 || Q > 70) return !1;
    for (let B = 0; B < Q; ++B) {
      let G = A.charCodeAt(B);
      if (!(G >= 48 && G <= 57 || G >= 65 && G <= 90 || G >= 97 && G <= 122 || G === 39 || G === 45 || G === 95)) return !1
    }
    return !0
  }

  function qV3(A, Q) {
    jtA(Q !== "failure" && Q.essence === "multipart/form-data");
    let B = Q.parameters.get("boundary");
    if (B === void 0) return "failure";
    let G = Buffer.from(`--${B}`, "utf8"),
      Z = [],
      Y = {
        position: 0
      };
    while (A[Y.position] === 13 && A[Y.position + 1] === 10) Y.position += 2;
    let J = A.length;
    while (A[J - 1] === 10 && A[J - 2] === 13) J -= 2;
    if (J !== A.length) A = A.subarray(0, J);
    while (!0) {
      if (A.subarray(Y.position, Y.position + G.length).equals(G)) Y.position += G.length;
      else return "failure";
      if (Y.position === A.length - 2 && TtA(A, zV3, Y) || Y.position === A.length - 4 && TtA(A, $V3, Y)) return Z;
      if (A[Y.position] !== 13 || A[Y.position + 1] !== 10) return "failure";
      Y.position += 2;
      let X = NV3(A, Y);
      if (X === "failure") return "failure";
      let {
        name: I,
        filename: D,
        contentType: W,
        encoding: K
      } = X;
      Y.position += 2;
      let V;
      {
        let H = A.indexOf(G.subarray(2), Y.position);
        if (H === -1) return "failure";
        if (V = A.subarray(Y.position, H - 4), Y.position += V.length, K === "base64") V = Buffer.from(V.toString(), "base64")
      }
      if (A[Y.position] !== 13 || A[Y.position + 1] !== 10) return "failure";
      else Y.position += 2;
      let F;
      if (D !== null) {
        if (W ??= "text/plain", !CV3(W)) W = "";
        F = new HV3([V], D, {
          type: W
        })
      } else F = DV3(Buffer.from(V));
      jtA(alQ(I)), jtA(typeof F === "string" && alQ(F) || KV3(F)), Z.push(VV3(I, F, D))
    }
  }

  function NV3(A, Q) {
    let B = null,
      G = null,
      Z = null,
      Y = null;
    while (!0) {
      if (A[Q.position] === 13 && A[Q.position + 1] === 10) {
        if (B === null) return "failure";
        return {
          name: B,
          filename: G,
          contentType: Z,
          encoding: Y
        }
      }
      let J = IJA((X) => X !== 10 && X !== 13 && X !== 58, A, Q);
      if (J = Td1(J, !0, !0, (X) => X === 9 || X === 32), !WV3.test(J.toString())) return "failure";
      if (A[Q.position] !== 58) return "failure";
      switch (Q.position++, IJA((X) => X === 32 || X === 9, A, Q), IV3(J)) {
        case "content-disposition": {
          if (B = G = null, !TtA(A, EV3, Q)) return "failure";
          if (Q.position += 17, B = slQ(A, Q), B === null) return "failure";
          if (TtA(A, rlQ, Q)) {
            let X = Q.position + rlQ.length;
            if (A[X] === 42) Q.position += 1, X += 1;
            if (A[X] !== 61 || A[X + 1] !== 34) return "failure";
            if (Q.position += 12, G = slQ(A, Q), G === null) return "failure"
          }
          break
        }
        case "content-type": {
          let X = IJA((I) => I !== 10 && I !== 13, A, Q);
          X = Td1(X, !1, !0, (I) => I === 9 || I === 32), Z = olQ(X);
          break
        }
        case "content-transfer-encoding": {
          let X = IJA((I) => I !== 10 && I !== 13, A, Q);
          X = Td1(X, !1, !0, (I) => I === 9 || I === 32), Y = olQ(X);
          break
        }
        default:
          IJA((X) => X !== 10 && X !== 13, A, Q)
      }
      if (A[Q.position] !== 13 && A[Q.position + 1] !== 10) return "failure";
      else Q.position += 2
    }
  }

  function slQ(A, Q) {
    jtA(A[Q.position - 1] === 34);
    let B = IJA((G) => G !== 10 && G !== 13 && G !== 34, A, Q);
    if (A[Q.position] !== 34) return null;
    else Q.position++;
    return B = new TextDecoder().decode(B).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), B
  }

  function IJA(A, Q, B) {
    let G = B.position;
    while (G < Q.length && A(Q[G])) ++G;
    return Q.subarray(B.position, B.position = G)
  }

  function Td1(A, Q, B, G) {
    let Z = 0,
      Y = A.length - 1;
    if (Q)
      while (Z < A.length && G(A[Z])) Z++;
    if (B)
      while (Y > 0 && G(A[Y])) Y--;
    return Z === 0 && Y === A.length - 1 ? A : A.subarray(Z, Y + 1)
  }

  function TtA(A, Q, B) {
    if (A.length < Q.length) return !1;
    for (let G = 0; G < Q.length; G++)
      if (Q[G] !== A[B.position + G]) return !1;
    return !0
  }
  tlQ.exports = {
    multipartFormDataParser: qV3,
    validateBoundary: UV3
  }
})
// @from(Ln 111161, Col 4)
KJA = U((GXG, XiQ) => {
  var RLA = b8(),
    {
      ReadableStreamFrom: wV3,
      isBlobLike: AiQ,
      isReadableStreamLike: LV3,
      readableStreamClose: OV3,
      createDeferredPromise: MV3,
      fullyReadBody: RV3,
      extractMimeType: _V3,
      utf8DecodeBytes: GiQ
    } = zL(),
    {
      FormData: QiQ
    } = MLA(),
    {
      kState: WJA
    } = Cn(),
    {
      webidl: jV3
    } = xH(),
    {
      Blob: TV3
    } = NA("node:buffer"),
    Pd1 = NA("node:assert"),
    {
      isErrored: ZiQ,
      isDisturbed: PV3
    } = NA("node:stream"),
    {
      isArrayBuffer: SV3
    } = NA("node:util/types"),
    {
      serializeAMimeType: xV3
    } = bq(),
    {
      multipartFormDataParser: yV3
    } = elQ(),
    Sd1;
  try {
    let A = NA("node:crypto");
    Sd1 = (Q) => A.randomInt(0, Q)
  } catch {
    Sd1 = (A) => Math.floor(Math.random(A))
  }
  var PtA = new TextEncoder;

  function vV3() {}
  var xd1 = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0,
    yd1;
  if (xd1) yd1 = new FinalizationRegistry((A) => {
    let Q = A.deref();
    if (Q && !Q.locked && !PV3(Q) && !ZiQ(Q)) Q.cancel("Response object has been garbage collected").catch(vV3)
  });

  function YiQ(A, Q = !1) {
    let B = null;
    if (A instanceof ReadableStream) B = A;
    else if (AiQ(A)) B = A.stream();
    else B = new ReadableStream({
      async pull(I) {
        let D = typeof Z === "string" ? PtA.encode(Z) : Z;
        if (D.byteLength) I.enqueue(D);
        queueMicrotask(() => OV3(I))
      },
      start() {},
      type: "bytes"
    });
    Pd1(LV3(B));
    let G = null,
      Z = null,
      Y = null,
      J = null;
    if (typeof A === "string") Z = A, J = "text/plain;charset=UTF-8";
    else if (A instanceof URLSearchParams) Z = A.toString(), J = "application/x-www-form-urlencoded;charset=UTF-8";
    else if (SV3(A)) Z = new Uint8Array(A.slice());
    else if (ArrayBuffer.isView(A)) Z = new Uint8Array(A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength));
    else if (RLA.isFormDataLike(A)) {
      let I = `----formdata-undici-0${`${Sd1(100000000000)}`.padStart(11,"0")}`,
        D = `--${I}\r
Content-Disposition: form-data`; /*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
      let W = (z) => z.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"),
        K = (z) => z.replace(/\r?\n|\r/g, `\r
`),
        V = [],
        F = new Uint8Array([13, 10]);
      Y = 0;
      let H = !1;
      for (let [z, $] of A)
        if (typeof $ === "string") {
          let O = PtA.encode(D + `; name="${W(K(z))}"\r
\r
${K($)}\r
`);
          V.push(O), Y += O.byteLength
        } else {
          let O = PtA.encode(`${D}; name="${W(K(z))}"` + ($.name ? `; filename="${W($.name)}"` : "") + `\r
Content-Type: ${$.type||"application/octet-stream"}\r
\r
`);
          if (V.push(O, $, F), typeof $.size === "number") Y += O.byteLength + $.size + F.byteLength;
          else H = !0
        } let E = PtA.encode(`--${I}--`);
      if (V.push(E), Y += E.byteLength, H) Y = null;
      Z = A, G = async function* () {
        for (let z of V)
          if (z.stream) yield* z.stream();
          else yield z
      }, J = `multipart/form-data; boundary=${I}`
    } else if (AiQ(A)) {
      if (Z = A, Y = A.size, A.type) J = A.type
    } else if (typeof A[Symbol.asyncIterator] === "function") {
      if (Q) throw TypeError("keepalive");
      if (RLA.isDisturbed(A) || A.locked) throw TypeError("Response body object should not be disturbed or locked");
      B = A instanceof ReadableStream ? A : wV3(A)
    }
    if (typeof Z === "string" || RLA.isBuffer(Z)) Y = Buffer.byteLength(Z);
    if (G != null) {
      let I;
      B = new ReadableStream({
        async start() {
          I = G(A)[Symbol.asyncIterator]()
        },
        async pull(D) {
          let {
            value: W,
            done: K
          } = await I.next();
          if (K) queueMicrotask(() => {
            D.close(), D.byobRequest?.respond(0)
          });
          else if (!ZiQ(B)) {
            let V = new Uint8Array(W);
            if (V.byteLength) D.enqueue(V)
          }
          return D.desiredSize > 0
        },
        async cancel(D) {
          await I.return()
        },
        type: "bytes"
      })
    }
    return [{
      stream: B,
      source: Z,
      length: Y
    }, J]
  }

  function kV3(A, Q = !1) {
    if (A instanceof ReadableStream) Pd1(!RLA.isDisturbed(A), "The body has already been consumed."), Pd1(!A.locked, "The stream is locked.");
    return YiQ(A, Q)
  }

  function bV3(A, Q) {
    let [B, G] = Q.stream.tee();
    if (xd1) yd1.register(A, new WeakRef(B));
    return Q.stream = B, {
      stream: G,
      length: Q.length,
      source: Q.source
    }
  }

  function fV3(A) {
    if (A.aborted) throw new DOMException("The operation was aborted.", "AbortError")
  }

  function hV3(A) {
    return {
      blob() {
        return DJA(this, (B) => {
          let G = BiQ(this);
          if (G === null) G = "";
          else if (G) G = xV3(G);
          return new TV3([B], {
            type: G
          })
        }, A)
      },
      arrayBuffer() {
        return DJA(this, (B) => {
          return new Uint8Array(B).buffer
        }, A)
      },
      text() {
        return DJA(this, GiQ, A)
      },
      json() {
        return DJA(this, uV3, A)
      },
      formData() {
        return DJA(this, (B) => {
          let G = BiQ(this);
          if (G !== null) switch (G.essence) {
            case "multipart/form-data": {
              let Z = yV3(B, G);
              if (Z === "failure") throw TypeError("Failed to parse body as FormData.");
              let Y = new QiQ;
              return Y[WJA] = Z, Y
            }
            case "application/x-www-form-urlencoded": {
              let Z = new URLSearchParams(B.toString()),
                Y = new QiQ;
              for (let [J, X] of Z) Y.append(J, X);
              return Y
            }
          }
          throw TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')
        }, A)
      },
      bytes() {
        return DJA(this, (B) => {
          return new Uint8Array(B)
        }, A)
      }
    }
  }

  function gV3(A) {
    Object.assign(A.prototype, hV3(A))
  }
  async function DJA(A, Q, B) {
    if (jV3.brandCheck(A, B), JiQ(A)) throw TypeError("Body is unusable: Body has already been read");
    fV3(A[WJA]);
    let G = MV3(),
      Z = (J) => G.reject(J),
      Y = (J) => {
        try {
          G.resolve(Q(J))
        } catch (X) {
          Z(X)
        }
      };
    if (A[WJA].body == null) return Y(Buffer.allocUnsafe(0)), G.promise;
    return await RV3(A[WJA].body, Y, Z), G.promise
  }

  function JiQ(A) {
    let Q = A[WJA].body;
    return Q != null && (Q.stream.locked || RLA.isDisturbed(Q.stream))
  }

  function uV3(A) {
    return JSON.parse(GiQ(A))
  }

  function BiQ(A) {
    let Q = A[WJA].headersList,
      B = _V3(Q);
    if (B === "failure") return null;
    return B
  }
  XiQ.exports = {
    extractBody: YiQ,
    safelyExtractBody: kV3,
    cloneBody: bV3,
    mixinBody: gV3,
    streamRegistry: yd1,
    hasFinalizationRegistry: xd1,
    bodyUnusable: JiQ
  }
})
// @from(Ln 111425, Col 4)
UiQ = U((ZXG, CiQ) => {
  var u4 = NA("node:assert"),
    d6 = b8(),
    {
      channels: IiQ
    } = tYA(),
    vd1 = Hd1(),
    {
      RequestContentLengthMismatchError: i0A,
      ResponseContentLengthMismatchError: mV3,
      RequestAbortedError: HiQ,
      HeadersTimeoutError: dV3,
      HeadersOverflowError: cV3,
      SocketError: btA,
      InformationalError: VJA,
      BodyTimeoutError: pV3,
      HTTPParserError: lV3,
      ResponseExceededMaxSizeError: iV3
    } = GG(),
    {
      kUrl: EiQ,
      kReset: fq,
      kClient: hd1,
      kParser: uI,
      kBlocking: TLA,
      kRunning: Hz,
      kPending: nV3,
      kSize: DiQ,
      kWriting: qn,
      kQueue: pT,
      kNoRef: _LA,
      kKeepAliveDefaultTimeout: aV3,
      kHostHeader: oV3,
      kPendingIdx: rV3,
      kRunningIdx: zR,
      kError: $R,
      kPipelining: vtA,
      kSocket: FJA,
      kKeepAliveTimeoutValue: ftA,
      kMaxHeadersSize: kd1,
      kKeepAliveMaxTimeout: sV3,
      kKeepAliveTimeoutThreshold: tV3,
      kHeadersTimeout: eV3,
      kBodyTimeout: AF3,
      kStrictContentLength: gd1,
      kMaxRequests: WiQ,
      kCounter: QF3,
      kMaxResponseSize: BF3,
      kOnError: GF3,
      kResume: Un,
      kHTTPContext: ziQ
    } = VX(),
    cv = GlQ(),
    ZF3 = Buffer.alloc(0),
    StA = Buffer[Symbol.species],
    xtA = d6.addListener,
    YF3 = d6.removeAllListeners,
    bd1;
  async function JF3() {
    let A = process.env.JEST_WORKER_ID ? qd1() : void 0,
      Q;
    try {
      Q = await WebAssembly.compile(JlQ())
    } catch (B) {
      Q = await WebAssembly.compile(A || qd1())
    }
    return await WebAssembly.instantiate(Q, {
      env: {
        wasm_on_url: (B, G, Z) => {
          return 0
        },
        wasm_on_status: (B, G, Z) => {
          u4(cK.ptr === B);
          let Y = G - lv + pv.byteOffset;
          return cK.onStatus(new StA(pv.buffer, Y, Z)) || 0
        },
        wasm_on_message_begin: (B) => {
          return u4(cK.ptr === B), cK.onMessageBegin() || 0
        },
        wasm_on_header_field: (B, G, Z) => {
          u4(cK.ptr === B);
          let Y = G - lv + pv.byteOffset;
          return cK.onHeaderField(new StA(pv.buffer, Y, Z)) || 0
        },
        wasm_on_header_value: (B, G, Z) => {
          u4(cK.ptr === B);
          let Y = G - lv + pv.byteOffset;
          return cK.onHeaderValue(new StA(pv.buffer, Y, Z)) || 0
        },
        wasm_on_headers_complete: (B, G, Z, Y) => {
          return u4(cK.ptr === B), cK.onHeadersComplete(G, Boolean(Z), Boolean(Y)) || 0
        },
        wasm_on_body: (B, G, Z) => {
          u4(cK.ptr === B);
          let Y = G - lv + pv.byteOffset;
          return cK.onBody(new StA(pv.buffer, Y, Z)) || 0
        },
        wasm_on_message_complete: (B) => {
          return u4(cK.ptr === B), cK.onMessageComplete() || 0
        }
      }
    })
  }
  var fd1 = null,
    ud1 = JF3();
  ud1.catch();
  var cK = null,
    pv = null,
    ytA = 0,
    lv = null,
    XF3 = 0,
    jLA = 1,
    HJA = 2 | jLA,
    ktA = 4 | jLA,
    md1 = 8 | XF3;
  class $iQ {
    constructor(A, Q, {
      exports: B
    }) {
      u4(Number.isFinite(A[kd1]) && A[kd1] > 0), this.llhttp = B, this.ptr = this.llhttp.llhttp_alloc(cv.TYPE.RESPONSE), this.client = A, this.socket = Q, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = A[kd1], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = A[BF3]
    }
    setTimeout(A, Q) {
      if (A !== this.timeoutValue || Q & jLA ^ this.timeoutType & jLA) {
        if (this.timeout) vd1.clearTimeout(this.timeout), this.timeout = null;
        if (A)
          if (Q & jLA) this.timeout = vd1.setFastTimeout(KiQ, A, new WeakRef(this));
          else this.timeout = setTimeout(KiQ, A, new WeakRef(this)), this.timeout.unref();
        this.timeoutValue = A
      } else if (this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      this.timeoutType = Q
    }
    resume() {
      if (this.socket.destroyed || !this.paused) return;
      if (u4(this.ptr != null), u4(cK == null), this.llhttp.llhttp_resume(this.ptr), u4(this.timeoutType === ktA), this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      this.paused = !1, this.execute(this.socket.read() || ZF3), this.readMore()
    }
    readMore() {
      while (!this.paused && this.ptr) {
        let A = this.socket.read();
        if (A === null) break;
        this.execute(A)
      }
    }
    execute(A) {
      u4(this.ptr != null), u4(cK == null), u4(!this.paused);
      let {
        socket: Q,
        llhttp: B
      } = this;
      if (A.length > ytA) {
        if (lv) B.free(lv);
        ytA = Math.ceil(A.length / 4096) * 4096, lv = B.malloc(ytA)
      }
      new Uint8Array(B.memory.buffer, lv, ytA).set(A);
      try {
        let G;
        try {
          pv = A, cK = this, G = B.llhttp_execute(this.ptr, lv, A.length)
        } catch (Y) {
          throw Y
        } finally {
          cK = null, pv = null
        }
        let Z = B.llhttp_get_error_pos(this.ptr) - lv;
        if (G === cv.ERROR.PAUSED_UPGRADE) this.onUpgrade(A.slice(Z));
        else if (G === cv.ERROR.PAUSED) this.paused = !0, Q.unshift(A.slice(Z));
        else if (G !== cv.ERROR.OK) {
          let Y = B.llhttp_get_error_reason(this.ptr),
            J = "";
          if (Y) {
            let X = new Uint8Array(B.memory.buffer, Y).indexOf(0);
            J = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(B.memory.buffer, Y, X).toString() + ")"
          }
          throw new lV3(J, cv.ERROR[G], A.slice(Z))
        }
      } catch (G) {
        d6.destroy(Q, G)
      }
    }
    destroy() {
      u4(this.ptr != null), u4(cK == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && vd1.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1
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
      let B = Q[pT][Q[zR]];
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
        let G = d6.bufferToLowerCasedHeaderName(B);
        if (G === "keep-alive") this.keepAlive += A.toString();
        else if (G === "connection") this.connection += A.toString()
      } else if (B.length === 14 && d6.bufferToLowerCasedHeaderName(B) === "content-length") this.contentLength += A.toString();
      this.trackHeader(A.length)
    }
    trackHeader(A) {
      if (this.headersSize += A, this.headersSize >= this.headersMaxSize) d6.destroy(this.socket, new cV3)
    }
    onUpgrade(A) {
      let {
        upgrade: Q,
        client: B,
        socket: G,
        headers: Z,
        statusCode: Y
      } = this;
      u4(Q), u4(B[FJA] === G), u4(!G.destroyed), u4(!this.paused), u4((Z.length & 1) === 0);
      let J = B[pT][B[zR]];
      u4(J), u4(J.upgrade || J.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, G.unshift(A), G[uI].destroy(), G[uI] = null, G[hd1] = null, G[$R] = null, YF3(G), B[FJA] = null, B[ziQ] = null, B[pT][B[zR]++] = null, B.emit("disconnect", B[EiQ], [B], new VJA("upgrade"));
      try {
        J.onUpgrade(Y, Z, G)
      } catch (X) {
        d6.destroy(G, X)
      }
      B[Un]()
    }
    onHeadersComplete(A, Q, B) {
      let {
        client: G,
        socket: Z,
        headers: Y,
        statusText: J
      } = this;
      if (Z.destroyed) return -1;
      let X = G[pT][G[zR]];
      if (!X) return -1;
      if (u4(!this.upgrade), u4(this.statusCode < 200), A === 100) return d6.destroy(Z, new btA("bad response", d6.getSocketInfo(Z))), -1;
      if (Q && !X.upgrade) return d6.destroy(Z, new btA("bad upgrade", d6.getSocketInfo(Z))), -1;
      if (u4(this.timeoutType === HJA), this.statusCode = A, this.shouldKeepAlive = B || X.method === "HEAD" && !Z[fq] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
        let D = X.bodyTimeout != null ? X.bodyTimeout : G[AF3];
        this.setTimeout(D, ktA)
      } else if (this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      if (X.method === "CONNECT") return u4(G[Hz] === 1), this.upgrade = !0, 2;
      if (Q) return u4(G[Hz] === 1), this.upgrade = !0, 2;
      if (u4((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && G[vtA]) {
        let D = this.keepAlive ? d6.parseKeepAliveTimeout(this.keepAlive) : null;
        if (D != null) {
          let W = Math.min(D - G[tV3], G[sV3]);
          if (W <= 0) Z[fq] = !0;
          else G[ftA] = W
        } else G[ftA] = G[aV3]
      } else Z[fq] = !0;
      let I = X.onHeaders(A, Y, this.resume, J) === !1;
      if (X.aborted) return -1;
      if (X.method === "HEAD") return 1;
      if (A < 200) return 1;
      if (Z[TLA]) Z[TLA] = !1, G[Un]();
      return I ? cv.ERROR.PAUSED : 0
    }
    onBody(A) {
      let {
        client: Q,
        socket: B,
        statusCode: G,
        maxResponseSize: Z
      } = this;
      if (B.destroyed) return -1;
      let Y = Q[pT][Q[zR]];
      if (u4(Y), u4(this.timeoutType === ktA), this.timeout) {
        if (this.timeout.refresh) this.timeout.refresh()
      }
      if (u4(G >= 200), Z > -1 && this.bytesRead + A.length > Z) return d6.destroy(B, new iV3), -1;
      if (this.bytesRead += A.length, Y.onData(A) === !1) return cv.ERROR.PAUSED
    }
    onMessageComplete() {
      let {
        client: A,
        socket: Q,
        statusCode: B,
        upgrade: G,
        headers: Z,
        contentLength: Y,
        bytesRead: J,
        shouldKeepAlive: X
      } = this;
      if (Q.destroyed && (!B || X)) return -1;
      if (G) return;
      u4(B >= 100), u4((this.headers.length & 1) === 0);
      let I = A[pT][A[zR]];
      if (u4(I), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, B < 200) return;
      if (I.method !== "HEAD" && Y && J !== parseInt(Y, 10)) return d6.destroy(Q, new mV3), -1;
      if (I.onComplete(Z), A[pT][A[zR]++] = null, Q[qn]) return u4(A[Hz] === 0), d6.destroy(Q, new VJA("reset")), cv.ERROR.PAUSED;
      else if (!X) return d6.destroy(Q, new VJA("reset")), cv.ERROR.PAUSED;
      else if (Q[fq] && A[Hz] === 0) return d6.destroy(Q, new VJA("reset")), cv.ERROR.PAUSED;
      else if (A[vtA] == null || A[vtA] === 1) setImmediate(() => A[Un]());
      else A[Un]()
    }
  }

  function KiQ(A) {
    let {
      socket: Q,
      timeoutType: B,
      client: G,
      paused: Z
    } = A.deref();
    if (B === HJA) {
      if (!Q[qn] || Q.writableNeedDrain || G[Hz] > 1) u4(!Z, "cannot be paused while waiting for headers"), d6.destroy(Q, new dV3)
    } else if (B === ktA) {
      if (!Z) d6.destroy(Q, new pV3)
    } else if (B === md1) u4(G[Hz] === 0 && G[ftA]), d6.destroy(Q, new VJA("socket idle timeout"))
  }
  async function IF3(A, Q) {
    if (A[FJA] = Q, !fd1) fd1 = await ud1, ud1 = null;
    Q[_LA] = !1, Q[qn] = !1, Q[fq] = !1, Q[TLA] = !1, Q[uI] = new $iQ(A, Q, fd1), xtA(Q, "error", function (G) {
      u4(G.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      let Z = this[uI];
      if (G.code === "ECONNRESET" && Z.statusCode && !Z.shouldKeepAlive) {
        Z.onMessageComplete();
        return
      }
      this[$R] = G, this[hd1][GF3](G)
    }), xtA(Q, "readable", function () {
      let G = this[uI];
      if (G) G.readMore()
    }), xtA(Q, "end", function () {
      let G = this[uI];
      if (G.statusCode && !G.shouldKeepAlive) {
        G.onMessageComplete();
        return
      }
      d6.destroy(this, new btA("other side closed", d6.getSocketInfo(this)))
    }), xtA(Q, "close", function () {
      let G = this[hd1],
        Z = this[uI];
      if (Z) {
        if (!this[$R] && Z.statusCode && !Z.shouldKeepAlive) Z.onMessageComplete();
        this[uI].destroy(), this[uI] = null
      }
      let Y = this[$R] || new btA("closed", d6.getSocketInfo(this));
      if (G[FJA] = null, G[ziQ] = null, G.destroyed) {
        u4(G[nV3] === 0);
        let J = G[pT].splice(G[zR]);
        for (let X = 0; X < J.length; X++) {
          let I = J[X];
          d6.errorRequest(G, I, Y)
        }
      } else if (G[Hz] > 0 && Y.code !== "UND_ERR_INFO") {
        let J = G[pT][G[zR]];
        G[pT][G[zR]++] = null, d6.errorRequest(G, J, Y)
      }
      G[rV3] = G[zR], u4(G[Hz] === 0), G.emit("disconnect", G[EiQ], [G], Y), G[Un]()
    });
    let B = !1;
    return Q.on("close", () => {
      B = !0
    }), {
      version: "h1",
      defaultPipelining: 1,
      write(...G) {
        return KF3(A, ...G)
      },
      resume() {
        DF3(A)
      },
      destroy(G, Z) {
        if (B) queueMicrotask(Z);
        else Q.destroy(G).on("close", Z)
      },
      get destroyed() {
        return Q.destroyed
      },
      busy(G) {
        if (Q[qn] || Q[fq] || Q[TLA]) return !0;
        if (G) {
          if (A[Hz] > 0 && !G.idempotent) return !0;
          if (A[Hz] > 0 && (G.upgrade || G.method === "CONNECT")) return !0;
          if (A[Hz] > 0 && d6.bodyLength(G.body) !== 0 && (d6.isStream(G.body) || d6.isAsyncIterable(G.body) || d6.isFormDataLike(G.body))) return !0
        }
        return !1
      }
    }
  }

  function DF3(A) {
    let Q = A[FJA];
    if (Q && !Q.destroyed) {
      if (A[DiQ] === 0) {
        if (!Q[_LA] && Q.unref) Q.unref(), Q[_LA] = !0
      } else if (Q[_LA] && Q.ref) Q.ref(), Q[_LA] = !1;
      if (A[DiQ] === 0) {
        if (Q[uI].timeoutType !== md1) Q[uI].setTimeout(A[ftA], md1)
      } else if (A[Hz] > 0 && Q[uI].statusCode < 200) {
        if (Q[uI].timeoutType !== HJA) {
          let B = A[pT][A[zR]],
            G = B.headersTimeout != null ? B.headersTimeout : A[eV3];
          Q[uI].setTimeout(G, HJA)
        }
      }
    }
  }

  function WF3(A) {
    return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
  }

  function KF3(A, Q) {
    let {
      method: B,
      path: G,
      host: Z,
      upgrade: Y,
      blocking: J,
      reset: X
    } = Q, {
      body: I,
      headers: D,
      contentLength: W
    } = Q, K = B === "PUT" || B === "POST" || B === "PATCH" || B === "QUERY" || B === "PROPFIND" || B === "PROPPATCH";
    if (d6.isFormDataLike(I)) {
      if (!bd1) bd1 = KJA().extractBody;
      let [z, $] = bd1(I);
      if (Q.contentType == null) D.push("content-type", $);
      I = z.stream, W = z.length
    } else if (d6.isBlobLike(I) && Q.contentType == null && I.type) D.push("content-type", I.type);
    if (I && typeof I.read === "function") I.read(0);
    let V = d6.bodyLength(I);
    if (W = V ?? W, W === null) W = Q.contentLength;
    if (W === 0 && !K) W = null;
    if (WF3(B) && W > 0 && Q.contentLength !== null && Q.contentLength !== W) {
      if (A[gd1]) return d6.errorRequest(A, Q, new i0A), !1;
      process.emitWarning(new i0A)
    }
    let F = A[FJA],
      H = (z) => {
        if (Q.aborted || Q.completed) return;
        d6.errorRequest(A, Q, z || new HiQ), d6.destroy(I), d6.destroy(F, new VJA("aborted"))
      };
    try {
      Q.onConnect(H)
    } catch (z) {
      d6.errorRequest(A, Q, z)
    }
    if (Q.aborted) return !1;
    if (B === "HEAD") F[fq] = !0;
    if (Y || B === "CONNECT") F[fq] = !0;
    if (X != null) F[fq] = X;
    if (A[WiQ] && F[QF3]++ >= A[WiQ]) F[fq] = !0;
    if (J) F[TLA] = !0;
    let E = `${B} ${G} HTTP/1.1\r
`;
    if (typeof Z === "string") E += `host: ${Z}\r
`;
    else E += A[oV3];
    if (Y) E += `connection: upgrade\r
upgrade: ${Y}\r
`;
    else if (A[vtA] && !F[fq]) E += `connection: keep-alive\r
`;
    else E += `connection: close\r
`;
    if (Array.isArray(D))
      for (let z = 0; z < D.length; z += 2) {
        let $ = D[z + 0],
          O = D[z + 1];
        if (Array.isArray(O))
          for (let L = 0; L < O.length; L++) E += `${$}: ${O[L]}\r
`;
        else E += `${$}: ${O}\r
`
      }
    if (IiQ.sendHeaders.hasSubscribers) IiQ.sendHeaders.publish({
      request: Q,
      headers: E,
      socket: F
    });
    if (!I || V === 0) ViQ(H, null, A, Q, F, W, E, K);
    else if (d6.isBuffer(I)) ViQ(H, I, A, Q, F, W, E, K);
    else if (d6.isBlobLike(I))
      if (typeof I.stream === "function") FiQ(H, I.stream(), A, Q, F, W, E, K);
      else FF3(H, I, A, Q, F, W, E, K);
    else if (d6.isStream(I)) VF3(H, I, A, Q, F, W, E, K);
    else if (d6.isIterable(I)) FiQ(H, I, A, Q, F, W, E, K);
    else u4(!1);
    return !0
  }

  function VF3(A, Q, B, G, Z, Y, J, X) {
    u4(Y !== 0 || B[Hz] === 0, "stream body cannot be pipelined");
    let I = !1,
      D = new dd1({
        abort: A,
        socket: Z,
        request: G,
        contentLength: Y,
        client: B,
        expectsPayload: X,
        header: J
      }),
      W = function (H) {
        if (I) return;
        try {
          if (!D.write(H) && this.pause) this.pause()
        } catch (E) {
          d6.destroy(this, E)
        }
      },
      K = function () {
        if (I) return;
        if (Q.resume) Q.resume()
      },
      V = function () {
        if (queueMicrotask(() => {
            Q.removeListener("error", F)
          }), !I) {
          let H = new HiQ;
          queueMicrotask(() => F(H))
        }
      },
      F = function (H) {
        if (I) return;
        if (I = !0, u4(Z.destroyed || Z[qn] && B[Hz] <= 1), Z.off("drain", K).off("error", F), Q.removeListener("data", W).removeListener("end", F).removeListener("close", V), !H) try {
          D.end()
        } catch (E) {
          H = E
        }
        if (D.destroy(H), H && (H.code !== "UND_ERR_INFO" || H.message !== "reset")) d6.destroy(Q, H);
        else d6.destroy(Q)
      };
    if (Q.on("data", W).on("end", F).on("error", F).on("close", V), Q.resume) Q.resume();
    if (Z.on("drain", K).on("error", F), Q.errorEmitted ?? Q.errored) setImmediate(() => F(Q.errored));
    else if (Q.endEmitted ?? Q.readableEnded) setImmediate(() => F(null));
    if (Q.closeEmitted ?? Q.closed) setImmediate(V)
  }

  function ViQ(A, Q, B, G, Z, Y, J, X) {
    try {
      if (!Q)
        if (Y === 0) Z.write(`${J}content-length: 0\r
\r
`, "latin1");
        else u4(Y === null, "no body must not have content length"), Z.write(`${J}\r
`, "latin1");
      else if (d6.isBuffer(Q)) {
        if (u4(Y === Q.byteLength, "buffer body must have content length"), Z.cork(), Z.write(`${J}content-length: ${Y}\r
\r
`, "latin1"), Z.write(Q), Z.uncork(), G.onBodySent(Q), !X && G.reset !== !1) Z[fq] = !0
      }
      G.onRequestSent(), B[Un]()
    } catch (I) {
      A(I)
    }
  }
  async function FF3(A, Q, B, G, Z, Y, J, X) {
    u4(Y === Q.size, "blob body must have content length");
    try {
      if (Y != null && Y !== Q.size) throw new i0A;
      let I = Buffer.from(await Q.arrayBuffer());
      if (Z.cork(), Z.write(`${J}content-length: ${Y}\r
\r
`, "latin1"), Z.write(I), Z.uncork(), G.onBodySent(I), G.onRequestSent(), !X && G.reset !== !1) Z[fq] = !0;
      B[Un]()
    } catch (I) {
      A(I)
    }
  }
  async function FiQ(A, Q, B, G, Z, Y, J, X) {
    u4(Y !== 0 || B[Hz] === 0, "iterator body cannot be pipelined");
    let I = null;

    function D() {
      if (I) {
        let V = I;
        I = null, V()
      }
    }
    let W = () => new Promise((V, F) => {
      if (u4(I === null), Z[$R]) F(Z[$R]);
      else I = V
    });
    Z.on("close", D).on("drain", D);
    let K = new dd1({
      abort: A,
      socket: Z,
      request: G,
      contentLength: Y,
      client: B,
      expectsPayload: X,
      header: J
    });
    try {
      for await (let V of Q) {
        if (Z[$R]) throw Z[$R];
        if (!K.write(V)) await W()
      }
      K.end()
    } catch (V) {
      K.destroy(V)
    } finally {
      Z.off("close", D).off("drain", D)
    }
  }
  class dd1 {
    constructor({
      abort: A,
      socket: Q,
      request: B,
      contentLength: G,
      client: Z,
      expectsPayload: Y,
      header: J
    }) {
      this.socket = Q, this.request = B, this.contentLength = G, this.client = Z, this.bytesWritten = 0, this.expectsPayload = Y, this.header = J, this.abort = A, Q[qn] = !0
    }
    write(A) {
      let {
        socket: Q,
        request: B,
        contentLength: G,
        client: Z,
        bytesWritten: Y,
        expectsPayload: J,
        header: X
      } = this;
      if (Q[$R]) throw Q[$R];
      if (Q.destroyed) return !1;
      let I = Buffer.byteLength(A);
      if (!I) return !0;
      if (G !== null && Y + I > G) {
        if (Z[gd1]) throw new i0A;
        process.emitWarning(new i0A)
      }
      if (Q.cork(), Y === 0) {
        if (!J && B.reset !== !1) Q[fq] = !0;
        if (G === null) Q.write(`${X}transfer-encoding: chunked\r
`, "latin1");
        else Q.write(`${X}content-length: ${G}\r
\r
`, "latin1")
      }
      if (G === null) Q.write(`\r
${I.toString(16)}\r
`, "latin1");
      this.bytesWritten += I;
      let D = Q.write(A);
      if (Q.uncork(), B.onBodySent(A), !D) {
        if (Q[uI].timeout && Q[uI].timeoutType === HJA) {
          if (Q[uI].timeout.refresh) Q[uI].timeout.refresh()
        }
      }
      return D
    }
    end() {
      let {
        socket: A,
        contentLength: Q,
        client: B,
        bytesWritten: G,
        expectsPayload: Z,
        header: Y,
        request: J
      } = this;
      if (J.onRequestSent(), A[qn] = !1, A[$R]) throw A[$R];
      if (A.destroyed) return;
      if (G === 0)
        if (Z) A.write(`${Y}content-length: 0\r
\r
`, "latin1");
        else A.write(`${Y}\r
`, "latin1");
      else if (Q === null) A.write(`\r
0\r
\r
`, "latin1");
      if (Q !== null && G !== Q)
        if (B[gd1]) throw new i0A;
        else process.emitWarning(new i0A);
      if (A[uI].timeout && A[uI].timeoutType === HJA) {
        if (A[uI].timeout.refresh) A[uI].timeout.refresh()
      }
      B[Un]()
    }
    destroy(A) {
      let {
        socket: Q,
        client: B,
        abort: G
      } = this;
      if (Q[qn] = !1, A) u4(B[Hz] <= 1, "pipeline should only contain this request"), G(A)
    }
  }
  CiQ.exports = IF3
})
// @from(Ln 112132, Col 4)
_iQ = U((YXG, RiQ) => {
  var CR = NA("node:assert"),
    {
      pipeline: HF3
    } = NA("node:stream"),
    T5 = b8(),
    {
      RequestContentLengthMismatchError: cd1,
      RequestAbortedError: qiQ,
      SocketError: PLA,
      InformationalError: pd1
    } = GG(),
    {
      kUrl: htA,
      kReset: utA,
      kClient: EJA,
      kRunning: mtA,
      kPending: EF3,
      kQueue: Nn,
      kPendingIdx: ld1,
      kRunningIdx: lT,
      kError: nT,
      kSocket: QF,
      kStrictContentLength: zF3,
      kOnError: id1,
      kMaxConcurrentStreams: MiQ,
      kHTTP2Session: iT,
      kResume: wn,
      kSize: $F3,
      kHTTPContext: CF3
    } = VX(),
    Hu = Symbol("open streams"),
    NiQ, wiQ = !1,
    gtA;
  try {
    gtA = NA("node:http2")
  } catch {
    gtA = {
      constants: {}
    }
  }
  var {
    constants: {
      HTTP2_HEADER_AUTHORITY: UF3,
      HTTP2_HEADER_METHOD: qF3,
      HTTP2_HEADER_PATH: NF3,
      HTTP2_HEADER_SCHEME: wF3,
      HTTP2_HEADER_CONTENT_LENGTH: LF3,
      HTTP2_HEADER_EXPECT: OF3,
      HTTP2_HEADER_STATUS: MF3
    }
  } = gtA;

  function RF3(A) {
    let Q = [];
    for (let [B, G] of Object.entries(A))
      if (Array.isArray(G))
        for (let Z of G) Q.push(Buffer.from(B), Buffer.from(Z));
      else Q.push(Buffer.from(B), Buffer.from(G));
    return Q
  }
  async function _F3(A, Q) {
    if (A[QF] = Q, !wiQ) wiQ = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
      code: "UNDICI-H2"
    });
    let B = gtA.connect(A[htA], {
      createConnection: () => Q,
      peerMaxConcurrentStreams: A[MiQ]
    });
    B[Hu] = 0, B[EJA] = A, B[QF] = Q, T5.addListener(B, "error", TF3), T5.addListener(B, "frameError", PF3), T5.addListener(B, "end", SF3), T5.addListener(B, "goaway", xF3), T5.addListener(B, "close", function () {
      let {
        [EJA]: Z
      } = this, {
        [QF]: Y
      } = Z, J = this[QF][nT] || this[nT] || new PLA("closed", T5.getSocketInfo(Y));
      if (Z[iT] = null, Z.destroyed) {
        CR(Z[EF3] === 0);
        let X = Z[Nn].splice(Z[lT]);
        for (let I = 0; I < X.length; I++) {
          let D = X[I];
          T5.errorRequest(Z, D, J)
        }
      }
    }), B.unref(), A[iT] = B, Q[iT] = B, T5.addListener(Q, "error", function (Z) {
      CR(Z.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[nT] = Z, this[EJA][id1](Z)
    }), T5.addListener(Q, "end", function () {
      T5.destroy(this, new PLA("other side closed", T5.getSocketInfo(this)))
    }), T5.addListener(Q, "close", function () {
      let Z = this[nT] || new PLA("closed", T5.getSocketInfo(this));
      if (A[QF] = null, this[iT] != null) this[iT].destroy(Z);
      A[ld1] = A[lT], CR(A[mtA] === 0), A.emit("disconnect", A[htA], [A], Z), A[wn]()
    });
    let G = !1;
    return Q.on("close", () => {
      G = !0
    }), {
      version: "h2",
      defaultPipelining: 1 / 0,
      write(...Z) {
        return vF3(A, ...Z)
      },
      resume() {
        jF3(A)
      },
      destroy(Z, Y) {
        if (G) queueMicrotask(Y);
        else Q.destroy(Z).on("close", Y)
      },
      get destroyed() {
        return Q.destroyed
      },
      busy() {
        return !1
      }
    }
  }

  function jF3(A) {
    let Q = A[QF];
    if (Q?.destroyed === !1)
      if (A[$F3] === 0 && A[MiQ] === 0) Q.unref(), A[iT].unref();
      else Q.ref(), A[iT].ref()
  }

  function TF3(A) {
    CR(A.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[QF][nT] = A, this[EJA][id1](A)
  }

  function PF3(A, Q, B) {
    if (B === 0) {
      let G = new pd1(`HTTP/2: "frameError" received - type ${A}, code ${Q}`);
      this[QF][nT] = G, this[EJA][id1](G)
    }
  }

  function SF3() {
    let A = new PLA("other side closed", T5.getSocketInfo(this[QF]));
    this.destroy(A), T5.destroy(this[QF], A)
  }

  function xF3(A) {
    let Q = this[nT] || new PLA(`HTTP/2: "GOAWAY" frame received with code ${A}`, T5.getSocketInfo(this)),
      B = this[EJA];
    if (B[QF] = null, B[CF3] = null, this[iT] != null) this[iT].destroy(Q), this[iT] = null;
    if (T5.destroy(this[QF], Q), B[lT] < B[Nn].length) {
      let G = B[Nn][B[lT]];
      B[Nn][B[lT]++] = null, T5.errorRequest(B, G, Q), B[ld1] = B[lT]
    }
    CR(B[mtA] === 0), B.emit("disconnect", B[htA], [B], Q), B[wn]()
  }

  function yF3(A) {
    return A !== "GET" && A !== "HEAD" && A !== "OPTIONS" && A !== "TRACE" && A !== "CONNECT"
  }

  function vF3(A, Q) {
    let B = A[iT],
      {
        method: G,
        path: Z,
        host: Y,
        upgrade: J,
        expectContinue: X,
        signal: I,
        headers: D
      } = Q,
      {
        body: W
      } = Q;
    if (J) return T5.errorRequest(A, Q, Error("Upgrade not supported for H2")), !1;
    let K = {};
    for (let M = 0; M < D.length; M += 2) {
      let _ = D[M + 0],
        j = D[M + 1];
      if (Array.isArray(j))
        for (let x = 0; x < j.length; x++)
          if (K[_]) K[_] += `,${j[x]}`;
          else K[_] = j[x];
      else K[_] = j
    }
    let V, {
      hostname: F,
      port: H
    } = A[htA];
    K[UF3] = Y || `${F}${H?`:${H}`:""}`, K[qF3] = G;
    let E = (M) => {
      if (Q.aborted || Q.completed) return;
      if (M = M || new qiQ, T5.errorRequest(A, Q, M), V != null) T5.destroy(V, M);
      T5.destroy(W, M), A[Nn][A[lT]++] = null, A[wn]()
    };
    try {
      Q.onConnect(E)
    } catch (M) {
      T5.errorRequest(A, Q, M)
    }
    if (Q.aborted) return !1;
    if (G === "CONNECT") {
      if (B.ref(), V = B.request(K, {
          endStream: !1,
          signal: I
        }), V.id && !V.pending) Q.onUpgrade(null, null, V), ++B[Hu], A[Nn][A[lT]++] = null;
      else V.once("ready", () => {
        Q.onUpgrade(null, null, V), ++B[Hu], A[Nn][A[lT]++] = null
      });
      return V.once("close", () => {
        if (B[Hu] -= 1, B[Hu] === 0) B.unref()
      }), !0
    }
    K[NF3] = Z, K[wF3] = "https";
    let z = G === "PUT" || G === "POST" || G === "PATCH";
    if (W && typeof W.read === "function") W.read(0);
    let $ = T5.bodyLength(W);
    if (T5.isFormDataLike(W)) {
      NiQ ??= KJA().extractBody;
      let [M, _] = NiQ(W);
      K["content-type"] = _, W = M.stream, $ = M.length
    }
    if ($ == null) $ = Q.contentLength;
    if ($ === 0 || !z) $ = null;
    if (yF3(G) && $ > 0 && Q.contentLength != null && Q.contentLength !== $) {
      if (A[zF3]) return T5.errorRequest(A, Q, new cd1), !1;
      process.emitWarning(new cd1)
    }
    if ($ != null) CR(W, "no body must not have content length"), K[LF3] = `${$}`;
    B.ref();
    let O = G === "GET" || G === "HEAD" || W === null;
    if (X) K[OF3] = "100-continue", V = B.request(K, {
      endStream: O,
      signal: I
    }), V.once("continue", L);
    else V = B.request(K, {
      endStream: O,
      signal: I
    }), L();
    return ++B[Hu], V.once("response", (M) => {
      let {
        [MF3]: _, ...j
      } = M;
      if (Q.onResponseStarted(), Q.aborted) {
        let x = new qiQ;
        T5.errorRequest(A, Q, x), T5.destroy(V, x);
        return
      }
      if (Q.onHeaders(Number(_), RF3(j), V.resume.bind(V), "") === !1) V.pause();
      V.on("data", (x) => {
        if (Q.onData(x) === !1) V.pause()
      })
    }), V.once("end", () => {
      if (V.state?.state == null || V.state.state < 6) Q.onComplete([]);
      if (B[Hu] === 0) B.unref();
      E(new pd1("HTTP/2: stream half-closed (remote)")), A[Nn][A[lT]++] = null, A[ld1] = A[lT], A[wn]()
    }), V.once("close", () => {
      if (B[Hu] -= 1, B[Hu] === 0) B.unref()
    }), V.once("error", function (M) {
      E(M)
    }), V.once("frameError", (M, _) => {
      E(new pd1(`HTTP/2: "frameError" received - type ${M}, code ${_}`))
    }), !0;

    function L() {
      if (!W || $ === 0) LiQ(E, V, null, A, Q, A[QF], $, z);
      else if (T5.isBuffer(W)) LiQ(E, V, W, A, Q, A[QF], $, z);
      else if (T5.isBlobLike(W))
        if (typeof W.stream === "function") OiQ(E, V, W.stream(), A, Q, A[QF], $, z);
        else bF3(E, V, W, A, Q, A[QF], $, z);
      else if (T5.isStream(W)) kF3(E, A[QF], z, V, W, A, Q, $);
      else if (T5.isIterable(W)) OiQ(E, V, W, A, Q, A[QF], $, z);
      else CR(!1)
    }
  }

  function LiQ(A, Q, B, G, Z, Y, J, X) {
    try {
      if (B != null && T5.isBuffer(B)) CR(J === B.byteLength, "buffer body must have content length"), Q.cork(), Q.write(B), Q.uncork(), Q.end(), Z.onBodySent(B);
      if (!X) Y[utA] = !0;
      Z.onRequestSent(), G[wn]()
    } catch (I) {
      A(I)
    }
  }

  function kF3(A, Q, B, G, Z, Y, J, X) {
    CR(X !== 0 || Y[mtA] === 0, "stream body cannot be pipelined");
    let I = HF3(Z, G, (W) => {
      if (W) T5.destroy(I, W), A(W);
      else {
        if (T5.removeAllListeners(I), J.onRequestSent(), !B) Q[utA] = !0;
        Y[wn]()
      }
    });
    T5.addListener(I, "data", D);

    function D(W) {
      J.onBodySent(W)
    }
  }
  async function bF3(A, Q, B, G, Z, Y, J, X) {
    CR(J === B.size, "blob body must have content length");
    try {
      if (J != null && J !== B.size) throw new cd1;
      let I = Buffer.from(await B.arrayBuffer());
      if (Q.cork(), Q.write(I), Q.uncork(), Q.end(), Z.onBodySent(I), Z.onRequestSent(), !X) Y[utA] = !0;
      G[wn]()
    } catch (I) {
      A(I)
    }
  }
  async function OiQ(A, Q, B, G, Z, Y, J, X) {
    CR(J !== 0 || G[mtA] === 0, "iterator body cannot be pipelined");
    let I = null;

    function D() {
      if (I) {
        let K = I;
        I = null, K()
      }
    }
    let W = () => new Promise((K, V) => {
      if (CR(I === null), Y[nT]) V(Y[nT]);
      else I = K
    });
    Q.on("close", D).on("drain", D);
    try {
      for await (let K of B) {
        if (Y[nT]) throw Y[nT];
        let V = Q.write(K);
        if (Z.onBodySent(K), !V) await W()
      }
      if (Q.end(), Z.onRequestSent(), !X) Y[utA] = !0;
      G[wn]()
    } catch (K) {
      A(K)
    } finally {
      Q.off("close", D).off("drain", D)
    }
  }
  RiQ.exports = _F3
})
// @from(Ln 112470, Col 4)
dtA = U((JXG, SiQ) => {
  var iv = b8(),
    {
      kBodyUsed: SLA
    } = VX(),
    ad1 = NA("node:assert"),
    {
      InvalidArgumentError: fF3
    } = GG(),
    hF3 = NA("node:events"),
    gF3 = [300, 301, 302, 303, 307, 308],
    jiQ = Symbol("body");
  class nd1 {
    constructor(A) {
      this[jiQ] = A, this[SLA] = !1
    }
    async * [Symbol.asyncIterator]() {
      ad1(!this[SLA], "disturbed"), this[SLA] = !0, yield* this[jiQ]
    }
  }
  class PiQ {
    constructor(A, Q, B, G) {
      if (Q != null && (!Number.isInteger(Q) || Q < 0)) throw new fF3("maxRedirections must be a positive number");
      if (iv.validateHandler(G, B.method, B.upgrade), this.dispatch = A, this.location = null, this.abort = null, this.opts = {
          ...B,
          maxRedirections: 0
        }, this.maxRedirections = Q, this.handler = G, this.history = [], this.redirectionLimitReached = !1, iv.isStream(this.opts.body)) {
        if (iv.bodyLength(this.opts.body) === 0) this.opts.body.on("data", function () {
          ad1(!1)
        });
        if (typeof this.opts.body.readableDidRead !== "boolean") this.opts.body[SLA] = !1, hF3.prototype.on.call(this.opts.body, "data", function () {
          this[SLA] = !0
        })
      } else if (this.opts.body && typeof this.opts.body.pipeTo === "function") this.opts.body = new nd1(this.opts.body);
      else if (this.opts.body && typeof this.opts.body !== "string" && !ArrayBuffer.isView(this.opts.body) && iv.isIterable(this.opts.body)) this.opts.body = new nd1(this.opts.body)
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
      if (this.location = this.history.length >= this.maxRedirections || iv.isDisturbed(this.opts.body) ? null : uF3(A, Q), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
        if (this.request) this.request.abort(Error("max redirects"));
        this.redirectionLimitReached = !0, this.abort(Error("max redirects"));
        return
      }
      if (this.opts.origin) this.history.push(new URL(this.opts.path, this.opts.origin));
      if (!this.location) return this.handler.onHeaders(A, Q, B, G);
      let {
        origin: Z,
        pathname: Y,
        search: J
      } = iv.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), X = J ? `${Y}${J}` : Y;
      if (this.opts.headers = mF3(this.opts.headers, A === 303, this.opts.origin !== Z), this.opts.path = X, this.opts.origin = Z, this.opts.maxRedirections = 0, this.opts.query = null, A === 303 && this.opts.method !== "HEAD") this.opts.method = "GET", this.opts.body = null
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

  function uF3(A, Q) {
    if (gF3.indexOf(A) === -1) return null;
    for (let B = 0; B < Q.length; B += 2)
      if (Q[B].length === 8 && iv.headerNameToString(Q[B]) === "location") return Q[B + 1]
  }

  function TiQ(A, Q, B) {
    if (A.length === 4) return iv.headerNameToString(A) === "host";
    if (Q && iv.headerNameToString(A).startsWith("content-")) return !0;
    if (B && (A.length === 13 || A.length === 6 || A.length === 19)) {
      let G = iv.headerNameToString(A);
      return G === "authorization" || G === "cookie" || G === "proxy-authorization"
    }
    return !1
  }

  function mF3(A, Q, B) {
    let G = [];
    if (Array.isArray(A)) {
      for (let Z = 0; Z < A.length; Z += 2)
        if (!TiQ(A[Z], Q, B)) G.push(A[Z], A[Z + 1])
    } else if (A && typeof A === "object") {
      for (let Z of Object.keys(A))
        if (!TiQ(Z, Q, B)) G.push(Z, A[Z])
    } else ad1(A == null, "headers must be an object or an array");
    return G
  }
  SiQ.exports = PiQ
})
// @from(Ln 112574, Col 4)
ctA = U((XXG, xiQ) => {
  var dF3 = dtA();

  function cF3({
    maxRedirections: A
  }) {
    return (Q) => {
      return function (G, Z) {
        let {
          maxRedirections: Y = A
        } = G;
        if (!Y) return Q(G, Z);
        let J = new dF3(Q, Y, G, Z);
        return G = {
          ...G,
          maxRedirections: 0
        }, Q(G, J)
      }
    }
  }
  xiQ.exports = cF3
})
// @from(Ln 112596, Col 4)
hLA = U((IXG, ciQ) => {
  var Eu = NA("node:assert"),
    hiQ = NA("node:net"),
    pF3 = NA("node:http"),
    n0A = b8(),
    {
      channels: zJA
    } = tYA(),
    lF3 = OpQ(),
    iF3 = BJA(),
    {
      InvalidArgumentError: jD,
      InformationalError: nF3,
      ClientDestroyedError: aF3
    } = GG(),
    oF3 = ULA(),
    {
      kUrl: nv,
      kServerName: Ln,
      kClient: rF3,
      kBusy: od1,
      kConnect: sF3,
      kResuming: a0A,
      kRunning: bLA,
      kPending: fLA,
      kSize: kLA,
      kQueue: aT,
      kConnected: tF3,
      kConnecting: $JA,
      kNeedDrain: Mn,
      kKeepAliveDefaultTimeout: yiQ,
      kHostHeader: eF3,
      kPendingIdx: oT,
      kRunningIdx: zu,
      kError: AH3,
      kPipelining: ptA,
      kKeepAliveTimeoutValue: QH3,
      kMaxHeadersSize: BH3,
      kKeepAliveMaxTimeout: GH3,
      kKeepAliveTimeoutThreshold: ZH3,
      kHeadersTimeout: YH3,
      kBodyTimeout: JH3,
      kStrictContentLength: XH3,
      kConnector: xLA,
      kMaxRedirections: IH3,
      kMaxRequests: rd1,
      kCounter: DH3,
      kClose: WH3,
      kDestroy: KH3,
      kDispatch: VH3,
      kInterceptors: viQ,
      kLocalAddress: yLA,
      kMaxResponseSize: FH3,
      kOnError: HH3,
      kHTTPContext: TD,
      kMaxConcurrentStreams: EH3,
      kResume: vLA
    } = VX(),
    zH3 = UiQ(),
    $H3 = _iQ(),
    kiQ = !1,
    On = Symbol("kClosedResolve"),
    biQ = () => {};

  function giQ(A) {
    return A[ptA] ?? A[TD]?.defaultPipelining ?? 1
  }
  class uiQ extends iF3 {
    constructor(A, {
      interceptors: Q,
      maxHeaderSize: B,
      headersTimeout: G,
      socketTimeout: Z,
      requestTimeout: Y,
      connectTimeout: J,
      bodyTimeout: X,
      idleTimeout: I,
      keepAlive: D,
      keepAliveTimeout: W,
      maxKeepAliveTimeout: K,
      keepAliveMaxTimeout: V,
      keepAliveTimeoutThreshold: F,
      socketPath: H,
      pipelining: E,
      tls: z,
      strictContentLength: $,
      maxCachedSessions: O,
      maxRedirections: L,
      connect: M,
      maxRequestsPerClient: _,
      localAddress: j,
      maxResponseSize: x,
      autoSelectFamily: b,
      autoSelectFamilyAttemptTimeout: S,
      maxConcurrentStreams: u,
      allowH2: f
    } = {}) {
      super();
      if (D !== void 0) throw new jD("unsupported keepAlive, use pipelining=0 instead");
      if (Z !== void 0) throw new jD("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
      if (Y !== void 0) throw new jD("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
      if (I !== void 0) throw new jD("unsupported idleTimeout, use keepAliveTimeout instead");
      if (K !== void 0) throw new jD("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
      if (B != null && !Number.isFinite(B)) throw new jD("invalid maxHeaderSize");
      if (H != null && typeof H !== "string") throw new jD("invalid socketPath");
      if (J != null && (!Number.isFinite(J) || J < 0)) throw new jD("invalid connectTimeout");
      if (W != null && (!Number.isFinite(W) || W <= 0)) throw new jD("invalid keepAliveTimeout");
      if (V != null && (!Number.isFinite(V) || V <= 0)) throw new jD("invalid keepAliveMaxTimeout");
      if (F != null && !Number.isFinite(F)) throw new jD("invalid keepAliveTimeoutThreshold");
      if (G != null && (!Number.isInteger(G) || G < 0)) throw new jD("headersTimeout must be a positive integer or zero");
      if (X != null && (!Number.isInteger(X) || X < 0)) throw new jD("bodyTimeout must be a positive integer or zero");
      if (M != null && typeof M !== "function" && typeof M !== "object") throw new jD("connect must be a function or an object");
      if (L != null && (!Number.isInteger(L) || L < 0)) throw new jD("maxRedirections must be a positive number");
      if (_ != null && (!Number.isInteger(_) || _ < 0)) throw new jD("maxRequestsPerClient must be a positive number");
      if (j != null && (typeof j !== "string" || hiQ.isIP(j) === 0)) throw new jD("localAddress must be valid string IP address");
      if (x != null && (!Number.isInteger(x) || x < -1)) throw new jD("maxResponseSize must be a positive number");
      if (S != null && (!Number.isInteger(S) || S < -1)) throw new jD("autoSelectFamilyAttemptTimeout must be a positive number");
      if (f != null && typeof f !== "boolean") throw new jD("allowH2 must be a valid boolean value");
      if (u != null && (typeof u !== "number" || u < 1)) throw new jD("maxConcurrentStreams must be a positive integer, greater than 0");
      if (typeof M !== "function") M = oF3({
        ...z,
        maxCachedSessions: O,
        allowH2: f,
        socketPath: H,
        timeout: J,
        ...b ? {
          autoSelectFamily: b,
          autoSelectFamilyAttemptTimeout: S
        } : void 0,
        ...M
      });
      if (Q?.Client && Array.isArray(Q.Client)) {
        if (this[viQ] = Q.Client, !kiQ) kiQ = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
          code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
        })
      } else this[viQ] = [CH3({
        maxRedirections: L
      })];
      this[nv] = n0A.parseOrigin(A), this[xLA] = M, this[ptA] = E != null ? E : 1, this[BH3] = B || pF3.maxHeaderSize, this[yiQ] = W == null ? 4000 : W, this[GH3] = V == null ? 600000 : V, this[ZH3] = F == null ? 2000 : F, this[QH3] = this[yiQ], this[Ln] = null, this[yLA] = j != null ? j : null, this[a0A] = 0, this[Mn] = 0, this[eF3] = `host: ${this[nv].hostname}${this[nv].port?`:${this[nv].port}`:""}\r
`, this[JH3] = X != null ? X : 300000, this[YH3] = G != null ? G : 300000, this[XH3] = $ == null ? !0 : $, this[IH3] = L, this[rd1] = _, this[On] = null, this[FH3] = x > -1 ? x : -1, this[EH3] = u != null ? u : 100, this[TD] = null, this[aT] = [], this[zu] = 0, this[oT] = 0, this[vLA] = (AA) => sd1(this, AA), this[HH3] = (AA) => miQ(this, AA)
    }
    get pipelining() {
      return this[ptA]
    }
    set pipelining(A) {
      this[ptA] = A, this[vLA](!0)
    }
    get[fLA]() {
      return this[aT].length - this[oT]
    }
    get[bLA]() {
      return this[oT] - this[zu]
    }
    get[kLA]() {
      return this[aT].length - this[zu]
    }
    get[tF3]() {
      return !!this[TD] && !this[$JA] && !this[TD].destroyed
    }
    get[od1]() {
      return Boolean(this[TD]?.busy(null) || this[kLA] >= (giQ(this) || 1) || this[fLA] > 0)
    } [sF3](A) {
      diQ(this), this.once("connect", A)
    } [VH3](A, Q) {
      let B = A.origin || this[nv].origin,
        G = new lF3(B, A, Q);
      if (this[aT].push(G), this[a0A]);
      else if (n0A.bodyLength(G.body) == null && n0A.isIterable(G.body)) this[a0A] = 1, queueMicrotask(() => sd1(this));
      else this[vLA](!0);
      if (this[a0A] && this[Mn] !== 2 && this[od1]) this[Mn] = 2;
      return this[Mn] < 2
    }
    async [WH3]() {
      return new Promise((A) => {
        if (this[kLA]) this[On] = A;
        else A(null)
      })
    }
    async [KH3](A) {
      return new Promise((Q) => {
        let B = this[aT].splice(this[oT]);
        for (let Z = 0; Z < B.length; Z++) {
          let Y = B[Z];
          n0A.errorRequest(this, Y, A)
        }
        let G = () => {
          if (this[On]) this[On](), this[On] = null;
          Q(null)
        };
        if (this[TD]) this[TD].destroy(A, G), this[TD] = null;
        else queueMicrotask(G);
        this[vLA]()
      })
    }
  }
  var CH3 = ctA();

  function miQ(A, Q) {
    if (A[bLA] === 0 && Q.code !== "UND_ERR_INFO" && Q.code !== "UND_ERR_SOCKET") {
      Eu(A[oT] === A[zu]);
      let B = A[aT].splice(A[zu]);
      for (let G = 0; G < B.length; G++) {
        let Z = B[G];
        n0A.errorRequest(A, Z, Q)
      }
      Eu(A[kLA] === 0)
    }
  }
  async function diQ(A) {
    Eu(!A[$JA]), Eu(!A[TD]);
    let {
      host: Q,
      hostname: B,
      protocol: G,
      port: Z
    } = A[nv];
    if (B[0] === "[") {
      let Y = B.indexOf("]");
      Eu(Y !== -1);
      let J = B.substring(1, Y);
      Eu(hiQ.isIP(J)), B = J
    }
    if (A[$JA] = !0, zJA.beforeConnect.hasSubscribers) zJA.beforeConnect.publish({
      connectParams: {
        host: Q,
        hostname: B,
        protocol: G,
        port: Z,
        version: A[TD]?.version,
        servername: A[Ln],
        localAddress: A[yLA]
      },
      connector: A[xLA]
    });
    try {
      let Y = await new Promise((J, X) => {
        A[xLA]({
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          servername: A[Ln],
          localAddress: A[yLA]
        }, (I, D) => {
          if (I) X(I);
          else J(D)
        })
      });
      if (A.destroyed) {
        n0A.destroy(Y.on("error", biQ), new aF3);
        return
      }
      Eu(Y);
      try {
        A[TD] = Y.alpnProtocol === "h2" ? await $H3(A, Y) : await zH3(A, Y)
      } catch (J) {
        throw Y.destroy().on("error", biQ), J
      }
      if (A[$JA] = !1, Y[DH3] = 0, Y[rd1] = A[rd1], Y[rF3] = A, Y[AH3] = null, zJA.connected.hasSubscribers) zJA.connected.publish({
        connectParams: {
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          version: A[TD]?.version,
          servername: A[Ln],
          localAddress: A[yLA]
        },
        connector: A[xLA],
        socket: Y
      });
      A.emit("connect", A[nv], [A])
    } catch (Y) {
      if (A.destroyed) return;
      if (A[$JA] = !1, zJA.connectError.hasSubscribers) zJA.connectError.publish({
        connectParams: {
          host: Q,
          hostname: B,
          protocol: G,
          port: Z,
          version: A[TD]?.version,
          servername: A[Ln],
          localAddress: A[yLA]
        },
        connector: A[xLA],
        error: Y
      });
      if (Y.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
        Eu(A[bLA] === 0);
        while (A[fLA] > 0 && A[aT][A[oT]].servername === A[Ln]) {
          let J = A[aT][A[oT]++];
          n0A.errorRequest(A, J, Y)
        }
      } else miQ(A, Y);
      A.emit("connectionError", A[nv], [A], Y)
    }
    A[vLA]()
  }

  function fiQ(A) {
    A[Mn] = 0, A.emit("drain", A[nv], [A])
  }

  function sd1(A, Q) {
    if (A[a0A] === 2) return;
    if (A[a0A] = 2, UH3(A, Q), A[a0A] = 0, A[zu] > 256) A[aT].splice(0, A[zu]), A[oT] -= A[zu], A[zu] = 0
  }

  function UH3(A, Q) {
    while (!0) {
      if (A.destroyed) {
        Eu(A[fLA] === 0);
        return
      }
      if (A[On] && !A[kLA]) {
        A[On](), A[On] = null;
        return
      }
      if (A[TD]) A[TD].resume();
      if (A[od1]) A[Mn] = 2;
      else if (A[Mn] === 2) {
        if (Q) A[Mn] = 1, queueMicrotask(() => fiQ(A));
        else fiQ(A);
        continue
      }
      if (A[fLA] === 0) return;
      if (A[bLA] >= (giQ(A) || 1)) return;
      let B = A[aT][A[oT]];
      if (A[nv].protocol === "https:" && A[Ln] !== B.servername) {
        if (A[bLA] > 0) return;
        A[Ln] = B.servername, A[TD]?.destroy(new nF3("servername changed"), () => {
          A[TD] = null, sd1(A)
        })
      }
      if (A[$JA]) return;
      if (!A[TD]) {
        diQ(A);
        return
      }
      if (A[TD].destroyed) return;
      if (A[TD].busy(B)) return;
      if (!B.aborted && A[TD].write(B)) A[oT]++;
      else A[aT].splice(A[oT], 1)
    }
  }
  ciQ.exports = uiQ
})
// @from(Ln 112943, Col 4)
ed1 = U((DXG, piQ) => {
  class td1 {
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
  piQ.exports = class {
    constructor() {
      this.head = this.tail = new td1
    }
    isEmpty() {
      return this.head.isEmpty()
    }
    push(Q) {
      if (this.head.isFull()) this.head = this.head.next = new td1;
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
// @from(Ln 112982, Col 4)
niQ = U((WXG, iiQ) => {
  var {
    kFree: qH3,
    kConnected: NH3,
    kPending: wH3,
    kQueued: LH3,
    kRunning: OH3,
    kSize: MH3
  } = VX(), o0A = Symbol("pool");
  class liQ {
    constructor(A) {
      this[o0A] = A
    }
    get connected() {
      return this[o0A][NH3]
    }
    get free() {
      return this[o0A][qH3]
    }
    get pending() {
      return this[o0A][wH3]
    }
    get queued() {
      return this[o0A][LH3]
    }
    get running() {
      return this[o0A][OH3]
    }
    get size() {
      return this[o0A][MH3]
    }
  }
  iiQ.exports = liQ
})
// @from(Ln 113016, Col 4)
Zc1 = U((KXG, ZnQ) => {
  var RH3 = BJA(),
    _H3 = ed1(),
    {
      kConnected: Ac1,
      kSize: aiQ,
      kRunning: oiQ,
      kPending: riQ,
      kQueued: gLA,
      kBusy: jH3,
      kFree: TH3,
      kUrl: PH3,
      kClose: SH3,
      kDestroy: xH3,
      kDispatch: yH3
    } = VX(),
    vH3 = niQ(),
    hq = Symbol("clients"),
    WC = Symbol("needDrain"),
    uLA = Symbol("queue"),
    Qc1 = Symbol("closed resolve"),
    Bc1 = Symbol("onDrain"),
    siQ = Symbol("onConnect"),
    tiQ = Symbol("onDisconnect"),
    eiQ = Symbol("onConnectionError"),
    Gc1 = Symbol("get dispatcher"),
    QnQ = Symbol("add client"),
    BnQ = Symbol("remove client"),
    AnQ = Symbol("stats");
  class GnQ extends RH3 {
    constructor() {
      super();
      this[uLA] = new _H3, this[hq] = [], this[gLA] = 0;
      let A = this;
      this[Bc1] = function (B, G) {
        let Z = A[uLA],
          Y = !1;
        while (!Y) {
          let J = Z.shift();
          if (!J) break;
          A[gLA]--, Y = !this.dispatch(J.opts, J.handler)
        }
        if (this[WC] = Y, !this[WC] && A[WC]) A[WC] = !1, A.emit("drain", B, [A, ...G]);
        if (A[Qc1] && Z.isEmpty()) Promise.all(A[hq].map((J) => J.close())).then(A[Qc1])
      }, this[siQ] = (Q, B) => {
        A.emit("connect", Q, [A, ...B])
      }, this[tiQ] = (Q, B, G) => {
        A.emit("disconnect", Q, [A, ...B], G)
      }, this[eiQ] = (Q, B, G) => {
        A.emit("connectionError", Q, [A, ...B], G)
      }, this[AnQ] = new vH3(this)
    }
    get[jH3]() {
      return this[WC]
    }
    get[Ac1]() {
      return this[hq].filter((A) => A[Ac1]).length
    }
    get[TH3]() {
      return this[hq].filter((A) => A[Ac1] && !A[WC]).length
    }
    get[riQ]() {
      let A = this[gLA];
      for (let {
          [riQ]: Q
        }
        of this[hq]) A += Q;
      return A
    }
    get[oiQ]() {
      let A = 0;
      for (let {
          [oiQ]: Q
        }
        of this[hq]) A += Q;
      return A
    }
    get[aiQ]() {
      let A = this[gLA];
      for (let {
          [aiQ]: Q
        }
        of this[hq]) A += Q;
      return A
    }
    get stats() {
      return this[AnQ]
    }
    async [SH3]() {
      if (this[uLA].isEmpty()) await Promise.all(this[hq].map((A) => A.close()));
      else await new Promise((A) => {
        this[Qc1] = A
      })
    }
    async [xH3](A) {
      while (!0) {
        let Q = this[uLA].shift();
        if (!Q) break;
        Q.handler.onError(A)
      }
      await Promise.all(this[hq].map((Q) => Q.destroy(A)))
    } [yH3](A, Q) {
      let B = this[Gc1]();
      if (!B) this[WC] = !0, this[uLA].push({
        opts: A,
        handler: Q
      }), this[gLA]++;
      else if (!B.dispatch(A, Q)) B[WC] = !0, this[WC] = !this[Gc1]();
      return !this[WC]
    } [QnQ](A) {
      if (A.on("drain", this[Bc1]).on("connect", this[siQ]).on("disconnect", this[tiQ]).on("connectionError", this[eiQ]), this[hq].push(A), this[WC]) queueMicrotask(() => {
        if (this[WC]) this[Bc1](A[PH3], [this, A])
      });
      return this
    } [BnQ](A) {
      A.close(() => {
        let Q = this[hq].indexOf(A);
        if (Q !== -1) this[hq].splice(Q, 1)
      }), this[WC] = this[hq].some((Q) => !Q[WC] && Q.closed !== !0 && Q.destroyed !== !0)
    }
  }
  ZnQ.exports = {
    PoolBase: GnQ,
    kClients: hq,
    kNeedDrain: WC,
    kAddClient: QnQ,
    kRemoveClient: BnQ,
    kGetDispatcher: Gc1
  }
})
// @from(Ln 113146, Col 4)
CJA = U((VXG, WnQ) => {
  var {
    PoolBase: kH3,
    kClients: YnQ,
    kNeedDrain: bH3,
    kAddClient: fH3,
    kGetDispatcher: hH3
  } = Zc1(), gH3 = hLA(), {
    InvalidArgumentError: Yc1
  } = GG(), JnQ = b8(), {
    kUrl: XnQ,
    kInterceptors: uH3
  } = VX(), mH3 = ULA(), Jc1 = Symbol("options"), Xc1 = Symbol("connections"), InQ = Symbol("factory");

  function dH3(A, Q) {
    return new gH3(A, Q)
  }
  class DnQ extends kH3 {
    constructor(A, {
      connections: Q,
      factory: B = dH3,
      connect: G,
      connectTimeout: Z,
      tls: Y,
      maxCachedSessions: J,
      socketPath: X,
      autoSelectFamily: I,
      autoSelectFamilyAttemptTimeout: D,
      allowH2: W,
      ...K
    } = {}) {
      super();
      if (Q != null && (!Number.isFinite(Q) || Q < 0)) throw new Yc1("invalid connections");
      if (typeof B !== "function") throw new Yc1("factory must be a function.");
      if (G != null && typeof G !== "function" && typeof G !== "object") throw new Yc1("connect must be a function or an object");
      if (typeof G !== "function") G = mH3({
        ...Y,
        maxCachedSessions: J,
        allowH2: W,
        socketPath: X,
        timeout: Z,
        ...I ? {
          autoSelectFamily: I,
          autoSelectFamilyAttemptTimeout: D
        } : void 0,
        ...G
      });
      this[uH3] = K.interceptors?.Pool && Array.isArray(K.interceptors.Pool) ? K.interceptors.Pool : [], this[Xc1] = Q || null, this[XnQ] = JnQ.parseOrigin(A), this[Jc1] = {
        ...JnQ.deepClone(K),
        connect: G,
        allowH2: W
      }, this[Jc1].interceptors = K.interceptors ? {
        ...K.interceptors
      } : void 0, this[InQ] = B
    } [hH3]() {
      for (let A of this[YnQ])
        if (!A[bH3]) return A;
      if (!this[Xc1] || this[YnQ].length < this[Xc1]) {
        let A = this[InQ](this[XnQ], this[Jc1]);
        return this[fH3](A), A
      }
    }
  }
  WnQ.exports = DnQ
})
// @from(Ln 113211, Col 4)
znQ = U((FXG, EnQ) => {
  var {
    BalancedPoolMissingUpstreamError: cH3,
    InvalidArgumentError: pH3
  } = GG(), {
    PoolBase: lH3,
    kClients: Ez,
    kNeedDrain: mLA,
    kAddClient: iH3,
    kRemoveClient: nH3,
    kGetDispatcher: aH3
  } = Zc1(), oH3 = CJA(), {
    kUrl: Ic1,
    kInterceptors: rH3
  } = VX(), {
    parseOrigin: KnQ
  } = b8(), VnQ = Symbol("factory"), ltA = Symbol("options"), FnQ = Symbol("kGreatestCommonDivisor"), r0A = Symbol("kCurrentWeight"), s0A = Symbol("kIndex"), UR = Symbol("kWeight"), itA = Symbol("kMaxWeightPerServer"), ntA = Symbol("kErrorPenalty");

  function sH3(A, Q) {
    if (A === 0) return Q;
    while (Q !== 0) {
      let B = Q;
      Q = A % Q, A = B
    }
    return A
  }

  function tH3(A, Q) {
    return new oH3(A, Q)
  }
  class HnQ extends lH3 {
    constructor(A = [], {
      factory: Q = tH3,
      ...B
    } = {}) {
      super();
      if (this[ltA] = B, this[s0A] = -1, this[r0A] = 0, this[itA] = this[ltA].maxWeightPerServer || 100, this[ntA] = this[ltA].errorPenalty || 15, !Array.isArray(A)) A = [A];
      if (typeof Q !== "function") throw new pH3("factory must be a function.");
      this[rH3] = B.interceptors?.BalancedPool && Array.isArray(B.interceptors.BalancedPool) ? B.interceptors.BalancedPool : [], this[VnQ] = Q;
      for (let G of A) this.addUpstream(G);
      this._updateBalancedPoolStats()
    }
    addUpstream(A) {
      let Q = KnQ(A).origin;
      if (this[Ez].find((G) => G[Ic1].origin === Q && G.closed !== !0 && G.destroyed !== !0)) return this;
      let B = this[VnQ](Q, Object.assign({}, this[ltA]));
      this[iH3](B), B.on("connect", () => {
        B[UR] = Math.min(this[itA], B[UR] + this[ntA])
      }), B.on("connectionError", () => {
        B[UR] = Math.max(1, B[UR] - this[ntA]), this._updateBalancedPoolStats()
      }), B.on("disconnect", (...G) => {
        let Z = G[2];
        if (Z && Z.code === "UND_ERR_SOCKET") B[UR] = Math.max(1, B[UR] - this[ntA]), this._updateBalancedPoolStats()
      });
      for (let G of this[Ez]) G[UR] = this[itA];
      return this._updateBalancedPoolStats(), this
    }
    _updateBalancedPoolStats() {
      let A = 0;
      for (let Q = 0; Q < this[Ez].length; Q++) A = sH3(this[Ez][Q][UR], A);
      this[FnQ] = A
    }
    removeUpstream(A) {
      let Q = KnQ(A).origin,
        B = this[Ez].find((G) => G[Ic1].origin === Q && G.closed !== !0 && G.destroyed !== !0);
      if (B) this[nH3](B);
      return this
    }
    get upstreams() {
      return this[Ez].filter((A) => A.closed !== !0 && A.destroyed !== !0).map((A) => A[Ic1].origin)
    } [aH3]() {
      if (this[Ez].length === 0) throw new cH3;
      if (!this[Ez].find((Z) => !Z[mLA] && Z.closed !== !0 && Z.destroyed !== !0)) return;
      if (this[Ez].map((Z) => Z[mLA]).reduce((Z, Y) => Z && Y, !0)) return;
      let B = 0,
        G = this[Ez].findIndex((Z) => !Z[mLA]);
      while (B++ < this[Ez].length) {
        this[s0A] = (this[s0A] + 1) % this[Ez].length;
        let Z = this[Ez][this[s0A]];
        if (Z[UR] > this[Ez][G][UR] && !Z[mLA]) G = this[s0A];
        if (this[s0A] === 0) {
          if (this[r0A] = this[r0A] - this[FnQ], this[r0A] <= 0) this[r0A] = this[itA]
        }
        if (Z[UR] >= this[r0A] && !Z[mLA]) return Z
      }
      return this[r0A] = this[Ez][G][UR], this[s0A] = G, this[Ez][G]
    }
  }
  EnQ.exports = HnQ
})
// @from(Ln 113301, Col 4)
UJA = U((HXG, OnQ) => {
  var {
    InvalidArgumentError: atA
  } = GG(), {
    kClients: Rn,
    kRunning: $nQ,
    kClose: eH3,
    kDestroy: AE3,
    kDispatch: QE3,
    kInterceptors: BE3
  } = VX(), GE3 = BJA(), ZE3 = CJA(), YE3 = hLA(), JE3 = b8(), XE3 = ctA(), CnQ = Symbol("onConnect"), UnQ = Symbol("onDisconnect"), qnQ = Symbol("onConnectionError"), IE3 = Symbol("maxRedirections"), NnQ = Symbol("onDrain"), wnQ = Symbol("factory"), Dc1 = Symbol("options");

  function DE3(A, Q) {
    return Q && Q.connections === 1 ? new YE3(A, Q) : new ZE3(A, Q)
  }
  class LnQ extends GE3 {
    constructor({
      factory: A = DE3,
      maxRedirections: Q = 0,
      connect: B,
      ...G
    } = {}) {
      super();
      if (typeof A !== "function") throw new atA("factory must be a function.");
      if (B != null && typeof B !== "function" && typeof B !== "object") throw new atA("connect must be a function or an object");
      if (!Number.isInteger(Q) || Q < 0) throw new atA("maxRedirections must be a positive number");
      if (B && typeof B !== "function") B = {
        ...B
      };
      this[BE3] = G.interceptors?.Agent && Array.isArray(G.interceptors.Agent) ? G.interceptors.Agent : [XE3({
        maxRedirections: Q
      })], this[Dc1] = {
        ...JE3.deepClone(G),
        connect: B
      }, this[Dc1].interceptors = G.interceptors ? {
        ...G.interceptors
      } : void 0, this[IE3] = Q, this[wnQ] = A, this[Rn] = new Map, this[NnQ] = (Z, Y) => {
        this.emit("drain", Z, [this, ...Y])
      }, this[CnQ] = (Z, Y) => {
        this.emit("connect", Z, [this, ...Y])
      }, this[UnQ] = (Z, Y, J) => {
        this.emit("disconnect", Z, [this, ...Y], J)
      }, this[qnQ] = (Z, Y, J) => {
        this.emit("connectionError", Z, [this, ...Y], J)
      }
    }
    get[$nQ]() {
      let A = 0;
      for (let Q of this[Rn].values()) A += Q[$nQ];
      return A
    } [QE3](A, Q) {
      let B;
      if (A.origin && (typeof A.origin === "string" || A.origin instanceof URL)) B = String(A.origin);
      else throw new atA("opts.origin must be a non-empty string or URL.");
      let G = this[Rn].get(B);
      if (!G) G = this[wnQ](A.origin, this[Dc1]).on("drain", this[NnQ]).on("connect", this[CnQ]).on("disconnect", this[UnQ]).on("connectionError", this[qnQ]), this[Rn].set(B, G);
      return G.dispatch(A, Q)
    }
    async [eH3]() {
      let A = [];
      for (let Q of this[Rn].values()) A.push(Q.close());
      this[Rn].clear(), await Promise.all(A)
    }
    async [AE3](A) {
      let Q = [];
      for (let B of this[Rn].values()) Q.push(B.destroy(A));
      this[Rn].clear(), await Promise.all(Q)
    }
  }
  OnQ.exports = LnQ
})