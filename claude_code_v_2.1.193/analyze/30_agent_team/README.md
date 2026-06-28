# 30 — Agent Team (v2.1.193 EXTEND): iTerm2 pin, `--effort` inheritance, stop attribution

> Delta module: `30_agent_team/` documents the **v2.1.183 → v2.1.193** change to the agent-team ("swarm") subsystem.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`).
> Every `cli_inner_pretty.js:<line>` citation is a **193** line unless explicitly tagged `(183)` (the v2.1.183 before-picture) or `(88)` (the v2.1.88 named-TS ancestor at `/lyz/codespace/3rd/claude-code/src`).
> BASELINE (read this for everything that carries over): the v2.1.178 implicit-team **redesign** tree [`../../../claude_code_v_2.1.183/analyze/30_agent_team/`](../../../claude_code_v_2.1.183/analyze/30_agent_team/README.md). Obfuscated names are re-mangled per build — a 183 obf name is **never** reused here; every symbol was re-derived by line in the 193 bundle.

---

## TL;DR — three surgical edits inside unchanged machinery

The v2.1.183 → 193 window touches the agent-team subsystem in **three** isolable, source-level places. None of them is an architecture change — they are surgical edits *inside* carryover machinery (the iTerm2 pane backend, the BackendRegistry detector, the pane-spawn command builders, the stop/notification path), all of which pre-date 183 (and most pre-date the 88 ancestor). The big structural change in this directory's history — the **v2.1.178 implicit-team redesign** (teams stopped being model-created; one implicit team per session; `team_name` deprecated; spawn folded onto the Agent tool's `name` param) — is **byte-identical carryover** in this window and is **not** re-derived here (see "Carryover" below; full analysis lives in the 183 tree).

The three 193-window deltas, in descending order of surface area:

1. **NET-NEW: `teammateMode: "iterm2"`** (2.1.186). A fourth, user-settable enum value that *forces* the iTerm2 pane backend, with a dedicated detection branch that throws two new, actionable errors when the environment can't satisfy it, plus an iterm2-aware auto-mode fallback hint. Full deep-dive: [`teammate_mode_iterm2.md`](./teammate_mode_iterm2.md).
2. **NET-NEW/REFINEMENT: `--effort` inheritance** (2.1.186). tmux/iTerm2-pane teammates now inherit the leader's live `effortValue` via a one-line `--effort <level>` push in the pane-spawn command builders, gated by the existing "unpin launch effort" flags. Full deep-dive: [`effort_inheritance.md`](./effort_inheritance.md).
3. **NET-NEW + FIX: stop attribution** (2.1.187). Stop notifications gain a `killedBy` axis (`user`/`parent`/`system`) and a rewritten message set — "finished" / "failed: …" / "was stopped by Claude|user" — replacing the old "came to rest" everywhere (notification + idle banner). Full deep-dive: [`stop_attribution.md`](./stop_attribution.md).

**Confidence:** HIGH for all three. Each headline string/field flips 0→present from 183 to 193 (and "came to rest" drops 4→0), and each is localized to a small, line-anchored region of carryover code.

---

## What changed at a glance

| # | Delta | Kind | 193 anchor | 183 before | Confidence |
|---|-------|------|------------|------------|:----------:|
| 1 | `teammateMode: "iterm2"` enum value + explicit detect branch + 2 warnings + fallback hint | **NET-NEW** (2.1.186) | `uhs`@54136; `kPe` branch@429192-429213; `iXp`@429964 | enum `Its`@`(183)`53727 lacks `"iterm2"`; parser@`(183)`695523 rejects it | high |
| 2 | Pane teammates inherit leader `--effort` | **NET-NEW / REFINEMENT** (2.1.186) | `pil`@428485 (push@428500); `Mil`@429445 (push@429456); callers@428615/429595/429710 | builder `F5a`@`(183)`421627 has no `effortValue`/`--effort` | high |
| 3 | Stop notification `killedBy` attribution + "finished"/"stopped" wording | **NET-NEW + FIX** (2.1.187) | `Eqe`@453792; `kht`@431759; TaskStop@431944; `GSe`@453871; async@384633; `LEo`@390965 | `killedBy`=0; "came to rest"=4 (`Eqe`@`(183)`445830, banner@`(183)`379344) | high |
| — | v2.1.178 implicit-team redesign (one implicit team, `team_name` deprecated, Agent-`name` routing) | **CARRYOVER — NOT a 193 delta** | schema@430391; jsdoc@698751+ | byte-identical to 183 | high |

---

## Carryover: the v2.1.178 implicit-team redesign is UNCHANGED in this window

The redesign that made this directory exist in the 183 tree — teams stopped being something the model *creates* (`TeamCreate`/`TeamDelete` gone), a session has exactly **one implicit team** named `session-<sessionId[:8]>`, and spawning a teammate folded entirely onto the Agent tool's `name` parameter (`team_name` deprecated & ignored) — is **byte-identical** between 183 and 193. This is an adversarially-confirmed *negative*: it is **not** a 193 delta.

Grep evidence (193 = 183):

| String | 183 | 193 |
|---|---:|---:|
| `single implicit team` | 4 | 4 |
| `Deprecated; ignored. The session has a single implicit team` | 1 | 1 |
| `@deprecated Sessions have a single implicit team` | 3 | 3 |

193 sites confirmed in the live bundle: the Agent `team_name` schema at `cli_inner_pretty.js:430391` (`team_name: A.string().optional().describe("Deprecated; ignored. The session has a single implicit team.")`) and the `@deprecated Sessions have a single implicit team…` jsdoc around `:698751+`. These match 183 exactly. **Do not attribute the implicit-team redesign, the master gate (`Sl`/`R7`), the file mailbox protocol, the SendMessage surface, the permission bridge, the coordinator/cross-session machinery, or the tmux `respawn-pane` mechanic to the 193 window** — all are 178-era (or older) carryover, fully analysed in the 183 tree. This module documents only the three surgical 193 edits above.

For the full unchanged subsystem (the implicit-team bootstrap, the Agent-tool spawn routing, the three spawn backends, the mailbox + control-message protocol, `SendMessage`, coordinator mode, the leader permission bridge, the in-process runner, and the background-task survival path), read the v2.1.183 tree — it is not re-derived here:
- [`../../../claude_code_v_2.1.183/analyze/30_agent_team/README.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/README.md) (index + before/after contrast)
- [`../../../claude_code_v_2.1.183/analyze/30_agent_team/implicit_team_and_agent_tool_spawn.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/implicit_team_and_agent_tool_spawn.md)
- [`../../../claude_code_v_2.1.183/analyze/30_agent_team/spawn_backends_and_tmux_fix.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/spawn_backends_and_tmux_fix.md) (the backend abstraction `teammate_mode_iterm2.md` extends)
- [`../../../claude_code_v_2.1.183/analyze/30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md)
- [`../../../claude_code_v_2.1.183/analyze/30_agent_team/coordinator_and_background_survival.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/coordinator_and_background_survival.md) (the "comes to rest" eviction lifecycle that `stop_attribution.md` re-words)
- [`../../../claude_code_v_2.1.183/analyze/30_agent_team/reconstructed_source/README.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/reconstructed_source/README.md) (full readable-source restoration of the whole swarm machine)

---

## Files in this module

```
30_agent_team/   (v2.1.193 — EXTEND tree; three surgical deltas on top of the 183 implicit-team redesign)
├── README.md                  ← you are here (index + at-a-glance + 178 carryover proof)
├── teammate_mode_iterm2.md    ← NET-NEW 2.1.186: the "iterm2" teammateMode enum value end-to-end —
│                                  uhs enum → schema/UI → --teammate-mode flag/choices/parser →
│                                  detectAndGetBackend (kPe) explicit branch → isInsideITerm2/isIt2CliReachable
│                                  gating → the two warning strings → the auto-mode fallback hint (iXp).
├── effort_inheritance.md      ← NET-NEW 2.1.186: buildInheritedCliFlags (pil/Mil) threading --effort from
│                                  getAppState().effortValue, gated by isLaunchEffortUnpinned (PIe);
│                                  pane-vs-in-process divergence + the upgrade gotcha.
└── stop_attribution.md        ← NET-NEW + FIX 2.1.187: the killedBy plumbing (stopTask default "user" →
                                   TaskStop tool "parent" → telemetry "system"), enqueueAgentNotification (Eqe)
                                   "finished"/"was stopped by Claude|user" wording, idle banner (LEo)
                                   "came to rest"→"finished", and the 88→183→193 wording history.
```

## Reading order

1. **This README** — the three-delta index + the 178 carryover proof.
2. **`teammate_mode_iterm2.md`** — the largest-surface delta (enum + branch + warnings + fallback).
3. **`effort_inheritance.md`** — read after the iTerm2 doc, since the `--effort` push lives in the same pane-spawn builders that target the iTerm2/tmux backends.
4. **`stop_attribution.md`** — orthogonal to spawn; read when investigating stop notifications, the TaskStop tool, or the `killedBy` telemetry.

For everything unchanged (the implicit-team redesign and the whole carryover spine), read the **v2.1.183 baseline** linked under "Carryover" — this tree deliberately does not re-derive it.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this README uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent/Tools/State; the TaskStop tool)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Agent Team / swarm** is the home module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Model/effort dial, Telemetry)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (CLI flags, settings UI, idle banner)
> - [../00_overview/symbol_additions_v2_1_193_agent_team.md](../00_overview/symbol_additions_v2_1_193_agent_team.md) — the granular v2.1.193 additions for this module

Headline functions/constants (re-derived v2.1.193 names; full per-doc lists in each file):

- `EXEC_MODE_ENUM` (obfuscated: `uhs`, `cli_inner_pretty.js:54136`) — `["auto","tmux","iterm2","in-process"]`; 183 `Its` lacked `"iterm2"`.
- `detectAndGetBackend` (obfuscated: `kPe`, `cli_inner_pretty.js:429186`) — BackendRegistry detector; explicit-iterm2 branch @429192-429213.
- `emitPaneFallbackHint` (obfuscated: `iXp`, `cli_inner_pretty.js:429964`) — one-shot auto-mode "force panes" hint; iterm2 arm new.
- `buildInheritedCliFlags` (obfuscated: `pil`, `cli_inner_pretty.js:428485`) / `buildInheritedSubagentCliFlags` (obfuscated: `Mil`, `cli_inner_pretty.js:429445`) — pane-spawn flag builders; `--effort` push @428500/@429456.
- `isLaunchEffortUnpinned` (obfuscated: `PIe`, `cli_inner_pretty.js:149794`) — gate on `--effort` forwarding.
- `enqueueAgentNotification` (obfuscated: `Eqe`, `cli_inner_pretty.js:453792`) — stop-notification builder; `killedBy` + "finished"/"was stopped by Claude|user".
- `stopTask` (obfuscated: `kht`, `cli_inner_pretty.js:431759`) — `killedBy="user"` default; TaskStop tool passes `"parent"` @431944.
- `teammateIdleBanner` (obfuscated: `LEo`, `cli_inner_pretty.js:390965`) — idle banner; "came to rest" → "finished" @390969.
