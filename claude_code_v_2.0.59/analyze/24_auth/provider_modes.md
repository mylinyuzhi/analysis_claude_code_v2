# Provider Mode Authentication

## Table of Contents

1. [Provider Detection](#provider-detection)
2. [Anthropic First-Party](#anthropic-first-party)
3. [AWS Bedrock](#aws-bedrock)
4. [Google Cloud Vertex AI](#google-cloud-vertex-ai)
5. [Azure Foundry](#azure-foundry)
6. [AWS Credential Helpers](#aws-credential-helpers)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `Kq` (createApiClient) - Client factory with provider selection
- `h3A` (getAWSCredentials) - AWS credential resolution
- `yr8` (runAwsAuthRefresh) - AWS auth refresh script
- `xr8` (runAwsCredentialExport) - AWS credential export script
- `N_` (isExternalProvider) - Check if using cloud provider

---

## Provider Detection

Claude Code supports multiple API providers, selected via environment variables:

### Provider Selection Logic

```javascript
// ============================================
// Provider Detection in createApiClient
// Location: chunks.88.mjs:34-93
// ============================================

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

  // Provider selection based on environment variables
  if (parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    return createBedrockClient({ defaultHeaders, model, maxRetries });
  }

  if (parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    return createFoundryClient({ defaultHeaders, maxRetries });
  }

  if (parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX)) {
    return createVertexClient({ defaultHeaders, model, maxRetries });
  }

  // Default: Anthropic first-party
  return createAnthropicClient({
    defaultHeaders,
    apiKey,
    maxRetries
  });
}
```

### Provider Environment Variables

| Variable | Provider | Authentication |
|----------|----------|----------------|
| (default) | Anthropic API | API Key or OAuth |
| `CLAUDE_CODE_USE_BEDROCK=1` | AWS Bedrock | AWS SigV4 |
| `CLAUDE_CODE_USE_VERTEX=1` | Google Vertex AI | Google OAuth |
| `CLAUDE_CODE_USE_FOUNDRY=1` | Azure Foundry | Azure AD Token |

### Check External Provider

```javascript
// ============================================
// isExternalProvider - Check if using cloud provider
// Location: chunks.56.mjs:2102-2104
// ============================================

// ORIGINAL (for source lookup):
function N_() {
  return !!(Y0(process.env.CLAUDE_CODE_USE_BEDROCK) ||
            Y0(process.env.CLAUDE_CODE_USE_VERTEX) ||
            Y0(process.env.CLAUDE_CODE_USE_FOUNDRY))
}

// READABLE (for understanding):
function isExternalProvider() {
  return !!(
    parseBoolean(process.env.CLAUDE_CODE_USE_BEDROCK) ||
    parseBoolean(process.env.CLAUDE_CODE_USE_VERTEX) ||
    parseBoolean(process.env.CLAUDE_CODE_USE_FOUNDRY)
  );
}

// Mapping: N_→isExternalProvider, Y0→parseBoolean
```

---

## Anthropic First-Party

Default provider using direct Anthropic API.

### Client Configuration

```javascript
// ============================================
// Anthropic First-Party Client Creation
// Location: chunks.88.mjs:95-104
// ============================================

// ORIGINAL (for source lookup):
let X = {
  apiKey: BB() ? null : A || Kw(),
  authToken: BB() ? M6()?.accessToken : void 0,
  ...{},
  ...W,
  ...gj() && { logger: a11() }
};
return new MT(X)

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

// Mapping: BB→isClaudeAiOAuth, Kw→getApiKey, M6→getClaudeAiOAuth,
//          gj→isDebugMode, a11→getDebugLogger, MT→AnthropicClient
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
// Location: chunks.88.mjs:34-54
// ============================================

// ORIGINAL (for source lookup):
if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK)) {
  let V = B === MW() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION
    : hBA(),
    F = {
      ...W,
      awsRegion: V,
      ...Y0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && { skipAuth: !0 },
      ...gj() && { logger: a11() }
    };

  if (process.env.AWS_BEARER_TOKEN_BEDROCK) {
    F.skipAuth = !0,
    F.defaultHeaders = {
      ...F.defaultHeaders,
      Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
    }
  } else if (!Y0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
    let K = await h3A();
    if (K) {
      F.awsAccessKey = K.accessKeyId,
      F.awsSecretKey = K.secretAccessKey,
      F.awsSessionToken = K.sessionToken
    }
  }
  return new utA(F)
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

// Mapping: Y0→parseBoolean, MW→getSmallFastModel, hBA→getAWSRegion,
//          h3A→getAWSCredentials, utA→AnthropicBedrock, gj→isDebugMode
```

### Bedrock Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_USE_BEDROCK` | Enable Bedrock mode | `false` |
| `AWS_REGION` | AWS region | - |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | Region for small model | `AWS_REGION` |
| `AWS_BEARER_TOKEN_BEDROCK` | Bearer token for IAM Identity Center | - |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | Skip AWS auth (for testing) | `false` |

### Bedrock Authentication Methods

| Method | When | Configuration |
|--------|------|---------------|
| **AWS SigV4** | Default | Uses AWS credentials from environment/config |
| **Bearer Token** | IAM Identity Center | Set `AWS_BEARER_TOKEN_BEDROCK` |
| **Skip Auth** | Testing/debugging | Set `CLAUDE_CODE_SKIP_BEDROCK_AUTH=1` |

---

## Google Cloud Vertex AI

### Client Configuration

```javascript
// ============================================
// Vertex AI Client Creation
// Location: chunks.88.mjs:72-93
// ============================================

// ORIGINAL (for source lookup):
if (Y0(process.env.CLAUDE_CODE_USE_VERTEX)) {
  let V = process.env.GCLOUD_PROJECT ||
          process.env.GOOGLE_CLOUD_PROJECT ||
          process.env.gcloud_project ||
          process.env.google_cloud_project,
    F = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.google_application_credentials,
    K = Y0(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)
      ? { getClient: () => ({ getRequestHeaders: () => ({}) }) }
      : new zeB.GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          ...V || F ? {} : { projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID }
        }),
    D = {
      ...W,
      region: k_A(B),
      googleAuth: K,
      ...gj() && { logger: a11() }
    };
  return new beA(D)
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

// Mapping: Y0→parseBoolean, zeB.GoogleAuth→GoogleAuth, k_A→getVertexRegion,
//          beA→AnthropicVertex, gj→isDebugMode
```

### Vertex Environment Variables

| Variable | Purpose | Notes |
|----------|---------|-------|
| `CLAUDE_CODE_USE_VERTEX` | Enable Vertex mode | - |
| `GCLOUD_PROJECT` | GCP Project ID | Also: `GOOGLE_CLOUD_PROJECT` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account key path | - |
| `ANTHROPIC_VERTEX_PROJECT_ID` | Fallback project ID | When ADC is used |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | Skip GCP auth | For testing |

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
// Location: chunks.88.mjs:56-70
// ============================================

// ORIGINAL (for source lookup):
if (Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
  let V;
  if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
    if (Y0(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH))
      V = () => Promise.resolve("");
    else
      V = or1(new n11, "https://cognitiveservices.azure.com/.default");

  let F = {
    ...W,
    ...V && { azureADTokenProvider: V },
    ...gj() && { logger: a11() }
  };
  return new ptA(F)
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

// Mapping: Y0→parseBoolean, or1→createAzureADTokenProvider,
//          n11→DefaultAzureCredential, ptA→AnthropicFoundry
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
// Location: chunks.56.mjs:1845-1859
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

// Mapping: yr8→runAwsAuthRefresh, gv1→getAwsAuthRefreshCommand,
//          m4B→isProjectScopedSetting, TJ→hasWorkspaceTrust
```

### awsCredentialExport

Exports AWS credentials from an external source.

```javascript
// ============================================
// runAwsCredentialExport - Get credentials from external script
// Location: chunks.56.mjs:1886-1917
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

// Mapping: xr8→runAwsCredentialExport, uv1→getAwsCredentialExportCommand
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

---

## Provider Comparison

| Provider | Auth Method | Region Config | Use Case |
|----------|-------------|---------------|----------|
| **Anthropic** | API Key / OAuth | N/A | Default, subscription users |
| **Bedrock** | AWS SigV4 | `AWS_REGION` | AWS-native deployments |
| **Vertex** | Google OAuth | Model-specific | GCP-native deployments |
| **Foundry** | Azure AD | N/A | Azure-native deployments |

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [api_key_auth.md](./api_key_auth.md) - API key authentication
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 flow
- [request_headers.md](./request_headers.md) - HTTP header construction
