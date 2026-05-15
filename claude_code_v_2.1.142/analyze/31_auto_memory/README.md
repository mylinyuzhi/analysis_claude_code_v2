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
        │       (IVK6 emitter — compact one-block prompt)                  │
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
   - If `LY()` (simple system prompt) is on and **not** tiny → call `IVK6` (the simple-form dual-directory prompt) with private + optional team paths.
   - If `LY()` is on and tiny → return a one-line agent header pointing at `{path, cowork-extras, search section}`.
   - If tiny and team-mem enabled → `hVK` (tiny dual-dir + COMBINED tiny types).
   - If tiny and only auto-mem → `yVK` (tiny single-dir + INDIVIDUAL tiny types).
   - If team-mem enabled (non-tiny) → `fS1.buildCombinedMemoryPrompt` (private + team, dual frontmatter, COMBINED).
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
- `ENTRYPOINT_NAME` (`xj`, `nh1`) - String constant `"MEMORY.md"` (cli_inner_pretty.js:141682, 139836)
- `MAX_ENTRYPOINT_LINES` (`jKH`) - Integer 200 (cli_inner_pretty.js:141683)
- `MAX_ENTRYPOINT_BYTES` (`d5$`) - Integer 25000 (cli_inner_pretty.js:142953)
- `AUTO_MEM_DISPLAY_NAME` (`TK6`) - Literal `"auto memory"` (cli_inner_pretty.js:142954)
- `loadMemoryPrompt` (`c5$`) - Top-level dispatcher (cli_inner_pretty.js:142855-142927)
- `buildMemoryPrompt` (`mVK`) - Agent-memory variant that includes content inline (cli_inner_pretty.js:142805-142828)
- `buildMemoryLines` (`VK6`) - Behavioral instructions without MEMORY.md content (cli_inner_pretty.js:142743-142804)
- `truncateEntrypointContent` (`oi$`) - 200L/25KB cap enforcer (cli_inner_pretty.js:142678-142716)
- `ensureMemoryDirExists` (`PKH`) - Idempotent recursive mkdir (cli_inner_pretty.js:142717-142725)
- `getAutoMemPath` (`UY`) - Memoized path resolver (cli_inner_pretty.js:139849-139857)
- `isAutoMemoryEnabled` (`x9`) - 7-step enablement chain (cli_inner_pretty.js:139749-139760)
- `parseMemoryType` (`VVK`) - Validating string→MemoryType coercion (cli_inner_pretty.js:141954-141957)
- `MEMORY_TYPES` (`JK6`) - The closed 4-element array (cli_inner_pretty.js:141990)
- `TINY_MEMORY_TYPES` (`WK6`) - 3-element array for tiny variant (cli_inner_pretty.js:142352)
- `validateMemoryPath` (`VTK`) - Override-path security validator (cli_inner_pretty.js:139783-139803)

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
