# `Skill(name *)` Prefix-Match Wildcard — v2.1.121, fix v2.1.139, `skillOverrides` v2.1.129

**Theme:** Skills are tools-of-tools — invoking the `Skill` tool with `skill: "foo"` runs the bundled or user-defined slash command `/foo`. Until v2.1.121, the only permission shape for skills was an exact match (`Skill(commit)`); the parenthesized wildcard form (`Skill(commit *)`) was *introduced* but **didn't actually prefix-match** until v2.1.139 closed the gap.

The fix is small but semantically important: it makes `Skill(...)` rules **behave the same as `Bash(...)` rules**, which users already know — `Bash(npm run *)` matches `npm run build`, `npm run test`, etc.; now `Skill(commit *)` matches `commit`, `commit hotfix`, `commit a feature`.

Bundled with this work is v2.1.129's `skillOverrides` settings key that gates skill *availability* (off / name-only / user-invocable-only / on) per-skill, which sits *above* the permission system — `skillOverrides: off` makes the skill invisible to the model regardless of `Skill(...)` allow rules.

---

## 1. The Shape of a Skill Permission Rule

Pre-v2.1.121, the only form was:

```json
{
  "permissions": {
    "allow": ["Skill(commit)"],
    "deny": ["Skill(deploy)"]
  }
}
```

Each rule matched **exactly one skill name**. Users with N variants (`commit`, `commit-with-emoji`, `commit-conventional`) had to list each.

v2.1.121 introduced the wildcard form `Skill(name *)` and `Skill(name:*)` (with `:*` as the Bash-style prefix sentinel, kept for parity). But the matcher only honored exact matches — wildcard rules were *accepted* (validated by the schema) but **silently never matched**. v2.1.139 closed the gap.

### Why two wildcard syntaxes?

- `Skill(name *)` (space-asterisk) — natural reading: "name with any args"
- `Skill(name:*)` (colon-asterisk) — Bash-style legacy form

This mirrors `Bash(npm run *)` vs the historical `Bash(npm run:*)`. The matcher accepts both for consistency.

---

## 2. The Matcher — v2.1.139 Implementation

The Skill permission check runs inside `SnH.checkPermissions` (chunks `_top_*`, line 353604-353658).

```javascript
// ============================================
// checkSkillPermissions - Skill tool permission check with prefix-match wildcard
// Location: cli_inner_pretty.js:353604-353658
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
  // ... falls through to ask path
}

// READABLE (for understanding):
async function checkSkillPermissions({ skill: skillInput, args }, context) {
  // Normalize: strip leading slash if present
  const skillTrimmed = skillInput.trim();
  const skillName = skillTrimmed.startsWith("/")
    ? skillTrimmed.substring(1)
    : skillTrimmed;

  const permissionContext = context.getAppState().toolPermissionContext;
  const allSkills = await loadSkills(context);
  const skillEntry = findSkillByName(skillName, allSkills);

  // matchesRule(ruleContent): does ruleContent match the invoked skillName?
  const matchesRule = (ruleContent) => {
    const ruleNormalized = ruleContent.startsWith("/")
      ? ruleContent.substring(1)
      : ruleContent;

    // Exact match
    if (ruleNormalized === skillName) return true;

    // Prefix wildcard: rule ends with ":*" or " *"
    if (ruleNormalized.endsWith(":*") || ruleNormalized.endsWith(" *")) {
      const prefix = ruleNormalized.slice(0, -2);  // strip 2-char suffix
      return skillName.startsWith(prefix);
    }

    return false;
  };

  // Deny rules win first
  const denyRules = getRulesForTool(permissionContext, "Skill", "deny");
  for (const [ruleContent, rule] of denyRules.entries()) {
    if (matchesRule(ruleContent)) {
      return {
        behavior: "deny",
        message: "Skill execution blocked by permission rules",
        decisionReason: { type: "rule", rule },
      };
    }
  }

  // Allow rules
  const allowRules = getRulesForTool(permissionContext, "Skill", "allow");
  for (const [ruleContent, rule] of allowRules.entries()) {
    if (matchesRule(ruleContent)) {
      return {
        behavior: "allow",
        updatedInput: { skill: skillInput, args },
        decisionReason: { type: "rule", rule },
      };
    }
  }
  // ... fallthrough: ask
}

// Mapping: SnH.checkPermissions→checkSkillPermissions,
//   H→skillInput, $→args, q→context, K→skillTrimmed, _→skillName,
//   z→permissionContext, Y→allSkills, f→skillEntry, j→ruleContent, J→rule,
//   X→prefix, GQ→getRulesForTool, Xy→findSkillByName, yV6→loadSkills
```

### Key insight — the slash-prefix tolerance

The matcher normalizes both the **rule** and the **invoked skill name** by stripping a leading `/` if present. This is what makes:

```json
"allow": ["Skill(/commit)", "Skill(commit)"]
```

Both fire when the model invokes `{skill: "/commit"}` or `{skill: "commit"}`. The slash is a UX convenience (matching the slash-command form `/commit`) — it has no semantic effect on the matcher.

### Key insight — the 2-char suffix strip

The line `J.slice(0, -2)` strips exactly 2 characters off the end. This is **only correct because the two wildcard suffixes are both 2 chars** (`:*` and ` *`). If a third form like `*` (length-1) is ever added, this needs to become `J.slice(0, -wildcardSuffix.length)`. The current shape is the minimum viable code path.

---

## 3. Why It Was Introduced — Distinguishing `commit` from `commit-related`

Pre-v2.1.121, allowing `commit` and `commit-with-emoji` required two explicit allow rules:

```json
{ "allow": ["Skill(commit)", "Skill(commit-with-emoji)"] }
```

A user with many variants of a skill family ended up with 5-10 rules to write. The natural-feeling shape was wanted:

```json
{ "allow": ["Skill(commit *)"] }
```

The cleverness: this *also* matches `commit` itself (no trailing args). The matcher reduces to `skillName.startsWith("commit")` after stripping ` *`, so:
- `commit` → `"commit".startsWith("commit")` → `true` ✓
- `commit-with-emoji` → `"commit-with-emoji".startsWith("commit")` → `true` ✓
- `committed` → also `true` ⚠ (gotcha — see Section 5)

---

## 4. Auto-Approval UX: Allow Forms Suggested After User Approves

When the user approves a skill at the prompt for the first time, the system offers two follow-up allow rules to remember the approval (`SnH.checkPermissions` lines 353637-353650):

```javascript
let D = [
  {
    type: "addRules",
    rules: [{ toolName: fX, ruleContent: _ }],            // Skill(commit)
    behavior: "allow",
    destination: "localSettings",
  },
  {
    type: "addRules",
    rules: [{ toolName: fX, ruleContent: `${_}:*` }],     // Skill(commit:*)
    behavior: "allow",
    destination: "localSettings",
  },
];
```

The first is exact (`Skill(commit)`); the second is prefix (`Skill(commit:*)` — colon form is preserved for legacy/parity with Bash). The user picks which one to persist. Note both go to `localSettings` (per-project, durable but not checked in).

---

## 5. Footguns of `Skill(commit *)`

The naive prefix-match can match **more** than the user expects. Example footguns:

| Rule | Surprising match | Why |
|---|---|---|
| `Skill(test *)` | `tester` | "tester".startsWith("test") |
| `Skill(deploy *)` | `deploy-prod` (might be intended) | same |
| `Skill(/ *)` | every skill | prefix is empty |

The team accepts this because:
1. The user opted into the wildcard form deliberately
2. Skill names are author-controlled (the user installed those skills); adversarial naming would be on the installation step, not the rule
3. The deny rule path (also `matchesRule`) catches user-controlled blocks first — `deny: ["Skill(test-secret)"]` runs before `allow: ["Skill(test *)"]`

---

## 6. The `skillOverrides` Layer (v2.1.129) — Above the Permission System

`skillOverrides` is a *separate* mechanism that lives *above* `Skill(...)` rules. While allow/deny rules say "may the model invoke this skill?", `skillOverrides` says "is this skill **visible** at all?":

```json
{
  "skillOverrides": {
    "deploy": "off",                     // hidden from model AND user
    "secret-debug": "user-invocable-only", // visible as /secret-debug but model can't call it
    "verbose-help": "name-only"            // listed but no description in catalog
  }
}
```

Schema (chunks `_top_*`, line 50479-50484):

```javascript
skillOverrides: y
  .record(y.string(), y.enum(["on", "name-only", "user-invocable-only", "off"]))
  .optional()
```

### How `skillOverrides` interacts with allow rules

In `SnH.validateInput` (line 353582-353590):

```javascript
let f = st(Y);
if (f === "off" || (f === "user-invocable-only" && !Am7(_, $)))
  return {
    result: !1,
    message: `Skill ${_} is disabled for model invocation in skillOverrides settings`,
    errorCode: 7,
  };
```

`st(Y)` resolves the override for skill Y using a four-tier waterfall (`oT5`, line 476885-476892):

1. `policySettings.skillOverrides[name]` — managed/IT policy
2. `flagSettings.skillOverrides[name]` — `--skill-override` CLI flag
3. `H.disableModelInvocation` (skill-author intent) — defaults to `user-invocable-only`
4. `H.source === "plugin"` — plugins default `on`

Local/user settings can override skill-author intent but not policy/flag (`aT5`, line 476894-476895):

```javascript
return v8("projectSettings")?.skillOverrides?.[H] ?? v8("userSettings")?.skillOverrides?.[H];
```

### Why `skillOverrides` sits above permissions

Conceptually: **permissions** decide whether a *known* tool may run; **overrides** decide what tools are even *known* to the model. A skill set to `off` is removed from the system prompt entirely — the model can't invoke it because it doesn't know it exists. This makes `skillOverrides: off` a stronger guarantee than `Skill(deny)` rules:

- `Skill(deny)` rule: model **tries** to call, gets denied (counts against turn budget, may try alternate)
- `skillOverrides: off`: model **doesn't try** — saves tokens, no error path

---

## 7. The `(name *)` Suggestion Form in `pe$` and `uY$`

When the bash classifier offers an allow-rule suggestion after a prompt, it calls `pe$` or `uY$` (chunks `_top_*`, line 207234-207248):

```javascript
function pe$(H, $) {
  return [
    { type: "addRules", rules: [{ toolName: H, ruleContent: $ }],
      behavior: "allow", destination: "localSettings" },
  ];
}
function uY$(H, $) {
  return [
    {
      type: "addRules",
      rules: [{ toolName: H, ruleContent: `${$} *` }],  // ← appends " *"
      behavior: "allow",
      destination: "localSettings",
    },
  ];
}
```

`pe$` produces an *exact* rule (`Bash(git status)`), `uY$` produces a *prefix* rule (`Bash(git status *)`). The bash suggestion path (`rDH`) picks based on whether the command has args that look generalizable. The Skill path mirrors this — `Skill(commit)` vs `Skill(commit *)`.

---

## 8. Bug v2.1.139 Fixed — How Pre-Fix the Matcher Silently Failed

Before v2.1.139, the matcher only had the `J === _` branch (exact match). The wildcard rule `Skill(commit *)` parsed via `jO` (line 50106-50117):

```javascript
function jO(H) {
  // ...
  let K = H.substring(0, $),       // toolName: "Skill"
    _ = H.substring($ + 1, q);      // ruleContent: "commit *"
  // ...
  if (_ === "" || _ === "*") return { toolName: TT(K) };  // strips bare "*"
  let A = qI9(_);                  // unescape \( and \)
  return { toolName: TT(K), ruleContent: A };
}
```

So `Skill(commit *)` became `{ toolName: "Skill", ruleContent: "commit *" }`. The pre-fix matcher checked `_ === "commit *"` — but the invoked skill name is `"commit"` (or `"commit hotfix"`), never literally `"commit *"`. The rule existed but **never fired**.

The v2.1.139 fix adds the prefix-strip branch:

```javascript
if (J.endsWith(":*") || J.endsWith(" *")) {
  let X = J.slice(0, -2);
  return _.startsWith(X);
}
```

This makes `"commit *"` → strip ` *` → `"commit"` → `"commit hotfix".startsWith("commit")` → ✓.

### Why the pre-fix bug was hard to notice

1. The schema validator (`Hm8`, line 50222-50313) **accepted** `Skill(commit *)` — no validation error
2. The CLI showed the rule in `/permissions`, looking correct
3. Only at invocation time did the matcher silently fall through to the ask path
4. Users assumed they'd configured something else wrong (typo, scope, etc.)

The v2.1.139 changelog note — *"Fixed `Skill(name *)` permission rules — the wildcard form now works as a prefix match, matching `Bash(ls *)` behavior"* — describes the bug as "feature wasn't actually working" rather than "regression," because the rules were *introduced* in v2.1.121 with the intent of prefix matching but the matcher was never updated.

---

## 9. The Permission Flow — Where This Fits

```
Model invokes: { skill: "commit hotfix" }
              │
              ▼
   SnH.validateInput            ← v2.1.129 skillOverrides gate
   - Trim "/", look up skill
   - Check disableModelInvocation
   - Check skillOverrides (off/uio)
              │
              ▼
   SnH.checkPermissions         ← v2.1.121/139 wildcard match
   - For each Skill deny rule: matchesRule(ruleContent, "commit hotfix")
       ├ "commit *"  → strip " *" → "commit hotfix".startsWith("commit") → DENY
       ├ "commit:*"  → strip ":*" → same → DENY
       └ "commit"    → exact      → no match
   - For each Skill allow rule: matchesRule(...)
   - Fall through: behavior: "ask"
              │
              ▼
   User approves → suggest [exact, prefix] rules
                   stored in localSettings
```

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_core_features.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md) — Existing Skill symbols

Key functions in this document:
- `checkSkillPermissions` (`SnH.checkPermissions`) — Skill rule matcher with `(name *)`/`(name:*)` prefix-match
- `validateSkillInvocation` (`SnH.validateInput`) — Pre-permission gate; checks `skillOverrides` and `disableModelInvocation`
- `getSkillOverrideAuthority` (`oT5`) — Returns the authoritative override (policy/flag/author/plugin)
- `getSkillOverrideLocalUser` (`aT5`) — Returns local/user `skillOverrides[name]` value
- `appendPrefixWildcardSuggestion` (`uY$`) — Builds an allow-rule suggestion with ` *` appended
- `appendExactSuggestion` (`pe$`) — Builds an exact allow-rule suggestion
- `parseRule` (`jO`) — Splits `"Tool(ruleContent)"` into `{ toolName, ruleContent }`
- `Skill` tool name (`fX`) — String constant `"Skill"`
