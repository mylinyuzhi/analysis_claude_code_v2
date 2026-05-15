# Plan File Naming — Deep Deobfuscation (v2.1.112)

This document covers the **plan-slug generation pipeline**: how `${slug}.md` is produced for a session. The v2.1.111 changelog summarizes the user-visible change:

> Plan files are now named after your prompt (e.g. `fix-auth-race-snug-otter.md`) instead of purely random words

This was a deliberate redesign. v2.1.88 produced purely random slugs like `gleaming-brewing-phoenix.md`. v2.1.112 produces prompt-seeded slugs like `fix-auth-race-snug-otter.md` (prompt-kebab + adjective + noun), falling back to the legacy random format only when no seed is available.

The v2.1.88 source is at `/lyz/codespace/3rd/claude-code/src/utils/plans.ts` (`getPlanSlug` at line 32) and `/lyz/codespace/3rd/claude-code/src/utils/words.ts` (`generateWordSlug` at line 785, `generateShortWordSlug` at line 796). The v2.1.112 implementation lives at `chunks.97.mjs:1544-1782`.

## Symbol Table

- `getPlanSlug` (`g56`) - chunks.97.mjs:1583
- `getPlansDirectory` (`aO`) - chunks.97.mjs:1767 (memoized via `P1`)
- `getPlanFilePath` (`eW`) - chunks.97.mjs:1612
- `getPlan` (`lP`) - chunks.97.mjs:1618
- `setPlanSlug` (`jn1`) - chunks.97.mjs:1604
- `clearPlanSlug` (`pb8`, partial) / `clearAllPlanSlugs` (`PR4`) - chunks.97.mjs:1600,1608
- `generateWordSlug` (`Bb8`) - chunks.97.mjs:1552 (adjective+verb+noun)
- `generateShortWordSlug` (`Zh6`) - chunks.97.mjs:1567 (adjective+noun; **v2.1.112 new function**)
- `slugifyPrompt` (`MR4`) - chunks.97.mjs:1559 (**v2.1.112 new function**)
- `randomInt` (`UJz`) - chunks.97.mjs:1544 (crypto-randomized int)
- `pickRandom` (`R88`) - chunks.97.mjs:1548
- `MAX_SLUG_RETRIES` (`iJz`) - chunks.97.mjs:1751 (literal `10`)
- `ADJECTIVES` (`JR4`), `NOUNS` (`XR4`), `VERBS` (`gJz`) - chunks.97.mjs:1580 (frozen arrays)
- `getPlanSlugCache` (`h86`) - returns the per-session Map
- `getSessionId` (`I8`)
- `planSlugSeed` (option key, propagated from slash-command path) - chunks.141.mjs:2249
- `buildPlanModeAttachment` slug-fix call site (`HMY`) - chunks.155.mjs:1633

## Pipeline Overview

```
        ┌────────────────────────────────────────────────────┐
        │  prompt (user text or slash-command planSlugSeed)  │
        └─────────────────────┬──────────────────────────────┘
                              │
                              ▼
                      slugifyPrompt(prompt)  // MR4
                              │
                              ▼
                  "fix the auth race"  →  "fix-the-auth-race"
                              │
                              ▼
                ┌─────────────────────────────┐
                │  generateShortWordSlug()     │  Zh6
                │  "snug-otter"                │
                └────────────┬─────────────────┘
                              │
                              ▼
              "fix-the-auth-race-snug-otter"
                              │
              ┌───────────────┴──────────────┐
              │                              │
              ▼                              ▼
       does file exist?              cache.set(sid, slug)
              │
       NO     │     YES (collision)
              │      ↓
              │     retry up to MAX_SLUG_RETRIES (10)
              │      with a new short-word suffix
              ▼
              done → returns slug
```

Without a prompt seed, the pipeline degenerates to the legacy random-words form:

```
                     getPlanSlug(sessionId, /* no K */)
                              │
                              ▼
                     generateWordSlug()  // Bb8
                              │
                              ▼
                "gleaming-brewing-phoenix"
                              │
                              ▼  (same collision retry / cache flow)
                              done
```

## The Core Function: `getPlanSlug` (`g56`)

```javascript
// ============================================
// getPlanSlug - Cached, prompt-seeded plan slug generator
// Location: chunks.97.mjs:1583-1598
// ============================================

// ORIGINAL (for source lookup):
function g56(q, K) {
    let _ = q ?? I8(),
        z = h86(),
        Y = z.get(_);
    if (!Y) {
        let A = aO(),
            O = K ? MR4(K) : "";
        for (let w = 0; w < iJz; w++) {
            Y = O ? `${O}-${Zh6()}` : Bb8();
            let $ = F56(A, `${Y}.md`);
            if (!V8().existsSync($)) break
        }
        z.set(_, Y)
    }
    return Y
}

// READABLE (for understanding):
function getPlanSlug(sessionId, promptSeed) {
    const id = sessionId ?? getSessionId();
    const cache = getPlanSlugCache();
    let slug = cache.get(id);
    if (!slug) {
        const plansDir = getPlansDirectory();
        const promptPrefix = promptSeed ? slugifyPrompt(promptSeed) : '';
        // Try to find a unique slug that doesn't conflict with existing files.
        for (let i = 0; i < MAX_SLUG_RETRIES; i++) {
            slug = promptPrefix
                ? `${promptPrefix}-${generateShortWordSlug()}`
                : generateWordSlug();
            const filePath = join(plansDir, `${slug}.md`);
            if (!getFsImplementation().existsSync(filePath)) break;
        }
        cache.set(id, slug);
    }
    return slug;
}

// Mapping: g56→getPlanSlug, q→sessionId, K→promptSeed, _→id, z→cache, Y→slug,
//          h86→getPlanSlugCache, I8→getSessionId, aO→getPlansDirectory,
//          O→promptPrefix, MR4→slugifyPrompt, Bb8→generateWordSlug,
//          Zh6→generateShortWordSlug, iJz→MAX_SLUG_RETRIES, F56→join,
//          V8→getFsImplementation, $→filePath
```

### Algorithm

**What it does:** Returns a unique-per-session plan slug. Lazy: only generates on first call per session. Idempotent for subsequent calls. Tries to avoid filename collisions with existing plan files (up to 10 retries).

**How it works (step by step):**

1. **Cache lookup**: the slug cache is a session-id → slug Map (`getPlanSlugCache`). If we have a slug for this session, return it. Cache key is the session id, NOT the prompt — so subsequent calls within the same session return the same slug regardless of what prompt is passed. This makes the function safe to call from the attachment builder on every turn.
2. **Generation**: if no cached slug exists:
   - Compute `promptPrefix` via `slugifyPrompt(promptSeed)` if a seed is provided. Empty string otherwise.
   - Loop up to `MAX_SLUG_RETRIES = 10` times:
     - If we have a prefix: `${prefix}-${generateShortWordSlug()}` (e.g. `fix-auth-race-snug-otter`).
     - Else: `generateWordSlug()` (e.g. `gleaming-brewing-phoenix`).
     - Build the candidate file path. If it doesn't already exist, break.
   - Note: the retry only varies the random suffix. The `promptPrefix` is fixed for the iteration. On collision, the short-word suffix is regenerated.
3. **Cache write**: store `slug` for this session and return.

**Why this approach:**

- **Lazy + cached**: the slug must be stable for the lifetime of the session (so the plan file path doesn't change mid-conversation), but it must depend on the *first* prompt that triggers plan mode. Caching by session ID handles both: first call wins, subsequent calls are no-ops.
- **Crypto-random suffix**: prevents adversarial slug guessing. The random words come from `crypto.randomBytes`-backed `randomInt` (chunks.97.mjs:1544 `UJz`), not `Math.random`. This matters because plan files live in `~/.claude/plans/` and a guessable filename would let other users read another user's plan via path traversal in a shared filesystem.
- **Collision retry**: file-existence-check loop. Without this, a returning user with the same prompt prefix could overwrite a previous plan. The retry generates a new short-word suffix each time. After 10 retries, the loop terminates and uses the last candidate (regardless of collision) — extremely unlikely given the word space (~83 adjectives × ~243 nouns ≈ 20,169 short-word slugs per prefix).
- **No second loop** for `existsSync` after the cache write — the cache is the authoritative source for the session; if another session creates a file in the meantime, we still keep our slug.

**Edge cases:**

- `promptSeed === ""` (empty string after kebab): `slugifyPrompt` returns `""`, then `promptPrefix` falsy, so we fall through to `generateWordSlug()`. Empty-string handling is implicit because of the `K ? MR4(K) : ""` guard.
- `promptSeed === undefined`: same fall-through.
- `getSessionId()` undefined (no active session): `sessionId ?? getSessionId()` would return undefined, and `cache.get(undefined)` would set/read the `undefined` key. In practice this never happens because plan mode requires an active session.
- Restored sessions: `setPlanSlug(sessionId, slug)` (chunks.97.mjs:1604) is called by `copyPlanForResume` to inject a known slug into the cache. Subsequent `getPlanSlug` calls return that slug.

**Key insight:** The slug is *only* derived from the prompt the first time `getPlanSlug(sessionId, seed)` is called with a non-empty seed. Subsequent calls with different seeds are ignored. The first-call discipline is enforced by the cache, not by the call sites. This is why the **call site choice matters** — the slug is fixed at the first call that has access to the prompt.

The call site that fixes the slug is `buildPlanModeAttachment` (`HMY`) at chunks.155.mjs:1633:

```javascript
g56(I8(), z?.planSlugSeed ?? q ?? void 0);
```

where `z?.planSlugSeed` comes from the slash-command path (chunks.141.mjs:2249), and `q` is the bare prompt. This is the first place that has visibility into both the active session and the user's prompt.

## `slugifyPrompt` (`MR4`)

```javascript
// ============================================
// slugifyPrompt - Prompt → kebab-case prefix
// Location: chunks.97.mjs:1559-1565
// ============================================

// ORIGINAL (for source lookup):
function MR4(q, K = {}) {
    let { words: _ = 4, maxLen: z = 40 } = K;
    return q.split(/\s+/).slice(0, _).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, z).replace(/^-+|-+$/g, "")
}

// READABLE (for understanding):
function slugifyPrompt(prompt, options = {}) {
    const { words = 4, maxLen = 40 } = options;
    return prompt
        .split(/\s+/)         // split on whitespace
        .slice(0, words)      // take first N words (default 4)
        .join(' ')            // rejoin
        .toLowerCase()        // normalize case
        .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric with hyphens
        .slice(0, maxLen)     // cap length (default 40 chars)
        .replace(/^-+|-+$/g, ''); // strip leading/trailing hyphens
}

// Mapping: MR4→slugifyPrompt, q→prompt, K→options, _→words, z→maxLen
```

### Algorithm

**What it does:** Converts a free-form prompt into a kebab-case prefix suitable for filesystem use.

**Step-by-step on `"Fix the auth race condition"`:**

1. `split(/\s+/)` → `["Fix", "the", "auth", "race", "condition"]`
2. `slice(0, 4)` → `["Fix", "the", "auth", "race"]` (default 4 words)
3. `join(' ')` → `"Fix the auth race"`
4. `toLowerCase()` → `"fix the auth race"`
5. `replace(/[^a-z0-9]+/g, '-')` → `"fix-the-auth-race"`
6. `slice(0, 40)` → `"fix-the-auth-race"` (under 40 chars)
7. `replace(/^-+|-+$/g, '')` → `"fix-the-auth-race"` (no leading/trailing hyphens)

Result: `fix-the-auth-race`. Combined with a random short-word suffix: `fix-the-auth-race-snug-otter`.

**Why these defaults:**

- **`words: 4`**: balances information density with file-name brevity. 4 words is usually enough to identify what a plan is about ("add login validation", "fix payment race condition"). More risks unwieldy file names.
- **`maxLen: 40`**: hard cap to keep filesystem paths reasonable. With the `-${short-word-slug}` suffix (which can add ~20 chars), total filename stays under ~60 chars + `.md`.
- **Non-alphanumeric → hyphen**: handles punctuation (`?!.`), CJK characters, emoji, etc. Multiple consecutive non-alphanumeric chars collapse to a single hyphen due to the `+` quantifier.
- **Trim leading/trailing hyphens**: prompts starting/ending with punctuation (`"Refactor auth!"`) would produce `refactor-auth-` without this step. The trim ensures clean filenames.

**Edge cases:**

- All non-alphanumeric prompt (`"!!!"` or emoji-only): after all replacements, the result is `""`, which is falsy → `getPlanSlug` falls back to `generateWordSlug`.
- Very long single word (`"supercalifragilisticexpialidocious"`): truncates at 40 chars.
- Unicode (non-ASCII letters): `[^a-z0-9]+` strips them. A prompt entirely in Chinese would degenerate to all hyphens → empty after trim → fallback to random.

**Why not use a library like `slugify`?** Local implementation is small, has no external dependency, and is tuned for the exact tradeoffs (4-word truncation, 40-char cap). A library would be overkill.

## `generateWordSlug` (`Bb8`) — Legacy Random

```javascript
// ============================================
// generateWordSlug - 3-word random slug "adj-verb-noun"
// Location: chunks.97.mjs:1552-1557
// ============================================

// ORIGINAL (for source lookup):
function Bb8() {
    let q = R88(JR4),  // ADJECTIVES
        K = R88(gJz),  // VERBS
        _ = R88(XR4);  // NOUNS
    return `${q}-${K}-${_}`
}

// READABLE (for understanding):
function generateWordSlug() {
    const adjective = pickRandom(ADJECTIVES);
    const verb = pickRandom(VERBS);
    const noun = pickRandom(NOUNS);
    return `${adjective}-${verb}-${noun}`;
}

// Mapping: Bb8→generateWordSlug, R88→pickRandom, JR4→ADJECTIVES, gJz→VERBS, XR4→NOUNS
```

Produces slugs like `gleaming-brewing-phoenix`, `cosmic-pondering-lighthouse`.

The word lists are:
- **ADJECTIVES (`JR4`)** — 235 entries spanning whimsical (`abundant`, `cheerful`, `cozy`), magical (`enchanted`, `glittery`), programming (`atomic`, `recursive`, `memoized`). chunks.97.mjs:1580.
- **NOUNS (`XR4`)** — 320+ entries including nature (`aurora`, `meadow`, `nebula`), creatures (`alpaca`, `axolotl`, `phoenix`), fun objects (`acorn`, `cupcake`), and computer scientists (`abelson`, `dijkstra`, `turing`).
- **VERBS (`gJz`)** — 108 entries, present continuous form (`baking`, `brewing`, `pondering`, `roaming`).

Space: 235 × 108 × 320 ≈ **8.1 million unique slugs** — plenty for collision avoidance.

## `generateShortWordSlug` (`Zh6`) — v2.1.112-new

```javascript
// ============================================
// generateShortWordSlug - 2-word random suffix "adj-noun"
// Location: chunks.97.mjs:1567-1571
// ============================================

// ORIGINAL (for source lookup):
function Zh6() {
    let q = R88(JR4),
        K = R88(XR4);
    return `${q}-${K}`
}

// READABLE (for understanding):
function generateShortWordSlug() {
    const adjective = pickRandom(ADJECTIVES);
    const noun = pickRandom(NOUNS);
    return `${adjective}-${noun}`;
}

// Mapping: Zh6→generateShortWordSlug, R88→pickRandom, JR4→ADJECTIVES, XR4→NOUNS
```

Produces 2-word slugs like `snug-otter`, `golden-meadow`.

**Why split into a separate function?** The 3-word slug is the *full* slug when there is no prompt prefix. The 2-word slug is the *suffix* when there is a prefix. Different word counts because:
- Without prefix: 3 words for adequate randomness (8M space).
- With prefix: 2 words (235 × 320 ≈ 75K space) is plenty because the prefix already disambiguates; the suffix just needs to be unique within the prefix's plan-file namespace.

## `getPlansDirectory` (`aO`)

```javascript
// ============================================
// getPlansDirectory - Memoized resolver for the plans directory
// Location: chunks.97.mjs:1767-1782
// ============================================

// ORIGINAL (for source lookup):
aO = P1(function() {
    let _ = v7().plansDirectory,
        z;
    if (_) {
        let Y = b8(),
            A = lJz(Y, _);
        if (!A.startsWith(Y + nJz) && A !== Y) j6(Error(`plansDirectory must be within project root: ${_}`)), z = F56(A7(), "plans");
        else z = A
    } else z = F56(A7(), "plans");
    try {
        V8().mkdirSync(z)
    } catch (Y) {
        j6(Y)
    }
    return z
})

// READABLE (for understanding):
const getPlansDirectory = memoize(function getPlansDirectory() {
    const settingsDir = getInitialSettings().plansDirectory;
    let plansPath;
    if (settingsDir) {
        // Relative-to-project-root path from settings.json
        const cwd = getCwd();
        const resolved = resolve(cwd, settingsDir);
        // Path-traversal guard: must stay within project root
        if (!resolved.startsWith(cwd + sep) && resolved !== cwd) {
            logError(new Error(`plansDirectory must be within project root: ${settingsDir}`));
            plansPath = join(getClaudeConfigHomeDir(), 'plans');  // fallback
        } else {
            plansPath = resolved;
        }
    } else {
        // Default ~/.claude/plans
        plansPath = join(getClaudeConfigHomeDir(), 'plans');
    }
    // Ensure directory exists (mkdirSync with recursive:true is a no-op if it exists)
    try { getFsImplementation().mkdirSync(plansPath); } catch (error) { logError(error); }
    return plansPath;
});

// Mapping: aO→getPlansDirectory, P1→memoize, v7→getInitialSettings, b8→getCwd,
//          lJz→resolve, nJz→sep (path separator), F56→join, A7→getClaudeConfigHomeDir,
//          V8→getFsImplementation, j6→logError
```

**What it does:** Returns the path to the directory where plan files are stored. Memoized — runs once per process.

**Resolution order:**

1. **`settings.plansDirectory` set**: resolve relative to project cwd. Apply a path-traversal guard: the resolved path must start with `cwd + sep` (or equal cwd). If the user wrote `"plansDirectory": "../../etc"` and tried to escape the project, the guard catches it, logs an error, and falls back to `~/.claude/plans`.
2. **Not set**: default to `${getClaudeConfigHomeDir()}/plans`. `getClaudeConfigHomeDir` returns `~/.claude` (or the path overridden by `CLAUDE_CONFIG_DIR`).

Then `mkdirSync(plansPath)` ensures the directory exists. `recursive: true` is implicit through `getFsImplementation`'s mkdir behavior (the directory is created if missing; existing-directory errors are silently swallowed).

**Why memoize?** This function is called from render bodies (file-tool UI renderers, permission checks). Without memoization, every render would trigger a `mkdirSync` syscall. The memoization is critical for performance — there was a regression (issue #20005 mentioned in the v2.1.88 source comment) where this caused per-render syscalls. The fix was the `memoize` wrapper.

**Why not always use `~/.claude/plans`?** The `settings.plansDirectory` option lets users keep plan files inside their project (e.g. `.claude/plans/`) so they can be checked into version control. Some teams want plan history as part of the repo.

## `getPlanFilePath` (`eW`)

```javascript
// ============================================
// getPlanFilePath - Builds the plan file's absolute path
// Location: chunks.97.mjs:1612-1616
// ============================================

// ORIGINAL (for source lookup):
function eW(q) {
    let K = g56(I8());
    if (!q) return F56(aO(), `${K}.md`);
    return F56(aO(), `${K}-agent-${q}.md`)
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
    const planSlug = getPlanSlug(getSessionId());
    if (!agentId) {
        // Main conversation: simple {slug}.md
        return join(getPlansDirectory(), `${planSlug}.md`);
    }
    // Subagent: {slug}-agent-{agentId}.md
    return join(getPlansDirectory(), `${planSlug}-agent-${agentId}.md`);
}

// Mapping: eW→getPlanFilePath, q→agentId, K→planSlug, g56→getPlanSlug,
//          I8→getSessionId, F56→join, aO→getPlansDirectory
```

**Note**: `getPlanFilePath` calls `getPlanSlug(getSessionId())` *without* a prompt seed. This is fine because by the time `getPlanFilePath` is invoked (typically from `ExitPlanModeV2Tool.call` or render paths), the slug has already been seeded by `buildPlanModeAttachment`. The seed is `undefined` here, so `g56` short-circuits on the cache hit.

**Subagent variant:** `${slug}-agent-${agentId}.md`. Each subagent gets its own plan file so multiple subagents in plan mode don't trample each other's plans.

## `getPlan` (`lP`)

```javascript
// ============================================
// getPlan - Reads the plan file for the current session
// Location: chunks.97.mjs:1618-1628
// ============================================

// ORIGINAL (for source lookup):
function lP(q) {
    let K = eW(q);
    try {
        return V8().readFileSync(K, { encoding: "utf-8" })
    } catch (_) {
        if (t1(_)) return null;
        return j6(_), null
    }
}

// READABLE (for understanding):
function getPlan(agentId) {
    const filePath = getPlanFilePath(agentId);
    try {
        return getFsImplementation().readFileSync(filePath, { encoding: 'utf-8' });
    } catch (error) {
        if (isENOENT(error)) return null;
        logError(error);
        return null;
    }
}

// Mapping: lP→getPlan, q→agentId, K→filePath, eW→getPlanFilePath,
//          V8→getFsImplementation, t1→isENOENT, j6→logError
```

**Failure modes:**
- File doesn't exist (ENOENT): returns `null` silently. This is the "plan file not written yet" case.
- Any other read error: logs and returns `null`. Caller treats this same as ENOENT.

## Cache Lifecycle

The plan slug cache (`getPlanSlugCache` / `h86`) is a per-session Map. Key lifecycle events:

- **First call to `getPlanSlug(sessionId, seed)`**: generates slug, stores in cache.
- **`setPlanSlug(sessionId, slug)`**: forces a specific slug. Used by `copyPlanForResume` to restore a known slug when resuming a session.
- **`clearPlanSlug(sessionId)`** (`pb8`): removes one entry. Called on `/clear` to ensure fresh-plan-file behavior.
- **`clearAllPlanSlugs()`** (`PR4`): clears the whole cache. Also called on `/clear` to free sub-session slug entries (subagents).

## Resume vs. Fork Slug Semantics

Two related but different operations live in chunks.97 around the slug machinery:

- **`copyPlanForResume` (`Fb8`, chunks.97.mjs:1634)**: when resuming a session, scan the log for an existing slug and `setPlanSlug` it. Recover the plan file from a file snapshot or message history if it's missing. The resumed session **reuses** the original slug — same filename.
- **`copyPlanForFork` (`DR4`, chunks.97.mjs:1667)**: when forking, generate a **new** slug (via `getPlanSlug(targetSessionId)`, which has no seed at fork-time, so falls back to random). Copy the original plan file to the new slug's path. Prevents original and forked sessions from overwriting each other's plans.

## v2.1.88 → v2.1.112 Diff Summary

| Aspect | v2.1.88 | v2.1.112 | Status |
|--------|---------|----------|--------|
| `getPlanSlug` signature | `(sessionId?)` | `(sessionId?, promptSeed?)` | **Extended** |
| Slug shape (no seed) | `adj-verb-noun` (Bb8) | `adj-verb-noun` (Bb8) | Identical |
| Slug shape (with seed) | n/a | `${kebab(prompt)}-${adj}-${noun}` | **New** |
| `slugifyPrompt` (`MR4`) | absent | present (chunks.97:1559) | **New** |
| `generateShortWordSlug` (`Zh6`) | present | present | Identical |
| `MAX_SLUG_RETRIES` | 10 | 10 | Identical |
| Collision retry strategy | regenerate full slug | regenerate suffix only when prefix exists | **Refined** |
| `planSlugSeed` plumbing in slash-command | absent | present (chunks.141:2249) | **New** |
| `getPlanSlug` call site in `HMY` | `getPlanSlug(getSessionId())` | `getPlanSlug(getSessionId(), seed)` | **Extended** |
| `getPlansDirectory` (memoize, path-traversal guard) | yes | yes | Identical |
| Resume/fork semantics | yes | yes | Identical |

Note: the v2.1.88 source file at `/lyz/codespace/3rd/claude-code/src/utils/plans.ts` *also* declares `generateShortWordSlug` (`words.ts:796`), so the function existed in v2.1.88 but was unused in `plans.ts`. v2.1.112 wires it in. Likewise the word lists in `words.ts` are unchanged — only the consumer wired in the prompt prefix.

Strictly the user-facing change "Plan files now named after prompt" is delivered by **two co-changes**:
1. `MR4` (slugifyPrompt) — net new function.
2. `g56`'s second `promptSeed` parameter — extends the existing function.

Plus the plumbing through `chunks.141.mjs:2249` (`planSlugSeed`) and the `HMY` call site in `chunks.155.mjs:1633`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section
> - Unit-1 additions: [symbol_additions_unit_01.md](../00_overview/symbol_additions_unit_01.md)

See also:
- [implementation.md](./implementation.md) - how `getPlanSlug` is called from the attachment builder
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) - how the plan file is read at exit time
