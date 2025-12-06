
// @from(Start 3913662, End 4112661)
CgQ = z((sO7, HgQ) => {
  var {
    defineProperty: odA,
    getOwnPropertyDescriptor: FD8,
    getOwnPropertyNames: KD8
  } = Object, DD8 = Object.prototype.hasOwnProperty, QA = (A, Q) => odA(A, "name", {
    value: Q,
    configurable: !0
  }), HD8 = (A, Q) => {
    for (var B in Q) odA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, CD8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of KD8(Q))
        if (!DD8.call(A, Z) && Z !== B) odA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = FD8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ED8 = (A) => CD8(odA({}, "__esModule", {
    value: !0
  }), A), TbQ = {};
  HD8(TbQ, {
    AccessDeniedException: () => PbQ,
    AgreementStatus: () => RD8,
    ApplicationType: () => yD8,
    AttributeType: () => hD8,
    AuthorizationStatus: () => qH8,
    AutomatedEvaluationConfigFilterSensitiveLog: () => nbQ,
    AutomatedEvaluationCustomMetricConfigFilterSensitiveLog: () => lbQ,
    AutomatedEvaluationCustomMetricSource: () => pdA,
    AutomatedEvaluationCustomMetricSourceFilterSensitiveLog: () => pbQ,
    BatchDeleteEvaluationJobCommand: () => DhQ,
    BatchDeleteEvaluationJobErrorFilterSensitiveLog: () => mbQ,
    BatchDeleteEvaluationJobItemFilterSensitiveLog: () => dbQ,
    BatchDeleteEvaluationJobRequestFilterSensitiveLog: () => ubQ,
    BatchDeleteEvaluationJobResponseFilterSensitiveLog: () => cbQ,
    Bedrock: () => DgQ,
    BedrockClient: () => tz,
    BedrockServiceException: () => tR,
    ByteContentDocFilterSensitiveLog: () => AfQ,
    CommitmentDuration: () => UH8,
    ConflictException: () => ybQ,
    CreateCustomModelCommand: () => HhQ,
    CreateEvaluationJobCommand: () => ChQ,
    CreateEvaluationJobRequestFilterSensitiveLog: () => AhQ,
    CreateFoundationModelAgreementCommand: () => EhQ,
    CreateGuardrailCommand: () => zhQ,
    CreateGuardrailRequestFilterSensitiveLog: () => UfQ,
    CreateGuardrailVersionCommand: () => UhQ,
    CreateGuardrailVersionRequestFilterSensitiveLog: () => $fQ,
    CreateInferenceProfileCommand: () => $hQ,
    CreateInferenceProfileRequestFilterSensitiveLog: () => vfQ,
    CreateMarketplaceModelEndpointCommand: () => whQ,
    CreateModelCopyJobCommand: () => qhQ,
    CreateModelCustomizationJobCommand: () => NhQ,
    CreateModelCustomizationJobRequestFilterSensitiveLog: () => ifQ,
    CreateModelImportJobCommand: () => LhQ,
    CreateModelInvocationJobCommand: () => MhQ,
    CreatePromptRouterCommand: () => OhQ,
    CreatePromptRouterRequestFilterSensitiveLog: () => dfQ,
    CreateProvisionedModelThroughputCommand: () => RhQ,
    CustomMetricDefinitionFilterSensitiveLog: () => NH8,
    CustomizationConfig: () => Sj1,
    CustomizationType: () => PD8,
    DeleteCustomModelCommand: () => ThQ,
    DeleteFoundationModelAgreementCommand: () => PhQ,
    DeleteGuardrailCommand: () => jhQ,
    DeleteImportedModelCommand: () => ShQ,
    DeleteInferenceProfileCommand: () => _hQ,
    DeleteMarketplaceModelEndpointCommand: () => khQ,
    DeleteModelInvocationLoggingConfigurationCommand: () => yhQ,
    DeletePromptRouterCommand: () => xhQ,
    DeleteProvisionedModelThroughputCommand: () => vhQ,
    DeregisterMarketplaceModelEndpointCommand: () => bhQ,
    EndpointConfig: () => Pj1,
    EntitlementAvailability: () => MH8,
    EvaluationBedrockModelFilterSensitiveLog: () => obQ,
    EvaluationConfig: () => ldA,
    EvaluationConfigFilterSensitiveLog: () => pj1,
    EvaluationDatasetFilterSensitiveLog: () => ibQ,
    EvaluationDatasetLocation: () => yj1,
    EvaluationDatasetMetricConfigFilterSensitiveLog: () => cj1,
    EvaluationInferenceConfig: () => sdA,
    EvaluationInferenceConfigFilterSensitiveLog: () => oj1,
    EvaluationJobStatus: () => kD8,
    EvaluationJobType: () => cD8,
    EvaluationModelConfig: () => vj1,
    EvaluationModelConfigFilterSensitiveLog: () => tbQ,
    EvaluationPrecomputedRagSourceConfig: () => fj1,
    EvaluationTaskType: () => xD8,
    EvaluatorModelConfig: () => xj1,
    ExternalSourceFilterSensitiveLog: () => QfQ,
    ExternalSourceType: () => bD8,
    ExternalSourcesGenerationConfigurationFilterSensitiveLog: () => ebQ,
    ExternalSourcesRetrieveAndGenerateConfigurationFilterSensitiveLog: () => BfQ,
    FineTuningJobStatus: () => jH8,
    FoundationModelLifecycleStatus: () => CH8,
    GenerationConfigurationFilterSensitiveLog: () => GfQ,
    GetCustomModelCommand: () => fhQ,
    GetCustomModelResponseFilterSensitiveLog: () => gbQ,
    GetEvaluationJobCommand: () => hhQ,
    GetEvaluationJobRequestFilterSensitiveLog: () => XfQ,
    GetEvaluationJobResponseFilterSensitiveLog: () => QhQ,
    GetFoundationModelAvailabilityCommand: () => ghQ,
    GetFoundationModelCommand: () => uhQ,
    GetGuardrailCommand: () => mhQ,
    GetGuardrailResponseFilterSensitiveLog: () => _fQ,
    GetImportedModelCommand: () => dhQ,
    GetInferenceProfileCommand: () => chQ,
    GetInferenceProfileResponseFilterSensitiveLog: () => bfQ,
    GetMarketplaceModelEndpointCommand: () => phQ,
    GetModelCopyJobCommand: () => lhQ,
    GetModelCustomizationJobCommand: () => ihQ,
    GetModelCustomizationJobResponseFilterSensitiveLog: () => nfQ,
    GetModelImportJobCommand: () => nhQ,
    GetModelInvocationJobCommand: () => ahQ,
    GetModelInvocationJobResponseFilterSensitiveLog: () => gfQ,
    GetModelInvocationLoggingConfigurationCommand: () => shQ,
    GetPromptRouterCommand: () => rhQ,
    GetPromptRouterResponseFilterSensitiveLog: () => cfQ,
    GetProvisionedModelThroughputCommand: () => ohQ,
    GetUseCaseForModelAccessCommand: () => thQ,
    GuardrailContentFilterAction: () => lD8,
    GuardrailContentFilterConfigFilterSensitiveLog: () => FfQ,
    GuardrailContentFilterFilterSensitiveLog: () => wfQ,
    GuardrailContentFilterType: () => aD8,
    GuardrailContentFiltersTierConfigFilterSensitiveLog: () => KfQ,
    GuardrailContentFiltersTierFilterSensitiveLog: () => qfQ,
    GuardrailContentFiltersTierName: () => sD8,
    GuardrailContentPolicyConfigFilterSensitiveLog: () => ij1,
    GuardrailContentPolicyFilterSensitiveLog: () => NfQ,
    GuardrailContextualGroundingAction: () => rD8,
    GuardrailContextualGroundingFilterConfigFilterSensitiveLog: () => DfQ,
    GuardrailContextualGroundingFilterFilterSensitiveLog: () => LfQ,
    GuardrailContextualGroundingFilterType: () => oD8,
    GuardrailContextualGroundingPolicyConfigFilterSensitiveLog: () => nj1,
    GuardrailContextualGroundingPolicyFilterSensitiveLog: () => MfQ,
    GuardrailFilterStrength: () => nD8,
    GuardrailManagedWordsConfigFilterSensitiveLog: () => EfQ,
    GuardrailManagedWordsFilterSensitiveLog: () => PfQ,
    GuardrailManagedWordsType: () => ZH8,
    GuardrailModality: () => iD8,
    GuardrailPiiEntityType: () => eD8,
    GuardrailSensitiveInformationAction: () => tD8,
    GuardrailStatus: () => IH8,
    GuardrailSummaryFilterSensitiveLog: () => kfQ,
    GuardrailTopicAction: () => QH8,
    GuardrailTopicConfigFilterSensitiveLog: () => CfQ,
    GuardrailTopicFilterSensitiveLog: () => RfQ,
    GuardrailTopicPolicyConfigFilterSensitiveLog: () => aj1,
    GuardrailTopicPolicyFilterSensitiveLog: () => TfQ,
    GuardrailTopicType: () => BH8,
    GuardrailTopicsTierConfigFilterSensitiveLog: () => HfQ,
    GuardrailTopicsTierFilterSensitiveLog: () => OfQ,
    GuardrailTopicsTierName: () => AH8,
    GuardrailWordAction: () => GH8,
    GuardrailWordConfigFilterSensitiveLog: () => zfQ,
    GuardrailWordFilterSensitiveLog: () => jfQ,
    GuardrailWordPolicyConfigFilterSensitiveLog: () => sj1,
    GuardrailWordPolicyFilterSensitiveLog: () => SfQ,
    HumanEvaluationConfigFilterSensitiveLog: () => rbQ,
    HumanEvaluationCustomMetricFilterSensitiveLog: () => abQ,
    HumanWorkflowConfigFilterSensitiveLog: () => sbQ,
    ImplicitFilterConfigurationFilterSensitiveLog: () => ZfQ,
    InferenceProfileModelSource: () => hj1,
    InferenceProfileStatus: () => YH8,
    InferenceProfileSummaryFilterSensitiveLog: () => ffQ,
    InferenceProfileType: () => JH8,
    InferenceType: () => DH8,
    InternalServerException: () => jbQ,
    InvocationLogSource: () => _j1,
    InvocationLogsConfigFilterSensitiveLog: () => hbQ,
    JobStatusDetails: () => PH8,
    KnowledgeBaseConfig: () => ndA,
    KnowledgeBaseConfigFilterSensitiveLog: () => tfQ,
    KnowledgeBaseRetrievalConfigurationFilterSensitiveLog: () => rj1,
    KnowledgeBaseRetrieveAndGenerateConfigurationFilterSensitiveLog: () => sfQ,
    KnowledgeBaseVectorSearchConfigurationFilterSensitiveLog: () => afQ,
    ListCustomModelsCommand: () => AS1,
    ListEvaluationJobsCommand: () => QS1,
    ListFoundationModelAgreementOffersCommand: () => ehQ,
    ListFoundationModelsCommand: () => AgQ,
    ListGuardrailsCommand: () => BS1,
    ListGuardrailsResponseFilterSensitiveLog: () => yfQ,
    ListImportedModelsCommand: () => GS1,
    ListInferenceProfilesCommand: () => ZS1,
    ListInferenceProfilesResponseFilterSensitiveLog: () => hfQ,
    ListMarketplaceModelEndpointsCommand: () => IS1,
    ListModelCopyJobsCommand: () => YS1,
    ListModelCustomizationJobsCommand: () => JS1,
    ListModelImportJobsCommand: () => WS1,
    ListModelInvocationJobsCommand: () => XS1,
    ListModelInvocationJobsResponseFilterSensitiveLog: () => mfQ,
    ListPromptRoutersCommand: () => VS1,
    ListPromptRoutersResponseFilterSensitiveLog: () => lfQ,
    ListProvisionedModelThroughputsCommand: () => FS1,
    ListTagsForResourceCommand: () => QgQ,
    MetadataAttributeSchemaFilterSensitiveLog: () => LH8,
    MetadataConfigurationForRerankingFilterSensitiveLog: () => YfQ,
    ModelCopyJobStatus: () => WH8,
    ModelCustomization: () => KH8,
    ModelCustomizationJobStatus: () => TH8,
    ModelDataSource: () => jj1,
    ModelImportJobStatus: () => XH8,
    ModelInvocationJobInputDataConfig: () => gj1,
    ModelInvocationJobOutputDataConfig: () => uj1,
    ModelInvocationJobStatus: () => FH8,
    ModelInvocationJobSummaryFilterSensitiveLog: () => ufQ,
    ModelModality: () => HH8,
    ModelStatus: () => jD8,
    OfferType: () => RH8,
    PerformanceConfigLatency: () => vD8,
    PromptRouterStatus: () => EH8,
    PromptRouterSummaryFilterSensitiveLog: () => pfQ,
    PromptRouterType: () => zH8,
    PromptTemplateFilterSensitiveLog: () => lj1,
    ProvisionedModelStatus: () => $H8,
    PutModelInvocationLoggingConfigurationCommand: () => BgQ,
    PutUseCaseForModelAccessCommand: () => GgQ,
    QueryTransformationType: () => fD8,
    RAGConfig: () => adA,
    RAGConfigFilterSensitiveLog: () => efQ,
    RatingScaleItemValue: () => cdA,
    RegionAvailability: () => OH8,
    RegisterMarketplaceModelEndpointCommand: () => ZgQ,
    RequestMetadataBaseFiltersFilterSensitiveLog: () => mj1,
    RequestMetadataFilters: () => kj1,
    RequestMetadataFiltersFilterSensitiveLog: () => fbQ,
    RerankingMetadataSelectionMode: () => uD8,
    RerankingMetadataSelectiveModeConfiguration: () => bj1,
    RerankingMetadataSelectiveModeConfigurationFilterSensitiveLog: () => IfQ,
    ResourceNotFoundException: () => SbQ,
    RetrievalFilter: () => idA,
    RetrievalFilterFilterSensitiveLog: () => SH8,
    RetrieveAndGenerateConfigurationFilterSensitiveLog: () => ofQ,
    RetrieveAndGenerateType: () => dD8,
    RetrieveConfigFilterSensitiveLog: () => rfQ,
    S3InputFormat: () => VH8,
    SearchType: () => gD8,
    ServiceQuotaExceededException: () => xbQ,
    ServiceUnavailableException: () => vbQ,
    SortByProvisionedModels: () => wH8,
    SortJobsBy: () => pD8,
    SortModelsBy: () => SD8,
    SortOrder: () => _D8,
    Status: () => TD8,
    StopEvaluationJobCommand: () => IgQ,
    StopEvaluationJobRequestFilterSensitiveLog: () => VfQ,
    StopModelCustomizationJobCommand: () => YgQ,
    StopModelInvocationJobCommand: () => JgQ,
    TagResourceCommand: () => WgQ,
    ThrottlingException: () => _bQ,
    TooManyTagsException: () => bbQ,
    TrainingDataConfigFilterSensitiveLog: () => tdA,
    UntagResourceCommand: () => XgQ,
    UpdateGuardrailCommand: () => VgQ,
    UpdateGuardrailRequestFilterSensitiveLog: () => xfQ,
    UpdateMarketplaceModelEndpointCommand: () => FgQ,
    UpdateProvisionedModelThroughputCommand: () => KgQ,
    ValidationException: () => kbQ,
    VectorSearchBedrockRerankingConfigurationFilterSensitiveLog: () => JfQ,
    VectorSearchRerankingConfigurationFilterSensitiveLog: () => WfQ,
    VectorSearchRerankingConfigurationType: () => mD8,
    __Client: () => h.Client,
    paginateListCustomModels: () => Q$8,
    paginateListEvaluationJobs: () => B$8,
    paginateListGuardrails: () => G$8,
    paginateListImportedModels: () => Z$8,
    paginateListInferenceProfiles: () => I$8,
    paginateListMarketplaceModelEndpoints: () => Y$8,
    paginateListModelCopyJobs: () => J$8,
    paginateListModelCustomizationJobs: () => W$8,
    paginateListModelImportJobs: () => X$8,
    paginateListModelInvocationJobs: () => V$8,
    paginateListPromptRouters: () => F$8,
    paginateListProvisionedModelThroughputs: () => K$8
  });
  HgQ.exports = ED8(TbQ);
  var GbQ = CCA(),
    zD8 = ECA(),
    UD8 = zCA(),
    ZbQ = y6A(),
    $D8 = f8(),
    JB = iB(),
    wD8 = LX(),
    Y2 = q5(),
    IbQ = D6(),
    YbQ = GP1(),
    qD8 = QA((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "bedrock"
      })
    }, "resolveClientEndpointParameters"),
    D2 = {
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
    ND8 = BbQ(),
    JbQ = OCA(),
    WbQ = az(),
    h = o6(),
    LD8 = QA((A) => {
      let {
        httpAuthSchemes: Q,
        httpAuthSchemeProvider: B,
        credentials: G,
        token: Z
      } = A;
      return {
        setHttpAuthScheme(I) {
          let Y = Q.findIndex((J) => J.schemeId === I.schemeId);
          if (Y === -1) Q.push(I);
          else Q.splice(Y, 1, I)
        },
        httpAuthSchemes() {
          return Q
        },
        setHttpAuthSchemeProvider(I) {
          B = I
        },
        httpAuthSchemeProvider() {
          return B
        },
        setCredentials(I) {
          G = I
        },
        credentials() {
          return G
        },
        setToken(I) {
          Z = I
        },
        token() {
          return Z
        }
      }
    }, "getHttpAuthExtensionConfiguration"),
    MD8 = QA((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials(),
        token: A.token()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    OD8 = QA((A, Q) => {
      let B = Object.assign((0, JbQ.getAwsRegionExtensionConfiguration)(A), (0, h.getDefaultExtensionConfiguration)(A), (0, WbQ.getHttpHandlerExtensionConfiguration)(A), LD8(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, JbQ.resolveAwsRegionExtensionConfiguration)(B), (0, h.resolveDefaultRuntimeConfig)(B), (0, WbQ.resolveHttpHandlerRuntimeConfig)(B), MD8(B))
    }, "resolveRuntimeExtensions"),
    tz = class extends h.Client {
      static {
        QA(this, "BedrockClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, ND8.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = qD8(Q),
          G = (0, ZbQ.resolveUserAgentConfig)(B),
          Z = (0, IbQ.resolveRetryConfig)(G),
          I = (0, $D8.resolveRegionConfig)(Z),
          Y = (0, GbQ.resolveHostHeaderConfig)(I),
          J = (0, Y2.resolveEndpointConfig)(Y),
          W = (0, YbQ.resolveHttpAuthSchemeConfig)(J),
          X = OD8(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, ZbQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, IbQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, wD8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, GbQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, zD8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, UD8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, JB.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: YbQ.defaultBedrockHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: QA(async (V) => new JB.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials,
            "smithy.api#httpBearerAuth": V.token
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, JB.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    H2 = GZ(),
    tR = class A extends h.ServiceException {
      static {
        QA(this, "BedrockServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    PbQ = class A extends tR {
      static {
        QA(this, "AccessDeniedException")
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
    RD8 = {
      AVAILABLE: "AVAILABLE",
      ERROR: "ERROR",
      NOT_AVAILABLE: "NOT_AVAILABLE",
      PENDING: "PENDING"
    },
    jbQ = class A extends tR {
      static {
        QA(this, "InternalServerException")
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
    SbQ = class A extends tR {
      static {
        QA(this, "ResourceNotFoundException")
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
    _bQ = class A extends tR {
      static {
        QA(this, "ThrottlingException")
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
    kbQ = class A extends tR {
      static {
        QA(this, "ValidationException")
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
    ybQ = class A extends tR {
      static {
        QA(this, "ConflictException")
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
    Pj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.sageMaker !== void 0) return B.sageMaker(Q.sageMaker);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Pj1 || (Pj1 = {}));
  var TD8 = {
      INCOMPATIBLE_ENDPOINT: "INCOMPATIBLE_ENDPOINT",
      REGISTERED: "REGISTERED"
    },
    xbQ = class A extends tR {
      static {
        QA(this, "ServiceQuotaExceededException")
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
    vbQ = class A extends tR {
      static {
        QA(this, "ServiceUnavailableException")
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
    jj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.s3DataSource !== void 0) return B.s3DataSource(Q.s3DataSource);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(jj1 || (jj1 = {}));
  var bbQ = class A extends tR {
      static {
        QA(this, "TooManyTagsException")
      }
      name = "TooManyTagsException";
      $fault = "client";
      resourceName;
      constructor(Q) {
        super({
          name: "TooManyTagsException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.resourceName = Q.resourceName
      }
    },
    Sj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.distillationConfig !== void 0) return B.distillationConfig(Q.distillationConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(Sj1 || (Sj1 = {}));
  var PD8 = {
      CONTINUED_PRE_TRAINING: "CONTINUED_PRE_TRAINING",
      DISTILLATION: "DISTILLATION",
      FINE_TUNING: "FINE_TUNING",
      IMPORTED: "IMPORTED"
    },
    jD8 = {
      ACTIVE: "Active",
      CREATING: "Creating",
      FAILED: "Failed"
    },
    _j1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.s3Uri !== void 0) return B.s3Uri(Q.s3Uri);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(_j1 || (_j1 = {}));
  var kj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.equals !== void 0) return B.equals(Q.equals);
      if (Q.notEquals !== void 0) return B.notEquals(Q.notEquals);
      if (Q.andAll !== void 0) return B.andAll(Q.andAll);
      if (Q.orAll !== void 0) return B.orAll(Q.orAll);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(kj1 || (kj1 = {}));
  var SD8 = {
      CREATION_TIME: "CreationTime"
    },
    _D8 = {
      ASCENDING: "Ascending",
      DESCENDING: "Descending"
    },
    kD8 = {
      COMPLETED: "Completed",
      DELETING: "Deleting",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress",
      STOPPED: "Stopped",
      STOPPING: "Stopping"
    },
    yD8 = {
      MODEL_EVALUATION: "ModelEvaluation",
      RAG_EVALUATION: "RagEvaluation"
    },
    cdA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.stringValue !== void 0) return B.stringValue(Q.stringValue);
      if (Q.floatValue !== void 0) return B.floatValue(Q.floatValue);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(cdA || (cdA = {}));
  var pdA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.customMetricDefinition !== void 0) return B.customMetricDefinition(Q.customMetricDefinition);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(pdA || (pdA = {}));
  var yj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.s3Uri !== void 0) return B.s3Uri(Q.s3Uri);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(yj1 || (yj1 = {}));
  var xD8 = {
      CLASSIFICATION: "Classification",
      CUSTOM: "Custom",
      GENERATION: "Generation",
      QUESTION_AND_ANSWER: "QuestionAndAnswer",
      SUMMARIZATION: "Summarization"
    },
    xj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.bedrockEvaluatorModels !== void 0) return B.bedrockEvaluatorModels(Q.bedrockEvaluatorModels);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(xj1 || (xj1 = {}));
  var ldA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.automated !== void 0) return B.automated(Q.automated);
      if (Q.human !== void 0) return B.human(Q.human);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(ldA || (ldA = {}));
  var vD8 = {
      OPTIMIZED: "optimized",
      STANDARD: "standard"
    },
    vj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.bedrockModel !== void 0) return B.bedrockModel(Q.bedrockModel);
      if (Q.precomputedInferenceSource !== void 0) return B.precomputedInferenceSource(Q.precomputedInferenceSource);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(vj1 || (vj1 = {}));
  var bD8 = {
      BYTE_CONTENT: "BYTE_CONTENT",
      S3: "S3"
    },
    fD8 = {
      QUERY_DECOMPOSITION: "QUERY_DECOMPOSITION"
    },
    hD8 = {
      BOOLEAN: "BOOLEAN",
      NUMBER: "NUMBER",
      STRING: "STRING",
      STRING_LIST: "STRING_LIST"
    },
    gD8 = {
      HYBRID: "HYBRID",
      SEMANTIC: "SEMANTIC"
    },
    uD8 = {
      ALL: "ALL",
      SELECTIVE: "SELECTIVE"
    },
    bj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.fieldsToInclude !== void 0) return B.fieldsToInclude(Q.fieldsToInclude);
      if (Q.fieldsToExclude !== void 0) return B.fieldsToExclude(Q.fieldsToExclude);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(bj1 || (bj1 = {}));
  var mD8 = {
      BEDROCK_RERANKING_MODEL: "BEDROCK_RERANKING_MODEL"
    },
    dD8 = {
      EXTERNAL_SOURCES: "EXTERNAL_SOURCES",
      KNOWLEDGE_BASE: "KNOWLEDGE_BASE"
    },
    fj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.retrieveSourceConfig !== void 0) return B.retrieveSourceConfig(Q.retrieveSourceConfig);
      if (Q.retrieveAndGenerateSourceConfig !== void 0) return B.retrieveAndGenerateSourceConfig(Q.retrieveAndGenerateSourceConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(fj1 || (fj1 = {}));
  var cD8 = {
      AUTOMATED: "Automated",
      HUMAN: "Human"
    },
    pD8 = {
      CREATION_TIME: "CreationTime"
    },
    lD8 = {
      BLOCK: "BLOCK",
      NONE: "NONE"
    },
    iD8 = {
      IMAGE: "IMAGE",
      TEXT: "TEXT"
    },
    nD8 = {
      HIGH: "HIGH",
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      NONE: "NONE"
    },
    aD8 = {
      HATE: "HATE",
      INSULTS: "INSULTS",
      MISCONDUCT: "MISCONDUCT",
      PROMPT_ATTACK: "PROMPT_ATTACK",
      SEXUAL: "SEXUAL",
      VIOLENCE: "VIOLENCE"
    },
    sD8 = {
      CLASSIC: "CLASSIC",
      STANDARD: "STANDARD"
    },
    rD8 = {
      BLOCK: "BLOCK",
      NONE: "NONE"
    },
    oD8 = {
      GROUNDING: "GROUNDING",
      RELEVANCE: "RELEVANCE"
    },
    tD8 = {
      ANONYMIZE: "ANONYMIZE",
      BLOCK: "BLOCK",
      NONE: "NONE"
    },
    eD8 = {
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
    AH8 = {
      CLASSIC: "CLASSIC",
      STANDARD: "STANDARD"
    },
    QH8 = {
      BLOCK: "BLOCK",
      NONE: "NONE"
    },
    BH8 = {
      DENY: "DENY"
    },
    GH8 = {
      BLOCK: "BLOCK",
      NONE: "NONE"
    },
    ZH8 = {
      PROFANITY: "PROFANITY"
    },
    IH8 = {
      CREATING: "CREATING",
      DELETING: "DELETING",
      FAILED: "FAILED",
      READY: "READY",
      UPDATING: "UPDATING",
      VERSIONING: "VERSIONING"
    },
    hj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.copyFrom !== void 0) return B.copyFrom(Q.copyFrom);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(hj1 || (hj1 = {}));
  var YH8 = {
      ACTIVE: "ACTIVE"
    },
    JH8 = {
      APPLICATION: "APPLICATION",
      SYSTEM_DEFINED: "SYSTEM_DEFINED"
    },
    WH8 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress"
    },
    XH8 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress"
    },
    VH8 = {
      JSONL: "JSONL"
    },
    gj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.s3InputDataConfig !== void 0) return B.s3InputDataConfig(Q.s3InputDataConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(gj1 || (gj1 = {}));
  var uj1;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.s3OutputDataConfig !== void 0) return B.s3OutputDataConfig(Q.s3OutputDataConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(uj1 || (uj1 = {}));
  var FH8 = {
      COMPLETED: "Completed",
      EXPIRED: "Expired",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress",
      PARTIALLY_COMPLETED: "PartiallyCompleted",
      SCHEDULED: "Scheduled",
      STOPPED: "Stopped",
      STOPPING: "Stopping",
      SUBMITTED: "Submitted",
      VALIDATING: "Validating"
    },
    KH8 = {
      CONTINUED_PRE_TRAINING: "CONTINUED_PRE_TRAINING",
      DISTILLATION: "DISTILLATION",
      FINE_TUNING: "FINE_TUNING"
    },
    DH8 = {
      ON_DEMAND: "ON_DEMAND",
      PROVISIONED: "PROVISIONED"
    },
    HH8 = {
      EMBEDDING: "EMBEDDING",
      IMAGE: "IMAGE",
      TEXT: "TEXT"
    },
    CH8 = {
      ACTIVE: "ACTIVE",
      LEGACY: "LEGACY"
    },
    EH8 = {
      AVAILABLE: "AVAILABLE"
    },
    zH8 = {
      CUSTOM: "custom",
      DEFAULT: "default"
    },
    UH8 = {
      ONE_MONTH: "OneMonth",
      SIX_MONTHS: "SixMonths"
    },
    $H8 = {
      CREATING: "Creating",
      FAILED: "Failed",
      IN_SERVICE: "InService",
      UPDATING: "Updating"
    },
    wH8 = {
      CREATION_TIME: "CreationTime"
    },
    qH8 = {
      AUTHORIZED: "AUTHORIZED",
      NOT_AUTHORIZED: "NOT_AUTHORIZED"
    },
    mj1 = QA((A) => ({
      ...A,
      ...A.equals && {
        equals: h.SENSITIVE_STRING
      },
      ...A.notEquals && {
        notEquals: h.SENSITIVE_STRING
      }
    }), "RequestMetadataBaseFiltersFilterSensitiveLog"),
    fbQ = QA((A) => {
      if (A.equals !== void 0) return {
        equals: h.SENSITIVE_STRING
      };
      if (A.notEquals !== void 0) return {
        notEquals: h.SENSITIVE_STRING
      };
      if (A.andAll !== void 0) return {
        andAll: A.andAll.map((Q) => mj1(Q))
      };
      if (A.orAll !== void 0) return {
        orAll: A.orAll.map((Q) => mj1(Q))
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "RequestMetadataFiltersFilterSensitiveLog"),
    hbQ = QA((A) => ({
      ...A,
      ...A.invocationLogSource && {
        invocationLogSource: A.invocationLogSource
      },
      ...A.requestMetadataFilters && {
        requestMetadataFilters: fbQ(A.requestMetadataFilters)
      }
    }), "InvocationLogsConfigFilterSensitiveLog"),
    tdA = QA((A) => ({
      ...A,
      ...A.invocationLogsConfig && {
        invocationLogsConfig: hbQ(A.invocationLogsConfig)
      }
    }), "TrainingDataConfigFilterSensitiveLog"),
    gbQ = QA((A) => ({
      ...A,
      ...A.trainingDataConfig && {
        trainingDataConfig: tdA(A.trainingDataConfig)
      },
      ...A.customizationConfig && {
        customizationConfig: A.customizationConfig
      }
    }), "GetCustomModelResponseFilterSensitiveLog"),
    ubQ = QA((A) => ({
      ...A,
      ...A.jobIdentifiers && {
        jobIdentifiers: h.SENSITIVE_STRING
      }
    }), "BatchDeleteEvaluationJobRequestFilterSensitiveLog"),
    mbQ = QA((A) => ({
      ...A,
      ...A.jobIdentifier && {
        jobIdentifier: h.SENSITIVE_STRING
      }
    }), "BatchDeleteEvaluationJobErrorFilterSensitiveLog"),
    dbQ = QA((A) => ({
      ...A,
      ...A.jobIdentifier && {
        jobIdentifier: h.SENSITIVE_STRING
      }
    }), "BatchDeleteEvaluationJobItemFilterSensitiveLog"),
    cbQ = QA((A) => ({
      ...A,
      ...A.errors && {
        errors: A.errors.map((Q) => mbQ(Q))
      },
      ...A.evaluationJobs && {
        evaluationJobs: A.evaluationJobs.map((Q) => dbQ(Q))
      }
    }), "BatchDeleteEvaluationJobResponseFilterSensitiveLog"),
    NH8 = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.ratingScale && {
        ratingScale: A.ratingScale.map((Q) => Q)
      }
    }), "CustomMetricDefinitionFilterSensitiveLog"),
    pbQ = QA((A) => {
      if (A.customMetricDefinition !== void 0) return {
        customMetricDefinition: h.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "AutomatedEvaluationCustomMetricSourceFilterSensitiveLog"),
    lbQ = QA((A) => ({
      ...A,
      ...A.customMetrics && {
        customMetrics: A.customMetrics.map((Q) => pbQ(Q))
      }
    }), "AutomatedEvaluationCustomMetricConfigFilterSensitiveLog"),
    ibQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.datasetLocation && {
        datasetLocation: A.datasetLocation
      }
    }), "EvaluationDatasetFilterSensitiveLog"),
    cj1 = QA((A) => ({
      ...A,
      ...A.dataset && {
        dataset: ibQ(A.dataset)
      },
      ...A.metricNames && {
        metricNames: h.SENSITIVE_STRING
      }
    }), "EvaluationDatasetMetricConfigFilterSensitiveLog"),
    nbQ = QA((A) => ({
      ...A,
      ...A.datasetMetricConfigs && {
        datasetMetricConfigs: A.datasetMetricConfigs.map((Q) => cj1(Q))
      },
      ...A.evaluatorModelConfig && {
        evaluatorModelConfig: A.evaluatorModelConfig
      },
      ...A.customMetricConfig && {
        customMetricConfig: lbQ(A.customMetricConfig)
      }
    }), "AutomatedEvaluationConfigFilterSensitiveLog"),
    abQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "HumanEvaluationCustomMetricFilterSensitiveLog"),
    sbQ = QA((A) => ({
      ...A,
      ...A.instructions && {
        instructions: h.SENSITIVE_STRING
      }
    }), "HumanWorkflowConfigFilterSensitiveLog"),
    rbQ = QA((A) => ({
      ...A,
      ...A.humanWorkflowConfig && {
        humanWorkflowConfig: sbQ(A.humanWorkflowConfig)
      },
      ...A.customMetrics && {
        customMetrics: A.customMetrics.map((Q) => abQ(Q))
      },
      ...A.datasetMetricConfigs && {
        datasetMetricConfigs: A.datasetMetricConfigs.map((Q) => cj1(Q))
      }
    }), "HumanEvaluationConfigFilterSensitiveLog"),
    pj1 = QA((A) => {
      if (A.automated !== void 0) return {
        automated: nbQ(A.automated)
      };
      if (A.human !== void 0) return {
        human: rbQ(A.human)
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "EvaluationConfigFilterSensitiveLog"),
    obQ = QA((A) => ({
      ...A,
      ...A.inferenceParams && {
        inferenceParams: h.SENSITIVE_STRING
      }
    }), "EvaluationBedrockModelFilterSensitiveLog"),
    tbQ = QA((A) => {
      if (A.bedrockModel !== void 0) return {
        bedrockModel: obQ(A.bedrockModel)
      };
      if (A.precomputedInferenceSource !== void 0) return {
        precomputedInferenceSource: A.precomputedInferenceSource
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "EvaluationModelConfigFilterSensitiveLog"),
    lj1 = QA((A) => ({
      ...A,
      ...A.textPromptTemplate && {
        textPromptTemplate: h.SENSITIVE_STRING
      }
    }), "PromptTemplateFilterSensitiveLog"),
    ebQ = QA((A) => ({
      ...A,
      ...A.promptTemplate && {
        promptTemplate: lj1(A.promptTemplate)
      }
    }), "ExternalSourcesGenerationConfigurationFilterSensitiveLog"),
    AfQ = QA((A) => ({
      ...A,
      ...A.identifier && {
        identifier: h.SENSITIVE_STRING
      },
      ...A.data && {
        data: h.SENSITIVE_STRING
      }
    }), "ByteContentDocFilterSensitiveLog"),
    QfQ = QA((A) => ({
      ...A,
      ...A.byteContent && {
        byteContent: AfQ(A.byteContent)
      }
    }), "ExternalSourceFilterSensitiveLog"),
    BfQ = QA((A) => ({
      ...A,
      ...A.sources && {
        sources: A.sources.map((Q) => QfQ(Q))
      },
      ...A.generationConfiguration && {
        generationConfiguration: ebQ(A.generationConfiguration)
      }
    }), "ExternalSourcesRetrieveAndGenerateConfigurationFilterSensitiveLog"),
    GfQ = QA((A) => ({
      ...A,
      ...A.promptTemplate && {
        promptTemplate: lj1(A.promptTemplate)
      }
    }), "GenerationConfigurationFilterSensitiveLog"),
    LH8 = QA((A) => ({
      ...A
    }), "MetadataAttributeSchemaFilterSensitiveLog"),
    ZfQ = QA((A) => ({
      ...A,
      ...A.metadataAttributes && {
        metadataAttributes: h.SENSITIVE_STRING
      }
    }), "ImplicitFilterConfigurationFilterSensitiveLog"),
    IfQ = QA((A) => {
      if (A.fieldsToInclude !== void 0) return {
        fieldsToInclude: h.SENSITIVE_STRING
      };
      if (A.fieldsToExclude !== void 0) return {
        fieldsToExclude: h.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "RerankingMetadataSelectiveModeConfigurationFilterSensitiveLog"),
    YfQ = QA((A) => ({
      ...A,
      ...A.selectiveModeConfiguration && {
        selectiveModeConfiguration: IfQ(A.selectiveModeConfiguration)
      }
    }), "MetadataConfigurationForRerankingFilterSensitiveLog"),
    JfQ = QA((A) => ({
      ...A,
      ...A.metadataConfiguration && {
        metadataConfiguration: YfQ(A.metadataConfiguration)
      }
    }), "VectorSearchBedrockRerankingConfigurationFilterSensitiveLog"),
    WfQ = QA((A) => ({
      ...A,
      ...A.bedrockRerankingConfiguration && {
        bedrockRerankingConfiguration: JfQ(A.bedrockRerankingConfiguration)
      }
    }), "VectorSearchRerankingConfigurationFilterSensitiveLog"),
    XfQ = QA((A) => ({
      ...A,
      ...A.jobIdentifier && {
        jobIdentifier: h.SENSITIVE_STRING
      }
    }), "GetEvaluationJobRequestFilterSensitiveLog"),
    VfQ = QA((A) => ({
      ...A,
      ...A.jobIdentifier && {
        jobIdentifier: h.SENSITIVE_STRING
      }
    }), "StopEvaluationJobRequestFilterSensitiveLog"),
    FfQ = QA((A) => ({
      ...A,
      ...A.inputModalities && {
        inputModalities: h.SENSITIVE_STRING
      },
      ...A.outputModalities && {
        outputModalities: h.SENSITIVE_STRING
      },
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailContentFilterConfigFilterSensitiveLog"),
    KfQ = QA((A) => ({
      ...A,
      ...A.tierName && {
        tierName: h.SENSITIVE_STRING
      }
    }), "GuardrailContentFiltersTierConfigFilterSensitiveLog"),
    ij1 = QA((A) => ({
      ...A,
      ...A.filtersConfig && {
        filtersConfig: A.filtersConfig.map((Q) => FfQ(Q))
      },
      ...A.tierConfig && {
        tierConfig: KfQ(A.tierConfig)
      }
    }), "GuardrailContentPolicyConfigFilterSensitiveLog"),
    DfQ = QA((A) => ({
      ...A,
      ...A.action && {
        action: h.SENSITIVE_STRING
      }
    }), "GuardrailContextualGroundingFilterConfigFilterSensitiveLog"),
    nj1 = QA((A) => ({
      ...A,
      ...A.filtersConfig && {
        filtersConfig: A.filtersConfig.map((Q) => DfQ(Q))
      }
    }), "GuardrailContextualGroundingPolicyConfigFilterSensitiveLog"),
    HfQ = QA((A) => ({
      ...A,
      ...A.tierName && {
        tierName: h.SENSITIVE_STRING
      }
    }), "GuardrailTopicsTierConfigFilterSensitiveLog"),
    CfQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.definition && {
        definition: h.SENSITIVE_STRING
      },
      ...A.examples && {
        examples: h.SENSITIVE_STRING
      },
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailTopicConfigFilterSensitiveLog"),
    aj1 = QA((A) => ({
      ...A,
      ...A.topicsConfig && {
        topicsConfig: A.topicsConfig.map((Q) => CfQ(Q))
      },
      ...A.tierConfig && {
        tierConfig: HfQ(A.tierConfig)
      }
    }), "GuardrailTopicPolicyConfigFilterSensitiveLog"),
    EfQ = QA((A) => ({
      ...A,
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailManagedWordsConfigFilterSensitiveLog"),
    zfQ = QA((A) => ({
      ...A,
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailWordConfigFilterSensitiveLog"),
    sj1 = QA((A) => ({
      ...A,
      ...A.wordsConfig && {
        wordsConfig: A.wordsConfig.map((Q) => zfQ(Q))
      },
      ...A.managedWordListsConfig && {
        managedWordListsConfig: A.managedWordListsConfig.map((Q) => EfQ(Q))
      }
    }), "GuardrailWordPolicyConfigFilterSensitiveLog"),
    UfQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.description && {
        description: h.SENSITIVE_STRING
      },
      ...A.topicPolicyConfig && {
        topicPolicyConfig: aj1(A.topicPolicyConfig)
      },
      ...A.contentPolicyConfig && {
        contentPolicyConfig: ij1(A.contentPolicyConfig)
      },
      ...A.wordPolicyConfig && {
        wordPolicyConfig: sj1(A.wordPolicyConfig)
      },
      ...A.contextualGroundingPolicyConfig && {
        contextualGroundingPolicyConfig: nj1(A.contextualGroundingPolicyConfig)
      },
      ...A.blockedInputMessaging && {
        blockedInputMessaging: h.SENSITIVE_STRING
      },
      ...A.blockedOutputsMessaging && {
        blockedOutputsMessaging: h.SENSITIVE_STRING
      }
    }), "CreateGuardrailRequestFilterSensitiveLog"),
    $fQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "CreateGuardrailVersionRequestFilterSensitiveLog"),
    wfQ = QA((A) => ({
      ...A,
      ...A.inputModalities && {
        inputModalities: h.SENSITIVE_STRING
      },
      ...A.outputModalities && {
        outputModalities: h.SENSITIVE_STRING
      },
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailContentFilterFilterSensitiveLog"),
    qfQ = QA((A) => ({
      ...A,
      ...A.tierName && {
        tierName: h.SENSITIVE_STRING
      }
    }), "GuardrailContentFiltersTierFilterSensitiveLog"),
    NfQ = QA((A) => ({
      ...A,
      ...A.filters && {
        filters: A.filters.map((Q) => wfQ(Q))
      },
      ...A.tier && {
        tier: qfQ(A.tier)
      }
    }), "GuardrailContentPolicyFilterSensitiveLog"),
    LfQ = QA((A) => ({
      ...A,
      ...A.action && {
        action: h.SENSITIVE_STRING
      }
    }), "GuardrailContextualGroundingFilterFilterSensitiveLog"),
    MfQ = QA((A) => ({
      ...A,
      ...A.filters && {
        filters: A.filters.map((Q) => LfQ(Q))
      }
    }), "GuardrailContextualGroundingPolicyFilterSensitiveLog"),
    OfQ = QA((A) => ({
      ...A,
      ...A.tierName && {
        tierName: h.SENSITIVE_STRING
      }
    }), "GuardrailTopicsTierFilterSensitiveLog"),
    RfQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.definition && {
        definition: h.SENSITIVE_STRING
      },
      ...A.examples && {
        examples: h.SENSITIVE_STRING
      },
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailTopicFilterSensitiveLog"),
    TfQ = QA((A) => ({
      ...A,
      ...A.topics && {
        topics: A.topics.map((Q) => RfQ(Q))
      },
      ...A.tier && {
        tier: OfQ(A.tier)
      }
    }), "GuardrailTopicPolicyFilterSensitiveLog"),
    PfQ = QA((A) => ({
      ...A,
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailManagedWordsFilterSensitiveLog"),
    jfQ = QA((A) => ({
      ...A,
      ...A.inputAction && {
        inputAction: h.SENSITIVE_STRING
      },
      ...A.outputAction && {
        outputAction: h.SENSITIVE_STRING
      }
    }), "GuardrailWordFilterSensitiveLog"),
    SfQ = QA((A) => ({
      ...A,
      ...A.words && {
        words: A.words.map((Q) => jfQ(Q))
      },
      ...A.managedWordLists && {
        managedWordLists: A.managedWordLists.map((Q) => PfQ(Q))
      }
    }), "GuardrailWordPolicyFilterSensitiveLog"),
    _fQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.description && {
        description: h.SENSITIVE_STRING
      },
      ...A.topicPolicy && {
        topicPolicy: TfQ(A.topicPolicy)
      },
      ...A.contentPolicy && {
        contentPolicy: NfQ(A.contentPolicy)
      },
      ...A.wordPolicy && {
        wordPolicy: SfQ(A.wordPolicy)
      },
      ...A.contextualGroundingPolicy && {
        contextualGroundingPolicy: MfQ(A.contextualGroundingPolicy)
      },
      ...A.statusReasons && {
        statusReasons: h.SENSITIVE_STRING
      },
      ...A.failureRecommendations && {
        failureRecommendations: h.SENSITIVE_STRING
      },
      ...A.blockedInputMessaging && {
        blockedInputMessaging: h.SENSITIVE_STRING
      },
      ...A.blockedOutputsMessaging && {
        blockedOutputsMessaging: h.SENSITIVE_STRING
      }
    }), "GetGuardrailResponseFilterSensitiveLog"),
    kfQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "GuardrailSummaryFilterSensitiveLog"),
    yfQ = QA((A) => ({
      ...A,
      ...A.guardrails && {
        guardrails: A.guardrails.map((Q) => kfQ(Q))
      }
    }), "ListGuardrailsResponseFilterSensitiveLog"),
    xfQ = QA((A) => ({
      ...A,
      ...A.name && {
        name: h.SENSITIVE_STRING
      },
      ...A.description && {
        description: h.SENSITIVE_STRING
      },
      ...A.topicPolicyConfig && {
        topicPolicyConfig: aj1(A.topicPolicyConfig)
      },
      ...A.contentPolicyConfig && {
        contentPolicyConfig: ij1(A.contentPolicyConfig)
      },
      ...A.wordPolicyConfig && {
        wordPolicyConfig: sj1(A.wordPolicyConfig)
      },
      ...A.contextualGroundingPolicyConfig && {
        contextualGroundingPolicyConfig: nj1(A.contextualGroundingPolicyConfig)
      },
      ...A.blockedInputMessaging && {
        blockedInputMessaging: h.SENSITIVE_STRING
      },
      ...A.blockedOutputsMessaging && {
        blockedOutputsMessaging: h.SENSITIVE_STRING
      }
    }), "UpdateGuardrailRequestFilterSensitiveLog"),
    vfQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      },
      ...A.modelSource && {
        modelSource: A.modelSource
      }
    }), "CreateInferenceProfileRequestFilterSensitiveLog"),
    bfQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "GetInferenceProfileResponseFilterSensitiveLog"),
    ffQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "InferenceProfileSummaryFilterSensitiveLog"),
    hfQ = QA((A) => ({
      ...A,
      ...A.inferenceProfileSummaries && {
        inferenceProfileSummaries: A.inferenceProfileSummaries.map((Q) => ffQ(Q))
      }
    }), "ListInferenceProfilesResponseFilterSensitiveLog"),
    gfQ = QA((A) => ({
      ...A,
      ...A.message && {
        message: h.SENSITIVE_STRING
      },
      ...A.inputDataConfig && {
        inputDataConfig: A.inputDataConfig
      },
      ...A.outputDataConfig && {
        outputDataConfig: A.outputDataConfig
      }
    }), "GetModelInvocationJobResponseFilterSensitiveLog"),
    ufQ = QA((A) => ({
      ...A,
      ...A.message && {
        message: h.SENSITIVE_STRING
      },
      ...A.inputDataConfig && {
        inputDataConfig: A.inputDataConfig
      },
      ...A.outputDataConfig && {
        outputDataConfig: A.outputDataConfig
      }
    }), "ModelInvocationJobSummaryFilterSensitiveLog"),
    mfQ = QA((A) => ({
      ...A,
      ...A.invocationJobSummaries && {
        invocationJobSummaries: A.invocationJobSummaries.map((Q) => ufQ(Q))
      }
    }), "ListModelInvocationJobsResponseFilterSensitiveLog"),
    dfQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "CreatePromptRouterRequestFilterSensitiveLog"),
    cfQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "GetPromptRouterResponseFilterSensitiveLog"),
    pfQ = QA((A) => ({
      ...A,
      ...A.description && {
        description: h.SENSITIVE_STRING
      }
    }), "PromptRouterSummaryFilterSensitiveLog"),
    lfQ = QA((A) => ({
      ...A,
      ...A.promptRouterSummaries && {
        promptRouterSummaries: A.promptRouterSummaries.map((Q) => pfQ(Q))
      }
    }), "ListPromptRoutersResponseFilterSensitiveLog"),
    pB = PF(),
    gL = YHA(),
    MH8 = {
      AVAILABLE: "AVAILABLE",
      NOT_AVAILABLE: "NOT_AVAILABLE"
    },
    OH8 = {
      AVAILABLE: "AVAILABLE",
      NOT_AVAILABLE: "NOT_AVAILABLE"
    },
    RH8 = {
      ALL: "ALL",
      PUBLIC: "PUBLIC"
    },
    TH8 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress",
      STOPPED: "Stopped",
      STOPPING: "Stopping"
    },
    PH8 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress",
      NOT_STARTED: "NotStarted",
      STOPPED: "Stopped",
      STOPPING: "Stopping"
    },
    jH8 = {
      COMPLETED: "Completed",
      FAILED: "Failed",
      IN_PROGRESS: "InProgress",
      STOPPED: "Stopped",
      STOPPING: "Stopping"
    },
    idA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.equals !== void 0) return B.equals(Q.equals);
      if (Q.notEquals !== void 0) return B.notEquals(Q.notEquals);
      if (Q.greaterThan !== void 0) return B.greaterThan(Q.greaterThan);
      if (Q.greaterThanOrEquals !== void 0) return B.greaterThanOrEquals(Q.greaterThanOrEquals);
      if (Q.lessThan !== void 0) return B.lessThan(Q.lessThan);
      if (Q.lessThanOrEquals !== void 0) return B.lessThanOrEquals(Q.lessThanOrEquals);
      if (Q.in !== void 0) return B.in(Q.in);
      if (Q.notIn !== void 0) return B.notIn(Q.notIn);
      if (Q.startsWith !== void 0) return B.startsWith(Q.startsWith);
      if (Q.listContains !== void 0) return B.listContains(Q.listContains);
      if (Q.stringContains !== void 0) return B.stringContains(Q.stringContains);
      if (Q.andAll !== void 0) return B.andAll(Q.andAll);
      if (Q.orAll !== void 0) return B.orAll(Q.orAll);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(idA || (idA = {}));
  var ndA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.retrieveConfig !== void 0) return B.retrieveConfig(Q.retrieveConfig);
      if (Q.retrieveAndGenerateConfig !== void 0) return B.retrieveAndGenerateConfig(Q.retrieveAndGenerateConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(ndA || (ndA = {}));
  var adA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.knowledgeBaseConfig !== void 0) return B.knowledgeBaseConfig(Q.knowledgeBaseConfig);
      if (Q.precomputedRagSourceConfig !== void 0) return B.precomputedRagSourceConfig(Q.precomputedRagSourceConfig);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(adA || (adA = {}));
  var sdA;
  ((A) => {
    A.visit = QA((Q, B) => {
      if (Q.models !== void 0) return B.models(Q.models);
      if (Q.ragConfigs !== void 0) return B.ragConfigs(Q.ragConfigs);
      return B._(Q.$unknown[0], Q.$unknown[1])
    }, "visit")
  })(sdA || (sdA = {}));
  var ifQ = QA((A) => ({
      ...A,
      ...A.trainingDataConfig && {
        trainingDataConfig: tdA(A.trainingDataConfig)
      },
      ...A.customizationConfig && {
        customizationConfig: A.customizationConfig
      }
    }), "CreateModelCustomizationJobRequestFilterSensitiveLog"),
    nfQ = QA((A) => ({
      ...A,
      ...A.trainingDataConfig && {
        trainingDataConfig: tdA(A.trainingDataConfig)
      },
      ...A.customizationConfig && {
        customizationConfig: A.customizationConfig
      }
    }), "GetModelCustomizationJobResponseFilterSensitiveLog"),
    SH8 = QA((A) => {
      if (A.equals !== void 0) return {
        equals: A.equals
      };
      if (A.notEquals !== void 0) return {
        notEquals: A.notEquals
      };
      if (A.greaterThan !== void 0) return {
        greaterThan: A.greaterThan
      };
      if (A.greaterThanOrEquals !== void 0) return {
        greaterThanOrEquals: A.greaterThanOrEquals
      };
      if (A.lessThan !== void 0) return {
        lessThan: A.lessThan
      };
      if (A.lessThanOrEquals !== void 0) return {
        lessThanOrEquals: A.lessThanOrEquals
      };
      if (A.in !== void 0) return {
        in: A.in
      };
      if (A.notIn !== void 0) return {
        notIn: A.notIn
      };
      if (A.startsWith !== void 0) return {
        startsWith: A.startsWith
      };
      if (A.listContains !== void 0) return {
        listContains: A.listContains
      };
      if (A.stringContains !== void 0) return {
        stringContains: A.stringContains
      };
      if (A.andAll !== void 0) return {
        andAll: h.SENSITIVE_STRING
      };
      if (A.orAll !== void 0) return {
        orAll: h.SENSITIVE_STRING
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "RetrievalFilterFilterSensitiveLog"),
    afQ = QA((A) => ({
      ...A,
      ...A.filter && {
        filter: h.SENSITIVE_STRING
      },
      ...A.implicitFilterConfiguration && {
        implicitFilterConfiguration: ZfQ(A.implicitFilterConfiguration)
      },
      ...A.rerankingConfiguration && {
        rerankingConfiguration: WfQ(A.rerankingConfiguration)
      }
    }), "KnowledgeBaseVectorSearchConfigurationFilterSensitiveLog"),
    rj1 = QA((A) => ({
      ...A,
      ...A.vectorSearchConfiguration && {
        vectorSearchConfiguration: afQ(A.vectorSearchConfiguration)
      }
    }), "KnowledgeBaseRetrievalConfigurationFilterSensitiveLog"),
    sfQ = QA((A) => ({
      ...A,
      ...A.retrievalConfiguration && {
        retrievalConfiguration: rj1(A.retrievalConfiguration)
      },
      ...A.generationConfiguration && {
        generationConfiguration: GfQ(A.generationConfiguration)
      }
    }), "KnowledgeBaseRetrieveAndGenerateConfigurationFilterSensitiveLog"),
    rfQ = QA((A) => ({
      ...A,
      ...A.knowledgeBaseRetrievalConfiguration && {
        knowledgeBaseRetrievalConfiguration: rj1(A.knowledgeBaseRetrievalConfiguration)
      }
    }), "RetrieveConfigFilterSensitiveLog"),
    ofQ = QA((A) => ({
      ...A,
      ...A.knowledgeBaseConfiguration && {
        knowledgeBaseConfiguration: sfQ(A.knowledgeBaseConfiguration)
      },
      ...A.externalSourcesConfiguration && {
        externalSourcesConfiguration: BfQ(A.externalSourcesConfiguration)
      }
    }), "RetrieveAndGenerateConfigurationFilterSensitiveLog"),
    tfQ = QA((A) => {
      if (A.retrieveConfig !== void 0) return {
        retrieveConfig: rfQ(A.retrieveConfig)
      };
      if (A.retrieveAndGenerateConfig !== void 0) return {
        retrieveAndGenerateConfig: ofQ(A.retrieveAndGenerateConfig)
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "KnowledgeBaseConfigFilterSensitiveLog"),
    efQ = QA((A) => {
      if (A.knowledgeBaseConfig !== void 0) return {
        knowledgeBaseConfig: tfQ(A.knowledgeBaseConfig)
      };
      if (A.precomputedRagSourceConfig !== void 0) return {
        precomputedRagSourceConfig: A.precomputedRagSourceConfig
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "RAGConfigFilterSensitiveLog"),
    oj1 = QA((A) => {
      if (A.models !== void 0) return {
        models: A.models.map((Q) => tbQ(Q))
      };
      if (A.ragConfigs !== void 0) return {
        ragConfigs: A.ragConfigs.map((Q) => efQ(Q))
      };
      if (A.$unknown !== void 0) return {
        [A.$unknown[0]]: "UNKNOWN"
      }
    }, "EvaluationInferenceConfigFilterSensitiveLog"),
    AhQ = QA((A) => ({
      ...A,
      ...A.jobDescription && {
        jobDescription: h.SENSITIVE_STRING
      },
      ...A.evaluationConfig && {
        evaluationConfig: pj1(A.evaluationConfig)
      },
      ...A.inferenceConfig && {
        inferenceConfig: oj1(A.inferenceConfig)
      }
    }), "CreateEvaluationJobRequestFilterSensitiveLog"),
    QhQ = QA((A) => ({
      ...A,
      ...A.jobDescription && {
        jobDescription: h.SENSITIVE_STRING
      },
      ...A.evaluationConfig && {
        evaluationConfig: pj1(A.evaluationConfig)
      },
      ...A.inferenceConfig && {
        inferenceConfig: oj1(A.inferenceConfig)
      }
    }), "GetEvaluationJobResponseFilterSensitiveLog"),
    _H8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/evaluation-jobs/batch-delete");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        jobIdentifiers: QA((I) => (0, h._json)(I), "jobIdentifiers")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_BatchDeleteEvaluationJobCommand"),
    kH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/custom-models/create-custom-model");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        modelKmsKeyArn: [],
        modelName: [],
        modelSourceConfig: QA((I) => (0, h._json)(I), "modelSourceConfig"),
        modelTags: QA((I) => (0, h._json)(I), "modelTags"),
        roleArn: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateCustomModelCommand"),
    yH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/evaluation-jobs");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        applicationType: [],
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        customerEncryptionKeyId: [],
        evaluationConfig: QA((I) => Uz8(I, Q), "evaluationConfig"),
        inferenceConfig: QA((I) => $z8(I, Q), "inferenceConfig"),
        jobDescription: [],
        jobName: [],
        jobTags: QA((I) => (0, h._json)(I), "jobTags"),
        outputDataConfig: QA((I) => (0, h._json)(I), "outputDataConfig"),
        roleArn: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateEvaluationJobCommand"),
    xH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/create-foundation-model-agreement");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        modelId: [],
        offerToken: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateFoundationModelAgreementCommand"),
    vH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/guardrails");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        blockedInputMessaging: [],
        blockedOutputsMessaging: [],
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        contentPolicyConfig: QA((I) => (0, h._json)(I), "contentPolicyConfig"),
        contextualGroundingPolicyConfig: QA((I) => BhQ(I, Q), "contextualGroundingPolicyConfig"),
        crossRegionConfig: QA((I) => (0, h._json)(I), "crossRegionConfig"),
        description: [],
        kmsKeyId: [],
        name: [],
        sensitiveInformationPolicyConfig: QA((I) => (0, h._json)(I), "sensitiveInformationPolicyConfig"),
        tags: QA((I) => (0, h._json)(I), "tags"),
        topicPolicyConfig: QA((I) => (0, h._json)(I), "topicPolicyConfig"),
        wordPolicyConfig: QA((I) => (0, h._json)(I), "wordPolicyConfig")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateGuardrailCommand"),
    bH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/guardrails/{guardrailIdentifier}"), B.p("guardrailIdentifier", () => A.guardrailIdentifier, "{guardrailIdentifier}", !1);
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        description: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateGuardrailVersionCommand"),
    fH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/inference-profiles");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        description: [],
        inferenceProfileName: [],
        modelSource: QA((I) => (0, h._json)(I), "modelSource"),
        tags: QA((I) => (0, h._json)(I), "tags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateInferenceProfileCommand"),
    hH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/marketplace-model/endpoints");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        acceptEula: [],
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        endpointConfig: QA((I) => (0, h._json)(I), "endpointConfig"),
        endpointName: [],
        modelSourceIdentifier: [],
        tags: QA((I) => (0, h._json)(I), "tags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateMarketplaceModelEndpointCommand"),
    gH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model-copy-jobs");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        modelKmsKeyId: [],
        sourceModelArn: [],
        targetModelName: [],
        targetModelTags: QA((I) => (0, h._json)(I), "targetModelTags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateModelCopyJobCommand"),
    uH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model-customization-jobs");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        baseModelIdentifier: [],
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        customModelKmsKeyId: [],
        customModelName: [],
        customModelTags: QA((I) => (0, h._json)(I), "customModelTags"),
        customizationConfig: QA((I) => (0, h._json)(I), "customizationConfig"),
        customizationType: [],
        hyperParameters: QA((I) => (0, h._json)(I), "hyperParameters"),
        jobName: [],
        jobTags: QA((I) => (0, h._json)(I), "jobTags"),
        outputDataConfig: QA((I) => (0, h._json)(I), "outputDataConfig"),
        roleArn: [],
        trainingDataConfig: QA((I) => (0, h._json)(I), "trainingDataConfig"),
        validationDataConfig: QA((I) => (0, h._json)(I), "validationDataConfig"),
        vpcConfig: QA((I) => (0, h._json)(I), "vpcConfig")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateModelCustomizationJobCommand"),
    mH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model-import-jobs");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [],
        importedModelKmsKeyId: [],
        importedModelName: [],
        importedModelTags: QA((I) => (0, h._json)(I), "importedModelTags"),
        jobName: [],
        jobTags: QA((I) => (0, h._json)(I), "jobTags"),
        modelDataSource: QA((I) => (0, h._json)(I), "modelDataSource"),
        roleArn: [],
        vpcConfig: QA((I) => (0, h._json)(I), "vpcConfig")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateModelImportJobCommand"),
    dH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/model-invocation-job");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        inputDataConfig: QA((I) => (0, h._json)(I), "inputDataConfig"),
        jobName: [],
        modelId: [],
        outputDataConfig: QA((I) => (0, h._json)(I), "outputDataConfig"),
        roleArn: [],
        tags: QA((I) => (0, h._json)(I), "tags"),
        timeoutDurationInHours: [],
        vpcConfig: QA((I) => (0, h._json)(I), "vpcConfig")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateModelInvocationJobCommand"),
    cH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/prompt-routers");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        description: [],
        fallbackModel: QA((I) => (0, h._json)(I), "fallbackModel"),
        models: QA((I) => (0, h._json)(I), "models"),
        promptRouterName: [],
        routingCriteria: QA((I) => hz8(I, Q), "routingCriteria"),
        tags: QA((I) => (0, h._json)(I), "tags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreatePromptRouterCommand"),
    pH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/provisioned-model-throughput");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        commitmentDuration: [],
        modelId: [],
        modelUnits: [],
        provisionedModelName: [],
        tags: QA((I) => (0, h._json)(I), "tags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateProvisionedModelThroughputCommand"),
    lH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/custom-models/{modelIdentifier}"), B.p("modelIdentifier", () => A.modelIdentifier, "{modelIdentifier}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeleteCustomModelCommand"),
    iH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/delete-foundation-model-agreement");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        modelId: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_DeleteFoundationModelAgreementCommand"),
    nH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/guardrails/{guardrailIdentifier}"), B.p("guardrailIdentifier", () => A.guardrailIdentifier, "{guardrailIdentifier}", !1);
      let Z = (0, h.map)({
          [rdA]: [, A[rdA]]
        }),
        I;
      return B.m("DELETE").h(G).q(Z).b(I), B.build()
    }, "se_DeleteGuardrailCommand"),
    aH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/imported-models/{modelIdentifier}"), B.p("modelIdentifier", () => A.modelIdentifier, "{modelIdentifier}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeleteImportedModelCommand"),
    sH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/inference-profiles/{inferenceProfileIdentifier}"), B.p("inferenceProfileIdentifier", () => A.inferenceProfileIdentifier, "{inferenceProfileIdentifier}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeleteInferenceProfileCommand"),
    rH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/marketplace-model/endpoints/{endpointArn}"), B.p("endpointArn", () => A.endpointArn, "{endpointArn}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeleteMarketplaceModelEndpointCommand"),
    oH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/logging/modelinvocations");
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeleteModelInvocationLoggingConfigurationCommand"),
    tH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/prompt-routers/{promptRouterArn}"), B.p("promptRouterArn", () => A.promptRouterArn, "{promptRouterArn}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeletePromptRouterCommand"),
    eH8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/provisioned-model-throughput/{provisionedModelId}"), B.p("provisionedModelId", () => A.provisionedModelId, "{provisionedModelId}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeleteProvisionedModelThroughputCommand"),
    AC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/marketplace-model/endpoints/{endpointArn}/registration"), B.p("endpointArn", () => A.endpointArn, "{endpointArn}", !1);
      let Z;
      return B.m("DELETE").h(G).b(Z), B.build()
    }, "se_DeregisterMarketplaceModelEndpointCommand"),
    QC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/custom-models/{modelIdentifier}"), B.p("modelIdentifier", () => A.modelIdentifier, "{modelIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetCustomModelCommand"),
    BC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/evaluation-jobs/{jobIdentifier}"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetEvaluationJobCommand"),
    GC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/foundation-models/{modelIdentifier}"), B.p("modelIdentifier", () => A.modelIdentifier, "{modelIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetFoundationModelCommand"),
    ZC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/foundation-model-availability/{modelId}"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetFoundationModelAvailabilityCommand"),
    IC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/guardrails/{guardrailIdentifier}"), B.p("guardrailIdentifier", () => A.guardrailIdentifier, "{guardrailIdentifier}", !1);
      let Z = (0, h.map)({
          [rdA]: [, A[rdA]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_GetGuardrailCommand"),
    YC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/imported-models/{modelIdentifier}"), B.p("modelIdentifier", () => A.modelIdentifier, "{modelIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetImportedModelCommand"),
    JC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/inference-profiles/{inferenceProfileIdentifier}"), B.p("inferenceProfileIdentifier", () => A.inferenceProfileIdentifier, "{inferenceProfileIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetInferenceProfileCommand"),
    WC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/marketplace-model/endpoints/{endpointArn}"), B.p("endpointArn", () => A.endpointArn, "{endpointArn}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetMarketplaceModelEndpointCommand"),
    XC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-copy-jobs/{jobArn}"), B.p("jobArn", () => A.jobArn, "{jobArn}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetModelCopyJobCommand"),
    VC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-customization-jobs/{jobIdentifier}"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetModelCustomizationJobCommand"),
    FC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-import-jobs/{jobIdentifier}"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetModelImportJobCommand"),
    KC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-invocation-job/{jobIdentifier}"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetModelInvocationJobCommand"),
    DC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/logging/modelinvocations");
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetModelInvocationLoggingConfigurationCommand"),
    HC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/prompt-routers/{promptRouterArn}"), B.p("promptRouterArn", () => A.promptRouterArn, "{promptRouterArn}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetPromptRouterCommand"),
    CC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/provisioned-model-throughput/{provisionedModelId}"), B.p("provisionedModelId", () => A.provisionedModelId, "{provisionedModelId}", !1);
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetProvisionedModelThroughputCommand"),
    EC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/use-case-for-model-access");
      let Z;
      return B.m("GET").h(G).b(Z), B.build()
    }, "se_GetUseCaseForModelAccessCommand"),
    zC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/custom-models");
      let Z = (0, h.map)({
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [oz]: [, A[oz]],
          [HbQ]: [, A[HbQ]],
          [zbQ]: [, A[zbQ]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]],
          [$bQ]: [() => A.isOwned !== void 0, () => A[$bQ].toString()],
          [qbQ]: [, A[qbQ]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListCustomModelsCommand"),
    UC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/evaluation-jobs");
      let Z = (0, h.map)({
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [hL]: [, A[hL]],
          [FbQ]: [, A[FbQ]],
          [oz]: [, A[oz]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListEvaluationJobsCommand"),
    $C8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/list-foundation-model-agreement-offers/{modelId}"), B.p("modelId", () => A.modelId, "{modelId}", !1);
      let Z = (0, h.map)({
          [NbQ]: [, A[NbQ]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListFoundationModelAgreementOffersCommand"),
    wC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/foundation-models");
      let Z = (0, h.map)({
          [EbQ]: [, A[EbQ]],
          [KbQ]: [, A[KbQ]],
          [CbQ]: [, A[CbQ]],
          [DbQ]: [, A[DbQ]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListFoundationModelsCommand"),
    qC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/guardrails");
      let Z = (0, h.map)({
          [UbQ]: [, A[UbQ]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListGuardrailsCommand"),
    NC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/imported-models");
      let Z = (0, h.map)({
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [oz]: [, A[oz]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListImportedModelsCommand"),
    LC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/inference-profiles");
      let Z = (0, h.map)({
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [dj1]: [, A[tU8]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListInferenceProfilesCommand"),
    MC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/marketplace-model/endpoints");
      let Z = (0, h.map)({
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [rU8]: [, A[sU8]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListMarketplaceModelEndpointsCommand"),
    OC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-copy-jobs");
      let Z = (0, h.map)({
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [hL]: [, A[hL]],
          [LbQ]: [, A[LbQ]],
          [MbQ]: [, A[MbQ]],
          [oU8]: [, A[eU8]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListModelCopyJobsCommand"),
    RC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-customization-jobs");
      let Z = (0, h.map)({
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [hL]: [, A[hL]],
          [oz]: [, A[oz]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListModelCustomizationJobsCommand"),
    TC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-import-jobs");
      let Z = (0, h.map)({
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [hL]: [, A[hL]],
          [oz]: [, A[oz]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListModelImportJobsCommand"),
    PC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-invocation-jobs");
      let Z = (0, h.map)({
          [ObQ]: [() => A.submitTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[ObQ]).toString()],
          [RbQ]: [() => A.submitTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[RbQ]).toString()],
          [hL]: [, A[hL]],
          [oz]: [, A[oz]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListModelInvocationJobsCommand"),
    jC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/prompt-routers");
      let Z = (0, h.map)({
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [dj1]: [, A[dj1]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListPromptRoutersCommand"),
    SC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/provisioned-model-throughputs");
      let Z = (0, h.map)({
          [sz]: [() => A.creationTimeAfter !== void 0, () => (0, h.serializeDateTime)(A[sz]).toString()],
          [rz]: [() => A.creationTimeBefore !== void 0, () => (0, h.serializeDateTime)(A[rz]).toString()],
          [hL]: [, A[hL]],
          [wbQ]: [, A[wbQ]],
          [oz]: [, A[oz]],
          [sI]: [() => A.maxResults !== void 0, () => A[sI].toString()],
          [rI]: [, A[rI]],
          [TH]: [, A[TH]],
          [PH]: [, A[PH]]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListProvisionedModelThroughputsCommand"),
    _C8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/listTagsForResource");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        resourceARN: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_ListTagsForResourceCommand"),
    kC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/logging/modelinvocations");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        loggingConfig: QA((I) => (0, h._json)(I), "loggingConfig")
      })), B.m("PUT").h(G).b(Z), B.build()
    }, "se_PutModelInvocationLoggingConfigurationCommand"),
    yC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/use-case-for-model-access");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        formData: QA((I) => Q.base64Encoder(I), "formData")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_PutUseCaseForModelAccessCommand"),
    xC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/marketplace-model/endpoints/{endpointIdentifier}/registration"), B.p("endpointIdentifier", () => A.endpointIdentifier, "{endpointIdentifier}", !1);
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        modelSourceIdentifier: []
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_RegisterMarketplaceModelEndpointCommand"),
    vC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/evaluation-job/{jobIdentifier}/stop"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_StopEvaluationJobCommand"),
    bC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-customization-jobs/{jobIdentifier}/stop"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_StopModelCustomizationJobCommand"),
    fC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {};
      B.bp("/model-invocation-job/{jobIdentifier}/stop"), B.p("jobIdentifier", () => A.jobIdentifier, "{jobIdentifier}", !1);
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_StopModelInvocationJobCommand"),
    hC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/tagResource");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        resourceARN: [],
        tags: QA((I) => (0, h._json)(I), "tags")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_TagResourceCommand"),
    gC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/untagResource");
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        resourceARN: [],
        tagKeys: QA((I) => (0, h._json)(I), "tagKeys")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_UntagResourceCommand"),
    uC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/guardrails/{guardrailIdentifier}"), B.p("guardrailIdentifier", () => A.guardrailIdentifier, "{guardrailIdentifier}", !1);
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        blockedInputMessaging: [],
        blockedOutputsMessaging: [],
        contentPolicyConfig: QA((I) => (0, h._json)(I), "contentPolicyConfig"),
        contextualGroundingPolicyConfig: QA((I) => BhQ(I, Q), "contextualGroundingPolicyConfig"),
        crossRegionConfig: QA((I) => (0, h._json)(I), "crossRegionConfig"),
        description: [],
        kmsKeyId: [],
        name: [],
        sensitiveInformationPolicyConfig: QA((I) => (0, h._json)(I), "sensitiveInformationPolicyConfig"),
        topicPolicyConfig: QA((I) => (0, h._json)(I), "topicPolicyConfig"),
        wordPolicyConfig: QA((I) => (0, h._json)(I), "wordPolicyConfig")
      })), B.m("PUT").h(G).b(Z), B.build()
    }, "se_UpdateGuardrailCommand"),
    mC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/marketplace-model/endpoints/{endpointArn}"), B.p("endpointArn", () => A.endpointArn, "{endpointArn}", !1);
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        clientRequestToken: [!0, (I) => I ?? (0, gL.v4)()],
        endpointConfig: QA((I) => (0, h._json)(I), "endpointConfig")
      })), B.m("PATCH").h(G).b(Z), B.build()
    }, "se_UpdateMarketplaceModelEndpointCommand"),
    dC8 = QA(async (A, Q) => {
      let B = (0, JB.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/provisioned-model-throughput/{provisionedModelId}"), B.p("provisionedModelId", () => A.provisionedModelId, "{provisionedModelId}", !1);
      let Z;
      return Z = JSON.stringify((0, h.take)(A, {
        desiredModelId: [],
        desiredProvisionedModelName: []
      })), B.m("PATCH").h(G).b(Z), B.build()
    }, "se_UpdateProvisionedModelThroughputCommand"),
    cC8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          errors: h._json,
          evaluationJobs: h._json
        });
      return Object.assign(B, Z), B
    }, "de_BatchDeleteEvaluationJobCommand"),
    pC8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateCustomModelCommand"),
    lC8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          jobArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateEvaluationJobCommand"),
    iC8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelId: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateFoundationModelAgreementCommand"),
    nC8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          createdAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "createdAt"),
          guardrailArn: h.expectString,
          guardrailId: h.expectString,
          version: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateGuardrailCommand"),
    aC8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          guardrailId: h.expectString,
          version: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateGuardrailVersionCommand"),
    sC8 = QA(async (A, Q) => {
      if (A.statusCode !== 201 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          inferenceProfileArn: h.expectString,
          status: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateInferenceProfileCommand"),
    rC8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          marketplaceModelEndpoint: QA((I) => edA(I, Q), "marketplaceModelEndpoint")
        });
      return Object.assign(B, Z), B
    }, "de_CreateMarketplaceModelEndpointCommand"),
    oC8 = QA(async (A, Q) => {
      if (A.statusCode !== 201 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          jobArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateModelCopyJobCommand"),
    tC8 = QA(async (A, Q) => {
      if (A.statusCode !== 201 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          jobArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateModelCustomizationJobCommand"),
    eC8 = QA(async (A, Q) => {
      if (A.statusCode !== 201 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          jobArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateModelImportJobCommand"),
    AE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          jobArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateModelInvocationJobCommand"),
    QE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          promptRouterArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreatePromptRouterCommand"),
    BE8 = QA(async (A, Q) => {
      if (A.statusCode !== 201 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          provisionedModelArn: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateProvisionedModelThroughputCommand"),
    GE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteCustomModelCommand"),
    ZE8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteFoundationModelAgreementCommand"),
    IE8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteGuardrailCommand"),
    YE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteImportedModelCommand"),
    JE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteInferenceProfileCommand"),
    WE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteMarketplaceModelEndpointCommand"),
    XE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteModelInvocationLoggingConfigurationCommand"),
    VE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeletePromptRouterCommand"),
    FE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeleteProvisionedModelThroughputCommand"),
    KE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_DeregisterMarketplaceModelEndpointCommand"),
    DE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          baseModelArn: h.expectString,
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          customizationConfig: QA((I) => (0, h._json)((0, pB.awsExpectUnion)(I)), "customizationConfig"),
          customizationType: h.expectString,
          failureMessage: h.expectString,
          hyperParameters: h._json,
          jobArn: h.expectString,
          jobName: h.expectString,
          modelArn: h.expectString,
          modelKmsKeyArn: h.expectString,
          modelName: h.expectString,
          modelStatus: h.expectString,
          outputDataConfig: h._json,
          trainingDataConfig: h._json,
          trainingMetrics: QA((I) => FhQ(I, Q), "trainingMetrics"),
          validationDataConfig: h._json,
          validationMetrics: QA((I) => KhQ(I, Q), "validationMetrics")
        });
      return Object.assign(B, Z), B
    }, "de_GetCustomModelCommand"),
    HE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          applicationType: h.expectString,
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          customerEncryptionKeyId: h.expectString,
          evaluationConfig: QA((I) => ez8((0, pB.awsExpectUnion)(I), Q), "evaluationConfig"),
          failureMessages: h._json,
          inferenceConfig: QA((I) => AU8((0, pB.awsExpectUnion)(I), Q), "inferenceConfig"),
          jobArn: h.expectString,
          jobDescription: h.expectString,
          jobName: h.expectString,
          jobType: h.expectString,
          lastModifiedTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "lastModifiedTime"),
          outputDataConfig: h._json,
          roleArn: h.expectString,
          status: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_GetEvaluationJobCommand"),
    CE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelDetails: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetFoundationModelCommand"),
    EE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          agreementAvailability: h._json,
          authorizationStatus: h.expectString,
          entitlementAvailability: h.expectString,
          modelId: h.expectString,
          regionAvailability: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_GetFoundationModelAvailabilityCommand"),
    zE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          blockedInputMessaging: h.expectString,
          blockedOutputsMessaging: h.expectString,
          contentPolicy: h._json,
          contextualGroundingPolicy: QA((I) => FU8(I, Q), "contextualGroundingPolicy"),
          createdAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "createdAt"),
          crossRegionDetails: h._json,
          description: h.expectString,
          failureRecommendations: h._json,
          guardrailArn: h.expectString,
          guardrailId: h.expectString,
          kmsKeyArn: h.expectString,
          name: h.expectString,
          sensitiveInformationPolicy: h._json,
          status: h.expectString,
          statusReasons: h._json,
          topicPolicy: h._json,
          updatedAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "updatedAt"),
          version: h.expectString,
          wordPolicy: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetGuardrailCommand"),
    UE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          customModelUnits: h._json,
          instructSupported: h.expectBoolean,
          jobArn: h.expectString,
          jobName: h.expectString,
          modelArchitecture: h.expectString,
          modelArn: h.expectString,
          modelDataSource: QA((I) => (0, h._json)((0, pB.awsExpectUnion)(I)), "modelDataSource"),
          modelKmsKeyArn: h.expectString,
          modelName: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_GetImportedModelCommand"),
    $E8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          createdAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "createdAt"),
          description: h.expectString,
          inferenceProfileArn: h.expectString,
          inferenceProfileId: h.expectString,
          inferenceProfileName: h.expectString,
          models: h._json,
          status: h.expectString,
          type: h.expectString,
          updatedAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "updatedAt")
        });
      return Object.assign(B, Z), B
    }, "de_GetInferenceProfileCommand"),
    wE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          marketplaceModelEndpoint: QA((I) => edA(I, Q), "marketplaceModelEndpoint")
        });
      return Object.assign(B, Z), B
    }, "de_GetMarketplaceModelEndpointCommand"),
    qE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          failureMessage: h.expectString,
          jobArn: h.expectString,
          sourceAccountId: h.expectString,
          sourceModelArn: h.expectString,
          sourceModelName: h.expectString,
          status: h.expectString,
          targetModelArn: h.expectString,
          targetModelKmsKeyArn: h.expectString,
          targetModelName: h.expectString,
          targetModelTags: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetModelCopyJobCommand"),
    NE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          baseModelArn: h.expectString,
          clientRequestToken: h.expectString,
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          customizationConfig: QA((I) => (0, h._json)((0, pB.awsExpectUnion)(I)), "customizationConfig"),
          customizationType: h.expectString,
          endTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "endTime"),
          failureMessage: h.expectString,
          hyperParameters: h._json,
          jobArn: h.expectString,
          jobName: h.expectString,
          lastModifiedTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "lastModifiedTime"),
          outputDataConfig: h._json,
          outputModelArn: h.expectString,
          outputModelKmsKeyArn: h.expectString,
          outputModelName: h.expectString,
          roleArn: h.expectString,
          status: h.expectString,
          statusDetails: QA((I) => VhQ(I, Q), "statusDetails"),
          trainingDataConfig: h._json,
          trainingMetrics: QA((I) => FhQ(I, Q), "trainingMetrics"),
          validationDataConfig: h._json,
          validationMetrics: QA((I) => KhQ(I, Q), "validationMetrics"),
          vpcConfig: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetModelCustomizationJobCommand"),
    LE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          endTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "endTime"),
          failureMessage: h.expectString,
          importedModelArn: h.expectString,
          importedModelKmsKeyArn: h.expectString,
          importedModelName: h.expectString,
          jobArn: h.expectString,
          jobName: h.expectString,
          lastModifiedTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "lastModifiedTime"),
          modelDataSource: QA((I) => (0, h._json)((0, pB.awsExpectUnion)(I)), "modelDataSource"),
          roleArn: h.expectString,
          status: h.expectString,
          vpcConfig: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetModelImportJobCommand"),
    ME8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          clientRequestToken: h.expectString,
          endTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "endTime"),
          inputDataConfig: QA((I) => (0, h._json)((0, pB.awsExpectUnion)(I)), "inputDataConfig"),
          jobArn: h.expectString,
          jobExpirationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "jobExpirationTime"),
          jobName: h.expectString,
          lastModifiedTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "lastModifiedTime"),
          message: h.expectString,
          modelId: h.expectString,
          outputDataConfig: QA((I) => (0, h._json)((0, pB.awsExpectUnion)(I)), "outputDataConfig"),
          roleArn: h.expectString,
          status: h.expectString,
          submitTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "submitTime"),
          timeoutDurationInHours: h.expectInt32,
          vpcConfig: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetModelInvocationJobCommand"),
    OE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          loggingConfig: h._json
        });
      return Object.assign(B, Z), B
    }, "de_GetModelInvocationLoggingConfigurationCommand"),
    RE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          createdAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "createdAt"),
          description: h.expectString,
          fallbackModel: h._json,
          models: h._json,
          promptRouterArn: h.expectString,
          promptRouterName: h.expectString,
          routingCriteria: QA((I) => XhQ(I, Q), "routingCriteria"),
          status: h.expectString,
          type: h.expectString,
          updatedAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "updatedAt")
        });
      return Object.assign(B, Z), B
    }, "de_GetPromptRouterCommand"),
    TE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          commitmentDuration: h.expectString,
          commitmentExpirationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "commitmentExpirationTime"),
          creationTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "creationTime"),
          desiredModelArn: h.expectString,
          desiredModelUnits: h.expectInt32,
          failureMessage: h.expectString,
          foundationModelArn: h.expectString,
          lastModifiedTime: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "lastModifiedTime"),
          modelArn: h.expectString,
          modelUnits: h.expectInt32,
          provisionedModelArn: h.expectString,
          provisionedModelName: h.expectString,
          status: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_GetProvisionedModelThroughputCommand"),
    PE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          formData: Q.base64Decoder
        });
      return Object.assign(B, Z), B
    }, "de_GetUseCaseForModelAccessCommand"),
    jE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelSummaries: QA((I) => oz8(I, Q), "modelSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListCustomModelsCommand"),
    SE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          jobSummaries: QA((I) => QU8(I, Q), "jobSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListEvaluationJobsCommand"),
    _E8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelId: h.expectString,
          offers: h._json
        });
      return Object.assign(B, Z), B
    }, "de_ListFoundationModelAgreementOffersCommand"),
    kE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelSummaries: h._json
        });
      return Object.assign(B, Z), B
    }, "de_ListFoundationModelsCommand"),
    yE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          guardrails: QA((I) => KU8(I, Q), "guardrails"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListGuardrailsCommand"),
    xE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelSummaries: QA((I) => CU8(I, Q), "modelSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListImportedModelsCommand"),
    vE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          inferenceProfileSummaries: QA((I) => EU8(I, Q), "inferenceProfileSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListInferenceProfilesCommand"),
    bE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          marketplaceModelEndpoints: QA((I) => qU8(I, Q), "marketplaceModelEndpoints"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListMarketplaceModelEndpointsCommand"),
    fE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelCopyJobSummaries: QA((I) => LU8(I, Q), "modelCopyJobSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListModelCopyJobsCommand"),
    hE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelCustomizationJobSummaries: QA((I) => OU8(I, Q), "modelCustomizationJobSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListModelCustomizationJobsCommand"),
    gE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          modelImportJobSummaries: QA((I) => TU8(I, Q), "modelImportJobSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListModelImportJobsCommand"),
    uE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          invocationJobSummaries: QA((I) => jU8(I, Q), "invocationJobSummaries"),
          nextToken: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListModelInvocationJobsCommand"),
    mE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          nextToken: h.expectString,
          promptRouterSummaries: QA((I) => _U8(I, Q), "promptRouterSummaries")
        });
      return Object.assign(B, Z), B
    }, "de_ListPromptRoutersCommand"),
    dE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          nextToken: h.expectString,
          provisionedModelSummaries: QA((I) => yU8(I, Q), "provisionedModelSummaries")
        });
      return Object.assign(B, Z), B
    }, "de_ListProvisionedModelThroughputsCommand"),
    cE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          tags: h._json
        });
      return Object.assign(B, Z), B
    }, "de_ListTagsForResourceCommand"),
    pE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_PutModelInvocationLoggingConfigurationCommand"),
    lE8 = QA(async (A, Q) => {
      if (A.statusCode !== 201 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_PutUseCaseForModelAccessCommand"),
    iE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          marketplaceModelEndpoint: QA((I) => edA(I, Q), "marketplaceModelEndpoint")
        });
      return Object.assign(B, Z), B
    }, "de_RegisterMarketplaceModelEndpointCommand"),
    nE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_StopEvaluationJobCommand"),
    aE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_StopModelCustomizationJobCommand"),
    sE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_StopModelInvocationJobCommand"),
    rE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_TagResourceCommand"),
    oE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_UntagResourceCommand"),
    tE8 = QA(async (A, Q) => {
      if (A.statusCode !== 202 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          guardrailArn: h.expectString,
          guardrailId: h.expectString,
          updatedAt: QA((I) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(I)), "updatedAt"),
          version: h.expectString
        });
      return Object.assign(B, Z), B
    }, "de_UpdateGuardrailCommand"),
    eE8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
          $metadata: TB(A)
        }),
        G = (0, h.expectNonNull)((0, h.expectObject)(await (0, pB.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, h.take)(G, {
          marketplaceModelEndpoint: QA((I) => edA(I, Q), "marketplaceModelEndpoint")
        });
      return Object.assign(B, Z), B
    }, "de_UpdateMarketplaceModelEndpointCommand"),
    Az8 = QA(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return C2(A, Q);
      let B = (0, h.map)({
        $metadata: TB(A)
      });
      return await (0, h.collectBody)(A.body, Q), B
    }, "de_UpdateProvisionedModelThroughputCommand"),
    C2 = QA(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, pB.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, pB.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.bedrock#AccessDeniedException":
          throw await Bz8(B, Q);
        case "ConflictException":
        case "com.amazonaws.bedrock#ConflictException":
          throw await Gz8(B, Q);
        case "InternalServerException":
        case "com.amazonaws.bedrock#InternalServerException":
          throw await Zz8(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.bedrock#ResourceNotFoundException":
          throw await Iz8(B, Q);
        case "ThrottlingException":
        case "com.amazonaws.bedrock#ThrottlingException":
          throw await Wz8(B, Q);
        case "ValidationException":
        case "com.amazonaws.bedrock#ValidationException":
          throw await Vz8(B, Q);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.bedrock#ServiceQuotaExceededException":
          throw await Yz8(B, Q);
        case "TooManyTagsException":
        case "com.amazonaws.bedrock#TooManyTagsException":
          throw await Xz8(B, Q);
        case "ServiceUnavailableException":
        case "com.amazonaws.bedrock#ServiceUnavailableException":
          throw await Jz8(B, Q);
        default:
          let Z = B.body;
          return Qz8({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Qz8 = (0, h.withBaseException)(tR),
    Bz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new PbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    Gz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new ybQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_ConflictExceptionRes"),
    Zz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new jbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    Iz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new SbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    Yz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new xbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_ServiceQuotaExceededExceptionRes"),
    Jz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new vbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_ServiceUnavailableExceptionRes"),
    Wz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new _bQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_ThrottlingExceptionRes"),
    Xz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString,
          resourceName: h.expectString
        });
      Object.assign(B, Z);
      let I = new bbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_TooManyTagsExceptionRes"),
    Vz8 = QA(async (A, Q) => {
      let B = (0, h.map)({}),
        G = A.body,
        Z = (0, h.take)(G, {
          message: h.expectString
        });
      Object.assign(B, Z);
      let I = new kbQ({
        $metadata: TB(A),
        ...B
      });
      return (0, h.decorateServiceException)(I, A.body)
    }, "de_ValidationExceptionRes"),
    tj1 = QA((A, Q) => {
      return Object.entries(A).reduce((B, [G, Z]) => {
        if (Z === null) return B;
        return B[G] = Fz8(Z, Q), B
      }, {})
    }, "se_AdditionalModelRequestFields"),
    Fz8 = QA((A, Q) => {
      return A
    }, "se_AdditionalModelRequestFieldsValue"),
    Kz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        customMetricConfig: QA((B) => Dz8(B, Q), "customMetricConfig"),
        datasetMetricConfigs: h._json,
        evaluatorModelConfig: h._json
      })
    }, "se_AutomatedEvaluationConfig"),
    Dz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        customMetrics: QA((B) => Hz8(B, Q), "customMetrics"),
        evaluatorModelConfig: h._json
      })
    }, "se_AutomatedEvaluationCustomMetricConfig"),
    Hz8 = QA((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return Cz8(B, Q)
      })
    }, "se_AutomatedEvaluationCustomMetrics"),
    Cz8 = QA((A, Q) => {
      return pdA.visit(A, {
        customMetricDefinition: QA((B) => ({
          customMetricDefinition: zz8(B, Q)
        }), "customMetricDefinition"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_AutomatedEvaluationCustomMetricSource"),
    Ez8 = QA((A, Q) => {
      return (0, h.take)(A, {
        contentType: [],
        data: Q.base64Encoder,
        identifier: []
      })
    }, "se_ByteContentDoc"),
    zz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        instructions: [],
        name: [],
        ratingScale: QA((B) => yz8(B, Q), "ratingScale")
      })
    }, "se_CustomMetricDefinition"),
    Uz8 = QA((A, Q) => {
      return ldA.visit(A, {
        automated: QA((B) => ({
          automated: Kz8(B, Q)
        }), "automated"),
        human: QA((B) => ({
          human: (0, h._json)(B)
        }), "human"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_EvaluationConfig"),
    $z8 = QA((A, Q) => {
      return sdA.visit(A, {
        models: QA((B) => ({
          models: (0, h._json)(B)
        }), "models"),
        ragConfigs: QA((B) => ({
          ragConfigs: kz8(B, Q)
        }), "ragConfigs"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_EvaluationInferenceConfig"),
    wz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        byteContent: QA((B) => Ez8(B, Q), "byteContent"),
        s3Location: h._json,
        sourceType: []
      })
    }, "se_ExternalSource"),
    qz8 = QA((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return wz8(B, Q)
      })
    }, "se_ExternalSources"),
    Nz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        additionalModelRequestFields: QA((B) => tj1(B, Q), "additionalModelRequestFields"),
        guardrailConfiguration: h._json,
        kbInferenceConfig: QA((B) => GhQ(B, Q), "kbInferenceConfig"),
        promptTemplate: h._json
      })
    }, "se_ExternalSourcesGenerationConfiguration"),
    Lz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        generationConfiguration: QA((B) => Nz8(B, Q), "generationConfiguration"),
        modelArn: [],
        sources: QA((B) => qz8(B, Q), "sources")
      })
    }, "se_ExternalSourcesRetrieveAndGenerateConfiguration"),
    rR = QA((A, Q) => {
      return (0, h.take)(A, {
        key: [],
        value: QA((B) => Mz8(B, Q), "value")
      })
    }, "se_FilterAttribute"),
    Mz8 = QA((A, Q) => {
      return A
    }, "se_FilterValue"),
    Oz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        additionalModelRequestFields: QA((B) => tj1(B, Q), "additionalModelRequestFields"),
        guardrailConfiguration: h._json,
        kbInferenceConfig: QA((B) => GhQ(B, Q), "kbInferenceConfig"),
        promptTemplate: h._json
      })
    }, "se_GenerationConfiguration"),
    Rz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        action: [],
        enabled: [],
        threshold: h.serializeFloat,
        type: []
      })
    }, "se_GuardrailContextualGroundingFilterConfig"),
    Tz8 = QA((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return Rz8(B, Q)
      })
    }, "se_GuardrailContextualGroundingFiltersConfig"),
    BhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        filtersConfig: QA((B) => Tz8(B, Q), "filtersConfig")
      })
    }, "se_GuardrailContextualGroundingPolicyConfig"),
    GhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        textInferenceConfig: QA((B) => gz8(B, Q), "textInferenceConfig")
      })
    }, "se_KbInferenceConfig"),
    Pz8 = QA((A, Q) => {
      return ndA.visit(A, {
        retrieveAndGenerateConfig: QA((B) => ({
          retrieveAndGenerateConfig: bz8(B, Q)
        }), "retrieveAndGenerateConfig"),
        retrieveConfig: QA((B) => ({
          retrieveConfig: fz8(B, Q)
        }), "retrieveConfig"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_KnowledgeBaseConfig"),
    ZhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        vectorSearchConfiguration: QA((B) => Sz8(B, Q), "vectorSearchConfiguration")
      })
    }, "se_KnowledgeBaseRetrievalConfiguration"),
    jz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        generationConfiguration: QA((B) => Oz8(B, Q), "generationConfiguration"),
        knowledgeBaseId: [],
        modelArn: [],
        orchestrationConfiguration: h._json,
        retrievalConfiguration: QA((B) => ZhQ(B, Q), "retrievalConfiguration")
      })
    }, "se_KnowledgeBaseRetrieveAndGenerateConfiguration"),
    Sz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        filter: QA((B) => IhQ(B, Q), "filter"),
        implicitFilterConfiguration: h._json,
        numberOfResults: [],
        overrideSearchType: [],
        rerankingConfiguration: QA((B) => dz8(B, Q), "rerankingConfiguration")
      })
    }, "se_KnowledgeBaseVectorSearchConfiguration"),
    _z8 = QA((A, Q) => {
      return adA.visit(A, {
        knowledgeBaseConfig: QA((B) => ({
          knowledgeBaseConfig: Pz8(B, Q)
        }), "knowledgeBaseConfig"),
        precomputedRagSourceConfig: QA((B) => ({
          precomputedRagSourceConfig: (0, h._json)(B)
        }), "precomputedRagSourceConfig"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_RAGConfig"),
    kz8 = QA((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return _z8(B, Q)
      })
    }, "se_RagConfigs"),
    yz8 = QA((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return xz8(B, Q)
      })
    }, "se_RatingScale"),
    xz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        definition: [],
        value: QA((B) => vz8(B, Q), "value")
      })
    }, "se_RatingScaleItem"),
    vz8 = QA((A, Q) => {
      return cdA.visit(A, {
        floatValue: QA((B) => ({
          floatValue: (0, h.serializeFloat)(B)
        }), "floatValue"),
        stringValue: QA((B) => ({
          stringValue: B
        }), "stringValue"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_RatingScaleItemValue"),
    IhQ = QA((A, Q) => {
      return idA.visit(A, {
        andAll: QA((B) => ({
          andAll: XbQ(B, Q)
        }), "andAll"),
        equals: QA((B) => ({
          equals: rR(B, Q)
        }), "equals"),
        greaterThan: QA((B) => ({
          greaterThan: rR(B, Q)
        }), "greaterThan"),
        greaterThanOrEquals: QA((B) => ({
          greaterThanOrEquals: rR(B, Q)
        }), "greaterThanOrEquals"),
        in: QA((B) => ({
          in: rR(B, Q)
        }), "in"),
        lessThan: QA((B) => ({
          lessThan: rR(B, Q)
        }), "lessThan"),
        lessThanOrEquals: QA((B) => ({
          lessThanOrEquals: rR(B, Q)
        }), "lessThanOrEquals"),
        listContains: QA((B) => ({
          listContains: rR(B, Q)
        }), "listContains"),
        notEquals: QA((B) => ({
          notEquals: rR(B, Q)
        }), "notEquals"),
        notIn: QA((B) => ({
          notIn: rR(B, Q)
        }), "notIn"),
        orAll: QA((B) => ({
          orAll: XbQ(B, Q)
        }), "orAll"),
        startsWith: QA((B) => ({
          startsWith: rR(B, Q)
        }), "startsWith"),
        stringContains: QA((B) => ({
          stringContains: rR(B, Q)
        }), "stringContains"),
        _: QA((B, G) => ({
          [B]: G
        }), "_")
      })
    }, "se_RetrievalFilter"),
    XbQ = QA((A, Q) => {
      return A.filter((B) => B != null).map((B) => {
        return IhQ(B, Q)
      })
    }, "se_RetrievalFilterList"),
    bz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        externalSourcesConfiguration: QA((B) => Lz8(B, Q), "externalSourcesConfiguration"),
        knowledgeBaseConfiguration: QA((B) => jz8(B, Q), "knowledgeBaseConfiguration"),
        type: []
      })
    }, "se_RetrieveAndGenerateConfiguration"),
    fz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        knowledgeBaseId: [],
        knowledgeBaseRetrievalConfiguration: QA((B) => ZhQ(B, Q), "knowledgeBaseRetrievalConfiguration")
      })
    }, "se_RetrieveConfig"),
    hz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        responseQualityDifference: h.serializeFloat
      })
    }, "se_RoutingCriteria"),
    gz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        maxTokens: [],
        stopSequences: h._json,
        temperature: h.serializeFloat,
        topP: h.serializeFloat
      })
    }, "se_TextInferenceConfig"),
    uz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        metadataConfiguration: h._json,
        modelConfiguration: QA((B) => mz8(B, Q), "modelConfiguration"),
        numberOfRerankedResults: []
      })
    }, "se_VectorSearchBedrockRerankingConfiguration"),
    mz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        additionalModelRequestFields: QA((B) => tj1(B, Q), "additionalModelRequestFields"),
        modelArn: []
      })
    }, "se_VectorSearchBedrockRerankingModelConfiguration"),
    dz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        bedrockRerankingConfiguration: QA((B) => uz8(B, Q), "bedrockRerankingConfiguration"),
        type: []
      })
    }, "se_VectorSearchRerankingConfiguration"),
    ej1 = QA((A, Q) => {
      return Object.entries(A).reduce((B, [G, Z]) => {
        if (Z === null) return B;
        return B[G] = cz8(Z, Q), B
      }, {})
    }, "de_AdditionalModelRequestFields"),
    cz8 = QA((A, Q) => {
      return A
    }, "de_AdditionalModelRequestFieldsValue"),
    pz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        customMetricConfig: QA((B) => lz8(B, Q), "customMetricConfig"),
        datasetMetricConfigs: h._json,
        evaluatorModelConfig: QA((B) => (0, h._json)((0, pB.awsExpectUnion)(B)), "evaluatorModelConfig")
      })
    }, "de_AutomatedEvaluationConfig"),
    lz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        customMetrics: QA((B) => iz8(B, Q), "customMetrics"),
        evaluatorModelConfig: h._json
      })
    }, "de_AutomatedEvaluationCustomMetricConfig"),
    iz8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return nz8((0, pB.awsExpectUnion)(G), Q)
      })
    }, "de_AutomatedEvaluationCustomMetrics"),
    nz8 = QA((A, Q) => {
      if (A.customMetricDefinition != null) return {
        customMetricDefinition: sz8(A.customMetricDefinition, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_AutomatedEvaluationCustomMetricSource"),
    az8 = QA((A, Q) => {
      return (0, h.take)(A, {
        contentType: h.expectString,
        data: Q.base64Decoder,
        identifier: h.expectString
      })
    }, "de_ByteContentDoc"),
    sz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        instructions: h.expectString,
        name: h.expectString,
        ratingScale: QA((B) => fU8(B, Q), "ratingScale")
      })
    }, "de_CustomMetricDefinition"),
    rz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        baseModelArn: h.expectString,
        baseModelName: h.expectString,
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        customizationType: h.expectString,
        modelArn: h.expectString,
        modelName: h.expectString,
        modelStatus: h.expectString,
        ownerAccountId: h.expectString
      })
    }, "de_CustomModelSummary"),
    oz8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return rz8(G, Q)
      })
    }, "de_CustomModelSummaryList"),
    tz8 = QA((A, Q) => {
      return (0, h.take)(A, {
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        status: h.expectString
      })
    }, "de_DataProcessingDetails"),
    ez8 = QA((A, Q) => {
      if (A.automated != null) return {
        automated: pz8(A.automated, Q)
      };
      if (A.human != null) return {
        human: (0, h._json)(A.human)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_EvaluationConfig"),
    AU8 = QA((A, Q) => {
      if (A.models != null) return {
        models: (0, h._json)(A.models)
      };
      if (A.ragConfigs != null) return {
        ragConfigs: bU8(A.ragConfigs, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_EvaluationInferenceConfig"),
    QU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return BU8(G, Q)
      })
    }, "de_EvaluationSummaries"),
    BU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        applicationType: h.expectString,
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        customMetricsEvaluatorModelIdentifiers: h._json,
        evaluationTaskTypes: h._json,
        evaluatorModelIdentifiers: h._json,
        inferenceConfigSummary: h._json,
        jobArn: h.expectString,
        jobName: h.expectString,
        jobType: h.expectString,
        modelIdentifiers: h._json,
        ragIdentifiers: h._json,
        status: h.expectString
      })
    }, "de_EvaluationSummary"),
    GU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        byteContent: QA((B) => az8(B, Q), "byteContent"),
        s3Location: h._json,
        sourceType: h.expectString
      })
    }, "de_ExternalSource"),
    ZU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return GU8(G, Q)
      })
    }, "de_ExternalSources"),
    IU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        additionalModelRequestFields: QA((B) => ej1(B, Q), "additionalModelRequestFields"),
        guardrailConfiguration: h._json,
        kbInferenceConfig: QA((B) => YhQ(B, Q), "kbInferenceConfig"),
        promptTemplate: h._json
      })
    }, "de_ExternalSourcesGenerationConfiguration"),
    YU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        generationConfiguration: QA((B) => IU8(B, Q), "generationConfiguration"),
        modelArn: h.expectString,
        sources: QA((B) => ZU8(B, Q), "sources")
      })
    }, "de_ExternalSourcesRetrieveAndGenerateConfiguration"),
    oR = QA((A, Q) => {
      return (0, h.take)(A, {
        key: h.expectString,
        value: QA((B) => JU8(B, Q), "value")
      })
    }, "de_FilterAttribute"),
    JU8 = QA((A, Q) => {
      return A
    }, "de_FilterValue"),
    WU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        additionalModelRequestFields: QA((B) => ej1(B, Q), "additionalModelRequestFields"),
        guardrailConfiguration: h._json,
        kbInferenceConfig: QA((B) => YhQ(B, Q), "kbInferenceConfig"),
        promptTemplate: h._json
      })
    }, "de_GenerationConfiguration"),
    XU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        action: h.expectString,
        enabled: h.expectBoolean,
        threshold: h.limitedParseDouble,
        type: h.expectString
      })
    }, "de_GuardrailContextualGroundingFilter"),
    VU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return XU8(G, Q)
      })
    }, "de_GuardrailContextualGroundingFilters"),
    FU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        filters: QA((B) => VU8(B, Q), "filters")
      })
    }, "de_GuardrailContextualGroundingPolicy"),
    KU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return DU8(G, Q)
      })
    }, "de_GuardrailSummaries"),
    DU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        arn: h.expectString,
        createdAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "createdAt"),
        crossRegionDetails: h._json,
        description: h.expectString,
        id: h.expectString,
        name: h.expectString,
        status: h.expectString,
        updatedAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "updatedAt"),
        version: h.expectString
      })
    }, "de_GuardrailSummary"),
    HU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        instructSupported: h.expectBoolean,
        modelArchitecture: h.expectString,
        modelArn: h.expectString,
        modelName: h.expectString
      })
    }, "de_ImportedModelSummary"),
    CU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return HU8(G, Q)
      })
    }, "de_ImportedModelSummaryList"),
    EU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return zU8(G, Q)
      })
    }, "de_InferenceProfileSummaries"),
    zU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        createdAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "createdAt"),
        description: h.expectString,
        inferenceProfileArn: h.expectString,
        inferenceProfileId: h.expectString,
        inferenceProfileName: h.expectString,
        models: h._json,
        status: h.expectString,
        type: h.expectString,
        updatedAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "updatedAt")
      })
    }, "de_InferenceProfileSummary"),
    YhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        textInferenceConfig: QA((B) => dU8(B, Q), "textInferenceConfig")
      })
    }, "de_KbInferenceConfig"),
    UU8 = QA((A, Q) => {
      if (A.retrieveAndGenerateConfig != null) return {
        retrieveAndGenerateConfig: uU8(A.retrieveAndGenerateConfig, Q)
      };
      if (A.retrieveConfig != null) return {
        retrieveConfig: mU8(A.retrieveConfig, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_KnowledgeBaseConfig"),
    JhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        vectorSearchConfiguration: QA((B) => wU8(B, Q), "vectorSearchConfiguration")
      })
    }, "de_KnowledgeBaseRetrievalConfiguration"),
    $U8 = QA((A, Q) => {
      return (0, h.take)(A, {
        generationConfiguration: QA((B) => WU8(B, Q), "generationConfiguration"),
        knowledgeBaseId: h.expectString,
        modelArn: h.expectString,
        orchestrationConfiguration: h._json,
        retrievalConfiguration: QA((B) => JhQ(B, Q), "retrievalConfiguration")
      })
    }, "de_KnowledgeBaseRetrieveAndGenerateConfiguration"),
    wU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        filter: QA((B) => WhQ((0, pB.awsExpectUnion)(B), Q), "filter"),
        implicitFilterConfiguration: h._json,
        numberOfResults: h.expectInt32,
        overrideSearchType: h.expectString,
        rerankingConfiguration: QA((B) => aU8(B, Q), "rerankingConfiguration")
      })
    }, "de_KnowledgeBaseVectorSearchConfiguration"),
    edA = QA((A, Q) => {
      return (0, h.take)(A, {
        createdAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "createdAt"),
        endpointArn: h.expectString,
        endpointConfig: QA((B) => (0, h._json)((0, pB.awsExpectUnion)(B)), "endpointConfig"),
        endpointStatus: h.expectString,
        endpointStatusMessage: h.expectString,
        modelSourceIdentifier: h.expectString,
        status: h.expectString,
        statusMessage: h.expectString,
        updatedAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "updatedAt")
      })
    }, "de_MarketplaceModelEndpoint"),
    qU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return NU8(G, Q)
      })
    }, "de_MarketplaceModelEndpointSummaries"),
    NU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        createdAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "createdAt"),
        endpointArn: h.expectString,
        modelSourceIdentifier: h.expectString,
        status: h.expectString,
        statusMessage: h.expectString,
        updatedAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "updatedAt")
      })
    }, "de_MarketplaceModelEndpointSummary"),
    LU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return MU8(G, Q)
      })
    }, "de_ModelCopyJobSummaries"),
    MU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        failureMessage: h.expectString,
        jobArn: h.expectString,
        sourceAccountId: h.expectString,
        sourceModelArn: h.expectString,
        sourceModelName: h.expectString,
        status: h.expectString,
        targetModelArn: h.expectString,
        targetModelKmsKeyArn: h.expectString,
        targetModelName: h.expectString,
        targetModelTags: h._json
      })
    }, "de_ModelCopyJobSummary"),
    OU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return RU8(G, Q)
      })
    }, "de_ModelCustomizationJobSummaries"),
    RU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        baseModelArn: h.expectString,
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        customModelArn: h.expectString,
        customModelName: h.expectString,
        customizationType: h.expectString,
        endTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "endTime"),
        jobArn: h.expectString,
        jobName: h.expectString,
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        status: h.expectString,
        statusDetails: QA((B) => VhQ(B, Q), "statusDetails")
      })
    }, "de_ModelCustomizationJobSummary"),
    TU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return PU8(G, Q)
      })
    }, "de_ModelImportJobSummaries"),
    PU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        endTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "endTime"),
        importedModelArn: h.expectString,
        importedModelName: h.expectString,
        jobArn: h.expectString,
        jobName: h.expectString,
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        status: h.expectString
      })
    }, "de_ModelImportJobSummary"),
    jU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return SU8(G, Q)
      })
    }, "de_ModelInvocationJobSummaries"),
    SU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        clientRequestToken: h.expectString,
        endTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "endTime"),
        inputDataConfig: QA((B) => (0, h._json)((0, pB.awsExpectUnion)(B)), "inputDataConfig"),
        jobArn: h.expectString,
        jobExpirationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "jobExpirationTime"),
        jobName: h.expectString,
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        message: h.expectString,
        modelId: h.expectString,
        outputDataConfig: QA((B) => (0, h._json)((0, pB.awsExpectUnion)(B)), "outputDataConfig"),
        roleArn: h.expectString,
        status: h.expectString,
        submitTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "submitTime"),
        timeoutDurationInHours: h.expectInt32,
        vpcConfig: h._json
      })
    }, "de_ModelInvocationJobSummary"),
    _U8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return kU8(G, Q)
      })
    }, "de_PromptRouterSummaries"),
    kU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        createdAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "createdAt"),
        description: h.expectString,
        fallbackModel: h._json,
        models: h._json,
        promptRouterArn: h.expectString,
        promptRouterName: h.expectString,
        routingCriteria: QA((B) => XhQ(B, Q), "routingCriteria"),
        status: h.expectString,
        type: h.expectString,
        updatedAt: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "updatedAt")
      })
    }, "de_PromptRouterSummary"),
    yU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return xU8(G, Q)
      })
    }, "de_ProvisionedModelSummaries"),
    xU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        commitmentDuration: h.expectString,
        commitmentExpirationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "commitmentExpirationTime"),
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        desiredModelArn: h.expectString,
        desiredModelUnits: h.expectInt32,
        foundationModelArn: h.expectString,
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        modelArn: h.expectString,
        modelUnits: h.expectInt32,
        provisionedModelArn: h.expectString,
        provisionedModelName: h.expectString,
        status: h.expectString
      })
    }, "de_ProvisionedModelSummary"),
    vU8 = QA((A, Q) => {
      if (A.knowledgeBaseConfig != null) return {
        knowledgeBaseConfig: UU8((0, pB.awsExpectUnion)(A.knowledgeBaseConfig), Q)
      };
      if (A.precomputedRagSourceConfig != null) return {
        precomputedRagSourceConfig: (0, h._json)((0, pB.awsExpectUnion)(A.precomputedRagSourceConfig))
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_RAGConfig"),
    bU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return vU8((0, pB.awsExpectUnion)(G), Q)
      })
    }, "de_RagConfigs"),
    fU8 = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return hU8(G, Q)
      })
    }, "de_RatingScale"),
    hU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        definition: h.expectString,
        value: QA((B) => gU8((0, pB.awsExpectUnion)(B), Q), "value")
      })
    }, "de_RatingScaleItem"),
    gU8 = QA((A, Q) => {
      if ((0, h.limitedParseFloat32)(A.floatValue) !== void 0) return {
        floatValue: (0, h.limitedParseFloat32)(A.floatValue)
      };
      if ((0, h.expectString)(A.stringValue) !== void 0) return {
        stringValue: (0, h.expectString)(A.stringValue)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_RatingScaleItemValue"),
    WhQ = QA((A, Q) => {
      if (A.andAll != null) return {
        andAll: VbQ(A.andAll, Q)
      };
      if (A.equals != null) return {
        equals: oR(A.equals, Q)
      };
      if (A.greaterThan != null) return {
        greaterThan: oR(A.greaterThan, Q)
      };
      if (A.greaterThanOrEquals != null) return {
        greaterThanOrEquals: oR(A.greaterThanOrEquals, Q)
      };
      if (A.in != null) return {
        in: oR(A.in, Q)
      };
      if (A.lessThan != null) return {
        lessThan: oR(A.lessThan, Q)
      };
      if (A.lessThanOrEquals != null) return {
        lessThanOrEquals: oR(A.lessThanOrEquals, Q)
      };
      if (A.listContains != null) return {
        listContains: oR(A.listContains, Q)
      };
      if (A.notEquals != null) return {
        notEquals: oR(A.notEquals, Q)
      };
      if (A.notIn != null) return {
        notIn: oR(A.notIn, Q)
      };
      if (A.orAll != null) return {
        orAll: VbQ(A.orAll, Q)
      };
      if (A.startsWith != null) return {
        startsWith: oR(A.startsWith, Q)
      };
      if (A.stringContains != null) return {
        stringContains: oR(A.stringContains, Q)
      };
      return {
        $unknown: Object.entries(A)[0]
      }
    }, "de_RetrievalFilter"),
    VbQ = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return WhQ((0, pB.awsExpectUnion)(G), Q)
      })
    }, "de_RetrievalFilterList"),
    uU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        externalSourcesConfiguration: QA((B) => YU8(B, Q), "externalSourcesConfiguration"),
        knowledgeBaseConfiguration: QA((B) => $U8(B, Q), "knowledgeBaseConfiguration"),
        type: h.expectString
      })
    }, "de_RetrieveAndGenerateConfiguration"),
    mU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        knowledgeBaseId: h.expectString,
        knowledgeBaseRetrievalConfiguration: QA((B) => JhQ(B, Q), "knowledgeBaseRetrievalConfiguration")
      })
    }, "de_RetrieveConfig"),
    XhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        responseQualityDifference: h.limitedParseDouble
      })
    }, "de_RoutingCriteria"),
    VhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        dataProcessingDetails: QA((B) => tz8(B, Q), "dataProcessingDetails"),
        trainingDetails: QA((B) => cU8(B, Q), "trainingDetails"),
        validationDetails: QA((B) => pU8(B, Q), "validationDetails")
      })
    }, "de_StatusDetails"),
    dU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        maxTokens: h.expectInt32,
        stopSequences: h._json,
        temperature: h.limitedParseFloat32,
        topP: h.limitedParseFloat32
      })
    }, "de_TextInferenceConfig"),
    cU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        status: h.expectString
      })
    }, "de_TrainingDetails"),
    FhQ = QA((A, Q) => {
      return (0, h.take)(A, {
        trainingLoss: h.limitedParseFloat32
      })
    }, "de_TrainingMetrics"),
    pU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        creationTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "creationTime"),
        lastModifiedTime: QA((B) => (0, h.expectNonNull)((0, h.parseRfc3339DateTimeWithOffset)(B)), "lastModifiedTime"),
        status: h.expectString
      })
    }, "de_ValidationDetails"),
    KhQ = QA((A, Q) => {
      return (A || []).filter((G) => G != null).map((G) => {
        return lU8(G, Q)
      })
    }, "de_ValidationMetrics"),
    lU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        validationLoss: h.limitedParseFloat32
      })
    }, "de_ValidatorMetric"),
    iU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        metadataConfiguration: h._json,
        modelConfiguration: QA((B) => nU8(B, Q), "modelConfiguration"),
        numberOfRerankedResults: h.expectInt32
      })
    }, "de_VectorSearchBedrockRerankingConfiguration"),
    nU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        additionalModelRequestFields: QA((B) => ej1(B, Q), "additionalModelRequestFields"),
        modelArn: h.expectString
      })
    }, "de_VectorSearchBedrockRerankingModelConfiguration"),
    aU8 = QA((A, Q) => {
      return (0, h.take)(A, {
        bedrockRerankingConfiguration: QA((B) => iU8(B, Q), "bedrockRerankingConfiguration"),
        type: h.expectString
      })
    }, "de_VectorSearchRerankingConfiguration"),
    TB = QA((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    FbQ = "applicationTypeEquals",
    KbQ = "byCustomizationType",
    DbQ = "byInferenceType",
    HbQ = "baseModelArnEquals",
    CbQ = "byOutputModality",
    EbQ = "byProvider",
    sz = "creationTimeAfter",
    rz = "creationTimeBefore",
    zbQ = "foundationModelArnEquals",
    UbQ = "guardrailIdentifier",
    rdA = "guardrailVersion",
    $bQ = "isOwned",
    wbQ = "modelArnEquals",
    sI = "maxResults",
    qbQ = "modelStatus",
    sU8 = "modelSourceEquals",
    rU8 = "modelSourceIdentifier",
    oz = "nameContains",
    rI = "nextToken",
    oU8 = "outputModelNameContains",
    NbQ = "offerType",
    LbQ = "sourceAccountEquals",
    TH = "sortBy",
    hL = "statusEquals",
    MbQ = "sourceModelArnEquals",
    PH = "sortOrder",
    ObQ = "submitTimeAfter",
    RbQ = "submitTimeBefore",
    dj1 = "type",
    tU8 = "typeEquals",
    eU8 = "targetModelNameContains",
    DhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "BatchDeleteEvaluationJob", {}).n("BedrockClient", "BatchDeleteEvaluationJobCommand").f(ubQ, cbQ).ser(_H8).de(cC8).build() {
      static {
        QA(this, "BatchDeleteEvaluationJobCommand")
      }
    },
    HhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateCustomModel", {}).n("BedrockClient", "CreateCustomModelCommand").f(void 0, void 0).ser(kH8).de(pC8).build() {
      static {
        QA(this, "CreateCustomModelCommand")
      }
    },
    ChQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateEvaluationJob", {}).n("BedrockClient", "CreateEvaluationJobCommand").f(AhQ, void 0).ser(yH8).de(lC8).build() {
      static {
        QA(this, "CreateEvaluationJobCommand")
      }
    },
    EhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateFoundationModelAgreement", {}).n("BedrockClient", "CreateFoundationModelAgreementCommand").f(void 0, void 0).ser(xH8).de(iC8).build() {
      static {
        QA(this, "CreateFoundationModelAgreementCommand")
      }
    },
    zhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateGuardrail", {}).n("BedrockClient", "CreateGuardrailCommand").f(UfQ, void 0).ser(vH8).de(nC8).build() {
      static {
        QA(this, "CreateGuardrailCommand")
      }
    },
    UhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateGuardrailVersion", {}).n("BedrockClient", "CreateGuardrailVersionCommand").f($fQ, void 0).ser(bH8).de(aC8).build() {
      static {
        QA(this, "CreateGuardrailVersionCommand")
      }
    },
    $hQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateInferenceProfile", {}).n("BedrockClient", "CreateInferenceProfileCommand").f(vfQ, void 0).ser(fH8).de(sC8).build() {
      static {
        QA(this, "CreateInferenceProfileCommand")
      }
    },
    whQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateMarketplaceModelEndpoint", {}).n("BedrockClient", "CreateMarketplaceModelEndpointCommand").f(void 0, void 0).ser(hH8).de(rC8).build() {
      static {
        QA(this, "CreateMarketplaceModelEndpointCommand")
      }
    },
    qhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateModelCopyJob", {}).n("BedrockClient", "CreateModelCopyJobCommand").f(void 0, void 0).ser(gH8).de(oC8).build() {
      static {
        QA(this, "CreateModelCopyJobCommand")
      }
    },
    NhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateModelCustomizationJob", {}).n("BedrockClient", "CreateModelCustomizationJobCommand").f(ifQ, void 0).ser(uH8).de(tC8).build() {
      static {
        QA(this, "CreateModelCustomizationJobCommand")
      }
    },
    LhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateModelImportJob", {}).n("BedrockClient", "CreateModelImportJobCommand").f(void 0, void 0).ser(mH8).de(eC8).build() {
      static {
        QA(this, "CreateModelImportJobCommand")
      }
    },
    MhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateModelInvocationJob", {}).n("BedrockClient", "CreateModelInvocationJobCommand").f(void 0, void 0).ser(dH8).de(AE8).build() {
      static {
        QA(this, "CreateModelInvocationJobCommand")
      }
    },
    OhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreatePromptRouter", {}).n("BedrockClient", "CreatePromptRouterCommand").f(dfQ, void 0).ser(cH8).de(QE8).build() {
      static {
        QA(this, "CreatePromptRouterCommand")
      }
    },
    RhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "CreateProvisionedModelThroughput", {}).n("BedrockClient", "CreateProvisionedModelThroughputCommand").f(void 0, void 0).ser(pH8).de(BE8).build() {
      static {
        QA(this, "CreateProvisionedModelThroughputCommand")
      }
    },
    ThQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteCustomModel", {}).n("BedrockClient", "DeleteCustomModelCommand").f(void 0, void 0).ser(lH8).de(GE8).build() {
      static {
        QA(this, "DeleteCustomModelCommand")
      }
    },
    PhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteFoundationModelAgreement", {}).n("BedrockClient", "DeleteFoundationModelAgreementCommand").f(void 0, void 0).ser(iH8).de(ZE8).build() {
      static {
        QA(this, "DeleteFoundationModelAgreementCommand")
      }
    },
    jhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteGuardrail", {}).n("BedrockClient", "DeleteGuardrailCommand").f(void 0, void 0).ser(nH8).de(IE8).build() {
      static {
        QA(this, "DeleteGuardrailCommand")
      }
    },
    ShQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteImportedModel", {}).n("BedrockClient", "DeleteImportedModelCommand").f(void 0, void 0).ser(aH8).de(YE8).build() {
      static {
        QA(this, "DeleteImportedModelCommand")
      }
    },
    _hQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteInferenceProfile", {}).n("BedrockClient", "DeleteInferenceProfileCommand").f(void 0, void 0).ser(sH8).de(JE8).build() {
      static {
        QA(this, "DeleteInferenceProfileCommand")
      }
    },
    khQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteMarketplaceModelEndpoint", {}).n("BedrockClient", "DeleteMarketplaceModelEndpointCommand").f(void 0, void 0).ser(rH8).de(WE8).build() {
      static {
        QA(this, "DeleteMarketplaceModelEndpointCommand")
      }
    },
    yhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteModelInvocationLoggingConfiguration", {}).n("BedrockClient", "DeleteModelInvocationLoggingConfigurationCommand").f(void 0, void 0).ser(oH8).de(XE8).build() {
      static {
        QA(this, "DeleteModelInvocationLoggingConfigurationCommand")
      }
    },
    xhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeletePromptRouter", {}).n("BedrockClient", "DeletePromptRouterCommand").f(void 0, void 0).ser(tH8).de(VE8).build() {
      static {
        QA(this, "DeletePromptRouterCommand")
      }
    },
    vhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeleteProvisionedModelThroughput", {}).n("BedrockClient", "DeleteProvisionedModelThroughputCommand").f(void 0, void 0).ser(eH8).de(FE8).build() {
      static {
        QA(this, "DeleteProvisionedModelThroughputCommand")
      }
    },
    bhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "DeregisterMarketplaceModelEndpoint", {}).n("BedrockClient", "DeregisterMarketplaceModelEndpointCommand").f(void 0, void 0).ser(AC8).de(KE8).build() {
      static {
        QA(this, "DeregisterMarketplaceModelEndpointCommand")
      }
    },
    fhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetCustomModel", {}).n("BedrockClient", "GetCustomModelCommand").f(void 0, gbQ).ser(QC8).de(DE8).build() {
      static {
        QA(this, "GetCustomModelCommand")
      }
    },
    hhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetEvaluationJob", {}).n("BedrockClient", "GetEvaluationJobCommand").f(XfQ, QhQ).ser(BC8).de(HE8).build() {
      static {
        QA(this, "GetEvaluationJobCommand")
      }
    },
    ghQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetFoundationModelAvailability", {}).n("BedrockClient", "GetFoundationModelAvailabilityCommand").f(void 0, void 0).ser(ZC8).de(EE8).build() {
      static {
        QA(this, "GetFoundationModelAvailabilityCommand")
      }
    },
    uhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetFoundationModel", {}).n("BedrockClient", "GetFoundationModelCommand").f(void 0, void 0).ser(GC8).de(CE8).build() {
      static {
        QA(this, "GetFoundationModelCommand")
      }
    },
    mhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetGuardrail", {}).n("BedrockClient", "GetGuardrailCommand").f(void 0, _fQ).ser(IC8).de(zE8).build() {
      static {
        QA(this, "GetGuardrailCommand")
      }
    },
    dhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetImportedModel", {}).n("BedrockClient", "GetImportedModelCommand").f(void 0, void 0).ser(YC8).de(UE8).build() {
      static {
        QA(this, "GetImportedModelCommand")
      }
    },
    chQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetInferenceProfile", {}).n("BedrockClient", "GetInferenceProfileCommand").f(void 0, bfQ).ser(JC8).de($E8).build() {
      static {
        QA(this, "GetInferenceProfileCommand")
      }
    },
    phQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetMarketplaceModelEndpoint", {}).n("BedrockClient", "GetMarketplaceModelEndpointCommand").f(void 0, void 0).ser(WC8).de(wE8).build() {
      static {
        QA(this, "GetMarketplaceModelEndpointCommand")
      }
    },
    lhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetModelCopyJob", {}).n("BedrockClient", "GetModelCopyJobCommand").f(void 0, void 0).ser(XC8).de(qE8).build() {
      static {
        QA(this, "GetModelCopyJobCommand")
      }
    },
    ihQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetModelCustomizationJob", {}).n("BedrockClient", "GetModelCustomizationJobCommand").f(void 0, nfQ).ser(VC8).de(NE8).build() {
      static {
        QA(this, "GetModelCustomizationJobCommand")
      }
    },
    nhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetModelImportJob", {}).n("BedrockClient", "GetModelImportJobCommand").f(void 0, void 0).ser(FC8).de(LE8).build() {
      static {
        QA(this, "GetModelImportJobCommand")
      }
    },
    ahQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetModelInvocationJob", {}).n("BedrockClient", "GetModelInvocationJobCommand").f(void 0, gfQ).ser(KC8).de(ME8).build() {
      static {
        QA(this, "GetModelInvocationJobCommand")
      }
    },
    shQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetModelInvocationLoggingConfiguration", {}).n("BedrockClient", "GetModelInvocationLoggingConfigurationCommand").f(void 0, void 0).ser(DC8).de(OE8).build() {
      static {
        QA(this, "GetModelInvocationLoggingConfigurationCommand")
      }
    },
    rhQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetPromptRouter", {}).n("BedrockClient", "GetPromptRouterCommand").f(void 0, cfQ).ser(HC8).de(RE8).build() {
      static {
        QA(this, "GetPromptRouterCommand")
      }
    },
    ohQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetProvisionedModelThroughput", {}).n("BedrockClient", "GetProvisionedModelThroughputCommand").f(void 0, void 0).ser(CC8).de(TE8).build() {
      static {
        QA(this, "GetProvisionedModelThroughputCommand")
      }
    },
    thQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "GetUseCaseForModelAccess", {}).n("BedrockClient", "GetUseCaseForModelAccessCommand").f(void 0, void 0).ser(EC8).de(PE8).build() {
      static {
        QA(this, "GetUseCaseForModelAccessCommand")
      }
    },
    AS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListCustomModels", {}).n("BedrockClient", "ListCustomModelsCommand").f(void 0, void 0).ser(zC8).de(jE8).build() {
      static {
        QA(this, "ListCustomModelsCommand")
      }
    },
    QS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListEvaluationJobs", {}).n("BedrockClient", "ListEvaluationJobsCommand").f(void 0, void 0).ser(UC8).de(SE8).build() {
      static {
        QA(this, "ListEvaluationJobsCommand")
      }
    },
    ehQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListFoundationModelAgreementOffers", {}).n("BedrockClient", "ListFoundationModelAgreementOffersCommand").f(void 0, void 0).ser($C8).de(_E8).build() {
      static {
        QA(this, "ListFoundationModelAgreementOffersCommand")
      }
    },
    AgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListFoundationModels", {}).n("BedrockClient", "ListFoundationModelsCommand").f(void 0, void 0).ser(wC8).de(kE8).build() {
      static {
        QA(this, "ListFoundationModelsCommand")
      }
    },
    BS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListGuardrails", {}).n("BedrockClient", "ListGuardrailsCommand").f(void 0, yfQ).ser(qC8).de(yE8).build() {
      static {
        QA(this, "ListGuardrailsCommand")
      }
    },
    GS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListImportedModels", {}).n("BedrockClient", "ListImportedModelsCommand").f(void 0, void 0).ser(NC8).de(xE8).build() {
      static {
        QA(this, "ListImportedModelsCommand")
      }
    },
    ZS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListInferenceProfiles", {}).n("BedrockClient", "ListInferenceProfilesCommand").f(void 0, hfQ).ser(LC8).de(vE8).build() {
      static {
        QA(this, "ListInferenceProfilesCommand")
      }
    },
    IS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListMarketplaceModelEndpoints", {}).n("BedrockClient", "ListMarketplaceModelEndpointsCommand").f(void 0, void 0).ser(MC8).de(bE8).build() {
      static {
        QA(this, "ListMarketplaceModelEndpointsCommand")
      }
    },
    YS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListModelCopyJobs", {}).n("BedrockClient", "ListModelCopyJobsCommand").f(void 0, void 0).ser(OC8).de(fE8).build() {
      static {
        QA(this, "ListModelCopyJobsCommand")
      }
    },
    JS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListModelCustomizationJobs", {}).n("BedrockClient", "ListModelCustomizationJobsCommand").f(void 0, void 0).ser(RC8).de(hE8).build() {
      static {
        QA(this, "ListModelCustomizationJobsCommand")
      }
    },
    WS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListModelImportJobs", {}).n("BedrockClient", "ListModelImportJobsCommand").f(void 0, void 0).ser(TC8).de(gE8).build() {
      static {
        QA(this, "ListModelImportJobsCommand")
      }
    },
    XS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListModelInvocationJobs", {}).n("BedrockClient", "ListModelInvocationJobsCommand").f(void 0, mfQ).ser(PC8).de(uE8).build() {
      static {
        QA(this, "ListModelInvocationJobsCommand")
      }
    },
    VS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListPromptRouters", {}).n("BedrockClient", "ListPromptRoutersCommand").f(void 0, lfQ).ser(jC8).de(mE8).build() {
      static {
        QA(this, "ListPromptRoutersCommand")
      }
    },
    FS1 = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListProvisionedModelThroughputs", {}).n("BedrockClient", "ListProvisionedModelThroughputsCommand").f(void 0, void 0).ser(SC8).de(dE8).build() {
      static {
        QA(this, "ListProvisionedModelThroughputsCommand")
      }
    },
    QgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "ListTagsForResource", {}).n("BedrockClient", "ListTagsForResourceCommand").f(void 0, void 0).ser(_C8).de(cE8).build() {
      static {
        QA(this, "ListTagsForResourceCommand")
      }
    },
    BgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "PutModelInvocationLoggingConfiguration", {}).n("BedrockClient", "PutModelInvocationLoggingConfigurationCommand").f(void 0, void 0).ser(kC8).de(pE8).build() {
      static {
        QA(this, "PutModelInvocationLoggingConfigurationCommand")
      }
    },
    GgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "PutUseCaseForModelAccess", {}).n("BedrockClient", "PutUseCaseForModelAccessCommand").f(void 0, void 0).ser(yC8).de(lE8).build() {
      static {
        QA(this, "PutUseCaseForModelAccessCommand")
      }
    },
    ZgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "RegisterMarketplaceModelEndpoint", {}).n("BedrockClient", "RegisterMarketplaceModelEndpointCommand").f(void 0, void 0).ser(xC8).de(iE8).build() {
      static {
        QA(this, "RegisterMarketplaceModelEndpointCommand")
      }
    },
    IgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "StopEvaluationJob", {}).n("BedrockClient", "StopEvaluationJobCommand").f(VfQ, void 0).ser(vC8).de(nE8).build() {
      static {
        QA(this, "StopEvaluationJobCommand")
      }
    },
    YgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "StopModelCustomizationJob", {}).n("BedrockClient", "StopModelCustomizationJobCommand").f(void 0, void 0).ser(bC8).de(aE8).build() {
      static {
        QA(this, "StopModelCustomizationJobCommand")
      }
    },
    JgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "StopModelInvocationJob", {}).n("BedrockClient", "StopModelInvocationJobCommand").f(void 0, void 0).ser(fC8).de(sE8).build() {
      static {
        QA(this, "StopModelInvocationJobCommand")
      }
    },
    WgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "TagResource", {}).n("BedrockClient", "TagResourceCommand").f(void 0, void 0).ser(hC8).de(rE8).build() {
      static {
        QA(this, "TagResourceCommand")
      }
    },
    XgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "UntagResource", {}).n("BedrockClient", "UntagResourceCommand").f(void 0, void 0).ser(gC8).de(oE8).build() {
      static {
        QA(this, "UntagResourceCommand")
      }
    },
    VgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "UpdateGuardrail", {}).n("BedrockClient", "UpdateGuardrailCommand").f(xfQ, void 0).ser(uC8).de(tE8).build() {
      static {
        QA(this, "UpdateGuardrailCommand")
      }
    },
    FgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "UpdateMarketplaceModelEndpoint", {}).n("BedrockClient", "UpdateMarketplaceModelEndpointCommand").f(void 0, void 0).ser(mC8).de(eE8).build() {
      static {
        QA(this, "UpdateMarketplaceModelEndpointCommand")
      }
    },
    KgQ = class extends h.Command.classBuilder().ep(D2).m(function(A, Q, B, G) {
      return [(0, H2.getSerdePlugin)(B, this.serialize, this.deserialize), (0, Y2.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AmazonBedrockControlPlaneService", "UpdateProvisionedModelThroughput", {}).n("BedrockClient", "UpdateProvisionedModelThroughputCommand").f(void 0, void 0).ser(dC8).de(Az8).build() {
      static {
        QA(this, "UpdateProvisionedModelThroughputCommand")
      }
    },
    A$8 = {
      BatchDeleteEvaluationJobCommand: DhQ,
      CreateCustomModelCommand: HhQ,
      CreateEvaluationJobCommand: ChQ,
      CreateFoundationModelAgreementCommand: EhQ,
      CreateGuardrailCommand: zhQ,
      CreateGuardrailVersionCommand: UhQ,
      CreateInferenceProfileCommand: $hQ,
      CreateMarketplaceModelEndpointCommand: whQ,
      CreateModelCopyJobCommand: qhQ,
      CreateModelCustomizationJobCommand: NhQ,
      CreateModelImportJobCommand: LhQ,
      CreateModelInvocationJobCommand: MhQ,
      CreatePromptRouterCommand: OhQ,
      CreateProvisionedModelThroughputCommand: RhQ,
      DeleteCustomModelCommand: ThQ,
      DeleteFoundationModelAgreementCommand: PhQ,
      DeleteGuardrailCommand: jhQ,
      DeleteImportedModelCommand: ShQ,
      DeleteInferenceProfileCommand: _hQ,
      DeleteMarketplaceModelEndpointCommand: khQ,
      DeleteModelInvocationLoggingConfigurationCommand: yhQ,
      DeletePromptRouterCommand: xhQ,
      DeleteProvisionedModelThroughputCommand: vhQ,
      DeregisterMarketplaceModelEndpointCommand: bhQ,
      GetCustomModelCommand: fhQ,
      GetEvaluationJobCommand: hhQ,
      GetFoundationModelCommand: uhQ,
      GetFoundationModelAvailabilityCommand: ghQ,
      GetGuardrailCommand: mhQ,
      GetImportedModelCommand: dhQ,
      GetInferenceProfileCommand: chQ,
      GetMarketplaceModelEndpointCommand: phQ,
      GetModelCopyJobCommand: lhQ,
      GetModelCustomizationJobCommand: ihQ,
      GetModelImportJobCommand: nhQ,
      GetModelInvocationJobCommand: ahQ,
      GetModelInvocationLoggingConfigurationCommand: shQ,
      GetPromptRouterCommand: rhQ,
      GetProvisionedModelThroughputCommand: ohQ,
      GetUseCaseForModelAccessCommand: thQ,
      ListCustomModelsCommand: AS1,
      ListEvaluationJobsCommand: QS1,
      ListFoundationModelAgreementOffersCommand: ehQ,
      ListFoundationModelsCommand: AgQ,
      ListGuardrailsCommand: BS1,
      ListImportedModelsCommand: GS1,
      ListInferenceProfilesCommand: ZS1,
      ListMarketplaceModelEndpointsCommand: IS1,
      ListModelCopyJobsCommand: YS1,
      ListModelCustomizationJobsCommand: JS1,
      ListModelImportJobsCommand: WS1,
      ListModelInvocationJobsCommand: XS1,
      ListPromptRoutersCommand: VS1,
      ListProvisionedModelThroughputsCommand: FS1,
      ListTagsForResourceCommand: QgQ,
      PutModelInvocationLoggingConfigurationCommand: BgQ,
      PutUseCaseForModelAccessCommand: GgQ,
      RegisterMarketplaceModelEndpointCommand: ZgQ,
      StopEvaluationJobCommand: IgQ,
      StopModelCustomizationJobCommand: YgQ,
      StopModelInvocationJobCommand: JgQ,
      TagResourceCommand: WgQ,
      UntagResourceCommand: XgQ,
      UpdateGuardrailCommand: VgQ,
      UpdateMarketplaceModelEndpointCommand: FgQ,
      UpdateProvisionedModelThroughputCommand: KgQ
    },
    DgQ = class extends tz {
      static {
        QA(this, "Bedrock")
      }
    };
  (0, h.createAggregatedClient)(A$8, DgQ);
  var Q$8 = (0, JB.createPaginator)(tz, AS1, "nextToken", "nextToken", "maxResults"),
    B$8 = (0, JB.createPaginator)(tz, QS1, "nextToken", "nextToken", "maxResults"),
    G$8 = (0, JB.createPaginator)(tz, BS1, "nextToken", "nextToken", "maxResults"),
    Z$8 = (0, JB.createPaginator)(tz, GS1, "nextToken", "nextToken", "maxResults"),
    I$8 = (0, JB.createPaginator)(tz, ZS1, "nextToken", "nextToken", "maxResults"),
    Y$8 = (0, JB.createPaginator)(tz, IS1, "nextToken", "nextToken", "maxResults"),
    J$8 = (0, JB.createPaginator)(tz, YS1, "nextToken", "nextToken", "maxResults"),
    W$8 = (0, JB.createPaginator)(tz, JS1, "nextToken", "nextToken", "maxResults"),
    X$8 = (0, JB.createPaginator)(tz, WS1, "nextToken", "nextToken", "maxResults"),
    V$8 = (0, JB.createPaginator)(tz, XS1, "nextToken", "nextToken", "maxResults"),
    F$8 = (0, JB.createPaginator)(tz, VS1, "nextToken", "nextToken", "maxResults"),
    K$8 = (0, JB.createPaginator)(tz, FS1, "nextToken", "nextToken", "maxResults")
})