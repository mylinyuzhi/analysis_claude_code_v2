# paths.ts — Memory Path Resolution and Enablement — v2.1.142

Deep deobfuscation of `src/memdir/paths.ts` (v2.1.88 source = 278 lines; v2.1.142 obfuscated body lives in `cli_inner_pretty.js:139749-139857`). This file owns the **resolution chain** that decides where memory lives on disk and the **enablement chain** that decides whether memory is on at all. It also exports a path-membership predicate consumed by the filesystem permission carve-outs.

The major v2.1.142 changes vs v2.1.112:

1. **7-step enablement chain** (was 5 in v2.1.88, 5+1 short-circuit in v2.1.112) — adds `Rd()` (toggle-memory CLI flag) and `Pi$()` (CCR-sentinel-paths allowlist) inside `isAutoMemoryEnabled`.
2. **Tightened `validateMemoryPath` bare-tilde rejection** — explicitly rejects normalized rests starting with `../`.
3. **Tiny-memory dirname** is still `"tiny_memory"`, selected by `gM()` / `tengu_billiard_aviary`. The cache key includes the tiny flag.
4. **Same trailing-sep contract**, same NFC normalization, same memoization on `getProjectRoot()`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory)
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) - New symbols from this unit

Key functions in this document:
- `isAutoMemoryEnabled` (`x9`) - 7-step enablement priority chain (cli_inner_pretty.js:139749-139760)
- `isCcrSentinelDisabled` (`Pi$`) - Per-process allowlist check via `tengu_sepia_cormorant` (cli_inner_pretty.js:139761-139768)
- `isToggleMemoryDisabled` (`Rd`) - `/toggle-memory` session-level switch (used by `x9`'s first check)
- `isExtractModeActive` (`Wi$`) - Whether the extract-memories background agent runs this session (cli_inner_pretty.js:139769-139772)
- `getMemoryBaseDir` (`zF`) - Base directory before project segmentation (cli_inner_pretty.js:139773-139776)
- `getAutoMemEntrypointDirname` (`lh1`) - Returns `"memory"` or `"tiny_memory"` (cli_inner_pretty.js:139777-139779)
- `isTinyMemoryEnabled` (`gM`) - Single-fact-per-file mode flag (cli_inner_pretty.js:139780-139782)
- `validateMemoryPath` (`VTK`) - Override-path security validator (cli_inner_pretty.js:139783-139803)
- `getAutoMemPathOverride` (`vTK`) - Env-var override resolver (cli_inner_pretty.js:139804-139806)
- `getAutoMemPathSetting` (`ih1`) - settings.json override resolver (cli_inner_pretty.js:139807-139813)
- `hasAutoMemPathOverride` (`Zi$`) - Override predicate (cli_inner_pretty.js:139814-139816)
- `getAutoMemBase` (`rh1`) - Project root → canonical git root (cli_inner_pretty.js:139817-139819)
- `getAutoMemEntrypoint` (`YKH`) - Path to `MEMORY.md` inside auto-mem dir (cli_inner_pretty.js:139820-139822)
- `isAutoMemPath` (`YF`) - Path-membership predicate (cli_inner_pretty.js:139823-139825)
- `isAutoMemPathWithoutTeam` (`N5$`) - isAutoMemPath minus team subtree (cli_inner_pretty.js:139826-139831)
- `getAutoMemPath` (`UY`) - Memoized full resolver (cli_inner_pretty.js:139849-139857)

Key constants in this document:
- `AUTO_MEM_DIRNAME` (`dh1`) - String `"memory"` (cli_inner_pretty.js:139834)
- `TINY_MEM_DIRNAME` (`ch1`) - String `"tiny_memory"` (cli_inner_pretty.js:139835)
- `AUTO_MEM_ENTRYPOINT_NAME` (`nh1`) - String `"MEMORY.md"` (cli_inner_pretty.js:139836) — alias of `xj`

## `isAutoMemoryEnabled` (x9) — The 7-Step Priority Chain

### What it does

Returns `true` / `false` to decide whether the entire memory subsystem (memdir, agent memory, past-session search, extract memories, `/remember`, `/dream`, team sync) is active for this session.

### How it works

First-defined-wins priority chain:

1. **Session-level toggle off** (`Rd()` truthy → OFF): The `/toggle-memory` slash command toggles memory at session granularity. If the user has run it this session, this returns `true` and `isAutoMemoryEnabled` returns `false`. This is a v2.1.142 addition for in-session opt-out.
2. **`CLAUDE_CODE_DISABLE_AUTO_MEMORY` truthy → OFF**: `isEnvTruthy(envVal)` → return `false`.
3. **`CLAUDE_CODE_DISABLE_AUTO_MEMORY` defined-falsy → ON**: Set to `0` / `false` explicitly → return `true`. Distinct from "undefined" — the env var is **on the variable's value layer** of the priority, not "unset = skip me."
4. **`CLAUDE_CODE_SIMPLE` truthy → OFF**: The `--bare` switch. The system prompt builder already drops the memory section under SIMPLE; this gate also stops the other half of the subsystem.
5. **CCR remote without persistent storage → OFF**: `CLAUDE_CODE_REMOTE` is truthy AND `CLAUDE_CODE_REMOTE_MEMORY_DIR` is unset.
6. **CCR sentinel paths disabled → OFF**: `Pi$()` returns true → return `false`. A per-cohort allowlist; see [`isCcrSentinelDisabled`](#iscrsentineldisabled-pi) below.
7. **`settings.autoMemoryEnabled` is defined → use it**: If `false`, returns `false`; if `true`, returns `true`. This is the **project-level opt-out** point.
8. **Default → ON**: If nothing above tripped, return `true`.

### Why this approach

- **Session toggle first**: The `/toggle-memory` command needs to override everything — it's the user's most explicit "I want memory off RIGHT NOW" signal. Putting it before env-var checks means the toggle works even in deployments where the env var is set to enable memory.
- **Env vars take precedence over settings**: Operators who set an env var have explicitly chosen.
- **`CLAUDE_CODE_SIMPLE` is a hard kill-switch**: Even with positive settings, `--bare` means no memory.
- **CCR special-case before settings**: If you're in CCR without a memory dir, no setting can make memory work.
- **`Pi$()` ahead of settings**: The sentinel-paths check is a cohort-level kill switch (Anthropic-controlled via Growthbook) — if memory was rolled out experimentally and a regression appears, this gate flips it off without redeploying.
- **`settings.autoMemoryEnabled !== undefined` check**: A `true`/`false` value is a deliberate choice; `undefined` (the absence of the field) means "I haven't said."

### Key insight

The chain is "first-defined-wins" rather than "highest-priority OR." That distinction matters: a user can **explicitly enable** memory via `CLAUDE_CODE_DISABLE_AUTO_MEMORY=0` even if their `settings.json` has `autoMemoryEnabled: false`. The env var wins not because it's "stronger" but because it's **earlier in the chain** and has a defined value. The v2.1.142 additions (`Rd()`, `Pi$()`) extend this same first-defined-wins discipline — both have an explicit "this returned truthy → memory off" branch, and they sit precisely where their semantics demand (session-level before env-vars; cohort-level after env-vars but before settings).

```javascript
// ============================================
// isAutoMemoryEnabled - 7-step first-defined-wins priority chain
// Location: cli_inner_pretty.js:139749-139760
// ============================================

// ORIGINAL (for source lookup):
function x9() {
  if (Rd()) return !1;
  let H = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
  if (bH(H)) return !1;
  if (E4(H)) return !0;
  if (bH(process.env.CLAUDE_CODE_SIMPLE)) return !1;
  if (bH(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
  if (Pi$()) return !1;
  let $ = m6();
  if ($.autoMemoryEnabled !== void 0) return $.autoMemoryEnabled;
  return !0;
}

// READABLE (for understanding):
export function isAutoMemoryEnabled() {
  if (isToggleMemoryDisabled()) return false                       // 1. /toggle-memory
  const envVal = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY
  if (isEnvTruthy(envVal)) return false                            // 2. env truthy
  if (isEnvDefinedFalsy(envVal)) return true                       // 3. env explicit enable
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) return false    // 4. --bare
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE)
      && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return false  // 5. CCR without storage
  if (isCcrSentinelDisabled()) return false                        // 6. CCR cohort kill-switch
  const settings = getInitialSettings()
  if (settings.autoMemoryEnabled !== undefined)
    return settings.autoMemoryEnabled                              // 7. settings.json
  return true                                                      // 8. Default ON
}

// Mapping: x9→isAutoMemoryEnabled, H→envVal, $→settings, Rd→isToggleMemoryDisabled,
//          bH→isEnvTruthy, E4→isEnvDefinedFalsy, Pi$→isCcrSentinelDisabled,
//          m6→getInitialSettings
```

## `isCcrSentinelDisabled` (Pi$) — Cohort-Level Allowlist

### What it does

Returns `true` to **disable memory** when the local CCR/sentinel path is listed in `tengu_sepia_cormorant` Growthbook config and `tengu_umber_petrel` is also true. Used as a remote kill-switch for memory in CCR cohorts.

### How it works

1. Read `tengu_sepia_cormorant` (default `null`). Expected shape: array of path-prefix strings.
2. If the value isn't an array or is empty, **return false** (no sentinel paths configured).
3. Compute `q = jv()?.something ?? y8H()` — read the local CCR identifier or fall back to a host-id-like value.
4. If `q` isn't a string, return false.
5. Check membership: `LTK(q, sentinelPaths)` — `LTK` is a path-prefix-membership predicate that walks the array and returns true if `q` is a prefix-match of any entry.
6. If member, also require `tengu_umber_petrel === true`. Both must be true → return `true` (disable memory).

### Why this approach

- **Two-flag gate**: `tengu_sepia_cormorant` carries the **data** (which paths to gate on), `tengu_umber_petrel` carries the **enable** signal (whether to apply the gate at all). Splitting them means the data can be staged ahead of time and toggled atomically with the boolean.
- **Path-prefix match instead of exact**: A sentinel like `cli-renderer/runtime-stable/` matches any session whose ident starts with that prefix — making it easy to gate a whole sub-cohort with one entry.
- **`!Array.isArray` early return**: If the Growthbook flag hasn't been set, the function returns false. This is the **safe default** — memory stays on unless the flag explicitly disables it.

### Key insight

This is Anthropic's **emergency stop** for memory in production. If memory is causing problems in a specific cohort (e.g., long sessions starting to crash in a particular CCR environment), they can ship a Growthbook config update that adds the cohort path to `tengu_sepia_cormorant` and flips `tengu_umber_petrel` — disabling memory for those users without a deploy.

```javascript
// ============================================
// isCcrSentinelDisabled - CCR cohort-level memory kill-switch
// Location: cli_inner_pretty.js:139761-139768
// ============================================

// ORIGINAL (for source lookup):
function Pi$() {
  let H = Z$("tengu_sepia_cormorant", null);
  if (!Array.isArray(H) || H.length === 0) return !1;
  let $ = Jv(),
    q = $ !== void 0 ? $ : y8H();
  if (typeof q !== "string" || !LTK(q, H)) return !1;
  return Z$("tengu_umber_petrel", !1);
}

// READABLE (for understanding):
function isCcrSentinelDisabled() {
  const sentinelPaths = getFeatureValue_CACHED_MAY_BE_STALE('tengu_sepia_cormorant', null)
  if (!Array.isArray(sentinelPaths) || sentinelPaths.length === 0) return false

  const localIdentSource = getRuntimeIdent()
  const localIdent = localIdentSource !== undefined ? localIdentSource : getHostIdentFallback()
  if (typeof localIdent !== 'string' || !isPathPrefixMember(localIdent, sentinelPaths)) {
    return false
  }
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_umber_petrel', false)
}

// Mapping: Pi$→isCcrSentinelDisabled, H→sentinelPaths, $→localIdentSource, q→localIdent,
//          Z$→getFeatureValue_CACHED_MAY_BE_STALE, Jv→getRuntimeIdent, y8H→getHostIdentFallback,
//          LTK→isPathPrefixMember
```

## `getAutoMemPath` (UY) — The Resolution Chain

### What it does

Returns the **absolute path** of the auto-memory directory, with one trailing path separator. Single source of truth for "where do memories live?" Memoized so render-path callers don't repay the cost of reading settings four times per call.

### How it works

The function resolves in **three** priority levels, then falls back to a computed path:

1. **Env-var override** (`getAutoMemPathOverride` → `vTK`): Reads `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`. If set, `validateMemoryPath` (without tilde expansion) returns either a normalized path or `undefined`.
2. **Settings.json override** (`getAutoMemPathSetting` → `ih1`): Reads `autoMemoryDirectory` from settings (`policySettings` → `flagSettings` → `userSettings` first defined wins; `projectSettings` and `localSettings` deliberately excluded for security). `validateMemoryPath` runs with tilde expansion enabled.
3. **Computed default**: If neither override is set, build `<base>/projects/<sanitized-git-root>/<dirname>/` where:
   - `<base>` = `getMemoryBaseDir()` — `CLAUDE_CODE_REMOTE_MEMORY_DIR` env var if set, otherwise `getClaudeConfigHomeDir()` (typically `~/.claude`).
   - `<sanitized-git-root>` = `sanitizePath(getAutoMemBase())` — uses the canonical git root so all worktrees of the same repo share one auto-memory directory.
   - `<dirname>` = `getAutoMemEntrypointDirname()` — `"memory"` (default) or `"tiny_memory"` (when `tengu_billiard_aviary` is on).
   - Trailing separator + `.normalize('NFC')` for cross-platform path equality.

The whole thing is wrapped in `L8(…, () => \`${getProjectRoot()}|${isTinyMemoryEnabled()}\`)`, keyed by `(projectRoot, tinyMemFlag)`:
- **Same project root + same flag** → cache hit.
- **Different project root** (tests, sub-shells) → cache miss, recompute.
- **Flag flips mid-session** → cache miss, recompute (so flipping tiny mode produces a fresh directory immediately).

### Why this approach (v2.1.112 → v2.1.142 unchanged in algorithm)

- **Env-var beats settings**: The env var is set programmatically by Cowork/SDK at process start.
- **`projectSettings` excluded from override**: `.claude/settings.json` is checked into the repo. A malicious repo could set `autoMemoryDirectory: "~/.ssh"` and gain silent write access to sensitive paths via the filesystem write carve-out. Excluding project-source settings closes this attack vector.
- **`localSettings` also excluded**: v2.1.142 narrows the override sources from v2.1.112's 4-tier (policy → flag → local → user) to **3-tier (policy → flag → user)** — local settings (the per-machine but per-project file) no longer count. This is a defense-in-depth tightening: a local-settings file in a shared dev environment could still be modified by an attacker with non-root access, so v2.1.142 demands a more privileged settings source.
- **Canonical git root**: Multiple worktrees of the same repo share one memory directory.
- **Memoization keyed on `(projectRoot, tinyMemFlag)`**: Settings, env vars, and `CLAUDE_CONFIG_DIR` are session-stable in production. The tiny-mem flag is part of the key so flipping it (`tengu_billiard_aviary`) invalidates the cache without restart.
- **NFC normalization**: Same-bytes Unicode strings can have different on-disk representations (NFC vs NFD on macOS).

### Key insight

`getAutoMemPath` is the **gateway**: every later call (read entrypoint, ensure dir, write file, check path-membership for permission carve-out) flows through it. Memoizing it keys the rest of the system to a single resolution decision per (project root, tiny flag) tuple, even when called dozens of times per Messages re-render.

```javascript
// ============================================
// getAutoMemPath - Memoized resolver: override → settings → computed default
// Location: cli_inner_pretty.js:139849-139857
// ============================================

// ORIGINAL (for source lookup):
UY = L8(
  () => {
    let H = vTK() ?? ih1();
    if (H) return H;
    let $ = EE.join(zF(), "projects");
    return (EE.join($, DO(rh1()), lh1()) + EE.sep).normalize("NFC");
  },
  () => `${R9()}|${gM()}`,
);

// READABLE (for understanding):
export const getAutoMemPath = memoize(
  () => {
    const override = getAutoMemPathOverride() ?? getAutoMemPathSetting()
    if (override) return override
    const projectsDir = path.join(getMemoryBaseDir(), 'projects')
    return (
      path.join(projectsDir, sanitizePath(getAutoMemBase()), getAutoMemEntrypointDirname()) +
      path.sep
    ).normalize('NFC')
  },
  () => `${getProjectRoot()}|${isTinyMemoryEnabled()}`,
)

// Mapping: UY→getAutoMemPath, H→override, $→projectsDir, L8→memoize,
//          vTK→getAutoMemPathOverride, ih1→getAutoMemPathSetting, EE.join→path.join,
//          zF→getMemoryBaseDir, DO→sanitizePath, rh1→getAutoMemBase,
//          lh1→getAutoMemEntrypointDirname, EE.sep→path.sep, R9→getProjectRoot,
//          gM→isTinyMemoryEnabled
```

## `getAutoMemEntrypointDirname` (lh1) — Tiny-Mem Dirname Switch

### What it does

Returns `"memory"` or `"tiny_memory"` depending on whether tiny memory is enabled.

```javascript
// ============================================
// getAutoMemEntrypointDirname - Selects memory directory name based on tiny-mem flag
// Location: cli_inner_pretty.js:139777-139779
// ============================================

// ORIGINAL (for source lookup):
function lh1() {
  return gM() ? ch1 : dh1;
}

// READABLE (for understanding):
function getAutoMemEntrypointDirname() {
  return isTinyMemoryEnabled() ? TINY_MEM_DIRNAME : AUTO_MEM_DIRNAME
}

// Mapping: lh1→getAutoMemEntrypointDirname, ch1→TINY_MEM_DIRNAME ("tiny_memory"),
//          dh1→AUTO_MEM_DIRNAME ("memory"), gM→isTinyMemoryEnabled
```

### Why two dirnames

Switching from `memory/` to `tiny_memory/` for the tiny variant gives **two separate disk spaces**, so a user can:
- Have normal v2.1.112-style memories under `memory/` from a prior session.
- Have tiny single-fact memories under `tiny_memory/` from a current session.
- Switch between modes by toggling the flag — no migration needed.

The cost: a tiny-mode session can't see memories saved in non-tiny mode (different directory). This is acceptable because the flag is at the cohort level — it doesn't flip mid-session in production, only during feature rollout.

### Key insight

The dirname split is the **escape hatch** for the tiny experiment. If the experiment proves successful, the two paths can be merged (data migrated, flag removed). If it fails, deleting `tiny_memory/` is a clean rollback. In v2.1.112 there was a brief in-source comment hinting at this strategy; v2.1.142 implements it as a stable dichotomy.

## `validateMemoryPath` (VTK) — Security Filter on Override Paths

### What it does

Normalizes and validates a candidate path. Returns either the normalized path with exactly one trailing separator, or `undefined` if the path is unset, empty, or rejected.

### How it works

1. **Empty guard**: `if (!raw) return undefined`. Catches empty string, null, undefined.
2. **Optional tilde expansion** (when `expandTilde === true`): If the path starts with `~/` or `~\\`, expand to `$HOME/<rest>`. **Bare `~`, `~/`, `~/.`, `~/..`, and any rest that normalizes to `..` or starts with `../`** are not expanded — they would resolve to `$HOME` or its ancestor.
3. **Normalize and strip trailing seps**: `normalize(candidate).replace(/[/\\]+$/, '')`.
4. **Rejection rules** (any of these → return `undefined`):
   - `!isAbsolute(normalized)` — relative paths get interpreted against the wrong CWD.
   - `length < 3` — `/` becomes `""` after strip; `/a` is too short to be a real directory.
   - `^[A-Za-z]:$/` test — Windows drive root (`C:`) after sep strip.
   - `startsWith('\\\\')` — UNC paths (`\\server\share`) — opaque trust boundary.
   - `startsWith('//')` — UNIX equivalent of UNC after normalize on some platforms.
   - `includes('\0')` — null byte that survives `normalize()`.
5. **Add trailing sep and NFC-normalize**: `(normalized + sep).normalize('NFC')`.

### v2.1.142 refinement: Explicit `../` rejection

The bare-tilde-expansion gate now rejects three additional patterns:
- `restNorm === '..'` (same as v2.1.112)
- `restNorm.startsWith('..' + sep)` (rest normalizes to a path that begins with `../`)
- `restNorm.startsWith('../')` (POSIX explicit)
- `restNorm.startsWith('..\\')` (Windows explicit)

This closes a gap in v2.1.112 where `~/foo/../bar` could be expanded to `$HOME/foo/../bar` which `normalize` would collapse to `$HOME/bar` — landing the override path at a location the user didn't directly type. The new check rejects any rest that normalizes to a path starting with `..`, forcing the user to express their intent absolutely.

### Why this approach

- **Write-allowlist root**: Downstream filesystem code uses this path as the root of "what the model can write to without permission prompts." A bad path here gives the model silent write access to wherever it points.
- **Why reject `/`**: After strip, `/` becomes `""` — anything `startsWith("")` is true, so the carve-out matches the whole filesystem.
- **Why reject `C:`**: Drive root would carve out everything on `C:`.
- **Why reject UNC**: Network paths cross trust boundaries that the local permission system doesn't understand.
- **Why reject null bytes**: A path like `/safe/dir/\0/etc/passwd` normalizes to `/safe/dir/\0/etc/passwd` (Node's `normalize` doesn't strip nulls); `open()` truncates at the null and writes to `/safe/dir/`.
- **Bare `~` rejection (and `../` variants)**: `normalize('') === '.'`, `normalize('.') === '.'`, `normalize('foo/..') === '.'`, `normalize('..') === '..'`. After tilde expansion these would map to `$HOME` literally or its parent; the rest-norm check catches that.

### Key insight

This is a **boundary validator**, not a path canonicalizer. Its job is to reject inputs that would later let the model escape its sandbox. The defenses are stacked because each one catches a class the others miss (null bytes survive normalize, UNC survives isAbsolute, drive roots survive length-check by being exactly 2 chars). The v2.1.142 addition tightens the `~/` cases that survive normalize but resolve to ancestor directories.

```javascript
// ============================================
// validateMemoryPath - Security validator for override paths
// Location: cli_inner_pretty.js:139783-139803
// ============================================

// ORIGINAL (for source lookup):
function VTK(H, $) {
  if (!H) return;
  let q = H;
  if ($ && (q.startsWith("~/") || q.startsWith("~\\"))) {
    let _ = q.slice(2),
      A = EE.normalize(_ || ".");
    if (A === "." || A === ".." || A.startsWith(`..${EE.sep}`) || A.startsWith("../") || A.startsWith("..\\")) return;
    q = EE.join(TTK.homedir(), _);
  }
  let K = EE.normalize(q).replace(/[/\\]+$/, "");
  if (
    !EE.isAbsolute(K) ||
    K.length < 3 ||
    /^[A-Za-z]:$/.test(K) ||
    K.startsWith("\\\\") ||
    K.startsWith("//") ||
    K.includes("\x00")
  )
    return;
  return (K + EE.sep).normalize("NFC");
}

// READABLE (for understanding):
function validateMemoryPath(raw, expandTilde) {
  if (!raw) return undefined
  let candidate = raw

  if (expandTilde && (candidate.startsWith('~/') || candidate.startsWith('~\\'))) {
    const rest = candidate.slice(2)
    const restNorm = path.normalize(rest || '.')
    // Reject trivial remainders that would expand to $HOME or an ancestor.
    if (
      restNorm === '.' ||
      restNorm === '..' ||
      restNorm.startsWith('..' + path.sep) ||
      restNorm.startsWith('../') ||
      restNorm.startsWith('..\\')
    ) {
      return undefined
    }
    candidate = path.join(os.homedir(), rest)
  }

  const normalized = path.normalize(candidate).replace(/[/\\]+$/, '')
  if (
    !path.isAbsolute(normalized) ||
    normalized.length < 3 ||
    /^[A-Za-z]:$/.test(normalized) ||
    normalized.startsWith('\\\\') ||
    normalized.startsWith('//') ||
    normalized.includes('\0')
  ) {
    return undefined
  }
  return (normalized + path.sep).normalize('NFC')
}

// Mapping: VTK→validateMemoryPath, H→raw, $→expandTilde, q→candidate, _→rest, A→restNorm,
//          K→normalized, EE→path module, TTK→os module
```

## `getAutoMemPathSetting` (ih1) — Tightened Override Sources

### What it does

Reads `autoMemoryDirectory` from settings, with the **narrowed v2.1.142 source list**: `policySettings` → `flagSettings` → `userSettings` (no longer includes `localSettings` or `projectSettings`).

```javascript
// ============================================
// getAutoMemPathSetting - Tightened 3-source settings override resolver
// Location: cli_inner_pretty.js:139807-139813
// ============================================

// ORIGINAL (for source lookup):
function ih1() {
  let H =
    v8("policySettings")?.autoMemoryDirectory ??
    v8("flagSettings")?.autoMemoryDirectory ??
    v8("userSettings")?.autoMemoryDirectory;
  return VTK(H, !0);
}

// READABLE (for understanding):
function getAutoMemPathSetting() {
  const dir =
    getSettingsForSource('policySettings')?.autoMemoryDirectory ??
    getSettingsForSource('flagSettings')?.autoMemoryDirectory ??
    getSettingsForSource('userSettings')?.autoMemoryDirectory
  return validateMemoryPath(dir, /* expandTilde */ true)
}

// Mapping: ih1→getAutoMemPathSetting, H→dir, v8→getSettingsForSource, VTK→validateMemoryPath
```

### Why removed local + project settings

The threat model: a developer working in a shared environment (corporate-managed laptop, multi-user CI runner) could have their `localSettings` modified by an attacker who has write access to that file but not to the user's home directory. Removing `localSettings` from the override list closes that vector — to redirect memory, the attacker now needs access to `~/.claude/settings.json` (user-level), the corporate-deployed `flagSettings`, or the policy-enforced `policySettings`.

`projectSettings` was already excluded in v2.1.112 (checked-in repo settings — too easy to attack). v2.1.142 extends this principle to per-machine local settings.

### Key insight

The settings-override is a **trust hierarchy**, and v2.1.142 promotes the floor: only settings written by elevated channels (corporate policy, CLI flag, user themselves) can redirect memory. Per-project or per-machine settings — both of which can be modified without elevated privileges in mixed-trust environments — are now read-only for memory-path purposes.

## `isAutoMemPath` (YF) — Path Membership Predicate

### What it does

Returns `true` if an absolute path starts with the auto-memory directory. Used by the filesystem-permission carve-out (`filesystem.ts`) to decide whether a Write/Edit can bypass the dangerous-directory prompt.

### How it works

1. `normalize(absolutePath)` — collapses `..` segments to prevent traversal bypasses (`/safe/../etc/passwd` → `/etc/passwd`).
2. `normalizedPath.startsWith(getAutoMemPath())` — direct string prefix match. Works because `getAutoMemPath()` always returns a path with one trailing sep.

### Why normalize first

The naive `absolutePath.startsWith(autoMemPath)` would let `~/memory/../../../etc/passwd` slip through — the string starts with `~/memory/` but the resolved path doesn't. Normalizing first collapses the `..` and re-checks against the actual destination.

### Key insight

The trailing separator on `getAutoMemPath()` is **load-bearing security**. Without it, `~/foo/memory` would match the prefix of `~/foo/memory-secret/` and grant write access there. The contract that `getAutoMemPath()` always ends in `sep` is enforced by `validateMemoryPath` and the `+ sep` in the computed fallback.

```javascript
// ============================================
// isAutoMemPath - Path-prefix membership check
// Location: cli_inner_pretty.js:139823-139825
// ============================================

// ORIGINAL (for source lookup):
function YF(H) {
  return EE.normalize(H).startsWith(UY());
}

// READABLE (for understanding):
export function isAutoMemPath(absolutePath) {
  const normalizedPath = path.normalize(absolutePath)
  return normalizedPath.startsWith(getAutoMemPath())
}

// Mapping: YF→isAutoMemPath, EE.normalize→path.normalize, UY→getAutoMemPath
```

## `isAutoMemPathWithoutTeam` (N5$) — Excluding the team/ Subtree

### What it does

Returns `true` if a path is in `getAutoMemPath()` **but not** in `getTeamMemPath()`. Used to distinguish "private auto memory" from "shared team memory" for the filesystem write-permission carve-out (the auto path gets the carve-out automatically; team paths go through the team-memory traversal-defense pipeline).

### How it works

1. Normalize the absolute path.
2. Check it starts with auto-mem.
3. Check `Xi$(normalizedPath, autoMemPath)` (the inverse of the team-check) is NOT true.

```javascript
// ============================================
// isAutoMemPathWithoutTeam - Auto-mem membership excluding the team subtree
// Location: cli_inner_pretty.js:139826-139831
// ============================================

// ORIGINAL (for source lookup):
function N5$(H) {
  let $ = EE.normalize(H),
    q = UY();
  if (!$.startsWith(q)) return !1;
  return !Xi$($, q);
}

// READABLE (for understanding):
export function isAutoMemPathWithoutTeam(absolutePath) {
  const normalizedPath = path.normalize(absolutePath)
  const autoDir = getAutoMemPath()
  if (!normalizedPath.startsWith(autoDir)) return false
  return !isTeamSubpath(normalizedPath, autoDir)
}

// Mapping: N5$→isAutoMemPathWithoutTeam, H→absolutePath, $→normalizedPath, q→autoDir,
//          Xi$→isTeamSubpath, UY→getAutoMemPath
```

### Why this split

The filesystem.ts carve-out grants memory paths a permission bypass for the model's `Write`/`Edit` tools. That carve-out applies to auto-mem (private) writes unconditionally. Team-mem writes have a stricter validator (`validateTeamMemWritePath` — symlink-aware realpath traversal defense, see [team_paths.md](./team_paths.md)). By splitting "auto mem minus team subtree" out, the filesystem layer can apply the simple prefix-match carve-out to private memory while routing team writes through the harder defenses.

## Daily-Log Path — Removed in v2.1.142

In v2.1.112 the file exported `getAutoMemDailyLogPath(date = new Date())` for the KAIROS branch. **This export does not exist in v2.1.142.** The KAIROS dispatch in `loadMemoryPrompt` was removed (see [memdir_core.md](./memdir_core.md)), and the daily-log path layout (`logs/YYYY/MM/YYYY-MM-DD.md`) now only appears in two places:

1. The `/dream` skill asset prompt (cli_inner_pretty.js:502205) — documentation only.
2. The "Searching past context" section (cli_inner_pretty.js:389435 — search hint for `sessions/YYYY/MM/DD/<id>-<title>.md`) — points at session logs, not memory logs.

The daily-log paradigm is no longer a runtime feature of the auto-memory subsystem.

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
        OVERRIDE               user; local + project       <dirname>/
        no ~ expansion         REMOVED in v2.1.142)        where dirname =
        carve-out: NO          ~ expansion enabled         "memory" (default) or
        (hasAutoMemPathOverride                            "tiny_memory" (when
         returns true)                                     tengu_billiard_aviary)
                  │                    │                     │
                  └────────────────────┴─────────────────────┘
                                       │
                                       ▼
                       validateMemoryPath OR straight assembly
                            (rejects: !absolute, len<3,
                             drive root, UNC, null byte,
                             bare ~/. ~/.. ~/../foo)
                                       │
                                       ▼
                            normalize NFC + trailing sep
                                       │
                                       ▼
                            cached: memoize keyed by
                            (projectRoot, isTinyMemoryEnabled)
```

The three resolution sources still have **different security postures**:

- Env-var override: trusted (operator-set, programmatic). No write carve-out.
- Settings.json override: trusted (user/admin-set via CLI/UI from policy/flag/user — but no longer local). **Gets** the write carve-out for ergonomics.
- Computed default: trusted (system-derived). Gets the write carve-out.

The split is made visible by `hasAutoMemPathOverride()` (`Zi$`) which returns `true` only for the env-var path.

## Cross-Validation: v2.1.88 → v2.1.142

| Invariant | v2.1.88 src | v2.1.142 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `isAutoMemoryEnabled` priority chain (env truthy → env defined-falsy → SIMPLE → CCR-without-store → setting → default ON) | paths.ts:30-55 | `x9` cli_inner_pretty.js:139749-139760 | Yes (with v2.1.142 additions before and after env-truthy step) |
| `validateMemoryPath` core reject rules (!isAbsolute, len<3, drive root, UNC, null byte) | paths.ts:109-150 | `VTK` cli_inner_pretty.js:139783-139803 | Yes |
| Tilde expansion only when `expandTilde === true`; bare `~`/`~/.`/`~/..` rejected | paths.ts:122-133 | `VTK` body cli_inner_pretty.js:139786-139791 | Yes (with v2.1.142 additions for `../` patterns) |
| Env-var override > settings.json override > computed | paths.ts:223-235 | `UY` factory cli_inner_pretty.js:139850-139854 | Yes |
| `projectSettings` excluded from autoMemoryDirectory | paths.ts:179-186 | `ih1` cli_inner_pretty.js:139807-139813 | Yes (also localSettings now excluded — tightening) |
| Canonical git root for worktree sharing | paths.ts:203-205 | `rh1` cli_inner_pretty.js:139817-139819 | Yes |
| `isAutoMemPath` normalizes before startsWith | paths.ts:273-278 | `YF` cli_inner_pretty.js:139823-139825 | Yes |

**v2.1.142-specific additions not present in v2.1.88 source:**

| Addition | v2.1.142 obfuscated |
|----------|---------------------|
| `Rd()` toggle-memory session-level check | first check in `x9` |
| `Pi$()` CCR sentinel-paths allowlist | step 6 in `x9` |
| Tiny-memory dirname (`tiny_memory`) switching | `lh1` calls `gM()` |
| Cache key includes tiny-mem flag | `\`${R9()}|${gM()}\`` |
| `validateMemoryPath` rejects `~/../` and similar | new rest-norm checks in `VTK` |
| `getAutoMemPathSetting` no longer reads `localSettings` | omitted from cascade in `ih1` |
| `isAutoMemPathWithoutTeam` exported | `N5$` cli_inner_pretty.js:139826-139831 |
| `getAutoMemDailyLogPath` removed | not present (KAIROS gone) |

All v2.1.142 changes are **strictly tighter** than v2.1.88 — none of them break a v2.1.88 invariant, but they all narrow the surface area of accepted inputs (more rejections, more cohort-level kill switches, fewer trusted settings sources). The memoization shape and trailing-sep contract are unchanged from v2.1.112.
