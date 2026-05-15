# Slash Commands Index: v2.1.88 -> v2.1.112

## Purpose

This document indexes every NEW (or substantially changed) slash command introduced between Claude Code **v2.1.88** (source-available baseline at `/lyz/codespace/3rd/claude-code/src/`) and **v2.1.112** (obfuscated chunks at `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.112/source/chunks.*.mjs`).

Each entry records:

- **Purpose** — what the command does in 1-2 lines.
- **Version introduced** — release where the user-visible slash command first lands.
- **v2.1.88 status** — absent, present-as-skill, present-but-non-interactive, etc.
- **v2.1.112 chunk location** — file and line of the registration object.
- **Key entry function / class** — obfuscated symbol with readable name.
- **Trade-offs / design notes** — significant choices that distinguish the command from alternatives.

Symbols referenced below live in `symbol_index.md` and the per-unit additions file `symbol_additions_unit_17.md`.

---

## Quick summary table

| Command | Version | v2.1.88 state | Chunk | Registration symbol |
|---------|--------:|---------------|-------|---------------------|
| `/buddy` | 2.1.89 (seasonal) | Source present behind `feature('BUDDY')` flag, not in 2.1.88 chunks | not compiled in 2.1.112 build (seasonal) | `feature('BUDDY')` gate, source at `src/buddy/` |
| `/powerup` | 2.1.90 | Absent | `chunks.180.mjs:1396-1403` | `qQK` -> `registeredPowerupCommand` |
| `/release-notes` (interactive) | 2.1.92 | Text-dump only (`commands/release-notes/release-notes.ts`) | `chunks.180.mjs:1701-1708` | `pFY` -> `releaseNotesCommandDef` |
| `/setup-bedrock` | 2.1.92 | Absent | `chunks.183.mjs:450-461` | `ecK` -> `setupBedrockCommandDef` |
| `/agents` (tabbed) | 2.1.98 | Existed as plain manager UI; **tabbed layout** new | `chunks.187.mjs:2896-2903` | `qiY` -> `agentsCommandDef` |
| `/setup-vertex` | 2.1.98 | Absent | `chunks.183.mjs:514-525` | `YlK` -> `setupVertexCommandDef` |
| `/team-onboarding` | 2.1.101 | Absent | `chunks.190.mjs:193-231` | `jsY` -> `teamOnboardingCommandDef` |
| `/btw` (fix) | 2.1.101 | Present (`commands/btw/`) but wrote full transcript per call | `chunks.166.mjs:2982-2991` | `wyY` -> `btwCommandDef` |
| `/insights` (fix) | 2.1.101 | Present (`commands/insights.ts` 3200 lines) | `chunks.190.mjs:2218-...`, alt registration `chunks.191.mjs:303-316` | `csY` / `rsY` -> `insightsCommandDef` |
| `/loop` + `/proactive` alias | 2.1.105 | `/loop` shipped as a **bundled skill** (`src/skills/bundled/loop.ts`); `/proactive` absent | `chunks.212.mjs:874-...` | `ojA` -> `loopCommandRegistrar` |
| `/recap` | 2.1.108 | Implicit auto-recap only (`src/services/awaySummary.ts`); no slash command | `chunks.189.mjs:2782-2792` | `LaY` -> `recapCommandDef`, handler `yaY` |
| `/undo` alias for `/rewind` | 2.1.108 | `/rewind` existed; `aliases: ["checkpoint"]` only | `chunks.188.mjs:142-152` | `jiY` -> `rewindCommandDef`, `aliases: ["checkpoint", "undo"]` |
| `/focus` | 2.1.110 | Toggled via `Ctrl+O` chord, not a standalone command | `chunks.189.mjs:1450-1475` | `FoY` -> `focusCommandDef` |
| `/tui` | 2.1.110 | Env-var-only (`CLAUDE_CODE_NO_FLICKER`); no command | `chunks.185.mjs:444-454`, handler `chunks.185.mjs:397-431` | `IcY` -> `tuiCommandDef`, handler `bcY` |
| `/ultrareview` | 2.1.111 | Source-only stub (`src/commands/review.ts` exports it, gated by `isUltrareviewEnabled`) | `chunks.183.mjs:2168-2176` | `ulK` -> `ultrareviewCommandDef`, gate `wW6` |
| `/effort` (interactive slider) | 2.1.111 | Typed-arg only in source (`src/commands/effort/effort.tsx`) | `chunks.189.mjs:1432-1444` | `YtK` -> `effortCommandDef` |
| `/less-permission-prompts` | 2.1.111 | Absent | `chunks.211.mjs:1401-1419` | `p25` -> `lessPermissionPromptsRegistrar`, prompt body `WjA` |
| `/setup-vertex`, `/setup-bedrock` improvements | 2.1.111 | (see initial introduction above) | same chunks | re-uses existing defs; UX changes inside loaded modules |

> Note: `/setup-vertex` and `/setup-bedrock` appear twice because v2.1.111 ships UX improvements on top of the v2.1.92 / v2.1.98 introductions; the registration object is unchanged.

---

## Per-command detail

### `/ultrareview` — v2.1.111

**What it does:** Multi-agent cloud-based code review of the current branch (or a specified `<PR#>`). Runs on Claude Code for the Web ("CCR"). Surfaces findings as ranked verified bugs with cost / runtime estimate baked into the description.

**v2.1.88 state:** The source already defines `ultrareview` in `src/commands/review.ts` (`isEnabled: () => isUltrareviewEnabled()`), but the feature is gated off and not visible to users. The actual cloud bughunter backend, preflight, and UI are not present.

**v2.1.112 location:**

- Command registration: `chunks.183.mjs:2168-2176`
- Preflight call: `chunks.183.mjs:580` (`/v1/ultrareview/preflight`)
- Launch path: `chunks.183.mjs:1854-1980` (`tengu_review_remote_teleport_*` events)
- Stop-handler text: `chunks.183.mjs:1404`
- Active banner: `chunks.204.mjs:351`

**Key entry symbol:** `ulK` -> `ultrareviewCommandDef`. The `description` is a **getter** (not a static string) so each render of `/help` pulls fresh estimates from server-provided constants `s_6` (`getRuntimeEstimate`) and `Au6` (`getCostEstimate`). The gate `wW6` (`isUltrareviewEnabled`) checks preflight + entitlement.

**Trade-offs:**

- Cloud-only — offline users cannot invoke it. The team accepts this because positioning is "polish-the-PR-before-merging" rather than the everyday `/review`.
- Two entry shapes (`/ultrareview` reviews current branch, `/ultrareview <PR#>` fetches the PR via `gh`). The branch path attempts to bundle the working tree; if the repo is too large (`grep 'too large to bundle'` in 183.mjs:635) it falls back to suggesting the PR-number form.
- Zero-data-retention orgs are excluded by preflight reason `"zdr"`.

---

### `/recap` — v2.1.108

**What it does:** Generates a one-line recap of the current session immediately, on demand. Reuses the same generator that the auto-away-summary uses (`src/services/awaySummary.ts`).

**v2.1.88 state:** No `/recap` command. `awaySummary.ts` already produced an idle-return recap (auto-shown when the user came back after 5+ minutes), but there was no way to *trigger* the recap on demand.

**v2.1.112 location:** `chunks.189.mjs:2782-2792`. Handler `yaY` invoked by `call:` field.

**Key entry symbol:** `LaY` -> `recapCommandDef` (re-exported as `haY`).

**Trade-offs:**

- Gated behind feature flag `tengu_sedge_lantern` (`isEnabled: () => u8("tengu_sedge_lantern", !0)`), defaulting to ON. The flag exists so the feature can be disabled per-cohort if generation cost spikes.
- `supportsNonInteractive: !1` — does not work in headless / `-p` mode. Why: recap is a *display* feature and the headless harness has no transcript surface.
- Reuses the auto-summary generator rather than implementing a parallel path — keeps wording / token-budget consistent across explicit and implicit recaps.

---

### `/undo` — v2.1.108 (alias for `/rewind`)

**What it does:** Restores the codebase or conversation to a prior checkpoint. `/undo` is added as an additional alias to the existing `/rewind` command.

**v2.1.88 state:** `/rewind` existed (`src/commands/rewind/`) with `aliases: ["checkpoint"]`. `/undo` was not an alias.

**v2.1.112 location:** `chunks.188.mjs:142-152`.

**Key entry symbol:** `jiY` -> `rewindCommandDef`, exposed as `ooK`. `aliases: ["checkpoint", "undo"]`.

**Trade-offs:**

- Alias rather than parallel command — same code path, same UI, same checkpoint semantics. Cheaper than maintaining two commands.
- "undo" is the term most CLI users reach for first; adding the alias reduces command-discovery friction without renaming `/rewind` (which appears in the existing docs and muscle memory).

---

### `/focus` — v2.1.110

**What it does:** Toggles "focus view" — show only the user's prompt, a tool-call summary, and the final response; suppress intermediate transcript noise. Persists across sessions via `briefTranscript` config.

**v2.1.88 state:** Focus view existed as a behavior of the `Ctrl+O` chord (which also toggled verbose transcript). Not addressable as a slash command.

**v2.1.112 location:** `chunks.189.mjs:1450-1475`.

**Key entry symbol:** `FoY` -> `focusCommandDef`. `immediate: !0` — no confirmation prompt; toggle happens immediately on invocation.

**Trade-offs:**

- Persists across sessions via `d8(...)` writing `briefTranscript` to config. A user wanting one-session focus must toggle off before exit. Rationale: focus is a *preference*, and the model is "set once, expect it on next run."
- `isEnabled: lq` — only available in the fullscreen / NO_FLICKER renderer. Default-renderer focus is not yet ready (transcript filtering needs the alt-screen frame buffer).
- Splits responsibility away from `Ctrl+O`, which now toggles verbose only. Why: a chord with two meanings was unteachable; a dedicated `/focus` command makes the intent explicit and discoverable in the slash menu.

---

### `/tui` — v2.1.110

**What it does:** Switches the terminal UI renderer between `default` and `fullscreen`. `fullscreen` is the alt-screen, flicker-free renderer that previously required the `CLAUDE_CODE_NO_FLICKER=1` env var and a restart.

**v2.1.88 state:** No `/tui` command. The renderer choice was env-var-only (`CLAUDE_CODE_NO_FLICKER`, introduced in v2.1.89).

**v2.1.112 location:**

- Command definition: `chunks.185.mjs:444-454`
- Handler: `chunks.185.mjs:397-431` (`bcY` -> `tuiCommandHandler`)
- Mode list: `chunks.185.mjs:438` (`["default", "fullscreen"]`)

**Key entry symbol:** `IcY` -> `tuiCommandDef`. `supportsNonInteractive: !1`.

**Trade-offs:**

- `argumentHint: "[default|fullscreen]"` — typed-arg, no interactive picker. Why: only two values; an interactive picker would be heavier than typing.
- Resolution priority (`chunks.65.mjs:1491-1505`): env var > tmux integration mode (`-CC` forces default) > `settings.json` `tui` key > feature gate `tengu_pewter_brook`. The env var still wins so existing automation keeps working.
- Telemetry event `tengu_tui_command` is fired so the team can measure how many users self-graduate from env-var to command.

---

### `/team-onboarding` — v2.1.101

**What it does:** Scans the user's local Claude Code usage (sessions, slash commands invoked, MCP servers configured) over the last N days and generates a teammate-ramp-up Markdown guide. Designed to be shared with a new team member as their first message.

**v2.1.88 state:** Absent. No "onboarding guide" concept.

**v2.1.112 location:** `chunks.190.mjs:193-231`.

**Key entry symbol:** `jsY` -> `teamOnboardingCommandDef`. Re-exported as `JsY`.

**Trade-offs:**

- `disableModelInvocation: !0` — the model cannot auto-invoke this command. Why: the generation is deterministic from local data (no model loop needed), and inserting it into the model's tool surface would tempt unnecessary invocations.
- `allowedTools: ["Edit(ONBOARDING.md)", "Bash(ls *)"]` — a tight allowlist scoped to writing the guide file and listing directories. Prevents the generated prompt from spawning arbitrary tool calls.
- Prompt + template pulled from feature flag `tengu_flint_harbor_prompt` (`chunks.190.mjs:208`) — so the team can hot-swap the prompt without a release.
- Window default `wsY` (typically 30 days), clamped `[1, 365]`. Bounds prevent runaway scans on long-running installations.

---

### `/loop` + `/proactive` — v2.1.105 (alias added)

**What it does:** Schedules a prompt or slash command to run on a recurring interval (e.g. `/loop 5m /babysit-prs`, `/loop check the deploy every 20m`). Omitting the interval lets the model self-pace when dynamic-loop is enabled.

**v2.1.88 state:** `/loop` existed but **as a bundled skill** at `src/skills/bundled/loop.ts`, not a first-class command. The skill body parsed `[interval] <prompt>` and called the `CRON_CREATE_TOOL_NAME` tool. No `/proactive` alias.

**v2.1.112 location:** `chunks.212.mjs:874-...` (registered via `ojA()` -> `MA({ name: "loop", aliases: ["proactive"], ... })`).

**Key entry symbol:** `ojA` -> `loopCommandRegistrar` (calls `MA(...)` to register).

**Trade-offs:**

- Graduated from skill -> built-in command in this window. Rationale: scheduling is a first-class workflow surface, not a niche skill; building it into the command registry makes it discoverable in `/help` without the skill plugin overhead.
- Dynamic description: when `dW7.isLoopDynamicEnabled()` is true, the description advertises the model-self-paced form ("Omit the interval to let the model self-pace"). The flag exists so the team can A/B the more flexible UX.
- Argument hint is also dynamic: `[interval | until <condition>] [prompt]` (when default-prompt flag is on) vs `[interval] <prompt>`. The `until <condition>` form is the "stop when X" variant — implemented by the regex match at `chunks.212.mjs:891`.
- `whenToUse` hint exists to steer the model's auto-invocation: "Do NOT invoke for one-off tasks."

---

### `/powerup` — v2.1.90

**What it does:** Interactive lessons that walk the user through Claude Code features with animated demonstrations.

**v2.1.88 state:** Absent. No "lessons" concept in the codebase.

**v2.1.112 location:** `chunks.180.mjs:1396-1403` (def), with the lesson component at `tUK` and lessons data at `Xg` (chunks.180.mjs:961).

**Key entry symbol:** `qQK` -> `registeredPowerupCommand` (set by `KQK` -> `powerupCommandDef` lazy initializer).

**Trade-offs:**

- Lazy-loaded (`load: () => Promise.resolve().then(() => (eUK(), tUK))`) — the lessons module is heavy (animated frames, tutorial state), so it stays out of cold-start memory.
- `type: "local-jsx"` — the UI is rich React-Ink; cannot be invoked headlessly.
- Lesson list is statically embedded (`Xg` array). Future expansion would either grow this array or shift to a server-fetched playlist.

---

### `/buddy` — v2.1.89 (April 1st seasonal)

**What it does:** Hatches a "small creature that watches you code" — a Mulberry32-seeded companion with rarity, stats, and a terminal-art sprite. Easter egg.

**v2.1.88 state:** Source files exist (`src/buddy/companion.ts`, `src/buddy/CompanionSprite.tsx`, `src/buddy/prompt.ts`, `src/commands/buddy/index.js`) but registration is gated by `feature('BUDDY')` flag at `commands.ts:118`.

**v2.1.112 location:** **Not compiled into the v2.1.112 build.** The companion code path was excluded after the April 1st 2026 flag-flip window. The changelog item for v2.1.89 is the only public marker.

**Key entry symbol:** Source-side `feature('BUDDY')` gate at `src/commands.ts:118-124`. No corresponding obfuscated symbol in v2.1.112 chunks.

**Trade-offs:**

- Seasonal release pattern — built behind feature flag, enabled briefly around April 1st, then excluded from subsequent builds. The audit-trail entry remains in commands.ts but is dead code by v2.1.112.
- Avoids permanent shipping cost (lessons, prompts, sprite assets) while preserving the easter-egg surprise.

---

### `/release-notes` (interactive) — v2.1.92

**What it does:** Picks a release notes version interactively (multi-version picker UI) instead of dumping all versions as plain text.

**v2.1.88 state:** `src/commands/release-notes/release-notes.ts` exists but only produces a flat formatted dump (`formatReleaseNotes` iterates `notes.map(([version, notes]) => ...)`).

**v2.1.112 location:** `chunks.180.mjs:1701-1708`.

**Key entry symbol:** `pFY` -> `releaseNotesCommandDef`, re-exported as `k27`. `type: "local-jsx"` (was `prompt`-typed text dump in 2.1.88).

**Trade-offs:**

- Type changed from text-dump to `local-jsx` because the picker is now a React-Ink component.
- The text-dump format is preserved internally (CI scripts that grep release-notes output were a stated concern in the v2.1.92 changelog).
- Cached changelog at `v27()` -> `<config>/cache/changelog.md` — written via `_QK`/`zQK` with `flag: "wx"` (write-exclusive, fail if exists) so concurrent processes don't clobber each other.

---

### `/btw` — usage doc fix in v2.1.101

**What it does:** Ask Claude a quick side question without interrupting the main conversation. The "by the way" channel.

**v2.1.88 state:** Present (`src/commands/btw/btw.tsx`, 242 lines). Functionality existed.

**v2.1.112 location:** `chunks.166.mjs:2982-2991`.

**Key entry symbol:** `wyY` -> `btwCommandDef`, re-exported as `dbK`. `immediate: !0`, `argumentHint: "<question>"`.

**Fix in v2.1.101:** Per `by_version/v2.1.101.md` section 33, `/btw` was writing the **entire** conversation transcript to disk on every invocation (presumably for context capture, but disastrous for long sessions). The fix narrows the write to only the latest turn's BTW content.

**Trade-offs:**

- Persistence of BTW exchanges is preserved (so the user can later look up what was asked), but storage cost now scales with the *number of /btw calls*, not transcript length.

---

### `/insights` — fix in v2.1.101 (and full registration in v2.1.112)

**What it does:** Generates a usage analytics report over the user's Claude Code sessions — session counts, message counts, duration, git commits, an "At a Glance" summary, common workflow patterns, and an HTML report file path.

**v2.1.88 state:** Present (`src/commands/insights.ts`, 3200 lines, ~113KB). Heavy module — loaded via a lazy shim in `commands.ts:192-198` to defer the cost until the user actually runs `/insights`.

**v2.1.112 location:**

- Primary registration: `chunks.190.mjs:2218-...`
- Alternate registration (used in main slash list): `chunks.191.mjs:303-316`
- Generator: `qeK` (`chunks.190.mjs:1772`) and `KeK` (`chunks.190.mjs:1920`)

**Key entry symbol:** `csY` -> `insightsCommandDef` (chunks.190 def), `rsY` -> `insightsCommandDef` (chunks.191 def, used in main `XH7` slash registry, identical shape).

**Fix in v2.1.101:** Per `by_version/v2.1.101.md` section 45, the response was sometimes missing the report-file link. Now always included.

**Trade-offs:**

- `disableModelInvocation: !0` (in chunks.191 version) — the model cannot decide to call `/insights` on its own. Why: the report is **user-facing analytics**, not a tool the model should chain.
- `progressMessage: "analyzing your sessions"` — long-running, so a progress hint exists.
- Two registration sites (chunks.190 + chunks.191) reflects the lazy-shim pattern: one definition gets the full handler, the other gets the wrapper that lazily imports the actual handler.

---

### `/agents` — tabbed layout in v2.1.98

**What it does:** Manages agent configurations. Tabs split into **Running** (active subagent instances with "View running instance" action) and **Library** (configured-but-not-running agents with "Run agent" action).

**v2.1.88 state:** `/agents` existed (`src/commands/agents/agents.tsx`, 11 lines wrapper, plus `agents/` directory of UI components) as a flat agent manager — no tabs.

**v2.1.112 location:** `chunks.187.mjs:2896-2903`.

**Key entry symbol:** `qiY` -> `agentsCommandDef`, re-exported as `BoK`. `type: "local-jsx"`.

**Trade-offs:**

- Tabs introduce a navigation step (user must press Tab to switch). The pre-tabs UI was a single list — simpler, but mixed "currently running" with "available" agents, which became confusing as users started running multiple subagents in parallel.
- "Running" tab queries live subagent state; "Library" reads from config + plugin marketplace catalog.

---

### `/setup-bedrock` — v2.1.92

**What it does:** Interactive wizard that reconfigures AWS Bedrock authentication, region, and per-model pins. Hidden unless `CLAUDE_CODE_USE_BEDROCK` is set.

**v2.1.88 state:** Absent. Bedrock setup required manual `aws configure`, env-var set, and `settings.json` model pinning.

**v2.1.112 location:** `chunks.183.mjs:450-461`.

**Key entry symbol:** `ecK` -> `setupBedrockCommandDef`. `isHidden` is a getter that re-reads `CLAUDE_CODE_USE_BEDROCK` every call (so toggling the env var mid-session updates visibility).

**Trade-offs:**

- Hidden when Bedrock isn't enabled — keeps the slash menu clean for non-Bedrock users (the vast majority).
- The wizard relaunches the CLI on completion (`execRelaunch()` at `chunks.183.mjs:477`) because the auth provider has to be re-initialized.

---

### `/setup-vertex` — v2.1.98

**What it does:** Same pattern as `/setup-bedrock` but for Google Vertex AI: authentication, project, region, model pins.

**v2.1.88 state:** Absent.

**v2.1.112 location:** `chunks.183.mjs:514-525`.

**Key entry symbol:** `YlK` -> `setupVertexCommandDef`. Hidden unless `CLAUDE_CODE_USE_VERTEX` is set.

**Trade-offs:** Identical pattern to Bedrock: hidden by env-var, wizard handles credential bootstrap, relaunches CLI on completion. Sharing the pattern across providers means each new provider is roughly a copy-paste-plus-provider-specifics affair.

---

### `/setup-vertex` and `/setup-bedrock` improvements — v2.1.111

Per `by_version/v2.1.111-112.md` section 13:

1. Show actual `settings.json` path when `CLAUDE_CONFIG_DIR` is set (previously hard-coded `~/.claude/settings.json`).
2. Seed model candidates from existing pins on re-run (so editing existing config doesn't reset to defaults).
3. Offer "with 1M context" option for supported models.

The registration objects (`ecK`, `YlK`) are unchanged; improvements live inside the lazily-loaded modules (`tcK`, `zlK`).

---

### `/effort` (interactive slider) — v2.1.111

**What it does:** Sets effort level for model thinking budget. With no arg, opens an interactive slider over `[low|medium|high|xhigh|max|auto]`. With an arg (e.g. `/effort high`), sets directly.

**v2.1.88 state:** Source present (`src/commands/effort/effort.tsx`). Typed-arg only — `/effort` with no arg printed help; no slider.

**v2.1.112 location:** `chunks.189.mjs:1432-1444`.

**Key entry symbol:** `YtK` -> `effortCommandDef`. `argumentHint: "[low|medium|high|xhigh|max|auto]"`. `immediate` is a getter returning `Pu6()` (so the immediate-flag tracks the user's session preferences).

**Trade-offs:**

- Slider rather than list — visual maps to the *gradient* of effort. Discrete list would feel "click each option to compare"; slider feels "more or less."
- `xhigh` is silently downgraded to `high` for non-Opus-4.7 models via `modelSupportsXhigh` (`bt6` at `chunks.80.mjs`).
- Welcome banner at first launch of Opus 4.7 says `"Welcome to Opus 4.7 xhigh! · /effort to tune speed vs. intelligence"` (`chunks.181.mjs:1672, 1685, 1687`) — surfaces the slider directly in onboarding.

---

### `/less-permission-prompts` — v2.1.111

**What it does:** Scans recent transcripts (JSONL session files at `~/.claude/projects/<sanitized-cwd>/*.jsonl`) for common read-only Bash and MCP tool calls, then proposes a prioritized allowlist to add to project `.claude/settings.json` under `permissions.allow`.

**v2.1.88 state:** Absent.

**v2.1.112 location:** `chunks.211.mjs:1401-1419`.

**Key entry symbol:** `p25` -> `lessPermissionPromptsRegistrar` (calls `MA({...})`). The full prompt body is `WjA` (`chunks.211.mjs:1421`), a multi-thousand-character spec covering:

1. Transcript location and JSONL parsing.
2. Frequency extraction (handles `sudo`, `timeout`, pipes, `&&`, env-var prefixes).
3. Read-only filter (no mutations, no arbitrary code execution).
4. Auto-allowed exclusion (commands the harness already auto-allows are dropped from the proposal — sourced from `src/tools/BashTool/readOnlyValidation.ts` and `src/utils/shell/readOnlyCommandValidation.ts`).
5. Pattern form selection (`Bash(git log *)` vs `Bash(foo)`).
6. Ranking by count, capping at 20.
7. Markdown table presentation to user.
8. Merge into project `.claude/settings.json` (not user-global, not `settings.local.json`).

**Trade-offs:**

- Implemented as a **skill** (`MA({...})`) rather than a `local-jsx` command. Rationale: the work is model-driven (filter, classify, dedupe against existing rules) — not deterministic enough to be plain JS.
- `userInvocable: !0` — but the prompt explicitly warns against allowlisting interpreters, shells, package runners, or anything that grants arbitrary code execution.
- Drops counts below ~3 to avoid polluting the allowlist with one-off invocations.
- Writes to the project's `.claude/settings.json` rather than user-global to keep team policy contained per-repo.

---

## Footnote: source paths (v2.1.88)

For each command, the v2.1.88 source path (if any) is:

- `/buddy`: `src/commands/buddy/index.js`, gated at `src/commands.ts:118-124` (feature flag `BUDDY`)
- `/powerup`: absent
- `/release-notes`: `src/commands/release-notes/release-notes.ts` (text-dump form)
- `/setup-bedrock`: absent
- `/agents`: `src/commands/agents/agents.tsx`, `src/commands/agents/index.ts`
- `/setup-vertex`: absent
- `/team-onboarding`: absent
- `/btw`: `src/commands/btw/btw.tsx`, `src/commands/btw/index.ts`
- `/insights`: `src/commands/insights.ts`
- `/loop`, `/proactive`: `src/skills/bundled/loop.ts` (bundled-skill form); `/proactive` not present
- `/recap`: absent (auto-summary code at `src/services/awaySummary.ts`, `src/hooks/useAwaySummary.ts`)
- `/undo`: absent as alias (`/rewind` at `src/commands/rewind/`)
- `/focus`: absent as command (Ctrl+O chord only)
- `/tui`: absent (env-var `CLAUDE_CODE_NO_FLICKER` introduced v2.1.89)
- `/ultrareview`: `src/commands/review.ts` (export gated by `isUltrareviewEnabled`)
- `/effort`: `src/commands/effort/effort.tsx` (typed-arg form)
- `/less-permission-prompts`: absent

## Related symbols

> Symbol mappings:
> - [symbol_index.md](symbol_index.md) — central v2.1.112 index (the project uses a single index, not the four-file split described in `CLAUDE.md`)
> - [symbol_additions_unit_17.md](symbol_additions_unit_17.md) — full symbol additions for this unit (per-command tables with file:line and type)

Quick reference for the registration symbol of each command:

- `/ultrareview` -> `ulK` (chunks.183.mjs:2168), gated by `wW6` (`isUltrareviewEnabled`)
- `/recap` -> `LaY` (chunks.189.mjs:2782), handler `yaY`
- `/rewind` (+ `/undo`, `/checkpoint`) -> `jiY` (chunks.188.mjs:142)
- `/focus` -> `FoY` (chunks.189.mjs:1450)
- `/tui` -> `IcY` (chunks.185.mjs:444), handler `bcY` (chunks.185.mjs:397)
- `/team-onboarding` -> `jsY` (chunks.190.mjs:193)
- `/loop` (+ `/proactive`) -> `ojA` (chunks.212.mjs:874)
- `/powerup` -> `qQK` (chunks.180.mjs:1396)
- `/release-notes` -> `pFY` (chunks.180.mjs:1701)
- `/setup-bedrock` -> `ecK` (chunks.183.mjs:450)
- `/setup-vertex` -> `YlK` (chunks.183.mjs:514)
- `/agents` -> `qiY` (chunks.187.mjs:2896)
- `/btw` -> `wyY` (chunks.166.mjs:2982)
- `/insights` -> `rsY` (chunks.191.mjs:303, main registry) / `csY` (chunks.190.mjs:2218, generator-side)
- `/effort` -> `YtK` (chunks.189.mjs:1432)
- `/less-permission-prompts` -> `p25` (chunks.211.mjs:1401)
- `/buddy` -> (not compiled into v2.1.112 build; source-only)
