# Bridge Sessions / `bridge-kick` — Promoted to `/remote-control`, `bridge-kick` Disabled (v2.1.88 → v2.1.142)

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| User-facing slash command | `/bridge` (`BRIDGE_MODE` feature flag) | `/remote-control` (with `/rc` alias) — replaces `/bridge` |
| Debug command | `/bridge-kick` (`isEnabled: () => process.env.USER_TYPE === 'ant'`) | `/bridge-kick` (preserved but `isEnabled: () => false`) |
| Bridge sessions concept | "Remote Control" sessions to phone/claude.ai/code | Same concept, rebranded to user-facing "Remote Control" |
| Bridge infrastructure | `src/bridge/`, `src/commands/bridge/`, `src/commands/bridge-kick.ts` | `cli_inner_pretty.js:~497960` (`/remote-control` command), `cli_inner_pretty.js:492232+` (`bridge-kick`), telemetry events kept as `tengu_bridge_*` |
| `bridgeKick` in INTERNAL_ONLY_COMMANDS | YES (commands.ts:237) | n/a (no public list, but `isEnabled: false` keeps it hidden) |
| Telemetry namespace | `tengu_bridge_*` (already public-named) | Same (preserved) |

### What is the bridge / Remote Control?

A connection between a local Claude Code CLI session and a remote control surface (claude.ai/code in a browser, or a phone). Lets the user drive their local session from outside the terminal:
- See the live transcript on phone
- Send prompts from claude.ai/code
- Approve/deny permission requests remotely

The internal codename was "bridge" (because it bridges the local CLI to a cloud control surface). The external user-facing name is "Remote Control."

### What is `/bridge-kick`?

A *debug* slash command (not user-facing) that injects synthetic bridge failures to exercise reconnection logic. Used by Anthropic engineers to test recovery paths without waiting for real network failures.

---

## 1. v2.1.88 implementation (TypeScript source)

### `/bridge-kick` — debug command

```typescript
// ============================================
// bridgeKickCommand - v2.1.88 ant-only debug surface
// Location: src/commands/bridge-kick.ts:191-200
// ============================================

// ORIGINAL (for source lookup):
const bridgeKick = {
  type: 'local',
  name: 'bridge-kick',
  description: 'Inject bridge failure states for manual recovery testing',
  isEnabled: () => process.env.USER_TYPE === 'ant',
  supportsNonInteractive: false,
  load: () => Promise.resolve({ call }),
} satisfies Command

// READABLE (for understanding):
const bridgeKickCommand = {
  type: 'local',
  name: 'bridge-kick',
  description: 'Inject bridge failure states for manual recovery testing',
  isEnabled: () => isAnthropicBuild(),
  supportsNonInteractive: false,
  load: () => loadBridgeKickHandler(),
};
// Mapping: isEnabled→isAnthropicBuild
```

### Subcommands

The `bridge-kick` command had eight subcommands for injecting different fault patterns:

```typescript
// (from src/commands/bridge-kick.ts:51+)
const call: LocalCommandCall = async args => {
  const h = getBridgeDebugHandle()
  if (!h) return { type: 'text', value: 'No bridge debug handle registered. ...' }
  const [sub, a, b] = args.trim().split(/\s+/)

  switch (sub) {
    case 'close':  /* fire ws_closed with code */
    case 'poll':   /* poll throws transient or fatal */
    case 'register':  /* register fails N times or fatally */
    case 'reconnect-session':  /* POST /bridge/reconnect fails */
    case 'heartbeat':  /* heartbeat throws */
    case 'reconnect':  /* call doReconnect directly */
    case 'status':  /* print bridge state */
    default:  /* show usage */
  }
}
```

### `/bridge` — user-facing slash command

```typescript
// ============================================
// bridgeFeatureGuard - v2.1.88 BRIDGE_MODE feature gate
// Location: src/commands.ts:73-75
// ============================================

// ORIGINAL (for source lookup):
const bridge = feature('BRIDGE_MODE')
  ? require('./commands/bridge/index.js').default
  : null

// READABLE (for understanding):
const bridge = bundlerFeatureFlag('BRIDGE_MODE')
  ? requireBridgeCommandModule()
  : null;
// Mapping: feature→bundlerFeatureFlag, BRIDGE_MODE→BRIDGE_MODE flag
```

`feature('BRIDGE_MODE')` is a different gate than `USER_TYPE === 'ant'`. `BRIDGE_MODE` is a per-build feature flag — some external builds may have had it enabled (early bridge rollout cohort), others not. The exact gating policy at v2.1.88 isn't fully captured in source comments, but the `feature()` call pattern means "controlled at build time, not user-facing."

### Why `/bridge-kick` is ant-only

A debug command that injects fake network failures into a live production session is genuinely dangerous:
- A user accidentally running `/bridge-kick close 1002` while connected to a real CCR session would tear down their connection
- The subcommand reference IS the documentation — there's no helptext to make the consequences clear
- The whole utility is for *deliberately* breaking things to test recovery code paths

Restricting to ant builds means only Anthropic engineers running internal builds can run these failure injectors.

---

## 2. v2.1.142 implementation (deobfuscated)

### `/bridge-kick` — preserved but disabled

```javascript
// ============================================
// bridgeKickCommandV2 - 2.1.142 preserved but isEnabled returns false
// Location: cli_inner_pretty.js:492234-492242
// ============================================

// ORIGINAL (for source lookup):
((EN5 = {
  type: "local",
  name: "bridge-kick",
  description: "Inject bridge failure states for manual recovery testing",
  isEnabled: () => !1,
  supportsNonInteractive: !1,
  load: () => Promise.resolve({ call: NN5 }),
}),
  (KZ4 = EN5));

// READABLE (for understanding):
const bridgeKickCommand = {
  type: "local",
  name: "bridge-kick",
  description: "Inject bridge failure states for manual recovery testing",
  isEnabled: () => false,           // hard-disabled in external build
  supportsNonInteractive: false,
  load: () => Promise.resolve({ call: bridgeKickHandler }),
};
// Mapping: EN5→bridgeKickCommand, NN5→bridgeKickHandler
```

The shape mirrors v2.1.88 except `isEnabled: () => process.env.USER_TYPE === 'ant'` became `isEnabled: () => false` — a hard disable.

### The kick handler (still in the binary)

```javascript
// ============================================
// bridgeKickHandler - handler exists but unreachable via slash dispatch
// Location: cli_inner_pretty.js:492128-492229
// ============================================

// ORIGINAL (for source lookup):
NN5 = async (H) => {
  let $ = $Z4();   // getBridgeDebugHandle
  if (!$)
    return {
      type: "text",
      value: "No bridge debug handle registered. Remote Control must be connected (USER_TYPE=ant).",
    };
  let [q, K, _] = H.trim().split(/\s+/);
  switch (q) {
    case "close": {
      let A = Number(K);
      if (!Number.isFinite(A))
        return { type: "text", value: `close: need a numeric code\n${Up6}` };
      return ($.fireClose(A),
        { type: "text", value: `Fired transport close(${A}). Watch debug.log for [bridge:repl] recovery.` });
    }
    case "poll": { /* ... */ }
    case "register": { /* ... */ }
    case "reconnect-session": { /* ... */ }
    case "heartbeat": { /* ... */ }
    case "reconnect": { /* ... */ }
    case "status": return { type: "text", value: $.describe() };
    default: return { type: "text", value: Up6 };
  }
};

// READABLE (for understanding):
async function bridgeKickHandler(args) {
  const debugHandle = getBridgeDebugHandle();
  if (!debugHandle) {
    return { type: "text", value: "No bridge debug handle registered. Remote Control must be connected (USER_TYPE=ant)." };
  }
  // ... dispatch on subcommand
}
// Mapping: NN5→bridgeKickHandler, $Z4→getBridgeDebugHandle, Up6→BRIDGE_KICK_USAGE
```

**Note the kept reference to `USER_TYPE=ant` in the error message.** Even though the command is now disabled, the error string from inside the handler still mentions the ant build constraint. This is leftover code — the message is no longer reachable from external builds because `isEnabled: () => false` filters the command out at the registry layer.

### `/remote-control` — the user-facing slash command

```javascript
// ============================================
// remoteControlSlashCommand - 2.1.142 user-facing entry
// Location: cli_inner_pretty.js:497963-497976
// ============================================

// ORIGINAL (for source lookup):
((Ph5 = {
  type: "local-jsx",
  name: "remote-control",
  aliases: ["rc"],
  description: "Control this session from your phone or claude.ai/code",
  argumentHint: "[name]",
  isEnabled: uk,
  get isHidden() { return !uk(); },
  immediate: !0,
  load: () => Promise.resolve().then(() => (r04(), i04)),
}),
  (Wh5 = Ph5));

// READABLE (for understanding):
const remoteControlCommand = {
  type: "local-jsx",
  name: "remote-control",
  aliases: ["rc"],
  description: "Control this session from your phone or claude.ai/code",
  argumentHint: "[name]",
  isEnabled: isRemoteControlAvailable,
  get isHidden() { return !isRemoteControlAvailable(); },
  immediate: true,
  load: () => loadRemoteControlImpl(),
};
// Mapping: Ph5→remoteControlCommand, uk→isRemoteControlAvailable
```

### The availability gate

```javascript
// ============================================
// isRemoteControlAvailable - composite gate
// Location: cli_inner_pretty.js:272764-272768
// ============================================

// ORIGINAL (for source lookup):
function uk() {
  if ($X6()) return !0;
  if (UK8()) return !1;
  return !fdH() && YdH();
}

// READABLE (for understanding):
function isRemoteControlAvailable() {
  // $X6: force-enable override (e.g., dev mode flag)
  if (isForceEnabledOverride()) return true;
  // disableRemoteControl setting blocks
  if (isDisabledByManagedSettings()) return false;
  // !fdH: no API key (Remote Control requires Claude.ai session, not API key)
  // YdH: CCR bridge available (server-side feature flag + first-party + logged in)
  return !hasApiKey() && isCloudCodeRunnerBridgeAvailable();
}
// Mapping: uk→isRemoteControlAvailable, $X6→isForceEnabledOverride, UK8→isDisabledByManagedSettings,
//          fdH→hasApiKey, YdH→isCloudCodeRunnerBridgeAvailable
```

Key differences from v2.1.88's `feature('BRIDGE_MODE')`:
- Runtime check (not build-time)
- Multiple composable signals: managed-settings + auth-mode + CCR availability
- Force-enable for dev/test
- Auto-hide when unavailable (`isHidden`)

---

## 3. Diff during promotion (88 → 142)

### What changed

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| User slash command name | `/bridge` | `/remote-control` (with `/rc` alias) |
| Gate for user command | `feature('BRIDGE_MODE')` build flag | Runtime composite (managed settings, auth, CCR avail) |
| `/bridge-kick` debug command | `isEnabled: () => USER_TYPE === 'ant'` | `isEnabled: () => false` (hard-disabled) |
| `/bridge-kick` handler code | Present in ant builds, excluded externally | Present but unreachable |
| Disable mechanism | Build-time (USER_TYPE) + runtime (feature gate) | `disableRemoteControl: true` managed setting + env var |
| Aliases | None | `/rc` short alias |
| Telemetry events | `tengu_bridge_*` (already public-named) | Same |
| `bridgeKick` in INTERNAL_ONLY_COMMANDS | YES | Doesn't matter — disabled at command level |
| CLI flags | n/a (interactive only) | `--remote-control` / `--rc`, autoStart settings |

### Why the rebrand

**"Bridge" was an internal codename.** Like "Penguin" (Fast Mode) and "Tengu" (telemetry prefix), the term "bridge" is engineer-speak for the connection between two systems. End users don't think of their phone-controls-laptop experience as a "bridge" — they think of it as remote control.

**Trade-off:**
- Renaming costs ecosystem-wide search/replace (docs, support tickets, telemetry events)
- But "bridge" was technically meaningless to users
- "Remote Control" is concrete and self-explanatory

**Anthropic kept the telemetry events as `tengu_bridge_*`** to preserve continuity in the events pipeline. This is the standard practice: user-visible names change, internal/telemetry names stay stable for historical comparison.

### Why `/bridge-kick` was preserved (not deleted)

Three possibilities Anthropic considered:
1. **Delete entirely**: cleanest, but loses the handler if a future internal-only build wants to enable it
2. **Keep ant-only**: still ships the handler externally (since `cli_inner_pretty.js` is the external build) — wasteful
3. **Keep with hard-disable**: ship the handler but make it unreachable — what was chosen

Option 3 is the conservative choice. The handler is still in the binary (~100 lines), but `isEnabled: () => false` makes it unreachable from external user input. A future internal-only enable can flip the gate.

**Why not Option 1 (delete):** the kick handler is a tested code path. Keeping it preserves the test surface for Anthropic engineers (in internal builds, they can patch `isEnabled` to return `USER_TYPE === 'ant'` and have the command back).

**Why not Option 2 (ant-only):** the bundler ships `cli_inner_pretty.js` to external users. The handler bytes exist regardless. Switching from "ant runtime check" to "hard disable" is cleaner — no possibility of an environment-variable trick re-enabling it for an external user.

### Why the user-facing `/remote-control` got an alias `/rc`

Frequent slash-command typing is a real UX cost. `/remote-control` is 14 characters; `/rc` is 3. For a feature users invoke often (connect, disconnect, switch endpoint), the short alias matters.

### What did NOT change

- The bridge infrastructure (telemetry, error types, reconnect logic)
- The `tengu_bridge_*` telemetry event names
- The bridge debug handle mechanism (`getBridgeDebugHandle`)
- The fault-injection primitives (still callable via the handler if `isEnabled` were flipped)

---

## 4. Implementation analysis

### Decision: hard-disable vs. ant-only runtime check

**What it does:** v2.1.142 sets `isEnabled: () => false` instead of `() => process.env.USER_TYPE === 'ant'`.

**How it works:**
1. Slash command registry calls `isEnabled()` to decide whether to surface a command
2. `() => false` is constant — registry filters out `bridge-kick` unconditionally
3. The handler bytes remain in the binary but no dispatch path reaches them

**Why this approach:**
- Stronger guarantee than `USER_TYPE === 'ant'`: even setting `USER_TYPE=ant` on an external binary at runtime would not re-enable (because the bundler may have constant-folded the check; or the external build never sets USER_TYPE; or the runtime check now reads "false" literal)
- Future-proof: when Anthropic wants to enable for an internal build, they patch the gate (one line) rather than re-implementing the command
- Forensics: an attacker examining the binary sees the disabled command and the handler, but can't trivially activate it without binary patching

**Trade-off:**
- Cost: ~5 KB of handler code shipped to external users for a feature they can't use
- Benefit: preserves testability for Anthropic internal builds, simpler reasoning ("disabled" beats "ant-runtime")

### Decision: alias `/rc`

**What it does:** the slash command `/remote-control` also matches `/rc`.

**How it works:**
1. The command's `aliases: ["rc"]` field is read by the slash-command resolver
2. Typing `/rc` and pressing tab autocomplete matches `/remote-control`
3. Pressing enter on `/rc` dispatches to the same handler

**Why this matters:**
- Frequent feature → frequent typing → short alias is a real win
- `/rc` is unambiguous (no other command starts with `r` and matches `c`)
- Discoverability: typing `/r` shows `/remote-control` as the suggestion; alias appears in the help

### Decision: `disableRemoteControl` setting at the schema level

```javascript
// (schema entry at cli_inner_pretty.js:50529-50534)
disableRemoteControl: y
  .boolean()
  .optional()
  .describe(
    "Disable Remote Control (claude.ai/code, `claude remote-control`, `--remote-control`/`--rc`, auto-start, and the in-session toggle). Typically set in managed settings.",
  ),
```

Same pattern as `disableAgentView`: ONE setting disables FIVE surfaces:
- claude.ai/code integration
- `claude remote-control` subcommand
- `--remote-control`/`--rc` flags
- auto-start
- in-session `/remote-control` slash command

Why: these surfaces are a stack — disabling any one would leave the others as inconsistent failure modes. Single switch keeps the user/admin experience coherent.

### Decision: preserve `tengu_bridge_*` telemetry names

When renaming user-facing strings, Anthropic intentionally did NOT rename telemetry events. Reasons:
- Historical comparison: an event named `tengu_bridge_session_done` lets analytics track the metric continuously across the rename
- Cost: renaming events requires updating downstream pipelines (BigQuery dashboards, alerting rules, runbook references)
- Risk: a rename + a bug in the same release would be hard to disentangle

So telemetry stays `tengu_bridge_*` while user docs say "Remote Control." This is the standard analytics naming hygiene.

---

## 5. Public entry points

### Slash command surface (v2.1.142)
- `/remote-control` (or `/rc`) — connect a Remote Control session
- `/remote-control disconnect` — disconnect (subcommand)
- `/remote-control [name]` — connect with a session name

### CLI surface (v2.1.142)
- `claude --remote-control` (or `--rc`) — start session in Remote Control mode
- `claude remote-control` — daemon subcommand for Remote Control management

### Settings (v2.1.142)
- `disableRemoteControl: true` — managed-settings disable
- Auto-start behaviors triggered by the daemon

### Debug surface
- `/bridge-kick` — present but disabled; can only be enabled via binary patching for testing

### v2.1.88 → v2.1.142 mapping
- v2.1.88 `/bridge` → v2.1.142 `/remote-control` (renamed, gate generalized)
- v2.1.88 `/bridge-kick` → v2.1.142 `/bridge-kick` (kept disabled, handler unchanged)
- v2.1.88 `feature('BRIDGE_MODE')` build flag → v2.1.142 runtime composite gate (`uk()`)

---

## 6. Cross-references

- See `by_version/v2.1.113-114.md` and onwards for Remote Control refinements
- See `00_overview/symbol_index_infra_platform.md` Module: Bridge/Remote Control
- v2.1.88 source: `src/bridge/*.ts`, `src/commands/bridge/*.tsx`, `src/commands/bridge-kick.ts`

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isRemoteControlAvailable` (`uk`) — composite gate (cli_inner_pretty.js:272764)
- `isForceEnabledOverride` (`$X6`) — dev-mode override (cli_inner_pretty.js)
- `isDisabledByManagedSettings` (`UK8`) — settings disable check (cli_inner_pretty.js:272761)
- `isCloudCodeRunnerBridgeAvailable` (`YdH`) — CCR bridge availability (cli_inner_pretty.js:272755)
- `remoteControlCommand` (`Ph5`) — registry entry (cli_inner_pretty.js:497963)
- `bridgeKickCommand` (`EN5`) — disabled debug command (cli_inner_pretty.js:492234)
- `bridgeKickHandler` (`NN5`) — handler implementation (cli_inner_pretty.js:492128)
- `getBridgeDebugHandle` (`$Z4`) — debug-handle accessor (cli_inner_pretty.js:492110)
- `BRIDGE_KICK_USAGE` (`Up6`) — usage string (cli_inner_pretty.js:492118)
- `disableRemoteControl` setting (cli_inner_pretty.js:50529)
- `isAccountLoggedIn` (`zL`) — login check used by CCR availability (cli_inner_pretty.js:272755)
- `isFirstParty` (`FK8`) — first-party-account check (cli_inner_pretty.js:272755)
- `isCloudCodeRunnerBridgeAvailable` (`YdH`) — composite cloud-side gate (cli_inner_pretty.js:272755)
- `BridgeFatalError` (`Qb`) — typed error class (cli_inner_pretty.js:492090+)

---

## Deep Analysis: Promotion Mechanism

### What changed at the gate

Bridge has *two distinct surfaces* and they took different promotion paths. The user-facing surface (`/bridge` → `/remote-control`) was **promoted with a generalized runtime gate**. The debug surface (`/bridge-kick`) was **preserved with a hard-disable** (`isEnabled: () => false`). The composite is unusual — one feature, two outcomes — and worth tracing.

**v2.1.88 user-facing gate (build-time):**

```typescript
// ============================================
// bridgeFeatureGuard - v2.1.88 build-time feature flag
// Location: src/commands.ts:73-75
// ============================================

// ORIGINAL (for source lookup):
const bridge = feature('BRIDGE_MODE')
  ? require('./commands/bridge/index.js').default
  : null

// READABLE (for understanding):
const bridge = buildFlag('BRIDGE_MODE')
  ? requireBridgeCommandModule()
  : null;
// Mapping: feature→buildFlag, BRIDGE_MODE→build-time define
```

**v2.1.142 user-facing gate (runtime composite):**

```javascript
// ============================================
// isRemoteControlAvailable - v2.1.142 runtime composite gate
// Location: cli_inner_pretty.js:272764-272768
// ============================================

// ORIGINAL (for source lookup):
function uk() {
  if ($X6()) return !0;
  if (UK8()) return !1;
  return !fdH() && YdH();
}
function YdH() {
  return zL() && FK8() && Z$("tengu_ccr_bridge", !1);
}

// READABLE (for understanding):
function isRemoteControlAvailable() {
  if (isForceEnabledOverride()) return true;        // dev-mode escape hatch
  if (isDisabledByManagedSettings()) return false;  // managed-policy opt-out
  return !hasApiKey() && isCloudCodeRunnerBridgeAvailable();
}
function isCloudCodeRunnerBridgeAvailable() {
  return isAccountLoggedIn() && isFirstParty() && featureFlag("tengu_ccr_bridge", false);
}
// Mapping: uk→isRemoteControlAvailable, $X6→isForceEnabledOverride,
//          UK8→isDisabledByManagedSettings, fdH→hasApiKey,
//          YdH→isCloudCodeRunnerBridgeAvailable, zL→isAccountLoggedIn,
//          FK8→isFirstParty
```

**Step-by-step diff:**

1. v2.1.88 used a single build-time `feature('BRIDGE_MODE')` constant-folded by the bundler. The presence/absence of the command was decided at *build* time. One bundle had it, one didn't.
2. v2.1.142 ships *one* bundle with the command always present in code. Whether to surface it is decided at *runtime* by `uk()`, which composes four independent signals:
   - **`$X6`** — force-enable override (dev/test escape hatch, hard-coded `return !1` in this build, but the slot is preserved for internal builds)
   - **`UK8`** — `disableRemoteControl` managed-setting kill switch
   - **`!fdH`** — *negation* of `hasApiKey`: Remote Control requires a claude.ai account session, not an API key (because the bridge is anchored to a Claude.ai account)
   - **`YdH`** — composite cloud-side: logged in + first-party + server-side feature flag `tengu_ccr_bridge`
3. v2.1.88 `/bridge-kick` had `isEnabled: () => process.env.USER_TYPE === 'ant'` — a runtime check that the bundler can constant-fold in external builds (knocking out the gate but leaving the handler bytes). v2.1.142 replaces this with `isEnabled: () => !1` — a literal-false gate. The handler bytes remain at cli_inner_pretty.js:492128-492229 but no dispatch path reaches them.
4. The error string inside `bridgeKickHandler` still contains the legacy phrase `"USER_TYPE=ant"` at cli_inner_pretty.js:492133 — this is a leftover of the v2.1.88 message that survives in the binary even though the command is now disabled and the message is unreachable from external slash dispatch.

### Why this promotion approach

**Design rationale — why a runtime composite gate (not the simpler build-time flag) for the user-facing command:**

The v2.1.88 build-time gate decided the *binary identity* — one bundle had bridge, one didn't. This made sense when Remote Control was a cohort rollout (only some users got it). By v2.1.142, Anthropic wants Remote Control available to *everyone who meets the runtime conditions*, but those conditions are inherently runtime-determined:

- "Logged in with a Claude.ai account" is a runtime fact.
- "First-party (not third-party reseller)" depends on the live auth tier.
- "Server-side feature flag `tengu_ccr_bridge` enabled" — Anthropic can flip this without a CLI release.
- "Not disabled by enterprise managed settings" — depends on per-user policy files.
- "Not using API key" — depends on which credential path the user is on right now.

Build-time flags can't express any of these. The promotion essentially **moves the gate from build into runtime so Anthropic can roll out, scale back, or per-org enable without shipping a new CLI version**.

**Why `bridge-kick` is *preserved* but hard-disabled (rather than removed):**

This is the key architectural question for bridge. Three options were on the table:

1. **Delete entirely**: zero binary cost, but loses the test surface for internal builds.
2. **Keep ant-only runtime check (`USER_TYPE === 'ant'`)**: external users have the bytes anyway since `cli_inner_pretty.js` is the external build — the runtime check just hides the command. But an environment-variable trick could re-enable.
3. **Keep with literal-false (`isEnabled: () => !1`)**: bytes ship to external, command is unreachable, no env-var trick re-enables, internal builds patch the gate to re-enable.

Anthropic chose (3). The rationale is fitness for purpose:

- `bridge-kick` is a *test harness* for the bridge reconnection logic. Anthropic engineers use it constantly to inject faults like `poll 404 not_found_error` (the 147K-events-per-week "dead gate" failure mode described in the v2.1.88 source comments).
- The handler is ~100 lines of tested code that maps subcommand names to fault-injection calls on a debug handle (`getBridgeDebugHandle` → `injectFault`, `fireClose`, `forceReconnect`, etc.).
- Deleting it and re-adding for internal builds would mean maintaining a fork.
- The literal-false gate is the cleanest "ship the handler bytes, but make sure no external user input ever reaches them" guarantee.

**Why bridge survived as still-internal rather than being promoted or removed — what infrastructure is missing for `/bridge-kick` to graduate:**

`/bridge-kick` cannot be promoted because:

1. **It is genuinely dangerous in production.** Subcommands like `/bridge-kick close 1002` deliberately tear down the user's WebSocket connection. There is no realistic user need for this surface.
2. **The documentation IS the source code.** The `Up6` (`BRIDGE_KICK_USAGE`) string at cli_inner_pretty.js:492118 references `BridgeFatalError`, `injectFault`, `pollForWork`, `doReconnect`, `Strategy 2` — terms only meaningful to engineers who know the bridge code. No user-facing help text exists; building one would be more work than the command is worth externally.
3. **The fault patterns reference internal telemetry events** (`tengu_bridge_repl_fatal_error`, `tengu_bridge_repl_env_lost`) and BQ-verified failure modes that external users cannot observe or reason about.
4. **Reconnect testing is rare enough that build-team automation would be a better path** than a user-visible command. The reason it stays as a slash command at all is interactive debugging convenience for Anthropic engineers connected to a live Remote Control session.

What would have to be true for `/bridge-kick` to graduate:

- A user-mode "test my Remote Control connection" surface (with safe, transient fault injection) would need to exist.
- Help text would need to be authored explaining each subcommand in user-meaningful terms.
- The fault primitives would need to be hardened so a misuse cannot leave the session in an undefined state.

None of those are present, so `/bridge-kick` stays disabled.

### Step-by-step runtime decision flow

```
User invocation paths:
  ┌────────────────────────────────────────────────────────┐
  │ /remote-control  OR  /rc  (slash command path)         │
  │ --remote-control / --rc   (CLI flag path)              │
  │ claude remote-control     (subcommand path)            │
  └────────────────┬───────────────────────────────────────┘
                   ▼
  ┌────────────────────────────────────────────────────────┐
  │ Slash registry consults remoteControlCommand (Ph5)     │
  │  - isEnabled: uk                                       │
  │  - isHidden:  () => !uk()                              │
  └────────────────┬───────────────────────────────────────┘
                   ▼
  ┌────────────────────────────────────────────────────────┐
  │ uk() ─ composite gate evaluation:                      │
  │   1. $X6 (isForceEnabledOverride)                      │
  │      ─ true   ► AVAILABLE (dev/test bypass)            │
  │   2. UK8 (isDisabledByManagedSettings)                 │
  │      ─ true   ► UNAVAILABLE (enterprise policy)        │
  │   3. fdH (hasApiKey)                                   │
  │      ─ true   ► UNAVAILABLE (RC requires CCO session)  │
  │   4. YdH (isCloudCodeRunnerBridgeAvailable)            │
  │      = zL && FK8 && featureFlag("tengu_ccr_bridge")    │
  │      ─ false  ► UNAVAILABLE                            │
  │      ─ true   ► AVAILABLE                              │
  └────────────────┬───────────────────────────────────────┘
                   │ (AVAILABLE)
                   ▼
  ┌────────────────────────────────────────────────────────┐
  │ Load remote-control implementation (loadRemoteControl) │
  │ Open Bridge connection (registerBridgeEnvironment)     │
  │ Wire poll loop, heartbeat, reconnect strategies        │
  │ Telemetry: tengu_bridge_command { action: "connect" }  │
  └────────────────────────────────────────────────────────┘

Separately, /bridge-kick path:
  ┌────────────────────────────────────────────────────────┐
  │ User types /bridge-kick close 1002                     │
  └────────────────┬───────────────────────────────────────┘
                   ▼
  ┌────────────────────────────────────────────────────────┐
  │ Slash registry consults bridgeKickCommand (EN5)        │
  │  - isEnabled: () => !1   ◄─── always false             │
  │  - command filtered out at registry layer              │
  └────────────────┬───────────────────────────────────────┘
                   ▼
            "Unknown command" returned
            (handler NN5 never reached)
            (error string at :492133 never printed)

  Internal build (hypothetical):
            Patch isEnabled: () => true
            ┌──────────────────────────────────────────────┐
            │ getBridgeDebugHandle ($Z4) returns debug handle│
            │  null → "No bridge debug handle registered. │
            │         Remote Control must be connected   │
            │         (USER_TYPE=ant)."                  │
            │ present → dispatch to injectFault/fireClose/...│
            └──────────────────────────────────────────────┘
```

### Key insight

Bridge's promotion is **two separate decisions stitched together**: (1) the *user-facing* surface graduates by replacing a build-time `feature('BRIDGE_MODE')` flag with a runtime composite gate so Anthropic can roll the feature out, scale back, or per-org disable without re-releasing the CLI; (2) the *debug* surface stays internal by switching from `USER_TYPE === 'ant'` to `isEnabled: () => false` so the handler bytes stay available to internal builds (which can patch the single literal-false gate) but no environment-variable trick can resurrect the command for external users. The bridge-kick error message at cli_inner_pretty.js:492133 — still containing the phrase `"USER_TYPE=ant"` — is a fossil of the old gate: code that survives the promotion but whose only purpose was to be visible under the *old* gating mechanism. It is harmless because the new gate makes it unreachable from external dispatch.

### Trade-offs analysis

| Decision | Cost | Benefit |
|----------|------|---------|
| Build-time flag → runtime composite gate (for `/remote-control`) | Composite logic harder to reason about than a build-time on/off | Anthropic can roll out, scale back, or per-org enable without CLI release; runtime signals (account type, server flag) impossible to express at build time |
| Hard-disable (`isEnabled: () => !1`) vs. delete bridge-kick | ~5 KB handler code shipped to external users for an unreachable surface | Preserves test surface for internal builds (one-line patch re-enables); cleaner than runtime `USER_TYPE === 'ant'` check (no env-var trick can re-enable) |
| Hard-disable vs. keep `USER_TYPE === 'ant'` runtime check | Internal builds need to patch a literal instead of setting an env var | Forensically stronger; external attacker cannot resurrect command by faking USER_TYPE; clearer intent ("disabled" vs. "ant-only") |
| Rename `/bridge` to `/remote-control`, add `/rc` alias | Docs/support tickets must be updated; user habits broken | "Bridge" was internal codename; "Remote Control" is self-explanatory; `/rc` short alias offsets the longer canonical name |
| Preserve `tengu_bridge_*` telemetry event names through the rename | Naming asymmetry (user-facing "Remote Control", events "bridge") | Historical analytics continuity; downstream pipelines (BigQuery, alerts, runbooks) do not need updates; rename + bug in same release would be hard to disentangle |
| Composite gate uses `!hasApiKey()` (API-key users excluded) | API-key users cannot use Remote Control | RC is anchored to a Claude.ai account session, not an API key; gating prevents the surface appearing for users who can never make it work |
| `disableRemoteControl` setting disables 5 surfaces with one switch | Setting name suggests one surface, actually disables five | Coherent user/admin mental model; partial-disable would leave inconsistent failure modes (e.g. flag works but slash command does not) |
| Server-side feature flag `tengu_ccr_bridge` is part of composite | Anthropic-side flag flips can disable user features without notice | Allows immediate kill-switch if cloud-side bridge has incidents; complements client-side `disableRemoteControl` for enterprise opt-out |
| Leftover `"USER_TYPE=ant"` string in bridge-kick handler at :492133 | Slightly inaccurate documentation if user binary-patches the gate | Removing the string would force re-testing the handler; surviving fossil is harmless because the new gate makes it unreachable |
