# System prompt and reminder architecture in Claude Code 2.1.227

Claude Code has two out-of-band instruction channels: the initial top-level system prompt and dynamic
reminders that are either transported as mid-conversation system messages or compatibility-wrapped
meta user content.

- [`system_prompt_composition_and_reminder_transport.md`](system_prompt_composition_and_reminder_transport.md) -
  modular prompt construction, model capability routing, reminder normalization, cache placement,
  retry demotion, per-turn controls, and human-origin framing.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `buildSystemPrompt` (`H5`) - composes static and session-dependent prompt sections.
- `supportsMidConversationSystem` (`FxS`) - capability resolver for dynamic system-role messages.
- `isSonnet5` (`$ti`) - compatibility-framing predicate.
- `normalizeMessagesForApi` (`Ej`) - converts attachments/reminders into valid conversation structure.
- `repairApiSystemPlacement` (`RmS`) - enforces legal mid-conversation system-message positions.
- `placeCacheBreakpoints` (`b5p`) - chooses message-level prompt-cache markers.
- `runModelRequestWithFallbacks` (`S8e`) - request assembly and compatibility retry ladder.
- `serializeMessagesForApi` (`OZb`) - maps internal messages to API roles and cache controls.
