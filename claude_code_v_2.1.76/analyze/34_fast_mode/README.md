# Fast Mode (Module 34)

> **Version**: Claude Code v2.1.76
> **Status**: REFACTORED - All symbols cross-validated against source code on 2026-03-27.
> **Purpose**: Toggleable API-level optimization that enables faster streaming output from Claude Opus 4.6 via beta flag injection, with automatic cooldown and fallback on quota exhaustion.
>
> **Symbol Validation Status**: ✅ COMPLETE - All symbols cross-validated against source chunks.
> **Integration Status**: ✅ COMPLETE - Cross-module integration documented.
> **Related Documents**: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

## Quick Links

| Document | Description |
|----------|-------------|
| [implementation.md](./implementation.md) | Core toggle, state management, UI display, `/fast` command |
| [routing_logic.md](./routing_logic.md) | 5-condition gate, model locking, auto-disable on model switch |
| [api_integration.md](./api_integration.md) | Beta flag injection, request parameters, cooldown, error handling |

## Module Overview

Fast Mode is an API-level optimization for Claude Code that enables faster streaming output from **the same Opus 4.6 model** — it does **NOT** switch to a different model. When toggled on via `/fast` or `Alt+O`, the client injects a `"fast-mode-2026-02-01"` beta header and `speed: "fast"` parameter into API requests. This triggers server-side optimizations that reduce time-to-first-token (TTFT) at the cost of extended thinking.

**Key insight**: Fast mode is a **routing optimization on the same model**, not a model switch to Haiku or any smaller model.

**Introduced**: v2.1.36, with enhancements in v2.1.37

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FAST MODE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    User Interface                               │ │
│  │  /fast command [chunks.163.mjs]                                │ │
│  │  Alt+O keybinding [chunks.153.mjs]                             │ │
│  │  Model picker integration [chunks.166.mjs]                     │ │
│  │  Status display [chunks.151.mjs]                               │ │
│  └────────────────────────┬───────────────────────────────────────┘ │
│                           │                                          │
│  ┌────────────────────────▼───────────────────────────────────────┐ │
│  │                    State Management                             │ │
│  │  Dl8() toggle [chunks.163.mjs:639]                             │ │
│  │  Mm() state computation [chunks.56.mjs:2821]                   │ │
│  │  TO8() cooldown state machine [chunks.56.mjs:2723]             │ │
│  │  AppState.fastMode boolean                                      │ │
│  └────────────────────────┬───────────────────────────────────────┘ │
│                           │                                          │
│  ┌────────────────────────▼───────────────────────────────────────┐ │
│  │                    API Integration                              │ │
│  │  5-condition gate [chunks.171.mjs:148]                         │ │
│  │  Beta: "fast-mode-2026-02-01" (_LA) [chunks.18.mjs:1847]      │ │
│  │  Request field: speed = "fast"                                  │ │
│  │  Model stays: Opus 4.6 (unchanged)                             │ │
│  └────────────────────────┬───────────────────────────────────────┘ │
│                           │                                          │
│  ┌────────────────────────▼───────────────────────────────────────┐ │
│  │                    Error Handling                               │ │
│  │  Cooldown trigger kf7() [chunks.56.mjs:2736]                  │ │
│  │  Retry loop [chunks.89.mjs:3-93]                               │ │
│  │  4-path fallback (overage/short-retry/cooldown/disabled)       │ │
│  │  Auto-recovery on cooldown expiry                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Functions

| Function | Obfuscated | Location | Purpose |
|----------|-----------|----------|---------|
| `toggleFastMode` | `Dl8` | chunks.163.mjs:639 | Core toggle: persist setting, auto-switch to Opus if needed |
| `toggleFastModeShortcut` | `N1z` | chunks.163.mjs:806 | Shortcut-triggered toggle with user message |
| `computeFastModeState` | `Mm` | chunks.56.mjs:2821 | Compute `"off"` / `"on"` / `"cooldown"` for agent loop |
| `isFastModeNotDisabled` | `Dq` | chunks.56.mjs:2654 | Check `!process.env.CLAUDE_CODE_DISABLE_FAST_MODE` |
| `isFastModeAvailable` | `yj` | chunks.56.mjs:2658 | `Dq() && ra() === null` (no blocking reason) |
| `isOpusCompatible` | `FH` | chunks.56.mjs:2711 | Model string includes `"opus-4-6"` (case-insensitive) |
| `isCooldownActive` | `Jm` | chunks.56.mjs:2817 | `TO8().status === "cooldown"` |
| `getCooldownState` | `TO8` | chunks.56.mjs:2723 | State machine with auto-recovery on expiry |
| `triggerCooldown` | `kf7` | chunks.56.mjs:2736 | Set cooldown with `{status, resetAt, reason}` |
| `resetCooldown` | `aq6` | chunks.56.mjs:2751 | Reset to `{status: "active"}` |
| `getSmallFastModel` | `lH` | chunks.176.mjs:1234 | Env var lookup (separate from fast mode feature) |
| `getDefaultOpusModel` | `Bx6` | chunks.56.mjs:2698 | Returns `"opus"` or `"opus[1m]"` |

## State Machine

```
┌──────────┐    User toggles /fast ON     ┌──────────┐
│   OFF    │ ────────────────────────────▶ │    ON    │
│          │                               │          │
│ fastMode │ ◀──────────────────────────── │ fastMode │
│ = false  │    User toggles /fast OFF     │ = true   │
│          │    or switches non-Opus model  │ + beta   │
└──────────┘                               └────┬─────┘
                                                │
                        429/529 error           │
                        retry-after >= 20s      │
                                                ▼
                                          ┌──────────┐
                                          │ COOLDOWN │
                                          │          │
                                          │ fastMode │
                                          │ = true   │
                                          │ no beta  │
                                          └────┬─────┘
                                                │
                        Date.now() >= resetAt   │
                        (10-30 min)             │
                                                ▼
                                          Back to ON
                                          (auto-recovery)
```

## Agent Loop Integration

The agent receives fast mode state via system message data (`chunks.185.mjs:1973`):

```javascript
systemMessageData.fast_mode_state = Mm(model, state.fastMode);
// Returns: "off" | "on" | "cooldown"
```

Schema definition (`chunks.131.mjs:2844`):
```javascript
z.enum(["off", "cooldown", "on"]).describe(
    "Fast mode state: off, in cooldown after rate limit, or actively enabled."
)
```

System prompt informs agent (`chunks.168.mjs:2209`):
> *"Fast mode for Claude Code uses the same Claude Opus 4.6 model with faster output. It does NOT switch to a different model. It can be toggled with /fast."*

## Telemetry Events

| Event | Trigger | Location |
|-------|---------|----------|
| `tengu_fast_mode_toggled` | User toggle (shortcut or picker) | chunks.163.mjs:682, 812 |
| `tengu_fast_mode_picker_shown` | Fast mode picker UI displayed | chunks.163.mjs:832 |
| `tengu_fast_mode_fallback_triggered` | Cooldown triggered on API error | chunks.56.mjs:2744 |
| `tengu_fast_mode_overage_rejected` | Overage rejected by API | chunks.56.mjs:2806 |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key constants:
- `_LA` = `"fast-mode-2026-02-01"` — Beta header string (chunks.18.mjs:1847)
- `Ok` = `"Opus 4.6"` — Display name (chunks.56.mjs:2935)
- `Bb9` = `1800000` (30 min) — Default cooldown duration (chunks.89.mjs:227)
- `Fb9` = `600000` (10 min) — Minimum cooldown floor (chunks.89.mjs:229)
- `gb9` = `20000` (20 sec) — Short retry-after threshold (chunks.89.mjs:231)

## Changelog References

- **v2.1.36**: Initial fast mode with `/fast` toggle, API beta flag injection
- **v2.1.37**: Cooldown/fallback on quota exhaustion, UI indicator

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
