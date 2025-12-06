
// @from(Start 7083965, End 7172537)
QhB = z((R2G, AhB) => {
  var {
    defineProperty: jtA,
    getOwnPropertyDescriptor: Wy6,
    getOwnPropertyNames: Xy6
  } = Object, Vy6 = Object.prototype.hasOwnProperty, A1 = (A, Q) => jtA(A, "name", {
    value: Q,
    configurable: !0
  }), Fy6 = (A, Q) => {
    for (var B in Q) jtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Ky6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Xy6(Q))
        if (!Vy6.call(A, Z) && Z !== B) jtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Wy6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Dy6 = (A) => Ky6(jtA({}, "__esModule", {
    value: !0
  }), A), hbB = {};
  Fy6(hbB, {
    AccessDeniedException: () => ubB,
    ApplyGuardrailCommand: () => lfB,
    ApplyGuardrailRequestFilterSensitiveLog: () => GfB,
    AsyncInvokeOutputDataConfig: () => oc1,
    AsyncInvokeStatus: () => My6,
    AsyncInvokeSummaryFilterSensitiveLog: () => ebB,
    BedrockRuntime: () => efB,
    BedrockRuntimeClient: () => Wp1,
    BedrockRuntimeServiceException: () => UU,
    BidirectionalInputPayloadPartFilterSensitiveLog: () => Fx6,
    BidirectionalOutputPayloadPartFilterSensitiveLog: () => Dx6,
    CachePointType: () => ly6,
    ConflictException: () => pbB,
    ContentBlock: () => MtA,
    ContentBlockDelta: () => Bp1,
    ContentBlockDeltaEventFilterSensitiveLog: () => VfB,
    ContentBlockDeltaFilterSensitiveLog: () => XfB,
    ContentBlockFilterSensitiveLog: () => ZfB,
    ContentBlockStart: () => Gp1,
    ConversationRole: () => ty6,
    ConverseCommand: () => ifB,
    ConverseOutput: () => Ap1,
    ConverseOutputFilterSensitiveLog: () => YfB,
    ConverseRequestFilterSensitiveLog: () => IfB,
    ConverseResponseFilterSensitiveLog: () => JfB,
    ConverseStreamCommand: () => nfB,
    ConverseStreamOutput: () => Zp1,
    ConverseStreamOutputFilterSensitiveLog: () => Vx6,
    ConverseStreamRequestFilterSensitiveLog: () => WfB,
    ConverseStreamResponseFilterSensitiveLog: () => FfB,
    DocumentFormat: () => iy6,
    DocumentSource: () => ztA,
    GetAsyncInvokeCommand: () => afB,
    GetAsyncInvokeResponseFilterSensitiveLog: () => tbB,
    GuardrailAction: () => _y6,
    GuardrailContentBlock: () => EtA,
    GuardrailContentBlockFilterSensitiveLog: () => BfB,
    GuardrailContentFilterConfidence: () => yy6,
    GuardrailContentFilterStrength: () => xy6,
    GuardrailContentFilterType: () => vy6,
    GuardrailContentPolicyAction: () => ky6,
    GuardrailContentQualifier: () => Py6,
    GuardrailContentSource: () => Sy6,
    GuardrailContextualGroundingFilterType: () => fy6,
    GuardrailContextualGroundingPolicyAction: () => by6,
    GuardrailConverseContentBlock: () => $tA,
    GuardrailConverseContentBlockFilterSensitiveLog: () => Xp1,
    GuardrailConverseContentQualifier: () => ay6,
    GuardrailConverseImageBlockFilterSensitiveLog: () => Yx6,
    GuardrailConverseImageFormat: () => ny6,
    GuardrailConverseImageSource: () => UtA,
    GuardrailConverseImageSourceFilterSensitiveLog: () => Ix6,
    GuardrailImageBlockFilterSensitiveLog: () => Zx6,
    GuardrailImageFormat: () => Ty6,
    GuardrailImageSource: () => CtA,
    GuardrailImageSourceFilterSensitiveLog: () => Gx6,
    GuardrailManagedWordType: () => cy6,
    GuardrailOutputScope: () => jy6,
    GuardrailPiiEntityType: () => gy6,
    GuardrailSensitiveInformationPolicyAction: () => hy6,
    GuardrailStreamProcessingMode: () => Qx6,
    GuardrailTopicPolicyAction: () => uy6,
    GuardrailTopicType: () => my6,
    GuardrailTrace: () => py6,
    GuardrailWordPolicyAction: () => dy6,
    ImageFormat: () => sy6,
    ImageSource: () => wtA,
    InternalServerException: () => mbB,
    InvokeModelCommand: () => sfB,
    InvokeModelRequestFilterSensitiveLog: () => KfB,
    InvokeModelResponseFilterSensitiveLog: () => DfB,
    InvokeModelWithBidirectionalStreamCommand: () => rfB,
    InvokeModelWithBidirectionalStreamInput: () => PtA,
    InvokeModelWithBidirectionalStreamInputFilterSensitiveLog: () => Kx6,
    InvokeModelWithBidirectionalStreamOutput: () => Ip1,
    InvokeModelWithBidirectionalStreamOutputFilterSensitiveLog: () => Hx6,
    InvokeModelWithBidirectionalStreamRequestFilterSensitiveLog: () => HfB,
    InvokeModelWithBidirectionalStreamResponseFilterSensitiveLog: () => CfB,
    InvokeModelWithResponseStreamCommand: () => ofB,
    InvokeModelWithResponseStreamRequestFilterSensitiveLog: () => EfB,
    InvokeModelWithResponseStreamResponseFilterSensitiveLog: () => zfB,
    ListAsyncInvokesCommand: () => zp1,
    ListAsyncInvokesResponseFilterSensitiveLog: () => AfB,
    MessageFilterSensitiveLog: () => StA,
    ModelErrorException: () => abB,
    ModelNotReadyException: () => sbB,
    ModelStreamErrorException: () => obB,
    ModelTimeoutException: () => rbB,
    PayloadPartFilterSensitiveLog: () => Cx6,
    PerformanceConfigLatency: () => ey6,
    PromptVariableValues: () => tc1,
    ReasoningContentBlock: () => qtA,
    ReasoningContentBlockDelta: () => Qp1,
    ReasoningContentBlockDeltaFilterSensitiveLog: () => Xx6,
    ReasoningContentBlockFilterSensitiveLog: () => Wx6,
    ReasoningTextBlockFilterSensitiveLog: () => Jx6,
    ResourceNotFoundException: () => lbB,
    ResponseStream: () => Yp1,
    ResponseStreamFilterSensitiveLog: () => Ex6,
    ServiceQuotaExceededException: () => ibB,
    ServiceUnavailableException: () => nbB,
    SortAsyncInvocationBy: () => Oy6,
    SortOrder: () => Ry6,
    StartAsyncInvokeCommand: () => tfB,
    StartAsyncInvokeRequestFilterSensitiveLog: () => QfB,
    StopReason: () => Ax6,
    SystemContentBlock: () => OtA,
    SystemContentBlockFilterSensitiveLog: () => Vp1,
    ThrottlingException: () => dbB,
    Tool: () => TtA,
    ToolChoice: () => ec1,
    ToolInputSchema: () => RtA,
    ToolResultContentBlock: () => LtA,
    ToolResultStatus: () => oy6,
    Trace: () => Bx6,
    ValidationException: () => cbB,
    VideoFormat: () => ry6,
    VideoSource: () => NtA,
    __Client: () => F1.Client,
    paginateListAsyncInvokes: () => Yb6
  });
  AhB.exports = Dy6(hbB);
  var gbB = AyB(),
    ObB = cCA(),
    Hy6 = pCA(),
    Cy6 = lCA(),
    RbB = F5A(),
    Ey6 = f8(),
    Zq = iB(),
    zy6 = GyB(),
    Uy6 = LX(),
    r_ = q5(),
    TbB = D6(),
    PbB = Nc1(),
    $y6 = A1((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "bedrock"
      })
    }, "resolveClientEndpointParameters"),
    zf = {
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
    },
    wy6 = UbB(),
    jbB = YEA(),
    SbB = MbB(),
    F1 = FwA(),
    qy6 = A1((A) => {
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
    }, "getHttpAuthExtensionConfiguration"),
    Ny6 = A1((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    Ly6 = A1((A, Q) => {
      let B = Object.assign((0, jbB.getAwsRegionExtensionConfiguration)(A), (0, F1.getDefaultExtensionConfiguration)(A), (0, SbB.getHttpHandlerExtensionConfiguration)(A), qy6(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, jbB.resolveAwsRegionExtensionConfiguration)(B), (0, F1.resolveDefaultRuntimeConfig)(B), (0, SbB.resolveHttpHandlerRuntimeConfig)(B), Ny6(B))
    }, "resolveRuntimeExtensions"),
    Wp1 = class extends F1.Client {
      static {
        A1(this, "BedrockRuntimeClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, wy6.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = $y6(Q),
          G = (0, RbB.resolveUserAgentConfig)(B),
          Z = (0, TbB.resolveRetryConfig)(G),
          I = (0, Ey6.resolveRegionConfig)(Z),
          Y = (0, ObB.resolveHostHeaderConfig)(I),
          J = (0, r_.resolveEndpointConfig)(Y),
          W = (0, zy6.resolveEventStreamSerdeConfig)(J),
          X = (0, PbB.resolveHttpAuthSchemeConfig)(W),
          V = (0, gbB.resolveEventStreamConfig)(X),
          F = Ly6(V, A?.extensions || []);
        this.config = F, this.middlewareStack.use((0, RbB.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, TbB.getRetryPlugin)(this.config)), this.middlewareStack.use((0, Uy6.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, ObB.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, Hy6.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, Cy6.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Zq.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: PbB.defaultBedrockRuntimeHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: A1(async (K) => new Zq.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": K.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, Zq.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    Uf = GZ(),
    UU = class A extends F1.ServiceException {
      static {
        A1(this, "BedrockRuntimeServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ubB = class A extends UU {
      static {
        A1(this, "AccessDeniedException")
      }
      name = "AccessDeniedException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "AccessDeniedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    oc1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.s3OutputDataConfig !== void 0) return B.s3OutputDataConfig(Q.s3OutputDataConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(oc1 || (oc1 = {}));
  var My6 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress"
    },
    mbB = class A extends UU {
      static {
        A1(this, "InternalServerException")
      }
      name = "InternalServerException";
      $fault = "server";
      constructor(Q) {
        super({
          name: "InternalServerException",
          $fault: "server",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    dbB = class A extends UU {
      static {
        A1(this, "ThrottlingException")
      }
      name = "ThrottlingException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ThrottlingException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    cbB = class A extends UU {
      static {
        A1(this, "ValidationException")
      }
      name = "ValidationException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ValidationException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    Oy6 = {
      SUBMISSION_TIME: "SubmissionTime"
    },
    Ry6 = {
      ASCENDING: "Ascending",
      DESCENDING: "Descending"
    },
    pbB = class A extends UU {
      static {
        A1(this, "ConflictException")
      }
      name = "ConflictException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ConflictException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    lbB = class A extends UU {
      static {
        A1(this, "ResourceNotFoundException")
      }
      name = "ResourceNotFoundException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ResourceNotFoundException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    ibB = class A extends UU {
      static {
        A1(this, "ServiceQuotaExceededException")
      }
      name = "ServiceQuotaExceededException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ServiceQuotaExceededException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    nbB = class A extends UU {
      static {
        A1(this, "ServiceUnavailableException")
      }
      name = "ServiceUnavailableException";
      $fault = "server";
      constructor(Q) {
        super({
          name: "ServiceUnavailableException",
          $fault: "server",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    Ty6 = {
      JPEG: "jpeg",
      PNG: "png"
    },
    CtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.bytes !== void 0) return B.bytes(Q.bytes);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(CtA || (CtA = {}));
  var Py6 = {
      GROUNDING_SOURCE: "grounding_source",
      GUARD_CONTENT: "guard_content",
      QUERY: "query"
    },
    EtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.image !== void 0) return B.image(Q.image);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(EtA || (EtA = {}));
  var jy6 = {
      FULL: "FULL",
      INTERVENTIONS: "INTERVENTIONS"
    },
    Sy6 = {
      INPUT: "INPUT",
      OUTPUT: "OUTPUT"
    },
    _y6 = {
      GUARDRAIL_INTERVENED: "GUARDRAIL_INTERVENED",
      NONE: "NONE"
    },
    ky6 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    yy6 = {
      HIGH: "HIGH",
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      NONE: "NONE"
    },
    xy6 = {
      HIGH: "HIGH",
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      NONE: "NONE"
    },
    vy6 = {
      HATE: "HATE",
      INSULTS: "INSULTS",
      MISCONDUCT: "MISCONDUCT",
      PROMPT_ATTACK: "PROMPT_ATTACK",
      SEXUAL: "SEXUAL",
      VIOLENCE: "VIOLENCE"
    },
    by6 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    fy6 = {
      GROUNDING: "GROUNDING",
      RELEVANCE: "RELEVANCE"
    },
    hy6 = {
      ANONYMIZED: "ANONYMIZED",
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    gy6 = {
      ADDRESS: "ADDRESS",
      AGE: "AGE",
      AWS_ACCESS_KEY: "AWS_ACCESS_KEY",
      AWS_SECRET_KEY: "AWS_SECRET_KEY",
      CA_HEALTH_NUMBER: "CA_HEALTH_NUMBER",
      CA_SOCIAL_INSURANCE_NUMBER: "CA_SOCIAL_INSURANCE_NUMBER",
      CREDIT_DEBIT_CARD_CVV: "CREDIT_DEBIT_CARD_CVV",
      CREDIT_DEBIT_CARD_EXPIRY: "CREDIT_DEBIT_CARD_EXPIRY",
      CREDIT_DEBIT_CARD_NUMBER: "CREDIT_DEBIT_CARD_NUMBER",
      DRIVER_ID: "DRIVER_ID",
      EMAIL: "EMAIL",
      INTERNATIONAL_BANK_ACCOUNT_NUMBER: "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
      IP_ADDRESS: "IP_ADDRESS",
      LICENSE_PLATE: "LICENSE_PLATE",
      MAC_ADDRESS: "MAC_ADDRESS",
      NAME: "NAME",
      PASSWORD: "PASSWORD",
      PHONE: "PHONE",
      PIN: "PIN",
      SWIFT_CODE: "SWIFT_CODE",
      UK_NATIONAL_HEALTH_SERVICE_NUMBER: "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
      UK_NATIONAL_INSURANCE_NUMBER: "UK_NATIONAL_INSURANCE_NUMBER",
      UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER: "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
      URL: "URL",
      USERNAME: "USERNAME",
      US_BANK_ACCOUNT_NUMBER: "US_BANK_ACCOUNT_NUMBER",
      US_BANK_ROUTING_NUMBER: "US_BANK_ROUTING_NUMBER",
      US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER: "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
      US_PASSPORT_NUMBER: "US_PASSPORT_NUMBER",
      US_SOCIAL_SECURITY_NUMBER: "US_SOCIAL_SECURITY_NUMBER",
      VEHICLE_IDENTIFICATION_NUMBER: "VEHICLE_IDENTIFICATION_NUMBER"
    },
    uy6 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    my6 = {
      DENY: "DENY"
    },
    dy6 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    cy6 = {
      PROFANITY: "PROFANITY"
    },
    py6 = {
      DISABLED: "disabled",
      ENABLED: "enabled",
      ENABLED_FULL: "enabled_full"
    },
    ly6 = {
      DEFAULT: "default"
    },
    iy6 = {
      CSV: "csv",
      DOC: "doc",
      DOCX: "docx",
      HTML: "html",
      MD: "md",
      PDF: "pdf",
      TXT: "txt",
      XLS: "xls",
      XLSX: "xlsx"
    },
    ztA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.bytes !== void 0) return B.bytes(Q.bytes);
      if (Q.s3Location !== void 0) return B.s3Location(Q.s3Location);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(ztA || (ztA = {}));
  var ny6 = {
      JPEG: "jpeg",
      PNG: "png"
    },
    UtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.bytes !== void 0) return B.bytes(Q.bytes);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(UtA || (UtA = {}));
  var ay6 = {
      GROUNDING_SOURCE: "grounding_source",
      GUARD_CONTENT: "guard_content",
      QUERY: "query"
    },
    $tA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.image !== void 0) return B.image(Q.image);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })($tA || ($tA = {}));
  var sy6 = {
      GIF: "gif",
      JPEG: "jpeg",
      PNG: "png",
      WEBP: "webp"
    },
    wtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.bytes !== void 0) return B.bytes(Q.bytes);
      if (Q.s3Location !== void 0) return B.s3Location(Q.s3Location);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(wtA || (wtA = {}));
  var qtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.reasoningText !== void 0) return B.reasoningText(Q.reasoningText);
      if (Q.redactedContent !== void 0) return B.redactedContent(Q.redactedContent);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(qtA || (qtA = {}));
  var ry6 = {
      FLV: "flv",
      MKV: "mkv",
      MOV: "mov",
      MP4: "mp4",
      MPEG: "mpeg",
      MPG: "mpg",
      THREE_GP: "three_gp",
      WEBM: "webm",
      WMV: "wmv"
    },
    NtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.bytes !== void 0) return B.bytes(Q.bytes);
      if (Q.s3Location !== void 0) return B.s3Location(Q.s3Location);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(NtA || (NtA = {}));
  var LtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.json !== void 0) return B.json(Q.json);
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.image !== void 0) return B.image(Q.image);
      if (Q.document !== void 0) return B.document(Q.document);
      if (Q.video !== void 0) return B.video(Q.video);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(LtA || (LtA = {}));
  var oy6 = {
      ERROR: "error",
      SUCCESS: "success"
    },
    MtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.image !== void 0) return B.image(Q.image);
      if (Q.document !== void 0) return B.document(Q.document);
      if (Q.video !== void 0) return B.video(Q.video);
      if (Q.toolUse !== void 0) return B.toolUse(Q.toolUse);
      if (Q.toolResult !== void 0) return B.toolResult(Q.toolResult);
      if (Q.guardContent !== void 0) return B.guardContent(Q.guardContent);
      if (Q.cachePoint !== void 0) return B.cachePoint(Q.cachePoint);
      if (Q.reasoningContent !== void 0) return B.reasoningContent(Q.reasoningContent);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(MtA || (MtA = {}));
  var ty6 = {
      ASSISTANT: "assistant",
      USER: "user"
    },
    ey6 = {
      OPTIMIZED: "optimized",
      STANDARD: "standard"
    },
    tc1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(tc1 || (tc1 = {}));
  var OtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.guardContent !== void 0) return B.guardContent(Q.guardContent);
      if (Q.cachePoint !== void 0) return B.cachePoint(Q.cachePoint);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(OtA || (OtA = {}));
  var ec1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.auto !== void 0) return B.auto(Q.auto);
      if (Q.any !== void 0) return B.any(Q.any);
      if (Q.tool !== void 0) return B.tool(Q.tool);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(ec1 || (ec1 = {}));
  var RtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.json !== void 0) return B.json(Q.json);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(RtA || (RtA = {}));
  var TtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.toolSpec !== void 0) return B.toolSpec(Q.toolSpec);
      if (Q.cachePoint !== void 0) return B.cachePoint(Q.cachePoint);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(TtA || (TtA = {}));
  var Ap1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.message !== void 0) return B.message(Q.message);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Ap1 || (Ap1 = {}));
  var Ax6 = {
      CONTENT_FILTERED: "content_filtered",
      END_TURN: "end_turn",
      GUARDRAIL_INTERVENED: "guardrail_intervened",
      MAX_TOKENS: "max_tokens",
      STOP_SEQUENCE: "stop_sequence",
      TOOL_USE: "tool_use"
    },
    abB = class A extends UU {
      static {
        A1(this, "ModelErrorException")
      }
      name = "ModelErrorException";
      $fault = "client";
      originalStatusCode;
      resourceName;
      constructor(Q) {
        super({
          name: "ModelErrorException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.originalStatusCode = Q.originalStatusCode, this.resourceName = Q.resourceName
      }
    },
    sbB = class A extends UU {
      static {
        A1(this, "ModelNotReadyException")
      }
      name = "ModelNotReadyException";
      $fault = "client";
      $retryable = {};
      constructor(Q) {
        super({
          name: "ModelNotReadyException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    rbB = class A extends UU {
      static {
        A1(this, "ModelTimeoutException")
      }
      name = "ModelTimeoutException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ModelTimeoutException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    Qx6 = {
      ASYNC: "async",
      SYNC: "sync"
    },
    Qp1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.redactedContent !== void 0) return B.redactedContent(Q.redactedContent);
      if (Q.signature !== void 0) return B.signature(Q.signature);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Qp1 || (Qp1 = {}));
  var Bp1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.text !== void 0) return B.text(Q.text);
      if (Q.toolUse !== void 0) return B.toolUse(Q.toolUse);
      if (Q.reasoningContent !== void 0) return B.reasoningContent(Q.reasoningContent);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Bp1 || (Bp1 = {}));
  var Gp1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.toolUse !== void 0) return B.toolUse(Q.toolUse);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Gp1 || (Gp1 = {}));
  var obB = class A extends UU {
      static {
        A1(this, "ModelStreamErrorException")
      }
      name = "ModelStreamErrorException";
      $fault = "client";
      originalStatusCode;
      originalMessage;
      constructor(Q) {
        super({
          name: "ModelStreamErrorException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.originalStatusCode = Q.originalStatusCode, this.originalMessage = Q.originalMessage
      }
    },
    Zp1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.messageStart !== void 0) return B.messageStart(Q.messageStart);
      if (Q.contentBlockStart !== void 0) return B.contentBlockStart(Q.contentBlockStart);
      if (Q.contentBlockDelta !== void 0) return B.contentBlockDelta(Q.contentBlockDelta);
      if (Q.contentBlockStop !== void 0) return B.contentBlockStop(Q.contentBlockStop);
      if (Q.messageStop !== void 0) return B.messageStop(Q.messageStop);
      if (Q.metadata !== void 0) return B.metadata(Q.metadata);
      if (Q.internalServerException !== void 0) return B.internalServerException(Q.internalServerException);
      if (Q.modelStreamErrorException !== void 0) return B.modelStreamErrorException(Q.modelStreamErrorException);
      if (Q.validationException !== void 0) return B.validationException(Q.validationException);
      if (Q.throttlingException !== void 0) return B.throttlingException(Q.throttlingException);
      if (Q.serviceUnavailableException !== void 0) return B.serviceUnavailableException(Q.serviceUnavailableException);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Zp1 || (Zp1 = {}));
  var Bx6 = {
      DISABLED: "DISABLED",
      ENABLED: "ENABLED",
      ENABLED_FULL: "ENABLED_FULL"
    },
    PtA;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.chunk !== void 0) return B.chunk(Q.chunk);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(PtA || (PtA = {}));
  var Ip1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.chunk !== void 0) return B.chunk(Q.chunk);
      if (Q.internalServerException !== void 0) return B.internalServerException(Q.internalServerException);
      if (Q.modelStreamErrorException !== void 0) return B.modelStreamErrorException(Q.modelStreamErrorException);
      if (Q.validationException !== void 0) return B.validationException(Q.validationException);
      if (Q.throttlingException !== void 0) return B.throttlingException(Q.throttlingException);
      if (Q.modelTimeoutException !== void 0) return B.modelTimeoutException(Q.modelTimeoutException);
      if (Q.serviceUnavailableException !== void 0) return B.serviceUnavailableException(Q.serviceUnavailableException);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Ip1 || (Ip1 = {}));
  var Yp1;
  ((A) => {
    A.visit = A1((Q, B) => {
      if (Q.chunk !== void 0) return B.chunk(Q.chunk);
      if (Q.internalServerException !== void 0) return B.internalServerException(Q.internalServerException);
      if (Q.modelStreamErrorException !== void 0) return B.modelStreamErrorException(Q.modelStreamErrorException);
      if (Q.validationException !== void 0) return B.validationException(Q.validationException);
      if (Q.throttlingException !== void 0) return B.throttlingException(Q.throttlingException);
      if (Q.modelTimeoutException !== void 0) return B.modelTimeoutException(Q.modelTimeoutException);
      if (Q.serviceUnavailableException !== void 0) return B.serviceUnavailableException(Q.serviceUnavailableException);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Yp1 || (Yp1 = {}));
  var tbB = A1((A) => ({
      ...A,
      ...A.failureMessage && {
        failureMessage: F1.SENSITIVE_STRING
      },
      ...A.outputDataConfig && {
        outputDataConfig: A.outputDataConfig
      }
    }), "GetAsyncInvokeResponseFilterSensitiveLog"),
    ebB = A1((A) => ({
      ...A,
      ...A.failureMessage && {
        failureMessage: F1.SENSITIVE_STRING
      },
      ...A.outputDataConfig && {
        outputDataConfig: A.outputDataConfig
      }
    }), "AsyncInvokeSummaryFilterSensitiveLog"),
    AfB = A1((A) => ({
      ...A,
      ...A.asyncInvokeSummaries && {
        asyncInvokeSummaries: A.asyncInvokeSummaries.map((Q) => ebB(Q))
      }
    }), "ListAsyncInvokesResponseFilterSensitiveLog"),
    QfB = A1((A) => ({
      ...A,
      ...A.modelInput && {
        modelInput: F1.SENSITIVE_STRING
      },
      ...A.outputDataConfig && {
        outputDataConfig: A.outputDataConfig
      }
    }), "StartAsyncInvokeRequestFilterSensitiveLog"),
    Gx6 = A1((A) => {
      if (A.bytes !== void 0) return {
        bytes: A.bytes
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "GuardrailImageSourceFilterSensitiveLog"),
    Zx6 = A1((A) => ({
      ...A,
      ...A.source && {
        source: F1.SENSITIVE_STRING
      }
    }), "GuardrailImageBlockFilterSensitiveLog"),
    BfB = A1((A) => {
      if (A.text !== void 0) return {
        text: A.text
      };
      if (A.image !== void 0) return {
        image: F1.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "GuardrailContentBlockFilterSensitiveLog"),
    GfB = A1((A) => ({
      ...A,
      ...A.content && {
        content: A.content.map((Q) => BfB(Q))
      }
    }), "ApplyGuardrailRequestFilterSensitiveLog"),
    Ix6 = A1((A) => {
      if (A.bytes !== void 0) return {
        bytes: A.bytes
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "GuardrailConverseImageSourceFilterSensitiveLog"),
    Yx6 = A1((A) => ({
      ...A,
      ...A.source && {
        source: F1.SENSITIVE_STRING
      }
    }), "GuardrailConverseImageBlockFilterSensitiveLog"),
    Xp1 = A1((A) => {
      if (A.text !== void 0) return {
        text: A.text
      };
      if (A.image !== void 0) return {
        image: F1.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "GuardrailConverseContentBlockFilterSensitiveLog"),
    Jx6 = A1((A) => ({
      ...A
    }), "ReasoningTextBlockFilterSensitiveLog"),
    Wx6 = A1((A) => {
      if (A.reasoningText !== void 0) return {
        reasoningText: F1.SENSITIVE_STRING
      };
      if (A.redactedContent !== void 0) return {
        redactedContent: A.redactedContent
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ReasoningContentBlockFilterSensitiveLog"),
    ZfB = A1((A) => {
      if (A.text !== void 0) return {
        text: A.text
      };
      if (A.image !== void 0) return {
        image: A.image
      };
      if (A.document !== void 0) return {
        document: A.document
      };
      if (A.video !== void 0) return {
        video: A.video
      };
      if (A.toolUse !== void 0) return {
        toolUse: A.toolUse
      };
      if (A.toolResult !== void 0) return {
        toolResult: A.toolResult
      };
      if (A.guardContent !== void 0) return {
        guardContent: Xp1(A.guardContent)
      };
      if (A.cachePoint !== void 0) return {
        cachePoint: A.cachePoint
      };
      if (A.reasoningContent !== void 0) return {
        reasoningContent: F1.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ContentBlockFilterSensitiveLog"),
    StA = A1((A) => ({
      ...A,
      ...A.content && {
        content: A.content.map((Q) => ZfB(Q))
      }
    }), "MessageFilterSensitiveLog"),
    Vp1 = A1((A) => {
      if (A.text !== void 0) return {
        text: A.text
      };
      if (A.guardContent !== void 0) return {
        guardContent: Xp1(A.guardContent)
      };
      if (A.cachePoint !== void 0) return {
        cachePoint: A.cachePoint
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "SystemContentBlockFilterSensitiveLog"),
    IfB = A1((A) => ({
      ...A,
      ...A.messages && {
        messages: A.messages.map((Q) => StA(Q))
      },
      ...A.system && {
        system: A.system.map((Q) => Vp1(Q))
      },
      ...A.toolConfig && {
        toolConfig: A.toolConfig
      },
      ...A.promptVariables && {
        promptVariables: F1.SENSITIVE_STRING
      },
      ...A.requestMetadata && {
        requestMetadata: F1.SENSITIVE_STRING
      }
    }), "ConverseRequestFilterSensitiveLog"),
    YfB = A1((A) => {
      if (A.message !== void 0) return {
        message: StA(A.message)
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ConverseOutputFilterSensitiveLog"),
    JfB = A1((A) => ({
      ...A,
      ...A.output && {
        output: YfB(A.output)
      }
    }), "ConverseResponseFilterSensitiveLog"),
    WfB = A1((A) => ({
      ...A,
      ...A.messages && {
        messages: A.messages.map((Q) => StA(Q))
      },
      ...A.system && {
        system: A.system.map((Q) => Vp1(Q))
      },
      ...A.toolConfig && {
        toolConfig: A.toolConfig
      },
      ...A.promptVariables && {
        promptVariables: F1.SENSITIVE_STRING
      },
      ...A.requestMetadata && {
        requestMetadata: F1.SENSITIVE_STRING
      }
    }), "ConverseStreamRequestFilterSensitiveLog"),
    Xx6 = A1((A) => {
      if (A.text !== void 0) return {
        text: A.text
      };
      if (A.redactedContent !== void 0) return {
        redactedContent: A.redactedContent
      };
      if (A.signature !== void 0) return {
        signature: A.signature
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ReasoningContentBlockDeltaFilterSensitiveLog"),
    XfB = A1((A) => {
      if (A.text !== void 0) return {
        text: A.text
      };
      if (A.toolUse !== void 0) return {
        toolUse: A.toolUse
      };
      if (A.reasoningContent !== void 0) return {
        reasoningContent: F1.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ContentBlockDeltaFilterSensitiveLog"),
    VfB = A1((A) => ({
      ...A,
      ...A.delta && {
        delta: XfB(A.delta)
      }
    }), "ContentBlockDeltaEventFilterSensitiveLog"),
    Vx6 = A1((A) => {
      if (A.messageStart !== void 0) return {
        messageStart: A.messageStart
      };
      if (A.contentBlockStart !== void 0) return {
        contentBlockStart: A.contentBlockStart
      };
      if (A.contentBlockDelta !== void 0) return {
        contentBlockDelta: VfB(A.contentBlockDelta)
      };
      if (A.contentBlockStop !== void 0) return {
        contentBlockStop: A.contentBlockStop
      };
      if (A.messageStop !== void 0) return {
        messageStop: A.messageStop
      };
      if (A.metadata !== void 0) return {
        metadata: A.metadata
      };
      if (A.internalServerException !== void 0) return {
        internalServerException: A.internalServerException
      };
      if (A.modelStreamErrorException !== void 0) return {
        modelStreamErrorException: A.modelStreamErrorException
      };
      if (A.validationException !== void 0) return {
        validationException: A.validationException
      };
      if (A.throttlingException !== void 0) return {
        throttlingException: A.throttlingException
      };
      if (A.serviceUnavailableException !== void 0) return {
        serviceUnavailableException: A.serviceUnavailableException
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ConverseStreamOutputFilterSensitiveLog"),
    FfB = A1((A) => ({
      ...A,
      ...A.stream && {
        stream: "STREAMING_CONTENT"
      }
    }), "ConverseStreamResponseFilterSensitiveLog"),
    KfB = A1((A) => ({
      ...A,
      ...A.body && {
        body: F1.SENSITIVE_STRING
      }
    }), "InvokeModelRequestFilterSensitiveLog"),
    DfB = A1((A) => ({
      ...A,
      ...A.body && {
        body: F1.SENSITIVE_STRING
      }
    }), "InvokeModelResponseFilterSensitiveLog"),
    Fx6 = A1((A) => ({
      ...A,
      ...A.bytes && {
        bytes: F1.SENSITIVE_STRING
      }
    }), "BidirectionalInputPayloadPartFilterSensitiveLog"),
    Kx6 = A1((A) => {
      if (A.chunk !== void 0) return {
        chunk: F1.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "InvokeModelWithBidirectionalStreamInputFilterSensitiveLog"),
    HfB = A1((A) => ({
      ...A,
      ...A.body && {
        body: "STREAMING_CONTENT"
      }
    }), "InvokeModelWithBidirectionalStreamRequestFilterSensitiveLog"),
    Dx6 = A1((A) => ({
      ...A,
      ...A.bytes && {
        bytes: F1.SENSITIVE_STRING
      }
    }), "BidirectionalOutputPayloadPartFilterSensitiveLog"),
    Hx6 = A1((A) => {
      if (A.chunk !== void 0) return {
        chunk: F1.SENSITIVE_STRING
      };
      if (A.internalServerException !== void 0) return {
        internalServerException: A.internalServerException
      };
      if (A.modelStreamErrorException !== void 0) return {
        modelStreamErrorException: A.modelStreamErrorException
      };
      if (A.validationException !== void 0) return {
        validationException: A.validationException
      };
      if (A.throttlingException !== void 0) return {
        throttlingException: A.throttlingException
      };
      if (A.modelTimeoutException !== void 0) return {
        modelTimeoutException: A.modelTimeoutException
      };
      if (A.serviceUnavailableException !== void 0) return {
        serviceUnavailableException: A.serviceUnavailableException
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "InvokeModelWithBidirectionalStreamOutputFilterSensitiveLog"),
    CfB = A1((A) => ({
      ...A,
      ...A.body && {
        body: "STREAMING_CONTENT"
      }
    }), "InvokeModelWithBidirectionalStreamResponseFilterSensitiveLog"),
    EfB = A1((A) => ({
      ...A,
      ...A.body && {
        body: F1.SENSITIVE_STRING
      }
    }), "InvokeModelWithResponseStreamRequestFilterSensitiveLog"),
    Cx6 = A1((A) => ({
      ...A,
      ...A.bytes && {
        bytes: F1.SENSITIVE_STRING
      }
    }), "PayloadPartFilterSensitiveLog"),
    Ex6 = A1((A) => {
      if (A.chunk !== void 0) return {
        chunk: F1.SENSITIVE_STRING
      };
      if (A.internalServerException !== void 0) return {
        internalServerException: A.internalServerException
      };
      if (A.modelStreamErrorException !== void 0) return {
        modelStreamErrorException: A.modelStreamErrorException
      };
      if (A.validationException !== void 0) return {
        validationException: A.validationException
      };
      if (A.throttlingException !== void 0) return {
        throttlingException: A.throttlingException
      };
      if (A.modelTimeoutException !== void 0) return {
        modelTimeoutException: A.modelTimeoutException
      };
      if (A.serviceUnavailableException !== void 0) return {
        serviceUnavailableException: A.serviceUnavailableException
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "ResponseStreamFilterSensitiveLog"),
    zfB = A1((A) => ({
      ...A,
      ...A.body && {
        body: "STREAMING_CONTENT"
      }
    }), "InvokeModelWithResponseStreamResponseFilterSensitiveLog"),
    F3 = jF(),
    zx6 = YHA(),
    Ux6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply"), B.p("guardrailIdentifier", () => A.guardrailIdentifier, "{guardrailIdentifier}", !1), B.p("guardrailVersion", () => A.guardrailVersion, "{guardrailVersion}", !1);
      let Z;
      return Z = JSON.stringify((0, F1.take)(A, {
        content: A1((I) => Jv6(I, Q), "content"),
        outputScope: [],
        source: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_ApplyGuardrailCommand"),
    $x6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model/{modelId}/converse"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z;
      return Z = JSON.stringify((0, F1.take)(A, {
        additionalModelRequestFields: A1((I) => HwA(I, Q), "additionalModelRequestFields"),
        additionalModelResponseFieldPaths: A1((I) => (0, F1._json)(I), "additionalModelResponseFieldPaths"),
        guardrailConfig: A1((I) => (0, F1._json)(I), "guardrailConfig"),
        inferenceConfig: A1((I) => PfB(I, Q), "inferenceConfig"),
        messages: A1((I) => jfB(I, Q), "messages"),
        performanceConfig: A1((I) => (0, F1._json)(I), "performanceConfig"),
        promptVariables: A1((I) => (0, F1._json)(I), "promptVariables"),
        requestMetadata: A1((I) => (0, F1._json)(I), "requestMetadata"),
        system: A1((I) => SfB(I, Q), "system"),
        toolConfig: A1((I) => _fB(I, Q), "toolConfig")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_ConverseCommand"),
    wx6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model/{modelId}/converse-stream"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z;
      return Z = JSON.stringify((0, F1.take)(A, {
        additionalModelRequestFields: A1((I) => HwA(I, Q), "additionalModelRequestFields"),
        additionalModelResponseFieldPaths: A1((I) => (0, F1._json)(I), "additionalModelResponseFieldPaths"),
        guardrailConfig: A1((I) => (0, F1._json)(I), "guardrailConfig"),
        inferenceConfig: A1((I) => PfB(I, Q), "inferenceConfig"),
        messages: A1((I) => jfB(I, Q), "messages"),
        performanceConfig: A1((I) => (0, F1._json)(I), "performanceConfig"),
        promptVariables: A1((I) => (0, F1._json)(I), "promptVariables"),
        requestMetadata: A1((I) => (0, F1._json)(I), "requestMetadata"),
        system: A1((I) => SfB(I, Q), "system"),
        toolConfig: A1((I) => _fB(I, Q), "toolConfig")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_ConverseStreamCommand"),
    qx6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {};
      B.bp("/async-invoke/{invocationArn}"), B.p("invocationArn", () => A.invocationArn, "{invocationArn}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetAsyncInvokeCommand"),
    Nx6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = (0, F1.map)({}, F1.isSerializableHeaderValue, {
          [Ep1]: A[ktA] || "application/octet-stream",
          [Jp1]: A[Jp1],
          [pfB]: A[mfB],
          [dfB]: A[gfB],
          [cfB]: A[ufB],
          [xtA]: A[ytA]
        });
      B.bp("/model/{modelId}/invoke"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z;
      if (A.body !== void 0) Z = A.body;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_InvokeModelCommand"),
    Lx6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model/{modelId}/invoke-with-bidirectional-stream"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z;
      if (A.body !== void 0) Z = cx6(A.body, Q);
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_InvokeModelWithBidirectionalStreamCommand"),
    Mx6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = (0, F1.map)({}, F1.isSerializableHeaderValue, {
          [Ep1]: A[ktA] || "application/octet-stream",
          [Gb6]: A[Jp1],
          [pfB]: A[mfB],
          [dfB]: A[gfB],
          [cfB]: A[ufB],
          [xtA]: A[ytA]
        });
      B.bp("/model/{modelId}/invoke-with-response-stream"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z;
      if (A.body !== void 0) Z = A.body;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_InvokeModelWithResponseStreamCommand"),
    Ox6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {};
      B.bp("/async-invoke");
      let Z = (0, F1.map)({
          [bbB]: [() => A.submitTimeAfter !== void 0, () => (0, F1.serializeDateTime)(A[bbB]).toString()],
          [fbB]: [() => A.submitTimeBefore !== void 0, () => (0, F1.serializeDateTime)(A[fbB]).toString()],
          [xbB]: [, A[xbB]],
          [_bB]: [() => A.maxResults !== void 0, () => A[_bB].toString()],
          [kbB]: [, A[kbB]],
          [ybB]: [, A[ybB]],
          [vbB]: [, A[vbB]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAsyncInvokesCommand"),
    Rx6 = A1(async (A, Q) => {
      let B = (0, Zq.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/async-invoke");
      let Z;
      return Z = JSON.stringify((0, F1.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, zx6.v4)()],
        modelId: [],
        modelInput: A1((I) => Hv6(I, Q), "modelInput"),
        outputDataConfig: A1((I) => (0, F1._json)(I), "outputDataConfig"),
        tags: A1((I) => (0, F1._json)(I), "tags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_StartAsyncInvokeCommand"),
    Tx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = (0, F1.expectNonNull)((0, F1.expectObject)(await (0, F3.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F1.take)(G, {
          action: F1.expectString,
          actionReason: F1.expectString,
          assessments: A1((I) => vfB(I, Q), "assessments"),
          guardrailCoverage: F1._json,
          outputs: F1._json,
          usage: F1._json
        });
      return Object.assign(B, Z), B
    }, "de_ApplyGuardrailCommand"),
    Px6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = (0, F1.expectNonNull)((0, F1.expectObject)(await (0, F3.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F1.take)(G, {
          additionalModelResponseFields: A1((I) => _tA(I, Q), "additionalModelResponseFields"),
          metrics: F1._json,
          output: A1((I) => yv6((0, F3.awsExpectUnion)(I), Q), "output"),
          performanceConfig: F1._json,
          stopReason: F1.expectString,
          trace: A1((I) => bv6(I, Q), "trace"),
          usage: F1._json
        });
      return Object.assign(B, Z), B
    }, "de_ConverseCommand"),
    jx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = A.body;
      return B.stream = lx6(G, Q), B
    }, "de_ConverseStreamCommand"),
    Sx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = (0, F1.expectNonNull)((0, F1.expectObject)(await (0, F3.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F1.take)(G, {
          clientRequestToken: F1.expectString,
          endTime: A1((I) => (0, F1.expectNonNull)((0, F1.parseRfc3339DateTimeWithOffset)(I)), "endTime"),
          failureMessage: F1.expectString,
          invocationArn: F1.expectString,
          lastModifiedTime: A1((I) => (0, F1.expectNonNull)((0, F1.parseRfc3339DateTimeWithOffset)(I)), "lastModifiedTime"),
          modelArn: F1.expectString,
          outputDataConfig: A1((I) => (0, F1._json)((0, F3.awsExpectUnion)(I)), "outputDataConfig"),
          status: F1.expectString,
          submitTime: A1((I) => (0, F1.expectNonNull)((0, F1.parseRfc3339DateTimeWithOffset)(I)), "submitTime")
        });
      return Object.assign(B, Z), B
    }, "de_GetAsyncInvokeCommand"),
    _x6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A),
          [ktA]: [, A.headers[Ep1]],
          [ytA]: [, A.headers[xtA]]
        }),
        G = await (0, F1.collectBody)(A.body, Q);
      return B.body = G, B
    }, "de_InvokeModelCommand"),
    kx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = A.body;
      return B.body = ix6(G, Q), B
    }, "de_InvokeModelWithBidirectionalStreamCommand"),
    yx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A),
          [ktA]: [, A.headers[Zb6]],
          [ytA]: [, A.headers[xtA]]
        }),
        G = A.body;
      return B.body = nx6(G, Q), B
    }, "de_InvokeModelWithResponseStreamCommand"),
    xx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = (0, F1.expectNonNull)((0, F1.expectObject)(await (0, F3.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F1.take)(G, {
          asyncInvokeSummaries: A1((I) => Rv6(I, Q), "asyncInvokeSummaries"),
          nextToken: F1.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListAsyncInvokesCommand"),
    vx6 = A1(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return $f(A, Q);
      let B = (0, F1.map)({
          $metadata: RW(A)
        }),
        G = (0, F1.expectNonNull)((0, F1.expectObject)(await (0, F3.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, F1.take)(G, {
          invocationArn: F1.expectString
        });
      return Object.assign(B, Z), B
    }, "de_StartAsyncInvokeCommand"),
    $f = A1(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, F3.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, F3.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.bedrockruntime#AccessDeniedException":
          throw await fx6(B, Q);
        case "InternalServerException":
        case "com.amazonaws.bedrockruntime#InternalServerException":
          throw await UfB(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.bedrockruntime#ResourceNotFoundException":
          throw await mx6(B, Q);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.bedrockruntime#ServiceQuotaExceededException":
          throw await dx6(B, Q);
        case "ThrottlingException":
        case "com.amazonaws.bedrockruntime#ThrottlingException":
          throw await NfB(B, Q);
        case "ValidationException":
        case "com.amazonaws.bedrockruntime#ValidationException":
          throw await LfB(B, Q);
        case "ModelErrorException":
        case "com.amazonaws.bedrockruntime#ModelErrorException":
          throw await gx6(B, Q);
        case "ModelNotReadyException":
        case "com.amazonaws.bedrockruntime#ModelNotReadyException":
          throw await ux6(B, Q);
        case "ModelTimeoutException":
        case "com.amazonaws.bedrockruntime#ModelTimeoutException":
          throw await wfB(B, Q);
        case "ServiceUnavailableException":
        case "com.amazonaws.bedrockruntime#ServiceUnavailableException":
          throw await qfB(B, Q);
        case "ModelStreamErrorException":
        case "com.amazonaws.bedrockruntime#ModelStreamErrorException":
          throw await $fB(B, Q);
        case "ConflictException":
        case "com.amazonaws.bedrockruntime#ConflictException":
          throw await hx6(B, Q);
        default:
          let Z = B.body;
          return bx6({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    bx6 = (0, F1.withBaseException)(UU),
    fx6 = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new ubB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    hx6 = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new pbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ConflictExceptionRes"),
    UfB = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new mbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    gx6 = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString,
          originalStatusCode: F1.expectInt32,
          resourceName: F1.expectString
        });
      Object.assign(B, Z);
      let I = new abB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ModelErrorExceptionRes"),
    ux6 = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new sbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ModelNotReadyExceptionRes"),
    $fB = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString,
          originalMessage: F1.expectString,
          originalStatusCode: F1.expectInt32
        });
      Object.assign(B, Z);
      let I = new obB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ModelStreamErrorExceptionRes"),
    wfB = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new rbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ModelTimeoutExceptionRes"),
    mx6 = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new lbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    dx6 = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new ibB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ServiceQuotaExceededExceptionRes"),
    qfB = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new nbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ServiceUnavailableExceptionRes"),
    NfB = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new dbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ThrottlingExceptionRes"),
    LfB = A1(async (A, Q) => {
      let B = (0, F1.map)({}),
        G = A.body,
        Z = (0, F1.take)(G, {
          message: F1.expectString
        });
      Object.assign(B, Z);
      let I = new cbB({
        $metadata: RW(A),
        ...B
      });
      return (0, F1.decorateServiceException)(I, A.body)
    }, "de_ValidationExceptionRes"),
    cx6 = A1((A, Q) => {
      let B = A1((G) => PtA.visit(G, {
        chunk: A1((Z) => px6(Z, Q), "chunk"),
        _: A1((Z) => Z, "_")
      }), "eventMarshallingVisitor");
      return Q.eventStreamMarshaller.serialize(A, B)
    }, "se_InvokeModelWithBidirectionalStreamInput"),
    px6 = A1((A, Q) => {
      let B = {
          ":event-type": {
            type: "string",
            value: "chunk"
          },
          ":message-type": {
            type: "string",
            value: "event"
          },
          ":content-type": {
            type: "string",
            value: "application/json"
          }
        },
        G = new Uint8Array;
      return G = Bv6(A, Q), G = Q.utf8Decoder(JSON.stringify(G)), {
        headers: B,
        body: G
      }
    }, "se_BidirectionalInputPayloadPart_event"),
    lx6 = A1((A, Q) => {
      return Q.eventStreamMarshaller.deserialize(A, async (B) => {
        if (B.messageStart != null) return {
          messageStart: await ex6(B.messageStart, Q)
        };
        if (B.contentBlockStart != null) return {
          contentBlockStart: await rx6(B.contentBlockStart, Q)
        };
        if (B.contentBlockDelta != null) return {
          contentBlockDelta: await sx6(B.contentBlockDelta, Q)
        };
        if (B.contentBlockStop != null) return {
          contentBlockStop: await ox6(B.contentBlockStop, Q)
        };
        if (B.messageStop != null) return {
          messageStop: await Av6(B.messageStop, Q)
        };
        if (B.metadata != null) return {
          metadata: await tx6(B.metadata, Q)
        };
        if (B.internalServerException != null) return {
          internalServerException: await Fp1(B.internalServerException, Q)
        };
        if (B.modelStreamErrorException != null) return {
          modelStreamErrorException: await Kp1(B.modelStreamErrorException, Q)
        };
        if (B.validationException != null) return {
          validationException: await Cp1(B.validationException, Q)
        };
        if (B.throttlingException != null) return {
          throttlingException: await Hp1(B.throttlingException, Q)
        };
        if (B.serviceUnavailableException != null) return {
          serviceUnavailableException: await Dp1(B.serviceUnavailableException, Q)
        };
        return {
          $unknown: A
        }
      })
    }, "de_ConverseStreamOutput"),
    ix6 = A1((A, Q) => {
      return Q.eventStreamMarshaller.deserialize(A, async (B) => {
        if (B.chunk != null) return {
          chunk: await ax6(B.chunk, Q)
        };
        if (B.internalServerException != null) return {
          internalServerException: await Fp1(B.internalServerException, Q)
        };
        if (B.modelStreamErrorException != null) return {
          modelStreamErrorException: await Kp1(B.modelStreamErrorException, Q)
        };
        if (B.validationException != null) return {
          validationException: await Cp1(B.validationException, Q)
        };
        if (B.throttlingException != null) return {
          throttlingException: await Hp1(B.throttlingException, Q)
        };
        if (B.modelTimeoutException != null) return {
          modelTimeoutException: await MfB(B.modelTimeoutException, Q)
        };
        if (B.serviceUnavailableException != null) return {
          serviceUnavailableException: await Dp1(B.serviceUnavailableException, Q)
        };
        return {
          $unknown: A
        }
      })
    }, "de_InvokeModelWithBidirectionalStreamOutput"),
    nx6 = A1((A, Q) => {
      return Q.eventStreamMarshaller.deserialize(A, async (B) => {
        if (B.chunk != null) return {
          chunk: await Qv6(B.chunk, Q)
        };
        if (B.internalServerException != null) return {
          internalServerException: await Fp1(B.internalServerException, Q)
        };
        if (B.modelStreamErrorException != null) return {
          modelStreamErrorException: await Kp1(B.modelStreamErrorException, Q)
        };
        if (B.validationException != null) return {
          validationException: await Cp1(B.validationException, Q)
        };
        if (B.throttlingException != null) return {
          throttlingException: await Hp1(B.throttlingException, Q)
        };
        if (B.modelTimeoutException != null) return {
          modelTimeoutException: await MfB(B.modelTimeoutException, Q)
        };
        if (B.serviceUnavailableException != null) return {
          serviceUnavailableException: await Dp1(B.serviceUnavailableException, Q)
        };
        return {
          $unknown: A
        }
      })
    }, "de_ResponseStream"),
    ax6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, Pv6(G, Q)), B
    }, "de_BidirectionalOutputPayloadPart_event"),
    sx6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, _v6(G, Q)), B
    }, "de_ContentBlockDeltaEvent_event"),
    rx6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, (0, F1._json)(G)), B
    }, "de_ContentBlockStartEvent_event"),
    ox6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, (0, F1._json)(G)), B
    }, "de_ContentBlockStopEvent_event"),
    tx6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, xv6(G, Q)), B
    }, "de_ConverseStreamMetadataEvent_event"),
    Fp1 = A1(async (A, Q) => {
      let B = {
        ...A,
        body: await (0, F3.parseJsonBody)(A.body, Q)
      };
      return UfB(B, Q)
    }, "de_InternalServerException_event"),
    ex6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, (0, F1._json)(G)), B
    }, "de_MessageStartEvent_event"),
    Av6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, av6(G, Q)), B
    }, "de_MessageStopEvent_event"),
    Kp1 = A1(async (A, Q) => {
      let B = {
        ...A,
        body: await (0, F3.parseJsonBody)(A.body, Q)
      };
      return $fB(B, Q)
    }, "de_ModelStreamErrorException_event"),
    MfB = A1(async (A, Q) => {
      let B = {
        ...A,
        body: await (0, F3.parseJsonBody)(A.body, Q)
      };
      return wfB(B, Q)
    }, "de_ModelTimeoutException_event"),
    Qv6 = A1(async (A, Q) => {
      let B = {},
        G = await (0, F3.parseJsonBody)(A.body, Q);
      return Object.assign(B, sv6(G, Q)), B
    }, "de_PayloadPart_event"),
    Dp1 = A1(async (A, Q) => {
      let B = {
        ...A,
        body: await (0, F3.parseJsonBody)(A.body, Q)
      };
      return qfB(B, Q)
    }, "de_ServiceUnavailableException_event"),
    Hp1 = A1(async (A, Q) => {
      let B = {
        ...A,
        body: await (0, F3.parseJsonBody)(A.body, Q)
      };
      return NfB(B, Q)
    }, "de_ThrottlingException_event"),
    Cp1 = A1(async (A, Q) => {
      let B = {
        ...A,
        body: await (0, F3.parseJsonBody)(A.body, Q)
      };
      return LfB(B, Q)
    }, "de_ValidationException_event"),
    Bv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        bytes: Q.base64Encoder
      })
    }, "se_BidirectionalInputPayloadPart"),
    Gv6 = A1((A, Q) => {
      return MtA.visit(A, {
        cachePoint: A1((B) => ({
          cachePoint: (0, F1._json)(B)
        }), "cachePoint"),
        document: A1((B) => ({
          document: OfB(B, Q)
        }), "document"),
        guardContent: A1((B) => ({
          guardContent: RfB(B, Q)
        }), "guardContent"),
        image: A1((B) => ({
          image: TfB(B, Q)
        }), "image"),
        reasoningContent: A1((B) => ({
          reasoningContent: Cv6(B, Q)
        }), "reasoningContent"),
        text: A1((B) => ({
          text: B
        }), "text"),
        toolResult: A1((B) => ({
          toolResult: $v6(B, Q)
        }), "toolResult"),
        toolUse: A1((B) => ({
          toolUse: Mv6(B, Q)
        }), "toolUse"),
        video: A1((B) => ({
          video: kfB(B, Q)
        }), "video"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_ContentBlock"),
    Zv6 = A1((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return Gv6(B, Q)
      })
    }, "se_ContentBlocks"),
    OfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: [],
        name: [],
        source: A1((B) => Iv6(B, Q), "source")
      })
    }, "se_DocumentBlock"),
    Iv6 = A1((A, Q) => {
      return ztA.visit(A, {
        bytes: A1((B) => ({
          bytes: Q.base64Encoder(B)
        }), "bytes"),
        s3Location: A1((B) => ({
          s3Location: (0, F1._json)(B)
        }), "s3Location"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_DocumentSource"),
    Yv6 = A1((A, Q) => {
      return EtA.visit(A, {
        image: A1((B) => ({
          image: Vv6(B, Q)
        }), "image"),
        text: A1((B) => ({
          text: (0, F1._json)(B)
        }), "text"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_GuardrailContentBlock"),
    Jv6 = A1((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return Yv6(B, Q)
      })
    }, "se_GuardrailContentBlockList"),
    RfB = A1((A, Q) => {
      return $tA.visit(A, {
        image: A1((B) => ({
          image: Wv6(B, Q)
        }), "image"),
        text: A1((B) => ({
          text: (0, F1._json)(B)
        }), "text"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_GuardrailConverseContentBlock"),
    Wv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: [],
        source: A1((B) => Xv6(B, Q), "source")
      })
    }, "se_GuardrailConverseImageBlock"),
    Xv6 = A1((A, Q) => {
      return UtA.visit(A, {
        bytes: A1((B) => ({
          bytes: Q.base64Encoder(B)
        }), "bytes"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_GuardrailConverseImageSource"),
    Vv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: [],
        source: A1((B) => Fv6(B, Q), "source")
      })
    }, "se_GuardrailImageBlock"),
    Fv6 = A1((A, Q) => {
      return CtA.visit(A, {
        bytes: A1((B) => ({
          bytes: Q.base64Encoder(B)
        }), "bytes"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_GuardrailImageSource"),
    TfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: [],
        source: A1((B) => Kv6(B, Q), "source")
      })
    }, "se_ImageBlock"),
    Kv6 = A1((A, Q) => {
      return wtA.visit(A, {
        bytes: A1((B) => ({
          bytes: Q.base64Encoder(B)
        }), "bytes"),
        s3Location: A1((B) => ({
          s3Location: (0, F1._json)(B)
        }), "s3Location"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_ImageSource"),
    PfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        maxTokens: [],
        stopSequences: F1._json,
        temperature: F1.serializeFloat,
        topP: F1.serializeFloat
      })
    }, "se_InferenceConfiguration"),
    Dv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        content: A1((B) => Zv6(B, Q), "content"),
        role: []
      })
    }, "se_Message"),
    jfB = A1((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return Dv6(B, Q)
      })
    }, "se_Messages"),
    Hv6 = A1((A, Q) => {
      return A
    }, "se_ModelInputPayload"),
    Cv6 = A1((A, Q) => {
      return qtA.visit(A, {
        reasoningText: A1((B) => ({
          reasoningText: (0, F1._json)(B)
        }), "reasoningText"),
        redactedContent: A1((B) => ({
          redactedContent: Q.base64Encoder(B)
        }), "redactedContent"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_ReasoningContentBlock"),
    Ev6 = A1((A, Q) => {
      return OtA.visit(A, {
        cachePoint: A1((B) => ({
          cachePoint: (0, F1._json)(B)
        }), "cachePoint"),
        guardContent: A1((B) => ({
          guardContent: RfB(B, Q)
        }), "guardContent"),
        text: A1((B) => ({
          text: B
        }), "text"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_SystemContentBlock"),
    SfB = A1((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return Ev6(B, Q)
      })
    }, "se_SystemContentBlocks"),
    zv6 = A1((A, Q) => {
      return TtA.visit(A, {
        cachePoint: A1((B) => ({
          cachePoint: (0, F1._json)(B)
        }), "cachePoint"),
        toolSpec: A1((B) => ({
          toolSpec: Lv6(B, Q)
        }), "toolSpec"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_Tool"),
    _fB = A1((A, Q) => {
      return (0, F1.take)(A, {
        toolChoice: F1._json,
        tools: A1((B) => Nv6(B, Q), "tools")
      })
    }, "se_ToolConfiguration"),
    Uv6 = A1((A, Q) => {
      return RtA.visit(A, {
        json: A1((B) => ({
          json: HwA(B, Q)
        }), "json"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_ToolInputSchema"),
    $v6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        content: A1((B) => qv6(B, Q), "content"),
        status: [],
        toolUseId: []
      })
    }, "se_ToolResultBlock"),
    wv6 = A1((A, Q) => {
      return LtA.visit(A, {
        document: A1((B) => ({
          document: OfB(B, Q)
        }), "document"),
        image: A1((B) => ({
          image: TfB(B, Q)
        }), "image"),
        json: A1((B) => ({
          json: HwA(B, Q)
        }), "json"),
        text: A1((B) => ({
          text: B
        }), "text"),
        video: A1((B) => ({
          video: kfB(B, Q)
        }), "video"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_ToolResultContentBlock"),
    qv6 = A1((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return wv6(B, Q)
      })
    }, "se_ToolResultContentBlocks"),
    Nv6 = A1((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return zv6(B, Q)
      })
    }, "se_Tools"),
    Lv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        description: [],
        inputSchema: A1((B) => Uv6(B, Q), "inputSchema"),
        name: []
      })
    }, "se_ToolSpecification"),
    Mv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        input: A1((B) => HwA(B, Q), "input"),
        name: [],
        toolUseId: []
      })
    }, "se_ToolUseBlock"),
    kfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: [],
        source: A1((B) => Ov6(B, Q), "source")
      })
    }, "se_VideoBlock"),
    Ov6 = A1((A, Q) => {
      return NtA.visit(A, {
        bytes: A1((B) => ({
          bytes: Q.base64Encoder(B)
        }), "bytes"),
        s3Location: A1((B) => ({
          s3Location: (0, F1._json)(B)
        }), "s3Location"),
        _: A1((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_VideoSource"),
    HwA = A1((A, Q) => {
      return A
    }, "se_Document"),
    Rv6 = A1((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return Tv6(G, Q)
      })
    }, "de_AsyncInvokeSummaries"),
    Tv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        clientRequestToken: F1.expectString,
        endTime: A1((B) => (0, F1.expectNonNull)((0, F1.parseRfc3339DateTimeWithOffset)(B)), "endTime"),
        failureMessage: F1.expectString,
        invocationArn: F1.expectString,
        lastModifiedTime: A1((B) => (0, F1.expectNonNull)((0, F1.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        modelArn: F1.expectString,
        outputDataConfig: A1((B) => (0, F1._json)((0, F3.awsExpectUnion)(B)), "outputDataConfig"),
        status: F1.expectString,
        submitTime: A1((B) => (0, F1.expectNonNull)((0, F1.parseRfc3339DateTimeWithOffset)(B)), "submitTime")
      })
    }, "de_AsyncInvokeSummary"),
    Pv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        bytes: Q.base64Decoder
      })
    }, "de_BidirectionalOutputPayloadPart"),
    jv6 = A1((A, Q) => {
      if (A.cachePoint != null) return {
        cachePoint: (0, F1._json)(A.cachePoint)
      };
      if (A.document != null) return {
        document: yfB(A.document, Q)
      };
      if (A.guardContent != null) return {
        guardContent: cv6((0, F3.awsExpectUnion)(A.guardContent), Q)
      };
      if (A.image != null) return {
        image: ffB(A.image, Q)
      };
      if (A.reasoningContent != null) return {
        reasoningContent: rv6((0, F3.awsExpectUnion)(A.reasoningContent), Q)
      };
      if ((0, F1.expectString)(A.text) !== void 0) return {
        text: (0, F1.expectString)(A.text)
      };
      if (A.toolResult != null) return {
        toolResult: tv6(A.toolResult, Q)
      };
      if (A.toolUse != null) return {
        toolUse: Qb6(A.toolUse, Q)
      };
      if (A.video != null) return {
        video: hfB(A.video, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ContentBlock"),
    Sv6 = A1((A, Q) => {
      if (A.reasoningContent != null) return {
        reasoningContent: ov6((0, F3.awsExpectUnion)(A.reasoningContent), Q)
      };
      if ((0, F1.expectString)(A.text) !== void 0) return {
        text: (0, F1.expectString)(A.text)
      };
      if (A.toolUse != null) return {
        toolUse: (0, F1._json)(A.toolUse)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ContentBlockDelta"),
    _v6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        contentBlockIndex: F1.expectInt32,
        delta: A1((B) => Sv6((0, F3.awsExpectUnion)(B), Q), "delta")
      })
    }, "de_ContentBlockDeltaEvent"),
    kv6 = A1((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return jv6((0, F3.awsExpectUnion)(G), Q)
      })
    }, "de_ContentBlocks"),
    yv6 = A1((A, Q) => {
      if (A.message != null) return {
        message: nv6(A.message, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ConverseOutput"),
    xv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        metrics: F1._json,
        performanceConfig: F1._json,
        trace: A1((B) => vv6(B, Q), "trace"),
        usage: F1._json
      })
    }, "de_ConverseStreamMetadataEvent"),
    vv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        guardrail: A1((B) => bfB(B, Q), "guardrail"),
        promptRouter: F1._json
      })
    }, "de_ConverseStreamTrace"),
    bv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        guardrail: A1((B) => bfB(B, Q), "guardrail"),
        promptRouter: F1._json
      })
    }, "de_ConverseTrace"),
    yfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: F1.expectString,
        name: F1.expectString,
        source: A1((B) => fv6((0, F3.awsExpectUnion)(B), Q), "source")
      })
    }, "de_DocumentBlock"),
    fv6 = A1((A, Q) => {
      if (A.bytes != null) return {
        bytes: Q.base64Decoder(A.bytes)
      };
      if (A.s3Location != null) return {
        s3Location: (0, F1._json)(A.s3Location)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_DocumentSource"),
    xfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        contentPolicy: F1._json,
        contextualGroundingPolicy: A1((B) => dv6(B, Q), "contextualGroundingPolicy"),
        invocationMetrics: F1._json,
        sensitiveInformationPolicy: F1._json,
        topicPolicy: F1._json,
        wordPolicy: F1._json
      })
    }, "de_GuardrailAssessment"),
    vfB = A1((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return xfB(G, Q)
      })
    }, "de_GuardrailAssessmentList"),
    hv6 = A1((A, Q) => {
      return Object.entries(A).reduce((B, [G, Z]) => {
        if (Z === null) return B;
        return B[G] = vfB(Z, Q), B
      }, {})
    }, "de_GuardrailAssessmentListMap"),
    gv6 = A1((A, Q) => {
      return Object.entries(A).reduce((B, [G, Z]) => {
        if (Z === null) return B;
        return B[G] = xfB(Z, Q), B
      }, {})
    }, "de_GuardrailAssessmentMap"),
    uv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        action: F1.expectString,
        detected: F1.expectBoolean,
        score: F1.limitedParseDouble,
        threshold: F1.limitedParseDouble,
        type: F1.expectString
      })
    }, "de_GuardrailContextualGroundingFilter"),
    mv6 = A1((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return uv6(G, Q)
      })
    }, "de_GuardrailContextualGroundingFilters"),
    dv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        filters: A1((B) => mv6(B, Q), "filters")
      })
    }, "de_GuardrailContextualGroundingPolicyAssessment"),
    cv6 = A1((A, Q) => {
      if (A.image != null) return {
        image: pv6(A.image, Q)
      };
      if (A.text != null) return {
        text: (0, F1._json)(A.text)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_GuardrailConverseContentBlock"),
    pv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: F1.expectString,
        source: A1((B) => lv6((0, F3.awsExpectUnion)(B), Q), "source")
      })
    }, "de_GuardrailConverseImageBlock"),
    lv6 = A1((A, Q) => {
      if (A.bytes != null) return {
        bytes: Q.base64Decoder(A.bytes)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_GuardrailConverseImageSource"),
    bfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        actionReason: F1.expectString,
        inputAssessment: A1((B) => gv6(B, Q), "inputAssessment"),
        modelOutput: F1._json,
        outputAssessments: A1((B) => hv6(B, Q), "outputAssessments")
      })
    }, "de_GuardrailTraceAssessment"),
    ffB = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: F1.expectString,
        source: A1((B) => iv6((0, F3.awsExpectUnion)(B), Q), "source")
      })
    }, "de_ImageBlock"),
    iv6 = A1((A, Q) => {
      if (A.bytes != null) return {
        bytes: Q.base64Decoder(A.bytes)
      };
      if (A.s3Location != null) return {
        s3Location: (0, F1._json)(A.s3Location)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ImageSource"),
    nv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        content: A1((B) => kv6(B, Q), "content"),
        role: F1.expectString
      })
    }, "de_Message"),
    av6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        additionalModelResponseFields: A1((B) => _tA(B, Q), "additionalModelResponseFields"),
        stopReason: F1.expectString
      })
    }, "de_MessageStopEvent"),
    sv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        bytes: Q.base64Decoder
      })
    }, "de_PayloadPart"),
    rv6 = A1((A, Q) => {
      if (A.reasoningText != null) return {
        reasoningText: (0, F1._json)(A.reasoningText)
      };
      if (A.redactedContent != null) return {
        redactedContent: Q.base64Decoder(A.redactedContent)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ReasoningContentBlock"),
    ov6 = A1((A, Q) => {
      if (A.redactedContent != null) return {
        redactedContent: Q.base64Decoder(A.redactedContent)
      };
      if ((0, F1.expectString)(A.signature) !== void 0) return {
        signature: (0, F1.expectString)(A.signature)
      };
      if ((0, F1.expectString)(A.text) !== void 0) return {
        text: (0, F1.expectString)(A.text)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ReasoningContentBlockDelta"),
    tv6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        content: A1((B) => Ab6(B, Q), "content"),
        status: F1.expectString,
        toolUseId: F1.expectString
      })
    }, "de_ToolResultBlock"),
    ev6 = A1((A, Q) => {
      if (A.document != null) return {
        document: yfB(A.document, Q)
      };
      if (A.image != null) return {
        image: ffB(A.image, Q)
      };
      if (A.json != null) return {
        json: _tA(A.json, Q)
      };
      if ((0, F1.expectString)(A.text) !== void 0) return {
        text: (0, F1.expectString)(A.text)
      };
      if (A.video != null) return {
        video: hfB(A.video, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_ToolResultContentBlock"),
    Ab6 = A1((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return ev6((0, F3.awsExpectUnion)(G), Q)
      })
    }, "de_ToolResultContentBlocks"),
    Qb6 = A1((A, Q) => {
      return (0, F1.take)(A, {
        input: A1((B) => _tA(B, Q), "input"),
        name: F1.expectString,
        toolUseId: F1.expectString
      })
    }, "de_ToolUseBlock"),
    hfB = A1((A, Q) => {
      return (0, F1.take)(A, {
        format: F1.expectString,
        source: A1((B) => Bb6((0, F3.awsExpectUnion)(B), Q), "source")
      })
    }, "de_VideoBlock"),
    Bb6 = A1((A, Q) => {
      if (A.bytes != null) return {
        bytes: Q.base64Decoder(A.bytes)
      };
      if (A.s3Location != null) return {
        s3Location: (0, F1._json)(A.s3Location)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_VideoSource"),
    _tA = A1((A, Q) => {
      return A
    }, "de_Document"),
    RW = A1((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    Jp1 = "accept",
    ktA = "contentType",
    Ep1 = "content-type",
    gfB = "guardrailIdentifier",
    ufB = "guardrailVersion",
    _bB = "maxResults",
    kbB = "nextToken",
    ytA = "performanceConfigLatency",
    ybB = "sortBy",
    xbB = "statusEquals",
    vbB = "sortOrder",
    bbB = "submitTimeAfter",
    fbB = "submitTimeBefore",
    mfB = "trace",
    Gb6 = "x-amzn-bedrock-accept",
    Zb6 = "x-amzn-bedrock-content-type",
    dfB = "x-amzn-bedrock-guardrailidentifier",
    cfB = "x-amzn-bedrock-guardrailversion",
    xtA = "x-amzn-bedrock-performanceconfig-latency",
    pfB = "x-amzn-bedrock-trace",
    lfB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ApplyGuardrail", {}).n("BedrockRuntimeClient", "ApplyGuardrailCommand").f(GfB, void 0).ser(Ux6).de(Tx6).build() {
      static {
        A1(this, "ApplyGuardrailCommand")
      }
    },
    ifB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "Converse", {}).n("BedrockRuntimeClient", "ConverseCommand").f(IfB, JfB).ser($x6).de(Px6).build() {
      static {
        A1(this, "ConverseCommand")
      }
    },
    nfB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ConverseStream", {
      eventStream: {
        output: !0
      }
    }).n("BedrockRuntimeClient", "ConverseStreamCommand").f(WfB, FfB).ser(wx6).de(jx6).build() {
      static {
        A1(this, "ConverseStreamCommand")
      }
    },
    afB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "GetAsyncInvoke", {}).n("BedrockRuntimeClient", "GetAsyncInvokeCommand").f(void 0, tbB).ser(qx6).de(Sx6).build() {
      static {
        A1(this, "GetAsyncInvokeCommand")
      }
    },
    sfB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModel", {}).n("BedrockRuntimeClient", "InvokeModelCommand").f(KfB, DfB).ser(Nx6).de(_x6).build() {
      static {
        A1(this, "InvokeModelCommand")
      }
    },
    rfB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions()), (0, gbB.getEventStreamPlugin)(B)]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithBidirectionalStream", {
      eventStream: {
        input: !0,
        output: !0
      }
    }).n("BedrockRuntimeClient", "InvokeModelWithBidirectionalStreamCommand").f(HfB, CfB).ser(Lx6).de(kx6).build() {
      static {
        A1(this, "InvokeModelWithBidirectionalStreamCommand")
      }
    },
    ofB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithResponseStream", {
      eventStream: {
        output: !0
      }
    }).n("BedrockRuntimeClient", "InvokeModelWithResponseStreamCommand").f(EfB, zfB).ser(Mx6).de(yx6).build() {
      static {
        A1(this, "InvokeModelWithResponseStreamCommand")
      }
    },
    zp1 = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ListAsyncInvokes", {}).n("BedrockRuntimeClient", "ListAsyncInvokesCommand").f(void 0, AfB).ser(Ox6).de(xx6).build() {
      static {
        A1(this, "ListAsyncInvokesCommand")
      }
    },
    tfB = class extends F1.Command.classBuilder().ep(zf).m(function(A, Q, B, G) {
      return [(0, Uf.getSerdePlugin)(B, this.serialize, this.deserialize), (0, r_.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "StartAsyncInvoke", {}).n("BedrockRuntimeClient", "StartAsyncInvokeCommand").f(QfB, void 0).ser(Rx6).de(vx6).build() {
      static {
        A1(this, "StartAsyncInvokeCommand")
      }
    },
    Ib6 = {
      ApplyGuardrailCommand: lfB,
      ConverseCommand: ifB,
      ConverseStreamCommand: nfB,
      GetAsyncInvokeCommand: afB,
      InvokeModelCommand: sfB,
      InvokeModelWithBidirectionalStreamCommand: rfB,
      InvokeModelWithResponseStreamCommand: ofB,
      ListAsyncInvokesCommand: zp1,
      StartAsyncInvokeCommand: tfB
    },
    efB = class extends Wp1 {
      static {
        A1(this, "BedrockRuntime")
      }
    };
  (0, F1.createAggregatedClient)(Ib6, efB);
  var Yb6 = (0, Zq.createPaginator)(Wp1, zp1, "nextToken", "nextToken", "maxResults")
})
// @from(Start 7172543, End 7172545)
hZ
// @from(Start 7172547, End 7172549)
bp
// @from(Start 7172551, End 7172826)
Jb6 = async (A, Q) => {
  let B = hZ.map({}),
    G = A.body,
    Z = hZ.take(G, {
      message: hZ.expectString
    });
  Object.assign(B, Z);
  let I = new bp.InternalServerException({
    $metadata: vtA(A),
    ...B
  });
  return hZ.decorateServiceException(I, A.body)
}
// @from(Start 7172828, End 7173187)
Wb6 = async (A, Q) => {
  let B = hZ.map({}),
    G = A.body,
    Z = hZ.take(G, {
      message: hZ.expectString,
      originalMessage: hZ.expectString,
      originalStatusCode: hZ.expectInt32
    });
  Object.assign(B, Z);
  let I = new bp.ModelStreamErrorException({
    $metadata: vtA(A),
    ...B
  });
  return hZ.decorateServiceException(I, A.body)
}
// @from(Start 7173189, End 7173460)
Xb6 = async (A, Q) => {
  let B = hZ.map({}),
    G = A.body,
    Z = hZ.take(G, {
      message: hZ.expectString
    });
  Object.assign(B, Z);
  let I = new bp.ThrottlingException({
    $metadata: vtA(A),
    ...B
  });
  return hZ.decorateServiceException(I, A.body)
}
// @from(Start 7173462, End 7173733)
Vb6 = async (A, Q) => {
  let B = hZ.map({}),
    G = A.body,
    Z = hZ.take(G, {
      message: hZ.expectString
    });
  Object.assign(B, Z);
  let I = new bp.ValidationException({
    $metadata: vtA(A),
    ...B
  });
  return hZ.decorateServiceException(I, A.body)
}
// @from(Start 7173735, End 7174437)
BhB = (A, Q) => {
  return Q.eventStreamMarshaller.deserialize(A, async (B) => {
    if (B.chunk != null) return {
      chunk: await Db6(B.chunk, Q)
    };
    if (B.internalServerException != null) return {
      internalServerException: await Fb6(B.internalServerException, Q)
    };
    if (B.modelStreamErrorException != null) return {
      modelStreamErrorException: await Kb6(B.modelStreamErrorException, Q)
    };
    if (B.validationException != null) return {
      validationException: await Cb6(B.validationException, Q)
    };
    if (B.throttlingException != null) return {
      throttlingException: await Hb6(B.throttlingException, Q)
    };
    return {
      $unknown: A
    }
  })
}
// @from(Start 7174439, End 7174541)
Fb6 = async (A, Q) => {
  let B = {
    ...A,
    body: await CwA(A.body, Q)
  };
  return Jb6(B, Q)
}
// @from(Start 7174543, End 7174645)
Kb6 = async (A, Q) => {
  let B = {
    ...A,
    body: await CwA(A.body, Q)
  };
  return Wb6(B, Q)
}
// @from(Start 7174647, End 7174756)
Db6 = async (A, Q) => {
  let B = {},
    G = await CwA(A.body, Q);
  return Object.assign(B, Eb6(G, Q)), B
}
// @from(Start 7174758, End 7174860)
Hb6 = async (A, Q) => {
  let B = {
    ...A,
    body: await CwA(A.body, Q)
  };
  return Xb6(B, Q)
}
// @from(Start 7174862, End 7174964)
Cb6 = async (A, Q) => {
  let B = {
    ...A,
    body: await CwA(A.body, Q)
  };
  return Vb6(B, Q)
}
// @from(Start 7174966, End 7175039)
Eb6 = (A, Q) => {
  return hZ.take(A, {
    bytes: Q.base64Decoder
  })
}
// @from(Start 7175041, End 7175299)
vtA = (A) => ({
  httpStatusCode: A.statusCode,
  requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"] ?? "",
  extendedRequestId: A.headers["x-amz-id-2"] ?? "",
  cfId: A.headers["x-amz-cf-id"] ?? ""
})
// @from(Start 7175301, End 7175367)
zb6 = (A, Q) => hZ.collectBody(A, Q).then((B) => Q.utf8Encoder(B))
// @from(Start 7175369, End 7175461)
CwA = (A, Q) => zb6(A, Q).then((B) => {
  if (B.length) return JSON.parse(B);
  return {}
})
// @from(Start 7175467, End 7175524)
GhB = L(() => {
  hZ = BA(jkB(), 1), bp = BA(QhB(), 1)
})
// @from(Start 7175527, End 7176012)
function ZhB(A) {
  if (A[Symbol.asyncIterator]) return A;
  let Q = A.getReader();
  return {
    async next() {
      try {
        let B = await Q.read();
        if (B?.done) Q.releaseLock();
        return B
      } catch (B) {
        throw Q.releaseLock(), B
      }
    },
    async return () {
      let B = Q.cancel();
      return Q.releaseLock(), await B, {
        done: !0,
        value: void 0
      }
    },
    [Symbol.asyncIterator]() {
      return this
    }
  }
}
// @from(Start 7176017, End 7176042)
Up1 = L(() => {
  pC()
})
// @from(Start 7176045, End 7176129)
function btA(A) {
  return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Start 7176134, End 7176176)
$p1 = (A) => ($p1 = Array.isArray, $p1(A))
// @from(Start 7176180, End 7176183)
wp1
// @from(Start 7176185, End 7176277)
IhB = (A) => {
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }
// @from(Start 7176283, End 7176322)
EwA = L(() => {
  Up1();
  wp1 = $p1
})
// @from(Start 7176325, End 7176342)
function zwA() {}
// @from(Start 7176344, End 7176437)
function ftA(A, Q, B) {
  if (!Q || YhB[A] > YhB[B]) return zwA;
  else return Q[A].bind(Q)
}
// @from(Start 7176439, End 7176754)
function WhB(A) {
  let Q = A.logger,
    B = A.logLevel ?? "off";
  if (!Q) return Ub6;
  let G = JhB.get(Q);
  if (G && G[0] === B) return G[1];
  let Z = {
    error: ftA("error", Q, B),
    warn: ftA("warn", Q, B),
    info: ftA("info", Q, B),
    debug: ftA("debug", Q, B)
  };
  return JhB.set(Q, [B, Z]), Z
}
// @from(Start 7176759, End 7176762)
YhB
// @from(Start 7176764, End 7176767)
Ub6
// @from(Start 7176769, End 7176772)
JhB
// @from(Start 7176778, End 7176987)
XhB = L(() => {
  EwA();
  YhB = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
  };
  Ub6 = {
    error: zwA,
    warn: zwA,
    info: zwA,
    debug: zwA
  }, JhB = new WeakMap
})
// @from(Start 7176990, End 7177183)
function wb6(A) {
  return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Start 7177188, End 7177191)
FhB
// @from(Start 7177193, End 7177196)
htA
// @from(Start 7177198, End 7177201)
KhB
// @from(Start 7177203, End 7177250)
qp1 = (A) => new TextDecoder("utf-8").decode(A)
// @from(Start 7177254, End 7177294)
VhB = (A) => new TextEncoder().encode(A)
// @from(Start 7177298, End 7177628)
$b6 = () => {
    let A = new FhB.EventStreamMarshaller({
      utf8Encoder: qp1,
      utf8Decoder: VhB
    });
    return {
      base64Decoder: htA.fromBase64,
      base64Encoder: htA.toBase64,
      utf8Decoder: VhB,
      utf8Encoder: qp1,
      eventStreamMarshaller: A,
      streamCollector: KhB.streamCollector
    }
  }
// @from(Start 7177632, End 7177635)
gtA
// @from(Start 7177641, End 7179689)
DhB = L(() => {
  QvA();
  Yr();
  p_();
  GhB();
  EwA();
  XhB();
  FhB = BA(uSB(), 1), htA = BA(sd1(), 1), KhB = BA(Ld1(), 1);
  gtA = class gtA extends lC {
    static fromSSEResponse(A, Q, B) {
      let G = !1,
        Z = B ? WhB(B) : console;
      async function* I() {
        if (!A.body) throw Q.abort(), new vB("Attempted to iterate over a response with no body");
        let J = ZhB(A.body),
          W = BhB(J, $b6());
        for await (let X of W) if (X.chunk && X.chunk.bytes) yield {
          event: "chunk",
          data: qp1(X.chunk.bytes),
          raw: []
        };
        else if (X.internalServerException) yield {
          event: "error",
          data: "InternalServerException",
          raw: []
        };
        else if (X.modelStreamErrorException) yield {
          event: "error",
          data: "ModelStreamErrorException",
          raw: []
        };
        else if (X.validationException) yield {
          event: "error",
          data: "ValidationException",
          raw: []
        };
        else if (X.throttlingException) yield {
          event: "error",
          data: "ThrottlingException",
          raw: []
        }
      }
      async function* Y() {
        if (G) throw Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        G = !0;
        let J = !1;
        try {
          for await (let W of I()) {
            if (W.event === "chunk") try {
              yield JSON.parse(W.data)
            } catch (X) {
              throw Z.error("Could not parse message into JSON:", W.data), Z.error("From chunk:", W.raw), X
            }
            if (W.event === "error") {
              let X = W.data,
                V = IhB(X),
                F = V ? void 0 : X;
              throw n2.generate(void 0, V, F, A.headers)
            }
          }
          J = !0
        } catch (W) {
          if (wb6(W)) return;
          throw W
        } finally {
          if (!J) Q.abort()
        }
      }
      return new gtA(Y, Q)
    }
  }
})
// @from(Start 7179695, End 7179895)
Np1 = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Start 7179898, End 7180529)
function* qb6(A) {
  if (!A) return;
  if (HhB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let I of Z) yield [I, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (wp1(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let I = wp1(G[1]) ? G[1] : [G[1]],
      Y = !1;
    for (let J of I) {
      if (J === void 0) continue;
      if (Q && !Y) Y = !0, yield [Z, null];
      yield [Z, J]
    }
  }
}
// @from(Start 7180534, End 7180537)
HhB
// @from(Start 7180539, End 7180897)
Lp1 = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [I, Y] of qb6(G)) {
      let J = I.toLowerCase();
      if (!Z.has(J)) Q.delete(I), Z.add(J);
      if (Y === null) Q.delete(I), B.add(J);
      else Q.append(I, Y), B.delete(J)
    }
  }
  return {
    [HhB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Start 7180903, End 7180981)
ChB = L(() => {
  EwA();
  HhB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Start 7180984, End 7181078)
function zhB(A) {
  return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Start 7181083, End 7181086)
EhB