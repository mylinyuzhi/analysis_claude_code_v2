# Skill System Module (10_skill_system) — v2.1.143 → v2.1.156

## TL;DR — the skill-system delta in 30 seconds

The skill subsystem in 2.1.156 is architecturally the same as 2.1.142 (frontmatter loader,
the `Skill` tool, the slash-command dispatcher, inline vs `context: fork` execution, the
memoized skill loaders). This window adds **five** orthogonal deltas, all layered on top of
that unchanged foundation:

| Version | Delta | Change |
|---------|-------|--------|
| 2.1.152 | Feature | **Two mid-session skill-reload entrypoints.** The `/reload-skills` local command (`Zzz`/`Gzz`) and the SessionStart hook field `reloadSkills: true` (`$U` consumer) both funnel into one shared reload primitive — `clearSkillListingCaches` (`_C`) → `resetConditionalSkillState` (`Bo`) → `skillReloadEmitter.emit()` (`Xc.emit`) — that busts every memoized loader cache so the next pull re-walks the skill dirs from disk. Closes a cold-start gap the 2.1.142 chokidar watcher could not cover (a hook that `mkdir`s a brand-new `.claude/skills/` dir). |
| 2.1.152 | Feature | **`disallowed-tools` skill/slash-command frontmatter.** The subtractive twin of `allowed-tools`: removes tools for the active turn only. Two spellings (`disallowed-tools` + canonical `disallowedTools`), both parsers normalize via `fc` onto one record field. Applied two ways — inline `c28` union into `alwaysDenyRules.command`, or a forked `disallowed_tools` permission layer (`D0$`/`T6`/`fV8`) — and **cleared on the next user message** via `c28` replace in `processUserInput` (`fI8`). |
| 2.1.145 | Bugfix | **`context: fork` self-reinvoke loop fixed.** A new gate in the Skill-tool validator (errorCode 9, `tengu_skill_tool_fork_recursion_blocked`) uses the `spawnedBySkill` breadcrumb — set at fork launch, threaded through the `WS` subagent runner, inherited as `spawnedBySkill ?? activeSkill` — to refuse a forked skill whose body re-invokes itself, telling the model to execute the body directly. |
| 2.1.154/156 | Feature + Bugfix | **`effort:` frontmatter gains `xhigh`; status-bar fix.** `EFFORT_LEVELS` (`dN`) grew to `["low","medium","high","xhigh","max"]`. A skill/agent's `getEffort`/`effort` becomes a `kind:"effort"` permission layer (inline) or is baked into the forked base agent. The 2.1.156 fix makes `buildHookStatusEnv` (`w5`) walk `permissionLayers` so the displayed effort matches the runtime resolver `k3` (including the silent `xhigh→high`/`max→high` downgrade). |
| 2.1.154 | Feature | **Three bundled skill bodies updated.** `/simplify` is now cleanup-only (4 parallel Agent-tool review agents, "not hunting for bugs"); `/code-review` is a *bundled* skill (`ultra→ultrareview` alias, `getEffort`); `/claude-api` gained Opus 4.8 + 4.7→4.8 migration guidance (docs shipped as bundled `files`, routed to `shared/model-migration.md`, `tengu_claude_api_skill_loaded` telemetry). All three register through one front door, `registerBundledSkill` (`bA`). |

Everything else — frontmatter parsing for the other fields, `userInvocable`/`disableModelInvocation`
semantics, the 5-pass body render pipeline, the listing budget, `skillOverrides`, the
`/skills` dialog, conditional `paths:` activation — is identical to 2.1.142 modulo
obfuscated renames.

---

## Overview

A **skill** is a markdown file with YAML frontmatter that the user (`/skill-name`) and/or
the model (via the `Skill` tool, `ZX = "Skill"`) can invoke. The body is rendered (arg
substitution, `${CLAUDE_SKILL_DIR}` / `${CLAUDE_SESSION_ID}` / `${CLAUDE_EFFORT}`,
`!command` fences) and injected as a user message. Two execution shapes persist from prior
versions:

- **Inline** (default) — the expanded prompt is pushed into the *current* conversation; the
  skill shares the live `toolPermissionContext`, so its tool denials and effort overrides
  must be applied to that live context and reset per turn.
- **Forked** (`context: fork`) — the skill body becomes the *prompt* of a child subagent
  (`buildForkedSkillContext`, `D0$`) with its own token budget; its restrictions ride as a
  declarative `permissionLayers` array that is discarded with the child.

This module's 2.1.143–156 deltas all attach to those two shapes. The unifying mechanism
the window introduces/extends is the **`permissionLayers` array**: a per-turn list of
`{ kind }` records (`allowed_tools`, `disallowed_tools`, `effort`, `model`, `avoid_prompts`)
each reduced by its own resolver — `applyPermissionLayers` (`T6`) for tools,
`resolveEffortFromLayers` (`k3`) for effort — and rebuilt every turn so overrides
self-expire. Both the `disallowed-tools` field and the `effort:` field are members of this
one design.

```
                  SKILL-SYSTEM 2.1.143–156 DELTAS (over the unchanged loader)
 ============================================================================

  ┌─ DISCOVERY / CACHING ──────────────────────────────────────────────────┐
  │  memoized loaders:  L2 (list) → BL → sH9 → gDz → nd6 (reads SKILL.md)   │
  │                     zRH (plugin)  Kd6 (bundled)  RDH (async)            │
  │  RELOAD primitive (2.1.152, NEW entrypoints):                          │
  │     _C() clear caches → Bo() reset conditional state → Xc.emit()        │
  │       ▲                                   ▲                             │
  │   /reload-skills (Zzz/Gzz)        SessionStart reloadSkills ($U/OP$)    │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ INVOCATION (Skill tool ZX / slash command) ──────────────────────────┐
  │  validateInput gate chain → Gate 3 (NEW 2.1.145):                      │
  │     type=="prompt" && context=="fork" && spawnedBySkill==name → BLOCK  │
  │  resolve effort = getEffort?.(args) ?? effort                          │
  └────────────────────────────────────────────────────────────────────────┘
                          │ inline                         │ fork
                          ▼                                ▼
  ┌─ PERMISSION LAYERS (per turn, self-expiring) ─────────────────────────┐
  │  inline: c28 union → alwaysDenyRules.command   contextLayers:          │
  │          { kind:"effort", effort } (Skill.call)   { kind:"disallowed_  │
  │  reset:  fI8 → c28 replace (next message)          tools",… } (D0$)     │
  │  resolve: T6 (tools) · k3 (effort) · w5 (status-bar display, 2.1.156)  │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ BUNDLED BODIES (one registrar bA) ───────────────────────────────────┐
  │  /simplify (vO9, body Ehz)  /code-review (Y18/zO9)  /claude-api (tSz)   │
  │  4 Agent agents, no bugs    ultra→ultrareview        files→disk docs    │
  │                             getEffort                 Opus 4.8 migration │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop, Tools, State, Subagent, Memoize
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skills, Effort, Hooks, Compact, CLI
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions, Telemetry, Prompt, Model
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands, UI, Plugin
> - This module's additions: [symbol_additions_v2_1_156_skill_system.md](../00_overview/symbol_additions_v2_1_156_skill_system.md)

Key symbols across this module (full table in the additions file):

- `reloadSkillsCommandHandler` (`Zzz`) — `/reload-skills` handler; before/after name diff (cli_inner_pretty.js:521237)
- `RELOAD_SKILLS_COMMAND` (`Gzz`) — the `/reload-skills` local-command descriptor (cli_inner_pretty.js:521262)
- `runSessionStartHooks` (`$U`) — fires the reload chain on any hook's `reloadSkills` (cli_inner_pretty.js:270637)
- `clearSkillListingCaches` (`_C`) / `resetConditionalSkillState` (`Bo`) / `skillReloadEmitter` (`Xc`) — the shared reload primitive (cli_inner_pretty.js:545345 / 413487 / 270624)
- `loadSkillsForList` (`L2`) — memoized list; re-walks disk on cache-miss (cli_inner_pretty.js:545823)
- `COMMON_FRONTMATTER_SCHEMA` (`GL5`) — holds `disallowed-tools` + canonical `disallowedTools` (cli_inner_pretty.js:184480)
- `normalizeToolList` (`fc`) / `parseToolSpecList` (`IS`) — frontmatter tool-list normalizers (cli_inner_pretty.js:443196 / 442850)
- `applyToolDenyRules` (`c28`) — union/replace of `alwaysDenyRules.command` (cli_inner_pretty.js:395738)
- `processUserInput` (`fI8`) — the per-message `c28` replace that clears skill denials (cli_inner_pretty.js:590814)
- `buildForkedSkillContext` (`D0$`) / `applyPermissionLayers` (`T6`) / `addDenyRulesToContext` (`fV8`) — the forked deny-layer path (cli_inner_pretty.js:452910 / 453162 / 452899)
- `EFFORT_LEVELS` (`dN`) — `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009)
- `resolveEffortFromLayers` (`k3`) / `buildHookStatusEnv` (`w5`) — effort runtime authority + the status-bar fix (cli_inner_pretty.js:453183 / 552312)
- `registerBundledSkill` (`bA`) — the single bundled-skill front door (cli_inner_pretty.js:524187)
- `SIMPLIFY_SKILL_BODY` (`Ehz`) / `CODE_REVIEW_SKILL_NAME` (`Y18`) / `registerClaudeApiSkill` (`tSz`) — the three bundled bodies (cli_inner_pretty.js:601378 / 211646 / 612027)
- `SKILL_TOOL_NAME` (`ZX`) / `AGENT_TOOL_NAME` (`sq`) — `"Skill"` / `"Agent"` (cli_inner_pretty.js:216282 / 185637)

---

## Module Structure (v2.1.143–156 additions)

| Document | Purpose |
|----------|---------|
| [skill_reload_midsession.md](./skill_reload_midsession.md) | **2.1.152 mid-session reload.** The `/reload-skills` command (handler `Zzz`, descriptor `Gzz`, before/after name diff) and the SessionStart `reloadSkills:true` hook field (`$U` consumer), the shared cache-invalidation primitive (`_C` → `wu`/`vG8`/`Cw4`/`DRH`, `Bo` → `LG8`/`PG8`/`_RH`, `Xc.emit`, lazy `L2` re-read), why two entrypoints share one primitive, and the cold-start gotcha the 2.1.142 chokidar watcher could not cover |
| [skill_disallowed_tools.md](./skill_disallowed_tools.md) | **2.1.152 `disallowed-tools` frontmatter.** Dual schema spellings, both parsers normalizing via `fc` onto `disallowedTools`, the two runtime application paths (inline `c28` union into `alwaysDenyRules.command` vs the forked `D0$` `disallowed_tools` permission layer applied by `T6`/`fV8`), and the cleared-on-next-message semantics (`c28` replace in `fI8`). Cross-validated: only the `--disallowedTools` CLI flag and agent-def `disallowedTools` existed in 2.1.88; the per-skill frontmatter field is NEW |
| [skill_fork_recursion_guard.md](./skill_fork_recursion_guard.md) | **2.1.145 `context: fork` self-reinvoke fix.** The validator's fork-recursion guard (errorCode 9, `tengu_skill_tool_fork_recursion_blocked`) using the `spawnedBySkill` breadcrumb — set at fork launch, threaded through the `WS` subagent runner, inherited as `spawnedBySkill ?? activeSkill`, read in the guard — plus the gate-ordering analysis and the defense-in-depth prompt rule. NEW post-2.1.88 |
| [skill_effort_frontmatter.md](./skill_effort_frontmatter.md) | **2.1.143–156 effort delta.** The new `xhigh` level in `EFFORT_LEVELS` (`dN`), how `getEffort`/`effort` flows into a `kind:"effort"` permission layer (inline `contextLayers` + forked base agent), and the 2.1.156 status-bar fix where `buildHookStatusEnv` (`w5`) walks `permissionLayers` to override the displayed effort to match `k3`, including the silent `xhigh`/`max`→`high` downgrade |
| [bundled_skill_bodies.md](./bundled_skill_bodies.md) | **2.1.154 bundled bodies.** The registrar `bA` (record shape, files loader, `getEffort`/lazy-description pass-through); `/simplify` (cleanup-only, 4 parallel Agent agents); `/code-review` (bundled skill via Skill+Agent tools, `ultra→ultrareview` alias, `getEffort`); `/claude-api` (files-based docs, `tengu_claude_api_skill_loaded`, Opus 4.8 + 4.7→4.8 migration routed to `shared/model-migration.md`). The review *algorithm* is deferred to module 45 |

---

## How the five deltas interact

The deltas cluster along the two execution shapes and the one shared mechanism:

**The `permissionLayers` spine.** `disallowed-tools` (a `disallowed_tools` layer) and
`effort:` (an `effort` layer) are siblings on the same per-turn `permissionLayers` array,
built in the same place (the inline `Skill.call` contextLayers, the forked `D0$` /
`forkSlashCommand`). The 2.1.156 status-bar fix exists precisely because the *display*
(`w5`) had to start replicating the same layer fold the runtime (`k3`) already did. Reading
`skill_disallowed_tools.md` and `skill_effort_frontmatter.md` together shows the uniform
design: each layer kind is reduced by its own resolver, ignored by the others, and rebuilt
(hence self-expiring) per turn.

**The fork shape.** `buildForkedSkillContext` (`D0$`) is the hub touched by three of the
five docs: it builds the `disallowed_tools`/`allowed_tools` layers
(`skill_disallowed_tools.md`), it renders the skill body into the subagent prompt that the
fork-recursion guard protects (`skill_fork_recursion_guard.md`), and its caller bakes the
forked effort into the base agent (`skill_effort_frontmatter.md`).

**The cache/discovery shape.** `skill_reload_midsession.md` is the one delta on the
*discovery* side rather than the *invocation* side — it busts the memoized loaders so a
re-walk picks up newly-installed skills. It is independent of the permission-layer work but
shares the same memoize substrate (`v8`/`cx8` `.cache.clear()`).

**The bundled bodies** (`bundled_skill_bodies.md`) consume the other deltas: `/code-review`
uses `getEffort` (the effort delta), and all bundled skills inherit the `disallowedTools`
pass-through that `bA` added. This is why `bA` is the natural reading anchor — every other
delta shows up as a field on the record it builds.

---

## Reading Order

1. **[skill_reload_midsession.md](./skill_reload_midsession.md)** — start here: it maps the
   memoized loader topology (`L2`/`BL`/`sH9`/`gDz`/`nd6`, the plugin/bundled loaders) that
   every other doc references, and introduces the shared-primitive discipline.
2. **[skill_disallowed_tools.md](./skill_disallowed_tools.md)** — introduces the
   `permissionLayers` mechanism (inline `c28` vs forked `D0$`/`T6`/`fV8`) and the per-turn
   reset, which the effort doc then reuses.
3. **[skill_effort_frontmatter.md](./skill_effort_frontmatter.md)** — the sibling layer
   kind (`effort`) on the same array, plus the `xhigh` enum change and the status-bar fix;
   easiest to follow right after the disallowed-tools layer mechanics.
4. **[skill_fork_recursion_guard.md](./skill_fork_recursion_guard.md)** — depends on
   understanding `D0$` (the fork body-as-prompt) from docs 2–3; covers the `spawnedBySkill`
   breadcrumb and the validator gate chain.
5. **[bundled_skill_bodies.md](./bundled_skill_bodies.md)** — the concrete payoff: the
   three shipped skills that exercise the registrar, `getEffort`, and the `files`
   mechanism. Defers the `/code-review` review algorithm to module 45.

---

## Cross-references

- **Hooks** — the `reloadSkills` hook field from the hook-plumbing angle, alongside
  `sessionTitle`: `../11_hooks/session_start_title_and_reload_skills.md`
- **Code review** — the `/code-review` review *algorithm* (multi-angle finder loop, ultra
  cloud review, `--fix`/`--comment`): `../45_code_review/`
- **Opus 4.8 + effort** — the model-side `xhigh`/effort-default selection and the model-id
  map: `../43_model_opus48/`
- **Permission policy** — the `alwaysDenyRules.command` channel that skill denials,
  `--disallowedTools`, and `/permissions` rules all share: `../37_permission_policy/`
- **2.1.142 baseline** — frontmatter contract, lifecycle, listing budget, `${CLAUDE_EFFORT}`:
  `../../../claude_code_v_2.1.142/analyze/10_skill_system/`
