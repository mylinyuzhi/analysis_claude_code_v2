# memoryTypes.ts — Type Taxonomy and Prompt Sections — v2.1.112

Deep deobfuscation of `src/memdir/memoryTypes.ts` (271 lines in v2.1.88). This file owns the closed four-type taxonomy, the `parseMemoryType` validator, the two `TYPES_SECTION_*` prompt variants, and the surrounding prompt fragments (`WHAT_NOT_TO_SAVE`, `WHEN_TO_ACCESS`, `TRUSTING_RECALL`, `MEMORY_FRONTMATTER_EXAMPLE`).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (auto memory)
> - [symbol_additions_unit_03.md](../00_overview/symbol_additions_unit_03.md) - New symbols from this unit

Key symbols in this document:
- `MEMORY_TYPES` (`SC4`) - The closed `['user', 'feedback', 'project', 'reference']` array (chunks.99.mjs:538)
- `parseMemoryType` (`CC4`) - String→MemoryType validator (chunks.99.mjs:516)
- `TYPES_SECTION_COMBINED` (`bC4`) - "## Types of memory" with `<scope>` tags (chunks.99.mjs:538, body at chunks.153.mjs:2198)
- `TYPES_SECTION_INDIVIDUAL` (`IC4`) - "## Types of memory" without `<scope>` tags (chunks.99.mjs body)
- `WHAT_NOT_TO_SAVE_SECTION` (`aH6`) - "## What NOT to save in memory" (chunks.99.mjs)
- `MEMORY_DRIFT_CAVEAT` (`ji1`) - Stale-memory warning bullet (chunks.99.mjs:529)
- `WHEN_TO_ACCESS_SECTION` (`xC4` / `PkK`) - "## When to access memories" (chunks.99.mjs / chunks.153.mjs)
- `TRUSTING_RECALL_SECTION` (`sH6`) - "## Before recommending from memory" (chunks.99.mjs)
- `MEMORY_FRONTMATTER_EXAMPLE` (`mh6` / `MkK`) - The frontmatter code-fence template (chunks.99.mjs / chunks.153.mjs)

## The Closed Taxonomy

```javascript
// ============================================
// MEMORY_TYPES - The closed four-element taxonomy
// Location: chunks.99.mjs:538 (v2.1.88: memoryTypes.ts:14-21)
// ============================================

// ORIGINAL (for source lookup):
SC4 = ["user", "feedback", "project", "reference"]

// READABLE (for understanding):
export const MEMORY_TYPES = ['user', 'feedback', 'project', 'reference'] as const
export type MemoryType = (typeof MEMORY_TYPES)[number]

// Mapping: SC4→MEMORY_TYPES (no separate TS type at runtime — only the array literal)
```

Exactly four values, no extension point. Adding a fifth type requires editing both the constant **and** the prompt fragments below (`TYPES_SECTION_COMBINED`, `TYPES_SECTION_INDIVIDUAL`, `MEMORY_FRONTMATTER_EXAMPLE`).

### Why a closed taxonomy

The source file has an explicit doc comment:

> Memories are constrained to four types capturing context **NOT derivable from the current project state**. Code patterns, architecture, git history, and file structure are derivable (via grep/git/CLAUDE.md) and should NOT be saved as memories.

Each of the four types maps to a class of context the model **cannot reconstruct from the working directory**:

| Type | What it captures | Why it's not derivable |
|------|------------------|------------------------|
| `user` | Role, goals, knowledge | The user's identity isn't in the repo |
| `feedback` | Corrections + confirmations | Past conversations aren't in `git log` |
| `project` | Ongoing initiatives, deadlines | Project context lives in heads, not files |
| `reference` | Pointers to external systems | Linear/Slack URLs aren't in the codebase |

A fifth type would either duplicate an existing one or contradict the "not derivable" principle. The closed shape is itself a teaching device — every time a contributor wants to add a type, they have to answer "is this not-derivable?"

## `parseMemoryType` (CC4)

### What it does

Validates a raw frontmatter value (typically from a YAML-parsed `type:` field) and returns either a `MemoryType` (one of the four strings) or `undefined`.

### How it works

1. **Type guard**: `if (typeof raw !== 'string') return undefined`. Catches the `null` / `undefined` / number / array / object cases.
2. **Linear membership**: `MEMORY_TYPES.find(t => t === raw)` — case-sensitive exact match. Returns the matched value or `undefined`.

### Why this approach

- **`undefined` for failure, not a default**: Legacy files written before the `type:` field existed return `undefined`. A default like `'user'` would silently mislabel them; `undefined` lets the consumer (`scanMemoryFiles`) carry "unknown" through the pipeline and render `[type] ` only when set (`tag = m.type ? \`[${m.type}] \` : ''` in `formatMemoryManifest`).
- **`MEMORY_TYPES.find` instead of `Set.has`**: A `Set` would be slightly faster, but `find` returns the *interned* string from the array (good for downstream `===` checks). The taxonomy is 4 elements, so big-O isn't a concern.
- **No normalization (no lowercase, no trim)**: A misspelled `"User"` (capital U) is treated as unknown rather than coerced. This makes typos visible rather than silent. The prompt frontmatter examples always use lowercase, so this is consistent with what the model has been told to write.

### Key insight

Validation here is a **contract**: anything the model writes must match exactly, and anything that doesn't is "unknown" with no auto-recovery. This keeps the model honest — if it invents a fifth type, downstream tooling sees `undefined` and surfaces the inconsistency.

```javascript
// ============================================
// parseMemoryType - Validating string→MemoryType coercion
// Location: chunks.99.mjs:516-519 (v2.1.88: memoryTypes.ts:28-31)
// ============================================

// ORIGINAL (for source lookup):
function CC4(q) {
    if (typeof q !== "string") return;
    return SC4.find((K) => K === q)
}

// READABLE (for understanding):
export function parseMemoryType(raw: unknown): MemoryType | undefined {
  if (typeof raw !== 'string') return undefined
  return MEMORY_TYPES.find(t => t === raw)
}

// Mapping: CC4→parseMemoryType, q→raw, K→t, SC4→MEMORY_TYPES
```

## Two `TYPES_SECTION_*` Variants

The "## Types of memory" prompt section has **two flavors**:

### `TYPES_SECTION_COMBINED` (bC4) — Private + Team Directories

Used when team memory is enabled (`feature('TEAMMEM') && isTeamMemoryEnabled()`). Each type carries a `<scope>` tag and examples include explicit `private` / `team` qualifiers:

```
<type>
    <name>user</name>
    <scope>always private</scope>
    <description>Contain information about the user's role…</description>
    <when_to_save>When you learn any details about the user's role, preferences…</when_to_save>
    <how_to_use>When your work should be informed by the user's profile…</how_to_use>
    <examples>
    user: I'm a data scientist…
    assistant: [saves private user memory: user is a data scientist…]
    …
    </examples>
</type>
```

Scope tags per type:
- `user` → `always private`
- `feedback` → `default to private. Save as team only when project-wide convention.`
- `project` → `private or team, but strongly bias toward team`
- `reference` → `usually team`

The `<scope>` tags are **declarative** — they encode the policy in the data the model sees rather than in a separate "and remember team-vs-private goes like this" paragraph. The model interpolates the right scope into each save action.

### `TYPES_SECTION_INDIVIDUAL` (IC4) — Single Directory

Used when team memory is **off** (the default). No `<scope>` tags, no team/private qualifiers in examples:

```
<type>
    <name>user</name>
    <description>Contain information about the user's role…</description>
    <when_to_save>When you learn any details…</when_to_save>
    <how_to_use>When your work should be informed by the user's profile…</how_to_use>
    <examples>
    user: I'm a data scientist…
    assistant: [saves user memory: user is a data scientist…]
    …
    </examples>
</type>
```

Prose that only makes sense with a split is reworded — e.g., `<how_to_use>` for `feedback` becomes "Let these memories guide your behavior so that the user does not need to offer the same guidance twice" (the COMBINED version says "the user and **other users in the project**").

### Why two separate arrays instead of templated rendering

The source comment is explicit:

> The two TYPES_SECTION_* exports below are intentionally duplicated rather than generated from a shared spec — keeping them flat makes per-mode edits trivial without reasoning through a helper's conditional rendering.

Trade-off analysis:
- **Duplicated arrays cost**: Two ~50-line literals diverge if you only edit one. Linters do not catch that.
- **Shared template cost**: A `renderTypesSection(includeScope: boolean)` helper introduces branching inside the prompt template (`${includeScope ? scopeTag : ''}`). Reading the rendered output requires mental execution of the template, plus most edits to the prompt text become diff-noisy because they touch the helper.
- **Verdict**: For prompts, where edits are content-driven (rewording, A/B testing, eval-driven tweaks) rather than logic-driven, the duplicated form wins because diffs land on the actual prompt text and reviewers can read the final string directly.

### Key insight

The COMBINED variant is **strictly more information** than INDIVIDUAL — it has scope tags and split examples. The INDIVIDUAL variant exists because *injecting the COMBINED text when only one directory is in play would confuse the model* with concepts ("private vs team") that have no behavioral consequence in that context.

## Supporting Sections

### `WHAT_NOT_TO_SAVE_SECTION` (aH6)

A flat list of five things the model **shouldn't** save, all because they're derivable:

```
- Code patterns, conventions, architecture, file paths, or project structure
- Git history, recent changes, or who-changed-what
- Debugging solutions or fix recipes
- Anything already documented in CLAUDE.md files
- Ephemeral task details
```

Followed by a critical override sentence:

> These exclusions apply even when the user explicitly asks you to save. If they ask you to save a PR list or activity summary, ask what was *surprising* or *non-obvious* about it — that is the part worth keeping.

The comment on this in v2.1.88 source flags this as eval-validated:

> H2: explicit-save gate. Eval-validated (memory-prompt-iteration case 3, 0/2 → 3/3): prevents "save this week's PR list" → activity-log noise.

This is a worked example of prompt-engineering rigor: the entire section title says "What NOT to save," but a specific failure mode (model dutifully saving derivable activity logs on user request) required adding a dedicated explicit-override sentence at the end. Without it the model defers to the user; with it it pushes back with a counterquestion.

### `MEMORY_DRIFT_CAVEAT` (ji1)

Single bullet under `## When to access memories`:

> Memory records can become stale over time. Use memory as context for what was true at a given point in time. Before answering the user or building assumptions based solely on information in memory records, verify that the memory is still correct and up-to-date by reading the current state of the files or resources. If a recalled memory conflicts with current information, trust what you observe now — and update or remove the stale memory rather than acting on it.

"Trust what you observe now" is the operative phrase. The model is told it has a tie-breaker: filesystem state always wins over memory recall.

### `WHEN_TO_ACCESS_SECTION` (xC4 / PkK)

Combines four pieces of guidance:

1. **Relevance trigger**: Access memory when it seems relevant or the user references prior-conversation work.
2. **MUST trigger**: Explicit user request to check / recall / remember.
3. **Negative trigger**: If the user says to *ignore* or *not use* memory — proceed as if `MEMORY.md` were empty. Do not cite, compare, or mention.
4. **Drift caveat** (the bullet above).

The v2.1.88 source comment calls out the third bullet specifically:

> H6 (branch-pollution evals #22856, case 5 1/3 on capy): the "ignore" bullet is the delta. Failure mode: user says "ignore memory about X" → Claude reads code correctly but adds "not Y as noted in memory" — treats "ignore" as "acknowledge then override" rather than "don't reference at all." The bullet names that anti-pattern explicitly.

This is the same eval-driven pattern as the explicit-save override — a real failure mode was observed in evals, then named in the prompt so the model recognizes it as a class of behavior to avoid.

### `TRUSTING_RECALL_SECTION` (sH6)

Header: `## Before recommending from memory` (action-cue framing — "Before recommending" tested better in evals than the abstract "Trusting what you recall"). Body:

> A memory that names a specific function, file, or flag is a claim that it existed *when the memory was written*. It may have been renamed, removed, or never merged. Before recommending it:
> - If the memory names a file path: check the file exists.
> - If the memory names a function or flag: grep for it.
> - If the user is about to act on your recommendation (not just asking about history), verify first.
>
> "The memory says X exists" is not the same as "X exists now."
>
> A memory that summarizes repo state (activity logs, architecture snapshots) is frozen in time. If the user asks about *recent* or *current* state, prefer `git log` or reading the code over recalling the snapshot.

The source comment lists eval results:

> H1 (verify function/file claims): 0/2 → 3/3 via appendSystemPrompt. When buried as a bullet under "When to access", dropped to 0/3 — position matters. The H1 cue is about what to DO with a memory, not when to look, so it needs its own section-level trigger context.

The lesson: a single failure-mode-specific bullet at the bottom of a long list doesn't work; the model needs a **dedicated section** with action-framed header text. The behavior to be elicited (verification before recommendation) is genuinely different from "when to look up memories at all," so it gets its own H2.

### `MEMORY_FRONTMATTER_EXAMPLE` (mh6 / MkK)

The literal frontmatter template baked into the prompt:

```markdown
---
name: {{memory name}}
description: {{one-line description — used to decide relevance in future conversations, so be specific}}
type: {{user, feedback, project, reference}}
---

{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines}}
```

Note: the `type:` placeholder is computed as `\`type: {{${MEMORY_TYPES.join(", ")}}}\``. The taxonomy and the prompt are guaranteed to stay in sync because the prompt **interpolates the array at module init time**. If a fifth type is added to `MEMORY_TYPES`, the prompt example shows it immediately.

In v2.1.112 there are two variants of this template visible in the chunks:

- `mh6` (chunks.99.mjs): includes the `description:` field — matches the v2.1.88 source.
- `MkK` (chunks.153.mjs:2198): omits `description:`, only has `name:` and `type:`. This is the newer (likely v2.1.112-only) variant used in chunks.153's prompt builders.

The chunks.153 builders (`DkK` / `ZkK`) are the newer "single-fact per file" prompts that emphasize granularity over discovery (the description field is less needed when files are tiny and `findRelevantMemories` reads the body directly).

### Why `description` was dropped in the newer variant

The v2.1.88 path uses `description` for:
1. The `formatMemoryManifest` line: `- [type] file.md (mtime): description` shown to the recall selector.
2. A future-conversation relevance hint.

The newer "one paragraph per file" prompt makes each file small enough that the recall selector reads the body itself — there's no relevance gain from a description summary of a 100-token paragraph. Removing the field also trims one source of "two-step name + description" overhead at write time.

## Frontmatter Schema (Effective Contract)

Putting `parseMemoryType` and `MEMORY_FRONTMATTER_EXAMPLE` together, the effective contract for a memory file's frontmatter is:

| Field | Type | Required | Validator | What happens if invalid |
|-------|------|----------|-----------|--------------------------|
| `name` | string | recommended | none (used verbatim) | Treated as empty; filename used downstream |
| `description` | string | recommended (v2.1.88 path); optional (newer "single-fact" path) | none | `description: null` in `MemoryHeader` |
| `type` | string | strongly recommended | `parseMemoryType` | `type: undefined` in `MemoryHeader` |
| `created` | YYYY-MM-DD string | optional | `parseISODateOrNull` (`dMz` chunks.99.mjs:542) for sort-order tracking | falls back to file mtime |
| `last_read` | string | optional | type guard only | unused if missing |

**`metadata.type`**: In v2.1.88 there is no nested `metadata.type` — `type` is a top-level frontmatter field. Earlier drafts of memory may have used nested `metadata`, but the current parsing path (`memoryScan.ts` line 61: `type: parseMemoryType(frontmatter.type)`) reads from the top level.

The schema is **lenient**: missing or invalid fields don't cause errors. They surface as `null` / `undefined` in `MemoryHeader` and downstream consumers degrade gracefully (no type tag in the manifest, no description in the recall hint, no created-date sort-key).

## Eval-Driven Prompt Engineering — Summary

The `memoryTypes.ts` source is unusually rich in `// Eval-validated:` and `// H1/H2/H6:` comments. Reading them sequentially gives a roadmap of the prompt's evolution:

| Section | Eval-driven property | Outcome |
|---------|----------------------|---------|
| `WHAT_NOT_TO_SAVE_SECTION` last sentence | "explicit-save gate" | 0/2 → 3/3 on activity-log-noise eval |
| `WHEN_TO_ACCESS_SECTION` "ignore" bullet | "branch-pollution H6" | 1/3 → addressed via dedicated bullet |
| `TRUSTING_RECALL_SECTION` header wording | "action-cue framing" | 0/3 abstract → 3/3 with "Before recommending" |
| `TRUSTING_RECALL_SECTION` section position | "section-level vs bullet-level" | 0/3 buried → 3/3 promoted to H2 |

These are not anecdotes — they're embedded in the constants as comments and tied to eval suite names (`memory-prompt-iteration.eval.ts`, `#22856`). The prompts are tested like code.

## Cross-Validation: v2.1.88 → v2.1.112

| Invariant | v2.1.88 src | v2.1.112 obfuscated | Verified |
|-----------|-------------|---------------------|----------|
| `MEMORY_TYPES = ['user', 'feedback', 'project', 'reference']` | memoryTypes.ts:14-19 | `SC4 = ["user","feedback","project","reference"]` chunks.99.mjs:538 | Yes |
| `parseMemoryType` is `find(t === raw)` with string guard | memoryTypes.ts:28-31 | `CC4` chunks.99.mjs:516-519 | Yes |
| `MEMORY_DRIFT_CAVEAT` text | memoryTypes.ts:202 | `ji1` chunks.99.mjs:529 | Yes (identical text) |
| `WHAT_NOT_TO_SAVE` 5-item list + override sentence | memoryTypes.ts:183-195 | `aH6` chunks.99.mjs | Yes |
| `TYPES_SECTION_INDIVIDUAL` xml structure (4 `<type>` blocks) | memoryTypes.ts:113-178 | `IC4` chunks.99.mjs | Yes (with two co-existing in-flight variants) |
| `TYPES_SECTION_COMBINED` includes `<scope>` per type | memoryTypes.ts:37-106 | `bC4` chunks.99.mjs | Yes |
| Frontmatter example uses `MEMORY_TYPES.join(', ')` | memoryTypes.ts:266 | `mh6`/`MkK` chunks.99.mjs / chunks.153.mjs | Yes |

The textual prompts in v2.1.112 are very close to v2.1.88 source — the small differences (e.g., one-fact-per-file variants `iJY` / `rJY` in chunks.153.mjs) are in-flight prompt iterations rather than algorithm changes. The taxonomy itself and the validator behavior are bit-equivalent.
