# 43 — Slash commands and the CLI surface (v2.1.193 → v2.1.220)

**Theme slug:** `slash_cli`
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines)
**Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines)
Every count in this module is written `220=N / 193=M` and every cited line was read in the 2.1.220 bundle.

---

## Documents

| File | Covers |
|---|---|
| [`fork_and_subtask.md`](fork_and_subtask.md) | `/fork` and `/subtask` **as registry entries**: the two `name: "fork"` descriptors, the `isAgentsFleetEnabled()` ternary that chooses between them, the `<directive>`→`[prompt]` arity change, the central `local-jsx` lazy-loader table, the two competing name-derivation functions, and the `--fork-name` false anchor |
| [`doctor_and_diagnostics.md`](doctor_and_diagnostics.md) | The three-way split of the diagnostic surface: `claude doctor` (Ink UI → text report), `/doctor` (Ink dialog → ten-check prompt skill with `aliases: ["checkup"]` and `survivesBundledKillSwitch`), and `/status` (three → four warning builders). Plus the `.203` startup-warning deletion, the `.206` duplicate, the `.207` externally-managed launcher, and the `.214` `EISDIR` guard |
| [`command_and_flag_deltas.md`](command_and_flag_deltas.md) | Twenty long-tail bullets grouped by mechanism (argv parsing / descriptors / message routing / display labels), plus a full triage of the 51 "new CLI flags". §1.6 closes cross-validation cycle **C12** (`.200 #11` `claude agents --plugin-dir`) |
| this file | Index + per-bullet ledger |

**Boundaries.** [`36_background_agents/fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md)
owns `/fork`'s background-session mechanics and the agent-view row; this module owns the commands.
[`52_code_review`](../52_code_review/) owns `/review`, `/code-review`, `/ultrareview`, `/verify`,
`/deep-research`. [`38_permissions`](../38_permissions/) owns auto-mode enforcement; this module covers only
the `/doctor` check and the `Manual` display rename. [`49_sandbox`](../49_sandbox/) owns the sandbox helper
argv listed in the flag triage.

---

## The four findings that matter most

1. **`/fork` has two descriptors in 2.1.220 and a runtime gate picks one.**
   `name: "fork"` is **220=2 / 193=1**. `:507186` reads
   `...(NP() && !Yt(Z.IS_DEMO) ? [mJd, _Jd] : [pJd])`. With `CLAUDE_CODE_DISABLE_AGENT_VIEW` set or
   `disableAgentView: true`, `/fork` keeps its **2.1.193 subagent semantics** and `/subtask` does not exist.
   The changelog presents `.212 #1` as a rename; the code implements a conditional swap.
   → [`fork_and_subtask.md`](fork_and_subtask.md) §0

2. **`.203 #35` is anchored after all — as a deletion.**
   The ledger and the scoping pass both record it UNANCHORED because the changelog's wording
   (`claude command missing or broken`) is 0/0. The real literal is
   `claude command at ${path} missing or broken` and it is **5/5 carryover**. The delta is that
   `installBrokenMessages` went **220=0 / 193=8**, `installPathCount` **0 / 4**, the banner descriptor
   `"install-broken"` **0 / 1**, and the notification key `install-message-` **0 / 1** — replaced by a
   single debug-log line (`install check: `, **220=1 / 193=0**) and a new consumer inside the diagnostics
   gatherer (`checkInstall` **220=2 / 193=0**).
   → [`doctor_and_diagnostics.md`](doctor_and_diagnostics.md) §4

3. **The "51 new CLI flags" list is ~6× over-counted.**
   8 are Claude Code's own options (5 of them belonging to one undocumented subcommand group,
   `claude plugin eval`); 21 are argv Claude Code *constructs* for git, gh, ripgrep, docker or the sandbox
   helper; **19 are not flags at all** — CSS custom properties from bundled skill payloads
   (`--accent`, `--ink`, `--claude`, `--sticky-ink`, …), argparse options inside a bundled chart script,
   and substring matches (`--hand` ⊂ `--handle-uri`, `--hard` ⊂ `--hard-fail`, `--ui` ⊂ an acorn `--ui`
   decrement).
   → [`command_and_flag_deltas.md`](command_and_flag_deltas.md) §5

4. **`.200 #11` (`claude agents --plugin-dir`) is a three-line delta, not a net-new mechanism — and it
   opened a policy hole.** The literal is **220=2 / 193=1**, and the "post-commander re-parse of raw argv"
   that both registers name as *the* mechanism **already existed** in 2.1.193 (`:710511 (193)`). 193 fed the
   re-parsed config only to `dispatchExtraArgs` — dispatched *children* got the plugin, the agent-view
   process itself never did. `.200` adds `setInlinePlugins`/`setInlinePluginsNoMcp`/`clearPluginCache` at
   `:865021-865022`. The flag is destroyed twice by commander: `enablePositionalOptions()` makes the root
   stop parsing at `agents` (`:556001-556004`), and `optsWithGlobals()` merges ancestors *last*
   (`:556033-556034`), so the root's empty default overwrites what the subcommand parsed — raw argv is the
   only surviving copy. **Undocumented consequence:** the fast path gates `--plugin-dir` behind
   `disableSideloadFlags` (`:872445-872458`), the new commander-action site does not.
   → [`command_and_flag_deltas.md`](command_and_flag_deltas.md) §1.6

---

## Per-bullet ledger

Verdicts: **NET_NEW** (220>0 / 193=0, mechanism read) · **DELTA** (both non-zero, narrower change isolated)
· **CARRYOVER** (literal and mechanism pre-exist) · **DISCREPANCY** (changelog claim contradicted by code)
· **UNANCHORED** (no anchor found; recorded honestly).

### `/fork` and `/subtask`

| Bullet | Ver | Verdict | Anchor (2.1.220) | Section |
|---|---|---|---|---|
| `/fork` copies the conversation into a new background session; old behaviour → `/subtask` | .212 #1 | **NET_NEW** + undocumented gate | descriptors `:500525` / `:500537` / `:500572`; registry ternary `:507186`; `name: "fork"` 220=2/193=1 | [fork](fork_and_subtask.md) §0 |
| `/fork` names the copy after your prompt when the session has no title | .212 #39 | NET_NEW (owned by `36_`) | naming `:683674-683676`; **`--fork-name` `:443144` is a `gh repo fork` flag** | [fork](fork_and_subtask.md) §2, §3 |
| `--fork-name` as a Claude Code flag | asset diff | **FALSE** | `new Set(["--org","--fork-name","--remote-name"])` `:443144`; ours is `--fork-session` 12/12 | [fork](fork_and_subtask.md) §3 |
| `/subtask` handler is 2.1.193's `/fork` handler | .212 #1 | NET_NEW literal, carryover body | `NL_` `:500547` ≡ `$L_` `:500500` ≡ `YDf` `:550822 (193)`; both call `Lpn` `:500337` | [fork](fork_and_subtask.md) §1 |
| `/fork` argument became optional | .212 #1 | NET_NEW | `argumentHint: "[prompt]"` `:500541` vs `"<directive>"` `:500529` | [fork](fork_and_subtask.md) §2 |
| `deriveForkName` (kebab slug) | — | **CARRYOVER** | `lJd` `:500461`, 220=1/193=1 | [fork](fork_and_subtask.md) §2 |
| central `local-jsx` loader table | — (undocumented) | **NET_NEW** | `KIn` `:735719`, `O7a` `:735728`, `resolveCommandDialog` 220=2/193=0, `cmd_local_jsx_no_dialog_resolution` 220=3/193=0 | [fork](fork_and_subtask.md) §1 |
| slash-command `aliases` resolution | — | **CARRYOVER** | `qNy` `:346394` ≡ `:581167 (193)` | [fork](fork_and_subtask.md) §5 |

### `/doctor`, `claude doctor`, `/status`

| Bullet | Ver | Verdict | Anchor (2.1.220) | Section |
|---|---|---|---|---|
| `/doctor` is a full setup checkup that can fix issues; `/checkup` is its alias | .205 #21 | **NET_NEW** | `aliases: ["checkup"]` `:785858` (220=1/193=0 — `/checkup` as a literal is 0); prompt `gVS` `:785698`; `type: "prompt"` vs 193's `type: "local-jsx"` `:504457 (193)` | [doctor](doctor_and_diagnostics.md) §2 |
| `claude doctor` cross-references `/doctor` | .205 #21 | NET_NEW | `full setup checkup` `:585327`; `For a full checkup that can also fix issues` `:867757` — both 220=1/193=0 | [doctor](doctor_and_diagnostics.md) §1 |
| `claude doctor` became non-interactive | — (undocumented) | **NET_NEW** | handler `:585240-585345` writes stdout and exits; 193 mounted the Ink dialog `:613206-613228 (193)` | [doctor](doctor_and_diagnostics.md) §1 |
| `survivesBundledKillSwitch` keeps `/doctor` alive under `disableBundledSkills` | — (undocumented) | **NET_NEW** | `:785860`, filter `:419691`/`:419697`, `bV` `:162055`; 220=2/193=0 | [doctor](doctor_and_diagnostics.md) §2 |
| `/doctor` check proposing trimming of checked-in `CLAUDE.md` | .206 #2 | **NET_NEW** | `derive from the codebase` `:785865`, check 3/4 at `:785780-785784` | [doctor](doctor_and_diagnostics.md) §3 |
| `/doctor` update check compares Homebrew installs against the cask channel | .206 #22 | **NET_NEW (prompt-only)** | `getHomebrewCaskName` `:785799` 220=1/193=0; implementation `N2t` `:539643` is **carryover** (`Caskroom` 5/3, both extras are prompt text) | [doctor](doctor_and_diagnostics.md) §3 |
| `/doctor` skipping its auto-mode-default proposal on Bedrock/Vertex/Foundry | .210 #13 | **NET_NEW (prompt-only)** | `make auto mode the default permission mode` `:785865`; `The provider is NOT a skip reason` `:785812` — both 220=1/193=0 | [doctor](doctor_and_diagnostics.md) §3 |
| Removed startup "claude command missing or broken" warnings → `/doctor`, `/status` | .203 #35 | **NET_NEW (a deletion)** — ledger says UNANCHORED, **corrected** | `installBrokenMessages` 220=**0**/193=8; `"install-broken"` 0/1; `install-message-` 0/1; `install check: ` 1/0 `:815899`; `checkInstall` 2/0 `:540023` | [doctor](doctor_and_diagnostics.md) §4 |
| `/status` listing the same broken-install warning twice | .206 #20 | **NET_NEW** — ledger says UNANCHORED, **corrected** | `.filter((t) => t.type !== "error")` `:666063`; direct consequence of `.203 #35` | [doctor](doctor_and_diagnostics.md) §5 |
| Auto-updater overwriting a custom launcher at `~/.local/bin/claude` | .207 #5 | **NET_NEW** | `externally managed` `:541307`; `not created by the native installer` 4/0 `:539922`; `skipped_external_launcher` 1/0; `Not replacing ` 1/0 `:541033` | [doctor](doctor_and_diagnostics.md) §6 |
| `claude update`/`doctor` hanging and `/status` blank when a shell-config path is a directory | .214 #36 | **NET_NEW** — ledger says UNANCHORED, **corrected** | `path is a directory` `:538790` 1/0; `Skipping unreadable shell config` `:538812` 1/0; `isEISDIR` `:19649`. The blank-on-throw swallow (`:672967`) is **carryover** (193 `:498577`) | [doctor](doctor_and_diagnostics.md) §7 |

### Long tail

| Bullet | Ver | Verdict | Anchor (2.1.220) | Section |
|---|---|---|---|---|
| `claude --dangerously-skip-permissions daemon <sub>` treated as a prompt | .199 #15 | **NET_NEW** | `_Al` `:130-134`, call `:872316`; 193 tested `t[0] === "daemon"` `:718427 (193)` | [tail](command_and_flag_deltas.md) §1.1 |
| `claude --bg` + `--print` rejected up front | .198 #20 | **NET_NEW** | `unattachable` `:683498` in `$Gb`; other two refusals 1/1 carryover | [tail](command_and_flag_deltas.md) §1.2 |
| Integer env vars accept `1e6` / `64_000` | .211 #29 | **UNANCHORED** | `64_000` 1/1 (a skill doc); `parseIntEnv`/`coerceInteger` 0/0 | [tail](command_and_flag_deltas.md) §1.3 |
| `claude auto-mode reset` (+`--yes`) | .212 #2 | **NET_NEW** | `auto-mode reset` `:865404` 1/0; `"--yes"` 4/0; lossy-write guard `:865376-865382` | [tail](command_and_flag_deltas.md) §1.4 |
| `claude agents --plugin-dir <dir>` ignored when the flag follows `agents` | .200 #11 | **DELTA** (3 inserted lines) — **owned here**, closes cycle **C12** | literal `claude agents --plugin-dir` **220=2 / 193=1** (`:865022`, `:872437` vs `:718546 (193)`) — **not net-new**; the re-parse also pre-exists (`:710511 (193)`). True delta: `:865021-865023` apply the re-parsed dirs to *this* process (193 used them only for `dispatchExtraArgs`), plus `.action` arity `:867681-867683` and `optsWithGlobals` call 1/0. Root cause is `enablePositionalOptions()` `:850888` + `_parseCommand` break `:556001-556004` + ancestor-last `optsWithGlobals` `:556033-556034` | [tail](command_and_flag_deltas.md) §1.6 |
| Directory suggestions added to `/cd`, matching `/add-dir` | .206 #1 | **NET_NEW** | `wzo = new Set(["add-dir","cd"])` `:654321` 1/0; consumers `:746493`, `:744165` (193: `commandName === "add-dir"` `:629488 (193)`) | [tail](command_and_flag_deltas.md) §2.1 |
| `/login` from the agents view | .198 | **NET_NEW** | `fleetHostCall: async ({ login: e }) => e()` `:455400`; host capability `login:` `:806728`; `fleetHostCall` 220=8/193=7 | [tail](command_and_flag_deltas.md) §2.2 |
| `/install-github-app` and `/mcp` blocked in **agent-view** sessions | .203 #32, .208 #43 | **CARRYOVER guard + NET_NEW telemetry** | refusal string 1/1 `:806782`; condition byte-identical to `:677506 (193)`; `tengu_slash_command_unavailable` 2/0 `:806776` | [tail](command_and_flag_deltas.md) §2.3 |
| `/install-github-app` and the `/mcp` settings menu in **background** sessions | .208 #43, .216 | **NET_NEW** | `eN()` `:112712` 1/0; `u5t` `:700561`; messages `:701705-701706`, `:714216-714220` all 220>0/193=0 | [tail](command_and_flag_deltas.md) §2.3 |
| `/rename` on background sessions being reverted | .202 | **DELTA (descriptor), bullet unproven** | `isEnabled: () => yn()` + `isHidden` on the `local` variant `:496509-496512`; absent in 193 `:527948 (193)` | [tail](command_and_flag_deltas.md) §2.4 |
| `/exit` incorrectly warning about running bg agents after all had completed | .203 #22 | **UNANCHORED** | `running background agents` 0/0; the one `agents still running` hit `:532845` is auto-mode prompt text | [tail](command_and_flag_deltas.md) §2.5 |
| `/loop` hid the session from `/resume` after a single use | .211 #15 | **CARRYOVER filter; proposed anchors WRONG** | `/resume` filter `:527375` ≡ `:585485 (193)`; `tengu_loop_command` `:789923` is invocation telemetry; `tengu_loop_noop_fold` `:230733` is the noop-tick fold | [tail](command_and_flag_deltas.md) §2.6 |
| `/resume` in the agent view opens a past-session picker, resumes as background | .212 #6 | **NET_NEW** | `CLAUDE_CODE_FLEET_PAST_SESSIONS` + `tengu_fleet_past_sessions` `:157288` 1/0; `_cl` `:801829`; picker branch `:806745-806765`; bg seed `jTn` `:806017` | [tail](command_and_flag_deltas.md) §3.1 |
| …including deleted sessions | .212 #6 | **NET_NEW** | exclusion at list time `:806761` and at select time `:805989` (`deleting_in_flight`); sets populated `:805274-805280`, rolled back `:805288-805290` | [tail](command_and_flag_deltas.md) §3.1 |
| `/release-notes` "Show all" injecting the changelog into every request | .208 #27 | **NET_NEW** — ledger says UNANCHORED, **corrected** | `Zkn` `:720265-720267` (`applyMessageOp` + `display:"skip"`) vs 193's `r(FOl(n), {display:"system"})` `:527604 (193)`. `Show all` itself is **2/2 carryover** | [tail](command_and_flag_deltas.md) §3.2 |
| `/usage` shows last-known bars with an "as of" note when rate-limited | .208 #45 | **NET_NEW** | `Uof` `:670406`; `Showing last-known usage` `:670462` 1/0; `rateLimitedVia` 9/0 | [tail](command_and_flag_deltas.md) §3.3 |
| `/usage` stale cached bars | .208 #24 | **NET_NEW** | same `seeded` arm `:670451-670475`; `seedSource` `headers`/`persisted` split | [tail](command_and_flag_deltas.md) §3.3 |
| `/clear` not resetting the session cost counter | .211 #19 | **NET_NEW** — ledger says CARRYOVER-trap, **corrected** | `PSi(), Att()` inserted at `:449532-449533`; absent from 193's identical sequence `:485411-485418 (193)`; `registerSessionCostSaver` 1/0 `:3108` | [tail](command_and_flag_deltas.md) §3.4 |
| Bare `/btw` reopens the side-question panel | .212 #40 | **NET_NEW** | `eLb` `:661737-661748` (history replay + `initialResponse`) vs `Wpf` `:483010-483014 (193)`; `/btw` sites 220=7/**193=9** | [tail](command_and_flag_deltas.md) §3.5 |
| `/upgrade` showing a login flow instead of the upgrade URL | .208 #18 | **DISCREPANCY** | control flow byte-equivalent to 193 (`:719553-719596` vs `:561203-561218 (193)`); only deltas are `callUpgradeFromSurface` 2/0 and the UTM URL builder `:719545` | [tail](command_and_flag_deltas.md) §3.6 |
| `/branch` deriving its name from the compaction summary | .198 #26 | **NET_NEW** | `nJd` `:500107-500112` (array scan) vs `JAl` `:482519-482525 (193)` (single message); the fix is `isCompactSummary === !0` at `:49403` inside `oxt`. `oxt` itself is **carryover** | [tail](command_and_flag_deltas.md) §3.7 |
| `/commit-push-pr` auto-allows push to `remote.pushDefault` / sole remote | .206 #3 | **NET_NEW** | `remote.pushDefault` `:55585` 2/0; `g5n` `:55590`; `getAllowedTools: Cl_` `:449892`; `getAllowedTools` 5/0 | [tail](command_and_flag_deltas.md) §3.8 |
| "default" permission mode renamed "Manual" across CLI/`--help` | .200 | **DELTA (display only)** | `title: "Manual"` `:58497`; `indicator:` 6/0; `fL` `:58323` 1/0; `QOe = "manual"` `:58339`; `Vyl`/`WlE` `:833650`. **`external: "default"` unchanged** | [tail](command_and_flag_deltas.md) §4 |
| …across VS Code / JetBrains | .200 | **OUT OF BUNDLE** | extension-side; no CLI anchor | [tail](command_and_flag_deltas.md) §4 |
| AskUserQuestion no longer auto-continues by default; opt in via `/config` | .200 | **NET_NEW (whole surface)** | `askUserQuestionTimeout` `:61218` 9/0; `afkTimeoutMs` 9/0; `afk_timeout` 2/0; `vNd = ["never","60s","5m","10m"]` `:452190`; `/config` row `:451890` | [tail](command_and_flag_deltas.md) §4 |
| 51 new CLI flags | asset diff | **8 real / 21 foreign argv / 19 non-flags / 3 other modules** | see the table | [tail](command_and_flag_deltas.md) §5 |
| `claude plugin eval` subcommand group | — (undocumented) | **NET_NEW** | `:592262-592325` (`--scaffold`, `--no-scaffold`, `--keep-temp`, `--publish-report`, `--interview`, `--ablation`, `--judge-model`, `--max-cost-usd`, `--allow-tools`) | [tail](command_and_flag_deltas.md) §5.1 |

### Bullets in the scoping files tagged `slash_cli` but owned elsewhere

| Bullet | Ver | Owner |
|---|---|---|
| `AskUserQuestion` idle timeout as a tool behaviour | .200 | [`04_tools`](../04_tools/) (the `/config` row and settings key are covered here) |
| Dynamic workflow size in `/config` (`workflowSizeGuideline`) | .202 | [`42_workflow`](../42_workflow/) — `:60914` |
| Resume-by-name slow in many-worktree repos | .202 #13 | [`50_performance`](../50_performance/) — `worktrees exceeds fanout cap` 1/1 CARRYOVER |
| `claude agents` composer discarding a message when a slash command is absent | .202 #16 | [`36_background_agents`](../36_background_agents/) |
| `claude attach` erroring mid-upgrade restart | .205 #7 | [`36_background_agents`](../36_background_agents/) |
| `/usage-credits` confirmation / malformed amounts | .207 #24, .211 #32 | [`55_auth_providers`](../55_auth_providers/) — `:692741` |
| `claude --resume`/`--continue` not responding to keyboard on startup | .206 #8 | [`48_accessibility_ui`](../48_accessibility_ui/) — `tengu_fleetview_stdin_contention` |
| Unmatched `$1`/`$2` positional placeholders stripped | .210 #15 | [`45_skills`](../45_skills/) |
| Unbounded memory on `--settings` device/multi-GB files | .214 #17 | [`50_performance`](../50_performance/) — `Settings file exceeds the` `:833488` |
| Scheduled tasks refusing their own prompt as untrusted input | .214 #20 | [`40_system_prompt`](../40_system_prompt/) — `:226524` |
| `claude rc` home-directory trust message | .214 #43 | [`54_remote_control`](../54_remote_control/) — `:546768` |
| `claude --teleport` repo mismatch | .218 #17 | [`36_background_agents`](../36_background_agents/) — `:321211` |
| `/fork` one-line confirmation with `claude attach` id | .216 #30 | [`36_background_agents`](../36_background_agents/) §6 |
| `/context` / `/compact` picker bullets | .216, .218 | [`07_compact`](../07_compact/) |
| `/config` fullscreen footer clipping | .217 #24 | [`48_accessibility_ui`](../48_accessibility_ui/) |
| Skills/commands changed mid-session not appearing in the slash menu | .217 #27 | [`45_skills`](../45_skills/) — `tengu_skills_sync_manifest_failed` |
| `--resume`/`--continue` TypeError on a malformed attachment | .218 #10 | [`07_compact`](../07_compact/) |

---

## Corrections this module makes to the foundation-pass registers

| Register entry | Correction |
|---|---|
| `_false_delta_ledger.md` §1 (.200-.205): *".203 removed startup 'claude command missing or broken' warnings — literal absent from BOTH bundles, only checkable half is `full setup checkup`"* | The literal exists in both as `claude command at ${path} missing or broken` (5/5). The bullet **is** anchorable, as a deletion: `installBrokenMessages` 220=0/193=8 plus four sibling literals. |
| `_scope_v206_210.md` #20: *"`/status` listing the same broken-install warning twice — UNANCHORED"* | Anchored at `:666063`. It is the direct consequence of the `.203` reroute. |
| `_scope_v211_214.md` #19: *"`/clear` not resetting the session cost counter — CARRYOVER-trap, every cost literal identical"* | Correct that the literals are identical, but the bullet is **NET_NEW**: two calls (`PSi()`, `Att()`) were inserted into the reset sequence at `:449532-449533`, and `registerSessionCostSaver` is 220=1/193=0. |
| `_scope_v211_214.md` #36: *"`/status` blank when a shell-config path is a directory — UNANCHORED, `.zshrc` literals identical"* | Anchored at `:538790` (`path is a directory`, 1/0) and `:538812`. The `.zshrc` paths are indeed carryover; the guard is not. |
| `_scope_v206_210.md` #27: *"`/release-notes` 'Show all' — UNANCHORED, `Show all` 2/2"* | `Show all` is carryover, but the routing change is anchored at `:720265-720267`. |
| `_scope_v211_214.md` #15: proposes `tengu_loop_command` / `tengu_loop_noop_fold` for the `/loop`-hides-from-`/resume` bullet | Both gates are unrelated (invocation telemetry and the consecutive-noop terminal fold). The `/resume` filter is byte-identical carryover. Still UNANCHORED. |
| `_GROUND_TRUTH` §4.5 and the brief: *"`--fork-name` appears in the flag set at `:443144`"* | Correct location, wrong owner: it is a `gh repo fork` flag. Concurs with [`36_background_agents`](../36_background_agents/fork_to_background_session.md) §8. |
| `_raw_asset_diff_193_to_220.md`: 51 new CLI flags | 19 of the 51 are not CLI flags in any program (CSS variables, an embedded argparse script, substring matches). |
| `_false_delta_ledger.md`: `claude agents --plugin-dir` recorded **1/0 (net-new)** | The literal is **220=2 / 193=1** — `:718546 (193)` carries the identical `clearPluginCache` call, preserved verbatim in 2.1.220 at `:872437`. Only the parenthesised label `claude agents --plugin-dir (commander action)` is 1/0. |
| `_xval_contradictions.md` §2 C12: *"a post-commander re-parse of raw argv at `:865020-865022`"* is the mechanism | The re-parse **pre-exists** — 193 `:710511` already ran `KZt(process.argv.slice(2))` inside `agentsCommandHandler`, and `$$n` `:69-108` ≡ `KZt` `:65-104 (193)`. The delta is that 193 fed the result only to `dispatchExtraArgs` (child argv); `.200` adds `setInlinePlugins`/`setInlinePluginsNoMcp`/`clearPluginCache` for the current process. **C12 is now CLOSED.** |

---

## Method notes for a reader re-deriving any of this

1. **A slash command's identity is its descriptor object, not a `/name` literal.** `/checkup` greps to 0;
   `aliases: ["checkup"]` is the anchor. Always search `name: "<cmd>"` in `:448440-503400` first
   ([`file_index.md`](../00_overview/file_index.md) §6), then the registration list around `:507150-507250`.
2. **A command can exist twice.** Check the *count* of `name: "<cmd>"` in both bundles before assuming one
   definition, and then find who selects between them.
3. **`display: "system"` versus `applyMessageOp`** is the difference between "enters the transcript
   forever" and "renders once". Several bullets in this window are exactly that switch.
4. **Descriptor fields carry semantics.** `argumentHint` (`<x>` required vs `[x]` optional),
   `isEnabled`/`isHidden`, `immediate`, `requires: {ink|workspace}`, `fleetHostCall`,
   `supportsNonInteractive`, `disableModelInvocation`, `survivesBundledKillSwitch`, `getAllowedTools`,
   `aliases`. Diffing the *field set* of a descriptor is often faster than diffing its behaviour.
5. **When a diagnostic goes "blank", look for a `.catch(() => [])`** and then look one frame deeper for
   what started throwing. The swallow is usually carryover; the throw is the delta.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All new symbols discovered by this module are staged in
> [symbol_additions_v2_1_220_slash_cli.md](../00_overview/symbol_additions_v2_1_220_slash_cli.md), grouped
> by the `symbol_index_*.md` file they must merge into.

Key entry points for this module:
- `builtinSlashCommandRegistry` (`H_r`, `:507179`) - the descriptor list; fork/subtask ternary at `:507186`
- `resolveCommandByName` (`Cv`, `:346396`) - exact name wins, alias is the fallback
- `resolveLocalJsxCommandLoader` (`KIn`, `:735719`) - `load ?? LOCAL_JSX_LOADERS[name]`
- `registerBundledPromptCommand` (`ou`, `:419629`) - builds `type: "prompt"` descriptors
- `getInstallationDiagnostics` (`Lbr`, `:539994`) - shared by `claude doctor` and `/status`
- `statusWarnings` (`LAa`, `:666493`) - the four-builder `/status` aggregator
- `validateBackgroundLaunchArgv` (`$Gb`, `:683486`) - `claude --bg` pre-flight
- `peelDaemonSubcommandArgv` (`_Al`, `:130`) - the pre-commander daemon fast path
- `normalizePermissionModeAlias` (`fL`, `:58323`) - `manual` → `default`
- `permissionModeDisplayTable` (`dWl`, `:58495`) - the `.200` rename lives here
