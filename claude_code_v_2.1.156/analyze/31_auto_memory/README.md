# 31 — Auto Memory + Auto Dreaming (memdir runtime) — v2.1.156

## Overview

The `memdir` subsystem is Claude Code's **persistent, file-based memory** — a small tree of Markdown files under `~/.claude/projects/<slug>/memory/` that survives between sessions and is re-injected into the system prompt each turn. v2.1.156 keeps the same architecture seen since v2.1.88: there is no database. The entire memory directory is anchored by **one entrypoint Markdown file**, `MEMORY.md`, that acts as a hand-maintained *index* into topic files; everything beyond the index lives in sibling `.md` files the model loads on demand with the Read tool.

This single-entrypoint design is the core insight. Because the index is concatenated verbatim into the system prompt every turn, its size must be bounded. v2.1.156 enforces a hard **200-line / 25,000-byte cap** on `MEMORY.md` content (`MAX_ENTRYPOINT_LINES` (`B9H`) = 200 at cli_inner_pretty.js:143880; `MAX_ENTRYPOINT_BYTES` (`aM$`) = 25000 at cli_inner_pretty.js:145142). Content over either cap is truncated by `truncateEntrypointContent` (`q68`, cli_inner_pretty.js:144897), which line-truncates first to 200 lines, then byte-truncates at the last newline under 25 KB, then appends a `WARNING:` that names which cap fired and instructs the model to "Keep index entries to one line under ~200 chars; move detail into topic files" (cli_inner_pretty.js:144929). The truncation warning is the mechanism that *teaches the model the index-vs-detail discipline at runtime* — it is feedback, not just defensive trimming.

What makes v2.1.156 worth a dedicated unit is not the memdir prompt layer (which is functionally stable since v2.1.142) but the **three independent writers** that all converge on this one directory, and the **three distinct "dream" surfaces** that share prompt vocabulary but run on completely different triggers. The single biggest behavioral delta from v2.1.142 is that the old `/dream` *slash-command skill* (gated on `tengu_kairos_dream`) is **gone** — there are zero `tengu_kairos_dream` references in this build — and `/dream` is now a **scheduled-task routine scaffold** (`As4`, name `"dream"`, cli_inner_pretty.js:532705) that the cron/scheduling layer instantiates overnight. The live "background dreaming" that actually runs per-turn is a separate machine (`buildDreamPrompt` (`C04`), gated on `tengu_onyx_plover`).

This README is the map. The deep dives live in `memdir_core.md` (the prompt-builder layer), `extract_memories_runtime.md` (the per-turn extraction subagent and its tool sandbox), and `auto_dream_runtime.md` (the cross-session auto-dream scheduler); `cross_validation.md` carries the 2.1.88 ↔ 2.1.156 and 2.1.142 ↔ 2.1.156 line-level cross-references.

## Architecture — three writers, one directory

Three independent code paths produce content for the same `~/.claude/projects/<slug>/memory/` directory. Understanding the system requires holding all three in mind at once, because they coordinate through a **mutual-exclusion contract** and a **shared tool sandbox**, not through a queue.

```
   [main agent — inline]          [extraction subagent]            [auto-dream subagent]
   per-turn, in-band               per-turn, forked                 per-turn check, cross-session fork
        │                               │                                  │
        │ user says "remember X"        │ fires AFTER the turn when         │ fires only when
        │  OR "# direct save"           │  tengu_passport_quail is on       │  tengu_onyx_plover thresholds
        │  OR /memory edits MEMORY.md   │  (S88 isExtractModeActive)        │  (minHours≥24, minSessions≥5)
        │  via Edit/Write tools         │  AND main agent did NOT write     │  pass AND lock acquired
        ▼                               ▼                                  ▼
 ┌────────────────┐          ┌──────────────────────┐         ┌──────────────────────────┐
 │  Main agent    │          │ Forked agent          │         │ Forked agent              │
 │  Edit/Write    │          │ runForkedAgent (xZ)   │         │ runForkedAgent (xZ)       │
 │  in the live   │          │ forkLabel:            │         │ forkLabel: "auto_dream"   │
 │  conversation. │          │  "extract_memories"   │         │ querySource:"auto_dream"  │
 │                │          │ maxTurns: 5           │         │                           │
 │  NO sandbox —  │          │ ── cursor-based       │         │ ── hours + session-count  │
 │  writes wher-  │          │    (skip if writes    │         │    + filesystem lock      │
 │  ever the user │          │    already happened)  │         │    gating                 │
 │  permits.      │          │ ── canUseTool: cT8    │         │ ── canUseTool: cT8        │
 │                │          │    (memoryDir)        │         │    (memoryDir)  [SHARED]  │
 │  Signals "I    │          │ ── notif verb "Saved" │         │ ── notif verb "Improved"  │
 │  wrote" → the  │──────────│    (createMemory-     │         │ ── pendingMemoryUpdates   │
 │  extraction    │  SKIP    │     SavedMessage CT8) │         │    {source:"dream"}       │
 │  SKIPS         │ contract └──────────────────────┘         └──────────────────────────┘
 │  (Cg_ /        │                    │                                  │
 │  hasMemory-    │                    │                                  │
 │  WritesSince)  │                    │                                  │
 └────────────────┘                    │                                  │
        │                              │                                  │
        └──────────────┬───────────────┴──────────────────────────────────┘
                       ▼
          ┌─────────────────────────────────────────┐
          │ ~/.claude/projects/<slug>/memory/        │
          │   MEMORY.md          ← index, 200L/25KB  │   getAutoMemPath (TA)
          │   <topic>.md         ← topic files       │   ensureMemoryDirExists (g9H)
          │   team/...           ← optional team dir │   logMemoryDirCounts (Yr) →
          │   logs/YYYY/MM/DD/   ← session logs      │     tengu_memdir_loaded
          │   .consolidate-lock  ← dream mutex (PID) │
          └─────────────────────────────────────────┘
                       │
                       │ next session start / next loadMemoryPrompt (sM$)
                       ▼
              concatenated into the system prompt
              (with the truncation WARNING if over caps)
```

**Mutual-exclusion contract (extraction yields to the main agent).** The extraction subagent is the *fallback* writer: it only runs if the main agent did **not** already write to memory during the turn. `runExtraction` (inner `A` of `Bg_`) checks `Cg_(messages, cursor)` (`hasMemoryWritesSince`) first; if any Edit/Write hit a memory path since the last cursor, it advances the cursor, emits `tengu_extract_memories_skipped_direct_write`, and returns without forking (cli_inner_pretty.js:448266-448271). This is verified in the bundle. The rationale: a user who explicitly said "remember X" (handled inline by the main agent) does not need a second forked agent re-deriving the same fact — that would double-write and waste a model call. The contract is **one-directional**: the main agent never waits on extraction; extraction simply observes and steps aside.

**Shared `cT8` sandbox.** Both subagent writers run under the *same* tool allow-list, `createAutoMemCanUseTool` (`cT8`, cli_inner_pretty.js:448200), passed the resolved memory directory. The ladder (verified at 448200-448231): (1) memory toggled off (`XR()`) → DENY all with a "/toggle-memory to re-enable" message; (2) REPL → ALLOW; (3) Read/Grep/Glob → ALLOW; (4) Bash/PowerShell → read-only ALLOW, or a validated `rm`/`Remove-Item` of a `*.md` inside `memoryDir` ALLOW, else DENY; (5) Edit/Write with a `file_path` → in tiny mode (`_D()`) Edit is DENIED (memories are immutable: delete-and-recreate), else ALLOW only when the path ends in `.md` and is inside `memoryDir` (`bM$`); (6) default DENY. The **main agent has no sandbox** — it can write anywhere the user's permission system allows. That asymmetry is intentional: the forked writers are autonomous (no human in the loop), so they are boxed into the memory directory; the main agent is acting on explicit user intent.

## The three DREAM surfaces

The word "dream" appears in three distinct places in this build. They look similar (memory consolidation, four phases) but are **completely different machines** with different triggers, prompts, and lifecycles. Conflating them is the single easiest mistake to make in this subsystem.

```
 ┌────────────────────────────────────────────────────────────────────────────────────┐
 │ (1) PER-TURN AUTO-DREAM   buildDreamPrompt (C04)   cli_inner_pretty.js:448446        │
 │     ── THE live "background dreaming" ──                                             │
 │     Trigger:  stop-hook calls U04 every turn (main agent only); fires only when      │
 │               tengu_onyx_plover gates + thresholds + lock all pass.                   │
 │     Prompt:   "# Dream: Memory Consolidation" — 4 phases Orient / Gather / Consolidate│
 │               / Prune-and-index. Reads logs/, greps transcripts narrowly.            │
 │     Runs as:  forked agent (forkLabel "auto_dream"), cross-session horizon.          │
 │     Tiny var: when _D(), uses the tiny PRUNE prompt (2) instead.                     │
 ├────────────────────────────────────────────────────────────────────────────────────┤
 │ (2) TINY-MEMORY PRUNE     buildDreamPromptTiny (VFK)   cli_inner_pretty.js:144513    │
 │     ── a PROMPT, not a trigger ──                                                    │
 │     "# Dream: Memory Pruning" — small job: delete stale, collapse duplicates.        │
 │     Selected by the SAME per-turn auto-dream machine (1) when tiny memory is on       │
 │     (_D() / tengu_billiard_aviary). Immutable memories: delete-and-recreate only.    │
 ├────────────────────────────────────────────────────────────────────────────────────┤
 │ (3) /dream SCHEDULED-TASK SCAFFOLD   As4 (name "dream")   cli_inner_pretty.js:532705 │
 │     ── NEW in v2.1.156: replaces the old tengu_kairos_dream /dream skill ──          │
 │     A routine scaffold consumed by the scheduling/cron layer: "Runs overnight        │
 │     (1–5am local) via the scheduled task scaffold. context: fork".                   │
 │     Prompt:   4 phases Preparation / Topics / Rules & Learnings (learnings/<slug>.md) │
 │               / Prioritization & Pruning. Sibling of /catch-up, /morning-checkin.    │
 │     NOT gated on onyx; NOT the live per-turn dreamer. Cron-driven, overnight only.    │
 └────────────────────────────────────────────────────────────────────────────────────┘
```

The key separation:

- **(1) is the live dreamer.** It is what actually consolidates memory in the background while you use Claude Code, and it is gated on `tengu_onyx_plover` (`getDreamConfig` (`P04`), cli_inner_pretty.js:447997). The stop-hook calls it every turn; its gates decide whether to fire.
- **(2) is a prompt variant of (1)**, not an independent surface. When tiny-memory mode is on, the same per-turn machine swaps `C04` for `VFK` (verified: `v = G ? VFK(P, V, w) : C04(P, Z, V, w)` at cli_inner_pretty.js:448620, where `G = _D()`).
- **(3) is the new `/dream`.** In v2.1.142 there was a `/dream` slash-command skill gated on the `tengu_kairos_dream` flag. In v2.1.156 that flag and skill are gone; `/dream` is reborn as a *scheduled routine scaffold* (`As4`) that the cron layer fires overnight. Its prompt has a different 4-phase shape (notably a "Rules & Learnings" phase that writes `learnings/<slug>.md`, absent from the per-turn dreamer) and it is **not** gated on onyx. The two `/dream` mechanisms are unrelated implementations that happen to share a user-facing name.

## Files in this unit

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Module overview, three-writer + three-dream-surface architecture, file map, prompt-injection lifecycle, key symbols (list), and the v2.1.142→v2.1.156 delta table (this file) |
| [memdir_core.md](./memdir_core.md) | The prompt-builder layer — `loadMemoryPrompt` (`sM$`) dispatcher, the builder family (`eM6`/`ZFK`/`GFK`/`TFK`/`VFK`), caps and `truncateEntrypointContent` (`q68`), `ensureMemoryDirExists` (`g9H`), `logMemoryDirCounts` (`Yr`), enablement gates, path resolution, and the closed memory-type taxonomy |
| [extract_memories_runtime.md](./extract_memories_runtime.md) | The per-turn extraction subagent — trigger/gate (`isExtractModeActive` (`S88`)), the `lT8` module + `Bg_` closure (cursor, coalescing, drain), the `runExtraction` skip ladder, the fork + `memory_saved` notification (`CT8`), the **canonical** write-up of the shared tool sandbox (`createAutoMemCanUseTool` (`cT8`) + the `rm`/`Remove-Item` validators), and the `buildExtractionPrompt` (`Z04`) template |
| [auto_dream_runtime.md](./auto_dream_runtime.md) | The cross-session auto-dream scheduler — gate chain (`P04`/`QT8`/`kk$`/`sg_`), thresholds (`ag_`/`x04`), the filesystem lock protocol (`.consolidate-lock`), the `C04`/`VFK` prompts, the task registry, the `/dream` scaffold (`As4`) delta, the `memory_update` ambient-context queue, and its reuse of the shared extraction tool sandbox (`createAutoMemCanUseTool` (`cT8`), documented in `extract_memories_runtime.md`) |
| [cross_validation.md](./cross_validation.md) | 2.1.88 TypeScript ↔ 2.1.156 obfuscated mapping plus the full 2.1.142 ↔ 2.1.156 delta tables and citation spot-checks |

Index-side additions live in [`../00_overview/symbol_additions_v2_1_156_auto_memory.md`](../00_overview/symbol_additions_v2_1_156_auto_memory.md) (the symbol mapping table for this unit).

## Prompt-injection lifecycle

The memory section is injected as one dynamic section of the system prompt every turn. The pipeline, end to end, with the verified entry points:

1. **Registration.** The system prompt builder registers a `"memory"` dynamic section. The section is cached until something dirties it, so the disk read + truncation does not re-run on every keystroke.
2. **Dispatch** (`loadMemoryPrompt` (`sM$`), cli_inner_pretty.js:145046). First-match-wins over six branches (verified at 145046-145118):
   - **cowork-verbatim** — `isAutoMemoryEnabled()` (`M1`) AND `CLAUDE_COWORK_MEMORY_GUIDELINES` set → return `` `# auto memory\n${env}` `` verbatim, no taxonomy (145049-145058).
   - **simple non-tiny** — `M1() && !_D() && X3(model)` → `buildSimpleMemoryPrompt` (`TFK`) (145062-145067).
   - **tiny** — `M1() && _D()` → team? `buildCombinedMemoryPromptTiny` (`GFK`) : `buildMemoryLinesTiny` (`ZFK`).join("\n") (145068-145087).
   - **team non-tiny** — `dVH.isTeamMemoryEnabled()` → `A95.buildCombinedMemoryPrompt(...)` (145088-145098).
   - **single auto** — `M1()` → `buildMemoryLines` (`eM6`).join("\n") (145099-145108).
   - **disabled** — emit `tengu_memdir_disabled` (and `tengu_team_memdir_disabled` if `tengu_herring_clock`), return `null` (145109-145117).
3. **`ensureDir`** (`ensureMemoryDirExists` (`g9H`), cli_inner_pretty.js:144936). Every enabled branch first `await g9H(dir)` — a recursive mkdir that swallows errors at debug level and never throws (144936-144944). Non-fatal by design: a memory directory that cannot be created should degrade to "no memory section," not crash the turn.
4. **Read + truncate.** For variants that inline `MEMORY.md` content (`buildMemoryPrompt` (`hFK`)), the entrypoint is `readFileSync`'d (silent on failure → empty index) and passed through `truncateEntrypointContent` (`q68`, cli_inner_pretty.js:144897): line-truncate to 200, byte-truncate at last `\n` under 25 KB, append the cap-naming WARNING.
5. **Assemble.** The chosen builder pushes its behavioral-instruction lines plus (where applicable) `## MEMORY.md` + the truncated content, and `join("\n")`s into one string section.
6. **Telemetry.** Each enabled branch fires `logMemoryDirCounts` (`Yr`, cli_inner_pretty.js:144945) — a fire-and-forget `readdir` that counts files/subdirs and emits `tengu_memdir_loaded { memory_type, total_file_count, total_subdir_count }`, then `SH("memory_load_prompt")` records the load. The count read is async precisely so a slow filesystem cannot block synchronous prompt construction; telemetry catches up afterward.

## Related Symbols

> Symbol mappings (tables live in the overview, not here):
> - [symbol_additions_v2_1_156_auto_memory.md](../00_overview/symbol_additions_v2_1_156_auto_memory.md) — every new symbol mapping discovered in this unit
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — core execution (forked agents, tools, state)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — core features (auto memory belongs here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — platform infra (telemetry, settings)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — integrations (scheduled-task scaffolds, UI)

**memdir core (prompt-builder layer):**
- `ENTRYPOINT_NAME` (`g75` / alias `OX`) — `"MEMORY.md"` (cli_inner_pretty.js:142198, 143879)
- `MAX_ENTRYPOINT_LINES` (`B9H`) — 200 (cli_inner_pretty.js:143880)
- `MAX_ENTRYPOINT_BYTES` (`aM$`) — 25000 (cli_inner_pretty.js:145142)
- `AUTO_MEM_DISPLAY_NAME` (`tM6`) — `"auto memory"` (cli_inner_pretty.js:145143)
- `loadMemoryPrompt` (`sM$`) — six-branch dispatcher (cli_inner_pretty.js:145046-145118)
- `truncateEntrypointContent` (`q68`) — 200L/25KB cap enforcer with cap-naming WARNING (cli_inner_pretty.js:144897-144935)
- `ensureMemoryDirExists` (`g9H`) — recursive mkdir, swallows errors (cli_inner_pretty.js:144936-144944)
- `logMemoryDirCounts` (`Yr`) — async file/subdir count → `tengu_memdir_loaded` (cli_inner_pretty.js:144945-144960)
- `buildMemoryLines` (`eM6`) — default non-tiny behavioral instructions (cli_inner_pretty.js:144962-145021)
- `buildMemoryPrompt` (`hFK`) — per-agent variant that inlines `MEMORY.md` content (cli_inner_pretty.js:145022-145044)
- `buildMemoryLinesTiny` (`ZFK`) — tiny single-dir (cli_inner_pretty.js:144371-144417)
- `buildCombinedMemoryPromptTiny` (`GFK`) — tiny dual-dir private+team (cli_inner_pretty.js:144419-144473)
- `buildSimpleMemoryPrompt` (`TFK`) — compact single-block for the simple-system-prompt branch (cli_inner_pretty.js:144474-144512)
- `buildDreamPromptTiny` (`VFK`) — tiny PRUNE prompt "# Dream: Memory Pruning" (cli_inner_pretty.js:144513-144540)
- `isAutoMemoryEnabled` (`M1`) — enablement chain (cli_inner_pretty.js:142111-142122)
- `isCcrSentinelDisabled` (`h88`) — `tengu_sepia_cormorant` allowlist + `tengu_umber_petrel` kill-switch (cli_inner_pretty.js:142123-142130)
- `isExtractModeActive` (`S88`) — `tengu_passport_quail` AND (interactive OR `tengu_slate_thimble`) (cli_inner_pretty.js:142131-142134)
- `isTinyMemoryEnabled` (`_D`) — `tengu_billiard_aviary`, default false (cli_inner_pretty.js:142142-142144)
- `getAutoMemPath` (`TA`) — memoized `<base>/projects/<slug>/(memory|tiny_memory)/` resolver (cli_inner_pretty.js:142211+)
- `isAutoMemPathExceptEntrypoint` (`bM$`) — path guard used by `cT8` (cli_inner_pretty.js:142188)

**Extraction subagent (per-turn fallback writer):**
- `extractMemoriesModule` (`lT8`, re-exported as `Ac_`) — init/execute/drain exports (cli_inner_pretty.js:448082-448088)
- `initExtractMemories` (`Bg_`) — closure factory holding inFlight set, cursor, throttle (cli_inner_pretty.js:448255-448378)
- `executeExtractMemories` (`pg_`) — public entry called by the stop-hook (cli_inner_pretty.js:448380-448381)
- `drainPendingExtraction` (`Ug_`) — 60s race drain for `-p` mode (cli_inner_pretty.js:448383-448384)
- `createAutoMemCanUseTool` (`cT8`) — the shared tool allow-list (cli_inner_pretty.js:448200-448231)
- `denyAutoMemTool` (`dT8`) — deny factory → `tengu_auto_mem_tool_denied` (cli_inner_pretty.js:448145)
- `validatePosixMemoryRm` (`ug_`) — `rm <flags> path.md` inside memoryDir only (cli_inner_pretty.js:448169-448198)
- `validatePowerShellRemoveItem` (`xg_`) — `Remove-Item` aliases inside memoryDir (cli_inner_pretty.js:448152-448167)
- `hasMemoryWritesSince` (`Cg_`) — mutual-exclusion detector vs the main agent (cli_inner_pretty.js:448106)
- `hasUserProseSince` (`bg_`) — ≥3-token user-prose gate (cli_inner_pretty.js:448133)
- `buildExtractionPrompt` (`Z04`) — OS/tiny/team-branched extraction prompt (cli_inner_pretty.js:448027-448071)
- `createMemorySavedMessage` (`CT8`) — `memory_saved` system message factory, verb "Saved" (cli_inner_pretty.js:445955-445963)
- `MIN_USER_PROSE_TOKENS` (`V04`) — 3 (cli_inner_pretty.js:448388)

**Auto-dream scheduler (per-turn cross-session writer):**
- `getDreamConfig` (`P04`) — reads `tengu_onyx_plover`, default null (cli_inner_pretty.js:447997-447999)
- `isAutoDreamServerSideOptIn` (`QT8`) — onyx.enabled/available OR team-mem-server fallback (cli_inner_pretty.js:448000-448004)
- `isAutoDreamFeatureToggleable` (`kk$`) — user `autoDreamEnabled` ?? onyx (cli_inner_pretty.js:448005-448011)
- `getDreamThresholds` (`ag_`) — onyx `{minHours,minSessions}` or defaults (cli_inner_pretty.js:448529-448538)
- `AUTO_DREAM_THRESHOLD_DEFAULTS` (`x04`) — `{minHours:24, minSessions:5}` (cli_inner_pretty.js:448742)
- `AUTO_DREAM_SCAN_THROTTLE_MS` (`og_`) — 600000 (10 min) (cli_inner_pretty.js:448715)
- `isAutoDreamEnabled` (`sg_`) — `!$b() && !d6() && M1() && kk$()` (cli_inner_pretty.js:448540-448545)
- `initAutoDream` (`p04`) — scheduler closure factory; assigns `B04` (cli_inner_pretty.js:448549-448677)
- `autoDreamExtractor` (`B04`) — the gate→scan→lock→fork→track loop (cli_inner_pretty.js:448551-448676)
- `runAutoDreamCheck` (`U04`) — public entry called by the stop-hook (cli_inner_pretty.js:448709-448711)
- `buildDreamPrompt` (`C04`) — the live 4-phase consolidation prompt (cli_inner_pretty.js:448446-448512)
- `TEAM_DREAM_PHASE_GUIDANCE` (`ng_`) — team-subdir phase guidance (cli_inner_pretty.js:448514)
- `RECONCILE_AGAINST_CLAUDEMD` (`ig_`) — Phase-4 CLAUDE.md reconciliation block (cli_inner_pretty.js:448516)
- `trackDreamFilesTouched` (`eg_`) — onMessage tracker for Edit/Write/rm `.md` paths (cli_inner_pretty.js:448678-448698)
- `countDailyLogs` (`Hd_`) — recursive `.md` count under `logs/` (cli_inner_pretty.js:448700-448708)

**Lock + task registry:**
- `readLastConsolidatedAt` (`_Z8`) — stat mtime of `.consolidate-lock` (cli_inner_pretty.js:399350-399356)
- `acquireDreamLock` (`_Y4`) — PID-based lock with live-PID + race re-verify (cli_inner_pretty.js:399357-399380)
- `releaseDreamLock` (`zZ8`) — rollback: unlink or rewind mtime (cli_inner_pretty.js:399381-399394)
- `listSessionsTouchedSince` (`zY4`) — session UUIDs with mtime > threshold (cli_inner_pretty.js:399395-399398)
- `LOCK_FILE_NAME` (`qE_`) — `".consolidate-lock"` (cli_inner_pretty.js:399401)
- `HOLDER_STALE_MS` (`KE_`) — 3600000 (1 hr) (cli_inner_pretty.js:399402)
- `registerDreamTask` (`AY4`) / `aggregateDreamProgress` (`YY4`) / `finalizeDreamTask` (`fY4`) / `rollbackDreamTask` (`OY4`) — task registry (cli_inner_pretty.js:399416-399450)

**Orchestration + surfaces:**
- stop-hook call sites — `Ac_.executeExtractMemories(M, z.appendSystemMessage)` (gated on `S88()`) and `U04(M, z.appendSystemMessage)`, both requiring `!z.agentId` (cli_inner_pretty.js:450698-450699)
- `drainPendingMemoryUpdates` (`vw4`) — drains queue → `memory_update` attachments (cli_inner_pretty.js:413803-413816)
- `MEMORY_UPDATE_SOURCE_LABELS` (`BQ_`) — `{dream: "Background memory consolidation"}` (cli_inner_pretty.js:446768)
- `dreamScheduledTaskScaffold` (`As4`) — the NEW `/dream` overnight routine scaffold, name `"dream"` (cli_inner_pretty.js:532705-532744)

## Version notes (v2.1.142 → v2.1.156)

The dominant change is the `/dream` reincarnation; almost everything else is structurally stable with rotated obfuscated names. This is a **behavior-delta** table (old vs new), not a symbol-mapping table.

| Concern | v2.1.142 | v2.1.156 | Change |
|---|---|---|---|
| `/dream` user surface | slash-command **skill** gated on `tengu_kairos_dream` (`z8A`/`K8A`), default off | **scheduled-task routine scaffold** `As4` (name `"dream"`, "overnight 1–5am via the scheduled task scaffold", `context: fork`); zero `tengu_kairos_dream` references remain | **Replaced** — skill removed, cron-driven scaffold introduced (cli_inner_pretty.js:532705) |
| `/dream` scaffold prompt phases | (skill) Orient/Gather/Consolidate/Prune | Preparation / Topics / **Rules & Learnings** (`learnings/<slug>.md`) / Prioritization & Pruning | **New 4-phase shape**, distinct from the per-turn dreamer |
| Live per-turn dreamer | `buildDreamPrompt` (`SL$`) gated on `tengu_onyx_plover` | `buildDreamPrompt` (`C04`) gated on `tengu_onyx_plover` (`P04`) | Unchanged structurally; name rotated `SL$→C04` |
| Auto-dream scheduler | `runAutoDreamCheck` (`nr7`) / `autoDreamExtractor` (`cr7`) / `initAutoDream` (`lr7`) | `U04` / `B04` / `p04` | Unchanged logic; names rotated |
| Lock helpers | `acquireDreamLock` (`jd7`) / `releaseDreamLock` (`tf8`) / `readLastConsolidatedAt` (`sf8`) | `_Y4` / `zZ8` / `_Z8` | Unchanged protocol; names rotated |
| Lock file + stale window | `.consolidate-lock`, 1 hr stale, PID body, mtime = lastConsolidatedAt | identical (`qE_` = `.consolidate-lock`, `KE_` = 3600000) | **Unchanged** (cli_inner_pretty.js:399401-399402) |
| Threshold defaults | `{minHours:24, minSessions:5}` (`gr7`) | `{minHours:24, minSessions:5}` (`x04`) | **Unchanged** (cli_inner_pretty.js:448742) |
| Scan throttle | 600000 ms / 10 min (`V$5`) | 600000 ms / 10 min (`og_`) | **Unchanged** (cli_inner_pretty.js:448715) |
| Extraction module / factory / validator | `b85` / `M$5` / `DO8` | `lT8` (re-export `Ac_`) / `Bg_` / `cT8` | Unchanged behavior; names rotated |
| Extraction prompt builder | `hr7` (merged auto+team) | `Z04` (merged auto+team, OS/tiny/team branches) | Unchanged behavior; name rotated |
| `hasMemoryWritesSince` mutex | `A$5` | `Cg_` | Unchanged; name rotated |
| Throttle flag | `tengu_bramble_lintel`, default 1 | `tengu_bramble_lintel`, default 1 | **Unchanged** (cli_inner_pretty.js:448281) |
| `MIN_USER_PROSE_TOKENS` | 3 (`Rr7`) | 3 (`V04`) | **Unchanged** (cli_inner_pretty.js:448388) |
| `loadMemoryPrompt` dispatcher | `c5$`, 5 enabled branches + disabled | `sM$`, same branch shape (cowork/simple/tiny/team/auto + disabled) | Unchanged shape; name rotated |
| memdir builders | `VK6`/`yVK`/`hVK`/`IVK`/`SVK` | `eM6`/`ZFK`/`GFK`/`TFK`/`VFK` | Unchanged behavior; names rotated |
| `ENTRYPOINT_NAME` / caps | `"MEMORY.md"` / 200 lines / 25000 bytes | `"MEMORY.md"` / 200 / 25000 | **Unchanged** (cli_inner_pretty.js:142198, 143880, 145142) |
| `MEMORY_TYPES` / `TINY_MEMORY_TYPES` | `[user,feedback,project,reference]` / `[user,feedback,project]` | identical (`lM6` / `oM6`) | **Unchanged** (cli_inner_pretty.js:144194, 144552) |
| Tiny-memory mode flag | `tengu_billiard_aviary` (`gM`) | `tengu_billiard_aviary` (`_D`) | Unchanged; name rotated |
| `memory_update` ambient queue + label | `{dream: "Background memory consolidation"}` (`Cz5`) | identical (`BQ_`) | **Unchanged** (cli_inner_pretty.js:446768) |
| `/toggle-memory` command | present, hidden by default (`isEnabled:()=>!1`) | present, hidden by default | **Unchanged** |
| Stop-hook call sites | extraction gated on `Wi$()`, dream unconditional; both `!agentId` | extraction gated on `S88()`, dream unconditional; both `!z.agentId` | Unchanged shape; gate renamed (cli_inner_pretty.js:450698-450699) |
| `memory_20250818` / `client.beta.memory_stores.*` | Anthropic Managed-Agents memory tool docs strings (NOT Claude Code auto-memory) | same — docs strings only, no call sites | **Unchanged** (clarification) |

The v2.1.156 picture: the **runtime engine of auto memory is stable** since v2.1.142 — same caps, same lock, same thresholds, same mutual-exclusion contract, same six-branch dispatcher, with only obfuscated names rotated. The one *behavioral* change a user can see is `/dream`: it stopped being an opt-in slash-command skill and became a scheduled overnight routine, while the genuinely-background "dreaming" continued to live in the per-turn `tengu_onyx_plover`-gated scheduler that the stop-hook drives.
