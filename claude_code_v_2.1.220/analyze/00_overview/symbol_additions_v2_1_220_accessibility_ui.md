# Symbol additions — v2.1.220 · theme `accessibility_ui`

Staged symbol tables from [`../48_accessibility_ui/`](../48_accessibility_ui/README.md).
Format per [`_CONVENTIONS.md`](../_CONVENTIONS.md) §6:
`| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated id inside each
module section. **Every line number below was read in
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.**
Rows tagged `(193)` in the notes are baseline references and are not merged.

Merge routing:

| Section | Merge into |
|---|---|
| Accessibility / Screen Reader | `symbol_index_infra_integration.md` (UI components) |
| Prompt Input and Vim Mode | `symbol_index_infra_integration.md` (UI components) |
| Emoji Completion | `symbol_index_infra_integration.md` (UI components) |
| Terminal Rendering and Mode Ownership | `symbol_index_infra_integration.md` (UI components) |
| Accessibility Settings and Environment | `symbol_index_core_features.md` (CLI / settings surfaces) |

---

## Module: Accessibility / Screen Reader

> Merge into `symbol_index_infra_integration.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AJr | buildAccessibilityProps | cli_inner_pretty.js:253924 | function |
| Ast | getScreenReaderEnvForChildren | cli_inner_pretty.js:156246 | function |
| Cno | screenReaderDetector | cli_inner_pretty.js:156271 | variable |
| Dho | sanitizeForScreenReader | cli_inner_pretty.js:257355 | function |
| Ea | useScreenReaderEnabled | cli_inner_pretty.js:260431 | function |
| Etu | getStartupQuietRemainingMs | cli_inner_pretty.js:156237 | function |
| Hno | endStartupQuietWindow | cli_inner_pretty.js:156234 | function |
| LJr | renderNodeToScreenReaderOutput | cli_inner_pretty.js:257375 | function |
| Laa | renderTableAsSentences | cli_inner_pretty.js:636191 | function |
| Lho | shiftPreserveRanges | cli_inner_pretty.js:257411 | function |
| Ouy | isGraphemeBoundary | cli_inner_pretty.js:257792 | function |
| Stu | beginStartupQuietWindow | cli_inner_pretty.js:156231 | function |
| Yue | getPermissionModeIndicator | cli_inner_pretty.js:58478 | function |
| Ysr | reportTreeDepthExceeded | cli_inner_pretty.js:254897 | function |
| _tu | getScreenReaderModeBanner | cli_inner_pretty.js:156224 | function |
| cVr | pushAnnouncement | cli_inner_pretty.js:156250 | function |
| d2 | renderMarkdownToken | cli_inner_pretty.js:635788 | function |
| eIg | AX_SCREEN_READER_GATE (`"tengu_ax_screen_reader"`) | cli_inner_pretty.js:156258 | constant |
| eut | MAX_TREE_DEPTH (256) | cli_inner_pretty.js:254907 | constant |
| h9e | EMPTY_PRESERVE_RANGES | cli_inner_pretty.js:257481 | constant |
| htu | MAX_ANNOUNCEMENTS (16) | cli_inner_pretty.js:156265 | constant |
| jXs | announceDeletedText | cli_inner_pretty.js:559690 | function |
| kL | isScreenReaderMode | cli_inner_pretty.js:156221 | function |
| kV_ | setupTerminalApp | cli_inner_pretty.js:558487 | function |
| nRt | announcementQueue | cli_inner_pretty.js:156266 | variable |
| rIg | MAX_QUIET_MS (600000) | cli_inner_pretty.js:156262 | constant |
| tIg | DEFAULT_QUIET_MS (3000) | cli_inner_pretty.js:156261 | constant |
| vtu | drainAnnouncements | cli_inner_pretty.js:156253 | function |
| wuy | flattenBoxChildren | cli_inner_pretty.js:257417 | function |
| ytu | ScreenReaderModeDetector | cli_inner_pretty.js:156198 | class |

Notes:
- `ytu.isEnabled()` (`:156201-156213`) is the flag → env → settings resolver whose `#t`
  activation-source field is the real `.208` delta; 193's `qhi` (`:137291-137307 (193)`) has no
  equivalent.
- `jXs`'s three call sites are `:559805` (`Ctrl+K`), `:559809` (`Ctrl+U` / `Cmd+Backspace`) and
  `:559821` (`Ctrl+W` / `Option+Delete`).
- `cVr`'s non-screen-reader producer is the Shift+Tab mode cycler at `:754305`.
- `Yue` reads the `indicator` field of the permission-mode descriptor table; the paired glyph
  constant is `X4r = "⏸"` at `:58419` and the `aria-hidden` footer badge is `:751172`.

---

## Module: Prompt Input and Vim Mode

> Merge into `symbol_index_infra_integration.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C (inside Sba) | recordPendingRemapChar | cli_inner_pretty.js:656913 | function |
| D (inside KGf) | runHistorySearchScan | cli_inner_pretty.js:743417 | function |
| ERt | firstGrapheme | cli_inner_pretty.js:160210 | function |
| F7p | REMAP_TIMEOUT_MS (1000) | cli_inner_pretty.js:656564 | constant |
| Fyp | applyLeftArrowTransition | cli_inner_pretty.js:559664 | function |
| GV_ | MIN_CONFIRM_GAP_MS (150) | cli_inner_pretty.js:559686 | constant |
| H (inside Sba) | exitInsertMode | cli_inner_pretty.js:656935 | function |
| IUs | openHistoryStream | cli_inner_pretty.js:454804 | function |
| JLr | acceptSuggestionForPattern | cli_inner_pretty.js:746119 | function |
| M (inside KGf) | cancelHistorySearchScan | cli_inner_pretty.js:743411 | function |
| Nyp | classifyLeftArrowPress | cli_inner_pretty.js:559650 | function |
| Oyp | REPEAT_WINDOW_MS (1000) | cli_inner_pretty.js:559685 | constant |
| Pay | decodeCsiUToPasteText | cli_inner_pretty.js:242971 | function |
| SFu | csiUSequenceToByte | cli_inner_pretty.js:242961 | function |
| Sba | useVimInput | cli_inner_pretty.js:656887 | function |
| UXs | ARM_TTL_MS (3000) | cli_inner_pretty.js:559684 | constant |
| Vde | countGraphemes | cli_inner_pretty.js:160220 | function |
| W7p | resolveNormalModeKey | cli_inner_pretty.js:656620 | function |
| Wzo | substituteChars (vim `s`) | cli_inner_pretty.js:655968 | function |
| Xxb | NORMAL_COMMANDS | cli_inner_pretty.js:656801 | object |
| Yxb | parseVimInsertModeRemaps | cli_inner_pretty.js:656551 | function |
| _ba | NON_TEXT_KEY_NAMES | cli_inner_pretty.js:657435 | constant |
| b5 (inside prompt) | helpShortcutInputFilter | cli_inner_pretty.js:754123 | function |
| bba | isChangeLikeRecord | cli_inner_pretty.js:656872 | function |
| dba | getVimInsertModeRemaps | cli_inner_pretty.js:656561 | function |
| f5e (inside prompt) | handleSingleCharKey | cli_inner_pretty.js:754023 | function |
| gPo | expandLatestPastePlaceholder | cli_inner_pretty.js:454789 | function |
| gba | dispatchVimNormalCommand | cli_inner_pretty.js:656594 | function |
| kDt | PASTE_COLLAPSE_THRESHOLD (800) | cli_inner_pretty.js:223060 | constant |
| lkb | VISUAL_COMMANDS | cli_inner_pretty.js:656838 | object |
| tjt | applyLinewiseOperator | cli_inner_pretty.js:655902 | function |
| ugr | PASTE_REEXPAND_MAX_BYTES (1e5) | cli_inner_pretty.js:455019 | constant |
| uve | expandAllPastePlaceholders | cli_inner_pretty.js:454778 | function |
| wfs | decodeModifierBitmask | cli_inner_pretty.js:242883 | function |
| xZ | lastGrapheme | cli_inner_pretty.js:160214 | function |
| yPo | historyEntryGenerator | cli_inner_pretty.js:454804 | function |
| yx | useTextInput | cli_inner_pretty.js:657471 | function |
| zN | findPastePlaceholders | cli_inner_pretty.js:454766 | function |

Notes:
- `yx` is 193's `dk` (`:493244 (193)`); the multiline Ctrl+J branch is `:657542`
  (193: `:493315 (193)`, `enter`-only).
- `Xxb` gained `s` (`:656808`) and `S` (`:656809`); 193's if-chain `ICl` (`:492554-492597 (193)`)
  had neither. `"substitute"` is 220=3 / 193=0.
- The vim `←`-on-empty delegation is `:657294-657300`; 193's is `:493102 (193)` (up/down only).
- `Nyp`'s six outcomes are consumed at `:559923-559957`; the gate literal
  `tengu_left_arrow_editing_guard` is at `:559928`.
- `gPo` is byte-identical to 193's `Tji` (`:186048 (193)`); the new call site is the agent-view
  composer `onPaste` at `:807029` (193's equivalent, `:677731-677744 (193)`, has no re-expansion).
- `IUs` and `yPo` are the same generator: `IUs` is the export alias used by the search hook.

---

## Module: Emoji Completion

> Merge into `symbol_index_infra_integration.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NRn | emojiModule | cli_inner_pretty.js:747125 | variable |
| Oli | EMOJI_BY_SHORTCODE (1,567 entries) | cli_inner_pretty.js:744484 | object |
| aLS | getEmoji | cli_inner_pretty.js:746056 | function |
| aQa | EMOJI_PREFIX_RE | cli_inner_pretty.js:747123 | constant |
| hLS | wasClosingColonJustTyped | cli_inner_pretty.js:746077 | function |
| iLS | MAX_EMOJI_SUGGESTIONS (20) | cli_inner_pretty.js:746071 | constant |
| lLS | getEmojiSuggestions | cli_inner_pretty.js:746059 | function |
| mLS | EMOJI_INLINE_RE | cli_inner_pretty.js:747124 | constant |
| sLS | SHORTCODE_KEYS | cli_inner_pretty.js:746075 | variable |
| sQa | SLACK_CHANNEL_RE | cli_inner_pretty.js:747122 | constant |
| w5f | emojiExports | cli_inner_pretty.js:746054 | object |

Notes:
- Telemetry `input_emoji_completion` fires at `:746468` with `{inline: true}` and at `:746750` /
  `:746899` with `{inline: false}`. All three are 220-only.
- The enable read is `tg().emojiCompletionEnabled !== !1` at `:746222`; the zod field is
  `:61202-61207`.

---

## Module: Terminal Rendering and Mode Ownership

> Merge into `symbol_index_infra_integration.md`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AFe | mouseTrackingEnableSeq | cli_inner_pretty.js:253443 | function |
| EJr | FOCUS_EVENTS_ON (DECSET 1004) | cli_inner_pretty.js:253473 | constant |
| EUp | layoutMarkdownTable | cli_inner_pretty.js:636292 | function |
| Eqo | MarkdownTable (memoised component) | cli_inner_pretty.js:636525 | function |
| Fpe | MOUSE_OFF (DECRST 1006/1003/1002/1000) | cli_inner_pretty.js:253483 | constant |
| IB | wrapForMultiplexer | cli_inner_pretty.js:216085 | function |
| IPt | FOCUS_EVENTS_OFF (DECRST 1004) | cli_inner_pretty.js:253474 | constant |
| JCu | copyViaNativeTool | cli_inner_pretty.js:216162 | function |
| Lo | Link (carries `assumeSupport`) | cli_inner_pretty.js:259616 | function |
| NT | setClipboard | cli_inner_pretty.js:216139 | function |
| QN | buildTerminalLink (OSC-8) | cli_inner_pretty.js:556647 | function |
| Qzg | copyViaTmuxLoadBuffer | cli_inner_pretty.js:216130 | function |
| Ras | ST (ESC backslash) | cli_inner_pretty.js:216351 | constant |
| Ruo | RESET_G0_ASCII (`ESC(B` + SI) | cli_inner_pretty.js:215968 | constant |
| Usr | BRACKETED_PASTE_OFF (DECRST 2004) | cli_inner_pretty.js:253472 | constant |
| Xbr | sanitizeForTerminal | cli_inner_pretty.js:545754 | function |
| Xly | MOUSE_SCROLL_ON (DECSET 1000+1006) | cli_inner_pretty.js:253482 | constant |
| Yly | MOUSE_FULL_ON (DECSET 1000+1002+1003+1006) | cli_inner_pretty.js:253481 | constant |
| _Up | MAX_TABLE_ROWS (200) | cli_inner_pretty.js:636511 | constant |
| bbn | MIN_COL_WIDTH (3) | cli_inner_pretty.js:636509 | constant |
| bqo | truncatedRowsNotice | cli_inner_pretty.js:636278 | function |
| cet | MouseTrackingHost | cli_inner_pretty.js:802308 | function |
| d7 | decSet | cli_inner_pretty.js:253437 | function |
| dHe | detectPlatformForKeyHints | cli_inner_pretty.js:261056 | function |
| ew | DEC_MODES | cli_inner_pretty.js:253456 | object |
| f2u | getSynchronizedOutputTriState | cli_inner_pretty.js:253380 | function |
| f9 | sanitizeForRelay | cli_inner_pretty.js:284228 | function |
| jsr | THEME_NOTIFY_OFF (DECRST 2031) | cli_inner_pretty.js:253476 | constant |
| kZi | isAlternateScreenDisabled | cli_inner_pretty.js:164907 | function |
| m8e | resolveFullscreenReason | cli_inner_pretty.js:164958 | function |
| m_ | collapseControlChars | cli_inner_pretty.js:217537 | function |
| mFe | KITTY_KEYBOARD_POP (`CSI < u`) | cli_inner_pretty.js:239892 | constant |
| mk | supportsHyperlinks | cli_inner_pretty.js:259591 | function |
| nho | BRACKETED_PASTE_ON (DECSET 2004) | cli_inner_pretty.js:253471 | constant |
| out | getHyperlinkOverride | cli_inner_pretty.js:259584 | function |
| p2u | setSyncOutputProbeResult | cli_inner_pretty.js:253377 | function |
| qSe | decReset | cli_inner_pretty.js:253440 | function |
| rMa | JumpToBottomPill | cli_inner_pretty.js:690714 | function |
| rUu | probeTerminalCapabilities | cli_inner_pretty.js:254316 | function |
| tho | syncOutputProbeResult | cli_inner_pretty.js:253378 (assigned; declared with tho at :253568) | variable |
| xee | isSynchronizedOutputSupported | cli_inner_pretty.js:253384 | function |
| yUp | TABLE_PADDING (4) | cli_inner_pretty.js:636508 | constant |
| ybe | getMouseTrackingMode | cli_inner_pretty.js:164997 | function |
| zCu | SCREEN_DCS_CHUNK (76) | cli_inner_pretty.js:216331 | constant |
| zhb | MAX_WRAPPED_LINES (4) | cli_inner_pretty.js:636510 | constant |
| $Rt | hasSeenMouseInput | cli_inner_pretty.js:165006 | function |

Named methods on the vendored Ink renderer class (no obfuscated alias — the property names are
preserved in the bundle):

| Method | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `enterAlternateScreen` | now also resets DECSET 2004 / 2031 | cli_inner_pretty.js:258035 | function |
| `exitAlternateScreen` | restores 2004 / 2031 / 1004 | cli_inner_pretty.js:258049 | function |
| `prepareTerminalForHandoff` | release mouse + focus modes to a child | cli_inner_pretty.js:258066 | function |
| `restoreTerminalAfterHandoff` | reapply mouse + focus modes | cli_inner_pretty.js:258071 | function |
| `reassertTerminalModes` | re-designate G0 ASCII + reapply modes | cli_inner_pretty.js:258576 | function |
| `computeScreenReaderPark` | cursor parking for magnifiers | cli_inner_pretty.js:258440 | function |
| `onRenderScreenReader` | the plain-text render path | cli_inner_pretty.js:258299 | function |

Notes:
- `xee`'s tmux branch (`:253386`) is the `.200`/`.212` delta; 193's `UB` (`:160037 (193)`) had
  `if (process.env.TMUX) return !1;` at `:160038 (193)`.
- `ybe` replaces 193's boolean `Grt` (`:156466-156470 (193)`), whose first line
  (`if (SESSION_KIND === "bg") return !0`) is the `.203` bug.
- `Dmt` (`openInExternalEditor`, `:455136`) chooses between `enterAlternateScreen` and the handoff
  pair at `:455148-455149`.
- `EUp`'s cell memo is `l = new Map()` at `:636295`; the 200-row cap is applied at `:636293`;
  the card fallback returns `kind: "vertical"` at `:636379`.

---

## Module: Accessibility Settings and Environment

> Merge into `symbol_index_core_features.md` (settings / CLI surfaces).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| — | `screenReader` settings group wrapper | cli_inner_pretty.js:60188 | object |
| — | `axScreenReader` zod field | cli_inner_pretty.js:60191 | object |
| — | `emojiCompletionEnabled` zod field | cli_inner_pretty.js:61202 | object |
| — | `vimInsertModeRemaps` zod field | cli_inner_pretty.js:61454 | object |
| Snt | readSettingWithSource | cli_inner_pretty.js:63507 | function |
| reh | CLAUDE_AX_STARTUP_QUIET_MS accessor | cli_inner_pretty.js:31123 | function |
| Feh | CLAUDE_CODE_DISABLE_MOUSE_CLICKS accessor | cli_inner_pretty.js:31082 | function |
| Neh | CLAUDE_CODE_DISABLE_MOUSE accessor | cli_inner_pretty.js:31083 | function |
| heh | CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN accessor | cli_inner_pretty.js:31105 | function |

Notes:
- The terminal/UI block of the settings-visible env allow-list is `:58148-58159`
  (`CLAUDE_AX_SCREEN_READER`, `CLAUDE_CODE_ACCESSIBILITY`,
  `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`, `CLAUDE_CODE_DISABLE_MOUSE`,
  `CLAUDE_CODE_DISABLE_MOUSE_CLICKS`, `CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL`,
  `CLAUDE_CODE_FORCE_STRIKETHROUGH`, `CLAUDE_CODE_HIDE_CWD`, `CLAUDE_CODE_NATIVE_CURSOR`,
  `CLAUDE_CODE_NO_FLICKER`, `CLAUDE_CODE_SCROLL_SPEED`, `CLAUDE_CODE_SYNTAX_HIGHLIGHT`).
- The `axScreenReader` description string at `:60195` is **byte-identical** to `:55852 (193)` —
  the proof that `.208` promoted rather than added the feature.
- Env accessor ids (`reh`, `Feh`, `Neh`, `heh`) are the getter thunks in the typed-env export table
  at `:31000-31200`; they are re-mangled per build and should be re-derived from the env-var name,
  never carried over.
