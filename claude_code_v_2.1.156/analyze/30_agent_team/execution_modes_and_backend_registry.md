# Execution Modes & the Backend Registry (v2.1.156)

> Module: `30_agent_team/` (Claude Code v2.1.156, bundle `cli_inner_pretty.js`, 649,979 lines)
> Subsystem internal name: **"swarm"** (telemetry `swarm_*`, user-facing error text "agent swarms"). This is the same subsystem v2.1.142 documented as **"agent team"**.

## TL;DR

The agent-team subsystem can run a spawned teammate in **one of two execution modes**, and a single small module — the **BackendRegistry** (`R94` @`cli_inner_pretty.js:380912`) — owns the entire decision:

1. **in-process** — the teammate is an async task inside the *same* `claude` Node process, isolated by `AsyncLocalStorage`. Backend class `InProcessBackend` (`K94` @`380062`).
2. **cross-process panes** — the teammate is a *separate* `claude` OS process launched inside a tmux pane or an iTerm2 split. Backend wrapper `PaneBackendExecutor` (`L94` @`380388`), which wraps a `TmuxBackend` or `ITermBackend`.

Both backends implement the identical `TeammateExecutor` shape (`type` / `setContext` / `isAvailable` / `spawn` / `sendMessage` / `terminate` / `kill` / `isActive`) so every caller spawns and manages teammates without knowing which mode is live. They also share the same file mailbox as IPC and the same TeamCreate / TeamDelete / SendMessage toolset.

The single most important function in the module is `isInProcessEnabled` (`ma` @`381076`): it is the switch that decides in-process vs. pane for the *current* spawn, given the master feature gate, the `teammateMode` config snapshot, the runtime environment (inside tmux? inside iTerm2?), and a sticky "fallback" bit. The dispatch entry point `getTeammateExecutor` (`NT_` @`381098`) reads that switch and hands back the right executor.

Whole-module behavior is gated by `isAgentTeamsEnabled` (`R7` @`240766`), which requires both an opt-in env/flag **and** the GrowthBook gate `tengu_amber_flint`.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files (and `symbol_additions_v2_1_156_agent_team.md`):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, LLM API, Agents, Subagent, State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (incl. **Agent Team / Swarm**)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/objects covered in this document:

- `isAgentTeamsEnabled` (obfuscated: `R7`) — master gate; env/flag AND GrowthBook `tengu_amber_flint` (`cli_inner_pretty.js:240766`).
- `hasAgentTeamsFlag` (obfuscated: `Ru5`) — `process.argv.includes("--agent-teams")` (`cli_inner_pretty.js:240763`).
- `isTeammate` (obfuscated: `FA`) — is the *current* process itself a teammate (`cli_inner_pretty.js:99280`).
- `teammateModeEnum` (obfuscated: `PEq`) — `["auto","tmux","in-process"]` (`cli_inner_pretty.js:49109`).
- `teammateModeSnapshotModule` (obfuscated: `PU6`) — snapshot module export map (`cli_inner_pretty.js:380272`).
- `captureTeammateModeSnapshot` (obfuscated: `D94`) — read config/CLI override at startup (`cli_inner_pretty.js:380289`).
- `getTeammateModeFromSnapshot` (obfuscated: `JSH`) — return captured mode, default `"auto"` (`cli_inner_pretty.js:380293`).
- `getTeammateModeSnapshotInternal` (obfuscated: `kT_`) — registry-local wrapper of `JSH` (`cli_inner_pretty.js:381073`).
- `setCliTeammateModeOverride` (obfuscated: `LT_`) — `--teammate-mode` override (`cli_inner_pretty.js:380280`).
- `getCliTeammateModeOverride` (obfuscated: `XU6`) — read pending override (`cli_inner_pretty.js:380283`).
- `clearCliTeammateModeOverride` (obfuscated: `LU6`) — clear override on UI mode change (`cli_inner_pretty.js:380286`).
- `createBackendRegistry` (obfuscated: `y94`) — registry state factory (`cli_inner_pretty.js:380930`).
- `globalBackendRegistry` (obfuscated: `NS`) — the process singleton (`cli_inner_pretty.js:381118`).
- `ensureBackendsRegistered` (obfuscated: `AeH`) — lazy-import backend classes (`cli_inner_pretty.js:380942`).
- `detectAndGetBackend` (obfuscated: `jLH`) — pane backend detection tree (`cli_inner_pretty.js:380965`).
- `createTmuxBackendInstance` (obfuscated: `BW8`) — `new TmuxBackendClass()` (`cli_inner_pretty.js:380956`).
- `createITermBackendInstance` (obfuscated: `h94`) — `new ITermBackendClass()` (`cli_inner_pretty.js:380960`).
- `getTmuxInstallInstructions` (obfuscated: `vT_`) — per-OS install help (`cli_inner_pretty.js:381034`).
- `getBackendByType` (obfuscated: `LSH`) — explicit type → backend (`cli_inner_pretty.js:381056`).
- `getCachedBackend` (obfuscated: `YeH`) — return cached pane backend (`cli_inner_pretty.js:381064`).
- `getCachedDetectionResult` (obfuscated: `vU6`) — return cached detection result (`cli_inner_pretty.js:381067`).
- `markInProcessFallback` (obfuscated: `kU6`) — set sticky fallback bit (`cli_inner_pretty.js:381070`).
- `isInProcessEnabled` (obfuscated: `ma`) — **the in-process-vs-pane switch** (`cli_inner_pretty.js:381076`).
- `getResolvedTeammateMode` (obfuscated: `NU6`) — `"in-process"` | `"tmux"` (`cli_inner_pretty.js:381091`).
- `getInProcessBackend` (obfuscated: `S94`) — memoized InProcessBackend (`cli_inner_pretty.js:381094`).
- `getTeammateExecutor` (obfuscated: `NT_`) — **dispatch entry point** (`cli_inner_pretty.js:381098`).
- `getPaneBackendExecutor` (obfuscated: `ET_`) — memoized PaneBackendExecutor (`cli_inner_pretty.js:381102`).
- `resetBackendDetection` (obfuscated: `EU6`) — clear all caches (test path) (`cli_inner_pretty.js:381110`).
- `InProcessBackend` (obfuscated: `K94`) — in-process TeammateExecutor (`cli_inner_pretty.js:380062`).
- `createInProcessBackend` (obfuscated: `_94`) — InProcessBackend factory (`cli_inner_pretty.js:380172`).
- `PaneBackendExecutor` (obfuscated: `L94`) — pane TeammateExecutor wrapper (`cli_inner_pretty.js:380388`).
- `createPaneBackendExecutor` (obfuscated: `P94`) — PaneBackendExecutor factory (`cli_inner_pretty.js:380498`).
- `isInsideTmux` (obfuscated: `Ga`) — async insideTmux probe (`cli_inner_pretty.js:336178`).
- `isInsideTmuxSync` (obfuscated: `MhH`) — sync insideTmux probe (`cli_inner_pretty.js:336159`).
- `isInITerm2` (obfuscated: `h6H`) — iTerm2 probe (`cli_inner_pretty.js:336192`).
- `isTmuxAvailable` (obfuscated: `kXH`) — tmux on PATH (`cli_inner_pretty.js:336189`).
- `isIt2CliAvailable` (obfuscated: `MG$`) — `it2 session list` probe (`cli_inner_pretty.js:336199`).
- `getPreferTmuxOverIterm2` (obfuscated: `w94`) — user preference (`cli_inner_pretty.js:380261`).
- `isNonInteractiveSession` (obfuscated: `R6`) — `-p`/print mode (`cli_inner_pretty.js:2742`).
- `getPlatform` (obfuscated: `n$`) — macos/linux/wsl/windows (`cli_inner_pretty.js:42334`).
- `growthbookFlag` (obfuscated: `V$`) — feature-flag lookup with default (`cli_inner_pretty.js:141101`).

(New symbols introduced here are appended to `00_overview/symbol_index_core_features.md` → Module: Agent Team, and recorded in `symbol_additions_v2_1_156_agent_team.md`. This module doc uses **list format only**, per project convention.)

---

## 1. The master gate: is the agent-team subsystem even on?

### `isAgentTeamsEnabled` / `hasAgentTeamsFlag`

```javascript
// ============================================
// isAgentTeamsEnabled - Master gate for the entire agent-team (swarm) subsystem
// Location: cli_inner_pretty.js:240763-240770
// ============================================

// ORIGINAL (for source lookup):
function Ru5() {
  return process.argv.includes("--agent-teams");
}
function R7() {
  if (!xH(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !Ru5()) return !1;
  if (!V$("tengu_amber_flint", !0)) return !1;
  return !0;
}

// READABLE (for understanding):
function hasAgentTeamsFlag() {
  // True iff the user passed the --agent-teams CLI flag this run.
  return process.argv.includes("--agent-teams");
}
function isAgentTeamsEnabled() {
  // Layer 1: user opt-in — env var OR --agent-teams flag.
  if (!isTruthy(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !hasAgentTeamsFlag())
    return false;
  // Layer 2: server-side GrowthBook kill-switch (defaults to ON when absent).
  if (!growthbookFlag("tengu_amber_flint", true)) return false;
  return true;
}

// Mapping: Ru5→hasAgentTeamsFlag, R7→isAgentTeamsEnabled, xH→isTruthy, V$→growthbookFlag
```

**What it does:** Decides whether the agent-team/swarm feature surface exists at all this session. Everything in this module — the TeamCreate tool, the backend registry, in-process and pane spawning — is downstream of `isAgentTeamsEnabled` returning `true`.

**How it works (step by step):**
1. **User opt-in (Layer 1).** The user must explicitly turn the feature on, either by setting `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to a truthy value or by passing `--agent-teams` on the command line. The truthiness check `isTruthy` (`xH` @`1795`) accepts `1/true/yes/on` (case-insensitive). If neither is present, the gate short-circuits to `false`.
2. **Server kill-switch (Layer 2).** Even with the user opt-in, the GrowthBook feature flag `tengu_amber_flint` must not be turned off. `growthbookFlag` (`V$` @`141101`) returns the flag value, falling back to the supplied default `true` if the flag store has no entry (`cli_inner_pretty.js:141106`). So absence of the flag = enabled; an explicit `false` from the server = disabled.
3. If both layers pass, the subsystem is enabled.

**Why this approach (trade-offs):**
- **Two independent layers** mean Anthropic can ship the code dark, let early adopters opt in via env var, and still retain a remote kill-switch. The default-`true` semantics keep the feature on for opted-in users unless the server actively disables it — important for an experimental feature that may need an emergency rollback without a client release.
- An alternative would be a single env var with no server gate, but that removes the remote off-switch; or a server-only gate with no env var, but that would expose the experiment to all users prematurely. The chosen design gives both **client control** and **server control**.

**Key insight:** "amber flint" is the codename for the agent-team rollout. Note the codename has *nothing* to do with execution mode — it governs the whole feature, not the in-process-vs-pane split. The execution-mode decision (`isInProcessEnabled`) runs *after* this gate has already admitted the feature.

### `isTeammate` — "am I myself a teammate?"

```javascript
// ============================================
// isTeammate - True when THIS process is a spawned teammate (not the leader)
// Location: cli_inner_pretty.js:99280-99283
// ============================================

// ORIGINAL (for source lookup):
function FA() {
  if (XZ()) return !0;
  return !!(UB?.agentId && UB?.teamName);
}

// READABLE (for understanding):
function isTeammate() {
  // Fast path: an active teammate AsyncLocalStorage context means in-process teammate.
  if (getCurrentTeammateContext()) return true;
  // Slow path: a static team context (set by --agent-id/--agent-name/--team-name
  // CLI flags) means this is a cross-process pane teammate.
  return !!(staticTeamContext?.agentId && staticTeamContext?.teamName);
}

// Mapping: FA→isTeammate, XZ→getCurrentTeammateContext, UB→staticTeamContext
```

**What it does:** Distinguishes a *teammate* process/task from a *leader* (team-lead). It is the symmetric counterpart of the registry: the registry decides *how to spawn* teammates; `isTeammate` lets a running process know *whether it is one*.

**How it works:** Two signals, checked in order. The in-process signal is the presence of an active teammate `AsyncLocalStorage` context (`getCurrentTeammateContext`, `XZ`). The cross-process signal is a static team context object (`staticTeamContext`, `UB`) carrying both `agentId` and `teamName`, which is populated at startup when the process was launched with the `--agent-id`/`--agent-name`/`--team-name` flags (the very flags `PaneBackendExecutor.spawn` writes into the pane command — see §6). The dual check is exactly why the *same* `isTeammate` answer is correct in both execution modes.

**Why it matters here:** `isTeammate` is consulted with `isAgentTeamsEnabled` to suppress leader-only UX inside teammates, e.g. prompt suggestions are disabled when `isAgentTeamsEnabled() && isTeammate()` (`cli_inner_pretty.js:240785`, source tag `"swarm_teammate"`). This confirms the "swarm" naming is the same subsystem.

---

## 2. The teammate-mode setting (auto / tmux / in-process)

The user-facing knob that *biases* the execution-mode decision is the `teammateMode` config value. There are three legal values, frozen into an enum:

```javascript
// ============================================
// teammateModeEnum - The three legal teammate execution modes
// Location: cli_inner_pretty.js:49109 (initialized in module jF$)
// ============================================

// ORIGINAL (for source lookup):
PEq = ["auto", "tmux", "in-process"];

// READABLE (for understanding):
const teammateModeEnum = ["auto", "tmux", "in-process"];

// Mapping: PEq→teammateModeEnum
```

This enum drives the zod control schema for the setting (`cli_inner_pretty.js:51948`):

```javascript
// ============================================
// teammateMode control-schema field - Validated session setting
// Location: cli_inner_pretty.js:51948-51952
// ============================================

// ORIGINAL (for source lookup):
teammateMode: y
  .enum(PEq)
  .optional()
  .catch(void 0)
  .describe("How spawned teammates execute (tmux, in-process, auto)"),

// READABLE (for understanding):
teammateMode: zod
  .enum(teammateModeEnum)
  .optional()
  .catch(undefined)              // invalid value silently coerced to undefined (→ "auto")
  .describe("How spawned teammates execute (tmux, in-process, auto)"),

// Mapping: PEq→teammateModeEnum, y→zod
```

The `.catch(void 0)` is a quiet-failure design choice: an out-of-range value from a malformed settings file does not throw — it becomes `undefined`, and the snapshot's `?? "auto"` fallback (§2.1) then resolves it to `"auto"`. The setting can be supplied three ways:

1. **Config file** — key `"teammateMode"`, default `"auto"`, read at snapshot capture (`cli_inner_pretty.js:380291`).
2. **`--teammate-mode <mode>` CLI flag** — wired at `cli_inner_pretty.js:644830` (`if (D8.teammateMode) ...setCliTeammateModeOverride(D8.teammateMode)`), with control-schema validation at `cli_inner_pretty.js:646536` (`q === "auto" || q === "tmux" || q === "in-process" ? q : void 0`).
3. **Settings UI** — a runtime change clears the CLI override and updates the snapshot (`clearCliTeammateModeOverride`, see below).

### 2.1 The teammate-mode **snapshot** module

The setting is *captured once at startup* and then frozen for the session. This is the same "snapshot" discipline used elsewhere (e.g. hooks config) and exists so a mid-session config edit cannot change how *already-decided* spawns behave inconsistently.

```javascript
// ============================================
// teammateModeSnapshot module - Capture-once teammate mode (CLI override > config)
// Location: cli_inner_pretty.js:380272-380299
// ============================================

// ORIGINAL (for source lookup):
var PU6 = {};
X$(PU6, {
  setCliTeammateModeOverride: () => LT_,
  getTeammateModeFromSnapshot: () => JSH,
  getCliTeammateModeOverride: () => XU6,
  clearCliTeammateModeOverride: () => LU6,
  captureTeammateModeSnapshot: () => D94,
});
function LT_(H) { PT$ = H; }
function XU6() { return PT$; }
function LU6(H) {
  ((PT$ = null), (DSH = H), N(`[TeammateModeSnapshot] CLI override cleared, new mode: ${H}`));
}
function D94() {
  if (PT$) ((DSH = PT$), N(`[TeammateModeSnapshot] Captured from CLI override: ${DSH}`));
  else ((DSH = Q1("teammateMode", "auto").value), N(`[TeammateModeSnapshot] Captured from config: ${DSH}`));
}
function JSH() {
  if (DSH === null)
    (hH(Error("getTeammateModeFromSnapshot called before capture - this indicates an initialization bug")), D94());
  return DSH ?? "auto";
}
var DSH = null, PT$ = null;

// READABLE (for understanding):
const teammateModeSnapshotModule = {
  setCliTeammateModeOverride,    // LT_
  getTeammateModeFromSnapshot,   // JSH
  getCliTeammateModeOverride,    // XU6
  clearCliTeammateModeOverride,  // LU6
  captureTeammateModeSnapshot,   // D94
};

let capturedMode = null;        // DSH — the frozen mode for this session
let cliOverride   = null;       // PT$ — pending --teammate-mode value

function setCliTeammateModeOverride(mode) { cliOverride = mode; }       // before capture
function getCliTeammateModeOverride()     { return cliOverride; }
function clearCliTeammateModeOverride(newMode) {
  // User changed the setting in the UI: drop the CLI override and adopt the new mode.
  cliOverride = null;
  capturedMode = newMode;
  debugLog(`[TeammateModeSnapshot] CLI override cleared, new mode: ${newMode}`);
}
function captureTeammateModeSnapshot() {
  // CLI override wins; else read config "teammateMode" (default "auto").
  if (cliOverride) { capturedMode = cliOverride; }
  else { capturedMode = getConfigValue("teammateMode", "auto").value; }
}
function getTeammateModeFromSnapshot() {
  if (capturedMode === null) {
    // Defensive: should have been captured at startup. Log + lazy-capture.
    logError(new Error("getTeammateModeFromSnapshot called before capture - this indicates an initialization bug"));
    captureTeammateModeSnapshot();
  }
  return capturedMode ?? "auto";
}

// Mapping: PU6→teammateModeSnapshotModule, LT_→setCliTeammateModeOverride, XU6→getCliTeammateModeOverride,
//          LU6→clearCliTeammateModeOverride, D94→captureTeammateModeSnapshot, JSH→getTeammateModeFromSnapshot,
//          DSH→capturedMode, PT$→cliOverride, Q1→getConfigValue, hH→logError, N→debugLog
```

**What it does:** Resolves a single authoritative `teammateMode` ("auto" | "tmux" | "in-process") and freezes it for the session, with a clear precedence: **CLI override > config value > "auto"**.

**How it works (step by step):**
1. `--teammate-mode` parsing (early, before capture) calls `setCliTeammateModeOverride`, stashing the value in `cliOverride`.
2. At startup `captureTeammateModeSnapshot` runs: if `cliOverride` is set it becomes the captured mode; otherwise the config getter `getConfigValue("teammateMode","auto")` supplies it (`.value` unwraps the getter's `{value, source}` envelope).
3. `getTeammateModeFromSnapshot` returns the captured value; if capture somehow never ran, it logs an init-bug error and lazily captures (so the registry never reads `null`), then falls back to `"auto"`.
4. A runtime UI change calls `clearCliTeammateModeOverride(newMode)`, which both drops the now-stale CLI override and adopts the new mode atomically. The atomic `newMode` argument (rather than re-reading config) is explicitly to avoid a read-after-write race — the value is passed in directly.

**Why a snapshot rather than reading config live?** If `isInProcessEnabled` read config on every spawn, two teammates spawned seconds apart could land in different execution modes after a settings edit, producing an inconsistent team (some in-process, some in panes) that shares one mailbox but has divergent lifecycle ownership. Freezing the mode at startup makes the team **internally consistent**. The deliberate exception is the UI path (`clearCliTeammateModeOverride`), which intentionally *does* update the snapshot so a user who explicitly flips the setting sees it take effect for subsequent spawns — a controlled override of the snapshot discipline.

**Key insight:** The registry never calls `getConfigValue` directly. It always goes through the frozen snapshot via `getTeammateModeFromSnapshot` (wrapped registry-locally as `getTeammateModeSnapshotInternal`, `kT_` @`381073`). This is the only sanctioned source of truth for "what mode did the user ask for."

---

## 3. The BackendRegistry: state, singleton, and exports

```javascript
// ============================================
// createBackendRegistry - Factory producing the registry's mutable state shape
// Location: cli_inner_pretty.js:380930-380941
// ============================================

// ORIGINAL (for source lookup):
function y94() {
  return {
    cachedBackend: null,
    cachedDetectionResult: null,
    backendsRegistered: !1,
    cachedInProcessBackend: null,
    cachedPaneBackendExecutor: null,
    inProcessFallbackActive: !1,
    TmuxBackendClass: null,
    ITermBackendClass: null,
  };
}

// READABLE (for understanding):
function createBackendRegistry() {
  return {
    cachedBackend: null,              // the detected PaneBackend (tmux/iterm2 instance)
    cachedDetectionResult: null,      // {backend, isNative, needsIt2Setup}
    backendsRegistered: false,        // have backend classes been lazy-imported?
    cachedInProcessBackend: null,     // memoized InProcessBackend (TeammateExecutor)
    cachedPaneBackendExecutor: null,  // memoized PaneBackendExecutor (TeammateExecutor)
    inProcessFallbackActive: false,   // sticky: a pane spawn failed → force in-process
    TmuxBackendClass: null,           // ctor, registered by TmuxBackend module
    ITermBackendClass: null,          // ctor, registered by ITermBackend module
  };
}

// Mapping: y94→createBackendRegistry
```

The process holds **one** registry instance, `globalBackendRegistry` (`NS` @`381118`), created from this factory inside the module init thunk (`cli_inner_pretty.js:381129` — `NS = y94()`). Every registry function takes the registry as its first parameter defaulting to `NS` (e.g. `function ma(H = NS)`), which makes them trivially testable against a fresh `createBackendRegistry()` while defaulting to the singleton in production.

The module's export map binds the readable API names to the obfuscated implementations (`cli_inner_pretty.js:380913-380929`):

```javascript
// ============================================
// BackendRegistry export map - public API of module R94
// Location: cli_inner_pretty.js:380912-380929
// ============================================

// ORIGINAL (for source lookup):
var R94 = {};
X$(R94, {
  resetBackendDetection: () => EU6,
  registerTmuxBackend: () => GU6,
  registerITermBackend: () => VU6,
  markInProcessFallback: () => kU6,
  isInProcessEnabled: () => ma,
  globalBackendRegistry: () => NS,
  getTeammateExecutor: () => NT_,
  getResolvedTeammateMode: () => NU6,
  getInProcessBackend: () => S94,
  getCachedDetectionResult: () => vU6,
  getCachedBackend: () => YeH,
  getBackendByType: () => LSH,
  ensureBackendsRegistered: () => AeH,
  detectAndGetBackend: () => jLH,
  createBackendRegistry: () => y94,
});

// READABLE (for understanding):
const BackendRegistry = {
  resetBackendDetection,      // EU6  — clear all caches (tests)
  registerTmuxBackend,        // GU6  — TmuxBackend module hands its class in
  registerITermBackend,       // VU6  — ITermBackend module hands its class in
  markInProcessFallback,      // kU6  — sticky "no pane backend" bit
  isInProcessEnabled,         // ma   — the execution-mode switch
  globalBackendRegistry,      // NS   — the singleton
  getTeammateExecutor,        // NT_  — dispatch entry point
  getResolvedTeammateMode,    // NU6  — "in-process" | "tmux"
  getInProcessBackend,        // S94  — memoized InProcessBackend
  getCachedDetectionResult,   // vU6
  getCachedBackend,           // YeH
  getBackendByType,           // LSH
  ensureBackendsRegistered,   // AeH  — lazy-import backend classes
  detectAndGetBackend,        // jLH  — pane detection tree
  createBackendRegistry,      // y94
};

// Mapping: R94→BackendRegistry (and each line per the comments above)
```

### 3.1 Lazy backend registration

```javascript
// ============================================
// ensureBackendsRegistered - Lazily import TmuxBackend & ITermBackend classes
// Location: cli_inner_pretty.js:380942-380964
// ============================================

// ORIGINAL (for source lookup):
async function AeH(H = NS) {
  if (H.backendsRegistered) return;
  (await Promise.resolve().then(() => (v94(), V94)),
    await Promise.resolve().then(() => (E94(), N94)),
    (H.TmuxBackendClass = NS.TmuxBackendClass),
    (H.ITermBackendClass = NS.ITermBackendClass),
    (H.backendsRegistered = !0));
}
function GU6(H, $ = NS) { $.TmuxBackendClass = H; }
function VU6(H, $ = NS) {
  (N(`[registry] registerITermBackend called, class=${H?.name || "undefined"}`), ($.ITermBackendClass = H));
}
function BW8(H) {
  if (!H.TmuxBackendClass) throw Error("TmuxBackend not registered. Import TmuxBackend.ts before using the registry.");
  return new H.TmuxBackendClass();
}
function h94(H) {
  if (!H.ITermBackendClass) throw Error("ITermBackend not registered. Import ITermBackend.ts before using the registry.");
  return new H.ITermBackendClass();
}

// READABLE (for understanding):
async function ensureBackendsRegistered(reg = globalBackendRegistry) {
  if (reg.backendsRegistered) return;
  await import("./TmuxBackend.js");   // (v94(), V94) — module side-effect calls registerTmuxBackend
  await import("./ITermBackend.js");  // (E94(), N94) — module side-effect calls registerITermBackend
  reg.TmuxBackendClass  = globalBackendRegistry.TmuxBackendClass;
  reg.ITermBackendClass = globalBackendRegistry.ITermBackendClass;
  reg.backendsRegistered = true;
}
function registerTmuxBackend(cls, reg = globalBackendRegistry) { reg.TmuxBackendClass = cls; }
function registerITermBackend(cls, reg = globalBackendRegistry) {
  debugLog(`[registry] registerITermBackend called, class=${cls?.name || "undefined"}`);
  reg.ITermBackendClass = cls;
}
function createTmuxBackendInstance(reg) {
  if (!reg.TmuxBackendClass) throw new Error("TmuxBackend not registered. Import TmuxBackend.ts before using the registry.");
  return new reg.TmuxBackendClass();
}
function createITermBackendInstance(reg) {
  if (!reg.ITermBackendClass) throw new Error("ITermBackend not registered. Import ITermBackend.ts before using the registry.");
  return new reg.ITermBackendClass();
}

// Mapping: AeH→ensureBackendsRegistered, GU6→registerTmuxBackend, VU6→registerITermBackend,
//          BW8→createTmuxBackendInstance, h94→createITermBackendInstance, N→debugLog,
//          V94/N94→TmuxBackend/ITermBackend module namespaces, v94/E94→their init thunks
```

**Why lazy + registration-by-side-effect?** The TmuxBackend and ITermBackend modules call `registerTmuxBackend`/`registerITermBackend` at *import time* (the inverse of the registry importing them), which **breaks a circular dependency**: the backend modules depend on the registry's types and helpers, while the registry needs the backend constructors. By having the backends push their class into the registry on import, the registry never has to statically import them. The lazy `import()` also keeps the (heavy, tmux/iterm2-specific) backend code out of the startup path for users who never spawn a pane teammate.

`ensureBackendsRegistered` never spawns a subprocess and never throws (unlike `detectAndGetBackend`), so it is the cheap option when a caller only needs the *class* (e.g. to reconstruct a backend for `killPane` by stored type via `getBackendByType`).

---

## 4. Pane backend detection: `detectAndGetBackend`

This is the decision tree that picks the *pane* backend (tmux vs iterm2) once the registry has decided it needs cross-process panes. It runs only on the pane path.

```javascript
// ============================================
// detectAndGetBackend - tmux/iTerm2/it2/fallback detection tree (pane mode only)
// Location: cli_inner_pretty.js:380965-381033
// ============================================

// ORIGINAL (for source lookup):
async function jLH(H = NS) {
  if ((await AeH(H), H.cachedDetectionResult))
    return (N(`[BackendRegistry] Using cached backend: ${H.cachedDetectionResult.backend.type}`), H.cachedDetectionResult);
  N("[BackendRegistry] Starting backend detection...");
  let $ = await Ga(), q = h6H();
  if ((N(`[BackendRegistry] Environment: insideTmux=${$}, inITerm2=${q}`), $)) {
    N("[BackendRegistry] Selected: tmux (running inside tmux session)");
    let _ = BW8(H);
    return ((H.cachedBackend = _), (H.cachedDetectionResult = { backend: _, isNative: !0, needsIt2Setup: !1 }),
      SH("swarm_backend_detect"), H.cachedDetectionResult);
  }
  if (q) {
    let _ = w94();
    if (_) N("[BackendRegistry] User prefers tmux over iTerm2, skipping iTerm2 detection");
    else {
      let A = await MG$();
      if ((N(`[BackendRegistry] iTerm2 detected, it2 CLI available: ${A}`), A)) {
        N("[BackendRegistry] Selected: iterm2 (native iTerm2 with it2 CLI)");
        let Y = h94(H);
        return ((H.cachedBackend = Y), (H.cachedDetectionResult = { backend: Y, isNative: !0, needsIt2Setup: !1 }),
          SH("swarm_backend_detect"), H.cachedDetectionResult);
      }
    }
    let z = await kXH();
    if ((N(`[BackendRegistry] it2 not available, tmux available: ${z}`), z)) {
      N("[BackendRegistry] Selected: tmux (fallback in iTerm2, it2 setup recommended)");
      let A = BW8(H);
      return ((H.cachedBackend = A), (H.cachedDetectionResult = { backend: A, isNative: !1, needsIt2Setup: !_ }),
        t$("swarm_backend_detect", _ ? "fallback_to_tmux" : "needs_it2_setup"), H.cachedDetectionResult);
    }
    throw (N("[BackendRegistry] ERROR: iTerm2 detected but no it2 CLI and no tmux"),
      uH("swarm_backend_detect", "iterm2_no_it2_no_tmux"),
      Error("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2"));
  }
  let K = await kXH();
  if ((N(`[BackendRegistry] Not in tmux or iTerm2, tmux available: ${K}`), K)) {
    N("[BackendRegistry] Selected: tmux (external session mode)");
    let _ = BW8(H);
    return ((H.cachedBackend = _), (H.cachedDetectionResult = { backend: _, isNative: !1, needsIt2Setup: !1 }),
      SH("swarm_backend_detect"), H.cachedDetectionResult);
  }
  throw (N("[BackendRegistry] ERROR: No pane backend available"),
    uH("swarm_backend_detect", "no_backend_available"), Error(vT_()));
}

// READABLE (for understanding):
async function detectAndGetBackend(reg = globalBackendRegistry) {
  await ensureBackendsRegistered(reg);
  if (reg.cachedDetectionResult) return reg.cachedDetectionResult;   // detection is fixed for the session

  const insideTmux = await isInsideTmux();   // Ga  — checks ORIGINAL TMUX env captured at load
  const inITerm2   = isInITerm2();           // h6H — TERM_PROGRAM / ITERM_SESSION_ID / env.terminal

  // PRIORITY 1 — already inside a tmux session: always use tmux (native), even within iTerm2.
  if (insideTmux) {
    const backend = createTmuxBackendInstance(reg);
    reg.cachedBackend = backend;
    reg.cachedDetectionResult = { backend, isNative: true, needsIt2Setup: false };
    telemetryOk("swarm_backend_detect");
    return reg.cachedDetectionResult;
  }

  // PRIORITY 2 — inside iTerm2 (and NOT inside tmux):
  if (inITerm2) {
    const preferTmux = getPreferTmuxOverIterm2();            // w94 — user opted out of iTerm2 panes
    if (!preferTmux) {
      const it2Available = await isIt2CliAvailable();        // MG$ — `it2 session list` exit 0
      if (it2Available) {
        const backend = createITermBackendInstance(reg);     // native iTerm2 split panes
        reg.cachedBackend = backend;
        reg.cachedDetectionResult = { backend, isNative: true, needsIt2Setup: false };
        telemetryOk("swarm_backend_detect");
        return reg.cachedDetectionResult;
      }
    }
    // iTerm2 but no usable it2 → tmux fallback if installed.
    const tmuxAvailable = await isTmuxAvailable();           // kXH — `tmux -V` exit 0
    if (tmuxAvailable) {
      const backend = createTmuxBackendInstance(reg);
      reg.cachedBackend = backend;
      reg.cachedDetectionResult = { backend, isNative: false, needsIt2Setup: !preferTmux };
      telemetrySad("swarm_backend_detect", preferTmux ? "fallback_to_tmux" : "needs_it2_setup");
      return reg.cachedDetectionResult;
    }
    // iTerm2, no it2, no tmux → hard error pointing the user at it2 install.
    telemetryBad("swarm_backend_detect", "iterm2_no_it2_no_tmux");
    throw new Error("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2");
  }

  // PRIORITY 3 — neither tmux nor iTerm2: use tmux as an *external* session if installed.
  const tmuxAvailable = await isTmuxAvailable();
  if (tmuxAvailable) {
    const backend = createTmuxBackendInstance(reg);
    reg.cachedBackend = backend;
    reg.cachedDetectionResult = { backend, isNative: false, needsIt2Setup: false };
    telemetryOk("swarm_backend_detect");
    return reg.cachedDetectionResult;
  }

  // No pane backend at all → throw per-OS install help.
  telemetryBad("swarm_backend_detect", "no_backend_available");
  throw new Error(getTmuxInstallInstructions());
}

// Mapping: jLH→detectAndGetBackend, Ga→isInsideTmux, h6H→isInITerm2, w94→getPreferTmuxOverIterm2,
//          MG$→isIt2CliAvailable, kXH→isTmuxAvailable, BW8→createTmuxBackendInstance,
//          h94→createITermBackendInstance, vT_→getTmuxInstallInstructions, SH→telemetryOk,
//          t$→telemetrySad, uH→telemetryBad, N→debugLog
```

**What it does:** Resolves which *pane* backend (tmux or iTerm2) to use, returning `{backend, isNative, needsIt2Setup}` and caching it for the whole session — or throwing actionable install instructions if no pane backend is possible.

**How it works — the priority tree:**
1. **Cache short-circuit.** Detection runs once; the cached `cachedDetectionResult` is reused thereafter. The environment cannot change mid-session (you do not enter/leave tmux without restarting the process), so caching is safe and avoids repeated subprocess probes.
2. **Priority 1 — inside tmux wins unconditionally.** `isInsideTmux` (`Ga`) reads the *original* `TMUX` env var captured at module load (the cross-validated 2.1.88 `detection.ts` comment notes Claude later overrides `TMUX` for its own socket, so the captured value is the trustworthy one). If we are inside tmux, use `TmuxBackend`, `isNative: true` — even when also inside iTerm2. Rationale: a tmux pane is the most reliable, scriptable surface, and you are already in it.
3. **Priority 2 — inside iTerm2.** First honor a user opt-out (`getPreferTmuxOverIterm2`). Otherwise probe the `it2` CLI with `isIt2CliAvailable` — note this uses `it2 session list`, *not* `it2 --version`: the 2.1.88 `detection.ts` comment (lines 111-116) explains that `--version` succeeds even when iTerm2's Python API is disabled, which would make a later `session split` fail with no fallback; `session list` actually exercises the API. If it2 works → native iTerm2 backend. If not, fall back to tmux (marked `isNative: false`, and `needsIt2Setup: !preferTmux` so the user is nudged to install it2 *unless* they already chose to prefer tmux — preventing a re-prompt on every spawn). If neither it2 nor tmux exists → **throw** "iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2".
4. **Priority 3 — neither tmux nor iTerm2.** If tmux is installed, use it in *external session* mode (`isNative: false` — the teammate panes live in a separate tmux session the user is not currently attached to). Otherwise **throw** the per-OS install help from `getTmuxInstallInstructions`.

**Why this ordering (trade-offs):** The tree is ordered by **fidelity of the surface the user is currently looking at**. Being *inside* a pane environment is best (the user sees teammates live, `isNative: true`). iTerm2 native panes are preferred over tmux *inside iTerm2* because they integrate with the GUI the user is already using. tmux-as-fallback keeps the feature working without the ideal surface (`isNative: false`). Throwing — rather than silently degrading to in-process — is deliberate on this path: `detectAndGetBackend` is only reached once the registry has *committed* to pane mode (`isInProcessEnabled` returned false). At that point there is no in-process executor to fall back to within this function; the caller (`getPaneBackendExecutor` → the spawn site) is responsible for catching the throw and calling `markInProcessFallback` to flip the session to in-process for subsequent spawns.

**Telemetry as a decision audit:** every leaf emits a distinct signal — `telemetryOk("swarm_backend_detect")` for the three success leaves, `telemetrySad(..., "fallback_to_tmux"|"needs_it2_setup")` for the degraded iTerm2→tmux leaf, and `telemetryBad(..., "iterm2_no_it2_no_tmux"|"no_backend_available")` for the two throws. This makes the detection outcome distribution observable in aggregate without reading logs.

### 4.1 The per-OS install help and explicit type selection

```javascript
// ============================================
// getTmuxInstallInstructions / getBackendByType - install help + explicit backend ctor
// Location: cli_inner_pretty.js:381034-381062
// ============================================

// ORIGINAL (for source lookup):
function vT_() {
  switch (n$()) {
    case "macos":
      return `To use agent swarms, install tmux:\n  brew install tmux\nThen start a tmux session with: tmux new-session -s claude`;
    case "linux":
    case "wsl":
      return `To use agent swarms, install tmux:\n  sudo apt install tmux    # Ubuntu/Debian\n  sudo dnf install tmux    # Fedora/RHEL\nThen start a tmux session with: tmux new-session -s claude`;
    case "windows":
      return `To use agent swarms, you need tmux which requires WSL (Windows Subsystem for Linux).\nInstall WSL first, then inside WSL run:\n  sudo apt install tmux\nThen start a tmux session with: tmux new-session -s claude`;
    default:
      return `To use agent swarms, install tmux using your system's package manager.\nThen start a tmux session with: tmux new-session -s claude`;
  }
}
function LSH(H, $ = NS) {
  switch (H) {
    case "tmux": return BW8($);
    case "iterm2": return h94($);
  }
}

// READABLE (for understanding):
function getTmuxInstallInstructions() {
  switch (getPlatform()) {                 // n$ → "macos" | "linux" | "wsl" | "windows" | default
    case "macos":          return "...brew install tmux...";
    case "linux": case "wsl": return "...sudo apt install tmux / sudo dnf install tmux...";
    case "windows":        return "...tmux requires WSL...";
    default:               return "...install tmux using your system's package manager...";
  }
}
function getBackendByType(type, reg = globalBackendRegistry) {
  switch (type) {
    case "tmux":   return createTmuxBackendInstance(reg);
    case "iterm2": return createITermBackendInstance(reg);
  }
}

// Mapping: vT_→getTmuxInstallInstructions, n$→getPlatform, LSH→getBackendByType,
//          BW8→createTmuxBackendInstance, h94→createITermBackendInstance
```

`getBackendByType` (`LSH`) is the no-detection path: given a stored `"tmux"|"iterm2"` type it constructs the class directly (after `ensureBackendsRegistered`). It exists so cleanup paths can reconstruct a backend purely from a persisted `backendType` to kill a pane, without re-running environment detection.

---

## 5. `isInProcessEnabled` — the in-process-vs-cross-process switch (the core algorithm)

This is the single most important algorithm in the module. Everything above feeds into it; everything below dispatches on its result.

```javascript
// ============================================
// isInProcessEnabled - Decide in-process vs pane execution for the current spawn
// Location: cli_inner_pretty.js:381073-381090
// ============================================

// ORIGINAL (for source lookup):
function kT_() { return JSH(); }
function ma(H = NS) {
  if (R6()) return (N("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0);
  let $ = kT_(), q;
  if ($ === "in-process") q = !0;
  else if ($ === "tmux") q = !1;
  else {
    if (H.inProcessFallbackActive)
      return (N("[BackendRegistry] isInProcessEnabled: true (fallback after pane backend unavailable)"), !0);
    let K = MhH(), _ = h6H();
    q = !K && !_;
  }
  return (N(`[BackendRegistry] isInProcessEnabled: ${q} (mode=${$}, insideTmux=${MhH()}, inITerm2=${h6H()})`), q);
}

// READABLE (for understanding):
function getTeammateModeSnapshotInternal() { return getTeammateModeFromSnapshot(); }   // kT_

function isInProcessEnabled(reg = globalBackendRegistry) {
  // GUARD 0 — non-interactive (`-p` / print mode): tmux panes make no sense without a TTY UI.
  if (isNonInteractiveSession()) return true;

  const mode = getTeammateModeSnapshotInternal();   // "auto" | "tmux" | "in-process"
  let enabled;

  if (mode === "in-process") {
    enabled = true;                                  // explicit user choice
  } else if (mode === "tmux") {
    enabled = false;                                 // explicit user choice → always pane
  } else {
    // mode === "auto":
    // STICKY FALLBACK — a prior pane spawn failed (no tmux/it2). Stay in-process so the
    // banner/teams UI reflect reality and we don't keep retrying a dead pane path.
    if (reg.inProcessFallbackActive) return true;
    // Otherwise: use a pane backend IFF we are already inside a pane environment.
    const insideTmux = isInsideTmuxSync();           // MhH — sync, reads captured TMUX
    const inITerm2   = isInITerm2();                 // h6H
    enabled = !insideTmux && !inITerm2;              // in-process unless inside tmux/iTerm2
  }
  return enabled;
}

// Mapping: ma→isInProcessEnabled, kT_→getTeammateModeSnapshotInternal, JSH→getTeammateModeFromSnapshot,
//          R6→isNonInteractiveSession, MhH→isInsideTmuxSync, h6H→isInITerm2, N→debugLog
```

**What it does:** Returns `true` if the *next* teammate spawn should run in-process, `false` if it should run in a tmux/iTerm2 pane. It is pure given (a) the session-frozen `teammateMode`, (b) the runtime environment, (c) the sticky fallback bit — and it does **not** itself launch anything.

**How it works — the four-branch decision, in priority order:**

1. **Guard 0: non-interactive session.** `isNonInteractiveSession` (`R6` @`2742`, = `!state.isInteractive`) is checked *first, before even reading the mode*. In `-p`/print mode there is no terminal UI, so spawning tmux/iTerm2 panes is meaningless — you would create panes nobody is attached to. Forcing in-process here is unconditional and beats even an explicit `teammateMode: "tmux"`. This is the highest-priority rule.
2. **Branch A: `mode === "in-process"`.** The user explicitly forced in-process → `true`. No environment probing.
3. **Branch B: `mode === "tmux"`.** The user explicitly forced panes → `false`. No environment probing. (Note: "tmux" here is the user-facing label for *pane mode*; the actual pane backend chosen by `detectAndGetBackend` could still resolve to iTerm2 if that is the native surface — the setting expresses "panes, not in-process," and detection picks the concrete pane backend.)
4. **Branch C: `mode === "auto"` (default).** Two sub-rules:
   - **C1 — sticky fallback.** If `inProcessFallbackActive` is set (a prior pane spawn failed because no tmux/it2 was available, see §4 and §7), return `true` immediately. This bit is checked *only* in auto mode — that is deliberate (see "Why" below).
   - **C2 — environment probe.** Otherwise, use a pane backend **iff we are already inside a pane environment**: `enabled = !insideTmux && !inITerm2`. If you launched `claude` from inside tmux or iTerm2, auto mode puts teammates in panes (so you see them live); if you launched from a plain terminal, auto mode keeps them in-process (no surprise pane windows). The probes are the *sync* variants (`isInsideTmuxSync`, `isInITerm2`) because this function is called synchronously on the hot spawn path.

**Why this approach (design rationale & alternatives):**
- **Why guard non-interactive first?** It is an environment invariant that overrides intent: even a user who configured `"tmux"` cannot get useful panes in `-p` mode. Checking it before reading the mode keeps the rest of the logic from having to special-case it. The alternative — letting `"tmux"` win and then failing at spawn — would produce a confusing error in scripted/CI contexts where agent teams are most likely used headlessly.
- **Why a sticky fallback bit, and why only in auto mode?** Auto mode's whole promise is "do the right thing without configuration." If the user is inside iTerm2 but has neither it2 nor tmux, auto mode would otherwise pick pane mode (because `!insideTmux && !inITerm2` is false), then `detectAndGetBackend` would throw. The sticky bit lets the *first* failed pane spawn permanently degrade the session to in-process, so the teams UI, banner, and subsequent spawns are consistent instead of repeatedly throwing. Crucially it is scoped to auto so that a user who *explicitly* sets `"tmux"` mid-session still gets pane mode honored (Branch B is checked before C1) — i.e. an explicit choice is never silently overridden by a stale fallback bit. This is the subtle correctness property the 2.1.88 comment (registry.ts:369-371) calls out verbatim.
- **Why environment-based auto rather than capability-based?** The decision is based on *where you launched from* (inside a pane env or not), not *what is installed*. This matches user expectation: if you are in tmux you want panes; if you are in a bare shell you do not want Claude spawning tmux sessions you cannot see. A capability-based rule ("use panes if tmux is installed") would spawn invisible external tmux sessions for plain-terminal users — surprising and easy to leak.

**Key insight:** `isInProcessEnabled` is **cheap, synchronous, and side-effect-free** (it only reads a frozen snapshot, two cached sync probes, and one boolean). The expensive, throwing, subprocess-spawning work (`detectAndGetBackend`) is deferred to *after* this returns `false`. So the common in-process path never touches tmux/iterm2 detection at all. The mode decision and the backend detection are two cleanly separated phases: **(1) should this be a pane at all? (2) if so, which pane backend?**

### 5.1 `getResolvedTeammateMode` — the "what auto actually resolves to" helper

```javascript
// ============================================
// getResolvedTeammateMode - Collapse "auto" into the concrete mode for display/telemetry
// Location: cli_inner_pretty.js:381091-381093
// ============================================

// ORIGINAL (for source lookup):
function NU6(H = NS) {
  return ma(H) ? "in-process" : "tmux";
}

// READABLE (for understanding):
function getResolvedTeammateMode(reg = globalBackendRegistry) {
  // Unlike getTeammateModeFromSnapshot (which may return "auto"), this returns the
  // concrete mode the environment resolves to right now.
  return isInProcessEnabled(reg) ? "in-process" : "tmux";
}

// Mapping: NU6→getResolvedTeammateMode, ma→isInProcessEnabled
```

This is the value surfaced to telemetry and UI — e.g. `tengu_team_created` is logged with `teammate_mode: getResolvedTeammateMode()` (`cli_inner_pretty.js:406728`). It exists because `"auto"` is meaningless in a report; callers want the *effective* mode, and `isInProcessEnabled` already encodes that resolution.

---

## 6. Dispatch: `getTeammateExecutor` and the two memoized executors

```javascript
// ============================================
// getTeammateExecutor / getInProcessBackend / getPaneBackendExecutor - executor dispatch
// Location: cli_inner_pretty.js:381094-381109
// ============================================

// ORIGINAL (for source lookup):
function S94(H = NS) {
  if (!H.cachedInProcessBackend) H.cachedInProcessBackend = _94();
  return H.cachedInProcessBackend;
}
async function NT_(H = !1, $ = NS) {
  if (H && ma($)) return (N("[BackendRegistry] Using in-process executor"), S94($));
  return (N("[BackendRegistry] Using pane backend executor"), ET_($));
}
async function ET_(H) {
  if (!H.cachedPaneBackendExecutor) {
    let $ = await jLH(H);
    ((H.cachedPaneBackendExecutor = P94($.backend)),
      N(`[BackendRegistry] Created PaneBackendExecutor wrapping ${$.backend.type}`));
  }
  return H.cachedPaneBackendExecutor;
}

// READABLE (for understanding):
function getInProcessBackend(reg = globalBackendRegistry) {
  if (!reg.cachedInProcessBackend) reg.cachedInProcessBackend = createInProcessBackend();  // _94 → new K94()
  return reg.cachedInProcessBackend;
}
async function getTeammateExecutor(preferInProcess = false, reg = globalBackendRegistry) {
  // Hand back the in-process executor ONLY when the caller asked for it AND the
  // mode switch agrees it's enabled; otherwise fall through to the pane executor.
  if (preferInProcess && isInProcessEnabled(reg)) return getInProcessBackend(reg);
  return getPaneBackendExecutor(reg);
}
async function getPaneBackendExecutor(reg = globalBackendRegistry) {
  if (!reg.cachedPaneBackendExecutor) {
    const detection = await detectAndGetBackend(reg);                 // may throw if no pane backend
    reg.cachedPaneBackendExecutor = createPaneBackendExecutor(detection.backend);  // P94 → new L94(backend)
  }
  return reg.cachedPaneBackendExecutor;
}

// Mapping: NT_→getTeammateExecutor, S94→getInProcessBackend, _94→createInProcessBackend,
//          ET_→getPaneBackendExecutor, P94→createPaneBackendExecutor, jLH→detectAndGetBackend,
//          ma→isInProcessEnabled, N→debugLog
```

**What it does:** `getTeammateExecutor` is the one function every spawn-site calls. It returns a `TeammateExecutor` — either the in-process backend or a pane-backed executor — that the caller then `.setContext(...)`s and `.spawn(...)`s, without ever branching on mode itself.

**How it works (step by step):**
1. The caller passes `preferInProcess`. A spawn-site that *can* use either mode passes `true`; a spawn-site that must use a pane (rare) passes `false`.
2. The guard is `preferInProcess && isInProcessEnabled(reg)`. Both must hold to get the in-process executor. So `preferInProcess` is a *request*, and `isInProcessEnabled` is the *veto*: if the mode switch says pane (`false`), the in-process request is ignored and we fall through.
3. In-process path: `getInProcessBackend` memoizes a single `InProcessBackend` (`K94`) on `cachedInProcessBackend`. One instance per process; it manages all in-process teammates by their task IDs.
4. Pane path: `getPaneBackendExecutor` memoizes a single `PaneBackendExecutor` (`L94`) on `cachedPaneBackendExecutor`, created by first running `detectAndGetBackend` (which can throw — see §4/§7) and wrapping the resulting concrete pane backend. The executor is created once and reused for all pane teammates.

**Why memoize both?** A team can have many teammates; constructing a new executor per spawn would lose the per-executor state that matters — for `PaneBackendExecutor`, the `spawnedTeammates` map and the single cleanup hook (`$7`/exit handler) registered on first spawn; for `InProcessBackend`, the shared `context`. Memoization makes "the executor" a stable per-process object that owns the team's panes/tasks.

**Why is the in-process executor returned *without* detection but the pane executor requires it?** In-process needs nothing from the environment (`InProcessBackend.isAvailable()` is hard-coded `true` @`380068`), so it is free. The pane executor must know which backend to wrap, hence detection. This asymmetry is exactly why `isInProcessEnabled` short-circuits before detection: the cheap path stays cheap.

### 6.1 `markInProcessFallback` — flipping the session after a pane failure

```javascript
// ============================================
// markInProcessFallback - Sticky bit: a pane spawn failed → force in-process (auto mode)
// Location: cli_inner_pretty.js:381070-381072
// ============================================

// ORIGINAL (for source lookup):
function kU6(H = NS) {
  (N("[BackendRegistry] Marking in-process fallback as active"), (H.inProcessFallbackActive = !0));
}

// READABLE (for understanding):
function markInProcessFallback(reg = globalBackendRegistry) {
  reg.inProcessFallbackActive = true;   // read by isInProcessEnabled (auto mode only)
}

// Mapping: kU6→markInProcessFallback
```

The spawn site that catches a `detectAndGetBackend` throw calls `markInProcessFallback`, after which `isInProcessEnabled` (auto mode) returns `true` and subsequent spawns short-circuit to in-process — the environment will not change mid-session, so retrying the pane path is pointless. `resetBackendDetection` (`EU6` @`381110`) clears this bit (and all caches) — used by tests.

---

## 7. The `TeammateExecutor` interface (implemented by BOTH backends)

Both `InProcessBackend` (`K94`) and `PaneBackendExecutor` (`L94`) implement an identical method surface so the dispatch in §6 is mode-agnostic:

- `type` — `"in-process"` (`cli_inner_pretty.js:380063`) vs the wrapped pane backend's `type` (`this.type = backend.type`, `cli_inner_pretty.js:380395`).
- `setContext(ctx)` — store the `ToolUseContext` needed to spawn (`cli_inner_pretty.js:380065` / `380397`). Both throw a "Call setContext() before spawn()" error if `spawn` runs without it (`cli_inner_pretty.js:380078` / `380409`).
- `isAvailable()` — in-process: always `true` (`cli_inner_pretty.js:380068`); pane: delegates to `backend.isAvailable()` (`cli_inner_pretty.js:380400`).
- `spawn(opts)` → `{success, agentId, taskId?, abortController?, error?, paneId?}` — in-process at `cli_inner_pretty.js:380071`; pane at `cli_inner_pretty.js:380403`.
- `sendMessage(agentId, {text, from, color, timestamp})` — **both write to the shared file mailbox** via `writeToMailbox` (`aA`): in-process `cli_inner_pretty.js:380131`, pane `cli_inner_pretty.js:380467`. This is why messaging is mode-agnostic.
- `terminate(agentId, reason)` — graceful shutdown: in-process builds a shutdown message and calls `requestTeammateShutdown` (`cli_inner_pretty.js:380134-380149`); pane writes a `shutdown_request` to the mailbox (`cli_inner_pretty.js:380470-380480`).
- `kill(agentId)` — hard kill: in-process aborts the task via `killInProcessTeammate` (`cli_inner_pretty.js:380151-380158`); pane kills the OS pane via `backend.killPane` (`cli_inner_pretty.js:380482-380490`).
- `isActive(agentId)` — in-process: task `status === "running" && !aborted` (`cli_inner_pretty.js:380160-380169`); pane: presence in the `spawnedTeammates` map (`cli_inner_pretty.js:380492-380495`).

The factories are `createInProcessBackend` (`_94` @`380172`, `new K94()`) and `createPaneBackendExecutor` (`P94` @`380498`, `new L94(backend)`).

The headline contrast between the two `spawn` implementations is what they *launch*:
- **In-process `spawn`** calls `spawnInProcessTeammate` then fires `startInProcessTeammate` — the teammate is an async task inside this process (detailed in `in_process_mode.md`). It returns a `taskId` + `abortController` (no `paneId`).
- **Pane `spawn`** (`cli_inner_pretty.js:380403-380460`) builds a full shell command — `cd <cwd> && env <env-string> <execPath> --agent-id ... --agent-name ... --team-name ...` — and **types it into a freshly-created pane** via `backend.sendCommandToPane`, launching an entirely separate `claude` OS process. It returns a `paneId` (no `taskId`/`abortController`). Those `--agent-id`/`--agent-name`/`--team-name` flags are precisely what makes `isTeammate()` (§1) report `true` in the child via the static team-context path. (Full pane spawn covered in `cross_process_mode.md`.)

---

## 8. End-to-end decision & dispatch diagram

```
                          ┌─────────────────────────────────────────────┐
                          │  isAgentTeamsEnabled (R7 @240766)            │
                          │  env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS    │
                          │  OR --agent-teams   AND  GrowthBook          │
                          │  tengu_amber_flint                            │
                          └───────────────────────┬─────────────────────┘
                                       false ┌────┴────┐ true
                                  (feature off)         │  TeamCreate / spawn site calls:
                                                        ▼
                          getTeammateExecutor(preferInProcess=true, reg=NS)   NT_ @381098
                                                        │
                                                        ▼
                               preferInProcess && isInProcessEnabled(reg)?   ma @381076
                                                        │
                ┌───────────────────────────────────────┴───────────────────────────────────┐
                │ isInProcessEnabled algorithm (ma):                                          │
                │   0. isNonInteractiveSession (R6)?            → TRUE  (force in-process)     │
                │   mode = getTeammateModeFromSnapshot (JSH):                                  │
                │   A. "in-process"                              → TRUE                        │
                │   B. "tmux"                                    → FALSE (pane)                │
                │   C. "auto":                                                                 │
                │        C1. reg.inProcessFallbackActive?        → TRUE                        │
                │        C2. !insideTmux(MhH) && !inITerm2(h6H)  → TRUE if bare terminal       │
                │                                                → FALSE if inside a pane env  │
                └───────────────────────────┬───────────────────────────┬─────────────────────┘
                                       TRUE  │                           │  FALSE
                                             ▼                           ▼
                            getInProcessBackend (S94 @381094)   getPaneBackendExecutor (ET_ @381102)
                            memoize new InProcessBackend (K94)            │
                                             │                           ▼
                                             │              detectAndGetBackend (jLH @380965)
                                             │              ┌──────────────────────────────────┐
                                             │              │ 1. insideTmux  → TmuxBackend       │
                                             │              │ 2. inITerm2    → it2? ITermBackend │
                                             │              │                  else tmux fallback│
                                             │              │                  else THROW(it2)   │
                                             │              │ 3. neither     → tmux external     │
                                             │              │                  else THROW(vT_)   │
                                             │              └──────────────┬───────────────────┘
                                             │                       success │  THROW
                                             │                              ▼      │
                                             │       memoize PaneBackendExecutor    │ caller catches →
                                             │       (L94) wrapping the backend     │ markInProcessFallback (kU6)
                                             │                              │       │ → next spawn goes in-process
                                             ▼                              ▼       ▼
                                  ┌─────────────────────────────────────────────────────────┐
                                  │  TeammateExecutor  (same interface, either backend)       │
                                  │  setContext → isAvailable → spawn → sendMessage           │
                                  │  → terminate → kill → isActive                            │
                                  │                                                          │
                                  │  spawn(in-process): async task in THIS process           │
                                  │  spawn(pane): cd&&env claude --agent-id...  in a pane     │
                                  │  BOTH: sendMessage = writeToMailbox (aA @338306)          │
                                  └─────────────────────────────────────────────────────────┘
```

---

## 9. Is coordinator mode live in 2.1.156? (investigation)

The dossier flagged `coordinatorMode` (`cI` @`216440`, env `CLAUDE_CODE_COORDINATOR_MODE`) for a live/dead determination. **Finding: coordinator mode is LIVE in 2.1.156, but it is a *separate* feature from the agent-team execution-mode split and does not participate in `isInProcessEnabled`.**

Evidence (all in `cli_inner_pretty.js`):

```javascript
// ============================================
// coordinatorMode gate - LIVE in 2.1.156 (distinct from swarm execution modes)
// Location: cli_inner_pretty.js:216440-216465
// ============================================

// ORIGINAL (for source lookup):
function cI() {                                  // @216440
  if (!xH(process.env.CLAUDE_CODE_COORDINATOR_MODE)) return !1;
  if (zT() && !d6() && !xH(process.env.CLAUDE_CODE_REMOTE)) return !1;
  return !0;
}
// ... var Bx export map (@216449) + fk5 omitted ...
function Bp() { return cI(); }                   // @216460 isCoordinatorMode
function Mk5() { return Bp() && !1; }            // @216463 isCcrCoordinator — always false

// READABLE (for understanding):
function coordinatorModeRaw() {
  if (!isTruthy(process.env.CLAUDE_CODE_COORDINATOR_MODE)) return false;
  // interactive AND not a fork AND not remote → not coordinator
  if (isInteractive() && !isForkSession() && !isTruthy(process.env.CLAUDE_CODE_REMOTE)) return false;
  return true;
}
function isCoordinatorMode() { return coordinatorModeRaw(); }
function isCcrCoordinator() { return isCoordinatorMode() && false; }   // hard-disabled

// Mapping: cI→coordinatorModeRaw, Bp→isCoordinatorMode, Mk5→isCcrCoordinator, zT→isInteractive, xH→isTruthy
```

`isCoordinatorMode` (`Bp`) is referenced at numerous live call sites — tool-set assembly (`cli_inner_pretty.js:409418`, `409423`), system-prompt selection (`cli_inner_pretty.js:516604`), session-mode telemetry tagging (`cli_inner_pretty.js:599036`, `641647`, `641804`, `646125`), and the resume-time `matchSessionMode` reconciler (`cli_inner_pretty.js:599012`, `628728`, `634601`, `641623`, `641782`). The env var name is also in the passthrough/role-config lists (`cli_inner_pretty.js:336442`, `560867`) and the analytics payload exposes `is_coordinator` (`cli_inner_pretty.js:646503`).

**Why it is out of scope here:** coordinator mode is a **session role** — a `claude` process that addresses the *user* through a comms-roled MCP server and runs a coordinator-specific system prompt (`getCoordinatorSystemPrompt`, `Dk5` @`216506`). It governs *prompt/tooling/role*, not *how teammates are executed*. The agent-team execution-mode decision (`isInProcessEnabled`) never reads `CLAUDE_CODE_COORDINATOR_MODE`, and `isCoordinatorMode` is in an entirely different module (`Bx` @`216449`) from the BackendRegistry (`R94` @`380912`). The only piece that is genuinely dead is the **CCR** sub-variant: `isCcrCoordinator` (`Mk5`) is `Bp() && false` — permanently `false`. **Cross-version note:** this is the same coordinator mode v2.1.88 shipped in `coordinator/coordinatorMode.ts`; it was *absent* in v2.1.142 (a grep of the v2.1.142 bundle returns zero hits for `CLAUDE_CODE_COORDINATOR_MODE` / `tengu_coordinator_mode_switched` / `getCoordinatorAgents`) and **re-introduced** in the v2.1.143 → v2.1.156 window. So the v2.1.142 doc's "coordinator mode was removed" claim was correct *for v2.1.142*; what changed by v2.1.156 is a revival, not a correction. See [`cross_validation.md`](./cross_validation.md#coordinator-mode-live-or-dead) for the full cross-version evidence.

---

## Cross-Validation (v2.1.88)

The cleanest readable precursor is the named TypeScript under `/lyz/codespace/3rd/claude-code/src/utils/swarm/backends/`. The 2.1.156 bundle is an almost **byte-identical** evolution of this code; the only structural change is that the registry's session state was lifted from module-level `let` variables into a passed-in registry object.

**`registry.ts` (byte-identical logic, evolved state-holding):**
- `isInProcessEnabled` @`registry.ts:351` matches `ma` @`cli_inner_pretty.js:381076` branch-for-branch: the non-interactive guard (`getIsNonInteractiveSession()` ↔ `R6()`), the in-process/tmux explicit branches, the auto-mode `inProcessFallbackActive` short-circuit, and the final `!insideTmux && !inITerm2`. The 2.1.88 comment at lines 369-371 ("scoped to auto mode only so a mid-session Settings change to explicit 'tmux' still takes effect") is the literal rationale for why the fallback bit is read only in the auto branch.
- `detectAndGetBackend` @`registry.ts:136` matches `jLH` @`cli_inner_pretty.js:380965` priority-for-priority, including the exact throw strings ("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2") and the `needsIt2Setup: !preferTmux` nuance.
- `getTmuxInstallInstructions` @`registry.ts:259` ↔ `vT_` @`381034`: identical per-OS text including the `agent swarms` wording (confirming the "swarm" naming).
- `getTeammateExecutor` @`registry.ts:425`, `getInProcessBackend` @`registry.ts:404`, `getPaneBackendExecutor` @`registry.ts:442`, `getResolvedTeammateMode` @`registry.ts:396`, `markInProcessFallback` @`registry.ts:326`, `getBackendByType` @`registry.ts:295`, `getCachedBackend` @`registry.ts:308`, `getCachedDetectionResult` @`registry.ts:317`, `registerTmuxBackend` @`registry.ts:85`, `registerITermBackend` @`registry.ts:93`, `ensureBackendsRegistered` @`registry.ts:74`, `resetBackendDetection` @`registry.ts:457` — all map one-to-one to the obfuscated functions with identical bodies.
- **Evolution:** 2.1.88 holds `cachedBackend`, `cachedDetectionResult`, `inProcessFallbackActive`, etc. as 8 module-level `let`s (`registry.ts:26-66`). 2.1.156 packs the same 8 fields into the object returned by `createBackendRegistry` (`y94` @`380930`) and threads it as the trailing `reg = NS` parameter. Functionally equivalent; the object form makes the registry unit-testable against a fresh instance and is the only meaningful structural delta.

**`teammateModeSnapshot.ts` (byte-identical):** `setCliTeammateModeOverride` @`25`, `getCliTeammateModeOverride` @`33`, `clearCliTeammateModeOverride` @`43`, `captureTeammateModeSnapshot` @`56`, `getTeammateModeFromSnapshot` @`75` map exactly to `LT_`/`XU6`/`LU6`/`D94`/`JSH`. The lone difference: 2.1.88 reads `getGlobalConfig().teammateMode ?? 'auto'`, while 2.1.156's `D94` reads `Q1("teammateMode","auto").value` — a config-getter wrapper returning `{value, source}` rather than a plain field access. Same precedence (CLI override > config > "auto") and the same init-bug `logError` + lazy-capture safety net.

**`detection.ts` (byte-identical):** `isInsideTmuxSync` @`36` ↔ `MhH`, `isInsideTmux` @`50` ↔ `Ga` (both cache and read the *original* captured `TMUX`), `isInITerm2` @`90` ↔ `h6H` (same three indicators: `TERM_PROGRAM === "iTerm.app"`, `ITERM_SESSION_ID`, `env.terminal`), `isTmuxAvailable` @`73` ↔ `kXH` (`tmux -V`), `isIt2CliAvailable` @`117` ↔ `MG$` (uses `it2 session list`, with the @111-116 comment explaining why `--version` is insufficient), `IT2_COMMAND = 'it2'` @`109` ↔ `GsH = "it2"` @`336209`.

**`types.ts` (logic-identical, interface evolved):** `isPaneBackend` @`types.ts:309` (`type === 'tmux' || type === 'iterm2'`) corresponds to the inline `OhH` helper @`cli_inner_pretty.js:336134` (same predicate). The `TeammateExecutor` type @`types.ts:279-300` declares `type/isAvailable/spawn/sendMessage/terminate/kill/isActive` but — as in 2.1.156 — `setContext` is present in the *implementations* (`InProcessBackend.setContext` @`InProcessBackend.ts:51`, `PaneBackendExecutor.setContext` @`PaneBackendExecutor.ts:62`) even though the type does not formally list it. The 2.1.156 classes `K94`/`L94` implement the same 8-method surface including `setContext`, so behavior is byte-faithful.

**Delta vs the v2.1.142 analysis tree:** the v2.1.142 `30_agent_team/` module framed teammate execution around *task taxonomy* (`teammate_runner_loop.md`, `task_taxonomy.md`) and a `coordinator_process_model.md`, but it has **no** document describing a BackendRegistry, an `isInProcessEnabled` switch, or a tmux/iTerm2 `PaneBackend` split (a repository grep finds the registry symbols only in an unrelated `teammateMode` mention in `permission_inheritance.md:308`). This v2.1.156 doc therefore reframes the subsystem around the **executor split** the registry encodes. Whether the registry code existed unanalyzed in the 2.1.142 bundle or is newer cannot be asserted from the 2.1.142 *analysis* alone — but the 2.1.88 named TS already contains the full registry, so the BackendRegistry/PaneBackend design is at least as old as ~2.1.83–88 and the 2.1.156 form is its faithful continuation.

> Note on the daemon/background-agent fleet contrast (out of scope here): the background-agent fleet (`36_background_agents/`) is a *different* worker model — daemon-supervised child processes that outlive the REPL — whereas agent-team teammates are leader-owned and die with the leader (in-process tasks) or are leader-spawned panes. They share neither the BackendRegistry nor the in-process/pane executor split.

---

## See Also

Sibling documents in this module (`30_agent_team/`):
- [README.md](./README.md) — module overview & navigation.
- [execution_modes_and_backend_registry.md](./execution_modes_and_backend_registry.md) — this document (the core: mode decision + registry).
- [in_process_mode.md](./in_process_mode.md) — `InProcessBackend`, `spawnInProcessTeammate`, the agent + 500ms poll loop, ALS identity isolation.
- [cross_process_mode.md](./cross_process_mode.md) — `PaneBackendExecutor`, `TmuxBackend`/`ITermBackend`, CLI/env command builders, it2 setup.
- [mailbox_and_lifecycle_tools.md](./mailbox_and_lifecycle_tools.md) — the file mailbox IPC, TeamCreate/TeamDelete/SendMessage tools, the leader↔teammate permission bridge.
- [cross_validation.md](./cross_validation.md) — full obfuscated→v2.1.88 symbol mapping for the module.
