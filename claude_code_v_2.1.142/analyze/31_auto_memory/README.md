# 31 - Auto Memory Core (memdir + types + paths) — v2.1.142

## Overview

The `memdir/` module remains the persistent memory subsystem for Claude Code in v2.1.142 — a file-based store that lives between sessions and is injected into the system prompt as a dynamic section. It is composed of the same three closely-coupled source files seen in v2.1.88 / v2.1.112:

- **`src/memdir/memdir.ts`** — prompt builders, entrypoint loader, content-cap enforcement, ensure-dir helper
- **`src/memdir/memoryTypes.ts`** — closed four-type taxonomy (`user` / `feedback` / `project` / `reference`), frontmatter spec, two `## Types of memory` section variants
- **`src/memdir/paths.ts`** — `~/.claude/projects/<slug>/memory/` resolution, env-var/settings.json overrides, security validation of override paths

This module is the **core** of auto memory. It is the only place where:
- The on-disk filename is named (`MEMORY.md`, via `ENTRYPOINT_NAME`)
- The 200-line / 25,000-byte caps are enforced (`MAX_ENTRYPOINT_LINES`, `MAX_ENTRYPOINT_BYTES`)
- The taxonomy is closed (`MEMORY_TYPES = ['user', 'feedback', 'project', 'reference']`)
- Memory-directory paths are computed (`getAutoMemPath()`)
- Enablement is decided (`isAutoMemoryEnabled()`)

The v2.1.113 → v2.1.142 changelog has **no entry that explicitly names auto memory**, but reading the v2.1.142 obfuscated bundle alongside the v2.1.112 chunks reveals several internal refactors that this unit's documents enumerate. The most significant are:

1. A new **CCR sentinel paths** gate (`Pi$()`, allowlist via `tengu_sepia_cormorant` + `tengu_umber_petrel`) inside `isAutoMemoryEnabled` — disables auto-memory when running inside a remote cohort that was not granted memory access.
2. A new **bare-`~` rejection refinement** in `validateMemoryPath` — adds explicit rejection of paths that normalize to start with `../`.
3. A new **simple-system-prompt branch** (`LY()`) inside `loadMemoryPrompt` that emits a stripped-down `# Memory` section: it just names the directory + an optional cowork extras paragraph + the `## Searching past context` section.
4. The **CLAUDE_COWORK_MEMORY_GUIDELINES** verbatim-override env var (separate from `CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES`) — when set, replaces the entire generated `# auto memory` body with the env-var text.
5. The KAIROS branch is **gone from `loadMemoryPrompt`**. The `getKairosActive` dispatch and the daily-log prompt no longer fork from this entry point; the `logs/YYYY/MM/YYYY-MM-DD.md` path layout only appears as documentation inside a `/dream` skill asset and inside a sessions-recall paragraph for `findRelevantMemories`.
6. A new **single-fact tiny-memory variant** (`yVK` and `hVK`) selected via `gM()` / `tengu_billiard_aviary`. Memories under this variant live in `tiny_memory/`, use a `metadata.type` nested frontmatter field, and gain `[[name]]` wikilink cross-references — a clear divergence from v2.1.112 where wikilinks did not exist.
7. A new **`## Memory files` block** (`### Granularity` + `### Immutability`) that explicitly tells the model "one fact per file" and "memory files are immutable — delete and rewrite, never edit in place."
8. A new **`## Recalled memories in tool results`** section instructing the model to treat `<system-reminder>`-wrapped recall blocks as background context, not user instructions.
9. A new **`## Types of memory` skill-bouncer variant** (`_S1`, gated on `tengu_ochre_finch` via `LK6()`) — collapses the per-type XML into a 4-line bullet list pointing at the `memory-types` skill for full guidance.
10. A new **`/dream`-pruning prompt builder** (`SVK`) for offline memory pruning, taking the memory-dir and optional context.

The unit treats these as **non-breaking but observable refactors**: every v2.1.112 invariant (`MEMORY.md` name, 200-line cap, 25 KB cap, 4-type closed taxonomy, single trailing-sep contract on `getAutoMemPath`) is preserved. The bytes of `loadMemoryPrompt`-emitted prompts have shifted because of the new sections, but the dispatcher's high-level shape (`auto-only` vs `team+auto` vs `disabled`) is the same. See [cross_validation.md](./cross_validation.md) for the precise v2.1.112 ↔ v2.1.142 delta.

## Memory System Architecture (v2.1.142)

```
                       SYSTEM PROMPT BUILDER
                                    │
                                    │ register "memory" dynamic section
                                    ▼
                            loadMemoryPrompt   (c5$)
                            ────────────────
                                    │
                  ┌─────────────────┴─────────────────┐
                  │  isAutoMemoryEnabled? (x9)        │
                  └────┬──────────────┬───────────────┘
                       │ true         │ false
                       │              └──► tengu_memdir_disabled telemetry
                       │                   → returns null (no section)
                       ▼
        ┌──────────────────────────────────────────────────────────────────┐
        │  Dispatch on cowork env var, simple-prompt, tiny-mem, team-mem:  │
        │                                                                  │
        │  CLAUDE_COWORK_MEMORY_GUIDELINES set ─► verbatim # auto memory   │
        │                                                                  │
        │  SIMPLE_SYSTEM_PROMPT && !tiny ──────► simple combined-or-auto   │
        │       (IVK emitter — compact one-block prompt)                   │
        │                                                                  │
        │  SIMPLE_SYSTEM_PROMPT && tiny ───────► simple agent header       │
        │                                                                  │
        │  tiny && teamMem ────────────────────► hVK (tiny dual-dir)       │
        │  tiny && !teamMem ───────────────────► yVK (tiny single-dir)     │
        │                                                                  │
        │  teamMem enabled ────────────────────► buildCombinedMemoryPrompt │
        │       (fS1 — private + team, dual frontmatter, COMBINED types)   │
        │                                                                  │
        │  AUTO only ──────────────────────────► VK6 buildMemoryLines      │
        │       (single directory, INDIVIDUAL types section, with skill    │
        │        bouncer variant if tengu_ochre_finch)                     │
        └─────────┬─────────────────────────────────────┬──────────────────┘
                  │                                     │
                  │ ensureMemoryDirExists(autoDir/teamDir) (PKH)            │
                  │                                     │
                  ▼                                     ▼
        ┌─────────────────────┐               ┌─────────────────────────┐
        │  paths.ts           │               │  memoryTypes.ts         │
        │  ───────────        │               │  ───────────────        │
        │  getAutoMemPath()   │               │  TYPES_SECTION_*        │
        │  └─ env override    │               │  WHAT_NOT_TO_SAVE       │
        │  └─ settings.json   │               │  WHEN_TO_ACCESS         │
        │  └─ <base>/projects │               │  TRUSTING_RECALL        │
        │     /<git-root>/    │               │  RECALLED_IN_TOOL_RESULT│
        │     memory/         │               │  FRONTMATTER (with      │
        │     (or tiny_memory │               │   metadata.type for     │
        │     when gM)        │               │   tiny variant)         │
        └─────────────────────┘               └─────────────────────────┘
                  │                                     │
                  └──────────────┬──────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────────────┐
                    │  buildMemoryPrompt (mVK)        │
                    │  ─────────────────────          │
                    │  1. readFileSync(autoDir +      │
                    │       "MEMORY.md")              │
                    │  2. truncateEntrypointContent   │
                    │       (oi$) — 200L/25KB cap     │
                    │  3. lines = buildMemoryLines    │
                    │       (VK6)                     │
                    │  4. lines.push("## MEMORY.md",  │
                    │       truncated.content)        │
                    │  5. return lines.join("\n")     │
                    └─────────────────────────────────┘
                                 │
                                 ▼
                       <system prompt section>
                       (cached by systemPromptSection)
```

The architectural insight is unchanged: **the entrypoint is a single Markdown file**, not a database. The hard cap (200 lines, 25 KB) keeps the system prompt budget bounded; everything beyond the index lives in topic `.md` files that the model loads on demand with the Read tool. The truncation warning still explicitly tells the model to "move detail into topic files," teaching it the index-vs-detail discipline.

### Three writer paths converge on the same directory

What the above diagram doesn't show: in v2.1.142 there are **three independent writers** that produce content for the same `~/.claude/projects/<slug>/memory/` directory. Understanding the system requires holding all three in mind simultaneously:

```
                    [user/main agent]            [extraction subagent]              [dream subagent]
                          │                              │                                 │
                          │ user types "remember X"      │ post-turn (fires every          │ per-turn check; fires when
                          │ OR # direct-save             │ qualifying turn while           │ tengu_onyx_plover.{minHours,
                          │ OR types /memory             │ tengu_passport_quail is on)     │ minSessions} pass + lock acquired
                          │ to edit MEMORY.md directly   │                                 │
                          v                              v                                 v
                  ┌────────────────┐            ┌────────────────┐                 ┌────────────────┐
                  │  Main agent    │            │ Forked agent   │                 │ Forked agent   │
                  │  writes via    │            │ (per-turn)     │                 │ (across-       │
                  │  Edit/Write    │            │ b85.execute    │                 │ sessions)      │
                  │  tools.        │            │ ExtractMemo-   │                 │ nr7→cr7→lr7    │
                  │                │            │ ries           │                 │                │
                  │  Mutex: tells  │            │  - cursor      │                 │  - hours+lock  │
                  │  the           │            │    based       │                 │    gating      │
                  │  extraction    │            │  - allow-list  │                 │  - same DO8    │
                  │  to skip       │            │    DO8(dir)    │                 │    allow-list  │
                  │  (A$5)         │            │  - notif:      │                 │  - notif:      │
                  │                │            │    "Saved N"   │                 │    "Improved N"│
                  └────────────────┘            └────────────────┘                 └────────────────┘
                          │                              │                                 │
                          └──────────────┬───────────────┴─────────────────────────────────┘
                                         │
                                         v
                              ┌─────────────────────────┐
                              │ ~/.claude/projects/     │
                              │   <slug>/memory/         │
                              │     MEMORY.md           │ ← index, 200L/25KB-capped
                              │     user.md             │ ← topic files (any topic name)
                              │     feedback_x.md       │
                              │     project_y.md        │
                              │     team/...            │ ← optional team subdir
                              │     logs/YYYY/MM/...    │ ← session activity logs (dream input)
                              └─────────────────────────┘
                                         │
                                         │ next session start / next loadMemoryPrompt
                                         v
                                  loaded into system prompt
                                  (with optional truncation
                                   warning if over caps)
```

**Mutual-exclusion contract:** main agent and extraction are mutually exclusive *per turn* (extraction's `hasMemoryWritesSince` detector). Dreaming and extraction can in principle overlap (different timing horizons) but in practice dream's lock + minHours throttle make collisions vanishingly rare.

**Sandbox:** extraction and dream both use the same `DO8(memoryDir)` allow-list (read/grep/glob unrestricted; bash/powershell read-only or `rm`/`Remove-Item` for `*.md` in dir; edit/write only for memoryDir paths; tiny mode adds Edit-deny for immutability). Main agent has no such sandbox — it can write anywhere the user permits.

**Notification verbs:** extraction emits "Saved", dream emits "Improved", main-agent inline writes don't auto-emit (the model says what it did in its turn response).

See [extract_memories_runtime.md](./extract_memories_runtime.md) and [auto_dream_runtime.md](./auto_dream_runtime.md) for the per-writer details.

What changed in v2.1.142 is the **degree of variation** in the prompt text the model sees on session start:

- Five dispatch branches in `loadMemoryPrompt` (was three in v2.1.112): cowork-verbatim, simple-system-prompt, tiny-memory, team-memory, single-auto.
- Two coexisting frontmatter formats: top-level `type:` (legacy / non-tiny) and `metadata.type:` (tiny).
- Two coexisting cross-reference idioms in `MEMORY.md`: plain Markdown links (`[Title](file.md)`, used by the index-keeping flow) and wikilinks (`[[name]]`, used by the no-index single-fact flow).
- Three coexisting "Types of memory" prompt variants: COMBINED (private+team), INDIVIDUAL (single dir, full prose), and BOUNCER (4-bullet pointer to the `memory-types` skill).

These all coexist in **one binary** chosen at runtime by feature flags and environment.

## Files in This Unit

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Module overview, architecture diagram, file/types/lifecycle summary, v2.1.112→v2.1.142 delta (this file) |
| [memdir_core.md](./memdir_core.md) | Deep deobfuscation of `memdir.ts` — `ENTRYPOINT_NAME`, `buildMemoryPrompt`, `buildMemoryLines`, `truncateEntrypointContent`, `ensureMemoryDirExists`, `logMemoryDirCounts`, `loadMemoryPrompt` dispatcher, `buildAgentMemoryPrompt`, `SVK` dream prompt |
| [memory_types.md](./memory_types.md) | Closed 4-type taxonomy, `parseMemoryType`, the three `TYPES_SECTION_*` variants (COMBINED + INDIVIDUAL + BOUNCER), supporting prompt sections, frontmatter helpers |
| [paths.md](./paths.md) | `getAutoMemPath` resolution chain, `isAutoMemoryEnabled` 7-step priority (with CCR sentinel paths), security validation of override paths, tiny-memory dirname switching |
| [frontmatter_parsing.md](./frontmatter_parsing.md) | YAML frontmatter parsing, validation, dual-format support (`type:` vs `metadata.type:`), wikilink cross-references (NEW) |
| [memory_age.md](./memory_age.md) | Memory entry timestamp tracking, age-based filtering, freshness caveat |
| [memory_scan.md](./memory_scan.md) | Directory enumeration, file pattern matching, manifest formatting |
| [find_relevant_memories.md](./find_relevant_memories.md) | Relevance ranking, recall heuristics, selector + synthesizer modes |
| [attachment_normalization.md](./attachment_normalization.md) | How memories are prepared for system-prompt injection (`relevant_memories` / `nested_memory` cases) |
| [messages_integration.md](./messages_integration.md) | How memory section wires into system prompt builder, end-to-end pipeline |
| [team_memory.md](./team_memory.md) | Team-shared memory variant, cross-session sync, prompt assembly |
| [team_paths.md](./team_paths.md) | `~/.claude/projects/<slug>/memory/team/` path resolution, traversal defenses |
| [extract_memories_runtime.md](./extract_memories_runtime.md) | **NEW** — `b85.executeExtractMemories` and the entire `Co7`-triggered background extraction flow: trigger gate (`Wi$`), closure-scoped state (`M$5`), cursor tracking, throttling, coalescing, fork harness, `canUseTool` restrictions (`DO8`), prompt builder (`hr7`), draining for `-p` mode |
| [auto_dream_runtime.md](./auto_dream_runtime.md) | **NEW** — `/dream` slash command (gated on `tengu_kairos_dream`, default false) + auto-dream background scheduler (`nr7` / `cr7` / `lr7`, gated on `tengu_onyx_plover.enabled`/`available` or `tengu_herring_clock`, default disabled), the 4-phase consolidation prompt (`SL$` / `SVK`), thresholds via `tengu_onyx_plover.{minHours,minSessions}`, filesystem locking, `pendingMemoryUpdates` queue + `memory_update` attachment for next-turn ambient context, and a clarification that `memory_20250818` is the Anthropic managed-agent memory tool (NOT Claude Code auto-memory) |
| [memory_ui.md](./memory_ui.md) | **NEW** — `/memory` Dialog (`sj5` / `oj5` / `R54`), `/toggle-memory` (`ej5` / `tj5`), `MemoryUpdateNotification` (`Oc_`), `UserMemoryInputMessage` (`Pb7`), status-bar suggestions (`cw5` token budget, `GG5` large-file warning), and the end-to-end UI lifecycle |
| [memory_save_survey.md](./memory_save_survey.md) | **NEW** — `gY$` (capture), `PcK` (reject/undo) — the v2.1.142-only feedback subsystem with content-change guard, structured-patch display, and `memory_save_capture` / `memory_save_reject` telemetry |
| [cross_validation.md](./cross_validation.md) | v2.1.88 TypeScript ↔ v2.1.142 obfuscated cross-reference + full v2.1.112 ↔ v2.1.142 delta table |

Plus index-side additions live in:

- [`../00_overview/symbol_additions_v2_1_142_auto_memory.md`](../00_overview/symbol_additions_v2_1_142_auto_memory.md) — every new symbol mapping discovered in this unit.

## Types Taxonomy (Summary)

The taxonomy is still **closed** — exactly four allowed values:

```typescript
export const MEMORY_TYPES = ['user', 'feedback', 'project', 'reference'] as const
export type MemoryType = (typeof MEMORY_TYPES)[number]
```

| Type | What it captures | Default scope |
|------|------------------|---------------|
| `user` | Role, goals, responsibilities, knowledge — *who the user is* | always private |
| `feedback` | Corrections + confirmations of approaches — *how to work with the user* | default private; team only if project-wide |
| `project` | Ongoing work, deadlines, incidents not derivable from code | default team-leaning, can be private |
| `reference` | Pointers to external systems (Linear, Slack, Grafana) | usually team |

`parseMemoryType()` (chunks.99-equivalent `VVK`) still returns `undefined` for any unknown string, so legacy files without a `type:` field keep working — the system **degrades gracefully** instead of erroring.

**v2.1.142 addition**: The tiny-memory variant (`gM() === true`) restricts the saveable set to **three** types: `['user', 'feedback', 'project']` (`WK6`). The `reference` type is **dropped** from the prompt that the agent reads in tiny mode, on the apparent assumption that an external pointer fits in a `project` memory if it matters enough to save. But `parseMemoryType` still accepts all four — so legacy `reference` files on disk continue to be read and indexed correctly.

Each type also still carries embedded `<when_to_save>`, `<how_to_use>`, and `<examples>` blocks in the COMBINED / INDIVIDUAL prompts, with a new `<body_structure>` block per type added in the tiny variant. See [memory_types.md](./memory_types.md) for the full taxonomy and prompt text.

## Prompt-Injection Lifecycle

The memory section is still injected as one of the system prompt's dynamic sections each turn. The pipeline is structurally the same as v2.1.112 with the new dispatch branches inside `c5$` (the new name for `loadMemoryPrompt`):

1. **Registration**: The system prompt builder registers `"memory"` as a dynamic section. Each section is cached by `systemPromptSection` until something dirties it.
2. **Dispatch** (`loadMemoryPrompt` → `c5$`):
   - Reject if `isAutoMemoryEnabled() === false` → return `null` and emit `tengu_memdir_disabled`.
   - If `CLAUDE_COWORK_MEMORY_GUIDELINES` env var is set → return `# auto memory\n${envVar}` verbatim (no taxonomy, no how-to-save).
   - If `LY()` (simple system prompt) is on and **not** tiny → call `IVK` (the simple-form dual-directory prompt) with private + optional team paths.
   - If `LY()` is on and tiny → return a one-line agent header pointing at `{path, cowork-extras, search section}`.
   - If tiny and team-mem enabled → `hVK` (tiny dual-dir + COMBINED tiny types).
   - If tiny and only auto-mem → `yVK` (tiny single-dir + INDIVIDUAL tiny types).
   - If team-mem enabled (non-tiny) → `OS1.buildCombinedMemoryPrompt` (resolves to function `fS1` on the `xVK` namespace — private + team, dual frontmatter, COMBINED).
   - Otherwise → `VK6.buildMemoryLines` (single directory, INDIVIDUAL types section).
3. **Directory ensured** (`ensureMemoryDirExists` → `PKH`): Recursive mkdir; errors are logged at debug level but never thrown.
4. **Content read** (`buildMemoryPrompt` only — for the per-agent override variant `mVK`): `readFileSync(memoryDir + "MEMORY.md")`. Failure is silent — no file simply means an empty index.
5. **Truncation** (`truncateEntrypointContent` → `oi$`):
   - Line-truncate first to 200 lines (natural boundary).
   - Then byte-truncate to 25 KB, cutting at the last `\n` before the cap to avoid mid-line cuts.
   - Append a contextual `WARNING:` line that names which cap fired (lines, bytes, or both).
   - **Unchanged from v2.1.112.**
6. **Assembly**: `lines.push("## MEMORY.md", "", t.content)` — the truncated content becomes one section of the larger prompt.
7. **Join + cache**: Final string is returned and cached by `systemPromptSection("memory", ...)` until the section is invalidated.
8. **Telemetry**: `logMemoryDirCounts` (`jl`) fires asynchronously with `total_file_count` / `total_subdir_count` and the truncation flags. Fire-and-forget — never blocks prompt building.

Key insight: the system prompt is still built **synchronously**, but the telemetry that reports counts is async. This is deliberate — directory enumeration could block on a slow filesystem, but the prompt must be ready before the LLM call. Telemetry catches up later.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory belongs here once promoted)
> - [symbol_additions_v2_1_142_auto_memory.md](../00_overview/symbol_additions_v2_1_142_auto_memory.md) - New symbols added by this unit

Key core-feature symbols in v2.1.142:

**memdir core (`c5$` dispatcher region, lines 141432–143000):**
- `ENTRYPOINT_NAME` (`xj`, `nh1`) - String constant `"MEMORY.md"` (cli_inner_pretty.js:141682, 139836)
- `MAX_ENTRYPOINT_LINES` (`jKH`) - Integer 200 (cli_inner_pretty.js:141683)
- `MAX_ENTRYPOINT_BYTES` (`d5$`) - Integer 25000 (cli_inner_pretty.js:142953)
- `AUTO_MEM_DISPLAY_NAME` (`TK6`) - Literal `"auto memory"` (cli_inner_pretty.js:142954)
- `loadMemoryPrompt` (`c5$`) - Top-level dispatcher (cli_inner_pretty.js:142855-142927)
- `buildMemoryPrompt` (`mVK`) - Agent-memory variant that includes content inline (cli_inner_pretty.js:142805-142828)
- `buildMemoryLines` (`VK6`) - Behavioral instructions without MEMORY.md content (cli_inner_pretty.js:142743-142804)
- `buildMemoryLinesTiny` (`yVK`) - Tiny single-dir variant (cli_inner_pretty.js:142167-142215)
- `buildCombinedMemoryPromptTiny` (`hVK`) - Tiny dual-dir variant (cli_inner_pretty.js:142216-142272)
- `buildSimpleMemoryPrompt` (`IVK`) - Compact single-block prompt for simple-system-prompt branch (cli_inner_pretty.js:142273-142312)
- `buildDreamPrompt` (`SVK`) - `/dream` pruning prompt builder (cli_inner_pretty.js:142313-142340)
- `buildCombinedMemoryPrompt` (`fS1`, exposed on `xVK` namespace as `OS1.buildCombinedMemoryPrompt`) - Non-tiny team dual-dir prompt (cli_inner_pretty.js:142599-142671)
- `truncateEntrypointContent` (`oi$`) - 200L/25KB cap enforcer (cli_inner_pretty.js:142678-142716)
- `ensureMemoryDirExists` (`PKH`) - Idempotent recursive mkdir (cli_inner_pretty.js:142717-142725)
- `logMemoryDirCounts` (`jl`) - Async file/subdir count telemetry (cli_inner_pretty.js:142726-142742)
- `getAutoMemPath` (`UY`) - Memoized path resolver (cli_inner_pretty.js:139849-139857)
- `isAutoMemoryEnabled` (`x9`) - 7-step enablement chain (cli_inner_pretty.js:139749-139760)
- `isCcrSentinelDisabled` (`Pi$`) - CCR cohort kill-switch via `tengu_sepia_cormorant` + `tengu_umber_petrel` (cli_inner_pretty.js:139761-139768)
- `isTinyMemoryEnabled` (`gM`) - `tengu_billiard_aviary` flag (cli_inner_pretty.js:139780-139782)
- `isSimpleSystemPromptEnabled` (`LY`) - Memoized predicate gated on `tengu_vellum_lantern` and other signals (cli_inner_pretty.js:141432-141439)
- `isBouncerEnabled` (`LK6`) - `tengu_ochre_finch` flag (cli_inner_pretty.js:141958-141960)
- `parseMemoryType` (`VVK`) - Validating string→MemoryType coercion (cli_inner_pretty.js:141954-141957)
- `MEMORY_TYPES` (`JK6`) - The closed 4-element array (cli_inner_pretty.js:141990)
- `TINY_MEMORY_TYPES` (`WK6`) - 3-element array for tiny variant (cli_inner_pretty.js:142352)
- `validateMemoryPath` (`VTK`) - Override-path security validator (cli_inner_pretty.js:139783-139803)

**Runtime extraction (`b85` namespace, lines 388989–389351; see [extract_memories_runtime.md](./extract_memories_runtime.md)):**
- `isExtractModeActive` (`Wi$`) - Master gate; reads `tengu_passport_quail` + `tengu_slate_thimble` (cli_inner_pretty.js:139769-139772)
- `autoMemExtractionModule` (`jO8`, referenced as `b85` elsewhere) - Namespace exporting `init`/`execute`/`drain`/`createAutoMemCanUseTool` (cli_inner_pretty.js:389043-389049)
- `initExtractMemories` (`M$5`) - Closure factory, called once at startup (cli_inner_pretty.js:389216-389339)
- `executeExtractMemories` (`w$5`) - The public entry called by Co7 each turn (cli_inner_pretty.js:389341-389343)
- `drainPendingExtraction` (`D$5`) - Awaits all in-flight extractions; called from `-p` print path (cli_inner_pretty.js:389344-389346)
- `createAutoMemCanUseTool` (`DO8`) - Strict tool allow-list for the forked agent (cli_inner_pretty.js:389161-389193)
- `runExtraction` (`z`, inner) - The core extraction loop (cli_inner_pretty.js:389223-389312)
- `executeExtractMemoriesImpl` (`Y`, inner) - The gate-checked dispatcher with in-progress coalescing (cli_inner_pretty.js:389314-389325)
- `buildExtractionPrompt` (`hr7`) - The prompt template; merged auto+team builder (cli_inner_pretty.js:388989-389034)
- `denyAutoMemTool` (`wO8`) - The deny-result factory; emits `tengu_auto_mem_tool_denied` (cli_inner_pretty.js:389106-389112)
- `validatePosixMemoryRm` (`f$5`) - Allows `rm <flag>... path.md` only inside memoryDir (cli_inner_pretty.js:389130-389160)
- `validatePowerShellRemoveItem` (`Y$5`) - Allows `Remove-Item path.md` aliases only inside memoryDir (cli_inner_pretty.js:389113-389129)
- `isUserProseMessage` (`br7`) - Filter: type=user, !meta, ≥3 whitespace-separated tokens (cli_inner_pretty.js:389087-389093)
- `MIN_USER_PROSE_TOKENS` (`Rr7`) - 3 (cli_inner_pretty.js:389349)
- `hasMemoryWritesSince` (`A$5`) - Mutual-exclusion detector (cli_inner_pretty.js:389067-389083)
- `countModelVisibleMessagesSince` (`_$5`) - Cursor-based message counter with compaction fallback (cli_inner_pretty.js:389053-389066)
- `hasUserProseSince` (`z$5`) - Cursor-based prose-presence check with compaction fallback (cli_inner_pretty.js:389094-389105)
- `extractWrittenPaths` (`O$5`) - Pulls unique file paths from forked-agent tool calls (cli_inner_pretty.js:389203-389215)
- `getWrittenFilePath` (`ur7`) - Edit/Write tool_use → file_path extractor (cli_inner_pretty.js:389194-389202)
- `isModelVisibleMessage` (`cE6`) - type=user or type=assistant (cli_inner_pretty.js:389050-389052)
- `extractor` (`mr7`, closure-scoped) - The wired extractor function (cli_inner_pretty.js:389327-389335)
- `drainer` (`Br7`, closure-scoped) - The wired drainer function (cli_inner_pretty.js:389336-389339)
- `createMemorySavedMessage` (`JO8`) - System message factory (cli_inner_pretty.js:425477-425486)

**UI surfaces (see [memory_ui.md](./memory_ui.md)):**
- `memoryCommand` (`sj5`, exported as `g54`) - `/memory` slash command (cli_inner_pretty.js:446024-446031)
- `memoryCommandCall` (`aj5`) - The /memory call function that primes caches and returns React element (cli_inner_pretty.js:446006-446008)
- `MemoryCommandDialog` (`oj5`) - Dialog wrapper around MemoryFileSelector (cli_inner_pretty.js:445~980)
- `MemoryFileSelector` (`R54`) - Picker for memory files + toggles (cli_inner_pretty.js:445399-445685)
- `MemoryUpdateNotification` (`Oc_`) - Renderer for `memory_saved` system messages (cli_inner_pretty.js:349234-349287)
- `MemoryFileLink` (`wc_`) - Clickable filename row (cli_inner_pretty.js:349291)
- `UserMemoryInputMessage` (`Pb7`) - Renders the `# <text>` direct-save block (cli_inner_pretty.js:346068-346108)
- `randomAckMessage` (`oQ_`) - Picks one of ("Got it.", "Good to know.", "Noted.") (cli_inner_pretty.js:346065-346067)
- `toggleMemoryCommand` (`ej5`, exported as `wx6`) - `/toggle-memory` slash command (cli_inner_pretty.js:446058-446071)
- `toggleMemoryCall` (`tj5`) - Toggle handler; updates `U$.memoryToggledOff` and emits `tengu_memory_toggled` (cli_inner_pretty.js:446035-446048)
- `isMemoryToggledOff` (`Rd`) - Session-scoped toggle accessor (cli_inner_pretty.js:2734-2736)
- `setMemoryToggledOff` (`Kv8`) - Session-scoped toggle setter (cli_inner_pretty.js:2737-2739)
- `pushMemoryTokenSuggestion` (`cw5`) - "Memory files using X tokens (Y%)" suggestion (cli_inner_pretty.js:440856-440874)
- `MIN_MEMORY_PCT_THRESHOLD` (`pw5`) - 5 (cli_inner_pretty.js:440888)
- `MIN_MEMORY_TOKEN_THRESHOLD` (`Uw5`) - 5000 (cli_inner_pretty.js:440889)
- `largeMemoryFilesWarning` (`GG5`) - Per-file size warning (cli_inner_pretty.js:469962-469989)
- `OPEN_FOLDER_SENTINEL` (`sW$`) - `"__open_folder__"` (cli_inner_pretty.js:445716)
- `OS_HEAD_KEYBOARD_HOOK` / editor launcher (`Lj8`, `AS`) - Spawn `$EDITOR`/`$VISUAL`, alternate-screen for terminal editors (cli_inner_pretty.js:445773-445888)
- `getRelativeMemoryPath` (`u54`) - `~/` and `./` rewriting for display (cli_inner_pretty.js:445746-445753)

**Memory-save survey (v2.1.142 NEW, see [memory_save_survey.md](./memory_save_survey.md)):**
- `isMemorySurveyEnabled` (`KY6`) - 4-condition gate (cli_inner_pretty.js:207765-207767)
- `getMemorySurveyConfig` (`qY6`) - Schema-validated Growthbook config reader (cli_inner_pretty.js:207756-207761)
- `captureMemorySave` (`gY$`) - Capture entry; 5 skip conditions (cli_inner_pretty.js:207768-207789)
- `rejectMemorySave` (`PcK`) - Undo path with content-change guard (cli_inner_pretty.js:207901-207923)
- `formatCaptureForSurvey` (`LcK`) - Unified-diff vs full-content formatter (cli_inner_pretty.js:207888-207900)
- `cleanupEmptyParentDirs` (`XH_`) - Post-delete dir cleanup (cli_inner_pretty.js:207925-...)
- `removeCaptureById` (`McK`) - Filter-by-id helper (cli_inner_pretty.js:207790-207794)
- Row-counting helpers (`wcK`, `DcK`, `jcK`, `JcK`, `XcK`, `JH_`, `I3H`) - Survey UI text-wrapping math (cli_inner_pretty.js:207795-207887)

**Stop-hook integration:**
- `Co7` (runStopHookChain) - Calls **both** memory writers per turn:
  - `b85.executeExtractMemories(M, A.appendSystemMessage)` at line 391666 when `Wi$()` && `!agentId` — per-turn extraction subagent ([extract_memories_runtime.md](./extract_memories_runtime.md))
  - `nr7(M, A.appendSystemMessage)` at line 391667 when `!agentId` — auto-dream gate check; fires the dream subagent if `k$5()` AND threshold-since-last + lock all pass ([auto_dream_runtime.md](./auto_dream_runtime.md))
  - (See also [`../39_goal/goal_stop_hook_consumer.md`](../39_goal/goal_stop_hook_consumer.md) for the same orchestrator from the goal-feature perspective)

**Auto-dream (`nr7` / `cr7` / `lr7`, lines 389406-389677; see [auto_dream_runtime.md](./auto_dream_runtime.md)):**
- `initAutoDream` (`lr7`) - Closure factory for the auto-dream extractor (cli_inner_pretty.js:389509-389637)
- `runAutoDreamCheck` (`nr7`) - Public entry called by Co7 (cli_inner_pretty.js:389669-389671)
- `autoDreamExtractor` (`cr7`, closure-scoped) - The wired auto-dream function (cli_inner_pretty.js:389511-389636)
- `isAutoDreamEnabled` (`k$5`) - Gate combining `!CN`, `!I6`, `x9`, `hL$` (cli_inner_pretty.js:389500-389504)
- `isAutoDreamFeatureToggleable` (`hL$`) - User-toggle-respecting wrapper around `OO8`; precedence: `OO8` precondition → user setting → `tengu_onyx_plover.enabled` → `ii$()` fallback (cli_inner_pretty.js:388970-388976)
- `isAutoDreamServerSideOptIn` (`OO8`) - The precondition: `tengu_onyx_plover.enabled` OR `tengu_onyx_plover.available` OR `ii$()` (cli_inner_pretty.js:388965-388969)
- `getDreamConfig` (`yr7`) - Reads `tengu_onyx_plover` Growthbook flag (default `null`) (cli_inner_pretty.js:388962-388964)
- `isTeamMemServerHasContent` (`ii$`) - The team-memory-server fallback: `g5$()` AND `_v8() === "has-content"` (cli_inner_pretty.js:142518-142521)
- `isHerringClockEnabled` (`g5$`) - `x9() && tengu_herring_clock` (default `false`) (cli_inner_pretty.js:142511-142514)
- `getTeamMemoryServerStatus` (`_v8`) - Reads `U$.teamMemoryServerStatus` (cli_inner_pretty.js:2740)
- `getDreamThresholds` (`v$5`) - Reads `tengu_onyx_plover` for `minHours`/`minSessions`, falls back to `gr7` defaults (cli_inner_pretty.js:389489-389498)
- `isAutoDreamForcedRun` (`N$5`) - Returns false in v2.1.142 (kill switch placeholder) (cli_inner_pretty.js:389506-389508)
- `AUTO_DREAM_SCAN_THROTTLE_MS` (`V$5`) - 10-minute scan throttle between gate-check attempts (= 600000) (cli_inner_pretty.js:389675)
- `AUTO_DREAM_THRESHOLD_DEFAULTS` (`gr7`) - Compile-time `{minHours, minSessions}` defaults (cli_inner_pretty.js:389676)
- `buildDreamPrompt` (`SL$`) - The 4-phase dream prompt (Orient/Gather/Consolidate/Prune) for non-tiny mode (cli_inner_pretty.js:389406-389472)
- `buildDreamPromptTiny` (`SVK`) - The tiny-mode dream prompt with immutability rules (cli_inner_pretty.js:142313-142340; see memdir_core.md)
- `TEAM_DREAM_PHASE_GUIDANCE` (`Z$5`) - Inserted when teamMem enabled (cli_inner_pretty.js:389474)
- `RECONCILE_AGAINST_CLAUDEMD` (`G$5`) - Inserted in Phase 4 of every dream (cli_inner_pretty.js:389476-389484)
- `trackDreamFilesTouched` (`E$5`) - onMessage callback aggregating Edit/Write file_paths + rm/Remove-Item paths from the dream subagent (cli_inner_pretty.js:389638-389659)
- `aggregateDreamProgress` (`Pd7`) - Stores per-message tracking on the task registry
- `acquireDreamLock` (`jd7`) - Atomic mtime touch on lastConsolidatedAt; null on contention
- `releaseDreamLock` (`tf8`) - Rollback on dream failure
- `readLastConsolidatedAt` (`sf8`) - Read consolidatedAt mtime
- `listSessionsTouchedSince` (`Jd7`) - List session UUIDs with activity since the given mtime
- `registerDreamTask` (`Ld7`) - Add a task record to the registry for tracking
- `finalizeDreamTask` (`Wd7`) - Mark the task complete
- `rollbackDreamTask` (`Zd7`) - Mark the task failed
- `isDreamTaskRecord` (`kN6`) - Type guard for the dream task variant
- `countDailyLogs` (`y$5`) - Count .md files under `<memoryDir>/logs/` recursively, used in completion telemetry
- `tengu_auto_dream_skipped` - Telemetry (with reasons "sessions" or "lock")
- `tengu_auto_dream_fired` - Telemetry on successful gate pass
- `tengu_auto_dream_completed` - Telemetry on successful completion (with cache stats, files_touched_count)
- `tengu_auto_dream_failed` - Telemetry on exception (with phase: "fork" or "completion", error_class)
- `tengu_dream_invoked` - Telemetry on user `/dream` invocation (with mode: "consolidate" or "schedule")

**`/dream` slash command (see [auto_dream_runtime.md](./auto_dream_runtime.md)):**
- `registerDreamSkill` (`z8A`) - Slash command registration; called once from `bt4` (cli_inner_pretty.js:597558-597561), itself triggered during bundled-skills init (cli_inner_pretty.js:588290-588339)
- `isDreamSkillEnabled` (`K8A`) - Skill enable gate: `!CN() && x9() && tengu_kairos_dream`; default false in v2.1.142 (cli_inner_pretty.js:588247-588249)
- `tengu_kairos_dream` Growthbook flag (default `false`) — must be opted in per cohort for `/dream` to appear in the slash command list
- `getDreamCronSchedule` (`_8A`) - Returns default cron schedule (cli_inner_pretty.js:588250)
- `buildDreamSchedulePrompt` (`A8A`) - Prompt for `/dream nightly` (cli_inner_pretty.js:588254)
- `SCHEDULE_MODE_REGEX` (`H8A`) - `/^(nightly|schedule|overnight)\b/i` (cli_inner_pretty.js:588355)
- `touchLastConsolidatedAt` (`Xd7`) - Updates the mtime that auto-dream uses for throttle (cli_inner_pretty.js:377722)
- `pendingMemoryUpdates` - appState queue holding `{source: "dream", summary, paths}` items (default `[]` at cli_inner_pretty.js:278774)
- `drainPendingMemoryUpdates` (`Eq5`) - Drains the queue and emits `memory_update` attachments (cli_inner_pretty.js:398623-398636)
- `memory_update` attachment renderer at cli_inner_pretty.js:425292-425311 - Produces the next-turn ambient context message
- `MEMORY_UPDATE_SOURCE_LABELS` (`Cz5`) - `{dream: "Background memory consolidation"}` (cli_inner_pretty.js:426254)

**API surface (NOT part of Claude Code auto-memory — clarification):**
- `memory_20250818` (string literal at cli_inner_pretty.js:592878, 597192) — The Anthropic Managed Agents memory tool. Documentation strings only. Independent of Claude Code's local auto-memory.
- `client.beta.memory_stores.*` (text fragment at cli_inner_pretty.js:594173) — Anthropic SDK docs for Managed Agents memory stores, bundled for the model to reference when answering customer questions about the API. No call sites; not used by Claude Code itself.

## Version Notes (v2.1.112 vs v2.1.142)

The summary table below captures the major v2.1.112 → v2.1.142 differences in this module. The full mapping and code-level diff lives in [cross_validation.md](./cross_validation.md).

| Concern | v2.1.112 | v2.1.142 | Change |
|---|---|---|---|
| `ENTRYPOINT_NAME` value | `"MEMORY.md"` | `"MEMORY.md"` | Unchanged |
| `MAX_ENTRYPOINT_LINES` | 200 | 200 | Unchanged |
| `MAX_ENTRYPOINT_BYTES` | 25000 | 25000 | Unchanged |
| `MEMORY_TYPES` (full) | `['user','feedback','project','reference']` | `['user','feedback','project','reference']` | Unchanged |
| `TINY_MEMORY_TYPES` | none | `['user','feedback','project']` | **New** — tiny variant drops `reference` from the prompt |
| Frontmatter format | top-level `type:` | both top-level `type:` (default) and `metadata.type:` (tiny) | **New format coexists** |
| Wikilinks in body | not used | `[[name]]` cross-references (tiny variant) | **New** |
| `## Memory files / Granularity / Immutability` block | not in prompt | present in tiny variants | **New** |
| `## Recalled memories in tool results` block | not in prompt | present in tiny variants | **New** |
| `TYPES_SECTION_BOUNCER` (skill pointer) | none | `_S1`, gated on `tengu_ochre_finch` (`LK6()`) | **New** — emits 4-line bullet list when active |
| `loadMemoryPrompt` dispatch branches | 3 (auto-only / team / disabled, plus KAIROS) | 5 (cowork-verbatim / simple / tiny / team / auto-only / disabled) | **Expanded** — KAIROS gone, tiny + simple + cowork-verbatim added |
| `CLAUDE_COWORK_MEMORY_GUIDELINES` env var | not used in memdir | full verbatim override of memory prompt body | **New** |
| Simple system prompt branch (`LY()`) | not in memdir | new branch in `loadMemoryPrompt` | **New** |
| KAIROS daily-log prompt | inlined in `loadMemoryPrompt` | **gone from `loadMemoryPrompt`**; remnants only in `/dream` skill asset | **Removed** from runtime dispatch |
| `getAutoMemDailyLogPath` (KAIROS helper) | exported | not present | **Removed** |
| `isAutoMemoryEnabled` chain | 5 steps + `Qg()` short-circuit | 7 steps (adds `Rd()` and `Pi$()` CCR-sentinel allowlist) | **Extended** |
| `validateMemoryPath` bare-tilde reject | `'.'` / `'..'` only | adds `startsWith('../')` and `startsWith('..\\')` family | **Tightened** |
| `getAutoMemPath` cache key | `${getProjectRoot()}|${tinyMemFlag()}` | `${getProjectRoot()}|${tinyMemFlag()}` | Unchanged |
| Tiny-memory dirname | `tiny_memory` (used) | `tiny_memory` (used) | Unchanged |
| `truncateEntrypointContent` algorithm | line-first then byte-trim at last newline | identical | Unchanged |
| `parseMemoryType` validator | `MEMORY_TYPES.find(t === raw)` | `JK6.find(t === raw)` | Unchanged (rename only) |
| `parseFrontmatter` two-pass | strict + autoQuote fallback | strict + autoQuote fallback | Unchanged |
| `findRelevantMemories` selector | `uC4` | renamed but same shape (per-dir state, ephemeral cache, `[memdir] selectRelevantMemories failed`) | Unchanged at behavior level |
| `findRelevantMemories` synthesizer | `mC4` (flagged via `wH`/`tengu_billiard_aviary`) | `gK7` (flagged via `gM`/`tengu_billiard_aviary`) | Unchanged at behavior level |
| `memoryAgeDays` formula | `Math.max(0, Math.floor((Date.now()-mtimeMs)/86_400_000))` | identical | Unchanged |
| `memoryFreshnessText` threshold | `≤ 1 day → ""` | identical | Unchanged |
| `memoryHeader` text | `Memory: <path>:` (fresh) / staleness + `Memory:` (stale) | identical | Unchanged |
| `relevant_memories` renderer | `case "relevant_memories": ...` | identical | Unchanged |
| `nested_memory` renderer | `case "nested_memory": ...` | identical | Unchanged |
| `MAX_SESSION_BYTES` | 61440 | 61440 | Unchanged |
| `MEMORY_READ_MAX_LINES / MEMORY_READ_MAX_BYTES` | 200 / 4096 | 200 / 4096 | Unchanged |
| `SVK` dream-pruning prompt | not present | new offline-pruning prompt builder | **New** |

The v2.1.142 changes are best understood as **prompt-engineering refinements**, not algorithm changes. Everything that touched disk in v2.1.112 still works the same way in v2.1.142 (same paths, same caps, same validators). What shifted is what the prompt looks like and which feature flags route memory through which prompt — all in service of the tiny-memory experiment that lets each fact live in its own atomic file and gets rid of the manually-maintained `MEMORY.md` index.

## Runtime + UI Additions vs v2.1.88

The above table only covers the memdir prompt-builder layer. v2.1.142 also adds (or in many cases preserves from v2.1.88) **runtime** and **UI** subsystems that were previously undocumented in this unit. The full delta:

| Concern | v2.1.88 (TS) | v2.1.142 (obfuscated) | Change |
|---|---|---|---|
| `executeExtractMemories` entry | `src/services/extractMemories/extractMemories.ts:598` | `w$5` at cli_inner_pretty.js:389341 | Preserved (1:1 mapping) |
| `initExtractMemories` closure factory | line 296 | `M$5` at 389216 | Preserved |
| `drainPendingExtraction` | line 611 | `D$5` at 389344 | Preserved |
| `createAutoMemCanUseTool` validator | line 171 | `DO8` at 389161 | Preserved + extended (Rd/Toggle short-circuit, gM/Tiny edit-deny, rm/Remove-Item allow-list) |
| `buildExtractAutoOnlyPrompt` + `buildExtractCombinedPrompt` | `src/services/extractMemories/prompts.ts:29–94` (two functions) | `hr7` at 388989 (one merged function with `teamMemoryEnabled` param) | **Merged** into single function |
| `runForkedAgent` wrapper | called with `skipTranscript`, `maxTurns:5`, `forkLabel:"extract_memories"` | identical: `JV()` at 389254 with same params | Preserved |
| `tengu_passport_quail` master gate | line 536 | `Wi$` at 139769 | Preserved + nested non-interactive override `tengu_slate_thimble` |
| `tengu_bramble_lintel` throttle | line 381 (default 1) | line 389242 (default 1) | Preserved |
| `pendingContext` trailing-run coalescing | line 320 | closure var `A` at 389222 | Preserved |
| `lastMemoryMessageUuid` cursor | line 307 | closure var `$` at 389218 | Preserved with same compaction-fallback semantics |
| `hasMemoryWritesSince` mutual-exclusion | line 121 | `A$5` at 389067 | Preserved |
| `tengu_extract_memories_*` telemetry events | 5 events | 5 events: same names, same payloads | Preserved |
| `tengu_auto_mem_tool_denied` telemetry | line 156 | line 389109 | Preserved |
| /memory slash command | `src/commands/memory/memory.tsx` | `sj5`+`aj5`+`oj5` at 446024 / 446006 / ~445980 | Preserved (1:1 mapping) |
| `MemoryFileSelector` | `src/components/memory/MemoryFileSelector.tsx` | `R54` at 445399 | Preserved + extended (Auto-memory toggle, Auto-dream toggle, CCR sentinel disabled message, per-agent memory folder shortcuts) |
| `MemoryUpdateNotification` | `src/components/memory/MemoryUpdateNotification.tsx` (line 21, "Memory updated in {path} · /memory to edit") | `Oc_` at 349234 (count-summary "Saved N memories" + file-list + overflow collapse) | **Rewritten** — v2.1.142 shows N-saves summary with collapsible file list, v2.1.88 showed a single-path "Memory updated" |
| `createMemorySavedMessage` | `src/utils/messages.ts:4460-4471` | `JO8` at 425477 | Preserved + `teamCount` field |
| `/toggle-memory` command | not present | `ej5`+`tj5` at 446058 / 446035 | **New** (gated rollout — `isEnabled: () => !1` by default) |
| Memory toggle session state | not present | `U$.memoryToggledOff` accessed via `Rd`/`Kv8` at 2734-2739 | **New** |
| Status-bar token suggestion | not present | `cw5` at 440856 (≥5% AND ≥5000 tokens → suggestion) | **New** |
| Status-bar large-file warning | not present | `GG5` at 469962 (per-file size warning, `/memory to edit` hint) | **New** |
| Memory-save survey capture | not present | `gY$` at 207768 + `PcK` at 207901 + survey UI plumbing | **New** in v2.1.142 |
| `# direct save` UI | `UserMemoryInputMessage` (75 lines compiled) — wraps `<user-memory-input>` tag, shows `# {content}` with "Got it." ack | `Pb7` at 346068, `oQ_` at 346065 (same wrapper detection + random ack) | Preserved |
| Editor launcher | `editFileInEditor` | `AS` at 445838 + `Lj8` at 445773 | Preserved + extended (GUI editor list: code, cursor, windsurf, codium, subl, atom, gedit, notepad++, notepad) |

### What's gone from v2.1.88 to v2.1.142

- v2.1.88's `MemoryUpdateNotification` was a single-line "Memory updated in {path}" notification for a single saved file. v2.1.142 replaced this with `Oc_` which shows aggregate counts across multiple files. This change reflects the actual extraction pattern: a single extraction often writes 2-4 files at once, and the old single-path message would have flooded the transcript.

### v2.1.88 vs v2.1.142 — what to know

If you're cross-referencing v2.1.88 TypeScript code against v2.1.142 obfuscated:

1. **The runtime extraction is functionally identical.** `executeExtractMemories`, the closure-scoped state, the canUseTool allow-list, the cursor-with-compaction-fallback — all preserved verbatim. The only meaningful changes are: (a) `/toggle-memory` short-circuit added to the validator, (b) tiny-mode adds an Edit-deny clause, (c) `rm`/`Remove-Item` allow-list added to the validator for tiny mode's delete-and-recreate pattern.

2. **The two prompt builders were merged into one.** v2.1.88's `buildExtractAutoOnlyPrompt` and `buildExtractCombinedPrompt` are one function (`hr7`) in v2.1.142. The merged form has three branches: OS (POSIX vs Windows), tiny vs full memory, and team vs auto-only.

3. **The MemoryUpdateNotification was rewritten.** v2.1.88 showed a single-path "Memory updated" string; v2.1.142 shows "Saved N memories" with a collapsible file list. The system message subtype (`memory_saved`) and its `writtenPaths` field are identical.

4. **The memory-save survey is new in v2.1.142.** No analog exists in v2.1.88. Survey is feature-gated (default off) and exists for the team to evaluate the tiny-memory experiment's prompt quality.

5. **`/toggle-memory` is new in v2.1.142** (gated rollout). The toggle exists in the in-memory session state but its command is hidden by default.

6. **Token-budget and large-file warnings are new in v2.1.142.** Both surface via the suggestion engine; both point at `/memory` as the action.

7. **`T6` is `isNonInteractive`, not `isTrustedWorkspace`** — see [the corrected analysis in 39_goal/goal_hooks_interaction.md](../39_goal/goal_hooks_interaction.md#1a-correction-t6-is-isnoninteractive-_5-is-istrustgranted). This affects readings of `Wi$` (the extraction gate) too: `Wi$` returns true in interactive sessions OR in non-interactive sessions where `tengu_slate_thimble` is also on.
