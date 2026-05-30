# context: fork Self-Reinvoke Loop Fix: The `spawnedBySkill` Recursion Guard

> Covers the **2.1.145** changelog line: *"Fixed an infinite loop where a skill using context fork could repeatedly re-invoke itself."* This is the skill-system angle on a cross-cutting fix that also touches the subagent runner (`WS`) and the Skill-tool validator. Companion docs in this module: [skill_reload_midsession.md](./skill_reload_midsession.md) (the 2.1.152 reload delta), [bundled_skill_bodies.md](./bundled_skill_bodies.md); the foundational fork lifecycle (where forked skills come from) is the 2.1.142 reference [../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md), and `context: fork` parsing is at [../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_frontmatter.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_frontmatter.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skills, Hooks, Compact, Plan, CLI
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop, Tools, State, Subagent
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry, Prompt, MCP, Permissions
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands, UI, Plugin

Key symbols in this document:

- `SKILL_TOOL_NAME` (`ZX`) — the literal `"Skill"`; the tool the model calls to invoke a skill, and the constant interpolated into the block message (cli_inner_pretty.js:216282)
- `AGENT_TOOL_NAME` (`sq`) — the literal `"Agent"`; the generic subagent tool whose runner threads `spawnedBySkill` (cli_inner_pretty.js:185637)
- `skillToolValidateInput` (`jtH.validateInput`) — the Skill-tool gate chain that hosts the fork-recursion guard (cli_inner_pretty.js:350588-350665)
- `isSkillPendingMaterialization` (`J$4`) — identity check used by the not-materialized gate; true while a remote skill is still un-downloaded (cli_inner_pretty.js:350271-350273)
- `runForkedSkill` (the fork executor) — sets `spawnedBySkill: H.name` when launching the subagent (cli_inner_pretty.js:350417-350470)
- `runSlashCommandInline` (inline-skill path) — also sets `spawnedBySkill: H.name` for its agent spawn, and sets `q.options.activeSkill = H.name` (cli_inner_pretty.js:396081, 396618)
- `runSubagentQuery` (`WS`) — the universal subagent/query generator; receives `spawnedBySkill: f` and stores it on the child's `options.spawnedBySkill` (cli_inner_pretty.js:396794, 396803)
- `buildForkedSkillContext` (`D0$`) — turns the skill **body** into the subagent's prompt message (cli_inner_pretty.js:452910-452925)
- `logFeatureError` (`uH`) — emits `tengu_feature_bad` with `feature_name`/`error_code`; the guard calls it with `("skill_invoke","skill_invoke_fork_recursion")` (cli_inner_pretty.js:41593-41595)
- `logTelemetryEvent` (`d`) — emits the dedicated `tengu_skill_tool_fork_recursion_blocked` event (cli_inner_pretty.js:350625)
- `EFFORT_LEVELS` (`dN`) — `["low","medium","high","xhigh","max"]`; effort enum that gained `xhigh` in this window (cli_inner_pretty.js:185009)

---

## TL;DR

A `context: fork` skill runs by spawning a subagent whose **entire prompt is the skill body**. If that body re-invokes the same skill through the Skill tool, the runtime forks again — and again — into unbounded recursion. The 2.1.145 fix is a single **gate** inside the Skill-tool validator:

```
if  skill.type === "prompt"          // it is a real skill
&&  skill.context === "fork"          // it runs as a fork
&&  options.spawnedBySkill === skill.name   // I AM the subagent already running it
    → reject: result:false, errorCode:9
      + telemetry tengu_skill_tool_fork_recursion_blocked
      + message: "you are the subagent running it. Execute the body directly."
```

The load-bearing piece is the **`spawnedBySkill` field**: it is *set to the skill's name* at the two fork-launch sites (cli_inner_pretty.js:350466, 396081), *threaded onto the child's `options`* by the subagent runner `WS` (cli_inner_pretty.js:396803), *inherited* by any deeper subagent as `spawnedBySkill ?? activeSkill` (cli_inner_pretty.js:375253, 398607, 454273), and finally *read* by the guard (cli_inner_pretty.js:350622). It is a self-identifying breadcrumb the subagent carries about which skill it is executing.

**Cross-validation:** `context: fork` predates this window — it parses in 2.1.88 (`src/utils/frontmatterParser.ts:41-46`, `src/skills/loadSkillsDir.ts:260`). The `spawnedBySkill` field and the recursion guard do **not** exist in 2.1.88 (0 occurrences in `src/`); the 2.1.88 `SkillTool.validateInput` (`src/tools/SkillTool/SkillTool.ts:354-430`) has no fork-recursion gate at all. **This guard is NEW post-2.1.88. Confidence: high.**

---

## 1. The failure mode — why a fork can eat its own tail

### 1.1 How a forked skill actually runs

When the model calls the Skill tool on a skill whose frontmatter is `context: fork`, the runtime does **not** inline the body into the current conversation (that is the `inline` path). Instead it builds a fresh subagent context whose **prompt message is the skill body text**, then runs that subagent to completion and returns its result as the tool result.

```javascript
// ============================================
// buildForkedSkillContext - Renders the skill BODY into the forked subagent's prompt
// Location: cli_inner_pretty.js:452910-452925
// ============================================

// ORIGINAL (for source lookup):
async function D0$(H, $, q) {
  let _ = (await H.getPromptForCommand($, q)).map((D) => (D.type === "text" ? D.text : "")).join(`
`),
    z = IS(H.allowedTools ?? []),
    A = IS(H.disallowedTools ?? []),
    Y = tT4(q.getAppState, z, A),
    f = [ ...(z.length === 0 ? [] : [{ kind: "allowed_tools", allowedTools: z }]),
          ...(A.length === 0 ? [] : [{ kind: "disallowed_tools", disallowedTools: A }]) ],
    O = H.agent ?? "general-purpose",
    M = q.options.agentDefinitions.activeAgents,
    j = M.find((D) => D.agentType === O) ?? M.find((D) => D.agentType === "general-purpose") ?? M[0];
  if (!j) throw Error("No agent available for forked execution");
  let w = [T8({ content: _ })];
  return { skillContent: _, modifiedGetAppState: Y, contextLayers: f, baseAgent: j, promptMessages: w };
}

// READABLE (for understanding):
async function buildForkedSkillContext(skill, args, toolUseContext) {
  // Render the skill's body (after the 5-pass substitution pipeline) to plain text.
  const skillBodyText = (await skill.getPromptForCommand(args, toolUseContext))
    .map((part) => (part.type === "text" ? part.text : "")).join("\n");
  const allowed    = normalizeToolList(skill.allowedTools ?? []);
  const disallowed = normalizeToolList(skill.disallowedTools ?? []);
  const scopedGetAppState = wrapAppStateWithToolLayers(toolUseContext.getAppState, allowed, disallowed);
  const contextLayers = [
    ...(allowed.length    ? [{ kind: "allowed_tools",    allowedTools: allowed }]       : []),
    ...(disallowed.length ? [{ kind: "disallowed_tools", disallowedTools: disallowed }] : []),
  ];
  const agentType = skill.agent ?? "general-purpose";
  const agents = toolUseContext.options.agentDefinitions.activeAgents;
  const baseAgent = agents.find(a => a.agentType === agentType)
                 ?? agents.find(a => a.agentType === "general-purpose") ?? agents[0];
  if (!baseAgent) throw Error("No agent available for forked execution");
  // *** The skill body becomes the subagent's first (and only) user prompt ***
  const promptMessages = [makeUserMessage({ content: skillBodyText })];
  return { skillContent: skillBodyText, modifiedGetAppState: scopedGetAppState,
           contextLayers, baseAgent, promptMessages };
}

// Mapping: D0$→buildForkedSkillContext, H→skill, $→args, q→toolUseContext, _→skillBodyText,
//          IS→normalizeToolList, T8→makeUserMessage, w→promptMessages
```

The key line is `let w = [T8({ content: _ })]` — the skill body string `_` is wrapped as the subagent's prompt. The subagent then sees instructions like *"Review the diff, then call /code-review again on each file..."* as if a user typed them.

### 1.2 The recursion

Now imagine the skill body literally instructs the model to invoke the skill (deliberately, or because the body is phrased like a description that the model reads as a call-to-action). The subagent has the Skill tool available, so it calls `Skill(skill=self)`. Without a guard:

```
            (1) model calls Skill(simplify)            (2) fork: body becomes prompt
   parent ───────────────────────────────► runForkedSkill ──► WS(subagent A)
                                                                   │
                          subagent A's prompt = simplify body      │
                          body says "run simplify"                 ▼
                          (3) subagent A calls Skill(simplify) ──► runForkedSkill ──► WS(subagent B)
                                                                                          │
                                            subagent B's prompt = simplify body           ▼
                                            (4) subagent B calls Skill(simplify) ──► ... ∞
```

Each level allocates a fresh subagent, fresh token budget, fresh tool clients — an unbounded fan-out that exhausts context, money, and process handles. There is no natural base case because the prompt is identical at every level.

---

## 2. The fix — a self-identity gate inside the validator

### 2.1 The guard itself

The Skill-tool validator (`jtH.validateInput`) runs a chain of rejection gates before allowing a skill to execute. The 2.1.145 fix inserts a new gate that fires when the caller **is already the subagent running this exact skill in fork mode**.

```javascript
// ============================================
// skillToolValidateInput (fork-recursion gate) - Short-circuits a fork that re-invokes itself
// Location: cli_inner_pretty.js:350622-350631
// ============================================

// ORIGINAL (for source lookup):
if (f.type === "prompt" && f.context === "fork" && $.options.spawnedBySkill === f.name)
  return (
    uH("skill_invoke", "skill_invoke_fork_recursion"),
    d("tengu_skill_tool_fork_recursion_blocked", {}),
    {
      result: !1,
      message: `Skill ${_} is already executing in this forked context — you are the subagent running it. Execute the instructions in the skill body directly instead of re-invoking the ${ZX} tool.`,
      errorCode: 9,
    }
  );

// READABLE (for understanding):
if (skill.type === "prompt"
 && skill.context === "fork"
 && toolUseContext.options.spawnedBySkill === skill.name) {
  logFeatureError("skill_invoke", "skill_invoke_fork_recursion");          // tengu_feature_bad
  logTelemetryEvent("tengu_skill_tool_fork_recursion_blocked", {});         // dedicated event
  return {
    result: false,
    message: `Skill ${skillName} is already executing in this forked context — `
           + `you are the subagent running it. Execute the instructions in the skill body `
           + `directly instead of re-invoking the ${SKILL_TOOL_NAME} tool.`,
    errorCode: 9,
  };
}

// Mapping: f→skill, $→toolUseContext, _→skillName, ZX→SKILL_TOOL_NAME ("Skill"),
//          uH→logFeatureError, d→logTelemetryEvent
```

Three independent conditions must all hold:

1. **`skill.type === "prompt"`** — only real (prompt-backed) skills can fork; local-JSX/built-in commands cannot. This rules out false positives on UI commands.
2. **`skill.context === "fork"`** — the **inline** execution mode cannot recurse this way (inline bodies expand into the *parent's* conversation, not a new subagent), so only `fork` skills are gated.
3. **`options.spawnedBySkill === skill.name`** — the caller's `options.spawnedBySkill` field equals the skill it is trying to invoke. This is true exactly when the caller is the subagent that was spawned *to run this skill*.

When all three hold, the call is rejected with `result: false, errorCode: 9` and **two** telemetry signals fire: the generic `tengu_feature_bad` (via `logFeatureError`/`uH`, cli_inner_pretty.js:41593-41595, tagged `error_code: "skill_invoke_fork_recursion"`) and the dedicated `tengu_skill_tool_fork_recursion_blocked` event (via `logTelemetryEvent`/`d`, cli_inner_pretty.js:350625). The dedicated event is registered in `assets/feature_gates.json:980` and appears exactly **once** in the bundle, so it is unambiguous.

> **Note on `errorCode: 9`:** error codes are scoped per-validator, not global. The value `9` is reused by the NotebookEdit tool for "file not read yet" (cli_inner_pretty.js:348486) and by the team-messaging tools (cli_inner_pretty.js:406650, 407491). Within the Skill-tool validator, `9` means "fork recursion blocked." Do not treat the number as a globally unique identifier.

### 2.2 The message is the clever part

The block does not just fail — it **re-routes the subagent's behavior**. The message tells the model: *"you ARE the subagent running it. Execute the instructions in the skill body directly instead of re-invoking the Skill tool."*

This matters because the subagent's prompt *is* the skill body. The body already contains the instructions; the model does not need to "load" the skill — it is *inside* the skill. By telling the model to execute the body directly, the fix converts a fatal recursion into a no-op that nudges the model back onto the intended path. Without this guidance the model might retry the tool, loop on the same error, and waste turns.

---

## 3. The `spawnedBySkill` breadcrumb — set, thread, inherit, read

The whole fix hinges on one field. Trace its lifecycle.

### 3.1 SET — at fork launch

When `runForkedSkill` (the fork executor, cli_inner_pretty.js:350417-350470) spawns the subagent, it tags the call with the skill's own name:

```javascript
// ============================================
// runForkedSkill - Launches the fork subagent, tagging it with spawnedBySkill = skill name
// Location: cli_inner_pretty.js:350443-350470
// ============================================

// ORIGINAL (for source lookup):
let { modifiedGetAppState: L, contextLayers: P, baseAgent: Z, promptMessages: W, skillContent: G } = await D0$(H, q || "", K),
  V = H.getEffort?.(q || "") ?? H.effort,
  v = V !== void 0 ? { ...Z, effort: V } : Z;
N(`SkillTool executing forked skill ${$} with agent ${v.agentType}`);
for await (let I of WS({
  agentDefinition: v,
  promptMessages: W,
  toolUseContext: { ...K, getAppState: L, permissionLayers: P.length > 0 ? [...(K.permissionLayers ?? []), ...P] : K.permissionLayers },
  canUseTool: _,
  isAsync: !1,
  querySource: "agent:custom",
  spawnedBySkill: H.name,         // <-- the breadcrumb
  model: H.model,
  availableTools: K.options.tools,
  override: { agentId: f },
})) { /* ... collect subagent output ... */ }

// READABLE (for understanding):
const { modifiedGetAppState, contextLayers, baseAgent, promptMessages, skillContent } =
  await buildForkedSkillContext(skill, args ?? "", toolUseContext);
const effort = skill.getEffort?.(args ?? "") ?? skill.effort;
const agentDef = effort !== undefined ? { ...baseAgent, effort } : baseAgent;
log(`SkillTool executing forked skill ${skillName} with agent ${agentDef.agentType}`);
for await (const event of runSubagentQuery({
  agentDefinition: agentDef,
  promptMessages,                                        // = [skill body]
  toolUseContext: { ...toolUseContext, getAppState: modifiedGetAppState, permissionLayers: ... },
  canUseTool,
  isAsync: false,
  querySource: "agent:custom",
  spawnedBySkill: skill.name,                            // <-- self-identifying tag
  model: skill.model,
  availableTools: toolUseContext.options.tools,
  override: { agentId },
})) { /* ... */ }

// Mapping: D0$→buildForkedSkillContext, WS→runSubagentQuery, H→skill, $→skillName, K→toolUseContext,
//          W→promptMessages, H.name→skill.name
```

The inline-skill agent-spawn path does the same thing at cli_inner_pretty.js:396081 (`spawnedBySkill: H.name`), so the breadcrumb is present whether the skill was entered inline-with-agent or as a pure fork.

### 3.2 THREAD — onto the child's `options`

`runSubagentQuery` (`WS`, the universal subagent/query generator, cli_inner_pretty.js:396794) destructures the incoming `spawnedBySkill: f` (cli_inner_pretty.js:396803) and stores it on the **child's** `options` object that the subagent will see:

```javascript
// ============================================
// runSubagentQuery - Stores spawnedBySkill on the child's options so the guard can read it
// Location: cli_inner_pretty.js:396794-396803, 396941
// ============================================

// ORIGINAL (for source lookup):
async function* WS({ agentDefinition: H, promptMessages: $, toolUseContext: q, canUseTool: K, isAsync: _,
  /* ... */ querySource: Y, spawnedBySkill: f, override: O, model: M, /* ... */ }) {
  /* ... */
  let K$ = {
    /* ... */
    spawnedBySkill: f,            // <-- child options carries it forward
    tools: dH,
    /* ... */
  };
  /* ... */
}

// READABLE (for understanding):
async function* runSubagentQuery({ agentDefinition, promptMessages, toolUseContext, canUseTool, isAsync,
  querySource, spawnedBySkill, override, model, /* ... */ }) {
  // ...
  const childOptions = {
    // ...
    spawnedBySkill,              // child sees options.spawnedBySkill = the skill that forked it
    tools: resolvedTools,
    // ...
  };
  // ... drive the child agent loop with childOptions ...
}

// Mapping: WS→runSubagentQuery, f→spawnedBySkill, K$→childOptions, dH→resolvedTools
```

This is the closing of the loop: the subagent's `toolUseContext.options.spawnedBySkill` is now the skill name. When that subagent's model calls the Skill tool, the validator reads `$.options.spawnedBySkill` and the guard's third condition can fire.

### 3.3 INHERIT — `spawnedBySkill ?? activeSkill`

A forked skill might itself spawn *further* subagents (e.g. `/simplify` spawns review agents). Those deeper spawns must keep carrying the breadcrumb, otherwise a grandchild re-invoking the skill would slip through. Three subagent-spawn sites therefore propagate it with the same fallback expression:

```javascript
// ============================================
// spawnedBySkill inheritance - Deeper subagents inherit spawnedBySkill or fall back to activeSkill
// Location: cli_inner_pretty.js:375253, 398607, 454273
// ============================================

// ORIGINAL (for source lookup):
spawnedBySkill: S.options.spawnedBySkill ?? S.options.activeSkill,   // cli_inner_pretty.js:375253
spawnedBySkill: M.options.spawnedBySkill ?? M.options.activeSkill,   // cli_inner_pretty.js:398607
spawnedBySkill: $.options.spawnedBySkill ?? $.options.activeSkill,   // cli_inner_pretty.js:454273

// READABLE (for understanding):
spawnedBySkill: parentContext.options.spawnedBySkill ?? parentContext.options.activeSkill,

// Mapping: S/M/$→parentContext, .options.spawnedBySkill→inherited tag, .options.activeSkill→inline fallback
```

The `?? activeSkill` fallback closes a coverage gap. `activeSkill` is set when a skill executes **inline** (not as a fork): `q.options.activeSkill = H.name` at cli_inner_pretty.js:396618. So if a skill ran inline (no `spawnedBySkill` tag) and *then* spawned a subagent, that subagent still inherits the active skill's name via the fallback. The net effect: any subagent in a skill-rooted spawn tree knows which skill it descends from, regardless of whether the root entered via fork or inline.

```javascript
// ============================================
// runSlashCommandInline (activeSkill set) - Inline skill records itself so spawns can inherit
// Location: cli_inner_pretty.js:396618
// ============================================

// ORIGINAL (for source lookup):
(U7$(H.name, O, M, $D()?.agentId ?? null), (q.options.activeSkill = H.name));

// READABLE (for understanding):
recordSkillActivation(skill.name, sourceLabel, bodyText, currentAgentId());
toolUseContext.options.activeSkill = skill.name;   // inline fallback for the inheritance chain

// Mapping: H.name→skill.name, q.options.activeSkill→toolUseContext.options.activeSkill
```

### 3.4 READ — by the guard

Finally, back at cli_inner_pretty.js:350622, the validator reads `$.options.spawnedBySkill` and compares it to the skill being invoked. The full round trip:

```
 set      runForkedSkill / inline-spawn      spawnedBySkill = skill.name   (350466 / 396081)
   │
 thread   runSubagentQuery (WS)              child.options.spawnedBySkill = f   (396803)
   │
 inherit  deeper subagent spawns             spawnedBySkill ?? activeSkill   (375253 / 398607 / 454273)
   │
 read     skillToolValidateInput             if options.spawnedBySkill === skill.name → BLOCK   (350622)
```

---

## 4. Gate ordering in the Skill-tool validator

The fork-recursion gate is **position 3** in a chain of six rejection checks. Order matters: cheaper / more-fundamental checks run first, and a skill must survive every earlier gate to reach the next. The chain (cli_inner_pretty.js:350608-350660):

```
┌─ Gate 0  empty name             errorCode 1   (350590-350593, before lookup)
│           trimmed name is "" → "Invalid skill format"
│
├─ Gate 1  NOT MATERIALIZED       errorCode 10  (350606-350609)
│           z !== undefined && (!found || isSkillPendingMaterialization(found))
│           remote skill failed to download → "could not be downloaded ... Proceed without it"
│
├─ Gate 2  NOT FOUND              errorCode 2   (350611-350620)
│           !found → fuzzy "Did you mean X?" via edit-distance ≤ 2
│
├─ Gate 3  FORK RECURSION   ★NEW  errorCode 9   (350622-350631)
│           type==="prompt" && context==="fork" && options.spawnedBySkill === name
│           → tengu_skill_tool_fork_recursion_blocked
│
├─ Gate 4  DISABLE MODEL INVOC.   errorCode 4   (350632-350640)
│           found.disableModelInvocation && !userInvoked → "cannot be used ... due to disable-model-invocation"
│
├─ Gate 5  ALLOWLIST              errorCode 8   (350641-350646)
│           sessionAllowlist set && skill not in it → "not in this session's skills allowlist"
│
├─ Gate 6  OVERRIDE DISABLED      errorCode 7   (350646-350655)
│           override "off" || ("user-invocable-only" && !userInvoked) → "disabled ... in skillOverrides"
│
└─ Gate 7  NOT PROMPT TYPE        errorCode 5   (350656-350665)
            type !== "prompt" → "is a UI/built-in CLI command ... cannot be invoked via the Skill tool"
            ↓
          result: true  → skill is allowed to execute
```

### Why this position?

- **After not-found (Gate 2):** the guard dereferences `found.type`, `found.context`, and `found.name`. The skill must exist first. Placing the guard after the existence check avoids a null dereference and keeps the gate's three conditions short-circuit-safe.
- **Before disable-model-invocation / allowlist / override (Gates 4-6):** those gates concern *policy* (is the model allowed to use this skill?). A fork re-invoking itself is a *structural* error that should fire regardless of policy — even an allowlisted, model-invocable skill must not recurse. Putting the structural guard first means the recursion is caught before any policy decision could accidentally pass it.
- **The `not-materialized` (Gate 1, errorCode 10) gate** runs first because materialization is about *remote skill download state*, established earlier in the function (`z` holds a download-failure reason). A skill that could not even be downloaded should fail fast before any structural reasoning.

`isSkillPendingMaterialization` (`J$4`) is the predicate behind Gate 1 (cli_inner_pretty.js:350271-350273): it returns `true` while a remote skill's name is still keyed to a placeholder in the `uhH` materialization map, meaning the real body has not arrived yet.

---

## 5. Defense in depth — the prompt-level rule

The runtime guard is the *hard* stop. There is also a *soft* instruction baked into the Skill tool's own prompt that tries to prevent the model from re-invoking a running skill in the first place. Inside the Skill-tool usage rules (cli_inner_pretty.js:236805-236813):

```
Important:
- Available skills are listed in system-reminder messages in the conversation
- Only invoke a skill that appears in that list ...
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Do not invoke a skill that is already running          ← cli_inner_pretty.js:236811
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <system-reminder> tag ... the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
```

The bullet *"Do not invoke a skill that is already running"* (cli_inner_pretty.js:236811) is the prose statement of the same invariant the guard enforces. Note the last bullet's phrasing — *"follow the instructions directly instead of calling this tool again"* — mirrors the runtime block message word-for-word in intent. The two layers reinforce each other:

- **Prompt rule (236811):** best-effort, advisory. The model *should* not re-invoke. But a fork's prompt is the skill body, and a poorly worded body can override the system prompt's guidance.
- **Runtime guard (350622):** authoritative. Even if the model ignores the prompt rule, the validator rejects the call deterministically. This is why a soft prompt rule alone was insufficient and the 2.1.145 hard guard was needed.

---

## 6. End-to-end picture

```
                              ┌─────────────────────────────────────────────┐
   user / model invokes       │  Skill tool (ZX = "Skill", 216282)           │
   /simplify  (context:fork)  │  validateInput gate chain (350590-350660)    │
            │                 │   ... Gate 3 fork-recursion: spawnedBySkill?  │
            ▼                 └─────────────────────────────────────────────┘
   runForkedSkill (350417)            spawnedBySkill UNSET on parent → passes Gate 3
            │  buildForkedSkillContext (D0$ 452910): promptMessages = [skill body]
            │  spawnedBySkill: "simplify"  (350466)
            ▼
   runSubagentQuery WS (396794)        child.options.spawnedBySkill = "simplify"  (396803)
            │
            ▼
   ┌──── SUBAGENT (prompt = simplify body) ────┐
   │ model reads body, decides to call          │
   │ Skill("simplify") again                    │
   │            │                               │
   │            ▼                               │
   │   Skill tool validateInput (350590)        │
   │   Gate 3 (350622):                         │
   │     type==="prompt"      ✓                 │
   │     context==="fork"     ✓                 │
   │     options.spawnedBySkill==="simplify" ✓  │   ← breadcrumb matches!
   │            │                               │
   │            ▼  BLOCKED                       │
   │   result:false  errorCode:9                │
   │   tengu_skill_tool_fork_recursion_blocked  │
   │   "you ARE the subagent running it.        │
   │    Execute the body directly."             │
   └────────────────────────────────────────────┘
            │
            ▼
   subagent executes the body's instructions inline (no further fork) → loop broken
```

---

## 7. Cross-validation against 2.1.88

### 7.1 `context: fork` is a precursor (high confidence)

The fork execution context is parsed identically in 2.1.88. The frontmatter typing (`src/utils/frontmatterParser.ts:41-46`):

```typescript
// Execution context for skills: 'inline' (default) or 'fork' (run as sub-agent)
// 'inline' = skill content expands into the current conversation
// 'fork' = skill runs in a sub-agent with separate context and token budget
context?: 'inline' | 'fork' | null
// Agent type to use when forked (e.g., 'Bash', 'general-purpose')
agent?: string | null
```

and the loader mapping (`src/skills/loadSkillsDir.ts:260`):

```typescript
executionContext: frontmatter.context === 'fork' ? 'fork' : undefined,
```

The 2.1.156 bundle keeps the same `context === "fork"` semantics and the same "run as sub-agent with separate token budget" behavior (the `D0$` body-as-prompt mechanism). So the **feature** is not new.

### 7.2 The guard and `spawnedBySkill` are NEW (high confidence)

Two independent grep checks confirm the guard did not exist before this window:

- `grep -rn "spawnedBySkill" src/` → **0 results** in 2.1.88. The breadcrumb field is new.
- `grep -rn "fork_recursion" src/` → **0 results** in 2.1.88. The telemetry event is new.

More tellingly, the 2.1.88 `SkillTool.validateInput` (`src/tools/SkillTool/SkillTool.ts:354-430`) implements its gate chain as: empty-name (errorCode 1) → remote-not-discovered (errorCode 6) → not-found (errorCode 2) → disable-model-invocation (errorCode 4) → not-prompt-type (errorCode 5). There is **no fork-recursion gate, no allowlist gate (errorCode 8), no override gate (errorCode 7), and no not-materialized gate (errorCode 10)** between not-found and disable-model-invocation. And `src/tools/SkillTool/SkillTool.ts:622` runs forked skills with `command?.type === 'prompt' && command.context === 'fork'` — but with no concept of a subagent knowing which skill spawned it.

In other words, **2.1.88 shipped the exact vulnerable code path** (fork body → subagent prompt → subagent can call Skill again) **with no guard**. The infinite loop was latent. The 2.1.145 fix is precisely: (a) introduce `spawnedBySkill`, (b) thread it through `WS` and inheritance, (c) add Gate 3. Confidence: **high** that this is genuinely new post-2.1.88, grounded in direct source comparison.

> The new error codes 7, 8, 9, 10 (override, allowlist, fork-recursion, not-materialized) all landed in the 2.1.113–156 era as the skill system grew remote skills, session allowlists, and skill overrides; the fork-recursion code (9) is the 2.1.145 contribution analyzed here.

---

## 8. Key insight

The elegance of the fix is that it **reuses the subagent's own identity as the loop counter**. There is no recursion-depth integer, no per-skill visited-set, no global lock. Instead, the runtime tags each forked subagent with the *name of the skill it is executing* (`spawnedBySkill`), threads that tag through the universal subagent runner, and lets any deeper subagent inherit it (`spawnedBySkill ?? activeSkill`). The base case is then a single equality check: *"am I being asked to run the skill I already am?"* If yes, refuse and tell the model it is already inside the skill body.

This is strictly stronger than a depth limit (which would still allow N levels of pointless forking before failing) and cheaper than tracking a visited-set across the agent tree. It catches the recursion at depth 1 — the very first self re-invocation — and converts the failure into a productive nudge (*execute the body directly*) rather than a dead-end error. The cost is one field plumbed through the subagent spawn path and one three-condition gate; the benefit is a deterministic, depth-0 stop for an otherwise unbounded fan-out.
