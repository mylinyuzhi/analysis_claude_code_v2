# Anchors — AGENT/TASK/SKILL tool group (Claude Code v2.1.183)

> **Bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (all `:NNN` line refs below).
> **Tool-description assets:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/assets/tools/<Name>.md`.
> **Builder:** every tool object is built by `pi(...)` (the v2.1.183 `buildTool`/`defineTool` factory).
> **NOTE — Workflow tool:** out of scope here; see `42_workflow/reconstructed_source`.
>
> **Zod alias:** `H` = the Zod-v4 namespace (`H.object`, `H.string`, `H.enum`, `H.strictObject`, `H.discriminatedUnion`, …). `we(() => …)` = lazy memoized schema thunk. `wn(...)` = memoized async builder. `n0(...)` = a coerced-boolean helper. `gx()` = effort-level union.

---

## Shared gates / helpers (used by multiple tools below)

- `_H` — **Task-tools enable gate** — `function _H()` @299032-299035. Returns `false` when `yl(process.env.CLAUDE_CODE_ENABLE_TASKS)` (i.e. env explicitly set falsey), else `true`. TaskCreate/Get/List/Update use `isEnabled(){ return _H() }`; **TodoWrite is the inverse** (`!_H()`), so Task* and TodoWrite are mutually exclusive.
  ```js
  function _H(){ if (yl(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !1; return !0; }
  ```
- `Sl` — **agent-teams / teammate mode gate** — `function Sl()` @293831-293835. `true` only when (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env truthy OR `yqd()`) AND feature-gate `ct("tengu_amber_flint", true)`. Drives SendMessage `isEnabled`, the TaskUpdate auto-owner/assignment branch, and the team-spawn route in the Agent `call`.
  ```js
  function Sl(){ if (!st(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !yqd()) return !1; if (!ct("tengu_amber_flint", !0)) return !1; return !0; }
  ```
- `pU` — **slash-commands-disabled gate** — `function pU()` @3409-3411 → `return Ot.disableSlashCommands`. Skill `isEnabled` returns `false` when `pU()`.
- `Dg` — **simple/lean system-prompt predicate** — `Dg = wn((e)=>{…})` @134268-134273. Env override `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` (`st`→true / `yl`→false), else `!I8u(e) || C8u(e)` (model-family check). Switches the TodoWrite prompt (`C8d` short vs `I8d` long) and the Agent prompt's `c` branch.
- `LY = "main"` — **reserved agent address** — `var LY = "main"` @362512. SendMessage routes `to:"main"` to the main conversation; Agent `name` cannot equal `LY`.
- `vs = "Agent"` (name const) @149939; `c9 = "Task"` (legacy alias) @149940.
- `mH = "Skill"` @221449; `zh = "SendMessage"` @221450; `Vw = "TaskCreate"` @221451; `g7 = "TaskGet"` @221452; `dP = "TaskUpdate"` @221453.
- `IL = "TaskList"` @220833; `uP = "TaskStop"` @220834; `W9 = "TaskOutput"` @221313; `mR = "TodoWrite"` @221398.
- `_7 = "fork"` — fork subagent_type literal @222272.
- `nye` — **default subagent** (general-purpose) @384836-384847: `{ agentType:"general-purpose", whenToUse:"General-purpose agent for researching complex questions…", tools:["*"], source:"built-in", getSystemPrompt:$vp }`. (The "worker" label in the team prompt is a display alias; the code default agentType is `general-purpose`.)

---

## 1. Agent tool

- **Tool object:** `f3n` — `f3n = pi({ … })` @423505-424334.
- **name:** `vs` (`"Agent"`) @423512. **aliases:** `[c9]` = `["Task"]` @423514. **searchHint:** `"delegate work to a subagent"` @423513.
- **maxResultSizeChars:** `1e5` @423515.
- **description:** `async description(){ return "Launch a new agent" }` @423516-423518.
- **prompt (full Agent.md prose):** `async prompt({agents,getToolPermissionContext,allowedAgentTypes,model})` @423506-423511 → calls `Aqa(model, isTerse, forkActive)` (see Agent.md asset for verbatim text; builder analyzed below).
- **inputSchema:** getter → `zao()` @423519-423521. **outputSchema:** getter → `xDp()` @423522-423524.
- **isReadOnly():** `return !0` @423225-423227.
- **isConcurrencySafe():** `return !0` @423233-423235.
- **userFacingName:** `qao` @423236. **userFacingNameBackgroundColor:** `Vao` @423237.
- **getActivityDescription(e):** `return e?.description ?? "Running task"` @423238-423240.
- **checkPermissions:** `async checkPermissions(e,t)` @423241-423245:
  - If `Br(t).mode === "auto"` → `{ behavior:"passthrough", message:"Agent tool requires permission to spawn subagents." }` (@423243).
  - else → `{ behavior:"allow", updatedInput:e }`.
- **call:** `async call({prompt,subagent_type,description,model,run_in_background,name,mode,isolation,cwd}, …)` @423525-424224 (deep; behavior summary below).
- **mapToolResultToToolResultBlockParam:** @423246-424326 (result-status formatting; key strings quoted below).
- renderers: `renderToolResultMessage: ZNa` @424327, `renderToolUseMessage: eBa` @424328, `renderToolUseTag: tBa` @424329, `renderToolUseProgressMessage: m0e` @424330, `renderToolUseRejectedMessage: nBa` @424331, `renderToolUseErrorMessage: rBa` @424332, `renderGroupedToolUse: oBa` @424333.
- **isEnabled:** *not present* in the object's property keys (Agent.md) → Agent tool is always enabled (deferral/availability is handled by agent-type filtering inside `call`, not an `isEnabled` gate).

### Agent input schema (`zao` @423478-423481, built on `IDp` @423446-423477, base `CDp` @423431-423445)

`CDp` (the base Task/Agent param object) @423431-423445 — **verbatim describe strings:**
```js
description:    H.string().describe("A short (3-5 word) description of the task")                 // @423433
prompt:        H.string().describe("The task for the agent to perform")                          // @423434
subagent_type: H.string().optional().describe("The type of specialized agent to use for this task") // @423435
model:         H.enum(["sonnet","opus","haiku","fable"]).optional().describe(                    // @423436-423440
                 `Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent. Ignored for subagent_type: "fork" — forks always inherit the parent model.`)
run_in_background: H.boolean().optional().describe("Set to true to run this agent in the background. You will be notified when it completes.") // @423441-423443
```

`IDp` @423446-423477 = `CDp().merge({name, team_name, mode}).extend({isolation, cwd})`:
```js
name: H.string()
  .regex(pDa, { message:"name must start with a letter or digit and contain only letters, digits, underscores, or hyphens (max 64 chars)" })  // @423448-423452
  .refine(t => t !== LY, { message: `"${LY}" is reserved — SendMessage routes it to the main conversation` })                                // @423453-423455  (LY="main")
  .optional()
  .describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running.")                                     // @423457
team_name: H.string().optional().describe("Deprecated; ignored. The session has a single implicit team.")   // @423458  ***NEW in 2.1.183***
mode: zts().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')  // @423459-423461  (zts() = permission-mode enum)
isolation: H.enum(["worktree","remote"]).optional().describe(                                                                                  // @423466-423470
  'Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo. "remote" launches the agent in a remote cloud environment (always runs in background; availability is gated).')
cwd: H.string().optional().describe(                                                                                                           // @423471-423475
  'Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
```

**`zao` final shape** @423478-423481:
```js
zao = we(() => { let e = IDp().omit({ cwd:!0 }); return o3t || y7() ? e.omit({ run_in_background:!0 }) : e; });
```
i.e. the wire-exposed Agent schema **drops `cwd`** always, and **drops `run_in_background`** when `o3t` (in-teammate context) or `y7()` (a context flag). So the visible Agent params are: `description, prompt, subagent_type, model, [run_in_background], name, team_name, mode, isolation`.

> **NOTE: there is NO `effort` field on the Agent tool input.** Effort lives on the *agent-definition* model config (e.g. @364437 `effort: union([enum(["low","medium","high","xhigh","max"]), int])`), not on the Agent tool call. Reconstructors must not add an `effort` param to the Agent tool.

### Agent output schema (`xDp` @423482-423504)

Union of three status objects:
- `status:"completed"` → `pRa().extend({ status:literal("completed"), prompt:string })` @423483.
- `status:"async_launched"` @423484-423494: `{agentId, description, resolvedModel?, prompt, outputFile, canReadOutputFile?}` with describe strings e.g. `"The ID of the async agent"` @423486, `"Model the spawn resolved (may differ from the requested one)"` @423488, `"Path to the output file for checking agent progress"` @423490, `"Whether the calling agent has Read/Bash tools to check progress"` @423493.
- `status:"remote_launched"` @423495-423502: `{taskId, sessionUrl, description, prompt, outputFile}` — `"The ID of the remote agent task"` @423497, `"The URL of the cloud session"` @423498.

### Agent `call` behavior (@423525-424224) — branch map + verbatim error strings

Params destructured @423526-423536: `prompt e, subagent_type t, description n, model r, run_in_background o, name s, mode i, isolation a, cwd l`. Locals: `o3t` (teammate-ctx flag), `b = !!c.teammateContext` (caller is a teammate), `_ = Sl()? appState.teamContext : undefined`, `y = c.taskRegistry`.

Guard rails (all throw, with telemetry `Me("subagent_launch", <reason>)`):
- **Teammate cannot name-spawn:** @423550-423556 — if `(b || !!l1e()) && name` → throw `oWe("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the \`name\` parameter.")` (reason `subagent_nested_teammate`).
- **Teammate cannot background:** @423557-423562 — if `b && run_in_background===true` → throw `oWe("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.")` (reason `subagent_teammate_background_denied`).
- **Fork branch (`L = x && I`):** `x = subagent_type !== undefined && Yut(subagent_type)===_7` (normalizes to "fork"); `{available:I, denyRule:k} = gqa(activeAgents, allowedAgentTypes, {toolPermissionContext})` @423566.
  - fork+denied @423567-423571 → throw `r3t("Agent type 'fork' has been denied by permission rule 'Agent(fork)' from ${k.source}.")` (reason `subagent_type_denied`).
  - fork + `isolation:"remote"` @423594-423600 → throw `oWe('Fork cannot use isolation: "remote" — a remote session cannot inherit the conversation context. Omit isolation (or use "worktree"), or spawn a named agent type for remote work.')` (reason `subagent_fork_remote_isolation`).
  - fork inside a fork @423601-423605 → throw `oWe("Fork is not available inside a forked worker. Complete your task directly using your tools.")` (reason `subagent_recursive_fork`).
- **Team-spawn route (the 2.1.178 implicit-team teammate spawner):** @423573-423591 — when `_ (team active) && name && !L (not a fork)`: builds spawn opts and `await cqa({name, prompt:e, description:n, use_splitpane:true, plan_mode_required: mode==="plan", model:…, agent_type: subagent_type, invokingRequestId}, c)` → returns `{ data: { status:"teammate_spawned", prompt, ...ye.data } }`. **`cqa`** @423053-423055 = thin wrapper `return HDp(e,t)` (the teammate-spawn implementation).
- **subagent_type resolution** (non-fork) @423607-423651: default `de = subagent_type ?? nye.agentType` (= `"general-purpose"`); resolves against available agents `QGe(...)`; ambiguity/normalization/not-found telemetry + throws:
  - ambiguous @423625-423627 → `r3t("Agent type '${de}' is ambiguous — matches …. Use the exact name: … / None of these are available. Available agents: …")` (reason `subagent_type_ambiguous`, telemetry `tengu_subagent_type_miss`).
  - normalized match telemetry `tengu_subagent_type_normalized` @423633.
  - denied-by-rule @423637-423641 → `r3t("Agent type '${$e}' has been denied by permission rule 'Agent(${$e})' from ${ze.source}.")`.
  - not found @423644-423649 → `r3t("Agent type '${de}' not found. Available agents: ${he.join(", ")}")` (reason `subagent_type_not_found`).
- **Teammate + background-flagged agent def** @423653-423659 → throw `oWe("In-process teammates cannot spawn background agents. Agent '${P.agentType}' has background: true in its definition.")`.
- **Required-MCP-servers wait/verify** @423660-423700 → on miss throw `oWe("Agent '${P.agentType}' requires MCP servers matching: …. MCP servers with tools: …. Use /mcp to configure and authenticate the required MCP servers.")` (reason `subagent_mcp_required_missing`).
- **Model resolution:** `O = pte(zhe(P, mainLoopModel), mainLoopModel, L? undefined : m, h)` @423702 (`m = z9()? undefined : model` @423543 — `z9()` suppresses model override).
- **Isolation resolve:** `q = isolation ?? P.isolation` @423709; remote→fallback when `!n3t()` @423710-423719 (`isolation:'remote' is unavailable …` debug strings); `V = q==="remote"`.
- **Async decision:** `Q = V || ((o===true || P.background===true || F || W || false) && !o3t)` @423721 (background when remote, or run_in_background, or agent def background, or flags `F=oI()`/`W=y7()`, and NOT teammate-ctx).
- **Depth:** `z = Gz(c.agentContext) + 1` @423722 (spawn depth — the nested-subagent depth tracking).
- Telemetry `tengu_agent_tool_selected` @423724-423736 (`agent_type, model, source, color, is_built_in_agent, is_async, is_fork, agent_depth, agent_system_prompt_chars`).
- **Remote launch** @423737-423791: eligibility `tce()`; on ineligible throw `epo("Cannot launch cloud agent:\n…")` (reason `subagent_remote_ineligible`) @423743-423747; on session fail `epo(… ?? "Failed to create cloud session")` (reason `subagent_remote_session_failed`); returns `{data:{status:"remote_launched", taskId, sessionUrl, description, prompt, outputFile}}` @423780-423790. Telemetry `tengu_agent_tool_remote_launched` @423778.
- **Async (background) launch** @423914-423984: registers task via `Xut(...)`, runs `W4e(...)`+`wj(...)` stream, returns `{data:{ isAsync:true, status:"async_launched", agentId, description, resolvedModel, prompt, outputFile, canReadOutputFile }}` @423972-423983.
- **Sync launch** @423985-424223: streams to completion; background-hint timer `qe = setTimeout(…, TDp, c)` (TDp=2000ms @423347) emits `{kind:"background_hint"}` @424091; on cancel telemetry `tengu_agent_tool_terminated` @424128/@424169; may flip to background mid-flight (returns `async_launched`); on completion returns `{data:{ status:"completed", prompt, ...jt, ...Ye }}` @424196; emits a `task_notification` system message in `finally` @424205-424218.

### Agent `mapToolResultToToolResultBlockParam` — result-status text (verbatim) @423246-424326
- `teammate_spawned` @423256-423259:
  > `Spawned successfully.\nagent_id: ${r.teammate_id}\nname: ${r.name}\nThe agent is now running and will receive instructions via mailbox.`
- `remote_launched` @423272-423277:
  > `Cloud agent launched.\ntaskId: ${r.taskId}\nsession_url: ${r.sessionUrl}\noutput_file: ${r.outputFile}\nThe agent is running in the cloud. You will be notified automatically when it completes.\nBriefly tell the user what you launched and end your response.`
- `async_launched` @423283-423292:
  > `Async agent launched successfully.\nagentId: ${e.agentId} (internal ID - do not mention to user. Use SendMessage with to: '${e.agentId}' to continue this agent.)\nThe agent is working in the background. You will be notified automatically when it completes.` + (if canReadOutputFile) `Do not duplicate this agent's work — avoid working with the same files or topics it is using. … output_file: ${e.outputFile}\nDo NOT ${Ws} or tail this file via the shell tool — it is the full subagent JSONL transcript and reading it will overflow your context. …` else `Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message.`  (`Ws` = Read-tool name const.)
- `completed` @423295-423320: appends `agentId: ${e.agentId} (use SendMessage with to: '${e.agentId}' to continue this agent)` + optional worktree path/branch + `<usage>subagent_tokens: … tool_uses: … duration_ms: …</usage>`; `"(Subagent completed but returned no output.)"` @423305 when empty.
- default @423322-423324 → throw `Error("Unexpected agent tool result status: ${e.status}")` (reason `subagent_unexpected_result_status`).

### Agent description builder `Aqa(model e, terse t, forkActive n)` @423136-423318
Async prose builder; returns the Agent.md text with these branches (all strings verbatim in bundle):
- `r = y7()`, `o = r && (n ?? true)` (fork-section active) @423137-423138.
- **fork section `s`** @423139-423154 (only when `o`): `## When to fork` + `Fork yourself (pass \`subagent_type: "fork"\`) when the intermediate tool output isn't worth keeping in your context. …` (full text @423144-423152).
- **writing-the-prompt section `i`** @423155-423168: `## Writing the prompt` + "Brief the agent like a smart colleague who just walked into the room …".
- **examples `a`** (fork-active) @423169-423209 / **`l`** (classic) @423210-423236 — worked `${vs}({…})` examples (ship-audit fork, migration-review).
- `c = Dg(e)` (lean) @423237; `u = "Available agent types are listed in <system-reminder> messages in the conversation."` @423238.
- **pro-plan nudge `d`** @423239-423244 (when `sa()==="pro"`): `**Do not spawn agents unless the user asks.** Each spawn starts cold and re-derives context you already have …`.
- **base `p`** @423245-423249: `Launch a new agent to handle complex, multi-step tasks. …` + subagent_type guidance (fork vs general-purpose).
- if `t` (terse) → returns `p` early @423250.
- lean branch `c` @423259-423289 returns `p` + `## When to use` + background/teammate/remote bullets (`run_in_background: true …`, `isolation: "remote" runs the agent in a remote CCR sandbox …`, teammate caveats via `UN()`/`em()`).
- full branch @423290-423317: `## Usage notes` bullets (relay result, `SendMessage` to continue, run-in-background, parallel multi-block, worktree cleanup, remote CCR) + `${o ? a : l}` examples.

### Agent helpers (one-liners)
- `qao` — Agent userFacingName @385346-385352: returns `subagent_type` (or `"Agent"` when worker/default/unset).
- `Vao` — userFacingNameBackgroundColor @385353-385356: `Ihe(subagent_type)` color.
- `gqa` — fork availability @423337-423342: `{available, denyRule}` for fork agent type `_7` (gated by `y7()`, agent presence, allow-list, and `But(...)` deny rule).
- `cqa` → `HDp` — teammate spawn @423053-423055.
- `TDp = 2000` — sync-agent background-hint delay (ms) @423347.

---

## 2. Skill tool

- **Tool object:** `lut` — `lut = pi({ … })` @393151-…(call body extends past 393367).
- **name:** `mH` (`"Skill"`) @393152. **searchHint:** `"invoke a slash-command skill"` @393153.
- **isEnabled():** @393154-393157 → `if (pU()) return !1; return !0` (disabled when slash commands disabled).
- **maxResultSizeChars:** `1e5` @393158.
- **inputSchema:** getter → `iCp()` @393159-393161. **outputSchema:** getter → `aCp()` @393162-393164.
- **description:** `async ({skill}) => \`Execute skill: ${skill}\`` @393165.
- **prompt:** `async () => FTn(Sc())` @393166 (builder `FTn` @220168-220189; full text below).
- **toAutoClassifierInput:** `({skill}) => skill ?? ""` @393167.
- **validateInput:** @393168-393249 (error strings below).
- **checkPermissions:** @393250-393305 (allow/deny/ask logic below).
- **call:** `async call({skill, args}, n, r, o, s)` @393306-… (behavior below).
- mapToolResultToToolResultBlockParam + renderers follow (Skill.md property keys).

### Skill input schema (`iCp` @393128-393133)
```js
skill: H.string().describe("The name of a skill from the available-skills list. Do not guess names.")  // @393130
args:  H.string().optional().describe("Optional arguments for the skill")                              // @393131
```
### Skill output schema (`aCp` @393134-393150) — union:
- inline: `{success, commandName, allowedTools?, model?, status:literal("inline")?}` @393135-393141.
- forked: `{success, commandName, status:literal("forked"), agentId, result}` @393142-393148.

### Skill `validateInput` ({skill}, t) @393168-393249 — verbatim error messages (each prefixed with `Me("skill_invoke", <reason>)`):
- empty name @393170-393174 → `{result:false, message:\`Invalid skill format: ${skill}\`, errorCode:1}` (reason `skill_invoke_empty_name`).
- slash prefix telemetry `tengu_skill_tool_slash_prefix` @393176.
- not materialized @393186-393190 → `\`Skill ${o} could not be downloaded (${s}). Proceed without it.\`` errorCode 10 (reason `skill_invoke_not_materialized`).
- not found @393191-393201 → `\`Unknown skill: ${o}. Did you mean ${u}?\`` / `\`Unknown skill: ${o}\`` errorCode 2 (reason `skill_invoke_not_found`, uses `Dct` edit-distance≤2 suggestion).
- fork recursion @393202-393211 → `\`Skill ${o} is already executing in this forked context — you are the subagent running it. Execute the instructions in the skill body directly instead of re-invoking the ${mH} tool.\`` errorCode 9 (reason `skill_invoke_fork_recursion`, telemetry `tengu_skill_tool_fork_recursion_blocked`).
- disable-model-invocation @393212-393220 → `\`Skill ${o} cannot be used with ${mH} tool due to disable-model-invocation\`` errorCode 4 (reason `skill_invoke_model_disabled`).
- not allowlisted @393221-393225 → `\`Skill ${o} is not in this session's skills allowlist\`` errorCode 8 (reason `skill_invoke_not_allowlisted`).
- bundled/overrides disabled @393226-393236 → `\`Skill ${o} is disabled for model invocation ${A}\`` errorCode 7 (A = "by the disableBundledSkills setting or CLAUDE_CODE_DISABLE_BUNDLED_SKILLS env var" … / "in skillOverrides settings").
- wrong type (UI/CLI not skill) @393237-393247 → `\`${o} is a ${u} command, not a skill. Ask the user to run /${o} themselves — it cannot be invoked via the ${mH} tool.\`` errorCode 5 (`u` = "UI" | "built-in CLI") (reason `skill_invoke_not_prompt_type`).
- success → `{result:true}` @393248.

### Skill `checkPermissions` ({skill,args}, n) @393250-393305
- normalizes name (strips leading `/`), matches rules via `l(p)` (supports `:*`/` *` wildcards) @393256-393264.
- deny rules `jY(s, lut, "deny")` @393265-393272 → `{behavior:"deny", message:"Skill execution blocked by permission rules", decisionReason:{type:"rule",rule:f}}`.
- allow rules `jY(s, lut, "allow")` @393273-393280 → `{behavior:"allow", updatedInput:{skill,args}, decisionReason:{type:"rule",rule:f}}`.
- auto-allowed prompt skill `cCp(a)` @393281-393282 → allow.
- else **ask** @393283-393304: suggests `addRules` for `o` and `${o}:*` (localSettings), `{behavior:"ask", message:\`Execute skill: ${o}\`, suggestions, updatedInput, metadata:{command}}`.

### Skill `call` ({skill,args}, n…) @393306+ — behavior
Sets `n.options.activeSkill`; resolves skill via `gE(a, await oco(n))`; **fork-context skills** (`type:"prompt" && context:"fork"`) run via `sCp(...)` @393315-393320 → returns `status:"forked"`; otherwise `processPromptSlashCommand(a, args, c, n)` @393321-393322 (throw `Error("Command processing failed")` if `!shouldQuery`, reason `skill_invoke_process_failed`); emits telemetry `tengu_skill_tool_invocation` @393343-393362 with `command_name, query_depth, execution_context:"inline", invocation_trigger ("nested-skill"|"claude-proactive")`.

### Skill prompt builder `FTn` @220168-220189 (verbatim head):
> `Execute a skill within the main conversation` … `When users reference a "slash command" or "/<something>", they are referring to a skill. Use this tool to invoke it.` … `- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task` … `- If you see a <${LU}> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again` (`LU` = the skill-system-reminder tag name).

---

## 3. TaskCreate tool

- **Tool object:** `aVa` — `aVa = pi({ … })` @430475-430537.
- **name:** `Vw` (`"TaskCreate"`) @430476. **searchHint:** `"create a task in the task list"` @430477.
- **description:** `async()=>oVa` @430479-430481 (`oVa` = `"Create a new task in the task list"`). **prompt:** `async()=>sVa()` @430482-430484 (builder; see TaskCreate.md asset).
- **inputSchema:** `UMp()` @430485-430487. **outputSchema:** `jMp()` @430488-430490.
- **userFacingName():** `"TaskCreate"` @430491-430493.
- **shouldDefer:** `!0` @430494. **coerceInput:** `tVa` @430495. **validationErrorSteer:** `nVa` @430496.
- **isEnabled():** `_H()` @430497-430499. **isConcurrencySafe():** `!1` @430500-430502.
- **call:** @430509-430532 — creates task via `Nla(WB(), {subject, description, activeForm, status:"pending", owner:undefined, blocks:[], blockedBy:[], metadata})`; runs validation generator `E3t(...)`, throws on `blockingError`; returns `{data:{task:{id, subject}}}`. Sets expanded view `tasks` @430531.
- **mapToolResult:** @430533-430536 → `\`Task #${n.id} created successfully: ${n.subject}\``.

### TaskCreate input schema (`UMp` @430464-430473)
```js
subject:     H.string().describe("A brief title for the task")                                                       // @430466
description: H.string().describe("What needs to be done")                                                            // @430467
activeForm:  H.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")')  // @430468-430470
metadata:    H.record(H.string(), H.unknown()).optional().describe("Arbitrary metadata to attach to the task")       // @430471
```
Output `jMp` @430474: `{task:{id, subject}}`.

---

## 4. TaskGet tool

- **Tool object:** `dVa` — `dVa = pi({ … })` @430580-430645.
- **name:** `g7` (`"TaskGet"`) @430581. **searchHint:** `"retrieve a task by ID"` @430582.
- **description:** `async()=>cVa` @430584-430586 (`cVa` = `"Get a task by ID from the task list"` @430539). **prompt:** `async()=>uVa` @430587-430589 (`uVa` = `"Use this tool to retrieve a task by its ID from the task list…"` @430540-430561, full text in TaskGet.md asset).
- **inputSchema:** `GMp()` @430590-430592. **outputSchema:** `WMp()` @430593-430595.
- **userFacingName():** `"TaskGet"` @430596-430598. **shouldDefer:** `!0` @430599.
- **isEnabled():** `_H()` @430600-430602. **isConcurrencySafe():** `!0` @430603-430605. **isReadOnly():** `!0` @430606-430608.
- **call:** @430615-430631 — `Bee(WB(), taskId)`; returns `{data:{task:null}}` if missing else full task `{id, subject, description, status, blocks, blockedBy}`.
- **mapToolResult:** @430632-430644 → `"Task not found"` or multi-line `\`Task #${id}: ${subject}\`` + Status/Description/Blocked by/Blocks lines.

### TaskGet input schema (`GMp` @430567)
```js
GMp = we(()=>H.strictObject({ taskId: H.string().describe("The ID of the task to retrieve") }))
```
Output `WMp` @430568-430579: `{task: {id, subject, description, status: vje(), blocks: string[], blockedBy: string[]} | null}` (`vje()` = task-status enum `["pending","in_progress","completed"]` @299290).

---

## 5. TaskList tool

- **Tool object:** `bVa` — `bVa = pi({ … })` @430979-431042.
- **name:** `IL` (`"TaskList"`) @430980. **searchHint:** `"list all tasks"` @430981.
- **description:** `async()=>hVa` @430983-430985 (`hVa` = `"List all tasks in the task list"` @430955). **prompt:** `async()=>yVa()` @430986-430988 (team-aware builder `yVa` @430913-430954, full text in TaskList.md asset).
- **inputSchema:** `zMp()` @430989-430991 (`zMp = we(()=>H.strictObject({}))` @430965 — no params). **outputSchema:** `KMp()` @430992-430994.
- **userFacingName():** `"TaskList"` @430995-430997. **shouldDefer:** `!0` @430998.
- **isEnabled():** `_H()` @430999-431001. **isConcurrencySafe():** `!0` @431002-431004. **isReadOnly():** `!0` @431005-431007.
- **call:** @431011-431026 — `cj(WB())` filtered `!metadata?._internal`; recomputes `blockedBy` minus completed; returns `{data:{tasks:[{id, subject, status, owner, blockedBy}]}}`.
- **mapToolResult:** @431027-431041 → `"No tasks found"` or lines `\`#${id} [${status}] ${subject}${owner}${blockedBy}\``.

### TaskList prompt builder `yVa` @430913-430954 (team-aware branches via `Sl()`)
- when `Sl()` adds `## Teammate Workflow` section @430921-430932: "After completing your current task, call TaskList to find available work … **Prefer tasks in ID order** (lowest ID first) …".
- base prose: `Use this tool to list all tasks in the task list.` + `## When to Use This Tool` + `## Output` (subject/status/owner/blockedBy).

Output `KMp` @430966-430978: `{tasks:[{id, subject, status: vje(), owner?, blockedBy: string[]}]}`.

---

## 6. TaskUpdate tool

- **Tool object:** `AVa` — `AVa = pi({ … })` @430761-430911.
- **name:** `dP` (`"TaskUpdate"`) @430762. **searchHint:** `"update a task"` @430763.
- **description:** `async()=>fVa` @430765-430767 (`fVa` = `"Update a task in the task list"` @430647). **prompt:** `async()=>mVa` @430768-430770 (`mVa` long prose @430648-430722, full text in TaskUpdate.md asset).
- **inputSchema:** `qMp()` @430771-430773. **outputSchema:** `VMp()` @430774-430776.
- **userFacingName():** `"TaskUpdate"` @430777-430779. **coerceInput:** `t1t` @430780. **shouldDefer:** `!0` @430781.
- **isEnabled():** `_H()` @430782-430784. **isConcurrencySafe():** `!0` @430785-430787.
- **call:** @430798-430900 (behavior below).
- **mapToolResult:** @430901-430910 → `\`Task #${r} not found\`` (on fail) / `\`Updated task #${r} ${updatedFields.join(", ")}\``; appends `"\n\nTask completed. Call TaskList now to find your next available task or see if your work unblocked others."` when status→completed and `VD() && Sl()` @430905-430908.

### TaskUpdate input schema (`qMp` @430734-430751)
```js
let e = vje().or(H.literal("deleted"));     // status enum + "deleted"
H.strictObject({
  taskId:      H.string().describe("The ID of the task to update")                                       // @430737
  subject:     H.string().optional().describe("New subject for the task")                                // @430738
  description: H.string().optional().describe("New description for the task")                            // @430739
  activeForm:  H.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")')  // @430740-430742
  status:      e.optional().describe("New status for the task")                                          // @430743
  addBlocks:   H.array(H.string()).optional().describe("Task IDs that this task blocks")                 // @430744
  addBlockedBy:H.array(H.string()).optional().describe("Task IDs that block this task")                  // @430745
  owner:       H.string().optional().describe("New owner for the task")                                  // @430746
  metadata:    H.record(H.string(), H.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it.")  // @430747-430749
})
```
Output `VMp` @430752-430760: `{success, taskId, updatedFields: string[], error?, statusChange?:{from,to}}`.

### TaskUpdate `call` behavior @430798-430900
- `Bee(f, taskId)`; if missing → `{data:{success:false, taskId, updatedFields:[], error:"Task not found"}}` @430818.
- diffs subject/description/activeForm/owner into `g`, pushing field names @430821-430824.
- **team auto-claim** @430825-430828: when `Sl() && status==="in_progress" && owner===undefined && !existingOwner` → set owner to `ih()` (self).
- metadata merge (null deletes keys) @430829-430835.
- status handling @430836-430867: `"deleted"` → `OLn(f, taskId)` returns `statusChange:{from, to:"deleted"}`; `"completed"` runs completion-validation generator `uWe(...)` and aborts on `blockingError`; else sets status.
- persists `Xge(f, taskId, g)` @430868.
- **team assignment notification** @430869-430881: when `g.owner && Sl()`, mails a `task_assignment` frame to the new owner via `$A(...)`.
- block edges via `BXr(...)` @430882-430891 (addBlocks/addBlockedBy).
- returns `{data:{success:true, taskId, updatedFields, statusChange?}}`.

---

## 7. TaskOutput tool (DEPRECATED)

- **Tool object:** `q3n` — `q3n = pi({ … })` @428170-…(call @428216).
- **name:** `W9` (`"TaskOutput"`) @428171. **searchHint:** `"read output/logs from a background task"` @428172.
- **maxResultSizeChars:** `1e5` @428173. **shouldDefer:** `!0` @428174.
- **aliases:** `["AgentOutputTool","BashOutputTool","AgentOutput","BashOutput"]` @428175 (legacy compat).
- **userFacingName():** `"Task Output"` @428176-428178.
- **inputSchema:** `sMp()` @428179-428181.
- **description:** @428182-428184 → `"[Deprecated] — for bash and remote_agent tasks, prefer Read on the output file path; for local_agent tasks, use the Agent tool result directly"`.
- **isConcurrencySafe(e):** `this.isReadOnly?.(e) ?? false` @428185-428187. **isEnabled():** `!0` @428188-428190. **isReadOnly(e):** `!0` @428191-428193.
- **prompt:** @428197-428210 — full DEPRECATED guidance (verbatim): `"DEPRECATED: Background tasks return their output file path in the tool result, and you receive a <task-notification> with the same path when the task completes. - For bash tasks: prefer using the Read tool … - For local_agent tasks: use the Agent tool result directly. Do NOT Read the .output file — it is a symlink to the full subagent conversation transcript (JSONL) and will overflow your context window. - For remote_agent tasks: prefer using the Read tool …"`.
- **validateInput:** @428211-428215 → `"Task ID is required"` (errorCode 1) / `\`No task found with ID: ${e}\`` (errorCode 2).
- **call:** @428216-428242 — non-blocking vs blocking (`iMp` poll w/ timeout); returns `{data:{retrieval_status:"success"|"not_ready"|"timeout", task}}`; marks `notified:true`.
- **mapToolResult:** @428243+ → `<retrieval_status>`, `<task_id>`, `<task_type>`, `<status>`, `<exit_code>` XML tags.

### TaskOutput input schema (`sMp` @428163-428169)
```js
task_id: H.string().describe("The task ID to get output from")                                    // @428165
block:   n0(H.boolean().default(!0)).describe("Whether to wait for completion")                   // @428166
timeout: H.number().min(0).max(600000).default(30000).describe("Max wait time in ms")             // @428167
```

---

## 8. TaskStop tool

- **Tool object:** `edt` — `edt = pi({ … })` @424867-424920.
- **name:** `uP` (`"TaskStop"`) @424868. **searchHint:** `"kill a running background task"` @424869.
- **aliases:** `["KillShell","KillBash"]` @424870 (legacy compat). **maxResultSizeChars:** `1e5` @424871.
- **userFacingName:** `() => "Stop Task"` @424872.
- **inputSchema:** `WDp()` @424873-424875. **outputSchema:** `qDp()` @424876-424878.
- **shouldDefer:** `!0` @424879. **isConcurrencySafe():** `!0` @424880-424882.
- **validateInput:** `({task_id, shell_id}, {taskRegistry})` @424886-424894 → `"Missing required parameter: task_id"` (errorCode 1), `\`No task found with ID: ${r}\`` (errorCode 1), `\`Task ${r} is not running (status: ${o.status})\`` (errorCode 3); success `{result:true}`.
- **description:** `async()=>"Stop a running background task by ID"` @424895-424897.
- **prompt:** `async()=>JOi` @424898-424900 (`JOi` = the deprecated-prompt const; TaskStop.md prose `- Stops a running background task by its ID …`).
- **call:** `async call({task_id, shell_id}, n)` @424906-424919 — `s = task_id ?? shell_id`; `a3t(s, {taskRegistry, setAppState, callerAgentId:Kjn(n)})`; returns `{data:{message:\`Successfully stopped task: ${taskId} (${command})\`, task_id, task_type, command}}`.
- renderers: `renderToolUseMessage: Uqa` @424904, `renderToolResultMessage: jqa` @424905.

### TaskStop input schema (`WDp` @424853-424858)
```js
task_id:  H.string().optional().describe("The ID of the background task to stop")   // @424855
shell_id: H.string().optional().describe("Deprecated: use task_id instead")         // @424856
```
Output `qDp` @424859-424866: `{message, task_id, task_type, command?}`.

---

## 9. SendMessage tool

- **Tool object:** `p$p` — `p$p = pi({ … })` @434568-…(call @434694).
- **name:** `zh` (`"SendMessage"`) @434569. **searchHint:** `"send messages to agent teammates"` @434570. **maxResultSizeChars:** `1e5` @434571.
- **userFacingName():** `"SendMessage"` @434572-434574.
- **inputSchema:** `o$p()` @434575-434577. **shouldDefer:** `!0` @434578.
- **isEnabled():** `Sl()` @434579-434581 (team mode only).
- **isReadOnly(e):** `typeof e.message === "string"` @434582-434584 (plain-text sends are read-only; protocol frames are not).
- **backfillObservableInput:** @434585-434596 (maps `{to, message}` → observable `{type, recipient, content, …}` for protocol frames).
- **toAutoClassifierInput:** @434597-434607 (`to X: msg` / `shutdown_request to X` / `plan_approval approve/reject to X`).
- **checkPermissions:** `async(e,t)=>({behavior:"allow", updatedInput:e})` @434608-434610 (always allow).
- **validateInput:** @434611-434684 (error strings below).
- **description:** `async()=>nza` @434685-434687 (`nza` = `"Send a message to another agent"` @434314).
- **prompt:** `async()=>rza()` @434688-434690 (builder `rza` @434285-434313; full text below).
- **call:** `async call(e,t,n,r)` @434694-… (behavior below).
- **mapToolResult:** @434691-434693 → text block of `Re(e)`.

### SendMessage input schema (`o$p` @434558-434567)
```js
to:      H.string().describe("Recipient: teammate name")                                                                  // @434560
summary: H.string().max(200).optional().describe("A 5-10 word summary shown as a preview in the UI (required when message is a string)")  // @434561-434564
message: H.union([ H.string().describe("Plain text message content"), r$p() ])                                            // @434565
```
**Message-frame schema `r$p`** @434541-434557 (`discriminatedUnion("type", …)`):
- `{type:"shutdown_request", reason?}` @434543.
- `{type:"shutdown_response", request_id (regex lza "must be the request id being responded to"), approve:n0(), reason?}` @434544-434549.
- `{type:"plan_approval_response", request_id (regex lza …), approve:n0(), feedback?}` @434550-434555.

### SendMessage `validateInput` (e, t) @434611-434684 — verbatim errors (all errorCode 9):
- `to` empty @434612 → `"to must not be empty"`.
- broadcast @434613-434618 → `'broadcast (to: "*") is no longer supported — send a message per recipient'`.
- bridge/uds empty target @434620-434621 → `"address target must not be empty"`.
- not-local-socket @434622-434627 → `\`'${e.to}' is not a local socket address. Use an address from ${Gtt}.\``.
- `to` contains `@` @434628-434633 → `"to must be a bare teammate name — there is only one team per session"`.
- string message: summary required @434635-434636 → `"summary is required when message is a string"`.
- string message looks like a protocol frame `iF(e.message)` @434637-434643 → `'message text must not be a teammate protocol frame (permission/mode/plan/shutdown JSON) — to respond to a plan or shutdown request, use the structured object form ({"message": {"type": ...}}); otherwise send plain text'`.
- string message is a lifecycle/task frame @434644-434665 → `"message text must not be a teammate lifecycle/task frame (idle/terminated/task/shutdown JSON) — send plain text instead"`.
- `shutdown_response` to wrong recipient @434668-434669 → `\`shutdown_response must be sent to "${np}"\`` (`np` = team-lead address).
- `shutdown_response` approve+reason @434670-434676 → `"reason is only delivered on rejections (approve: false) — approvals are sent as a silent confirmation with no reason text; omit reason or reject instead"`.
- `shutdown_response` reject without reason @434677-434682 → `"reason is required when rejecting a shutdown request"`.

### SendMessage `call` behavior @434694-…
- `o = t.agentId`; sender `s = cza(t, o)`; `origin = peer{from:s, senderTaskId:o}` or `coordinator` @434695-434697.
- **`to === "main"` (LY)** @434699-434719: if caller is main → fail `\`You are the main conversation — "main" addresses you. Send to a named agent instead.\``; else enqueue into main's next turn via `o_({mode:"prompt", agentId:Ls(), value:a, priority:"next", origin, skipSlashCommands:true, isMeta:true})` → `{data:{success:true, message:"Message queued for the main conversation's next turn."}}`.
- **named recipient** @434720+: resolves recipient agentId from `teamContext.teammates` / `agentNameRegistry` / `tUo(to)`; if running → `gWe(...)` enqueue → `{success:true, message:\`Message queued for delivery to ${to} at its next tool round.\`}`; else resumes via `dLe({agentId, prompt:a, …})`.

### SendMessage prompt builder `rza` @434285-434313 (verbatim):
```
# SendMessage

Send a message to another agent.

{"to": "researcher", "summary": "assign task 1", "message": "start on task #1"}

| `to` | |
|---|---|
| `"researcher"` | Teammate by name |
| `"main"` | The main conversation (background subagents only) |

Your plain text output is NOT visible to other agents — to communicate, you MUST call this tool. Messages from teammates are delivered automatically; you don't check an inbox. Refer to active teammates by name; to resume a completed background agent, use the `agentId` (format `a...-...`) from its spawn result. When relaying, don't quote the original — it's already rendered to the user.

## Protocol responses (legacy)

If you receive a JSON message with `type: "shutdown_request"` or `type: "plan_approval_request"`, respond with the matching `_response` type — echo the `request_id`, set `approve` true/false:
…
Approving shutdown terminates your process. Rejecting plan sends the teammate back to revise. Don't originate `shutdown_request` unless asked. Don't send structured JSON status messages — use TaskUpdate.
```

---

## 10. TodoWrite tool

- **Tool object:** `Dxe` — `Dxe = pi({ … })` @299525-299576.
- **name:** `mR` (`"TodoWrite"`) @299526. **searchHint:** `"manage the session task checklist"` @299527.
- **maxResultSizeChars:** `1e5` @299528. **strict:** `!0` @299529.
- **description:** `async()=>jla` @299530-299532 (`jla` @299325-299326, full text below).
- **prompt:** `async({model}) => Ula(model)` @299533-299535 (variant selector below).
- **inputSchema:** `x8d()` @299536-299538. **outputSchema:** `k8d()` @299539-299541.
- **userFacingName():** `""` @299542-299544 (intentionally blank — no header in UI).
- **shouldDefer:** `!0` @299545.
- **isEnabled():** `!_H()` @299546-299548 (enabled only when Task* tools are **disabled**; TodoWrite and Task* are mutually exclusive).
- **toAutoClassifierInput:** `\`${e.todos.length} items\`` @299549-299551.
- **checkPermissions:** `async(e)=>({behavior:"allow", updatedInput:e})` @299552-299554.
- **call:** `async call({todos}, t)` @299558-299567 — per-agent store: `r = t.agentId ?? xt()`; if all todos completed, store `[]`, else store the list; `t.setAppState(a=>({...a, todos:{...a.todos, [r]: i}}))`; returns `{data:{oldTodos, newTodos}}`.
- **mapToolResult (the post-call nudge):** @299568-299575 → verbatim:
  > `"Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"`

### TodoWrite input schema (`x8d` @299518) + item schema (`w8d` @299310-299315)
```js
x8d = we(()=>H.strictObject({ todos: mst().describe("The updated todo list") }))                 // @299518
mst = we(()=>H.array(w8d()))                                                                      // @299317
w8d = {                                                                                            // @299310-299315
  content:    H.string().min(1, "Content cannot be empty")
  status:     T8d()   // = H.enum(["pending","in_progress","completed"])  @299309
  activeForm: H.string().min(1, "Active form cannot be empty")
}
```
Output `k8d` @299519-299524: `{oldTodos: mst(), newTodos: mst()}`.

### TodoWrite description `jla` @299325-299326 (verbatim):
> `Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task.`

### TodoWrite prompt — **two variants** via `Ula(model)` @299319-299321
```js
function Ula(e){ return Dg(e) ? C8d : I8d; }   // Dg = lean/simple predicate
```
- **`C8d`** (short, "working plan" — used when `Dg(model)` is true) @299322-299323 (verbatim):
  > `Create and update a task list for the current session. The list is rendered to the user as your working plan.\n\n- Each todo has \`content\`, \`status\` ("pending" | "in_progress" | "completed"), and \`activeForm\` (present-tense label shown while in progress).\n- Send the full list each call; it replaces the previous one.\n- Keep one item \`in_progress\` at a time and mark it \`completed\` when done.`
- **`I8d`** (long, classic — default) @299330+ : `"Use this tool to create and manage a structured task list for your current coding session. …"` with `## When to Use This Tool` (7 numbered scenarios), `## When NOT to Use This Tool`, etc. (full text @299330-…; matches TodoWrite.md asset structure; cadence guidance "Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time" @299341).

**Cadence/nudge summary:** description ("To be used proactively and often … at least one task is in_progress at all times") + long-prompt rule (one in_progress at a time, mark completed when done, capture instructions immediately) + the post-call result nudge @299573.

---

## "New in 2.1.183 vs 2.1.156" (0-count before-picture greps)

Before-picture bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.
- **NEW:** `team_name … "Deprecated; ignored. The session has a single implicit team."` — **0 hits in 2.1.156** (the Agent `name` field now also has the reserved-`"main"` refine + this deprecated `team_name`). In 2.1.156 `team_name` existed only as a serialized session field (@156:138764 etc.), not as a deprecated Agent-tool input.
- **NEW:** Agent `name` reserved-name refine `… SendMessage routes it to the main conversation` — **0 hits in 2.1.156**.
- **CARRYOVER (1 hit each in 2.1.156):** `"Teammates cannot spawn other teammates"`, `"send messages to agent teammates"` (SendMessage searchHint), `"create a task in the task list"` (TaskCreate searchHint), `"invoke a slash-command skill"` (Skill searchHint), `'broadcast (to:'` (SendMessage broadcast removal), `"Fork yourself"` (Agent fork prose). The implicit-team teammate-spawner + Skill/Task families are evolutions of 2.1.156 machinery, not brand-new tools.

---

## Open questions / cross-checks for the reconstructor
1. `Aqa` (Agent description) and `I8d` (TodoWrite long prompt) are long multi-branch builders — quote the full asset text from `assets/tools/Agent.md` / `assets/tools/TodoWrite.md`, but note Agent.md is short (the asset captured only `"Launch a new agent"`; the *real* prose comes from `Aqa` @423136-423318 — use the bundle lines, not the asset, for the full description).
2. **RESOLVED:** `o3t = Ge.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` @423430 (background-tasks-disabled flag); `y7()` @222225-222227 = `L1i() !== "disabled"` (in-fork/sub-agent context); `UN()` @103400-103402 = `GCr.getStore() !== undefined` (inside an in-process subagent); `em()` @103466 (teammate context). So `zao` drops `run_in_background` when background tasks are disabled OR in a fork/sub-agent context.
3. The team-spawn route (`cqa`→`HDp`) and TaskUpdate's `$A` assignment mailbox belong to the agent-teams subsystem (see `35_*`/team docs); only the tool-side call sites are anchored here.
4. `zts()` (mode enum), `pDa` (name regex), `lza` (request-id regex), `Gtt` (valid-address list), `np` (team-lead address) are referenced helpers — anchored by use site, not defined here.
