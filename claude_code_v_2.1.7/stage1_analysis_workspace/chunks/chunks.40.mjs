
// @from(Ln 105352, Col 4)
RmQ = U((C43) => {
  var F43 = du1(),
    H43 = (A) => {
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
    E43 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class LmQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = F43.FieldPosition.HEADER,
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
  class OmQ {
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
  class xsA {
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
      let Q = new xsA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = z43(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return xsA.clone(this)
    }
  }

  function z43(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class MmQ {
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

  function $43(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  C43.Field = LmQ;
  C43.Fields = OmQ;
  C43.HttpRequest = xsA;
  C43.HttpResponse = MmQ;
  C43.getHttpHandlerExtensionConfiguration = H43;
  C43.isValidHostname = $43;
  C43.resolveHttpHandlerRuntimeConfig = E43
})
// @from(Ln 105494, Col 4)
XtA = U((nm1) => {
  var umQ = ihQ(),
    _mQ = bg(),
    R43 = fg(),
    _43 = hg(),
    jmQ = $v(),
    mmQ = HuQ(),
    j43 = RD(),
    ysA = rG(),
    yq = WX(),
    T43 = EuQ(),
    P43 = ag(),
    cT = yT(),
    TmQ = RH(),
    SH = GLA(),
    PmQ = su1(),
    S43 = wmQ(),
    SmQ = vT(),
    xmQ = RmQ(),
    x43 = (A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "bedrock"
      })
    },
    vv = {
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
    y43 = (A) => {
      let {
        httpAuthSchemes: Q,
        httpAuthSchemeProvider: B,
        credentials: G,
        token: Z
      } = A;
      return {
        setHttpAuthScheme(Y) {
          let J = Q.findIndex((X) => X.schemeId === Y.schemeId);
          if (J === -1) Q.push(Y);
          else Q.splice(J, 1, Y)
        },
        httpAuthSchemes() {
          return Q
        },
        setHttpAuthSchemeProvider(Y) {
          B = Y
        },
        httpAuthSchemeProvider() {
          return B
        },
        setCredentials(Y) {
          G = Y
        },
        credentials() {
          return G
        },
        setToken(Y) {
          Z = Y
        },
        token() {
          return Z
        }
      }
    },
    v43 = (A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials(),
        token: A.token()
      }
    },
    k43 = (A, Q) => {
      let B = Object.assign(SmQ.getAwsRegionExtensionConfiguration(A), SH.getDefaultExtensionConfiguration(A), xmQ.getHttpHandlerExtensionConfiguration(A), y43(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, SmQ.resolveAwsRegionExtensionConfiguration(B), SH.resolveDefaultRuntimeConfig(B), xmQ.resolveHttpHandlerRuntimeConfig(B), v43(B))
    };
  class ksA extends SH.Client {
    config;
    constructor(...[A]) {
      let Q = S43.getRuntimeConfig(A || {});
      super(Q);
      this.initConfig = Q;
      let B = x43(Q),
        G = jmQ.resolveUserAgentConfig(B),
        Z = TmQ.resolveRetryConfig(G),
        Y = j43.resolveRegionConfig(Z),
        J = _mQ.resolveHostHeaderConfig(Y),
        X = cT.resolveEndpointConfig(J),
        I = T43.resolveEventStreamSerdeConfig(X),
        D = PmQ.resolveHttpAuthSchemeConfig(I),
        W = umQ.resolveEventStreamConfig(D),
        K = mmQ.resolveWebSocketConfig(W),
        V = k43(K, A?.extensions || []);
      this.config = V, this.middlewareStack.use(yq.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(jmQ.getUserAgentPlugin(this.config)), this.middlewareStack.use(TmQ.getRetryPlugin(this.config)), this.middlewareStack.use(P43.getContentLengthPlugin(this.config)), this.middlewareStack.use(_mQ.getHostHeaderPlugin(this.config)), this.middlewareStack.use(R43.getLoggerPlugin(this.config)), this.middlewareStack.use(_43.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(ysA.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: PmQ.defaultBedrockRuntimeHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (F) => new ysA.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": F.credentials,
          "smithy.api#httpBearerAuth": F.token
        })
      })), this.middlewareStack.use(ysA.getHttpSigningPlugin(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  var vq = class A extends SH.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    dmQ = class A extends vq {
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
    cmQ = class A extends vq {
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
    pmQ = class A extends vq {
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
    lmQ = class A extends vq {
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
    imQ = class A extends vq {
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
    nmQ = class A extends vq {
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
    amQ = class A extends vq {
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
    omQ = class A extends vq {
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
    rmQ = class A extends vq {
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
    smQ = class A extends vq {
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
    tmQ = class A extends vq {
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
    emQ = class A extends vq {
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
    b43 = "Accept",
    f43 = "AccessDeniedException",
    h43 = "ApplyGuardrail",
    g43 = "ApplyGuardrailRequest",
    u43 = "ApplyGuardrailResponse",
    m43 = "AsyncInvokeMessage",
    d43 = "AsyncInvokeOutputDataConfig",
    c43 = "AsyncInvokeSummary",
    p43 = "AsyncInvokeS3OutputDataConfig",
    l43 = "AsyncInvokeSummaries",
    i43 = "AnyToolChoice",
    n43 = "AutoToolChoice",
    a43 = "Body",
    o43 = "BidirectionalInputPayloadPart",
    r43 = "BidirectionalOutputPayloadPart",
    s43 = "Citation",
    t43 = "ContentBlocks",
    e43 = "ContentBlockDelta",
    A63 = "ContentBlockDeltaEvent",
    Q63 = "ContentBlockStart",
    B63 = "ContentBlockStartEvent",
    G63 = "ContentBlockStopEvent",
    Z63 = "ContentBlock",
    Y63 = "CitationsConfig",
    J63 = "CitationsContentBlock",
    X63 = "CitationsDelta",
    I63 = "ConflictException",
    D63 = "CitationGeneratedContent",
    W63 = "CitationGeneratedContentList",
    K63 = "CitationLocation",
    V63 = "ConverseMetrics",
    F63 = "ConverseOutput",
    H63 = "CachePointBlock",
    E63 = "ConverseRequest",
    z63 = "ConverseResponse",
    $63 = "ConverseStream",
    C63 = "CitationSourceContent",
    U63 = "CitationSourceContentDelta",
    q63 = "CitationSourceContentList",
    N63 = "CitationSourceContentListDelta",
    w63 = "ConverseStreamMetrics",
    L63 = "ConverseStreamMetadataEvent",
    O63 = "ConverseStreamOutput",
    M63 = "ConverseStreamRequest",
    R63 = "ConverseStreamResponse",
    _63 = "ConverseStreamTrace",
    j63 = "ConverseTrace",
    T63 = "CountTokensInput",
    P63 = "ConverseTokensRequest",
    S63 = "CountTokensRequest",
    x63 = "CountTokensResponse",
    Jm1 = "Content-Type",
    y63 = "CountTokens",
    v63 = "Citations",
    k63 = "Converse",
    b63 = "DocumentBlock",
    f63 = "DocumentContentBlocks",
    h63 = "DocumentContentBlock",
    g63 = "DocumentCharLocation",
    u63 = "DocumentChunkLocation",
    m63 = "DocumentPageLocation",
    d63 = "DocumentSource",
    c63 = "GuardrailAssessment",
    p63 = "GetAsyncInvoke",
    l63 = "GetAsyncInvokeRequest",
    i63 = "GetAsyncInvokeResponse",
    n63 = "GuardrailAssessmentList",
    a63 = "GuardrailAssessmentListMap",
    o63 = "GuardrailAssessmentMap",
    r63 = "GuardrailAutomatedReasoningDifferenceScenarioList",
    s63 = "GuardrailAutomatedReasoningFinding",
    t63 = "GuardrailAutomatedReasoningFindingList",
    e63 = "GuardrailAutomatedReasoningImpossibleFinding",
    A33 = "GuardrailAutomatedReasoningInvalidFinding",
    Q33 = "GuardrailAutomatedReasoningInputTextReference",
    B33 = "GuardrailAutomatedReasoningInputTextReferenceList",
    G33 = "GuardrailAutomatedReasoningLogicWarning",
    Z33 = "GuardrailAutomatedReasoningNoTranslationsFinding",
    Y33 = "GuardrailAutomatedReasoningPolicyAssessment",
    J33 = "GuardrailAutomatedReasoningRule",
    X33 = "GuardrailAutomatedReasoningRuleList",
    I33 = "GuardrailAutomatedReasoningScenario",
    D33 = "GuardrailAutomatedReasoningSatisfiableFinding",
    W33 = "GuardrailAutomatedReasoningStatementList",
    K33 = "GuardrailAutomatedReasoningStatementLogicContent",
    V33 = "GuardrailAutomatedReasoningStatementNaturalLanguageContent",
    F33 = "GuardrailAutomatedReasoningStatement",
    H33 = "GuardrailAutomatedReasoningTranslation",
    E33 = "GuardrailAutomatedReasoningTranslationAmbiguousFinding",
    z33 = "GuardrailAutomatedReasoningTooComplexFinding",
    $33 = "GuardrailAutomatedReasoningTranslationList",
    C33 = "GuardrailAutomatedReasoningTranslationOption",
    U33 = "GuardrailAutomatedReasoningTranslationOptionList",
    q33 = "GuardrailAutomatedReasoningValidFinding",
    N33 = "GuardrailConfiguration",
    w33 = "GuardrailContentBlock",
    L33 = "GuardrailContentBlockList",
    O33 = "GuardrailConverseContentBlock",
    M33 = "GuardrailContentFilter",
    R33 = "GuardrailContentFilterList",
    _33 = "GuardrailContextualGroundingFilter",
    j33 = "GuardrailContextualGroundingFilters",
    T33 = "GuardrailContextualGroundingPolicyAssessment",
    P33 = "GuardrailConverseImageBlock",
    S33 = "GuardrailConverseImageSource",
    x33 = "GuardrailContentPolicyAssessment",
    y33 = "GuardrailConverseTextBlock",
    v33 = "GuardrailCustomWord",
    k33 = "GuardrailCustomWordList",
    b33 = "GuardrailCoverage",
    f33 = "GuardrailImageBlock",
    h33 = "GuardrailImageCoverage",
    g33 = "GuardrailInvocationMetrics",
    u33 = "GuardrailImageSource",
    m33 = "GuardrailManagedWord",
    d33 = "GuardrailManagedWordList",
    c33 = "GuardrailOutputContent",
    p33 = "GuardrailOutputContentList",
    l33 = "GuardrailPiiEntityFilter",
    i33 = "GuardrailPiiEntityFilterList",
    n33 = "GuardrailRegexFilter",
    a33 = "GuardrailRegexFilterList",
    o33 = "GuardrailStreamConfiguration",
    r33 = "GuardrailSensitiveInformationPolicyAssessment",
    s33 = "GuardrailTopic",
    t33 = "GuardrailTraceAssessment",
    e33 = "GuardrailTextBlock",
    A83 = "GuardrailTextCharactersCoverage",
    Q83 = "GuardrailTopicList",
    B83 = "GuardrailTopicPolicyAssessment",
    G83 = "GuardrailUsage",
    Z83 = "GuardrailWordPolicyAssessment",
    Y83 = "ImageBlock",
    J83 = "InferenceConfiguration",
    X83 = "InvokeModel",
    I83 = "InvokeModelRequest",
    D83 = "InvokeModelResponse",
    W83 = "InvokeModelTokensRequest",
    K83 = "InvokeModelWithBidirectionalStream",
    V83 = "InvokeModelWithBidirectionalStreamInput",
    F83 = "InvokeModelWithBidirectionalStreamOutput",
    H83 = "InvokeModelWithBidirectionalStreamRequest",
    E83 = "InvokeModelWithBidirectionalStreamResponse",
    z83 = "InvokeModelWithResponseStream",
    $83 = "InvokeModelWithResponseStreamRequest",
    C83 = "InvokeModelWithResponseStreamResponse",
    U83 = "ImageSource",
    q83 = "InternalServerException",
    N83 = "ListAsyncInvokes",
    w83 = "ListAsyncInvokesRequest",
    L83 = "ListAsyncInvokesResponse",
    O83 = "Message",
    M83 = "ModelErrorException",
    R83 = "ModelInputPayload",
    _83 = "ModelNotReadyException",
    j83 = "MessageStartEvent",
    T83 = "ModelStreamErrorException",
    P83 = "MessageStopEvent",
    S83 = "ModelTimeoutException",
    x83 = "Messages",
    y83 = "PartBody",
    v83 = "PerformanceConfiguration",
    k83 = "PayloadPart",
    b83 = "PromptRouterTrace",
    f83 = "PromptVariableMap",
    h83 = "PromptVariableValues",
    g83 = "ReasoningContentBlock",
    u83 = "ReasoningContentBlockDelta",
    m83 = "RequestMetadata",
    d83 = "ResourceNotFoundException",
    c83 = "ResponseStream",
    p83 = "ReasoningTextBlock",
    l83 = "StartAsyncInvoke",
    i83 = "StartAsyncInvokeRequest",
    n83 = "StartAsyncInvokeResponse",
    a83 = "SystemContentBlocks",
    o83 = "SystemContentBlock",
    r83 = "S3Location",
    s83 = "ServiceQuotaExceededException",
    t83 = "SearchResultBlock",
    e83 = "SearchResultContentBlock",
    A53 = "SearchResultContentBlocks",
    Q53 = "SearchResultLocation",
    B53 = "ServiceTier",
    G53 = "SpecificToolChoice",
    Z53 = "SystemTool",
    Y53 = "ServiceUnavailableException",
    J53 = "Tag",
    X53 = "ToolConfiguration",
    I53 = "ToolChoice",
    D53 = "ThrottlingException",
    W53 = "ToolInputSchema",
    K53 = "TagList",
    V53 = "ToolResultBlock",
    F53 = "ToolResultBlocksDelta",
    H53 = "ToolResultBlockDelta",
    E53 = "ToolResultBlockStart",
    z53 = "ToolResultContentBlocks",
    $53 = "ToolResultContentBlock",
    C53 = "ToolSpecification",
    U53 = "TokenUsage",
    q53 = "ToolUseBlock",
    N53 = "ToolUseBlockDelta",
    w53 = "ToolUseBlockStart",
    L53 = "Tools",
    O53 = "Tool",
    M53 = "VideoBlock",
    R53 = "ValidationException",
    _53 = "VideoSource",
    j53 = "WebLocation",
    T53 = "X-Amzn-Bedrock-Accept",
    P53 = "X-Amzn-Bedrock-Content-Type",
    AdQ = "X-Amzn-Bedrock-GuardrailIdentifier",
    QdQ = "X-Amzn-Bedrock-GuardrailVersion",
    bsA = "X-Amzn-Bedrock-PerformanceConfig-Latency",
    fsA = "X-Amzn-Bedrock-Service-Tier",
    BdQ = "X-Amzn-Bedrock-Trace",
    Hn = "action",
    S53 = "asyncInvokeSummaries",
    Xm1 = "additionalModelRequestFields",
    GdQ = "additionalModelResponseFieldPaths",
    ZdQ = "additionalModelResponseFields",
    YdQ = "actionReason",
    x53 = "automatedReasoningPolicy",
    y53 = "automatedReasoningPolicyUnits",
    v53 = "automatedReasoningPolicies",
    JdQ = "accept",
    k53 = "any",
    b53 = "assessments",
    f53 = "auto",
    En = "bytes",
    XdQ = "bucketOwner",
    g0A = "body",
    kv = "client",
    h53 = "contentBlockDelta",
    Im1 = "contentBlockIndex",
    g53 = "contentBlockStart",
    u53 = "contentBlockStop",
    m53 = "citationsContent",
    d53 = "claimsFalseScenario",
    c53 = "contextualGroundingPolicy",
    p53 = "contextualGroundingPolicyUnits",
    l53 = "contentPolicy",
    i53 = "contentPolicyImageUnits",
    n53 = "contentPolicyUnits",
    Dm1 = "cachePoint",
    IdQ = "contradictingRules",
    a53 = "cacheReadInputTokens",
    Wm1 = "clientRequestToken",
    hsA = "contentType",
    DdQ = "claimsTrueScenario",
    o53 = "customWords",
    r53 = "cacheWriteInputTokens",
    Km1 = "chunk",
    Vm1 = "citations",
    s53 = "citation",
    WdQ = "claims",
    nYA = "content",
    t53 = "context",
    KdQ = "confidence",
    e53 = "converse",
    A73 = "delta",
    Q73 = "documentChar",
    B73 = "documentChunk",
    Fm1 = "documentIndex",
    G73 = "documentPage",
    Z73 = "differenceScenarios",
    u0A = "detected",
    Y73 = "description",
    J73 = "domain",
    VdQ = "document",
    KR = "error",
    FdQ = "endTime",
    X73 = "enabled",
    gsA = "end",
    DLA = "format",
    HdQ = "failureMessage",
    I73 = "filterStrength",
    D73 = "findings",
    EdQ = "filters",
    zdQ = "guardrail",
    $dQ = "guardrailCoverage",
    CdQ = "guardrailConfig",
    UdQ = "guardContent",
    WLA = "guardrailIdentifier",
    W73 = "guardrailProcessingLatency",
    KLA = "guardrailVersion",
    qdQ = "guarded",
    bv = "http",
    VR = "httpError",
    vW = "httpHeader",
    h0A = "httpQuery",
    Hm1 = "input",
    usA = "invocationArn",
    K73 = "inputAssessment",
    NdQ = "inferenceConfig",
    V73 = "invocationMetrics",
    F73 = "invokedModelId",
    H73 = "invokeModel",
    E73 = "inputSchema",
    Em1 = "internalServerException",
    wdQ = "inputTokens",
    z73 = "identifier",
    $73 = "images",
    msA = "image",
    C73 = "impossible",
    U73 = "invalid",
    LdQ = "json",
    q73 = "key",
    N73 = "kmsKeyId",
    OdQ = "location",
    MdQ = "latencyMs",
    RdQ = "lastModifiedTime",
    dsA = "logicWarning",
    w73 = "latency",
    L73 = "logic",
    HL = "message",
    _dQ = "modelArn",
    m0A = "modelId",
    O73 = "modelInput",
    M73 = "modelOutput",
    ymQ = "maxResults",
    R73 = "messageStart",
    zm1 = "modelStreamErrorException",
    _73 = "messageStop",
    j73 = "maxTokens",
    jdQ = "modelTimeoutException",
    T73 = "managedWordLists",
    csA = "match",
    $m1 = "messages",
    TdQ = "metrics",
    P73 = "metadata",
    zn = "name",
    S73 = "naturalLanguage",
    Ym1 = "nextToken",
    x73 = "noTranslations",
    y73 = "outputs",
    v73 = "outputAssessments",
    Cm1 = "outputDataConfig",
    k73 = "originalMessage",
    b73 = "outputScope",
    PdQ = "originalStatusCode",
    f73 = "outputTokens",
    h73 = "options",
    g73 = "output",
    SdQ = "premises",
    psA = "performanceConfig",
    lsA = "performanceConfigLatency",
    u73 = "piiEntities",
    xdQ = "promptRouter",
    ydQ = "promptVariables",
    m73 = "policyVersionArn",
    vdQ = "qualifiers",
    d73 = "regex",
    kdQ = "reasoningContent",
    bdQ = "redactedContent",
    fdQ = "requestMetadata",
    c73 = "resourceName",
    p73 = "reasoningText",
    l73 = "regexes",
    hdQ = "role",
    Iu = "source",
    vmQ = "sortBy",
    gdQ = "sourceContent",
    kmQ = "statusEquals",
    i73 = "sensitiveInformationPolicy",
    n73 = "sensitiveInformationPolicyFreeUnits",
    a73 = "sensitiveInformationPolicyUnits",
    Um1 = "s3Location",
    bmQ = "sortOrder",
    o73 = "s3OutputDataConfig",
    r73 = "streamProcessingMode",
    udQ = "stopReason",
    s73 = "searchResultIndex",
    t73 = "searchResultLocation",
    mdQ = "searchResult",
    e73 = "supportingRules",
    AG3 = "stopSequences",
    ddQ = "submitTime",
    fmQ = "submitTimeAfter",
    hmQ = "submitTimeBefore",
    $n = "serviceTier",
    QG3 = "systemTool",
    BG3 = "s3Uri",
    qm1 = "serviceUnavailableException",
    GG3 = "satisfiable",
    ZG3 = "score",
    cdQ = "server",
    pdQ = "signature",
    ldQ = "smithy.ts.sdk.synthetic.com.amazonaws.bedrockruntime",
    isA = "status",
    VLA = "start",
    YG3 = "statements",
    JG3 = "stream",
    nsA = "streaming",
    Nm1 = "system",
    FR = "type",
    XG3 = "translationAmbiguous",
    wm1 = "toolConfig",
    IG3 = "textCharacters",
    DG3 = "toolChoice",
    WG3 = "tooComplex",
    Lm1 = "throttlingException",
    KG3 = "topicPolicy",
    VG3 = "topicPolicyUnits",
    FG3 = "topP",
    Om1 = "toolResult",
    HG3 = "toolSpec",
    EG3 = "totalTokens",
    Mm1 = "toolUse",
    asA = "toolUseId",
    zG3 = "tags",
    kW = "text",
    $G3 = "temperature",
    CG3 = "threshold",
    Rm1 = "title",
    idQ = "total",
    UG3 = "tools",
    qG3 = "tool",
    NG3 = "topics",
    aYA = "trace",
    osA = "translation",
    wG3 = "translations",
    rsA = "usage",
    LG3 = "untranslatedClaims",
    OG3 = "untranslatedPremises",
    MG3 = "uri",
    RG3 = "url",
    _G3 = "value",
    _m1 = "validationException",
    jG3 = "valid",
    ndQ = "video",
    TG3 = "web",
    PG3 = "wordPolicy",
    SG3 = "wordPolicyUnits",
    P1 = "com.amazonaws.bedrockruntime",
    adQ = [0, P1, m43, 8, 0],
    ssA = [0, P1, a43, 8, 21],
    xG3 = [0, P1, K33, 8, 0],
    odQ = [0, P1, V33, 8, 0],
    yG3 = [0, P1, R83, 8, 15],
    jm1 = [0, P1, y83, 8, 21],
    vG3 = [-3, P1, f43, {
        [KR]: kv,
        [VR]: 403
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(vG3, dmQ);
  var kG3 = [3, P1, i43, 0, [],
      []
    ],
    bG3 = [3, P1, g43, 0, [WLA, KLA, Iu, nYA, b73],
      [
        [0, 1],
        [0, 1], 0, [() => fY3, 0], 0
      ]
    ],
    fG3 = [3, P1, u43, 0, [rsA, Hn, YdQ, y73, b53, $dQ],
      [() => QcQ, 0, 0, () => dY3, [() => DcQ, 0], () => edQ]
    ],
    hG3 = [3, P1, p43, 0, [BG3, N73, XdQ],
      [0, 0, 0]
    ],
    gG3 = [3, P1, c43, 0, [usA, _dQ, Wm1, isA, HdQ, ddQ, RdQ, FdQ, Cm1],
      [0, 0, 0, 0, [() => adQ, 0], 5, 5, 5, () => bm1]
    ],
    uG3 = [3, P1, n43, 0, [],
      []
    ],
    mG3 = [3, P1, o43, 8, [En],
      [
        [() => jm1, 0]
      ]
    ],
    dG3 = [3, P1, r43, 8, [En],
      [
        [() => jm1, 0]
      ]
    ],
    Tm1 = [3, P1, H63, 0, [FR],
      [0]
    ],
    cG3 = [3, P1, s43, 0, [Rm1, Iu, gdQ, OdQ],
      [0, 0, () => TY3, () => VcQ]
    ],
    rdQ = [3, P1, Y63, 0, [X73],
      [2]
    ],
    pG3 = [3, P1, J63, 0, [nYA, Vm1],
      [() => _Y3, () => jY3]
    ],
    lG3 = [3, P1, X63, 0, [Rm1, Iu, gdQ, OdQ],
      [0, 0, () => PY3, () => VcQ]
    ],
    iG3 = [3, P1, U63, 0, [kW],
      [0]
    ],
    nG3 = [-3, P1, I63, {
        [KR]: kv,
        [VR]: 400
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(nG3, imQ);
  var aG3 = [3, P1, A63, 0, [A73, Im1],
      [
        [() => BJ3, 0], 1
      ]
    ],
    oG3 = [3, P1, B63, 0, [VLA, Im1],
      [() => GJ3, 1]
    ],
    rG3 = [3, P1, G63, 0, [Im1],
      [1]
    ],
    sG3 = [3, P1, V63, 0, [MdQ],
      [1]
    ],
    tG3 = [3, P1, E63, 0, [m0A, $m1, Nm1, NdQ, wm1, CdQ, Xm1, ydQ, GdQ, fdQ, psA, $n],
      [
        [0, 1],
        [() => vm1, 0],
        [() => km1, 0], () => GcQ, () => xm1, () => RZ3, 15, [() => WcQ, 0], 64, [() => KcQ, 0], () => QtA, () => BtA
      ]
    ],
    eG3 = [3, P1, z63, 0, [g73, udQ, rsA, TdQ, ZdQ, aYA, psA, $n],
      [
        [() => ZJ3, 0], 0, () => XcQ, () => sG3, 15, [() => JZ3, 0], () => QtA, () => BtA
      ]
    ],
    AZ3 = [3, P1, L63, 0, [rsA, TdQ, aYA, psA, $n],
      [() => XcQ, () => QZ3, [() => ZZ3, 0], () => QtA, () => BtA]
    ],
    QZ3 = [3, P1, w63, 0, [MdQ],
      [1]
    ],
    BZ3 = [3, P1, M63, 0, [m0A, $m1, Nm1, NdQ, wm1, CdQ, Xm1, ydQ, GdQ, fdQ, psA, $n],
      [
        [0, 1],
        [() => vm1, 0],
        [() => km1, 0], () => GcQ, () => xm1, () => dZ3, 15, [() => WcQ, 0], 64, [() => KcQ, 0], () => QtA, () => BtA
      ]
    ],
    GZ3 = [3, P1, R63, 0, [JG3],
      [
        [() => YJ3, 16]
      ]
    ],
    ZZ3 = [3, P1, _63, 0, [zdQ, xdQ],
      [
        [() => AcQ, 0], () => YcQ
      ]
    ],
    YZ3 = [3, P1, P63, 0, [$m1, Nm1, wm1, Xm1],
      [
        [() => vm1, 0],
        [() => km1, 0], () => xm1, 15
      ]
    ],
    JZ3 = [3, P1, j63, 0, [zdQ, xdQ],
      [
        [() => AcQ, 0], () => YcQ
      ]
    ],
    XZ3 = [3, P1, S63, 0, [m0A, Hm1],
      [
        [0, 1],
        [() => JJ3, 0]
      ]
    ],
    IZ3 = [3, P1, x63, 0, [wdQ],
      [1]
    ],
    sdQ = [3, P1, b63, 0, [DLA, zn, Iu, t53, Vm1],
      [0, 0, () => IJ3, 0, () => rdQ]
    ],
    DZ3 = [3, P1, g63, 0, [Fm1, VLA, gsA],
      [1, 1, 1]
    ],
    WZ3 = [3, P1, u63, 0, [Fm1, VLA, gsA],
      [1, 1, 1]
    ],
    KZ3 = [3, P1, m63, 0, [Fm1, VLA, gsA],
      [1, 1, 1]
    ],
    VZ3 = [3, P1, l63, 0, [usA],
      [
        [0, 1]
      ]
    ],
    FZ3 = [3, P1, i63, 0, [usA, _dQ, Wm1, isA, HdQ, ddQ, RdQ, FdQ, Cm1],
      [0, 0, 0, 0, [() => adQ, 0], 5, 5, 5, () => bm1]
    ],
    tdQ = [3, P1, c63, 0, [KG3, l53, PG3, i73, c53, x53, V73],
      [() => iZ3, () => jZ3, () => nZ3, () => mZ3, () => PZ3, [() => CZ3, 0], () => bZ3]
    ],
    HZ3 = [3, P1, e63, 0, [osA, IdQ, dsA],
      [
        [() => FLA, 0], () => ym1, [() => tsA, 0]
      ]
    ],
    EZ3 = [3, P1, Q33, 0, [kW],
      [
        [() => odQ, 0]
      ]
    ],
    zZ3 = [3, P1, A33, 0, [osA, IdQ, dsA],
      [
        [() => FLA, 0], () => ym1, [() => tsA, 0]
      ]
    ],
    tsA = [3, P1, G33, 0, [FR, SdQ, WdQ],
      [0, [() => ILA, 0],
        [() => ILA, 0]
      ]
    ],
    $Z3 = [3, P1, Z33, 0, [],
      []
    ],
    CZ3 = [3, P1, Y33, 0, [D73],
      [
        [() => vY3, 0]
      ]
    ],
    UZ3 = [3, P1, J33, 0, [z73, m73],
      [0, 0]
    ],
    qZ3 = [3, P1, D33, 0, [osA, DdQ, d53, dsA],
      [
        [() => FLA, 0],
        [() => vsA, 0],
        [() => vsA, 0],
        [() => tsA, 0]
      ]
    ],
    vsA = [3, P1, I33, 0, [YG3],
      [
        [() => ILA, 0]
      ]
    ],
    NZ3 = [3, P1, F33, 0, [L73, S73],
      [
        [() => xG3, 0],
        [() => odQ, 0]
      ]
    ],
    wZ3 = [3, P1, z33, 0, [],
      []
    ],
    FLA = [3, P1, H33, 0, [SdQ, WdQ, OG3, LG3, KdQ],
      [
        [() => ILA, 0],
        [() => ILA, 0],
        [() => gmQ, 0],
        [() => gmQ, 0], 1
      ]
    ],
    LZ3 = [3, P1, E33, 0, [h73, Z73],
      [
        [() => bY3, 0],
        [() => yY3, 0]
      ]
    ],
    OZ3 = [3, P1, C33, 0, [wG3],
      [
        [() => kY3, 0]
      ]
    ],
    MZ3 = [3, P1, q33, 0, [osA, DdQ, e73, dsA],
      [
        [() => FLA, 0],
        [() => vsA, 0], () => ym1, [() => tsA, 0]
      ]
    ],
    RZ3 = [3, P1, N33, 0, [WLA, KLA, aYA],
      [0, 0, 0]
    ],
    _Z3 = [3, P1, M33, 0, [FR, KdQ, I73, Hn, u0A],
      [0, 0, 0, 0, 2]
    ],
    jZ3 = [3, P1, x33, 0, [EdQ],
      [() => hY3]
    ],
    TZ3 = [3, P1, _33, 0, [FR, CG3, ZG3, Hn, u0A],
      [0, 1, 1, 0, 2]
    ],
    PZ3 = [3, P1, T33, 0, [EdQ],
      [() => gY3]
    ],
    SZ3 = [3, P1, P33, 8, [DLA, Iu],
      [0, [() => KJ3, 0]]
    ],
    xZ3 = [3, P1, y33, 0, [kW, vdQ],
      [0, 64]
    ],
    edQ = [3, P1, b33, 0, [IG3, $73],
      [() => pZ3, () => kZ3]
    ],
    yZ3 = [3, P1, v33, 0, [csA, Hn, u0A],
      [0, 0, 2]
    ],
    vZ3 = [3, P1, f33, 8, [DLA, Iu],
      [0, [() => VJ3, 0]]
    ],
    kZ3 = [3, P1, h33, 0, [qdQ, idQ],
      [1, 1]
    ],
    bZ3 = [3, P1, g33, 0, [W73, rsA, $dQ],
      [1, () => QcQ, () => edQ]
    ],
    fZ3 = [3, P1, m33, 0, [csA, FR, Hn, u0A],
      [0, 0, 0, 2]
    ],
    hZ3 = [3, P1, c33, 0, [kW],
      [0]
    ],
    gZ3 = [3, P1, l33, 0, [csA, FR, Hn, u0A],
      [0, 0, 0, 2]
    ],
    uZ3 = [3, P1, n33, 0, [zn, csA, d73, Hn, u0A],
      [0, 0, 0, 0, 2]
    ],
    mZ3 = [3, P1, r33, 0, [u73, l73],
      [() => cY3, () => pY3]
    ],
    dZ3 = [3, P1, o33, 0, [WLA, KLA, aYA, r73],
      [0, 0, 0, 0]
    ],
    cZ3 = [3, P1, e33, 0, [kW, vdQ],
      [0, 64]
    ],
    pZ3 = [3, P1, A83, 0, [qdQ, idQ],
      [1, 1]
    ],
    lZ3 = [3, P1, s33, 0, [zn, FR, Hn, u0A],
      [0, 0, 0, 2]
    ],
    iZ3 = [3, P1, B83, 0, [NG3],
      [() => lY3]
    ],
    AcQ = [3, P1, t33, 0, [M73, K73, v73, YdQ],
      [64, [() => tY3, 0],
        [() => sY3, 0], 0
      ]
    ],
    QcQ = [3, P1, G83, 0, [VG3, n53, SG3, a73, n73, p53, i53, y53, v53],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    nZ3 = [3, P1, Z83, 0, [o53, T73],
      [() => uY3, () => mY3]
    ],
    BcQ = [3, P1, Y83, 0, [DLA, Iu],
      [0, () => FJ3]
    ],
    GcQ = [3, P1, J83, 0, [j73, $G3, FG3, AG3],
      [1, 1, 1, 64]
    ],
    esA = [-3, P1, q83, {
        [KR]: cdQ,
        [VR]: 500
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(esA, cmQ);
  var aZ3 = [3, P1, I83, 0, [g0A, hsA, JdQ, m0A, aYA, WLA, KLA, lsA, $n],
      [
        [() => ssA, 16],
        [0, {
          [vW]: Jm1
        }],
        [0, {
          [vW]: b43
        }],
        [0, 1],
        [0, {
          [vW]: BdQ
        }],
        [0, {
          [vW]: AdQ
        }],
        [0, {
          [vW]: QdQ
        }],
        [0, {
          [vW]: bsA
        }],
        [0, {
          [vW]: fsA
        }]
      ]
    ],
    oZ3 = [3, P1, D83, 0, [g0A, hsA, lsA, $n],
      [
        [() => ssA, 16],
        [0, {
          [vW]: Jm1
        }],
        [0, {
          [vW]: bsA
        }],
        [0, {
          [vW]: fsA
        }]
      ]
    ],
    rZ3 = [3, P1, W83, 0, [g0A],
      [
        [() => ssA, 0]
      ]
    ],
    sZ3 = [3, P1, H83, 0, [m0A, g0A],
      [
        [0, 1],
        [() => HJ3, 16]
      ]
    ],
    tZ3 = [3, P1, E83, 0, [g0A],
      [
        [() => EJ3, 16]
      ]
    ],
    eZ3 = [3, P1, $83, 0, [g0A, hsA, JdQ, m0A, aYA, WLA, KLA, lsA, $n],
      [
        [() => ssA, 16],
        [0, {
          [vW]: Jm1
        }],
        [0, {
          [vW]: T53
        }],
        [0, 1],
        [0, {
          [vW]: BdQ
        }],
        [0, {
          [vW]: AdQ
        }],
        [0, {
          [vW]: QdQ
        }],
        [0, {
          [vW]: bsA
        }],
        [0, {
          [vW]: fsA
        }]
      ]
    ],
    AY3 = [3, P1, C83, 0, [g0A, hsA, lsA, $n],
      [
        [() => UJ3, 16],
        [0, {
          [vW]: P53
        }],
        [0, {
          [vW]: bsA
        }],
        [0, {
          [vW]: fsA
        }]
      ]
    ],
    QY3 = [3, P1, w83, 0, [fmQ, hmQ, kmQ, ymQ, Ym1, vmQ, bmQ],
      [
        [5, {
          [h0A]: fmQ
        }],
        [5, {
          [h0A]: hmQ
        }],
        [0, {
          [h0A]: kmQ
        }],
        [1, {
          [h0A]: ymQ
        }],
        [0, {
          [h0A]: Ym1
        }],
        [0, {
          [h0A]: vmQ
        }],
        [0, {
          [h0A]: bmQ
        }]
      ]
    ],
    BY3 = [3, P1, L83, 0, [Ym1, S53],
      [0, [() => RY3, 0]]
    ],
    ZcQ = [3, P1, O83, 0, [hdQ, nYA],
      [0, [() => SY3, 0]]
    ],
    GY3 = [3, P1, j83, 0, [hdQ],
      [0]
    ],
    ZY3 = [3, P1, P83, 0, [udQ, ZdQ],
      [0, 15]
    ],
    YY3 = [-3, P1, M83, {
        [KR]: kv,
        [VR]: 424
      },
      [HL, PdQ, c73],
      [0, 1, 0]
    ];
  yq.TypeRegistry.for(P1).registerError(YY3, rmQ);
  var JY3 = [-3, P1, _83, {
      [KR]: kv,
      [VR]: 429
    },
    [HL],
    [0]
  ];
  yq.TypeRegistry.for(P1).registerError(JY3, smQ);
  var AtA = [-3, P1, T83, {
      [KR]: kv,
      [VR]: 424
    },
    [HL, PdQ, k73],
    [0, 1, 0]
  ];
  yq.TypeRegistry.for(P1).registerError(AtA, emQ);
  var Pm1 = [-3, P1, S83, {
      [KR]: kv,
      [VR]: 408
    },
    [HL],
    [0]
  ];
  yq.TypeRegistry.for(P1).registerError(Pm1, tmQ);
  var XY3 = [3, P1, k83, 8, [En],
      [
        [() => jm1, 0]
      ]
    ],
    QtA = [3, P1, v83, 0, [w73],
      [0]
    ],
    YcQ = [3, P1, b83, 0, [F73],
      [0]
    ],
    IY3 = [3, P1, p83, 8, [kW, pdQ],
      [0, 0]
    ],
    DY3 = [-3, P1, d83, {
        [KR]: kv,
        [VR]: 404
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(DY3, nmQ);
  var Sm1 = [3, P1, r83, 0, [MG3, XdQ],
      [0, 0]
    ],
    JcQ = [3, P1, t83, 0, [Iu, Rm1, nYA, Vm1],
      [0, 0, () => iY3, () => rdQ]
    ],
    WY3 = [3, P1, e83, 0, [kW],
      [0]
    ],
    KY3 = [3, P1, Q53, 0, [s73, VLA, gsA],
      [1, 1, 1]
    ],
    VY3 = [-3, P1, s83, {
        [KR]: kv,
        [VR]: 400
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(VY3, amQ);
  var BtA = [3, P1, B53, 0, [FR],
      [0]
    ],
    GtA = [-3, P1, Y53, {
        [KR]: cdQ,
        [VR]: 503
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(GtA, omQ);
  var FY3 = [3, P1, G53, 0, [zn],
      [0]
    ],
    HY3 = [3, P1, i83, 0, [Wm1, m0A, O73, Cm1, zG3],
      [
        [0, 4], 0, [() => yG3, 0], () => bm1, () => nY3
      ]
    ],
    EY3 = [3, P1, n83, 0, [usA],
      [0]
    ],
    zY3 = [3, P1, Z53, 0, [zn],
      [0]
    ],
    $Y3 = [3, P1, J53, 0, [q73, _G3],
      [0, 0]
    ],
    ZtA = [-3, P1, D53, {
        [KR]: kv,
        [VR]: 429
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(ZtA, pmQ);
  var XcQ = [3, P1, U53, 0, [wdQ, f73, EG3, a53, r53],
      [1, 1, 1, 1, 1]
    ],
    xm1 = [3, P1, X53, 0, [UG3, DG3],
      [() => rY3, () => wJ3]
    ],
    CY3 = [3, P1, V53, 0, [asA, nYA, isA, FR],
      [0, () => oY3, 0, 0]
    ],
    UY3 = [3, P1, E53, 0, [asA, FR, isA],
      [0, 0, 0]
    ],
    qY3 = [3, P1, C53, 0, [zn, Y73, E73],
      [0, 0, () => LJ3]
    ],
    NY3 = [3, P1, q53, 0, [asA, zn, Hm1, FR],
      [0, 0, 15, 0]
    ],
    wY3 = [3, P1, N53, 0, [Hm1],
      [0]
    ],
    LY3 = [3, P1, w53, 0, [asA, zn, FR],
      [0, 0, 0]
    ],
    YtA = [-3, P1, R53, {
        [KR]: kv,
        [VR]: 400
      },
      [HL],
      [0]
    ];
  yq.TypeRegistry.for(P1).registerError(YtA, lmQ);
  var IcQ = [3, P1, M53, 0, [DLA, Iu],
      [0, () => RJ3]
    ],
    OY3 = [3, P1, j53, 0, [RG3, J73],
      [0, 0]
    ],
    MY3 = [-3, ldQ, "BedrockRuntimeServiceException", 0, [],
      []
    ];
  yq.TypeRegistry.for(ldQ).registerError(MY3, vq);
  var RY3 = [1, P1, l43, 0, [() => gG3, 0]],
    _Y3 = [1, P1, W63, 0, () => eY3],
    jY3 = [1, P1, v63, 0, () => cG3],
    TY3 = [1, P1, q63, 0, () => AJ3],
    PY3 = [1, P1, N63, 0, () => iG3],
    SY3 = [1, P1, t43, 0, [() => QJ3, 0]],
    xY3 = [1, P1, f63, 0, () => XJ3],
    DcQ = [1, P1, n63, 0, [() => tdQ, 0]],
    yY3 = [1, P1, r63, 0, [() => vsA, 0]],
    vY3 = [1, P1, t63, 0, [() => DJ3, 0]],
    gmQ = [1, P1, B33, 0, [() => EZ3, 0]],
    ym1 = [1, P1, X33, 0, () => UZ3],
    ILA = [1, P1, W33, 0, [() => NZ3, 0]],
    kY3 = [1, P1, $33, 0, [() => FLA, 0]],
    bY3 = [1, P1, U33, 0, [() => OZ3, 0]],
    fY3 = [1, P1, L33, 0, [() => WJ3, 0]],
    hY3 = [1, P1, R33, 0, () => _Z3],
    gY3 = [1, P1, j33, 0, () => TZ3],
    uY3 = [1, P1, k33, 0, () => yZ3],
    mY3 = [1, P1, d33, 0, () => fZ3],
    dY3 = [1, P1, p33, 0, () => hZ3],
    cY3 = [1, P1, i33, 0, () => gZ3],
    pY3 = [1, P1, a33, 0, () => uZ3],
    lY3 = [1, P1, Q83, 0, () => lZ3],
    vm1 = [1, P1, x83, 0, [() => ZcQ, 0]],
    iY3 = [1, P1, A53, 0, () => WY3],
    km1 = [1, P1, a83, 0, [() => qJ3, 0]],
    nY3 = [1, P1, K53, 0, () => $Y3],
    aY3 = [1, P1, F53, 0, () => OJ3],
    oY3 = [1, P1, z53, 0, () => MJ3],
    rY3 = [1, P1, L53, 0, () => NJ3],
    sY3 = [2, P1, a63, 0, [0, 0],
      [() => DcQ, 0]
    ],
    tY3 = [2, P1, o63, 0, [0, 0],
      [() => tdQ, 0]
    ],
    WcQ = [2, P1, f83, 8, 0, () => zJ3],
    KcQ = [2, P1, m83, 8, 0, 0],
    bm1 = [3, P1, d43, 0, [o73],
      [() => hG3]
    ],
    eY3 = [3, P1, D63, 0, [kW],
      [0]
    ],
    VcQ = [3, P1, K63, 0, [TG3, Q73, G73, B73, t73],
      [() => OY3, () => DZ3, () => KZ3, () => WZ3, () => KY3]
    ],
    AJ3 = [3, P1, C63, 0, [kW],
      [0]
    ],
    QJ3 = [3, P1, Z63, 0, [kW, msA, VdQ, ndQ, Mm1, Om1, UdQ, Dm1, kdQ, m53, mdQ],
      [0, () => BcQ, () => sdQ, () => IcQ, () => NY3, () => CY3, [() => FcQ, 0], () => Tm1, [() => $J3, 0], () => pG3, () => JcQ]
    ],
    BJ3 = [3, P1, e43, 0, [kW, Mm1, Om1, kdQ, s53],
      [0, () => wY3, () => aY3, [() => CJ3, 0], () => lG3]
    ],
    GJ3 = [3, P1, Q63, 0, [Mm1, Om1],
      [() => LY3, () => UY3]
    ],
    ZJ3 = [3, P1, F63, 0, [HL],
      [
        [() => ZcQ, 0]
      ]
    ],
    YJ3 = [3, P1, O63, {
        [nsA]: 1
      },
      [R73, g53, h53, u53, _73, P73, Em1, zm1, _m1, Lm1, qm1],
      [() => GY3, () => oG3, [() => aG3, 0], () => rG3, () => ZY3, [() => AZ3, 0],
        [() => esA, 0],
        [() => AtA, 0],
        [() => YtA, 0],
        [() => ZtA, 0],
        [() => GtA, 0]
      ]
    ],
    JJ3 = [3, P1, T63, 0, [H73, e53],
      [
        [() => rZ3, 0],
        [() => YZ3, 0]
      ]
    ],
    XJ3 = [3, P1, h63, 0, [kW],
      [0]
    ],
    IJ3 = [3, P1, d63, 0, [En, Um1, kW, nYA],
      [21, () => Sm1, 0, () => xY3]
    ],
    DJ3 = [3, P1, s63, 0, [jG3, U73, GG3, C73, XG3, WG3, x73],
      [
        [() => MZ3, 0],
        [() => zZ3, 0],
        [() => qZ3, 0],
        [() => HZ3, 0],
        [() => LZ3, 0], () => wZ3, () => $Z3
      ]
    ],
    WJ3 = [3, P1, w33, 0, [kW, msA],
      [() => cZ3, [() => vZ3, 0]]
    ],
    FcQ = [3, P1, O33, 0, [kW, msA],
      [() => xZ3, [() => SZ3, 0]]
    ],
    KJ3 = [3, P1, S33, 8, [En],
      [21]
    ],
    VJ3 = [3, P1, u33, 8, [En],
      [21]
    ],
    FJ3 = [3, P1, U83, 0, [En, Um1],
      [21, () => Sm1]
    ],
    HJ3 = [3, P1, V83, {
        [nsA]: 1
      },
      [Km1],
      [
        [() => mG3, 0]
      ]
    ],
    EJ3 = [3, P1, F83, {
        [nsA]: 1
      },
      [Km1, Em1, zm1, _m1, Lm1, jdQ, qm1],
      [
        [() => dG3, 0],
        [() => esA, 0],
        [() => AtA, 0],
        [() => YtA, 0],
        [() => ZtA, 0],
        [() => Pm1, 0],
        [() => GtA, 0]
      ]
    ],
    zJ3 = [3, P1, h83, 0, [kW],
      [0]
    ],
    $J3 = [3, P1, g83, 8, [p73, bdQ],
      [
        [() => IY3, 0], 21
      ]
    ],
    CJ3 = [3, P1, u83, 8, [kW, bdQ, pdQ],
      [0, 21, 0]
    ],
    UJ3 = [3, P1, c83, {
        [nsA]: 1
      },
      [Km1, Em1, zm1, _m1, Lm1, jdQ, qm1],
      [
        [() => XY3, 0],
        [() => esA, 0],
        [() => AtA, 0],
        [() => YtA, 0],
        [() => ZtA, 0],
        [() => Pm1, 0],
        [() => GtA, 0]
      ]
    ],
    qJ3 = [3, P1, o83, 0, [kW, UdQ, Dm1],
      [0, [() => FcQ, 0], () => Tm1]
    ],
    NJ3 = [3, P1, O53, 0, [HG3, QG3, Dm1],
      [() => qY3, () => zY3, () => Tm1]
    ],
    wJ3 = [3, P1, I53, 0, [f53, k53, qG3],
      [() => uG3, () => kG3, () => FY3]
    ],
    LJ3 = [3, P1, W53, 0, [LdQ],
      [15]
    ],
    OJ3 = [3, P1, H53, 0, [kW],
      [0]
    ],
    MJ3 = [3, P1, $53, 0, [LdQ, kW, msA, VdQ, ndQ, mdQ],
      [15, 0, () => BcQ, () => sdQ, () => IcQ, () => JcQ]
    ],
    RJ3 = [3, P1, _53, 0, [En, Um1],
      [21, () => Sm1]
    ],
    _J3 = [9, P1, h43, {
      [bv]: ["POST", "/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply", 200]
    }, () => bG3, () => fG3],
    jJ3 = [9, P1, k63, {
      [bv]: ["POST", "/model/{modelId}/converse", 200]
    }, () => tG3, () => eG3],
    TJ3 = [9, P1, $63, {
      [bv]: ["POST", "/model/{modelId}/converse-stream", 200]
    }, () => BZ3, () => GZ3],
    PJ3 = [9, P1, y63, {
      [bv]: ["POST", "/model/{modelId}/count-tokens", 200]
    }, () => XZ3, () => IZ3],
    SJ3 = [9, P1, p63, {
      [bv]: ["GET", "/async-invoke/{invocationArn}", 200]
    }, () => VZ3, () => FZ3],
    xJ3 = [9, P1, X83, {
      [bv]: ["POST", "/model/{modelId}/invoke", 200]
    }, () => aZ3, () => oZ3],
    yJ3 = [9, P1, K83, {
      [bv]: ["POST", "/model/{modelId}/invoke-with-bidirectional-stream", 200]
    }, () => sZ3, () => tZ3],
    vJ3 = [9, P1, z83, {
      [bv]: ["POST", "/model/{modelId}/invoke-with-response-stream", 200]
    }, () => eZ3, () => AY3],
    kJ3 = [9, P1, N83, {
      [bv]: ["GET", "/async-invoke", 200]
    }, () => QY3, () => BY3],
    bJ3 = [9, P1, l83, {
      [bv]: ["POST", "/async-invoke", 200]
    }, () => HY3, () => EY3];
  class fm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "ApplyGuardrail", {}).n("BedrockRuntimeClient", "ApplyGuardrailCommand").sc(_J3).build() {}
  class hm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "Converse", {}).n("BedrockRuntimeClient", "ConverseCommand").sc(jJ3).build() {}
  class gm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "ConverseStream", {
    eventStream: {
      output: !0
    }
  }).n("BedrockRuntimeClient", "ConverseStreamCommand").sc(TJ3).build() {}
  class um1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "CountTokens", {}).n("BedrockRuntimeClient", "CountTokensCommand").sc(PJ3).build() {}
  class mm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "GetAsyncInvoke", {}).n("BedrockRuntimeClient", "GetAsyncInvokeCommand").sc(SJ3).build() {}
  class dm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "InvokeModel", {}).n("BedrockRuntimeClient", "InvokeModelCommand").sc(xJ3).build() {}
  class cm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions()), umQ.getEventStreamPlugin(B), mmQ.getWebSocketPlugin(B, {
      headerPrefix: "x-amz-bedrock-"
    })]
  }).s("AmazonBedrockFrontendService", "InvokeModelWithBidirectionalStream", {
    eventStream: {
      input: !0,
      output: !0
    }
  }).n("BedrockRuntimeClient", "InvokeModelWithBidirectionalStreamCommand").sc(yJ3).build() {}
  class pm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "InvokeModelWithResponseStream", {
    eventStream: {
      output: !0
    }
  }).n("BedrockRuntimeClient", "InvokeModelWithResponseStreamCommand").sc(vJ3).build() {}
  class JtA extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "ListAsyncInvokes", {}).n("BedrockRuntimeClient", "ListAsyncInvokesCommand").sc(kJ3).build() {}
  class lm1 extends SH.Command.classBuilder().ep(vv).m(function (A, Q, B, G) {
    return [cT.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AmazonBedrockFrontendService", "StartAsyncInvoke", {}).n("BedrockRuntimeClient", "StartAsyncInvokeCommand").sc(bJ3).build() {}
  var fJ3 = {
    ApplyGuardrailCommand: fm1,
    ConverseCommand: hm1,
    ConverseStreamCommand: gm1,
    CountTokensCommand: um1,
    GetAsyncInvokeCommand: mm1,
    InvokeModelCommand: dm1,
    InvokeModelWithBidirectionalStreamCommand: cm1,
    InvokeModelWithResponseStreamCommand: pm1,
    ListAsyncInvokesCommand: JtA,
    StartAsyncInvokeCommand: lm1
  };
  class im1 extends ksA {}
  SH.createAggregatedClient(fJ3, im1);
  var hJ3 = ysA.createPaginator(ksA, JtA, "nextToken", "nextToken", "maxResults"),
    gJ3 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress"
    },
    uJ3 = {
      SUBMISSION_TIME: "SubmissionTime"
    },
    mJ3 = {
      ASCENDING: "Ascending",
      DESCENDING: "Descending"
    },
    dJ3 = {
      JPEG: "jpeg",
      PNG: "png"
    },
    cJ3 = {
      GROUNDING_SOURCE: "grounding_source",
      GUARD_CONTENT: "guard_content",
      QUERY: "query"
    },
    pJ3 = {
      FULL: "FULL",
      INTERVENTIONS: "INTERVENTIONS"
    },
    lJ3 = {
      INPUT: "INPUT",
      OUTPUT: "OUTPUT"
    },
    iJ3 = {
      GUARDRAIL_INTERVENED: "GUARDRAIL_INTERVENED",
      NONE: "NONE"
    },
    nJ3 = {
      ALWAYS_FALSE: "ALWAYS_FALSE",
      ALWAYS_TRUE: "ALWAYS_TRUE"
    },
    aJ3 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    oJ3 = {
      HIGH: "HIGH",
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      NONE: "NONE"
    },
    rJ3 = {
      HIGH: "HIGH",
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      NONE: "NONE"
    },
    sJ3 = {
      HATE: "HATE",
      INSULTS: "INSULTS",
      MISCONDUCT: "MISCONDUCT",
      PROMPT_ATTACK: "PROMPT_ATTACK",
      SEXUAL: "SEXUAL",
      VIOLENCE: "VIOLENCE"
    },
    tJ3 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    eJ3 = {
      GROUNDING: "GROUNDING",
      RELEVANCE: "RELEVANCE"
    },
    AX3 = {
      ANONYMIZED: "ANONYMIZED",
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    QX3 = {
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
    BX3 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    GX3 = {
      DENY: "DENY"
    },
    ZX3 = {
      BLOCKED: "BLOCKED",
      NONE: "NONE"
    },
    YX3 = {
      PROFANITY: "PROFANITY"
    },
    JX3 = {
      DISABLED: "disabled",
      ENABLED: "enabled",
      ENABLED_FULL: "enabled_full"
    },
    XX3 = {
      DEFAULT: "default"
    },
    IX3 = {
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
    DX3 = {
      JPEG: "jpeg",
      PNG: "png"
    },
    WX3 = {
      GROUNDING_SOURCE: "grounding_source",
      GUARD_CONTENT: "guard_content",
      QUERY: "query"
    },
    KX3 = {
      GIF: "gif",
      JPEG: "jpeg",
      PNG: "png",
      WEBP: "webp"
    },
    VX3 = {
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
    FX3 = {
      ERROR: "error",
      SUCCESS: "success"
    },
    HX3 = {
      SERVER_TOOL_USE: "server_tool_use"
    },
    EX3 = {
      ASSISTANT: "assistant",
      USER: "user"
    },
    zX3 = {
      OPTIMIZED: "optimized",
      STANDARD: "standard"
    },
    $X3 = {
      DEFAULT: "default",
      FLEX: "flex",
      PRIORITY: "priority"
    },
    CX3 = {
      CONTENT_FILTERED: "content_filtered",
      END_TURN: "end_turn",
      GUARDRAIL_INTERVENED: "guardrail_intervened",
      MAX_TOKENS: "max_tokens",
      MODEL_CONTEXT_WINDOW_EXCEEDED: "model_context_window_exceeded",
      STOP_SEQUENCE: "stop_sequence",
      TOOL_USE: "tool_use"
    },
    UX3 = {
      ASYNC: "async",
      SYNC: "sync"
    },
    qX3 = {
      DISABLED: "DISABLED",
      ENABLED: "ENABLED",
      ENABLED_FULL: "ENABLED_FULL"
    };
  Object.defineProperty(nm1, "$Command", {
    enumerable: !0,
    get: function () {
      return SH.Command
    }
  });
  Object.defineProperty(nm1, "__Client", {
    enumerable: !0,
    get: function () {
      return SH.Client
    }
  });
  nm1.AccessDeniedException = dmQ;
  nm1.ApplyGuardrailCommand = fm1;
  nm1.AsyncInvokeStatus = gJ3;
  nm1.BedrockRuntime = im1;
  nm1.BedrockRuntimeClient = ksA;
  nm1.BedrockRuntimeServiceException = vq;
  nm1.CachePointType = XX3;
  nm1.ConflictException = imQ;
  nm1.ConversationRole = EX3;
  nm1.ConverseCommand = hm1;
  nm1.ConverseStreamCommand = gm1;
  nm1.CountTokensCommand = um1;
  nm1.DocumentFormat = IX3;
  nm1.GetAsyncInvokeCommand = mm1;
  nm1.GuardrailAction = iJ3;
  nm1.GuardrailAutomatedReasoningLogicWarningType = nJ3;
  nm1.GuardrailContentFilterConfidence = oJ3;
  nm1.GuardrailContentFilterStrength = rJ3;
  nm1.GuardrailContentFilterType = sJ3;
  nm1.GuardrailContentPolicyAction = aJ3;
  nm1.GuardrailContentQualifier = cJ3;
  nm1.GuardrailContentSource = lJ3;
  nm1.GuardrailContextualGroundingFilterType = eJ3;
  nm1.GuardrailContextualGroundingPolicyAction = tJ3;
  nm1.GuardrailConverseContentQualifier = WX3;
  nm1.GuardrailConverseImageFormat = DX3;
  nm1.GuardrailImageFormat = dJ3;
  nm1.GuardrailManagedWordType = YX3;
  nm1.GuardrailOutputScope = pJ3;
  nm1.GuardrailPiiEntityType = QX3;
  nm1.GuardrailSensitiveInformationPolicyAction = AX3;
  nm1.GuardrailStreamProcessingMode = UX3;
  nm1.GuardrailTopicPolicyAction = BX3;
  nm1.GuardrailTopicType = GX3;
  nm1.GuardrailTrace = JX3;
  nm1.GuardrailWordPolicyAction = ZX3;
  nm1.ImageFormat = KX3;
  nm1.InternalServerException = cmQ;
  nm1.InvokeModelCommand = dm1;
  nm1.InvokeModelWithBidirectionalStreamCommand = cm1;
  nm1.InvokeModelWithResponseStreamCommand = pm1;
  nm1.ListAsyncInvokesCommand = JtA;
  nm1.ModelErrorException = rmQ;
  nm1.ModelNotReadyException = smQ;
  nm1.ModelStreamErrorException = emQ;
  nm1.ModelTimeoutException = tmQ;
  nm1.PerformanceConfigLatency = zX3;
  nm1.ResourceNotFoundException = nmQ;
  nm1.ServiceQuotaExceededException = amQ;
  nm1.ServiceTierType = $X3;
  nm1.ServiceUnavailableException = omQ;
  nm1.SortAsyncInvocationBy = uJ3;
  nm1.SortOrder = mJ3;
  nm1.StartAsyncInvokeCommand = lm1;
  nm1.StopReason = CX3;
  nm1.ThrottlingException = pmQ;
  nm1.ToolResultStatus = FX3;
  nm1.ToolUseType = HX3;
  nm1.Trace = qX3;
  nm1.ValidationException = lmQ;
  nm1.VideoFormat = VX3;
  nm1.paginateListAsyncInvokes = hJ3
})
// @from(Ln 107375, Col 4)
zcQ = U((kq) => {
  var TI3 = kq && kq.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    PI3 = kq && kq.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    HcQ = kq && kq.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) TI3(Q, A, B)
      }
      return PI3(Q, A), Q
    };
  Object.defineProperty(kq, "__esModule", {
    value: !0
  });
  kq.req = kq.json = kq.toBuffer = void 0;
  var SI3 = HcQ(NA("http")),
    xI3 = HcQ(NA("https"));
  async function EcQ(A) {
    let Q = 0,
      B = [];
    for await (let G of A) Q += G.length, B.push(G);
    return Buffer.concat(B, Q)
  }
  kq.toBuffer = EcQ;
  async function yI3(A) {
    let B = (await EcQ(A)).toString("utf8");
    try {
      return JSON.parse(B)
    } catch (G) {
      let Z = G;
      throw Z.message += ` (input: ${B})`, Z
    }
  }
  kq.json = yI3;

  function vI3(A, Q = {}) {
    let G = ((typeof A === "string" ? A : A.href).startsWith("https:") ? xI3 : SI3).request(A, Q),
      Z = new Promise((Y, J) => {
        G.once("response", Y).once("error", J).end()
      });
    return G.then = Z.then.bind(Z), G
  }
  kq.req = vI3
})
// @from(Ln 107440, Col 4)
am1 = U((EL) => {
  var CcQ = EL && EL.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    kI3 = EL && EL.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    UcQ = EL && EL.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) CcQ(Q, A, B)
      }
      return kI3(Q, A), Q
    },
    bI3 = EL && EL.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) CcQ(Q, A, B)
    };
  Object.defineProperty(EL, "__esModule", {
    value: !0
  });
  EL.Agent = void 0;
  var fI3 = UcQ(NA("net")),
    $cQ = UcQ(NA("http")),
    hI3 = NA("https");
  bI3(zcQ(), EL);
  var fv = Symbol("AgentBaseInternalState");
  class qcQ extends $cQ.Agent {
    constructor(A) {
      super(A);
      this[fv] = {}
    }
    isSecureEndpoint(A) {
      if (A) {
        if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
        if (typeof A.protocol === "string") return A.protocol === "https:"
      }
      let {
        stack: Q
      } = Error();
      if (typeof Q !== "string") return !1;
      return Q.split(`
`).some((B) => B.indexOf("(https.js:") !== -1 || B.indexOf("node:https:") !== -1)
    }
    incrementSockets(A) {
      if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0) return null;
      if (!this.sockets[A]) this.sockets[A] = [];
      let Q = new fI3.Socket({
        writable: !1
      });
      return this.sockets[A].push(Q), this.totalSocketCount++, Q
    }
    decrementSockets(A, Q) {
      if (!this.sockets[A] || Q === null) return;
      let B = this.sockets[A],
        G = B.indexOf(Q);
      if (G !== -1) {
        if (B.splice(G, 1), this.totalSocketCount--, B.length === 0) delete this.sockets[A]
      }
    }
    getName(A) {
      if (typeof A.secureEndpoint === "boolean" ? A.secureEndpoint : this.isSecureEndpoint(A)) return hI3.Agent.prototype.getName.call(this, A);
      return super.getName(A)
    }
    createSocket(A, Q, B) {
      let G = {
          ...Q,
          secureEndpoint: this.isSecureEndpoint(Q)
        },
        Z = this.getName(G),
        Y = this.incrementSockets(Z);
      Promise.resolve().then(() => this.connect(A, G)).then((J) => {
        if (this.decrementSockets(Z, Y), J instanceof $cQ.Agent) try {
          return J.addRequest(A, G)
        } catch (X) {
          return B(X)
        }
        this[fv].currentSocket = J, super.createSocket(A, Q, B)
      }, (J) => {
        this.decrementSockets(Z, Y), B(J)
      })
    }
    createConnection() {
      let A = this[fv].currentSocket;
      if (this[fv].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
      return A
    }
    get defaultPort() {
      return this[fv].defaultPort ?? (this.protocol === "https:" ? 443 : 80)
    }
    set defaultPort(A) {
      if (this[fv]) this[fv].defaultPort = A
    }
    get protocol() {
      return this[fv].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:")
    }
    set protocol(A) {
      if (this[fv]) this[fv].protocol = A
    }
  }
  EL.Agent = qcQ
})
// @from(Ln 107560, Col 4)
NcQ = U((oYA) => {
  var gI3 = oYA && oYA.__importDefault || function (A) {
    return A && A.__esModule ? A : {
      default: A
    }
  };
  Object.defineProperty(oYA, "__esModule", {
    value: !0
  });
  oYA.parseProxyResponse = void 0;
  var uI3 = gI3(Q1A()),
    ItA = (0, uI3.default)("https-proxy-agent:parse-proxy-response");

  function mI3(A) {
    return new Promise((Q, B) => {
      let G = 0,
        Z = [];

      function Y() {
        let W = A.read();
        if (W) D(W);
        else A.once("readable", Y)
      }

      function J() {
        A.removeListener("end", X), A.removeListener("error", I), A.removeListener("readable", Y)
      }

      function X() {
        J(), ItA("onend"), B(Error("Proxy connection ended before receiving CONNECT response"))
      }

      function I(W) {
        J(), ItA("onerror %o", W), B(W)
      }

      function D(W) {
        Z.push(W), G += W.length;
        let K = Buffer.concat(Z, G),
          V = K.indexOf(`\r
\r
`);
        if (V === -1) {
          ItA("have not received end of HTTP headers yet..."), Y();
          return
        }
        let F = K.slice(0, V).toString("ascii").split(`\r
`),
          H = F.shift();
        if (!H) return A.destroy(), B(Error("No header received from proxy CONNECT response"));
        let E = H.split(" "),
          z = +E[1],
          $ = E.slice(2).join(" "),
          O = {};
        for (let L of F) {
          if (!L) continue;
          let M = L.indexOf(":");
          if (M === -1) return A.destroy(), B(Error(`Invalid header from proxy CONNECT response: "${L}"`));
          let _ = L.slice(0, M).toLowerCase(),
            j = L.slice(M + 1).trimStart(),
            x = O[_];
          if (typeof x === "string") O[_] = [x, j];
          else if (Array.isArray(x)) x.push(j);
          else O[_] = j
        }
        ItA("got proxy server response: %o %o", H, O), J(), Q({
          connect: {
            statusCode: z,
            statusText: $,
            headers: O
          },
          buffered: K
        })
      }
      A.on("error", I), A.on("end", X), Y()
    })
  }
  oYA.parseProxyResponse = mI3
})
// @from(Ln 107639, Col 4)
ELA = U((HR) => {
  var dI3 = HR && HR.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    cI3 = HR && HR.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    McQ = HR && HR.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) dI3(Q, A, B)
      }
      return cI3(Q, A), Q
    },
    RcQ = HR && HR.__importDefault || function (A) {
      return A && A.__esModule ? A : {
        default: A
      }
    };
  Object.defineProperty(HR, "__esModule", {
    value: !0
  });
  HR.HttpsProxyAgent = void 0;
  var DtA = McQ(NA("net")),
    wcQ = McQ(NA("tls")),
    pI3 = RcQ(NA("assert")),
    lI3 = RcQ(Q1A()),
    iI3 = am1(),
    nI3 = NA("url"),
    aI3 = NcQ(),
    HLA = (0, lI3.default)("https-proxy-agent"),
    LcQ = (A) => {
      if (A.servername === void 0 && A.host && !DtA.isIP(A.host)) return {
        ...A,
        servername: A.host
      };
      return A
    };
  class om1 extends iI3.Agent {
    constructor(A, Q) {
      super(Q);
      this.options = {
        path: void 0
      }, this.proxy = typeof A === "string" ? new nI3.URL(A) : A, this.proxyHeaders = Q?.headers ?? {}, HLA("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...Q ? OcQ(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    async connect(A, Q) {
      let {
        proxy: B
      } = this;
      if (!Q.host) throw TypeError('No "host" provided');
      let G;
      if (B.protocol === "https:") HLA("Creating `tls.Socket`: %o", this.connectOpts), G = wcQ.connect(LcQ(this.connectOpts));
      else HLA("Creating `net.Socket`: %o", this.connectOpts), G = DtA.connect(this.connectOpts);
      let Z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
          ...this.proxyHeaders
        },
        Y = DtA.isIPv6(Q.host) ? `[${Q.host}]` : Q.host,
        J = `CONNECT ${Y}:${Q.port} HTTP/1.1\r
`;
      if (B.username || B.password) {
        let K = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        Z["Proxy-Authorization"] = `Basic ${Buffer.from(K).toString("base64")}`
      }
      if (Z.Host = `${Y}:${Q.port}`, !Z["Proxy-Connection"]) Z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let K of Object.keys(Z)) J += `${K}: ${Z[K]}\r
`;
      let X = (0, aI3.parseProxyResponse)(G);
      G.write(`${J}\r
`);
      let {
        connect: I,
        buffered: D
      } = await X;
      if (A.emit("proxyConnect", I), this.emit("proxyConnect", I, A), I.statusCode === 200) {
        if (A.once("socket", oI3), Q.secureEndpoint) return HLA("Upgrading socket connection to TLS"), wcQ.connect({
          ...OcQ(LcQ(Q), "host", "path", "port"),
          socket: G
        });
        return G
      }
      G.destroy();
      let W = new DtA.Socket({
        writable: !1
      });
      return W.readable = !0, A.once("socket", (K) => {
        HLA("Replaying proxy buffer for failed request"), (0, pI3.default)(K.listenerCount("data") > 0), K.push(D), K.push(null)
      }), W
    }
  }
  om1.protocols = ["http", "https"];
  HR.HttpsProxyAgent = om1;

  function oI3(A) {
    A.resume()
  }

  function OcQ(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
})
// @from(Ln 107769, Col 4)
VX = U((yJG, _cQ) => {
  _cQ.exports = {
    kClose: Symbol("close"),
    kDestroy: Symbol("destroy"),
    kDispatch: Symbol("dispatch"),
    kUrl: Symbol("url"),
    kWriting: Symbol("writing"),
    kResuming: Symbol("resuming"),
    kQueue: Symbol("queue"),
    kConnect: Symbol("connect"),
    kConnecting: Symbol("connecting"),
    kKeepAliveDefaultTimeout: Symbol("default keep alive timeout"),
    kKeepAliveMaxTimeout: Symbol("max keep alive timeout"),
    kKeepAliveTimeoutThreshold: Symbol("keep alive timeout threshold"),
    kKeepAliveTimeoutValue: Symbol("keep alive timeout"),
    kKeepAlive: Symbol("keep alive"),
    kHeadersTimeout: Symbol("headers timeout"),
    kBodyTimeout: Symbol("body timeout"),
    kServerName: Symbol("server name"),
    kLocalAddress: Symbol("local address"),
    kHost: Symbol("host"),
    kNoRef: Symbol("no ref"),
    kBodyUsed: Symbol("used"),
    kBody: Symbol("abstracted request body"),
    kRunning: Symbol("running"),
    kBlocking: Symbol("blocking"),
    kPending: Symbol("pending"),
    kSize: Symbol("size"),
    kBusy: Symbol("busy"),
    kQueued: Symbol("queued"),
    kFree: Symbol("free"),
    kConnected: Symbol("connected"),
    kClosed: Symbol("closed"),
    kNeedDrain: Symbol("need drain"),
    kReset: Symbol("reset"),
    kDestroyed: Symbol.for("nodejs.stream.destroyed"),
    kResume: Symbol("resume"),
    kOnError: Symbol("on error"),
    kMaxHeadersSize: Symbol("max headers size"),
    kRunningIdx: Symbol("running index"),
    kPendingIdx: Symbol("pending index"),
    kError: Symbol("error"),
    kClients: Symbol("clients"),
    kClient: Symbol("client"),
    kParser: Symbol("parser"),
    kOnDestroyed: Symbol("destroy callbacks"),
    kPipelining: Symbol("pipelining"),
    kSocket: Symbol("socket"),
    kHostHeader: Symbol("host header"),
    kConnector: Symbol("connector"),
    kStrictContentLength: Symbol("strict content length"),
    kMaxRedirections: Symbol("maxRedirections"),
    kMaxRequests: Symbol("maxRequestsPerClient"),
    kProxy: Symbol("proxy agent options"),
    kCounter: Symbol("socket request counter"),
    kInterceptors: Symbol("dispatch interceptors"),
    kMaxResponseSize: Symbol("max response size"),
    kHTTP2Session: Symbol("http2Session"),
    kHTTP2SessionState: Symbol("http2Session state"),
    kRetryHandlerDefaultRetry: Symbol("retry agent default retry"),
    kConstruct: Symbol("constructable"),
    kListeners: Symbol("listeners"),
    kHTTPContext: Symbol("http context"),
    kMaxConcurrentStreams: Symbol("max concurrent streams"),
    kNoProxyAgent: Symbol("no proxy agent"),
    kHttpProxyAgent: Symbol("http proxy agent"),
    kHttpsProxyAgent: Symbol("https proxy agent")
  }
})
// @from(Ln 107838, Col 4)
GG = U((vJG, ocQ) => {
  class gI extends Error {
    constructor(A) {
      super(A);
      this.name = "UndiciError", this.code = "UND_ERR"
    }
  }
  class jcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "ConnectTimeoutError", this.message = A || "Connect Timeout Error", this.code = "UND_ERR_CONNECT_TIMEOUT"
    }
  }
  class TcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "HeadersTimeoutError", this.message = A || "Headers Timeout Error", this.code = "UND_ERR_HEADERS_TIMEOUT"
    }
  }
  class PcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "HeadersOverflowError", this.message = A || "Headers Overflow Error", this.code = "UND_ERR_HEADERS_OVERFLOW"
    }
  }
  class ScQ extends gI {
    constructor(A) {
      super(A);
      this.name = "BodyTimeoutError", this.message = A || "Body Timeout Error", this.code = "UND_ERR_BODY_TIMEOUT"
    }
  }
  class xcQ extends gI {
    constructor(A, Q, B, G) {
      super(A);
      this.name = "ResponseStatusCodeError", this.message = A || "Response Status Code Error", this.code = "UND_ERR_RESPONSE_STATUS_CODE", this.body = G, this.status = Q, this.statusCode = Q, this.headers = B
    }
  }
  class ycQ extends gI {
    constructor(A) {
      super(A);
      this.name = "InvalidArgumentError", this.message = A || "Invalid Argument Error", this.code = "UND_ERR_INVALID_ARG"
    }
  }
  class vcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "InvalidReturnValueError", this.message = A || "Invalid Return Value Error", this.code = "UND_ERR_INVALID_RETURN_VALUE"
    }
  }
  class rm1 extends gI {
    constructor(A) {
      super(A);
      this.name = "AbortError", this.message = A || "The operation was aborted"
    }
  }
  class kcQ extends rm1 {
    constructor(A) {
      super(A);
      this.name = "AbortError", this.message = A || "Request aborted", this.code = "UND_ERR_ABORTED"
    }
  }
  class bcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "InformationalError", this.message = A || "Request information", this.code = "UND_ERR_INFO"
    }
  }
  class fcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "RequestContentLengthMismatchError", this.message = A || "Request body length does not match content-length header", this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH"
    }
  }
  class hcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "ResponseContentLengthMismatchError", this.message = A || "Response body length does not match content-length header", this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH"
    }
  }
  class gcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "ClientDestroyedError", this.message = A || "The client is destroyed", this.code = "UND_ERR_DESTROYED"
    }
  }
  class ucQ extends gI {
    constructor(A) {
      super(A);
      this.name = "ClientClosedError", this.message = A || "The client is closed", this.code = "UND_ERR_CLOSED"
    }
  }
  class mcQ extends gI {
    constructor(A, Q) {
      super(A);
      this.name = "SocketError", this.message = A || "Socket error", this.code = "UND_ERR_SOCKET", this.socket = Q
    }
  }
  class dcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "NotSupportedError", this.message = A || "Not supported error", this.code = "UND_ERR_NOT_SUPPORTED"
    }
  }
  class ccQ extends gI {
    constructor(A) {
      super(A);
      this.name = "MissingUpstreamError", this.message = A || "No upstream has been added to the BalancedPool", this.code = "UND_ERR_BPL_MISSING_UPSTREAM"
    }
  }
  class pcQ extends Error {
    constructor(A, Q, B) {
      super(A);
      this.name = "HTTPParserError", this.code = Q ? `HPE_${Q}` : void 0, this.data = B ? B.toString() : void 0
    }
  }
  class lcQ extends gI {
    constructor(A) {
      super(A);
      this.name = "ResponseExceededMaxSizeError", this.message = A || "Response content exceeded max size", this.code = "UND_ERR_RES_EXCEEDED_MAX_SIZE"
    }
  }
  class icQ extends gI {
    constructor(A, Q, {
      headers: B,
      data: G
    }) {
      super(A);
      this.name = "RequestRetryError", this.message = A || "Request retry error", this.code = "UND_ERR_REQ_RETRY", this.statusCode = Q, this.data = G, this.headers = B
    }
  }
  class ncQ extends gI {
    constructor(A, Q, {
      headers: B,
      data: G
    }) {
      super(A);
      this.name = "ResponseError", this.message = A || "Response error", this.code = "UND_ERR_RESPONSE", this.statusCode = Q, this.data = G, this.headers = B
    }
  }
  class acQ extends gI {
    constructor(A, Q, B) {
      super(Q, {
        cause: A,
        ...B ?? {}
      });
      this.name = "SecureProxyConnectionError", this.message = Q || "Secure Proxy Connection failed", this.code = "UND_ERR_PRX_TLS", this.cause = A
    }
  }
  ocQ.exports = {
    AbortError: rm1,
    HTTPParserError: pcQ,
    UndiciError: gI,
    HeadersTimeoutError: TcQ,
    HeadersOverflowError: PcQ,
    BodyTimeoutError: ScQ,
    RequestContentLengthMismatchError: fcQ,
    ConnectTimeoutError: jcQ,
    ResponseStatusCodeError: xcQ,
    InvalidArgumentError: ycQ,
    InvalidReturnValueError: vcQ,
    RequestAbortedError: kcQ,
    ClientDestroyedError: gcQ,
    ClientClosedError: ucQ,
    InformationalError: bcQ,
    SocketError: mcQ,
    NotSupportedError: dcQ,
    ResponseContentLengthMismatchError: hcQ,
    BalancedPoolMissingUpstreamError: ccQ,
    ResponseExceededMaxSizeError: lcQ,
    RequestRetryError: icQ,
    ResponseError: ncQ,
    SecureProxyConnectionError: acQ
  }
})
// @from(Ln 108012, Col 4)
KtA = U((kJG, rcQ) => {
  var WtA = {},
    sm1 = ["Accept", "Accept-Encoding", "Accept-Language", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Disposition", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Downlink", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Last-Modified", "Link", "Location", "Max-Forwards", "Origin", "Permissions-Policy", "Pragma", "Proxy-Authenticate", "Proxy-Authorization", "RTT", "Range", "Referer", "Referrer-Policy", "Refresh", "Retry-After", "Sec-WebSocket-Accept", "Sec-WebSocket-Extensions", "Sec-WebSocket-Key", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version", "Server", "Server-Timing", "Service-Worker-Allowed", "Service-Worker-Navigation-Preload", "Set-Cookie", "SourceMap", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Frame-Options", "X-Permitted-Cross-Domain-Policies", "X-Powered-By", "X-Requested-With", "X-XSS-Protection"];
  for (let A = 0; A < sm1.length; ++A) {
    let Q = sm1[A],
      B = Q.toLowerCase();
    WtA[Q] = WtA[B] = B
  }
  Object.setPrototypeOf(WtA, null);
  rcQ.exports = {
    wellknownHeaderNames: sm1,
    headerNameLowerCasedRecord: WtA
  }
})
// @from(Ln 108026, Col 4)
ApQ = U((bJG, ecQ) => {
  var {
    wellknownHeaderNames: scQ,
    headerNameLowerCasedRecord: rI3
  } = KtA();
  class rYA {
    value = null;
    left = null;
    middle = null;
    right = null;
    code;
    constructor(A, Q, B) {
      if (B === void 0 || B >= A.length) throw TypeError("Unreachable");
      if ((this.code = A.charCodeAt(B)) > 127) throw TypeError("key must be ascii string");
      if (A.length !== ++B) this.middle = new rYA(A, Q, B);
      else this.value = Q
    }
    add(A, Q) {
      let B = A.length;
      if (B === 0) throw TypeError("Unreachable");
      let G = 0,
        Z = this;
      while (!0) {
        let Y = A.charCodeAt(G);
        if (Y > 127) throw TypeError("key must be ascii string");
        if (Z.code === Y)
          if (B === ++G) {
            Z.value = Q;
            break
          } else if (Z.middle !== null) Z = Z.middle;
        else {
          Z.middle = new rYA(A, Q, G);
          break
        } else if (Z.code < Y)
          if (Z.left !== null) Z = Z.left;
          else {
            Z.left = new rYA(A, Q, G);
            break
          }
        else if (Z.right !== null) Z = Z.right;
        else {
          Z.right = new rYA(A, Q, G);
          break
        }
      }
    }
    search(A) {
      let Q = A.length,
        B = 0,
        G = this;
      while (G !== null && B < Q) {
        let Z = A[B];
        if (Z <= 90 && Z >= 65) Z |= 32;
        while (G !== null) {
          if (Z === G.code) {
            if (Q === ++B) return G;
            G = G.middle;
            break
          }
          G = G.code < Z ? G.left : G.right
        }
      }
      return null
    }
  }
  class tm1 {
    node = null;
    insert(A, Q) {
      if (this.node === null) this.node = new rYA(A, Q, 0);
      else this.node.add(A, Q)
    }
    lookup(A) {
      return this.node?.search(A)?.value ?? null
    }
  }
  var tcQ = new tm1;
  for (let A = 0; A < scQ.length; ++A) {
    let Q = rI3[scQ[A]];
    tcQ.insert(Q, Q)
  }
  ecQ.exports = {
    TernarySearchTree: tm1,
    tree: tcQ
  }
})
// @from(Ln 108111, Col 4)
b8 = U((fJG, zpQ) => {
  var zLA = NA("node:assert"),
    {
      kDestroyed: BpQ,
      kBodyUsed: sYA,
      kListeners: em1,
      kBody: QpQ
    } = VX(),
    {
      IncomingMessage: sI3
    } = NA("node:http"),
    FtA = NA("node:stream"),
    tI3 = NA("node:net"),
    {
      Blob: eI3
    } = NA("node:buffer"),
    AD3 = NA("node:util"),
    {
      stringify: QD3
    } = NA("node:querystring"),
    {
      EventEmitter: BD3
    } = NA("node:events"),
    {
      InvalidArgumentError: AF
    } = GG(),
    {
      headerNameLowerCasedRecord: GD3
    } = KtA(),
    {
      tree: GpQ
    } = ApQ(),
    [ZD3, YD3] = process.versions.node.split(".").map((A) => Number(A));
  class Ad1 {
    constructor(A) {
      this[QpQ] = A, this[sYA] = !1
    }
    async * [Symbol.asyncIterator]() {
      zLA(!this[sYA], "disturbed"), this[sYA] = !0, yield* this[QpQ]
    }
  }

  function JD3(A) {
    if (HtA(A)) {
      if (IpQ(A) === 0) A.on("data", function () {
        zLA(!1)
      });
      if (typeof A.readableDidRead !== "boolean") A[sYA] = !1, BD3.prototype.on.call(A, "data", function () {
        this[sYA] = !0
      });
      return A
    } else if (A && typeof A.pipeTo === "function") return new Ad1(A);
    else if (A && typeof A !== "string" && !ArrayBuffer.isView(A) && XpQ(A)) return new Ad1(A);
    else return A
  }

  function XD3() {}

  function HtA(A) {
    return A && typeof A === "object" && typeof A.pipe === "function" && typeof A.on === "function"
  }

  function ZpQ(A) {
    if (A === null) return !1;
    else if (A instanceof eI3) return !0;
    else if (typeof A !== "object") return !1;
    else {
      let Q = A[Symbol.toStringTag];
      return (Q === "Blob" || Q === "File") && (("stream" in A) && typeof A.stream === "function" || ("arrayBuffer" in A) && typeof A.arrayBuffer === "function")
    }
  }

  function ID3(A, Q) {
    if (A.includes("?") || A.includes("#")) throw Error('Query params cannot be passed when url already contains "?" or "#".');
    let B = QD3(Q);
    if (B) A += "?" + B;
    return A
  }

  function YpQ(A) {
    let Q = parseInt(A, 10);
    return Q === Number(A) && Q >= 0 && Q <= 65535
  }

  function VtA(A) {
    return A != null && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && (A[4] === ":" || A[4] === "s" && A[5] === ":")
  }

  function JpQ(A) {
    if (typeof A === "string") {
      if (A = new URL(A), !VtA(A.origin || A.protocol)) throw new AF("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      return A
    }
    if (!A || typeof A !== "object") throw new AF("Invalid URL: The URL argument must be a non-null object.");
    if (!(A instanceof URL)) {
      if (A.port != null && A.port !== "" && YpQ(A.port) === !1) throw new AF("Invalid URL: port must be a valid integer or a string representation of an integer.");
      if (A.path != null && typeof A.path !== "string") throw new AF("Invalid URL path: the path must be a string or null/undefined.");
      if (A.pathname != null && typeof A.pathname !== "string") throw new AF("Invalid URL pathname: the pathname must be a string or null/undefined.");
      if (A.hostname != null && typeof A.hostname !== "string") throw new AF("Invalid URL hostname: the hostname must be a string or null/undefined.");
      if (A.origin != null && typeof A.origin !== "string") throw new AF("Invalid URL origin: the origin must be a string or null/undefined.");
      if (!VtA(A.origin || A.protocol)) throw new AF("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      let Q = A.port != null ? A.port : A.protocol === "https:" ? 443 : 80,
        B = A.origin != null ? A.origin : `${A.protocol||""}//${A.hostname||""}:${Q}`,
        G = A.path != null ? A.path : `${A.pathname||""}${A.search||""}`;
      if (B[B.length - 1] === "/") B = B.slice(0, B.length - 1);
      if (G && G[0] !== "/") G = `/${G}`;
      return new URL(`${B}${G}`)
    }
    if (!VtA(A.origin || A.protocol)) throw new AF("Invalid URL protocol: the URL must start with `http:` or `https:`.");
    return A
  }

  function DD3(A) {
    if (A = JpQ(A), A.pathname !== "/" || A.search || A.hash) throw new AF("invalid url");
    return A
  }

  function WD3(A) {
    if (A[0] === "[") {
      let B = A.indexOf("]");
      return zLA(B !== -1), A.substring(1, B)
    }
    let Q = A.indexOf(":");
    if (Q === -1) return A;
    return A.substring(0, Q)
  }

  function KD3(A) {
    if (!A) return null;
    zLA(typeof A === "string");
    let Q = WD3(A);
    if (tI3.isIP(Q)) return "";
    return Q
  }

  function VD3(A) {
    return JSON.parse(JSON.stringify(A))
  }

  function FD3(A) {
    return A != null && typeof A[Symbol.asyncIterator] === "function"
  }

  function XpQ(A) {
    return A != null && (typeof A[Symbol.iterator] === "function" || typeof A[Symbol.asyncIterator] === "function")
  }

  function IpQ(A) {
    if (A == null) return 0;
    else if (HtA(A)) {
      let Q = A._readableState;
      return Q && Q.objectMode === !1 && Q.ended === !0 && Number.isFinite(Q.length) ? Q.length : null
    } else if (ZpQ(A)) return A.size != null ? A.size : null;
    else if (KpQ(A)) return A.byteLength;
    return null
  }

  function DpQ(A) {
    return A && !!(A.destroyed || A[BpQ] || FtA.isDestroyed?.(A))
  }

  function HD3(A, Q) {
    if (A == null || !HtA(A) || DpQ(A)) return;
    if (typeof A.destroy === "function") {
      if (Object.getPrototypeOf(A).constructor === sI3) A.socket = null;
      A.destroy(Q)
    } else if (Q) queueMicrotask(() => {
      A.emit("error", Q)
    });
    if (A.destroyed !== !0) A[BpQ] = !0
  }
  var ED3 = /timeout=(\d+)/;

  function zD3(A) {
    let Q = A.toString().match(ED3);
    return Q ? parseInt(Q[1], 10) * 1000 : null
  }

  function WpQ(A) {
    return typeof A === "string" ? GD3[A] ?? A.toLowerCase() : GpQ.lookup(A) ?? A.toString("latin1").toLowerCase()
  }

  function $D3(A) {
    return GpQ.lookup(A) ?? A.toString("latin1").toLowerCase()
  }

  function CD3(A, Q) {
    if (Q === void 0) Q = {};
    for (let B = 0; B < A.length; B += 2) {
      let G = WpQ(A[B]),
        Z = Q[G];
      if (Z) {
        if (typeof Z === "string") Z = [Z], Q[G] = Z;
        Z.push(A[B + 1].toString("utf8"))
      } else {
        let Y = A[B + 1];
        if (typeof Y === "string") Q[G] = Y;
        else Q[G] = Array.isArray(Y) ? Y.map((J) => J.toString("utf8")) : Y.toString("utf8")
      }
    }
    if ("content-length" in Q && "content-disposition" in Q) Q["content-disposition"] = Buffer.from(Q["content-disposition"]).toString("latin1");
    return Q
  }

  function UD3(A) {
    let Q = A.length,
      B = Array(Q),
      G = !1,
      Z = -1,
      Y, J, X = 0;
    for (let I = 0; I < A.length; I += 2) {
      if (Y = A[I], J = A[I + 1], typeof Y !== "string" && (Y = Y.toString()), typeof J !== "string" && (J = J.toString("utf8")), X = Y.length, X === 14 && Y[7] === "-" && (Y === "content-length" || Y.toLowerCase() === "content-length")) G = !0;
      else if (X === 19 && Y[7] === "-" && (Y === "content-disposition" || Y.toLowerCase() === "content-disposition")) Z = I + 1;
      B[I] = Y, B[I + 1] = J
    }
    if (G && Z !== -1) B[Z] = Buffer.from(B[Z]).toString("latin1");
    return B
  }

  function KpQ(A) {
    return A instanceof Uint8Array || Buffer.isBuffer(A)
  }

  function qD3(A, Q, B) {
    if (!A || typeof A !== "object") throw new AF("handler must be an object");
    if (typeof A.onConnect !== "function") throw new AF("invalid onConnect method");
    if (typeof A.onError !== "function") throw new AF("invalid onError method");
    if (typeof A.onBodySent !== "function" && A.onBodySent !== void 0) throw new AF("invalid onBodySent method");
    if (B || Q === "CONNECT") {
      if (typeof A.onUpgrade !== "function") throw new AF("invalid onUpgrade method")
    } else {
      if (typeof A.onHeaders !== "function") throw new AF("invalid onHeaders method");
      if (typeof A.onData !== "function") throw new AF("invalid onData method");
      if (typeof A.onComplete !== "function") throw new AF("invalid onComplete method")
    }
  }

  function ND3(A) {
    return !!(A && (FtA.isDisturbed(A) || A[sYA]))
  }

  function wD3(A) {
    return !!(A && FtA.isErrored(A))
  }

  function LD3(A) {
    return !!(A && FtA.isReadable(A))
  }

  function OD3(A) {
    return {
      localAddress: A.localAddress,
      localPort: A.localPort,
      remoteAddress: A.remoteAddress,
      remotePort: A.remotePort,
      remoteFamily: A.remoteFamily,
      timeout: A.timeout,
      bytesWritten: A.bytesWritten,
      bytesRead: A.bytesRead
    }
  }

  function MD3(A) {
    let Q;
    return new ReadableStream({
      async start() {
        Q = A[Symbol.asyncIterator]()
      },
      async pull(B) {
        let {
          done: G,
          value: Z
        } = await Q.next();
        if (G) queueMicrotask(() => {
          B.close(), B.byobRequest?.respond(0)
        });
        else {
          let Y = Buffer.isBuffer(Z) ? Z : Buffer.from(Z);
          if (Y.byteLength) B.enqueue(new Uint8Array(Y))
        }
        return B.desiredSize > 0
      },
      async cancel(B) {
        await Q.return()
      },
      type: "bytes"
    })
  }

  function RD3(A) {
    return A && typeof A === "object" && typeof A.append === "function" && typeof A.delete === "function" && typeof A.get === "function" && typeof A.getAll === "function" && typeof A.has === "function" && typeof A.set === "function" && A[Symbol.toStringTag] === "FormData"
  }

  function _D3(A, Q) {
    if ("addEventListener" in A) return A.addEventListener("abort", Q, {
      once: !0
    }), () => A.removeEventListener("abort", Q);
    return A.addListener("abort", Q), () => A.removeListener("abort", Q)
  }
  var jD3 = typeof String.prototype.toWellFormed === "function",
    TD3 = typeof String.prototype.isWellFormed === "function";

  function VpQ(A) {
    return jD3 ? `${A}`.toWellFormed() : AD3.toUSVString(A)
  }

  function PD3(A) {
    return TD3 ? `${A}`.isWellFormed() : VpQ(A) === `${A}`
  }

  function FpQ(A) {
    switch (A) {
      case 34:
      case 40:
      case 41:
      case 44:
      case 47:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 63:
      case 64:
      case 91:
      case 92:
      case 93:
      case 123:
      case 125:
        return !1;
      default:
        return A >= 33 && A <= 126
    }
  }

  function SD3(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; ++Q)
      if (!FpQ(A.charCodeAt(Q))) return !1;
    return !0
  }
  var xD3 = /[^\t\x20-\x7e\x80-\xff]/;

  function yD3(A) {
    return !xD3.test(A)
  }

  function vD3(A) {
    if (A == null || A === "") return {
      start: 0,
      end: null,
      size: null
    };
    let Q = A ? A.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null;
    return Q ? {
      start: parseInt(Q[1]),
      end: Q[2] ? parseInt(Q[2]) : null,
      size: Q[3] ? parseInt(Q[3]) : null
    } : null
  }

  function kD3(A, Q, B) {
    return (A[em1] ??= []).push([Q, B]), A.on(Q, B), A
  }

  function bD3(A) {
    for (let [Q, B] of A[em1] ?? []) A.removeListener(Q, B);
    A[em1] = null
  }

  function fD3(A, Q, B) {
    try {
      Q.onError(B), zLA(Q.aborted)
    } catch (G) {
      A.emit("error", G)
    }
  }
  var HpQ = Object.create(null);
  HpQ.enumerable = !0;
  var Qd1 = {
      delete: "DELETE",
      DELETE: "DELETE",
      get: "GET",
      GET: "GET",
      head: "HEAD",
      HEAD: "HEAD",
      options: "OPTIONS",
      OPTIONS: "OPTIONS",
      post: "POST",
      POST: "POST",
      put: "PUT",
      PUT: "PUT"
    },
    EpQ = {
      ...Qd1,
      patch: "patch",
      PATCH: "PATCH"
    };
  Object.setPrototypeOf(Qd1, null);
  Object.setPrototypeOf(EpQ, null);
  zpQ.exports = {
    kEnumerableProperty: HpQ,
    nop: XD3,
    isDisturbed: ND3,
    isErrored: wD3,
    isReadable: LD3,
    toUSVString: VpQ,
    isUSVString: PD3,
    isBlobLike: ZpQ,
    parseOrigin: DD3,
    parseURL: JpQ,
    getServerName: KD3,
    isStream: HtA,
    isIterable: XpQ,
    isAsyncIterable: FD3,
    isDestroyed: DpQ,
    headerNameToString: WpQ,
    bufferToLowerCasedHeaderName: $D3,
    addListener: kD3,
    removeAllListeners: bD3,
    errorRequest: fD3,
    parseRawHeaders: UD3,
    parseHeaders: CD3,
    parseKeepAliveTimeout: zD3,
    destroy: HD3,
    bodyLength: IpQ,
    deepClone: VD3,
    ReadableStreamFrom: MD3,
    isBuffer: KpQ,
    validateHandler: qD3,
    getSocketInfo: OD3,
    isFormDataLike: RD3,
    buildURL: ID3,
    addAbortListener: _D3,
    isValidHTTPToken: SD3,
    isValidHeaderValue: yD3,
    isTokenCharCode: FpQ,
    parseRangeHeader: vD3,
    normalizedMethodRecordsBase: Qd1,
    normalizedMethodRecords: EpQ,
    isValidPort: YpQ,
    isHttpOrHttpsPrefixed: VtA,
    nodeMajor: ZD3,
    nodeMinor: YD3,
    safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
    wrapRequestBody: JD3
  }
})
// @from(Ln 108559, Col 4)
tYA = U((hJG, CpQ) => {
  var _G = NA("node:diagnostics_channel"),
    Gd1 = NA("node:util"),
    EtA = Gd1.debuglog("undici"),
    Bd1 = Gd1.debuglog("fetch"),
    d0A = Gd1.debuglog("websocket"),
    $pQ = !1,
    hD3 = {
      beforeConnect: _G.channel("undici:client:beforeConnect"),
      connected: _G.channel("undici:client:connected"),
      connectError: _G.channel("undici:client:connectError"),
      sendHeaders: _G.channel("undici:client:sendHeaders"),
      create: _G.channel("undici:request:create"),
      bodySent: _G.channel("undici:request:bodySent"),
      headers: _G.channel("undici:request:headers"),
      trailers: _G.channel("undici:request:trailers"),
      error: _G.channel("undici:request:error"),
      open: _G.channel("undici:websocket:open"),
      close: _G.channel("undici:websocket:close"),
      socketError: _G.channel("undici:websocket:socket_error"),
      ping: _G.channel("undici:websocket:ping"),
      pong: _G.channel("undici:websocket:pong")
    };
  if (EtA.enabled || Bd1.enabled) {
    let A = Bd1.enabled ? Bd1 : EtA;
    _G.channel("undici:client:beforeConnect").subscribe((Q) => {
      let {
        connectParams: {
          version: B,
          protocol: G,
          port: Z,
          host: Y
        }
      } = Q;
      A("connecting to %s using %s%s", `${Y}${Z?`:${Z}`:""}`, G, B)
    }), _G.channel("undici:client:connected").subscribe((Q) => {
      let {
        connectParams: {
          version: B,
          protocol: G,
          port: Z,
          host: Y
        }
      } = Q;
      A("connected to %s using %s%s", `${Y}${Z?`:${Z}`:""}`, G, B)
    }), _G.channel("undici:client:connectError").subscribe((Q) => {
      let {
        connectParams: {
          version: B,
          protocol: G,
          port: Z,
          host: Y
        },
        error: J
      } = Q;
      A("connection to %s using %s%s errored - %s", `${Y}${Z?`:${Z}`:""}`, G, B, J.message)
    }), _G.channel("undici:client:sendHeaders").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        }
      } = Q;
      A("sending request to %s %s/%s", B, Z, G)
    }), _G.channel("undici:request:headers").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        },
        response: {
          statusCode: Y
        }
      } = Q;
      A("received response to %s %s/%s - HTTP %d", B, Z, G, Y)
    }), _G.channel("undici:request:trailers").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        }
      } = Q;
      A("trailers received from %s %s/%s", B, Z, G)
    }), _G.channel("undici:request:error").subscribe((Q) => {
      let {
        request: {
          method: B,
          path: G,
          origin: Z
        },
        error: Y
      } = Q;
      A("request to %s %s/%s errored - %s", B, Z, G, Y.message)
    }), $pQ = !0
  }
  if (d0A.enabled) {
    if (!$pQ) {
      let A = EtA.enabled ? EtA : d0A;
      _G.channel("undici:client:beforeConnect").subscribe((Q) => {
        let {
          connectParams: {
            version: B,
            protocol: G,
            port: Z,
            host: Y
          }
        } = Q;
        A("connecting to %s%s using %s%s", Y, Z ? `:${Z}` : "", G, B)
      }), _G.channel("undici:client:connected").subscribe((Q) => {
        let {
          connectParams: {
            version: B,
            protocol: G,
            port: Z,
            host: Y
          }
        } = Q;
        A("connected to %s%s using %s%s", Y, Z ? `:${Z}` : "", G, B)
      }), _G.channel("undici:client:connectError").subscribe((Q) => {
        let {
          connectParams: {
            version: B,
            protocol: G,
            port: Z,
            host: Y
          },
          error: J
        } = Q;
        A("connection to %s%s using %s%s errored - %s", Y, Z ? `:${Z}` : "", G, B, J.message)
      }), _G.channel("undici:client:sendHeaders").subscribe((Q) => {
        let {
          request: {
            method: B,
            path: G,
            origin: Z
          }
        } = Q;
        A("sending request to %s %s/%s", B, Z, G)
      })
    }
    _G.channel("undici:websocket:open").subscribe((A) => {
      let {
        address: {
          address: Q,
          port: B
        }
      } = A;
      d0A("connection opened %s%s", Q, B ? `:${B}` : "")
    }), _G.channel("undici:websocket:close").subscribe((A) => {
      let {
        websocket: Q,
        code: B,
        reason: G
      } = A;
      d0A("closed connection to %s - %s %s", Q.url, B, G)
    }), _G.channel("undici:websocket:socket_error").subscribe((A) => {
      d0A("connection errored - %s", A.message)
    }), _G.channel("undici:websocket:ping").subscribe((A) => {
      d0A("ping received")
    }), _G.channel("undici:websocket:pong").subscribe((A) => {
      d0A("pong received")
    })
  }
  CpQ.exports = {
    channels: hD3
  }
})