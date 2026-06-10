# Symbol Index — Core Features (v2.1.143 → v2.1.156)

This index catalogs obfuscated → readable mappings for the **core feature** symbols introduced or changed between v2.1.143 and v2.1.156. Scope: Dynamic Workflows (the flagship 2.1.154 feature — gate, keyword/consent, caps, journal/respawn, lifecycle, VM, `/workflows`, ultracode, coordinator clause), Background Agents (`--exec` / `! command`), Hooks (MessageDisplay, Stop-hook deltas), Skills (reload, disallowed-tools, fork-recursion guard, effort frontmatter, bundled bodies), Compact, Thinking / Effort levels, Model-selection feature (effort/ultracode/fast-label), Plan, Todo, Steering, CLI.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model resolution/pricing/fast-mode, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI Components, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.156, the canonical source citation is `cli_inner_pretty.js:<line>` — the single pretty-printed bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`. (The older multi-`chunks.NN.mjs` split is long gone.) Where per-decl isolated files are useful, the `cli_unpack_pretty/decls/{functions,vars,classes}/<obfuscated>.js` path can be used instead.

---

## Module: Dynamic Workflows

The flagship 2.1.154 feature (GA of an internal-only 2.1.88 `WORKFLOW_SCRIPTS` prototype). Covers the `Workflow` tool object + lazy Zod schemas, the four-layer enablement gate, the per-turn keyword opt-in + first-use consent warning, the runtime resource caps (agent count / token budget / concurrency / stall), the append-only resume journal + snapshot, the launch → 16ms-batched-flush → completion lifecycle + telemetry, the VM executor, the `/workflows` save/command/viewer, the `ultracode` standing-orchestration mode, and the coordinator-prompt Workflow clause.

See `42_workflow/{workflow_tool_definition,gate_caps_lifecycle_relations}.md` for narrative analysis. (Generic tool-runtime helpers `yK`/`P45` live in `symbol_index_core_execution.md`; the shared `tm` UNC detector and `d6H` permission-rule lookup live in `symbol_index_infra_platform.md`.)

### Gate / Enablement

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$48` | `workflowAvailabilityCache` (module memo for `SL5()`; populated by `KP6`) | cli_inner_pretty.js:184789 | variable |
| `H48` | `isWorkflowsManagedDisabled` (env `CLAUDE_CODE_DISABLE_WORKFLOWS` true or managed `disableWorkflows === true`) | cli_inner_pretty.js:184750 | function |
| `hL5` | `getUserWorkflowSetting` / `getWorkflowUserToggle` (read managed/user `enableWorkflows`; overrides tier default) | cli_inner_pretty.js:184773 | function |
| `i$7` | `isWorkflowsLaunchable` (`r$7() && !CLAUDE_CODE_DISABLE_WORKFLOWS && KP6().available`) | cli_inner_pretty.js:184767 | function |
| `KP6` | `resolveWorkflowAvailabilityCached` / `getWorkflowAvailabilityCached` (memoize `SL5()` into `$48`) | cli_inner_pretty.js:184776 | function |
| `mx` | `WORKFLOW_TOOL_NAME` (the string `"Workflow"`) | cli_inner_pretty.js:216291 | constant |
| `m57` | `workflowExports` (namespace exposing the lazy `WORKFLOW_TOOL_NAME` getter) | cli_inner_pretty.js:216289 | object |
| `NZ` | `isWorkflowsEnabled` / `workflowsEnabled` (four-layer master gate: `!H48() && r$7() && KP6().available && (hL5() ?? defaultOn)`) | cli_inner_pretty.js:184757 | function |
| `qP6` | `getWorkflowDefaultOn` (`KP6().defaultOn`) | cli_inner_pretty.js:184764 | function |
| `r$7` | `isWorkflowsPolicyAllowed` / `getWorkflowGateRaw` (Statsig/managed `allow_workflows` capability gate) | cli_inner_pretty.js:184770 | function |
| `SL5` | `resolveWorkflowAvailability` (`{available, defaultOn}` from `CLAUDE_CODE_WORKFLOWS` env + `tengu_workflows_enabled` gate + tier; `defaultOn = tier !== "pro"`) | cli_inner_pretty.js:184780 | function |

### Keyword Opt-In

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bg6` | `matchKeyword` (generic keyword matcher with code-span/path/flag masking; shared with ultraplan/ultrareview) | cli_inner_pretty.js:412125 | function |
| `KR_` | `makeWorkflowKeywordReminder` (emits `tengu_workflow_keyword` + `workflow_keyword_request` reminder) | cli_inner_pretty.js:412916 | function |
| `lj4` | `hasWorkflowKeyword` (`pg6(text).length > 0`) | cli_inner_pretty.js:412178 | function |
| `pg6` | `findWorkflowKeyword` (`Bg6(text, "workflows?")` — match prose keyword outside code spans) | cli_inner_pretty.js:412172 | function |

### Consent / Usage Warning

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `o0_` | `recordWorkflowUsageConsent` (persists `skipWorkflowUsageWarning`, emits `tengu_workflow_usage_warning_accepted`) | cli_inner_pretty.js:378654 | function |
| `r0_` | `workflowNeedsUsageConsentPrompt` (gate for the one-time usage warning; ultracode short-circuits via `ar`) | cli_inner_pretty.js:378645 | function |
| `sF$` | `hasWorkflowUsageConsent` (checks `skipWorkflowUsageWarning` across settings scopes) | cli_inner_pretty.js:53591 | function |

### Resource Caps

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cG_` | `WORKFLOW_PARALLEL_DEFAULT` (concurrency limit seeded from CPU count via `dG_`) | cli_inner_pretty.js:375676 | variable |
| `dG_` | `computeWorkflowConcurrency` (`min(16, max(2, cores-2))`) | cli_inner_pretty.js:374930 | function |
| `F74` | `WORKFLOW_AGENT_CAP` (`1000` agent-call ceiling) | cli_inner_pretty.js:375678 | constant |
| `fW8` | `WorkflowBudgetExceededError` (thrown when the output-token budget is spent) | cli_inner_pretty.js:375746 | class |
| `lG_` | `WORKFLOW_REMOTE_DEFAULT` (`50` — semaphore width for the **remote** agent executor `U` via `b = BiH(lG_, U)` @375002; the remote path is disabled in this build, so unused. NOT a `pipeline()` knob — all `agent()` calls dispatch through the local executor `C = BiH(cG_, R)` @375001) | cli_inner_pretty.js:375677 | constant |
| `nG_` | `agentCapErrorMessage` (diagnostic text for `Q74` — the `budget.remaining()` infinite-loop hint) | cli_inner_pretty.js:375736 | constant |
| `Q74` | `WorkflowAgentCapError` (thrown at the `F74` agent cap) | cli_inner_pretty.js:375740 | class |
| `tG_` | `WORKFLOW_STALL_MS_DEFAULT` (`180000` = 3 min per-agent stall timeout) | cli_inner_pretty.js:375699 | constant |

### Journal / Respawn / Snapshot (Resume)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `b74` | `listWorkflowSnapshots` (read + sort run snapshots for `/workflows`) | cli_inner_pretty.js:374781 | function |
| `bp6` | `LocalFileJournal` (append-only `journal.jsonl` per run) | cli_inner_pretty.js:374871 | class |
| `C74` | `writeWorkflowSnapshot` (write the run snapshot JSON for `/workflows` history) | cli_inner_pretty.js:374771 | function |
| `gG_` | `canonicalizeAgentOpts` (stable JSON of cache-relevant opts: schema/model/isolation/agentType) | cli_inner_pretty.js:374847 | function |
| `gtH` | `registerSessionHook` (generic session-hook registrar; powers the StructuredOutput nudge) | cli_inner_pretty.js:372079 | function |
| `m74` | `journalKey` (SHA-256 cache key `v2:<hash>` of phase + prompt + canonical opts) | cli_inner_pretty.js:374867 | function |
| `QG_` | `JOURNAL_KEY_VERSION` (`"v2"` cache-key prefix; bump invalidates all journals) | cli_inner_pretty.js:374910 | constant |
| `x74` | `indexJournal` (fold journal lines into `{results, started}` maps) | cli_inner_pretty.js:374835 | function |

### Tool Object / Schemas / Meta Parser

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `b44` | `resolveWorkflowSource` (resolve `scriptPath` > `name` > `script` to script + telemetry source) | cli_inner_pretty.js:378081 | function |
| `BP8` | `compileWorkflowScript` (wrap the body in `async () => {}` and compile to a VM script) | cli_inner_pretty.js:367468 | function |
| `bZ_` | `validateMetaFields` (require non-empty `name`/`description`; optional `title`/`whenToUse`; normalize `phases`) | cli_inner_pretty.js:371832 | function |
| `c0_` | `WORKFLOW_DESC_TELEMETRY_CAP` (`200` — char cap on the workflow description in telemetry) | cli_inner_pretty.js:378111 | constant |
| `CZ_` | `metaPropertyKey` (resolve a `meta` object-literal property key, rejecting computed/reserved keys) | cli_inner_pretty.js:371824 | function |
| `d0_` | `workflowNameForTelemetry` (built-in name verbatim, else `"custom"`) | cli_inner_pretty.js:378099 | function |
| `d9H` | `slugifyWorkflowName` (lowercase to `[a-z0-9-]`, fall back to `"workflow"`) | cli_inner_pretty.js:145267 | function |
| `Fp6` | `WORKFLOW_DESCRIPTION` (the long opt-in policy + scripting-DSL reference returned by `prompt()`/`description()`) | cli_inner_pretty.js:376077 | variable |
| `FZ` | `parseWorkflowMeta` (Acorn-parse, assert first statement is `export const meta = <literal>`, eval it, split body) | cli_inner_pretty.js:371746 | function |
| `g0_` | `workflowOutputSchema` (lazy Zod object for the tool result: `status`/`taskId`/`runId`/`scriptPath`/…) | cli_inner_pretty.js:378186 | variable |
| `IZ_` | `isMetaExport` (assert an `ExportNamedDeclaration` is `const meta = <ObjectExpression>`) | cli_inner_pretty.js:371779 | function |
| `l0_` | `workflowDescriptionForTelemetry` (built-in description truncated to `c0_`, else empty) | cli_inner_pretty.js:378103 | function |
| `n0_` | `workflowTool` (the tool object built by `yK`; `aliases:["RunWorkflow"]`, searchHint, schemas, gate, validate, permissions, call) | cli_inner_pretty.js:378217 | object |
| `pK4` | `evalLiteralNode` (recursively evaluate only pure-literal AST nodes; throw on non-literal node types) | cli_inner_pretty.js:371786 | function |
| `Q0_` | `workflowInputSchema` (lazy Zod strictObject: `script`/`name`/`scriptPath`/`args`/`resumeFromRunId`/…) | cli_inner_pretty.js:378140 | variable |
| `RZ_` | `RESERVED_META_KEYS` (`Set(["__proto__","constructor","prototype"])` — prototype-pollution guard) | cli_inner_pretty.js:371853 | constant |
| `UK4` | `evalObjectLiteral` (statically evaluate the `meta` object literal; ban computed keys, methods, reserved keys) | cli_inner_pretty.js:371813 | function |
| `xZ_` | `normalizeMetaPhases` (coerce `meta.phases` to `{title, detail?, model?}[]`, dropping entries without a string `title`) | cli_inner_pretty.js:371842 | function |

### Script Persistence / Path Security

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Hj$` | `readWorkflowScriptFile` (read a `scriptPath` from disk, rejecting UNC paths, bounded at `jI + 1` bytes) | cli_inner_pretty.js:145294 | function |
| `jI` | `WORKFLOW_SCRIPT_MAX_BYTES` (`524288` = 512 KiB script-size cap) | cli_inner_pretty.js:145308 | constant |
| `O68` | `workflowScriptsDir` (`<sessionRoot>/<sessionId>/workflows/scripts/` + sep) | cli_inner_pretty.js:145274 | function |
| `xFK` | `persistWorkflowScript` (fire-and-forget write to the session dir at mode `0o600`; return path synchronously) | cli_inner_pretty.js:145280 | function |
| `Y95` | `workflowScriptPath` (`${workflowScriptsDir()}${slug}-${runId}.js`) | cli_inner_pretty.js:145277 | function |

### Lifecycle / Telemetry / VM Executor

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H0_` | `WORKFLOW_LOG_CAP` (`1000` — max log lines kept by `q44`; declared `var H0_ = 1000`) | cli_inner_pretty.js:376062 | constant |
| `q44` | `runWorkflowScript` (executes the VM script: load journal, `runInContext` with the 30s `mP8` sync timeout, abort race, `structuredClone` the result out, returns `{result, agentCount, logs, failures, durationMs, error?}`) | cli_inner_pretty.js:376007 | function |
| `TrH` | `emitTaskProgress` (flush a `task_progress` system message to the UI progress tree) | cli_inner_pretty.js:278050 | function |

### Runtime / VM Sandbox / Subagent Prompts

The execution runtime analyzed in `42_workflow/workflow_runtime_and_subagents.md`: the VM-bridge factory that builds the DSL globals, the VM-context builder, the determinism shim + intrinsic hardening, the sandboxed timers/await/console bridges, the nested-`workflow()` factory, the per-agent stall ceiling, and the workflow-subagent system prompts + agent defs. (`BP8`/`q44` are in the Tool Object/Schemas and Lifecycle sections above. The generic semaphore `BiH`, deep-clone `AP`, `iY`/`klH` StructuredOutput plumbing, and the coordinator-mode worker prompt `ZD7` live in `symbol_index_core_execution.md`; the determinism-shim injector `uP8` lives in `symbol_index_infra_platform.md` Sandbox.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aB6` | `sandboxConsole` (VM `console` shim: `log/info/debug`→plain, `error`→`[error]`, `warn`→`[warn]`; all route to the `workflow_log` channel) | cli_inner_pretty.js:371858 | function |
| `aG_` | `WORKFLOW_STRUCTURED_PROMPT` (StructuredOutput-forcing subagent system-prompt body: "you MUST call StructuredOutput exactly once; the script reads ONLY the tool call") | cli_inner_pretty.js:375759 | variable |
| `g74` | `makeWorkflowHooks` (VM-bridge factory: builds the `agent`/`parallel`/`pipeline`/`log`/`phase` closures, caps `W()`/`G()`, phase allocator, local executor `C = BiH(cG_, R)` @375001, remote `b = BiH(lG_, U)` @375002; returns the bound globals object @375658-375673) | cli_inner_pretty.js:374939 | function |
| `H44` | `buildWorkflowContext` (freeze `budget`; `vm.createContext` with exactly `{agent,parallel,pipeline,log,phase,workflow,args,budget,console,...timers}`; applies `uP8`/`UtH`/`uK4`) | cli_inner_pretty.js:375973 | function |
| `hZ_` | `RANDOM_ERROR_MESSAGE` (user-facing "Math.random() is unavailable in workflow scripts (breaks resume)…" embedded in `SZ_`) | cli_inner_pretty.js:367486 | constant |
| `iG_` | `WORKFLOW_SUBAGENT_PROMPT` (plain subagent system-prompt body: final text returned verbatim as the script's return value; "Do NOT use SendUserMessage") | cli_inner_pretty.js:375683 | variable |
| `mp6` | `WORKFLOW_SUBAGENT_DEF` (agent def `agentType:"workflow-subagent"`, `tools:["*"]`, `disallowedTools:[cd, sq]` = `["SendUserMessage","Agent"]`, `getSystemPrompt:()=>iG_`) | cli_inner_pretty.js:375766 | object |
| `mP8` | `WORKFLOW_SYNC_TIMEOUT_MS` (`30000` — sync-execution timeout for `vmScript.runInContext`; Node `vm` timeout covers synchronous code only; used at 376019) | cli_inner_pretty.js:367489 | constant |
| `oG_` | `WORKFLOW_STRUCTURED_TAIL` (StructuredOutput-forcing tail appended to a named agent's prompt) | cli_inner_pretty.js:375754 | variable |
| `p74` | `MAX_STALL_RETRIES` (`5` — per-agent stall retry ceiling before throwing "agent stalled/abandoned"; retry loop at 375429) | cli_inner_pretty.js:375700 | constant |
| `QK4` | `createNestedWorkflowGlobal` (builds the `workflow()` global: resolve name/scriptPath, `FZ`+`BP8` child compile, fresh sandboxed child context sharing parent hooks, child `phase()` no-op, child `workflow()` hard-rejects — one level only) | cli_inner_pretty.js:371875 | function |
| `rG_` | `WORKFLOW_SUBAGENT_TAIL` (plain subagent prompt tail appended to a named agent's prompt) | cli_inner_pretty.js:375690 | variable |
| `sG_` | `WORKFLOW_STRUCTURED_DEF` (`{...mp6, getSystemPrompt:()=>aG_}` — workflow-subagent def with the StructuredOutput body; selected by `KH ?? (_H ? sG_ : mp6)` @375146) | cli_inner_pretty.js:375775 | object |
| `SZ_` | `DETERMINISM_SHIM` (in-VM program: `Math.random`/`Date.now`/argless-`new Date`/bare-`Date` throw; closes the `(new Date(x)).constructor.now()` backdoor; `Object.freeze(RealDate)`) | cli_inner_pretty.js:367491 | variable |
| `uK4` | `vmAwaitBridge` (compiles `(async v => v)` inside the context so VM `await` resolves in-sandbox) | cli_inner_pretty.js:367583 | function |
| `UtH` | `hardenVMIntrinsics` (freezes intrinsic prototypes via SES override-enable; freezes `Error.prepareStackTrace`; deletes `ShadowRealm`/`WebAssembly`) | cli_inner_pretty.js:367515 | function |
| `xK4` | `makeSandboxedTimers` (abort-aware `setTimeout`/`clearTimeout` exposed to the VM context; clears all on abort) | cli_inner_pretty.js:367445 | function |
| `yZ_` | `DATE_ERROR_MESSAGE` (user-facing "Date.now()/new Date() are unavailable in workflow scripts (breaks resume)…" embedded in `SZ_`) | cli_inner_pretty.js:367484 | constant |

### `/workflows` Save & UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Q4` | `saveWorkflow` (persist a named workflow, refuse-clobber-unless-overwrite, emits `tengu_workflow_saved`) | cli_inner_pretty.js:507621 | function |
| `_1z` | `getProjectWorkflowsDir` (project-scope `<project>/.claude/workflows/` path for save) | cli_inner_pretty.js:507616 | function |
| `Djz` | `isLocalWorkflowTask` (`task.type === "local_workflow"` — app-state task filter for the viewer's live runs) | cli_inner_pretty.js:538819 | function |
| `gt4` | `WorkflowHistoryDialog` (`/workflows` viewer component; merges live + snapshot runs, list/detail modes) | cli_inner_pretty.js:538403 | React component |
| `o74` | `getBuiltinWorkflows` (returns the built-in workflow list `r74`, empty in this build) | cli_inner_pretty.js:375876 | function |
| `Pjz` | `workflowsCommand` (`/workflows` local-jsx slash command, gated on `NZ()`) | cli_inner_pretty.js:538934 | object |
| `r74` | `BUILTIN_WORKFLOWS` (the built-in workflow array; assigned `[]` in this build) | cli_inner_pretty.js:375880 | variable |
| `wjz` | `getWorkflowRunId` (`task.workflowRunId` accessor; keys the live + snapshot de-dup in the viewer's merge effect at 538436) | cli_inner_pretty.js:538816 | function |

### Coordinator Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dk5` | `getCoordinatorSystemPrompt` (coordinator system prompt with the `NZ()`-gated Workflow tool clause) | cli_inner_pretty.js:216506 | function |

Known new themes:

- v2.1.154 GA of dynamic workflows: ask Claude to create a workflow, it orchestrates tens-to-hundreds of background agents; `/workflows` views runs
- Deterministic scripts → longest-unchanged-prefix journal cache (`resumeFromRunId` = 100% hit on same script + args)
- Four resource caps (agent count 1000 / token budget / concurrency `min(16,cores-2)` / 3-min stall) bound buggy infinite-loop scripts
- v2.1.152 simplified inline progress display (16ms-batched `task_progress`); v2.1.156 fixed the stray unselectable "main" task-panel row
- `ultracode` standing-orchestration mode (xhigh effort + Workflow-on-every-task) — flag-only, gated on `NZ()` + xhigh-capable model

---

## Module: Background Agents (`--exec` / `! command` + 2.1.143–156 fixes)

Shell-exec background sessions (`claude --bg --exec`, the agents-view `! <command>`), the unified background dispatcher `ol`/`ywz`, the four-state background-session classifier (working/blocked/done/failed), worker retire/respawn reliability fixes inside `BgWorkerHandle` (`SF`), the subagent worktree-isolation guard, the `--bg-pty-host` orphan watchdog, and daemon stale-exec / binary-takeover / `/bg`-handoff lifecycle deltas.

See `36_background_agents/{shell_exec_sessions,unified_dispatcher_ol,...}.md` for narrative analysis. (Platform telemetry helpers and the dispatch gate route to `symbol_index_infra_platform.md`; the agents-view input parser `q5q` routes to `symbol_index_infra_integration.md`.)

### Shell-Exec Sessions & Unified Dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `al` | `extractFlagValue` (generic `--flag=value` / `--flag value` argv reader, stops at `--`) | cli_inner_pretty.js:541547 | function |
| `Bwz` | `bgDispatchGate` (block bypass/auto bg dispatch unless previously opted in; parses pre-`--` argv) | cli_inner_pretty.js:542514 | function |
| `Ce4` | `buildTemplateFromAgent` (agent-def → `{name,description,initialPrompt,color}` template adapter) | cli_inner_pretty.js:540913 | function |
| `ee4` | `BG_FLAG_ALIASES` (`["--bg","--background"]` stripped before re-parse) | cli_inner_pretty.js:542622 | variable |
| `Ewz` | `resolveShellLaunch` / `shellLaunchSpec` (pick `$SHELL -c` / `COMSPEC /d /s /c` / `/bin/sh -c`) | cli_inner_pretty.js:541727 | function |
| `Fe4` | `claimSpareOrColdDispatch` (claim a pre-warmed spare worker, else cold dispatch) | cli_inner_pretty.js:541102 | function |
| `gy$` | `shellExecGate` (kill-switch for the shell-exec bang command; returns `true` in 2.1.156) | cli_inner_pretty.js:541028 | function |
| `hwz` | `bgFlagExecHandler` (`claude --bg --exec` CLI handler; `--exec`/`--exec=` parse, `--name` compose, dispatch) | cli_inner_pretty.js:541956 | function |
| `IV6` | `CLAUDE_AGENT_DEF` (built-in catch-all `claude` agent; teaches narrate/restate/`result:`/`needs input:`/`failed:`) | cli_inner_pretty.js:236184 | object |
| `kd` | `interpolateMentions` (substitute `@file`/`@image` placeholders into intent/exec text, right-to-left) | cli_inner_pretty.js:177847 | function |
| `kqq` | `idlePlaceholderDetail` (`"(idle — send a prompt to start)"`) | cli_inner_pretty.js:542585 | constant |
| `Nqq` | `seedBgState` (standalone bg seed-state writer for the non-`ywz` seed path) | cli_inner_pretty.js:541737 | function |
| `Nwz` | `VALUED_FLAGS` (set of value-bearing flags whose value `extractFlagValue` skips) | cli_inner_pretty.js:541547 | variable |
| `ol` | `unifiedBgDispatch` / `dispatchBgSession` (single bg-dispatch seam: gate, identity, delegate to `ywz`) | cli_inner_pretty.js:541769 | function |
| `pe4` | `fleetDispatchExec` (agents-view shell-exec dispatch; pre-seed `Xwz` state, then `ol(..,"fleet",..)`) | cli_inner_pretty.js:541031 | function |
| `qKH` | `claudeAgentTemplate` (`Ce4(IV6)` built-in catch-all template; placeholder in exec parse result) | cli_inner_pretty.js:541290 | variable |
| `Tqq` | `sendDispatch` (daemon dispatch send + nonce; shell→`my$`, else→`EF({forceTransient})`) | cli_inner_pretty.js:541571 | function |
| `Xwz` | `EXEC_TEMPLATE` / `execTemplate` (`{ name: "exec", description: "" }` shell-session marker) | cli_inner_pretty.js:541292 | object |
| `ywz` | `dispatchWorker` / `seedBgSessionState` (parse argv → launch mode → seed state → send → rescue) | cli_inner_pretty.js:541789 | function |

### `/bg` Handoff & Respawn Replay

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_H9` | `extractResumeSessionId` (pull the resume target session id from `--resume`/`-r` argv) | cli_inner_pretty.js:542463 | function |
| `Ah8` | `deriveBackgroundSeed` (derive intent/name/detail seed from the transcript for the `/bg` handoff) | cli_inner_pretty.js:542733 | function |
| `BL$` | `setActiveWorktreeSession` / `clearForegroundWorktree` (set/clear the module-global `mL$` worktree-session record) | cli_inner_pretty.js:542723 | function |
| `gwz` | `BackgroundForkPrompt` (React component: confirm `/bg`, call `zh8`, emit fork telemetry, banner) | cli_inner_pretty.js:542763 | function |
| `mwz` | `stripSessionIdArgs` (drop user `--session-id` from prompt-mode argv tail; pass post-`--` verbatim) | cli_inner_pretty.js:542497 | function |
| `ny$` | `formatBgHints` ("backgrounded · <short>" banner with attach/logs/stop hints) | cli_inner_pretty.js:542079 | function |
| `pwz` | `RESPAWN_BOOLEAN_FLAGS` (boolean keep-set for respawn replay: `--dangerously-skip-permissions`, `--reply-on-resume`, …) | cli_inner_pretty.js:542669 | variable |
| `sY` | `getActiveWorktreeSession` (returns the active bg worktree-session record `mL$`) | cli_inner_pretty.js:239369 | function |
| `Swz` | `dispatchFailureLabel` (dispatch-failure reason → human label: "not running" / "timed out" / …) | cli_inner_pretty.js:542063 | function |
| `Uwz` | `firstPositionalAsIntent` (derive intent from last non-flag positional that isn't the resume id) | cli_inner_pretty.js:542530 | function |
| `uwz` | `stripLaunchFlags` (drop resume/fork/session-id flags for resume-mode `flagArgs`) | cli_inner_pretty.js:542476 | function |
| `zh8` | `backgroundCurrentSession` / `spawnBackgroundFork` (resume the live session in a bg worker via `--resume --fork-session`; worktree handoff — bundler ground-truth export name is `spawnBackgroundFork`, see `X$(OH9,{spawnBackgroundFork:()=>zh8,…})` at :542679) | cli_inner_pretty.js:542680 | function |
| `zH9` | `collectRespawnFlags` (keep-list flag collector for respawn replay: value-bearing `hqq` + boolean `pwz`) | cli_inner_pretty.js:542542 | function |

### `/background` (`/bg`) Command Surface, Guards & Confirm-UI State

> Narrative: `36_background_agents/background_slash_command.md`. The generic primitives the surface composes with — `kLH` (immediate-predicate evaluator), `D$` (store-selector hook), `t9`/`C8` (confirm/dialog UI) — live in `symbol_index_infra_integration.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `awz` | `backgroundCommandDefExport` (default export of `MH9`; `= owz`) | cli_inner_pretty.js:542950 | variable |
| `bzH` | `requestDaemonDetach` (Guard 1 path: when already a bg session, ask the daemon to detach this client) | cli_inner_pretty.js:457636 | function |
| `cwz` | `selectAlwaysDenyRules` (bg-prompt store selector → `toolPermissionContext.alwaysDenyRules`) | cli_inner_pretty.js:542877 | function |
| `dwz` | `selectTasks` (bg-prompt store selector → `state.tasks`, feeds the inflight counter) | cli_inner_pretty.js:542874 | function |
| `Fwz` | `backgroundCall` (the `/background` `call` handler: two guards → `Ah8` seed → returns `gwz` element) | cli_inner_pretty.js:542895 | function |
| `hV8` | `countInflightTasks` (count + summarize in-flight work the fork won't inherit; `{count,kinds,summary}`) | cli_inner_pretty.js:457394 | function |
| `iwz` | `selectPermissionMode` (bg-prompt store selector → `toolPermissionContext.mode`) | cli_inner_pretty.js:542886 | function |
| `jH9` | `initBackgroundCommandDef` (lazy thunk assigning `owz`/`awz`) | cli_inner_pretty.js:542939 | function |
| `lwz` | `selectAlwaysAllowRules` (bg-prompt store selector → `toolPermissionContext.alwaysAllowRules`) | cli_inner_pretty.js:542880 | function |
| `MH9` | `backgroundCommandDefModule` (def namespace; `default → awz`) | cli_inner_pretty.js:542936 | object |
| `NWH` | `isSessionPersistenceDisabled` (Guard 2: test-mode / `Kb()` / `CLAUDE_CODE_SKIP_PROMPT_HISTORY` → fork would have nothing to resume) | cli_inner_pretty.js:546176 | function |
| `nwz` | `selectAdditionalWorkingDirectories` (bg-prompt store selector → `toolPermissionContext.additionalWorkingDirectories`) | cli_inner_pretty.js:542883 | function |
| `OH9` | `backgroundCommandImplModule` (impl namespace; exports `spawnBackgroundFork`(`zh8`)/`deriveBackgroundSeed`(`Ah8`)/`call`(`Fwz`)) | cli_inner_pretty.js:542678 | object |
| `owz` | `backgroundCommandDef` (the `/background` alias `/bg` `local-jsx` command def: name/aliases/description/argumentHint/immediate/isEnabled/load) | cli_inner_pretty.js:542938 | object |
| `rwz` | `selectEffortValue` (bg-prompt store selector → `state.effortValue`; becomes `--effort`) | cli_inner_pretty.js:542889 | function |
| `Sqq` | `initBackgroundImplDeps` (init thunk: load dep modules + bind React `NAH` before the impl namespace is handed back) | cli_inner_pretty.js:542914 | function |
| `swz` | `currentJobDir` (returns `process.env.CLAUDE_JOB_DIR`) | cli_inner_pretty.js:542952 | function |
| `v7` | `isBackgroundSession` (`VOH() === "bg"`; Guard 1 detection; also gates `/stop` `isEnabled`) | cli_inner_pretty.js:99358 | function |

### Background-Session Lifecycle Commands (`/stop`, `/fork`)

> Sibling commands documented alongside `/background` in `36_background_agents/background_slash_command.md` §6.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Dz` | `stopCommandNonInteractive` (`/stop` `type:"local"` variant, `supportsNonInteractive:true`, `isEnabled:v7`) | cli_inner_pretty.js:543016 | object |
| `_Dz` | `forkCommandDef` (`/fork` `local-jsx` def "Spawn a background agent that inherits the full conversation"; `isEnabled:oT`) | cli_inner_pretty.js:543045 | object |
| `ewz` | `stopBridgeCall` (`/stop` call via bridge → `Yh8("bridge")`, returns `{type:"skip"}`) | cli_inner_pretty.js:542997 | function |
| `HDz` | `stopCommandJsx` (`/stop` `local-jsx` def "Stop this background session; transcript and worktree are kept"; `immediate:true`, `isEnabled:v7`) | cli_inner_pretty.js:543008 | object |
| `KDz` | `forkCommandCall` (`/fork` call: trim directive, error if empty, `Wr6` fork, print "forked `<name>` (`<id4>`)") | cli_inner_pretty.js:543028 | function |
| `qDz` | `stopCommandDefault` (`= HDz`, default export of the `/stop` jsx module) | cli_inner_pretty.js:543024 | variable |
| `twz` | `stopInteractiveCall` (`/stop` jsx call → `onDone()` then `Yh8("stop_command")`) | cli_inner_pretty.js:542989 | function |
| `Wr6` | `forkConversation` (spawn a conversation-inheriting subagent from the live transcript + rendered system prompt) | cli_inner_pretty.js:454216 | function |
| `Yh8` | `stopSelfSession` (`/stop` core: `tengu_bg_agent_action` telemetry, terminal-state-guarded "stopped" write, "Session stopped." banner, graceful `tK` exit) | cli_inner_pretty.js:542955 | function |

### Four-State Classifier (working/blocked/done/failed)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a04` | `parseClassifierJson` (strip code fence, slice first `{`…last `}`, JSON.parse, zod-validate) | cli_inner_pretty.js:449308 | function |
| `Bd_` | `createClassifierJobState` (per-session classifier scratch state: prevState, latestAsk, accumulatedOutputs, …) | cli_inner_pretty.js:449816 | function |
| `ci6` | `summarizeToolCallsDeterministic` (frequency-sorted top-5 tool-name tally for classifier context) | cli_inner_pretty.js:449322 | function |
| `Dd_` | `MARKER_FAILED` (regex `failed: …` explicit marker) | cli_inner_pretty.js:449563 | constant |
| `dd_` | `findLatestRealUserAsk` (last non-meta string user turn → classifier `latestAsk`) | cli_inner_pretty.js:449875 | function |
| `Ed_` | `RX_VERDICT` (tail "VERDICT: PASS\|FAIL" → done) | cli_inner_pretty.js:449567 | constant |
| `fd_` | `STATE_DEFINITIONS` (long-form working/blocked/done/failed defs; reconciler allow-list) | cli_inner_pretty.js:449552 | object |
| `Gd_` | `RX_AGENTS_STATUS` (tail "N agents in flight" / "Loop active" → working/idle) | cli_inner_pretty.js:449567 | constant |
| `Hc_` | `EXCLUDED_TOOLS` (`Set([df, rP, MJ])` — tools omitted from the classifier tool tally) | cli_inner_pretty.js:450512 | constant |
| `hd_` | `RX_STOPPING_HERE` (tail "Stopping here" / "Parked the branch" → blocked) | cli_inner_pretty.js:449567 | constant |
| `i04` | `fastPathClassify` (regex fast-path battery; tagged branch or null; code-fence aware) | cli_inner_pretty.js:449166 | function |
| `Jd_` | `MARKER_NEEDS_INPUT` (regex `needs input: …` explicit marker) | cli_inner_pretty.js:449563 | constant |
| `jd_` | `isTerminalState` (`Md_.has(state)` predicate; classifier-side) | cli_inner_pretty.js:449075 | function |
| `JT4` | `classifyState` (classifier dispatcher: fast-path → heuristic → LLM; emits `tengu_bg_classify`) | cli_inner_pretty.js:450335 | function |
| `kd_` | `RX_PUSHED_COMMITTED` (tail "Pushed to" / "Committed as" / "Opened PR" → done) | cli_inner_pretty.js:449567 | constant |
| `KPH` | `isInsideCodeFence` (fenced-region detector voiding markers inside ``` blocks) | cli_inner_pretty.js:449087 | function |
| `Ld_` | `MARKER_IM_BLOCKED` (regex `I'm blocked: …` explicit marker) | cli_inner_pretty.js:449563 | constant |
| `Md_` | `TERMINAL_STATES` (`Set(["done","failed","stopped"])`) | cli_inner_pretty.js:449562 | constant |
| `n04` | `closingTailShape` (classify the closing shape — empty/code-fence/result-line/trailing-q/… — for telemetry) | cli_inner_pretty.js:449153 | function |
| `Nd_` | `RX_READY_FOR` (tail "Ready for review / to merge / ship" → done) | cli_inner_pretty.js:449567 | constant |
| `o04` | `buildClassifierUserMsg` (assemble `Current state / Tool calls / User's ask / tail` user message) | cli_inner_pretty.js:449295 | function |
| `Od_` | `OUTPUT_FIELDS` (`{ result: "…" }` allow-list for `output.*` keys) | cli_inner_pretty.js:449561 | object |
| `Pd_` | `scanExplicitMarkers` (find last `failed:`/`needs input:`/`blocked:` marker outside code fences) | cli_inner_pretty.js:449139 | function |
| `Qi6` | `heuristicLastLine` (last-non-empty-line "working" fallback classifier) | cli_inner_pretty.js:449286 | function |
| `r04` | `classifierPrompt` (the full four-state working/blocked/done/failed classifier system prompt) | cli_inner_pretty.js:449361 | variable |
| `sZ` | `truncateWithEllipsis` (surrogate-safe one-line truncator, cap `iL`=800) | cli_inner_pretty.js:449078 | function |
| `Td_` | `RX_WILL_CHECK_BACK` (tail "I'll check back/re-check (not your…)" → working/idle) | cli_inner_pretty.js:449567 | constant |
| `Vd_` | `RX_CANT_PROCEED` (tail "I can't/cannot proceed/continue" → blocked) | cli_inner_pretty.js:449567 | constant |
| `vd_` | `RX_GIVING_UP` (tail "Giving up" / "not actionable" → failed) | cli_inner_pretty.js:449567 | constant |
| `Wd_` | `RX_FORWARD_INTENT` (active-verb opener with negative look-aheads → working) | cli_inner_pretty.js:449567 | constant |
| `Xd_` | `MARKER_BLOCKED` (regex `blocked: …` explicit marker) | cli_inner_pretty.js:449563 | constant |
| `yd_` | `RX_PLEASE_DO_X` (tail "Please start/run/provide/export `ENV_VAR`" → blocked) | cli_inner_pretty.js:449567 | constant |
| `yk$` | `reconcileClassifierResult` (validate/fill `{state,detail,tempo,needs,output}` against prior state) | cli_inner_pretty.js:449325 | function |
| `Zd_` | `RX_PASSIVE_WAIT` (temporal/conditional clause meaning "not the agent's own next step") | cli_inner_pretty.js:449570 | constant |
| `z04` | `generateToolUseSummary` (LLM "git-commit-subject" tool-call → ≤30-char progress label) | cli_inner_pretty.js:447331 | function |
| `Zg_` | `TOOL_SUMMARY_PROMPT` (label-writing system prompt for `generateToolUseSummary`) | cli_inner_pretty.js:447393 | variable |

### Worker State Machine / Worktree Isolation / PTY Host

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_J` | `isSettledState` (`isTerminalState(state) && tempo !== "active"`) | cli_inner_pretty.js:184283 | function |
| `$q9` | `writePtyLog` (append a timestamped line to the pty-host log) | cli_inner_pretty.js:559334 | function |
| `esH` | `worktreeIsolationGuard` (path-block predicate run before writes; 2.1.156 `$.agentId` subagent branch) | cli_inner_pretty.js:346660 | function |
| `Eu6` | `resolveBgIsolation` (env `CLAUDE_BG_ISOLATION` then `settings.worktree.bgIsolation`; `"none"` opts out) | cli_inner_pretty.js:346655 | function |
| `evH` | `terminalStateToOutcome` (done→success / failed→failure / stopped→stopped / else null) | cli_inner_pretty.js:184274 | function |
| `jPz` | `runPtyHost` (`claude --bg-pty-host` entry; `Bun.Terminal` + REPL child + orphan watchdog) | cli_inner_pretty.js:559067 | function |
| `m9H` | `getWorktreeCreateHook` (true when a `WorktreeCreate` hook is configured) | cli_inner_pretty.js:143815 | function |
| `n1H` | `ENTER_WORKTREE_TOOL_NAME` (`"EnterWorktree"`, named in the isolation-guard block message) | cli_inner_pretty.js:216098 | constant |
| `nJ` | `recordJobExitCause` (write the `exit-cause` marker file in `CLAUDE_JOB_DIR`) | cli_inner_pretty.js:9546 | function |
| `Nv` | `isTerminalState` (worker-side: `terminalStateToOutcome(state) !== null`) | cli_inner_pretty.js:184280 | function |
| `SF` | `BgWorkerHandle` (worker-handle class, renamed from v2.1.142 `aB`; phase machine + retire/respawn) | cli_inner_pretty.js:559938 | class |
| `T_$` | `gitRootIsNonCanonical` (`findGitRoot(p) !== null && findCanonicalGitRoot(p) !== findGitRoot(p)`; true when a path's git-root differs from the canonical/main-repo root — used by `esH` to skip the isolation guard) | cli_inner_pretty.js:46920 | function |
| `ujH` | `isExecSession` (`template === "exec" && respawnFlags.length === 0`; on-disk record predicate) | cli_inner_pretty.js:184286 | function |
| `VPz` | `isLegalPhaseTransition` (phase-transition guard, renamed from v2.1.142 `UB5`; logic unchanged) | cli_inner_pretty.js:559923 | function |
| `wh$` | `failPtyHost` (log + `process.exit(1)` for the pty-host) | cli_inner_pretty.js:559345 | function |
| `x6$` | `idleNeedsHint` (`"send a prompt to start"`) | cli_inner_pretty.js:542584 | constant |
| `y1` | `findGitRoot` (cached walk-up-for-`.git` git-root finder; exported as `findGitRoot`; non-null ⇒ path inside a git repo. Assigned `y1 = oq1()` at 47419; underlying body `BNq` at 47382) | cli_inner_pretty.js:47419 | function |
| `yq9` | `formatPhase` (phase → log string, renamed from v2.1.142 `FI4`) | cli_inner_pretty.js:559920 | function |

### Daemon Lifecycle Deltas (stale-exec / binary takeover / supervisor)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a69` | `tccDisclaimRespawn` (macOS responsibility-disclaim self re-exec via `posix_spawn` SETEXEC) | cli_inner_pretty.js:559016 | function |
| `Bpz` | `EMPTY_PIN_SET` (`new Set()` passed to bypass the pinned guard during low-mem escalation) | cli_inner_pretty.js:648202 | constant |
| `By$` | `isLowMemory` (free-memory under threshold; always false on macOS) | cli_inner_pretty.js:540459 | function |
| `C6$` | `respawnJob` (explicit-respawn path; exec branch re-runs the command with zero flags) | cli_inner_pretty.js:541152 | function |
| `EF` | `ensureDaemonRunning` (ensure a daemon is reachable; stale-exec fallback to transient) | cli_inner_pretty.js:540124 | function |
| `fCH` | `waitDaemonReachable` (poll `ping` op until reachable or timeout) | cli_inner_pretty.js:540078 | function |
| `fwz` | `currentLaunchTarget` (the launcher's own exec path / prefix arg) | cli_inner_pretty.js:540216 | function |
| `GPz` | `POST_ADOPT_GRACE_MS` (120000) | cli_inner_pretty.js:560836 | constant |
| `iy8` | `lowMemThresholdBytes` (`tengu_bg_low_mem_mb` ×1 GiB; 0 on macOS) | cli_inner_pretty.js:540455 | function |
| `jwz` | `daemonLabelForArgs` ("claude agents" / "claude --bg" / "claude" `--spawned-by` label) | cli_inner_pretty.js:540332 | function |
| `Le4` | `realpathMtimeMs` (resolve realpath then mtimeMs; null on ENOENT) | cli_inner_pretty.js:540209 | function |
| `LL5` | `rebuildPinnedFromMarkers` (fallback: scan per-dir `pinned` marker files, persist `pins.json`) | cli_inner_pretty.js:184023 | function |
| `mpz` | `NORMAL_RETIRE_GRACE_MS` (3600000) | cli_inner_pretty.js:648199 | constant |
| `Mwz` | `takeoverStaleDaemon` (gated SIGKILL of a stale transient daemon; emits `tengu_bg_daemon_binary_takeover`) | cli_inner_pretty.js:540233 | function |
| `OPz` | `ensureAppBundleExec` (materialize `ClaudeCode.app` exec + Info.plist for stable macOS TCC identity) | cli_inner_pretty.js:558989 | function |
| `Owz` | `isDaemonStaleVsClient` (transient-origin + (version-gt OR mtime-newer) staleness comparator) | cli_inner_pretty.js:540220 | function |
| `Qw$` | `loadPinnedSet` (read `pins.json` into a Set each tick; ENOENT → `rebuildPinnedFromMarkers`) | cli_inner_pretty.js:184012 | function |
| `TPz` | `EMPTY_IDLE_GRACE_MS` (300000) | cli_inner_pretty.js:560837 | constant |
| `Ve4` | `bridgedRetireGraceMs` (`tengu_bg_retire_grace_bridged_min` ×60000; default 480 min) | cli_inner_pretty.js:540463 | function |
| `vzq` | `TICK_INTERVAL_MS` (60000 — supervisor tick cadence) | cli_inner_pretty.js:648201 | constant |
| `Vzq` | `LOW_MEM_GRACE_MS` (60000) | cli_inner_pretty.js:648200 | constant |
| `We4` | `isServiceDaemonInstalled` (true if a service unit is registered, not transient) | cli_inner_pretty.js:540328 | function |
| `Ywz` | `nudgeDaemonUntilConverged` (`nudge`-loop; invokes binary-takeover before declaring "up") | cli_inner_pretty.js:540086 | function |

### `/goal` Stop-Hook (background-adjacent)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `j$$` | `addGoalStopHook` (`/goal`: register session Stop hook + stamp `activeGoal`) | cli_inner_pretty.js:447943 | function |
| `L04` | `goalSentinelMessage` (emit a `goal_status` sentinel attachment) | cli_inner_pretty.js:447971 | function |
| `nS$` | `SessionStateTracker` (session state + goal snapshot class; `hasTerminalGoalSnapshot`, goal-clear-on-running) | cli_inner_pretty.js:623957 | class |
| `Rf9` | `findGoalToRestore` (walk transcript for last non-sentinel `goal_status` to restore on resume) | cli_inner_pretty.js:598861 | function |
| `w$$` | `clearGoalStopHook` (`/goal clear`: remove Stop hook + clear `activeGoal`) | cli_inner_pretty.js:447958 | function |
| `Zyz` | `restoreGoalFromTranscript` (resume-time goal recovery; re-stamp `activeGoal` if not met/failed) | cli_inner_pretty.js:598870 | function |

### Feature-Telemetry Emit Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bn8` | `emitFeatureBadAsync` (awaited `tengu_feature_bad` flush — one-shot CLI exec path) | cli_inner_pretty.js:41599 | function |
| `mn8` | `emitFeatureOkAsync` (awaited `tengu_feature_ok` flush — CLI exec path) | cli_inner_pretty.js:41599 | function |
| `pn8` | `emitFeatureSadAsync` (awaited `tengu_feature_sad` flush) | cli_inner_pretty.js:41605 | function |
| `SH` | `emitFeatureOk` (sync fire-and-forget `tengu_feature_ok` — agents-view path) | cli_inner_pretty.js:41590 | function |
| `t$` | `emitFeatureSad` (sync `tengu_feature_sad` — agents-view path; benign races) | cli_inner_pretty.js:41596 | function |
| `uH` | `emitFeatureBad` (sync `tengu_feature_bad` — agents-view path) | cli_inner_pretty.js:41593 | function |

Known new themes:

- v2.1.153/154: `! command` shell-exec sessions; `/logout` signs out instead of backgrounding; `←←` agents view on Bedrock/Vertex/Foundry
- v2.1.156 fixes: premature "out of context" on 1M models from bg completion; bg classifier losing goal on scheduled `/command`; pinned bg sessions respawning every minute after update; idle bg sessions not retiring; subagents in bg bypassing worktree isolation; orphaned `--bg-pty-host` at 100% CPU after daemon exit (macOS)
- `f6` (`getOriginalCwd`) is a shared launch-cwd util cited here but belongs to State (`symbol_index_core_execution.md`)

---

## Module: Agent Team

The **agent-team (internally "swarm")** subsystem: one running `claude` REPL (the team lead) spawning and
coordinating leader-owned *teammates* that run in **exactly one of two execution modes** — **in-process** (an
async task in the leader's own Node process, isolated by nested `AsyncLocalStorage`) or **cross-process panes**
(a separate `claude` OS process in a tmux pane / iTerm2 split). The whole subsystem is gated by
`isAgentTeamsEnabled` (`R7`); the **BackendRegistry** (`R94`) owns the in-process-vs-pane decision
(`isInProcessEnabled`, `ma`) and hands callers a uniform `TeammateExecutor`; both modes share one **file
mailbox** IPC (`writeToMailbox`, `aA`) and one `TeamCreate`/`TeamDelete`/`SendMessage` tool set.

See `30_agent_team/{execution_modes_and_backend_registry,in_process_mode,cross_process_mode,mailbox_and_lifecycle_tools,cross_validation}.md`
for narrative analysis, and `symbol_additions_v2_1_156_agent_team.md` for the full flat manifest (ALS identity
helpers, message builders/parsers, the permission-bridge internals, env-detection probes, and cross-module
shared helpers are catalogued there). The `SendMessage` tool-name constant `cf` (`"SendMessage"` @216283) is
the coordinator/worker shared name constant and lives in `symbol_index_core_execution.md`; it is not duplicated
here. This table carries the highest-value structural symbols only.

### Gate, Teammate Mode & Snapshot

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `R7` | `isAgentTeamsEnabled` (**master gate**: env/flag AND GrowthBook `tengu_amber_flint`) | cli_inner_pretty.js:240766 | function |
| `PEq` | `teammateModeEnum` (`["auto","tmux","in-process"]`) | cli_inner_pretty.js:49109 | constant |
| `D94` | `captureTeammateModeSnapshot` (CLI override > config > "auto") | cli_inner_pretty.js:380289 | function |
| `JSH` | `getTeammateModeFromSnapshot` (default "auto"; lazy-capture safety net) | cli_inner_pretty.js:380293 | function |
| `LT_` | `setCliTeammateModeOverride` (`--teammate-mode` override) | cli_inner_pretty.js:380280 | function |

### Backend Registry (Detection & Dispatch)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `R94` | `BackendRegistry` (module export map) | cli_inner_pretty.js:380912 | object |
| `y94` | `createBackendRegistry` (mutable-state factory; the v2.1.156 state-holding form) | cli_inner_pretty.js:380930 | function |
| `NS` | `globalBackendRegistry` (process singleton; `NS = y94()` @381129) | cli_inner_pretty.js:381118 | variable |
| `ma` | `isInProcessEnabled` (**the in-process-vs-pane switch**) | cli_inner_pretty.js:381076 | function |
| `NT_` | `getTeammateExecutor` (**dispatch entry point**) | cli_inner_pretty.js:381098 | function |
| `jLH` | `detectAndGetBackend` (tmux/iTerm2/it2/fallback detection tree) | cli_inner_pretty.js:380965 | function |
| `S94` | `getInProcessBackend` (memoized `InProcessBackend`) | cli_inner_pretty.js:381094 | function |
| `ET_` | `getPaneBackendExecutor` (memoized `PaneBackendExecutor`) | cli_inner_pretty.js:381102 | function |
| `NU6` | `getResolvedTeammateMode` (`"in-process"` \| `"tmux"`) | cli_inner_pretty.js:381091 | function |
| `kU6` | `markInProcessFallback` (sticky bit: pane failed → in-process, auto mode) | cli_inner_pretty.js:381070 | function |

### In-Process Backend & Runner

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `K94` | `InProcessBackend` (in-process `TeammateExecutor`) | cli_inner_pretty.js:380062 | class |
| `JT_` | `runInProcessTeammate` (the persistent agent loop) | cli_inner_pretty.js:379714 | function |
| `DT_` | `waitForNextPromptOrShutdown` (6-priority poll loop) | cli_inner_pretty.js:379637 | function |
| `CW8` | `spawnInProcessTeammate` (alloc identity/taskId/teammate-ctx, register task) | cli_inner_pretty.js:381458 | function |
| `bW8` | `killInProcessTeammate` (force-kill via AbortController + team cleanup) | cli_inner_pretty.js:381513 | function |
| `fT_` | `POLL_INTERVAL_MS` / `PERMISSION_POLL_INTERVAL_MS` (`500`) | cli_inner_pretty.js:380022 | constant |
| `LJ` | `isInProcessTeammateTask` (task-type guard: `type==="in_process_teammate"`) | cli_inner_pretty.js:238588 | function |

### Pane Backends (tmux / iTerm2)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L94` | `PaneBackendExecutor` (pane `TeammateExecutor`; owns `spawnedTeammates` map + cleanup) | cli_inner_pretty.js:380388 | class |
| `ZU6` | `TmuxBackend` (tmux `PaneBackend`; `type="tmux"`, `supportsHideShow=true`) | cli_inner_pretty.js:380545 | class |
| `TU6` | `ITermBackend` (iTerm2 `PaneBackend` via `it2` CLI; `supportsHideShow=false`) | cli_inner_pretty.js:380820 | class |
| `J94` | `resolveTeammateExecPath` (which `claude` binary to relaunch in the pane) | cli_inner_pretty.js:380305 | function |
| `X94` | `buildTeammateCliFlags` (permission/model/settings/plugins/mode/chrome — **evolved**) | cli_inner_pretty.js:380309 | function |
| `WT$` | `buildTeammateEnvString` (`env KEY=VALUE …` prefix) | cli_inner_pretty.js:380336 | function |
| `PT_` | `TEAMMATE_ENV_PASSTHROUGH` (env forward list — **grew ~17→~35 vs v2.1.88**) | cli_inner_pretty.js:380350 | constant |

### Mailbox & Lifecycle Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aA` | `writeToMailbox` (lock → re-read → push → atomic write; **the universal send**) | cli_inner_pretty.js:338306 | function |
| `h_H` | `readMailbox` (parse array; tolerate ENOENT/SyntaxError; back-fill `type`) | cli_inner_pretty.js:338286 | function |
| `JG$` | `markMessageAsReadByIndex` (flip `read` in place; idempotent "consume") | cli_inner_pretty.js:338333 | function |
| `jhH` | `getInboxPath` (`<teamsDir>/<team>/inboxes/<agent>.json`) | cli_inner_pretty.js:338272 | function |
| `tY` | `TEAM_LEAD_NAME` (`"team-lead"`) | cli_inner_pretty.js:336140 | constant |
| `jU6` | `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (forces `SendMessage`; **evolved: dropped broadcast**) | cli_inner_pretty.js:379421 | constant |
| `OT_` | `createTeammateCanUseTool` (**leader↔teammate permission bridge**; **evolved**) | cli_inner_pretty.js:379430 | function |
| `U57` | `SWARM_TOOL_SET` (`{TaskCreate,TaskGet,TaskList,TaskUpdate,SendMessage,Cron…}`) | cli_inner_pretty.js:216435 | constant |
| `rd` | `TeamCreate` (tool name constant) | cli_inner_pretty.js:216438 | constant |
| `Oo` | `TeamDelete` (tool name constant) | cli_inner_pretty.js:216439 | constant |
| `Th_` | `TeamCreateTool` (tool def) | cli_inner_pretty.js:406631 | object |
| `vh_` | `TeamDeleteTool` (tool def; `{success:false}` if members active) | cli_inner_pretty.js:406775 | object |
| `Bh_` | `SendMessageTool` (tool def; rejects `to:"*"` broadcast — **evolved**) | cli_inner_pretty.js:407447 | object |

---

## Module: Hooks (2.1.143–156 delta)

The NEW **MessageDisplay** display-only hook event (transform/hide streaming assistant text without touching transcript or model-visible context): its parallel event-name arrays, lazy Zod input/output schemas, the `forceSyncExecution` executor, the per-message streaming engine (`OW9`) and constants, the completed-message rewrite path (`MW9`), and the state-prune helper. Plus the Stop/SubagentStop `background_tasks` + `session_crons` inputs (2.1.145) and the stop-hook block cap (2.1.143).

See `11_hooks/{message_display_event,message_display_streaming_engine,session_start_title_and_reload_skills,stop_hook_background_tasks_and_block_cap}.md`. (The renderer-side UI identifiers `Vd4`/`ky`/`Ln`/`displayedMessageContent` route to `symbol_index_infra_integration.md`.)

### MessageDisplay Event — Schemas & Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AW9` | `MESSAGE_DISPLAY_DEBOUNCE_MS` (`1000 / Xxz` = 100ms flush debounce; declared 627130, assigned 627139) | cli_inner_pretty.js:627130 | constant |
| `cM` | `baseHookInput` (lazy Zod base envelope: `session_id`/`transcript_path`/`cwd`/`permission_mode`/`agent_id`/`agent_type`/`effort`) | cli_inner_pretty.js:336641 | object |
| `c6$` | `hookJSONOutputSchema` (unified `HookJSONOutput` discriminated union; includes the `MessageDisplay`/`displayContent` variant) | cli_inner_pretty.js:550780 | object |
| `do7` | `hookInputUnion` (the giant per-event hook-input discriminated union; `lj_`/MessageDisplay is a member) | cli_inner_pretty.js:337054 | object |
| `Fo7` | `hookEventNameEnum` (`y.enum(wj_)` — Zod enum built from the source event-name array) | cli_inner_pretty.js:336640 | object |
| `fW9` | `MESSAGE_DISPLAY_TIMEOUT_MS` (`1e4` = 10s per-flush hook budget) | cli_inner_pretty.js:627132 | constant |
| `HR$` | `cryptoModule` (lazily-required `crypto` for the engine's local `messageId`/`turnId`; declared 627128, assigned 627139) | cli_inner_pretty.js:627128 | variable |
| `jN` | `HOOK_EVENT_NAMES` (canonical runtime event-name array; `"MessageDisplay"` last entry at 49289) | cli_inner_pretty.js:49259 | constant |
| `lj_` | `messageDisplayInputSchema` (MessageDisplay input: `turn_id`/`message_id`/`index`/`final`/`delta` intersected onto `cM`) | cli_inner_pretty.js:337023 | object |
| `Mw_` | `messageDisplayOutputSchema` (the `hookSpecificOutput` schema carrying the single optional `displayContent`) | cli_inner_pretty.js:337161 | object |
| `wj_` | `hookEventNameEnumSource` (parallel event-name source array fed into `Fo7`; `"MessageDisplay"` member at 336638) | cli_inner_pretty.js:336608 | constant |
| `Xxz` | `MESSAGE_DISPLAY_FLUSH_FPS` (`10` — flush-rate divisor; `AW9 = 1000/Xxz` → 100ms) | cli_inner_pretty.js:627129 | constant |
| `YW9` | `MESSAGE_DISPLAY_INFLIGHT_CAP` (`3` — max concurrent in-flight flush hook passes; back-pressure) | cli_inner_pretty.js:627131 | constant |

### MessageDisplay Engine & Executor

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `l6$` | `executeMessageDisplayHooks` (typed executor for one MessageDisplay flush; delegates to `QL` with `forceSyncExecution`, 10s timeout) | cli_inner_pretty.js:551726 | function |
| `MW9` | `applyMessageDisplayToCompletedMessage` / `rewriteCompletedMessage` (one-shot transform for non-streamed/replayed messages, fail-open) | cli_inner_pretty.js:627097 | function |
| `OW9` | `createMessageDisplayEngine` / `messageDisplayStreamEngine` (factory returning the per-message streaming flush/debounce/in-flight-cap state machine) | cli_inner_pretty.js:626930 | function |
| `t5q` | `pruneDisplayedMessageContent` (GC of `displayedMessageContent`: drop overrides whose assistant `message.id` left the live list) | cli_inner_pretty.js:627085 | function |

### Stop / SubagentStop Inputs & Block Cap (2.1.145 / 2.1.143)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `er6` | `TASK_TYPE_LABELS` (registry discriminant → hook-facing label: `local_bash→shell`, `local_agent→subagent`, `local_workflow→workflow`, …) | cli_inner_pretty.js:457418 | object |
| `fzH` | `executeStopHooks` (Stop/SubagentStop dispatcher; builds `background_tasks`/`session_crons` payload when a `toolUseContext` is present) | cli_inner_pretty.js:551871 | function |
| `go7` | `sessionCronElementSchema` (per-element Zod schema for a scheduled wakeup: `id`/`schedule`/`recurring`/`prompt`) | cli_inner_pretty.js:336823 | object |
| `hj_` | `subagentStopHookInputSchema` (SubagentStop input; same two arrays as Stop, plus `agent_id`/`agent_transcript_path`/`agent_type`) | cli_inner_pretty.js:336879 | object |
| `hKq` | `HOOK_FIELD_CHAR_CAP` (`1000` — char cap for a Stop-hook task `description`/`command` and cron `prompt`) | cli_inner_pretty.js:551845 | constant |
| `k89` | `mapSessionCronsForHook` (map session cron list → hook cron elements; `cron→schedule`, default `recurring→false`, truncate `prompt`) | cli_inner_pretty.js:551842 | function |
| `kT4` | `dispatchStopHookErrors` (inner Stop-hook executor returning `{blockingErrors, preventContinuation}`; the block-cap branch inspects it) | cli_inner_pretty.js:450658 | function |
| `Nj_` | `stopHookInputSchema` (Stop input; gains `background_tasks` + `session_crons` in 2.1.145) | cli_inner_pretty.js:336840 | object |
| `Qo7` | `backgroundTaskElementSchema` (per-element Zod schema for one in-flight task: `id`/`type`/`status`/`description` + type-conditional fields) | cli_inner_pretty.js:336795 | object |
| `ub$` | `truncateWithMarker` (truncate-to-budget then append `… [+N chars]`; used on Stop-hook `description`/`command`/`prompt`) | cli_inner_pretty.js:9798 | function |
| `uL` | `isInFlightTask` (Stop-hook task filter: keep only `running`/`pending` tasks not explicitly `isBackgrounded:false`) | cli_inner_pretty.js:336125 | function |
| `v89` | `mapBackgroundTasksForHook` (map the live task registry → hook task elements; filter in-flight, label type, truncate) | cli_inner_pretty.js:551812 | function |
| `WG` | `getSessionCronTasks` (session cron-task list accessor; `mapSessionCronsForHook`'s default argument) | cli_inner_pretty.js:2994 | function |

### Shared Platform Touch Points (pre-2.1.88, plumbed by this delta)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ah8` | `applyHookJSONOutput` (folds each event's `hookSpecificOutput`; `MessageDisplay`/`SessionStart`/`UserPromptSubmit` cases copy `displayContent`/`sessionTitle`/`reloadSkills`) | cli_inner_pretty.js:552419 | function |
| `p89` | `parseHookJSONOutput` (`c6$().safeParse(...)` of a hook's stdout JSON) | cli_inner_pretty.js:552329 | function |
| `q_` | `DEFAULT_HOOK_TIMEOUT_MS` (`600000` = 10min default; overridden by `fW9` for MessageDisplay) | cli_inner_pretty.js:395687 | constant |
| `QL` | `executeHooks` (generic hook-execution generator every typed executor delegates to) | cli_inner_pretty.js:553174 | function |
| `th8` | `runShellHook` (shell-hook subprocess runner; honors `forceSyncExecution` by blocking on an "async" response) | cli_inner_pretty.js:553613 | function |
| `w5` | `buildBaseHookInput` (runtime builder of the common `session_id`/`transcript_path`/`cwd`/`agent_*`/`effort` envelope) | cli_inner_pretty.js:552312 | function |
| `wk` | `hasHookForEvent` / `hasHooksForEvent` (cheap gate; true iff any policy/user/plugin/session hook configured for an event; guards the MessageDisplay pipeline) | cli_inner_pretty.js:552979 | function |

Known new themes:

- `MessageDisplay` display-only hook event (2.1.143+) — transform/hide assistant text without touching the transcript or model context
- Stop/SubagentStop input gains `background_tasks` + `session_crons` arrays (2.1.145)
- `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` env (default 8, `0` disables) caps consecutive Stop-hook blocks (2.1.143)
- Telemetry: `tengu_message_display_hooks`, `tengu_stop_hook_block_count`, `hook_session_start_reload_skills`

---

## Module: Skills (2.1.143–156 delta)

The two mid-session skill-reload entrypoints (`/reload-skills` command + SessionStart `reloadSkills` hook field) and the shared cache-invalidation chain; the `disallowed-tools` skill/slash-command frontmatter field; the `context: fork` self-reinvoke recursion guard; the `effort:` frontmatter delta (`xhigh` level, status-bar fix); and the three bundled skill bodies (`/simplify`, `/code-review`, `/claude-api`) plus the bundled-skill registrar.

See `10_skill_system/{skill_reload_midsession,skill_disallowed_tools,skill_fork_recursion_guard,skill_effort_frontmatter,bundled_skill_bodies}.md`. (Tool/memoize/subagent helpers `ZX`/`sq`/`TL5`/`X$`/`v8`/`cx8`/`C$`/`N8`/`y7` route to `symbol_index_core_execution.md`; permission/telemetry helpers `fc`/`tZ4`/`IS`/`c28`/`fI8`/`fV8`/`YV8`/`tT4`/`D0$`/`T6`/`k3`/`dN`/`vx`/`KkH`/`or`/`Ev`/`q48`/`ycH` cross-reference the Effort section below and `symbol_index_infra_platform.md`; the plugin-command parser `cV$` routes to `symbol_index_infra_integration.md`.)

### Reload Command + Cache Invalidation Chain

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$U` | `runSessionStartHooks` (collect hook deltas; on any `reloadSkills` fires `_C()`+`Bo()`+`Xc.emit()`+telemetry) | cli_inner_pretty.js:270637 | function |
| `_C` | `clearSkillListingCaches` (reload primitive's outer clear: `wu()`, `vG8()`, `Cw4()`, `DRH()`) | cli_inner_pretty.js:545345 | function |
| `_RH` | `cachedAnnouncedSkillSet` (lazily-built announce/dedup Set; nulled by `Bo`, rebuilt in `Tp6`) | cli_inner_pretty.js:413923 | variable |
| `Bo` | `resetConditionalSkillState` (reload primitive's state reset: `LG8.clear()`, `PG8=false`, `_RH=null`) | cli_inner_pretty.js:413487 | function |
| `Cw4` | `clearBundledSkillCache` (`Kd6.cache?.clear?.()`) | cli_inner_pretty.js:414290 | function |
| `dDz` | `invalidateWorkflowCache` (workflow-command cache buster; bound from the workflow module) | cli_inner_pretty.js:545804 | function |
| `DRH` | `clearDynamicSkillCachesAndState` (`nd6`/`tx` cache clear + conditional-skill state clear) | cli_inner_pretty.js:421850 | function |
| `Gp6` | `markSkillDirsScanned` (sets `PG8 = true`) | cli_inner_pretty.js:413493 | function |
| `Gzz` | `RELOAD_SKILLS_COMMAND` (`/reload-skills` descriptor: `type:"local"`, `supportsNonInteractive:true`, `thinClientDispatch:"post-text"`) | cli_inner_pretty.js:521262 | object |
| `LG8` | `dynamicSkillCommandMap` (Map of discovered dynamic/conditional skills + commands; cleared by `Bo`) | cli_inner_pretty.js:414021 | variable |
| `OP$` | `sessionStartHookGenerator` (the `async function*` streaming SessionStart hook output; yields `reloadSkills`/`sessionTitle`/`watchPaths`/…) | cli_inner_pretty.js:551757 | function |
| `PG8` | `hasScannedSkillDirsFlag` ("dynamic skill dirs already scanned this pass" guard; reset by `Bo`, set by `Gp6`) | cli_inner_pretty.js:413922 | variable |
| `wu` | `clearMemoizedSkillCommandCaches` (clears `sH9`/`L2`/`RDH`, calls `dDz`, async-clears the skill-index module) | cli_inner_pretty.js:545333 | function |
| `Xc` | `skillReloadEmitter` (signal re-announcing skill changes to UI subscribers; `Xc = y7()`) | cli_inner_pretty.js:270624 | variable |
| `Zzz` | `reloadSkillsCommandHandler` (`/reload-skills` `call()`: snapshot names before/after, run cache-clear chain, return `N added, M removed`) | cli_inner_pretty.js:521237 | function |

### Skill Loaders & Conditional State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BL` | `aggregateAllSkillCommands` (async disk-walk aggregator delegating to `sH9`; skill-dir + plugin + bundled + builtin-plugin) | cli_inner_pretty.js:545320 | function |
| `gDz` | `loadSkillDirCommands` (loads skill-dir + plugin + bundled + builtin-plugin skills; calls disk-reading `nd6`) | cli_inner_pretty.js:545264 | function |
| `Kd6` | `bundledSkillsLoaderMemo` (memoized bundled-skill loader; cleared by `Cw4`) | cli_inner_pretty.js:414435 | function |
| `L2` | `loadSkillsForList` (memoized user-facing skill list; cache-miss re-reads disk via `BL`→`sH9`→`gDz`→`nd6`) | cli_inner_pretty.js:545823 | function |
| `nd6` | `skillDirLoaderMemo` (memoized skill-dir loader; reads `<dir>/<name>/SKILL.md`; cleared by `DRH`) | cli_inner_pretty.js:421999 | function |
| `RDH` | `bundledSkillsAsyncLoader` (memoized async loader for model-invocable bundled/plugin skills; cleared by `wu`) | cli_inner_pretty.js:545827 | function |
| `sH9` | `skillCommandAggregatorMemo` (memoized master aggregator `BL` delegates to; cleared by `wu`) | cli_inner_pretty.js:545805 | function |
| `tx` | `pairedSkillLoaderMemo` (memoized paired skill loader; cleared by `DRH`) | cli_inner_pretty.js:443338 | function |
| `vG8` | `clearPluginSkillCache` (`zRH.cache?.clear?.()`) | cli_inner_pretty.js:414228 | function |
| `zRH` | `pluginSkillsLoaderMemo` (memoized plugin-skills loader; cleared by `vG8`) | cli_inner_pretty.js:414317 | function |

### Frontmatter Schemas & Parsers (disallowed-tools / effort)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aL6` | `SKILL_FRONTMATTER_SCHEMA` (zod skill schema; `GL5().extend({...})`) | cli_inner_pretty.js:184517 | variable |
| `cd6` | `parseSkillFrontmatter` (`.claude` SKILL.md frontmatter → record; normalizes `disallowed-tools`/`effort` via `fc`/`vx`) | cli_inner_pretty.js:421555 | function |
| `GL5` | `COMMON_FRONTMATTER_SCHEMA` (shared skill/slash-command zod schema; holds `disallowed-tools` + canonical `disallowedTools` alias) | cli_inner_pretty.js:184480 | variable |
| `Ov$` | `buildSkillCommandObject` (skill record → command object; carries `disallowedTools`/`effort` through) | cli_inner_pretty.js:421592 | function |

### Bundled Skill Bodies & Registrars (/simplify, /code-review, /claude-api)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aSz` | `CLAUDE_API_SKILL_DESCRIPTION_BASE` (base `/claude-api` description; mentions migrating between model versions) | cli_inner_pretty.js:612051 | variable |
| `bA` | `registerBundledPromptCommand` (generic bundled prompt-command registrar: definition → `type:"prompt"`, `source/loadedFrom:"bundled"` record; wraps `getPromptForCommand` to merge extracted `files`, installs lazy `description`/`argumentHint`/`whenToUse` getters, pushes onto `Ji4`; passes through `disallowedTools`/`getEffort`) | cli_inner_pretty.js:524187 | function |
| `c1q` | `SKILL_FILES` (map of relative path → bundled markdown string; includes `shared/model-migration.md`) | cli_inner_pretty.js:611884 | variable |
| `cSz` | `buildClaudeApiFiles` (materialize `SKILL_FILES` with `{{OPUS_ID}}`/`{{OPUS_NAME}}` substituted) | cli_inner_pretty.js:611935 | function |
| `d1q` | `SKILL_MODEL_VARS` (`{{OPUS_ID}}=claude-opus-4-8`, `{{OPUS_NAME}}=Claude Opus 4.8`, … substituted into bundled docs) | cli_inner_pretty.js:611874 | variable |
| `Ehz` | `SIMPLIFY_PROMPT` (the `/simplify` body: cleanup-only, 4 parallel cleanup agents via the Agent tool, then apply) | cli_inner_pretty.js:601378 | variable |
| `eyz` | `getCodeReviewDescription` (function-typed dynamic description; appends the `ultra: cloud` clause only when cloud review `WF()` is enabled) | cli_inner_pretty.js:600558 | function |
| `mAz` | `prependBaseDir` (prefix prompt blocks with `Base directory for this skill: <dir>` so the model can Read/Grep extracted refs) | cli_inner_pretty.js:524283 | function |
| `nSz` | `detectProjectLanguage` (scan cwd for `.py`/`package.json`/… markers and return the detected language) | cli_inner_pretty.js:611940 | function |
| `nwH` | `installLazyStringGetter` (install an enumerable getter only for function-typed `description`/`argumentHint`/`whenToUse`) | cli_inner_pretty.js:222231 | function |
| `oSz` | `buildClaudeApiPrompt` (assemble base prompt + Quick Task Reference + inlined `<doc>` blocks) | cli_inner_pretty.js:611986 | function |
| `Qyz` | `skillToolCodeReviewGuidance` (coordinator post-implementation prompt instructing the worker to invoke `skill:"code-review"`) | cli_inner_pretty.js:600237 | variable |
| `RAz` | `extractAndGetSkillRoot` (extract a bundled skill's `files` map to a per-skill dir; returns the dir or null) | cli_inner_pretty.js:524241 | function |
| `rSz` | `CLAUDE_API_QUICK_TASK_REFERENCE` (Quick Task Reference block; routes "Migrating to a newer model…" to `shared/model-migration.md`) | cli_inner_pretty.js:612049 | variable |
| `tSz` | `registerClaudeApiSkill` (registers `/claude-api`: `allowedTools` Read/Grep/Glob/WebFetch, `files: cSz()`, emits `tengu_claude_api_skill_loaded`) | cli_inner_pretty.js:612027 | function |
| `uj9` | `claudeApiSkillDescription` (full `/claude-api` description = `aSz` + TRIGGER/SKIP clauses) | cli_inner_pretty.js:612071 | variable |
| `vO9` | `registerSimplify` (registers the cleanup-only `/simplify` via `bA`) | cli_inner_pretty.js:601350 | function |
| `wj9` | `MODEL_MIGRATION_DOC` (bundled `shared/model-migration.md` body; the "Migrating to Opus 4.8" prose) | cli_inner_pretty.js:608931 | variable |
| `zO9` | `registerCodeReview` (registers `/code-review` via `bA`; `subcommands:{ultra:"ultrareview"}` + `getEffort`) | cli_inner_pretty.js:600612 | function |

Known new themes:

- `/reload-skills` command + SessionStart `reloadSkills` hook field (2.1.152) for mid-session skill reload
- `disallowed-tools` skill/slash-command frontmatter field (removes tools), cleared on next user message
- `context: fork` self-reinvoke recursion guard (`spawnedBySkill` breadcrumb, errorCode 9)
- `effort:` frontmatter gains `xhigh`; status bar shows the layered effort
- `/code-review` becomes a bundled skill; `/simplify` is cleanup-only; `/claude-api` (Opus 4.8 + 4.7→4.8 migration)

---

## Module: Compact

The v2.1.156 compaction subsystem runs **multiple co-existing strategies** behind a multi-band **threshold
ladder** with **4-source context-window resolution**. The bands are computed by `classifyTokenLevel` (`fX4`)
returning `{level: ok|warn|compact|blocked}` — a v2.1.156 refactor of v2.1.88's four separate booleans. The
per-turn dispatcher `autoCompactGenerator` (`DX4`) gates on the level, protects against thrashing with **two
breakers** (circuit `_c6=3`, rapid-refill `Y08=3`), and either runs the **full/proactive** lane
(`compactConversationFull` `_eH`, whole-conversation single summary) or routes to the **reactive/partial** lane
(`runReactiveCompact` `lA8`, group-walk for 1M/PTL) when `thresholdSource!=='auto'`. A separate **micro-compact**
lane (`createContextHintController` `kLz` → `applyKeepRecentMicrocompact` `K04`) clears old tool-result content
in place (no LLM) on a server-driven `context_hint` rejection, and `/rewind` exposes a **partial** lane
(`partialCompact` `qX4`, `from`/`up_to`). A PostCompact tail re-baselines the prompt cache.

See `07_compact/{threshold_and_window_resolution,autocompact_dispatcher_and_breakers,compaction_pipeline,reactive_compaction,micro_compact,session_memory_and_partial_compact,summary_prompt_templates,postcompact_and_prompt_cache,cross_validation}.md`
for narrative analysis, and `symbol_additions_v2_1_156_compact.md` for the **full flat manifest** (202 symbols,
eight sub-area tables). Model-window helpers (`Ov`/`DZ`/`P36`/`NO$`/`E5H`) route to
`symbol_index_infra_platform.md`; the cache-break detector helpers (`wv7`/`_P$`/`HU`/`Pc5`/`Wc5`/`sk6`/`Xc5`/`GA8`)
are shared with the prompt-cache work there. This table carries the highest-value structural symbols only.

### Threshold Ladder & Window Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `fX4` | `classifyTokenLevel` (banded `{level: ok\|warn\|compact\|blocked, pctLeft}`; `warn=thr−20000`, `blocked=base−3000` — **replaces v2.1.88's 4 booleans**) | cli_inner_pretty.js:423873-423884 | function |
| `Jv$` | `getCompactThreshold` (`effectiveWindow−13000`; `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` lowers it) | cli_inner_pretty.js:423864-423868 | function |
| `YX4` | `getPrecomputeThreshold` (`min(eff−round(eff*0.2), compactThreshold)` — **NEW** proactive-work gate) | cli_inner_pretty.js:423870-423872 | function |
| `Xl` | `resolveAutoCompactWindow` (**4-source**: env > settings > experiment > default; `{window,configured,source}`) | cli_inner_pretty.js:423915-423930 | function |
| `_qH` | `getEffectiveWindow` (`window − min(maxOutput, MX4=20000)`) | cli_inner_pretty.js:423938-423943 | function |
| `ab_` | `getAutoCompactWindowSource` (the `thresholdSource` that gates reactive routing) | cli_inner_pretty.js:423935-423937 | function |
| `wX4` | `getExperimentWindowForModel` (Opus-4.8-only window via `tengu_amber_redwood2` — **NEW**) | cli_inner_pretty.js:423906-423914 | function |
| `Ac6` | `parseWindowString` (`'auto'`/`Nm`/`Nk`/`N`; clamp `[zc6 .. jX4]`) | cli_inner_pretty.js:423889 | function |
| `zX4` | `AUTOCOMPACT_BUFFER_TOKENS` (`13000`) | cli_inner_pretty.js:423885 | constant |
| `AX4` | `MANUAL_COMPACT_BUFFER_TOKENS` (`3000` — blocking-limit buffer) | cli_inner_pretty.js:423886 | constant |
| `qc6` | `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` (`0.2`; `tengu_amber_rokovoko` override — **NEW**) | cli_inner_pretty.js:423887 | constant |
| `MX4` | `MAX_OUTPUT_TOKENS_FOR_SUMMARY` (`20000` summary reserve) | cli_inner_pretty.js:424124 | constant |
| `zc6` / `jX4` | `WINDOW_MIN` (`1e5`) / `WINDOW_MAX` (`1e6`) clamps | cli_inner_pretty.js:424125-424126 | constant |
| `gE4` | `PERCENT_USED_UI_GATE` (`80` — autocompact-disabled nudge shows 50–80%) | cli_inner_pretty.js:467444 | constant |

### Dispatcher & The Two Breakers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DX4` | `autoCompactGenerator` (per-turn dispatcher; circuit + rapid-refill breakers; reactive-routing fork) | cli_inner_pretty.js:424002-424093 | function |
| `eb_` | `shouldAutoCompact` (pre-flight predicate; true when level `compact`/`blocked`) | cli_inner_pretty.js:423991-424001 | function |
| `J0` | `isAutoCompactEnabled` (`DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT` + `autoCompactEnabled`) | cli_inner_pretty.js:423983-423987 | function |
| `fc6` | `computeRapidRefillStreak` (`+1` if prev compacted & `turnCounter<3` — **NEW**) | cli_inner_pretty.js:423948-423950 | function |
| `Mc6` | `isColdCompact` (`CLAUDE_CODE_COLD_COMPACT` — **NEW**) | cli_inner_pretty.js:423951-423953 | function |
| `Xv$` | `pumpCompactEvents` (generator adapter forwarding `onCompactEvent` as yielded events) | cli_inner_pretty.js:424103-424123 | function |
| `_c6` | `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`3` — circuit breaker) | cli_inner_pretty.js:424128 | constant |
| `Yc6` | `RAPID_REFILL_TURN_WINDOW` (`3` — **NEW**) | cli_inner_pretty.js:424129 | constant |
| `Y08` | `MAX_CONSECUTIVE_RAPID_REFILLS` (`3` — thrash breaker — **NEW**) | cli_inner_pretty.js:424130 | constant |

### Full Pipeline, Reactive Lane & PTL

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_eH` | `compactConversationFull` (whole-conversation summary, `messagesToKeep:[]`, front-drop PTL retry) | cli_inner_pretty.js:423130+ | function |
| `_X4` | `runCompactionSummarization` (forked cache-sharing summarize call; denies all tools) | cli_inner_pretty.js:423539 | function |
| `$X4` | `sliceForPromptTooLong` (group-drop PTL recovery, shared by full + partial) | cli_inner_pretty.js:423077-423092 | function |
| `qX4` | `partialCompact` (`/rewind` `from`/`up_to`; v2.1.142 `_H4`) | cli_inner_pretty.js:423340-423509 | function |
| `lA8` | `runReactiveCompact` (reactive-lane orchestrator; reactive compaction was `feature(REACTIVE_COMPACT)`-gated/ant-only in v2.1.88 — the **routing fork** `thresholdSource!=="auto"` is what's NEW) | cli_inner_pretty.js:272213-272331 | function |
| `xA8` | `iterateReactiveGroupWalk` (summarize-oldest / preserve-newest group walk) | cli_inner_pretty.js:271231-271323 | function |
| `bv7` | `seedPreservedCount` (greedy token-accumulation seed; v2.1.142 `B47`) | cli_inner_pretty.js:271220-271226 | function |
| `ucH` | `extractPTLTokenGap` (overflow size → `initialTokenGap`) | cli_inner_pretty.js:186340-186346 | function |
| `PP$` | `createCompactBoundaryMessage` (`system/compact_boundary` marker; v2.1.142 `jM$`) | cli_inner_pretty.js:445985-445997 | function |
| `PzH` | `PreCompactBlockedError` (thrown when a PreCompact hook blocks — **NEW**) | cli_inner_pretty.js:423862 | class |
| `HX4` | `MAX_PTL_RETRIES` (`3`) | cli_inner_pretty.js:423806 | constant |
| `Rd` | `PROMPT_TOO_LONG_PREFIX` (`'Prompt is too long'` sentinel) | cli_inner_pretty.js:186902 | constant |

### Micro-Compact (`context_hint`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kLz` | `createContextHintController` (stateful per-request reactive micro-compact driver — **NEW**) | cli_inner_pretty.js:556535-556577 | function |
| `K04` | `applyKeepRecentMicrocompact` (gate `Ti6`, persist, apply `Zk$`, emit telemetry) | cli_inner_pretty.js:447282-447307 | function |
| `Vi6` | `computeKeepClearSets` (partition keep-last-N / clear-rest; tokensSaved) | cli_inner_pretty.js:447253-447267 | function |
| `Zk$` | `applyClearingToMessages` (in-place tool_result content substitution) | cli_inner_pretty.js:447268-447281 | function |
| `X69` | `isContextHintEnabled` (`tengu_hazel_osprey` master switch) | cli_inner_pretty.js:556448-556450 | function |
| `k76` | `CONTEXT_HINT_BETA` (`context-hint-2026-04-09` — **NEW**) | cli_inner_pretty.js:98137 | constant |
| `Ti6` | `MIN_TOKENS_SAVED_TO_FIRE` (`20000` floor — **NEW**) | cli_inner_pretty.js:447310 | constant |
| `Gi6` | `CLEARED_PLACEHOLDER` (`'[Old tool result content cleared]'`) | cli_inner_pretty.js:447308 | constant |
| `k69` | `KEEP_RECENT` (`5`; matches v2.1.88 `keepRecent`) | cli_inner_pretty.js:556578 | constant |

### Summary Prompts, Partial UI & PostCompact

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bA8` | `buildFullCompactPrompt` (9-section TEXT-ONLY summary prompt) | cli_inner_pretty.js:270917-270930 | function |
| `Cv7` | `buildPartialCompactPrompt` (direction dispatcher `from`/`up_to`) | cli_inner_pretty.js:270824-270916 | function |
| `xc5` | `formatCompactSummary` (strip `<analysis>`, unwrap `<summary>`) | cli_inner_pretty.js:271031-271052 | function |
| `jP$` | `buildCompactSummarySeed` (`isCompactSummary` replacement user message) | cli_inner_pretty.js:271053-271073 | function |
| `jJ` | `tokenCountWithEstimation` (`preCompactTokenCount`: usage + tail estimate) | cli_inner_pretty.js:221106 | function |
| `X4q` | `isSummarizeAction` (`'summarize'`/`'summarize_up_to'`) | cli_inner_pretty.js:572787-572789 | function |
| `Wc` | `executePreCompactHooks` (PreCompact event; `{newCustomInstructions, blockedBy?}`) | cli_inner_pretty.js:551557 | function |
| `XxH` | `markPostCompaction` (one-shot arm `pendingPostCompaction=true`) | cli_inner_pretty.js:2540-2542 | function |
| `vu8` | `consumePostCompaction` (read-and-clear; consumed by `tengu_api_success`) | cli_inner_pretty.js:2543-2546 | function |
| `Uo` | `runPostCompactCleanup` (main-thread-gated cache resets + banner ack) | cli_inner_pretty.js:272181-272194 | function |
| `_P$` | `notifyCompaction` (re-baseline cache-break detector; **+disk-persist NEW**) | cli_inner_pretty.js:270034-270038 | function |
| `xP$` | `openTracingSpan` (`'claude_code.compaction'` OTEL span — **NEW**) | cli_inner_pretty.js:276662 | function |

Known new themes:

- v2.1.156: thinking-block stripping interacts with compaction on Opus 4.8 (see Thinking/Effort section: `cG4`/`dG4`/`HF6`/`pQ_`)

---

## Module: Thinking / Effort Levels

The matured effort-level system: the `xhigh` enum addition, per-model `high`/`xhigh` launch defaults, the dual launch-pin latch, the `A2`-gated effort-param injection (the fix for Opus 4.8 400 errors), the effort resolver, `ultracode` standing-orchestration, the `/effort` slider Faster/Smarter relabel + geometry + `ultracode` rail, and the v2.1.156 thinking-signature 400 hotfix.

See `43_model_opus48/{effort_levels_and_defaults,opus48_model_mapping}.md`. (Model-resolution/pricing/fast-mode/1M-context rows live in `symbol_index_infra_platform.md`; the pure slider-render UI components `kF`/`lYz`/`Ur4` live in `symbol_index_infra_integration.md`.)

### Effort Capability Gates & Enum

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_P6` | `XHIGH_CAPABILITY_TAG` (`"Opus 4.8/4.7 only"`) | cli_inner_pretty.js:184993 | constant |
| `a$7` | `MAX_EFFORT_CAPABILITY_TAG` (`"Opus 4.6+, Sonnet 4.6"`) | cli_inner_pretty.js:184994 | constant |
| `A2` | `modelSupportsEffort` (effort-param capability gate; allow 4-8/4-7/4-6/sonnet-4-6, deny others — the gate that prevents 400s) | cli_inner_pretty.js:184798 | function |
| `dN` | `EFFORT_LEVELS` / `EFFORT_LEVELS_WITH_MAX` (`["low","medium","high","xhigh","max"]` — `xhigh` added 2.1.154) | cli_inner_pretty.js:185009 | constant |
| `KkH` | `isEffortLevel` / `isResolvableEffortLevel` (`dN.includes(value)` enum membership; admits `max` at runtime) | cli_inner_pretty.js:184859 | function |
| `ow$` | `modelSupportsMaxEffort` (gate for `max`; allow 4-8/4-7/4-6/sonnet-4-6) | cli_inner_pretty.js:184816 | function |
| `s$7` | `EFFORT_ALIASES` (`{ med: "medium" }`) | cli_inner_pretty.js:185010 | variable |
| `ycH` | `modelSupportsXhighEffort` (gate for `xhigh`; allow **Opus 4.8/4.7 only** or 3P override) | cli_inner_pretty.js:184834 | function |

### Effort Resolution & Launch Latch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AkH` | `isOpusLaunchDefaultActive` (per-model launch pin still engaged? reads `unpinOpus47/48LaunchEffort`) | cli_inner_pretty.js:184896 | function |
| `E1H` | `normalizeEffortLabel` (coerce any non-`dN` string to `"high"`) | cli_inner_pretty.js:184960 | function |
| `e$7` | `effortValueFromContext` (CLI `--effort` ?? ultracode→xhigh ?? persisted level) | cli_inner_pretty.js:185012 | function |
| `Ev` | `getDisplayedEffortLevel` / `computeDisplayEffortLevel` (`normalizeEffortLabel(or(model,app) ?? "high")` — status-bar/slider source of truth) | cli_inner_pretty.js:184944 | function |
| `or` | `resolveAppliedEffort` / `resolveModelEffort` (final effort: env ?? launch-default-if-pinned ?? app-state ?? model-default; clamps max/xhigh→high) | cli_inner_pretty.js:184909 | function |
| `pjH` | `toPersistableEffort` / `coerceStringLevel` (admit only low/medium/high/xhigh — never `max`) | cli_inner_pretty.js:184880 | function |
| `q0` | `getAppliedEffortForRequest` (`A2(model) ? Ev(model,app) : undefined`) | cli_inner_pretty.js:184948 | function |
| `q48` | `getDefaultEffortForModel` (per-model launch default: Opus 4.8 → `high`, Opus 4.7 → `xhigh`, else `high`) | cli_inner_pretty.js:184987 | function |
| `RL5` | `getEffortDescription` (per-level prose; `xhigh` interpolates `_P6`) | cli_inner_pretty.js:184964 | function |
| `SI` | `unpinOpusLaunchEffortLatch` (release BOTH 4.7 and 4.8 launch pins together via locked config writer) | cli_inner_pretty.js:184902 | function |
| `vx` | `parseEffortValue` (lowercase + `med→medium` alias + level/parseInt fallback) | cli_inner_pretty.js:184870 | function |
| `YP6` | `getEffortDescriptionWithBurnHint` (append "burns fastest — medium handles most tasks" on high+Pro+`tengu_slate_finch`) | cli_inner_pretty.js:184978 | function |
| `zkH` | `readEnvEffortLevel` (`CLAUDE_CODE_EFFORT_LEVEL`; `unset`/`auto`→null tri-state) | cli_inner_pretty.js:184892 | function |

### Ultracode (Standing Orchestration)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ar` | `isUltracodeActive` / `isWorkflowKeywordOrUltracodeEffort` (`q && NZ() && resolveEffort()==="xhigh"`; slider-rail + consent short-circuit) | cli_inner_pretty.js:184856 | function |
| `Pi_` | `setUltracodeAppState` (reducer: `{...s, effortValue:"xhigh", ultracode:true}`) | cli_inner_pretty.js:461114 | function |
| `Vx` | `ultracodeAvailable` (`workflowsEnabled() && (model===undefined || modelSupportsXhighEffort(model))`) | cli_inner_pretty.js:184853 | function |
| `zP6` | `readUltracodeFlag` / `isUltracodeOn` (`i6().ultracode === true`; side-effect `SI()` releases the launch latch) | cli_inner_pretty.js:184884 | function |

### `/effort` Slider UI (Faster/Smarter relabel)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `cYz` | `DEFAULT_SLIDER_INDEX` (`3` → slider opens on `xhigh`) | cli_inner_pretty.js:527511 | constant |
| `eE8` | `getEffortHelpText` (`/effort` usage string; `ultracode` option gated on `Vx()`, capability tags inlined) | cli_inner_pretty.js:526897 | function |
| `Ir4` | `BASE_SLIDER_TRIANGLE_POSITIONS` (`[1,10,20,30,40]` caret columns) | cli_inner_pretty.js:527553 | variable |
| `mH` | `applyModelMenuEffort` (`/model` menu effort apply; ultracode → `SI()`+`Pi_`, else persist + reset ultracode) | cli_inner_pretty.js:460906 | function |
| `mr4` | `getSliderGeometry` (5-tick base ladder + optional 6th `ultracode` rail when `Vx()`) | cli_inner_pretty.js:527105 | function |
| `O6$` | `BASE_TRACK_WIDTH` (`42` — slider base track width) | cli_inner_pretty.js:527507 | constant |
| `qy$` | `RIPPLE_RAMP` (8-step violet ripple color ramp for the ultracode rail) | cli_inner_pretty.js:527565 | variable |
| `T8q` | `BASE_SLIDER_LEVELS` (the 5 base slider ticks low/medium/high/xhigh/max) | cli_inner_pretty.js:527555 | variable |
| `xYz` | `parseEffortArg` (`/effort <arg>`; `auto`/`unset`→undefined, `ultracode`→xhigh when `Vx()`, else strict parse) | cli_inner_pretty.js:526915 | function |

### Thinking-Signature 400 Hotfix (2.1.156)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B87` | `isThinkingSignatureError` (NEW 2.1.156 400-matcher for modified/invalid thinking-block signatures) | cli_inner_pretty.js:186575 | function |
| `cG4` | `stripSignedThinkingBlocks` (recovery: drop signed/redacted blocks, insert `[Thinking removed]`, identity-stable) | cli_inner_pretty.js:446238 | function |
| `dG4` | `stripCrossModelThinkingBlocks` (proactive: strip signed thinking from other-model turns at request build) | cli_inner_pretty.js:446235 | function |
| `gG4` | `isSignedThinkingBlock` (predicate: `redacted_thinking`, or `thinking` with non-empty `signature`) | cli_inner_pretty.js:446086 | function |
| `HF6` | `filterSignedThinkingBlocks` (generic predicate-driven per-message signed-block stripper, no placeholder) | cli_inner_pretty.js:446218 | function |
| `pQ_` | `filterTrailingThinkingBlocks` (drop trailing thinking from last assistant turn; emits `tengu_filtered_trailing_thinking_block`) | cli_inner_pretty.js:446091 | function |
| `wv$` | `isThinkingOrRedacted` (predicate: `thinking` OR `redacted_thinking`, signed or not) | cli_inner_pretty.js:446083 | function |

Known new themes:

- `xhigh` effort level (2.1.154), default `high` for Opus 4.8, `xhigh` launch pin for Opus 4.7
- `/effort` slider relabeled "Faster"/"Smarter" (was Speed/Intelligence) with an optional `ultracode` rail
- `A2`-gated effort injection (`NLz`, see platform index) deletes `effort` for non-capable models to prevent 400s
- v2.1.156: Opus 4.8 modified thinking-block signatures caused API 400s → strip-and-retry (`B87`/`cG4`)
- `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT`; `CLAUDE_CODE_EFFORT_LEVEL` env override

---

## Module: Model-Selection Feature (fast-label)

The user-facing fast-mode label surfaced in `/effort` and the model menu (the deeper model-resolution / pricing / fast-mode availability machinery lives in `symbol_index_infra_platform.md` Module: Model Selection).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `uB` | `getFastModeModelLabel` (`ki() ? "Opus 4.6" : "Opus 4.8"` — the fast-mode model label shown in the UI) | cli_inner_pretty.js:98243 | function |

Known new themes:

- Fast mode Opus 4.8 pricing (2x rate / 2.5x speed); `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` deprecation (06/01)

---

## Module: Plan

The `/plan` command, `EnterPlanMode`/`ExitPlanMode` tools, plan-mode permission overlay, ultraplan.
The v2.1.156 bundle is re-obfuscated relative to the 2.1.142 tree, so the obfuscated ids below are
the current-build mappings (verified against `cli_inner_pretty.js`). The permission/model-engine
symbols that plan mode *consumes* (`vl`, `xhH`, `nY`, `ChH`, `WlH`, `VT`, `st`, `ZF$`, `t1H`, …)
live in `symbol_index_infra_platform.md`; the AskUserQuestion tool symbols live in
`symbol_index_core_execution.md`.

### Plan Mode — Tools (EnterPlanMode / ExitPlanMode)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$$4` | EXIT_PLAN_MODE_V2_TOOL_PROMPT (model-facing "finished writing your plan, ready for approval" prompt) | cli_inner_pretty.js:349781 | constant |
| `aH4` | renderEnterPlanModeToolUse (EnterPlanMode `renderToolUseMessage` → `null`) | cli_inner_pretty.js:349655 | function |
| `bGf` | exitPlanModeSdkInputSchema (`M$4.extend({plan?,planFilePath?})`; runtime-injected fields) | cli_inner_pretty.js:350000 | function |
| `BM` | definePermissionDescriptor (identity registrar `BM(H){return H}` for typed permission kinds) | cli_inner_pretty.js:215037 | function |
| `CL_` | exitPlanModeOutputSchema (7-field output schema) | cli_inner_pretty.js:350006 | function |
| `dH4` | normalizeExitPlanModeToolInput (injects `plan`/`planFilePath`/`allowedPrompts`/`usage` from disk) | cli_inner_pretty.js:349140 | function |
| `ftH` | permissionExitPlanModeV2Descriptor (`permission_exit_plan_mode_v2`; payload REQUIRES `plan`) | cli_inner_pretty.js:349453 | object |
| `GL_` | getEnterPlanModeToolPromptExternal (full proactive-use EnterPlanMode prompt) | cli_inner_pretty.js:349566 | function |
| `hL8` | EnterPlanModeTool (the `buildTool` descriptor; `name:og`, zero-param, `shouldDefer`, read-only) | cli_inner_pretty.js:349703 | object |
| `IL_` | allowedPromptSchema (`{tool:enum(['Bash']),prompt:string}` prompt-based permission item) | cli_inner_pretty.js:349982 | function |
| `JC` | ExitPlanModeV2Tool (the `buildTool` descriptor; `name:wv`, disk-read plan, teammate/main fork) | cli_inner_pretty.js:350025 | object |
| `K$4` | renderExitPlanModeToolUse (ExitPlanMode `renderToolUseMessage` → `null`) | cli_inner_pretty.js:349840 | function |
| `K0$` | permissionEnterPlanModeDescriptor (`permission_enter_plan_mode`; NO `plan` in payload) | cli_inner_pretty.js:349442 | object |
| `M$4` | exitPlanModeInputSchema (`strictObject({allowedPrompts?}).passthrough()`) | cli_inner_pretty.js:349988 | function |
| `oG` | EXIT_PLAN_MODE_TOOL_NAME (legacy V1 name, same string `"ExitPlanMode"`) | cli_inner_pretty.js:143386 | constant |
| `og` | ENTER_PLAN_MODE_TOOL_NAME (the string `"EnterPlanMode"`) | cli_inner_pretty.js:143385 | constant |
| `rH4` | getEnterPlanModeToolPrompt (`prompt()` wrapper returning `GL_()`) | cli_inner_pretty.js:349644 | function |
| `RL8` | RejectedPlanMessage ("User rejected Claude's plan:" in a `planMode`-bordered box) | cli_inner_pretty.js:349805 | function |
| `sH4` | renderEnterPlanModeResult ("Entered plan mode" + dim subtitle) | cli_inner_pretty.js:349658 | function |
| `tH4` | renderEnterPlanModeRejected ("User declined to enter plan mode") | cli_inner_pretty.js:349675 | function |
| `TL_` | enterPlanModeInputSchema (`z.strictObject({})` — parameterless) | cli_inner_pretty.js:349701 | function |
| `VL_` | enterPlanModeOutputSchema (`z.object({message:string})`) | cli_inner_pretty.js:349702 | function |
| `wv` | EXIT_PLAN_MODE_V2_TOOL_NAME (the V2 name `"ExitPlanMode"`; the one `JC` uses) | cli_inner_pretty.js:143387 | constant |
| `z$4` | renderExitPlanModeRejected (rejected-message wrapper → `RL8`; `plan ?? getPlan() ?? "No plan found"`) | cli_inner_pretty.js:349901 | function |
| `ZL_` | buildWhatHappensSection (What-Happens builder w/ `find`/`grep` shell-alias branch) | cli_inner_pretty.js:349553 | function |
| `_$4` | renderExitPlanModeResult (3-state result: empty / awaiting-lead / approved) | cli_inner_pretty.js:349843 | function |

### Plan Mode — Runtime / State / Naming

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AG4` | getExploreAgentCount (Phase-1 Explore subagent cap; default 3, env override clamped 1-10) | cli_inner_pretty.js:443680 | function |
| `b$9` | isPlanFileForCurrentSession (`{plansDir}/{slug}` prefix + `.md`; session-scoped) | cli_inner_pretty.js:549461 | function |
| `bJz` | findFileSnapshot (locates a `"plan"`-keyed `file_snapshot` transcript entry for resume recovery) | cli_inner_pretty.js:549333 | function |
| `bQ_` | renderFullPlanModeReminder (custom-body OR default 5-phase, wrapped by preamble + footer) | cli_inner_pretty.js:445324 | function |
| `CJz` | recoverPlanFromHistory (scans message history for ExitPlanMode `input.plan` / user `planContent`) | cli_inner_pretty.js:549305 | function |
| `CL8` | persistFileSnapshotIfRemote (records the plan file as a `file_snapshot`; remote-only, gated on `D68`) | cli_inner_pretty.js:549341 | function |
| `CQ_` | PLAN_MODE_PHASE4_FINAL_PLAN ("### Phase 4: Final Plan" reminder block) | cli_inner_pretty.js:446477 | constant |
| `DV` | getPlan (reads the plan file; `null` on ENOENT) | cli_inner_pretty.js:549253 | function |
| `eS_` | buildPlanModeAttachment (per-turn reminder w/ throttle + re-entry + full/sparse; sets `customInstructions`) | cli_inner_pretty.js:412847 | function |
| `fw4` | buildPlanModeExitAttachment (one-shot `plan_mode_exit` attachment when the exit flag is set) | cli_inner_pretty.js:412871 | function |
| `Gt` | setNeedsPlanModeExitAttachment (setter for `d$.needsPlanModeExitAttachment`) | cli_inner_pretty.js:3044 | function |
| `HW8` | copyPlanForResume (restores slug, reads plan, recovers from snapshot/history if remote) | cli_inner_pretty.js:549265 | function |
| `IJz` | MAX_SLUG_RETRIES (`10` — slug `existsSync` collision-avoidance loop bound) | cli_inner_pretty.js:549230 | constant |
| `ILH` | getPlanSlug (seeded, collision-avoiding plan slug; NEW seed param) | cli_inner_pretty.js:549223 | function |
| `IQ_` | renderPlanModeReminder (dispatch: sub-agent / sparse / full) | cli_inner_pretty.js:445313 | function |
| `jG4` | PLAN_MODE_READONLY_PREAMBLE ("you MUST NOT make any edits (except the plan file)… supercedes any other instructions") | cli_inner_pretty.js:446485 | constant |
| `lg6` | PLAN_MODE_CADENCE (`{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`) | cli_inner_pretty.js:414015 | object |
| `m7$` | hasExitedPlanModeInSession (getter for `d$.hasExitedPlanMode`) | cli_inner_pretty.js:3035 | function |
| `MM6` | slugifyPromptSeed (first 4 words, lowercase, dash-collapse, 40-char cap; NEW in 2.1.156) | cli_inner_pretty.js:141346 | function |
| `ng6` | countTurnsSincePlanAttachment (scans back for the latest `plan_mode` attachment) | cli_inner_pretty.js:412820 | function |
| `nM` | getPlansDirectory (memoized; resolves `plansDirectory` vs project root, `~/.claude/plans` fallback) | cli_inner_pretty.js:549382 | function |
| `Rm8` | needsPlanModeExitAttachment (getter for `d$.needsPlanModeExitAttachment`) | cli_inner_pretty.js:3041 | function |
| `sA8` | buildPlanModeFullAttachment (always-full builder; spreads `customInstructions` only when defined) | cli_inner_pretty.js:423732 | function |
| `tS_` | countPlanModeAttachments (counts `plan_mode` attachments since last `plan_mode_exit`; full/sparse modulo) | cli_inner_pretty.js:412836 | function |
| `Tt` | updatePlanModeExitAttachmentFlag (boundary-crossing toggle: set on plan entry, clear on plan exit) | cli_inner_pretty.js:3047 | function |
| `uQ_` | renderSubagentPlanModeReminder (strictest sub-agent variant; no custom-body override) | cli_inner_pretty.js:445416 | function |
| `wG4` | buildExitPlanModeFooter (terminal-call contract: end turn only via AskUserQuestion or ExitPlanMode) | cli_inner_pretty.js:445318 | function |
| `wgH` | generateTwoWordSuffix (`adjective-noun` seeded-slug suffix; NEW in 2.1.156) | cli_inner_pretty.js:141358 | function |
| `wV` | getPlanFilePath (`{plansDir}/{slug}.md` or `{slug}-agent-{agentId}.md`) | cli_inner_pretty.js:549248 | function |
| `xQ_` | renderSparsePlanModeReminder (one-line nudge; adapts to custom instructions) | cli_inner_pretty.js:445411 | function |
| `y88` | generateWordSlug (legacy `adjective-adjective-noun` random slug; fallback when no seed) | cli_inner_pretty.js:141340 | function |
| `zG4` | getPlanAgentCount (Phase-2 Plan subagent cap; tier-scaled 1/3 + env override) | cli_inner_pretty.js:443669 | function |
| `zQ` | setHasExitedPlanMode (setter for `d$.hasExitedPlanMode`) | cli_inner_pretty.js:3038 | function |

### Plan Mode — UI / Approval Dialog / `/plan`

The Shift+Tab permission-mode cycle state machine (`QCH`/`PR8`/`ym`/`i4q`/`c19`/`uV`) lives in
`symbol_index_infra_platform.md` (Permissions — Mode / Consent UI Surface), since it is shared
across all permission modes, not plan-specific.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ayz` | exitPlanModeAnswerComponent (wires `mA9` into the permission-request dispatch table) | cli_inner_pretty.js:598471 | function |
| `dg4` | planCommandModule (`/plan` module export `{call: () => v5z}`) | cli_inner_pretty.js:513488 | object |
| `Gkz` | buildPlanApprovalOptions ("Ready to code?" variable-arity option list; bypass > auto > edits) | cli_inner_pretty.js:589794 | function |
| `i9q` | buildPlanExitPermissionUpdates (`[setMode]` + gated `addRules`; allowedPrompts no-op via `jwH`) | cli_inner_pretty.js:589766 | function |
| `JaK` | SHIFT_TAB_KEY (`canDeliverShiftTab ? "shift+tab" : "meta+m"`; → `chat:cycleMode`/`confirm:cycleMode`) | cli_inner_pretty.js:170200 | constant |
| `jwH` | isPromptBasedPermissionsEnabled (hardcoded `return !1` — `allowedPrompts→addRules` is a no-op) | cli_inner_pretty.js:209900 | function |
| `k5z` | planCommandDef (`/plan` command definition object) | cli_inner_pretty.js:513585 | object |
| `mA9` | ExitPlanModePermissionRequest (the approval dialog; "Exit plan mode?" vs "Ready to code?" branch) | cli_inner_pretty.js:589878 | function |
| `V5z` | PlanDisplay (`/plan` current-plan render with "/plan open to edit" hint) | cli_inner_pretty.js:513490 | function |
| `v5z` | planCommandCall (`/plan` handler; three-way state behavior + new ccr remote short-circuit) | cli_inner_pretty.js:513519 | function |
| `Vkz` | renderAllowedPrompt ("Requested permissions:" row in the approval dialog) | cli_inner_pretty.js:590476 | function |
| `z97` | formatPromptRule (`"prompt: <prompt>"` rule-content formatter for the gated allowedPrompts path) | cli_inner_pretty.js:209897 | function |
| `Zkz` | autoNameSessionFromPlan (fire-and-forget session auto-naming from the plan's first 1000 chars) | cli_inner_pretty.js:589777 | function |
| `_I8` | getApprovalResult (pure choice→PermissionResult mapping, extracted from the React handler) | cli_inner_pretty.js:589839 | function |

### Plan Mode — Remote / Ultraplan (CCR teleport)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B4z` | extractApprovedPlan (scrapes `## Approved Plan:` out of the tool_result; throws on missing marker) | cli_inner_pretty.js:503257 | function |
| `c4z` | ULTRAPLAN_UI_METADATA (per-variant UI metadata incl. advertised cost) | cli_inner_pretty.js:503750 | object |
| `cqH` | isUltraplanEnabled (three-way gate: server config + bridge entitlement + interactive context) | cli_inner_pretty.js:503294 | function |
| `dqH` | UltraplanPollError (error subclass carrying `reason`, `rejectCount`, NEW `eventStats`) | cli_inner_pretty.js:503281 | class |
| `EU4` | contentToText (normalizes a tool_result `content` string/array into one text string) | cli_inner_pretty.js:503246 | function |
| `FN8` | getUltraplanPromptIdentifier (server-config variant selection; falls back to `simple_plan`) | cli_inner_pretty.js:503388 | function |
| `hU4` | REMOTE_PLAN_REMINDER_SIMPLE (`simple_plan` lightweight default remote-planning reminder) | cli_inner_pretty.js:503302 | function |
| `i4z` | runUltraplanPoll (async driver; forks on `executionTarget` remote vs local teleport) | cli_inner_pretty.js:503405 | function |
| `IU4` | DEFAULT_ULTRAPLAN_PROMPT_ID (`"simple_plan"`) | cli_inner_pretty.js:503686 | constant |
| `kU4` | ExitPlanModeScanner (pure stateful CCR-event classifier; approved>terminated>rejected>pending) | cli_inner_pretty.js:503139 | class |
| `m4z` | extractTeleportPlan (scrapes the `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel; `null` when absent) | cli_inner_pretty.js:503249 | function |
| `n4z` | buildUltraplanPromptText (assembles the remote-planning reminder text for the selected variant) | cli_inner_pretty.js:503398 | function |
| `NU4` | pollForApprovedExitPlanMode (deadline-bounded poll loop; 3s interval, 5 consecutive-failure cap) | cli_inner_pretty.js:503190 | function |
| `Q4z` | getUltraplanTimeoutMs (poll deadline in ms) | cli_inner_pretty.js:503379 | function |
| `RU4` | REMOTE_PLAN_REMINDER_MULTIAGENT (`three_subagents_with_critique` multi-agent + critique reminder) | cli_inner_pretty.js:503347 | function |
| `se6` | ULTRAPLAN_PROMPT_REGISTRY (`{simple_plan, visual_plan, three_subagents_with_critique}`) | cli_inner_pretty.js:503738 | object |
| `SU4` | REMOTE_PLAN_REMINDER_VISUAL (`visual_plan` diagram-forward remote-planning reminder) | cli_inner_pretty.js:503323 | function |
| `t4z` | ultraplanSlashCommandCall (`/ultraplan <prompt>` handler; double-gated, single-flight, empty-arg fork) | cli_inner_pretty.js:503690 | function |
| `u4z` | ULTRAPLAN_TELEPORT_SENTINEL (`"__ULTRAPLAN_TELEPORT_LOCAL__"`) | cli_inner_pretty.js:503276 | constant |
| `vU4` | POLL_INTERVAL_MS (`3000`) | cli_inner_pretty.js:503273 | constant |
| `x4z` | MAX_CONSECUTIVE_FAILURES (`5` — consecutive transient-failure cap, reset on success) | cli_inner_pretty.js:503274 | constant |
| `xU4` | ultraplanSlashCommand (`/ultraplan` command def; `isEnabled` = `isUltraplanEnabled`) | cli_inner_pretty.js:503765 | object |

---

## Module: Todo

TodoWrite tool + TaskList tool.

*(No net-new symbols in the v2.1.143 → v2.1.156 window; symbols continue to live in `symbol_index_core_execution.md` Module: Tools.)*

---

## Module: Steering

In-flight steering / queued-message injection.

*(No net-new symbols specific to this index in the v2.1.143 → v2.1.156 window beyond the prior-tree baseline.)*

---

## Module: CLI

CLI flag plumbing, dispatch flags, subcommand surface.

*(The v2.1.156 CLI deltas in this window are background-agents-specific — `--exec`, `--bg`, `--bg-pty-host`, the dispatch/respawn flag sets — and are catalogued in the Background Agents module above. The general CLI flag surface is in `symbol_index_infra_platform.md` / `symbol_index_infra_integration.md`.)*
