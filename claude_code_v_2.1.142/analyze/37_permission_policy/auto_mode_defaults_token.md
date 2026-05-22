# `$defaults` Token in `autoMode.*` — v2.1.118

**Theme:** Users wanted to *augment* the built-in auto-mode classifier rules with their own, not *replace* them. v2.1.118 introduces the literal-string sentinel `"$defaults"` that, when included in a rule array, expands to the built-in defaults at that position.

The mechanism is **explicit and positional** — the user puts `$defaults` exactly where they want the built-ins inserted, before or after their custom rules. This solves a class of "I want to keep the security rules and also add my own" without forcing users to copy-paste the entire built-in list (which would be brittle across versions).

The design is a study in *small primitive, large reach*: a single sentinel string carries the "extend, don't replace" semantic across four rule sections (`allow`, `soft_deny`, `hard_deny`, `environment`), parsed once at prompt-build time.

---

## 1. The Pre-v2.1.118 Pain

Pre-fix, `autoMode.allow` was an **override** — the user's rules **replaced** the built-in defaults:

```json
{
  "autoMode": {
    "allow": ["Allow my internal monitoring tool to push metrics"]
  }
}
```

Result: **all built-in allow rules disappeared**. The classifier, which previously had a rich allow list (read-only commands, dev-tool invocations, sandbox-safe writes, etc.), now only saw the user's one rule. The session immediately started prompting for every routine action.

Users wanted:

```json
{
  "autoMode": {
    "allow": ["<keep all the built-ins, AND add this:> Allow my internal monitoring tool"]
  }
}
```

…but the schema didn't support that. The two ways to express it pre-fix were:

1. **Copy the built-in rules** into `allow`, then append your own. **Brittle** — the built-ins evolve; pinned copies go stale.
2. **Don't customize `allow` at all**. The user gives up customization.

Neither is satisfying. v2.1.118 introduces a third option: include `"$defaults"` in the array.

---

## 2. The `$defaults` Sentinel

```json
{
  "autoMode": {
    "allow": [
      "$defaults",
      "Allow my internal monitoring tool to push metrics"
    ],
    "hard_deny": [
      "Block any write to /etc/secrets/**",
      "$defaults"
    ]
  }
}
```

Semantics:
- `"$defaults"` is a **literal string**, no interpolation, no escaping
- It expands **at the position it appears** to the built-in rules for that section
- Multiple `$defaults` in a single array — only the **first** expansion fires (deduplication)
- If `$defaults` is absent, the user's rules **replace** the defaults (legacy behavior preserved)

### Why positional?

Putting `$defaults` first means "my rules come after, layered on top." Putting it last means "my rules are most prominent, defaults are fallback." For `hard_deny`, this matters because the classifier reads rules in order — the user can emphasize their rules by listing them first.

---

## 3. The Expander — `expandDefaultsList` (`wJ$`)

`wJ$` (chunks `_top_*`, line 337707-337719) is the workhorse. Two arguments: the **user's array** and the **default rules**. Returns the merged array with `$defaults` expanded.

```javascript
// ============================================
// expandDefaultsList - Replace "$defaults" sentinel with built-in rules
// Location: cli_inner_pretty.js:337707-337719
// ============================================

// ORIGINAL (for source lookup):
function wJ$(H, $, q) {
  if (!H?.length) return [...$];
  let K = !1,
    _ = [];
  for (let A of H) {
    if (A === llH) {
      if (!K) (_.push(...$), (K = !0));
      continue;
    }
    _.push(q(A));
  }
  return _;
}

// READABLE (for understanding):
function expandDefaultsList(userRules, defaultRules, transformRule) {
  // No user rules → use all defaults
  if (!userRules?.length) return [...defaultRules];

  let defaultsInserted = false;
  const merged = [];

  for (const rule of userRules) {
    if (rule === DEFAULTS_SENTINEL /* "$defaults" */) {
      // Only the first $defaults fires — silent dedupe
      if (!defaultsInserted) {
        merged.push(...defaultRules);
        defaultsInserted = true;
      }
      continue;  // skip the sentinel, don't push it as a rule
    }
    merged.push(transformRule(rule));
  }

  return merged;
}

// Mapping: wJ$→expandDefaultsList, H→userRules, $→defaultRules, q→transformRule,
//   K→defaultsInserted, _→merged, A→rule, llH→DEFAULTS_SENTINEL
```

### Key insight — `transformRule` parameter

The function takes a `q`/`transformRule` callback that's applied to **each user rule** but **NOT** to default rules. This separation matters:

- **Default rules** come from `eA8` (`extractDefaultRules`) — parsed from the XML sentinels in the classifier system-prompt template. They're already in the canonical format.
- **User rules** may need transformation — e.g., normalization, validation, escaping.

The current caller (`WS7`, the merge wrapper at line 337728-337736) passes the identity function `(K) => K`. But the signature is built for future use — e.g., adding per-rule prefixes, applying glob expansion, validating against a schema.

### Key insight — silent dedupe on multiple `$defaults`

```javascript
if (A === llH) {
  if (!K) (_.push(...$), (K = !0));
  continue;
}
```

If the user writes `["$defaults", "rule1", "$defaults"]`, the second `$defaults` is silently dropped. This is **deliberate** — duplicating the defaults would amplify their weight in the classifier's stage-1/stage-2 reasoning, with no useful effect.

The dedupe is silent (no warning) because (a) it's a no-op pattern users might unconsciously write, and (b) the result is what most users would expect anyway ("don't repeat the defaults twice").

---

## 4. The Wireup — `mergeAutoModeWithDefaults` (`WS7`)

The single-point-of-call that uses `wJ$` for all four sections (chunks `_top_*`, line 337728-337736):

```javascript
// ============================================
// mergeAutoModeWithDefaults - Apply $defaults expansion to all auto-mode sections
// Location: cli_inner_pretty.js:337728-337736
// ============================================

// ORIGINAL (for source lookup):
function WS7(H) {
  let $ = Kz8(),
    q = (K) => K;
  return {
    allow: wJ$(H?.allow, $.allow, q),
    soft_deny: wJ$(H?.soft_deny, $.soft_deny, q),
    hard_deny: wJ$(H?.hard_deny, $.hard_deny, q),
    environment: wJ$(H?.environment, $.environment, q),
  };
}

// READABLE (for understanding):
function mergeAutoModeWithDefaults(userAutoMode) {
  const defaults = getBuiltInClassifierRules();
  const identity = (rule) => rule;
  return {
    allow:       expandDefaultsList(userAutoMode?.allow,       defaults.allow,       identity),
    soft_deny:   expandDefaultsList(userAutoMode?.soft_deny,   defaults.soft_deny,   identity),
    hard_deny:   expandDefaultsList(userAutoMode?.hard_deny,   defaults.hard_deny,   identity),
    environment: expandDefaultsList(userAutoMode?.environment, defaults.environment, identity),
  };
}

// Mapping: WS7→mergeAutoModeWithDefaults, H→userAutoMode, Kz8→getBuiltInClassifierRules,
//   $→defaults, q→identity
```

This is called once at prompt-build time, producing the final ordered rule lists that get substituted into the classifier prompt.

---

## 5. The Defaults — `getBuiltInClassifierRules` (`Kz8`) and `extractDefaultRules` (`eA8`)

The defaults aren't constants in the JS source — they're **extracted from the classifier prompt template** at runtime. `Kz8` (line 337720-337727):

```javascript
function Kz8() {
  return {
    allow:       eA8("user_allow_rules_to_replace"),
    soft_deny:   eA8("user_soft_deny_rules_to_replace"),
    hard_deny:   eA8("user_hard_deny_rules_to_replace"),
    environment: eA8("user_environment_to_replace"),
  };
}
```

`eA8` (line 337738-337748):

```javascript
// ============================================
// extractDefaultRules - Parse built-in rules from XML sentinels in prompt template
// Location: cli_inner_pretty.js:337738-337748
// ============================================

// ORIGINAL (for source lookup):
function eA8(H) {
  let $ = AT6.match(new RegExp(`<${H}>([\\s\\S]*?)</${H}>`));
  if (!$) return [];
  return ($[1] ?? "")
    .split(`\n`)
    .map((q) => q.trim())
    .filter((q) => q.startsWith("- "))
    .map((q) => q.slice(2));
}

// READABLE (for understanding):
function extractDefaultRules(sentinelTagName) {
  // AT6 is the classifier system prompt template (loaded from a packed text file)
  const match = CLASSIFIER_PROMPT_TEMPLATE.match(
    new RegExp(`<${sentinelTagName}>([\\s\\S]*?)</${sentinelTagName}>`)
  );
  if (!match) return [];

  // The content inside the sentinel is a markdown bullet list:
  //   - Data Exfiltration: ...
  //   - Safety-Check Bypass: ...
  // Strip the "- " prefix and return as an array of rule strings.
  return (match[1] ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));
}

// Mapping: eA8→extractDefaultRules, H→sentinelTagName, AT6→CLASSIFIER_PROMPT_TEMPLATE
```

### Why this design

The defaults are **stored in the prompt template itself**, inside XML sentinels:

```xml
<user_hard_deny_rules_to_replace>
- Data Exfiltration: Sending sensitive data to external endpoints ...
- Safety-Check Bypass: Using a command's flags, config, aliases ...
</user_hard_deny_rules_to_replace>
```

Three benefits:

1. **Single source of truth** — the same rules drive both the "no user customization" path (template used as-is) and the `$defaults` expansion (extracted, then re-inserted)
2. **Easy editing** — copywriters/security engineers edit the prompt template directly, no JS source change
3. **Version-pinning by build** — the defaults are baked into the binary at build time, so a v2.1.118 user gets v2.1.118 defaults, not whatever's current on disk

### When user customization is absent

If `autoMode.hard_deny` is unset, the template is used as-is (sentinel left intact, treated as part of the prompt). The classifier reads the XML sentinel tags inline:

```javascript
// In ZS7() — system prompt builder, line 337750-337756
return PS7.replace("<permissions_template>", () => AT6)
  .replace(/<user_allow_rules_to_replace>([\s\S]*?)<\/user_allow_rules_to_replace>/, (H, $) => $)
  .replace(/<user_soft_deny_rules_to_replace>([\s\S]*?)<\/user_soft_deny_rules_to_replace>/, (H, $) => $)
  .replace(/<user_hard_deny_rules_to_replace>([\s\S]*?)<\/user_hard_deny_rules_to_replace>/, (H, $) => $)
  .replace(/<user_environment_to_replace>([\s\S]*?)<\/user_environment_to_replace>/, (H, $) => $)
  .replace("<settings_deny_rules>", "");
```

The replace callback `(H, $) => $` returns the content of the capture group — the rules **inside** the sentinel — effectively unwrapping the XML tags. So without customization, the classifier sees the rules with no tags. The user's experience is identical to the customization path with just `"$defaults"`.

### When user customization is present

The customization-aware builder (`$z8` at line 337968, called from a path I'll show below) substitutes the **merged** list:

```javascript
.replace(/<user_hard_deny_rules_to_replace>([\s\S]*?)<\/user_hard_deny_rules_to_replace>/, (J, X) =>
  $z8(K?.hard_deny ?? [], X),
)
```

`$z8` formats the merged list as a markdown bullet block. The original sentinel content (`X` capture) is the *default rules*, which `wJ$`/`expandDefaultsList` knows how to use.

---

## 6. Why a Sentinel, Not An Object Shape

The alternative was:

```json
{
  "autoMode": {
    "allow": {
      "extend": true,
      "rules": ["Allow my internal monitoring tool"]
    }
  }
}
```

This was rejected. Reasons (inferable):

1. **Symmetry across sections** — `allow`, `soft_deny`, `hard_deny`, `environment` should all behave the same. The sentinel works in every array; an object shape would need replicating per section.
2. **JSON validation cost** — schema for `"extend object OR array of strings"` requires `union` types, more error-prone validation, harder error messages.
3. **User cognition** — the sentinel reads naturally: `["$defaults", "my rule"]` says "defaults first, then my rule" out loud. Object shapes need explanation.
4. **Backward compat** — existing arrays without `$defaults` keep replacing semantics. No schema migration.

### Why a `$` prefix?

The `$` prefix is the convention for "magic value within a string field." It mirrors:
- `${VAR}` in shell
- `$0`, `$1` in regex back-references
- Mongo-style `$set`, `$inc` operators

A non-`$`-prefixed string `"defaults"` would be ambiguous (could be a literal rule about defaults). `"$defaults"` is unambiguously a magic value — no real rule starts with `$`.

The team picked `$` over `@defaults`, `__defaults__`, or `<defaults>` for the same reason: `$` is least likely to appear at the start of a meaningful classifier rule. The other forms are valid but less conventional.

---

## 7. The Telemetry Notch

The startup telemetry helper `MKA` (chunks `_top_*`, line 605742-605763, see [`auto_mode_hard_deny.md`](./auto_mode_hard_deny.md)) explicitly **skips** `$defaults` when counting user rules:

```javascript
for (let _ of H?.[K] ?? []) {
  if (_ === llH) continue;
  // ... count
}
```

So `auto_mode_allow_rule_count: 5` means *the user wrote 5 rules*, not "5 entries including `$defaults`." This is what enterprise admins want to see in dashboards: "how customized is this fleet?"

The same pattern lets `claude auto-mode critique` (line 605075-605107) **show** the user which mode they're in:

```javascript
function R08(H, $, q) {
  let K = $.filter((Y) => Y !== llH);
  // ...
  let _ = $.length !== K.length;       // ← does the array contain "$defaults"?
  // ...
  return (
    "## " + H +
    (_ ? ` (custom rules added alongside the defaults)`
       : ` (custom rules replacing defaults)`) +
    ...
  );
}
```

The user sees one of two headers:
- "custom rules added alongside the defaults" (extending)
- "custom rules replacing defaults" (overriding)

This is the meta-feedback that closes the loop — `$defaults` is **visible** in the critique CLI, not just a hidden semantic.

---

## 8. The Stale-Pinning Anti-Pattern, Avoided

Before `$defaults`, the workaround was "copy the built-ins into your settings, then append." Why is that bad?

- v2.1.118 has 10 built-in `hard_deny` rules
- v2.1.142 may add 2 more (Data Exfiltration sub-classes, Production Reads, etc.)
- A user who copy-pasted the v2.1.118 defaults sees their stale list — no new protections

`$defaults` makes the defaults **live**. The user's pinned customizations stay theirs; the built-ins evolve with releases. This is the same pattern as **gitignore include** or **layered config**: declarative composition, not copy-on-write.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Existing auto-mode symbols

Key functions and constants in this document:
- `expandDefaultsList` (`wJ$`) — Inserts `$defaults` sentinel position with default rules
- `mergeAutoModeWithDefaults` (`WS7`) — Single-point wireup applying `wJ$` to all 4 sections
- `getBuiltInClassifierRules` (`Kz8`) — Returns `{ allow, soft_deny, hard_deny, environment }` defaults
- `extractDefaultRules` (`eA8`) — Parses XML sentinels in the classifier system-prompt template
- `formatMergedRulesForPrompt` (`$z8`) — Renders the merged list as a markdown bullet block
- `defaultsTokenString` (`llH`) — `"$defaults"` (chunks `_top_*`, line 338615)
- `classifierPromptTemplate` (`AT6`) — The raw prompt template string with XML sentinels
- `buildClassifierSystemPrompt` (`ZS7`) — Builds the no-customization prompt (sentinels unwrapped)
- `formatCustomRulesSection` (`R08`) — Critique CLI helper detecting `$defaults` presence
- `hasNonDefaultRules` (`S08`) — Returns true if any user rule besides `$defaults` exists
