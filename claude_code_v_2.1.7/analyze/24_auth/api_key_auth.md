# API Key Authentication (Claude Code 2.1.7)

## Table of Contents

1. [API Key Sources](#api-key-sources)
2. [API Key Validation](#api-key-validation)
3. [apiKeyHelper Script](#apikeyhelper-script)
4. [Keychain Storage](#keychain-storage)
5. [Environment Variable Approval](#environment-variable-approval)
6. [File Descriptor Injection](#file-descriptor-injection)
7. [Security Considerations](#security-considerations)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Infrastructure platform modules

Key functions in this document:
- `Oz` (getApiKeyAndSource) - Main API key resolution
- `YL` (getApiKey) - Get API key only
- `mOA` (executeApiKeyHelper) - Execute apiKeyHelper script
- `uOA` (hasApiKeyHelper) - Check if apiKeyHelper configured
- `dOA` (getKeychainKey) - Get key from keychain
- `iA1` (getApiKeyStatus) - Check approval status

---

## API Key Sources

### Priority Chain

Claude Code supports multiple API key sources with this priority:

| Priority | Source | Environment/Config | Notes |
|----------|--------|-------------------|-------|
| 1 | SDK Mode | `ANTHROPIC_API_KEY` + SDK mode | Direct use without prompts |
| 2 | File Descriptor | `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR` | Secure injection |
| 3 | Environment (approved) | `ANTHROPIC_API_KEY` | Requires user approval |
| 4 | apiKeyHelper | `~/.claude.json` setting | Script execution |
| 5 | Keychain | macOS Keychain / `.credentials.json` | Stored credentials |

### API Key Format

```
sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

- Prefix: `sk-ant-api03-`
- Length: ~52+ characters
- Base64-encoded content

---

## API Key Validation

### Masking for Storage

```javascript
// ============================================
// maskApiKey - Create hash for approval tracking
// Location: chunks.48.mjs (TL function)
// ============================================

// READABLE (for understanding):
function maskApiKey(apiKey) {
  // Create SHA-256 hash of the key for comparison
  // This allows checking approval without storing the full key
  const hash = crypto.createHash('sha256')
    .update(apiKey)
    .digest('hex');
  return hash.substring(0, 16);  // Use first 16 chars
}

// Mapping: TL→maskApiKey
```

### Approval Status Check

```javascript
// ============================================
// getApiKeyStatus - Check if API key is approved/rejected
// Location: chunks.48.mjs:2894-2898
// ============================================

// ORIGINAL (for source lookup):
function iA1(A) {
  let Q = L1();
  if (Q.customApiKeyResponses?.approved?.includes(A)) return "approved";
  if (Q.customApiKeyResponses?.rejected?.includes(A)) return "rejected";
  return "new"
}

// READABLE (for understanding):
function getApiKeyStatus(maskedApiKey) {
  let config = getConfig();

  // Check if key was previously approved
  if (config.customApiKeyResponses?.approved?.includes(maskedApiKey)) {
    return "approved";
  }

  // Check if key was previously rejected
  if (config.customApiKeyResponses?.rejected?.includes(maskedApiKey)) {
    return "rejected";
  }

  // Key not seen before
  return "new";
}

// Mapping: iA1→getApiKeyStatus, L1→getConfig
```

---

## apiKeyHelper Script

### Configuration

```json
// ~/.claude.json or project .claude/settings.json
{
  "apiKeyHelper": "/path/to/your/api-key-script.sh"
}
```

### Check apiKeyHelper Availability

```javascript
// ============================================
// hasApiKeyHelper - Check if apiKeyHelper is configured
// Location: chunks.48.mjs:1830-1832
// ============================================

// ORIGINAL (for source lookup):
function uOA() {
  return (jQ() || {}).apiKeyHelper
}

// READABLE (for understanding):
function hasApiKeyHelper() {
  return (getSettings() || {}).apiKeyHelper;
}

// Mapping: uOA→hasApiKeyHelper, jQ→getSettings
```

### Execute apiKeyHelper

```javascript
// ============================================
// executeApiKeyHelper - Run apiKeyHelper script
// Location: chunks.48.mjs:2300-2320
// ============================================

// ORIGINAL (for source lookup):
function mOA(A) {
  let Q = TZ();  // Get apiKeyHelper path
  if (!Q) return null;

  // Check for project-scoped setting
  if (jBB()) {
    if (!eZ(!0) && !A) {
      let G = Error(`Security: apiKeyHelper executed before workspace trust is confirmed...`);
      xM("apiKeyHelper invoked before trust check", G);
      MBB.captureException(G);
      l("tengu_apiKeyHelper_missing_trust11", {});
    }
  }

  try {
    let B = NH(Q)?.toString().trim();
    if (!B) throw Error("apiKeyHelper did not return a valid value");
    return B;
  } catch (B) {
    let G = I1.red("Error getting API key from apiKeyHelper:");
    if (B instanceof Error && "stderr" in B) {
      console.error(G, String(B.stderr));
    } else if (B instanceof Error) {
      console.error(G, B.message);
    }
    return null;
  }
}

// READABLE (for understanding):
function executeApiKeyHelper(trustedContext) {
  let helperPath = getApiKeyHelperPath();
  if (!helperPath) return null;

  // Security: Verify workspace trust for project-scoped settings
  if (isProjectScopedSetting()) {
    if (!hasWorkspaceTrust(true) && !trustedContext) {
      let error = Error("Security: apiKeyHelper executed before workspace trust confirmed");
      logWarning("apiKeyHelper invoked before trust check", error);
      Sentry.captureException(error);
      analyticsEvent("tengu_apiKeyHelper_missing_trust11", {});
    }
  }

  try {
    let output = execSync(helperPath)?.toString().trim();
    if (!output) {
      throw Error("apiKeyHelper did not return a valid value");
    }
    return output;  // The API key
  } catch (error) {
    let errorMsg = chalk.red("Error getting API key from apiKeyHelper:");
    if (error instanceof Error && "stderr" in error) {
      console.error(errorMsg, String(error.stderr));
    } else if (error instanceof Error) {
      console.error(errorMsg, error.message);
    }
    return null;
  }
}

// Mapping: mOA→executeApiKeyHelper, TZ→getApiKeyHelperPath, jBB→isProjectScopedSetting,
//          eZ→hasWorkspaceTrust, NH→execSync, xM→logWarning, MBB→Sentry
```

### apiKeyHelper TTL

```javascript
// Environment variable for caching API key helper results
// CLAUDE_CODE_API_KEY_HELPER_TTL_MS (default: 300000ms = 5 minutes)
```

---

## Keychain Storage

### macOS Keychain Integration

```javascript
// ============================================
// Keychain storage on macOS
// Location: chunks.48.mjs (keychain functions)
// ============================================

// READABLE (for understanding):
function getKeychainKey() {
  if (process.platform !== "darwin") {
    // Non-macOS: fall back to file-based storage
    return getFileCredentials();
  }

  try {
    // Read from macOS Keychain using `security` command
    let result = execSync(
      'security find-generic-password -s "claude-code" -w',
      { encoding: 'utf8' }
    ).trim();

    // Keychain stores hex-encoded JSON
    let decoded = Buffer.from(result, 'hex').toString('utf8');
    let credentials = JSON.parse(decoded);

    return {
      key: credentials.apiKey,
      source: "keychain"
    };
  } catch {
    return null;
  }
}

// Mapping: dOA→getKeychainKey
```

### File-Based Credentials

```javascript
// Fallback: ~/.claude/.credentials.json
{
  "apiKey": "sk-ant-api03-...",
  "savedAt": 1706025600000
}
```

---

## Environment Variable Approval

### Approval Flow

When `ANTHROPIC_API_KEY` is set, Claude Code prompts for approval:

```
┌─────────────────────────────────────────────────────────────────┐
│  Environment Variable API Key Detected                          │
│                                                                 │
│  ANTHROPIC_API_KEY=sk-ant-api03-****                            │
│                                                                 │
│  Do you want to use this API key?                               │
│  [Y] Yes, use it                                                │
│  [N] No, reject it                                              │
│  [A] Always use keys matching this hash                         │
└─────────────────────────────────────────────────────────────────┘
```

### Approval Storage

```javascript
// ============================================
// Save API key approval
// Location: chunks.48.mjs:2004-2015
// ============================================

// ORIGINAL (for source lookup):
function approveApiKey(A, Q) {
  let B = TL(A);  // Mask the key
  S0((G) => {
    let Z = G.customApiKeyResponses?.approved ?? [];
    return {
      ...G,
      primaryApiKey: Q ? G.primaryApiKey : A,
      customApiKeyResponses: {
        ...G.customApiKeyResponses,
        approved: Z.includes(B) ? Z : [...Z, B],
        rejected: G.customApiKeyResponses?.rejected ?? []
      }
    }
  });
}

// READABLE (for understanding):
function approveApiKey(apiKey, keepPrimary) {
  let maskedKey = maskApiKey(apiKey);
  updateConfig((config) => {
    let approvedList = config.customApiKeyResponses?.approved ?? [];
    return {
      ...config,
      primaryApiKey: keepPrimary ? config.primaryApiKey : apiKey,
      customApiKeyResponses: {
        ...config.customApiKeyResponses,
        approved: approvedList.includes(maskedKey)
          ? approvedList
          : [...approvedList, maskedKey],
        rejected: config.customApiKeyResponses?.rejected ?? []
      }
    };
  });
}

// Mapping: S0→updateConfig, TL→maskApiKey
```

### Config Structure

```json
// ~/.claude/settings.json
{
  "customApiKeyResponses": {
    "approved": ["a1b2c3d4e5f6g7h8", "..."],
    "rejected": ["i9j0k1l2m3n4o5p6"]
  },
  "primaryApiKey": "sk-ant-api03-..."
}
```

---

## File Descriptor Injection

### Secure Secret Injection

For hosted/containerized environments, API keys can be injected via file descriptors:

```javascript
// ============================================
// Read API key from file descriptor
// Location: chunks.48.mjs (aT1 function)
// ============================================

// READABLE (for understanding):
function readApiKeyFromFileDescriptor() {
  let fd = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
  if (!fd) return null;

  // Platform-specific paths
  let fdPath;
  switch (process.platform) {
    case "darwin":
    case "freebsd":
      fdPath = `/dev/fd/${fd}`;
      break;
    case "linux":
      fdPath = `/proc/self/fd/${fd}`;
      break;
    default:
      return null;
  }

  try {
    return fs.readFileSync(fdPath, 'utf8').trim();
  } catch {
    return null;
  }
}

// Mapping: aT1→readApiKeyFromFileDescriptor
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR` | FD number for API key |
| `CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR` | FD number for OAuth token |

---

## Security Considerations

### API Key Protection

1. **Never logged**: API keys are never written to logs
2. **Masked in config**: Only hash stored for approval tracking
3. **Keychain on macOS**: Uses secure system keychain
4. **File permissions**: Credential files require 600 permissions

### Workspace Trust

For project-scoped `apiKeyHelper`:

```javascript
// Security check before executing apiKeyHelper
if (isProjectScopedSetting()) {
  if (!hasWorkspaceTrust(true) && !trustedContext) {
    // Refuse to execute untrusted script
    logWarning("apiKeyHelper invoked before trust check");
    return null;
  }
}
```

### Environment Variable Risks

- **ANTHROPIC_API_KEY**: Requires user approval
- **SDK mode**: Bypasses approval (trusted environment)
- **Hosted mode**: Requires explicit auth

### Best Practices

| Method | Security Level | Use Case |
|--------|---------------|----------|
| File Descriptor | Highest | Containerized/hosted |
| apiKeyHelper | High | Enterprise with secrets manager |
| Keychain | High | Personal macOS |
| Environment (approved) | Medium | Development |
| File credentials | Lower | Fallback only |

---

## Integration with Other Auth Methods

### Priority When Multiple Available

```javascript
// In getApiKeyAndSource (Oz):
// 1. SDK mode + env var → Use directly
// 2. File descriptor → Highest priority in normal mode
// 3. Approved env var → If user approved hash
// 4. apiKeyHelper → If configured and trusted
// 5. Keychain → Stored credentials
// 6. OAuth → Fall back to Claude.ai login
```

### Coexistence with OAuth

API key takes precedence over OAuth:
- If API key is available, it's used
- OAuth is only used when no API key source is available
- External providers (Bedrock/Vertex/Foundry) use their own auth

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 flow
- [token_refresh.md](./token_refresh.md) - Token refresh mechanism
- [provider_modes.md](./provider_modes.md) - Provider authentication
