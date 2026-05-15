# Team Memory Paths — Deep Deobfuscation (v2.1.112)

## Overview

Deep walk-through of `src/memdir/teamMemPaths.ts` (292 lines) — the path-construction and traversal-defense layer for team memory.

**v2.1.88 source**: `/lyz/codespace/3rd/claude-code/src/memdir/teamMemPaths.ts`
**v2.1.112 chunk**: `chunks.83.mjs:2003-2110` (all functions live in a single contiguous block — they share the module-private `PathTraversalError` class).

**Key insight**: Every function in this file is in service of one invariant: **a write to "team memory" must land inside the canonical `getTeamMemPath()` directory, even after symlink resolution**. The PSR-M22186 and PSR-M22187 vectors (URL-encoded traversal + unicode-normalized traversal + symlink escape) drive the design.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) — full index for v2.1.112
> - [symbol_additions_unit_05.md](../00_overview/symbol_additions_unit_05.md) — this unit's additions

Key functions in this document:
- `PathTraversalError` (`TD`) — `chunks.83.mjs:2098, 2105-2110`
- `sanitizePathKey` (`$qz`) — `chunks.83.mjs:2005`
- `isTeamMemoryEnabled` (`Ye6`) — `chunks.83.mjs:2021`
- `getTeamMemPath` (`vp`) — `chunks.83.mjs:2026`
- `isTeamMemSyncActive` (`HR8`) — `chunks.83.mjs:2030`
- `realpathDeepestExisting` (`JW4`) — `chunks.83.mjs:2035`
- `isRealPathWithinTeamDir` (`XW4`) — `chunks.83.mjs:2054`
- `isTeamMemPath` (`MW4`) — `chunks.83.mjs:2067`
- `validateTeamMemWritePath` (`jqz`) — `chunks.83.mjs:2073`
- `validateTeamMemKey` (`JR8`) — `chunks.83.mjs:2083`
- `isTeamMemFile` (`Ae6`) — `chunks.83.mjs:2094`

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

PSR M22187 (vector 4) calls out unicode normalization: ASCII `..` is the obvious traversal, but glyphs like fullwidth `．．／` (U+FF0E U+FF0F) normalize under NFKC to ASCII `../`. Downstream code or the filesystem itself may apply that normalization.

---

## 2. The Error Type

```javascript
// ============================================
// PathTraversalError - Distinguished error for all path-traversal rejections
// Location: chunks.83.mjs:2098, 2105-2110
// ============================================

// ORIGINAL (for source lookup):
TD = class TD extends Error {
    constructor(q) {
        super(q);
        this.name = "PathTraversalError"
    }
}

// READABLE (for understanding):
export class PathTraversalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PathTraversalError'
  }
}

// Mapping: TD→PathTraversalError
```

**Why a distinct class**: Upstream callers (the extract subagent batch processor, the sync watcher) catch `PathTraversalError` specifically to skip the offending entry instead of aborting the entire batch. A generic `Error` would force the caller to do brittle message matching.

---

## 3. Sanitizing Relative Keys

`sanitizePathKey` runs only on **untrusted relative path keys** (the server-pushed sync case). It is intentionally separate from the absolute-path path used by the agent's Write tool, because the threat surface is different — a relative key has multiple legal forms (`foo/bar.md`, `team/foo.md`), each of which must survive scrutiny.

```javascript
// ============================================
// sanitizePathKey - Reject 5 classes of malicious relative-key strings
// Location: chunks.83.mjs:2005-2019
// ============================================

// ORIGINAL (for source lookup):
function $qz(q) {
    if (q.includes("\x00")) throw new TD(`Null byte in path key: "${q}"`);
    let K;
    try { K = decodeURIComponent(q) } catch { K = q }
    if (K !== q && (K.includes("..") || K.includes("/"))) throw new TD(`URL-encoded traversal in path key: "${q}"`);
    let _ = q.normalize("NFKC");
    if (_ !== q && (_.includes("..") || _.includes("/") || _.includes("\\") || _.includes("\x00"))) throw new TD(`Unicode-normalized traversal in path key: "${q}"`);
    if (q.includes("\\")) throw new TD(`Backslash in path key: "${q}"`);
    if (q.startsWith("/")) throw new TD(`Absolute path key: "${q}"`);
    return q
}

// READABLE (for understanding):
function sanitizePathKey(key: string): string {
  // (1) Null byte — truncates paths in C-based syscalls
  if (key.includes('\0')) {
    throw new PathTraversalError(`Null byte in path key: "${key}"`)
  }
  // (2) URL-encoded traversal (e.g. %2e%2e%2f)
  let decoded: string
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

// Mapping: $qz→sanitizePathKey, q→key, K→decoded, _→normalized, TD→PathTraversalError
```

**What it does**: Rejects relative path keys that contain any of five malicious forms before they touch `path.join` / `path.resolve`.

**How it works** — five layered checks:

1. **Null byte** — Direct null injection. `fs.writeFile("team/foo\x00bar")` may, on glibc, truncate at the null and write to `team/foo`. Reject before that's possible.
2. **URL-encoded traversal** — A defensive layer for any caller that might `decodeURIComponent` the key downstream. The check is conditional on `decoded !== key` to avoid false positives on legitimate keys that happen to contain `..` *inside a filename* (e.g. `version-1..2.md`). Only paths whose meaning *changed* after decoding count as suspicious.
3. **NFKC normalization** — Same conditional pattern. The Unicode form `．．／` (fullwidth dots and slash) survives `path.resolve` because Node treats them as literal bytes, but a filesystem with case-insensitive Unicode-aware lookup, or a downstream Linux glibc with `LANG` that normalizes, will resolve them. Reject any key where normalization changes the meaning to include `..`, `/`, `\`, or `\0`.
4. **Backslash** — Windows uses `\` as a separator. On a Linux server pushing a key like `team\..\etc\passwd`, `path.join("memdir", "team\\..\\etc\\passwd")` would not split at the backslashes — but the *Windows client* would. Reject for cross-platform safety.
5. **Absolute path** — A relative-key API must not accept absolute paths. `path.join(teamDir, "/etc/passwd")` returns `/etc/passwd` because `path.join` is broken-by-design for this case.

**Why this approach** (vs. just calling `path.resolve` and checking the prefix):

- `path.resolve` is **lexical** and does not undo URL encoding or NFKC normalization. It would happily accept `%2e%2e%2f` as a literal filename, then the filesystem might resolve the encoded characters at a later layer.
- Defense-in-depth: the validators below (`validateTeamMemKey`) also do prefix checks and realpath checks, but rejecting malformed inputs at sanitization time produces a clearer error message and shorter audit trail.
- The conditional pattern (`if normalized !== key`) is the clever bit — it ensures the sanitizer is **not** rejecting valid filenames just because they share a substring with the attack form.

**Key insight**: Each individual check is necessary because no single check covers the others. URL-encoded `..` survives Unicode-normalization-only checks. NFKC `．．／` survives URL-decode-only checks. The cost is five string passes per key; the team-sync watcher amortizes that over a network fetch, so the cost is negligible.

---

## 4. Path Computation

### 4.1 `getTeamMemPath`

```javascript
// ============================================
// getTeamMemPath - Compute the team memory directory absolute path
// Location: chunks.83.mjs:2026-2028
// ============================================

// ORIGINAL (for source lookup):
function vp() {
    return (yg1(Nw(), "team") + jR8).normalize("NFC")
}

// READABLE (for understanding):
export function getTeamMemPath(): string {
  return (join(getAutoMemPath(), 'team') + sep).normalize('NFC')
}

// Mapping: vp→getTeamMemPath, yg1→path.join, Nw→getAutoMemPath, jR8→path.sep
```

**Three observations** on the return value:

1. **Trailing separator** is appended explicitly (`+ sep`). This is **required** for the prefix-attack-protection in `isTeamMemPath`: comparing `"foo/team-evil/"` against `"foo/team/"` correctly fails because the latter has a trailing separator the former cannot match. Without the trailing separator, `"foo/team-evil/".startsWith("foo/team")` is `true` — a bug.
2. **`.normalize('NFC')`** is applied at the end. Compare with `sanitizePathKey`'s use of `NFKC` (compatibility) — here we use `NFC` (canonical) because the directory path is *our own* canonical form, not user input being scrutinized. Same Unicode normalization to ensure byte-identity across calls.
3. **`getAutoMemPath()` is memoized** — see `src/memdir/paths.ts:223-235`. The memo key is `getProjectRoot()`, so every call to `getTeamMemPath()` for a given project returns the same string. This is exploited later by `isTeamMemPath` (a fast prefix check against a stable string).

### 4.2 `getTeamMemEntrypoint`

```javascript
// ============================================
// getTeamMemEntrypoint - The team MEMORY.md file path
// Source: src/memdir/teamMemPaths.ts:92-94
// (No standalone top-level emission found in the searched v2.1.112 chunks —
//  the equivalent path string is constructed inline by the buildCombinedMemoryPrompt
//  template at chunks.191.mjs:3107 via `join(autoDir, 'team', 'MEMORY.md')`.)
// ============================================

// ORIGINAL (referenced in v2.1.88 source, inlined in compiled output):
// — no standalone obfuscated function found —

// READABLE (for understanding):
export function getTeamMemEntrypoint(): string {
  return join(getAutoMemPath(), 'team', 'MEMORY.md')
}

// Mapping: source-only function; the path itself is constructed inline
//          where needed (e.g. teamMemPrompts.ts builds it for the prompt).
```

**Why this isn't `join(getTeamMemPath(), 'MEMORY.md')`**: `getTeamMemPath()` returns a string with a trailing separator. `path.join` collapses duplicate separators but the form `join(getAutoMemPath(), 'team', 'MEMORY.md')` is one less function call and one less string. Micro-optimization, but consistent.

### 4.3 `isTeamMemSyncActive` (`HR8`)

```javascript
// ============================================
// isTeamMemSyncActive - Is team sync enabled AND populated?
// Location: chunks.83.mjs:2030-2033
// ============================================

// ORIGINAL (for source lookup):
function HR8() {
    if (!Ye6()) return !1;
    return X81() === "has-content"
}

// READABLE (for understanding):
function isTeamMemSyncActive(): boolean {
  if (!isTeamMemoryEnabled()) return false
  return getTeamMemSyncState() === 'has-content'
}

// Mapping: HR8→isTeamMemSyncActive, Ye6→isTeamMemoryEnabled, X81→getTeamMemSyncState
```

**What it does**: Distinguishes "team memory is enabled in principle" from "team memory has actual files to read." Used by callers that should be no-ops on a fresh clone before the watcher has pulled anything.

**Why split from `isTeamMemoryEnabled`**: The prompt builder *always* runs when team memory is enabled — even on an empty `team/` dir — because the agent needs to know it *may* write to that location. But the recall pipeline (relevant memories) skips if nothing has been synced yet, since searching an empty directory is wasted work.

---

## 5. The Symlink-Escape Defense

This is the core security mechanism. Two helpers (`realpathDeepestExisting` and `isRealPathWithinTeamDir`) feed two public validators (`validateTeamMemWritePath` and `validateTeamMemKey`).

### 5.1 `realpathDeepestExisting` — Walk Until Realpath Succeeds

```javascript
// ============================================
// realpathDeepestExisting - Resolve symlinks on the deepest existing ancestor
// Location: chunks.83.mjs:2035-2052
// ============================================

// ORIGINAL (for source lookup):
async function JW4(q) {
    let K = [], _ = q;
    for (let z = jW4(_); _ !== z; z = jW4(_)) try {
        let Y = await HW4(_);
        return K.length === 0 ? Y : yg1(Y, ...K.reverse())
    } catch (Y) {
        let A = Q1(Y);
        if (A === "ENOENT") try {
                if ((await wqz(_)).isSymbolicLink()) throw new TD(`Dangling symlink detected (target does not exist): "${_}"`)
            } catch (O) { if (O instanceof TD) throw O }
        else if (A === "ELOOP") throw new TD(`Symlink loop detected in path: "${_}"`);
        else if (A !== "ENOTDIR" && A !== "ENAMETOOLONG") throw new TD(`Cannot verify path containment (${A}): "${_}"`);
        K.push(_.slice(z.length + jR8.length)), _ = z
    }
    return q
}

// READABLE (for understanding):
async function realpathDeepestExisting(absolutePath: string): Promise<string> {
  const tail: string[] = []
  let current = absolutePath
  // Walk up until realpath succeeds.
  // Loop terminates when we reach the filesystem root (dirname('/') === '/').
  for (
    let parent = dirname(current);
    current !== parent;
    parent = dirname(current)
  ) {
    try {
      const realCurrent = await realpath(current)
      return tail.length === 0
        ? realCurrent
        : join(realCurrent, ...tail.reverse())
    } catch (e: unknown) {
      const code = getErrnoCode(e)
      if (code === 'ENOENT') {
        // Distinguish: dangling symlink (lstat succeeds) vs truly non-existent (lstat ENOENT)
        try {
          const st = await lstat(current)
          if (st.isSymbolicLink()) {
            throw new PathTraversalError(`Dangling symlink detected (target does not exist): "${current}"`)
          }
        } catch (lstatErr: unknown) {
          if (lstatErr instanceof PathTraversalError) throw lstatErr
        }
      } else if (code === 'ELOOP') {
        throw new PathTraversalError(`Symlink loop detected in path: "${current}"`)
      } else if (code !== 'ENOTDIR' && code !== 'ENAMETOOLONG') {
        // EACCES, EIO, etc. — fail closed
        throw new PathTraversalError(`Cannot verify path containment (${code}): "${current}"`)
      }
      tail.push(current.slice(parent.length + sep.length))
      current = parent
    }
  }
  return absolutePath
}

// Mapping: JW4→realpathDeepestExisting, K→tail, _→current, z→parent,
//          HW4→realpath, wqz→lstat, Q1→getErrnoCode, jW4→dirname
```

**What it does**: Walks up from the target path until `realpath()` succeeds on an existing ancestor, then rejoins the non-existing tail. Returns a path where every existing segment is fully symlink-resolved.

**How it works** step-by-step:

1. Start at the requested absolute path. The target file may not exist yet (we're about to write it), so `realpath(target)` will fail.
2. Try `realpath(current)`. If it succeeds, we found an existing ancestor — return `realpath_result + tail`.
3. If it fails with `ENOENT`, this segment of the path doesn't exist on disk. **But**: it could be a dangling symlink (a symbolic link whose target doesn't exist). A dangling symlink is dangerous: `fs.writeFile` would *follow* the link and create the target outside `team/`.
   - Use `lstat` (which does *not* follow links) to check. If the entry exists and is a symlink, **throw** — we cannot safely continue.
   - If `lstat` itself returns ENOENT, the path is truly non-existent. Pop the last segment onto `tail` and walk up.
4. If `realpath` fails with `ELOOP`, the filesystem has a symlink cycle — corrupted or malicious. Throw.
5. If `realpath` fails with `ENOTDIR` (a non-directory sits in the middle, e.g. `/foo/bar/baz` where `bar` is a regular file), this is a normal "this path can't exist yet" case. Walk up.
6. If `realpath` fails with `ENAMETOOLONG`, treat like `ENOTDIR` — also a "can't exist yet" failure.
7. For any other errno (EACCES, EIO), we cannot prove containment. **Fail closed**: wrap in `PathTraversalError` so the caller can skip this single entry rather than abort the batch.
8. Loop terminates when `dirname(current) === current` (filesystem root).

**Why this design**:

- **`path.resolve` alone is insufficient**. Per PSR M22186, `resolve("team/symlink-to-ssh-keys/authorized_keys")` returns a path that *looks* inside `team/`, but the filesystem will follow `symlink-to-ssh-keys` out of the directory.
- **`realpath` requires the path to exist**. Since the validator runs *before* the write, the target file is absent. We solve this by walking up to find the deepest *existing* ancestor.
- **The `lstat` fallback for ENOENT** catches the subtle case of a dangling symlink **inside** an otherwise-existing path. Without this check, `team/dangling-link/foo.md` would pass: `realpath(.../foo.md)` returns ENOENT, we'd assume "doesn't exist yet," but the parent symlink would resolve at write time.
- **`ELOOP` is always fatal** because it indicates a state that should not exist on a benign filesystem.
- **Specific errno allowlist** (`ENOTDIR` and `ENAMETOOLONG` pass through; everything else fails closed). This is deliberate fail-secure design: if we cannot reason about an error code, we reject.

**Key insight**: The function is *not* asking "is this path inside `team/`?" — it is *transforming* the input path into a form that the caller can check with confidence. The actual containment check happens in `isRealPathWithinTeamDir`.

### 5.2 `isRealPathWithinTeamDir`

```javascript
// ============================================
// isRealPathWithinTeamDir - Final containment check, post-realpath
// Location: chunks.83.mjs:2054-2065
// ============================================

// ORIGINAL (for source lookup):
async function XW4(q) {
    let K;
    try { K = await HW4(vp().replace(/[/\\]+$/, "")) }
    catch (_) {
        let z = Q1(_);
        if (z === "ENOENT" || z === "ENOTDIR") return !0;
        return !1
    }
    if (q === K) return !0;
    return q.startsWith(K + jR8)
}

// READABLE (for understanding):
async function isRealPathWithinTeamDir(realCandidate: string): Promise<boolean> {
  let realTeamDir: string
  try {
    // getTeamMemPath() includes a trailing separator; strip it because
    // realpath() rejects trailing separators on some platforms.
    realTeamDir = await realpath(getTeamMemPath().replace(/[/\\]+$/, ''))
  } catch (e: unknown) {
    const code = getErrnoCode(e)
    if (code === 'ENOENT' || code === 'ENOTDIR') {
      // Team dir doesn't exist — no symlink to escape via, skip check.
      return true
    }
    return false  // EACCES, EIO, etc. — fail closed
  }
  if (realCandidate === realTeamDir) return true
  // Prefix-attack protection: require separator after the prefix.
  return realCandidate.startsWith(realTeamDir + sep)
}

// Mapping: XW4→isRealPathWithinTeamDir, q→realCandidate, K→realTeamDir
```

**What it does**: Checks whether a (symlink-resolved) candidate path is the team dir or a descendant of it.

**Three subtle moves**:

1. **Strip the trailing separator** before calling `realpath`. macOS and some Linux setups will return `EINVAL` on `realpath("/foo/team/")`. Calling on `/foo/team` is portable.
2. **ENOENT/ENOTDIR is safe** — if the team dir does not exist, then by induction no symlink *inside* it can exist, so the first-pass string-level prefix check already done by `validateTeamMemWritePath` is sufficient. Returning `true` here means "no symlink check needed."
3. **`realCandidate === realTeamDir`** is a special case: a write *to* `team/MEMORY.md` resolves to the team dir itself (since `MEMORY.md` is just a file, not a subdir entry to follow). Without this branch, the prefix check `team/MEMORY.md.startsWith("team/")` would still pass — but only by accident of the trailing separator. The explicit equality check is the principled way.
4. **`startsWith(realTeamDir + sep)`** guards against the `team-evil/` adjacency attack — see commentary on `getTeamMemPath`.

### 5.3 `isTeamMemPath` — The Fast Lexical Check

```javascript
// ============================================
// isTeamMemPath - Fast lexical containment, used in render paths
// Location: chunks.83.mjs:2067-2071
// ============================================

// ORIGINAL (for source lookup):
function MW4(q) {
    let K = Lg1(q), _ = vp();
    return K + jR8 === _ || K.startsWith(_)
}

// READABLE (for understanding):
export function isTeamMemPath(filePath: string): boolean {
  // SECURITY: resolve() converts to absolute and eliminates .. segments,
  // preventing path traversal attacks (e.g. "team/../../etc/passwd")
  const resolvedPath = resolve(filePath)
  const teamDir = getTeamMemPath()
  return resolvedPath.startsWith(teamDir)
}

// Mapping: MW4→isTeamMemPath, Lg1→path.resolve, vp→getTeamMemPath
```

**Note the v2.1.112 obfuscated form has `K + jR8 === _ || K.startsWith(_)`** while the v2.1.88 readable source has just `resolvedPath.startsWith(teamDir)`. The compiled form adds a second branch: `resolved + sep === teamDir`. This catches the case where `filePath` is the team dir without its trailing separator — passing `getTeamMemPath().slice(0, -1)` would otherwise fail the prefix check. (Compiler-emitted optimization; semantically equivalent for legitimate callers.)

**Why no realpath here**: `isTeamMemPath` is called from render paths (`PW4` at chunks.83.mjs:2113 → CLAUDE.md filter, plus the permissions write carve-out) that run synchronously on every tool result render. An async `realpath` per render is too expensive. The render path can tolerate a small symlink-escape blind spot because the actual *write* goes through `validateTeamMemWritePath`, which does include the realpath check.

**Trade-off**: Lexical check is fast but vulnerable to symlink escape. Full check is slow but tight. The split delegates each to where it makes sense.

---

## 6. The Public Validators

### 6.1 `validateTeamMemWritePath` — For Absolute Paths from the Agent

```javascript
// ============================================
// validateTeamMemWritePath - Validate absolute write target
// Location: chunks.83.mjs:2073-2081
// ============================================

// ORIGINAL (for source lookup):
async function jqz(q) {
    if (q.includes("\x00")) throw new TD(`Null byte in path: "${q}"`);
    let K = Lg1(q), _ = vp();
    if (!K.startsWith(_)) throw new TD(`Path escapes team memory directory: "${q}"`);
    let z = await JW4(K);
    if (!await XW4(z)) throw new TD(`Path escapes team memory directory via symlink: "${q}"`);
    return K
}

// READABLE (for understanding):
export async function validateTeamMemWritePath(filePath: string): Promise<string> {
  if (filePath.includes('\0')) {
    throw new PathTraversalError(`Null byte in path: "${filePath}"`)
  }
  // First pass: lexical containment
  const resolvedPath = resolve(filePath)
  const teamDir = getTeamMemPath()
  if (!resolvedPath.startsWith(teamDir)) {
    throw new PathTraversalError(`Path escapes team memory directory: "${filePath}"`)
  }
  // Second pass: symlink-aware containment
  const realPath = await realpathDeepestExisting(resolvedPath)
  if (!(await isRealPathWithinTeamDir(realPath))) {
    throw new PathTraversalError(`Path escapes team memory directory via symlink: "${filePath}"`)
  }
  return resolvedPath
}

// Mapping: jqz→validateTeamMemWritePath, q→filePath, K→resolvedPath, _→teamDir, z→realPath
```

**Two-pass design** — why?

1. **First pass is cheap and rejects 99% of bad inputs** synchronously. Most attacks are obvious lexical traversal (`team/../../etc/...`) that `path.resolve` flattens and we then reject with a single string-prefix check.
2. **Second pass is expensive but unavoidable** for symlink escapes. Only inputs that *passed* the first pass reach `realpathDeepestExisting`, so we incur the filesystem cost only on plausible inputs.

The return value is the **resolved (non-realpathed) absolute path**. This is the path the caller will `fs.writeFile` to. Returning the realpath would be wrong: if `team/notes.md` is itself a symlink to `team/notes-v2.md`, we want the write to go through the symlink (preserving the link), not to its target.

### 6.2 `validateTeamMemKey` — For Relative Keys from the Sync Server

```javascript
// ============================================
// validateTeamMemKey - Validate sync-server relative key
// Location: chunks.83.mjs:2083-2092
// ============================================

// ORIGINAL (for source lookup):
async function JR8(q) {
    $qz(q);
    let K = vp(), _ = yg1(K, q), z = Lg1(_);
    if (!z.startsWith(K)) throw new TD(`Key escapes team memory directory: "${q}"`);
    let Y = await JW4(z);
    if (!await XW4(Y)) throw new TD(`Key escapes team memory directory via symlink: "${q}"`);
    return z
}

// READABLE (for understanding):
export async function validateTeamMemKey(relativeKey: string): Promise<string> {
  sanitizePathKey(relativeKey)
  const teamDir = getTeamMemPath()
  const fullPath = join(teamDir, relativeKey)
  const resolvedPath = resolve(fullPath)
  if (!resolvedPath.startsWith(teamDir)) {
    throw new PathTraversalError(`Key escapes team memory directory: "${relativeKey}"`)
  }
  const realPath = await realpathDeepestExisting(resolvedPath)
  if (!(await isRealPathWithinTeamDir(realPath))) {
    throw new PathTraversalError(`Key escapes team memory directory via symlink: "${relativeKey}"`)
  }
  return resolvedPath
}

// Mapping: JR8→validateTeamMemKey, q→relativeKey, K→teamDir, _→fullPath, z→resolvedPath, Y→realPath
```

**Three differences from `validateTeamMemWritePath`**:

1. **Calls `sanitizePathKey` first**. The input is a relative key from an *untrusted* server. We need to scrub null bytes, URL-encoded traversals, NFKC attacks, backslashes, and absolute paths *before* concatenating with `teamDir`.
2. **Joins instead of resolves directly**. `join(teamDir, key)` allows `key === "foo/bar.md"` to become `team/foo/bar.md`. Then `resolve` flattens any embedded `..` segments.
3. **Returns the resolved path**, same as the write-path version. The sync watcher uses this as both the write target *and* as the cache key for sync state tracking.

**Why the second pass even after sanitization**: `sanitizePathKey` defeats the malicious-string class. But it can't see symlinks that already exist on disk. If a previous (perhaps benign) write created `team/links/` as a symlink and the server now sends key `links/notes.md`, the lexical first pass passes (string-prefix is fine), but the realpath of `team/links/notes.md` resolves *out* of `team/`. The second pass catches that.

### 6.3 `isTeamMemFile` — The Convenience Predicate

```javascript
// ============================================
// isTeamMemFile - "Is this path team memory, and is team memory on?"
// Location: chunks.83.mjs:2094-2096
// ============================================

// ORIGINAL (for source lookup):
function Ae6(q) {
    return Ye6() && MW4(q)
}

// READABLE (for understanding):
export function isTeamMemFile(filePath: string): boolean {
  return isTeamMemoryEnabled() && isTeamMemPath(filePath)
}

// Mapping: Ae6→isTeamMemFile, Ye6→isTeamMemoryEnabled, MW4→isTeamMemPath
```

**Why this exists separately from `isTeamMemPath`**: A path can be *inside* `team/` (matches `isTeamMemPath`) even if the user has team memory disabled — for instance, a leftover file from a previous session where the flag was on. Callers like the permission system care about whether team-memory **semantics** apply (carve-out, watcher, etc.); the path-prefix alone is not enough.

The **ordering matters**: `isTeamMemoryEnabled()` is cheap (env+settings+memoized flag); `isTeamMemPath` calls `path.resolve` which allocates. Putting the feature gate first short-circuits the resolve when team memory is off.

---

## 7. Repo Detection / Multi-User Path Resolution

The `getAutoMemPath` function (`Nw` at chunks.83.mjs, defined in `src/memdir/paths.ts:223-235`) underlies every team-memory path. It computes:

```
<memoryBase>/projects/<sanitized-canonical-git-root>/memory/
```

where `<sanitized-canonical-git-root>` comes from `sanitizePath(findCanonicalGitRoot(cwd) ?? getProjectRoot())`.

**Why canonical git root and not just cwd**: `findCanonicalGitRoot` walks up from cwd until it finds a `.git` directory, then resolves through any `.git/worktrees/` indirection. This means **all worktrees of the same repo share one auto-memory directory** (anthropics/claude-code#24382). Without canonicalization, two teammates checking out different branches of the same repo would write to *different* per-cwd memory directories — and team memory would silently fail to sync.

**Multi-user handling**: Each user has their own `~/.claude/projects/<repo-key>/memory/` (private) and `~/.claude/projects/<repo-key>/memory/team/` (shared). The "shared" part is *only* the team subdirectory's content — which is synced via `services/teamMemorySync/` from a server-side store. The local filesystem layout is per-user; the synchronization mechanism is what makes it shared.

**CCR (Claude Code Remote) override**: If `CLAUDE_CODE_REMOTE_MEMORY_DIR` is set, `getMemoryBaseDir()` returns that instead of `~/.claude`. This lets containerized/remote setups put memory on a persistent mount. Team memory follows the same override — `getTeamMemPath()` just appends `/team/` regardless of the base.

**Cowork override**: `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` is a *full-path* override (it replaces everything, not just the base). This lets Cowork redirect memory to a space-scoped mount that does not include the per-session cwd in its key. Team memory inherits this seamlessly.

---

## 8. Summary

`teamMemPaths.ts` provides **four public functions** (`isTeamMemoryEnabled`, `getTeamMemPath`, `getTeamMemEntrypoint`, `isTeamMemPath`, `validateTeamMemWritePath`, `validateTeamMemKey`, `isTeamMemFile`) and **one error class** (`PathTraversalError`).

The design is structured around three layers:

1. **Path computation** (`getTeamMemPath`, `getTeamMemEntrypoint`) — uses `getAutoMemPath` + `"team"` to produce stable, NFC-normalized absolute paths.
2. **Lexical containment** (`isTeamMemPath`) — fast, synchronous, used in render paths where async cost is unacceptable.
3. **Symlink-aware containment** (`validateTeamMemWritePath`, `validateTeamMemKey`) — slow, asynchronous, used in write paths where correctness matters more than throughput.

The two distinct entry points (`validateTeamMemWritePath` for absolute paths from the agent, `validateTeamMemKey` for relative keys from the server) reflect the two trust boundaries the team memory subsystem crosses: agent-as-untrusted-input and server-as-untrusted-input. Each gets the appropriate combination of sanitization and validation.

**Most subtle detail**: `realpathDeepestExisting`'s handling of `ENOENT` versus a dangling symlink. A naive implementation would treat any ENOENT as "path doesn't exist, walk up" — leaving a write-through-symlink vulnerability open. The two-step probe (try `realpath`, fall back to `lstat`) is the unique element that closes PSR M22186 completely.
