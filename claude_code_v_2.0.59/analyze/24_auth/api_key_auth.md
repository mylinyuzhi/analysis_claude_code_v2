# API Key Authentication

## Table of Contents

1. [API Key Sources](#api-key-sources)
2. [Environment Variable Authentication](#environment-variable-authentication)
3. [File Descriptor Authentication](#file-descriptor-authentication)
4. [macOS Keychain Integration](#macos-keychain-integration)
5. [apiKeyHelper Script](#apikeyhelper-script)
6. [Config File Storage](#config-file-storage)
7. [API Key Masking](#api-key-masking)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `cw` (getApiKeyAndSource) - Main key resolution
- `rz1` (readApiKeyFromFileDescriptor) - File descriptor-based key reading
- `$o0` (keychainStorage) - macOS Keychain operations
- `az1` (plaintextStorage) - Fallback file storage
- `fzA` (executeApiKeyHelper) - apiKeyHelper script execution
- `dw` (maskApiKey) - API key masking for display

---

## API Key Sources

Claude Code supports multiple API key sources, prioritized for security and flexibility:

| Priority | Source | Environment Variable | Use Case |
|----------|--------|---------------------|----------|
| 1 | Direct env var | `ANTHROPIC_API_KEY` | SDK mode, CI/CD |
| 2 | File descriptor | `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR` | Secure secret injection |
| 3 | apiKeyHelper script | Configured in settings | Enterprise credential mgmt |
| 4 | macOS Keychain | N/A | Interactive use (darwin) |
| 5 | Config file | `~/.claude.json` | Fallback storage |

---

## Environment Variable Authentication

### Primary: `ANTHROPIC_API_KEY`

The most common authentication method, especially for CI/CD and SDK integrations.

```javascript
// ============================================
// Environment API Key Check (in getApiKeyAndSource)
// Location: chunks.56.mjs:1735-1738
// ============================================

// ORIGINAL (for source lookup):
if (Gz0() && process.env.ANTHROPIC_API_KEY) return {
  key: process.env.ANTHROPIC_API_KEY,
  source: "ANTHROPIC_API_KEY"
};

// READABLE (for understanding):
// In SDK mode, ANTHROPIC_API_KEY is used directly without user approval
if (isSDKMode() && process.env.ANTHROPIC_API_KEY) {
  return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
}

// Mapping: Gz0→isSDKMode
```

### User Approval Check

For non-SDK mode, API keys from environment require user approval:

```javascript
// ============================================
// API Key Approval Check
// Location: chunks.56.mjs:1755-1758
// ============================================

// ORIGINAL (for source lookup):
if (process.env.ANTHROPIC_API_KEY &&
    N1().customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY)))
  return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };

// READABLE (for understanding):
// Check if the API key (masked) is in the user's approved list
if (process.env.ANTHROPIC_API_KEY &&
    getConfig().customApiKeyResponses?.approved?.includes(maskApiKey(process.env.ANTHROPIC_API_KEY))) {
  return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
}

// Mapping: N1→getConfig, dw→maskApiKey
```

**Key Insight**: The approval system stores the last 20 characters of the API key hash, preventing unauthorized use of API keys from untrusted environments.

---

## File Descriptor Authentication

Secure method for passing secrets without exposing them in environment variables or logs.

### Algorithm: `rz1()` (readApiKeyFromFileDescriptor)

```javascript
// ============================================
// readApiKeyFromFileDescriptor - Secure key injection via file descriptor
// Location: chunks.24.mjs:1474-1498
// ============================================

// ORIGINAL (for source lookup):
function rz1() {
  let A = rE0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
  if (!Q) return V2A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return g(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), V2A(null), null;
  try {
    let G = RA(),
      Z = process.platform === "darwin" || process.platform === "freebsd"
        ? `/dev/fd/${B}`
        : `/proc/self/fd/${B}`,
      I = G.readFileSync(Z, { encoding: "utf8" }).trim();
    if (!I) return g("File descriptor contained empty API key", { level: "error" }), V2A(null), null;
    return g(`Successfully read API key from file descriptor ${B}`), V2A(I), I
  } catch (G) {
    return g(`Failed to read API key from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), V2A(null), null
  }
}

// READABLE (for understanding):
function readApiKeyFromFileDescriptor() {
  // Check cache first (memoization)
  let cachedValue = getCachedApiKeyFromFd();
  if (cachedValue !== undefined) return cachedValue;

  // Get file descriptor number from env
  let fdEnvVar = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
  if (!fdEnvVar) return setCachedValue(null), null;

  let fdNumber = parseInt(fdEnvVar, 10);
  if (Number.isNaN(fdNumber)) {
    log(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${fdEnvVar}`, {
      level: "error"
    });
    return setCachedValue(null), null;
  }

  try {
    let fs = getFs();
    // Platform-specific file descriptor path
    let fdPath = process.platform === "darwin" || process.platform === "freebsd"
      ? `/dev/fd/${fdNumber}`      // BSD-style
      : `/proc/self/fd/${fdNumber}`; // Linux-style

    let apiKey = fs.readFileSync(fdPath, { encoding: "utf8" }).trim();

    if (!apiKey) {
      log("File descriptor contained empty API key", { level: "error" });
      return setCachedValue(null), null;
    }

    log(`Successfully read API key from file descriptor ${fdNumber}`);
    return setCachedValue(apiKey), apiKey;
  } catch (error) {
    log(`Failed to read API key from file descriptor ${fdNumber}: ${error.message}`, {
      level: "error"
    });
    return setCachedValue(null), null;
  }
}

// Mapping: rz1→readApiKeyFromFileDescriptor, rE0→getCachedApiKeyFromFd, V2A→setCachedValue,
//          Q→fdEnvVar, B→fdNumber, G→fs, Z→fdPath, I→apiKey, RA→getFs, g→log
```

### Why File Descriptors?

**Design Rationale:**
1. **Secrets never appear in environment listings**: `ps aux` won't expose the API key
2. **Prevents accidental logging**: No risk of API key appearing in logs
3. **Secure passing through process boundaries**: Parent can pass secret to child via fd
4. **Container-friendly**: Works well with Kubernetes secrets and Docker secrets

### Usage Example

```bash
# Create a file descriptor with the API key
exec 3<<< "sk-ant-api03-your-key-here"
CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR=3 claude
```

---

## macOS Keychain Integration

On macOS, Claude Code prefers storing credentials in the system Keychain for security.

### Keychain Storage Object: `$o0` (keychainStorage)

```javascript
// ============================================
// keychainStorage - macOS Keychain CRUD operations
// Location: chunks.24.mjs:1325-1371
// ============================================

// ORIGINAL (for source lookup):
$o0 = {
  name: "keychain",
  read() {
    try {
      let A = em("-credentials"),
        Q = SDA(),
        B = tG(`security find-generic-password -a "${Q}" -w -s "${A}"`);
      if (B) return JSON.parse(B)
    } catch (A) {
      return null
    }
    return null
  },
  update(A) {
    try {
      let Q = em("-credentials"),
        B = SDA(),
        G = JSON.stringify(A),
        Z = Buffer.from(G, "utf-8").toString("hex"),
        I = `add-generic-password -U -a "${B}" -s "${Q}" -X "${Z}"\n`;
      if (I9A("security", ["-i"], {
          input: I,
          stdio: ["pipe", "pipe", "pipe"],
          reject: !1
        }).exitCode !== 0) return { success: !1 };
      return { success: !0 }
    } catch (Q) {
      return { success: !1 }
    }
  },
  delete() {
    try {
      let A = em("-credentials"),
        Q = SDA();
      return tG(`security delete-generic-password -a "${Q}" -s "${A}"`), !0
    } catch (A) {
      return !1
    }
  }
}

// READABLE (for understanding):
keychainStorage = {
  name: "keychain",

  read() {
    try {
      let serviceName = getServiceName("-credentials");
      let accountName = getCurrentUsername();
      let result = execSync(`security find-generic-password -a "${accountName}" -w -s "${serviceName}"`);
      if (result) return JSON.parse(result);
    } catch (error) {
      return null;
    }
    return null;
  },

  update(credentials) {
    try {
      let serviceName = getServiceName("-credentials");
      let accountName = getCurrentUsername();
      let jsonData = JSON.stringify(credentials);
      // Encode as hex to avoid shell escaping issues
      let hexData = Buffer.from(jsonData, "utf-8").toString("hex");
      let command = `add-generic-password -U -a "${accountName}" -s "${serviceName}" -X "${hexData}"\n`;

      if (execCommand("security", ["-i"], {
          input: command,
          stdio: ["pipe", "pipe", "pipe"],
          reject: false
        }).exitCode !== 0) {
        return { success: false };
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  delete() {
    try {
      let serviceName = getServiceName("-credentials");
      let accountName = getCurrentUsername();
      execSync(`security delete-generic-password -a "${accountName}" -s "${serviceName}"`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Mapping: $o0→keychainStorage, em→getServiceName, SDA→getCurrentUsername,
//          tG→execSync, I9A→execCommand
```

### Keychain Lock Detection

```javascript
// ============================================
// isKeychainLocked - Check if Keychain is locked
// Location: chunks.24.mjs:1306-1316
// ============================================

// ORIGINAL (for source lookup):
function wo0() {
  if (process.platform !== "darwin") return !1;
  try {
    return I9A("security", ["show-keychain-info"], {
      reject: !1,
      stdio: ["ignore", "pipe", "pipe"]
    }).exitCode === 36
  } catch {
    return !1
  }
}

// READABLE (for understanding):
function isKeychainLocked() {
  if (process.platform !== "darwin") return false;
  try {
    // Exit code 36 means keychain is locked
    return execCommand("security", ["show-keychain-info"], {
      reject: false,
      stdio: ["ignore", "pipe", "pipe"]
    }).exitCode === 36;
  } catch {
    return false;
  }
}

// Mapping: wo0→isKeychainLocked, I9A→execCommand
```

**Key Insight**: Credentials are stored as hex-encoded JSON to avoid shell escaping issues with special characters.

---

## apiKeyHelper Script

Enterprise feature for custom credential retrieval logic.

### Configuration

```json
// ~/.claude.json or project settings
{
  "apiKeyHelper": "/path/to/script.sh"
}
```

### Execution with Trust Verification

```javascript
// ============================================
// executeApiKeyHelper - Run apiKeyHelper with trust check
// Location: chunks.56.mjs (memoized function fzA)
// ============================================

// READABLE (for understanding):
let executeApiKeyHelper = memoizeWithTTL((trustedContext) => {
  let apiKeyHelperPath = getApiKeyHelper();
  if (!apiKeyHelperPath) return null;

  // Security: Verify workspace trust for project-scoped settings
  if (isProjectScopedSetting()) {
    if (!hasWorkspaceTrust(true) && !trustedContext) {
      let error = Error(`Security: apiKeyHelper executed before workspace trust is confirmed...`);
      logWarning("apiKeyHelper invoked before trust check", error);
      analyticsEvent("tengu_apiKeyHelper_missing_trust7", {});
      return;
    }
  }

  try {
    let result = execSync(apiKeyHelperPath)?.toString().trim();
    if (!result) throw Error("apiKeyHelper did not return a valid value");
    return result;
  } catch (error) {
    let errorMsg = colorize.red("Error getting API key from apiKeyHelper...");
    if (error instanceof Error && "stderr" in error) {
      console.error(errorMsg, String(error.stderr));
    } else if (error instanceof Error) {
      console.error(errorMsg, error.message);
    } else {
      console.error(errorMsg, error);
    }
    return "";  // Return empty on error
  }
}, getApiKeyHelperTTL());

// Mapping: fzA→executeApiKeyHelper, bzA→getApiKeyHelper, u4B→isProjectScopedSetting,
//          TJ→hasWorkspaceTrust, _r8→getApiKeyHelperTTL
```

### TTL Configuration

```javascript
// ============================================
// getApiKeyHelperTTL - Get cache TTL for apiKeyHelper results
// Location: chunks.56.mjs:1820-1830
// ============================================

// ORIGINAL (for source lookup):
function _r8() {
  let A = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!Number.isNaN(Q) && Q >= 0) return Q;
    g(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${A}`, {
      level: "error"
    })
  }
  return Sr8  // Default TTL constant
}

// READABLE (for understanding):
function getApiKeyHelperTTL() {
  let ttlEnv = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
  if (ttlEnv) {
    let ttlMs = parseInt(ttlEnv, 10);
    if (!Number.isNaN(ttlMs) && ttlMs >= 0) return ttlMs;
    log(`Invalid CLAUDE_CODE_API_KEY_HELPER_TTL_MS: ${ttlEnv}`, { level: "error" });
  }
  return DEFAULT_API_KEY_HELPER_TTL;  // Default value
}

// Mapping: _r8→getApiKeyHelperTTL, Sr8→DEFAULT_API_KEY_HELPER_TTL
```

### Security Model

| Scope | Trust Requirement |
|-------|------------------|
| User-level (`~/.claude.json`) | Trusted implicitly |
| Project-level (`.claude/settings.json`) | Requires workspace trust |

**Why this design?**
- Prevents malicious repositories from stealing credentials via apiKeyHelper
- User explicitly approves project-scoped scripts before execution

---

## Config File Storage

### Plaintext Storage: `az1` (plaintextStorage)

Fallback storage when Keychain is unavailable (non-macOS or locked Keychain).

```javascript
// ============================================
// plaintextStorage - Fallback file-based storage
// Location: chunks.24.mjs:1388-1436
// ============================================

// ORIGINAL (for source lookup):
az1 = {
  name: "plaintext",
  read() {
    let { storagePath: A } = nz1();
    if (RA().existsSync(A)) try {
      let Q = RA().readFileSync(A, { encoding: "utf8" });
      return JSON.parse(Q)
    } catch (Q) {
      return null
    }
    return null
  },
  update(A) {
    try {
      let { storageDir: Q, storagePath: B } = nz1();
      if (!RA().existsSync(Q)) RA().mkdirSync(Q);
      return RA().writeFileSync(B, JSON.stringify(A), { encoding: "utf8", flush: !1 }),
        pX4(B, 384),  // chmod 0600
        { success: !0, warning: "Warning: Storing credentials in plaintext." }
    } catch (Q) {
      return { success: !1 }
    }
  },
  delete() {
    let { storagePath: A } = nz1();
    if (RA().existsSync(A)) try {
      return RA().unlinkSync(A), !0
    } catch (Q) {
      return !1
    }
    return !0
  }
}

// READABLE (for understanding):
plaintextStorage = {
  name: "plaintext",

  read() {
    let { storagePath } = getStoragePaths();
    if (fs().existsSync(storagePath)) {
      try {
        let content = fs().readFileSync(storagePath, { encoding: "utf8" });
        return JSON.parse(content);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  update(credentials) {
    try {
      let { storageDir, storagePath } = getStoragePaths();
      if (!fs().existsSync(storageDir)) {
        fs().mkdirSync(storageDir);
      }

      fs().writeFileSync(storagePath, JSON.stringify(credentials), {
        encoding: "utf8",
        flush: false
      });

      // Set restrictive permissions: 0600 (owner read/write only)
      chmod(storagePath, 0o600);

      return {
        success: true,
        warning: "Warning: Storing credentials in plaintext."
      };
    } catch (error) {
      return { success: false };
    }
  },

  delete() {
    let { storagePath } = getStoragePaths();
    if (fs().existsSync(storagePath)) {
      try {
        fs().unlinkSync(storagePath);
        return true;
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}

// Mapping: az1→plaintextStorage, nz1→getStoragePaths, RA→fs, pX4→chmod
```

### Storage Backend Selection

```javascript
// ============================================
// getStorageBackend - Select storage based on platform
// Location: chunks.24.mjs:1438-1441
// ============================================

// ORIGINAL (for source lookup):
function Fw() {
  if (process.platform === "darwin") return Uo0($o0, az1);
  return az1
}

// READABLE (for understanding):
function getStorageBackend() {
  if (process.platform === "darwin") {
    // On macOS: try Keychain first, fallback to plaintext
    return withFallback(keychainStorage, plaintextStorage);
  }
  // Other platforms: plaintext only
  return plaintextStorage;
}

// Mapping: Fw→getStorageBackend, Uo0→withFallback, $o0→keychainStorage, az1→plaintextStorage
```

---

## API Key Masking

API keys are masked for display to prevent accidental exposure.

```javascript
// ============================================
// maskApiKey - Mask API key for display (last 20 chars)
// Location: chunks.56.mjs:1618-1620
// ============================================

// ORIGINAL (for source lookup):
function dw(A) {
  return A.slice(-20)
}

// READABLE (for understanding):
function maskApiKey(apiKey) {
  // Return only the last 20 characters
  return apiKey.slice(-20);
}

// Mapping: dw→maskApiKey
```

**Usage Example:**
```
Full key:    sk-ant-api03-xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Masked key:  xxxxxxxxxxxxxxxxxxxx (last 20 chars)
Display:     "Use custom API key: ...xxxxxxxxxxxxxxxxxxxx"
```

### Approval/Rejection Tracking

```javascript
// Configuration stores approval status by masked key
{
  "customApiKeyResponses": {
    "approved": ["xxxxxxxxxxxxxxxxxxxx"],  // Masked keys user approved
    "rejected": ["yyyyyyyyyyyyyyyyyyyy"]   // Masked keys user rejected
  }
}
```

---

## Summary

### API Key Resolution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  API Key Resolution                          │
├─────────────────────────────────────────────────────────────┤
│  1. Check ANTHROPIC_API_KEY (SDK mode)                       │
│     ↓ not found                                              │
│  2. Check File Descriptor                                    │
│     ↓ not found                                              │
│  3. Check ANTHROPIC_API_KEY (with user approval)             │
│     ↓ not found                                              │
│  4. Execute apiKeyHelper script                              │
│     ↓ not found                                              │
│  5. Read from Keychain (macOS) or config file                │
│     ↓ not found                                              │
│  6. Return null, source: "none"                              │
└─────────────────────────────────────────────────────────────┘
```

### Security Best Practices

| Method | Security Level | Recommended For |
|--------|---------------|-----------------|
| File Descriptor | Highest | Production, containers |
| Keychain | High | Interactive macOS |
| apiKeyHelper | High | Enterprise SSO |
| Environment Variable | Medium | Development, CI/CD |
| Config File | Low | Local development only |

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [oauth_authentication.md](./oauth_authentication.md) - OAuth 2.0 alternative
- [provider_modes.md](./provider_modes.md) - Cloud provider authentication
