# Symbol Additions — v2.1.193 — Auto Memory & Dream (EXTEND, thin)

> Consolidated obfuscated→readable symbol manifest for the **Auto Memory / Dream** subsystem **as it
> exists in v2.1.193** (build `a1938d2a`), analysed in [`../31_auto_memory/`](../31_auto_memory/README.md).
> This window is **largely carryover**: the headline change is the **removal** of the
> `tengu_billiard_aviary` immutable-memory / `tiny_memory` experiment ([`billiard_aviary_immutable_memory_removal.md`](../31_auto_memory/billiard_aviary_immutable_memory_removal.md)).
> The "2.1.186 MEMORY.md compact reminder" is carryover, documented in
> [`memory_reminder_and_dream_carryover.md`](../31_auto_memory/memory_reminder_and_dream_carryover.md).
>
> **Routing — these rows fold into [`symbol_index_core_features.md`](./symbol_index_core_features.md),
> "## Module: Auto Memory".**
>
> **All line numbers in the first two tables are v2.1.193** (`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`).
> The v2.1.183 names DO NOT apply in v2.1.193 — the bundler re-mangles every build; where a 183 ancestor
> exists it is given in the Description-style trailing note. **Every 193 row below was re-read in the live
> 193 bundle during this pass.**

## Module: Auto Memory — present in v2.1.193 (carryover engine + size limits)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v$t` | `truncateMemoryIndexForPrompt` — caps `MEMORY.md` at 200 lines / 25KB, appends compact-it WARNING (183 `Zkt`@151691, byte-identical) | cli_inner_pretty.js:152573 | function |
| `UH` | `MEMORY_INDEX_FILENAME` (`"MEMORY.md"`) (183 `$w`@150799) | cli_inner_pretty.js:151952 | constant |
| `RY` | `MEMORY_INDEX_LINE_LIMIT` (`200`) (183 `tie`@150800) | cli_inner_pretty.js:151953 | constant |
| `Kae` | `MEMORY_INDEX_BYTE_LIMIT` (`25000`) (183 `HTe`@150801) | cli_inner_pretty.js:151954 | constant |
| `La` | `formatBytes` — byte-count humanizer used in the WARNING reason string | cli_inner_pretty.js:152573 (callsite) | function |
| `$_l` | `buildConsolidationPrompt` — single dream prompt builder; body == 183 `PQa`@455311; v2.1.88 `buildConsolidationPrompt` | cli_inner_pretty.js:463735 | function |
| `Daf` | `getDreamThrottleConfig` — `tengu_onyx_plover` minHours/minSessions throttle | cli_inner_pretty.js:463818 | function |
| `B_l` | `DREAM_THROTTLE_DEFAULTS` — fallback minHours/minSessions for `Daf` | cli_inner_pretty.js:463818 (ref) | object |
| `G_l` | `initAutoDream` — installs the `executeAutoDream` closure | cli_inner_pretty.js:463837 | function |
| `j_l` | `executeAutoDream` — dream firing closure (throttle → fire → telemetry → fork); `aH()` branch removed | cli_inner_pretty.js:463839 | function |
| `qae` | `parseMemoryStoresEnv` — `CLAUDE_MEMORY_STORES` JSON parse/validate (NOT `b5t`, which is `permission_browser`@375261) | cli_inner_pretty.js:151593 | function |
| `m0i` | `buildMemorySystemPrompt_privateAndTeam` — recall/system-prompt builder (carryover) | cli_inner_pretty.js:152389 | function |
| `g0i` | `buildMemorySystemPrompt_teamMultiDir` — recall/system-prompt builder (carryover) | cli_inner_pretty.js:152460 | function |
| `VVr` | `buildMemorySystemPrompt_singleDir` — recall/system-prompt builder (carryover) | cli_inner_pretty.js:152638 | function |

## Module: Auto Memory — v2.1.183 before-picture (REMOVED in v2.1.193)

> These are **183** symbols documenting the deleted `tengu_billiard_aviary` immutable-memory experiment.
> They have **no 193 counterpart** (grep-count 0 in the 193 bundle). Line numbers are **v2.1.183**.

| Obfuscated (183) | Readable | File:Line (183) | Type |
|------------------|----------|-----------------|------|
| `aH` | `isImmutableMemoryEnabled` — reads gate `tengu_billiard_aviary` (default `false`) | cli_inner_pretty.js:147673 | function |
| `XXu` | `selectMemoryType` — `aH() ? "tiny_memory" : "memory"` | cli_inner_pretty.js:147670 | function |
| `KXu` | `MEMORY_TYPE_DEFAULT` (`"memory"`) | cli_inner_pretty.js:147729 | constant |
| `YXu` | `MEMORY_TYPE_TINY` (`"tiny_memory"`) | cli_inner_pretty.js:147730 | constant |
| `Hgi` | `buildPruningPrompt` — immutable "# Dream: Memory Pruning" builder (3-arg) | cli_inner_pretty.js:151520 | function |
| `PQa` | `buildConsolidationPrompt` (183 name) — standard builder; survives as 193 `$_l` | cli_inner_pretty.js:455311 | function |
| `FOa` | `RatingButton` — the `[Good]/[Bad]` `tiny_memory` survey button (decl line; its own `onRate` prop is read at :378928) | cli_inner_pretty.js:378926 | function |
| `Zkt` | `truncateMemoryIndexForPrompt` (183 name) — survives as 193 `v$t` | cli_inner_pretty.js:151691 | function |
