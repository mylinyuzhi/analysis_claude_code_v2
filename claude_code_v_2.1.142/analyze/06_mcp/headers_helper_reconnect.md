# `headersHelper` Reconnect Copy and Menu Logic

**Versions:** 2.1.118 (menu logic refactor), 2.1.121 (copy refinement); compare with the baseline `headers_helper.md` at v2.1.110/v2.1.112

## Summary

The v2.1.112 baseline (`../../../claude_code_v_2.1.112/analyze/06_mcp/headers_helper.md`) covered the *initial* `/mcp` menu adaptation for `headersHelper` servers: OAuth options like `Authenticate`/`Re-authenticate` were hidden because they made no sense for a server that doesn't use OAuth. That fix shipped in v2.1.110.

In v2.1.118 the policy was **reversed** — OAuth options are once again shown, even for servers configured with `headersHelper`. The reason: many enterprise MCP servers use `headersHelper` to inject *bearer tokens that the server then validates via OAuth introspection*. So while Claude Code itself isn't running the OAuth flow client-side, the upstream server still requires `Authenticate`-style actions. v2.1.118 reflects this nuance by showing OAuth actions and updating the `needs-auth` reconnect copy to guide the user toward the right action ("upstream uses OAuth → `Authenticate`" vs. "credentials come from helper → `Reconnect`").

v2.1.121 then refined the copy to be a single, actionable sentence: `"<server> requires authentication. Use 'Authenticate' if the upstream server uses OAuth, or check the headersHelper script and use 'Reconnect'."`

## Files Involved

| Version | Path | Lines | What |
|---------|------|------:|------|
| v2.1.112 | `chunks.175.mjs` | 2380-2430 | `McpServerDetailMenu` — `else if (!q.config.headersHelper)` *suppresses* OAuth |
| v2.1.112 | `chunks.175.mjs` | 2028-2047 | `formatReconnectResult` — separate copy for `headersHelper` `needs-auth` |
| v2.1.142 | `cli_inner_pretty.js` | **452258-452270** | `McpServerDetailMenu` — OAuth options **always** offered (no `headersHelper` guard) |
| v2.1.142 | `cli_inner_pretty.js` | 452267 | `TH = ... && !!H.config.headersHelper` — still tracks the helper flag for Reconnect |
| v2.1.142 | `cli_inner_pretty.js` | 452269 | `H.client.type !== "needs-auth" \|\| TH` — Reconnect enabled for `needs-auth` when helper present |
| v2.1.142 | `cli_inner_pretty.js` | **451806-451826** | `formatReconnectResult` — new single-sentence copy |
| v2.1.142 | `cli_inner_pretty.js` | 452438 | menu wires `hasHeadersHelper: TH` into `formatReconnectResult` |

## v2.1.112 menu logic (the "hide OAuth" approach)

```javascript
// ============================================
// McpServerDetailMenu (v2.1.112) — hides OAuth options for headersHelper
// Location: chunks.175.mjs:2380-2430 (excerpt)
// ============================================

// ORIGINAL (for source lookup, relevant block):
if (q.config.type === "claudeai-proxy") {
    if (q.client.type === "connected") W6.push({ label: "Clear authentication", value: "claudeai-clear-auth" });
    else if (q.client.type !== "disabled") W6.push({ label: "Authenticate", value: "claudeai-auth" })
} else if (!q.config.headersHelper) {                                  // ← OLD GUARD
    if (i) W6.push({ label: "Re-authenticate", value: "reauth" }),
           W6.push({ label: "Clear authentication", value: "clear-auth" });
    if (!i) W6.push({ label: "Authenticate", value: "auth" })
}
let V6 = q.config.type !== "claudeai-proxy" && !!q.config.headersHelper;
if (q.client.type !== "disabled") {
    if (q.client.type !== "needs-auth" || V6) W6.push({ label: "Reconnect", value: "reconnectMcpServer" });
    W6.push({ label: "Disable", value: "toggle-enabled" })
}

// READABLE (for understanding):
const isClaudeaiProxy = server.config.type === "claudeai-proxy";

if (isClaudeaiProxy) {
    // claude.ai proxy: its own auth flow.
    if (state === "connected") menu.push("Clear authentication (claudeai)");
    else if (state !== "disabled") menu.push("Authenticate (claudeai)");
} else if (!server.config.headersHelper) {
    // OAuth-bearing server: standard OAuth actions.
    if (authenticated) {
        menu.push("Re-authenticate");
        menu.push("Clear authentication");
    } else {
        menu.push("Authenticate");
    }
}
// else: server has headersHelper → NO OAuth options shown.

const usesHeadersHelper = !isClaudeaiProxy && !!server.config.headersHelper;
if (state !== "disabled") {
    if (state !== "needs-auth" || usesHeadersHelper) {
        menu.push("Reconnect");   // needs-auth + headersHelper → Reconnect is enabled
    }
    menu.push("Disable");
}

// Mapping (matching baseline doc): q→server, W6→menu, V6→usesHeadersHelper, i→authenticated
```

## v2.1.142 menu logic (the "show OAuth + helper hint" approach)

```javascript
// ============================================
// McpServerDetailMenu (v2.1.142) — OAuth options always offered
// Location: cli_inner_pretty.js:452258-452270
// ============================================

// ORIGINAL (for source lookup):
if (H.config.type === "claudeai-proxy") {
    if (H.client.type === "connected") GH.push({ label: "Clear authentication", value: "claudeai-clear-auth" });
    else if (H.client.type !== "disabled") GH.push({ label: "Authenticate", value: "claudeai-auth" });
} else {
    if (qH)
        (GH.push({ label: "Re-authenticate", value: "reauth" }),
         GH.push({ label: "Clear authentication", value: "clear-auth" }));
    if (!qH) GH.push({ label: "Authenticate", value: "auth" });
}
let TH = H.config.type !== "claudeai-proxy" && !!H.config.headersHelper;
if (H.client.type !== "disabled") {
    if (H.client.type !== "needs-auth" || TH) GH.push({ label: "Reconnect", value: "reconnectMcpServer" });
    GH.push({ label: "Disable", value: "toggle-enabled" });
}

// READABLE (for understanding):
const isClaudeaiProxy = server.config.type === "claudeai-proxy";

if (isClaudeaiProxy) {
    // claude.ai proxy: unchanged.
    if (state === "connected") menu.push("Clear authentication (claudeai)");
    else if (state !== "disabled") menu.push("Authenticate (claudeai)");
} else {
    // CHANGE: no longer gated on !headersHelper.
    // OAuth options offered for ALL non-claudeai-proxy servers.
    if (authenticated) {
        menu.push("Re-authenticate");
        menu.push("Clear authentication");
    } else {
        menu.push("Authenticate");
    }
}

// usesHeadersHelper still tracked — used to enable Reconnect in needs-auth state
// AND to choose the right reconnect-result copy below.
const usesHeadersHelper = !isClaudeaiProxy && !!server.config.headersHelper;

if (state !== "disabled") {
    if (state !== "needs-auth" || usesHeadersHelper) menu.push("Reconnect");
    menu.push("Disable");
}

// Mapping: H→server, GH→menu, qH→authenticated, TH→usesHeadersHelper
```

The structural difference is **the removed `else` guard**:

```diff
- } else if (!q.config.headersHelper) {
+ } else {
     // OAuth options
   }
```

That one keyword removal changes the menu from "headersHelper hides OAuth" to "OAuth always shown" for non-`claudeai-proxy` servers.

## The new reconnect-result copy (v2.1.121)

```javascript
// ============================================
// formatReconnectResult (v2.1.142) — single-sentence needs-auth guidance
// Location: cli_inner_pretty.js:451806-451826
// ============================================

// ORIGINAL (for source lookup):
function Nj8(H, $, q) {
  switch (H.client.type) {
    case "connected":
      if (H.client.toolsListError)
        return { message: `Reconnected to ${$}, but fetching tools failed: ${H.client.toolsListError}`, success: !1 };
      return { message: `Reconnected to ${$}.`, success: !0 };
    case "needs-auth":
      return {
        message: q?.hasHeadersHelper
          ? `${$} requires authentication. Use 'Authenticate' if the upstream server uses OAuth, or check the headersHelper script and use 'Reconnect'.`
          : `${$} requires authentication. Use the 'Authenticate' option.`,
        success: !1,
      };
    case "failed": {
      let K = kj8(H.client);
      return { message: K ? `Failed to reconnect to ${$}: ${K}` : `Failed to reconnect to ${$}.`, success: !1 };
    }
    default:
      return { message: `Unknown result when reconnecting to ${$}.`, success: !1 };
  }
}

// READABLE (for understanding):
function formatReconnectResult(reconnectedClient, serverName, options) {
    switch (reconnectedClient.client.type) {
        case "connected":
            // NEW (v2.1.132 split): if connected but tools/list failed, say so explicitly.
            if (reconnectedClient.client.toolsListError) {
                return {
                    message: `Reconnected to ${serverName}, but fetching tools failed: ${reconnectedClient.client.toolsListError}`,
                    success: false,
                };
            }
            return { message: `Reconnected to ${serverName}.`, success: true };

        case "needs-auth":
            // NEW (v2.1.121): single-sentence guidance.
            // When the server has headersHelper configured, the auth could be either:
            //   - OAuth-based (the upstream server validates a bearer token) → `Authenticate`
            //   - helper-based (the helper script's output is the credentials) → `Reconnect`
            // Tell the user about both options instead of guessing.
            return {
                message: options?.hasHeadersHelper
                    ? `${serverName} requires authentication. Use 'Authenticate' if the upstream server uses OAuth, or check the headersHelper script and use 'Reconnect'.`
                    : `${serverName} requires authentication. Use the 'Authenticate' option.`,
                success: false,
            };

        case "failed": {
            // NEW (v2.1.139): surface HTTP status / URL in the failure message.
            const transportErrorDetail = formatTransportError(reconnectedClient.client);
            return {
                message: transportErrorDetail
                    ? `Failed to reconnect to ${serverName}: ${transportErrorDetail}`
                    : `Failed to reconnect to ${serverName}.`,
                success: false,
            };
        }

        default:
            return { message: `Unknown result when reconnecting to ${serverName}.`, success: false };
    }
}

// Mapping: Nj8→formatReconnectResult, H→reconnectedClient, $→serverName, q→options,
//          K→transportErrorDetail, kj8→formatTransportError
```

## Comparison table

| Behavior | v2.1.112 (post-2.1.110 fix) | v2.1.142 |
|----------|-----------------------------|----------|
| Server with `headersHelper`, `connected` state — Authenticate offered? | No | **Yes** (treated as possible OAuth-bearing) |
| Server with `headersHelper`, `needs-auth` — Authenticate offered? | No (only Reconnect) | **Yes** (both Authenticate and Reconnect) |
| `needs-auth` message for `headersHelper` server | `Check that the headersHelper script returns valid credentials, then use the 'Reconnect' option.` | `requires authentication. Use 'Authenticate' if the upstream server uses OAuth, or check the headersHelper script and use 'Reconnect'.` |
| Reconnect enabled for `needs-auth` + `headersHelper` | Yes | Yes (unchanged — `TH` flag) |
| `connected · tools fetch failed` status | Not differentiated | **Differentiated** (v2.1.132 — see [tools_list_retry.md](./tools_list_retry.md)) |
| `connected · no tools` status | Not differentiated | **Differentiated** (v2.1.128) |
| Failed-reconnect message includes HTTP status | No | **Yes** (v2.1.139) |

## Why This Approach

### Why reverse the v2.1.110 fix

The v2.1.110 fix assumed `headersHelper` ⇔ "no OAuth involvement at all." In practice, internal MCP servers commonly use a pattern like:
```
headersHelper script:
  → fetch a bearer token from the corporate IdP (OAuth client-credentials grant)
  → return { "Authorization": "Bearer ..." }
```
The script wraps OAuth. The user still needs an OAuth dialog when their OIDC session expires; the script can't do that — it would need browser interaction. So hiding `Authenticate` was wrong for the common case.

The v2.1.118 reversal recognizes that `headersHelper` is *one way* to ferry credentials, not *evidence that OAuth isn't involved*. Showing OAuth actions is harmless when they're not needed (clicking `Authenticate` for a pure-helper server just fails fast with "no oauth config") and necessary when they are.

### Why a single-sentence copy

Pre-fix copy was two sentences and asked the user to make a diagnosis ("check that the headersHelper script returns valid credentials, then use the 'Reconnect' option"). That worked for one mental model but confused users whose `headersHelper` was *just to add a custom header* on top of OAuth.

The v2.1.121 copy explicitly tells the user: "there are two paths, pick the one that matches your setup":
- OAuth path: `Authenticate`.
- Helper path: check the script, then `Reconnect`.

This shifts diagnostic effort from the menu (guess wrong, suggest one action) to the user (pick the right action with both options visible).

### Why the `Reconnect` enablement on `needs-auth` is preserved

The single-line `TH` flag (`!isClaudeaiProxy && !!server.config.headersHelper`) is still computed and still enables `Reconnect` in `needs-auth` state. Without that, a `headersHelper`-only server stuck in `needs-auth` (because the script returned bad credentials last time) would have no way to retry without clearing the state by hand. The flag preserves that escape hatch.

### Trade-off: more actions visible per server

The pre-fix menu was minimal — three actions max for `headersHelper` servers. The post-fix menu can show up to four (Re-authenticate, Clear authentication, Reconnect, Disable). For users who don't care about OAuth on their helper-only server, those extra actions are noise. The trade-off is judged worthwhile because:
- Power-user surface (`/mcp` is not a frequently-clicked path)
- Reasoning visibility (the user can see the OAuth actions are *available* even if not needed)

### Edge case: a server with `oauth` AND `headersHelper` AND `claudeai-proxy`

Schema-wise, `claudeai-proxy` is its own discriminant — it can't carry `headersHelper`. So the only realistic combo is "headersHelper + oauth config." Both fields are honored: the helper runs to inject headers, and the `Authenticate` action triggers a proper OAuth flow if the user clicks it. The menu shows both `Authenticate` and `Reconnect`, which matches reality.

### Key insight

The v2.1.110 → v2.1.118 → v2.1.121 trajectory is a small case study in "premature inference of intent":
1. v2.1.110 inferred "user set `headersHelper` → they don't want OAuth."
2. v2.1.118 retracted the inference — both signals can coexist.
3. v2.1.121 acknowledged the user knows better than the UI by showing both actions with disambiguating copy.

The terminal state is the simplest: assume nothing, show all reasonable actions, let the copy explain.

## Related Symbols

See [`symbol_additions_v2_1_142_mcp.md`](../00_overview/symbol_additions_v2_1_142_mcp.md) section "Module: MCP — Server Detail Menu".

Key entities:
- `McpServerDetailMenu` (anonymous React component starting at cli_inner_pretty.js:451831, with menu options at 452255-452270)
- `formatReconnectResult` (`Nj8`, cli_inner_pretty.js:451806-451826)
- `formatTransportError` (`kj8`, cli_inner_pretty.js:451797-451804) — new: extracts HTTP status / URL for failed-reconnect messages

Unchanged but referenced:
- `getMcpHeadersFromHelper` (`oGY` in v2.1.112 → unchanged structure in v2.1.142 at cli_inner_pretty.js:412394-412449, only the variable letters changed) — the helper script runner
- `getMcpServerHeaders` (helper-name in v2.1.142: also remapped) — static + dynamic header merge
