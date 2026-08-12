# Symbol index: platform infrastructure (2.1.227)

## Module: Permissions and Auto Mode

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `UH` | applyPermissionUpdate | `cli_inner_pretty.js:332829-332885` | function |
| `VSn` | arbitratePreToolHook | `cli_inner_pretty.js:344395-344430` | function |
| `G4d` | AutoModeClassifierQueue | `cli_inner_pretty.js:339852-339896` | class |
| `EV_` | checkBashPermissions | `cli_inner_pretty.js:337556-337813` | function |
| `y6s` | checkPowerShellAcceptEdits | `cli_inner_pretty.js:347920-348026` | function |
| `JHt` | checkRuleBasedPermissions | `cli_inner_pretty.js:343191-343254` | function |
| `Iqt` | classifyAutoModeAction | `cli_inner_pretty.js:383389-383527` | function |
| `fK_` | decideToolPermission | `cli_inner_pretty.js:343400-343806` | function |
| `hrt` | effectiveModeForTool | `cli_inner_pretty.js:301060-301076` | function |
| `W4d` | enqueueAutoModeClassifier | `cli_inner_pretty.js:339897-339899` | function |
| `yK_` | evaluateToolPermission | `cli_inner_pretty.js:343255-343339` | function |
| `aU` | isAutoModeAvailable | `cli_inner_pretty.js:579806-579810` | function |
| `Vbn` | matchBashRules | `cli_inner_pretty.js:336851-336915` | function |
| `pK_` | resolveHeadlessPermission | `cli_inner_pretty.js:343064-343101` | function |


## Module: Plan-mode Permission Enforcement

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `HSe` | checkReadPermission | `cli_inner_pretty.js:589167-589210` | function |
| `cun` | checkSessionFileWriteCarveout | `cli_inner_pretty.js:589345-589391` | function |
| `CHt` | checkWritePermission | `cli_inner_pretty.js:589211-589292` | function |


## Module: MCP Runtime

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `wBo` | callMcpTool | `cli_inner_pretty.js:314233-314350` | function |
| `qB_` | callMcpToolWithAutoBackground | `cli_inner_pretty.js:300907-301001` | function |
| `rJs` | computeDeferredToolDelta | `cli_inner_pretty.js:380806-380899` | function |
| `e3o` | computeDroppedMcpToolsDelta | `cli_inner_pretty.js:592620-592624` | function |
| `ZGo` | computeMcpInstructionsDelta | `cli_inner_pretty.js:592611-592619` | function |
| `WNo` | connectToMcpServer | `cli_inner_pretty.js:305931-305959` | function |
| `fae` | createNullPrototypeMcpMap | `cli_inner_pretty.js:253539-253541` | function |
| `nNh` | createMcpStartupCoordinator | `cli_inner_pretty.js:928831-928853` | function |
| `BoH` | explicitMcpConfigRequestsWait | `cli_inner_pretty.js:946098-946100` | function |
| `P4_` | getMcpClientModule | `cli_inner_pretty.js:316894-316918` | function |
| `WB_` | getMcpAutoBackgroundMs | `cli_inner_pretty.js:300899-300906` | function |
| `fPd` | getRootsListResponse | `cli_inner_pretty.js:305718-305738` | function |
| `vwr` | McpOAuthProviderV1 | `cli_inner_pretty.js:298157-299026` | class |
| `Ywr` | McpOAuthProviderV2 | `cli_inner_pretty.js:311200-311985` | class |
| `f2_` | notifyMcpRootsListChanged | `cli_inner_pretty.js:305744-305749` | function |
| `_Hr` | parseMcpConfig | `cli_inner_pretty.js:254339-254466` | function |
| `V3s` | projectMcpTools | `cli_inner_pretty.js:306064-306485` | function |
| `noi` | refreshMcpToolsForClient | `cli_inner_pretty.js:557536-557572` | function |
| `w4` | selectMcpSdkGeneration | `cli_inner_pretty.js:216004-216027` | function |
| `xOd` | shapeLargeMcpResult | `cli_inner_pretty.js:313949-314023` | function |
| `VYl` | startMcpServerGroup | `cli_inner_pretty.js:928854-928890` | function |
| `yXl` | waitForPendingMcpBeforeFirstCommand | `cli_inner_pretty.js:946109-946170` | function |


## Module: Authentication and Credential Lifecycle

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `tRa` | acquireOAuthRefreshLock | `cli_inner_pretty.js:616466-616499` | function |
| `auH` | authLogin | `cli_inner_pretty.js:961726-961832` | function |
| `nsi` | checkAndRefreshOAuthTokenIfNeededWithOutcome | `cli_inner_pretty.js:616537-616545` | function |
| `PIS` | executeApiKeyHelper | `cli_inner_pretty.js:615778-615813` | function |
| `WWo` | fetchOAuthProfile | `cli_inner_pretty.js:614974-614996` | function |
| `BOr` | getApiKeyFromApiKeyHelper | `cli_inner_pretty.js:615732-615747` | function |
| `vF` | getAnthropicApiKeyWithSource | `cli_inner_pretty.js:615658-615692` | function |
| `tT` | getAuthTokenSource | `cli_inner_pretty.js:615561-615577` | function |
| `UE` | isOAuthMode | `cli_inner_pretty.js:615520-615543` | function |
| `sEr` | markRefreshTokenDead | `cli_inner_pretty.js:616224-616242` | function |
| `iEr` | persistRefreshedOAuthTokens | `cli_inner_pretty.js:616125-616190` | function |
| `ZIS` | recoverOAuth401 | `cli_inner_pretty.js:616342-616437` | function |
| `z0e` | refreshOAuthToken | `cli_inner_pretty.js:614862-614931` | function |
| `FIa` | refreshOAuthTokenLocked | `cli_inner_pretty.js:616547-616647` | function |
| `ekt` | validateForceLoginMethod | `cli_inner_pretty.js:617173-617194` | function |
| `ihe` | validateForcedLoginOrganization | `cli_inner_pretty.js:617070-617171` | function |

## Module: AWS Credential Resolution

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `UIS` | getAwsCredentialsFromExportHelper | `cli_inner_pretty.js:615873-615920` | function |
| `wV` | getDefaultAwsProviderChain | `cli_inner_pretty.js:617403-617428` | function |
| `HMr` | invalidateDefaultAwsProviderChainDebounced | `cli_inner_pretty.js:615961-615969` | function |
| `BIS` | refreshAwsAuthIfNeeded | `cli_inner_pretty.js:615815-615871` | function |
| `XIa` | resolveAwsCredentialsWithTimeout | `cli_inner_pretty.js:615934-615958` | function |
| `Tie` | resolveAwsHelpers | `cli_inner_pretty.js:617392-617402` | function |

## Module: Authenticated Transport

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `Wlo` | clearMTLSCache | `cli_inner_pretty.js:62520-62522` | function |
| `msp` | createPinnedGatewayAgent | `cli_inner_pretty.js:412252-412265` | function |
| `Lss` | disableKeepAlive | `cli_inner_pretty.js:83654-83656` | function |
| `Wdd` | filterHostManagedProviderEnvironment | `cli_inner_pretty.js:242050-242079` | function |
| `Qts` | getMTLSAgent | `cli_inner_pretty.js:62495-62507` | function |
| `apr` | loadMTLSClientMaterial | `cli_inner_pretty.js:62539-62551` | function |


## Module: Bedrock Model Resolution

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `Nnn` | buildProviderModelIds | `cli_inner_pretty.js:97728-97736` | function |
| `Pnn` | getCachedBedrockInferenceProfiles | `cli_inner_pretty.js:97326-97329` | function |
| `dgt` | inferBedrockCrossRegionPrefix | `cli_inner_pretty.js:97465-97471` | function |
| `Zpy` | listBedrockInferenceProfiles | `cli_inner_pretty.js:97331-97351` | function |
| `afy` | resolveBedrockModelIds | `cli_inner_pretty.js:97738-97776` | function |
| `Ffr` | resolvePreferredBedrockRegionPrefix | `cli_inner_pretty.js:97473-97476` | function |
| `cgt` | selectBedrockInferenceProfile | `cli_inner_pretty.js:97353-97358` | function |

## Module: Models and Provider Resolution

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `$mr` | resolveDefaultModelWithAttribution | `cli_inner_pretty.js:108993-109007` | function |
| `_8i` | getModelPricingTier | `cli_inner_pretty.js:9090-9094` | function |
| `Ab` | getProviderForModel | `cli_inner_pretty.js:97654-97667` | function |
| `AQe` | projectModelPickerCapabilities | `cli_inner_pretty.js:119429-119456` | function |
| `Ayo` | getAdminModelPolicyState | `cli_inner_pretty.js:109218-109269` | function |
| `Bps` | isGatewayModelDiscoveryEnabled | `cli_inner_pretty.js:108044-108050` | function |
| `Bsc` | resolveCatalogAlias | `cli_inner_pretty.js:9102-9108` | function |
| `Co` | resolveModelWithOverrides | `cli_inner_pretty.js:109424-109435` | function |
| `CV` | isClaudePlatformProvider | `cli_inner_pretty.js:97669-97671` | function |
| `Cxy` | applyFableCreditGate | `cli_inner_pretty.js:119481-119488` | function |
| `dTi` | getEffortCostRatio | `cli_inner_pretty.js:764300-764307` | function |
| `ele` | resolveSubagentModel | `cli_inner_pretty.js:475539-475575` | function |
| `Ets` | collectManagedPolicyTiers | `cli_inner_pretty.js:59569-59599` | function |
| `gEu` | resolveInteractiveThinkingConfig | `cli_inner_pretty.js:118481-118486` | function |
| `gF` | normalizeCanonicalModelId | `cli_inner_pretty.js:109369-109399` | function |
| `Hyo` | resolveEnforcedAvailableModel | `cli_inner_pretty.js:109041-109192` | function |
| `huu` | handleFastModeOverageRejection | `cli_inner_pretty.js:107723-107746` | function |
| `hv` | getModelCatalogEntry | `cli_inner_pretty.js:9087-9088` | function |
| `Ips` | isFastModePersistentlyEnabled | `cli_inner_pretty.js:107576-107580` | function |
| `KXr` | getModelCatalog | `cli_inner_pretty.js:9078-9080` | function |
| `klo` | stripDiskModelPolicy | `cli_inner_pretty.js:59535-59540` | function |
| `kuu` | fetchGatewayModels | `cli_inner_pretty.js:108103-108173` | function |
| `L2g` | extractHostModelOverlay | `cli_inner_pretty.js:59526-59534` | function |
| `LV` | getFastModeUnavailableReason | `cli_inner_pretty.js:107517-107546` | function |
| `mhr` | insertFablePickerRow | `cli_inner_pretty.js:119490-119525` | function |
| `Mps` | resolveModelCosts | `cli_inner_pretty.js:107947-107959` | function |
| `Msc` | BAKED_MODEL_CATALOG | `cli_inner_pretty.js:8532-9024` | constant |
| `N2` | isFastModeAvailable | `cli_inner_pretty.js:107497-107500` | function |
| `nfy` | projectProviderIds | `cli_inner_pretty.js:97494-97507` | function |
| `nw` | isFastModeModel | `cli_inner_pretty.js:107582-107588` | function |
| `ofy` | buildProviderModelConfigs | `cli_inner_pretty.js:97509-97520` | function |
| `Otg` | parseModelCatalog | `cli_inner_pretty.js:9056-9071` | function |
| `puu` | FastModeState | `cli_inner_pretty.js:107606-107661` | class |
| `Qgt` | filterModelPickerRowsByPolicy | `cli_inner_pretty.js:119415-119427` | function |
| `QZ` | requireCompleteNamedProviderConfig | `cli_inner_pretty.js:97522-97531` | function |
| `rUt` | getSecondaryProvider | `cli_inner_pretty.js:97647-97651` | function |
| `T3` | resolveFastModeForModel | `cli_inner_pretty.js:107590-107598` | function |
| `TMp` | resolveSubagentModelWithTelemetry | `cli_inner_pretty.js:475577-475610` | function |
| `Txy` | assembleModelPickerRows | `cli_inner_pretty.js:119316-119385` | function |
| `Vhs` | buildModelPickerOptions | `cli_inner_pretty.js:119260-119275` | function |
| `vkc` | composePolicySettings | `cli_inner_pretty.js:59659-59737` | function |
| `vyo` | resolveEntitledFallback | `cli_inner_pretty.js:109009-109025` | function |
| `Wn` | getApiProvider | `cli_inner_pretty.js:97625-97640` | function |
| `Wps` | findCanonicalOverrideKey | `cli_inner_pretty.js:109408-109415` | function |
| `WSa` | resolveTeammateModelWithTelemetry | `cli_inner_pretty.js:549968-549993` | function |
| `y2` | hasModelCapability | `cli_inner_pretty.js:9096-9100` | function |
| `y8i` | getParsedModelCatalog | `cli_inner_pretty.js:9073-9076` | function |
| `yF` | resolvePermittedFamilyAlias | `cli_inner_pretty.js:108908-108918` | function |
| `YXr` | getCanonicalIdForProviderId | `cli_inner_pretty.js:9084-9085` | function |
| `Zgt` | assembleAndAnnotateModelPickerOptions | `cli_inner_pretty.js:119277-119314` | function |
| `zuu` | resolveTierDefault | `cli_inner_pretty.js:109027-109039` | function |

## Module: API Reliability

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `Bko` | buildRetryErrorDetails | `cli_inner_pretty.js:202577-202591` | function |
| `Vqe` | computeRetryDelay | `cli_inner_pretty.js:585230-585245` | function |
| `kxS` | createApiFetchWrapper | `cli_inner_pretty.js:612311-612370` | function |
| `VDS` | downloadBinaryWithRetry | `cli_inner_pretty.js:623336-623407` | function |
| `dj` | extractConnectionDetails | `cli_inner_pretty.js:202453-202471` | function |
| `oSr` | formatApiError | `cli_inner_pretty.js:202512-202576` | function |
| `Wko` | getBadMediaLocation | `cli_inner_pretty.js:202970-202973` | function |
| `MKu` | getMediaKindsForApiError | `cli_inner_pretty.js:202954-202959` | function |
| `Wyf` | isByteStreamWatchdogEnabled | `cli_inner_pretty.js:612293-612297` | function |
| `D0u` | isRecoverableHttp2Teardown | `cli_inner_pretty.js:127548-127567` | function |
| `pEf` | isRetryableDownloadError | `cli_inner_pretty.js:623329-623335` | function |
| `ChS` | isRetryableApiError | `cli_inner_pretty.js:585337-585377` | function |
| `E8e` | isRetryWatchdogEnabled | `cli_inner_pretty.js:584934-584936` | function |
| `bhS` | isStaleApiConnection | `cli_inner_pretty.js:584943-584947` | function |
| `Ynf` | isTransientSubscriber429 | `cli_inner_pretty.js:585375-585377` | function |
| `Lse` | NETWORK_TRANSIENT_CODES | `cli_inner_pretty.js:202645-202657` | constant |
| `Rse` | NETWORK_UNREACHABLE_CODES | `cli_inner_pretty.js:202632-202644` | constant |
| `eof` | parseContextOverflow | `cli_inner_pretty.js:585247-585267` | function |
| `mxs` | parseMediaApiError | `cli_inner_pretty.js:202960-202969` | function |
| `bYs` | parseStreamingFallbackBlock | `cli_inner_pretty.js:359996-360015` | function |
| `LhS` | readRetryAfterDelay | `cli_inner_pretty.js:585398-585405` | function |
| `AxS` | resolveByteStreamIdleTimeout | `cli_inner_pretty.js:612147-612160` | function |
| `i_a` | resolveMaxApiRetries | `cli_inner_pretty.js:585378-585394` | function |
| `a_a` | resolveProviderByteStreamIdleTimeout | `cli_inner_pretty.js:612161-612163` | function |
| `khS` | resolveRequestMaxRetries | `cli_inner_pretty.js:585395-585397` | function |
| `s_a` | resolveStreamIdleTimeout | `cli_inner_pretty.js:612144-612146` | function |
| `DPh` | runStartupConnectivityCheck | `cli_inner_pretty.js:924878-924920` | function |
| `Wnf` | sleepUntilRetryOrWake | `cli_inner_pretty.js:585210-585228` | function |
| `Ds_` | SSL_ERROR_CODES | `cli_inner_pretty.js:202623-202631` | constant |
| `Mko` | SSL_FAIL_FAST_CODES | `cli_inner_pretty.js:202604-202622` | constant |
| `Z5p` | streamMessages | `cli_inner_pretty.js:529365-531849` | function |
| `LZb` | streamWithWireHeartbeats | `cli_inner_pretty.js:529270-529303` | function |
| `Uti` | retryApiRequest | `cli_inner_pretty.js:584948-585209` | function |
| `wxS` | wrapResponseBodyWithByteWatchdog | `cli_inner_pretty.js:612164-612289` | function |

## Module: Self-hosted Runner API Boundary

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `F8e` | buildRunnerAdminUiEquivalent | `cli_inner_pretty.js:559507-559509` | function |
| `QKt` | getApiBaseUrl | `cli_inner_pretty.js:559489-559493` | function |
| `mn` | getPermissionMode | `cli_inner_pretty.js:123960-124001` | function |
| `zo` | httpClient | `cli_inner_pretty.js:25506` | object |
| `De` | reportError | `cli_inner_pretty.js:19893-19910` | function |
| `qsS` | requireOperatorOAuthToken | `cli_inner_pretty.js:559497-559506` | function |
| `IRn` | SelfHostedRunnerApiError | `cli_inner_pretty.js:559563-559569` | class |
| `U8e` | selfHostedRunnerApiRequest | `cli_inner_pretty.js:559510-559541` | function |
| `vre` | serializeRunnerToolResult | `cli_inner_pretty.js:559542-559544` | function |

## Module: Sandbox Credential Masking

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `nHs` | buildCredentialSandboxPlan | `cli_inner_pretty.js:159233-159250` | function |

## Module: Sandbox Runtime

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `tWy` | annotateStderrWithSandboxFailures | `cli_inner_pretty.js:159689-159696` | function |
| `aBu` | authorizeSandboxNetworkRequest | `cli_inner_pretty.js:158979-159000` | function |
| `N5y` | buildWindowsFilesystemPlan | `cli_inner_pretty.js:159297-159309` | function |
| `w_r` | buildSandboxRuntimeConfig | `cli_inner_pretty.js:177047-178131` | function |
| `d5y` | compileLinuxMountPlan | `cli_inner_pretty.js:157269-157485` | function |
| `g5y` | compileMacSandboxProfile | `cli_inner_pretty.js:157788-158020` | function |
| `KGu` | ensureSandboxInitialized | `cli_inner_pretty.js:178482-178502` | function |
| `XGu` | initializeSandbox | `cli_inner_pretty.js:178556-178587` | function |
| `D5y` | initializeSandboxRuntime | `cli_inner_pretty.js:159068-159193` | function |
| `rMe` | resolveFilesystemPolicy | `cli_inner_pretty.js:176789-176797` | function |
| `Iln` | SandboxViolationStore | `cli_inner_pretty.js:157627-157670` | class |
| `ANu` | wrapMacSandboxCommand | `cli_inner_pretty.js:158024-158100` | function |
| `K5y` | wrapSandboxCommandArgv | `cli_inner_pretty.js:159514-159562` | function |
| `_Nu` | wrapLinuxSandboxCommand | `cli_inner_pretty.js:157487-157603` | function |
| `wAo` | isStructurallyValidJwt | `cli_inner_pretty.js:156480-156485` | function |
| `V1u` | maskCredentialEnvironment | `cli_inner_pretty.js:156645-156721` | function |
| `G1u` | maskCredentialFiles | `cli_inner_pretty.js:156542-156639` | function |
| `Lvs` | MaskedFileStore | `cli_inner_pretty.js:156519-156540` | class |
| `CAo` | maskJwtClaims | `cli_inner_pretty.js:156495-156513` | function |
| `Z1u` | planAwsSigV4Repair | `cli_inner_pretty.js:156773-156838` | function |
| `Q1u` | registerAwsCredentialPairs | `cli_inner_pretty.js:156728-156768` | function |
| `AAo` | replaceCapturedSecrets | `cli_inner_pretty.js:156433-156471` | function |

## Module: Telemetry, Usage, and Feature Evaluation

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `N2t` | buildTelemetryAttributes | `cli_inner_pretty.js:129857-129935` | function |
| `fUb` | buildMetricReaders | `cli_inner_pretty.js:462485-462537` | function |
| `W7o` | buildOtlpOptions | `cli_inner_pretty.js:462797-462829` | function |
| `yIp` | buildOtlpHttpAgentFactory | `cli_inner_pretty.js:462887-462912` | function |
| `TIp` | buildLogExporters | `cli_inner_pretty.js:462539-462571` | function |
| `FcH` | buildSpendLimitHeaders | `cli_inner_pretty.js:960267-960290` | function |
| `mUb` | buildTraceExporters | `cli_inner_pretty.js:462573-462604` | function |
| `V6d` | clearConsumedMcpAttribution | `cli_inner_pretty.js:369423-369431` | function |
| `jCn` | collectUsageData | `cli_inner_pretty.js:474187-474253` | function |
| `l9h` | consumeSseUsageFrame | `cli_inner_pretty.js:960041-960085` | function |
| `m9h` | createGatewaySpendMeter | `cli_inner_pretty.js:960177-960250` | function |
| `sRa.createClient` | createGrowthBookClient | `cli_inner_pretty.js:617746-617803` | function |
| `sRa.getClient` | getGrowthBookClient | `cli_inner_pretty.js:617742-617745` | function |
| `Tu` | emitOtelEvent | `cli_inner_pretty.js:130042-130063` | function |
| `LcH` | finalizeSseUsage | `cli_inner_pretty.js:960107-960111` | function |
| `aRa` | getGrowthBookUserAttributes | `cli_inner_pretty.js:618113-618155` | function |
| `gbf` | getGrowthBookRefreshCadence | `cli_inner_pretty.js:618188-618194` | function |
| `GOy` | resolveLogRecordTraceContext | `cli_inner_pretty.js:130034-130040` | function |
| `FOy` | resolveOtelContentMaxLength | `cli_inner_pretty.js:129960-129966` | function |
| `gUb` | initializeTelemetry | `cli_inner_pretty.js:462618-462776` | function |
| `IYv` | initializeTelemetryCounters | `cli_inner_pretty.js:921837-921854` | function |
| `RcH` | newSseUsageAccumulator | `cli_inner_pretty.js:960038-960039` | function |
| `G7o` | parseExporterKinds | `cli_inner_pretty.js:462462-462469` | function |
| `$Pp` | parseUsageTranscriptLine | `cli_inner_pretty.js:473935-473973` | function |
| `sRa.processRemoteEvalPayload` | processGrowthBookRemotePayload | `cli_inner_pretty.js:617630-617688` | function |
| `sRa` | GrowthBookManager | `cli_inner_pretty.js:617500-617982` | class |
| `iN` | truncateTelemetryContent | `cli_inner_pretty.js:129968-129975` | function |
| `j7o` | wrapAgentWithContentLength | `cli_inner_pretty.js:462844-462885` | function |

## Coverage note

Authentication, credential refresh, AWS resolution, authenticated transport, permissions, MCP,
models, telemetry, the runner OAuth/API seam, Bedrock resolution, and expanded credential masking
have been re-derived for 2.1.227.
