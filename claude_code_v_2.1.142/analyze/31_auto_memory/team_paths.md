# Team Memory Paths — Deep Deobfuscation (v2.1.142)

## Overview

Deep walk-through of `src/memdir/teamMemPaths.ts` — the path-construction and traversal-defense layer for team memory.

**v2.1.88 source**: `/lyz/codespace/3rd/claude-code/src/memdir/teamMemPaths.ts`
**v2.1.142 locations** in `cli_inner_pretty.js`:
- `142484-142494` — Namespace export and module-private setup
- `142495-142510` — `sanitizePathKey` (`zS1`)
- `142511-142514` — `isTeamMemoryEnabled` (`g5$`)
- `142515-142517` — `getTeamMemPath` (`Dl`)
- `142518-142521` — `isTeamMemoryActiveForCwd` (`ii$`)
- `142522-142543` — `realpathDeepestExisting` (`RVK`)
- `142544-142555` — `isRealPathWithinTeamDir` (`CVK`)
- `142556-142560` — `isTeamMemPath` (`bVK`)
- `142561-142569` — `validateTeamMemWritePath` (`YS1`)
- `142570-142579` — `validateTeamMemKey` (`ri$`)
- `142580-142582` — `isTeamMemFile` (`Q5$`)
- `142583-142596` — `PathTraversalError` class (`uT`) + module dependency setup

**Key insight**: Every function in this file is in service of one invariant: **a write to "team memory" must land inside the canonical `getTeamMemPath()` directory, even after symlink resolution**. The PSR-M22186 and PSR-M22187 vectors (URL-encoded traversal + unicode-normalized traversal + symlink escape) drive the design. The implementation is **bit-equivalent** to v2.1.112 — only the obfuscated names changed.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — this unit's additions

Key functions in this document:
- `PathTraversalError` (`uT`) — `cli_inner_pretty.js:142583-142595`
- `sanitizePathKey` (`zS1`) — `cli_inner_pretty.js:142495-142510`
- `isTeamMemoryEnabled` (`g5$`) — `cli_inner_pretty.js:142511-142514`
- `getTeamMemPath` (`Dl`) — `cli_inner_pretty.js:142515-142517`
- `isTeamMemoryActiveForCwd` (`ii$`) — `cli_inner_pretty.js:142518-142521`
- `realpathDeepestExisting` (`RVK`) — `cli_inner_pretty.js:142522-142543`
- `isRealPathWithinTeamDir` (`CVK`) — `cli_inner_pretty.js:142544-142555`
- `isTeamMemPath` (`bVK`) — `cli_inner_pretty.js:142556-142560`
- `validateTeamMemWritePath` (`YS1`) — `cli_inner_pretty.js:142561-142569`
- `validateTeamMemKey` (`ri$`) — `cli_inner_pretty.js:142570-142579`
- `isTeamMemFile` (`Q5$`) — `cli_inner_pretty.js:142580-142582`

---

## 1. Threat Model

The validators in this file defend against **path traversal** and **symlink escape** by inputs that originate from one or more of:

| Source | Trust | Attack vector |
|--------|-------|---------------|
| Main agent's `Write` tool | Semi-trusted | Agent hallucinates `team/../../etc/passwd` |
| Extract subagent | Semi-trusted | Same as main agent |
| Server-pushed sync key | **Untrusted** | Adversarial repo's team memory contains `%2e%2e%2fetc/passwd` keys or symlinks pointing outside |
| Filesystem state in `team/` | **Untrusted** | A pre-planted symlink inside `team/` points to `~/.ssh/authorized_keys` |

PSR M22186 specifically calls out the symlink case: `path.resolve()` is purely lexical — it does *not* read the filesystem. An attacker who can place a symlink inside `team/` would pass a `resolve()`-based containment check while the actual `fs.writeFile()` follows the link out of `team/`.

PSR M22187 (vector 4) calls out unicode normalization: ASCII `..` is the obvious traversal, but glyphs like fullwidth `．．／` (U+FF0E U+FF0F) normalize under NFKC to ASCII `../`.

---

## 2. The Error Type

```javascript
// ============================================
// PathTraversalError - Distinguished error for all path-traversal rejections
// Location: cli_inner_pretty.js:142583-142595
// ============================================

// ORIGINAL (for source lookup):
uT = class uT extends Error {
  constructor(H) {
    super(H);
    this.name = "PathTraversalError";
  }
};

// READABLE (for understanding):
export class PathTraversalError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PathTraversalError'
  }
}

// Mapping: uT→PathTraversalError, H→message
```

**Why a distinct class** (unchanged from v2.1.112): Upstream callers (the extract subagent batch processor, the sync watcher) catch `PathTraversalError` specifically to skip the offending entry instead of aborting the entire batch.

---

## 3. Sanitizing Relative Keys

`sanitizePathKey` runs only on **untrusted relative path keys** (the server-pushed sync case).

```javascript
// ============================================
// sanitizePathKey - Reject 5 classes of malicious relative-key strings
// Location: cli_inner_pretty.js:142495-142510
// ============================================

// ORIGINAL (for source lookup):
function zS1(H) {
  if (H.includes("\x00")) throw new uT(`Null byte in path key: "${H}"`);
  let $;
  try { $ = decodeURIComponent(H); } catch { $ = H; }
  if ($ !== H && ($.includes("..") || $.includes("/"))) throw new uT(`URL-encoded traversal in path key: "${H}"`);
  let q = H.normalize("NFKC");
  if (q !== H && (q.includes("..") || q.includes("/") || q.includes("\\") || q.includes("\x00")))
    throw new uT(`Unicode-normalized traversal in path key: "${H}"`);
  if (H.includes("\\")) throw new uT(`Backslash in path key: "${H}"`);
  if (H.startsWith("/")) throw new uT(`Absolute path key: "${H}"`);
  return H;
}

// READABLE (for understanding):
function sanitizePathKey(key) {
  // (1) Null byte — truncates paths in C-based syscalls
  if (key.includes('\0')) {
    throw new PathTraversalError(`Null byte in path key: "${key}"`)
  }
  // (2) URL-encoded traversal (e.g. %2e%2e%2f)
  let decoded
  try { decoded = decodeURIComponent(key) } catch { decoded = key }
  if (decoded !== key && (decoded.includes('..') || decoded.includes('/'))) {
    throw new PathTraversalError(`URL-encoded traversal in path key: "${key}"`)
  }
  // (3) NFKC normalization attack (fullwidth ．．／ → ASCII ../)
  const normalized = key.normalize('NFKC')
  if (
    normalized !== key &&
    (normalized.includes('..') || normalized.includes('/') ||
     normalized.includes('\\') || normalized.includes('\0'))
  ) {
    throw new PathTraversalError(`Unicode-normalized traversal in path key: "${key}"`)
  }
  // (4) Windows backslash separator
  if (key.includes('\\')) {
    throw new PathTraversalError(`Backslash in path key: "${key}"`)
  }
  // (5) Absolute path
  if (key.startsWith('/')) {
    throw new PathTraversalError(`Absolute path key: "${key}"`)
  }
  return key
}

// Mapping: zS1→sanitizePathKey, H→key, $→decoded, q→normalized
```

**Five layered checks** (unchanged from v2.1.112):

1. **Null byte** — `fs.writeFile("team/foo\x00bar")` may truncate at the null on glibc.
2. **URL-encoded traversal** — Defensive layer for any downstream `decodeURIComponent`.
3. **NFKC normalization** — Fullwidth Unicode forms that normalize to ASCII traversal.
4. **Backslash** — Windows separator that breaks the relative-key contract.
5. **Absolute path** — `path.join` is broken-by-design when one operand is absolute.

**Key insight**: Each check is necessary because no single check covers the others. URL-encoded `..` survives Unicode-normalization-only checks. NFKC `．．／` survives URL-decode-only checks. The cost is five string passes per key; the team-sync watcher amortizes that over a network fetch, so the cost is negligible.

---

## 4. Path Computation

### 4.1 `getTeamMemPath` (Dl)

```javascript
// ============================================
// getTeamMemPath - Compute the team memory directory absolute path
// Location: cli_inner_pretty.js:142515-142517
// ============================================

// ORIGINAL (for source lookup):
function Dl() {
  return (hE.join(UY(), "team") + hE.sep).normalize("NFC");
}

// READABLE (for understanding):
export function getTeamMemPath() {
  return (path.join(getAutoMemPath(), 'team') + path.sep).normalize('NFC')
}

// Mapping: Dl→getTeamMemPath, hE→path module, UY→getAutoMemPath
```

**Three observations** on the return value (unchanged from v2.1.112):

1. **Trailing separator** is appended explicitly (`+ path.sep`). Required for the prefix-attack-protection in `isTeamMemPath`.
2. **`.normalize('NFC')`** is applied at the end. Canonical normalization (NFC), not compatibility (NFKC) — the directory path is *our own* canonical form.
3. **`getAutoMemPath()` is memoized**. The memo key is `(projectRoot, isTinyMemoryEnabled)`, so every call to `getTeamMemPath()` for a given project returns the same string. Tiny mode produces a different team path (`tiny_memory/team/` instead of `memory/team/`) — but both stay nested under the appropriate parent.

### 4.2 `getTeamMemEntrypoint`

Not standalone. The path `team/MEMORY.md` is constructed inline by the combined prompt builder at `cli_inner_pretty.js:142624` (via `join(teamDir, ENTRYPOINT_NAME)` reflected in the prompt text).

---

## 5. `realpathDeepestExisting` (RVK) — Symlink-Aware Path Resolution

```javascript
// ============================================
// realpathDeepestExisting - Resolve symlinks on the deepest existing prefix
// Location: cli_inner_pretty.js:142522-142543
// ============================================

// ORIGINAL (for source lookup):
async function RVK(H) {
  let $ = [],
    q = H;
  for (let K = hE.dirname(q); q !== K; K = hE.dirname(q))
    try {
      let _ = await F5$.realpath(q);
      return $.length === 0 ? _ : hE.join(_, ...$.reverse());
    } catch (_) {
      let A = O8(_);
      if (A === "ENOENT")
        try {
          if ((await F5$.lstat(q)).isSymbolicLink())
            throw new uT(`Dangling symlink detected (target does not exist): "${q}"`);
        } catch (z) {
          if (z instanceof uT) throw z;
        }
      else if (A === "ELOOP") throw new uT(`Symlink loop detected in path: "${q}"`);
      else if (A !== "ENOTDIR" && A !== "ENAMETOOLONG") throw new uT(`Cannot verify path containment (${A}): "${q}"`);
      ($.push(q.slice(K.length + hE.sep.length)), (q = K));
    }
  return H;
}

// READABLE (for understanding):
async function realpathDeepestExisting(targetPath) {
  const trailing = []
  let candidate = targetPath
  for (let parent = path.dirname(candidate); candidate !== parent; parent = path.dirname(candidate)) {
    try {
      const resolved = await fs.realpath(candidate)
      return trailing.length === 0 ? resolved : path.join(resolved, ...trailing.reverse())
    } catch (err) {
      const code = extractErrorCode(err)
      if (code === 'ENOENT') {
        try {
          if ((await fs.lstat(candidate)).isSymbolicLink()) {
            throw new PathTraversalError(`Dangling symlink detected (target does not exist): "${candidate}"`)
          }
        } catch (innerErr) {
          if (innerErr instanceof PathTraversalError) throw innerErr
          // otherwise ignore — neither symlink nor lookupable, just doesn't exist yet
        }
      } else if (code === 'ELOOP') {
        throw new PathTraversalError(`Symlink loop detected in path: "${candidate}"`)
      } else if (code !== 'ENOTDIR' && code !== 'ENAMETOOLONG') {
        throw new PathTraversalError(`Cannot verify path containment (${code}): "${candidate}"`)
      }
      trailing.push(candidate.slice(parent.length + path.sep.length))
      candidate = parent
    }
  }
  return targetPath
}

// Mapping: RVK→realpathDeepestExisting, H→targetPath, $→trailing, q→candidate, K→parent,
//          _→resolved/err, A→code, z→innerErr,
//          F5$→fs/promises, hE→path, O8→extractErrorCode, uT→PathTraversalError
```

### What it does

Walks up the path from leaf to root, calling `fs.realpath()` on each ancestor until one resolves successfully. The unresolved tail (the part of the path that doesn't yet exist on disk) is appended to the resolved ancestor.

### Why this approach

A naive `fs.realpath()` on a write-target path fails if the target doesn't exist yet. But we still need to know whether the *resolved ancestor* lies inside `team/` — because if `~/.claude/projects/<slug>/memory/team` itself is a symlink to `~/.ssh/`, then a write to `team/keys.md` lands in `~/.ssh/keys.md`.

The algorithm:
1. Try `realpath(target)`. If it succeeds, the file exists — return its resolved path.
2. If it fails with `ENOENT`, the file doesn't exist. Pop the last segment, recurse on the parent.
3. **Special-case ENOENT-on-symlink**: If the lookup failed but `lstat(target).isSymbolicLink()` is true, this is a **dangling symlink** — a symlink pointing to a non-existent target. Throw `PathTraversalError` because a future create of the target could write to wherever the link points.
4. **Special-case ELOOP**: Symlink cycle. Throw — never trust a path with a cycle.
5. **Unrecognized errors**: Throw. The validator can't reason about partial states.

### Key insight

This is the **defense against symlink-during-mkdir** attacks. Without this resolution, a `validateTeamMemWritePath("team/innocent.md")` could pass the prefix check (the literal path starts with `team/`) but `fs.writeFile` would follow a pre-planted symlink at `team/` to write somewhere else entirely. The realpath ancestor lookup catches the symlink before the write fires.

---

## 6. `isRealPathWithinTeamDir` (CVK) — Symlink-Aware Containment Check

```javascript
// ============================================
// isRealPathWithinTeamDir - Verify a path resolves inside team/
// Location: cli_inner_pretty.js:142544-142555
// ============================================

// ORIGINAL (for source lookup):
async function CVK(H) {
  let $;
  try {
    $ = await F5$.realpath(Dl().replace(/[/\\]+$/, ""));
  } catch (q) {
    let K = O8(q);
    if (K === "ENOENT" || K === "ENOTDIR") return !0;
    return !1;
  }
  if (H === $) return !0;
  return H.startsWith($ + hE.sep);
}

// READABLE (for understanding):
async function isRealPathWithinTeamDir(candidate) {
  let teamDirResolved
  try {
    teamDirResolved = await fs.realpath(getTeamMemPath().replace(/[/\\]+$/, ''))
  } catch (err) {
    const code = extractErrorCode(err)
    if (code === 'ENOENT' || code === 'ENOTDIR') return true   // team dir doesn't exist yet — trust caller
    return false                                                // other errors → distrust
  }
  if (candidate === teamDirResolved) return true
  return candidate.startsWith(teamDirResolved + path.sep)
}

// Mapping: CVK→isRealPathWithinTeamDir, H→candidate, $→teamDirResolved, q→err, K→code
```

### What it does

Given a candidate path (already resolved via `realpathDeepestExisting`), check that it actually lies inside the **real** team directory after symlinks are resolved.

### Why this is needed alongside `isTeamMemPath`

`isTeamMemPath` (`bVK`) does a fast string-prefix check against the *literal* `getTeamMemPath()`. That works for a happy-path absolute path. But once symlinks enter the picture, the canonical-form prefix check is no longer sufficient — the real directory `team/` might itself be a symlink to a different location.

`isRealPathWithinTeamDir` does the post-realpath check: resolve the *team dir itself* through any symlinks, then verify the candidate starts with the resolved team root.

### Special case: team dir doesn't exist yet

`ENOENT` / `ENOTDIR` on `realpath(teamDir)` means the team dir hasn't been created yet — this is the **brand-new-clone state**. In that case, the function returns `true` and trusts the caller to create the dir at a safe location. This is correct because:
1. Before the team dir exists, there can be no symlinks inside it.
2. The dir is about to be created via `fs.mkdir(teamDir)`, which the user controls.

If the user has a malicious symlink at the very location where `teamDir` should be (e.g., they replaced `~/.claude/projects/<slug>/memory/team` with `ln -s ~/.ssh`), that would surface as `ENOENT` only if the link target doesn't exist — in which case `realpath` returns `ENOENT` and we trust the caller. **This is a small attack surface** because the user must have already symlinked the slot where their own team dir would go; the system isn't accepting an external path here.

### Key insight

This function pairs with `realpathDeepestExisting` to provide **end-to-end symlink-safe containment**. The two together implement the canonical "resolve everything, then check" pattern that `path.resolve` alone cannot do.

---

## 7. `isTeamMemPath` (bVK) — Synchronous Path Membership

```javascript
// ============================================
// isTeamMemPath - Synchronous prefix check (no realpath)
// Location: cli_inner_pretty.js:142556-142560
// ============================================

// ORIGINAL (for source lookup):
function bVK(H) {
  let $ = hE.resolve(H),
    q = Dl();
  return $ + hE.sep === q || $.startsWith(q);
}

// READABLE (for understanding):
export function isTeamMemPath(absolutePath) {
  const resolved = path.resolve(absolutePath)
  const teamDir = getTeamMemPath()
  return resolved + path.sep === teamDir || resolved.startsWith(teamDir)
}

// Mapping: bVK→isTeamMemPath, H→absolutePath, $→resolved, q→teamDir
```

### What it does

Quick synchronous check: does this path lie inside the team dir? Used by the filesystem-permission carve-out and by the "should this read trigger team-mem telemetry?" decision.

### Why no realpath

Speed. This is called from hot paths (per-tool-use permission checks, per-file read telemetry). The realpath-aware version (`isRealPathWithinTeamDir`) is only used at write time, where the latency cost is acceptable.

### Why the `===` check before `startsWith`

The team dir path ends with `path.sep`, but the *resolved* version of a directory path may not. The `+ sep` then `===` check handles "is this path exactly the team dir itself" vs "is this path a descendant."

### Key insight

This is the **fast path**. It's slightly less safe than the realpath version (a symlink-decorated path could lie about its membership), but writes go through `validateTeamMemWritePath` which uses the strict version. Reads (which only need to know whether to log a "team memory read" telemetry event) use the fast path because the worst case is a misclassified telemetry event, not a security breach.

---

## 8. Write Validation: `validateTeamMemWritePath` (YS1) and `validateTeamMemKey` (ri$)

### `validateTeamMemWritePath`

```javascript
// ============================================
// validateTeamMemWritePath - Validate an absolute write target
// Location: cli_inner_pretty.js:142561-142569
// ============================================

// ORIGINAL (for source lookup):
async function YS1(H) {
  if (H.includes("\x00")) throw new uT(`Null byte in path: "${H}"`);
  let $ = hE.resolve(H),
    q = Dl();
  if (!$.startsWith(q)) throw new uT(`Path escapes team memory directory: "${H}"`);
  let K = await RVK($);
  if (!(await CVK(K))) throw new uT(`Path escapes team memory directory via symlink: "${H}"`);
  return $;
}

// READABLE (for understanding):
export async function validateTeamMemWritePath(absolutePath) {
  // (1) Null-byte rejection
  if (absolutePath.includes('\0')) {
    throw new PathTraversalError(`Null byte in path: "${absolutePath}"`)
  }
  // (2) Lexical prefix check against the team dir
  const resolved = path.resolve(absolutePath)
  const teamDir = getTeamMemPath()
  if (!resolved.startsWith(teamDir)) {
    throw new PathTraversalError(`Path escapes team memory directory: "${absolutePath}"`)
  }
  // (3) Realpath-aware containment check
  const realResolved = await realpathDeepestExisting(resolved)
  if (!(await isRealPathWithinTeamDir(realResolved))) {
    throw new PathTraversalError(`Path escapes team memory directory via symlink: "${absolutePath}"`)
  }
  return resolved
}

// Mapping: YS1→validateTeamMemWritePath, H→absolutePath, $→resolved, q→teamDir, K→realResolved
```

### What it does

Validates an absolute write path against the team directory. Throws `PathTraversalError` if any defense fires; returns the resolved-but-not-realpath'd path otherwise.

### Three layers of defense

1. **Null byte** — Direct reject (same as `sanitizePathKey`'s rule 1).
2. **Lexical prefix** — `path.resolve(absolutePath).startsWith(teamDir)`. Fast path that catches `team/../etc/passwd` style attacks where the lexical normalization makes the prefix mismatch obvious.
3. **Realpath containment** — Catches symlink escapes that the lexical check misses.

### Why both lexical and realpath checks

The lexical check is **fast and sufficient for non-symlink attacks**. The realpath check is **slow but catches symlinks**. Running both means non-malicious calls (the common case) get the fast rejection path; only suspicious paths pay the realpath cost.

### `validateTeamMemKey`

```javascript
// ============================================
// validateTeamMemKey - Validate a relative key (sync-watcher input)
// Location: cli_inner_pretty.js:142570-142579
// ============================================

// ORIGINAL (for source lookup):
async function ri$(H) {
  zS1(H);
  let $ = Dl(),
    q = hE.join($, H),
    K = hE.resolve(q);
  if (!K.startsWith($)) throw new uT(`Key escapes team memory directory: "${H}"`);
  let _ = await RVK(K);
  if (!(await CVK(_))) throw new uT(`Key escapes team memory directory via symlink: "${H}"`);
  return K;
}

// READABLE (for understanding):
export async function validateTeamMemKey(relativeKey) {
  sanitizePathKey(relativeKey)                          // throw if key is malformed
  const teamDir = getTeamMemPath()
  const joined = path.join(teamDir, relativeKey)
  const resolved = path.resolve(joined)
  if (!resolved.startsWith(teamDir)) {
    throw new PathTraversalError(`Key escapes team memory directory: "${relativeKey}"`)
  }
  const realResolved = await realpathDeepestExisting(resolved)
  if (!(await isRealPathWithinTeamDir(realResolved))) {
    throw new PathTraversalError(`Key escapes team memory directory via symlink: "${relativeKey}"`)
  }
  return resolved
}

// Mapping: ri$→validateTeamMemKey, H→relativeKey, $→teamDir, q→joined, K→resolved, _→realResolved
```

### How it differs from `validateTeamMemWritePath`

`validateTeamMemWritePath` takes an *absolute* path (what the agent's Write tool produces). `validateTeamMemKey` takes a *relative* path key (what the sync watcher receives from the server) and joins it against the team dir.

`validateTeamMemKey` also runs `sanitizePathKey` first — relative keys can have their own malformed forms (NFKC attacks, encoded `..`, etc.) that absolute paths can't because absolute paths are produced locally.

### Key insight

The two validators are **mirror entry points for the two writer sources**. Agent writes use absolute paths; sync writes use relative keys. Both converge on the same realpath-checked containment guarantee. The realpath layer is the bottom of the chain — any path that reaches `fs.writeFile` has been verified to land inside the team dir's real on-disk location.

---

## 9. `isTeamMemFile` (Q5$) — Final Membership Predicate

```javascript
// ============================================
// isTeamMemFile - Combined gate + path membership check
// Location: cli_inner_pretty.js:142580-142582
// ============================================

// ORIGINAL (for source lookup):
function Q5$(H) {
  return g5$() && bVK(H);
}

// READABLE (for understanding):
export function isTeamMemFile(absolutePath) {
  return isTeamMemoryEnabled() && isTeamMemPath(absolutePath)
}

// Mapping: Q5$→isTeamMemFile, g5$→isTeamMemoryEnabled, bVK→isTeamMemPath
```

### What it does

Single-call predicate that combines "is team memory enabled?" with "does this path live in team/?". Used by the file-tracking layer to decide whether to count a file read as a "team memory read" for telemetry.

### Why both checks

A file *under* `team/` is not a team-memory file unless team-mem itself is enabled — the directory may exist from a previous session, but writes/reads against it are not in scope for the team-mem telemetry. Returning `false` early when team-mem is off prevents an `isTeamMemPath`-only check from emitting telemetry for an off feature.

### Key insight

The classification of "team file" is **two-dimensional**: feature-active AND path-member. Both must hold. Telemetry that fires on either alone would mislead the metrics.

---

## 10. Cross-Validation: v2.1.88 → v2.1.142

| Invariant | v2.1.88 src | v2.1.112 obfuscated | v2.1.142 obfuscated | Verified |
|-----------|-------------|---------------------|---------------------|----------|
| `PathTraversalError` class | teamMemPaths.ts | `TD` chunks.83.mjs | `uT` cli_inner_pretty.js:142583-142595 | Yes |
| `sanitizePathKey` 5 layered checks | teamMemPaths.ts | `$qz` chunks.83.mjs | `zS1` cli_inner_pretty.js:142495-142510 | Yes |
| `getTeamMemPath` trailing-sep + NFC | teamMemPaths.ts | `vp` chunks.83.mjs | `Dl` cli_inner_pretty.js:142515-142517 | Yes |
| `isTeamMemoryEnabled` two-tier gate | teamMemPaths.ts | `Ye6` chunks.83.mjs | `g5$` cli_inner_pretty.js:142511-142514 | Yes |
| `realpathDeepestExisting` algorithm | teamMemPaths.ts | `JW4` chunks.83.mjs | `RVK` cli_inner_pretty.js:142522-142543 | Yes |
| `isRealPathWithinTeamDir` post-realpath check | teamMemPaths.ts | `XW4` chunks.83.mjs | `CVK` cli_inner_pretty.js:142544-142555 | Yes |
| `isTeamMemPath` synchronous prefix | teamMemPaths.ts | `MW4` chunks.83.mjs | `bVK` cli_inner_pretty.js:142556-142560 | Yes |
| `validateTeamMemWritePath` 3-layer write validator | teamMemPaths.ts | `jqz` chunks.83.mjs | `YS1` cli_inner_pretty.js:142561-142569 | Yes |
| `validateTeamMemKey` sanitize + validate | teamMemPaths.ts | `JR8` chunks.83.mjs | `ri$` cli_inner_pretty.js:142570-142579 | Yes |
| `isTeamMemFile` gate + path | teamMemPaths.ts | `Ae6` chunks.83.mjs | `Q5$` cli_inner_pretty.js:142580-142582 | Yes |

The team-paths module is **bit-equivalent** between v2.1.112 and v2.1.142 at the algorithm level — every check is preserved, every error message is identical, every path-handling primitive (NFC, NFKC, separator normalization) is the same. Only the obfuscated symbol names changed.

This is consistent with the larger pattern in this unit: v2.1.142 changed **prompts and dispatch**, not **on-disk semantics**. The path layer (where the security boundary lives) is held stable.
