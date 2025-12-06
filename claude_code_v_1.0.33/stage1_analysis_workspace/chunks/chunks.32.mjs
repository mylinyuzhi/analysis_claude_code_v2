
// @from(Start 2895038, End 2932689)
bJQ = z((eU7, cN1) => {
  var {
    defineProperty: LgA,
    getOwnPropertyDescriptor: Qg4,
    getOwnPropertyNames: Bg4
  } = Object, Gg4 = Object.prototype.hasOwnProperty, XQ = (A, Q) => LgA(A, "name", {
    value: Q,
    configurable: !0
  }), Zg4 = (A, Q) => {
    for (var B in Q) LgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, fN1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Bg4(Q))
        if (!Gg4.call(A, Z) && Z !== B) LgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Qg4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Ig4 = (A, Q, B) => (fN1(A, Q, "default"), B && fN1(B, Q, "default")), Yg4 = (A) => fN1(LgA({}, "__esModule", {
    value: !0
  }), A), gN1 = {};
  Zg4(gN1, {
    AssumeRoleCommand: () => mN1,
    AssumeRoleResponseFilterSensitiveLog: () => FJQ,
    AssumeRoleWithSAMLCommand: () => qJQ,
    AssumeRoleWithSAMLRequestFilterSensitiveLog: () => KJQ,
    AssumeRoleWithSAMLResponseFilterSensitiveLog: () => DJQ,
    AssumeRoleWithWebIdentityCommand: () => dN1,
    AssumeRoleWithWebIdentityRequestFilterSensitiveLog: () => HJQ,
    AssumeRoleWithWebIdentityResponseFilterSensitiveLog: () => CJQ,
    AssumeRootCommand: () => NJQ,
    AssumeRootResponseFilterSensitiveLog: () => EJQ,
    ClientInputEndpointParameters: () => yu4.ClientInputEndpointParameters,
    CredentialsFilterSensitiveLog: () => ar,
    DecodeAuthorizationMessageCommand: () => LJQ,
    ExpiredTokenException: () => GJQ,
    GetAccessKeyInfoCommand: () => MJQ,
    GetCallerIdentityCommand: () => OJQ,
    GetFederationTokenCommand: () => RJQ,
    GetFederationTokenResponseFilterSensitiveLog: () => zJQ,
    GetSessionTokenCommand: () => TJQ,
    GetSessionTokenResponseFilterSensitiveLog: () => UJQ,
    IDPCommunicationErrorException: () => XJQ,
    IDPRejectedClaimException: () => JJQ,
    InvalidAuthorizationMessageException: () => VJQ,
    InvalidIdentityTokenException: () => WJQ,
    MalformedPolicyDocumentException: () => ZJQ,
    PackedPolicyTooLargeException: () => IJQ,
    RegionDisabledException: () => YJQ,
    STS: () => PJQ,
    STSServiceException: () => PS,
    decorateDefaultCredentialProvider: () => bu4,
    getDefaultRoleAssumer: () => xJQ,
    getDefaultRoleAssumerWithWebIdentity: () => vJQ
  });
  cN1.exports = Yg4(gN1);
  Ig4(gN1, WHA(), cN1.exports);
  var vv = q5(),
    bv = GZ(),
    Jg4 = IL(),
    P2 = K6(),
    PS = class A extends P2.ServiceException {
      static {
        XQ(this, "STSServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    GJQ = class A extends PS {
      static {
        XQ(this, "ExpiredTokenException")
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
    ZJQ = class A extends PS {
      static {
        XQ(this, "MalformedPolicyDocumentException")
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
    IJQ = class A extends PS {
      static {
        XQ(this, "PackedPolicyTooLargeException")
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
    YJQ = class A extends PS {
      static {
        XQ(this, "RegionDisabledException")
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
    JJQ = class A extends PS {
      static {
        XQ(this, "IDPRejectedClaimException")
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
    WJQ = class A extends PS {
      static {
        XQ(this, "InvalidIdentityTokenException")
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
    XJQ = class A extends PS {
      static {
        XQ(this, "IDPCommunicationErrorException")
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
    VJQ = class A extends PS {
      static {
        XQ(this, "InvalidAuthorizationMessageException")
      }
      name = "InvalidAuthorizationMessageException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidAuthorizationMessageException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ar = XQ((A) => ({
      ...A,
      ...A.SecretAccessKey && {
        SecretAccessKey: P2.SENSITIVE_STRING
      }
    }), "CredentialsFilterSensitiveLog"),
    FJQ = XQ((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ar(A.Credentials)
      }
    }), "AssumeRoleResponseFilterSensitiveLog"),
    KJQ = XQ((A) => ({
      ...A,
      ...A.SAMLAssertion && {
        SAMLAssertion: P2.SENSITIVE_STRING
      }
    }), "AssumeRoleWithSAMLRequestFilterSensitiveLog"),
    DJQ = XQ((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ar(A.Credentials)
      }
    }), "AssumeRoleWithSAMLResponseFilterSensitiveLog"),
    HJQ = XQ((A) => ({
      ...A,
      ...A.WebIdentityToken && {
        WebIdentityToken: P2.SENSITIVE_STRING
      }
    }), "AssumeRoleWithWebIdentityRequestFilterSensitiveLog"),
    CJQ = XQ((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ar(A.Credentials)
      }
    }), "AssumeRoleWithWebIdentityResponseFilterSensitiveLog"),
    EJQ = XQ((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ar(A.Credentials)
      }
    }), "AssumeRootResponseFilterSensitiveLog"),
    zJQ = XQ((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ar(A.Credentials)
      }
    }), "GetFederationTokenResponseFilterSensitiveLog"),
    UJQ = XQ((A) => ({
      ...A,
      ...A.Credentials && {
        Credentials: ar(A.Credentials)
      }
    }), "GetSessionTokenResponseFilterSensitiveLog"),
    jS = MF(),
    Wg4 = nC(),
    Xg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...vg4(A, Q),
        [mv]: Du4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_AssumeRoleCommand"),
    Vg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...bg4(A, Q),
        [mv]: Hu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithSAMLCommand"),
    Fg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...fg4(A, Q),
        [mv]: Cu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_AssumeRoleWithWebIdentityCommand"),
    Kg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...hg4(A, Q),
        [mv]: Eu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_AssumeRootCommand"),
    Dg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...gg4(A, Q),
        [mv]: zu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_DecodeAuthorizationMessageCommand"),
    Hg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...ug4(A, Q),
        [mv]: Uu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_GetAccessKeyInfoCommand"),
    Cg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...mg4(A, Q),
        [mv]: $u4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_GetCallerIdentityCommand"),
    Eg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...dg4(A, Q),
        [mv]: wu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_GetFederationTokenCommand"),
    zg4 = XQ(async (A, Q) => {
      let B = gv,
        G;
      return G = cv({
        ...cg4(A, Q),
        [mv]: qu4,
        [dv]: uv
      }), hv(Q, B, "/", void 0, G)
    }, "se_GetSessionTokenCommand"),
    Ug4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = ag4(B.AssumeRoleResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_AssumeRoleCommand"),
    $g4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = sg4(B.AssumeRoleWithSAMLResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_AssumeRoleWithSAMLCommand"),
    wg4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = rg4(B.AssumeRoleWithWebIdentityResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_AssumeRoleWithWebIdentityCommand"),
    qg4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = og4(B.AssumeRootResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_AssumeRootCommand"),
    Ng4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = tg4(B.DecodeAuthorizationMessageResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_DecodeAuthorizationMessageCommand"),
    Lg4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = Qu4(B.GetAccessKeyInfoResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_GetAccessKeyInfoCommand"),
    Mg4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = Bu4(B.GetCallerIdentityResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_GetCallerIdentityCommand"),
    Og4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = Gu4(B.GetFederationTokenResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_GetFederationTokenCommand"),
    Rg4 = XQ(async (A, Q) => {
      if (A.statusCode >= 300) return fv(A, Q);
      let B = await (0, jS.parseXmlBody)(A.body, Q),
        G = {};
      return G = Zu4(B.GetSessionTokenResult, Q), {
        $metadata: GD(A),
        ...G
      }
    }, "de_GetSessionTokenCommand"),
    fv = XQ(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, jS.parseXmlErrorBody)(A.body, Q)
        },
        G = Nu4(A, B.body);
      switch (G) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await Tg4(B, Q);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await kg4(B, Q);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await yg4(B, Q);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await xg4(B, Q);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await jg4(B, Q);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await _g4(B, Q);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await Pg4(B, Q);
        case "InvalidAuthorizationMessageException":
        case "com.amazonaws.sts#InvalidAuthorizationMessageException":
          throw await Sg4(B, Q);
        default:
          let Z = B.body;
          return Ku4({
            output: A,
            parsedBody: Z.Error,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Tg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = eg4(B.Error, Q),
        Z = new GJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_ExpiredTokenExceptionRes"),
    Pg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Iu4(B.Error, Q),
        Z = new XJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_IDPCommunicationErrorExceptionRes"),
    jg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Yu4(B.Error, Q),
        Z = new JJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_IDPRejectedClaimExceptionRes"),
    Sg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Ju4(B.Error, Q),
        Z = new VJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_InvalidAuthorizationMessageExceptionRes"),
    _g4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Wu4(B.Error, Q),
        Z = new WJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_InvalidIdentityTokenExceptionRes"),
    kg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Xu4(B.Error, Q),
        Z = new ZJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_MalformedPolicyDocumentExceptionRes"),
    yg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Vu4(B.Error, Q),
        Z = new IJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_PackedPolicyTooLargeExceptionRes"),
    xg4 = XQ(async (A, Q) => {
      let B = A.body,
        G = Fu4(B.Error, Q),
        Z = new YJQ({
          $metadata: GD(A),
          ...G
        });
      return (0, P2.decorateServiceException)(Z, B)
    }, "de_RegionDisabledExceptionRes"),
    vg4 = XQ((A, Q) => {
      let B = {};
      if (A[xv] != null) B[xv] = A[xv];
      if (A[L8A] != null) B[L8A] = A[L8A];
      if (A[HL] != null) {
        let G = MgA(A[HL], Q);
        if (A[HL]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[DL] != null) B[DL] = A[DL];
      if (A[RF] != null) B[RF] = A[RF];
      if (A[O8A] != null) {
        let G = wJQ(A[O8A], Q);
        if (A[O8A]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      if (A[kN1] != null) {
        let G = ng4(A[kN1], Q);
        if (A[kN1]?.length === 0) B.TransitiveTagKeys = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TransitiveTagKeys.${Z}`;
          B[Y] = I
        })
      }
      if (A[KN1] != null) B[KN1] = A[KN1];
      if (A[M8A] != null) B[M8A] = A[M8A];
      if (A[R8A] != null) B[R8A] = A[R8A];
      if (A[sC] != null) B[sC] = A[sC];
      if (A[NN1] != null) {
        let G = lg4(A[NN1], Q);
        if (A[NN1]?.length === 0) B.ProvidedContexts = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `ProvidedContexts.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_AssumeRoleRequest"),
    bg4 = XQ((A, Q) => {
      let B = {};
      if (A[xv] != null) B[xv] = A[xv];
      if (A[wN1] != null) B[wN1] = A[wN1];
      if (A[TN1] != null) B[TN1] = A[TN1];
      if (A[HL] != null) {
        let G = MgA(A[HL], Q);
        if (A[HL]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[DL] != null) B[DL] = A[DL];
      if (A[RF] != null) B[RF] = A[RF];
      return B
    }, "se_AssumeRoleWithSAMLRequest"),
    fg4 = XQ((A, Q) => {
      let B = {};
      if (A[xv] != null) B[xv] = A[xv];
      if (A[L8A] != null) B[L8A] = A[L8A];
      if (A[vN1] != null) B[vN1] = A[vN1];
      if (A[LN1] != null) B[LN1] = A[LN1];
      if (A[HL] != null) {
        let G = MgA(A[HL], Q);
        if (A[HL]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[DL] != null) B[DL] = A[DL];
      if (A[RF] != null) B[RF] = A[RF];
      return B
    }, "se_AssumeRoleWithWebIdentityRequest"),
    hg4 = XQ((A, Q) => {
      let B = {};
      if (A[_N1] != null) B[_N1] = A[_N1];
      if (A[QJQ] != null) {
        let G = $JQ(A[QJQ], Q);
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `TaskPolicyArn.${Z}`;
          B[Y] = I
        })
      }
      if (A[RF] != null) B[RF] = A[RF];
      return B
    }, "se_AssumeRootRequest"),
    gg4 = XQ((A, Q) => {
      let B = {};
      if (A[DN1] != null) B[DN1] = A[DN1];
      return B
    }, "se_DecodeAuthorizationMessageRequest"),
    ug4 = XQ((A, Q) => {
      let B = {};
      if (A[w8A] != null) B[w8A] = A[w8A];
      return B
    }, "se_GetAccessKeyInfoRequest"),
    mg4 = XQ((A, Q) => {
      return {}
    }, "se_GetCallerIdentityRequest"),
    dg4 = XQ((A, Q) => {
      let B = {};
      if (A[UN1] != null) B[UN1] = A[UN1];
      if (A[DL] != null) B[DL] = A[DL];
      if (A[HL] != null) {
        let G = MgA(A[HL], Q);
        if (A[HL]?.length === 0) B.PolicyArns = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `PolicyArns.${Z}`;
          B[Y] = I
        })
      }
      if (A[RF] != null) B[RF] = A[RF];
      if (A[O8A] != null) {
        let G = wJQ(A[O8A], Q);
        if (A[O8A]?.length === 0) B.Tags = [];
        Object.entries(G).forEach(([Z, I]) => {
          let Y = `Tags.${Z}`;
          B[Y] = I
        })
      }
      return B
    }, "se_GetFederationTokenRequest"),
    cg4 = XQ((A, Q) => {
      let B = {};
      if (A[RF] != null) B[RF] = A[RF];
      if (A[M8A] != null) B[M8A] = A[M8A];
      if (A[R8A] != null) B[R8A] = A[R8A];
      return B
    }, "se_GetSessionTokenRequest"),
    MgA = XQ((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = $JQ(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_policyDescriptorListType"),
    $JQ = XQ((A, Q) => {
      let B = {};
      if (A[bN1] != null) B[bN1] = A[bN1];
      return B
    }, "se_PolicyDescriptorType"),
    pg4 = XQ((A, Q) => {
      let B = {};
      if (A[qN1] != null) B[qN1] = A[qN1];
      if (A[XN1] != null) B[XN1] = A[XN1];
      return B
    }, "se_ProvidedContext"),
    lg4 = XQ((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = pg4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_ProvidedContextsListType"),
    ig4 = XQ((A, Q) => {
      let B = {};
      if (A[zN1] != null) B[zN1] = A[zN1];
      if (A[xN1] != null) B[xN1] = A[xN1];
      return B
    }, "se_Tag"),
    ng4 = XQ((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        B[`member.${G}`] = Z, G++
      }
      return B
    }, "se_tagKeyListType"),
    wJQ = XQ((A, Q) => {
      let B = {},
        G = 1;
      for (let Z of A) {
        if (Z === null) continue;
        let I = ig4(Z, Q);
        Object.entries(I).forEach(([Y, J]) => {
          B[`member.${G}.${Y}`] = J
        }), G++
      }
      return B
    }, "se_tagListType"),
    uN1 = XQ((A, Q) => {
      let B = {};
      if (A[WN1] != null) B[WN1] = (0, P2.expectString)(A[WN1]);
      if (A[yv] != null) B[yv] = (0, P2.expectString)(A[yv]);
      return B
    }, "de_AssumedRoleUser"),
    ag4 = XQ((A, Q) => {
      let B = {};
      if (A[OF] != null) B[OF] = T8A(A[OF], Q);
      if (A[kv] != null) B[kv] = uN1(A[kv], Q);
      if (A[CL] != null) B[CL] = (0, P2.strictParseInt32)(A[CL]);
      if (A[sC] != null) B[sC] = (0, P2.expectString)(A[sC]);
      return B
    }, "de_AssumeRoleResponse"),
    sg4 = XQ((A, Q) => {
      let B = {};
      if (A[OF] != null) B[OF] = T8A(A[OF], Q);
      if (A[kv] != null) B[kv] = uN1(A[kv], Q);
      if (A[CL] != null) B[CL] = (0, P2.strictParseInt32)(A[CL]);
      if (A[ON1] != null) B[ON1] = (0, P2.expectString)(A[ON1]);
      if (A[jN1] != null) B[jN1] = (0, P2.expectString)(A[jN1]);
      if (A[EN1] != null) B[EN1] = (0, P2.expectString)(A[EN1]);
      if (A[N8A] != null) B[N8A] = (0, P2.expectString)(A[N8A]);
      if (A[$N1] != null) B[$N1] = (0, P2.expectString)(A[$N1]);
      if (A[sC] != null) B[sC] = (0, P2.expectString)(A[sC]);
      return B
    }, "de_AssumeRoleWithSAMLResponse"),
    rg4 = XQ((A, Q) => {
      let B = {};
      if (A[OF] != null) B[OF] = T8A(A[OF], Q);
      if (A[PN1] != null) B[PN1] = (0, P2.expectString)(A[PN1]);
      if (A[kv] != null) B[kv] = uN1(A[kv], Q);
      if (A[CL] != null) B[CL] = (0, P2.strictParseInt32)(A[CL]);
      if (A[MN1] != null) B[MN1] = (0, P2.expectString)(A[MN1]);
      if (A[N8A] != null) B[N8A] = (0, P2.expectString)(A[N8A]);
      if (A[sC] != null) B[sC] = (0, P2.expectString)(A[sC]);
      return B
    }, "de_AssumeRoleWithWebIdentityResponse"),
    og4 = XQ((A, Q) => {
      let B = {};
      if (A[OF] != null) B[OF] = T8A(A[OF], Q);
      if (A[sC] != null) B[sC] = (0, P2.expectString)(A[sC]);
      return B
    }, "de_AssumeRootResponse"),
    T8A = XQ((A, Q) => {
      let B = {};
      if (A[w8A] != null) B[w8A] = (0, P2.expectString)(A[w8A]);
      if (A[RN1] != null) B[RN1] = (0, P2.expectString)(A[RN1]);
      if (A[SN1] != null) B[SN1] = (0, P2.expectString)(A[SN1]);
      if (A[FN1] != null) B[FN1] = (0, P2.expectNonNull)((0, P2.parseRfc3339DateTimeWithOffset)(A[FN1]));
      return B
    }, "de_Credentials"),
    tg4 = XQ((A, Q) => {
      let B = {};
      if (A[VN1] != null) B[VN1] = (0, P2.expectString)(A[VN1]);
      return B
    }, "de_DecodeAuthorizationMessageResponse"),
    eg4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_ExpiredTokenException"),
    Au4 = XQ((A, Q) => {
      let B = {};
      if (A[CN1] != null) B[CN1] = (0, P2.expectString)(A[CN1]);
      if (A[yv] != null) B[yv] = (0, P2.expectString)(A[yv]);
      return B
    }, "de_FederatedUser"),
    Qu4 = XQ((A, Q) => {
      let B = {};
      if (A[q8A] != null) B[q8A] = (0, P2.expectString)(A[q8A]);
      return B
    }, "de_GetAccessKeyInfoResponse"),
    Bu4 = XQ((A, Q) => {
      let B = {};
      if (A[yN1] != null) B[yN1] = (0, P2.expectString)(A[yN1]);
      if (A[q8A] != null) B[q8A] = (0, P2.expectString)(A[q8A]);
      if (A[yv] != null) B[yv] = (0, P2.expectString)(A[yv]);
      return B
    }, "de_GetCallerIdentityResponse"),
    Gu4 = XQ((A, Q) => {
      let B = {};
      if (A[OF] != null) B[OF] = T8A(A[OF], Q);
      if (A[HN1] != null) B[HN1] = Au4(A[HN1], Q);
      if (A[CL] != null) B[CL] = (0, P2.strictParseInt32)(A[CL]);
      return B
    }, "de_GetFederationTokenResponse"),
    Zu4 = XQ((A, Q) => {
      let B = {};
      if (A[OF] != null) B[OF] = T8A(A[OF], Q);
      return B
    }, "de_GetSessionTokenResponse"),
    Iu4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_IDPCommunicationErrorException"),
    Yu4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_IDPRejectedClaimException"),
    Ju4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_InvalidAuthorizationMessageException"),
    Wu4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_InvalidIdentityTokenException"),
    Xu4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_MalformedPolicyDocumentException"),
    Vu4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_PackedPolicyTooLargeException"),
    Fu4 = XQ((A, Q) => {
      let B = {};
      if (A[cI] != null) B[cI] = (0, P2.expectString)(A[cI]);
      return B
    }, "de_RegionDisabledException"),
    GD = XQ((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    Ku4 = (0, P2.withBaseException)(PS),
    hv = XQ(async (A, Q, B, G, Z) => {
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
      return new Wg4.HttpRequest(X)
    }, "buildHttpRpcRequest"),
    gv = {
      "content-type": "application/x-www-form-urlencoded"
    },
    uv = "2011-06-15",
    mv = "Action",
    w8A = "AccessKeyId",
    Du4 = "AssumeRole",
    WN1 = "AssumedRoleId",
    kv = "AssumedRoleUser",
    Hu4 = "AssumeRoleWithSAML",
    Cu4 = "AssumeRoleWithWebIdentity",
    Eu4 = "AssumeRoot",
    q8A = "Account",
    yv = "Arn",
    N8A = "Audience",
    OF = "Credentials",
    XN1 = "ContextAssertion",
    zu4 = "DecodeAuthorizationMessage",
    VN1 = "DecodedMessage",
    RF = "DurationSeconds",
    FN1 = "Expiration",
    KN1 = "ExternalId",
    DN1 = "EncodedMessage",
    HN1 = "FederatedUser",
    CN1 = "FederatedUserId",
    Uu4 = "GetAccessKeyInfo",
    $u4 = "GetCallerIdentity",
    wu4 = "GetFederationToken",
    qu4 = "GetSessionToken",
    EN1 = "Issuer",
    zN1 = "Key",
    UN1 = "Name",
    $N1 = "NameQualifier",
    DL = "Policy",
    HL = "PolicyArns",
    wN1 = "PrincipalArn",
    qN1 = "ProviderArn",
    NN1 = "ProvidedContexts",
    LN1 = "ProviderId",
    CL = "PackedPolicySize",
    MN1 = "Provider",
    xv = "RoleArn",
    L8A = "RoleSessionName",
    ON1 = "Subject",
    RN1 = "SecretAccessKey",
    TN1 = "SAMLAssertion",
    PN1 = "SubjectFromWebIdentityToken",
    sC = "SourceIdentity",
    M8A = "SerialNumber",
    jN1 = "SubjectType",
    SN1 = "SessionToken",
    O8A = "Tags",
    R8A = "TokenCode",
    _N1 = "TargetPrincipal",
    QJQ = "TaskPolicyArn",
    kN1 = "TransitiveTagKeys",
    yN1 = "UserId",
    dv = "Version",
    xN1 = "Value",
    vN1 = "WebIdentityToken",
    bN1 = "arn",
    cI = "message",
    cv = XQ((A) => Object.entries(A).map(([Q, B]) => (0, P2.extendedEncodeURIComponent)(Q) + "=" + (0, P2.extendedEncodeURIComponent)(B)).join("&"), "buildFormUrlencodedString"),
    Nu4 = XQ((A, Q) => {
      if (Q.Error?.Code !== void 0) return Q.Error.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadQueryErrorCode"),
    mN1 = class extends P2.Command.classBuilder().ep(Jg4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").f(void 0, FJQ).ser(Xg4).de(Ug4).build() {
      static {
        XQ(this, "AssumeRoleCommand")
      }
    },
    Lu4 = IL(),
    qJQ = class extends P2.Command.classBuilder().ep(Lu4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithSAML", {}).n("STSClient", "AssumeRoleWithSAMLCommand").f(KJQ, DJQ).ser(Vg4).de($g4).build() {
      static {
        XQ(this, "AssumeRoleWithSAMLCommand")
      }
    },
    Mu4 = IL(),
    dN1 = class extends P2.Command.classBuilder().ep(Mu4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").f(HJQ, CJQ).ser(Fg4).de(wg4).build() {
      static {
        XQ(this, "AssumeRoleWithWebIdentityCommand")
      }
    },
    Ou4 = IL(),
    NJQ = class extends P2.Command.classBuilder().ep(Ou4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "AssumeRoot", {}).n("STSClient", "AssumeRootCommand").f(void 0, EJQ).ser(Kg4).de(qg4).build() {
      static {
        XQ(this, "AssumeRootCommand")
      }
    },
    Ru4 = IL(),
    LJQ = class extends P2.Command.classBuilder().ep(Ru4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "DecodeAuthorizationMessage", {}).n("STSClient", "DecodeAuthorizationMessageCommand").f(void 0, void 0).ser(Dg4).de(Ng4).build() {
      static {
        XQ(this, "DecodeAuthorizationMessageCommand")
      }
    },
    Tu4 = IL(),
    MJQ = class extends P2.Command.classBuilder().ep(Tu4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetAccessKeyInfo", {}).n("STSClient", "GetAccessKeyInfoCommand").f(void 0, void 0).ser(Hg4).de(Lg4).build() {
      static {
        XQ(this, "GetAccessKeyInfoCommand")
      }
    },
    Pu4 = IL(),
    OJQ = class extends P2.Command.classBuilder().ep(Pu4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetCallerIdentity", {}).n("STSClient", "GetCallerIdentityCommand").f(void 0, void 0).ser(Cg4).de(Mg4).build() {
      static {
        XQ(this, "GetCallerIdentityCommand")
      }
    },
    ju4 = IL(),
    RJQ = class extends P2.Command.classBuilder().ep(ju4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetFederationToken", {}).n("STSClient", "GetFederationTokenCommand").f(void 0, zJQ).ser(Eg4).de(Og4).build() {
      static {
        XQ(this, "GetFederationTokenCommand")
      }
    },
    Su4 = IL(),
    TJQ = class extends P2.Command.classBuilder().ep(Su4.commonParams).m(function(A, Q, B, G) {
      return [(0, bv.getSerdePlugin)(B, this.serialize, this.deserialize), (0, vv.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSecurityTokenServiceV20110615", "GetSessionToken", {}).n("STSClient", "GetSessionTokenCommand").f(void 0, UJQ).ser(zg4).de(Rg4).build() {
      static {
        XQ(this, "GetSessionTokenCommand")
      }
    },
    _u4 = WHA(),
    ku4 = {
      AssumeRoleCommand: mN1,
      AssumeRoleWithSAMLCommand: qJQ,
      AssumeRoleWithWebIdentityCommand: dN1,
      AssumeRootCommand: NJQ,
      DecodeAuthorizationMessageCommand: LJQ,
      GetAccessKeyInfoCommand: MJQ,
      GetCallerIdentityCommand: OJQ,
      GetFederationTokenCommand: RJQ,
      GetSessionTokenCommand: TJQ
    },
    PJQ = class extends _u4.STSClient {
      static {
        XQ(this, "STS")
      }
    };
  (0, P2.createAggregatedClient)(ku4, PJQ);
  var yu4 = IL(),
    hN1 = QL(),
    BJQ = "us-east-1",
    jJQ = XQ((A) => {
      if (typeof A?.Arn === "string") {
        let Q = A.Arn.split(":");
        if (Q.length > 4 && Q[4] !== "") return Q[4]
      }
      return
    }, "getAccountIdFromAssumedRoleUser"),
    SJQ = XQ(async (A, Q, B) => {
      let G = typeof A === "function" ? await A() : A,
        Z = typeof Q === "function" ? await Q() : Q;
      return B?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${G} (provider)`, `${Z} (parent client)`, `${BJQ} (STS default)`), G ?? Z ?? BJQ
    }, "resolveRegion"),
    xu4 = XQ((A, Q) => {
      let B, G;
      return async (Z, I) => {
        if (G = Z, !B) {
          let {
            logger: V = A?.parentClientConfig?.logger,
            region: F,
            requestHandler: K = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: D
          } = A, H = await SJQ(F, A?.parentClientConfig?.region, D), C = !_JQ(K);
          B = new Q({
            profile: A?.parentClientConfig?.profile,
            credentialDefaultProvider: XQ(() => async () => G, "credentialDefaultProvider"),
            region: H,
            requestHandler: C ? K : void 0,
            logger: V
          })
        }
        let {
          Credentials: Y,
          AssumedRoleUser: J
        } = await B.send(new mN1(I));
        if (!Y || !Y.AccessKeyId || !Y.SecretAccessKey) throw Error(`Invalid response from STS.assumeRole call with role ${I.RoleArn}`);
        let W = jJQ(J),
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
        return (0, hN1.setCredentialFeature)(X, "CREDENTIALS_STS_ASSUME_ROLE", "i"), X
      }
    }, "getDefaultRoleAssumer"),
    vu4 = XQ((A, Q) => {
      let B;
      return async (G) => {
        if (!B) {
          let {
            logger: W = A?.parentClientConfig?.logger,
            region: X,
            requestHandler: V = A?.parentClientConfig?.requestHandler,
            credentialProviderLogger: F
          } = A, K = await SJQ(X, A?.parentClientConfig?.region, F), D = !_JQ(V);
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
        } = await B.send(new dN1(G));
        if (!Z || !Z.AccessKeyId || !Z.SecretAccessKey) throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${G.RoleArn}`);
        let Y = jJQ(I),
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
        if (Y)(0, hN1.setCredentialFeature)(J, "RESOLVED_ACCOUNT_ID", "T");
        return (0, hN1.setCredentialFeature)(J, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), J
      }
    }, "getDefaultRoleAssumerWithWebIdentity"),
    _JQ = XQ((A) => {
      return A?.metadata?.handlerProtocol === "h2"
    }, "isH2"),
    kJQ = WHA(),
    yJQ = XQ((A, Q) => {
      if (!Q) return A;
      else return class extends A {
        static {
          XQ(this, "CustomizableSTSClient")
        }
        constructor(G) {
          super(G);
          for (let Z of Q) this.middlewareStack.use(Z)
        }
      }
    }, "getCustomizableStsClientCtor"),
    xJQ = XQ((A = {}, Q) => xu4(A, yJQ(kJQ.STSClient, Q)), "getDefaultRoleAssumer"),
    vJQ = XQ((A = {}, Q) => vu4(A, yJQ(kJQ.STSClient, Q)), "getDefaultRoleAssumerWithWebIdentity"),
    bu4 = XQ((A) => (Q) => A({
      roleAssumer: xJQ(Q),
      roleAssumerWithWebIdentity: vJQ(Q),
      ...Q
    }), "decorateDefaultCredentialProvider")
})
// @from(Start 2932695, End 2949950)
sr = z((V$7, TgA) => {
  var fJQ, hJQ, gJQ, uJQ, mJQ, dJQ, cJQ, pJQ, lJQ, iJQ, nJQ, aJQ, sJQ, OgA, pN1, rJQ, oJQ, tJQ, P8A, eJQ, AWQ, QWQ, BWQ, GWQ, ZWQ, IWQ, YWQ, JWQ, RgA, WWQ, XWQ, VWQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof TgA === "object" && typeof V$7 === "object") A(B(Q, B(V$7)));
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
    instanceof Array && function(I, Y) {
      I.__proto__ = Y
    } || function(I, Y) {
      for (var J in Y)
        if (Object.prototype.hasOwnProperty.call(Y, J)) I[J] = Y[J]
    };
    fJQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, hJQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, gJQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, uJQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, mJQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, dJQ = function(I, Y, J, W, X, V) {
      function F(T) {
        if (T !== void 0 && typeof T !== "function") throw TypeError("Function expected");
        return T
      }
      var K = W.kind,
        D = K === "getter" ? "get" : K === "setter" ? "set" : "value",
        H = !Y && I ? W.static ? I : I.prototype : null,
        C = Y || (H ? Object.getOwnPropertyDescriptor(H, W.name) : {}),
        E, U = !1;
      for (var q = J.length - 1; q >= 0; q--) {
        var w = {};
        for (var N in W) w[N] = N === "access" ? {} : W[N];
        for (var N in W.access) w.access[N] = W.access[N];
        w.addInitializer = function(T) {
          if (U) throw TypeError("Cannot add initializers after decoration has completed");
          V.push(F(T || null))
        };
        var R = (0, J[q])(K === "accessor" ? {
          get: C.get,
          set: C.set
        } : C[D], w);
        if (K === "accessor") {
          if (R === void 0) continue;
          if (R === null || typeof R !== "object") throw TypeError("Object expected");
          if (E = F(R.get)) C.get = E;
          if (E = F(R.set)) C.set = E;
          if (E = F(R.init)) X.unshift(E)
        } else if (E = F(R))
          if (K === "field") X.unshift(E);
          else C[D] = E
      }
      if (H) Object.defineProperty(H, W.name, C);
      U = !0
    }, cJQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, pJQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, lJQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, iJQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, nJQ = function(I, Y, J, W) {
      function X(V) {
        return V instanceof J ? V : new J(function(F) {
          F(V)
        })
      }
      return new(J || (J = Promise))(function(V, F) {
        function K(C) {
          try {
            H(W.next(C))
          } catch (E) {
            F(E)
          }
        }

        function D(C) {
          try {
            H(W.throw(C))
          } catch (E) {
            F(E)
          }
        }

        function H(C) {
          C.done ? V(C.value) : X(C.value).then(K, D)
        }
        H((W = W.apply(I, Y || [])).next())
      })
    }, aJQ = function(I, Y) {
      var J = {
          label: 0,
          sent: function() {
            if (V[0] & 1) throw V[1];
            return V[1]
          },
          trys: [],
          ops: []
        },
        W, X, V, F = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return F.next = K(0), F.throw = K(1), F.return = K(2), typeof Symbol === "function" && (F[Symbol.iterator] = function() {
        return this
      }), F;

      function K(H) {
        return function(C) {
          return D([H, C])
        }
      }

      function D(H) {
        if (W) throw TypeError("Generator is already executing.");
        while (F && (F = 0, H[0] && (J = 0)), J) try {
          if (W = 1, X && (V = H[0] & 2 ? X.return : H[0] ? X.throw || ((V = X.return) && V.call(X), 0) : X.next) && !(V = V.call(X, H[1])).done) return V;
          if (X = 0, V) H = [H[0] & 2, V.value];
          switch (H[0]) {
            case 0:
            case 1:
              V = H;
              break;
            case 4:
              return J.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              J.label++, X = H[1], H = [0];
              continue;
            case 7:
              H = J.ops.pop(), J.trys.pop();
              continue;
            default:
              if ((V = J.trys, !(V = V.length > 0 && V[V.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                J = 0;
                continue
              }
              if (H[0] === 3 && (!V || H[1] > V[0] && H[1] < V[3])) {
                J.label = H[1];
                break
              }
              if (H[0] === 6 && J.label < V[1]) {
                J.label = V[1], V = H;
                break
              }
              if (V && J.label < V[2]) {
                J.label = V[2], J.ops.push(H);
                break
              }
              if (V[2]) J.ops.pop();
              J.trys.pop();
              continue
          }
          H = Y.call(I, J)
        } catch (C) {
          H = [6, C], X = 0
        } finally {
          W = V = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, sJQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) RgA(Y, I, J)
    }, RgA = Object.create ? function(I, Y, J, W) {
      if (W === void 0) W = J;
      var X = Object.getOwnPropertyDescriptor(Y, J);
      if (!X || ("get" in X ? !Y.__esModule : X.writable || X.configurable)) X = {
        enumerable: !0,
        get: function() {
          return Y[J]
        }
      };
      Object.defineProperty(I, W, X)
    } : function(I, Y, J, W) {
      if (W === void 0) W = J;
      I[W] = Y[J]
    }, OgA = function(I) {
      var Y = typeof Symbol === "function" && Symbol.iterator,
        J = Y && I[Y],
        W = 0;
      if (J) return J.call(I);
      if (I && typeof I.length === "number") return {
        next: function() {
          if (I && W >= I.length) I = void 0;
          return {
            value: I && I[W++],
            done: !I
          }
        }
      };
      throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, pN1 = function(I, Y) {
      var J = typeof Symbol === "function" && I[Symbol.iterator];
      if (!J) return I;
      var W = J.call(I),
        X, V = [],
        F;
      try {
        while ((Y === void 0 || Y-- > 0) && !(X = W.next()).done) V.push(X.value)
      } catch (K) {
        F = {
          error: K
        }
      } finally {
        try {
          if (X && !X.done && (J = W.return)) J.call(W)
        } finally {
          if (F) throw F.error
        }
      }
      return V
    }, rJQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(pN1(arguments[Y]));
      return I
    }, oJQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, tJQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, P8A = function(I) {
      return this instanceof P8A ? (this.v = I, this) : new P8A(I)
    }, eJQ = function(I, Y, J) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var W = J.apply(I, Y || []),
        X, V = [];
      return X = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), K("next"), K("throw"), K("return", F), X[Symbol.asyncIterator] = function() {
        return this
      }, X;

      function F(q) {
        return function(w) {
          return Promise.resolve(w).then(q, E)
        }
      }

      function K(q, w) {
        if (W[q]) {
          if (X[q] = function(N) {
              return new Promise(function(R, T) {
                V.push([q, N, R, T]) > 1 || D(q, N)
              })
            }, w) X[q] = w(X[q])
        }
      }

      function D(q, w) {
        try {
          H(W[q](w))
        } catch (N) {
          U(V[0][3], N)
        }
      }

      function H(q) {
        q.value instanceof P8A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
      }

      function C(q) {
        D("next", q)
      }

      function E(q) {
        D("throw", q)
      }

      function U(q, w) {
        if (q(w), V.shift(), V.length) D(V[0][0], V[0][1])
      }
    }, AWQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: P8A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, QWQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof OgA === "function" ? OgA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
        return this
      }, J);

      function W(V) {
        J[V] = I[V] && function(F) {
          return new Promise(function(K, D) {
            F = I[V](F), X(K, D, F.done, F.value)
          })
        }
      }

      function X(V, F, K, D) {
        Promise.resolve(D).then(function(H) {
          V({
            value: H,
            done: K
          })
        }, F)
      }
    }, BWQ = function(I, Y) {
      if (Object.defineProperty) Object.defineProperty(I, "raw", {
        value: Y
      });
      else I.raw = Y;
      return I
    };
    var B = Object.create ? function(I, Y) {
        Object.defineProperty(I, "default", {
          enumerable: !0,
          value: Y
        })
      } : function(I, Y) {
        I.default = Y
      },
      G = function(I) {
        return G = Object.getOwnPropertyNames || function(Y) {
          var J = [];
          for (var W in Y)
            if (Object.prototype.hasOwnProperty.call(Y, W)) J[J.length] = W;
          return J
        }, G(I)
      };
    GWQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") RgA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, ZWQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, IWQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, YWQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, JWQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, WWQ = function(I, Y, J) {
      if (Y !== null && Y !== void 0) {
        if (typeof Y !== "object" && typeof Y !== "function") throw TypeError("Object expected.");
        var W, X;
        if (J) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          W = Y[Symbol.asyncDispose]
        }
        if (W === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (W = Y[Symbol.dispose], J) X = W
        }
        if (typeof W !== "function") throw TypeError("Object not disposable.");
        if (X) W = function() {
          try {
            X.call(this)
          } catch (V) {
            return Promise.reject(V)
          }
        };
        I.stack.push({
          value: Y,
          dispose: W,
          async: J
        })
      } else if (J) I.stack.push({
        async: !0
      });
      return Y
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function(I, Y, J) {
      var W = Error(J);
      return W.name = "SuppressedError", W.error = I, W.suppressed = Y, W
    };
    XWQ = function(I) {
      function Y(V) {
        I.error = I.hasError ? new Z(V, I.error, "An error was suppressed during disposal.") : V, I.hasError = !0
      }
      var J, W = 0;

      function X() {
        while (J = I.stack.pop()) try {
          if (!J.async && W === 1) return W = 0, I.stack.push(J), Promise.resolve().then(X);
          if (J.dispose) {
            var V = J.dispose.call(J.value);
            if (J.async) return W |= 2, Promise.resolve(V).then(X, function(F) {
              return Y(F), X()
            })
          } else W |= 1
        } catch (F) {
          Y(F)
        }
        if (W === 1) return I.hasError ? Promise.reject(I.error) : Promise.resolve();
        if (I.hasError) throw I.error
      }
      return X()
    }, VWQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", fJQ), A("__assign", hJQ), A("__rest", gJQ), A("__decorate", uJQ), A("__param", mJQ), A("__esDecorate", dJQ), A("__runInitializers", cJQ), A("__propKey", pJQ), A("__setFunctionName", lJQ), A("__metadata", iJQ), A("__awaiter", nJQ), A("__generator", aJQ), A("__exportStar", sJQ), A("__createBinding", RgA), A("__values", OgA), A("__read", pN1), A("__spread", rJQ), A("__spreadArrays", oJQ), A("__spreadArray", tJQ), A("__await", P8A), A("__asyncGenerator", eJQ), A("__asyncDelegator", AWQ), A("__asyncValues", QWQ), A("__makeTemplateObject", BWQ), A("__importStar", GWQ), A("__importDefault", ZWQ), A("__classPrivateFieldGet", IWQ), A("__classPrivateFieldSet", YWQ), A("__classPrivateFieldIn", JWQ), A("__addDisposableResource", WWQ), A("__disposeResources", XWQ), A("__rewriteRelativeImportExtension", VWQ)
  })
})
// @from(Start 2949956, End 2951004)
KWQ = z((FWQ) => {
  Object.defineProperty(FWQ, "__esModule", {
    value: !0
  });
  FWQ.propertyProviderChain = FWQ.createCredentialChain = void 0;
  var fu4 = j2(),
    hu4 = (...A) => {
      let Q = -1,
        G = Object.assign(async (Z) => {
          let I = await FWQ.propertyProviderChain(...A)(Z);
          if (!I.expiration && Q !== -1) I.expiration = new Date(Date.now() + Q);
          return I
        }, {
          expireAfter(Z) {
            if (Z < 300000) throw Error("@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.");
            return Q = Z, G
          }
        });
      return G
    };
  FWQ.createCredentialChain = hu4;
  var gu4 = (...A) => async (Q) => {
    if (A.length === 0) throw new fu4.ProviderError("No providers in chain");
    let B;
    for (let G of A) try {
      return await G(Q)
    } catch (Z) {
      if (B = Z, Z?.tryNextLink) continue;
      throw Z
    }
    throw B
  };
  FWQ.propertyProviderChain = gu4
})
// @from(Start 2951010, End 2953793)
iN1 = z((K$7, qWQ) => {
  var {
    defineProperty: PgA,
    getOwnPropertyDescriptor: mu4,
    getOwnPropertyNames: du4
  } = Object, cu4 = Object.prototype.hasOwnProperty, jgA = (A, Q) => PgA(A, "name", {
    value: Q,
    configurable: !0
  }), pu4 = (A, Q) => {
    for (var B in Q) PgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, lu4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of du4(Q))
        if (!cu4.call(A, Z) && Z !== B) PgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = mu4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, iu4 = (A) => lu4(PgA({}, "__esModule", {
    value: !0
  }), A), DWQ = {};
  pu4(DWQ, {
    AlgorithmId: () => zWQ,
    EndpointURLScheme: () => EWQ,
    FieldPosition: () => UWQ,
    HttpApiKeyAuthLocation: () => CWQ,
    HttpAuthLocation: () => HWQ,
    IniSectionType: () => $WQ,
    RequestHandlerProtocol: () => wWQ,
    SMITHY_CONTEXT_KEY: () => ou4,
    getDefaultClientConfiguration: () => su4,
    resolveDefaultRuntimeConfig: () => ru4
  });
  qWQ.exports = iu4(DWQ);
  var HWQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(HWQ || {}),
    CWQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(CWQ || {}),
    EWQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(EWQ || {}),
    zWQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(zWQ || {}),
    nu4 = jgA((A) => {
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
    au4 = jgA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    su4 = jgA((A) => {
      return nu4(A)
    }, "getDefaultClientConfiguration"),
    ru4 = jgA((A) => {
      return au4(A)
    }, "resolveDefaultRuntimeConfig"),
    UWQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(UWQ || {}),
    ou4 = "__smithy_context",
    $WQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })($WQ || {}),
    wWQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(wWQ || {})
})
// @from(Start 2953799, End 2958305)
iz = z((D$7, RWQ) => {
  var {
    defineProperty: SgA,
    getOwnPropertyDescriptor: tu4,
    getOwnPropertyNames: eu4
  } = Object, Am4 = Object.prototype.hasOwnProperty, Rd = (A, Q) => SgA(A, "name", {
    value: Q,
    configurable: !0
  }), Qm4 = (A, Q) => {
    for (var B in Q) SgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Bm4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of eu4(Q))
        if (!Am4.call(A, Z) && Z !== B) SgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = tu4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Gm4 = (A) => Bm4(SgA({}, "__esModule", {
    value: !0
  }), A), NWQ = {};
  Qm4(NWQ, {
    Field: () => Ym4,
    Fields: () => Jm4,
    HttpRequest: () => Wm4,
    HttpResponse: () => Xm4,
    IHttpRequest: () => LWQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => Zm4,
    isValidHostname: () => OWQ,
    resolveHttpHandlerRuntimeConfig: () => Im4
  });
  RWQ.exports = Gm4(NWQ);
  var Zm4 = Rd((A) => {
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
    Im4 = Rd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    LWQ = iN1(),
    Ym4 = class {
      static {
        Rd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = LWQ.FieldPosition.HEADER,
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
    Jm4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Rd(this, "Fields")
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
    Wm4 = class A {
      static {
        Rd(this, "HttpRequest")
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
        if (B.query) B.query = MWQ(B.query);
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

  function MWQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Rd(MWQ, "cloneQuery");
  var Xm4 = class {
    static {
      Rd(this, "HttpResponse")
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

  function OWQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Rd(OWQ, "isValidHostname")
})
// @from(Start 2958311, End 2960174)
MHA = z((z$7, _WQ) => {
  var {
    defineProperty: kgA,
    getOwnPropertyDescriptor: Vm4,
    getOwnPropertyNames: Fm4
  } = Object, Km4 = Object.prototype.hasOwnProperty, _gA = (A, Q) => kgA(A, "name", {
    value: Q,
    configurable: !0
  }), Dm4 = (A, Q) => {
    for (var B in Q) kgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Hm4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Fm4(Q))
        if (!Km4.call(A, Z) && Z !== B) kgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Vm4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Cm4 = (A) => Hm4(kgA({}, "__esModule", {
    value: !0
  }), A), TWQ = {};
  Dm4(TWQ, {
    getHostHeaderPlugin: () => zm4,
    hostHeaderMiddleware: () => jWQ,
    hostHeaderMiddlewareOptions: () => SWQ,
    resolveHostHeaderConfig: () => PWQ
  });
  _WQ.exports = Cm4(TWQ);
  var Em4 = iz();

  function PWQ(A) {
    return A
  }
  _gA(PWQ, "resolveHostHeaderConfig");
  var jWQ = _gA((A) => (Q) => async (B) => {
      if (!Em4.HttpRequest.isInstance(B.request)) return Q(B);
      let {
        request: G
      } = B, {
        handlerProtocol: Z = ""
      } = A.requestHandler.metadata || {};
      if (Z.indexOf("h2") >= 0 && !G.headers[":authority"]) delete G.headers.host, G.headers[":authority"] = G.hostname + (G.port ? ":" + G.port : "");
      else if (!G.headers.host) {
        let I = G.hostname;
        if (G.port != null) I += `:${G.port}`;
        G.headers.host = I
      }
      return Q(B)
    }, "hostHeaderMiddleware"),
    SWQ = {
      name: "hostHeaderMiddleware",
      step: "build",
      priority: "low",
      tags: ["HOST"],
      override: !0
    },
    zm4 = _gA((A) => ({
      applyToStack: _gA((Q) => {
        Q.add(jWQ(A), SWQ)
      }, "applyToStack")
    }), "getHostHeaderPlugin")
})
// @from(Start 2960180, End 2962480)
OHA = z((U$7, vWQ) => {
  var {
    defineProperty: ygA,
    getOwnPropertyDescriptor: Um4,
    getOwnPropertyNames: $m4
  } = Object, wm4 = Object.prototype.hasOwnProperty, nN1 = (A, Q) => ygA(A, "name", {
    value: Q,
    configurable: !0
  }), qm4 = (A, Q) => {
    for (var B in Q) ygA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Nm4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of $m4(Q))
        if (!wm4.call(A, Z) && Z !== B) ygA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Um4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Lm4 = (A) => Nm4(ygA({}, "__esModule", {
    value: !0
  }), A), kWQ = {};
  qm4(kWQ, {
    getLoggerPlugin: () => Mm4,
    loggerMiddleware: () => yWQ,
    loggerMiddlewareOptions: () => xWQ
  });
  vWQ.exports = Lm4(kWQ);
  var yWQ = nN1(() => (A, Q) => async (B) => {
      try {
        let G = await A(B),
          {
            clientName: Z,
            commandName: I,
            logger: Y,
            dynamoDbDocumentClientOptions: J = {}
          } = Q,
          {
            overrideInputFilterSensitiveLog: W,
            overrideOutputFilterSensitiveLog: X
          } = J,
          V = W ?? Q.inputFilterSensitiveLog,
          F = X ?? Q.outputFilterSensitiveLog,
          {
            $metadata: K,
            ...D
          } = G.output;
        return Y?.info?.({
          clientName: Z,
          commandName: I,
          input: V(B.input),
          output: F(D),
          metadata: K
        }), G
      } catch (G) {
        let {
          clientName: Z,
          commandName: I,
          logger: Y,
          dynamoDbDocumentClientOptions: J = {}
        } = Q, {
          overrideInputFilterSensitiveLog: W
        } = J, X = W ?? Q.inputFilterSensitiveLog;
        throw Y?.error?.({
          clientName: Z,
          commandName: I,
          input: X(B.input),
          error: G,
          metadata: G.$metadata
        }), G
      }
    }, "loggerMiddleware"),
    xWQ = {
      name: "loggerMiddleware",
      tags: ["LOGGER"],
      step: "initialize",
      override: !0
    },
    Mm4 = nN1((A) => ({
      applyToStack: nN1((Q) => {
        Q.add(yWQ(), xWQ)
      }, "applyToStack")
    }), "getLoggerPlugin")
})
// @from(Start 2962486, End 2964418)
RHA = z(($$7, gWQ) => {
  var {
    defineProperty: vgA,
    getOwnPropertyDescriptor: Om4,
    getOwnPropertyNames: Rm4
  } = Object, Tm4 = Object.prototype.hasOwnProperty, xgA = (A, Q) => vgA(A, "name", {
    value: Q,
    configurable: !0
  }), Pm4 = (A, Q) => {
    for (var B in Q) vgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, jm4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Rm4(Q))
        if (!Tm4.call(A, Z) && Z !== B) vgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Om4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Sm4 = (A) => jm4(vgA({}, "__esModule", {
    value: !0
  }), A), bWQ = {};
  Pm4(bWQ, {
    addRecursionDetectionMiddlewareOptions: () => hWQ,
    getRecursionDetectionPlugin: () => xm4,
    recursionDetectionMiddleware: () => fWQ
  });
  gWQ.exports = Sm4(bWQ);
  var _m4 = iz(),
    aN1 = "X-Amzn-Trace-Id",
    km4 = "AWS_LAMBDA_FUNCTION_NAME",
    ym4 = "_X_AMZN_TRACE_ID",
    fWQ = xgA((A) => (Q) => async (B) => {
      let {
        request: G
      } = B;
      if (!_m4.HttpRequest.isInstance(G) || A.runtime !== "node") return Q(B);
      let Z = Object.keys(G.headers ?? {}).find((W) => W.toLowerCase() === aN1.toLowerCase()) ?? aN1;
      if (G.headers.hasOwnProperty(Z)) return Q(B);
      let I = process.env[km4],
        Y = process.env[ym4],
        J = xgA((W) => typeof W === "string" && W.length > 0, "nonEmptyString");
      if (J(I) && J(Y)) G.headers[aN1] = Y;
      return Q({
        ...B,
        request: G
      })
    }, "recursionDetectionMiddleware"),
    hWQ = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: !0,
      priority: "low"
    },
    xm4 = xgA((A) => ({
      applyToStack: xgA((Q) => {
        Q.add(fWQ(A), hWQ)
      }, "applyToStack")
    }), "getRecursionDetectionPlugin")
})
// @from(Start 2964424, End 2975882)
S8A = z((w$7, sWQ) => {
  var {
    defineProperty: bgA,
    getOwnPropertyDescriptor: vm4,
    getOwnPropertyNames: bm4
  } = Object, fm4 = Object.prototype.hasOwnProperty, j8A = (A, Q) => bgA(A, "name", {
    value: Q,
    configurable: !0
  }), hm4 = (A, Q) => {
    for (var B in Q) bgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, gm4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of bm4(Q))
        if (!fm4.call(A, Z) && Z !== B) bgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vm4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, um4 = (A) => gm4(bgA({}, "__esModule", {
    value: !0
  }), A), mWQ = {};
  hm4(mWQ, {
    ConditionObject: () => jZ.ConditionObject,
    DeprecatedObject: () => jZ.DeprecatedObject,
    EndpointError: () => jZ.EndpointError,
    EndpointObject: () => jZ.EndpointObject,
    EndpointObjectHeaders: () => jZ.EndpointObjectHeaders,
    EndpointObjectProperties: () => jZ.EndpointObjectProperties,
    EndpointParams: () => jZ.EndpointParams,
    EndpointResolverOptions: () => jZ.EndpointResolverOptions,
    EndpointRuleObject: () => jZ.EndpointRuleObject,
    ErrorRuleObject: () => jZ.ErrorRuleObject,
    EvaluateOptions: () => jZ.EvaluateOptions,
    Expression: () => jZ.Expression,
    FunctionArgv: () => jZ.FunctionArgv,
    FunctionObject: () => jZ.FunctionObject,
    FunctionReturn: () => jZ.FunctionReturn,
    ParameterObject: () => jZ.ParameterObject,
    ReferenceObject: () => jZ.ReferenceObject,
    ReferenceRecord: () => jZ.ReferenceRecord,
    RuleSetObject: () => jZ.RuleSetObject,
    RuleSetRules: () => jZ.RuleSetRules,
    TreeRuleObject: () => jZ.TreeRuleObject,
    awsEndpointFunctions: () => aWQ,
    getUserAgentPrefix: () => pm4,
    isIpAddress: () => jZ.isIpAddress,
    partition: () => iWQ,
    resolveEndpoint: () => jZ.resolveEndpoint,
    setPartitionInfo: () => nWQ,
    useDefaultPartitionInfo: () => cm4
  });
  sWQ.exports = um4(mWQ);
  var jZ = FI(),
    dWQ = j8A((A, Q = !1) => {
      if (Q) {
        for (let B of A.split("."))
          if (!dWQ(B)) return !1;
        return !0
      }
      if (!(0, jZ.isValidHostLabel)(A)) return !1;
      if (A.length < 3 || A.length > 63) return !1;
      if (A !== A.toLowerCase()) return !1;
      if ((0, jZ.isIpAddress)(A)) return !1;
      return !0
    }, "isVirtualHostableS3Bucket"),
    uWQ = ":",
    mm4 = "/",
    dm4 = j8A((A) => {
      let Q = A.split(uWQ);
      if (Q.length < 6) return null;
      let [B, G, Z, I, Y, ...J] = Q;
      if (B !== "arn" || G === "" || Z === "" || J.join(uWQ) === "") return null;
      let W = J.map((X) => X.split(mm4)).flat();
      return {
        partition: G,
        service: Z,
        region: I,
        accountId: Y,
        resourceId: W
      }
    }, "parseArn"),
    cWQ = {
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
    pWQ = cWQ,
    lWQ = "",
    iWQ = j8A((A) => {
      let {
        partitions: Q
      } = pWQ;
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
    nWQ = j8A((A, Q = "") => {
      pWQ = A, lWQ = Q
    }, "setPartitionInfo"),
    cm4 = j8A(() => {
      nWQ(cWQ, "")
    }, "useDefaultPartitionInfo"),
    pm4 = j8A(() => lWQ, "getUserAgentPrefix"),
    aWQ = {
      isVirtualHostableS3Bucket: dWQ,
      parseArn: dm4,
      partition: iWQ
    };
  jZ.customEndpointFunctions.aws = aWQ
})
// @from(Start 2975888, End 2993143)
rr = z((q$7, ggA) => {
  var rWQ, oWQ, tWQ, eWQ, AXQ, QXQ, BXQ, GXQ, ZXQ, IXQ, YXQ, JXQ, WXQ, fgA, sN1, XXQ, VXQ, FXQ, _8A, KXQ, DXQ, HXQ, CXQ, EXQ, zXQ, UXQ, $XQ, wXQ, hgA, qXQ, NXQ, LXQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof ggA === "object" && typeof q$7 === "object") A(B(Q, B(q$7)));
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
    instanceof Array && function(I, Y) {
      I.__proto__ = Y
    } || function(I, Y) {
      for (var J in Y)
        if (Object.prototype.hasOwnProperty.call(Y, J)) I[J] = Y[J]
    };
    rWQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, oWQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, tWQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, eWQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, AXQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, QXQ = function(I, Y, J, W, X, V) {
      function F(T) {
        if (T !== void 0 && typeof T !== "function") throw TypeError("Function expected");
        return T
      }
      var K = W.kind,
        D = K === "getter" ? "get" : K === "setter" ? "set" : "value",
        H = !Y && I ? W.static ? I : I.prototype : null,
        C = Y || (H ? Object.getOwnPropertyDescriptor(H, W.name) : {}),
        E, U = !1;
      for (var q = J.length - 1; q >= 0; q--) {
        var w = {};
        for (var N in W) w[N] = N === "access" ? {} : W[N];
        for (var N in W.access) w.access[N] = W.access[N];
        w.addInitializer = function(T) {
          if (U) throw TypeError("Cannot add initializers after decoration has completed");
          V.push(F(T || null))
        };
        var R = (0, J[q])(K === "accessor" ? {
          get: C.get,
          set: C.set
        } : C[D], w);
        if (K === "accessor") {
          if (R === void 0) continue;
          if (R === null || typeof R !== "object") throw TypeError("Object expected");
          if (E = F(R.get)) C.get = E;
          if (E = F(R.set)) C.set = E;
          if (E = F(R.init)) X.unshift(E)
        } else if (E = F(R))
          if (K === "field") X.unshift(E);
          else C[D] = E
      }
      if (H) Object.defineProperty(H, W.name, C);
      U = !0
    }, BXQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, GXQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, ZXQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, IXQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, YXQ = function(I, Y, J, W) {
      function X(V) {
        return V instanceof J ? V : new J(function(F) {
          F(V)
        })
      }
      return new(J || (J = Promise))(function(V, F) {
        function K(C) {
          try {
            H(W.next(C))
          } catch (E) {
            F(E)
          }
        }

        function D(C) {
          try {
            H(W.throw(C))
          } catch (E) {
            F(E)
          }
        }

        function H(C) {
          C.done ? V(C.value) : X(C.value).then(K, D)
        }
        H((W = W.apply(I, Y || [])).next())
      })
    }, JXQ = function(I, Y) {
      var J = {
          label: 0,
          sent: function() {
            if (V[0] & 1) throw V[1];
            return V[1]
          },
          trys: [],
          ops: []
        },
        W, X, V, F = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return F.next = K(0), F.throw = K(1), F.return = K(2), typeof Symbol === "function" && (F[Symbol.iterator] = function() {
        return this
      }), F;

      function K(H) {
        return function(C) {
          return D([H, C])
        }
      }

      function D(H) {
        if (W) throw TypeError("Generator is already executing.");
        while (F && (F = 0, H[0] && (J = 0)), J) try {
          if (W = 1, X && (V = H[0] & 2 ? X.return : H[0] ? X.throw || ((V = X.return) && V.call(X), 0) : X.next) && !(V = V.call(X, H[1])).done) return V;
          if (X = 0, V) H = [H[0] & 2, V.value];
          switch (H[0]) {
            case 0:
            case 1:
              V = H;
              break;
            case 4:
              return J.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              J.label++, X = H[1], H = [0];
              continue;
            case 7:
              H = J.ops.pop(), J.trys.pop();
              continue;
            default:
              if ((V = J.trys, !(V = V.length > 0 && V[V.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                J = 0;
                continue
              }
              if (H[0] === 3 && (!V || H[1] > V[0] && H[1] < V[3])) {
                J.label = H[1];
                break
              }
              if (H[0] === 6 && J.label < V[1]) {
                J.label = V[1], V = H;
                break
              }
              if (V && J.label < V[2]) {
                J.label = V[2], J.ops.push(H);
                break
              }
              if (V[2]) J.ops.pop();
              J.trys.pop();
              continue
          }
          H = Y.call(I, J)
        } catch (C) {
          H = [6, C], X = 0
        } finally {
          W = V = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, WXQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) hgA(Y, I, J)
    }, hgA = Object.create ? function(I, Y, J, W) {
      if (W === void 0) W = J;
      var X = Object.getOwnPropertyDescriptor(Y, J);
      if (!X || ("get" in X ? !Y.__esModule : X.writable || X.configurable)) X = {
        enumerable: !0,
        get: function() {
          return Y[J]
        }
      };
      Object.defineProperty(I, W, X)
    } : function(I, Y, J, W) {
      if (W === void 0) W = J;
      I[W] = Y[J]
    }, fgA = function(I) {
      var Y = typeof Symbol === "function" && Symbol.iterator,
        J = Y && I[Y],
        W = 0;
      if (J) return J.call(I);
      if (I && typeof I.length === "number") return {
        next: function() {
          if (I && W >= I.length) I = void 0;
          return {
            value: I && I[W++],
            done: !I
          }
        }
      };
      throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, sN1 = function(I, Y) {
      var J = typeof Symbol === "function" && I[Symbol.iterator];
      if (!J) return I;
      var W = J.call(I),
        X, V = [],
        F;
      try {
        while ((Y === void 0 || Y-- > 0) && !(X = W.next()).done) V.push(X.value)
      } catch (K) {
        F = {
          error: K
        }
      } finally {
        try {
          if (X && !X.done && (J = W.return)) J.call(W)
        } finally {
          if (F) throw F.error
        }
      }
      return V
    }, XXQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(sN1(arguments[Y]));
      return I
    }, VXQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, FXQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, _8A = function(I) {
      return this instanceof _8A ? (this.v = I, this) : new _8A(I)
    }, KXQ = function(I, Y, J) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var W = J.apply(I, Y || []),
        X, V = [];
      return X = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), K("next"), K("throw"), K("return", F), X[Symbol.asyncIterator] = function() {
        return this
      }, X;

      function F(q) {
        return function(w) {
          return Promise.resolve(w).then(q, E)
        }
      }

      function K(q, w) {
        if (W[q]) {
          if (X[q] = function(N) {
              return new Promise(function(R, T) {
                V.push([q, N, R, T]) > 1 || D(q, N)
              })
            }, w) X[q] = w(X[q])
        }
      }

      function D(q, w) {
        try {
          H(W[q](w))
        } catch (N) {
          U(V[0][3], N)
        }
      }

      function H(q) {
        q.value instanceof _8A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
      }

      function C(q) {
        D("next", q)
      }

      function E(q) {
        D("throw", q)
      }

      function U(q, w) {
        if (q(w), V.shift(), V.length) D(V[0][0], V[0][1])
      }
    }, DXQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: _8A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, HXQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof fgA === "function" ? fgA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
        return this
      }, J);

      function W(V) {
        J[V] = I[V] && function(F) {
          return new Promise(function(K, D) {
            F = I[V](F), X(K, D, F.done, F.value)
          })
        }
      }

      function X(V, F, K, D) {
        Promise.resolve(D).then(function(H) {
          V({
            value: H,
            done: K
          })
        }, F)
      }
    }, CXQ = function(I, Y) {
      if (Object.defineProperty) Object.defineProperty(I, "raw", {
        value: Y
      });
      else I.raw = Y;
      return I
    };
    var B = Object.create ? function(I, Y) {
        Object.defineProperty(I, "default", {
          enumerable: !0,
          value: Y
        })
      } : function(I, Y) {
        I.default = Y
      },
      G = function(I) {
        return G = Object.getOwnPropertyNames || function(Y) {
          var J = [];
          for (var W in Y)
            if (Object.prototype.hasOwnProperty.call(Y, W)) J[J.length] = W;
          return J
        }, G(I)
      };
    EXQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") hgA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, zXQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, UXQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, $XQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, wXQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, qXQ = function(I, Y, J) {
      if (Y !== null && Y !== void 0) {
        if (typeof Y !== "object" && typeof Y !== "function") throw TypeError("Object expected.");
        var W, X;
        if (J) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          W = Y[Symbol.asyncDispose]
        }
        if (W === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (W = Y[Symbol.dispose], J) X = W
        }
        if (typeof W !== "function") throw TypeError("Object not disposable.");
        if (X) W = function() {
          try {
            X.call(this)
          } catch (V) {
            return Promise.reject(V)
          }
        };
        I.stack.push({
          value: Y,
          dispose: W,
          async: J
        })
      } else if (J) I.stack.push({
        async: !0
      });
      return Y
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function(I, Y, J) {
      var W = Error(J);
      return W.name = "SuppressedError", W.error = I, W.suppressed = Y, W
    };
    NXQ = function(I) {
      function Y(V) {
        I.error = I.hasError ? new Z(V, I.error, "An error was suppressed during disposal.") : V, I.hasError = !0
      }
      var J, W = 0;

      function X() {
        while (J = I.stack.pop()) try {
          if (!J.async && W === 1) return W = 0, I.stack.push(J), Promise.resolve().then(X);
          if (J.dispose) {
            var V = J.dispose.call(J.value);
            if (J.async) return W |= 2, Promise.resolve(V).then(X, function(F) {
              return Y(F), X()
            })
          } else W |= 1
        } catch (F) {
          Y(F)
        }
        if (W === 1) return I.hasError ? Promise.reject(I.error) : Promise.resolve();
        if (I.hasError) throw I.error
      }
      return X()
    }, LXQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", rWQ), A("__assign", oWQ), A("__rest", tWQ), A("__decorate", eWQ), A("__param", AXQ), A("__esDecorate", QXQ), A("__runInitializers", BXQ), A("__propKey", GXQ), A("__setFunctionName", ZXQ), A("__metadata", IXQ), A("__awaiter", YXQ), A("__generator", JXQ), A("__exportStar", WXQ), A("__createBinding", hgA), A("__values", fgA), A("__read", sN1), A("__spread", XXQ), A("__spreadArrays", VXQ), A("__spreadArray", FXQ), A("__await", _8A), A("__asyncGenerator", KXQ), A("__asyncDelegator", DXQ), A("__asyncValues", HXQ), A("__makeTemplateObject", CXQ), A("__importStar", EXQ), A("__importDefault", zXQ), A("__classPrivateFieldGet", UXQ), A("__classPrivateFieldSet", $XQ), A("__classPrivateFieldIn", wXQ), A("__addDisposableResource", qXQ), A("__disposeResources", NXQ), A("__rewriteRelativeImportExtension", LXQ)
  })
})