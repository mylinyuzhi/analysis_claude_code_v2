# Subagent forwarding and CI subprocess hardening

Two concerns meet at the headless boundary: SDK consumers may ask to see nested agent text, while CI
hosts may ask Claude Code to remove credentials and restrict writes for every Bash subprocess. Both
features depend on propagating an option through multiple execution layers without accidentally
capturing stale state.

### Forward-subagent-text option resolution

**What it does:** Resolves whether nested subagent text should be re-emitted into stream-json and
keeps noninteractive thinking display compatible with that choice.

**How it works:**
1. Print/SDK argument assembly resolves `forwardSubagentText` from the explicit option or
   `CLAUDE_CODE_FORWARD_SUBAGENT_TEXT` (`cli_inner_pretty.js:923562-923628`).
2. The resolved boolean is passed into headless runner configuration and every agent execution
   context.
3. `normalizeSubagentThinkingDisplay` (`yEu`, `cli_inner_pretty.js:118487-118492`) normally omits
   summarized thinking in noninteractive sessions.
4. It preserves the configured display when exact tools, forwarding, asynchronous execution, or an
   explicit display selection requires richer intermediate output.
5. Background and foreground agent paths read the same resolved flag.

**Why this approach:**
- One resolved option prevents CLI, environment, and SDK code paths from disagreeing.
- Thinking display is coupled because forwarded text without the expected reasoning/progress framing
  can be misleading.
- Default omission keeps ordinary print output compact.
- The option increases stream volume and may expose subagent narration, so it remains opt-in.

**Key insight:** Forwarding is an output-contract choice that also influences which intermediate
model content is retained.

### Nested progress re-emission

**What it does:** Re-emits depth-two-and-deeper agent progress to a parent SDK stream without changing
the original correlation IDs.

**How it works:**
1. The parent agent loop observes child events while continuing to yield them internally.
2. Direct child assistant/progress content is converted to SDK frames through the shared frame
   projector.
3. When an observed event is itself `agent_progress` and forwarding is enabled, the loop projects it
   again rather than dropping it.
4. The projector preserves parent tool-use/session correlation so the consumer can reconstruct the
   existing nesting graph.
5. The background writer performs the same branch and logs write failure without failing the agent
   task (`cli_inner_pretty.js:482373-482379`).
6. Local execution still yields the original event, so forwarding does not replace internal progress.

**Why this approach:**
- Reusing the frame projector keeps the wire shape identical across depth levels.
- Preserving IDs avoids inventing synthetic nesting that consumers cannot join to tool calls.
- Best-effort background writes prevent a telemetry/output transport problem from cancelling useful
  work.
- Re-emission can increase event volume exponentially with depth, which is why it is gated.

**Key insight:** Nested forwarding is a parallel observation path; it does not mutate the underlying
agent event or its execution semantics.

### Consolidated subprocess scrub state

**What it does:** Provides one lifecycle owner for credential-scrub enablement, sandbox availability,
captured filesystem paths, script-call caps, environment providers, and reset behavior.

**How it works:**
1. `SubprocessEnvState` (`v_s`, `cli_inner_pretty.js:129272-129307`) stores all scrub-related latches
   and mutable counters in one object.
2. `isScrubEnabled` (`U$`) lazily reads `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` once and stores the result.
3. `assertScrubSandboxAvailable` (`H_s`, `cli_inner_pretty.js:129325-129380`) snapshots home, original
   cwd, Claude config paths, GitHub workspace/action/file-command paths, and approved PATH directories
   before Bash execution.
4. It latches sandbox-runtime availability, performs setup, and fails startup with an actionable
   bubblewrap error when hardening was requested but cannot run.
5. `scrubSandboxConfig` (`k_s`, `cli_inner_pretty.js:129565-129665`) reads only the captured path
   snapshot when available, rather than recomputing from a later mutated environment.
6. A single `reset()` clears latches, script counts, providers, and settings-derived environment
   together.

**Why this approach:**
- The 2.1.220 implementation spread related state across module globals and separate testing reset
  functions. Partial reset or duplicated module access could combine a fresh enablement flag with
  stale/missing runner paths.
- A single object makes state lifetime explicit and gives all Bash launch paths the same snapshot.
- Early capture is important in GitHub Actions, where user switching and wrapper setup can change
  HOME, cwd, PATH, or file-command variables.
- The state object is mutable and process-wide, trading functional purity for coherent lifecycle
  ownership in a singleton CLI.

**Key insight:** The target-side action repair is a state-coherence refactor: every hardening decision
and the filesystem paths it protects now share one reset and snapshot boundary.

### Credential environment and deny-write construction

**What it does:** Builds a subprocess environment without provider credentials and a sandbox policy
that denies writes to startup files, configuration, action internals, and repository control files.

**How it works:**
1. `subprocessEnv` (`UM`, `cli_inner_pretty.js:129519-129559`) fast-paths the original environment only
   when no scrub/provider/remote/telemetry/settings overlays are active.
2. Otherwise it merges settings color env, agent proxy env, and remote-safe env before deleting OAuth,
   artifact, provider, background-worker, and telemetry credentials.
3. In full scrub mode it also removes every named credential and corresponding `INPUT_` alias.
4. `scrubSandboxConfig` starts from a small absolute `allowWrite` root set and adds deny-read socket
   paths.
5. Deny-write entries cover shell profiles, package-manager configs, `.claude`, Git config/hooks,
   locks, scripts, action directories, GitHub file-command/event files, SSH/netrc, and a distinct
   `GITHUB_WORKSPACE` when cwd differs.
6. Undefined paths are filtered only after construction.

**Why this approach:**
- Environment deletion prevents simple credential reads; filesystem denial prevents commands from
  persisting code or credentials into files executed by later workflow steps.
- A fast path avoids copying a large environment in ordinary local sessions.
- Denying both repository and runner/action control paths protects hosted-runner workflow integrity.
- Broad deny lists can reject legitimate CI customization, which is the intended trade-off of
  `allowed_non_write_users` hardening.

**Key insight:** The feature enforces two independent barriers—credential non-inheritance and write
confinement. Fixing Bash startup requires their shared state to be valid before either barrier is
constructed.

### Evidence boundary for the 2.1.227 action fix

**What it does:** Separates verified bundle facts from the inferred mapping to the changelog's
“every Bash command failing” symptom.

**How it works:**
1. Verify that permission mode is still forced to `default` when subprocess scrubbing is enabled
   (`cli_inner_pretty.js:117647-117657`, `579471-579498`); this is intended policy, not the regression.
2. Verify that the deny-write root set and most path entries are retained from 2.1.220.
3. Identify the unique target-side refactor: former globals for enablement, sandbox availability,
   paths, counters, and caps are replaced by `SubprocessEnvState`.
4. Verify all current preflight/config/environment helpers read and write that shared object.
5. Attribute the action fix to this coherence boundary only as an inference because no 2.1.226 bundle
   is available for a direct faulty-line diff.

**Why this approach:**
- Release notes establish the symptom and version, but they do not prove which internal line fixed it.
- Labeling retained policy as the fix would be contradicted by the 2.1.220 bundle.
- A confidence boundary lets later analysts replace the inference if a 2.1.226 artifact appears.
- This is more cautious than assigning the closest string literal, but preserves report integrity.

**Key insight:** The `allowed_non_write_users` strings are carryover. The meaningful 2.1.227 delta is
state ownership, and the report does not pretend an unavailable intermediate diff is observable.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `normalizeSubagentThinkingDisplay` (`yEu`) - reconciles noninteractive thinking with forwarding.
- `projectSubagentFrames` (`X9e`) - converts nested progress to SDK frames.
- `SubprocessEnvState` (`v_s`) - central scrub lifecycle owner.
- `isScrubEnabled` (`U$`) - latches hardening enablement.
- `assertScrubSandboxAvailable` (`H_s`) - captures runner paths and validates sandbox support.
- `subprocessEnv` (`UM`) - removes credentials from Bash child environments.
- `scrubSandboxConfig` (`k_s`) - builds filesystem protections from the captured snapshot.
