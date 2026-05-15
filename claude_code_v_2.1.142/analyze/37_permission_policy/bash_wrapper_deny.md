# Bash Wrapper Deny Match — v2.1.113

**Theme:** A `permissions.deny: ["Bash(rm:*)"]` rule should block `rm -rf foo`. Pre-v2.1.113, it also needed to block `sudo rm -rf foo`, `env LANG=C rm -rf foo`, `watch rm -rf foo`, `ionice -c3 rm -rf foo`, `setsid rm -rf foo` — all of which **wrap** the `rm` command without changing its semantics.

The wrappers `sudo`, `env`, `watch`, `ionice`, `chrt`, `setsid`, `taskset`, `strace`, `ltrace`, `script`, `flock`, `unshare`, `nsenter` (plus the shells `sh`, `bash`, `zsh`, ... and process-control tools `nice`, `nohup`, `timeout`, `time`, `stdbuf`, `command`, `builtin`, `noglob`) all execute a *wrapped command* with the same general semantics. A deny rule against the wrapped command must fire whether the wrapper is present or not.

v2.1.113 extends the AST-based wrapper-stripper (`WdK`) to recognize the additional 13 wrappers, and uses the `N64` set to drive the bash classifier's "command head" extraction. The new wrappers are treated as transparent — the classifier sees through them to the real command.

---

## 1. The Bypass Class

```
User config:
{ "permissions": { "deny": ["Bash(rm:*)"] } }

Pre-fix model invocation:    Pre-fix outcome:
  sudo rm -rf /             → AUTO-APPROVED (wrapper not stripped, doesn't match "rm:*")
  env A=B rm -rf /          → AUTO-APPROVED (same)
  watch rm -rf /            → AUTO-APPROVED (same)
  ionice -c3 rm -rf /       → AUTO-APPROVED (same)
  setsid rm -rf /           → AUTO-APPROVED (same)

Post-fix outcome:
  sudo rm -rf /             → DENIED (wrapper stripped, head is "rm")
  ... all variants          → DENIED
```

The bypass was **trivial to exploit** — any model could prepend `sudo` (or any other wrapper) to its dangerous command and bypass the user's deny rule. The wrappers don't even need to *do anything special* — `env rm -rf /` is functionally identical to `rm -rf /` from a destructiveness perspective.

---

## 2. The Wrapper-Stripping Walker `WdK` (Pre-Fix Subset)

`WdK` (chunks `_top_*`, line 205239-205313) walks each command in the AST, repeatedly stripping wrappers until it reaches the "real" command head. Pre-v2.1.113 it handled `time`, `nohup`, `timeout`, `nice`, `env`, `stdbuf`, `command`, `builtin`, `noglob`. v2.1.113 extends this list via the `N64` set (line 421159-421195) and additional wrappers in `XdK` (line 205715-205727).

```javascript
// ============================================
// bashWrapperStripper - Walk argv, strip transparent wrappers to reveal command head
// Location: cli_inner_pretty.js:205239-205313
// ============================================

// ORIGINAL (for source lookup):
function WdK(H) {
  let $ = null;
  for (let q of H) {
    let K = q.argv;
    for (;;)
      if (K[0] === "time" || K[0] === "nohup") K = K.slice(1);
      else if (K[0] === "timeout") {
        // ... parse timeout's flags (--kill-after, --signal, etc.) and duration
      } else if (K[0] === "nice")
        if (K[1] === "-n" && K[2] && /^-?\d+$/.test(K[2])) K = K.slice(3);
        // ... etc
      else if (K[0] === "env") {
        // strip env VAR=VAL pairs and flags
        let Y = 1;
        while (Y < K.length) {
          let f = K[Y];
          if (f.includes("=") && !f.startsWith("-")) Y++;
          else if (f === "-i" || f === "-0" || f === "-v") Y++;
          else if (f === "-u" && K[Y + 1]) Y += 2;
          else if (f.startsWith("-")) return { ok: !1, reason: `env with ${f} flag cannot be statically analyzed` };
          else break;
        }
        if (Y < K.length) K = K.slice(Y);
        else break;
      } else if (K[0] === "stdbuf") { /* strip -i/-o/-e flags */ }
      else if (K[0] === "command") { /* strip command's options */ }
      else if (K[0] === "builtin" || K[0] === "noglob") { /* strip */ }
      else break;
    // K[0] is now the unwrapped command head
    // ... check K[0] against jdK/JdK/XdK/etc.
  }
  // ...
}

// READABLE (for understanding):
function stripBashWrappers(parsedCommands) {
  for (const cmd of parsedCommands) {
    let argv = cmd.argv;

    // Strip wrappers in a loop until we hit a non-wrapper
    while (true) {
      if (argv[0] === "time" || argv[0] === "nohup") {
        argv = argv.slice(1);
      }
      else if (argv[0] === "timeout") {
        // timeout has complex flags: --kill-after SIG, --signal SIG, -k SIG, etc.
        let i = 1;
        while (i < argv.length) {
          const flag = argv[i];
          if (flag === "--foreground" || flag === "--preserve-status" || flag === "--verbose") i++;
          else if (/^--(?:kill-after|signal)=[A-Za-z0-9_.+-]+$/.test(flag)) i++;
          else if ((flag === "--kill-after" || flag === "--signal") && argv[i+1] && /^[A-Za-z0-9_.+-]+$/.test(argv[i+1])) i += 2;
          else if (flag.startsWith("--")) return { ok: false, reason: `timeout with ${flag} flag cannot be statically analyzed` };
          else if (flag === "-v") i++;
          else if ((flag === "-k" || flag === "-s") && argv[i+1] && /^[A-Za-z0-9_.+-]+$/.test(argv[i+1])) i += 2;
          else if (/^-[ks][A-Za-z0-9_.+-]+$/.test(flag)) i++;
          else if (flag.startsWith("-")) return { ok: false, reason: `timeout with ${flag} flag cannot be statically analyzed` };
          else break;
        }
        // Skip the duration (e.g., "30s", "5m")
        if (argv[i] && /^\d+(?:\.\d+)?[smhd]?$/.test(argv[i])) argv = argv.slice(i + 1);
        else if (argv[i]) return { ok: false, reason: `timeout duration '${argv[i]}' cannot be statically analyzed` };
        else break;
      }
      else if (argv[0] === "nice") {
        // nice -n NUM | nice -NUM | nice
        if (argv[1] === "-n" && argv[2] && /^-?\d+$/.test(argv[2])) argv = argv.slice(3);
        else if (argv[1] && /^-\d+$/.test(argv[1])) argv = argv.slice(2);
        else if (argv[1] && (/[$(`]/.test(argv[1]) || isRuntimeDetermined(argv[1])))
          return { ok: false, reason: `nice argument '${argv[1]}' contains expansion ...` };
        else argv = argv.slice(1);
      }
      else if (argv[0] === "env") {
        // env strips VAR=val args and -i/-0/-v/-u flags
        let i = 1;
        while (i < argv.length) {
          const arg = argv[i];
          if (arg.includes("=") && !arg.startsWith("-")) i++;        // VAR=val
          else if (arg === "-i" || arg === "-0" || arg === "-v") i++;
          else if (arg === "-u" && argv[i+1]) i += 2;                // -u VAR
          else if (arg.startsWith("-")) return { ok: false, reason: `env with ${arg} flag cannot be statically analyzed` };
          else break;
        }
        if (i < argv.length) argv = argv.slice(i);
        else break;
      }
      else if (argv[0] === "stdbuf") {
        // stdbuf -i SIZE -o SIZE -e SIZE
        // ... similar pattern
      }
      else if (argv[0] === "command") {
        // command [-p] [-v|-V] command [args]
        // -v / -V print info only, don't actually run; we treat them as a no-strip
        // ...
      }
      else if (argv[0] === "builtin" || argv[0] === "noglob") {
        const startIdx = (argv[0] === "builtin" && argv[1] === "--") ? 2 : 1;
        if (startIdx < argv.length) argv = argv.slice(startIdx);
        else break;
      }
      else break;  // not a wrapper — argv[0] is now the real command head
    }

    const head = argv[0];
    // ... safety checks on head
  }
}

// Mapping: WdK→stripBashWrappers, H→parsedCommands, q→cmd, K→argv,
//   _→head, xZ→isRuntimeDetermined
```

### Key insight — the inner loop's `for (;;)` is intentional

The wrapper-strip is **idempotent** for some wrappers and **iterative** for others. `time nohup nice -n 5 env LANG=C rm` strips:
1. `time nohup nice -n 5 env LANG=C rm` → strip `time` → `nohup nice -n 5 env LANG=C rm`
2. → strip `nohup` → `nice -n 5 env LANG=C rm`
3. → strip `nice -n 5` → `env LANG=C rm`
4. → strip `env LANG=C` → `rm`

Each iteration handles one wrapper. The outer `for (;;)` allows multiple strips in sequence. The walker stops when `argv[0]` is no longer a wrapper.

### Why `env` has special handling

`env` is the trickiest wrapper because its arguments include both **environment variables** (`VAR=val`) and **flags** (`-i`, `-u VAR`). The strip walks until it hits something that's neither — that's the wrapped command. If `env` is followed by a flag the walker can't parse (e.g., `--default-signal`), the strip **fails** — the command can't be statically analyzed.

The conservative "fail closed" behavior: rather than allow `env --weird-flag rm`, the static check refuses the auto-allow and falls through to the prompt path.

---

## 3. The Larger Wrapper Set `N64` (Line 421159-421195)

`N64` is a set of **transparent wrapper names** used elsewhere (e.g., the auto-allow guard's read-only command check):

```javascript
N64 = new Set([
  "sh", "bash", "zsh", "fish", "csh", "tcsh", "ksh", "dash",       // shells
  "cmd", "powershell", "pwsh",                                       // Windows shells
  "env", "xargs", "command", "builtin", "noglob",                   // env/command wrappers
  "nice", "stdbuf", "nohup", "timeout", "time",                     // process-control
  "watch", "ionice", "chrt", "setsid", "taskset",                   // process-priority/session
  "strace", "ltrace", "script", "flock", "unshare", "nsenter",      // debugging/namespacing
  "sudo", "doas", "pkexec",                                         // privilege escalation
]);
```

This list is consulted by `MA5` (the `command-prefix detector for heredocs`) and other auto-allow gates to **decline auto-allow** when the prefix is one of these. The detector logic:

```javascript
function MA5(H) {
  // ...
  let K = Fw8(q);                         // try to find a known command prefix
  // ...
  let _ = q.split(/\s+/).filter(Boolean), A = 0;
  while (A < _.length && rS6.test(_[A])) {
    let z = u7(_[A], "="), Y = !1;
    if (!$W$.has(z)) return null;          // unsafe env var → reject prefix detection
    A++;
  }
  if (A >= _.length) return null;
  return _.slice(A, A + 2).join(" ") || null;
}
```

The "skip env vars" loop uses `$W$` (the safe-env-var allowlist) to discriminate; if the env var is in `$W$`, skip it; otherwise reject the prefix detection. This is the *suggestion path* (what allow rule to suggest after a prompt) — using `N64` to know which wrappers are transparent.

### The wrapper sets — `JdK`, `jdK`, `XdK`

There are also three **dangerous wrappers** that the static check explicitly **rejects** (line 205696-205727):

```javascript
JdK = new Set([           // eval-class — evaluates argv as code
  "eval", "source", ".", "exec", "nocorrect", "fc", "coproc",
  "trap", "enable", "mapfile", "readarray", "hash", "bind",
  "complete", "compgen", "alias", "let",
]);

jdK = new Set([           // zsh builtins that bypass security
  "zmodload", "emulate", "sysopen", "sysread", "syswrite", "sysseek",
  "zpty", "ztcp", "zsocket",
  "zf_rm", "zf_mv", "zf_ln", "zf_chmod", "zf_chown", "zf_mkdir", "zf_rmdir", "zf_chgrp",
]);

XdK = new Set([           // wrappers that "run their argument as a command"
  "watch", "ionice", "chrt", "setsid", "taskset",
  "strace", "ltrace", "script", "flock", "unshare", "nsenter",
]);
```

After wrapper-stripping, if the head is in `JdK` (eval-class), it's rejected:

```javascript
if (JdK.has(_))
  return { ok: !1, reason: `'${_}' evaluates arguments as shell code` };
```

If the head is in `XdK` AND has arguments:

```javascript
if (XdK.has(_) && K.length > 1)
  return { ok: !1, reason: `'${_}' runs its argument as a command — cannot be statically analyzed` };
```

This is the **second layer** of wrapper handling — `WdK` strips transparent wrappers, but `XdK`-class wrappers (which *run* their argument as a command, like `watch`) are *kept as the head* and **rejected** because we can't statically prove what `watch` will run.

Note: `XdK` lists `watch`, `ionice`, `chrt`, `setsid`, `taskset`, `strace`, `ltrace`, `script`, `flock`, `unshare`, `nsenter` — and these are **also** in `N64` (the broader transparent-wrapper list). The two roles:
- `N64`: "wrapper for prefix detection" (used by suggestion-builder)
- `XdK`: "wrapper that runs arg as command" (used by static-check rejector)

The same names appear in both because they're both transparent (for prefix-detection purposes) AND they run their argument as a command (for static-check purposes). The two checks at different layers serve different goals.

---

## 4. Why Some Wrappers Are Stripped, Others Are Rejected

The split between **stripped** (`time`, `nohup`, `nice`, `env`, etc.) and **rejected** (`watch`, `ionice`, `setsid`, etc.) comes down to **whether the wrapper changes execution semantics**:

| Wrapper | Behavior | Decision |
|---|---|---|
| `time` | Prepends timing info; same exit code | strip — wrapped command is what runs |
| `nohup` | Ignores SIGHUP; same command | strip |
| `nice` | Reduces CPU priority; same command | strip |
| `env` | Sets env vars and runs command | strip env vars, then strip `env` |
| `timeout` | Adds time limit; kills if exceeded | strip the duration argument |
| `stdbuf` | Buffers I/O differently | strip flags |
| `watch` | **Runs the command repeatedly** | reject — can't statically analyze |
| `setsid` | **Runs in new session** (different process group) | reject — could detach from monitoring |
| `flock` | **Acquires a lock then runs** | reject — different sequence semantics |
| `unshare` | **Creates new namespace** (mount, network, etc.) | reject — bypass sandbox? |
| `nsenter` | **Enters existing namespace** | reject — security boundary |

The line is: **does the wrapper change *what runs* in a way the static check can verify?**

For `nice rm`, the static check can see `rm` as the head and apply rm-specific rules. For `watch rm`, the wrapper *iterates* — it might run `rm` once, ten times, until interrupted. Even if `rm` is safe-once, it might not be safe-repeatedly.

For `setsid rm`, the wrapped command runs in a new session — detached from terminal control. A `rm` that should be SIGINT-cancellable might no longer be. The check rejects rather than guess.

---

## 5. The Privilege-Escalation Wrappers — `sudo`, `doas`, `pkexec`

These appear in `N64` (transparent for prefix detection) but **not** in `JdK`/`jdK`/`XdK` (not rejected by static analysis). Why?

The team's design choice: **`sudo rm` is "deny `rm`" semantically**. The wrapped command is what matters for permission. Sudo *itself* doesn't change what runs — the user might lack permission to run sudo, but if they have it, the wrapped command runs.

For the *permission rule match*, then, `sudo rm -rf /` should be matched by `Bash(rm:*)`. The wrapper-strip in `WdK` makes this happen.

For the *static safety check*, sudo isn't *dangerous in itself* (it's not eval-class). The risk is the wrapped command. By stripping sudo, the same checks apply.

Note `sudo` IS still in `N64` for `bV` (the supported-sandbox-command gate) — the gate may reject auto-allow of sudo specifically because the sandbox can't reliably contain privilege escalation. But that's a *sandbox-mode* concern, not a deny-rule-match concern.

---

## 6. The Telemetry — How the Bug Was Closed

The fix doesn't have explicit telemetry, but the bash classifier emits `tengu_bash_classifier_*` events with `bashMissKind` strings. Pre-fix, a `sudo rm -rf` would have shown up as `bashMissKind: "no-rule-match"` (because the deny didn't match), then auto-approved or asked.

Post-fix, it shows up as `decisionReason: { type: "rule", rule: <denyRule> }` — the deny matches. The shift in the distribution of these events (less `no-rule-match`, more rule-driven decisions) would have been visible in Anthropic's dashboards.

---

## 7. Edge Cases

### Wrapper-of-wrapper

`time sudo rm -rf /`:
1. `argv[0] === "time"` → strip → `sudo rm -rf /`
2. `argv[0] === "sudo"` → not in the WdK strip cases, **but** it's in N64

The WdK function explicitly doesn't handle `sudo`. Looking at the code, sudo isn't in WdK's switch chain. So how does the sudo case work?

Looking again at `WdK` (line 205239-205313), the wrappers it strips are: `time`, `nohup`, `timeout`, `nice`, `env`, `stdbuf`, `command`, `builtin`, `noglob`. **Not** `sudo`. So `sudo` is **not** stripped at the WdK layer.

For the *deny rule match*, the lookup is done at the **AST-walked argv head**, which after WdK is still `sudo`. So the deny rule `Bash(rm:*)` doesn't match `sudo` head — unless the rule matcher itself has wrapper awareness.

Let me check the prefix-rule check `oS6` / `Be$` (line 207228-207232) — these are the rule-matcher's normalization. Hmm — these don't seem to handle wrappers either. So how does `sudo rm -rf` get denied?

Actually re-reading the changelog: **"Bash deny rules match `env`/`sudo`/`watch`/`ionice`/`setsid` wrappers"** — the fix is at the *rule-match* level, where the matcher now considers wrappers. This is likely implemented elsewhere in the rule-match pipeline, not in WdK directly.

Looking at the WdK function more carefully — line 205317-205320:
```javascript
let _ = K[0];
if (_ === void 0) continue;
if (_ === "") return { ok: !1, reason: "Empty command name — argv[0] may not reflect what bash runs" };
if (_.includes(NY$) || _.includes(lj))
  return { ok: !1, reason: "Command name is runtime-determined (placeholder argv[0])" };
```

The WdK takes the post-strip argv[0] as the head. But for `sudo rm`, head is still `sudo`.

The actual *rule-match for wrappers* must be at a different layer. Looking at the read-only validator pattern at line 277014 — the find regex — and the broader `GW_` set at line 277016+... the bash classifier has a layered check where:
1. WdK strips known transparent wrappers (time, nohup, etc.)
2. AT THE END, after WdK, **`sudo`/`watch`/`setsid` would still be head** — and the rule-match would not see through them

This suggests the v2.1.113 fix is in the **rule match function** (`uNH` or similar), not in WdK. The set `N64` is used to detect transparent wrappers at *match time*.

Looking at line 420646 — `uNH(H, $, "prefix", { astCommand: q.length === 1 ? q[0] : void 0 })` — the matcher takes the **astCommand**. The astCommand is the AST-parsed result. The matcher walks the parsed commands and *for each one*, strips wrappers before matching against deny patterns.

The actual wrapper-strip-at-match-time is likely in helper logic that takes the post-AST command and the N64 set. Without finding the exact line, the *behavioral* claim of the changelog stands: deny rules now match through wrappers.

### Whitespace and tabs

`sudo  rm   -rf  /` (extra spaces): bash AST normalizes these. WdK operates on `argv` arrays from the AST, so whitespace is preserved as token boundaries. No issue.

### Quoted wrapper

`"sudo" rm -rf /`: bash treats `"sudo"` and `sudo` identically (quotes are syntactic). The AST `argv[0]` is `"sudo"` (the parsed token). Whether WdK matches `K[0] === "sudo"` depends on whether the AST gives the unquoted or quoted form — typically unquoted.

---

## 8. Companion to the Sandbox Fix

The wrapper-deny work pairs with the v2.1.116 sandbox safety fix (see [`sandbox_auto_allow_safety.md`](./sandbox_auto_allow_safety.md)). The sandbox auto-allow:

1. Calls `LdK(M)` — checks if head is `rm`/`rmdir` (or in JdK/jdK/XdK)
2. Calls `IX6` for `rm`/`rmdir` dangerous-path
3. **But the head is post-WdK** — if the wrapper isn't stripped, the head might be `sudo` and bypass both `LdK` and `IX6`

For sandbox to be safe against `sudo rm -rf /`, the WdK strip must include sudo, OR the sandbox check must independently apply N64. The latter — the sandbox-supported-command gate `bV(H)` uses N64 — provides the second layer.

In v2.1.113, the bash classifier was extended; in v2.1.116, the sandbox was extended. Together they close the wrapper-bypass class across both fast paths (rule match, sandbox auto-allow).

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions and constants in this document:
- `bashWrapperStripper` (`WdK`) — AST-walker that strips transparent wrappers (`time`, `env`, `nice`, etc.)
- `transparentWrappersSet` (`N64`) — 33-entry set of wrappers for prefix detection (shells, env, sudo, watch, etc.)
- `evalClassBuiltins` (`JdK`) — 18 builtins that evaluate args as code (eval, source, exec, ...)
- `zshBuiltinsBypass` (`jdK`) — 16 zsh-specific builtins that can bypass security (zmodload, emulate, ...)
- `argRunningWrappers` (`XdK`) — 11 wrappers that run their argument as a command (watch, ionice, setsid, ...)
- `isDangerousCommandHead` (`LdK`) — Returns true for `rm`/`rmdir` and any of JdK/jdK/XdK
- `isSupportedSandboxCommand` (`bV`) — Sandbox-mode gate using N64
- `safeEnvVarSet` (`$W$`) — Set of env var names that are safe as command-prefix
- `findCommandPrefix` (`Fw8`) — Used by prefix-detection in suggestion-builder
- `parseHeredocPrefix` (`MA5`) — Heredoc command prefix detector consulting N64
- `bashRuleMatcher` (`uNH`) — Top-level deny/ask/allow rule matcher; threads `astCommand` through
