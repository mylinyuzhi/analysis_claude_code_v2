# Ant Feature Gate Mechanism — Deep Dive

> How Claude Code controls whether a feature ships to ant (Anthropic-internal) users vs external users — the four-layer system, Bun's DCE pass, the promotion algorithm, runtime decision flow, and security implications.

## Scope

This document examines the **gate mechanism itself**, not individual gated features. For the per-feature outcome tables see [`01_status_table.md`](01_status_table.md). For per-feature promotion deep-dives see the `10_promoted_*.md` family. For the still-internal residue see [`20_still_internal.md`](20_still_internal.md).

The four gate layers covered here are:

1. **Build-time `process.env.USER_TYPE === 'ant'`** — Bun static replacement.
2. **Runtime `getUserType()`** — hardcoded `"external"` in the public binary.
3. **Statsig / GrowthBook gates** — runtime A/B + cached-on-disk policy gates (`Z$()`, `S4()`).
4. **Build-flag `feature('NAME')`** — `bun:bundle` macro resolving at compile time.

---

## Section 1: The Four Gate Layers

### Layer 1 — Build-time `process.env.USER_TYPE === 'ant'`

**What it does:** Discriminates ant-internal builds from public builds at **compile time** so that ant-only imports, branches, and tools either disappear entirely from the public artifact or get re-emitted as constant `false`/`undefined`. The maintainers can keep all the ant code in one tree and one repo without leaking it externally.

**How it works:**

1. The 2.1.88 source author writes the gate inline next to the gated code, exactly as:

   ```typescript
   // src/tools.ts:16-19
   const REPLTool =
     process.env.USER_TYPE === 'ant'
       ? require('./tools/REPLTool/REPLTool.js').REPLTool
       : null
   ```

2. The build runs `bun build --compile`. Bun's bundler treats `process.env.USER_TYPE` as a *statically known* string at build time (provided via `--define process.env.USER_TYPE='"external"'` or similar). It substitutes the literal in-place:

   ```javascript
   const REPLTool =
     "external" === 'ant'
       ? require('./tools/REPLTool/REPLTool.js').REPLTool
       : null
   ```

3. Bun's constant-folder then evaluates `"external" === 'ant'` → `false`, and the dead-code-elimination (DCE) pass replaces the entire conditional with the unreachable side stripped. Depending on the form the gate takes, one of three things happens — see Section 2 for the case split.

4. The `require()` call inside the dead branch is **never executed** at parse time, so Bun's tree-shaker realises the imported file is dead and **never bundles** it. This is the property that makes top-level `require()` under the gate fundamentally different from inline conditionals: it removes whole modules from the binary, not just code paths.

**Why this approach:**

- **Single source of truth.** The maintainers want one repo, one git history, one build process. The alternative — branching the public release from an "ant" branch — would require constant merging and risk drift.
- **No runtime branching cost.** Because the substitution is at compile time, the public binary never even reads `process.env.USER_TYPE`. There's no startup CPU cost, no env-var-injection attack vector.
- **Compatible with Bun's `--compile` mode.** Bun's standalone binary mode embeds the JS bundle into a self-extracting executable; whatever gets bundled is what ships. There's no way to "decide at install time" whether to include ant features short of building two binaries — so the gate must run at *build* time.

**Trade-offs:**

- **Build complexity:** Requires two build profiles (one with `USER_TYPE=ant`, one without) and two binary artifacts. The CI pipeline must produce both. Confirmed in v2.1.142 by the fact that `rP8()` (Section 1.2) returns the literal `"external"` — proof that the public build profile was selected at compile time.
- **Debugging:** External engineers cannot reproduce ant-only bugs from source; they must rely on internal builds. The grep pattern `process.env.USER_TYPE === 'ant'` survives as **trivially observable** evidence of ant gating to anyone who reads the source repo.
- **String leakage:** While the *branch* is removed, string literals **used in** the branch can still appear in the binary if they're referenced from any reachable code path. Section 2.4 covers this: the literal `"REPL"` appears in `cli_inner_pretty.js:277255` even though `REPLTool` is dead-stripped.

**Key insight:** The pattern is not "check at runtime which kind of user you are" — it's "*don't even ship* code paths that aren't appropriate for this audience." The runtime can't lie about something it never knew. This is much stronger than e.g. a JWT-claim check: a determined attacker cannot grep the binary for ant-only logic, only for *traces* of where it used to be.

---

### Layer 2 — Runtime `getUserType()` (`rP8`)

**What it does:** Provides a **runtime** answer to "is this an ant user?" — used in code paths where the build-time gate couldn't be applied because the value is read after compilation (e.g. via dynamic dispatch, via a shared library, or in code that wasn't worth refactoring to use the build-time pattern).

**How it works:**

```javascript
// ============================================
// getUserType - Runtime user-type discriminator
// Location: cli_inner_pretty.js:514630-514632
// ============================================

// ORIGINAL (for source lookup):
function rP8() {
  return "external";
}

// READABLE (for understanding):
function getUserType() {
  return "external";  // hardcoded in public build
}

// Mapping: rP8→getUserType
```

In the public 2.1.142 binary the function body is literally `return "external";`. In the ant build it presumably returns `"ant"` (we have no ant binary to verify). Call sites then test `rP8() === "ant"`:

```javascript
// cli_inner_pretty.js:517098 (VNH = removeVirtualMessagesUnlessAnt)
function VNH(H, $ = H) {
  let q = H.filter(Xr);
  if (rP8() === "ant") return q;          // ant skips post-processing
  let K = $ instanceof Set ? $ : qW8($);
  return Qx5(q, K);                       // external strips virtual messages
}
```

Three uses of `rP8()` survive in the public binary:

- `cli_inner_pretty.js:515092` — `userType: rP8()` is shipped as part of a telemetry payload.
- `cli_inner_pretty.js:517051` — `H.type === "attachment" && rP8() !== "ant" && gx5.has(H.attachment.type)` filters attachment types for public users.
- `cli_inner_pretty.js:517098` — virtual-message post-processing differs by user type.

These three call sites are the residue of code paths where the maintainers chose **runtime** dispatch over compile-time gating. With `rP8()` constant-folded to `"external"`, every `rP8() === "ant"` reduces to `false` and the ant-only branch is unreachable.

**Why this approach (vs. inlining):**

- The maintainers wanted a *single* function they could grep for. Inlining `process.env.USER_TYPE === 'ant'` everywhere would make the binary harder to audit and the source harder to migrate (e.g. if they ever wanted to add a third user type like `"sdk"` they'd have to change every call site).
- Some call sites are inside **modules that don't have access to `process.env`** at build time — e.g. modules imported by both ant and public builds via the same `import` statement. A runtime function call works uniformly.
- The shipped function body in the public binary is a *constant*, so the V8/JSC inliner will collapse `rP8() === "ant"` to `false` at JIT time, eliminating any runtime cost beyond a function call setup. (Bun didn't fold it at build time because that would have required a function-inlining pass over the entire bundle — more aggressive than Bun's constant-folder normally goes.)

**Trade-offs:**

- **Slight runtime cost:** vs. inline `false`, three call sites each pay a function call. Negligible (<1µs per call).
- **Information leak:** The string `"external"` and `"ant"` survive in the binary, telegraphing the discriminator design to anyone reading the bytecode. Compare to Layer 1 where the branch is gone entirely.
- **JIT-tier optimisation:** V8 has to observe `rP8` returns a stable string before it inlines the call. In a cold start `rP8() === "ant"` performs a real string comparison.

**Key insight:** Layer 2 is the **fallback for code that escapes Layer 1**. The maintainers prefer Layer 1 (compile-time elimination) wherever possible, but Layer 2 catches cases where the compile-time replacement would have required deep refactoring. The fact that *only three* call sites survive in 2.1.142 suggests an active campaign to migrate to Layer 1 — most ant-gated logic has been removed entirely, not just neutralised.

---

### Layer 3 — Statsig / GrowthBook gates (`Z$()`, `S4()`)

**What it does:** Runtime-fetched, server-side-controlled boolean (or value) gates. Allows the maintainers to ship a feature to all binaries but enable it for a percentage of users, a cohort, a specific org, or via a remote kill-switch — **without redeploying the client**.

**How it works:**

The deobfuscated public-build implementation lives at `cli_inner_pretty.js:138741`:

```javascript
// ============================================
// getFeatureValue - GrowthBook gate value with override & cache layers
// Location: cli_inner_pretty.js:138741-138756
// ============================================

// ORIGINAL (for source lookup):
function Z$(H, $) {
  let q = V5$();
  if (q && H in q) return q[H];
  let K = v5$();
  if (K && H in K) return K[H];
  if (!Os()) return $;
  if (gYH.has(H)) ji$(H);
  else G5$.add(H);
  if (_F.has(H)) return _F.get(H);
  try {
    let _ = h$().cachedGrowthBookFeatures?.[H];
    return _ !== void 0 ? _ : $;
  } catch {
    return $;
  }
}

// READABLE (for understanding):
function getFeatureValue(gateName, defaultValue) {
  // 1. Env override (e.g. for eval harnesses)
  const envOverrides = getEnvOverrides();
  if (envOverrides && gateName in envOverrides) return envOverrides[gateName];

  // 2. Config-file override (CLAUDE_CODE_OVERRIDES)
  const configOverrides = getConfigOverrides();   // v5$ returns undefined in public; ant build wires it up
  if (configOverrides && gateName in configOverrides) return configOverrides[gateName];

  // 3. GrowthBook disabled? -> default
  if (!isGrowthBookEnabled()) return defaultValue;

  // 4. Log exposure for telemetry (deferred if SDK isn't initialized yet)
  if (experimentDataByFeature.has(gateName)) logExposureForFeature(gateName);
  else pendingExposures.add(gateName);

  // 5. In-memory cache for the current session
  if (inMemoryCache.has(gateName)) return inMemoryCache.get(gateName);

  // 6. Persistent on-disk cache (last fetched values)
  try {
    const cached = getGlobalConfig().cachedGrowthBookFeatures?.[gateName];
    return cached !== undefined ? cached : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Mapping: Z$→getFeatureValue, V5$→getEnvOverrides, v5$→getConfigOverrides, Os→isGrowthBookEnabled,
//          gYH→experimentDataByFeature, ji$→logExposureForFeature, G5$→pendingExposures,
//          _F→inMemoryCache, h$→getGlobalConfig
```

The companion `S4()` function (cli_inner_pretty.js:426865) is **different**: it gates against the **organisation policy** payload (compliance/restriction taints) downloaded from the Anthropic API, not against Statsig/GrowthBook:

```javascript
// ============================================
// checkOrgPolicy - Returns whether a feature is allowed by org policy
// Location: cli_inner_pretty.js:426865-426874
// ============================================

// ORIGINAL (for source lookup):
function S4(H) {
  let $ = JK4();
  if (!$) {
    if (ZY5.has(H) && (NB() || (f4() && !(H === "allow_product_feedback" && _ZH())))) return !1;
    return !0;
  }
  let q = $[H];
  if (!q) return !0;
  return q.allowed;
}

// READABLE (for understanding):
function checkOrgPolicy(policyName) {
  const restrictions = getPolicyRestrictions();
  if (!restrictions) {
    // No policy loaded yet (offline / not logged in).
    // Default-deny for sensitive policies on managed setups.
    if (POLICIES_DEFAULT_DENY.has(policyName)
        && (isManagedSetup() || (isFirstParty() && !(policyName === "allow_product_feedback" && isFeedbackAlwaysAllowed())))) {
      return false;
    }
    return true;  // Default-allow otherwise
  }
  const entry = restrictions[policyName];
  if (!entry) return true;
  return entry.allowed;
}

// Mapping: S4→checkOrgPolicy, JK4→getPolicyRestrictions, ZY5→POLICIES_DEFAULT_DENY,
//          NB→isManagedSetup, f4→isFirstParty, _ZH→isFeedbackAlwaysAllowed
```

So the gate vocabulary is:

- `Z$("gate_name", default)` — GrowthBook feature value (with Statsig as legacy fallback in `buildQueryConfig`); used for **product experiments** and **gradual rollouts**.
- `S4("policy_name")` — org-policy restriction check; used for **security gates** like `allow_remote_sessions` and `allow_product_feedback`. Default-deny semantics for sensitive policies if no payload is available.

The on-disk Statsig fallback (a list of cached gate IDs) is the survivor of an in-progress migration from Statsig → GrowthBook described in the 2.1.88 `growthbook.ts:794-836` comment ("MIGRATION ONLY: This function is for migrating existing Statsig gates to GrowthBook"). It's why `buildQueryConfig` still says `checkStatsigFeatureGate_CACHED_MAY_BE_STALE` in 2.1.88 — at 2.1.142 the same value is read via `Z$()` which checks GrowthBook first and falls back to the Statsig cache.

**Why this approach (vs. just env vars):**

- **Remote control without re-release.** An env var requires the user to set it; a Statsig gate can be flipped server-side and propagated to all installs within minutes. Critical for incident response (kill-switching a broken experiment).
- **Cohort/percentage targeting.** Statsig can enable a feature for 1% of users, for "user_id mod 100 < 5", for a specific org. Env vars can't.
- **Telemetry coupling.** Every `Z$()` call automatically records an "exposure" event (`logExposureForFeature`) — the maintainers get experiment metrics for free.
- **Offline fallback.** The cached value on disk means the gate works during network outages and on first launch (last-known-good wins).

**Trade-offs:**

- **Staleness.** The function name literally is `checkStatsigFeatureGate_CACHED_MAY_BE_STALE`. A user who just opened the app may be reading values from 24+ hours ago. The trade-off is intentional: the maintainers prefer a stale-but-fast gate to a synchronous network round-trip on every check.
- **Cache poisoning surface.** The on-disk cache (`cachedGrowthBookFeatures` in the global config JSON) is user-writable. A user can edit the file to flip gates. Section 6 (security review) returns to this.
- **Exposure-event privacy.** Every `Z$()` call ships an `exposure` telemetry event including the gate name. If the maintainers add an ant-only gate to the public binary, the gate *name* leaks via telemetry even if the value is always `false` externally.

**Key insight:** Layer 3 is the **only layer whose value can change post-deployment**. Layers 1, 2, and 4 are frozen at build time. This is why critical "may need to kill-switch in a hurry" features (e.g. `allow_remote_sessions` for teleport, `tengu_penguins_off` for fast mode) live in Layer 3. The maintainers reserve compile-time gating for things they're *certain* about; Statsig is for things they want to keep adjustable.

---

### Layer 4 — Build-flag `feature('NAME')` (`bun:bundle` macro)

**What it does:** Same goal as Layer 1 (compile-time elimination), but with **named feature flags** that are independent of `USER_TYPE`. Lets the maintainers ship separate binaries — e.g. an `ant` binary with KAIROS enabled, a `kairos-beta` binary with KAIROS enabled, and a `public` binary with all of them disabled — controlled by build profile, not user identity.

**How it works:**

The 2.1.88 source imports `feature` from `bun:bundle`:

```typescript
// src/tools.ts:104, src/commands.ts:59
import { feature } from 'bun:bundle'
```

`bun:bundle` is a Bun **virtual module** — the runtime has no such module; Bun's bundler intercepts the import at build time and replaces every `feature('FLAG_NAME')` call with the literal `true` or `false` according to the build profile. Mechanically equivalent to `process.env.USER_TYPE === 'ant'` for purposes of DCE, but **separates flag identity from user identity**: a flag like `KAIROS` doesn't imply ant-vs-public, it's just on or off for this build.

Usage patterns from 2.1.88:

```typescript
// src/commands.ts:73-75 (BRIDGE_MODE)
const bridge = feature('BRIDGE_MODE')
  ? require('./commands/bridge/index.js').default
  : null

// src/tools.ts:42-44 (KAIROS)
const SendUserFileTool = feature('KAIROS')
  ? require('./tools/SendUserFileTool/SendUserFileTool.js').SendUserFileTool
  : null

// src/query.ts:280 (TOKEN_BUDGET)
const budgetTracker = feature('TOKEN_BUDGET') ? createBudgetTracker() : null
```

After build with the public profile, `feature('KAIROS')` becomes literal `false`, and the same DCE pass that handled Layer 1 strips the branch and (if it's a top-level `require()`) the module.

The full list of `feature()` flag names visible in 2.1.88 source (commands.ts + tools.ts + setup.ts + query.ts + entrypoints/cli.tsx + utils/*):

`ABLATION_BASELINE`, `AGENT_TRIGGERS`, `AGENT_TRIGGERS_REMOTE`, `BG_SESSIONS`, `BREAK_CACHE_COMMAND`, `BRIDGE_MODE`, `BUDDY`, `BYOC_ENVIRONMENT_RUNNER`, `CACHED_MICROCOMPACT`, `CCR_REMOTE_SETUP`, `CHICAGO_MCP`, `COMMIT_ATTRIBUTION`, `CONTEXT_COLLAPSE`, `COORDINATOR_MODE`, `DAEMON`, `DUMP_SYSTEM_PROMPT`, `EXPERIMENTAL_SKILL_SEARCH`, `FORK_SUBAGENT`, `HISTORY_SNIP`, `KAIROS`, `KAIROS_BRIEF`, `KAIROS_CHANNELS`, `KAIROS_GITHUB_WEBHOOKS`, `KAIROS_PUSH_NOTIFICATION`, `LODESTONE`, `MCP_SKILLS`, `MONITOR_TOOL`, `OVERFLOW_TEST_TOOL`, `PROACTIVE`, `REACTIVE_COMPACT`, `SELF_HOSTED_RUNNER`, `TEAMMEM`, `TEMPLATES`, `TERMINAL_PANEL`, `TOKEN_BUDGET`, `TORCH`, `TRANSCRIPT_CLASSIFIER`, `UDS_INBOX`, `ULTRAPLAN`, `VOICE_MODE`, `WEB_BROWSER_TOOL`, `WORKFLOW_SCRIPTS`.

**Why this approach (vs. Layer 1 USER_TYPE):**

- **Multi-axis builds.** USER_TYPE is a single binary dimension (ant vs. external). KAIROS, BRIDGE_MODE, etc. are independent experimental dimensions — Anthropic might ship a "kairos beta" build to one cohort and a "bridge mode beta" to another, both still being `USER_TYPE=ant`.
- **Cleaner semantics in source.** `if (feature('BRIDGE_MODE'))` is self-documenting — clearer than `if (process.env.BRIDGE_MODE_ENABLED === 'true')`.
- **Compile-time guaranteed elimination.** Like Layer 1, the unused branch and its imports are gone — there is no runtime cost. Confirmed in 2.1.142: of the ~42 feature flags listed above, **none** of the flag names themselves appear in `cli_inner_pretty.js`. Bun stripped them.

**Trade-offs:**

- **Build-profile explosion.** N feature flags × M user types could mean 2^N × M binaries. The maintainers manage this by having a small number of named build profiles (e.g. `public`, `ant`, `ant-kairos`, `ant-bridge`) rather than per-flag combinatoric builds.
- **No runtime introspection.** Once built, the binary has no way to tell you "I was built with KAIROS=true" except via embedded version-string metadata. Compare to env-var gating where you can `printenv` to check.
- **Harder to A/B test.** Statsig gates can be flipped server-side; `feature()` gates cannot. So features that need rollback flexibility live in Layer 3, not Layer 4.

**Key insight:** Layer 4 is the **multi-dimensional cousin** of Layer 1. Where Layer 1 answers a binary yes/no question (is this ant?), Layer 4 answers a vector of independent yes/no questions (what experimental features does this build include?). The two layers are *mechanically identical* in Bun's bundler — both rely on constant-folding and DCE — but **semantically distinct**: USER_TYPE = audience, feature() = experiment cohort.

---

## Section 2: The Bun DCE (Dead Code Elimination) Pass

### How `bun build --compile` handles `if (false) { ... }`

After constant-substitution (Layer 1: `process.env.USER_TYPE` → `"external"`; Layer 4: `feature('X')` → `true`/`false`), Bun runs the following passes in order:

1. **Constant folding.** `"external" === 'ant'` → `false`. `true && X` → `X`. `false && X` → `false`. Pure JS, no side effects allowed in the folded subexpressions.
2. **Dead-branch elimination.** `if (false) { A } else { B }` → `B`. `false ? A : B` → `B`. Ternaries on the right side of `const x = false ? ... : null` collapse to `const x = null`.
3. **Reachability analysis.** Any `require('./path')` inside an eliminated branch is now unreachable. Bun marks the imported module as a candidate for tree-shaking.
4. **Tree-shaking.** Unreferenced modules and their transitive imports are removed from the bundle.

This is **not** Bun-specific — esbuild and Webpack do the same. What's Bun-specific is that **`--compile` mode** embeds the resulting JS as a self-contained native binary (via Bun's runtime), so whatever survived DCE *is* the artifact. There's no separate "production minify" step that could resurrect the dead code.

### The three concrete outcomes

The 2.1.88 source author chose how to write each gate, and that choice determines what survives. Three patterns, three outcomes:

#### Outcome A — Top-level conditional `require()` → module never bundled

```typescript
// 2.1.88 src/tools.ts:16-19 (REPLTool)
const REPLTool =
  process.env.USER_TYPE === 'ant'
    ? require('./tools/REPLTool/REPLTool.js').REPLTool
    : null
```

After DCE: `const REPLTool = null;`. The file `./tools/REPLTool/REPLTool.js` is **never bundled** into 2.1.142 — the only trace is the literal string `"REPL"` in unrelated streams (see Section 2.3).

This is the **strongest** form of gating: not even the *bytecode* of the gated tool ships externally. Anthropic's REPL tool, which presumably hooks into a privileged JS evaluator, is wholly absent from the public binary.

#### Outcome B — Inline conditional inside a function → branch eliminated, function stays

```typescript
// 2.1.88 src/utils/fork.ts (paraphrased — actual file uses feature('FORK_SUBAGENT'))
function getForkSubagentSource() {
  if (process.env.USER_TYPE === 'ant') return 'ant';
  if (process.env.CLAUDE_CODE_FORK_SUBAGENT) return 'env';
  // ...
}
```

After DCE the `if (process.env.USER_TYPE === 'ant')` branch is replaced. In 2.1.142 we observe:

```javascript
// cli_inner_pretty.js:211733-211740
function S$_() {
  if (i3H()) return "disabled";
  if (bH(process.env.CLAUDE_CODE_FORK_SUBAGENT)) return "env";
  if (T6()) return "disabled";
  if (bH(void 0)) return "ant";              // <-- THE FOSSIL
  if (Z$(h$_, !1)) return "gb_rollout";
  return "disabled";
}
```

Look at line 211737. The condition `bH(void 0)` is the residue. `bH` is the truthy-coercion helper (`parseBool`); `process.env.USER_TYPE === "ant"` was likely written as `bH(process.env.USER_TYPE === "ant")` in the source (or something Bun's optimizer reduced to `bH(void 0)` after seeing `"external" === "ant"` is `false`). Either way, `bH(void 0)` is always `false`, so the `return "ant"` line is unreachable — but it's still **bytecode in the binary**.

This is the **weakest** form: the gated value (`"ant"`) appears as a literal, the function shape is preserved, and a determined patcher could rewrite `void 0` to `true` and re-enable the branch. The cost in bytecode is ~30 bytes per occurrence.

#### Outcome C — Reflection-style import → resolves to dead-stub module

```typescript
// 2.1.88 src/commands/teleport/index.js  (PUBLIC STUB)
export default { isEnabled: () => false, isHidden: true, name: 'stub' };
```

In 2.1.88 the **filename** `src/commands/teleport/index.js` exists in the public source tree but the file body is just the stub above. The real implementation (the actual `/teleport` UI) lives in `src/commands/teleport/teleport.tsx` and is conditionally exported only in the ant build. The public build picks up the stub via the unconditional `import teleport from './commands/teleport/index.js'` at `commands.ts:46`.

Then `INTERNAL_ONLY_COMMANDS` (`commands.ts:225-254`) lists `teleport` along with the other internal-only commands, and the filter `process.env.USER_TYPE === 'ant' && !process.env.IS_DEMO ? INTERNAL_ONLY_COMMANDS : []` at line 343 drops the whole array in the public build.

In 2.1.142 we see *both* the stub module pattern (e.g. the four anonymous `{ isEnabled: () => !1, isHidden: !0, name: "stub" }` definitions at lines 492442-492453) and the actual ungated `teleport` command (line 480725 — promoted!). The stubs are residue from commands that *used to* be ant-only but whose stubs survived even though the command body did not.

This is **intermediate**: the stub is a tiny shell (`~80 bytes`), but it has a real `isEnabled` predicate (always returning `false`) and a real `name`. The slash-command registry includes it, the UI iterates it, but `getCommands()` filters it out via `isCommandEnabled(c)`. Tradeoff: simpler source-tree structure (no conditional imports) at the cost of carrying ~20 dead stub objects in the binary.

### What survives DCE despite the branch being gone

String literals used **only inside** a DCE-eliminated branch are gone. But strings used in **any reachable code path** survive. The classic example:

- `REPLTool` (the import) is gone (Outcome A).
- But the literal `"REPL"` appears at 4 places: `cli_inner_pretty.js:141589` (`m3 = "REPL"`), `cli_inner_pretty.js:277255` (`tool_name: "REPL"` in a streaming-tool-use synthesis path), `cli_inner_pretty.js:380541` (`return "REPL"` in a tool-name normaliser), and `cli_inner_pretty.js:566086` (REPL string in a status display).

These survive because some **other** reachable code references the constant `m3 = "REPL"` — e.g. the streaming executor compares a tool's `name` against `m3` to short-circuit display. The compiler can't tell that no actual `name: "REPL"` tool exists, so it keeps the comparison alive.

Same for `"teleport"`, `"ultraplan"`, `"kairos"` — strings appear in error messages, mode lists, telemetry events, sentinel tokens. See [`20_still_internal.md`](20_still_internal.md) for the per-feature inventory.

### Security implication of DCE

If a secret (e.g. an internal API endpoint, a private feature name, an unreleased model identifier) is **only** referenced inside an `if (USER_TYPE === 'ant') { ... }` block, DCE removes it — the secret never ships to external users. The public binary is genuinely *narrower* than the source.

But this only works **if the gate is purely compile-time** (Layer 1 or Layer 4). The instant you move the gate to runtime (Layer 2 or 3), the gated code paths and their string literals must ship — they have to *exist* at runtime in order to be conditionally enabled. So:

- Layer 1 / Layer 4: secrets in the gated branch never ship. **Safe.**
- Layer 2 (`rP8()`): the code paths are present; only the boolean flips. A reverse-engineer can read the gated bytecode and infer the ant-only behaviour. **Not safe for secrets.**
- Layer 3 (`Z$()` / `S4()`): same as Layer 2. The bytecode ships; only the runtime check varies.

This is why the maintainers prefer Layer 1 / Layer 4 for genuinely internal logic (e.g. `REPLTool`, `ConfigTool`, `TungstenTool` — all gone from the public binary) and Layer 3 only for *experiment cohort selection* (where the code path is already public, the gate just gates the enrolment).

---

## Section 3: The Promotion Algorithm — Source Patterns → Binary Patterns

When a feature is "promoted" from ant-only to public, the source author has four choices for the replacement gate. Each leaves a distinct signature in the 2.1.142 binary.

### Pattern A — Gate removed entirely (feature becomes unconditional)

**Source-side change:** Remove the `feature()` / `USER_TYPE === 'ant'` wrapper; promote the inner code to top-level.

**Concrete example — BriefTool:**

In 2.1.88 src/tools.ts there's no `BriefTool` gate at all — it's imported unconditionally at line 13:

```typescript
// src/tools.ts:13
import { BriefTool } from './tools/BriefTool/BriefTool.js'
```

…and used unconditionally at line 238:

```typescript
// src/tools.ts:238
BriefTool,  // unconditional in the all-tools list
```

By 2.1.142 `BriefTool` is present in the tools registry without any gate. (Older versions had `BriefTool` behind `feature('KAIROS') || feature('KAIROS_BRIEF')`; the gate was removed somewhere between 2.1.80-ish and 2.1.142.)

**Concrete example — commit, commit-push-pr, init-verifiers:**

These three were in `INTERNAL_ONLY_COMMANDS` in 2.1.88 (`commands.ts:225-254` lines 229, 230, 234). In 2.1.142:

- `name: "commit"` at `cli_inner_pretty.js:430640` — unconditional, type `"prompt"`.
- `name: "commit-push-pr"` at `cli_inner_pretty.js:431716` — unconditional.
- `name: "init-verifiers"` at `cli_inner_pretty.js:447630` — unconditional.

The maintainers literally moved these out of the gated array and into the always-built array. (Confirmed by the changelog showing v2.1.105 made `/commit` public.)

**Why this pattern:** When a feature has graduated from experiment to "we're confident it's good for everyone, no kill-switch needed", removing the gate entirely is the cleanest outcome. No bytecode overhead, no per-call check.

**Trade-off:** Once removed, you can't roll back without shipping a new binary.

---

### Pattern B — Gate replaced with a Statsig / org-policy gate

**Source-side change:** Replace `feature()` / `USER_TYPE === 'ant'` with `Z$("gate_name", default)` or `S4("policy_name")`.

**Concrete example — `/teleport`:**

In 2.1.88 `teleport` is in `INTERNAL_ONLY_COMMANDS[21]` (`commands.ts:246`). In 2.1.142 it's at `cli_inner_pretty.js:480725` with this `isEnabled`:

```javascript
// cli_inner_pretty.js:480728-480731
isEnabled: () => qq() && S4("allow_remote_sessions"),
get isHidden() {
  return !qq() || !S4("allow_remote_sessions");
}
```

The ant gate has been **upgraded to a two-clause org-policy gate**:

- `qq()` — user must have the `user:inference` OAuth scope (i.e. logged in via Anthropic OAuth, not a third-party provider). See `cli_inner_pretty.js:129851-129854`: `function qq() { if (!Cj()) return !1; return vU(xq()?.scopes); }`.
- `S4("allow_remote_sessions")` — org policy must not forbid remote sessions. This is the kill-switch: Anthropic IT can disable teleport for a whole org without shipping a binary.

**Concrete example — `/autofix-pr`:**

In 2.1.88 `INTERNAL_ONLY_COMMANDS[28]`. In 2.1.142 at `cli_inner_pretty.js:427564`:

```javascript
// cli_inner_pretty.js:427567
isEnabled: () => EK4() && !T6(),
```

…where `EK4()` is `() => qq() && S4("allow_remote_sessions")` (`cli_inner_pretty.js:427555`) and `T6()` is `() => !U$.isInteractive` (`cli_inner_pretty.js:2677`). So `/autofix-pr` is enabled when: user has `user:inference` scope **AND** org allows remote sessions **AND** we are in interactive mode.

**Why this pattern:** The maintainers want to ship the feature publicly but keep a kill-switch. Server-side policy can disable it per-org. The OAuth-scope check additionally restricts it to users authenticated via Anthropic (excluding e.g. third-party Bedrock users).

**Trade-off:** The gated bytecode must ship — anyone can read it. The actual *protection* is the OAuth scope check on the server side: even if a user patches `isEnabled` to return `true`, the remote-sessions API will reject calls without the `user:inference` scope.

---

### Pattern C — Gate replaced with an env-var

**Source-side change:** Replace `feature('FLAG')` with `process.env.CLAUDE_CODE_FLAG === 'true'` (or similar). Often paired with a Statsig gate as the rollout path.

**Concrete example — Fork Subagent:**

In 2.1.88 `commands.ts:113-117`:

```typescript
const forkCmd = feature('FORK_SUBAGENT')
  ? require('./commands/fork/index.js').default
  : null
```

In 2.1.142 the `/fork` command at `cli_inner_pretty.js:511655` has `isEnabled: W0`, and `W0` at line 211750 is:

```javascript
function W0() {
  return nlK() !== "disabled";
}
```

…where `nlK()` (line 211741) is `getForkSubagentSource()` — and `S$_` at line 211733 is its inner predicate:

```javascript
// cli_inner_pretty.js:211733-211740
function S$_() {
  if (i3H()) return "disabled";
  if (bH(process.env.CLAUDE_CODE_FORK_SUBAGENT)) return "env";   // <-- ENV VAR
  if (T6()) return "disabled";
  if (bH(void 0)) return "ant";                                   // <-- DEAD: was ant gate
  if (Z$(h$_, !1)) return "gb_rollout";                           // <-- GROWTHBOOK
  return "disabled";
}
```

This is a **layered promotion**: the maintainers replaced `feature('FORK_SUBAGENT')` (Layer 4) with a stack of three runtime gates — env var (highest priority), then ant check (now dead in public), then GrowthBook gradual rollout. The feature is *available* in the public binary but defaults to disabled; an external user can opt-in via `CLAUDE_CODE_FORK_SUBAGENT=1`, and Anthropic can gradually roll it out via GrowthBook.

**Concrete example — Perfetto tracing:**

`PERFETTO_TRACING` was a build-flag in 2.1.88 (inferred from the `antTrace` command pattern). In 2.1.142 it's an env-var: `process.env.CLAUDE_CODE_PERFETTO_TRACE` at `cli_inner_pretty.js:239968`.

**Why this pattern:** When the maintainers want the feature to be *opt-in only* — not enabled by default even for ant users. Env vars are unobtrusive (no UI), self-documenting in scripts, and survive across binary versions. Power users can wire them up in their shell rc, CI configs, etc.

**Trade-off:** Discoverability — users have to know the env-var name exists. (Mitigated by the catalog at `assets/env_vars.json` which lists all 992 recognised env vars.)

---

### Pattern D — Gate replaced with a public predicate function

**Source-side change:** Replace `feature()` / `USER_TYPE === 'ant'` with a domain-specific predicate (an OAuth-scope check, a config-file check, a model-provider check, etc.).

**Concrete example — `/fast`:**

In 2.1.88 `/fast` already had no ant gate (it was public from the start in the inspected source), but its `isEnabled` evolved. In 2.1.142 at `cli_inner_pretty.js:484231-484233`:

```javascript
get isHidden() {
  return !_9();
}
```

…where `_9()` (line 96854) is:

```javascript
function _9() {
  if (vq() !== "firstParty") return !1;
  return !bH(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}
```

So `/fast` is hidden unless the user is on Anthropic's first-party model (not Bedrock, Foundry, AWS) AND has not set `CLAUDE_CODE_DISABLE_FAST_MODE=1`. Combine with the `tengu_penguins_off` Statsig kill-switch (Layer 3) and the fast-mode availability is a four-clause predicate.

**Concrete example — `/teleport`'s `qq()` half:**

The `qq()` in `/teleport`'s `isEnabled` is a Pattern D predicate (OAuth scope check), composed with a Pattern B predicate (`S4("allow_remote_sessions")`). Patterns compose.

**Why this pattern:** When the gate is *conceptually* about a user property other than "are you ant?" — e.g. "are you on the first-party model?" or "do you have this OAuth scope?" — using a named predicate is clearer than overloading USER_TYPE. The maintainers can also reuse the predicate across many features.

**Trade-off:** Each predicate adds its own runtime call path. `/fast` has to read three env vars + the model-provider config on every typeahead refresh. (Mitigated by these being O(microseconds) checks.)

---

### Pattern selection: maintainer's decision tree

```
Is the feature ready for everyone, no kill-switch needed?
  YES -> Pattern A (gate removed)
  NO ->
    Do we want server-side rollback ability?
      YES ->
        Is the gate about security/compliance? -> Pattern B with S4() (org policy)
        Is the gate about A/B experiment?      -> Pattern B with Z$() (GrowthBook)
      NO ->
        Is the gate "power users opt-in only"?  -> Pattern C (env var)
        Is the gate about a domain property?    -> Pattern D (predicate function)
```

---

## Section 4: The Runtime Decision Tree

What happens at runtime when a user types a slash command. The flow is the same for each of `/teleport` (Pattern B), `/fork` (Pattern C), and `/fast` (Pattern D), with different leaf predicates.

### 4.1 General flow

```
User types "/teleport" + Enter
       |
       v
[Slash-command parser]
   Tokenise input -> { name: "teleport", args: [] }
       |
       v
[Command registry lookup]
   getCommands() returns memoized COMMANDS() array
   Find by name: "teleport" -> object SV5 (cli_inner_pretty.js:480723)
       |
       v
[Enabled check]
   isCommandEnabled(cmd) calls cmd.isEnabled()
       |
       v   (varies per command)
   /teleport:  qq() && S4("allow_remote_sessions")
   /fork:      W0()  -> nlK() !== "disabled" -> S$_() chain
   /fast:      _9()  (via isHidden inversion)
       |
       v
   true  -> proceed
   false -> "Unknown command" or "feature not available" error
       |
       v
[Loader]
   cmd.load() returns the implementation module (lazy import)
       |
       v
[Execution]
   For type:"local-jsx"  -> render the React component
   For type:"local"      -> call the action handler
   For type:"prompt"     -> inject the prompt text into the conversation
```

### 4.2 `/teleport` — Pattern B walk-through

```
User: /teleport abc-session-id

[1] Slash parser: name="teleport", args=["abc-session-id"]

[2] Registry: lookup teleport
    -> cmd = SV5 (cli_inner_pretty.js:480723)
    -> cmd.isEnabled is the arrow function

[3] cmd.isEnabled() runs:
    -> qq() && S4("allow_remote_sessions")

    [3a] qq() -> cli_inner_pretty.js:129851
         if (!Cj()) return false;                  # user logged in?
         return vU(xq()?.scopes);                  # has "user:inference" scope?

         Cj() reads in-memory OAuth state set during login.
         xq()?.scopes is the user's OAuth scope list.
         vU(scopes) checks for the specific scope constant.

         Result: true if logged into Anthropic with the right scope.

    [3b] S4("allow_remote_sessions") -> cli_inner_pretty.js:426865
         let restrictions = JK4();
         if (!restrictions) {
           // No policy loaded yet (offline / first launch / not logged in)
           if (ZY5.has("allow_remote_sessions") /* false - not in default-deny set */)
             ...                                    # this clause irrelevant
           return true;                             # default-allow
         }
         let entry = restrictions["allow_remote_sessions"];
         if (!entry) return true;                   # not mentioned in policy
         return entry.allowed;                      # explicit org decision

         Result: true unless the org has set allow_remote_sessions=false in
                 their managed policy.

[4] Both true -> isEnabled returns true.

[5] Command executes:
    -> cmd.load() lazy-imports pX4 (the teleport React component)
    -> render the UI -> POST to /v1/code/sessions/{id}/teleport-events
       (which has its own server-side qq()-style check)

If qq() is false: command is hidden from the typeahead AND isEnabled gates it.
If S4() is false: same hide+gate; if invoked anyway, the underlying API call
                  at cli_inner_pretty.js:334814 throws
                  "Remote sessions are disabled by your organization's policy."
```

### 4.3 `/fork` — Pattern C walk-through

```
User: /fork "investigate this perf bug in parallel"

[1] Slash parser: name="fork", args=["investigate this perf bug in parallel"]

[2] Registry: lookup fork
    -> cmd = Vb5 (cli_inner_pretty.js:511653)
    -> cmd.isEnabled = W0

[3] W0() runs:
    -> nlK() !== "disabled"

    [3a] nlK() -> cli_inner_pretty.js:211741
         if (IH8 !== null) return IH8;             # memoized after first call
         let source = S$_();
         if (source !== "disabled") {
           IH8 = source;
           d("tengu_fork_subagent_enabled", { source });   # telemetry
         }
         return source;

    [3b] S$_() -> cli_inner_pretty.js:211733
         if (i3H()) return "disabled";              # some pre-condition fails?
         if (bH(process.env.CLAUDE_CODE_FORK_SUBAGENT))
           return "env";                            # USER set the env var -> ON
         if (T6()) return "disabled";               # non-interactive mode -> OFF
         if (bH(void 0)) return "ant";              # DEAD (was ant gate)
         if (Z$("...", false)) return "gb_rollout"; # GrowthBook says enrolled
         return "disabled";                         # default off

[4] If S$_() returned anything other than "disabled":
    -> isEnabled = true
    -> command available
    -> emit telemetry "tengu_fork_subagent_enabled" with the source attribution

    If "disabled":
    -> command hidden from typeahead
    -> typing /fork yields "Unknown command"

[5] When enabled, /fork delegates to FORK_AGENT (line 211731) which spawns a
    background subagent inheriting the conversation.
```

The interesting design choice here: the source attribution is **telemetry-grade**. Anthropic can see in the analytics whether a user enabled `/fork` via env var (manual opt-in), via the still-dead ant gate (would be 0 externally), or via GrowthBook rollout — letting them measure adoption channels separately.

### 4.4 `/fast` — Pattern D walk-through

```
User: /fast on

[1] Slash parser: name="fast", args=["on"]

[2] Registry: lookup fast
    -> cmd = Ev5 (interactive variant) or KP4 (non-interactive variant)
    -> cmd.isHidden = () => !_9()

[3] _9() runs (cli_inner_pretty.js:96854):
    -> if (vq() !== "firstParty") return false;
       # vq() is the model-provider discriminator
       # cli_inner_pretty.js:90666 -> "bedrock" | "foundry" | "anthropic_aws" | "firstParty"
       # If user is on Bedrock/Foundry/etc, fast mode is unavailable.

    -> return !bH(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
       # If the env var is set truthy, hide /fast.
       # Otherwise the command is available.

[4] If _9() returns true:
    -> isHidden is false
    -> command shown in typeahead

[5] When invoked, the implementation (HP4 / Ev5.load) checks an *additional*
    Layer 3 gate: tengu_penguins_off (the GrowthBook kill-switch).
    If that gate is true, the picker shows "Fast mode is currently disabled."

[6] If neither kill-switch is active, the user can toggle fast mode for the
    session or persist the preference in settings.
```

The `/fast` flow shows **gate composition**: Layer 4 (the original `feature('PENGUIN')` from a much-older version) was removed and replaced with Layer 3 (`tengu_penguins_off`) + Layer 2 (`vq() === "firstParty"` — provider check) + env-var (Layer 3). The same feature can ride on multiple gate layers at once.

---

## Section 5: STILL-INTERNAL Features — Why `isEnabled: () => !1` Instead of Removal?

Some commands in 2.1.142 are explicitly stubbed with `isEnabled: () => !1` rather than being tree-shaken out. Why?

### 5.1 `bridge-kick` — preserved hook, dead handler

```javascript
// cli_inner_pretty.js:492234-492242
((EN5 = {
  type: "local",
  name: "bridge-kick",
  description: "Inject bridge failure states for manual recovery testing",
  isEnabled: () => !1,
  supportsNonInteractive: !1,
  load: () => Promise.resolve({ call: NN5 }),
}),
  (KZ4 = EN5));
```

**Why the maintainers chose `isEnabled: () => !1` instead of conditional `require()`:**

The source author imported `bridgeKick` unconditionally at `commands.ts:140` and then put it in the `INTERNAL_ONLY_COMMANDS` array. So when the public build runs, the import is real, the module is bundled — only the **filter** at `commands.ts:343-345` (`USER_TYPE === 'ant' && !IS_DEMO ? INTERNAL_ONLY_COMMANDS : []`) prevents it from reaching `getCommands()`. The DCE pass eliminated the *filter* but not the *module*, because the module is imported elsewhere or is referenced via a non-conditional `var`.

After DCE, what's left in the binary is the module body (`EN5 = {...}`) but no caller because the array containing it never goes through the filter to `getCommands()`. The `isEnabled: () => false` is the **module's own self-defence** — even if some buggy code path *did* find this command object, calling `isEnabled` would return false and the command would refuse to run.

**Practical cost in bytes:** The object literal `EN5` + the wrapper IIFE + the `call: NN5` handler reference is ~120 bytes of bytecode. The handler `NN5` itself (the actual bridge-kick implementation) is *also* bundled because `EN5.load.call` references it — that's another ~500 bytes or so. So choosing the stub pattern over conditional import costs **~600 bytes per command**. Cumulatively for the ~20 stub commands in the binary, ~12KB of dead code. Small price for source-tree simplicity.

### 5.2 `version` (interactive) — dual-stub with policy-aware hide

```javascript
// cli_inner_pretty.js:492418-492437
((SN5 = {
  type: "local-jsx",
  name: "version",
  description: "Print the version this session is running (not what autoupdate downloaded)",
  isEnabled: () => !1,                    // <-- always false
  immediate: !0,
  requires: { ink: !0 },
  load: () => Promise.resolve({ call: IN5 }),
}),
  (Fp6 = {
    type: "local",
    name: "version",
    description: "Print the version this session is running (not what autoupdate downloaded)",
    isEnabled: () => !1,                  // <-- always false
    get isHidden() {
      return !T6();                       // <-- but if T6() is true (non-interactive),
                                          //     don't even hide it (i.e. fully gone from
                                          //     listings; isEnabled keeps it disabled)
    },
    supportsNonInteractive: !0,
    load: () => Promise.resolve({ call: RN5 }),
  }),
  (gp6 = SN5));
```

The dual-variant pattern (`local-jsx` for interactive REPL and `local` for non-interactive CLI) is preserved entirely from the ant build. Both have `isEnabled: () => false` baked in. The `isHidden` getter on the `local` variant is the residue of an ant-build-time `isHidden: !isAntInternal()` style check — Bun replaced the call to `getUserType()` with whatever expression survived, but `T6()` here is actually `!isInteractive` (line 2677), suggesting the source uses something like `isHidden: () => isInteractive` for the non-interactive variant (which would be re-enabled if we ever called it in non-interactive mode). Either way, with `isEnabled: () => false`, the `isHidden` branch is moot.

**Can an external user re-enable it via monkey-patching?**

Theoretically yes, in three escalating ways:

1. **Patch the binary in-place.** Find the byte sequence corresponding to `isEnabled: () => !1` (in raw bytecode, `!1` is `OP_FALSE`) and flip to `!0`. Then `getCommands()` includes the command. **Works locally** but breaks code signing (macOS Gatekeeper, Windows Authenticode).
2. **Patch the global state at runtime.** Use Bun's `--inspect` to attach a debugger, find the object literal `SN5`, set `SN5.isEnabled = () => true`. Reload `getCommands()` (which is memoized — would also need to clear the memo cache). **Works but is fragile.**
3. **Run the handler directly.** The handler functions `IN5` and `RN5` are still in the binary and presumably accessible via their obfuscated names. A patched CLI script could just call `IN5()` directly. **Works** — and yields whatever version-printing logic Anthropic shipped, including any internal-only build metadata.

What the gate **does NOT** prevent: a determined developer reading the bytecode and understanding what the command does. The gate is **product UX**, not security.

### 5.3 Implication: STILL-INTERNAL is a *display* gate, not a *protection* gate

The maintainers don't put security-critical logic behind `isEnabled: () => !1`. Anything genuinely sensitive (e.g. API keys, internal endpoints, unreleased model identifiers) is either:

- Tree-shaken out via Layer 1 / Layer 4 top-level `require()`, OR
- Behind a server-side check (e.g. `qq()` requires a valid OAuth scope token signed by Anthropic's auth server).

`isEnabled: () => !1` is for **commands the maintainers haven't finished deciding what to do with**. It's a "this exists in the codebase but isn't ready to ship to anyone, including ant users — but we didn't want to delete it or conditional-import it because that adds friction to future re-enablement".

---

## Section 6: Implications for Security Review

### 6.1 What information leaks

The public 2.1.142 binary leaks the following information about the ant build:

1. **Statsig/GrowthBook gate names.** Every `Z$("gate_name", ...)` call carries the gate's literal name. Searching the binary for `Z$("` reveals every gate the public binary consults — a partial map of Anthropic's product experiments.

2. **`S4()` policy names.** Same as above: `S4("allow_remote_sessions")`, `S4("allow_product_feedback")` — org-policy taxonomy is grep-able.

3. **Stub command names.** The 17+ STILL-INTERNAL commands have their names in the binary even when their handlers are gone. Anyone can enumerate `grep -E "name: \"[a-z-]+\"" cli_inner_pretty.js` and cross-reference against `slash_commands.json` to find commands not listed (the difference is the still-internal set).

4. **Pattern B / D predicates.** Functions like `qq()`, `_9()`, `EK4()` are inspectable. Anyone can read what an OAuth scope check looks like and infer the structure of Anthropic's auth.

5. **Telemetry events.** `feature_gates.json` (assets bundle) lists all 1159 known telemetry-event names — a comprehensive map of what Anthropic instruments. This is intentional (the catalog is public for debugging) but reveals product priorities.

### 6.2 What doesn't leak (because DCE removes it)

1. **Layer 1 / Layer 4 module bodies.** `REPLTool`, `TungstenTool`, `ConfigTool`, `SuggestBackgroundPRTool`, `SnipTool`, `MonitorTool`, `CtxInspectTool`, `TerminalCaptureTool`, `WebBrowserTool`, `OverflowTestTool`, `SubscribePRTool`, `SendUserFileTool`, `PushNotificationTool`, KAIROS commands (`proactive`, `brief`, `assistant`), `bughunter`, `ctx_viz`, `goodClaude`, `issue`, `mockLimits`, `breakCache`, `antTrace`, `perfIssue`, `env`, `oauthRefresh`, `debugToolCall`, `agentsPlatform`, `backfillSessions` — none of their bodies ship.

2. **`ANT_ONLY_SAFE_ENV_VARS` set.** The full list (`KUBECONFIG`, `DOCKER_HOST`, `AWS_PROFILE`, `CLOUDSDK_CORE_PROJECT`, `COO_CLUSTER`, `COO_NAMESPACE`, `COO_LAUNCH_YAML_DRY_RUN`) is gone — verified by `grep -c` returning 0 for each. The cluster/cloud identifiers that hint at Anthropic's internal infrastructure (`COO_*`) are wholly absent from the public binary.

3. **`createDumpPromptsFetch` body.** The function shell is preserved at `cli_inner_pretty.js:247073` but its companion `$M_` (the actual dump function) is a no-op stub at line 247065. So a public user can call `createDumpPromptsFetch(...)` and it'll wrap their fetch, but nothing is dumped — the on-disk dump file format, the directory path conventions, the dump-rotation logic — all gone.

### 6.3 How a hostile party identifies ant-only features without source access

Pattern: **`isEnabled: () => !1` + suspicious name**.

A red-teamer can `grep -B 4 -A 2 "isEnabled: () => !1" cli_inner_pretty.js` and read off every command that the maintainers chose not to fully delete. This yields ~20 leads. Cross-referencing with `slash_commands.json` (which lists only ENABLED commands) gives the delta = candidates for ant-only commands.

Other tells:

- **Dual-stub pattern** (e.g. `{ isEnabled: () => !1, isHidden: !0, name: "stub" }`) marks commands that *used to* be ant-only but whose stubs survived even though the implementation didn't.
- **String literals with names** like `"ultraplan"`, `"REPL"`, `"teleport"`, `"bughunter"` appearing in error messages or mode lists but with no corresponding command registration in the public bundle — signals an ant-only feature whose name leaked.
- **`bH(void 0)` constructs** (cli_inner_pretty.js:211737 is the canonical example) — these are the fossils of `process.env.USER_TYPE === 'ant'` checks after Bun's static substitution. Wherever you see `if (bH(void 0)) return ...`, you've found a former ant branch.

The maintainers could close these leaks by:

- Removing `isEnabled: () => !1` stubs entirely (and accepting the source-tree friction).
- Renaming all `Z$()` gates to unguessable IDs (and accepting the debugging cost).
- Stripping the `feature_gates.json` catalog from public builds (and accepting that debug output becomes opaque).

They've chosen not to — the prevailing design philosophy is "minimal surface" rather than "no leaks". The strong guarantee is **no code paths from ant-only features ship**; the weaker guarantee is **names and shapes might still be observable**.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_index_core_execution.md`](../00_overview/symbol_index_core_execution.md) — Core execution
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Core features
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — Integrations

Key functions in this document:

- `getUserType` (`rP8`) — runtime user-type discriminator; returns hardcoded `"external"` in public binary. `cli_inner_pretty.js:514630`.
- `buildQueryConfig` (`uo7`) — produces `QueryConfig.gates` snapshot; `isAnt: !1` literal in public binary. `cli_inner_pretty.js:391940`.
- `createDumpPromptsFetch` (`T17`) — fetch wrapper that *would* dump prompts (body is no-op stub in public). `cli_inner_pretty.js:247073`.
- `getFeatureValue` (`Z$`) — GrowthBook gate value with env/config-override + on-disk cache fallback; legacy Statsig migration target. `cli_inner_pretty.js:138741`.
- `checkOrgPolicy` (`S4`) — org-policy restriction check (e.g. `allow_remote_sessions`); default-deny for sensitive policies. `cli_inner_pretty.js:426865`.
- `getForkSubagentSource` (`nlK` / inner `S$_`) — env/ant/GrowthBook precedence for the `/fork` enablement; canonical example of Pattern C promotion residue with dead ant branch. `cli_inner_pretty.js:211733-211746`.
- `isForkSubagentEnabled` (`W0`) — `isEnabled` callback for `/fork`; wraps `nlK()`. `cli_inner_pretty.js:211750`.
- `isFastModeAvailable` (`_9`) — Pattern D predicate gating `/fast` on first-party provider + env var. `cli_inner_pretty.js:96854`.
- `hasInferenceScope` (`qq`) — OAuth-scope-based ant-substitute used in Pattern B gates; underpins teleport and autofix-pr `isEnabled`. `cli_inner_pretty.js:129851`.
- `isNonInteractive` (`T6`) — interactive-mode predicate; previously misread as an ant-runtime probe in `20_still_internal.md` (the symbol's actual semantics are `!U$.isInteractive`). `cli_inner_pretty.js:2677`.
- `getProviderType` (`vq`) — discriminates `firstParty` vs `bedrock` vs `foundry` vs `anthropic_aws`. `cli_inner_pretty.js:90666`.
- `getPolicyRestrictions` (`JK4`) — fetches the org-policy restrictions map; returns null if no payload loaded. `cli_inner_pretty.js:426891`.
- `isManagedSetup` (`NB`) — predicate used by `checkOrgPolicy` for default-deny on sensitive policies. `cli_inner_pretty.js:426723`.
- `getEnvOverrides` (`V5$`) — env-var override map for gate values (eval harnesses). `cli_inner_pretty.js:138609`.
- `getConfigOverrides` (`v5$`) — config-file override map for gate values (always `undefined` in public build). `cli_inner_pretty.js:138622`.

## Cross-references

- For per-feature outcomes (PROMOTED / STILL-INTERNAL / REMOVED): [`01_status_table.md`](01_status_table.md), [`20_still_internal.md`](20_still_internal.md), [`30_removed.md`](30_removed.md).
- For deep-dives on individual promotions: `10_promoted_fast_mode.md` (Pattern D), `10_promoted_bridge_sessions.md` (Pattern B+OAuth), `10_promoted_agents_dashboard.md` (Pattern A composition), `10_promoted_undercover_mode.md`, `10_promoted_ultraplan.md`, `10_promoted_ultrareview.md`, `10_promoted_goal.md`.
- For Statsig/GrowthBook telemetry catalog: `assets/feature_gates.json` (1159 entries).
- For env-var catalog: `assets/env_vars.json` (992 entries).
- For Bun's `bun:bundle` macro semantics: see Bun docs `https://bun.sh/docs/bundler/macros` (external reference).
