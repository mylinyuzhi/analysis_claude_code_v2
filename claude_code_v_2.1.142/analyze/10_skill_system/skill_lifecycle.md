# Skill Lifecycle: Discovery, Watching, Activation, Compaction Carry-forward

> Companion to [skill_frontmatter.md](./skill_frontmatter.md), [skill_substitutions.md](./skill_substitutions.md), [skill_listing_budget.md](./skill_listing_budget.md). This document covers the **time dimension**: where skills come from, how the runtime keeps them in sync with the filesystem, when their content enters the conversation, and how that content survives auto-compaction.

---

## TL;DR

| Phase | Where | What happens |
|-------|-------|--------------|
| **Discovery** | `un5` / `_I6` loader (cli_inner_pretty.js:406550+) | Six sources scanned: bundled binary, `~/.claude/skills/`, `.claude/skills/` (walk up to repo root), `--add-dir/.claude/skills/`, plugin `skills/`, MCP `prompts/list` |
| **Conditional gating** | `paths` frontmatter | Skills with `paths:` glob list are held in `hX.conditionalSkills` until a touched file matches; then promoted to active set |
| **Watching** | `xn5` chokidar wrapper (cli_inner_pretty.js:557919-558000) | Watches all `.claude/skills/` + `.claude/commands/` dirs with `depth: 2`. Debounces, fingerprints, fires reload + cache invalidation + `MrH` re-announcement |
| **Activation** | `getPromptForCommand` (cli_inner_pretty.js:406257) | Body is rendered once through the 5-pass substitution pipeline (see [skill_substitutions.md](./skill_substitutions.md)) |
| **Injection** | Skill tool / slash-command dispatcher | Rendered text becomes a single message in conversation history; stays for rest of session |
| **Carry-forward** | `iq8` post-compaction reattacher (cli_inner_pretty.js:408125-408139) | After auto-compaction, most-recent-first, **5000 tokens per skill**, **25000 tokens combined budget** |

---

## Phase 1 — Discovery

Skills come from six independent sources, merged into one list by the unified loader. The list is memoised behind `KI6.cache` / `gZ.cache` and invalidated by `O4H()` ([skill_overrides.md](./skill_overrides.md#5-the-skills-dialog-and-override-values)) and by the file watcher.

### The six sources

| Source | Path / origin | Loader | Identifier |
|--------|---------------|--------|-----------|
| **Bundled** | Inside the binary (extracted on demand to `<userDataDir>/bundled-skills/<name>/`) | `zG4()` returns `[...AG4]` (cli_inner_pretty.js:494264) | `source: "bundled"`, `loadedFrom: "bundled"` |
| **User** | `~/.claude/skills/<dirname>/SKILL.md` | `WP$("userSettings", "skills")` (cli_inner_pretty.js:406114-406127) | `source: "userSettings"`, `loadedFrom: "skills"` |
| **Project** | `.claude/skills/<dirname>/SKILL.md` (walks up to repo root) | Same plus `.startsWith(cwd)` walk | `source: "projectSettings"`, `loadedFrom: "skills"` |
| **Project (deprecated)** | `.claude/commands/<file>.md` | Legacy file-based variant | `loadedFrom: "commands_DEPRECATED"` |
| **Plugin** | `<plugin-root>/skills/<dirname>/SKILL.md` **or** plugin-root `SKILL.md` (v2.1.142, see [root_skill_md.md](./root_skill_md.md)) | Plugin manifest `skills:` entries + `Dh6` directory scan + `U88` fallback | `source: "plugin"`, `loadedFrom: "plugin"` |
| **MCP** | Remote MCP server's `prompts/list` response | MCP client converts each `Prompt` record into a skill (`n9H` at cli_inner_pretty.js:414975-414980; MCP protocol method declaration at cli_inner_pretty.js:24717, 32178) | `source: "mcp"`, `loadedFrom: undefined`. **Internal name format: `mcp__<server>__<command>` (cli_inner_pretty.js:414989)**. The `<server>:<command>` form is the **display name** returned by `userFacingName()`, not the internal `name` field. |

The walk-up rule for project skills: starting from cwd, every parent directory up to the repo root is checked for `.claude/skills/`. So running Claude in `repo/packages/frontend/` picks up skills from both `packages/frontend/.claude/skills/` and `repo/.claude/skills/`.

For **subdirectory discovery** (the model touches a file in `packages/frontend/`), additional `.claude/skills/` directories are loaded on demand via the dynamic-skills mechanism described in **Phase 2** below.

### `--add-dir` skills exception

`--add-dir <path>` grants file access, not configuration discovery. **Skills are the lone exception**: `<path>/.claude/skills/` is loaded automatically. This is wired through the `additional` array merge in the loader (cli_inner_pretty.js:406646: `additional: ${M.flat().length}`).

Other configuration (subagents, output styles, commands directly under `.claude/commands/`) is **not** loaded from `--add-dir` paths. The `permissions.additionalDirectories` settings key (a different mechanism than `--add-dir`) does not load skills.

### Deduplication and conditional gating

After all sources are merged, the loader runs (cli_inner_pretty.js:406630-406649):

1. **Deduplicate by `name + source`** — `Deduplicated N skills (same file)` log fires when collisions are dropped.
2. **Partition into conditional vs unconditional**:
   ```javascript
   for (let W of X)
     if (W.type === "prompt" && W.paths && W.paths.length > 0 && !hX.activatedConditionalSkillNames.has(W.name))
       Z.push(W);                       // conditional — held back
     else
       P.push(W);                       // unconditional — active immediately
   for (let W of Z) hX.conditionalSkills.set(W.name, W);
   ```
3. **Log** the final count grouped by source: `Loaded N unique skills (X unconditional, Y conditional, managed: A, user: B, project: C, additional: D, legacy commands: E)`.

---

## Phase 2 — Conditional skills (`paths` frontmatter)

```javascript
// ============================================
// activateConditionalSkillsForTouchedFiles - The paths-glob activator
// Location: cli_inner_pretty.js:406510-406538
// ============================================

// ORIGINAL (for source lookup):
function snH(H, $) {
  if (hX.conditionalSkills.size === 0) return [];
  let q = [];
  for (let [K, _] of hX.conditionalSkills) {
    if (_.type !== "prompt" || !_.paths || _.paths.length === 0) continue;
    let A = he7.default().add(_.paths);                      // ignore-style matcher
    for (let z of H) {
      let Y = qY.isAbsolute(z) ? qY.relative($, z) : z;
      if (!Y || Y.startsWith("..") || qY.isAbsolute(Y)) continue;
      if (A.ignores(Y)) {                                    // pattern match
        hX.dynamicSkills.set(K, _);                          // promote
        hX.conditionalSkills.delete(K);                       // remove from holding
        hX.activatedConditionalSkillNames.add(K);             // mark sticky
        q.push(K);
        N(`[skills] Activated conditional skill '${K}' (matched path: ${Y})`);
        break;
      }
    }
  }
  if (q.length > 0)
    d("tengu_dynamic_skills_changed", {
      source: "conditional_paths",
      previousCount: hX.dynamicSkills.size - q.length,
      newCount: hX.dynamicSkills.size,
      addedCount: q.length,
      directoryCount: 0,
    });
  AI6.emit();
  return q;
}

// READABLE (for understanding):
function activateConditionalSkillsForTouchedFiles(touchedFiles, cwd) {
  if (conditionalSkills.size === 0) return [];
  const activated = [];
  for (const [name, skill] of conditionalSkills) {
    if (skill.type !== "prompt" || !skill.paths?.length) continue;
    const matcher = ignore().add(skill.paths);     // gitignore-style globs
    for (const filePath of touchedFiles) {
      const rel = path.isAbsolute(filePath) ? path.relative(cwd, filePath) : filePath;
      if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) continue;
      if (matcher.ignores(rel)) {
        dynamicSkills.set(name, skill);
        conditionalSkills.delete(name);
        activatedConditionalSkillNames.add(name);     // STICKY — stays active for session
        activated.push(name);
        emitTelemetry("tengu_dynamic_skills_changed", { ... });
        break;
      }
    }
  }
  return activated;
}

// Mapping: snH -> activateConditionalSkillsForTouchedFiles,
//          hX -> skillRegistry, he7 -> ignore, qY -> path, $ -> cwd, H -> touchedFiles
```

### Key behaviors

- **Pattern syntax**: gitignore-style globs (via the `ignore` npm package). `src/**/*.tsx`, `!docs/**`, `Makefile`, etc.
- **Sticky activation**: once a conditional skill activates, it joins `activatedConditionalSkillNames` and stays in `dynamicSkills` for the rest of the session. A second touched file doesn't re-trigger or de-activate.
- **Empty / `**`-only `paths` are no-ops**: `Z45` (cli_inner_pretty.js:406150-406158) strips `/**` suffixes and filters empty/`**`-only patterns. A skill with effectively no paths is treated as unconditional.
- **Triggered by file-touch events**: the integration point is wherever the model performs a file operation (Read/Edit/Write/Glob) — that path is fed into `snH(touchedFiles, cwd)`.
- **Reset on cache flush**: `xe7` (cli_inner_pretty.js:406543-406547) clears both maps and the `activatedConditionalSkillNames` set together. Triggered by `dHH()` on watcher-detected change.

---

## Phase 3 — Live change detection (chokidar watcher)

```javascript
// ============================================
// setupSkillFileWatcher - Chokidar wrapper with debounced fingerprint reload
// Location: cli_inner_pretty.js:557919-558000
// ============================================

function xn5(H) {
  let stabilityThreshold = H?.stabilityThreshold ?? hn5;
  let pollInterval = H?.pollInterval ?? In5;
  let reloadDebounce = H?.reloadDebounce ?? Sn5;
  let chokidarInterval = H?.chokidarInterval ?? Rn5;
  let getFingerprint = H?.getFingerprint ?? bn5;
  // ...
  async function initialize() {
    if (initialized || disposed) return;
    initialized = true;
    if (!disposeReloadHook)
      disposeReloadHook = scheduleReloadHook(() => {
        O4H();           // clear listing caches
        emitter.emit();
      });
    const dirs = await getWatchedDirs();
    if (dirs.length === 0) return;
    fingerprint = await getFingerprint().catch(() => null);
    N(`Watching for changes in skill/command directories: ${dirs.join(", ")}...`);
    watcher = chokidar.watch(dirs, {
      persistent: true,
      ignoreInitial: true,
      depth: 2,                                          // SKILL.md is at <dir>/<name>/SKILL.md → depth 2
      awaitWriteFinish: { stabilityThreshold, pollInterval },
      ignored: (path, stats) => {
        if (stats && !stats.isFile() && !stats.isDirectory() && !stats.isSymbolicLink()) return true;
        return path.split(/[/\\]/).some((s) => s === ".git");
      },
      ignorePermissionErrors: true,
      usePolling: Cn5,
      interval: chokidarInterval,
      atomic: true,
    });
    watcher.on("add", onChange);
    watcher.on("change", onChange);
    watcher.on("unlink", onChange);
    watcher.on("error", (e) => N(`[skills] watcher error: ${ZH(e)}`, { level: "warn" }));
    await new Promise((r) => watcher.once("ready", () => r()));
    cleanup = CK(dispose);
  }

  function onChange(path) {
    N(`Detected skill change: ${path}`);
    d("tengu_skill_file_changed", { source: "chokidar" });
    schedule(path);
  }

  function schedule(path) {
    pending.add(path);
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      debounceTimer = null;
      const paths = [...pending];
      pending.clear();
      const blockResult = await runConfigChangeHook("skills", paths[0]);
      if (hookBlocked(blockResult)) {
        N(`ConfigChange hook blocked skill reload (${paths.length} paths)`);
        return;
      }
      CM8();                                              // dispose stale caches
      dHH();                                              // full skill reload (incl. conditional reset)
      const newFingerprint = await getFingerprint().catch(() => null);
      if (fingerprint !== null && newFingerprint !== null && newFingerprint === fingerprint) {
        N(`[skills] ${paths.length} fs event(s) but skill list unchanged — skipping re-announce`);
      } else {
        fingerprint = newFingerprint;
        MrH();                                            // re-announce skill change to model
      }
      emitter.emit();
    }, reloadDebounce);
  }
  // ...
}
```

### Watcher details

| Aspect | Value |
|--------|-------|
| Library | `chokidar` (cli_inner_pretty.js:144674) |
| Watched directories | All resolved `.claude/skills/` and `.claude/commands/` for userSettings + projectSettings tiers (`un5` at cli_inner_pretty.js:558002+) |
| Depth | 2 — enough to see `<watched-dir>/<skill-name>/SKILL.md` |
| Events | `add`, `change`, `unlink` (deletion) |
| Stability check | `awaitWriteFinish` waits for the file to stop changing before firing (`stabilityThreshold` ms, polling at `pollInterval` ms) |
| Reload debounce | `reloadDebounce` ms — collapses bursts of edits into one reload |
| Polling fallback | `usePolling = Cn5` (true on systems where native fs events are unreliable, e.g. WSL2, NFS) |
| Atomic writes | `atomic: true` — handles editors that write via temp-file + rename |
| `.git` skip | The `ignored` callback skips any path with a `.git` segment |

### Fingerprint dedup

`bn5` (`getFingerprint`) computes a hash over `name\x00description\x00whenToUse` for every loaded skill, sorted and joined. After a file event triggers reload, if the fingerprint is unchanged the announce step is skipped — the watcher saw a touch but the skill set didn't actually change (e.g. a `git stash` that swapped a file content for an identical one).

### ConfigChange hook can block reload

Before reload runs, a `ConfigChange` hook fires with `(surface="skills", path)`. If it returns a block result, the reload is cancelled and the in-memory skill set stays frozen. This is the operator's last-mile gate to prevent untrusted skill changes from taking effect mid-session.

### Cold-start gotcha

The watcher only watches directories that **existed at session start**. Creating a brand-new top-level skills directory (e.g. `mkdir ~/.claude/skills` on a machine that never had one) requires restarting Claude Code so the watcher can pick it up. This is a single-line behavior in `un5`: directories are stat'd up front, so non-existent ones are silently skipped.

---

## Phase 4 — Activation and injection

When the user types `/<name>` or the model invokes via the Skill tool:

1. **Gate chain** runs (4 gates — see [skill_frontmatter.md#the-skill-tools-four-gates-in-order](./skill_frontmatter.md))
2. **Permission flow** prompts for any `allowed-tools` not already approved
3. **Render** via `getPromptForCommand` — the 5-pass pipeline ([skill_substitutions.md](./skill_substitutions.md))
4. **Inject** the rendered text as a single user message into conversation history
5. **Hooks fire** if `hooks` was declared in frontmatter (registered for the scope of this skill's effect)
6. **Optionally fork** if `context: fork` — the skill body becomes the subagent's prompt instead of going into the main loop

### Key invariant: the body is rendered ONCE

Crucially, `getPromptForCommand` is called at invocation time, **not** on every model turn. The rendered text — args expanded, shell commands run, variables substituted — is committed to history as a single user message. From that point on it is treated like any other message:

- Subsequent turns do **not** re-run shell commands or re-substitute variables.
- The skill body is preserved verbatim as it was when invoked.
- If the file is later edited, the in-history copy is stale — but that's intentional; consistency within a turn is more important.

This is what the doc means by "write standing instructions, not one-time steps." The body persists across all later turns.

---

## Phase 5 — Carry-forward through compaction

Auto-compaction ([07_compact](../07_compact)) summarises old conversation segments to recover context budget. Skills invoked before the compaction would normally disappear — except for a special carry-forward path:

```javascript
// ============================================
// buildInvokedSkillsBlock - Post-compaction skill carry-forward
// Location: cli_inner_pretty.js:408125-408139
// ============================================

// ORIGINAL (for source lookup):
function iq8(H) {
  let $ = Uv8(H);                                            // gather invoked-skill records
  if ($.size === 0) return null;
  let q = 0,
    K = Array.from($.values())
      .sort((_, A) => A.invokedAt - _.invokedAt)             // MRU first
      .map((_) => ({ name: _.skillName, path: _.skillPath, content: c45(_.content, U45) }))
      .filter((_) => {
        let A = NA(_.content);
        if (q + A > F45) return !1;                          // exceed budget → drop
        return ((q += A), !0);
      });
  if (K.length === 0) return null;
  return fK({ type: "invoked_skills", skills: K });
}

function c45(H, $) {                                          // per-skill truncator
  if (NA(H) <= $) return H;
  let q = $ * 4 - ee7.length;                                 // 4 chars per token estimate
  return H.slice(0, q) + ee7;
}

// READABLE (for understanding):
const PER_SKILL_TOKEN_CAP = 5000;        // U45
const COMBINED_TOKEN_BUDGET = 25000;     // F45
const TRUNCATION_SUFFIX = "\n\n[... skill content truncated for compaction; use Read on the skill path if you need the full text]";  // ee7

function buildInvokedSkillsBlock(ctx) {
  const invocations = collectInvokedSkillRecords(ctx);
  if (invocations.size === 0) return null;
  let cumulative = 0;
  const carried = [...invocations.values()]
    .sort((a, b) => b.invokedAt - a.invokedAt)              // MRU FIRST
    .map((rec) => ({
      name: rec.skillName,
      path: rec.skillPath,
      content: truncateToTokens(rec.content, PER_SKILL_TOKEN_CAP),
    }))
    .filter((rec) => {
      const tokens = estimateTokens(rec.content);
      if (cumulative + tokens > COMBINED_TOKEN_BUDGET) return false;
      cumulative += tokens;
      return true;
    });
  if (carried.length === 0) return null;
  return makeAttachment({ type: "invoked_skills", skills: carried });
}

// Mapping: iq8 -> buildInvokedSkillsBlock, U45 -> PER_SKILL_TOKEN_CAP,
//          F45 -> COMBINED_TOKEN_BUDGET, ee7 -> TRUNCATION_SUFFIX,
//          c45 -> truncateToTokens, NA -> estimateTokens, Uv8 -> collectInvokedSkillRecords
```

### Budget invariants

| Constant | Value | Effect |
|----------|-------|--------|
| `U45` (per-skill cap) | **5000 tokens** | Each skill's body sliced to first 5000 tokens (≈20000 chars) plus the truncation suffix |
| `F45` (combined budget) | **25000 tokens** | Cumulative cap across all carried skills |
| `ee7` (truncation suffix) | `"\n\n[... skill content truncated for compaction; use Read on the skill path if you need the full text]"` | Tells the model how to retrieve the full body if needed |

### Fill order: MRU wins

Skills are sorted by `invokedAt` descending. The reattacher fills the budget from the most-recently-invoked downward and **drops** any skill that wouldn't fit. So if a session invokes many skills, the oldest ones disappear entirely after compaction — the operator-friendly framing is "the skill you used most recently survives; the skill you used 30 turns ago might not."

This is intentional: the most recent skill is most likely to still be guiding the current task.

### Re-attaching to the post-summary conversation

The `invoked_skills` attachment is inserted by the post-compaction reattach logic — see `cli_inner_pretty.js:425037` for the framing message that prefixes the carried block:

> The following skills were invoked EARLIER in this session (before the conversation was compacted), not on the current turn. They are shown here for context only so you remain aware of their guidelines.

This explicit framing prevents the model from treating carried skill content as a fresh invocation (e.g. re-running setup steps that should only run once per invocation).

### Re-invoke to restore full content

If a skill was truncated (or dropped entirely) and the user wants its full body back, the simplest path is to re-invoke it — `/<name>` will render again at full size. The truncation suffix's instruction to `Read the skill path` is the model-facing equivalent.

---

## Skill caches and invalidation

Multiple memoised caches make skill listing cheap:

| Cache | Backing function | Cleared by |
|-------|------------------|------------|
| `TE4.cache` | `getAllCommands` (per-tier merged commands+skills) | `O4H()` |
| `gZ.cache` | wrapper around `R9()` (skill enumeration) | `O4H()` |
| `GTH.cache` | (formatted listing) | `O4H()` |
| `KI6.cache` | (parsed skill records) | `dHH()` / watcher reload |
| `Wm.cache` | (similar) | `dHH()` |

`O4H()` (cli_inner_pretty.js:513823) clears the listing-side caches; `dHH()` clears everything plus the conditional-skills state (`xe7`).

After the `/skills` dialog saves new overrides, `O4H()` runs — see [skills_dialog_ui.md](./skills_dialog_ui.md#save-algorithm-c-at-cli_inner_prettyjs476991-477016). After the file watcher detects a change, `dHH()` runs — see Phase 3 above. Together they ensure that any external mutation to skill state is reflected on the next listing pull.

---

## Cross-references

- [skill_frontmatter.md](./skill_frontmatter.md) — what each field of a parsed skill record means
- [skill_substitutions.md](./skill_substitutions.md) — Phase 4's `getPromptForCommand` render pipeline
- [skill_listing_budget.md](./skill_listing_budget.md) — how the merged skill list is *sent* to the model (the listing-time budget, distinct from compaction carry-forward)
- [skills_dialog_ui.md](./skills_dialog_ui.md) — `/skills` UI also triggers `O4H()` cache invalidation
- [skill_overrides.md](./skill_overrides.md) — `skillOverrides` setting filters which loaded skills appear in the listing
- [root_skill_md.md](./root_skill_md.md) — v2.1.142 plugin-root SKILL.md discovery path
- [subagent_skill_discovery.md](./subagent_skill_discovery.md) — v2.1.133 subagent skill enumeration fix
- 07_compact module — auto-compaction internals; this doc covers only the skill-specific carry-forward block
