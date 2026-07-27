# 48 — Accessibility and terminal UX (2.1.193 → 2.1.220)

**Theme slug:** `accessibility_ui` · **Bundles:** `T = 2.1.220` (872,596 lines) /
`B = 2.1.193` (718,679 lines), see [`_CONVENTIONS.md`](../_CONVENTIONS.md) §1.

This is the second-densest theme in the window. The five scoping files tag **85 changelog rows**
with `accessibility_ui` — **64 as the primary theme** and 21 as a secondary theme shared with
`background_agents`, `permissions`, `performance`, `models`, `mcp`, `workflow`, `auth_providers`,
`plan_mode` or `slash_cli`. (The orchestrator's brief quotes 63; the per-file summary rows sum to 64.
I ledger all 85 below so nothing is silently dropped.)

## How this module was built

The brief's instruction was decisive and correct: **do not drive this module from the bullet list.**
The scoping pass rated 25 rows UNANCHORED and gave the `.211`–`.214` slice zero rich-depth rows,
because terminal and layout fixes rarely leave a greppable string. So the work went the other way
round — locate the five mechanisms, read their bodies in *both* builds, and then map whichever
bullets those bodies explain:

| Mechanism | Where | Bullets it turned out to explain |
|---|---|---|
| the screen-reader render path + announcement queue | `:156198-156275`, `:257355-258500`, `:559690` | `.200` ×2, `.208`, `.210`, `.211`, `.217`, `.218` ×3, `.219` |
| the vim layer over the shared input hook | `:656551-657420` | `.208`, `.211`, `.216`, `.219` |
| the key/paste tokenizer and the two composers | `:242790-243012`, `:743411`, `:754020-754131`, `:807020` | `.202`, `.207`, `.211`, `.212`, `.218` |
| the emoji completion engine | `:744484-747125` | `.217` |
| terminal mode ownership (mouse, sync, handoff, hyperlinks, OSC-52) | `:216139`, `:253377-253490`, `:258035-258080`, `:259584`, `:636292` | `.195`, `.198`, `.200`, `.203` ×2, `.206`, `.207`, `.208` ×2, `.210` ×2, `.216`, `.217`, `.219` |

Reading the mechanisms rather than the bullets recovered **eight bullets the scoping pass had filed
UNANCHORED or CARRYOVER**: `.202`#3 (Ctrl+R crash), `.207`#17 (paste re-expansion),
`.210`#6 (paste markers / È É), `.210`#30 (permission-mode announcements),
`.211`#11 (`?` swallowed), `.211`#33 (vim `s`/`S`), `.212`#48 (the tmux correction — it *is* backed
by code), `.216`#16 (GUI-editor mouse/focus garbage).

## Documents

| File | Covers |
|---|---|
| [screen_reader_mode.md](screen_reader_mode.md) | `.208`'s "addition" of a feature already shipped in 2.1.193; the activation-source tuple; `CLAUDE_AX_STARTUP_QUIET_MS`; the announcement queue; `preserveRanges`; the incremental grapheme echo and its 3-state anchor machine; deletion announcements with the mask guard; permission-mode announcements; `Header: value.` tables; the audible bell; TUI auto-off |
| [vim_and_input.md](vim_and_input.md) | `vimInsertModeRemaps`; `s`/`S` in NORMAL mode and the table refactor; dot-repeat of `c`-operators; `←` on an empty prompt from NORMAL; the six-outcome `←` gesture guard; Ctrl+J in the dispatch input and inside a paste; the `?` edge case; the Ctrl+R history-search crash; `[Pasted text #N]` re-expansion |
| [emoji_completion.md](emoji_completion.md) | the 1,567-entry shortcode table, `emojiCompletionEnabled`, the two trigger regexes, the value-diff guard that makes inline replacement safe, ranking, telemetry |
| [terminal_rendering.md](terminal_rendering.md) | **the Ink core did not change**; tmux synchronized output and the `.212` correction; the mouse tri-state; external-editor terminal handoff; the markdown-table rewrite; `assumeSupport` hyperlinks; OSC-52 chunking for GNU screen; the control-character sanitising family; the jump-to-bottom pill; fullscreen precedence |

Symbol tables: [`../00_overview/symbol_additions_v2_1_220_accessibility_ui.md`](../00_overview/symbol_additions_v2_1_220_accessibility_ui.md).

---

## The four headline findings

**1. `.208` did not add screen reader mode.** The flag, the env var, the setting, the remote gate,
the plain-text renderer and cursor parking all shipped in 2.1.193 with a **byte-identical settings
description string** (`:60195` vs `:55852 (193)`). `.208` promoted a dark-launched feature. The real
deltas are the activation-source tuple (`:156198-156220`), the startup quiet window, and — the
substantive one — an **announcement queue** (`:156250-156257`), the first time this client emits
speech that is not a re-render of the UI.

**2. The Ink renderer core is byte-equivalent between the builds.** Ten independent renderer-core
identifiers count identically (`scheduleRender` 9/9, `stylePool` 38/38, `writableLength` 6/6,
`useMemoCache` 6/6, …). The window's five "rendering performance" bullets are therefore **not** core
work. Where they are anchorable, they are component work — principally the markdown table renderer,
which in 193 rendered every cell 2–4 times with no row cap and in 220 has a per-invocation memo, a
200-row cap, three column-sizing strategies and a card fallback.

**3. `.212`'s tmux "release-note correction" is backed by real code and was mis-filed as a no-op.**
2.1.193 hard-denied synchronized output under tmux (`if (process.env.TMUX) return !1;`,
`:160038 (193)`) *before* consulting the DECRQM probe, whose result was computed and then thrown
away. 2.1.220 replaces that with `if (Z.TMUX) return tho === !0;` (`:253386`) — probe-gated — and
adds a tri-state wrapper (`:253380`) that reports `undefined` to the daemon while the probe is
pending. That is exactly what `.212`'s note says: "newer tmux with support is detected
automatically".

**4. Two editor-handoff bullets (`.210`, `.216`) are one asymmetry in mode ownership.** 193's
`enterAlternateScreen` disabled focus events but **not** bracketed paste, while
`exitAlternateScreen` re-enabled bracketed paste that had never been disabled
(`gIn = DECSET(2004)`, `:160008 (193)`, written at `:175141 (193)`). And 193's non-alt-screen editor
path did `pause() + suspendStdin()` only — stopping *reads* but leaving mouse tracking and focus
reporting *set*, so the terminal kept writing `ESC[<…M` and `ESC[I`/`ESC[O` into the child. 220 adds
`Usr` + `jsr` (DECRST 2004/2031) to `enterAlternateScreen` and two new methods,
`prepareTerminalForHandoff` / `restoreTerminalAfterHandoff` (**220=2 / 193=0** each).

---

## Verified net-new anchors (220 > 0, 193 = 0)

| Anchor | 220 | first line | Doc |
|---|---|---|---|
| `emojiCompletionEnabled` | 2 | `:61202` | emoji_completion §1 |
| `heart_eyes` / the 1,567-entry table | 2 | `:744484` | emoji_completion §2 |
| `input_emoji_completion` | 3 | `:746468` | emoji_completion §5 |
| `vimInsertModeRemaps` | 2 | `:61454` | vim_and_input §1 |
| `vim_insert_remap` | 3 | `:657113` | vim_and_input §1.3 |
| `"substitute"` (vim `s`) | 3 | `:655972` | vim_and_input §2 |
| `onToggleHelp` | 4 | `:656896` | vim_and_input §7 |
| `noteKeystrokeEmptied` | 2 | `:560041` | vim_and_input §5 |
| `tengu_left_arrow_editing_guard` | 1 | `:559928` | vim_and_input §5 |
| `history_search_scan` | 3 | `:743431` | vim_and_input §8 |
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | 3 | `:31082` | terminal_rendering §2 |
| `prepareTerminalForHandoff` | 2 | `:258066` | terminal_rendering §3 |
| `restoreTerminalAfterHandoff` | 2 | `:258071` | terminal_rendering §3 |
| `reassertTerminalModes` | 2 | `:258576` | terminal_rendering §3.3 |
| `… N more rows not shown` | 1 | `:636279` | terminal_rendering §4 |
| `truncatedCount` | 5 | `:636382` | terminal_rendering §4 |
| `kind: "vertical"` / `kind: "ansi"` | 1 / 2 | `:636379` / `:636317` | terminal_rendering §4 |
| `stripVTControlCharacters` | 5 | `:321147` | terminal_rendering §7 |
| `\p{Cc}\p{Cf}` regex family | 8 | `:217537` | terminal_rendering §7 |
| `new ${Et(n, "message")}` (pill) | 1 | `:690731` | terminal_rendering §8 |
| `dHe` Mac-over-SSH detection | 1 | `:261056` | terminal_rendering §8 |
| `CLAUDE_AX_STARTUP_QUIET_MS` | 2 | `:31123` | screen_reader_mode §2 |
| `Screen Reader Mode: on` | 1 | `:156227` | screen_reader_mode §1 |
| `srStartupQuietTimer` | 6 | `:258303` | screen_reader_mode §2 |
| `preserveRanges` | 10 | `:257375` | screen_reader_mode §3.1 |
| `aria-preserve-whitespace` | 4 | `:560696` | screen_reader_mode §3.1 |
| `prevScreenReaderAnchor` | 15 | `:258403` | screen_reader_mode §3.2 |
| `MAX_TREE_DEPTH` / `skipping deeper subtree` | 2 / 1 | `:254907` | screen_reader_mode §3.3 |
| `audible bell` / `Left the audible bell` | 5 / 1 | `:558490` | screen_reader_mode §8 |
| `indicator: "manual mode"` | 1 | `:58499` | screen_reader_mode §6 |

## Carryover traps caught (the changelog over-claims)

| Bullet | Literal | 220 / 193 | The narrower truth |
|---|---|---|---|
| `.208` "Added screen reader mode" | `axScreenReader` | 2 / **2** | flag, env, setting, gate, renderer and cursor parking all shipped in 193 with a byte-identical description string |
| `.200` tmux synchronized output | `DECRQM(2026)` | 1 / **1** | the probe is byte-identical; the *consumer* changed |
| `.212` Ctrl+J newline | `chat:newline` | 3 / **3** | the keybinding existed; the multiline handler and the `?` hint did not |
| `.207` `[Pasted text #N]` re-expansion | `[Pasted text #` | 3 / **3** | `gPo`/`Tji` is byte-identical; the delta is a **second call site** in the agent-view composer |
| `.211` `?` swallowed | `tengu_help_toggled` | 1 / **1** | same count, moved from the *submit* handler to a keystroke *input filter* |
| `.203` `^[[I`/`^[[O` on reattach | `?1004` | 2 / **2** | pure carryover literal; the related fix is §3's handoff pair |
| `.216` Esc-Esc rewind picker | `Esc Esc` | 2 / **2** | carryover |
| `.212` shell mode `!` with the path popup open | `autocomplete` | 28 / **28** | byte-identical; fix not isolable |
| `.212` denial notice truncated mid-emoji | `grapheme` / `truncateToWidth` | 32/32, 2/2 | byte-identical |
| `.203` live preview / scroll jumping | `livePreview` / `scrollback` | 5/5, 5/5 | byte-identical |
| `.207` transcript jumping after streaming | `jumpToBottom` / `autoScroll` | 4/4, 14/14 | byte-identical |
| `.211` layout & rendering performance | `writableLength` / `syncOutput` | 6/6, 3/3 | renderer core unchanged (see §0 of terminal_rendering) |
| `.217` FORCE_HYPERLINK | `FORCE_HYPERLINK` | 2 / **2** | the env var is carryover; the delta is `out()`/`mk()` splitting and `assumeSupport` 13 / **3** |
| `.198` Cmd+click / Warp | `Warp` | 20 / **19** | overwhelmingly pre-existing |
| `.210` ghost frames | `dropEnv` list | identical | no isolable delta |

---

## Per-bullet ledger

Verdicts: **ANCHORED** = mechanism read in both builds and documented here · **CARRYOVER** = literal
and/or body byte-identical, the bullet over-claims · **PARTIAL** = mechanism carryover, one new site
or branch identified · **UNANCHORED** = no isolable delta found · **OTHER THEME** = primary owner is
another module. `(sec)` marks a row where `accessibility_ui` is the secondary theme.

### 2.1.195

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 1 | `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` — disable click/drag/hover, keep wheel scroll | **ANCHORED** | `:164997` resolver, `:253482` `Xly` = DECSET 1000+1006 only | terminal_rendering §2 |
| 3 | Voice dictation on macOS capturing silence after device change | UNANCHORED | `startNativeRecording` 2/2 — lives in the native audio addon | — |
| 4 | Voice auto-submit for languages without spaces | UNANCHORED | `auto-submit` 1/0 but the site was not read | — |
| 10 | Voice mode on Linux: "no microphone" vs "SoX not installed" | OTHER THEME | `:496025-496027` (scoping-verified) | — |

### 2.1.196

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 3 | Clickable file attachments, Cmd/Ctrl-click reveals in Finder | UNANCHORED | `showItemInFolder`/`open -R` 0/0 | — |
| 14 | Esc Esc at idle prompt not opening the rewind menu | PARTIAL | `tengu_left_arrow_editing_guard` `:559928` is the new guard; the Esc-Esc path itself unchanged | vim_and_input §5 |
| 20 | Voice dictation swallowing spaces during fast typing | UNANCHORED | `silenceDetection` 4/4 | — |

### 2.1.198

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 13 | `/diff` panel not refreshing on branch switch | UNANCHORED | — | — |
| 14 | Markdown tables overflowing their right border in fullscreen | UNANCHORED | plausibly subsumed by the `EUp` rewrite, not provable | terminal_rendering §4, §10 |
| 23 | Cmd+click not opening URLs in fullscreen in Warp | UNANCHORED | `Warp` 20/19 | — |
| 24 | Double-click word selection includes the URL scheme | UNANCHORED | `double-click` 2/1, site not read | — |
| 27 | Focus mode: subagent activity summary, folded bg notifications | OTHER THEME | `tengu_loop_noop_fold` 1/0 | — |
| 28 | highlight.js 11 upgrade | OTHER (vendored dep) | `hljs` 60/5 | terminal_rendering §10 |
| 29 | opt/cmd instead of alt/super from a Mac over SSH | **ANCHORED** | `dHe` `:261056-261062`, `LC_TERMINAL === "iTerm2"` | terminal_rendering §8 |

### 2.1.199

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 12 | Idle subagents vanishing from the agent panel (sec) | OTHER THEME | `tengu_observer_subagent_fanout` 1/0 | — |
| 18 | Backgrounding dropped the session's `/color` from the agent row (sec) | OTHER THEME | `/color` 7/3 | — |

### 2.1.200

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 2 | "default" permission mode renamed "Manual" (sec) | **ANCHORED** | `indicator: "manual mode"` `:58499`; the `indicator` field is what makes a mode *speakable* | screen_reader_mode §6 |
| 10 | Control bytes from bg output reaching the terminal (sec) | **ANCHORED** | `stripVTControlCharacters` 5/**0**, `m_` `:217537`, `\p{Cc}\p{Cf}` 8/**0** | terminal_rendering §7 |
| 13 | `/mcp` server list not tracking focus for screen readers | UNANCHORED | `srLabel` 2/0 but both 220 sites are agent-view rows, not `/mcp` | screen_reader_mode §10 |
| 14 | Voice dictation "Voice connection failed" with no audio | OTHER THEME | `No audio detected from microphone` 1/1 | — |
| 15 | Rendering flicker under tmux 3.4+ | **ANCHORED** | `xee` `:253386` `if (Z.TMUX) return tho === !0` vs `:160038 (193)` `return !1` | terminal_rendering §1 |
| 16 | Screen reader: glyphs hidden, symbols as labels, nested tables as `Header: value.` | **ANCHORED** | `screenReader` prop `:635795`; `Laa` `:636191`; `"aria-hidden": !0` 93/**40** | screen_reader_mode §6, §7 |

### 2.1.202

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 3 | Crash in inline Ctrl+R history search when accepting/cancelling mid-scan | **ANCHORED** (was UNANCHORED) | `:743419-743432` capture-then-compare vs `:628069 (193)` `await I.current.next()` | vim_and_input §8 |
| 11 | Voice dictation retrying unbounded | OTHER THEME | `silentDropRetried` 1/1 | — |
| 16 | `/workflows` agent list layout (sec) | OTHER THEME | — | — |

### 2.1.203

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 2 | Grey ⏸ badge in the footer in manual permission mode (sec) | **ANCHORED** | `X4r = "⏸"` `:58419`, `aria-hidden` on the glyph at `:751172` | screen_reader_mode §6 |
| 21 | Attached bg sessions ignoring the mouse opt-outs | **ANCHORED** | 193's `Grt` `:156467 (193)` `if (SESSION_KIND === "bg") return !0` — deleted in `ybe` `:164997` | terminal_rendering §2.2 |
| 24 | `@` directory picker not showing worktrees (sec) | OTHER THEME | — | — |
| 26 | Content jumping when scrolling long transcript history | UNANCHORED | `scrollback` 5/5 | terminal_rendering §10 |
| 27 | Terminal flicker while typing in bash mode with a history suggestion | UNANCHORED | `shellHistory` 6/0 but no readable delta | — |
| 28 | Literal `^[[I` / `^[[O` when reattaching to a bg session | CARRYOVER (literal) | `?1004` 2/2; the related real change is the handoff pair | terminal_rendering §3 |
| 30 | Live-preview updates no longer re-render the whole screen (sec) | UNANCHORED | `livePreview` 5/5 | terminal_rendering §0 |
| 33 | Left arrow no longer closes bg tasks / diff / workflow views | **ANCHORED** | `Nyp` `:559650`, `tengu_left_arrow_editing_guard` `:559928` | vim_and_input §5 |

### 2.1.205

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 14 | Agent view rendering one line too high, clipping its header (sec) | UNANCHORED | — | — |

### 2.1.206

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 19 | Left arrow not stepping out of a phase/agent in workflow detail (sec) | PARTIAL | same `tengu_left_arrow_editing_guard` machine | vim_and_input §5 |
| 23 | Jump-to-bottom pill: Ctrl+End on macOS, rebinds, wrapping | **ANCHORED** | `rMa` `:690714-690790`; `_9b` `:690733`, `pc("scroll:bottom",…)` `:690726`, three-tier `find` `:690747` | terminal_rendering §8 |
| 26 | Agents view status column uses full terminal width (sec) | OTHER THEME | `MAX_STATUS_WIDTH` 0/0 | — |

### 2.1.207

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 2 | Terminal freeze / keystroke lag streaming long lists, tables, code | PARTIAL | the table half is `EUp`'s per-invocation memo `:636295`; the list/paragraph/code half is unanchored | terminal_rendering §4, §0 |
| 7 | Transcript jumping above the start of the answer | UNANCHORED | `jumpToBottom` 4/4, `autoScroll` 14/14 | terminal_rendering §10 |
| 17 | Agent view: re-pasting expands the collapsed `[Pasted text #N]` (sec) | **ANCHORED** (was CARRYOVER) | `gPo` is carryover; the **new call site** is `:807029`, absent from `:677731-677744 (193)` | vim_and_input §9 |

### 2.1.208

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 1 | "Added screen reader mode" (`--ax-screen-reader`, env, setting) | **CARRYOVER + narrower delta** | all three surfaces at `:55849 (193)`/`:137296-137299 (193)`/`:714398 (193)`; delta = source tuple `:156204-156208`, settings group `:60188-60197`, announcements | screen_reader_mode §0, §1 |
| 2 | `vimInsertModeRemaps` setting | **ANCHORED** | `:61454` zod, `Yxb` `:656551`, dispatch `:657186-657217` | vim_and_input §1 |
| 4 | Mouse-click support for multi-select menus and "Other" rows | **ANCHORED** | `mouseTracking: ybe()` reaching `:824353`, `:833275`, `:802418` (193 passed a boolean at 2 sites) | terminal_rendering §2.3 |
| 5 | Fable 5 consent prompt starts on decline (sec) | OTHER THEME | `declineFirst` 3/3 | — |
| 13 | Tables over 200 rows show the first 200 with a notice | **ANCHORED** | `_Up = 200` `:636511`, `bqo` `:636278`, cap applied at `:636293` | terminal_rendering §4 |
| 33 | Input responsiveness while agent task lists update | UNANCHORED | React Compiler 6/6 — carryover | terminal_rendering §0 |

### 2.1.210

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 1 | Live elapsed-time counter on the collapsed tool summary | UNANCHORED | `elapsed` 70/51, no isolable site | — |
| 6 | Paste markers leaking into external editors as stray È/É | **ANCHORED** (was UNANCHORED) | `enterAlternateScreen` `:258035-258047` now writes `Usr` (DECRST 2004) + `jsr`; 193 `:175117-175127 (193)` did not, yet `exitAlternateScreen` re-set 2004 (`gIn`, `:160008 (193)`) | terminal_rendering §3.2 |
| 23 | Overlapping ghost frames with `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` | UNANCHORED | `dropEnv` `:732247` identical to `:545902 (193)` | terminal_rendering §9 |
| 30 | Screen reader announces permission-mode changes on Shift+Tab | **ANCHORED** (was UNANCHORED) | `cVr(\`[${Yue(Wt)} on]\`)` `:754305`; `Yue` `:58478` reads the `indicator` field | screen_reader_mode §6 |

### 2.1.211

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 11 | Edits leaving the input as `?` silently swallowed | **ANCHORED** (was UNANCHORED) | moved from submit-time `:635139 (193)` to the input filter `b5` `:754123` and `f5e` `:754031`; `onToggleHelp` 4/**0** | vim_and_input §7 |
| 13 | 300 ms delay revealing async content | UNANCHORED | `delay: 300` 0/0 | vim_and_input §10 |
| 16 | Screen-reader users losing the audible bell after `/terminal-setup` | **ANCHORED** | `kV_` `:558487-558520`; `audible bell` 5/**0**; `(skipped in screen-reader mode)` `:498045` | screen_reader_mode §8 |
| 26 | "Improved terminal layout and rendering performance" | UNANCHORED (umbrella) | renderer core 10/10 identical counts | terminal_rendering §0 |
| 33 | Vim `s`/`S` in NORMAL mode | **ANCHORED** (was UNANCHORED) | `"substitute"` 3/**0**; `Xxb` table `:656801-656836` replaces the if-chain `:492554-492597 (193)` which had neither key | vim_and_input §2 |

### 2.1.212

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 12 | Shell mode `!` not executing commands with paths while the popup was open (sec) | CARRYOVER-trap | `autocomplete` 28/28 | vim_and_input §10 |
| 13 | Auto-mode denial notices breaking mid-emoji (sec) | CARRYOVER-trap / OTHER THEME | `grapheme` 32/32 | vim_and_input §10 |
| 14 | Ctrl+J newline in the agent-view dispatch input; `?` overlay hint | **ANCHORED** | `:657542` adds `(F.ctrl && … F.name === "j")` to `:493315 (193)`'s `enter`-only test; hint `:808095` | vim_and_input §6.1 |
| 27 | Plan-approval footer splitting "ctrl+g to edit in \<editor\>" (sec) | UNANCHORED | footer assembled from fragments | — |
| 28 | Welcome banner keeping old panel widths after a resize | UNANCHORED | no literal | terminal_rendering §10 |
| 29 | Diff previews losing line numbers in narrow layouts | UNANCHORED | no literal | terminal_rendering §10 |
| 41 | `←` footer hint pulses `N done` (sec) | OTHER THEME | `tengu_fleet_nudge_state` `:749960` | — |
| 47 | Auth panel title "Cloud authentication" → "Authentication" (sec) | OTHER THEME | `title: "Authentication"` `:576994` | — |
| 48 | Correction to the 2.1.200 tmux note | **ANCHORED** (was CARRYOVER) | the note describes `xee`'s probe gating exactly; see `.200`#15 | terminal_rendering §1 |

### 2.1.214

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 39 | Spurious "check your network" while the advisor was thinking (sec) | OTHER THEME | `tengu_advisor_tool_error` 1/0 | — |

### 2.1.216

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 6 | @-mentions after hooks; **vim dot-repeat of `c`-operators and paste**; statusline twice; resume-picker hangs | **ANCHORED** (dot-repeat part) | `H` `:656935-656966` provenance check `j === b.current` + `{...j, insertedText}`; `bba` `:656872`; 193 `:492841 (193)` overwrote with `{type:"insert"}` | vim_and_input §3 |
| 12 | Esc-Esc at idle prompt with background tasks | CARRYOVER | `Esc Esc` 2/2 | — |
| 16 | Mouse and focus garbage while a GUI editor is open | **ANCHORED** (was UNANCHORED) | `prepareTerminalForHandoff` `:258066` writes `Fpe + IPt`; 193 `:504931`/`:504957 (193)` did `pause()+suspendStdin()` only | terminal_rendering §3.1 |
| 23 | Dialogs in fullscreen stretching past the panel edge | UNANCHORED | no literal | terminal_rendering §10 |
| 24 | `/config` settings list clipping its keyboard-hint footer (sec) | UNANCHORED | no literal | terminal_rendering §10 |
| 25 | Transcript-mode (Ctrl+O) footer wrapping under 104 columns | UNANCHORED | `104 columns` 0/0 | terminal_rendering §10 |

### 2.1.217

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 1 | Emoji shortcode autocomplete, `emojiCompletionEnabled` | **ANCHORED** | `:61202`, `:744484-746052` (1,567 entries), `lLS` `:746059`, `hLS` `:746077` | emoji_completion (whole doc) |
| 8 | Screen-reader startup announcement cut off; thinking row re-rendering | **ANCHORED** (first half) | `CLAUDE_AX_STARTUP_QUIET_MS` 2/**0**, `Etu` `:156237`, quiet-window drop `:258302-258308`; the thinking-row half is UNANCHORED | screen_reader_mode §2 |
| 14 | Transcript preview flush against the input when attaching (sec) | UNANCHORED | no literal | — |
| 15 | Footer PR badge links clickable when support can't be detected; `FORCE_HYPERLINK=0` | **ANCHORED** | `out`/`mk` split `:259584`/`:259591`; `assumeSupport` 13/**3**; PR badge `:751684` | terminal_rendering §5 |

### 2.1.218

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 2 | Screen-reader announcements of deleted text | **ANCHORED** | `jXs` `:559690-559712` with the mask guard; call sites `:559805`/`:559809`/`:559821` | screen_reader_mode §5 |
| 4 | Left arrow discarding the conversation with no undo | **ANCHORED** | `Nyp` `:559650` six-outcome machine; `Fyp` `:559664` | vim_and_input §5 |
| 5 | Multi-line paste collapsing to `j` on terminals that encode newlines as Ctrl+J | **ANCHORED** (was UNANCHORED) | `Pay` `:242971-242993` ctrl+I/J/M switch vs `$xd` `:160746-160751 (193)` which dropped the modifier | vim_and_input §6.2 |
| 13 | VoiceOver reading "new line" instead of echoing the typed space | **ANCHORED** | `preserveRanges` 10/**0**, `aria-preserve-whitespace` 4/**0** at `:560696`/`:560717` | screen_reader_mode §3.1 |
| 14 | Plugin/settings panels not moving the cursor to the focused row (sec) | UNANCHORED | `declareCursor` 4/4 — primitive is carryover, the new consumer not isolable | screen_reader_mode §10 |
| 20 | Prompt history entries dropped or duplicated on racing writes (sec) | UNANCHORED | reader found (`yPo` `:454804`), writer delta not found | vim_and_input §10 |
| — | Crashes rendering deeply nested UI trees | **ANCHORED** | `MAX_TREE_DEPTH = 256` `:254907`, three adopters `:254915`/`:256826`/`:257376` | screen_reader_mode §3.3 |

### 2.1.219

| # | Bullet | Verdict | Anchor | Section |
|---|---|---|---|---|
| 11 | Copy-on-select inside GNU screen printing base64 | **ANCHORED** | `NT` `:216154-216159` chunks at `zCu = 76` into DCS segments; 193 `:156024 (193)` wrapped once | terminal_rendering §6 |
| 14 | Vim `←` on an empty prompt returns to the agent view from NORMAL | **ANCHORED** | `:657294-657300` adds `(F.name === "left" && z.text === "")` to `:493102 (193)`'s up/down-only delegation | vim_and_input §4 |
| 15 | Screen-reader mode rewriting the whole input line instead of echoing the character | **ANCHORED** | fast path `:258368-258398`, `prevScreenReaderAnchor` 15/**0**, `Ouy` `:257792` | screen_reader_mode §3.2 |
| 20 | `/model` picker highlights only the newest model's name (sec) | OTHER THEME | `:120261` | — |

### Ledger totals

| Verdict | Count |
|---|---|
| **ANCHORED** (mechanism read in both builds and documented here) | **28** |
| **PARTIAL** (mechanism carryover, one new site/branch found) | 4 |
| **CARRYOVER** (bullet over-claims; literal and/or body identical) | 5 |
| **UNANCHORED** (no isolable delta) | **26** |
| **OTHER THEME** (primary owner elsewhere) | 22 |
| Total rows tagged `accessibility_ui` across the five scoping files | **85** |

So: **32 of the 63 primary-theme bullets are anchored to code read in both builds** (28 fully, 4
partially), 26 could not be anchored, and 5 are carryover the changelog presents as new. The
UNANCHORED set is dominated by pure-layout fixes (`.212`#28/#29, `.216`#23/#24/#25) and by voice
dictation, which lives in a native addon outside this bundle. Given §0's finding that the renderer
core is unchanged, I am confident the remaining layout bullets are single-component edits with no
extractable literal, and I have not invented anchors for them.

---

## Confidence

**HIGH** for everything marked ANCHORED: every one of those rows was derived by reading the
function body in the 2.1.220 bundle *and* its counterpart in 2.1.193, not by counting a literal.
**HIGH** for the four headline findings. **MEDIUM** on one inference, flagged in place: the exact
byte path that renders the leaked bracketed-paste markers as the glyphs `È`/`É` is not derivable
from this bundle — the *leak* is proven, the *glyph* is the changelog's description of the symptom.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All new rows from this module are staged in
> [symbol_additions_v2_1_220_accessibility_ui.md](../00_overview/symbol_additions_v2_1_220_accessibility_ui.md),
> grouped for `symbol_index_infra_integration.md` (UI components) and
> `symbol_index_core_features.md` (CLI/settings surfaces).

Key entry points for this module:
- `isScreenReaderMode` (`kL`, `:156221`) - the predicate 15 UI sites branch on
- `pushAnnouncement` (`cVr`, `:156250`) - the announcement queue everything speaks through
- `useTextInput` (`yx`, `:657471`) - the shared prompt-input hook
- `useVimInput` (`Sba`, `:656887`) - the vim layer above it
- `decodeCsiUToPasteText` (`Pay`, `:242971`) - the paste-mode key decoder
- `getEmojiSuggestions` (`lLS`, `:746059`) - the emoji completion engine
- `isSynchronizedOutputSupported` (`xee`, `:253384`) - the tmux sync decision
- `getMouseTrackingMode` (`ybe`, `:164997`) - the mouse tri-state
- `prepareTerminalForHandoff` (`:258066`) - terminal mode ownership on editor handoff
- `layoutMarkdownTable` (`EUp`, `:636292`) - the table rewrite
