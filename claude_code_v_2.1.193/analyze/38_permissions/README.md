# 38 — Permissions & Auto-mode (v2.1.193): classifyAllShell, denial-reason surfacing, sandbox.credentials, org model restrictions, session-host remember

> **NEW MODULE** for the **v2.1.183 → v2.1.193** window. Documents the permissions / auto-mode / sandbox delta: the new `autoMode.classifyAllShell` flag, auto-mode denial-reason surfacing, the `sandbox.credentials` protection sub-object, org entitlement-driven model restrictions, the Recently-denied approve-persist behavior, and the sandbox network session-host cache.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`, 2026-06-25). Every `cli_inner_pretty.js:<line>` citation is a **v2.1.193** line unless tagged **(183)**.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines, build `9d251ab`).
> Obfuscated names are re-mangled every build — each was re-derived in the 193 bundle this pass. Do **not** carry an obf token across versions (e.g. `$Cr` was `isSubagent` in 183 but is `isClassifyAllShellEnabled` in 193).

---

## TL;DR — the largest net-new surface in the window

The permissions subsystem is where most of the 2.1.187 + 2.1.191 + part of 2.1.186 changelog weight landed. Of the eight investigated surfaces, **six are genuine 193 deltas**, **one is a clean refinement**, and **one is pure carryover**:

| # | Delta | Kind | 193 anchor | 183 before | Doc |
|---|-------|------|-----------|-----------|-----|
| 1 | `autoMode.classifyAllShell` — route ALL Bash/PowerShell through the classifier | **NET-NEW** (2.1.193) | schema `:55814`; gate `$Cr` `:58758`; predicate `r9e` `:416263` | `grep -c classifyAllShell`=0; `WGe` `:409907` no bypass | [classify_all_shell.md](./classify_all_shell.md) |
| 2 | Auto-mode denial **reasons** surfaced (toast + Recently-denied + dark transcript) | **NET-NEW** surfacing (record carryover) | toast `:640271`; recent-denied `:546589`; `XKa`/`USe` `:382614` | record had `reason` `:627443`; renderers were `null`/`...{}` | [denial_reasons_surfacing.md](./denial_reasons_surfacing.md) |
| 3 | `sandbox.credentials` — deny-read credential files / unset secret env | **NET-NEW** (2.1.187) | schema `:54069`; assembly `:219470`; enforce `Rqi` `:211660`→`Yjd` `:211677` | `grep -c denyReadPaths`=0 | [sandbox_credentials.md](./sandbox_credentials.md) |
| 4 | Org entitlement model gate (picker/`--model`/`/model`/`ANTHROPIC_MODEL`) | **NET-NEW** gate (warning carryover) | `NFe` `:102814`; `tzt` `:487243`; `u_n` `:103211` | `rre` warning `:362631`; `denied_by_entitlement`=0 | [org_model_restrictions.md](./org_model_restrictions.md) |
| 5 | Recently-denied **approve-persists-on-close** + session-allowed-hosts | **NET-NEW** (2.1.191) | close handler `:547334`; `_Wd`/`BLn` `:219238`/`:219833` | approved branch cosmetic `:536369`; `addSessionAllowedHost`=0 | [recent_denied_overlay.md](./recent_denied_overlay.md) |
| 6 | `Agent(type)` upfront deny + `allowedAgentTypes` on named spawns | **REFINEMENT** (2.1.186; matcher carryover) | spawn block `:430515` | no upfront check `:423565` | [background_subagent_permission_forwarding.md](./background_subagent_permission_forwarding.md) §2 |
| 7 | Background-subagent permission forwarding (`rdc`/`pendingWorkerRequest`/`M8n`) | **CARRYOVER** | `:640151`/`:426557` | identical (grep counts match) | [background_subagent_permission_forwarding.md](./background_subagent_permission_forwarding.md) §1 |

---

## The permission decision flow (orientation)

A tool call is judged by a layered permission model; the 193 deltas all attach to specific layers of it:

1. **Allow / deny rules** from the four settings sources are compiled into permission layers. A matching **deny** rule rejects; a matching **allow** rule admits — *except* in auto mode, where allow rules can be **suspended**.
2. **Auto mode** (`dQl`, `:597459` = `mode === "auto"` or active plan-auto) adds a classifier layer. Normally it *trusts* Bash/PowerShell allow rules except dangerous interpreter prefixes; **`classifyAllShell` (delta 1)** collapses that trust so every shell command is classified. The suspension oracle is `isShellAllowRuleSuspended` (`r9e`, `:416263`).
3. **Classifier decision** produces a `decisionReason` carrying a human `reason`. On deny, **delta 2** surfaces that reason in the toast, the Recently-denied list, and (dark) the transcript.
4. **Sandbox** wraps the actual command execution. **`sandbox.credentials` (delta 3)** folds credential files into the sandbox filesystem deny-read set and unsets secret env vars; **session-allowed-hosts (delta 5)** caches network "Yes" answers.
5. **Recently-denied overlay** (`/permissions`) lets the user approve a past denial; **delta 5** makes that approval persist (removeDenial + model grant).
6. **Model selection** is itself entitlement-gated: **delta 4** excludes non-entitled models from the picker, rejects them on `/model`, and downgrades `--model`/env requests.
7. **Subagent spawns** check `Agent(type)` deny rules / `allowedAgentTypes`; **delta 6** hoists that check upfront for named spawns; **delta 7** (carryover) forwards a background worker's permission ask to the main session.

---

## The four settings sources

Two precedence-ordered source arrays drive every "is this enabled across settings?" check in this module:

- `SETTINGS_SOURCES` (obf: `Uys`, `:58827`) = `["userSettings", "localSettings", "flagSettings", "policySettings"]` — used by the `classifyAllShell` gate `$Cr` (`:58758`) as an **OR across sources** (any source enabling the flag wins).
- The credentials assembly (`:219470`) and the auto-mode allow-layer builder (`NEe`/`ajo`, `:597462`) iterate the source set to **merge** (union) each source's rules/credentials, so a stricter source's policy is never silently dropped by a laxer one.

Settings are read via `readSettings` (obf: `_n`) and paths resolved per-source via `resolvePath` (obf: `p3e`) — a path in *project* settings resolves to the project root, the same syntax in *user* settings to `~/.claude`.

---

## The `ko` sandbox controller surface

`ko` (`:219848`) is the singleton sandbox controller object — the API surface the rest of the app uses to query/mutate sandbox state. The 193-relevant methods:

- `addSessionAllowedHost: _Wd` (`:219863`) — **NET-NEW (delta 5)**: remember a "Yes" host for the session (`BLn.add` + `hJr()` rebuild).
- `refreshConfig: hJr` — rebuild the sandbox config; this is where credential `denyReadPaths` (`Yjd`, delta 3) and session hosts (`BLn`, delta 5) get folded into the live config.
- `reset: kWd` — clears session state including `BLn.clear()` (`:219748`).
- `getConfig` / `getFsReadConfig` / `getFsWriteConfig` — read the resolved filesystem deny/allow sets (which now include credential deny-read paths).
- `wrapWithSandbox`, `getExcludedCommands`, `isSandboxRequired`, `areUnsandboxedCommandsAllowed`, `checkDependencies` — pre-existing controller methods (carryover).

The credential-protection resolver `resolveCredentialProtection` (`Rqi`, `:211660`) and the deny-read merge `buildSandboxFsDenyRead` (`Yjd`, `:211677`) feed the controller's filesystem config; the session-host set `BLn` feeds its network `allowedDomains`. So **deltas 3 and 5 both land in the `ko` config-rebuild path** (`hJr`).

---

## Carryover / false-delta ledger (be adversarial)

Things that look like 193 deltas but are **not** — stated explicitly with grep evidence, so the module's net-new claims are not inflated:

- **The "Recently denied" tab itself** — carryover (overlay `H4l` `:547100`, tab `f4l` `:546479`; 183 had both). Only the per-row *reason* (delta 2) and the *approve-persist* close behavior (delta 5) are new.
- **The denial record storing `reason`** — carryover (183 `:627443`, identical record shape). Only the *surfacing* (toast/recent-denied) is new.
- **The `rre` "Using X instead" model warning** — carryover (193 `:374023`, 183 `:362631`). It even contains the phrase "restricted by your organization's settings", so `grep -c "restricted by your organization's settings"`=**183 1 / 193 2** — the net-new string is specifically `…Run /model to choose a different model.` (183=0). The entitlement *gate* is the delta, not the warning.
- **The `p9e`/`wPe`/`Wil` Agent-type matcher + `allowedAgentTypes`** — carryover (`allowedAgentTypes` 19 hits in both). Only the upfront named-spawn enforcement site (delta 6) is new.
- **`pendingWorkerRequest`/`permission_swarm_forward`/`M8n` worker-permission forwarding** — fully carryover (delta 7): counts 7/2/7 in both bundles. The changelog lists it under 2.1.186 but it predates the 183 snapshot.
- **The `onRetryDenials` retry path** in the overlay close handler — carryover (183 `:536356` already emitted "Permission granted for:"). Only the *approved* branch (delta 5) is new.
- **The dangerous-prefix path** (`mqt`/`hqt`/`oTo`, the `$rl` interpreter list `:416116`) under `classifyAllShell` — carryover; `classifyAllShell` only widens which rules are suspended.

---

## Docs in this module

```
38_permissions/   (v2.1.193 — NEW DELTA module)
├── README.md                                       ← you are here (decision flow, 4 sources, ko controller, ledger, index)
├── classify_all_shell.md                           ← NET-NEW: autoMode.classifyAllShell; r9e bypass line; 4 suspension callers
├── denial_reasons_surfacing.md                     ← NET-NEW surfacing: toast reason + recent-denied reason + dark toolDenialKind
├── sandbox_credentials.md                          ← NET-NEW: sandbox.credentials schema/assembly/Rqi→Yjd enforcement; staged mask
├── org_model_restrictions.md                       ← NET-NEW gate: NFe/Uge/tzt/u_n; vs carryover rre warning
├── recent_denied_overlay.md                        ← NET-NEW: approve-persists-on-close + session-allowed-hosts (BLn/_Wd)
└── background_subagent_permission_forwarding.md    ← CARRYOVER (rdc/M8n) + REFINEMENT (Agent named-spawn upfront deny)
```

## Reading order

1. **This README** — the decision flow and which layer each delta attaches to.
2. **classify_all_shell.md** — the headline net-new flag; read first because it reshapes auto-mode shell trust.
3. **denial_reasons_surfacing.md** — what the user sees when a (now-classified) command is denied.
4. **sandbox_credentials.md** + **recent_denied_overlay.md** — the two sandbox-controller deltas (both land in the `ko`/`hJr` rebuild path).
5. **org_model_restrictions.md** — the orthogonal entitlement model gate.
6. **background_subagent_permission_forwarding.md** — read last; honest carryover + one refinement.

---

## Cross-tree links

- Background-agents subsystem (worker lifecycle the carryover forwarding rides on; the nested-subagent depth gate that bounds spawns): [../36_background_agents/README.md](../36_background_agents/README.md), [../36_background_agents/nested_subagent_depth_limit.md](../36_background_agents/nested_subagent_depth_limit.md).
- Agent-team / named-spawn routing (the `allowedAgentTypes` allow-list home): [../30_agent_team/](../30_agent_team/).
- 183 before-pictures cited inline by line (`WGe` `:409907`, the 183 toast `:627452`, the 183 overlay close `:536350`, `rre` `:362631`, the 183 spawn body `:423565`).

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Subagent/Agent spawn enforcement (`p9e`/`wPe`/`Wil`, the named-spawn block)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — **Auto-mode** (home for `classifyAllShell`, denial-reason surfacing) + Background Agents (`rdc`/`M8n`)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — **Permissions / Sandbox / Model** (home for `r9e`/`sTo`/`$Cr`, `sandbox.credentials`, the `ko` controller, `BLn`/`_Wd`, `NFe`/`Uge`/`tzt`/`u_n`)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI overlays (toast, Recently-denied)
> - [../00_overview/symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md) — the granular v2.1.193 additions for this module (add new rows there)

Key functions/constants across this module (full per-doc lists in each file):

- `isClassifyAllShellEnabled` (obf: `$Cr`, `:58758`) / `shouldSuspendAllShellAllowRules` (obf: `sTo`, `:416260`) / `isShellAllowRuleSuspended` (obf: `r9e`, `:416263`) — the classifyAllShell gate + suspend predicate.
- `SETTINGS_SOURCES` (obf: `Uys`, `:58827`) — the four settings sources.
- `recordDenial` (`:640262`) / auto-mode-denied toast (`:640271`) / `classifyToolDenialKind` (obf: `XKa`, `:382614`) / `isToolDenialKindEnabled` (obf: `USe`, `:382624`, `return !1`) — denial-reason surfacing.
- `sandboxCredentials` (obf: `IEu`, `:54069`) / `resolveCredentialProtection` (obf: `Rqi`, `:211660`) / `buildSandboxFsDenyRead` (obf: `Yjd`, `:211677`) — sandbox.credentials.
- `isModelRestrictedByEntitlements` (obf: `NFe`, `:102814`) / `getOrgRestrictedModelSet` (obf: `Uge`, `:102820`) / `switchModel` (obf: `tzt`, `:487243`) / `resolveRestrictedModelFallback` (obf: `u_n`, `:103211`) — org model gate; carryover warning `rre` (`:374023`).
- `ko` sandbox controller (`:219848`) / `addSessionAllowedHost` (obf: `_Wd`, `:219238`) / `sessionAllowedHosts` (obf: `BLn`, `:219833`) — controller + session-host cache.
- `PermissionsOverlay` (obf: `H4l`, `:547100`) / close handler (`:547334`) — approve-persists-on-close.
- `forwardWorkerPermissionRequest` (obf: `rdc`, `:640151`) / `buildWorkerPermissionRequest` (obf: `M8n`, `:426557`) — carryover worker forwarding.
