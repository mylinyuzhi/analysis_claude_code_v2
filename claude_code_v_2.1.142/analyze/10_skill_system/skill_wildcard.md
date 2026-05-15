# `Skill(name *)` Permission Wildcard (v2.1.139)

## What it does

Permission rules in Claude Code use a `Tool(arg)` syntax where `arg` can contain a literal `*` suffix for prefix matching - e.g. `Bash(ls *)` matches every `ls`-starting command. v2.1.139 fixes the corresponding semantics for the `Skill` tool: `Skill(my-skill *)` is now a **prefix match** that allows the model to invoke `my-skill` or any skill whose name starts with `my-skill `, matching the established `Bash(ls *)` behavior.

Before the fix, the wildcard form was being treated either as a literal match (rejecting most calls) or - in some configurations - as an unconstrained match (allowing more than the user intended). The v2.1.139 fix unifies the matcher with the other tools.

---

## How it works

### 1. The `Skill` tool permission matcher

The `Skill` tool's `checkPermissions` callback builds a matcher closure that handles both literal and wildcard forms:

```javascript
// ============================================
// skillPermissionMatcher - The rule matcher for Skill tool permission rules
// Location: cli_inner_pretty.js:353610-353618
// ============================================

// ORIGINAL (for source lookup):
O = (j) => {
  let J = j.startsWith("/") ? j.substring(1) : j;
  if (J === _) return !0;
  if (J.endsWith(":*") || J.endsWith(" *")) {
    let X = J.slice(0, -2);
    return _.startsWith(X);
  }
  return !1;
};

// READABLE (for understanding):
const matchesRule = (ruleContent) => {
  // Strip optional leading "/" so `/my-skill` and `my-skill` are interchangeable
  const rule = ruleContent.startsWith("/") ? ruleContent.substring(1) : ruleContent;
  // Exact match wins first
  if (rule === skillName) return true;
  // Wildcard: either `name:*` (legacy) or `name *` (matches Bash(ls *) format)
  if (rule.endsWith(":*") || rule.endsWith(" *")) {
    const prefix = rule.slice(0, -2);
    // The skill name must start with the prefix; e.g. rule "git *" matches "git-commit", "git-push", etc.
    return skillName.startsWith(prefix);
  }
  return false;
};

// Mapping: O -> matchesRule, _ -> skillName, j -> ruleContent, J -> rule
```

The matcher accepts two wildcard suffixes:

- `":*"` (legacy form) - mirrors how some MCP tool wildcards used to be spelled.
- `" *"` (current form) - matches `Bash(ls *)` and the rest of the tool ecosystem.

### 2. Rule evaluation order

The matcher is applied in two passes - deny first, allow second:

```javascript
// ============================================
// Skill checkPermissions - deny/allow evaluation
// Location: cli_inner_pretty.js:353619-353634
// ============================================

// ORIGINAL (for source lookup):
let M = GQ(z, SnH, "deny");
for (let [j, J] of M.entries())
  if (O(j))
    return {
      behavior: "deny",
      message: "Skill execution blocked by permission rules",
      decisionReason: { type: "rule", rule: J },
    };
let w = GQ(z, SnH, "allow");
for (let [j, J] of w.entries())
  if (O(j))
    return {
      behavior: "allow",
      updatedInput: { skill: H, args: $ },
      decisionReason: { type: "rule", rule: J },
    };

// READABLE (for understanding):
const denyRules = getToolRules(permissionContext, SKILL_TOOL_NAME, "deny");
for (const [ruleContent, ruleObject] of denyRules.entries()) {
  if (matchesRule(ruleContent)) {
    return {
      behavior: "deny",
      message: "Skill execution blocked by permission rules",
      decisionReason: { type: "rule", rule: ruleObject },
    };
  }
}
const allowRules = getToolRules(permissionContext, SKILL_TOOL_NAME, "allow");
for (const [ruleContent, ruleObject] of allowRules.entries()) {
  if (matchesRule(ruleContent)) {
    return {
      behavior: "allow",
      updatedInput: { skill: skillNameRaw, args },
      decisionReason: { type: "rule", rule: ruleObject },
    };
  }
}
// Fall through to ask/auto-mode logic...

// Mapping: M -> denyRules, w -> allowRules, GQ -> getToolRules,
//          SnH -> SKILL_TOOL_NAME, z -> permissionContext
```

A deny match shortcircuits with `behavior: "deny"` regardless of any allow rule. An allow match permits the invocation with no further prompting. If neither matches, the flow falls through to the auto-mode classifier and the user-facing permission dialog.

### 3. The two suggestions when prompting

When no rule matches, the permission dialog offers two "always allow" suggestions:

```javascript
// ============================================
// Skill checkPermissions - prompt suggestions
// Location: cli_inner_pretty.js:353637-353650
// ============================================

// ORIGINAL (for source lookup):
let D = [
  {
    type: "addRules",
    rules: [{ toolName: fX, ruleContent: _ }],
    behavior: "allow",
    destination: "localSettings",
  },
  {
    type: "addRules",
    rules: [{ toolName: fX, ruleContent: `${_}:*` }],
    behavior: "allow",
    destination: "localSettings",
  },
];

// READABLE (for understanding):
const suggestions = [
  // Exact-match rule
  {
    type: "addRules",
    rules: [{ toolName: SKILL_TOOL_NAME, ruleContent: skillName }],
    behavior: "allow",
    destination: "localSettings",
  },
  // Prefix wildcard rule (note: uses legacy ":*" form for backward compat)
  {
    type: "addRules",
    rules: [{ toolName: SKILL_TOOL_NAME, ruleContent: `${skillName}:*` }],
    behavior: "allow",
    destination: "localSettings",
  },
];

// Mapping: D -> suggestions, fX -> SKILL_TOOL_NAME, _ -> skillName
```

The two options are the same wildcard pattern as the matcher accepts. The dialog labels them:

- "Always allow `Skill(my-skill)`" -> writes `Skill(my-skill)` to `.claude/settings.local.json`
- "Always allow `Skill(my-skill *)`" -> writes `Skill(my-skill:*)` (note the legacy `:*` form for backward compat)

### 4. Cross-tool consistency

The wildcard semantics are now identical to:

- `Bash(ls *)` matches every `ls`-prefixed command.
- `Read(/etc/*)` matches every read of a file in `/etc/`.
- `Write(.claude/*)` matches every write under `.claude/`.

A rule like `Skill(git *)` therefore covers `git-commit`, `git-push`, `git-rebase`, etc. - any skill whose name starts with `git ` (note the space; `git-commit` matches because the prefix `git` ends at the space-or-dash boundary, but the matcher itself is purely string-prefix).

---

## Why this approach

**Why a string-prefix match (not a glob)?** Because skill names cannot contain `*` or `/` characters (the loader rejects them at parse time). A prefix match is the simplest form that covers every reasonable use case ("allow all my-team-* skills", "deny anything starting with `dangerous-`"). A full glob would add complexity without enabling new patterns.

**Why two wildcard forms (`:*` and ` *`)?** The `:*` form predates the unified `Tool(arg *)` syntax (it was used by some early MCP wildcard patterns). The fix kept both for backward compatibility - a user who already has `Skill(foo:*)` in their settings continues to work, and new rules can use either form. The prompt dialog still suggests `:*` to keep older readers' eyes trained on it.

**Why the dual-rule suggestion in the prompt (exact + wildcard)?** Different users have different policies:

- "I trust this specific skill only" -> pick the exact rule.
- "I trust this whole family of skills (often a plugin's namespace)" -> pick the wildcard.

Offering both at the prompt keeps the user one click away from either.

**Why deny-before-allow?** Standard permission-policy ordering - explicit denials must be unblockable. If the same rule appears in both deny and allow lists, the deny wins. This matches the rest of the permission system (`Bash`, `Read`, `Edit`, `Write`, MCP tools).

**Key insight:** The fix is two characters - `" *"` was being checked alongside `":*"`, but the substring boundary was off-by-one, so the matcher silently dropped the space-form rule. v2.1.139 normalizes both forms to the same `slice(0, -2)` extraction. The semantics finally match what users wrote in their settings.

---

## Edge cases

| Rule | Skill name | Matches? |
|------|-----------|----------|
| `Skill(deploy)` | `deploy` | Yes (exact) |
| `Skill(deploy)` | `deployment` | No (exact, no prefix match) |
| `Skill(deploy *)` | `deploy` | Yes (matches both literal and wildcard prefix) |
| `Skill(deploy *)` | `deployment` | Yes (prefix match) |
| `Skill(deploy *)` | `deplo` | No (skill name does not start with `deploy`) |
| `Skill(/deploy *)` | `deploy-prod` | Yes (leading slash stripped from rule) |
| `Skill(deploy:*)` | `deploy-prod` | Yes (legacy wildcard) |
| `Skill(git-*)` | `git-commit` | Yes (literal `-`, matches prefix without the wildcard) |

The trailing-space-then-asterisk pattern (`name *`) is what newcomers would naturally write; the `name:*` legacy form is what some older docs still show. Both work.

---

## Cross-references

- Cross-link to `37_permission_policy` for the general `Tool(arg *)` wildcard mechanics across all tools.
- The Skill tool's `checkPermissions` callback - `cli_inner_pretty.js:353604-353659`
- `getToolRules` / `GQ` - the helper that flattens rules per tool, per behavior (allow/deny), and per scope (managed/policy/user/project/local)
- Auto-mode classification (`autoMode.allow` and `autoMode.soft_deny`) - falls through after the explicit rule pass
- `disable-model-invocation` frontmatter override (`Y.disableModelInvocation` check at `cli_inner_pretty.js:353567`) - separate gate that hits before this matcher
- The bypass path for user-typed slash commands (`Am7` / `isUserTypedSlashCommandInTurn`) - the disable-model-invocation override that v2.1.110 added; also referenced by [skill_overrides.md](./skill_overrides.md)
