
// @from(Ln 102071, Col 4)
bhQ = U((X13) => {
  X13.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(X13.HttpAuthLocation || (X13.HttpAuthLocation = {}));
  X13.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(X13.HttpApiKeyAuthLocation || (X13.HttpApiKeyAuthLocation = {}));
  X13.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(X13.EndpointURLScheme || (X13.EndpointURLScheme = {}));
  X13.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(X13.AlgorithmId || (X13.AlgorithmId = {}));
  var B13 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => X13.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => X13.AlgorithmId.MD5,
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
    G13 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    Z13 = (A) => {
      return B13(A)
    },
    Y13 = (A) => {
      return G13(A)
    };
  X13.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(X13.FieldPosition || (X13.FieldPosition = {}));
  var J13 = "__smithy_context";
  X13.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(X13.IniSectionType || (X13.IniSectionType = {}));
  X13.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(X13.RequestHandlerProtocol || (X13.RequestHandlerProtocol = {}));
  X13.SMITHY_CONTEXT_KEY = J13;
  X13.getDefaultClientConfiguration = Z13;
  X13.resolveDefaultRuntimeConfig = Y13
})
// @from(Ln 102136, Col 4)
uhQ = U((z13) => {
  var K13 = bhQ(),
    V13 = (A) => {
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
    F13 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class fhQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = K13.FieldPosition.HEADER,
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
  class hhQ {
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
  class OsA {
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
      let Q = new OsA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = H13(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return OsA.clone(this)
    }
  }

  function H13(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class ghQ {
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

  function E13(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  z13.Field = fhQ;
  z13.Fields = hhQ;
  z13.HttpRequest = OsA;
  z13.HttpResponse = ghQ;
  z13.getHttpHandlerExtensionConfiguration = V13;
  z13.isValidHostname = E13;
  z13.resolveHttpHandlerRuntimeConfig = F13
})
// @from(Ln 102278, Col 4)
ihQ = U((R13) => {
  var mhQ = uhQ();

  function O13(A) {
    let {
      signer: Q,
      signer: B
    } = A, G = Object.assign(A, {
      eventSigner: Q,
      messageSigner: B
    }), Z = G.eventStreamPayloadHandlerProvider(G);
    return Object.assign(G, {
      eventStreamPayloadHandler: Z
    })
  }
  var dhQ = (A) => (Q, B) => async (G) => {
    let {
      request: Z
    } = G;
    if (!mhQ.HttpRequest.isInstance(Z)) return Q(G);
    return A.eventStreamPayloadHandler.handle(Q, G, B)
  }, chQ = {
    tags: ["EVENT_STREAM", "SIGNATURE", "HANDLE"],
    name: "eventStreamHandlingMiddleware",
    relation: "after",
    toMiddleware: "awsAuthMiddleware",
    override: !0
  }, phQ = (A) => async (Q) => {
    let {
      request: B
    } = Q;
    if (!mhQ.HttpRequest.isInstance(B)) return A(Q);
    return B.headers = {
      ...B.headers,
      "content-type": "application/vnd.amazon.eventstream",
      "x-amz-content-sha256": "STREAMING-AWS4-HMAC-SHA256-EVENTS"
    }, A({
      ...Q,
      request: B
    })
  }, lhQ = {
    step: "build",
    tags: ["EVENT_STREAM", "HEADER", "CONTENT_TYPE", "CONTENT_SHA256"],
    name: "eventStreamHeaderMiddleware",
    override: !0
  }, M13 = (A) => ({
    applyToStack: (Q) => {
      Q.addRelativeTo(dhQ(A), chQ), Q.add(phQ, lhQ)
    }
  });
  R13.eventStreamHandlingMiddleware = dhQ;
  R13.eventStreamHandlingMiddlewareOptions = chQ;
  R13.eventStreamHeaderMiddleware = phQ;
  R13.eventStreamHeaderMiddlewareOptions = lhQ;
  R13.getEventStreamPlugin = M13;
  R13.resolveEventStreamConfig = O13
})
// @from(Ln 102335, Col 4)
ohQ = U((SYG, ahQ) => {
  var {
    defineProperty: MsA,
    getOwnPropertyDescriptor: y13,
    getOwnPropertyNames: v13
  } = Object, k13 = Object.prototype.hasOwnProperty, b13 = (A, Q) => MsA(A, "name", {
    value: Q,
    configurable: !0
  }), f13 = (A, Q) => {
    for (var B in Q) MsA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, h13 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of v13(Q))
        if (!k13.call(A, Z) && Z !== B) MsA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = y13(Q, Z)) || G.enumerable
        })
    }
    return A
  }, g13 = (A) => h13(MsA({}, "__esModule", {
    value: !0
  }), A), nhQ = {};
  f13(nhQ, {
    isArrayBuffer: () => u13
  });
  ahQ.exports = g13(nhQ);
  var u13 = b13((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 102366, Col 4)
v0A = U((xYG, thQ) => {
  var {
    defineProperty: RsA,
    getOwnPropertyDescriptor: m13,
    getOwnPropertyNames: d13
  } = Object, c13 = Object.prototype.hasOwnProperty, rhQ = (A, Q) => RsA(A, "name", {
    value: Q,
    configurable: !0
  }), p13 = (A, Q) => {
    for (var B in Q) RsA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, l13 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of d13(Q))
        if (!c13.call(A, Z) && Z !== B) RsA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = m13(Q, Z)) || G.enumerable
        })
    }
    return A
  }, i13 = (A) => l13(RsA({}, "__esModule", {
    value: !0
  }), A), shQ = {};
  p13(shQ, {
    fromArrayBuffer: () => a13,
    fromString: () => o13
  });
  thQ.exports = i13(shQ);
  var n13 = ohQ(),
    Ku1 = NA("buffer"),
    a13 = rhQ((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, n13.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Ku1.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    o13 = rhQ((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Ku1.Buffer.from(A, Q) : Ku1.Buffer.from(A)
    }, "fromString")
})
// @from(Ln 102407, Col 4)
GgQ = U((yYG, BgQ) => {
  var {
    defineProperty: _sA,
    getOwnPropertyDescriptor: r13,
    getOwnPropertyNames: s13
  } = Object, t13 = Object.prototype.hasOwnProperty, Vu1 = (A, Q) => _sA(A, "name", {
    value: Q,
    configurable: !0
  }), e13 = (A, Q) => {
    for (var B in Q) _sA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, A03 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of s13(Q))
        if (!t13.call(A, Z) && Z !== B) _sA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = r13(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Q03 = (A) => A03(_sA({}, "__esModule", {
    value: !0
  }), A), ehQ = {};
  e13(ehQ, {
    fromUtf8: () => QgQ,
    toUint8Array: () => B03,
    toUtf8: () => G03
  });
  BgQ.exports = Q03(ehQ);
  var AgQ = v0A(),
    QgQ = Vu1((A) => {
      let Q = (0, AgQ.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    B03 = Vu1((A) => {
      if (typeof A === "string") return QgQ(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    G03 = Vu1((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, AgQ.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Ln 102454, Col 4)
JgQ = U((ZgQ) => {
  Object.defineProperty(ZgQ, "__esModule", {
    value: !0
  });
  ZgQ.convertToBuffer = void 0;
  var Z03 = GgQ(),
    Y03 = typeof Buffer < "u" && Buffer.from ? function (A) {
      return Buffer.from(A, "utf8")
    } : Z03.fromUtf8;

  function J03(A) {
    if (A instanceof Uint8Array) return A;
    if (typeof A === "string") return Y03(A);
    if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(A)
  }
  ZgQ.convertToBuffer = J03
})
// @from(Ln 102472, Col 4)
DgQ = U((XgQ) => {
  Object.defineProperty(XgQ, "__esModule", {
    value: !0
  });
  XgQ.isEmptyData = void 0;

  function X03(A) {
    if (typeof A === "string") return A.length === 0;
    return A.byteLength === 0
  }
  XgQ.isEmptyData = X03
})
// @from(Ln 102484, Col 4)
VgQ = U((WgQ) => {
  Object.defineProperty(WgQ, "__esModule", {
    value: !0
  });
  WgQ.numToUint8 = void 0;

  function I03(A) {
    return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
  }
  WgQ.numToUint8 = I03
})
// @from(Ln 102495, Col 4)
EgQ = U((FgQ) => {
  Object.defineProperty(FgQ, "__esModule", {
    value: !0
  });
  FgQ.uint32ArrayFrom = void 0;

  function D03(A) {
    if (!Uint32Array.from) {
      var Q = new Uint32Array(A.length),
        B = 0;
      while (B < A.length) Q[B] = A[B], B += 1;
      return Q
    }
    return Uint32Array.from(A)
  }
  FgQ.uint32ArrayFrom = D03
})
// @from(Ln 102512, Col 4)
Fu1 = U((mYA) => {
  Object.defineProperty(mYA, "__esModule", {
    value: !0
  });
  mYA.uint32ArrayFrom = mYA.numToUint8 = mYA.isEmptyData = mYA.convertToBuffer = void 0;
  var W03 = JgQ();
  Object.defineProperty(mYA, "convertToBuffer", {
    enumerable: !0,
    get: function () {
      return W03.convertToBuffer
    }
  });
  var K03 = DgQ();
  Object.defineProperty(mYA, "isEmptyData", {
    enumerable: !0,
    get: function () {
      return K03.isEmptyData
    }
  });
  var V03 = VgQ();
  Object.defineProperty(mYA, "numToUint8", {
    enumerable: !0,
    get: function () {
      return V03.numToUint8
    }
  });
  var F03 = EgQ();
  Object.defineProperty(mYA, "uint32ArrayFrom", {
    enumerable: !0,
    get: function () {
      return F03.uint32ArrayFrom
    }
  })
})
// @from(Ln 102546, Col 4)
qgQ = U((CgQ) => {
  Object.defineProperty(CgQ, "__esModule", {
    value: !0
  });
  CgQ.AwsCrc32 = void 0;
  var zgQ = LZ(),
    Hu1 = Fu1(),
    $gQ = Eu1(),
    E03 = function () {
      function A() {
        this.crc32 = new $gQ.Crc32
      }
      return A.prototype.update = function (Q) {
        if ((0, Hu1.isEmptyData)(Q)) return;
        this.crc32.update((0, Hu1.convertToBuffer)(Q))
      }, A.prototype.digest = function () {
        return zgQ.__awaiter(this, void 0, void 0, function () {
          return zgQ.__generator(this, function (Q) {
            return [2, (0, Hu1.numToUint8)(this.crc32.digest())]
          })
        })
      }, A.prototype.reset = function () {
        this.crc32 = new $gQ.Crc32
      }, A
    }();
  CgQ.AwsCrc32 = E03
})
// @from(Ln 102573, Col 4)
Eu1 = U((zu1) => {
  Object.defineProperty(zu1, "__esModule", {
    value: !0
  });
  zu1.AwsCrc32 = zu1.Crc32 = zu1.crc32 = void 0;
  var z03 = LZ(),
    $03 = Fu1();

  function C03(A) {
    return new NgQ().update(A).digest()
  }
  zu1.crc32 = C03;
  var NgQ = function () {
    function A() {
      this.checksum = 4294967295
    }
    return A.prototype.update = function (Q) {
      var B, G;
      try {
        for (var Z = z03.__values(Q), Y = Z.next(); !Y.done; Y = Z.next()) {
          var J = Y.value;
          this.checksum = this.checksum >>> 8 ^ q03[(this.checksum ^ J) & 255]
        }
      } catch (X) {
        B = {
          error: X
        }
      } finally {
        try {
          if (Y && !Y.done && (G = Z.return)) G.call(Z)
        } finally {
          if (B) throw B.error
        }
      }
      return this
    }, A.prototype.digest = function () {
      return (this.checksum ^ 4294967295) >>> 0
    }, A
  }();
  zu1.Crc32 = NgQ;
  var U03 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
    q03 = (0, $03.uint32ArrayFrom)(U03),
    N03 = qgQ();
  Object.defineProperty(zu1, "AwsCrc32", {
    enumerable: !0,
    get: function () {
      return N03.AwsCrc32
    }
  })
})
// @from(Ln 102623, Col 4)
LgQ = U((_03) => {
  var wgQ = {},
    $u1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    wgQ[A] = Q, $u1[Q] = A
  }

  function M03(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in $u1) Q[B / 2] = $u1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }

  function R03(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += wgQ[A[B]];
    return Q
  }
  _03.fromHex = M03;
  _03.toHex = R03
})
// @from(Ln 102651, Col 4)
twA = U((m03) => {
  var RgQ = Eu1(),
    k0A = LgQ();
  class dYA {
    bytes;
    constructor(A) {
      if (this.bytes = A, A.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
    }
    static fromNumber(A) {
      if (A > 9223372036854776000 || A < -9223372036854776000) throw Error(`${A} is too large (or, if negative, too small) to represent as an Int64`);
      let Q = new Uint8Array(8);
      for (let B = 7, G = Math.abs(Math.round(A)); B > -1 && G > 0; B--, G /= 256) Q[B] = G;
      if (A < 0) OgQ(Q);
      return new dYA(Q)
    }
    valueOf() {
      let A = this.bytes.slice(0),
        Q = A[0] & 128;
      if (Q) OgQ(A);
      return parseInt(k0A.toHex(A), 16) * (Q ? -1 : 1)
    }
    toString() {
      return String(this.valueOf())
    }
  }

  function OgQ(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  class Cu1 {
    toUtf8;
    fromUtf8;
    constructor(A, Q) {
      this.toUtf8 = A, this.fromUtf8 = Q
    }
    format(A) {
      let Q = [];
      for (let Z of Object.keys(A)) {
        let Y = this.fromUtf8(Z);
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
          let J = this.fromUtf8(A.value),
            X = new DataView(new ArrayBuffer(3 + J.byteLength));
          X.setUint8(0, 7), X.setUint16(1, J.byteLength, !1);
          let I = new Uint8Array(X.buffer);
          return I.set(J, 3), I;
        case "timestamp":
          let D = new Uint8Array(9);
          return D[0] = 8, D.set(dYA.fromNumber(A.value.valueOf()).bytes, 1), D;
        case "uuid":
          if (!h03.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
          let W = new Uint8Array(17);
          return W[0] = 9, W.set(k0A.fromHex(A.value.replace(/\-/g, "")), 1), W
      }
    }
    parse(A) {
      let Q = {},
        B = 0;
      while (B < A.byteLength) {
        let G = A.getUint8(B++),
          Z = this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + B, G));
        switch (B += G, A.getUint8(B++)) {
          case 0:
            Q[Z] = {
              type: MgQ,
              value: !0
            };
            break;
          case 1:
            Q[Z] = {
              type: MgQ,
              value: !1
            };
            break;
          case 2:
            Q[Z] = {
              type: P03,
              value: A.getInt8(B++)
            };
            break;
          case 3:
            Q[Z] = {
              type: S03,
              value: A.getInt16(B, !1)
            }, B += 2;
            break;
          case 4:
            Q[Z] = {
              type: x03,
              value: A.getInt32(B, !1)
            }, B += 4;
            break;
          case 5:
            Q[Z] = {
              type: y03,
              value: new dYA(new Uint8Array(A.buffer, A.byteOffset + B, 8))
            }, B += 8;
            break;
          case 6:
            let Y = A.getUint16(B, !1);
            B += 2, Q[Z] = {
              type: v03,
              value: new Uint8Array(A.buffer, A.byteOffset + B, Y)
            }, B += Y;
            break;
          case 7:
            let J = A.getUint16(B, !1);
            B += 2, Q[Z] = {
              type: k03,
              value: this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + B, J))
            }, B += J;
            break;
          case 8:
            Q[Z] = {
              type: b03,
              value: new Date(new dYA(new Uint8Array(A.buffer, A.byteOffset + B, 8)).valueOf())
            }, B += 8;
            break;
          case 9:
            let X = new Uint8Array(A.buffer, A.byteOffset + B, 16);
            B += 16, Q[Z] = {
              type: f03,
              value: `${k0A.toHex(X.subarray(0,4))}-${k0A.toHex(X.subarray(4,6))}-${k0A.toHex(X.subarray(6,8))}-${k0A.toHex(X.subarray(8,10))}-${k0A.toHex(X.subarray(10))}`
            };
            break;
          default:
            throw Error("Unrecognized header type tag")
        }
      }
      return Q
    }
  }
  var MgQ = "boolean",
    P03 = "byte",
    S03 = "short",
    x03 = "integer",
    y03 = "long",
    v03 = "binary",
    k03 = "string",
    b03 = "timestamp",
    f03 = "uuid",
    h03 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    _gQ = 4,
    Fn = _gQ * 2,
    b0A = 4,
    g03 = Fn + b0A * 2;

  function u03({
    byteLength: A,
    byteOffset: Q,
    buffer: B
  }) {
    if (A < g03) throw Error("Provided message too short to accommodate event stream message overhead");
    let G = new DataView(B, Q, A),
      Z = G.getUint32(0, !1);
    if (A !== Z) throw Error("Reported message length does not match received message length");
    let Y = G.getUint32(_gQ, !1),
      J = G.getUint32(Fn, !1),
      X = G.getUint32(A - b0A, !1),
      I = new RgQ.Crc32().update(new Uint8Array(B, Q, Fn));
    if (J !== I.digest()) throw Error(`The prelude checksum specified in the message (${J}) does not match the calculated CRC32 checksum (${I.digest()})`);
    if (I.update(new Uint8Array(B, Q + Fn, A - (Fn + b0A))), X !== I.digest()) throw Error(`The message checksum (${I.digest()}) did not match the expected value of ${X}`);
    return {
      headers: new DataView(B, Q + Fn + b0A, Y),
      body: new Uint8Array(B, Q + Fn + b0A + Y, Z - Y - (Fn + b0A + b0A))
    }
  }
  class jgQ {
    headerMarshaller;
    messageBuffer;
    isEndOfStream;
    constructor(A, Q) {
      this.headerMarshaller = new Cu1(A, Q), this.messageBuffer = [], this.isEndOfStream = !1
    }
    feed(A) {
      this.messageBuffer.push(this.decode(A))
    }
    endOfStream() {
      this.isEndOfStream = !0
    }
    getMessage() {
      let A = this.messageBuffer.pop(),
        Q = this.isEndOfStream;
      return {
        getMessage() {
          return A
        },
        isEndOfStream() {
          return Q
        }
      }
    }
    getAvailableMessages() {
      let A = this.messageBuffer;
      this.messageBuffer = [];
      let Q = this.isEndOfStream;
      return {
        getMessages() {
          return A
        },
        isEndOfStream() {
          return Q
        }
      }
    }
    encode({
      headers: A,
      body: Q
    }) {
      let B = this.headerMarshaller.format(A),
        G = B.byteLength + Q.byteLength + 16,
        Z = new Uint8Array(G),
        Y = new DataView(Z.buffer, Z.byteOffset, Z.byteLength),
        J = new RgQ.Crc32;
      return Y.setUint32(0, G, !1), Y.setUint32(4, B.byteLength, !1), Y.setUint32(8, J.update(Z.subarray(0, 8)).digest(), !1), Z.set(B, 12), Z.set(Q, B.byteLength + 12), Y.setUint32(G - 4, J.update(Z.subarray(8, G - 4)).digest(), !1), Z
    }
    decode(A) {
      let {
        headers: Q,
        body: B
      } = u03(A);
      return {
        headers: this.headerMarshaller.parse(Q),
        body: B
      }
    }
    formatHeaders(A) {
      return this.headerMarshaller.format(A)
    }
  }
  class TgQ {
    options;
    constructor(A) {
      this.options = A
    } [Symbol.asyncIterator]() {
      return this.asyncIterator()
    }
    async * asyncIterator() {
      for await (let A of this.options.inputStream) yield this.options.decoder.decode(A)
    }
  }
  class PgQ {
    options;
    constructor(A) {
      this.options = A
    } [Symbol.asyncIterator]() {
      return this.asyncIterator()
    }
    async * asyncIterator() {
      for await (let A of this.options.messageStream) yield this.options.encoder.encode(A);
      if (this.options.includeEndFrame) yield new Uint8Array(0)
    }
  }
  class SgQ {
    options;
    constructor(A) {
      this.options = A
    } [Symbol.asyncIterator]() {
      return this.asyncIterator()
    }
    async * asyncIterator() {
      for await (let A of this.options.messageStream) {
        let Q = await this.options.deserializer(A);
        if (Q === void 0) continue;
        yield Q
      }
    }
  }
  class xgQ {
    options;
    constructor(A) {
      this.options = A
    } [Symbol.asyncIterator]() {
      return this.asyncIterator()
    }
    async * asyncIterator() {
      for await (let A of this.options.inputStream) yield this.options.serializer(A)
    }
  }
  m03.EventStreamCodec = jgQ;
  m03.HeaderMarshaller = Cu1;
  m03.Int64 = dYA;
  m03.MessageDecoderStream = TgQ;
  m03.MessageEncoderStream = PgQ;
  m03.SmithyMessageDecoderStream = SgQ;
  m03.SmithyMessageEncoderStream = xgQ
})
// @from(Ln 102966, Col 4)
vgQ = U((s03) => {
  var ygQ = {},
    Uu1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    ygQ[A] = Q, Uu1[Q] = A
  }

  function o03(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in Uu1) Q[B / 2] = Uu1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }

  function r03(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += ygQ[A[B]];
    return Q
  }
  s03.fromHex = o03;
  s03.toHex = r03
})
// @from(Ln 102994, Col 4)
kgQ = U((YQ3) => {
  YQ3.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(YQ3.HttpAuthLocation || (YQ3.HttpAuthLocation = {}));
  YQ3.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(YQ3.HttpApiKeyAuthLocation || (YQ3.HttpApiKeyAuthLocation = {}));
  YQ3.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(YQ3.EndpointURLScheme || (YQ3.EndpointURLScheme = {}));
  YQ3.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(YQ3.AlgorithmId || (YQ3.AlgorithmId = {}));
  var AQ3 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => YQ3.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => YQ3.AlgorithmId.MD5,
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
    QQ3 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    BQ3 = (A) => {
      return AQ3(A)
    },
    GQ3 = (A) => {
      return QQ3(A)
    };
  YQ3.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(YQ3.FieldPosition || (YQ3.FieldPosition = {}));
  var ZQ3 = "__smithy_context";
  YQ3.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(YQ3.IniSectionType || (YQ3.IniSectionType = {}));
  YQ3.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(YQ3.RequestHandlerProtocol || (YQ3.RequestHandlerProtocol = {}));
  YQ3.SMITHY_CONTEXT_KEY = ZQ3;
  YQ3.getDefaultClientConfiguration = BQ3;
  YQ3.resolveDefaultRuntimeConfig = GQ3
})
// @from(Ln 103059, Col 4)
Ru1 = U((HQ3) => {
  var DQ3 = kgQ(),
    WQ3 = (A) => {
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
    KQ3 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class bgQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = DQ3.FieldPosition.HEADER,
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
  class fgQ {
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
  class jsA {
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
      let Q = new jsA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = VQ3(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return jsA.clone(this)
    }
  }

  function VQ3(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class hgQ {
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

  function FQ3(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  HQ3.Field = bgQ;
  HQ3.Fields = fgQ;
  HQ3.HttpRequest = jsA;
  HQ3.HttpResponse = hgQ;
  HQ3.getHttpHandlerExtensionConfiguration = WQ3;
  HQ3.isValidHostname = FQ3;
  HQ3.resolveHttpHandlerRuntimeConfig = KQ3
})
// @from(Ln 103201, Col 4)
ugQ = U((OQ3) => {
  var ggQ = (A) => encodeURIComponent(A).replace(/[!'()*]/g, wQ3),
    wQ3 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
    LQ3 = (A) => A.split("/").map(ggQ).join("/");
  OQ3.escapeUri = ggQ;
  OQ3.escapeUriPath = LQ3
})
// @from(Ln 103208, Col 4)
mgQ = U((jQ3) => {
  var _u1 = ugQ();

  function _Q3(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = _u1.escapeUri(B), Array.isArray(G))
        for (let Z = 0, Y = G.length; Z < Y; Z++) Q.push(`${B}=${_u1.escapeUri(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${_u1.escapeUri(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  jQ3.buildQueryString = _Q3
})
// @from(Ln 103227, Col 4)
dgQ = U((xQ3) => {
  var PQ3 = mgQ();

  function SQ3(A) {
    let {
      port: Q,
      query: B
    } = A, {
      protocol: G,
      path: Z,
      hostname: Y
    } = A;
    if (G && G.slice(-1) !== ":") G += ":";
    if (Q) Y += `:${Q}`;
    if (Z && Z.charAt(0) !== "/") Z = `/${Z}`;
    let J = B ? PQ3.buildQueryString(B) : "";
    if (J && J[0] !== "?") J = `?${J}`;
    let X = "";
    if (A.username != null || A.password != null) {
      let D = A.username ?? "",
        W = A.password ?? "";
      X = `${D}:${W}@`
    }
    let I = "";
    if (A.fragment) I = `#${A.fragment}`;
    return `${G}//${X}${Y}${Z}${J}${I}`
  }
  xQ3.formatUrl = SQ3
})
// @from(Ln 103256, Col 4)
cgQ = U((fQ3) => {
  var ALA = twA();

  function vQ3(A) {
    let Q = 0,
      B = 0,
      G = null,
      Z = null,
      Y = (X) => {
        if (typeof X !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + X);
        Q = X, B = 4, G = new Uint8Array(X), new DataView(G.buffer).setUint32(0, X, !1)
      },
      J = async function* () {
        let X = A[Symbol.asyncIterator]();
        while (!0) {
          let {
            value: I,
            done: D
          } = await X.next();
          if (D) {
            if (!Q) return;
            else if (Q === B) yield G;
            else throw Error("Truncated event message received.");
            return
          }
          let W = I.length,
            K = 0;
          while (K < W) {
            if (!G) {
              let F = W - K;
              if (!Z) Z = new Uint8Array(4);
              let H = Math.min(4 - B, F);
              if (Z.set(I.slice(K, K + H), B), B += H, K += H, B < 4) break;
              Y(new DataView(Z.buffer).getUint32(0, !1)), Z = null
            }
            let V = Math.min(Q - B, W - K);
            if (G.set(I.slice(K, K + V), B), B += V, K += V, Q && Q === B) yield G, G = null, Q = 0, B = 0
          }
        }
      };
    return {
      [Symbol.asyncIterator]: J
    }
  }

  function kQ3(A, Q) {
    return async function (B) {
      let {
        value: G
      } = B.headers[":message-type"];
      if (G === "error") {
        let Z = Error(B.headers[":error-message"].value || "UnknownError");
        throw Z.name = B.headers[":error-code"].value, Z
      } else if (G === "exception") {
        let Z = B.headers[":exception-type"].value,
          Y = {
            [Z]: B
          },
          J = await A(Y);
        if (J.$unknown) {
          let X = Error(Q(B.body));
          throw X.name = Z, X
        }
        throw J[Z]
      } else if (G === "event") {
        let Z = {
            [B.headers[":event-type"].value]: B
          },
          Y = await A(Z);
        if (Y.$unknown) return;
        return Y
      } else throw Error(`Unrecognizable event type: ${B.headers[":event-type"].value}`)
    }
  }
  class ju1 {
    eventStreamCodec;
    utfEncoder;
    constructor({
      utf8Encoder: A,
      utf8Decoder: Q
    }) {
      this.eventStreamCodec = new ALA.EventStreamCodec(A, Q), this.utfEncoder = A
    }
    deserialize(A, Q) {
      let B = vQ3(A);
      return new ALA.SmithyMessageDecoderStream({
        messageStream: new ALA.MessageDecoderStream({
          inputStream: B,
          decoder: this.eventStreamCodec
        }),
        deserializer: kQ3(Q, this.utfEncoder)
      })
    }
    serialize(A, Q) {
      return new ALA.MessageEncoderStream({
        messageStream: new ALA.SmithyMessageEncoderStream({
          inputStream: A,
          serializer: Q
        }),
        encoder: this.eventStreamCodec,
        includeEndFrame: !0
      })
    }
  }
  var bQ3 = (A) => new ju1(A);
  fQ3.EventStreamMarshaller = ju1;
  fQ3.eventStreamSerdeProvider = bQ3
})
// @from(Ln 103364, Col 4)
igQ = U((cQ3) => {
  var uQ3 = cgQ(),
    pgQ = (A) => ({
      [Symbol.asyncIterator]: async function* () {
        let Q = A.getReader();
        try {
          while (!0) {
            let {
              done: B,
              value: G
            } = await Q.read();
            if (B) return;
            yield G
          }
        } finally {
          Q.releaseLock()
        }
      }
    }),
    lgQ = (A) => {
      let Q = A[Symbol.asyncIterator]();
      return new ReadableStream({
        async pull(B) {
          let {
            done: G,
            value: Z
          } = await Q.next();
          if (G) return B.close();
          B.enqueue(Z)
        }
      })
    };
  class Tu1 {
    universalMarshaller;
    constructor({
      utf8Encoder: A,
      utf8Decoder: Q
    }) {
      this.universalMarshaller = new uQ3.EventStreamMarshaller({
        utf8Decoder: Q,
        utf8Encoder: A
      })
    }
    deserialize(A, Q) {
      let B = mQ3(A) ? pgQ(A) : A;
      return this.universalMarshaller.deserialize(B, Q)
    }
    serialize(A, Q) {
      let B = this.universalMarshaller.serialize(A, Q);
      return typeof ReadableStream === "function" ? lgQ(B) : B
    }
  }
  var mQ3 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream,
    dQ3 = (A) => new Tu1(A);
  cQ3.EventStreamMarshaller = Tu1;
  cQ3.eventStreamSerdeProvider = dQ3;
  cQ3.iterableToReadableStream = lgQ;
  cQ3.readableStreamtoIterable = pgQ
})
// @from(Ln 103423, Col 4)
agQ = U((rQ3) => {
  var ngQ = (A) => encodeURIComponent(A).replace(/[!'()*]/g, aQ3),
    aQ3 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
    oQ3 = (A) => A.split("/").map(ngQ).join("/");
  rQ3.escapeUri = ngQ;
  rQ3.escapeUriPath = oQ3
})
// @from(Ln 103430, Col 4)
ogQ = U((AB3) => {
  var Pu1 = agQ();

  function eQ3(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = Pu1.escapeUri(B), Array.isArray(G))
        for (let Z = 0, Y = G.length; Z < Y; Z++) Q.push(`${B}=${Pu1.escapeUri(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${Pu1.escapeUri(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  AB3.buildQueryString = eQ3
})
// @from(Ln 103449, Col 4)
rgQ = U((GB3) => {
  var BB3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  GB3.isArrayBuffer = BB3
})
// @from(Ln 103453, Col 4)
xu1 = U((IB3) => {
  var YB3 = rgQ(),
    Su1 = NA("buffer"),
    JB3 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!YB3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Su1.Buffer.from(A, Q, B)
    },
    XB3 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Su1.Buffer.from(A, Q) : Su1.Buffer.from(A)
    };
  IB3.fromArrayBuffer = JB3;
  IB3.fromString = XB3
})
// @from(Ln 103467, Col 4)
egQ = U((sgQ) => {
  Object.defineProperty(sgQ, "__esModule", {
    value: !0
  });
  sgQ.fromBase64 = void 0;
  var KB3 = xu1(),
    VB3 = /^[A-Za-z0-9+/]*={0,2}$/,
    FB3 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!VB3.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, KB3.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  sgQ.fromBase64 = FB3
})
// @from(Ln 103482, Col 4)
BuQ = U((AuQ) => {
  Object.defineProperty(AuQ, "__esModule", {
    value: !0
  });
  AuQ.toBase64 = void 0;
  var HB3 = xu1(),
    EB3 = oG(),
    zB3 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, EB3.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, HB3.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  AuQ.toBase64 = zB3
})
// @from(Ln 103498, Col 4)
YuQ = U((QLA) => {
  var GuQ = egQ(),
    ZuQ = BuQ();
  Object.keys(GuQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(QLA, A)) Object.defineProperty(QLA, A, {
      enumerable: !0,
      get: function () {
        return GuQ[A]
      }
    })
  });
  Object.keys(ZuQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(QLA, A)) Object.defineProperty(QLA, A, {
      enumerable: !0,
      get: function () {
        return ZuQ[A]
      }
    })
  })
})
// @from(Ln 103518, Col 4)
IuQ = U((OB3) => {
  var JuQ = Ru1(),
    $B3 = ogQ(),
    CB3 = YuQ();

  function XuQ(A, Q) {
    return new Request(A, Q)
  }

  function UB3(A = 0) {
    return new Promise((Q, B) => {
      if (A) setTimeout(() => {
        let G = Error(`Request did not complete within ${A} ms`);
        G.name = "TimeoutError", B(G)
      }, A)
    })
  }
  var TsA = {
    supported: void 0
  };
  class yu1 {
    config;
    configProvider;
    static create(A) {
      if (typeof A?.handle === "function") return A;
      return new yu1(A)
    }
    constructor(A) {
      if (typeof A === "function") this.configProvider = A().then((Q) => Q || {});
      else this.config = A ?? {}, this.configProvider = Promise.resolve(this.config);
      if (TsA.supported === void 0) TsA.supported = Boolean(typeof Request < "u" && "keepalive" in XuQ("https://[::1]"))
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
        X = $B3.buildQueryString(A.query || {});
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
      if (TsA.supported) F.keepalive = Z;
      if (typeof this.config.requestInit === "function") Object.assign(F, this.config.requestInit(A));
      let H = () => {},
        E = XuQ(K, F),
        z = [fetch(E).then(($) => {
          let O = $.headers,
            L = {};
          for (let _ of O.entries()) L[_[0]] = _[1];
          if ($.body == null) return $.blob().then((_) => ({
            response: new JuQ.HttpResponse({
              headers: L,
              reason: $.statusText,
              statusCode: $.status,
              body: _
            })
          }));
          return {
            response: new JuQ.HttpResponse({
              headers: L,
              reason: $.statusText,
              statusCode: $.status,
              body: $.body
            })
          }
        }), UB3(G)];
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
  var qB3 = async (A) => {
    if (typeof Blob === "function" && A instanceof Blob || A.constructor?.name === "Blob") {
      if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await A.arrayBuffer());
      return NB3(A)
    }
    return wB3(A)
  };
  async function NB3(A) {
    let Q = await LB3(A),
      B = CB3.fromBase64(Q);
    return new Uint8Array(B)
  }
  async function wB3(A) {
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

  function LB3(A) {
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
  OB3.FetchHttpHandler = yu1;
  OB3.keepAliveSupport = TsA;
  OB3.streamCollector = qB3
})
// @from(Ln 103680, Col 4)
HuQ = U((pB3) => {
  var jB3 = twA(),
    TB3 = vgQ(),
    vu1 = Ru1(),
    PB3 = dgQ(),
    WuQ = igQ(),
    DuQ = IuQ(),
    SB3 = (A, Q, B, G) => {
      let Z = A,
        Y = {
          start() {},
          async transform(J, X) {
            try {
              let I = new Date(Date.now() + await G()),
                D = {
                  ":date": {
                    type: "timestamp",
                    value: I
                  }
                },
                W = await Q.sign({
                  message: {
                    body: J,
                    headers: D
                  },
                  priorSignature: Z
                }, {
                  signingDate: I
                });
              Z = W.signature;
              let K = B.encode({
                headers: {
                  ...D,
                  ":chunk-signature": {
                    type: "binary",
                    value: TB3.fromHex(W.signature)
                  }
                },
                body: J
              });
              X.enqueue(K)
            } catch (I) {
              X.error(I)
            }
          }
        };
      return new TransformStream({
        ...Y
      })
    };
  class KuQ {
    messageSigner;
    eventStreamCodec;
    systemClockOffsetProvider;
    constructor(A) {
      this.messageSigner = A.messageSigner, this.eventStreamCodec = new jB3.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
    }
    async handle(A, Q, B = {}) {
      let G = Q.request,
        {
          body: Z,
          headers: Y,
          query: J
        } = G;
      if (!(Z instanceof ReadableStream)) throw Error("Eventstream payload must be a ReadableStream.");
      let X = new TransformStream;
      G.body = X.readable;
      let I;
      try {
        I = await A(Q)
      } catch (F) {
        throw G.body.cancel(), F
      }
      let W = ((Y.authorization || "").match(/Signature=([\w]+)$/) || [])[1] || J && J["X-Amz-Signature"] || "",
        K = SB3(W, await this.messageSigner(), this.eventStreamCodec, this.systemClockOffsetProvider);
      return Z.pipeThrough(K).pipeThrough(X), I
    }
  }
  var xB3 = (A) => new KuQ(A),
    yB3 = () => (A) => async (Q) => {
      let B = {
          ...Q.input
        },
        G = await A(Q),
        Z = G.output;
      if (B.SessionId && Z.SessionId == null) Z.SessionId = B.SessionId;
      return G
    }, vB3 = {
      step: "initialize",
      name: "injectSessionIdMiddleware",
      tags: ["WEBSOCKET", "EVENT_STREAM"],
      override: !0
    }, kB3 = (A, Q) => (B) => (G) => {
      let {
        request: Z
      } = G;
      if (vu1.HttpRequest.isInstance(Z) && A.requestHandler.metadata?.handlerProtocol?.toLowerCase().includes("websocket")) {
        Z.protocol = "wss:", Z.method = "GET", Z.path = `${Z.path}-websocket`;
        let {
          headers: Y
        } = Z;
        delete Y["content-type"], delete Y["x-amz-content-sha256"];
        for (let J of Object.keys(Y))
          if (J.indexOf(Q.headerPrefix) === 0) {
            let X = J.replace(Q.headerPrefix, "");
            Z.query[X] = Y[J]
          } if (Y["x-amz-user-agent"]) Z.query["user-agent"] = Y["x-amz-user-agent"];
        Z.headers = {
          host: Y.host ?? Z.hostname
        }
      }
      return B(G)
    }, bB3 = {
      name: "websocketEndpointMiddleware",
      tags: ["WEBSOCKET", "EVENT_STREAM"],
      relation: "after",
      toMiddleware: "eventStreamHeaderMiddleware",
      override: !0
    }, fB3 = (A, Q) => ({
      applyToStack: (B) => {
        B.addRelativeTo(kB3(A, Q), bB3), B.add(yB3(), vB3)
      }
    }), VuQ = (A) => A.protocol === "ws:" || A.protocol === "wss:";
  class FuQ {
    signer;
    constructor(A) {
      this.signer = A.signer
    }
    presign(A, Q = {}) {
      return this.signer.presign(A, Q)
    }
    async sign(A, Q) {
      if (vu1.HttpRequest.isInstance(A) && VuQ(A)) return {
        ...await this.signer.presign({
          ...A,
          body: ""
        }, {
          ...Q,
          expiresIn: 60,
          unsignableHeaders: new Set(Object.keys(A.headers).filter((G) => G !== "host"))
        }),
        body: A.body
      };
      else return this.signer.sign(A, Q)
    }
  }
  var hB3 = (A) => {
      let {
        signer: Q
      } = A;
      return Object.assign(A, {
        signer: async (B) => {
          let G = await Q(B);
          if (gB3(G)) return new FuQ({
            signer: G
          });
          throw Error("Expected WebsocketSignatureV4 signer, please check the client constructor.")
        }
      })
    },
    gB3 = (A) => !!A,
    uB3 = 2000;
  class ku1 {
    metadata = {
      handlerProtocol: "websocket/h1.1"
    };
    config;
    configPromise;
    httpHandler;
    sockets = {};
    static create(A, Q = new DuQ.FetchHttpHandler) {
      if (typeof A?.handle === "function") return A;
      return new ku1(A, Q)
    }
    constructor(A, Q = new DuQ.FetchHttpHandler) {
      if (this.httpHandler = Q, typeof A === "function") this.config = {}, this.configPromise = A().then((B) => this.config = B ?? {});
      else this.config = A ?? {}, this.configPromise = Promise.resolve(this.config)
    }
    destroy() {
      for (let [A, Q] of Object.entries(this.sockets)) {
        for (let B of Q) B.close(1000, "Socket closed through destroy() call");
        delete this.sockets[A]
      }
    }
    async handle(A) {
      if (!VuQ(A)) return this.httpHandler.handle(A);
      let Q = PB3.formatUrl(A),
        B = new WebSocket(Q);
      if (!this.sockets[Q]) this.sockets[Q] = [];
      this.sockets[Q].push(B), B.binaryType = "arraybuffer", this.config = await this.configPromise;
      let {
        connectionTimeout: G = uB3
      } = this.config;
      await this.waitForReady(B, G);
      let {
        body: Z
      } = A, Y = mB3(Z), J = this.connect(B, Y), X = dB3(J);
      return {
        response: new vu1.HttpResponse({
          statusCode: 200,
          body: X
        })
      }
    }
    updateHttpClientConfig(A, Q) {
      this.configPromise = this.configPromise.then((B) => {
        return B[A] = Q, B
      })
    }
    httpHandlerConfigs() {
      return this.config ?? {}
    }
    removeNotUsableSockets(A) {
      this.sockets[A] = (this.sockets[A] ?? []).filter((Q) => ![WebSocket.CLOSING, WebSocket.CLOSED].includes(Q.readyState))
    }
    waitForReady(A, Q) {
      return new Promise((B, G) => {
        let Z = setTimeout(() => {
          this.removeNotUsableSockets(A.url), G({
            $metadata: {
              httpStatusCode: 500
            }
          })
        }, Q);
        A.onopen = () => {
          clearTimeout(Z), B()
        }
      })
    }
    connect(A, Q) {
      let B = void 0,
        G = !1,
        Z = () => {},
        Y = () => {};
      A.onmessage = (I) => {
        Y({
          done: !1,
          value: new Uint8Array(I.data)
        })
      }, A.onerror = (I) => {
        G = !0, A.close(), Z(I)
      }, A.onclose = () => {
        if (this.removeNotUsableSockets(A.url), G) return;
        if (B) Z(B);
        else Y({
          done: !0,
          value: void 0
        })
      };
      let J = {
        [Symbol.asyncIterator]: () => ({
          next: () => {
            return new Promise((I, D) => {
              Y = I, Z = D
            })
          }
        })
      };
      return (async () => {
        try {
          for await (let I of Q) A.send(I)
        } catch (I) {
          B = I
        } finally {
          A.close(1000)
        }
      })(), J
    }
  }
  var mB3 = (A) => {
      if (A[Symbol.asyncIterator]) return A;
      if (cB3(A)) return WuQ.readableStreamtoIterable(A);
      return {
        [Symbol.asyncIterator]: async function* () {
          yield A
        }
      }
    },
    dB3 = (A) => typeof ReadableStream === "function" ? WuQ.iterableToReadableStream(A) : A,
    cB3 = (A) => typeof ReadableStream === "function" && A instanceof ReadableStream;
  pB3.WebSocketFetchHandler = ku1;
  pB3.eventStreamPayloadHandlerProvider = xB3;
  pB3.getWebSocketPlugin = fB3;
  pB3.resolveWebSocketConfig = hB3
})
// @from(Ln 103965, Col 4)
EuQ = U((rB3) => {
  var oB3 = (A) => Object.assign(A, {
    eventStreamMarshaller: A.eventStreamSerdeProvider(A)
  });
  rB3.resolveEventStreamSerdeConfig = oB3
})
// @from(Ln 103971, Col 4)
du1 = U((G23) => {
  G23.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(G23.HttpAuthLocation || (G23.HttpAuthLocation = {}));
  G23.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(G23.HttpApiKeyAuthLocation || (G23.HttpApiKeyAuthLocation = {}));
  G23.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(G23.EndpointURLScheme || (G23.EndpointURLScheme = {}));
  G23.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(G23.AlgorithmId || (G23.AlgorithmId = {}));
  var tB3 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => G23.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => G23.AlgorithmId.MD5,
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
    eB3 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    A23 = (A) => {
      return tB3(A)
    },
    Q23 = (A) => {
      return eB3(A)
    };
  G23.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(G23.FieldPosition || (G23.FieldPosition = {}));
  var B23 = "__smithy_context";
  G23.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(G23.IniSectionType || (G23.IniSectionType = {}));
  G23.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(G23.RequestHandlerProtocol || (G23.RequestHandlerProtocol = {}));
  G23.SMITHY_CONTEXT_KEY = B23;
  G23.getDefaultClientConfiguration = A23;
  G23.resolveDefaultRuntimeConfig = Q23
})
// @from(Ln 104036, Col 4)
GLA = U((pYA) => {
  var CuQ = Ev(),
    nu1 = Mq(),
    pu1 = du1(),
    X23 = WX(),
    zuQ = Oq();
  class UuQ {
    config;
    middlewareStack = CuQ.constructStack();
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
  var cu1 = "***SensitiveInformation***";

  function lu1(A, Q) {
    if (Q == null) return Q;
    let B = X23.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return cu1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return cu1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return cu1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = lu1(J, G[Y]);
      return Z
    }
    return Q
  }
  class au1 {
    middlewareStack = CuQ.constructStack();
    schema;
    static classBuilder() {
      return new quQ
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
          [pu1.SMITHY_CONTEXT_KEY]: {
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
  class quQ {
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
      return Q = class extends au1 {
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
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? lu1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? lu1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var I23 = "***SensitiveInformation***",
    D23 = (A, Q) => {
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
  class cYA extends Error {
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
      return cYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === cYA) return cYA.isInstance(A);
      if (cYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var NuQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    wuQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = K23(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw NuQ(J, Q)
    },
    W23 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        wuQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    K23 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    V23 = (A) => {
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
    $uQ = !1,
    F23 = (A) => {
      if (A && !$uQ && parseInt(A.substring(1, A.indexOf("."))) < 16) $uQ = !0
    },
    H23 = (A) => {
      let Q = [];
      for (let B in pu1.AlgorithmId) {
        let G = pu1.AlgorithmId[B];
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
    E23 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    z23 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    $23 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    LuQ = (A) => {
      return Object.assign(H23(A), z23(A))
    },
    C23 = LuQ,
    U23 = (A) => {
      return Object.assign(E23(A), $23(A))
    },
    q23 = (A) => Array.isArray(A) ? A : [A],
    OuQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = OuQ(A[B]);
      return A
    },
    N23 = (A) => {
      return A != null
    };
  class MuQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function RuQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, O23(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      _uQ(G, null, Y, J)
    }
    return G
  }
  var w23 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    L23 = (A, Q) => {
      let B = {};
      for (let G in Q) _uQ(B, A, Q, G);
      return B
    },
    O23 = (A, Q, B) => {
      return RuQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    _uQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = M23, I = R23, D = G] = J;
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
    M23 = (A) => A != null,
    R23 = (A) => A,
    _23 = (A) => {
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
    j23 = (A) => A.toISOString().replace(".000Z", "Z"),
    iu1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(iu1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = iu1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(pYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return nu1.collectBody
    }
  });
  Object.defineProperty(pYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return nu1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(pYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return nu1.resolvedPath
    }
  });
  pYA.Client = UuQ;
  pYA.Command = au1;
  pYA.NoOpLogger = MuQ;
  pYA.SENSITIVE_STRING = I23;
  pYA.ServiceException = cYA;
  pYA._json = iu1;
  pYA.convertMap = w23;
  pYA.createAggregatedClient = D23;
  pYA.decorateServiceException = NuQ;
  pYA.emitWarningIfUnsupportedVersion = F23;
  pYA.getArrayIfSingleItem = q23;
  pYA.getDefaultClientConfiguration = C23;
  pYA.getDefaultExtensionConfiguration = LuQ;
  pYA.getValueFromTextNode = OuQ;
  pYA.isSerializableHeaderValue = N23;
  pYA.loadConfigsForDefaultMode = V23;
  pYA.map = RuQ;
  pYA.resolveDefaultRuntimeConfig = U23;
  pYA.serializeDateTime = j23;
  pYA.serializeFloat = _23;
  pYA.take = L23;
  pYA.throwDefaultError = wuQ;
  pYA.withBaseException = W23;
  Object.keys(zuQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(pYA, A)) Object.defineProperty(pYA, A, {
      enumerable: !0,
      get: function () {
        return zuQ[A]
      }
    })
  })
})
// @from(Ln 104506, Col 4)
su1 = U((juQ) => {
  Object.defineProperty(juQ, "__esModule", {
    value: !0
  });
  juQ.resolveHttpAuthSchemeConfig = juQ.defaultBedrockRuntimeHttpAuthSchemeProvider = juQ.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = void 0;
  var t23 = hY(),
    ou1 = rG(),
    ru1 = Jz(),
    e23 = async (A, Q, B) => {
      return {
        operation: (0, ru1.getSmithyContext)(Q).operation,
        region: await (0, ru1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  juQ.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = e23;

  function A93(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "bedrock",
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

  function Q93(A) {
    return {
      schemeId: "smithy.api#httpBearerAuth",
      propertiesExtractor: ({
        profile: Q,
        filepath: B,
        configFilepath: G,
        ignoreCache: Z
      }, Y) => ({
        identityProperties: {
          profile: Q,
          filepath: B,
          configFilepath: G,
          ignoreCache: Z
        }
      })
    }
  }
  var B93 = (A) => {
    let Q = [];
    switch (A.operation) {
      default:
        Q.push(A93(A)), Q.push(Q93(A))
    }
    return Q
  };
  juQ.defaultBedrockRuntimeHttpAuthSchemeProvider = B93;
  var G93 = (A) => {
    let Q = (0, ou1.memoizeIdentityProvider)(A.token, ou1.isIdentityExpired, ou1.doesIdentityRequireRefresh),
      B = (0, t23.resolveAwsSdkSigV4Config)(A);
    return Object.assign(B, {
      authSchemePreference: (0, ru1.normalizeProvider)(A.authSchemePreference ?? []),
      token: Q
    })
  };
  juQ.resolveHttpAuthSchemeConfig = G93
})
// @from(Ln 104577, Col 4)
PuQ = U((HJG, J93) => {
  J93.exports = {
    name: "@aws-sdk/client-bedrock-runtime",
    description: "AWS SDK for JavaScript Bedrock Runtime Client for Node.js, Browser and React Native",
    version: "3.936.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-bedrock-runtime",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo bedrock-runtime"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.936.0",
      "@aws-sdk/credential-provider-node": "3.936.0",
      "@aws-sdk/eventstream-handler-node": "3.936.0",
      "@aws-sdk/middleware-eventstream": "3.936.0",
      "@aws-sdk/middleware-host-header": "3.936.0",
      "@aws-sdk/middleware-logger": "3.936.0",
      "@aws-sdk/middleware-recursion-detection": "3.936.0",
      "@aws-sdk/middleware-user-agent": "3.936.0",
      "@aws-sdk/middleware-websocket": "3.936.0",
      "@aws-sdk/region-config-resolver": "3.936.0",
      "@aws-sdk/token-providers": "3.936.0",
      "@aws-sdk/types": "3.936.0",
      "@aws-sdk/util-endpoints": "3.936.0",
      "@aws-sdk/util-user-agent-browser": "3.936.0",
      "@aws-sdk/util-user-agent-node": "3.936.0",
      "@smithy/config-resolver": "^4.4.3",
      "@smithy/core": "^3.18.5",
      "@smithy/eventstream-serde-browser": "^4.2.5",
      "@smithy/eventstream-serde-config-resolver": "^4.3.5",
      "@smithy/eventstream-serde-node": "^4.2.5",
      "@smithy/fetch-http-handler": "^5.3.6",
      "@smithy/hash-node": "^4.2.5",
      "@smithy/invalid-dependency": "^4.2.5",
      "@smithy/middleware-content-length": "^4.2.5",
      "@smithy/middleware-endpoint": "^4.3.12",
      "@smithy/middleware-retry": "^4.4.12",
      "@smithy/middleware-serde": "^4.2.6",
      "@smithy/middleware-stack": "^4.2.5",
      "@smithy/node-config-provider": "^4.3.5",
      "@smithy/node-http-handler": "^4.4.5",
      "@smithy/protocol-http": "^5.3.5",
      "@smithy/smithy-client": "^4.9.8",
      "@smithy/types": "^4.9.0",
      "@smithy/url-parser": "^4.2.5",
      "@smithy/util-base64": "^4.3.0",
      "@smithy/util-body-length-browser": "^4.2.0",
      "@smithy/util-body-length-node": "^4.2.1",
      "@smithy/util-defaults-mode-browser": "^4.3.11",
      "@smithy/util-defaults-mode-node": "^4.2.14",
      "@smithy/util-endpoints": "^3.2.5",
      "@smithy/util-middleware": "^4.2.5",
      "@smithy/util-retry": "^4.2.5",
      "@smithy/util-stream": "^4.5.6",
      "@smithy/util-utf8": "^4.2.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
      "@types/node": "^18.19.69",
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.8.3"
    },
    engines: {
      node: ">=18.0.0"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["dist-*/**"],
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    browser: {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
    },
    "react-native": {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
    },
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-bedrock-runtime",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-bedrock-runtime"
    }
  }
})
// @from(Ln 104682, Col 4)
yuQ = U((W93) => {
  var X93 = twA(),
    PsA = NA("stream");
  class SuQ extends PsA.Transform {
    priorSignature;
    messageSigner;
    eventStreamCodec;
    systemClockOffsetProvider;
    constructor(A) {
      super({
        autoDestroy: !0,
        readableObjectMode: !0,
        writableObjectMode: !0,
        ...A
      });
      this.priorSignature = A.priorSignature, this.eventStreamCodec = A.eventStreamCodec, this.messageSigner = A.messageSigner, this.systemClockOffsetProvider = A.systemClockOffsetProvider
    }
    async _transform(A, Q, B) {
      try {
        let G = new Date(Date.now() + await this.systemClockOffsetProvider()),
          Z = {
            ":date": {
              type: "timestamp",
              value: G
            }
          },
          Y = await this.messageSigner.sign({
            message: {
              body: A,
              headers: Z
            },
            priorSignature: this.priorSignature
          }, {
            signingDate: G
          });
        this.priorSignature = Y.signature;
        let J = this.eventStreamCodec.encode({
          headers: {
            ...Z,
            ":chunk-signature": {
              type: "binary",
              value: I93(Y.signature)
            }
          },
          body: A
        });
        return this.push(J), B()
      } catch (G) {
        B(G)
      }
    }
  }

  function I93(A) {
    let Q = Buffer.from(A, "hex");
    return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
  }
  class xuQ {
    messageSigner;
    eventStreamCodec;
    systemClockOffsetProvider;
    constructor(A) {
      this.messageSigner = A.messageSigner, this.eventStreamCodec = new X93.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
    }
    async handle(A, Q, B = {}) {
      let G = Q.request,
        {
          body: Z,
          query: Y
        } = G;
      if (!(Z instanceof PsA.Readable)) throw Error("Eventstream payload must be a Readable stream.");
      let J = Z;
      G.body = new PsA.PassThrough({
        objectMode: !0
      });
      let I = G.headers?.authorization?.match(/Signature=([\w]+)$/)?.[1] ?? Y?.["X-Amz-Signature"] ?? "",
        D = new SuQ({
          priorSignature: I,
          eventStreamCodec: this.eventStreamCodec,
          messageSigner: await this.messageSigner(),
          systemClockOffsetProvider: this.systemClockOffsetProvider
        });
      PsA.pipeline(J, D, G.body, (K) => {
        if (K) throw K
      });
      let W;
      try {
        W = await A(Q)
      } catch (K) {
        throw G.body.end(), K
      }
      return W
    }
  }
  var D93 = (A) => new xuQ(A);
  W93.eventStreamPayloadHandlerProvider = D93
})
// @from(Ln 104779, Col 4)
vuQ = U((E93) => {
  var ZLA = twA();

  function V93(A) {
    let Q = 0,
      B = 0,
      G = null,
      Z = null,
      Y = (X) => {
        if (typeof X !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + X);
        Q = X, B = 4, G = new Uint8Array(X), new DataView(G.buffer).setUint32(0, X, !1)
      },
      J = async function* () {
        let X = A[Symbol.asyncIterator]();
        while (!0) {
          let {
            value: I,
            done: D
          } = await X.next();
          if (D) {
            if (!Q) return;
            else if (Q === B) yield G;
            else throw Error("Truncated event message received.");
            return
          }
          let W = I.length,
            K = 0;
          while (K < W) {
            if (!G) {
              let F = W - K;
              if (!Z) Z = new Uint8Array(4);
              let H = Math.min(4 - B, F);
              if (Z.set(I.slice(K, K + H), B), B += H, K += H, B < 4) break;
              Y(new DataView(Z.buffer).getUint32(0, !1)), Z = null
            }
            let V = Math.min(Q - B, W - K);
            if (G.set(I.slice(K, K + V), B), B += V, K += V, Q && Q === B) yield G, G = null, Q = 0, B = 0
          }
        }
      };
    return {
      [Symbol.asyncIterator]: J
    }
  }

  function F93(A, Q) {
    return async function (B) {
      let {
        value: G
      } = B.headers[":message-type"];
      if (G === "error") {
        let Z = Error(B.headers[":error-message"].value || "UnknownError");
        throw Z.name = B.headers[":error-code"].value, Z
      } else if (G === "exception") {
        let Z = B.headers[":exception-type"].value,
          Y = {
            [Z]: B
          },
          J = await A(Y);
        if (J.$unknown) {
          let X = Error(Q(B.body));
          throw X.name = Z, X
        }
        throw J[Z]
      } else if (G === "event") {
        let Z = {
            [B.headers[":event-type"].value]: B
          },
          Y = await A(Z);
        if (Y.$unknown) return;
        return Y
      } else throw Error(`Unrecognizable event type: ${B.headers[":event-type"].value}`)
    }
  }
  class tu1 {
    eventStreamCodec;
    utfEncoder;
    constructor({
      utf8Encoder: A,
      utf8Decoder: Q
    }) {
      this.eventStreamCodec = new ZLA.EventStreamCodec(A, Q), this.utfEncoder = A
    }
    deserialize(A, Q) {
      let B = V93(A);
      return new ZLA.SmithyMessageDecoderStream({
        messageStream: new ZLA.MessageDecoderStream({
          inputStream: B,
          decoder: this.eventStreamCodec
        }),
        deserializer: F93(Q, this.utfEncoder)
      })
    }
    serialize(A, Q) {
      return new ZLA.MessageEncoderStream({
        messageStream: new ZLA.SmithyMessageEncoderStream({
          inputStream: A,
          serializer: Q
        }),
        encoder: this.eventStreamCodec,
        includeEndFrame: !0
      })
    }
  }
  var H93 = (A) => new tu1(A);
  E93.EventStreamMarshaller = tu1;
  E93.eventStreamSerdeProvider = H93
})
// @from(Ln 104887, Col 4)
kuQ = U((w93) => {
  var C93 = vuQ(),
    U93 = NA("stream");
  async function* q93(A) {
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
      let Z = await new Promise((Y) => setTimeout(() => Y(G.shift()), 0));
      if (Z) yield Z;
      B = Q && G.length === 0
    }
  }
  class eu1 {
    universalMarshaller;
    constructor({
      utf8Encoder: A,
      utf8Decoder: Q
    }) {
      this.universalMarshaller = new C93.EventStreamMarshaller({
        utf8Decoder: Q,
        utf8Encoder: A
      })
    }
    deserialize(A, Q) {
      let B = typeof A[Symbol.asyncIterator] === "function" ? A : q93(A);
      return this.universalMarshaller.deserialize(B, Q)
    }
    serialize(A, Q) {
      return U93.Readable.from(this.universalMarshaller.serialize(A, Q))
    }
  }
  var N93 = (A) => new eu1(A);
  w93.EventStreamMarshaller = eu1;
  w93.eventStreamSerdeProvider = N93
})
// @from(Ln 104931, Col 4)
buQ = U((R93) => {
  var M93 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  R93.isArrayBuffer = M93
})
// @from(Ln 104935, Col 4)
Qm1 = U((S93) => {
  var j93 = buQ(),
    Am1 = NA("buffer"),
    T93 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!j93.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Am1.Buffer.from(A, Q, B)
    },
    P93 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Am1.Buffer.from(A, Q) : Am1.Buffer.from(A)
    };
  S93.fromArrayBuffer = T93;
  S93.fromString = P93
})
// @from(Ln 104949, Col 4)
guQ = U((fuQ) => {
  Object.defineProperty(fuQ, "__esModule", {
    value: !0
  });
  fuQ.fromBase64 = void 0;
  var v93 = Qm1(),
    k93 = /^[A-Za-z0-9+/]*={0,2}$/,
    b93 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!k93.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, v93.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  fuQ.fromBase64 = b93
})
// @from(Ln 104964, Col 4)
duQ = U((uuQ) => {
  Object.defineProperty(uuQ, "__esModule", {
    value: !0
  });
  uuQ.toBase64 = void 0;
  var f93 = Qm1(),
    h93 = oG(),
    g93 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, h93.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, f93.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  uuQ.toBase64 = g93
})
// @from(Ln 104980, Col 4)
luQ = U((YLA) => {
  var cuQ = guQ(),
    puQ = duQ();
  Object.keys(cuQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(YLA, A)) Object.defineProperty(YLA, A, {
      enumerable: !0,
      get: function () {
        return cuQ[A]
      }
    })
  });
  Object.keys(puQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(YLA, A)) Object.defineProperty(YLA, A, {
      enumerable: !0,
      get: function () {
        return puQ[A]
      }
    })
  })
})
// @from(Ln 105000, Col 4)
XmQ = U((YmQ) => {
  Object.defineProperty(YmQ, "__esModule", {
    value: !0
  });
  YmQ.ruleSet = void 0;
  var BmQ = "required",
    xv = "fn",
    yv = "argv",
    iYA = "ref",
    iuQ = !0,
    nuQ = "isSet",
    XLA = "booleanEquals",
    lYA = "error",
    JLA = "endpoint",
    IC = "tree",
    Bm1 = "PartitionResult",
    auQ = {
      [BmQ]: !1,
      type: "string"
    },
    ouQ = {
      [BmQ]: !0,
      default: !1,
      type: "boolean"
    },
    ruQ = {
      [iYA]: "Endpoint"
    },
    GmQ = {
      [xv]: XLA,
      [yv]: [{
        [iYA]: "UseFIPS"
      }, !0]
    },
    ZmQ = {
      [xv]: XLA,
      [yv]: [{
        [iYA]: "UseDualStack"
      }, !0]
    },
    Sv = {},
    suQ = {
      [xv]: "getAttr",
      [yv]: [{
        [iYA]: Bm1
      }, "supportsFIPS"]
    },
    tuQ = {
      [xv]: XLA,
      [yv]: [!0, {
        [xv]: "getAttr",
        [yv]: [{
          [iYA]: Bm1
        }, "supportsDualStack"]
      }]
    },
    euQ = [GmQ],
    AmQ = [ZmQ],
    QmQ = [{
      [iYA]: "Region"
    }],
    u93 = {
      version: "1.0",
      parameters: {
        Region: auQ,
        UseDualStack: ouQ,
        UseFIPS: ouQ,
        Endpoint: auQ
      },
      rules: [{
        conditions: [{
          [xv]: nuQ,
          [yv]: [ruQ]
        }],
        rules: [{
          conditions: euQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: lYA
        }, {
          rules: [{
            conditions: AmQ,
            error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
            type: lYA
          }, {
            endpoint: {
              url: ruQ,
              properties: Sv,
              headers: Sv
            },
            type: JLA
          }],
          type: IC
        }],
        type: IC
      }, {
        rules: [{
          conditions: [{
            [xv]: nuQ,
            [yv]: QmQ
          }],
          rules: [{
            conditions: [{
              [xv]: "aws.partition",
              [yv]: QmQ,
              assign: Bm1
            }],
            rules: [{
              conditions: [GmQ, ZmQ],
              rules: [{
                conditions: [{
                  [xv]: XLA,
                  [yv]: [iuQ, suQ]
                }, tuQ],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: Sv,
                      headers: Sv
                    },
                    type: JLA
                  }],
                  type: IC
                }],
                type: IC
              }, {
                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                type: lYA
              }],
              type: IC
            }, {
              conditions: euQ,
              rules: [{
                conditions: [{
                  [xv]: XLA,
                  [yv]: [suQ, iuQ]
                }],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
                      properties: Sv,
                      headers: Sv
                    },
                    type: JLA
                  }],
                  type: IC
                }],
                type: IC
              }, {
                error: "FIPS is enabled but this partition does not support FIPS",
                type: lYA
              }],
              type: IC
            }, {
              conditions: AmQ,
              rules: [{
                conditions: [tuQ],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: Sv,
                      headers: Sv
                    },
                    type: JLA
                  }],
                  type: IC
                }],
                type: IC
              }, {
                error: "DualStack is enabled but this partition does not support DualStack",
                type: lYA
              }],
              type: IC
            }, {
              rules: [{
                endpoint: {
                  url: "https://bedrock-runtime.{Region}.{PartitionResult#dnsSuffix}",
                  properties: Sv,
                  headers: Sv
                },
                type: JLA
              }],
              type: IC
            }],
            type: IC
          }],
          type: IC
        }, {
          error: "Invalid Configuration: Missing Region",
          type: lYA
        }],
        type: IC
      }]
    };
  YmQ.ruleSet = u93
})
// @from(Ln 105198, Col 4)
WmQ = U((ImQ) => {
  Object.defineProperty(ImQ, "__esModule", {
    value: !0
  });
  ImQ.defaultEndpointResolver = void 0;
  var m93 = Hv(),
    Gm1 = xT(),
    d93 = XmQ(),
    c93 = new Gm1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    p93 = (A, Q = {}) => {
      return c93.get(A, () => (0, Gm1.resolveEndpoint)(d93.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  ImQ.defaultEndpointResolver = p93;
  Gm1.customEndpointFunctions.aws = m93.awsEndpointFunctions
})
// @from(Ln 105219, Col 4)
EmQ = U((FmQ) => {
  Object.defineProperty(FmQ, "__esModule", {
    value: !0
  });
  FmQ.getRuntimeConfig = void 0;
  var l93 = hY(),
    i93 = eg(),
    n93 = rG(),
    a93 = GLA(),
    o93 = oM(),
    KmQ = luQ(),
    VmQ = oG(),
    r93 = su1(),
    s93 = WmQ(),
    t93 = (A) => {
      return {
        apiVersion: "2023-09-30",
        base64Decoder: A?.base64Decoder ?? KmQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? KmQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? s93.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? r93.defaultBedrockRuntimeHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new l93.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#httpBearerAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#httpBearerAuth"),
          signer: new n93.HttpBearerAuthSigner
        }],
        logger: A?.logger ?? new a93.NoOpLogger,
        protocol: A?.protocol ?? new i93.AwsRestJsonProtocol({
          defaultNamespace: "com.amazonaws.bedrockruntime"
        }),
        serviceId: A?.serviceId ?? "Bedrock Runtime",
        urlParser: A?.urlParser ?? o93.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? VmQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? VmQ.toUtf8
      }
    };
  FmQ.getRuntimeConfig = t93
})
// @from(Ln 105263, Col 4)
wmQ = U((qmQ) => {
  Object.defineProperty(qmQ, "__esModule", {
    value: !0
  });
  qmQ.getRuntimeConfig = void 0;
  var e93 = LZ(),
    A43 = e93.__importDefault(PuQ()),
    Zm1 = hY(),
    Q43 = _0A(),
    B43 = yuQ(),
    zmQ = ooA(),
    $mQ = og(),
    SsA = RD(),
    G43 = rG(),
    Z43 = kuQ(),
    Y43 = rg(),
    CmQ = RH(),
    f0A = _q(),
    UmQ = XL(),
    J43 = sg(),
    X43 = Uv(),
    I43 = EmQ(),
    D43 = GLA(),
    W43 = Qu(),
    K43 = GLA(),
    V43 = (A) => {
      (0, K43.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, W43.resolveDefaultsModeConfig)(A),
        B = () => Q().then(D43.loadConfigsForDefaultMode),
        G = (0, I43.getRuntimeConfig)(A);
      (0, Zm1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger,
        signingName: "bedrock"
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, f0A.loadConfig)(Zm1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? J43.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? Q43.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, $mQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: A43.default.version
        }),
        eventStreamPayloadHandlerProvider: A?.eventStreamPayloadHandlerProvider ?? B43.eventStreamPayloadHandlerProvider,
        eventStreamSerdeProvider: A?.eventStreamSerdeProvider ?? Z43.eventStreamSerdeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Y) => Y.getIdentityProvider("aws.auth#sigv4"),
          signer: new Zm1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#httpBearerAuth",
          identityProvider: (Y) => Y.getIdentityProvider("smithy.api#httpBearerAuth") || (async (J) => {
            try {
              return await (0, zmQ.fromEnvSigningName)({
                signingName: "bedrock"
              })()
            } catch (X) {
              return await (0, zmQ.nodeProvider)(J)(J)
            }
          }),
          signer: new G43.HttpBearerAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, f0A.loadConfig)(CmQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, f0A.loadConfig)(SsA.NODE_REGION_CONFIG_OPTIONS, {
          ...SsA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: UmQ.NodeHttp2Handler.create(A?.requestHandler ?? (async () => ({
          ...await B(),
          disableConcurrentStreams: !0
        }))),
        retryMode: A?.retryMode ?? (0, f0A.loadConfig)({
          ...CmQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || X43.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Y43.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? UmQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, f0A.loadConfig)(SsA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, f0A.loadConfig)(SsA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, f0A.loadConfig)($mQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  qmQ.getRuntimeConfig = V43
})