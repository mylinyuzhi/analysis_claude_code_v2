# Agent foreground/background scheduling policy in 2.1.227

Target anchors: `cli_inner_pretty.js:543591-543637` and `:550745-550759`. Comparison anchors:
`:397986-398031 (220)` and `:398208 (220)`.

## Policy delta

Both 2.1.220 and 2.1.227 default agents to background execution. The meaningful change is the stricter
foreground test, repeated in the short description, long prompt, and input-schema text:

> Foreground is allowed only when the very next action depends on the result **and nothing else could
> usefully happen while it runs**.

The emphasized clause occurs three times in 2.1.227 and zero times in 2.1.220. The old text allowed
foreground whenever the result was needed “before continuing,” which could be interpreted as a mere
preference for sequential order.

### Scheduling Decision Rule

**What it does:** Guides the model to choose foreground only for a true immediate dependency and to
leave independent work interruptible in the background.

**How it works:**
1. Determine whether the agent result gates the assistant's very next action.
2. Determine whether any other useful action can proceed while the agent runs.
3. Use foreground only when the first condition is true and the second is false.
4. Otherwise keep the default background execution.
5. After a background launch, continue independent work or return control to the user.
6. Never sleep, poll, or manufacture the completion notification; it arrives externally in a later
   turn.

**Why this approach:**
- Background execution leaves the conversation available for user steering.
- The conjunctive test prevents “I want the answer next” from becoming unnecessary blocking.
- Foreground remains available for research whose conclusion selects the edit that must happen next.
- More background work can increase coordination overhead and delayed synthesis, but the explicit
  dependency test reserves foreground for cases where that cost is justified.

**Key insight:** Dependency alone is insufficient. Foreground requires both immediate dependency and
the absence of useful parallel work.

### Prompt-Layer Redundancy

**What it does:** Repeats the same scheduling invariant wherever a model may learn tool semantics.

**How it works:**
1. The Agent-tool example explains that background completion arrives in a separate turn.
2. The generated “When to use” section states the foreground/background rule.
3. The `run_in_background` schema description repeats it at argument-selection time.
4. A separate “Don't race” section prohibits predicting pending results.
5. Context-specific branches remove the parameter entirely where only synchronous subagents are
   supported.

**Why this approach:**
- Models may rely on tool description, long prompt, or field schema at different stages; repeating the
  rule reduces instruction loss.
- Centralizing the prose would reduce duplication but may not place it near the decision token.
- Duplication risks future wording drift; 2.1.227 updates all three core sites consistently.

**Key insight:** The policy is implemented as model guidance, while environment branches enforce only
parameter availability. The runtime does not infer whether “nothing else useful” exists.

## Critical branches

- In environments where `run_in_background` is unavailable, the schema omits it and prompt text says
  only synchronous subagents are supported.
- Teammate contexts omit `name` because teammates cannot spawn teammates.
- Remote isolation is always background, independent of the model's requested value.
- On the Pro plan, a separate prompt branch says not to spawn unless the user asks. That is an
  authorization policy layered above scheduling; it does not change the background default after a
  spawn is authorized.
- A pending background result must not be fabricated. “Still running” is the only valid status before
  the external completion message arrives.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

No new symbol mapping is asserted in this document. The stable evidence is the three synchronized
prompt/schema literals at `:543591`, `:543637`, and `:550745`.
