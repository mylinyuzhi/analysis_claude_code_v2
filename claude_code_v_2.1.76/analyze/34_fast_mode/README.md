# 34 - Fast Mode

## Overview

Fast Mode enables faster streaming output from Claude Code while using the same underlying model (Claude Opus 4.6). It injects API-level flags to prioritize output speed, with automatic cooldown and fallback when quota is exhausted.

**Introduced**: v2.1.36, with enhancements in v2.1.37

## Key Components

### Mode Toggle
- `/fast` slash command to toggle fast mode on/off
- Persistent preference across session
- UI indicator showing current fast mode status

### API Integration
- API flag injection for faster output streaming
- Same model (does NOT switch to a different model)
- Request-level flag application

### Quota Management
- Cooldown mechanism on quota exhaustion
- Automatic fallback to standard mode when quota exceeded
- Graceful recovery when quota replenishes

### Model Selection
- Integration with model selection logic
- Fast mode flag passed through model routing
- No model change, only output speed optimization

### System Prompt
- System prompt includes fast mode information block
- Informs agent of current fast mode state

## Key Source Files

> To be populated during analysis.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

## Changelog References

- **v2.1.36**: Initial fast mode with `/fast` toggle, API flag injection
- **v2.1.37**: Cooldown/fallback on quota exhaustion, UI indicator
