
// @from(Start 2993149, End 2995132)
lR = z((N$7, PXQ) => {
  var {
    defineProperty: ugA,
    getOwnPropertyDescriptor: lm4,
    getOwnPropertyNames: im4
  } = Object, nm4 = Object.prototype.hasOwnProperty, mgA = (A, Q) => ugA(A, "name", {
    value: Q,
    configurable: !0
  }), am4 = (A, Q) => {
    for (var B in Q) ugA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, sm4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of im4(Q))
        if (!nm4.call(A, Z) && Z !== B) ugA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = lm4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rm4 = (A) => sm4(ugA({}, "__esModule", {
    value: !0
  }), A), MXQ = {};
  am4(MXQ, {
    emitWarningIfUnsupportedVersion: () => om4,
    setCredentialFeature: () => OXQ,
    setFeature: () => RXQ,
    setTokenFeature: () => TXQ,
    state: () => rN1
  });
  PXQ.exports = rm4(MXQ);
  var rN1 = {
      warningEmitted: !1
    },
    om4 = mgA((A) => {
      if (A && !rN1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) rN1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    }, "emitWarningIfUnsupportedVersion");

  function OXQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  mgA(OXQ, "setCredentialFeature");

  function RXQ(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }
  mgA(RXQ, "setFeature");

  function TXQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  mgA(TXQ, "setTokenFeature")
})
// @from(Start 2995138, End 2996091)
_XQ = z((L$7, SXQ) => {
  var {
    defineProperty: dgA,
    getOwnPropertyDescriptor: tm4,
    getOwnPropertyNames: em4
  } = Object, Ad4 = Object.prototype.hasOwnProperty, Qd4 = (A, Q) => dgA(A, "name", {
    value: Q,
    configurable: !0
  }), Bd4 = (A, Q) => {
    for (var B in Q) dgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Gd4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of em4(Q))
        if (!Ad4.call(A, Z) && Z !== B) dgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = tm4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Zd4 = (A) => Gd4(dgA({}, "__esModule", {
    value: !0
  }), A), jXQ = {};
  Bd4(jXQ, {
    isArrayBuffer: () => Id4
  });
  SXQ.exports = Zd4(jXQ);
  var Id4 = Qd4((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 2996097, End 2997150)
vXQ = z((M$7, xXQ) => {
  var {
    defineProperty: cgA,
    getOwnPropertyDescriptor: Yd4,
    getOwnPropertyNames: Jd4
  } = Object, Wd4 = Object.prototype.hasOwnProperty, oN1 = (A, Q) => cgA(A, "name", {
    value: Q,
    configurable: !0
  }), Xd4 = (A, Q) => {
    for (var B in Q) cgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Vd4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Jd4(Q))
        if (!Wd4.call(A, Z) && Z !== B) cgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Yd4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Fd4 = (A) => Vd4(cgA({}, "__esModule", {
    value: !0
  }), A), kXQ = {};
  Xd4(kXQ, {
    escapeUri: () => yXQ,
    escapeUriPath: () => Dd4
  });
  xXQ.exports = Fd4(kXQ);
  var yXQ = oN1((A) => encodeURIComponent(A).replace(/[!'()*]/g, Kd4), "escapeUri"),
    Kd4 = oN1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    Dd4 = oN1((A) => A.split("/").map(yXQ).join("/"), "escapeUriPath")
})
// @from(Start 2997156, End 3014069)
XVQ = z((O$7, WVQ) => {
  var {
    defineProperty: rgA,
    getOwnPropertyDescriptor: Hd4,
    getOwnPropertyNames: Cd4
  } = Object, Ed4 = Object.prototype.hasOwnProperty, ZD = (A, Q) => rgA(A, "name", {
    value: Q,
    configurable: !0
  }), zd4 = (A, Q) => {
    for (var B in Q) rgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Ud4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Cd4(Q))
        if (!Ed4.call(A, Z) && Z !== B) rgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Hd4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $d4 = (A) => Ud4(rgA({}, "__esModule", {
    value: !0
  }), A), uXQ = {};
  zd4(uXQ, {
    ALGORITHM_IDENTIFIER: () => pgA,
    ALGORITHM_IDENTIFIER_V4A: () => Ld4,
    ALGORITHM_QUERY_PARAM: () => mXQ,
    ALWAYS_UNSIGNABLE_HEADERS: () => sXQ,
    AMZ_DATE_HEADER: () => IL1,
    AMZ_DATE_QUERY_PARAM: () => QL1,
    AUTH_HEADER: () => ZL1,
    CREDENTIAL_QUERY_PARAM: () => dXQ,
    DATE_HEADER: () => lXQ,
    EVENT_ALGORITHM_IDENTIFIER: () => tXQ,
    EXPIRES_QUERY_PARAM: () => pXQ,
    GENERATED_HEADERS: () => iXQ,
    HOST_HEADER: () => qd4,
    KEY_TYPE_IDENTIFIER: () => YL1,
    MAX_CACHE_SIZE: () => AVQ,
    MAX_PRESIGNED_TTL: () => QVQ,
    PROXY_HEADER_PATTERN: () => rXQ,
    REGION_SET_PARAM: () => wd4,
    SEC_HEADER_PATTERN: () => oXQ,
    SHA256_HEADER: () => sgA,
    SIGNATURE_HEADER: () => nXQ,
    SIGNATURE_QUERY_PARAM: () => BL1,
    SIGNED_HEADERS_QUERY_PARAM: () => cXQ,
    SignatureV4: () => xd4,
    SignatureV4Base: () => JVQ,
    TOKEN_HEADER: () => aXQ,
    TOKEN_QUERY_PARAM: () => GL1,
    UNSIGNABLE_PATTERNS: () => Nd4,
    UNSIGNED_PAYLOAD: () => eXQ,
    clearCredentialCache: () => Od4,
    createScope: () => igA,
    getCanonicalHeaders: () => tN1,
    getCanonicalQuery: () => YVQ,
    getPayloadHash: () => ngA,
    getSigningKey: () => BVQ,
    hasHeader: () => GVQ,
    moveHeadersToQuery: () => IVQ,
    prepareRequest: () => AL1,
    signatureV4aContainer: () => vd4
  });
  WVQ.exports = $d4(uXQ);
  var bXQ = O2(),
    mXQ = "X-Amz-Algorithm",
    dXQ = "X-Amz-Credential",
    QL1 = "X-Amz-Date",
    cXQ = "X-Amz-SignedHeaders",
    pXQ = "X-Amz-Expires",
    BL1 = "X-Amz-Signature",
    GL1 = "X-Amz-Security-Token",
    wd4 = "X-Amz-Region-Set",
    ZL1 = "authorization",
    IL1 = QL1.toLowerCase(),
    lXQ = "date",
    iXQ = [ZL1, IL1, lXQ],
    nXQ = BL1.toLowerCase(),
    sgA = "x-amz-content-sha256",
    aXQ = GL1.toLowerCase(),
    qd4 = "host",
    sXQ = {
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
    rXQ = /^proxy-/,
    oXQ = /^sec-/,
    Nd4 = [/^proxy-/i, /^sec-/i],
    pgA = "AWS4-HMAC-SHA256",
    Ld4 = "AWS4-ECDSA-P256-SHA256",
    tXQ = "AWS4-HMAC-SHA256-PAYLOAD",
    eXQ = "UNSIGNED-PAYLOAD",
    AVQ = 50,
    YL1 = "aws4_request",
    QVQ = 604800,
    Td = Jd(),
    Md4 = O2(),
    k8A = {},
    lgA = [],
    igA = ZD((A, Q, B) => `${A}/${Q}/${B}/${YL1}`, "createScope"),
    BVQ = ZD(async (A, Q, B, G, Z) => {
      let I = await fXQ(A, Q.secretAccessKey, Q.accessKeyId),
        Y = `${B}:${G}:${Z}:${(0,Td.toHex)(I)}:${Q.sessionToken}`;
      if (Y in k8A) return k8A[Y];
      lgA.push(Y);
      while (lgA.length > AVQ) delete k8A[lgA.shift()];
      let J = `AWS4${Q.secretAccessKey}`;
      for (let W of [B, G, Z, YL1]) J = await fXQ(A, J, W);
      return k8A[Y] = J
    }, "getSigningKey"),
    Od4 = ZD(() => {
      lgA.length = 0, Object.keys(k8A).forEach((A) => {
        delete k8A[A]
      })
    }, "clearCredentialCache"),
    fXQ = ZD((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, Md4.toUint8Array)(B)), G.digest()
    }, "hmac"),
    tN1 = ZD(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let I = Z.toLowerCase();
        if (I in sXQ || Q?.has(I) || rXQ.test(I) || oXQ.test(I)) {
          if (!B || B && !B.has(I)) continue
        }
        G[I] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    Rd4 = _XQ(),
    Td4 = O2(),
    ngA = ZD(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === sgA) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, Rd4.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, Td4.toUint8Array)(Q)), (0, Td.toHex)(await G.digest())
      }
      return eXQ
    }, "getPayloadHash"),
    hXQ = O2(),
    Pd4 = class {
      static {
        ZD(this, "HeaderFormatter")
      }
      format(A) {
        let Q = [];
        for (let Z of Object.keys(A)) {
          let I = (0, hXQ.fromUtf8)(Z);
          Q.push(Uint8Array.from([I.byteLength]), I, this.formatHeaderValue(A[Z]))
        }
        let B = new Uint8Array(Q.reduce((Z, I) => Z + I.byteLength, 0)),
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
            let I = new Uint8Array(Z.buffer);
            return I.set(A.value, 3), I;
          case "string":
            let Y = (0, hXQ.fromUtf8)(A.value),
              J = new DataView(new ArrayBuffer(3 + Y.byteLength));
            J.setUint8(0, 7), J.setUint16(1, Y.byteLength, !1);
            let W = new Uint8Array(J.buffer);
            return W.set(Y, 3), W;
          case "timestamp":
            let X = new Uint8Array(9);
            return X[0] = 8, X.set(Sd4.fromNumber(A.value.valueOf()).bytes, 1), X;
          case "uuid":
            if (!jd4.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
            let V = new Uint8Array(17);
            return V[0] = 9, V.set((0, Td.fromHex)(A.value.replace(/\-/g, "")), 1), V
        }
      }
    },
    jd4 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    Sd4 = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static {
        ZD(this, "Int64")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) eN1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) eN1(Q);
        return parseInt((0, Td.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };

  function eN1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  ZD(eN1, "negate");
  var GVQ = ZD((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    ZVQ = iz(),
    IVQ = ZD((A, Q = {}) => {
      let {
        headers: B,
        query: G = {}
      } = ZVQ.HttpRequest.clone(A);
      for (let Z of Object.keys(B)) {
        let I = Z.toLowerCase();
        if (I.slice(0, 6) === "x-amz-" && !Q.unhoistableHeaders?.has(I) || Q.hoistableHeaders?.has(I)) G[Z] = B[Z], delete B[Z]
      }
      return {
        ...A,
        headers: B,
        query: G
      }
    }, "moveHeadersToQuery"),
    AL1 = ZD((A) => {
      A = ZVQ.HttpRequest.clone(A);
      for (let Q of Object.keys(A.headers))
        if (iXQ.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    gXQ = w7(),
    _d4 = O2(),
    agA = vXQ(),
    YVQ = ZD(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A)) {
        if (G.toLowerCase() === nXQ) continue;
        let Z = (0, agA.escapeUri)(G);
        Q.push(Z);
        let I = A[G];
        if (typeof I === "string") B[Z] = `${Z}=${(0,agA.escapeUri)(I)}`;
        else if (Array.isArray(I)) B[Z] = I.slice(0).reduce((Y, J) => Y.concat([`${Z}=${(0,agA.escapeUri)(J)}`]), []).sort().join("&")
      }
      return Q.sort().map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    kd4 = ZD((A) => yd4(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    yd4 = ZD((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    JVQ = class {
      static {
        ZD(this, "SignatureV4Base")
      }
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        this.service = G, this.sha256 = Z, this.uriEscapePath = I, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = (0, gXQ.normalizeProvider)(B), this.credentialProvider = (0, gXQ.normalizeProvider)(Q)
      }
      createCanonicalRequest(A, Q, B) {
        let G = Object.keys(Q).sort();
        return `${A.method}
${this.getCanonicalPath(A)}
${YVQ(A)}
${G.map((Z)=>`${Z}:${Q[Z]}`).join(`
`)}

${G.join(";")}
${B}`
      }
      async createStringToSign(A, Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, _d4.toUint8Array)(B));
        let I = await Z.digest();
        return `${G}
${A}
${Q}
${(0,Td.toHex)(I)}`
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
          return (0, agA.escapeUri)(B).replace(/%2F/g, "/")
        }
        return A
      }
      validateResolvedCredentials(A) {
        if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
      formatDate(A) {
        let Q = kd4(A).replace(/[\-:]/g, "");
        return {
          longDate: Q,
          shortDate: Q.slice(0, 8)
        }
      }
      getCanonicalHeaderList(A) {
        return Object.keys(A).sort().join(";")
      }
    },
    xd4 = class extends JVQ {
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        super({
          applyChecksum: A,
          credentials: Q,
          region: B,
          service: G,
          sha256: Z,
          uriEscapePath: I
        });
        this.headerFormatter = new Pd4
      }
      static {
        ZD(this, "SignatureV4")
      }
      async presign(A, Q = {}) {
        let {
          signingDate: B = new Date,
          expiresIn: G = 3600,
          unsignableHeaders: Z,
          unhoistableHeaders: I,
          signableHeaders: Y,
          hoistableHeaders: J,
          signingRegion: W,
          signingService: X
        } = Q, V = await this.credentialProvider();
        this.validateResolvedCredentials(V);
        let F = W ?? await this.regionProvider(),
          {
            longDate: K,
            shortDate: D
          } = this.formatDate(B);
        if (G > QVQ) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = igA(D, F, X ?? this.service),
          C = IVQ(AL1(A), {
            unhoistableHeaders: I,
            hoistableHeaders: J
          });
        if (V.sessionToken) C.query[GL1] = V.sessionToken;
        C.query[mXQ] = pgA, C.query[dXQ] = `${V.accessKeyId}/${H}`, C.query[QL1] = K, C.query[pXQ] = G.toString(10);
        let E = tN1(C, Z, Y);
        return C.query[cXQ] = this.getCanonicalHeaderList(E), C.query[BL1] = await this.getSignature(K, H, this.getSigningKey(V, F, D, X), this.createCanonicalRequest(C, E, await ngA(A, this.sha256))), C
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
        signingService: I
      }) {
        let Y = Z ?? await this.regionProvider(),
          {
            shortDate: J,
            longDate: W
          } = this.formatDate(B),
          X = igA(J, Y, I ?? this.service),
          V = await ngA({
            headers: {},
            body: Q
          }, this.sha256),
          F = new this.sha256;
        F.update(A);
        let K = (0, Td.toHex)(await F.digest()),
          D = [tXQ, W, X, G, K, V].join(`
`);
        return this.signString(D, {
          signingDate: B,
          signingRegion: Y,
          signingService: I
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
        }).then((I) => {
          return {
            message: A.message,
            signature: I
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
        let I = B ?? await this.regionProvider(),
          {
            shortDate: Y
          } = this.formatDate(Q),
          J = new this.sha256(await this.getSigningKey(Z, I, Y, G));
        return J.update((0, bXQ.toUint8Array)(A)), (0, Td.toHex)(await J.digest())
      }
      async signRequest(A, {
        signingDate: Q = new Date,
        signableHeaders: B,
        unsignableHeaders: G,
        signingRegion: Z,
        signingService: I
      } = {}) {
        let Y = await this.credentialProvider();
        this.validateResolvedCredentials(Y);
        let J = Z ?? await this.regionProvider(),
          W = AL1(A),
          {
            longDate: X,
            shortDate: V
          } = this.formatDate(Q),
          F = igA(V, J, I ?? this.service);
        if (W.headers[IL1] = X, Y.sessionToken) W.headers[aXQ] = Y.sessionToken;
        let K = await ngA(W, this.sha256);
        if (!GVQ(sgA, W.headers) && this.applyChecksum) W.headers[sgA] = K;
        let D = tN1(W, G, B),
          H = await this.getSignature(X, F, this.getSigningKey(Y, J, V, I), this.createCanonicalRequest(W, D, K));
        return W.headers[ZL1] = `${pgA} Credential=${Y.accessKeyId}/${F}, SignedHeaders=${this.getCanonicalHeaderList(D)}, Signature=${H}`, W
      }
      async getSignature(A, Q, B, G) {
        let Z = await this.createStringToSign(A, Q, G, pgA),
          I = new this.sha256(await B);
        return I.update((0, bXQ.toUint8Array)(Z)), (0, Td.toHex)(await I.digest())
      }
      getSigningKey(A, Q, B, G) {
        return BVQ(this.sha256, A, B, Q, G || this.service)
      }
    },
    vd4 = {
      SignatureV4a: null
    }
})
// @from(Start 3014075, End 3023489)
VL1 = z((j$7, NVQ) => {
  var {
    defineProperty: ogA,
    getOwnPropertyDescriptor: bd4,
    getOwnPropertyNames: fd4
  } = Object, hd4 = Object.prototype.hasOwnProperty, HW = (A, Q) => ogA(A, "name", {
    value: Q,
    configurable: !0
  }), gd4 = (A, Q) => {
    for (var B in Q) ogA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ud4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of fd4(Q))
        if (!hd4.call(A, Z) && Z !== B) ogA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = bd4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, md4 = (A) => ud4(ogA({}, "__esModule", {
    value: !0
  }), A), zVQ = {};
  gd4(zVQ, {
    AWSSDKSigV4Signer: () => ld4,
    AwsSdkSigV4ASigner: () => nd4,
    AwsSdkSigV4Signer: () => XL1,
    NODE_AUTH_SCHEME_PREFERENCE_OPTIONS: () => ad4,
    NODE_SIGV4A_CONFIG_OPTIONS: () => od4,
    getBearerTokenEnvKey: () => UVQ,
    resolveAWSSDKSigV4Config: () => ed4,
    resolveAwsSdkSigV4AConfig: () => rd4,
    resolveAwsSdkSigV4Config: () => $VQ,
    validateSigningProperties: () => WL1
  });
  NVQ.exports = md4(zVQ);
  var dd4 = iz(),
    cd4 = iz(),
    VVQ = HW((A) => cd4.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0, "getDateHeader"),
    JL1 = HW((A) => new Date(Date.now() + A), "getSkewCorrectedDate"),
    pd4 = HW((A, Q) => Math.abs(JL1(Q).getTime() - A) >= 300000, "isClockSkewed"),
    FVQ = HW((A, Q) => {
      let B = Date.parse(A);
      if (pd4(B, Q)) return B - Date.now();
      return Q
    }, "getUpdatedSystemClockOffset"),
    THA = HW((A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    }, "throwSigningPropertyError"),
    WL1 = HW(async (A) => {
      let Q = THA("context", A.context),
        B = THA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        I = await THA("signer", B.signer)(G),
        Y = A?.signingRegion,
        J = A?.signingRegionSet,
        W = A?.signingName;
      return {
        config: B,
        signer: I,
        signingRegion: Y,
        signingRegionSet: J,
        signingName: W
      }
    }, "validateSigningProperties"),
    XL1 = class {
      static {
        HW(this, "AwsSdkSigV4Signer")
      }
      async sign(A, Q, B) {
        if (!dd4.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let G = await WL1(B),
          {
            config: Z,
            signer: I
          } = G,
          {
            signingRegion: Y,
            signingName: J
          } = G,
          W = B.context;
        if (W?.authSchemes?.length ?? !1) {
          let [V, F] = W.authSchemes;
          if (V?.name === "sigv4a" && F?.name === "sigv4") Y = F?.signingRegion ?? Y, J = F?.signingName ?? J
        }
        return await I.sign(A, {
          signingDate: JL1(Z.systemClockOffset),
          signingRegion: Y,
          signingService: J
        })
      }
      errorHandler(A) {
        return (Q) => {
          let B = Q.ServerTime ?? VVQ(Q.$response);
          if (B) {
            let G = THA("config", A.config),
              Z = G.systemClockOffset;
            if (G.systemClockOffset = FVQ(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
          }
          throw Q
        }
      }
      successHandler(A, Q) {
        let B = VVQ(A);
        if (B) {
          let G = THA("config", Q.config);
          G.systemClockOffset = FVQ(B, G.systemClockOffset)
        }
      }
    },
    ld4 = XL1,
    id4 = iz(),
    nd4 = class extends XL1 {
      static {
        HW(this, "AwsSdkSigV4ASigner")
      }
      async sign(A, Q, B) {
        if (!id4.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let {
          config: G,
          signer: Z,
          signingRegion: I,
          signingRegionSet: Y,
          signingName: J
        } = await WL1(B), X = (await G.sigv4aSigningRegionSet?.() ?? Y ?? [I]).join(",");
        return await Z.sign(A, {
          signingDate: JL1(G.systemClockOffset),
          signingRegion: X,
          signingService: J
        })
      }
    },
    KVQ = HW((A) => typeof A === "string" && A.length > 0 ? A.split(",").map((Q) => Q.trim()) : [], "getArrayForCommaSeparatedString"),
    UVQ = HW((A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`, "getBearerTokenEnvKey"),
    DVQ = "AWS_AUTH_SCHEME_PREFERENCE",
    HVQ = "auth_scheme_preference",
    ad4 = {
      environmentVariableSelector: HW((A, Q) => {
        if (Q?.signingName) {
          if (UVQ(Q.signingName) in A) return ["httpBearerAuth"]
        }
        if (!(DVQ in A)) return;
        return KVQ(A[DVQ])
      }, "environmentVariableSelector"),
      configFileSelector: HW((A) => {
        if (!(HVQ in A)) return;
        return KVQ(A[HVQ])
      }, "configFileSelector"),
      default: []
    },
    sd4 = iB(),
    CVQ = j2(),
    rd4 = HW((A) => {
      return A.sigv4aSigningRegionSet = (0, sd4.normalizeProvider)(A.sigv4aSigningRegionSet), A
    }, "resolveAwsSdkSigV4AConfig"),
    od4 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new CVQ.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new CVQ.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    td4 = lR(),
    or = iB(),
    EVQ = XVQ(),
    $VQ = HW((A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(X) {
          if (X && X !== Q && X !== G) B = !0;
          Q = X;
          let V = wVQ(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            F = qVQ(A, V);
          if (B && !F.attributed) G = HW(async (K) => F(K).then((D) => (0, td4.setCredentialFeature)(D, "CREDENTIALS_CODE", "e")), "resolvedCredentials"), G.memoized = F.memoized, G.configBound = F.configBound, G.attributed = !0;
          else G = F
        },
        get() {
          return G
        },
        enumerable: !0,
        configurable: !0
      }), A.credentials = Q;
      let {
        signingEscapePath: Z = !0,
        systemClockOffset: I = A.systemClockOffset || 0,
        sha256: Y
      } = A, J;
      if (A.signer) J = (0, or.normalizeProvider)(A.signer);
      else if (A.regionInfoProvider) J = HW(() => (0, or.normalizeProvider)(A.region)().then(async (X) => [await A.regionInfoProvider(X, {
        useFipsEndpoint: await A.useFipsEndpoint(),
        useDualstackEndpoint: await A.useDualstackEndpoint()
      }) || {}, X]).then(([X, V]) => {
        let {
          signingRegion: F,
          signingService: K
        } = X;
        A.signingRegion = A.signingRegion || F || V, A.signingName = A.signingName || K || A.serviceId;
        let D = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: Y,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || EVQ.SignatureV4)(D)
      }), "signer");
      else J = HW(async (X) => {
        X = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await (0, or.normalizeProvider)(A.region)(),
          properties: {}
        }, X);
        let {
          signingRegion: V,
          signingName: F
        } = X;
        A.signingRegion = A.signingRegion || V, A.signingName = A.signingName || F || A.serviceId;
        let K = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: Y,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || EVQ.SignatureV4)(K)
      }, "signer");
      return Object.assign(A, {
        systemClockOffset: I,
        signingEscapePath: Z,
        signer: J
      })
    }, "resolveAwsSdkSigV4Config"),
    ed4 = $VQ;

  function wVQ(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = (0, or.memoizeIdentityProvider)(Q, or.isIdentityExpired, or.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = (0, or.normalizeProvider)(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = HW(async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    }, "credentialsProvider");
    return G.memoized = !0, G
  }
  HW(wVQ, "normalizeCredentialProvider");

  function qVQ(A, Q) {
    if (Q.configBound) return Q;
    let B = HW(async (G) => Q({
      ...G,
      callerClientConfig: A
    }), "fn");
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  HW(qVQ, "bindCallerConfig")
})
// @from(Start 3023495, End 3023982)
OVQ = z((LVQ) => {
  Object.defineProperty(LVQ, "__esModule", {
    value: !0
  });
  LVQ.fromBase64 = void 0;
  var Ac4 = hI(),
    Qc4 = /^[A-Za-z0-9+/]*={0,2}$/,
    Bc4 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!Qc4.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, Ac4.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  LVQ.fromBase64 = Bc4
})
// @from(Start 3023988, End 3024567)
PVQ = z((RVQ) => {
  Object.defineProperty(RVQ, "__esModule", {
    value: !0
  });
  RVQ.toBase64 = void 0;
  var Gc4 = hI(),
    Zc4 = O2(),
    Ic4 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, Zc4.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Gc4.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  RVQ.toBase64 = Ic4
})
// @from(Start 3024573, End 3025268)
Pd = z((x$7, tgA) => {
  var {
    defineProperty: jVQ,
    getOwnPropertyDescriptor: Yc4,
    getOwnPropertyNames: Jc4
  } = Object, Wc4 = Object.prototype.hasOwnProperty, FL1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Jc4(Q))
        if (!Wc4.call(A, Z) && Z !== B) jVQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Yc4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, SVQ = (A, Q, B) => (FL1(A, Q, "default"), B && FL1(B, Q, "default")), Xc4 = (A) => FL1(jVQ({}, "__esModule", {
    value: !0
  }), A), KL1 = {};
  tgA.exports = Xc4(KL1);
  SVQ(KL1, OVQ(), tgA.exports);
  SVQ(KL1, PVQ(), tgA.exports)
})
// @from(Start 3025274, End 3039298)
r6 = z((v$7, $L1) => {
  var {
    defineProperty: egA,
    getOwnPropertyDescriptor: Vc4,
    getOwnPropertyNames: Fc4
  } = Object, Kc4 = Object.prototype.hasOwnProperty, P3 = (A, Q) => egA(A, "name", {
    value: Q,
    configurable: !0
  }), Dc4 = (A, Q) => {
    for (var B in Q) egA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, HL1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Fc4(Q))
        if (!Kc4.call(A, Z) && Z !== B) egA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Vc4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Hc4 = (A, Q, B) => (HL1(A, Q, "default"), B && HL1(B, Q, "default")), Cc4 = (A) => HL1(egA({}, "__esModule", {
    value: !0
  }), A), zL1 = {};
  Dc4(zL1, {
    Client: () => Ec4,
    Command: () => yVQ,
    NoOpLogger: () => yc4,
    SENSITIVE_STRING: () => Uc4,
    ServiceException: () => wc4,
    _json: () => EL1,
    collectBody: () => DL1.collectBody,
    convertMap: () => xc4,
    createAggregatedClient: () => $c4,
    decorateServiceException: () => xVQ,
    emitWarningIfUnsupportedVersion: () => Mc4,
    extendedEncodeURIComponent: () => DL1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => _c4,
    getDefaultClientConfiguration: () => jc4,
    getDefaultExtensionConfiguration: () => bVQ,
    getValueFromTextNode: () => fVQ,
    isSerializableHeaderValue: () => kc4,
    loadConfigsForDefaultMode: () => Lc4,
    map: () => UL1,
    resolveDefaultRuntimeConfig: () => Sc4,
    resolvedPath: () => DL1.resolvedPath,
    serializeDateTime: () => uc4,
    serializeFloat: () => gc4,
    take: () => vc4,
    throwDefaultError: () => vVQ,
    withBaseException: () => qc4
  });
  $L1.exports = Cc4(zL1);
  var kVQ = uR(),
    Ec4 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, kVQ.constructStack)()
      }
      static {
        P3(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    DL1 = w5(),
    CL1 = iN1(),
    yVQ = class {
      constructor() {
        this.middlewareStack = (0, kVQ.constructStack)()
      }
      static {
        P3(this, "Command")
      }
      static classBuilder() {
        return new zc4
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [CL1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    zc4 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        P3(this, "ClassBuilder")
      }
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
        return Q = class extends yVQ {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
          }
          static {
            P3(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    Uc4 = "***SensitiveInformation***",
    $c4 = P3((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = P3(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    wc4 = class A extends Error {
      static {
        P3(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    xVQ = P3((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    vVQ = P3(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = Nc4(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw xVQ(Y, Q)
    }, "throwDefaultError"),
    qc4 = P3((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        vVQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    Nc4 = P3((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    Lc4 = P3((A) => {
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
    }, "loadConfigsForDefaultMode"),
    _VQ = !1,
    Mc4 = P3((A) => {
      if (A && !_VQ && parseInt(A.substring(1, A.indexOf("."))) < 16) _VQ = !0
    }, "emitWarningIfUnsupportedVersion"),
    Oc4 = P3((A) => {
      let Q = [];
      for (let B in CL1.AlgorithmId) {
        let G = CL1.AlgorithmId[B];
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
    }, "getChecksumConfiguration"),
    Rc4 = P3((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    Tc4 = P3((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    Pc4 = P3((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    bVQ = P3((A) => {
      return Object.assign(Oc4(A), Tc4(A))
    }, "getDefaultExtensionConfiguration"),
    jc4 = bVQ,
    Sc4 = P3((A) => {
      return Object.assign(Rc4(A), Pc4(A))
    }, "resolveDefaultRuntimeConfig"),
    _c4 = P3((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    fVQ = P3((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = fVQ(A[B]);
      return A
    }, "getValueFromTextNode"),
    kc4 = P3((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    yc4 = class {
      static {
        P3(this, "NoOpLogger")
      }
      trace() {}
      debug() {}
      info() {}
      warn() {}
      error() {}
    };

  function UL1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, bc4(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      hVQ(G, null, I, Y)
    }
    return G
  }
  P3(UL1, "map");
  var xc4 = P3((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    vc4 = P3((A, Q) => {
      let B = {};
      for (let G in Q) hVQ(B, A, Q, G);
      return B
    }, "take"),
    bc4 = P3((A, Q, B) => {
      return UL1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    hVQ = P3((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = fc4, W = hc4, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    fc4 = P3((A) => A != null, "nonNullish"),
    hc4 = P3((A) => A, "pass"),
    gc4 = P3((A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    }, "serializeFloat"),
    uc4 = P3((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    EL1 = P3((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(EL1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = EL1(A[B])
        }
        return Q
      }
      return A
    }, "_json");
  Hc4(zL1, s6(), $L1.exports)
})
// @from(Start 3039304, End 3084495)
AFQ = z((m$7, eVQ) => {
  var {
    defineProperty: QuA,
    getOwnPropertyDescriptor: mc4,
    getOwnPropertyNames: dc4
  } = Object, cc4 = Object.prototype.hasOwnProperty, I3 = (A, Q) => QuA(A, "name", {
    value: Q,
    configurable: !0
  }), pc4 = (A, Q) => {
    for (var B in Q) QuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, lc4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of dc4(Q))
        if (!cc4.call(A, Z) && Z !== B) QuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = mc4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ic4 = (A) => lc4(QuA({}, "__esModule", {
    value: !0
  }), A), cVQ = {};
  pc4(cVQ, {
    AwsEc2QueryProtocol: () => qp4,
    AwsJson1_0Protocol: () => Yp4,
    AwsJson1_1Protocol: () => Jp4,
    AwsJsonRpcProtocol: () => TL1,
    AwsQueryProtocol: () => aVQ,
    AwsRestJsonProtocol: () => Xp4,
    AwsRestXmlProtocol: () => Tp4,
    JsonCodec: () => RL1,
    JsonShapeDeserializer: () => iVQ,
    JsonShapeSerializer: () => nVQ,
    XmlCodec: () => tVQ,
    XmlShapeDeserializer: () => PL1,
    XmlShapeSerializer: () => oVQ,
    _toBool: () => ac4,
    _toNum: () => sc4,
    _toStr: () => nc4,
    awsExpectUnion: () => Fp4,
    loadRestJsonErrorCode: () => OL1,
    loadRestXmlErrorCode: () => rVQ,
    parseJsonBody: () => ML1,
    parseJsonErrorBody: () => Qp4,
    parseXmlBody: () => sVQ,
    parseXmlErrorBody: () => Op4
  });
  eVQ.exports = ic4(cVQ);
  var nc4 = I3((A) => {
      if (A == null) return A;
      if (typeof A === "number" || typeof A === "bigint") {
        let Q = Error(`Received number ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      if (typeof A === "boolean") {
        let Q = Error(`Received boolean ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      return A
    }, "_toStr"),
    ac4 = I3((A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (A !== "" && Q !== "false" && Q !== "true") {
          let B = Error(`Received string "${A}" where a boolean was expected.`);
          B.name = "Warning", console.warn(B)
        }
        return A !== "" && Q !== "false"
      }
      return A
    }, "_toBool"),
    sc4 = I3((A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = Number(A);
        if (Q.toString() !== A) {
          let B = Error(`Received string "${A}" where a number was expected.`);
          return B.name = "Warning", console.warn(B), A
        }
        return Q
      }
      return A
    }, "_toNum"),
    rc4 = w5(),
    y8A = b4(),
    oc4 = oK(),
    er = class {
      static {
        I3(this, "SerdeContextConfig")
      }
      serdeContext;
      setSerdeContext(A) {
        this.serdeContext = A
      }
    },
    PHA = b4(),
    x8A = s6(),
    tc4 = Pd(),
    ec4 = s6();

  function pVQ(A, Q, B) {
    if (B?.source) {
      let G = B.source;
      if (typeof Q === "number") {
        if (Q > Number.MAX_SAFE_INTEGER || Q < Number.MIN_SAFE_INTEGER || G !== String(Q))
          if (G.includes(".")) return new ec4.NumericValue(G, "bigDecimal");
          else return BigInt(G)
      }
    }
    return Q
  }
  I3(pVQ, "jsonReviver");
  var Ap4 = r6(),
    lVQ = I3((A, Q) => (0, Ap4.collectBody)(A, Q).then((B) => Q.utf8Encoder(B)), "collectBodyString"),
    ML1 = I3((A, Q) => lVQ(A, Q).then((B) => {
      if (B.length) try {
        return JSON.parse(B)
      } catch (G) {
        if (G?.name === "SyntaxError") Object.defineProperty(G, "$responseBodyText", {
          value: B
        });
        throw G
      }
      return {}
    }), "parseJsonBody"),
    Qp4 = I3(async (A, Q) => {
      let B = await ML1(A, Q);
      return B.message = B.message ?? B.Message, B
    }, "parseJsonErrorBody"),
    OL1 = I3((A, Q) => {
      let B = I3((I, Y) => Object.keys(I).find((J) => J.toLowerCase() === Y.toLowerCase()), "findKey"),
        G = I3((I) => {
          let Y = I;
          if (typeof Y === "number") Y = Y.toString();
          if (Y.indexOf(",") >= 0) Y = Y.split(",")[0];
          if (Y.indexOf(":") >= 0) Y = Y.split(":")[0];
          if (Y.indexOf("#") >= 0) Y = Y.split("#")[1];
          return Y
        }, "sanitizeErrorCode"),
        Z = B(A.headers, "x-amzn-errortype");
      if (Z !== void 0) return G(A.headers[Z]);
      if (Q && typeof Q === "object") {
        let I = B(Q, "code");
        if (I && Q[I] !== void 0) return G(Q[I]);
        if (Q.__type !== void 0) return G(Q.__type)
      }
    }, "loadRestJsonErrorCode"),
    iVQ = class extends er {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        I3(this, "JsonShapeDeserializer")
      }
      async read(A, Q) {
        return this._read(A, typeof Q === "string" ? JSON.parse(Q, pVQ) : await ML1(Q, this.serdeContext))
      }
      readObject(A, Q) {
        return this._read(A, Q)
      }
      _read(A, Q) {
        let B = Q !== null && typeof Q === "object",
          G = PHA.NormalizedSchema.of(A);
        if (G.isListSchema() && Array.isArray(Q)) {
          let I = G.getValueSchema(),
            Y = [],
            J = !!G.getMergedTraits().sparse;
          for (let W of Q)
            if (J || W != null) Y.push(this._read(I, W));
          return Y
        } else if (G.isMapSchema() && B) {
          let I = G.getValueSchema(),
            Y = {},
            J = !!G.getMergedTraits().sparse;
          for (let [W, X] of Object.entries(Q))
            if (J || X != null) Y[W] = this._read(I, X);
          return Y
        } else if (G.isStructSchema() && B) {
          let I = {};
          for (let [Y, J] of G.structIterator()) {
            let W = this.settings.jsonName ? J.getMergedTraits().jsonName ?? Y : Y,
              X = this._read(J, Q[W]);
            if (X != null) I[Y] = X
          }
          return I
        }
        if (G.isBlobSchema() && typeof Q === "string") return (0, tc4.fromBase64)(Q);
        let Z = G.getMergedTraits().mediaType;
        if (G.isStringSchema() && typeof Q === "string" && Z) {
          if (Z === "application/json" || Z.endsWith("+json")) return x8A.LazyJsonString.from(Q)
        }
        if (G.isTimestampSchema()) {
          let I = this.settings.timestampFormat;
          switch (I.useTrait ? G.getSchema() === PHA.SCHEMA.TIMESTAMP_DEFAULT ? I.default : G.getSchema() ?? I.default : I.default) {
            case PHA.SCHEMA.TIMESTAMP_DATE_TIME:
              return (0, x8A.parseRfc3339DateTimeWithOffset)(Q);
            case PHA.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, x8A.parseRfc7231DateTime)(Q);
            case PHA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              return (0, x8A.parseEpochTimestamp)(Q);
            default:
              return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
          }
        }
        if (G.isBigIntegerSchema() && (typeof Q === "number" || typeof Q === "string")) return BigInt(Q);
        if (G.isBigDecimalSchema() && Q != null) {
          if (Q instanceof x8A.NumericValue) return Q;
          return new x8A.NumericValue(String(Q), "bigDecimal")
        }
        if (G.isNumericSchema() && typeof Q === "string") switch (Q) {
          case "Infinity":
            return 1 / 0;
          case "-Infinity":
            return -1 / 0;
          case "NaN":
            return NaN
        }
        return Q
      }
    },
    v8A = b4(),
    Bp4 = s6(),
    Gp4 = s6(),
    Zp4 = s6(),
    gVQ = String.fromCharCode(925),
    Ip4 = class {
      static {
        I3(this, "JsonReplacer")
      }
      values = new Map;
      counter = 0;
      stage = 0;
      createReplacer() {
        if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
        if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
        return this.stage = 1, (A, Q) => {
          if (Q instanceof Zp4.NumericValue) {
            let B = `${gVQ+NaN+this.counter++}_` + Q.string;
            return this.values.set(`"${B}"`, Q.string), B
          }
          if (typeof Q === "bigint") {
            let B = Q.toString(),
              G = `${gVQ+"b"+this.counter++}_` + B;
            return this.values.set(`"${G}"`, B), G
          }
          return Q
        }
      }
      replaceInJson(A) {
        if (this.stage === 0) throw Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
        if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
        if (this.stage = 2, this.counter === 0) return A;
        for (let [Q, B] of this.values) A = A.replace(Q, B);
        return A
      }
    },
    nVQ = class extends er {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        I3(this, "JsonShapeSerializer")
      }
      buffer;
      rootSchema;
      write(A, Q) {
        this.rootSchema = v8A.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, Q)
      }
      flush() {
        if (this.rootSchema?.isStructSchema() || this.rootSchema?.isDocumentSchema()) {
          let A = new Ip4;
          return A.replaceInJson(JSON.stringify(this.buffer, A.createReplacer(), 0))
        }
        return this.buffer
      }
      _write(A, Q, B) {
        let G = Q !== null && typeof Q === "object",
          Z = v8A.NormalizedSchema.of(A);
        if (Z.isListSchema() && Array.isArray(Q)) {
          let Y = Z.getValueSchema(),
            J = [],
            W = !!Z.getMergedTraits().sparse;
          for (let X of Q)
            if (W || X != null) J.push(this._write(Y, X));
          return J
        } else if (Z.isMapSchema() && G) {
          let Y = Z.getValueSchema(),
            J = {},
            W = !!Z.getMergedTraits().sparse;
          for (let [X, V] of Object.entries(Q))
            if (W || V != null) J[X] = this._write(Y, V);
          return J
        } else if (Z.isStructSchema() && G) {
          let Y = {};
          for (let [J, W] of Z.structIterator()) {
            let X = this.settings.jsonName ? W.getMergedTraits().jsonName ?? J : J,
              V = this._write(W, Q[J], Z);
            if (V !== void 0) Y[X] = V
          }
          return Y
        }
        if (Q === null && B?.isStructSchema()) return;
        if (Z.isBlobSchema() && (Q instanceof Uint8Array || typeof Q === "string")) {
          if (Z === this.rootSchema) return Q;
          if (!this.serdeContext?.base64Encoder) throw Error("Missing base64Encoder in serdeContext");
          return this.serdeContext?.base64Encoder(Q)
        }
        if (Z.isTimestampSchema() && Q instanceof Date) {
          let Y = this.settings.timestampFormat;
          switch (Y.useTrait ? Z.getSchema() === v8A.SCHEMA.TIMESTAMP_DEFAULT ? Y.default : Z.getSchema() ?? Y.default : Y.default) {
            case v8A.SCHEMA.TIMESTAMP_DATE_TIME:
              return Q.toISOString().replace(".000Z", "Z");
            case v8A.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, Bp4.dateToUtcString)(Q);
            case v8A.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              return Q.getTime() / 1000;
            default:
              return console.warn("Missing timestamp format, using epoch seconds", Q), Q.getTime() / 1000
          }
        }
        if (Z.isNumericSchema() && typeof Q === "number") {
          if (Math.abs(Q) === 1 / 0 || isNaN(Q)) return String(Q)
        }
        let I = Z.getMergedTraits().mediaType;
        if (Z.isStringSchema() && typeof Q === "string" && I) {
          if (I === "application/json" || I.endsWith("+json")) return Gp4.LazyJsonString.from(Q)
        }
        return Q
      }
    },
    RL1 = class extends er {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        I3(this, "JsonCodec")
      }
      createSerializer() {
        let A = new nVQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new iVQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    TL1 = class extends rc4.RpcProtocol {
      static {
        I3(this, "AwsJsonRpcProtocol")
      }
      serializer;
      deserializer;
      codec;
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        });
        this.codec = new RL1({
          timestampFormat: {
            useTrait: !0,
            default: y8A.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          jsonName: !1
        }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer()
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B);
        if (!G.path.endsWith("/")) G.path += "/";
        if (Object.assign(G.headers, {
            "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
            "x-amz-target": (this.getJsonRpcVersion() === "1.0" ? "JsonRpc10." : "JsonProtocol.") + y8A.NormalizedSchema.of(A).getName()
          }), (0, y8A.deref)(A.input) === "unit" || !G.body) G.body = "{}";
        try {
          G.headers["content-length"] = String((0, oc4.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      getPayloadCodec() {
        return this.codec
      }
      async handleError(A, Q, B, G, Z) {
        let I = OL1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = y8A.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = y8A.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = y8A.NormalizedSchema.of(X),
          F = G.message ?? G.Message ?? "Unknown",
          K = new X.ctor(F);
        await this.deserializeHttpMessage(X, Q, B, G);
        let D = {};
        for (let [H, C] of V.structIterator()) {
          let E = C.getMergedTraits().jsonName ?? H;
          D[H] = this.codec.createDeserializer().readObject(C, G[E])
        }
        throw Object.assign(K, {
          $metadata: Z,
          $response: B,
          $fault: V.getMergedTraits().error,
          message: F,
          ...D
        }), K
      }
    },
    Yp4 = class extends TL1 {
      static {
        I3(this, "AwsJson1_0Protocol")
      }
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        })
      }
      getShapeId() {
        return "aws.protocols#awsJson1_0"
      }
      getJsonRpcVersion() {
        return "1.0"
      }
    },
    Jp4 = class extends TL1 {
      static {
        I3(this, "AwsJson1_1Protocol")
      }
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        })
      }
      getShapeId() {
        return "aws.protocols#awsJson1_1"
      }
      getJsonRpcVersion() {
        return "1.1"
      }
    },
    wL1 = w5(),
    jHA = b4(),
    Wp4 = oK(),
    Xp4 = class extends wL1.HttpBindingProtocol {
      static {
        I3(this, "AwsRestJsonProtocol")
      }
      serializer;
      deserializer;
      codec;
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        });
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: jHA.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          httpBindings: !0,
          jsonName: !0
        };
        this.codec = new RL1(Q), this.serializer = new wL1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new wL1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
      }
      getShapeId() {
        return "aws.protocols#restJson1"
      }
      getPayloadCodec() {
        return this.codec
      }
      setSerdeContext(A) {
        this.codec.setSerdeContext(A), super.setSerdeContext(A)
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B),
          Z = jHA.NormalizedSchema.of(A.input),
          I = Z.getMemberSchemas();
        if (!G.headers["content-type"]) {
          let Y = Object.values(I).find((J) => {
            return !!J.getMergedTraits().httpPayload
          });
          if (Y) {
            let J = Y.getMergedTraits().mediaType;
            if (J) G.headers["content-type"] = J;
            else if (Y.isStringSchema()) G.headers["content-type"] = "text/plain";
            else if (Y.isBlobSchema()) G.headers["content-type"] = "application/octet-stream";
            else G.headers["content-type"] = "application/json"
          } else if (!Z.isUnitSchema()) {
            if (Object.values(I).find((W) => {
                let {
                  httpQuery: X,
                  httpQueryParams: V,
                  httpHeader: F,
                  httpLabel: K,
                  httpPrefixHeaders: D
                } = W.getMergedTraits();
                return !X && !V && !F && !K && D === void 0
              })) G.headers["content-type"] = "application/json"
          }
        }
        if (G.headers["content-type"] && !G.body) G.body = "{}";
        if (G.body) try {
          G.headers["content-length"] = String((0, Wp4.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async handleError(A, Q, B, G, Z) {
        let I = OL1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = jHA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = jHA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = jHA.NormalizedSchema.of(X),
          F = G.message ?? G.Message ?? "Unknown",
          K = new X.ctor(F);
        await this.deserializeHttpMessage(X, Q, B, G);
        let D = {};
        for (let [H, C] of V.structIterator()) {
          let E = C.getMergedTraits().jsonName ?? H;
          D[H] = this.codec.createDeserializer().readObject(C, G[E])
        }
        throw Object.assign(K, {
          $metadata: Z,
          $response: B,
          $fault: V.getMergedTraits().error,
          message: F,
          ...D
        }), K
      }
    },
    Vp4 = r6(),
    Fp4 = I3((A) => {
      if (A == null) return;
      if (typeof A === "object" && "__type" in A) delete A.__type;
      return (0, Vp4.expectUnion)(A)
    }, "awsExpectUnion"),
    qL1 = w5(),
    jd = b4(),
    Kp4 = oK(),
    Dp4 = w5(),
    uVQ = b4(),
    Hp4 = r6(),
    Cp4 = O2(),
    Ep4 = wS(),
    PL1 = class extends er {
      constructor(A) {
        super();
        this.settings = A, this.stringDeserializer = new Dp4.FromStringShapeDeserializer(A)
      }
      static {
        I3(this, "XmlShapeDeserializer")
      }
      stringDeserializer;
      setSerdeContext(A) {
        this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
      }
      read(A, Q, B) {
        let G = uVQ.NormalizedSchema.of(A),
          Z = G.getMemberSchemas();
        if (G.isStructSchema() && G.isMemberSchema() && !!Object.values(Z).find((W) => {
            return !!W.getMemberTraits().eventPayload
          })) {
          let W = {},
            X = Object.keys(Z)[0];
          if (Z[X].isBlobSchema()) W[X] = Q;
          else W[X] = this.read(Z[X], Q);
          return W
        }
        let Y = (this.serdeContext?.utf8Encoder ?? Cp4.toUtf8)(Q),
          J = this.parseXml(Y);
        return this.readSchema(A, B ? J[B] : J)
      }
      readSchema(A, Q) {
        let B = uVQ.NormalizedSchema.of(A),
          G = B.getMergedTraits(),
          Z = B.getSchema();
        if (B.isListSchema() && !Array.isArray(Q)) return this.readSchema(Z, [Q]);
        if (Q == null) return Q;
        if (typeof Q === "object") {
          let I = !!G.sparse,
            Y = !!G.xmlFlattened;
          if (B.isListSchema()) {
            let W = B.getValueSchema(),
              X = [],
              V = W.getMergedTraits().xmlName ?? "member",
              F = Y ? Q : (Q[0] ?? Q)[V],
              K = Array.isArray(F) ? F : [F];
            for (let D of K)
              if (D != null || I) X.push(this.readSchema(W, D));
            return X
          }
          let J = {};
          if (B.isMapSchema()) {
            let W = B.getKeySchema(),
              X = B.getValueSchema(),
              V;
            if (Y) V = Array.isArray(Q) ? Q : [Q];
            else V = Array.isArray(Q.entry) ? Q.entry : [Q.entry];
            let F = W.getMergedTraits().xmlName ?? "key",
              K = X.getMergedTraits().xmlName ?? "value";
            for (let D of V) {
              let H = D[F],
                C = D[K];
              if (C != null || I) J[H] = this.readSchema(X, C)
            }
            return J
          }
          if (B.isStructSchema()) {
            for (let [W, X] of B.structIterator()) {
              let V = X.getMergedTraits(),
                F = !V.httpPayload ? X.getMemberTraits().xmlName ?? W : V.xmlName ?? X.getName();
              if (Q[F] != null) J[W] = this.readSchema(X, Q[F])
            }
            return J
          }
          if (B.isDocumentSchema()) return Q;
          throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${B.getName(!0)}`)
        } else {
          if (B.isListSchema()) return [];
          else if (B.isMapSchema() || B.isStructSchema()) return {};
          return this.stringDeserializer.read(B, Q)
        }
      }
      parseXml(A) {
        if (A.length) {
          let Q = new Ep4.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: I3((Y, J) => J.trim() === "" && J.includes(`
`) ? "" : void 0, "tagValueProcessor")
          });
          Q.addEntity("#xD", "\r"), Q.addEntity("#10", `
`);
          let B;
          try {
            B = Q.parse(A, !0)
          } catch (Y) {
            if (Y && typeof Y === "object") Object.defineProperty(Y, "$responseBodyText", {
              value: A
            });
            throw Y
          }
          let G = "#text",
            Z = Object.keys(B)[0],
            I = B[Z];
          if (I[G]) I[Z] = I[G], delete I[G];
          return (0, Hp4.getValueFromTextNode)(I)
        }
        return {}
      }
    },
    NL1 = w5(),
    AuA = b4(),
    zp4 = s6(),
    Up4 = r6(),
    $p4 = Pd(),
    wp4 = class extends er {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        I3(this, "QueryShapeSerializer")
      }
      buffer;
      write(A, Q, B = "") {
        if (this.buffer === void 0) this.buffer = "";
        let G = AuA.NormalizedSchema.of(A);
        if (B && !B.endsWith(".")) B += ".";
        if (G.isBlobSchema()) {
          if (typeof Q === "string" || Q instanceof Uint8Array) this.writeKey(B), this.writeValue((this.serdeContext?.base64Encoder ?? $p4.toBase64)(Q))
        } else if (G.isBooleanSchema() || G.isNumericSchema() || G.isStringSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigIntegerSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigDecimalSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(Q instanceof zp4.NumericValue ? Q.string : String(Q))
        } else if (G.isTimestampSchema()) {
          if (Q instanceof Date) switch (this.writeKey(B), (0, NL1.determineTimestampFormat)(G, this.settings)) {
            case AuA.SCHEMA.TIMESTAMP_DATE_TIME:
              this.writeValue(Q.toISOString().replace(".000Z", "Z"));
              break;
            case AuA.SCHEMA.TIMESTAMP_HTTP_DATE:
              this.writeValue((0, Up4.dateToUtcString)(Q));
              break;
            case AuA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              this.writeValue(String(Q.getTime() / 1000));
              break
          }
        } else if (G.isDocumentSchema()) throw Error(`@aws-sdk/core/protocols - QuerySerializer unsupported document type ${G.getName(!0)}`);
        else if (G.isListSchema()) {
          if (Array.isArray(Q))
            if (Q.length === 0) {
              if (this.settings.serializeEmptyLists) this.writeKey(B), this.writeValue("")
            } else {
              let Z = G.getValueSchema(),
                I = this.settings.flattenLists || G.getMergedTraits().xmlFlattened,
                Y = 1;
              for (let J of Q) {
                if (J == null) continue;
                let W = this.getKey("member", Z.getMergedTraits().xmlName),
                  X = I ? `${B}${Y}` : `${B}${W}.${Y}`;
                this.write(Z, J, X), ++Y
              }
            }
        } else if (G.isMapSchema()) {
          if (Q && typeof Q === "object") {
            let Z = G.getKeySchema(),
              I = G.getValueSchema(),
              Y = G.getMergedTraits().xmlFlattened,
              J = 1;
            for (let [W, X] of Object.entries(Q)) {
              if (X == null) continue;
              let V = this.getKey("key", Z.getMergedTraits().xmlName),
                F = Y ? `${B}${J}.${V}` : `${B}entry.${J}.${V}`,
                K = this.getKey("value", I.getMergedTraits().xmlName),
                D = Y ? `${B}${J}.${K}` : `${B}entry.${J}.${K}`;
              this.write(Z, W, F), this.write(I, X, D), ++J
            }
          }
        } else if (G.isStructSchema()) {
          if (Q && typeof Q === "object")
            for (let [Z, I] of G.structIterator()) {
              if (Q[Z] == null) continue;
              let Y = this.getKey(Z, I.getMergedTraits().xmlName),
                J = `${B}${Y}`;
              this.write(I, Q[Z], J)
            }
        } else if (G.isUnitSchema());
        else throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${G.getName(!0)}`)
      }
      flush() {
        if (this.buffer === void 0) throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
        let A = this.buffer;
        return delete this.buffer, A
      }
      getKey(A, Q) {
        let B = Q ?? A;
        if (this.settings.capitalizeKeys) return B[0].toUpperCase() + B.slice(1);
        return B
      }
      writeKey(A) {
        if (A.endsWith(".")) A = A.slice(0, A.length - 1);
        this.buffer += `&${(0,NL1.extendedEncodeURIComponent)(A)}=`
      }
      writeValue(A) {
        this.buffer += (0, NL1.extendedEncodeURIComponent)(A)
      }
    },
    aVQ = class extends qL1.RpcProtocol {
      constructor(A) {
        super({
          defaultNamespace: A.defaultNamespace
        });
        this.options = A;
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: jd.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !1,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace,
          serializeEmptyLists: !0
        };
        this.serializer = new wp4(Q), this.deserializer = new PL1(Q)
      }
      static {
        I3(this, "AwsQueryProtocol")
      }
      serializer;
      deserializer;
      getShapeId() {
        return "aws.protocols#awsQuery"
      }
      setSerdeContext(A) {
        this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A)
      }
      getPayloadCodec() {
        throw Error("AWSQuery protocol has no payload codec.")
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B);
        if (!G.path.endsWith("/")) G.path += "/";
        if (Object.assign(G.headers, {
            "content-type": "application/x-www-form-urlencoded"
          }), (0, jd.deref)(A.input) === "unit" || !G.body) G.body = "";
        if (G.body = `Action=${A.name.split("#")[1]}&Version=${this.options.version}` + G.body, G.body.endsWith("&")) G.body = G.body.slice(-1);
        try {
          G.headers["content-length"] = String((0, Kp4.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        let G = this.deserializer,
          Z = jd.NormalizedSchema.of(A.output),
          I = {};
        if (B.statusCode >= 300) {
          let X = await (0, qL1.collectBody)(B.body, Q);
          if (X.byteLength > 0) Object.assign(I, await G.read(jd.SCHEMA.DOCUMENT, X));
          await this.handleError(A, Q, B, I, this.deserializeMetadata(B))
        }
        for (let X in B.headers) {
          let V = B.headers[X];
          delete B.headers[X], B.headers[X.toLowerCase()] = V
        }
        let Y = Z.isStructSchema() && this.useNestedResult() ? A.name.split("#")[1] + "Result" : void 0,
          J = await (0, qL1.collectBody)(B.body, Q);
        if (J.byteLength > 0) Object.assign(I, await G.read(Z, J, Y));
        return {
          $metadata: this.deserializeMetadata(B),
          ...I
        }
      }
      useNestedResult() {
        return !0
      }
      async handleError(A, Q, B, G, Z) {
        let I = this.loadQueryErrorCode(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = this.loadQueryError(G),
          X = jd.TypeRegistry.for(Y),
          V;
        try {
          if (V = X.find((C) => jd.NormalizedSchema.of(C).getMergedTraits().awsQueryError?.[0] === J), !V) V = X.getSchema(I)
        } catch (C) {
          let E = jd.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (E) {
            let U = E.ctor;
            throw Object.assign(new U(J), W)
          }
          throw Error(J)
        }
        let F = jd.NormalizedSchema.of(V),
          K = this.loadQueryErrorMessage(G),
          D = new V.ctor(K),
          H = {};
        for (let [C, E] of F.structIterator()) {
          let U = E.getMergedTraits().xmlName ?? C,
            q = W[U] ?? G[U];
          H[C] = this.deserializer.readSchema(E, q)
        }
        throw Object.assign(D, {
          $metadata: Z,
          $response: B,
          $fault: F.getMergedTraits().error,
          message: K,
          ...H
        }), D
      }
      loadQueryErrorCode(A, Q) {
        let B = (Q.Errors?.[0]?.Error ?? Q.Errors?.Error ?? Q.Error)?.Code;
        if (B !== void 0) return B;
        if (A.statusCode == 404) return "NotFound"
      }
      loadQueryError(A) {
        return A.Errors?.[0]?.Error ?? A.Errors?.Error ?? A.Error
      }
      loadQueryErrorMessage(A) {
        let Q = this.loadQueryError(A);
        return Q?.message ?? Q?.Message ?? A.message ?? A.Message ?? "Unknown"
      }
    },
    qp4 = class extends aVQ {
      constructor(A) {
        super(A);
        this.options = A;
        let Q = {
          capitalizeKeys: !0,
          flattenLists: !0,
          serializeEmptyLists: !1
        };
        Object.assign(this.serializer.settings, Q)
      }
      static {
        I3(this, "AwsEc2QueryProtocol")
      }
      useNestedResult() {
        return !1
      }
    },
    LL1 = w5(),
    SHA = b4(),
    Np4 = oK(),
    Lp4 = r6(),
    Mp4 = wS(),
    sVQ = I3((A, Q) => lVQ(A, Q).then((B) => {
      if (B.length) {
        let G = new Mp4.XMLParser({
          attributeNamePrefix: "",
          htmlEntities: !0,
          ignoreAttributes: !1,
          ignoreDeclaration: !0,
          parseTagValue: !1,
          trimValues: !1,
          tagValueProcessor: I3((W, X) => X.trim() === "" && X.includes(`
`) ? "" : void 0, "tagValueProcessor")
        });
        G.addEntity("#xD", "\r"), G.addEntity("#10", `
`);
        let Z;
        try {
          Z = G.parse(B, !0)
        } catch (W) {
          if (W && typeof W === "object") Object.defineProperty(W, "$responseBodyText", {
            value: B
          });
          throw W
        }
        let I = "#text",
          Y = Object.keys(Z)[0],
          J = Z[Y];
        if (J[I]) J[Y] = J[I], delete J[I];
        return (0, Lp4.getValueFromTextNode)(J)
      }
      return {}
    }), "parseXmlBody"),
    Op4 = I3(async (A, Q) => {
      let B = await sVQ(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, "parseXmlErrorBody"),
    rVQ = I3((A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadRestXmlErrorCode"),
    SS = rDA(),
    tr = b4(),
    Rp4 = s6(),
    mVQ = r6(),
    dVQ = Pd(),
    oVQ = class extends er {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        I3(this, "XmlShapeSerializer")
      }
      stringBuffer;
      byteBuffer;
      buffer;
      write(A, Q) {
        let B = tr.NormalizedSchema.of(A);
        if (B.isStringSchema() && typeof Q === "string") this.stringBuffer = Q;
        else if (B.isBlobSchema()) this.byteBuffer = "byteLength" in Q ? Q : (this.serdeContext?.base64Decoder ?? dVQ.fromBase64)(Q);
        else {
          this.buffer = this.writeStruct(B, Q, void 0);
          let G = B.getMergedTraits();
          if (G.httpPayload && !G.xmlName) this.buffer.withName(B.getName())
        }
      }
      flush() {
        if (this.byteBuffer !== void 0) {
          let Q = this.byteBuffer;
          return delete this.byteBuffer, Q
        }
        if (this.stringBuffer !== void 0) {
          let Q = this.stringBuffer;
          return delete this.stringBuffer, Q
        }
        let A = this.buffer;
        if (this.settings.xmlNamespace) {
          if (!A?.attributes?.xmlns) A.addAttribute("xmlns", this.settings.xmlNamespace)
        }
        return delete this.buffer, A.toString()
      }
      writeStruct(A, Q, B) {
        let G = A.getMergedTraits(),
          Z = A.isMemberSchema() && !G.httpPayload ? A.getMemberTraits().xmlName ?? A.getMemberName() : G.xmlName ?? A.getName();
        if (!Z || !A.isStructSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${A.getName(!0)}.`);
        let I = SS.XmlNode.of(Z),
          [Y, J] = this.getXmlnsAttribute(A, B);
        if (J) I.addAttribute(Y, J);
        for (let [W, X] of A.structIterator()) {
          let V = Q[W];
          if (V != null) {
            if (X.getMergedTraits().xmlAttribute) {
              I.addAttribute(X.getMergedTraits().xmlName ?? W, this.writeSimple(X, V));
              continue
            }
            if (X.isListSchema()) this.writeList(X, V, I, J);
            else if (X.isMapSchema()) this.writeMap(X, V, I, J);
            else if (X.isStructSchema()) I.addChildNode(this.writeStruct(X, V, J));
            else {
              let F = SS.XmlNode.of(X.getMergedTraits().xmlName ?? X.getMemberName());
              this.writeSimpleInto(X, V, F, J), I.addChildNode(F)
            }
          }
        }
        return I
      }
      writeList(A, Q, B, G) {
        if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${A.getName(!0)}`);
        let Z = A.getMergedTraits(),
          I = A.getValueSchema(),
          Y = I.getMergedTraits(),
          J = !!Y.sparse,
          W = !!Z.xmlFlattened,
          [X, V] = this.getXmlnsAttribute(A, G),
          F = I3((K, D) => {
            if (I.isListSchema()) this.writeList(I, Array.isArray(D) ? D : [D], K, V);
            else if (I.isMapSchema()) this.writeMap(I, D, K, V);
            else if (I.isStructSchema()) {
              let H = this.writeStruct(I, D, V);
              K.addChildNode(H.withName(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member"))
            } else {
              let H = SS.XmlNode.of(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member");
              this.writeSimpleInto(I, D, H, V), K.addChildNode(H)
            }
          }, "writeItem");
        if (W) {
          for (let K of Q)
            if (J || K != null) F(B, K)
        } else {
          let K = SS.XmlNode.of(Z.xmlName ?? A.getMemberName());
          if (V) K.addAttribute(X, V);
          for (let D of Q)
            if (J || D != null) F(K, D);
          B.addChildNode(K)
        }
      }
      writeMap(A, Q, B, G, Z = !1) {
        if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${A.getName(!0)}`);
        let I = A.getMergedTraits(),
          Y = A.getKeySchema(),
          W = Y.getMergedTraits().xmlName ?? "key",
          X = A.getValueSchema(),
          V = X.getMergedTraits(),
          F = V.xmlName ?? "value",
          K = !!V.sparse,
          D = !!I.xmlFlattened,
          [H, C] = this.getXmlnsAttribute(A, G),
          E = I3((U, q, w) => {
            let N = SS.XmlNode.of(W, q),
              [R, T] = this.getXmlnsAttribute(Y, C);
            if (T) N.addAttribute(R, T);
            U.addChildNode(N);
            let y = SS.XmlNode.of(F);
            if (X.isListSchema()) this.writeList(X, w, y, C);
            else if (X.isMapSchema()) this.writeMap(X, w, y, C, !0);
            else if (X.isStructSchema()) y = this.writeStruct(X, w, C);
            else this.writeSimpleInto(X, w, y, C);
            U.addChildNode(y)
          }, "addKeyValue");
        if (D) {
          for (let [U, q] of Object.entries(Q))
            if (K || q != null) {
              let w = SS.XmlNode.of(I.xmlName ?? A.getMemberName());
              E(w, U, q), B.addChildNode(w)
            }
        } else {
          let U;
          if (!Z) {
            if (U = SS.XmlNode.of(I.xmlName ?? A.getMemberName()), C) U.addAttribute(H, C);
            B.addChildNode(U)
          }
          for (let [q, w] of Object.entries(Q))
            if (K || w != null) {
              let N = SS.XmlNode.of("entry");
              E(N, q, w), (Z ? B : U).addChildNode(N)
            }
        }
      }
      writeSimple(A, Q) {
        if (Q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
        let B = tr.NormalizedSchema.of(A),
          G = null;
        if (Q && typeof Q === "object")
          if (B.isBlobSchema()) G = (this.serdeContext?.base64Encoder ?? dVQ.toBase64)(Q);
          else if (B.isTimestampSchema() && Q instanceof Date) {
          let Z = this.settings.timestampFormat;
          switch (Z.useTrait ? B.getSchema() === tr.SCHEMA.TIMESTAMP_DEFAULT ? Z.default : B.getSchema() ?? Z.default : Z.default) {
            case tr.SCHEMA.TIMESTAMP_DATE_TIME:
              G = Q.toISOString().replace(".000Z", "Z");
              break;
            case tr.SCHEMA.TIMESTAMP_HTTP_DATE:
              G = (0, mVQ.dateToUtcString)(Q);
              break;
            case tr.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              G = String(Q.getTime() / 1000);
              break;
            default:
              console.warn("Missing timestamp format, using http date", Q), G = (0, mVQ.dateToUtcString)(Q);
              break
          }
        } else if (B.isBigDecimalSchema() && Q) {
          if (Q instanceof Rp4.NumericValue) return Q.string;
          return String(Q)
        } else if (B.isMapSchema() || B.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
        else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${B.getName(!0)}`);
        if (B.isStringSchema() || B.isBooleanSchema() || B.isNumericSchema() || B.isBigIntegerSchema() || B.isBigDecimalSchema()) G = String(Q);
        if (G === null) throw Error(`Unhandled schema-value pair ${B.getName(!0)}=${Q}`);
        return G
      }
      writeSimpleInto(A, Q, B, G) {
        let Z = this.writeSimple(A, Q),
          I = tr.NormalizedSchema.of(A),
          Y = new SS.XmlText(Z),
          [J, W] = this.getXmlnsAttribute(I, G);
        if (W) B.addAttribute(J, W);
        B.addChildNode(Y)
      }
      getXmlnsAttribute(A, Q) {
        let B = A.getMergedTraits(),
          [G, Z] = B.xmlNamespace ?? [];
        if (Z && Z !== Q) return [G ? `xmlns:${G}` : "xmlns", Z];
        return [void 0, void 0]
      }
    },
    tVQ = class extends er {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        I3(this, "XmlCodec")
      }
      createSerializer() {
        let A = new oVQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new PL1(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    Tp4 = class extends LL1.HttpBindingProtocol {
      static {
        I3(this, "AwsRestXmlProtocol")
      }
      codec;
      serializer;
      deserializer;
      constructor(A) {
        super(A);
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: SHA.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !0,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace
        };
        this.codec = new tVQ(Q), this.serializer = new LL1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new LL1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
      }
      getPayloadCodec() {
        return this.codec
      }
      getShapeId() {
        return "aws.protocols#restXml"
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B),
          Z = SHA.NormalizedSchema.of(A.input),
          I = Z.getMemberSchemas();
        if (G.path = String(G.path).split("/").filter((Y) => {
            return Y !== "{Bucket}"
          }).join("/") || "/", !G.headers["content-type"]) {
          let Y = Object.values(I).find((J) => {
            return !!J.getMergedTraits().httpPayload
          });
          if (Y) {
            let J = Y.getMergedTraits().mediaType;
            if (J) G.headers["content-type"] = J;
            else if (Y.isStringSchema()) G.headers["content-type"] = "text/plain";
            else if (Y.isBlobSchema()) G.headers["content-type"] = "application/octet-stream";
            else G.headers["content-type"] = "application/xml"
          } else if (!Z.isUnitSchema()) {
            if (Object.values(I).find((W) => {
                let {
                  httpQuery: X,
                  httpQueryParams: V,
                  httpHeader: F,
                  httpLabel: K,
                  httpPrefixHeaders: D
                } = W.getMergedTraits();
                return !X && !V && !F && !K && D === void 0
              })) G.headers["content-type"] = "application/xml"
          }
        }
        if (G.headers["content-type"] === "application/xml") {
          if (typeof G.body === "string") G.body = '<?xml version="1.0" encoding="UTF-8"?>' + G.body
        }
        if (G.body) try {
          G.headers["content-length"] = String((0, Np4.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        return super.deserializeResponse(A, Q, B)
      }
      async handleError(A, Q, B, G, Z) {
        let I = rVQ(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = SHA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = SHA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = SHA.NormalizedSchema.of(X),
          F = G.Error?.message ?? G.Error?.Message ?? G.message ?? G.Message ?? "Unknown",
          K = new X.ctor(F);
        await this.deserializeHttpMessage(X, Q, B, G);
        let D = {};
        for (let [H, C] of V.structIterator()) {
          let E = C.getMergedTraits().xmlName ?? H,
            U = G.Error?.[E] ?? G[E];
          D[H] = this.codec.createDeserializer().readSchema(C, U)
        }
        throw Object.assign(K, {
          $metadata: Z,
          $response: B,
          $fault: V.getMergedTraits().error,
          message: F,
          ...D
        }), K
      }
    }
})
// @from(Start 3084501, End 3084698)
TF = z((_HA) => {
  Object.defineProperty(_HA, "__esModule", {
    value: !0
  });
  var jL1 = rr();
  jL1.__exportStar(lR(), _HA);
  jL1.__exportStar(VL1(), _HA);
  jL1.__exportStar(AFQ(), _HA)
})
// @from(Start 3084704, End 3090358)
b8A = z((Iw7, KFQ) => {
  var {
    defineProperty: GuA,
    getOwnPropertyDescriptor: Pp4,
    getOwnPropertyNames: jp4
  } = Object, Sp4 = Object.prototype.hasOwnProperty, pv = (A, Q) => GuA(A, "name", {
    value: Q,
    configurable: !0
  }), _p4 = (A, Q) => {
    for (var B in Q) GuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, kp4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jp4(Q))
        if (!Sp4.call(A, Z) && Z !== B) GuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Pp4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yp4 = (A) => kp4(GuA({}, "__esModule", {
    value: !0
  }), A), ZFQ = {};
  _p4(ZFQ, {
    DEFAULT_UA_APP_ID: () => IFQ,
    getUserAgentMiddlewareOptions: () => FFQ,
    getUserAgentPlugin: () => mp4,
    resolveUserAgentConfig: () => JFQ,
    userAgentMiddleware: () => VFQ
  });
  KFQ.exports = yp4(ZFQ);
  var xp4 = iB(),
    IFQ = void 0;

  function YFQ(A) {
    if (A === void 0) return !0;
    return typeof A === "string" && A.length <= 50
  }
  pv(YFQ, "isValidUserAgentAppId");

  function JFQ(A) {
    let Q = (0, xp4.normalizeProvider)(A.userAgentAppId ?? IFQ),
      {
        customUserAgent: B
      } = A;
    return Object.assign(A, {
      customUserAgent: typeof B === "string" ? [
        [B]
      ] : B,
      userAgentAppId: pv(async () => {
        let G = await Q();
        if (!YFQ(G)) {
          let Z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
          if (typeof G !== "string") Z?.warn("userAgentAppId must be a string or undefined.");
          else if (G.length > 50) Z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
        }
        return G
      }, "userAgentAppId")
    })
  }
  pv(JFQ, "resolveUserAgentConfig");
  var vp4 = S8A(),
    bp4 = iz(),
    _S = TF(),
    fp4 = /\d{12}\.ddb/;
  async function WFQ(A, Q, B) {
    if (B.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor")(0, _S.setFeature)(A, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof Q.retryStrategy === "function") {
      let I = await Q.retryStrategy();
      if (typeof I.acquireInitialRetryToken === "function")
        if (I.constructor?.name?.includes("Adaptive"))(0, _S.setFeature)(A, "RETRY_MODE_ADAPTIVE", "F");
        else(0, _S.setFeature)(A, "RETRY_MODE_STANDARD", "E");
      else(0, _S.setFeature)(A, "RETRY_MODE_LEGACY", "D")
    }
    if (typeof Q.accountIdEndpointMode === "function") {
      let I = A.endpointV2;
      if (String(I?.url?.hostname).match(fp4))(0, _S.setFeature)(A, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await Q.accountIdEndpointMode?.()) {
        case "disabled":
          (0, _S.setFeature)(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          (0, _S.setFeature)(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          (0, _S.setFeature)(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break
      }
    }
    let Z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (Z?.$source) {
      let I = Z;
      if (I.accountId)(0, _S.setFeature)(A, "RESOLVED_ACCOUNT_ID", "T");
      for (let [Y, J] of Object.entries(I.$source ?? {}))(0, _S.setFeature)(A, Y, J)
    }
  }
  pv(WFQ, "checkFeatures");
  var QFQ = "user-agent",
    SL1 = "x-amz-user-agent",
    BFQ = " ",
    _L1 = "/",
    hp4 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g,
    gp4 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g,
    GFQ = "-",
    up4 = 1024;

  function XFQ(A) {
    let Q = "";
    for (let B in A) {
      let G = A[B];
      if (Q.length + G.length + 1 <= up4) {
        if (Q.length) Q += "," + G;
        else Q += G;
        continue
      }
      break
    }
    return Q
  }
  pv(XFQ, "encodeFeatures");
  var VFQ = pv((A) => (Q, B) => async (G) => {
      let {
        request: Z
      } = G;
      if (!bp4.HttpRequest.isInstance(Z)) return Q(G);
      let {
        headers: I
      } = Z, Y = B?.userAgent?.map(BuA) || [], J = (await A.defaultUserAgentProvider()).map(BuA);
      await WFQ(B, A, G);
      let W = B;
      J.push(`m/${XFQ(Object.assign({},B.__smithy_context?.features,W.__aws_sdk_context?.features))}`);
      let X = A?.customUserAgent?.map(BuA) || [],
        V = await A.userAgentAppId();
      if (V) J.push(BuA([`app/${V}`]));
      let F = (0, vp4.getUserAgentPrefix)(),
        K = (F ? [F] : []).concat([...J, ...Y, ...X]).join(BFQ),
        D = [...J.filter((H) => H.startsWith("aws-sdk-")), ...X].join(BFQ);
      if (A.runtime !== "browser") {
        if (D) I[SL1] = I[SL1] ? `${I[QFQ]} ${D}` : D;
        I[QFQ] = K
      } else I[SL1] = K;
      return Q({
        ...G,
        request: Z
      })
    }, "userAgentMiddleware"),
    BuA = pv((A) => {
      let Q = A[0].split(_L1).map((Y) => Y.replace(hp4, GFQ)).join(_L1),
        B = A[1]?.replace(gp4, GFQ),
        G = Q.indexOf(_L1),
        Z = Q.substring(0, G),
        I = Q.substring(G + 1);
      if (Z === "api") I = I.toLowerCase();
      return [Z, I, B].filter((Y) => Y && Y.length > 0).reduce((Y, J, W) => {
        switch (W) {
          case 0:
            return J;
          case 1:
            return `${Y}/${J}`;
          default:
            return `${Y}#${J}`
        }
      }, "")
    }, "escapeUserAgent"),
    FFQ = {
      name: "getUserAgentMiddleware",
      step: "build",
      priority: "low",
      tags: ["SET_USER_AGENT", "USER_AGENT"],
      override: !0
    },
    mp4 = pv((A) => ({
      applyToStack: pv((Q) => {
        Q.add(VFQ(A), FFQ)
      }, "applyToStack")
    }), "getUserAgentPlugin")
})
// @from(Start 3090364, End 3092110)
yL1 = z((DFQ) => {
  Object.defineProperty(DFQ, "__esModule", {
    value: !0
  });
  DFQ.resolveHttpAuthSchemeConfig = DFQ.defaultCognitoIdentityHttpAuthSchemeProvider = DFQ.defaultCognitoIdentityHttpAuthSchemeParametersProvider = void 0;
  var dp4 = TF(),
    kL1 = w7(),
    cp4 = async (A, Q, B) => {
      return {
        operation: (0, kL1.getSmithyContext)(Q).operation,
        region: await (0, kL1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  DFQ.defaultCognitoIdentityHttpAuthSchemeParametersProvider = cp4;

  function pp4(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "cognito-identity",
        region: A.region
      },
      propertiesExtractor: (Q, B) => ({
        signingProperties: {
          config: Q,
          context: B
        }
      })
    }
  }

  function ZuA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var lp4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetCredentialsForIdentity": {
        Q.push(ZuA(A));
        break
      }
      case "GetId": {
        Q.push(ZuA(A));
        break
      }
      case "GetOpenIdToken": {
        Q.push(ZuA(A));
        break
      }
      case "UnlinkIdentity": {
        Q.push(ZuA(A));
        break
      }
      default:
        Q.push(pp4(A))
    }
    return Q
  };
  DFQ.defaultCognitoIdentityHttpAuthSchemeProvider = lp4;
  var ip4 = (A) => {
    let Q = (0, dp4.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, kL1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  DFQ.resolveHttpAuthSchemeConfig = ip4
})