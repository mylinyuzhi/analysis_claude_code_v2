# 04_tools — Tool surface and individual tool behaviour (v2.1.193 -> v2.1.220)

**Bundles** ([`../_CONVENTIONS.md`](../_CONVENTIONS.md) §1):

```
TARGET   /lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js   872,596 lines
BASELINE /lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js   718,679 lines   (cited as "(193)")
```

Every line number below without a `(193)` tag was read in the **2.1.220** bundle during this pass.

---

## The story of this window for the tool theme

Three things happened to the tool layer across the 25 releases from `.195` to `.220`, and only one of them
is what the changelog emphasises.

**1. The surface grew by 30% and nothing was removed.** `assets/tools/_index.json` went from **50 to 65
entries**, with **zero deletions**. Thirteen distinct new tool names are real and all thirteen are
220>0 / 193=0. Two further entries are `<unknown>` — extractor artefacts over two *real* tools built by a
name-templating factory at `:408721` / `:408786`. The most striking fact about the growth is how
*undramatic* it was structurally: `searchHint` went 54 → 69, i.e. **+15, exactly matching the +15
entries**, and the deferred-tool framework that makes a 65-tool surface affordable is **byte-for-byte
carryover** from 2.1.193. Fifteen tools were poured into an unchanged mould.

**2. One genuinely new capability: `EndConversation`.** It is the only new tool in the window with a
policy story, and it is guarded far more heavily than the bullet suggests — a hardcoded **model version
floor** (`opus ≥ 4.8`, `sonnet/fable/mythos ≥ 5`), a remote flag (`tengu_umber_kestrel`) whose payload
carries an **entrypoint regex** defaulting to `/^cli$/i`, a build-variant stub, a **two-call reflection
handshake** that re-shows the tool's own guidance as the first call's result, a durable
`ended-by-model` transcript marker, and a **session-wide lockout** that disables the query loop,
auto-compaction and subagent forks while leaving exactly five slash commands alive
(`clear|resume|help|exit|feedback`).

**3. Everything else was a bug fix, and the fixes are one line each.** This is the defining
characteristic of the window for `04_tools/`: the mechanisms are mature, so the deltas are single
conditionals, single new fields, or — twice — a **deleted feature gate**. Three patterns recur:

- **A literal count of 3/3 or 5/5 does not mean carryover.** `.208`'s "Edit failing on files modified
  after reading when the text still matches uniquely" has every error string unchanged; it was fixed by
  *removing* `tengu_cedar_sundial` (220=**0** / 193=1) and replacing the gate with a permission-derived
  predicate. Checking the **GONE-gate list** against a "carryover" verdict is the technique that finds
  this class of change.
- **The productive sites are few and dense.** The PowerShell shell descriptor (`:169515-169559`) absorbed
  **five** independent fixes; the Bash result mapper (`:438042-438095`) gained a three-way branch and two
  hint fields; the Grep/Glob result mapper (`:312191-312240`) gained three pagination-aware branches.
- **Several bullets are not client-side at all**, and two scoping-file anchors are false positives (see
  the ledger's `.212` #35 row).

**Counts for the window.** The ledger below has **50 rows**: **47 changelog bullets** whose primary or
secondary theme is `tools`, plus **3 undocumented additions** with no bullet at all. Verdict tally:

| Verdict | Rows | of which owned by another module |
|---|---|---|
| NET_NEW | 33 | 10 |
| DELTA / partial | 4 | 2 |
| UNANCHORED | 6 | 2 |
| CARRYOVER | 2 | 1 |
| CARRYOVER-trap | 3 | 0 |
| corrected anchor (scoping-file false positive) | 1 | — |
| undocumented addition | 3 | — |

Of the 33 NET_NEW rows, **23 are analysed in depth here**; the other 10 are anchored and handed to the
directory that owns the mechanism (see "Not covered"). The three undocumented additions are
`ReportFindings`, `DeferredToolPlaceholder`, and the 15 new tool-index entries as a group.

---

## Documents

| File | What it covers |
|---|---|
| [`tool_surface_delta_220.md`](tool_surface_delta_220.md) | The 50→65 count, per-name 193=0 verification, registry guards, the two `<unknown>` factory tools, and the deferred-tool / ToolSearch plumbing (carryover framework + the net-new `DeferredToolPlaceholder` cache shim + the Foundry capability strip) |
| [`end_conversation_tool.md`](end_conversation_tool.md) | The `EndConversation` tool end to end: four-layer gate, the dotted-version model floor algorithm, flag-payload parsing and entrypoint regex, deferred hint, two-call reflection handshake, fork dead end, transcript marker, session lockout, telemetry, and the description prompt's structure |
| [`shell_tools_deltas.md`](shell_tools_deltas.md) | Bash + PowerShell: the 30 s tool heartbeat and its four suppression sites, timeout auto-background messaging, `backgroundCwdHint`, the injected `pkill` shell shim, the five-delta PowerShell descriptor, the new print/SDK SIGTERM handler, Windows cwd recovery, `CLAUDE_CODE_GIT_BASH_PATH` |
| [`file_and_search_tools_deltas.md`](file_and_search_tools_deltas.md) | Read/Edit/Write/Grep/Glob/NotebookEdit: three-mode pagination fix, ripgrep null-byte blame, the `maxSelectedBytes` byte budget for long-line reads, the edit read cache's 1,000-entry-FIFO → 16 MiB-LRU rewrite, the `tengu_cedar_sundial` gate deletion, the Windows `\u` path bail-out |
| [`web_and_misc_tools_deltas.md`](web_and_misc_tools_deltas.md) | WebSearch/WebFetch "API Error"-as-content fixes and the session cap, `ReportFindings` (undocumented), the `SendMessage` name-pin guard, the four-stage `TaskStop`/`TaskOutput` cross-namespace resolver, the unanchored renderer-crash bullet, and the `.212` #35 anchor correction |

Symbol tables for merging: [`../00_overview/symbol_additions_v2_1_220_tools.md`](../00_overview/symbol_additions_v2_1_220_tools.md).

Nothing was merged away; all five planned documents had enough source substance to stand alone.

---

## Per-bullet ledger

All 47 bullets whose primary or secondary theme is `tools` in
[`../00_overview/_scope_v195_199.md`](../00_overview/_scope_v195_199.md) …
[`_scope_v215_220.md`](../00_overview/_scope_v215_220.md). Bullet text is abridged from
`claude_code_v_2.1.220/CHANGELOG.md`.

### Verdict legend

`NET_NEW` = anchored, 220>0 / 193=0 · `DELTA` = real change over pre-existing literals ·
`CARRYOVER` = the mechanism/literal is unchanged from 193 · `CARRYOVER-trap` = the bullet reads as new
but the code is unchanged · `UNANCHORED` = no anchor found in 2.1.220 · `→ other module` = anchored but
owned by a different directory.

| # | Bullet (abridged) | Ver | Verdict | Anchor (2.1.220) | Doc section |
|---|---|---|---|---|---|
| 1 | PowerShell `git diff`/`git grep`, `egrep`/`fgrep`, quoted `\|` reported as failures on exit 1 | .196 | **UNANCHORED** | `LASTEXITCODE` 1/1; `$_ec` epilogue byte-identical to 193 | shell §5.4 |
| 2 | `SendMessage` silently misrouting when a re-spawned agent reuses a name | .199 | **NET_NEW** | `send_message_pin_guard` 220=2/193=0, `:418478` | web §2 |
| 3 | `AskUserQuestion` no longer auto-continues; opt into idle timeout via `/config` | .200 | **NET_NEW → 48_accessibility_ui / 43_slash_commands** | `askUserQuestionTimeout` 220=9/193=0, `:61218`, row id `:451891` | web §6 |
| 4 | Bash "argument list too long" in repos with many git worktrees | .203 | **DELTA → 49_sandbox** | `E2BIG` 220=3/193=1, `:313228` | shell §9 |
| 5 | `TaskStop`/`TaskOutput` failing to find bg agents spawned by another agent | .203 | **NET_NEW** | `matches both teammate` 220=1/193=0, `:399752`; resolver `:399713` | web §4 |
| 6 | Windows worktree removal deleting files outside it via NTFS junction/symlink | .205 | **NET_NEW → 36_background_agents** | `unlinked reparse point before removal` 220=1/193=0, `:224251` | not covered here |
| 7 | Session-to-PR linking missing a PR created in a Bash call over the 30 K limit | .205 | **UNANCHORED** | `30K` 0/0, `inline limit` 0/0, `pr_link` 1/1 | not covered |
| 8 | Windows crash when the launch directory is deleted/locked/unmounted mid-command | .205 | **CARRYOVER + new adjacent refusal** | messages `:314185`, `:314199` both 220=1/193=1; new `tengu_agent_worktree_cwd_escape_blocked` `:314192` | shell §7 |
| 9 | Crash when a file watcher was closed while a directory scan was in flight | .205 | **UNANCHORED** | `FSWatcher` 2/2, `watcher closed` 0/0 | not covered |
| 10 | `EnterWorktree` confirms before entering a worktree outside `.claude/worktrees/` | .206 | **NET_NEW → 38_permissions** | `a model-supplied worktree outside` 220=1/193=0, `:406441` | not covered here |
| 11 | `extensions.worktreeConfig` left in `.git/config` after last worktree removed | .207 | **NET_NEW → 36_background_agents** | `worktreeConfig` 220=4/193=0, `:225915` | not covered |
| 12 | Edit failing on files modified after reading when the text still matches uniquely | .208 | **NET_NEW via DELETED GATE** | `tengu_cedar_sundial` 220=**0**/193=1; new predicate `Jws` `:310878` | file §5 |
| 13 | Read/Grep/Glob error fixes (offset, invalid regex, count pagination, null byte) | .208 | **NET_NEW** | `No entries at this offset` 220=3/193=0 `:312208`; `ripgrep spawn blocked: null byte` 220=3/193=0 `:204180`; `must be a whole number of 0 or more` 220=1/193=0 `:312158` | file §1, §2 |
| 14 | Memory blowup reading files with extremely long single lines via offset/limit | .208 | **NET_NEW** | `maxSelectedBytes` 220=11/193=0, `:235122`, `:439497`; `SelectedRangeTooLargeError` `:235367` | file §3 |
| 15 | Bounded the file edit read cache to 16 MB instead of pinning up to 1,000 full files | .208 | **NET_NEW** | `tky = 16777216` `:310490`; 193 was `maxCacheSize = 1000` on a plain `Map` `:375740 (193)` | file §4 |
| 16 | Session crash when a tool result renderer returned a bigint or plain text | .210 | **UNANCHORED** | `typeof e === "bigint"` 9/9; `isValidElement` 14/14; `renderToolResultMessage?.(` 220=**0**/193=2 | web §5 |
| 17 | Claude assuming a `cd` took effect after the command was backgrounded | .210 | **NET_NEW message / CARRYOVER detector** | `Session cwd remains` 220=1/193=0, `:438257`; `nmr` identical to 193 `:460972 (193)` | shell §3 |
| 18 | Grep content mode claiming "No matches found" when paginating past the end | .210 | **NET_NEW** | `No entries at this offset` `:312208` | file §1 |
| 19 | Bash/PowerShell message distinguishes a timeout auto-background from explicit | .210 | **NET_NEW** | `and was moved to the background (ID:` 220=2/193=0, `:438081`, `:431180`; `timedOutAfterMs` 220=9/193=0 | shell §2 |
| 20 | File-upload validation: `.prn`/trailing dot accepted, multiple hard links refused | .211 | **NET_NEW → 56_chrome_ide** | `multiple hard links` 220=2/193=0, `:514282` | not covered |
| 21 | Session-wide WebSearch cap (200, `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) | .212 | **NET_NEW** | `used its web search budget` 220=1/193=0, `:403669`; cap read `:231406`, const `_ty = 200` `:231413` | web §1.4 |
| 22 | SIGTERM during Bash orphaned the process tree in print/SDK mode; now exits 143 | .212 | **DELTA — one new handler** | new `process.on("SIGTERM")` at `:845671`; `killProcessTree` 1/1, `process.kill(-` 10/10 carryover | shell §6 |
| 23 | Spurious "File has not been read yet" after a read with offset/limit, then resume | .212 | **DELTA (probable), partially anchored** | literal 5/5; `Aze` `:309718` is the extracted+extended full-read test | file §5.1 |
| 24 | @-mentions after partial read; plugin uninstall wrong marketplace; false "Command timed out" on 143 | .212 | **CARRYOVER-trap (3-in-1)** | `Command timed out` 1/1; `uninstall` 74/69 | shell §6 (last para) |
| 25 | Web search/fetch returning "API Error" text as results or page content | .212 | **NET_NEW ×2** | `web-fetch-apply-api-error` `:362426`, `web-search-side-query-api-error` `:403788`, both 220=1/193=0 | web §1.1, §1.2 |
| 26 | Web search/fetch retry 529 and rate-limited requests with bounded backoff | .212 | **NOT ANCHORED here — scoping anchor is a FALSE POSITIVE** | `tengu_convolute_arcades_retry` `:338267` is the *refusal-fallback* silent retry, not web; `529` 92/76, `Overloaded` 2/2 → belongs to `57_api_reliability` | web §1.3 |
| 27 | EndConversation tool added | .214 | **NET_NEW** | `:231369`, export table `:412951-412962`, tool `:413093`, registry `:425147` | end_conversation (whole doc) |
| 28 | Periodic progress heartbeat for long-running tool calls | .214 | **NET_NEW** | `tool_heartbeat` 220=7/193=0, `:340758`, `:340773`; caller `:426176` | shell §1 |
| 29 | Bash tool killing the session when `pkill -f` matched the CLI's own process (Linux) | .214 | **NET_NEW** | `pkill: refusing to run` 220=1/193=0, `:313526`; `CLAUDE_PID` 220=5/193=0 | shell §4 |
| 30 | PowerShell commands hanging until timeout on a child waiting on stdin (Windows) | .214 | **NET_NEW** | `stdin: "ignore"` `:169521`; 193's descriptor has no `stdin` key (`:301555-301557 (193)`) | shell §5 |
| 31 | Python under PowerShell crashing with UnicodeDecodeError reading non-UTF-8 stdin | .214 | **NET_NEW** | `utf-8:surrogateescape` 220=1/193=0, `:169575` | shell §5.3 |
| 32 | Python UnicodeEncodeError on non-ASCII output; PS7 errors with raw ANSI escapes | .214 | **NET_NEW** | `PYTHONIOENCODING` 220=1/193=0 `:169575`; `OutputRendering` 220=1/193=0 `:169564` | shell §5.2, §5.3 |
| 33 | PowerShell reporting `where.exe`/`fc.exe`/`diff.exe` as errors on valid negatives | .214 | **CARRYOVER-trap / unresolved** | `where.exe` 4/4; `VZy` set `:430984` byte-identical to 193 `Vnf`; `fc.exe`/`diff.exe` 0 in both | shell §5.4 |
| 34 | `>`/`>>` under PowerShell 5.1 writing UTF-16LE files | .214 | **NET_NEW** | `Out-File:Encoding` 220=1/193=0, `:169564` | shell §5.2 |
| 35 | AskUserQuestion told Claude to continue even when the answer asked it to wait | .216 | **NET_NEW → 40_system_prompt** | `The user answered` 220=1/193=0, `:323485` | web §6 |
| 36 | Claude Code on the web re-asking the same question after idle | .216 | **NET_NEW → 54_remote_control** | `tengu_ask_user_question_afk_auto_advance`, `tengu_ask_user_question_skipped`, both 220=1/193=0 | web §6 |
| 37 | Bash command parsing of non-ASCII characters to match real shell word boundaries | .216 | **NET_NEW → 38_permissions** | `zero-width token` 220=1/193=0, `:210396` | not covered here |
| 38 | PowerShell tool permission validation of commands with invisible Unicode | .216 | **NET_NEW → 38_permissions** | `U+200B` 220=28/193=11 for `invisible`; `U+200B` 220=1/193=0 | not covered here |
| 39 | Improved validation of `git` and `gh` arguments in the PowerShell tool | .216 | **UNANCHORED** | `gh command` 3/2, `pwshReadOnly` 0/0, `Get-ChildItem` 12/12 | not covered |
| 40 | Read-only commands on Windows accessing network paths without a permission prompt | .216 | **CARRYOVER → 38_permissions** | `UNC network paths require manual approval` 220=1/**193=1** | file §1.1 (note) |
| 41 | `/rewind` no longer restores/deletes through symlinks or hard links | .216 | **NET_NEW → 49_sandbox** | `symlink, hard link, or other non-regular file` 220=1/193=0, `:835183` | not covered |
| 42 | Memory leak: truncated MCP tool outputs kept the full result in memory | .217 | **UNANCHORED → 39_mcp / 50_performance** | `untruncated` 0/0, `truncated MCP` 0/0 | not covered |
| 43 | Background shells impossible to stop after `/background` or `←`, or on session exit | .217 | **UNANCHORED → 36_background_agents** | `tengu_bg_stdin_unreadable`, `tengu_bg_handoff_settle` both 220=1/193=0 (adjacent, not proof) | not covered |
| 44 | Windows paths with `\u`-prefixed segments corrupted into CJK in tool inputs | .218 | **NET_NEW guard / CARRYOVER repair** | `windowsPathSkips` 220=4/193=0, `:508486`; repair regex 1/1 (193 `hor` `:593474 (193)`) | file §6 |
| 45 | Mojibake when a long IDE selection was truncated mid-emoji; dropped tool executor error | .218 | **DELTA → 56_chrome_ide** | surrogate-safe truncation at `:424599` | not covered |
| 46 | Spurious "[Request interrupted by user]" and an unpaired `tool_use` left in transcript | .218 | **CARRYOVER-trap on the literal** | `[Request interrupted by user]` 220=**3** / 193=**4** — the count *fell* because 193 duplicated the literals inline (`:441387-441391 (193)`) where 220 builds `Bou = [SV, jI, MY]` from constants (`:162840-162859`). Not a behaviour change. The real fix (unpaired `tool_use`) is unanchored. | web §5 (method note) |
| 47 | `CLAUDE_CODE_GIT_BASH_PATH` on Windows exiting / used as bash when not a bash binary | .219 | **NET_NEW (2 parts)** | `is not a bash/sh binary` 220=1/193=0, `:51206`; 193 called `process.exit(1)` at `:47863 (193)` | shell §8 |
| — | `ReportFindings` tool | (none) | **NET_NEW, UNDOCUMENTED** | `:403821`, `:403877`, description `:403823`, gate `tengu_report_findings_tool` `:774326`, env `CLAUDE_CODE_REPORT_FINDINGS` 220=2/193=0 | web §3 |
| — | 15 new `assets/tools/_index.json` entries | (none) | **NET_NEW ×13 + 2 factory artefacts** | see the table in surface §1 | surface §1, §2 |
| — | `DeferredToolPlaceholder` | (none) | **NET_NEW, UNDOCUMENTED** | 220=1/193=0, `:508602`; gate `tengu_deferred_stub_tool` `:508600` | surface §3.2 |

Rows 3, 4, 6, 7, 9, 10, 11, 20, 37–43, 45 are counted in the ledger because `tools` is a listed theme for
them, but their mechanism is owned by another directory; the anchor is recorded so the other agent's work
can be cross-checked, and no analysis is duplicated.

---

## False deltas caught in this theme

The five that would most easily have been written up as introductions:

| Would-be claim | Reality | Proof |
|---|---|---|
| "The deferred-tool / ToolSearch system was added in this window" | **Carryover.** `isDeferredTool` (`r7`, `:231912`) has the same ten branches in the same order as 193's `Tj` (`:230406 (193)`); the scorer (`coarseParts` 6/6), the ToolSearch prompt (`select:<tool_name>` 1/1) and `tool_search_server` (3/3) are all unchanged | surface §3.1 |
| "`.218` fixed spurious `[Request interrupted by user]`" (literal-based) | The literal count **fell** 4 → 3 because 193 inlined the three interrupt strings in an array (`:441387-441391 (193)`) and 220 builds `Bou = [SV, jI, MY]` (`:162859`). A de-duplication refactor, not a behaviour change | ledger row 46 |
| "`.212` #35 web retry = `tengu_convolute_arcades_retry`" | That gate is the **silent refusal-fallback retry** in the main query loop (`:338266-338292`), with siblings `tengu_convolute_arcades_tools` (`:331736`) and `…_retry_outcome` (`:338460`, `:338518`). Nothing to do with the web tools | web §1.3 |
| "`.214` `where.exe`/`fc.exe`/`diff.exe` negatives were fixed" | `where.exe` 4/4 and the negative-answer set `VZy` (`:430984`) is byte-identical to 193's `Vnf`; `fc.exe` and `diff.exe` appear **0 times in either bundle** | shell §5.4 |
| "`.208`'s edit-read-cache bound is on `readFileState`" | `readFileState`'s cache (`SZu`, `:309753`) is unchanged — 25 MiB / 5000 entries / 4096-byte inline threshold, identical to 193 `:233723-233725 (193)`. The 16 MiB bound is on a **different** cache, `OZu` (`:310451`) | file §4.1 |
| "`tengu_defer_cap_*` is deferred-tool machinery" | It is the agents-view **fork deferral** cap (`:823518-823556`), 10 s default, unrelated to tools | surface §3.5 |

And the inverse — a bullet whose literals are all carryover but which is nonetheless a **real fix**:

| Would-be "carryover" | Reality |
|---|---|
| `.208` "Edit failing on files modified after reading when the text still matches uniquely" (`has been modified since` 3/3) | Fixed by **deleting** `tengu_cedar_sundial` (220=0 / 193=1) — 193 gated the unique-match recovery behind a default-off flag — and replacing it with `readWouldBeAutoAllowed` (`:310878`), which asks whether a `Read` on the path would have been silently permitted. `tengu_velvet_hammer` (220=0 / 193=2) went the same way. Both are in the raw diff's GONE-gate list. |

---

## Not covered

Honest list of what this directory does **not** analyse, and why:

1. **Bullets owned by other modules** (ledger rows 3, 4, 6, 7, 9, 10, 11, 20, 37, 38, 39, 41, 42, 43, 45).
   Anchors are recorded in the ledger; the mechanisms are `38_permissions`, `49_sandbox`,
   `36_background_agents`, `56_chrome_ide`, `54_remote_control`, `40_system_prompt`, `39_mcp` and
   `50_performance` work. Duplicating them here would risk two divergent write-ups of one change.
2. **`.210` #8 (tool-result renderer bigint/plain-text crash)** — searched and **not found**. All the
   obvious literals are carryover; the only signal is that `renderToolResultMessage?.(` went 2 → 0, i.e.
   the dispatch was restructured. A future pass should diff the renderer dispatch function body rather
   than hunt literals. Documented as UNANCHORED in web §5.
3. **`.196` #8 and `.214` #24 (PowerShell exit-code semantics)** — the `$_ec` epilogue and the
   negative-answer command set are byte-identical to 193. Either the fixes are in the exit-code
   *interpreter* table (`returnCodeInterpretation`, which was not diffed site-by-site) or they did not
   land client-side. Left as unresolved rather than guessed.
4. **The `<unknown>` factory tools' real names.** The names are template expressions (`:408721`,
   `:408786`); the bundle does not contain them as literals, so they are not named here.
5. **`zoo()` / `YQi()` (`:162794`, `:162797`)** — build-variant stubs returning `!1` and `""`. What a
   non-CLI surface substitutes cannot be determined from this bundle.
6. **The full `EnterWorktree` / `ExitWorktree` surface.** New in the tool index's neighbourhood and
   partly a `tools` bullet (`.206` #5), but `checkPermissions` with `classifierApprovable: !1` is a
   permissions story; only the anchor is recorded.
7. **The `.212` #35 web retry itself.** Established here to be *not* a web-tool-local change; the shared
   HTTP retry layer is `57_api_reliability`'s to prove.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows discovered in this pass are staged, ready to merge, in
> [symbol_additions_v2_1_220_tools.md](../00_overview/symbol_additions_v2_1_220_tools.md).

Headline symbols introduced or re-derived in this directory:
- `isEndConversationToolEnabled` (`cIo`) - the four-layer availability gate for `EndConversation`
- `modelIdMeetsFamilyFloor` (`Oxd`) + `END_CONVERSATION_MODEL_FLOORS` (`WYy`) - the dotted-version model floor
- `lastAssistantTurnCalledEndConversation` (`Uxd`) - the two-call reflection handshake
- `POST_END_ALLOWED_COMMANDS` (`sNy`) - `clear|resume|help|exit|feedback`
- `isDeferredTool` (`r7`) - carryover deferral predicate
- `buildDeferredToolPlaceholder` (`ptp`) - net-new prompt-cache shim
- `stripFoundryUnsupportedToolFields` (`D2c`) - drops `defer_loading`, deletes the placeholder
- `startToolHeartbeat` (`rdd`) + `TOOL_HEARTBEAT_INTERVAL_MS` (`fIs`) - the 30 s liveness timer
- `resolveEffectiveBashTimeout` (`cHo`) - `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS`
- `buildPkillShimSnippet` (`AHy`) - the injected `pkill` guard
- `buildPowerShellShellDescriptor` (`tcu`) + `POWERSHELL_ENCODING_PROLOGUE` (`P$g`) + `POWERSHELL_ENV_DEFAULTS` (`O$g`)
- `SelectedRangeTooLargeError` (`Rir`) + `MAX_BYTES_PER_TOKEN` (`TSs`) - the long-line byte budget
- `FileContentCache` (`OZu`) + `FILE_CACHE_MAX_BYTES` (`tky`) - the 16 MiB edit read cache
- `readWouldBeAutoAllowed` (`Jws`) - the replacement for the deleted `tengu_cedar_sundial`
- `repairDoubleEscapedUnicode` (`ctp`) + `WINDOWS_PATH_RE` (`UO_`) - the `\u` path bail-out
- `applyPromptToFetchedPage` (`Iin`) - WebFetch's nested call, now throwing on API errors
- `ReportFindingsTool` (`Lwd`) - the undocumented structured code-review sink
- `resolveTaskIdAcrossNamespaces` (`Qko`) - four-stage `TaskStop`/`TaskOutput` resolution
- `resolveWithPinGuard` (`ekd`) - `SendMessage` name→id pin
