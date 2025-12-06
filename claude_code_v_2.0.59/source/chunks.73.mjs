
// @from(Start 6831542, End 6847068)
EjB = z((vQG, CjB) => {
  var {
    defineProperty: KoA,
    getOwnPropertyDescriptor: IL6,
    getOwnPropertyNames: YL6
  } = Object, JL6 = Object.prototype.hasOwnProperty, mX = (A, Q) => KoA(A, "name", {
    value: Q,
    configurable: !0
  }), WL6 = (A, Q) => {
    for (var B in Q) KoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, XL6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of YL6(Q))
        if (!JL6.call(A, Z) && Z !== B) KoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = IL6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, VL6 = (A) => XL6(KoA({}, "__esModule", {
    value: !0
  }), A), QjB = {};
  WL6(QjB, {
    SignatureV4: () => fL6,
    clearCredentialCache: () => TL6,
    createScope: () => VoA,
    getCanonicalHeaders: () => xd1,
    getCanonicalQuery: () => XjB,
    getPayloadHash: () => FoA,
    getSigningKey: () => WjB,
    moveHeadersToQuery: () => DjB,
    prepareRequest: () => bd1
  });
  CjB.exports = VL6(QjB);
  var oPB = jPB(),
    _d1 = r$A(),
    FL6 = "X-Amz-Algorithm",
    KL6 = "X-Amz-Credential",
    BjB = "X-Amz-Date",
    DL6 = "X-Amz-SignedHeaders",
    HL6 = "X-Amz-Expires",
    GjB = "X-Amz-Signature",
    ZjB = "X-Amz-Security-Token",
    IjB = "authorization",
    YjB = BjB.toLowerCase(),
    CL6 = "date",
    EL6 = [IjB, YjB, CL6],
    zL6 = GjB.toLowerCase(),
    yd1 = "x-amz-content-sha256",
    UL6 = ZjB.toLowerCase(),
    $L6 = {
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
    wL6 = /^proxy-/,
    qL6 = /^sec-/,
    kd1 = "AWS4-HMAC-SHA256",
    NL6 = "AWS4-HMAC-SHA256-PAYLOAD",
    LL6 = "UNSIGNED-PAYLOAD",
    ML6 = 50,
    JjB = "aws4_request",
    OL6 = 604800,
    Sp = iPB(),
    RL6 = r$A(),
    CGA = {},
    XoA = [],
    VoA = mX((A, Q, B) => `${A}/${Q}/${B}/${JjB}`, "createScope"),
    WjB = mX(async (A, Q, B, G, Z) => {
      let I = await tPB(A, Q.secretAccessKey, Q.accessKeyId),
        Y = `${B}:${G}:${Z}:${(0,Sp.toHex)(I)}:${Q.sessionToken}`;
      if (Y in CGA) return CGA[Y];
      XoA.push(Y);
      while (XoA.length > ML6) delete CGA[XoA.shift()];
      let J = `AWS4${Q.secretAccessKey}`;
      for (let W of [B, G, Z, JjB]) J = await tPB(A, J, W);
      return CGA[Y] = J
    }, "getSigningKey"),
    TL6 = mX(() => {
      XoA.length = 0, Object.keys(CGA).forEach((A) => {
        delete CGA[A]
      })
    }, "clearCredentialCache"),
    tPB = mX((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, RL6.toUint8Array)(B)), G.digest()
    }, "hmac"),
    xd1 = mX(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let I = Z.toLowerCase();
        if (I in $L6 || (Q == null ? void 0 : Q.has(I)) || wL6.test(I) || qL6.test(I)) {
          if (!B || B && !B.has(I)) continue
        }
        G[I] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    o$A = rPB(),
    XjB = mX(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A).sort()) {
        if (G.toLowerCase() === zL6) continue;
        Q.push(G);
        let Z = A[G];
        if (typeof Z === "string") B[G] = `${(0,o$A.escapeUri)(G)}=${(0,o$A.escapeUri)(Z)}`;
        else if (Array.isArray(Z)) B[G] = Z.slice(0).reduce((I, Y) => I.concat([`${(0,o$A.escapeUri)(G)}=${(0,o$A.escapeUri)(Y)}`]), []).sort().join("&")
      }
      return Q.map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    PL6 = Rd1(),
    jL6 = r$A(),
    FoA = mX(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === yd1) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, PL6.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, jL6.toUint8Array)(Q)), (0, Sp.toHex)(await G.digest())
      }
      return LL6
    }, "getPayloadHash"),
    ePB = r$A(),
    VjB = class {
      format(Q) {
        let B = [];
        for (let I of Object.keys(Q)) {
          let Y = (0, ePB.fromUtf8)(I);
          B.push(Uint8Array.from([Y.byteLength]), Y, this.formatHeaderValue(Q[I]))
        }
        let G = new Uint8Array(B.reduce((I, Y) => I + Y.byteLength, 0)),
          Z = 0;
        for (let I of B) G.set(I, Z), Z += I.byteLength;
        return G
      }
      formatHeaderValue(Q) {
        switch (Q.type) {
          case "boolean":
            return Uint8Array.from([Q.value ? 0 : 1]);
          case "byte":
            return Uint8Array.from([2, Q.value]);
          case "short":
            let B = new DataView(new ArrayBuffer(3));
            return B.setUint8(0, 3), B.setInt16(1, Q.value, !1), new Uint8Array(B.buffer);
          case "integer":
            let G = new DataView(new ArrayBuffer(5));
            return G.setUint8(0, 4), G.setInt32(1, Q.value, !1), new Uint8Array(G.buffer);
          case "long":
            let Z = new Uint8Array(9);
            return Z[0] = 5, Z.set(Q.value.bytes, 1), Z;
          case "binary":
            let I = new DataView(new ArrayBuffer(3 + Q.value.byteLength));
            I.setUint8(0, 6), I.setUint16(1, Q.value.byteLength, !1);
            let Y = new Uint8Array(I.buffer);
            return Y.set(Q.value, 3), Y;
          case "string":
            let J = (0, ePB.fromUtf8)(Q.value),
              W = new DataView(new ArrayBuffer(3 + J.byteLength));
            W.setUint8(0, 7), W.setUint16(1, J.byteLength, !1);
            let X = new Uint8Array(W.buffer);
            return X.set(J, 3), X;
          case "timestamp":
            let V = new Uint8Array(9);
            return V[0] = 8, V.set(kL6.fromNumber(Q.value.valueOf()).bytes, 1), V;
          case "uuid":
            if (!_L6.test(Q.value)) throw Error(`Invalid UUID received: ${Q.value}`);
            let F = new Uint8Array(17);
            return F[0] = 9, F.set((0, Sp.fromHex)(Q.value.replace(/\-/g, "")), 1), F
        }
      }
    };
  mX(VjB, "HeaderFormatter");
  var SL6 = VjB,
    _L6 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    FjB = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) vd1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) vd1(Q);
        return parseInt((0, Sp.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };
  mX(FjB, "Int64");
  var kL6 = FjB;

  function vd1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  mX(vd1, "negate");
  var yL6 = mX((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    KjB = mX(({
      headers: A,
      query: Q,
      ...B
    }) => ({
      ...B,
      headers: {
        ...A
      },
      query: Q ? xL6(Q) : void 0
    }), "cloneRequest"),
    xL6 = mX((A) => Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {}), "cloneQuery"),
    DjB = mX((A, Q = {}) => {
      var B;
      let {
        headers: G,
        query: Z = {}
      } = typeof A.clone === "function" ? A.clone() : KjB(A);
      for (let I of Object.keys(G)) {
        let Y = I.toLowerCase();
        if (Y.slice(0, 6) === "x-amz-" && !((B = Q.unhoistableHeaders) == null ? void 0 : B.has(Y))) Z[I] = G[I], delete G[I]
      }
      return {
        ...A,
        headers: G,
        query: Z
      }
    }, "moveHeadersToQuery"),
    bd1 = mX((A) => {
      A = typeof A.clone === "function" ? A.clone() : KjB(A);
      for (let Q of Object.keys(A.headers))
        if (EL6.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    vL6 = mX((A) => bL6(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    bL6 = mX((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    HjB = class {
      constructor({
        applyChecksum: Q,
        credentials: B,
        region: G,
        service: Z,
        sha256: I,
        uriEscapePath: Y = !0
      }) {
        this.headerFormatter = new SL6, this.service = Z, this.sha256 = I, this.uriEscapePath = Y, this.applyChecksum = typeof Q === "boolean" ? Q : !0, this.regionProvider = (0, oPB.normalizeProvider)(G), this.credentialProvider = (0, oPB.normalizeProvider)(B)
      }
      async presign(Q, B = {}) {
        let {
          signingDate: G = new Date,
          expiresIn: Z = 3600,
          unsignableHeaders: I,
          unhoistableHeaders: Y,
          signableHeaders: J,
          signingRegion: W,
          signingService: X
        } = B, V = await this.credentialProvider();
        this.validateResolvedCredentials(V);
        let F = W ?? await this.regionProvider(),
          {
            longDate: K,
            shortDate: D
          } = WoA(G);
        if (Z > OL6) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = VoA(D, F, X ?? this.service),
          C = DjB(bd1(Q), {
            unhoistableHeaders: Y
          });
        if (V.sessionToken) C.query[ZjB] = V.sessionToken;
        C.query[FL6] = kd1, C.query[KL6] = `${V.accessKeyId}/${H}`, C.query[BjB] = K, C.query[HL6] = Z.toString(10);
        let E = xd1(C, I, J);
        return C.query[DL6] = AjB(E), C.query[GjB] = await this.getSignature(K, H, this.getSigningKey(V, F, D, X), this.createCanonicalRequest(C, E, await FoA(Q, this.sha256))), C
      }
      async sign(Q, B) {
        if (typeof Q === "string") return this.signString(Q, B);
        else if (Q.headers && Q.payload) return this.signEvent(Q, B);
        else if (Q.message) return this.signMessage(Q, B);
        else return this.signRequest(Q, B)
      }
      async signEvent({
        headers: Q,
        payload: B
      }, {
        signingDate: G = new Date,
        priorSignature: Z,
        signingRegion: I,
        signingService: Y
      }) {
        let J = I ?? await this.regionProvider(),
          {
            shortDate: W,
            longDate: X
          } = WoA(G),
          V = VoA(W, J, Y ?? this.service),
          F = await FoA({
            headers: {},
            body: B
          }, this.sha256),
          K = new this.sha256;
        K.update(Q);
        let D = (0, Sp.toHex)(await K.digest()),
          H = [NL6, X, V, Z, D, F].join(`
`);
        return this.signString(H, {
          signingDate: G,
          signingRegion: J,
          signingService: Y
        })
      }
      async signMessage(Q, {
        signingDate: B = new Date,
        signingRegion: G,
        signingService: Z
      }) {
        return this.signEvent({
          headers: this.headerFormatter.format(Q.message.headers),
          payload: Q.message.body
        }, {
          signingDate: B,
          signingRegion: G,
          signingService: Z,
          priorSignature: Q.priorSignature
        }).then((Y) => {
          return {
            message: Q.message,
            signature: Y
          }
        })
      }
      async signString(Q, {
        signingDate: B = new Date,
        signingRegion: G,
        signingService: Z
      } = {}) {
        let I = await this.credentialProvider();
        this.validateResolvedCredentials(I);
        let Y = G ?? await this.regionProvider(),
          {
            shortDate: J
          } = WoA(B),
          W = new this.sha256(await this.getSigningKey(I, Y, J, Z));
        return W.update((0, _d1.toUint8Array)(Q)), (0, Sp.toHex)(await W.digest())
      }
      async signRequest(Q, {
        signingDate: B = new Date,
        signableHeaders: G,
        unsignableHeaders: Z,
        signingRegion: I,
        signingService: Y
      } = {}) {
        let J = await this.credentialProvider();
        this.validateResolvedCredentials(J);
        let W = I ?? await this.regionProvider(),
          X = bd1(Q),
          {
            longDate: V,
            shortDate: F
          } = WoA(B),
          K = VoA(F, W, Y ?? this.service);
        if (X.headers[YjB] = V, J.sessionToken) X.headers[UL6] = J.sessionToken;
        let D = await FoA(X, this.sha256);
        if (!yL6(yd1, X.headers) && this.applyChecksum) X.headers[yd1] = D;
        let H = xd1(X, Z, G),
          C = await this.getSignature(V, K, this.getSigningKey(J, W, F, Y), this.createCanonicalRequest(X, H, D));
        return X.headers[IjB] = `${kd1} Credential=${J.accessKeyId}/${K}, SignedHeaders=${AjB(H)}, Signature=${C}`, X
      }
      createCanonicalRequest(Q, B, G) {
        let Z = Object.keys(B).sort();
        return `${Q.method}
${this.getCanonicalPath(Q)}
${XjB(Q)}
${Z.map((I)=>`${I}:${B[I]}`).join(`
`)}

${Z.join(";")}
${G}`
      }
      async createStringToSign(Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, _d1.toUint8Array)(G));
        let I = await Z.digest();
        return `${kd1}
${Q}
${B}
${(0,Sp.toHex)(I)}`
      }
      getCanonicalPath({
        path: Q
      }) {
        if (this.uriEscapePath) {
          let B = [];
          for (let I of Q.split("/")) {
            if ((I == null ? void 0 : I.length) === 0) continue;
            if (I === ".") continue;
            if (I === "..") B.pop();
            else B.push(I)
          }
          let G = `${(Q==null?void 0:Q.startsWith("/"))?"/":""}${B.join("/")}${B.length>0&&(Q==null?void 0:Q.endsWith("/"))?"/":""}`;
          return (0, o$A.escapeUri)(G).replace(/%2F/g, "/")
        }
        return Q
      }
      async getSignature(Q, B, G, Z) {
        let I = await this.createStringToSign(Q, B, Z),
          Y = new this.sha256(await G);
        return Y.update((0, _d1.toUint8Array)(I)), (0, Sp.toHex)(await Y.digest())
      }
      getSigningKey(Q, B, G, Z) {
        return WjB(this.sha256, Q, G, B, Z || this.service)
      }
      validateResolvedCredentials(Q) {
        if (typeof Q !== "object" || typeof Q.accessKeyId !== "string" || typeof Q.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
    };
  mX(HjB, "SignatureV4");
  var fL6 = HjB,
    WoA = mX((A) => {
      let Q = vL6(A).replace(/[\-:]/g, "");
      return {
        longDate: Q,
        shortDate: Q.slice(0, 8)
      }
    }, "formatDate"),
    AjB = mX((A) => Object.keys(A).sort().join(";"), "getCanonicalHeaderList")
})
// @from(Start 6847100, End 6847103)
zjB
// @from(Start 6847105, End 6847108)
UjB
// @from(Start 6847110, End 6847113)
$jB
// @from(Start 6847115, End 6847118)
wjB
// @from(Start 6847120, End 6847716)
gL6 = () => Promise.resolve().then(() => BA(KT1(), 1)).then(({
    fromNodeProviderChain: A
  }) => A({
    clientConfig: {
      requestHandler: new UjB.FetchHttpHandler({
        requestInit: (Q) => {
          return {
            ...Q
          }
        }
      })
    }
  })).catch((A) => {
    throw Error(`Failed to import '@aws-sdk/credential-providers'.You can provide a custom \`providerChainResolver\` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': \`new AnthropicBedrock({ providerChainResolver })\` Original error: ${A.message}`)
  })
// @from(Start 6847720, End 6848764)
qjB = async (A, Q) => {
    hL6(A.method, "Expected request method property to be set");
    let B = await (Q.providerChainResolver ? Q.providerChainResolver() : gL6()),
      G = await uL6(() => {
        if (Q.awsAccessKey) process.env.AWS_ACCESS_KEY_ID = Q.awsAccessKey;
        if (Q.awsSecretKey) process.env.AWS_SECRET_ACCESS_KEY = Q.awsSecretKey;
        if (Q.awsSessionToken) process.env.AWS_SESSION_TOKEN = Q.awsSessionToken
      }, () => B()),
      Z = new wjB.SignatureV4({
        service: "bedrock",
        region: Q.regionName,
        credentials: G,
        sha256: zjB.Sha256
      }),
      I = new URL(Q.url),
      Y = !A.headers ? {} : (Symbol.iterator in A.headers) ? Object.fromEntries(Array.from(A.headers).map((X) => [...X])) : {
        ...A.headers
      };
    delete Y.connection, Y.host = I.hostname;
    let J = new $jB.HttpRequest({
      method: A.method.toUpperCase(),
      protocol: I.protocol,
      path: I.pathname,
      headers: Y,
      body: A.body
    });
    return (await Z.sign(J)).headers
  }
// @from(Start 6848766, End 6848917)
uL6 = async (A, Q) => {
    let B = {
      ...process.env
    };
    try {
      return A(), await Q()
    } finally {
      process.env = B
    }
  }
// @from(Start 6848923, End 6849022)
NjB = L(() => {
  zjB = BA(FTB(), 1), UjB = BA(Ld1(), 1), $jB = BA(Od1(), 1), wjB = BA(EjB(), 1)
})
// @from(Start 6849028, End 6860374)
hd1 = z((hQG, HoA) => {
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
  var LjB, MjB, OjB, RjB, TjB, PjB, jjB, SjB, _jB, DoA, fd1, kjB, yjB, EGA, xjB, vjB, bjB, fjB, hjB, gjB, ujB, mjB, djB;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof HoA === "object" && typeof hQG === "object") A(B(Q, B(hQG)));
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
    LjB = function(B, G) {
      Q(B, G);

      function Z() {
        this.constructor = B
      }
      B.prototype = G === null ? Object.create(G) : (Z.prototype = G.prototype, new Z)
    }, MjB = Object.assign || function(B) {
      for (var G, Z = 1, I = arguments.length; Z < I; Z++) {
        G = arguments[Z];
        for (var Y in G)
          if (Object.prototype.hasOwnProperty.call(G, Y)) B[Y] = G[Y]
      }
      return B
    }, OjB = function(B, G) {
      var Z = {};
      for (var I in B)
        if (Object.prototype.hasOwnProperty.call(B, I) && G.indexOf(I) < 0) Z[I] = B[I];
      if (B != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var Y = 0, I = Object.getOwnPropertySymbols(B); Y < I.length; Y++)
          if (G.indexOf(I[Y]) < 0 && Object.prototype.propertyIsEnumerable.call(B, I[Y])) Z[I[Y]] = B[I[Y]]
      }
      return Z
    }, RjB = function(B, G, Z, I) {
      var Y = arguments.length,
        J = Y < 3 ? G : I === null ? I = Object.getOwnPropertyDescriptor(G, Z) : I,
        W;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") J = Reflect.decorate(B, G, Z, I);
      else
        for (var X = B.length - 1; X >= 0; X--)
          if (W = B[X]) J = (Y < 3 ? W(J) : Y > 3 ? W(G, Z, J) : W(G, Z)) || J;
      return Y > 3 && J && Object.defineProperty(G, Z, J), J
    }, TjB = function(B, G) {
      return function(Z, I) {
        G(Z, I, B)
      }
    }, PjB = function(B, G) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(B, G)
    }, jjB = function(B, G, Z, I) {
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
    }, SjB = function(B, G) {
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
    }, djB = function(B, G, Z, I) {
      if (I === void 0) I = Z;
      B[I] = G[Z]
    }, _jB = function(B, G) {
      for (var Z in B)
        if (Z !== "default" && !G.hasOwnProperty(Z)) G[Z] = B[Z]
    }, DoA = function(B) {
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
    }, fd1 = function(B, G) {
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
    }, kjB = function() {
      for (var B = [], G = 0; G < arguments.length; G++) B = B.concat(fd1(arguments[G]));
      return B
    }, yjB = function() {
      for (var B = 0, G = 0, Z = arguments.length; G < Z; G++) B += arguments[G].length;
      for (var I = Array(B), Y = 0, G = 0; G < Z; G++)
        for (var J = arguments[G], W = 0, X = J.length; W < X; W++, Y++) I[Y] = J[W];
      return I
    }, EGA = function(B) {
      return this instanceof EGA ? (this.v = B, this) : new EGA(B)
    }, xjB = function(B, G, Z) {
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
        H.value instanceof EGA ? Promise.resolve(H.value.v).then(F, K) : D(J[0][2], H)
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
    }, vjB = function(B) {
      var G, Z;
      return G = {}, I("next"), I("throw", function(Y) {
        throw Y
      }), I("return"), G[Symbol.iterator] = function() {
        return this
      }, G;

      function I(Y, J) {
        G[Y] = B[Y] ? function(W) {
          return (Z = !Z) ? {
            value: EGA(B[Y](W)),
            done: Y === "return"
          } : J ? J(W) : W
        } : J
      }
    }, bjB = function(B) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var G = B[Symbol.asyncIterator],
        Z;
      return G ? G.call(B) : (B = typeof DoA === "function" ? DoA(B) : B[Symbol.iterator](), Z = {}, I("next"), I("throw"), I("return"), Z[Symbol.asyncIterator] = function() {
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
    }, fjB = function(B, G) {
      if (Object.defineProperty) Object.defineProperty(B, "raw", {
        value: G
      });
      else B.raw = G;
      return B
    }, hjB = function(B) {
      if (B && B.__esModule) return B;
      var G = {};
      if (B != null) {
        for (var Z in B)
          if (Object.hasOwnProperty.call(B, Z)) G[Z] = B[Z]
      }
      return G.default = B, G
    }, gjB = function(B) {
      return B && B.__esModule ? B : {
        default: B
      }
    }, ujB = function(B, G) {
      if (!G.has(B)) throw TypeError("attempted to get private field on non-instance");
      return G.get(B)
    }, mjB = function(B, G, Z) {
      if (!G.has(B)) throw TypeError("attempted to set private field on non-instance");
      return G.set(B, Z), Z
    }, A("__extends", LjB), A("__assign", MjB), A("__rest", OjB), A("__decorate", RjB), A("__param", TjB), A("__metadata", PjB), A("__awaiter", jjB), A("__generator", SjB), A("__exportStar", _jB), A("__createBinding", djB), A("__values", DoA), A("__read", fd1), A("__spread", kjB), A("__spreadArrays", yjB), A("__await", EGA), A("__asyncGenerator", xjB), A("__asyncDelegator", vjB), A("__asyncValues", bjB), A("__makeTemplateObject", fjB), A("__importStar", hjB), A("__importDefault", gjB), A("__classPrivateFieldGet", ujB), A("__classPrivateFieldSet", mjB)
  })
})
// @from(Start 6860380, End 6860930)
ljB = z((cjB) => {
  Object.defineProperty(cjB, "__esModule", {
    value: !0
  });
  cjB.convertToBuffer = void 0;
  var mL6 = Cd1(),
    dL6 = typeof Buffer < "u" && Buffer.from ? function(A) {
      return Buffer.from(A, "utf8")
    } : mL6.fromUtf8;

  function cL6(A) {
    if (A instanceof Uint8Array) return A;
    if (typeof A === "string") return dL6(A);
    if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(A)
  }
  cjB.convertToBuffer = cL6
})
// @from(Start 6860936, End 6861183)
ajB = z((ijB) => {
  Object.defineProperty(ijB, "__esModule", {
    value: !0
  });
  ijB.isEmptyData = void 0;

  function pL6(A) {
    if (typeof A === "string") return A.length === 0;
    return A.byteLength === 0
  }
  ijB.isEmptyData = pL6
})
// @from(Start 6861189, End 6861451)
ojB = z((sjB) => {
  Object.defineProperty(sjB, "__esModule", {
    value: !0
  });
  sjB.numToUint8 = void 0;

  function lL6(A) {
    return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
  }
  sjB.numToUint8 = lL6
})
// @from(Start 6861457, End 6861813)
ASB = z((tjB) => {
  Object.defineProperty(tjB, "__esModule", {
    value: !0
  });
  tjB.uint32ArrayFrom = void 0;

  function iL6(A) {
    if (!Uint32Array.from) {
      var Q = new Uint32Array(A.length),
        B = 0;
      while (B < A.length) Q[B] = A[B], B += 1;
      return Q
    }
    return Uint32Array.from(A)
  }
  tjB.uint32ArrayFrom = iL6
})
// @from(Start 6861819, End 6862599)
gd1 = z((zGA) => {
  Object.defineProperty(zGA, "__esModule", {
    value: !0
  });
  zGA.uint32ArrayFrom = zGA.numToUint8 = zGA.isEmptyData = zGA.convertToBuffer = void 0;
  var nL6 = ljB();
  Object.defineProperty(zGA, "convertToBuffer", {
    enumerable: !0,
    get: function() {
      return nL6.convertToBuffer
    }
  });
  var aL6 = ajB();
  Object.defineProperty(zGA, "isEmptyData", {
    enumerable: !0,
    get: function() {
      return aL6.isEmptyData
    }
  });
  var sL6 = ojB();
  Object.defineProperty(zGA, "numToUint8", {
    enumerable: !0,
    get: function() {
      return sL6.numToUint8
    }
  });
  var rL6 = ASB();
  Object.defineProperty(zGA, "uint32ArrayFrom", {
    enumerable: !0,
    get: function() {
      return rL6.uint32ArrayFrom
    }
  })
})
// @from(Start 6862605, End 6863371)
ISB = z((GSB) => {
  Object.defineProperty(GSB, "__esModule", {
    value: !0
  });
  GSB.AwsCrc32 = void 0;
  var QSB = hd1(),
    ud1 = gd1(),
    BSB = CoA(),
    tL6 = function() {
      function A() {
        this.crc32 = new BSB.Crc32
      }
      return A.prototype.update = function(Q) {
        if ((0, ud1.isEmptyData)(Q)) return;
        this.crc32.update((0, ud1.convertToBuffer)(Q))
      }, A.prototype.digest = function() {
        return QSB.__awaiter(this, void 0, void 0, function() {
          return QSB.__generator(this, function(Q) {
            return [2, (0, ud1.numToUint8)(this.crc32.digest())]
          })
        })
      }, A.prototype.reset = function() {
        this.crc32 = new BSB.Crc32
      }, A
    }();
  GSB.AwsCrc32 = tL6
})
// @from(Start 6863377, End 6867537)
CoA = z((md1) => {
  Object.defineProperty(md1, "__esModule", {
    value: !0
  });
  md1.AwsCrc32 = md1.Crc32 = md1.crc32 = void 0;
  var eL6 = hd1(),
    AM6 = gd1();

  function QM6(A) {
    return new YSB().update(A).digest()
  }
  md1.crc32 = QM6;
  var YSB = function() {
    function A() {
      this.checksum = 4294967295
    }
    return A.prototype.update = function(Q) {
      var B, G;
      try {
        for (var Z = eL6.__values(Q), I = Z.next(); !I.done; I = Z.next()) {
          var Y = I.value;
          this.checksum = this.checksum >>> 8 ^ GM6[(this.checksum ^ Y) & 255]
        }
      } catch (J) {
        B = {
          error: J
        }
      } finally {
        try {
          if (I && !I.done && (G = Z.return)) G.call(Z)
        } finally {
          if (B) throw B.error
        }
      }
      return this
    }, A.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0
    }, A
  }();
  md1.Crc32 = YSB;
  var BM6 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
    GM6 = (0, AM6.uint32ArrayFrom)(BM6),
    ZM6 = ISB();
  Object.defineProperty(md1, "AwsCrc32", {
    enumerable: !0,
    get: function() {
      return ZM6.AwsCrc32
    }
  })
})
// @from(Start 6867543, End 6869069)
DSB = z((sQG, KSB) => {
  var {
    defineProperty: EoA,
    getOwnPropertyDescriptor: WM6,
    getOwnPropertyNames: XM6
  } = Object, VM6 = Object.prototype.hasOwnProperty, JSB = (A, Q) => EoA(A, "name", {
    value: Q,
    configurable: !0
  }), FM6 = (A, Q) => {
    for (var B in Q) EoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, KM6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of XM6(Q))
        if (!VM6.call(A, Z) && Z !== B) EoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = WM6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, DM6 = (A) => KM6(EoA({}, "__esModule", {
    value: !0
  }), A), WSB = {};
  FM6(WSB, {
    fromHex: () => VSB,
    toHex: () => FSB
  });
  KSB.exports = DM6(WSB);
  var XSB = {},
    dd1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    XSB[A] = Q, dd1[Q] = A
  }

  function VSB(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in dd1) Q[B / 2] = dd1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }
  JSB(VSB, "fromHex");

  function FSB(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += XSB[A[B]];
    return Q
  }
  JSB(FSB, "toHex")
})
// @from(Start 6869075, End 6879748)
TSB = z((rQG, RSB) => {
  var {
    defineProperty: UoA,
    getOwnPropertyDescriptor: HM6,
    getOwnPropertyNames: CM6
  } = Object, EM6 = Object.prototype.hasOwnProperty, Cf = (A, Q) => UoA(A, "name", {
    value: Q,
    configurable: !0
  }), zM6 = (A, Q) => {
    for (var B in Q) UoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, UM6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of CM6(Q))
        if (!EM6.call(A, Z) && Z !== B) UoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = HM6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $M6 = (A) => UM6(UoA({}, "__esModule", {
    value: !0
  }), A), CSB = {};
  zM6(CSB, {
    EventStreamCodec: () => kM6,
    HeaderMarshaller: () => USB,
    Int64: () => zoA,
    MessageDecoderStream: () => yM6,
    MessageEncoderStream: () => xM6,
    SmithyMessageDecoderStream: () => vM6,
    SmithyMessageEncoderStream: () => bM6
  });
  RSB.exports = $M6(CSB);
  var wM6 = CoA(),
    We = DSB(),
    ESB = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) cd1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) cd1(Q);
        return parseInt((0, We.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };
  Cf(ESB, "Int64");
  var zoA = ESB;

  function cd1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  Cf(cd1, "negate");
  var zSB = class {
    constructor(Q, B) {
      this.toUtf8 = Q, this.fromUtf8 = B
    }
    format(Q) {
      let B = [];
      for (let I of Object.keys(Q)) {
        let Y = this.fromUtf8(I);
        B.push(Uint8Array.from([Y.byteLength]), Y, this.formatHeaderValue(Q[I]))
      }
      let G = new Uint8Array(B.reduce((I, Y) => I + Y.byteLength, 0)),
        Z = 0;
      for (let I of B) G.set(I, Z), Z += I.byteLength;
      return G
    }
    formatHeaderValue(Q) {
      switch (Q.type) {
        case "boolean":
          return Uint8Array.from([Q.value ? 0 : 1]);
        case "byte":
          return Uint8Array.from([2, Q.value]);
        case "short":
          let B = new DataView(new ArrayBuffer(3));
          return B.setUint8(0, 3), B.setInt16(1, Q.value, !1), new Uint8Array(B.buffer);
        case "integer":
          let G = new DataView(new ArrayBuffer(5));
          return G.setUint8(0, 4), G.setInt32(1, Q.value, !1), new Uint8Array(G.buffer);
        case "long":
          let Z = new Uint8Array(9);
          return Z[0] = 5, Z.set(Q.value.bytes, 1), Z;
        case "binary":
          let I = new DataView(new ArrayBuffer(3 + Q.value.byteLength));
          I.setUint8(0, 6), I.setUint16(1, Q.value.byteLength, !1);
          let Y = new Uint8Array(I.buffer);
          return Y.set(Q.value, 3), Y;
        case "string":
          let J = this.fromUtf8(Q.value),
            W = new DataView(new ArrayBuffer(3 + J.byteLength));
          W.setUint8(0, 7), W.setUint16(1, J.byteLength, !1);
          let X = new Uint8Array(W.buffer);
          return X.set(J, 3), X;
        case "timestamp":
          let V = new Uint8Array(9);
          return V[0] = 8, V.set(zoA.fromNumber(Q.value.valueOf()).bytes, 1), V;
        case "uuid":
          if (!jM6.test(Q.value)) throw Error(`Invalid UUID received: ${Q.value}`);
          let F = new Uint8Array(17);
          return F[0] = 9, F.set((0, We.fromHex)(Q.value.replace(/\-/g, "")), 1), F
      }
    }
    parse(Q) {
      let B = {},
        G = 0;
      while (G < Q.byteLength) {
        let Z = Q.getUint8(G++),
          I = this.toUtf8(new Uint8Array(Q.buffer, Q.byteOffset + G, Z));
        switch (G += Z, Q.getUint8(G++)) {
          case 0:
            B[I] = {
              type: HSB,
              value: !0
            };
            break;
          case 1:
            B[I] = {
              type: HSB,
              value: !1
            };
            break;
          case 2:
            B[I] = {
              type: qM6,
              value: Q.getInt8(G++)
            };
            break;
          case 3:
            B[I] = {
              type: NM6,
              value: Q.getInt16(G, !1)
            }, G += 2;
            break;
          case 4:
            B[I] = {
              type: LM6,
              value: Q.getInt32(G, !1)
            }, G += 4;
            break;
          case 5:
            B[I] = {
              type: MM6,
              value: new zoA(new Uint8Array(Q.buffer, Q.byteOffset + G, 8))
            }, G += 8;
            break;
          case 6:
            let Y = Q.getUint16(G, !1);
            G += 2, B[I] = {
              type: OM6,
              value: new Uint8Array(Q.buffer, Q.byteOffset + G, Y)
            }, G += Y;
            break;
          case 7:
            let J = Q.getUint16(G, !1);
            G += 2, B[I] = {
              type: RM6,
              value: this.toUtf8(new Uint8Array(Q.buffer, Q.byteOffset + G, J))
            }, G += J;
            break;
          case 8:
            B[I] = {
              type: TM6,
              value: new Date(new zoA(new Uint8Array(Q.buffer, Q.byteOffset + G, 8)).valueOf())
            }, G += 8;
            break;
          case 9:
            let W = new Uint8Array(Q.buffer, Q.byteOffset + G, 16);
            G += 16, B[I] = {
              type: PM6,
              value: `${(0,We.toHex)(W.subarray(0,4))}-${(0,We.toHex)(W.subarray(4,6))}-${(0,We.toHex)(W.subarray(6,8))}-${(0,We.toHex)(W.subarray(8,10))}-${(0,We.toHex)(W.subarray(10))}`
            };
            break;
          default:
            throw Error("Unrecognized header type tag")
        }
      }
      return B
    }
  };
  Cf(zSB, "HeaderMarshaller");
  var USB = zSB,
    HSB = "boolean",
    qM6 = "byte",
    NM6 = "short",
    LM6 = "integer",
    MM6 = "long",
    OM6 = "binary",
    RM6 = "string",
    TM6 = "timestamp",
    PM6 = "uuid",
    jM6 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    SM6 = CoA(),
    $SB = 4,
    _p = $SB * 2,
    Xe = 4,
    _M6 = _p + Xe * 2;

  function wSB({
    byteLength: A,
    byteOffset: Q,
    buffer: B
  }) {
    if (A < _M6) throw Error("Provided message too short to accommodate event stream message overhead");
    let G = new DataView(B, Q, A),
      Z = G.getUint32(0, !1);
    if (A !== Z) throw Error("Reported message length does not match received message length");
    let I = G.getUint32($SB, !1),
      Y = G.getUint32(_p, !1),
      J = G.getUint32(A - Xe, !1),
      W = new SM6.Crc32().update(new Uint8Array(B, Q, _p));
    if (Y !== W.digest()) throw Error(`The prelude checksum specified in the message (${Y}) does not match the calculated CRC32 checksum (${W.digest()})`);
    if (W.update(new Uint8Array(B, Q + _p, A - (_p + Xe))), J !== W.digest()) throw Error(`The message checksum (${W.digest()}) did not match the expected value of ${J}`);
    return {
      headers: new DataView(B, Q + _p + Xe, I),
      body: new Uint8Array(B, Q + _p + Xe + I, Z - I - (_p + Xe + Xe))
    }
  }
  Cf(wSB, "splitMessage");
  var qSB = class {
    constructor(Q, B) {
      this.headerMarshaller = new USB(Q, B), this.messageBuffer = [], this.isEndOfStream = !1
    }
    feed(Q) {
      this.messageBuffer.push(this.decode(Q))
    }
    endOfStream() {
      this.isEndOfStream = !0
    }
    getMessage() {
      let Q = this.messageBuffer.pop(),
        B = this.isEndOfStream;
      return {
        getMessage() {
          return Q
        },
        isEndOfStream() {
          return B
        }
      }
    }
    getAvailableMessages() {
      let Q = this.messageBuffer;
      this.messageBuffer = [];
      let B = this.isEndOfStream;
      return {
        getMessages() {
          return Q
        },
        isEndOfStream() {
          return B
        }
      }
    }
    encode({
      headers: Q,
      body: B
    }) {
      let G = this.headerMarshaller.format(Q),
        Z = G.byteLength + B.byteLength + 16,
        I = new Uint8Array(Z),
        Y = new DataView(I.buffer, I.byteOffset, I.byteLength),
        J = new wM6.Crc32;
      return Y.setUint32(0, Z, !1), Y.setUint32(4, G.byteLength, !1), Y.setUint32(8, J.update(I.subarray(0, 8)).digest(), !1), I.set(G, 12), I.set(B, G.byteLength + 12), Y.setUint32(Z - 4, J.update(I.subarray(8, Z - 4)).digest(), !1), I
    }
    decode(Q) {
      let {
        headers: B,
        body: G
      } = wSB(Q);
      return {
        headers: this.headerMarshaller.parse(B),
        body: G
      }
    }
    formatHeaders(Q) {
      return this.headerMarshaller.format(Q)
    }
  };
  Cf(qSB, "EventStreamCodec");
  var kM6 = qSB,
    NSB = class {
      constructor(Q) {
        this.options = Q
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let Q of this.options.inputStream) yield this.options.decoder.decode(Q)
      }
    };
  Cf(NSB, "MessageDecoderStream");
  var yM6 = NSB,
    LSB = class {
      constructor(Q) {
        this.options = Q
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let Q of this.options.messageStream) yield this.options.encoder.encode(Q);
        if (this.options.includeEndFrame) yield new Uint8Array(0)
      }
    };
  Cf(LSB, "MessageEncoderStream");
  var xM6 = LSB,
    MSB = class {
      constructor(Q) {
        this.options = Q
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let Q of this.options.messageStream) {
          let B = await this.options.deserializer(Q);
          if (B === void 0) continue;
          yield B
        }
      }
    };
  Cf(MSB, "SmithyMessageDecoderStream");
  var vM6 = MSB,
    OSB = class {
      constructor(Q) {
        this.options = Q
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let Q of this.options.inputStream) yield this.options.serializer(Q)
      }
    };
  Cf(OSB, "SmithyMessageEncoderStream");
  var bM6 = OSB
})
// @from(Start 6879754, End 6883725)
xSB = z((oQG, ySB) => {
  var {
    defineProperty: $oA,
    getOwnPropertyDescriptor: fM6,
    getOwnPropertyNames: hM6
  } = Object, gM6 = Object.prototype.hasOwnProperty, UGA = (A, Q) => $oA(A, "name", {
    value: Q,
    configurable: !0
  }), uM6 = (A, Q) => {
    for (var B in Q) $oA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, mM6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of hM6(Q))
        if (!gM6.call(A, Z) && Z !== B) $oA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = fM6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, dM6 = (A) => mM6($oA({}, "__esModule", {
    value: !0
  }), A), PSB = {};
  uM6(PSB, {
    EventStreamMarshaller: () => kSB,
    eventStreamSerdeProvider: () => cM6
  });
  ySB.exports = dM6(PSB);
  var t$A = TSB();

  function jSB(A) {
    let Q = 0,
      B = 0,
      G = null,
      Z = null,
      I = UGA((J) => {
        if (typeof J !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + J);
        Q = J, B = 4, G = new Uint8Array(J), new DataView(G.buffer).setUint32(0, J, !1)
      }, "allocateMessage"),
      Y = UGA(async function*() {
        let J = A[Symbol.asyncIterator]();
        while (!0) {
          let {
            value: W,
            done: X
          } = await J.next();
          if (X) {
            if (!Q) return;
            else if (Q === B) yield G;
            else throw Error("Truncated event message received.");
            return
          }
          let V = W.length,
            F = 0;
          while (F < V) {
            if (!G) {
              let D = V - F;
              if (!Z) Z = new Uint8Array(4);
              let H = Math.min(4 - B, D);
              if (Z.set(W.slice(F, F + H), B), B += H, F += H, B < 4) break;
              I(new DataView(Z.buffer).getUint32(0, !1)), Z = null
            }
            let K = Math.min(Q - B, V - F);
            if (G.set(W.slice(F, F + K), B), B += K, F += K, Q && Q === B) yield G, G = null, Q = 0, B = 0
          }
        }
      }, "iterator");
    return {
      [Symbol.asyncIterator]: Y
    }
  }
  UGA(jSB, "getChunkedStream");

  function SSB(A, Q) {
    return async function(B) {
      let {
        value: G
      } = B.headers[":message-type"];
      if (G === "error") {
        let Z = Error(B.headers[":error-message"].value || "UnknownError");
        throw Z.name = B.headers[":error-code"].value, Z
      } else if (G === "exception") {
        let Z = B.headers[":exception-type"].value,
          I = {
            [Z]: B
          },
          Y = await A(I);
        if (Y.$unknown) {
          let J = Error(Q(B.body));
          throw J.name = Z, J
        }
        throw Y[Z]
      } else if (G === "event") {
        let Z = {
            [B.headers[":event-type"].value]: B
          },
          I = await A(Z);
        if (I.$unknown) return;
        return I
      } else throw Error(`Unrecognizable event type: ${B.headers[":event-type"].value}`)
    }
  }
  UGA(SSB, "getMessageUnmarshaller");
  var _SB = class {
    constructor({
      utf8Encoder: Q,
      utf8Decoder: B
    }) {
      this.eventStreamCodec = new t$A.EventStreamCodec(Q, B), this.utfEncoder = Q
    }
    deserialize(Q, B) {
      let G = jSB(Q);
      return new t$A.SmithyMessageDecoderStream({
        messageStream: new t$A.MessageDecoderStream({
          inputStream: G,
          decoder: this.eventStreamCodec
        }),
        deserializer: SSB(B, this.utfEncoder)
      })
    }
    serialize(Q, B) {
      return new t$A.MessageEncoderStream({
        messageStream: new t$A.SmithyMessageEncoderStream({
          inputStream: Q,
          serializer: B
        }),
        encoder: this.eventStreamCodec,
        includeEndFrame: !0
      })
    }
  };
  UGA(_SB, "EventStreamMarshaller");
  var kSB = _SB,
    cM6 = UGA((A) => new kSB(A), "eventStreamSerdeProvider")
})
// @from(Start 6883731, End 6885631)
uSB = z((tQG, gSB) => {
  var {
    defineProperty: woA,
    getOwnPropertyDescriptor: pM6,
    getOwnPropertyNames: lM6
  } = Object, iM6 = Object.prototype.hasOwnProperty, pd1 = (A, Q) => woA(A, "name", {
    value: Q,
    configurable: !0
  }), nM6 = (A, Q) => {
    for (var B in Q) woA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, aM6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of lM6(Q))
        if (!iM6.call(A, Z) && Z !== B) woA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = pM6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, sM6 = (A) => aM6(woA({}, "__esModule", {
    value: !0
  }), A), vSB = {};
  nM6(vSB, {
    EventStreamMarshaller: () => hSB,
    eventStreamSerdeProvider: () => tM6
  });
  gSB.exports = sM6(vSB);
  var rM6 = xSB(),
    oM6 = UA("stream");
  async function* bSB(A) {
    let Q = !1,
      B = !1,
      G = [];
    A.on("error", (Z) => {
      if (!Q) Q = !0;
      if (Z) throw Z
    }), A.on("data", (Z) => {
      G.push(Z)
    }), A.on("end", () => {
      Q = !0
    });
    while (!B) {
      let Z = await new Promise((I) => setTimeout(() => I(G.shift()), 0));
      if (Z) yield Z;
      B = Q && G.length === 0
    }
  }
  pd1(bSB, "readabletoIterable");
  var fSB = class {
    constructor({
      utf8Encoder: Q,
      utf8Decoder: B
    }) {
      this.universalMarshaller = new rM6.EventStreamMarshaller({
        utf8Decoder: B,
        utf8Encoder: Q
      })
    }
    deserialize(Q, B) {
      let G = typeof Q[Symbol.asyncIterator] === "function" ? Q : bSB(Q);
      return this.universalMarshaller.deserialize(G, B)
    }
    serialize(Q, B) {
      return oM6.Readable.from(this.universalMarshaller.serialize(Q, B))
    }
  };
  pd1(fSB, "EventStreamMarshaller");
  var hSB = fSB,
    tM6 = pd1((A) => new hSB(A), "eventStreamSerdeProvider")
})
// @from(Start 6885637, End 6886590)
cSB = z((eQG, dSB) => {
  var {
    defineProperty: qoA,
    getOwnPropertyDescriptor: eM6,
    getOwnPropertyNames: AO6
  } = Object, QO6 = Object.prototype.hasOwnProperty, BO6 = (A, Q) => qoA(A, "name", {
    value: Q,
    configurable: !0
  }), GO6 = (A, Q) => {
    for (var B in Q) qoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ZO6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of AO6(Q))
        if (!QO6.call(A, Z) && Z !== B) qoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = eM6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, IO6 = (A) => ZO6(qoA({}, "__esModule", {
    value: !0
  }), A), mSB = {};
  GO6(mSB, {
    isArrayBuffer: () => YO6
  });
  dSB.exports = IO6(mSB);
  var YO6 = BO6((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 6886596, End 6887942)
LoA = z((ABG, iSB) => {
  var {
    defineProperty: NoA,
    getOwnPropertyDescriptor: JO6,
    getOwnPropertyNames: WO6
  } = Object, XO6 = Object.prototype.hasOwnProperty, pSB = (A, Q) => NoA(A, "name", {
    value: Q,
    configurable: !0
  }), VO6 = (A, Q) => {
    for (var B in Q) NoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, FO6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of WO6(Q))
        if (!XO6.call(A, Z) && Z !== B) NoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = JO6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, KO6 = (A) => FO6(NoA({}, "__esModule", {
    value: !0
  }), A), lSB = {};
  VO6(lSB, {
    fromArrayBuffer: () => HO6,
    fromString: () => CO6
  });
  iSB.exports = KO6(lSB);
  var DO6 = cSB(),
    ld1 = UA("buffer"),
    HO6 = pSB((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, DO6.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return ld1.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    CO6 = pSB((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? ld1.Buffer.from(A, Q) : ld1.Buffer.from(A)
    }, "fromString")
})
// @from(Start 6887948, End 6888436)
sSB = z((nSB) => {
  Object.defineProperty(nSB, "__esModule", {
    value: !0
  });
  nSB.fromBase64 = void 0;
  var EO6 = LoA(),
    zO6 = /^[A-Za-z0-9+/]*={0,2}$/,
    UO6 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!zO6.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, EO6.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  nSB.fromBase64 = UO6
})
// @from(Start 6888442, End 6890105)
A_B = z((BBG, eSB) => {
  var {
    defineProperty: MoA,
    getOwnPropertyDescriptor: $O6,
    getOwnPropertyNames: wO6
  } = Object, qO6 = Object.prototype.hasOwnProperty, id1 = (A, Q) => MoA(A, "name", {
    value: Q,
    configurable: !0
  }), NO6 = (A, Q) => {
    for (var B in Q) MoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, LO6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of wO6(Q))
        if (!qO6.call(A, Z) && Z !== B) MoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = $O6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, MO6 = (A) => LO6(MoA({}, "__esModule", {
    value: !0
  }), A), rSB = {};
  NO6(rSB, {
    fromUtf8: () => tSB,
    toUint8Array: () => OO6,
    toUtf8: () => RO6
  });
  eSB.exports = MO6(rSB);
  var oSB = LoA(),
    tSB = id1((A) => {
      let Q = (0, oSB.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    OO6 = id1((A) => {
      if (typeof A === "string") return tSB(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    RO6 = id1((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, oSB.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Start 6890111, End 6890692)
G_B = z((Q_B) => {
  Object.defineProperty(Q_B, "__esModule", {
    value: !0
  });
  Q_B.toBase64 = void 0;
  var TO6 = LoA(),
    PO6 = A_B(),
    jO6 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, PO6.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, TO6.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  Q_B.toBase64 = jO6
})
// @from(Start 6890698, End 6891394)
sd1 = z((ZBG, OoA) => {
  var {
    defineProperty: Z_B,
    getOwnPropertyDescriptor: SO6,
    getOwnPropertyNames: _O6
  } = Object, kO6 = Object.prototype.hasOwnProperty, nd1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of _O6(Q))
        if (!kO6.call(A, Z) && Z !== B) Z_B(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = SO6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, I_B = (A, Q, B) => (nd1(A, Q, "default"), B && nd1(B, Q, "default")), yO6 = (A) => nd1(Z_B({}, "__esModule", {
    value: !0
  }), A), ad1 = {};
  OoA.exports = yO6(ad1);
  I_B(ad1, sSB(), OoA.exports);
  I_B(ad1, G_B(), OoA.exports)
})
// @from(Start 6891400, End 6891466)
p_ = L(() => {
  Hf();
  cm1();
  OrA();
  Hf();
  d_();
  pC()
})
// @from(Start 6891472, End 6899571)
V_B = z((KBG, X_B) => {
  var {
    defineProperty: RoA,
    getOwnPropertyDescriptor: xO6,
    getOwnPropertyNames: vO6
  } = Object, bO6 = Object.prototype.hasOwnProperty, UM = (A, Q) => RoA(A, "name", {
    value: Q,
    configurable: !0
  }), fO6 = (A, Q) => {
    for (var B in Q) RoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, hO6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of vO6(Q))
        if (!bO6.call(A, Z) && Z !== B) RoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = xO6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, gO6 = (A) => hO6(RoA({}, "__esModule", {
    value: !0
  }), A), W_B = {};
  fO6(W_B, {
    constructStack: () => rd1
  });
  X_B.exports = gO6(W_B);
  var Ve = UM((A, Q) => {
      let B = [];
      if (A) B.push(A);
      if (Q)
        for (let G of Q) B.push(G);
      return B
    }, "getAllAliases"),
    kp = UM((A, Q) => {
      return `${A||"anonymous"}${Q&&Q.length>0?` (a.k.a. ${Q.join(",")})`:""}`
    }, "getMiddlewareNameWithAliases"),
    rd1 = UM(() => {
      let A = [],
        Q = [],
        B = !1,
        G = new Set,
        Z = UM((F) => F.sort((K, D) => Y_B[D.step] - Y_B[K.step] || J_B[D.priority || "normal"] - J_B[K.priority || "normal"]), "sort"),
        I = UM((F) => {
          let K = !1,
            D = UM((H) => {
              let C = Ve(H.name, H.aliases);
              if (C.includes(F)) {
                K = !0;
                for (let E of C) G.delete(E);
                return !1
              }
              return !0
            }, "filterCb");
          return A = A.filter(D), Q = Q.filter(D), K
        }, "removeByName"),
        Y = UM((F) => {
          let K = !1,
            D = UM((H) => {
              if (H.middleware === F) {
                K = !0;
                for (let C of Ve(H.name, H.aliases)) G.delete(C);
                return !1
              }
              return !0
            }, "filterCb");
          return A = A.filter(D), Q = Q.filter(D), K
        }, "removeByReference"),
        J = UM((F) => {
          var K;
          return A.forEach((D) => {
            F.add(D.middleware, {
              ...D
            })
          }), Q.forEach((D) => {
            F.addRelativeTo(D.middleware, {
              ...D
            })
          }), (K = F.identifyOnResolve) == null || K.call(F, V.identifyOnResolve()), F
        }, "cloneTo"),
        W = UM((F) => {
          let K = [];
          return F.before.forEach((D) => {
            if (D.before.length === 0 && D.after.length === 0) K.push(D);
            else K.push(...W(D))
          }), K.push(F), F.after.reverse().forEach((D) => {
            if (D.before.length === 0 && D.after.length === 0) K.push(D);
            else K.push(...W(D))
          }), K
        }, "expandRelativeMiddlewareList"),
        X = UM((F = !1) => {
          let K = [],
            D = [],
            H = {};
          return A.forEach((E) => {
            let U = {
              ...E,
              before: [],
              after: []
            };
            for (let q of Ve(U.name, U.aliases)) H[q] = U;
            K.push(U)
          }), Q.forEach((E) => {
            let U = {
              ...E,
              before: [],
              after: []
            };
            for (let q of Ve(U.name, U.aliases)) H[q] = U;
            D.push(U)
          }), D.forEach((E) => {
            if (E.toMiddleware) {
              let U = H[E.toMiddleware];
              if (U === void 0) {
                if (F) return;
                throw Error(`${E.toMiddleware} is not found when adding ${kp(E.name,E.aliases)} middleware ${E.relation} ${E.toMiddleware}`)
              }
              if (E.relation === "after") U.after.push(E);
              if (E.relation === "before") U.before.push(E)
            }
          }), Z(K).map(W).reduce((E, U) => {
            return E.push(...U), E
          }, [])
        }, "getMiddlewareList"),
        V = {
          add: (F, K = {}) => {
            let {
              name: D,
              override: H,
              aliases: C
            } = K, E = {
              step: "initialize",
              priority: "normal",
              middleware: F,
              ...K
            }, U = Ve(D, C);
            if (U.length > 0) {
              if (U.some((q) => G.has(q))) {
                if (!H) throw Error(`Duplicate middleware name '${kp(D,C)}'`);
                for (let q of U) {
                  let w = A.findIndex((R) => {
                    var T;
                    return R.name === q || ((T = R.aliases) == null ? void 0 : T.some((y) => y === q))
                  });
                  if (w === -1) continue;
                  let N = A[w];
                  if (N.step !== E.step || E.priority !== N.priority) throw Error(`"${kp(N.name,N.aliases)}" middleware with ${N.priority} priority in ${N.step} step cannot be overridden by "${kp(D,C)}" middleware with ${E.priority} priority in ${E.step} step.`);
                  A.splice(w, 1)
                }
              }
              for (let q of U) G.add(q)
            }
            A.push(E)
          },
          addRelativeTo: (F, K) => {
            let {
              name: D,
              override: H,
              aliases: C
            } = K, E = {
              middleware: F,
              ...K
            }, U = Ve(D, C);
            if (U.length > 0) {
              if (U.some((q) => G.has(q))) {
                if (!H) throw Error(`Duplicate middleware name '${kp(D,C)}'`);
                for (let q of U) {
                  let w = Q.findIndex((R) => {
                    var T;
                    return R.name === q || ((T = R.aliases) == null ? void 0 : T.some((y) => y === q))
                  });
                  if (w === -1) continue;
                  let N = Q[w];
                  if (N.toMiddleware !== E.toMiddleware || N.relation !== E.relation) throw Error(`"${kp(N.name,N.aliases)}" middleware ${N.relation} "${N.toMiddleware}" middleware cannot be overridden by "${kp(D,C)}" middleware ${E.relation} "${E.toMiddleware}" middleware.`);
                  Q.splice(w, 1)
                }
              }
              for (let q of U) G.add(q)
            }
            Q.push(E)
          },
          clone: () => J(rd1()),
          use: (F) => {
            F.applyToStack(V)
          },
          remove: (F) => {
            if (typeof F === "string") return I(F);
            else return Y(F)
          },
          removeByTag: (F) => {
            let K = !1,
              D = UM((H) => {
                let {
                  tags: C,
                  name: E,
                  aliases: U
                } = H;
                if (C && C.includes(F)) {
                  let q = Ve(E, U);
                  for (let w of q) G.delete(w);
                  return K = !0, !1
                }
                return !0
              }, "filterCb");
            return A = A.filter(D), Q = Q.filter(D), K
          },
          concat: (F) => {
            var K;
            let D = J(rd1());
            return D.use(F), D.identifyOnResolve(B || D.identifyOnResolve() || (((K = F.identifyOnResolve) == null ? void 0 : K.call(F)) ?? !1)), D
          },
          applyToStack: J,
          identify: () => {
            return X(!0).map((F) => {
              let K = F.step ?? F.relation + " " + F.toMiddleware;
              return kp(F.name, F.aliases) + " - " + K
            })
          },
          identifyOnResolve(F) {
            if (typeof F === "boolean") B = F;
            return B
          },
          resolve: (F, K) => {
            for (let D of X().map((H) => H.middleware).reverse()) F = D(F, K);
            if (B) console.log(V.identify());
            return F
          }
        };
      return V
    }, "constructStack"),
    Y_B = {
      initialize: 5,
      serialize: 4,
      build: 3,
      finalizeRequest: 2,
      deserialize: 1
    },
    J_B = {
      high: 3,
      normal: 2,
      low: 1
    }
})
// @from(Start 6899577, End 6900530)
D_B = z((DBG, K_B) => {
  var {
    defineProperty: ToA,
    getOwnPropertyDescriptor: uO6,
    getOwnPropertyNames: mO6
  } = Object, dO6 = Object.prototype.hasOwnProperty, cO6 = (A, Q) => ToA(A, "name", {
    value: Q,
    configurable: !0
  }), pO6 = (A, Q) => {
    for (var B in Q) ToA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, lO6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of mO6(Q))
        if (!dO6.call(A, Z) && Z !== B) ToA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = uO6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, iO6 = (A) => lO6(ToA({}, "__esModule", {
    value: !0
  }), A), F_B = {};
  pO6(F_B, {
    isArrayBuffer: () => nO6
  });
  K_B.exports = iO6(F_B);
  var nO6 = cO6((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 6900536, End 6901882)
td1 = z((HBG, E_B) => {
  var {
    defineProperty: PoA,
    getOwnPropertyDescriptor: aO6,
    getOwnPropertyNames: sO6
  } = Object, rO6 = Object.prototype.hasOwnProperty, H_B = (A, Q) => PoA(A, "name", {
    value: Q,
    configurable: !0
  }), oO6 = (A, Q) => {
    for (var B in Q) PoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, tO6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of sO6(Q))
        if (!rO6.call(A, Z) && Z !== B) PoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = aO6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, eO6 = (A) => tO6(PoA({}, "__esModule", {
    value: !0
  }), A), C_B = {};
  oO6(C_B, {
    fromArrayBuffer: () => QR6,
    fromString: () => BR6
  });
  E_B.exports = eO6(C_B);
  var AR6 = D_B(),
    od1 = UA("buffer"),
    QR6 = H_B((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, AR6.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return od1.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    BR6 = H_B((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? od1.Buffer.from(A, Q) : od1.Buffer.from(A)
    }, "fromString")
})
// @from(Start 6901888, End 6903551)
q_B = z((CBG, w_B) => {
  var {
    defineProperty: joA,
    getOwnPropertyDescriptor: GR6,
    getOwnPropertyNames: ZR6
  } = Object, IR6 = Object.prototype.hasOwnProperty, ed1 = (A, Q) => joA(A, "name", {
    value: Q,
    configurable: !0
  }), YR6 = (A, Q) => {
    for (var B in Q) joA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, JR6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ZR6(Q))
        if (!IR6.call(A, Z) && Z !== B) joA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = GR6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, WR6 = (A) => JR6(joA({}, "__esModule", {
    value: !0
  }), A), z_B = {};
  YR6(z_B, {
    fromUtf8: () => $_B,
    toUint8Array: () => XR6,
    toUtf8: () => VR6
  });
  w_B.exports = WR6(z_B);
  var U_B = td1(),
    $_B = ed1((A) => {
      let Q = (0, U_B.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    XR6 = ed1((A) => {
      if (typeof A === "string") return $_B(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    VR6 = ed1((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, U_B.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Start 6903557, End 6904417)
M_B = z((N_B) => {
  Object.defineProperty(N_B, "__esModule", {
    value: !0
  });
  N_B.getAwsChunkedEncodingStream = void 0;
  var FR6 = UA("stream"),
    KR6 = (A, Q) => {
      let {
        base64Encoder: B,
        bodyLengthChecker: G,
        checksumAlgorithmFn: Z,
        checksumLocationName: I,
        streamHasher: Y
      } = Q, J = B !== void 0 && Z !== void 0 && I !== void 0 && Y !== void 0, W = J ? Y(Z, A) : void 0, X = new FR6.Readable({
        read: () => {}
      });
      return A.on("data", (V) => {
        let F = G(V) || 0;
        X.push(`${F.toString(16)}\r
`), X.push(V), X.push(`\r
`)
      }), A.on("end", async () => {
        if (X.push(`0\r
`), J) {
          let V = B(await W);
          X.push(`${I}:${V}\r
`), X.push(`\r
`)
        }
        X.push(null)
      }), X
    };
  N_B.getAwsChunkedEncodingStream = KR6
})
// @from(Start 6904423, End 6905476)
P_B = z((zBG, T_B) => {
  var {
    defineProperty: SoA,
    getOwnPropertyDescriptor: DR6,
    getOwnPropertyNames: HR6
  } = Object, CR6 = Object.prototype.hasOwnProperty, Ac1 = (A, Q) => SoA(A, "name", {
    value: Q,
    configurable: !0
  }), ER6 = (A, Q) => {
    for (var B in Q) SoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zR6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HR6(Q))
        if (!CR6.call(A, Z) && Z !== B) SoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DR6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, UR6 = (A) => zR6(SoA({}, "__esModule", {
    value: !0
  }), A), O_B = {};
  ER6(O_B, {
    escapeUri: () => R_B,
    escapeUriPath: () => wR6
  });
  T_B.exports = UR6(O_B);
  var R_B = Ac1((A) => encodeURIComponent(A).replace(/[!'()*]/g, $R6), "escapeUri"),
    $R6 = Ac1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    wR6 = Ac1((A) => A.split("/").map(R_B).join("/"), "escapeUriPath")
})
// @from(Start 6905482, End 6906733)
k_B = z((UBG, __B) => {
  var {
    defineProperty: _oA,
    getOwnPropertyDescriptor: qR6,
    getOwnPropertyNames: NR6
  } = Object, LR6 = Object.prototype.hasOwnProperty, MR6 = (A, Q) => _oA(A, "name", {
    value: Q,
    configurable: !0
  }), OR6 = (A, Q) => {
    for (var B in Q) _oA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, RR6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NR6(Q))
        if (!LR6.call(A, Z) && Z !== B) _oA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qR6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, TR6 = (A) => RR6(_oA({}, "__esModule", {
    value: !0
  }), A), j_B = {};
  OR6(j_B, {
    buildQueryString: () => S_B
  });
  __B.exports = TR6(j_B);
  var Qc1 = P_B();

  function S_B(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = (0, Qc1.escapeUri)(B), Array.isArray(G))
        for (let Z = 0, I = G.length; Z < I; Z++) Q.push(`${B}=${(0,Qc1.escapeUri)(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${(0,Qc1.escapeUri)(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  MR6(S_B, "buildQueryString")
})
// @from(Start 6906739, End 6923358)
a_B = z(($BG, n_B) => {
  var {
    create: PR6,
    defineProperty: e$A,
    getOwnPropertyDescriptor: jR6,
    getOwnPropertyNames: SR6,
    getPrototypeOf: _R6
  } = Object, kR6 = Object.prototype.hasOwnProperty, hF = (A, Q) => e$A(A, "name", {
    value: Q,
    configurable: !0
  }), yR6 = (A, Q) => {
    for (var B in Q) e$A(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, v_B = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of SR6(Q))
        if (!kR6.call(A, Z) && Z !== B) e$A(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = jR6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, xR6 = (A, Q, B) => (B = A != null ? PR6(_R6(A)) : {}, v_B(Q || !A || !A.__esModule ? e$A(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), vR6 = (A) => v_B(e$A({}, "__esModule", {
    value: !0
  }), A), b_B = {};
  yR6(b_B, {
    DEFAULT_REQUEST_TIMEOUT: () => uR6,
    NodeHttp2Handler: () => lR6,
    NodeHttpHandler: () => mR6,
    streamCollector: () => nR6
  });
  n_B.exports = vR6(b_B);
  var f_B = Od1(),
    h_B = k_B(),
    Bc1 = UA("http"),
    Gc1 = UA("https"),
    bR6 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
    g_B = hF((A) => {
      let Q = {};
      for (let B of Object.keys(A)) {
        let G = A[B];
        Q[B] = Array.isArray(G) ? G.join(",") : G
      }
      return Q
    }, "getTransformedHeaders"),
    fR6 = hF((A, Q, B = 0) => {
      if (!B) return;
      let G = setTimeout(() => {
        A.destroy(), Q(Object.assign(Error(`Socket timed out without establishing a connection within ${B} ms`), {
          name: "TimeoutError"
        }))
      }, B);
      A.on("socket", (Z) => {
        if (Z.connecting) Z.on("connect", () => {
          clearTimeout(G)
        });
        else clearTimeout(G)
      })
    }, "setConnectionTimeout"),
    hR6 = hF((A, {
      keepAlive: Q,
      keepAliveMsecs: B
    }) => {
      if (Q !== !0) return;
      A.on("socket", (G) => {
        G.setKeepAlive(Q, B || 0)
      })
    }, "setSocketKeepAlive"),
    gR6 = hF((A, Q, B = 0) => {
      A.setTimeout(B, () => {
        A.destroy(), Q(Object.assign(Error(`Connection timed out after ${B} ms`), {
          name: "TimeoutError"
        }))
      })
    }, "setSocketTimeout"),
    u_B = UA("stream"),
    y_B = 1000;
  async function Zc1(A, Q, B = y_B) {
    let G = Q.headers ?? {},
      Z = G.Expect || G.expect,
      I = -1,
      Y = !1;
    if (Z === "100-continue") await Promise.race([new Promise((J) => {
      I = Number(setTimeout(J, Math.max(y_B, B)))
    }), new Promise((J) => {
      A.on("continue", () => {
        clearTimeout(I), J()
      }), A.on("error", () => {
        Y = !0, clearTimeout(I), J()
      })
    })]);
    if (!Y) m_B(A, Q.body)
  }
  hF(Zc1, "writeRequestBody");

  function m_B(A, Q) {
    if (Q instanceof u_B.Readable) {
      Q.pipe(A);
      return
    }
    if (Q) {
      if (Buffer.isBuffer(Q) || typeof Q === "string") {
        A.end(Q);
        return
      }
      let B = Q;
      if (typeof B === "object" && B.buffer && typeof B.byteOffset === "number" && typeof B.byteLength === "number") {
        A.end(Buffer.from(B.buffer, B.byteOffset, B.byteLength));
        return
      }
      A.end(Buffer.from(Q));
      return
    }
    A.end()
  }
  hF(m_B, "writeBody");
  var uR6 = 0,
    d_B = class A {
      constructor(Q) {
        this.socketWarningTimestamp = 0, this.metadata = {
          handlerProtocol: "http/1.1"
        }, this.configProvider = new Promise((B, G) => {
          if (typeof Q === "function") Q().then((Z) => {
            B(this.resolveDefaultConfig(Z))
          }).catch(G);
          else B(this.resolveDefaultConfig(Q))
        })
      }
      static create(Q) {
        if (typeof(Q == null ? void 0 : Q.handle) === "function") return Q;
        return new A(Q)
      }
      static checkSocketUsage(Q, B) {
        var G, Z;
        let {
          sockets: I,
          requests: Y,
          maxSockets: J
        } = Q;
        if (typeof J !== "number" || J === 1 / 0) return B;
        let W = 15000;
        if (Date.now() - W < B) return B;
        if (I && Y)
          for (let X in I) {
            let V = ((G = I[X]) == null ? void 0 : G.length) ?? 0,
              F = ((Z = Y[X]) == null ? void 0 : Z.length) ?? 0;
            if (V >= J && F >= 2 * J) return console.warn("@smithy/node-http-handler:WARN", `socket usage at capacity=${V} and ${F} additional requests are enqueued.`, "See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html", "or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config."), Date.now()
          }
        return B
      }
      resolveDefaultConfig(Q) {
        let {
          requestTimeout: B,
          connectionTimeout: G,
          socketTimeout: Z,
          httpAgent: I,
          httpsAgent: Y
        } = Q || {}, J = !0, W = 50;
        return {
          connectionTimeout: G,
          requestTimeout: B ?? Z,
          httpAgent: (() => {
            if (I instanceof Bc1.Agent || typeof(I == null ? void 0 : I.destroy) === "function") return I;
            return new Bc1.Agent({
              keepAlive: !0,
              maxSockets: 50,
              ...I
            })
          })(),
          httpsAgent: (() => {
            if (Y instanceof Gc1.Agent || typeof(Y == null ? void 0 : Y.destroy) === "function") return Y;
            return new Gc1.Agent({
              keepAlive: !0,
              maxSockets: 50,
              ...Y
            })
          })()
        }
      }
      destroy() {
        var Q, B, G, Z;
        (B = (Q = this.config) == null ? void 0 : Q.httpAgent) == null || B.destroy(), (Z = (G = this.config) == null ? void 0 : G.httpsAgent) == null || Z.destroy()
      }
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) this.config = await this.configProvider;
        let G;
        return new Promise((Z, I) => {
          let Y = void 0,
            J = hF(async (q) => {
              await Y, clearTimeout(G), Z(q)
            }, "resolve"),
            W = hF(async (q) => {
              await Y, I(q)
            }, "reject");
          if (!this.config) throw Error("Node HTTP request handler config is not resolved");
          if (B == null ? void 0 : B.aborted) {
            let q = Error("Request aborted");
            q.name = "AbortError", W(q);
            return
          }
          let X = Q.protocol === "https:",
            V = X ? this.config.httpsAgent : this.config.httpAgent;
          G = setTimeout(() => {
            this.socketWarningTimestamp = A.checkSocketUsage(V, this.socketWarningTimestamp)
          }, this.config.socketAcquisitionWarningTimeout ?? (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000));
          let F = (0, h_B.buildQueryString)(Q.query || {}),
            K = void 0;
          if (Q.username != null || Q.password != null) {
            let q = Q.username ?? "",
              w = Q.password ?? "";
            K = `${q}:${w}`
          }
          let D = Q.path;
          if (F) D += `?${F}`;
          if (Q.fragment) D += `#${Q.fragment}`;
          let H = {
              headers: Q.headers,
              host: Q.hostname,
              method: Q.method,
              path: D,
              port: Q.port,
              agent: V,
              auth: K
            },
            E = (X ? Gc1.request : Bc1.request)(H, (q) => {
              let w = new f_B.HttpResponse({
                statusCode: q.statusCode || -1,
                reason: q.statusMessage,
                headers: g_B(q.headers),
                body: q
              });
              J({
                response: w
              })
            });
          if (E.on("error", (q) => {
              if (bR6.includes(q.code)) W(Object.assign(q, {
                name: "TimeoutError"
              }));
              else W(q)
            }), fR6(E, W, this.config.connectionTimeout), gR6(E, W, this.config.requestTimeout), B) B.onabort = () => {
            E.abort();
            let q = Error("Request aborted");
            q.name = "AbortError", W(q)
          };
          let U = H.agent;
          if (typeof U === "object" && "keepAlive" in U) hR6(E, {
            keepAlive: U.keepAlive,
            keepAliveMsecs: U.keepAliveMsecs
          });
          Y = Zc1(E, Q, this.config.requestTimeout).catch(I)
        })
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return {
            ...G,
            [Q]: B
          }
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
    };
  hF(d_B, "NodeHttpHandler");
  var mR6 = d_B,
    x_B = UA("http2"),
    dR6 = xR6(UA("http2")),
    c_B = class {
      constructor(Q) {
        this.sessions = [], this.sessions = Q ?? []
      }
      poll() {
        if (this.sessions.length > 0) return this.sessions.shift()
      }
      offerLast(Q) {
        this.sessions.push(Q)
      }
      contains(Q) {
        return this.sessions.includes(Q)
      }
      remove(Q) {
        this.sessions = this.sessions.filter((B) => B !== Q)
      } [Symbol.iterator]() {
        return this.sessions[Symbol.iterator]()
      }
      destroy(Q) {
        for (let B of this.sessions)
          if (B === Q) {
            if (!B.destroyed) B.destroy()
          }
      }
    };
  hF(c_B, "NodeHttp2ConnectionPool");
  var cR6 = c_B,
    p_B = class {
      constructor(Q) {
        if (this.sessionCache = new Map, this.config = Q, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
      }
      lease(Q, B) {
        let G = this.getUrlString(Q),
          Z = this.sessionCache.get(G);
        if (Z) {
          let W = Z.poll();
          if (W && !this.config.disableConcurrency) return W
        }
        let I = dR6.default.connect(G);
        if (this.config.maxConcurrency) I.settings({
          maxConcurrentStreams: this.config.maxConcurrency
        }, (W) => {
          if (W) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + Q.destination.toString())
        });
        I.unref();
        let Y = hF(() => {
          I.destroy(), this.deleteSession(G, I)
        }, "destroySessionCb");
        if (I.on("goaway", Y), I.on("error", Y), I.on("frameError", Y), I.on("close", () => this.deleteSession(G, I)), B.requestTimeout) I.setTimeout(B.requestTimeout, Y);
        let J = this.sessionCache.get(G) || new cR6;
        return J.offerLast(I), this.sessionCache.set(G, J), I
      }
      deleteSession(Q, B) {
        let G = this.sessionCache.get(Q);
        if (!G) return;
        if (!G.contains(B)) return;
        G.remove(B), this.sessionCache.set(Q, G)
      }
      release(Q, B) {
        var G;
        let Z = this.getUrlString(Q);
        (G = this.sessionCache.get(Z)) == null || G.offerLast(B)
      }
      destroy() {
        for (let [Q, B] of this.sessionCache) {
          for (let G of B) {
            if (!G.destroyed) G.destroy();
            B.remove(G)
          }
          this.sessionCache.delete(Q)
        }
      }
      setMaxConcurrentStreams(Q) {
        if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
        this.config.maxConcurrency = Q
      }
      setDisableConcurrentStreams(Q) {
        this.config.disableConcurrency = Q
      }
      getUrlString(Q) {
        return Q.destination.toString()
      }
    };
  hF(p_B, "NodeHttp2ConnectionManager");
  var pR6 = p_B,
    l_B = class A {
      constructor(Q) {
        this.metadata = {
          handlerProtocol: "h2"
        }, this.connectionManager = new pR6({}), this.configProvider = new Promise((B, G) => {
          if (typeof Q === "function") Q().then((Z) => {
            B(Z || {})
          }).catch(G);
          else B(Q || {})
        })
      }
      static create(Q) {
        if (typeof(Q == null ? void 0 : Q.handle) === "function") return Q;
        return new A(Q)
      }
      destroy() {
        this.connectionManager.destroy()
      }
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) {
          if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
        }
        let {
          requestTimeout: G,
          disableConcurrentStreams: Z
        } = this.config;
        return new Promise((I, Y) => {
          var J;
          let W = !1,
            X = void 0,
            V = hF(async (x) => {
              await X, I(x)
            }, "resolve"),
            F = hF(async (x) => {
              await X, Y(x)
            }, "reject");
          if (B == null ? void 0 : B.aborted) {
            W = !0;
            let x = Error("Request aborted");
            x.name = "AbortError", F(x);
            return
          }
          let {
            hostname: K,
            method: D,
            port: H,
            protocol: C,
            query: E
          } = Q, U = "";
          if (Q.username != null || Q.password != null) {
            let x = Q.username ?? "",
              p = Q.password ?? "";
            U = `${x}:${p}@`
          }
          let q = `${C}//${U}${K}${H?`:${H}`:""}`,
            w = {
              destination: new URL(q)
            },
            N = this.connectionManager.lease(w, {
              requestTimeout: (J = this.config) == null ? void 0 : J.sessionTimeout,
              disableConcurrentStreams: Z || !1
            }),
            R = hF((x) => {
              if (Z) this.destroySession(N);
              W = !0, F(x)
            }, "rejectWithDestroy"),
            T = (0, h_B.buildQueryString)(E || {}),
            y = Q.path;
          if (T) y += `?${T}`;
          if (Q.fragment) y += `#${Q.fragment}`;
          let v = N.request({
            ...Q.headers,
            [x_B.constants.HTTP2_HEADER_PATH]: y,
            [x_B.constants.HTTP2_HEADER_METHOD]: D
          });
          if (N.ref(), v.on("response", (x) => {
              let p = new f_B.HttpResponse({
                statusCode: x[":status"] || -1,
                headers: g_B(x),
                body: v
              });
              if (W = !0, V({
                  response: p
                }), Z) N.close(), this.connectionManager.deleteSession(q, N)
            }), G) v.setTimeout(G, () => {
            v.close();
            let x = Error(`Stream timed out because of no activity for ${G} ms`);
            x.name = "TimeoutError", R(x)
          });
          if (B) B.onabort = () => {
            v.close();
            let x = Error("Request aborted");
            x.name = "AbortError", R(x)
          };
          v.on("frameError", (x, p, u) => {
            R(Error(`Frame type id ${x} in stream id ${u} has failed with code ${p}.`))
          }), v.on("error", R), v.on("aborted", () => {
            R(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${v.rstCode}.`))
          }), v.on("close", () => {
            if (N.unref(), Z) N.destroy();
            if (!W) R(Error("Unexpected error: http2 request did not get a response"))
          }), X = Zc1(v, Q, G)
        })
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return {
            ...G,
            [Q]: B
          }
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
      destroySession(Q) {
        if (!Q.destroyed) Q.destroy()
      }
    };
  hF(l_B, "NodeHttp2Handler");
  var lR6 = l_B,
    i_B = class extends u_B.Writable {
      constructor() {
        super(...arguments);
        this.bufferedBytes = []
      }
      _write(Q, B, G) {
        this.bufferedBytes.push(Q), G()
      }
    };
  hF(i_B, "Collector");
  var iR6 = i_B,
    nR6 = hF((A) => new Promise((Q, B) => {
      let G = new iR6;
      A.pipe(G), A.on("error", (Z) => {
        G.end(), B(Z)
      }), G.on("error", B), G.on("finish", function() {
        let Z = new Uint8Array(Buffer.concat(this.bufferedBytes));
        Q(Z)
      })
    }), "streamCollector")
})
// @from(Start 6923364, End 6924929)
t_B = z((r_B) => {
  Object.defineProperty(r_B, "__esModule", {
    value: !0
  });
  r_B.sdkStreamMixin = void 0;
  var aR6 = a_B(),
    sR6 = td1(),
    Ic1 = UA("stream"),
    rR6 = UA("util"),
    s_B = "The stream has already been transformed.",
    oR6 = (A) => {
      var Q, B;
      if (!(A instanceof Ic1.Readable)) {
        let I = ((B = (Q = A === null || A === void 0 ? void 0 : A.__proto__) === null || Q === void 0 ? void 0 : Q.constructor) === null || B === void 0 ? void 0 : B.name) || A;
        throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${I}`)
      }
      let G = !1,
        Z = async () => {
          if (G) throw Error(s_B);
          return G = !0, await (0, aR6.streamCollector)(A)
        };
      return Object.assign(A, {
        transformToByteArray: Z,
        transformToString: async (I) => {
          let Y = await Z();
          if (I === void 0 || Buffer.isEncoding(I)) return (0, sR6.fromArrayBuffer)(Y.buffer, Y.byteOffset, Y.byteLength).toString(I);
          else return new rR6.TextDecoder(I).decode(Y)
        },
        transformToWebStream: () => {
          if (G) throw Error(s_B);
          if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
          if (typeof Ic1.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
          return G = !0, Ic1.Readable.toWeb(A)
        }
      })
    };
  r_B.sdkStreamMixin = oR6
})
// @from(Start 6924935, End 6926717)
IkB = z((qBG, xoA) => {
  var {
    defineProperty: koA,
    getOwnPropertyDescriptor: tR6,
    getOwnPropertyNames: eR6
  } = Object, AT6 = Object.prototype.hasOwnProperty, Wc1 = (A, Q) => koA(A, "name", {
    value: Q,
    configurable: !0
  }), QT6 = (A, Q) => {
    for (var B in Q) koA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Yc1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of eR6(Q))
        if (!AT6.call(A, Z) && Z !== B) koA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = tR6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, e_B = (A, Q, B) => (Yc1(A, Q, "default"), B && Yc1(B, Q, "default")), BT6 = (A) => Yc1(koA({}, "__esModule", {
    value: !0
  }), A), yoA = {};
  QT6(yoA, {
    Uint8ArrayBlobAdapter: () => Jc1
  });
  xoA.exports = BT6(yoA);
  var AkB = sd1(),
    QkB = q_B();

  function BkB(A, Q = "utf-8") {
    if (Q === "base64") return (0, AkB.toBase64)(A);
    return (0, QkB.toUtf8)(A)
  }
  Wc1(BkB, "transformToString");

  function GkB(A, Q) {
    if (Q === "base64") return Jc1.mutate((0, AkB.fromBase64)(A));
    return Jc1.mutate((0, QkB.fromUtf8)(A))
  }
  Wc1(GkB, "transformFromString");
  var ZkB = class A extends Uint8Array {
    static fromString(Q, B = "utf-8") {
      switch (typeof Q) {
        case "string":
          return GkB(Q, B);
        default:
          throw Error(`Unsupported conversion from ${typeof Q} to Uint8ArrayBlobAdapter.`)
      }
    }
    static mutate(Q) {
      return Object.setPrototypeOf(Q, A.prototype), Q
    }
    transformToString(Q = "utf-8") {
      return BkB(this, Q)
    }
  };
  Wc1(ZkB, "Uint8ArrayBlobAdapter");
  var Jc1 = ZkB;
  e_B(yoA, M_B(), xoA.exports);
  e_B(yoA, t_B(), xoA.exports)
})