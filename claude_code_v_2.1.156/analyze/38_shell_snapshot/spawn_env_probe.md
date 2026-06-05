# NEW in 2.1.156: Spawn-Env Probe + Known-Env-Key Union (ws7 / i98 / iD-union)

> This document covers the headline NEW shell-snapshot mechanism introduced in Claude Code v2.1.156: a **spawn-env probe** (`probeSpawnEnv` = `ws7`, `cli_inner_pretty.js:341137-341159`) that fires at Bash-provider creation, runs the user's login shell once as `shell -c env`, parses every exported `KEY=` line with the regex `tD_` (`cli_inner_pretty.js:341290`), and records the *names* of those keys via `setSpawnEnvKeys` (`i98`, `cli_inner_pretty.js:341155/341146/341157`). Those names feed a four-way **known-env-key union** built by `getKnownEnvKeys` (`iD$`, `cli_inner_pretty.js:209864-209871`) = `Object.keys(subprocessEnv())` ∪ `CLAUDE_INJECTED_ENV_KEYS` (`fV5`, `cli_inner_pretty.js:209879-209895`) ∪ `sessionEnvKeys` (`K97`) ∪ `spawnEnvKeys` (`l26`). The union is consumed by the Bash permission/policy engine at `cli_inner_pretty.js:242985`, `440809`, and `441400` to decide whether a user command's bare `VAR=…` assignment is "known/expected" (and thus must be permission-checked) or harmless. The whole feature — probe, union, and the new `CLAUDE_EFFORT` allowlist member — is **entirely absent** from the v2.1.88 clean `ShellSnapshot.ts` and from the v2.1.142 reference docs.

---

## 1. Why this exists: the bare-assignment classification problem

The Bash permission engine wants to fast-path *read-only* commands so the model can run them without an approval prompt. But a command like `LD_PRELOAD=/tmp/evil.so ls` *looks* read-only (`ls`) while silently re-arming the environment for every later command in the same shell session. A bare assignment is therefore a security-relevant escape hatch from the "this is just a read-only command" classification.

The engine needs to answer one question for each `VAR=value` bare assignment: **is `VAR` a name that actually matters?** Two failure modes bracket the naive answers:

- **Block every assignment** → over-prompts; `NODE_ENV=test npm test` or `LANG=C sort` would all require approval.
- **Block nothing** → under-prompts; `PATH=/tmp ls` or `LD_PRELOAD=…` slip through as "read-only."

The 2.1.156 design splits the decision into two predicates that are AND-ed together:

1. **Is the name *harmless*?** — `isHarmlessEnvVar` (`V5H`, `cli_inner_pretty.js:440527-440529`) checks membership in an allowlist `_k$` (`cli_inner_pretty.js:441481+`) of build/locale/color knobs (`GOOS`, `RUST_LOG`, `NODE_ENV`, `LANG`, `TERM`, `NO_COLOR`, …). Harmless names are always permitted.
2. **Is the name *known/expected*?** — `getKnownEnvKeys` (`iD$`) returns the set of env-var names the running environment actually uses. If the assigned name is in that set, it can change the behavior of subsequent commands and so the command must be permission-checked.

The union built by `getKnownEnvKeys` is the data source for predicate #2. The spawn-env probe is what makes that set *accurate for the user's specific login shell* rather than just Claude's own process env.

---

## 2. probeSpawnEnv (`ws7`): the spawn-env side-channel

**What it does:** At provider creation it runs the user's shell once with `shell -c env`, scrapes the exported variable *names*, and stores that name-set so `getKnownEnvKeys` can include "things the user's login shell actually exports" in its known set. It captures only names — never values — and never raises (the caller wraps it in `.catch(()=>{})`).

```javascript
// ============================================
// probeSpawnEnv - Runs `shell -c env`, parses exported KEY names, stores via setSpawnEnvKeys
// Location: cli_inner_pretty.js:341137-341159
// ============================================

// ORIGINAL (for source lookup):
async function ws7(H) {
  try {
    let $ = await aJ(H, ["-c", "env"], {
      reject: !1,
      timeout: VX8,
      maxBuffer: 1048576,
      env: { ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : yv()), SHELL: H, GIT_EDITOR: "true", CLAUDECODE: "1" },
    });
    if ($.exitCode !== 0 || !$.stdout) {
      (N(`Spawn-env probe failed: exit=${$.exitCode} stderr=${$.stderr?.slice(0, 200)}`), i98(null));
      return;
    }
    let q = [];
    for (let K of $.stdout.split(`\n`)) {
      let _ = K.match(tD_);
      if (_) q.push(_[1]);
    }
    (N(`Spawn-env probe captured ${q.length} keys`), i98(q));
  } catch ($) {
    (N(`Spawn-env probe error: ${$}`), i98(null));
  }
}

// READABLE (for understanding):
async function probeSpawnEnv(shellPath) {
  try {
    // Run the user's shell with `-c env` (NOT `-l`): we want the env as a
    // non-interactive child shell sees it, which is exactly what Bash-tool
    // commands run under when a snapshot is present (getSpawnArgs skips -l).
    const result = await execa(shellPath, ["-c", "env"], {
      reject: false,              // never throw on nonzero exit; inspect exitCode
      timeout: SNAPSHOT_CREATION_TIMEOUT,   // VX8 = 10000 ms hard cap
      maxBuffer: 1048576,         // 1 MB stdout cap (env output is tiny in practice)
      env: {
        // Same scrubbed base env as snapshot creation (secrets/OTEL/bg keys removed),
        // unless CLAUDE_CODE_DONT_INHERIT_ENV forces a blank env.
        ...(process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv()),
        SHELL: shellPath,
        GIT_EDITOR: "true",
        CLAUDECODE: "1",
      },
    });

    // Failure / empty stdout -> record "probe produced nothing" as null.
    if (result.exitCode !== 0 || !result.stdout) {
      logForDebugging(`Spawn-env probe failed: exit=${result.exitCode} stderr=${result.stderr?.slice(0, 200)}`);
      setSpawnEnvKeys(null);       // i98(null): leaves getKnownEnvKeys pending/gated
      return;
    }

    // Parse: split on newlines, keep the NAME of every `NAME=...` line.
    const keys = [];
    for (const line of result.stdout.split("\n")) {
      const match = line.match(envLineKeyRegex);   // tD_ = /^([A-Za-z_][A-Za-z0-9_]*)=/
      if (match) keys.push(match[1]);              // capture group 1 = the bare name
    }
    logForDebugging(`Spawn-env probe captured ${keys.length} keys`);
    setSpawnEnvKeys(keys);          // i98(keys): l26 becomes a Set of names
  } catch (err) {
    // execa rejected despite reject:false (spawn-level failure, e.g. ENOENT shell).
    logForDebugging(`Spawn-env probe error: ${err}`);
    setSpawnEnvKeys(null);
  }
}

// Mapping: ws7->probeSpawnEnv, aJ->execa, VX8->SNAPSHOT_CREATION_TIMEOUT, yv->subprocessEnv,
//          tD_->envLineKeyRegex, i98->setSpawnEnvKeys, N->logForDebugging, H->shellPath,
//          $->result, q->keys, K->line, _->match
```

### How it works (step by step)

1. **Spawn the shell as `shell -c env`** (`cli_inner_pretty.js:341139`). Note `["-c", "env"]` — **not** `["-c", "-l", …]`. This is deliberate: it mirrors how Bash-tool commands run *after* a snapshot exists, because `getSpawnArgs` (`cli_inner_pretty.js:341398`) skips the `-l` login flag when a snapshot is present. The probe wants the env that a real tool command will actually see, not the fuller login-shell env.
2. **execa options** (`cli_inner_pretty.js:341139-341144`):
   - `reject: false` — a nonzero exit must not throw; the code inspects `exitCode` itself and degrades gracefully.
   - `timeout: VX8` — the same 10-second `SNAPSHOT_CREATION_TIMEOUT` constant (`cli_inner_pretty.js:341165`) used for snapshot creation. A hung user shell (e.g. a `.zshenv` that blocks on input) cannot stall the probe forever.
   - `maxBuffer: 1048576` — 1 MB cap on captured stdout. `env` output is normally a few KB, so this is purely a safety bound.
   - `env: {...}` — the probe child inherits the **same scrubbed base** as snapshot creation: `subprocessEnv()` (which strips secrets, `OTEL_*`, and background-session keys) unless `CLAUDE_CODE_DONT_INHERIT_ENV` is set (then a blank `{}` base), plus the three fixed keys `SHELL` / `GIT_EDITOR:"true"` / `CLAUDECODE:"1"`.
3. **Failure gate** (`cli_inner_pretty.js:341145-341148`): if `exitCode !== 0` *or* there is no stdout, log a debug line and call `setSpawnEnvKeys(null)`. Storing `null` (not an empty set) is significant — see §4 on the pending gate.
4. **Parse loop** (`cli_inner_pretty.js:341149-341154`): split stdout on `\n`, run each line through `envLineKeyRegex` (`tD_`), and push capture-group 1 (the bare name before `=`) into `keys`. Lines that are continuation values of a multiline export (no leading `NAME=`) simply don't match and are skipped.
5. **Store names** (`cli_inner_pretty.js:341155`): `setSpawnEnvKeys(keys)` → `l26` becomes a `Set` of those names.
6. **Outer catch** (`cli_inner_pretty.js:341156-341158`): if execa rejects despite `reject:false` (a spawn-level failure such as the shell binary not existing), log and `setSpawnEnvKeys(null)`.

### The `envLineKeyRegex` (`tD_`)

```
tD_ = /^([A-Za-z_][A-Za-z0-9_]*)=/    // cli_inner_pretty.js:341290
```

This matches a POSIX-shell identifier anchored at the start of a line, immediately followed by `=`. It is intentionally strict:

- **Anchored at `^`** so only true variable lines match — the start-of-record discriminator.
- **`[A-Za-z_]` first char, `[A-Za-z0-9_]*` after** is the exact POSIX env-name grammar. A line like `PATH=/usr/bin:/bin` yields `PATH`; a *value* line of a multiline variable such as a continued `LS_COLORS` definition won't start with `NAME=` and is ignored.
- **Capture group 1 is the name only.** The value after `=` is never captured, never stored. The feature is structurally incapable of leaking secret *values* into Claude state; it only learns secret *names*, which is what the policy engine needs.

> **Key insight:** the same regex `tD_` is reused as a structural primitive elsewhere in the bash-policy engine — e.g. the sandbox auto-allow path at `cli_inner_pretty.js:440808` defines a near-identical `^([A-Za-z_][A-Za-z0-9_]*)\+?=` to detect inline `argv` assignments. The probe and the policy share one definition of "what an env assignment looks like," so the set of names the probe collects lines up exactly with the names the policy will try to classify.

### Why probe at all (rationale + alternatives)

**Why not just use `Object.keys(process.env)`?** Claude's own process env is missing variables a user's login shell exports only for interactive/child shells (defined in `.zshenv`, `.bash_profile`, profile.d scripts, direnv, asdf/mise shims, etc.). If the policy engine only knew Claude's process env, a user command `FOO=bar somecmd` where `FOO` is a meaningful variable in *their* shell would be misclassified as "unknown name → harmless" and incorrectly fast-pathed. The probe closes that gap by asking the *actual* login shell what it exports.

**Why a separate `shell -c env` rather than reading the snapshot file?** The snapshot file captures functions, options, and aliases — not the live exported environment. And the snapshot is built with `-l` (login), whereas tool commands run without `-l` once a snapshot exists. The probe specifically reproduces the *non-login* `-c` env that tool commands will inherit, so its key set matches the runtime exactly. Reusing the snapshot would over- or under-report names depending on login-vs-non-login differences.

**Why fire-and-forget (`.catch(()=>{})`)?** The probe is an optimization for *permissiveness accuracy*, not a correctness requirement. If it fails, the union returns `null` and the policy treats "known keys unavailable" conservatively (see §4). So a failed probe can never make the engine *less* safe — at worst it makes it slightly more cautious. That risk profile justifies running it asynchronously without awaiting it and swallowing all errors.

---

## 3. The four-way union: getKnownEnvKeys (`iD$`)

**What it does:** Builds the authoritative set of env-var *names* the running environment uses, by unioning four independent sources, or returns `null` when the picture is incomplete.

```javascript
// ============================================
// getKnownEnvKeys - Union of process env + Claude-injected + session-hook + spawn-probe names
// Location: cli_inner_pretty.js:209855-209895
// ============================================

// ORIGINAL (for source lookup):
function n98(H) { q97 = H; }
function _97(H) { K97 = new Set(H); }
function i98(H) { l26 = H === null ? null : new Set(H); }
function iD$() {
  if (!q97 || l26 === null) return null;
  let H = new Set(Object.keys(yv()));
  for (let $ of fV5) H.add($);
  for (let $ of K97) H.add($);
  for (let $ of l26) H.add($);
  return H;
}
var q97 = !1, K97, l26 = null, fV5;
var rD$ = T(() => {
  cN();
  K97 = new Set();
  fV5 = ["SHELL","GIT_EDITOR","CLAUDECODE","AI_AGENT","CLAUDE_CODE_SESSION_ID","TRACEPARENT",
         "CLAUDE_CODE_EXECPATH","TMUX","TMPDIR","CLAUDE_CODE_TMPDIR","TMPPREFIX","BUN_OPTIONS",
         "TEMP","TMP","CLAUDE_EFFORT"];
});

// READABLE (for understanding):
function setSnapshotPresent(present) { snapshotPresent = present; }      // n98 -> q97
function setSessionEnvKeys(names)    { sessionEnvKeys = new Set(names); } // _97 -> K97
function setSpawnEnvKeys(names)      { spawnEnvKeys = names === null ? null : new Set(names); } // i98 -> l26

function getKnownEnvKeys() {
  // GATE: refuse to answer until the environment picture is complete.
  //  - !snapshotPresent: no snapshot has been recorded yet (or it failed)
  //  - spawnEnvKeys === null: the spawn-env probe hasn't finished (or it failed)
  if (!snapshotPresent || spawnEnvKeys === null) return null;

  // Source 1: names live in Claude's own (scrubbed) subprocess env.
  const known = new Set(Object.keys(subprocessEnv()));   // yv()
  // Source 2: names Claude itself injects into every Bash spawn.
  for (const k of CLAUDE_INJECTED_ENV_KEYS) known.add(k);   // fV5
  // Source 3: names set by session-env hooks for the current command.
  for (const k of sessionEnvKeys) known.add(k);             // K97
  // Source 4: names the user's login shell exports (from the spawn probe).
  for (const k of spawnEnvKeys) known.add(k);               // l26
  return known;
}

const CLAUDE_INJECTED_ENV_KEYS = [   // fV5
  "SHELL", "GIT_EDITOR", "CLAUDECODE", "AI_AGENT", "CLAUDE_CODE_SESSION_ID",
  "TRACEPARENT", "CLAUDE_CODE_EXECPATH", "TMUX", "TMPDIR", "CLAUDE_CODE_TMPDIR",
  "TMPPREFIX", "BUN_OPTIONS", "TEMP", "TMP",
  "CLAUDE_EFFORT",   // NEW in 2.1.156
];

// Mapping: iD$->getKnownEnvKeys, n98->setSnapshotPresent, _97->setSessionEnvKeys,
//          i98->setSpawnEnvKeys, q97->snapshotPresent, K97->sessionEnvKeys,
//          l26->spawnEnvKeys, fV5->CLAUDE_INJECTED_ENV_KEYS, yv->subprocessEnv
```

### The four sources (and who populates each)

- **Source 1 — `Object.keys(subprocessEnv())`** (`cli_inner_pretty.js:209866`). The names present in Claude's own scrubbed subprocess env. This is the live baseline that every Bash spawn starts from.
- **Source 2 — `CLAUDE_INJECTED_ENV_KEYS` (`fV5`)** (`cli_inner_pretty.js:209879-209895`). The fixed names Claude *re-injects* on top of `subprocessEnv()` at every Bash spawn: `SHELL`, `GIT_EDITOR`, `CLAUDECODE`, `AI_AGENT`, `CLAUDE_CODE_SESSION_ID`, `TRACEPARENT`, `CLAUDE_CODE_EXECPATH`, `TMUX`, `TMPDIR`, `CLAUDE_CODE_TMPDIR`, `TMPPREFIX`, `BUN_OPTIONS`, `TEMP`, `TMP`, and the **new `CLAUDE_EFFORT`** (`cli_inner_pretty.js:209894`). These names matter even if `subprocessEnv()` happens not to contain them yet, because they *will* be set by the spawn-env overlay (compare with the v2.1.142 Bash-spawn env list documented in `env_snapshot.md` §4).
- **Source 3 — `sessionEnvKeys` (`K97`)** set by `setSessionEnvKeys` (`_97`). Populated per command by the policy entry point `DT$` at `cli_inner_pretty.js:441112`: `_97($.sessionEnvVars?.keys() ?? [])`. These are the names a session-env hook is injecting for *this* command — they're "known/expected" precisely because Claude set them.
- **Source 4 — `spawnEnvKeys` (`l26`)** set by `setSpawnEnvKeys` (`i98`) from the spawn-env probe. The names the user's login shell exports.

### Why a union of exactly these four

Each source covers a blind spot the others miss:

| Source | Covers | Blind spot it fixes |
|---|---|---|
| `subprocessEnv()` keys | Claude's live env right now | doesn't include keys added *during* spawn |
| `CLAUDE_INJECTED_ENV_KEYS` | the spawn-time overlay names | not in process env until spawn |
| `sessionEnvKeys` | per-command hook vars | dynamic, per-call only |
| `spawnEnvKeys` (probe) | user login-shell exports | invisible to Claude's process env |

A name a user reassigns is "expected to matter" if it falls in **any** of these buckets. Anything *outside* all four is a name neither Claude nor the user's shell uses — assigning it is genuinely inert, so it need not be permission-checked. That is exactly the over-prompt/under-prompt balance §1 needs.

---

## 4. The pending/incomplete gate (the load-bearing decision)

**What it does:** `getKnownEnvKeys` returns `null` — not a partial set — whenever the env picture is incomplete:

```javascript
if (!q97 || l26 === null) return null;   // cli_inner_pretty.js:209865
```

Two conditions force `null`:

1. **`!q97`** (`snapshotPresent` is false) — no snapshot has been recorded yet. `q97` is set by `setSnapshotPresent` (`n98`) from inside `createBashShellAdapter` once snapshot creation resolves: `n98(A !== void 0)` on success (`cli_inner_pretty.js:341347`) and `n98(!1)` on failure (`cli_inner_pretty.js:341350`).
2. **`l26 === null`** (`spawnEnvKeys` still `null`) — the spawn-env probe is still running, or it failed. `l26` starts at `null` (`cli_inner_pretty.js:209874`) and only becomes a `Set` once `setSpawnEnvKeys` is called with a non-null array.

**Why return `null` rather than an empty/partial set?** Because the *consumers* are written to treat `null` as "I cannot vouch for completeness — be conservative." Look at how all three consumers AND the gate into their bare-assignment test:

```javascript
// cli_inner_pretty.js:242986 (read-only command analyzer)
_.bareAssignmentNames.some((O) => !V5H(O) && (z === null || z.has(O)))
// cli_inner_pretty.js:440811-440812 (sandbox auto-allow)
K.some((j) => !V5H(j) && (A === null || A.has(j))) || ...
// cli_inner_pretty.js:441401-441402 (read-only allow rule)
!z.some((L) => !V5H(L) && (J === null || J.has(L)))
```

The pattern is identical: `!isHarmlessEnvVar(name) && (knownKeys === null || knownKeys.has(name))`. When `knownKeys === null`, the `(null === null || …)` short-circuits to `true` — meaning **every non-harmless assignment is treated as known/dangerous** while the picture is incomplete. This is fail-safe: during the brief window before the snapshot and probe finish, the engine *over*-classifies assignments as significant (more prompts), never *under*-classifies (no silent fast-path of a real assignment).

**Why is this the right trade-off?** The alternative — return whatever partial union is available — would mean that during startup the engine could see a user variable as "unknown" simply because the probe hadn't reported it yet, and wrongly fast-path `FOO=bar somecmd`. Tying the gate to *both* the snapshot and the probe ensures the engine only acts on the env-key set once it is genuinely populated from all login-shell sources. The cost is a few extra prompts in the first moments of a session; the benefit is that the read-only fast-path is never wrong about which assignments matter.

> **Key insight:** `null` here is a deliberate *tri-state* — `Set` ("known, here it is"), `null` from the gate ("not ready, assume everything matters"), and `null` from a probe failure ("could not learn, assume everything matters"). The last two collapse to the same conservative behavior, which is why a failed probe is harmless: it is indistinguishable, to consumers, from "still loading."

---

## 5. How the probe is wired in: createBashShellAdapter (`Gs7`)

The probe is kicked off — fire-and-forget — alongside snapshot creation when the Bash provider is constructed:

```javascript
// ============================================
// createBashShellAdapter (probe trigger excerpt) - launches snapshot + spawn-env probe
// Location: cli_inner_pretty.js:341341-341354
// ============================================

// ORIGINAL (for source lookup):
async function Gs7(H, $) {
  let q,
    K = $?.skipSnapshot
      ? Promise.resolve(void 0)
      : js7(H)
          .then((A) => { return (SH("shell_snapshot_create"), n98(A !== void 0), A); })
          .catch((A) => {
            (N(`Failed to create shell snapshot: ${A}`), t$("shell_snapshot_create", "snapshot_failed"), n98(!1));
            return;
          });
  if (!$?.skipSnapshot) ws7(H).catch(() => {});
  // ... returns provider object { type:"bash", shellPath:H, ... }

// READABLE (for understanding):
async function createBashShellAdapter(shellPath, options) {
  let snapshotPath;
  const snapshotPromise = options?.skipSnapshot
    ? Promise.resolve(undefined)
    : createAndSaveSnapshot(shellPath)             // js7
        .then((path) => {
          spanSucceed("shell_snapshot_create");    // SH
          setSnapshotPresent(path !== undefined);  // n98 -> q97 (gate condition 1)
          return path;
        })
        .catch((err) => {
          logForDebugging(`Failed to create shell snapshot: ${err}`);
          spanFail("shell_snapshot_create", "snapshot_failed");  // t$
          setSnapshotPresent(false);               // n98(false): snapshot absent but gate resolves
          return;
        });

  // NEW: fire the spawn-env probe in parallel, fully detached. Only when NOT skipSnapshot.
  if (!options?.skipSnapshot) probeSpawnEnv(shellPath).catch(() => {});

  // ... returns provider object
}

// Mapping: Gs7->createBashShellAdapter, js7->createAndSaveSnapshot, ws7->probeSpawnEnv,
//          n98->setSnapshotPresent, SH->spanSucceed, t$->spanFail, N->logForDebugging,
//          H->shellPath, $->options
```

Three details matter here:

1. **`ws7(H).catch(()=>{})`** (`cli_inner_pretty.js:341353`) is *not awaited*. The provider returns immediately; the probe resolves on its own clock and writes `l26` via `setSpawnEnvKeys`. The `.catch(()=>{})` is a second safety net on top of the probe's own try/catch.
2. **Both the probe and snapshot are gated by `!skipSnapshot`** (`cli_inner_pretty.js:341344` and `341353`). When a caller passes `skipSnapshot`, neither the snapshot nor the probe runs, so `q97` stays `false` and `l26` stays `null` — and `getKnownEnvKeys` keeps returning `null` (conservative). This is consistent: a provider that opts out of snapshotting also opts out of the env-key intelligence, and the policy engine correctly treats that as "incomplete picture, be cautious."
3. **The snapshot's `.then`/`.catch` drives the *other* gate condition.** Snapshot success calls `setSnapshotPresent(true)`; failure still calls `setSnapshotPresent(false)` (`cli_inner_pretty.js:341350`). Either way `q97` is *resolved* (true or false) — but the gate only opens when `q97` is truthy AND `l26` is non-null, so a failed snapshot leaves the gate closed and the engine conservative.

---

## 6. The new `CLAUDE_EFFORT` allowlist member

`CLAUDE_INJECTED_ENV_KEYS` (`fV5`) gains one entry vs the prior lineage: **`CLAUDE_EFFORT`** (`cli_inner_pretty.js:209894`). Because the union folds every `fV5` name into the known set, `CLAUDE_EFFORT` is now treated as a "known/expected" variable name: a user command `CLAUDE_EFFORT=high some-cmd` is classified as touching a name Claude itself uses, and therefore is *not* silently fast-pathed as harmless. This mirrors how the other Claude-injected names (`CLAUDE_CODE_SESSION_ID`, `CLAUDE_CODE_EXECPATH`, etc.) are handled — assignment to any of them can alter Claude's own subprocess behavior, so they belong on the "must be checked" side of the bare-assignment predicate.

---

## 7. Cross-validation vs v2.1.88 and v2.1.142

### v2.1.88 clean TypeScript (`ShellSnapshot.ts`)

The clean reference contains **no env probe and no env-key union whatsoever**. Verified by reading the entire file (`/lyz/codespace/3rd/claude-code/src/utils/bash/ShellSnapshot.ts`, 582 lines):

- No `shell -c env` invocation. The only `execa` call in that file is the Windows Cygwin PATH read inside `getClaudeCodeSnapshotContent` (`execa('echo $PATH', {shell:true, reject:false})`, lines 274-277) — a single PATH string, not an `env` dump.
- No `setSpawnEnvKeys`, `getKnownEnvKeys`, `setSnapshotPresent`, `setSessionEnvKeys`, `CLAUDE_INJECTED_ENV_KEYS`, or any equivalent. The module's exports are limited to `createRipgrepShellIntegration`, `createFindGrepShellIntegration`, and `createAndSaveSnapshot`.
- `createAndSaveSnapshot` returns the snapshot path and registers cleanup, but nothing observes "snapshot present" as global state for a policy engine. There is no notion of "known env keys."

So the entire mechanism — probe, union, gate, and the `CLAUDE_EFFORT` allowlist — is **new since v2.1.88**.

### v2.1.142 reference docs

The v2.1.142 `38_shell_snapshot/` documents (`env_snapshot.md`, `README.md`) describe subprocess-env *scrubbing* (`subprocessEnv` / `XI`, GHA scrub list, OTEL stripping, Bash-spawn env additions) but contain **no spawn-env probe and no known-env-key union**. A grep for `probeSpawnEnv`, `getKnownEnvKeys`, `setSpawnEnvKeys`, `ws7`, and `iD$` across that directory returns nothing. The v2.1.142 doc's "Bash tool spawn env" (its §4) is the *input* to Source 1+2 of the 2.1.156 union, but the union itself did not exist then.

### What is NEW or CHANGED in 2.1.156

- **NEW: `probeSpawnEnv` (`ws7`, `cli_inner_pretty.js:341137-341159`)** — a `shell -c env` side-channel that records exported key names. Absent in v2.1.88 and v2.1.142.
- **NEW: `getKnownEnvKeys` four-way union (`iD$`, `cli_inner_pretty.js:209864-209871`)** with the incomplete-picture `null` gate. Absent in both prior sources.
- **NEW: `setSpawnEnvKeys`/`spawnEnvKeys` (`i98`/`l26`)** state plumbing. Absent in both.
- **NEW: `CLAUDE_EFFORT`** added to `CLAUDE_INJECTED_ENV_KEYS` (`fV5`, `cli_inner_pretty.js:209894`).
- **NEW: integration with the Bash permission/policy engine** at `cli_inner_pretty.js:242985`, `440809`, `441400` — the union is the data source for classifying bare assignments. (Tie-in: see the permission_policy module; the harmless-name predicate `V5H`/`_k$` at `cli_inner_pretty.js:440527`/`441481` is the AND-partner of `getKnownEnvKeys`.)

---

## 8. Trade-offs and design notes

- **Cost:** one extra short-lived shell spawn per provider creation (`shell -c env`, capped at 10 s / 1 MB). Run detached, it adds no latency to the first tool call. The probe and snapshot creation overlap (both started before the provider returns).
- **Safety posture:** the probe captures *names only* via `tD_`; values never enter Claude's memory. The `null` gate guarantees a failed or in-flight probe makes the engine *more* cautious, never less.
- **Why couple the probe to the snapshot gate (`!skipSnapshot`)?** Both describe "the user's real login-shell environment." A provider that skips snapshotting is explicitly opting out of login-shell fidelity, so it should also skip the env-key intelligence and let the policy stay conservative. Coupling them keeps the two gate conditions semantically aligned.
- **Why two gate conditions instead of one?** The snapshot tells the policy "we know the user's functions/aliases/options"; the probe tells it "we know the user's exported variable names." Both are needed before the engine can trust its bare-assignment classification, so both must report before the gate opens. Either alone would leave a blind spot the §1 design is trying to eliminate.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_shell_snapshot.md](../00_overview/symbol_additions_v2_1_156_shell_snapshot.md) — this module's symbol additions

Key functions in this document:
- `probeSpawnEnv` (`ws7`) — NEW spawn-env probe; runs `shell -c env`, scrapes key names; `cli_inner_pretty.js:341137-341159`
- `getKnownEnvKeys` (`iD$`) — four-way known-env-key union with incomplete-picture `null` gate; `cli_inner_pretty.js:209864-209871`
- `setSnapshotPresent` (`n98`) — sets `snapshotPresent` (`q97`); gate condition 1; `cli_inner_pretty.js:209855-209857`
- `setSessionEnvKeys` (`_97`) — sets `sessionEnvKeys` (`K97`) from per-command `sessionEnvVars`; `cli_inner_pretty.js:209858-209860`, caller `cli_inner_pretty.js:441112`
- `setSpawnEnvKeys` (`i98`) — NEW; sets `spawnEnvKeys` (`l26`), tolerating `null`; `cli_inner_pretty.js:209861-209863`
- `CLAUDE_INJECTED_ENV_KEYS` (`fV5`) — fixed names Claude injects; gains `CLAUDE_EFFORT` in 2.1.156; `cli_inner_pretty.js:209879-209895`
- `envLineKeyRegex` (`tD_`) — `/^([A-Za-z_][A-Za-z0-9_]*)=/`; `cli_inner_pretty.js:341290`
- `createBashShellAdapter` (`Gs7`) — fires snapshot + probe at provider creation (`!skipSnapshot`); `cli_inner_pretty.js:341341-341354`
- `isHarmlessEnvVar` (`V5H`) — AND-partner predicate; allowlist membership in `_k$`; `cli_inner_pretty.js:440527-440529`
- `SNAPSHOT_CREATION_TIMEOUT` (`VX8`) — `1e4` (10000 ms); reused as the probe timeout; `cli_inner_pretty.js:341165`
- `subprocessEnv` (`yv`) — scrubbed base env spread into the probe spawn and Source 1 of the union
- `execa` (`aJ`) — promise exec used to spawn `shell -c env`
