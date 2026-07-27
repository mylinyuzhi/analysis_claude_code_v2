# 41 — Hooks (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). Baseline
`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`, always tagged `(193)`.

## The shape of this window

Across 25 releases the hook system received **one new event** and **nine repairs**. Not one repair adds
a capability; all of them restore a distinction the harness had lost:

- a hook *timeout* from a *user interrupt* (`.210`)
- a *stream teardown* from a *hook crash* (`.212`)
- a *list matcher* from a *regex matcher* (`.195`)
- a *fork* from a *resume* (`.214`)
- an *exit code* from a *parse failure* (`.214`)
- a *trusted origin* from a *reachable one* (`.218`)
- a *value* from *executable syntax* (`.207`)

Seven of the nine are **single-expression edits** — one added conjunct, one added argument, one added
character in a regex class. That is the profile of a mature subsystem, and it means the analysis work is
locating the changed expression, not describing a mechanism. Where a bullet's headline literal is
carryover, this module says so and finds the narrower delta instead.

**Two findings the foundation pass did not have:**

1. **`.212` is anchorable.** The scoping pass recorded it UNANCHORED (`continue: !1` 0/0, only
   `hookSpecificOutput`/`stopReason` count drift). Both halves have 220-only strings:
   `Stop hook cancelled (abort or stream teardown)` (220=2 / 193=0, `:336369`/`:336714`) and the
   `PreToolUse` stop-reason constants `bVy`/`UAd` (`:401111-401113`, 220=1/193=0 each).
2. **Two undocumented hardenings** ship in the same code with no changelog bullet: async-rewake JSON
   *salvage* (`pxu`, `:216665`, 220=1/193=0) and a spawn-failure de-duplication latch
   (`spawnFailed` 220=3/193=0, `surfacedHookSpawnFailures` 220=2/193=0).

---

## Documents

| Doc | Covers | Releases |
|---|---|---|
| [`directory_added_hook.md`](directory_added_hook.md) | the net-new `DirectoryAdded` event end to end: seven registration tables, the dispatcher, both call sites and their three-way failure asymmetry | `.219` |
| [`matching_and_exit_codes.md`](matching_and_exit_codes.md) | matcher semantics, `if:` conditions, exit-code 2, and the four `catch` blocks that decide who caused an outcome | `.195` `.199` `.210` `.212` `.214`×3 |
| [`hook_trust_and_origin.md`](hook_trust_and_origin.md) | the five gates a hook must clear; per-origin trust for agent frontmatter hooks; `${user_config.*}` shell-injection refusal | `.207` `.218` |

**Suggested reading order:** `matching_and_exit_codes.md` §0 (the three-layer map) →
`directory_added_hook.md` (the only place a whole event is visible at once) → back to the rest of
`matching_and_exit_codes.md` → `hook_trust_and_origin.md`.

**Cross-module dependency:** the `.214` `dir/**` bullet is one call site of a function documented in
[`../38_permissions/rule_matching_and_glob_semantics.md`](../38_permissions/rule_matching_and_glob_semantics.md) §1.
Read that first; `matching_and_exit_codes.md` §2 covers only the hook half (`Cze`'s
`yap(gap(n), !0)` at `:528541`) and deliberately does not restate the matcher internals.

---

## Per-bullet ledger

Every changelog bullet in the `.195`→`.220` window that mentions hooks. `220 / 193` is a `grep -c` run
against both bundles; every "Anchor" line number was read in the 2.1.220 bundle.

### Owned by this module

| Bullet (abridged) | Ver | Verdict | Anchor (2.1.220) | 220 / 193 | Doc section |
|---|---|---|---|---|---|
| `DirectoryAdded` hook after `/add-dir` or SDK `register_repo_root` | `.219` | **NET_NEW** | enum `:49396`; dispatcher `a2t` `:518817`; registry `:519444`; switch `:520412`; matcher set `:522099`; call sites `:655138`, `:847256` | `DirectoryAdded` 20 / **0** | [`directory_added_hook.md`](directory_added_hook.md) all |
| ↳ *sub-claim*: `register_repo_root` is part of the addition | `.219` | **PARTIAL — control request PRE-EXISTED** | 193: schema `:701207`, throw `:706932`, dispatch `:707272` | `register_repo_root` 15 / **3** | [`directory_added_hook.md`](directory_added_hook.md) intro, §4 |
| Agent frontmatter hooks require the agent file's own folder to be trusted | `.218` | **NET_NEW** | `MTo` `:342023`; `OTo` `:342046`; call sites `:344417`, `:762237` | `tengu_agent_hooks_origin_untrusted` 1 / **0** | [`hook_trust_and_origin.md`](hook_trust_and_origin.md) §1 |
| Hooks with exit code 2 not blocking when stdout JSON fails schema validation | `.214` | **NET_NEW (one conjunct)** | `if (Ae && Te.status !== 2)` `:521127`; 193 twin `if (ue)` `:590440` | `schema validation` 18 / 12 (**misleading — unrelated growth**) | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §3 |
| Single-segment `dir/**` hook `if:` conditions match only `<cwd>/dir` | `.214` | **NET_NEW (one argument)** | `yap(gap(n), !0)` `:528541` inside `Cze` `:528537`; 193 inline strip `:586292` | `r.includes("/") \|\| !t` 1 / **0** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §2 |
| `SessionStart` reports source `"fork"` instead of `"resume"` | `.214` | **NET_NEW (6 sites, bullet implies 1)** | `:320414`; title filter `:319568`; UI values `:696524`; SDK enum `:835721` | `"fork" : "resume"` 3 / **1** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §7 |
| `continue:false` halt dropped mid-stream; infra errors as user rejections | `.212` | **NET_NEW — scoping pass said UNANCHORED** | `:336713`; `UAd`/`bVy` `:401111-401113`; 193 twins `:465876`, `:433324` | `Stop hook cancelled (abort or stream teardown)` 2 / **0** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §5 |
| Hook callback timeout misreported to the model as a user rejection | `.210` | **NET_NEW** | `:520739-520747`; 193 had **no catch** at `:590066` | `hook callback timed out after` 1 / **0** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §6 |
| Plugin hooks: `${user_config.*}` in shell-form commands rejected | `.207` | **NET_NEW (hooks site)** | refusal `:519966-519973`; detector `lor` `:214417`; 193 substituted at `:589421` | `plugin hook references ${user_config.*} in shell-form command` 1 / **0** | [`hook_trust_and_origin.md`](hook_trust_and_origin.md) §2 |
| `SessionStart`/`Setup`/`SubagentStart` hid stderr on exit 2 | `.199` | **NET_NEW (wrapper only — attachment type is carryover)** | `Pur` `:520551`; call sites `:319556`, `:319604`, `:344398`; 193 consumer had no `blockingError` branch `:240808` | `hook_non_blocking_error` **24 / 23** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §4 |
| Hyphenated matchers (`code-reviewer`, `mcp__brave-search`) now exact-match | `.195` | **NET_NEW (one character)** | class `:520221`; warning `:520215`; 193 class `:589636` | `/^[a-zA-Z0-9_\|, -]+$/` 2 / **0** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §1 |
| Bg agent notifications fire the `Notification` hook (`agent_needs_input`/`agent_completed`) | `.198` | **NET_NEW — ledgered here, analysed in `36_background_agents`** | matcher values grew 6→8 `:696492-696500` (193 `:549252-549258`); emitter `:802112`/`:802120`; gate `:802140` | `agent_needs_input` 2 / **0** | ledger only (see below) |

### Undocumented deltas found while reading (no changelog bullet)

| Finding | Anchor | 220 / 193 | Doc section |
|---|---|---|---|
| Async-rewake hook JSON is now schema-validated with **field-level salvage** (193 used it raw) | `pxu` `:216665`, call `:216813`; 193 `d = f` at `:472853` | `async hook JSON output failed schema validation` 1 / **0** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §3 |
| Spawn failures de-duplicated once per `<event>:<command>` per process | `mip` `:520567`, guard `:521320`, tag `:520183` | `spawnFailed` 3 / **0**; `surfacedHookSpawnFailures` 2 / **0** | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §6 |
| `$To` deep-emptiness test replaces `e.hooks` truthiness at both frontmatter registration sites | `:342071`, used `:344416`, `:762227` | — (193 tested `e.hooks`, `:398688`/`:641513`) | [`hook_trust_and_origin.md`](hook_trust_and_origin.md) §1 |
| A hook `if:` on a **non-tool** event silently disables that hook (fail-closed, debug-log only) | `:520515` | — | [`matching_and_exit_codes.md`](matching_and_exit_codes.md) §2 |

### Hook-adjacent bullets owned by other modules (ledgered, not analysed here)

| Bullet (abridged) | Ver | Verdict | Anchor | 220 / 193 | Owner |
|---|---|---|---|---|---|
| Auto mode overriding a PreToolUse hook's `ask` — a hook `ask` now floors the decision | `.211` | NET_NEW | `hookAskFloor` `:400915` | 3 / **0** | [`../38_permissions/`](../38_permissions/) |
| Hook events not streaming during `SessionStart` in headless; workers idle-reaped mid-hook | `.204` | NET_NEW | `CLAUDE_RUNNER_ACTIVITY_FD` `:840835` (validated FIFO/socket liveness pipe; accessor `:32017`) | 3 / **0** | [`../51_headless_sdk/`](../51_headless_sdk/) |
| Bg sessions from a non-git dir unable to edit when a `WorktreeCreate` hook was configured | `.203` | UNANCHORED | `WorktreeCreate` 42 / 34 — the count drift is registry-table growth, not this fix | 42 / 34 | [`../36_background_agents/`](../36_background_agents/) |
| @-mentions attaching nothing after file-modifying hooks (+3 unrelated fixes in one bullet) | `.216` | UNANCHORED | — no hook-side literal; the `@`-mention attach path carries no new string | — | [`../48_accessibility_ui/`](../48_accessibility_ui/) |
| Memory leaks incl. "async hook output retained after backgrounding" (1 clause of 4) | `.208` | **NOT ISOLATED** | `asyncRewake` 6/6, `flushPendingAsyncRewakeHooks` 1/1, `ASYNC_REWAKE_FLUSH_TIMEOUT_MS` 1/1 (`_ip = 30000`, `:521998`) — every async-hook literal is carryover; the retention fix carries no new string | 6 / 6 | [`../50_performance/`](../50_performance/) |
| `ultracode` keyword firing on non-human input (webhook payloads, relayed PR comments) | `.210` | NET_NEW | `isHumanTypedPrompt` `:516671` | 2 / **0** | [`../40_system_prompt/`](../40_system_prompt/) — *not a hook bullet; the word "webhook" is the only overlap* |

**Coverage:** 11 hooks-primary bullets, all accounted for — **10 anchored NET_NEW, 1 partially
over-claimed by the changelog** (`register_repo_root`), **0 unanchored**. Plus 4 undocumented deltas
and 6 adjacent bullets routed to their owners (4 anchored elsewhere, 2 honestly unresolved).

---

## Carryover traps in this theme — do not write these up as new

| Literal | 220 | 193 | Why it looks like a delta |
|---|---|---|---|
| `hook_non_blocking_error` | 24 | **23** | The attachment type is long-standing. Only the `Pur` wrapper (`:520551`) that mints one with a synthetic `exitCode: 2` is new. `.199`'s real delta is 12 lines. |
| `workspace trust not accepted` | 7 | **7** | The session-wide trust gate `GYe` (`:519618`) is untouched at all seven sites. `.218` adds a **different** gate at a different level (`MTo`, `:342023`). |
| `CLAUDE_PLUGIN_OPTION_` | 3 | **2** | The env-var injection loop (`:520000-520004`) is byte-identical to 193 `:589449-589453`; the schema hint is identical too. The third 220 site is the `.207` refusal message. |
| `schema validation` | 18 | **12** | Six new sites, none of them the `.214` hook fix — they are MCP, tasks, mailbox, and settings code. The hook change is `&& Te.status !== 2` at `:521127`, which adds no literal. |
| `tengu_sdk_hook_callback_timeout` | 4 | **3** | Three of four sites are the pre-existing tool-hook paths (193 `:433058`, `:433136`, `:433330`). Only the generic-runner site (`:520741`) is `.210`. |
| `preventContinuation` | 36 | 32 | Broad growth across unrelated call sites. `.212`'s delta is a `catch`-block rewrite that changes *which value* is returned, not how many sites mention it. |
| `[end-turn] … block discarded … no model re-invoke` | 2 | **2** | Byte-identical (`:336355`/`:337215` vs `:465518 (193)`). This is *not* `.212`; the `.212` change is 350 lines further down in the same function. |
| `Permission rule syntax to filter when this hook runs` (the `if:` schema) | 1 | **1** | The `if:` field and its description are carryover; only its *path semantics* changed (`.214`). |
| `Hook script appears to be missing` | 1 | **1** | The exit-2 missing-script carve-out (`:521250-521288`) predates this window. |
| `DEFAULT_HOOK_TIMEOUT_MS` = `600000` | `Hm` `:317052` | `tp` `:396991` | Same value; the identifier was re-mangled. Classic `_CONVENTIONS` trap #1. |
| `Converting Stop hook to SubagentStop` / `Registered N frontmatter hook(s) from` | 1 / 1 | **1 / 1** | The frontmatter registration function is byte-identical 193→220. `.218` is a guard in front of it. |

---

## The 2.1.220 hook system in one page

**31 events** (`lB`, `:49367-49398`), each with exactly one dispatcher in `HOOK_EVENT_REGISTRY`
(`AF_`, `:519419-519449`).

**Five hook types**, all sharing `if:` / `timeout`: `command` (`:58552`), `prompt` (`:58595`),
`mcp_tool` (`:58615`), `http` (`:58630`), `agent` (`:58650`).

**Four sources**, merged by `collectHooksForEvent` (`DF_`, `:520317`) in this order: managed
(`policySettings`) → settings → plugins → session registry (agent + skill frontmatter). The
`managedHooksOnly` path (`:520318-520322`) short-circuits to policy settings alone and honours
`disableAllHooks`.

**Two runners**: `lM` (`:520573`) streams progress into a turn; `EM` (`:521555`) awaits a batch for
ambient events (`ConfigChange`, `CwdChanged`, `FileChanged`, `DirectoryAdded`).

**Selection** is two-stage: `matcher` (a tool name, a source, a trigger, a filename — see the switch at
`:520364-520417`) then `if:` (a permission-rule string evaluated against the tool input, `:520503-520517`).

**Result vocabulary**: `success` / `non_blocking_error` / `blocking` / `cancelled`, plus the side
channels `additionalContexts`, `systemMessage`, `permissionBehavior`, `updatedInput`,
`preventContinuation` + `stopReason`, `suppressOriginalPrompt`, `watchPaths`, `sessionTitle`,
`terminalSequence`, `displayContent`, `metrics`.

**Exit-code contract** (command hooks, `:521126-521340`): `0` = success; `2` = blocking (or
non-blocking-with-stderr for the three events with no block consumer); anything else = non-blocking
error; unparseable stdout = non-blocking error **unless** the exit code is 2.

**Five gates** before any of that runs — see
[`hook_trust_and_origin.md`](hook_trust_and_origin.md) §0.

---

## Not covered

- **`WorktreeCreate` / `WorktreeRemove` / `TeammateIdle` / `TaskCreated` / `TaskCompleted` /
  `MessageDisplay` / `Elicitation*` mechanics.** No changelog bullet in this window touches them and
  none showed a literal delta on a spot check; they are pre-existing surface.
- **`.203`'s `WorktreeCreate`-in-a-non-git-dir bugfix and `.216`'s @-mention bullet** — no hook-side
  literal exists for either. Recorded as unanchored above rather than guessed at.
- **`.208`'s "async hook output retained after backgrounding"** — every async-hook literal is
  carryover (6/6, 1/1, 1/1). Isolating it needs a statement-level diff of the rewake registry, which
  belongs with the rest of that four-part memory bullet in `50_performance`.
- **`hookAskFloor` (`.211`)** — fully owned by `38_permissions`; the anchor is recorded above so a
  reader searching this directory finds the pointer.
- **`MF_` (the SDK callback invoker) and the control-protocol frames it uses** — read only at its call
  site; the wire contract belongs to `51_headless_sdk`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> All symbols discovered by this module are staged in
> [symbol_additions_v2_1_220_hooks.md](../00_overview/symbol_additions_v2_1_220_hooks.md)
> for merge into `symbol_index_core_features.md`.

Key entry points for this module:
- `HOOK_EVENT_NAMES` (`lB`, `:49367`) - the 31-event enum every registration loop iterates
- `HOOK_EVENT_REGISTRY` (`AF_`, `:519419`) - event → dispatcher map
- `runHooks` (`lM`, `:520573`) - streaming runner
- `executeHooksOutsideREPL` (`EM`, `:521555`) - batch runner for ambient events
- `getMatchingHooks` (`q8s`, `:520359`) - matcher + `if:` selection
- `collectHooksForEvent` (`DF_`, `:520317`) - the four-source merge
- `spawnHookCommand` (`q2o`, `:519921`) - env construction, exec-vs-shell, `child_process.spawn`
- `executeDirectoryAddedHooks` (`a2t`, `:518817`) - the one new dispatcher in this window
- `isAgentHookOriginTrusted` (`MTo`, `:342023`) - the one new gate in this window
