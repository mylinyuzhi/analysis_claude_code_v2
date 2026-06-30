# File Index — v2.1.193 Extracted Source (FOCUSED v2.1.183 → v2.1.193 delta)

This index inventories the files produced by `claude-code-bomb` for Claude Code **v2.1.193**, and maps the **TWELVE
analyzed themes** onto concrete `cli_inner_pretty.js` line regions. It is the entry point for "I want to read the code
for one of the v2.1.183 → v2.1.193 changes" — work backward from the asset listing or grep for a stable string, then
jump to the line region below.

> **Scope honesty.** This is **not** a comprehensive module tree. It is a *delta analysis* scoped to the changelog
> window **v2.1.183 → v2.1.193**. Six sub-versions were published — **2.1.185, .186, .187, .190, .191, .193** — and
> four numbers were never shipped (**.184, .188, .189, .192**). The headline release is **2.1.186** (33 changelog
> items: `claude mcp login/logout`, `!`-bash auto-respond, skills frontmatter tolerance, workflow schema-retry cap,
> `teammateMode: "iterm2"`), followed by **2.1.187** (permissions + subagent-depth correctness), **2.1.191** (MCP
> reliability + `/rewind` before `/clear`), and **2.1.193** (auto-mode `classifyAllShell` + the `assistant_response`
> OTEL event). The twelve themes inventoried below are exactly the dirs under `analyze/`.

The prior tree (`../../../claude_code_v_2.1.183/analyze/`) covered the **v2.1.156 → v2.1.183** window as a five-feature
delta. This tree covers **v2.1.183 → v2.1.193** across twelve themes. The bullet source of truth is `../CHANGELOG.md`
(v2.1.185 → v2.1.193); the changelog-derived plan is `changelog_delta_scoping.md`; the source-cited narrative is
`changelog_analysis.md`.

The canonical extraction layout is at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/`.

> **Citation rule:** every line number below was verified against
> `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`. Cite as `cli_inner_pretty.js:<line>`.
> Line numbers are stable within this build only — they shift across versions; the **string literals / tool names /
> telemetry events / env-var names are the stable anchor**. Where a line is a v2.1.183 (or v2.1.156) *before-picture*,
> it is tagged explicitly as `(183)` / `(156)`.

---

## Top-Level Tree

```
extract/                                          (/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/)
├─ cli_inner_pretty.js                      (~24.1 MB / 718,679 lines, one pretty-printed bundle)
├─ cli_inner_pretty.js.PLACEHOLDER.md       (git-ignored note: regenerate from binary or reassemble from cli_unpack_pretty/)
├─ cli_unpack_pretty/                       (per-decl break-up of cli_inner_pretty.js)
│   ├─ _manifest.json                       (~4.25 MB file list — 40,494 entries; per-decl name + kind + bytes)
│   ├─ _summary.json                        ([] empty in this build — use _manifest.json for counts)
│   └─ decls/
│       ├─ functions/<id>.js                (16,285 fn-decls)
│       ├─ vars/<id>.js                     (23,434 var files = 11,547 var-decl + 11,892 var-decl-empty)
│       ├─ classes/<id>.js                  (282 class decls)
│       ├─ ExpressionStatement/<id>.js      (487 top-level expression statements — registrations/IIFEs)
│       └─ IfStatement/<id>.js              (1 top-level if-statement — runtime guard)
└─ assets/
    ├─ _summary.json                        (asset counts — see table below)
    ├─ prompts/, prompts_index.json         (419 prompts, ~1.98 MB; index entries: {file,len,offset,headline})
    ├─ system_prompts/                      (12 per-prompt JSON files — top-level identity/steering/tool-section prompts)
    ├─ tools/                               (52 entries = 51 .md + _index.json; _index.json carries 50 tools; see below)
    ├─ tools_index.json                     (1 entry "explain_command" — legacy flat index, superseded by tools/_index.json)
    ├─ slash_commands.json                  (126 names — many are filesystem-path false positives; see Slash Commands note)
    ├─ env_vars.json                        ({all:683, claude_anthropic:328, bun:1, node:3} — object, not a flat array)
    ├─ cli_flags.json                       ({flags:885, subcommands:0} — object; subcommand bucket empty this build)
    ├─ feature_gates.json                   (1,447 `tengu_*` / experiment keys)
    ├─ endpoints.json                       ({total_urls:416, by_host:127 hosts} — object)
    └─ long_strings/                        (50 string-literal files over a size threshold)
```

### Asset summary (`assets/_summary.json`)

| Key | v2.1.193 | vs v2.1.183 | Notes |
|-----|----------|-------------|-------|
| `source_size` | 24,097,667 | up from 23,659,299 | the pretty bundle grew ~1.9 % (+19,333 lines: 699,346 → 718,679) |
| `prompts_total` | 419 | down from 428 | net prompt-corpus shrink (some prompt bodies consolidated/inlined) |
| `prompts_chars` | 1,984,300 | up from 1,976,209 | ~1.98 MB of prompt text, ~flat |
| `tools_unique` | 1 | unchanged | legacy detector under-counts; real per-tool inventory is in `assets/tools/` (50 tools) |
| `slash_commands` | 126 | up from 123 | many entries are filesystem-path false positives (see Slash Commands note) |
| `env_vars` (`all`) | 683 | up from 677 | the extractor undercounts — several real 193 vars are absent from this list (see caveat below) |
| `urls` / `hosts` | 416 / 127 | up from 414 / 126 | |
| `cli_flags` | 885 | up from 882 | |
| `cli_subcommands` | 0 | unchanged | the `subcommands` bucket is **empty** in this build's extractor (categorization quirk; not a feature removal) |
| `feature_gates` | 1,447 | up from 1,402 | the `tengu_*` experiment set grew ~3 % across the window |

> **Build metadata** (from `changelog_delta_scoping.md`, corroborated against the bundle): version 2.1.193, build_sha
> `a1938d2a07a2e4fecbef4eeac813221929e97d22` (short `a1938d2a`), build_time `2026-06-25T18:18:11Z`, bun 1.4.0
> (`fe06227f0`).

### Asset-extractor caveats (trust the code, not the raw list)

1. **`env_vars.json` is incomplete.** Several env vars that are demonstrably live in this build are **absent** from
   `assets/env_vars.json.all`: e.g. `OTEL_LOG_ASSISTANT_RESPONSES` (grep=3 in the bundle, the headline 2.1.193
   telemetry gate at `cli_inner_pretty.js:36363`), `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (grep=2, at
   `cli_inner_pretty.js:43175`/`43538`), and `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`. The extractor's heuristic misses
   programmatic / lazily-bound env reads. **Confirm an env var by grepping the bundle, not by membership in the list.**
2. **`cli_flags.json` misses constructed flags.** `--teammate-mode` is pushed programmatically by the inherited-flag
   builder (`pil`@`cli_inner_pretty.js:428485`) and so is **absent** from the 885-entry list, even though it is a real
   teammate-spawn flag. Same lesson — trust the construction site.
3. **`tools/_index.json` (50) is authoritative for the tool surface, not the 51 `.md` files.** Two `.md` are detector
   noise (`eval_registered________.md`, `explain_command.md`); `_index.json` lists `eval_registered__${...}` and an
   `mcp` pseudo-tool. Net real built-in/managed tool surface ≈ 48. Focus-feature signal: **`TeamCreate`/`TeamDelete`
   ABSENT** (carryover removal from the 2.1.178 redesign), **`WaitForMcpServers` PRESENT**, **`ReadMcpResourceDirTool`
   NEW** (2.1.193 — the deferred MCP directory-listing tool, `_ne` decl `cli_inner_pretty.js:283549`, object `:283584-283585`), `Cron*`/worktree
   tools present.
4. **`feature_gates.json` confirms a removal.** `tengu_billiard_aviary` (the immutable-memory / `tiny_memory`
   experiment) is **ABSENT** from the 1,447-key list — the asset corroborates the 2.1.193 auto-memory removal.
5. **`cli_unpack_pretty/_summary.json` is empty (`[]`)** in this build — decl counts come from `_manifest.json`
   (40,494 entries: 16,285 `fn-decl`, 11,547 `var-decl` + 11,892 `var-decl-empty`, 282 `class-decl`, 487
   `ExpressionStatement`, 1 `IfStatement`). The decl trees themselves are present and populated as before.

---

## How to Look Up a Symbol

The most useful entry point is the per-decl view in `cli_unpack_pretty/decls/`:

```
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_unpack_pretty/decls/vars/<id>.js
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_unpack_pretty/decls/functions/<id>.js
$ cat /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_unpack_pretty/decls/classes/<id>.js
```

This gives you the **isolated** body of that decl, free of unrelated context. The same obfuscated id is used as the
filename across the whole tree, so once you know the obfuscated name you have the file. For "what kind / how big is this
decl" lookups, `_manifest.json` carries kind + bytes for every output file.

For "where in the bundle was this decl emitted", grep `cli_inner_pretty.js` for the decl name with a leading
`var `/`function `/`class `/`let `/`const ` — the lexical position is stable within this single build.

```
$ grep -n 'function \$Cr()' /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js
58758:function $Cr() {
```

> ⚠️ **Obfuscated names are re-mangled every build.** A 2.1.183 obf id does **not** carry over — worse, it is often
> *reused for a different decl*. The cleanest example this window: **`$Cr` was `isSubagent` in 2.1.183 but is
> `isClassifyAllShellEnabled` in 2.1.193** (`cli_inner_pretty.js:58758`). Likewise `wt` is `onPermissionsOverlayClose`
> in one region (`:547334`) **and** `workflowAgentRunner` in another (`:423705`) within the *same* 193 build. Always
> re-derive the 2.1.193 obf id from a stable string anchor (tool name, telemetry event, env var, prompt literal) — the
> per-theme `symbol_additions_v2_1_193_<theme>.md` rows were each re-read in the live 193 bundle for exactly this reason.

---

## Where the 12 Themes Live in `cli_inner_pretty.js`

These are the load-bearing line regions for each theme. Anchors were grep/sed-verified against the 2.1.193 bundle. For
exhaustive per-symbol tables see the matching `symbol_additions_v2_1_193_<theme>.md`; for the verification spot-checks
see `cross_validation_report_<theme>.md`. The narrative module docs live under the numbered dirs.

**Current-state appendix:** Plan Mode is documented in `../05_plan_mode/` even though it is not counted as a thirteenth
delta theme. Its local tool pair is mostly carryover from 2.1.183, but the current 2.1.193 implementation spans tools,
attachments/reminders, permission context, compact carryover, UI, teammate approval, and remote Ultraplan prompts.

| Region | Plan Mode surface |
|--------|-------------------|
| `cli_inner_pretty.js:381500-381741` | `ExitPlanMode` schemas, approval flow, teammate leader approval, plan-file read/write, `prePlanMode` restore, and four tool-result branches |
| `cli_inner_pretty.js:381733-381944` | `EnterPlanMode` prompt fragment, prompt body, UI result renderers, and tool object |
| `cli_inner_pretty.js:3402-3417` | bootstrap flags: `hasExitedPlanMode`, `needsPlanModeExitAttachment`, and mode-crossing transition helper |
| `cli_inner_pretty.js:598780-598805` | permission-context lifecycle: `prepareContextForPlanMode` and `transitionPlanAutoMode` for `prePlanMode` / auto-mode reconciliation |
| `cli_inner_pretty.js:473394-473455` | plan-mode attachment cadence: count human turns, full/sparse reminder throttle, reentry attachment, exit attachment |
| `cli_inner_pretty.js:601213-601532` | plan-mode attachment rendering: full, sparse, subagent, and reentry reminder text |
| `cli_inner_pretty.js:470052-470064` | compact carryover: rebuild a full `plan_mode` attachment after compaction while still in plan mode |
| `cli_inner_pretty.js:640625-641219 / 646536-646605` | exit and enter plan-mode permission dialogs |
| `cli_inner_pretty.js:537540-537630` | remote Ultraplan lightweight, diagram-aware, and multi-agent planning reminders |

### 1. Permissions & Auto-mode → `../38_permissions/`

The densest theme: auto-mode shell trust (`classifyAllShell`), denial-reason surfacing, `sandbox.credentials`, the `ko`
sandbox controller + session-host cache, the recently-denied approve-persists fix, org model-entitlement restrictions,
and Agent named-spawn enforcement. Routes to `symbol_index_infra_platform.md` (Permissions/Sandbox/Model),
`symbol_index_core_features.md` (Auto-mode), and `symbol_index_core_execution.md` (Agent spawn).

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:55814` | `autoMode.classifyAllShell` zod settings field (NET-NEW 2.1.193 — route all Bash/PowerShell through the classifier) |
| `cli_inner_pretty.js:58758-58827` | `isClassifyAllShellEnabled` (`$Cr`@58758, OR over `Uys` SETTINGS_SOURCES@58827) |
| `cli_inner_pretty.js:416162-416271` | shell allow-rule suspend: `sTo`@416260 → `r9e`@416263 (bypass line `:416264`), dangerous-prefix `mqt`@416162, per-rule cache `Orl`@416271 |
| `cli_inner_pretty.js:597459-598268` | auto-mode allow layers: `isAutoMode` `dQl`@597459, `buildAutoModeAllowLayers` `NEe`@597462, suspended-rule display `yjo`@598268 |
| `cli_inner_pretty.js:382614-382627` | `classifyToolDenialKind` `XKa`@382614 (5-way taxonomy) + dark-launch gate `USe`@382624 (`return !1`) |
| `cli_inner_pretty.js:546166-546589` | denial store: `RecentDenialsProvider` `r4l`@546166, `useRecentDenials` `oSt`@546192, per-row reason spread `:546589` |
| `cli_inner_pretty.js:640262-640271` | denial record w/ `reason` `:640262` + the NET-NEW auto-mode-denied toast (truncated reason line) `:640271` |
| `cli_inner_pretty.js:54048-54095` | `sandbox.credentials` schema: `kwr`@54048 (files), `Rwr`@54058 (envVars), `IEu`@54069 (credentials), wired into root @54095 |
| `cli_inner_pretty.js:211560-212031` | credential protection resolve: `Rqi`@211660 (`denyReadPaths`/`unsetEnvVars`), `Yjd`@211675 / merge @211677 (fs denyRead fold), staged mask registry `FRn`@212031 |
| `cli_inner_pretty.js:219238-219864` | `ko` sandbox controller @219848 + session hosts: `addSessionAllowedHost` `_Wd`@219238, `BLn`@219833 (merged 219287, cleared 219748), reset `kWd`@219864 |
| `cli_inner_pretty.js:547100-547334` | recently-denied overlay: `PermissionsOverlay` `H4l`@547100, `RecentDeniedTab` `f4l`@546479, approve-persists close handler `wt`@547334 |
| `cli_inner_pretty.js:102806-103212` | org model restrictions: `buildRestrictedModelSet` `d7u`@102809, `isModelRestrictedByEntitlements` `NFe`@102814, picker filter `Ia`@102873, fallback `u_n`@103212 |
| `cli_inner_pretty.js:487243` | `/model` switch denial (`switchModel` `tzt`, `denied_by_entitlement`) |
| `cli_inner_pretty.js:430268-430518` | Agent named-spawn enforcement: allow-list `Wil`@430268, upfront deny block `:430515`, `SubagentSpawnError` `E9e`@430518 |
| `cli_inner_pretty.js:426557-640198` | bg-subagent worker permission forwarding (CARRYOVER): `M8n`@426557, `rdc`@640151, `permission_swarm_forward` `:640198` |

### 2. Background Agents → `../36_background_agents/`

Memory-pressure idle bg-shell reaping (NET-NEW 2.1.193), subagent depth tracking (resumed restore + forked count, 2.1.187),
agent stop lifecycle (permanent stop, 2.1.191), and backgrounding/panel fixes. Routes to `symbol_index_core_features.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:454302-454610` | bg-shell pressure reaper: `registerBgShellPressureReaper` `Mgl`@454354, `notifyAndFinalizeShellTask` `o8t`@454302, `BG_SHELL_IDLE_REAP_MS` `eof`@454610 (=1800000) |
| `cli_inner_pretty.js:43175 / 43538` | env `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` `Ldu` (getter @43175, parse @43538) |
| `cli_inner_pretty.js:587048-587093` | `hasActiveAgentTasks` `e8e`@587048 + `ACTIVE_AGENT_TASK_TYPES` `R4f`@587093 (reaper guard) |
| `cli_inner_pretty.js:229871` | `SUBAGENT_DEPTH_LIMIT` `FBt`@229871 (=5; carryover of 183 `v1i`@221800) |
| `cli_inner_pretty.js:103808` | `getAgentDepth` `K3`@103808 (carryover of 183 `Gz`@103152) |
| `cli_inner_pretty.js:430357-430480` | `SubagentLaunchError` `RPe`@430357 + depth-cap throw `Re("subagent_launch","subagent_depth_cap")`@430480 |
| `cli_inner_pretty.js:431808-431816` | agent stop: `markAgentStoppedByUser` `Mde`@431808, `persistStopMarker` `CXp`@431816 |
| `cli_inner_pretty.js:581864-581895` | agent disk state: `agentStateMetaPath` `t7l`@581864 (`<id>.meta.json`), `writeAgentDiskState` `Tde`@581867, `readAgentDiskState` `Hre`@581895 |
| `cli_inner_pretty.js:441779` | `AgentStoppedError` `Vht`@441779 (thrown on resume of a stopped agent) |
| `cli_inner_pretty.js:578006-578073` | backgrounding fix: `computeCarryOverMap` `fze`@578006, `countCarryOverTasks` `H7t`@578070, `countAbandonedBgTasks` `oUo`@578073 |
| `cli_inner_pretty.js:454100 / 577927-577951` | phantom-subagent + adopt fix: `registerCompletedResumedAgent` `Lgl`@454100, `readJobDir` `JKl`@577927, `linkAdoptedAgentTranscript` `QKl`@577951 |
| `cli_inner_pretty.js:193511-193542 / 484488 / 485419 / 465236-465238` | bg-job metadata refresh: `$Kr` cwd override @193511, `k3i` cwd/originCwd refresh @193514 (called after `/cd` @484488), `R3i` resumeSessionId/linkScanPath refresh @193529 (called after conversation reset @485419), classifier consumes override @465236/@465238 |
| `cli_inner_pretty.js:431253-431264` | `async_launched` tool-result text drops "…and end your response. Do not generate any other text…" so the agent keeps working while the bg agent runs ("end your response" 4→2 vs 183; cloud `remote_launched` path still says it) |

### 3. MCP → `../39_mcp/`

`claude mcp login/logout` CLI (2.1.186), headersHelper 401/403 re-auth (2.1.193), capability/OAuth retries + 404
(2.1.191), get/remove name suggestions (2.1.186), remote tool-call idle timeout (2.1.187), startup needs-auth notice.
Routes to `symbol_index_infra_platform.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:613276-613593` | login/logout CLI: `mcpAuthModule` `g3o`@613276, `mcpLoginHandler` `L9f`@613318, `mcpLogoutHandler` `D9f`@613467, `buildMcpCommand` `anc`@613523, `login`/`get`/`remove`/`logout` cmd reg @613582/613570/613544/613593 |
| `cli_inner_pretty.js:281573-283086` | shared OAuth: `createRetryingOAuthFetch` `AOn`@281573 (retry-once 2.1.191), `runOAuthFlow` `oX`@281953, `OAuthAbort` `Vj`@283086 |
| `cli_inner_pretty.js:292133-292230` | retry/transient predicates + caches: `isSessionExpiredError` `fAa`@292133, `isNetworkTransientError` `ppp`@292140, `isRetryableError` `gpp`@292155, `listWithPaginationAndRetry` `P1n`@292176, `resolveIdleTimeoutMs` `_pp`@292213, needs-auth cache `gao`@292222 |
| `cli_inner_pretty.js:293017-293311` | `callToolWithWatchdog` `bao`@293017 with idle/transport watchdog; idle-reset @293098, DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS `hpp`@293311 (=300000) |
| `cli_inner_pretty.js:293137-293424` | headersHelper re-auth on 401/403: dedup `pao`@293138/293460, `Ct("mcp_headers_helper","reauth_retry")`@293143, reconnect `nT`/`ID`@293146, `McpReauthError` `lWe`@293424 (thrown @293179) |
| `cli_inner_pretty.js:293455-293999` | `RETRY_BACKOFFS` `mpp`@293455, idle-timeout transports `ypp`@293456, `ENDPOINT_NOT_FOUND` code+message rewrite @293997 (HTTP 404 fix) |
| `cli_inner_pretty.js:43147 / 43611` | env `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` `Jpu` (getter map @43147, def @43611) |
| `cli_inner_pretty.js:610416-611549` | name suggestions: `suggestClosestServerName` `t3o`@610416, `mcpRemoveHandler` `a9f`@611388, `mcpGetHandler` `f9f`@611549 |
| `cli_inner_pretty.js:228300 / 471037` | retired-tool notice: `RETIRED_TOOL_NAMES` `HBt`@228300, `computeDeferredToolsDelta` `oko`@471037 (skip @471050) |
| `cli_inner_pretty.js:504183-504324` | startup needs-auth notice render (`"… run /mcp to authenticate…"`, NET-NEW 2.1.193) |

### 4. Telemetry / OTEL → `../44_telemetry/`

The `claude_code.assistant_response` OTEL log event (NET-NEW 2.1.193) + the `OTEL_LOG_USER_PROMPTS` inheritance gotcha.
Routes to `symbol_index_infra_platform.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:468542` | `recordApiRequestTelemetry` `cSl`@468542 (emits `api_request` then the NEW `assistant_response` event) |
| `cli_inner_pretty.js:195205-195214` | redaction gates: `isUserPromptLoggingEnabled` `GNd`@195205, `redactIfDisabled` `V1t`@195208, **`isAssistantResponseLoggingEnabled` `dGi`@195211** (`Be.OTEL_LOG_ASSISTANT_RESPONSES ?? Be.OTEL_LOG_USER_PROMPTS` — the inheritance gotcha), `logOTelEvent` `Jc`@195214 |
| `cli_inner_pretty.js:36256-36424` | env plumbing: getter namespace `NHr`@36256 (`OTEL_LOG_ASSISTANT_RESPONSES:()=>FZc`@36266), `FZc` value @36363 (decl) / @36424 (bind), `BZc`=`OTEL_LOG_USER_PROMPTS` @36362/36423 |
| `cli_inner_pretty.js:43951-43996` | `makeEnvProxy` `$cs`@43951 + `managedEnvProxy` `Be`@43996 (per-access `.parse(process.env[key])`) |
| `cli_inner_pretty.js:285861-286044` | truncation: `truncateForTelemetry` `CD`@285861, `TELEMETRY_CONTENT_LIMIT_BYTES` `xcp`@286044 (=61440) |

### 5. Workflow / StructuredOutput → `../42_workflow/`

NET-NEW StructuredOutput post-success lockout + inline enforcement that replaces the 183 Stop-hook (2.1.187), the
`agent({schema})` 5-failure retry cap (2.1.186), and the `/workflows` detail `f` status filter (2.1.186). Routes to
`symbol_index_core_features.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:229472-229559` | SO core (carryover anchors): `STRUCTURED_OUTPUT_TOOL` `Ep`@229498, base tool `$Qr`@229509, `schemaToolFactory` `qVd`@229472, compact `renderToolUseMessage`@229544 |
| `cli_inner_pretty.js:398565-398601` | `subagentQueryGenerator` `m4`@398565 gains `requiresStructuredOutput`@398601 (grep 0→8 vs 183) |
| `cli_inner_pretty.js:423705-424307` | `workflowAgentRunner` `wt`@423705 hosts success guard + retry cap; `retryCap`@423782, failed-SO counter @423819; `STALL_RETRY_CAP` `kol`@424306, `DEFAULT_SO_RETRIES` `NYp`@424307 (=5) |
| `cli_inner_pretty.js:465479-465901` | inline enforcement (replaces 183 Stop-hook): `findLastUserIndex` `Abl`@465479, `messagePrepGenerator` `vbl`@465576, `ENFORCE_SENTINEL` `Hbl`@465901 (`"[structured-output-enforce]"`) |
| `cli_inner_pretty.js:601998` | `structuredOutputSucceeded` `Ibl`@601998 (latest SO `tool_use` has a non-error result) |
| `cli_inner_pretty.js:541975-543273` | `/workflows` `f` status filter: `agentStatus` `D$e`@541975, `cycleStatusFilter` `pe`@543007, filter order `eYt`@543272, `STATUS_LABELS` `XOo`@543273 |
| `cli_inner_pretty.js:575795` (183) | removed Stop-hook `registerStructuredOutputStopHook` `zKn` — **gone in 193** (the 183 before-picture) |

### 6. Agent Team → `../30_agent_team/`

`teammateMode: "iterm2"` explicit pin (2.1.186), `--effort` inheritance into pane teammates (2.1.186), stop-notification
attribution + "finished"/"stopped" wording (2.1.187). Routes to `symbol_index_core_features.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:54136` | `EXEC_MODE_ENUM` `uhs`@54136 (`["auto","tmux","iterm2","in-process"]`; 183 lacked `"iterm2"`) |
| `cli_inner_pretty.js:363523-363571` | iTerm2 detection: `isInsideITerm2` `R8`@363523, `isIt2CliReachable` `Rft`@363533, `IT2_BIN` `xft`@363571 |
| `cli_inner_pretty.js:429024-429964` | backends: `ITermBackend` `rvo`@429024, `createITermBackend` `svo`@429181, `detectAndGetBackend` `kPe`@429186, pane-fallback hint `iXp`@429964 |
| `cli_inner_pretty.js:428485 / 429445` | `--effort` inheritance: `buildInheritedCliFlags` `pil`@428485 (also pushes `--teammate-mode`), subagent variant `Mil`@429445 |
| `cli_inner_pretty.js:149794` | `isLaunchEffortUnpinned` `PIe`@149794 (effort-pin gate) |
| `cli_inner_pretty.js:431759-453871` | stop attribution: `stopTask` `kht`@431759 (`killedBy`), `enqueueAgentNotification` `Eqe`@453792 ("finished"/"was stopped by…"), `killAndNotifyTask` `GSe`@453871, idle banner `LEo`@390965 |
| `cli_inner_pretty.js:430391` | `team_name` Agent param `"Deprecated; ignored…"` (CARRYOVER, byte-identical to 183) |

### 7. Skills → `../45_skills/`

Frontmatter multi-case key tolerance + malformed-YAML `parseError` surfacing (2.1.186), and a `/plugin` Installed-tab
"Skills" section (2.1.186). Routes to `symbol_index_core_features.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:149233-149612` | frontmatter pipeline: `shadowValidateFrontmatter` `ije`@149238, schemas `tVr`@149302/`WEd`@149347, `normalizeFrontmatterKey` `KEd`@149400, canonical keys `zEd`@149406, `parseMarkdownFrontmatter` `Gm`@149511, regex `eye`@149612 |
| `cli_inner_pretty.js:451524-451677` | skill loading: `parseSkillFrontmatterFields` `UCo`@451524, `loadSkillsFromDir` `uyt`@451677 (consumes `parseError` → `skill_load_yaml_failed`) |
| `cli_inner_pretty.js:519209-519226` | `/plugin` Installed-tab section: `pluginScopeSectionLabel` `OAf`@519209 adds `case "skills": return "Skills"`@519226 |

### 8. Tools → `../04_tools/`

`!` bash-command auto-respond (2.1.186), bash-mode live path autocomplete (2.1.193), and the tool-surface delta
(`ReadMcpResourceDirTool`). Routes to `symbol_index_core_execution.md` (+ MCP-dir-tool to `symbol_index_infra_platform.md`).

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:56492` | `respondToBashCommands` settings schema field (default `?? !0`) |
| `cli_inner_pretty.js:617560-617611` | `!` auto-respond: `bashModeModule` `Mrc`@617560, `processBashCommand` `y6f`@617562 (read @617564, `respond` telemetry field @617565, gate @617604, `shouldQuery`@617611) |
| `cli_inner_pretty.js:629382-629401` | bash-mode path autocomplete: `liveSuggestionCallback` `se`@629382, `"bash-path"` kind marker @629396 (accept handlers @629693/629874) |
| `cli_inner_pretty.js:188582-188651` | path-completion machinery (CARRYOVER): `isPathLikeToken` `dKr`@188582, `scanDirectoryForCompletion` `QOd`@188593, `getPathCompletions` `pKr`@188612, scan cap `m4i`@188641 |
| `cli_inner_pretty.js:283504-283585` | tool-surface delta: `ReadMcpResourceDirTool` name `iX`@283504, object `_ne` decl @283549 / assignment @283584-283585 (`shouldDefer:!0`, NET-NEW 2.1.193) |
| `cli_inner_pretty.js:444127-444225` | registry: `getBuiltinToolRegistry` `b4`@444127 (carryover), `getAvailableTools` `a$`@444225 (exclusion set 3→4, `+_ne.name`) |

### 9. Slash Commands / Plugins / Hooks / CLI → `../43_slash_commands/`

`/rewind` before `/clear` (2.1.191), marketplace `renames` plugin auto-follow (2.1.193), hooks comma-separated matcher
fix (2.1.191), `/add-dir` message + `/btw` nav + `/review`→`/code-review medium` + retry cap (2.1.193/.187/.186),
plus a current-version `/voice` input subsystem deep dive.
Routes to `symbol_index_infra_integration.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:582712-584448` | `/rewind`: anchor writer `hYt`@582712, mirror `MUo`@582725, `readTranscriptChain` `tde`@584448 |
| `cli_inner_pretty.js:705599 / 707200-707234` | `resolveRewindAnchors` `XRc`@705599, rewind-conversation handler @707200, `tengu_rewind_first_message` gate @707201 |
| `cli_inner_pretty.js:2575` | `resetSessionForClear` `Jdr`@2575 (mints new session id, emits `"clear"`) |
| `cli_inner_pretty.js:55667-55675` | plugin `renames`: marketplace schema field @55667, `PLUGIN_ID_SCHEMA` `jBe`@55675 |
| `cli_inner_pretty.js:478428-479482` | rename resolution: `resolvePluginRename` `s_t`@478428, `MAX_RENAME_CHAIN` `Gdf`@478477, settings migrator `NHl`@478443, loader follow `p0o`@479482 |
| `cli_inner_pretty.js:195349 / 612532` | telemetry `emitPluginRenamedTelemetry` `k0n`@195349, orphan-detector renames exclusion `S9f`@612532 |
| `cli_inner_pretty.js:589634-591335` | hooks comma matcher: `hookMatcherMatches` `s3f`@589634 (4th param `allowComma`), `HOOK_EVENT_NAMES` `o3f`@591335, allowComma feed @589831 |
| `cli_inner_pretty.js:177994` | `/add-dir` `formatAddDirResult` `jot`@177994 (already-a-working-dir branch) |
| `cli_inner_pretty.js:482363 / 482757` | `/btw` ←/→ nav: regex `xpf`@482363, key handler @482757 |
| `cli_inner_pretty.js:538510-538534` | `/review`→code-review: `buildPrReviewPrompt` `rRf`@538510, `reviewCommand` `oRf`@538534 (`effort:"medium"`) |
| `cli_inner_pretty.js:603209-603261` | retry cap: `getMaxRetries` `O5f`@603209, `MAX_RETRIES_CAP` `Ujo`@603244 (=15), `DEFAULT_MAX_RETRIES` `_5f`@603243 |
| `cli_inner_pretty.js:571873-572545` | `/voice`: account/auth/policy availability gates, command parser `parseVoiceCommandMode` `_Ff`@572478, handler `voiceCommandHandler` `bFf`@572485 |
| `cli_inner_pretty.js:571894-572176` | Voice STT stream: connectivity probe, `connectVoiceStream` `knr`@571951, WebSocket path `YBf`@572173, keepalive / transcript / finalization handling |
| `cli_inner_pretty.js:572330-572455` | Local recording backend: dependency check, microphone permission, native recorder / SoX / arecord start paths, `stopRecording` `izl`@572450 |
| `cli_inner_pretty.js:649447-650365` | Voice hooks and prompt integration: audio-level scoring, session orchestration, hold/tap key handler, prompt anchoring, interim/final transcript insertion |
| `cli_inner_pretty.js:178028-179009` | Voice state/context and keybinding metadata: `VoiceProvider`, default voice state, default Space binding, custom-binding warning for letter keys |

### 10. System Prompt → `../40_system_prompt/`

Env-block agent-proxy diagnostic line (Remote/proxy-only), model-switch reminder Remote branch, memory-prompt dedup
(removed `## Recalled memories` subsection), identity/builder carryover. Routes to `symbol_index_infra_platform.md` (Prompt).

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:592845-592878` | env-block builder `computeEnvInfo` `W3f`@592845, agent-proxy slot `${l}`@592873-592878 |
| `cli_inner_pretty.js:151173-151179` | agent-proxy line plumbing: `setAgentProxyEnvLine` `h$t`@151173, `getAgentProxyEnvLine` `Nwn`@151176, module var `Bki`@151179 |
| `cli_inner_pretty.js:616578-616595` | `buildAgentProxyEnvLine` `C3o`@616578 + `buildAgentProxyReadme` `Z8f`@616595 |
| `cli_inner_pretty.js:705779-705789` | model-switch replay `handleModelSwitchReplay` `le`@705779 (`CLAUDE_CODE_REMOTE` branch pushes the NET-NEW "now running as" reminder) |
| `cli_inner_pretty.js:599667` | `buildModelSwitchReminders` `XQl`@599667 (CARRYOVER generic `/model` replay) |
| `cli_inner_pretty.js:152092-152262` | memory-prompt dedup: `memoryStalenessGuidance` `Kwn`@152092, `whenToAccessMemories` `p0i`@152255, `beforeRecommendingFromMemory` `A$t`@152262 (183-only `## Recalled memories` `_gi`@151568 removed) |

### 11. Auto Memory & Dream → `../31_auto_memory/`

Largely carryover; the headline is the **removal** of the `tengu_billiard_aviary` immutable-memory / `tiny_memory`
experiment, plus the carryover `MEMORY.md` compact reminder + dream throttle. Routes to `symbol_index_core_features.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:151593` | `parseMemoryStoresEnv` `qae`@151593 (`CLAUDE_MEMORY_STORES`) |
| `cli_inner_pretty.js:151952-152573` | `MEMORY.md` limits: filename `UH`@151952, line limit `RY`@151953 (=200), byte limit `Kae`@151954 (=25000), `truncateMemoryIndexForPrompt` `v$t`@152573 (compact-it WARNING) |
| `cli_inner_pretty.js:152389-152638` | recall/system-prompt builders `m0i`@152389 / `g0i`@152460 / `VVr`@152638 (carryover) |
| `cli_inner_pretty.js:463735-463839` | dream: `buildConsolidationPrompt` `$_l`@463735, throttle `Daf`@463818, `executeAutoDream` `j_l`@463839 (`aH()` immutable branch removed) |
| `cli_inner_pretty.js:147670-147673` (183) | REMOVED before-picture: `selectMemoryType` `XXu`@147670, `isImmutableMemoryEnabled` `aH`@147673 (gate `tengu_billiard_aviary`) — grep=0 in 193 |

### 12. Compact → `../07_compact/`

Behavior-preserving refactor of the auto-compact dispatcher (flat `{wasCompacted}` → discriminated `{kind}` union) +
helper extractions + carryover ledger. Routes to `symbol_index_core_features.md`.

| Region | What lives there |
|--------|------------------|
| `cli_inner_pretty.js:235039-235138` | extracted helpers: `resolveThresholdSource` `WDn`@235039 (6-source), `rapidRefillCount` `u8d`@235127, `rapidRefillBreaker` `VDn`@235130, `makeCompactedState` `VZr`@235134, `RAPID_REFILL_WINDOW` `VXi`@235137, `THRASH_MESSAGE` `qZr`@235138 |
| `cli_inner_pretty.js:470189-470357` | dispatcher cluster: `compactFailedResult` `CSl`@470189, `prefixOverflowProbe` `acf`@470203, `isColdCompact` `Xxo`@470235, `autocompactNeeded` `lcf`@470238, `autoCompactDispatcher` `Rxo`@470250 (`{kind:"not_needed"}` on disable), spinner hint `ccf`@470349, `FAILURE_BREAKER_MAX` `ISl`@470357 (=3) |
| `cli_inner_pretty.js:469797-469978` | `streamCompactSummary` `wSl`@469797 (honors `--fallback-model`; `query_source:"compact"`@469978) |
| `cli_inner_pretty.js:2875-2878` | 1M-credits clamp flag: getter `wYe`@2875, setter `Lpr`@2878 (body `Nt.longContext1mCreditsBlocked`@2876) |
| `cli_inner_pretty.js:102179` | `CONTEXT_HINT_BETA` `pOr`@102179 (micro-compaction beta gate; carryover, no version bump) |
| `cli_inner_pretty.js:461531` (183) | before-picture: `autoCompactDispatcher` `Ego`@461531 (flat `{wasCompacted}` return; survives as 193 `Rxo`) |

---

## Asset Stable-String Anchors (for re-anchoring)

When a line region shifts, re-anchor from these stable asset strings. **Always confirm against the bundle** — the
extractor undercounts env vars and constructed flags (see caveats above).

- **Tools** (`assets/tools/_index.json`, 50): `TeamCreate`/`TeamDelete` ABSENT, `WaitForMcpServers` PRESENT,
  `ReadMcpResourceDirTool` NEW (2.1.193), `Agent`/`SendMessage`/`Workflow`/`StructuredOutput`/`Skill`/`Cron*` present.
- **Feature gates** (`assets/feature_gates.json`, 1,447): `tengu_billiard_aviary` ABSENT (auto-memory removal);
  PRESENT — `tengu_amber_flint` (agent-team), `tengu_onyx_plover` (dream throttle), `tengu_rewind_first_message`,
  `tengu_plugin_renamed`, `tengu_mcp_list_paginated`, `tengu_auto_compact_circuit_breaker`, `tengu_feature_bad` /
  `tengu_feature_sad` (the depth-cap + reauth loggers), `tengu_frontmatter_shadow_unknown_key`.
- **Env vars** (`assets/env_vars.json.all`, 683 — INCOMPLETE): PRESENT — `OTEL_LOG_USER_PROMPTS`, `CLAUDE_CODE_MAX_RETRIES`,
  `CLAUDE_CODE_RETRY_WATCHDOG`, `CLAUDE_CODE_COLD_COMPACT`, `CLAUDE_CODE_FORK_SUBAGENT`, `CLAUDE_CODE_REMOTE`.
  **ABSENT from the list but live in the bundle** (grep to find): `OTEL_LOG_ASSISTANT_RESPONSES` (@36363),
  `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (@43175/43538), `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (@43147/43611).
- **CLI flags** (`assets/cli_flags.json.flags`, 885): PRESENT — `--effort`, `--bg`/`--background`, `--tools`,
  `--model`, `--no-browser`, `--resume`. **ABSENT but constructed at runtime**: `--teammate-mode` (pushed by `pil`@428485).

---

## Slash Commands (126 entries)

From `assets/slash_commands.json`. As in prior builds, many array entries (`/bin`, `/etc`, `/opt`, `/proc`, `/tmp`,
`/usr`, `/var`, `/sbin`, …) are filesystem paths the extractor's `/`-leading heuristic falsely classified as slash
commands. **Trust the handler / definition site, not the raw list**, when confirming a command exists. The
focus-feature surfaces here are `/rewind` (resume before `/clear`), `/workflows` (`f` status filter), `/btw` (←/→ nav),
`/add-dir`, `/review`, `/plugin`, `/mcp`, and `/bg`.

## Tools (`assets/tools/`, 50 in `_index.json`)

The per-tool inventory (`tools/_index.json` + one `.md` per tool, each carrying `{name, userFacingName, searchHint,
descriptionLen, promptLen, schemaLen, isReadOnly, isConcurrencySafe, offset}`) is the authoritative tool surface for
this build. The `offset` field is a byte offset into `cli_inner_pretty.js` for locating the tool's definition site.

## Prompts (`assets/prompts/`, 419 prompts)

`assets/prompts_index.json` is a list of `{file, len, offset, headline}` records — the `offset` is a byte offset into
`cli_inner_pretty.js`, useful for locating the emit site of a large prompt body (e.g. the env-block builder, the memory
guidelines, the agent-proxy README).

---

## Map: `analyze/` Module Dir → What It Documents

Twelve theme dirs, one current-state Plan Mode appendix, plus `00_overview/` (this index + four `symbol_index_*.md` routing tables + twelve
`symbol_additions_v2_1_193_*.md` exhaustive tables + twelve delta `cross_validation_report_*.md` verification reports + one Plan Mode current-state validation report +
`changelog_analysis.md` + `changelog_delta_scoping.md`). The `by_version/` dir is present but unpopulated in this tree.

| Dir | Routes to (symbol index) | Scope (v2.1.183 → v2.1.193 delta) | Key docs |
|-----|--------------------------|------------------------------------|----------|
| `38_permissions/` | infra_platform (+ core_features + core_execution) | auto-mode `classifyAllShell`, denial-reason surfacing, `sandbox.credentials`, `ko` controller + session hosts, org model restrictions, approve-persists, Agent named-spawn + bg-subagent forwarding | `classify_all_shell.md`, `denial_reasons_surfacing.md`, `sandbox_credentials.md`, `org_model_restrictions.md`, `recent_denied_overlay.md`, `background_subagent_permission_forwarding.md` |
| `36_background_agents/` | core_features | bg idle-shell pressure reaping, subagent depth tracking (resumed/forked), agent stop lifecycle, backgrounding/panel fixes | `bg_shell_pressure_reap.md`, `subagent_depth_tracking.md`, `agent_stop_lifecycle.md`, `backgrounding_and_panel_fixes.md` |
| `39_mcp/` | infra_platform | `claude mcp login/logout` CLI, headersHelper 401/403 reauth, capability/OAuth retries, get/remove name suggestions, tool-call idle timeout | `mcp_login_logout_cli.md`, `headers_helper_reauth.md`, `reliability_retries.md`, `server_name_suggestions.md`, `tool_call_idle_timeout.md` |
| `44_telemetry/` | infra_platform | `assistant_response` OTEL event + `OTEL_LOG_USER_PROMPTS` inheritance gotcha | `assistant_response_event.md` |
| `42_workflow/` | core_features | StructuredOutput post-success lockout + 5-attempt cap, `/workflows` status filter | `structured_output_call_control.md`, `workflows_detail_status_filter.md` |
| `30_agent_team/` | core_features | `teammateMode: "iterm2"`, `--effort` inheritance, stop attribution | `teammate_mode_iterm2.md`, `effort_inheritance.md`, `stop_attribution.md` |
| `45_skills/` | core_features | frontmatter case-tolerance, malformed-YAML handling, `/plugin` Installed Skills section | `frontmatter_case_tolerance.md`, `malformed_yaml_handling.md`, `plugin_installed_skills_section.md` |
| `04_tools/` | core_execution | `!` bash auto-respond, bash-mode path autocomplete, tool-surface delta | `bash_input_respond.md`, `bash_mode_autocomplete.md`, `tool_surface_delta_193.md` |
| `43_slash_commands/` | infra_integration | `/rewind` before `/clear`, hook comma matcher fix, plugin auto-rename, `/add-dir`+`/btw`+`/review`+retries, current-version voice input | `rewind_before_clear.md`, `hook_matcher_comma_fix.md`, `plugin_auto_rename.md`, `cli_input_and_review_misc.md`, `voice_input.md` |
| `40_system_prompt/` | infra_platform (Prompt) | env-block agent-proxy line, system-reminder catalogue delta | `env_block_agent_proxy_line.md`, `reminder_catalogue_delta_193.md` |
| `31_auto_memory/` | core_features | `tengu_billiard_aviary` immutable-memory removal, MEMORY.md compact reminder + dream carryover | `billiard_aviary_immutable_memory_removal.md`, `memory_reminder_and_dream_carryover.md` |
| `07_compact/` | core_features | `Ego`→`Rxo` discriminated-union dispatcher refactor (behavior-preserving) + carryover ledger | `README.md` |
| `05_plan_mode/` | core_features | current-state Plan Mode tool pair, lifecycle state machine, reminder cadence, prompt surface, approval UI, compact carryover, remote Ultraplan scaffolding | `README.md`, `lifecycle_state_machine.md`, `reminder_cadence.md`, `prompt_surface.md`, `ui_permission_flow.md` |

### `00_overview/` contents

- `file_index.md` — this file.
- `symbol_index_core_execution.md` — Core execution routing (Agent Loop, Tools, LLM API, Agents, Subagent, State; the
  Agent named-spawn + tool-surface symbols route here).
- `symbol_index_core_features.md` — Core feature routing (Background Agents, Workflow, Agent Team, Skills, Auto-mode,
  Auto-Memory, Compact symbols route here).
- `symbol_index_infra_platform.md` — Platform routing (MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry).
- `symbol_index_infra_integration.md` — Integration routing (LSP, Chrome, IDE, UI, Plugin, Shell Parser, Slash Commands, Voice Input).
- `symbol_additions_v2_1_193_{permissions,background_agents,mcp,telemetry,workflow,agent_team,skills,tools,slash_commands,system_prompt,auto_memory,compact}.md`
  — twelve per-theme exhaustive new-symbol tables, each opening with a ROUTING NOTE naming its `symbol_index_*.md`.
- `cross_validation_report_<theme>.md` — twelve per-theme adversarial delta verification reports (citation spot-checks,
  forbidden-table scans, broken-link sweeps, v2.1.183 before-picture corroboration).
- `cross_validation_report_plan_mode.md` — current-state Plan Mode appendix validation against 2.1.193 anchors,
  2.1.183 before-picture evidence, and the 2.1.88 named-source mirror.
- `changelog_analysis.md` — the source-cited narrative over the whole window.
- `changelog_delta_scoping.md` — the changelog-derived plan (build facts + per-version theme map).

---

## Lookup Workflow

**Goal: Find which decl implements one of the twelve themes' changes**

1. Pick a unique string for the change (tool name, telemetry event, env var, settings field, prompt fragment) — see
   "Asset Stable-String Anchors" above.
2. `grep -n "<string>" /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
3. From the surrounding ~30 lines, identify the enclosing decl name (the obfuscated identifier just before `=` for
   vars, or after `function` for fn-decls).
4. Open `cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` for the isolated decl.
5. If the decl references other obfuscated ids, recurse on those.

**Goal: Validate a v2.1.183 → v2.1.193 delta claim**

1. Find the corresponding v2.1.183 region (`../../../claude_code_v_2.1.183/analyze/00_overview/file_index.md`).
2. Grep the same stable string in v2.1.193 source.
3. Compare obfuscated names — they re-mangle every build, and an old id may be reused for a different decl (`$Cr`
   183=`isSubagent` → 193=`isClassifyAllShellEnabled`). The string literals are the stable anchor. Confirm the claim
   against the matching `symbol_additions_v2_1_193_<theme>.md` row and `cross_validation_report_<theme>.md`.

---

## See Also

- `symbol_index_core_execution.md` / `symbol_index_core_features.md` / `symbol_index_infra_platform.md` /
  `symbol_index_infra_integration.md` — the four canonical symbol-routing tables.
- `symbol_additions_v2_1_193_<theme>.md` — exhaustive per-theme new-symbol tables (twelve files).
- `cross_validation_report_<theme>.md` — per-theme delta verification reports (twelve files), plus
  `cross_validation_report_plan_mode.md` for the Plan Mode current-state appendix.
- `changelog_analysis.md` — the source-cited narrative for the whole v2.1.183 → v2.1.193 window.
- `changelog_delta_scoping.md` — the changelog-derived plan + build facts.
- `../CHANGELOG.md` — upstream changelog (bullet source of truth for the 2.1.185 → 2.1.193 window).
- `../../../claude_code_v_2.1.183/analyze/00_overview/file_index.md` — prior-window index (v2.1.156 → v2.1.183).
