# Tool Inheritance — v2.1.142

## TL;DR

Subagents and teammates have a separate, smaller, frontmatter-controlled tool surface than the leader. v2.1.142 carries forward four inheritance dimensions, each with its own rules:

| Surface | Default Inherits? | Override Mechanism | Notable v2.1.x changes |
|---------|-------------------|--------------------|-----|
| **Built-in tools** (`Read`, `Edit`, `Bash`, `Agent`, `SendMessage`, …) | All available by default | `tools: [...]` allowlist in agent frontmatter, or `allowedTools` settings | Deferred-tool re-resolution (cli_unpack) |
| **MCP servers** | No (subagent has empty MCP pool) | `mcpServers: [...]` array in frontmatter (v2.1.117) | `--agent main-thread` now merges frontmatter MCP into the main session's pool |
| **Skills** | No (subagent has empty skill pool unless declared) | `skills: [...]` array in frontmatter (v2.1.133 unified Skill tool) | Subagent skill discovery happens at spawn via `findSkillByName` (`c85`) |
| **Hooks** | No (subagent's hooks come from session-wide registry + agent frontmatter merge) | `hooks: {...}` map in frontmatter (v2.1.117) | Settings hot-reload preserved |

The unifying principle: **a subagent is a sandboxed, scoped scope**. It inherits *nothing* from the spawning session by default, except where explicit composition has been wired (built-in tools), frontmatter declares (MCP/skills/hooks), or settings opt-in (allowedTools).

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agent Loop, Tools, Subagent
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Skills, Hooks
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — MCP

Key functions in this document:
- `agentMcpSpecsToScopedConfigs` (`QM6`) — extracts agent frontmatter `mcpServers` into a dynamic-config dict (cli_inner_pretty.js:231939-231960)
- `mergeAgentMcpConfigs` (`htH`) — merges agent-supplied MCP servers into the session's MCP pool (cli_inner_pretty.js:585945-585952)
- `findSkillByName` (`c85`) — subagent skill resolver with plugin-prefix and `:name` suffix matching (cli_inner_pretty.js:393461-393472)
- `applyAgentHooks` — invocation of `eo7` for `H.hooks` in the subagent context (cli_inner_pretty.js:393200)
- `mainThreadAgentDefinition` field on app state (set by `vp` setter; read by `kp` getter)
- `mainThreadAgentHooks` getter (`kp`)
- Settings: `strictMcpConfig`, `strictPluginOnlyCustomization` (gates agent-frontmatter MCP)
- Feature gates: `DX("mcp")`, `DX("hooks")` (admin disables for frontmatter)

---

## Built-in Tools

By default, an agent (lead or subagent) sees the full built-in tool set: `Read`, `Edit`, `Write`, `MultiEdit`, `Bash`, `Agent`, `Glob`, `Grep`, `WebFetch`, `WebSearch`, `Monitor`, `NotebookEdit`, `Skill`, `EnterWorktree`, `ExitWorktree`, `SendMessage`, `Task*`, `TodoWrite`, `Cron*`, etc. — **minus an always-stripped set** (next subsection).

### The Resolver: `filterToolsForAgent` (`JT6`) + `resolveAgentTools` (`Li`)

Two functions turn an `AgentDefinition`'s `tools`/`disallowedTools` fields plus
the parent pool into the agent's final tool list. They run for *every* agent —
built-in, custom, teammate, or fleet worker — so they're the ground truth for
"what can this agent actually call."

```javascript
// ============================================
// filterToolsForAgent - the always-applied baseline filter (independent of frontmatter)
// Location: cli_inner_pretty.js:339460-339475
// ============================================

// ORIGINAL (for source lookup):
function JT6({ tools: H, isBuiltIn: $, isAsync: q = !1, permissionMode: K }) {
  return H.filter((_) => {
    if (k0(_)) return !0;
    if (G1(_, NZ) && K === "plan") return !0;
    if (n3H.has(_.name)) return !1;
    if (!$ && Af6.has(_.name)) return !1;
    if (q && !hH8.has(_.name)) {
      if (eK() && DZ()) {
        if (G1(_, D7)) return !0;
        if (dlK.has(_.name)) return !0;
      }
      return !1;
    }
    return !0;
  });
}

// READABLE (for understanding):
function filterToolsForAgent({ tools, isBuiltIn, isAsync = false, permissionMode }) {
  return tools.filter((tool) => {
    if (isAlwaysAllowed(tool)) return true;                       // k0 — e.g. SyntheticOutput
    if (isTool(tool, ExitPlanMode) && permissionMode === "plan") return true;  // keep ExitPlanMode in plan mode
    if (ALL_AGENT_DISALLOWED_TOOLS.has(tool.name)) return false;  // n3H — stripped from EVERY agent
    if (!isBuiltIn && CUSTOM_AGENT_DISALLOWED_TOOLS.has(tool.name)) return false; // Af6 — custom only
    if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {   // hH8 — async/background allowlist
      if (isAnt() && isAntAgentToolsEnabled()) {                  // ant builds: extra async allowances
        if (isTool(tool, Agent)) return true;                     // async Agent allowed for ant
        if (IN_PROCESS_TEAMMATE_ALLOWED_TOOLS.has(tool.name)) return true; // dlK
      }
      return false;
    }
    return true;
  });
}

// Mapping: JT6→filterToolsForAgent, k0→isAlwaysAllowed, G1→isTool, NZ→ExitPlanMode,
//          n3H→ALL_AGENT_DISALLOWED_TOOLS, Af6→CUSTOM_AGENT_DISALLOWED_TOOLS,
//          hH8→ASYNC_AGENT_ALLOWED_TOOLS, dlK→IN_PROCESS_TEAMMATE_ALLOWED_TOOLS,
//          D7→Agent, eK→isAnt, DZ→isAntAgentToolsEnabled
```

The constant sets (cli_inner_pretty.js:211699-211703):

- **`ALL_AGENT_DISALLOWED_TOOLS` (`n3H`)** = `{ TaskOutput (`$n`), ExitPlanMode (`NZ`), EnterPlanMode (`Q3H`), Agent (`D7`), AskUserQuestion (`Gz`), WaitForMcpServers (`l3H`), ScheduleWakeup (`nf`) }`. **Stripped from every agent, regardless of `tools: ["*"]`.** This is why even a full-pool `general-purpose` or `claude` worker cannot re-dispatch `Agent`, force `EnterPlanMode`, or block the loop on `AskUserQuestion`/`WaitForMcpServers` — those are leader-only orchestration verbs. (The `ExitPlanMode`-in-plan-mode early-return at line 339463 is the one re-admission: a plan-mode agent keeps `ExitPlanMode` so it can finish planning.)
- **`CUSTOM_AGENT_DISALLOWED_TOOLS` (`Af6`)** = `new Set([...n3H])` — currently identical content to `n3H`, applied only to non-built-in agents. The separate set exists so the custom-agent denylist can diverge from the universal one in future without touching built-ins; today it's a structural no-op (the `n3H` check already fired).
- **`ASYNC_AGENT_ALLOWED_TOOLS` (`hH8`)** — when an agent runs `isAsync` (a backgrounded subagent / `run_in_background`), *only* these survive (read/search/edit tools, Skill, etc.). The exception: ant builds with the ant-agent-tools flag re-admit `Agent` and the `IN_PROCESS_TEAMMATE_ALLOWED_TOOLS` (`dlK`) set, so an ant async agent can still spawn teammates.

```javascript
// ============================================
// resolveAgentTools - apply ["*"] wildcard / explicit allowlist / disallowedTools
// Location: cli_inner_pretty.js:339476-339541
// ============================================

// ORIGINAL (for source lookup — key wildcard/disallow branch, 339476-339490):
function Li(H, $, q = !1, K = !1) {
  let { tools: _, disallowedTools: A, source: z, permissionMode: Y } = H,
    f = K ? $ : JT6({ tools: $, isBuiltIn: z === "built-in", isAsync: q, permissionMode: Y }),
    O = new Set(), M = new Set();
  for (let v of A ?? []) { let { toolName: E, ruleContent: I } = jO(v); if ((O.add(E), !I)) M.add(E); }
  let w = f.filter((v) => !O.has(v.name));
  if (_ === void 0 || (_.length === 1 && _[0] === "*"))
    return { hasWildcard: !0, validTools: [], invalidTools: [], unavailableTools: [], resolvedTools: w };
  /* ...allowlist resolution into validTools/invalidTools/unavailableTools (339491-339532)... */
}

// READABLE (for understanding — control flow):
function resolveAgentTools(agentDef, parentPool, isAsync = false, skipBaselineFilter = false) {
  const { tools, disallowedTools, source, permissionMode } = agentDef;

  // (1) baseline filter (unless caller opts out)
  const filtered = skipBaselineFilter ? parentPool
    : filterToolsForAgent({ tools: parentPool, isBuiltIn: source === "built-in", isAsync, permissionMode });

  // (2) subtract disallowedTools (parsed via permissionRuleValueFromString → {toolName, ruleContent})
  const disallowedNames = new Set(), contentlessDisallowed = new Set();
  for (const rule of disallowedTools ?? []) {
    const { toolName, ruleContent } = permissionRuleValueFromString(rule);  // jO
    disallowedNames.add(toolName);
    if (!ruleContent) contentlessDisallowed.add(toolName);
  }
  const afterDisallow = filtered.filter((t) => !disallowedNames.has(t.name));

  // (3) WILDCARD: tools undefined or ["*"] → the whole (filtered, disallow-subtracted) pool
  if (tools === undefined || (tools.length === 1 && tools[0] === "*"))
    return { hasWildcard: true, resolvedTools: afterDisallow, validTools: [], invalidTools: [], unavailableTools: [] };

  // (4) ALLOWLIST: resolve each requested name → valid / invalid / unavailable buckets
  //     (unavailable = present in the full pool but removed by the baseline filter — surfaced
  //      so the UI can say "(unavailable)" instead of "(invalid)"). Special Agent handling
  //      parses allowedAgentTypes from the rule content (e.g. Agent(code-reviewer)).
  //     ... + an embedded-search substitution: when hasEmbeddedSearchTools() and the agent
  //         asked for Glob/Grep but has no Bash, swap in the embedded find/grep tools.
}

// Mapping: Li→resolveAgentTools, jO→permissionRuleValueFromString, dM→hasEmbeddedSearchTools,
//          D7→Agent, Sq→Bash, d1→Glob, v9→Grep
```

**Three resolution outcomes** the allowlist branch distinguishes (returned to
the `/agents` validator and the dispatcher):
- `validTools` / `resolvedTools` — requested and available.
- `invalidTools` — requested but no such tool exists (typo / removed tool).
- `unavailableTools` — the tool exists in the pool but the baseline filter
  removed it for this agent (e.g. a custom agent listing `Agent`). Surfaced
  separately so the UI shows "(unavailable)" rather than "(invalid)".

This is the same `resolveAgentTools` the `/agents` UI's `validateAgent` calls
to flag bad tool names (see the *Validation* section of
[agent_management_ui.md](./agent_management_ui.md)) — UI and runtime can't
disagree on what's a valid tool.

### Allowlisting via Frontmatter

A custom agent can restrict itself via its frontmatter:

```yaml
---
name: code-reviewer
tools: [Read, Grep, Bash, Skill]
---
```

The agent then sees *only* the listed tools. This is enforced at agent-tool-discovery time in the dispatcher.

The default (no `tools` key) is "all tools available". This is intentionally permissive: forcing every custom agent to enumerate built-ins would be tedious, and the security boundary is provided by `permissions.*` rules, not by the tool list.

### Settings-Level `allowedTools`

Independent of frontmatter, `settings.permissions.allowedTools` provides a session-wide allowlist. The intersection of:
- Agent frontmatter tool list (if any)
- Settings `allowedTools` (if any)
- Built-in default set

is the agent's effective tool surface.

### Deferred-Tool Re-resolution

Several tools (`EnterWorktree`, `Monitor`, `TaskStop`, `WebFetch`, `WebSearch`, etc.) are *deferred*: their schemas aren't loaded until invoked. When a subagent inherits, the deferred-tool registry must be re-resolved against the subagent's permission context — because `WebFetch` (say) may be permission-restricted in the subagent even when allowed in the leader.

The re-resolution happens in the Agent tool's spawn branch (in v2.1.142 around `cli_inner_pretty.js:351334-351413`), which builds the subagent's tool list from:
1. The full registered tool pool (`registerTool` outputs).
2. Filtered by `agentDefinition.tools` if frontmatter declared.
3. Filtered by `toolPermissionContext` (the subagent's own permission rules).
4. With deferred tools re-resolved against the new context.

The deferred-tool re-resolution is necessary because a permission rule like `WebFetch(*)` might apply only when invoked from the main thread; a subagent might have a stricter version. Loading the tool's actual schema would risk leaking the leader's permission context into the subagent.

---

## MCP Servers

The most consequential v2.1.117 change in this area: agent frontmatter can now declare MCP servers, and those servers are merged into the subagent's (or `--agent main-thread`'s) MCP pool.

### Frontmatter Format

```yaml
---
name: docs-helper
mcpServers:
  - searxng: { command: searxng-mcp, transport: stdio }
  - playwright: { command: playwright-mcp, transport: stdio }
---
```

Each entry is an object with exactly one key (the server name), and the value is the standard MCP server config.

### Extraction

```javascript
// ============================================
// agentMcpSpecsToScopedConfigs - Extract frontmatter MCP into a dynamic-config dict
// Location: cli_inner_pretty.js:231939-231960
// ============================================

// ORIGINAL (for source lookup):
function QM6(H) {
  if (!H.mcpServers?.length) return {};
  if (DX("mcp") && !B7H(H.source))
    return (
      N(`[Agent: ${H.agentType}] Skipping frontmatter MCP servers: strictPluginOnlyCustomization locks MCP to plugin-only (agent source: ${H.source})`),
      {}
    );
  let $ = {};
  for (let q of H.mcpServers) {
    if (typeof q === "string") continue;
    let K = Object.entries(q);
    if (K.length !== 1) {
      N(`[Agent: ${H.agentType}] Invalid MCP server spec: expected exactly one key`, { level: "warn" });
      continue;
    }
    let [_, A] = K[0];
    $[_] = { ...A, scope: "agent" };
  }
  return $;
}

// READABLE (for understanding):
function agentMcpSpecsToScopedConfigs(agentDef) {
  if (!agentDef.mcpServers?.length) return {};

  // Org policy: strictPluginOnlyCustomization locks MCP to plugin-sourced declarations only.
  if (isPolicyEnforced("mcp") && !isPluginSourced(agentDef.source)) {
    log(`[Agent: ${agentDef.agentType}] Skipping frontmatter MCP servers: strictPluginOnlyCustomization locks MCP to plugin-only (agent source: ${agentDef.source})`);
    return {};
  }

  const scoped = {};
  for (const entry of agentDef.mcpServers) {
    if (typeof entry === "string") continue;       // string-form is for "reference an existing server", handled elsewhere
    const pairs = Object.entries(entry);
    if (pairs.length !== 1) {
      log(`[Agent: ${agentDef.agentType}] Invalid MCP server spec: expected exactly one key`, { level: "warn" });
      continue;
    }
    const [name, config] = pairs[0];
    scoped[name] = { ...config, scope: "agent" };   // tag as agent-scoped for cleanup
  }
  return scoped;
}

// Mapping: QM6→agentMcpSpecsToScopedConfigs, H→agentDef, DX→isPolicyEnforced, B7H→isPluginSourced
```

### Merge into Session Pool

```javascript
// ============================================
// mergeAgentMcpConfigs - Merge agent-supplied MCP servers into the session MCP pool
// Location: cli_inner_pretty.js:585945-585952
// ============================================

// ORIGINAL (for source lookup):
function htH(H, $, q) {
  if (!$ || q?.strictMcpConfig || KQ()) return H;
  let K = QM6($);
  if (Object.keys(K).length === 0) return H;
  let { allowed: _, blocked: A } = te(K);
  if (A.length > 0) q?.onBlocked?.(A);
  return { ..._, ...H };
}

// READABLE (for understanding):
function mergeAgentMcpConfigs(sessionMcpConfig, agentDef, options) {
  if (!agentDef) return sessionMcpConfig;
  if (options?.strictMcpConfig) return sessionMcpConfig;      // `--strict-mcp-config` opted out of dynamic injection
  if (isManagedNoMcp()) return sessionMcpConfig;              // managed-policy blocks all dynamic MCP
  const agentScoped = agentMcpSpecsToScopedConfigs(agentDef);
  if (Object.keys(agentScoped).length === 0) return sessionMcpConfig;
  const { allowed, blocked } = applyMcpAllowDenyRules(agentScoped);
  if (blocked.length > 0) options?.onBlocked?.(blocked);
  // Session-level configs OVERRIDE agent-supplied ones for the same name.
  return { ...allowed, ...sessionMcpConfig };
}

// Mapping: htH→mergeAgentMcpConfigs, H→sessionMcpConfig, $→agentDef, q→options,
//          QM6→agentMcpSpecsToScopedConfigs, te→applyMcpAllowDenyRules, KQ→isManagedNoMcp
```

### Merge Order: Session Wins

Notice the `return { ...allowed, ...sessionMcpConfig }` — session-level MCP configs take precedence over agent-supplied ones. Why this order?

**What it does:** Session-level overrides agent-supplied for same-name MCP servers.

**Why this approach:**
- An agent's frontmatter is a *suggestion*: "if you have a `playwright` MCP server, here's a default config." The user's `.mcp.json` (session level) has the user's *actual* preferences.
- If both define `playwright`, the user's spec should win because the user knows their environment (paths, auth tokens) better than the agent author.
- The agent gets its `playwright` server *only* if the user hadn't already configured one — useful for "borrowed" agents that come with sane defaults.

**Alternative considered:** Agent overrides session. Would mean every custom agent could replace user's curated config with its own version, breaking user expectations. Rejected.

### `--strict-mcp-config` Opt-Out

The agent-view dispatcher (v2.1.142, unit 08) added `--strict-mcp-config` as a flag. When set, `mergeAgentMcpConfigs` short-circuits — *no* agent-frontmatter MCP merge happens. This is useful for power users who want their `.mcp.json` to be the *only* source of MCP truth.

### `--agent main-thread` Special Case

When a user runs `claude --agent docs-helper` (v2.1.117's `mainThreadAgentDefinition` path), the docs-helper agent becomes the *main thread* of the session — not a subagent. In this case, `mergeAgentMcpConfigs` is called at session startup against the *main* MCP config (rather than a subagent's), so the main thread inherits frontmatter MCP servers.

The code path: `f$A` / `ResumeConversation` and similar session-bootstrap helpers call `htH(_ ?? {}, u.mainThreadAgentDefinition, { strictMcpConfig: f })`. The `mainThreadAgentDefinition` slot holds the resolved agent — set by `vp()` (`setMainThreadAgentType`) during agent-definition setup.

### Managed-Org Gates

Two policies further restrict frontmatter MCP injection:

1. **`strictPluginOnlyCustomization`** (settings key `experimental.strictPluginOnlyCustomization` or feature flag `tengu_strict_plugin_only_customization`): agent MCP injection is allowed *only* for plugin-sourced agents. User-defined agents (`source: "user"` or `"project"`) get their frontmatter MCP silently dropped, with a log message. This is for enterprises that want to vendor approved agents through plugins and forbid local-only customizations.

2. **`isManagedNoMcp()`**: hard block of all dynamic MCP. If set, *all* frontmatter MCP injection is dropped, regardless of source.

Both gates are part of the `DX(...)` "managed-feature" guard family.

---

## Skills

Skills (v2.1.133 unified `Skill` tool) are discovered and resolved differently in subagents than in the leader.

### Main-Thread Skill Discovery

The main thread discovers skills by walking the file tree (`.claude/skills/`, `~/.claude/skills/`, plugin-sourced `skills/` dirs, plus root-level `SKILL.md` for plugins per v2.1.142 changelog item *"Plugins with a root-level SKILL.md and no skills/ subdirectory are now surfaced as a skill"*). The full set is filtered by:
1. `sessionSkillAllowlist` (set by `gv8`) — explicit allowlist for the main session.
2. Plugin-source filters.
3. Disabled-skill rules.

### Subagent Skill Discovery

A subagent has a *much* smaller default skill pool: only the skills explicitly listed in its frontmatter `skills:` array. The subagent never auto-loads `.claude/skills/`.

The resolution happens in the agent-spawn helper around `cli_inner_pretty.js:393200`:

```javascript
let NH = H.skills ?? [];
if (NH.length > 0) {
  let $$ = await gZ(R9()), G$ = [];
  for (let S$ of NH) {
    let m$ = c85(S$, $$, H);
    if (!m$) {
      N(`[Agent: ${H.agentType}] Warning: Skill '${S$}' specified in frontmatter was not found`, { level: "warn" });
      continue;
    }
    /* ... resolve InH(m$, $$) → prompt skill, add to context ... */
  }
}
```

The `c85` function (`findSkillByName`) is the subagent's skill resolver:

```javascript
// ============================================
// findSkillByName - Subagent skill resolution with plugin prefix and :suffix matching
// Location: cli_inner_pretty.js:393461-393472
// ============================================

// ORIGINAL (for source lookup):
function c85(H, $, q) {
  if (gL$(H, $)) return H;
  let K = u7(q.agentType, ":");
  if (K) {
    let z = `${K}:${H}`;
    if (gL$(z, $)) return z;
  }
  let _ = `:${H}`, A = $.find((z) => z.name.endsWith(_));
  if (A) return A.name;
  return null;
}

// READABLE (for understanding):
function findSkillByName(requested, allSkills, agentDef) {
  // (1) Try exact match.
  if (skillExists(requested, allSkills)) return requested;

  // (2) Try plugin-qualified: "plugin-x:requested" if the agent itself is plugin-prefixed.
  const pluginPrefix = extractPluginPrefix(agentDef.agentType, ":");
  if (pluginPrefix) {
    const qualified = `${pluginPrefix}:${requested}`;
    if (skillExists(qualified, allSkills)) return qualified;
  }

  // (3) Try suffix match: any skill name ending with ":requested".
  const suffix = `:${requested}`;
  const match = allSkills.find((s) => s.name.endsWith(suffix));
  if (match) return match.name;

  return null;
}

// Mapping: c85→findSkillByName, H→requested, $→allSkills, q→agentDef,
//          gL$→skillExists, u7→extractPluginPrefix
```

The three-tier resolution exists because:
1. **Exact match** handles the common case (the user wrote the exact skill name).
2. **Plugin-qualified match** handles agents *inside* a plugin that reference sibling skills by short name: a `plugin-x:my-agent` agent can say `skills: [helper]` and have it resolve to `plugin-x:helper`.
3. **Suffix match** handles agents wanting to use a specific plugin's skill: writing `:helper` (with the leading colon) matches any skill ending with `:helper`, e.g., `acme:helper`.

The order means exact takes precedence; the suffix match is the most lenient and is the fallback.

### Settings Hot-Reload of Skills

The main thread's skill discovery is refreshed on `ConfigChange` (when settings change at runtime). Subagent skills are *not* refreshed mid-execution: a subagent's skill set is locked at spawn time. This is by design — a long-running subagent shouldn't have its capabilities shift under its feet.

---

## Hooks

### Session-Wide Hooks Registry

Each session has a `sessionHooksRegistry` (built by `eo7` and merged across sources):
1. User settings hooks (`~/.claude/settings.json` → `hooks: {...}`).
2. Project settings hooks (`./.claude/settings.json` → same).
3. Plugin-supplied hooks (from each enabled plugin's `hooks` config).
4. Agent-frontmatter hooks (added when a subagent is invoked).

### Agent-Frontmatter Hooks Injection

When a subagent is invoked, its frontmatter `hooks:` map is added to the registry:

```javascript
// Excerpt from spawn branch (cli_inner_pretty.js:393199-393201):
let PH = !DX("hooks") || B7H(H.source);
if (H.hooks && PH) eo7(q.sessionHooksRegistry, u, H.hooks, `agent '${H.agentType}'`, !0);
```

The `!DX("hooks") || B7H(H.source)` predicate enforces the managed-org gate: if `strictPluginOnlyCustomization` blocks hooks AND the agent is not plugin-sourced, the hooks are dropped silently.

Hooks added this way are *scoped to the subagent's lifetime* — when the subagent finishes, the registry is rolled back. This is symmetric with MCP: dynamic injection lives only for the duration of the spawning agent's execution.

### `mainThreadAgentHooks` Slot

For `--agent main-thread` sessions (v2.1.117 `mainThreadAgentDefinition`), there's a dedicated slot in the app state: `mainThreadAgentHooks`. The getter `kp()` and setter `dv$()` (cli_inner_pretty.js:3085, 3089) provide access; the slot is populated during the session-bootstrap phase by `eo7(..., true)` against the agent's frontmatter hooks.

This is the v2.1.117 "frontmatter hooks for --agent main-thread" feature: hooks declared by an agent invoked as the main session participate fully in the lifecycle, including `SessionStart`, `Setup`, etc.

### Hook-Type Gating (v2.1.142)

The v2.1.142 changelog item *"Improved hook configuration error: configuring a prompt- or agent-type hook for SessionStart/Setup/SubagentStart now shows a clear 'use a command-type hook instead' error"* documents a UX improvement on hook validation. Some hook events (SessionStart, Setup, SubagentStart) can only run `type: "command"` hooks — `type: "prompt"` or `type: "agent"` hooks for these events are nonsensical because there's no surrounding turn to inject into. v2.1.142's improved error message guides users to switch to the command type.

This is not strictly an *inheritance* change — it's an *authoring-experience* change. But it affects what hooks survive into a subagent: an agent-type hook attached to `SubagentStart` would silently fail to run; the error message now surfaces this.

---

## What Doesn't Inherit

Several leader-side facts are *not* propagated to subagents/teammates:

| Surface | Why it doesn't inherit |
|---------|------------------------|
| **Conversation transcript** | Subagents start with a clean slate; they get only the spawning prompt. |
| **Open Edit drafts** | Edits in progress in the leader's buffer have no analog in the subagent. |
| **TUI state** (input focus, scroll position, etc.) | Each agent has its own UI state when attached. |
| **`@`-mentioned files** | The leader pre-resolves these into the prompt; subagent never sees the `@` syntax. |
| **Recent message history** for compaction context | Subagent's context window starts fresh. |
| **Hot-reloaded skill cache** | Subagent skill set is locked at spawn (see above). |
| **MCP server *connections*** (vs configs) | Subagent gets the *config*; the actual connection is freshly established. |

The general pattern: **state** doesn't inherit; **configuration** may (via frontmatter).

---

## Worked Example: Spawning a Worktree-Isolated, MCP-Decorated Subagent

A user defines `~/.claude/agents/code-explorer.md`:

```yaml
---
name: code-explorer
description: Explore the repository's structure and key abstractions
isolation: worktree
tools: [Read, Glob, Grep, Skill, EnterWorktree, ExitWorktree]
permissionMode: acceptEdits
mcpServers:
  - lsp: { command: claude-lsp, transport: stdio }
skills: [code-walker, doc-summary]
hooks:
  SessionStart:
    - { type: command, command: "echo 'code-explorer starting'" }
---
You are a senior engineer exploring an unfamiliar codebase...
```

When the leader dispatches this via `Agent({subagent_type: "code-explorer", description: ..., prompt: ...})`:

1. **Tool filtering** — the subagent's tool surface is reduced to the 7 declared.
2. **Permission mode** — `acceptEdits` (frontmatter), no leader inheritance.
3. **Worktree** — created at `.claude/worktrees/code-explorer-<hash>` via `EnterWorktree`.
4. **MCP injection** — `lsp` server is merged into the subagent's MCP pool via `mergeAgentMcpConfigs`. The leader's MCP servers are *not* available to the subagent.
5. **Skills** — `code-walker` and `doc-summary` are resolved via `findSkillByName` against the available pool. If both are in the user's `~/.claude/skills/`, they're loaded; otherwise warnings are logged for missing names.
6. **Hooks** — the `SessionStart` command hook is added to the subagent's effective hook registry. When the subagent's turn loop starts, the echo command fires.
7. **Conversation** — the subagent's first message is the leader's `prompt` parameter, wrapped in the `<teammate>` XML.

The leader's transcript, MCP servers, hooks, and skill cache are untouched.

---

## Worked Example: `--agent main-thread`

A user runs `claude --agent code-explorer` from the shell.

The session bootstrap:
1. **Resolves** `code-explorer` against the agent registry — same agent definition.
2. **Sets `mainThreadAgentDefinition`** to the resolved agent.
3. **Merges** the agent's MCP servers into the *session* MCP config (not just a subagent's).
4. **Sets `mainThreadAgentHooks`** so the session-level hook registry includes the agent's declarations.
5. **Loads skills** from the agent's `skills:` array as the main-thread skill set (instead of the default scan).
6. **Sets `mainThreadAgentType`** for `tengu_subagent_type` telemetry tagging.

Now any tool call, hook fire, MCP server access, or skill invocation in this session sees the agent's declared configuration *as if* the user typed it. The session is "the agent" in spirit — but the model interacts with the surface exactly as it would in a regular session.

The key difference between this and a subagent dispatch: there's no "spawn an agent → run it → return" boundary. The session *is* the agent for its entire lifetime.

---

## See Also

- [permission_inheritance.md](./permission_inheritance.md) — Permission mode is independent of tool inheritance
- [worktree_isolation.md](./worktree_isolation.md) — Worktree isolation is sometimes co-declared with tool restrictions
- [mailbox_protocol.md](./mailbox_protocol.md) — Inter-agent communication, orthogonal to tool surface
- v2.1.112 baseline: `implementation.md` for the v2.1.112 subagent skeleton (tool inheritance was simpler then)
