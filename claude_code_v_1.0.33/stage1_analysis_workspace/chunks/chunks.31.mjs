
// @from(Start 2832761, End 2856133)
pq1 = z((vU7, cq1) => {
  var {
    defineProperty: UgA,
    getOwnPropertyDescriptor: zb4,
    getOwnPropertyNames: Ub4
  } = Object, $b4 = Object.prototype.hasOwnProperty, S2 = (A, Q) => UgA(A, "name", {
    value: Q,
    configurable: !0
  }), wb4 = (A, Q) => {
    for (var B in Q) UgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bq1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Ub4(Q))
        if (!$b4.call(A, Z) && Z !== B) UgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = zb4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, qb4 = (A, Q, B) => (bq1(A, Q, "default"), B && bq1(B, Q, "default")), Nb4 = (A) => bq1(UgA({}, "__esModule", {
    value: !0
  }), A), hq1 = {};
  wb4(hq1, {
    AssumeRoleCommand: () => mq1,
    AssumeRoleResponseFilterSensitiveLog: () => AIQ,
    AssumeRoleWithWebIdentityCommand: () => dq1,
    AssumeRoleWithWebIdentityRequestFilterSensitiveLog: () => JIQ,
    AssumeRoleWithWebIdentityResponseFilterSensitiveLog: () => WIQ,
    ClientInputEndpointParameters: () => Hf4.ClientInputEndpointParameters,
    CredentialsFilterSensitiveLog: () => gq1,
    ExpiredTokenException: () => QIQ,
    IDPCommunicationErrorException: () => XIQ,
    IDPRejectedClaimException: () => IIQ,
    InvalidIdentityTokenException: () => YIQ,
    MalformedPolicyDocumentException: () => BIQ,
    PackedPolicyTooLargeException: () => GIQ,
    RegionDisabledException: () => ZIQ,
    STS: () => wIQ,
    STSServiceException: () => Sv,
    decorateDefaultCredentialProvider: () => zf4,
    getDefaultRoleAssumer: () => RIQ,
    getDefaultRoleAssumerWithWebIdentity: () => TIQ
  });
  cq1.exports = Nb4(hq1);
  qb4(hq1, $HA(), cq1.exports);
  var Lb4 = K6(),
    Mb4 = q5(),
    Ob4 = GZ(),
    Rb4 = K6(),
    Tb4 = wHA(),
    eZQ = K6(),
    Pb4 = K6(),
    Sv = class A extends Pb4.ServiceException {
      static {
        S2(this, "STSServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    gq1 = S2((A) => ({
      ...A,
      ...A.SecretAccessKey && {
        SecretAccessKey: eZQ.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    AIQ = S2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: gq1(A.Credentials)
      }
    }), "AssumeRoleResponseFilterSensitiveLog"),
    QIQ = class A extends Sv {
      static {
        S2(this, "ExpiredTokenException")
      }
      name = "ExpiredTokenException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ExpiredTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    BIQ = class A extends Sv {
      static {
        S2(this, "MalformedPolicyDocumentException")
      }
      name = "MalformedPolicyDocumentException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "MalformedPolicyDocumentException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    GIQ = class A extends Sv {
      static {
        S2(this, "PackedPolicyTooLargeException")
      }
      name = "PackedPolicyTooLargeException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "PackedPolicyTooLargeException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ZIQ = class A extends Sv {
      static {
        S2(this, "RegionDisabledException")
      }
      name = "RegionDisabledException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "RegionDisabledException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    IIQ = class A extends Sv {
      static {
        S2(this, "IDPRejectedClaimException")
      }
      name = "IDPRejectedClaimException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "IDPRejectedClaimException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    YIQ = class A extends Sv {
      static {
        S2(this, "InvalidIdentityTokenException")
      }
      name = "InvalidIdentityTokenException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidIdentityTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    JIQ = S2((A) => ({
      ...A,
      ...A.WebIdentityToken && {
        WebIdentityToken: eZQ.SENSITIVE_STRING
      }
    }), "AssumeRoleWithWebIdentityRequestFilterSensitiveLog"),
    WIQ = S2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: gq1(A.Credentials)
      }
    }), "AssumeRoleWithWebIdentityResponseFilterSensitiveLog"),
    XIQ = class A extends Sv {
      static {
        S2(this, "IDPCommunicationErrorException")
      }
      name = "IDPCommunicationErrorException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "IDPCommunicationErrorException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    uq1 = MF(),
    jb4 = nC(),
    q7 = K6(),
    Sb4 = S2(async (A, Q) => {
      let B = CIQ,
        G;
      return G = $IQ({
        ...mb4(A, Q),
        [zIQ]: If4,
        [UIQ]: EIQ
      }), HIQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleCommand"),
    _b4 = S2(async (A, Q) => {
      let B = CIQ,
        G;
      return G = $IQ({
        ...db4(A, Q),
        [zIQ]: Yf4,
        [UIQ]: EIQ
      }), HIQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithWebIdentityCommand"),
    kb4 = S2(async (A, Q) => {
      if (A.statusCode >= 300) return VIQ(A, Q);
      let B = await (0, uq1.parseXmlBody)(A.body, Q),
        G = {};
      return G = sb4(B.AssumeRoleResult, Q), {
        $metadata: _v(A),
        ...G
      }
    }, "de_AssumeRoleCommand"),
    yb4 = S2(async (A, Q) => {
      if (A.statusCode >= 300) return VIQ(A, Q);
      let B = await (0, uq1.parseXmlBody)(A.body, Q),
        G = {};
      return G = rb4(B.AssumeRoleWithWebIdentityResult, Q), {
        $metadata: _v(A),
        ...G
      }
    }, "de_AssumeRoleWithWebIdentityCommand"),
    VIQ = S2(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, uq1.parseXmlErrorBody)(A.body, Q)
        },
        G = Jf4(A, B.body);
      switch (G) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await xb4(B, Q);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await hb4(B, Q);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await gb4(B, Q);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await ub4(B, Q);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await vb4(B, Q);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await bb4(B, Q);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await fb4(B, Q);
        default:
          let Z = B.body;
          return Zf4({
            output: A,
            parsedBody: Z.Error,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    xb4 = S2(async (A, Q) => {
      let B = A.body,
        G = ob4(B.Error, Q),
        Z = new QIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_ExpiredTokenExceptionRes"),
    vb4 = S2(async (A, Q) => {
      let B = A.body,
        G = tb4(B.Error, Q),
        Z = new XIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_IDPCommunicationErrorExceptionRes"),
    bb4 = S2(async (A, Q) => {
      let B = A.body,
        G = eb4(B.Error, Q),
        Z = new IIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_IDPRejectedClaimExceptionRes"),
    fb4 = S2(async (A, Q) => {
      let B = A.body,
        G = Af4(B.Error, Q),
        Z = new YIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityTokenExceptionRes"),
    hb4 = S2(async (A, Q) => {
      let B = A.body,
        G = Qf4(B.Error, Q),
        Z = new BIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_MalformedPolicyDocumentExceptionRes"),
    gb4 = S2(async (A, Q) => {
      let B = A.body,
        G = Bf4(B.Error, Q),
        Z = new GIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_PackedPolicyTooLargeExceptionRes"),
    ub4 = S2(async (A, Q) => {
      let B = A.body,
        G = Gf4(B.Error, Q),
        Z = new ZIQ({
          $metadata: _v(A),
          ...G
        });
      return (0, q7.decorateServiceException)(Z, B)
    }, "de_RegionDisabledExceptionRes"),
    mb4 = S2((A, Q) => {
      let B = {};
      if (A[E8A] != null) B[E8A] = A[E8A];
      if (A[z8A] != null) B[z8A] = A[z8A];
      if (A[H8A] != null) {
        let G = FIQ(A[H8A], Q);
        if (A[H8A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[D8A] != null) B[D8A] = A[D8A];
      if (A[K8A] != null) B[K8A] = A[K8A];
      if (A[Sq1] != null) {
        let G = ab4(A[Sq1], Q);
        if (A[Sq1]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      if (A[kq1] != null) {
        let G = nb4(A[kq1], Q);
        if (A[kq1]?.length === 0) B.TransitiveTagKeys = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TransitiveTagKeys.${Z}`;
          B[Y] = I
        })
      }
      if (A[wq1] != null) B[wq1] = A[wq1];
      if (A[Pq1] != null) B[Pq1] = A[Pq1];
      if (A[_q1] != null) B[_q1] = A[_q1];
      if (A[jv] != null) B[jv] = A[jv];
      if (A[Lq1] != null) {
        let G = lb4(A[Lq1], Q);
        if (A[Lq1]?.length === 0) B.ProvidedContexts = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `ProvidedContexts.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_AssumeRoleRequest"),
    db4 = S2((A, Q) => {
      let B = {};
      if (A[E8A] != null) B[E8A] = A[E8A];
      if (A[z8A] != null) B[z8A] = A[z8A];
      if (A[xq1] != null) B[xq1] = A[xq1];
      if (A[Mq1] != null) B[Mq1] = A[Mq1];
      if (A[H8A] != null) {
        let G = FIQ(A[H8A], Q);
        if (A[H8A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[D8A] != null) B[D8A] = A[D8A];
      if (A[K8A] != null) B[K8A] = A[K8A];
      return B
    }, "se_AssumeRoleWithWebIdentityRequest"),
    FIQ = S2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = cb4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_policyDescriptorListType"),
    cb4 = S2((A, Q) => {
      let B = {};
      if (A[vq1] != null) B[vq1] = A[vq1];
      return B
    }, "se_PolicyDescriptorType"),
    pb4 = S2((A, Q) => {
      let B = {};
      if (A[Nq1] != null) B[Nq1] = A[Nq1];
      if (A[Uq1] != null) B[Uq1] = A[Uq1];
      return B
    }, "se_ProvidedContext"),
    lb4 = S2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = pb4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_ProvidedContextsListType"),
    ib4 = S2((A, Q) => {
      let B = {};
      if (A[qq1] != null) B[qq1] = A[qq1];
      if (A[yq1] != null) B[yq1] = A[yq1];
      return B
    }, "se_Tag"),
    nb4 = S2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        B[`member.${G}`] = Z, G++
      }
      return B
    }, "se_tagKeyListType"),
    ab4 = S2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = ib4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_tagListType"),
    KIQ = S2((A, Q) => {
      let B = {};
      if (A[Cq1] != null) B[Cq1] = (0, q7.expectString)(A[Cq1]);
      if (A[Eq1] != null) B[Eq1] = (0, q7.expectString)(A[Eq1]);
      return B
    }, "de_AssumedRoleUser"),
    sb4 = S2((A, Q) => {
      let B = {};
      if (A[F8A] != null) B[F8A] = DIQ(A[F8A], Q);
      if (A[V8A] != null) B[V8A] = KIQ(A[V8A], Q);
      if (A[C8A] != null) B[C8A] = (0, q7.strictParseInt32)(A[C8A]);
      if (A[jv] != null) B[jv] = (0, q7.expectString)(A[jv]);
      return B
    }, "de_AssumeRoleResponse"),
    rb4 = S2((A, Q) => {
      let B = {};
      if (A[F8A] != null) B[F8A] = DIQ(A[F8A], Q);
      if (A[Tq1] != null) B[Tq1] = (0, q7.expectString)(A[Tq1]);
      if (A[V8A] != null) B[V8A] = KIQ(A[V8A], Q);
      if (A[C8A] != null) B[C8A] = (0, q7.strictParseInt32)(A[C8A]);
      if (A[Oq1] != null) B[Oq1] = (0, q7.expectString)(A[Oq1]);
      if (A[zq1] != null) B[zq1] = (0, q7.expectString)(A[zq1]);
      if (A[jv] != null) B[jv] = (0, q7.expectString)(A[jv]);
      return B
    }, "de_AssumeRoleWithWebIdentityResponse"),
    DIQ = S2((A, Q) => {
      let B = {};
      if (A[Hq1] != null) B[Hq1] = (0, q7.expectString)(A[Hq1]);
      if (A[Rq1] != null) B[Rq1] = (0, q7.expectString)(A[Rq1]);
      if (A[jq1] != null) B[jq1] = (0, q7.expectString)(A[jq1]);
      if (A[$q1] != null) B[$q1] = (0, q7.expectNonNull)((0, q7.parseRfc3339DateTimeWithOffset)(A[$q1]));
      return B
    }, "de_Credentials"),
    ob4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_ExpiredTokenException"),
    tb4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_IDPCommunicationErrorException"),
    eb4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_IDPRejectedClaimException"),
    Af4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_InvalidIdentityTokenException"),
    Qf4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_MalformedPolicyDocumentException"),
    Bf4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_PackedPolicyTooLargeException"),
    Gf4 = S2((A, Q) => {
      let B = {};
      if (A[DW] != null) B[DW] = (0, q7.expectString)(A[DW]);
      return B
    }, "de_RegionDisabledException"),
    _v = S2((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    Zf4 = (0, q7.withBaseException)(Sv),
    HIQ = S2(async (A, Q, B, G, Z) => {
      let {
        hostname: I,
        protocol: Y = "https",
        port: J,
        path: W
      } = await A.endpoint(), X = {
        protocol: Y,
        hostname: I,
        port: J,
        method: "POST",
        path: W.endsWith("/") ? W.slice(0, -1) + B : W + B,
        headers: Q
      };
      if (G !== void 0) X.hostname = G;
      if (Z !== void 0) X.body = Z;
      return new jb4.HttpRequest(X)
    }, "buildHttpRpcRequest"),
    CIQ = {
      "content-type": "application/x-www-form-urlencoded"
    },
    EIQ = "2011-06-15",
    zIQ = "Action",
    Hq1 = "AccessKeyId",
    If4 = "AssumeRole",
    Cq1 = "AssumedRoleId",
    V8A = "AssumedRoleUser",
    Yf4 = "AssumeRoleWithWebIdentity",
    Eq1 = "Arn",
    zq1 = "Audience",
    F8A = "Credentials",
    Uq1 = "ContextAssertion",
    K8A = "DurationSeconds",
    $q1 = "Expiration",
    wq1 = "ExternalId",
    qq1 = "Key",
    D8A = "Policy",
    H8A = "PolicyArns",
    Nq1 = "ProviderArn",
    Lq1 = "ProvidedContexts",
    Mq1 = "ProviderId",
    C8A = "PackedPolicySize",
    Oq1 = "Provider",
    E8A = "RoleArn",
    z8A = "RoleSessionName",
    Rq1 = "SecretAccessKey",
    Tq1 = "SubjectFromWebIdentityToken",
    jv = "SourceIdentity",
    Pq1 = "SerialNumber",
    jq1 = "SessionToken",
    Sq1 = "Tags",
    _q1 = "TokenCode",
    kq1 = "TransitiveTagKeys",
    UIQ = "Version",
    yq1 = "Value",
    xq1 = "WebIdentityToken",
    vq1 = "arn",
    DW = "message",
    $IQ = S2((A) => Object.entries(A).map(([Q, B]) => (0, q7.extendedEncodeURIComponent)(Q) + "=" + (0, q7.extendedEncodeURIComponent)(B)).join("&"), "buildFormUrlencodedString"),
    Jf4 = S2((A, Q) => {
      if (Q.Error?.Code !== void 0) return Q.Error.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadQueryErrorCode"),
    mq1 = class extends Rb4.Command.classBuilder().ep(Tb4.commonParams).m(function(A, Q, B, G) {
      return [(0, Ob4.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Mb4.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").f(void 0, AIQ).ser(Sb4).de(kb4).build() {
      static {
        S2(this, "AssumeRoleCommand")
      }
    },
    Wf4 = q5(),
    Xf4 = GZ(),
    Vf4 = K6(),
    Ff4 = wHA(),
    dq1 = class extends Vf4.Command.classBuilder().ep(Ff4.commonParams).m(function(A, Q, B, G) {
      return [(0, Xf4.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Wf4.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").f(JIQ, WIQ).ser(_b4).de(yb4).build() {
      static {
        S2(this, "AssumeRoleWithWebIdentityCommand")
      }
    },
    Kf4 = $HA(),
    Df4 = {
      AssumeRoleCommand: mq1,
      AssumeRoleWithWebIdentityCommand: dq1
    },
    wIQ = class extends Kf4.STSClient {
      static {
        S2(this, "STS")
      }
    };
  (0, Lb4.createAggregatedClient)(Df4, wIQ);
  var Hf4 = wHA(),
    fq1 = QL(),
    tZQ = "us-east-1",
    qIQ = S2((A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    }, "getAccountIdFromAssumedRoleUser"),
    NIQ = S2(async (A, Q, B) => {
      let G = typeof A === "function" ? await A() : A,
        Z = typeof Q === "function" ? await Q() : Q;
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${G} (provider)`, `${Z} (parent client)`, `${tZQ} (STS default)`), G ?? Z ?? tZQ
    }, "resolveRegion"),
    Cf4 = S2((A, Q) => {
      let B, G;
      return async (Z, I) => {
        if (G = Z, !B) {
          let {
            logger: V = A?.parentClientConfig?.logger,
            region: F,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: D
          } = A, H = await NIQ(F, A?.parentClientConfig?.region, D), C = !LIQ(K);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            credentialDefaultProvider: S2(() => async () => G, "credentialDefaultProvider"),
            region: H,
            requestHandler: C ? K : void 0,
            logger: V
          })
        }
        let {
          Credentials: Y,
          AssumedRoleUser: J
        } = await B.send(new mq1(I));
        if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`);
        let W = qIQ(J),
          X = {
            accessKeyId: Y.AccessKeyId,
            secretAccessKey: Y.SecretAccessKey,
            sessionToken: Y.SessionToken,
            expiration: Y.Expiration,
            ...Y.CredentialScope && {
              credentialScope: Y.CredentialScope
            },
            ...W && {
              accountId: W
            }
          };
        return (0, fq1.setCredentialFeature)(X, "CREDENTIALS_STS_ASSUME_ROLE", "i"), X
      }
    }, "getDefaultRoleAssumer"),
    Ef4 = S2((A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            region: X,
            requestHandler: V = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: F
          } = A, K = await NIQ(X, A?.parentClientConfig?.region, F), D = !LIQ(V);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            region: K,
            requestHandler: D ? V : void 0,
            logger: W
          })
        }
        let {
          Credentials: Z,
          AssumedRoleUser: I
        } = await B.send(new dq1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let Y = qIQ(I),
          J = {
            accessKeyId: Z.AccessKeyId,
            secretAccessKey: Z.SecretAccessKey,
            sessionToken: Z.SessionToken,
            expiration: Z.Expiration,
            ...Z.CredentialScope && {
              credentialScope: Z.CredentialScope
            },
            ...Y && {
              accountId: Y
            }
          };
        if (Y)(0, fq1.setCredentialFeature)(J, "RESOLVED_ACCOUNT_ID", "T");
        return (0, fq1.setCredentialFeature)(J, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), J
      }
    }, "getDefaultRoleAssumerWithWebIdentity"),
    LIQ = S2((A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, "isH2"),
    MIQ = $HA(),
    OIQ = S2((A, Q) => {
      if (!Q) return A;
      else return class extends A {
        static {
          S2(this, "CustomizableSTSClient")
        }
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, "getCustomizableStsClientCtor"),
    RIQ = S2((A = {}, Q) => Cf4(A, OIQ(MIQ.STSClient, Q)), "getDefaultRoleAssumer"),
    TIQ = S2((A = {}, Q) => Ef4(A, OIQ(MIQ.STSClient, Q)), "getDefaultRoleAssumerWithWebIdentity"),
    zf4 = S2((A) => (Q) => A({
      roleAssumer: RIQ(Q),
      roleAssumerWithWebIdentity: TIQ(Q),
      ...Q
    }), "decorateDefaultCredentialProvider")
})
// @from(Start 2856139, End 2859381)
nq1 = z((gU7, SIQ) => {
  var {
    defineProperty: $gA,
    getOwnPropertyDescriptor: Uf4,
    getOwnPropertyNames: $f4
  } = Object, wf4 = Object.prototype.hasOwnProperty, iq1 = (A, Q) => $gA(A, "name", {
    value: Q,
    configurable: !0
  }), qf4 = (A, Q) => {
    for (var B in Q) $gA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Nf4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of $f4(Q))
        if (!wf4.call(A, Z) && Z !== B) $gA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Uf4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Lf4 = (A) => Nf4($gA({}, "__esModule", {
    value: !0
  }), A), jIQ = {};
  qf4(jIQ, {
    fromProcess: () => jf4
  });
  SIQ.exports = Lf4(jIQ);
  var PIQ = SG(),
    lq1 = j2(),
    Mf4 = UA("child_process"),
    Of4 = UA("util"),
    Rf4 = QL(),
    Tf4 = iq1((A, Q, B) => {
      if (Q.Version !== 1) throw Error(`Profile ${A} credential_process did not return Version 1.`);
      if (Q.AccessKeyId === void 0 || Q.SecretAccessKey === void 0) throw Error(`Profile ${A} credential_process returned invalid credentials.`);
      if (Q.Expiration) {
        let I = new Date;
        if (new Date(Q.Expiration) < I) throw Error(`Profile ${A} credential_process returned expired credentials.`)
      }
      let G = Q.AccountId;
      if (!G && B?.[A]?.aws_account_id) G = B[A].aws_account_id;
      let Z = {
        accessKeyId: Q.AccessKeyId,
        secretAccessKey: Q.SecretAccessKey,
        ...Q.SessionToken && {
          sessionToken: Q.SessionToken
        },
        ...Q.Expiration && {
          expiration: new Date(Q.Expiration)
        },
        ...Q.CredentialScope && {
          credentialScope: Q.CredentialScope
        },
        ...G && {
          accountId: G
        }
      };
      return (0, Rf4.setCredentialFeature)(Z, "CREDENTIALS_PROCESS", "w"), Z
    }, "getValidatedProcessCredentials"),
    Pf4 = iq1(async (A, Q, B) => {
      let G = Q[A];
      if (Q[A]) {
        let Z = G.credential_process;
        if (Z !== void 0) {
          let I = (0, Of4.promisify)(Mf4.exec);
          try {
            let {
              stdout: Y
            } = await I(Z), J;
            try {
              J = JSON.parse(Y.trim())
            } catch {
              throw Error(`Profile ${A} credential_process returned invalid JSON.`)
            }
            return Tf4(A, J, Q)
          } catch (Y) {
            throw new lq1.CredentialsProviderError(Y.message, {
              logger: B
            })
          }
        } else throw new lq1.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
          logger: B
        })
      } else throw new lq1.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
        logger: B
      })
    }, "resolveProcessCredentials"),
    jf4 = iq1((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      let B = await (0, PIQ.parseKnownFiles)(A);
      return Pf4((0, PIQ.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), B, A.logger)
    }, "fromProcess")
})
// @from(Start 2859387, End 2861711)
aq1 = z((RS) => {
  var Sf4 = RS && RS.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    _f4 = RS && RS.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    kf4 = RS && RS.__importStar || function() {
      var A = function(Q) {
        return A = Object.getOwnPropertyNames || function(B) {
          var G = [];
          for (var Z in B)
            if (Object.prototype.hasOwnProperty.call(B, Z)) G[G.length] = Z;
          return G
        }, A(Q)
      };
      return function(Q) {
        if (Q && Q.__esModule) return Q;
        var B = {};
        if (Q != null) {
          for (var G = A(Q), Z = 0; Z < G.length; Z++)
            if (G[Z] !== "default") Sf4(B, Q, G[Z])
        }
        return _f4(B, Q), B
      }
    }();
  Object.defineProperty(RS, "__esModule", {
    value: !0
  });
  RS.fromWebToken = void 0;
  var yf4 = (A) => async (Q) => {
    A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
    let {
      roleArn: B,
      roleSessionName: G,
      webIdentityToken: Z,
      providerId: I,
      policyArns: Y,
      policy: J,
      durationSeconds: W
    } = A, {
      roleAssumerWithWebIdentity: X
    } = A;
    if (!X) {
      let {
        getDefaultRoleAssumerWithWebIdentity: V
      } = await Promise.resolve().then(() => kf4(pq1()));
      X = V({
        ...A.clientConfig,
        credentialProviderLogger: A.logger,
        parentClientConfig: {
          ...Q?.callerClientConfig,
          ...A.parentClientConfig
        }
      }, A.clientPlugins)
    }
    return X({
      RoleArn: B,
      RoleSessionName: G ?? `aws-sdk-js-session-${Date.now()}`,
      WebIdentityToken: Z,
      ProviderId: I,
      PolicyArns: Y,
      Policy: J,
      DurationSeconds: W
    })
  };
  RS.fromWebToken = yf4
})
// @from(Start 2861717, End 2862792)
xIQ = z((kIQ) => {
  Object.defineProperty(kIQ, "__esModule", {
    value: !0
  });
  kIQ.fromTokenFile = void 0;
  var xf4 = QL(),
    vf4 = j2(),
    bf4 = UA("fs"),
    ff4 = aq1(),
    _IQ = "AWS_WEB_IDENTITY_TOKEN_FILE",
    hf4 = "AWS_ROLE_ARN",
    gf4 = "AWS_ROLE_SESSION_NAME",
    uf4 = (A = {}) => async () => {
      A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      let Q = A?.webIdentityTokenFile ?? process.env[_IQ],
        B = A?.roleArn ?? process.env[hf4],
        G = A?.roleSessionName ?? process.env[gf4];
      if (!Q || !B) throw new vf4.CredentialsProviderError("Web identity configuration not specified", {
        logger: A.logger
      });
      let Z = await (0, ff4.fromWebToken)({
        ...A,
        webIdentityToken: (0, bf4.readFileSync)(Q, {
          encoding: "ascii"
        }),
        roleArn: B,
        roleSessionName: G
      })();
      if (Q === process.env[_IQ])(0, xf4.setCredentialFeature)(Z, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      return Z
    };
  kIQ.fromTokenFile = uf4
})
// @from(Start 2862798, End 2863494)
oq1 = z((dU7, wgA) => {
  var {
    defineProperty: vIQ,
    getOwnPropertyDescriptor: mf4,
    getOwnPropertyNames: df4
  } = Object, cf4 = Object.prototype.hasOwnProperty, sq1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of df4(Q))
        if (!cf4.call(A, Z) && Z !== B) vIQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = mf4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bIQ = (A, Q, B) => (sq1(A, Q, "default"), B && sq1(B, Q, "default")), pf4 = (A) => sq1(vIQ({}, "__esModule", {
    value: !0
  }), A), rq1 = {};
  wgA.exports = pf4(rq1);
  bIQ(rq1, xIQ(), wgA.exports);
  bIQ(rq1, aq1(), wgA.exports)
})
// @from(Start 2863500, End 2873222)
pIQ = z((cU7, cIQ) => {
  var {
    create: lf4,
    defineProperty: NHA,
    getOwnPropertyDescriptor: if4,
    getOwnPropertyNames: nf4,
    getPrototypeOf: af4
  } = Object, sf4 = Object.prototype.hasOwnProperty, jX = (A, Q) => NHA(A, "name", {
    value: Q,
    configurable: !0
  }), rf4 = (A, Q) => {
    for (var B in Q) NHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uIQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of nf4(Q))
        if (!sf4.call(A, Z) && Z !== B) NHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = if4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Nd = (A, Q, B) => (B = A != null ? lf4(af4(A)) : {}, uIQ(Q || !A || !A.__esModule ? NHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), of4 = (A) => uIQ(NHA({}, "__esModule", {
    value: !0
  }), A), mIQ = {};
  rf4(mIQ, {
    fromIni: () => Xh4
  });
  cIQ.exports = of4(mIQ);
  var eq1 = SG(),
    Ld = QL(),
    qHA = j2(),
    tf4 = jX((A, Q, B) => {
      let G = {
        EcsContainer: jX(async (Z) => {
          let {
            fromHttp: I
          } = await Promise.resolve().then(() => Nd(vw1())), {
            fromContainerMetadata: Y
          } = await Promise.resolve().then(() => Nd(OV()));
          return B?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => (0, qHA.chain)(I(Z ?? {}), Y(Z))().then(tq1)
        }, "EcsContainer"),
        Ec2InstanceMetadata: jX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
          let {
            fromInstanceMetadata: I
          } = await Promise.resolve().then(() => Nd(OV()));
          return async () => I(Z)().then(tq1)
        }, "Ec2InstanceMetadata"),
        Environment: jX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
          let {
            fromEnv: I
          } = await Promise.resolve().then(() => Nd(Tw1()));
          return async () => I(Z)().then(tq1)
        }, "Environment")
      };
      if (A in G) return G[A];
      else throw new qHA.CredentialsProviderError(`Unsupported credential source in profile ${Q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
        logger: B
      })
    }, "resolveCredentialSource"),
    tq1 = jX((A) => (0, Ld.setCredentialFeature)(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"), "setNamedProvider"),
    ef4 = jX((A, {
      profile: Q = "default",
      logger: B
    } = {}) => {
      return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (Ah4(A, {
        profile: Q,
        logger: B
      }) || Qh4(A, {
        profile: Q,
        logger: B
      }))
    }, "isAssumeRoleProfile"),
    Ah4 = jX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.source_profile === "string" && typeof A.credential_source > "u";
      if (G) B?.debug?.(`    ${Q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
      return G
    }, "isAssumeRoleWithSourceProfile"),
    Qh4 = jX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.credential_source === "string" && typeof A.source_profile > "u";
      if (G) B?.debug?.(`    ${Q} isCredentialSourceProfile credential_source=${A.credential_source}`);
      return G
    }, "isCredentialSourceProfile"),
    Bh4 = jX(async (A, Q, B, G = {}) => {
      B.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
      let Z = Q[A],
        {
          source_profile: I,
          region: Y
        } = Z;
      if (!B.roleAssumer) {
        let {
          getDefaultRoleAssumer: W
        } = await Promise.resolve().then(() => Nd(pq1()));
        B.roleAssumer = W({
          ...B.clientConfig,
          credentialProviderLogger: B.logger,
          parentClientConfig: {
            ...B?.parentClientConfig,
            region: Y ?? B?.parentClientConfig?.region
          }
        }, B.clientPlugins)
      }
      if (I && I in G) throw new qHA.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${(0,eq1.getProfileName)(B)}. Profiles visited: ` + Object.keys(G).join(", "), {
        logger: B.logger
      });
      B.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${I?`source_profile=[${I}]`:`profile=[${A}]`}`);
      let J = I ? dIQ(I, Q, B, {
        ...G,
        [I]: !0
      }, fIQ(Q[I] ?? {})) : (await tf4(Z.credential_source, A, B.logger)(B))();
      if (fIQ(Z)) return J.then((W) => (0, Ld.setCredentialFeature)(W, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
      else {
        let W = {
            RoleArn: Z.role_arn,
            RoleSessionName: Z.role_session_name || `aws-sdk-js-${Date.now()}`,
            ExternalId: Z.external_id,
            DurationSeconds: parseInt(Z.duration_seconds || "3600", 10)
          },
          {
            mfa_serial: X
          } = Z;
        if (X) {
          if (!B.mfaCodeProvider) throw new qHA.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
            logger: B.logger,
            tryNextLink: !1
          });
          W.SerialNumber = X, W.TokenCode = await B.mfaCodeProvider(X)
        }
        let V = await J;
        return B.roleAssumer(V, W).then((F) => (0, Ld.setCredentialFeature)(F, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
      }
    }, "resolveAssumeRoleCredentials"),
    fIQ = jX((A) => {
      return !A.role_arn && !!A.credential_source
    }, "isCredentialSourceWithoutRoleArn"),
    Gh4 = jX((A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", "isProcessProfile"),
    Zh4 = jX(async (A, Q) => Promise.resolve().then(() => Nd(nq1())).then(({
      fromProcess: B
    }) => B({
      ...A,
      profile: Q
    })().then((G) => (0, Ld.setCredentialFeature)(G, "CREDENTIALS_PROFILE_PROCESS", "v"))), "resolveProcessCredentials"),
    Ih4 = jX(async (A, Q, B = {}) => {
      let {
        fromSSO: G
      } = await Promise.resolve().then(() => Nd(Zq1()));
      return G({
        profile: A,
        logger: B.logger,
        parentClientConfig: B.parentClientConfig,
        clientConfig: B.clientConfig
      })().then((Z) => {
        if (Q.sso_session) return (0, Ld.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO", "r");
        else return (0, Ld.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
      })
    }, "resolveSsoCredentials"),
    Yh4 = jX((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    hIQ = jX((A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, "isStaticCredsProfile"),
    gIQ = jX(async (A, Q) => {
      Q?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
      let B = {
        accessKeyId: A.aws_access_key_id,
        secretAccessKey: A.aws_secret_access_key,
        sessionToken: A.aws_session_token,
        ...A.aws_credential_scope && {
          credentialScope: A.aws_credential_scope
        },
        ...A.aws_account_id && {
          accountId: A.aws_account_id
        }
      };
      return (0, Ld.setCredentialFeature)(B, "CREDENTIALS_PROFILE", "n")
    }, "resolveStaticCredentials"),
    Jh4 = jX((A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, "isWebIdentityProfile"),
    Wh4 = jX(async (A, Q) => Promise.resolve().then(() => Nd(oq1())).then(({
      fromTokenFile: B
    }) => B({
      webIdentityTokenFile: A.web_identity_token_file,
      roleArn: A.role_arn,
      roleSessionName: A.role_session_name,
      roleAssumerWithWebIdentity: Q.roleAssumerWithWebIdentity,
      logger: Q.logger,
      parentClientConfig: Q.parentClientConfig
    })().then((G) => (0, Ld.setCredentialFeature)(G, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), "resolveWebIdentityCredentials"),
    dIQ = jX(async (A, Q, B, G = {}, Z = !1) => {
      let I = Q[A];
      if (Object.keys(G).length > 0 && hIQ(I)) return gIQ(I, B);
      if (Z || ef4(I, {
          profile: A,
          logger: B.logger
        })) return Bh4(A, Q, B, G);
      if (hIQ(I)) return gIQ(I, B);
      if (Jh4(I)) return Wh4(I, B);
      if (Gh4(I)) return Zh4(B, A);
      if (Yh4(I)) return await Ih4(A, I, B);
      throw new qHA.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
        logger: B.logger
      })
    }, "resolveProfileData"),
    Xh4 = jX((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      let B = {
        ...A,
        parentClientConfig: {
          ...Q,
          ...A.parentClientConfig
        }
      };
      B.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
      let G = await (0, eq1.parseKnownFiles)(B);
      return dIQ((0, eq1.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), G, B)
    }, "fromIni")
})
// @from(Start 2873228, End 2878190)
tIQ = z((pU7, oIQ) => {
  var {
    create: Vh4,
    defineProperty: LHA,
    getOwnPropertyDescriptor: Fh4,
    getOwnPropertyNames: Kh4,
    getPrototypeOf: Dh4
  } = Object, Hh4 = Object.prototype.hasOwnProperty, qgA = (A, Q) => LHA(A, "name", {
    value: Q,
    configurable: !0
  }), Ch4 = (A, Q) => {
    for (var B in Q) LHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, nIQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Kh4(Q))
        if (!Hh4.call(A, Z) && Z !== B) LHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Fh4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, U8A = (A, Q, B) => (B = A != null ? Vh4(Dh4(A)) : {}, nIQ(Q || !A || !A.__esModule ? LHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Eh4 = (A) => nIQ(LHA({}, "__esModule", {
    value: !0
  }), A), aIQ = {};
  Ch4(aIQ, {
    credentialsTreatedAsExpired: () => rIQ,
    credentialsWillNeedRefresh: () => sIQ,
    defaultProvider: () => $h4
  });
  oIQ.exports = Eh4(aIQ);
  var AN1 = Tw1(),
    zh4 = SG(),
    ir = j2(),
    lIQ = "AWS_EC2_METADATA_DISABLED",
    Uh4 = qgA(async (A) => {
      let {
        ENV_CMDS_FULL_URI: Q,
        ENV_CMDS_RELATIVE_URI: B,
        fromContainerMetadata: G,
        fromInstanceMetadata: Z
      } = await Promise.resolve().then(() => U8A(OV()));
      if (process.env[B] || process.env[Q]) {
        A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        let {
          fromHttp: I
        } = await Promise.resolve().then(() => U8A(vw1()));
        return (0, ir.chain)(I(A), G(A))
      }
      if (process.env[lIQ] && process.env[lIQ] !== "false") return async () => {
        throw new ir.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
          logger: A.logger
        })
      };
      return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Z(A)
    }, "remoteProvider"),
    iIQ = !1,
    $h4 = qgA((A = {}) => (0, ir.memoize)((0, ir.chain)(async () => {
      if (A.profile ?? process.env[zh4.ENV_PROFILE]) {
        if (process.env[AN1.ENV_KEY] && process.env[AN1.ENV_SECRET]) {
          if (!iIQ)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), iIQ = !0
        }
        throw new ir.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
          logger: A.logger,
          tryNextLink: !0
        })
      }
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), (0, AN1.fromEnv)(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
      let {
        ssoStartUrl: Q,
        ssoAccountId: B,
        ssoRegion: G,
        ssoRoleName: Z,
        ssoSession: I
      } = A;
      if (!Q && !B && !G && !Z && !I) throw new ir.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
        logger: A.logger
      });
      let {
        fromSSO: Y
      } = await Promise.resolve().then(() => U8A(Zq1()));
      return Y(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
      let {
        fromIni: Q
      } = await Promise.resolve().then(() => U8A(pIQ()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
      let {
        fromProcess: Q
      } = await Promise.resolve().then(() => U8A(nq1()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
      let {
        fromTokenFile: Q
      } = await Promise.resolve().then(() => U8A(oq1()));
      return Q(A)()
    }, async () => {
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await Uh4(A))()
    }, async () => {
      throw new ir.CredentialsProviderError("Could not load credentials from any providers", {
        tryNextLink: !1,
        logger: A.logger
      })
    }), rIQ, sIQ), "defaultProvider"),
    sIQ = qgA((A) => A?.expiration !== void 0, "credentialsWillNeedRefresh"),
    rIQ = qgA((A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000, "credentialsTreatedAsExpired")
})
// @from(Start 2878196, End 2886373)
NYQ = z((wYQ) => {
  Object.defineProperty(wYQ, "__esModule", {
    value: !0
  });
  wYQ.ruleSet = void 0;
  var VYQ = "required",
    g8 = "type",
    o3 = "fn",
    t3 = "argv",
    Od = "ref",
    eIQ = !1,
    QN1 = !0,
    Md = "booleanEquals",
    QD = "stringEquals",
    FYQ = "sigv4",
    KYQ = "sts",
    DYQ = "us-east-1",
    dI = "endpoint",
    AYQ = "https://sts.{Region}.{PartitionResult#dnsSuffix}",
    TS = "tree",
    $8A = "error",
    GN1 = "getAttr",
    QYQ = {
      [VYQ]: !1,
      [g8]: "String"
    },
    BN1 = {
      [VYQ]: !0,
      default: !1,
      [g8]: "Boolean"
    },
    HYQ = {
      [Od]: "Endpoint"
    },
    BYQ = {
      [o3]: "isSet",
      [t3]: [{
        [Od]: "Region"
      }]
    },
    BD = {
      [Od]: "Region"
    },
    GYQ = {
      [o3]: "aws.partition",
      [t3]: [BD],
      assign: "PartitionResult"
    },
    CYQ = {
      [Od]: "UseFIPS"
    },
    EYQ = {
      [Od]: "UseDualStack"
    },
    wH = {
      url: "https://sts.amazonaws.com",
      properties: {
        authSchemes: [{
          name: FYQ,
          signingName: KYQ,
          signingRegion: DYQ
        }]
      },
      headers: {}
    },
    zw = {},
    ZYQ = {
      conditions: [{
        [o3]: QD,
        [t3]: [BD, "aws-global"]
      }],
      [dI]: wH,
      [g8]: dI
    },
    zYQ = {
      [o3]: Md,
      [t3]: [CYQ, !0]
    },
    UYQ = {
      [o3]: Md,
      [t3]: [EYQ, !0]
    },
    IYQ = {
      [o3]: GN1,
      [t3]: [{
        [Od]: "PartitionResult"
      }, "supportsFIPS"]
    },
    $YQ = {
      [Od]: "PartitionResult"
    },
    YYQ = {
      [o3]: Md,
      [t3]: [!0, {
        [o3]: GN1,
        [t3]: [$YQ, "supportsDualStack"]
      }]
    },
    JYQ = [{
      [o3]: "isSet",
      [t3]: [HYQ]
    }],
    WYQ = [zYQ],
    XYQ = [UYQ],
    wh4 = {
      version: "1.0",
      parameters: {
        Region: QYQ,
        UseDualStack: BN1,
        UseFIPS: BN1,
        Endpoint: QYQ,
        UseGlobalEndpoint: BN1
      },
      rules: [{
        conditions: [{
          [o3]: Md,
          [t3]: [{
            [Od]: "UseGlobalEndpoint"
          }, QN1]
        }, {
          [o3]: "not",
          [t3]: JYQ
        }, BYQ, GYQ, {
          [o3]: Md,
          [t3]: [CYQ, eIQ]
        }, {
          [o3]: Md,
          [t3]: [EYQ, eIQ]
        }],
        rules: [{
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "ap-northeast-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "ap-south-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "ap-southeast-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "ap-southeast-2"]
          }],
          endpoint: wH,
          [g8]: dI
        }, ZYQ, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "ca-central-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "eu-central-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "eu-north-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "eu-west-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "eu-west-2"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "eu-west-3"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "sa-east-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, DYQ]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "us-east-2"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "us-west-1"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          conditions: [{
            [o3]: QD,
            [t3]: [BD, "us-west-2"]
          }],
          endpoint: wH,
          [g8]: dI
        }, {
          endpoint: {
            url: AYQ,
            properties: {
              authSchemes: [{
                name: FYQ,
                signingName: KYQ,
                signingRegion: "{Region}"
              }]
            },
            headers: zw
          },
          [g8]: dI
        }],
        [g8]: TS
      }, {
        conditions: JYQ,
        rules: [{
          conditions: WYQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          [g8]: $8A
        }, {
          conditions: XYQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          [g8]: $8A
        }, {
          endpoint: {
            url: HYQ,
            properties: zw,
            headers: zw
          },
          [g8]: dI
        }],
        [g8]: TS
      }, {
        conditions: [BYQ],
        rules: [{
          conditions: [GYQ],
          rules: [{
            conditions: [zYQ, UYQ],
            rules: [{
              conditions: [{
                [o3]: Md,
                [t3]: [QN1, IYQ]
              }, YYQ],
              rules: [{
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: zw,
                  headers: zw
                },
                [g8]: dI
              }],
              [g8]: TS
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              [g8]: $8A
            }],
            [g8]: TS
          }, {
            conditions: WYQ,
            rules: [{
              conditions: [{
                [o3]: Md,
                [t3]: [IYQ, QN1]
              }],
              rules: [{
                conditions: [{
                  [o3]: QD,
                  [t3]: [{
                    [o3]: GN1,
                    [t3]: [$YQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://sts.{Region}.amazonaws.com",
                  properties: zw,
                  headers: zw
                },
                [g8]: dI
              }, {
                endpoint: {
                  url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: zw,
                  headers: zw
                },
                [g8]: dI
              }],
              [g8]: TS
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              [g8]: $8A
            }],
            [g8]: TS
          }, {
            conditions: XYQ,
            rules: [{
              conditions: [YYQ],
              rules: [{
                endpoint: {
                  url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: zw,
                  headers: zw
                },
                [g8]: dI
              }],
              [g8]: TS
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              [g8]: $8A
            }],
            [g8]: TS
          }, ZYQ, {
            endpoint: {
              url: AYQ,
              properties: zw,
              headers: zw
            },
            [g8]: dI
          }],
          [g8]: TS
        }],
        [g8]: TS
      }, {
        error: "Invalid Configuration: Missing Region",
        [g8]: $8A
      }]
    };
  wYQ.ruleSet = wh4
})
// @from(Start 2886379, End 2886964)
OYQ = z((LYQ) => {
  Object.defineProperty(LYQ, "__esModule", {
    value: !0
  });
  LYQ.defaultEndpointResolver = void 0;
  var qh4 = p4A(),
    ZN1 = FI(),
    Nh4 = NYQ(),
    Lh4 = new ZN1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
    }),
    Mh4 = (A, Q = {}) => {
      return Lh4.get(A, () => (0, ZN1.resolveEndpoint)(Nh4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  LYQ.defaultEndpointResolver = Mh4;
  ZN1.customEndpointFunctions.aws = qh4.awsEndpointFunctions
})
// @from(Start 2886970, End 2888379)
SYQ = z((PYQ) => {
  Object.defineProperty(PYQ, "__esModule", {
    value: !0
  });
  PYQ.getRuntimeConfig = void 0;
  var Oh4 = MF(),
    Rh4 = iB(),
    Th4 = K6(),
    Ph4 = NJ(),
    RYQ = Fd(),
    TYQ = O2(),
    jh4 = Rw1(),
    Sh4 = OYQ(),
    _h4 = (A) => {
      return {
        apiVersion: "2011-06-15",
        base64Decoder: A?.base64Decoder ?? RYQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? RYQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Sh4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? jh4.defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Oh4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Rh4.NoAuthSigner
        }],
        logger: A?.logger ?? new Th4.NoOpLogger,
        serviceId: A?.serviceId ?? "STS",
        urlParser: A?.urlParser ?? Ph4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? TYQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? TYQ.toUtf8
      }
    };
  PYQ.getRuntimeConfig = _h4
})
// @from(Start 2888385, End 2891289)
fYQ = z((vYQ) => {
  Object.defineProperty(vYQ, "__esModule", {
    value: !0
  });
  vYQ.getRuntimeConfig = void 0;
  var kh4 = yr(),
    yh4 = kh4.__importDefault(Y5Q()),
    IN1 = MF(),
    _YQ = tIQ(),
    kYQ = XHA(),
    NgA = f8(),
    xh4 = iB(),
    vh4 = RX(),
    yYQ = D6(),
    nr = uI(),
    xYQ = IZ(),
    bh4 = TX(),
    fh4 = KW(),
    hh4 = SYQ(),
    gh4 = K6(),
    uh4 = PX(),
    mh4 = K6(),
    dh4 = (A) => {
      (0, mh4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, uh4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(gh4.loadConfigsForDefaultMode),
        G = (0, hh4.getRuntimeConfig)(A);
      (0, IN1.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, nr.loadConfig)(IN1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? bh4.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? _YQ.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, kYQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: yh4.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4") || (async (Y) => await (0, _YQ.defaultProvider)(Y?.__config || {})()),
          signer: new IN1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new xh4.NoAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, nr.loadConfig)(yYQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, nr.loadConfig)(NgA.NODE_REGION_CONFIG_OPTIONS, {
          ...NgA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: xYQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, nr.loadConfig)({
          ...yYQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || fh4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? vh4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? xYQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, nr.loadConfig)(NgA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, nr.loadConfig)(NgA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, nr.loadConfig)(kYQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  vYQ.getRuntimeConfig = dh4
})
// @from(Start 2891295, End 2892314)
uYQ = z((hYQ) => {
  Object.defineProperty(hYQ, "__esModule", {
    value: !0
  });
  hYQ.resolveHttpAuthRuntimeConfig = hYQ.getHttpAuthExtensionConfiguration = void 0;
  var ch4 = (A) => {
    let {
      httpAuthSchemes: Q,
      httpAuthSchemeProvider: B,
      credentials: G
    } = A;
    return {
      setHttpAuthScheme(Z) {
        let I = Q.findIndex((Y) => Y.schemeId === Z.schemeId);
        if (I === -1) Q.push(Z);
        else Q.splice(I, 1, Z)
      },
      httpAuthSchemes() {
        return Q
      },
      setHttpAuthSchemeProvider(Z) {
        B = Z
      },
      httpAuthSchemeProvider() {
        return B
      },
      setCredentials(Z) {
        G = Z
      },
      credentials() {
        return G
      }
    }
  };
  hYQ.getHttpAuthExtensionConfiguration = ch4;
  var ph4 = (A) => {
    return {
      httpAuthSchemes: A.httpAuthSchemes(),
      httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
      credentials: A.credentials()
    }
  };
  hYQ.resolveHttpAuthRuntimeConfig = ph4
})
// @from(Start 2892320, End 2893045)
nYQ = z((lYQ) => {
  Object.defineProperty(lYQ, "__esModule", {
    value: !0
  });
  lYQ.resolveRuntimeExtensions = void 0;
  var mYQ = KHA(),
    dYQ = nC(),
    cYQ = K6(),
    pYQ = uYQ(),
    ih4 = (A, Q) => {
      let B = Object.assign((0, mYQ.getAwsRegionExtensionConfiguration)(A), (0, cYQ.getDefaultExtensionConfiguration)(A), (0, dYQ.getHttpHandlerExtensionConfiguration)(A), (0, pYQ.getHttpAuthExtensionConfiguration)(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, mYQ.resolveAwsRegionExtensionConfiguration)(B), (0, cYQ.resolveDefaultRuntimeConfig)(B), (0, dYQ.resolveHttpHandlerRuntimeConfig)(B), (0, pYQ.resolveHttpAuthRuntimeConfig)(B))
    };
  lYQ.resolveRuntimeExtensions = ih4
})
// @from(Start 2893051, End 2895032)
WHA = z((JN1) => {
  Object.defineProperty(JN1, "__esModule", {
    value: !0
  });
  JN1.STSClient = JN1.__Client = void 0;
  var aYQ = yDA(),
    nh4 = xDA(),
    ah4 = vDA(),
    sYQ = r4A(),
    sh4 = f8(),
    YN1 = iB(),
    rh4 = LX(),
    oh4 = q5(),
    rYQ = D6(),
    tYQ = K6();
  Object.defineProperty(JN1, "__Client", {
    enumerable: !0,
    get: function() {
      return tYQ.Client
    }
  });
  var oYQ = Rw1(),
    th4 = IL(),
    eh4 = fYQ(),
    Ag4 = nYQ();
  class eYQ extends tYQ.Client {
    config;
    constructor(...[A]) {
      let Q = (0, eh4.getRuntimeConfig)(A || {});
      super(Q);
      this.initConfig = Q;
      let B = (0, th4.resolveClientEndpointParameters)(Q),
        G = (0, sYQ.resolveUserAgentConfig)(B),
        Z = (0, rYQ.resolveRetryConfig)(G),
        I = (0, sh4.resolveRegionConfig)(Z),
        Y = (0, aYQ.resolveHostHeaderConfig)(I),
        J = (0, oh4.resolveEndpointConfig)(Y),
        W = (0, oYQ.resolveHttpAuthSchemeConfig)(J),
        X = (0, Ag4.resolveRuntimeExtensions)(W, A?.extensions || []);
      this.config = X, this.middlewareStack.use((0, sYQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, rYQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, rh4.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, aYQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, nh4.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, ah4.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, YN1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: oYQ.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (V) => new YN1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": V.credentials
        })
      })), this.middlewareStack.use((0, YN1.getHttpSigningPlugin)(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  JN1.STSClient = eYQ
})