
// @from(Start 3351922, End 3363380)
sHA = z((FN7, o$Q) => {
  var {
    defineProperty: ouA,
    getOwnPropertyDescriptor: N08,
    getOwnPropertyNames: L08
  } = Object, M08 = Object.prototype.hasOwnProperty, G6A = (A, Q) => ouA(A, "name", {
    value: Q,
    configurable: !0
  }), O08 = (A, Q) => {
    for (var B in Q) ouA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, R08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of L08(Q))
        if (!M08.call(A, Z) && Z !== B) ouA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = N08(Q, Z)) || G.enumerable
        })
    }
    return A
  }, T08 = (A) => R08(ouA({}, "__esModule", {
    value: !0
  }), A), c$Q = {};
  O08(c$Q, {
    ConditionObject: () => SZ.ConditionObject,
    DeprecatedObject: () => SZ.DeprecatedObject,
    EndpointError: () => SZ.EndpointError,
    EndpointObject: () => SZ.EndpointObject,
    EndpointObjectHeaders: () => SZ.EndpointObjectHeaders,
    EndpointObjectProperties: () => SZ.EndpointObjectProperties,
    EndpointParams: () => SZ.EndpointParams,
    EndpointResolverOptions: () => SZ.EndpointResolverOptions,
    EndpointRuleObject: () => SZ.EndpointRuleObject,
    ErrorRuleObject: () => SZ.ErrorRuleObject,
    EvaluateOptions: () => SZ.EvaluateOptions,
    Expression: () => SZ.Expression,
    FunctionArgv: () => SZ.FunctionArgv,
    FunctionObject: () => SZ.FunctionObject,
    FunctionReturn: () => SZ.FunctionReturn,
    ParameterObject: () => SZ.ParameterObject,
    ReferenceObject: () => SZ.ReferenceObject,
    ReferenceRecord: () => SZ.ReferenceRecord,
    RuleSetObject: () => SZ.RuleSetObject,
    RuleSetRules: () => SZ.RuleSetRules,
    TreeRuleObject: () => SZ.TreeRuleObject,
    awsEndpointFunctions: () => r$Q,
    getUserAgentPrefix: () => _08,
    isIpAddress: () => SZ.isIpAddress,
    partition: () => a$Q,
    resolveEndpoint: () => SZ.resolveEndpoint,
    setPartitionInfo: () => s$Q,
    useDefaultPartitionInfo: () => S08
  });
  o$Q.exports = T08(c$Q);
  var SZ = FI(),
    p$Q = G6A((A, Q = !1) => {
      if (Q) {
        for (let B of A.split("."))
          if (!p$Q(B)) return !1;
        return !0
      }
      if (!(0, SZ.isValidHostLabel)(A)) return !1;
      if (A.length < 3 || A.length > 63) return !1;
      if (A !== A.toLowerCase()) return !1;
      if ((0, SZ.isIpAddress)(A)) return !1;
      return !0
    }, "isVirtualHostableS3Bucket"),
    d$Q = ":",
    P08 = "/",
    j08 = G6A((A) => {
      let Q = A.split(d$Q);
      if (Q.length < 6) return null;
      let [B, G, Z, I, Y, ...J] = Q;
      if (B !== "arn" || G === "" || Z === "" || J.join(d$Q) === "") return null;
      let W = J.map((X) => X.split(P08)).flat();
      return {
        partition: G,
        service: Z,
        region: I,
        accountId: Y,
        resourceId: W
      }
    }, "parseArn"),
    l$Q = {
      partitions: [{
        id: "aws",
        outputs: {
          dnsSuffix: "amazonaws.com",
          dualStackDnsSuffix: "api.aws",
          implicitGlobalRegion: "us-east-1",
          name: "aws",
          supportsDualStack: !0,
          supportsFIPS: !0
        },
        regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
        regions: {
          "af-south-1": {
            description: "Africa (Cape Town)"
          },
          "ap-east-1": {
            description: "Asia Pacific (Hong Kong)"
          },
          "ap-east-2": {
            description: "Asia Pacific (Taipei)"
          },
          "ap-northeast-1": {
            description: "Asia Pacific (Tokyo)"
          },
          "ap-northeast-2": {
            description: "Asia Pacific (Seoul)"
          },
          "ap-northeast-3": {
            description: "Asia Pacific (Osaka)"
          },
          "ap-south-1": {
            description: "Asia Pacific (Mumbai)"
          },
          "ap-south-2": {
            description: "Asia Pacific (Hyderabad)"
          },
          "ap-southeast-1": {
            description: "Asia Pacific (Singapore)"
          },
          "ap-southeast-2": {
            description: "Asia Pacific (Sydney)"
          },
          "ap-southeast-3": {
            description: "Asia Pacific (Jakarta)"
          },
          "ap-southeast-4": {
            description: "Asia Pacific (Melbourne)"
          },
          "ap-southeast-5": {
            description: "Asia Pacific (Malaysia)"
          },
          "ap-southeast-7": {
            description: "Asia Pacific (Thailand)"
          },
          "aws-global": {
            description: "AWS Standard global region"
          },
          "ca-central-1": {
            description: "Canada (Central)"
          },
          "ca-west-1": {
            description: "Canada West (Calgary)"
          },
          "eu-central-1": {
            description: "Europe (Frankfurt)"
          },
          "eu-central-2": {
            description: "Europe (Zurich)"
          },
          "eu-north-1": {
            description: "Europe (Stockholm)"
          },
          "eu-south-1": {
            description: "Europe (Milan)"
          },
          "eu-south-2": {
            description: "Europe (Spain)"
          },
          "eu-west-1": {
            description: "Europe (Ireland)"
          },
          "eu-west-2": {
            description: "Europe (London)"
          },
          "eu-west-3": {
            description: "Europe (Paris)"
          },
          "il-central-1": {
            description: "Israel (Tel Aviv)"
          },
          "me-central-1": {
            description: "Middle East (UAE)"
          },
          "me-south-1": {
            description: "Middle East (Bahrain)"
          },
          "mx-central-1": {
            description: "Mexico (Central)"
          },
          "sa-east-1": {
            description: "South America (Sao Paulo)"
          },
          "us-east-1": {
            description: "US East (N. Virginia)"
          },
          "us-east-2": {
            description: "US East (Ohio)"
          },
          "us-west-1": {
            description: "US West (N. California)"
          },
          "us-west-2": {
            description: "US West (Oregon)"
          }
        }
      }, {
        id: "aws-cn",
        outputs: {
          dnsSuffix: "amazonaws.com.cn",
          dualStackDnsSuffix: "api.amazonwebservices.com.cn",
          implicitGlobalRegion: "cn-northwest-1",
          name: "aws-cn",
          supportsDualStack: !0,
          supportsFIPS: !0
        },
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        regions: {
          "aws-cn-global": {
            description: "AWS China global region"
          },
          "cn-north-1": {
            description: "China (Beijing)"
          },
          "cn-northwest-1": {
            description: "China (Ningxia)"
          }
        }
      }, {
        id: "aws-us-gov",
        outputs: {
          dnsSuffix: "amazonaws.com",
          dualStackDnsSuffix: "api.aws",
          implicitGlobalRegion: "us-gov-west-1",
          name: "aws-us-gov",
          supportsDualStack: !0,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        regions: {
          "aws-us-gov-global": {
            description: "AWS GovCloud (US) global region"
          },
          "us-gov-east-1": {
            description: "AWS GovCloud (US-East)"
          },
          "us-gov-west-1": {
            description: "AWS GovCloud (US-West)"
          }
        }
      }, {
        id: "aws-iso",
        outputs: {
          dnsSuffix: "c2s.ic.gov",
          dualStackDnsSuffix: "c2s.ic.gov",
          implicitGlobalRegion: "us-iso-east-1",
          name: "aws-iso",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-global": {
            description: "AWS ISO (US) global region"
          },
          "us-iso-east-1": {
            description: "US ISO East"
          },
          "us-iso-west-1": {
            description: "US ISO WEST"
          }
        }
      }, {
        id: "aws-iso-b",
        outputs: {
          dnsSuffix: "sc2s.sgov.gov",
          dualStackDnsSuffix: "sc2s.sgov.gov",
          implicitGlobalRegion: "us-isob-east-1",
          name: "aws-iso-b",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-b-global": {
            description: "AWS ISOB (US) global region"
          },
          "us-isob-east-1": {
            description: "US ISOB East (Ohio)"
          }
        }
      }, {
        id: "aws-iso-e",
        outputs: {
          dnsSuffix: "cloud.adc-e.uk",
          dualStackDnsSuffix: "cloud.adc-e.uk",
          implicitGlobalRegion: "eu-isoe-west-1",
          name: "aws-iso-e",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-e-global": {
            description: "AWS ISOE (Europe) global region"
          },
          "eu-isoe-west-1": {
            description: "EU ISOE West"
          }
        }
      }, {
        id: "aws-iso-f",
        outputs: {
          dnsSuffix: "csp.hci.ic.gov",
          dualStackDnsSuffix: "csp.hci.ic.gov",
          implicitGlobalRegion: "us-isof-south-1",
          name: "aws-iso-f",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-f-global": {
            description: "AWS ISOF global region"
          },
          "us-isof-east-1": {
            description: "US ISOF EAST"
          },
          "us-isof-south-1": {
            description: "US ISOF SOUTH"
          }
        }
      }, {
        id: "aws-eusc",
        outputs: {
          dnsSuffix: "amazonaws.eu",
          dualStackDnsSuffix: "amazonaws.eu",
          implicitGlobalRegion: "eusc-de-east-1",
          name: "aws-eusc",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
        regions: {
          "eusc-de-east-1": {
            description: "EU (Germany)"
          }
        }
      }],
      version: "1.1"
    },
    i$Q = l$Q,
    n$Q = "",
    a$Q = G6A((A) => {
      let {
        partitions: Q
      } = i$Q;
      for (let G of Q) {
        let {
          regions: Z,
          outputs: I
        } = G;
        for (let [Y, J] of Object.entries(Z))
          if (Y === A) return {
            ...I,
            ...J
          }
      }
      for (let G of Q) {
        let {
          regionRegex: Z,
          outputs: I
        } = G;
        if (new RegExp(Z).test(A)) return {
          ...I
        }
      }
      let B = Q.find((G) => G.id === "aws");
      if (!B) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
      return {
        ...B.outputs
      }
    }, "partition"),
    s$Q = G6A((A, Q = "") => {
      i$Q = A, n$Q = Q
    }, "setPartitionInfo"),
    S08 = G6A(() => {
      s$Q(l$Q, "")
    }, "useDefaultPartitionInfo"),
    _08 = G6A(() => n$Q, "getUserAgentPrefix"),
    r$Q = {
      isVirtualHostableS3Bucket: p$Q,
      parseArn: j08,
      partition: a$Q
    };
  SZ.customEndpointFunctions.aws = r$Q
})
// @from(Start 3363386, End 3364339)
AwQ = z((KN7, e$Q) => {
  var {
    defineProperty: tuA,
    getOwnPropertyDescriptor: k08,
    getOwnPropertyNames: y08
  } = Object, x08 = Object.prototype.hasOwnProperty, v08 = (A, Q) => tuA(A, "name", {
    value: Q,
    configurable: !0
  }), b08 = (A, Q) => {
    for (var B in Q) tuA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, f08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of y08(Q))
        if (!x08.call(A, Z) && Z !== B) tuA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = k08(Q, Z)) || G.enumerable
        })
    }
    return A
  }, h08 = (A) => f08(tuA({}, "__esModule", {
    value: !0
  }), A), t$Q = {};
  b08(t$Q, {
    isArrayBuffer: () => g08
  });
  e$Q.exports = h08(t$Q);
  var g08 = v08((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 3364345, End 3365398)
ZwQ = z((DN7, GwQ) => {
  var {
    defineProperty: euA,
    getOwnPropertyDescriptor: u08,
    getOwnPropertyNames: m08
  } = Object, d08 = Object.prototype.hasOwnProperty, MO1 = (A, Q) => euA(A, "name", {
    value: Q,
    configurable: !0
  }), c08 = (A, Q) => {
    for (var B in Q) euA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, p08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of m08(Q))
        if (!d08.call(A, Z) && Z !== B) euA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = u08(Q, Z)) || G.enumerable
        })
    }
    return A
  }, l08 = (A) => p08(euA({}, "__esModule", {
    value: !0
  }), A), QwQ = {};
  c08(QwQ, {
    escapeUri: () => BwQ,
    escapeUriPath: () => n08
  });
  GwQ.exports = l08(QwQ);
  var BwQ = MO1((A) => encodeURIComponent(A).replace(/[!'()*]/g, i08), "escapeUri"),
    i08 = MO1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    n08 = MO1((A) => A.split("/").map(BwQ).join("/"), "escapeUriPath")
})
// @from(Start 3365404, End 3382317)
kwQ = z((HN7, _wQ) => {
  var {
    defineProperty: YmA,
    getOwnPropertyDescriptor: a08,
    getOwnPropertyNames: s08
  } = Object, r08 = Object.prototype.hasOwnProperty, JD = (A, Q) => YmA(A, "name", {
    value: Q,
    configurable: !0
  }), o08 = (A, Q) => {
    for (var B in Q) YmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, t08 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of s08(Q))
        if (!r08.call(A, Z) && Z !== B) YmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = a08(Q, Z)) || G.enumerable
        })
    }
    return A
  }, e08 = (A) => t08(YmA({}, "__esModule", {
    value: !0
  }), A), XwQ = {};
  o08(XwQ, {
    ALGORITHM_IDENTIFIER: () => AmA,
    ALGORITHM_IDENTIFIER_V4A: () => GQ8,
    ALGORITHM_QUERY_PARAM: () => VwQ,
    ALWAYS_UNSIGNABLE_HEADERS: () => UwQ,
    AMZ_DATE_HEADER: () => kO1,
    AMZ_DATE_QUERY_PARAM: () => PO1,
    AUTH_HEADER: () => _O1,
    CREDENTIAL_QUERY_PARAM: () => FwQ,
    DATE_HEADER: () => HwQ,
    EVENT_ALGORITHM_IDENTIFIER: () => qwQ,
    EXPIRES_QUERY_PARAM: () => DwQ,
    GENERATED_HEADERS: () => CwQ,
    HOST_HEADER: () => QQ8,
    KEY_TYPE_IDENTIFIER: () => yO1,
    MAX_CACHE_SIZE: () => LwQ,
    MAX_PRESIGNED_TTL: () => MwQ,
    PROXY_HEADER_PATTERN: () => $wQ,
    REGION_SET_PARAM: () => AQ8,
    SEC_HEADER_PATTERN: () => wwQ,
    SHA256_HEADER: () => ImA,
    SIGNATURE_HEADER: () => EwQ,
    SIGNATURE_QUERY_PARAM: () => jO1,
    SIGNED_HEADERS_QUERY_PARAM: () => KwQ,
    SignatureV4: () => HQ8,
    SignatureV4Base: () => SwQ,
    TOKEN_HEADER: () => zwQ,
    TOKEN_QUERY_PARAM: () => SO1,
    UNSIGNABLE_PATTERNS: () => BQ8,
    UNSIGNED_PAYLOAD: () => NwQ,
    clearCredentialCache: () => IQ8,
    createScope: () => BmA,
    getCanonicalHeaders: () => OO1,
    getCanonicalQuery: () => jwQ,
    getPayloadHash: () => GmA,
    getSigningKey: () => OwQ,
    hasHeader: () => RwQ,
    moveHeadersToQuery: () => PwQ,
    prepareRequest: () => TO1,
    signatureV4aContainer: () => CQ8
  });
  _wQ.exports = e08(XwQ);
  var IwQ = O2(),
    VwQ = "X-Amz-Algorithm",
    FwQ = "X-Amz-Credential",
    PO1 = "X-Amz-Date",
    KwQ = "X-Amz-SignedHeaders",
    DwQ = "X-Amz-Expires",
    jO1 = "X-Amz-Signature",
    SO1 = "X-Amz-Security-Token",
    AQ8 = "X-Amz-Region-Set",
    _O1 = "authorization",
    kO1 = PO1.toLowerCase(),
    HwQ = "date",
    CwQ = [_O1, kO1, HwQ],
    EwQ = jO1.toLowerCase(),
    ImA = "x-amz-content-sha256",
    zwQ = SO1.toLowerCase(),
    QQ8 = "host",
    UwQ = {
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
    $wQ = /^proxy-/,
    wwQ = /^sec-/,
    BQ8 = [/^proxy-/i, /^sec-/i],
    AmA = "AWS4-HMAC-SHA256",
    GQ8 = "AWS4-ECDSA-P256-SHA256",
    qwQ = "AWS4-HMAC-SHA256-PAYLOAD",
    NwQ = "UNSIGNED-PAYLOAD",
    LwQ = 50,
    yO1 = "aws4_request",
    MwQ = 604800,
    bd = Jd(),
    ZQ8 = O2(),
    Z6A = {},
    QmA = [],
    BmA = JD((A, Q, B) => `${A}/${Q}/${B}/${yO1}`, "createScope"),
    OwQ = JD(async (A, Q, B, G, Z) => {
      let I = await YwQ(A, Q.secretAccessKey, Q.accessKeyId),
        Y = `${B}:${G}:${Z}:${(0,bd.toHex)(I)}:${Q.sessionToken}`;
      if (Y in Z6A) return Z6A[Y];
      QmA.push(Y);
      while (QmA.length > LwQ) delete Z6A[QmA.shift()];
      let J = `AWS4${Q.secretAccessKey}`;
      for (let W of [B, G, Z, yO1]) J = await YwQ(A, J, W);
      return Z6A[Y] = J
    }, "getSigningKey"),
    IQ8 = JD(() => {
      QmA.length = 0, Object.keys(Z6A).forEach((A) => {
        delete Z6A[A]
      })
    }, "clearCredentialCache"),
    YwQ = JD((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, ZQ8.toUint8Array)(B)), G.digest()
    }, "hmac"),
    OO1 = JD(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let I = Z.toLowerCase();
        if (I in UwQ || Q?.has(I) || $wQ.test(I) || wwQ.test(I)) {
          if (!B || B && !B.has(I)) continue
        }
        G[I] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    YQ8 = AwQ(),
    JQ8 = O2(),
    GmA = JD(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === ImA) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, YQ8.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, JQ8.toUint8Array)(Q)), (0, bd.toHex)(await G.digest())
      }
      return NwQ
    }, "getPayloadHash"),
    JwQ = O2(),
    WQ8 = class {
      static {
        JD(this, "HeaderFormatter")
      }
      format(A) {
        let Q = [];
        for (let Z of Object.keys(A)) {
          let I = (0, JwQ.fromUtf8)(Z);
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
            let Y = (0, JwQ.fromUtf8)(A.value),
              J = new DataView(new ArrayBuffer(3 + Y.byteLength));
            J.setUint8(0, 7), J.setUint16(1, Y.byteLength, !1);
            let W = new Uint8Array(J.buffer);
            return W.set(Y, 3), W;
          case "timestamp":
            let X = new Uint8Array(9);
            return X[0] = 8, X.set(VQ8.fromNumber(A.value.valueOf()).bytes, 1), X;
          case "uuid":
            if (!XQ8.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
            let V = new Uint8Array(17);
            return V[0] = 9, V.set((0, bd.fromHex)(A.value.replace(/\-/g, "")), 1), V
        }
      }
    },
    XQ8 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    VQ8 = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static {
        JD(this, "Int64")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) RO1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) RO1(Q);
        return parseInt((0, bd.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };

  function RO1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  JD(RO1, "negate");
  var RwQ = JD((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    TwQ = Lw(),
    PwQ = JD((A, Q = {}) => {
      let {
        headers: B,
        query: G = {}
      } = TwQ.HttpRequest.clone(A);
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
    TO1 = JD((A) => {
      A = TwQ.HttpRequest.clone(A);
      for (let Q of Object.keys(A.headers))
        if (CwQ.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    WwQ = w7(),
    FQ8 = O2(),
    ZmA = ZwQ(),
    jwQ = JD(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A)) {
        if (G.toLowerCase() === EwQ) continue;
        let Z = (0, ZmA.escapeUri)(G);
        Q.push(Z);
        let I = A[G];
        if (typeof I === "string") B[Z] = `${Z}=${(0,ZmA.escapeUri)(I)}`;
        else if (Array.isArray(I)) B[Z] = I.slice(0).reduce((Y, J) => Y.concat([`${Z}=${(0,ZmA.escapeUri)(J)}`]), []).sort().join("&")
      }
      return Q.sort().map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    KQ8 = JD((A) => DQ8(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    DQ8 = JD((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    SwQ = class {
      static {
        JD(this, "SignatureV4Base")
      }
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        this.service = G, this.sha256 = Z, this.uriEscapePath = I, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = (0, WwQ.normalizeProvider)(B), this.credentialProvider = (0, WwQ.normalizeProvider)(Q)
      }
      createCanonicalRequest(A, Q, B) {
        let G = Object.keys(Q).sort();
        return `${A.method}
${this.getCanonicalPath(A)}
${jwQ(A)}
${G.map((Z)=>`${Z}:${Q[Z]}`).join(`
`)}

${G.join(";")}
${B}`
      }
      async createStringToSign(A, Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, FQ8.toUint8Array)(B));
        let I = await Z.digest();
        return `${G}
${A}
${Q}
${(0,bd.toHex)(I)}`
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
          return (0, ZmA.escapeUri)(B).replace(/%2F/g, "/")
        }
        return A
      }
      validateResolvedCredentials(A) {
        if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
      formatDate(A) {
        let Q = KQ8(A).replace(/[\-:]/g, "");
        return {
          longDate: Q,
          shortDate: Q.slice(0, 8)
        }
      }
      getCanonicalHeaderList(A) {
        return Object.keys(A).sort().join(";")
      }
    },
    HQ8 = class extends SwQ {
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
        this.headerFormatter = new WQ8
      }
      static {
        JD(this, "SignatureV4")
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
        if (G > MwQ) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = BmA(D, F, X ?? this.service),
          C = PwQ(TO1(A), {
            unhoistableHeaders: I,
            hoistableHeaders: J
          });
        if (V.sessionToken) C.query[SO1] = V.sessionToken;
        C.query[VwQ] = AmA, C.query[FwQ] = `${V.accessKeyId}/${H}`, C.query[PO1] = K, C.query[DwQ] = G.toString(10);
        let E = OO1(C, Z, Y);
        return C.query[KwQ] = this.getCanonicalHeaderList(E), C.query[jO1] = await this.getSignature(K, H, this.getSigningKey(V, F, D, X), this.createCanonicalRequest(C, E, await GmA(A, this.sha256))), C
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
          X = BmA(J, Y, I ?? this.service),
          V = await GmA({
            headers: {},
            body: Q
          }, this.sha256),
          F = new this.sha256;
        F.update(A);
        let K = (0, bd.toHex)(await F.digest()),
          D = [qwQ, W, X, G, K, V].join(`
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
        return J.update((0, IwQ.toUint8Array)(A)), (0, bd.toHex)(await J.digest())
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
          W = TO1(A),
          {
            longDate: X,
            shortDate: V
          } = this.formatDate(Q),
          F = BmA(V, J, I ?? this.service);
        if (W.headers[kO1] = X, Y.sessionToken) W.headers[zwQ] = Y.sessionToken;
        let K = await GmA(W, this.sha256);
        if (!RwQ(ImA, W.headers) && this.applyChecksum) W.headers[ImA] = K;
        let D = OO1(W, G, B),
          H = await this.getSignature(X, F, this.getSigningKey(Y, J, V, I), this.createCanonicalRequest(W, D, K));
        return W.headers[_O1] = `${AmA} Credential=${Y.accessKeyId}/${F}, SignedHeaders=${this.getCanonicalHeaderList(D)}, Signature=${H}`, W
      }
      async getSignature(A, Q, B, G) {
        let Z = await this.createStringToSign(A, Q, G, AmA),
          I = new this.sha256(await B);
        return I.update((0, IwQ.toUint8Array)(Z)), (0, bd.toHex)(await I.digest())
      }
      getSigningKey(A, Q, B, G) {
        return OwQ(this.sha256, A, B, Q, G || this.service)
      }
    },
    CQ8 = {
      SignatureV4a: null
    }
})
// @from(Start 3382323, End 3391737)
fO1 = z((UN7, lwQ) => {
  var {
    defineProperty: JmA,
    getOwnPropertyDescriptor: EQ8,
    getOwnPropertyNames: zQ8
  } = Object, UQ8 = Object.prototype.hasOwnProperty, zW = (A, Q) => JmA(A, "name", {
    value: Q,
    configurable: !0
  }), $Q8 = (A, Q) => {
    for (var B in Q) JmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, wQ8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of zQ8(Q))
        if (!UQ8.call(A, Z) && Z !== B) JmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = EQ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, qQ8 = (A) => wQ8(JmA({}, "__esModule", {
    value: !0
  }), A), uwQ = {};
  $Q8(uwQ, {
    AWSSDKSigV4Signer: () => OQ8,
    AwsSdkSigV4ASigner: () => TQ8,
    AwsSdkSigV4Signer: () => bO1,
    NODE_AUTH_SCHEME_PREFERENCE_OPTIONS: () => PQ8,
    NODE_SIGV4A_CONFIG_OPTIONS: () => _Q8,
    getBearerTokenEnvKey: () => mwQ,
    resolveAWSSDKSigV4Config: () => yQ8,
    resolveAwsSdkSigV4AConfig: () => SQ8,
    resolveAwsSdkSigV4Config: () => dwQ,
    validateSigningProperties: () => vO1
  });
  lwQ.exports = qQ8(uwQ);
  var NQ8 = Lw(),
    LQ8 = Lw(),
    ywQ = zW((A) => LQ8.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0, "getDateHeader"),
    xO1 = zW((A) => new Date(Date.now() + A), "getSkewCorrectedDate"),
    MQ8 = zW((A, Q) => Math.abs(xO1(Q).getTime() - A) >= 300000, "isClockSkewed"),
    xwQ = zW((A, Q) => {
      let B = Date.parse(A);
      if (MQ8(B, Q)) return B - Date.now();
      return Q
    }, "getUpdatedSystemClockOffset"),
    rHA = zW((A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    }, "throwSigningPropertyError"),
    vO1 = zW(async (A) => {
      let Q = rHA("context", A.context),
        B = rHA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        I = await rHA("signer", B.signer)(G),
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
    bO1 = class {
      static {
        zW(this, "AwsSdkSigV4Signer")
      }
      async sign(A, Q, B) {
        if (!NQ8.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let G = await vO1(B),
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
          signingDate: xO1(Z.systemClockOffset),
          signingRegion: Y,
          signingService: J
        })
      }
      errorHandler(A) {
        return (Q) => {
          let B = Q.ServerTime ?? ywQ(Q.$response);
          if (B) {
            let G = rHA("config", A.config),
              Z = G.systemClockOffset;
            if (G.systemClockOffset = xwQ(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
          }
          throw Q
        }
      }
      successHandler(A, Q) {
        let B = ywQ(A);
        if (B) {
          let G = rHA("config", Q.config);
          G.systemClockOffset = xwQ(B, G.systemClockOffset)
        }
      }
    },
    OQ8 = bO1,
    RQ8 = Lw(),
    TQ8 = class extends bO1 {
      static {
        zW(this, "AwsSdkSigV4ASigner")
      }
      async sign(A, Q, B) {
        if (!RQ8.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let {
          config: G,
          signer: Z,
          signingRegion: I,
          signingRegionSet: Y,
          signingName: J
        } = await vO1(B), X = (await G.sigv4aSigningRegionSet?.() ?? Y ?? [I]).join(",");
        return await Z.sign(A, {
          signingDate: xO1(G.systemClockOffset),
          signingRegion: X,
          signingService: J
        })
      }
    },
    vwQ = zW((A) => typeof A === "string" && A.length > 0 ? A.split(",").map((Q) => Q.trim()) : [], "getArrayForCommaSeparatedString"),
    mwQ = zW((A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`, "getBearerTokenEnvKey"),
    bwQ = "AWS_AUTH_SCHEME_PREFERENCE",
    fwQ = "auth_scheme_preference",
    PQ8 = {
      environmentVariableSelector: zW((A, Q) => {
        if (Q?.signingName) {
          if (mwQ(Q.signingName) in A) return ["httpBearerAuth"]
        }
        if (!(bwQ in A)) return;
        return vwQ(A[bwQ])
      }, "environmentVariableSelector"),
      configFileSelector: zW((A) => {
        if (!(fwQ in A)) return;
        return vwQ(A[fwQ])
      }, "configFileSelector"),
      default: []
    },
    jQ8 = iB(),
    hwQ = j2(),
    SQ8 = zW((A) => {
      return A.sigv4aSigningRegionSet = (0, jQ8.normalizeProvider)(A.sigv4aSigningRegionSet), A
    }, "resolveAwsSdkSigV4AConfig"),
    _Q8 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new hwQ.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new hwQ.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    kQ8 = LL(),
    Yo = iB(),
    gwQ = kwQ(),
    dwQ = zW((A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(X) {
          if (X && X !== Q && X !== G) B = !0;
          Q = X;
          let V = cwQ(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            F = pwQ(A, V);
          if (B && !F.attributed) G = zW(async (K) => F(K).then((D) => (0, kQ8.setCredentialFeature)(D, "CREDENTIALS_CODE", "e")), "resolvedCredentials"), G.memoized = F.memoized, G.configBound = F.configBound, G.attributed = !0;
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
      if (A.signer) J = (0, Yo.normalizeProvider)(A.signer);
      else if (A.regionInfoProvider) J = zW(() => (0, Yo.normalizeProvider)(A.region)().then(async (X) => [await A.regionInfoProvider(X, {
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
        return new(A.signerConstructor || gwQ.SignatureV4)(D)
      }), "signer");
      else J = zW(async (X) => {
        X = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await (0, Yo.normalizeProvider)(A.region)(),
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
        return new(A.signerConstructor || gwQ.SignatureV4)(K)
      }, "signer");
      return Object.assign(A, {
        systemClockOffset: I,
        signingEscapePath: Z,
        signer: J
      })
    }, "resolveAwsSdkSigV4Config"),
    yQ8 = dwQ;

  function cwQ(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = (0, Yo.memoizeIdentityProvider)(Q, Yo.isIdentityExpired, Yo.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = (0, Yo.normalizeProvider)(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = zW(async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    }, "credentialsProvider");
    return G.memoized = !0, G
  }
  zW(cwQ, "normalizeCredentialProvider");

  function pwQ(A, Q) {
    if (Q.configBound) return Q;
    let B = zW(async (G) => Q({
      ...G,
      callerClientConfig: A
    }), "fn");
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  zW(pwQ, "bindCallerConfig")
})
// @from(Start 3391743, End 3392230)
awQ = z((iwQ) => {
  Object.defineProperty(iwQ, "__esModule", {
    value: !0
  });
  iwQ.fromBase64 = void 0;
  var xQ8 = hI(),
    vQ8 = /^[A-Za-z0-9+/]*={0,2}$/,
    bQ8 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!vQ8.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, xQ8.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  iwQ.fromBase64 = bQ8
})
// @from(Start 3392236, End 3392815)
owQ = z((swQ) => {
  Object.defineProperty(swQ, "__esModule", {
    value: !0
  });
  swQ.toBase64 = void 0;
  var fQ8 = hI(),
    hQ8 = O2(),
    gQ8 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, hQ8.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, fQ8.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  swQ.toBase64 = gQ8
})
// @from(Start 3392821, End 3393516)
Jo = z((LN7, WmA) => {
  var {
    defineProperty: twQ,
    getOwnPropertyDescriptor: uQ8,
    getOwnPropertyNames: mQ8
  } = Object, dQ8 = Object.prototype.hasOwnProperty, hO1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of mQ8(Q))
        if (!dQ8.call(A, Z) && Z !== B) twQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = uQ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ewQ = (A, Q, B) => (hO1(A, Q, "default"), B && hO1(B, Q, "default")), cQ8 = (A) => hO1(twQ({}, "__esModule", {
    value: !0
  }), A), gO1 = {};
  WmA.exports = cQ8(gO1);
  ewQ(gO1, awQ(), WmA.exports);
  ewQ(gO1, owQ(), WmA.exports)
})
// @from(Start 3393522, End 3438713)
CqQ = z((MN7, HqQ) => {
  var {
    defineProperty: VmA,
    getOwnPropertyDescriptor: pQ8,
    getOwnPropertyNames: lQ8
  } = Object, iQ8 = Object.prototype.hasOwnProperty, J3 = (A, Q) => VmA(A, "name", {
    value: Q,
    configurable: !0
  }), nQ8 = (A, Q) => {
    for (var B in Q) VmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, aQ8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of lQ8(Q))
        if (!iQ8.call(A, Z) && Z !== B) VmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = pQ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, sQ8 = (A) => aQ8(VmA({}, "__esModule", {
    value: !0
  }), A), ZqQ = {};
  nQ8(ZqQ, {
    AwsEc2QueryProtocol: () => MB8,
    AwsJson1_0Protocol: () => XB8,
    AwsJson1_1Protocol: () => VB8,
    AwsJsonRpcProtocol: () => nO1,
    AwsQueryProtocol: () => XqQ,
    AwsRestJsonProtocol: () => KB8,
    AwsRestXmlProtocol: () => SB8,
    JsonCodec: () => iO1,
    JsonShapeDeserializer: () => JqQ,
    JsonShapeSerializer: () => WqQ,
    XmlCodec: () => DqQ,
    XmlShapeDeserializer: () => aO1,
    XmlShapeSerializer: () => KqQ,
    _toBool: () => oQ8,
    _toNum: () => tQ8,
    _toStr: () => rQ8,
    awsExpectUnion: () => HB8,
    loadRestJsonErrorCode: () => lO1,
    loadRestXmlErrorCode: () => FqQ,
    parseJsonBody: () => pO1,
    parseJsonErrorBody: () => ZB8,
    parseXmlBody: () => VqQ,
    parseXmlErrorBody: () => PB8
  });
  HqQ.exports = sQ8(ZqQ);
  var rQ8 = J3((A) => {
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
    oQ8 = J3((A) => {
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
    tQ8 = J3((A) => {
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
    eQ8 = w5(),
    I6A = b4(),
    AB8 = oK(),
    Xo = class {
      static {
        J3(this, "SerdeContextConfig")
      }
      serdeContext;
      setSerdeContext(A) {
        this.serdeContext = A
      }
    },
    oHA = b4(),
    Y6A = s6(),
    QB8 = Jo(),
    BB8 = s6();

  function IqQ(A, Q, B) {
    if (B?.source) {
      let G = B.source;
      if (typeof Q === "number") {
        if (Q > Number.MAX_SAFE_INTEGER || Q < Number.MIN_SAFE_INTEGER || G !== String(Q))
          if (G.includes(".")) return new BB8.NumericValue(G, "bigDecimal");
          else return BigInt(G)
      }
    }
    return Q
  }
  J3(IqQ, "jsonReviver");
  var GB8 = S3(),
    YqQ = J3((A, Q) => (0, GB8.collectBody)(A, Q).then((B) => Q.utf8Encoder(B)), "collectBodyString"),
    pO1 = J3((A, Q) => YqQ(A, Q).then((B) => {
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
    ZB8 = J3(async (A, Q) => {
      let B = await pO1(A, Q);
      return B.message = B.message ?? B.Message, B
    }, "parseJsonErrorBody"),
    lO1 = J3((A, Q) => {
      let B = J3((I, Y) => Object.keys(I).find((J) => J.toLowerCase() === Y.toLowerCase()), "findKey"),
        G = J3((I) => {
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
    JqQ = class extends Xo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        J3(this, "JsonShapeDeserializer")
      }
      async read(A, Q) {
        return this._read(A, typeof Q === "string" ? JSON.parse(Q, IqQ) : await pO1(Q, this.serdeContext))
      }
      readObject(A, Q) {
        return this._read(A, Q)
      }
      _read(A, Q) {
        let B = Q !== null && typeof Q === "object",
          G = oHA.NormalizedSchema.of(A);
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
        if (G.isBlobSchema() && typeof Q === "string") return (0, QB8.fromBase64)(Q);
        let Z = G.getMergedTraits().mediaType;
        if (G.isStringSchema() && typeof Q === "string" && Z) {
          if (Z === "application/json" || Z.endsWith("+json")) return Y6A.LazyJsonString.from(Q)
        }
        if (G.isTimestampSchema()) {
          let I = this.settings.timestampFormat;
          switch (I.useTrait ? G.getSchema() === oHA.SCHEMA.TIMESTAMP_DEFAULT ? I.default : G.getSchema() ?? I.default : I.default) {
            case oHA.SCHEMA.TIMESTAMP_DATE_TIME:
              return (0, Y6A.parseRfc3339DateTimeWithOffset)(Q);
            case oHA.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, Y6A.parseRfc7231DateTime)(Q);
            case oHA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              return (0, Y6A.parseEpochTimestamp)(Q);
            default:
              return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
          }
        }
        if (G.isBigIntegerSchema() && (typeof Q === "number" || typeof Q === "string")) return BigInt(Q);
        if (G.isBigDecimalSchema() && Q != null) {
          if (Q instanceof Y6A.NumericValue) return Q;
          return new Y6A.NumericValue(String(Q), "bigDecimal")
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
    J6A = b4(),
    IB8 = s6(),
    YB8 = s6(),
    JB8 = s6(),
    AqQ = String.fromCharCode(925),
    WB8 = class {
      static {
        J3(this, "JsonReplacer")
      }
      values = new Map;
      counter = 0;
      stage = 0;
      createReplacer() {
        if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
        if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
        return this.stage = 1, (A, Q) => {
          if (Q instanceof JB8.NumericValue) {
            let B = `${AqQ+NaN+this.counter++}_` + Q.string;
            return this.values.set(`"${B}"`, Q.string), B
          }
          if (typeof Q === "bigint") {
            let B = Q.toString(),
              G = `${AqQ+"b"+this.counter++}_` + B;
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
    WqQ = class extends Xo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        J3(this, "JsonShapeSerializer")
      }
      buffer;
      rootSchema;
      write(A, Q) {
        this.rootSchema = J6A.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, Q)
      }
      flush() {
        if (this.rootSchema?.isStructSchema() || this.rootSchema?.isDocumentSchema()) {
          let A = new WB8;
          return A.replaceInJson(JSON.stringify(this.buffer, A.createReplacer(), 0))
        }
        return this.buffer
      }
      _write(A, Q, B) {
        let G = Q !== null && typeof Q === "object",
          Z = J6A.NormalizedSchema.of(A);
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
          switch (Y.useTrait ? Z.getSchema() === J6A.SCHEMA.TIMESTAMP_DEFAULT ? Y.default : Z.getSchema() ?? Y.default : Y.default) {
            case J6A.SCHEMA.TIMESTAMP_DATE_TIME:
              return Q.toISOString().replace(".000Z", "Z");
            case J6A.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, IB8.dateToUtcString)(Q);
            case J6A.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
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
          if (I === "application/json" || I.endsWith("+json")) return YB8.LazyJsonString.from(Q)
        }
        return Q
      }
    },
    iO1 = class extends Xo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        J3(this, "JsonCodec")
      }
      createSerializer() {
        let A = new WqQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new JqQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    nO1 = class extends eQ8.RpcProtocol {
      static {
        J3(this, "AwsJsonRpcProtocol")
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
        this.codec = new iO1({
          timestampFormat: {
            useTrait: !0,
            default: I6A.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          jsonName: !1
        }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer()
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B);
        if (!G.path.endsWith("/")) G.path += "/";
        if (Object.assign(G.headers, {
            "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
            "x-amz-target": (this.getJsonRpcVersion() === "1.0" ? "JsonRpc10." : "JsonProtocol.") + I6A.NormalizedSchema.of(A).getName()
          }), (0, I6A.deref)(A.input) === "unit" || !G.body) G.body = "{}";
        try {
          G.headers["content-length"] = String((0, AB8.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      getPayloadCodec() {
        return this.codec
      }
      async handleError(A, Q, B, G, Z) {
        let I = lO1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = I6A.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = I6A.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = I6A.NormalizedSchema.of(X),
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
    XB8 = class extends nO1 {
      static {
        J3(this, "AwsJson1_0Protocol")
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
    VB8 = class extends nO1 {
      static {
        J3(this, "AwsJson1_1Protocol")
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
    uO1 = w5(),
    tHA = b4(),
    FB8 = oK(),
    KB8 = class extends uO1.HttpBindingProtocol {
      static {
        J3(this, "AwsRestJsonProtocol")
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
            default: tHA.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          httpBindings: !0,
          jsonName: !0
        };
        this.codec = new iO1(Q), this.serializer = new uO1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new uO1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
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
          Z = tHA.NormalizedSchema.of(A.input),
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
          G.headers["content-length"] = String((0, FB8.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async handleError(A, Q, B, G, Z) {
        let I = lO1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = tHA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = tHA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = tHA.NormalizedSchema.of(X),
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
    DB8 = S3(),
    HB8 = J3((A) => {
      if (A == null) return;
      if (typeof A === "object" && "__type" in A) delete A.__type;
      return (0, DB8.expectUnion)(A)
    }, "awsExpectUnion"),
    mO1 = w5(),
    fd = b4(),
    CB8 = oK(),
    EB8 = w5(),
    QqQ = b4(),
    zB8 = S3(),
    UB8 = O2(),
    $B8 = wS(),
    aO1 = class extends Xo {
      constructor(A) {
        super();
        this.settings = A, this.stringDeserializer = new EB8.FromStringShapeDeserializer(A)
      }
      static {
        J3(this, "XmlShapeDeserializer")
      }
      stringDeserializer;
      setSerdeContext(A) {
        this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
      }
      read(A, Q, B) {
        let G = QqQ.NormalizedSchema.of(A),
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
        let Y = (this.serdeContext?.utf8Encoder ?? UB8.toUtf8)(Q),
          J = this.parseXml(Y);
        return this.readSchema(A, B ? J[B] : J)
      }
      readSchema(A, Q) {
        let B = QqQ.NormalizedSchema.of(A),
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
          let Q = new $B8.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: J3((Y, J) => J.trim() === "" && J.includes(`
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
          return (0, zB8.getValueFromTextNode)(I)
        }
        return {}
      }
    },
    dO1 = w5(),
    XmA = b4(),
    wB8 = s6(),
    qB8 = S3(),
    NB8 = Jo(),
    LB8 = class extends Xo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        J3(this, "QueryShapeSerializer")
      }
      buffer;
      write(A, Q, B = "") {
        if (this.buffer === void 0) this.buffer = "";
        let G = XmA.NormalizedSchema.of(A);
        if (B && !B.endsWith(".")) B += ".";
        if (G.isBlobSchema()) {
          if (typeof Q === "string" || Q instanceof Uint8Array) this.writeKey(B), this.writeValue((this.serdeContext?.base64Encoder ?? NB8.toBase64)(Q))
        } else if (G.isBooleanSchema() || G.isNumericSchema() || G.isStringSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigIntegerSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigDecimalSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(Q instanceof wB8.NumericValue ? Q.string : String(Q))
        } else if (G.isTimestampSchema()) {
          if (Q instanceof Date) switch (this.writeKey(B), (0, dO1.determineTimestampFormat)(G, this.settings)) {
            case XmA.SCHEMA.TIMESTAMP_DATE_TIME:
              this.writeValue(Q.toISOString().replace(".000Z", "Z"));
              break;
            case XmA.SCHEMA.TIMESTAMP_HTTP_DATE:
              this.writeValue((0, qB8.dateToUtcString)(Q));
              break;
            case XmA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
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
        this.buffer += `&${(0,dO1.extendedEncodeURIComponent)(A)}=`
      }
      writeValue(A) {
        this.buffer += (0, dO1.extendedEncodeURIComponent)(A)
      }
    },
    XqQ = class extends mO1.RpcProtocol {
      constructor(A) {
        super({
          defaultNamespace: A.defaultNamespace
        });
        this.options = A;
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: fd.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !1,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace,
          serializeEmptyLists: !0
        };
        this.serializer = new LB8(Q), this.deserializer = new aO1(Q)
      }
      static {
        J3(this, "AwsQueryProtocol")
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
          }), (0, fd.deref)(A.input) === "unit" || !G.body) G.body = "";
        if (G.body = `Action=${A.name.split("#")[1]}&Version=${this.options.version}` + G.body, G.body.endsWith("&")) G.body = G.body.slice(-1);
        try {
          G.headers["content-length"] = String((0, CB8.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        let G = this.deserializer,
          Z = fd.NormalizedSchema.of(A.output),
          I = {};
        if (B.statusCode >= 300) {
          let X = await (0, mO1.collectBody)(B.body, Q);
          if (X.byteLength > 0) Object.assign(I, await G.read(fd.SCHEMA.DOCUMENT, X));
          await this.handleError(A, Q, B, I, this.deserializeMetadata(B))
        }
        for (let X in B.headers) {
          let V = B.headers[X];
          delete B.headers[X], B.headers[X.toLowerCase()] = V
        }
        let Y = Z.isStructSchema() && this.useNestedResult() ? A.name.split("#")[1] + "Result" : void 0,
          J = await (0, mO1.collectBody)(B.body, Q);
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
          X = fd.TypeRegistry.for(Y),
          V;
        try {
          if (V = X.find((C) => fd.NormalizedSchema.of(C).getMergedTraits().awsQueryError?.[0] === J), !V) V = X.getSchema(I)
        } catch (C) {
          let E = fd.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (E) {
            let U = E.ctor;
            throw Object.assign(new U(J), W)
          }
          throw Error(J)
        }
        let F = fd.NormalizedSchema.of(V),
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
    MB8 = class extends XqQ {
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
        J3(this, "AwsEc2QueryProtocol")
      }
      useNestedResult() {
        return !1
      }
    },
    cO1 = w5(),
    eHA = b4(),
    OB8 = oK(),
    RB8 = S3(),
    TB8 = wS(),
    VqQ = J3((A, Q) => YqQ(A, Q).then((B) => {
      if (B.length) {
        let G = new TB8.XMLParser({
          attributeNamePrefix: "",
          htmlEntities: !0,
          ignoreAttributes: !1,
          ignoreDeclaration: !0,
          parseTagValue: !1,
          trimValues: !1,
          tagValueProcessor: J3((W, X) => X.trim() === "" && X.includes(`
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
        return (0, RB8.getValueFromTextNode)(J)
      }
      return {}
    }), "parseXmlBody"),
    PB8 = J3(async (A, Q) => {
      let B = await VqQ(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, "parseXmlErrorBody"),
    FqQ = J3((A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadRestXmlErrorCode"),
    bS = rDA(),
    Wo = b4(),
    jB8 = s6(),
    BqQ = S3(),
    GqQ = Jo(),
    KqQ = class extends Xo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        J3(this, "XmlShapeSerializer")
      }
      stringBuffer;
      byteBuffer;
      buffer;
      write(A, Q) {
        let B = Wo.NormalizedSchema.of(A);
        if (B.isStringSchema() && typeof Q === "string") this.stringBuffer = Q;
        else if (B.isBlobSchema()) this.byteBuffer = "byteLength" in Q ? Q : (this.serdeContext?.base64Decoder ?? GqQ.fromBase64)(Q);
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
        let I = bS.XmlNode.of(Z),
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
              let F = bS.XmlNode.of(X.getMergedTraits().xmlName ?? X.getMemberName());
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
          F = J3((K, D) => {
            if (I.isListSchema()) this.writeList(I, Array.isArray(D) ? D : [D], K, V);
            else if (I.isMapSchema()) this.writeMap(I, D, K, V);
            else if (I.isStructSchema()) {
              let H = this.writeStruct(I, D, V);
              K.addChildNode(H.withName(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member"))
            } else {
              let H = bS.XmlNode.of(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member");
              this.writeSimpleInto(I, D, H, V), K.addChildNode(H)
            }
          }, "writeItem");
        if (W) {
          for (let K of Q)
            if (J || K != null) F(B, K)
        } else {
          let K = bS.XmlNode.of(Z.xmlName ?? A.getMemberName());
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
          E = J3((U, q, w) => {
            let N = bS.XmlNode.of(W, q),
              [R, T] = this.getXmlnsAttribute(Y, C);
            if (T) N.addAttribute(R, T);
            U.addChildNode(N);
            let y = bS.XmlNode.of(F);
            if (X.isListSchema()) this.writeList(X, w, y, C);
            else if (X.isMapSchema()) this.writeMap(X, w, y, C, !0);
            else if (X.isStructSchema()) y = this.writeStruct(X, w, C);
            else this.writeSimpleInto(X, w, y, C);
            U.addChildNode(y)
          }, "addKeyValue");
        if (D) {
          for (let [U, q] of Object.entries(Q))
            if (K || q != null) {
              let w = bS.XmlNode.of(I.xmlName ?? A.getMemberName());
              E(w, U, q), B.addChildNode(w)
            }
        } else {
          let U;
          if (!Z) {
            if (U = bS.XmlNode.of(I.xmlName ?? A.getMemberName()), C) U.addAttribute(H, C);
            B.addChildNode(U)
          }
          for (let [q, w] of Object.entries(Q))
            if (K || w != null) {
              let N = bS.XmlNode.of("entry");
              E(N, q, w), (Z ? B : U).addChildNode(N)
            }
        }
      }
      writeSimple(A, Q) {
        if (Q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
        let B = Wo.NormalizedSchema.of(A),
          G = null;
        if (Q && typeof Q === "object")
          if (B.isBlobSchema()) G = (this.serdeContext?.base64Encoder ?? GqQ.toBase64)(Q);
          else if (B.isTimestampSchema() && Q instanceof Date) {
          let Z = this.settings.timestampFormat;
          switch (Z.useTrait ? B.getSchema() === Wo.SCHEMA.TIMESTAMP_DEFAULT ? Z.default : B.getSchema() ?? Z.default : Z.default) {
            case Wo.SCHEMA.TIMESTAMP_DATE_TIME:
              G = Q.toISOString().replace(".000Z", "Z");
              break;
            case Wo.SCHEMA.TIMESTAMP_HTTP_DATE:
              G = (0, BqQ.dateToUtcString)(Q);
              break;
            case Wo.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              G = String(Q.getTime() / 1000);
              break;
            default:
              console.warn("Missing timestamp format, using http date", Q), G = (0, BqQ.dateToUtcString)(Q);
              break
          }
        } else if (B.isBigDecimalSchema() && Q) {
          if (Q instanceof jB8.NumericValue) return Q.string;
          return String(Q)
        } else if (B.isMapSchema() || B.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
        else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${B.getName(!0)}`);
        if (B.isStringSchema() || B.isBooleanSchema() || B.isNumericSchema() || B.isBigIntegerSchema() || B.isBigDecimalSchema()) G = String(Q);
        if (G === null) throw Error(`Unhandled schema-value pair ${B.getName(!0)}=${Q}`);
        return G
      }
      writeSimpleInto(A, Q, B, G) {
        let Z = this.writeSimple(A, Q),
          I = Wo.NormalizedSchema.of(A),
          Y = new bS.XmlText(Z),
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
    DqQ = class extends Xo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        J3(this, "XmlCodec")
      }
      createSerializer() {
        let A = new KqQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new aO1(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    SB8 = class extends cO1.HttpBindingProtocol {
      static {
        J3(this, "AwsRestXmlProtocol")
      }
      codec;
      serializer;
      deserializer;
      constructor(A) {
        super(A);
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: eHA.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !0,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace
        };
        this.codec = new DqQ(Q), this.serializer = new cO1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new cO1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
      }
      getPayloadCodec() {
        return this.codec
      }
      getShapeId() {
        return "aws.protocols#restXml"
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B),
          Z = eHA.NormalizedSchema.of(A.input),
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
          G.headers["content-length"] = String((0, OB8.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        return super.deserializeResponse(A, Q, B)
      }
      async handleError(A, Q, B, G, Z) {
        let I = FqQ(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = eHA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = eHA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = eHA.NormalizedSchema.of(X),
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
// @from(Start 3438719, End 3438916)
nz = z((ACA) => {
  Object.defineProperty(ACA, "__esModule", {
    value: !0
  });
  var sO1 = sr();
  sO1.__exportStar(LL(), ACA);
  sO1.__exportStar(fO1(), ACA);
  sO1.__exportStar(CqQ(), ACA)
})
// @from(Start 3438922, End 3444576)
QCA = z((dN7, TqQ) => {
  var {
    defineProperty: KmA,
    getOwnPropertyDescriptor: _B8,
    getOwnPropertyNames: kB8
  } = Object, yB8 = Object.prototype.hasOwnProperty, Ab = (A, Q) => KmA(A, "name", {
    value: Q,
    configurable: !0
  }), xB8 = (A, Q) => {
    for (var B in Q) KmA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vB8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kB8(Q))
        if (!yB8.call(A, Z) && Z !== B) KmA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _B8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bB8 = (A) => vB8(KmA({}, "__esModule", {
    value: !0
  }), A), $qQ = {};
  xB8($qQ, {
    DEFAULT_UA_APP_ID: () => wqQ,
    getUserAgentMiddlewareOptions: () => RqQ,
    getUserAgentPlugin: () => pB8,
    resolveUserAgentConfig: () => NqQ,
    userAgentMiddleware: () => OqQ
  });
  TqQ.exports = bB8($qQ);
  var fB8 = iB(),
    wqQ = void 0;

  function qqQ(A) {
    if (A === void 0) return !0;
    return typeof A === "string" && A.length <= 50
  }
  Ab(qqQ, "isValidUserAgentAppId");

  function NqQ(A) {
    let Q = (0, fB8.normalizeProvider)(A.userAgentAppId ?? wqQ),
      {
        customUserAgent: B
      } = A;
    return Object.assign(A, {
      customUserAgent: typeof B === "string" ? [
        [B]
      ] : B,
      userAgentAppId: Ab(async () => {
        let G = await Q();
        if (!qqQ(G)) {
          let Z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
          if (typeof G !== "string") Z?.warn("userAgentAppId must be a string or undefined.");
          else if (G.length > 50) Z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
        }
        return G
      }, "userAgentAppId")
    })
  }
  Ab(NqQ, "resolveUserAgentConfig");
  var hB8 = sHA(),
    gB8 = Lw(),
    fS = nz(),
    uB8 = /\d{12}\.ddb/;
  async function LqQ(A, Q, B) {
    if (B.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor")(0, fS.setFeature)(A, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof Q.retryStrategy === "function") {
      let I = await Q.retryStrategy();
      if (typeof I.acquireInitialRetryToken === "function")
        if (I.constructor?.name?.includes("Adaptive"))(0, fS.setFeature)(A, "RETRY_MODE_ADAPTIVE", "F");
        else(0, fS.setFeature)(A, "RETRY_MODE_STANDARD", "E");
      else(0, fS.setFeature)(A, "RETRY_MODE_LEGACY", "D")
    }
    if (typeof Q.accountIdEndpointMode === "function") {
      let I = A.endpointV2;
      if (String(I?.url?.hostname).match(uB8))(0, fS.setFeature)(A, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await Q.accountIdEndpointMode?.()) {
        case "disabled":
          (0, fS.setFeature)(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          (0, fS.setFeature)(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          (0, fS.setFeature)(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break
      }
    }
    let Z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (Z?.$source) {
      let I = Z;
      if (I.accountId)(0, fS.setFeature)(A, "RESOLVED_ACCOUNT_ID", "T");
      for (let [Y, J] of Object.entries(I.$source ?? {}))(0, fS.setFeature)(A, Y, J)
    }
  }
  Ab(LqQ, "checkFeatures");
  var EqQ = "user-agent",
    rO1 = "x-amz-user-agent",
    zqQ = " ",
    oO1 = "/",
    mB8 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g,
    dB8 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g,
    UqQ = "-",
    cB8 = 1024;

  function MqQ(A) {
    let Q = "";
    for (let B in A) {
      let G = A[B];
      if (Q.length + G.length + 1 <= cB8) {
        if (Q.length) Q += "," + G;
        else Q += G;
        continue
      }
      break
    }
    return Q
  }
  Ab(MqQ, "encodeFeatures");
  var OqQ = Ab((A) => (Q, B) => async (G) => {
      let {
        request: Z
      } = G;
      if (!gB8.HttpRequest.isInstance(Z)) return Q(G);
      let {
        headers: I
      } = Z, Y = B?.userAgent?.map(FmA) || [], J = (await A.defaultUserAgentProvider()).map(FmA);
      await LqQ(B, A, G);
      let W = B;
      J.push(`m/${MqQ(Object.assign({},B.__smithy_context?.features,W.__aws_sdk_context?.features))}`);
      let X = A?.customUserAgent?.map(FmA) || [],
        V = await A.userAgentAppId();
      if (V) J.push(FmA([`app/${V}`]));
      let F = (0, hB8.getUserAgentPrefix)(),
        K = (F ? [F] : []).concat([...J, ...Y, ...X]).join(zqQ),
        D = [...J.filter((H) => H.startsWith("aws-sdk-")), ...X].join(zqQ);
      if (A.runtime !== "browser") {
        if (D) I[rO1] = I[rO1] ? `${I[EqQ]} ${D}` : D;
        I[EqQ] = K
      } else I[rO1] = K;
      return Q({
        ...G,
        request: Z
      })
    }, "userAgentMiddleware"),
    FmA = Ab((A) => {
      let Q = A[0].split(oO1).map((Y) => Y.replace(mB8, UqQ)).join(oO1),
        B = A[1]?.replace(dB8, UqQ),
        G = Q.indexOf(oO1),
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
    RqQ = {
      name: "getUserAgentMiddleware",
      step: "build",
      priority: "low",
      tags: ["SET_USER_AGENT", "USER_AGENT"],
      override: !0
    },
    pB8 = Ab((A) => ({
      applyToStack: Ab((Q) => {
        Q.add(OqQ(A), RqQ)
      }, "applyToStack")
    }), "getUserAgentPlugin")
})
// @from(Start 3444582, End 3446239)
eO1 = z((PqQ) => {
  Object.defineProperty(PqQ, "__esModule", {
    value: !0
  });
  PqQ.resolveHttpAuthSchemeConfig = PqQ.resolveStsAuthConfig = PqQ.defaultSTSHttpAuthSchemeProvider = PqQ.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var lB8 = nz(),
    tO1 = w7(),
    iB8 = BCA(),
    nB8 = async (A, Q, B) => {
      return {
        operation: (0, tO1.getSmithyContext)(Q).operation,
        region: await (0, tO1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  PqQ.defaultSTSHttpAuthSchemeParametersProvider = nB8;

  function aB8(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "sts",
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

  function sB8(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var rB8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithWebIdentity": {
        Q.push(sB8(A));
        break
      }
      default:
        Q.push(aB8(A))
    }
    return Q
  };
  PqQ.defaultSTSHttpAuthSchemeProvider = rB8;
  var oB8 = (A) => Object.assign(A, {
    stsClientCtor: iB8.STSClient
  });
  PqQ.resolveStsAuthConfig = oB8;
  var tB8 = (A) => {
    let Q = PqQ.resolveStsAuthConfig(A),
      B = (0, lB8.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, tO1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  PqQ.resolveHttpAuthSchemeConfig = tB8
})
// @from(Start 3446245, End 3447133)
GCA = z((_qQ) => {
  Object.defineProperty(_qQ, "__esModule", {
    value: !0
  });
  _qQ.commonParams = _qQ.resolveClientEndpointParameters = void 0;
  var Q28 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  _qQ.resolveClientEndpointParameters = Q28;
  _qQ.commonParams = {
    UseGlobalEndpoint: {
      type: "builtInParams",
      name: "useGlobalEndpoint"
    },
    UseFIPS: {
      type: "builtInParams",
      name: "useFipsEndpoint"
    },
    Endpoint: {
      type: "builtInParams",
      name: "endpoint"
    },
    Region: {
      type: "builtInParams",
      name: "region"
    },
    UseDualStack: {
      type: "builtInParams",
      name: "useDualstackEndpoint"
    }
  }
})
// @from(Start 3447139, End 3451424)
AR1 = z((lN7, G28) => {
  G28.exports = {
    name: "@aws-sdk/nested-clients",
    version: "3.840.0",
    description: "Nested clients for AWS SDK packages.",
    main: "./dist-cjs/index.js",
    module: "./dist-es/index.js",
    types: "./dist-types/index.d.ts",
    scripts: {
      build: "yarn lint && concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline nested-clients",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      lint: "node ../../scripts/validation/submodules-linter.js --pkg nested-clients",
      test: "yarn g:vitest run",
      "test:watch": "yarn g:vitest watch"
    },
    engines: {
      node: ">=18.0.0"
    },
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/middleware-host-header": "3.840.0",
      "@aws-sdk/middleware-logger": "3.840.0",
      "@aws-sdk/middleware-recursion-detection": "3.840.0",
      "@aws-sdk/middleware-user-agent": "3.840.0",
      "@aws-sdk/region-config-resolver": "3.840.0",
      "@aws-sdk/types": "3.840.0",
      "@aws-sdk/util-endpoints": "3.840.0",
      "@aws-sdk/util-user-agent-browser": "3.840.0",
      "@aws-sdk/util-user-agent-node": "3.840.0",
      "@smithy/config-resolver": "^4.1.4",
      "@smithy/core": "^3.6.0",
      "@smithy/fetch-http-handler": "^5.0.4",
      "@smithy/hash-node": "^4.0.4",
      "@smithy/invalid-dependency": "^4.0.4",
      "@smithy/middleware-content-length": "^4.0.4",
      "@smithy/middleware-endpoint": "^4.1.13",
      "@smithy/middleware-retry": "^4.1.14",
      "@smithy/middleware-serde": "^4.0.8",
      "@smithy/middleware-stack": "^4.0.4",
      "@smithy/node-config-provider": "^4.1.3",
      "@smithy/node-http-handler": "^4.0.6",
      "@smithy/protocol-http": "^5.1.2",
      "@smithy/smithy-client": "^4.4.5",
      "@smithy/types": "^4.3.1",
      "@smithy/url-parser": "^4.0.4",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.21",
      "@smithy/util-defaults-mode-node": "^4.0.21",
      "@smithy/util-endpoints": "^3.0.6",
      "@smithy/util-middleware": "^4.0.4",
      "@smithy/util-retry": "^4.0.6",
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.8.3"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["./sso-oidc.d.ts", "./sso-oidc.js", "./sts.d.ts", "./sts.js", "dist-*/**"],
    browser: {
      "./dist-es/submodules/sso-oidc/runtimeConfig": "./dist-es/submodules/sso-oidc/runtimeConfig.browser",
      "./dist-es/submodules/sts/runtimeConfig": "./dist-es/submodules/sts/runtimeConfig.browser"
    },
    "react-native": {},
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/packages/nested-clients",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "packages/nested-clients"
    },
    exports: {
      "./sso-oidc": {
        types: "./dist-types/submodules/sso-oidc/index.d.ts",
        module: "./dist-es/submodules/sso-oidc/index.js",
        node: "./dist-cjs/submodules/sso-oidc/index.js",
        import: "./dist-es/submodules/sso-oidc/index.js",
        require: "./dist-cjs/submodules/sso-oidc/index.js"
      },
      "./sts": {
        types: "./dist-types/submodules/sts/index.d.ts",
        module: "./dist-es/submodules/sts/index.js",
        node: "./dist-cjs/submodules/sts/index.js",
        import: "./dist-es/submodules/sts/index.js",
        require: "./dist-cjs/submodules/sts/index.js"
      }
    }
  }
})