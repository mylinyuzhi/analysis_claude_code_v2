# Shell tools: Bash and PowerShell deltas (v2.1.193 -> v2.1.220)

Twelve changelog bullets across `.196`, `.203`, `.205`, `.210`, `.212`, `.214` and `.219` touch the two
shell tools. This document proves each one against the 2.1.220 bundle, and in four cases proves the
opposite of what the bullet implies.

The single most productive site is the **PowerShell shell descriptor** (`:169515-169559`), which absorbed
*five* independent fixes in one 44-line function. The second is the **Bash tool result mapper**
(`:438042-438095`), which gained a three-way branch and two new hint fields.

---

## 1. Periodic progress heartbeat for long-running tool calls (`.214`)

> Added a periodic progress heartbeat for long-running tool calls that previously went silent

**Verdict: NET_NEW.** `tool_heartbeat` **220=7 / 193=0**; `tool_progress heartbeat` **220=1 / 193=0**;
`tool_progress` 220=16 / 193=9.

Despite living in a Bash-adjacent bullet cluster, the heartbeat is **generic to every tool**, not a shell
feature. It is started by the central tool dispatcher.

```javascript
// ============================================
// startToolHeartbeat - emits a synthetic progress frame every 30s for the life of a tool call
// Location: cli_inner_pretty.js:340758-340786
// ============================================

// ORIGINAL (for source lookup):
function rdd({ toolName: e, toolUseID: t, abortSignal: r, onProgress: n }) {
  if (e === qo) return w$y;
  let o = Date.now(), i = !1, s = 0,
    a = setInterval(() => {
      try {
        if (i) return;
        if (r.aborted) { l(); return; }
        n({
          type: "progress",
          toolUseID: `${t}-heartbeat-${s++}`,
          data: { type: "tool_heartbeat", toolName: e, elapsedTimeSeconds: Math.floor((Date.now() - o) / 1000) },
        });
      } catch (c) { (xe(c), l()); }
    }, fIs);
  a.unref();
  function l() { if (i) return; ((i = !0), clearInterval(a)); }
  return l;
}
function w$y() {}
var fIs = 30000;

// READABLE (for understanding):
function startToolHeartbeat({ toolName, toolUseID, abortSignal, onProgress }) {
  if (toolName === AGENT_TOOL_NAME) return noopStop;          // the Agent tool has its own progress channel
  let startedAt = Date.now(), stopped = false, seq = 0,
    timer = setInterval(() => {
      try {
        if (stopped) return;
        if (abortSignal.aborted) { stop(); return; }           // self-cancel on abort
        onProgress({
          type: "progress",
          toolUseID: `${toolUseID}-heartbeat-${seq++}`,        // synthetic id, never collides with the real one
          data: { type: "tool_heartbeat", toolName,
                  elapsedTimeSeconds: Math.floor((Date.now() - startedAt) / 1000) },
        });
      } catch (err) { (reportError(err), stop()); }            // one throw kills the heartbeat, not the tool
    }, TOOL_HEARTBEAT_INTERVAL_MS);                            // 30_000
  timer.unref();                                              // must never hold the event loop open
  function stop() { if (stopped) return; ((stopped = true), clearInterval(timer)); }
  return stop;
}

// Mapping: rdd→startToolHeartbeat, w$y→noopStop, fIs→TOOL_HEARTBEAT_INTERVAL_MS, qo→AGENT_TOOL_NAME,
//          xe→reportError
```

Caller, in the generic dispatcher's `try/finally`:

```javascript
// :426174-426182
    let ce = n.agentId
        ? () => {}                                                       // subagents do not heartbeat
        : rdd({ toolName: e.name, toolUseID: t, abortSignal: n.abortController.signal, onProgress: p }),
      se;
    try {
      se = await e.call(T, { ...n, toolUseId: t, userModified: F.userModified ?? !1 }, o, i, p);
    } finally {
      ce();                                                              // always stopped
    }
```

### Design notes on the heartbeat

**What it does:** proves liveness for a tool call that produces no output of its own, so the UI and SDK
consumers can render "still running, 4m 30s" instead of appearing hung.

**How it works:**
1. `setInterval` at **30 s** (`fIs`), `unref()`'d so a pending heartbeat can never keep the process alive
   at exit — the difference between a clean exit and a 30 s hang on every session close.
2. `toolUseID` is suffixed `-heartbeat-N`. Progress frames are keyed by `toolUseID`, so reusing the real
   id would let a heartbeat overwrite genuine progress; the counter makes each frame unique.
3. Started **only for the main agent** (`n.agentId` falsy). Subagent tool calls already surface through the
   Agent tool's own progress stream, so heart-beating them would double-count.
4. The `Agent` tool itself is excluded inside the helper (`if (e === qo) return w$y`) — belt and braces
   with (3).
5. `try/finally` around `e.call` guarantees `stop()` runs on success, throw, and abort.

**Why 30 s?** It has to be long enough that a normal tool call (Read, Grep, a fast Bash) never emits one —
so the common case costs nothing — and short enough to beat a human's "is it stuck?" threshold. It is also
comfortably under the SDK/UI stall detectors: the `[Stall]` logging around the same dispatcher
(`:426169`, `:426187`) works in the same time domain.

**Why a separate frame type rather than reusing `bash_progress`?** Because heartbeats are *content-free*
and must be discardable. Four sites drop them explicitly:

| Site | What it drops heartbeats from | Why |
|---|---|---|
| `:425513` | `tengu_tool_use_progress` telemetry | a 10-minute call would emit 20 no-information events |
| `:531054` | the progress-grouping reducer (`if (y.data.type === "tool_heartbeat") continue;`) | they carry no `parentToolUseID`-relevant payload |
| `:822583` | the interactive message reducer (`return;`) | nothing to render as a transcript entry |
| `:756586-756588` | the SDK message adapter (`Ignoring heartbeat/subagent-retry tool_progress frame`) | SDK consumers get liveness from the stream itself |

They *are* forwarded on two paths: the twin-yield SDK engine (`:653393-653402`, `heartbeat: !0`) and the
remote/container progress bridge (`:341123-341131`). `aB_` at `:527581-527593` lists `tool_heartbeat`
among the recognised progress subtypes, so persistence knows about it.

**Key insight:** the heartbeat is the cheapest possible liveness signal — one timer per in-flight
top-level tool call, no I/O, unref'd, and filtered out of everything that would have made it expensive.
The engineering is almost entirely in the *four suppression sites*, not in the emitter.

---

## 2. Timeout auto-background messaging (`.210`)

> Improved the Bash/PowerShell tool message when a command hits its timeout and is auto-backgrounded, so
> the model can distinguish a hang from an explicit background request

**Verdict: NET_NEW, and it is a three-branch replacement of a two-branch conditional.**
`and was moved to the background (ID:` **220=2 / 193=0** (Bash `:438081`, PowerShell `:431180`);
`timedOutAfterMs` **220=9 / 193=0**.

Side by side, same function, Bash tool:

```javascript
// ============================================
// BashTool.mapToolResultToToolResultBlockParam (background branch) - 2-way becomes 3-way
// Location: cli_inner_pretty.js:438076-438088   (193 counterpart :459139-459145 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
      let y = "";
      if (o) {
        let _ = ly(o);
        if (i) y = `Command was manually backgrounded by user with ID: ${o}. Output is being written to: ${_}`;
        else if (s !== void 0)
          y = `Command did not complete within its ${Math.max(1, Math.round(s / 1000))}s timeout and was moved to the background (ID: ${o}). Output is being written to: ${_}. You will be notified when it completes. To check interim output, use ${zi} on that file path.`;
        else
          y = `Command running in background with ID: ${o}. Output is being written to: ${_}. You will be notified when it completes. To check interim output, use ${zi} on that file path.`;
        if (a) y += `\n${a}`;
      }

// ORIGINAL (2.1.193, for contrast — cli_inner_pretty.js:459139-459145 (193)):
      let m = "";
      if (o) {
        let g = wm(o);
        if (s) m = `Command was manually backgrounded by user with ID: ${o}. Output is being written to: ${g}`;
        else
          m = `Command running in background with ID: ${o}. Output is being written to: ${g}. You will be notified when it completes. To check interim output, use ${Ls} on that file path.`;
      }

// READABLE (for understanding, 2.1.220):
      let backgroundNote = "";
      if (backgroundTaskId) {
        let outPath = displayPath(backgroundTaskId);
        if (backgroundedByUser)                                    // Ctrl+B
          backgroundNote = `Command was manually backgrounded by user with ID: ${backgroundTaskId}. Output is being written to: ${outPath}`;
        else if (timedOutAfterMs !== undefined)                    // NEW third case
          backgroundNote = `Command did not complete within its ${Math.max(1, Math.round(timedOutAfterMs / 1000))}s timeout and was moved to the background (ID: ${backgroundTaskId}). ...`;
        else                                                       // model asked for run_in_background
          backgroundNote = `Command running in background with ID: ${backgroundTaskId}. ...`;
        if (backgroundCwdHint) backgroundNote += `\n${backgroundCwdHint}`;   // NEW, see §3
      }

// Mapping: o→backgroundTaskId, i→backgroundedByUser, s→timedOutAfterMs, a→backgroundCwdHint,
//          ly→displayPath, zi→"Read"
```

The result shape carries the new field with a self-documenting zod description:

```
:437859-437862   timedOutAfterMs: v.number().optional()
                   .describe("Set when the command hit its timeout and was auto-backgrounded; the timeout value in ms"),
```

**Why the three-way split matters to the model.** All three cases previously collapsed to "running in
background", which is *behaviourally identical* but *semantically opposite*: `run_in_background: true`
means "I chose this"; a timeout means "my assumption about how long this takes was wrong". The
`Math.max(1, Math.round(s / 1000))` formatting turns the internal ms value into the same unit the model
supplied in `timeout`, so the model can compare its own input to the outcome and raise it next call. The
`Math.max(1, …)` floor prevents the nonsensical `"0s timeout"` for sub-second values.

### 2.1 The auto-background trigger, and a genuinely new env override

`timedOutAfterMs` is set in exactly one place, the `onTimeout` handler:

```javascript
// :437653-437657
  if (M.onTimeout && L)
    M.onTimeout((G) => {
      ((C = P), U("tengu_bash_command_timeout_backgrounded", G));
    });
```

`C` is `timedOutAfterMs`, and it is assigned `P` — the **effective** timeout, not the requested one:

```javascript
// ============================================
// resolveEffectiveBashTimeout - lets an env var shorten the timeout so auto-backgrounding fires sooner
// Location: cli_inner_pretty.js:401263-401270
// ============================================

// ORIGINAL (for source lookup):
function cHo({ requestedTimeoutMs: e, isMainAgent: t, canAutoBackground: r, env: n = process.env }) {
  if (!t || !r) return e;
  let o = n.CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS;
  if (!o) return e;
  let i = Fd(o);
  if (isNaN(i) || i <= 0) return e;
  return Math.min(e, Math.max(i, HVy));
}
var xVy = 120000, kVy = 600000, HVy = 2000;

// READABLE (for understanding):
function resolveEffectiveBashTimeout({ requestedTimeoutMs, isMainAgent, canAutoBackground, env = process.env }) {
  if (!isMainAgent || !canAutoBackground) return requestedTimeoutMs;   // only the main agent auto-backgrounds
  let raw = env.CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS;
  if (!raw) return requestedTimeoutMs;
  let ms = parseIntSafe(raw);
  if (isNaN(ms) || ms <= 0) return requestedTimeoutMs;                  // bad value -> ignored, not fatal
  return Math.min(requestedTimeoutMs, Math.max(ms, MIN_AUTO_BACKGROUND_TIMEOUT_MS));   // 2000 floor
}
const DEFAULT_BASH_TIMEOUT_MS = 120000, BASH_TIMEOUT_CEILING_MS = 600000,
      MIN_AUTO_BACKGROUND_TIMEOUT_MS = 2000;

// Mapping: cHo→resolveEffectiveBashTimeout, Fd→parseIntSafe, HVy→MIN_AUTO_BACKGROUND_TIMEOUT_MS,
//          xVy→DEFAULT_BASH_TIMEOUT_MS, kVy→BASH_TIMEOUT_CEILING_MS
```

`CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` is **220=1 / 193=0** and `canAutoBackground` is
**220=3 / 193=0** — both net-new. But `shouldAutoBackground` is **220=3 / 193=3**, so the
auto-background *mechanism* is carryover; what is new is the ability to make it fire earlier and the
plumbing that records *which* timeout fired.

**Why the two clamps?** `Math.min(requested, …)` guarantees the override can only *shorten*, never extend
past the model's own `timeout` or the 600 s ceiling (`Ahr()`/`kVy`). `Math.max(ms, 2000)` stops a
mistyped `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS=1` from backgrounding every command instantly. Both
failure directions are bounded, and a non-numeric value is silently ignored rather than throwing — the
usual pattern in this codebase for env overrides that must never break a session.

Not every command is eligible. `Kr_` (`:437470-437483`) refuses when the parsed command is not a
`"simple"` pipeline, when any segment matches a disqualifying predicate, or when the leading word is in
`Wr_` — which is `["sleep"]` (`:437812`). Backgrounding a `sleep` would be pointless: the command *is*
the wait.

---

## 3. `cd` after auto-backgrounding (`.210`)

> Fixed Claude assuming a `cd` took effect after its command was moved to the background; the tool result
> now states the working directory is unchanged

**Verdict: NET_NEW message over a CARRYOVER detector.** `Session cwd remains` **220=1 / 193=0**;
`directory changes made by the backgrounded command` **220=1 / 193=0**. But the detector that decides
whether to emit it is byte-identical to 193:

```javascript
// ============================================
// commandChangesDirectory - byte-identical in both bundles
// Location: cli_inner_pretty.js:394706-394711   (193: :460972-460977 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
function H2e(e) {
  let t = LH(rae(e))[0];
  return t === "cd" || t === "pushd" || t === "popd" || t === "chdir";
}
function nmr(e) {
  return $E(e).some((t) => H2e(t.trim()));
}

// ORIGINAL (2.1.193 — same body, different mangling, cli_inner_pretty.js:460972-460977 (193)):
function eue(e) { let t = DE(IW(e))[0]; return t === "cd" || t === "pushd" || t === "popd" || t === "chdir"; }
function j9t(e) { return Hy(e).some((t) => eue(t.trim())); }

// READABLE (for understanding):
function segmentIsDirectoryChange(segment) {
  let firstWord = tokenize(stripRedirects(segment))[0];
  return firstWord === "cd" || firstWord === "pushd" || firstWord === "popd" || firstWord === "chdir";
}
function commandChangesDirectory(command) {
  return splitOnShellOperators(command).some((seg) => segmentIsDirectoryChange(seg.trim()));
}

// Mapping: H2e→segmentIsDirectoryChange, nmr→commandChangesDirectory, $E→splitOnShellOperators,
//          LH→tokenize, rae→stripRedirects
```

The new part is one conditional in the Bash `call`:

```javascript
// :438254-438258
        F =
          _.backgroundTaskId && nmr(e.command)
            ? `Session cwd remains ${Ht()}; directory changes made by the backgrounded command do not apply to subsequent commands.`
            : void 0,
```

and its zod field:

```
:437863-437869   backgroundCwdHint: v.string().optional().describe(
  "Model-facing note that the session cwd was not changed by a backgrounded command containing a
   directory-change builtin (cd/pushd/popd/chdir)"),
```

### Why this is the right fix

The Bash tool maintains a **persistent session cwd** (`Ht()`), and a normal `cd /x && make` genuinely
moves it for subsequent calls — the PowerShell descriptor even writes the post-command directory to a temp
file for exactly this (`(Get-Location).Path | Out-File …`, `:169532`). When the command is *backgrounded*
the shell that ran the `cd` is detached, so the session cwd is untouched, and the model's mental model
silently diverges. Every later relative path is then wrong.

Three implementation choices are worth naming:

1. **The hint carries the absolute cwd** (`${Ht()}`), not just "cwd unchanged". Telling the model the value
   is strictly more useful than telling it the negation.
2. **It is conditional on `nmr(e.command)`.** Emitting it on every backgrounded command would train the
   model to ignore it.
3. **It is appended to the background note**, not to stdout (`if (a) y += "\n" + a`, `:438086-438087`),
   so it survives the `[m, g, y, d, p].filter(Boolean).join("\n")` assembly even when stdout is empty.

The 193 code had `nmr`'s twin sitting unused for this purpose — the detector was already there for the
*permission* analyser (`:394334`, `:394484` use it for cd-compound rules). The fix cost one ternary
because the hard part had shipped 25 releases earlier.

---

## 4. `pkill -f` killing the CLI (`.214`)

> Fixed Bash tool killing the Claude session when a `pkill -f` pattern accidentally matched the CLI's own
> process (Linux)

**Verdict: NET_NEW, and the implementation is a shell function injected into the snapshot, not JS.**
`pkill: refusing to run` **220=1 / 193=0**; `unalias pkill` **220=1 / 193=0**;
`Shadow pkill to refuse patterns matching the CLI process` **220=1 / 193=0**;
`CLAUDE_PID` **220=5 / 193=0**.

```javascript
// ============================================
// buildPkillShimSnippet - a bash function that pre-checks pgrep before delegating to real pkill
// Location: cli_inner_pretty.js:313507-313534
// ============================================

// ORIGINAL (for source lookup) - the emitted shell text, one array element per line:
function AHy() {
  return [
    "unalias pkill 2>/dev/null || true",
    "function pkill {",
    '  if [ -n "${CLAUDE_PID:-}" ] && [ -r "/proc/${CLAUDE_PID}/comm" ]; then',
    '    local _cc_skip="" _cc_a',
    "    local -a _cc_probe=()",
    '    for _cc_a in ${1+"$@"}; do',
    '      if [ -n "$_cc_skip" ]; then _cc_skip=""; continue; fi',
    '      case "$_cc_a" in',
    "        --signal) _cc_skip=1 ;;",
    "        --signal=*|-e|--echo) ;;",
    "        -[0-9]*) ;;",
    '        -[PUGOF]?*) _cc_probe+=("$_cc_a") ;;',
    "        -[ABCDEFGHIJKLMNOPQRSTUVWXYZ][ABCDEFGHIJKLMNOPQRSTUVWXYZ0-9]*) ;;",
    '        *) _cc_probe+=("$_cc_a") ;;',
    "      esac",
    "    done",
    '    if command pgrep ${_cc_probe[@]+"${_cc_probe[@]}"} 2>/dev/null | command grep -qx "${CLAUDE_PID}"; then',
    "      printf 'pkill: refusing to run \u2014 this pattern matches the Claude CLI process (PID %s). Narrow the pattern, or target your own children with `pkill -P $$ ...`.\\n' \"${CLAUDE_PID}\" >&2",
    "      return 1",
    "    fi",
    "  fi",
    '  command pkill ${1+"$@"}',
    "}",
  ].join(`\n`);
}

// READABLE (for understanding) - the same logic as a shell function:
//   pkill() {
//     if [ -n "$CLAUDE_PID" ] && [ -r "/proc/$CLAUDE_PID/comm" ]; then    # Linux only
//       probe=()                                    # rebuild argv as a *pgrep* argv
//       for a in "$@"; do
//         skip-the-value-of --signal                 # --signal SIGTERM  -> drop both words
//         drop --signal=X, -e, --echo                # pkill-only, pgrep would reject or change meaning
//         drop -SIGNUM  (-9, -15)                    # pkill-only
//         keep -P/-U/-G/-O/-F with an attached value  # selectors pgrep shares
//         drop other bare uppercase-cluster flags
//         keep everything else                        # the pattern and pgrep-compatible flags
//       done
//       if pgrep "${probe[@]}" | grep -qx "$CLAUDE_PID"; then
//         printf 'pkill: refusing to run ...' >&2; return 1
//       fi
//     fi
//     command pkill "$@"
//   }

// Mapping: AHy→buildPkillShimSnippet
```

Installation, in the shell-snapshot generator (`:313654-313661`):

```
      let s = AHy();
      o += `
      echo "# Shadow pkill to refuse patterns matching the CLI process" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'PKILL_FUNC_END'
${s}
PKILL_FUNC_END
    `;
```

`CLAUDE_PID` is exported into every child shell at `:168428` (`CLAUDE_PID: String(process.pid)`, alongside
`CLAUDECODE`, `CLAUDE_CODE_SESSION_ID`, `CLAUDE_CODE_CHILD_SESSION`) and is listed in the
**preserved-env-var set** `_Hy` at `:313427` so the snapshot cannot drop it.

### Why a shell shim rather than a permission rule

**What it does:** converts a session-fatal `pkill -f node` into a non-zero exit with an actionable message.

**How it works:**
1. The whole shim is inert unless `/proc/$CLAUDE_PID/comm` is readable — i.e. **Linux only**, exactly as
   the bullet says. On macOS/BSD the function falls straight through to `command pkill`.
2. `pkill`'s selection semantics are re-expressed as a `pgrep` invocation. This is the hard part: `pkill`
   and `pgrep` share the *matching* flags but not the *action* flags, so `-9`, `--signal`, `-e`/`--echo`
   must be stripped or `pgrep` errors out and the guard silently degrades. The `case` arms encode that
   split.
3. `grep -qx "${CLAUDE_PID}"` — anchored whole-line match, so PID `123` does not match `1234`.
4. `command pkill`/`command pgrep`/`command grep` bypass the function itself and any user aliases,
   preventing infinite recursion.
5. `${1+"$@"}` is the portable "expand only if there is at least one arg" idiom — needed because
   `set -u` plus a bare `"$@"` on an empty argv is an error in older bashes.

**Why refuse instead of filtering?** Silently removing the CLI's PID from the kill set would leave the
model believing it killed something it did not, and `pkill` has no way to express "all matches except
this one". Refusing with exit 1 plus the concrete alternative (`pkill -P $$ ...`, i.e. only my own
children) puts the correction in the model's hands.

**Why in the snapshot rather than in the permission analyser?** Because the analyser cannot evaluate the
pattern — `pkill -f "$PATTERN"` where the value comes from a variable is exactly the case the auto-mode
classifier calls `Unverifiable Deletion Target` (ground truth §4.6). Only the shell, at execution time,
knows what the pattern matches. This is the same architectural choice as the `find`/`grep` shims
(`vHy`, `:313479-313506`), which shadow those commands to inject exclusion flags — but note that one is
gated on `iM()` (`:269047`) while the pkill shim is **unconditional**.

**Failure mode worth flagging:** the shim is a *shell function* in a snapshot file. A command that
bypasses the snapshot — `env -i bash -c 'pkill -f node'`, or a script invoked directly — is unprotected.
The guard raises the cost of the accident; it does not close the hole.

---

## 5. PowerShell: five fixes in one descriptor (`.214` ×4, `.196`)

Bullets `.214` #21/#22/#23/#25 and `.196` #8 all resolve into `tcu` (`:169515-169559`) and its two
constants. The 2.1.193 counterpart is `xwa` at `:301552-301586 (193)`. Reading them side by side is the
whole analysis.

```javascript
// ============================================
// buildPowerShellShellDescriptor - the PowerShell exec wrapper; five deltas vs 2.1.193
// Location: cli_inner_pretty.js:169515-169559   (193: :301552-301586 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220 — abridged to the changed parts):
function tcu(e) {
  let t;
  return {
    type: "powershell",
    shellPath: e,
    detached: !1,
    stdin: "ignore",                                                        // <-- DELTA 1
    async buildExecCommand(r, n) {
      ...
      let s = `
; $_ec = if ($null -ne $LASTEXITCODE) { $LASTEXITCODE } elseif ($?) { 0 } else { 1 }
; (Get-Location).Path | Out-File -FilePath ${yrr(o, "the temp-directory path (override with CLAUDE_CODE_TMPDIR)")} -Encoding utf8 -NoNewline
; if ($ExecutionContext.SessionState.LanguageMode -eq 'FullLanguage') { $host.SetShouldExit($_ec) } else { exit $_ec }`,
        l = (M$g(r) ? "" : P$g) + r + s;                                    // <-- DELTA 2 (prologue)
      return {
        commandString:
          n.useSandbox && Mt() !== "windows"                                // <-- DELTA 3
            ? [`'${e.replace(/'/g, "'\\''")}'`, ...Des(), "-EncodedCommand", Jio(l)].join(" ")
            : l,
        cwdFilePath: o,
      };
    },
    getSpawnArgs(r) { return Y9r(r); },
    async getEnvironmentOverrides(r, n) {
      let o = { ...Klu(process.env) },                                      // <-- DELTA 4
        i = process.env.FORCE_COLOR !== void 0 || n?.has("FORCE_COLOR");
      for (let [s, a] of Object.entries(O$g)) {                             // <-- DELTA 5
        if (process.env[s] !== void 0) continue;
        if (s === "NO_COLOR" && i) continue;
        o[s] = a;
      }
      if (n) for (let [s, a] of n) o[s] = a;
      if (t) ((o.TMPDIR = t), (o.CLAUDE_CODE_TMPDIR = Hw()));
      return o;
    },
  };
}
// :169564
P$g = "try { $PSDefaultParameterValues['Out-File:Encoding'] = 'utf8' } catch {}; if ($ExecutionContext.SessionState.LanguageMode -eq 'FullLanguage') { try { $OutputEncoding = [System.Text.UTF8Encoding]::new() } catch {}; if ($null -ne $PSStyle) { try { $PSStyle.OutputRendering = 'PlainText' } catch {} } }; ",
// :169575
  O$g = { PYTHONIOENCODING: "utf-8:surrogateescape", NO_COLOR: "1" };

// ORIGINAL (2.1.193, the same three places — cli_inner_pretty.js:301553-301586 (193)):
//   type: "powershell", shellPath: e, detached: !1,          <-- NO stdin key
//   ...  let a = n + i;                                      <-- NO prologue
//   commandString: r.useSandbox ? [ ... "-EncodedCommand" ... ] : a,   <-- no platform check
//   async getEnvironmentOverrides(n, r) { let o = {};        <-- EMPTY base env, no O$g

// READABLE (for understanding) - the five deltas:
//   1. stdin: "ignore"                       -> child inherits a closed stdin; a program that reads
//                                               stdin gets EOF immediately instead of blocking forever.
//   2. prologue P$g, conditionally prefixed  -> forces UTF-8 for redirects and $OutputEncoding, and
//                                               PlainText rendering so PS7 errors carry no ANSI escapes.
//   3. -EncodedCommand only off-Windows      -> on Windows the raw command string is passed through.
//   4. base env = filtered process.env       -> 193 passed {} and lost the parent environment.
//   5. O$g defaults, only if unset by user   -> PYTHONIOENCODING + NO_COLOR, with a FORCE_COLOR veto.

// Mapping: tcu→buildPowerShellShellDescriptor, P$g→POWERSHELL_ENCODING_PROLOGUE,
//          O$g→POWERSHELL_ENV_DEFAULTS, M$g→scriptRequiresLeadingStatement,
//          Klu→filterInheritableEnv, Mt→currentPlatform, Hw→claudeTmpDir
```

Anchor counts for each delta:

| Delta | Anchor | 220 | 193 |
|---|---|---|---|
| 2 (prologue) | `PSDefaultParameterValues` | 1 | 0 |
| 2 (prologue) | `Out-File:Encoding` | 1 | 0 |
| 2 (prologue) | `OutputEncoding = [System.Text.UTF8Encoding]` | 1 | 0 |
| 2 (prologue) | `OutputRendering` | 1 | 0 |
| 5 (env) | `PYTHONIOENCODING` | 1 | 0 |
| 5 (env) | `utf-8:surrogateescape` | 1 | 0 |
| — (carryover) | `$_ec = if ($null -ne $LASTEXITCODE)` | 1 | **1** |
| — (carryover) | `SetShouldExit` | 1 | **1** |
| 2 (guard) | `LanguageMode` | 2 | **1** |

### 5.1 The prologue guard is the cleverest line

`(M$g(r) ? "" : P$g) + r + s` — the prologue is **skipped** when `M$g(r)` is true.

```javascript
// ============================================
// scriptRequiresLeadingStatement - detects PowerShell text whose first statement must stay first
// Location: cli_inner_pretty.js:169507-169514 (tail of the scanner starting :169486)
// ============================================

// ORIGINAL (for source lookup):
  let r = e.slice(t);
  return (
    /^using\s+(namespace|module|assembly)\b/i.test(r) ||
    /^param\s*\(/i.test(r) ||
    /^(begin|process|end|clean|dynamicparam)\s*\{/i.test(r) ||
    (/^\[\w/.test(r) && !/^\[[\w.]+\]::/.test(r))
  );

// READABLE (for understanding):
  let body = source.slice(scanPos);              // scanPos has already skipped whitespace and <# #> blocks
  return (
    /^using\s+(namespace|module|assembly)\b/i.test(body) ||     // `using` must precede everything
    /^param\s*\(/i.test(body) ||                                // param() must be the first statement
    /^(begin|process|end|clean|dynamicparam)\s*\{/i.test(body) ||// advanced-function blocks
    (/^\[\w/.test(body) && !/^\[[\w.]+\]::/.test(body))         // an attribute [CmdletBinding()] ...
  );                                                            // ... but NOT a static call [Math]::Abs(1)

// Mapping: M$g→scriptRequiresLeadingStatement
```

**Why:** PowerShell rejects a script where `using namespace`, `param(...)`, a `begin{}`/`process{}` block,
or a leading attribute is preceded by any other statement. Unconditionally prefixing the encoding prologue
would have broken every such script with a parse error. The scanner first steps over leading whitespace
and `<# … #>` comment blocks (`:169480-169506`) so a documented script is still recognised.

The fourth arm is the subtle one: `/^\[\w/` catches `[CmdletBinding()]` (an attribute, must be first) while
`!/^\[[\w.]+\]::/` excludes `[System.Math]::Abs(1)` (a static member call, an ordinary expression that can
be preceded by anything). Without the negative test, every script starting with a .NET static call would
lose its encoding fix.

**Trade-off accepted:** scripts that need a leading statement get **no** encoding fix — their redirects can
still produce UTF-16LE on PowerShell 5.1. That is a deliberate correctness-over-coverage choice: a parse
error is worse than a mojibake file.

### 5.2 Why each element of the prologue is there

- `$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'` — on **Windows PowerShell 5.1** the `>` and
  `>>` operators route through `Out-File`, whose default encoding is `Unicode` (UTF-16LE). Setting the
  default parameter value is the only way to change `>` behaviour without rewriting the command. This is
  `.214` #25 verbatim.
- `$OutputEncoding = [System.Text.UTF8Encoding]::new()` — governs the encoding used when piping to a
  *native* executable, which is how a Python child receives its stdin.
- `$PSStyle.OutputRendering = 'PlainText'` — PowerShell 7 colours error records with ANSI escapes even
  when stdout is not a TTY; `PlainText` strips them. `$null -ne $PSStyle` guards 5.1, where `$PSStyle`
  does not exist. This is the second half of `.214` #23.
- Every assignment is individually wrapped in `try {} catch {}`, and the last two are additionally inside
  `if (LanguageMode -eq 'FullLanguage')` — in **ConstrainedLanguage** mode (the AppLocker/WDAC
  configuration) constructing `[System.Text.UTF8Encoding]` throws. Note the pre-existing
  `LanguageMode` check in the *epilogue* (`SetShouldExit` vs `exit`) was already handling the same
  constraint in 193; the prologue reuses the pattern, which is why the literal count went 1 → 2.

### 5.3 The environment deltas

`O$g = { PYTHONIOENCODING: "utf-8:surrogateescape", NO_COLOR: "1" }` (`:169575`), applied with two vetoes:

```javascript
        if (process.env[s] !== void 0) continue;              // never override a user's explicit value
        if (s === "NO_COLOR" && i) continue;                  // FORCE_COLOR wins over our NO_COLOR
```

`PYTHONIOENCODING=utf-8:surrogateescape` fixes **both** `.214` #22 and #23 with one value: `utf-8` sets
the codec (so non-ASCII output encodes instead of raising `UnicodeEncodeError`), and the
`:surrogateescape` error handler makes *decoding* undecodable stdin bytes lossless-and-non-fatal instead
of raising `UnicodeDecodeError`. Choosing `surrogateescape` over `replace` matters: bytes survive a
read-modify-write round trip.

`i = process.env.FORCE_COLOR !== void 0 || n?.has("FORCE_COLOR")` checks both the process env **and** the
per-call override map, so a caller that sets `FORCE_COLOR` for one command is respected.

Delta 4 — `let o = { ...Klu(process.env) }` replacing 193's `let o = {}` — is the largest behavioural
change here and is not in any bullet: in 193 the PowerShell descriptor returned an **empty** override
object, so whatever the spawn layer did with it determined the child's environment. 220 seeds it from a
filtered copy of the parent env. Recording it as an **undocumented delta**.

### 5.4 CARRYOVER trap: `.214` #24 and `.196` #8 are not in this bundle's diff

> `.214` #24 — Fixed the PowerShell tool reporting `where.exe`, `fc.exe`, and `diff.exe` as errors when
> they return a valid negative answer (Windows)

`where.exe` **220=4 / 193=4**, and the "commands whose non-zero exit is a legitimate answer" set at
`:430984` — `new Set(["select-string", "get-childitem", "findstr", "where.exe"])` — is byte-identical to
193's `Vnf`. `fc.exe` and `diff.exe` are **0 in both**. So either the fix
is in the exit-code *interpreter* table rather than this set, or it did not land in the client. Marked
**CARRYOVER-trap / unresolved** — do not write this up as implemented.

> `.196` #8 — Fixed PowerShell `git diff`/`git grep`, `egrep`/`fgrep`, and quoted search patterns
> containing `|` being reported as failures when they exit 1

`LASTEXITCODE` 220=1 / 193=1; `git grep` 1/1; `egrep` 220=9 / 193=8. The `$_ec` epilogue is byte-identical.
The +1 on `egrep` is a single new site; the exit-code semantics themselves are carryover. Marked
**UNANCHORED** for the PowerShell path.

---

## 6. SIGTERM in print/SDK mode (`.212`)

> Fixed SIGTERM during a running Bash tool orphaning the command's process tree in print/SDK mode; the
> CLI now aborts the turn, kills the tree, and exits 143

**Verdict: DELTA — exactly one new signal handler.** The delta is *not* the tree kill:
`killProcessTree` **220=1 / 193=1**, `process.kill(-` **220=10 / 193=10** — both pure carryover. The
tree killer already existed and fires from the Bash tool's abort signal. What was missing was anything
that *aborted* on SIGTERM in the print/stream-json entry point.

`process.on("SIGTERM"` registrations, both bundles:

| 2.1.220 | 2.1.193 | What |
|---|---|---|
| `:522444` | `:310272 (193)` | main REPL shutdown handler |
| `:540512` | `:352714 (193)` | generic exit hook |
| `:547192` | `:570086 (193)` | bridge shutdown |
| `:871533` | `:717877 (193)` | `claude daemon run` |
| **`:845671`** | **— (none)** | **print / stream-json loop — NEW** |

```javascript
// ============================================
// print-mode SIGTERM handler - aborts the turn's controllers, then exits 143
// Location: cli_inner_pretty.js:845664-845671
// ============================================

// ORIGINAL (for source lookup):
  let ce = () => {
    if ((Sr("info", "shutdown_signal", { signal: "SIGINT" }), W && !W.signal.aborted)) W.abort(VC("user-cancel"));
    (G.abort(), fWe(), Ds(0));
  };
  process.on("SIGINT", ce);
  let se = () => {
    if (W && !W.signal.aborted) W.abort(VC("shutdown"));
    (G.abort(), Ds(143));
  };
  if (
    (process.on("SIGTERM", se),

// READABLE (for understanding):
  let onSigint = () => {
    logStructured("info", "shutdown_signal", { signal: "SIGINT" });
    if (queryController && !queryController.signal.aborted)
      queryController.abort(abortReason("user-cancel"));
    outerController.abort(); signalShutdownRequested(); exitProcess(0);      // Ctrl+C is a clean exit
  };
  process.on("SIGINT", onSigint);
  let onSigterm = () => {
    if (queryController && !queryController.signal.aborted)
      queryController.abort(abortReason("shutdown"));                        // <- this is what kills the tree
    outerController.abort(); exitProcess(143);                               // 128 + SIGTERM(15)
  };
  process.on("SIGTERM", onSigterm);

// Mapping: ce→onSigint, se→onSigterm, W→queryController, G→outerController, VC→abortReason,
//          Ds→exitProcess, fWe→signalShutdownRequested, Sr→logStructured
```

The `W.abort(VC("shutdown"))` is the load-bearing call: `W.signal` is the abort signal threaded into every
tool call (`t.signal` inside the Bash `call`), and the pre-existing shell-cleanup path listens on it. So
the fix is "propagate the signal into the abort graph the tools already respect", and the tree kill and
exit code follow for free.

Two asymmetries worth noting between the two handlers: SIGINT logs `shutdown_signal` and calls
`signalShutdownRequested()`; SIGTERM does neither, and exits 143 rather than 0. SIGINT is a user gesture
(clean), SIGTERM is external termination (exit non-zero so a supervisor sees it), and 143 = 128 + 15 is
the POSIX convention.

**Decoy warning:** grepping `143)` in 2.1.220 also hits `:750935` — `let bm = wLn.c(143)` — which is a
React hook-index in minified UI code, nothing to do with signals. Two of the three `143)` hits are real
(`:522459` main REPL, `:845668` print mode) and one is noise.

`.212` #30's third clause ("false `Command timed out` on exit code 143") is separate: `Command timed out`
is **220=1 / 193=1**, so that literal is carryover — **CARRYOVER-trap**.

---

## 7. Windows working-directory loss (`.205`) — mostly carryover, one new refusal

> Fixed a Windows crash when the launch directory is deleted, locked, or unmounted mid-command

`Working directory "…" no longer exists. Please restart Claude from an existing directory.`
**220=1 / 193=1** and `was deleted; shell cwd recovered to` **220=1 / 193=1**. The recovery ladder is
carryover: try session cwd → `homedir()` → a third candidate, take the first whose `realpath` resolves
(`:314176-314184`), and if index > 0 tell the model to re-issue.

The new material at the same site is a **worktree-isolation refusal** (`:314186-314196`):

```javascript
    if (p && oe === 0)
      return (
        w(`[worktree] blocked shell exec: cwd "${T}" is gone and recovery targets the shared checkout; agentWorktree=${p}`, { level: "warn" }),
        O("tengu_agent_worktree_cwd_escape_blocked", { reason: Ee("worktree_gone") }),
        _8e(`This agent is isolated in the worktree ${p}, but its working directory "${T}" no longer exists and the only recovery target is the parent session's shared checkout. Refusing to run there — the isolation worktree appears to have been removed. Report this instead of retrying.`)
      );
```

`tengu_agent_worktree_cwd_escape_blocked` (`:314192`) is in the 326-new-gate list; it has four `reason`
values in 2.1.220 — `context_lost` `:314164`, `worktree_gone` `:314192`, `shared_checkout` `:314210`,
`command_redirect` `:314220`. The reasoning is sound and worth
stating: the generic recovery would silently move an isolated agent into the **parent's shared checkout**,
turning a crash into a containment breach. Better to refuse. Note `oe === 0` means the recovery target is
candidate 0 (`gn()`, the session cwd root) — only that specific target is dangerous.

So: `.205` #11 is **carryover for the crash fix**, with a new adjacent security refusal that belongs to
`36_background_agents` / `49_sandbox` as much as here.

---

## 8. `CLAUDE_CODE_GIT_BASH_PATH` (`.219`)

> Fixed `CLAUDE_CODE_GIT_BASH_PATH` on Windows exiting or being used as bash when the path isn't a
> bash/sh binary; it's now ignored with a warning

**Verdict: NET_NEW, two-part, and the "exiting" half is a genuine `process.exit(1)` removal.**
`is not a bash/sh binary` **220=1 / 193=0**; `falling back to auto-detection` **220=1 / 193=0**;
`CLAUDE_CODE_GIT_BASH_PATH` 220=6 / 193=5.

```javascript
// ============================================
// resolveGitBashPath - validate the env override, warn and fall back instead of exiting
// Location: cli_inner_pretty.js:51199-51209   (193: :47857-47864 (193))
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
    if (Z.CLAUDE_CODE_GIT_BASH_PATH) {
      let n = GOe.basename(Z.CLAUDE_CODE_GIT_BASH_PATH).toLowerCase(),
        o = ["bash.exe", "sh.exe", "bash", "sh"].includes(n);
      if (o && e(Z.CLAUDE_CODE_GIT_BASH_PATH)) return Z.CLAUDE_CODE_GIT_BASH_PATH;
      w(
        `CLAUDE_CODE_GIT_BASH_PATH "${Z.CLAUDE_CODE_GIT_BASH_PATH}" ${o ? "not found" : "is not a bash/sh binary"}; falling back to auto-detection`,
        { level: "warn" },
      );
    }

// ORIGINAL (2.1.193 — cli_inner_pretty.js:47857-47864 (193)):
    if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
      if (e(process.env.CLAUDE_CODE_GIT_BASH_PATH)) return process.env.CLAUDE_CODE_GIT_BASH_PATH;
      (console.error(
        `Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`,
      ),
        process.exit(1));
    }

// READABLE (for understanding, 2.1.220):
    if (env.CLAUDE_CODE_GIT_BASH_PATH) {
      let base = win32.basename(env.CLAUDE_CODE_GIT_BASH_PATH).toLowerCase(),
        looksLikeShell = ["bash.exe", "sh.exe", "bash", "sh"].includes(base);
      if (looksLikeShell && existsSync(env.CLAUDE_CODE_GIT_BASH_PATH))
        return env.CLAUDE_CODE_GIT_BASH_PATH;                          // accepted
      logLine(`CLAUDE_CODE_GIT_BASH_PATH "${...}" ${looksLikeShell ? "not found" : "is not a bash/sh binary"}; `
            + `falling back to auto-detection`, { level: "warn" });
      // fall through to the standard probe list
    }
    // C:\Program Files\Git\bin\bash.exe, C:\Program Files (x86)\..., then <git>/../../bin/bash.exe

// Mapping: DQ→resolveGitBashPath (memoised via Vr), GOe→pathWin32, Z→envAccessor, w→logLine
```

Two distinct bugs, one function:

1. **"exiting"** — 193 called `process.exit(1)` on a missing path, from inside a **memoised lazy getter**
   (`Vr(...)` / `xn(...)`). Any code path that happened to touch git-bash resolution killed the CLI, even
   when git-bash was not required. 220 warns and continues.
2. **"used as bash when not a bash binary"** — 193 checked only `existsSync`. Pointing the variable at,
   say, `C:\Program Files\Git\cmd\git.exe` produced an existing file that was then invoked as a shell.
   220 requires the **basename** to be one of `bash.exe|sh.exe|bash|sh` first.

The ternary in the warning distinguishes the two causes (`"not found"` vs `"is not a bash/sh binary"`),
so the operator learns which mistake they made. The basename-only check is deliberately shallow — reading
the file to confirm it is really a shell would be slow and still spoofable; rejecting the obvious
mistake is the whole intent.

---

## 9. `.203` #10 — `E2BIG` in worktree-heavy repos

> Fixed Bash failing with "argument list too long" in repos with many git worktrees

`E2BIG` **220=3 / 193=1**. The 220 diagnostic at `:313228` measures argv and env separately and explains
that the sandbox deny-path list grows once per registered git worktree. This is primarily a
`49_sandbox` finding (the argv is the sandbox wrapper's, not the user's); recorded here for the ledger and
cross-referenced rather than duplicated.

---

## 10. Verdict table for this document

| Bullet | Version | Verdict | Anchor |
|---|---|---|---|
| periodic progress heartbeat | .214 | **NET_NEW** | `tool_heartbeat` 220=7/193=0, `:340758` |
| timeout auto-background message | .210 | **NET_NEW** | `timedOutAfterMs` 220=9/193=0, `:438081` |
| `cd` after backgrounding | .210 | **NET_NEW message / CARRYOVER detector** | `Session cwd remains` 220=1/193=0, `:438257`; `nmr` identical to 193 `:460972 (193)` |
| `pkill -f` self-match | .214 | **NET_NEW** | `pkill: refusing to run` 220=1/193=0, `:313526` |
| PowerShell stdin hang | .214 | **NET_NEW** | `stdin: "ignore"` at `:169521`; the 193 descriptor has no `stdin` key (`:301555-301557 (193)`) |
| Python UnicodeDecodeError | .214 | **NET_NEW** | `utf-8:surrogateescape` 220=1/193=0, `:169575` |
| Python UnicodeEncodeError + PS7 ANSI | .214 | **NET_NEW** | `OutputRendering` 220=1/193=0, `:169564` |
| `>`/`>>` UTF-16LE | .214 | **NET_NEW** | `Out-File:Encoding` 220=1/193=0, `:169564` |
| `where.exe`/`fc.exe`/`diff.exe` negatives | .214 | **CARRYOVER-trap / unresolved** | `where.exe` 4/4; `VZy` set at `:430984` identical to 193 |
| PowerShell exit-1 false failures | .196 | **UNANCHORED** | `LASTEXITCODE` 1/1, `$_ec` epilogue identical |
| SIGTERM orphans tree in print/SDK | .212 | **DELTA — one new handler** | `:845671`; `killProcessTree` 1/1 carryover |
| Windows launch dir deleted | .205 | **CARRYOVER + new worktree refusal** | messages 1/1; `tengu_agent_worktree_cwd_escape_blocked` new at `:314192` |
| `CLAUDE_CODE_GIT_BASH_PATH` | .219 | **NET_NEW (2 parts)** | `is not a bash/sh binary` 220=1/193=0, `:51206` |
| `E2BIG` worktrees | .203 | **DELTA (sandbox-owned)** | `E2BIG` 220=3/193=1, `:313228` |
| false `Command timed out` on 143 | .212 | **CARRYOVER-trap** | `Command timed out` 1/1 |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows for this window are staged in
> [symbol_additions_v2_1_220_tools.md](../00_overview/symbol_additions_v2_1_220_tools.md).

Key functions in this document:
- `startToolHeartbeat` (`rdd`) - 30 s unref'd liveness timer for top-level tool calls
- `TOOL_HEARTBEAT_INTERVAL_MS` (`fIs`) - `30000`
- `resolveEffectiveBashTimeout` (`cHo`) - `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` clamp with a 2 s floor
- `canAutoBackgroundCommand` (`Kr_`) - simple-pipeline + not-in-`Wr_` eligibility test
- `AUTO_BACKGROUND_EXCLUDED_COMMANDS` (`Wr_`) - `["sleep"]`
- `commandChangesDirectory` (`nmr`) / `segmentIsDirectoryChange` (`H2e`) - cd/pushd/popd/chdir detector, carryover
- `buildPkillShimSnippet` (`AHy`) - injected bash `pkill` wrapper using `pgrep` + `CLAUDE_PID`
- `buildFindGrepShimSnippet` (`vHy`) - sibling shim for `find`/`grep`, gated on `iM()`
- `buildPowerShellShellDescriptor` (`tcu`) - the five-delta PowerShell exec wrapper
- `POWERSHELL_ENCODING_PROLOGUE` (`P$g`) - `Out-File:Encoding` / `$OutputEncoding` / `OutputRendering`
- `POWERSHELL_ENV_DEFAULTS` (`O$g`) - `PYTHONIOENCODING=utf-8:surrogateescape`, `NO_COLOR=1`
- `scriptRequiresLeadingStatement` (`M$g`) - `using`/`param`/`begin{}`/attribute detector that suppresses the prologue
- `resolveGitBashPath` (`DQ`) - basename validation + warn-and-fall-back
- `filterInheritableEnv` (`Klu`) - base env for PowerShell overrides
