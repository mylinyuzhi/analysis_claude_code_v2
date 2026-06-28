# `--effort` inheritance — pane teammates run at the leader's effort

> **Type / version:** NET-NEW capability / REFINEMENT (2.1.186) — tmux/iTerm2-pane teammates now inherit the leader's live `--effort` level by threading it into the spawned child's command line, gated by the existing "unpin launch effort" config flags.
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Lines are **193** unless tagged `(183)` or `(88)`.
> **Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.

---

## TL;DR

When a teammate is spawned into a tmux or iTerm2 split-pane, it is launched as a **fresh `claude` child process** whose behavior is configured entirely by its argv. The pane-spawn command is assembled by a "build inherited CLI flags" helper that forwards the leader's permission mode, model, settings, plugins, and teammate-mode onto the child. 2.1.186 adds one line to that helper: if the leader has a string `effortValue` (and the launch-effort dial is unpinned), it pushes `--effort <level>` so the child runs at the **same effort** as its parent. In 183 the helper did not know about effort at all — the child fell back to its own default. This is a small, surgical insertion (one `push` line in two near-identical builders, fed by the leader's live app state at three call sites), but it changes observable behavior: a leader running at `xhigh`/`ultracode` now propagates that to its pane teammates.

---

## 1. The insertion: one `--effort` push in the flag builder

**What it does.** `buildInheritedCliFlags` (`pil`, `cli_inner_pretty.js:428485`; 88 name `utils/swarm/spawnUtils.ts:38`) constructs the argv suffix for a pane-hosted teammate from the leader's context. 2.1.186 destructures a new `effortValue` field and appends `--effort <value>` to the flag list when it is a string and the launch-effort gate is open.

**How it works.**

```javascript
// ============================================
// buildInheritedCliFlags - thread the leader's --effort into the teammate argv (NEW line)
// Location: cli_inner_pretty.js:428485-428510 (pil); mirrored at 429445-429456 (Mil)
// ============================================

// ORIGINAL (for source lookup):
function pil(e) {
  let t = [],
    { planModeRequired: n, permissionMode: r, skipModel: o, effortValue: s } = e || {};
  if (n);
  else if (r === "bypassPermissions") t.push("--dangerously-skip-permissions");
  else if (r === "acceptEdits") t.push("--permission-mode acceptEdits");
  else if (r === "auto") t.push("--permission-mode auto");
  if (!o) {
    let u = process.env.CLAUDE_CODE_SUBAGENT_MODEL;
    if (u && u !== "inherit") t.push(`--model ${ja([u])}`);
    else { let d = $y(); if (d) t.push(`--model ${ja([d])}`); }
  }
  if (typeof s === "string" && PIe()) t.push(`--effort ${s}`);   // ← NEW in 2.1.186
  let i = M1e() ?? P1e();
  if (i) t.push(`--settings ${ja([i])}`);
  /* ...plugin-dir / plugin-url... */
  let l = zRe();
  t.push(`--teammate-mode ${l}`);
  /* ...chrome flags... */
  return t.join(" ");
}

// READABLE (for understanding):
function buildInheritedCliFlags(opts) {
  let flags = [],
    { planModeRequired, permissionMode, skipModel, effortValue } = opts || {};
  // permission mode → flag
  if (planModeRequired) { /* no flag */ }
  else if (permissionMode === "bypassPermissions") flags.push("--dangerously-skip-permissions");
  else if (permissionMode === "acceptEdits") flags.push("--permission-mode acceptEdits");
  else if (permissionMode === "auto") flags.push("--permission-mode auto");
  // model → flag (unless skipModel; subagent-model env override wins)
  if (!skipModel) { /* CLAUDE_CODE_SUBAGENT_MODEL or resolved model */ }
  // ── NEW: forward the leader's effort, but only when the launch-effort dial is unpinned
  if (typeof effortValue === "string" && isLaunchEffortUnpinned()) flags.push(`--effort ${effortValue}`);
  // settings / plugins ...
  flags.push(`--teammate-mode ${getTeammateModeFromSnapshot()}`);  // (pil only)
  return flags.join(" ");
}

// Mapping: pil→buildInheritedCliFlags, e→opts, n→planModeRequired, r→permissionMode, o→skipModel,
//          s→effortValue, PIe→isLaunchEffortUnpinned, zRe→getTeammateModeFromSnapshot, ja→shellQuote
```

There are **two** near-identical builders and the `--effort` push is in both:
- `pil` (`cli_inner_pretty.js:428485`) — the **leader/pane** variant; it *also* pushes `--teammate-mode` (so the pane child knows how to host *its* own teammates). The `--effort` push is at `cli_inner_pretty.js:428500`.
- `Mil` (`cli_inner_pretty.js:429445`) — the **subagent-pane** variant; structurally the same flag list **without** the `--teammate-mode` push. Its `--effort` push is at `cli_inner_pretty.js:429456`.

**Why two builders, and why the same push in both.** The pane subsystem has two spawn shapes — a top-level teammate (which may itself coordinate teammates, hence `--teammate-mode`) and a plain subagent pane (which does not re-host teammates). Rather than parameterize one builder, the bundle carries two copies; the effort insertion had to be duplicated to cover both. The duplication is the cost; the benefit is that each spawn shape's flag list stays a flat, readable sequence with no conditional `--teammate-mode`.

---

## 2. The data source: the leader's live `effortValue`

**What it does.** The `effortValue` passed into the builder is read from the leader's **live app state** at spawn time, so a teammate inherits whatever effort the leader is *currently* running at (not a static config value).

**How it works.** Three call sites feed `effortValue` into the builders:

```javascript
// ============================================
// pane-spawn callers - feed the leader's live effortValue into the flag builder
// Location: cli_inner_pretty.js:428615 (pil); 429595 and 429710 (Mil)
// ============================================

// ORIGINAL (for source lookup):
// (a) leader/pane spawn — reads getAppState():
c = pil({
  planModeRequired: e.planModeRequired,
  permissionMode: Nr(this.context).mode,
  effortValue: this.context.getAppState().effortValue,
  skipModel: !!e.model,
});
// (b) and (c) subagent-pane spawns — read the runner context's effortValue:
x = Mil({ planModeRequired: l, permissionMode: u.toolPermissionContext.mode, effortValue: u.effortValue, skipModel: !!c });
// ...elsewhere...
C = Mil({ planModeRequired: l, permissionMode: u.toolPermissionContext.mode, effortValue: u.effortValue, skipModel: !!c });

// READABLE (for understanding):
flags = buildInheritedCliFlags({
  planModeRequired: req.planModeRequired,
  permissionMode: getPermissionContext(this.context).mode,
  effortValue: this.context.getAppState().effortValue,   // ← leader's CURRENT effort
  skipModel: !!req.model,
});
// subagent-pane variant pulls effortValue off the runner context (u.effortValue)

// Mapping: pil→buildInheritedCliFlags, Mil→buildInheritedSubagentCliFlags, Nr→getPermissionContext,
//          this.context.getAppState().effortValue→leader live effort, u.effortValue→runner context effort
```

So the leader/pane site (`pil`, `cli_inner_pretty.js:428615`) reads `this.context.getAppState().effortValue` — the live, model-selectable effort dial — while the two subagent-pane sites (`Mil`, `cli_inner_pretty.js:429595` and `:429710`) read `u.effortValue` off the spawning runner context. All three resolve to the leader's current effort.

> Note: the scout dossier listed two call sites; in the live 193 bundle there are **three** (`pil` once @428615, `Mil` twice @429595 and @429710). The `Mil` builder is invoked at two distinct subagent-pane spawn paths, both threading `effortValue`.

---

## 3. The gate: `isLaunchEffortUnpinned` (`PIe`)

**What it does.** The `--effort` flag is forwarded **only** when all three "unpin launch effort" local-config flags are on — the same gate that governs whether effort is a live, model-selectable dial in the first place.

**How it works.**

```javascript
// ============================================
// isLaunchEffortUnpinned - the gate on --effort forwarding
// Location: cli_inner_pretty.js:149794-149797
// ============================================

// ORIGINAL (for source lookup):
function PIe() {
  let e = Lt();
  return Boolean(e.unpinOpus47LaunchEffort && e.unpinOpus48LaunchEffort && e.unpinFable5LaunchEffort);
}

// READABLE (for understanding):
function isLaunchEffortUnpinned() {
  let config = getConfigSnapshot();
  // effort is only a live dial when ALL THREE model launch-effort pins are released
  return Boolean(config.unpinOpus47LaunchEffort
              && config.unpinOpus48LaunchEffort
              && config.unpinFable5LaunchEffort);
}

// Mapping: PIe→isLaunchEffortUnpinned, Lt→getConfigSnapshot
```

**Why gate the forwarding on the same flag that makes effort live.** If launch effort is *pinned* (the default for a model), the leader's `effortValue` is not a user-meaningful runtime choice — it is whatever the model's pinned default is, and the child will independently apply that same pinned default on its own launch. Forwarding `--effort` in that state would be redundant at best and, if the child's pinning differs, could *override* the child's correct default with a stale value. Forwarding only when **unpinned** means `--effort` is threaded exactly when it represents a deliberate, live user choice that the child would otherwise not know about. This reuses an existing gate (`PIe` is carryover) rather than inventing a new "should I forward effort" flag — the new use, not the gate, is the delta.

---

## 4. Evidence: NET-NEW vs CARRYOVER (183 grep-diff)

| Signal | 183 | 193 | Verdict |
|---|---:|---:|---|
| `push(\`--effort ${...}` in a spawn builder | 0 | 2 | NET-NEW (pil@428500, Mil@429456) |
| `effortValue` threaded into a pane-spawn builder call | 0 | 3 | NET-NEW (call sites @428615/@429595/@429710) |
| `effortValue` (app-state field, whole bundle) | 55 | present | CARRYOVER (the concept is old) |
| flag builder exists (`buildInheritedCliFlags` shape) | yes (`F5a`) | yes (`pil`/`Mil`) | CARRYOVER (only the `--effort` line is new) |
| `isLaunchEffortUnpinned` gate | yes | yes | CARRYOVER (reused, new caller) |

Re-verified in the live 193 bundle: `pil`@428485 + push@428500, `Mil`@429445 + push@429456, `PIe`@149794, callers@428615/429595/429710. The 183 predecessor builder (`(183) F5a`, `cli_inner_pretty.js:421627`) destructures only `{ planModeRequired, permissionMode, skipModel }` — confirmed in the 183 bundle at `(183) :421629` — with **no `effortValue` and no `--effort`**; `grep push(\`--effort` returns 0 in 183.

**Carryover precision.** `effortValue` as an app-state field is **not** new (183 has 55 occurrences). The 88 ancestor `buildInheritedCliFlags` (`(88) spawnUtils.ts:38`) took only `{ planModeRequired, permissionMode }` — not even `skipModel`. `skipModel` was added pre-183; `effortValue` is added in this 2.1.186 window. So the *effort threading* is genuinely net-new vs both 88 and 183; do **not** over-claim that "effort is new" — only its propagation into the pane-teammate command is.

---

## 5. Behavioral note — the upgrade gotcha and the in-process divergence

- **Upgrade behavior.** After upgrading to 2.1.186+, a leader running at an elevated effort (e.g. `xhigh`/`ultracode`) will **silently** launch its tmux/iTerm2-pane teammates at that same effort — but only when the three `unpin*LaunchEffort` config flags are on. Before this window, pane teammates ran at their own default effort regardless of the leader.
- **Pane vs in-process divergence.** `--effort` is a *child-process argv* concern, so it only applies to the pane backends (tmux/iTerm2), which spawn a real `claude` child. An **in-process** teammate (the AsyncLocalStorage runner) shares the leader's process and configures effort through a different path. Result: effort behavior can diverge between `teammateMode: "in-process"` and the pane backends — worth keeping in mind when comparing teammate behavior across modes.

---

## Cross-links

- Sibling 193 docs: [`teammate_mode_iterm2.md`](./teammate_mode_iterm2.md) (the iTerm2 pane backend these builders target; `pil` also pushes `--teammate-mode ${getTeammateModeFromSnapshot()}`), [`stop_attribution.md`](./stop_attribution.md), [`README.md`](./README.md).
- v2.1.183 baseline for the pane-spawn machinery (the `send-keys` → `respawn-pane` tmux mechanic and the builder's prior shape): [`../../../claude_code_v_2.1.183/analyze/30_agent_team/spawn_backends_and_tmux_fix.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/spawn_backends_and_tmux_fix.md).

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Agent Team** is the home module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Model/effort dial)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_agent_team.md](../00_overview/symbol_additions_v2_1_193_agent_team.md) — the granular 193 additions for this module

Key functions in this doc:

- `buildInheritedCliFlags` (obfuscated: `pil`, `cli_inner_pretty.js:428485`) — leader/pane flag builder; `--effort` push @428500; also pushes `--teammate-mode`. 88 name `buildInheritedCliFlags` (`spawnUtils.ts:38`); 183 predecessor `F5a` (`(183) :421627`, no effort).
- `buildInheritedSubagentCliFlags` (obfuscated: `Mil`, `cli_inner_pretty.js:429445`) — subagent-pane flag builder; `--effort` push @429456; no `--teammate-mode`.
- `isLaunchEffortUnpinned` (obfuscated: `PIe`, `cli_inner_pretty.js:149794`) — gate; true only when all three `unpin*LaunchEffort` config flags are set; reads `getConfigSnapshot` (`Lt`).
- pane-spawn callers: `pil({…effortValue: getAppState().effortValue})` @428615; `Mil({…effortValue: u.effortValue})` @429595 and @429710.
