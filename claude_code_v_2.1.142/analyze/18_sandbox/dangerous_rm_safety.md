# Dangerous-Path Safety for `rm` / `rmdir` Under Auto-Allow

> **Landing:** v2.1.116 — *"Security: sandbox auto-allow no longer bypasses the dangerous-path safety check for `rm`/`rmdir` targeting `/`, `$HOME`, or other critical system directories."*

This document covers the safety check that prevents `autoAllowBashIfSandboxed: true` from blanket-approving destructive `rm`/`rmdir` invocations against critical paths. The check is a **hard policy floor**: it cannot be overridden by a user `permissions.allow` rule.

---

## The Pre-Fix Hole

When `autoAllowBashIfSandboxed: true` is set, Claude bypasses normal permission prompting for shell commands the static analyzer recognizes as "safe under sandbox." The pre-2.1.116 logic:

1. Parse the command into an AST of subcommands joined by `&&` / `|` / `;`.
2. For each subcommand: verify (env-var-safe-prefixes, no `<<heredoc>>`, no `/proc/.../environ`, etc.).
3. If all subcommands pass the syntactic checks, return `behavior: "allow"` with reason "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)".

The problem: `rm -rf /` is syntactically perfectly clean. No heredoc, no command substitution, no env-var trickery. The pre-fix auto-allow path would approve it on the assumption that the sandbox would contain the damage.

But the sandbox **doesn't** contain damage to mounted paths. Under bwrap with `--bind / /` (the default read-only root), `rm -rf /` would fail on the read-only mount. But under `allowAllUnixSockets` + `allowGitConfig` + a generous `allowWrite` config (common in NVIDIA's setup), `rm -rf $HOME` could legitimately delete the user's home directory inside the sandbox — and since `$HOME` is bind-mounted to the real home, that's a real deletion.

Even with strict sandbox filesystem rules, two paths are persistently dangerous:

- `rm -rf /` — even when bind-mounted RO, the error from this command is alarming; a user reviewing logs sees "the model tried to delete root." Not a confidence-builder.
- `rm -rf $HOME` (literal `$HOME`) — depending on shell expansion timing, this becomes the resolved home directory string and *can* succeed.

The v2.1.116 fix prevents both: regardless of sandbox configuration, an `rm`/`rmdir` whose **argument resolves to a critical path** escapes the auto-allow and reverts to normal permission prompting.

---

## The Auto-Allow AST Gate

```javascript
// ============================================
// autoAllowAstChecker - AST-based auto-allow with rm/rmdir safety hook
// Location: cli_inner_pretty.js:420551-420579 (v64 function)
// ============================================

// ORIGINAL (for source lookup):
function v64(H, $, q) {
  if (!n6.isSandboxingEnabled() || !n6.isAutoAllowBashIfSandboxedEnabled() || !bV(H)) return null;
  let K = VA5(H, $, q);
  if (K.behavior === "passthrough") return null;
  let _ = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/,
    A = q.some(
      (O) =>
        O.envVars.some((M) => !kdH(M.name)) ||
        O.argv.some((M) => {
          let w = M.match(_);
          return w !== null && !kdH(w[1]);
        }),
    ),
    z = q.some((O) => O.redirects.some((M) => /^\/dev\/(tcp|udp)\//.test(M.target)));
  if (A || z) return null;
  let Y = !1,
    f = !1;
  for (let O of q) {
    let [M, ...w] = LMH(O.argv);
    if (M === "cd") {
      Y = !0;
      continue;
    }
    if (M !== "rm" && M !== "rmdir") continue;
    if (((f = !0), IX6(M, w, I$()).behavior !== "passthrough")) return null;
  }
  if (Y && f) return null;
  return K;
}

// READABLE (for understanding):
function autoAllowAstChecker(toolInput, permissionContext, astCommands) {
  // Gate 1: Sandbox must be enabled, autoAllow flag on, sandbox actually applies.
  if (!sandboxState.isSandboxingEnabled() ||
      !sandboxState.isAutoAllowBashIfSandboxedEnabled() ||
      !shouldSandboxThisCommand(toolInput)) {
    return null; // Not our concern — fall through to other deciders.
  }

  // Gate 2: Static command-rule check (permissions.allow/deny matching).
  const ruleCheck = staticRuleCheck(toolInput, permissionContext, astCommands);
  if (ruleCheck.behavior === "passthrough") return null;

  // Gate 3: Reject if any subcommand has unsafe env vars or unsafe redirects.
  const envAssignRegex = /^([A-Za-z_][A-Za-z0-9_]*)\+?=/;
  const hasUnsafeEnvVars = astCommands.some(
    (cmd) =>
      cmd.envVars.some((v) => !isSafeEnvVarName(v.name)) ||
      cmd.argv.some((arg) => {
        const m = arg.match(envAssignRegex);
        return m !== null && !isSafeEnvVarName(m[1]);
      }),
  );
  const hasNetworkRedirect = astCommands.some(
    (cmd) => cmd.redirects.some((r) => /^\/dev\/(tcp|udp)\//.test(r.target))
  );
  if (hasUnsafeEnvVars || hasNetworkRedirect) return null;

  // Gate 4: For each subcommand, if it's rm/rmdir, run the dangerous-path check.
  //          Also track whether we saw a `cd` (which could change rm's resolution context).
  let sawCd = false;
  let sawRm = false;
  for (const cmd of astCommands) {
    const [head, ...args] = stripWrapperPrefixes(cmd.argv);
    if (head === "cd") {
      sawCd = true;
      continue;
    }
    if (head !== "rm" && head !== "rmdir") continue;
    sawRm = true;
    if (checkRmTargets(head, args, getOriginalCwd()).behavior !== "passthrough") {
      // ↑ checkRmTargets returns "ask" with safetyCheck reason if any target is critical.
      // We translate that to "fall through" — let the prompt path handle it.
      return null;
    }
  }

  // Gate 5: Combination check — `cd $somewhere && rm -rf .` is dangerous because
  //          the rm's "." resolves against $somewhere, not the cwd we checked above.
  //          When BOTH cd and rm are present in the same command, bail.
  if (sawCd && sawRm) return null;

  // All gates pass: approve with the static rule check's behavior.
  return ruleCheck;
}

// Mapping: v64→autoAllowAstChecker, H→toolInput, $→permissionContext, q→astCommands,
//          n6→sandboxState, bV→shouldSandboxThisCommand, VA5→staticRuleCheck,
//          kdH→isSafeEnvVarName, LMH→stripWrapperPrefixes, IX6→checkRmTargets,
//          I$→getOriginalCwd
```

### Algorithm

**What it does:** Decides whether a multi-command shell input (like `cd /tmp && rm -rf .`) qualifies for auto-allow under sandbox mode. Returns either a permission decision (allow/deny/ask) or `null` (delegate to other deciders).

**How it works:**

1. **Three preconditions** — sandbox enabled, autoAllow flag on, this specific command actually goes through sandboxing. If any fail, return `null` so the regular permission flow runs.
2. **Static rule check** — see if any user-defined `permissions.allow`/`deny`/`ask` rule matches. The result becomes the "default" behavior if all other checks pass.
3. **Env-var safety** — strip any `VAR=value cmd` prefixes and verify each var name is in the safe list (LANG, TZ, NO_COLOR, etc.). Rejects e.g. `LD_PRELOAD=evil.so rm tmp` (LD_PRELOAD is not safe-listed).
4. **Network redirect safety** — `/dev/tcp/host/port` and `/dev/udp/host/port` are bash-builtin network redirects that bypass the sandbox proxy. Reject them.
5. **Per-subcommand rm/rmdir check** — for each subcommand whose head is `rm` or `rmdir`, invoke `IX6` (the dangerous-path checker, detailed below). If any target is critical, return `null` (which causes normal prompting).
6. **cd + rm combination check** — if a subcommand has `cd` AND another has `rm`, bail. Even if the rm targets look safe in isolation, the cd may have changed cwd to a sensitive directory and the rm's relative paths now resolve differently.
7. **All gates pass** — return the static rule check's behavior (typically allow).

**Why this approach:**

- **Layered checks** with early rejection — each gate catches a specific class of attack:
  - Gate 3 catches preload-style attacks.
  - Gate 4 catches network-exfil-via-redirect.
  - Gate 5 catches direct dangerous-rm.
  - Gate 6 catches "split the attack across subcommands" (cd then rm).
- **`null` return = delegate** — distinguishes "I refuse to auto-allow" from "I deny." A `null` lets the normal permission prompt happen; a `deny` result would refuse the command outright. This makes the auto-allow path **only ever expand** what's allowed, never restrict.
- **Static rule first** — running `staticRuleCheck` before the dangerous-path check means a user-defined deny rule (e.g., `Bash(rm:*)` in `permissions.deny`) is honored even when sandbox is enabled. The two systems compose.

**Key insight:** The cd+rm combination gate (`if (sawCd && sawRm) return null`) is the **only place** where a single bash command is rejected based on **multi-subcommand correlation**. Every other gate is per-subcommand. The reasoning: `cd /etc && rm shadow` looks safe in either subcommand alone but is catastrophic combined. Without this gate, a model could split a destructive command across `&&` to defeat per-subcommand analysis.

---

## The Dangerous-Path Check

```javascript
// ============================================
// checkRmTargets - Resolve each rm/rmdir target and check for critical paths
// Location: cli_inner_pretty.js:274835-274851 (IX6 function)
// ============================================

// ORIGINAL (for source lookup):
function IX6(H, $, q) {
  let K = vdH[H],
    _ = K($);
  for (let A of _) {
    let z = Gk(A),
      Y = q78.isAbsolute(z) ? z : q78.resolve(q, z);
    if (nUH(Y))
      return hX6(
        H,
        `Dangerous ${H} operation detected: '${Y}'

This command would remove a critical system directory. This requires explicit approval and cannot be auto-allowed by permission rules.`,
        `on critical path: ${Y}`,
      );
  }
  return { behavior: "passthrough", message: `No dangerous removals detected for ${H} command` };
}

// READABLE (for understanding):
function checkRmTargets(commandHead, commandArgs, originalCwd) {
  // commandHead is "rm" or "rmdir". Each has an arg-extraction strategy
  // (vdH[head]) that returns the path-arg list, stripping flags like -r/-f.
  const argExtractor = COMMAND_ARG_EXTRACTORS[commandHead];
  const pathArgs = argExtractor(commandArgs);

  for (const rawArg of pathArgs) {
    // Expand `~` and `~/` to homedir.
    const expanded = expandTilde(rawArg);
    // Resolve relative paths against the original cwd (NOT against any
    // intermediate `cd` — see "cd+rm combo gate" rationale).
    const resolved = path.isAbsolute(expanded) ? expanded : path.resolve(originalCwd, expanded);

    if (isCriticalPath(resolved)) {
      return askForApproval(
        commandHead,
        `Dangerous ${commandHead} operation detected: '${resolved}'\n\n` +
        `This command would remove a critical system directory. ` +
        `This requires explicit approval and cannot be auto-allowed by permission rules.`,
        `on critical path: ${resolved}`,
      );
    }
  }

  return { behavior: "passthrough", message: `No dangerous removals detected for ${commandHead} command` };
}

// Mapping: IX6→checkRmTargets, H→commandHead, $→commandArgs, q→originalCwd,
//          vdH→COMMAND_ARG_EXTRACTORS, K→argExtractor, _→pathArgs, A→rawArg,
//          Gk→expandTilde, q78→path module, nUH→isCriticalPath, hX6→askForApproval
```

### Algorithm

**What it does:** Walks the list of paths an `rm`/`rmdir` invocation would delete, resolves each one (tilde expansion + cwd resolution), and checks whether any is a "critical system directory." If yes, returns a request for explicit user approval; otherwise passes through.

**How it works:**

1. **Pick the argument extractor** — `vdH["rm"]` is the same function `aw` (a generic flag-stripper) that handles `rm`, `rmdir`, `mv`, `cp`, `mkdir`, `touch`, etc. It returns the non-flag positional args, stopping at `--`.
2. **Resolve each path arg.** Tilde expansion happens here (`expandTilde("~/foo") → "/home/user/foo"`). Then if the path is relative, resolve against the **original cwd**, not the cwd active at command parse time. This is important: an attacker who manipulated cwd via a previous command cannot trick the resolver into thinking `./foo` is safe when the cwd is `/`.
3. **Apply the critical-path test.** `nUH(resolved)` (next section) returns true if the path matches any "you should never auto-rm this" pattern.
4. **Return decision.** On critical match: `askForApproval` returns `{ behavior: "ask", message: ..., decisionReason: { type: "safetyCheck", reason: ..., classifierApprovable: false } }`. The `classifierApprovable: false` is load-bearing — it tells the auto-mode permission classifier "don't even try to ML-approve this; the human must say yes."

**Why this approach:**

- **Per-target check.** A single `rm -rf /` and a `rm -rf safe/path /` both get caught — the loop bails on the first critical target.
- **Path resolution before pattern match.** The critical-path predicate operates on canonical absolute paths only. Doing the resolution here means the predicate doesn't need to know about `~`, relative paths, etc. — single responsibility.
- **`classifierApprovable: false`.** Without this, a model running in `--permission-mode auto` could "approve" `rm -rf /` via the classifier's heuristics. The flag short-circuits that path and forces an explicit human prompt.

**Key insight:** The function only ever returns `passthrough` or `ask` — never `deny`. The contract is "the auto-allow path refuses to handle this, ask the human." This means a sophisticated user who **really** wants `rm -rf /` (e.g., inside a disposable container) can still get there via an explicit prompt approval; the safety net is "no implicit approval", not "absolute prohibition."

---

## The Critical-Path Predicate

```javascript
// ============================================
// isCriticalPath - Pattern test for "never auto-rm here"
// Location: cli_inner_pretty.js:207091-207105 (nUH function)
// ============================================

// ORIGINAL (for source lookup):
function nUH(H) {
  let $ = H.replace(/[\\/]+/g, "/");
  if ($ === "*" || $.endsWith("/*")) return !0;
  let q = c$() === "macos",
    K = (f) => (q ? f.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : f),
    _ = K($),
    A = _ === "/" ? _ : _.replace(/\/$/, "");
  if (A === "/") return !0;
  if (ce1.test(A)) return !0;
  let z = K(oz6.homedir().replace(/[\\/]+/g, "/"));
  if (A === z) return !0;
  if (vt.dirname(A) === "/") return !0;
  if (le1.test(A)) return !0;
  return !1;
}

// Where:
// ce1 = /^[A-Za-z]:\/?$/        — Windows drive root: C:, C:/
// le1 = /^[A-Za-z]:\/[^/]+$/    — Windows top-level: C:/Windows

// READABLE (for understanding):
function isCriticalPath(absolutePath) {
  // Collapse runs of separators: //a/b//c → /a/b/c
  let normalized = absolutePath.replace(/[\\/]+/g, "/");

  // (1) Glob danger: literal "*" or path ending in "/*" — rm would expand the glob.
  if (normalized === "*" || normalized.endsWith("/*")) return true;

  // (2) macOS firmlink unwrap:
  //   /private/etc → /etc, /private/var → /var, etc.
  // Apple's filesystem has these "firmlinks" — they're not symlinks, but they
  // resolve to identical inodes. Treat them as the same path for the safety check.
  const isMacOS = currentPlatform() === "macos";
  const unwrapFirmlinks = (p) =>
    isMacOS ? p.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : p;
  const unwrapped = unwrapFirmlinks(normalized);

  // Strip trailing slash unless it's the root.
  const path = unwrapped === "/" ? unwrapped : unwrapped.replace(/\/$/, "");

  // (3) Posix root.
  if (path === "/") return true;

  // (4) Windows drive root: "C:" or "C:/".
  if (/^[A-Za-z]:\/?$/.test(path)) return true;

  // (5) User's home directory.
  const home = unwrapFirmlinks(os.homedir().replace(/[\\/]+/g, "/"));
  if (path === home) return true;

  // (6) Single-segment system directories: dirname is "/".
  //   Catches /etc, /usr, /var, /bin, /lib, /opt, /tmp, /proc, /sys, /home, /root, ...
  if (path.dirname(path) === "/") return true;

  // (7) Windows top-level path: "C:/Windows", "C:/Users", "C:/Program Files", etc.
  if (/^[A-Za-z]:\/[^/]+$/.test(path)) return true;

  return false;
}

// Mapping: nUH→isCriticalPath, c$→currentPlatform, oz6→os module, vt→path module,
//          ce1→/^[A-Za-z]:\/?$/, le1→/^[A-Za-z]:\/[^/]+$/
```

### Algorithm

**What it does:** Tests an absolute path against the set of patterns we never want to auto-rm. Returns true if the path matches any pattern.

**How it works:**

1. **Normalize separators.** `//foo//bar/` → `/foo/bar/`. Both POSIX and Windows backslashes collapse to forward slashes.
2. **Glob check.** A literal `*` or `/foo/*` would expand to potentially every file. Refuse pre-emptively.
3. **macOS firmlink unwrap.** Apple's APFS uses firmlinks for `/etc`, `/var`, `/tmp`, `/home` — they're not symlinks, but `/private/etc` and `/etc` resolve to the same inode. The check normalizes `/private/etc/...` → `/etc/...` so attackers can't bypass with the alternate path.
4. **Strip trailing slash** (unless root). `/etc/` and `/etc` should both match.
5. **POSIX root** — exact match for `/`.
6. **Windows drive root** — `C:` or `C:/` (matches `ce1`).
7. **User homedir** — exact match against `os.homedir()` (post-normalization). Catches `rm -rf $HOME` *after* the shell expanded `$HOME`.
8. **Single-segment dir** — `dirname(path) === "/"` catches `/etc`, `/usr`, `/bin`, `/var`, `/tmp`, `/home`, `/root`, `/opt`, `/proc`, `/sys`, `/dev`, and so on. Anything one level below root.
9. **Windows top-level** — `C:/Windows`, `C:/Users`, etc. (matches `le1`).

**Why this approach:**

- **Allowlist-by-shape.** The function doesn't enumerate "bad paths" — it categorizes by structural property (single segment under root, drive root, etc.). New top-level directories (e.g., `/snap` on Ubuntu Core) are automatically protected without code change.
- **Firmlink awareness.** macOS-specific quirk handling. Without it, `rm -rf /private/etc` would slip past while `rm -rf /etc` got caught.
- **Glob pre-emption.** Catches a class of attacks where the model output contains `rm -rf /*` (which would expand to every top-level dir).

**Key insight:** The check is **deliberately conservative**. It treats `/usr/local` and `/etc/letsencrypt` differently — `/usr/local` has `dirname === "/usr"` not `"/"`, so it's *not* in the critical set, while `/etc` is. The reasoning: deep-path deletions are usually intentional (clearing a specific app's data); top-level deletions are usually catastrophic typos or attacks. This means:

- `rm -rf /etc` → blocked
- `rm -rf /etc/myapp` → allowed (assuming sandbox config permits)
- `rm -rf /home/alice` → blocked (single segment under `/`)
- `rm -rf /home/alice/Documents` → allowed
- `rm -rf $HOME` → blocked (the shell expands $HOME, then the resolved path matches the homedir check)
- `rm -rf $HOME/Downloads` → allowed

The granularity matches actual operator intent: "delete a specific app's files" is normal; "delete a whole system directory" is not.

---

## Wrapper Stripping for `rm` Detection

The `v64` AST checker uses `LMH` (`stripWrapperPrefixes`) to strip benign command wrappers before extracting the command head:

```javascript
// ============================================
// stripWrapperPrefixes - Strip "timeout 5 nice -n 1 ..." from argv
// Location: cli_inner_pretty.js (function LMH)
// ============================================

// (Excerpt — full body is ~200 lines handling 8 wrapper commands.)
// The function consumes leading argv entries that match recognized wrappers:
//   time, nohup, timeout [flags] DURATION, nice [-n N | --adjustment N],
//   stdbuf [-iIoOeE BUFSIZE], env [VAR=val ...], command [-pvV], builtin, noglob
// and returns the residual argv starting with the actual command head.
```

This means **`timeout 5 rm -rf /`** is detected as an `rm` invocation: the wrapper stripper removes `timeout 5`, leaving `rm -rf /`, which triggers the dangerous-path check. The model can't bypass the safety check by prefixing a wrapper.

---

## What's NOT Covered (Deliberate)

The dangerous-path check is specifically **scoped to `rm` and `rmdir`**. Other destructive commands like `mv`, `cp -r --force`, `dd`, `mkfs`, `chmod -R 000` are not covered.

**Why?**

1. **rm has unique semantics.** It always destroys. `mv` and `cp` could *move/copy* something to a critical path, which is unusual but not necessarily destructive.
2. **Path-target detection is hard for non-rm.** For `mv src dst`, only `dst` matters; for `cp -r src dst`, the relevant target is `dst`; for `dd of=path`, you need to parse `of=`. Each command needs its own arg-extractor logic.
3. **Most destructive non-rm patterns are caught by the env-var / quote / heredoc gates.** A model writing `mkfs.ext4 /dev/sda` won't auto-allow because `/dev/sda` is not in the writable allowlist; under bwrap, `/dev` is masked.
4. **Scope creep risk.** Adding more commands means more arg-extraction code, more edge cases, more places to silently miss attacks. The fix focuses on the dominant pattern.

A future extension could add `mv`/`cp` target-checking; the structural hook (`v64` → `IX6` → `nUH`) is in place. For now, only `rm`/`rmdir` flow through `IX6`.

---

## Interaction with `permissions.allow`

```javascript
// In the IX6 error message:
"This command would remove a critical system directory. This requires explicit
approval and cannot be auto-allowed by permission rules."
```

The phrase "cannot be auto-allowed by permission rules" is a deliberate UX choice: it tells the user that even if they wrote `Bash(rm:*)` in `permissions.allow`, the safety check still fires. This is a **policy floor**: the auto-allow path's dangerous-path check applies *before* user-rule matching.

How does this floor interact with explicit allow rules? Three scenarios:

| `permissions.allow` rule | Command | Result |
|--------------------------|---------|--------|
| `Bash(rm:*)` (very permissive) | `rm -rf /tmp/scratch` | Allowed (matches rule, path is safe) |
| `Bash(rm:*)` | `rm -rf /etc` | **Asks for explicit approval** (rule match irrelevant — critical path) |
| `Bash(rm -rf:*)` | `rm -rf /etc` | **Asks for explicit approval** (same reason) |
| No allow rule, sandbox auto-allow | `rm -rf /etc` | **Asks for explicit approval** |
| No allow rule, no sandbox | `rm -rf /etc` | Asks (normal prompt path, not safety-check path) |

The safety check applies inside `v64`, which is **before** the normal `permissions.allow` matching for auto-mode. So a user who wants the convenience of `Bash(rm:*)` for scratch directories still gets a safety prompt on critical paths — the convenience flag doesn't disable the floor.

---

## Why This Is a Sandbox Issue (Not a Bash-Tool Issue)

You might ask: shouldn't the `rm -rf /` check apply universally, not just inside `autoAllowBashIfSandboxed`? The answer is layered:

1. **Outside sandbox auto-allow**, the normal permission flow already prompts on every Bash command unless an `allow` rule matches. So `rm -rf /` would prompt the user anyway — the dangerous-path check would just inject a second, more specific prompt.
2. **The 2.1.116 fix was about preventing auto-allow from creating an unsafe combination.** When the user opts into `autoAllowBashIfSandboxed: true`, they're saying "I trust the sandbox + static analyzer to vet commands." The fix says: "Even with that trust, dangerous-rm gets a second look."
3. **The dangerous-rm check IS also used at the Bash tool boundary** via a separate code path (`tM7` / `kS6`) that runs on every Bash invocation, regardless of sandbox state. That's the universal floor; the v64 hook is the auto-allow-specific layer.

In other words, dangerous-rm is checked twice: once in normal Bash validation, and again specifically inside the auto-allow path. Both checks share the same predicate (`nUH`) and the same arg-extractor (`vdH`), so behavior is consistent — but the auto-allow path's check fires *before* the auto-approval, ensuring no critical-path rm ever gets auto-approved.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

Key functions in this document:
- `autoAllowAstChecker` (v64) — AST-based auto-allow with rm/rmdir hook
- `checkRmTargets` (IX6) — per-rm-target dangerous-path check
- `isCriticalPath` (nUH) — pattern predicate (POSIX root, Windows drive, $HOME, single-segment, etc.)
- `expandTilde` (Gk) — `~`/`~/` → homedir expansion
- `stripWrapperPrefixes` (LMH) — strips `timeout`/`nice`/`nohup`/etc. from argv
- `staticRuleCheck` (VA5) — non-auto-allow rule matcher
- `shouldSandboxThisCommand` (bV) — sandbox-applicability gate
- `isSafeEnvVarName` (kdH) — env-var safe-list checker
- `isDangerousCommand` (LdK) — generic dangerous-command set (includes rm/rmdir)
- `askForApproval` (hX6) — formats the ask-permission response with `safetyCheck` reason
- `COMMAND_ARG_EXTRACTORS` (vdH) — per-command argv-to-paths function map
- Critical-path regexes: `ce1` (Windows drive root), `le1` (Windows top-level)
