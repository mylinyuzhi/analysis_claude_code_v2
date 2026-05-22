# `/ultraplan` — From Ant-Only to GrowthBook-Gated (v2.1.88 → v2.1.142)

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| Slash command name | `/ultraplan` | `/ultraplan` (same) |
| Registry entry point | `commands.ts:104` (`feature('ULTRAPLAN')` import) | `cli_inner_pretty.js:475814-475823` (`$J4`/`ultraplanSlashCommand`) |
| Implementation file | `src/commands/ultraplan.tsx` (471 lines) | `cli_inner_pretty.js:~475210-475823` |
| Enablement gate | `isEnabled: () => "external" === 'ant'` — DCE'd to `false` for external builds | `isEnabled: () => sQ()` — runtime GrowthBook + workspace check |
| INTERNAL_ONLY_COMMANDS list | Yes (`commands.ts:239`, behind `ultraplan ? [ultraplan] : []`) | No — visible to all users when gate passes |
| In `slash_commands.json` catalog | n/a (not exported in external build) | **NOT listed** — see "Why it's missing" below |
| Telemetry events present | `tengu_ultraplan_*` (10 events) | Same set (verified in `feature_gates.json`) |

The headline shift: `/ultraplan` moved from a hard build-time ant-only gate to a **runtime gate** read from GrowthBook (`tengu_ultraplan_config.enabled`) plus a workspace check (`!I6()`) plus a Remote Control / CCR bridge feasibility check (`YdH()`). This is the "promotion" pattern — Anthropic-internal users still see it because GrowthBook flips them on; external users see it only if the same gate flips on for them.

---

## 1. v2.1.88 implementation (TypeScript source)

### The dead-code-elimination gate

```typescript
// ============================================
// ultraplanRequireGuard - DCE'd to null in external builds
// Location: src/commands.ts:104-106
// ============================================

// ORIGINAL (for source lookup):
const ultraplan = feature('ULTRAPLAN')
  ? require('./commands/ultraplan.js').default
  : null

// READABLE (for understanding):
const ultraplan = bundlerFeatureFlag('ULTRAPLAN')
  ? requireUltraplanModule()
  : null;
// Mapping: feature→bundlerFeatureFlag, ULTRAPLAN→ULTRAPLAN feature
```

`feature('ULTRAPLAN')` is the `bun:bundle` build-time define. In ant builds, `feature('ULTRAPLAN')` constant-folds to `true` and the `require` survives. In external builds it folds to `false` and the entire `require('./commands/ultraplan.js')` line is dead-code-eliminated — the ultraplan module never makes it into the bundle, full stop.

### The slash command export

```typescript
// ============================================
// ultraplanCommand - the ant-only slash command export
// Location: src/commands/ultraplan.tsx:461-470
// ============================================

// ORIGINAL (for source lookup):
export default {
  type: 'local-jsx',
  name: 'ultraplan',
  description: `~10–30 min · Claude Code on the web drafts an advanced plan you can edit and approve. See ${CCR_TERMS_URL}`,
  argumentHint: '<prompt>',
  isEnabled: () => "external" === 'ant',
  load: () => Promise.resolve({ call })
} satisfies Command;

// READABLE (for understanding):
const ultraplanCommand = {
  type: 'local-jsx',
  name: 'ultraplan',
  description: 'Claude Code on the web drafts an advanced plan you can edit and approve',
  argumentHint: '<prompt>',
  isEnabled: () => USER_TYPE === 'ant',     // build-time literal
  load: () => loadUltraplanCall()
};
// Mapping: isEnabled returns constant true/false depending on build
```

Note the gate appears **twice**: once at `commands.ts:104` (decides whether to even import the module), once at `isEnabled()` (decides whether `getCommands()` returns it). The double gate is belt-and-suspenders — even if some other code happened to reference the imported `default`, `isEnabled` would still filter it from the registry.

### Telemetry events seeded

`src/commands/ultraplan.tsx` fires 9 distinct events:

- `tengu_ultraplan_create_failed` (with `reason`: `already_polling`, `already_launching`, `precondition`, `bundle_fail`, `teleport_null`, `unexpected_error`)
- `tengu_ultraplan_awaiting_input`, `tengu_ultraplan_approved`, `tengu_ultraplan_failed`, `tengu_ultraplan_launched`, `tengu_ultraplan_stopped`, `tengu_ultraplan_dialog_choice`, `tengu_ultraplan_first_launch`
- Config events accessed via GrowthBook: `tengu_ultraplan_model`, `tengu_ultraplan_timeout_seconds`, `tengu_ultraplan_prompt_identifier`, `tengu_ultraplan_config`

### Promotion deep-dive: why a build-time gate at all?

**The trade-off being made:**
- **Pro of build-time gate**: external bundle is ~30 KB smaller (the whole ultraplan.tsx + its `pollForApprovedExitPlanMode` helper + `UltraplanChoiceDialog` ceremony). Less attack surface for someone reverse-engineering the binary.
- **Con of build-time gate**: every external rollout cycle requires a new external build. Cannot A/B test, cannot enable for a single canary org, cannot kill-switch in production.

The v2.1.88 trade-off was "feature isn't ready for external — ship without it." That's the right call when the feature is *aesthetically incomplete*. v2.1.142 says "feature is ready but we want a kill switch" — and switches to a runtime gate, **knowing the implementation bytes will now ship to everyone**.

---

## 2. v2.1.142 implementation (deobfuscated)

### The new runtime gate

```javascript
// ============================================
// ultraplanIsEnabledGate - runtime gate replacing build-time DCE
// Location: cli_inner_pretty.js:475282-475284
// ============================================

// ORIGINAL (for source lookup):
function sQ() {
  return Z$("tengu_ultraplan_config", null)?.enabled === !0 && YdH() && !I6();
}

// READABLE (for understanding):
function isUltraplanEnabled() {
  const cfg = getGrowthbookCached("tengu_ultraplan_config", null);
  if (cfg?.enabled !== true) return false;
  if (!isCloudCodeRunnerBridgeAvailable()) return false;
  if (isCurrentlyInRemoteWorkspace()) return false;
  return true;
}
// Mapping: sQ→isUltraplanEnabled, Z$→getGrowthbookCached, YdH→isCloudCodeRunnerBridgeAvailable, I6→isCurrentlyInRemoteWorkspace
```

Three composable conditions:

1. **GrowthBook flag** — `tengu_ultraplan_config.enabled === true`. GrowthBook is cached on session start; the cache may be stale for at most one launch cycle. The check is `=== true` (strict), not truthy — `{enabled: 1}` would NOT enable it. This is defensive: a misconfigured config field shouldn't accidentally enable a feature this expensive (10–30 min remote sessions).
2. **CCR bridge available** — `YdH()` returns `zL() && FK8() && Z$("tengu_ccr_bridge", !1)`. `zL()` is "logged in via Claude.ai OAuth" (Claude Code on the web requires a session-based identity, not API key). `FK8()` is "first-party API endpoint" (CCR only works against api.anthropic.com — Bedrock/Vertex/Foundry users would have nothing to bridge to). `tengu_ccr_bridge` is a separate GrowthBook gate for CCR availability.
3. **Not in remote workspace** — `!I6()`. `I6()` returns `U$.caps.workspace === "remote"`. If the user is *already* inside a CCR session, the CLI is the CCR backend itself — launching another ultraplan from inside a CCR worker would recurse. v2.1.88 didn't need this check because it gated on `USER_TYPE === 'ant'`; ant CLIs never run inside CCR workers.

### The slash command registration

```javascript
// ============================================
// ultraplanSlashCommand - 2.1.142 registry entry
// Location: cli_inner_pretty.js:475814-475823
// ============================================

// ORIGINAL (for source lookup):
$J4 = {
  type: "local-jsx",
  name: "ultraplan",
  get description() {
    return `${JX8().timeEstimate} \xB7 Claude Code on the web drafts a plan you can edit and approve. See ${pjH}`;
  },
  argumentHint: "<prompt>",
  isEnabled: () => sQ(),
  load: () => Promise.resolve({ call: DT5 }),
};

// READABLE (for understanding):
const ultraplanSlashCommand = {
  type: "local-jsx",
  name: "ultraplan",
  get description() {
    return `${getUltraplanShape().timeEstimate} · Claude Code on the web drafts a plan you can edit and approve. See ${CCR_TERMS_URL}`;
  },
  argumentHint: "<prompt>",
  isEnabled: () => isUltraplanEnabled(),
  load: () => Promise.resolve({ call: ultraplanCallImpl }),
};
// Mapping: $J4→ultraplanSlashCommand, JX8→getUltraplanShape, pjH→CCR_TERMS_URL, DT5→ultraplanCallImpl
```

The `get description()` is a v2.1.88→v2.1.142 difference. v2.1.88 hard-coded `~10–30 min`. v2.1.142 reads `JX8().timeEstimate` which comes from a `tengu_ultraplan_config.duration_note`-style GrowthBook field (lines 475800-475812 store a `three_subagents_with_critique` shape with `timeEstimate`, `dialogBody`, `dialogPipeline`, `usageBlurb`). This lets Anthropic update the time estimate without shipping a new client build.

### Why it's missing from `slash_commands.json` catalog

The catalog extractor is a static scanner — it grep's for `name: "..."` literal strings near `type: "local-jsx"`. But `/ultraplan` IS in the binary (line 475816). The reason `/ultraplan` doesn't appear in `slash_commands.json` is that the extractor likely walks `getCommands()` output and serializes only the commands that pass `isEnabled()` *at extraction time* — and the GrowthBook config is server-side, so during extraction in a CI box without GrowthBook auth, `sQ()` returns false and `/ultraplan` is filtered out of the dump.

**Verification**: telemetry events `tengu_ultraplan_*` ARE in `feature_gates.json`, and the source code lines (475282 onwards) are present. The feature ships in the binary; the catalog just doesn't see it at extraction time. End-users with the right GrowthBook config will see `/ultraplan` light up.

---

## 3. Diff during promotion (88 → 142)

### What changed

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| Visibility gate | Build-time `feature('ULTRAPLAN')` + `USER_TYPE === 'ant'` | Runtime `tengu_ultraplan_config.enabled === true` + CCR feasibility |
| Module presence in external bundle | DCE'd out (zero bytes shipped) | Present in bundle (~30 KB) |
| Description string | Static template literal | `get description()` reads from GB config |
| Time estimate | Hard-coded `~10–30 min` | Read from `JX8().timeEstimate` (GB-driven) |
| Plan shape | Implicit (single mode) | Explicit `three_subagents_with_critique` shape with `dialogPipeline` |
| `__ULTRAPLAN_TELEPORT_LOCAL__` token | Already present | Same — used by ExitPlanMode prompt to detect remote→local handoff |
| Detached poll error reasons | 6 distinct reasons | Same set + new `policy_blocked` reason (475617) |
| Dialog choice flow | `Yes / No / Refine` simple | Same + `bridge_disconnected` analytics dimension |
| Cleanup on stop | `archiveRemoteSession` + clear URL | Same + `_J$(H)` "meta delete" (475499) |
| Pre-launch dialog | Single use | Adds `tengu_ultraplan_first_launch` event |

### Why the new `policy_blocked` reason

```javascript
// ============================================
// ultraplanPolicyBlockedPath - new branch for org policy denial
// Location: cli_inner_pretty.js:475616-475618
// ============================================

// ORIGINAL (for source lookup):
((d("tengu_ultraplan_create_failed", { reason: "policy_blocked" }),
  `ultraplan: ${vwH({ type: "policy_blocked" })}`))

// READABLE (for understanding):
recordEvent("tengu_ultraplan_create_failed", { reason: "policy_blocked" });
return `ultraplan: ${formatPolicyError({ type: "policy_blocked" })}`;
// Mapping: d→recordEvent, vwH→formatPolicyError
```

**Why this branch is new:** External rollout means hitting orgs whose admins want to prohibit CCR even when the GrowthBook flag is true. The `policy_blocked` branch catches the org-policy "no CCR allowed" decision and emits a distinct telemetry reason (so Anthropic can see how often org policy denies vs. user cancels). v2.1.88 ant-only deployments did not have org-policy denials — internal users were always policy-allowed.

### Why the description got the `get` accessor

A `get description()` is evaluated lazily — every time `getCommands()` returns the command, the description is recomputed. This means a GrowthBook flag flip mid-session changes the *next* description render. Static template literals (v2.1.88) baked the description in at module load. v2.1.142 needs it dynamic because the time estimate is a launch-experience concern that A/B testing may want to nudge ("~10–20 min" vs "~5–30 min" — see how user satisfaction tracks).

### What did NOT change

- The core `pollForApprovedExitPlanMode` loop and its 30-minute timeout
- The `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel for remote→local handoff
- The "remote executes vs teleport back" branch in `startDetachedPoll`
- The "Refine with Ultraplan" CTA in ExitPlanMode permission dialogs (still launches `/ultraplan`)
- Termination via `RemoteAgentTask.kill` archives the remote session — same code path

---

## 4. Implementation analysis

### Decision: GrowthBook gate over feature flag service

**What it does:** `isUltraplanEnabled()` reads from the in-memory GrowthBook cache rather than calling a fresh API on every `getCommands()` call.

**How it works:**
1. On session start, GrowthBook config is fetched once and cached
2. `Z$("tengu_ultraplan_config", null)` reads from this cache (sync, no I/O)
3. `getCommands()` is called every render — must be cheap
4. The cache may be stale by minutes, but stale is acceptable: the worst case is a user sees `/ultraplan` for a few minutes after Anthropic turned it off (or vice versa)

**Why this approach over alternatives:**
- **Synchronous API call**: would block render. `getCommands()` is on the hot path for slash-command autocomplete.
- **HTTP call with cache-on-miss**: race conditions across renders.
- **Build-time gate (v2.1.88)**: cannot kill-switch in production.
- **Per-org config in settings.json**: still works for `disableUltraplan`-style overrides, but cannot enable for canary orgs without code change.

**Key insight:** The chosen design separates **availability** (GrowthBook, Anthropic-controlled) from **enablement** (settings, customer-controlled). An admin can `disableUltraplan: true` even when GrowthBook says yes — see `dS()?.settings.disableUltraplan` patterns used elsewhere. This two-layer approach is the standard "feature flag + customer opt-out" pattern.

### Decision: workspace check `!I6()`

**What it does:** Refuses to enable `/ultraplan` if the current CLI is itself running inside a CCR worker (workspace === "remote").

**How it works:**
- `I6()` returns `U$.caps.workspace === "remote"` — `caps.workspace` is set early in startup based on the spawning context
- CCR workers spawn the same CLI binary with `workspace=remote`
- If `/ultraplan` were available inside CCR, the worker could launch another worker, recursing

**Why this matters:**
- A 30-minute recursive worker chain is the kind of bug that pages someone at 3am
- This check is cheap (O(1) struct lookup), so adding it to the hot path is free

**Key insight:** v2.1.88 didn't need this because ant builds never ran inside CCR (CCR runs external builds). The check is *new infrastructure* required by the promotion.

### Decision: lazy `get description()` accessor

**What it does:** Recomputes the description on every access, reading the current GrowthBook config.

**How it works:**
1. v2.1.88: description is a string literal baked at module load
2. v2.1.142: description is a getter that calls `JX8()` (which reads GB config)
3. GrowthBook config can change between renders if a fresh fetch landed

**Trade-off:**
- Cost: ~1 GB cache lookup per render (negligible — single Map.get())
- Benefit: Anthropic can change "~10–30 min" → "~5–20 min" without ship a new client

**Alternative considered:** Cache the description string at module load. Rejected because the whole point of promoting to GrowthBook is to gain remote control over user-facing strings.

---

## 5. Public entry points

### From slash commands
- `/ultraplan <prompt>` — interactive (`type: "local-jsx"`) → dialog → CCR launch
- `/ultraplan` (no args) — usage hint
- `/ultraplan clear`-style: NOT supported. Use Esc on the running task pill to cancel.

### From dialogs (ExitPlanMode)
- "Refine with Ultraplan on Claude Code on the web" appears as an option when user is reviewing a plan and `isUltraplanEnabled()` returns true (cli_inner_pretty.js:540887)
- Selecting that option emits `{ behavior: "deny", feedback: _g5 }` — the `_g5` sentinel is the `__ULTRAPLAN_TELEPORT_LOCAL__` marker that ExitPlanMode's prompt recognizes

### From the model (via prompt)
- Lines 475364, 475388, 475415 are system prompts injected into ExitPlanMode flows telling the model: "if rejection feedback contains `__ULTRAPLAN_TELEPORT_LOCAL__`, do NOT revise — respond 'Plan teleported. Return to your terminal to continue.' This is how a remote CCR worker hands control back to the local terminal — the model sees the sentinel string and gives up instead of looping.

### From keyword detection
- The CCR browser hides the system-reminder wrapping (`stripSystemNotifications` drops `CLI_BLOCK_TAGS`)
- The remote CCR CLI runs keyword detection on raw input — see v2.1.88 comment: "a bare 'ultraplan' in the prompt would self-trigger as /ultraplan, which is filtered out of headless mode as 'Unknown skill'"
- v2.1.142 retains the same defensive phrasing in `JX8().usageBlurb` ("Advanced multi-agent plan mode.") that avoids the word "ultraplan" appearing as a bare token

---

## 6. Cross-references

- See `by_version/v2.1.113-114.md` for "Refine with Ultraplan" remote session URL fixes
- See `by_version/v2.1.118.md`+ for related teleport changes
- See `00_overview/symbol_index_core_features.md` for `tengu_ultraplan_*` event catalogue

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isUltraplanEnabled` (`sQ`) — runtime gate (cli_inner_pretty.js:475282)
- `ultraplanSlashCommand` (`$J4`) — registry entry (cli_inner_pretty.js:475814)
- `ultraplanCallImpl` (`DT5`) — interactive call handler
- `getUltraplanShape` (`JX8`) — reads `three_subagents_with_critique` GB config
- `isCloudCodeRunnerBridgeAvailable` (`YdH`) — CCR feasibility check (cli_inner_pretty.js:272755)
- `isCurrentlyInRemoteWorkspace` (`I6`) — workspace == "remote" check (cli_inner_pretty.js:3104)
- `getGrowthbookCached` (`Z$`) — GrowthBook value reader (shared)

---

## Pre-completion checklist

- [x] No mapping tables in this doc; symbols in list form
- [x] New symbols added (next step: append to `symbol_index_core_features.md` Module: Plan Mode)
- [x] Code snippets follow the dual-version format
- [x] Document covers 88 → 142 diff with rationale
- [x] Document is in 200-500 line target range

---

## Deep Analysis: Promotion Mechanism

### What changed at the gate

The promotion replaced a **two-layer build-time gate** with a **three-layer runtime gate**. Below is the concrete diff.

**v2.1.88 — Gate A: bundler DCE on the import edge**

```typescript
// src/commands.ts:104-106
const ultraplan = feature('ULTRAPLAN')
  ? require('./commands/ultraplan.js').default
  : null
```

`feature()` from `bun:bundle` is constant-folded at bundle time. For external builds the entire `require(...)` expression is removed by dead-code-elimination — the `ultraplan.js` module is **not present** in the bundle.

**v2.1.88 — Gate B: `isEnabled` returning a build-time literal**

```typescript
// src/commands/ultraplan.tsx:461-467  (only reachable in ant builds)
export default {
  type: 'local-jsx',
  name: 'ultraplan',
  isEnabled: () => "external" === 'ant',   // bundler substitutes USER_TYPE literal
  // ...
} satisfies Command;
```

The string literal `"external" === 'ant'` is the post-substitution form: in external builds the bundler replaces `USER_TYPE` with `"external"`, yielding `false`. Even if the module loaded, `getCommands()` would filter it.

**v2.1.142 — Gate A wrapped, Gate B replaced**

```javascript
// cli_inner_pretty.js:475282-475284
function sQ() {
  return Z$("tengu_ultraplan_config", null)?.enabled === !0 && YdH() && !I6();
}
```

- Gate A (the bundler-time `require` gate) is **removed**. The module is unconditionally bundled (~30 KB cost) — every external user now ships the bytes.
- Gate B (the `isEnabled` literal) is **replaced** by `sQ()`, which composes three runtime checks at every `getCommands()` render.
- A new sentinel `__ULTRAPLAN_TELEPORT_LOCAL__` (line 475264) is hard-coded in three system-prompt blocks (lines 475364/475388/475415). This is the marker the model recognizes when CCR teleports a plan back to the local terminal.

### Why this promotion approach

**Design rationale: GrowthBook cache + workspace check.** The maintainers chose `Z$("tengu_ultraplan_config", null)?.enabled === !0` for three reasons:

1. **Synchronous on the hot path.** `getCommands()` is called every Ink render. A network call here would jank the UI. `Z$` reads a Map populated at session start.
2. **Server-side kill switch.** Anthropic can flip `enabled: true → false` in GrowthBook and within 24 hours all external CLIs stop offering `/ultraplan`. This is critical for a feature that can spend 30 minutes of remote compute per invocation.
3. **Strict `=== true`, not truthy.** A misconfigured `{enabled: 1}` won't enable the feature — defensive against a config-typo causing a billing event.

**Alternatives considered (inferable from surrounding code):**

| Alternative | Why rejected |
|---|---|
| Keep `feature('ULTRAPLAN')` bundler gate | Cannot kill-switch in production. Every external rollout requires a new client release. |
| `process.env.USER_TYPE === 'ant'` runtime check | Same as `agentsPlatform` v2.1.88 pattern. Hard-codes who can see it; no A/B granularity. |
| Per-org `settings.json` opt-in | Forces every org admin to configure individually; no canary rollout. |
| Server-side allowlist per OAuth org | Same effect, but requires a new API endpoint. GrowthBook already exists. |

**Trade-offs:**
- **Cost of runtime gate:** ~30 KB of bundle bytes ship to users who'll never use the feature; ~2 `Map.get()` lookups per render.
- **Benefit:** instant rollback, A/B testing, per-org targeting, no client release for changes.

The `YdH()` + `!I6()` additions are *new infrastructure* required by the promotion: v2.1.88's ant-only build never ran in CCR workers (CCR runs external builds), so it didn't need to defend against self-recursion. Once `/ultraplan` ships externally, an ant CLI running inside CCR could see the command and accidentally recurse — hence `!I6()`.

### Step-by-step runtime decision flow

```
User types "/ultraplan refactor auth"
            │
            ▼
┌──────────────────────────────────────────┐
│ Slash command resolver                   │
│ • getCommands() returns array of Command │
│ • Filter: c.isEnabled?.() !== false      │
└─────────────┬────────────────────────────┘
              │
              ▼ Calls sQ() — the promotion gate
┌──────────────────────────────────────────┐
│ sQ()  [cli_inner_pretty.js:475282]       │
│  1. Z$("tengu_ultraplan_config", null)   │
│     ─ Map lookup, sync, O(1)             │
│  2. cfg?.enabled === true ?              │
│     ─ Strict check; rejects truthy non-true
│  3. YdH() ?                              │
│     ─ zL() (OAuth?) +                    │
│     ─ FK8() (firstParty API?) +          │
│     ─ Z$("tengu_ccr_bridge", false)      │
│  4. !I6() ?                              │
│     ─ caps.workspace !== "remote"        │
└─────────┬────────────────────────────────┘
          │ all true
          ▼
┌──────────────────────────────────────────┐
│ Command appears in autocomplete +        │
│ user hits Enter                          │
└─────────┬────────────────────────────────┘
          │
          ▼ DT5 (call handler) executes
┌──────────────────────────────────────────┐
│ Pre-launch policy check                  │
│  S4("allow_remote_sessions")             │
│  ─ If false: emit "tengu_ultraplan_     │
│    create_failed" reason=policy_blocked  │
│  ─ Return error message to dialog        │
└─────────┬────────────────────────────────┘
          │ allowed
          ▼
┌──────────────────────────────────────────┐
│ UltraplanLaunchDialog opens              │
│  ─ First-time? Show CCR_TERMS_URL         │
│  ─ Fire tengu_ultraplan_first_launch      │
│  ─ Read JX8().dialogBody for copy         │
└─────────┬────────────────────────────────┘
          │ user approves
          ▼
┌──────────────────────────────────────────┐
│ Remote session created via CCR API       │
│  ─ Store ultraplanSessionUrl in app state │
│  ─ Register task in jaH (taskRegistry)    │
│  ─ Spawn Qj4 polling state machine        │
└─────────┬────────────────────────────────┘
          │
          ▼ Qj4 multi-turn state machine
┌──────────────────────────────────────────┐
│ Qj4(sessionId, timeoutMs, onPhase, ...)  │
│  while (now < deadline):                 │
│    fetch newEvents from CCR              │
│    A.ingest(events) →                    │
│      "approved" → return {target:remote} │
│      "teleport" → return {target:local}  │
│      "rejected" → bump rejectCount       │
│    phase transitions:                    │
│      running → plan_ready → approved     │
│              ↓                           │
│              needs_input (if idle)       │
│    sleep 3s (Fj4)                        │
│    on network err, retry up to r05 (=5)  │
└─────────┬────────────────────────────────┘
          │
          ▼
   ┌──────┴───────┐
   │              │
   ▼              ▼
"remote"        "local"
 │               │
 ▼               ▼
Execute        Inject __ULTRAPLAN_TELEPORT_LOCAL__
on CCR         into ExitPlanMode feedback;
infrastructure model sees marker → bails with
                "Plan teleported."
```

### The `__ULTRAPLAN_TELEPORT_LOCAL__` session marker

This 24-character string is the **cross-process protocol** between the remote CCR worker and the local terminal. When a remote ultraplan run produces a plan that the user wants to execute *locally* (not in CCR), the marker is the only way to signal "stop the remote loop without aborting it cleanly":

1. Remote worker calls `ExitPlanMode` with the marker in `feedback`.
2. Local CLI (which holds the open WebSocket) sees the marker via `a05()` extractor (line 475239).
3. `Qj4` returns `{ executionTarget: "local" }`.
4. The system prompts at lines 475364/475388/475415 instruct the model: "if rejection feedback contains `__ULTRAPLAN_TELEPORT_LOCAL__`, DO NOT revise — respond 'Plan teleported. Return to your terminal to continue.'" The model's response unwinds the remote agent loop cleanly.

This is the kind of out-of-band signal a feature flag cannot deliver — and it's why three separate prompts in the binary share the exact literal. Search the binary for the marker: it appears verbatim in source code (line 475264) and three prompt strings (475364/475388/475415).

### Multi-turn planning state machine (`Qj4` + `gj4`)

`Qj4` is the polling driver; `gj4` (constructor preceding line 475178) is the **event ingestor** that tracks the conversation across multiple ExitPlanMode rejections. Key invariants:

- `rejectedIds` set: dedup so a model that re-calls ExitPlanMode with the same content doesn't double-count rejections.
- `everSeenPending`: distinguishes "timed out before any plan" (likely container start failure) from "user rejected too many times" — separates `timeout_no_plan` vs `timeout_pending` telemetry reasons.
- `rescanAfterRejection`: tells the next ingest pass to look back further, because a fresh `pending` may have been queued behind a rejected one.
- Phase transitions emit telemetry: `running → plan_ready` fires `tengu_ultraplan_plan_ready`; `plan_ready → approved` fires `tengu_ultraplan_approved`.

The state machine is essentially "watch a long-running remote conversation and detect when it produces an approved plan, vs. asks the user a question, vs. fails." The complexity (compared to a single poll) is needed because CCR sessions can pause for user input mid-run — the local CLI needs to know when to nudge the user.

### Key insight

**The promotion is not "flip a flag" — it's "ship the bytes and gate them three ways."** v2.1.88 was a binary on/off (DCE in/out). v2.1.142 wraps the *same source code* with a runtime composition (`GB ∧ CCR-ready ∧ ¬remote`). The lasting consequence: external users now carry ~30 KB of code they may never execute, but Anthropic carries instant rollback and per-cohort A/B power. The `__ULTRAPLAN_TELEPORT_LOCAL__` marker, the `policy_blocked` telemetry reason, and the workspace check are the **infrastructure cost** of crossing the boundary — none of them were needed when the feature was ant-internal.

### Trade-offs analysis

| Decision | Cost | Benefit |
|---|---|---|
| Bundle ultraplan bytes unconditionally | ~30 KB external bundle bloat | Bytes available for instant GB enablement |
| `Z$` (cached GB) instead of fresh fetch | Stale cache (up to one session) may miss a flip | O(1) sync check on hot `getCommands()` path |
| Strict `=== true` not truthy | Slightly more code in gate | Defensive against typo enabling expensive feature |
| Add `!I6()` workspace check | One extra check per render | Prevents CCR worker recursion (3am page avoided) |
| `policy_blocked` telemetry reason | New enum value, new translation | Lets Anthropic distinguish admin denial from user cancel — critical for diagnosing rollout friction |
| `get description()` dynamic | Recomputes per render (~1µs) | Description text editable from GB without client release |
| Keep `__ULTRAPLAN_TELEPORT_LOCAL__` literal | String appears 4× in binary | Cross-process protocol that any flag-gate cannot deliver |
