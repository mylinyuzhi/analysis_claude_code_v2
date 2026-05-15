# `skillOverrides` Setting (v2.1.129)

## What it does

Before v2.1.129 the only way to hide a skill from the model was to set `disable-model-invocation: true` in the skill's own frontmatter. That makes the author the gatekeeper, which is the wrong layer when:

- A user wants to disable a noisy bundled skill on their machine.
- A project wants to suppress a skill for the team without forking the plugin.
- A policy wants to ship a managed deny-list to a fleet.

v2.1.129 adds the `skillOverrides` setting - a map from skill name to override state - resolved across the four settings tiers (`policySettings`, `flagSettings`, `projectSettings`, `userSettings`, plus the local layer for the `/skills` dialog's writes). Each entry can take one of four values:

| State | Meaning |
|-------|---------|
| `"on"` | Default - skill is listed for the model and `/`-typeable |
| `"name-only"` | Skill name appears in the listing but with its description collapsed - the model sees less context but can still invoke via the Skill tool |
| `"user-invocable-only"` | Skill is hidden from the model entirely; user can still type `/<name>` to invoke it directly |
| `"off"` | Skill is hidden from both the model and the `/` autocomplete |

The override is a per-tier setting key just like every other setting - admins can lock it via `policySettings`, the user dialog writes to `localSettings`, and the resolution layer picks the highest-precedence non-empty value.

---

## How it works

### 1. The two-tier resolver

```javascript
// ============================================
// resolveSkillOverride - Highest-precedence override for a skill (policy/flag/author)
// Location: cli_inner_pretty.js:476885-476893
// ============================================

// ORIGINAL (for source lookup):
function oT5(H, $) {
  let q = v8("policySettings")?.skillOverrides?.[$];
  if (q) return { value: q, source: "policy" };
  let K = v8("flagSettings")?.skillOverrides?.[$];
  if (K) return { value: K, source: "flag" };
  if (H.disableModelInvocation) return { value: "user-invocable-only", source: "author" };
  if (H.source === "plugin") return { value: "on", source: "plugin" };
  return;
}

// READABLE (for understanding):
function resolveSkillOverrideLock(skill, name) {
  // Policy tier wins
  let fromPolicy = getSettings("policySettings")?.skillOverrides?.[name];
  if (fromPolicy) return { value: fromPolicy, source: "policy" };
  // Flag tier (CLI flags / SDK init) wins next
  let fromFlag = getSettings("flagSettings")?.skillOverrides?.[name];
  if (fromFlag) return { value: fromFlag, source: "flag" };
  // Author tier: the frontmatter `disable-model-invocation: true` collapses to user-invocable
  if (skill.disableModelInvocation) return { value: "user-invocable-only", source: "author" };
  // Plugin-sourced skill defaults to "on" but the lock is shown in /skills so the user
  // knows they cannot freely override it (managed by /plugin instead)
  if (skill.source === "plugin") return { value: "on", source: "plugin" };
  return undefined;            // no lock - dialog allows full editing
}

// Mapping: oT5 -> resolveSkillOverrideLock, v8 -> getSettings, H -> skill, $ -> name
```

This function returns a "lock" - a value the user cannot override via the `/skills` dialog. If `policySettings.skillOverrides["foo"] = "off"`, the dialog shows the row with a padlock glyph and the value `"off"` is forced no matter what the user picks.

### 2. The user/project resolver

```javascript
// ============================================
// resolveProjectSkillOverride - Project-or-user override for a skill (no lock)
// Location: cli_inner_pretty.js:476894-476896
// ============================================

// ORIGINAL (for source lookup):
function aT5(H) {
  return v8("projectSettings")?.skillOverrides?.[H] ?? v8("userSettings")?.skillOverrides?.[H];
}

// READABLE (for understanding):
function resolveProjectSkillOverride(name) {
  // Project wins over user; either is overridable via the /skills dialog (which writes localSettings).
  return getSettings("projectSettings")?.skillOverrides?.[name]
    ?? getSettings("userSettings")?.skillOverrides?.[name];
}

// Mapping: aT5 -> resolveProjectSkillOverride, v8 -> getSettings, H -> name
```

### 3. The effective-state computation used by the Skill tool

```javascript
// ============================================
// getSkillOverride - Effective override state for runtime gating
// Location: cli_inner_pretty.js:513847-513849
// ============================================

// ORIGINAL (for source lookup):
function st(H) {
  if (H.type !== "prompt" || H.source === "plugin") return "on";
  return m6().skillOverrides?.[H.name] ?? "on";
}

// READABLE (for understanding):
function getSkillOverride(skill) {
  // Plugin-sourced and non-prompt skills are not user-overridable (the dialog locks them).
  // For everything else, merge the settings tiers via the shared merger m6() and use
  // the final value, defaulting to "on".
  if (skill.type !== "prompt" || skill.source === "plugin") return "on";
  return mergedSettings().skillOverrides?.[skill.name] ?? "on";
}

// Mapping: st -> getSkillOverride, m6 -> mergedSettings, H -> skill
```

The Skill tool's `validateInput` callback queries this at every invocation via two helpers (`VE4` and `iP8` at `cli_inner_pretty.js:513851-513857`):

```javascript
// ============================================
// isSkillModelInvocationDisabled - true if the model cannot invoke this skill
// Location: cli_inner_pretty.js:513851-513853
// ============================================

// ORIGINAL (for source lookup):
function VE4(H) {
  let $ = st(H);
  return $ === "user-invocable-only" || $ === "off";
}

// READABLE (for understanding):
function isSkillModelInvocationDisabled(skill) {
  const state = getSkillOverride(skill);
  return state === "user-invocable-only" || state === "off";
}

// Mapping: VE4 -> isSkillModelInvocationDisabled, st -> getSkillOverride
```

```javascript
// ============================================
// isSkillHiddenFromUser - true if the skill should also be hidden from /
// Location: cli_inner_pretty.js:513855-513857
// ============================================

// ORIGINAL (for source lookup):
function iP8(H) {
  return st(H) === "off";
}

// READABLE (for understanding):
function isSkillHiddenFromUser(skill) {
  return getSkillOverride(skill) === "off";
}

// Mapping: iP8 -> isSkillHiddenFromUser, st -> getSkillOverride
```

### 4. The Skill tool's gate

```javascript
// ============================================
// Skill tool validateInput - the model-invocation gate
// Location: cli_inner_pretty.js:353581-353590
// ============================================

// ORIGINAL (for source lookup):
let f = st(Y);
if (f === "off" || (f === "user-invocable-only" && !Am7(_, $)))
  return (
    uH("skill_invoke", "skill_invoke_override_disabled"),
    {
      result: !1,
      message: `Skill ${_} is disabled for model invocation in skillOverrides settings`,
      errorCode: 7,
    }
  );

// READABLE (for understanding):
const overrideState = getSkillOverride(skill);
// "off" -> always blocked. "user-invocable-only" -> blocked unless the user typed /skill in this turn.
if (
  overrideState === "off"
  || (overrideState === "user-invocable-only" && !isUserTypedSlashCommandInTurn(name, toolContext))
) {
  recordFailure("skill_invoke", "skill_invoke_override_disabled");
  return {
    result: false,
    message: `Skill ${name} is disabled for model invocation in skillOverrides settings`,
    errorCode: 7,
  };
}

// Mapping: st -> getSkillOverride, Am7 -> isUserTypedSlashCommandInTurn,
//          uH -> recordFailure, Y -> skill, _ -> name, $ -> toolContext
```

The `user-invocable-only` state has a clever escape hatch: if the user typed `/skill-name` in the current turn (detected by `Am7` / `isUserTypedSlashCommandInTurn`), the Skill tool still accepts the call. This is the same mid-message bypass mechanism that v2.1.110 introduced for `disable-model-invocation` (see v2.1.112's `model_invokable_builtins.md`).

### 5. The `/skills` dialog and override values

The dialog (`uJ4` at `cli_inner_pretty.js:476909`) is where users edit the local-tier override. The four states are enumerated as `kB6` and styled by `rT5`:

```javascript
// ============================================
// SKILL_OVERRIDE_VALUES & STYLES - The state palette
// Location: cli_inner_pretty.js:477208-477214
// ============================================

// ORIGINAL (for source lookup):
((bJ4 = m(rH(), 1)),
  ($z = m(jH(), 1)),
  (By = m(jH(), 1)),
  (kB6 = ["on", "name-only", "user-invocable-only", "off"]),
  (rT5 = {
    on: { glyph: sH.tick, label: "on", color: "success" },
    "name-only": { glyph: sH.bullet, label: "name-only" },
    "user-invocable-only": { glyph: sH.circle, label: "user-only", color: "warning" },
    off: { glyph: sH.cross, label: "off", color: "error" },
  }));

// READABLE (for understanding):
const SKILL_OVERRIDE_VALUES = ["on", "name-only", "user-invocable-only", "off"];
const SKILL_OVERRIDE_STYLES = {
  on:                     { glyph: GLYPHS.tick,   label: "on",         color: "success" },
  "name-only":            { glyph: GLYPHS.bullet, label: "name-only"                       },
  "user-invocable-only":  { glyph: GLYPHS.circle, label: "user-only",  color: "warning"  },
  off:                    { glyph: GLYPHS.cross,  label: "off",        color: "error"    },
};

// Mapping: kB6 -> SKILL_OVERRIDE_VALUES, rT5 -> SKILL_OVERRIDE_STYLES, sH -> GLYPHS
```

Pressing space on a skill row cycles through these four values; pressing enter saves the changes to `localSettings` via:

```javascript
// ============================================
// Save path - localSettings.skillOverrides merge
// Location: cli_inner_pretty.js:477008
// ============================================

// ORIGINAL (for source lookup):
let { error: qH } = B6("localSettings", { skillOverrides: r });

// READABLE (for understanding):
const { error } = mergeIntoSettings("localSettings", { skillOverrides: changedOverrides });

// Mapping: B6 -> mergeIntoSettings
```

`r` (`changedOverrides`) is the diff against the resolved project/user value - only changes are written, so a user who flips a skill back to its project-default removes the entry instead of leaving a stale local override.

---

## Why this approach

**Why four states, not three?** The fourth state - `"name-only"` - is the most subtle. It serves a niche but real case: a user wants the model to be **aware** that the skill exists (so it can suggest it to the user) but does not want the full description to consume context window. The model sees the bare name, the user sees the name and description in `/skills`, and the description is dropped from the model-facing listing built by `formatCommandsWithinBudget` (the v2.1.105 listing budget mechanism).

**Why a separate dialog instead of editing `settings.json` directly?** Two reasons:

1. Discoverability - the user can scan the full skill list and toggle individual entries with one keystroke.
2. Resolution awareness - the dialog **shows the lock source** ("locked by policy") so the user knows immediately when a value cannot be changed. Editing JSON would silently fail to take effect.

**Why is plugin source coerced to "on"?** Plugin skills are managed via `/plugin` (enable/disable per plugin), not per skill. The `skillOverrides` mechanism would create confusing dual gates if both layers could disable a single skill independently.

**Why the `user-invocable-only` + mid-message bypass?** This pattern lets the user disable a skill for **automatic** model invocation (so it doesn't fire unexpectedly when the model thinks it should) while keeping it available for **manual** activation. The bypass mirrors the v2.1.110 `disable-model-invocation` bypass and reuses the same `Am7`/`isUserTypedSlashCommandInTurn` detector for consistency.

**Key insight:** The four-state ladder maps directly to two binary axes:

|              | Listed to model | Hidden from model |
|--------------|-----------------|--------------------|
| Listed to /  | `on`            | `user-invocable-only` |
| Hidden from /| `name-only` (description only)* | `off` |

\* `name-only` is actually "listed to model with a stub description and visible in /." It is not a full hide-from-anywhere state. The `off` state is the only one that hides from `/` autocomplete entirely (via `iP8`).

---

## Cross-references

- `Am7` / `isUserTypedSlashCommandInTurn` at `cli_inner_pretty.js:353362` - the mid-message detector shared with v2.1.110 `disable-model-invocation` bypass
- `formatCommandsWithinBudget` (v2.1.105 listing cap) - the `name-only` state collapses descriptions inside this function
- `/plugin` enable/disable - the upstream gate for plugin-sourced skills
- The v2.1.121 `/skills` filter (covered in `filter_search.md`) lets you find a specific skill quickly in long lists; the dialog row component `sT5` shows the override state and (if any) the lock source per row.
