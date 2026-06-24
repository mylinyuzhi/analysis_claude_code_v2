# Reconstruction Conventions — Auto Memory / Dream (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of the **auto-memory + dream** subsystem **as it
> exists in Claude Code v2.1.183**, written as clean TypeScript organized the way the genuine
> Anthropic source tree (v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`) organizes it.
> This is NOT a delta doc — reconstruct the *whole machine*, including the parts that are
> byte-for-byte carryover from v2.1.156/v2.1.88 (the memdir entrypoint + caps, the typed-memory
> taxonomy, the per-turn extraction subagent + sandbox, the auto-dream scheduler + `.consolidate-lock`
> protocol, the consolidation prompt, the DreamTask UI registry) **and** the v2.1.172/2.1.181 deltas
> (`CLAUDE_MEMORY_STORES` `scope`/`promptIndex` schema, the network `promptIndex` fetch+inject, the
> rewritten recall dispatcher routing by scope+mode, the mounted-store team-enable fix, the watcher
> scope-split, and the verbose-only `memory_saved` file list).

## Scope (this restoration)

**IN scope** — the auto-memory/dream capability:

- `memdir/` — the entrypoint (`MEMORY.md`), caps + truncation, typed-memory taxonomy, the recall
  prompt builders + dispatcher (`loadMemoryPrompt`), the memory scan/age/relevance helpers, the
  path/gate resolver, and the team-store path + recall builders (`teamMemPaths`, `teamMemPrompts`).
- `services/autoDream/` — the background consolidation scheduler, the lock protocol, the
  consolidation prompt, the enabled gate.
- `services/extractMemories/` — the per-turn extraction subagent, its closure-scoped state machine,
  the read-only tool sandbox, and the extraction prompts.
- `tasks/DreamTask/` — the background-task registry entry that surfaces the dream agent in the UI.
- `services/teamMemorySync/watcher.ts` — the watcher entrypoint + the scope-split that drives the
  team/user multistore lanes (the v2.1.172 delta). `index.ts` is reconstructed at **contract level**
  only (the multistore transport is carryover the delta docs deliberately do not re-derive).
- `utils/messages.ts` (memory subset) — the `memory_saved` system-message factory + source labels +
  the `pendingMemoryUpdates` ambient queue.
- `utils/memoryFileDetection.ts` — auto-managed-memory-file detection used by the render path.
- `components/memory/MemoryUpdateNotification.tsx` — the `memory_saved` REPL renderer (logic of the
  2.1.181 verbose-only delta; pure-render details summarized).

**OUT of scope** (note, do not reconstruct): `services/SessionMemory/*` and
`services/compact/sessionMemoryCompact.ts` are the **compact** session-summary memory, a distinct
subsystem documented under `07_compact/`. The deep `teamMemorySync` push/pull *transport*
(`index.ts` internals, `secretScanner.ts`) is carryover transport — keep it contract-level and link
to the team-store delta doc rather than re-deriving it.

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle.**
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   **Every** reconstructed function, constant, branch, and verbatim string MUST be verified by
   *reading the exact line(s)* here. This is the only source of truth for **behavior**. Obfuscated
   names re-mangle every build — never trust a name from v2.1.156/v2.1.88; re-derive it here by
   anchoring on stable strings (env var names, telemetry event names, prompt text, schema literals).
   Assets corroborate: `extract/assets/feature_gates.json` (`tengu_onyx_plover`, `tengu_passport_quail`,
   `tengu_herring_clock`, `tengu_marble_lark`, `tengu_coral_fern`, `tengu_moth_copse`,
   `tengu_bramble_lintel`, `tengu_slate_thimble`), `assets/env_vars.json`
   (`CLAUDE_CODE_DISABLE_AUTO_MEMORY`, `CLAUDE_CODE_REMOTE_MEMORY_DIR`, `CLAUDE_MEMORY_STORES`,
   `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE`, `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES`).

2. **SCAFFOLD — the v2.1.183 delta analysis docs (this module) + the scout dossier.**
   `31_auto_memory/{README.md, team_memory_stores_recall.md, status_line_and_misc_delta.md}` and
   `_scout_dossier_auto_memory.md`. These already contain **v2.1.183-specific** anchors, snippets,
   readable names, and before/after analysis — a strong jump-start. But **re-verify every anchor
   against the live bundle** (line numbers must be re-read; treat as hint, not gospel). Secondary
   scaffold for unchanged-carryover *logic + analysis prose*: the v2.1.156 baseline
   `claude_code_v_2.1.156/analyze/31_auto_memory/` (`memdir_core.md`, `auto_dream_runtime.md`,
   `extract_memories_runtime.md`, `cross_validation.md`).

3. **CONVENTION + REAL ANCESTOR — the v2.1.88 named-TS source.**
   `/lyz/codespace/3rd/claude-code/src`. **The auto-memory/dream subsystem is a real,
   fully-implemented ancestor in v2.1.88** (not gated out) — so v2.1.88 is both the *shape* template
   (file layout, naming idioms, `feature()` gating with `require()` for `TEAMMEM`/`KAIROS`, ESM `.js`
   import specifiers on `.ts`, closure-scoped service state via `initX()`, React/Ink `.tsx` for UI)
   **and** a genuine readable ancestor — borrow real function names, comments, and logic where
   v2.1.183 still does the same thing. **When behavior diverges, the 183 bundle wins;** cite the 88
   file only for the convention/name borrowed, and mark the divergence inline
   (`// DELTA v2.1.x: …`). The big divergences live on the **team-store recall path** (schema
   expansion, network `promptIndex` fetch, scope/mode routing) and the **status line** — all already
   analyzed in the delta docs; restore the *code* faithfully and cross-link the delta doc for "why".

   ### 88 ancestor → 183 unit map (cite the 88 path you mirror)

   | Reconstructed file | v2.1.88 ancestor | 183 primary anchors (re-verify!) |
   |---|---|---|
   | `memdir/paths.ts` | `src/memdir/paths.ts` | `isAutoMemoryEnabled`=Iu@147636, `isExtractModeActive`=Nyn@147662, `getMemoryBaseDir`=Wse@147666, `getAutoMemPath`=hm@147746 |
   | `memdir/memdir.ts` | `src/memdir/memdir.ts` | caps `$w`/`tie`/`HTe`@150800-150802, `loadMemoryPrompt`=e0t@151847, `tengu_memdir_loaded`@151749, `tengu_memdir_disabled`@151941 |
   | `memdir/memoryTypes.ts` | `src/memdir/memoryTypes.ts` | taxonomy + prompt-section constants (anchor on verbatim section text) |
   | `memdir/memoryScan.ts` | `src/memdir/memoryScan.ts` | `scanMemoryFiles`/`formatMemoryManifest` (anchor on frontmatter parse + manifest format) |
   | `memdir/memoryAge.ts` | `src/memdir/memoryAge.ts` | memory-age helpers |
   | `memdir/findRelevantMemories.ts` | `src/memdir/findRelevantMemories.ts` | frontmatter relevance scan |
   | `memdir/teamMemPaths.ts` | `src/memdir/teamMemPaths.ts` | `isTeamMemoryEnabled`=Nk@151098, `getTeamMemPath`=uH@151103, store schema bQu@150491, parser Zse@150442, `isPromptIndexPathSafe`=vNr@150438, fetch agi@150754/kQu@150768/xQu@150791 |
   | `memdir/teamMemPrompts.ts` | `src/memdir/teamMemPrompts.ts` | `buildCombinedMemoryPrompt` + builders Agi@151265/mgi@151194/Sgi@151426/Egi@151481/bgi@151378 |
   | `services/autoDream/autoDream.ts` | `src/services/autoDream/autoDream.ts` | scheduler/`initAutoDream` runner BQa@455416, `getConfig`=w2p@455394, events `tengu_auto_dream_fired`@455467 / `_completed`@455522 / `_failed`@455539 |
   | `services/autoDream/consolidationLock.ts` | `src/services/autoDream/consolidationLock.ts` | `LOCK_FILE`=BDp@424663 `.consolidate-lock`, `HOLDER_STALE_MS`=FDp@424664 (3600000) |
   | `services/autoDream/consolidationPrompt.ts` | `src/services/autoDream/consolidationPrompt.ts` | `buildConsolidationPrompt`=PQa@455299 (`# Dream: Memory Consolidation`); tiny prune `# Dream: Memory Pruning`@151521 |
   | `services/autoDream/config.ts` | `src/services/autoDream/config.ts` | `isAutoDreamEnabled` (reads `tengu_onyx_plover` enabled gate @454521) |
   | `services/extractMemories/extractMemories.ts` | `src/services/extractMemories/extractMemories.ts` | `createAutoMemCanUseTool` sandbox, skip-ladder `_skipped_direct_write`@455133 / `_extraction`@455183 / `_coalesced`@455223, gate `tengu_passport_quail`@455218 |
   | `services/extractMemories/prompts.ts` | `src/services/extractMemories/prompts.ts` | `buildExtractAutoOnlyPrompt`/`buildExtractCombinedPrompt` (anchor on prompt text) |
   | `tasks/DreamTask/DreamTask.ts` | `src/tasks/DreamTask/DreamTask.ts` | `registerDreamTask`/`addDreamTurn`/`completeDreamTask`/`failDreamTask`/`isDreamTask`/`DreamTask.kill`, MAX_TURNS=30 |
   | `services/teamMemorySync/watcher.ts` | `src/services/teamMemorySync/watcher.ts` | watcher start + scope-split uFp@449203, team lane `rX`@449224, user lane `$W`@449230, `tengu_personal_mem_sync_started` |
   | `services/teamMemorySync/index.ts` | `src/services/teamMemorySync/index.ts` | **CONTRACT-LEVEL**: multistore sync builder `lAo`, store client `m_n`, push/pull, telemetry; summarize internals |
   | `utils/messages.ts` (memory subset) | `src/utils/messages.ts` | `createMemorySavedMessage`=YGn@589751 (`subtype:"memory_saved"`@589754), `MEMORY_UPDATE_SOURCE_LABELS`=YSf@590643, `pendingMemoryUpdates` init@294619 / drain@465837 / push@455509 |
   | `utils/memoryFileDetection.ts` | `src/utils/memoryFileDetection.ts` | auto-managed-memory-file detection (anchor on isAutoManagedMemoryFile usage in render path) |
   | `components/memory/MemoryUpdateNotification.tsx` | `src/components/memory/MemoryUpdateNotification.tsx` | `memory_saved` renderer Svp@383399 (verbose-only list, 2.1.181), dispatch SNa@382871 |

## File format (each reconstructed `.ts`/`.tsx`)

- Clean, idiomatic, **readable** TypeScript — what the original source plausibly looked like. The
  v2.1.88 ancestor is high-fidelity (real names + comments); port it forward, then correct any line
  where the 183 bundle diverges. Preserve the ancestor's doc-comments where the behavior is unchanged.
- **Every** top-level function/const carries an anchor comment tying it to evidence, e.g.
  `// 2.1.183: loadMemoryPrompt = e0t @cli_inner_pretty.js:151847`. Non-trivial branches / divergent
  lines get inline `// @<line>` anchors so a reviewer can re-verify any line.
- **File header block** (top of file) listing: the v2.1.183 source regions covered, the v2.1.88
  ancestor mirror path, which delta doc was used as scaffold, and a one-line cross-validation note
  (what you re-verified in the 183 bundle). Disclose any divergence from the 88 ancestor.
- **Mark deltas inline.** Where the 183 behavior differs from the 88 ancestor, add
  `// DELTA v2.1.172: …` / `// DELTA v2.1.181: …` with the 183 line, and (for team-store/status-line
  deltas) cross-link the delta doc: `// see team_memory_stores_recall.md §N`.
- **No invented behavior.** If a detail can't be confirmed in the 183 bundle, omit it or mark
  `// UNVERIFIED: …` and report it in your manifest. Faithful-to-source beats plausible-but-guessed.
  Watch for *false carryover*: the 88 ancestor is the shape, but the 183 bundle may have added fields
  (e.g. `tengu_auto_dream_fired` gained `team_memory_enabled`@455467; `tengu_auto_dream_failed`
  gained `phase`+`error_class`@455539 vs the 88 ancestor's empty payload) — read the live line.
- Use `feature('TEAMMEM')`/`feature('KAIROS')` gating exactly as the 88 ancestor does (the 183 bundle
  inlines the enabled branch — note `// feature('TEAMMEM') inlined-enabled in 183` where relevant).
- Keep obfuscated single-letter locals only where readability doesn't suffer; otherwise rename to
  intent-revealing names. English only.

## Anchor-comment style (so reviewers can re-verify fast)

```ts
/**
 * Background memory consolidation scheduler. Fires the "# Dream: Memory
 * Consolidation" prompt as a forked subagent when the time-gate AND
 * session-gate pass and the .consolidate-lock is free.
 * 2.1.183 regions: cli_inner_pretty.js:455416-455545 (runner) ; thresholds w2p@455394
 * 2.1.88 ancestor: services/autoDream/autoDream.ts (initAutoDream/runAutoDream)
 * scaffold: 31_auto_memory/README.md "auto-dream scheduler"; v2.1.156 auto_dream_runtime.md
 * cross-val: re-read fired/completed/failed payloads in 183; minHours/minSessions defaults 24/5
 */
// 2.1.183: getDreamThresholds = w2p @455394 (reads tengu_onyx_plover)
function getDreamThresholds(): { minHours: number; minSessions: number } { … }
```

## Naming registry (reuse across files — confirmed in the 183 bundle)

Gates/paths: `isAutoMemoryEnabled`(Iu @147636), `isExtractModeActive`(Nyn @147662),
`getMemoryBaseDir`(Wse @147666), `getAutoMemPath`(hm @147746, memoized).
Entrypoint: `ENTRYPOINT_NAME`($w="MEMORY.md" @150800), `MAX_ENTRYPOINT_LINES`(tie=200 @150801),
`MAX_ENTRYPOINT_BYTES`(HTe=25000 @150802).
Recall: `loadMemoryPrompt`(e0t @151847), team builders `Agi`@151265 / `mgi`@151194 / `Sgi`@151426 /
`Egi`@151481 / `bgi`@151378.
Team stores: `isTeamMemoryEnabled`(Nk @151098), `getTeamMemPath`(uH @151103),
store schema(bQu @150491), parser(Zse @150442), `deriveMountName`(yQu @150431),
`isPromptIndexPathSafe`(vNr @150439), `fetchStorePromptIndices`(agi @150754),
`fetchOnePromptIndex`(kQu @150769), `PROMPT_INDEX_FETCH_TIMEOUT_MS`(xQu @150791).
Extraction: skip events `tengu_extract_memories_skipped_direct_write`@455133 /
`_extraction`@455183 / `_coalesced`@455223, throttle `tengu_bramble_lintel`@455144,
gate `tengu_passport_quail`@455218.
Dream: scheduler runner BQa@455416, `getDreamThresholds`(w2p @455394), thresholds
`tengu_onyx_plover`@454521/455395, events `tengu_auto_dream_fired`@455467 /
`tengu_auto_dream_completed`@455522 / `tengu_auto_dream_failed`@455539,
consolidation prompt `buildConsolidationPrompt`(PQa @455299), tiny prune prompt @151521.
Lock: `LOCK_FILE`(BDp=".consolidate-lock" @424663), `HOLDER_STALE_MS`(FDp=3600000 @424664).
Messages: `createMemorySavedMessage`(YGn @589751, `subtype:"memory_saved"`@589754),
`MEMORY_UPDATE_SOURCE_LABELS`(YSf={dream:"Background memory consolidation"} @590643),
`pendingMemoryUpdates`(init@294619 / push@455509 / drain@465837).
Status line: `MemoryUpdateNotification` renderer(Svp @383399), dispatch(SNa @382871).
Watcher: start+scope-split(uFp @449203), team lane(rX @449224), user lane($W @449230),
`isUserStoreEnabled`(lje @289759, `tengu_marble_lark`).

If you discover a NEW symbol not listed above, record it in your manifest so it lands in the symbol
index (`00_overview/symbol_additions_v2_1_183_auto_memory.md`).
