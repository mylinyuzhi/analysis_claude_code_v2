
// @from(Ln 79283, Col 4)
Gy1 = U((YQ6) => {
  var mi = twQ(),
    X0A = oG(),
    o06 = ewQ(),
    YLQ = IoA(),
    BLQ = Jz(),
    DoA = QLQ(),
    JLQ = "X-Amz-Algorithm",
    XLQ = "X-Amz-Credential",
    ox1 = "X-Amz-Date",
    ILQ = "X-Amz-SignedHeaders",
    DLQ = "X-Amz-Expires",
    rx1 = "X-Amz-Signature",
    sx1 = "X-Amz-Security-Token",
    r06 = "X-Amz-Region-Set",
    tx1 = "authorization",
    ex1 = ox1.toLowerCase(),
    WLQ = "date",
    KLQ = [tx1, ex1, WLQ],
    VLQ = rx1.toLowerCase(),
    HoA = "x-amz-content-sha256",
    FLQ = sx1.toLowerCase(),
    s06 = "host",
    HLQ = {
      authorization: !0,
      "cache-control": !0,
      connection: !0,
      expect: !0,
      from: !0,
      "keep-alive": !0,
      "max-forwards": !0,
      pragma: !0,
      referer: !0,
      te: !0,
      trailer: !0,
      "transfer-encoding": !0,
      upgrade: !0,
      "user-agent": !0,
      "x-amzn-trace-id": !0
    },
    ELQ = /^proxy-/,
    zLQ = /^sec-/,
    t06 = [/^proxy-/i, /^sec-/i],
    WoA = "AWS4-HMAC-SHA256",
    e06 = "AWS4-ECDSA-P256-SHA256",
    $LQ = "AWS4-HMAC-SHA256-PAYLOAD",
    CLQ = "UNSIGNED-PAYLOAD",
    ULQ = 50,
    Ay1 = "aws4_request",
    qLQ = 604800,
    eZA = {},
    KoA = [],
    VoA = (A, Q, B) => `${A}/${Q}/${B}/${Ay1}`,
    NLQ = async (A, Q, B, G, Z) => {
      let Y = await GLQ(A, Q.secretAccessKey, Q.accessKeyId),
        J = `${B}:${G}:${Z}:${mi.toHex(Y)}:${Q.sessionToken}`;
      if (J in eZA) return eZA[J];
      KoA.push(J);
      while (KoA.length > ULQ) delete eZA[KoA.shift()];
      let X = `AWS4${Q.secretAccessKey}`;
      for (let I of [B, G, Z, Ay1]) X = await GLQ(A, X, I);
      return eZA[J] = X
    }, AQ6 = () => {
      KoA.length = 0, Object.keys(eZA).forEach((A) => {
        delete eZA[A]
      })
    }, GLQ = (A, Q, B) => {
      let G = new A(Q);
      return G.update(X0A.toUint8Array(B)), G.digest()
    }, nx1 = ({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let Y = Z.toLowerCase();
        if (Y in HLQ || Q?.has(Y) || ELQ.test(Y) || zLQ.test(Y)) {
          if (!B || B && !B.has(Y)) continue
        }
        G[Y] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, FoA = async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === HoA) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || o06.isArrayBuffer(Q)) {
        let G = new B;
        return G.update(X0A.toUint8Array(Q)), mi.toHex(await G.digest())
      }
      return CLQ
    };
  class wLQ {
    format(A) {
      let Q = [];
      for (let Z of Object.keys(A)) {
        let Y = X0A.fromUtf8(Z);
        Q.push(Uint8Array.from([Y.byteLength]), Y, this.formatHeaderValue(A[Z]))
      }
      let B = new Uint8Array(Q.reduce((Z, Y) => Z + Y.byteLength, 0)),
        G = 0;
      for (let Z of Q) B.set(Z, G), G += Z.byteLength;
      return B
    }
    formatHeaderValue(A) {
      switch (A.type) {
        case "boolean":
          return Uint8Array.from([A.value ? 0 : 1]);
        case "byte":
          return Uint8Array.from([2, A.value]);
        case "short":
          let Q = new DataView(new ArrayBuffer(3));
          return Q.setUint8(0, 3), Q.setInt16(1, A.value, !1), new Uint8Array(Q.buffer);
        case "integer":
          let B = new DataView(new ArrayBuffer(5));
          return B.setUint8(0, 4), B.setInt32(1, A.value, !1), new Uint8Array(B.buffer);
        case "long":
          let G = new Uint8Array(9);
          return G[0] = 5, G.set(A.value.bytes, 1), G;
        case "binary":
          let Z = new DataView(new ArrayBuffer(3 + A.value.byteLength));
          Z.setUint8(0, 6), Z.setUint16(1, A.value.byteLength, !1);
          let Y = new Uint8Array(Z.buffer);
          return Y.set(A.value, 3), Y;
        case "string":
          let J = X0A.fromUtf8(A.value),
            X = new DataView(new ArrayBuffer(3 + J.byteLength));
          X.setUint8(0, 7), X.setUint16(1, J.byteLength, !1);
          let I = new Uint8Array(X.buffer);
          return I.set(J, 3), I;
        case "timestamp":
          let D = new Uint8Array(9);
          return D[0] = 8, D.set(Qy1.fromNumber(A.value.valueOf()).bytes, 1), D;
        case "uuid":
          if (!QQ6.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
          let W = new Uint8Array(17);
          return W[0] = 9, W.set(mi.fromHex(A.value.replace(/\-/g, "")), 1), W
      }
    }
  }
  var QQ6 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  class Qy1 {
    bytes;
    constructor(A) {
      if (this.bytes = A, A.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
    }
    static fromNumber(A) {
      if (A > 9223372036854776000 || A < -9223372036854776000) throw Error(`${A} is too large (or, if negative, too small) to represent as an Int64`);
      let Q = new Uint8Array(8);
      for (let B = 7, G = Math.abs(Math.round(A)); B > -1 && G > 0; B--, G /= 256) Q[B] = G;
      if (A < 0) ZLQ(Q);
      return new Qy1(Q)
    }
    valueOf() {
      let A = this.bytes.slice(0),
        Q = A[0] & 128;
      if (Q) ZLQ(A);
      return parseInt(mi.toHex(A), 16) * (Q ? -1 : 1)
    }
    toString() {
      return String(this.valueOf())
    }
  }

  function ZLQ(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  var LLQ = (A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    },
    OLQ = (A, Q = {}) => {
      let {
        headers: B,
        query: G = {}
      } = YLQ.HttpRequest.clone(A);
      for (let Z of Object.keys(B)) {
        let Y = Z.toLowerCase();
        if (Y.slice(0, 6) === "x-amz-" && !Q.unhoistableHeaders?.has(Y) || Q.hoistableHeaders?.has(Y)) G[Z] = B[Z], delete B[Z]
      }
      return {
        ...A,
        headers: B,
        query: G
      }
    },
    ax1 = (A) => {
      A = YLQ.HttpRequest.clone(A);
      for (let Q of Object.keys(A.headers))
        if (KLQ.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    },
    MLQ = ({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A)) {
        if (G.toLowerCase() === VLQ) continue;
        let Z = DoA.escapeUri(G);
        Q.push(Z);
        let Y = A[G];
        if (typeof Y === "string") B[Z] = `${Z}=${DoA.escapeUri(Y)}`;
        else if (Array.isArray(Y)) B[Z] = Y.slice(0).reduce((J, X) => J.concat([`${Z}=${DoA.escapeUri(X)}`]), []).sort().join("&")
      }
      return Q.sort().map((G) => B[G]).filter((G) => G).join("&")
    },
    BQ6 = (A) => GQ6(A).toISOString().replace(/\.\d{3}Z$/, "Z"),
    GQ6 = (A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    };
  class By1 {
    service;
    regionProvider;
    credentialProvider;
    sha256;
    uriEscapePath;
    applyChecksum;
    constructor({
      applyChecksum: A,
      credentials: Q,
      region: B,
      service: G,
      sha256: Z,
      uriEscapePath: Y = !0
    }) {
      this.service = G, this.sha256 = Z, this.uriEscapePath = Y, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = BLQ.normalizeProvider(B), this.credentialProvider = BLQ.normalizeProvider(Q)
    }
    createCanonicalRequest(A, Q, B) {
      let G = Object.keys(Q).sort();
      return `${A.method}
${this.getCanonicalPath(A)}
${MLQ(A)}
${G.map((Z)=>`${Z}:${Q[Z]}`).join(`
`)}

${G.join(";")}
${B}`
    }
    async createStringToSign(A, Q, B, G) {
      let Z = new this.sha256;
      Z.update(X0A.toUint8Array(B));
      let Y = await Z.digest();
      return `${G}
${A}
${Q}
${mi.toHex(Y)}`
    }
    getCanonicalPath({
      path: A
    }) {
      if (this.uriEscapePath) {
        let Q = [];
        for (let Z of A.split("/")) {
          if (Z?.length === 0) continue;
          if (Z === ".") continue;
          if (Z === "..") Q.pop();
          else Q.push(Z)
        }
        let B = `${A?.startsWith("/")?"/":""}${Q.join("/")}${Q.length>0&&A?.endsWith("/")?"/":""}`;
        return DoA.escapeUri(B).replace(/%2F/g, "/")
      }
      return A
    }
    validateResolvedCredentials(A) {
      if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
    }
    formatDate(A) {
      let Q = BQ6(A).replace(/[\-:]/g, "");
      return {
        longDate: Q,
        shortDate: Q.slice(0, 8)
      }
    }
    getCanonicalHeaderList(A) {
      return Object.keys(A).sort().join(";")
    }
  }
  class RLQ extends By1 {
    headerFormatter = new wLQ;
    constructor({
      applyChecksum: A,
      credentials: Q,
      region: B,
      service: G,
      sha256: Z,
      uriEscapePath: Y = !0
    }) {
      super({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: Y
      })
    }
    async presign(A, Q = {}) {
      let {
        signingDate: B = new Date,
        expiresIn: G = 3600,
        unsignableHeaders: Z,
        unhoistableHeaders: Y,
        signableHeaders: J,
        hoistableHeaders: X,
        signingRegion: I,
        signingService: D
      } = Q, W = await this.credentialProvider();
      this.validateResolvedCredentials(W);
      let K = I ?? await this.regionProvider(),
        {
          longDate: V,
          shortDate: F
        } = this.formatDate(B);
      if (G > qLQ) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
      let H = VoA(F, K, D ?? this.service),
        E = OLQ(ax1(A), {
          unhoistableHeaders: Y,
          hoistableHeaders: X
        });
      if (W.sessionToken) E.query[sx1] = W.sessionToken;
      E.query[JLQ] = WoA, E.query[XLQ] = `${W.accessKeyId}/${H}`, E.query[ox1] = V, E.query[DLQ] = G.toString(10);
      let z = nx1(E, Z, J);
      return E.query[ILQ] = this.getCanonicalHeaderList(z), E.query[rx1] = await this.getSignature(V, H, this.getSigningKey(W, K, F, D), this.createCanonicalRequest(E, z, await FoA(A, this.sha256))), E
    }
    async sign(A, Q) {
      if (typeof A === "string") return this.signString(A, Q);
      else if (A.headers && A.payload) return this.signEvent(A, Q);
      else if (A.message) return this.signMessage(A, Q);
      else return this.signRequest(A, Q)
    }
    async signEvent({
      headers: A,
      payload: Q
    }, {
      signingDate: B = new Date,
      priorSignature: G,
      signingRegion: Z,
      signingService: Y
    }) {
      let J = Z ?? await this.regionProvider(),
        {
          shortDate: X,
          longDate: I
        } = this.formatDate(B),
        D = VoA(X, J, Y ?? this.service),
        W = await FoA({
          headers: {},
          body: Q
        }, this.sha256),
        K = new this.sha256;
      K.update(A);
      let V = mi.toHex(await K.digest()),
        F = [$LQ, I, D, G, V, W].join(`
`);
      return this.signString(F, {
        signingDate: B,
        signingRegion: J,
        signingService: Y
      })
    }
    async signMessage(A, {
      signingDate: Q = new Date,
      signingRegion: B,
      signingService: G
    }) {
      return this.signEvent({
        headers: this.headerFormatter.format(A.message.headers),
        payload: A.message.body
      }, {
        signingDate: Q,
        signingRegion: B,
        signingService: G,
        priorSignature: A.priorSignature
      }).then((Y) => {
        return {
          message: A.message,
          signature: Y
        }
      })
    }
    async signString(A, {
      signingDate: Q = new Date,
      signingRegion: B,
      signingService: G
    } = {}) {
      let Z = await this.credentialProvider();
      this.validateResolvedCredentials(Z);
      let Y = B ?? await this.regionProvider(),
        {
          shortDate: J
        } = this.formatDate(Q),
        X = new this.sha256(await this.getSigningKey(Z, Y, J, G));
      return X.update(X0A.toUint8Array(A)), mi.toHex(await X.digest())
    }
    async signRequest(A, {
      signingDate: Q = new Date,
      signableHeaders: B,
      unsignableHeaders: G,
      signingRegion: Z,
      signingService: Y
    } = {}) {
      let J = await this.credentialProvider();
      this.validateResolvedCredentials(J);
      let X = Z ?? await this.regionProvider(),
        I = ax1(A),
        {
          longDate: D,
          shortDate: W
        } = this.formatDate(Q),
        K = VoA(W, X, Y ?? this.service);
      if (I.headers[ex1] = D, J.sessionToken) I.headers[FLQ] = J.sessionToken;
      let V = await FoA(I, this.sha256);
      if (!LLQ(HoA, I.headers) && this.applyChecksum) I.headers[HoA] = V;
      let F = nx1(I, G, B),
        H = await this.getSignature(D, K, this.getSigningKey(J, X, W, Y), this.createCanonicalRequest(I, F, V));
      return I.headers[tx1] = `${WoA} Credential=${J.accessKeyId}/${K}, SignedHeaders=${this.getCanonicalHeaderList(F)}, Signature=${H}`, I
    }
    async getSignature(A, Q, B, G) {
      let Z = await this.createStringToSign(A, Q, G, WoA),
        Y = new this.sha256(await B);
      return Y.update(X0A.toUint8Array(Z)), mi.toHex(await Y.digest())
    }
    getSigningKey(A, Q, B, G) {
      return NLQ(this.sha256, A, B, Q, G || this.service)
    }
  }
  var ZQ6 = {
    SignatureV4a: null
  };
  YQ6.ALGORITHM_IDENTIFIER = WoA;
  YQ6.ALGORITHM_IDENTIFIER_V4A = e06;
  YQ6.ALGORITHM_QUERY_PARAM = JLQ;
  YQ6.ALWAYS_UNSIGNABLE_HEADERS = HLQ;
  YQ6.AMZ_DATE_HEADER = ex1;
  YQ6.AMZ_DATE_QUERY_PARAM = ox1;
  YQ6.AUTH_HEADER = tx1;
  YQ6.CREDENTIAL_QUERY_PARAM = XLQ;
  YQ6.DATE_HEADER = WLQ;
  YQ6.EVENT_ALGORITHM_IDENTIFIER = $LQ;
  YQ6.EXPIRES_QUERY_PARAM = DLQ;
  YQ6.GENERATED_HEADERS = KLQ;
  YQ6.HOST_HEADER = s06;
  YQ6.KEY_TYPE_IDENTIFIER = Ay1;
  YQ6.MAX_CACHE_SIZE = ULQ;
  YQ6.MAX_PRESIGNED_TTL = qLQ;
  YQ6.PROXY_HEADER_PATTERN = ELQ;
  YQ6.REGION_SET_PARAM = r06;
  YQ6.SEC_HEADER_PATTERN = zLQ;
  YQ6.SHA256_HEADER = HoA;
  YQ6.SIGNATURE_HEADER = VLQ;
  YQ6.SIGNATURE_QUERY_PARAM = rx1;
  YQ6.SIGNED_HEADERS_QUERY_PARAM = ILQ;
  YQ6.SignatureV4 = RLQ;
  YQ6.SignatureV4Base = By1;
  YQ6.TOKEN_HEADER = FLQ;
  YQ6.TOKEN_QUERY_PARAM = sx1;
  YQ6.UNSIGNABLE_PATTERNS = t06;
  YQ6.UNSIGNED_PAYLOAD = CLQ;
  YQ6.clearCredentialCache = AQ6;
  YQ6.createScope = VoA;
  YQ6.getCanonicalHeaders = nx1;
  YQ6.getCanonicalQuery = MLQ;
  YQ6.getPayloadHash = FoA;
  YQ6.getSigningKey = NLQ;
  YQ6.hasHeader = LLQ;
  YQ6.moveHeadersToQuery = OLQ;
  YQ6.prepareRequest = ax1;
  YQ6.signatureV4aContainer = ZQ6
})
// @from(Ln 79765, Col 4)
jLQ = U((iQ6) => {
  var _LQ = typeof TextEncoder == "function" ? new TextEncoder : null,
    lQ6 = (A) => {
      if (typeof A === "string") {
        if (_LQ) return _LQ.encode(A).byteLength;
        let Q = A.length;
        for (let B = Q - 1; B >= 0; B--) {
          let G = A.charCodeAt(B);
          if (G > 127 && G <= 2047) Q++;
          else if (G > 2047 && G <= 65535) Q += 2;
          if (G >= 56320 && G <= 57343) B--
        }
        return Q
      } else if (typeof A.byteLength === "number") return A.byteLength;
      else if (typeof A.size === "number") return A.size;
      throw Error(`Body Length computation failed for ${A}`)
    };
  iQ6.calculateBodyLength = lQ6
})
// @from(Ln 79784, Col 4)
$y1 = U((zB6) => {
  var UoA = Oq(),
    xLQ = oG(),
    rNA = Mq(),
    aQ6 = TNA(),
    oQ6 = jLQ(),
    AYA = WX(),
    rQ6 = Jz(),
    yLQ = Kx1(),
    $oA = 0,
    CoA = 1,
    I0A = 2,
    di = 3,
    oNA = 4,
    EoA = 5,
    vLQ = 6,
    Zy1 = 7,
    kLQ = 20,
    Xy1 = 21,
    bLQ = 22,
    sQ6 = 23,
    Dy1 = 24,
    D0A = 25,
    W0A = 26,
    ci = 27,
    Wy1 = 31;

  function QYA(A) {
    return typeof Buffer < "u" ? Buffer.alloc(A) : new Uint8Array(A)
  }
  var Ky1 = Symbol("@smithy/core/cbor::tagSymbol");

  function Vy1(A) {
    return A[Ky1] = !0, A
  }
  var tQ6 = typeof TextDecoder < "u",
    eQ6 = typeof Buffer < "u",
    OZ = QYA(0),
    lg = new DataView(OZ.buffer, OZ.byteOffset, OZ.byteLength),
    TLQ = tQ6 ? new TextDecoder : null,
    k8 = 0;

  function AB6(A) {
    OZ = A, lg = new DataView(OZ.buffer, OZ.byteOffset, OZ.byteLength)
  }

  function ig(A, Q) {
    if (A >= Q) throw Error("unexpected end of (decode) payload.");
    let B = (OZ[A] & 224) >> 5,
      G = OZ[A] & 31;
    switch (B) {
      case $oA:
      case CoA:
      case vLQ:
        let Z, Y;
        if (G < 24) Z = G, Y = 1;
        else switch (G) {
          case Dy1:
          case D0A:
          case W0A:
          case ci:
            let J = hLQ[G],
              X = J + 1;
            if (Y = X, Q - A < X) throw Error(`countLength ${J} greater than remaining buf len.`);
            let I = A + 1;
            if (J === 1) Z = OZ[I];
            else if (J === 2) Z = lg.getUint16(I);
            else if (J === 4) Z = lg.getUint32(I);
            else Z = lg.getBigUint64(I);
            break;
          default:
            throw Error(`unexpected minor value ${G}.`)
        }
        if (B === $oA) return k8 = Y, Yy1(Z);
        else if (B === CoA) {
          let J;
          if (typeof Z === "bigint") J = BigInt(-1) - Z;
          else J = -1 - Z;
          return k8 = Y, Yy1(J)
        } else if (G === 2 || G === 3) {
          let J = sNA(A + Y, Q),
            X = BigInt(0),
            I = A + Y + k8;
          for (let D = I; D < I + J; ++D) X = X << BigInt(8) | BigInt(OZ[D]);
          return k8 = Y + k8 + J, G === 3 ? -X - BigInt(1) : X
        } else if (G === 4) {
          let J = ig(A + Y, Q),
            [X, I] = J,
            D = I < 0 ? -1 : 1,
            W = "0".repeat(Math.abs(X) + 1) + String(BigInt(D) * BigInt(I)),
            K, V = I < 0 ? "-" : "";
          if (K = X === 0 ? W : W.slice(0, W.length + X) + "." + W.slice(X), K = K.replace(/^0+/g, ""), K === "") K = "0";
          if (K[0] === ".") K = "0" + K;
          return K = V + K, k8 = Y + k8, UoA.nv(K)
        } else {
          let J = ig(A + Y, Q);
          return k8 = Y + k8, Vy1({
            tag: Yy1(Z),
            value: J
          })
        }
      case di:
      case EoA:
      case oNA:
      case I0A:
        if (G === Wy1) switch (B) {
          case di:
            return ZB6(A, Q);
          case EoA:
            return DB6(A, Q);
          case oNA:
            return XB6(A, Q);
          case I0A:
            return YB6(A, Q)
        } else switch (B) {
          case di:
            return GB6(A, Q);
          case EoA:
            return IB6(A, Q);
          case oNA:
            return JB6(A, Q);
          case I0A:
            return Fy1(A, Q)
        }
      default:
        return WB6(A, Q)
    }
  }

  function fLQ(A, Q, B) {
    if (eQ6 && A.constructor?.name === "Buffer") return A.toString("utf-8", Q, B);
    if (TLQ) return TLQ.decode(A.subarray(Q, B));
    return xLQ.toUtf8(A.subarray(Q, B))
  }

  function QB6(A) {
    let Q = Number(A);
    if (Q < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < Q) console.warn(Error(`@smithy/core/cbor - truncating BigInt(${A}) to ${Q} with loss of precision.`));
    return Q
  }
  var hLQ = {
    [Dy1]: 1,
    [D0A]: 2,
    [W0A]: 4,
    [ci]: 8
  };

  function BB6(A, Q) {
    let B = A >> 7,
      G = (A & 124) >> 2,
      Z = (A & 3) << 8 | Q,
      Y = B === 0 ? 1 : -1,
      J, X;
    if (G === 0)
      if (Z === 0) return 0;
      else J = Math.pow(2, -14), X = 0;
    else if (G === 31)
      if (Z === 0) return Y * (1 / 0);
      else return NaN;
    else J = Math.pow(2, G - 15), X = 1;
    return X += Z / 1024, Y * (J * X)
  }

  function sNA(A, Q) {
    let B = OZ[A] & 31;
    if (B < 24) return k8 = 1, B;
    if (B === Dy1 || B === D0A || B === W0A || B === ci) {
      let G = hLQ[B];
      if (k8 = G + 1, Q - A < k8) throw Error(`countLength ${G} greater than remaining buf len.`);
      let Z = A + 1;
      if (G === 1) return OZ[Z];
      else if (G === 2) return lg.getUint16(Z);
      else if (G === 4) return lg.getUint32(Z);
      return QB6(lg.getBigUint64(Z))
    }
    throw Error(`unexpected minor value ${B}.`)
  }

  function GB6(A, Q) {
    let B = sNA(A, Q),
      G = k8;
    if (A += G, Q - A < B) throw Error(`string len ${B} greater than remaining buf len.`);
    let Z = fLQ(OZ, A, A + B);
    return k8 = G + B, Z
  }

  function ZB6(A, Q) {
    A += 1;
    let B = [];
    for (let G = A; A < Q;) {
      if (OZ[A] === 255) {
        let I = QYA(B.length);
        return I.set(B, 0), k8 = A - G + 2, fLQ(I, 0, I.length)
      }
      let Z = (OZ[A] & 224) >> 5,
        Y = OZ[A] & 31;
      if (Z !== di) throw Error(`unexpected major type ${Z} in indefinite string.`);
      if (Y === Wy1) throw Error("nested indefinite string.");
      let J = Fy1(A, Q);
      A += k8;
      for (let I = 0; I < J.length; ++I) B.push(J[I])
    }
    throw Error("expected break marker.")
  }

  function Fy1(A, Q) {
    let B = sNA(A, Q),
      G = k8;
    if (A += G, Q - A < B) throw Error(`unstructured byte string len ${B} greater than remaining buf len.`);
    let Z = OZ.subarray(A, A + B);
    return k8 = G + B, Z
  }

  function YB6(A, Q) {
    A += 1;
    let B = [];
    for (let G = A; A < Q;) {
      if (OZ[A] === 255) {
        let I = QYA(B.length);
        return I.set(B, 0), k8 = A - G + 2, I
      }
      let Z = (OZ[A] & 224) >> 5,
        Y = OZ[A] & 31;
      if (Z !== I0A) throw Error(`unexpected major type ${Z} in indefinite string.`);
      if (Y === Wy1) throw Error("nested indefinite string.");
      let J = Fy1(A, Q);
      A += k8;
      for (let I = 0; I < J.length; ++I) B.push(J[I])
    }
    throw Error("expected break marker.")
  }

  function JB6(A, Q) {
    let B = sNA(A, Q),
      G = k8;
    A += G;
    let Z = A,
      Y = Array(B);
    for (let J = 0; J < B; ++J) {
      let X = ig(A, Q),
        I = k8;
      Y[J] = X, A += I
    }
    return k8 = G + (A - Z), Y
  }

  function XB6(A, Q) {
    A += 1;
    let B = [];
    for (let G = A; A < Q;) {
      if (OZ[A] === 255) return k8 = A - G + 2, B;
      let Z = ig(A, Q);
      A += k8, B.push(Z)
    }
    throw Error("expected break marker.")
  }

  function IB6(A, Q) {
    let B = sNA(A, Q),
      G = k8;
    A += G;
    let Z = A,
      Y = {};
    for (let J = 0; J < B; ++J) {
      if (A >= Q) throw Error("unexpected end of map payload.");
      let X = (OZ[A] & 224) >> 5;
      if (X !== di) throw Error(`unexpected major type ${X} for map key at index ${A}.`);
      let I = ig(A, Q);
      A += k8;
      let D = ig(A, Q);
      A += k8, Y[I] = D
    }
    return k8 = G + (A - Z), Y
  }

  function DB6(A, Q) {
    A += 1;
    let B = A,
      G = {};
    for (; A < Q;) {
      if (A >= Q) throw Error("unexpected end of map payload.");
      if (OZ[A] === 255) return k8 = A - B + 2, G;
      let Z = (OZ[A] & 224) >> 5;
      if (Z !== di) throw Error(`unexpected major type ${Z} for map key.`);
      let Y = ig(A, Q);
      A += k8;
      let J = ig(A, Q);
      A += k8, G[Y] = J
    }
    throw Error("expected break marker.")
  }

  function WB6(A, Q) {
    let B = OZ[A] & 31;
    switch (B) {
      case Xy1:
      case kLQ:
        return k8 = 1, B === Xy1;
      case bLQ:
        return k8 = 1, null;
      case sQ6:
        return k8 = 1, null;
      case D0A:
        if (Q - A < 3) throw Error("incomplete float16 at end of buf.");
        return k8 = 3, BB6(OZ[A + 1], OZ[A + 2]);
      case W0A:
        if (Q - A < 5) throw Error("incomplete float32 at end of buf.");
        return k8 = 5, lg.getFloat32(A + 1);
      case ci:
        if (Q - A < 9) throw Error("incomplete float64 at end of buf.");
        return k8 = 9, lg.getFloat64(A + 1);
      default:
        throw Error(`unexpected minor value ${B}.`)
    }
  }

  function Yy1(A) {
    if (typeof A === "number") return A;
    let Q = Number(A);
    if (Number.MIN_SAFE_INTEGER <= Q && Q <= Number.MAX_SAFE_INTEGER) return Q;
    return A
  }
  var PLQ = typeof Buffer < "u",
    KB6 = 2048,
    y6 = QYA(KB6),
    pg = new DataView(y6.buffer, y6.byteOffset, y6.byteLength),
    n9 = 0;

  function Jy1(A) {
    if (y6.byteLength - n9 < A)
      if (n9 < 16000000) Iy1(Math.max(y6.byteLength * 4, y6.byteLength + A));
      else Iy1(y6.byteLength + A + 16000000)
  }

  function SLQ() {
    let A = QYA(n9);
    return A.set(y6.subarray(0, n9), 0), n9 = 0, A
  }

  function Iy1(A) {
    let Q = y6;
    if (y6 = QYA(A), Q)
      if (Q.copy) Q.copy(y6, 0, 0, Q.byteLength);
      else y6.set(Q, 0);
    pg = new DataView(y6.buffer, y6.byteOffset, y6.byteLength)
  }

  function cg(A, Q) {
    if (Q < 24) y6[n9++] = A << 5 | Q;
    else if (Q < 256) y6[n9++] = A << 5 | 24, y6[n9++] = Q;
    else if (Q < 65536) y6[n9++] = A << 5 | D0A, pg.setUint16(n9, Q), n9 += 2;
    else if (Q < 4294967296) y6[n9++] = A << 5 | W0A, pg.setUint32(n9, Q), n9 += 4;
    else y6[n9++] = A << 5 | ci, pg.setBigUint64(n9, typeof Q === "bigint" ? Q : BigInt(Q)), n9 += 8
  }

  function VB6(A) {
    let Q = [A];
    while (Q.length) {
      let B = Q.pop();
      if (Jy1(typeof B === "string" ? B.length * 4 : 64), typeof B === "string") {
        if (PLQ) cg(di, Buffer.byteLength(B)), n9 += y6.write(B, n9);
        else {
          let G = xLQ.fromUtf8(B);
          cg(di, G.byteLength), y6.set(G, n9), n9 += G.byteLength
        }
        continue
      } else if (typeof B === "number") {
        if (Number.isInteger(B)) {
          let G = B >= 0,
            Z = G ? $oA : CoA,
            Y = G ? B : -B - 1;
          if (Y < 24) y6[n9++] = Z << 5 | Y;
          else if (Y < 256) y6[n9++] = Z << 5 | 24, y6[n9++] = Y;
          else if (Y < 65536) y6[n9++] = Z << 5 | D0A, y6[n9++] = Y >> 8, y6[n9++] = Y;
          else if (Y < 4294967296) y6[n9++] = Z << 5 | W0A, pg.setUint32(n9, Y), n9 += 4;
          else y6[n9++] = Z << 5 | ci, pg.setBigUint64(n9, BigInt(Y)), n9 += 8;
          continue
        }
        y6[n9++] = Zy1 << 5 | ci, pg.setFloat64(n9, B), n9 += 8;
        continue
      } else if (typeof B === "bigint") {
        let G = B >= 0,
          Z = G ? $oA : CoA,
          Y = G ? B : -B - BigInt(1),
          J = Number(Y);
        if (J < 24) y6[n9++] = Z << 5 | J;
        else if (J < 256) y6[n9++] = Z << 5 | 24, y6[n9++] = J;
        else if (J < 65536) y6[n9++] = Z << 5 | D0A, y6[n9++] = J >> 8, y6[n9++] = J & 255;
        else if (J < 4294967296) y6[n9++] = Z << 5 | W0A, pg.setUint32(n9, J), n9 += 4;
        else if (Y < BigInt("18446744073709551616")) y6[n9++] = Z << 5 | ci, pg.setBigUint64(n9, Y), n9 += 8;
        else {
          let X = Y.toString(2),
            I = new Uint8Array(Math.ceil(X.length / 8)),
            D = Y,
            W = 0;
          while (I.byteLength - ++W >= 0) I[I.byteLength - W] = Number(D & BigInt(255)), D >>= BigInt(8);
          if (Jy1(I.byteLength * 2), y6[n9++] = G ? 194 : 195, PLQ) cg(I0A, Buffer.byteLength(I));
          else cg(I0A, I.byteLength);
          y6.set(I, n9), n9 += I.byteLength
        }
        continue
      } else if (B === null) {
        y6[n9++] = Zy1 << 5 | bLQ;
        continue
      } else if (typeof B === "boolean") {
        y6[n9++] = Zy1 << 5 | (B ? Xy1 : kLQ);
        continue
      } else if (typeof B > "u") throw Error("@smithy/core/cbor: client may not serialize undefined value.");
      else if (Array.isArray(B)) {
        for (let G = B.length - 1; G >= 0; --G) Q.push(B[G]);
        cg(oNA, B.length);
        continue
      } else if (typeof B.byteLength === "number") {
        Jy1(B.length * 2), cg(I0A, B.length), y6.set(B, n9), n9 += B.byteLength;
        continue
      } else if (typeof B === "object") {
        if (B instanceof UoA.NumericValue) {
          let Z = B.string.indexOf("."),
            Y = Z === -1 ? 0 : Z - B.string.length + 1,
            J = BigInt(B.string.replace(".", ""));
          y6[n9++] = 196, Q.push(J), Q.push(Y), cg(oNA, 2);
          continue
        }
        if (B[Ky1])
          if ("tag" in B && "value" in B) {
            Q.push(B.value), cg(vLQ, B.tag);
            continue
          } else throw Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(B));
        let G = Object.keys(B);
        for (let Z = G.length - 1; Z >= 0; --Z) {
          let Y = G[Z];
          Q.push(B[Y]), Q.push(Y)
        }
        cg(EoA, G.length);
        continue
      }
      throw Error(`data type ${B?.constructor?.name??typeof B} not compatible for encoding.`)
    }
  }
  var qoA = {
      deserialize(A) {
        return AB6(A), ig(0, A.length)
      },
      serialize(A) {
        try {
          return VB6(A), SLQ()
        } catch (Q) {
          throw SLQ(), Q
        }
      },
      resizeEncodingBuffer(A) {
        Iy1(A)
      }
    },
    gLQ = (A, Q) => {
      return rNA.collectBody(A, Q).then(async (B) => {
        if (B.length) try {
          return qoA.deserialize(B)
        } catch (G) {
          throw Object.defineProperty(G, "$responseBodyText", {
            value: Q.utf8Encoder(B)
          }), G
        }
        return {}
      })
    },
    zoA = (A) => {
      return Vy1({
        tag: 1,
        value: A.getTime() / 1000
      })
    },
    FB6 = async (A, Q) => {
      let B = await gLQ(A, Q);
      return B.message = B.message ?? B.Message, B
    }, uLQ = (A, Q) => {
      let B = (Z) => {
        let Y = Z;
        if (typeof Y === "number") Y = Y.toString();
        if (Y.indexOf(",") >= 0) Y = Y.split(",")[0];
        if (Y.indexOf(":") >= 0) Y = Y.split(":")[0];
        if (Y.indexOf("#") >= 0) Y = Y.split("#")[1];
        return Y
      };
      if (Q.__type !== void 0) return B(Q.__type);
      let G = Object.keys(Q).find((Z) => Z.toLowerCase() === "code");
      if (G && Q[G] !== void 0) return B(Q[G])
    }, HB6 = (A) => {
      if (String(A.headers["smithy-protocol"]).toLowerCase() !== "rpc-v2-cbor") throw Error("Malformed RPCv2 CBOR response, status: " + A.statusCode)
    }, EB6 = async (A, Q, B, G, Z) => {
      let {
        hostname: Y,
        protocol: J = "https",
        port: X,
        path: I
      } = await A.endpoint(), D = {
        protocol: J,
        hostname: Y,
        port: X,
        method: "POST",
        path: I.endsWith("/") ? I.slice(0, -1) + B : I + B,
        headers: {
          ...Q
        }
      };
      if (G !== void 0) D.hostname = G;
      if (Z !== void 0) {
        D.body = Z;
        try {
          D.headers["content-length"] = String(oQ6.calculateBodyLength(Z))
        } catch (W) {}
      }
      return new aQ6.HttpRequest(D)
    };
  class Hy1 extends rNA.SerdeContext {
    createSerializer() {
      let A = new Ey1;
      return A.setSerdeContext(this.serdeContext), A
    }
    createDeserializer() {
      let A = new zy1;
      return A.setSerdeContext(this.serdeContext), A
    }
  }
  class Ey1 extends rNA.SerdeContext {
    value;
    write(A, Q) {
      this.value = this.serialize(A, Q)
    }
    serialize(A, Q) {
      let B = AYA.NormalizedSchema.of(A);
      if (Q == null) {
        if (B.isIdempotencyToken()) return UoA.generateIdempotencyToken();
        return Q
      }
      if (B.isBlobSchema()) {
        if (typeof Q === "string") return (this.serdeContext?.base64Decoder ?? yLQ.fromBase64)(Q);
        return Q
      }
      if (B.isTimestampSchema()) {
        if (typeof Q === "number" || typeof Q === "bigint") return zoA(new Date(Number(Q) / 1000 | 0));
        return zoA(Q)
      }
      if (typeof Q === "function" || typeof Q === "object") {
        let G = Q;
        if (B.isListSchema() && Array.isArray(G)) {
          let Y = !!B.getMergedTraits().sparse,
            J = [],
            X = 0;
          for (let I of G) {
            let D = this.serialize(B.getValueSchema(), I);
            if (D != null || Y) J[X++] = D
          }
          return J
        }
        if (G instanceof Date) return zoA(G);
        let Z = {};
        if (B.isMapSchema()) {
          let Y = !!B.getMergedTraits().sparse;
          for (let J of Object.keys(G)) {
            let X = this.serialize(B.getValueSchema(), G[J]);
            if (X != null || Y) Z[J] = X
          }
        } else if (B.isStructSchema())
          for (let [Y, J] of B.structIterator()) {
            let X = this.serialize(J, G[Y]);
            if (X != null) Z[Y] = X
          } else if (B.isDocumentSchema())
            for (let Y of Object.keys(G)) Z[Y] = this.serialize(B.getValueSchema(), G[Y]);
        return Z
      }
      return Q
    }
    flush() {
      let A = qoA.serialize(this.value);
      return this.value = void 0, A
    }
  }
  class zy1 extends rNA.SerdeContext {
    read(A, Q) {
      let B = qoA.deserialize(Q);
      return this.readValue(A, B)
    }
    readValue(A, Q) {
      let B = AYA.NormalizedSchema.of(A);
      if (B.isTimestampSchema() && typeof Q === "number") return UoA._parseEpochTimestamp(Q);
      if (B.isBlobSchema()) {
        if (typeof Q === "string") return (this.serdeContext?.base64Decoder ?? yLQ.fromBase64)(Q);
        return Q
      }
      if (typeof Q > "u" || typeof Q === "boolean" || typeof Q === "number" || typeof Q === "string" || typeof Q === "bigint" || typeof Q === "symbol") return Q;
      else if (typeof Q === "function" || typeof Q === "object") {
        if (Q === null) return null;
        if ("byteLength" in Q) return Q;
        if (Q instanceof Date) return Q;
        if (B.isDocumentSchema()) return Q;
        if (B.isListSchema()) {
          let Z = [],
            Y = B.getValueSchema(),
            J = !!B.getMergedTraits().sparse;
          for (let X of Q) {
            let I = this.readValue(Y, X);
            if (I != null || J) Z.push(I)
          }
          return Z
        }
        let G = {};
        if (B.isMapSchema()) {
          let Z = !!B.getMergedTraits().sparse,
            Y = B.getValueSchema();
          for (let J of Object.keys(Q)) {
            let X = this.readValue(Y, Q[J]);
            if (X != null || Z) G[J] = X
          }
        } else if (B.isStructSchema())
          for (let [Z, Y] of B.structIterator()) {
            let J = this.readValue(Y, Q[Z]);
            if (J != null) G[Z] = J
          }
        return G
      } else return Q
    }
  }
  class mLQ extends rNA.RpcProtocol {
    codec = new Hy1;
    serializer = this.codec.createSerializer();
    deserializer = this.codec.createDeserializer();
    constructor({
      defaultNamespace: A
    }) {
      super({
        defaultNamespace: A
      })
    }
    getShapeId() {
      return "smithy.protocols#rpcv2Cbor"
    }
    getPayloadCodec() {
      return this.codec
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (Object.assign(G.headers, {
          "content-type": this.getDefaultContentType(),
          "smithy-protocol": "rpc-v2-cbor",
          accept: this.getDefaultContentType()
        }), AYA.deref(A.input) === "unit") delete G.body, delete G.headers["content-type"];
      else {
        if (!G.body) this.serializer.write(15, {}), G.body = this.serializer.flush();
        try {
          G.headers["content-length"] = String(G.body.byteLength)
        } catch (X) {}
      }
      let {
        service: Z,
        operation: Y
      } = rQ6.getSmithyContext(B), J = `/service/${Z}/operation/${Y}`;
      if (G.path.endsWith("/")) G.path += J.slice(1);
      else G.path += J;
      return G
    }
    async deserializeResponse(A, Q, B) {
      return super.deserializeResponse(A, Q, B)
    }
    async handleError(A, Q, B, G, Z) {
      let Y = uLQ(B, G) ?? "Unknown",
        J = this.options.defaultNamespace;
      if (Y.includes("#"))[J] = Y.split("#");
      let X = {
          $metadata: Z,
          $fault: B.statusCode <= 500 ? "client" : "server"
        },
        I = AYA.TypeRegistry.for(J),
        D;
      try {
        D = I.getSchema(Y)
      } catch (E) {
        if (G.Message) G.message = G.Message;
        let z = AYA.TypeRegistry.for("smithy.ts.sdk.synthetic." + J),
          $ = z.getBaseException();
        if ($) {
          let O = z.getErrorCtor($);
          throw Object.assign(new O({
            name: Y
          }), X, G)
        }
        throw Object.assign(Error(Y), X, G)
      }
      let W = AYA.NormalizedSchema.of(D),
        K = I.getErrorCtor(D),
        V = G.message ?? G.Message ?? "Unknown",
        F = new K(V),
        H = {};
      for (let [E, z] of W.structIterator()) H[E] = this.deserializer.readValue(z, G[E]);
      throw Object.assign(F, X, {
        $fault: W.getMergedTraits().error,
        message: V
      }, H)
    }
    getDefaultContentType() {
      return "application/cbor"
    }
  }
  zB6.CborCodec = Hy1;
  zB6.CborShapeDeserializer = zy1;
  zB6.CborShapeSerializer = Ey1;
  zB6.SmithyRpcV2CborProtocol = mLQ;
  zB6.buildHttpRpcRequest = EB6;
  zB6.cbor = qoA;
  zB6.checkCborResponse = HB6;
  zB6.dateToTag = zoA;
  zB6.loadSmithyRpcV2CborErrorCode = uLQ;
  zB6.parseCborBody = gLQ;
  zB6.parseCborErrorBody = FB6;
  zB6.tag = Vy1;
  zB6.tagSymbol = Ky1
})
// @from(Ln 80501, Col 4)
Ev = U((PB6) => {
  var K0A = (A, Q) => {
      let B = [];
      if (A) B.push(A);
      if (Q)
        for (let G of Q) B.push(G);
      return B
    },
    pi = (A, Q) => {
      return `${A||"anonymous"}${Q&&Q.length>0?` (a.k.a. ${Q.join(",")})`:""}`
    },
    Cy1 = () => {
      let A = [],
        Q = [],
        B = !1,
        G = new Set,
        Z = (K) => K.sort((V, F) => dLQ[F.step] - dLQ[V.step] || cLQ[F.priority || "normal"] - cLQ[V.priority || "normal"]),
        Y = (K) => {
          let V = !1,
            F = (H) => {
              let E = K0A(H.name, H.aliases);
              if (E.includes(K)) {
                V = !0;
                for (let z of E) G.delete(z);
                return !1
              }
              return !0
            };
          return A = A.filter(F), Q = Q.filter(F), V
        },
        J = (K) => {
          let V = !1,
            F = (H) => {
              if (H.middleware === K) {
                V = !0;
                for (let E of K0A(H.name, H.aliases)) G.delete(E);
                return !1
              }
              return !0
            };
          return A = A.filter(F), Q = Q.filter(F), V
        },
        X = (K) => {
          return A.forEach((V) => {
            K.add(V.middleware, {
              ...V
            })
          }), Q.forEach((V) => {
            K.addRelativeTo(V.middleware, {
              ...V
            })
          }), K.identifyOnResolve?.(W.identifyOnResolve()), K
        },
        I = (K) => {
          let V = [];
          return K.before.forEach((F) => {
            if (F.before.length === 0 && F.after.length === 0) V.push(F);
            else V.push(...I(F))
          }), V.push(K), K.after.reverse().forEach((F) => {
            if (F.before.length === 0 && F.after.length === 0) V.push(F);
            else V.push(...I(F))
          }), V
        },
        D = (K = !1) => {
          let V = [],
            F = [],
            H = {};
          return A.forEach((z) => {
            let $ = {
              ...z,
              before: [],
              after: []
            };
            for (let O of K0A($.name, $.aliases)) H[O] = $;
            V.push($)
          }), Q.forEach((z) => {
            let $ = {
              ...z,
              before: [],
              after: []
            };
            for (let O of K0A($.name, $.aliases)) H[O] = $;
            F.push($)
          }), F.forEach((z) => {
            if (z.toMiddleware) {
              let $ = H[z.toMiddleware];
              if ($ === void 0) {
                if (K) return;
                throw Error(`${z.toMiddleware} is not found when adding ${pi(z.name,z.aliases)} middleware ${z.relation} ${z.toMiddleware}`)
              }
              if (z.relation === "after") $.after.push(z);
              if (z.relation === "before") $.before.push(z)
            }
          }), Z(V).map(I).reduce((z, $) => {
            return z.push(...$), z
          }, [])
        },
        W = {
          add: (K, V = {}) => {
            let {
              name: F,
              override: H,
              aliases: E
            } = V, z = {
              step: "initialize",
              priority: "normal",
              middleware: K,
              ...V
            }, $ = K0A(F, E);
            if ($.length > 0) {
              if ($.some((O) => G.has(O))) {
                if (!H) throw Error(`Duplicate middleware name '${pi(F,E)}'`);
                for (let O of $) {
                  let L = A.findIndex((_) => _.name === O || _.aliases?.some((j) => j === O));
                  if (L === -1) continue;
                  let M = A[L];
                  if (M.step !== z.step || z.priority !== M.priority) throw Error(`"${pi(M.name,M.aliases)}" middleware with ${M.priority} priority in ${M.step} step cannot be overridden by "${pi(F,E)}" middleware with ${z.priority} priority in ${z.step} step.`);
                  A.splice(L, 1)
                }
              }
              for (let O of $) G.add(O)
            }
            A.push(z)
          },
          addRelativeTo: (K, V) => {
            let {
              name: F,
              override: H,
              aliases: E
            } = V, z = {
              middleware: K,
              ...V
            }, $ = K0A(F, E);
            if ($.length > 0) {
              if ($.some((O) => G.has(O))) {
                if (!H) throw Error(`Duplicate middleware name '${pi(F,E)}'`);
                for (let O of $) {
                  let L = Q.findIndex((_) => _.name === O || _.aliases?.some((j) => j === O));
                  if (L === -1) continue;
                  let M = Q[L];
                  if (M.toMiddleware !== z.toMiddleware || M.relation !== z.relation) throw Error(`"${pi(M.name,M.aliases)}" middleware ${M.relation} "${M.toMiddleware}" middleware cannot be overridden by "${pi(F,E)}" middleware ${z.relation} "${z.toMiddleware}" middleware.`);
                  Q.splice(L, 1)
                }
              }
              for (let O of $) G.add(O)
            }
            Q.push(z)
          },
          clone: () => X(Cy1()),
          use: (K) => {
            K.applyToStack(W)
          },
          remove: (K) => {
            if (typeof K === "string") return Y(K);
            else return J(K)
          },
          removeByTag: (K) => {
            let V = !1,
              F = (H) => {
                let {
                  tags: E,
                  name: z,
                  aliases: $
                } = H;
                if (E && E.includes(K)) {
                  let O = K0A(z, $);
                  for (let L of O) G.delete(L);
                  return V = !0, !1
                }
                return !0
              };
            return A = A.filter(F), Q = Q.filter(F), V
          },
          concat: (K) => {
            let V = X(Cy1());
            return V.use(K), V.identifyOnResolve(B || V.identifyOnResolve() || (K.identifyOnResolve?.() ?? !1)), V
          },
          applyToStack: X,
          identify: () => {
            return D(!0).map((K) => {
              let V = K.step ?? K.relation + " " + K.toMiddleware;
              return pi(K.name, K.aliases) + " - " + V
            })
          },
          identifyOnResolve(K) {
            if (typeof K === "boolean") B = K;
            return B
          },
          resolve: (K, V) => {
            for (let F of D().map((H) => H.middleware).reverse()) K = F(K, V);
            if (B) console.log(W.identify());
            return K
          }
        };
      return W
    },
    dLQ = {
      initialize: 5,
      serialize: 4,
      build: 3,
      finalizeRequest: 2,
      deserialize: 1
    },
    cLQ = {
      high: 3,
      normal: 2,
      low: 1
    };
  PB6.constructStack = Cy1
})
// @from(Ln 80711, Col 4)
My1 = U((GYA) => {
  var iLQ = Ev(),
    Ly1 = Mq(),
    qy1 = dx1(),
    xB6 = WX(),
    pLQ = Oq();
  class nLQ {
    config;
    middlewareStack = iLQ.constructStack();
    initConfig;
    handlers;
    constructor(A) {
      this.config = A
    }
    send(A, Q, B) {
      let G = typeof Q !== "function" ? Q : void 0,
        Z = typeof Q === "function" ? Q : B,
        Y = G === void 0 && this.config.cacheMiddleware === !0,
        J;
      if (Y) {
        if (!this.handlers) this.handlers = new WeakMap;
        let X = this.handlers;
        if (X.has(A.constructor)) J = X.get(A.constructor);
        else J = A.resolveMiddleware(this.middlewareStack, this.config, G), X.set(A.constructor, J)
      } else delete this.handlers, J = A.resolveMiddleware(this.middlewareStack, this.config, G);
      if (Z) J(A).then((X) => Z(null, X.output), (X) => Z(X)).catch(() => {});
      else return J(A).then((X) => X.output)
    }
    destroy() {
      this.config?.requestHandler?.destroy?.(), delete this.handlers
    }
  }
  var Uy1 = "***SensitiveInformation***";

  function Ny1(A, Q) {
    if (Q == null) return Q;
    let B = xB6.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return Uy1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return Uy1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return Uy1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = Ny1(J, G[Y]);
      return Z
    }
    return Q
  }
  class Oy1 {
    middlewareStack = iLQ.constructStack();
    schema;
    static classBuilder() {
      return new aLQ
    }
    resolveMiddlewareWithContext(A, Q, B, {
      middlewareFn: G,
      clientName: Z,
      commandName: Y,
      inputFilterSensitiveLog: J,
      outputFilterSensitiveLog: X,
      smithyContext: I,
      additionalContext: D,
      CommandCtor: W
    }) {
      for (let E of G.bind(this)(W, A, Q, B)) this.middlewareStack.use(E);
      let K = A.concat(this.middlewareStack),
        {
          logger: V
        } = Q,
        F = {
          logger: V,
          clientName: Z,
          commandName: Y,
          inputFilterSensitiveLog: J,
          outputFilterSensitiveLog: X,
          [qy1.SMITHY_CONTEXT_KEY]: {
            commandInstance: this,
            ...I
          },
          ...D
        },
        {
          requestHandler: H
        } = Q;
      return K.resolve((E) => H.handle(E.request, B || {}), F)
    }
  }
  class aLQ {
    _init = () => {};
    _ep = {};
    _middlewareFn = () => [];
    _commandName = "";
    _clientName = "";
    _additionalContext = {};
    _smithyContext = {};
    _inputFilterSensitiveLog = void 0;
    _outputFilterSensitiveLog = void 0;
    _serializer = null;
    _deserializer = null;
    _operationSchema;
    init(A) {
      this._init = A
    }
    ep(A) {
      return this._ep = A, this
    }
    m(A) {
      return this._middlewareFn = A, this
    }
    s(A, Q, B = {}) {
      return this._smithyContext = {
        service: A,
        operation: Q,
        ...B
      }, this
    }
    c(A = {}) {
      return this._additionalContext = A, this
    }
    n(A, Q) {
      return this._clientName = A, this._commandName = Q, this
    }
    f(A = (B) => B, Q = (B) => B) {
      return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
    }
    ser(A) {
      return this._serializer = A, this
    }
    de(A) {
      return this._deserializer = A, this
    }
    sc(A) {
      return this._operationSchema = A, this._smithyContext.operationSchema = A, this
    }
    build() {
      let A = this,
        Q;
      return Q = class extends Oy1 {
        input;
        static getEndpointParameterInstructions() {
          return A._ep
        }
        constructor(...[B]) {
          super();
          this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
        }
        resolveMiddleware(B, G, Z) {
          let Y = A._operationSchema,
            J = Y?.[4] ?? Y?.input,
            X = Y?.[5] ?? Y?.output;
          return this.resolveMiddlewareWithContext(B, G, Z, {
            CommandCtor: Q,
            middlewareFn: A._middlewareFn,
            clientName: A._clientName,
            commandName: A._commandName,
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? Ny1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? Ny1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var yB6 = "***SensitiveInformation***",
    vB6 = (A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = async function (J, X, I) {
            let D = new G(J);
            if (typeof X === "function") this.send(D, X);
            else if (typeof I === "function") {
              if (typeof X !== "object") throw Error(`Expected http options but got ${typeof X}`);
              this.send(D, X || {}, I)
            } else return this.send(D, X)
          }, Y = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[Y] = Z
      }
    };
  class BYA extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(A) {
      super(A.message);
      Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return BYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === BYA) return BYA.isInstance(A);
      if (BYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var oLQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    rLQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = bB6(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw oLQ(J, Q)
    },
    kB6 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        rLQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    bB6 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    fB6 = (A) => {
      switch (A) {
        case "standard":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "in-region":
          return {
            retryMode: "standard", connectionTimeout: 1100
          };
        case "cross-region":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "mobile":
          return {
            retryMode: "standard", connectionTimeout: 30000
          };
        default:
          return {}
      }
    },
    lLQ = !1,
    hB6 = (A) => {
      if (A && !lLQ && parseInt(A.substring(1, A.indexOf("."))) < 16) lLQ = !0
    },
    gB6 = (A) => {
      let Q = [];
      for (let B in qy1.AlgorithmId) {
        let G = qy1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    uB6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    mB6 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    dB6 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    sLQ = (A) => {
      return Object.assign(gB6(A), mB6(A))
    },
    cB6 = sLQ,
    pB6 = (A) => {
      return Object.assign(uB6(A), dB6(A))
    },
    lB6 = (A) => Array.isArray(A) ? A : [A],
    tLQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = tLQ(A[B]);
      return A
    },
    iB6 = (A) => {
      return A != null
    };
  class eLQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function AOQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, oB6(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      QOQ(G, null, Y, J)
    }
    return G
  }
  var nB6 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    aB6 = (A, Q) => {
      let B = {};
      for (let G in Q) QOQ(B, A, Q, G);
      return B
    },
    oB6 = (A, Q, B) => {
      return AOQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    QOQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = rB6, I = sB6, D = G] = J;
        if (typeof X === "function" && X(Q[D]) || typeof X !== "function" && !!X) A[G] = I(Q[D]);
        return
      }
      let [Z, Y] = B[G];
      if (typeof Y === "function") {
        let J, X = Z === void 0 && (J = Y()) != null,
          I = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (X) A[G] = J;
        else if (I) A[G] = Y()
      } else {
        let J = Z === void 0 && Y != null,
          X = typeof Z === "function" && !!Z(Y) || typeof Z !== "function" && !!Z;
        if (J || X) A[G] = Y
      }
    },
    rB6 = (A) => A != null,
    sB6 = (A) => A,
    tB6 = (A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    },
    eB6 = (A) => A.toISOString().replace(".000Z", "Z"),
    wy1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(wy1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = wy1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(GYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return Ly1.collectBody
    }
  });
  Object.defineProperty(GYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return Ly1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(GYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return Ly1.resolvedPath
    }
  });
  GYA.Client = nLQ;
  GYA.Command = Oy1;
  GYA.NoOpLogger = eLQ;
  GYA.SENSITIVE_STRING = yB6;
  GYA.ServiceException = BYA;
  GYA._json = wy1;
  GYA.convertMap = nB6;
  GYA.createAggregatedClient = vB6;
  GYA.decorateServiceException = oLQ;
  GYA.emitWarningIfUnsupportedVersion = hB6;
  GYA.getArrayIfSingleItem = lB6;
  GYA.getDefaultClientConfiguration = cB6;
  GYA.getDefaultExtensionConfiguration = sLQ;
  GYA.getValueFromTextNode = tLQ;
  GYA.isSerializableHeaderValue = iB6;
  GYA.loadConfigsForDefaultMode = fB6;
  GYA.map = AOQ;
  GYA.resolveDefaultRuntimeConfig = pB6;
  GYA.serializeDateTime = eB6;
  GYA.serializeFloat = tB6;
  GYA.take = aB6;
  GYA.throwDefaultError = rLQ;
  GYA.withBaseException = kB6;
  Object.keys(pLQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(GYA, A)) Object.defineProperty(GYA, A, {
      enumerable: !0,
      get: function () {
        return pLQ[A]
      }
    })
  })
})
// @from(Ln 81181, Col 4)
BOQ = U((O26) => {
  var L26 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  O26.isArrayBuffer = L26
})
// @from(Ln 81185, Col 4)
_y1 = U((T26) => {
  var R26 = BOQ(),
    Ry1 = NA("buffer"),
    _26 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!R26.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Ry1.Buffer.from(A, Q, B)
    },
    j26 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Ry1.Buffer.from(A, Q) : Ry1.Buffer.from(A)
    };
  T26.fromArrayBuffer = _26;
  T26.fromString = j26
})
// @from(Ln 81199, Col 4)
YOQ = U((GOQ) => {
  Object.defineProperty(GOQ, "__esModule", {
    value: !0
  });
  GOQ.fromBase64 = void 0;
  var x26 = _y1(),
    y26 = /^[A-Za-z0-9+/]*={0,2}$/,
    v26 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!y26.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, x26.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  GOQ.fromBase64 = v26
})
// @from(Ln 81214, Col 4)
IOQ = U((JOQ) => {
  Object.defineProperty(JOQ, "__esModule", {
    value: !0
  });
  JOQ.toBase64 = void 0;
  var k26 = _y1(),
    b26 = oG(),
    f26 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, b26.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, k26.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  JOQ.toBase64 = f26
})
// @from(Ln 81230, Col 4)
jy1 = U((tNA) => {
  var DOQ = YOQ(),
    WOQ = IOQ();
  Object.keys(DOQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(tNA, A)) Object.defineProperty(tNA, A, {
      enumerable: !0,
      get: function () {
        return DOQ[A]
      }
    })
  });
  Object.keys(WOQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(tNA, A)) Object.defineProperty(tNA, A, {
      enumerable: !0,
      get: function () {
        return WOQ[A]
      }
    })
  })
})