# Changelog Analysis — Claude Code v2.1.183 → v2.1.193 (Twelve-Theme Autonomy-Hardening Delta)

This document is the **long-form architectural narrative** for the v2.1.185 → v2.1.193 window, read **through the lens of the twelve themes this tree was scoped to**. Where the prior window (v2.1.156 → v2.1.183) *introduced whole features* — the implicit agent-team redesign, the `ultracode` keyword, nested subagents — this window is overwhelmingly **maturation of the autonomy surface already shipped**, plus exactly two genuinely new surfaces (`autoMode.classifyAllShell` and `/rewind`-before-`/clear`).

The single through-line is **harden the autonomy surface**: auto mode gets *stricter and more transparent* (classify all shell, surface every denial reason), MCP gets *more resilient* (idle-timeout, self-healing re-auth, discovery/OAuth retries), the background/subagent lifecycle gets *more correct* (memory-pressure reaping, fork-aware depth counting, permanent stop, attribution), and observability *deepens* (the `assistant_response` OTEL event). Almost every change is a small, surgical edit on mature machinery rather than a new subsystem.

It complements:

- The twelve per-theme delta trees under `../` — [`38_permissions/`](../38_permissions/), [`36_background_agents/`](../36_background_agents/), [`39_mcp/`](../39_mcp/), [`44_telemetry/`](../44_telemetry/), [`42_workflow/`](../42_workflow/), [`30_agent_team/`](../30_agent_team/), [`45_skills/`](../45_skills/), [`04_tools/`](../04_tools/), [`43_slash_commands/`](../43_slash_commands/), [`40_system_prompt/`](../40_system_prompt/), [`31_auto_memory/`](../31_auto_memory/), [`07_compact/`](../07_compact/)
- The four `symbol_index_*.md` files — [core execution](symbol_index_core_execution.md), [core features](symbol_index_core_features.md), [platform infra](symbol_index_infra_platform.md), [integration infra](symbol_index_infra_integration.md)
- The twelve per-theme additions tables — `symbol_additions_v2_1_193_*.md` — and the twelve `cross_validation_report_*.md` adversarial logs
- The changelog-derived scoping plan — [`changelog_delta_scoping.md`](changelog_delta_scoping.md)
- The prior window's narrative — [`../../../claude_code_v_2.1.183/analyze/00_overview/changelog_analysis.md`](../../../claude_code_v_2.1.183/analyze/00_overview/changelog_analysis.md) (v2.1.156 → v2.1.183)

Every factual claim is cited as `cli_inner_pretty.js:<line>`, verified by reading that line in the **v2.1.193** bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines; build SHA `a1938d2a…`, build_time 2026-06-25, bun 1.4.0). Lines tagged `(183)` are deliberate **before-pictures** read in the prior bundle (699,346 lines, build `9d251abd…`, 2026-06-18). Obfuscated names are **re-mangled between builds** — every v2.1.193 name here was re-derived in the 2.1.193 bundle and **never** carried over by assumption from v2.1.183. (A vivid example: `$Cr` was `isSubagent` in 183 but is `isClassifyAllShellEnabled` in 193 — same token, different meaning. Always resolve by line, never by token across versions.)

---

## 1. The Window Shape

The delta spans **10 version numbers** (2.1.184 … 2.1.193) but **6 published releases**. Four numbers were never published — **.184, .188, .189, .192** are absent from the changelog entirely. The bundle grew ~19,300 lines (699,346 → 718,679). The cadence is a **single dense release punctuated by hardening tails**: 2.1.186 lands a large batch (33 items), then .187/.191/.193 each ship a focused mid-sized cluster, with .185/.190 as one-line reliability patches.

| Version | Items | Dominant theme (in **bold** the in-scope headline) |
|---------|------:|----------------------------------------------------|
| 2.1.185 | 1 | Stream-stall hint reworded to "Waiting for API response · will retry in …", triggers after **20s** (was 10s) |
| 2.1.186 | 33 | **The densest release** — `claude mcp login/logout` CLI, `!` bash **auto-respond**, bg-agent UX hardening, skills frontmatter tolerance + malformed-YAML, **`Agent()` permission enforcement** for named spawns, workflow `agent({schema})` 5-attempt abort, `teammateMode:"iterm2"`, `/review`→`/code-review medium`, MEMORY.md compact reminder |
| 2.1.187 | 21 | **Permissions + subagent depth** — `sandbox.credentials`, org model restrictions, subagent depth tracking (resumed-restore + **forks counted**), MCP idle-timeout, StructuredOutput post-success lockout, stop attribution |
| 2.1.190 | 1 | "Bug fixes and reliability improvements" (no detail) |
| 2.1.191 | 20 | **MCP reliability + perf** — `/rewind` before `/clear`, discovery/OAuth retries, streaming CPU **−37%**, recent-denied approve-persists, session-host remember, hooks comma matcher |
| 2.1.193 | 15 | **Auto-mode safety surfacing + telemetry** — `autoMode.classifyAllShell`, denial reasons surfaced, `assistant_response` OTEL event, bg idle-shell memory reaping, plugin auto-rename, headersHelper re-auth |

**The four inflection points, in order:**

- **2.1.186 — the reliability + MCP-CLI watershed.** The densest release. It adds `claude mcp login/logout` (auth a server from the CLI without the interactive menu), makes `!` bash commands auto-trigger a model response (`respondToBashCommands`, default-on — an upgrade-behavior change), closes a long tail of background-agent UX bugs, tightens `Agent(type)` enforcement for named subagent spawns, caps the workflow schema-retry loop at 5, makes skills frontmatter case-tolerant, and gracefully loads malformed `SKILL.md` YAML. Most of this window's *new capabilities* are here.
- **2.1.187 — permissions + subagent-depth correctness.** `sandbox.credentials` blocks reading credential files / secret env. Org model restrictions reach the picker, `--model`, `/model`, and `ANTHROPIC_MODEL`. **Subagent depth tracking is corrected** so resumed subagents restore their original spawn depth and **forked** subagents count toward the 5-level cap — a direct continuation of the v2.1.172/.181 nested-subagent work analyzed in the 183 tree. The remote MCP tool-call idle timeout lands here too.
- **2.1.191 — MCP reliability + streaming perf.** Capability discovery, OAuth, and token requests all gain retry/backoff; streaming CPU drops ~37% by coalescing text updates to 100 ms; `/rewind` learns to resume from before `/clear`; the Recently-denied approve persists on close; sandbox network "Yes" hosts are remembered for the session.
- **2.1.193 — auto-mode safety surfacing + telemetry.** `autoMode.classifyAllShell` routes *all* Bash/PowerShell through the auto-mode classifier (not just arbitrary-code patterns); auto-mode denial reasons now reach the transcript, the toast, and `/permissions`; the `claude_code.assistant_response` OTEL event ships (with the `OTEL_LOG_USER_PROMPTS` inheritance gotcha); idle bg shells are reaped under memory pressure; plugin marketplace `renames` are auto-followed.

The maturation framing is exact: every feature touched here was *introduced in or before 2.1.183*. Nested subagents needed forks to count against the cap; the agent-team spawn backends needed an explicit iTerm2 pin and effort inheritance; MCP needed to survive an expired token mid-call; the auto-mode classifier needed to explain *why* it denied. This window is about making the autonomy surface trustworthy enough to lean on harder.

---

## 2. Permissions & Auto-mode — the largest net-new surface

**What changed:** Most of the 2.1.187 + 2.1.191 + part-of-2.1.186 changelog weight landed in permissions. Six genuine deltas: `autoMode.classifyAllShell` (193), denial-reason surfacing (193), `sandbox.credentials` (187), org entitlement model restrictions (187), Recently-denied approve-persists + session-host cache (191), and the `Agent(type)` upfront-deny refinement (186). One surface — background-worker permission forwarding — looks new but is **carryover**.

### 2.1 `autoMode.classifyAllShell` — demote shell trust in one line

**How it works.** Auto mode normally *trusts* a matching Bash/PowerShell `allow` rule, re-classifying only a hard-coded "arbitrary code execution" carve-out (`python -c`, `node -e`, `eval`, `sudo`, `curl … | sh`). The new flag collapses that trust entirely. The whole feature is a single prepended line in the suspend predicate `isShellAllowRuleSuspended` (`r9e`, `cli_inner_pretty.js:416263`):

```javascript
// isShellAllowRuleSuspended — should this Bash/PowerShell allow rule be IGNORED right now?
function isShellAllowRuleSuspended(toolName, ruleContent) {
  // ── NET-NEW 193 (cli_inner_pretty.js:416264) ── suspend EVERY shell allow rule, BEFORE the cache:
  if ((toolName === BASH || toolName === POWERSHELL) && shouldSuspendAllShellAllowRules()) return true;
  let cached = shellRuleSuspendCache.get(`${toolName}\0${ruleContent ?? ""}`);
  if (cached !== undefined) return cached;                 // memoized dangerous-prefix verdict (carryover)
  let suspended = isDangerousBashAllowRule(toolName, ruleContent)
               || isDangerousPowerShellAllowRule(toolName, ruleContent)
               || resolvesToAgentTool(toolName, ruleContent);
  return (shellRuleSuspendCache.set(/*…*/, suspended), suspended);
}
```

The gate `isClassifyAllShellEnabled` (`$Cr`, `:58758`) is an **OR across the four settings sources** `["userSettings","localSettings","flagSettings","policySettings"]` (`Uys`, `:58827`) with a strict `=== true`. The schema field at `:55814` carries the trade-off verbatim: *"higher safety, more classifier calls. Default: false."* In 183 the predicate `WGe` (`:409907`) had no such line; `grep -c classifyAllShell` is **0 (183) → 2 (193)**.

**Why this approach.** Two facts make it correct. First, the bypass **precedes the per-rule cache** (`Orl`): the dangerous-prefix verdict is a pure function of the rule and is safely memoized, but `classifyAllShell` is a *global mode flag* — caching it against a rule key would wrongly persist after the flag changed. Putting it first keeps the cache holding only the stable per-rule fact. Second, the four call sites (the auto-mode allow-layer builder `NEe` `:597462`, the pre-`checkPermissions` filter `:597964`, and two display collectors) already shared `r9e` as the "is this rule trustworthy?" oracle, so the feature reaches every enforcement and display site with one edit and **cannot drift**.

**Key insight:** This is a *demotion of trust expressed as one short-circuit line*, gated default-off, reused through a single suspension oracle. There is no new pipeline — auto mode already had the machinery to suspend untrusted allow rules; `classifyAllShell` simply widens "untrusted" from "dangerous prefixes" to "all shell."

### 2.2 Denial-reason surfacing — the record was always there; the surfacing is new

The denial *record* already stored a `reason` field in 183 (`:627443`). What 193 adds is **rendering** it: the auto-mode-denied toast now shows a truncated reason line (`:640271`, 183 had a `null` child at `:627452`), and the Recently-denied per-row reason spreads `description`/`dimDescription` (`f4l`, `:546589`, 183 had `...{}`). A new 5-way denial taxonomy `classifyToolDenialKind` (`XKa`, `:382614`) exists but is **dark-launched** — its enable gate `isToolDenialKindEnabled` (`USe`, `:382624`) is hard-wired `return !1`, so the `toolDenialKind` field (7 sites) is inert plumbing staged for a future build. **Key insight:** the reason was being *recorded* all along; the safety value of 2.1.193 is making the classifier's verdict *legible* to the user — especially now that `classifyAllShell` routes far more commands through the classifier and thus produces more denials to explain.

### 2.3 `sandbox.credentials` — deny-read credential files, unset secret env (2.1.187)

A new `sandbox.credentials` sub-object (schema `IEu`, `:54069`) declares `{files?, envVars?}` deny entries. The resolver `resolveCredentialProtection` (`Rqi`, `:211660`) produces `{denyReadPaths, unsetEnvVars, setEnvVars}`, which `buildSandboxFsDenyRead` (`Yjd`, decl `:211675`; merge `:211677`) folds into the live sandbox `filesystem.denyRead`. `grep -c denyReadPaths` is **0 (183) → 4 (193)**; `unsetEnvVars` 0 → 6. The assembly at `:219470` iterates the four settings sources and **merges** (unions) each source's credential entries, so a stricter policy source is never silently dropped by a laxer one. There is even a staged `mode:"mask"` secret-injection registry (`FRn`, gated by `credentials.allowPlaintextInject`) for a future "inject masked, not plaintext" path. **Why:** sandboxed commands that the user has auto-approved can still read `~/.aws/credentials` or `$ANTHROPIC_API_KEY`; folding credential protection into the *same* sandbox config-rebuild path (`hJr`) as the network host cache means one controller (`ko`, `:219848`) owns all filesystem/network deny state.

### 2.4 Org entitlement model restrictions (2.1.187)

A net-new entitlement gate excludes non-entitled models from the picker (`isModelAvailable` `Ia` `:102873` gained an `NFe` clause at `:102880`), rejects them on `/model` with a `denied_by_entitlement` telemetry tag (`switchModel` `tzt`, `:487243`), and **downgrades** `--model`/`ANTHROPIC_MODEL` requests via `resolveRestrictedModelFallback` (`u_n`, `:103212`, opus→sonnet→haiku). The restricted set is built by `getOrgRestrictedModelSet` (`Uge`, `:102820`), empty unless the session is first-party/gateway. The user-facing "Using X instead … restricted by your organization's settings" warning `rre` (`:374023`) is **carryover** (183 `:362631`); the *gate* is the delta, plus the net-new sentence `…Run /model to choose a different model.` (0 in 183). **Key insight:** the warning string predates the enforcement — 2.1.187 is the build where the org policy actually *blocks* the model rather than merely *commenting* on it.

### 2.5 Recently-denied approve-persists + session-host remember (2.1.191)

The Recently-denied tab and overlay are carryover (`H4l` `:547100`); the delta is the **close handler** (`:547334`): approving a past denial now persists (removeDenial + a model grant) instead of being silently discarded on close. Separately, `addSessionAllowedHost` (`_Wd`, `:219238`) caches a sandbox network "Yes" host into the per-session set `BLn` (`:219833`) and rebuilds the config, so an allowed host is not re-prompted for the rest of the session. `grep -c addSessionAllowedHost` is **0 (183) → 5 (193)**.

### 2.6 `Agent(type)` upfront deny on named spawns (2.1.186, refinement) + carryover forwarding

The `Agent(type)` deny-rule matcher and `allowedAgentTypes` allow-list are carryover (19 hits in both); 2.1.186 *hoists* the check to an upfront enforcement site for named spawns (`:430515`, absent at 183 `:423565`), so `Agent(reviewer)` deny rules and `Agent(x,y)` allow-lists actually block a named subagent spawn before it launches. The background-worker permission forwarding (`forwardWorkerPermissionRequest` `rdc` `:640151`, `pendingWorkerRequest`, `permission_swarm_forward`) the changelog lists under 2.1.186 is **fully carryover** — grep counts match exactly (7/7, 2/2). It is documented as such to avoid false-delta inflation.

Cross-link: [`../38_permissions/`](../38_permissions/) (README + `classify_all_shell.md`, `denial_reasons_surfacing.md`, `sandbox_credentials.md`, `org_model_restrictions.md`, `recent_denied_overlay.md`, `background_subagent_permission_forwarding.md`).

---

## 3. MCP — reliability and self-healing

**What changed:** The MCP machinery (transports, connect/discover pipeline, OAuth dance, needs-auth cache, `mcp` command tree) is structurally the same as 183. The deltas are a set of reliability/UX hardening changes across .186/.187/.191/.193.

### 3.1 The two heaviest deltas both live in the tool-call wrapper

`callToolWithWatchdog` (`bao`, `cli_inner_pretty.js:293017`) hosts both new behaviors: the **idle watchdog** is its `try`, the **re-auth** is its `catch`.

**Idle timeout (2.1.187).** A remote tool call that hangs silently used to block for the full 5-minute overall ceiling; now an idle watchdog aborts after `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (`hpp` = 300000, `:293311`) of *silence* (progress notifications reset the idle clock), overridable via `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (`Jpu`, getter `:43147`). It applies only to network transports (`IDLE_TIMEOUT_TRANSPORTS` `ypp`, `:293456` = `http/sse/ws/claudeai-proxy`). The whole concept is **0 in 183**.

**headersHelper re-auth + reconnect (2.1.193).** When a tool call to a `headersHelper`-backed server returns 401 (or 403 with a headersHelper), the wrapper self-heals:

```javascript
// callToolWithWatchdog catch — cli_inner_pretty.js:293132-293180
let isAuthError = errCode === 401 || err instanceof McpAuthRequiredError || (errCode === 403 && hasHeadersHelper);
if (hasHeadersHelper && !isAuthRetry) {                    // !isAuthRetry = at most one re-auth per original call
  let inflight = inFlightReauthReconnects.get(serverCacheKey);   // pao — share one reconnect across concurrent calls
  if (isAuthError || reconnectInProgress) {
    logFeatureSadEvent("mcp_headers_helper", "reauth_retry");    // NEW error_code on a pre-existing feature_name
    if (!inflight) inflight = (async () => (await disconnectAndClearCache(...), connectOrGetClient(...)))();  // re-runs headersHelper
    let reconnected = await inflight;
    if (reconnected.type === "connected")
      return callToolWithWatchdog({ ...same, isAuthRetry: true });   // retry ONCE
  }
}
// else fall through to the carryover "requires re-authorization" error → marks server needs-auth
```

**Why disconnect+reconnect rather than re-call `headersHelper` alone:** a stale token usually means the cached *connection/session* is dead too; tearing it down and rebuilding guarantees the rotated credentials are used on a fresh session. The in-flight map (`pao`, `:293460`, keyed by `serverCacheKey`) makes N concurrent 401s share *one* reconnect instead of thrashing the server. The branch sits **before** the legacy 401 surfacing (`:293170`), so a rotatable token recovers transparently and only a genuinely unrecoverable failure reaches the user. The `mcp_headers_helper` feature_name is pre-existing (7/6 — the +1 is exactly the new `reauth_retry` call); the startup notice ("run /mcp to authenticate", `:504183`) is **carryover** that the new re-auth merely *feeds*.

### 3.2 Discovery/OAuth retries + login CLI + name suggestions

- **Discovery retry-with-backoff (2.1.191).** `listWithPaginationAndRetry` (`P1n`, `:292176`) retries transient `tools/list`/`prompts/list`/`resources/list` errors with backoffs `[250, 500, 1000]` ms (`mpp`, `:293455`); 183's `aOt` was single-try.
- **OAuth retry-once + 404 (2.1.191).** `createRetryingOAuthFetch` (`AOn`, `:281573`) wraps the carryover single-fetch body in one retry (delay 500 ms); a 404 now produces `ENDPOINT_NOT_FOUND` with the URL (`:293997`); headless skips the browser popup straight to paste-the-URL.
- **`claude mcp login/logout <name>` (2.1.186).** New CLI handlers `mcpLoginHandler` (`L9f`, `:613318`) / `mcpLogoutHandler` (`D9f`, `:613467`), registered at `:613582`/`:613593`, authenticate a server without the interactive `/mcp` menu, with `--no-browser` stdin redirect for SSH. New telemetry `tengu_mcp_login`/`tengu_mcp_logout`.
- **`mcp get`/`remove` name suggestions (2.1.186).** `suggestClosestServerName` (`t3o`, `:610416`) offers a bounded "did you mean" using the carryover adjacent-transposition-aware edit-distance matcher (`fde`/`z5t`) and truncates long lists. The retired-tool "MCP server disconnected" false notice is fixed by a new `RETIRED_TOOL_NAMES` guard (`HBt`, `:228300` = `{Frame, FrameRead, TeamCreate, TeamDelete, SuggestBackgroundPR}`).

Cross-link: [`../39_mcp/`](../39_mcp/) (`tool_call_idle_timeout.md`, `headers_helper_reauth.md`, `reliability_retries.md`, `mcp_login_logout_cli.md`, `server_name_suggestions.md`).

---

## 4. Background Agents & Subagent Lifecycle — correctness under load

**What changed:** Three clean net-new mechanisms — memory-pressure shell reaping (193), fork-aware depth counting (187), permanent stop (191) — plus a cluster of isolable backgrounding/panel fixes. The bg-agents engine itself is carryover.

### 4.1 Memory-pressure reaping of idle bg shells (2.1.193, NET-NEW, default-on)

Each top-level backgrounded `local_bash` task arms its **own** `process.on("memoryPressure")` listener at launch (`registerBgShellPressureReaper` `Mgl`, `cli_inner_pretty.js:454354`):

```javascript
function registerBgShellPressureReaper(taskId, desc, registry, toolUseId, kind, agentId) {
  registerKeepalive(agentId, `bash:${taskId}`, registry);
  if (agentId === undefined && !isRemoteMode() && !env.CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP) {  // arm only for top-level, local, enabled
    let onMemoryPressure = () => {
      let task = registry.get(taskId);
      if (task?.status !== "running" || task.notified                       // already done / shown
        || Date.now() - getLastInteractionTime() < BG_SHELL_IDLE_REAP_MS    // < 30 min idle
        || isMainLoopBusy() || hasActiveAgentTasks(registry.all())) return; // mid-turn / live agent work
      logEvent("task_local_shell_pressure_reap");
      notifyAndFinalizeShellTask(taskId, ..., "killed", ...); killLocalShellTask(taskId, registry);
    };
    process.on("memoryPressure", onMemoryPressure);  // cli_inner_pretty.js:454363
  }
  return () => { /* detach + deregisterKeepalive */ };
}
```

`BG_SHELL_IDLE_REAP_MS` (`eof`) is 1800000 = 30 min (`:454610`); the disable env `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` (`Ldu`, `:43175`) defaults false, so the reaper is **on by default**. `memoryPressure` and `task_local_shell_pressure_reap` are **0 in 183**.

**Why piggyback on `memoryPressure` rather than a timer:** a fixed sweep reaps too eagerly on a healthy machine or too late after an OOM; hooking the runtime's own pressure signal pays the cost exactly when there is a benefit. **Why seven guards rather than one "is it old?":** each rules out a distinct wrong-kill (already done, user cares, mid-turn, a subagent might consume the output, not-ours). The guard stack is deliberately biased toward the cheaper failure: not-reaping leaves memory high a little longer; a wrong reap silently kills the user's long-running command. **Key insight:** this is *policy in a listener, not a daemon* — each shell self-arms and self-disarms, each listener re-reads live registry state at fire time, so it is self-cleaning and correct under concurrency.

### 4.2 Subagent depth tracking — forks now count (2.1.187)

The 183 tree established the depth model (cap `5`, `getAgentDepth`, the `cio` tool-filter gate, `spawnDepth` persistence). 2.1.187 fixes two gaps on top of it. **Resume-restore (body-change):** the resume path now honors the persisted on-disk depth — `(isLocalAgentTask(live) ? live.spawnDepth : persisted?.spawnDepth) ?? getAgentDepth(resumer)+1` (`:441544`), where 183 had `void 0` (`:434085`) and silently re-based a resumed depth-3 agent to depth-1. **Spawn-time throw (NET-NEW):** an explicit cap check at the Agent-tool call entry, which *every* spawn path — including forks — flows through:

```javascript
// cli_inner_pretty.js:430477-430484
let spawnerDepth = getAgentDepth(callerCtx.agentContext);
if (spawnerDepth >= SUBAGENT_DEPTH_LIMIT /* FBt = 5 */) {
  logFeatureError("subagent_launch", "subagent_depth_cap");    // NEW error_code, 0 in 183
  throw new SubagentLaunchError(`Subagent nesting limit reached (depth ${spawnerDepth} of 5). Complete this task directly…`);
}
```

**Why a throw AND the carryover tool-removal gate (belt-and-braces):** 183 enforced depth purely by *not giving* a depth-5 agent the Agent tool — clean for the normal toolset path, but a **fork** invoked through a different entry could bypass that toolset-build gate. Relocating the decision to the *call entry* (a property of the call, not of how the toolset was built) makes forks first-class members of depth accounting. **Key insight:** the cap value `5` did not change; what changed is *which spawns are counted against it* — the headline of 187 is the word "count."

### 4.3 Stop is permanent (2.1.191) + the phantom-resumed fix (2.1.193)

Stopping a bg agent now writes a durable `stoppedByUser` marker (`markAgentStoppedByUser` `Mde` `:431808`, `persistStopMarker` `CXp` `:431816`); resume/continue paths refuse to resurrect it (throwing `AgentStoppedError` `:441779`) unless force-resumed (which clears the marker). `stoppedByUser` is **0 in 183, 9 in 193**. Separately, 2.1.193 fixes backgrounding the main turn spawning a phantom "general-purpose (resumed)" subagent that re-ran the conversation (guard around `registerCompletedResumedAgent` `Lgl` `:454100`), and the "N background tasks would be abandoned" cancel that fired even when all tasks carried over (carry-over-aware count `oUo` `:578073` / `fze` `:578006`). The turn-end "stuck working" finalizer the changelog credits to 2.1.187 turned out to be **carryover** (byte-equivalent to 183) — flagged explicitly to prevent false-delta drift.

### 4.4 Stop attribution — who stopped the agent (2.1.187)

A new `killedBy` axis threads from the stop entry points into the notification, task state, and telemetry. `stopTask` (`kht`, `:431759`) defaults `killedBy = "user"`; the **TaskStop** tool passes `"parent"` (`:431944`) when Claude stops a task programmatically; lifecycle kills are `"system"`. The notification builder `enqueueAgentNotification` (`Eqe`, `:453792`) renders a five-way string — "finished" / "failed: …" / "was stopped by Claude" / "was stopped by user" / "was stopped" — replacing the single anthropomorphic "came to rest" (4 → 0). The async-completion path telemeters the three values as `parent_kill_async` / `system_kill_async` / `user_kill_async` (`:384650-384658`; the first two are net-new, `user_kill_async` is the carryover enum the new attribution now also feeds). **Key insight:** the wording at `Eqe` is the visible tip; the load-bearing delta is the `killedBy` plumbing feeding it ("default to the common case, name the exceptions").

Cross-link: [`../36_background_agents/`](../36_background_agents/) (`bg_shell_pressure_reap.md`, `subagent_depth_tracking.md`, `agent_stop_lifecycle.md`, `backgrounding_and_panel_fixes.md`) and [`../30_agent_team/stop_attribution.md`](../30_agent_team/stop_attribution.md).

---

## 5. Telemetry / OTEL — the `assistant_response` event and the upgrade gotcha

**What changed:** Exactly one new OTEL log event and one new env var; the emitter, redaction, truncation, and managed-env machinery are all carryover.

**How it works.** Inside `recordApiRequestTelemetry` (`cSl`, `cli_inner_pretty.js:468542`), right after the existing `api_request` event, 2.1.193 emits `claude_code.assistant_response` (`:468662`) carrying the reply text (text content blocks only, joined by `\n`, capped at 60 KB) plus `response_length`, `request_id`, `model`, `query_source`. The headline is not the event but its **redaction gate** `isAssistantResponseLoggingEnabled` (`dGi`, `:195211`):

```javascript
function isAssistantResponseLoggingEnabled() {
  // OTEL_LOG_ASSISTANT_RESPONSES is parsed TRI-STATE (true | false | undefined);
  // ?? falls through ONLY on undefined (unset), then inherits the older bool.
  return managedEnv.OTEL_LOG_ASSISTANT_RESPONSES ?? managedEnv.OTEL_LOG_USER_PROMPTS;  // :195212
}
```

`OTEL_LOG_ASSISTANT_RESPONSES` (`FZc`) is bound `Fe.triBool()` at `:36424` — the only OTEL_* var in the schema block parsed tri-state; every sibling uses `Fe.bool()`. All three tokens (`assistant_response`, `OTEL_LOG_ASSISTANT_RESPONSES`, the `?? …OTEL_LOG_USER_PROMPTS` inheritance) are **0 in 183**.

**Why tri-state, not a plain bool.** A plain boolean cannot distinguish "operator never set this" from "operator set it to false." Tri-state is the only encoding that expresses *"unset → inherit the prompts decision; `0` → hard opt-out; `1` → hard opt-in,"* and `??` is its precise complement (falls through exactly on the `undefined` state, stops on either explicit boolean). `||` would have been a bug — `false || OTEL_LOG_USER_PROMPTS=1` would override an explicit opt-out.

**⚠️ THE UPGRADE GOTCHA (emphasize).** The default state (both vars unset) is safe (`<REDACTED>`). The dangerous transition is *upgrading a deployment that already set `OTEL_LOG_USER_PROMPTS=1`*: on 183 that flag governed only prompts; on 193 the new `assistant_response` event **inherits** it, so **full model-response bodies start flowing with zero config change**. To keep prompt logging but suppress response bodies, operators **must explicitly set `OTEL_LOG_ASSISTANT_RESPONSES=0`** (tri-state `false` short-circuits the `??`). One privacy nuance: `response_length` is emitted *even when redacted*, so volume is observable even when content is not.

**Key insight:** the whole feature is *one inserted block* on an existing emit path — the text-blocks-only assembly is identical to the one already used for the beta-tracing `modelOutput` field a few lines below, so it is "the api_request line, plus the reply text we were already extracting." The privacy posture deliberately *couples* the two halves of a conversation so they are logged or redacted together by default — convenient for telemetry completeness, which is exactly why it surprises operators on upgrade.

Cross-link: [`../44_telemetry/`](../44_telemetry/) (`assistant_response_event.md`).

---

## 6. Workflow / Structured Output — call-control hardening

**What changed:** Three small call-control deltas on an unchanged VM spine (the sandbox, builtins, `agent({schema})` contract, and `Workflow` tool are carryover). All three patch how StructuredOutput calls are *controlled* inside the per-agent runner `wt` (`cli_inner_pretty.js:423705`).

**StructuredOutput post-success lockout (2.1.187).** Two cooperating mechanisms. (a) A **success guard** in the runner: once a `structured_output` attachment is captured (`dt`), a 3rd+ StructuredOutput call aborts with reason `"stalled"` (`:423840-423841`), and the catch special-cases `"stalled" && dt !== void 0` to return the *already-captured* output as a clean success with `stalled: false` (`:423852-423875`) — so the outer stall-retry loop (cap `kol = 5`) does **not** relaunch it. (b) A net-new `requiresStructuredOutput` query option (8 sites, **0 in 183**) drives an **inline, gated nudge** in `vbl` (`:465638`) that injects "You MUST call the StructuredOutput tool" *only until a call has succeeded* (success-checked by `structuredOutputSucceeded` `Ibl` `:601998`, deduped by the `[structured-output-enforce]` sentinel `Hbl` `:465901`). This **replaces** the 183 Stop hook `zKn` (`:575795`, 183) that re-fired on every turn-end with no per-success dedup — the exact runaway-pressure bug the bullet fixes.

```javascript
// success guard inside the runner — cli_inner_pretty.js:423837-423842
if (block.name === STRUCTURED_OUTPUT_TOOL) {
  structuredOutputAttempts++;
  if (capturedStructuredOutput !== undefined && structuredOutputAttempts > 2) {
    abortController.abort("stalled"); break;     // already have a result + extra re-calls → stop
  }
}
// catch: reason === "stalled" && capturedStructuredOutput !== undefined
//   → return { structured: captured, stalled: false }   // delivered from dt, not the n-th model call
```

**`agent({schema})` 5-attempt abort (2.1.186).** A failure counter increments per StructuredOutput `tool_result` that came back `is_error`; at `>= DEFAULT_SO_RETRIES` (`NYp = 5`, `:424307`) with no valid output captured, the runner throws a `DualError` (`:423822-423826`). **Why count results, not requests:** the counter lives in the *user*-message handler where `tool_result`s arrive, so it counts *confirmed* failures, not optimistic attempts. The print-mode `--json-schema` cap was already 5 in 183 (carryover); what 2.1.186 ships is applying it to the in-process workflow loop, which had none. **Key insight — two adjacent "5"s:** `NYp` (per-call schema-validation failures → throw) is distinct from `kol` (the outer stall-retry cap → relaunch); the success path returns `stalled: false` so a captured-output abort never consumes a `kol` retry.

**`/workflows` status filter (2.1.186).** A net-new `f`-key filter on the carryover detail component cycles statuses (`workflowDetailFilterOrder` `eYt` `:543272`, key handler `:543081`), skipping statuses no agent currently has. All three signals (the `f` filter, cycle array, key handler) are **0 in 183**.

Cross-link: [`../42_workflow/`](../42_workflow/) (`structured_output_call_control.md`, `workflows_detail_status_filter.md`).

---

## 7. Agent Team — three surgical edits in unchanged machinery

**What changed:** The v2.1.178 implicit-team redesign is **byte-identical carryover** here (an adversarially-confirmed negative — `single implicit team` 4=4, `team_name … Deprecated` 1=1). The window's three deltas are surgical edits inside that carryover spine.

- **`teammateMode: "iterm2"` (2.1.186).** A fourth enum value (`EXEC_MODE_ENUM` `uhs` `:54136` = `["auto","tmux","iterm2","in-process"]`; 183 `Its` lacked it) that *forces* the iTerm2 pane backend, with an explicit detection branch in `detectAndGetBackend` (`kPe`, `:429186`) that throws two actionable errors when `isInsideITerm2`/`isIt2CliReachable` fail, plus an iterm2-aware auto-mode fallback hint (`iXp`, `:429964`).
- **`--effort` inheritance (2.1.186).** tmux/iTerm2-pane teammates inherit the leader's live `effortValue` via a one-line `--effort <level>` push in the pane-spawn flag builders (`buildInheritedCliFlags` `pil` `:428485`; `buildInheritedSubagentCliFlags` `Mil` `:429445`), gated by the existing `isLaunchEffortUnpinned` (`PIe`, `:149794`). In-process teammates don't get the push (a small pane-vs-in-process divergence worth knowing on upgrade).
- **Stop attribution (2.1.187).** Covered in §4.4 — the `killedBy` plumbing and "finished"/"was stopped by Claude|user" wording, with the idle banner `teammateIdleBanner` (`LEo`, `:390965`) changed in lockstep ("came to rest" → "finished").

**Key insight:** none is an architecture change — they are edits *inside* the iTerm2 backend, the BackendRegistry detector, the pane-spawn builders, and the stop path, all of which predate 183 (most predate the 88 ancestor). The spawn/mailbox/permission spine is untouched.

Cross-link: [`../30_agent_team/`](../30_agent_team/) (`teammate_mode_iterm2.md`, `effort_inheritance.md`, `stop_attribution.md`).

---

## 8. Skills — frontmatter tolerance and the `/plugin` section

**What changed:** Three 2.1.186 bullets, two of them smaller than the changelog implies.

- **Frontmatter case-tolerance (REFINEMENT, with a dead-code gotcha).** The provable deltas are *schema-recognition* additions: the skill shadow-schema `tVr` (`cli_inner_pretty.js:149302`) gained `defaultEnabled`/`displayName` (+6 `@internal` fields), and the canonical-key list `zEd` (`:149406`) gained `displayName`/`defaultEnabled`/`fallback`/`evals` — so these keys no longer trip the shadow-unknown-key telemetry. **But the generic kebab→camel read-time rewrite is NOT wired up**: the normalizer `KEd` (`:149400`) and its map `uIh` (`:149465`) are *built but never read*, and the parser `Gm` (`:149511`) **ignores** its `{normalizeKeys:true}` argument (identity transform). The kebab spellings `display-name`/`default-enabled` produce **zero** grep hits in either build. So "now accept kebab/snake/camel" is realized at the schema/canonical layer; the runtime normalizer that would do the rewrite is vestigial — the honest centerpiece finding.
- **Malformed `SKILL.md` YAML (REFINEMENT, net-new diagnostics).** "Loads the body with empty metadata" is **carryover** — both 183 and 193 leave `metadata = {}` and return the body on a double parse failure. What is net-new is the *surfacing*: `Gm` now returns a `parseError` field (`:149531`) that the loader `uyt` (`:451677`) reads to emit `[skills] YAML frontmatter in … failed to parse and was ignored` plus a `skill_load_yaml_failed` telemetry tag (`:451756`). "Instead of failing silently" is precisely this diagnostics delta.
- **"Skills" section in the `/plugin` Installed tab (NET-NEW).** The scope-label switch `pluginScopeSectionLabel` (`OAf`, `:519209`) adds `case "skills": return "Skills"` (`:519226`); a per-skill row collector `In` (`:519545`) emits `type:"skill"`/`scope:"skills"` rows with an override lock + usage badge, grouped and sorted last (`skills: 7`). 183's `GYp` had no skills case; `Cr.set("skills")` and `scope:"skills"` are both 0 in 183.

Cross-link: [`../45_skills/`](../45_skills/) (`frontmatter_case_tolerance.md`, `malformed_yaml_handling.md`, `plugin_installed_skills_section.md`).

---

## 9. Tools & CLI Input — the `!` bash surface

**What changed:** Three real tool/input deltas plus a 50→51 tool-surface diff.

- **`!` bash auto-respond (2.1.186, upgrade gotcha).** `processBashCommand` (`y6f`, `cli_inner_pretty.js:617562`) now reads a new `respondToBashCommands` setting (`:56492`, **default true**) and returns `shouldQuery: true` unless the command was interrupted/backgrounded/aborted — so by default Claude now *responds* to `!`-command output. 183 (`Owf`, `:604506`) was always silent (`shouldQuery: false`). Set `"respondToBashCommands": false` to keep context-only behavior.
- **Bash-mode path autocomplete (2.1.193).** Typing a path-like token after `!` shows an inline directory dropdown — a new branch + `"bash-path"` marker (`:629396`, 193=5/183=0) in the live-suggestion callback. The path *scanner* is reused carryover from the `@`-mention feature; only the bash-mode wiring is new.
- **Tool-surface delta.** One tool added — `ReadMcpResourceDirTool` (`iX` `:283504` / `_ne` decl `:283549`, object `:283584-283585`), 50 → 51 — deferred (`shouldDefer:true`); **zero** removals and **zero** description/schema changes to existing tools. `classifyAllShell` shows up as a tool-surface false-delta but is a permissions concern (§2.1); the Bash/PowerShell tool descriptions are byte-identical 183↔193.

Cross-link: [`../04_tools/`](../04_tools/) (`bash_input_respond.md`, `bash_mode_autocomplete.md`, `tool_surface_delta_193.md`).

---

## 10. Slash Commands & Plugins

**What changed:** One woven net-new capability, one net-new subsystem, one tidy fix, and four isolable miscellany.

- **`/rewind` before `/clear` (2.1.191).** A persisted `rewound` transcript marker (`rewindAnchorWriter` `hYt` `:582712`) that the reader follows across the `parentSessionId` boundary, plus a `tengu_rewind_first_message` gate (`:707201`) and the `XRc` anchor resolver (`:705599`) that let the rewind anchor land on the *first* user message. The user-visible strings are carryover (`/clear` already stashed `parentSessionId` in 183); the persistence + gate are net-new (`rewound` 1→12).
- **Plugin marketplace `renames` auto-follow (2.1.193).** The richest item: a `renames` schema field (`:55667`), a cycle-safe resolver `resolvePluginRename` (`s_t`, `:478428`, cap 16), a loader follow, a settings migrator `migrateRenamedPluginsInSettings` (`NHl`, `:478443`) that rewrites settings keys old→new, and `tengu_plugin_renamed` telemetry (`:195349`). Every feature string is 0 in 183. The `/plugin` unused-plugin sweep and "more above" indicator the changelog credits to .187/.186 are **carryover**.
- **Hooks comma matcher fix (2.1.191).** `"Bash,PowerShell"` silently never fired in 183 (comma rejected by the validation regex → a never-matching `RegExp`). The new matcher `hookMatcherMatches` (`s3f`, `:589634`) adds an `allowComma` param that widens the regex and splits on `/[|,]/`.
- **Miscellany.** `/add-dir` already-a-working-dir three-message refinement (`jot`, `:177994`, 2.1.193); `/btw` ←/→ answer navigation (2.1.187); `/review <pr>` → `/code-review medium` engine (`oRf`, `:538534`, 2.1.186); `CLAUDE_CODE_MAX_RETRIES` cap 15 + `CLAUDE_CODE_RETRY_WATCHDOG` redirect (`getMaxRetries` `O5f` `:603209`, cap `Ujo`=15 `:603244`, 2.1.186 — an upgrade gotcha for unattended sessions).

Cross-link: [`../43_slash_commands/`](../43_slash_commands/) (`rewind_before_clear.md`, `plugin_auto_rename.md`, `hook_matcher_comma_fix.md`, `cli_input_and_review_misc.md`) and the system-prompt env-block agent-proxy line in [`../40_system_prompt/`](../40_system_prompt/).

---

## 11. Auto Memory + Compaction — a removal and a behavior-preserving refactor

**Auto Memory: the one delta is a dead-experiment deletion.** The writer/recall engine and the auto-dream engine are **carryover** (re-mangled, byte-identical logic — the `tengu_onyx_plover` throttle, the dream telemetry, the consolidation prompt, the `CLAUDE_MEMORY_STORES` mount machinery all reproduce 183). The single genuine behavioral-surface change is a **removal**: the `tengu_billiard_aviary`-gated "immutable memory / `tiny_memory`" experiment was deleted — the gate, the `tiny_memory` memory-type, the immutable write semantics (delete-and-rewrite, `created:`-stamped frontmatter), the inline `[Good]/[Bad]` rating widget, and the "Dream: Memory Pruning" alternate prompt builder. The dream firing collapsed from a 2-way `aH() ? Hgi : PQa` branch (183) to a **single** `buildConsolidationPrompt` (`$_l`, `cli_inner_pretty.js:463735`). `tengu_billiard_aviary` is **1 (183) → 0 (193)**; `tiny_memory` 4 → 0. **Because the gate defaulted OFF, default-config users see zero behavior change on upgrade** — only internal-experiment users on the gate-ON path lose immutable mode.

The changelog's "MEMORY.md compact reminder near the size limit" (2.1.186) is a **false delta for this window**: both the over-limit truncation WARNING (`truncateMemoryIndexForPrompt` `v$t` `:152573`, 200 lines / 25 KB) and the dream Phase-4 "keep it an index" instruction exist **byte-identical in 183** (and predate it). The changelog label lags the ship; it is documented here only to correct attribution — and it is auto-memory, **not** compaction (no `MEMORY.md` × compaction co-mention exists in the bundle).

**Compaction: behaviorally UNCHANGED this window.** Every behavioral lane — the `--fallback-model`-honoring summarize loop, the 1M-credits clamp, the 6-source window resolver, the micro-compact `context-hint-2026-04-09` beta, the thresholds, the `tengu_compact*` telemetry, the prefix-overflow pre-check — is **byte-for-byte carryover** (the summary prompt is md5-identical; env/flag/feature-gate asset diffs are 0 net-new, 0 removed). The single source-level change is an internal, **behavior-preserving refactor** of the auto-compact dispatcher's *return shape*: the flat boolean-tagged object `{wasCompacted, …}` (183 `Ego`) became a **discriminated union** `{kind: "not_needed" | "failure_breaker_open" | "rapid_refill_breaker_tripped" | "compacted" | "hook_blocked" | "failed"}` (193 `Rxo`, `cli_inner_pretty.js:470250`), with the `query`-loop caller rewritten to `switch` on `.kind`.

```javascript
// the six exit points map 1:1 (183 flat → 193 union); behavior identical, shape only changed
if (env.DISABLE_COMPACT)                       return { kind: "not_needed" };          // 183: {wasCompacted:false}
if (consecutiveFailures >= 3)                  return { kind: "failure_breaker_open" }; // 183: {wasCompacted:false}  ← 183 collapsed these 3 into one
if (!autocompactNeeded(...))                   return { kind: "not_needed" };          // 183: {wasCompacted:false}
if (rapidRefillBreaker(state).action==="trip") return { kind: "rapid_refill_breaker_tripped" };
```

**Why:** 183 collapsed three logically-distinct "did not compact" outcomes into the same `{wasCompacted:false}`, forcing the caller to test fields in a fragile order; the union makes outcomes exhaustive and exclusive (one `kind` per terminal state, so a future breaker is a new tag, not a new ambiguous flag). It rode along with a broader `query`-loop tidy, appears in **no changelog bullet** (silent refactor), and is detectable only by grep signature (`wasCompacted` 10→0). **Key insight:** there is **no compaction upgrade-behavior gotcha this window** — an operator sees identical compaction behavior; only an analyst re-basing obf-name citations needs the `Ego`→`Rxo` map.

Cross-link: [`../31_auto_memory/`](../31_auto_memory/) (`billiard_aviary_immutable_memory_removal.md`, `memory_reminder_and_dream_carryover.md`) and [`../07_compact/`](../07_compact/) (single README). Canonical mechanism docs live in the 183 trees.

---

## 12. Cross-Cutting Patterns Across the Twelve Themes

Reading the deltas together, the same maturation instincts recur — most sharper than the prior window's because this window *hardens* rather than *launches*.

### 12.1 Demote trust as one line
The headline safety change, `classifyAllShell` (§2.1), is a *single prepended `if`* inside an existing suspend oracle — trust demoted from "honor allow rules except dangerous prefixes" to "honor nothing" with one short-circuit, reused through four call sites that cannot drift. The same instinct: the subagent depth throw (§4.2) is one `if (depth >= 5) throw` at the call entry; the resume-restore fix (§4.2) is one token (`void 0` → `b?.spawnDepth`).

### 12.2 Reactive self-healing over proactive guards
The MCP re-auth (§3.1), the idle-timeout abort (§3.1), and the bg-shell reaper (§4.1) all *react* to a real event — a 401, a silence window, an OS `memoryPressure` signal — rather than polling or pre-empting. Nothing penalizes the healthy/common case; the correction kicks in exactly when the failure or pressure occurs. The compaction subsystem's own (carryover) reactive breakers are the same pattern.

### 12.3 Explicit configuration bypasses staging; record-then-surface
The denial *reason* was recorded all along (§2.2) — 193 only *surfaces* it; the entitlement *warning* string predated the *gate* (§2.4). Conversely, the new `toolDenialKind` taxonomy is *staged dark* (`USe` hard `return !1`, §2.2), and `classifyAllShell`/`sandbox.credentials`/`respondToBashCommands` are all explicit settings keys. The principle: gate what should be staged (dark taxonomy), honor what the user explicitly set (settings flags), and make the machine's verdict legible (denial reasons, stop attribution).

### 12.4 Capability removal / call-site enforcement, not runtime refusal
The depth cap composes *tool-removal* (carryover: a depth-5 agent never sees the Agent tool) with a *call-entry throw* (new backstop that counts forks) — belt and braces (§4.2). The Agent named-spawn deny is hoisted *upfront* (§2.6). Enforcing at the call/capability layer rather than mid-execution keeps the common path from attempting-and-failing.

### 12.5 The upgrade-behavior gotcha is the recurring operator hazard
Three independent defaults flip behavior silently on upgrade: `assistant_response` inheriting `OTEL_LOG_USER_PROMPTS` (§5, the sharpest — full response bodies start logging), `respondToBashCommands` defaulting true (§9, Claude starts replying to `!` output), and the bg-shell reaper defaulting on (§4.1, long-running detached shells can be reaped). Each is escapable by one explicit env/setting (`OTEL_LOG_ASSISTANT_RESPONSES=0`, `respondToBashCommands:false`, `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`). An operator reading only the changelog headline would miss all three.

### 12.6 Re-mangling discipline
Every obfuscated name is re-minified from 183 (the bundle moved ~19,300 lines and many functions shifted thousands of lines). `Ego`→`Rxo`, `WGe`→`r9e`, `Gz`→`K3`, `v1i`→`FBt`, `del`→`wSl`, `bao`/`Eqe` re-derived — and the trap `$Cr` (`isSubagent` in 183, `isClassifyAllShellEnabled` in 193) is the canonical reminder. This tree re-derived **every** name in the 2.1.193 bundle and never reused a 183 token; the twelve cross-validation reports enforce it, and several caught false-deltas that were actually carryover (the bg "stuck working" finalizer, the MEMORY.md reminder, the worker permission forwarding, the leaked-worktree cleanup).

---

## 13. The Broader Window — What This Tree Does NOT Cover

This is a focused twelve-theme delta tree. Many other things changed in the v2.1.185 → v2.1.193 window and are **intentionally out of scope**. A reader should know they exist and look at the upstream [`../../CHANGELOG.md`](../../CHANGELOG.md):

- **The large UI / terminal / Windows reliability tail.** Welcome-splash overflow on 80×24 (.191), misaligned permission-prompt option numbers (.186), `~~strikethrough~~` literal tildes (.186), mouse-click in fullscreen select menus (.187), Cmd+click on Ghostty over ssh/tmux (.191/.187), `/login` URL truncation in Windows Terminal (.191), subagent transcript scroll bleed (.186), Chrome tab-group isolation (.186), dark-theme flash and stale "needs input" in `claude agents` (.186), vim-mode prompt-history search hint (.191) — dozens of items across nearly every release.
- **Streaming-perf internals.** The ~37% streaming CPU reduction via 100 ms text-update coalescing and the long-session terminal-output-cache memory-growth fix (.191) — a render-pipeline change, named but not analyzed here.
- **Remote-control / update / share plumbing.** The ~2.7 s remote-start regression after agent-proxy CA system-trust install (.187), `/update` over Remote Control hanging on a startup trust dialog (.187), Esc/Ctrl-C/Ctrl-D unresponsive during `/share` upload (.187), `forceRemoteSettingsRefresh` via MDM/file policy + `Cache-Control: no-cache` (.191). (The system-prompt *side* of the agent proxy — the env-block diagnostic line — is touched lightly in [`../40_system_prompt/`](../40_system_prompt/).)
- **Retry-cap tuning.** `CLAUDE_CODE_MAX_RETRIES` capped at 15 with `CLAUDE_CODE_RETRY_WATCHDOG` for unattended sessions (.186) — covered only as a slash/CLI miscellany item (§10), not as a retry-subsystem deep-dive.
- **Model-picker stale-after-login + misc auth.** `/model` and client-data-gated UI showing stale/empty state immediately after `/login` (.193); the "Claude Platform on AWS — refresh credentials" `/login` option when `awsAuthRefresh` is configured (.186); `--resume` failing with "No conversation found" when the original `-p` run produced no model turns (.187); the `[VSCode]` large-session resume fix (.187).

These changed in the same window and matter; they are simply not what this tree was scoped to analyze.

---

## 14. Added Settings, Env Vars, and Telemetry (This Window)

Sources: the verified anchors above, the twelve `symbol_additions_v2_1_193_*.md` tables, the twelve `cross_validation_report_*.md` logs, and the `assets/` extracts. Scoped to the twelve themes (not the full window — see §13).

### New / changed settings keys

| Setting | Version | Theme | Purpose |
|---------|---------|-------|---------|
| `autoMode.classifier.classifyAllShell` | 2.1.193 | Permissions | Route ALL Bash/PowerShell through the classifier; default false (schema `:55814`, gate `$Cr` `:58758`) |
| `sandbox.credentials` `{files, envVars}` | 2.1.187 | Sandbox | Deny-read credential files + unset secret env vars (schema `IEu` `:54069`, resolver `Rqi` `:211660`) |
| `respondToBashCommands` | 2.1.186 | Tools/CLI | `!` bash output auto-triggers a model response; **default true** (`:56492`, gate `:617604`) — upgrade gotcha |
| `teammateMode: "iterm2"` | 2.1.186 | Agent Team | Force the iTerm2 pane backend (enum `uhs` `:54136`) |
| `renames` (marketplace) | 2.1.193 | Plugins | Plugin rename map auto-followed + settings migrated (`:55667`, resolver `s_t` `:478428`) |
| `display-name`/`default-enabled`/`fallback`/`metadata.*` multi-case | 2.1.186 | Skills | Schema/canonical-list recognition (`tVr` `:149302`, `zEd` `:149406`) — runtime kebab→camel rewrite is vestigial |

### New / changed environment variables

| Env Var | Version | Theme | Purpose |
|---------|---------|-------|---------|
| `OTEL_LOG_ASSISTANT_RESPONSES` | 2.1.193 | Telemetry | **Tri-state** gate for `assistant_response` body; unset → inherits `OTEL_LOG_USER_PROMPTS` (`FZc=Fe.triBool()` `:36424`). Set `=0` to keep prompts-only |
| `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` | 2.1.193 | Background | Disable the idle-bg-shell memory-pressure reaper (default false → reaper ON) (`Ldu` `:43175`) |
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` | 2.1.187 | MCP | Override the remote tool-call idle timeout (default 300000 ms) (`Jpu` `:43147`) |
| `CLAUDE_CODE_RETRY_WATCHDOG` | 2.1.186 | CLI | Unattended-session retry path (carryover env; the `CLAUDE_CODE_MAX_RETRIES`≤15 cap is the new part) (`:602803`) |
| `MAX_STRUCTURED_OUTPUT_RETRIES` | (carryover) | Workflow | Workflow + print-mode StructuredOutput failure cap; default `5` (`NYp` `:424307`) |

### New / changed telemetry events

- **Telemetry/OTEL:** `claude_code.assistant_response` (NET-NEW OTEL log event, `:468662`); `response_length` field +1 (19→20). Emitter/redaction/truncation carryover.
- **MCP:** `tengu_mcp_login` / `tengu_mcp_logout` (NET-NEW CLI); `reauth_retry` **error_code** on the pre-existing `mcp_headers_helper` `tengu_feature_sad` feature_name (NET-NEW, `:293143`); `tengu_mcp_tool_call_auth_error`, `tengu_mcp_list_paginated` (carryover).
- **Background / Agent Team:** `task_local_shell_pressure_reap` (NET-NEW reap signal, `:454361`); `subagent_depth_cap` **error_code** on `tengu_feature_bad` (NET-NEW spawn-cap hit, `:430480`); `parent_kill_async` / `system_kill_async` (NET-NEW stop-attribution reasons on `tengu_agent_tool_terminated`, `:384658`); `user_kill_async` (carryover, now also fed by `killedBy`).
- **Permissions / Model:** `denied_by_entitlement` (NET-NEW, on `/model` restricted-model rejection, 0→1); the `toolDenialKind` 5-way taxonomy (`XKa` `:382614`) emitted but **dark** (`USe` `return !1`).
- **Plugins / Skills:** `tengu_plugin_renamed` (NET-NEW rename-follow, `:195349`); `skill_load_yaml_failed` (NET-NEW malformed-YAML diagnostic, `:451756`).
- **Removed:** `tengu_billiard_aviary` (immutable-memory experiment gate, 1→0); the `[Good]/[Bad]` memory-rating `scopeCounts` payload (gone with the experiment).
- **Compaction:** unchanged surface — `tengu_auto_compact_succeeded`/`_circuit_breaker`/`_rapid_refill_breaker`/`_prefix_overflow`/`_routed_reactive` all carryover; the `Ego`→`Rxo` refactor consolidated the two circuit-breaker emit sites into one factory with **zero** payload change.

---

## 15. Where to Look for Specifics

- [`../38_permissions/`](../38_permissions/) — classifyAllShell, denial-reason surfacing, sandbox.credentials, org model gate, recent-denied approve-persist, Agent named-spawn enforcement
- [`../36_background_agents/`](../36_background_agents/) — memory-pressure reaper, fork-aware depth cap + resume-restore, permanent stop, backgrounding/panel fixes
- [`../39_mcp/`](../39_mcp/) — idle timeout, headersHelper re-auth, discovery/OAuth retries, login/logout CLI, name suggestions
- [`../44_telemetry/`](../44_telemetry/) — the `assistant_response` event + the `OTEL_LOG_USER_PROMPTS` inheritance gotcha
- [`../42_workflow/`](../42_workflow/) — StructuredOutput post-success lockout + 5-attempt abort, `/workflows` status filter
- [`../30_agent_team/`](../30_agent_team/) — `teammateMode:"iterm2"`, `--effort` inheritance, stop attribution
- [`../45_skills/`](../45_skills/) — frontmatter case-tolerance, malformed-YAML diagnostics, `/plugin` Skills section
- [`../04_tools/`](../04_tools/) — `!` auto-respond, bash-mode path autocomplete, 50→51 tool surface
- [`../43_slash_commands/`](../43_slash_commands/) — `/rewind` before `/clear`, plugin `renames`, hook comma matcher, CLI/review miscellany
- [`../40_system_prompt/`](../40_system_prompt/) — env-block agent-proxy line, reminder-catalogue delta
- [`../31_auto_memory/`](../31_auto_memory/) — billiard_aviary immutable-memory removal; MEMORY.md reminder carryover
- [`../07_compact/`](../07_compact/) — the `Ego`→`Rxo` discriminated-union dispatcher refactor (behavior-preserving)
- The four `symbol_index_*.md` files + the twelve `symbol_additions_v2_1_193_*.md` per-theme tables — obfuscated → readable → location mappings
- The twelve `cross_validation_report_*.md` files — per-theme adversarial verification logs (every fail was line-precision drift or a corrected false-delta, all fixed)
- [`../../../claude_code_v_2.1.183/analyze/`](../../../claude_code_v_2.1.183/analyze/) — the prior window; the **unchanged foundations** (implicit-team spine, depth machinery, compaction lanes, MCP transport, memdir runtime) live there and are linked rather than re-derived here.
