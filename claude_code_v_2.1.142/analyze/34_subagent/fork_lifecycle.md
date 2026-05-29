# Fork-Subagent Lifecycle — `CLAUDE_CODE_FORK_SUBAGENT` (v2.1.142)

## TL;DR

The **fork-subagent** path is a special subagent spawn mode where the child *inherits the parent's full conversation context* rather than starting fresh. Its purpose is two-fold:

1. **Prompt-cache sharing** — when the parent emits multiple `Agent` tool calls in one assistant message, all the resulting fork children send byte-identical API prefixes, so they share the same Anthropic prompt-cache entry. The actual divergence is a single text block at the end of the user message that gives each fork its directive.
2. **"Default to forking"** — for open-ended research questions where the parent's context is needed but the intermediate output isn't worth keeping in the parent's transcript. The model produces the answer in the fork, returns a summary, and the fork's intermediate tool-uses (file reads, web fetches, grep) are dead-on-arrival.

The fork path is gated by `CLAUDE_CODE_FORK_SUBAGENT=1` (env) or the `tengu_copper_fox` GrowthBook flag (`tengu_fork_subagent_enabled` telemetry event).

## Rollout History

| Version | Change |
|---------|--------|
| Pre-2.1.117 | Fork path internal-only (Anthropic / `USER_TYPE=ant`) |
| v2.1.117 | **Enabled `CLAUDE_CODE_FORK_SUBAGENT=1` on external builds** (interactive sessions only) |
| v2.1.121 | **Extended to non-interactive**: `claude -p`, the SDK, and headless mode now also respect the env var |
| v2.1.128 | "Default to forking" guidance shipped in the Agent tool's prompt |
| v2.1.142 | Carried forward unchanged |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `isForkSubagentEnabled` (`W0`) - gate predicate (cli_inner_pretty.js:211750-211752)
- `resolveForkSubagentSource` (`S$_`) - returns `"disabled" | "env" | "ant" | "gb_rollout"` (cli_inner_pretty.js:211733-211740)
- `getForkSubagentSource` (`nlK`) - memoized + telemetry-emitting wrapper (cli_inner_pretty.js:211741-211746)
- `FORK_AGENT` (`vI`) - synthetic AgentDefinition (cli_inner_pretty.js:211810-211819)
- `buildForkedMessages` (`Yf6`) - cache-prefix assembly (cli_inner_pretty.js:211761-211772)
- `buildChildMessage` (`zf$`) - the per-fork directive prompt (cli_inner_pretty.js:211773-211789)
- `isInForkChild` (`zf6`) - recursion guard (cli_inner_pretty.js:211753-211760)
- `isForkSubagentRuntimeEnabled` (`GHH`) - alternative runtime gate (cli_inner_pretty.js:344846-344851)

## The Three Subagent Spawn Modes

| Mode | `subagent_type` value | AgentDefinition source | Context inheritance |
|------|----------------------|------------------------|----------------------|
| **Fresh subagent** (Agent tool) | Required (e.g. `"code-reviewer"`) | Resolved from `activeAgents` | Starts with zero context. Parent's `prompt` is the first user message. |
| **Implicit fork** (Agent tool) | **Omitted** (only when fork enabled) | `FORK_AGENT` (synthetic) | Inherits parent's full conversation. `permissionMode: bubble`. |
| **Main-thread agent** (`--agent` CLI) | N/A | Resolved from `activeAgents` | The agent IS the main loop. Frontmatter `initialPrompt:` is auto-submitted. |

The Agent tool's schema makes `subagent_type` optional iff `isForkSubagentEnabled()` returns true:

```typescript
// From AgentTool.tsx baseInputSchema:
subagent_type: z.string().optional().describe('The type of specialized agent to use for this task'),
```

Pre-fork, this field was required. Post-fork, omitting it routes to the fork path.

## Gate: `resolveForkSubagentSource` (`S$_`)

```javascript
// ============================================
// resolveForkSubagentSource - Source-of-truth gate predicate
// Location: cli_inner_pretty.js:211733-211740
// ============================================

// ORIGINAL (for source lookup):
function S$_() {
  if (i3H()) return "disabled";
  if (bH(process.env.CLAUDE_CODE_FORK_SUBAGENT)) return "env";
  if (T6()) return "disabled";
  if (bH(void 0)) return "ant";
  if (Z$(h$_, !1)) return "gb_rollout";
  return "disabled";
}

// READABLE (for understanding):
function resolveForkSubagentSource() {
  if (deadCoordinatorGate()) return "disabled";   // i3H — always false in v2.1.142
  if (parseEnvTruthy(process.env.CLAUDE_CODE_FORK_SUBAGENT)) return "env";
  if (getIsNonInteractiveSession()) return "disabled";   // T6 — !isInteractive
  if (parseEnvTruthy(undefined)) return "ant";   // dead branch in external builds — ant gate
  if (getGrowthBookFlag(FORK_FEATURE_FLAG_KEY, false)) return "gb_rollout";
  return "disabled";
}

// Mapping: S$_→resolveForkSubagentSource, i3H→deadCoordinatorGate (return false stub, line 211707-211709),
//          bH→parseEnvTruthy, T6→getIsNonInteractiveSession (!isInteractive, line 2677-2679), Z$→getGrowthBookFlag,
//          h$_→FORK_FEATURE_FLAG_KEY ("tengu_copper_fox")
```

> ⚠️ **Correction.** Earlier drafts mapped `T6 → isCoordinatorMode` and built a
> "coordinator-mode exclusion" story around it. Re-verified against the v2.1.142
> bundle: `T6()` = `return !U$.isInteractive` (`getIsNonInteractiveSession`,
> cli_inner_pretty.js:2677-2679), and `i3H()` = `return !1` (a dead stub,
> 211707-211709) — `i3H` is the *constant-folded remnant* of v2.1.88's
> `isCoordinatorMode()` first-check, now that coordinator mode is stripped from
> the build (zero hits for `CLAUDE_CODE_COORDINATOR_MODE`). So the real gate is
> **interactivity**, not coordinator mode.

The branch order matters:

1. **Dead coordinator gate** (`i3H`) — `function i3H() { return !1; }`. In v2.1.88 this position held `isCoordinatorMode()` (fork was disabled inside coordinator mode). v2.1.142 removed coordinator mode entirely, so the Bun bundler folded the check to a constant `false`. It never disables fork now.
2. **Env var** (`CLAUDE_CODE_FORK_SUBAGENT=1`) — explicit opt-in. Returns `"env"`. **Checked before the interactivity gate**, so SDK / `-p` callers that set this env var get fork even though they are non-interactive (this is how v2.1.121 extended fork to headless/SDK).
3. **Non-interactive session** (`T6`/`getIsNonInteractiveSession`) — the *automatic* (rollout/ant) fork paths are disabled in headless sessions that did **not** set the env var. Rationale: silent prompt-cache-sharing fork is an interactive-REPL optimization; a headless caller should opt in explicitly.
4. **Internal `ant`** gate — placeholder in external builds (`bH(void 0)` is always `false`).
5. **GrowthBook rollout** (`tengu_copper_fox`) — silent gradual rollout for *interactive* users not setting the env var.
6. **Default** — disabled.

### Memoization

`getForkSubagentSource` (`nlK`) wraps `S$_` with module-level memoization and a one-time telemetry emit:

```javascript
function nlK() {
  if (IH8 !== null) return IH8;
  let H = S$_();
  if (H !== "disabled") (IH8 = H, d(I$_, { source: H }));
  return H;
}
```

Two effects:
1. Avoid re-checking environment / GrowthBook on every Agent tool call.
2. Emit `tengu_fork_subagent_enabled` exactly once per session with the activation source — useful for distinguishing env-driven activations from feature-flag rollout.

### The runtime-side gate `GHH`

There's a parallel gate at cli_inner_pretty.js:344846-344851 used by deeper runtime code:

```javascript
function GHH() {
  if (T6()) return !1;
  if (bH(process.env.CLAUDE_CODE_FORK_SUBAGENT)) return !0;
  if (bH(void 0)) return !0;
  return Z$("tengu_copper_fox", !1);
}
```

Here `T6` is again `getIsNonInteractiveSession`. Note the **ordering difference** from `S$_`: `GHH` checks `T6()` *first* (returns `false` immediately when non-interactive), whereas `S$_` checks the env var first. So `GHH` is the stricter gate — it treats fork as off in any non-interactive session, while `S$_` lets an explicit `CLAUDE_CODE_FORK_SUBAGENT=1` override interactivity. Two gates exist because `nlK`/`S$_` is the Agent-tool path that wants the *source* string for telemetry (and must honor the env override), and `GHH` is a fast yes/no used in tighter runtime code.

### Non-Interactive Exclusion: Why?

The *automatic* fork paths (`gb_rollout`, `ant`) are gated off in non-interactive sessions (`getIsNonInteractiveSession`). Fork-subagent is fundamentally a **prompt-cache-sharing optimization for the interactive REPL**: parallel forks reuse one cache prefix. In a headless/`-p`/SDK run the caller controls the message flow directly and may not benefit from (or may be surprised by) implicit forking, so the silent rollout stays off unless the operator explicitly sets `CLAUDE_CODE_FORK_SUBAGENT=1` (which short-circuits to `"env"` before the interactivity check in `S$_`).

> This section previously described a "coordinator-mode exclusion." That was an
> artifact of the `T6 → isCoordinatorMode` mis-mapping. v2.1.142 has no
> coordinator mode; the first-position coordinator check survives only as the
> dead `i3H` stub (`return false`). The live gate is interactivity.

## The Synthetic `FORK_AGENT` Definition

When the fork path fires, the runtime uses a synthetic `AgentDefinition` rather than looking up a real one:

```javascript
// ============================================
// FORK_AGENT - Synthetic AgentDefinition for the fork path
// Location: cli_inner_pretty.js:211810-211819
// ============================================

// ORIGINAL (for source lookup):
vI = {
  agentType: ilK,           // "fork"
  whenToUse: "Implicit fork — inherits full conversation context. Not selectable via subagent_type; triggered by omitting subagent_type when the fork experiment is active.",
  tools: ["*"],
  maxTurns: 200,
  model: "inherit",
  permissionMode: "bubble",
  source: "built-in",
  baseDir: "built-in",
  getSystemPrompt: () => "",
};

// READABLE (for understanding):
const FORK_AGENT = {
  agentType: FORK_SUBAGENT_TYPE,  // "fork"
  whenToUse: "Implicit fork — inherits full conversation context...",
  tools: ["*"],                    // ← literal star: forwarded as parent's exact pool with useExactTools:true
  maxTurns: 200,
  model: "inherit",                // ← parent's model
  permissionMode: "bubble",        // ← surface permission prompts to parent terminal
  source: "built-in",
  baseDir: "built-in",
  getSystemPrompt: () => "",       // ← unused; parent's already-rendered system prompt is threaded via override
};

// Mapping: vI→FORK_AGENT, ilK→FORK_SUBAGENT_TYPE
```

Notes on each field:

- **`agentType: "fork"`** — A synthetic name. Not selectable via `subagent_type: "fork"` from the model (the resolver doesn't add `FORK_AGENT` to `activeAgents`); only the missing-`subagent_type` path triggers it.
- **`tools: ["*"]`** — Special "star pattern" that `runAgent` interprets together with `useExactTools: true` to forward the parent's *exact* tool list. This is critical for cache identity: any difference in tool count or order would break the cache prefix.
- **`maxTurns: 200`** — Higher than most agents because fork children sometimes do extended research.
- **`model: "inherit"`** — The fork uses the parent's model so context length is identical (no truncation surprises).
- **`permissionMode: "bubble"`** — Special mode that re-routes permission prompts to the parent's terminal. The user sees a single permission dialog rather than per-fork dialogs.
- **`getSystemPrompt: () => ""`** — Never called. The fork path supplies `override.systemPrompt` with the parent's already-rendered system prompt bytes (threaded as `toolUseContext.renderedSystemPrompt`). Reconstructing via `getSystemPrompt()` could diverge (GrowthBook cold→warm flips) and bust the cache; threading the rendered bytes is byte-exact.

## The Cache-Prefix Structure: `buildForkedMessages`

The critical correctness requirement is **byte-identical API prefixes across all fork children in a batch**. The function that builds the per-child message array is:

```javascript
// ============================================
// buildForkedMessages - Construct cache-shared message array for a fork child
// Location: cli_inner_pretty.js:211761-211772
// ============================================

// ORIGINAL (for source lookup):
function Yf6(H, $) {
  let q = { ...$, uuid: llK.randomUUID(), message: { ...$.message, content: [...$.message.content] } },
    K = $.message.content.filter((z) => z.type === "tool_use");
  if (K.length === 0)
    return (
      N(`No tool_use blocks found in assistant message for fork directive: ${H.slice(0, 50)}...`, { level: "error" }),
      [w8({ content: [{ type: "text", text: zf$(H) }] })]
    );
  let _ = K.map((z) => ({ type: "tool_result", tool_use_id: z.id, content: [{ type: "text", text: C$_ }] })),
    A = w8({ content: [..._, { type: "text", text: zf$(H) }] });
  return [q, A];
}

// READABLE (for understanding):
function buildForkedMessages(directive, assistantMessage) {
  // 1. Clone the parent's assistant message (all tool_use blocks, thinking, text)
  const fullAssistantMessage = {
    ...assistantMessage,
    uuid: crypto.randomUUID(),
    message: {
      ...assistantMessage.message,
      content: [...assistantMessage.message.content],
    },
  };

  // 2. Extract every tool_use block from that message
  const toolUseBlocks = assistantMessage.message.content.filter((b) => b.type === "tool_use");

  // 3. If parent has no tool_use blocks, just a directive — can't fork
  if (toolUseBlocks.length === 0) {
    log(`No tool_use blocks found in assistant message for fork directive: ${directive.slice(0, 50)}...`, { level: "error" });
    return [makeUserMessage({ content: [{ type: "text", text: buildChildMessage(directive) }] })];
  }

  // 4. Build placeholder tool_result blocks — one per tool_use, all with the SAME placeholder text
  //    The fork hasn't actually executed the parent's tools; we paper over with a fixed string.
  const toolResultBlocks = toolUseBlocks.map((b) => ({
    type: "tool_result",
    tool_use_id: b.id,
    content: [{ type: "text", text: FORK_PLACEHOLDER_RESULT }], // "Fork started — processing in background"
  }));

  // 5. Single user message: all tool_results + the directive
  const userMessage = makeUserMessage({
    content: [...toolResultBlocks, { type: "text", text: buildChildMessage(directive) }],
  });

  // 6. Result: [parent_assistant_msg, user_msg(placeholders + directive)]
  return [fullAssistantMessage, userMessage];
}

// Mapping: Yf6→buildForkedMessages, H→directive, $→assistantMessage, q→fullAssistantMessage,
//          K→toolUseBlocks, _→toolResultBlocks, A→userMessage,
//          C$_→FORK_PLACEHOLDER_RESULT ("Fork started — processing in background"),
//          zf$→buildChildMessage, w8→makeUserMessage, N→log, llK→crypto
```

### What this achieves

The full message sequence sent to the API for fork child N is:

```
[ ...parentHistory,                                  // shared prefix — cached
  parentAssistantMessage(all_tool_uses),             // shared prefix — cached
  userMessage(                                       // mostly shared:
    placeholder_results[0],                          //   - shared
    placeholder_results[1],                          //   - shared
    ...
    text_block_with_directive_N )                    //   - DIVERGES per child
]
```

The placeholder text `"Fork started — processing in background"` is **identical** across all forks. The directive text block at the end is the *only* per-child variation. The Anthropic prompt cache hashes a rolling-window of the prefix; with this construction, the API's cache hits up to the very last text block, and only the divergent suffix is "fresh" tokens.

### Why this approach was chosen

**Alternative considered: spawn each fork with no `tool_result` placeholders.**

That would fail validation: Anthropic's API requires every `tool_use` block in the assistant message to be followed by a matching `tool_result` block in the next user message. Skipping them entirely is rejected as a malformed conversation.

**Alternative considered: each fork executes the parent's tools to produce real tool_results.**

That breaks cache identity (different fork = different real outputs) and adds runtime cost. The whole point of fork is to *skip* the intermediate tool execution.

**The chosen solution**: use the **same placeholder text** for every fork's tool_result. This satisfies the API's "every tool_use needs a tool_result" rule, and the placeholder is identical bytes across all children so the cache prefix is identical.

The comment in `forkSubagent.ts` calls this out explicitly:

> Placeholder text used for all tool_result blocks in the fork prefix. Must be identical across all fork children for prompt cache sharing.

### The directive prompt

The directive text at the end of the user message is wrapped in a special tag:

```javascript
function zf$(H) {
  return `<${cLH}>
You are a worker fork. The transcript above is the parent's history — inherited reference, not your situation. You are NOT a continuation of that agent. Execute ONE directive, then stop.

Hard rules:
- Do NOT spawn sub-agents. The "default to forking" guidance is for the parent; you ARE the fork, execute directly.
- One shot: report once and stop. No follow-up questions, no proposed next steps, no waiting for the user.

Guidelines (your directive may override any of these):
- Stay in scope. Other forks may be handling adjacent work; if you spot something outside your directive, note it in a sentence and move on.
- Open with one line restating your task, so the parent can spot scope drift at a glance.
- Be concise — as short as the answer allows, no shorter. Plain text, no preamble, no meta-commentary.
- If you committed changes, list the paths and commit hashes in your report.
</${cLH}>

${Oq$}${H}`;
}
```

This boilerplate has two purposes:

1. **Anti-recursion**: `Do NOT spawn sub-agents` — without this, the fork child (which still has the Agent tool in its pool for cache identity) would happily fork again, leading to exponential fanout. The fork tag in `<${cLH}>` (the `FORK_BOILERPLATE_TAG`) is also scanned by `isInForkChild` (`zf6`) at Agent-tool call time as a hard guard.
2. **Behavior shaping**: One-shot, in-scope, concise. The fork is for *answering a specific question*, not for unbounded exploration.

### Fork-Child Recursion Guard: `isInForkChild`

```javascript
// ============================================
// isInForkChild - Detect fork-child message history to refuse re-forking
// Location: cli_inner_pretty.js:211753-211760
// ============================================

// ORIGINAL (for source lookup):
function zf6(H) {
  return H.some(($) => {
    if ($.type !== "user") return !1;
    let q = $.message.content;
    if (!Array.isArray(q)) return !1;
    return q.some((K) => K.type === "text" && K.text.includes(`<${cLH}>`));
  });
}

// READABLE (for understanding):
function isInForkChild(messages) {
  return messages.some((m) => {
    if (m.type !== "user") return false;
    const content = m.message.content;
    if (!Array.isArray(content)) return false;
    return content.some((block) => block.type === "text" && block.text.includes(`<${FORK_BOILERPLATE_TAG}>`));
  });
}

// Mapping: zf6→isInForkChild, H→messages, $→m, q→content, K→block, cLH→FORK_BOILERPLATE_TAG
```

When the Agent tool is invoked, it calls `isInForkChild(currentMessages)` early. If true, the agent rejects the call with a "fork children cannot spawn subagents" error. The check is cheap because it scans only for the boilerplate XML tag substring.

## Worktree Notice for Isolation-Worktree Forks

When a fork inherits isolation `worktree`, it gets an extra paragraph added to its prompt:

```javascript
function ff6(H, $) {
  return `You've inherited the conversation context above from a parent agent working in ${H}. You are operating in an isolated git worktree at ${$} — same repository, same relative file structure, separate working copy. Paths in the inherited context refer to the parent's working directory; translate them to your worktree root. Re-read files before editing if the parent may have modified them since they appear in the context. Your changes stay in this worktree and will not affect the parent's files.`;
}
```

This notice is appended to the directive text block. Critically, **the worktree path is part of the directive text** — which is the divergent block — so different worktrees don't bust the cache prefix.

## `--agent` Main-Thread vs Agent-Tool-Spawned

`--agent <name>` and the Agent tool both produce a "subagent-like" execution, but they differ at the loop level:

| Aspect | `--agent <name>` | Agent tool (`subagent_type` or fork) |
|--------|------------------|---------------------------------------|
| Process | Main Claude Code process. Single agent loop. | Same process. Nested `runAgent` invocation inside parent's loop. |
| Transcript | The session's main JSONL (`~/.claude/projects/<slug>/<sessionId>.jsonl`) | Sidechain (`~/.claude/sidechains/<agentId>.jsonl`) |
| Hooks fired | `mainThreadAgentHooks` registered at startup; SubagentStart/Stop **not** fired | `SubagentStart` and `SubagentStop` fire around the nested loop |
| `agent_id` in hook payloads | **Absent** (main thread has no agent_id) | Present, alongside `agent_type` |
| `initialPrompt` | Auto-submitted as the first user message after model warm-up | Not used; parent's `prompt` is the first message |
| Tool surface | Agent's `tools`/`disallowedTools` constrain the main loop | Agent's tools constrain the subagent loop |
| Resume | Standard `--resume <sessionId>` | `runResumedSubagent` (`uiH`) by agent ID |
| MCP servers (frontmatter) | v2.1.117 loads `mcpServers:` on session start | `runAgent` loads them inside `initializeAgentMcpServers` |
| Hooks (frontmatter) | v2.1.116 fires `hooks:` on session start | `registerFrontmatterHooks` inside `runAgent` |
| Permission mode | v2.1.119: `--print` honors `permissionMode` for built-in agents | `runAgent` derives it from agent frontmatter |

The unification project (v2.1.116-v2.1.117) brought `--agent` mode to parity with subagent-mode for hooks and MCP — before then, `--agent` was a thin "set system prompt and disable some tools" wrapper that ignored the rest of the frontmatter.

## Key Decision: Why a `FORK_AGENT` Constant, Not a Real Agent Definition?

**What it does:** Defines the fork-path's `AgentDefinition` as a code constant rather than a `.md` file in `built-in/`.

**How it works:** `FORK_AGENT` is exported from `forkSubagent.ts`, registered nowhere, and only consumed by the Agent tool's "no `subagent_type`" branch.

**Why this approach:**
1. **Not selectable** — A real built-in agent registered in `activeAgents` would be matchable by `subagent_type: "fork"`. The model would inevitably try this string and get unintended behavior. Making it a code-only constant ensures the only path to fork is the schema-omitted path.
2. **Version-locked** — A `.md` file would be parsed at load time; a code constant is part of the binary. The synthetic definition can never have a typo in YAML.
3. **No "where is the source prompt" question** — `getSystemPrompt: () => ""` makes it explicit that the system prompt comes from the parent, threaded via `override.systemPrompt`. A real agent file would imply "this string is my prompt", which the cache path needs to ignore.

**Trade-offs:**
- Discoverability: users can't `cat` the fork agent's definition in `built-in/`. (Mitigated by docs.)
- Customization: users can't override fork agent behavior via plugin or settings. (This is intentional — fork is meant to be a transparent mechanism, not a configurable role.)

**Key insight:** Fork is **not an agent** in the user-facing sense. It's a **prompt-cache-friendly conversation-cloning mechanism**. Treating it as an agent in code (with an `AgentDefinition`) lets it reuse `runAgent`'s pipeline; treating it as *not* an agent in configuration prevents misuse.

## Lifecycle Diagram

```
   parent's main loop emits assistant message with N tool_use blocks
                            │
                            │
   for each tool_use block:
   ┌────────────────────────┴────────────────────────┐
   │  if input.subagent_type omitted AND fork enabled:│
   │    forkPath = true                               │
   │    agentDefinition = FORK_AGENT                  │
   │    spawnMessages = buildForkedMessages(directive, parentAssistant) │
   │    useExactTools = true                          │
   │    override.systemPrompt = parent.renderedSystemPrompt │
   │  else:                                           │
   │    forkPath = false                              │
   │    agentDefinition = resolve(input.subagent_type) │
   │    spawnMessages = [userMessage(input.prompt)]   │
   └────────────────────────┬────────────────────────┘
                            │
                            ▼
              runAgent(agentDefinition, spawnMessages, ...)
                            │
                            │  if forkPath:
                            │    forkContextMessages = parentMessages
                            │  else:
                            │    forkContextMessages = undefined
                            │
                            ▼
                       runs to completion
                            │
                            ▼
                  yields tool_result to parent
                            │
   for each tool_use block in the parent's message:
   ─────── (parallel forks run concurrently in async batch) ───────
                            │
                            ▼
                  all results gathered as next user turn
```

The "next user turn" is where the parent sees all fork outputs side-by-side. The model can then synthesize across them or follow up with more forks.

## Key Insight

The fork-subagent path is a clever **misuse of the Agent tool's optional-`subagent_type` schema slot** to encode a fundamentally different operation: not "spawn agent X" but "branch this conversation in parallel". The choice to overload one tool call rather than introduce a separate `Fork` tool was deliberate:

- **Cache prefix continuity** — using the *same* tool name across spawn types means the tool definition itself is identical, so the JSON-schema definitions in the system prompt are byte-identical too, preserving cache. A new tool would add a definition block and bust the cache.
- **Model affordance** — the model already knows how to use `Agent`. Asking it to also know `Fork` would require additional system prompt text explaining when to use which.
- **Single execution path** — all dispatch flows through `runAgent`, with `forkContextMessages` being the only signal that distinguishes fork from fresh. Less code to maintain.

The trade-off is conceptual clarity: a casual reader sees `Agent({prompt: "..."})` and reasonably expects a fresh subagent. The schema only hints at fork in its description ("specify a subagent_type to use a specialized agent, or omit it to fork yourself"). This is documented but easy to miss.

The v2.1.121 SDK extension matters because non-interactive SDK users (CI, automation, custom tooling) were the audience most likely to benefit from cache-shared parallel forks. Pre-v2.1.121, the SDK was stuck with the "fresh subagent every time" model, which paid full token cost on every fork. After v2.1.121, an SDK script can spawn 10 parallel research forks and pay roughly 1× the token cost for the shared prefix, with only the directive divergence as fresh tokens.
