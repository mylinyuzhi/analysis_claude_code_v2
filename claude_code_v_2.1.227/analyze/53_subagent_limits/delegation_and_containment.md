# Delegation discipline and containment hardening

Resource ceilings are only one part of safe delegation. 2.1.227 retains the deeper controls added by
2.1.220: reduce recursive delegation, refuse misconfigured tool-less agents, inherit permissions
predictably, contain worktree shell execution, and neutralize instruction-shaped child output.

### Tool resolution and zero-tool refusal

**What it does:** Resolves an agent definition's allowed/disallowed tools and refuses a provably
misconfigured fresh launch that would have no capabilities.

**How it works:**
1. `filterToolsForAgent` (`K5b`, `cli_inner_pretty.js:483076-483091`) starts from the parent pool and
   removes globally forbidden, custom-agent-forbidden, depth-forbidden, and async-forbidden tools.
2. Plan mode retains/adds the plan-exit tool so a worker cannot become trapped.
3. Agent frontmatter resolution classifies requested tools as valid, invalid, unavailable, wildcard,
   or recognized-but-empty.
4. Per-agent MCP servers connect, then their tools are merged and `disallowedTools` removes exact,
   aliased, or server-level matches (`481749-481828`, `482040-482065`).
5. If the final pool is empty, telemetry records why.
6. A fresh explicit non-wildcard configuration with an otherwise nonempty available pool throws a
   diagnostic refusal (`482066-482091`). Continuations and less-provable empty cases may proceed.

**Why this approach:**
- Filtering in one child-context builder covers Agent, forks, and background routes.
- Plan exit is a liveness exception to normal filtering.
- Refusal is conservative: only a configuration that clearly resolved to nothing is rejected, so
  intentional model-only continuations are not broken.
- Rich categories turn an opaque “no tools” failure into actionable frontmatter feedback.

**Key insight:** Zero tools is not always an error. The algorithm refuses only when it can attribute
the empty set to a fresh, explicit, fixable tool declaration.

### Permission inheritance and deprecated mode

**What it does:** Derives child permission behavior from parent state and agent frontmatter while
preventing an unsafe bypass escalation.

**How it works:**
1. The Agent input still parses `mode`, but its schema says “Deprecated; ignored”
   (`cli_inner_pretty.js:550761-550765`).
2. `runSubagentStream` reads the current parent permission context for each cached transformation
   (`481944-482020`).
3. Agent-definition permission mode applies only under defined parent modes or an explicit spawn-mode
   override.
4. A requested `bypassPermissions` is downgraded to the parent mode unless the session is in an
   approved contained/no-internet environment and organization policy permits it.
5. Async children normally avoid interactive prompts; foreground children may bubble prompts when a
   dialog channel exists.
6. Explicit `allowedTools` replace only session allow rules while preserving CLI and MCP policy
   components.

**Why this approach:**
- Removing call-site mode semantics prevents the model from escalating a child through tool input.
- Agent definitions remain an administrator/user-authored policy surface.
- Reading current parent state avoids stale permission snapshots during long sessions.
- Preserving non-session rule layers prevents a child-specific allowlist from erasing stronger policy.

**Key insight:** The deprecated field remains for protocol compatibility, but authority moved from
model-authored input to parent state and trusted agent configuration.

### Delegation discipline prompt

**What it does:** Discourages a worker from re-delegating its entire assignment to a single new
subagent while still allowing targeted parallel assistance below the depth cap.

**How it works:**
1. The built-in general-purpose worker prompt states that it is already the dedicated agent and must
   perform the task directly (`cli_inner_pretty.js:244243-244257`).
2. It also warns against unnecessary delegation and unrelated work.
3. Separately, depth-aware prompt text says workers may fan out for bounded parallel research or
   verification when the Agent tool is actually available (`244562-244565`).
4. Tool filtering/runtime depth checks enforce the hard boundary even if prompt advice is ignored.

**Why this approach:**
- Prompt guidance addresses inefficient delegation patterns that are undesirable but not inherently
  unsafe.
- Hard-coding “never delegate” would discard useful parallelism.
- Combining soft discipline with hard depth/resource limits separates quality policy from safety.
- Prompt behavior is probabilistic, so it is not relied upon for enforcement.

**Key insight:** The two messages are intentionally compatible: do not recursively outsource the
whole job, but use bounded workers for independently useful subtasks.

### Worktree shell-containment decision tree

**What it does:** Prevents a worktree-isolated agent's Bash command from falling back or redirecting
into the shared checkout.

**How it works:**
1. Shell execution receives both the agent worktree and effective isolation root
   (`cli_inner_pretty.js:329213-329284`).
2. If the agent worktree exists but cwd-override context was lost, execution fails closed with
   `context_lost`.
3. It resolves the current cwd with `realpath`. If the cwd disappeared and recovery would select the
   shared checkout, it refuses with `worktree_gone` rather than recovering there.
4. `isPathOutsideIsolationRoot` (`xBd`, `322132-322150`) checks canonical cwd containment and refuses
   a shared/outside checkout with `shared_checkout`.
5. Bash commands are parsed; `detectGitRedirectOutsideIsolation` (`bUd`, `327424-327477`) identifies
   `git -C`, `--git-dir`, `--work-tree`, and equivalent redirect patterns that escape the root.
6. A detected redirect refuses with `command_redirect`; only then may sandbox/process setup continue.

**Why this approach:**
- Checking only the process cwd misses commands that redirect Git internally.
- Real paths handle symlinks and deleted-directory recovery accurately.
- Fail-closed behavior can reject unusual but legitimate commands, yet worktree isolation promises
  are more important than convenience.
- Guarding at shell launch covers all session types and subagents, not only file-edit tools.

**Key insight:** Filesystem isolation is a property of both **where the shell starts** and **where the
command tells Git to operate**. The guard verifies both.

### Subagent-output neutralization

**What it does:** Treats child output as untrusted data by neutralizing forged control markers and
flagging permission-escalation language before it enters the parent result.

**How it works:**
1. `sanitizeSubagentText` (`dkr`) and `sanitizeSubagentContent` (`k6d`) run every string/block through
   the same pattern engine (`cli_inner_pretty.js:366845-366874`).
2. Patterns classify settings/permission escalation terms, system/harness/channel/model tags,
   forged `[harness:` prefixes, and role-turn markers (`366893-366963`).
3. `flag` preserves text but adds a reportable finding.
4. `neutralize` changes `<` to `<\` or `[` to `[\`, preventing downstream parsers from recognizing a
   control envelope while retaining readable evidence.
5. `neutralize-silent` escapes role-turn colons without adding an alarming marker.
6. Reportable matches prepend a deterministic warning and emit aggregated telemetry through
   `recordSubagentOutputFindings` (`I6d`, `366875-366885`).
7. Final result extraction applies this pipeline before returning content to the parent (`Mfa`,
   `483392-483405`).

**Why this approach:**
- Literal removal would destroy evidence and may change meaning; minimal escaping is auditable.
- Three actions distinguish suspicious content from harmless transcript-shaped text.
- Deterministic sanitization works even when a model-based handoff classifier is unavailable.
- Pattern matching cannot identify every semantic attack, so auto mode adds a separate contextual
  review layer.

**Key insight:** The scrubber does not claim to prove output safe. It breaks syntactic privilege while
preserving the suspicious text and making the trust boundary visible to the parent.

### Explore and restricted-model inheritance

**What it does:** Chooses a child model from explicit input, agent frontmatter, parent model, and
organization restrictions without silently jumping to an unrelated family.

**How it works:**
1. The Agent tool ignores explicit model input when the host requires inherited selection, otherwise
   it passes the override into child resolution (`cli_inner_pretty.js:550851-550853`).
2. Forks always inherit the parent model because exact conversation continuation is part of their
   contract (`550730-550735`, `551195-551238`).
3. Ordinary agents combine explicit override, definition model, and parent/default model.
4. Family aliases restricted by organization policy step down to the newest permitted member in the
   same family rather than dropping immediately to the parent's unrelated model.
5. A callback reports the requested and substituted model to the user (`551326-551337`).

**Why this approach:**
- Explicit input should win for ordinary agents, but a fork must preserve parent semantics.
- Same-family fallback retains task intent better than a generic parent fallback.
- Surfacing substitution avoids invisible quality/cost changes.
- More policy-resolution branches increase complexity but keep model selection deterministic across
  local and background routes.

**Key insight:** Inheritance is a precedence chain constrained by policy, not a single “copy parent
model” rule.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `filterToolsForAgent` (`K5b`) - applies role, depth, and async tool restrictions.
- `runSubagentStream` (`$5`) - resolves permissions, MCP tools, and zero-tool admission.
- `isPathOutsideIsolationRoot` (`xBd`) - validates canonical cwd containment.
- `detectGitRedirectOutsideIsolation` (`bUd`) - finds Git command redirection outside the worktree.
- `sanitizeSubagentText` (`dkr`) - sanitizes scalar output and adds warning markers.
- `sanitizeSubagentContent` (`k6d`) - sanitizes structured text blocks.
- `recordSubagentOutputFindings` (`I6d`) - emits aggregated scrubber telemetry.
