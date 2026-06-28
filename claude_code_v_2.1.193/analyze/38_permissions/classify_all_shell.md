# `autoMode.classifyAllShell` — route ALL Bash/PowerShell through the auto-mode classifier

> **Type/version:** NET-NEW settings flag + one-line predicate change — **v2.1.193** (no published changelog bullet names it directly; appears in the 2.1.193 build with `grep -c classifyAllShell` going **183=0 → 193=2**).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). Every `cli_inner_pretty.js:<line>` below is a **193** line unless tagged **(183)**.

---

## TL;DR

Auto mode normally **trusts** the user's Bash/PowerShell `allow` rules: a command that matches an `alwaysAllow` rule (e.g. `Bash(git status:*)`) is admitted without calling the auto-mode classifier. The only exception was a hard-coded "arbitrary code execution" carve-out — interpreter prefixes like `python -c`, `node -e`, `eval`, `sudo`, `curl … |`, `kubectl exec` — which were *always* re-classified even if an allow rule matched.

`classifyAllShell` is a new boolean settings flag that **collapses that trust entirely**. When any settings source has `autoMode.classifyAllShell === true`, **every** Bash/PowerShell `allow` rule is suspended while auto mode is active, so *all* shell commands flow through the classifier — not just the dangerous-prefix ones. The schema states the trade-off verbatim: *"higher safety, more classifier calls."* Default is `false`, so an upgrade changes nothing until an org/user opts in.

The entire feature is **one prepended `if` line** inside the existing allow-rule-suspend predicate, plus a settings schema field, a cross-source gate, and a thin wrapper. The four call sites that already consumed the suspend predicate get the new behavior for free.

---

## 1. The settings field: `autoMode.classifier.classifyAllShell`

**What it does.** Declares a new optional boolean on the auto-mode classifier settings object, with a describe string that doubles as the design rationale.

```javascript
// ============================================
// classifyAllShell schema field - the opt-in flag on autoMode.classifier
// Location: cli_inner_pretty.js:55814-55822
// ============================================

// ORIGINAL (for source lookup):
classifyAllShell: A.boolean()
  .optional()
  .describe(
    "When true, every Bash/PowerShell allow rule is suspended while auto mode is active so all shell commands are routed through the classifier (higher safety, more classifier calls). Default: false.",
  ),

// READABLE (for understanding):
classifyAllShell: zod.boolean()
  .optional()
  .describe(
    "When true, every Bash/PowerShell allow rule is suspended while auto mode is active so all "
    + "shell commands are routed through the classifier (higher safety, more classifier calls). Default: false.",
  ),

// Mapping: A→zod (the zod namespace alias in this build)
```

**Why a settings flag (not an env var or a hard default).** Three properties matter:

1. **Opt-in, default-off.** The describe string ends `Default: false`. The flag is purely additive: on upgrade, an org that does not set it sees no behavioral change. This is the right default because the cost ("more classifier calls" = more latency + token spend per shell command) is real and only worth paying where the safety upgrade is wanted.
2. **It lives under the `autoMode.classifier` sub-object** alongside the classifier `environment` config (the field immediately above it at `:55810`), so it is naturally scoped to *auto mode*, which is the only mode the suspend predicate consults (see §4).
3. **It is read across all four settings sources** (§2), so a policy administrator can force it on via `policySettings` while a user could enable it locally — the standard settings-precedence model.

---

## 2. The cross-source gate: `isClassifyAllShellEnabled` (`$Cr`)

**What it does.** Returns `true` if **any** of the four settings sources has `autoMode.classifyAllShell === true`. This is an OR across sources — a single source enabling it is enough.

```javascript
// ============================================
// isClassifyAllShellEnabled - true if any settings source enables classifyAllShell
// Location: cli_inner_pretty.js:58758-58761
// ============================================

// ORIGINAL (for source lookup):
function $Cr() {
  for (let e of Uys) if (_n(e)?.autoMode?.classifyAllShell === !0) return !0;
  return !1;
}

// READABLE (for understanding):
function isClassifyAllShellEnabled() {
  for (let source of SETTINGS_SOURCES)                       // Uys = ["userSettings","localSettings","flagSettings","policySettings"]
    if (readSettings(source)?.autoMode?.classifyAllShell === true) return true;
  return false;
}

// Mapping: $Cr→isClassifyAllShellEnabled, Uys→SETTINGS_SOURCES, _n→readSettings
```

The source list is the standard four-source array (`cli_inner_pretty.js:58827`):

```javascript
// ORIGINAL: Uys = ["userSettings", "localSettings", "flagSettings", "policySettings"]
```

**Why OR-across-sources and a strict `=== true`.** Two deliberate choices:

- **OR semantics** mean the flag behaves like a *capability escalation*: any layer can turn the stricter mode on, and no layer's silence (`undefined`) turns it off. For a safety toggle this is the conservative direction — you cannot accidentally *weaken* the policy by omitting the field in a higher-precedence source.
- **Strict `=== true`** (not truthy) means a stray `"false"` string or `0` never accidentally enables it; only the literal boolean `true` counts. This matters because settings come from JSON files of varying hand-edited quality.

> **Naming caution:** `$Cr` here is `isClassifyAllShellEnabled`. Do **not** confuse it with the v2.1.183 `$Cr` which was `isSubagent` — obfuscated tokens are re-mangled every build, and `$Cr` was reassigned in 193. Always resolve by the line, never by the token across versions.

---

## 3. The wrapper: `shouldSuspendAllShellAllowRules` (`sTo`)

A trivial indirection so the predicate body reads cleanly and the gate can be swapped/instrumented in one place:

```javascript
// ============================================
// shouldSuspendAllShellAllowRules - thin wrapper over the gate
// Location: cli_inner_pretty.js:416260-416262
// ============================================

// ORIGINAL (for source lookup):
function sTo() {
  return $Cr();
}

// READABLE (for understanding):
function shouldSuspendAllShellAllowRules() {
  return isClassifyAllShellEnabled();
}

// Mapping: sTo→shouldSuspendAllShellAllowRules, $Cr→isClassifyAllShellEnabled
```

---

## 4. The core change: one prepended line in `isShellAllowRuleSuspended` (`r9e`)

**What it does.** `r9e` is the predicate "should this Bash/PowerShell `allow` rule be **ignored** (not honored) right now?" It existed in 183 (as `WGe`) and answered: *yes, if the rule's content matches a dangerous-interpreter prefix (`mqt`/`hqt`) or resolves to the Agent tool (`oTo`)*. The 193 delta is a **single prepended bypass line** that short-circuits to `true` for any Bash/PowerShell rule whenever `classifyAllShell` is on.

**How it works (step by step).**

```javascript
// ============================================
// isShellAllowRuleSuspended - true if a Bash/PowerShell allow rule must NOT be honored
// Location: cli_inner_pretty.js:416263-416270
// ============================================

// ORIGINAL (for source lookup):
function r9e(e, t) {
  if ((e === Io || e === Ss) && sTo()) return !0;
  let n = `${e}\x00${t ?? ""}`,
    r = Orl.get(n);
  if (r !== void 0) return r;
  let o = mqt(e, t) || hqt(e, t) || oTo(e, t);
  return (Orl.set(n, o), o);
}

// READABLE (for understanding):
function isShellAllowRuleSuspended(toolName, ruleContent) {
  // ── NET-NEW in 193 ── if classifyAllShell is on, suspend EVERY Bash/PowerShell allow rule outright,
  //    BEFORE the cache lookup, so the decision is not memoized as a per-rule fact.
  if ((toolName === BASH || toolName === POWERSHELL) && shouldSuspendAllShellAllowRules()) return true;

  let cacheKey = `${toolName}\x00${ruleContent ?? ""}`,
    cached = shellRuleSuspendCache.get(cacheKey);
  if (cached !== undefined) return cached;                       // memoized dangerous-prefix verdict

  // Pre-existing path (carryover): suspend only "arbitrary code execution" rules
  let suspended = isDangerousBashAllowRule(toolName, ruleContent)        // mqt — python -c / node -e / eval / sudo / curl|sh …
               || isDangerousPowerShellAllowRule(toolName, ruleContent) // hqt
               || resolvesToAgentTool(toolName, ruleContent);           // oTo — rule content resolves to the Agent tool
  return (shellRuleSuspendCache.set(cacheKey, suspended), suspended);
}

// Mapping: r9e→isShellAllowRuleSuspended, e→toolName, t→ruleContent, Io→BASH, Ss→POWERSHELL,
//          sTo→shouldSuspendAllShellAllowRules, Orl→shellRuleSuspendCache,
//          mqt→isDangerousBashAllowRule, hqt→isDangerousPowerShellAllowRule, oTo→resolvesToAgentTool
```

Walking the predicate for a Bash allow rule when `classifyAllShell=true`:

1. `toolName === BASH` is true and `shouldSuspendAllShellAllowRules()` is true → **`return true` immediately**. The rule is suspended. The dangerous-prefix machinery below never runs for it.
2. When `classifyAllShell=false`, line 1 is skipped and the function behaves **byte-identically to 183**: a cache lookup, then `mqt || hqt || oTo`.

**The single critical placement fact — the bypass precedes the cache.** The new line sits *above* the `Orl.get(n)` cache read. That ordering is load-bearing:

- The dangerous-prefix verdict (`mqt || hqt || oTo`) is a **pure function of `(toolName, ruleContent)`** — it never changes within a process, so it is safely memoized in `Orl`.
- The `classifyAllShell` verdict is **not** a property of the rule — it is a global mode flag. If the bypass were placed *after* the cache (or folded into the memoized `o`), a `true` result would be cached against the rule key and would wrongly persist even if the gate later read differently. Putting the bypass first keeps the cache holding only the stable per-rule fact and leaves the mode-flag decision recomputed each call. This is the clever part: **the feature is one line, and its position relative to the cache is the whole correctness argument.**

**The constants.** `BASH` (`Io = "Bash"`, `:146006`) and `POWERSHELL` (`Ss = "PowerShell"`, `:229433`) are pre-existing tool-name constants. The bypass only fires for these two tools — Read/Write/WebFetch allow rules are unaffected, because `classifyAllShell` is specifically about *shell* command classification.

### 4.1 The 183 before-picture — `WGe` had no bypass line

The equivalent predicate in 183, `WGe` (**(183)** `cli_inner_pretty.js:409907-409913`), is the same body **minus** the prepended line:

```javascript
// (183) cli_inner_pretty.js:409907-409913 — note: NO classifyAllShell clause
function WGe(e, t) {
  let n = `${e}\x00${t ?? ""}`,
    r = EGa.get(n);
  if (r !== void 0) return r;
  let o = Ijt(e, t) || kjt(e, t) || zuo(e, t);
  return (EGa.set(n, o), o);
}
```

`grep -c classifyAllShell` is **0** in 183 and **2** in 193 — the schema field and the `$Cr` read are both net-new; the predicate change is the one prepended line shown above.

---

## 5. Where suspension takes effect — the four callers of `r9e`

`r9e` is the suspension oracle; four sites already consumed it in the auto-mode allow-layer pipeline, so all four inherit the new behavior. Auto mode is recognized by `dQl` (`:597459`): `mode === "auto"` OR (`mode === "plan"` AND auto mode is currently active).

**(a) Allow-layer builder `NEe` (`buildAutoModeAllowLayers`, `:597462`)** — skips any suspended `alwaysAllow` rule:

```javascript
// ============================================
// NEe (buildAutoModeAllowLayers) - drop suspended allow rules when building auto-mode layers
// Location: cli_inner_pretty.js:597462-597475
// ============================================

// ORIGINAL (for source lookup):
function NEe(e) {
  if (dQl(e.mode)) {
    let t = e.alwaysAllowRules, n = [];
    for (let r of ajo) {
      let o = t[r];
      if (o === void 0) continue;
      for (let s of o) {
        let i = ug(s);
        if (r9e(i.toolName, i.ruleContent)) continue;   // ← suspended → never applied as an allow
        n.push({ source: r, ruleBehavior: "allow", ruleValue: i });
      }
    }
    return n;
  }
  ...
}

// READABLE (for understanding):
function buildAutoModeAllowLayers(opts) {
  if (isAutoMode(opts.mode)) {                                  // dQl: "auto" or active plan-auto
    let allowRulesBySource = opts.alwaysAllowRules, layers = [];
    for (let source of SETTINGS_SOURCE_ORDER) {                // ajo
      let rules = allowRulesBySource[source];
      if (rules === undefined) continue;
      for (let raw of rules) {
        let rule = parseRule(raw);                             // ug
        if (isShellAllowRuleSuspended(rule.toolName, rule.ruleContent)) continue; // suspended → skip
        layers.push({ source, ruleBehavior: "allow", ruleValue: rule });
      }
    }
    return layers;
  }
  ...
}

// Mapping: NEe→buildAutoModeAllowLayers, dQl→isAutoMode, ajo→SETTINGS_SOURCE_ORDER, ug→parseRule, r9e→isShellAllowRuleSuspended
```

**(b) Pre-`checkPermissions` filter (`:597964`)** — a filter `(F) => !r9e(F.toolName, F.ruleContent)` is applied to both `alwaysAllowRules` and each permission layer's `allowedTools`, so suspended rules are stripped before the permission check runs.

**(c) Suspended-rule display collector `yjo` (`:598268`)** — collects every `allow` rule whose `r9e` is true (rendered as `Tool(content)` with its source) to produce the user-facing "these allow rules are suspended in auto mode" surface.

**(d) `--allowed-tools` CLI display (`:598279`)** — the same display path for allow rules supplied via the `--allowed-tools` CLI flag.

**Why funnel through one predicate rather than add a flag check at each site.** The four sites already shared `r9e` as the "is this allow rule trustworthy right now?" oracle. By adding the bypass *inside* `r9e`, the feature reaches all four enforcement/display sites with a single edit and **cannot drift** — there is no risk that the permission filter (b) suspends a rule the layer builder (a) still applies, because both ask the same function. The alternative (a `classifyAllShell` check sprinkled at each call site) would be four edits and four chances for inconsistency.

---

## 6. The safety trade-off and the upgrade story

**What the flag buys and costs.**

- **Buys: higher safety.** Without it, the trust boundary is "allow rules are honored except dangerous interpreter prefixes." A crafted command that an allow rule matches but the dangerous-prefix list does not catch would be auto-approved. With `classifyAllShell`, **no** Bash/PowerShell allow rule is trusted in auto mode — every command is judged by the classifier on its merits.
- **Costs: more classifier calls.** Every shell command now incurs a classifier round-trip (latency + token spend) instead of a local allow-rule short-circuit. The schema describe string states this directly: *"higher safety, more classifier calls."*

**The false default — off by default, no upgrade change.** `classifyAllShell` is `.optional()` and documented `Default: false`. On upgrade to 2.1.193, an installation that does not set the flag behaves exactly as 183 did: allow rules are honored, only dangerous prefixes are re-classified. The new behavior is strictly opt-in. This is the correct conservatism for a change that increases per-command cost — the safety upgrade is available to those who want it without imposing latency on everyone.

**Key insight.** The whole feature is a *demotion of trust expressed as one short-circuit line*, gated by a default-off flag and reused through a single suspension oracle. There is no new enforcement pipeline — auto mode already had the machinery to suspend untrusted allow rules (the dangerous-prefix path); `classifyAllShell` simply widens "untrusted" from "dangerous prefixes" to "all shell," in one place, when one flag is set.

---

## Evidence note (NET-NEW vs carryover)

| Item | 193 anchor | 183 status | grep diff |
|------|-----------|------------|-----------|
| `classifyAllShell` schema field | `:55814` | absent | `grep -c classifyAllShell` 183=**0**, 193=**2** |
| `$Cr` gate | `:58758` | absent | net-new |
| `Uys` four-source list | `:58827` | present | carryover |
| `sTo` wrapper | `:416260` | absent | net-new |
| `r9e` predicate **bypass line** | `:416264` | `WGe` had no such line **(183)** `:409907` | one prepended `if` |
| `mqt`/`hqt`/`oTo` dangerous-prefix path | `:416162`/`:416208`/`:416257` | present (as `Ijt`/`kjt`/`zuo`) | carryover |
| `Io`/`Ss` tool names | `:146006`/`:229433` | present | carryover |
| 4 suspension callers | `:597471`,`:597964`,`:598268`,`:598279` | present (consuming `WGe`) | carryover sites, new behavior |

The dangerous-prefix machinery (`mqt`/`hqt`/`oTo`, the `$rl` interpreter list at `:416116-416161`, the cache `Orl`) and all four call sites are **carryover** — only the schema field, the gate (`$Cr`/`sTo`), and the one prepended line in `r9e` are net-new.

---

## Cross-links

- Sibling 193 docs: [README.md](./README.md) (module overview + 4 settings sources), [denial_reasons_surfacing.md](./denial_reasons_surfacing.md) (what happens when the classifier *denies* a now-classified command — the reason is surfaced), [recent_denied_overlay.md](./recent_denied_overlay.md) (approving such a denial).
- The auto-mode classifier engine and decision pipeline are the broader context for "what the classifier does once a shell command reaches it."

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Auto-mode (home for `classifyAllShell`)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Permissions/Sandbox (home for `r9e`/`sTo`)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md)

Key functions in this document:

- `classifyAllShell` schema field (`cli_inner_pretty.js:55814`) — opt-in boolean on `autoMode.classifier`; describe string carries the trade-off.
- `isClassifyAllShellEnabled` (obf: `$Cr`, `:58758`) — OR across the four settings sources; strict `=== true`. (Note: `$Cr` was `isSubagent` in 183 — re-mangled.)
- `shouldSuspendAllShellAllowRules` (obf: `sTo`, `:416260`) — thin wrapper over `$Cr`.
- `isShellAllowRuleSuspended` (obf: `r9e`, `:416263`) — suspend predicate; the one prepended bypass line at `:416264`. 183 predecessor `WGe` (**(183)** `:409907`).
- `isDangerousBashAllowRule` (obf: `mqt`, `:416162`) / `isDangerousPowerShellAllowRule` (obf: `hqt`, `:416208`) / `resolvesToAgentTool` (obf: `oTo`, `:416257`) — the carryover dangerous-prefix path.
- `shellRuleSuspendCache` (obf: `Orl`) — per-rule memo of the dangerous-prefix verdict; the bypass deliberately precedes it.
- `SETTINGS_SOURCES` (obf: `Uys`, `:58827`) — `["userSettings","localSettings","flagSettings","policySettings"]`.
- `BASH` (obf: `Io`, `:146006`) / `POWERSHELL` (obf: `Ss`, `:229433`) — tool-name constants.
- `buildAutoModeAllowLayers` (obf: `NEe`, `:597462`) / `isAutoMode` (obf: `dQl`, `:597459`) — auto-mode allow-layer pipeline; caller (a).
- suspended-rule display collector (obf: `yjo`, `:598268`) — caller (c).
