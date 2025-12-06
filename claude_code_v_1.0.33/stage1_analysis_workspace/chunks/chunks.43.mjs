
// @from(Start 3858222, End 3881594)
Hj1 = z((vO7, Dj1) => {
  var {
    defineProperty: hdA,
    getOwnPropertyDescriptor: hV8,
    getOwnPropertyNames: gV8
  } = Object, uV8 = Object.prototype.hasOwnProperty, y2 = (A, Q) => hdA(A, "name", {
    value: Q,
    configurable: !0
  }), mV8 = (A, Q) => {
    for (var B in Q) hdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Yj1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gV8(Q))
        if (!uV8.call(A, Z) && Z !== B) hdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hV8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, dV8 = (A, Q, B) => (Yj1(A, Q, "default"), B && Yj1(B, Q, "default")), cV8 = (A) => Yj1(hdA({}, "__esModule", {
    value: !0
  }), A), Wj1 = {};
  mV8(Wj1, {
    AssumeRoleCommand: () => Fj1,
    AssumeRoleResponseFilterSensitiveLog: () => TxQ,
    AssumeRoleWithWebIdentityCommand: () => Kj1,
    AssumeRoleWithWebIdentityRequestFilterSensitiveLog: () => xxQ,
    AssumeRoleWithWebIdentityResponseFilterSensitiveLog: () => vxQ,
    ClientInputEndpointParameters: () => vF8.ClientInputEndpointParameters,
    CredentialsFilterSensitiveLog: () => Xj1,
    ExpiredTokenException: () => PxQ,
    IDPCommunicationErrorException: () => bxQ,
    IDPRejectedClaimException: () => kxQ,
    InvalidIdentityTokenException: () => yxQ,
    MalformedPolicyDocumentException: () => jxQ,
    PackedPolicyTooLargeException: () => SxQ,
    RegionDisabledException: () => _xQ,
    STS: () => nxQ,
    STSServiceException: () => Hb,
    decorateDefaultCredentialProvider: () => hF8,
    getDefaultRoleAssumer: () => exQ,
    getDefaultRoleAssumerWithWebIdentity: () => AvQ
  });
  Dj1.exports = cV8(Wj1);
  dV8(Wj1, kCA(), Dj1.exports);
  var pV8 = o6(),
    lV8 = q5(),
    iV8 = GZ(),
    nV8 = o6(),
    aV8 = yCA(),
    RxQ = o6(),
    sV8 = o6(),
    Hb = class A extends sV8.ServiceException {
      static {
        y2(this, "STSServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    Xj1 = y2((A) => ({
      ...A,
      ...A.SecretAccessKey && {
        SecretAccessKey: RxQ.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    TxQ = y2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: Xj1(A.Credentials)
      }
    }), "AssumeRoleResponseFilterSensitiveLog"),
    PxQ = class A extends Hb {
      static {
        y2(this, "ExpiredTokenException")
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
    jxQ = class A extends Hb {
      static {
        y2(this, "MalformedPolicyDocumentException")
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
    SxQ = class A extends Hb {
      static {
        y2(this, "PackedPolicyTooLargeException")
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
    _xQ = class A extends Hb {
      static {
        y2(this, "RegionDisabledException")
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
    kxQ = class A extends Hb {
      static {
        y2(this, "IDPRejectedClaimException")
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
    yxQ = class A extends Hb {
      static {
        y2(this, "InvalidIdentityTokenException")
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
    xxQ = y2((A) => ({
      ...A,
      ...A.WebIdentityToken && {
        WebIdentityToken: RxQ.SENSITIVE_STRING
      }
    }), "AssumeRoleWithWebIdentityRequestFilterSensitiveLog"),
    vxQ = y2((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: Xj1(A.Credentials)
      }
    }), "AssumeRoleWithWebIdentityResponseFilterSensitiveLog"),
    bxQ = class A extends Hb {
      static {
        y2(this, "IDPCommunicationErrorException")
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
    Vj1 = PF(),
    rV8 = az(),
    M7 = o6(),
    oV8 = y2(async (A, Q) => {
      let B = dxQ,
        G;
      return G = ixQ({
        ...WF8(A, Q),
        [pxQ]: RF8,
        [lxQ]: cxQ
      }), mxQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleCommand"),
    tV8 = y2(async (A, Q) => {
      let B = dxQ,
        G;
      return G = ixQ({
        ...XF8(A, Q),
        [pxQ]: TF8,
        [lxQ]: cxQ
      }), mxQ(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithWebIdentityCommand"),
    eV8 = y2(async (A, Q) => {
      if (A.statusCode >= 300) return fxQ(A, Q);
      let B = await (0, Vj1.parseXmlBody)(A.body, Q),
        G = {};
      return G = EF8(B.AssumeRoleResult, Q), {
        $metadata: Cb(A),
        ...G
      }
    }, "de_AssumeRoleCommand"),
    AF8 = y2(async (A, Q) => {
      if (A.statusCode >= 300) return fxQ(A, Q);
      let B = await (0, Vj1.parseXmlBody)(A.body, Q),
        G = {};
      return G = zF8(B.AssumeRoleWithWebIdentityResult, Q), {
        $metadata: Cb(A),
        ...G
      }
    }, "de_AssumeRoleWithWebIdentityCommand"),
    fxQ = y2(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, Vj1.parseXmlErrorBody)(A.body, Q)
        },
        G = PF8(A, B.body);
      switch (G) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await QF8(B, Q);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await IF8(B, Q);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await YF8(B, Q);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await JF8(B, Q);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await BF8(B, Q);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await GF8(B, Q);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await ZF8(B, Q);
        default:
          let Z = B.body;
          return OF8({
            output: A,
            parsedBody: Z.Error,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    QF8 = y2(async (A, Q) => {
      let B = A.body,
        G = UF8(B.Error, Q),
        Z = new PxQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_ExpiredTokenExceptionRes"),
    BF8 = y2(async (A, Q) => {
      let B = A.body,
        G = $F8(B.Error, Q),
        Z = new bxQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_IDPCommunicationErrorExceptionRes"),
    GF8 = y2(async (A, Q) => {
      let B = A.body,
        G = wF8(B.Error, Q),
        Z = new kxQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_IDPRejectedClaimExceptionRes"),
    ZF8 = y2(async (A, Q) => {
      let B = A.body,
        G = qF8(B.Error, Q),
        Z = new yxQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityTokenExceptionRes"),
    IF8 = y2(async (A, Q) => {
      let B = A.body,
        G = NF8(B.Error, Q),
        Z = new jxQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_MalformedPolicyDocumentExceptionRes"),
    YF8 = y2(async (A, Q) => {
      let B = A.body,
        G = LF8(B.Error, Q),
        Z = new SxQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_PackedPolicyTooLargeExceptionRes"),
    JF8 = y2(async (A, Q) => {
      let B = A.body,
        G = MF8(B.Error, Q),
        Z = new _xQ({
          $metadata: Cb(A),
          ...G
        });
      return (0, M7.decorateServiceException)(Z, B)
    }, "de_RegionDisabledExceptionRes"),
    WF8 = y2((A, Q) => {
      let B = {};
      if (A[s6A] != null) B[s6A] = A[s6A];
      if (A[r6A] != null) B[r6A] = A[r6A];
      if (A[n6A] != null) {
        let G = hxQ(A[n6A], Q);
        if (A[n6A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[i6A] != null) B[i6A] = A[i6A];
      if (A[l6A] != null) B[l6A] = A[l6A];
      if (A[Aj1] != null) {
        let G = CF8(A[Aj1], Q);
        if (A[Aj1]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      if (A[Bj1] != null) {
        let G = HF8(A[Bj1], Q);
        if (A[Bj1]?.length === 0) B.TransitiveTagKeys = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TransitiveTagKeys.${Z}`;
          B[Y] = I
        })
      }
      if (A[pP1] != null) B[pP1] = A[pP1];
      if (A[tP1] != null) B[tP1] = A[tP1];
      if (A[Qj1] != null) B[Qj1] = A[Qj1];
      if (A[Db] != null) B[Db] = A[Db];
      if (A[nP1] != null) {
        let G = KF8(A[nP1], Q);
        if (A[nP1]?.length === 0) B.ProvidedContexts = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `ProvidedContexts.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_AssumeRoleRequest"),
    XF8 = y2((A, Q) => {
      let B = {};
      if (A[s6A] != null) B[s6A] = A[s6A];
      if (A[r6A] != null) B[r6A] = A[r6A];
      if (A[Zj1] != null) B[Zj1] = A[Zj1];
      if (A[aP1] != null) B[aP1] = A[aP1];
      if (A[n6A] != null) {
        let G = hxQ(A[n6A], Q);
        if (A[n6A]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[i6A] != null) B[i6A] = A[i6A];
      if (A[l6A] != null) B[l6A] = A[l6A];
      return B
    }, "se_AssumeRoleWithWebIdentityRequest"),
    hxQ = y2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = VF8(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_policyDescriptorListType"),
    VF8 = y2((A, Q) => {
      let B = {};
      if (A[Ij1] != null) B[Ij1] = A[Ij1];
      return B
    }, "se_PolicyDescriptorType"),
    FF8 = y2((A, Q) => {
      let B = {};
      if (A[iP1] != null) B[iP1] = A[iP1];
      if (A[dP1] != null) B[dP1] = A[dP1];
      return B
    }, "se_ProvidedContext"),
    KF8 = y2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = FF8(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_ProvidedContextsListType"),
    DF8 = y2((A, Q) => {
      let B = {};
      if (A[lP1] != null) B[lP1] = A[lP1];
      if (A[Gj1] != null) B[Gj1] = A[Gj1];
      return B
    }, "se_Tag"),
    HF8 = y2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        B[`member.${G}`] = Z, G++
      }
      return B
    }, "se_tagKeyListType"),
    CF8 = y2((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = DF8(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_tagListType"),
    gxQ = y2((A, Q) => {
      let B = {};
      if (A[gP1] != null) B[gP1] = (0, M7.expectString)(A[gP1]);
      if (A[uP1] != null) B[uP1] = (0, M7.expectString)(A[uP1]);
      return B
    }, "de_AssumedRoleUser"),
    EF8 = y2((A, Q) => {
      let B = {};
      if (A[p6A] != null) B[p6A] = uxQ(A[p6A], Q);
      if (A[c6A] != null) B[c6A] = gxQ(A[c6A], Q);
      if (A[a6A] != null) B[a6A] = (0, M7.strictParseInt32)(A[a6A]);
      if (A[Db] != null) B[Db] = (0, M7.expectString)(A[Db]);
      return B
    }, "de_AssumeRoleResponse"),
    zF8 = y2((A, Q) => {
      let B = {};
      if (A[p6A] != null) B[p6A] = uxQ(A[p6A], Q);
      if (A[oP1] != null) B[oP1] = (0, M7.expectString)(A[oP1]);
      if (A[c6A] != null) B[c6A] = gxQ(A[c6A], Q);
      if (A[a6A] != null) B[a6A] = (0, M7.strictParseInt32)(A[a6A]);
      if (A[sP1] != null) B[sP1] = (0, M7.expectString)(A[sP1]);
      if (A[mP1] != null) B[mP1] = (0, M7.expectString)(A[mP1]);
      if (A[Db] != null) B[Db] = (0, M7.expectString)(A[Db]);
      return B
    }, "de_AssumeRoleWithWebIdentityResponse"),
    uxQ = y2((A, Q) => {
      let B = {};
      if (A[hP1] != null) B[hP1] = (0, M7.expectString)(A[hP1]);
      if (A[rP1] != null) B[rP1] = (0, M7.expectString)(A[rP1]);
      if (A[eP1] != null) B[eP1] = (0, M7.expectString)(A[eP1]);
      if (A[cP1] != null) B[cP1] = (0, M7.expectNonNull)((0, M7.parseRfc3339DateTimeWithOffset)(A[cP1]));
      return B
    }, "de_Credentials"),
    UF8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_ExpiredTokenException"),
    $F8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_IDPCommunicationErrorException"),
    wF8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_IDPRejectedClaimException"),
    qF8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_InvalidIdentityTokenException"),
    NF8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_MalformedPolicyDocumentException"),
    LF8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_PackedPolicyTooLargeException"),
    MF8 = y2((A, Q) => {
      let B = {};
      if (A[wW] != null) B[wW] = (0, M7.expectString)(A[wW]);
      return B
    }, "de_RegionDisabledException"),
    Cb = y2((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    OF8 = (0, M7.withBaseException)(Hb),
    mxQ = y2(async (A, Q, B, G, Z) => {
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
      return new rV8.HttpRequest(X)
    }, "buildHttpRpcRequest"),
    dxQ = {
      "content-type": "application/x-www-form-urlencoded"
    },
    cxQ = "2011-06-15",
    pxQ = "Action",
    hP1 = "AccessKeyId",
    RF8 = "AssumeRole",
    gP1 = "AssumedRoleId",
    c6A = "AssumedRoleUser",
    TF8 = "AssumeRoleWithWebIdentity",
    uP1 = "Arn",
    mP1 = "Audience",
    p6A = "Credentials",
    dP1 = "ContextAssertion",
    l6A = "DurationSeconds",
    cP1 = "Expiration",
    pP1 = "ExternalId",
    lP1 = "Key",
    i6A = "Policy",
    n6A = "PolicyArns",
    iP1 = "ProviderArn",
    nP1 = "ProvidedContexts",
    aP1 = "ProviderId",
    a6A = "PackedPolicySize",
    sP1 = "Provider",
    s6A = "RoleArn",
    r6A = "RoleSessionName",
    rP1 = "SecretAccessKey",
    oP1 = "SubjectFromWebIdentityToken",
    Db = "SourceIdentity",
    tP1 = "SerialNumber",
    eP1 = "SessionToken",
    Aj1 = "Tags",
    Qj1 = "TokenCode",
    Bj1 = "TransitiveTagKeys",
    lxQ = "Version",
    Gj1 = "Value",
    Zj1 = "WebIdentityToken",
    Ij1 = "arn",
    wW = "message",
    ixQ = y2((A) => Object.entries(A).map(([Q, B]) => (0, M7.extendedEncodeURIComponent)(Q) + "=" + (0, M7.extendedEncodeURIComponent)(B)).join("&"), "buildFormUrlencodedString"),
    PF8 = y2((A, Q) => {
      if (Q.Error?.Code !== void 0) return Q.Error.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadQueryErrorCode"),
    Fj1 = class extends nV8.Command.classBuilder().ep(aV8.commonParams).m(function(A, Q, B, G) {
      return [(0, iV8.getSerdePlugin)(B, this.serialize, this.deserialize), (0, lV8.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").f(void 0, TxQ).ser(oV8).de(eV8).build() {
      static {
        y2(this, "AssumeRoleCommand")
      }
    },
    jF8 = q5(),
    SF8 = GZ(),
    _F8 = o6(),
    kF8 = yCA(),
    Kj1 = class extends _F8.Command.classBuilder().ep(kF8.commonParams).m(function(A, Q, B, G) {
      return [(0, SF8.getSerdePlugin)(B, this.serialize, this.deserialize), (0, jF8.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").f(xxQ, vxQ).ser(tV8).de(AF8).build() {
      static {
        y2(this, "AssumeRoleWithWebIdentityCommand")
      }
    },
    yF8 = kCA(),
    xF8 = {
      AssumeRoleCommand: Fj1,
      AssumeRoleWithWebIdentityCommand: Kj1
    },
    nxQ = class extends yF8.STSClient {
      static {
        y2(this, "STS")
      }
    };
  (0, pV8.createAggregatedClient)(xF8, nxQ);
  var vF8 = yCA(),
    Jj1 = aR(),
    OxQ = "us-east-1",
    axQ = y2((A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    }, "getAccountIdFromAssumedRoleUser"),
    sxQ = y2(async (A, Q, B) => {
      let G = typeof A === "function" ? await A() : A,
        Z = typeof Q === "function" ? await Q() : Q;
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${G} (provider)`, `${Z} (parent client)`, `${OxQ} (STS default)`), G ?? Z ?? OxQ
    }, "resolveRegion"),
    bF8 = y2((A, Q) => {
      let B, G;
      return async (Z, I) => {
        if (G = Z, !B) {
          let {
            logger: V = A?.parentClientConfig?.logger,
            region: F,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: D
          } = A, H = await sxQ(F, A?.parentClientConfig?.region, D), C = !rxQ(K);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            credentialDefaultProvider: y2(() => async () => G, "credentialDefaultProvider"),
            region: H,
            requestHandler: C ? K : void 0,
            logger: V
          })
        }
        let {
          Credentials: Y,
          AssumedRoleUser: J
        } = await B.send(new Fj1(I));
        if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`);
        let W = axQ(J),
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
        return (0, Jj1.setCredentialFeature)(X, "CREDENTIALS_STS_ASSUME_ROLE", "i"), X
      }
    }, "getDefaultRoleAssumer"),
    fF8 = y2((A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            region: X,
            requestHandler: V = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: F
          } = A, K = await sxQ(X, A?.parentClientConfig?.region, F), D = !rxQ(V);
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
        } = await B.send(new Kj1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let Y = axQ(I),
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
        if (Y)(0, Jj1.setCredentialFeature)(J, "RESOLVED_ACCOUNT_ID", "T");
        return (0, Jj1.setCredentialFeature)(J, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), J
      }
    }, "getDefaultRoleAssumerWithWebIdentity"),
    rxQ = y2((A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, "isH2"),
    oxQ = kCA(),
    txQ = y2((A, Q) => {
      if (!Q) return A;
      else return class extends A {
        static {
          y2(this, "CustomizableSTSClient")
        }
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, "getCustomizableStsClientCtor"),
    exQ = y2((A = {}, Q) => bF8(A, txQ(oxQ.STSClient, Q)), "getDefaultRoleAssumer"),
    AvQ = y2((A = {}, Q) => fF8(A, txQ(oxQ.STSClient, Q)), "getDefaultRoleAssumerWithWebIdentity"),
    hF8 = y2((A) => (Q) => A({
      roleAssumer: exQ(Q),
      roleAssumerWithWebIdentity: AvQ(Q),
      ...Q
    }), "decorateDefaultCredentialProvider")
})
// @from(Start 3881600, End 3884842)
zj1 = z((gO7, GvQ) => {
  var {
    defineProperty: gdA,
    getOwnPropertyDescriptor: gF8,
    getOwnPropertyNames: uF8
  } = Object, mF8 = Object.prototype.hasOwnProperty, Ej1 = (A, Q) => gdA(A, "name", {
    value: Q,
    configurable: !0
  }), dF8 = (A, Q) => {
    for (var B in Q) gdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, cF8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of uF8(Q))
        if (!mF8.call(A, Z) && Z !== B) gdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = gF8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, pF8 = (A) => cF8(gdA({}, "__esModule", {
    value: !0
  }), A), BvQ = {};
  dF8(BvQ, {
    fromProcess: () => rF8
  });
  GvQ.exports = pF8(BvQ);
  var QvQ = SG(),
    Cj1 = j2(),
    lF8 = UA("child_process"),
    iF8 = UA("util"),
    nF8 = aR(),
    aF8 = Ej1((A, Q, B) => {
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
      return (0, nF8.setCredentialFeature)(Z, "CREDENTIALS_PROCESS", "w"), Z
    }, "getValidatedProcessCredentials"),
    sF8 = Ej1(async (A, Q, B) => {
      let G = Q[A];
      if (Q[A]) {
        let Z = G.credential_process;
        if (Z !== void 0) {
          let I = (0, iF8.promisify)(lF8.exec);
          try {
            let {
              stdout: Y
            } = await I(Z), J;
            try {
              J = JSON.parse(Y.trim())
            } catch {
              throw Error(`Profile ${A} credential_process returned invalid JSON.`)
            }
            return aF8(A, J, Q)
          } catch (Y) {
            throw new Cj1.CredentialsProviderError(Y.message, {
              logger: B
            })
          }
        } else throw new Cj1.CredentialsProviderError(`Profile ${A} did not contain credential_process.`, {
          logger: B
        })
      } else throw new Cj1.CredentialsProviderError(`Profile ${A} could not be found in shared credentials file.`, {
        logger: B
      })
    }, "resolveProcessCredentials"),
    rF8 = Ej1((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
      let B = await (0, QvQ.parseKnownFiles)(A);
      return sF8((0, QvQ.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), B, A.logger)
    }, "fromProcess")
})
// @from(Start 3884848, End 3887172)
Uj1 = z((iS) => {
  var oF8 = iS && iS.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    tF8 = iS && iS.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    eF8 = iS && iS.__importStar || function() {
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
            if (G[Z] !== "default") oF8(B, Q, G[Z])
        }
        return tF8(B, Q), B
      }
    }();
  Object.defineProperty(iS, "__esModule", {
    value: !0
  });
  iS.fromWebToken = void 0;
  var AK8 = (A) => async (Q) => {
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
      } = await Promise.resolve().then(() => eF8(Hj1()));
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
  iS.fromWebToken = AK8
})
// @from(Start 3887178, End 3888253)
JvQ = z((IvQ) => {
  Object.defineProperty(IvQ, "__esModule", {
    value: !0
  });
  IvQ.fromTokenFile = void 0;
  var QK8 = aR(),
    BK8 = j2(),
    GK8 = UA("fs"),
    ZK8 = Uj1(),
    ZvQ = "AWS_WEB_IDENTITY_TOKEN_FILE",
    IK8 = "AWS_ROLE_ARN",
    YK8 = "AWS_ROLE_SESSION_NAME",
    JK8 = (A = {}) => async () => {
      A.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
      let Q = A?.webIdentityTokenFile ?? process.env[ZvQ],
        B = A?.roleArn ?? process.env[IK8],
        G = A?.roleSessionName ?? process.env[YK8];
      if (!Q || !B) throw new BK8.CredentialsProviderError("Web identity configuration not specified", {
        logger: A.logger
      });
      let Z = await (0, ZK8.fromWebToken)({
        ...A,
        webIdentityToken: (0, GK8.readFileSync)(Q, {
          encoding: "ascii"
        }),
        roleArn: B,
        roleSessionName: G
      })();
      if (Q === process.env[ZvQ])(0, QK8.setCredentialFeature)(Z, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
      return Z
    };
  IvQ.fromTokenFile = JK8
})
// @from(Start 3888259, End 3888955)
qj1 = z((dO7, udA) => {
  var {
    defineProperty: WvQ,
    getOwnPropertyDescriptor: WK8,
    getOwnPropertyNames: XK8
  } = Object, VK8 = Object.prototype.hasOwnProperty, $j1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of XK8(Q))
        if (!VK8.call(A, Z) && Z !== B) WvQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = WK8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, XvQ = (A, Q, B) => ($j1(A, Q, "default"), B && $j1(B, Q, "default")), FK8 = (A) => $j1(WvQ({}, "__esModule", {
    value: !0
  }), A), wj1 = {};
  udA.exports = FK8(wj1);
  XvQ(wj1, JvQ(), udA.exports);
  XvQ(wj1, Uj1(), udA.exports)
})
// @from(Start 3888961, End 3898683)
zvQ = z((cO7, EvQ) => {
  var {
    create: KK8,
    defineProperty: vCA,
    getOwnPropertyDescriptor: DK8,
    getOwnPropertyNames: HK8,
    getPrototypeOf: CK8
  } = Object, EK8 = Object.prototype.hasOwnProperty, yX = (A, Q) => vCA(A, "name", {
    value: Q,
    configurable: !0
  }), zK8 = (A, Q) => {
    for (var B in Q) vCA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, DvQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HK8(Q))
        if (!EK8.call(A, Z) && Z !== B) vCA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DK8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rd = (A, Q, B) => (B = A != null ? KK8(CK8(A)) : {}, DvQ(Q || !A || !A.__esModule ? vCA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), UK8 = (A) => DvQ(vCA({}, "__esModule", {
    value: !0
  }), A), HvQ = {};
  zK8(HvQ, {
    fromIni: () => SK8
  });
  EvQ.exports = UK8(HvQ);
  var Lj1 = SG(),
    od = aR(),
    xCA = j2(),
    $K8 = yX((A, Q, B) => {
      let G = {
        EcsContainer: yX(async (Z) => {
          let {
            fromHttp: I
          } = await Promise.resolve().then(() => rd(JP1())), {
            fromContainerMetadata: Y
          } = await Promise.resolve().then(() => rd(OV()));
          return B?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => (0, xCA.chain)(I(Z ?? {}), Y(Z))().then(Nj1)
        }, "EcsContainer"),
        Ec2InstanceMetadata: yX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
          let {
            fromInstanceMetadata: I
          } = await Promise.resolve().then(() => rd(OV()));
          return async () => I(Z)().then(Nj1)
        }, "Ec2InstanceMetadata"),
        Environment: yX(async (Z) => {
          B?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
          let {
            fromEnv: I
          } = await Promise.resolve().then(() => rd(ZP1()));
          return async () => I(Z)().then(Nj1)
        }, "Environment")
      };
      if (A in G) return G[A];
      else throw new xCA.CredentialsProviderError(`Unsupported credential source in profile ${Q}. Got ${A}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, {
        logger: B
      })
    }, "resolveCredentialSource"),
    Nj1 = yX((A) => (0, od.setCredentialFeature)(A, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p"), "setNamedProvider"),
    wK8 = yX((A, {
      profile: Q = "default",
      logger: B
    } = {}) => {
      return Boolean(A) && typeof A === "object" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof A.external_id) > -1 && ["undefined", "string"].indexOf(typeof A.mfa_serial) > -1 && (qK8(A, {
        profile: Q,
        logger: B
      }) || NK8(A, {
        profile: Q,
        logger: B
      }))
    }, "isAssumeRoleProfile"),
    qK8 = yX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.source_profile === "string" && typeof A.credential_source > "u";
      if (G) B?.debug?.(`    ${Q} isAssumeRoleWithSourceProfile source_profile=${A.source_profile}`);
      return G
    }, "isAssumeRoleWithSourceProfile"),
    NK8 = yX((A, {
      profile: Q,
      logger: B
    }) => {
      let G = typeof A.credential_source === "string" && typeof A.source_profile > "u";
      if (G) B?.debug?.(`    ${Q} isCredentialSourceProfile credential_source=${A.credential_source}`);
      return G
    }, "isCredentialSourceProfile"),
    LK8 = yX(async (A, Q, B, G = {}) => {
      B.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
      let Z = Q[A],
        {
          source_profile: I,
          region: Y
        } = Z;
      if (!B.roleAssumer) {
        let {
          getDefaultRoleAssumer: W
        } = await Promise.resolve().then(() => rd(Hj1()));
        B.roleAssumer = W({
          ...B.clientConfig,
          credentialProviderLogger: B.logger,
          parentClientConfig: {
            ...B?.parentClientConfig,
            region: Y ?? B?.parentClientConfig?.region
          }
        }, B.clientPlugins)
      }
      if (I && I in G) throw new xCA.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${(0,Lj1.getProfileName)(B)}. Profiles visited: ` + Object.keys(G).join(", "), {
        logger: B.logger
      });
      B.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${I?`source_profile=[${I}]`:`profile=[${A}]`}`);
      let J = I ? CvQ(I, Q, B, {
        ...G,
        [I]: !0
      }, VvQ(Q[I] ?? {})) : (await $K8(Z.credential_source, A, B.logger)(B))();
      if (VvQ(Z)) return J.then((W) => (0, od.setCredentialFeature)(W, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
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
          if (!B.mfaCodeProvider) throw new xCA.CredentialsProviderError(`Profile ${A} requires multi-factor authentication, but no MFA code callback was provided.`, {
            logger: B.logger,
            tryNextLink: !1
          });
          W.SerialNumber = X, W.TokenCode = await B.mfaCodeProvider(X)
        }
        let V = await J;
        return B.roleAssumer(V, W).then((F) => (0, od.setCredentialFeature)(F, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"))
      }
    }, "resolveAssumeRoleCredentials"),
    VvQ = yX((A) => {
      return !A.role_arn && !!A.credential_source
    }, "isCredentialSourceWithoutRoleArn"),
    MK8 = yX((A) => Boolean(A) && typeof A === "object" && typeof A.credential_process === "string", "isProcessProfile"),
    OK8 = yX(async (A, Q) => Promise.resolve().then(() => rd(zj1())).then(({
      fromProcess: B
    }) => B({
      ...A,
      profile: Q
    })().then((G) => (0, od.setCredentialFeature)(G, "CREDENTIALS_PROFILE_PROCESS", "v"))), "resolveProcessCredentials"),
    RK8 = yX(async (A, Q, B = {}) => {
      let {
        fromSSO: G
      } = await Promise.resolve().then(() => rd(PP1()));
      return G({
        profile: A,
        logger: B.logger,
        parentClientConfig: B.parentClientConfig,
        clientConfig: B.clientConfig
      })().then((Z) => {
        if (Q.sso_session) return (0, od.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO", "r");
        else return (0, od.setCredentialFeature)(Z, "CREDENTIALS_PROFILE_SSO_LEGACY", "t")
      })
    }, "resolveSsoCredentials"),
    TK8 = yX((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    FvQ = yX((A) => Boolean(A) && typeof A === "object" && typeof A.aws_access_key_id === "string" && typeof A.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof A.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof A.aws_account_id) > -1, "isStaticCredsProfile"),
    KvQ = yX(async (A, Q) => {
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
      return (0, od.setCredentialFeature)(B, "CREDENTIALS_PROFILE", "n")
    }, "resolveStaticCredentials"),
    PK8 = yX((A) => Boolean(A) && typeof A === "object" && typeof A.web_identity_token_file === "string" && typeof A.role_arn === "string" && ["undefined", "string"].indexOf(typeof A.role_session_name) > -1, "isWebIdentityProfile"),
    jK8 = yX(async (A, Q) => Promise.resolve().then(() => rd(qj1())).then(({
      fromTokenFile: B
    }) => B({
      webIdentityTokenFile: A.web_identity_token_file,
      roleArn: A.role_arn,
      roleSessionName: A.role_session_name,
      roleAssumerWithWebIdentity: Q.roleAssumerWithWebIdentity,
      logger: Q.logger,
      parentClientConfig: Q.parentClientConfig
    })().then((G) => (0, od.setCredentialFeature)(G, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q"))), "resolveWebIdentityCredentials"),
    CvQ = yX(async (A, Q, B, G = {}, Z = !1) => {
      let I = Q[A];
      if (Object.keys(G).length > 0 && FvQ(I)) return KvQ(I, B);
      if (Z || wK8(I, {
          profile: A,
          logger: B.logger
        })) return LK8(A, Q, B, G);
      if (FvQ(I)) return KvQ(I, B);
      if (PK8(I)) return jK8(I, B);
      if (MK8(I)) return OK8(B, A);
      if (TK8(I)) return await RK8(A, I, B);
      throw new xCA.CredentialsProviderError(`Could not resolve credentials using profile: [${A}] in configuration/credentials file(s).`, {
        logger: B.logger
      })
    }, "resolveProfileData"),
    SK8 = yX((A = {}) => async ({
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
      let G = await (0, Lj1.parseKnownFiles)(B);
      return CvQ((0, Lj1.getProfileName)({
        profile: A.profile ?? Q?.profile
      }), G, B)
    }, "fromIni")
})
// @from(Start 3898689, End 3903651)
OvQ = z((pO7, MvQ) => {
  var {
    create: _K8,
    defineProperty: bCA,
    getOwnPropertyDescriptor: kK8,
    getOwnPropertyNames: yK8,
    getPrototypeOf: xK8
  } = Object, vK8 = Object.prototype.hasOwnProperty, mdA = (A, Q) => bCA(A, "name", {
    value: Q,
    configurable: !0
  }), bK8 = (A, Q) => {
    for (var B in Q) bCA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, wvQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of yK8(Q))
        if (!vK8.call(A, Z) && Z !== B) bCA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = kK8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, o6A = (A, Q, B) => (B = A != null ? _K8(xK8(A)) : {}, wvQ(Q || !A || !A.__esModule ? bCA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), fK8 = (A) => wvQ(bCA({}, "__esModule", {
    value: !0
  }), A), qvQ = {};
  bK8(qvQ, {
    credentialsTreatedAsExpired: () => LvQ,
    credentialsWillNeedRefresh: () => NvQ,
    defaultProvider: () => uK8
  });
  MvQ.exports = fK8(qvQ);
  var Mj1 = ZP1(),
    hK8 = SG(),
    Lo = j2(),
    UvQ = "AWS_EC2_METADATA_DISABLED",
    gK8 = mdA(async (A) => {
      let {
        ENV_CMDS_FULL_URI: Q,
        ENV_CMDS_RELATIVE_URI: B,
        fromContainerMetadata: G,
        fromInstanceMetadata: Z
      } = await Promise.resolve().then(() => o6A(OV()));
      if (process.env[B] || process.env[Q]) {
        A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        let {
          fromHttp: I
        } = await Promise.resolve().then(() => o6A(JP1()));
        return (0, Lo.chain)(I(A), G(A))
      }
      if (process.env[UvQ] && process.env[UvQ] !== "false") return async () => {
        throw new Lo.CredentialsProviderError("EC2 Instance Metadata Service access disabled", {
          logger: A.logger
        })
      };
      return A.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), Z(A)
    }, "remoteProvider"),
    $vQ = !1,
    uK8 = mdA((A = {}) => (0, Lo.memoize)((0, Lo.chain)(async () => {
      if (A.profile ?? process.env[hK8.ENV_PROFILE]) {
        if (process.env[Mj1.ENV_KEY] && process.env[Mj1.ENV_SECRET]) {
          if (!$vQ)(A.logger?.warn && A.logger?.constructor?.name !== "NoOpLogger" ? A.logger.warn : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), $vQ = !0
        }
        throw new Lo.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
          logger: A.logger,
          tryNextLink: !0
        })
      }
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), (0, Mj1.fromEnv)(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
      let {
        ssoStartUrl: Q,
        ssoAccountId: B,
        ssoRegion: G,
        ssoRoleName: Z,
        ssoSession: I
      } = A;
      if (!Q && !B && !G && !Z && !I) throw new Lo.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", {
        logger: A.logger
      });
      let {
        fromSSO: Y
      } = await Promise.resolve().then(() => o6A(PP1()));
      return Y(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
      let {
        fromIni: Q
      } = await Promise.resolve().then(() => o6A(zvQ()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
      let {
        fromProcess: Q
      } = await Promise.resolve().then(() => o6A(zj1()));
      return Q(A)()
    }, async () => {
      A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
      let {
        fromTokenFile: Q
      } = await Promise.resolve().then(() => o6A(qj1()));
      return Q(A)()
    }, async () => {
      return A.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await gK8(A))()
    }, async () => {
      throw new Lo.CredentialsProviderError("Could not load credentials from any providers", {
        tryNextLink: !1,
        logger: A.logger
      })
    }), LvQ, NvQ), "defaultProvider"),
    NvQ = mdA((A) => A?.expiration !== void 0, "credentialsWillNeedRefresh"),
    LvQ = mdA((A) => A?.expiration !== void 0 && A.expiration.getTime() - Date.now() < 300000, "credentialsTreatedAsExpired")
})
// @from(Start 3903657, End 3908510)
mvQ = z((gvQ) => {
  Object.defineProperty(gvQ, "__esModule", {
    value: !0
  });
  gvQ.ruleSet = void 0;
  var bvQ = "required",
    aS = "fn",
    sS = "argv",
    e6A = "ref",
    RvQ = !0,
    TvQ = "isSet",
    hCA = "booleanEquals",
    t6A = "error",
    fCA = "endpoint",
    rC = "tree",
    Oj1 = "PartitionResult",
    PvQ = {
      [bvQ]: !1,
      type: "String"
    },
    jvQ = {
      [bvQ]: !0,
      default: !1,
      type: "Boolean"
    },
    SvQ = {
      [e6A]: "Endpoint"
    },
    fvQ = {
      [aS]: hCA,
      [sS]: [{
        [e6A]: "UseFIPS"
      }, !0]
    },
    hvQ = {
      [aS]: hCA,
      [sS]: [{
        [e6A]: "UseDualStack"
      }, !0]
    },
    nS = {},
    _vQ = {
      [aS]: "getAttr",
      [sS]: [{
        [e6A]: Oj1
      }, "supportsFIPS"]
    },
    kvQ = {
      [aS]: hCA,
      [sS]: [!0, {
        [aS]: "getAttr",
        [sS]: [{
          [e6A]: Oj1
        }, "supportsDualStack"]
      }]
    },
    yvQ = [fvQ],
    xvQ = [hvQ],
    vvQ = [{
      [e6A]: "Region"
    }],
    mK8 = {
      version: "1.0",
      parameters: {
        Region: PvQ,
        UseDualStack: jvQ,
        UseFIPS: jvQ,
        Endpoint: PvQ
      },
      rules: [{
        conditions: [{
          [aS]: TvQ,
          [sS]: [SvQ]
        }],
        rules: [{
          conditions: yvQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: t6A
        }, {
          rules: [{
            conditions: xvQ,
            error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
            type: t6A
          }, {
            endpoint: {
              url: SvQ,
              properties: nS,
              headers: nS
            },
            type: fCA
          }],
          type: rC
        }],
        type: rC
      }, {
        rules: [{
          conditions: [{
            [aS]: TvQ,
            [sS]: vvQ
          }],
          rules: [{
            conditions: [{
              [aS]: "aws.partition",
              [sS]: vvQ,
              assign: Oj1
            }],
            rules: [{
              conditions: [fvQ, hvQ],
              rules: [{
                conditions: [{
                  [aS]: hCA,
                  [sS]: [RvQ, _vQ]
                }, kvQ],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: nS,
                      headers: nS
                    },
                    type: fCA
                  }],
                  type: rC
                }],
                type: rC
              }, {
                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                type: t6A
              }],
              type: rC
            }, {
              conditions: yvQ,
              rules: [{
                conditions: [{
                  [aS]: hCA,
                  [sS]: [_vQ, RvQ]
                }],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-fips.{Region}.{PartitionResult#dnsSuffix}",
                      properties: nS,
                      headers: nS
                    },
                    type: fCA
                  }],
                  type: rC
                }],
                type: rC
              }, {
                error: "FIPS is enabled but this partition does not support FIPS",
                type: t6A
              }],
              type: rC
            }, {
              conditions: xvQ,
              rules: [{
                conditions: [kvQ],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: nS,
                      headers: nS
                    },
                    type: fCA
                  }],
                  type: rC
                }],
                type: rC
              }, {
                error: "DualStack is enabled but this partition does not support DualStack",
                type: t6A
              }],
              type: rC
            }, {
              rules: [{
                endpoint: {
                  url: "https://bedrock.{Region}.{PartitionResult#dnsSuffix}",
                  properties: nS,
                  headers: nS
                },
                type: fCA
              }],
              type: rC
            }],
            type: rC
          }],
          type: rC
        }, {
          error: "Invalid Configuration: Missing Region",
          type: t6A
        }],
        type: rC
      }]
    };
  gvQ.ruleSet = mK8
})
// @from(Start 3908516, End 3909080)
pvQ = z((dvQ) => {
  Object.defineProperty(dvQ, "__esModule", {
    value: !0
  });
  dvQ.defaultEndpointResolver = void 0;
  var dK8 = T6A(),
    Rj1 = FI(),
    cK8 = mvQ(),
    pK8 = new Rj1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    lK8 = (A, Q = {}) => {
      return pK8.get(A, () => (0, Rj1.resolveEndpoint)(cK8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  dvQ.defaultEndpointResolver = lK8;
  Rj1.customEndpointFunctions.aws = dK8.awsEndpointFunctions
})
// @from(Start 3909086, End 3910505)
svQ = z((nvQ) => {
  Object.defineProperty(nvQ, "__esModule", {
    value: !0
  });
  nvQ.getRuntimeConfig = void 0;
  var iK8 = PF(),
    nK8 = iB(),
    aK8 = o6(),
    sK8 = NJ(),
    lvQ = ld(),
    ivQ = O2(),
    rK8 = GP1(),
    oK8 = pvQ(),
    tK8 = (A) => {
      return {
        apiVersion: "2023-04-20",
        base64Decoder: A?.base64Decoder ?? lvQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? lvQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? oK8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? rK8.defaultBedrockHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new iK8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#httpBearerAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#httpBearerAuth"),
          signer: new nK8.HttpBearerAuthSigner
        }],
        logger: A?.logger ?? new aK8.NoOpLogger,
        serviceId: A?.serviceId ?? "Bedrock",
        urlParser: A?.urlParser ?? sK8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? ivQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? ivQ.toUtf8
      }
    };
  nvQ.getRuntimeConfig = tK8
})
// @from(Start 3910511, End 3913656)
BbQ = z((AbQ) => {
  Object.defineProperty(AbQ, "__esModule", {
    value: !0
  });
  AbQ.getRuntimeConfig = void 0;
  var eK8 = Co(),
    AD8 = eK8.__importDefault(YSQ()),
    Tj1 = PF(),
    QD8 = OvQ(),
    rvQ = RP1(),
    ovQ = LCA(),
    ddA = f8(),
    BD8 = iB(),
    GD8 = RX(),
    tvQ = D6(),
    Mo = uI(),
    evQ = IZ(),
    ZD8 = TX(),
    ID8 = KW(),
    YD8 = svQ(),
    JD8 = o6(),
    WD8 = PX(),
    XD8 = o6(),
    VD8 = (A) => {
      (0, XD8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, WD8.resolveDefaultsModeConfig)(A),
        B = () => Q().then(JD8.loadConfigsForDefaultMode),
        G = (0, YD8.getRuntimeConfig)(A);
      (0, Tj1.emitWarningIfUnsupportedVersion)(process.version);
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
        authSchemePreference: A?.authSchemePreference ?? (0, Mo.loadConfig)(Tj1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? ZD8.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? QD8.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, ovQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: AD8.default.version
        }),
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (I) => I.getIdentityProvider("aws.auth#sigv4"),
          signer: new Tj1.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#httpBearerAuth",
          identityProvider: (I) => I.getIdentityProvider("smithy.api#httpBearerAuth") || (async (Y) => {
            try {
              return await (0, rvQ.fromEnvSigningName)({
                signingName: "bedrock"
              })()
            } catch (J) {
              return await (0, rvQ.nodeProvider)(Y)(Y)
            }
          }),
          signer: new BD8.HttpBearerAuthSigner
        }],
        maxAttempts: A?.maxAttempts ?? (0, Mo.loadConfig)(tvQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, Mo.loadConfig)(ddA.NODE_REGION_CONFIG_OPTIONS, {
          ...ddA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: evQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, Mo.loadConfig)({
          ...tvQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || ID8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? GD8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? evQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Mo.loadConfig)(ddA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, Mo.loadConfig)(ddA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, Mo.loadConfig)(ovQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  AbQ.getRuntimeConfig = VD8
})