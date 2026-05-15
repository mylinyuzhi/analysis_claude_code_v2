# Tool: Skill — Slash-Skill Invocation

> **Identity:** wire-name `Skill`, `isReadOnly` not declared (varies), `isConcurrencySafe` not declared (skill-dependent), `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:353504-353795` (declaration), `assets/tools/Skill.md` (tool def).
> **TypeScript baseline:** `src/tools/SkillTool/SkillTool.ts` (v2.1.88).

The Skill tool lets the model invoke a slash-command skill (`/init`, `/review`, `/security-review`, plugin-provided `/foo:bar`, user-authored `.claude/skills/<name>/SKILL.md`) by name, with optional args. It's how skills become callable from within an agent's tool-use stream rather than only from human-typed prompts.

This document covers the v2.1.142 Skill tool — schema, validateInput, checkPermissions, the inline-vs-fork execution split, regex-safe args (v2.1.139), the v2.1.142 root SKILL.md plugin feature, and `skillOverrides` settings (v2.1.129).

---

## Overview

Skills are markdown templates that expand into a system prompt + tool allowlist. When invoked:

- **Inline skills** (`context: undefined` or not "fork"): the skill's prompt is appended to the parent's user message, the agent continues in the same conversation. Useful for short skills like `/init` that need to read files and produce a single result.
- **Forked skills** (`context: "fork"`): the skill runs as a forked subagent with its own context. Useful for skills like `/review` that involve long multi-step work.

The decision is made by the skill author via the frontmatter `context: fork` field.

---

## Input Schema (`Kl_`)

```javascript
// ============================================
// skillInputSchema - Slash-skill name + optional args
// Location: cli_inner_pretty.js:353504-353509 (Kl_)
// ============================================

// ORIGINAL (for source lookup):
Kl_ = yH(() =>
  y.object({
    skill: y.string().describe("The name of a skill from the available-skills list. Do not guess names."),
    args: y.string().optional().describe("Optional arguments for the skill"),
  }),
);

// READABLE (for understanding):
skillInputSchema = lazy(() =>
  z.object({
    skill: z.string().describe("Skill name from available-skills list"),
    args: z.string().optional().describe("Optional arguments for the skill"),
  }),
);

// Mapping: Kl_→skillInputSchema, yH→lazy, y→z
```

The output schema (`_l_`) is a union of inline-completion and forked-completion records.

---

## validateInput — Skill Name Resolution

The validator decides whether the skill exists, whether the model is allowed to invoke it, and whether it's the right *kind* of skill (prompt-type, not local-jsx or built-in CLI):

```javascript
// ============================================
// validateSkillInput - Skill name validation with error code mapping
// Location: cli_inner_pretty.js:353543-353603 (in SnH.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ skill: H }, $) {
  let q = H.trim();
  if (!q) return { result: !1, message: `Invalid skill format: ${H}`, errorCode: 1 };
  let K = q.startsWith("/");
  if (K) d("tengu_skill_tool_slash_prefix", {});
  let _ = K ? q.substring(1) : q,
    A = $.agentId === void 0 ? Np() : void 0,
    z = await yV6($),
    Y = Xy(_, z);
  if (!Y) {
    let O = VnH(_, z.map((M) => ({ name: m_(M), aliases: M.aliases })), { maxEditDistance: 2 });
    return { result: !1, message: O ? `Unknown skill: ${_}. Did you mean ${O}?` : `Unknown skill: ${_}`, errorCode: 2 };
  }
  if (Y.disableModelInvocation && !Am7(_, $))
    return { result: !1, message: `Skill ${_} cannot be used with ${fX} tool due to disable-model-invocation`, errorCode: 4 };
  if (A !== void 0 && Q7H([Y], A).length === 0)
    return { result: !1, message: `Skill ${_} is not in this session's skills allowlist`, errorCode: 8 };
  let f = st(Y);
  if (f === "off" || (f === "user-invocable-only" && !Am7(_, $)))
    return { result: !1, message: `Skill ${_} is disabled for model invocation in skillOverrides settings`, errorCode: 7 };
  if (Y.type !== "prompt") {
    let O = Y.type === "local-jsx" ? "UI" : "built-in CLI";
    return { result: !1, message: `${_} is a ${O} command, not a skill. Ask the user to run /${_} themselves ...`, errorCode: 5 };
  }
  return { result: !0 };
}

// READABLE (for understanding):
async function validateSkillInput({ skill: rawSkillName }, validationContext) {
  // Step 1: Strip whitespace and leading slash
  const trimmed = rawSkillName.trim();
  if (!trimmed) {
    return { result: false, message: `Invalid skill format: ${rawSkillName}`, errorCode: 1 };
  }
  const hadSlashPrefix = trimmed.startsWith("/");
  if (hadSlashPrefix) logEvent("tengu_skill_tool_slash_prefix", {});
  const skillName = hadSlashPrefix ? trimmed.substring(1) : trimmed;

  // Step 2: Session allowlist check (--allowedTools / --allowedSkills cli flags)
  const sessionAllowedSkills = validationContext.agentId === undefined ? getSessionAllowedSkills() : undefined;

  // Step 3: Lookup the skill definition
  const allCommands = await getCommandsIncludingMcpPrompts(validationContext);
  const skillDef = findCommandByName(skillName, allCommands);
  if (!skillDef) {
    // Levenshtein suggestion (max edit distance 2)
    const suggestion = suggestNearestCommand(skillName, allCommands.map(c => ({ name: getCommandName(c), aliases: c.aliases })), { maxEditDistance: 2 });
    return {
      result: false,
      message: suggestion ? `Unknown skill: ${skillName}. Did you mean ${suggestion}?` : `Unknown skill: ${skillName}`,
      errorCode: 2,
    };
  }

  // Step 4: disableModelInvocation frontmatter
  if (skillDef.disableModelInvocation && !wasUserTypedSlash(skillName, validationContext)) {
    return { result: false, message: `Skill ${skillName} cannot be used with Skill tool due to disable-model-invocation`, errorCode: 4 };
  }

  // Step 5: Session allowlist enforcement
  if (sessionAllowedSkills !== undefined && filterByAllowedSkills([skillDef], sessionAllowedSkills).length === 0) {
    return { result: false, message: `Skill ${skillName} is not in this session's skills allowlist`, errorCode: 8 };
  }

  // Step 6: skillOverrides setting (off | user-invocable-only | on)
  const override = getSkillOverride(skillDef);
  if (override === "off" || (override === "user-invocable-only" && !wasUserTypedSlash(skillName, validationContext))) {
    return { result: false, message: `Skill ${skillName} is disabled for model invocation in skillOverrides settings`, errorCode: 7 };
  }

  // Step 7: Type gate — only prompt-type skills can be invoked
  if (skillDef.type !== "prompt") {
    const kind = skillDef.type === "local-jsx" ? "UI" : "built-in CLI";
    return {
      result: false,
      message: `${skillName} is a ${kind} command, not a skill. Ask the user to run /${skillName} themselves — it cannot be invoked via the Skill tool.`,
      errorCode: 5,
    };
  }

  return { result: true };
}

// Mapping: H→rawSkillName, $→validationContext, q→trimmed, K→hadSlashPrefix, _→skillName,
//          A→sessionAllowedSkills, z→allCommands, Y→skillDef, f→override, fX→SKILL_TOOL_NAME,
//          Np→getSessionAllowedSkills, yV6→getCommandsIncludingMcpPrompts, Xy→findCommandByName,
//          VnH→suggestNearestCommand, m_→getCommandName, Q7H→filterByAllowedSkills,
//          st→getSkillOverride, Am7→wasUserTypedSlash, d→logEvent
```

### Error Code Reference

| Code | Condition | Meaning |
|------|-----------|---------|
| 1 | empty/whitespace-only `skill` | invalid input |
| 2 | skill not found | suggests nearest if within edit distance 2 |
| 4 | `disableModelInvocation: true` and not user-typed | author opted out of model invocation |
| 5 | type is `local-jsx` or `built-in` | not a prompt-skill (UI / CLI command) |
| 7 | `skillOverrides` setting blocks it | user/admin disabled via config |
| 8 | not in session allowlist | CLI `--allowedTools` restricts it |

### `Am7` — Was-User-Typed Detector (v2.1.139)

```javascript
// ============================================
// wasUserTypedSlash - Regex-safe scan for user-typed /<skill> in transcript
// Location: cli_inner_pretty.js:353362-353375 (Am7)
// ============================================

// ORIGINAL (for source lookup):
function Am7(H, $) {
  if ($.agentId !== void 0) return !1;
  let q = new RegExp(`(?<!\\S)/${Vx(H)}(?=$|\\s)`);
  for (let K = $.messages.length - 1; K >= $.turnStartIndex; K--) {
    let _ = $.messages[K];
    if (_.type !== "user" || _.isMeta) continue;
    let A = _.message.content;
    if (typeof A === "string") {
      if (A.includes(`<${pG}>`)) continue;
    } else if (A.some((z) => z.type === "tool_result")) continue;
    if (q.test(Wb(_) ?? "")) return !0;
  }
  return !1;
}

// READABLE (for understanding):
function wasUserTypedSlash(skillName, validationContext) {
  // Subagents can't invoke via "user typed" — only the main thread can
  if (validationContext.agentId !== undefined) return false;

  // Regex-escape the skill name to prevent injection. Match `/skillname` with:
  //   - (?<!\S) before: preceded by start-of-string or whitespace
  //   - (?=$|\s) after:  followed by end-of-string or whitespace
  const pattern = new RegExp(`(?<!\\S)/${escapeRegex(skillName)}(?=$|\\s)`);

  // Walk back through this turn's user messages only (not previous turns)
  for (let i = validationContext.messages.length - 1; i >= validationContext.turnStartIndex; i--) {
    const msg = validationContext.messages[i];
    if (msg.type !== "user" || msg.isMeta) continue;
    const content = msg.message.content;
    if (typeof content === "string") {
      // Skip system-reminder messages
      if (content.includes(`<${SYSTEM_REMINDER_TAG}>`)) continue;
    } else if (content.some(c => c.type === "tool_result")) {
      // Skip tool-result follow-up user messages
      continue;
    }
    if (pattern.test(extractText(msg) ?? "")) return true;
  }
  return false;
}

// Mapping: Am7→wasUserTypedSlash, H→skillName, $→validationContext, Vx→escapeRegex,
//          Wb→extractText, pG→SYSTEM_REMINDER_TAG, turnStartIndex→main-thread turn floor
```

**Why regex-escape (v2.1.139 fix):**

The pre-v2.1.139 implementation built the regex by string-concatenating the skill name directly. A skill name containing regex metacharacters — say a plugin-provided skill `c++` or `node.js` — would:

- `/c++` becomes pattern `/c++` which matches one-or-more `+` characters, not a literal `++`.
- `/foo.bar` becomes pattern `/foo.bar` which matches `/fooXbar` for any `X`.
- `/foo(bar)` becomes an unbalanced regex group and throws at construction time.

In the worst case, this lets a malicious skill name effectively claim "the user typed me" even when they didn't (matching loosely). The fix wraps `escapeRegex(skillName)` (`Vx` in the bundle: `H.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`).

**Why `(?<!\S)` not `^`:** Skill names can appear mid-message ("can you /init this project for me?"). The negative lookbehind for non-whitespace says "preceded by whitespace or beginning-of-string", so it matches `start` or `after-space` without committing to `^`.

**Why per-turn scope (`turnStartIndex`):** A user message in a previous turn doesn't authorize invocation in the current turn. If the user said `/init` two turns ago and the model is now trying to invoke `/init` again, that's the model's own decision — they need to ask permission this turn.

### `skillOverrides` Setting (v2.1.129)

The `skillOverrides` settings key maps skill names to one of three values:
- `"on"` (default) — skill is fully invocable
- `"user-invocable-only"` — only invocable when the user types `/<skill>` directly; the model cannot invoke via the Skill tool
- `"off"` — completely disabled

This is the user's escape hatch for skills that misbehave. For example, a plugin skill that has a destructive side effect can be set to `"off"` without uninstalling the plugin.

The check in `validateInput` (step 6) combines this with `wasUserTypedSlash` to enforce `user-invocable-only`. The override is looked up by `st(Y)` which reads `getSettings().skillOverrides[Y.name]`.

---

## v2.1.142 Root SKILL.md Plugin Feature

Pre-v2.1.142, a plugin had to put skills inside a `skills/` subdirectory:
```
my-plugin/
├── .claude-plugin/plugin.json
├── skills/
│   └── my-skill/
│       └── SKILL.md
```

v2.1.142 added: if the plugin root contains a `SKILL.md` file AND there's no `skills/` subdirectory, the plugin itself is treated as a single skill:

```javascript
// ============================================
// pluginAsSkillResolver - v2.1.142 root SKILL.md handling
// Location: cli_inner_pretty.js:230211-230213 (in loadPluginAgents)
// ============================================

// ORIGINAL (for source lookup):
} else if (!G && P !== H2) {
  if (await H_(pq.join(H, "SKILL.md"))) M.skillsPaths = [H];
}

// READABLE (for understanding):
// G = explicit skills paths from plugin.json (if any)
// P = plugin source kind (H2 = ??? bundled?)
// H = plugin root directory
// M.skillsPaths = list of paths where SKILL.md files live
} else if (!explicitSkillsConfig && pluginSourceKind !== KIND_BUNDLED) {
  // Fallback: if plugin root has SKILL.md and no skills/ subdirectory, treat the whole plugin as one skill
  if (await fileExists(path.join(pluginRoot, "SKILL.md"))) {
    pluginConfig.skillsPaths = [pluginRoot];
  }
}

// Mapping: G→explicitSkillsConfig, P→pluginSourceKind, H→pluginRoot, H_→fileExists, M→pluginConfig
```

**Why this design (v2.1.142 changelog):**

The pre-v2.1.142 directory layout was friction for small single-skill plugins. A plugin author writing a skill that maps 1:1 to the plugin name (e.g., `claudecode/simplify` providing `/simplify`) had to create:
- `simplify-plugin/`
- `simplify-plugin/.claude-plugin/plugin.json` with `"skills": ["./skills/simplify/SKILL.md"]`
- `simplify-plugin/skills/simplify/SKILL.md`

Three nested directories for one file. v2.1.142 collapses this to:
- `simplify-plugin/SKILL.md`

The `plugin.json` only needs to declare its top-level metadata. The system auto-detects the skill from the root file.

**Mutex with `skills/`:** If the plugin has both `SKILL.md` and `skills/`, the explicit subdirectory wins. This avoids ambiguity for plugins that grow from single-skill to multi-skill — you can keep the original SKILL.md as the "main" skill while adding sub-skills under `skills/`.

**The v2.1.142 advisory fix:** The bundle also fixes "Fixed plugins using `skills: ["./"]` showing a false 'path escapes plugin directory' error." The path-traversal check used to reject `./` as escape; v2.1.142 normalizes the relative path before the escape check.

---

## checkPermissions — Per-Skill Allow/Deny Rules

```javascript
// ============================================
// checkSkillPermissions - Rule matching with `:*` wildcard support
// Location: cli_inner_pretty.js:353604-353658 (in SnH.checkPermissions)
// ============================================

// ORIGINAL (for source lookup):
async checkPermissions({ skill: H, args: $ }, q) {
  let K = H.trim(),
    _ = K.startsWith("/") ? K.substring(1) : K,
    z = q.getAppState().toolPermissionContext,
    Y = await yV6(q),
    f = Xy(_, Y),
    O = (j) => {
      let J = j.startsWith("/") ? j.substring(1) : j;
      if (J === _) return !0;
      if (J.endsWith(":*") || J.endsWith(" *")) {
        let X = J.slice(0, -2);
        return _.startsWith(X);
      }
      return !1;
    },
    M = GQ(z, SnH, "deny");
  for (let [j, J] of M.entries())
    if (O(j))
      return { behavior: "deny", message: "Skill execution blocked by permission rules", decisionReason: { type: "rule", rule: J } };
  let w = GQ(z, SnH, "allow");
  for (let [j, J] of w.entries())
    if (O(j))
      return { behavior: "allow", updatedInput: { skill: H, args: $ }, decisionReason: { type: "rule", rule: J } };
  if (f?.type === "prompt" && zl_(f))
    return { behavior: "allow", updatedInput: { skill: H, args: $ }, decisionReason: void 0 };
  let D = [
    { type: "addRules", rules: [{ toolName: fX, ruleContent: _ }], behavior: "allow", destination: "localSettings" },
    { type: "addRules", rules: [{ toolName: fX, ruleContent: `${_}:*` }], behavior: "allow", destination: "localSettings" },
  ];
  return { behavior: "ask", message: `Execute skill: ${_}`, decisionReason: void 0, suggestions: D, updatedInput: { skill: H, args: $ }, metadata: f ? { command: f } : void 0 };
}

// READABLE (for understanding):
async function checkSkillPermissions({ skill: rawName, args }, context) {
  const trimmed = rawName.trim();
  const skillName = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed;
  const permContext = context.getAppState().toolPermissionContext;
  const allCommands = await getCommandsIncludingMcpPrompts(context);
  const skillDef = findCommandByName(skillName, allCommands);

  // Rule matcher: exact name or `prefix:*` wildcard or `prefix *` wildcard
  const matches = (rule) => {
    const ruleStr = rule.startsWith("/") ? rule.substring(1) : rule;
    if (ruleStr === skillName) return true;
    if (ruleStr.endsWith(":*") || ruleStr.endsWith(" *")) {
      const prefix = ruleStr.slice(0, -2);
      return skillName.startsWith(prefix);
    }
    return false;
  };

  // Deny rules win first
  const denyRules = getRulesForTool(permContext, SKILL_TOOL, "deny");
  for (const [rule, source] of denyRules.entries()) {
    if (matches(rule)) {
      return { behavior: "deny", message: "Skill execution blocked by permission rules", decisionReason: { type: "rule", rule: source } };
    }
  }

  // Allow rules
  const allowRules = getRulesForTool(permContext, SKILL_TOOL, "allow");
  for (const [rule, source] of allowRules.entries()) {
    if (matches(rule)) {
      return { behavior: "allow", updatedInput: { skill: rawName, args }, decisionReason: { type: "rule", rule: source } };
    }
  }

  // Bundled/built-in skills auto-allow (no prompt for "/init", etc.)
  if (skillDef?.type === "prompt" && isBundledOrBuiltInSkill(skillDef)) {
    return { behavior: "allow", updatedInput: { skill: rawName, args }, decisionReason: undefined };
  }

  // Otherwise ask, with two suggestion buttons
  const suggestions = [
    { type: "addRules", rules: [{ toolName: SKILL_TOOL, ruleContent: skillName }],     behavior: "allow", destination: "localSettings" },
    { type: "addRules", rules: [{ toolName: SKILL_TOOL, ruleContent: `${skillName}:*` }], behavior: "allow", destination: "localSettings" },
  ];
  return {
    behavior: "ask",
    message: `Execute skill: ${skillName}`,
    decisionReason: undefined,
    suggestions,
    updatedInput: { skill: rawName, args },
    metadata: skillDef ? { command: skillDef } : undefined,
  };
}

// Mapping: H→rawName, $→args, q→context, _→skillName, z→permContext, Y→allCommands,
//          f→skillDef, O→matches, M→denyRules, w→allowRules, D→suggestions, SnH→SKILL_TOOL,
//          fX→SKILL_TOOL_NAME, GQ→getRulesForTool, zl_→isBundledOrBuiltInSkill
```

**Why two `:*` patterns:** `prefix:*` and `prefix *` both work as wildcards. The colon form is for namespaced skills (`mcp__myserver:*`), the space form is for skills with arg conventions (`/echo hello → echo *`). Either suffix triggers prefix matching.

**Why auto-allow built-in:** Bundled skills (e.g., `/init`, `/clear`, `/help`) are part of Claude Code itself — prompting the user "may Claude execute /init?" would be absurd. The `isBundledOrBuiltInSkill` check skips the prompt for these.

**Suggestion buttons:** When ask is the verdict, the UI presents two "Always allow" buttons — exact match and `:*` wildcard. The user picks one to permanently allowlist either just this skill or the whole skill namespace.

---

## call() — Inline vs Fork

```javascript
// ============================================
// callSkill - Dispatches inline or forked skill execution
// Location: cli_inner_pretty.js:353660-353742 (in SnH.call)
// ============================================

// ORIGINAL (for source lookup):
async call({ skill: H, args: $ }, q, K, _, A) {
  let z = H.trim(),
    Y = z.startsWith("/") ? z.substring(1) : z;
  q.options.activeSkill = Y;
  let f = await yV6(q),
    O = Xy(Y, f);
  if (O) q.options.activeSkill = O.name;
  if ((J68(Y), O?.type === "prompt" && O.context === "fork")) return ql_(O, Y, $, q, K, _, A);
  let { processPromptSlashCommand: M } = await Promise.resolve().then(() => (ynH(), YX$)),
    w = await M(Y, $ || "", f, q);
  if (!w.shouldQuery) throw Error("Command processing failed");
  let D = w.allowedTools || [],
    j = w.model,
    J = O?.type === "prompt" ? O.effort : void 0,
    // ... analytics ...
    h = Su7(w.messages.filter(...), I);
  return {
    data: { success: !0, commandName: Y, allowedTools: D.length > 0 ? D : void 0, model: j },
    newMessages: h,
    contextModifier(C) {
      // Apply skill's allowedTools, model, and effort overrides for the rest of the turn
      ...
    },
  };
}

// READABLE (for understanding):
async function callSkill({ skill: rawName, args }, context, ...rest) {
  const trimmed = rawName.trim();
  const skillName = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed;
  context.options.activeSkill = skillName;

  const allCommands = await getCommandsIncludingMcpPrompts(context);
  const skillDef = findCommandByName(skillName, allCommands);
  if (skillDef) context.options.activeSkill = skillDef.name; // canonical name for analytics

  logSkillInvoked(skillName);

  // Fork path: spawn a subagent
  if (skillDef?.type === "prompt" && skillDef.context === "fork") {
    return executeForkedSkill(skillDef, skillName, args, context, ...rest);
  }

  // Inline path: process the slash command, inject result into current conversation
  const { processPromptSlashCommand } = await import("./slashCommandProcessor.js");
  const result = await processPromptSlashCommand(skillName, args || "", allCommands, context);
  if (!result.shouldQuery) throw new Error("Command processing failed");

  const allowedTools = result.allowedTools || [];
  const model = result.model;
  const effort = skillDef?.type === "prompt" ? skillDef.effort : undefined;
  // ...telemetry...

  // Filter out progress messages and system-reminder injections; keep only what the parent should see
  const newMessages = wrapMessages(
    result.messages.filter(m => {
      if (m.type === "progress") return false;
      if (m.type === "user" && "message" in m && typeof m.message.content === "string" && m.message.content.includes(`<${SYSTEM_REMINDER_TAG}>`)) {
        return false;
      }
      return true;
    }),
    context.toolUseId ?? generateToolUseId(rest[0], SKILL_TOOL_NAME),
  );

  return {
    data: { success: true, commandName: skillName, allowedTools: allowedTools.length ? allowedTools : undefined, model },
    newMessages,
    contextModifier(toolCtx) {
      // Layer the skill's allowedTools allowlist onto the permission context
      // Layer the skill's model override onto the parent's model selection
      // Layer the skill's effort onto the parent's effort
      let modified = toolCtx;
      if (allowedTools.length > 0) modified = withAllowedTools(modified, allowedTools);
      if (model) modified = withModelOverride(modified, model);
      if (effort !== undefined) modified = withEffort(modified, effort);
      return modified;
    },
  };
}

// Mapping: H→rawName, $→args, q→context, Y→skillName, f→allCommands, O→skillDef,
//          ql_→executeForkedSkill, M→processPromptSlashCommand, h→newMessages,
//          C→toolCtx (in contextModifier), J68→logSkillInvoked
```

**The contextModifier pattern:** Rather than mutating the parent's context directly, the Skill tool returns a `contextModifier` function. The agent loop applies this modifier to all subsequent tool calls in the same turn. This means:

- A skill that sets `allowedTools: [Read, Grep]` lets all subsequent tools in this turn use this allowlist, but the next turn starts fresh.
- A model override (`/use-haiku`) switches the model for the rest of this turn only.
- An effort override (`/think-hard`) bumps thinking budget for the rest of this turn only.

This is fundamentally different from setting state in the parent's `getAppState()` — the modifier is per-tool-call scoping, not session-wide.

**Filtering before injection:** The `newMessages` returned to the parent skip:
- Progress messages (already streamed; not part of conversation history).
- User messages containing `<system-reminder>` tags (injected by skill processing, not real user input).
- Tool-result follow-ups that would confuse the parent's context.

This ensures the parent's transcript stays clean — they see the skill's *output*, not its internal processing.

---

## Render Methods

| Method | Behavior |
|--------|----------|
| `renderToolUseMessage` (`bu7`) | "Execute skill: ${name}" header |
| `renderToolUseProgressMessage` (`KY8`) | Skill activity feed (file reads, sub-skill calls) |
| `renderToolResultMessage` (`Cu7`) | Renders result (different for inline vs forked: inline → "Launching skill: X", forked → full forked result with `result:` block) |
| `renderToolUseRejectedMessage` (`xu7`) | "User declined skill execution" |
| `renderToolUseErrorMessage` (`uu7`) | Error code-aware messaging |

---

## Key Insights

- **The model never types slashes**: When the Skill tool fires from the model, the input is `{skill: "init"}` not `{skill: "/init"}`. The validator strips a leading `/` defensively (telemetry event `tengu_skill_tool_slash_prefix` tracks how often models do this — a sign the prompt should be clarified).

- **Subagent invocation blocked by agentId check**: `Am7` returns false when `validationContext.agentId !== undefined`, meaning subagents cannot satisfy "the user typed me" rules. This is intentional: only the main thread can "be" the user.

- **System-reminder filter in `Am7`**: The function walks user messages but skips ones containing `<system-reminder>` tags. This prevents reminder injections from being mistaken for genuine user prompts.

- **Two-button suggestions UI**: The `ask` verdict returns both `name` and `name:*` allow suggestions. Picking the namespace-wildcard is a common pattern for MCP prompts (`mcp__server:*` allows all that server's skills at once).

- **`effort` and `model` propagate**: A skill's frontmatter can set `effort: maximum` or `model: opus`. The contextModifier propagates these — so `/think-hard` literally runs as Opus on max effort even if the parent was Sonnet.

- **plugins skills:["./""] fix**: v2.1.142 fixes the "path escapes plugin directory" false positive for plugins declaring their root as a skills path. The path-traversal check now normalizes before comparing.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.117 | Plugin `prompt` and `description` fields displayed in `/plugin` details. |
| v2.1.125 | Skill `effort` field propagated through contextModifier. |
| v2.1.129 | `skillOverrides` setting (off / user-invocable-only / on) introduced. |
| v2.1.131 | Slash-skill alias resolution: `aliases` field in SKILL frontmatter. |
| v2.1.136 | Levenshtein typo suggestions (edit distance 2). |
| v2.1.139 | `Am7` uses `escapeRegex(skillName)` to prevent regex injection in user-typed detection. |
| v2.1.142 | Root `SKILL.md` plugin layout: plugin without `skills/` subdirectory is auto-detected as a single skill via root `SKILL.md`. Fix for `skills: ["./"]` false-positive path-escape. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills)
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 meta additions

Key functions in this document:
- `skillInputSchema` (Kl_) - {skill, args}
- `skillOutputSchema` (_l_) - union of inline/forked
- `skillTool` (SnH) - Tool definition
- `wasUserTypedSlash` (Am7) - Regex-safe user-typed detector
- `escapeRegex` (Vx) - Generic regex escaper, used by Am7
- `getCommandsIncludingMcpPrompts` (yV6) - Skill registry lookup
- `findCommandByName` (Xy) - Skill lookup
- `suggestNearestCommand` (VnH) - Levenshtein typo suggestion
- `filterByAllowedSkills` (Q7H) - Session allowlist enforcement
- `getSkillOverride` (st) - skillOverrides setting accessor
- `isBundledOrBuiltInSkill` (zl_) - Built-in auto-allow gate
- `executeForkedSkill` (ql_) - Fork-context skill execution
- `processPromptSlashCommand` (M in import) - Slash-command processor
- `SKILL_TOOL_NAME` (fX) - "Skill"
