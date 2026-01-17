# Provider Mode Authentication (Claude Code 2.1.7)

## Table of Contents

1. [Provider Detection](#provider-detection)
2. [Anthropic First-Party](#anthropic-first-party)
3. [AWS Bedrock](#aws-bedrock)
4. [Google Cloud Vertex AI](#google-cloud-vertex-ai)
5. [Azure Foundry](#azure-foundry)
6. [AWS Credential Helpers](#aws-credential-helpers)
7. [Provider Comparison](#provider-comparison)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Infrastructure platform modules

Key functions in this document:
- `XS` (createApiClient) - Client factory with provider selection
- `DQA` (getAWSCredentials) - AWS credential resolution
- `gb3` (runAwsAuthRefresh) - AWS auth refresh script
- `Yk` (isExternalProvider) - Check if using cloud provider
- `R4` (getProviderType) - Get current provider type string

---

## Provider Detection

Claude Code 2.1.7 supports multiple API providers, selected via environment variables:

### Provider Selection Logic

```javascript
// ============================================
// Provider Detection in createApiClient
// Location: chunks.82.mjs:2666-2726
// ============================================

// ORIGINAL (for source lookup):
if (a1(process.env.CLAUDE_CODE_USE_BEDROCK)) {
  let K = B === SD() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : lAA(),
    V = { ...D, awsRegion: K, ...a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && { skipAuth: !0 }, ...Sy() && { logger: B51() } };
  if (process.env.AWS_BEARER_TOKEN_BEDROCK) V.skipAuth = !0, V.defaultHeaders = { ...V.defaultHeaders, Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}` };
  else if (!a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
    let F = await DQA();
    if (F) V.awsAccessKey = F.accessKeyId, V.awsSecretKey = F.secretAccessKey, V.awsSessionToken = F.sessionToken
  }
  return new b41(V)
}
if (a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) { /* Foundry client */ }
if (a1(process.env.CLAUDE_CODE_USE_VERTEX))  { /* Vertex client */ }

// READABLE (for understanding):
async function createApiClient({ apiKey, maxRetries, model, fetchOverride }) {
  // Build common headers first
  let defaultHeaders = buildDefaultHeaders();

  // Refresh OAuth token if using Claude.ai
  await refreshOAuthTokenIfNeeded();

  // Add auth header for non-OAuth modes
  if (!isClaudeAiOAuth()) {
    addAuthorizationHeader(defaultHeaders, getTrustedContext());
  }

  // Common client configuration
  let commonConfig = {
    defaultHeaders,
    maxRetries,
    timeout: parseInt(process.env.API_TIMEOUT_MS || "600000", 10),
    dangerouslyAllowBrowser: true,
    fetchOptions: getFetchOptions()
  };

  // Provider selection based on environment variables
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    return createBedrockClient(commonConfig, model);
  }

  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    return createFoundryClient(commonConfig);
  }

  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
    return createVertexClient(commonConfig, model);
  }

  // Default: Anthropic first-party
  return createAnthropicClient(commonConfig, apiKey);
}
```

### Provider Environment Variables

| Variable | Provider | Authentication |
|----------|----------|----------------|
| (default) | Anthropic API | API Key or OAuth |
| `CLAUDE_CODE_USE_BEDROCK=1` | AWS Bedrock | AWS SigV4 |
| `CLAUDE_CODE_USE_VERTEX=1` | Google Vertex AI | Google OAuth |
| `CLAUDE_CODE_USE_FOUNDRY=1` | Azure Foundry | Azure AD Token |

### Get Provider Type

```javascript
// ============================================
// getProviderType - Get current provider type string
// Location: chunks.27.mjs:2063
// ============================================

// ORIGINAL (for source lookup):
function R4() {
  return a1(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" :
         a1(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" :
         a1(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" : "firstParty"
}

// READABLE (for understanding):
function getProviderType() {
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) return "bedrock";
  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) return "vertex";
  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) return "foundry";
  return "firstParty";
}

// Mapping: R4→getProviderType, a1→parseBoolean
```

### Check External Provider

```javascript
// ============================================
// isExternalProvider - Check if using cloud provider
// Location: chunks.48.mjs:2182-2184
// ============================================

// ORIGINAL (for source lookup):
function Yk() {
  return !!(a1(process.env.CLAUDE_CODE_USE_BEDROCK) ||
            a1(process.env.CLAUDE_CODE_USE_VERTEX) ||
            a1(process.env.CLAUDE_CODE_USE_FOUNDRY))
}

// READABLE (for understanding):
function isExternalProvider() {
  return !!(
    parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK) ||
    parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX) ||
    parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)
  );
}

// Mapping: Yk→isExternalProvider, a1→parseBoolean
```

---

## Anthropic First-Party

Default provider using direct Anthropic API.

### Client Configuration

```javascript
// ============================================
// Anthropic First-Party Client Creation
// Location: chunks.82.mjs:2727-2737
// ============================================

// ORIGINAL (for source lookup):
let W = {
  apiKey: qB() ? null : A || YL(),
  authToken: qB() ? g4()?.accessToken : void 0,
  ...{},
  ...D,
  ...Sy() && { logger: B51() }
};
return new hP(W)

// READABLE (for understanding):
let clientConfig = {
  // If OAuth: no apiKey, use authToken
  // If API key: use apiKey, no authToken
  apiKey: isClaudeAiOAuth() ? null : apiKey || getApiKey(),
  authToken: isClaudeAiOAuth() ? getClaudeAiOAuth()?.accessToken : undefined,
  ...commonConfig,
  ...isDebugMode() && { logger: getDebugLogger() }
};
return new AnthropicClient(clientConfig);

// Mapping: qB→isClaudeAiOAuth, YL→getApiKey, g4→getClaudeAiOAuth,
//          Sy→isDebugMode, B51→getDebugLogger, hP→AnthropicClient
```

### Authentication Methods

| Method | Header | When Used |
|--------|--------|-----------|
| API Key | `X-Api-Key: sk-ant-...` | `apiKey` provided |
| OAuth Token | `Authorization: Bearer eyJ...` | Claude.ai login |

---

## AWS Bedrock

### Client Configuration

```javascript
// ============================================
// Bedrock Client Creation
// Location: chunks.82.mjs:2666-2687
// ============================================

// ORIGINAL (for source lookup):
if (a1(process.env.CLAUDE_CODE_USE_BEDROCK)) {
  let K = B === SD() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    : lAA(),
    V = {
      ...D,
      awsRegion: K,
      ...a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && { skipAuth: !0 },
      ...Sy() && { logger: B51() }
    };

  if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
    V.skipAuth = !0,
    V.defaultHeaders = {
      ...V.defaultHeaders,
      Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
    }
  } else if (!a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
    let F = await DQA();
    if (F) {
      V.awsAccessKey = F.accessKeyId,
      V.awsSecretKey = F.secretAccessKey,
      V.awsSessionToken = F.sessionToken
    }
  }
  return new b41(V)
}

// READABLE (for understanding):
if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
  // Region selection: use model-specific region if configured
  let region = model === getSmallFastModel() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    : getAWSRegion();

  let bedrockConfig = {
    ...commonConfig,
    awsRegion: region,
    ...parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && { skipAuth: true },
    ...isDebugMode() && { logger: getDebugLogger() }
  };

  // Option 1: Bearer token (AWS IAM Identity Center)
  if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
    bedrockConfig.skipAuth = true;
    bedrockConfig.defaultHeaders = {
      ...bedrockConfig.defaultHeaders,
      Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
    };
  }
  // Option 2: Standard AWS credentials
  else if (!parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
    let awsCredentials = await getAWSCredentials();
    if (awsCredentials) {
      bedrockConfig.awsAccessKey = awsCredentials.accessKeyId;
      bedrockConfig.awsSecretKey = awsCredentials.secretAccessKey;
      bedrockConfig.awsSessionToken = awsCredentials.sessionToken;
    }
  }

  return new AnthropicBedrock(bedrockConfig);
}

// Mapping: a1→parseBoolean, SD→getSmallFastModel, lAA→getAWSRegion,
//          DQA→getAWSCredentials, b41→AnthropicBedrock, Sy→isDebugMode
```

### Bedrock Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_USE_BEDROCK` | Enable Bedrock mode | `false` |
| `AWS_REGION` | AWS region | - |
| `AWS_DEFAULT_REGION` | Fallback AWS region | - |
| `AWS_PROFILE` | AWS credentials profile | - |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | Region for small model | `AWS_REGION` |
| `AWS_BEARER_TOKEN_BEDROCK` | Bearer token for IAM Identity Center | - |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | Skip AWS auth (for testing) | `false` |

### Bedrock Authentication Methods

| Method | When | Configuration |
|--------|------|---------------|
| **AWS SigV4** | Default | Uses AWS credentials from environment/config |
| **Bearer Token** | IAM Identity Center | Set `AWS_BEARER_TOKEN_BEDROCK` |
| **Skip Auth** | Testing/debugging | Set `CLAUDE_CODE_SKIP_BEDROCK_AUTH=1` |

### Bedrock Application Inference Profiles

```javascript
// ============================================
// Bedrock model ID handling for inference profiles
// Location: chunks.147.mjs:10
// ============================================

// ORIGINAL (for source lookup):
let J = R4() === "bedrock" && Y.model.includes("application-inference-profile")
  ? await ieA(Y.model) ?? Y.model : Y.model;

// READABLE (for understanding):
// If using Bedrock with an inference profile, resolve the actual model ID
let effectiveModel = getProviderType() === "bedrock" &&
                     requestedModel.includes("application-inference-profile")
  ? await resolveInferenceProfile(requestedModel) ?? requestedModel
  : requestedModel;
```

---

## Google Cloud Vertex AI

### Client Configuration

```javascript
// ============================================
// Vertex AI Client Creation
// Location: chunks.82.mjs:2704-2726
// ============================================

// ORIGINAL (for source lookup):
if (a1(process.env.CLAUDE_CODE_USE_VERTEX)) {
  let K = process.env.GCLOUD_PROJECT ||
          process.env.GOOGLE_CLOUD_PROJECT ||
          process.env.gcloud_project ||
          process.env.google_cloud_project,
    V = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.google_application_credentials,
    F = a1(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)
      ? { getClient: () => ({ getRequestHeaders: () => ({}) }) }
      : new urB.GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          ...K || V ? {} : { projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID }
        }),
    H = {
      ...D,
      region: SdA(B),
      googleAuth: F,
      ...Sy() && { logger: B51() }
    };
  return new v61(H)
}

// READABLE (for understanding):
if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
  // Project ID from various environment variable formats
  let projectId = process.env.GCLOUD_PROJECT ||
                  process.env.GOOGLE_CLOUD_PROJECT ||
                  process.env.gcloud_project ||
                  process.env.google_cloud_project;

  // Service account credentials path
  let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                        process.env.google_application_credentials;

  // Create Google Auth client
  let googleAuth = parseBoolean(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)
    // Skip auth: return mock client for testing
    ? { getClient: () => ({ getRequestHeaders: () => ({}) }) }
    // Real auth: use Google Auth library
    : new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        // Only set projectId if not using default credentials
        ...projectId || credentialsPath ? {} : {
          projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID
        }
      });

  let vertexConfig = {
    ...commonConfig,
    region: getVertexRegion(model),
    googleAuth: googleAuth,
    ...isDebugMode() && { logger: getDebugLogger() }
  };

  return new AnthropicVertex(vertexConfig);
}

// Mapping: a1→parseBoolean, urB.GoogleAuth→GoogleAuth, SdA→getVertexRegion,
//          v61→AnthropicVertex, Sy→isDebugMode
```

### Vertex Environment Variables

| Variable | Purpose | Notes |
|----------|---------|-------|
| `CLAUDE_CODE_USE_VERTEX` | Enable Vertex mode | - |
| `GCLOUD_PROJECT` | GCP Project ID | Also: `GOOGLE_CLOUD_PROJECT` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account key path | - |
| `ANTHROPIC_VERTEX_PROJECT_ID` | Fallback project ID | When ADC is used |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | Skip GCP auth | For testing |

### Vertex Region Configuration

New in 2.1.7: Model-specific region environment variables:

| Variable | Model |
|----------|-------|
| `VERTEX_REGION_CLAUDE_3_5_HAIKU` | Claude 3.5 Haiku |
| `VERTEX_REGION_CLAUDE_3_5_SONNET` | Claude 3.5 Sonnet |
| `VERTEX_REGION_CLAUDE_3_7_SONNET` | Claude 3.7 Sonnet |
| `VERTEX_REGION_CLAUDE_4_0_OPUS` | Claude 4.0 Opus |
| `VERTEX_REGION_CLAUDE_4_0_SONNET` | Claude 4.0 Sonnet |
| `VERTEX_REGION_CLAUDE_4_1_OPUS` | Claude 4.1 Opus (NEW) |
| `VERTEX_REGION_CLAUDE_HAIKU_4_5` | Claude Haiku 4.5 (NEW) |

### Vertex Authentication Methods

| Method | When | Setup |
|--------|------|-------|
| **Application Default Credentials** | Default | `gcloud auth application-default login` |
| **Service Account** | CI/CD | Set `GOOGLE_APPLICATION_CREDENTIALS` |
| **Skip Auth** | Testing | Set `CLAUDE_CODE_SKIP_VERTEX_AUTH=1` |

---

## Azure Foundry

### Client Configuration

```javascript
// ============================================
// Foundry Client Creation
// Location: chunks.82.mjs:2688-2703
// ============================================

// ORIGINAL (for source lookup):
if (a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
  let K;
  if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
    if (a1(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH))
      K = () => Promise.resolve("");
    else
      K = fG0(new Q51, "https://cognitiveservices.azure.com/.default");

  let V = {
    ...D,
    ...K && { azureADTokenProvider: K },
    ...Sy() && { logger: B51() }
  };
  return new u41(V)
}

// READABLE (for understanding):
if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
  let tokenProvider;

  // If API key not provided, use Azure AD
  if (!process.env.ANTHROPIC_FOUNDRY_API_KEY) {
    if (parseBoolean(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) {
      // Skip auth: return empty token for testing
      tokenProvider = () => Promise.resolve("");
    } else {
      // Real auth: Azure AD token provider with managed identity
      tokenProvider = createAzureADTokenProvider(
        new DefaultAzureCredential(),
        "https://cognitiveservices.azure.com/.default"
      );
    }
  }

  let foundryConfig = {
    ...commonConfig,
    ...tokenProvider && { azureADTokenProvider: tokenProvider },
    ...isDebugMode() && { logger: getDebugLogger() }
  };

  return new AnthropicFoundry(foundryConfig);
}

// Mapping: a1→parseBoolean, fG0→createAzureADTokenProvider,
//          Q51→DefaultAzureCredential, u41→AnthropicFoundry
```

### Foundry Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_USE_FOUNDRY` | Enable Foundry mode |
| `ANTHROPIC_FOUNDRY_API_KEY` | Direct API key (alternative to Azure AD) |
| `CLAUDE_CODE_SKIP_FOUNDRY_AUTH` | Skip Azure auth (testing) |

### Foundry Authentication Methods

| Method | When | Configuration |
|--------|------|---------------|
| **Azure AD (Managed Identity)** | Default | Uses `DefaultAzureCredential` |
| **API Key** | Direct access | Set `ANTHROPIC_FOUNDRY_API_KEY` |
| **Skip Auth** | Testing | Set `CLAUDE_CODE_SKIP_FOUNDRY_AUTH=1` |

---

## AWS Credential Helpers

Claude Code provides helper scripts for AWS credential management.

### awsAuthRefresh

Runs a custom script to refresh AWS credentials (e.g., SSO login).

```javascript
// ============================================
// runAwsAuthRefresh - Execute AWS auth refresh script
// Location: chunks.48.mjs:1891-1919
// ============================================

// READABLE (for understanding):
async function runAwsAuthRefresh() {
  let refreshCommand = getAwsAuthRefreshCommand();
  if (!refreshCommand) return false;

  // Security: Verify workspace trust for project-scoped settings
  if (isProjectScopedSetting()) {
    if (!hasWorkspaceTrust(true) && !getTrustedContext()) {
      logWarning("awsAuthRefresh invoked before trust check");
      analyticsEvent("tengu_awsAuthRefresh_missing_trust", {});
      return false;
    }
  }

  // Check if credentials are already valid
  try {
    await getCallerIdentity();  // AWS STS call
    return false;  // Already authenticated
  } catch {
    // Credentials invalid, proceed with refresh
  }

  // Execute the refresh command
  try {
    execSync(refreshCommand);
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
}

// Mapping: gb3→runAwsAuthRefresh, hi1→getAwsAuthRefreshCommand,
//          TBB→isProjectScopedSetting, eZ→hasWorkspaceTrust
```

### awsCredentialExport

Exports AWS credentials from an external source.

```javascript
// ============================================
// runAwsCredentialExport - Get credentials from external script
// Location: chunks.48.mjs (credential export)
// ============================================

// READABLE (for understanding):
async function runAwsCredentialExport() {
  let exportCommand = getAwsCredentialExportCommand();
  if (!exportCommand) return null;

  // Security: Verify workspace trust for project-scoped settings
  if (isProjectScopedSetting()) {
    if (!hasWorkspaceTrust(true) && !getTrustedContext()) {
      logWarning("awsCredentialExport invoked before trust check");
      analyticsEvent("tengu_awsCredentialExport_missing_trust", {});
      return null;
    }
  }

  // Check if credentials already valid
  try {
    await getCallerIdentity();
    return null;  // Already have valid credentials
  } catch {
    // Need to export credentials
  }

  // Execute export command and parse output
  try {
    let output = execSync(exportCommand)?.toString().trim();
    let parsed = JSON.parse(output);

    // Validate AWS STS GetSessionToken format
    if (!isValidAWSCredentialFormat(parsed)) {
      throw Error("awsCredentialExport did not return valid AWS STS output structure");
    }

    return {
      accessKeyId: parsed.Credentials.AccessKeyId,
      secretAccessKey: parsed.Credentials.SecretAccessKey,
      sessionToken: parsed.Credentials.SessionToken
    };
  } catch (error) {
    logError(error);
    return null;
  }
}

// Mapping: gi1→getAwsCredentialExportCommand, PBB→isProjectScopedSetting
```

### Configuration

```json
// ~/.claude.json
{
  "awsAuthRefresh": "/path/to/aws-sso-login.sh",
  "awsCredentialExport": "/path/to/get-aws-credentials.sh"
}
```

### Expected Output Format (awsCredentialExport)

```json
{
  "Credentials": {
    "AccessKeyId": "AKIA...",
    "SecretAccessKey": "...",
    "SessionToken": "..."
  }
}
```

This matches the AWS STS GetSessionToken response format.

### Bedrock Auth Prefetch

```javascript
// ============================================
// Bedrock auth prefetch on startup
// Location: chunks.156.mjs:1747
// ============================================

// ORIGINAL (for source lookup):
if (a1(process.env.CLAUDE_CODE_USE_BEDROCK) && !a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH))
  xBB();

// READABLE (for understanding):
// On startup, if using Bedrock, prefetch AWS credentials
if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK) &&
    !parseBoolean(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
  prefetchBedrockAuth();
}
```

---

## Provider Comparison

| Provider | Auth Method | Region Config | Model Support | Streaming |
|----------|-------------|---------------|---------------|-----------|
| **Anthropic** | API Key / OAuth | N/A | All models | Yes |
| **Bedrock** | AWS SigV4 | `AWS_REGION` + model-specific | Bedrock-enabled | Yes |
| **Vertex** | Google OAuth | Model-specific regions | Vertex-enabled | Yes |
| **Foundry** | Azure AD | N/A | Foundry-enabled | Yes |

### Feature Support by Provider

| Feature | Anthropic | Bedrock | Vertex | Foundry |
|---------|-----------|---------|--------|---------|
| OAuth Login | Yes | No | No | No |
| Subscription Tiers | Yes | N/A | N/A | N/A |
| Rate Limit Tiers | Yes | AWS quota | GCP quota | Azure quota |
| Token Refresh | Yes (OAuth) | AWS STS | google-auth | Azure AD |
| Custom Headers | Yes | Yes | Yes | Yes |
| Streaming | Yes | Yes | Yes | Yes |

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [api_key_auth.md](./api_key_auth.md) - API key authentication
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 flow
- [model_switching.md](./model_switching.md) - Model selection and switching
