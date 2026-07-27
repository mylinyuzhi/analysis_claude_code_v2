# 50 — Performance and memory (v2.1.193 → v2.1.220)

> **Delta module.** Documents the `2.1.193 → 2.1.220` changes to resource use: memory bounds, leak
> fixes, per-turn and per-frame CPU, and on-disk transcript size.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`).
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
> (718,679 lines). Every bare `cli_inner_pretty.js:<line>` is a **220** line; baseline lines are
> tagged `(193)`.
> Symbols are **re-mangled every build** — no 2.1.193 obfuscated name is reused as a 220 name here;
> every symbol below was re-derived by reading the 2.1.220 bundle.

| File | Covers |
|---|---|
| [`memory_bounds_and_leaks.md`](./memory_bounds_and_leaks.md) | the `.208` four-leak batch, the 16 MiB edit read cache, the long-single-line read guard, the `.205` streaming updater, the `.214` bounded settings read, the `.217` truncation flattening |
| [`cpu_and_caching.md`](./cpu_and_caching.md) | the `.208` rule-matching / tool-pool hoist, the `.196` render subtree prune, the `.208` markdown-table cap and cell memo, and four bullets I could not anchor (with eliminations) |
| [`disk_and_transcript.md`](./disk_and_transcript.md) | the `.208` 79× transcript reduction and backup pruning, the undocumented transcript local GC, the `.199` resume-append fix, the `.208` fork-context cache, the `.214` byte-scaled exit drain, **the `.218` pre-exit flush registry**, two unanchorable bullets |

---

## 1. TL;DR — what actually changed

**Seven mechanisms are genuinely new and fully traced:**

1. **Truncation stopped retaining its input.** `flattenString` = `Buffer.from(s,"utf16le").toString("utf16le")`
   (**220=1 / 193=0**, `:20687`) breaks V8's `SlicedString` parent pointer. It is wired into the
   product-wide truncator `ma`, which has **65 call sites** (193's `ZI` had 14 and did not flatten).
   The `.217` MCP bullet is one symptom of a class fix.
   → [`memory_bounds_and_leaks.md`](./memory_bounds_and_leaks.md) §6
2. **Transcript writes went from state to transitions.** `file-history-delta` (**220=5 / 193=0**)
   replaced "re-serialise the whole snapshot on every tracked edit". The write pattern drops from
   `O(D²)` to `O(D)` in distinct files edited; the changelog's 79× implies `D ≈ 157`, which the
   arithmetic `(D+1)/2` reproduces exactly.
   → [`disk_and_transcript.md`](./disk_and_transcript.md) §1
3. **One three-line hoist fixes two `.208` bullets.** `let r = mM(t);` (`:425005`) +
   `(r ?? mM(e))` (`:513296`) move the deny-rule collect-and-parse out of the per-tool filter.
   Both "many deny/ask rules" and "7x faster tool rounds" are this edit.
   → [`cpu_and_caching.md`](./cpu_and_caching.md) §1
4. **Two new resource caps with named constants:** the LSP open-document LRU
   `zCy = 50` (`:307353`, with a real `textDocument/didClose` on eviction) and the edit read cache
   `eky = 1000, tky = 16777216` (`:310489-310490`, an LRU replacing a FIFO with no byte budget).
   → [`memory_bounds_and_leaks.md`](./memory_bounds_and_leaks.md) §2, §4
5. **Two listener detaches that had simply been forgotten** — MCP stdio stderr at `:294911`
   (`m.off("data", f), m.resume()`) and async-hook stdout/stderr at `:520107-520108`. Neither adds a
   literal; both are provable line-by-line against 193.
   → [`memory_bounds_and_leaks.md`](./memory_bounds_and_leaks.md) §1, §3
6. **In-flight coalescing for fork-context hydration** (`Q2o`, `:524295-524298`) — K background
   agents forked from the same conversation now share one transcript load, plus a 16 MiB byte budget
   (`bB_`, `:527424`) on top of the pre-existing 4-entry cap.
   → [`disk_and_transcript.md`](./disk_and_transcript.md) §4
7. **A second process-shutdown registry shipped.** `registerPreExitFlush` (**220=2 / 193=0**, `:4353`)
   with its own singleton `F0l` (`:4383`) and drain `HFn` (`:4356`). The `DisposerRegistry` class body
   is byte-identical to 193's; the entire fix is *instantiating it twice* and re-registering the
   remote-control client across both phases (`registerShutdownCleanup`, `:416193`). The drain is
   deliberately **not** a `process.on("exit")` hook — it is the last `await` of the async shutdown
   ladder (`:522369`), which is the only way an HTTPS flush can happen at all.
   → [`disk_and_transcript.md`](./disk_and_transcript.md) §6

**Three findings the changelog does not contain:**

- **A transcript local GC shipped dark.** `CLAUDE_CODE_TRANSCRIPT_LOCAL_GC` (**220=2 / 193=0**) plus a
  four-class retention table (`boundary-cleared` **220=7 / 193=0**), gated by
  `Ke("tengu_transcript_local_gc", !1)` — **default false**. No bullet mentions it, and the 79×
  headline is *not* it. → [`disk_and_transcript.md`](./disk_and_transcript.md) §2
- **"Rule matchers are now compiled once and cached" is accurate, but only for the *path* matchers.**
  The deny/ask path-rule builder `s9s` (`:528463`) is memoised in a `WeakMap` keyed on rule-set identity
  plus an environment-composite key (`r9s`, `:529043`), and its `patternMap` structure is
  **220=4 / 193=0** — genuinely new. The tool-name **glob** matcher `SMi` (`:60306`) was *not* cached and
  is byte-identical to 193's `rCr` (`:55957 (193)`). So the bullet is partial, not false.
  → [`cpu_and_caching.md`](./cpu_and_caching.md) §1.4 and §1.4b
- **The `.208` MCP "64 MB" figure is the pre-fix bound, not a new cap.** `67108864` is in 193 at the
  same site. A count-based check therefore scores this bullet "carryover" and misses the real fix.

**Three false deltas caught:**

| Bullet | Anchor | 220 | 193 | Reality |
|---|---|---|---|---|
| `.199` "resuming with no new messages needlessly growing the transcript" | the metadata dedup (`entries.filter(… d(p) !== d(f))`) | present | present `:582398 (193)` | The dedup is **carryover**. The real delta is that 220 now *recovers* `last-prompt` (and `relocated`) from disk before planning, so the planned entry can match. `normalizeLastPrompt` 220=3/193=0. |
| `.202` "resume-by-name slow in many-worktree repos" | `worktrees exceeds fanout cap` | 1 (`:545665`) | 1 (`:568798`) | Byte-identical. Also carryover: `getSessionFilesLite`, `getSessionFilesWithMtime`, `loadSameRepoMessageLogsProgressive`, `loadAllProjectsMessageLogsProgressive` — all 1/1. |
| `.208` "file edit read cache … 16 MB" | `16777216` | 24 | 16 | The raw count is useless (Yoga flags, DES tables, React lanes) **and** the window introduces *two* distinct 16 MiB budgets (`tky` edit cache, `bB_` fork cache). Anchor on the constant identifier. |

**Additionally established as carryover** while hunting `.216`: the thinking-strip normalizer
(`U9s` `:533670` ↔ `YSo` `:602157 (193)`, byte-equivalent including its early-out), the anchored token
counter (`anchorIndex` 3/3), the context-usage indicator's memo shape, and the snapshot ring-buffer
cap (`dCt = 100` ↔ `a9a = 100`).

---

## 2. The constants introduced or changed in this window

The single most useful artefact for a reader of this module. Every line was read in the 2.1.220 bundle.

| Constant | Value | Line | What it bounds | 193 |
|---|---|---|---|---|
| `zCy` `LSP_MAX_OPEN_DOCUMENTS` | `50` | `:307353` | open LSP documents per session (LRU) | **no cap** |
| `tky` `EDIT_CACHE_MAX_CHARS` | `16777216` | `:310490` | file edit read cache, chars | **no byte budget** |
| `eky` `EDIT_CACHE_MAX_ENTRIES` | `1000` | `:310489` | file edit read cache, entries | `1000` (`maxCacheSize`, `:375740 (193)`) — carryover |
| `bB_` `FORK_CONTEXT_CACHE_MAX_BYTES` | `16777216` | `:527424` | cached fork-context prefixes, bytes | **no byte budget** |
| `_B_` `FORK_CONTEXT_CACHE_MAX_ENTRIES` | `4` | `:527423` | cached fork-context prefixes | `Mjf = 4` (`:585522 (193)`) — carryover |
| `Xye` `MAX_SETTINGS_FILE_BYTES` | `2097152` | `:62620` | any settings file read | **unbounded** |
| `fa_` `MAX_AUTO_MODE_SECTION_BYTES` | `Xye / 4` | `:447658` | `autoMode` section warning threshold | — |
| `_Up` `MAX_TABLE_ROWS` | `200` | `:636511` | markdown table rows rendered | **no cap** |
| `TSs` `BYTES_PER_TOKEN_READ_BUDGET` | `128` | `:284307` | `maxSelectedBytes = maxTokens × 128` | **no such budget** |
| `f9m` `ASSUMED_PIPE_THROUGHPUT_BPS` | `262144` | `:20646` | exit-drain budget scaling | flat 2 s |
| `m9m` `DRAIN_BUDGET_CEILING_MS` | `30000` | `:20647` | exit-drain hard ceiling | — |
| `k7y` `INTERNAL_EVENT_FLUSH_DEADLINE_MS` | `3000` | `:416223` | the `.218` pre-exit internal-event flush | **no pre-exit flush existed** |
| `$ip` `EXIT_HANDOFF_FAILSAFE_MS` | `15000` | `:522405` | forced-exit failsafe when a handoff is pending | **220=1 / 193=0** |
| `GF_` (final failsafe pad) | `1500` | `:522406` | added to the stdout budget at step 11 of shutdown | — |
| `xup` `DOWNLOAD_DEADLINE_MS` | `600000` | `:540393` | updater *total* deadline (new second clock) | value existed as the axios `timeout` only (`K1p`, `:352603 (193)`) |
| `Tj_` `DOWNLOAD_STALL_TIMEOUT_MS` | `120000` | `:540391` | updater stall clock | `z1p = 120000` — carryover |
| `Dbr` `MAX_DOWNLOAD_ATTEMPTS` | `3` | `:540392` | updater retries | `iho = 3` — carryover |
| `highWaterMark` (inline) | `4194304` | `:540228` | updater write-stream buffer | n/a (was a whole-body `ArrayBuffer`) |
| `67108864` (inline) | 64 MiB | `:294837` | MCP stdio stderr accumulator | **`:293619 (193)` — carryover** |
| `dCt` `MAX_SNAPSHOTS` | `100` | `:24774` | file-history snapshot ring | `a9a = 100` — carryover |
| `Vry` `WHOLE_FILE_READ_THRESHOLD` | `10485760` | `:235348` | read-whole-file vs stream | carryover value |
| `AVs` `MAX_TRANSCRIPT_READ_BYTES` | `52428800` | `:527411` | transcript read | name carryover; value unverified in 193 |

---

## 3. Per-bullet ledger

Every changelog bullet whose primary or secondary theme is `performance` in the five scoping files.
37 rows. "→ *module*" means another module owns the bullet and this one deliberately does not restate it.
Row 37 is the `.218` PR-event bullet, reassigned here from `44_telemetry` (see §5 note).

| # | Bullet (abridged) | Ver | Verdict | Anchor (220 / 193) | Where |
|---|---|---|---|---|---|
| 1 | Reduced per-frame rendering work by skipping no-op subtree walks during streaming | `.196` | **NET_NEW** | `hasAbsoluteDescendant` consumers 9 / **6**; new guards `:257174`, `:257236`, `:257260` | cpu §2 |
| 2 | Opening/resuming a session with no new messages needlessly growing the transcript | `.199` | **NET_NEW** (dedup is carryover) | `normalizeLastPrompt` 3 / **0**; `extractFieldFromLastEntryOfTypeStrict` 1 / **0**; `:523620-523625` | disk §3 |
| 3 | Rendering flicker under tmux 3.4+ fixed via synchronized output | `.200` | CARRYOVER (one-line delta) | `DECRQM(2026)` 1 / 1 | → `48_accessibility_ui` |
| 4 | Resume-by-name / resume picker slow + memory-hungry in many-worktree repos | `.202` | **CARRYOVER** | `worktrees exceeds fanout cap` 1 (`:545665`) / **1**; 4 loaders 1/1 | disk §7.2 |
| 5 | macOS bg session open stalling 15–20 s on false low-memory | `.203` | NET_NEW | `kern.memorystatus_vm_pressure_level` 1 / 0 `:552638` | → `36_background_agents` |
| 6 | Context-usage indicator re-analyzing the whole transcript every turn | `.203` | **UNANCHORED** | indicator memo `:742253` ≡ `:627048 (193)`; `anchorIndex` 3/3 — both eliminated | cpu §4.2 |
| 7 | Live-preview updates no longer re-render the whole screen while streaming | `.203` | **UNANCHORED** | `livePreview` 5 / **5** | cpu §4.3 |
| 8 | Binary size −7 MB and startup memory −7 MB via lazy dependency load | `.203` | **UNANCHORED** | `image-processor.node` 1/1, `audio-capture.node` 2/2; bundle grew +21.4 % | disk §7.1 |
| 9 | Crash when a file watcher was closed while a directory scan was in flight | `.205` | **NOT COVERED** | `FSWatcher` 2/2, `watcher closed` 0/0 | §5 |
| 10 | Auto-update downloads stream to disk (~400 MB less peak memory) | `.205` | **NET_NEW** | `highWaterMark: 4194304` 1 (`:540228`) / **0**; 5 sibling literals 220-only | mem §7 |
| 11 | Terminal freeze/keystroke lag streaming long lists, tables, code blocks | `.207` | PARTIAL (tables only) | `_Up = 200` `:636511` covers the table third; lists/code unanchored | cpu §3 |
| 12 | Bedrock multi-minute startup hang with `awsCredentialExport` | `.207` | CARRYOVER | `awsCredentialExport` 12 / 12 | → `55_auth_providers` |
| 13 | Very large markdown tables stalling render; >200 rows truncated with a notice | `.208` | **NET_NEW** | `_Up = 200` `:636511`; `more … row(s) not shown` 1 / **0** `:636279` | cpu §3 |
| 14 | Memory leak: agent-view pasted images retained for the screen's lifetime | `.208` | **UNANCHORED** | `pastedContents` 58 / **60** (shrank); all paste literals 1:1 | mem §9 |
| 15a | Leak: MCP stdio server stderr accumulating up to 64 MB per server | `.208` | **NET_NEW** (cap is carryover) | `67108864` 1 (`:294837`) / **1** (`:293619`); fix is `m.off("data", f)` `:294911` | mem §1 |
| 15b | Leak: LSP documents staying open indefinitely (now LRU with 50-doc cap) | `.208` | **NET_NEW** | `didClose for evicted document` 3 / **0** `:307185`; `zCy = 50` `:307353` | mem §2 |
| 15c | Leak: async hook output retained after backgrounding | `.208` | **NET_NEW** | `removeListener` pair `:520107-520108`; 193 `:589552` has none | mem §3 |
| 15d | Leak: unbounded growth in headless/SDK sessions from large tool-result payloads | `.208` | **UNANCHORED** | `MAX_TOOL_RESULT`, `emittedMessages`, `sentMessages` all 0/0 | mem §6 (candidate: the `ma`/`_Il` class fix) |
| 16 | Memory blowup reading files with extremely long single lines via offset/limit | `.208` | **NET_NEW** | `SelectedRangeTooLargeError` 2 / **0** `:235367`; `maxSelectedBytes` 11 / **0** | mem §5 |
| 17 | Multi-second per-turn slowdowns with many deny/ask rules — matchers cached | `.208` | **NET_NEW** (bullet wording wrong) | `(r ?? mM(e))` 1 / **0** `:513296` | cpu §1 |
| 18 | Input responsiveness while agent task lists update (no full re-render) | `.208` | **UNANCHORED** | no literal; React-Compiler slot churn is not evidence | cpu §4.3 |
| 19 | Per-tool-call CPU in print/SDK cut by caching tool-pool assembly (7x) | `.208` | **NET_NEW** (same edit as #17) | `let r = mM(t);` 1 / **0** `:425005` | cpu §1 |
| 20 | File edit read cache bounded to 16 MB instead of pinning up to 1,000 full files | `.208` | **NET_NEW** | `eky = 1000, tky = 16777216` `:310489-310490`; 193 `B8a` FIFO `:375738 (193)` | mem §4 |
| 21 | Transcript size cut up to 79x; checkpoint disk bounded by pruning backups | `.208` | **NET_NEW** (two mechanisms) | `file-history-delta` 5 / **0**; `failed to delete evicted backup` 1 / **0** `:308951` | disk §1 |
| 22 | Memory when resuming sessions with bg agents or forks from large conversations | `.208` | **NET_NEW** | `hydrateForkContext` 1 / **0** `:524292`; `bB_ = 16777216` `:527424` | disk §4 |
| 23 | Agents dashboard retaining pasted images from abandoned reply drafts | `.210` | **UNANCHORED** | same family as #14 | mem §9 |
| 24 | 300 ms delay revealing async content (Settings tabs, Stats, diff views) | `.211` | **UNANCHORED** | `delay: 300`, `loadingDelay`, `showAfter` all 0/0 | cpu §4.4 |
| 25 | Improved terminal layout and rendering performance | `.211` | **UNANCHORABLE** (umbrella) | `writableLength` 6/6, `syncOutput` 3/3 | cpu §4.5 |
| 26 | Unbounded memory on `--settings` device/multi-GB files; >2 MiB fails at startup | `.214` | **NET_NEW** | `ERR_NOT_REGULAR_FILE` 2 / **0**; `ERR_FILE_TOO_LARGE` 2 / **0**; `Xye = 2097152` `:62620` | mem §8 |
| 27 | stream-json truncation at exit; drain scales with queued bytes, not a flat 2 s | `.214` | **NET_NEW** | `scaleBudgetToQueue` 3 / **0** `:20552`; `f9m = 262144`, `m9m = 30000` | disk §5 (stream-json semantics → `51_headless_sdk`) |
| 28 | Message normalization cost grew quadratically with turns | `.216` | **UNANCHORED** | 5 candidate mechanisms read and eliminated | cpu §4.1 |
| 29 | Warnings when transcript writes fail (disk full) or session saving is off | `.217` | NET_NEW | `tengu_transcript_writer_recovered` 2 / **0**; `tengu_persistence_suppressed` 2 / **0** | **NOT COVERED** — §5 |
| 30 | Memory leak: truncated MCP tool outputs kept the full untruncated result | `.217` | **NET_NEW** | `Buffer.from(e,"utf16le").toString("utf16le")` 1 / **0** `:20688` | mem §6 |
| 31 | Windows auto-update failures leaving `claude.exe` missing | `.217` | DELTA | `claude.exe` 8/8 | → `misc` (not this module) |
| 32 | `CLAUDE.md`/`SKILL.md` `paths` frontmatter brace groups OOM-killing startup | `.217` | DELTA | `brace expansion` 1/1 is a **false match** (Bash parser) | **NOT COVERED** — §5 |
| 33 | Crashes (max call stack) on deeply nested watched-dir deletion and deep UI trees | `.218` | **UNANCHORED** (candidate found) | `Maximum call stack size exceeded` 0/0; candidate: `buy` recursion→stack `:257239-257261` | cpu §2 |
| 34 | Negative/incorrect turn durations after a clock adjustment | `.218` | DELTA | `_monotonicClock` 39 / 34 | → `44_telemetry` |
| 35 | Prompt history entries dropped or duplicated when history writes raced | `.218` | UNANCHORED | — | → `48_accessibility_ui` |
| 36 | Screen reader thinking-row re-rendering every few seconds | `.217` | — | — | → `48_accessibility_ui` |
| 37 | PR events occasionally lost when a session exited right after creating/linking a PR | `.218` | **NET_NEW** | `registerPreExitFlush` 2 / **0** `:4353`, `:416195`; `registerShutdownCleanup` 2 / **0**; `closeExceptInternalEvents` 3 / **0**; `flushErrorLogWriters` 1 / **0** | disk §6 |

**Tally for bullets this module owns (rows 1, 2, 4, 6–11, 13–28, 30, 33, 37):**
**12 NET_NEW · 1 PARTIAL · 1 CARRYOVER · 11 UNANCHORED · 1 UNANCHORABLE.**

That is a high unanchored rate, and it is expected: the scoping pass predicted 6 of 11 for `.206`–`.210`
alone. Four of those six are now anchored (rows 15a, 16, 20, 22); the survivors are all React
render-scoping fixes or removed timeouts, which by construction leave no literal, no constant and no
telemetry event.

---

## 4. Method notes for anyone extending this module

1. **The changelog number is usually not the constant.** Two of the five headline numbers here
   (`64 MB`, `400 MB`) are pre-fix measurements. Search for the *named* constant and read both sides.
2. **A `220=N / 193=M` count on an integer literal is nearly worthless.** `16777216` is 24/16 and
   `2097152` is 23/19, dominated by Yoga flag masks, DES S-boxes and React lane bitmaps. Counts are
   only meaningful on *distinctive strings* and *identifier names*.
3. **A leak fix often adds no literal at all.** Three of this module's six confirmed mechanisms
   (§1 MCP, §3 hooks in `memory_bounds_and_leaks.md`, §2 render prune in `cpu_and_caching.md`) are
   detach/prune edits. Find them by reading the *twin function* in 193 side by side, not by grepping.
4. **Export tables are the best source of readable names in this region.** `:522842-522996` (the
   session-store module, ~155 named exports), `:20502-20515` (stdout), `:513085-513088` (permissions),
   `:308844-308855` (file history), `:51300` (bounded reads). These gave `setTranscriptLocalGcEnabled`,
   `getStdoutDrainBudgetMs`, `getDenyRuleForTool`, `recordFileHistoryDelta`,
   `extractFieldFromLastEntryOfTypeStrict` and `hydrateForkContext` directly.
5. **When you cannot anchor, publish the eliminations.** `cpu_and_caching.md` §4.1 lists five
   mechanisms read and ruled out for `.216`. That is a smaller search space for the next reader and it
   is honest; a plausible guess is neither.

---

## 5. Not covered, and why

| Bullet | Ver | Reason |
|---|---|---|
| Crash when a file watcher was closed while a directory scan was in flight | `.205` | `FSWatcher` 2/2, `watcher closed` 0/0. A `try`/`catch` or a null guard, invisible in a literal diff. Its sibling — `.218`'s deeply-nested-watched-dir stack overflow — is also unanchored. |
| Warnings when transcript writes fail / session saving is off | `.217` | Genuinely net-new (`tengu_transcript_writer_recovered`, `tengu_persistence_suppressed`, both 220=2/193=0, plus `getPersistenceSuppressionCause` at `:522939`), but it is **telemetry and user messaging**, not a resource bound. It belongs with `44_telemetry`. The degraded-writer message is at `:523307-523309` if someone wants it. |
| `CLAUDE.md`/`SKILL.md` brace-expansion budget | `.217` | The `_false_delta_ledger` already proved `brace expansion` (`:211144`) is a false match — it is the Bash permission parser. `maxPatterns`, `pattern budget`, `expandedCount` are 0/0. This is a `45_skills` / ignore-pattern-compiler bullet, and I found no anchor for it either. |
| The `.208` "truncated stream-json output" and `.214` stream-json exit semantics | `.208` / `.214` | `51_headless_sdk` owns the protocol behaviour. Only the *budget constant* side of `.214` #19 is documented here (disk §5). |
| The macOS memory-pressure probe, roster memory, worktree enumeration | `.203`, `.216` | Owned by `36_background_agents`, already written. Linked, not restated. |
| The 200-row table's user-visible truncation notice and screen-reader behaviour | `.208` | `48_accessibility_ui` owns visible behaviour; only the cost bound is here. |

**Now covered (was a dangling deferral).** `44_telemetry/README.md` deferred `.218` "PR events lost on
immediate exit" here, but this module had no row for it — the bullet fell through the gap. It is now
**row 37** of §3 and [`disk_and_transcript.md`](./disk_and_transcript.md) §6, anchored on
`registerPreExitFlush` (**220=2 / 193=0**). The `CCRClient`-internal side of the same change — why
*internal* events specifically must outlive the other three uploaders — remains owned by
[`54_remote_control/transport_and_session_lifecycle.md`](../54_remote_control/transport_and_session_lifecycle.md) §2.5,
which this module links rather than restates.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All new symbols from this module are staged in
> [symbol_additions_v2_1_220_performance.md](../00_overview/symbol_additions_v2_1_220_performance.md).

Key entry points for this module:
- `flattenString` (`_Il`, `:20687`) - the `SlicedString` breaker behind `.217`
- `truncateStart` (`ma`, `:20675`) - 65 call sites; the product-wide truncator
- `drainStdoutBeforeExit` (`jzt`, `:20552`) / `getStdoutDrainBudgetMs` (`OUn`, `:20578`) - `.214` exit drain
- `assertReadableRegularFile` (`F4l`, `:49998`) - `.214` bounded settings read
- `evictOverflowDocuments` (`s`, `:307179`) with `LSP_MAX_OPEN_DOCUMENTS` (`zCy`, `:307353`) - `.208` LSP LRU
- `reduceFileHistoryState` (`UHe`, `:308856`) with `deleteEvictedBackupFiles` (`bxy`, `:308937`) - `.208` transcript + checkpoint
- `EditFileReadCache` (`OZu`, `:310451`) - `.208` 16 MiB edit cache
- `readFileWithLineRange` (`lFe`, `:235119`) with `SelectedRangeTooLargeError` (`Rir`, `:235367`) - `.208` long-line guard
- `filterToolsByDenyRules` (`nve`, `:425004`) with `getDenyRuleForTool` (`WB`, `:513293`) - `.208` rule/tool-pool hoist
- `hydrateForkContext` (`Csp`, `:524292`) - `.208` fork-context coalescing
- `isTranscriptLocalGcEnabled` (`kCm`, `:840677`) - the undocumented, default-off transcript GC
- `blitEscapingAbsoluteRects` (`buy`, `:257235`) - `.196` render subtree prune
- `renderMarkdownTable` (`EUp`, `:636292`) with `MAX_TABLE_ROWS` (`_Up`, `:636511`) - `.208` table cap
- `downloadBinaryToFile` (`kj_`, `:540200`) - `.205` streaming updater
- `registerPreExitFlush` (`kFn`, `:4353`) / `drainPreExitFlush` (`HFn`, `:4356`) - the `.218` phase-2 registry, **220-only**
- `DisposerRegistry` (`vvi`, `:4361`) with `cleanupRegistry` (`N0l`, `:4382`) and `preExitFlushRegistry` (`F0l`, `:4383`)
- `gracefulShutdown` (`Ds`, `:522314`) - the 11-step exit ladder; `await HFn()` at `:522369`
- `CCRClient.registerShutdownCleanup` (`:416193`) - registrant 1; `flushErrorLogWriters` (`Gcp`, `:538540`) - registrant 2
