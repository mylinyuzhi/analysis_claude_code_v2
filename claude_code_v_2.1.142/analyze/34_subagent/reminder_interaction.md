# Subagent Reminder Interactions — Attachment & System-Reminder Path (v2.1.142)

## What This Document Covers

A subagent receives information from the surrounding system through **three distinct channels**:

1. **The agent's system prompt** (built once at spawn from `getSystemPrompt` + env enhancements).
2. **The agent's user-message attachments** — `hook_additional_context`, `skill_listing`, `agent_listing_delta`, `critical_system_reminder`, `output_style` reminders, `agent_mention` reminders, `mcp_instructions_delta`, etc.
3. **Tool results** — the natural output of tool calls.

This document maps the **attachment/reminder channel**: how each kind of injection reaches the subagent, who emits it, when it appears, and what visible text the model sees. The path from "the runtime decides to inject context X" to "X appears as a `<system-reminder>` in the subagent's user message" runs through `normalizeAttachmentForAPI` (`Tt_`, cli_inner_pretty.js:425165+) and `createAttachmentMessage` (`fK`, cli_inner_pretty.js:391851 invoked from elsewhere).

For the broader reminder subsystem (not subagent-specific), see [41_system_reminder/](../41_system_reminder/).

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_additions_v2_1_142_system_reminder.md](../00_overview/symbol_additions_v2_1_142_system_reminder.md) - reminder system
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Skills)

Key functions in this document:
- `AMH` (`computeAttachmentsForSubagent`) - composes the attachment list at runAgent setup (cli_inner_pretty.js:393234)
- `mQH` (`computeAgentListingDelta`) - emits `agent_listing_delta` when CLAUDE_CODE_AGENT_LIST_IN_MESSAGES is on (cli_inner_pretty.js:397839-397875)
- `Ty6` (`computeSkillListingAttachment`) - emits `skill_listing` for the subagent's Skill tool (cli_inner_pretty.js:398336-398366)
- `s65` (`computeCriticalSystemReminder`) - emits `critical_system_reminder` from agent.criticalSystemReminder_EXPERIMENTAL (cli_inner_pretty.js:397884-397888)
- `gw6` (`isAgentListAttachEnabled`) - the env/flag gate for agent_listing_delta (cli_inner_pretty.js:235531-235535)
- `QL$` (`executeSubagentStartHooks`) - SubagentStart hook runner (cli_inner_pretty.js:520054-520057)
- `eo7` (`registerFrontmatterHooks`) - register subagent frontmatter hooks (cli_inner_pretty.js:393014)
- `aP` (`dispatchHook`) - per-hook executor with v2.1.142 prompt/agent-type validation (cli_inner_pretty.js:521329+)
- `Tt_` (`normalizeAttachmentForAPI`) - turns attachment objects into user messages (cli_inner_pretty.js:425165+)
- `fK` (`createAttachmentMessage`) - low-level attachment-to-message constructor
- `o_` - wraps a single message in a one-element array (used by the renderers)
- `w8` (`createUserMessage`) - the user message builder
- `Z$` (`getFeatureValue_CACHED_MAY_BE_STALE`) - GrowthBook gate reader

## High-Level Flow

```
                                  ┌─────────────────────────────────┐
                                  │      subagent starts             │
                                  │   (runAgent / Vb at 393099)      │
                                  └────────────────┬────────────────┘
                                                   │
                                                   ▼
              ┌────────────────────────────────────────────────────────────────────┐
              │                       Setup phase attachment fan-in                 │
              │  ── SubagentStart hooks (QL$, line 393187) ──→ hook_additional_context│
              │  ── if (!useExactTools): AMH(...) (line 393234)                      │
              │       └── computes [skill_listing, agent_listing_delta, ...]         │
              │       └── each calls fK(...) → push attachment into messages         │
              │  ── if (!hasSkillListing): Ty6(WH) (line 393281)                     │
              │       └── computes skill_listing for skill tool, pushes attachment   │
              └──────────────────────────────────────┬──────────────────────────────┘
                                                     │
                                                     ▼
                            messages array now contains:
                            [parentContext..., prompt, attachments...]
                                                     │
                                                     ▼
                                  ┌─────────────────────────────────┐
                                  │   API request build              │
                                  │   normalizeAttachmentForAPI (Tt_)│
                                  │   converts each attachment       │
                                  │   into a real user message       │
                                  │   the model can read              │
                                  └────────────────┬────────────────┘
                                                   │
                                                   ▼
                              [the subagent's first LLM turn]
                              model sees as user-role messages:
                              - "<system-reminder>SubagentStart hooks ran..."
                              - "<system-reminder>Available agent types..."
                              - "<system-reminder>The following skills are available..."
                              - "<system-reminder>CRITICAL: This is a VERIFICATION-ONLY task..."
                              - the user's actual prompt
```

The model treats each `<system-reminder>` block as ambient context: not a turn the user typed, but state the runtime is feeding in. The `system-reminder` tag is **purely textual** — there's no special API mode; the model is trained to recognize the tag pattern.

## Channel 1: `SubagentStart` Hook `additional_context`

### The injection site (cli_inner_pretty.js:393187-393198)

```javascript
let vH = override?.abortController ? ... : (isAsync ? new AbortController() : q.abortController),
  JH = [];
for await (let $$ of QL$(u, H.agentType, vH.signal, void 0, q.getAppState))
  if ($$.additionalContexts && $$.additionalContexts.length > 0) JH.push(...$$.additionalContexts);
if (JH.length > 0) {
  let $$ = fK({
    type: "hook_additional_context",
    content: JH,
    hookName: "SubagentStart",
    toolUseID: Gy6.randomUUID(),
    hookEvent: "SubagentStart",
  });
  x.push($$);
}
```

`QL$` (`executeSubagentStartHooks`) iterates every registered `SubagentStart` hook. Each hook can output `additional_context` strings (via stdout JSON `{"hookSpecificOutput": {"additionalContext": "..."}}`). These are collected and packed into a single `hook_additional_context` attachment.

### Where it lands in the API request

The attachment is rendered by `normalizeAttachmentForAPI`. Looking at the rendering site at cli_inner_pretty.js:425165+:

```javascript
case "hook_additional_context": {
  let q = H.content.join("\n");
  return o_([
    w8({
      content: `<system-reminder>Hook ${H.hookName} (${H.hookEvent}) added the following context:\n\n${q}</system-reminder>`,
      isMeta: !0,
    }),
  ]);
}
```

(approximate; exact format may vary in v2.1.142 minified source).

What the model sees:

```
<system-reminder>Hook on-subagent-start (SubagentStart) added the following context:

[the script's stdout content]
</system-reminder>
```

### Use case

A `SubagentStart` command-type hook with a `matcher: "code-reviewer"` could inject:
- Project-specific style guide.
- The current PR's diff.
- Linting baseline.

The hook script reads its stdin JSON (with `agent_id`, `agent_type`, `session_id`), decides what to inject, and outputs JSON with `additionalContext`. The agent's first turn sees this content as the FIRST message after the parent's prompt.

See [hook_inheritance.md](./hook_inheritance.md) for the full hook event matrix.

### The v2.1.142 validation guard

For prompt-type and agent-type hooks on `SubagentStart` events, v2.1.142 introduced a runtime error: *"prompt-type hooks are not supported for SubagentStart events (no conversation context is available). Use a command-type hook instead."*

`SubagentStart` fires before any conversation context exists in the subagent — there's no user turn yet. Prompt-type hooks try to inject text into "the next user message" but there is no next user message in a meaningful sense; the spawn's `prompt` is already fixed. Agent-type hooks spawn verifier subagents to review something, but at SubagentStart, there's nothing to review. Hence the rejection at dispatch time.

## Channel 2: `agent_listing_delta` System Reminder

### The gate: `gw6` / `tengu_agent_list_attach`

```javascript
// cli_inner_pretty.js:235531-235535
function gw6() {
  if (bH(process.env.CLAUDE_CODE_AGENT_LIST_IN_MESSAGES)) return !0;
  if (E4(process.env.CLAUDE_CODE_AGENT_LIST_IN_MESSAGES)) return !1;
  return Z$("tengu_agent_list_attach", !1);
}
```

Two predicate orders:
1. **Env truthy** (`CLAUDE_CODE_AGENT_LIST_IN_MESSAGES=1`) → enable.
2. **Env explicit-falsy** (`CLAUDE_CODE_AGENT_LIST_IN_MESSAGES=0`) → disable, ignore GrowthBook.
3. **Default**: GrowthBook flag `tengu_agent_list_attach` (defaults to false).

When enabled, the Agent tool's prompt no longer enumerates available agents in the system prompt. Instead, the same listing is sent as a **system-reminder message attachment** that updates incrementally as the agent set changes mid-session.

### The Agent tool prompt branch

```javascript
// cli_inner_pretty.js:235638-235642 (from eq7, the Agent tool prompt builder)
let M = gw6(),
  w = LY($),
  D = M
    ? "Available agent types are listed in <system-reminder> messages in the conversation."
    : `Available agent types and the tools they have access to:\n${_.map((Z) => Fw6(Z, w)).join(`\n`)}`;
```

When `gw6()` is true: the system prompt says "look at the system reminders" — the actual list isn't there.

When false: the system prompt enumerates each agent with `- agentType: whenToUse (Tools: <tools>)`.

### The delta computer: `mQH`

```javascript
// cli_inner_pretty.js:397839-397875
function mQH(H, $) {
  if (!gw6()) return [];
  if (!H.options.tools.some((D) => G1(D, D7))) return [];   // Agent tool not in pool
  let { activeAgents: q, allowedAgentTypes: K } = H.options.agentDefinitions,
    _ = new Set();
  for (let D of H.options.tools) {                          // collect MCP tool servers
    let j = n7H(D);
    if (j) _.add(j);
  }
  let A = H.getToolPermissionContext(),
    z = GnH(s3$(q, [..._]), A, D7);                          // filter by MCP requirements + permission
  if (K) z = z.filter((D) => K.includes(D.agentType));       // filter by allowedAgentTypes
  let Y = new Set();
  for (let D of $ ?? []) {                                   // walk prior attachments
    if (D.type !== "attachment") continue;
    if (D.attachment.type !== "agent_listing_delta") continue;
    for (let j of D.attachment.addedTypes) Y.add(j);
    for (let j of D.attachment.removedTypes) Y.delete(j);
  }
  let f = new Set(z.map((D) => D.agentType)),
    O = z.filter((D) => !Y.has(D.agentType)),                // not yet announced → add
    M = [];
  for (let D of Y) if (!f.has(D)) M.push(D);                // previously announced, no longer present → remove
  if (O.length === 0 && M.length === 0) return [];
  (O.sort(...), M.sort());
  let w = LY(H.options.mainLoopModel);
  return [{
    type: "agent_listing_delta",
    addedTypes: O.map((D) => D.agentType),
    addedLines: O.map((D) => Fw6(D, w)),                     // pre-rendered "- name: whenToUse (Tools: ...)"
    removedTypes: M,
    isInitial: Y.size === 0,
    showConcurrencyNote: K4() !== "pro",
  }];
}
```

The differential structure:
- Walk prior `agent_listing_delta` attachments in the message history.
- Compute "what's been announced so far" set `Y`.
- Compute "what's currently active and permitted" set `z`.
- Diff: added = z - Y, removed = Y - z.
- Return new delta attachment only if there's actually a change.

This **incremental update** lets a long-running session avoid re-sending the full agent list on every turn; only changes (new plugin installed, agent revoked by policy) trigger an update.

### The rendered output: `Tt_` for `agent_listing_delta`

```javascript
// cli_inner_pretty.js:425242-425268
case "agent_listing_delta": {
  let q = [];
  if (H.addedLines.length > 0) {
    let K = H.isInitial
      ? "Available agent types for the Agent tool:"
      : "New agent types are now available for the Agent tool:";
    q.push(`${K}\n${H.addedLines.join(`\n`)}`);
  }
  if (H.removedTypes.length > 0)
    q.push(`The following agent types are no longer available:\n${H.removedTypes.map((K) => `- ${K}`).join(`\n`)}`);
  if (H.isInitial && H.showConcurrencyNote)
    q.push("When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently.");
  return o_([
    w8({ content: q.join(`\n\n`), isMeta: !0 }),
  ]);
}
```

A subagent that's allowed to spawn further subagents (Agent tool in its pool) sees, in its first user-role message:

```
<system-reminder>
Available agent types for the Agent tool:
- general-purpose: General-purpose agent for researching... (Tools: All tools)
- Explore: Read-only search agent for broad fan-out searches... (Tools: All tools except Agent, Edit, Write, ExitPlanMode, NotebookEdit)
- Plan: Software architect agent for designing implementation plans... (Tools: ...)
...

When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently.
</system-reminder>
```

(The `<system-reminder>` wrapper comes from `w8(...)` + `isMeta: !0` — the meta flag tells the renderer to wrap the content in a system-reminder tag at API send time.)

### Why incremental? Why a reminder, not the prompt?

The Agent tool's prompt itself is **cached as part of the system prompt's tool definitions**. If the agent list were in the prompt, every plugin install/uninstall during a session would bust the cache. With the listing as an *attachment* in the messages array, the prompt stays stable; only the messages array (which isn't cached as aggressively) carries the delta.

This is the same caching argument as the fork-subagent path (see [fork_lifecycle.md](./fork_lifecycle.md)): preserve the cache prefix; put dynamic content in the user messages.

### Which subagents see this?

Only subagents whose tool pool includes the Agent tool (`H.options.tools.some(...) === true`). Read-only agents like Explore and Plan don't get this reminder — they can't spawn agents, so listing them is wasted tokens. Same for skill-fork subagents whose tool pool doesn't include Agent.

The check `!H.options.tools.some(...)` ensures the right audience only.

## Channel 3: `skill_listing` Attachment

### The two emission paths

`skill_listing` attachments come from two places in the subagent path:

1. **`AMH` at runAgent setup (line 393234)** — for non-fork subagents, scans the tool pool and emits initial attachments including a skill listing if the Skill tool is present.
2. **`Ty6` direct call at line 393281** — for any subagent that doesn't already have a `skill_listing` in its initial messages, compute one.

```javascript
// cli_inner_pretty.js:393279-393285
{
  let $$ = x.some((M$) => M$.type === "attachment" && M$.attachment.type === "skill_listing"),
    G$ = await Ty6(WH).catch((M$) => {
      return (N(`[Agent: ${H.agentType}] Failed to compute skill listing attachment: ${M$}`, { level: "error" }), []);
    });
  if (!$$) for (let M$ of G$) x.push(fK(M$));
}
```

The check `$$` prevents duplicate skill listings — if `AMH` already emitted one, skip the `Ty6` push.

### The computer: `Ty6`

```javascript
// cli_inner_pretty.js:398336-398366
async function Ty6(H) {
  if (x65?.isSkillsAsToolsEnabled()) return [];           // alt-mode: skills are tools, no listing
  if (!H.options.tools.some((w) => G1(w, fX))) return []; // Skill tool not in pool
  let $ = R9(), q = await gZ($),                          // all skills from disk
    K = qM8(H.getMcp().commands),                         // MCP-provided skills
    _ = K.length > 0 ? D9H(cw([...q, ...K], "name")) : q;
  if (H.agentId === void 0) _ = Q7H(_, Np());            // main loop only: append session-skill overlay
  let A = H.agentId ?? "",
    z = tO8.get(A);
  if (!z) ((z = new Set()), tO8.set(A, z));               // per-agent "already-sent" tracker
  if (eO8 && H.agentId === void 0) {                      // very-first call: seed without sending
    eO8 = !1;
    for (let w of _) z.add(w.name);
    return [];
  }
  let Y = _.filter((w) => !z.has(w.name));               // skills NOT yet sent to this agent
  if (Y.length === 0) return [];
  let f = z.size === 0;                                  // is this the first send?
  for (let w of Y) z.add(w.name);
  N(`Sending ${Y.length} skills via attachment (${f ? "initial" : "dynamic"}, ${z.size} total sent)`);
  let O = nJ(H.options.mainLoopModel, Tw());
  return [{
    type: "skill_listing",
    content: rM6(Y, O, (w) => l7H(w.name), sG(H.options.mainLoopModel)),
    skillCount: Y.length,
    isInitial: f,
  }];
}
```

Key behavior:

1. **Per-agent dedup set `z`** — each subagent gets its own "already-sent skills" set keyed by `agentId`. The first call for that agent sends *all* skills; subsequent calls send only new ones.
2. **Main-loop seeding (`eO8`)** — on the *very first* call from the main loop (`agentId === undefined`), seed the set without sending. Why? Because the main loop's system prompt already enumerates skills; sending them again would be duplicative. The seed marks "already known" without an injection.
3. **Per-agent independence** — two parallel subagents each start with `z = ∅` for their `agentId`. Both receive the full listing. They don't share state.

### The renderer

```javascript
// cli_inner_pretty.js:426148-426158
skill_listing: (H) => {
  if (!H.content) return [];
  return o_([
    w8({
      content: `The following skills are available for use with the Skill tool:\n\n${H.content}`,
      isMeta: !0,
    }),
  ]);
}
```

What the subagent sees:

```
<system-reminder>
The following skills are available for use with the Skill tool:

- code-review: Review code changes for issues (Effort: medium, Recent uses: 3)
- deploy: Run deploy.sh with safety checks (Effort: low, Recent uses: 7)
- ...
</system-reminder>
```

The renderer also handles the `isInitial: false` case slightly differently (the spinner-style "5 skills available" hint is displayed in the parent REPL via the `case "skill_listing"` branch at cli_inner_pretty.js:346964).

### Why incremental + per-agent dedup

Same reasoning as `agent_listing_delta`:
- Skills can be loaded mid-session (a plugin registers skills, a project skill file is added). Re-sending the full list would be cache-invalidating.
- Per-agent tracking means a long-running subagent doesn't keep re-receiving the same skills.

The mechanism is straightforward in spirit but encodes a real correctness property: **the model is told about each skill exactly once per agent**, with deltas for new additions.

## Channel 4: `critical_system_reminder` — Re-Injected on Every Turn

### The agent definition field

A subagent's frontmatter can include `criticalSystemReminder_EXPERIMENTAL: string`:

```yaml
---
name: verification
description: ...
criticalSystemReminder_EXPERIMENTAL: |
  CRITICAL: This is a VERIFICATION-ONLY task. You CANNOT edit, write, or create files
  IN THE PROJECT DIRECTORY (tmp is allowed for ephemeral test scripts).
  You MUST end with VERDICT: PASS, VERDICT: FAIL, or VERDICT: PARTIAL.
---
```

(In v2.1.88's TS source, this lived on the `verification` built-in agent. In v2.1.142's external bundle, the built-in is gone but the *runtime hook* for this field is still present — user agents can use it.)

### The injection mechanism

```javascript
// cli_inner_pretty.js:397884-397888
function s65(H) {
  let $ = H.criticalSystemReminder_EXPERIMENTAL;
  if (!$) return [];
  return [{ type: "critical_system_reminder", content: $ }];
}
```

This function is called on every **user turn** of the subagent (not just the first). The attachment is renewed each turn, so the model sees the reminder injected fresh into every assistant turn's context.

### The threading

`criticalSystemReminder_EXPERIMENTAL` is plumbed:
- From the agent definition into `createSubagentContext` (cli_inner_pretty.js:393275 → `zj6` invocation).
- Stored on the subagent's `toolUseContext.criticalSystemReminder_EXPERIMENTAL`.
- Read by `s65` whenever attachments are computed for a new user turn.

### Why "experimental"?

The `_EXPERIMENTAL` suffix flags that:
1. The implementation **bloats every API request** — the reminder adds tokens on every turn.
2. The semantics may change — Anthropic might pull the field, or change how reminders are formatted.
3. **Performance impact**: a long-running agent with a 500-token reminder pays 500 tokens × N turns. For N=50 (verification agent's typical lifetime), that's 25K extra tokens per spawn.

### Use case: drift prevention

The verification agent is the canonical use case. Over many turns of verification:
1. The model starts following the "VERDICT: PASS/FAIL/PARTIAL" rule.
2. By turn 30, it might "forget" and write a free-form result.
3. The re-injected reminder anchors it back to the rule.

Compare to the system prompt: the system prompt is only "in front of" the model once. Long contexts push it far away in attention. Per-turn reminders re-anchor the rule, fighting attention dilution.

### Visible text

The model sees, prepended to its incoming user message each turn:

```
<system-reminder>
CRITICAL: This is a VERIFICATION-ONLY task. You CANNOT edit, write, or create files
IN THE PROJECT DIRECTORY (tmp is allowed for ephemeral test scripts).
You MUST end with VERDICT: PASS, VERDICT: FAIL, or VERDICT: PARTIAL.
</system-reminder>
```

This is **identical wording** every turn — bytes are the same. The model gets to the verdict line because it sees the rule repeatedly stated as ambient context.

## Channel 5: `mcp_instructions_delta` — Per-MCP Server Instructions

When a subagent's MCP servers (frontmatter + inherited) provide their own `instructions` field, those are surfaced as delta attachments. See `BQH` at cli_inner_pretty.js:397876-397882 for the computer and case `mcp_instructions_delta` at 425269-425291 for the renderer.

Visible text:

```
<system-reminder>
# MCP Server Instructions

The following MCP servers have provided instructions for how to use their tools and resources:

[server X's instructions]

[server Y's instructions]
</system-reminder>
```

This lets MCP plugin authors provide model-readable usage notes (e.g. "always call tool A before tool B"). The subagent sees these alongside the tool definitions.

## Channel 6: `agent_mention` Reminder

When the user types `@code-reviewer` in their prompt, the parser detects the agent mention and pushes an `agent_mention` attachment:

```javascript
// cli_inner_pretty.js:426141-426147
agent_mention: (H) =>
  o_([
    w8({
      content: `The user has expressed a desire to invoke the agent "${H.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
      isMeta: !0,
    }),
  ]),
```

This goes to the **main loop**, not directly to a subagent. The main loop reads the reminder and decides whether to invoke the named agent. Once invoked, the subagent's first turn sees the parent's `prompt` (which the parent constructed from the user's text + the reminder's suggestion).

The reminder is NOT shown to the user — it's purely for model coordination.

## Channel 7: `output_style` Reminder

```javascript
// cli_inner_pretty.js:426159-426170 (approximate)
output_style: (H) => {
  let $ = MMH[H.style];
  if (!$) return [];
  return o_([
    w8({
      content: `${$.name} output style is active. ${H.turnReminder ?? "Remember to follow the specific guidelines for this style."}`,
      isMeta: !0,
    }),
  ]);
}
```

If the user has an output style active (e.g. "concise", "explanatory"), the subagent sees a reminder each turn. The `turnReminder` field on the style definition is the per-turn-redundant text (e.g. "Remember to keep responses to under 3 sentences").

This is similar to `criticalSystemReminder_EXPERIMENTAL` in structure (per-turn re-injection) but is session-scoped (style is global), not agent-scoped (reminder is per-definition).

## Channel 8: `selected_lines_in_ide` Reminder

For subagents spawned from an IDE session with selected lines, the runtime can inject:

```javascript
case "selected_lines_in_ide": {
  return [{
    type: "selected_lines_in_ide",
    ideName: ..., lineStart: ..., lineEnd: ...,
    filename: ..., content: ..., displayPath: ...,
  }];
}
```

The subagent sees the IDE-selected text as ambient context. Useful for "refactor what I selected" subagents.

## Channel 9: `nested_memory` (CLAUDE.md hierarchy)

For non-`omitClaudeMd` subagents, nested CLAUDE.md files in directories the agent is operating in are surfaced via `nested_memory` attachments. The renderer formats them as:

```
<system-reminder>
Nested CLAUDE.md found at <path>:

[content]
</system-reminder>
```

This is how a subagent operating in a deep subdirectory of a monorepo picks up the local CLAUDE.md (e.g. `packages/auth/CLAUDE.md`) without the parent having pre-loaded all of them.

## The `Ka7` Static System Prompt Fallback

If `agentDef.getSystemPrompt(...)` throws (e.g. bug in user-authored agent), `runAgent`'s setup uses a static fallback string at `buildSubagentSystemPrompt` (`d85`, cli_inner_pretty.js:393452-393460). This isn't a reminder per se but is the **default attachment-side context** for a failed agent build:

```javascript
async function d85(H, q, B, OH, DH) {
  try {
    return await HX$([H.getSystemPrompt({ toolUseContext: q })], B, OH);
  } catch (e) {
    return await HX$([Ka7], B, OH);   // ← static fallback
  }
}
```

`Ka7` is the generic "You are a subagent for Claude Code..." prompt. The agent runs but loses its custom behavior.

## How All Channels Interact in a New Subagent's First Turn

Walking through the setup phase of `runAgent` (Vb, cli_inner_pretty.js:393187+):

1. **Initial messages** = `[fork-context...] + [prompt]` (the parent's prompt).
2. **SubagentStart hooks fire**, possibly appending `hook_additional_context`.
3. **Frontmatter hooks register** (no immediate attachment).
4. **Frontmatter skill preload** runs, appending each preloaded skill as a meta user message (NOT a reminder).
5. **MCP servers init** (`g85`), but tool merging doesn't append attachments here.
6. **`AMH(nH, B, x, ...)`** at line 393234 computes initial attachments for non-fork subagents:
   - `agent_listing_delta` (if Agent tool present + `gw6()` true)
   - `mcp_instructions_delta` (if MCP servers provided instructions)
   - Other deltas as applicable
   - Each is `fK`-wrapped and pushed.
7. **`Ty6(WH)`** at line 393281 computes `skill_listing` (if Skill tool present and not already injected), pushed.
8. **Per-turn attachments** computed later by `mainAgentLoop` (`gC`) — `critical_system_reminder`, `output_style`, `thinking_reminder`, etc.

By the time the first API call goes out, the user-role messages contain (in order):
- Fork context (if forked)
- Preloaded skills as meta user messages
- `hook_additional_context` from SubagentStart
- Initial attachments (`agent_listing_delta`, `skill_listing`, `mcp_instructions_delta`)
- The parent's prompt text
- Per-turn reminders prepended into the first turn (`critical_system_reminder`, `output_style`)

The order matters for readability: hook context is grouped near the prompt (it's contextual to *this* spawn), while listings are "session-level" reminders that anchor at the start.

## Special Case: Fork Subagents Skip Most Reminders

```javascript
// cli_inner_pretty.js:393234
if (!P) for (let $$ of AMH(nH, B, x, { callSite: "attachments_subagent", querySource: Y })) x.push(fK($$));
```

The `!P` (not `useExactTools`) gate means **forks don't get AMH attachments**. Why? Because the fork must hand the LLM byte-identical input to the parent. Adding `agent_listing_delta` or `skill_listing` would diverge the cache prefix.

The fork inherits the *parent's* reminder posture: whatever the parent had at fork time, the fork sees in the inherited message history. Re-emitting fresh would risk subtle differences (e.g. plugin status changed in the moment between parent's last turn and fork's spawn).

The `skill_listing` push at line 393281 is also guarded — if the messages already contain one (which they will for a fork that's inheriting them), the push is skipped.

## Tool Result vs. Reminder: A Key Distinction

A subagent's *tool results* and a subagent's *reminders* look superficially similar — both are user-role messages with text content. But:

- **Tool results** follow `tool_use` blocks in assistant messages. They're explicit responses to the model's actions.
- **Reminders** come without a `tool_use` precedent. They're ambient state.

The model is trained to distinguish: tool_results inform "what happened when I did X", reminders inform "what's true right now". The `<system-reminder>` tag is the unambiguous marker.

Hooks can BLUR this distinction: a `PostToolUse` hook can inject a reminder *after* a tool call, formally as a follow-up message. This is the v2.1.139 `continueOnBlock` flag pattern — a hook's rejection text is fed back as the next user turn, looking like a `<system-reminder>` but causally tied to the tool call.

## Cross-Validation with v2.1.88

The `additionalContext` mechanism in `executeSubagentStartHooks` is identical in v2.1.88 (`src/utils/hooks.ts`). The `hook_additional_context` attachment type and renderer is present in both.

The `agent_listing_delta` attachment **and** the `tengu_agent_list_attach` GrowthBook gate + `CLAUDE_CODE_AGENT_LIST_IN_MESSAGES` env var are **already present in v2.1.88** (`src/tools/AgentTool/prompt.ts:60-63` for `shouldInjectAgentListInMessages`, and `src/utils/attachments.ts` for `getAgentListingDeltaAttachment`). The comment in v2.1.88's `prompt.ts` explains the motivation: *"The dynamic agent list was ~10.2% of fleet cache_creation tokens: MCP async connect, /reload-plugins, or permission-mode changes mutate the list → description changes → full tool-schema cache bust."* So the entire attachment-based listing mechanism predates v2.1.140.

What v2.1.140 actually added on top is the **`whenToUseLean` field** on `AgentDefinition` and the corresponding consultation in `Fw6` (`renderAgentForListing`): `K = ($ && H.whenToUseLean) || H.whenToUse;`. The `$` parameter is true when the listing is being rendered for an attachment context (where description budget is tighter). v2.1.88's `formatAgentLine(agent)` had no lean variant — it always used `whenToUse`. So v2.1.140's improvement is narrower than "added the attachment listing"; it added the *shorter description option* for that listing.

The `skill_listing` mechanism with per-agent `tO8` dedup is **v2.1.133+** alongside the unified `getSkillsFromAllSources` (see [skill_discovery_in_subagent.md](./skill_discovery_in_subagent.md)). v2.1.88 had `getSkillListingAttachments` but lacked the per-agent dedup tracking.

The `criticalSystemReminder_EXPERIMENTAL` field exists in v2.1.88 (on `verificationAgent.ts`). The runtime mechanism (per-turn re-injection via `s65`) is the same in both versions.

## Key Insight

Subagent reminders are **layered ambient context** that the runtime can inject without changing the agent's system prompt (preserving cache) and without making the agent re-call tools (preserving turn efficiency).

The layering:
- **Permanent (system prompt)**: the agent's identity, tool definitions, env details.
- **Per-spawn (initial attachments)**: hook context, skill listing, agent listing — set once at spawn, immutable for the agent's lifetime.
- **Per-turn (re-injected attachments)**: `critical_system_reminder`, `output_style` reminders — kept fresh against attention dilution.
- **Per-event (hook-driven)**: PreToolUse / PostToolUse hooks can inject ad-hoc reminders tied to specific tool actions.

The reminders are **invisible to the user** (they're stripped from the parent's REPL display) but **visible to the model** (as `<system-reminder>`-tagged user messages). The asymmetry is intentional: the user wants to see the agent's *output*, not the runtime's plumbing.

The single biggest property the reminder system preserves is **cache stability**. Every reminder design choice (delta vs full, per-agent dedup, fork-path skipping) is in service of "don't bust the prompt cache" — because Anthropic's prompt cache pricing makes that the single highest-impact lever for keeping subagent costs bounded.

The v2.1.142 enhancements (per-agent skill dedup, delta-based agent listing, prompt/agent-type hook validation for context-less events) are all about **tightening this contract**: less duplicate content, more incremental delivery, fewer paths that silently fail.
