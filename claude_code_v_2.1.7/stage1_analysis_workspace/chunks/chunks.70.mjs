
// @from(Ln 196772, Col 4)
i20 = U((wmG, KTB) => {
  var {
    defineProperty: r91,
    getOwnPropertyDescriptor: cC8,
    getOwnPropertyNames: pC8
  } = Object, lC8 = Object.prototype.hasOwnProperty, ta = (A, Q) => r91(A, "name", {
    value: Q,
    configurable: !0
  }), iC8 = (A, Q) => {
    for (var B in Q) r91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, nC8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of pC8(Q))
        if (!lC8.call(A, Z) && Z !== B) r91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = cC8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, aC8 = (A) => nC8(r91({}, "__esModule", {
    value: !0
  }), A), ZTB = {};
  iC8(ZTB, {
    Field: () => tC8,
    Fields: () => eC8,
    HttpRequest: () => AU8,
    HttpResponse: () => QU8,
    getHttpHandlerExtensionConfiguration: () => oC8,
    isValidHostname: () => WTB,
    resolveHttpHandlerRuntimeConfig: () => rC8
  });
  KTB.exports = aC8(ZTB);
  var oC8 = ta((A) => {
      let Q = A.httpHandler;
      return {
        setHttpHandler(B) {
          Q = B
        },
        httpHandler() {
          return Q
        },
        updateHttpClientConfig(B, G) {
          Q.updateHttpClientConfig(B, G)
        },
        httpHandlerConfigs() {
          return Q.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    rC8 = ta((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    sC8 = l20(),
    YTB = class {
      constructor({
        name: Q,
        kind: B = sC8.FieldPosition.HEADER,
        values: G = []
      }) {
        this.name = Q, this.kind = B, this.values = G
      }
      add(Q) {
        this.values.push(Q)
      }
      set(Q) {
        this.values = Q
      }
      remove(Q) {
        this.values = this.values.filter((B) => B !== Q)
      }
      toString() {
        return this.values.map((Q) => Q.includes(",") || Q.includes(" ") ? `"${Q}"` : Q).join(", ")
      }
      get() {
        return this.values
      }
    };
  ta(YTB, "Field");
  var tC8 = YTB,
    JTB = class {
      constructor({
        fields: Q = [],
        encoding: B = "utf-8"
      }) {
        this.entries = {}, Q.forEach(this.setField.bind(this)), this.encoding = B
      }
      setField(Q) {
        this.entries[Q.name.toLowerCase()] = Q
      }
      getField(Q) {
        return this.entries[Q.toLowerCase()]
      }
      removeField(Q) {
        delete this.entries[Q.toLowerCase()]
      }
      getByType(Q) {
        return Object.values(this.entries).filter((B) => B.kind === Q)
      }
    };
  ta(JTB, "Fields");
  var eC8 = JTB,
    XTB = class A {
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        let Q = new A({
          ...this,
          headers: {
            ...this.headers
          }
        });
        if (Q.query) Q.query = ITB(Q.query);
        return Q
      }
    };
  ta(XTB, "HttpRequest");
  var AU8 = XTB;

  function ITB(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  ta(ITB, "cloneQuery");
  var DTB = class {
    constructor(Q) {
      this.statusCode = Q.statusCode, this.reason = Q.reason, this.headers = Q.headers || {}, this.body = Q.body
    }
    static isInstance(Q) {
      if (!Q) return !1;
      let B = Q;
      return typeof B.statusCode === "number" && typeof B.headers === "object"
    }
  };
  ta(DTB, "HttpResponse");
  var QU8 = DTB;

  function WTB(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  ta(WTB, "isValidHostname")
})
// @from(Ln 196929, Col 4)
NTB = U((LmG, qTB) => {
  var {
    defineProperty: s91,
    getOwnPropertyDescriptor: BU8,
    getOwnPropertyNames: GU8
  } = Object, ZU8 = Object.prototype.hasOwnProperty, t91 = (A, Q) => s91(A, "name", {
    value: Q,
    configurable: !0
  }), YU8 = (A, Q) => {
    for (var B in Q) s91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, JU8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of GU8(Q))
        if (!ZU8.call(A, Z) && Z !== B) s91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = BU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, XU8 = (A) => JU8(s91({}, "__esModule", {
    value: !0
  }), A), VTB = {};
  YU8(VTB, {
    AlgorithmId: () => zTB,
    EndpointURLScheme: () => ETB,
    FieldPosition: () => $TB,
    HttpApiKeyAuthLocation: () => HTB,
    HttpAuthLocation: () => FTB,
    IniSectionType: () => CTB,
    RequestHandlerProtocol: () => UTB,
    SMITHY_CONTEXT_KEY: () => VU8,
    getDefaultClientConfiguration: () => WU8,
    resolveDefaultRuntimeConfig: () => KU8
  });
  qTB.exports = XU8(VTB);
  var FTB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(FTB || {}),
    HTB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(HTB || {}),
    ETB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(ETB || {}),
    zTB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(zTB || {}),
    IU8 = t91((A) => {
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
        _checksumAlgorithms: Q,
        addChecksumAlgorithm(B) {
          this._checksumAlgorithms.push(B)
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms
        }
      }
    }, "getChecksumConfiguration"),
    DU8 = t91((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    WU8 = t91((A) => {
      return {
        ...IU8(A)
      }
    }, "getDefaultClientConfiguration"),
    KU8 = t91((A) => {
      return {
        ...DU8(A)
      }
    }, "resolveDefaultRuntimeConfig"),
    $TB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })($TB || {}),
    VU8 = "__smithy_context",
    CTB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(CTB || {}),
    UTB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(UTB || {})
})
// @from(Ln 197026, Col 4)
RTB = U((OmG, MTB) => {
  var {
    defineProperty: e91,
    getOwnPropertyDescriptor: FU8,
    getOwnPropertyNames: HU8
  } = Object, EU8 = Object.prototype.hasOwnProperty, LTB = (A, Q) => e91(A, "name", {
    value: Q,
    configurable: !0
  }), zU8 = (A, Q) => {
    for (var B in Q) e91(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, $U8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HU8(Q))
        if (!EU8.call(A, Z) && Z !== B) e91(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = FU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, CU8 = (A) => $U8(e91({}, "__esModule", {
    value: !0
  }), A), OTB = {};
  zU8(OTB, {
    getSmithyContext: () => UU8,
    normalizeProvider: () => qU8
  });
  MTB.exports = CU8(OTB);
  var wTB = NTB(),
    UU8 = LTB((A) => A[wTB.SMITHY_CONTEXT_KEY] || (A[wTB.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
    qU8 = LTB((A) => {
      if (typeof A === "function") return A;
      let Q = Promise.resolve(A);
      return () => Q
    }, "normalizeProvider")
})
// @from(Ln 197064, Col 4)
n20 = U((MmG, jTB) => {
  var {
    defineProperty: A41,
    getOwnPropertyDescriptor: NU8,
    getOwnPropertyNames: wU8
  } = Object, LU8 = Object.prototype.hasOwnProperty, OU8 = (A, Q) => A41(A, "name", {
    value: Q,
    configurable: !0
  }), MU8 = (A, Q) => {
    for (var B in Q) A41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, RU8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of wU8(Q))
        if (!LU8.call(A, Z) && Z !== B) A41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = NU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, _U8 = (A) => RU8(A41({}, "__esModule", {
    value: !0
  }), A), _TB = {};
  MU8(_TB, {
    isArrayBuffer: () => jU8
  });
  jTB.exports = _U8(_TB);
  var jU8 = OU8((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Ln 197095, Col 4)
xTB = U((RmG, STB) => {
  var {
    defineProperty: Q41,
    getOwnPropertyDescriptor: TU8,
    getOwnPropertyNames: PU8
  } = Object, SU8 = Object.prototype.hasOwnProperty, TTB = (A, Q) => Q41(A, "name", {
    value: Q,
    configurable: !0
  }), xU8 = (A, Q) => {
    for (var B in Q) Q41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, yU8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of PU8(Q))
        if (!SU8.call(A, Z) && Z !== B) Q41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = TU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, vU8 = (A) => yU8(Q41({}, "__esModule", {
    value: !0
  }), A), PTB = {};
  xU8(PTB, {
    fromArrayBuffer: () => bU8,
    fromString: () => fU8
  });
  STB.exports = vU8(PTB);
  var kU8 = n20(),
    a20 = NA("buffer"),
    bU8 = TTB((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, kU8.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return a20.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    fU8 = TTB((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? a20.Buffer.from(A, Q) : a20.Buffer.from(A)
    }, "fromString")
})
// @from(Ln 197136, Col 4)
hjA = U((_mG, bTB) => {
  var {
    defineProperty: B41,
    getOwnPropertyDescriptor: hU8,
    getOwnPropertyNames: gU8
  } = Object, uU8 = Object.prototype.hasOwnProperty, o20 = (A, Q) => B41(A, "name", {
    value: Q,
    configurable: !0
  }), mU8 = (A, Q) => {
    for (var B in Q) B41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, dU8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gU8(Q))
        if (!uU8.call(A, Z) && Z !== B) B41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cU8 = (A) => dU8(B41({}, "__esModule", {
    value: !0
  }), A), yTB = {};
  mU8(yTB, {
    fromUtf8: () => kTB,
    toUint8Array: () => pU8,
    toUtf8: () => lU8
  });
  bTB.exports = cU8(yTB);
  var vTB = xTB(),
    kTB = o20((A) => {
      let Q = (0, vTB.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    pU8 = o20((A) => {
      if (typeof A === "string") return kTB(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    lU8 = o20((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, vTB.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Ln 197183, Col 4)
cTB = U((jmG, dTB) => {
  var {
    defineProperty: G41,
    getOwnPropertyDescriptor: iU8,
    getOwnPropertyNames: nU8
  } = Object, aU8 = Object.prototype.hasOwnProperty, fTB = (A, Q) => G41(A, "name", {
    value: Q,
    configurable: !0
  }), oU8 = (A, Q) => {
    for (var B in Q) G41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, rU8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of nU8(Q))
        if (!aU8.call(A, Z) && Z !== B) G41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = iU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, sU8 = (A) => rU8(G41({}, "__esModule", {
    value: !0
  }), A), hTB = {};
  oU8(hTB, {
    fromHex: () => uTB,
    toHex: () => mTB
  });
  dTB.exports = sU8(hTB);
  var gTB = {},
    r20 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    gTB[A] = Q, r20[Q] = A
  }

  function uTB(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in r20) Q[B / 2] = r20[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }
  fTB(uTB, "fromHex");

  function mTB(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += gTB[A[B]];
    return Q
  }
  fTB(mTB, "toHex")
})
// @from(Ln 197240, Col 4)
nTB = U((TmG, iTB) => {
  var {
    defineProperty: Z41,
    getOwnPropertyDescriptor: tU8,
    getOwnPropertyNames: eU8
  } = Object, Aq8 = Object.prototype.hasOwnProperty, s20 = (A, Q) => Z41(A, "name", {
    value: Q,
    configurable: !0
  }), Qq8 = (A, Q) => {
    for (var B in Q) Z41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Bq8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of eU8(Q))
        if (!Aq8.call(A, Z) && Z !== B) Z41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = tU8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Gq8 = (A) => Bq8(Z41({}, "__esModule", {
    value: !0
  }), A), pTB = {};
  Qq8(pTB, {
    escapeUri: () => lTB,
    escapeUriPath: () => Yq8
  });
  iTB.exports = Gq8(pTB);
  var lTB = s20((A) => encodeURIComponent(A).replace(/[!'()*]/g, Zq8), "escapeUri"),
    Zq8 = s20((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    Yq8 = s20((A) => A.split("/").map(lTB).join("/"), "escapeUriPath")
})
// @from(Ln 197274, Col 4)
FPB = U((PmG, VPB) => {
  var {
    defineProperty: D41,
    getOwnPropertyDescriptor: Jq8,
    getOwnPropertyNames: Xq8
  } = Object, Iq8 = Object.prototype.hasOwnProperty, nW = (A, Q) => D41(A, "name", {
    value: Q,
    configurable: !0
  }), Dq8 = (A, Q) => {
    for (var B in Q) D41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Wq8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Xq8(Q))
        if (!Iq8.call(A, Z) && Z !== B) D41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Jq8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Kq8 = (A) => Wq8(D41({}, "__esModule", {
    value: !0
  }), A), tTB = {};
  Dq8(tTB, {
    SignatureV4: () => hq8,
    clearCredentialCache: () => jq8,
    createScope: () => X41,
    getCanonicalHeaders: () => Q90,
    getCanonicalQuery: () => JPB,
    getPayloadHash: () => I41,
    getSigningKey: () => YPB,
    moveHeadersToQuery: () => WPB,
    prepareRequest: () => G90
  });
  VPB.exports = Kq8(tTB);
  var aTB = RTB(),
    t20 = hjA(),
    Vq8 = "X-Amz-Algorithm",
    Fq8 = "X-Amz-Credential",
    eTB = "X-Amz-Date",
    Hq8 = "X-Amz-SignedHeaders",
    Eq8 = "X-Amz-Expires",
    APB = "X-Amz-Signature",
    QPB = "X-Amz-Security-Token",
    BPB = "authorization",
    GPB = eTB.toLowerCase(),
    zq8 = "date",
    $q8 = [BPB, GPB, zq8],
    Cq8 = APB.toLowerCase(),
    A90 = "x-amz-content-sha256",
    Uq8 = QPB.toLowerCase(),
    qq8 = {
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
    Nq8 = /^proxy-/,
    wq8 = /^sec-/,
    e20 = "AWS4-HMAC-SHA256",
    Lq8 = "AWS4-HMAC-SHA256-PAYLOAD",
    Oq8 = "UNSIGNED-PAYLOAD",
    Mq8 = 50,
    ZPB = "aws4_request",
    Rq8 = 604800,
    ea = cTB(),
    _q8 = hjA(),
    RDA = {},
    J41 = [],
    X41 = nW((A, Q, B) => `${A}/${Q}/${B}/${ZPB}`, "createScope"),
    YPB = nW(async (A, Q, B, G, Z) => {
      let Y = await oTB(A, Q.secretAccessKey, Q.accessKeyId),
        J = `${B}:${G}:${Z}:${(0,ea.toHex)(Y)}:${Q.sessionToken}`;
      if (J in RDA) return RDA[J];
      J41.push(J);
      while (J41.length > Mq8) delete RDA[J41.shift()];
      let X = `AWS4${Q.secretAccessKey}`;
      for (let I of [B, G, Z, ZPB]) X = await oTB(A, X, I);
      return RDA[J] = X
    }, "getSigningKey"),
    jq8 = nW(() => {
      J41.length = 0, Object.keys(RDA).forEach((A) => {
        delete RDA[A]
      })
    }, "clearCredentialCache"),
    oTB = nW((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, _q8.toUint8Array)(B)), G.digest()
    }, "hmac"),
    Q90 = nW(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let Y = Z.toLowerCase();
        if (Y in qq8 || (Q == null ? void 0 : Q.has(Y)) || Nq8.test(Y) || wq8.test(Y)) {
          if (!B || B && !B.has(Y)) continue
        }
        G[Y] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    gjA = nTB(),
    JPB = nW(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A).sort()) {
        if (G.toLowerCase() === Cq8) continue;
        Q.push(G);
        let Z = A[G];
        if (typeof Z === "string") B[G] = `${(0,gjA.escapeUri)(G)}=${(0,gjA.escapeUri)(Z)}`;
        else if (Array.isArray(Z)) B[G] = Z.slice(0).reduce((Y, J) => Y.concat([`${(0,gjA.escapeUri)(G)}=${(0,gjA.escapeUri)(J)}`]), []).sort().join("&")
      }
      return Q.map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    Tq8 = n20(),
    Pq8 = hjA(),
    I41 = nW(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === A90) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, Tq8.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, Pq8.toUint8Array)(Q)), (0, ea.toHex)(await G.digest())
      }
      return Oq8
    }, "getPayloadHash"),
    rTB = hjA(),
    XPB = class {
      format(Q) {
        let B = [];
        for (let Y of Object.keys(Q)) {
          let J = (0, rTB.fromUtf8)(Y);
          B.push(Uint8Array.from([J.byteLength]), J, this.formatHeaderValue(Q[Y]))
        }
        let G = new Uint8Array(B.reduce((Y, J) => Y + J.byteLength, 0)),
          Z = 0;
        for (let Y of B) G.set(Y, Z), Z += Y.byteLength;
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
            let Y = new DataView(new ArrayBuffer(3 + Q.value.byteLength));
            Y.setUint8(0, 6), Y.setUint16(1, Q.value.byteLength, !1);
            let J = new Uint8Array(Y.buffer);
            return J.set(Q.value, 3), J;
          case "string":
            let X = (0, rTB.fromUtf8)(Q.value),
              I = new DataView(new ArrayBuffer(3 + X.byteLength));
            I.setUint8(0, 7), I.setUint16(1, X.byteLength, !1);
            let D = new Uint8Array(I.buffer);
            return D.set(X, 3), D;
          case "timestamp":
            let W = new Uint8Array(9);
            return W[0] = 8, W.set(yq8.fromNumber(Q.value.valueOf()).bytes, 1), W;
          case "uuid":
            if (!xq8.test(Q.value)) throw Error(`Invalid UUID received: ${Q.value}`);
            let K = new Uint8Array(17);
            return K[0] = 9, K.set((0, ea.fromHex)(Q.value.replace(/\-/g, "")), 1), K
        }
      }
    };
  nW(XPB, "HeaderFormatter");
  var Sq8 = XPB,
    xq8 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    IPB = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) B90(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) B90(Q);
        return parseInt((0, ea.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };
  nW(IPB, "Int64");
  var yq8 = IPB;

  function B90(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  nW(B90, "negate");
  var vq8 = nW((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    DPB = nW(({
      headers: A,
      query: Q,
      ...B
    }) => ({
      ...B,
      headers: {
        ...A
      },
      query: Q ? kq8(Q) : void 0
    }), "cloneRequest"),
    kq8 = nW((A) => Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {}), "cloneQuery"),
    WPB = nW((A, Q = {}) => {
      var B;
      let {
        headers: G,
        query: Z = {}
      } = typeof A.clone === "function" ? A.clone() : DPB(A);
      for (let Y of Object.keys(G)) {
        let J = Y.toLowerCase();
        if (J.slice(0, 6) === "x-amz-" && !((B = Q.unhoistableHeaders) == null ? void 0 : B.has(J))) Z[Y] = G[Y], delete G[Y]
      }
      return {
        ...A,
        headers: G,
        query: Z
      }
    }, "moveHeadersToQuery"),
    G90 = nW((A) => {
      A = typeof A.clone === "function" ? A.clone() : DPB(A);
      for (let Q of Object.keys(A.headers))
        if ($q8.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    bq8 = nW((A) => fq8(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    fq8 = nW((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    KPB = class {
      constructor({
        applyChecksum: Q,
        credentials: B,
        region: G,
        service: Z,
        sha256: Y,
        uriEscapePath: J = !0
      }) {
        this.headerFormatter = new Sq8, this.service = Z, this.sha256 = Y, this.uriEscapePath = J, this.applyChecksum = typeof Q === "boolean" ? Q : !0, this.regionProvider = (0, aTB.normalizeProvider)(G), this.credentialProvider = (0, aTB.normalizeProvider)(B)
      }
      async presign(Q, B = {}) {
        let {
          signingDate: G = new Date,
          expiresIn: Z = 3600,
          unsignableHeaders: Y,
          unhoistableHeaders: J,
          signableHeaders: X,
          signingRegion: I,
          signingService: D
        } = B, W = await this.credentialProvider();
        this.validateResolvedCredentials(W);
        let K = I ?? await this.regionProvider(),
          {
            longDate: V,
            shortDate: F
          } = Y41(G);
        if (Z > Rq8) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = X41(F, K, D ?? this.service),
          E = WPB(G90(Q), {
            unhoistableHeaders: J
          });
        if (W.sessionToken) E.query[QPB] = W.sessionToken;
        E.query[Vq8] = e20, E.query[Fq8] = `${W.accessKeyId}/${H}`, E.query[eTB] = V, E.query[Eq8] = Z.toString(10);
        let z = Q90(E, Y, X);
        return E.query[Hq8] = sTB(z), E.query[APB] = await this.getSignature(V, H, this.getSigningKey(W, K, F, D), this.createCanonicalRequest(E, z, await I41(Q, this.sha256))), E
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
        signingRegion: Y,
        signingService: J
      }) {
        let X = Y ?? await this.regionProvider(),
          {
            shortDate: I,
            longDate: D
          } = Y41(G),
          W = X41(I, X, J ?? this.service),
          K = await I41({
            headers: {},
            body: B
          }, this.sha256),
          V = new this.sha256;
        V.update(Q);
        let F = (0, ea.toHex)(await V.digest()),
          H = [Lq8, D, W, Z, F, K].join(`
`);
        return this.signString(H, {
          signingDate: G,
          signingRegion: X,
          signingService: J
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
        }).then((J) => {
          return {
            message: Q.message,
            signature: J
          }
        })
      }
      async signString(Q, {
        signingDate: B = new Date,
        signingRegion: G,
        signingService: Z
      } = {}) {
        let Y = await this.credentialProvider();
        this.validateResolvedCredentials(Y);
        let J = G ?? await this.regionProvider(),
          {
            shortDate: X
          } = Y41(B),
          I = new this.sha256(await this.getSigningKey(Y, J, X, Z));
        return I.update((0, t20.toUint8Array)(Q)), (0, ea.toHex)(await I.digest())
      }
      async signRequest(Q, {
        signingDate: B = new Date,
        signableHeaders: G,
        unsignableHeaders: Z,
        signingRegion: Y,
        signingService: J
      } = {}) {
        let X = await this.credentialProvider();
        this.validateResolvedCredentials(X);
        let I = Y ?? await this.regionProvider(),
          D = G90(Q),
          {
            longDate: W,
            shortDate: K
          } = Y41(B),
          V = X41(K, I, J ?? this.service);
        if (D.headers[GPB] = W, X.sessionToken) D.headers[Uq8] = X.sessionToken;
        let F = await I41(D, this.sha256);
        if (!vq8(A90, D.headers) && this.applyChecksum) D.headers[A90] = F;
        let H = Q90(D, Z, G),
          E = await this.getSignature(W, V, this.getSigningKey(X, I, K, J), this.createCanonicalRequest(D, H, F));
        return D.headers[BPB] = `${e20} Credential=${X.accessKeyId}/${V}, SignedHeaders=${sTB(H)}, Signature=${E}`, D
      }
      createCanonicalRequest(Q, B, G) {
        let Z = Object.keys(B).sort();
        return `${Q.method}
${this.getCanonicalPath(Q)}
${JPB(Q)}
${Z.map((Y)=>`${Y}:${B[Y]}`).join(`
`)}

${Z.join(";")}
${G}`
      }
      async createStringToSign(Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, t20.toUint8Array)(G));
        let Y = await Z.digest();
        return `${e20}
${Q}
${B}
${(0,ea.toHex)(Y)}`
      }
      getCanonicalPath({
        path: Q
      }) {
        if (this.uriEscapePath) {
          let B = [];
          for (let Y of Q.split("/")) {
            if ((Y == null ? void 0 : Y.length) === 0) continue;
            if (Y === ".") continue;
            if (Y === "..") B.pop();
            else B.push(Y)
          }
          let G = `${(Q==null?void 0:Q.startsWith("/"))?"/":""}${B.join("/")}${B.length>0&&(Q==null?void 0:Q.endsWith("/"))?"/":""}`;
          return (0, gjA.escapeUri)(G).replace(/%2F/g, "/")
        }
        return Q
      }
      async getSignature(Q, B, G, Z) {
        let Y = await this.createStringToSign(Q, B, Z),
          J = new this.sha256(await G);
        return J.update((0, t20.toUint8Array)(Y)), (0, ea.toHex)(await J.digest())
      }
      getSigningKey(Q, B, G, Z) {
        return YPB(this.sha256, Q, G, B, Z || this.service)
      }
      validateResolvedCredentials(Q) {
        if (typeof Q !== "object" || typeof Q.accessKeyId !== "string" || typeof Q.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
    };
  nW(KPB, "SignatureV4");
  var hq8 = KPB,
    Y41 = nW((A) => {
      let Q = bq8(A).replace(/[\-:]/g, "");
      return {
        longDate: Q,
        shortDate: Q.slice(0, 8)
      }
    }, "formatDate"),
    sTB = nW((A) => Object.keys(A).sort().join(";"), "getCanonicalHeaderList")
})
// @from(Ln 197747, Col 4)
HPB
// @from(Ln 197747, Col 9)
EPB
// @from(Ln 197747, Col 14)
zPB
// @from(Ln 197747, Col 19)
$PB
// @from(Ln 197747, Col 24)
uq8 = () => Promise.resolve().then(() => c(ki1(), 1)).then(({
    fromNodeProviderChain: A
  }) => A({
    clientConfig: {
      requestHandler: new EPB.FetchHttpHandler({
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
// @from(Ln 197762, Col 2)
CPB = async (A, Q) => {
    gq8(A.method, "Expected request method property to be set");
    let B = await (Q.providerChainResolver ? Q.providerChainResolver() : uq8()),
      G = await mq8(() => {
        if (Q.awsAccessKey) process.env.AWS_ACCESS_KEY_ID = Q.awsAccessKey;
        if (Q.awsSecretKey) process.env.AWS_SECRET_ACCESS_KEY = Q.awsSecretKey;
        if (Q.awsSessionToken) process.env.AWS_SESSION_TOKEN = Q.awsSessionToken
      }, () => B()),
      Z = new $PB.SignatureV4({
        service: "bedrock",
        region: Q.regionName,
        credentials: G,
        sha256: HPB.Sha256
      }),
      Y = new URL(Q.url),
      J = !A.headers ? {} : (Symbol.iterator in A.headers) ? Object.fromEntries(Array.from(A.headers).map((D) => [...D])) : {
        ...A.headers
      };
    delete J.connection, J.host = Y.hostname;
    let X = new zPB.HttpRequest({
      method: A.method.toUpperCase(),
      protocol: Y.protocol,
      path: Y.pathname,
      headers: J,
      body: A.body
    });
    return (await Z.sign(X)).headers
  }
// @from(Ln 197789, Col 5)
mq8 = async (A, Q) => {
    let B = {
      ...process.env
    };
    try {
      return A(), await Q()
    } finally {
      process.env = B
    }
  }
// @from(Ln 197799, Col 4)
UPB = w(() => {
  HPB = c(XjB(), 1), EPB = c(p20(), 1), zPB = c(i20(), 1), $PB = c(FPB(), 1)
})
// @from(Ln 197802, Col 4)
Y90 = U((ymG, K41) => {
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
  var qPB, NPB, wPB, LPB, OPB, MPB, RPB, _PB, jPB, W41, Z90, TPB, PPB, _DA, SPB, xPB, yPB, vPB, kPB, bPB, fPB, hPB, gPB;
  (function (A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function (G) {
      A(B(Q, B(G)))
    });
    else if (typeof K41 === "object" && typeof ymG === "object") A(B(Q, B(ymG)));
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
    instanceof Array && function (B, G) {
      B.__proto__ = G
    } || function (B, G) {
      for (var Z in G)
        if (G.hasOwnProperty(Z)) B[Z] = G[Z]
    };
    qPB = function (B, G) {
      Q(B, G);

      function Z() {
        this.constructor = B
      }
      B.prototype = G === null ? Object.create(G) : (Z.prototype = G.prototype, new Z)
    }, NPB = Object.assign || function (B) {
      for (var G, Z = 1, Y = arguments.length; Z < Y; Z++) {
        G = arguments[Z];
        for (var J in G)
          if (Object.prototype.hasOwnProperty.call(G, J)) B[J] = G[J]
      }
      return B
    }, wPB = function (B, G) {
      var Z = {};
      for (var Y in B)
        if (Object.prototype.hasOwnProperty.call(B, Y) && G.indexOf(Y) < 0) Z[Y] = B[Y];
      if (B != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var J = 0, Y = Object.getOwnPropertySymbols(B); J < Y.length; J++)
          if (G.indexOf(Y[J]) < 0 && Object.prototype.propertyIsEnumerable.call(B, Y[J])) Z[Y[J]] = B[Y[J]]
      }
      return Z
    }, LPB = function (B, G, Z, Y) {
      var J = arguments.length,
        X = J < 3 ? G : Y === null ? Y = Object.getOwnPropertyDescriptor(G, Z) : Y,
        I;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") X = Reflect.decorate(B, G, Z, Y);
      else
        for (var D = B.length - 1; D >= 0; D--)
          if (I = B[D]) X = (J < 3 ? I(X) : J > 3 ? I(G, Z, X) : I(G, Z)) || X;
      return J > 3 && X && Object.defineProperty(G, Z, X), X
    }, OPB = function (B, G) {
      return function (Z, Y) {
        G(Z, Y, B)
      }
    }, MPB = function (B, G) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(B, G)
    }, RPB = function (B, G, Z, Y) {
      function J(X) {
        return X instanceof Z ? X : new Z(function (I) {
          I(X)
        })
      }
      return new(Z || (Z = Promise))(function (X, I) {
        function D(V) {
          try {
            K(Y.next(V))
          } catch (F) {
            I(F)
          }
        }

        function W(V) {
          try {
            K(Y.throw(V))
          } catch (F) {
            I(F)
          }
        }

        function K(V) {
          V.done ? X(V.value) : J(V.value).then(D, W)
        }
        K((Y = Y.apply(B, G || [])).next())
      })
    }, _PB = function (B, G) {
      var Z = {
          label: 0,
          sent: function () {
            if (X[0] & 1) throw X[1];
            return X[1]
          },
          trys: [],
          ops: []
        },
        Y, J, X, I;
      return I = {
        next: D(0),
        throw: D(1),
        return: D(2)
      }, typeof Symbol === "function" && (I[Symbol.iterator] = function () {
        return this
      }), I;

      function D(K) {
        return function (V) {
          return W([K, V])
        }
      }

      function W(K) {
        if (Y) throw TypeError("Generator is already executing.");
        while (Z) try {
          if (Y = 1, J && (X = K[0] & 2 ? J.return : K[0] ? J.throw || ((X = J.return) && X.call(J), 0) : J.next) && !(X = X.call(J, K[1])).done) return X;
          if (J = 0, X) K = [K[0] & 2, X.value];
          switch (K[0]) {
            case 0:
            case 1:
              X = K;
              break;
            case 4:
              return Z.label++, {
                value: K[1],
                done: !1
              };
            case 5:
              Z.label++, J = K[1], K = [0];
              continue;
            case 7:
              K = Z.ops.pop(), Z.trys.pop();
              continue;
            default:
              if ((X = Z.trys, !(X = X.length > 0 && X[X.length - 1])) && (K[0] === 6 || K[0] === 2)) {
                Z = 0;
                continue
              }
              if (K[0] === 3 && (!X || K[1] > X[0] && K[1] < X[3])) {
                Z.label = K[1];
                break
              }
              if (K[0] === 6 && Z.label < X[1]) {
                Z.label = X[1], X = K;
                break
              }
              if (X && Z.label < X[2]) {
                Z.label = X[2], Z.ops.push(K);
                break
              }
              if (X[2]) Z.ops.pop();
              Z.trys.pop();
              continue
          }
          K = G.call(B, Z)
        } catch (V) {
          K = [6, V], J = 0
        } finally {
          Y = X = 0
        }
        if (K[0] & 5) throw K[1];
        return {
          value: K[0] ? K[1] : void 0,
          done: !0
        }
      }
    }, gPB = function (B, G, Z, Y) {
      if (Y === void 0) Y = Z;
      B[Y] = G[Z]
    }, jPB = function (B, G) {
      for (var Z in B)
        if (Z !== "default" && !G.hasOwnProperty(Z)) G[Z] = B[Z]
    }, W41 = function (B) {
      var G = typeof Symbol === "function" && Symbol.iterator,
        Z = G && B[G],
        Y = 0;
      if (Z) return Z.call(B);
      if (B && typeof B.length === "number") return {
        next: function () {
          if (B && Y >= B.length) B = void 0;
          return {
            value: B && B[Y++],
            done: !B
          }
        }
      };
      throw TypeError(G ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, Z90 = function (B, G) {
      var Z = typeof Symbol === "function" && B[Symbol.iterator];
      if (!Z) return B;
      var Y = Z.call(B),
        J, X = [],
        I;
      try {
        while ((G === void 0 || G-- > 0) && !(J = Y.next()).done) X.push(J.value)
      } catch (D) {
        I = {
          error: D
        }
      } finally {
        try {
          if (J && !J.done && (Z = Y.return)) Z.call(Y)
        } finally {
          if (I) throw I.error
        }
      }
      return X
    }, TPB = function () {
      for (var B = [], G = 0; G < arguments.length; G++) B = B.concat(Z90(arguments[G]));
      return B
    }, PPB = function () {
      for (var B = 0, G = 0, Z = arguments.length; G < Z; G++) B += arguments[G].length;
      for (var Y = Array(B), J = 0, G = 0; G < Z; G++)
        for (var X = arguments[G], I = 0, D = X.length; I < D; I++, J++) Y[J] = X[I];
      return Y
    }, _DA = function (B) {
      return this instanceof _DA ? (this.v = B, this) : new _DA(B)
    }, SPB = function (B, G, Z) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = Z.apply(B, G || []),
        J, X = [];
      return J = {}, I("next"), I("throw"), I("return"), J[Symbol.asyncIterator] = function () {
        return this
      }, J;

      function I(H) {
        if (Y[H]) J[H] = function (E) {
          return new Promise(function (z, $) {
            X.push([H, E, z, $]) > 1 || D(H, E)
          })
        }
      }

      function D(H, E) {
        try {
          W(Y[H](E))
        } catch (z) {
          F(X[0][3], z)
        }
      }

      function W(H) {
        H.value instanceof _DA ? Promise.resolve(H.value.v).then(K, V) : F(X[0][2], H)
      }

      function K(H) {
        D("next", H)
      }

      function V(H) {
        D("throw", H)
      }

      function F(H, E) {
        if (H(E), X.shift(), X.length) D(X[0][0], X[0][1])
      }
    }, xPB = function (B) {
      var G, Z;
      return G = {}, Y("next"), Y("throw", function (J) {
        throw J
      }), Y("return"), G[Symbol.iterator] = function () {
        return this
      }, G;

      function Y(J, X) {
        G[J] = B[J] ? function (I) {
          return (Z = !Z) ? {
            value: _DA(B[J](I)),
            done: J === "return"
          } : X ? X(I) : I
        } : X
      }
    }, yPB = function (B) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var G = B[Symbol.asyncIterator],
        Z;
      return G ? G.call(B) : (B = typeof W41 === "function" ? W41(B) : B[Symbol.iterator](), Z = {}, Y("next"), Y("throw"), Y("return"), Z[Symbol.asyncIterator] = function () {
        return this
      }, Z);

      function Y(X) {
        Z[X] = B[X] && function (I) {
          return new Promise(function (D, W) {
            I = B[X](I), J(D, W, I.done, I.value)
          })
        }
      }

      function J(X, I, D, W) {
        Promise.resolve(W).then(function (K) {
          X({
            value: K,
            done: D
          })
        }, I)
      }
    }, vPB = function (B, G) {
      if (Object.defineProperty) Object.defineProperty(B, "raw", {
        value: G
      });
      else B.raw = G;
      return B
    }, kPB = function (B) {
      if (B && B.__esModule) return B;
      var G = {};
      if (B != null) {
        for (var Z in B)
          if (Object.hasOwnProperty.call(B, Z)) G[Z] = B[Z]
      }
      return G.default = B, G
    }, bPB = function (B) {
      return B && B.__esModule ? B : {
        default: B
      }
    }, fPB = function (B, G) {
      if (!G.has(B)) throw TypeError("attempted to get private field on non-instance");
      return G.get(B)
    }, hPB = function (B, G, Z) {
      if (!G.has(B)) throw TypeError("attempted to set private field on non-instance");
      return G.set(B, Z), Z
    }, A("__extends", qPB), A("__assign", NPB), A("__rest", wPB), A("__decorate", LPB), A("__param", OPB), A("__metadata", MPB), A("__awaiter", RPB), A("__generator", _PB), A("__exportStar", jPB), A("__createBinding", gPB), A("__values", W41), A("__read", Z90), A("__spread", TPB), A("__spreadArrays", PPB), A("__await", _DA), A("__asyncGenerator", SPB), A("__asyncDelegator", xPB), A("__asyncValues", yPB), A("__makeTemplateObject", vPB), A("__importStar", kPB), A("__importDefault", bPB), A("__classPrivateFieldGet", fPB), A("__classPrivateFieldSet", hPB)
  })
})
// @from(Ln 198148, Col 4)
dPB = U((uPB) => {
  Object.defineProperty(uPB, "__esModule", {
    value: !0
  });
  uPB.convertToBuffer = void 0;
  var dq8 = v20(),
    cq8 = typeof Buffer < "u" && Buffer.from ? function (A) {
      return Buffer.from(A, "utf8")
    } : dq8.fromUtf8;

  function pq8(A) {
    if (A instanceof Uint8Array) return A;
    if (typeof A === "string") return cq8(A);
    if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(A)
  }
  uPB.convertToBuffer = pq8
})
// @from(Ln 198166, Col 4)
lPB = U((cPB) => {
  Object.defineProperty(cPB, "__esModule", {
    value: !0
  });
  cPB.isEmptyData = void 0;

  function lq8(A) {
    if (typeof A === "string") return A.length === 0;
    return A.byteLength === 0
  }
  cPB.isEmptyData = lq8
})
// @from(Ln 198178, Col 4)
aPB = U((iPB) => {
  Object.defineProperty(iPB, "__esModule", {
    value: !0
  });
  iPB.numToUint8 = void 0;

  function iq8(A) {
    return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
  }
  iPB.numToUint8 = iq8
})
// @from(Ln 198189, Col 4)
sPB = U((oPB) => {
  Object.defineProperty(oPB, "__esModule", {
    value: !0
  });
  oPB.uint32ArrayFrom = void 0;

  function nq8(A) {
    if (!Uint32Array.from) {
      var Q = new Uint32Array(A.length),
        B = 0;
      while (B < A.length) Q[B] = A[B], B += 1;
      return Q
    }
    return Uint32Array.from(A)
  }
  oPB.uint32ArrayFrom = nq8
})
// @from(Ln 198206, Col 4)
J90 = U((jDA) => {
  Object.defineProperty(jDA, "__esModule", {
    value: !0
  });
  jDA.uint32ArrayFrom = jDA.numToUint8 = jDA.isEmptyData = jDA.convertToBuffer = void 0;
  var aq8 = dPB();
  Object.defineProperty(jDA, "convertToBuffer", {
    enumerable: !0,
    get: function () {
      return aq8.convertToBuffer
    }
  });
  var oq8 = lPB();
  Object.defineProperty(jDA, "isEmptyData", {
    enumerable: !0,
    get: function () {
      return oq8.isEmptyData
    }
  });
  var rq8 = aPB();
  Object.defineProperty(jDA, "numToUint8", {
    enumerable: !0,
    get: function () {
      return rq8.numToUint8
    }
  });
  var sq8 = sPB();
  Object.defineProperty(jDA, "uint32ArrayFrom", {
    enumerable: !0,
    get: function () {
      return sq8.uint32ArrayFrom
    }
  })
})
// @from(Ln 198240, Col 4)
BSB = U((ASB) => {
  Object.defineProperty(ASB, "__esModule", {
    value: !0
  });
  ASB.AwsCrc32 = void 0;
  var tPB = Y90(),
    X90 = J90(),
    ePB = V41(),
    eq8 = function () {
      function A() {
        this.crc32 = new ePB.Crc32
      }
      return A.prototype.update = function (Q) {
        if ((0, X90.isEmptyData)(Q)) return;
        this.crc32.update((0, X90.convertToBuffer)(Q))
      }, A.prototype.digest = function () {
        return tPB.__awaiter(this, void 0, void 0, function () {
          return tPB.__generator(this, function (Q) {
            return [2, (0, X90.numToUint8)(this.crc32.digest())]
          })
        })
      }, A.prototype.reset = function () {
        this.crc32 = new ePB.Crc32
      }, A
    }();
  ASB.AwsCrc32 = eq8
})
// @from(Ln 198267, Col 4)
V41 = U((I90) => {
  Object.defineProperty(I90, "__esModule", {
    value: !0
  });
  I90.AwsCrc32 = I90.Crc32 = I90.crc32 = void 0;
  var AN8 = Y90(),
    QN8 = J90();

  function BN8(A) {
    return new GSB().update(A).digest()
  }
  I90.crc32 = BN8;
  var GSB = function () {
    function A() {
      this.checksum = 4294967295
    }
    return A.prototype.update = function (Q) {
      var B, G;
      try {
        for (var Z = AN8.__values(Q), Y = Z.next(); !Y.done; Y = Z.next()) {
          var J = Y.value;
          this.checksum = this.checksum >>> 8 ^ ZN8[(this.checksum ^ J) & 255]
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
  I90.Crc32 = GSB;
  var GN8 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
    ZN8 = (0, QN8.uint32ArrayFrom)(GN8),
    YN8 = BSB();
  Object.defineProperty(I90, "AwsCrc32", {
    enumerable: !0,
    get: function () {
      return YN8.AwsCrc32
    }
  })
})
// @from(Ln 198317, Col 4)
WSB = U((pmG, DSB) => {
  var {
    defineProperty: F41,
    getOwnPropertyDescriptor: DN8,
    getOwnPropertyNames: WN8
  } = Object, KN8 = Object.prototype.hasOwnProperty, ZSB = (A, Q) => F41(A, "name", {
    value: Q,
    configurable: !0
  }), VN8 = (A, Q) => {
    for (var B in Q) F41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, FN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of WN8(Q))
        if (!KN8.call(A, Z) && Z !== B) F41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, HN8 = (A) => FN8(F41({}, "__esModule", {
    value: !0
  }), A), YSB = {};
  VN8(YSB, {
    fromHex: () => XSB,
    toHex: () => ISB
  });
  DSB.exports = HN8(YSB);
  var JSB = {},
    D90 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    JSB[A] = Q, D90[Q] = A
  }

  function XSB(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in D90) Q[B / 2] = D90[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }
  ZSB(XSB, "fromHex");

  function ISB(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += JSB[A[B]];
    return Q
  }
  ZSB(ISB, "toHex")
})
// @from(Ln 198374, Col 4)
OSB = U((lmG, LSB) => {
  var {
    defineProperty: E41,
    getOwnPropertyDescriptor: EN8,
    getOwnPropertyNames: zN8
  } = Object, $N8 = Object.prototype.hasOwnProperty, Cm = (A, Q) => E41(A, "name", {
    value: Q,
    configurable: !0
  }), CN8 = (A, Q) => {
    for (var B in Q) E41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, UN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of zN8(Q))
        if (!$N8.call(A, Z) && Z !== B) E41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = EN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, qN8 = (A) => UN8(E41({}, "__esModule", {
    value: !0
  }), A), VSB = {};
  CN8(VSB, {
    EventStreamCodec: () => yN8,
    HeaderMarshaller: () => ESB,
    Int64: () => H41,
    MessageDecoderStream: () => vN8,
    MessageEncoderStream: () => kN8,
    SmithyMessageDecoderStream: () => bN8,
    SmithyMessageEncoderStream: () => fN8
  });
  LSB.exports = qN8(VSB);
  var NN8 = V41(),
    X2A = WSB(),
    FSB = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) W90(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) W90(Q);
        return parseInt((0, X2A.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };
  Cm(FSB, "Int64");
  var H41 = FSB;

  function W90(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  Cm(W90, "negate");
  var HSB = class {
    constructor(Q, B) {
      this.toUtf8 = Q, this.fromUtf8 = B
    }
    format(Q) {
      let B = [];
      for (let Y of Object.keys(Q)) {
        let J = this.fromUtf8(Y);
        B.push(Uint8Array.from([J.byteLength]), J, this.formatHeaderValue(Q[Y]))
      }
      let G = new Uint8Array(B.reduce((Y, J) => Y + J.byteLength, 0)),
        Z = 0;
      for (let Y of B) G.set(Y, Z), Z += Y.byteLength;
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
          let Y = new DataView(new ArrayBuffer(3 + Q.value.byteLength));
          Y.setUint8(0, 6), Y.setUint16(1, Q.value.byteLength, !1);
          let J = new Uint8Array(Y.buffer);
          return J.set(Q.value, 3), J;
        case "string":
          let X = this.fromUtf8(Q.value),
            I = new DataView(new ArrayBuffer(3 + X.byteLength));
          I.setUint8(0, 7), I.setUint16(1, X.byteLength, !1);
          let D = new Uint8Array(I.buffer);
          return D.set(X, 3), D;
        case "timestamp":
          let W = new Uint8Array(9);
          return W[0] = 8, W.set(H41.fromNumber(Q.value.valueOf()).bytes, 1), W;
        case "uuid":
          if (!PN8.test(Q.value)) throw Error(`Invalid UUID received: ${Q.value}`);
          let K = new Uint8Array(17);
          return K[0] = 9, K.set((0, X2A.fromHex)(Q.value.replace(/\-/g, "")), 1), K
      }
    }
    parse(Q) {
      let B = {},
        G = 0;
      while (G < Q.byteLength) {
        let Z = Q.getUint8(G++),
          Y = this.toUtf8(new Uint8Array(Q.buffer, Q.byteOffset + G, Z));
        switch (G += Z, Q.getUint8(G++)) {
          case 0:
            B[Y] = {
              type: KSB,
              value: !0
            };
            break;
          case 1:
            B[Y] = {
              type: KSB,
              value: !1
            };
            break;
          case 2:
            B[Y] = {
              type: wN8,
              value: Q.getInt8(G++)
            };
            break;
          case 3:
            B[Y] = {
              type: LN8,
              value: Q.getInt16(G, !1)
            }, G += 2;
            break;
          case 4:
            B[Y] = {
              type: ON8,
              value: Q.getInt32(G, !1)
            }, G += 4;
            break;
          case 5:
            B[Y] = {
              type: MN8,
              value: new H41(new Uint8Array(Q.buffer, Q.byteOffset + G, 8))
            }, G += 8;
            break;
          case 6:
            let J = Q.getUint16(G, !1);
            G += 2, B[Y] = {
              type: RN8,
              value: new Uint8Array(Q.buffer, Q.byteOffset + G, J)
            }, G += J;
            break;
          case 7:
            let X = Q.getUint16(G, !1);
            G += 2, B[Y] = {
              type: _N8,
              value: this.toUtf8(new Uint8Array(Q.buffer, Q.byteOffset + G, X))
            }, G += X;
            break;
          case 8:
            B[Y] = {
              type: jN8,
              value: new Date(new H41(new Uint8Array(Q.buffer, Q.byteOffset + G, 8)).valueOf())
            }, G += 8;
            break;
          case 9:
            let I = new Uint8Array(Q.buffer, Q.byteOffset + G, 16);
            G += 16, B[Y] = {
              type: TN8,
              value: `${(0,X2A.toHex)(I.subarray(0,4))}-${(0,X2A.toHex)(I.subarray(4,6))}-${(0,X2A.toHex)(I.subarray(6,8))}-${(0,X2A.toHex)(I.subarray(8,10))}-${(0,X2A.toHex)(I.subarray(10))}`
            };
            break;
          default:
            throw Error("Unrecognized header type tag")
        }
      }
      return B
    }
  };
  Cm(HSB, "HeaderMarshaller");
  var ESB = HSB,
    KSB = "boolean",
    wN8 = "byte",
    LN8 = "short",
    ON8 = "integer",
    MN8 = "long",
    RN8 = "binary",
    _N8 = "string",
    jN8 = "timestamp",
    TN8 = "uuid",
    PN8 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    SN8 = V41(),
    zSB = 4,
    Ao = zSB * 2,
    I2A = 4,
    xN8 = Ao + I2A * 2;

  function $SB({
    byteLength: A,
    byteOffset: Q,
    buffer: B
  }) {
    if (A < xN8) throw Error("Provided message too short to accommodate event stream message overhead");
    let G = new DataView(B, Q, A),
      Z = G.getUint32(0, !1);
    if (A !== Z) throw Error("Reported message length does not match received message length");
    let Y = G.getUint32(zSB, !1),
      J = G.getUint32(Ao, !1),
      X = G.getUint32(A - I2A, !1),
      I = new SN8.Crc32().update(new Uint8Array(B, Q, Ao));
    if (J !== I.digest()) throw Error(`The prelude checksum specified in the message (${J}) does not match the calculated CRC32 checksum (${I.digest()})`);
    if (I.update(new Uint8Array(B, Q + Ao, A - (Ao + I2A))), X !== I.digest()) throw Error(`The message checksum (${I.digest()}) did not match the expected value of ${X}`);
    return {
      headers: new DataView(B, Q + Ao + I2A, Y),
      body: new Uint8Array(B, Q + Ao + I2A + Y, Z - Y - (Ao + I2A + I2A))
    }
  }
  Cm($SB, "splitMessage");
  var CSB = class {
    constructor(Q, B) {
      this.headerMarshaller = new ESB(Q, B), this.messageBuffer = [], this.isEndOfStream = !1
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
        Y = new Uint8Array(Z),
        J = new DataView(Y.buffer, Y.byteOffset, Y.byteLength),
        X = new NN8.Crc32;
      return J.setUint32(0, Z, !1), J.setUint32(4, G.byteLength, !1), J.setUint32(8, X.update(Y.subarray(0, 8)).digest(), !1), Y.set(G, 12), Y.set(B, G.byteLength + 12), J.setUint32(Z - 4, X.update(Y.subarray(8, Z - 4)).digest(), !1), Y
    }
    decode(Q) {
      let {
        headers: B,
        body: G
      } = $SB(Q);
      return {
        headers: this.headerMarshaller.parse(B),
        body: G
      }
    }
    formatHeaders(Q) {
      return this.headerMarshaller.format(Q)
    }
  };
  Cm(CSB, "EventStreamCodec");
  var yN8 = CSB,
    USB = class {
      constructor(Q) {
        this.options = Q
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let Q of this.options.inputStream) yield this.options.decoder.decode(Q)
      }
    };
  Cm(USB, "MessageDecoderStream");
  var vN8 = USB,
    qSB = class {
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
  Cm(qSB, "MessageEncoderStream");
  var kN8 = qSB,
    NSB = class {
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
  Cm(NSB, "SmithyMessageDecoderStream");
  var bN8 = NSB,
    wSB = class {
      constructor(Q) {
        this.options = Q
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let Q of this.options.inputStream) yield this.options.serializer(Q)
      }
    };
  Cm(wSB, "SmithyMessageEncoderStream");
  var fN8 = wSB
})
// @from(Ln 198723, Col 4)
SSB = U((imG, PSB) => {
  var {
    defineProperty: z41,
    getOwnPropertyDescriptor: hN8,
    getOwnPropertyNames: gN8
  } = Object, uN8 = Object.prototype.hasOwnProperty, TDA = (A, Q) => z41(A, "name", {
    value: Q,
    configurable: !0
  }), mN8 = (A, Q) => {
    for (var B in Q) z41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, dN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gN8(Q))
        if (!uN8.call(A, Z) && Z !== B) z41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cN8 = (A) => dN8(z41({}, "__esModule", {
    value: !0
  }), A), MSB = {};
  mN8(MSB, {
    EventStreamMarshaller: () => TSB,
    eventStreamSerdeProvider: () => pN8
  });
  PSB.exports = cN8(MSB);
  var ujA = OSB();

  function RSB(A) {
    let Q = 0,
      B = 0,
      G = null,
      Z = null,
      Y = TDA((X) => {
        if (typeof X !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + X);
        Q = X, B = 4, G = new Uint8Array(X), new DataView(G.buffer).setUint32(0, X, !1)
      }, "allocateMessage"),
      J = TDA(async function* () {
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
      }, "iterator");
    return {
      [Symbol.asyncIterator]: J
    }
  }
  TDA(RSB, "getChunkedStream");

  function _SB(A, Q) {
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
  TDA(_SB, "getMessageUnmarshaller");
  var jSB = class {
    constructor({
      utf8Encoder: Q,
      utf8Decoder: B
    }) {
      this.eventStreamCodec = new ujA.EventStreamCodec(Q, B), this.utfEncoder = Q
    }
    deserialize(Q, B) {
      let G = RSB(Q);
      return new ujA.SmithyMessageDecoderStream({
        messageStream: new ujA.MessageDecoderStream({
          inputStream: G,
          decoder: this.eventStreamCodec
        }),
        deserializer: _SB(B, this.utfEncoder)
      })
    }
    serialize(Q, B) {
      return new ujA.MessageEncoderStream({
        messageStream: new ujA.SmithyMessageEncoderStream({
          inputStream: Q,
          serializer: B
        }),
        encoder: this.eventStreamCodec,
        includeEndFrame: !0
      })
    }
  };
  TDA(jSB, "EventStreamMarshaller");
  var TSB = jSB,
    pN8 = TDA((A) => new TSB(A), "eventStreamSerdeProvider")
})
// @from(Ln 198860, Col 4)
fSB = U((nmG, bSB) => {
  var {
    defineProperty: $41,
    getOwnPropertyDescriptor: lN8,
    getOwnPropertyNames: iN8
  } = Object, nN8 = Object.prototype.hasOwnProperty, K90 = (A, Q) => $41(A, "name", {
    value: Q,
    configurable: !0
  }), aN8 = (A, Q) => {
    for (var B in Q) $41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, oN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of iN8(Q))
        if (!nN8.call(A, Z) && Z !== B) $41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = lN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rN8 = (A) => oN8($41({}, "__esModule", {
    value: !0
  }), A), xSB = {};
  aN8(xSB, {
    EventStreamMarshaller: () => kSB,
    eventStreamSerdeProvider: () => eN8
  });
  bSB.exports = rN8(xSB);
  var sN8 = SSB(),
    tN8 = NA("stream");
  async function* ySB(A) {
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
  K90(ySB, "readabletoIterable");
  var vSB = class {
    constructor({
      utf8Encoder: Q,
      utf8Decoder: B
    }) {
      this.universalMarshaller = new sN8.EventStreamMarshaller({
        utf8Decoder: B,
        utf8Encoder: Q
      })
    }
    deserialize(Q, B) {
      let G = typeof Q[Symbol.asyncIterator] === "function" ? Q : ySB(Q);
      return this.universalMarshaller.deserialize(G, B)
    }
    serialize(Q, B) {
      return tN8.Readable.from(this.universalMarshaller.serialize(Q, B))
    }
  };
  K90(vSB, "EventStreamMarshaller");
  var kSB = vSB,
    eN8 = K90((A) => new kSB(A), "eventStreamSerdeProvider")
})
// @from(Ln 198933, Col 4)
uSB = U((hSB) => {
  Object.defineProperty(hSB, "__esModule", {
    value: !0
  });
  hSB.fromBase64 = void 0;
  var Aw8 = v0A(),
    Qw8 = /^[A-Za-z0-9+/]*={0,2}$/,
    Bw8 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!Qw8.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, Aw8.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  hSB.fromBase64 = Bw8
})
// @from(Ln 198948, Col 4)
lSB = U((omG, pSB) => {
  var {
    defineProperty: C41,
    getOwnPropertyDescriptor: Gw8,
    getOwnPropertyNames: Zw8
  } = Object, Yw8 = Object.prototype.hasOwnProperty, V90 = (A, Q) => C41(A, "name", {
    value: Q,
    configurable: !0
  }), Jw8 = (A, Q) => {
    for (var B in Q) C41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Xw8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Zw8(Q))
        if (!Yw8.call(A, Z) && Z !== B) C41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Gw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Iw8 = (A) => Xw8(C41({}, "__esModule", {
    value: !0
  }), A), mSB = {};
  Jw8(mSB, {
    fromUtf8: () => cSB,
    toUint8Array: () => Dw8,
    toUtf8: () => Ww8
  });
  pSB.exports = Iw8(mSB);
  var dSB = v0A(),
    cSB = V90((A) => {
      let Q = (0, dSB.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    Dw8 = V90((A) => {
      if (typeof A === "string") return cSB(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    Ww8 = V90((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, dSB.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Ln 198995, Col 4)
aSB = U((iSB) => {
  Object.defineProperty(iSB, "__esModule", {
    value: !0
  });
  iSB.toBase64 = void 0;
  var Kw8 = v0A(),
    Vw8 = lSB(),
    Fw8 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, Vw8.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Kw8.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  iSB.toBase64 = Fw8
})
// @from(Ln 199011, Col 4)
E90 = U((smG, U41) => {
  var {
    defineProperty: oSB,
    getOwnPropertyDescriptor: Hw8,
    getOwnPropertyNames: Ew8
  } = Object, zw8 = Object.prototype.hasOwnProperty, F90 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Ew8(Q))
        if (!zw8.call(A, Z) && Z !== B) oSB(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Hw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rSB = (A, Q, B) => (F90(A, Q, "default"), B && F90(B, Q, "default")), $w8 = (A) => F90(oSB({}, "__esModule", {
    value: !0
  }), A), H90 = {};
  U41.exports = $w8(H90);
  rSB(H90, uSB(), U41.exports);
  rSB(H90, aSB(), U41.exports)
})
// @from(Ln 199032, Col 4)
QxB = U((tmG, AxB) => {
  var {
    defineProperty: q41,
    getOwnPropertyDescriptor: Cw8,
    getOwnPropertyNames: Uw8
  } = Object, qw8 = Object.prototype.hasOwnProperty, D_ = (A, Q) => q41(A, "name", {
    value: Q,
    configurable: !0
  }), Nw8 = (A, Q) => {
    for (var B in Q) q41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ww8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Uw8(Q))
        if (!qw8.call(A, Z) && Z !== B) q41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Cw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Lw8 = (A) => ww8(q41({}, "__esModule", {
    value: !0
  }), A), eSB = {};
  Nw8(eSB, {
    constructStack: () => z90
  });
  AxB.exports = Lw8(eSB);
  var D2A = D_((A, Q) => {
      let B = [];
      if (A) B.push(A);
      if (Q)
        for (let G of Q) B.push(G);
      return B
    }, "getAllAliases"),
    Qo = D_((A, Q) => {
      return `${A||"anonymous"}${Q&&Q.length>0?` (a.k.a. ${Q.join(",")})`:""}`
    }, "getMiddlewareNameWithAliases"),
    z90 = D_(() => {
      let A = [],
        Q = [],
        B = !1,
        G = new Set,
        Z = D_((K) => K.sort((V, F) => sSB[F.step] - sSB[V.step] || tSB[F.priority || "normal"] - tSB[V.priority || "normal"]), "sort"),
        Y = D_((K) => {
          let V = !1,
            F = D_((H) => {
              let E = D2A(H.name, H.aliases);
              if (E.includes(K)) {
                V = !0;
                for (let z of E) G.delete(z);
                return !1
              }
              return !0
            }, "filterCb");
          return A = A.filter(F), Q = Q.filter(F), V
        }, "removeByName"),
        J = D_((K) => {
          let V = !1,
            F = D_((H) => {
              if (H.middleware === K) {
                V = !0;
                for (let E of D2A(H.name, H.aliases)) G.delete(E);
                return !1
              }
              return !0
            }, "filterCb");
          return A = A.filter(F), Q = Q.filter(F), V
        }, "removeByReference"),
        X = D_((K) => {
          var V;
          return A.forEach((F) => {
            K.add(F.middleware, {
              ...F
            })
          }), Q.forEach((F) => {
            K.addRelativeTo(F.middleware, {
              ...F
            })
          }), (V = K.identifyOnResolve) == null || V.call(K, W.identifyOnResolve()), K
        }, "cloneTo"),
        I = D_((K) => {
          let V = [];
          return K.before.forEach((F) => {
            if (F.before.length === 0 && F.after.length === 0) V.push(F);
            else V.push(...I(F))
          }), V.push(K), K.after.reverse().forEach((F) => {
            if (F.before.length === 0 && F.after.length === 0) V.push(F);
            else V.push(...I(F))
          }), V
        }, "expandRelativeMiddlewareList"),
        D = D_((K = !1) => {
          let V = [],
            F = [],
            H = {};
          return A.forEach((z) => {
            let $ = {
              ...z,
              before: [],
              after: []
            };
            for (let O of D2A($.name, $.aliases)) H[O] = $;
            V.push($)
          }), Q.forEach((z) => {
            let $ = {
              ...z,
              before: [],
              after: []
            };
            for (let O of D2A($.name, $.aliases)) H[O] = $;
            F.push($)
          }), F.forEach((z) => {
            if (z.toMiddleware) {
              let $ = H[z.toMiddleware];
              if ($ === void 0) {
                if (K) return;
                throw Error(`${z.toMiddleware} is not found when adding ${Qo(z.name,z.aliases)} middleware ${z.relation} ${z.toMiddleware}`)
              }
              if (z.relation === "after") $.after.push(z);
              if (z.relation === "before") $.before.push(z)
            }
          }), Z(V).map(I).reduce((z, $) => {
            return z.push(...$), z
          }, [])
        }, "getMiddlewareList"),
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
            }, $ = D2A(F, E);
            if ($.length > 0) {
              if ($.some((O) => G.has(O))) {
                if (!H) throw Error(`Duplicate middleware name '${Qo(F,E)}'`);
                for (let O of $) {
                  let L = A.findIndex((_) => {
                    var j;
                    return _.name === O || ((j = _.aliases) == null ? void 0 : j.some((x) => x === O))
                  });
                  if (L === -1) continue;
                  let M = A[L];
                  if (M.step !== z.step || z.priority !== M.priority) throw Error(`"${Qo(M.name,M.aliases)}" middleware with ${M.priority} priority in ${M.step} step cannot be overridden by "${Qo(F,E)}" middleware with ${z.priority} priority in ${z.step} step.`);
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
            }, $ = D2A(F, E);
            if ($.length > 0) {
              if ($.some((O) => G.has(O))) {
                if (!H) throw Error(`Duplicate middleware name '${Qo(F,E)}'`);
                for (let O of $) {
                  let L = Q.findIndex((_) => {
                    var j;
                    return _.name === O || ((j = _.aliases) == null ? void 0 : j.some((x) => x === O))
                  });
                  if (L === -1) continue;
                  let M = Q[L];
                  if (M.toMiddleware !== z.toMiddleware || M.relation !== z.relation) throw Error(`"${Qo(M.name,M.aliases)}" middleware ${M.relation} "${M.toMiddleware}" middleware cannot be overridden by "${Qo(F,E)}" middleware ${z.relation} "${z.toMiddleware}" middleware.`);
                  Q.splice(L, 1)
                }
              }
              for (let O of $) G.add(O)
            }
            Q.push(z)
          },
          clone: () => X(z90()),
          use: (K) => {
            K.applyToStack(W)
          },
          remove: (K) => {
            if (typeof K === "string") return Y(K);
            else return J(K)
          },
          removeByTag: (K) => {
            let V = !1,
              F = D_((H) => {
                let {
                  tags: E,
                  name: z,
                  aliases: $
                } = H;
                if (E && E.includes(K)) {
                  let O = D2A(z, $);
                  for (let L of O) G.delete(L);
                  return V = !0, !1
                }
                return !0
              }, "filterCb");
            return A = A.filter(F), Q = Q.filter(F), V
          },
          concat: (K) => {
            var V;
            let F = X(z90());
            return F.use(K), F.identifyOnResolve(B || F.identifyOnResolve() || (((V = K.identifyOnResolve) == null ? void 0 : V.call(K)) ?? !1)), F
          },
          applyToStack: X,
          identify: () => {
            return D(!0).map((K) => {
              let V = K.step ?? K.relation + " " + K.toMiddleware;
              return Qo(K.name, K.aliases) + " - " + V
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
    }, "constructStack"),
    sSB = {
      initialize: 5,
      serialize: 4,
      build: 3,
      finalizeRequest: 2,
      deserialize: 1
    },
    tSB = {
      high: 3,
      normal: 2,
      low: 1
    }
})
// @from(Ln 199277, Col 4)
JxB = U((emG, YxB) => {
  var {
    defineProperty: N41,
    getOwnPropertyDescriptor: Ow8,
    getOwnPropertyNames: Mw8
  } = Object, Rw8 = Object.prototype.hasOwnProperty, $90 = (A, Q) => N41(A, "name", {
    value: Q,
    configurable: !0
  }), _w8 = (A, Q) => {
    for (var B in Q) N41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, jw8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Mw8(Q))
        if (!Rw8.call(A, Z) && Z !== B) N41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Ow8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Tw8 = (A) => jw8(N41({}, "__esModule", {
    value: !0
  }), A), BxB = {};
  _w8(BxB, {
    fromUtf8: () => ZxB,
    toUint8Array: () => Pw8,
    toUtf8: () => Sw8
  });
  YxB.exports = Tw8(BxB);
  var GxB = v0A(),
    ZxB = $90((A) => {
      let Q = (0, GxB.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    Pw8 = $90((A) => {
      if (typeof A === "string") return ZxB(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    Sw8 = $90((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, GxB.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Ln 199324, Col 4)
DxB = U((XxB) => {
  Object.defineProperty(XxB, "__esModule", {
    value: !0
  });
  XxB.getAwsChunkedEncodingStream = void 0;
  var xw8 = NA("stream"),
    yw8 = (A, Q) => {
      let {
        base64Encoder: B,
        bodyLengthChecker: G,
        checksumAlgorithmFn: Z,
        checksumLocationName: Y,
        streamHasher: J
      } = Q, X = B !== void 0 && Z !== void 0 && Y !== void 0 && J !== void 0, I = X ? J(Z, A) : void 0, D = new xw8.Readable({
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
  XxB.getAwsChunkedEncodingStream = yw8
})
// @from(Ln 199358, Col 4)
FxB = U((QdG, VxB) => {
  var {
    defineProperty: w41,
    getOwnPropertyDescriptor: vw8,
    getOwnPropertyNames: kw8
  } = Object, bw8 = Object.prototype.hasOwnProperty, C90 = (A, Q) => w41(A, "name", {
    value: Q,
    configurable: !0
  }), fw8 = (A, Q) => {
    for (var B in Q) w41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, hw8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kw8(Q))
        if (!bw8.call(A, Z) && Z !== B) w41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, gw8 = (A) => hw8(w41({}, "__esModule", {
    value: !0
  }), A), WxB = {};
  fw8(WxB, {
    escapeUri: () => KxB,
    escapeUriPath: () => mw8
  });
  VxB.exports = gw8(WxB);
  var KxB = C90((A) => encodeURIComponent(A).replace(/[!'()*]/g, uw8), "escapeUri"),
    uw8 = C90((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    mw8 = C90((A) => A.split("/").map(KxB).join("/"), "escapeUriPath")
})
// @from(Ln 199392, Col 4)
$xB = U((BdG, zxB) => {
  var {
    defineProperty: L41,
    getOwnPropertyDescriptor: dw8,
    getOwnPropertyNames: cw8
  } = Object, pw8 = Object.prototype.hasOwnProperty, lw8 = (A, Q) => L41(A, "name", {
    value: Q,
    configurable: !0
  }), iw8 = (A, Q) => {
    for (var B in Q) L41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, nw8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of cw8(Q))
        if (!pw8.call(A, Z) && Z !== B) L41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = dw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, aw8 = (A) => nw8(L41({}, "__esModule", {
    value: !0
  }), A), HxB = {};
  iw8(HxB, {
    buildQueryString: () => ExB
  });
  zxB.exports = aw8(HxB);
  var U90 = FxB();

  function ExB(A) {
    let Q = [];
    for (let B of Object.keys(A).sort()) {
      let G = A[B];
      if (B = (0, U90.escapeUri)(B), Array.isArray(G))
        for (let Z = 0, Y = G.length; Z < Y; Z++) Q.push(`${B}=${(0,U90.escapeUri)(G[Z])}`);
      else {
        let Z = B;
        if (G || typeof G === "string") Z += `=${(0,U90.escapeUri)(G)}`;
        Q.push(Z)
      }
    }
    return Q.join("&")
  }
  lw8(ExB, "buildQueryString")
})