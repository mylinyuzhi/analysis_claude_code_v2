# System prompt composition and reminder transport

## Scope and version assessment

This report re-derives the 2.1.227 system-prompt subsystem rather than copying the 2.1.220 symbol map.
The original module's main conclusions remain valid: Claude Code treats reminders as harness-owned data,
routes capable models through a mid-conversation system role, maintains a Sonnet 5 presentation shim,
and can demote that role for gateways that reject it. The current build adds substantially more modular
prompt sections for focus view, autonomous/background operation, current tools, output styles, worktrees,
and connected features.

### Modular initial-system-prompt composition

**What it does:** Builds the initial system prompt from stable behavior policy and only the dynamic
sections that apply to the current session, model, permission mode, tools, UI, and host.

**How it works:**
1. `buildSystemPrompt` (`H5`, `cli_inner_pretty.js:527648-527707`) receives the active tool set,
   model, agent context, and options. It resolves model family/capabilities before selecting sections.
2. Independent section builders produce the harness contract, task behavior, action safety, tool-use
   guidance, subagent guidance, tone, output style, language, autonomous-mode policy, focus-view policy,
   worktree/background-session rules, model identity, scratchpad, and host-provided additions.
3. Asynchronous inputs—project instructions, output-style data, git/environment state, and integration
   context—are fetched in parallel where independent.
4. Sections return text or `null`; the composer removes absent sections rather than leaving placeholder
   headers. This prevents an unavailable feature from being mentioned to the model.
5. Tool-specific guidance is derived from the actual tool-name set. For example, task tracking,
   dedicated file/search tools, Agent, Workflow, Skill, and question tools are mentioned only when the
   corresponding tool is callable.
6. Session kind changes the contract: a background job receives durable-output and worktree-preservation
   guidance; focus view suppresses progress narration because the user cannot see it; autonomous hosts
   discourage questions that cannot be answered live.
7. `splitSystemPromptForCaching` (`Wya`, `:528178-528252`) separates billing header, known fixed
   blocks, global-cacheable content, and organization/session-dependent content at an explicit boundary.

**Why this approach:**
- Conditional sections keep the prompt truthful. Mentioning a tool, UI surface, or interaction channel
  that is unavailable causes impossible actions and wasted turns.
- Small builders make experiments and host variants independently testable while preserving a single
  ordered prompt contract.
- Parallel dynamic reads reduce startup latency, but all outputs are assembled in deterministic order
  to preserve cache keys.
- The trade-off is many feature-gated fragments. A centralized composer and explicit cache boundary
  prevent that flexibility from turning into nondeterministic prompt order.

**Key insight:** The system prompt is compiled from runtime capabilities. It is not one static string
with feature descriptions that the model must learn to ignore.

### Mid-conversation system capability and compatibility framing

**What it does:** Decides whether dynamic harness instructions use a genuine `role: "system"` message
and whether their text remains wrapped in legacy `<system-reminder>` tags.

**How it works:**
1. `supportsMidConversationSystem` (`FxS`, `cli_inner_pretty.js:612828-612848`) first disables the
   feature for HIPAA mode, then honors the force override and per-model capability override.
2. Known Claude 3 and Claude 4/4.x families that do not support the API feature are explicitly denied.
   Models with `mid_conv_system`, Mythos 5, or a supported future generation are admitted.
3. Results are memoized per model through `aIn` (`:612825-612827`), so a turn cannot oscillate after
   messages have already been normalized.
4. `isSonnet5` (`$ti`, `:612850-612852`) remains a presentation compatibility predicate even though
   Sonnet 5 is transport-capable.
5. `usesNativeMidConversationFraming` (`Z3p`, initialized at `:528049-528053`) requires capability and
   excludes Sonnet 5 and Opus 4.8-like compatibility cases.
6. The initial prompt's framing sentence (`e5p`, `:527502-527506`) is selected from that same decision:
   native models are told that system updates arrive in system turns; compatibility models are told
   how `<system-reminder>` tags should be interpreted.
7. The request adds the `mid-conversation-system-2026-04-07` beta only when the normalized conversation
   actually needs the feature.

**Why this approach:**
- Capability is a transport fact, while framing is a model-behavior compatibility choice. Keeping them
  separate permits Sonnet 5 to use the secure system role without abruptly changing a payload shape it
  was tuned to understand.
- Explicit exclusions prevent a generic “new enough” heuristic from sending an unsupported role to a
  provider alias that resolves to an older model.
- Memoization keeps normalization, prompt wording, and beta headers coherent across retries.
- The cost is a non-obvious three-state model: unsupported, supported/native-framed, and
  supported/legacy-framed.

**Key insight:** Sonnet 5's carve-out is not a role-level disable. The system role is restored, but the
payload and explanatory prompt retain compatibility wrapping.

### Reminder normalization and legal message placement

**What it does:** Converts internal attachments, task notifications, hook/system events, and tool-result
reminders into a valid API conversation without confusing harness context with human input.

**How it works:**
1. `normalizeMessagesForApi` (`Ej`, `cli_inner_pretty.js:581766-582006`) begins from the replayable
   transcript and removes progress/internal state that should never reach the model.
2. User messages from `task-notification` origins are prefixed by either the background-event banner
   (`aks`, `:195714-195717`) or scheduled-trigger banner (`lks`, `:195718-195721`) before merging.
3. Attachments are rendered to meta messages. When mid-conversation system is enabled, textual
   reminders are accumulated until a legal boundary rather than injected into an arbitrary user block.
4. The accumulator flushes by appending to an adjacent `api_system` message when possible. Otherwise it
   creates native system content or a meta user message wrapped by `wrapInSystemReminder` (`VH`,
   `:582731-582735`).
5. Sonnet 5 compatibility mode wraps each reminder before placing it inside the system-role carrier;
   native framing places raw reminder text in the carrier.
6. Reminders embedded in selected MCP tool results can be extracted, deduplicated, and re-homed as
   harness messages; the remaining tool result retains normal data.
7. Consecutive user messages, tool-result ordering, repeated assistant messages, thinking/tool-use
   ordering, media rejected by an API, and truncated-file notices are repaired in the same pass.
8. `repairApiSystemPlacement` (`RmS`, `:582107-582133`) merges adjacent system messages and validates
   that a system turn follows a user message and is followed by an assistant/system/end boundary. An
   invalid placement is demoted to a meta user reminder.

**Why this approach:**
- The API imposes role-order constraints, while internal events can happen at any time. Buffering lets
  the runtime preserve event meaning without emitting an invalid message sequence.
- Extracting harness reminders from tool content makes their authority explicit and prevents the tool
  result that happened to carry them from defining their provenance.
- A final placement repair provides a safe compatibility fallback for unusual replay/resume histories.
- The trade-off is a complex normalization pass that handles both semantic provenance and API syntax;
  separating those into independent passes would repeatedly split/merge the same messages.

**Key insight:** Internal event time and API message position are different. Claude Code buffers and
re-homes reminders so authority is preserved while role ordering stays valid.

### Prompt-cache breakpoint placement and system-tail promotion

**What it does:** Places cache controls on stable conversation boundaries and promotes the final marker
onto an `api_system` tail when the provider supports it.

**How it works:**
1. `placeCacheBreakpoints` (`b5p`, `cli_inner_pretty.js:528550-528598`) scans messages for eligible
   non-thinking content, fork points, and recent stable turns.
2. It computes marker indices rather than mutating content immediately. Fork pinning and skip-write
   policy can override the normal recent-message choices.
3. A trailing `api_system` message may receive the final cache marker when the provider/runtime latch
   says system-tail caching is safe.
4. `serializeMessagesForApi` (`OZb`, `:531932-531966`) maps internal user/assistant/system records to API
   roles and adds `cache_control` only at selected indices.
5. System prompt blocks are separately split into global, organization, and uncached scopes by `Wya`;
   message caching therefore does not invalidate the stable initial prompt unnecessarily.
6. Telemetry records total messages, marker count, fork pinning, and whether cache writes were skipped.

**Why this approach:**
- A marker on the actual trailing system update prevents that update from being billed fresh on every
  request while preserving the longest stable prefix.
- Computing indices before serialization keeps caching policy independent of role-specific API shapes.
- Scope-aware initial blocks allow broadly stable instructions to be reused without sharing dynamic
  organization/session data too widely.
- Some gateways reject cache control on system-role content, so optimization must remain reversible.

**Key insight:** The last dynamic system message is part of the cacheable prefix, not an uncached suffix.
Promotion makes that fact explicit while retaining a demotion escape hatch.

### Compatibility retry and cache-demotion ladder

**What it does:** Retries a rejected request with the smallest semantic downgrade needed for a model or
gateway that does not fully implement Claude's system-message/cache extensions.

**How it works:**
1. `runModelRequestWithFallbacks` (`S8e`, `cli_inner_pretty.js:529062-531926`) builds normalized messages,
   tool schemas, system blocks, betas, thinking/effort controls, and provider request options.
2. A role-support rejection triggers the mid-conversation-system fallback: internal `api_system`
   records are demoted to meta user reminders, the beta is removed, and the request is rebuilt.
3. A narrower proxy rejection of `cache_control` on the system tail sets a conversation latch and moves
   the cache breakpoint to the trailing ordinary message (`retry:api-system-cache-demote`,
   `:529934-529944`).
4. Retry classifiers require recognizable validation/error shapes; arbitrary 400s do not discard
   features and retry blindly.
5. Per-turn effort carried on system messages is stripped or rebuilt consistently when the carrier is
   demoted, preventing an output-control object from surviving without its required beta/role.
6. Successful promotion sets an “OK” latch so later calls avoid probing the same capability. Sticky beta
   state makes all turns in the conversation use the same negotiated form.
7. Other reliability fallbacks continue through their own classifiers; each arm is bounded so a server
   cannot cause an infinite sequence of semantically weaker retries.

**Why this approach:**
- Custom gateways frequently lag the first-party API. A precise retry preserves functionality without
  globally disabling the stronger transport for all gateways.
- Separate role and cache-tail failures matter: a gateway may accept system messages but reject only a
  cache annotation.
- Conversation latches avoid paying one failed probe per turn and keep cache keys stable.
- The trade-off is retry latency on the first incompatible request, preferable to refusing to work
  through the gateway or permanently using spoofable user-role reminders.

**Key insight:** Fallback is feature negotiation by observed validation failure. Claude Code demotes only
the rejected layer—cache marker first, whole system carrier only when necessary.

### Per-turn effort as a system control channel

**What it does:** Changes model effort for an individual turn without rewriting the initial system
prompt or treating control metadata as user content.

**How it works:**
1. Per-turn effort state is resolved against model capability and current turn options.
2. `buildPerTurnEffortSystemMessage` (`C5p`, `cli_inner_pretty.js:528657-528676`) inserts or updates an
   `api_system` record with `outputConfig` rather than textual instructions.
3. `serializeMessagesForApi` maps `outputConfig` to the system message's `output_config` field and the
   request includes the `per-turn-control-2026-07-01` beta.
4. Empty textual content is allowed because the carrier's purpose may be control metadata only.
5. Cache fingerprinting includes the effort value (`api_system` output configuration at `:353783`), so
   different effort decisions cannot incorrectly reuse an incompatible request prefix.
6. Unsupported/gateway fallback strips the control in lockstep with system-message demotion.

**Why this approach:**
- Structured output control is less ambiguous than telling the model “try harder” in natural language.
- A dynamic system carrier aligns the setting with the exact turn and avoids invalidating the large
  initial system prompt.
- Including effort in cache identity prevents subtle behavioral/cache mismatches.
- The feature depends on the system role, so compatibility fallback may lose per-turn granularity; that
  is a deliberate functionality-versus-connectivity trade-off.

**Key insight:** Mid-conversation system messages are both an instruction channel and a typed request-
control carrier.

### Human-origin taxonomy and automated-turn framing

**What it does:** Prevents background events, scheduled prompts, peer messages, compacted history, and
agent relays from being mistaken for fresh user consent.

**How it works:**
1. `isExplicitHumanOrigin` (`HSo`, `cli_inner_pretty.js:121639-121640`) accepts only `{kind:"human"}`.
   Other helpers intentionally have different compatibility sets for unclassified legacy messages,
   auto-continuation, and ordinary visible user content.
2. `isGenuineHumanMessage` (`Ohr`, `:121667-121669`) requires a non-meta user message, no tool result,
   no compact summary, and human-or-legacy-human origin.
3. Background task notifications receive a banner that states no human input occurred and that earlier
   assistant claims are not consent (`:195726-195731`).
4. Scheduled triggers receive a different banner: the stored prompt is the assigned task and not
   mid-conversation injection, but storage does not prove live human authorship or grant new approval
   (`:195732-195739`).
5. Agent launcher messages are described in the system prompt as task direction but never user consent
   (`:527881`). Peer/observer origins remain explicit in transcript state rather than being normalized
   to human.
6. Features that require an actual opt-in, such as high-autonomy keyword gates or permission consent,
   call the strict origin predicate rather than merely checking `role: user`.

**Why this approach:**
- Many internal events must use a user-shaped API message for sequencing, but API role is not proof of
  human agency.
- Separate scheduled/background banners encode different trust facts: scheduled text is authoritative
  task scope, while an unsolicited result notification is context only.
- Compatibility helpers allow old transcripts without origin metadata to resume; security-sensitive
  consumers use the strict predicate.
- The trade-off is several similar origin helpers. Their differing acceptance sets are intentional and
  should not be merged into one generic `isUser` check.

**Key insight:** `role: "user"`, visible user-shaped text, task authority, and fresh human consent are four
different concepts in the harness.

## 2.1.220 to 2.1.227 change assessment

- The fundamental mid-conversation-system capability, Sonnet 5 presentation shim, cache-tail promotion,
  and gateway demotion architecture are retained.
- The initial prompt is more modular and context-sensitive in 2.1.227. Focus view (2.1.221) now has an
  explicit visibility contract, and background-job guidance reflects the post-2.1.221 commit/push/draft-
  PR preservation policy.
- The task-notification and scheduled-trigger origin distinction remains central and is now consumed by
  the richer permission classifier and cross-session messaging paths.
- Per-turn effort is still transported through `api_system`, with the current beta identifier and cache
  fingerprinting integrated into the request pipeline.
- The 2.1.224 Bash-description wording change belongs to tool-definition construction, not reminder
  transport. It is cross-referenced from `04_tools`/future tool-description analysis rather than claimed
  as a system-message algorithm change.
- No 2.1.225-2.1.227 release note identifies a replacement for this architecture. The target shows
  incremental prompt-policy growth, not removal of the dual-channel design.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `buildSystemPrompt` (`H5`) - ordered prompt-section compiler.
- `splitSystemPromptForCaching` (`Wya`) - global/org/uncached system-block partition.
- `supportsMidConversationSystem` (`FxS`) - model/provider capability decision.
- `usesNativeMidConversationFraming` (`Z3p`) - excludes compatibility-framed models.
- `normalizeMessagesForApi` (`Ej`) - provenance-aware transcript normalization.
- `repairApiSystemPlacement` (`RmS`) - merges or demotes invalid system turns.
- `wrapInSystemReminder` (`VH`) - compatibility carrier text.
- `placeCacheBreakpoints` (`b5p`) - stable message marker selection.
- `buildPerTurnEffortSystemMessage` (`C5p`) - typed turn-local control carrier.
- `runModelRequestWithFallbacks` (`S8e`) - request/retry feature negotiation.
- `serializeMessagesForApi` (`OZb`) - final API role/cache/output-control mapping.
- `isExplicitHumanOrigin` (`HSo`) / `isGenuineHumanMessage` (`Ohr`) - consent-sensitive provenance.
