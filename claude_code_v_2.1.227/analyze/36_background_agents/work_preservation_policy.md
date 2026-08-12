# Background-session work preservation policy

## Version result

The 2.1.221 changelog describes a verified prompt-policy delta, not a new background-session runtime:

- 2.1.220 `buildBackgroundSessionPrompt` at `cli_inner_pretty.js:507957-507968` treats commit, push, and
  opening a draft PR as the default shipping bundle for worktree changes.
- 2.1.227 `buildBackgroundSessionPrompt` (`VQb`, `:527887-527913`) keeps commit/push as the durability
  mechanism but opens a draft PR only when the task calls for one, gives user/task/`CLAUDE.md`/memory Git
  instructions precedence, and always requires a location-oriented final report.
- Work done in the user's checkout remains consent-gated, and the policy is explicitly disabled when the
  background job is acting as a subagent returning work to a caller.

### Worktree Preservation and Handoff Decision

**What it does:** Preserves code created in an ephemeral background worktree without automatically
expanding every task into pull-request publication.

**How it works:**
1. `buildBackgroundSessionPrompt` first verifies `CLAUDE_CODE_SESSION_KIND === "bg"` and a job directory;
   other session kinds receive no background policy block.
2. Isolation mode decides whether to edit in place, require `EnterWorktree`, or acknowledge an already
   isolated worktree. Enforcement for shared-checkout edits is described separately from Git publication.
3. If the job entered its own worktree and changed code, it should commit before finishing because the
   worktree may be deleted with the session.
4. It should push when a remote exists so the durable copy survives outside the runner. Explicit user,
   task, `CLAUDE.md`, or memory instructions reserving Git operations override this default.
5. A draft PR is conditional on the task calling for one. This replaces the 2.1.220 rule that treated a
   draft PR as a standard consequence of any isolated code change.
6. If the job did not create the worktree, or is in the user's checkout, it asks before committing or
   switching branches.
7. The final response must say what was done, where it lives (path, branch, PR, or direct answer), and the
   next command when needed. A subagent returns to its caller instead of applying the user-facing Git and
   report policy.

**Why this approach:**
- An ephemeral worktree creates a data-loss risk that does not exist for ordinary in-place edits; commit
  and push are durability operations in that context.
- A pull request is a collaboration/publication action, not required for durability. Making it task-
  conditional avoids unsolicited PR noise while still preserving the branch.
- Instruction precedence respects repositories where maintainers reserve commits or pushes for humans.
- Asking in an existing checkout protects branches the user may actively control. The trade-off is
  asymmetry: the same `git commit` is autonomous in an agent-created worktree and consent-gated elsewhere.

**Key insight:** The policy separates three concerns that 2.1.220 bundled together: isolate to protect the
checkout, commit/push to preserve ephemeral work, and open a PR only to satisfy the task's delivery goal.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key function in this document:
- `buildBackgroundSessionPrompt` (`VQb`) - isolation, preservation, PR, and handoff guidance.
