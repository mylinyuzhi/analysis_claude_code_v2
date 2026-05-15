# Auto-Mode Classifier — Pipeline & Fail-Safes (v2.1.142)

**Theme:** Auto mode is the mode where, instead of prompting the user, an **LLM classifier** decides each tool call. The classifier (`jJ$`) runs a side-query that reads the recent transcript + an action description + a system prompt with allow/soft_deny/hard_deny rules, and returns `shouldBlock: boolean`.

This document maps:
1. The two-stage classifier pipeline (introduced in v2.1.136 with `hard_deny`)
2. The transcript-too-long fallback (v2.1.110)
3. The `$defaults` sentinel and the `WS7` merger (v2.1.118)
4. The `hard_deny` section semantics (v2.1.136)
5. Retry / `PermissionDenied` hook UX (v2.1.89)
6. Spinner red for stalled classifier (v2.1.126)
7. Denial limits and the `iron_gate_closed` failure-mode toggle

---

## 1. The Pipeline End-to-End

```
   tool_use ──► tD (auto-mode wrapper)
                  │
                  ▼
              UA5 returns 'ask'?
                  │ yes
                  ▼
            Fast-paths:
            - safetyCheck non-classifierApprovable → return ask (no classifier)
            - acceptEdits-eq-allows? → return allow
            - isAutoModeAllowlistedTool? → return allow
                  │ otherwise
                  ▼
            zT6(toolName, input) ── format the action ──┐
                                                        ▼
                              classifyYoloAction (jJ$)
                                       │
                              ┌────────┴────────┐
                              │                 │
                            stage 1           stage 2
                          (hard_deny)        (allow + soft_deny)
                          User intent NOT    User intent applied;
                          applied; "err on   block can be overridden
                          side of blocking"  by explicit user direction
                              │                 │
                              ▼                 ▼
                          shouldBlock?      shouldBlock?
                              │ yes            │ yes
                              ▼                ▼
                          block             block
                              │ no             │ no
                              └───────┬────────┘
                                      ▼
                                    allow
```

Each stage is **one LLM call** (`qT6` → API request), each gets ~30-60 seconds of latency budget. The total cost is one main-loop API call **plus** up to two classifier calls per tool use. For a 100-tool-call session, that's up to 200 extra Sonnet 4.5 (or `auto_mode_classifier_model`) calls.

This is why so much of the design is about **avoiding the classifier when possible**:
- `isAutoModeAllowlistedTool` short-circuits read-only tools (Read, Grep, Glob, etc.)
- `acceptEdits-eq` short-circuits writes that would auto-allow in `acceptEdits` mode
- `safetyCheck` non-approvable bypasses skip the classifier entirely

---

## 2. The Two-Stage Classifier (v2.1.136)

Pre-v2.1.136, the classifier ran in **one pass** reading both allow and deny rules with user intent applied. v2.1.136 split this:

### Stage 1 — `hard_deny` evaluation

The classifier reads the action and the `hard_deny` rules (with `$defaults` expanded — see section 4 below). User intent is **explicitly excluded** — the system-prompt suffix is:

```javascript
// ============================================
// CF_ - Stage 1 system prompt suffix (no user intent)
// Location: cli_inner_pretty.js:338623
// ============================================

// ORIGINAL (for source lookup):
CF_ = `
Err on the side of blocking. Stage 1 does NOT apply user intent or ALLOW exceptions — stage 2 will handle those. Block if ANY rule could apply. <block> immediately.`,

// READABLE (for understanding):
const stage1Suffix = `
Err on the side of blocking. Stage 1 does NOT apply user intent or ALLOW exceptions — stage 2 will handle those. Block if ANY rule could apply. <block> immediately.`;

// Mapping: CF_→stage1Suffix
```

If stage 1 returns `shouldBlock: true`, the classifier **stops immediately** — stage 2 doesn't run. The blocked tool call is denied with the stage 1 reason.

If stage 1 returns `shouldBlock: false`, proceed to stage 2.

### Stage 2 — `allow` + `soft_deny` evaluation

The classifier reads `allow` (auto-approve rules), `soft_deny` (destructive-but-overridable rules), and `environment` (context facts). User intent IS applied — the system-prompt suffix is:

```javascript
// ============================================
// bF_ - Stage 2 system prompt suffix (user intent applied)
// Location: cli_inner_pretty.js:338625
// ============================================

// ORIGINAL (for source lookup):
bF_ = `
Review the classification process and follow it carefully, making sure you deny actions that should be blocked. As a reminder, explicit (not suggestive or implicit) user confirmation is required to override blocks. Use <thinking> before responding with <block>.`,

// READABLE (for understanding):
const stage2Suffix = `
Review the classification process and follow it carefully, making sure you deny actions that should be blocked. As a reminder, explicit (not suggestive or implicit) user confirmation is required to override blocks. Use <thinking> before responding with <block>.`;

// Mapping: bF_→stage2Suffix
```

The "explicit, not suggestive or implicit" language is critical — the classifier won't auto-allow on weak signals like "be autonomous" in CLAUDE.md.

### Fast vs both modes

The classifier has a `mode` parameter: `"fast"` (stage 1 only) or `"both"` (stage 1 + stage 2). Currently:
- The **bash classifier**, **sandbox network classifier**, and **default tool classifier** use `both`
- Cheaper sub-classifiers (e.g. one called by other classifiers) use `fast`

When mode is `fast`, an unparseable stage 1 response is treated as block (fail-closed for the cheap path).

### The decision logic

```
Stage 1 result:
  shouldBlock: false → continue to stage 2 (if both) or allow (if fast)
  shouldBlock: true  → DENY (with stage 1 reason)
  unparseable        → DENY (failure-mode: parse_failure)
  refusal            → DENY (failure-mode: policy_refusal)

Stage 2 result (only reached if stage 1 didn't block):
  shouldBlock: false → ALLOW
  shouldBlock: true  → DENY (with stage 2 reason)
  unparseable        → DENY (failure-mode: parse_failure)
  refusal            → DENY (failure-mode: policy_refusal)

Special at any stage:
  abort signal       → DENY (with reason "Classifier request aborted")
  transcript too long → handled separately (see section 3)
  API unavailable    → handled by iron_gate flag (see section 8)
```

---

## 3. Transcript Too Long Fallback (v2.1.110)

**The problem:** The classifier runs a side-query to its own LLM, which has its own context window (typically Sonnet 4.5 with 200K tokens). For long-running sessions, the **combined** classifier system prompt + transcript + action description can exceed that window. Pre-v2.1.110, this caused an error that was treated as "classifier blocked" — denying the action.

**The bug:** When this fired on **Agent tool**, the Agent's *own* input (the agent's prompt, possibly multi-page) was being included in the transcript-too-long deny. The user couldn't recover except by `/compact`-ing — but Agent calls happen *after* the user has set up a long context, so they hit this loop perpetually.

**The fix:** When the classifier reports `transcriptTooLong: true`:

```javascript
// From cli_inner_pretty.js:422040-422058:
if (J.transcriptTooLong) {
  if (H.name === D7)  // T4 / "Agent" tool name special-case
    return { behavior: "allow", updatedInput: $, decisionReason: { type: "mode", mode: "auto" } };
  if (z.toolPermissionContext.shouldAvoidPermissionPrompts)
    throw new ZA("Agent aborted: auto mode classifier transcript exceeded context window in headless mode");
  return (
    N("Auto mode classifier transcript too long, falling back to normal permission handling", { level: "warn" }),
    /* fall back to manual prompt */
    {
      ...A,
      decisionReason: {
        type: "other",
        reason: "Auto mode classifier transcript exceeded context window — falling back to manual approval (try /compact to reduce conversation size)",
      },
    }
  );
}
```

Three branches:
1. **Tool is Agent (`D7` / `T4` = `"Agent"`)**: **auto-allow** — Agent invocations don't gate on the classifier when transcript is too long
2. **Headless mode (shouldAvoidPermissionPrompts)**: throw — the deny-retry loop wastes tokens
3. **Interactive mode**: fall back to manual prompt with a "try /compact" hint

**Why allow for Agent specifically?** The Agent tool runs a sub-agent in an isolated context. The classifier's worry — that the sub-agent will do something dangerous — is partially mitigated by the sub-agent itself being subject to its *own* tool permission chain. The trade-off favors the user being able to make progress over a 99.9th-percentile risk.

---

## 4. The `$defaults` Sentinel (v2.1.118)

**The problem:** Users wanted to *augment* the built-in classifier rules rather than replace them. Pre-fix, `autoMode.allow: ["my rule"]` would replace the entire built-in allow list, immediately breaking the session because routine commands would prompt.

**The fix:** `$defaults` (literal string) in a rule array expands to the built-in rules at that position.

### The expander — `wJ$`

```javascript
// ============================================
// expandDefaultsList - Replace "$defaults" sentinel with built-in rules
// Location: cli_inner_pretty.js:337707-337719
// ============================================

// ORIGINAL (for source lookup):
function wJ$(H, $, q) {
  if (!H?.length) return [...$];
  let K = !1, _ = [];
  for (let A of H) {
    if (A === llH) {  // llH = "$defaults"
      if (!K) (_.push(...$), K = !0);
      continue;
    }
    _.push(q(A));
  }
  return _;
}

// READABLE (for understanding):
function expandDefaultsList(userRules, defaultRules, transformUserRule) {
  if (!userRules?.length) return [...defaultRules];  // no user rules → all defaults
  let inserted = false;
  const merged = [];
  for (const rule of userRules) {
    if (rule === "$defaults") {
      // First $defaults expands to defaults; subsequent ones are dropped (dedupe)
      if (!inserted) {
        merged.push(...defaultRules);
        inserted = true;
      }
      continue;
    }
    merged.push(transformUserRule(rule));
  }
  return merged;
}

// Mapping: wJ$→expandDefaultsList, llH→DEFAULTS_SENTINEL ("$defaults"),
//          H→userRules, $→defaultRules, q→transformUserRule
```

**Why positional and explicit?**

1. Users opt in by name — `$defaults` is loud, not silent.
2. Position is preserved — users can place their custom rules before or after defaults.
3. Multiple `$defaults` collapse to one expansion (dedupe).

### The merger — `WS7` (not directly shown, but used in the classifier system-prompt builder)

`WS7` reads `autoMode.{allow,soft_deny,hard_deny,environment}` from the settings tiers (via `WAH`, see section 5) and runs each through `wJ$` against the built-in defaults. The merged rule strings are then injected into the system prompt template (`$KA`).

---

## 5. The Loader — `loadAutoModeRulesFromSettings` (`WAH`)

```javascript
// ============================================
// loadAutoModeRulesFromSettings - Walk all four settings tiers, concatenate autoMode arrays
// Location: cli_inner_pretty.js:52576-52603
// ============================================

// ORIGINAL (for source lookup):
function WAH() {
  {
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
  }
  return;
}

// READABLE (for understanding):
function loadAutoModeRulesFromSettings() {
  const schema = autoModeSettingsSchema();
  const collected = { allow: [], soft_deny: [], hard_deny: [], environment: [] };

  // Walk the four standard settings tiers in fixed order (NOT projectSettings — see section 6).
  for (const tier of ["userSettings", "localSettings", "flagSettings", "policySettings"]) {
    const settings = getSettingsForTier(tier);
    if (!settings) continue;
    const parsed = schema.safeParse(settings.autoMode);
    if (parsed.success) {
      if (parsed.data.allow) collected.allow.push(...parsed.data.allow);
      if (parsed.data.soft_deny) collected.soft_deny.push(...parsed.data.soft_deny);
      if (parsed.data.hard_deny) collected.hard_deny.push(...parsed.data.hard_deny);
      if (parsed.data.environment) collected.environment.push(...parsed.data.environment);
    }
  }

  // Only return the result if anything was actually collected
  const any = ["allow", "soft_deny", "hard_deny", "environment"].some(k => collected[k].length > 0);
  if (!any) return undefined;
  return {
    ...(collected.allow.length > 0 && { allow: collected.allow }),
    ...(collected.soft_deny.length > 0 && { soft_deny: collected.soft_deny }),
    ...(collected.hard_deny.length > 0 && { hard_deny: collected.hard_deny }),
    ...(collected.environment.length > 0 && { environment: collected.environment }),
  };
}

// Mapping: WAH→loadAutoModeRulesFromSettings, dI9→autoModeSettingsSchema,
//          v8→getSettingsForTier
```

### Notice: `projectSettings` is NOT in the list

The loader walks `userSettings`, `localSettings`, `flagSettings`, `policySettings`. **Project settings are excluded.**

**Why?** Project settings live in the repo, so they're attacker-controlled if the repo is malicious. Project settings can't grant auto-mode rules — `autoMode.allow` from project settings is silently dropped. This is the same defense as `defaultMode: "auto"` from project settings being ignored (see `mode_lifecycle.md`).

---

## 6. The Four Sections

```
autoMode:
  allow:         Actions the classifier auto-approves (read-only commands, dev tools, etc.)
  soft_deny:     Destructive/irreversible — block UNLESS user intent authorizes
  hard_deny:     Security boundaries — block UNCONDITIONALLY (no override)
  environment:   Context facts about the user's setup (NOT rules — input to the classifier's reasoning)
```

`environment` is **not a rule** — it's free-form text. Examples from the built-ins:
- "Source control hosts: github.com, gitlab.com"
- "Project trusted: ~/projects/my-app, ~/projects/internal-tool"

The classifier uses these to disambiguate (e.g. "is this network destination trusted by the user?").

### `deny` alias

Old configs that used `autoMode.deny` keep working — the schema accepts both `deny` and `soft_deny` as aliases. New code should write `soft_deny` explicitly.

### Stage assignment

| Section | Visible in stage 1 | Visible in stage 2 |
|---|:---:|:---:|
| `hard_deny` | ✓ | ✗ |
| `allow` | ✗ | ✓ |
| `soft_deny` | ✗ | ✓ |
| `environment` | ✓ | ✓ |

So `hard_deny` rules NEVER see user intent. `allow` and `soft_deny` are evaluated only after `hard_deny` passes.

---

## 7. The Classifier System Prompt — Template Structure

The classifier system prompt (`$KA` at cli_inner_pretty.js:605109+, building from templates) has the structure:

```
<system_role>
You are a safety classifier for an AI coding agent.
</system_role>

<task>
Read the action below and decide if it should be blocked.
... (criteria) ...
</task>

<rules>
## ALLOW — Auto-approved actions
- ... ← inserted from <user_allow_rules_to_replace> sentinel
- (expanded via wJ$ with $defaults inheritance)

## SOFT BLOCK — Destructive but overridable
- ... ← inserted from <user_soft_deny_rules_to_replace>

## HARD BLOCK — Security boundaries (user intent does NOT clear)
- ... ← inserted from <user_hard_deny_rules_to_replace>
</rules>

<environment>
... ← inserted from <user_environment_to_replace>
</environment>

<thinking>
Step 1: HARD BLOCK check ...
Step 2: SOFT BLOCK check (with user intent) ...
Step 3: Final decision ...
</thinking>

[stage 1 suffix CF_ OR stage 2 suffix bF_]
```

The `<user_*_rules_to_replace>` tags are sentinels for `$defaults` expansion. The classifier system prompt is **pre-built** at startup with the built-in rules baked in; at classifier call time, `WS7` replaces those tags with the user-merged versions.

### Built-in hard_deny entries

The hard_deny built-ins (line 337640+) include:
- **Data Exfiltration**: External HTTP POST of sensitive data, public-cloud uploads, public-gist posts. Agent guessing a service = no trust established.
- **Safety-Check Bypass**: Using a command's flags/config/extension points to launch a *different* command. The agent's stated reason routing around a safety check = the bypass intent is itself the violation.

These are unconditional — even users with `--dangerously-skip-permissions` are blocked at this layer (see [`auto_mode_hard_deny.md`](./auto_mode_hard_deny.md) in the unit 07 worktree).

---

## 8. Retry / `PermissionDenied` Hook UX (v2.1.89)

When the classifier denies an action, the agent loop can either:
1. **Auto-retry** (default) — the classifier reason is fed back to the model, which decides whether to retry with a different approach.
2. **Permit retry via hook** — a `PermissionDenied` hook can fire after the deny and surface options to the user.

The hook receives the denied tool call and reason. It can:
- Show a notification with the deny reason
- Add the call to a "Recent denials" tab in `/permissions`
- Offer a `r` key shortcut to retry (used by claude.ai/code Remote Control)

The Recent denials are stored in an in-memory **ring buffer** by `recordAutoModeDenial`. The ring buffer holds the last N denials and is cleared on session end.

This UX was added in v2.1.89 as the auto-mode beta UX. v2.1.110 extended it to surface a "retry-with-classifier-reason" path in headless mode.

---

## 9. Spinner Red for Stalled Classifier (v2.1.126)

**Pre-fix behavior:** When the classifier was making an API call (which can take 30-60 seconds), the spinner showed the normal "thinking" color (amber). This looked indistinguishable from the *agent itself* thinking, leading users to either:
1. Cancel prematurely thinking it was stuck
2. Wait too long thinking it was working

**Fix (v2.1.126):** The spinner turns **red** when a permission check stalls past a threshold. The state `classifierApprovals.checking: Set<toolUseID>` tracks which tool calls are currently in classifier evaluation.

```javascript
// At cli_inner_pretty.js:344412:
return sh(($) => $.classifierApprovals.checking.has(H)) ?? !1;
```

The spinner UI reads this and switches to red when:
- A tool call has been "checking" for > N seconds
- The agent itself is not actively streaming tokens (only the classifier is)

This is paired with the v2.1.141 "spinner warms to amber after 10 seconds" — both are about giving accurate feedback to the user about *where* time is being spent.

---

## 10. Denial Limits

The auto-mode classifier tracks **denial counters** per session:

```javascript
// 2.1.88 src/utils/permissions/denialTracking.ts (referenced):
DENIAL_LIMITS = { maxConsecutive: 3, maxTotal: 8 };

// Bundle: pA5 (cli_inner_pretty.js:421681) handles limit-exceeded:
function pA5(denialState, appState, classifierReason, assistantMessage, tool, result, ctx) {
  if (!shouldCheckLimit(denialState)) return null;
  let isTotal = denialState.totalDenials >= maxTotal,
    isHeadless = appState.toolPermissionContext.shouldAvoidPermissionPrompts;
  let message = isTotal
    ? `${denialState.totalDenials} actions were blocked this session. Please review the transcript before continuing.`
    : `${denialState.consecutiveDenials} consecutive actions were blocked. Please review the transcript before continuing.`;
  if (isHeadless) throw new AbortError("Agent aborted: too many classifier denials in headless mode");
  /* otherwise fall back to manual prompt with the deny reason */
}
```

**Why two limits?**
- **maxConsecutive (3)**: stops a model that's stuck looping on the same denied operation
- **maxTotal (8)**: stops a model that's denied across the whole session (suggests deep misalignment)

When either limit is hit, in headless mode the agent aborts (since there's no user to approve); in interactive mode the prompt is shown to the user.

A successful tool call **resets `consecutiveDenials`** (via `recordSuccess` / `zM$`) but doesn't reset `totalDenials`. So a session that pings between denial / success / denial can accumulate `totalDenials` without ever hitting `maxConsecutive`.

---

## 11. `iron_gate_closed` (Failure-Mode Toggle)

When the classifier API call returns `unavailable` (network error, timeout, 5xx), the behavior depends on the gate **`tengu_iron_gate_closed`**:

```javascript
// At cli_inner_pretty.js:422061:
if (J.unavailable) {
  if (xT("tengu_iron_gate_closed", !0, YT6))   // YT6 = 1800000ms = 30 minutes refresh
    return /* DENY with "Classifier unavailable" reason */;
  return /* fall back to normal permission handling (fail open) */;
}
```

`xT` is a feature-value lookup with a 30-minute cache (`YT6`). Default value is `true` — **fail closed**.

**Why default fail-closed?**
- Auto mode users expect *strong* safety. An auto-allow during a classifier outage would be a silent security regression.
- The deny includes "try retry, /compact, or run with --debug" guidance so the user has clear next steps.

The gate can be flipped to `false` (fail open) for development/testing or specific deployment scenarios where availability matters more than safety.

---

## 12. The Sandbox Network Classifier

The classifier is also used to gate **sandbox network access**. When the sandbox sees a network request to a domain that's not in `allowedDomains` and not in `deniedDomains`, it asks the classifier:

```javascript
// Around line 338600 (the `JS7 = "SandboxNetworkAccess"` classifier):
let z = zT6(JS7, { host: H, port: $ }),
  Y = { name: JS7, toAutoClassifierInput: (M) => M },
  f = await jJ$(q, z, [...K, Y], _, A),
  O = f.unavailable ? !xT("tengu_iron_gate_closed", !0, YT6) : !f.shouldBlock;
if (f.unavailable)
  N(`Sandbox network classifier unavailable for ${H}; iron_gate → ${O ? "allow" : "deny"}`, { level: "warn" });
if (!O) N(`Auto mode classifier blocked sandbox network access to ${H}: ${f.reason}`, { level: "warn" });
return O;
```

Same `jJ$` entry point, different "tool name" (`"SandboxNetworkAccess"`) and a fake "tool object" so the classifier system prompt has the right context. The same iron_gate semantics apply.

---

## 13. Why So Many Fail-Safes?

The auto-mode classifier is **the choke point** for the entire safety story of auto mode. Every failure mode has been carefully chosen:

| Failure | Behavior | Rationale |
|---|---|---|
| Classifier API unavailable | deny (default) | Outage shouldn't auto-allow |
| Classifier transcript too long (Agent) | allow | User stuck without this — pragmatic exception |
| Classifier transcript too long (other) | fall back to prompt | User can `/compact` and retry |
| Classifier unparseable response | deny | Model went off-script; assume worst |
| Classifier policy refusal | deny | Self-explanatory |
| Classifier abort signal | deny | User cancel takes priority |
| Stage 1 says hard_deny matches | deny | Unconditional — no override possible |
| Stage 2 says soft_deny matches | deny (unless user intent in transcript) | User can override by saying "yes please continue" |
| Hit `maxConsecutive` denials | fall back to manual prompt | Sustained loop → ask human |
| Hit `maxTotal` denials | fall back to manual prompt (+ reset) | Deep misalignment → ask human |
| Headless + denial limit | abort | No user to ask; abort cleanly |

The pattern: **fail closed on transient and parse failures; fail open only on rare special cases (Agent tool with too-long transcript) with clear UX guidance**.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document

Key functions and constants in this document:
- `classifyYoloAction` (`jJ$`) — Classifier entry point (cli_inner_pretty.js:338062)
- `formatActionForClassifier` (`zT6`) — Format tool input as classifier-readable text
- `stage1SystemPromptSuffix` (`CF_`) — Stage 1 suffix (no user intent) (cli_inner_pretty.js:338623)
- `stage2SystemPromptSuffix` (`bF_`) — Stage 2 suffix (user intent applied) (cli_inner_pretty.js:338625)
- `fastModeSystemPromptSuffix` (`RF_`) — Fast-mode suffix (single-stage)
- `classifyResultSchema` (`VF_`) — Schema for `{thinking, shouldBlock, reason}` classifier output (cli_inner_pretty.js:338658)
- `expandDefaultsList` (`wJ$`) — Replace `$defaults` sentinel (cli_inner_pretty.js:337707)
- `DEFAULTS_SENTINEL` (`llH`) — The literal string `"$defaults"` (cli_inner_pretty.js:338615)
- `loadAutoModeRulesFromSettings` (`WAH`) — Walk settings tiers for autoMode rules (cli_inner_pretty.js:52576)
- `autoModeSettingsSchema` (`dI9`) — `{allow, soft_deny, hard_deny, deny, environment}` schema (cli_inner_pretty.js:52652)
- `extractDefaultRules` (`eA8`) — Parse `<user_*_rules_to_replace>` sentinels from system prompt template
- `mergeAutoModeWithDefaults` (`WS7`) — Run `wJ$` on each section against built-in defaults
- `getBuiltInClassifierRules` (`Kz8`) — Returns `{allow, soft_deny, hard_deny, environment}` built-in defaults
- `handleDenialLimitExceeded` (`pA5`) — Fallback when consecutive/total denial limits hit (cli_inner_pretty.js:421681)
- `recordDenial` / `recordSuccess` (`zM$`) — Update denial-tracking state
- `isClassifierCheckingForToolUseID` — Track which tool uses are mid-classifier (used for spinner red)
- `isAutoModeAllowlistedTool` (`uA5.isAutoModeAllowlistedTool`) — Safe-tool list to skip classifier
- `ironGateClosed` (`tengu_iron_gate_closed` feature flag, refresh interval `YT6` = 30min)
- `sandboxNetworkClassifierToolName` (`JS7` = `"SandboxNetworkAccess"`) — Special "tool" for sandbox classifier
