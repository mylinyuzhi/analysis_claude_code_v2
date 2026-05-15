# Plan File Naming — Deep Deobfuscation (v2.1.142)

This document covers the **plan-slug generation pipeline**: how `${slug}.md` is produced for a session. The v2.1.111 changelog summarized the user-visible change ("Plan files now named after your prompt — e.g. `fix-auth-race-snug-otter.md` — instead of purely random words"), and v2.1.142 preserves that pipeline unchanged.

The v2.1.88 source is at `/lyz/codespace/3rd/claude-code/src/utils/plans.ts` (`getPlanSlug` at line 32) and `/lyz/codespace/3rd/claude-code/src/utils/words.ts` (`generateWordSlug`). The v2.1.142 implementation lives at `cli_inner_pretty.js:138975-139002` (word-list helpers) and `cli_inner_pretty.js:517632-517807` (plan-slug + plan-file utilities).

## Symbol Table

- `getPlanSlug` (obfuscated: `PDH`) - `cli_inner_pretty.js:517632-517647`
- `getPlanSlugForSession` (cache reader, obfuscated: `haH`) - `cli_inner_pretty.js:517648-517650`
- `setPlanSlug` (obfuscated: `tg6`) - `cli_inner_pretty.js:517651-517653`
- `clearAllPlanSlugs` (obfuscated: `u74`) - `cli_inner_pretty.js:517654-517656`
- `getPlanFilePath` (obfuscated: `v2`) - `cli_inner_pretty.js:517657-517661`
- `getPlan` (obfuscated: `HW`) - `cli_inner_pretty.js:517662-517670`
- `getSlugFromLog` (obfuscated: `Hy4`) - `cli_inner_pretty.js:517671-517673`
- `copyPlanForResume` (obfuscated: `RA8`) - `cli_inner_pretty.js:517674-517699`
- `copyPlanForFork` (obfuscated: `$y4`) - `cli_inner_pretty.js:517700-517713`
- `recoverPlanFromMessages` (obfuscated: `ox5`) - `cli_inner_pretty.js:517714-517741`
- `findFileSnapshotEntry` (obfuscated: `ax5`) - `cli_inner_pretty.js:517742-517749`
- `persistFileSnapshotIfRemote` (obfuscated: `u38`) - `cli_inner_pretty.js:517750-517772`
- `getPlansDirectory` (obfuscated: `SO`) - `cli_inner_pretty.js:517791-517807` (memoized via `L8`)
- `MAX_SLUG_RETRIES` (obfuscated: `rx5`) - `cli_inner_pretty.js:517776` (literal `10`)
- `generateWordSlug` (obfuscated: `Li$`) - `cli_inner_pretty.js:138981-138986` (adjective+verb+noun)
- `generateShortWordSlug` (obfuscated: `nmH`) - `cli_inner_pretty.js:138997-139001` (adjective+noun)
- `slugifyPrompt` (obfuscated: `Sq6`) - `cli_inner_pretty.js:138987-138996` (prompt→kebab)
- `randomInt` (obfuscated: `Qh1`) - `cli_inner_pretty.js:138975-138977` (crypto-randomized int)
- `pickRandom` (obfuscated: `k5$`) - `cli_inner_pretty.js:138978-138980`
- `ADJECTIVES` (obfuscated: `ZTK`) - `cli_inner_pretty.js:139005+` (frozen array)
- `NOUNS` (obfuscated: `GTK`) - `cli_inner_pretty.js:139002+` (frozen array)
- `VERBS` (obfuscated: `gh1`) - `cli_inner_pretty.js:139002+` (frozen array)
- `getPlanSlugCache` (obfuscated: `i_H`) - `cli_inner_pretty.js:3024-3026` returns the per-session Map
- `getSessionId` (obfuscated: `v$`)
- `planSlugSeed` (option key, propagated from slash-command path) - `cli_inner_pretty.js:353293`

## Pipeline Overview

```
        ┌────────────────────────────────────────────────────┐
        │  prompt (user text or slash-command planSlugSeed)  │
        └─────────────────────┬──────────────────────────────┘
                              │
                              ▼
                      slugifyPrompt(prompt)  // Sq6
                              │
                              ▼
                  "fix the auth race"  →  "fix-the-auth-race"
                              │
                              ▼
                ┌─────────────────────────────┐
                │  generateShortWordSlug()    │  nmH
                │  "snug-otter"               │
                └────────────┬────────────────┘
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
                     getPlanSlug(sessionId, /* no $ */)
                              │
                              ▼
                     generateWordSlug()  // Li$
                              │
                              ▼
                "gleaming-brewing-phoenix"
                              │
                              ▼  (same collision retry / cache flow)
                              done
```

## Core: `getPlanSlug` (PDH)

```javascript
// ============================================
// getPlanSlug - Lazy + memoized slug generator with prompt seeding
// Location: cli_inner_pretty.js:517632-517647
// ============================================

// ORIGINAL (for source lookup):
function PDH(H, $) {
  let q = H ?? v$(),
    K = i_H(),
    _ = K.get(q);
  if (!_) {
    let A = SO(),
      z = $ ? Sq6($) : "";
    for (let Y = 0; Y < rx5; Y++) {
      _ = z ? `${z}-${nmH()}` : Li$();
      let f = oB.join(A, `${_}.md`);
      if (!C$().existsSync(f)) break;
    }
    K.set(q, _);
  }
  return _;
}

// READABLE (for understanding):
function getPlanSlug(sessionIdMaybe, promptSeed) {
  const sessionId = sessionIdMaybe ?? getSessionId();
  const cache = getPlanSlugCache();
  let slug = cache.get(sessionId);
  if (!slug) {
    const plansDir = getPlansDirectory();
    const promptKebab = promptSeed ? slugifyPrompt(promptSeed) : '';
    for (let i = 0; i < MAX_SLUG_RETRIES; i++) {
      slug = promptKebab ? `${promptKebab}-${generateShortWordSlug()}` : generateWordSlug();
      const candidatePath = path.join(plansDir, `${slug}.md`);
      if (!getFsImplementation().existsSync(candidatePath)) break;
    }
    cache.set(sessionId, slug);
  }
  return slug;
}

// Mapping: PDH→getPlanSlug, H→sessionIdMaybe, $→promptSeed, q→sessionId, K→cache, _→slug,
//          A→plansDir, z→promptKebab, Y→i, f→candidatePath,
//          v$→getSessionId, i_H→getPlanSlugCache, SO→getPlansDirectory, Sq6→slugifyPrompt,
//          rx5→MAX_SLUG_RETRIES, nmH→generateShortWordSlug, Li$→generateWordSlug,
//          oB→path, C$→getFsImplementation
```

### Algorithm: Two-Arm Slug Generation

**What it does:** Produces a unique-on-disk slug, preferring a prompt-seeded form (`"${kebab}-${adjective}-${noun}"`) and falling back to a random three-word form (`"${adjective}-${verb}-${noun}"`).

**How it works:**

1. **Resolve session ID**: default to `getSessionId()` when not provided. The cache is keyed by session ID so each session gets its own slug.
2. **Cache lookup**: if the cache already has a slug for this session, return it. Idempotent for the session lifetime.
3. **Resolve plans directory**: `getPlansDirectory()` is memoized and returns `~/.claude/plans` by default (or the project-scoped path if configured).
4. **Compute the prompt-kebab prefix**: `slugifyPrompt(promptSeed)` if a seed is present, else empty.
5. **Retry loop**: up to `MAX_SLUG_RETRIES` (10) attempts to find a slug that doesn't collide with an existing file:
   - If a prompt kebab is available, append a short-word slug suffix (`"${kebab}-${adjective}-${noun}"`).
   - Else use the legacy three-word slug (`"${adjective}-${verb}-${noun}"`).
   - Check `existsSync(path)`. If the file doesn't exist, the slug is unique → break.
6. **Cache and return**: store the slug in the cache and return.

**Why this approach:**
- **Prompt-seeded slugs** make plan files human-discoverable. A user reviewing `~/.claude/plans/` sees `fix-auth-race-snug-otter.md` and immediately knows what session it belongs to. The legacy form `gleaming-brewing-phoenix.md` is opaque.
- **Short suffix (2 words instead of 3)** for the prompt-seeded form keeps the total slug length tractable (typically <60 chars).
- **Collision retry**: the suffix re-randomizes on each attempt, so a colliding `fix-auth-race-snug-otter.md` would retry with e.g. `fix-auth-race-bold-fox.md`.
- **Bounded retries (10)**: prevents infinite loops on extreme bad luck. With `~330 nouns × 235 adjectives = 77k` short slugs, 10 retries is enormously over-capable for any realistic collision density.
- **`existsSync` for collision check**: synchronous because the slug generation happens synchronously from the attachment build loop. The cost of a single stat call is negligible compared to the value of slug uniqueness.

**Key insight:** The prompt seed flows through *option propagation* (slash-command runner → attachment options → `d65` invocation → first `PDH(sessionId, seed)` call). This makes the slug deterministic-per-session-and-prompt but lazy: if the model decides not to enter plan mode, no slug is generated. The plan directory stays clean.

## Helper: `slugifyPrompt` (Sq6)

```javascript
// ============================================
// slugifyPrompt - Convert prompt text to kebab-case prefix
// Location: cli_inner_pretty.js:138987-138996
// ============================================

// ORIGINAL (for source lookup):
function Sq6(H, $ = {}) {
  let { words: q = 4, maxLen: K = 40 } = $;
  return H.split(/\s+/)
    .slice(0, q)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, K)
    .replace(/^-+|-+$/g, "");
}

// READABLE (for understanding):
function slugifyPrompt(text, { words = 4, maxLen = 40 } = {}) {
  return text.split(/\s+/)
    .slice(0, words)         // keep first N words
    .join(' ')
    .toLowerCase()           // case-insensitive
    .replace(/[^a-z0-9]+/g, '-')  // collapse non-alphanum to '-'
    .slice(0, maxLen)        // hard limit
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}

// Mapping: Sq6→slugifyPrompt, H→text, $→options, q→words, K→maxLen
```

### Algorithm: Prompt → Kebab

**What it does:** Converts arbitrary prompt text to a filesystem-safe kebab-case prefix.

**Step by step:**

1. **Word split + truncate**: `split(/\s+/).slice(0, 4)` keeps the first 4 whitespace-separated tokens. Why 4? Empirical: ~4 words capture the essence of a typical request without bloating the filename. "Add a logout button to the header" → "add a logout button".
2. **Lowercase**: case-insensitive for cross-platform compatibility (Windows file systems are typically case-insensitive).
3. **Collapse non-alphanum**: `[^a-z0-9]+ → '-'`. Strips quotes, parentheses, punctuation. "fix `auth` race-condition" → "fix-auth-race-condition".
4. **Hard length cap**: `slice(0, 40)`. Why 40? Combined with `${kebab}-${adjective}-${noun}` (~10-25 chars), total slug fits in ~65 chars. Most file systems support 255-char filenames, so 65 leaves plenty of room for the `.md` suffix and any future extension.
5. **Trim dashes**: `^-+|-+$ → ''`. Cleans cases where slicing or collapsing left a leading/trailing dash. "  fix it  " → "fix-it-" → "fix-it".

**Why these defaults:**
- 4 words + 40 chars + 2-word suffix: balances readability against filename length.
- Configurable via the second argument so callers (potentially the SDK) can tune for their needs.

**Edge cases:**
- All non-alphanum input: returns `""` (the regex collapses everything to dashes, then trimming removes them). Caller falls back to `generateWordSlug()`.
- Single-word prompt: returns just that word. "test" → "test".
- Length-40 boundary: if the truncation lands mid-dash, the trailing-dash trim cleans it up. "test-this-very-long-prompt-name-that-overflows" → "test-this-very-long-prompt-name-that-ove" (40 chars).

**Key insight:** `slugifyPrompt` is intentionally simple and pure. It doesn't lemmatize, doesn't filter stopwords, doesn't normalize. The output is predictable and easy to debug. Word-boundary detection is delegated to whitespace, which matches the model's prompt structure.

## Helpers: Word-Slug Generators

```javascript
// ============================================
// Word-slug generators - Random adjective/verb/noun assemblers
// Location: cli_inner_pretty.js:138975-139001
// ============================================

// ORIGINAL (for source lookup):
function Qh1(H) {
  return WTK.randomBytes(4).readUInt32BE(0) % H;
}
function k5$(H) {
  return H[Qh1(H.length)];
}
function Li$() {
  let H = k5$(ZTK), $ = k5$(gh1), q = k5$(GTK);
  return `${H}-${$}-${q}`;
}
function nmH() {
  let H = k5$(ZTK), $ = k5$(GTK);
  return `${H}-${$}`;
}

// READABLE (for understanding):
function randomInt(max) {
  // Crypto-backed for unpredictability
  return crypto.randomBytes(4).readUInt32BE(0) % max;
}
function pickRandom(array) {
  return array[randomInt(array.length)];
}
function generateWordSlug() {
  // adjective-verb-noun (3 words)
  const adj = pickRandom(ADJECTIVES);
  const verb = pickRandom(VERBS);
  const noun = pickRandom(NOUNS);
  return `${adj}-${verb}-${noun}`;
}
function generateShortWordSlug() {
  // adjective-noun (2 words)
  const adj = pickRandom(ADJECTIVES);
  const noun = pickRandom(NOUNS);
  return `${adj}-${noun}`;
}

// Mapping: Qh1→randomInt, k5$→pickRandom, Li$→generateWordSlug, nmH→generateShortWordSlug,
//          WTK→crypto, ZTK→ADJECTIVES, gh1→VERBS, GTK→NOUNS
```

### Why crypto-backed randomness?

`randomBytes(4).readUInt32BE(0)` gives a 32-bit unsigned int from cryptographic randomness. The modulo `% length` introduces a tiny bias for non-power-of-2 array sizes (235 adjectives, ~330 nouns), but the bias is statistically irrelevant for filename collisions.

**Why not `Math.random()`?**
- Predictability: `Math.random()` is seeded from the V8 PRNG. Two simultaneously-launched sessions could in principle produce the same slug. Crypto randomness eliminates this.
- Security-adjacent: the slug is the path component of a file. While not a security boundary, predictable slugs could in theory be exploited by an attacker who could create files in `~/.claude/plans/` (e.g. via a malicious package post-install script) to pre-occupy a session's slug and force a collision-retry exhaust.

## Helper: Plan File Path Resolution

```javascript
// ============================================
// getPlanFilePath - Compose slug into a full plan file path
// Location: cli_inner_pretty.js:517657-517661
// ============================================

// ORIGINAL (for source lookup):
function v2(H) {
  let $ = PDH(v$());
  if (!H) return oB.join(SO(), `${$}.md`);
  return oB.join(SO(), `${$}-agent-${H}.md`);
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
  const planSlug = getPlanSlug(getSessionId());
  if (!agentId) {
    return path.join(getPlansDirectory(), `${planSlug}.md`);
  }
  return path.join(getPlansDirectory(), `${planSlug}-agent-${agentId}.md`);
}

// Mapping: v2→getPlanFilePath, H→agentId, $→planSlug,
//          PDH→getPlanSlug, v$→getSessionId, oB→path, SO→getPlansDirectory
```

### Algorithm: Subagent Plan Files

**What it does:** Builds the on-disk path for a session's plan file. Subagents get a suffix to disambiguate.

**Why subagent paths?**
- A teammate subagent that enters plan mode (via `plan_mode_required`) needs its own plan file separate from the leader's. Without the `-agent-${agentId}` suffix, the teammate would overwrite the leader's plan (or vice versa) when they happen to have the same session ID.
- The suffix uses the agent ID (a stable per-spawn identifier) so reads/writes are consistent within a single teammate's lifecycle.
- Why share the base slug? So the user can see at a glance which leader's plans the teammate's plans correspond to: `fix-auth-race-snug-otter.md` (leader) and `fix-auth-race-snug-otter-agent-a-12ab34cd...md` (teammate).

## Helper: Plan Reading

```javascript
// ============================================
// getPlan - Read plan content from disk
// Location: cli_inner_pretty.js:517662-517670
// ============================================

// ORIGINAL (for source lookup):
function HW(H) {
  let $ = v2(H);
  try {
    return C$().readFileSync($, { encoding: "utf-8" });
  } catch (q) {
    if (f8(q)) return null;
    return (EH(q), null);
  }
}

// READABLE (for understanding):
function getPlan(agentId) {
  const planPath = getPlanFilePath(agentId);
  try {
    return getFsImplementation().readFileSync(planPath, { encoding: 'utf-8' });
  } catch (e) {
    if (isENOENT(e)) return null;
    logError(e);
    return null;
  }
}

// Mapping: HW→getPlan, H→agentId, $→planPath, q→e,
//          v2→getPlanFilePath, C$→getFsImplementation, f8→isENOENT, EH→logError
```

ENOENT → `null` (plan doesn't exist yet, no error). Any other error logs and returns null defensively.

## Helper: Plans Directory Resolution

```javascript
// ============================================
// getPlansDirectory - Memoized resolver for plan storage directory
// Location: cli_inner_pretty.js:517791-517807
// ============================================

// ORIGINAL (for source lookup):
SO = L8(function () {
  let q = m6().plansDirectory, K;
  if (q) {
    let _ = I$(), A = oB.resolve(_, q);
    if (!A.startsWith(_ + oB.sep) && A !== _)
      (N(`plansDirectory must be within project root: ${q}`, { level: "error" }),
       (K = oB.join(b8(), "plans")));
    else K = A;
  } else K = oB.join(b8(), "plans");
  try { C$().mkdirSync(K); }
  catch (_) { N(`Failed to create plans directory ${K}: ${_}`, { level: "error" }); }
  return K;
});

// READABLE (for understanding):
const getPlansDirectory = memoize(function getPlansDirectory() {
  const settingsDir = getInitialSettings().plansDirectory;
  let plansPath;
  if (settingsDir) {
    const cwd = getCwd();
    const resolved = path.resolve(cwd, settingsDir);
    // Path-traversal guard: settings.plansDirectory must NOT escape project root
    if (!resolved.startsWith(cwd + path.sep) && resolved !== cwd) {
      logError(`plansDirectory must be within project root: ${settingsDir}`);
      plansPath = path.join(getClaudeConfigHomeDir(), 'plans');  // fallback
    } else {
      plansPath = resolved;
    }
  } else {
    plansPath = path.join(getClaudeConfigHomeDir(), 'plans');  // default ~/.claude/plans
  }
  // Ensure directory exists (mkdirSync is a no-op if it exists w/ recursive)
  try {
    getFsImplementation().mkdirSync(plansPath);
  } catch (e) {
    logError(`Failed to create plans directory ${plansPath}: ${e}`);
  }
  return plansPath;
});

// Mapping: SO→getPlansDirectory, L8→memoize, m6→getInitialSettings, I$→getCwd,
//          oB→path, C$→getFsImplementation, b8→getClaudeConfigHomeDir, N→logError
```

### Algorithm: Path Traversal Defense

**What it does:** Guards `settings.plansDirectory` against escaping the project root.

**Why:** A malicious `.claude/settings.local.json` with `plansDirectory: "../../../etc/cron.d"` would otherwise direct plan-file writes to system directories. The check `resolved.startsWith(cwd + sep) || resolved === cwd` ensures the resolved path is a descendant of (or equal to) the project root.

**Why memoize?** Inputs (initial settings + cwd) are fixed at startup. Without memoization, every render of a FileRead/FileEdit/FileWrite tool UI triggers a `mkdirSync` syscall (this regressed in upstream PR #20005 and was fixed by memoization).

**Cache invalidation:** `SO.cache.clear?.()` is called by `hg4` (cwd change handler, `cli_inner_pretty.js:564274`) and by some session-restore paths. After a cwd change, the resolved path may have changed (different project root), so the cache must be cleared.

## Helper: Plan-Slug Cache Manipulation

```javascript
// ============================================
// Plan-slug cache helpers - Per-session slug Map operations
// Location: cli_inner_pretty.js:517648-517656
// ============================================

// ORIGINAL (for source lookup):
function haH(H) {
  return i_H().get(H ?? v$());
}
function tg6(H, $) {
  i_H().set(H, $);
}
function u74() {
  i_H().clear();
}

// READABLE (for understanding):
function getPlanSlugForSession(sessionIdMaybe) {
  return getPlanSlugCache().get(sessionIdMaybe ?? getSessionId());
}
function setPlanSlug(sessionId, slug) {
  getPlanSlugCache().set(sessionId, slug);
}
function clearAllPlanSlugs() {
  getPlanSlugCache().clear();
}

// Mapping: haH→getPlanSlugForSession, tg6→setPlanSlug, u74→clearAllPlanSlugs,
//          i_H→getPlanSlugCache, v$→getSessionId
```

### When does each get called?

- `getPlanSlugForSession(haH)`: Used by `/plan` command (`Wv5` at `cli_inner_pretty.js:483839`) to check whether a slug has been fixed for this session yet — without forcing creation. The `/plan` command uses this to differentiate "already in plan mode, plan file exists" from "in plan mode but no plan written yet".
- `setPlanSlug(tg6)`: Used by `copyPlanForResume` (`RA8`) and `copyPlanForFork` (`$y4`) when resuming a session. The resumed session's slug must match the original session's slug so the plan file is found at the same path.
- `clearAllPlanSlugs(u74)`: Used by `/clear` and session reset paths. Frees all cached slugs (including sub-session entries from past Agent tool spawns).

## Plan Recovery: copyPlanForResume / Fork

```javascript
// ============================================
// copyPlanForResume - Restore plan slug + content on session resume
// Location: cli_inner_pretty.js:517674-517699
// ============================================

// ORIGINAL (for source lookup):
async function RA8(H, $) {
  let q = Hy4(H);
  if (!q) return !1;
  let K = $ ?? v$();
  tg6(K, q);
  let _ = oB.join(SO(), `${q}.md`);
  try {
    return (await C$().readFile(_, { encoding: "utf-8" }), !0);
  } catch (A) {
    if (!f8(A)) return (EH(A), !1);
    if ($r$() === null) return !1;
    N(`Plan file missing during resume: ${_}. Attempting recovery.`);
    let z = ax5(H.messages, "plan"), Y = null;
    if (z && z.content.length > 0)
      ((Y = z.content), N(`Plan recovered from file snapshot, ${Y.length} chars`, { level: "info" }));
    else if (((Y = ox5(H)), Y)) N(`Plan recovered from message history, ${Y.length} chars`, { level: "info" });
    if (Y)
      try {
        return (await _W8.writeFile(_, Y, { encoding: "utf-8" }), !0);
      } catch (f) {
        return (EH(f), !1);
      }
    return (N("Plan file recovery failed: no file snapshot or plan content found in message history"), !1);
  }
}

// READABLE (for understanding):
async function copyPlanForResume(log, targetSessionId) {
  const slug = getSlugFromLog(log);
  if (!slug) return false;

  const sessionId = targetSessionId ?? getSessionId();
  setPlanSlug(sessionId, slug);

  const planPath = path.join(getPlansDirectory(), `${slug}.md`);
  try {
    await getFsImplementation().readFile(planPath, { encoding: 'utf-8' });
    return true;  // plan file exists; nothing more to do
  } catch (e) {
    if (!isENOENT(e)) {
      logError(e);
      return false;
    }
    // ENOENT path: try to recover from transcript
    if (getEnvironmentKind() === null) return false;  // local-only, no recovery
    logForDebugging(`Plan file missing during resume: ${planPath}. Attempting recovery.`);

    // Recovery source 1: file-snapshot system message (most recent, written incrementally)
    const snapshotPlan = findFileSnapshotEntry(log.messages, 'plan');
    let recovered = null;
    if (snapshotPlan && snapshotPlan.content.length > 0) {
      recovered = snapshotPlan.content;
      logForDebugging(`Plan recovered from file snapshot, ${recovered.length} chars`, { level: 'info' });
    } else {
      // Recovery source 2: search message history (tool_use input, planContent, plan_file_reference)
      recovered = recoverPlanFromMessages(log);
      if (recovered) {
        logForDebugging(`Plan recovered from message history, ${recovered.length} chars`, { level: 'info' });
      }
    }
    if (recovered) {
      try {
        await fsPromises.writeFile(planPath, recovered, { encoding: 'utf-8' });
        return true;
      } catch (writeError) {
        logError(writeError);
        return false;
      }
    }
    logForDebugging('Plan file recovery failed: no file snapshot or plan content found in message history');
    return false;
  }
}

// Mapping: RA8→copyPlanForResume, H→log, $→targetSessionId, q→slug, K→sessionId, _→planPath,
//          z→snapshotPlan, Y→recovered, Hy4→getSlugFromLog, tg6→setPlanSlug,
//          ax5→findFileSnapshotEntry, ox5→recoverPlanFromMessages, $r$→getEnvironmentKind,
//          EH→logError, N→logForDebugging, f8→isENOENT, C$→getFsImplementation
```

For the full recovery path see [remote_sessions.md](./remote_sessions.md) §Container Restart Resilience.

## Constants

- `MAX_SLUG_RETRIES` = `10` (`cli_inner_pretty.js:517776`). Empirically over-capable: with ~330 nouns × 235 adjectives × 108 verbs, collision probability per attempt is < 1 in 8 million for a freshly created plans directory.
- `ADJECTIVES`, `NOUNS`, `VERBS` are frozen arrays defined inline at `cli_inner_pretty.js:139002+`. The arrays start with common short words (`abundant`, `ancient`, `bright`...) and span ~108 (VERBS) to ~330 (NOUNS) entries.

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| `getPlanSlug` signature | `(sessionId?, promptSeed?)` | Same | Identical |
| Cache (per-session Map) | `getPlanSlugCache()` returns Map | Same | Identical |
| `slugifyPrompt` (4 words, 40 chars) | added in v2.1.111 | Present | Identical |
| `generateShortWordSlug` | added in v2.1.111 | Present | Identical |
| `MAX_SLUG_RETRIES` | 10 | 10 | Identical |
| Crypto-backed randomness | `crypto.randomBytes` | Same | Identical |
| Subagent suffix `-agent-${agentId}` | yes | yes | Identical |
| Path-traversal defense in `getPlansDirectory` | yes | yes | Identical |
| `mkdirSync` on first access | yes | yes | Identical |
| Plan recovery from transcript | yes (snapshot + message scan) | Same | Identical |
| ADJECTIVES / NOUNS / VERBS arrays | inline | inline | Identical |

The plan-naming pipeline is one of the cleanest v2.1.112 → v2.1.142 carryovers. No behavioral changes were made.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) - all new symbol mappings discovered in this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Plan Mode section

See also:
- [implementation.md](./implementation.md) - end-to-end lifecycle (slug-fix call site in `d65`)
- [remote_sessions.md](./remote_sessions.md) - container-restart plan recovery
- [enter_plan_mode_tool.md](./enter_plan_mode_tool.md) - where the slug is first surfaced (via attachment)
