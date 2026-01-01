# LLM Request Headers

## Table of Contents

1. [Authentication Headers](#authentication-headers)
2. [Anthropic-Specific Headers](#anthropic-specific-headers)
3. [Metadata Headers](#metadata-headers)
4. [Custom Headers](#custom-headers)
5. [Container/Remote Headers](#containerremote-headers)
6. [Header Sanitization](#header-sanitization)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `PA5` (addAuthorizationHeader) - Bearer token injection
- `jA5` (getCustomHeaders) - Parse `ANTHROPIC_CUSTOM_HEADERS`
- `fc` (getUserAgent) - User agent construction

---

## Authentication Headers

Claude Code uses two mutually exclusive authentication headers:

### API Key Authentication

```http
X-Api-Key: sk-ant-api03-...
```

Used when:
- `ANTHROPIC_API_KEY` environment variable is set
- API key retrieved from Keychain or config file
- First-party Anthropic API calls without OAuth

### OAuth Bearer Token Authentication

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

Used when:
- Claude.ai OAuth authentication is active
- `ANTHROPIC_AUTH_TOKEN` environment variable is set
- `CLAUDE_CODE_OAUTH_TOKEN` environment variable is set

### Header Construction Logic

```javascript
// ============================================
// addAuthorizationHeader - Add Bearer token to headers
// Location: chunks.88.mjs:107-110
// ============================================

// ORIGINAL (for source lookup):
function PA5(A, Q) {
  let B = process.env.ANTHROPIC_AUTH_TOKEN || fzA(Q);
  if (B) A.Authorization = `Bearer ${B}`
}

// READABLE (for understanding):
function addAuthorizationHeader(headers, trustedContext) {
  // Priority: Environment variable > apiKeyHelper script
  let authToken = process.env.ANTHROPIC_AUTH_TOKEN || executeApiKeyHelper(trustedContext);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
}

// Mapping: PA5→addAuthorizationHeader, fzA→executeApiKeyHelper
```

### When OAuth is Used

```javascript
// In createApiClient:
if (await Qt(), !BB()) PA5(Y, N6());

// READABLE:
await refreshOAuthTokenIfNeeded();
if (!isClaudeAiOAuth()) {
  // Not using OAuth, add Authorization header from apiKeyHelper or env
  addAuthorizationHeader(defaultHeaders, getTrustedContext());
}
// If using OAuth, authToken is set directly in client config
```

---

## Anthropic-Specific Headers

### API Version Header

```http
anthropic-version: 2023-06-01
```

Required for all Anthropic API calls. Specifies the API version for response format compatibility.

### Beta Features Header

```http
anthropic-beta: files-api-2025-04-14,message-batches-2024-09-24,token-counting-2024-11-01
```

Enables experimental API features. Comma-separated list of beta feature identifiers.

### Additional Protection Header

```http
x-anthropic-additional-protection: true
```

Enables enhanced content filtering when set:

```javascript
// Location: chunks.88.mjs:22
if (Y0(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION))
  Y["x-anthropic-additional-protection"] = "true";

// Set via: CLAUDE_CODE_ADDITIONAL_PROTECTION=1
```

---

## Metadata Headers

The Anthropic SDK adds metadata headers for request tracking and debugging.

### X-Stainless Headers

| Header | Example | Purpose |
|--------|---------|---------|
| `X-Stainless-Lang` | `js` | SDK language |
| `X-Stainless-Package-Version` | `0.24.0` | SDK version |
| `X-Stainless-OS` | `Darwin` | Operating system |
| `X-Stainless-Arch` | `arm64` | CPU architecture |
| `X-Stainless-Runtime` | `node` | Runtime environment |
| `X-Stainless-Runtime-Version` | `18.16.0` | Runtime version |
| `X-Stainless-Retry-Count` | `0` | Current retry attempt |
| `X-Stainless-Timeout` | `600` | Request timeout (seconds) |

### App Identifier

```http
x-app: cli
```

Identifies the client application as Claude Code CLI.

### User-Agent

```http
User-Agent: claude-code/2.0.59 node/18.16.0 darwin/arm64
```

Constructed by `fc()` (getUserAgent) function.

---

## Custom Headers

Users can inject custom headers via environment variable.

### Configuration

```bash
export ANTHROPIC_CUSTOM_HEADERS="X-Custom-Header: value
X-Another-Header: another-value"
```

### Parsing Logic

```javascript
// ============================================
// getCustomHeaders - Parse ANTHROPIC_CUSTOM_HEADERS env var
// Location: chunks.88.mjs:112-126
// ============================================

// ORIGINAL (for source lookup):
function jA5() {
  let A = {},
    Q = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!Q) return A;
  let B = Q.split(/\n|\r\n/);
  for (let G of B) {
    if (!G.trim()) continue;
    let Z = G.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (Z) {
      let [, I, Y] = Z;
      if (I && Y !== void 0) A[I] = Y
    }
  }
  return A
}

// READABLE (for understanding):
function getCustomHeaders() {
  let headers = {};
  let customHeadersEnv = process.env.ANTHROPIC_CUSTOM_HEADERS;

  if (!customHeadersEnv) return headers;

  // Parse newline-separated key: value pairs
  let lines = customHeadersEnv.split(/\n|\r\n/);

  for (let line of lines) {
    if (!line.trim()) continue;

    // Match "key: value" pattern with flexible whitespace
    let match = line.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (match) {
      let [, headerName, headerValue] = match;
      if (headerName && headerValue !== undefined) {
        headers[headerName] = headerValue;
      }
    }
  }

  return headers;
}

// Mapping: jA5→getCustomHeaders
```

### Format

```
Header-Name: Header-Value
Another-Header: Another-Value
```

- One header per line
- Colon separates name and value
- Whitespace around colon is trimmed
- Empty lines are skipped

---

## Container/Remote Headers

Headers for remote execution and container identification.

### Container ID

```http
x-claude-remote-container-id: container-abc123
```

Set via: `CLAUDE_CODE_CONTAINER_ID`

### Remote Session ID

```http
x-claude-remote-session-id: session-xyz789
```

Set via: `CLAUDE_CODE_REMOTE_SESSION_ID`

### Header Injection

```javascript
// Location: chunks.88.mjs:9-20
let Z = process.env.CLAUDE_CODE_CONTAINER_ID,
  I = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
  Y = {
    "x-app": "cli",
    "User-Agent": fc(),
    ...jA5(),
    ...Z ? { "x-claude-remote-container-id": Z } : {},
    ...I ? { "x-claude-remote-session-id": I } : {}
  };
```

---

## Header Sanitization

Sensitive headers are redacted before logging.

### Sensitive Header List

| Header | Redacted As |
|--------|-------------|
| `x-api-key` | `***` |
| `authorization` | `***` |
| `cookie` | `***` |
| `set-cookie` | `***` |

### Sanitization Logic

```javascript
// ============================================
// Header Sanitization for Logging
// Location: chunks.19.mjs:1440-1448
// ============================================

// ORIGINAL (for source lookup):
if (A.headers) A.headers = Object.fromEntries(
  (A.headers instanceof Headers ? [...A.headers] : Object.entries(A.headers))
    .map(([Q, B]) => [
      Q,
      Q.toLowerCase() === "x-api-key" ||
      Q.toLowerCase() === "authorization" ||
      Q.toLowerCase() === "cookie" ||
      Q.toLowerCase() === "set-cookie"
        ? "***"
        : B
    ])
);

// READABLE (for understanding):
if (requestData.headers) {
  requestData.headers = Object.fromEntries(
    (requestData.headers instanceof Headers
      ? [...requestData.headers]
      : Object.entries(requestData.headers))
    .map(([headerName, headerValue]) => {
      let lowerName = headerName.toLowerCase();
      let isSensitive =
        lowerName === "x-api-key" ||
        lowerName === "authorization" ||
        lowerName === "cookie" ||
        lowerName === "set-cookie";

      return [headerName, isSensitive ? "***" : headerValue];
    })
  );
}
```

**Key Insight**: This ensures API keys and tokens never appear in logs, even in debug mode.

---

## Complete Header Example

### API Key Request

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
X-Api-Key: sk-ant-api03-xxxxxxxx
Content-Type: application/json
Accept: application/json
User-Agent: claude-code/2.0.59 node/18.16.0 darwin/arm64
anthropic-version: 2023-06-01
anthropic-beta: files-api-2025-04-14,token-counting-2024-11-01
x-app: cli
X-Stainless-Lang: js
X-Stainless-Package-Version: 0.24.0
X-Stainless-OS: Darwin
X-Stainless-Arch: arm64
X-Stainless-Runtime: node
X-Stainless-Runtime-Version: 18.16.0
X-Stainless-Retry-Count: 0
```

### OAuth Request

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json
Accept: application/json
User-Agent: claude-code/2.0.59 node/18.16.0 darwin/arm64
anthropic-version: 2023-06-01
anthropic-beta: files-api-2025-04-14,token-counting-2024-11-01
x-app: cli
X-Stainless-Lang: js
...
```

### Container Request (with custom headers)

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
X-Api-Key: sk-ant-api03-xxxxxxxx
x-claude-remote-container-id: container-abc123
x-claude-remote-session-id: session-xyz789
X-Custom-Tracking-Id: trace-12345
...
```

---

## Header Summary Table

| Header | Value | Required | Source |
|--------|-------|----------|--------|
| `X-Api-Key` | API key | Auth required* | Environment/config |
| `Authorization` | `Bearer {token}` | Auth required* | OAuth/env |
| `anthropic-version` | `2023-06-01` | Yes | SDK constant |
| `anthropic-beta` | Feature list | No | SDK config |
| `User-Agent` | Client info | Yes | Constructed |
| `x-app` | `cli` | Yes | Hardcoded |
| `Content-Type` | `application/json` | Yes | Request body |
| `X-Stainless-*` | Metadata | Yes | SDK auto-added |
| `x-claude-remote-*` | Container info | No | Environment |
| Custom | Custom | No | `ANTHROPIC_CUSTOM_HEADERS` |

*One of X-Api-Key or Authorization is required.

---

## Related Documents

- [auth_overview.md](./auth_overview.md) - Authentication architecture
- [api_key_auth.md](./api_key_auth.md) - API key authentication
- [oauth_authentication.md](./oauth_authentication.md) - OAuth authentication
- [provider_modes.md](./provider_modes.md) - Cloud provider authentication
