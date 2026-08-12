# 2.1.220 to 2.1.227 Module Coverage

## Result

Every numbered analysis module present in the 2.1.220 report has a corresponding 2.1.227 module with
current-build analysis. This is directory parity plus implementation parity: the target reports cite
2.1.227 symbols and line ranges rather than carrying forward 2.1.220 mangled names.

The target also contains three new modules for systems that became first-class in the 2.1.221-2.1.227
window: persistent goals, connected memory, and self-hosted runners.

## Baseline parity matrix

| Module | 2.1.227 current-build coverage | Status |
|---|---|---|
| `03_llm_core` | Query loop, streaming, tool-use scheduling, fallbacks, hooks, recovery, termination | Re-derived |
| `04_tools` | Registry, aliases, deferred loading, ToolSearch, validation, execution boundaries | Re-derived |
| `05_plan_mode` | Mode transition, plan-file policy, reconstruction, approval, workshop/prototype routes | Re-derived |
| `07_compact` | Triggering, budgets, summarization, transcript rewriting, 1M/unknown-model enforcement | Re-derived |
| `30_agent_team` | Team lifecycle, mailbox, roster, cross-session identity, pins, inbound policy | Re-derived |
| `31_auto_memory` | Recall, extraction, maintenance forks, scheduling, locking, persistence | Re-derived |
| `36_background_agents` | Admission, scheduling, process lifecycle, resume, worktrees, preservation | Re-derived |
| `38_permissions` | Rule engine, overlays, hooks, Bash/PowerShell analysis, auto mode, headless policy | Re-derived |
| `39_mcp` | Configuration, clients, startup, discovery, OAuth, tool calls, roots, diagnostics | Re-derived |
| `40_system_prompt` | Composition, reminders, compatibility framing, cache placement, origin policy | Re-derived |
| `41_hooks` | Event registry, trust, matching, execution, output precedence, async delivery | Re-derived |
| `42_workflow` | Definition parsing, VM hardening, scheduler, progress, journal resume, launch events | Re-derived |
| `43_slash_commands` | Catalog, precedence, parsing, dispatch, aliases, fuzzy/Unicode menu rendering | Re-derived |
| `44_telemetry` | Event planes, OTel, usage attribution, gateway spend, feature evaluation | Re-derived |
| `45_skills` | Discovery, loading, invocation policy, forks, plugins, archive install, marketplace policy | Re-derived |
| `46_todo_tasks` | V1/V2 tools, persistence, atomic claims, hooks, reminders, compatibility | Re-derived |
| `47_models` | Catalog, provider projection, policies, discovery, picker, thinking, fast mode | Re-derived |
| `48_accessibility_ui` | Screen reader, Focus folding, Vim state, emoji, rendering, clipboard, scrollback | Re-derived |
| `49_sandbox` | Policy normalization, backend wrapping, violations, credential masking, SigV4 repair | Re-derived |
| `50_performance` | Bounded caches, streaming I/O, LSP LRU, fork coalescing, compaction, rendering, drains | Re-derived |
| `51_headless_sdk` | Stream JSON, process I/O, controls, MCP readiness, state sync, CI forwarding | Re-derived |
| `52_code_review` | Command parsing, effort, route selection, adaptive agents, findings, cloud scope/posting | Re-derived |
| `53_subagent_limits` | Admission, depth, concurrency, budgets, worktree containment, result hardening | Re-derived |
| `54_remote_control` | Enablement, transport, recovery, history ownership, events, attachments, UI state | Re-derived |
| `55_auth_providers` | Provider/key precedence, OAuth, tier-aware flags, managed login, AWS, TLS transport | Re-derived |
| `56_chrome_ide` | Chrome relay/tools/files/setup, IDE controls, raw diffs, environment/work bridge | Re-derived |
| `57_api_reliability` | Transport normalization, retries, watchdogs, completion, connectivity, updates | Re-derived |

## Target-only modules

| Module | Why it is separate |
|---|---|
| `58_persistent_goals` | Adds the consent-aware `ProposeGoal` path and re-derives the goal Stop-hook lifecycle. |
| `59_connected_memory` | Adds connected-store list/read/write tools with validation and optimistic concurrency. |
| `60_self_hosted_runner` | Adds runner preflight, registration, lease supervision, isolated children, and operator tools. |

## What “re-derived” guarantees

- At least one substantive current-runtime document exists in each parity directory.
- Key algorithms are described with operations, branch conditions, design rationale, alternatives, and
  trade-offs.
- Obfuscated identifiers used by the reports are centralized in the four 2.1.227 symbol indexes.
- Focused changelog documents supplement rather than replace current architecture analysis.
- The 2.1.220 report is a comparison source; its obfuscated identifiers are never assumed valid in
  2.1.227.

## Evidence limitations

Only the 2.1.220 and 2.1.227 bundles are available. The report can prove the current 2.1.227
implementation and compare the two endpoints. For changes attributed to 2.1.221-2.1.226, the exact
intermediate release assignment comes from the supplied changelog unless a target-only asset or
literal makes the boundary independently visible.
