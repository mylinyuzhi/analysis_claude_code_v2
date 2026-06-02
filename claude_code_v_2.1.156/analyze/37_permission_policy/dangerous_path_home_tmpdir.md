# Dangerous-Path Fixes — `rm -rf HOME` Trailing Slash and TMPDIR Sandbox Unification (2.1.156)

## Related Symbols

> Symbol mappings:
> - [`symbol_index_core_execution.md`](../00_overview/symbol_index_core_execution.md) — Core execution
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Core features
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Platform infra (permissions, sandbox)
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — Integrations

Key functions/symbols in this document:
- `isDangerousRemovalTarget` (`PlH`) — predicate that flags a path as a protected system/home/root target for recursive deletes (cli_inner_pretty.js:211484-211498)
- `toLowerCase` (`OJ`) — case-normalizer used to compare candidate vs homedir (cli_inner_pretty.js:549400-549402)
- `driveRootRegex` (`WV5`) — matches `X:` / `X:/` drive roots (cli_inner_pretty.js:211576)
- `driveRootChildRegex` (`ZV5`) — matches `X:/<single-segment>` drive-root children (cli_inner_pretty.js:211576)
- `extractPowershellRemovalPath` (`gG8`) — resolves a PowerShell `Remove-Item` argument to an absolute path, then defers to `isDangerousRemovalTarget` (cli_inner_pretty.js:418371-418377)
- `denyProtectedSystemPath` (`PH$`) — builds the `behavior:"deny"` verdict for a protected removal target (cli_inner_pretty.js:418378-418384)
- `canonicalSandboxTmpDir` (`hx`) — realpath-canonicalized sandbox tmp dir with trailing separator (cli_inner_pretty.js:550128-550136)
- `sandboxTmpDir` (`VL`) — creates/returns the per-uid `claude-<uid>` tmp directory (cli_inner_pretty.js:176754-176766)
- `rawTmpDirRoot` (`vd`) — `CLAUDE_CODE_TMPDIR` or `os.tmpdir()` (cli_inner_pretty.js:176735-176738)
- `assertSafeTmpDir` (`GJ5`) — owner/mode/symlink guard on the tmp dir (cli_inner_pretty.js:176739-176753)
- `buildSandboxPromptSection` (`g24`) — builds the "Command sandbox" system-prompt section and substitutes `$TMPDIR` (cli_inner_pretty.js:438967-439033)
- `createBashShellAdapter` (`Gs7`) — factory for the `type:"bash"` shell adapter (handles bash/zsh login shells); owns the TMPDIR override at cli_inner_pretty.js:341403-341413 (cli_inner_pretty.js:341341)
- `createPowershellShellAdapter` (`Es7`) — factory for the `type:"powershell"` shell adapter; owns the TMPDIR override at cli_inner_pretty.js:341541-341546 (cli_inner_pretty.js:341512)
- `dedupe` (`aq`) — `[...new Set(...)]` (cli_inner_pretty.js:40716-40718)

Precursors in the v2.1.142 bundle (cross-validation, separate build):
- `isDangerousRemovalTarget` (`nUH`, 2.1.142) — the pre-fix predicate (2.1.142 `cli_inner_pretty.js:207091-207104`)
- `sandboxTmpDir` (`vL`, 2.1.142) — pre-fix tmp dir, no realpath, no trailing sep (2.1.142 `cli_inner_pretty.js:173853-173865`)
- `buildSandboxPromptSection` (`H64`, 2.1.142) — pre-fix sandbox prompt builder (2.1.142 `cli_inner_pretty.js:418752-418805`)

---

## TL;DR

2.1.156 lands two narrow correctness fixes in the dangerous-path / sandbox-path layer of the permission engine. Neither adds a new policy primitive; both close a hole where a path that *should* have been treated as dangerous (or as the same directory) was treated as benign (or as a different directory):

1. **`rm -rf $HOME` trailing-slash gap.** The "is this a protected removal target?" predicate `isDangerousRemovalTarget` (`PlH`, cli_inner_pretty.js:211484) now trailing-slash-normalizes **both** the candidate path *and* the home directory, and compares them through a case-normalizer `OJ` (`OJ(z) === OJ(A)`, cli_inner_pretty.js:211494). The 2.1.142 predicate (`nUH`) stripped the trailing slash from the **candidate only** and compared the raw strings (`A === z`, no `OJ`), so `rm -rf "$HOME/"` — or a case-mismatched home on a case-insensitive FS — slipped through the home check. Confidence: **high** (verified diff of the two predicate bodies).

2. **TMPDIR sandboxed-vs-unsandboxed divergence.** `canonicalSandboxTmpDir` (`hx`, cli_inner_pretty.js:550128) now `realpathSync`-canonicalizes the per-uid sandbox tmp dir, and the shell-spawn env overrides set `TMPDIR = CLAUDE_CODE_TMPDIR = <same dir>` for **both** sandboxed and unsandboxed commands at the only two adapter sites: the `type:"bash"` adapter at cli_inner_pretty.js:341411 and the `type:"powershell"` adapter at 341544. The 2.1.142 spawn path set the sandbox tmp dir **only when `useSandbox` was true** (`X = Y ? vL() : void 0`, 2.1.142 cli_inner_pretty.js:361140-361146), and `vL` did not `realpathSync` (2.1.142 cli_inner_pretty.js:173853). Result pre-fix: a sandboxed and an unsandboxed `Bash` in the same session could resolve `$TMPDIR` to different directories. Confidence: **medium** — the realpath canonicalization and the same-dir-for-both env override are clearly present in 2.1.156; the exact pre-fix divergence is reconstructed from the 2.1.142 build and stated honestly below.

Upstream changelog (2.1.156):
- "Fixed `rm -rf $HOME` not being blocked when `$HOME` has a trailing slash."
- "Fixed `$TMPDIR` resolving to different directories in sandboxed vs unsandboxed Bash within the same session."

---

# Part 1 — `rm -rf $HOME` Trailing-Slash Fix

## 1.1 Where the predicate sits

`isDangerousRemovalTarget` (`PlH`) is the leaf classifier that answers a single yes/no question: *is this resolved absolute path one of the "you may not recursively delete this" roots* — filesystem root, a drive root, a drive-root child, the home directory, or any direct child of root? It is consulted by two callers, both of which only reach it after a recursive-delete intent has already been detected upstream:

- The Bash / `rm -rf` resolver passes a resolved path `W` and, if the command is a recursive delete (`L`), returns the protected-path deny verdict when `isDangerousRemovalTarget(W)` is true (cli_inner_pretty.js:418710).
- The PowerShell `Remove-Item -Recurse` resolver routes through `extractPowershellRemovalPath` (`gG8`) → `isDangerousRemovalTarget` and returns `denyProtectedSystemPath` (`PH$`) (cli_inner_pretty.js:418708, 418371-418384).

```
recursive-delete intent detected (rm -rf  /  Remove-Item -Recurse)
        │
        ├── Bash path:  for each target W →  PlH(W)? → PH$(W)            (418707-418710)
        │
        └── PowerShell path:  for each target P → gG8(P)→PlH(...)? → PH$(P)  (418708)
                                                  └─ resolves P to abs path, then PlH
```

## 1.2 The predicate, line by line

```javascript
// ============================================
// isDangerousRemovalTarget - Flags a resolved path as a protected delete target (root/drive/home)
// Location: cli_inner_pretty.js:211484-211498
// ============================================

// ORIGINAL (for source lookup):
function PlH(H) {
  let $ = H.replace(/[\\/]+/g, "/");
  if ($ === "*" || $.endsWith("/*")) return !0;
  let q = n$() === "macos",
    K = (f) => (q ? f.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : f),
    _ = K($),
    z = _ === "/" ? _ : _.replace(/\/$/, "");
  if (z === "/") return !0;
  if (WV5.test(z)) return !0;
  let A = K(a26.homedir().replace(/[\\/]+/g, "/")).replace(/\/$/, "");
  if (OJ(z) === OJ(A)) return !0;
  if (u$H.dirname(z) === "/") return !0;
  if (ZV5.test(z)) return !0;
  return !1;
}

// READABLE (for understanding):
function isDangerousRemovalTarget(rawPath) {
  // 1. Collapse all run-of-slashes/backslashes to a single forward slash.
  const slashNormalized = rawPath.replace(/[\\/]+/g, "/");

  // 2. A bare glob-star or a "<dir>/*" tail is dangerous on its own.
  if (slashNormalized === "*" || slashNormalized.endsWith("/*")) return true;

  // 3. macOS firmlink normalization: /private/etc → /etc, /private/var → /var,
  //    /private/tmp → /tmp, /private/home → /home (so the real underlying root
  //    is compared, not the firmlinked alias).
  const isMacOS = getPlatform() === "macos";
  const normalizeFirmlink = (p) =>
    isMacOS ? p.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : p;
  const normalizedCandidate = normalizeFirmlink(slashNormalized);

  // 4. Strip a trailing slash from the CANDIDATE (but keep "/" itself intact).
  const candidate = normalizedCandidate === "/"
    ? normalizedCandidate
    : normalizedCandidate.replace(/\/$/, "");

  // 5. Filesystem root.
  if (candidate === "/") return true;

  // 6. Windows drive root: "C:" or "C:/".
  if (driveRootRegex.test(candidate)) return true;

  // 7. Home directory — THE FIX: the homedir is ALSO firmlink-normalized AND
  //    trailing-slash-stripped, then compared CASE-INSENSITIVELY to the candidate.
  const home = normalizeFirmlink(
    os.homedir().replace(/[\\/]+/g, "/")
  ).replace(/\/$/, "");
  if (toLowerCase(candidate) === toLowerCase(home)) return true;

  // 8. Any direct child of root ("/etc", "/usr", "/Users", ...).
  if (path.dirname(candidate) === "/") return true;

  // 9. Windows drive-root child: "C:/Users", "D:/data" (single segment under a drive).
  if (driveRootChildRegex.test(candidate)) return true;

  return false;
}

// Mapping: PlH→isDangerousRemovalTarget, H→rawPath, $→slashNormalized,
//   K→normalizeFirmlink, _→normalizedCandidate, z→candidate, A→home,
//   n$→getPlatform, a26→os, u$H→path, OJ→toLowerCase, WV5→driveRootRegex, ZV5→driveRootChildRegex
```

The two regexes are defined together in the module initializer:

```javascript
// ============================================
// driveRootRegex / driveRootChildRegex - Windows drive-root matchers
// Location: cli_inner_pretty.js:211576
// ============================================

// ORIGINAL (for source lookup):
((WV5 = /^[A-Za-z]:\/?$/), (ZV5 = /^[A-Za-z]:\/[^/]+$/));

// READABLE (for understanding):
const driveRootRegex      = /^[A-Za-z]:\/?$/;     // "C:"  or "C:/"
const driveRootChildRegex = /^[A-Za-z]:\/[^/]+$/; // "C:/Users", "D:/data" — exactly one segment

// Mapping: WV5→driveRootRegex, ZV5→driveRootChildRegex
```

`toLowerCase` (`OJ`) is the trivial case-folder that the home comparison now routes through:

```javascript
// ============================================
// toLowerCase - Case-folder used for case-insensitive path comparison
// Location: cli_inner_pretty.js:549400-549402
// ============================================

// ORIGINAL (for source lookup):
function OJ(H) {
  return H.toLowerCase();
}

// READABLE (for understanding):
function toLowerCase(s) {
  return s.toLowerCase();
}

// Mapping: OJ→toLowerCase
```

## 1.3 The bug — what the 2.1.142 predicate did

The 2.1.142 precursor `nUH` is structurally identical *except for the home check*:

```javascript
// ============================================
// isDangerousRemovalTarget (2.1.142 precursor) - the pre-fix home check
// Location: 2.1.142 cli_inner_pretty.js:207091-207104
// ============================================

// ORIGINAL (for source lookup):
function nUH(H) {
  let $ = H.replace(/[\\/]+/g, "/");
  if ($ === "*" || $.endsWith("/*")) return !0;
  let q = c$() === "macos",
    K = (f) => (q ? f.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2") : f),
    _ = K($),
    A = _ === "/" ? _ : _.replace(/\/$/, "");      // candidate: slash STRIPPED
  if (A === "/") return !0;
  if (ce1.test(A)) return !0;
  let z = K(oz6.homedir().replace(/[\\/]+/g, "/")); // home: NOT slash stripped
  if (A === z) return !0;                            // RAW compare, no toLowerCase
  if (vt.dirname(A) === "/") return !0;
  if (le1.test(A)) return !0;
  return !1;
}

// READABLE (for understanding):
function isDangerousRemovalTarget_2_1_142(rawPath) {
  const slashNormalized = rawPath.replace(/[\\/]+/g, "/");
  if (slashNormalized === "*" || slashNormalized.endsWith("/*")) return true;

  const normalizeFirmlink = (p) =>
    getPlatform() === "macos"
      ? p.replace(/^\/private\/(etc|var|tmp|home)(\/|$)/i, "/$1$2")
      : p;

  const candidate = (() => {
    const n = normalizeFirmlink(slashNormalized);
    return n === "/" ? n : n.replace(/\/$/, "");     // candidate trailing slash removed
  })();

  if (candidate === "/") return true;
  if (driveRootRegex.test(candidate)) return true;

  const home = normalizeFirmlink(os.homedir().replace(/[\\/]+/g, "/")); // ← NO trailing-slash strip
  if (candidate === home) return true;                                  // ← raw, case-sensitive

  if (path.dirname(candidate) === "/") return true;
  if (driveRootChildRegex.test(candidate)) return true;
  return false;
}

// Mapping (2.1.142): nUH→isDangerousRemovalTarget, A→candidate, z→home,
//   c$→getPlatform, oz6→os, vt→path, ce1→driveRootRegex, le1→driveRootChildRegex
```

Two independent defects, both in the home branch:

1. **Asymmetric trailing-slash handling.** `os.homedir()` normally returns `/Users/alice` (no trailing slash), so for the *literal* expansion of `$HOME` the strings match. But the candidate path can arrive with a trailing slash for several reasons: the user literally typed `rm -rf "$HOME/"`, a shell or wrapper appended a separator, or an upstream path-join produced `/Users/alice/`. Pre-fix, the candidate had its trailing slash stripped (`A`), but the homedir `z` did **not**. The mismatch only bites when the homedir *itself* carries a trailing slash (e.g. a `$HOME` env value of `/Users/alice/`, or a homedir provider that returns one). The 2.1.156 fix makes the operation symmetric by stripping the trailing slash from `home` as well (cli_inner_pretty.js:211493), so both sides are in canonical no-trailing-slash form before comparison.

2. **Case sensitivity.** macOS (APFS default) and Windows (NTFS) are case-*insensitive but case-preserving*. A homedir of `/Users/Alice` and a candidate of `/users/alice` are the same directory on disk but `===` returns false. The 2.1.156 fix routes both through `toLowerCase` (`OJ`) so the comparison matches the filesystem's own semantics (cli_inner_pretty.js:211494).

> Honest scoping note: the changelog headline is specifically the trailing-slash case. The `OJ` case-fold added at the same line is the same patch hardening the comparison against the case-insensitive-FS variant of the identical bug. The macOS firmlink normalization (`/private/...` → `/...`, cli_inner_pretty.js:211488) was already present in 2.1.142; it is *not* part of this fix, but it matters because on macOS `os.homedir()` and a user-typed path can disagree on the `/private` prefix, and both sides run through the same `normalizeFirmlink` so that axis is already aligned. The remaining gap the patch closed was the trailing-slash + case axes.

### Worked example — the exploit path

```
$HOME = /Users/alice/         (trailing slash — e.g. exported that way, or homedir provider returns it)
Command: rm -rf "$HOME"
Resolved candidate W = "/Users/alice/"

── 2.1.142 (nUH) ──────────────────────────────────────────────
  slashNormalized   = "/Users/alice/"
  candidate (A)     = "/Users/alice"        (trailing slash stripped)
  home (z)          = "/Users/alice/"       (NOT stripped — bug #1)
  candidate === home → "/Users/alice" === "/Users/alice/" → FALSE
  dirname(candidate)= "/Users"   (not "/")  → no root-child match
  ⇒ returns FALSE  ⇒  rm -rf $HOME AUTO-PROCEEDS  ✗

── 2.1.156 (PlH) ──────────────────────────────────────────────
  candidate (z)     = "/Users/alice"        (trailing slash stripped)
  home (A)          = "/Users/alice"        (ALSO stripped — fix)
  OJ(candidate) === OJ(home) → "/users/alice" === "/users/alice" → TRUE
  ⇒ returns TRUE  ⇒  PH$  ⇒  behavior:"deny"  ✓
```

## 1.4 The two callers

### Bash recursive delete

```javascript
// ============================================
// Bash recursive-delete protected-path check (excerpt)
// Location: cli_inner_pretty.js:418707-418710
// ============================================

// ORIGINAL (for source lookup):
for (let P of O) {
  if (L && gG8(P)) return PH$(P);
  let { allowed: Z, resolvedPath: W, decisionReason: G } = FG8(P, K, $, M);
  if (L && PlH(W)) return PH$(W);
  ...
}

// READABLE (for understanding):
for (const target of targets) {
  if (isRecursiveDelete && extractPowershellRemovalPath(target)) return denyProtectedSystemPath(target);
  const { allowed, resolvedPath, decisionReason } = resolveAndCheckPath(target, cwd, permCtx, mode);
  if (isRecursiveDelete && isDangerousRemovalTarget(resolvedPath)) return denyProtectedSystemPath(resolvedPath);
  ...
}

// Mapping: L→isRecursiveDelete, gG8→extractPowershellRemovalPath, PH$→denyProtectedSystemPath,
//   FG8→resolveAndCheckPath, W→resolvedPath, PlH→isDangerousRemovalTarget, O→targets, P→target
```

`isDangerousRemovalTarget` runs on the **fully resolved** path `W` (the output of `resolveAndCheckPath`), which is why a candidate may legitimately carry a trailing slash by the time it reaches the predicate — and why normalizing both sides matters.

### PowerShell `Remove-Item`

The PowerShell branch has its own pre-step: a working-directory guard, then `extractPowershellRemovalPath` → `isDangerousRemovalTarget`.

```javascript
// ============================================
// PowerShell Remove-Item working-directory guard
// Location: cli_inner_pretty.js:418682-418704
// ============================================

// ORIGINAL (for source lookup):
let L = EY(f.name) === "remove-item";
if (L) {
  if (
    f.args.some((Z) => {
      let W = (Z.length > 0 ? "-" + Z.slice(1) : Z).toLowerCase(),
        G = W.indexOf(":"),
        V = G > 0 ? W.slice(0, G) : W;
      return V.length >= 2 && "-recurse".startsWith(V);
    })
  ) {
    let Z = OJ(K);
    for (let W of O) {
      let G = dG8(Id6(W)).replace(/\\/g, "/"),
        V = mS.isAbsolute(G) ? mS.resolve(G) : mS.resolve(K, G),
        v = OJ(V);
      if (v === Z || Z.startsWith(v + "/") || Z.startsWith(v + "\\")) {
        _ ??= {
          behavior: "ask",
          message: `Remove-Item -Recurse targeting '${W}' would delete the working directory including .git and .claude — requires manual approval`,
        };
        break;
      }
    }
  }
}

// READABLE (for understanding):
const isRemoveItem = resolveToCanonical(parsed.name) === "remove-item";
if (isRemoveItem) {
  // Does any arg abbreviate "-Recurse"? PowerShell allows unambiguous prefixes (-r, -rec, -recurse).
  const hasRecurse = parsed.args.some((arg) => {
    const flag = (arg.length > 0 ? "-" + arg.slice(1) : arg).toLowerCase();
    const colon = flag.indexOf(":");
    const stem = colon > 0 ? flag.slice(0, colon) : flag;     // strip "-Recurse:$true" colon form
    return stem.length >= 2 && "-recurse".startsWith(stem);
  });
  if (hasRecurse) {
    const cwdLower = toLowerCase(cwd);
    for (const target of targets) {
      const cleaned = stripQuotes(unescapePsArg(target)).replace(/\\/g, "/");
      const abs = path.isAbsolute(cleaned) ? path.resolve(cleaned) : path.resolve(cwd, cleaned);
      const absLower = toLowerCase(abs);
      // Recursive delete that hits the working dir (or an ancestor of it) → ask, not auto.
      if (absLower === cwdLower || cwdLower.startsWith(absLower + "/") || cwdLower.startsWith(absLower + "\\")) {
        verdict ??= {
          behavior: "ask",
          message: `Remove-Item -Recurse targeting '${target}' would delete the working directory including .git and .claude — requires manual approval`,
        };
        break;
      }
    }
  }
}

// Mapping: L→isRemoveItem, EY→resolveToCanonical, K→cwd, O→targets, OJ→toLowerCase,
//   dG8→stripQuotes, Id6→unescapePsArg, mS→path, _→verdict
```

Then the protected-path classifier:

```javascript
// ============================================
// extractPowershellRemovalPath / denyProtectedSystemPath
// Location: cli_inner_pretty.js:418371-418384
// ============================================

// ORIGINAL (for source lookup):
function gG8(H) {
  let $ = Lk(H),
    q = $.indexOf("::");
  if (q >= 0) $ = $.slice(q + 2);
  if ((($ = dG8($).replace(/\\/g, "/")), mS.isAbsolute($))) $ = mS.normalize($);
  return PlH($);
}
function PH$(H) {
  return {
    behavior: "deny",
    message: `Remove-Item on system path '${H}' is blocked. This path is protected from removal.`,
    decisionReason: { type: "other", reason: "Removal targets a protected system path" },
  };
}

// READABLE (for understanding):
function extractPowershellRemovalPath(rawArg) {
  let p = expandPsArg(rawArg);
  const provider = p.indexOf("::");          // strip a PowerShell provider prefix e.g. "FileSystem::C:\..."
  if (provider >= 0) p = p.slice(provider + 2);
  p = stripQuotes(p).replace(/\\/g, "/");
  if (path.isAbsolute(p)) p = path.normalize(p);
  return isDangerousRemovalTarget(p);
}
function denyProtectedSystemPath(targetPath) {
  return {
    behavior: "deny",
    message: `Remove-Item on system path '${targetPath}' is blocked. This path is protected from removal.`,
    decisionReason: { type: "other", reason: "Removal targets a protected system path" },
  };
}

// Mapping: gG8→extractPowershellRemovalPath, Lk→expandPsArg, dG8→stripQuotes, mS→path,
//   PlH→isDangerousRemovalTarget, PH$→denyProtectedSystemPath
```

Note the **layering**: the working-dir guard returns `ask` (manual approval) when a recursive `Remove-Item` would nuke the cwd; the protected-path classifier returns `deny` (hard block) when it targets root/drive/home. The trailing-slash fix in `isDangerousRemovalTarget` thus tightens the *hard-deny* layer on the PowerShell side too, not just Bash.

## 1.5 Why this approach

**Why normalize both sides instead of canonicalizing once upstream?** The candidate path and `os.homedir()` come from different sources with different conventions: the candidate is whatever survived shell-arg parsing + path resolution (`FG8` for Bash, `extractPowershellRemovalPath` for PowerShell), while `os.homedir()` is the OS's notion of home. There is no single upstream choke point that both pass through, so the predicate is the natural place to align them. Doing the normalization *inside* the predicate also keeps the fix self-contained — every caller of `isDangerousRemovalTarget` inherits it for free.

**Why `toLowerCase` rather than `fs.realpathSync`?** `realpathSync` would be the "correct" canonicalization, but it touches the filesystem (slow, can throw, can follow attacker-planted symlinks) and the predicate runs on *every* recursive-delete target during permission evaluation. Case-folding is a pure string operation that matches the practical reality of macOS/Windows case-insensitivity without I/O. It is deliberately a coarse over-approximation: it can only ever make the predicate flag *more* paths as dangerous (a safe direction for a deny rule), never fewer.

**Why strip rather than append a slash?** Canonical no-trailing-slash form (`/Users/alice`) is what `os.homedir()`, `path.dirname`, and the drive-root regexes all already speak. Stripping converges everything to that form; appending would have required touching the regexes and the `dirname` check.

**Key insight:** This is a textbook *asymmetric-normalization* bug. The original author normalized the untrusted input (the candidate) but forgot that the trusted reference value (the homedir) could be in a non-canonical form too. A deny predicate must canonicalize **both** operands to the *same* form, because any residual asymmetry is a bypass — and for a "may I delete your entire home directory?" check, a bypass is catastrophic. The fix is two regex/`OJ` insertions, but the discipline it encodes ("normalize both operands of any security comparison identically") is the real lesson.

---

# Part 2 — TMPDIR Sandbox Unification

## 2.1 The problem

Claude Code's `Bash` tool can run a command either inside an OS sandbox (seatbelt/landlock-style, with a write-allowlist) or unsandboxed. Both modes want a writable scratch directory, exposed to the model as `$TMPDIR`, plus the system prompt tells the model to "always use `$TMPDIR`" for temp files (cli_inner_pretty.js:439019). The bug: within a single session, a sandboxed `Bash` and an unsandboxed `Bash` could see `$TMPDIR` pointing at **different directories**, so a temp file written by one was invisible to the other.

There are two distinct axes of divergence the 2.1.156 build addresses:

1. **realpath canonicalization.** The sandbox write-allowlist is enforced against canonical (symlink-resolved) paths by the OS sandbox. If `$TMPDIR` handed to the shell were the *non-canonical* path (e.g. macOS `/var/...` which is a symlink to `/private/var/...`), a write inside `$TMPDIR` could be blocked by the sandbox even though the directory is allowlisted, *or* the sandboxed path and the unsandboxed path could simply be different strings for the same dir.
2. **set-for-both-modes.** The env override must put the *same* `TMPDIR` value into the child env regardless of sandbox mode.

## 2.2 The canonicalizer — `hx`

```javascript
// ============================================
// canonicalSandboxTmpDir - realpath-canonicalized per-uid sandbox tmp dir, with trailing sep
// Location: cli_inner_pretty.js:550128-550136
// ============================================

// ORIGINAL (for source lookup):
((hx = v8(function () {
  let $ = VL(),
    q = U$(),
    K = $;
  try {
    K = q.realpathSync($);
  } catch {}
  return K + D1.sep;
})),
  ...

// READABLE (for understanding):
const canonicalSandboxTmpDir = memoize(function () {
  let dir = sandboxTmpDir();          // VL(): creates/returns "<tmproot>/claude-<uid>"
  const fs = getFs();                 // U$(): fs facade
  let canonical = dir;
  try {
    canonical = fs.realpathSync(dir); // resolve symlinks → canonical path
  } catch {}                          // tolerate ENOENT/EACCES — fall back to the raw dir
  return canonical + path.sep;        // trailing separator so prefix-comparisons are clean
});

// Mapping: hx→canonicalSandboxTmpDir, v8→memoize, VL→sandboxTmpDir, U$→getFs, D1→path
```

The underlying directory factory and its guards:

```javascript
// ============================================
// rawTmpDirRoot / assertSafeTmpDir / sandboxTmpDir
// Location: cli_inner_pretty.js:176735-176766
// ============================================

// ORIGINAL (for source lookup):
function vd() {
  if (process.env.CLAUDE_CODE_TMPDIR) return process.env.CLAUDE_CODE_TMPDIR;
  return PeK.tmpdir();
}
function GJ5(H) {
  let $ = process.getuid?.();
  if ($ === void 0) return;
  let q = "Set CLAUDE_CODE_TMPDIR to a directory you control, or ask an administrator to remove it.",
    K = pvH.lstatSync(H);
  if (!K.isDirectory()) throw Error(`Temp directory ${H} is not a directory (may be an attacker-planted symlink). Refusing to use it. ${q}`);
  if (K.uid !== $) throw Error(`Temp directory ${H} is owned by uid ${K.uid}, expected ${$}. Refusing to use it — another user may have pre-created it. ${q}`);
  if ((K.mode & 511) !== 448) pvH.chmodSync(H, 448);
}
function VL() {
  let H = `claude-${process.getuid?.() ?? 0}`,
    $ = pX6.join(vd(), H);
  if ($ !== LeK) {
    if (typeof process.getuid === "function") (pvH.mkdirSync($, { recursive: !0, mode: 448 }), GJ5($));
    else try { pvH.mkdirSync($, { recursive: !0, mode: 448 }); } catch {}
    LeK = $;
  }
  return $;
}

// READABLE (for understanding):
function rawTmpDirRoot() {
  if (process.env.CLAUDE_CODE_TMPDIR) return process.env.CLAUDE_CODE_TMPDIR;
  return os.tmpdir();
}
function assertSafeTmpDir(dir) {
  const uid = process.getuid?.();
  if (uid === undefined) return;                        // non-POSIX: skip
  const hint = "Set CLAUDE_CODE_TMPDIR to a directory you control, or ask an administrator to remove it.";
  const st = fs.lstatSync(dir);
  if (!st.isDirectory()) throw Error(`...may be an attacker-planted symlink... ${hint}`);
  if (st.uid !== uid)    throw Error(`...owned by uid ${st.uid}, expected ${uid}... ${hint}`);
  if ((st.mode & 0o777) !== 0o700) fs.chmodSync(dir, 0o700);  // force 0700
}
function sandboxTmpDir() {
  const name = `claude-${process.getuid?.() ?? 0}`;
  const dir = path.join(rawTmpDirRoot(), name);
  if (dir !== cachedTmpDir) {
    if (typeof process.getuid === "function") { fs.mkdirSync(dir, { recursive: true, mode: 0o700 }); assertSafeTmpDir(dir); }
    else try { fs.mkdirSync(dir, { recursive: true, mode: 0o700 }); } catch {}
    cachedTmpDir = dir;
  }
  return dir;
}

// Mapping: vd→rawTmpDirRoot, GJ5→assertSafeTmpDir, VL→sandboxTmpDir, PeK→os, pvH→fs,
//   pX6→path, LeK→cachedTmpDir, 448→0o700, 511→0o777
```

So the chain is: `rawTmpDirRoot` (env override or `os.tmpdir()`) → `sandboxTmpDir` (per-uid `claude-<uid>` subdir, created `0700`, ownership/symlink-checked) → `canonicalSandboxTmpDir` (symlink-resolved + trailing sep, memoized).

## 2.3 The write-allowlist substitution — `g24`

The sandbox system-prompt builder dumps the actual filesystem allowlist to the model, but rewrites any entry equal to the canonical tmp dir back to the literal token `$TMPDIR` so the prompt stays portable and doesn't leak a uid-specific path:

```javascript
// ============================================
// buildSandboxPromptSection - sandbox prompt + $TMPDIR token substitution
// Location: cli_inner_pretty.js:438967-438980, 439019
// ============================================

// ORIGINAL (for source lookup):
function g24() {
  if (!Oq.isSandboxingEnabled()) return "";
  let H = Oq.getFsReadConfig(),
    $ = Oq.getFsWriteConfig(),
    ...
    A = hx(),
    Y = (D) => aq(D).map((J) => (J === A ? "$TMPDIR" : J)),
    f = {
      read: { denyOnly: tH$(H.denyOnly), ...(H.allowWithinDeny && { allowWithinDeny: tH$(H.allowWithinDeny) }) },
      write: { allowOnly: Y($.allowOnly), denyWithinAllow: tH$($.denyWithinAllow) },
    },
    ...
  // (prompt body) ...
    "For temporary files, always use the `$TMPDIR` environment variable. TMPDIR is set to the same sandbox-writable directory for both sandboxed and unsandboxed commands. Do NOT use `/tmp` directly - use `$TMPDIR` instead.",
  ...
}

// READABLE (for understanding):
function buildSandboxPromptSection() {
  if (!sandbox.isSandboxingEnabled()) return "";
  const fsRead  = sandbox.getFsReadConfig();
  const fsWrite = sandbox.getFsWriteConfig();
  const canonicalTmp = canonicalSandboxTmpDir();                 // A = hx()
  const subTmpToken = (dirs) =>
    dedupe(dirs).map((d) => (d === canonicalTmp ? "$TMPDIR" : d)); // literal dir → "$TMPDIR"
  const filesystem = {
    read:  { denyOnly: cleanDirs(fsRead.denyOnly), ...(fsRead.allowWithinDeny && { allowWithinDeny: cleanDirs(fsRead.allowWithinDeny) }) },
    write: { allowOnly: subTmpToken(fsWrite.allowOnly), denyWithinAllow: cleanDirs(fsWrite.denyWithinAllow) },
  };
  // ...assemble "## Command sandbox" section, ending with:
  //   "For temporary files, always use the `$TMPDIR` environment variable. TMPDIR is set to the
  //    same sandbox-writable directory for both sandboxed and unsandboxed commands. ..."
}

// Mapping: g24→buildSandboxPromptSection, Oq→sandbox, hx→canonicalSandboxTmpDir, A→canonicalTmp,
//   aq→dedupe, Y→subTmpToken, tH$→cleanDirs, $→fsWrite, H→fsRead
```

The substitution compares write-allowlist entries against `hx()` — the **realpath'd** dir — which is why `hx` had to be canonicalized: the sandbox's own allowlist entries are canonical, so the token-rewrite only fires if the comparison value is canonical too. Note the prompt instruction itself now states the new invariant explicitly: *"TMPDIR is set to the same sandbox-writable directory for both sandboxed and unsandboxed commands"* (cli_inner_pretty.js:439019).

## 2.4 The env overrides — same dir for both modes

The child-process env is built by the shell adapter's `getEnvironmentOverrides`. The tmp dir value flows in as `sandboxTmpDir` and is written to **both** `TMPDIR` and `CLAUDE_CODE_TMPDIR`:

There are exactly **two** TMPDIR override adapters in the bundle — confirmed by `grep "CLAUDE_CODE_TMPDIR = "`, which returns precisely two sites: cli_inner_pretty.js:341411 (the `type:"bash"` adapter) and cli_inner_pretty.js:341544 (the `type:"powershell"` adapter). There is no third/"generic" adapter, so no shell mode can diverge on the override.

```javascript
// ============================================
// bash shell adapter TMPDIR override (handles bash/zsh login shells)
// Location: cli_inner_pretty.js:341403-341413 (adapter type:"bash" / factory Gs7 @341341, header @341357)
// ============================================

// ORIGINAL (for source lookup):
async getEnvironmentOverrides(A, Y) {
  let f = null, O = {};
  if (((O[mx6] = process.execPath), f)) O.TMUX = f;
  if (Y) for (let [M, j] of Y) O[M] = j;
  if (q) {
    let M = q;
    if (n$() === "windows") M = cW(M);
    ((O.TMPDIR = M), (O.CLAUDE_CODE_TMPDIR = M), (O.TMPPREFIX = SG$.join(M, "zsh")));
  }
  return O;
}

// READABLE (for understanding):
async getEnvironmentOverrides(_arg, sessionEnvVars) {
  const env = {};
  env[EXEC_PATH_VAR] = process.execPath;
  if (sessionEnvVars) for (const [k, v] of sessionEnvVars) env[k] = v;
  if (sandboxTmpDir) {                       // q = the captured sandboxTmpDir (from buildExecCommand)
    let dir = sandboxTmpDir;
    if (isWindows()) dir = toWindowsPath(dir);
    env.TMPDIR = dir;
    env.CLAUDE_CODE_TMPDIR = dir;            // same value (cli_inner_pretty.js:341411)
    env.TMPPREFIX = path.join(dir, "zsh");   // a zsh-specific tmp prefix the bash adapter also sets under the same dir
  }
  return env;
}

// Mapping: q→sandboxTmpDir, n$→isWindows, cW→toWindowsPath, SG$→path, mx6→EXEC_PATH_VAR
```

This is the `type:"bash"` adapter returned by the factory `createBashShellAdapter` (`Gs7`, cli_inner_pretty.js:341341; the `type: "bash"` header is at cli_inner_pretty.js:341357). It captures the tmp dir as `q = Y.sandboxTmpDir` at cli_inner_pretty.js:341370. The `TMPPREFIX=path.join(dir,"zsh")` line is just a zsh-specific temp-prefix the **bash** adapter sets — it does **not** imply a separate zsh adapter (this one factory covers bash/zsh login shells).

```javascript
// ============================================
// PowerShell adapter TMPDIR override
// Location: cli_inner_pretty.js:341541-341546 (adapter type:"powershell" / factory Es7 @341512, header @341515)
// ============================================

// ORIGINAL (for source lookup):
async getEnvironmentOverrides(q, K) {
  let _ = {};
  if (K) for (let [z, A] of K) _[z] = A;
  if ($) ((_.TMPDIR = $), (_.CLAUDE_CODE_TMPDIR = $));
  return _;
}

// READABLE (for understanding):
async getEnvironmentOverrides(_arg, sessionEnvVars) {
  const env = {};
  if (sessionEnvVars) for (const [k, v] of sessionEnvVars) env[k] = v;
  if (sandboxTmpDir) { env.TMPDIR = sandboxTmpDir; env.CLAUDE_CODE_TMPDIR = sandboxTmpDir; }  // same value (cli_inner_pretty.js:341544)
  return env;
}

// Mapping: $→sandboxTmpDir
```

This is the `type:"powershell"` adapter returned by the factory `createPowershellShellAdapter` (`Es7`, cli_inner_pretty.js:341512; the `type: "powershell"` header is at cli_inner_pretty.js:341515). It captures the tmp dir as `$ = K.sandboxTmpDir` at cli_inner_pretty.js:341519.

In 2.1.156 the captured tmp dir (`q` for the bash adapter, captured at cli_inner_pretty.js:341370; `$` for the PowerShell adapter, captured at cli_inner_pretty.js:341519) is set from the `sandboxTmpDir` field passed to `buildExecCommand`, and the spawn driver sets that field to `VL()` **unconditionally**:

```javascript
// ORIGINAL (for source lookup):  cli_inner_pretty.js:341626-341631
X = VL(),                                          // 341626 — unconditional
{ commandString: L, cwdFilePath: P } = await D.buildExecCommand(H, {
  id: J,
  sandboxTmpDir: X,                                // 341629 — same value handed to both adapters
  useSandbox: Y ?? !1,
}),

// READABLE: the sandbox tmp dir is computed for EVERY spawn, sandboxed or not.
//   sandboxTmpDir: VL()    ← not  (useSandbox ? VL() : undefined)
```

The two 2.1.156-side facts here are verbatim, **not** reconstructed: (a) the driver assigns `X = VL()` **unconditionally** at cli_inner_pretty.js:341626 and threads it as `sandboxTmpDir: X` at cli_inner_pretty.js:341629 (contrast 2.1.142's conditional `X = Y ? vL() : void 0` in §2.5); (b) both adapters then write `TMPDIR = CLAUDE_CODE_TMPDIR = <that same dir>` (bash at cli_inner_pretty.js:341411, PowerShell at cli_inner_pretty.js:341544 — the only two override sites per the grep above). Only the *pre-fix divergence* narrative in §2.5 remains a reconstruction; these spawn/override facts are pinned.

## 2.5 Cross-validation against 2.1.142 — the pre-fix divergence

The same machinery exists in 2.1.142 but with two differences that, together, produce the observed divergence:

1. **No realpath.** The 2.1.142 `vL` (2.1.142 cli_inner_pretty.js:173853-173865) returns `path.join(rawTmpDirRoot(), "claude-<uid>")` directly — there is **no** `canonicalSandboxTmpDir`/`hx` wrapper and **no** `realpathSync`. (The symbol `VL` *does* exist in the 2.1.142 bundle, but it is an unrelated Ink UI layout component at 2.1.142 cli_inner_pretty.js:166576 — a reused short name, not the tmp dir.)
2. **Sandbox-only.** The 2.1.142 spawn driver set the field conditionally:

```javascript
// ORIGINAL (2.1.142, for source lookup):  2.1.142 cli_inner_pretty.js:361140-361146
X = Y ? vL() : void 0,                       // ← only when useSandbox is true
{ commandString: L, cwdFilePath: P } = await j.buildExecCommand(H, {
  id: J,
  sandboxTmpDir: X,
  useSandbox: Y ?? !1,
}),
```

And the 2.1.142 sandbox prompt note read: *"TMPDIR is automatically set to the correct sandbox-writable directory **in sandbox mode**"* (2.1.142 cli_inner_pretty.js:418804) — explicitly *sandbox-mode only*, versus 2.1.156's *"for both sandboxed and unsandboxed commands."*

So in 2.1.142, a sandboxed command got `TMPDIR = vL()` (a `claude-<uid>` dir, possibly behind a symlink), while an unsandboxed command in the *same session* got `sandboxTmpDir: void 0`, so the env override never fired and the child inherited the ambient `TMPDIR`/`os.tmpdir()` (e.g. `/tmp`, or macOS `$TMPDIR=/var/folders/...`). Two different directories → the changelog symptom.

```
                       2.1.142                          2.1.156
                ┌──────────────────────┐        ┌──────────────────────┐
 sandboxed   →  │ TMPDIR = vL()        │        │ TMPDIR = realpath(VL)│
                │   (no realpath)      │        │   (canonical)        │
 unsandboxed →  │ TMPDIR = ambient     │   ⇒    │ TMPDIR = realpath(VL)│
                │   (/tmp, /var/...)   │        │   (canonical)        │
                └──────────────────────┘        └──────────────────────┘
                 sandboxed ≠ unsandboxed          sandboxed = unsandboxed
```

> Honest precision: the *spawn* env overrides write `VL()` (un-realpath'd) into the child env, while the *prompt-substitution* token-match uses `hx()` (realpath'd). These are consistent only insofar as the OS sandbox itself realpath-resolves before enforcing, and the prompt rewrite needs the canonical form to match the canonical allowlist entry. The two co-changes that demonstrably fix the changelog symptom are (a) `realpathSync` canonicalization landing in the tmp-dir path (`hx` at cli_inner_pretty.js:550128-550136, the `realpathSync` call at 550133), and (b) the env override now firing for both modes (driver sets `sandboxTmpDir: VL()` unconditionally — `X = VL()` at cli_inner_pretty.js:341626, threaded as `sandboxTmpDir: X` at 341629 — and both adapters write `TMPDIR=CLAUDE_CODE_TMPDIR=<same dir>`, bash at 341411 / PowerShell at 341544, the only two override sites). I have **not** found a single line that says "if unsandboxed, previously used a different dir" — that conclusion is reconstructed from the 2.1.142 `X = Y ? vL() : void 0` conditional (2.1.142 cli_inner_pretty.js:361140). Hence **medium** confidence on the precise pre-fix mechanism only; the 2.1.156-side spawn/canonicalization/override facts are **high**-confidence verbatim, and **high** confidence that both code paths now resolve to the same canonical directory.

## 2.6 Why this approach

**Why route both modes through one directory instead of giving each its own?** A session routinely mixes sandboxed and unsandboxed `Bash` calls (the model retries with `dangerouslyDisableSandbox: true` when a sandboxed command fails — see the prompt at cli_inner_pretty.js:439007). If a sandboxed step writes `$TMPDIR/build.log` and an unsandboxed step tries to read it, divergent `$TMPDIR` values silently break the workflow. Unifying on one per-uid dir makes temp state portable across the sandbox boundary.

**Why `realpathSync` and not just the join?** The sandbox enforcement layer compares against canonical paths. On macOS the default tmp root is under `/var/folders/...`, and `/var` is a firmlink to `/private/var`; on Linux `/tmp` can be a symlink. If the env value were the non-canonical path while the sandbox allowlist holds the canonical one, a write inside `$TMPDIR` could be denied by the sandbox even though the directory is *meant* to be writable. Canonicalizing the value the model is told to use guarantees it matches what the sandbox allows. The `try/catch` around `realpathSync` (cli_inner_pretty.js:550132-550134) tolerates a not-yet-created or unreadable dir by falling back to the raw path — never throwing during prompt assembly.

**Why memoize (`v8`) and append a trailing separator?** `canonicalSandboxTmpDir` is consulted on every prompt build and every allowlist comparison; `realpathSync` is a syscall, so it is cached. The trailing `path.sep` (cli_inner_pretty.js:550135) makes the value safe for prefix containment checks (`somePath.startsWith(tmpDir)`) without a false match on a sibling like `/tmp/claude-1000x`.

**Why also keep the ownership/mode guard (`assertSafeTmpDir`)?** Because a shared, predictable per-uid path (`<tmproot>/claude-<uid>`) is an attractive symlink/pre-creation target. The guard refuses a dir that isn't a real directory, isn't owned by the current uid, and forces `0700` (cli_inner_pretty.js:176744-176752). Unifying the path makes this guard *more* important, since both sandboxed and unsandboxed commands now trust the same directory.

**Key insight:** This is the *dual* of the home-directory bug. There, two paths that were the *same* directory failed an equality check (asymmetric normalization → under-blocking). Here, two `$TMPDIR` values that should have *been* the same directory weren't — also an asymmetric-normalization failure (one path realpath'd/canonical, the other ambient and possibly symlinked), just with a usability consequence instead of a security one. Both fixes are the same discipline applied in two places: **canonicalize every path that participates in a comparison or a cross-context handoff to one identical form.**

---

## Confidence summary

| Fix | Confidence | Basis |
|-----|-----------|-------|
| `rm -rf $HOME` trailing slash + case | **high** | Verified line-by-line diff of `PlH` (2.1.156:211484-211498) vs `nUH` (2.1.142:207091-207104); the homedir slash-strip at 211493 and `OJ(z)===OJ(A)` at 211494 are the exact added operations. |
| TMPDIR canonicalization + same-dir env | **medium** (pre-fix narrative only) | 2.1.156-side facts all **high**/verbatim: `realpathSync` canonicalization (`hx` 550128-550136, call at 550133); unconditional `X = VL()` (341626) threaded as `sandboxTmpDir: X` (341629); same-value `TMPDIR=CLAUDE_CODE_TMPDIR` env overrides at the **only** two adapter sites — bash `type:"bash"` (`Gs7` @341341, override @341411) and PowerShell `type:"powershell"` (`Es7` @341512, override @341544); "for both sandboxed and unsandboxed" prompt note (439019). The **medium** label applies solely to the pre-fix divergence narrative, reconstructed from 2.1.142 `X = Y ? vL() : void 0` (2.1.142:361140) + "in sandbox mode" prompt (2.1.142:418804) — no single self-describing line. |

Both fixes are NEW relative to the readable v2.1.88 source (the v2.1.142 bundle is the nearest precursor for both; the dangerous-path predicate and the per-uid tmp dir both exist in 2.1.142 but without these specific normalizations).
