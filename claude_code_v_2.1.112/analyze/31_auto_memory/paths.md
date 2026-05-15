# paths.ts — Memory Path Resolution and Enablement — v2.1.112

Deep deobfuscation of `src/memdir/paths.ts` (278 lines in v2.1.88). This file owns the **resolution chain** that decides where memory lives on disk and the **enablement chain** that decides whether memory is on at all. It also exports a path-membership predicate (`isAutoMemPath`) consumed by the filesystem permission carve-outs.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory)
> - [symbol_additions_unit_03.md](../00_overview/symbol_additions_unit_03.md) - New symbols from this unit

Key functions in this document:
- `isAutoMemoryEnabled` (`x3`) - 5-step enablement priority chain (chunks.64.mjs:1301)
- `isExtractModeActive` (`Lk8`) - Whether the extract-memories background agent runs this session (chunks.64.mjs:1313)
- `getMemoryBaseDir` (`X46`) - Base directory before project segmentation (chunks.64.mjs:1318)
- `getAutoMemEntrypointDirname` (`RE_`) - Returns `"memory"` or `"tiny_memory"` (chunks.64.mjs:1323)
- `isTinyMemoryEnabled` (`wH`) - Single-fact-per-file mode flag (chunks.64.mjs:1327)
- `validateMemoryPath` (`Vq4`) - Override-path security validator (chunks.64.mjs:1331)
- `getAutoMemPathOverride` (`kq4`) - Env-var override resolver (chunks.64.mjs:1345)
- `getAutoMemPathSetting` (`CE_`) - settings.json override resolver (chunks.64.mjs:1349)
- `hasAutoMemPathOverride` (`hk8`) - Override predicate (chunks.64.mjs:1354)
- `getAutoMemBase` (`bE_`) - Project root → canonical git root (chunks.64.mjs:1358)
- `getAutoMemEntrypoint` (`Rk8`) - Path to `MEMORY.md` inside auto-mem dir (chunks.64.mjs:1362)
- `isAutoMemPath` (`YR`) - Path-membership predicate (chunks.64.mjs:1366)
- `getAutoMemPath` (`Nw`) - Memoized full resolver (chunks.64.mjs:1386)

Key constants in this document:
- `AUTO_MEM_DIRNAME` (`LE_`) - String `"memory"` (chunks.64.mjs:1370)
- `TINY_MEM_DIRNAME` (`hE_`) - String `"tiny_memory"` (chunks.64.mjs:1372)
- `AUTO_MEM_ENTRYPOINT_NAME` (`SE_`) - String `"MEMORY.md"` (chunks.64.mjs:1374) — distinct from `YW` in chunks.153
- Trailing-separator constant (`Tq4`) - `path.sep` (`/` on POSIX, `\` on Windows)

## `isAutoMemoryEnabled` (x3) — The 5-Step Priority Chain

### What it does

Returns `true` / `false` to decide whether the entire memory subsystem (memdir, agent memory, past-session search, extractMemories, `/remember`, `/dream`, team sync) is active for this session.

### How it works

First-defined-wins priority chain:

1. **`CLAUDE_CODE_DISABLE_AUTO_MEMORY` truthy → OFF**: `isEnvTruthy(envVal)` → return `false`.
2. **`CLAUDE_CODE_DISABLE_AUTO_MEMORY` defined-falsy → ON**: `isEnvDefinedFalsy(envVal)` (set to `0` / `false` explicitly) → return `true`. Distinct from "undefined" — the env var is **on the variable's value layer** of the priority, not "unset = skip me."
3. **`CLAUDE_CODE_SIMPLE` truthy → OFF**: The `--bare` switch. The system prompt builder already drops the memory section under SIMPLE; this gate also stops the other half of the subsystem (extractMemories turn-end fork, autoDream, `/remember`, `/dream`, team sync).
4. **CCR remote without persistent storage → OFF**: `CLAUDE_CODE_REMOTE` is truthy AND `CLAUDE_CODE_REMOTE_MEMORY_DIR` is unset. The Claude Cloud Runner uses ephemeral storage by default; without an explicit memory-dir, persistence makes no sense.
5. **`settings.autoMemoryEnabled` is defined → use it**: Reads `getInitialSettings().autoMemoryEnabled`. If `false`, returns `false`; if `true`, returns `true`. This is the **project-level opt-out** point — admins can disable for a project regardless of user defaults.
6. **Default → ON**: If nothing above tripped, return `true`.

### Why this approach

- **Env vars take precedence over settings**: Operators who set an env var have explicitly chosen; they shouldn't be overridden by a checked-in setting.
- **`CLAUDE_CODE_SIMPLE` is a hard kill-switch**: Even with positive settings, `--bare` means no memory. SIMPLE is a contract about deterministic minimal behavior.
- **CCR special-case before settings**: If you're in CCR without a memory dir, no setting can make memory work — there's no persistent store. Better to skip than to attempt and silently lose writes.
- **`settings.autoMemoryEnabled !== undefined` check**: A `true`/`false` value is a deliberate choice; `undefined` (the absence of the field) means "I haven't said." Both `true` and `false` are honored; only `undefined` falls through to the default.

### Key insight

The chain is "first-defined-wins" rather than "highest-priority OR." That distinction matters: a user can **explicitly enable** memory via `CLAUDE_CODE_DISABLE_AUTO_MEMORY=0` even if their `settings.json` has `autoMemoryEnabled: false`. The env var wins not because it's "stronger" but because it's **earlier in the chain** and has a defined value.

```javascript
// ============================================
// isAutoMemoryEnabled - 5-step first-defined-wins priority chain
// Location: chunks.64.mjs:1301-1311 (v2.1.88: paths.ts:30-55)
// ============================================

// ORIGINAL (for source lookup):
function x3() {
    if (Qg()) return !1;
    let q = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (S6(q)) return !1;
    if (c5(q)) return !0;
    if (S6(process.env.CLAUDE_CODE_SIMPLE)) return !1;
    if (S6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let K = v7();
    if (K.autoMemoryEnabled !== void 0) return K.autoMemoryEnabled;
    return !0
}

// READABLE (for understanding):
export function isAutoMemoryEnabled(): boolean {
  const envVal = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY
  if (isEnvTruthy(envVal)) return false                  // 1. Env var disable
  if (isEnvDefinedFalsy(envVal)) return true             // 2. Env var explicit enable
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) return false  // 3. --bare mode
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE)
      && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return false // 4. CCR without storage
  const settings = getInitialSettings()
  if (settings.autoMemoryEnabled !== undefined)
    return settings.autoMemoryEnabled                    // 5. settings.json
  return true                                            // 6. Default ON
}

// Mapping: x3→isAutoMemoryEnabled, q→envVal, K→settings, S6→isEnvTruthy,
//          c5→isEnvDefinedFalsy, v7→getInitialSettings, Qg→(unrelated short-circuit
//          shown in v2.1.112 only; not in v2.1.88 source)
```

Note: v2.1.112 adds a leading `Qg()` short-circuit (returns `false`) that doesn't appear in v2.1.88 — likely a CCR or sandbox top-level gate. The 5-step body below it is identical.

## `getAutoMemPath` (Nw) — The Resolution Chain

### What it does

Returns the **absolute path** of the auto-memory directory, with one trailing path separator. This is the single source of truth for "where do memories live?" Memoized so render-path callers (like `isAutoManagedMemoryFile` checks fired per tool-use re-render) don't repay the cost of reading settings four times per call.

### How it works

The function resolves in **three** priority levels, then falls back to a computed path:

1. **Env-var override** (`getAutoMemPathOverride` → `kq4`): Reads `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`. If set, `validateMemoryPath` (without tilde expansion) returns either a normalized path or `undefined`. Used by Cowork to point memory at a space-scoped mount rather than the per-session cwd.
2. **Settings.json override** (`getAutoMemPathSetting` → `CE_`): Reads `autoMemoryDirectory` from settings (`policySettings` → `flagSettings` → `localSettings` → `userSettings` first defined wins; `projectSettings` deliberately excluded for security). `validateMemoryPath` runs with tilde expansion enabled (`~/foo` → `$HOME/foo`).
3. **Computed default**: If neither override is set, build `<base>/projects/<sanitized-git-root>/memory/` where:
   - `<base>` = `getMemoryBaseDir()` — `CLAUDE_CODE_REMOTE_MEMORY_DIR` env var if set, otherwise `getClaudeConfigHomeDir()` (typically `~/.claude`).
   - `<sanitized-git-root>` = `sanitizePath(findCanonicalGitRoot(projectRoot) ?? projectRoot)` — uses the canonical git root so all worktrees of the same repo share one auto-memory directory (issue #24382).
   - Trailing separator + `.normalize('NFC')` for cross-platform path equality.

The whole thing is wrapped in `memoize(…, () => getProjectRoot())`, keyed by `projectRoot`. The cache key is intentionally narrow:
- **Same project root** → cache hit, no `getSettingsForSource × 4` cost.
- **Different project root** (tests, sub-shells with different cwd) → cache miss, recompute.

### Why this approach

- **Why env-var beats settings.json**: The env var is set programmatically by Cowork/SDK at process start. Settings.json is editable by the user. Operator > user in this hierarchy.
- **Why `projectSettings` is excluded from the settings override**: `.claude/settings.json` is **checked into the repo**. A malicious repo could set `autoMemoryDirectory: "~/.ssh"` and gain silent write access to sensitive paths via the filesystem write carve-out (which fires when `isAutoMemPath()` matches). Excluding project-source settings closes this attack vector.
- **Why canonical git root**: Multiple worktrees of the same repo share one memory directory. Without canonicalization, `~/repo/main/` and `~/repo/worktree-A/` would get separate memory directories — annoying for users who treat worktrees as transient checkouts.
- **Memoization keyed on `projectRoot`**: Settings, env vars, and `CLAUDE_CONFIG_DIR` are session-stable in production. Project root **can** change in test setups that mock `getProjectRoot` mid-block; keying on it means the cache invalidates correctly there.
- **NFC normalization**: Same-bytes Unicode strings can have different on-disk representations (NFC vs NFD on macOS). Normalizing to NFC means `isAutoMemPath(filePath)` startsWith comparisons work after any path went through `sanitizePath`.

### Key insight

`getAutoMemPath` is the **gateway**: every later call (read entrypoint, ensure dir, write file, check path-membership for permission carve-out) flows through it. Memoizing it keys the rest of the system to a single resolution decision per project root, even when called dozens of times per Messages re-render.

```javascript
// ============================================
// getAutoMemPath - Memoized resolver: override → settings → computed default
// Location: chunks.64.mjs:1386-1391 (v2.1.88: paths.ts:223-235)
// ============================================

// ORIGINAL (for source lookup):
Nw = P1(() => {
    let q = kq4() ?? CE_();
    if (q) return q;
    let K = yk8(X46(), "projects");
    return (yk8(K, AP(bE_()), RE_()) + Tq4).normalize("NFC")
}, () => `${c9()}|${wH()}`)

// READABLE (for understanding):
export const getAutoMemPath = memoize(
  (): string => {
    const override = getAutoMemPathOverride() ?? getAutoMemPathSetting()
    if (override) return override
    const projectsDir = join(getMemoryBaseDir(), 'projects')
    return (
      join(projectsDir, sanitizePath(getAutoMemBase()), AUTO_MEM_DIRNAME) + sep
    ).normalize('NFC')
  },
  () => getProjectRoot(),
)

// Mapping: Nw→getAutoMemPath, q→override, K→projectsDir, kq4→getAutoMemPathOverride,
//          CE_→getAutoMemPathSetting, P1→memoize, yk8→join, X46→getMemoryBaseDir,
//          AP→sanitizePath, bE_→getAutoMemBase, RE_→AUTO_MEM_DIRNAME ("memory" or "tiny_memory"),
//          Tq4→sep (path.sep), c9→getProjectRoot, wH→isTinyMemoryEnabled
```

Note: in v2.1.112, the cache key is `\`${c9()}|${wH()}\`` (project root + tiny-mem flag), not just `getProjectRoot()`. The tiny-memory flag becomes part of the key because flipping it changes the dirname (`memory` → `tiny_memory`) and the computed path. In v2.1.88 source, only `getProjectRoot()` is the key — this is a v2.1.112 refinement to invalidate cache when the experimental flag flips mid-session.

## `validateMemoryPath` (Vq4) — Security Filter on Override Paths

### What it does

Normalizes and validates a candidate path. Returns either the normalized path with exactly one trailing separator, or `undefined` if the path is unset, empty, or rejected.

### How it works

1. **Empty guard**: `if (!raw) return undefined`. Catches empty string, null, undefined.
2. **Optional tilde expansion** (when `expandTilde === true`): If the path starts with `~/` or `~\\`, expand to `$HOME/<rest>`. **Bare `~`, `~/`, `~/.`, `~/..`** are not expanded — they would resolve to `$HOME` or its ancestor, same danger class as `/` or `C:\`.
3. **Normalize and strip trailing seps**: `normalize(candidate).replace(/[/\\]+$/, '')`. The normalize step collapses `.` and `..` segments; the strip ensures the trailing-separator contract is single-source.
4. **Rejection rules** (any of these → return `undefined`):
   - `!isAbsolute(normalized)` — relative paths get interpreted against the wrong CWD.
   - `length < 3` — `/` becomes `""` after strip; `/a` is too short to be a real directory; this catches the trivial-remainder cases that survived tilde expansion.
   - `^[A-Za-z]:$/` test — Windows drive root (`C:`) after sep strip.
   - `startsWith('\\\\')` — UNC paths (`\\server\share`) — opaque trust boundary.
   - `startsWith('//')` — UNIX equivalent of UNC after normalize on some platforms.
   - `includes('\0')` — null byte that survives `normalize()` but can truncate in `open()` syscalls (classic null-truncation attack).
5. **Add trailing sep and NFC-normalize**: `(normalized + sep).normalize('NFC')`.

### Why this approach

- **The function is a write-allowlist root**: Downstream filesystem code uses this path as the root of "what the model can write to without permission prompts." A bad path here gives the model silent write access to wherever it points.
- **Why reject `/`**: After strip, `/` becomes `""` — anything `startsWith("")` is true, so the carve-out matches the whole filesystem.
- **Why reject `C:`**: Drive root would carve out everything on `C:`.
- **Why reject UNC**: Network paths cross trust boundaries that the local permission system doesn't understand.
- **Why reject null bytes**: A path like `/safe/dir/\0/etc/passwd` normalizes to `/safe/dir/\0/etc/passwd` (Node's `normalize` doesn't strip nulls); `open()` truncates at the null and writes to `/safe/dir/`. The check stops that before the path is trusted.
- **Bare `~` rejection**: `normalize('') === '.'`, `normalize('.') === '.'`, `normalize('foo/..') === '.'`. After tilde expansion these would map to `$HOME` literally; the rest-norm check catches that.

### Key insight

This is a **boundary validator**, not a path canonicalizer. Its job is to reject inputs that would later let the model escape its sandbox. The defenses are stacked because each one catches a class the others miss (null bytes survive normalize, UNC survives isAbsolute, drive roots survive length-check by being exactly 2 chars).

```javascript
// ============================================
// validateMemoryPath - Security validator for override paths
// Location: chunks.64.mjs:1331-1343 (v2.1.88: paths.ts:109-150)
// ============================================

// ORIGINAL (for source lookup):
function Vq4(q, K) {
    if (!q) return;
    let _ = q;
    if (K && (_.startsWith("~/") || _.startsWith("~\\"))) {
        let Y = _.slice(2), A = wb1(Y || ".");
        if (A === "." || A === "..") return;
        _ = yk8(EE_(), Y)
    }
    let z = wb1(_).replace(/[/\\]+$/, "");
    if (!yE_(z) || z.length < 3 || /^[A-Za-z]:$/.test(z)
        || z.startsWith("\\\\") || z.startsWith("//") || z.includes("\x00")) return;
    return (z + Tq4).normalize("NFC")
}

// READABLE (for understanding):
function validateMemoryPath(raw: string | undefined, expandTilde: boolean): string | undefined {
  if (!raw) return undefined
  let candidate = raw

  if (expandTilde && (candidate.startsWith('~/') || candidate.startsWith('~\\'))) {
    const rest = candidate.slice(2)
    const restNorm = normalize(rest || '.')
    if (restNorm === '.' || restNorm === '..') return undefined
    candidate = join(homedir(), rest)
  }

  const normalized = normalize(candidate).replace(/[/\\]+$/, '')
  if (
    !isAbsolute(normalized) ||
    normalized.length < 3 ||
    /^[A-Za-z]:$/.test(normalized) ||
    normalized.startsWith('\\\\') ||
    normalized.startsWith('//') ||
    normalized.includes('\0')
  ) {
    return undefined
  }
  return (normalized + sep).normalize('NFC')
}

// Mapping: Vq4→validateMemoryPath, q→raw, K→expandTilde, _→candidate, Y→rest, A→restNorm,
//          z→normalized, wb1→normalize, EE_→homedir, yk8→join, yE_→isAbsolute, Tq4→sep
```

## `isAutoMemPath` (YR) — Path Membership Predicate

### What it does

Returns `true` if an absolute path starts with the auto-memory directory. Used by the filesystem-permission carve-out (`filesystem.ts`) to decide whether a Write/Edit can bypass the dangerous-directory prompt.

### How it works

1. `normalize(absolutePath)` — collapses `..` segments to prevent traversal bypasses (`/safe/../etc/passwd` → `/etc/passwd`).
2. `normalizedPath.startsWith(getAutoMemPath())` — direct string prefix match. Works because `getAutoMemPath()` always returns a path with one trailing sep, so `/foo/memory/x` matches the prefix `/foo/memory/`.

### Why normalize first

The naive `absolutePath.startsWith(autoMemPath)` would let `~/memory/../../../etc/passwd` slip through — the string starts with `~/memory/` but the resolved path doesn't. Normalizing first collapses the `..` and re-checks against the actual destination.

### Key insight

The trailing separator on `getAutoMemPath()` is **load-bearing security**. Without it, `~/foo/memory` would match the prefix of `~/foo/memory-secret/` and grant write access there. The contract that `getAutoMemPath()` always ends in `sep` is enforced by `validateMemoryPath` and the `+ sep` in the computed fallback.

## Daily-Log Path (KAIROS)

`getAutoMemDailyLogPath(date = new Date())` (v2.1.88: paths.ts:246-251) takes an optional date (defaults to today) and returns:

```
<autoMemPath>/logs/YYYY/MM/YYYY-MM-DD.md
```

For example, `2026-05-15` becomes `<autoMemPath>/logs/2026/05/2026-05-15.md`. The `YYYY/MM/` directory layer keeps per-day files in monthly buckets so `ls` and globs stay tractable after a year of daily appends. Zero-padding (`padStart(2, '0')`) ensures lexicographic sort order matches calendar order.

The `loadMemoryPrompt` KAIROS branch (chunks.192.mjs, see [memdir_core.md](./memdir_core.md#kairos-daily-log-variant)) tells the model the **pattern** rather than today's literal path — the model derives the date from `currentDate` in user context, so the cached prompt stays valid across midnight.

## Path Resolution Summary

```
                               getAutoMemPath()
                                       │
                  ┌────────────────────┼─────────────────────┐
                  │                    │                     │
                  ▼                    ▼                     ▼
        Env-var override       Settings.json override     Computed default
        ─────────────────      ─────────────────────      ────────────────
        CLAUDE_COWORK_         autoMemoryDirectory         <base>/projects/
        MEMORY_PATH_           (policy → flag →            <sanitized-git-root>/
        OVERRIDE               local → user)               memory/
        no ~ expansion         ~ expansion enabled         <base> = REMOTE_MEMORY_DIR
        carve-out: NO          carve-out: YES              env or ~/.claude
        (hasAutoMemPathOverride                            git-root via
         returns true)                                     findCanonicalGitRoot
                                                           (worktree-shared)
                  │                    │                     │
                  └────────────────────┴─────────────────────┘
                                       │
                                       ▼
                       validateMemoryPath OR straight assembly
                            (rejects: !absolute, len<3,
                             drive root, UNC, null byte)
                                       │
                                       ▼
                            normalize NFC + trailing sep
                                       │
                                       ▼
                            cached: memoize keyed by
                            (projectRoot, isTinyMemoryEnabled)
```

The three resolution sources have **different security postures**:
- Env-var override: trusted (operator-set, programmatic). No write carve-out (operator is responsible for setting safe paths).
- Settings.json override: trusted (user-set via CLI/UI). **Gets** the write carve-out for ergonomics — user explicitly chose this directory.
- Computed default: trusted (system-derived). Gets the write carve-out.

The split is made visible by `hasAutoMemPathOverride()` (`hk8`) which returns `true` only for the env-var path. Filesystem code checks this to decide whether to grant the carve-out.

## Cross-Validation: v2.1.88 → v2.1.112

| Invariant | v2.1.88 src | v2.1.112 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `isAutoMemoryEnabled` 5-step chain (env truthy → env defined-falsy → SIMPLE → CCR-without-store → setting → default ON) | paths.ts:30-55 | `x3` chunks.64.mjs:1301-1311 | Yes |
| `validateMemoryPath` reject rules (!isAbsolute, len<3, /^[A-Za-z]:$/, \\\\, //, \\0) | paths.ts:109-150 | `Vq4` chunks.64.mjs:1331-1343 | Yes |
| Tilde expansion only when `expandTilde === true`; bare `~`/`~/.`/`~/..` rejected | paths.ts:122-133 | `Vq4` body chunks.64.mjs:1334-1339 | Yes |
| Env-var override > settings.json override > computed | paths.ts:223-235 | `Nw` factory chunks.64.mjs:1386-1391 | Yes |
| `projectSettings` excluded from autoMemoryDirectory | paths.ts:179-186 | `CE_` chunks.64.mjs:1349-1352 (4 sources, no projectSettings) | Yes |
| Canonical git root for worktree sharing | paths.ts:203-205 | `bE_` chunks.64.mjs:1358-1360 | Yes |
| `isAutoMemPath` normalizes before startsWith | paths.ts:273-278 | `YR` chunks.64.mjs:1366-1368 | Yes |

Two refinements in v2.1.112 not in v2.1.88 source:
- **`Qg()` leading short-circuit** in `isAutoMemoryEnabled` (chunks.64.mjs:1302) — extra disable gate before the 5-step chain.
- **Memoize key includes tiny-mem flag**: `\`${c9()}|${wH()}\`` (chunks.64.mjs:1391) — the v2.1.88 source uses only `getProjectRoot()`. The flag is part of the cache key so flipping it (`tengu_billiard_aviary`) invalidates the cache without restart.

Both are tighter than v2.1.88 source — neither breaks any v2.1.88 invariant.
