# Subagent Hook Inheritance (v2.1.142)

## TL;DR

Subagents inherit hooks from two sources:

1. **Session hooks** — registered globally via `~/.claude/settings.json`'s `hooks:` field. These fire for every agent (main + subagents).
2. **Agent-frontmatter hooks** — registered when a subagent starts; scoped to that subagent only.

The 2.1.116 → 2.1.142 evolution closed three gaps:

| Version | Fix |
|---------|-----|
| **v2.1.116** | Agent frontmatter `hooks:` now fire when the agent runs as the **main thread** via `--agent` (previously only worked when the agent was dispatched as a subagent) |
| **v2.1.118** | Agent-type hooks for events other than `Stop` / `SubagentStop` no longer fail with "Messages are required for agent hooks" |
| **v2.1.142** | Configuring a prompt- or agent-type hook for `SessionStart` / `Setup` / `SubagentStart` now shows a clear "use a command-type hook instead" error |

Together: the same `hooks:` block in an agent's `.md` file works whether the agent is `--agent`-launched or Agent-tool-spawned, fires across the full hook event matrix, and rejects misconfigurations with helpful errors instead of silent failure.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks)

Key functions in this document:
- `registerFrontmatterHooks` (`eo7`) - attach frontmatter hooks to sessionHooksRegistry (cli_inner_pretty.js, called from 393200)
- `executeSubagentStartHooks` (`QL$`) - fire SubagentStart hooks; collect additional_context (cli_inner_pretty.js:520055)
- `executeSubagentStopHooks` (`S9H`) - fire SubagentStop in cleanup/finally (cli_inner_pretty.js, called from 393377)
- `setMainThreadAgentHooks` (`dv$`) - state setter for `--agent`-supplied hooks (cli_inner_pretty.js:3087-3090)
- `getMainThreadAgentHooks` (`kp`) - state getter (cli_inner_pretty.js:3083-3085)
- `isAgentTypeAdminTrusted` (`B7H`) - hook registration gate for plugin/policy agents (called from 393199)
- `isFeatureBypassed` (`DX`) - hook-kill-switch consulted by `B7H`

## The Two Hook Registries

```
                                       ┌─────────────────────┐
                                       │   global settings    │
                                       │  (~/.claude/         │
                                       │   settings.json)     │
                                       └──────────┬──────────┘
                                                  │
                                                  ▼
                              ┌──────────────────────────────────┐
                              │ sessionHooksRegistry (global)     │
                              │ ─ keyed by (event, matcher, hook) │
                              │ ─ fires for every agent           │
                              └──────────────────────────────────┘
                                                  ▲
                                                  │
                                                  │ register/clear at agentId scope
                                                  │
                                                  │
   ┌─────────────────────────────┐     ┌─────────────────────────────┐
   │  --agent <name> (main)       │     │  Agent tool (subagent)       │
   │                              │     │                              │
   │  agent.hooks → setMainThread │     │  agent.hooks → register      │
   │      AgentHooks(hooks)       │     │      FrontmatterHooks(...)   │
   │      (persisted for whole    │     │      scoped to subagent id   │
   │       session)               │     │      cleared at SubagentStop │
   └─────────────────────────────┘     └─────────────────────────────┘
```

Both global session hooks and agent-frontmatter hooks live in the same `sessionHooksRegistry`. Frontmatter hooks are tagged with the agent's `agentId` so they can be cleaned up when the agent exits. Global hooks have no agentId and persist until the session itself ends.

## Hook Event Types

The full event matrix (cli_inner_pretty.js around 48544 and 237667):

| Event | Fires |
|-------|-------|
| `SessionStart` | Once per session, at launch |
| `Setup` | Once per session, after settings are loaded |
| `SubagentStart` | When a subagent runs `runAgent` (just before the first LLM call) |
| `SubagentStop` | When a subagent's `runAgent` exits (normal or aborted) |
| `Stop` | When the main loop stops (turn end or session exit) |
| `PreToolUse` | Before a tool is invoked |
| `PostToolUse` | After a tool finishes successfully |
| `PostToolUseFailure` | After a tool throws |
| `UserPromptSubmit` | When the user types into the prompt |
| `Notification` | When the desktop notifier fires |
| `PreCompact` | Just before auto-compaction runs |
| `PostCompact` | Just after auto-compaction completes |
| `ConfigChange` | When settings hot-reload triggers |

Frontmatter `hooks:` can register handlers for any of these.

## v2.1.116: Main-Thread Agent Hooks Fix

### Pre-Fix Behavior

When a user ran `claude --agent code-reviewer`, the agent's `tools`, `model`, `permissionMode`, and (since v2.1.119) `--print` honored more frontmatter — but `hooks:` were ignored. The agent definition's frontmatter `hooks:` only fired when the agent was *dispatched as a subagent* by the model.

This was confusing: the agent's `.md` file said hooks would run, but they didn't for the natural interactive use of the agent.

### The Fix

v2.1.116 added:

> Agent frontmatter `hooks:` now fire when running as a main-thread agent via `--agent`

Implementation: at session start with `--agent <name>`, the loaded agent definition's `hooks` field is passed to `setMainThreadAgentHooks` (`dv$`):

```javascript
// cli_inner_pretty.js:3087-3090
function dv$(H) {
  let $ = jv();
  if ($) $.mainThreadAgentHooks = H;
  else U$.mainThreadAgentHooks = H;
}

// READABLE:
function setMainThreadAgentHooks(hooks) {
  const scopedState = getCurrentScopedState();
  if (scopedState) scopedState.mainThreadAgentHooks = hooks;
  else U$.mainThreadAgentHooks = hooks;       // fallback to global state
}
```

`getMainThreadAgentHooks` (`kp`) reads it back. The main loop's hook executor consults `mainThreadAgentHooks` in addition to global settings hooks when firing events.

### Why a Separate State Slot?

The main session's hooks come from settings (`registeredHooks`). The `--agent` flag is a separate input source. Rather than merging into `registeredHooks` (which would conflate user-edited settings with binary-driven flag handling), the `--agent` hooks live in their own slot. The hook executor consults both, but reset logic can clear them independently — e.g. switching agents mid-session would clear `mainThreadAgentHooks` without touching `registeredHooks`.

The dual-slot design also helps debugging: `/doctor` can distinguish "this hook came from your settings.json" from "this hook came from agent X's frontmatter".

## v2.1.118: Agent-Type Hooks Fix

### The Pre-Fix Bug

> Fixed agent-type hooks failing with "Messages are required for agent hooks" when configured for events other than `Stop` or `SubagentStop`

Agent-type hooks (a hook flavor where the hook itself spawns a subagent to verify or comment on something) used a builder that required a non-empty `messages` array. The hook executor for `Stop`/`SubagentStop` always had messages (the full conversation history). For other events, the messages array was either empty or absent — and the builder threw.

### The Fix

The hook builder now treats empty-messages as valid for non-Stop events. The hook can fire at `PreToolUse` even though no assistant message exists yet — the agent-type hook simply receives the *event payload* as its prompt rather than a conversation.

## v2.1.142: Prompt/Agent Hook Validation Error

### The New Error

> Improved hook configuration error: configuring a prompt- or agent-type hook for `SessionStart` / `Setup` / `SubagentStart` now shows a clear "use a command-type hook instead" error.

For these three events (`SessionStart`, `Setup`, `SubagentStart`), only `command`-type hooks make sense. The other types (`prompt`, `agent`, `mcp_tool`) require a model context to operate on, and these events fire **before** any user turn exists:

- `SessionStart` — session is launching, no user input yet.
- `Setup` — settings loaded, agent definition resolved, but no first message.
- `SubagentStart` — subagent context built, but the subagent hasn't run its first turn.

A prompt-type hook injects text into the next user message. At `SubagentStart`, there's no "next user message" to inject into yet — the spawn's prompt is fixed. An agent-type hook spawns a verifier subagent to review something. At `SessionStart`, there's nothing to review.

### The Old Behavior

Pre-v2.1.142, a hook configured this way would silently fail or produce confusing runtime errors deep in the executor (typically "Messages are required for agent hooks" again, despite v2.1.118 closing that for non-Stop events).

### The New Behavior

`registerFrontmatterHooks` (`eo7`) now validates the (event, type) pair at registration time and emits a user-visible error like:

> Cannot register a prompt-type hook for `SubagentStart`. Use a command-type hook instead — it can run an external process or script that observes the event without needing a conversation context.

This is a *configuration error*, not a runtime error: the agent file fails to load with a clear message, the user fixes it, and the agent loads cleanly on retry.

### Implementation Site

The validation is in `registerFrontmatterHooks` (cli_inner_pretty.js, called from runAgent at 393200):

```javascript
let PH = !DX("hooks") || B7H(H.source);                  // PH = registrations allowed?
if (H.hooks && PH) eo7(q.sessionHooksRegistry, u, H.hooks, `agent '${H.agentType}'`, !0);
```

The `B7H` gate (`isAgentTypeAdminTrusted`) admits hook registration for plugin / policy / built-in agents even when `disableAllHooks` or `allowManagedHooksOnly` is set in settings — admin-trusted sources are pre-approved. User-controlled agents must pass the `disable("hooks")` check.

`eo7` itself walks the agent's `hooks:` object, validates each event/type pair, and registers with the agent's `agentId` as scope. v2.1.142's improved validation lives in this function.

## How `SubagentStart` Fires

The `SubagentStart` hook event runs in `runAgent` just before the LLM loop starts:

```javascript
// cli_inner_pretty.js:393187-393198
for await (let $$ of QL$(u, H.agentType, vH.signal, void 0, q.getAppState))
  if ($$.additionalContexts && $$.additionalContexts.length > 0)
    JH.push(...$$.additionalContexts);

if (JH.length > 0) {
  let $$ = fK({
    type: "hook_additional_context",
    content: JH,
    hookName: "SubagentStart",
    toolUseID: Gy6.randomUUID(),
    hookEvent: "SubagentStart",
  });
  x.push($$);                                            // ← appended to messages
}
```

What this does:

1. `QL$(agentId, agentType, abortSignal, ..., getAppState)` is `executeSubagentStartHooks`. It calls every registered SubagentStart hook in order.
2. Each hook can return `additionalContexts: [...]`. These are concatenated into `JH`.
3. If any hook produced additional context, an `hook_additional_context` attachment is appended to the subagent's messages array. The subagent's first turn sees this content alongside the parent's prompt.

The hook input payload (per the schema at cli_inner_pretty.js:237865 and 238068):

```typescript
{ hook_event_name: "SubagentStart",
  agent_id: <agentId>,
  agent_type: <agentType>,
  session_id: ...,
  hook_event_name: "SubagentStart",
  additionalContext: string? }
```

So a `command`-type hook for SubagentStart can:
- Read `agent_id` and `agent_type` from stdin (the input JSON).
- Decide whether to inject context based on which agent is starting.
- Output to stdout an `additionalContext` string that becomes part of the subagent's first turn.

A typical use: "for the code-reviewer agent, inject the project's STYLE.md as additional context".

## How `SubagentStop` Fires

`SubagentStop` runs in `runAgent`'s `finally` block (cli_inner_pretty.js:393371-393382):

```javascript
G$ = [
  {
    name: "SubagentStop",
    run: async () => {
      if (A$) return;                                    // already fired in-stream
      try {
        for await (let M$ of S9H(void 0, void 0, 5000, !1, u, WH, void 0, H.agentType));
      } catch (M$) {
        log(`[runAgent] SubagentStop on interrupted query failed: ${M$}`);
      }
    },
  },
  // ... other cleanup steps
];
```

The `A$` flag tracks whether `SubagentStop` already fired as part of the streaming attachment pipeline (line 393330-393333: "if attachment has `hookEvent: SubagentStop`, set A$ = true"). The `finally` block's manual fire is a backstop for the abort path: if the stream was aborted mid-turn, the in-stream hook firing never happened, and we still want stop logic to run.

The `5000` ms timeout caps how long the manual `SubagentStop` execution can take during cleanup. After 5s, the iteration breaks regardless. This avoids cleanup deadlocks if a stop hook hangs.

## Hook Cleanup at SubagentStop

The `sessionHooks` cleanup step (cli_inner_pretty.js:393385-393388):

```javascript
{
  name: "sessionHooks",
  run: () => {
    if (H.hooks) q.sessionHooksRegistry.clear(u);
  },
},
```

This removes all hooks registered with this subagent's `agentId`. The unscoped global hooks remain. The cleanup runs after `SubagentStop` has fired (so a stop hook can still inspect the registry if it wants to).

## Hook Inheritance: What Subagents See

A subagent's hook executor consults:

1. **Global session hooks** (from `~/.claude/settings.json`) — applies to all agents.
2. **`mainThreadAgentHooks`** (from `--agent <name>`) — applies if running as the main loop. Subagents normally don't see these because they're dispatched from a parent loop that is itself the main loop. But if a `--agent`-launched main loop dispatches a subagent, the subagent's parent context will have `mainThreadAgentHooks` set; the subagent inherits the registry, but its *own* spawn doesn't add more main-thread hooks.
3. **Subagent's own frontmatter hooks** — registered at runAgent start, scoped to the subagent's `agentId`.

The subagent does NOT inherit *another subagent's* frontmatter hooks. Each subagent's hooks are scoped to itself. If a code-reviewer subagent spawns a verifier subagent (rare), the verifier doesn't see code-reviewer's hooks unless they're also configured globally.

## `disableAllHooks` and `allowManagedHooksOnly`

Two settings constrain hook execution:

- `disableAllHooks: true` — every hook is suppressed regardless of source. Useful for `/goal` mode (which v2.1.140 fixed to show a clear message rather than hang).
- `allowManagedHooksOnly: true` — only hooks from managed settings (policy/plugin/built-in) fire. User-authored hooks in `~/.claude/settings.json` are ignored.

The runAgent gate at line 393199:

```javascript
let PH = !DX("hooks") || B7H(H.source);
```

`DX("hooks")` returns true if hooks are bypassed (e.g. by one of the above settings). `B7H` (`isAgentTypeAdminTrusted`) returns true if the agent's source is `policySettings`, `plugin`, or `built-in`. The whole expression is true when hooks are allowed (gate not active) or when the agent is admin-trusted.

So even with `disableAllHooks` set, admin-trusted agents' frontmatter hooks still register. This is intentional: managed deployments can rely on plugin / policy agents' hooks firing even when the user has otherwise disabled hooks.

## Per-Event Filtering by Matcher

Each hook entry has a `matcher` field that's a regex/glob applied to the tool name (for PreToolUse / PostToolUse) or the prompt (for prompt-type hooks). The matcher is checked before the hook fires.

For `SubagentStart`, the matcher is the agent type. A hook entry like:

```yaml
hooks:
  SubagentStart:
    - matcher: "code-.*"
      hooks:
        - type: command
          command: "scripts/log-code-agent-start.sh"
```

Only fires for agents whose type starts with `code-`. This lets a single global hook customize behavior per agent class without writing N near-identical hooks.

## Key Decision: Why Scope by `agentId` Rather Than `agentType`?

**What it does:** Frontmatter hooks are registered into `sessionHooksRegistry` with the subagent's UUID (`agentId`) as scope, not the agent's type name.

**Why this approach:**
1. **Per-spawn cleanup** — when a subagent exits, `sessionHooksRegistry.clear(agentId)` removes exactly that subagent's hooks. Cleanup by `agentType` would affect concurrent same-type subagents.
2. **Concurrent subagents** — two code-reviewer subagents can run in parallel without their hook registrations conflicting.
3. **Resume semantics** — a resumed subagent has the same `agentId` as before; if the hook code is the same in frontmatter, it re-registers cleanly. If a different agent runs in parallel, they don't interfere.

**Alternative considered:** Scope by `agentType`.

This would be simpler (no UUID tracking), but it breaks per-spawn cleanup. If two `code-reviewer` subagents run concurrently and one exits, clearing by type would remove the other's hooks too.

**Key insight:** UUID-scoping is the natural fit for per-spawn lifecycle. Type-scoping is a category error — agents of the same type are independent runtime entities.

## Hook Execution Order

For an event fired during a subagent's turn:

1. Hooks registered globally (from settings).
2. Hooks registered for the **parent** session (e.g. `--agent`-supplied hooks).
3. Hooks registered for the current subagent (frontmatter).
4. Each hook in registration order within its scope.

For `PreToolUse` of `Bash`, the order is roughly:

```
1. Global pre-bash hook A
2. Global pre-bash hook B
3. Parent main-thread agent's pre-bash hook (if --agent)
4. This subagent's frontmatter pre-bash hook
5. Tool executes
```

A hook can short-circuit by returning `behavior: "deny"` or `continueOnBlock: true` (PostToolUse). The next hooks in the chain see the modified state but don't re-fire.

## Cross-References

- **Setting-level hooks**: `~/.claude/settings.json` → `hooks:` — applies globally.
- **`hookSpecificOutput.updatedToolOutput`** — v2.1.121 extended this from MCP-only to all tools for `PostToolUse`.
- **`continueOnBlock` flag** — v2.1.139 added a `PostToolUse` option to feed a hook's rejection back as model input and continue the turn.
- **Subagent identity headers** — `x-claude-code-agent-id` and `x-claude-code-parent-agent-id` (v2.1.139) carry the subagent context in API requests; hooks can read them via the OTel attributes.

## Key Insight

The hook-inheritance story across v2.1.116, v2.1.118, and v2.1.142 is fundamentally about **the matrix of (hook source × event type × agent run mode) being filled in completely**. Each fix patches a hole:

- v2.1.116: agent frontmatter × main thread × any event → previously dropped, now wired.
- v2.1.118: agent-type hooks × non-Stop/SubagentStop events → previously crashed, now valid.
- v2.1.142: prompt/agent hooks × SessionStart/Setup/SubagentStart → previously failed silently, now rejected with a clear message.

Each fix is small (a handful of lines), but together they make the hook system *consistent*: any configuration that *looks* valid in the YAML schema produces a predictable outcome — either it runs as expected, or it fails to load with a helpful error.
