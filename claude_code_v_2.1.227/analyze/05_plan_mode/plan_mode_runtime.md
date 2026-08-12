# Plan-mode state, permissions, reminders, and approval

## Scope and version assessment

The 2.1.227 implementation retains the principal 2.1.220 architecture: `EnterPlanMode` changes the
permission context, the model may write only the current plan file, `ExitPlanMode` asks for approval,
and transcript attachments reconstruct the constraint across turns. Every identifier and range below
was re-derived from the target bundle.

The target adds more orchestration around that stable core. It can preserve and later restore auto
mode, remove dangerous grants while planning, route a teammate's plan to its leader, offer an
interactive workshop, and offer a post-approval prototype for eligible greenfield UI work. The
prototype branch is present in 2.1.227 but not in the 2.1.220 plan-reminder path.

### Enter transition and permission-state snapshot

**What it does:** Moves the foreground session into a read-only planning state without losing the
permission mode that should apply after approval.

**How it works:**
1. `EnterPlanModeTool` (`Vri`, `cli_inner_pretty.js:544797-544873`) rejects agent contexts. Teammates
   cannot silently place their independent execution loop into the interactive user's plan state.
2. It calls the transition tracker before mutating permissions. Moving into plan clears any stale
   “plan exit attachment needed” marker left from a prior interval.
3. `prepareContextForPlanMode` (`iPr`, `:579857-579875`) stores the current mode in `prePlanMode`.
4. If the previous mode is `auto`, it retains auto only when the current model/provider/gate permits
   it. Otherwise it disables auto, strips its dangerous permissions, and marks that an auto-exit
   attachment will be needed.
5. The generic permission-context reducer changes only `mode` to `plan`; allow, ask, deny, directory,
   and stripped-rule state remain explicit fields rather than being discarded.
6. The tool result tells the model to explore, compare alternatives, ask clarifying questions, write a
   plan, and call `ExitPlanMode`; it explicitly prohibits ordinary edits.

**Why this approach:**
- Remembering `prePlanMode` makes plan mode a reversible overlay rather than a destructive settings
  change.
- Reusing the normal permission-context reducer keeps mode transitions subject to the same managed
  restrictions as user-driven mode changes.
- Auto mode needs special treatment because a cached safety grant that is acceptable during execution
  must not become an indirect write bypass during planning.
- The trade-off is more state than a simple `isPlanning` boolean, but it prevents approval from
  unexpectedly downgrading or escalating the user's prior mode.

**Key insight:** Plan mode stores both the active policy and the return policy. Approval changes the
first only after the second has been revalidated against current gates.

### Filesystem permission floor and the plan-file carve-out

**What it does:** Allows codebase exploration and one canonical planning artifact while preventing
normal file mutation even when broad allow rules exist.

**How it works:**
1. Read checks in `checkReadPermission` (`HSe`, `cli_inner_pretty.js:589167-589210`) evaluate explicit
   deny and ask rules first, then temporarily apply the default-mode read logic. Plan mode is therefore
   read-only, not “read everything regardless of policy.”
2. Write checks in `checkWritePermission` (`CHt`, `:589211-589292`) first honor hard deny rules and
   protected-path safety checks.
3. `checkSessionFileWriteCarveout` (`cun`, `:589345-589391`) recognizes the normalized current plan
   path. It includes the workshop document only when the active permission mode is `plan`.
4. The carve-out is evaluated before the generic plan-mode rejection, so the model can build the
   approved artifact incrementally.
5. Session allow rules are not allowed to auto-approve arbitrary edits while `mode === "plan"`.
6. Any otherwise safe path that misses the carve-out returns an ask-shaped denial with “Cannot write
   ... while in plan mode.” The surrounding permission UI cannot turn that particular invocation into
   a broad plan-mode bypass.
7. Suggestion generation suppresses a switch-to-`acceptEdits` suggestion when plan mode was entered
   from auto, bypass, accept-edits, or dont-ask mode, avoiding a misleading escape route.

**Why this approach:**
- A permission-layer invariant protects every write-capable tool, including tools added after the
  planning prompt was authored.
- Normalization and session-derived paths are safer than allowing a filename pattern such as every
  `*.md` file.
- Running deny and protected-path checks before the carve-out ensures the planning exception does not
  override administrative or safety constraints.
- The trade-off is that legitimate generated artifacts must be modeled as explicit exceptions. The
  target accepts that cost for the plan and workshop document rather than weakening the global floor.

**Key insight:** The prompt explains the rule, but `checkWritePermission` enforces it. Broad historical
allow rules cannot outrank the active plan-mode floor.

### Exit, approval, and return-mode restoration

**What it does:** Converts a completed plan into an approval request and restores execution only on
the successful exit path.

**How it works:**
1. `ExitPlanModeTool` (`L9`, `cli_inner_pretty.js:482809-483055`) validates that the current mode is
   `plan`; an out-of-mode call returns a correction instead of changing permissions.
2. Input normalization injects the plan content and plan path from disk. The public input schema does
   not trust the model to send an alternate plan body as the approval artifact.
3. In a teammate context, the tool requires a real plan, creates a unique approval request, writes it
   to the team leader's inbox, and marks that task `awaitingPlanApproval`. A failed inbox write fails
   the submission rather than reporting a false success.
4. In the foreground context, the permission check returns `ask`. The UI owns approve, reject, edit,
   and optional remote-refinement decisions; the tool call alone is not approval.
5. After approval, the tool re-reads `prePlanMode`. If it was `auto`, it checks the auto-mode gate
   again because provider/model/settings state may have changed during planning.
6. A now-unavailable auto mode falls back to `default` and emits an immediate warning. Otherwise the
   auto-mode runtime flag is synchronized with the restored permission mode.
7. Dangerous rules stripped on entry are restored only for a non-auto return. An auto return applies
   the auto-mode stripping policy again.
8. The result includes the canonical saved plan, labels user-edited plans, and may recommend named
   teammates when the Agent tool is available.

**Why this approach:**
- Reading the artifact from its canonical path prevents a mismatch between what the user reviews and
  what the model later treats as approved.
- Rechecking auto mode at exit avoids restoring a stale capability after a feature gate, circuit
  breaker, model, or provider change.
- A durable team inbox request decouples teammate planning from the foreground UI while preserving an
  explicit approval boundary.
- The trade-off is an asymmetric path: foreground approval is UI-mediated, while teammates use an
  inbox protocol and task-registry state. Both converge on the same rule—no execution before an
  affirmative decision.

**Key insight:** `ExitPlanMode` is an approval transaction, not a mode setter. Its permission mutation
is the commit step after the reviewed artifact and current return policy are validated.

### Transcript-based reminder reconstruction

**What it does:** Keeps plan constraints active across many turns, compaction, reentry, and resume
without injecting the entire workflow on every request.

**How it works:**
1. `scanPlanModeHistory` (`Ywa`, `cli_inner_pretty.js:592342-592357`) walks backward until it finds a
   plan entry/reentry attachment or a plan-exit boundary, counting only genuine user turns.
2. `createPlanModeAttachments` (`m_S`, `:592399-592461`) runs only while the current permission mode is
   `plan` and rate-limits reminder reinjection by the number of turns since the last attachment.
3. It emits a reentry attachment when the session has previously exited plan mode but a plan file is
   present, then clears the one-shot marker.
4. It chooses a full reminder on the first attachment, on a configured cadence, or when workshop/
   artifact state differs from the previous attachment. Other turns receive a sparse reminder.
5. `buildFullPlanModeReminder` (`YmS`, `:582899-582971`) reconstructs the five-phase planning workflow,
   canonical file path, file-existence state, custom instructions, and eligible workshop/prototype
   offers. `buildSparsePlanModeReminder` (`XmS`, `:582972-582977`) repeats only the read-only invariant,
   file path, and workflow pointer.
6. Leaving plan mode causes `createPlanModeExitAttachment` (`jsf`, `:592462-592470`) to emit one
   `plan_mode_exit` boundary. Later history scans stop there, so an old plan interval does not leak into
   current context.

**Why this approach:**
- Transcript attachments survive serialization and compaction better than relying only on mutable
  process state.
- Alternating full and sparse reminders balances instruction reliability against context cost.
- A backward boundary scan is cheaper and less error-prone than reconstructing the entire session
  state from every historical message.
- The trade-off is duplicated state between the permission context, session markers, disk artifact,
  and transcript. Explicit entry/exit attachments make those copies reconcilable.

**Key insight:** The permission context is authoritative for enforcement; attachments are the durable
explanation that lets the model reconstruct why those permissions apply.

### Optional workshop and prototype routing

**What it does:** Adds richer decision-making paths without weakening the plan artifact or write
boundary.

**How it works:**
1. On the first full foreground reminder, capability gates determine whether a workshop skill is
   available and whether an active workshop document already exists.
2. The workshop is offered only when the task has substantive choices. If accepted, its document is
   stored beside the plan, and resolved decisions must be folded back into the canonical plan.
3. The workshop path is explicitly included in the plan-mode write carve-out; arbitrary artifact paths
   are not.
4. A separate prototype offer is eligible only for a greenfield product/UI idea, only when workshop
   routing does not supersede it, and only once.
5. Even after acceptance, the prototype is not built during plan mode. The model first writes a
   prototype-first plan, requests approval, exits plan mode, and then invokes the prototype skill.

**Why this approach:**
- Interactive decisions can produce better plans, but the plan file remains the single reviewed handoff
  to implementation.
- Deferring prototype construction preserves the read-only promise and prevents “planning” from
  becoming an unapproved implementation channel.
- Eligibility and one-shot telemetry avoid repeatedly advertising optional workflows.
- The trade-off is more reminder-state flags and a second allowed document, bounded by path and phase.

**Key insight:** Rich planning artifacts are subordinate to the approval protocol. They can inform the
plan but cannot replace the canonical plan or the exit transaction.

### Public ultraplan removal versus retained gated code

**What it does:** Reconciles the 2.1.222 changelog statement “Removed ultraplan feature” with
ultraplan-related code still present in the 2.1.227 bundle.

**How it works:**
1. The slash-command object remains at `cli_inner_pretty.js:473625-473656`, along with polling, dialog,
   resume, telemetry, and remote-session support.
2. Its `isEnabled` predicate calls `isUltraplanEnabled` (`G9e`, `:473100-473103`). Availability requires
   the `tengu_ultraplan_config.enabled` feature value plus product/session eligibility checks.
3. The command is therefore absent from ordinary command discovery when that explicit gate is not
   enabled. Enterprise upsell placeholders are a separate hidden command path.
4. The same gated implementation was already present in the 2.1.220 bundle. The available artifacts
   do not prove a physical deletion and later reimplementation between the two endpoints.

**Why this approach:**
- Retaining dormant rollout code permits controlled experiments and safe rollback without making the
  feature generally available.
- Changelogs describe supported product behavior, not necessarily dead-code elimination.
- The trade-off is analytical ambiguity: string searches alone falsely imply a live public feature.

**Key insight:** In this bundle, registration is not availability. The release-note removal is best
interpreted as removal from the normal user surface; the implementation remains capability-gated.

## 2.1.220 to 2.1.227 conclusion

- Entry, canonical plan storage, permission enforcement, exit approval, and full/sparse transcript
  reminders remain architectural carryover and have been independently re-anchored.
- Auto-mode restoration now forms a particularly important cross-module boundary: exit revalidates the
  gate and never blindly reinstates dangerous grants.
- Interactive workshop support is retained and expanded; 2.1.227 adds a separately gated prototype
  offer that runs only after plan approval.
- Ultraplan internals remain in both endpoint bundles behind a default-off capability predicate despite
  the 2.1.222 supported-surface removal note.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `EnterPlanModeTool` (`Vri`) - plan entry tool.
- `ExitPlanModeTool` (`L9`) - plan approval and exit tool.
- `prepareContextForPlanMode` (`iPr`) - captures and sanitizes the pre-plan permission state.
- `checkReadPermission` (`HSe`) - read-side permission evaluation.
- `checkWritePermission` (`CHt`) - write-side plan floor.
- `checkSessionFileWriteCarveout` (`cun`) - narrow session-file exceptions.
- `buildFullPlanModeReminder` (`YmS`) - complete workflow reminder.
- `buildSparsePlanModeReminder` (`XmS`) - low-token reinforcement reminder.
- `scanPlanModeHistory` (`Ywa`) - current plan-interval scan.
- `createPlanModeAttachments` (`m_S`) - reminder/reentry scheduler.
- `createPlanModeExitAttachment` (`jsf`) - durable exit boundary.
- `isUltraplanEnabled` (`G9e`) - default-off ultraplan availability gate.
