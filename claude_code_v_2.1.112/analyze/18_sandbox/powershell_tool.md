# PowerShell Tool — Progressive Rollout & Permission Hardening

> Captures the **2.1.111** PowerShell tool rollout (`CLAUDE_CODE_USE_POWERSHELL_TOOL` env var, Windows default-on, Linux/macOS opt-in with `pwsh`) and the earlier **2.1.89/2.1.90** permission hardening that prepared the tool for general availability.

---

## Why a Dedicated PowerShell Tool?

By v2.1.88 the PowerShell tool was implemented but **shipped behind a feature flag**. The decision came from two observations:

1. **Native Windows users were forced into Bash semantics.** Even with Git for Windows or WSL, every command went through Bash quoting, Bash glob expansion, and Bash safety regex — semantically incorrect for a PowerShell-native developer's mental model.
2. **PowerShell has fundamentally different security primitives.** PS objects vs. strings, calling conventions like `Set-ItemProperty` vs. `chmod`, and sub-expressions like `$(...)` and `@(...)` need a separate validator. Shoehorning them into Bash's regex-based validator left holes.

The 2.1.89 and 2.1.90 hardening fixed those holes; 2.1.111 turned on the gate by default for Windows ant users and opened opt-in for everyone else.

---

## The Runtime Gate

### `isPowerShellToolEnabled` (2.1.111)

```javascript
// ============================================
// isPowerShellToolEnabled - Runtime gate for PowerShellTool
// Location: chunks.84.mjs:2952-2959
// ============================================

// ORIGINAL (for source lookup):
function ly6() {
    let q = process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL;
    if (y1() !== "windows") return S6(q);
    if (S6(q)) return !0;
    if (c5(q)) return !1;
    return u8("tengu_cobalt_ridge", !1)
}

// READABLE (for understanding):
function isPowerShellToolEnabled() {
  const envValue = process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL;
  // Non-Windows: opt-in only. Requires explicit truthy env value.
  if (getPlatform() !== "windows") {
    return parseExplicitTrue(envValue);
  }
  // Windows: respect explicit env value first.
  if (parseExplicitTrue(envValue)) return true;
  if (parseExplicitFalse(envValue)) return false;
  // Windows fallback: Statsig gate (server-side cohort selection).
  return getFeatureFlag("tengu_cobalt_ridge", false);
}

// Mapping: ly6→isPowerShellToolEnabled, y1→getPlatform, S6→parseExplicitTrue,
//          c5→parseExplicitFalse, u8→getFeatureFlag
```

### v2.1.88 Source Equivalent (already existed in source form)

In v2.1.88 (`src/utils/shell/shellToolUtils.ts:17-22`):

```typescript
export function isPowerShellToolEnabled(): boolean {
  if (getPlatform() !== 'windows') return false
  return process.env.USER_TYPE === 'ant'
    ? !isEnvDefinedFalsy(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL)
    : isEnvTruthy(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL)
}
```

Notice the v2.1.88 → v2.1.112 differences:

1. **Linux/macOS gained opt-in** (`return parseExplicitTrue(envValue)` for non-Windows in v2.1.112) — the v2.1.88 source short-circuited to `false`.
2. **The `USER_TYPE === 'ant'` cohort branching was replaced by a Statsig gate** (`tengu_cobalt_ridge`) — server-side rollout instead of a static check. This is the "progressively rolling out" mechanism the changelog refers to.
3. **Explicit env value always wins.** Even on Windows, `CLAUDE_CODE_USE_POWERSHELL_TOOL=0` overrides the Statsig gate. This is how users opt out of an unwanted rollout.

### Decision Algorithm

**What it does:** Resolves whether the PowerShell tool is exposed to the model for this session.

**How it works:**

1. Read `CLAUDE_CODE_USE_POWERSHELL_TOOL` from process env.
2. If platform is not Windows:
   - If env value is explicitly truthy (`"1"`, `"true"`, etc.) → enable.
   - Otherwise → disable. Requires `pwsh` on PATH for runtime success.
3. If platform is Windows:
   - If env value is explicitly truthy → enable (overrides Statsig).
   - If env value is explicitly falsy (`"0"`, `"false"`) → disable (overrides Statsig).
   - Otherwise → consult `tengu_cobalt_ridge` Statsig gate. This is the cohort that Anthropic gradually expands.

**Why this approach:**

- **Explicit-wins ordering.** Without the truthy check before the falsy check, a user couldn't force-enable on Windows when their cohort hadn't rolled out yet. Without the explicit-falsy check before Statsig, an annoyed user couldn't quickly opt out. Both directions must override the gate.
- **Linux/macOS opt-in.** PowerShell on Linux requires `pwsh` (PowerShell Core) on PATH. Adding the tool by default would surface "command not found" errors to users without `pwsh` installed. Opt-in lets the team document the requirement.
- **Statsig instead of cohort branching.** Earlier versions used `USER_TYPE === 'ant'` to bound the rollout to internal users. Moving to Statsig allows Anthropic to expand the cohort (1% → 10% → 50% → 100%) without shipping a new binary.

**Key insight:** This is a **three-stage rollout pattern** — explicit-opt-in (Linux/macOS), platform default + Statsig (Windows), explicit-override (always). The same shape is reusable for any progressively rolling-out feature.

---

## Tool Visibility Wiring

The gate is consulted in two places:

```javascript
// chunks.164.mjs:2901 — tool-list assembly for permission warnings
let v = S6(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL)
       || iR(_ ?? []).map(i0).includes(I5)
       || O.some((C) => h2(C).toolName === I5)
       || D.some((C) => C.toolName === I5)
       || W.some((C) => C.ruleValue.toolName === I5);
if (y1() === "windows" && f && !v) w = [...w, I5];

// READABLE:
const powerShellAllowed = parseExplicitTrue(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL)
  || iR(args ?? []).map(parseRule).includes(POWERSHELL_TOOL_NAME)
  || allowRules.some(r => parseRule(r).toolName === POWERSHELL_TOOL_NAME)
  || cliAllowRules.some(r => r.toolName === POWERSHELL_TOOL_NAME)
  || workspaceRules.some(r => r.ruleValue.toolName === POWERSHELL_TOOL_NAME);
// If Bash is denied on Windows AND PowerShell isn't enabled, also auto-deny PowerShell.
if (getPlatform() === "windows" && bashDenied && !powerShellAllowed) {
  denyList = [...denyList, POWERSHELL_TOOL_NAME];
}
```

This auto-denies the PowerShell tool on Windows if Bash is also denied and the user didn't explicitly allow PowerShell — preventing a "Bash is forbidden but PowerShell isn't, so the model just uses PowerShell" bypass.

### Tip Surface

A tip surface at `chunks.207.mjs:329-331` nudges Windows users who haven't set the env var:

```javascript
{
    id: "powershell-tool-env",
    content: async () => "Set CLAUDE_CODE_USE_POWERSHELL_TOOL=1 to enable the PowerShell tool (preview)",
    cooldownSessions: 10,
    isRelevant: async () => y1() === "windows" && process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL === void 0
}
```

**What it does:** Shows the tip every 10 sessions if (a) Windows platform AND (b) env var is unset. Once the user sets it (either direction), the tip disappears.

**Why a tip and not auto-enable:** The Statsig cohort handles auto-enable. The tip is for the contrary case — a user who's not in the rolled-out cohort wants to opt in early. The cooldown of 10 sessions prevents nag.

---

## 2.1.89 & 2.1.90 Permission Hardening

The 2.1.89 and 2.1.90 changelogs landed:

- **Back-tick escape detection.** PowerShell's `\`` is the escape character (unlike bash's `\`). Without this, `` `whoami` `` looks safe to a Bash-shaped validator but executes `whoami` in PS.
- **Sub-expression detection.** `$(...)`, `@(...)`, `@{...}` — all execute commands or produce arrays.
- **Member invocation detection.** `[System.IO.File]::ReadAllText("/etc/passwd")` — static method calls bypass cmdlet allowlists.
- **Splatting detection.** `@args` — argument splatting destroys static analysis of argv.
- **Stop-parsing token.** `--%` tells PS to pass the remainder verbatim, bypassing all parser-based checks.

The hardening is in `powershell/parser.ts` and `tools/PowerShellTool/readOnlyValidation.ts`. In v2.1.112 the obfuscated equivalent is in `chunks.157.mjs:1107`:

```javascript
let z = wL(K);
if (z.hasSubExpressions || z.hasScriptBlocks || z.hasMemberInvocations
    || z.hasSplatting || z.hasAssignments || z.hasStopParsing
    || z.hasExpandableStrings) return {
    behavior: "passthrough",
    message: "Command contains subexpressions, script blocks, or member invocations that require approval"
};
```

These flags are computed during AST walk. Any one of them flips the command into "requires approval" — the auto-approve path is gated on **all five** being false.

### Why fail-closed?

PowerShell's parser is **expression-evaluating** in many contexts; static analysis can't reason about runtime types. The seven flags map to specific runtime behaviors that can:

1. Execute arbitrary code (sub-expressions, script blocks, member invocations).
2. Smuggle arguments past static argv checks (splatting).
3. Reassign existing names to compromise later commands (assignments).
4. Bypass all subsequent parsing (stop-parsing).
5. Trigger variable interpolation at unexpected times (expandable strings).

Fail-closed (passthrough → require approval) is the only safe default. The cost is some user friction on legitimate complex PS — accepted as the price of correctness.

---

## Allowed Operations Reference

The v2.1.112 PowerShell tool exposes three command categories for collapsible display:

```javascript
// PS_SEARCH_COMMANDS (v2.1.88 src/tools/PowerShellTool/PowerShellTool.tsx:54-61)
const PS_SEARCH_COMMANDS = new Set([
  'select-string',   // grep equivalent
  'get-childitem',   // find equivalent (with -Recurse)
  'findstr',         // native Windows search
  'where.exe'        // native Windows which
]);

// PS_READ_COMMANDS (v2.1.88 line 67-88)
const PS_READ_COMMANDS = new Set([
  'get-content',  // cat
  'get-item',     // file info
  'test-path',    // test -e
  'resolve-path', // realpath
  'get-process',  // ps
  'get-service',  // system info
  'get-childitem',// ls/dir (also search when recursive)
  'get-location', // pwd
  'get-filehash', // checksum
  'get-acl',      // permissions
  'format-hex'    // hexdump
]);
```

These are recognized by the UI for collapsing tool-use blocks — a `Get-Content foo.txt` invocation collapses the same way `cat foo.txt` does. The semantics affect display, not safety.

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Statsig gate vs. static USER_TYPE check | Lets Anthropic gradually roll out (good); requires Statsig SDK to be live (bad in offline scenarios — falls back to `false`). |
| Linux/macOS opt-in vs. default | Avoids "pwsh not found" errors (good); leaves cross-platform PS users to discover the env var (bad). The tip helps Windows but not Linux. |
| Auto-deny PowerShell when Bash is denied | Prevents "switch tool" bypass (good); a user who legitimately wants PS-only access must explicitly allow PS first (slightly more setup, intentional). |
| Sub-expression-detection blocks legitimate complex PS | Some interactive PS workflows now require explicit approval (cost); preserves auto-approve correctness in all scripted contexts (benefit). |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88 → v2.1.112 index

Key functions in this document:
- `isPowerShellToolEnabled` (ly6) — runtime gate
- `POWERSHELL_TOOL_NAME` (I5) — tool name string `"PowerShell"`
- `getFeatureFlag` (u8) — Statsig wrapper
- `parseExplicitTrue` (S6) — env-var truthy parser (must be explicit, not just non-empty)
- `parseExplicitFalse` (c5) — env-var falsy parser
- `getPlatform` (y1) — platform string `"windows"|"linux"|"macos"|"wsl"`
- PowerShell parser AST flag check happens at `chunks.157.mjs:1107` inside `checkPermissionMode` equivalent
