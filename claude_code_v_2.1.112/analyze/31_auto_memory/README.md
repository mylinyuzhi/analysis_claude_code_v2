# 31 - Auto Memory Core (memdir + types + paths) — v2.1.112

## Overview

The `memdir/` module is Claude Code's persistent memory subsystem — a file-based store that lives between sessions and is injected into the system prompt as a dynamic section. It is built from three closely-coupled source files:

- **`src/memdir/memdir.ts`** (507 lines) — prompt builders, entrypoint loader, content-cap enforcement, ensure-dir helper
- **`src/memdir/memoryTypes.ts`** (271 lines) — closed four-type taxonomy (`user` / `feedback` / `project` / `reference`), frontmatter spec, two `## Types of memory` section variants
- **`src/memdir/paths.ts`** (278 lines) — `~/.claude/projects/<slug>/memory/` resolution, env-var/settings.json overrides, security validation of override paths

This module is the **core** of auto memory. It is the only place where:
- The on-disk filename is named (`MEMORY.md`, via `ENTRYPOINT_NAME`)
- The 200-line / 25,000-byte caps are enforced (`MAX_ENTRYPOINT_LINES`, `MAX_ENTRYPOINT_BYTES`)
- The taxonomy is closed (`MEMORY_TYPES = ['user', 'feedback', 'project', 'reference']`)
- Memory-directory paths are computed (`getAutoMemPath()`)
- Enablement is decided (`isAutoMemoryEnabled()`)

Adjacent modules that consume this core — `findRelevantMemories`, `memoryScan`, `extractMemories`, team memory, KAIROS daily logs — depend on these exports for filename/path/taxonomy semantics. Those higher-level features are out of scope for this unit (see Unit 24/25/26/27 in v2.1.76 for the recall, scan, and extraction layers).

## Memory System Architecture

```
                       SYSTEM PROMPT BUILDER (chunks.194.mjs)
                                    │
                                    │ XT("memory", () => fz8())
                                    │ (registers the "memory" dynamic section)
                                    ▼
                            loadMemoryPrompt   (fz8 / chunks.192.mjs:45)
                            ────────────────
                                    │
                  ┌─────────────────┴─────────────────┐
                  │  isAutoMemoryEnabled? (x3)        │
                  └────┬──────────────┬───────────────┘
                       │ true         │ false
                       │              └──► tengu_memdir_disabled telemetry
                       │                   → returns null (no section)
                       ▼
        ┌──────────────────────────────────────────────────────────┐
        │  Dispatch on feature flags + KAIROS / team-mem gates:    │
        │                                                          │
        │  KAIROS+autoEnabled ─► buildAssistantDailyLogPrompt      │
        │       (append-only logs/YYYY/MM/YYYY-MM-DD.md)           │
        │                                                          │
        │  TEAMMEM enabled ────► buildCombinedMemoryPrompt          │
        │       (private + team directories, dual frontmatter)     │
        │                                                          │
        │  AUTO only ──────────► buildMemoryLines("auto memory")   │
        │       (single directory, INDIVIDUAL types section)       │
        └─────────┬─────────────────────────────────────┬──────────┘
                  │                                     │
                  │ ensureMemoryDirExists(autoDir)      │
                  │ (Iu6 / chunks.191.mjs:3153)         │
                  │                                     │
                  ▼                                     ▼
        ┌─────────────────────┐               ┌────────────────────┐
        │  paths.ts           │               │  memoryTypes.ts    │
        │  ───────────        │               │  ───────────────   │
        │  getAutoMemPath()   │               │  TYPES_SECTION_*   │
        │  └─ override env    │               │  WHAT_NOT_TO_SAVE  │
        │  └─ settings.json   │               │  WHEN_TO_ACCESS    │
        │  └─ <base>/projects │               │  TRUSTING_RECALL   │
        │     /<gitroot>/     │               │  FRONTMATTER       │
        │     memory/         │               │  parseMemoryType   │
        └─────────────────────┘               └────────────────────┘
                  │                                     │
                  └──────────────┬──────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────────────┐
                    │  buildMemoryPrompt (ieK)        │
                    │  ─────────────────────          │
                    │  1. readFileSync(autoDir +      │
                    │       "MEMORY.md")              │
                    │  2. truncateEntrypointContent   │
                    │       (eU1) — 200L/25KB cap     │
                    │  3. lines = buildMemoryLines    │
                    │       (neK)                     │
                    │  4. lines.push("## MEMORY.md",  │
                    │       truncated.content)        │
                    │  5. return lines.join("\n")     │
                    └─────────────────────────────────┘
                                 │
                                 ▼
                       <system prompt section>
                       (cached by systemPromptSection)
```

The architectural insight: **the entrypoint is a single Markdown file**, not a database. The hard cap (200 lines, 25 KB) keeps the system prompt budget bounded; everything beyond the index lives in topic `.md` files that the model loads on demand with the Read tool. The truncation warning explicitly tells the model to "move detail into topic files," teaching it the index-vs-detail discipline.

## Files in This Unit

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Module overview, architecture diagram, file/types/lifecycle summary (this file) |
| [memdir_core.md](./memdir_core.md) | Deep deobfuscation of `memdir.ts` — `ENTRYPOINT_NAME`, `buildMemoryPrompt`, `buildMemoryLines`, `truncateEntrypointContent`, `ensureMemoryDirExists`, the KAIROS daily-log builder |
| [memory_types.md](./memory_types.md) | Closed 4-type taxonomy, `parseMemoryType`, the two `TYPES_SECTION_*` variants (COMBINED + INDIVIDUAL), supporting prompt sections |
| [paths.md](./paths.md) | `getAutoMemPath` resolution chain, `isAutoMemoryEnabled` 5-step priority, security validation of override paths, daily-log path shape |
| [frontmatter_parsing.md](./frontmatter_parsing.md) | YAML frontmatter parsing (`parseFrontmatter` / `p2`), how `name`/`description`/`type` are validated, what happens to malformed YAML, and why `[[link]]` wikilinks are not a thing here |

Plus index-side additions live in:

- [`../00_overview/symbol_additions_unit_03.md`](../00_overview/symbol_additions_unit_03.md) — new symbol mappings discovered while writing this unit

## Types Taxonomy (Summary)

The taxonomy is **closed** — exactly four allowed values:

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

`parseMemoryType()` (chunks.99.mjs:516 `CC4`) returns `undefined` for any unknown string, so legacy files without a `type:` field keep working — the system **degrades gracefully** instead of erroring.

Each type also carries embedded `<when_to_save>`, `<how_to_use>`, and `<examples>` blocks in the prompt — the model is told (in its own context) what counts as a `user` memory vs a `feedback` memory, with worked examples for both.

See [memory_types.md](./memory_types.md) for the full taxonomy and prompt text.

## Prompt-Injection Lifecycle

The memory section is injected as one of the system prompt's dynamic sections each turn:

1. **Registration** (chunks.194.mjs:91): The system prompt builder registers `"memory"` as an `XT(...)` dynamic section. Each section is cached by `systemPromptSection` until something dirties it.
2. **Dispatch** (`loadMemoryPrompt` → `fz8`, chunks.192.mjs:45):
   - Reject if `isAutoMemoryEnabled() === false` → return `null` and emit `tengu_memdir_disabled`.
   - If `feature('KAIROS') && getKairosActive()` → take the daily-log branch (`buildAssistantDailyLogPrompt` — different prompt, append-only logs).
   - If `feature('TEAMMEM') && isTeamMemoryEnabled()` → call team-mem's `buildCombinedMemoryPrompt`, which uses `TYPES_SECTION_COMBINED` and mentions both private + team directories.
   - Otherwise → call `buildMemoryLines("auto memory", autoDir, extraGuidelines, skipIndex)` with the `TYPES_SECTION_INDIVIDUAL` variant.
3. **Directory ensured** (`ensureMemoryDirExists` → `Iu6`): Recursive mkdir; errors are logged but never thrown (the model's Write tool will surface real perm errors at write time).
4. **Content read** (`buildMemoryPrompt` only — for the per-agent override variant): `readFileSync(memoryDir + "MEMORY.md")`. Failure is silent — no file simply means an empty index.
5. **Truncation** (`truncateEntrypointContent` → `eU1`):
   - Line-truncate first to 200 lines (natural boundary).
   - Then byte-truncate to 25 KB, cutting at the last `\n` before the cap to avoid mid-line cuts.
   - Append a contextual `WARNING:` line that names which cap fired (lines, bytes, or both).
6. **Assembly**: `lines.push("## MEMORY.md", "", t.content)` — the truncated content becomes one section of the larger prompt.
7. **Join + cache**: Final string is returned and cached by `systemPromptSection("memory", ...)` until the section is invalidated.
8. **Telemetry**: `logMemoryDirCounts` (`TW6`) fires asynchronously with `total_file_count` / `total_subdir_count` and the truncation flags. Fire-and-forget — never blocks prompt building.

Key insight: the system prompt is built **synchronously** (the inner read is `readFileSync`), but the telemetry that reports counts is async. This is deliberate — directory enumeration could block on a slow filesystem, but the prompt must be ready before the LLM call. Telemetry catches up later.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode, Compact, Hooks, etc.)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Auth)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (LSP, IDE, UI)
> - [symbol_additions_unit_03.md](../00_overview/symbol_additions_unit_03.md) - New symbols discovered in this unit

Key core-feature symbols:
- `ENTRYPOINT_NAME` (`YW` / `SE_`) - String constant `"MEMORY.md"` (chunks.153.mjs:2139, chunks.64.mjs:1374)
- `MAX_ENTRYPOINT_LINES` (`Ve`) - Integer 200 (chunks.153.mjs:2141)
- `MAX_ENTRYPOINT_BYTES` (`Zz8`) - Integer 25000 (chunks.192.mjs:90)
- `loadMemoryPrompt` (`fz8`) - Top-level dispatcher (chunks.192.mjs:45)
- `buildMemoryPrompt` (`ieK`) - Agent-memory variant that includes content inline (chunks.192.mjs:9)
- `buildMemoryLines` (`neK`) - Behavioral instructions without MEMORY.md content (chunks.192.mjs:3)
- `truncateEntrypointContent` (`eU1`) - 200L/25KB cap enforcer (chunks.191.mjs:3119)
- `ensureMemoryDirExists` (`Iu6`) - Idempotent recursive mkdir (chunks.191.mjs:3153)
- `getAutoMemPath` (`Nw`) - Memoized path resolver (chunks.64.mjs:1386)
- `isAutoMemoryEnabled` (`x3`) - 5-step enablement chain (chunks.64.mjs:1301)
- `parseMemoryType` (`CC4`) - Validating string→MemoryType coercion (chunks.99.mjs:516)
- `MEMORY_TYPES` (`SC4`) - The closed 4-element array (chunks.99.mjs:538)
- `AUTO_MEM_DISPLAY_NAME` (`ptY`) - Literal `"auto memory"` (chunks.192.mjs:92)
- `validateMemoryPath` (`Vq4`) - Override-path security validator (chunks.64.mjs:1331)

## Version Notes (v2.1.88 vs v2.1.112)

Spot-checking the deobfuscated source against the v2.1.112 chunks shows the memdir core is essentially **identical** between versions:

- `ENTRYPOINT_NAME = 'MEMORY.md'`, `MAX_ENTRYPOINT_LINES = 200`, `MAX_ENTRYPOINT_BYTES = 25_000` — identical literals
- `MEMORY_TYPES = ['user', 'feedback', 'project', 'reference']` — identical
- `truncateEntrypointContent` algorithm — bit-for-bit equivalent (line-first then byte-trim at last newline, contextual warning text)
- `getAutoMemPath` resolution order — identical (env-var override → settings.json → `<base>/projects/<gitroot>/memory/`)
- `isAutoMemoryEnabled` 5-step priority chain — identical

The biggest visible delta is in the **type taxonomy prompt examples** within `TYPES_SECTION_INDIVIDUAL` (chunks.99.mjs and chunks.153.mjs in v2.1.112 contain two slightly different variants — the `iJY` form uses the "one fact per file" body-structure language and splits multi-claim examples into separate `[saves user memory: …]` lines, while `IC4` keeps the older multi-fact form). Both still expose the same four type names and the same frontmatter schema.

This unit therefore relies confidently on v2.1.88 prose for the algorithm explanation and cross-validates the key invariants against v2.1.112 obfuscated chunks.
