# Auto-Mode `hard_deny` — v2.1.136

**Theme:** The auto-mode safety classifier had two outcomes — *allow* or *block on user intent*. v2.1.136 splits *block* into two categories: **soft_deny** (blockable if user intent clears it) and **hard_deny** (unconditional block — user intent does NOT clear it).

This is a *concept-level* change: the prior classifier read a single "should I block?" prompt. The new classifier reads two stages, and the `hard_deny` rules execute in stage 1 where user intent is **not** applied as an override. This makes high-trust users (with autonomy-encouraging CLAUDE.md, or operating under `--dangerously-skip-permissions`) still get blocked on actions that cross security boundaries.

The same v2.1.141 changelog note that "auto mode permission dialog now explains when a `permissions.ask` rule caused the prompt" lands alongside; both are about making **the policy authority chain visible** — *why* did this prompt fire.

---

## 1. The Auto-Mode Classifier Pipeline Pre-v2.1.136

```
   action ──► classifier(rules, transcript) ──► { shouldBlock, reason }
                          │
                          └─ rules = built-in deny + built-in allow
                              + settings.autoMode.allow + .soft_deny + .environment
```

The classifier reasoned in a *single pass*: read the action, the transcript (including user intent), and the rules. If the action looked dangerous AND no user intent overrode it, block. The trouble: a user with `CLAUDE.md` containing `"I trust you, be autonomous"` could implicitly override even high-stakes blocks (data exfiltration, credential dumps, infrastructure tunneling) — because the classifier reads CLAUDE.md as user intent.

v2.1.136 splits this into two stages:

```
   action ──► stage 1 (hard_deny, no user intent override) ──┐
                          │                                   │
                          └ block? ──► YES ──► <block>        │
                                   └ NO ──► stage 2 ──┐       │
                                                       ▼      │
   stage 2 (allow + soft_deny, user intent applies) ──┴───────┘
       │
       └ block? ──► YES ──► <block>
              └ NO ──► <allow>
```

The classifier system prompt now has **two `<thinking>` phases**:
- Stage 1: "Err on the side of blocking. Stage 1 does NOT apply user intent or ALLOW exceptions — stage 2 will handle those. Block if ANY rule could apply." (`CF_`, chunks `_top_*`, line 338623)
- Stage 2: "Review the classification process and follow it carefully... explicit user confirmation is required to override blocks." (`bF_`, line 338625)

---

## 2. The Settings Schema (Four Sections, Four Roles)

Schema lives in `dI9` (chunks `_top_*`, line 52652-52660):

```javascript
// ============================================
// autoModeSettingsSchema - autoMode settings schema (v2.1.136 adds hard_deny)
// Location: cli_inner_pretty.js:52652-52660
// ============================================

// ORIGINAL (for source lookup):
dI9 = yH(() =>
  y.object({
    allow: y.array(y.string()).optional(),
    soft_deny: y.array(y.string()).optional(),
    hard_deny: y.array(y.string()).optional(),
    deny: y.array(y.string()).optional(),
    environment: y.array(y.string()).optional(),
  }),
);

// READABLE (for understanding):
const autoModeSettingsSchema = lazy(() =>
  z.object({
    allow: z.array(z.string()).optional(),
    soft_deny: z.array(z.string()).optional(),
    hard_deny: z.array(z.string()).optional(),  // ← v2.1.136 NEW
    deny: z.array(z.string()).optional(),       // alias for backward compat
    environment: z.array(z.string()).optional(),
  })
);

// Mapping: dI9→autoModeSettingsSchema, yH→lazy, y→zod (z), all rule keys are arrays of strings
```

| Section | Role | User intent? | Listed under |
|---|---|---|---|
| `allow` | Auto-approve | n/a (no need) | Stage 2 |
| `soft_deny` | Block unless user intent authorizes | YES (overridable) | Stage 2 |
| `hard_deny` | Block unconditionally | **NO** | Stage 1 |
| `environment` | Context (not rules) — environment facts the classifier should consider | n/a | Both stages |

The `deny` key (no prefix) is preserved for backward compat — old configs that used `autoMode.deny` keep working, but new code should write `soft_deny` or `hard_deny`.

### Per-section schema docstrings (the prompt the classifier sees)

The classifier critique CLI tool's system prompt (`$KA`, line 605109-605126) describes the semantics the model uses:

```
- **allow**: Actions the classifier should auto-approve
- **soft_deny**: Destructive/irreversible actions the classifier should block unless clear user intent authorizes them
- **hard_deny**: Security-boundary actions the classifier should block unconditionally (user intent does not clear these)
- **environment**: Context about the user's setup that helps the classifier make decisions
```

---

## 3. The Loader — `loadAutoModeRulesFromSettings` (`WAH`)

Auto-mode rules merge across all four settings tiers (chunks `_top_*`, line 52576-52603):

```javascript
// ============================================
// loadAutoModeRulesFromSettings - Walks settings tiers, concatenates autoMode sections
// Location: cli_inner_pretty.js:52576-52603
// ============================================

// ORIGINAL (for source lookup):
function WAH() {
  let H = dI9(),
    $ = [], q = [], K = [], _ = [];
  for (let A of ["userSettings", "localSettings", "flagSettings", "policySettings"]) {
    let z = v8(A);
    if (!z) continue;
    let Y = H.safeParse(z.autoMode);
    if (Y.success) {
      if (Y.data.allow) $.push(...Y.data.allow);
      if (Y.data.soft_deny) q.push(...Y.data.soft_deny);
      if (Y.data.hard_deny) K.push(...Y.data.hard_deny);
      if (Y.data.environment) _.push(...Y.data.environment);
    }
  }
  if ($.length > 0 || q.length > 0 || K.length > 0 || _.length > 0)
    return {
      ...($.length > 0 && { allow: $ }),
      ...(q.length > 0 && { soft_deny: q }),
      ...(K.length > 0 && { hard_deny: K }),
      ...(_.length > 0 && { environment: _ }),
    };
  return;
}

// READABLE (for understanding):
function loadAutoModeRulesFromSettings() {
  const schema = autoModeSettingsSchema();
  const allow = [], softDeny = [], hardDeny = [], environment = [];

  // Walk all settings tiers, concatenating each section
  for (const tier of ["userSettings", "localSettings", "flagSettings", "policySettings"]) {
    const settings = getSettings(tier);
    if (!settings) continue;

    const parsed = schema.safeParse(settings.autoMode);
    if (!parsed.success) continue;

    if (parsed.data.allow)       allow.push(...parsed.data.allow);
    if (parsed.data.soft_deny)   softDeny.push(...parsed.data.soft_deny);
    if (parsed.data.hard_deny)   hardDeny.push(...parsed.data.hard_deny);   // ← v2.1.136
    if (parsed.data.environment) environment.push(...parsed.data.environment);
  }

  // Return only non-empty sections
  if (allow.length || softDeny.length || hardDeny.length || environment.length) {
    return {
      ...(allow.length        && { allow }),
      ...(softDeny.length     && { soft_deny: softDeny }),
      ...(hardDeny.length     && { hard_deny: hardDeny }),
      ...(environment.length  && { environment }),
    };
  }
  return undefined;
}

// Mapping: WAH→loadAutoModeRulesFromSettings, dI9→autoModeSettingsSchema,
//   v8→getSettings, H→schema, A→tier, z→settings, Y→parsed,
//   $→allow, q→softDeny, K→hardDeny, _→environment
```

### Key insight — concatenation, not override

The loader **concatenates** rules across tiers rather than letting later tiers override earlier ones. This is deliberate: deny rules should *accumulate*, not get replaced. An IT admin's `policySettings.autoMode.hard_deny` cannot be removed by a user's `userSettings.autoMode.hard_deny` — both fire.

For `allow`, this means user-tier permissive rules **extend** the allow list rather than narrow it. A user can broaden their own auto-mode permissiveness but can't shrink the IT admin's.

---

## 4. The Telemetry — `MKA` Tracks Rule Counts

The startup-telemetry helper (`MKA`, line 605742-605763) counts user-supplied rules separately from `$defaults`:

```javascript
function MKA() {
  let H = WAH(), $ = { allow: 0, soft_deny: 0, hard_deny: 0, environment: 0 }, q = 0;
  for (let K of ["allow", "soft_deny", "hard_deny", "environment"])
    for (let _ of H?.[K] ?? []) {
      if (_ === llH) continue;        // ← skip "$defaults"
      // count non-empty lines and total word count
    }
  return {
    auto_mode_allow_rule_count: $.allow,
    auto_mode_soft_deny_rule_count: $.soft_deny,
    auto_mode_hard_deny_rule_count: $.hard_deny,   // ← v2.1.136
    auto_mode_environment_rule_count: $.environment,
    auto_mode_rule_word_count: q,
  };
}
```

This emits a `tengu_startup_telemetry` event with per-section rule counts. The Anthropic team can see, across the fleet, how many users adopted `hard_deny`, whether they put 1 rule or 50, and whether the `$defaults` sentinel is widely used.

---

## 5. The Classifier Prompt Template — Two Stages

The classifier system prompt is built by `WS7` (the wireup function — chunks `_top_*`, line 337728-337736):

```javascript
function WS7(H) {
  let $ = Kz8(),               // built-in defaults
    q = (K) => K;              // identity transform
  return {
    allow:       wJ$(H?.allow,       $.allow,       q),
    soft_deny:   wJ$(H?.soft_deny,   $.soft_deny,   q),
    hard_deny:   wJ$(H?.hard_deny,   $.hard_deny,   q),
    environment: wJ$(H?.environment, $.environment, q),
  };
}
```

This drives template substitution against the classifier system prompt template (read from a packed text file by `eA8`). The template has sentinels:

```xml
<user_allow_rules_to_replace>- (built-in rule 1)\n- (built-in rule 2)</user_allow_rules_to_replace>
<user_soft_deny_rules_to_replace>...</user_soft_deny_rules_to_replace>
<user_hard_deny_rules_to_replace>- Data Exfiltration: ...\n- Safety-Check Bypass: ...</user_hard_deny_rules_to_replace>
<user_environment_to_replace>...</user_environment_to_replace>
```

The built-in `hard_deny` defaults (line 337644) include:
- **Data Exfiltration**: HTTP/file upload/git push to external repos/changing API base URL/uploading to public storage
- **Safety-Check Bypass**: using a command's flags/config/aliases/extension points to launch a different command through it — *"The wrapping command being allowed does not make the payload allowed."*

This is the seam where v2.1.113's wrapper-deny work (see [`bash_wrapper_deny.md`](./bash_wrapper_deny.md)) lands as a *classifier rule* in addition to the static AST check.

---

## 6. The CLI Critique Tool — `claude auto-mode critique`

v2.1.136 also ships a CLI tool that asks Claude to critique the user's custom rules. Three pieces wire together (`R08`, `S08`, `$KA`):

- `S08(rules)` checks if any non-`$defaults` rules exist (skip critique if user has only `$defaults`)
- `R08(name, userRules, defaultRules)` formats one section for the prompt, marking whether user rules **replace** or **extend** defaults (based on `$defaults` presence)
- `$KA` is the critique system prompt that asks Claude to flag clarity/completeness/conflict/actionability issues

The output looks like:

```markdown
## hard_deny (custom rules added alongside the defaults)
Custom:
- Block any write to /etc/secrets/**
- Block kubectl exec into prod

Defaults also in effect:
- Data Exfiltration: ...
- Safety-Check Bypass: ...
```

This is the **user-facing surface** of `$defaults` — the user can see exactly which rules are merging in.

---

## 7. v2.1.141: Permission Dialog Explains `permissions.ask` Triggers

The companion piece to v2.1.136's `hard_deny` is v2.1.141's UX: when a `permissions.ask` rule fires, the user sees **which rule** asked. Pre-fix:

```
Claude requested permissions to use Bash, but you haven't granted it yet.
```

Post-fix (`N5` in chunks `_top_*`, line 421519-421562):

```javascript
function N5(H, $) {
  if ($) {
    if ($.type === "classifier")
      return `Classifier '${$.classifier}' requires approval for this ${H} command: ${$.reason}`;
    switch ($.type) {
      case "rule": {
        let K = wz($.rule.ruleValue),
          _ = arH($.rule.source);
        return `Permission rule '${K}' from ${_} requires approval for this ${H} command`;
      }
      // ... other reason types
    }
  }
  return `Claude requested permissions to use ${H}, but you haven't granted it yet.`;
}
```

If `decisionReason.type === "rule"`, the message becomes:

> Permission rule `Bash(rm *)` from project settings requires approval for this Bash command

This makes it visible to the user **which rule** caused the prompt — they can fix it in `~/.claude/settings.json` rather than guessing.

### Why this matters with hard_deny

When a `hard_deny` rule fires in stage 1, the user sees `Classifier 'AutoMode' requires approval for this Bash command: <hard_deny reason>` — the **reason** field carries the classifier's chain-of-thought, telling the user *why* the unconditional block fired. This is the only signal that says "your CLAUDE.md autonomy text *did not* override this" — the message style makes the policy authority chain visible.

---

## 8. The Defense-in-Depth Story

`hard_deny` slots into the existing pipeline as a **classifier-driven** layer (a *prompt-engineering* defense), parallel to:

| Layer | Mechanism | Strength | Speed |
|---|---|---|---|
| Bash classifier (`uNH`, etc.) | AST + static analysis | Strong (no LLM in the loop) | Fast |
| `permissions.deny` | Settings-driven, exact/glob match | Strong | Fast |
| Sandbox safety (`nUH`, `IX6`) | Path checks | Strong | Fast |
| **Auto-mode `hard_deny` (NEW)** | **LLM classifier, stage 1 (no intent override)** | **Strong (LLM-controlled)** | **Slow (~1s side-query)** |
| Auto-mode `soft_deny` | LLM classifier, stage 2 (intent applies) | Medium (overridable) | Slow |

The trade-off: `hard_deny` rules are **LLM-evaluated**, so the rule text must be persuasive to Claude (not regex-matchable). This is why the rule text reads like English ("Data Exfiltration: ...") rather than glob patterns. The advantage is *generality* — a single `hard_deny` rule can cover a *category* of behaviors that would need many regex rules.

The downside is the classifier can be wrong (false negatives — a real exfiltration looks like a benign upload to the classifier). The mitigation: `hard_deny` is **stage 1** before user intent applies, so even an autonomy-encouraging CLAUDE.md doesn't bypass it. Real false negatives stem from rule wording, not from user signaling.

---

## 9. Why Settings (Not Code) For This

The decision to express `hard_deny` rules as **settings strings** rather than **code constants** is significant:

- Enterprises can add their own (`policySettings.autoMode.hard_deny`) without forking
- The classifier reads the rules as part of its system prompt; updates take effect immediately on the next side-query (no model retrain)
- Users can experiment without rebuilding

The cost is verbosity — the rule must be *self-describing* in English. The team accepted this because: (a) auto-mode is already running an LLM per tool call, so the marginal cost of more prompt text is minimal; (b) the audience for `hard_deny` is sophisticated (admins, security teams), not casual users.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_core_features.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md) — Existing auto-mode symbols

Key functions and constants in this document:
- `autoModeSettingsSchema` (`dI9`) — Zod schema for `autoMode.{allow,soft_deny,hard_deny,deny,environment}`
- `loadAutoModeRulesFromSettings` (`WAH`) — Concatenates rules across all four settings tiers
- `mergeAutoModeWithDefaults` (`WS7`) — Combines user rules with built-in defaults
- `getBuiltInClassifierRules` (`Kz8`) — Returns `{ allow, soft_deny, hard_deny, environment }` from the prompt template
- `extractDefaultRules` (`eA8`) — Parses XML sentinels in the classifier prompt to get default rules
- `expandDefaultsList` (`wJ$`) — Inserts `$defaults` placeholder
- `defaultsTokenString` (`llH`) — `"$defaults"`
- `countAutoModeRules` (`MKA`) — Telemetry helper for rule counts per section
- `formatCustomRulesSection` (`R08`) — CLI critique formatter (custom + default rules markdown)
- `hasNonDefaultRules` (`S08`) — Returns true if any user rules exist beyond `$defaults`
- `classifierCritiqueSystemPrompt` (`$KA`) — System prompt for the `claude auto-mode critique` command
- `buildPermissionMessage` (`N5`) — Builds user-facing prompt message with rule attribution (v2.1.141)
- `hardDenyStageOnePromptSuffix` (`CF_`) — Stage 1 thinking instruction ("Stage 1 does NOT apply user intent")
- `hardDenyStageTwoPromptSuffix` (`bF_`) — Stage 2 thinking instruction (intent applies)
- `settings.autoMode.hard_deny` — v2.1.136 settings key
- `tengu_auto_mode_hard_deny_rule_count` telemetry field — Per-startup rule count
