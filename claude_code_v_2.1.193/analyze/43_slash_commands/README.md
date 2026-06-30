# 43 — Slash Commands / CLI / Plugins / Hooks (v2.1.183 → v2.1.193, EXTEND)

> Delta module: `43_slash_commands/` documents the **v2.1.183 → v2.1.193** changes to the slash-command / CLI-input / plugin / hooks surface across the 2.1.185–2.1.193 window.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION 2.1.193, build a1938d2a). Every `cli_inner_pretty.js:<line>` citation is a **193** line unless tagged *(183)*.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> Obfuscated names are **re-derived** per build — a 183 obf token is never reused for a 193 symbol. Canonical map: [../00_overview/symbol_additions_v2_1_193_slash_commands.md](../00_overview/symbol_additions_v2_1_193_slash_commands.md).

---

## TL;DR — two real subsystems, several tidy diffs, two carryovers

This window's slash/CLI/plugin/hooks diff is a mix of one rich net-new subsystem, one woven net-new capability, three single-symbol before/after diffs, two carryovers documented honestly to prevent false-delta inflation, and one current-version subsystem deep dive:

1. **NET-NEW (woven): `/rewind` resuming from before `/clear`** (2.1.191). A persisted `rewound` transcript marker (`hYt`/`MUo`) that the reader (`tde`) follows across the `parentSessionId` boundary, plus a `tengu_rewind_first_message` gate that lets the rewind anchor land on the **first** user message (`XRc` resolver). The user-visible strings are carryover; the persistence + gate are net-new (`rewound` 1→12, gate 0→1). → [`rewind_before_clear.md`](./rewind_before_clear.md)

2. **NET-NEW (subsystem): plugin marketplace `renames` auto-follow** (2.1.193). The richest item — schema (`renames`) + cycle-safe resolver (`s_t`, cap 16) + loader follow (`p0o`) + settings migrator (`NHl`) + telemetry (`k0n`/`tengu_plugin_renamed`). Every feature string absent in 183. Also covers the two `/plugin` housekeeping bullets — **CARRYOVER**: 2.1.187 unused-plugin staleness sweep (`G1t`, thresholds inlined to 14d/10s) and 2.1.186 "more above" indicator (`tKt`, 9=9). → [`plugin_auto_rename.md`](./plugin_auto_rename.md)

3. **FIX: hooks comma-separated matchers** (2.1.191). `"Bash,PowerShell"` silently never fired in 183 (comma rejected by the validation regex → compiled as a never-matching `RegExp`). 193's `s3f` adds an `allowComma` param that widens the regex and splits on `/[|,]/`. → [`hook_matcher_comma_fix.md`](./hook_matcher_comma_fix.md)

4. **CLI / `/review` / retries miscellany** (four isolable items). `/add-dir` already-a-working-dir three-message refinement (`jot`, 2.1.193); `/btw` ←/→ answer navigation (2.1.187, net-new nav on a carryover feature); `/review <pr>` → code-review medium engine (`oRf`/`rRf`, 2.1.186); `CLAUDE_CODE_MAX_RETRIES` cap 15 + `CLAUDE_CODE_RETRY_WATCHDOG` redirect (`O5f`/`Ujo`/`jHe`, 2.1.186, upgrade-gotcha). → [`cli_input_and_review_misc.md`](./cli_input_and_review_misc.md)

5. **Current-version subsystem deep dive: voice input support.** `/voice` gates user intent on Claude.ai OAuth, `allow_voice_mode`, local recorder availability, microphone permission, and STT reachability; the runtime records 16 kHz mono PCM locally and streams it to `/api/ws/speech_to_text/voice_stream`. This is not counted as a whole-window net-new delta; it documents 2.1.193 behavior with 2.1.88 readable-source cross-validation, including current `hold`/`tap` modes and double-tap submit. → [`voice_input.md`](./voice_input.md)

**Confidence:** high for items 2, 3, and each sub-item of 4; medium-high for item 1 (provable piece-by-piece, but woven through session/transcript persistence rather than a single function).

---

## What changed at a glance

| # | Delta | Kind | Changelog | 193 anchor | 183 before | Confidence |
|---|-------|------|:---------:|------------|------------|:----------:|
| 1 | `/rewind` before `/clear` | NET-NEW (woven) | 2.1.191 | `hYt` :582712; `tengu_rewind_first_message` :707201; `XRc` :705599 | `rewound`=1 (file-rewind only); `persistAnchor`=0 | med-high |
| 2 | plugin `renames` auto-follow | NET-NEW (subsystem) | 2.1.193 | `renames` :55667; `s_t` :478428; `NHl` :478443; `k0n` :195349 | all feature strings = 0 | high |
| 3 | hooks comma matchers fire | FIX | 2.1.191 | `s3f` :589634 (split `/[|,]/`) | `qyf` :577890 pipe-only | high |
| 4a | `/add-dir` already-working msg | REFINEMENT | 2.1.193 | `jot` :177994; `isExactMatch`/`isOriginalCwd` | `VZe` :176903 single line | high |
| 4b | `/btw` ←/→ answer nav | NET-NEW (nav) | 2.1.187 | key handler :482757 (`-1`/`+1`) | feature present, no selection | high |
| 4c | `/review <pr>` → code-review medium | NEW | 2.1.186 | `oRf` :538534 `effort:"medium"`; `rRf` :538510 | `Zrf` :527336 no effort | high |
| 4d | MAX_RETRIES cap 15 + RETRY_WATCHDOG | FIX / gotcha | 2.1.186 | `O5f` :603209; `Ujo`=15 :603244 | `vEf` :591059 no cap | high |

---

## Carryover / false-delta ledger (be adversarial)

| Item | Looked like | Reality | Anchor |
|------|-------------|---------|--------|
| `MessageSelector` label / `Run /rewind to recover` / `--rewind-files` | the /rewind-before-/clear feature | CARRYOVER strings (183 counts 2 and 5) | :178765, :193227 |
| `resetSessionForClear` (`Jdr`) | the rewind delta | CARRYOVER — `/clear` already stashed `parentSessionId` in 183 | :2575 |
| `/plugin` staleness sweep (`G1t`, `daysSinceLastUse`) | 2.1.187 "unused plugins" code | CARRYOVER — 8=8; thresholds inlined to 14d/10s | :195014 |
| `/plugin` orphan detector (`S9f`/`lTf`) | renames net-new code | CARRYOVER body + a one-line `renames` exclusion (REFINEMENT) | :612532 (183 :600380) |
| `"more above"` indicator (`tKt`) | 2.1.186 "/plugin more above" code | CARRYOVER / UI-only — 9=9, shared windowed-list | :517883 (return `:517886`) |
| `CLAUDE_CODE_RETRY_WATCHDOG` (`jHe`) | new env in 2.1.186 | CARRYOVER env (2=2); only the MAX_RETRIES cap is new | :602803 |
| `/btw` feature itself (`xpf`/`(+M earlier /btw)`) | 2.1.187 nav | CARRYOVER feature; only the ←/→ *selection* is net-new | :482363 (183 :473560) |
| `x.matcher.split("|")` @240472 | the hooks comma fix | DIFFERENT FEATURE — `FileChanged` watch-path split, not the tool-name hook matcher | :240472 |

---

## Files in this module

```
43_slash_commands/   (v2.1.193 — DELTA tree)
├── README.md                       ← you are here (index + at-a-glance + carryover ledger)
├── rewind_before_clear.md          ← /rewind before /clear: rewound marker (hYt/MUo), reader chain-follow (tde),
│                                       tengu_rewind_first_message gate, XRc anchor resolver. NET-NEW (woven).
├── plugin_auto_rename.md           ← marketplace renames auto-follow: schema, s_t resolver (cap 16), p0o loader
│                                       follow, NHl settings migrator, k0n telemetry; + /plugin unused-plugin
│                                       surfacing & "more above" (CARRYOVER). NET-NEW subsystem (richest item).
├── hook_matcher_comma_fix.md       ← s3f comma-aware matcher (allowComma + /[|,]/ split); o3f event set;
│                                       183 qyf pipe-only before-picture. FIX.
├── cli_input_and_review_misc.md    ← /add-dir 3-message (jot); /btw ←/→ nav; /review medium (oRf/rRf);
│                                       MAX_RETRIES cap 15 + RETRY_WATCHDOG (O5f/Ujo/jHe). Four isolable items.
└── voice_input.md                  ← current-version voice subsystem: /voice gate, local audio capture,
                                        voice_stream WebSocket STT, hold/tap key handling, transcript insertion.
```

## Reading order

1. **This README** — internalize the four deltas + which items are carryover.
2. **`plugin_auto_rename.md`** — read first of the deep docs; it is the only *subsystem* change and the richest (schema → resolver → loader → migrator → telemetry).
3. **`rewind_before_clear.md`** — the woven net-new capability; read after plugins since it spans session/transcript persistence.
4. **`hook_matcher_comma_fix.md`** — a tidy two-character fix with important `allowComma` plumbing.
5. **`cli_input_and_review_misc.md`** — four independent before/after diffs; read per item as needed.
6. **`voice_input.md`** — current-version subsystem deep dive; read when tracing `/voice`, audio capture, STT streaming, or prompt insertion.

## Note on version attribution

The scout dossier corrected several off-by task tags against the real `claude_code_v_2.1.193/CHANGELOG.md`: `/rewind` before `/clear`, hooks comma fix → **2.1.191**; `renames` follow + `/add-dir` message → **2.1.193**; `/btw` nav + `/plugin` recently-used → **2.1.187**; `/plugin` "more above" + MAX_RETRIES cap + `/review` medium → **2.1.186**. The anchors above use this corrected dating.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this README uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (session/transcript state, LLM-API retry path)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (CLI, `/btw`, Hooks)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (settings persistence, telemetry, retries)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (**Slash Commands / Plugins / Marketplace / Hooks** — the home for this module)
> - [../00_overview/symbol_additions_v2_1_193_slash_commands.md](../00_overview/symbol_additions_v2_1_193_slash_commands.md) — the granular v2.1.193 additions for this module

Headline functions/constants (full per-symbol lists live in each deep doc):

- `rewindAnchorWriter` (obf `hYt`, `cli_inner_pretty.js:582712`) — persists `rewound:!0` into the transcript.
- `resolveRewindAnchors` (obf `XRc`, `cli_inner_pretty.js:705599`) + gate `tengu_rewind_first_message` (`:707201`).
- `resolvePluginRename` (obf `s_t`, `cli_inner_pretty.js:478428`) — cycle-safe rename chain walk (cap `Gdf`=16, `:478477`).
- `migrateRenamedPluginsInSettings` (obf `NHl`, `cli_inner_pretty.js:478443`) — rewrites settings keys old→new.
- `hookMatcherMatches` (obf `s3f`, `cli_inner_pretty.js:589634`) — comma-aware matcher; 183 `qyf` `:577890`.
- `formatAddDirResult` (obf `jot`, `cli_inner_pretty.js:177994`) — three-message add-dir branch.
- `reviewCommand` (obf `oRf`, `cli_inner_pretty.js:538534`) — `/review <pr>` at `effort:"medium"`.
- `getMaxRetries` (obf `O5f`, `cli_inner_pretty.js:603209`) — clamp to `Ujo`=15 (`:603244`).
- `voiceCommandHandler` (obf `bFf`, `cli_inner_pretty.js:572485`) — `/voice` auth/policy/dependency gate and `hold`/`tap` settings toggle.
- `useVoice` (obf `wtm`, `cli_inner_pretty.js:649459`) — recording, voice-stream connection, retry, replay, and transcript orchestration.
- `useVoiceIntegration` (obf `Zar`, `cli_inner_pretty.js:650026`) — prompt anchoring, interim/final transcript insertion, auto-submit, double-tap submit.
- `useVoiceKeybindingHandler` (obf `elr`, `cli_inner_pretty.js:650152`) — hold/tap keybinding state machine.
