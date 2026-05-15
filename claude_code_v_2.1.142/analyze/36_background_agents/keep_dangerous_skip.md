# `--bg --dangerously-skip-permissions` Persistence — v2.1.142

## TL;DR

Before v2.1.142, a session started with `claude --bg --dangerously-skip-permissions` would *lose* the bypass when the worker was retired (e.g., after 5 minutes idle) and resurrected by an attach. The reason: the persisted `respawnFlags` array stripped boolean flags. v2.1.142 fixes this by keeping a registered set of boolean flags (`_b5`) intact through the round-trip: original argv → `respawnFlags` in `state.json` → respawned worker's argv.

The fix is in `RN4.flagsWithoutPositional`. Before: it kept *value*-bearing flags (`--model X`) but stripped boolean flags. After: it keeps both kinds, distinguishing them by membership in two registered sets.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key items:
- `flagsWithoutPositional` (`RN4`) — Boolean-flag-aware argv canonicalizer (cli_inner_pretty.js:511207-511225)
- `BG_FLAGS_WITH_ARGUMENT` (`Pg6`) — Set of flags that take a value (cli_inner_pretty.js:511283-511326)
- `BG_FLAGS_BOOLEAN` (`_b5`) — Set of *boolean* flags including `--dangerously-skip-permissions` (cli_inner_pretty.js:511327-511332)
- `stripResumeFlags` (`$b5`) — Strips `--resume`/`-c`/`--session-id` (cli_inner_pretty.js:511141-511161)
- `gateBgFlagDisclaimers` (`Kb5`) — Front-end gate requiring prior acceptance (cli_inner_pretty.js:511179-511194)

---

## What "Retire/Wake" Means Here

The bg-worker lifecycle includes phases where the worker process exits and is later respawned by the daemon:

1. **Retire** — `retireIfSettled` decides the worker has been quiet long enough; daemon SIGTERMs it. The daemon keeps the job state file on disk.
2. **Wake** — the user attaches to that job via agent view, or directly via `claude bg attach <id>`. The daemon respawns the worker process with `respawnFlags` from the saved state.

The respawn argv is built like this:

```
claude --session-id <saved-uuid> [...state.respawnFlags] [...user-added args]
```

If `--dangerously-skip-permissions` isn't in `state.respawnFlags`, the respawned worker doesn't get the bypass, and the user is suddenly seeing permission prompts on a session that was specifically opted out.

## The Bug

The `respawnFlags` array is computed at dispatch time by:

```javascript
// (simplified) iC5.assembleBgSessionDispatch around cli_inner_pretty.js:510527-510528
let W = $b5(argv),                        // strip resume-specific flags
    G = M >= 0 ? W : RN4(W),               // *** RN4 strips positional arguments
    ...
let S = {
  ...
  respawnFlags: W,                         // saved to state.json
  launch: { args: [...E, ...qb5(argv)] },  // saved to state.json
  ...
};
```

The bug was in the old `RN4`: when it saw a `--flag` token followed by a non-flag token, it assumed the next token was the flag's *value* and skipped it. But `--dangerously-skip-permissions` is boolean — there's *no* value to skip. The next token (a positional prompt word, or another flag) was getting eaten.

## The Fix

```javascript
// ============================================
// flagsWithoutPositional - Strip positionals from argv, keeping flags + their args
// Location: cli_inner_pretty.js:511207-511225
// ============================================

// ORIGINAL (for source lookup):
function RN4(H) {
  let $ = [];
  for (let q = 0; q < H.length; q++) {
    let K = H[q];
    if (!K.startsWith("-")) continue;
    if (K.includes("=")) { $.push(K); continue; }
    let _ = H[q + 1],
      A = _ !== void 0 && !_.startsWith("-");
    if (Pg6.has(K)) {
      if (($.push(K), _ !== void 0)) ($.push(_), q++);
    } else if (_b5.has(K)) $.push(K);
    else if (A) q++;
    else $.push(K);
  }
  return $;
}

// READABLE (for understanding):
function flagsWithoutPositional(argv) {
  const result = [];
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("-")) continue;       // drop positionals
    if (token.includes("=")) { result.push(token); continue; }   // --flag=value form: keep as-is
    const next = argv[i + 1];
    const nextIsValue = next !== undefined && !next.startsWith("-");

    if (BG_FLAGS_WITH_ARGUMENT.has(token)) {
      // Known value-bearing flag — consume next token as its value
      result.push(token);
      if (next !== undefined) { result.push(next); i++; }
    } else if (BG_FLAGS_BOOLEAN.has(token)) {
      // Known boolean flag — keep just the flag, DON'T consume next
      result.push(token);
    } else if (nextIsValue) {
      // Unknown flag with what looks like a value — drop both (conservative)
      i++;
    } else {
      // Unknown bare flag — keep it
      result.push(token);
    }
  }
  return result;
}

// Mapping: RN4→flagsWithoutPositional, H→argv, $→result, q→i, K→token,
//          _→next, A→nextIsValue, Pg6→BG_FLAGS_WITH_ARGUMENT, _b5→BG_FLAGS_BOOLEAN
```

### Why The Three-Set Design?

The function has to handle three categories of flags:

1. **Known value-taking** (`Pg6`): `--model`, `--effort`, `--permission-mode`, `--add-dir`, `--mcp-config`, `--plugin-dir`, `--system-prompt`, etc. — consume the next token.
2. **Known boolean** (`_b5`): `--dangerously-skip-permissions`, `--allow-dangerously-skip-permissions`, `--strict-mcp-config`, `--dangerously-allow-browser-network-access` — keep the flag, don't consume.
3. **Unknown** (neither set): could be anything. Apply heuristic: if the next token doesn't start with `-`, *probably* it's a value, so drop both. Otherwise keep the flag.

The third category is a safety hatch for flags added in the future without updating these sets. The heuristic isn't bulletproof — if the user passes an unknown boolean flag followed by a free-form positional, the positional gets eaten. But the alternative (always keep) would corrupt the argv when a real value-taking flag appears.

### The Registered Set Contents

```javascript
// cli_inner_pretty.js:511283-511326
Pg6 = new Set([
  "--model", "-m",
  "--permission-mode",
  "--agent", "--agents", "--routine", "--effort",
  "--add-dir", "--mcp-config", "--settings", "--setting-sources",
  "--system-prompt", "--system-prompt-file", "--append-system-prompt", "--append-system-prompt-file",
  "--fallback-model", "--advisor", "--channels",
  "--permission-prompt-tool",
  "--allowed-tools", "--allowedTools", "--disallowed-tools", "--disallowedTools", "--tools",
  "--session-id", "--debug-file",
  "-n", "--name",
  "--autocompact", "--betas", "--file",
  "--max-budget-usd", "--max-thinking-tokens", "--max-turns",
  "--task-budget",
  "--plan-mode-instructions",
  "--plugin-dir", "--plugin-url",
  "--resume-session-at", "--rewind-files",
  "--thinking", "--thinking-display",
]);

// cli_inner_pretty.js:511327-511332
_b5 = new Set([
  "--dangerously-skip-permissions",
  "--allow-dangerously-skip-permissions",
  "--strict-mcp-config",
  "--dangerously-allow-browser-network-access",
]);
```

The boolean set is small and stable. The value-bearing set is large and adds with new features. Maintaining them separately keeps the code DRY but requires discipline when adding flags.

---

## The Front-End Gate

A separate function (`Kb5.gateBgFlagDisclaimers`, cli_inner_pretty.js:511179-511194) refuses to even start a `--bg` session with bypass-permissions if the user hasn't accepted the disclaimer:

```javascript
function gateBgFlagDisclaimers(argv) {
  const separatorIdx = argv.indexOf("--");
  const flagsOnly = separatorIdx >= 0 ? argv.slice(0, separatorIdx) : argv;
  const permissionMode = findFlagValue("--permission-mode", flagsOnly);

  if (
    (permissionMode === "bypassPermissions"
      || flagsOnly.includes("--dangerously-skip-permissions")
      || flagsOnly.includes("--allow-dangerously-skip-permissions"))
    && !isBypassPermissionsDisclaimerAccepted()
    && !getGlobalConfig().bypassPermissionsModeAccepted
  ) {
    return "--bg with bypassPermissions requires accepting the disclaimer first. Run `claude --dangerously-skip-permissions` once interactively.";
  }

  if (permissionMode === "auto" && !isAutoModeOptedIn())
    return "--bg with auto mode requires opting in first. Run `claude --permission-mode auto` once interactively.";

  return null;
}
```

This is the *initial* protection: the user must have accepted the disclaimer in some prior interactive session before they can use `--bg --dangerously-skip-permissions`. Once accepted, the persistence flag (`bypassPermissionsModeAccepted`) is set in global config; the gate then lets the flag pass.

The v2.1.142 fix complements this: the gate lets the flag *through*, then `RN4` ensures the flag *survives* persisted in `respawnFlags`.

---

## End-to-End Lifecycle

```
User: claude --bg --dangerously-skip-permissions "do thing"
        │
        ▼
   Kb5.gateBgFlagDisclaimers
        │
        ▼ (passes — user has accepted disclaimer)
   iC5.assembleBgSessionDispatch
        │
        │ build argv = [
        │   "--session-id", uuid,
        │   "--dangerously-skip-permissions",
        │   "--", "do thing"
        │ ]
        │
        │ respawnFlags = RN4($b5(argv))   ← v2.1.142: keeps --dangerously…
        │              = ["--session-id", uuid, "--dangerously-skip-permissions"]
        │
        ▼
   I$H.spawnBgSession
        │
        │ child argv = [execPath, ...respawnFlags, "--", "do thing"]
        │
        ▼
   worker starts with bypass active

   (... 5 minutes pass, user idle, daemon retires worker ...)
   ┌─────────────────────────────────────────────┐
   │  state.json on disk:                         │
   │  {                                           │
   │    sessionId: uuid,                          │
   │    respawnFlags: [                           │
   │      "--session-id", uuid,                   │
   │      "--dangerously-skip-permissions"        │
   │    ],                                        │
   │    launch: { args: [...] },                  │
   │    state: "done",                            │
   │    tempo: "idle"                             │
   │  }                                           │
   └─────────────────────────────────────────────┘

User: claude agents → attach to this session
        │
        ▼
   daemon respawns worker from saved state
        │
        │ argv = [execPath, ...state.respawnFlags, ...newArgs]
        │      = [execPath,
        │         "--session-id", uuid,
        │         "--dangerously-skip-permissions",      ← v2.1.142: PRESENT
        │         ...]
        │
        ▼
   worker starts with bypass active ✓
```

Before v2.1.142, the third line of the saved `respawnFlags` was missing, and the user would suddenly see permission prompts on a session they explicitly opted out of.

---

## Why Not Just Persist Everything?

The naive fix would be to *not* call `RN4` at all and save the raw argv. That fails for two reasons:

1. **Positional pollution.** The argv contains the user's *prompt*, which we don't want to re-pass on respawn (the worker resumes from its persisted conversation, not from the original prompt). Stripping positionals is the *whole point* of `RN4`.
2. **Resume-flag conflict.** `$b5.stripResumeFlags` (called before `RN4`) removes `--resume`/`-c`/`--session-id`. We don't want a respawned worker to re-process its own original resume directives.

`RN4` is the correct boundary: keep flag-shaped tokens, drop positional-shaped tokens. The fix was to teach it about the boolean-flag set.

---

## Cross-References

- `claude_code_v_2.1.142/analyze/12_permissions/...` — Permission mode plumbing (read-side: which flags affect what runtime checks).
- `cli_inner_pretty.js:511336+` (`xN4.spawnBackgroundFork`) — Where this argv ends up via worker spawn.
- The daemon-internal adopt-on-restart path (`aB.adopt`, cli_inner_pretty.js:528052+) also uses `respawnFlags` from saved state.

---

## Validation

| Claim | Source |
|-------|--------|
| `RN4` distinguishes value-bearing vs boolean flag sets | cli_inner_pretty.js:511207-511225 |
| Boolean set includes `--dangerously-skip-permissions` | cli_inner_pretty.js:511328 |
| Value-bearing set includes `--model`, `--permission-mode`, etc. | cli_inner_pretty.js:511284-511326 |
| Front-end gate refuses bypass without prior interactive acceptance | cli_inner_pretty.js:511183-511190 |
| Persisted `respawnFlags` is what the daemon re-uses on respawn | cli_inner_pretty.js:510595 (write), 528013 (read in `doSpawn`) |
| Stripping resume-specific flags happens via `$b5` *before* `RN4` | cli_inner_pretty.js:511141-511161, 510528 |
