# Changelog Analysis: Claude Code v2.1.88 → v2.1.112

## Overview

This document analyzes the major changes between Claude Code **v2.1.88** (source-available baseline at `claude-code-kim/src/`) and **v2.1.112** (obfuscated `chunks.*.mjs`). The window covers 16 numbered releases (v2.1.89 through v2.1.112, with several skipped numbers), 700+ individual changelog items.

For per-version item-level diffs see [`../by_version/`](../by_version/).

---

## 1. Release Cadence

| Version | Items | Theme |
|---------|------:|-------|
| v2.1.89 | ~30 | Defer hooks, NO_FLICKER (env-var), autocompact circuit-breaker |
| v2.1.90 | ~16 | `/powerup`, plugin marketplace hardening, perf wins |
| v2.1.91 | ~13 | MCP `_meta` annotations, plugin `bin/`, `disableSkillShellExecution` |
| v2.1.92 | ~21 | `forceRemoteSettingsRefresh`, Bedrock wizard, `/cost` breakdown |
| v2.1.94 | ~27 | Mantle, default effort `medium → high`, Slack MCP UX |
| v2.1.96 | 1 | Bedrock 403 hotfix |
| v2.1.97 | ~36 | NO_FLICKER stabilization wave + Bash hardening + focus view |
| v2.1.98 | ~48 | Vertex wizard, Monitor tool, Perforce mode, PID-namespace sandbox |
| v2.1.101 | ~46 | `/team-onboarding`, OS CA trust, `/ultraplan` auto-env |
| v2.1.105 | ~36 | PreCompact blocking hooks, plugin `monitors`, EnterWorktree `path` |
| v2.1.107 | 1 | Thinking-hint timing |
| v2.1.108 | ~25 | `/recap`, 1-hour prompt cache, model-invokable built-in skills |
| v2.1.109 | 1 | Rotating thinking indicator |
| v2.1.110 | ~33 | `/tui` GA + `/focus` split + push notification tool |
| v2.1.111 | ~35 | **Opus 4.7 + xhigh + /effort slider + /ultrareview + auto-mode GA** |
| v2.1.112 | 1 | "Opus 4.7 unavailable" auto-mode hotfix |

The cadence is roughly bi-weekly with occasional skipped numbers (no v2.1.93, .95, .99, .100, .102-.104, .106). Skipped numbers reflect internal builds that didn't ship.

---

## 2. Architectural Themes

### 2.1 Effort/Model Hierarchy Evolution

**v2.1.88** had 4 levels: `low/medium/high/max`, with `max` gated to Opus 4.6.

**v2.1.112** has 5 levels: `low/medium/high/xhigh/max`, with `xhigh` gated to **Opus 4.7** and silent downgrade to `high` for other models.

```
v2.1.88                 v2.1.112
┌──────────┐           ┌──────────┐
│   low    │           │   low    │
├──────────┤           ├──────────┤
│  medium  │           │  medium  │
├──────────┤           ├──────────┤
│   high   │           │   high   │
├──────────┤           ├──────────┤
│   max    │           │  xhigh   │  ← NEW (Opus 4.7 only)
│ (4.6 only)│           ├──────────┤
└──────────┘           │   max    │
                       │(4.6/4.7) │
                       └──────────┘
```

The default effort *also* changed:
- v2.1.88: `medium` for everyone
- v2.1.112: `high` for API-key/Bedrock/Vertex/Foundry/Team/Enterprise (v2.1.94); `xhigh` for Opus 4.7 (v2.1.111); `medium` for Pro/Max on Opus 4.6

This is a meaningful **cost-policy shift**: enterprise tiers pay-per-token implicitly opt into more thinking; subscription tiers stay conservative.

---

### 2.2 NO_FLICKER → /tui Renderer Graduation

A multi-version arc:

| Version | State |
|---------|-------|
| v2.1.88 | No alt-screen support, only main-screen rendering |
| v2.1.89 | `CLAUDE_CODE_NO_FLICKER=1` env var introduced (opt-in flag) |
| v2.1.97 | Focus view (Ctrl+O) and many bug fixes for NO_FLICKER |
| v2.1.98-2.1.108 | Continued bug fixes (CJK copy, scrollback, mouse-wheel, etc.) |
| v2.1.110 | `/tui` slash command, `tui` setting in settings.json, `/focus` split from Ctrl+O, `autoScrollEnabled` setting |

The pattern is **classic feature graduation**: env-var opt-in → community testing + bug fixes → graduate to settings + first-class command. By v2.1.110 the env var still works but is officially demoted to "compat" status.

**Code path** in v2.1.112 (`chunks.65.mjs:1491-1505`):
1. `CLAUDE_CODE_NO_FLICKER=0/1` (env override)
2. tmux integration mode (`-CC`) → force-disable
3. `settings.json` `tui` key → user preference
4. Feature gate `tengu_pewter_brook` → staged rollout fallback

---

### 2.3 Permission System Hardening

Five distinct security passes across the window:

**v2.1.89:**
- Edit/Read symlink resolution (allow rules check resolved target)

**v2.1.90:**
- `.husky` added to protected dirs (acceptEdits)
- PowerShell tool: trailing `&` bypass, `-ErrorAction Break` debugger hang, archive TOCTOU, parse-fail deny degradation

**v2.1.97-98 (largest pass):**
- Backslash-escaped flags (Bash perm bypass)
- Compound commands (`safe && unsafe`) bypass
- `/dev/tcp/...` redirects
- Env-var prefix gating (only known-safe vars allowed without prompting)
- `grep -f FILE` outside cwd
- `--dangerously-skip-permissions` not silently downgrading to acceptEdits
- `permissions.deny` overriding hook `permissionDecision: ask`
- DNS-cache commands removed from auto-allow (privacy)
- JS prototype-property rule names

**v2.1.110:**
- "Open in editor" hardened against command injection
- `PermissionRequest` hook `updatedInput` re-checked against deny rules
- `setMode:'bypassPermissions'` respects `disableBypassPermissionsMode`

**v2.1.111:**
- `cd <project> && <safe>` no longer prompts (UX win, not a regression)

**Pattern:** Each pass tightens a class of bypass (escape characters, compounds, redirects, env prefixes, hook downgrades). The fixes accumulate — each version closes a few specific holes that came up in red-team testing or user reports.

---

### 2.4 Resume / Session Reliability

`--resume` was the most-fixed feature in this window. By section:

**v2.1.89:**
- `-p --resume` hangs on >64KB deferred tool input
- `-p --continue` not resuming deferred tools

**v2.1.97:**
- `--resume <name>` opening uneditable
- Filter reload wiping search state
- File-edit diffs disappearing for files >10KB

**v2.1.101 (architectural):**
- Anchor selection prefers live conversation branch (was anchoring on dead-ends)
- Chain recovery doesn't bridge into unrelated subagent
- Crash on missing `file_path` in persisted Edit/Write result

**v2.1.105:**
- Resume hint not printing on exit
- Multiple `/resume` picker UX cleanups

**v2.1.108-110:**
- `--resume <id>` losing custom name and color set via `/rename`
- `--resume` truncating sessions with self-referencing messages
- `--resume`/`--continue` resurrecting unexpired scheduled tasks
- Tab-completing `/resume` immediately resuming arbitrary session

The pattern: the team did a major **architectural fix** in v2.1.101 (anchor selection algorithm), then iterative **picker UX** improvements in subsequent versions.

---

### 2.5 Compact Pipeline Maturity

| Version | Change |
|---------|--------|
| v2.1.89 | Autocompact **dual** circuit-breakers (consecutive-failure + rapid-refill, both threshold = 3) |
| v2.1.94 | `CLAUDE_CODE_MAX_CONTEXT_TOKENS` honors `DISABLE_COMPACT` |
| v2.1.97 | Compaction writing duplicate multi-MB subagent transcripts on retry (fixed) |
| v2.1.105 | **PreCompact hook can BLOCK compaction** (exit 2 / `{decision:"block"}`) |
| v2.1.108 | `/recap` slash command (uses awaySummary infrastructure) |

**Cross-validation note:** The v2.1.89 changelog says "thrash loop" but the v2.1.112 source has **two** independent circuit-breakers in `chunks.159.mjs:1379-1428`:
- `wLK = 3` consecutive *failures* (catches crashing compactions)
- `jLK = 3` consecutive *rapid refills* within `a_7 = 3` turn window (catches successful-but-pointless compactions)

PreCompact-hook-blocked errors are *swallowed without incrementing the failure counter* — using the feature shouldn't burn the breaker budget.

The v2.1.105 PreCompact change is the most significant: it adds **hook authority over the compaction process**, letting plugins veto a compaction (e.g., "I haven't snapshotted yet, wait one turn"). Combined with the v2.1.89 dual breakers, the compaction subsystem went from "best-effort" to "robust under buggy hooks and pathological context shapes."

---

### 2.6 Plugin Platform Deepening

Plugins gained capabilities across the window:

| Version | Capability |
|---------|------------|
| v2.1.91 | `bin/` executables resolved as bare commands |
| v2.1.91 | `disableSkillShellExecution` (security knob) |
| v2.1.94 | `keep-coding-instructions` frontmatter (output styles) |
| v2.1.94 | Plugin skill `"./"` uses frontmatter `name` (not directory basename) |
| v2.1.97 | `/agents` Running tab showing live subagent instances |
| v2.1.97 | `/reload-plugins` picks up plugin-provided skills without restart |
| v2.1.105 | **`monitors` manifest key** (auto-armed background watch scripts) |

The `monitors` manifest is the most architecturally significant: plugins can declare *persistent* background monitors that the host arms automatically. Each entry has:
- `name` (string, unique-within-plugin) — for dedup on reload
- `command` (string) — shell command, supports `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `${user_config.*}`, `${ENV_VAR}` substitution
- `description` (string) — shown in task panel
- `when` — `"always"` (default; arm at session start) or `"on-skill-invoke:<skill>"` (arm when that skill dispatches)

Same trust tier as hooks (unsandboxed). Schema enforces `Monitor names must be unique within a plugin` via a refinement on `XO1` (the array schema).

---

### 2.7 Cloud Features Maturing

| Version | Feature | Status |
|---------|---------|--------|
| v2.1.88 baseline | `/ultraplan` (existed) | Required manual web setup |
| v2.1.101 | `/ultraplan` auto-creates default cloud env | Friction removed |
| v2.1.101 | `/team-onboarding` | Local-only, deterministic |
| v2.1.110 | Push notification tool (mobile via Remote Control) | Cloud-augmented |
| v2.1.110 | Remote Control supports `/context`, `/exit`, `/reload-plugins` | Coverage expanded |
| v2.1.111 | `/ultrareview` cloud code review | $10-20/run, opt-in |

These features mark Claude Code's transition from "CLI tool" to "CLI + cloud platform." `/ultrareview` is the first cloud feature with explicit billing — previously cloud was bundled into the subscription.

---

### 2.8 New Tools Introduced

| Version | Tool | Purpose |
|---------|------|---------|
| v2.1.98 | **Monitor** | Stream events from background scripts |
| v2.1.110 | **PushNotification** | Send terminal + mobile notifications |

Both ship as **deferred tools** (loaded lazily via `ToolSearch`). The pattern is to expand the model's I/O capabilities without bloating the default tool set.

---

### 2.9 Slash Commands Added/Removed

**Added:**
- v2.1.89: `/buddy` (seasonal — `feature('BUDDY')` flag in 2.1.88; not present in 2.1.112 source = excluded from non-April builds)
- v2.1.90: `/powerup`
- v2.1.105: `/proactive` (alias for `/loop`)
- v2.1.108: `/recap`, `/undo` (alias for `/rewind`)
- v2.1.110: `/tui`, `/focus`
- v2.1.101: `/team-onboarding`
- v2.1.111: `/ultrareview`, `/less-permission-prompts` (skill)

**Removed:**
- v2.1.92: `/tag`, `/vim` (vim now toggled via `/config`)

**Cross-validation note on `/buddy`:** The 2.1.88 source has `claude-code-kim/src/buddy/` with `companion.ts`, `CompanionSprite.tsx`, etc., gated behind `feature('BUDDY')` in `commands.ts:118-124`. A grep for `"buddy"` (case-insensitive) in 2.1.112 `chunks.*.mjs` finds only `chunks.190.mjs:87` ("onboarding buddy" inside `/team-onboarding` prompt) and `chunks.75.mjs:1102+` (PlistBuddy macOS command). The companion code is **not compiled into v2.1.112** — consistent with seasonal April-1st rollout.

The trend: pruning niche slash commands while adding mid-level ones that map to user workflows.

---

## 3. Notable Reverts

Track of "fixes that got rolled back":

- **v2.1.110 → v2.1.111:** Cap on non-streaming fallback retries reverted because it traded long waits for outright failures during API overload.

The team explicitly learned that *outright failure* is worse than *waiting longer*.

---

## 4. Settings Schema Evolution

New settings added to `settings.json` schema:

| Setting | Version | Purpose |
|---------|---------|---------|
| `forceRemoteSettingsRefresh` | v2.1.92 | Fail-closed managed-settings refresh |
| `disableSkillShellExecution` | v2.1.91 | Disable `!command` in skills/plugins |
| `tui` | v2.1.110 | Renderer mode (default/fullscreen) |
| `autoScrollEnabled` | v2.1.110 | Auto-scroll in fullscreen mode |
| `effortLevel: xhigh` | v2.1.111 | xhigh tier in enum |
| `showThinkingSummaries` | v2.1.89 | Opt-in to thinking summaries |

---

## 5. Environment Variables Added

| Env Var | Version | Purpose |
|---------|---------|---------|
| `CLAUDE_CODE_NO_FLICKER` | v2.1.89 | Alt-screen rendering opt-in (later → `tui` setting) |
| `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` | v2.1.90 | Preserve marketplace cache on git pull failure |
| `CLAUDE_CODE_PERFORCE_MODE` | v2.1.98 | Edit/Write fail with `p4 edit` hint |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | v2.1.98 | Linux PID-namespace isolation |
| `CLAUDE_CODE_SCRIPT_CAPS` | v2.1.98 | Per-session script invocation cap |
| `CLAUDE_CODE_USE_MANTLE` | v2.1.94 | Bedrock+Mantle |
| `MCP_CONNECTION_NONBLOCKING` | v2.1.89 | Skip MCP wait in headless |
| `ENABLE_PROMPT_CACHING_1H` | v2.1.108 | 1-hour prompt cache TTL (replaces `_BEDROCK`) |
| `FORCE_PROMPT_CACHING_5M` | v2.1.108 | Force 5-minute TTL |
| `CLAUDE_CODE_USE_POWERSHELL_TOOL` | v2.1.111 | Windows PowerShell tool opt-in |
| `CLAUDE_CODE_CERT_STORE` | v2.1.101 | CA store source (`bundled`,`system`) |
| `CLAUDE_CODE_TUI_JUST_SWITCHED` | v2.1.110 | Internal — relaunch hint |
| `OTEL_LOG_RAW_API_BODIES` | v2.1.111 | Full API body logs to OTEL |

---

## 6. Hook Surface Changes

| Hook Event | v2.1.88 | v2.1.112 | Verified delta |
|------------|---------|----------|----------------|
| `PreToolUse` | `allow`/`deny`/`ask` (`permissionBehaviorSchema = z.enum(['allow','deny','ask'])`) | `allow`/`deny`/`ask`/`defer` (chunks.193.mjs:34-130) | Schema added 4th enum; error message widened |
| `PermissionDenied` | wired but feature-flagged behind `TRANSCRIPT_CLASSIFIER` in `toolExecution.ts:1075` | feature-flag graduated; message simplified from "this command is now approved..." to "you may retry this tool call." | Wording change; flag removed |
| `PreCompact` | observable (`hookInput.trigger`); cannot block | **can block** with exit 2 / `{decision:"block"}`; dispatcher checks `H.blockedBy` and swallows error without burning failure counter (chunks.159.mjs:1568, chunks.101.mjs:1568) | Block path added; counter exemption added |
| `UserPromptSubmit` | no `sessionTitle` return | can return `sessionTitle` (v2.1.94) | New return field |

---

## 7. Performance Wins

Tracked perf improvements:

| Version | Win |
|---------|-----|
| v2.1.90 | Per-turn `JSON.stringify` of MCP tool schemas eliminated |
| v2.1.90 | SSE transport: O(n²) → O(n) for large frames |
| v2.1.90 | SDK long-conversation transcript writes: quadratic → linear |
| v2.1.91 | `stripAnsi` perf via `Bun.stripANSI` |
| v2.1.92 | Write tool diff for large files: 60% faster |
| v2.1.101 | Memory leak in virtual scroller fixed |
| v2.1.101 | `/resume` all-projects view loads in parallel |
| v2.1.108 | Language grammars loaded on demand (saves tens of MB RSS) |

The recurring theme is **quadratic-to-linear** algorithmic fixes in long-session paths.

---

## 8. Bedrock / Vertex / Provider Auth

A long arc of provider-auth fixes:

| Version | Fix |
|---------|-----|
| v2.1.94 | Bedrock Sonnet 3.5 v2: use `us.` inference profile ID |
| v2.1.94 | Bedrock SigV4 + empty-string env vars (GitHub Actions case) |
| v2.1.96 | Bedrock 403 with `AWS_BEARER_TOKEN_BEDROCK` (regression hotfix) |
| v2.1.97 | MCP OAuth `oauth.authServerMetadataUrl` on token refresh |
| v2.1.97 | 429 retries — exponential backoff applied as minimum |
| v2.1.101 | Bedrock SigV4 + `ANTHROPIC_AUTH_TOKEN`/headersHelper conflict |
| v2.1.105 | `/model` Bedrock non-US regions persisting invalid `us.*` IDs |
| v2.1.108 | Subscriber `DISABLE_TELEMETRY` falling back to 5min cache TTL |
| v2.1.111 | 429 errors referencing `status.claude.com` for Bedrock/Vertex (now provider-specific URLs) |

The scattering of fixes reflects the **complexity of provider-aware auth** — each provider has its own auth scheme and quirks.

---

## 9. UX Improvements (Cumulative)

| Category | Improvements |
|----------|--------------|
| **Resume picker** | Default to current dir, parallel project loading, Ctrl+A all-projects, project/worktree/branch labels, exclude `claude -p`/SDK sessions |
| **Footer** | Indicators stay on mode-row, transient notifications, focus toggle |
| **Slash menu** | `/skills` token-count sort, near-miss typo suggestions, `/feedback` explanation when unavailable |
| **Input** | `Ctrl+U` clears all + `Ctrl+Y` restore, `Ctrl+L` full redraw, multi-line history navigation |
| **Output** | Cedar highlighting, single-line write truncation, blockquote bar, plugin marketplace stale warning |
| **Errors** | Provider-specific status URLs, near-miss suggestions, rate-limit reset times, refusal explanations |

---

## 10. Notable Code-Pattern Changes

### "Tool description carries behavioral guidance"

The Push Notification tool description (added v2.1.110) is unusually long:
> "...err toward not sending one. Don't notify for routine progress, or to announce you've answered something they asked seconds ago and are clearly still watching, or when a quick task completes..."

This is **prompt-engineering-via-tool-spec**: the model learns *when not to use* the tool from the description itself. Pattern reused for:
- Monitor tool ("must match all terminal states — silence looks identical to still-running")
- Edit tool (in v2.1.91, suggesting shorter `old_string` anchors)
- Perforce mode error message ("Do not chmod the file writable; that bypasses Perforce tracking")

### "Defer hooks for headless mode"

The v2.1.89 `defer` decision is a clean way to handle "I don't have enough context to decide yet." The `claude -p --resume` workflow re-invokes the hook each cycle. This is a **state-machine pattern** baked into hooks.

### "Feature gate → setting → command graduation"

The path `feature gate → env var → settings.json → slash command` plays out for:
- NO_FLICKER → `tui` setting → `/tui` (v2.1.89-2.1.110)
- 1h prompt cache (allowlist gate → env var) (v2.1.108)
- Default effort medium → high (gate → policy) (v2.1.94)

The team's standard rollout is: ship behind a flag, observe telemetry, graduate to settings, eventually give it a command for power-users.

---

## 11. The "Big Three" Architectural Changes

If you only remember three things about v2.1.88 → v2.1.112:

### A. Opus 4.7 + xhigh
Five-tier effort scheme with model-specific defaults; xhigh tuned for Opus 4.7's thinking capability; auto mode GA on Max subscribers.

### B. Hook Surface Expansion
PreToolUse `defer` (v2.1.89), PermissionDenied with `{retry: true}` (v2.1.89), PreCompact `{decision:"block"}` (v2.1.105), UserPromptSubmit `sessionTitle` return (v2.1.94). Hooks moved from "advisory" to "authoritative" in compaction and permission paths.

### C. NO_FLICKER → /tui Graduation
A multi-version feature graduation with bug-fix-driven stabilization. By v2.1.110 the alt-screen renderer is GA via the `tui` setting, with `/tui` as the convenient command-form switch.

---

## 12. Cross-Validation Findings

This section captures discrepancies between the **changelog text** and the **actual v2.1.112 source code** that surfaced during cross-validation. The per-version files were updated to reflect verified findings; this section is the audit trail.

| Changelog claim | Verified finding | Resolution |
|-----------------|------------------|------------|
| v2.1.89: "thrash circuit-breaker" | Two breakers, not one — consecutive-failure (`wLK=3`) and rapid-refill (`jLK=3`, `a_7=3`-turn window) | v2.1.89.md §3 expanded with both breakers |
| v2.1.89: "Added PermissionDenied hook" | The hook event existed in 2.1.88 already; what was new was (a) graduation from `feature('TRANSCRIPT_CLASSIFIER')` flag, (b) message text simplification | v2.1.89.md §4 corrected with both 2.1.88 and 2.1.112 message text |
| v2.1.89: "/buddy April 1st easter egg" | Code lives in 2.1.88 (`src/buddy/`) behind `feature('BUDDY')`; **not compiled into 2.1.112 source** — seasonal rollout | v2.1.89.md §5 + changelog §2.9 note |
| v2.1.89: "PreToolUse defer" | Confirmed: 2.1.88 schema is `z.enum(['allow','deny','ask'])`; 2.1.112 has 4-way switch + widened error message | Verified |
| v2.1.94: Default effort medium → high | Confirmed in `IF1` (chunks.80.mjs:2811-2819) — but with carve-outs: Pro/Max on Opus 4.6 stay at `medium`; Pro/Max on turtle_carbon-gated 3P models stay at `medium`; everyone else → `high` | v2.1.94.md §2 expanded with full `IF1` and the resolution chain `wy6` |
| v2.1.94: Subscriber check helpers | Originally noted `JB`=Max, `ch`=Pro — **inverted**. Verified `chunks.61.mjs`: `JB() = MK() === "pro"`, `ch() = MK() === "max"` | symbol_index.md corrected; v2.1.94.md updated |
| v2.1.105: PreCompact blocking | Confirmed via `chunks.101.mjs:1568` (`if (H.blockedBy)`); error prefix is exactly `"Compaction blocked by PreCompact hook"` (`GI6`) and is matched by the breaker's catch to *avoid* incrementing failure count | v2.1.89.md (counter exemption) and v2.1.105.md (PreCompact) cross-link |
| v2.1.105: monitor manifest | Schema has stricter shape than originally summarized — `name`/`command`/`description`/`when` (with `"on-skill-invoke:<skill>"` arm trigger), strictObject, name uniqueness refined | v2.1.105.md §3 expanded with full `wi5` schema |
| v2.1.110: `/focus` is just session state | Actually persists to **app config** as well — `briefTranscript` lives in both AppState and config | v2.1.110.md §2 corrected to show dual-write |
| v2.1.110: PushNotification gate | Double-gated: `tengu_amber_sentinel` server-side flag (`I18`) AND `agentPushNotifEnabled` per-user opt-in | v2.1.110.md §3 expanded |
| v2.1.111: `/ultrareview` description | Description is a *getter* (`get description()`), not a static string — re-reads cost/runtime estimates from preflight on every render | v2.1.111-112.md §8 corrected |
| Original chunk for autocompact dispatcher | Originally stated `chunks.107.mjs`; actually `chunks.159.mjs:1379-1428` (function `QkK`) | All cross-references updated |

### Verification Method

For each architectural claim:
1. Greppe target string/identifier in `chunks.*.mjs`
2. Read surrounding 30-60 lines of context in the matching chunk
3. If a constant or threshold is referenced, look up its definition (e.g. `wLK = 3`)
4. If a feature is "added," check the 2.1.88 baseline to confirm it didn't already exist
5. If a feature is "feature-flagged," check both the gate condition and (where possible) whether the flag value is observable in 2.1.112 source

Approximately 60% of changelog items were verified directly. The remaining 40% (mostly small UX fixes — keybindings, error message wording, layout tweaks) were verified by *exclusion* — the absence of a similar string in 2.1.88 source establishes the change happened, even when the corresponding 2.1.112 code wasn't located.

---

## 14. Where to Look for Specifics

For per-version detail with code excerpts and obfuscated→readable mapping:

- [`../by_version/v2.1.89.md`](../by_version/v2.1.89.md)
- [`../by_version/v2.1.90.md`](../by_version/v2.1.90.md)
- [`../by_version/v2.1.91.md`](../by_version/v2.1.91.md)
- [`../by_version/v2.1.92.md`](../by_version/v2.1.92.md)
- [`../by_version/v2.1.94.md`](../by_version/v2.1.94.md)
- [`../by_version/v2.1.96-97.md`](../by_version/v2.1.96-97.md)
- [`../by_version/v2.1.98.md`](../by_version/v2.1.98.md)
- [`../by_version/v2.1.101.md`](../by_version/v2.1.101.md)
- [`../by_version/v2.1.105.md`](../by_version/v2.1.105.md)
- [`../by_version/v2.1.107-109.md`](../by_version/v2.1.107-109.md)
- [`../by_version/v2.1.110.md`](../by_version/v2.1.110.md)
- [`../by_version/v2.1.111-112.md`](../by_version/v2.1.111-112.md)

For the symbol mapping (obfuscated → readable for the names in these analyses), see [`symbol_index.md`](symbol_index.md).
