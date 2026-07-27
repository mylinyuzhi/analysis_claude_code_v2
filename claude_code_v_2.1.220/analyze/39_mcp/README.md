# 39_mcp — MCP: auto-backgrounding, diagnostics, and configuration (v2.1.195 → v2.1.220)

> Module owner scope: every changelog bullet in the `.195`–`.220` window whose primary or secondary theme
> is **mcp**. TARGET bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`);
> baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` in this directory is a **2.1.220** line that was read in the 2.1.220
> bundle; baseline citations are tagged `(193)`.

---

## The story of this window for MCP

Twenty-nine changelog bullets touch MCP across 25 releases. They read like a maintenance list. They are
not: three of them are the visible tips of substantial engineering, and the single largest MCP change in
the window has **no bullet at all**.

**1. The client was forked in two.** 2.1.220 ships **two complete MCP runtime trees** — `v1` (default) and
`v2` (opt-in via `MCP_SDK_GENERATION` or the gate `tengu_brindle_causeway`) — selected by
`getMcpSdkGeneration()` and routed through eight accessor functions with an `MCP_TREE_ID` tripwire. That is
why so many MCP literals are exactly 2× their 2.1.193 count, and it means **the default code path is the
higher line range**. This also **corrects** `_GROUND_TRUTH_verified_anchors.md` §6.7, which recorded the
doubling as a bundling artefact. → [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md)

**2. MCP grew a background execution model.** `.212` added client-initiated promotion of a slow tool call
into an `mcp_task` after 120 s (`CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`). The task *registry* is carryover
from the server-declared MCP tasks protocol; what is new is that the **client** now decides. The
implementation's real content is a guard that refuses to background a call the *user* is blocking on.
→ [`auto_background_tool_calls.md`](./auto_background_tool_calls.md)

**3. Failure became data.** A server can now be `unconfigured` (a terminal state reached without touching
the network), every config skip carries a stable `skipReason`, HTTP statuses and server error text reach
`claude mcp list` / `/mcp` through a redacting formatter, and three *different* prompt-side announcements
(failed / policy-blocked / needs-auth) tell the model how to talk about a broken server. The SDK contract
for all of this is spelled out verbatim in the bundle at `:836952`.
→ [`errors_and_diagnostics.md`](./errors_and_diagnostics.md)

**4. Configuration got two protocol-grade upgrades.** `roots/list` went from one root to cwd + additional
working directories + an optionally-blessed staging root, and the client now *declares and sends*
`notifications/roots/list_changed`. And managed allow/deny `${VAR}` expansion was rebuilt on a frozen
startup-env snapshot with a **differential-expansion** detector that refuses an allowlist entry whose
variable substitution changed the *structure* of the URL. The changelog calls that second one "resolve from
startup + managed-settings env".
→ [`roots_and_managed_config.md`](./roots_and_managed_config.md)

**5. Two clocks were quietly retuned.** `stdio` servers now get a 30-minute idle watchdog (they previously
got none), and a per-server `timeout` now *raises* the idle window instead of only capping it. No bullet.
→ [`oauth_timeouts_and_reconnect.md`](./oauth_timeouts_and_reconnect.md) §2

**The counter-story — five bullets over-claim.** `claude mcp list` never spawned pending servers (the
branch is in 2.1.193); the OAuth single-failed-refresh recovery predates the window entirely; the 60 s
per-request timeout resolver is byte-identical carryover; `may need authentication` is a carryover label;
and the `.219` model-facing failed-server surface ships behind a **default-off** gate
(`tengu_surface_failed_mcp_servers`). Three bullets were also scoped against anchors that turn out to
belong to unrelated features, and this README says which.

---

## Documents

| Doc | Covers | Depth |
|---|---|---|
| [`auto_background_tool_calls.md`](./auto_background_tool_calls.md) | `.212` MCP auto-backgrounding: threshold resolution, the race, the elicitation guard, the four-part call-site gate, notification delivery | full |
| [`errors_and_diagnostics.md`](./errors_and_diagnostics.md) | config `skipReason` taxonomy, `url_missing_type`, whitespace, empty-URL expansion, the `unconfigured` state, `HTTP <n>` formatting + secret redaction, `mcp_server_errors` production, model-facing announcements, dropped tools, `disabledMcpServers` crash | full |
| [`oauth_timeouts_and_reconnect.md`](./oauth_timeouts_and_reconnect.md) | `request_timeout_ms`, the three per-call clocks, the stdio/idle change, OAuth scope narrowing, refresh-recovery carryover proof, `CLI_OWNED_BEARER_REJECTED`, proxy needs-approval retry, unanchored reconnect bullets | full |
| [`roots_and_managed_config.md`](./roots_and_managed_config.md) | `${VAR}` expander, policy expansion env, differential-expansion detector, `roots/list` + `list_changed`, reserved names + classifier floor, `.196` #4 carryover proof | full |
| [`dual_mcp_runtime_trees.md`](./dual_mcp_runtime_trees.md) | the v1/v2 split, the accessor tripwire, and the method for telling a real delta from a tree twin | full |

Symbol tables for merging live in
[`../00_overview/symbol_additions_v2_1_220_mcp.md`](../00_overview/symbol_additions_v2_1_220_mcp.md).

**Nothing was merged away.** The four planned documents all had enough substance; a fifth
(`dual_mcp_runtime_trees.md`) was added because the finding is a prerequisite for reading any line number
in this module correctly.

---

## Per-bullet ledger

Verdicts: **NET_NEW** = literal/mechanism absent in 2.1.193 · **DELTA** = mechanism existed, this window
narrowed/extended it · **CARRYOVER** = the described mechanism predates the window · **PARTIAL** = one half
anchored · **UNANCHORED** = no literal found, with the probes listed · **OTHER-MODULE** = primary theme is
elsewhere, MCP is the secondary theme.

| # | Bullet (abridged) | Ver | Verdict | Anchor (2.1.220 unless tagged) | Doc section |
|---|---|---|---|---|---|
| 1 | Security: `claude mcp list`/`get` no longer spawn self-approved `.mcp.json` servers | `.196` #4 | **CARRYOVER** | `hvp` `:567837`; skip branch `:567559` vs `:611530 (193)`; `⏸ Pending approval` descriptions `:585701`/`:585713` byte-identical to `:613560 (193)`/`:613572 (193)`; `includePendingProjectServers` 7/7 | [roots_and_managed_config §6](./roots_and_managed_config.md) |
| 2 | MCP OAuth requested the AS's full `scopes_supported` → `invalid_scope` on GitLab self-hosted | `.196` #15 | **DELTA (implemented)** | `getCuratedMetadataScope` `:287457-287463`; `pickCuratedScope` `:288174`; third branch removed from `HOn` `:283022 (193)` | [oauth_timeouts §3](./oauth_timeouts_and_reconnect.md) |
| 3 | Startup crash when `disabledMcpServers`/`enabledMcpServers` is not an array | `.200` #3 | **DELTA** | `coerceToArray` `:282778`; `Nw` `:282781`; non-destructive writer `KMt` `:282790-282810`; 193 used `(t.disabledMcpServers \|\| []).includes` `:280996 (193)` | [errors_and_diagnostics §6](./errors_and_diagnostics.md) |
| 4 | `/mcp` server list not tracking focus for screen readers/magnifiers | `.200` #13 | **UNANCHORED** | tried `srLabel` (220=2, both sites `:801902`/`:807726` are agent-view rows), `focusable`, `srOnly`, `ScreenReaderTable` (0/0) | [errors_and_diagnostics §7](./errors_and_diagnostics.md) |
| 5 | MCP error when a config has `url` but no `type` → suggest `"type": "http"` | `.202` #17 | **NET_NEW** | `url_missing_type` `:282631` (220=2/193=0); the shape test `:282626` | [errors_and_diagnostics §1](./errors_and_diagnostics.md) |
| 6 | Additional working directories in MCP `roots/list` + `roots/list_changed` | `.203` #3 | **NET_NEW** | `roots: { listChanged: !0 }` `:281499` (1/0); `getRootsListResponse` `:293418`; `notifyMcpRootsListChanged` `:293444`; `O_o` `:284576`; trigger `:568634-568641`; 193 returned one root (`Lpp` `:292486 (193)`) | [roots_and_managed_config §4](./roots_and_managed_config.md) |
| 7 | `claude mcp add-from-claude-desktop` stuck on unsupported server-name chars | `.205` #9 | **UNANCHORED** | `add-from-claude-desktop` 1/1; sanitiser `El` `:60201` is carryover-shaped; `unsupported characters` (220=1) is the `--session-id` message, a decoy | [errors_and_diagnostics §7](./errors_and_diagnostics.md) |
| 8 | Reserved the "Claude Browser" MCP server name (alongside "Claude Preview") | `.205` #22 | **NET_NEW** (both names) | `:151628-151629` (2/0); `Claude_Preview` 3/0; `Ler` `:151605`; `UIt` `:151668`; refusal `:282235`; floor `:289015-289031` with `previewClassifierFloorEnabled` 4/0 | [roots_and_managed_config §5](./roots_and_managed_config.md) |
| 9 | MCP per-server `request_timeout_ms` ignored (60 s default) | `.206` #9 | **NET_NEW field / CARRYOVER resolver** | `request_timeout_ms` `:58766-58774` (5/0); fold `X5n` `:58729`; resolver `Nvs` `:293353` identical to `hAa` `:292436 (193)`, both default 60 000 | [oauth_timeouts §1](./oauth_timeouts_and_reconnect.md) |
| 10 | OAuth MCP servers needing manual re-auth after one failed refresh | `.206` #11 | **CARRYOVER** | retry loop `:288005-288118` and `readConcurrentRefreshWinner` `:287988` are 2× their 193 counts; 7 literals tabulated | [oauth_timeouts §4](./oauth_timeouts_and_reconnect.md) |
| 11 | `--permission-prompt-tool` on an MCP server crashing on cold start | `.206` #12 | **OTHER-MODULE** (`38_permissions`) | MCP-side relevance: `getPermissionPromptToolName` `:3307` is also the tool excluded from auto-backgrounding (`:295649`) | [auto_background §3](./auto_background_tool_calls.md) |
| 12 | `/usage` stale bars; `/mcp` not reclassifying placeholder servers | `.208` #24 | **DELTA** (MCP half) | `Yar` `:266811`; config-fingerprint `unconfigured` flag `:266818`; `url_empty` `:268245` | [errors_and_diagnostics §2](./errors_and_diagnostics.md) |
| 13 | SDK sessions losing `initialize`-defined agents when a plugin refresh ran first | `.208` #29 | **OTHER-MODULE** (`51_headless_sdk`) + **mis-anchored** | scoped against `tengu_mcp_sdk_generation` `:262859`, which is the v1/v2 arm probe | [dual_mcp_runtime_trees §1](./dual_mcp_runtime_trees.md) |
| 14 | Memory leaks: MCP stderr 64 MB, LSP docs LRU 50, hook output, headless payloads | `.208` #30 | **OTHER-MODULE** (`50_performance`) | not investigated here | — (Not covered) |
| 15 | MCP servers with an empty URL show as "not configured" in `/mcp` | `.208` #44 | **NET_NEW** | `UNCONFIGURED` 6/0; connect short-circuit `:294656-294662` (v1 twin `:300194`); `Kee` `:284263`; `- Not configured` `:567370`; wait-loop text `:316011-316012` | [errors_and_diagnostics §2](./errors_and_diagnostics.md) |
| 16 | Plugin-provided MCP servers torn down when MCP servers are re-synced | `.210` #11 | **UNANCHORED** | tried `tengu_mcp_dropped_tools_pool_change` `:514689` (a *different* feature), `reconnectPlugin`/`pluginMcp` (0/0), `ensureConnected` (19/15, count drift only); adjacent real code `clearServerCache` `:293450` | [oauth_timeouts §7](./oauth_timeouts_and_reconnect.md) |
| 17 | SDK MCP servers from an `initialize` control request waiting a turn to connect | `.210` #22 | **UNANCHORED (mis-anchored)** | `tengu_mcp_sdk_generation` `:262859` carries `{generation, source}` — the runtime arm, not a connect fix | [oauth_timeouts §7](./oauth_timeouts_and_reconnect.md) |
| 18 | Plugin MCP servers not reconnecting after an idle web session woke | `.211` #5 | **UNANCHORED** | `idleWake`, `onWake`, `resumeFromIdle`, `pluginMcp` all 0/0 in both builds | [oauth_timeouts §7](./oauth_timeouts_and_reconnect.md) |
| 19 | MCP tool calls over 2 minutes move to the background; `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | `.212` #5 | **NET_NEW** | env `:32120`/`:58167`/`:288858` (3/0); `tengu_mcp_auto_background` `:288860`; `tengu_mcp_tool_auto_backgrounded` `:288896`; `yEy = 120000` `:288970`; result text `:288965` | [auto_background (whole)](./auto_background_tool_calls.md) |
| 20 | `/install-github-app` and `/mcp` blocked in agent-view sessions | `.214` #32 | **OTHER-MODULE** (`43_slash_commands`) | `tengu_slash_command_unavailable` `:593858` per scoping; not read here | — (Not covered) |
| 21 | MCP transient errors during prompts/resources refresh clearing slash commands/resources | `.214` #42 | **UNANCHORED (mis-anchored)** | `tengu_repl_mcp_error_throw` `:400184` / `_thrown` `:401330`, `:401526` are the **REPL bridge** wrapper; `_setupListChangedHandler` `:263296` is carryover (193=6) and `onChanged` is SDK-only in both builds; `keepPreviousOnError` 0/0 | [errors_and_diagnostics §7](./errors_and_diagnostics.md) |
| 22 | MCP re-authenticate revoking working credentials before the new sign-in succeeds | `.216` #19 | **DELTA** (re-anchored) | `CLI_OWNED_BEARER_REJECTED` 6/0, `:293102-293103`; classifier `wKu` `:293071`; the scoping anchor `tengu_mcp_proxy_needs_approval_retry` `:293996` is a different feature | [oauth_timeouts §5](./oauth_timeouts_and_reconnect.md) |
| 23 | Background sessions: `/mcp` and `/install-github-app` park a "needs input" request | `.216` #37 | **OTHER-MODULE** (`36_background_agents`) | not investigated here | — (Not covered) |
| 24 | Memory leak: truncated MCP tool outputs kept the full result in memory | `.217` #3 | **UNANCHORED** | `untruncated` 0/0, `truncated MCP` 0/0, `MAX_MCP_OUTPUT_TOKENS` absent from the env asset list | [errors_and_diagnostics §7](./errors_and_diagnostics.md) |
| 25 | "N MCP servers need authentication" over-counting unconnected claude.ai connectors | `.218` #19 | **PARTIAL** | labels carryover (`need authentication` 2/2; `may need auth`/`agent-only` `:704989` 3/3); `/status` counter `ltf` `:665978-666006`; detail view `:704410-704430`; closest new behaviour is the `yn()` headless gate `:516633` | [errors_and_diagnostics §5, §7](./errors_and_diagnostics.md) |
| 26 | `mcp_server_errors` in the headless stream-json init event; terminal startup warning | `.219` #4 | **NET_NEW** (MCP-side half) | production rule `tAr` `:593588-593620` (`filter(e => !clientNames.has(e.name))`); contract text `:836952`; 3/0 | [errors_and_diagnostics §4](./errors_and_diagnostics.md) |
| 27 | HTTP status + error text in `claude mcp list` and `/mcp`; hidden-whitespace warning | `.219` #8 | **NET_NEW** | `humanizeErrorCode` `:563841`; `formatMcpFailureDetail` `:563845`; `bSp` `:563887`; `displayDetail` 11/0; row `avp` `:567503`; `Leading or trailing whitespace in` `:282659` (1/0); `Xyy` `:282555`. **Caveat:** the model-facing half is gated off by default (`VYr` `:217470`) | [errors_and_diagnostics §1, §3, §5](./errors_and_diagnostics.md) |
| 28 | Managed MCP allowlist/denylist `${VAR}` resolve from startup + managed-settings env | `.219` #19 | **NET_NEW** (far deeper than the bullet) | `policy expansion env` `:281859`/`:281949` (2/0); `wildcardVars` 3/0; `t8u` `:281837`; `NQr` `:267771`; `n8u` `:281925-281956`; allow fail-closed `:282148-282149` vs deny `:282111` | [roots_and_managed_config §1-§3](./roots_and_managed_config.md) |
| 29 | (no bullet) the MCP client ships twice, arm chosen at runtime | — | **NET_NEW, undocumented** | `MCP_SDK_GENERATION` 3/0 `:262849`; `tengu_brindle_causeway` `:262853`; `MCP_TREE_ID` 6/0 `:292852`/`:294477`/`:298394`/`:300019`; accessors `:302416-302474` | [dual_mcp_runtime_trees (whole)](./dual_mcp_runtime_trees.md) |
| 30 | (no bullet) `stdio` idle watchdog + per-server `timeout` raises the idle window | — | **NET_NEW, undocumented** | `MKu` `:292957-292965`; `wAy` `:294628`; `AAy = 1800000` `:294473`; abort text `:294181` vs 193's env-only text | [oauth_timeouts §2](./oauth_timeouts_and_reconnect.md) |
| 31 | (no bullet) invalid-schema MCP tools are dropped and announced to the model | — | **NET_NEW, undocumented** | `droppedTools` 4/0 `:295403`; gate `tYu` `:293415`; `m$_` `:514667`; `tengu_mcp_dropped_tools_pool_change` `:514689`; renderer `:533079-533096` | [errors_and_diagnostics §5](./errors_and_diagnostics.md) |
| 32 | (no bullet) claude.ai-proxy servers can demand retroactive per-call approval | — | **NET_NEW, undocumented** | `tengu_mcp_proxy_needs_approval_retry` 6/0 `:293996`, `:294016`, `:294026`; `args_sha256` pinning; `suppressAlwaysAllowRule: !0` `:294030` | [oauth_timeouts §6](./oauth_timeouts_and_reconnect.md) |

Roll-up of the 28 changelog bullets (rows 1–28): **NET_NEW 8** · **DELTA 4** · **CARRYOVER 2** ·
**PARTIAL 1** · **UNANCHORED 6** · **OTHER-MODULE 4** (rows 11, 14, 20, 23) — plus 3 mis-anchor
corrections recorded inside those verdicts, and **4 undocumented net-new features** (rows 29–32).

---

## Corrections to shared tree documents

1. **`_GROUND_TRUTH_verified_anchors.md` §6.7** says the two copies of the MCP client are a bundling
   artefact that "proves nothing". They are a deliberate dual-generation runtime: `MCP_TREE_ID` (`:292852`,
   `:298394`), `getMcpSdkGeneration` (`:262846`), eight accessors with a tripwire (`:302428-302474`). The
   *practical advice* in §6.7 (read both 220 sites when the count is 2×) remains exactly right; the
   *explanation* should be updated, and readers should know the **higher** line range is the default arm.
2. **`_scope_v215_220.md` row `.216` #19** anchors "MCP re-authenticate revoking working credentials" to
   `tengu_mcp_proxy_needs_approval_retry`. That gate is the proxy tool-approval retry. Suggested
   replacement: `CLI_OWNED_BEARER_REJECTED` (`:293102`).
3. **`_scope_v211_214.md` row `.214` #42** anchors "MCP transient errors during prompts/resources refresh"
   to `tengu_repl_mcp_error_throw`. Those sites are the REPL/bridge tool-error wrapper (`:400184`,
   `:401330`, `:401526`).
4. **`_scope_v206_210.md` rows `.208` #29 / `.210` #22** both use `tengu_mcp_sdk_generation` as a lead. It
   is the v1/v2 arm probe and cannot serve either bullet.

---

## Not covered

- **`.206` #12** (`--permission-prompt-tool` on an MCP server crashing on cold start) — primary theme
  `permissions`; `38_permissions` owns the fix site (`Permission prompt tool`, 220=2/193=1). This module
  only documents the MCP-side consequence (the permission-prompt tool is excluded from auto-backgrounding).
- **`.208` #30** and **`.217` #3** (MCP stderr 64 MB cap; truncated-output retention) — primary theme
  `performance`. The 64 MB cap literal was not probed here; `50_performance` owns it.
- **`.214` #32** and **`.216` #37** (`/mcp` unavailable / parked as "needs input" in background and
  agent-view sessions) — primary themes `slash_cli` / `background_agents`. Their gates
  (`tengu_slash_command_unavailable`) live in those modules' surfaces; I did not read them, so I have not
  verified the scoping file's line numbers.
- **`.219` #4's event *shape*** — `51_headless_sdk` owns the init-event schema, the `terminal startup
  warning` half of the bullet, and the SDK-side field docs. This module documents only the production rule
  that decides which errors enter the list (deliberately non-duplicative, per the task's coordination note).
- **`/mcp` interactive UI internals** (the React panel at `:703600-705000`) beyond the specific rows cited.
  The status/label surface is largely carryover and would need an `48_accessibility_ui` reading to separate
  layout changes from state changes.
- **`.218` #19's exact over-count predicate.** Recorded as PARTIAL with the probes listed rather than
  guessed at.

---

## Method notes for the next reader

1. **Always `grep -c 'literal' $T $B` before writing a sentence.** In this module specifically, a 2:1 ratio
   almost always means the runtime-tree twin, not a delta.
2. **The single-copy region is `~26xxxx`–`~28xxxx`** (config validation, policy evaluation, sanitizers,
   auto-backgrounding, capability declaration). The duplicated region is `~292xxx`–`~302xxx`. If a fix
   appears in the single-copy region, it applies to both arms.
3. **Prefer the exported readable name.** The v2 client's export table (`:292800-292852`) and the accessor
   table (`:302416-302427`) hand you real identifiers for ~60 symbols — `getRootsListResponse`,
   `getMcpToolIdleTimeoutMs`, `notifyMcpRootsListChanged`, `connectToServer`, `MCP_TREE_ID`. Use those
   names rather than inventing new ones; this module's docs already do.

## Related Symbols

> Symbol mappings:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (**MCP** home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [../00_overview/symbol_additions_v2_1_220_mcp.md](../00_overview/symbol_additions_v2_1_220_mcp.md) - the v2.1.220 MCP additions produced by this module

Entry points, one per document:

- `getMcpAutoBackgroundMs` (`SEy`, `cli_inner_pretty.js:288854`) - auto-background deadline resolver.
- `validateMcpServersObject` (`Ilr`, `cli_inner_pretty.js:282575`) - config validator with `skipReason`.
- `getMcpToolIdleTimeoutMs` (`MKu`, `cli_inner_pretty.js:292957`) - the retuned idle watchdog.
- `expandPolicyUrlPattern` (`n8u`, `cli_inner_pretty.js:281925`) - managed-policy differential expansion.
- `getRootsListResponse` (`rYu`, `cli_inner_pretty.js:293418`) - the multi-root `roots/list` response.
- `getMcpSdkGeneration` (`o9`, `cli_inner_pretty.js:262846`) - which MCP runtime tree is live.
