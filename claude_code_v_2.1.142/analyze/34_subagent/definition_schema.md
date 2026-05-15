# Agent Definition Schema — Frontmatter Reference (v2.1.142)

## Overview

Every subagent in Claude Code is defined by a Markdown file with YAML frontmatter. The file lives under one of four search paths (in precedence order on collision):

1. **Built-in** — bundled in the CLI binary. (`Plan`, `Explore`, `general-purpose`, `statusline-setup`, `claude-guide-agent`, verification, etc.)
2. **Policy** — `policySettings`-source agents from managed-settings (admin-controlled).
3. **Plugin** — agents shipped by an installed plugin.
4. **User/Project** — `~/.claude/agents/<name>.md` or `<repo>/.claude/agents/<name>.md`.

The frontmatter governs:
- **Identity**: `name`, `description`
- **Model selection**: `model`, `effort`
- **Tool surface**: `tools`, `disallowedTools`
- **MCP**: `mcpServers`
- **Hooks**: `hooks`
- **Permissions**: `permissionMode`
- **Display**: `color`
- **Lifecycle**: `maxTurns`, `initialPrompt`, `memory`, `background`, `isolation`
- **Discoverability**: `disable-model-invocation` (skill-level), `hide-from-slash-command-tool`

This document walks each key in detail, validates against the Zod schemas in cli_inner_pretty.js, and explains the resolution / parser quirks.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `parseMarkdownFrontmatter` (`tO`) - YAML parser with retry-with-fixup (cli_inner_pretty.js:141788-141809)
- `quoteUnquotedFrontmatterValues` (`aI1`) - Tolerant fallback that quotes bare colon-containing values (cli_inner_pretty.js:141761-141787)
- `KNOWN_FRONTMATTER_KEYS` (`iI1`) - The canonical key list (cli_inner_pretty.js:141694-141748)
- `FRONTMATTER_KEY_INDEX` (`JAY`) - Normalized→canonical lookup, case-/dash-/underscore-insensitive (cli_inner_pretty.js:141749)
- `normalizeFrontmatterKey` (`rI1`) - `replace(/[-_]/g, "").toLowerCase()` (cli_inner_pretty.js:141688-141690)
- `agentFrontmatterSchema` (`as1`) - Zod validator (cli_inner_pretty.js:198717-198747)
- `AGENT_COLOR_PALETTE` (`Nf`) - Eight-color canonical list (cli_inner_pretty.js:231368)

## The Frontmatter Format

A typical agent definition:

```markdown
---
name: code-reviewer
description: Reviews pull requests for security, correctness, and style issues.
model: opus
effort: high
tools:
  - Read
  - Grep
  - Bash
mcpServers:
  - slack
  - my-internal-issues:
      type: stdio
      command: ./scripts/issue-tracker
hooks:
  PreToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: "scripts/check-locks.sh"
permissionMode: acceptEdits
color: green
maxTurns: 80
initialPrompt: |
  Greet the user briefly, then ask which PR to review.
---

You are a senior staff engineer who specializes in code review...
```

The YAML head is everything between the leading `---` and the next `---` (line-aligned). Everything after the second `---` is the system prompt body.

## Parser: Tolerant YAML with Retry

The parser is `parseMarkdownFrontmatter` (`tO`). It tries `Bun.YAML.parse` first; on failure, it falls back through `quoteUnquotedFrontmatterValues` (`aI1`) which auto-quotes bare values containing colons or other YAML-significant characters.

```javascript
// ============================================
// parseMarkdownFrontmatter - YAML head extractor with retry-with-fixup
// Location: cli_inner_pretty.js:141788-141809
// ============================================

// ORIGINAL (for source lookup):
function tO(H, $, q) {
  let K = H.match(XKH);
  if (!K) return { frontmatter: {}, content: H };
  let _ = K[1] || "",
    A = H.slice(K[0].length),
    z = (f) => { return f; },
    Y = {};
  try {
    Y = z(PVK(iYH(_)));
  } catch {
    try {
      let f = aI1(_);
      Y = z(PVK(iYH(f)));
    } catch (f) {
      let O = $ ? ` in ${$}` : "";
      N(`Failed to parse YAML frontmatter${O}: ${f instanceof Error ? f.message : f}`, { level: "warn" });
    }
  }
  return { frontmatter: Y, content: A };
}

// READABLE (for understanding):
function parseMarkdownFrontmatter(source, filePath, options) {
  const match = source.match(FRONTMATTER_REGEX);
  if (!match) return { frontmatter: {}, content: source };
  const yamlHead = match[1] || "";
  const content = source.slice(match[0].length);
  const postProcess = (parsed) => parsed; // identity in 2.1.142, was richer in earlier builds
  let frontmatter = {};
  try {
    frontmatter = postProcess(canonicalizeKeys(parseYAML(yamlHead)));
  } catch {
    // First parse failed — try the auto-quote fixup
    try {
      const fixed = quoteUnquotedFrontmatterValues(yamlHead);
      frontmatter = postProcess(canonicalizeKeys(parseYAML(fixed)));
    } catch (err) {
      const where = filePath ? ` in ${filePath}` : "";
      log(`Failed to parse YAML frontmatter${where}: ${err instanceof Error ? err.message : err}`, { level: "warn" });
    }
  }
  return { frontmatter, content };
}

// Mapping: tO→parseMarkdownFrontmatter, H→source, $→filePath, q→options,
//          K→match, _→yamlHead, A→content, Y→frontmatter, iYH→parseYAML,
//          PVK→canonicalizeKeys, aI1→quoteUnquotedFrontmatterValues
```

### The Auto-Quote Fixup

The most common YAML error in agent files is an unquoted description containing a colon:

```yaml
description: Uses the API: pulls metrics, summarizes
```

YAML parses `Uses the API` as a *key* and `pulls metrics, summarizes` as a value, which then fails because the description field is supposed to be a string. `quoteUnquotedFrontmatterValues` rescans each `^key:\s+value` line, and if `value` contains anything not already in quotes and matches a regex of "looks problematic" (controlled by `oI1.test(z)`), it wraps `value` in double quotes with escaping.

The rationale: users write agent definitions in plain text editors; demanding strict YAML quoting would create an obscure failure mode. The double-pass approach gives strict YAML the first chance, then a lenient pass, then logs a warning rather than crashing.

### Key Canonicalization

`KNOWN_FRONTMATTER_KEYS` (`iI1`) is the union of every supported key across every kind of `.md` file Claude Code reads (agents, skills, output-styles, commands, plugin manifests). The set is built once into a `Map<normalized, canonical>` (`FRONTMATTER_KEY_INDEX`, `JAY`):

```javascript
JAY = new Map(iI1.map((H) => [rI1(H), H]));
```

When `parseMarkdownFrontmatter` calls `PVK` (`canonicalizeKeys`), each user-supplied key is normalized via `rI1` (`replace(/[-_]/g, "").toLowerCase()`) and looked up against `JAY`. So `Disable-Model-Invocation`, `disable_model_invocation`, and `disablemodelinvocation` all map to the canonical `disable-model-invocation`.

**Why this matters:** users routinely type `permission_mode` or `PermissionMode` or `permission-mode`. The canonical key in code is `permissionMode` (camelCase). Without normalization, the schema would reject these as unknown. With it, the value reaches the validator regardless of casing/separator.

## Agent-Specific Schema (`agentFrontmatterSchema`, `as1`)

The Zod schema for agent `.md` files lives at cli_inner_pretty.js:198717-198747. Each field validation, in declaration order:

### `name` (required, string)

The agent's identifier. Used by the Agent tool's `subagent_type` parameter and the `--agent <name>` flag. Description: *"Agent identifier. Required — this is how the Agent tool and `--agent` flag address it."*

The on-disk filename **without** `.md` is *also* used as the agent type when `name:` is absent or matches it. Specifically, `loadAgentsDir.ts` stores the basename in `filename` and the frontmatter `name` (if any) as the canonical `agentType`. Most agents have `name` matching the filename; mismatches are accepted but discouraged.

### `description` (required, string)

Shown in the Agent tool listing. *"When to use this agent. Required — shown in the Agent tool listing."* This is what the model sees when deciding whether to dispatch to this agent. The schema demands a non-empty string.

### `model` (optional, string)

Override model. Accepted aliases:
- `haiku`, `sonnet`, `opus` (resolved to the latest version of each)
- A full model ID like `claude-opus-4-7-20251201` (provider-specific)
- `inherit` (`"inherit"`) — keep the parent conversation's model; transformed to `'inherit'` even with mixed case

The `transform(m => (m.toLowerCase() === 'inherit' ? 'inherit' : m))` in the schema ensures that `Inherit`/`INHERIT` becomes the canonical `inherit`.

### `tools`, `disallowedTools` (optional, string-array via `yUH()`)

`tools` **replaces** the default tool set; the agent sees only these tools (plus mandatory ones). `disallowedTools` **subtracts** from the default; the agent sees all defaults minus these. If both are specified, `tools` takes precedence and `disallowedTools` is ignored (per the schema description: *"Tools removed from the default set. Ignored if `tools` is set."*).

The `yUH()` validator accepts either a comma-separated string (`"Read, Edit, Bash"`) or a YAML list. Both produce a `string[]`.

The fork-subagent path (`FORK_AGENT`) uses `tools: ['*']` with `useExactTools: true` — the literal star means "the parent's exact tool pool" so the API prefix is identical across all fork children for cache sharing.

### `color` (optional, string from `AGENT_COLOR_PALETTE`)

Display color for the agent's spinner and tab marker. Valid values: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` — the 8 colors in `AGENT_COLOR_PALETTE` (`Nf`, cli_inner_pretty.js:231368).

```javascript
Nf = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"];
UP = {
  red:    "red_FOR_SUBAGENTS_ONLY",
  blue:   "blue_FOR_SUBAGENTS_ONLY",
  green:  "green_FOR_SUBAGENTS_ONLY",
  yellow: "yellow_FOR_SUBAGENTS_ONLY",
  purple: "purple_FOR_SUBAGENTS_ONLY",
  orange: "orange_FOR_SUBAGENTS_ONLY",
  pink:   "pink_FOR_SUBAGENTS_ONLY",
  cyan:   "cyan_FOR_SUBAGENTS_ONLY",
};
```

The `UP` map associates each palette color with a theme key (`<color>_FOR_SUBAGENTS_ONLY`) so the theme can pick a different RGB for subagent UI than for main-loop UI without bleeding palette colors into chat content. This is the v2.1.140 "updated agent color palette" — the *labels* stayed the same but the *theme RGBs* keyed off them were tuned for better contrast across light/dark/high-contrast themes.

### `effort` (optional, string)

Thinking effort: `low`, `medium`, `high`, `max`, or an integer (token budget). Validated by `parseEffortValue` (`H0H`); rejected values fall through to `undefined` so the parent's effort is used.

### `permissionMode` (optional, string)

One of `default`, `acceptEdits`, `bypassPermissions`, `auto`, `plan`, `bubble`. `bubble` is the fork-subagent special: it surfaces permission prompts to the *parent* terminal rather than handling them inline.

For non-`acceptEdits`/`bypassPermissions`/`auto` modes, the parent's context applies normally; otherwise the agent's mode applies.

### `mcpServers` (optional, array)

Array of MCP server specs. Each element is either:
- A **string** — a reference to an MCP server already configured in `.mcp.json` / `mcpServers` settings.
- An **object** with one key — an inline definition: `{ "my-server": { type: "stdio", command: "...", args: [...] } }`.

When the agent starts, `initializeAgentMcpServers` (`g85`) walks `mcpServers[]` and either looks up the named server (`getMcpConfigByName`) or connects to the inline definition. Inline servers are *agent-scoped*: they're cleaned up when `runAgent` exits via `cleanup()` in the return value. Named/referenced servers are shared with the parent and not cleaned up.

See [mcpserver_inheritance.md](./mcpserver_inheritance.md) for the full lifecycle, the `strictPluginOnlyCustomization` admin-trust gate, and the v2.1.117/v2.1.101 fixes.

### `hooks` (optional, object)

Session-scoped hooks registered while this agent is running. The shape is identical to `settings.json` hooks — a map from event name (`PreToolUse`, `PostToolUse`, `Stop`, `SubagentStop`, etc.) to an array of `{ matcher, hooks: [{ type, command }] }`.

When the agent starts, `registerFrontmatterHooks` (`eo7`) attaches every hook to `sessionHooksRegistry` scoped to the agent's `agentId`. When `runAgent` exits, `sessionHooksRegistry.clear(agentId)` removes them. See [hook_inheritance.md](./hook_inheritance.md) for v2.1.116, v2.1.118, and v2.1.142 changes.

**v2.1.142 validation**: prompt-type and agent-type hooks for `SessionStart`/`Setup`/`SubagentStart` events now produce a clear "use a command-type hook instead" error. These event types fire **before** the model has any context, so the hook has nothing to operate on as a prompt-type hook.

### `maxTurns` (optional, number/string/null)

Maximum conversational turns before the agent stops itself. The schema allows `number`, `string`, or `null`. The string variant is for users typing `"50"` in YAML; `parsePositiveIntFromFrontmatter` coerces it. `null` disables the cap (uses the per-model default).

Built-in agents have explicit defaults — `FORK_AGENT.maxTurns = 200`, `Plan` and `Explore` use their own values, the catch-all default lives in `runAgent`.

### `initialPrompt` (optional, string)

*"Auto-submitted first message when this agent runs as the main session (via `--agent` or settings). Not read when spawned as a subagent."*

When `claude --agent code-reviewer` starts an interactive session, after model warm-up the REPL synthetically prepends `initialPrompt` as the first user message. The model then "speaks first" with whatever response that prompt elicits. Subagent spawns (via the Agent tool) **don't** use this — the parent's `prompt` field becomes the first user message, full stop.

This separation is why a code-reviewer agent can have `initialPrompt: "Ask the user which PR to review"` and behave as a self-introducing main session, but also be dispatched as a subagent with a specific prompt without the initialPrompt clobbering the parent's instruction.

### `memory` (optional, enum)

One of `user`, `project`, `local`. Sets the agent's `AgentMemoryScope`, which controls where the agent's persistent memory file is stored:
- `user` — `~/.claude/agent-memory/<name>.md`
- `project` — `<repo>/.claude/agent-memory/<name>.md`
- `local` — gitignored project-local

The memory is auto-loaded into the agent's system prompt via `loadAgentMemoryPrompt`.

### `background` (optional, boolean)

If `true`, every spawn of this agent runs as an async background task (the equivalent of always passing `run_in_background: true` to the Agent tool). Useful for long-running agents (`/loop`, `/schedule`) where the parent should never block.

### `isolation` (optional, enum)

`worktree` — every spawn creates a temporary git worktree (via `createAgentWorktree`) and runs the agent's filesystem operations there. The parent's files are untouched until the agent's worktree is committed or merged.

The TypeScript source also defines `remote` (CCR-launched, `external === 'ant'`-gated), which doesn't appear in the external v2.1.142 build.

### `skills` (optional, comma-separated or array)

Skill names to preload at agent start. After hook registration but before MCP setup, `runAgent` walks `agent.skills[]`, resolves each via `c85` (`resolveSkillByName`), and prepends the skill's content as a meta-attachment user message. See [skill_discovery_in_subagent.md](./skill_discovery_in_subagent.md).

### `requiredMcpServers` (optional, string-array — internal)

Names of MCP servers that *must* be present for the agent to be selectable. If a `requiredMcpServers` entry is not configured, `filterAgentsByMcpRequirements` removes the agent from `activeAgents`, so the model can't dispatch it. Plugin agents use this to gate themselves on the plugin's own MCP server.

### `criticalSystemReminder_EXPERIMENTAL` (optional, string — experimental)

A short message re-injected at every user turn (not just the system prompt). For agents whose behavior tends to drift over many turns. Marked `_EXPERIMENTAL` because it bloats every API request.

### `omitClaudeMd` (optional, boolean)

If true, the agent's `userContext` does **not** include the project's CLAUDE.md hierarchy. Built-in read-only agents (`Plan`, `Explore`) set this because they don't need commit/PR/lint guidelines — the main agent has full CLAUDE.md and interprets their output.

```javascript
// Plan agent's definition:
d88 = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [D7, kZ, G7, o4, VP],          // Agent, Edit, Write, Bash, ...
  source: "built-in",
  tools: ot.tools,
  baseDir: "built-in",
  model: "inherit",
  omitClaudeMd: !0,                               // ← read-only agent doesn't need CLAUDE.md
  getSystemPrompt: () => X5_(),
};
```

The savings are real: across 34M+ `Explore` spawns per week (per the comment in `loadAgentsDir.ts`), omitting CLAUDE.md saves ~5-15 Gtok/week. The kill-switch flag is `tengu_slim_subagent_claudemd`.

## Agent-Team Leader vs Teammate Frontmatter

When agent-teams is enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`), an agent definition can serve as either:

- **Team leader** — the agent that calls `spawnTeammate`. Its frontmatter `permissionMode`, `tools`, and `hooks` apply to itself. Teammates spawned by it inherit `permissionMode` from the leader as of v2.1.112 (was unconditionally `default`/`plan` in v2.1.88).
- **Teammate** — an agent dispatched to a team. Its frontmatter applies to itself; it sees its own `tools`, `mcpServers`, `hooks`. The team protocol layers SendMessage routing on top.

Subagent frontmatter and teammate frontmatter use the **same schema** (`as1`). The difference is whether the spawning call provides `team_name`/`name` (teammate) or only `subagent_type` (subagent). The schema doesn't have separate "team-leader" or "teammate" markers — the role is contextual to the spawn call site.

## Command-Level Frontmatter Cross-References

Two keys appear on **skill** and **command** frontmatter but not directly on agents. They influence how the model can invoke the agent indirectly:

### `disable-model-invocation`

Inherited from the *command-frontmatter* shared schema (`os1`, cli_inner_pretty.js:198640-198677): if a slash command (or a skill, since v2.1.118) has `disable-model-invocation: true`, the model cannot invoke it via the Skill tool — only the user typing `/<name>` triggers it. The skill listing surfaces it with `user-invocable-only` precedence (cli_inner_pretty.js:476890).

For an agent definition shipped as a *built-in slash command* (e.g. an `agent` shipped to surface via `/agent-name`), this key prevents the model from auto-launching the agent. Useful for agents with destructive side effects.

### `hide-from-slash-command-tool`

Hides the agent/command from the slash-command autocomplete entirely. Only known callers can dispatch it. Built-in housekeeping agents (`statusline-setup`) use this to keep their slash-trigger out of the user-facing menu.

## Color Palette: v2.1.140 Update

The 8-color palette listed above is unchanged in *names* from v2.1.112, but v2.1.140 changed the *theme-rendered shades* — better-contrast variants for both light and dark themes:

```
v2.1.139: red=#cc3344 / blue=#3344cc / green=#33cc44 ...
v2.1.140: red=adjusted / blue=adjusted / green=adjusted ... (theme-specific tables)
```

The `_FOR_SUBAGENTS_ONLY` suffix on the theme keys (in `UP`) ensures the subagent palette has its own pinhole into the theme table — a theme author can tune subagent colors independently of mainline accent colors.

## Validation Examples

### A valid minimal agent

```yaml
---
name: simple-helper
description: A simple assistant.
---
You are helpful.
```

Everything else takes defaults: model from parent, all tools, no MCP, no hooks, `permissionMode: default`, no color assigned (rotating from `agentColorIndex`).

### An invalid agent (caught by Zod)

```yaml
---
name: bad
description: ""
---
You are unfortunate.
```

`description: ""` fails `z.string().min(1, 'Description cannot be empty')`. Note: the JSON-source `AgentJsonSchema` enforces this; the Markdown-source path may be more lenient for legacy support, but the loader still warns.

### An agent with hooks the v2.1.142 validator rejects

```yaml
---
name: validator
description: Hooks experiment.
hooks:
  SubagentStart:
    - matcher: ".*"
      hooks:
        - type: prompt        # ← v2.1.142 rejects this for SubagentStart
          prompt: "Reminder..."
---
```

v2.1.142 raises: *"Configuring a prompt- or agent-type hook for `SessionStart`/`Setup`/`SubagentStart` now shows a clear 'use a command-type hook instead' error"*. The model has no transcript yet at `SubagentStart` so a prompt-type hook (which would inject a reminder into the next turn's prompt) makes no sense. Only `command`-type hooks (run an OS process) are accepted for these events.

## Key Insight

The agent definition schema is **declarative configuration over a uniform runtime**. Every agent runs through the same `runAgent` (`Vb`) pipeline; the differences are entirely in this YAML metadata. That's the design contract: **add a new behavior knob → add a frontmatter key → wire it once in `runAgent`**. The complexity is in the runtime, not in the per-agent definition.

The key-normalization map (`JAY`) is a small but important affordance: it lowers the cost of users writing the wrong casing or wrong separator and *significantly* reduces support churn for what would otherwise be silent "schema rejected, agent never appeared in list" failures. The cost — one Map lookup per key on file load — is paid only at startup or hot-reload.
