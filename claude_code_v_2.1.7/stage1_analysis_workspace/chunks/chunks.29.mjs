
// @from(Ln 73307, Col 4)
oG = U((Aa4) => {
  var JUQ = YUQ(),
    XUQ = (A) => {
      let Q = JUQ.fromString(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    },
    tn4 = (A) => {
      if (typeof A === "string") return XUQ(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    },
    en4 = (A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return JUQ.fromArrayBuffer(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    };
  Aa4.fromUtf8 = XUQ;
  Aa4.toUint8Array = tn4;
  Aa4.toUtf8 = en4
})
// @from(Ln 73327, Col 4)
WUQ = U((IUQ) => {
  Object.defineProperty(IUQ, "__esModule", {
    value: !0
  });
  IUQ.toBase64 = void 0;
  var Za4 = kaA(),
    Ya4 = oG(),
    Ja4 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, Ya4.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Za4.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  IUQ.toBase64 = Ja4
})
// @from(Ln 73343, Col 4)
pZA = U((PNA) => {
  var KUQ = GUQ(),
    VUQ = WUQ();
  Object.keys(KUQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(PNA, A)) Object.defineProperty(PNA, A, {
      enumerable: !0,
      get: function () {
        return KUQ[A]
      }
    })
  });
  Object.keys(VUQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(PNA, A)) Object.defineProperty(PNA, A, {
      enumerable: !0,
      get: function () {
        return VUQ[A]
      }
    })
  })
})
// @from(Ln 73363, Col 4)
MS1 = U((HUQ) => {
  Object.defineProperty(HUQ, "__esModule", {
    value: !0
  });
  HUQ.ChecksumStream = void 0;
  var Xa4 = pZA(),
    Ia4 = NA("stream");
  class FUQ extends Ia4.Duplex {
    expectedChecksum;
    checksumSourceLocation;
    checksum;
    source;
    base64Encoder;
    constructor({
      expectedChecksum: A,
      checksum: Q,
      source: B,
      checksumSourceLocation: G,
      base64Encoder: Z
    }) {
      super();
      if (typeof B.pipe === "function") this.source = B;
      else throw Error(`@smithy/util-stream: unsupported source type ${B?.constructor?.name??B} in ChecksumStream.`);
      this.base64Encoder = Z ?? Xa4.toBase64, this.expectedChecksum = A, this.checksum = Q, this.checksumSourceLocation = G, this.source.pipe(this)
    }
    _read(A) {}
    _write(A, Q, B) {
      try {
        this.checksum.update(A), this.push(A)
      } catch (G) {
        return B(G)
      }
      return B()
    }
    async _final(A) {
      try {
        let Q = await this.checksum.digest(),
          B = this.base64Encoder(Q);
        if (this.expectedChecksum !== B) return A(Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${B}" in response header "${this.checksumSourceLocation}".`))
      } catch (Q) {
        return A(Q)
      }
      return this.push(null), A()
    }
  }
  HUQ.ChecksumStream = FUQ
})
// @from(Ln 73410, Col 4)
gi = U((zUQ) => {
  Object.defineProperty(zUQ, "__esModule", {
    value: !0
  });
  zUQ.isBlob = zUQ.isReadableStream = void 0;
  var Da4 = (A) => typeof ReadableStream === "function" && (A?.constructor?.name === ReadableStream.name || A instanceof ReadableStream);
  zUQ.isReadableStream = Da4;
  var Wa4 = (A) => {
    return typeof Blob === "function" && (A?.constructor?.name === Blob.name || A instanceof Blob)
  };
  zUQ.isBlob = Wa4
})
// @from(Ln 73422, Col 4)
NUQ = U((UUQ) => {
  Object.defineProperty(UUQ, "__esModule", {
    value: !0
  });
  UUQ.ChecksumStream = void 0;
  var Va4 = typeof ReadableStream === "function" ? ReadableStream : function () {};
  class CUQ extends Va4 {}
  UUQ.ChecksumStream = CUQ
})
// @from(Ln 73431, Col 4)
OUQ = U((wUQ) => {
  Object.defineProperty(wUQ, "__esModule", {
    value: !0
  });
  wUQ.createChecksumStream = void 0;
  var Fa4 = pZA(),
    Ha4 = gi(),
    Ea4 = NUQ(),
    za4 = ({
      expectedChecksum: A,
      checksum: Q,
      source: B,
      checksumSourceLocation: G,
      base64Encoder: Z
    }) => {
      if (!(0, Ha4.isReadableStream)(B)) throw Error(`@smithy/util-stream: unsupported source type ${B?.constructor?.name??B} in ChecksumStream.`);
      let Y = Z ?? Fa4.toBase64;
      if (typeof TransformStream !== "function") throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
      let J = new TransformStream({
        start() {},
        async transform(I, D) {
          Q.update(I), D.enqueue(I)
        },
        async flush(I) {
          let D = await Q.digest(),
            W = Y(D);
          if (A !== W) {
            let K = Error(`Checksum mismatch: expected "${A}" but received "${W}" in response header "${G}".`);
            I.error(K)
          } else I.terminate()
        }
      });
      B.pipeThrough(J);
      let X = J.readable;
      return Object.setPrototypeOf(X, Ea4.ChecksumStream.prototype), X
    };
  wUQ.createChecksumStream = za4
})
// @from(Ln 73469, Col 4)
RUQ = U((MUQ) => {
  Object.defineProperty(MUQ, "__esModule", {
    value: !0
  });
  MUQ.createChecksumStream = qa4;
  var $a4 = gi(),
    Ca4 = MS1(),
    Ua4 = OUQ();

  function qa4(A) {
    if (typeof ReadableStream === "function" && (0, $a4.isReadableStream)(A.source)) return (0, Ua4.createChecksumStream)(A);
    return new Ca4.ChecksumStream(A)
  }
})
// @from(Ln 73483, Col 4)
RS1 = U((jUQ) => {
  Object.defineProperty(jUQ, "__esModule", {
    value: !0
  });
  jUQ.ByteArrayCollector = void 0;
  class _UQ {
    allocByteArray;
    byteLength = 0;
    byteArrays = [];
    constructor(A) {
      this.allocByteArray = A
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
  jUQ.ByteArrayCollector = _UQ
})
// @from(Ln 73517, Col 4)
kUQ = U((yUQ) => {
  Object.defineProperty(yUQ, "__esModule", {
    value: !0
  });
  yUQ.createBufferedReadable = void 0;
  yUQ.createBufferedReadableStream = PUQ;
  yUQ.merge = SUQ;
  yUQ.flush = baA;
  yUQ.sizeOf = lZA;
  yUQ.modeOf = xUQ;
  var wa4 = RS1();

  function PUQ(A, Q, B) {
    let G = A.getReader(),
      Z = !1,
      Y = 0,
      J = ["", new wa4.ByteArrayCollector((D) => new Uint8Array(D))],
      X = -1,
      I = async (D) => {
        let {
          value: W,
          done: K
        } = await G.read(), V = W;
        if (K) {
          if (X !== -1) {
            let F = baA(J, X);
            if (lZA(F) > 0) D.enqueue(F)
          }
          D.close()
        } else {
          let F = xUQ(V, !1);
          if (X !== F) {
            if (X >= 0) D.enqueue(baA(J, X));
            X = F
          }
          if (X === -1) {
            D.enqueue(V);
            return
          }
          let H = lZA(V);
          Y += H;
          let E = lZA(J[X]);
          if (H >= Q && E === 0) D.enqueue(V);
          else {
            let z = SUQ(J, X, V);
            if (!Z && Y > Q * 2) Z = !0, B?.warn(`@smithy/util-stream - stream chunk size ${H} is below threshold of ${Q}, automatically buffering.`);
            if (z >= Q) D.enqueue(baA(J, X));
            else await I(D)
          }
        }
      };
    return new ReadableStream({
      pull: I
    })
  }
  yUQ.createBufferedReadable = PUQ;

  function SUQ(A, Q, B) {
    switch (Q) {
      case 0:
        return A[0] += B, lZA(A[0]);
      case 1:
      case 2:
        return A[Q].push(B), lZA(A[Q])
    }
  }

  function baA(A, Q) {
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

  function lZA(A) {
    return A?.byteLength ?? A?.length ?? 0
  }

  function xUQ(A, Q = !0) {
    if (Q && typeof Buffer < "u" && A instanceof Buffer) return 2;
    if (A instanceof Uint8Array) return 1;
    if (typeof A === "string") return 0;
    return -1
  }
})
// @from(Ln 73607, Col 4)
hUQ = U((fUQ) => {
  Object.defineProperty(fUQ, "__esModule", {
    value: !0
  });
  fUQ.createBufferedReadable = Pa4;
  var ja4 = NA("node:stream"),
    bUQ = RS1(),
    gg = kUQ(),
    Ta4 = gi();

  function Pa4(A, Q, B) {
    if ((0, Ta4.isReadableStream)(A)) return (0, gg.createBufferedReadableStream)(A, Q, B);
    let G = new ja4.Readable({
        read() {}
      }),
      Z = !1,
      Y = 0,
      J = ["", new bUQ.ByteArrayCollector((I) => new Uint8Array(I)), new bUQ.ByteArrayCollector((I) => Buffer.from(new Uint8Array(I)))],
      X = -1;
    return A.on("data", (I) => {
      let D = (0, gg.modeOf)(I, !0);
      if (X !== D) {
        if (X >= 0) G.push((0, gg.flush)(J, X));
        X = D
      }
      if (X === -1) {
        G.push(I);
        return
      }
      let W = (0, gg.sizeOf)(I);
      Y += W;
      let K = (0, gg.sizeOf)(J[X]);
      if (W >= Q && K === 0) G.push(I);
      else {
        let V = (0, gg.merge)(J, X, I);
        if (!Z && Y > Q * 2) Z = !0, B?.warn(`@smithy/util-stream - stream chunk size ${W} is below threshold of ${Q}, automatically buffering.`);
        if (V >= Q) G.push((0, gg.flush)(J, X))
      }
    }), A.on("end", () => {
      if (X !== -1) {
        let I = (0, gg.flush)(J, X);
        if ((0, gg.sizeOf)(I) > 0) G.push(I)
      }
      G.push(null)
    }), G
  }
})
// @from(Ln 73654, Col 4)
mUQ = U((gUQ) => {
  Object.defineProperty(gUQ, "__esModule", {
    value: !0
  });
  gUQ.getAwsChunkedEncodingStream = void 0;
  var xa4 = NA("stream"),
    ya4 = (A, Q) => {
      let {
        base64Encoder: B,
        bodyLengthChecker: G,
        checksumAlgorithmFn: Z,
        checksumLocationName: Y,
        streamHasher: J
      } = Q, X = B !== void 0 && Z !== void 0 && Y !== void 0 && J !== void 0, I = X ? J(Z, A) : void 0, D = new xa4.Readable({
        read: () => {}
      });
      return A.on("data", (W) => {
        let K = G(W) || 0;
        D.push(`${K.toString(16)}\r
`), D.push(W), D.push(`\r
`)
      }), A.on("end", async () => {
        if (D.push(`0\r
`), X) {
          let W = B(await I);
          D.push(`${Y}:${W}\r
`), D.push(`\r
`)
        }
        D.push(null)
      }), D
    };
  gUQ.getAwsChunkedEncodingStream = ya4
})
// @from(Ln 73688, Col 4)
cUQ = U((dUQ) => {
  Object.defineProperty(dUQ, "__esModule", {
    value: !0
  });
  dUQ.headStream = va4;
  async function va4(A, Q) {
    let B = 0,
      G = [],
      Z = A.getReader(),
      Y = !1;
    while (!Y) {
      let {
        done: I,
        value: D
      } = await Z.read();
      if (D) G.push(D), B += D?.byteLength ?? 0;
      if (B >= Q) break;
      Y = I
    }
    Z.releaseLock();
    let J = new Uint8Array(Math.min(Q, B)),
      X = 0;
    for (let I of G) {
      if (I.byteLength > J.byteLength - X) {
        J.set(I.subarray(0, J.byteLength - X), X);
        break
      } else J.set(I, X);
      X += I.length
    }
    return J
  }
})
// @from(Ln 73720, Col 4)
nUQ = U((lUQ) => {
  Object.defineProperty(lUQ, "__esModule", {
    value: !0
  });
  lUQ.headStream = void 0;
  var ba4 = NA("stream"),
    fa4 = cUQ(),
    ha4 = gi(),
    ga4 = (A, Q) => {
      if ((0, ha4.isReadableStream)(A)) return (0, fa4.headStream)(A, Q);
      return new Promise((B, G) => {
        let Z = new pUQ;
        Z.limit = Q, A.pipe(Z), A.on("error", (Y) => {
          Z.end(), G(Y)
        }), Z.on("error", G), Z.on("finish", function () {
          let Y = new Uint8Array(Buffer.concat(this.buffers));
          B(Y)
        })
      })
    };
  lUQ.headStream = ga4;
  class pUQ extends ba4.Writable {
    buffers = [];
    limit = 1 / 0;
    bytesBuffered = 0;
    _write(A, Q, B) {
      if (this.buffers.push(A), this.bytesBuffered += A.byteLength ?? 0, this.bytesBuffered >= this.limit) {
        let G = this.bytesBuffered - this.limit,
          Z = this.buffers[this.buffers.length - 1];
        this.buffers[this.buffers.length - 1] = Z.subarray(0, Z.byteLength - G), this.emit("finish")
      }
      B()
    }
  }
})
// @from(Ln 73755, Col 4)
aUQ = U((la4) => {
  la4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(la4.HttpAuthLocation || (la4.HttpAuthLocation = {}));
  la4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(la4.HttpApiKeyAuthLocation || (la4.HttpApiKeyAuthLocation = {}));
  la4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(la4.EndpointURLScheme || (la4.EndpointURLScheme = {}));
  la4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(la4.AlgorithmId || (la4.AlgorithmId = {}));
  var ua4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => la4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => la4.AlgorithmId.MD5,
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
    },
    ma4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    da4 = (A) => {
      return ua4(A)
    },
    ca4 = (A) => {
      return ma4(A)
    };
  la4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(la4.FieldPosition || (la4.FieldPosition = {}));
  var pa4 = "__smithy_context";
  la4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(la4.IniSectionType || (la4.IniSectionType = {}));
  la4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(la4.RequestHandlerProtocol || (la4.RequestHandlerProtocol = {}));
  la4.SMITHY_CONTEXT_KEY = pa4;
  la4.getDefaultClientConfiguration = da4;
  la4.resolveDefaultRuntimeConfig = ca4
})
// @from(Ln 73820, Col 4)
tUQ = U((Ao4) => {
  var oa4 = aUQ(),
    ra4 = (A) => {
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
    },
    sa4 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class oUQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = oa4.FieldPosition.HEADER,
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
  }
  class rUQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
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
  }
  class faA {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(A) {
      this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
    }
    static clone(A) {
      let Q = new faA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = ta4(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return faA.clone(this)
    }
  }

  function ta4(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class sUQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function ea4(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Ao4.Field = oUQ;
  Ao4.Fields = rUQ;
  Ao4.HttpRequest = faA;
  Ao4.HttpResponse = sUQ;
  Ao4.getHttpHandlerExtensionConfiguration = ra4;
  Ao4.isValidHostname = ea4;
  Ao4.resolveHttpHandlerRuntimeConfig = sa4
})
// @from(Ln 73962, Col 4)
AqQ = U((Wo4) => {
  var eUQ = (A) => encodeURIComponent(A).replace(/[!'()*]/g, Io4),
    Io4 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
    Do4 = (A) => A.split("/").map(eUQ).join("/");
  Wo4.escapeUri = eUQ;
  Wo4.escapeUriPath = Do4
})
// @from(Ln 73969, Col 4)
QqQ = U((Ho4) => {
  var yS1 = AqQ();

  function Fo4(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = yS1.escapeUri(B), Array.isArray(G))
        for (let Z = 0, Y = G.length; Z < Y; Z++) Q.push(`${B}=${yS1.escapeUri(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${yS1.escapeUri(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  Ho4.buildQueryString = Fo4
})
// @from(Ln 73988, Col 4)
XL = U((_o4) => {
  var YqQ = tUQ(),
    JqQ = QqQ(),
    haA = NA("http"),
    gaA = NA("https"),
    XqQ = NA("stream"),
    vS1 = NA("http2"),
    zo4 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
    IqQ = (A) => {
      let Q = {};
      for (let B of Object.keys(A)) {
        let G = A[B];
        Q[B] = Array.isArray(G) ? G.join(",") : G
      }
      return Q
    },
    GC = {
      setTimeout: (A, Q) => setTimeout(A, Q),
      clearTimeout: (A) => clearTimeout(A)
    },
    BqQ = 1000,
    $o4 = (A, Q, B = 0) => {
      if (!B) return -1;
      let G = (Z) => {
        let Y = GC.setTimeout(() => {
            A.destroy(), Q(Object.assign(Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${B} ms.`), {
              name: "TimeoutError"
            }))
          }, B - Z),
          J = (X) => {
            if (X?.connecting) X.on("connect", () => {
              GC.clearTimeout(Y)
            });
            else GC.clearTimeout(Y)
          };
        if (A.socket) J(A.socket);
        else A.on("socket", J)
      };
      if (B < 2000) return G(0), 0;
      return GC.setTimeout(G.bind(null, BqQ), BqQ)
    },
    Co4 = (A, Q, B = 0, G, Z) => {
      if (B) return GC.setTimeout(() => {
        let Y = `@smithy/node-http-handler - [${G?"ERROR":"WARN"}] a request has exceeded the configured ${B} ms requestTimeout.`;
        if (G) {
          let J = Object.assign(Error(Y), {
            name: "TimeoutError",
            code: "ETIMEDOUT"
          });
          A.destroy(J), Q(J)
        } else Y += " Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.", Z?.warn?.(Y)
      }, B);
      return -1
    },
    Uo4 = 3000,
    qo4 = (A, {
      keepAlive: Q,
      keepAliveMsecs: B
    }, G = Uo4) => {
      if (Q !== !0) return -1;
      let Z = () => {
        if (A.socket) A.socket.setKeepAlive(Q, B || 0);
        else A.on("socket", (Y) => {
          Y.setKeepAlive(Q, B || 0)
        })
      };
      if (G === 0) return Z(), 0;
      return GC.setTimeout(Z, G)
    },
    GqQ = 3000,
    No4 = (A, Q, B = 0) => {
      let G = (Z) => {
        let Y = B - Z,
          J = () => {
            A.destroy(), Q(Object.assign(Error(`@smithy/node-http-handler - the request socket timed out after ${B} ms of inactivity (configured by client requestHandler).`), {
              name: "TimeoutError"
            }))
          };
        if (A.socket) A.socket.setTimeout(Y, J), A.on("close", () => A.socket?.removeListener("timeout", J));
        else A.setTimeout(Y, J)
      };
      if (0 < B && B < 6000) return G(0), 0;
      return GC.setTimeout(G.bind(null, B === 0 ? 0 : GqQ), GqQ)
    },
    ZqQ = 6000;
  async function DqQ(A, Q, B = ZqQ, G = !1) {
    let Z = Q.headers ?? {},
      Y = Z.Expect || Z.expect,
      J = -1,
      X = !0;
    if (!G && Y === "100-continue") X = await Promise.race([new Promise((I) => {
      J = Number(GC.setTimeout(() => I(!0), Math.max(ZqQ, B)))
    }), new Promise((I) => {
      A.on("continue", () => {
        GC.clearTimeout(J), I(!0)
      }), A.on("response", () => {
        GC.clearTimeout(J), I(!1)
      }), A.on("error", () => {
        GC.clearTimeout(J), I(!1)
      })
    })]);
    if (X) wo4(A, Q.body)
  }

  function wo4(A, Q) {
    if (Q instanceof XqQ.Readable) {
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
  var Lo4 = 0;
  class uaA {
    config;
    configProvider;
    socketWarningTimestamp = 0;
    externalAgent = !1;
    metadata = {
      handlerProtocol: "http/1.1"
    };
    static create(A) {
      if (typeof A?.handle === "function") return A;
      return new uaA(A)
    }
    static checkSocketUsage(A, Q, B = console) {
      let {
        sockets: G,
        requests: Z,
        maxSockets: Y
      } = A;
      if (typeof Y !== "number" || Y === 1 / 0) return Q;
      let J = 15000;
      if (Date.now() - J < Q) return Q;
      if (G && Z)
        for (let X in G) {
          let I = G[X]?.length ?? 0,
            D = Z[X]?.length ?? 0;
          if (I >= Y && D >= 2 * Y) return B?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${I} and ${D} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`), Date.now()
        }
      return Q
    }
    constructor(A) {
      this.configProvider = new Promise((Q, B) => {
        if (typeof A === "function") A().then((G) => {
          Q(this.resolveDefaultConfig(G))
        }).catch(B);
        else Q(this.resolveDefaultConfig(A))
      })
    }
    resolveDefaultConfig(A) {
      let {
        requestTimeout: Q,
        connectionTimeout: B,
        socketTimeout: G,
        socketAcquisitionWarningTimeout: Z,
        httpAgent: Y,
        httpsAgent: J,
        throwOnRequestTimeout: X
      } = A || {}, I = !0, D = 50;
      return {
        connectionTimeout: B,
        requestTimeout: Q,
        socketTimeout: G,
        socketAcquisitionWarningTimeout: Z,
        throwOnRequestTimeout: X,
        httpAgent: (() => {
          if (Y instanceof haA.Agent || typeof Y?.destroy === "function") return this.externalAgent = !0, Y;
          return new haA.Agent({
            keepAlive: !0,
            maxSockets: 50,
            ...Y
          })
        })(),
        httpsAgent: (() => {
          if (J instanceof gaA.Agent || typeof J?.destroy === "function") return this.externalAgent = !0, J;
          return new gaA.Agent({
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
    async handle(A, {
      abortSignal: Q,
      requestTimeout: B
    } = {}) {
      if (!this.config) this.config = await this.configProvider;
      return new Promise((G, Z) => {
        let Y = this.config,
          J = void 0,
          X = [],
          I = async (x) => {
            await J, X.forEach(GC.clearTimeout), G(x)
          }, D = async (x) => {
            await J, X.forEach(GC.clearTimeout), Z(x)
          };
        if (Q?.aborted) {
          let x = Error("Request aborted");
          x.name = "AbortError", D(x);
          return
        }
        let W = A.protocol === "https:",
          K = A.headers ?? {},
          V = (K.Expect ?? K.expect) === "100-continue",
          F = W ? Y.httpsAgent : Y.httpAgent;
        if (V && !this.externalAgent) F = new(W ? gaA.Agent : haA.Agent)({
          keepAlive: !1,
          maxSockets: 1 / 0
        });
        X.push(GC.setTimeout(() => {
          this.socketWarningTimestamp = uaA.checkSocketUsage(F, this.socketWarningTimestamp, Y.logger)
        }, Y.socketAcquisitionWarningTimeout ?? (Y.requestTimeout ?? 2000) + (Y.connectionTimeout ?? 1000)));
        let H = JqQ.buildQueryString(A.query || {}),
          E = void 0;
        if (A.username != null || A.password != null) {
          let x = A.username ?? "",
            b = A.password ?? "";
          E = `${x}:${b}`
        }
        let z = A.path;
        if (H) z += `?${H}`;
        if (A.fragment) z += `#${A.fragment}`;
        let $ = A.hostname ?? "";
        if ($[0] === "[" && $.endsWith("]")) $ = A.hostname.slice(1, -1);
        else $ = A.hostname;
        let O = {
            headers: A.headers,
            host: $,
            method: A.method,
            path: z,
            port: A.port,
            agent: F,
            auth: E
          },
          M = (W ? gaA.request : haA.request)(O, (x) => {
            let b = new YqQ.HttpResponse({
              statusCode: x.statusCode || -1,
              reason: x.statusMessage,
              headers: IqQ(x.headers),
              body: x
            });
            I({
              response: b
            })
          });
        if (M.on("error", (x) => {
            if (zo4.includes(x.code)) D(Object.assign(x, {
              name: "TimeoutError"
            }));
            else D(x)
          }), Q) {
          let x = () => {
            M.destroy();
            let b = Error("Request aborted");
            b.name = "AbortError", D(b)
          };
          if (typeof Q.addEventListener === "function") {
            let b = Q;
            b.addEventListener("abort", x, {
              once: !0
            }), M.once("close", () => b.removeEventListener("abort", x))
          } else Q.onabort = x
        }
        let _ = B ?? Y.requestTimeout;
        X.push($o4(M, D, Y.connectionTimeout)), X.push(Co4(M, D, _, Y.throwOnRequestTimeout, Y.logger ?? console)), X.push(No4(M, D, Y.socketTimeout));
        let j = O.agent;
        if (typeof j === "object" && "keepAlive" in j) X.push(qo4(M, {
          keepAlive: j.keepAlive,
          keepAliveMsecs: j.keepAliveMsecs
        }));
        J = DqQ(M, A, _, this.externalAgent).catch((x) => {
          return X.forEach(GC.clearTimeout), Z(x)
        })
      })
    }
    updateHttpClientConfig(A, Q) {
      this.config = void 0, this.configProvider = this.configProvider.then((B) => {
        return {
          ...B,
          [A]: Q
        }
      })
    }
    httpHandlerConfigs() {
      return this.config ?? {}
    }
  }
  class WqQ {
    sessions = [];
    constructor(A) {
      this.sessions = A ?? []
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
  }
  class KqQ {
    constructor(A) {
      if (this.config = A, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
    }
    config;
    sessionCache = new Map;
    lease(A, Q) {
      let B = this.getUrlString(A),
        G = this.sessionCache.get(B);
      if (G) {
        let X = G.poll();
        if (X && !this.config.disableConcurrency) return X
      }
      let Z = vS1.connect(B);
      if (this.config.maxConcurrency) Z.settings({
        maxConcurrentStreams: this.config.maxConcurrency
      }, (X) => {
        if (X) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + A.destination.toString())
      });
      Z.unref();
      let Y = () => {
        Z.destroy(), this.deleteSession(B, Z)
      };
      if (Z.on("goaway", Y), Z.on("error", Y), Z.on("frameError", Y), Z.on("close", () => this.deleteSession(B, Z)), Q.requestTimeout) Z.setTimeout(Q.requestTimeout, Y);
      let J = this.sessionCache.get(B) || new WqQ;
      return J.offerLast(Z), this.sessionCache.set(B, J), Z
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
  }
  class kS1 {
    config;
    configProvider;
    metadata = {
      handlerProtocol: "h2"
    };
    connectionManager = new KqQ({});
    static create(A) {
      if (typeof A?.handle === "function") return A;
      return new kS1(A)
    }
    constructor(A) {
      this.configProvider = new Promise((Q, B) => {
        if (typeof A === "function") A().then((G) => {
          Q(G || {})
        }).catch(B);
        else Q(A || {})
      })
    }
    destroy() {
      this.connectionManager.destroy()
    }
    async handle(A, {
      abortSignal: Q,
      requestTimeout: B
    } = {}) {
      if (!this.config) {
        if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
      }
      let {
        requestTimeout: G,
        disableConcurrentStreams: Z
      } = this.config, Y = B ?? G;
      return new Promise((J, X) => {
        let I = !1,
          D = void 0,
          W = async (S) => {
            await D, J(S)
          }, K = async (S) => {
            await D, X(S)
          };
        if (Q?.aborted) {
          I = !0;
          let S = Error("Request aborted");
          S.name = "AbortError", K(S);
          return
        }
        let {
          hostname: V,
          method: F,
          port: H,
          protocol: E,
          query: z
        } = A, $ = "";
        if (A.username != null || A.password != null) {
          let S = A.username ?? "",
            u = A.password ?? "";
          $ = `${S}:${u}@`
        }
        let O = `${E}//${$}${V}${H?`:${H}`:""}`,
          L = {
            destination: new URL(O)
          },
          M = this.connectionManager.lease(L, {
            requestTimeout: this.config?.sessionTimeout,
            disableConcurrentStreams: Z || !1
          }),
          _ = (S) => {
            if (Z) this.destroySession(M);
            I = !0, K(S)
          },
          j = JqQ.buildQueryString(z || {}),
          x = A.path;
        if (j) x += `?${j}`;
        if (A.fragment) x += `#${A.fragment}`;
        let b = M.request({
          ...A.headers,
          [vS1.constants.HTTP2_HEADER_PATH]: x,
          [vS1.constants.HTTP2_HEADER_METHOD]: F
        });
        if (M.ref(), b.on("response", (S) => {
            let u = new YqQ.HttpResponse({
              statusCode: S[":status"] || -1,
              headers: IqQ(S),
              body: b
            });
            if (I = !0, W({
                response: u
              }), Z) M.close(), this.connectionManager.deleteSession(O, M)
          }), Y) b.setTimeout(Y, () => {
          b.close();
          let S = Error(`Stream timed out because of no activity for ${Y} ms`);
          S.name = "TimeoutError", _(S)
        });
        if (Q) {
          let S = () => {
            b.close();
            let u = Error("Request aborted");
            u.name = "AbortError", _(u)
          };
          if (typeof Q.addEventListener === "function") {
            let u = Q;
            u.addEventListener("abort", S, {
              once: !0
            }), b.once("close", () => u.removeEventListener("abort", S))
          } else Q.onabort = S
        }
        b.on("frameError", (S, u, f) => {
          _(Error(`Frame type id ${S} in stream id ${f} has failed with code ${u}.`))
        }), b.on("error", _), b.on("aborted", () => {
          _(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${b.rstCode}.`))
        }), b.on("close", () => {
          if (M.unref(), Z) M.destroy();
          if (!I) _(Error("Unexpected error: http2 request did not get a response"))
        }), D = DqQ(b, A, Y)
      })
    }
    updateHttpClientConfig(A, Q) {
      this.config = void 0, this.configProvider = this.configProvider.then((B) => {
        return {
          ...B,
          [A]: Q
        }
      })
    }
    httpHandlerConfigs() {
      return this.config ?? {}
    }
    destroySession(A) {
      if (!A.destroyed) A.destroy()
    }
  }
  class VqQ extends XqQ.Writable {
    bufferedBytes = [];
    _write(A, Q, B) {
      this.bufferedBytes.push(A), B()
    }
  }
  var Oo4 = (A) => {
      if (Mo4(A)) return Ro4(A);
      return new Promise((Q, B) => {
        let G = new VqQ;
        A.pipe(G), A.on("error", (Z) => {
          G.end(), B(Z)
        }), G.on("error", B), G.on("finish", function () {
          let Z = new Uint8Array(Buffer.concat(this.bufferedBytes));
          Q(Z)
        })
      })
    },
    Mo4 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream;
  async function Ro4(A) {
    let Q = [],
      B = A.getReader(),
      G = !1,
      Z = 0;
    while (!G) {
      let {
        done: X,
        value: I
      } = await B.read();
      if (I) Q.push(I), Z += I.length;
      G = X
    }
    let Y = new Uint8Array(Z),
      J = 0;
    for (let X of Q) Y.set(X, J), J += X.length;
    return Y
  }
  _o4.DEFAULT_REQUEST_TIMEOUT = Lo4;
  _o4.NodeHttp2Handler = kS1;
  _o4.NodeHttpHandler = uaA;
  _o4.streamCollector = Oo4
})
// @from(Ln 74552, Col 4)
FqQ = U((fo4) => {
  fo4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(fo4.HttpAuthLocation || (fo4.HttpAuthLocation = {}));
  fo4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(fo4.HttpApiKeyAuthLocation || (fo4.HttpApiKeyAuthLocation = {}));
  fo4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(fo4.EndpointURLScheme || (fo4.EndpointURLScheme = {}));
  fo4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(fo4.AlgorithmId || (fo4.AlgorithmId = {}));
  var xo4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => fo4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => fo4.AlgorithmId.MD5,
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
    },
    yo4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    vo4 = (A) => {
      return xo4(A)
    },
    ko4 = (A) => {
      return yo4(A)
    };
  fo4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(fo4.FieldPosition || (fo4.FieldPosition = {}));
  var bo4 = "__smithy_context";
  fo4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(fo4.IniSectionType || (fo4.IniSectionType = {}));
  fo4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(fo4.RequestHandlerProtocol || (fo4.RequestHandlerProtocol = {}));
  fo4.SMITHY_CONTEXT_KEY = bo4;
  fo4.getDefaultClientConfiguration = vo4;
  fo4.resolveDefaultRuntimeConfig = ko4
})
// @from(Ln 74617, Col 4)
$qQ = U((io4) => {
  var mo4 = FqQ(),
    do4 = (A) => {
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
    },
    co4 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class HqQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = mo4.FieldPosition.HEADER,
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
  }
  class EqQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
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
  }
  class maA {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(A) {
      this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
    }
    static clone(A) {
      let Q = new maA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = po4(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return maA.clone(this)
    }
  }

  function po4(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class zqQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function lo4(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  io4.Field = HqQ;
  io4.Fields = EqQ;
  io4.HttpRequest = maA;
  io4.HttpResponse = zqQ;
  io4.getHttpHandlerExtensionConfiguration = do4;
  io4.isValidHostname = lo4;
  io4.resolveHttpHandlerRuntimeConfig = co4
})
// @from(Ln 74759, Col 4)
UqQ = U((Br4) => {
  var CqQ = (A) => encodeURIComponent(A).replace(/[!'()*]/g, Ar4),
    Ar4 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
    Qr4 = (A) => A.split("/").map(CqQ).join("/");
  Br4.escapeUri = CqQ;
  Br4.escapeUriPath = Qr4
})
// @from(Ln 74766, Col 4)
qqQ = U((Jr4) => {
  var dS1 = UqQ();

  function Yr4(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = dS1.escapeUri(B), Array.isArray(G))
        for (let Z = 0, Y = G.length; Z < Y; Z++) Q.push(`${B}=${dS1.escapeUri(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${dS1.escapeUri(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  Jr4.buildQueryString = Yr4
})
// @from(Ln 74785, Col 4)
LqQ = U((Er4) => {
  var NqQ = $qQ(),
    Ir4 = qqQ(),
    Dr4 = pZA();

  function wqQ(A, Q) {
    return new Request(A, Q)
  }

  function Wr4(A = 0) {
    return new Promise((Q, B) => {
      if (A) setTimeout(() => {
        let G = Error(`Request did not complete within ${A} ms`);
        G.name = "TimeoutError", B(G)
      }, A)
    })
  }
  var daA = {
    supported: void 0
  };
  class cS1 {
    config;
    configProvider;
    static create(A) {
      if (typeof A?.handle === "function") return A;
      return new cS1(A)
    }
    constructor(A) {
      if (typeof A === "function") this.configProvider = A().then((Q) => Q || {});
      else this.config = A ?? {}, this.configProvider = Promise.resolve(this.config);
      if (daA.supported === void 0) daA.supported = Boolean(typeof Request < "u" && "keepalive" in wqQ("https://[::1]"))
    }
    destroy() {}
    async handle(A, {
      abortSignal: Q,
      requestTimeout: B
    } = {}) {
      if (!this.config) this.config = await this.configProvider;
      let G = B ?? this.config.requestTimeout,
        Z = this.config.keepAlive === !0,
        Y = this.config.credentials;
      if (Q?.aborted) {
        let $ = Error("Request aborted");
        return $.name = "AbortError", Promise.reject($)
      }
      let J = A.path,
        X = Ir4.buildQueryString(A.query || {});
      if (X) J += `?${X}`;
      if (A.fragment) J += `#${A.fragment}`;
      let I = "";
      if (A.username != null || A.password != null) {
        let $ = A.username ?? "",
          O = A.password ?? "";
        I = `${$}:${O}@`
      }
      let {
        port: D,
        method: W
      } = A, K = `${A.protocol}//${I}${A.hostname}${D?`:${D}`:""}${J}`, V = W === "GET" || W === "HEAD" ? void 0 : A.body, F = {
        body: V,
        headers: new Headers(A.headers),
        method: W,
        credentials: Y
      };
      if (this.config?.cache) F.cache = this.config.cache;
      if (V) F.duplex = "half";
      if (typeof AbortController < "u") F.signal = Q;
      if (daA.supported) F.keepalive = Z;
      if (typeof this.config.requestInit === "function") Object.assign(F, this.config.requestInit(A));
      let H = () => {},
        E = wqQ(K, F),
        z = [fetch(E).then(($) => {
          let O = $.headers,
            L = {};
          for (let _ of O.entries()) L[_[0]] = _[1];
          if ($.body == null) return $.blob().then((_) => ({
            response: new NqQ.HttpResponse({
              headers: L,
              reason: $.statusText,
              statusCode: $.status,
              body: _
            })
          }));
          return {
            response: new NqQ.HttpResponse({
              headers: L,
              reason: $.statusText,
              statusCode: $.status,
              body: $.body
            })
          }
        }), Wr4(G)];
      if (Q) z.push(new Promise(($, O) => {
        let L = () => {
          let M = Error("Request aborted");
          M.name = "AbortError", O(M)
        };
        if (typeof Q.addEventListener === "function") {
          let M = Q;
          M.addEventListener("abort", L, {
            once: !0
          }), H = () => M.removeEventListener("abort", L)
        } else Q.onabort = L
      }));
      return Promise.race(z).finally(H)
    }
    updateHttpClientConfig(A, Q) {
      this.config = void 0, this.configProvider = this.configProvider.then((B) => {
        return B[A] = Q, B
      })
    }
    httpHandlerConfigs() {
      return this.config ?? {}
    }
  }
  var Kr4 = async (A) => {
    if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
      if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
      return Vr4(A)
    }
    return Fr4(A)
  };
  async function Vr4(A) {
    let Q = await Hr4(A),
      B = Dr4.fromBase64(Q);
    return new Uint8Array(B)
  }
  async function Fr4(A) {
    let Q = [],
      B = A.getReader(),
      G = !1,
      Z = 0;
    while (!G) {
      let {
        done: X,
        value: I
      } = await B.read();
      if (I) Q.push(I), Z += I.length;
      G = X
    }
    let Y = new Uint8Array(Z),
      J = 0;
    for (let X of Q) Y.set(X, J), J += X.length;
    return Y
  }

  function Hr4(A) {
    return new Promise((Q, B) => {
      let G = new FileReader;
      G.onloadend = () => {
        if (G.readyState !== 2) return B(Error("Reader aborted too early"));
        let Z = G.result ?? "",
          Y = Z.indexOf(","),
          J = Y > -1 ? Y + 1 : Z.length;
        Q(Z.substring(J))
      }, G.onabort = () => B(Error("Read aborted")), G.onerror = () => B(G.error), G.readAsDataURL(A)
    })
  }
  Er4.FetchHttpHandler = cS1;
  Er4.keepAliveSupport = daA;
  Er4.streamCollector = Kr4
})
// @from(Ln 74947, Col 4)
MqQ = U((Nr4) => {
  var OqQ = {},
    pS1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    OqQ[A] = Q, pS1[Q] = A
  }

  function Ur4(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in pS1) Q[B / 2] = pS1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }

  function qr4(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += OqQ[A[B]];
    return Q
  }
  Nr4.fromHex = Ur4;
  Nr4.toHex = qr4
})
// @from(Ln 74975, Col 4)
SqQ = U((TqQ) => {
  Object.defineProperty(TqQ, "__esModule", {
    value: !0
  });
  TqQ.sdkStreamMixin = void 0;
  var Or4 = LqQ(),
    Mr4 = pZA(),
    Rr4 = MqQ(),
    _r4 = oG(),
    RqQ = gi(),
    _qQ = "The stream has already been transformed.",
    jr4 = (A) => {
      if (!jqQ(A) && !(0, RqQ.isReadableStream)(A)) {
        let Z = A?.__proto__?.constructor?.name || A;
        throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${Z}`)
      }
      let Q = !1,
        B = async () => {
          if (Q) throw Error(_qQ);
          return Q = !0, await (0, Or4.streamCollector)(A)
        }, G = (Z) => {
          if (typeof Z.stream !== "function") throw Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
          return Z.stream()
        };
      return Object.assign(A, {
        transformToByteArray: B,
        transformToString: async (Z) => {
          let Y = await B();
          if (Z === "base64") return (0, Mr4.toBase64)(Y);
          else if (Z === "hex") return (0, Rr4.toHex)(Y);
          else if (Z === void 0 || Z === "utf8" || Z === "utf-8") return (0, _r4.toUtf8)(Y);
          else if (typeof TextDecoder === "function") return new TextDecoder(Z).decode(Y);
          else throw Error("TextDecoder is not available, please make sure polyfill is provided.")
        },
        transformToWebStream: () => {
          if (Q) throw Error(_qQ);
          if (Q = !0, jqQ(A)) return G(A);
          else if ((0, RqQ.isReadableStream)(A)) return A;
          else throw Error(`Cannot transform payload to web stream, got ${A}`)
        }
      })
    };
  TqQ.sdkStreamMixin = jr4;
  var jqQ = (A) => typeof Blob === "function" && A instanceof Blob
})
// @from(Ln 75021, Col 4)
kqQ = U((yqQ) => {
  Object.defineProperty(yqQ, "__esModule", {
    value: !0
  });
  yqQ.sdkStreamMixin = void 0;
  var Tr4 = XL(),
    Pr4 = kaA(),
    lS1 = NA("stream"),
    Sr4 = SqQ(),
    xqQ = "The stream has already been transformed.",
    xr4 = (A) => {
      if (!(A instanceof lS1.Readable)) try {
        return (0, Sr4.sdkStreamMixin)(A)
      } catch (G) {
        let Z = A?.__proto__?.constructor?.name || A;
        throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${Z}`)
      }
      let Q = !1,
        B = async () => {
          if (Q) throw Error(xqQ);
          return Q = !0, await (0, Tr4.streamCollector)(A)
        };
      return Object.assign(A, {
        transformToByteArray: B,
        transformToString: async (G) => {
          let Z = await B();
          if (G === void 0 || Buffer.isEncoding(G)) return (0, Pr4.fromArrayBuffer)(Z.buffer, Z.byteOffset, Z.byteLength).toString(G);
          else return new TextDecoder(G).decode(Z)
        },
        transformToWebStream: () => {
          if (Q) throw Error(xqQ);
          if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
          if (typeof lS1.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
          return Q = !0, lS1.Readable.toWeb(A)
        }
      })
    };
  yqQ.sdkStreamMixin = xr4
})
// @from(Ln 75060, Col 4)
fqQ = U((bqQ) => {
  Object.defineProperty(bqQ, "__esModule", {
    value: !0
  });
  bqQ.splitStream = yr4;
  async function yr4(A) {
    if (typeof A.stream === "function") A = A.stream();
    return A.tee()
  }
})
// @from(Ln 75070, Col 4)
mqQ = U((uqQ) => {
  Object.defineProperty(uqQ, "__esModule", {
    value: !0
  });
  uqQ.splitStream = br4;
  var hqQ = NA("stream"),
    kr4 = fqQ(),
    gqQ = gi();
  async function br4(A) {
    if ((0, gqQ.isReadableStream)(A) || (0, gqQ.isBlob)(A)) return (0, kr4.splitStream)(A);
    let Q = new hqQ.PassThrough,
      B = new hqQ.PassThrough;
    return A.pipe(Q), A.pipe(B), [Q, B]
  }
})
// @from(Ln 75085, Col 4)
iS1 = U((OH) => {
  var dqQ = pZA(),
    cqQ = oG(),
    pqQ = MS1(),
    lqQ = RUQ(),
    iqQ = hUQ(),
    nqQ = mUQ(),
    aqQ = nUQ(),
    oqQ = kqQ(),
    rqQ = mqQ(),
    sqQ = gi();
  class yNA extends Uint8Array {
    static fromString(A, Q = "utf-8") {
      if (typeof A === "string") {
        if (Q === "base64") return yNA.mutate(dqQ.fromBase64(A));
        return yNA.mutate(cqQ.fromUtf8(A))
      }
      throw Error(`Unsupported conversion from ${typeof A} to Uint8ArrayBlobAdapter.`)
    }
    static mutate(A) {
      return Object.setPrototypeOf(A, yNA.prototype), A
    }
    transformToString(A = "utf-8") {
      if (A === "base64") return dqQ.toBase64(this);
      return cqQ.toUtf8(this)
    }
  }
  OH.Uint8ArrayBlobAdapter = yNA;
  Object.keys(pqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return pqQ[A]
      }
    })
  });
  Object.keys(lqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return lqQ[A]
      }
    })
  });
  Object.keys(iqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return iqQ[A]
      }
    })
  });
  Object.keys(nqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return nqQ[A]
      }
    })
  });
  Object.keys(aqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return aqQ[A]
      }
    })
  });
  Object.keys(oqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return oqQ[A]
      }
    })
  });
  Object.keys(rqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return rqQ[A]
      }
    })
  });
  Object.keys(sqQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(OH, A)) Object.defineProperty(OH, A, {
      enumerable: !0,
      get: function () {
        return sqQ[A]
      }
    })
  })
})
// @from(Ln 75178, Col 4)
WX = U((sr4) => {
  var gr4 = TNA(),
    tqQ = Jz(),
    caA = (A) => {
      if (typeof A === "function") return A();
      return A
    },
    oS1 = (A, Q, B, G, Z) => ({
      name: Q,
      namespace: A,
      traits: B,
      input: G,
      output: Z
    }),
    ur4 = (A) => (Q, B) => async (G) => {
      let {
        response: Z
      } = await Q(G), {
        operationSchema: Y
      } = tqQ.getSmithyContext(B), [, J, X, I, D, W] = Y ?? [];
      try {
        let K = await A.protocol.deserializeResponse(oS1(J, X, I, D, W), {
          ...A,
          ...B
        }, Z);
        return {
          response: Z,
          output: K
        }
      } catch (K) {
        if (Object.defineProperty(K, "$response", {
            value: Z,
            enumerable: !1,
            writable: !1,
            configurable: !1
          }), !("$metadata" in K)) {
          try {
            K.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
          } catch (F) {
            if (!B.logger || B.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
            else B.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
          }
          if (typeof K.$responseBodyText < "u") {
            if (K.$response) K.$response.body = K.$responseBodyText
          }
          try {
            if (gr4.HttpResponse.isInstance(Z)) {
              let {
                headers: F = {}
              } = Z, H = Object.entries(F);
              K.$metadata = {
                httpStatusCode: Z.statusCode,
                requestId: nS1(/^x-[\w-]+-request-?id$/, H),
                extendedRequestId: nS1(/^x-[\w-]+-id-2$/, H),
                cfId: nS1(/^x-[\w-]+-cf-id$/, H)
              }
            }
          } catch (F) {}
        }
        throw K
      }
    }, nS1 = (A, Q) => {
      return (Q.find(([B]) => {
        return B.match(A)
      }) || [void 0, void 0])[1]
    }, mr4 = (A) => (Q, B) => async (G) => {
      let {
        operationSchema: Z
      } = tqQ.getSmithyContext(B), [, Y, J, X, I, D] = Z ?? [], W = B.endpointV2?.url && A.urlParser ? async () => A.urlParser(B.endpointV2.url): A.endpoint, K = await A.protocol.serializeRequest(oS1(Y, J, X, I, D), G.input, {
        ...A,
        ...B,
        endpoint: W
      });
      return Q({
        ...G,
        request: K
      })
    }, eqQ = {
      name: "deserializerMiddleware",
      step: "deserialize",
      tags: ["DESERIALIZER"],
      override: !0
    }, ANQ = {
      name: "serializerMiddleware",
      step: "serialize",
      tags: ["SERIALIZER"],
      override: !0
    };

  function dr4(A) {
    return {
      applyToStack: (Q) => {
        Q.add(mr4(A), ANQ), Q.add(ur4(A), eqQ), A.protocol.setSerdeContext(A)
      }
    }
  }
  class Lq {
    name;
    namespace;
    traits;
    static assign(A, Q) {
      return Object.assign(A, Q)
    }
    static[Symbol.hasInstance](A) {
      let Q = this.prototype.isPrototypeOf(A);
      if (!Q && typeof A === "object" && A !== null) return A.symbol === this.symbol;
      return Q
    }
    getName() {
      return this.namespace + "#" + this.name
    }
  }
  class paA extends Lq {
    static symbol = Symbol.for("@smithy/lis");
    name;
    traits;
    valueSchema;
    symbol = paA.symbol
  }
  var cr4 = (A, Q, B, G) => Lq.assign(new paA, {
    name: Q,
    namespace: A,
    traits: B,
    valueSchema: G
  });
  class laA extends Lq {
    static symbol = Symbol.for("@smithy/map");
    name;
    traits;
    keySchema;
    valueSchema;
    symbol = laA.symbol
  }
  var pr4 = (A, Q, B, G, Z) => Lq.assign(new laA, {
    name: Q,
    namespace: A,
    traits: B,
    keySchema: G,
    valueSchema: Z
  });
  class iaA extends Lq {
    static symbol = Symbol.for("@smithy/ope");
    name;
    traits;
    input;
    output;
    symbol = iaA.symbol
  }
  var lr4 = (A, Q, B, G, Z) => Lq.assign(new iaA, {
    name: Q,
    namespace: A,
    traits: B,
    input: G,
    output: Z
  });
  class bNA extends Lq {
    static symbol = Symbol.for("@smithy/str");
    name;
    traits;
    memberNames;
    memberList;
    symbol = bNA.symbol
  }
  var ir4 = (A, Q, B, G, Z) => Lq.assign(new bNA, {
    name: Q,
    namespace: A,
    traits: B,
    memberNames: G,
    memberList: Z
  });
  class naA extends bNA {
    static symbol = Symbol.for("@smithy/err");
    ctor;
    symbol = naA.symbol
  }
  var nr4 = (A, Q, B, G, Z, Y) => Lq.assign(new naA, {
    name: Q,
    namespace: A,
    traits: B,
    memberNames: G,
    memberList: Z,
    ctor: null
  });

  function kNA(A) {
    if (typeof A === "object") return A;
    A = A | 0;
    let Q = {},
      B = 0;
    for (let G of ["httpLabel", "idempotent", "idempotencyToken", "sensitive", "httpPayload", "httpResponseCode", "httpQueryParams"])
      if ((A >> B++ & 1) === 1) Q[G] = 1;
    return Q
  }
  class mg {
    ref;
    memberName;
    static symbol = Symbol.for("@smithy/nor");
    symbol = mg.symbol;
    name;
    schema;
    _isMemberSchema;
    traits;
    memberTraits;
    normalizedTraits;
    constructor(A, Q) {
      this.ref = A, this.memberName = Q;
      let B = [],
        G = A,
        Z = A;
      this._isMemberSchema = !1;
      while (aS1(G)) B.push(G[1]), G = G[0], Z = caA(G), this._isMemberSchema = !0;
      if (B.length > 0) {
        this.memberTraits = {};
        for (let Y = B.length - 1; Y >= 0; --Y) {
          let J = B[Y];
          Object.assign(this.memberTraits, kNA(J))
        }
      } else this.memberTraits = 0;
      if (Z instanceof mg) {
        let Y = this.memberTraits;
        Object.assign(this, Z), this.memberTraits = Object.assign({}, Y, Z.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = Q ?? Z.memberName;
        return
      }
      if (this.schema = caA(Z), QNQ(this.schema)) this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3];
      else this.name = this.memberName ?? String(Z), this.traits = 0;
      if (this._isMemberSchema && !Q) throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`)
    }
    static[Symbol.hasInstance](A) {
      let Q = this.prototype.isPrototypeOf(A);
      if (!Q && typeof A === "object" && A !== null) return A.symbol === this.symbol;
      return Q
    }
    static of (A) {
      let Q = caA(A);
      if (Q instanceof mg) return Q;
      if (aS1(Q)) {
        let [B, G] = Q;
        if (B instanceof mg) return Object.assign(B.getMergedTraits(), kNA(G)), B;
        throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(A,null,2)}.`)
      }
      return new mg(Q)
    }
    getSchema() {
      let A = this.schema;
      if (A[0] === 0) return A[4];
      return A
    }
    getName(A = !1) {
      let {
        name: Q
      } = this;
      return !A && Q && Q.includes("#") ? Q.split("#")[1] : Q || void 0
    }
    getMemberName() {
      return this.memberName
    }
    isMemberSchema() {
      return this._isMemberSchema
    }
    isListSchema() {
      let A = this.getSchema();
      return typeof A === "number" ? A >= 64 && A < 128 : A[0] === 1
    }
    isMapSchema() {
      let A = this.getSchema();
      return typeof A === "number" ? A >= 128 && A <= 255 : A[0] === 2
    }
    isStructSchema() {
      let A = this.getSchema();
      return A[0] === 3 || A[0] === -3
    }
    isBlobSchema() {
      let A = this.getSchema();
      return A === 21 || A === 42
    }
    isTimestampSchema() {
      let A = this.getSchema();
      return typeof A === "number" && A >= 4 && A <= 7
    }
    isUnitSchema() {
      return this.getSchema() === "unit"
    }
    isDocumentSchema() {
      return this.getSchema() === 15
    }
    isStringSchema() {
      return this.getSchema() === 0
    }
    isBooleanSchema() {
      return this.getSchema() === 2
    }
    isNumericSchema() {
      return this.getSchema() === 1
    }
    isBigIntegerSchema() {
      return this.getSchema() === 17
    }
    isBigDecimalSchema() {
      return this.getSchema() === 19
    }
    isStreaming() {
      let {
        streaming: A
      } = this.getMergedTraits();
      return !!A || this.getSchema() === 42
    }
    isIdempotencyToken() {
      let A = (Z) => (Z & 4) === 4 || !!Z?.idempotencyToken,
        {
          normalizedTraits: Q,
          traits: B,
          memberTraits: G
        } = this;
      return A(Q) || A(B) || A(G)
    }
    getMergedTraits() {
      return this.normalizedTraits ?? (this.normalizedTraits = {
        ...this.getOwnTraits(),
        ...this.getMemberTraits()
      })
    }
    getMemberTraits() {
      return kNA(this.memberTraits)
    }
    getOwnTraits() {
      return kNA(this.traits)
    }
    getKeySchema() {
      let [A, Q] = [this.isDocumentSchema(), this.isMapSchema()];
      if (!A && !Q) throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
      let B = this.getSchema(),
        G = A ? 15 : B[4] ?? 0;
      return vNA([G, 0], "key")
    }
    getValueSchema() {
      let A = this.getSchema(),
        [Q, B, G] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()],
        Z = typeof A === "number" ? 63 & A : A && typeof A === "object" && (B || G) ? A[3 + A[0]] : Q ? 15 : void 0;
      if (Z != null) return vNA([Z, 0], B ? "value" : "member");
      throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`)
    }
    getMemberSchema(A) {
      let Q = this.getSchema();
      if (this.isStructSchema() && Q[4].includes(A)) {
        let B = Q[4].indexOf(A),
          G = Q[5][B];
        return vNA(aS1(G) ? G : [G, 0], A)
      }
      if (this.isDocumentSchema()) return vNA([15, 0], A);
      throw Error(`@smithy/core/schema - ${this.getName(!0)} has no no member=${A}.`)
    }
    getMemberSchemas() {
      let A = {};
      try {
        for (let [Q, B] of this.structIterator()) A[Q] = B
      } catch (Q) {}
      return A
    }
    getEventStreamMember() {
      if (this.isStructSchema()) {
        for (let [A, Q] of this.structIterator())
          if (Q.isStreaming() && Q.isStructSchema()) return A
      }
      return ""
    }* structIterator() {
      if (this.isUnitSchema()) return;
      if (!this.isStructSchema()) throw Error("@smithy/core/schema - cannot iterate non-struct schema.");
      let A = this.getSchema();
      for (let Q = 0; Q < A[4].length; ++Q) yield [A[4][Q], vNA([A[5][Q], 0], A[4][Q])]
    }
  }

  function vNA(A, Q) {
    if (A instanceof mg) return Object.assign(A, {
      memberName: Q,
      _isMemberSchema: !0
    });
    return new mg(A, Q)
  }
  var aS1 = (A) => Array.isArray(A) && A.length === 2,
    QNQ = (A) => Array.isArray(A) && A.length >= 5;
  class fNA extends Lq {
    static symbol = Symbol.for("@smithy/sim");
    name;
    schemaRef;
    traits;
    symbol = fNA.symbol
  }
  var ar4 = (A, Q, B, G) => Lq.assign(new fNA, {
      name: Q,
      namespace: A,
      traits: G,
      schemaRef: B
    }),
    or4 = (A, Q, B, G) => Lq.assign(new fNA, {
      name: Q,
      namespace: A,
      traits: B,
      schemaRef: G
    }),
    rr4 = {
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
    };
  class ug {
    namespace;
    schemas;
    exceptions;
    static registries = new Map;
    constructor(A, Q = new Map, B = new Map) {
      this.namespace = A, this.schemas = Q, this.exceptions = B
    }
    static
    for (A) {
      if (!ug.registries.has(A)) ug.registries.set(A, new ug(A));
      return ug.registries.get(A)
    }
    register(A, Q) {
      let B = this.normalizeShapeId(A);
      ug.for(B.split("#")[0]).schemas.set(B, Q)
    }
    getSchema(A) {
      let Q = this.normalizeShapeId(A);
      if (!this.schemas.has(Q)) throw Error(`@smithy/core/schema - schema not found for ${Q}`);
      return this.schemas.get(Q)
    }
    registerError(A, Q) {
      let B = A,
        G = ug.for(B[1]);
      G.schemas.set(B[1] + "#" + B[2], B), G.exceptions.set(B, Q)
    }
    getErrorCtor(A) {
      let Q = A;
      return ug.for(Q[1]).exceptions.get(Q)
    }
    getBaseException() {
      for (let A of this.exceptions.keys())
        if (Array.isArray(A)) {
          let [, Q, B] = A, G = Q + "#" + B;
          if (G.startsWith("smithy.ts.sdk.synthetic.") && G.endsWith("ServiceException")) return A
        } return
    }
    find(A) {
      return [...this.schemas.values()].find(A)
    }
    clear() {
      this.schemas.clear(), this.exceptions.clear()
    }
    normalizeShapeId(A) {
      if (A.includes("#")) return A;
      return this.namespace + "#" + A
    }
  }
  sr4.ErrorSchema = naA;
  sr4.ListSchema = paA;
  sr4.MapSchema = laA;
  sr4.NormalizedSchema = mg;
  sr4.OperationSchema = iaA;
  sr4.SCHEMA = rr4;
  sr4.Schema = Lq;
  sr4.SimpleSchema = fNA;
  sr4.StructureSchema = bNA;
  sr4.TypeRegistry = ug;
  sr4.deref = caA;
  sr4.deserializerMiddlewareOption = eqQ;
  sr4.error = nr4;
  sr4.getSchemaSerdePlugin = dr4;
  sr4.isStaticSchema = QNQ;
  sr4.list = cr4;
  sr4.map = pr4;
  sr4.op = lr4;
  sr4.operation = oS1;
  sr4.serializerMiddlewareOption = ANQ;
  sr4.sim = ar4;
  sr4.simAdapter = or4;
  sr4.struct = ir4;
  sr4.translateTraits = kNA
})
// @from(Ln 75669, Col 4)
LZ = U((_7G, raA) => {
  var BNQ, GNQ, ZNQ, YNQ, JNQ, XNQ, INQ, DNQ, WNQ, KNQ, VNQ, FNQ, HNQ, aaA, rS1, ENQ, zNQ, $NQ, iZA, CNQ, UNQ, qNQ, NNQ, wNQ, LNQ, ONQ, MNQ, RNQ, oaA, _NQ, jNQ, TNQ;
  (function (A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function (G) {
      A(B(Q, B(G)))
    });
    else if (typeof raA === "object" && typeof _7G === "object") A(B(Q, B(_7G)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function (Y, J) {
        return G[Y] = Z ? Z(Y, J) : J
      }
    }
  })(function (A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function (Y, J) {
      Y.__proto__ = J
    } || function (Y, J) {
      for (var X in J)
        if (Object.prototype.hasOwnProperty.call(J, X)) Y[X] = J[X]
    };
    BNQ = function (Y, J) {
      if (typeof J !== "function" && J !== null) throw TypeError("Class extends value " + String(J) + " is not a constructor or null");
      Q(Y, J);

      function X() {
        this.constructor = Y
      }
      Y.prototype = J === null ? Object.create(J) : (X.prototype = J.prototype, new X)
    }, GNQ = Object.assign || function (Y) {
      for (var J, X = 1, I = arguments.length; X < I; X++) {
        J = arguments[X];
        for (var D in J)
          if (Object.prototype.hasOwnProperty.call(J, D)) Y[D] = J[D]
      }
      return Y
    }, ZNQ = function (Y, J) {
      var X = {};
      for (var I in Y)
        if (Object.prototype.hasOwnProperty.call(Y, I) && J.indexOf(I) < 0) X[I] = Y[I];
      if (Y != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var D = 0, I = Object.getOwnPropertySymbols(Y); D < I.length; D++)
          if (J.indexOf(I[D]) < 0 && Object.prototype.propertyIsEnumerable.call(Y, I[D])) X[I[D]] = Y[I[D]]
      }
      return X
    }, YNQ = function (Y, J, X, I) {
      var D = arguments.length,
        W = D < 3 ? J : I === null ? I = Object.getOwnPropertyDescriptor(J, X) : I,
        K;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") W = Reflect.decorate(Y, J, X, I);
      else
        for (var V = Y.length - 1; V >= 0; V--)
          if (K = Y[V]) W = (D < 3 ? K(W) : D > 3 ? K(J, X, W) : K(J, X)) || W;
      return D > 3 && W && Object.defineProperty(J, X, W), W
    }, JNQ = function (Y, J) {
      return function (X, I) {
        J(X, I, Y)
      }
    }, XNQ = function (Y, J, X, I, D, W) {
      function K(j) {
        if (j !== void 0 && typeof j !== "function") throw TypeError("Function expected");
        return j
      }
      var V = I.kind,
        F = V === "getter" ? "get" : V === "setter" ? "set" : "value",
        H = !J && Y ? I.static ? Y : Y.prototype : null,
        E = J || (H ? Object.getOwnPropertyDescriptor(H, I.name) : {}),
        z, $ = !1;
      for (var O = X.length - 1; O >= 0; O--) {
        var L = {};
        for (var M in I) L[M] = M === "access" ? {} : I[M];
        for (var M in I.access) L.access[M] = I.access[M];
        L.addInitializer = function (j) {
          if ($) throw TypeError("Cannot add initializers after decoration has completed");
          W.push(K(j || null))
        };
        var _ = (0, X[O])(V === "accessor" ? {
          get: E.get,
          set: E.set
        } : E[F], L);
        if (V === "accessor") {
          if (_ === void 0) continue;
          if (_ === null || typeof _ !== "object") throw TypeError("Object expected");
          if (z = K(_.get)) E.get = z;
          if (z = K(_.set)) E.set = z;
          if (z = K(_.init)) D.unshift(z)
        } else if (z = K(_))
          if (V === "field") D.unshift(z);
          else E[F] = z
      }
      if (H) Object.defineProperty(H, I.name, E);
      $ = !0
    }, INQ = function (Y, J, X) {
      var I = arguments.length > 2;
      for (var D = 0; D < J.length; D++) X = I ? J[D].call(Y, X) : J[D].call(Y);
      return I ? X : void 0
    }, DNQ = function (Y) {
      return typeof Y === "symbol" ? Y : "".concat(Y)
    }, WNQ = function (Y, J, X) {
      if (typeof J === "symbol") J = J.description ? "[".concat(J.description, "]") : "";
      return Object.defineProperty(Y, "name", {
        configurable: !0,
        value: X ? "".concat(X, " ", J) : J
      })
    }, KNQ = function (Y, J) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(Y, J)
    }, VNQ = function (Y, J, X, I) {
      function D(W) {
        return W instanceof X ? W : new X(function (K) {
          K(W)
        })
      }
      return new(X || (X = Promise))(function (W, K) {
        function V(E) {
          try {
            H(I.next(E))
          } catch (z) {
            K(z)
          }
        }

        function F(E) {
          try {
            H(I.throw(E))
          } catch (z) {
            K(z)
          }
        }

        function H(E) {
          E.done ? W(E.value) : D(E.value).then(V, F)
        }
        H((I = I.apply(Y, J || [])).next())
      })
    }, FNQ = function (Y, J) {
      var X = {
          label: 0,
          sent: function () {
            if (W[0] & 1) throw W[1];
            return W[1]
          },
          trys: [],
          ops: []
        },
        I, D, W, K = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return K.next = V(0), K.throw = V(1), K.return = V(2), typeof Symbol === "function" && (K[Symbol.iterator] = function () {
        return this
      }), K;

      function V(H) {
        return function (E) {
          return F([H, E])
        }
      }

      function F(H) {
        if (I) throw TypeError("Generator is already executing.");
        while (K && (K = 0, H[0] && (X = 0)), X) try {
          if (I = 1, D && (W = H[0] & 2 ? D.return : H[0] ? D.throw || ((W = D.return) && W.call(D), 0) : D.next) && !(W = W.call(D, H[1])).done) return W;
          if (D = 0, W) H = [H[0] & 2, W.value];
          switch (H[0]) {
            case 0:
            case 1:
              W = H;
              break;
            case 4:
              return X.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              X.label++, D = H[1], H = [0];
              continue;
            case 7:
              H = X.ops.pop(), X.trys.pop();
              continue;
            default:
              if ((W = X.trys, !(W = W.length > 0 && W[W.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                X = 0;
                continue
              }
              if (H[0] === 3 && (!W || H[1] > W[0] && H[1] < W[3])) {
                X.label = H[1];
                break
              }
              if (H[0] === 6 && X.label < W[1]) {
                X.label = W[1], W = H;
                break
              }
              if (W && X.label < W[2]) {
                X.label = W[2], X.ops.push(H);
                break
              }
              if (W[2]) X.ops.pop();
              X.trys.pop();
              continue
          }
          H = J.call(Y, X)
        } catch (E) {
          H = [6, E], D = 0
        } finally {
          I = W = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, HNQ = function (Y, J) {
      for (var X in Y)
        if (X !== "default" && !Object.prototype.hasOwnProperty.call(J, X)) oaA(J, Y, X)
    }, oaA = Object.create ? function (Y, J, X, I) {
      if (I === void 0) I = X;
      var D = Object.getOwnPropertyDescriptor(J, X);
      if (!D || ("get" in D ? !J.__esModule : D.writable || D.configurable)) D = {
        enumerable: !0,
        get: function () {
          return J[X]
        }
      };
      Object.defineProperty(Y, I, D)
    } : function (Y, J, X, I) {
      if (I === void 0) I = X;
      Y[I] = J[X]
    }, aaA = function (Y) {
      var J = typeof Symbol === "function" && Symbol.iterator,
        X = J && Y[J],
        I = 0;
      if (X) return X.call(Y);
      if (Y && typeof Y.length === "number") return {
        next: function () {
          if (Y && I >= Y.length) Y = void 0;
          return {
            value: Y && Y[I++],
            done: !Y
          }
        }
      };
      throw TypeError(J ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, rS1 = function (Y, J) {
      var X = typeof Symbol === "function" && Y[Symbol.iterator];
      if (!X) return Y;
      var I = X.call(Y),
        D, W = [],
        K;
      try {
        while ((J === void 0 || J-- > 0) && !(D = I.next()).done) W.push(D.value)
      } catch (V) {
        K = {
          error: V
        }
      } finally {
        try {
          if (D && !D.done && (X = I.return)) X.call(I)
        } finally {
          if (K) throw K.error
        }
      }
      return W
    }, ENQ = function () {
      for (var Y = [], J = 0; J < arguments.length; J++) Y = Y.concat(rS1(arguments[J]));
      return Y
    }, zNQ = function () {
      for (var Y = 0, J = 0, X = arguments.length; J < X; J++) Y += arguments[J].length;
      for (var I = Array(Y), D = 0, J = 0; J < X; J++)
        for (var W = arguments[J], K = 0, V = W.length; K < V; K++, D++) I[D] = W[K];
      return I
    }, $NQ = function (Y, J, X) {
      if (X || arguments.length === 2) {
        for (var I = 0, D = J.length, W; I < D; I++)
          if (W || !(I in J)) {
            if (!W) W = Array.prototype.slice.call(J, 0, I);
            W[I] = J[I]
          }
      }
      return Y.concat(W || Array.prototype.slice.call(J))
    }, iZA = function (Y) {
      return this instanceof iZA ? (this.v = Y, this) : new iZA(Y)
    }, CNQ = function (Y, J, X) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var I = X.apply(Y, J || []),
        D, W = [];
      return D = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), V("next"), V("throw"), V("return", K), D[Symbol.asyncIterator] = function () {
        return this
      }, D;

      function K(O) {
        return function (L) {
          return Promise.resolve(L).then(O, z)
        }
      }

      function V(O, L) {
        if (I[O]) {
          if (D[O] = function (M) {
              return new Promise(function (_, j) {
                W.push([O, M, _, j]) > 1 || F(O, M)
              })
            }, L) D[O] = L(D[O])
        }
      }

      function F(O, L) {
        try {
          H(I[O](L))
        } catch (M) {
          $(W[0][3], M)
        }
      }

      function H(O) {
        O.value instanceof iZA ? Promise.resolve(O.value.v).then(E, z) : $(W[0][2], O)
      }

      function E(O) {
        F("next", O)
      }

      function z(O) {
        F("throw", O)
      }

      function $(O, L) {
        if (O(L), W.shift(), W.length) F(W[0][0], W[0][1])
      }
    }, UNQ = function (Y) {
      var J, X;
      return J = {}, I("next"), I("throw", function (D) {
        throw D
      }), I("return"), J[Symbol.iterator] = function () {
        return this
      }, J;

      function I(D, W) {
        J[D] = Y[D] ? function (K) {
          return (X = !X) ? {
            value: iZA(Y[D](K)),
            done: !1
          } : W ? W(K) : K
        } : W
      }
    }, qNQ = function (Y) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var J = Y[Symbol.asyncIterator],
        X;
      return J ? J.call(Y) : (Y = typeof aaA === "function" ? aaA(Y) : Y[Symbol.iterator](), X = {}, I("next"), I("throw"), I("return"), X[Symbol.asyncIterator] = function () {
        return this
      }, X);

      function I(W) {
        X[W] = Y[W] && function (K) {
          return new Promise(function (V, F) {
            K = Y[W](K), D(V, F, K.done, K.value)
          })
        }
      }

      function D(W, K, V, F) {
        Promise.resolve(F).then(function (H) {
          W({
            value: H,
            done: V
          })
        }, K)
      }
    }, NNQ = function (Y, J) {
      if (Object.defineProperty) Object.defineProperty(Y, "raw", {
        value: J
      });
      else Y.raw = J;
      return Y
    };
    var B = Object.create ? function (Y, J) {
        Object.defineProperty(Y, "default", {
          enumerable: !0,
          value: J
        })
      } : function (Y, J) {
        Y.default = J
      },
      G = function (Y) {
        return G = Object.getOwnPropertyNames || function (J) {
          var X = [];
          for (var I in J)
            if (Object.prototype.hasOwnProperty.call(J, I)) X[X.length] = I;
          return X
        }, G(Y)
      };
    wNQ = function (Y) {
      if (Y && Y.__esModule) return Y;
      var J = {};
      if (Y != null) {
        for (var X = G(Y), I = 0; I < X.length; I++)
          if (X[I] !== "default") oaA(J, Y, X[I])
      }
      return B(J, Y), J
    }, LNQ = function (Y) {
      return Y && Y.__esModule ? Y : {
        default: Y
      }
    }, ONQ = function (Y, J, X, I) {
      if (X === "a" && !I) throw TypeError("Private accessor was defined without a getter");
      if (typeof J === "function" ? Y !== J || !I : !J.has(Y)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return X === "m" ? I : X === "a" ? I.call(Y) : I ? I.value : J.get(Y)
    }, MNQ = function (Y, J, X, I, D) {
      if (I === "m") throw TypeError("Private method is not writable");
      if (I === "a" && !D) throw TypeError("Private accessor was defined without a setter");
      if (typeof J === "function" ? Y !== J || !D : !J.has(Y)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return I === "a" ? D.call(Y, X) : D ? D.value = X : J.set(Y, X), X
    }, RNQ = function (Y, J) {
      if (J === null || typeof J !== "object" && typeof J !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof Y === "function" ? J === Y : Y.has(J)
    }, _NQ = function (Y, J, X) {
      if (J !== null && J !== void 0) {
        if (typeof J !== "object" && typeof J !== "function") throw TypeError("Object expected.");
        var I, D;
        if (X) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          I = J[Symbol.asyncDispose]
        }
        if (I === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (I = J[Symbol.dispose], X) D = I
        }
        if (typeof I !== "function") throw TypeError("Object not disposable.");
        if (D) I = function () {
          try {
            D.call(this)
          } catch (W) {
            return Promise.reject(W)
          }
        };
        Y.stack.push({
          value: J,
          dispose: I,
          async: X
        })
      } else if (X) Y.stack.push({
        async: !0
      });
      return J
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function (Y, J, X) {
      var I = Error(X);
      return I.name = "SuppressedError", I.error = Y, I.suppressed = J, I
    };
    jNQ = function (Y) {
      function J(W) {
        Y.error = Y.hasError ? new Z(W, Y.error, "An error was suppressed during disposal.") : W, Y.hasError = !0
      }
      var X, I = 0;

      function D() {
        while (X = Y.stack.pop()) try {
          if (!X.async && I === 1) return I = 0, Y.stack.push(X), Promise.resolve().then(D);
          if (X.dispose) {
            var W = X.dispose.call(X.value);
            if (X.async) return I |= 2, Promise.resolve(W).then(D, function (K) {
              return J(K), D()
            })
          } else I |= 1
        } catch (K) {
          J(K)
        }
        if (I === 1) return Y.hasError ? Promise.reject(Y.error) : Promise.resolve();
        if (Y.hasError) throw Y.error
      }
      return D()
    }, TNQ = function (Y, J) {
      if (typeof Y === "string" && /^\.\.?\//.test(Y)) return Y.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (X, I, D, W, K) {
        return I ? J ? ".jsx" : ".js" : D && (!W || !K) ? X : D + W + "." + K.toLowerCase() + "js"
      });
      return Y
    }, A("__extends", BNQ), A("__assign", GNQ), A("__rest", ZNQ), A("__decorate", YNQ), A("__param", JNQ), A("__esDecorate", XNQ), A("__runInitializers", INQ), A("__propKey", DNQ), A("__setFunctionName", WNQ), A("__metadata", KNQ), A("__awaiter", VNQ), A("__generator", FNQ), A("__exportStar", HNQ), A("__createBinding", oaA), A("__values", aaA), A("__read", rS1), A("__spread", ENQ), A("__spreadArrays", zNQ), A("__spreadArray", $NQ), A("__await", iZA), A("__asyncGenerator", CNQ), A("__asyncDelegator", UNQ), A("__asyncValues", qNQ), A("__makeTemplateObject", NNQ), A("__importStar", wNQ), A("__importDefault", LNQ), A("__classPrivateFieldGet", ONQ), A("__classPrivateFieldSet", MNQ), A("__classPrivateFieldIn", RNQ), A("__addDisposableResource", _NQ), A("__disposeResources", jNQ), A("__rewriteRelativeImportExtension", TNQ)
  })
})
// @from(Ln 76155, Col 4)
yNQ = U((SNQ) => {
  Object.defineProperty(SNQ, "__esModule", {
    value: !0
  });
  SNQ.randomUUID = void 0;
  var ws4 = LZ(),
    PNQ = ws4.__importDefault(NA("crypto"));
  SNQ.randomUUID = PNQ.default.randomUUID.bind(PNQ.default)
})
// @from(Ln 76164, Col 4)
sS1 = U((Os4) => {
  var vNQ = yNQ(),
    Xz = Array.from({
      length: 256
    }, (A, Q) => Q.toString(16).padStart(2, "0")),
    Ls4 = () => {
      if (vNQ.randomUUID) return vNQ.randomUUID();
      let A = new Uint8Array(16);
      return crypto.getRandomValues(A), A[6] = A[6] & 15 | 64, A[8] = A[8] & 63 | 128, Xz[A[0]] + Xz[A[1]] + Xz[A[2]] + Xz[A[3]] + "-" + Xz[A[4]] + Xz[A[5]] + "-" + Xz[A[6]] + Xz[A[7]] + "-" + Xz[A[8]] + Xz[A[9]] + "-" + Xz[A[10]] + Xz[A[11]] + Xz[A[12]] + Xz[A[13]] + Xz[A[14]] + Xz[A[15]]
    };
  Os4.v4 = Ls4
})