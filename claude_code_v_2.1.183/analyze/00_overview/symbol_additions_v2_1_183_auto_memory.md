# Symbol Additions — v2.1.183 Auto Memory (memdir / team memory stores)

These mappings consolidate every obfuscated identifier touched by the **v2.1.156 → v2.1.183 auto-memory
delta**: the `CLAUDE_MEMORY_STORES` schema expansion (`scope`/`promptIndex`/`promptIndexMaxBytes`), the
new `promptIndex` network fetch + `<memory path>` injection, the rewritten recall dispatcher that routes
by `scope`+`mode`, the `isTeamMemoryEnabled` "mounted-store-enables-team" fix (the 2.1.172 headline that
surfaces team stores in remote sessions), the watcher scope-split into separate team + user multistore
lanes, and the 2.1.181 `memory_saved` status-line render change (per-file list now verbose-only). It also
re-maps the unchanged runtime-engine carryover (caps, lock, dream scheduler, extraction gate) to its
re-minified v2.1.183 aliases so a downstream doc can re-map a v2.1.156 name without re-deriving.

Every `File:Line` is `cli_inner_pretty.js` **in the v2.1.183 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`, 699,346 lines). The
v2.1.156 obfuscated alias is carried in each Description (e.g. "v2.1.156 `sM$`") so the rename is
traceable. The obfuscated names were re-derived from scratch — the bundle grew from 649,979 (v2.1.156) to
699,346 (v2.1.183) lines and the memdir code shifted region (recall dispatcher ~145046 → ~151847; watcher
~438392 → ~449203), so every name was anchored on stable strings (env var names, telemetry events, schema
literals, prompt text) and confirmed by reading the v2.1.183 declaration at the cited line.

> **Home-index routing note.** Auto-memory is a *core feature*, so these rows fold into
> [`symbol_index_core_features.md`](symbol_index_core_features.md) under **`## Module: Auto Memory`** —
> **not** execution/platform/integration. On merge, REPLACE the v2.1.156 obfuscated column for each
> readable name with its v2.1.183 alias below (the v2.1.156 alias is preserved in the Description so the
> lineage 88/156/183 stays traceable); do NOT create duplicate readable-name rows. A few rows are
> subagent/tool-execution-adjacent — the forked extraction/dream entrypoint family (`Nyn`, `BQa`, `PQa`,
> `w2p`) and the per-turn drain — and may also be cross-linked from
> [`symbol_index_core_execution.md`](symbol_index_core_execution.md) (Loop / Subagent); cross-link rather
> than duplicate. UI renderers (`Svp`/`Evp`/`Hvp`/`SNa`) overlap
> [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) (UI components) — again,
> cross-link.

**Cross-validated against:**
- **v2.1.183 bundle self-check** (`cli_inner_pretty.js`, TARGET): every row below re-read at its
  declaration line. Schema/parser/fetch block 150431–150801 (`yQu` @150431, `vNr` @150438, `Zse` @150442,
  `bQu` @150491, `m_n` class @150574, `agi` @150754, `kQu` @150768, `xQu` @150791, caps `$w`/`tie`/`HTe`
  @150799-150801); recall builders + dispatcher 151194–151847 (`mgi` @151194, `Agi` @151265, `bgi`
  @151378, `Sgi` @151426, `Egi` @151481, `jQu` @151840, `e0t` @151847); gates/paths `Nk` @151098, `uH`
  @151103, `Iu` @147636, `Wse` @147666, `hm` @147746, `Nyn` @147662, `aH` @147673, `lje` @289759; size
  warning `cXa` @447180; watcher `uFp` @449203 with the `rX`/`$W` scope-split @449223; runtime carryover
  `w2p` @455394, `PQa` @455311, `BQa` @455415, `YSf` @590643, `BDp`/`FDp` @424663-424664; status line
  `ANa` @382753, `SNa` @382861, `Svp` @383399, `Evp` @383441, `Hvp` @383444, `YGn` @589751;
  `pendingMemoryUpdates` init @294619. Grep-proof: `memory_prompt_index` = 4 hits (v2.1.183) vs 0
  (v2.1.156); `tengu_personal_mem_sync_started` = 1 (v2.1.183) vs 0 (v2.1.156); `tengu_kairos_dream` = 0
  (both).
- **v2.1.156 bundle before-picture** (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`):
  the store schema lived at `dp_` @436758-436771 (`{path, mode, mount?}` — no scope/promptIndex), parser
  `z24` @436721, mount-deriver `Qp_` @436714; recall dispatcher `sM$` @145046 (flat 6-branch, no
  scope/mode); team-enable gate `nM$` @144715 (`tengu_herring_clock` only); watcher `LU_` @438392 (team
  lane only, no scope filter); status-line renderer `sk_` @393698 with truncation constant `ak_` @393839
  (= 3) and the `iP` "+N more files" component. The runtime carryover ancestors: caps `OX`/`B9H`/`aM$`,
  lock `qE_`/`KE_` @399401-399402, dream scheduler `B04` @448551 / `C04` @448446 / `ag_` @448529, source
  labels `BQ_` @446768.
- **v2.1.88 named TypeScript** (`/lyz/codespace/3rd/claude-code/src/`): used to anchor carried-over
  readable names where a 1:1 symbol exists — `memdir/{memdir,paths,teamMemPaths,teamMemPrompts}.ts`
  (`getAutoMemPath`, `getTeamMemPath`, `isTeamMemoryEnabled`, `loadMemoryPrompt`),
  `services/autoDream/{autoDream,config,consolidationLock}.ts`, `components/memory/*.tsx` /
  `components/messages/*.tsx` (the `memory_saved` renderer + clickable-file component). The
  `scope`/`promptIndex`/`promptIndexMaxBytes` schema fields, `agi`/`kQu`, and `memory_prompt_index`
  telemetry are **post-2.1.88** and have no named-source equivalent.
- **Module docs (this delta)** —
  `claude_code_v_2.1.183/analyze/31_auto_memory/{README,team_memory_stores_recall,status_line_and_misc_delta}.md`.

---

## Module: Auto Memory — `CLAUDE_MEMORY_STORES` Schema & Parser (Delta 1)

> The memory-stores parse/schema layer lives in the bundle region ~150431–150801. The `scope`,
> `promptIndex`, and `promptIndexMaxBytes` fields are NEW since ~2.1.172.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `yQu` | `deriveMountName` | cli_inner_pretty.js:150431-150434 | function | Derives a mount name from a store path (strip trailing `/`, take last segment). **Rename only** of v2.1.156 `Qp_` (@436714); logic carryover. |
| `vNr` | `isPromptIndexPathSafe` | cli_inner_pretty.js:150438-150441 | function | **NEW (Delta 1)**: `e.split("/").every(n => /^[A-Za-z0-9._-]+$/.test(n) && n!=="." && n!=="..")` — per-segment validator for `promptIndex`; rejects empty + `.`/`..` traversal. No v2.1.156 equivalent (`promptIndex` concept absent). |
| `Zse` | `parseMemoryStoresEnv` | cli_inner_pretty.js:150442-150480 | function | **CHANGED (Delta 1)**: parses `CLAUDE_MEMORY_STORES`; now enforces **at most one `scope:"user"` entry** and propagates `scope`/`promptIndex`/`promptIndexMaxBytes` into each record (string shorthand → `{path,mode:"rw",scope:"team"}`). v2.1.156 `z24` (@436721) built `{path,mode,mount}` only — no scope, no single-user guard. |
| `bQu` | `storeObjectSchema` | cli_inner_pretty.js:150491-150509 | object | **CHANGED (Delta 1)**: zod `union(string \| object)` for one store entry; the object gained `scope:enum(["user","team"]).default("team")`, `promptIndex:string.refine(vNr).optional()`, `promptIndexMaxBytes:number.int().positive().optional()`. v2.1.156 `dp_` (@436758) was `{path, mode:enum(["rw","ro"]).default("rw"), mount?}`. |
| `tgi` | `absoluteStorePath` | cli_inner_pretty.js (schema region) | function | zod schema for the bare-string / `path` field (absolute path). Carryover; referenced by `bQu`. |
| `_Qu` | `MOUNT_REGEX_MSG` | cli_inner_pretty.js (schema region) | constant | Validation message for the `mount` regex `[A-Za-z0-9_-]+`. Carryover. |

## Module: Auto Memory — `promptIndex` Network Fetch & Injection (Delta 2)

> The fetch helpers + `memory_prompt_index` telemetry are NEW since ~2.1.172. The first time auto-memory
> *pulls* content over the network into the recall prompt (v2.1.156 only ever inlined the local `MEMORY.md`).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `agi` | `fetchStorePromptIndices` | cli_inner_pretty.js:150754-150767 | function | **NEW (Delta 2)**: calls `Zse` defensively (returns `[]` on parse error), filters stores with a defined `promptIndex`, runs all fetches under `Promise.allSettled`, flat-maps to fulfilled non-null results. One slow/failing store never aborts the others or the turn. No v2.1.156 equivalent. |
| `kQu` | `fetchOnePromptIndex` | cli_inner_pretty.js:150768-150789 | function | **NEW (Delta 2)**: fetch one store's index via `new m_n(store).readByPath(index)` wrapped in a 5 s timeout; re-checks `vNr` (defence in depth); a `null` (not found) resolves to `{mount,promptIndex,content:""}`; classifies thrown errors as `timeout`/`error`; emits `memory_prompt_index` telemetry. No v2.1.156 equivalent. |
| `xQu` | `MEM_PROMPT_INDEX_TIMEOUT_MS` | cli_inner_pretty.js:150791 | constant | **NEW (Delta 2)**: `var xQu = 5000` — the `promptIndex` fetch timeout (ms). |
| `m_n` | `MemoryStoreClient` (memory-service backend) | cli_inner_pretty.js:150574 | class | Store transport client; `readByPath` reads an index over the memory-service. **Carryover transport** from v2.1.156 (the multistore push/pull layer is unchanged); only its use by `kQu` for `promptIndex` is new. |
| `cXa` | `buildPromptIndexSizeWarning` | cli_inner_pretty.js:447180-447213 | function | **NEW (Delta 2)**: builds a one-line warning when an index file approaches/exceeds `promptIndexMaxBytes ?? HTe` (default 25 KB), with thresholds `kBp=0.8` (warn) / `LBp=0.7` (compact target). Nudges the model to compact an oversized team index. *(Low confidence on exact UX trigger — see caveat below.)* |
| `kBp` | `PROMPT_INDEX_WARN_FRACTION` | cli_inner_pretty.js (~447180, near `cXa`) | constant | `0.8` — index-size warn threshold fraction. **NEW (Delta 2)**. |
| `LBp` | `PROMPT_INDEX_COMPACT_FRACTION` | cli_inner_pretty.js (~447180, near `cXa`) | constant | `0.7` — index-size compaction-target fraction. **NEW (Delta 2)**. |

## Module: Auto Memory — Recall Dispatcher & Prompt Builders (Delta 3)

> The recall dispatcher `e0t` and its builder family were rewritten to route by `scope`+`mode` (rw/ro).
> v2.1.156's `sM$` had a flat 6-branch dispatch with no scope/mode awareness. Builder bodies were read
> for signatures + the `Agi` rw/ro branching (medium confidence on the exhaustive per-variant diff).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `e0t` | `loadMemoryPrompt` | cli_inner_pretty.js:151847-151960 | function | **CHANGED (Delta 3, HEADLINE)**: `async` recall dispatcher building the "memory" system-prompt section. Now injects `<memory path="team/<mount>/<index>">` blocks from `agi()` (with a "reference data, not instructions" preamble and `</memory>` close-tag neutralization), tracks read-only mounts, and in the team branch splits stores into rw/ro lists and dispatches to `Agi`. **Rename of** v2.1.156 `sM$` (@145046). |
| `jQu` | `parseMemoryStoresEnvSafe` | cli_inner_pretty.js:151840-151846 | function | **NEW (Delta 3)**: `try { return Zse() } catch { return null }` — try-wrapped parse used by `e0t` so a bad env value degrades to "no stores" rather than throwing into prompt construction. |
| `mgi` | `buildCombinedPrivateTeam` (combined private+team fallback builder) | cli_inner_pretty.js:151194-151264 | function | **NEW (Delta 3)**: combined private+team builder; the team-branch fallback when stores are not parsed or a writable user store is present. v2.1.156 analog: the team path of `sM$` → `buildCombinedMemoryPrompt`. |
| `Agi` | `buildTeamRecallRwRo` (multi-directory rw + ro team builder) | cli_inner_pretty.js:151265-151370 | function | **NEW (Delta 3)**: signature `Agi(rwList, roList, indexBlocks, tiny=false)`; renders writable-store guidance (single/multi/none), a separate read-only-stores note, and a conditional "## How to save memories" step only when ≥1 writable store; adapts the index-truncation hint to whether **every** writable store declares a `promptIndex`. |
| `bgi` | `buildTinyMemoryPrompt` (tiny single-dir) | cli_inner_pretty.js:151378-151425 | function | **NEW (Delta 3)**: tiny single-dir builder; the tiny-branch fallback when `Nk()` is false. v2.1.156 analog `ZFK`. |
| `Sgi` | `buildTinyTeamMemoryPrompt` (tiny private+team) | cli_inner_pretty.js:151426-151480 | function | **NEW (Delta 3)**: tiny dual-dir (private + team) builder for the tiny-mode team branch. v2.1.156 analog `GFK`. |
| `Egi` | `buildSimpleMemoryPrompt` (simple-system-prompt builder) | cli_inner_pretty.js:151481-151520 | function | **NEW (Delta 3)**: compact single/dual-dir builder for the simple-system-prompt branch (`Dg(model)` true). v2.1.156 analog `TFK`. |
| `Dg` | `isSimpleSystemPrompt` | cli_inner_pretty.js:134268 | function | Memoized simple-system-prompt gate consulted by `e0t`'s simple branch. **Rename of** v2.1.156 `X3` (@143872). |
| `aH` | `isTinyMemoryEnabled` | cli_inner_pretty.js:147673-147675 | function | `return ct("tengu_billiard_aviary", !1)` — tiny-memory variant gate consulted by `e0t`. **Rename only** of v2.1.156 `_D` (@142142); flag string unchanged. |

## Module: Auto Memory — Team-Enable Gate & Paths (Delta 4)

> The 2.1.172 changelog headline: a mounted `CLAUDE_MEMORY_STORES` now enables team recall outright,
> surfacing team stores in remote sessions independent of `tengu_herring_clock`.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Nk` | `isTeamMemoryEnabled` | cli_inner_pretty.js:151098-151102 | function | **CHANGED (Delta 4, the 2.1.172 fix)**: `if (!Iu()) return !1; if (process.env.CLAUDE_MEMORY_STORES?.trim()) return !0; return ct("tengu_herring_clock",!1)` — a mounted store now enables team recall outright. v2.1.156 `nM$` (@144715) was `if (!M1()) return !1; return V$("tengu_herring_clock",!1)` (flag-only). |
| `Iu` | `isAutoMemoryEnabled` | cli_inner_pretty.js:147636-147652 | function | Master gate; remote sessions stay enabled when `CLAUDE_CODE_REMOTE_MEMORY_DIR` / `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` is set (the `CLAUDE_CODE_REMOTE && !remote_mem_dir && !override` disable clause is skipped). Same chain as v2.1.156 `M1` (@142111) — **rename only**; quoted in Delta 4 for the remote-session path. |
| `Wse` | `getRemoteMemoryRoot` | cli_inner_pretty.js:147666-147669 | function | Returns `CLAUDE_CODE_REMOTE_MEMORY_DIR` when set, else the default home root; the root under which `hm()` resolves. The env hook behind the remote-recall fix. (No clean v2.1.156 single-symbol ancestor.) |
| `hm` | `getAutoMemBaseDir` | cli_inner_pretty.js:147746-147749 | function | Memoized (`wn(...)`) private memory base dir `<Wse()>/projects/<slug>/(memory\|tiny_memory)/`. **Rename only** of v2.1.156 `TA` (@142211); v2.1.88 `getAutoMemPath`. |
| `uH` | `getTeamMemPath` | cli_inner_pretty.js:151103-151105 | function | `(tP.join(hm(),"team") + tP.sep).normalize("NFC")` — the `hm()/team/` directory. **Rename only** of v2.1.156 `Jv` (@144718); v2.1.88 `getTeamMemPath`. |

## Module: Auto Memory — Watcher Scope-Split (Delta 5)

> The memory-watcher startup now splits parsed stores into separate team (`rX`) and user (`$W`)
> multistore lanes by `scope` and emits a new per-lane event. v2.1.156 fed parsed stores to the team lane
> only (no scope filter). The multistore transport (`lAo`/`pAo`/`CNr`/`m_n`) is carryover.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `uFp` | `startMemoryWatcher` (memory-watcher start) | cli_inner_pretty.js:449203-449263 | function | **CHANGED (Delta 5)**: `async` watcher startup; splits `Zse()` output into `s = scope==="team"` and `i = scope==="user"`, builds a team multistore `rX` and (NEW) a user multistore `$W`, runs an initial sync per non-null lane, emits `tengu_team_mem_sync_started` and (NEW) `tengu_personal_mem_sync_started`. **Rename of** v2.1.156 `LU_` (@438392) which fed the team lane only. |
| `rX` | `teamMultistore` | cli_inner_pretty.js:449224 (assign) | variable | Team-scope multistore object `lAo(CNr(teamStores), …)`. **Rename of** v2.1.156 `Tl` (@438416). The scope-filtered driving of it is new; the multistore object type is carryover. |
| `$W` | `userMultistore` | cli_inner_pretty.js:449230 (assign) | variable | **NEW (Delta 5)**: user-scope multistore `lAo(CNr(userStores), …)` fed by `CLAUDE_MEMORY_STORES` `scope:"user"` entries; nulls the legacy single-store `user.syncState`. No v2.1.156 equivalent (the v2.1.156 user lane used the separate single-store `RGH()` personal-sync path). |
| `lAo` | `buildMultistore` | cli_inner_pretty.js (transport region) | function | Builds a multistore sync object from store clients + mount/scope metadata. **Carryover transport** (v2.1.156 `T24`); reused for both lanes. |
| `pAo` | `pushMultistore` | cli_inner_pretty.js (transport region) | function | Startup push for a multistore lane. **Carryover transport**. |
| `CNr` | `storeClients` | cli_inner_pretty.js (transport region) | function | Maps parsed store records → `m_n` store clients. **Carryover transport** (v2.1.156 `q24`). |
| `lje` | `isUserStoreEnabled` | cli_inner_pretty.js:289759-289761 | function | `if (!Iu()) return !1; return ct("tengu_marble_lark", !1)` — the user-store gate driving the watcher's user lane. The `tengu_marble_lark` flag + user lane existed in v2.1.156 (`yhH`); only the `CLAUDE_MEMORY_STORES`+`scope:"user"` integration is new. |

## Module: Auto Memory — `memory_saved` Status Line (Delta 6)

> The 2.1.181 render change: the per-file clickable list is now verbose-only. The message factory, verb,
> and summary computation are unchanged carryover; only the renderer body changed (removal of the
> `slice(0, ak_)` truncation + the `iP` "+N more files" component).

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `Svp` | `renderMemorySaved` | cli_inner_pretty.js:383399-383440 | function | **CHANGED (Delta 6, 2.1.181)**: `memory_saved` REPL renderer; the file list is now `y = o && s.map(Evp)` (@383429) — produced **only when verbose (`o`)** is truthy; otherwise nothing. **Rename of** v2.1.156 `sk_` (@393698), which computed `D = verbose ? z : z.slice(0, ak_)` (always a truncated list) plus a `iP` "+N more files" expandable count. |
| `Evp` | `renderClickableFile` | cli_inner_pretty.js:383441-383443 | function | Per-path key/wrapper that renders each `writtenPaths` entry as a clickable `Hvp`. **Rename of** v2.1.156 `tk_`; structure unchanged (file list rendering itself is the same — only its *gating* changed). |
| `Hvp` | `clickableFile` | cli_inner_pretty.js:383444 | function | Clickable file row (`Box` with `onClick → openFile`, hover underline, `basename(path)`). **Rename of** v2.1.156 `ek_`; carryover structure. |
| `SNa` | `statusLineDispatch` (memory_saved case) | cli_inner_pretty.js:382861, 382871-382872 | function | Status-line renderer dispatch; for `subtype === "memory_saved"` computes the effective verbose flag `p = o \|\| !!s` (`verbose \|\| isTranscriptMode`, @382872) and passes it to `Svp`. **Rename of** v2.1.156 `SNa`-analog @393207. The `verbose \|\| isTranscriptMode` derivation is **carryover** (v2.1.156 @393209) — NOT part of the delta. |
| `ANa` | `teamMemSavedPart` | cli_inner_pretty.js:382753-382757 | function | Builds the "N team memories" summary segment from `message.teamCount`. **Carryover** logic (v2.1.156 `gk_.teamMemSavedPart`); the summary computation is identical in both builds. |
| `YGn` | `createMemorySavedMessage` | cli_inner_pretty.js:589751-589760 | function | `{type:"system", subtype:"memory_saved", writtenPaths, timestamp, uuid, isMeta:false}` factory. **Carryover** shape (v2.1.156 `CT8`-family); still carries the **full** `writtenPaths` array — only the default rendering of that array changed in Delta 6. |

## Module: Auto Memory — Runtime Engine Carryover (re-mapped to v2.1.183 aliases)

> These were re-verified present and structurally identical in v2.1.183 — the runtime engine of auto
> memory did NOT change. Rows are listed only so a downstream doc can re-map a v2.1.156 name to its
> v2.1.183 alias. Full analysis stays in the v2.1.156 baseline `31_auto_memory/` docs; do NOT re-derive.

| Obfuscated | Readable | File:Line | Type | Description |
|------------|----------|-----------|------|-------------|
| `$w` | `ENTRYPOINT_NAME` (`"MEMORY.md"`) | cli_inner_pretty.js:150799 | constant | Entrypoint filename. **Rename only** of v2.1.156 `OX`/`g75`; value unchanged. |
| `tie` | `MAX_ENTRYPOINT_LINES` (`200`) | cli_inner_pretty.js:150800 | constant | Entrypoint line cap. **Rename only** of v2.1.156 `B9H` (@143880); value unchanged. |
| `HTe` | `MAX_ENTRYPOINT_BYTES` (`25000`) | cli_inner_pretty.js:150801 | constant | Entrypoint byte cap; also the default for `promptIndexMaxBytes ?? HTe` in `cXa`. **Rename only** of v2.1.156 `aM$` (@145142); value unchanged. |
| `Nyn` | `isExtractModeActive` (extraction gate) | cli_inner_pretty.js:147662-147665 | function | `if (!ct("tengu_passport_quail",!1)) return !1; return !xr() \|\| ct("tengu_slate_thimble",!1)` — per-turn extraction trigger gate. **Rename only** of v2.1.156 `S88` (@142131); flag strings unchanged. (Subagent-adjacent — cross-link `symbol_index_core_execution.md`.) |
| `BQa` | `autoDreamExtractor` (per-turn scheduler) | cli_inner_pretty.js:455415 | function | Per-turn auto-dream scheduler closure (`BQa = async function(n,r)` @455415; gate → scan-throttle → lock → fork loop). **Rename of** v2.1.156 `B04` (@448551); logic identical. (Subagent-adjacent — cross-link `symbol_index_core_execution.md`.) |
| `w2p` | `getDreamThresholds` | cli_inner_pretty.js:455394 | function | Reads `tengu_onyx_plover` `{minHours,minSessions}` positive-finite else `{24,5}` defaults. **Rename of** v2.1.156 `ag_` (@448529). |
| `PQa` | `buildDreamPrompt` (per-turn consolidation) | cli_inner_pretty.js:455311 | function | `function PQa(e,t,n,r=!1)` @455311; builds the auto-dream fork prompt ("# Dream: Memory Consolidation" header @455312); 4 phases Orient/Gather/Consolidate/Prune. **Rename of** v2.1.156 `C04` (@448446); shape unchanged. |
| `YSf` | `MEMORY_UPDATE_SOURCE_LABELS` (`{dream:"Background memory consolidation"}`) | cli_inner_pretty.js:590643 | constant | Source-label map for the ambient `memory_update` system message. **Rename only** of v2.1.156 `BQ_` (@446768); value unchanged. |
| `BDp` | `LOCK_FILE_NAME` (`".consolidate-lock"`) | cli_inner_pretty.js:424663 | constant | Auto-dream lock filename. **Rename only** of v2.1.156 `qE_` (@399401); value unchanged. |
| `FDp` | `HOLDER_STALE_MS` (`3600000`, 1 hr) | cli_inner_pretty.js:424664 | constant | Lock stale window (1 hour). **Rename only** of v2.1.156 `KE_` (@399402); value unchanged. |
| `pendingMemoryUpdates` | `pendingMemoryUpdates` (appState queue, default `[]`) | cli_inner_pretty.js:294619 (init) | variable | Ambient memory-update queue (init), pushed by the dream finalizer, drained per turn at @465837. **Carryover** flow/label from v2.1.156. |

---

## Telemetry events & flags (verified)

| Event / Flag | File:Line (v2.1.183) | Notes |
|--------------|----------------------|-------|
| `memory_prompt_index` | cli_inner_pretty.js:150770-150785 (emit) | **NEW (Delta 2)**: states `unsafe_path` / success / `timeout` / `error` from `kQu`. Grep: 4 hits v2.1.183, **0** v2.1.156. |
| `tengu_personal_mem_sync_started` | cli_inner_pretty.js:449257 (emit, in `uFp`) | **NEW (Delta 5)**: user-lane watcher-start event `{multistore, watcher_started}`. Grep: 1 hit v2.1.183, **0** v2.1.156. |
| `tengu_team_mem_sync_started` | cli_inner_pretty.js:449255 (emit, in `uFp`) | Team-lane watcher-start event `{multistore, stores, watcher_started}`. Carryover (count 1 in both builds). |
| `tengu_herring_clock` | read by `Nk` @151102 | Team-memory rollout flag; in v2.1.183 it is the **fallback** (a mounted store enables team recall first). Carryover flag string. |
| `tengu_marble_lark` | read by `lje` @289760 | User-store flag; existed in v2.1.156. Only its `CLAUDE_MEMORY_STORES`+`scope:"user"` integration is new. |
| `tengu_billiard_aviary` | read by `aH` @147674 | Tiny-memory variant flag. Carryover. |
| `tengu_passport_quail` / `tengu_slate_thimble` | read by `Nyn` @147663-147664 | Extraction master-enable + in-interactive override. Carryover. |
| `tengu_onyx_plover` | read by `w2p`/dream config | Auto-dream `onyx` config (`{minHours,minSessions}`). Carryover. |
| `tengu_kairos_dream` | (absent) | The old `/dream` slash-command skill gate — **0 hits** in both v2.1.156 and v2.1.183; `/dream` remains a scheduled-task routine scaffold. |

## Carryover transport / env (clarified — NOT re-documented here)

- **Multistore sync/push/pull** (`lAo`/`pAo`/`CNr`/`m_n`, `tengu_team_mem_multistore_sync`/`_pull`/`_push`/`_config_invalid`): transport layer carryover from v2.1.156 (these events count 1 in both builds). Only the scope-split *driving* it (Delta 5) is new. → v2.1.156 baseline docs.
- **`CLAUDE_CODE_REMOTE_MEMORY_DIR`** (8 occurrences in v2.1.183): consumed by `Wse` (@147666); the env hook behind the remote-recall fix. **No effect on the status-line renderer.**
- **`CLAUDE_COWORK_MEMORY_*` family** (`_GUIDELINES`, `_EXTRA_GUIDELINES`, `_INDEX_CONTENT`, `_PATH_OVERRIDE`): feed the cowork branch of `e0t` (@151847). Part of the team-store recall surface, not the status line.

## Open questions / low-confidence items (carried from the dossier)

1. **Exact introducing patch.** Deltas 1–5 are present in v2.1.183, absent in v2.1.156; the changelog pins the remote team-store recall fix (Delta 4) to **2.1.172**. Intermediate builds (2.1.157–182) were not bisected, so the precise introducing version of `promptIndex` (Delta 2) vs the `scope` split (Deltas 1/3/5) could differ by a few patches. `Since` values are best-effort.
2. **`cXa` / `promptIndexMaxBytes` warning UX trigger** (low confidence). The size-warning *builder* `cXa` (@447180) is verified; not every call site that surfaces its output to the user (vs. folds it into the index-injection preamble) was traced. The `kBp`/`LBp` threshold fractions are read near the builder but their exact declaration lines were not isolated.
3. **`Agi`/`mgi`/`Sgi`/`Egi`/`bgi` builder bodies** (medium confidence). Signatures + the rw/ro branching of `Agi` are verified; not every rendering variant of all five was exhaustively diffed against its v2.1.156 analog (`eM6`/`ZFK`/`GFK`/`TFK`/`VFK`).
4. **Writable user-scope store end-to-end** (medium confidence). The parse, watcher split (`$W`), and the `e0t` `!stores.some(s=>s.scope==="user"&&s.mode==="rw")` guard are confirmed; how a *writable* user-scope store changes the *personal* (non-team) recall branch was not fully traced.

---

## Related Symbols

> Mapping tables in this file ARE the source of truth for the v2.1.183 auto-memory deltas (this is a
> `symbol_additions` file). For the broader indexes see:
> - [symbol_index_core_features.md](symbol_index_core_features.md) — Auto Memory module home
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) — forked extraction/dream entrypoints, drain (cross-link only)
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) — telemetry events, settings, env gates
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) — `memory_saved` UI renderer / clickable-file component
>
> Module docs for this delta:
> - [../31_auto_memory/README.md](../31_auto_memory/README.md) — delta overview + carryover "what NOT to re-read" list
> - [../31_auto_memory/team_memory_stores_recall.md](../31_auto_memory/team_memory_stores_recall.md) — Deltas 1–5 (schema, fetch, recall routing, gate fix, watcher split)
> - [../31_auto_memory/status_line_and_misc_delta.md](../31_auto_memory/status_line_and_misc_delta.md) — Delta 6 (verbose-only file list) + env-surface note
