
// @from(Start 2280707, End 2282103)
he0 = z((be0) => {
  Object.defineProperty(be0, "__esModule", {
    value: !0
  });
  be0.createChecksumStream = void 0;
  var rK4 = v4A(),
    oK4 = Zd(),
    tK4 = ve0(),
    eK4 = ({
      expectedChecksum: A,
      checksum: Q,
      source: B,
      checksumSourceLocation: G,
      base64Encoder: Z
    }) => {
      var I, Y;
      if (!(0, oK4.isReadableStream)(B)) throw Error(`@smithy/util-stream: unsupported source type ${(Y=(I=B===null||B===void 0?void 0:B.constructor)===null||I===void 0?void 0:I.name)!==null&&Y!==void 0?Y:B} in ChecksumStream.`);
      let J = Z !== null && Z !== void 0 ? Z : rK4.toBase64;
      if (typeof TransformStream !== "function") throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
      let W = new TransformStream({
        start() {},
        async transform(V, F) {
          Q.update(V), F.enqueue(V)
        },
        async flush(V) {
          let F = await Q.digest(),
            K = J(F);
          if (A !== K) {
            let D = Error(`Checksum mismatch: expected "${A}" but received "${K}" in response header "${G}".`);
            V.error(D)
          } else V.terminate()
        }
      });
      B.pipeThrough(W);
      let X = W.readable;
      return Object.setPrototypeOf(X, tK4.ChecksumStream.prototype), X
    };
  be0.createChecksumStream = eK4
})
// @from(Start 2282109, End 2282469)
ue0 = z((ge0) => {
  Object.defineProperty(ge0, "__esModule", {
    value: !0
  });
  ge0.createChecksumStream = GD4;
  var AD4 = Zd(),
    QD4 = HU1(),
    BD4 = he0();

  function GD4(A) {
    if (typeof ReadableStream === "function" && (0, AD4.isReadableStream)(A.source)) return (0, BD4.createChecksumStream)(A);
    return new QD4.ChecksumStream(A)
  }
})
// @from(Start 2282475, End 2283269)
CU1 = z((de0) => {
  Object.defineProperty(de0, "__esModule", {
    value: !0
  });
  de0.ByteArrayCollector = void 0;
  class me0 {
    constructor(A) {
      this.allocByteArray = A, this.byteLength = 0, this.byteArrays = []
    }
    push(A) {
      this.byteArrays.push(A), this.byteLength += A.byteLength
    }
    flush() {
      if (this.byteArrays.length === 1) {
        let B = this.byteArrays[0];
        return this.reset(), B
      }
      let A = this.allocByteArray(this.byteLength),
        Q = 0;
      for (let B = 0; B < this.byteArrays.length; ++B) {
        let G = this.byteArrays[B];
        A.set(G, Q), Q += G.byteLength
      }
      return this.reset(), A
    }
    reset() {
      this.byteArrays = [], this.byteLength = 0
    }
  }
  de0.ByteArrayCollector = me0
})
// @from(Start 2283275, End 2285586)
se0 = z((ne0) => {
  Object.defineProperty(ne0, "__esModule", {
    value: !0
  });
  ne0.createBufferedReadable = void 0;
  ne0.createBufferedReadableStream = pe0;
  ne0.merge = le0;
  ne0.flush = $fA;
  ne0.sizeOf = b4A;
  ne0.modeOf = ie0;
  var ID4 = CU1();

  function pe0(A, Q, B) {
    let G = A.getReader(),
      Z = !1,
      I = 0,
      Y = ["", new ID4.ByteArrayCollector((X) => new Uint8Array(X))],
      J = -1,
      W = async (X) => {
        let {
          value: V,
          done: F
        } = await G.read(), K = V;
        if (F) {
          if (J !== -1) {
            let D = $fA(Y, J);
            if (b4A(D) > 0) X.enqueue(D)
          }
          X.close()
        } else {
          let D = ie0(K, !1);
          if (J !== D) {
            if (J >= 0) X.enqueue($fA(Y, J));
            J = D
          }
          if (J === -1) {
            X.enqueue(K);
            return
          }
          let H = b4A(K);
          I += H;
          let C = b4A(Y[J]);
          if (H >= Q && C === 0) X.enqueue(K);
          else {
            let E = le0(Y, J, K);
            if (!Z && I > Q * 2) Z = !0, B === null || B === void 0 || B.warn(`@smithy/util-stream - stream chunk size ${H} is below threshold of ${Q}, automatically buffering.`);
            if (E >= Q) X.enqueue($fA(Y, J));
            else await W(X)
          }
        }
      };
    return new ReadableStream({
      pull: W
    })
  }
  ne0.createBufferedReadable = pe0;

  function le0(A, Q, B) {
    switch (Q) {
      case 0:
        return A[0] += B, b4A(A[0]);
      case 1:
      case 2:
        return A[Q].push(B), b4A(A[Q])
    }
  }

  function $fA(A, Q) {
    switch (Q) {
      case 0:
        let B = A[0];
        return A[0] = "", B;
      case 1:
      case 2:
        return A[Q].flush()
    }
    throw Error(`@smithy/util-stream - invalid index ${Q} given to flush()`)
  }

  function b4A(A) {
    var Q, B;
    return (B = (Q = A === null || A === void 0 ? void 0 : A.byteLength) !== null && Q !== void 0 ? Q : A === null || A === void 0 ? void 0 : A.length) !== null && B !== void 0 ? B : 0
  }

  function ie0(A, Q = !0) {
    if (Q && typeof Buffer < "u" && A instanceof Buffer) return 2;
    if (A instanceof Uint8Array) return 1;
    if (typeof A === "string") return 0;
    return -1
  }
})
// @from(Start 2285592, End 2286957)
te0 = z((oe0) => {
  Object.defineProperty(oe0, "__esModule", {
    value: !0
  });
  oe0.createBufferedReadable = DD4;
  var FD4 = UA("node:stream"),
    re0 = CU1(),
    qv = se0(),
    KD4 = Zd();

  function DD4(A, Q, B) {
    if ((0, KD4.isReadableStream)(A)) return (0, qv.createBufferedReadableStream)(A, Q, B);
    let G = new FD4.Readable({
        read() {}
      }),
      Z = !1,
      I = 0,
      Y = ["", new re0.ByteArrayCollector((W) => new Uint8Array(W)), new re0.ByteArrayCollector((W) => Buffer.from(new Uint8Array(W)))],
      J = -1;
    return A.on("data", (W) => {
      let X = (0, qv.modeOf)(W, !0);
      if (J !== X) {
        if (J >= 0) G.push((0, qv.flush)(Y, J));
        J = X
      }
      if (J === -1) {
        G.push(W);
        return
      }
      let V = (0, qv.sizeOf)(W);
      I += V;
      let F = (0, qv.sizeOf)(Y[J]);
      if (V >= Q && F === 0) G.push(W);
      else {
        let K = (0, qv.merge)(Y, J, W);
        if (!Z && I > Q * 2) Z = !0, B === null || B === void 0 || B.warn(`@smithy/util-stream - stream chunk size ${V} is below threshold of ${Q}, automatically buffering.`);
        if (K >= Q) G.push((0, qv.flush)(Y, J))
      }
    }), A.on("end", () => {
      if (J !== -1) {
        let W = (0, qv.flush)(Y, J);
        if ((0, qv.sizeOf)(W) > 0) G.push(W)
      }
      G.push(null)
    }), G
  }
})
// @from(Start 2286963, End 2287823)
QAQ = z((ee0) => {
  Object.defineProperty(ee0, "__esModule", {
    value: !0
  });
  ee0.getAwsChunkedEncodingStream = void 0;
  var CD4 = UA("stream"),
    ED4 = (A, Q) => {
      let {
        base64Encoder: B,
        bodyLengthChecker: G,
        checksumAlgorithmFn: Z,
        checksumLocationName: I,
        streamHasher: Y
      } = Q, J = B !== void 0 && Z !== void 0 && I !== void 0 && Y !== void 0, W = J ? Y(Z, A) : void 0, X = new CD4.Readable({
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
  ee0.getAwsChunkedEncodingStream = ED4
})
// @from(Start 2287829, End 2288579)
GAQ = z((BAQ) => {
  Object.defineProperty(BAQ, "__esModule", {
    value: !0
  });
  BAQ.headStream = zD4;
  async function zD4(A, Q) {
    var B;
    let G = 0,
      Z = [],
      I = A.getReader(),
      Y = !1;
    while (!Y) {
      let {
        done: X,
        value: V
      } = await I.read();
      if (V) Z.push(V), G += (B = V === null || V === void 0 ? void 0 : V.byteLength) !== null && B !== void 0 ? B : 0;
      if (G >= Q) break;
      Y = X
    }
    I.releaseLock();
    let J = new Uint8Array(Math.min(Q, G)),
      W = 0;
    for (let X of Z) {
      if (X.byteLength > J.byteLength - W) {
        J.set(X.subarray(0, J.byteLength - W), W);
        break
      } else J.set(X, W);
      W += X.length
    }
    return J
  }
})
// @from(Start 2288585, End 2289746)
JAQ = z((IAQ) => {
  Object.defineProperty(IAQ, "__esModule", {
    value: !0
  });
  IAQ.headStream = void 0;
  var $D4 = UA("stream"),
    wD4 = GAQ(),
    qD4 = Zd(),
    ND4 = (A, Q) => {
      if ((0, qD4.isReadableStream)(A)) return (0, wD4.headStream)(A, Q);
      return new Promise((B, G) => {
        let Z = new ZAQ;
        Z.limit = Q, A.pipe(Z), A.on("error", (I) => {
          Z.end(), G(I)
        }), Z.on("error", G), Z.on("finish", function() {
          let I = new Uint8Array(Buffer.concat(this.buffers));
          B(I)
        })
      })
    };
  IAQ.headStream = ND4;
  class ZAQ extends $D4.Writable {
    constructor() {
      super(...arguments);
      this.buffers = [], this.limit = 1 / 0, this.bytesBuffered = 0
    }
    _write(A, Q, B) {
      var G;
      if (this.buffers.push(A), this.bytesBuffered += (G = A.byteLength) !== null && G !== void 0 ? G : 0, this.bytesBuffered >= this.limit) {
        let Z = this.bytesBuffered - this.limit,
          I = this.buffers[this.buffers.length - 1];
        this.buffers[this.buffers.length - 1] = I.subarray(0, I.byteLength - Z), this.emit("finish")
      }
      B()
    }
  }
})
// @from(Start 2289752, End 2292535)
zAQ = z((_H7, EAQ) => {
  var {
    defineProperty: wfA,
    getOwnPropertyDescriptor: LD4,
    getOwnPropertyNames: MD4
  } = Object, OD4 = Object.prototype.hasOwnProperty, qfA = (A, Q) => wfA(A, "name", {
    value: Q,
    configurable: !0
  }), RD4 = (A, Q) => {
    for (var B in Q) wfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, TD4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of MD4(Q))
        if (!OD4.call(A, Z) && Z !== B) wfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = LD4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, PD4 = (A) => TD4(wfA({}, "__esModule", {
    value: !0
  }), A), WAQ = {};
  RD4(WAQ, {
    AlgorithmId: () => KAQ,
    EndpointURLScheme: () => FAQ,
    FieldPosition: () => DAQ,
    HttpApiKeyAuthLocation: () => VAQ,
    HttpAuthLocation: () => XAQ,
    IniSectionType: () => HAQ,
    RequestHandlerProtocol: () => CAQ,
    SMITHY_CONTEXT_KEY: () => yD4,
    getDefaultClientConfiguration: () => _D4,
    resolveDefaultRuntimeConfig: () => kD4
  });
  EAQ.exports = PD4(WAQ);
  var XAQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(XAQ || {}),
    VAQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(VAQ || {}),
    FAQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(FAQ || {}),
    KAQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(KAQ || {}),
    jD4 = qfA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    SD4 = qfA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    _D4 = qfA((A) => {
      return jD4(A)
    }, "getDefaultClientConfiguration"),
    kD4 = qfA((A) => {
      return SD4(A)
    }, "resolveDefaultRuntimeConfig"),
    DAQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(DAQ || {}),
    yD4 = "__smithy_context",
    HAQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(HAQ || {}),
    CAQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(CAQ || {})
})
// @from(Start 2292541, End 2297048)
LAQ = z((kH7, NAQ) => {
  var {
    defineProperty: NfA,
    getOwnPropertyDescriptor: xD4,
    getOwnPropertyNames: vD4
  } = Object, bD4 = Object.prototype.hasOwnProperty, Id = (A, Q) => NfA(A, "name", {
    value: Q,
    configurable: !0
  }), fD4 = (A, Q) => {
    for (var B in Q) NfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, hD4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of vD4(Q))
        if (!bD4.call(A, Z) && Z !== B) NfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = xD4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, gD4 = (A) => hD4(NfA({}, "__esModule", {
    value: !0
  }), A), UAQ = {};
  fD4(UAQ, {
    Field: () => dD4,
    Fields: () => cD4,
    HttpRequest: () => pD4,
    HttpResponse: () => lD4,
    IHttpRequest: () => $AQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => uD4,
    isValidHostname: () => qAQ,
    resolveHttpHandlerRuntimeConfig: () => mD4
  });
  NAQ.exports = gD4(UAQ);
  var uD4 = Id((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    mD4 = Id((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    $AQ = zAQ(),
    dD4 = class {
      static {
        Id(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = $AQ.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    cD4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Id(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    pD4 = class A {
      static {
        Id(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = wAQ(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function wAQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Id(wAQ, "cloneQuery");
  var lD4 = class {
    static {
      Id(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function qAQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Id(qAQ, "isValidHostname")
})
// @from(Start 2297054, End 2298107)
TAQ = z((bH7, RAQ) => {
  var {
    defineProperty: LfA,
    getOwnPropertyDescriptor: iD4,
    getOwnPropertyNames: nD4
  } = Object, aD4 = Object.prototype.hasOwnProperty, EU1 = (A, Q) => LfA(A, "name", {
    value: Q,
    configurable: !0
  }), sD4 = (A, Q) => {
    for (var B in Q) LfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, rD4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of nD4(Q))
        if (!aD4.call(A, Z) && Z !== B) LfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = iD4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, oD4 = (A) => rD4(LfA({}, "__esModule", {
    value: !0
  }), A), MAQ = {};
  sD4(MAQ, {
    escapeUri: () => OAQ,
    escapeUriPath: () => eD4
  });
  RAQ.exports = oD4(MAQ);
  var OAQ = EU1((A) => encodeURIComponent(A).replace(/[!'()*]/g, tD4), "escapeUri"),
    tD4 = EU1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    eD4 = EU1((A) => A.split("/").map(OAQ).join("/"), "escapeUriPath")
})
// @from(Start 2298113, End 2299364)
_AQ = z((fH7, SAQ) => {
  var {
    defineProperty: MfA,
    getOwnPropertyDescriptor: AH4,
    getOwnPropertyNames: QH4
  } = Object, BH4 = Object.prototype.hasOwnProperty, GH4 = (A, Q) => MfA(A, "name", {
    value: Q,
    configurable: !0
  }), ZH4 = (A, Q) => {
    for (var B in Q) MfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, IH4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of QH4(Q))
        if (!BH4.call(A, Z) && Z !== B) MfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = AH4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, YH4 = (A) => IH4(MfA({}, "__esModule", {
    value: !0
  }), A), PAQ = {};
  ZH4(PAQ, {
    buildQueryString: () => jAQ
  });
  SAQ.exports = YH4(PAQ);
  var zU1 = TAQ();

  function jAQ(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = (0, zU1.escapeUri)(B), Array.isArray(G))
        for (let Z = 0, I = G.length; Z < I; Z++) Q.push(`${B}=${(0,zU1.escapeUri)(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${(0,zU1.escapeUri)(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  GH4(jAQ, "buildQueryString")
})
// @from(Start 2299370, End 2318316)
IZ = z((hH7, lAQ) => {
  var {
    create: JH4,
    defineProperty: bDA,
    getOwnPropertyDescriptor: WH4,
    getOwnPropertyNames: XH4,
    getPrototypeOf: VH4
  } = Object, FH4 = Object.prototype.hasOwnProperty, ZZ = (A, Q) => bDA(A, "name", {
    value: Q,
    configurable: !0
  }), KH4 = (A, Q) => {
    for (var B in Q) bDA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bAQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of XH4(Q))
        if (!FH4.call(A, Z) && Z !== B) bDA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = WH4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, DH4 = (A, Q, B) => (B = A != null ? JH4(VH4(A)) : {}, bAQ(Q || !A || !A.__esModule ? bDA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), HH4 = (A) => bAQ(bDA({}, "__esModule", {
    value: !0
  }), A), fAQ = {};
  KH4(fAQ, {
    DEFAULT_REQUEST_TIMEOUT: () => cAQ,
    NodeHttp2Handler: () => MH4,
    NodeHttpHandler: () => wH4,
    streamCollector: () => RH4
  });
  lAQ.exports = HH4(fAQ);
  var hAQ = LAQ(),
    gAQ = _AQ(),
    UU1 = UA("http"),
    $U1 = UA("https"),
    CH4 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
    uAQ = ZZ((A) => {
      let Q = {};
      for (let B of Object.keys(A)) {
        let G = A[B];
        Q[B] = Array.isArray(G) ? G.join(",") : G
      }
      return Q
    }, "getTransformedHeaders"),
    pz = {
      setTimeout: (A, Q) => setTimeout(A, Q),
      clearTimeout: (A) => clearTimeout(A)
    },
    kAQ = 1000,
    EH4 = ZZ((A, Q, B = 0) => {
      if (!B) return -1;
      let G = ZZ((Z) => {
        let I = pz.setTimeout(() => {
            A.destroy(), Q(Object.assign(Error(`Socket timed out without establishing a connection within ${B} ms`), {
              name: "TimeoutError"
            }))
          }, B - Z),
          Y = ZZ((J) => {
            if (J?.connecting) J.on("connect", () => {
              pz.clearTimeout(I)
            });
            else pz.clearTimeout(I)
          }, "doWithSocket");
        if (A.socket) Y(A.socket);
        else A.on("socket", Y)
      }, "registerTimeout");
      if (B < 2000) return G(0), 0;
      return pz.setTimeout(G.bind(null, kAQ), kAQ)
    }, "setConnectionTimeout"),
    zH4 = 3000,
    UH4 = ZZ((A, {
      keepAlive: Q,
      keepAliveMsecs: B
    }, G = zH4) => {
      if (Q !== !0) return -1;
      let Z = ZZ(() => {
        if (A.socket) A.socket.setKeepAlive(Q, B || 0);
        else A.on("socket", (I) => {
          I.setKeepAlive(Q, B || 0)
        })
      }, "registerListener");
      if (G === 0) return Z(), 0;
      return pz.setTimeout(Z, G)
    }, "setSocketKeepAlive"),
    yAQ = 3000,
    $H4 = ZZ((A, Q, B = cAQ) => {
      let G = ZZ((Z) => {
        let I = B - Z,
          Y = ZZ(() => {
            A.destroy(), Q(Object.assign(Error(`Connection timed out after ${B} ms`), {
              name: "TimeoutError"
            }))
          }, "onTimeout");
        if (A.socket) A.socket.setTimeout(I, Y), A.on("close", () => A.socket?.removeListener("timeout", Y));
        else A.setTimeout(I, Y)
      }, "registerTimeout");
      if (0 < B && B < 6000) return G(0), 0;
      return pz.setTimeout(G.bind(null, B === 0 ? 0 : yAQ), yAQ)
    }, "setSocketTimeout"),
    mAQ = UA("stream"),
    xAQ = 6000;
  async function wU1(A, Q, B = xAQ) {
    let G = Q.headers ?? {},
      Z = G.Expect || G.expect,
      I = -1,
      Y = !0;
    if (Z === "100-continue") Y = await Promise.race([new Promise((J) => {
      I = Number(pz.setTimeout(() => J(!0), Math.max(xAQ, B)))
    }), new Promise((J) => {
      A.on("continue", () => {
        pz.clearTimeout(I), J(!0)
      }), A.on("response", () => {
        pz.clearTimeout(I), J(!1)
      }), A.on("error", () => {
        pz.clearTimeout(I), J(!1)
      })
    })]);
    if (Y) dAQ(A, Q.body)
  }
  ZZ(wU1, "writeRequestBody");

  function dAQ(A, Q) {
    if (Q instanceof mAQ.Readable) {
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
  ZZ(dAQ, "writeBody");
  var cAQ = 0,
    wH4 = class A {
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
      static {
        ZZ(this, "NodeHttpHandler")
      }
      static create(Q) {
        if (typeof Q?.handle === "function") return Q;
        return new A(Q)
      }
      static checkSocketUsage(Q, B, G = console) {
        let {
          sockets: Z,
          requests: I,
          maxSockets: Y
        } = Q;
        if (typeof Y !== "number" || Y === 1 / 0) return B;
        let J = 15000;
        if (Date.now() - J < B) return B;
        if (Z && I)
          for (let W in Z) {
            let X = Z[W]?.length ?? 0,
              V = I[W]?.length ?? 0;
            if (X >= Y && V >= 2 * Y) return G?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${X} and ${V} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`), Date.now()
          }
        return B
      }
      resolveDefaultConfig(Q) {
        let {
          requestTimeout: B,
          connectionTimeout: G,
          socketTimeout: Z,
          socketAcquisitionWarningTimeout: I,
          httpAgent: Y,
          httpsAgent: J
        } = Q || {}, W = !0, X = 50;
        return {
          connectionTimeout: G,
          requestTimeout: B ?? Z,
          socketAcquisitionWarningTimeout: I,
          httpAgent: (() => {
            if (Y instanceof UU1.Agent || typeof Y?.destroy === "function") return Y;
            return new UU1.Agent({
              keepAlive: !0,
              maxSockets: 50,
              ...Y
            })
          })(),
          httpsAgent: (() => {
            if (J instanceof $U1.Agent || typeof J?.destroy === "function") return J;
            return new $U1.Agent({
              keepAlive: !0,
              maxSockets: 50,
              ...J
            })
          })(),
          logger: console
        }
      }
      destroy() {
        this.config?.httpAgent?.destroy(), this.config?.httpsAgent?.destroy()
      }
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) this.config = await this.configProvider;
        return new Promise((G, Z) => {
          let I = void 0,
            Y = [],
            J = ZZ(async (w) => {
              await I, Y.forEach(pz.clearTimeout), G(w)
            }, "resolve"),
            W = ZZ(async (w) => {
              await I, Y.forEach(pz.clearTimeout), Z(w)
            }, "reject");
          if (!this.config) throw Error("Node HTTP request handler config is not resolved");
          if (B?.aborted) {
            let w = Error("Request aborted");
            w.name = "AbortError", W(w);
            return
          }
          let X = Q.protocol === "https:",
            V = X ? this.config.httpsAgent : this.config.httpAgent;
          Y.push(pz.setTimeout(() => {
            this.socketWarningTimestamp = A.checkSocketUsage(V, this.socketWarningTimestamp, this.config.logger)
          }, this.config.socketAcquisitionWarningTimeout ?? (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000)));
          let F = (0, gAQ.buildQueryString)(Q.query || {}),
            K = void 0;
          if (Q.username != null || Q.password != null) {
            let w = Q.username ?? "",
              N = Q.password ?? "";
            K = `${w}:${N}`
          }
          let D = Q.path;
          if (F) D += `?${F}`;
          if (Q.fragment) D += `#${Q.fragment}`;
          let H = Q.hostname ?? "";
          if (H[0] === "[" && H.endsWith("]")) H = Q.hostname.slice(1, -1);
          else H = Q.hostname;
          let C = {
              headers: Q.headers,
              host: H,
              method: Q.method,
              path: D,
              port: Q.port,
              agent: V,
              auth: K
            },
            U = (X ? $U1.request : UU1.request)(C, (w) => {
              let N = new hAQ.HttpResponse({
                statusCode: w.statusCode || -1,
                reason: w.statusMessage,
                headers: uAQ(w.headers),
                body: w
              });
              J({
                response: N
              })
            });
          if (U.on("error", (w) => {
              if (CH4.includes(w.code)) W(Object.assign(w, {
                name: "TimeoutError"
              }));
              else W(w)
            }), B) {
            let w = ZZ(() => {
              U.destroy();
              let N = Error("Request aborted");
              N.name = "AbortError", W(N)
            }, "onAbort");
            if (typeof B.addEventListener === "function") {
              let N = B;
              N.addEventListener("abort", w, {
                once: !0
              }), U.once("close", () => N.removeEventListener("abort", w))
            } else B.onabort = w
          }
          Y.push(EH4(U, W, this.config.connectionTimeout)), Y.push($H4(U, W, this.config.requestTimeout));
          let q = C.agent;
          if (typeof q === "object" && "keepAlive" in q) Y.push(UH4(U, {
            keepAlive: q.keepAlive,
            keepAliveMsecs: q.keepAliveMsecs
          }));
          I = wU1(U, Q, this.config.requestTimeout).catch((w) => {
            return Y.forEach(pz.clearTimeout), Z(w)
          })
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
    },
    vAQ = UA("http2"),
    qH4 = DH4(UA("http2")),
    NH4 = class {
      constructor(A) {
        this.sessions = [], this.sessions = A ?? []
      }
      static {
        ZZ(this, "NodeHttp2ConnectionPool")
      }
      poll() {
        if (this.sessions.length > 0) return this.sessions.shift()
      }
      offerLast(A) {
        this.sessions.push(A)
      }
      contains(A) {
        return this.sessions.includes(A)
      }
      remove(A) {
        this.sessions = this.sessions.filter((Q) => Q !== A)
      } [Symbol.iterator]() {
        return this.sessions[Symbol.iterator]()
      }
      destroy(A) {
        for (let Q of this.sessions)
          if (Q === A) {
            if (!Q.destroyed) Q.destroy()
          }
      }
    },
    LH4 = class {
      constructor(A) {
        if (this.sessionCache = new Map, this.config = A, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
      }
      static {
        ZZ(this, "NodeHttp2ConnectionManager")
      }
      lease(A, Q) {
        let B = this.getUrlString(A),
          G = this.sessionCache.get(B);
        if (G) {
          let J = G.poll();
          if (J && !this.config.disableConcurrency) return J
        }
        let Z = qH4.default.connect(B);
        if (this.config.maxConcurrency) Z.settings({
          maxConcurrentStreams: this.config.maxConcurrency
        }, (J) => {
          if (J) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + A.destination.toString())
        });
        Z.unref();
        let I = ZZ(() => {
          Z.destroy(), this.deleteSession(B, Z)
        }, "destroySessionCb");
        if (Z.on("goaway", I), Z.on("error", I), Z.on("frameError", I), Z.on("close", () => this.deleteSession(B, Z)), Q.requestTimeout) Z.setTimeout(Q.requestTimeout, I);
        let Y = this.sessionCache.get(B) || new NH4;
        return Y.offerLast(Z), this.sessionCache.set(B, Y), Z
      }
      deleteSession(A, Q) {
        let B = this.sessionCache.get(A);
        if (!B) return;
        if (!B.contains(Q)) return;
        B.remove(Q), this.sessionCache.set(A, B)
      }
      release(A, Q) {
        let B = this.getUrlString(A);
        this.sessionCache.get(B)?.offerLast(Q)
      }
      destroy() {
        for (let [A, Q] of this.sessionCache) {
          for (let B of Q) {
            if (!B.destroyed) B.destroy();
            Q.remove(B)
          }
          this.sessionCache.delete(A)
        }
      }
      setMaxConcurrentStreams(A) {
        if (A && A <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
        this.config.maxConcurrency = A
      }
      setDisableConcurrentStreams(A) {
        this.config.disableConcurrency = A
      }
      getUrlString(A) {
        return A.destination.toString()
      }
    },
    MH4 = class A {
      constructor(Q) {
        this.metadata = {
          handlerProtocol: "h2"
        }, this.connectionManager = new LH4({}), this.configProvider = new Promise((B, G) => {
          if (typeof Q === "function") Q().then((Z) => {
            B(Z || {})
          }).catch(G);
          else B(Q || {})
        })
      }
      static {
        ZZ(this, "NodeHttp2Handler")
      }
      static create(Q) {
        if (typeof Q?.handle === "function") return Q;
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
          let J = !1,
            W = void 0,
            X = ZZ(async (v) => {
              await W, I(v)
            }, "resolve"),
            V = ZZ(async (v) => {
              await W, Y(v)
            }, "reject");
          if (B?.aborted) {
            J = !0;
            let v = Error("Request aborted");
            v.name = "AbortError", V(v);
            return
          }
          let {
            hostname: F,
            method: K,
            port: D,
            protocol: H,
            query: C
          } = Q, E = "";
          if (Q.username != null || Q.password != null) {
            let v = Q.username ?? "",
              x = Q.password ?? "";
            E = `${v}:${x}@`
          }
          let U = `${H}//${E}${F}${D?`:${D}`:""}`,
            q = {
              destination: new URL(U)
            },
            w = this.connectionManager.lease(q, {
              requestTimeout: this.config?.sessionTimeout,
              disableConcurrentStreams: Z || !1
            }),
            N = ZZ((v) => {
              if (Z) this.destroySession(w);
              J = !0, V(v)
            }, "rejectWithDestroy"),
            R = (0, gAQ.buildQueryString)(C || {}),
            T = Q.path;
          if (R) T += `?${R}`;
          if (Q.fragment) T += `#${Q.fragment}`;
          let y = w.request({
            ...Q.headers,
            [vAQ.constants.HTTP2_HEADER_PATH]: T,
            [vAQ.constants.HTTP2_HEADER_METHOD]: K
          });
          if (w.ref(), y.on("response", (v) => {
              let x = new hAQ.HttpResponse({
                statusCode: v[":status"] || -1,
                headers: uAQ(v),
                body: y
              });
              if (J = !0, X({
                  response: x
                }), Z) w.close(), this.connectionManager.deleteSession(U, w)
            }), G) y.setTimeout(G, () => {
            y.close();
            let v = Error(`Stream timed out because of no activity for ${G} ms`);
            v.name = "TimeoutError", N(v)
          });
          if (B) {
            let v = ZZ(() => {
              y.close();
              let x = Error("Request aborted");
              x.name = "AbortError", N(x)
            }, "onAbort");
            if (typeof B.addEventListener === "function") {
              let x = B;
              x.addEventListener("abort", v, {
                once: !0
              }), y.once("close", () => x.removeEventListener("abort", v))
            } else B.onabort = v
          }
          y.on("frameError", (v, x, p) => {
            N(Error(`Frame type id ${v} in stream id ${p} has failed with code ${x}.`))
          }), y.on("error", N), y.on("aborted", () => {
            N(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${y.rstCode}.`))
          }), y.on("close", () => {
            if (w.unref(), Z) w.destroy();
            if (!J) N(Error("Unexpected error: http2 request did not get a response"))
          }), W = wU1(y, Q, G)
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
    },
    OH4 = class extends mAQ.Writable {
      constructor() {
        super(...arguments);
        this.bufferedBytes = []
      }
      static {
        ZZ(this, "Collector")
      }
      _write(A, Q, B) {
        this.bufferedBytes.push(A), B()
      }
    },
    RH4 = ZZ((A) => {
      if (TH4(A)) return pAQ(A);
      return new Promise((Q, B) => {
        let G = new OH4;
        A.pipe(G), A.on("error", (Z) => {
          G.end(), B(Z)
        }), G.on("error", B), G.on("finish", function() {
          let Z = new Uint8Array(Buffer.concat(this.bufferedBytes));
          Q(Z)
        })
      })
    }, "streamCollector"),
    TH4 = ZZ((A) => typeof ReadableStream === "function" && A instanceof ReadableStream, "isReadableStreamInstance");
  async function pAQ(A) {
    let Q = [],
      B = A.getReader(),
      G = !1,
      Z = 0;
    while (!G) {
      let {
        done: J,
        value: W
      } = await B.read();
      if (W) Q.push(W), Z += W.length;
      G = J
    }
    let I = new Uint8Array(Z),
      Y = 0;
    for (let J of Q) I.set(J, Y), Y += J.length;
    return I
  }
  ZZ(pAQ, "collectReadableStream")
})
// @from(Start 2318322, End 2321105)
Q1Q = z((dH7, A1Q) => {
  var {
    defineProperty: OfA,
    getOwnPropertyDescriptor: PH4,
    getOwnPropertyNames: jH4
  } = Object, SH4 = Object.prototype.hasOwnProperty, RfA = (A, Q) => OfA(A, "name", {
    value: Q,
    configurable: !0
  }), _H4 = (A, Q) => {
    for (var B in Q) OfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, kH4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jH4(Q))
        if (!SH4.call(A, Z) && Z !== B) OfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = PH4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yH4 = (A) => kH4(OfA({}, "__esModule", {
    value: !0
  }), A), iAQ = {};
  _H4(iAQ, {
    AlgorithmId: () => rAQ,
    EndpointURLScheme: () => sAQ,
    FieldPosition: () => oAQ,
    HttpApiKeyAuthLocation: () => aAQ,
    HttpAuthLocation: () => nAQ,
    IniSectionType: () => tAQ,
    RequestHandlerProtocol: () => eAQ,
    SMITHY_CONTEXT_KEY: () => hH4,
    getDefaultClientConfiguration: () => bH4,
    resolveDefaultRuntimeConfig: () => fH4
  });
  A1Q.exports = yH4(iAQ);
  var nAQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(nAQ || {}),
    aAQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(aAQ || {}),
    sAQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(sAQ || {}),
    rAQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(rAQ || {}),
    xH4 = RfA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    vH4 = RfA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    bH4 = RfA((A) => {
      return xH4(A)
    }, "getDefaultClientConfiguration"),
    fH4 = RfA((A) => {
      return vH4(A)
    }, "resolveDefaultRuntimeConfig"),
    oAQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(oAQ || {}),
    hH4 = "__smithy_context",
    tAQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(tAQ || {}),
    eAQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(eAQ || {})
})
// @from(Start 2321111, End 2325618)
J1Q = z((cH7, Y1Q) => {
  var {
    defineProperty: TfA,
    getOwnPropertyDescriptor: gH4,
    getOwnPropertyNames: uH4
  } = Object, mH4 = Object.prototype.hasOwnProperty, Yd = (A, Q) => TfA(A, "name", {
    value: Q,
    configurable: !0
  }), dH4 = (A, Q) => {
    for (var B in Q) TfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, cH4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of uH4(Q))
        if (!mH4.call(A, Z) && Z !== B) TfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = gH4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, pH4 = (A) => cH4(TfA({}, "__esModule", {
    value: !0
  }), A), B1Q = {};
  dH4(B1Q, {
    Field: () => nH4,
    Fields: () => aH4,
    HttpRequest: () => sH4,
    HttpResponse: () => rH4,
    IHttpRequest: () => G1Q.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => lH4,
    isValidHostname: () => I1Q,
    resolveHttpHandlerRuntimeConfig: () => iH4
  });
  Y1Q.exports = pH4(B1Q);
  var lH4 = Yd((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    iH4 = Yd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    G1Q = Q1Q(),
    nH4 = class {
      static {
        Yd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = G1Q.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    aH4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Yd(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    sH4 = class A {
      static {
        Yd(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = Z1Q(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function Z1Q(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Yd(Z1Q, "cloneQuery");
  var rH4 = class {
    static {
      Yd(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function I1Q(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Yd(I1Q, "isValidHostname")
})
// @from(Start 2325624, End 2326677)
F1Q = z((nH7, V1Q) => {
  var {
    defineProperty: PfA,
    getOwnPropertyDescriptor: oH4,
    getOwnPropertyNames: tH4
  } = Object, eH4 = Object.prototype.hasOwnProperty, qU1 = (A, Q) => PfA(A, "name", {
    value: Q,
    configurable: !0
  }), AC4 = (A, Q) => {
    for (var B in Q) PfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, QC4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of tH4(Q))
        if (!eH4.call(A, Z) && Z !== B) PfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = oH4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, BC4 = (A) => QC4(PfA({}, "__esModule", {
    value: !0
  }), A), W1Q = {};
  AC4(W1Q, {
    escapeUri: () => X1Q,
    escapeUriPath: () => ZC4
  });
  V1Q.exports = BC4(W1Q);
  var X1Q = qU1((A) => encodeURIComponent(A).replace(/[!'()*]/g, GC4), "escapeUri"),
    GC4 = qU1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    ZC4 = qU1((A) => A.split("/").map(X1Q).join("/"), "escapeUriPath")
})
// @from(Start 2326683, End 2327934)
C1Q = z((aH7, H1Q) => {
  var {
    defineProperty: jfA,
    getOwnPropertyDescriptor: IC4,
    getOwnPropertyNames: YC4
  } = Object, JC4 = Object.prototype.hasOwnProperty, WC4 = (A, Q) => jfA(A, "name", {
    value: Q,
    configurable: !0
  }), XC4 = (A, Q) => {
    for (var B in Q) jfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, VC4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of YC4(Q))
        if (!JC4.call(A, Z) && Z !== B) jfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = IC4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, FC4 = (A) => VC4(jfA({}, "__esModule", {
    value: !0
  }), A), K1Q = {};
  XC4(K1Q, {
    buildQueryString: () => D1Q
  });
  H1Q.exports = FC4(K1Q);
  var NU1 = F1Q();

  function D1Q(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = (0, NU1.escapeUri)(B), Array.isArray(G))
        for (let Z = 0, I = G.length; Z < I; Z++) Q.push(`${B}=${(0,NU1.escapeUri)(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${(0,NU1.escapeUri)(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  WC4(D1Q, "buildQueryString")
})
// @from(Start 2327940, End 2333905)
L1Q = z((sH7, N1Q) => {
  var {
    defineProperty: _fA,
    getOwnPropertyDescriptor: KC4,
    getOwnPropertyNames: DC4
  } = Object, HC4 = Object.prototype.hasOwnProperty, ES = (A, Q) => _fA(A, "name", {
    value: Q,
    configurable: !0
  }), CC4 = (A, Q) => {
    for (var B in Q) _fA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, EC4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of DC4(Q))
        if (!HC4.call(A, Z) && Z !== B) _fA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = KC4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, zC4 = (A) => EC4(_fA({}, "__esModule", {
    value: !0
  }), A), z1Q = {};
  CC4(z1Q, {
    FetchHttpHandler: () => $C4,
    keepAliveSupport: () => SfA,
    streamCollector: () => qC4
  });
  N1Q.exports = zC4(z1Q);
  var E1Q = J1Q(),
    UC4 = C1Q();

  function LU1(A, Q) {
    return new Request(A, Q)
  }
  ES(LU1, "createRequest");

  function U1Q(A = 0) {
    return new Promise((Q, B) => {
      if (A) setTimeout(() => {
        let G = Error(`Request did not complete within ${A} ms`);
        G.name = "TimeoutError", B(G)
      }, A)
    })
  }
  ES(U1Q, "requestTimeout");
  var SfA = {
      supported: void 0
    },
    $C4 = class A {
      static {
        ES(this, "FetchHttpHandler")
      }
      static create(Q) {
        if (typeof Q?.handle === "function") return Q;
        return new A(Q)
      }
      constructor(Q) {
        if (typeof Q === "function") this.configProvider = Q().then((B) => B || {});
        else this.config = Q ?? {}, this.configProvider = Promise.resolve(this.config);
        if (SfA.supported === void 0) SfA.supported = Boolean(typeof Request < "u" && "keepalive" in LU1("https://[::1]"))
      }
      destroy() {}
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) this.config = await this.configProvider;
        let G = this.config.requestTimeout,
          Z = this.config.keepAlive === !0,
          I = this.config.credentials;
        if (B?.aborted) {
          let U = Error("Request aborted");
          return U.name = "AbortError", Promise.reject(U)
        }
        let Y = Q.path,
          J = (0, UC4.buildQueryString)(Q.query || {});
        if (J) Y += `?${J}`;
        if (Q.fragment) Y += `#${Q.fragment}`;
        let W = "";
        if (Q.username != null || Q.password != null) {
          let U = Q.username ?? "",
            q = Q.password ?? "";
          W = `${U}:${q}@`
        }
        let {
          port: X,
          method: V
        } = Q, F = `${Q.protocol}//${W}${Q.hostname}${X?`:${X}`:""}${Y}`, K = V === "GET" || V === "HEAD" ? void 0 : Q.body, D = {
          body: K,
          headers: new Headers(Q.headers),
          method: V,
          credentials: I
        };
        if (this.config?.cache) D.cache = this.config.cache;
        if (K) D.duplex = "half";
        if (typeof AbortController < "u") D.signal = B;
        if (SfA.supported) D.keepalive = Z;
        if (typeof this.config.requestInit === "function") Object.assign(D, this.config.requestInit(Q));
        let H = ES(() => {}, "removeSignalEventListener"),
          C = LU1(F, D),
          E = [fetch(C).then((U) => {
            let q = U.headers,
              w = {};
            for (let R of q.entries()) w[R[0]] = R[1];
            if (U.body == null) return U.blob().then((R) => ({
              response: new E1Q.HttpResponse({
                headers: w,
                reason: U.statusText,
                statusCode: U.status,
                body: R
              })
            }));
            return {
              response: new E1Q.HttpResponse({
                headers: w,
                reason: U.statusText,
                statusCode: U.status,
                body: U.body
              })
            }
          }), U1Q(G)];
        if (B) E.push(new Promise((U, q) => {
          let w = ES(() => {
            let N = Error("Request aborted");
            N.name = "AbortError", q(N)
          }, "onAbort");
          if (typeof B.addEventListener === "function") {
            let N = B;
            N.addEventListener("abort", w, {
              once: !0
            }), H = ES(() => N.removeEventListener("abort", w), "removeSignalEventListener")
          } else B.onabort = w
        }));
        return Promise.race(E).finally(H)
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return G[Q] = B, G
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
    },
    wC4 = v4A(),
    qC4 = ES(async (A) => {
      if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
        if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
        return $1Q(A)
      }
      return w1Q(A)
    }, "streamCollector");
  async function $1Q(A) {
    let Q = await q1Q(A),
      B = (0, wC4.fromBase64)(Q);
    return new Uint8Array(B)
  }
  ES($1Q, "collectBlob");
  async function w1Q(A) {
    let Q = [],
      B = A.getReader(),
      G = !1,
      Z = 0;
    while (!G) {
      let {
        done: J,
        value: W
      } = await B.read();
      if (W) Q.push(W), Z += W.length;
      G = J
    }
    let I = new Uint8Array(Z),
      Y = 0;
    for (let J of Q) I.set(J, Y), Y += J.length;
    return I
  }
  ES(w1Q, "collectStream");

  function q1Q(A) {
    return new Promise((Q, B) => {
      let G = new FileReader;
      G.onloadend = () => {
        if (G.readyState !== 2) return B(Error("Reader aborted too early"));
        let Z = G.result ?? "",
          I = Z.indexOf(","),
          Y = I > -1 ? I + 1 : Z.length;
        Q(Z.substring(Y))
      }, G.onabort = () => B(Error("Read aborted")), G.onerror = () => B(G.error), G.readAsDataURL(A)
    })
  }
  ES(q1Q, "readToBase64")
})
// @from(Start 2333911, End 2335436)
Jd = z((rH7, j1Q) => {
  var {
    defineProperty: kfA,
    getOwnPropertyDescriptor: NC4,
    getOwnPropertyNames: LC4
  } = Object, MC4 = Object.prototype.hasOwnProperty, M1Q = (A, Q) => kfA(A, "name", {
    value: Q,
    configurable: !0
  }), OC4 = (A, Q) => {
    for (var B in Q) kfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, RC4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of LC4(Q))
        if (!MC4.call(A, Z) && Z !== B) kfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = NC4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, TC4 = (A) => RC4(kfA({}, "__esModule", {
    value: !0
  }), A), O1Q = {};
  OC4(O1Q, {
    fromHex: () => T1Q,
    toHex: () => P1Q
  });
  j1Q.exports = TC4(O1Q);
  var R1Q = {},
    MU1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    R1Q[A] = Q, MU1[Q] = A
  }

  function T1Q(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in MU1) Q[B / 2] = MU1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }
  M1Q(T1Q, "fromHex");

  function P1Q(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += R1Q[A[B]];
    return Q
  }
  M1Q(P1Q, "toHex")
})
// @from(Start 2335442, End 2337487)
v1Q = z((y1Q) => {
  Object.defineProperty(y1Q, "__esModule", {
    value: !0
  });
  y1Q.sdkStreamMixin = void 0;
  var PC4 = L1Q(),
    jC4 = v4A(),
    SC4 = Jd(),
    _C4 = O2(),
    S1Q = Zd(),
    _1Q = "The stream has already been transformed.",
    kC4 = (A) => {
      var Q, B;
      if (!k1Q(A) && !(0, S1Q.isReadableStream)(A)) {
        let Y = ((B = (Q = A === null || A === void 0 ? void 0 : A.__proto__) === null || Q === void 0 ? void 0 : Q.constructor) === null || B === void 0 ? void 0 : B.name) || A;
        throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${Y}`)
      }
      let G = !1,
        Z = async () => {
          if (G) throw Error(_1Q);
          return G = !0, await (0, PC4.streamCollector)(A)
        }, I = (Y) => {
          if (typeof Y.stream !== "function") throw Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
          return Y.stream()
        };
      return Object.assign(A, {
        transformToByteArray: Z,
        transformToString: async (Y) => {
          let J = await Z();
          if (Y === "base64") return (0, jC4.toBase64)(J);
          else if (Y === "hex") return (0, SC4.toHex)(J);
          else if (Y === void 0 || Y === "utf8" || Y === "utf-8") return (0, _C4.toUtf8)(J);
          else if (typeof TextDecoder === "function") return new TextDecoder(Y).decode(J);
          else throw Error("TextDecoder is not available, please make sure polyfill is provided.")
        },
        transformToWebStream: () => {
          if (G) throw Error(_1Q);
          if (G = !0, k1Q(A)) return I(A);
          else if ((0, S1Q.isReadableStream)(A)) return A;
          else throw Error(`Cannot transform payload to web stream, got ${A}`)
        }
      })
    };
  y1Q.sdkStreamMixin = kC4;
  var k1Q = (A) => typeof Blob === "function" && A instanceof Blob
})
// @from(Start 2337493, End 2339076)
g1Q = z((f1Q) => {
  Object.defineProperty(f1Q, "__esModule", {
    value: !0
  });
  f1Q.sdkStreamMixin = void 0;
  var yC4 = IZ(),
    xC4 = hI(),
    OU1 = UA("stream"),
    vC4 = v1Q(),
    b1Q = "The stream has already been transformed.",
    bC4 = (A) => {
      var Q, B;
      if (!(A instanceof OU1.Readable)) try {
        return (0, vC4.sdkStreamMixin)(A)
      } catch (I) {
        let Y = ((B = (Q = A === null || A === void 0 ? void 0 : A.__proto__) === null || Q === void 0 ? void 0 : Q.constructor) === null || B === void 0 ? void 0 : B.name) || A;
        throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${Y}`)
      }
      let G = !1,
        Z = async () => {
          if (G) throw Error(b1Q);
          return G = !0, await (0, yC4.streamCollector)(A)
        };
      return Object.assign(A, {
        transformToByteArray: Z,
        transformToString: async (I) => {
          let Y = await Z();
          if (I === void 0 || Buffer.isEncoding(I)) return (0, xC4.fromArrayBuffer)(Y.buffer, Y.byteOffset, Y.byteLength).toString(I);
          else return new TextDecoder(I).decode(Y)
        },
        transformToWebStream: () => {
          if (G) throw Error(b1Q);
          if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
          if (typeof OU1.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
          return G = !0, OU1.Readable.toWeb(A)
        }
      })
    };
  f1Q.sdkStreamMixin = bC4
})
// @from(Start 2339082, End 2339298)
m1Q = z((u1Q) => {
  Object.defineProperty(u1Q, "__esModule", {
    value: !0
  });
  u1Q.splitStream = fC4;
  async function fC4(A) {
    if (typeof A.stream === "function") A = A.stream();
    return A.tee()
  }
})
// @from(Start 2339304, End 2339700)
l1Q = z((p1Q) => {
  Object.defineProperty(p1Q, "__esModule", {
    value: !0
  });
  p1Q.splitStream = uC4;
  var d1Q = UA("stream"),
    gC4 = m1Q(),
    c1Q = Zd();
  async function uC4(A) {
    if ((0, c1Q.isReadableStream)(A) || (0, c1Q.isBlob)(A)) return (0, gC4.splitStream)(A);
    let Q = new d1Q.PassThrough,
      B = new d1Q.PassThrough;
    return A.pipe(Q), A.pipe(B), [Q, B]
  }
})
// @from(Start 2339706, End 2341653)
Xd = z((QC7, US) => {
  var {
    defineProperty: yfA,
    getOwnPropertyDescriptor: dC4,
    getOwnPropertyNames: cC4
  } = Object, pC4 = Object.prototype.hasOwnProperty, PU1 = (A, Q) => yfA(A, "name", {
    value: Q,
    configurable: !0
  }), lC4 = (A, Q) => {
    for (var B in Q) yfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, RU1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of cC4(Q))
        if (!pC4.call(A, Z) && Z !== B) yfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = dC4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Wd = (A, Q, B) => (RU1(A, Q, "default"), B && RU1(B, Q, "default")), iC4 = (A) => RU1(yfA({}, "__esModule", {
    value: !0
  }), A), zS = {};
  lC4(zS, {
    Uint8ArrayBlobAdapter: () => TU1
  });
  US.exports = iC4(zS);
  var i1Q = v4A(),
    n1Q = O2();

  function a1Q(A, Q = "utf-8") {
    if (Q === "base64") return (0, i1Q.toBase64)(A);
    return (0, n1Q.toUtf8)(A)
  }
  PU1(a1Q, "transformToString");

  function s1Q(A, Q) {
    if (Q === "base64") return TU1.mutate((0, i1Q.fromBase64)(A));
    return TU1.mutate((0, n1Q.fromUtf8)(A))
  }
  PU1(s1Q, "transformFromString");
  var TU1 = class A extends Uint8Array {
    static {
      PU1(this, "Uint8ArrayBlobAdapter")
    }
    static fromString(Q, B = "utf-8") {
      switch (typeof Q) {
        case "string":
          return s1Q(Q, B);
        default:
          throw Error(`Unsupported conversion from ${typeof Q} to Uint8ArrayBlobAdapter.`)
      }
    }
    static mutate(Q) {
      return Object.setPrototypeOf(Q, A.prototype), Q
    }
    transformToString(Q = "utf-8") {
      return a1Q(this, Q)
    }
  };
  Wd(zS, HU1(), US.exports);
  Wd(zS, ue0(), US.exports);
  Wd(zS, te0(), US.exports);
  Wd(zS, QAQ(), US.exports);
  Wd(zS, JAQ(), US.exports);
  Wd(zS, g1Q(), US.exports);
  Wd(zS, l1Q(), US.exports);
  Wd(zS, Zd(), US.exports)
})
// @from(Start 2341659, End 2356448)
b4 = z((BC7, Q0Q) => {
  var {
    defineProperty: SU1,
    getOwnPropertyDescriptor: nC4,
    getOwnPropertyNames: aC4
  } = Object, sC4 = Object.prototype.hasOwnProperty, rC4 = (A, Q) => {
    for (var B in Q) SU1(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, oC4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of aC4(Q))
        if (!sC4.call(A, Z) && Z !== B) SU1(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = nC4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, tC4 = (A) => oC4(SU1({}, "__esModule", {
    value: !0
  }), A), r1Q = {};
  rC4(r1Q, {
    ErrorSchema: () => A0Q,
    ListSchema: () => _U1,
    MapSchema: () => kU1,
    NormalizedSchema: () => FE4,
    OperationSchema: () => e1Q,
    SCHEMA: () => XW,
    Schema: () => f4A,
    SimpleSchema: () => yU1,
    StructureSchema: () => xfA,
    TypeRegistry: () => _r,
    deref: () => fDA,
    deserializerMiddlewareOption: () => o1Q,
    error: () => XE4,
    getSchemaSerdePlugin: () => ZE4,
    list: () => IE4,
    map: () => YE4,
    op: () => JE4,
    serializerMiddlewareOption: () => t1Q,
    sim: () => VE4,
    struct: () => WE4
  });
  Q0Q.exports = tC4(r1Q);
  var fDA = (A) => {
      if (typeof A === "function") return A();
      return A
    },
    eC4 = Sr(),
    AE4 = w7(),
    QE4 = (A) => (Q, B) => async (G) => {
      let {
        response: Z
      } = await Q(G), {
        operationSchema: I
      } = (0, AE4.getSmithyContext)(B);
      try {
        let Y = await A.protocol.deserializeResponse(I, {
          ...A,
          ...B
        }, Z);
        return {
          response: Z,
          output: Y
        }
      } catch (Y) {
        if (Object.defineProperty(Y, "$response", {
            value: Z
          }), !("$metadata" in Y)) {
          try {
            Y.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
          } catch (W) {
            if (!B.logger || B.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
            else B.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
          }
          if (typeof Y.$responseBodyText < "u") {
            if (Y.$response) Y.$response.body = Y.$responseBodyText
          }
          try {
            if (eC4.HttpResponse.isInstance(Z)) {
              let {
                headers: W = {}
              } = Z, X = Object.entries(W);
              Y.$metadata = {
                httpStatusCode: Z.statusCode,
                requestId: jU1(/^x-[\w-]+-request-?id$/, X),
                extendedRequestId: jU1(/^x-[\w-]+-id-2$/, X),
                cfId: jU1(/^x-[\w-]+-cf-id$/, X)
              }
            }
          } catch (W) {}
        }
        throw Y
      }
    }, jU1 = (A, Q) => {
      return (Q.find(([B]) => {
        return B.match(A)
      }) || [void 0, void 0])[1]
    }, BE4 = w7(), GE4 = (A) => (Q, B) => async (G) => {
      let {
        operationSchema: Z
      } = (0, BE4.getSmithyContext)(B), I = B.endpointV2?.url && A.urlParser ? async () => A.urlParser(B.endpointV2.url): A.endpoint, Y = await A.protocol.serializeRequest(Z, G.input, {
        ...A,
        ...B,
        endpoint: I
      });
      return Q({
        ...G,
        request: Y
      })
    }, o1Q = {
      name: "deserializerMiddleware",
      step: "deserialize",
      tags: ["DESERIALIZER"],
      override: !0
    }, t1Q = {
      name: "serializerMiddleware",
      step: "serialize",
      tags: ["SERIALIZER"],
      override: !0
    };

  function ZE4(A) {
    return {
      applyToStack: (Q) => {
        Q.add(GE4(A), t1Q), Q.add(QE4(A), o1Q), A.protocol.setSerdeContext(A)
      }
    }
  }
  var _r = class A {
      constructor(Q, B = new Map) {
        this.namespace = Q, this.schemas = B
      }
      static {
        this.registries = new Map
      }
      static
      for (Q) {
        if (!A.registries.has(Q)) A.registries.set(Q, new A(Q));
        return A.registries.get(Q)
      }
      register(Q, B) {
        let G = this.normalizeShapeId(Q);
        A.for(this.getNamespace(Q)).schemas.set(G, B)
      }
      getSchema(Q) {
        let B = this.normalizeShapeId(Q);
        if (!this.schemas.has(B)) throw Error(`@smithy/core/schema - schema not found for ${B}`);
        return this.schemas.get(B)
      }
      getBaseException() {
        for (let [Q, B] of this.schemas.entries())
          if (Q.startsWith("smithy.ts.sdk.synthetic.") && Q.endsWith("ServiceException")) return B;
        return
      }
      find(Q) {
        return [...this.schemas.values()].find(Q)
      }
      destroy() {
        A.registries.delete(this.namespace), this.schemas.clear()
      }
      normalizeShapeId(Q) {
        if (Q.includes("#")) return Q;
        return this.namespace + "#" + Q
      }
      getNamespace(Q) {
        return this.normalizeShapeId(Q).split("#")[0]
      }
    },
    f4A = class {
      constructor(A, Q) {
        this.name = A, this.traits = Q
      }
    },
    _U1 = class extends f4A {
      constructor(A, Q, B) {
        super(A, Q);
        this.name = A, this.traits = Q, this.valueSchema = B
      }
    };

  function IE4(A, Q, B = {}, G) {
    let Z = new _U1(A + "#" + Q, B, typeof G === "function" ? G() : G);
    return _r.for(A).register(Q, Z), Z
  }
  var kU1 = class extends f4A {
    constructor(A, Q, B, G) {
      super(A, Q);
      this.name = A, this.traits = Q, this.keySchema = B, this.valueSchema = G
    }
  };

  function YE4(A, Q, B = {}, G, Z) {
    let I = new kU1(A + "#" + Q, B, G, typeof Z === "function" ? Z() : Z);
    return _r.for(A).register(Q, I), I
  }
  var e1Q = class extends f4A {
    constructor(A, Q, B, G) {
      super(A, Q);
      this.name = A, this.traits = Q, this.input = B, this.output = G
    }
  };

  function JE4(A, Q, B = {}, G, Z) {
    let I = new e1Q(A + "#" + Q, B, G, Z);
    return _r.for(A).register(Q, I), I
  }
  var xfA = class extends f4A {
    constructor(A, Q, B, G) {
      super(A, Q);
      this.name = A, this.traits = Q, this.memberNames = B, this.memberList = G, this.members = {};
      for (let Z = 0; Z < B.length; ++Z) this.members[B[Z]] = Array.isArray(G[Z]) ? G[Z] : [G[Z], 0]
    }
  };

  function WE4(A, Q, B, G, Z) {
    let I = new xfA(A + "#" + Q, B, G, Z);
    return _r.for(A).register(Q, I), I
  }
  var A0Q = class extends xfA {
    constructor(A, Q, B, G, Z) {
      super(A, Q, B, G);
      this.name = A, this.traits = Q, this.memberNames = B, this.memberList = G, this.ctor = Z
    }
  };

  function XE4(A, Q, B = {}, G, Z, I) {
    let Y = new A0Q(A + "#" + Q, B, G, Z, I);
    return _r.for(A).register(Q, Y), Y
  }
  var XW = {
      BLOB: 21,
      STREAMING_BLOB: 42,
      BOOLEAN: 2,
      STRING: 0,
      NUMERIC: 1,
      BIG_INTEGER: 17,
      BIG_DECIMAL: 19,
      DOCUMENT: 15,
      TIMESTAMP_DEFAULT: 4,
      TIMESTAMP_DATE_TIME: 5,
      TIMESTAMP_HTTP_DATE: 6,
      TIMESTAMP_EPOCH_SECONDS: 7,
      LIST_MODIFIER: 64,
      MAP_MODIFIER: 128
    },
    yU1 = class extends f4A {
      constructor(A, Q, B) {
        super(A, B);
        this.name = A, this.schemaRef = Q, this.traits = B
      }
    };

  function VE4(A, Q, B, G) {
    let Z = new yU1(A + "#" + Q, B, G);
    return _r.for(A).register(Q, Z), Z
  }
  var FE4 = class A {
    constructor(Q, B) {
      this.ref = Q, this.memberName = B;
      let G = [],
        Z = Q,
        I = Q;
      this._isMemberSchema = !1;
      while (Array.isArray(Z)) G.push(Z[1]), Z = Z[0], I = fDA(Z), this._isMemberSchema = !0;
      if (G.length > 0) {
        this.memberTraits = {};
        for (let Y = G.length - 1; Y >= 0; --Y) {
          let J = G[Y];
          Object.assign(this.memberTraits, A.translateTraits(J))
        }
      } else this.memberTraits = 0;
      if (I instanceof A) {
        this.name = I.name, this.traits = I.traits, this._isMemberSchema = I._isMemberSchema, this.schema = I.schema, this.memberTraits = Object.assign({}, I.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.ref = I.ref, this.memberName = B ?? I.memberName;
        return
      }
      if (this.schema = fDA(I), this.schema && typeof this.schema === "object") this.traits = this.schema?.traits ?? {};
      else this.traits = 0;
      if (this.name = (typeof this.schema === "object" ? this.schema?.name : void 0) ?? this.memberName ?? this.getSchemaName(), this._isMemberSchema && !B) throw Error(`@smithy/core/schema - NormalizedSchema member schema ${this.getName(!0)} must initialize with memberName argument.`)
    }
    static of (Q, B) {
      if (Q instanceof A) return Q;
      return new A(Q, B)
    }
    static translateTraits(Q) {
      if (typeof Q === "object") return Q;
      Q = Q | 0;
      let B = {};
      if ((Q & 1) === 1) B.httpLabel = 1;
      if ((Q >> 1 & 1) === 1) B.idempotent = 1;
      if ((Q >> 2 & 1) === 1) B.idempotencyToken = 1;
      if ((Q >> 3 & 1) === 1) B.sensitive = 1;
      if ((Q >> 4 & 1) === 1) B.httpPayload = 1;
      if ((Q >> 5 & 1) === 1) B.httpResponseCode = 1;
      if ((Q >> 6 & 1) === 1) B.httpQueryParams = 1;
      return B
    }
    static memberFrom(Q, B) {
      if (Q instanceof A) return Q.memberName = B, Q._isMemberSchema = !0, Q;
      return new A(Q, B)
    }
    getSchema() {
      if (this.schema instanceof A) return this.schema = this.schema.getSchema();
      if (this.schema instanceof yU1) return fDA(this.schema.schemaRef);
      return fDA(this.schema)
    }
    getName(Q = !1) {
      if (!Q) {
        if (this.name && this.name.includes("#")) return this.name.split("#")[1]
      }
      return this.name || void 0
    }
    getMemberName() {
      if (!this.isMemberSchema()) throw Error(`@smithy/core/schema - cannot get member name on non-member schema: ${this.getName(!0)}`);
      return this.memberName
    }
    isMemberSchema() {
      return this._isMemberSchema
    }
    isUnitSchema() {
      return this.getSchema() === "unit"
    }
    isListSchema() {
      let Q = this.getSchema();
      if (typeof Q === "number") return Q >= XW.LIST_MODIFIER && Q < XW.MAP_MODIFIER;
      return Q instanceof _U1
    }
    isMapSchema() {
      let Q = this.getSchema();
      if (typeof Q === "number") return Q >= XW.MAP_MODIFIER && Q <= 255;
      return Q instanceof kU1
    }
    isDocumentSchema() {
      return this.getSchema() === XW.DOCUMENT
    }
    isStructSchema() {
      let Q = this.getSchema();
      return Q !== null && typeof Q === "object" && "members" in Q || Q instanceof xfA
    }
    isBlobSchema() {
      return this.getSchema() === XW.BLOB || this.getSchema() === XW.STREAMING_BLOB
    }
    isTimestampSchema() {
      let Q = this.getSchema();
      return typeof Q === "number" && Q >= XW.TIMESTAMP_DEFAULT && Q <= XW.TIMESTAMP_EPOCH_SECONDS
    }
    isStringSchema() {
      return this.getSchema() === XW.STRING
    }
    isBooleanSchema() {
      return this.getSchema() === XW.BOOLEAN
    }
    isNumericSchema() {
      return this.getSchema() === XW.NUMERIC
    }
    isBigIntegerSchema() {
      return this.getSchema() === XW.BIG_INTEGER
    }
    isBigDecimalSchema() {
      return this.getSchema() === XW.BIG_DECIMAL
    }
    isStreaming() {
      if (!!this.getMergedTraits().streaming) return !0;
      return this.getSchema() === XW.STREAMING_BLOB
    }
    getMergedTraits() {
      if (this.normalizedTraits) return this.normalizedTraits;
      return this.normalizedTraits = {
        ...this.getOwnTraits(),
        ...this.getMemberTraits()
      }, this.normalizedTraits
    }
    getMemberTraits() {
      return A.translateTraits(this.memberTraits)
    }
    getOwnTraits() {
      return A.translateTraits(this.traits)
    }
    getKeySchema() {
      if (this.isDocumentSchema()) return A.memberFrom([XW.DOCUMENT, 0], "key");
      if (!this.isMapSchema()) throw Error(`@smithy/core/schema - cannot get key schema for non-map schema: ${this.getName(!0)}`);
      let Q = this.getSchema();
      if (typeof Q === "number") return A.memberFrom([63 & Q, 0], "key");
      return A.memberFrom([Q.keySchema, 0], "key")
    }
    getValueSchema() {
      let Q = this.getSchema();
      if (typeof Q === "number") {
        if (this.isMapSchema()) return A.memberFrom([63 & Q, 0], "value");
        else if (this.isListSchema()) return A.memberFrom([63 & Q, 0], "member")
      }
      if (Q && typeof Q === "object") {
        if (this.isStructSchema()) throw Error(`cannot call getValueSchema() with StructureSchema ${this.getName(!0)}`);
        let B = Q;
        if ("valueSchema" in B) {
          if (this.isMapSchema()) return A.memberFrom([B.valueSchema, 0], "value");
          else if (this.isListSchema()) return A.memberFrom([B.valueSchema, 0], "member")
        }
      }
      if (this.isDocumentSchema()) return A.memberFrom([XW.DOCUMENT, 0], "value");
      throw Error(`@smithy/core/schema - the schema ${this.getName(!0)} does not have a value member.`)
    }
    getMemberSchema(Q) {
      if (this.isStructSchema()) {
        let B = this.getSchema();
        if (!(Q in B.members)) throw Error(`@smithy/core/schema - the schema ${this.getName(!0)} does not have a member with name=${Q}.`);
        return A.memberFrom(B.members[Q], Q)
      }
      if (this.isDocumentSchema()) return A.memberFrom([XW.DOCUMENT, 0], Q);
      throw Error(`@smithy/core/schema - the schema ${this.getName(!0)} does not have members.`)
    }
    getMemberSchemas() {
      let {
        schema: Q
      } = this, B = Q;
      if (!B || typeof B !== "object") return {};
      if ("members" in B) {
        let G = {};
        for (let Z of B.memberNames) G[Z] = this.getMemberSchema(Z);
        return G
      }
      return {}
    }* structIterator() {
      if (this.isUnitSchema()) return;
      if (!this.isStructSchema()) throw Error("@smithy/core/schema - cannot acquire structIterator on non-struct schema.");
      let Q = this.getSchema();
      for (let B = 0; B < Q.memberNames.length; ++B) yield [Q.memberNames[B], A.memberFrom([Q.memberList[B], 0], Q.memberNames[B])]
    }
    getSchemaName() {
      let Q = this.getSchema();
      if (typeof Q === "number") {
        let B = 63 & Q,
          G = 192 & Q,
          Z = Object.entries(XW).find(([, I]) => {
            return I === B
          })?.[0] ?? "Unknown";
        switch (G) {
          case XW.MAP_MODIFIER:
            return `${Z}Map`;
          case XW.LIST_MODIFIER:
            return `${Z}List`;
          case 0:
            return Z
        }
      }
      return "Unknown"
    }
  }
})
// @from(Start 2356454, End 2373150)
s6 = z((VC7, X0Q) => {
  var {
    defineProperty: hU1,
    getOwnPropertyDescriptor: KE4,
    getOwnPropertyNames: DE4
  } = Object, HE4 = Object.prototype.hasOwnProperty, CE4 = (A, Q) => {
    for (var B in Q) hU1(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, EE4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of DE4(Q))
        if (!HE4.call(A, Z) && Z !== B) hU1(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = KE4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, zE4 = (A) => EE4(hU1({}, "__esModule", {
    value: !0
  }), A), B0Q = {};
  CE4(B0Q, {
    LazyJsonString: () => kr,
    NumericValue: () => W0Q,
    copyDocumentWithTransform: () => hDA,
    dateToUtcString: () => vE4,
    expectBoolean: () => wE4,
    expectByte: () => fU1,
    expectFloat32: () => vfA,
    expectInt: () => NE4,
    expectInt32: () => vU1,
    expectLong: () => mDA,
    expectNonNull: () => ME4,
    expectNumber: () => uDA,
    expectObject: () => G0Q,
    expectShort: () => bU1,
    expectString: () => OE4,
    expectUnion: () => RE4,
    handleFloat: () => jE4,
    limitedParseDouble: () => mU1,
    limitedParseFloat: () => SE4,
    limitedParseFloat32: () => _E4,
    logger: () => dDA,
    nv: () => Bz4,
    parseBoolean: () => $E4,
    parseEpochTimestamp: () => pE4,
    parseRfc3339DateTime: () => fE4,
    parseRfc3339DateTimeWithOffset: () => gE4,
    parseRfc7231DateTime: () => cE4,
    quoteHeader: () => eE4,
    splitEvery: () => Az4,
    splitHeader: () => Qz4,
    strictParseByte: () => J0Q,
    strictParseDouble: () => uU1,
    strictParseFloat: () => TE4,
    strictParseFloat32: () => Z0Q,
    strictParseInt: () => kE4,
    strictParseInt32: () => yE4,
    strictParseLong: () => Y0Q,
    strictParseShort: () => h4A
  });
  X0Q.exports = zE4(B0Q);
  var UE4 = b4(),
    hDA = (A, Q, B = (G) => G) => {
      let G = UE4.NormalizedSchema.of(Q);
      switch (typeof A) {
        case "undefined":
        case "boolean":
        case "number":
        case "string":
        case "bigint":
        case "symbol":
          return B(A, G);
        case "function":
        case "object":
          if (A === null) return B(null, G);
          if (Array.isArray(A)) {
            let I = Array(A.length),
              Y = 0;
            for (let J of A) I[Y++] = hDA(J, G.getValueSchema(), B);
            return B(I, G)
          }
          if ("byteLength" in A) {
            let I = new Uint8Array(A.byteLength);
            return I.set(A, 0), B(I, G)
          }
          if (A instanceof Date) return B(A, G);
          let Z = {};
          if (G.isMapSchema())
            for (let I of Object.keys(A)) Z[I] = hDA(A[I], G.getValueSchema(), B);
          else if (G.isStructSchema())
            for (let [I, Y] of G.structIterator()) Z[I] = hDA(A[I], Y, B);
          else if (G.isDocumentSchema())
            for (let I of Object.keys(A)) Z[I] = hDA(A[I], G.getValueSchema(), B);
          return B(Z, G);
        default:
          return B(A, G)
      }
    },
    $E4 = (A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    },
    wE4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) dDA.warn(bfA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") dDA.warn(bfA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    },
    uDA = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) dDA.warn(bfA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    },
    qE4 = Math.ceil(340282346638528860000000000000000000000),
    vfA = (A) => {
      let Q = uDA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > qE4) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    },
    mDA = (A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    },
    NE4 = mDA,
    vU1 = (A) => gU1(A, 32),
    bU1 = (A) => gU1(A, 16),
    fU1 = (A) => gU1(A, 8),
    gU1 = (A, Q) => {
      let B = mDA(A);
      if (B !== void 0 && LE4(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    },
    LE4 = (A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    },
    ME4 = (A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    },
    G0Q = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    },
    OE4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return dDA.warn(bfA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    },
    RE4 = (A) => {
      if (A === null || A === void 0) return;
      let Q = G0Q(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    },
    uU1 = (A) => {
      if (typeof A == "string") return uDA(u4A(A));
      return uDA(A)
    },
    TE4 = uU1,
    Z0Q = (A) => {
      if (typeof A == "string") return vfA(u4A(A));
      return vfA(A)
    },
    PE4 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    u4A = (A) => {
      let Q = A.match(PE4);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    },
    mU1 = (A) => {
      if (typeof A == "string") return I0Q(A);
      return uDA(A)
    },
    jE4 = mU1,
    SE4 = mU1,
    _E4 = (A) => {
      if (typeof A == "string") return I0Q(A);
      return vfA(A)
    },
    I0Q = (A) => {
      switch (A) {
        case "NaN":
          return NaN;
        case "Infinity":
          return 1 / 0;
        case "-Infinity":
          return -1 / 0;
        default:
          throw Error(`Unable to parse float value: ${A}`)
      }
    },
    Y0Q = (A) => {
      if (typeof A === "string") return mDA(u4A(A));
      return mDA(A)
    },
    kE4 = Y0Q,
    yE4 = (A) => {
      if (typeof A === "string") return vU1(u4A(A));
      return vU1(A)
    },
    h4A = (A) => {
      if (typeof A === "string") return bU1(u4A(A));
      return bU1(A)
    },
    J0Q = (A) => {
      if (typeof A === "string") return fU1(u4A(A));
      return fU1(A)
    },
    bfA = (A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    },
    dDA = {
      warn: console.warn
    },
    xE4 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dU1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function vE4(A) {
    let Q = A.getUTCFullYear(),
      B = A.getUTCMonth(),
      G = A.getUTCDay(),
      Z = A.getUTCDate(),
      I = A.getUTCHours(),
      Y = A.getUTCMinutes(),
      J = A.getUTCSeconds(),
      W = Z < 10 ? `0${Z}` : `${Z}`,
      X = I < 10 ? `0${I}` : `${I}`,
      V = Y < 10 ? `0${Y}` : `${Y}`,
      F = J < 10 ? `0${J}` : `${J}`;
    return `${xE4[G]}, ${W} ${dU1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  var bE4 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    fE4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = bE4.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = h4A(g4A(G)), F = $S(Z, "month", 1, 12), K = $S(I, "day", 1, 31);
      return gDA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    },
    hE4 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    gE4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = hE4.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = h4A(g4A(G)), K = $S(Z, "month", 1, 12), D = $S(I, "day", 1, 31), H = gDA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - tE4(V));
      return H
    },
    uE4 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    mE4 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    dE4 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    cE4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = uE4.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return gDA(h4A(g4A(I)), xU1(Z), $S(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = mE4.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return nE4(gDA(lE4(I), xU1(Z), $S(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = dE4.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return gDA(h4A(g4A(X)), xU1(G), $S(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    },
    pE4 = (A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = uU1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    },
    gDA = (A, Q, B, G) => {
      let Z = Q - 1;
      return sE4(A, Z, B), new Date(Date.UTC(A, Z, B, $S(G.hours, "hour", 0, 23), $S(G.minutes, "minute", 0, 59), $S(G.seconds, "seconds", 0, 60), oE4(G.fractionalMilliseconds)))
    },
    lE4 = (A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + h4A(g4A(A));
      if (B < Q) return B + 100;
      return B
    },
    iE4 = 1576800000000,
    nE4 = (A) => {
      if (A.getTime() - new Date().getTime() > iE4) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    },
    xU1 = (A) => {
      let Q = dU1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    },
    aE4 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    sE4 = (A, Q, B) => {
      let G = aE4[Q];
      if (Q === 1 && rE4(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${dU1[Q]} in ${A}: ${B}`)
    },
    rE4 = (A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    },
    $S = (A, Q, B, G) => {
      let Z = J0Q(g4A(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    },
    oE4 = (A) => {
      if (A === null || A === void 0) return 0;
      return Z0Q("0." + A) * 1000
    },
    tE4 = (A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    },
    g4A = (A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    },
    kr = function(Q) {
      return Object.assign(new String(Q), {
        deserializeJSON() {
          return JSON.parse(String(Q))
        },
        toString() {
          return String(Q)
        },
        toJSON() {
          return String(Q)
        }
      })
    };
  kr.from = (A) => {
    if (A && typeof A === "object" && (A instanceof kr || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return kr(String(A));
    return kr(JSON.stringify(A))
  };
  kr.fromObject = kr.from;

  function eE4(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }

  function Az4(A, Q, B) {
    if (B <= 0 || !Number.isInteger(B)) throw Error("Invalid number of delimiters (" + B + ") for splitEvery.");
    let G = A.split(Q);
    if (B === 1) return G;
    let Z = [],
      I = "";
    for (let Y = 0; Y < G.length; Y++) {
      if (I === "") I = G[Y];
      else I += Q + G[Y];
      if ((Y + 1) % B === 0) Z.push(I), I = ""
    }
    if (I !== "") Z.push(I);
    return Z
  }
  var Qz4 = (A) => {
      let Q = A.length,
        B = [],
        G = !1,
        Z = void 0,
        I = 0;
      for (let Y = 0; Y < Q; ++Y) {
        let J = A[Y];
        switch (J) {
          case '"':
            if (Z !== "\\") G = !G;
            break;
          case ",":
            if (!G) B.push(A.slice(I, Y)), I = Y + 1;
            break;
          default:
        }
        Z = J
      }
      return B.push(A.slice(I)), B.map((Y) => {
        Y = Y.trim();
        let J = Y.length;
        if (J < 2) return Y;
        if (Y[0] === '"' && Y[J - 1] === '"') Y = Y.slice(1, J - 1);
        return Y.replace(/\\"/g, '"')
      })
    },
    W0Q = class {
      constructor(A, Q) {
        this.string = A, this.type = Q;
        let B = 0;
        for (let G = 0; G < A.length; ++G) {
          let Z = A.charCodeAt(G);
          if (G === 0 && Z === 45) continue;
          if (Z === 46) {
            if (B) throw Error("@smithy/core/serde - NumericValue must contain at most one decimal point.");
            B = 1;
            continue
          }
          if (Z < 48 || Z > 57) throw Error('@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".')
        }
      }
      toString() {
        return this.string
      } [Symbol.hasInstance](A) {
        if (!A || typeof A !== "object") return !1;
        let Q = A;
        if (typeof Q.string === "string" && typeof Q.type === "string" && Q.constructor?.name === "NumericValue") return !0;
        return !1
      }
    };

  function Bz4(A) {
    return new W0Q(String(A), "bigDecimal")
  }
})
// @from(Start 2373156, End 2373643)
K0Q = z((V0Q) => {
  Object.defineProperty(V0Q, "__esModule", {
    value: !0
  });
  V0Q.fromBase64 = void 0;
  var Gz4 = hI(),
    Zz4 = /^[A-Za-z0-9+/]*={0,2}$/,
    Iz4 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!Zz4.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, Gz4.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  V0Q.fromBase64 = Iz4
})
// @from(Start 2373649, End 2374228)
C0Q = z((D0Q) => {
  Object.defineProperty(D0Q, "__esModule", {
    value: !0
  });
  D0Q.toBase64 = void 0;
  var Yz4 = hI(),
    Jz4 = O2(),
    Wz4 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, Jz4.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Yz4.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  D0Q.toBase64 = Wz4
})
// @from(Start 2374234, End 2374930)
lU1 = z((HC7, ffA) => {
  var {
    defineProperty: E0Q,
    getOwnPropertyDescriptor: Xz4,
    getOwnPropertyNames: Vz4
  } = Object, Fz4 = Object.prototype.hasOwnProperty, cU1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Vz4(Q))
        if (!Fz4.call(A, Z) && Z !== B) E0Q(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Xz4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, z0Q = (A, Q, B) => (cU1(A, Q, "default"), B && cU1(B, Q, "default")), Kz4 = (A) => cU1(E0Q({}, "__esModule", {
    value: !0
  }), A), pU1 = {};
  ffA.exports = Kz4(pU1);
  z0Q(pU1, K0Q(), ffA.exports);
  z0Q(pU1, C0Q(), ffA.exports)
})