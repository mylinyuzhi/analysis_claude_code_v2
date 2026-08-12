# Workspace trust for `claude agents`

## Version result

The interactive agents view exists in 2.1.220, but its startup path mounts the view without invoking the
normal workspace trust dialog. In 2.1.227:

- `agentsTrustDecision` and `ensureAgentsWorkspaceTrust` are new dedicated functions at
  `cli_inner_pretty.js:962545-962609`;
- both the commander handler (`:962614-962689`) and direct fast path (`:978885-978886`) await the trust
  step before bypass-permission consent and before mounting the agents view;
- accepting trust refreshes project-dependent plugin, feature-flag, and policy state that was intentionally
  not initialized while the directory was untrusted.

This directly anchors the 2.1.225 changelog addition.

### Agents-view Trust Bootstrap

**What it does:** Makes `claude agents` apply the same directory trust boundary as the main interactive
`claude` entry path before project configuration or agent actions become active.

**How it works:**
1. `agentsTrustDecision` (`kuH`, `:962544-962547`) chooses one of three typed outcomes: `skip`, `trusted`,
   or `ask`.
2. CI, demo, and designated automation surfaces select `skip`. An already accepted, persistable workspace
   selects `trusted`; every other interactive workspace selects `ask`.
3. `ensureAgentsWorkspaceTrust` (`xuH`, `:962548-962601`) handles `ask` by loading the normal app-state and
   keybinding providers plus the standard `TrustDialog`, including discovered commands needed by the UI.
4. Startup waits on the dialog's `onDone` callback. Only after it closes does the function set the in-
   process trust latch.
5. It clears the plugin cache so project `.claude/skills` plugins skipped during pre-trust discovery are
   re-scanned.
6. GrowthBook is reset while pending exposures are preserved, then reinitialized; plan-slug collision
   state and the permission/policy snapshot are also rebuilt under the trusted context.
7. The already-trusted path sets the latch and initializes the same plan/policy state without rendering.
   The skip path captures policy state but retains its automation-specific trust semantics.
8. `agentsCommandHandler` (`IuH`, `:962614-962689`) and the direct agents fast path await this bootstrap
   before bypass-permission consent and view mounting.

**Why this approach:**
- `claude agents` is a separate fast startup route, so relying on the main REPL to have prompted earlier
  leaves a first-entry gap.
- Reusing the standard dialog keeps the persisted trust key, repository-root explanation, and user choice
  consistent across entry points.
- Post-trust reinitialization matters because merely flipping a Boolean would retain intentionally partial
  pre-trust plugin, flag, environment, and policy state.
- Automation surfaces need a non-dialog path to remain usable. The trade-off is different bootstrap
  semantics, made explicit by the typed decision rather than scattered environment checks.

**Key insight:** Trust acceptance is a phase boundary, not a UI acknowledgment. The new bootstrap reruns
every subsystem whose earlier result was intentionally incomplete while the workspace was untrusted.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `agentsTrustDecision` (`kuH`) - selects skip, already-trusted, or prompt behavior.
- `ensureAgentsWorkspaceTrust` (`xuH`) - renders/awaits trust and reinitializes trusted subsystems.
- `agentsCommandHandler` (`IuH`) - orders trust before consent and view mount.
