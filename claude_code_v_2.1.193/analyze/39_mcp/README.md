# 39 — MCP (v2.1.183 → v2.1.193): login/logout CLI, idle timeout, reliability retries, tool-call re-auth

> **NEW delta module:** `39_mcp/` documents the **v2.1.183 → v2.1.193** changes to the MCP (Model Context Protocol) subsystem — the client that connects Claude Code to external `stdio`/`http`/`sse`/`ws`/`claudeai-proxy` tool servers.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`; 718,679 lines). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.
> BEFORE-bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.88 named-TS ancestor: `/lyz/codespace/3rd/claude-code/src`.
> Obfuscated names are **re-mangled every build** — a 183 obf token is never reused here; every symbol was re-derived by line in the live 193 bundle.

---

## TL;DR — what changed across the .185→.193 window

The MCP **machinery** — the transport layer (`stdio`/`http`/`sse`/`ws`/`claudeai-proxy`), the connect/discover/list pipeline, the OAuth dance, the needs-auth cache + startup notice, the `mcp` command tree — is structurally the same as 183. The 193 delta is a set of **reliability + UX hardening** changes spread across the .186/.187/.191/.193 builds, in descending architectural weight:

| # | Delta | Kind | Version | 193 anchor | 183 before | Doc |
|---|-------|------|---------|------------|------------|-----|
| 1 | Remote tool-call **idle timeout** + `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` | **NET-NEW** | 2.1.187 | `_pp` :292213, `hpp`=300000 :293311, idle abort :293069 | concept absent (grep=0) | [`tool_call_idle_timeout.md`](./tool_call_idle_timeout.md) |
| 2 | `headersHelper` **re-auth + reconnect** on tool-call 401/403 | **NET-NEW** | 2.1.193 | `bao` catch :293132-293180 | absent (grep=0) | [`headers_helper_reauth.md`](./headers_helper_reauth.md) |
| 3 | Capability-discovery **retry-with-backoff** + OAuth **retry-once** + 404→URL | NET-NEW / body-change | 2.1.191 | `P1n` :292176, `mpp` :293455, `AOn` :281573, `ENDPOINT_NOT_FOUND` :293997 | `aOt`/`qxn` single-try | [`reliability_retries.md`](./reliability_retries.md) |
| 4 | `claude mcp login`/`logout <name>` CLI + `--no-browser` | **NET-NEW** (CLI) | 2.1.186 | `L9f` :613318, `D9f` :613467, login cmd :613582 | absent (grep=0) | [`mcp_login_logout_cli.md`](./mcp_login_logout_cli.md) |
| 5 | `mcp get`/`remove` closest-name **suggestion** + truncate | **NET-NEW** | 2.1.186 | `t3o` :610416 | absent (grep=0) | [`server_name_suggestions.md`](./server_name_suggestions.md) |
| 6 | Retired-tool **"MCP server disconnected"** notice fix on resume | FIX (net-new guard) | 2.1.186 | `HBt` :228300, skip :471050 | `Qgo` :462359 (no skip) | [`server_name_suggestions.md`](./server_name_suggestions.md) §2 |
| 7 | Startup notice when servers need auth → `/mcp` | **CARRYOVER infra** | 2.1.193 (UX) | notice :504183 | identical at 183 :493517 | [`headers_helper_reauth.md`](./headers_helper_reauth.md) §2 |

**Confidence:** high for deltas 1–6 (each proved with a before/after read + 183 grep-diff). Delta 7 is honestly **carryover**: the notice strings and needs-auth cache are byte-identical in 183; what is new is that a live tool-call 401/403 (delta 2) now *feeds* that existing notice.

---

## The MCP connection lifecycle (orientation)

A reader new to this subsystem can place all six deltas on one timeline of a server's life:

```
   ┌─ config (.mcp.json / user / project) ──────────────────────────────────────┐
   │                                                                             │
   │  claude mcp login <name>  ← (Δ4) explicit OAuth, --no-browser paste-URL     │
   │  claude mcp get/remove    ← (Δ5/Δ6) typo-suggestions; retired-tool notice   │
   ▼                                                                             │
 CONNECT ──(404?)──► ENDPOINT_NOT_FOUND + URL  ← (Δ3) reliability_retries §3      │
   │   OAuth: createRetryingOAuthFetch retry-once ← (Δ3) §2                       │
   │   (cached needs-auth? skip)  ← (Δ7) carryover                                │
   ▼                                                                             │
 DISCOVER  tools/list · prompts/list · resources/list                            │
   │   listWithPaginationAndRetry: 250/500/1000ms backoff  ← (Δ3) §1             │
   ▼                                                                             │
 TOOL CALL  callToolWithWatchdog (bao)                                            │
   │   try:   idle watchdog (5 min silence → abort)  ← (Δ1) tool_call_idle_timeout│
   │   catch: 401/403 → re-run headersHelper + reconnect + retry once ← (Δ2)      │
   │          still failing → mark needs-auth ──────────────► next startup notice (Δ7)
   └─────────────────────────────────────────────────────────────────────────────┘
```

The two heaviest deltas (Δ1 idle timeout, Δ2 re-auth) both live in the **same** tool-call wrapper `callToolWithWatchdog` (`bao`, `cli_inner_pretty.js:293017`): the idle watchdog is the `try`, the re-auth is the `catch`. Read those two docs together.

---

## What CARRIES OVER unchanged (do NOT re-derive)

The following are byte-identical (modulo re-mangling) in 183 and are **not** 193 deltas — they are the stable spine the deltas attach to:

- **The transport layer + connect pipeline** (`stdio`/`http`/`sse`/`ws`/`claudeai-proxy`, session init, the `mcp-needs-auth-cache.json` cache, the connect-time `"Skipping connection (cached needs-auth)"` skip).
- **The OAuth single-fetch body** itself (`oauthFetchOnce` `m_a`) — 193 only *wraps* it in a retry; the body is the old 183 `qxn` impl. The **token-refresh** retry (`Token refresh failed, retrying in …`) is older carryover, separate from the new OAuth retry-once.
- **The `skipBrowserOpen` headless plumbing** in the interactive OAuth flow (193:14 / 183:13 — the +1 is the new CLI `mcp login` path, delta 4).
- **The startup needs-auth notice** (`McpServerIssuesNotice` render :504183 / 183 :493517; the per-server `buildStartupWarnings` warning :504324 / 183 :493676) and the `describeIssue` `needs-auth → "needs authentication"` mapping.
- **The "MCP server disconnected" / "no longer available" render strings** (:601626) — the delta 6 fix is purely a new *guard*, not a wording change.
- **The legacy tool-call 401 surfacing** (`"Tool call returned 401 Unauthorized - token may have expired"` :293170; `McpReauthError` "requires re-authorization" :293179) — the delta 2 re-auth branch sits *before* it.
- **The `mcp serve`/`list`/`add-json`/`add-from-claude-desktop`/`reset-project-choices` subcommands** — only `login`/`logout` (delta 4) were added to the command tree.

For the unchanged pre-2.1.183 MCP foundation, consult the v2.1.88 named-TS ancestor under `/lyz/codespace/3rd/claude-code/src` and earlier-version analyses; this tree documents only the .183→.193 delta.

---

## Files in this module

```
39_mcp/   (v2.1.193 — DELTA tree)
├── README.md                       ← you are here (lifecycle orientation + delta index + carryover ledger)
├── tool_call_idle_timeout.md       ← (Δ1, NET-NEW 2.1.187) CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT, _pp/hpp=300000/ypp,
│                                       the idle watchdog inside bao, progress-resets-idle, the 3 watchdogs, upgrade gotcha.
├── headers_helper_reauth.md        ← (Δ2, NET-NEW 2.1.193) bao catch: 401/403 → disconnect+reconnect (re-run headersHelper)
│                                       + retry-once, pao in-flight dedup, fall-through to needs-auth; the carryover startup notice.
├── reliability_retries.md          ← (Δ3, 2.1.191) discovery retry-with-backoff (P1n+mpp+gpp), OAuth retry-once (AOn/zap/Vap),
│                                       HTTP-404 → ENDPOINT_NOT_FOUND + URL.
├── mcp_login_logout_cli.md         ← (Δ4, NET-NEW 2.1.186) claude mcp login/logout <name>, --no-browser, transport-kind dispatch,
│                                       the SSH/headless readline paste-URL flow + the non-TTY ssh -t abort.
└── server_name_suggestions.md      ← (Δ5+Δ6, 2.1.186) mcp get/remove fuzzy "did you mean" + truncate-at-8;
                                        the RETIRED_TOOL_NAMES (HBt) guard fixing the retired-tool "MCP server disconnected" notice.
```

## Reading order

1. **This README** — the lifecycle map + which subsystems carry over.
2. **`tool_call_idle_timeout.md`** then **`headers_helper_reauth.md`** — both live in `callToolWithWatchdog`; read as a pair (the `try` and the `catch`).
3. **`reliability_retries.md`** — the connect/discover/OAuth hardening (orthogonal to the tool-call path).
4. **`mcp_login_logout_cli.md`** + **`server_name_suggestions.md`** — the CLI-surface deltas.

## Cross-tree links

- Telemetry events touched (`tengu_mcp_login`/`logout`/`get`/`delete`, `tengu_mcp_tool_call_auth_error`, `tengu_mcp_list_paginated`, `mcp_headers_helper`): see [`../44_telemetry/`](../44_telemetry/).
- Per-feature symbol additions: [`../00_overview/symbol_additions_v2_1_193_mcp.md`](../00_overview/symbol_additions_v2_1_193_mcp.md) (routes to `symbol_index_infra_platform.md`).

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**MCP** is the home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_mcp.md](../00_overview/symbol_additions_v2_1_193_mcp.md) — the granular v2.1.193 MCP additions

Headline functions/constants (full list in the per-doc `## Related Symbols` sections + the additions file):

- `callToolWithWatchdog` (`bao`, `cli_inner_pretty.js:293017`) — the tool-call wrapper hosting both the idle watchdog (Δ1) and the re-auth catch (Δ2).
- `resolveIdleTimeoutMs` (`_pp`, `cli_inner_pretty.js:292213`) / `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (`hpp`=`300000`, `:293311`) / `IDLE_TIMEOUT_TRANSPORTS` (`ypp`, `:293456`) — the idle-timeout layer.
- `listWithPaginationAndRetry` (`P1n`, `cli_inner_pretty.js:292176`) / `RETRY_BACKOFFS` (`mpp`, `:293455`) / `isRetryableError` (`gpp`, `:292155`) — discovery retry.
- `createRetryingOAuthFetch` (`AOn`, `cli_inner_pretty.js:281573`) — OAuth retry-once.
- `mcpLoginHandler` (`L9f`, `cli_inner_pretty.js:613318`) / `mcpLogoutHandler` (`D9f`, `:613467`) — the login/logout CLI.
- `suggestClosestServerName` (`t3o`, `cli_inner_pretty.js:610416`) / `RETIRED_TOOL_NAMES` (`HBt`, `:228300`) — name suggestions + retired-tool guard.
