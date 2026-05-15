# Script Caps — Per-Session Per-Script Invocation Limits

> Documents `CLAUDE_CODE_SCRIPT_CAPS` (2.1.98) — a JSON-configured map of script-name → max-invocation-count for the current session. Designed to cap data exfiltration via repeated writes (e.g., 1000× `gh issue comment` calls smuggling out the entire codebase one chunk per comment).

---

## What it does

Reads a JSON object from `CLAUDE_CODE_SCRIPT_CAPS`. Each key is a substring; each value is the maximum number of times a Bash command containing that substring may be invoked in this session. When any script's counter exceeds its cap, the next invocation throws — and the error message is intentionally informative ("This limit prevents data exfiltration via repeated write operations in untrusted-input workflows").

The substring match runs over the **literal command string** before bash parses it, so `gh issue comment` matches both `gh issue comment 123 -b "x"` and `cd /tmp && gh issue comment 456 ...`. There's no AST-aware matching — substring presence is deliberately the cap criterion.

---

## Config Parsing

```javascript
// ============================================
// parseScriptCapsConfig - Parse JSON config from env var
// Location: chunks.78.mjs:825-841
// ============================================

// ORIGINAL (for source lookup):
function FH4() {
    if (YK6 !== void 0) return;
    let q = process.env.CLAUDE_CODE_SCRIPT_CAPS;
    if (!q) {
        YK6 = null;
        return
    }
    try {
        let K = n8(q);
        if (K && typeof K === "object" && !Array.isArray(K)) {
            let _ = QC(K, (z, Y) => typeof z === "number" && Number.isFinite(z) && Y.trim().length > 0);
            YK6 = Object.keys(_).length > 0 ? _ : null
        } else YK6 = null
    } catch {
        YK6 = null
    }
}

// READABLE (for understanding):
let scriptCapsConfig; // undefined = unparsed, null = empty/invalid, object = caps map

function parseScriptCapsConfig() {
  // Cache: only parse once per session.
  if (scriptCapsConfig !== undefined) return;

  const rawEnv = process.env.CLAUDE_CODE_SCRIPT_CAPS;
  if (!rawEnv) {
    scriptCapsConfig = null;
    return;
  }

  try {
    const parsed = parseJsonSafe(rawEnv);
    // Must be a plain object (not array, not null, not primitive).
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      // Filter: keep only entries where value is a finite number and key is non-empty.
      const validated = pickBy(parsed,
        (value, key) => typeof value === "number"
                     && Number.isFinite(value)
                     && key.trim().length > 0);
      scriptCapsConfig = Object.keys(validated).length > 0 ? validated : null;
    } else {
      scriptCapsConfig = null;
    }
  } catch {
    // Malformed JSON → silently disable. No error to user, no telemetry.
    scriptCapsConfig = null;
  }
}

// Mapping: FH4→parseScriptCapsConfig, YK6→scriptCapsConfig, n8→parseJsonSafe,
//          QC→pickBy
```

### Validation Layers

**What it does:** Parses the env var into a `{ scriptSubstring: maxCount }` map, with permissive fall-back to "no caps" on any error.

**How it works:**

1. **Cache check.** `scriptCapsConfig !== undefined` means already parsed. Skip.
2. **Empty env.** No env var or empty string → `null` (disabled).
3. **JSON parse.** Inside try/catch — any throw lands on `null`.
4. **Type check.** Must be an `object`, not array/null/primitive. Anything else → `null`.
5. **Per-entry validation.** Each value must be `typeof === "number"` AND `Number.isFinite()`. Each key must be non-empty after trim.
6. **Empty-after-validation.** If validation killed every entry, return `null`.

**Why this approach:**

- **Silent failures.** Malformed JSON, wrong types, empty config — all silently disable script caps. The alternative (throw or log) would make claude unusable in environments where the caller forgot to JSON-escape the env var. Failing-open here is acceptable because script caps are a *defense-in-depth* layer, not a primary security boundary.
- **Per-entry validation, not whole-object.** A user might set `CLAUDE_CODE_SCRIPT_CAPS='{"valid":10,"bad":"abc"}'`. Per-entry validation keeps `valid:10` working; whole-object rejection would drop both.
- **Number.isFinite, not just `typeof === "number"`.** Without this, `{"foo": NaN}` and `{"foo": Infinity}` would pass — and `count > NaN` is always false, so the cap would never trigger. Defense against operator typos.
- **`key.trim().length > 0`.** An empty string substring would match every command, capping the entire session at the first invocation. The trim defends against `{" ": 10}` typos.

**Key insight:** The whole function is defensive against operator misconfiguration. Every other check is one of "are we sure this won't silently break legitimate workflows?"

---

## Cap Enforcement

```javascript
// ============================================
// enforceScriptCap - Increment counter, throw if exceeded
// Location: chunks.78.mjs:855-866
// ============================================

// ORIGINAL (for source lookup):
function $p1(q) {
    if (!xP()) return;
    if (FH4(), !YK6) return;
    let K = YK6;
    for (let [_, z] of Object.entries(K)) {
        let Y = q.split(_).length - 1;
        if (Y > 0) {
            let A = (Op1.get(_) ?? 0) + Y;
            if (Op1.set(_, A), A > z) throw Error(`Script call limit exceeded: ${_} has been called ${A} times (cap: ${z}). This limit prevents data exfiltration via repeated write operations in untrusted-input workflows.`)
        }
    }
}

// READABLE (for understanding):
const scriptCallCounts = new Map(); // substring → cumulative count

function enforceScriptCap(commandString) {
  // Gate 1: env scrub must be enabled (script caps only fire inside hardened mode).
  if (!isSubprocessEnvScrubEnabled()) return;

  // Gate 2: parse caps config; if disabled or empty, exit.
  parseScriptCapsConfig();
  if (!scriptCapsConfig) return;

  // For each configured script substring, count occurrences in command and accumulate.
  for (const [substring, capLimit] of Object.entries(scriptCapsConfig)) {
    // `q.split(_).length - 1` counts the number of separator occurrences.
    // E.g., "foo bar foo bar".split("foo").length === 3 → 2 occurrences.
    const occurrencesInCommand = commandString.split(substring).length - 1;
    if (occurrencesInCommand === 0) continue;

    const cumulativeCount = (scriptCallCounts.get(substring) ?? 0) + occurrencesInCommand;
    scriptCallCounts.set(substring, cumulativeCount);

    if (cumulativeCount > capLimit) {
      throw new Error(
        `Script call limit exceeded: ${substring} has been called ${cumulativeCount} times `
        + `(cap: ${capLimit}). This limit prevents data exfiltration via repeated write operations `
        + `in untrusted-input workflows.`
      );
    }
  }
}

// Mapping: $p1→enforceScriptCap, xP→isSubprocessEnvScrubEnabled, FH4→parseScriptCapsConfig,
//          YK6→scriptCapsConfig, Op1→scriptCallCounts
```

### Algorithm

**What it does:** Bookkeeping for per-session per-substring counters. Called *before* a Bash subprocess spawn. Throws on cap overflow, causing the Bash tool result to be an error.

**How it works:**

1. **Two gates.** Both `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` AND a valid `CLAUDE_CODE_SCRIPT_CAPS` config required. Either off → no-op.
2. **For each cap entry:**
   - Count occurrences of `substring` in the literal command via `split().length - 1`. This catches `gh issue comment x && gh issue comment y` as **two** counts in one invocation.
   - Add to the running total for that substring.
   - If total exceeds cap, throw with descriptive message.

**Why this approach:**

- **Substring matching, not AST.** A motivated attacker could rename, reshuffle args, etc. But the cap isn't designed to stop a *motivated* attacker — it's designed to stop a runaway prompt-injection loop that just repeats the same data-exfil command shape. Substring catches the lazy attack pattern.
- **Per-invocation increment.** Counting occurrences-per-command (not just per-invocation) means `gh issue comment a && gh issue comment b` counts as 2. Without this, an attacker could pack multiple calls into one Bash invocation to bypass the cap.
- **Cumulative session count.** The Map persists across the entire session. There's no decay window — once you hit the cap, you're done for the session. Restart claude (or `gH4()` clears the map) to reset.
- **Throw, not warn.** The cap is a hard ceiling. Warning would be ignored by the model; throwing forces the failure into the tool result, where it appears as a Bash error and the model can be guided by the descriptive message.

**Key insight:** This is **rate limiting embedded in the permission-gating path**. It runs even when the command is permission-allowed — it's an orthogonal layer that says "even if this is allowed, you've done it too many times".

---

## Example Configurations

### Anti-exfiltration

```bash
export CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1
export CLAUDE_CODE_SCRIPT_CAPS='{
  "gh issue comment": 5,
  "gh pr comment": 5,
  "curl ": 20,
  "wget ": 10
}'
```

This setup says: "In this hardened session, you can comment up to 5 times on issues/PRs, curl up to 20 URLs, wget up to 10. Beyond that, fail." A prompt injection trying to leak the codebase via 100× `gh issue comment` calls hits the cap on call 6 and the model gets a clear error.

### Anti-runaway

```bash
export CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1
export CLAUDE_CODE_SCRIPT_CAPS='{
  "npm install": 3,
  "pip install": 3,
  "apt-get install": 2
}'
```

Used to catch loops where the model installs the same package repeatedly trying to fix an unrelated error. The cap forces the model to stop installing and reconsider after 3 attempts.

### Why JSON in env var?

The author could have used a settings file. They chose env var because:

1. **Per-invocation control.** A wrapper script can set different caps for different claude invocations without writing config files.
2. **GitHub Actions friendly.** Action YAML can set env vars trivially; writing a settings file requires an extra step.
3. **No persistence.** Settings files persist; env vars die with the process. Caps should be ephemeral.

---

## Reset Path

```javascript
// chunks.78.mjs:843-844
function gH4() {
    Op1.clear(), YK6 = void 0
}
```

`gH4` (`resetScriptCaps`) is called on session restart inside CCR. It clears the counter map AND invalidates the cached config, so a re-parse happens on the next invocation. This lets CCR rotate the cap config between sessions without process restart.

---

## Why a Single Master Gate (`SUBPROCESS_ENV_SCRUB`)?

`enforceScriptCap` requires **both** `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` AND a config in `CLAUDE_CODE_SCRIPT_CAPS`. The author could have made `CLAUDE_CODE_SCRIPT_CAPS` standalone. They didn't because:

1. **Script caps without env scrub is incoherent.** The caps are defense against a prompt-injected exfil loop. The exfil loop only matters when secrets are in env. Without env scrub, secrets are still readable, so capping won't prevent leak — only delay it.
2. **One knob to flip for "untrusted input mode".** Operators set the master gate to opt into the whole hardening posture, and `SCRIPT_CAPS` is an optional refinement of *which* commands get capped within that posture.

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Substring matching (not AST) | Easy to spec, easy to bypass with rename — but cheap exfil patterns it catches are the realistic attack shape. |
| Per-occurrence counting in single command | Prevents pack-into-one-bash bypass; can over-count when a user legitimately runs `gh issue comment a; gh issue comment b` once. Trade-off accepted because batching is the same exfil shape. |
| Silent disable on malformed JSON | Avoids breaking claude with operator typos; risks the cap not being active when operator thought it was. Sysadmins should validate JSON before deploy. |
| Throw on overflow (not warn) | Hard stop; model gets clear feedback. Could be too aggressive for legitimate use cases that happen to hit the cap; user must raise the cap. |
| Counter persists for session, not time-window | Simpler; doesn't reset mid-session. A long session that legitimately hits the cap mid-way needs claude restart. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_13.md](../00_overview/symbol_additions_unit_13.md) — this module's additions
> - [symbol_index.md](../00_overview/symbol_index.md) — main v2.1.88 → v2.1.112 index

Key functions in this document:
- `parseScriptCapsConfig` (FH4) — JSON parse + per-entry validation
- `enforceScriptCap` ($p1) — counter increment + cap check
- `resetScriptCaps` (gH4) — clears counter and config (session restart)
- `scriptCapsConfig` (YK6) — cached map; undefined/null/object tri-state
- `scriptCallCounts` (Op1) — session-cumulative per-substring count Map
- `isSubprocessEnvScrubEnabled` (xP) — required gate (see [subprocess_pid_namespace.md](./subprocess_pid_namespace.md))
