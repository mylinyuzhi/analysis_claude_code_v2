# Proactive Mode Analysis (Claude Code 2.1.76)

> Proactive mode is a new experimental agent behavior where the agent can take initiative without explicit user prompts. Rather than the standard request-response cycle, proactive mode enables Claude to act autonomously.

## Overview

This feature is gated behind the `tengu_vinteuil_phrase` feature flag and uses a **simplified system prompt** rather than the full system prompt used in standard mode.

## Feature Flag and Gating Mechanism

### `tengu_vinteuil_phrase` Flag

**What it does:** Controls whether proactive mode and the simplified system prompt path are activated.

**How it works:**
1. The flag is checked via `x8("tengu_vinteuil_phrase", false)`, which reads from GrowthBook's cached feature flags
2. There is a **dual gating** mechanism -- two independent paths can trigger the simplified prompt:
   - **GrowthBook flag**: `x8("tengu_vinteuil_phrase", false)` returns true
   - **Client data cache**: `COq()` returns `"tengu_vinteuil_phrase"` from server-side client data
3. Either path results in the same outcome: routing to the simplified system prompt builder `hOq`

---

## System Prompt Path: Simplified vs Full

### Simplified System Prompt (`hOq`)

**What it does:** Builds a streamlined system prompt with fewer sections, used when proactive mode or the simplified prompt flag is active.

**Sections in simplified prompt:**
| Section Builder | Readable Name |
|----------------|---------------|
| `L9z` | `buildIntroSection` |
| `R9z` | `buildSystemSection` |
| `y9z` (conditional) | `buildCodingInstructions` |
| `C9z` | `buildCarefulActionsSection` |
| `S9z` | `buildToolUsageSection` |
| `h9z` | `buildToneStyleSection` |

**Sections removed in simplified:**
| Section Builder | Readable Name |
|----------------|---------------|
| `f9z` | `buildTaskManagement` |
| `V9z` | `buildAskQuestions` |
| `xOq` | `buildHooksNotice` |
| `N9z` | `buildDoingTasks` |
| `T9z` | `buildSystemReminders` |
| `v9z` | `buildToolPolicy` |
| `$T6` | `SECURITY_POLICY` |
| `E9z` | `buildTodoReminder` |
| `k9z` | `buildCodeReferences` |

**Why this approach:**
- The simplified prompt removes verbose examples, detailed tool policies, and redundant reminders
- Reduces token usage significantly for proactive autonomous turns
- Retains key sections (intro, system rules, careful actions, tool usage, tone)
- Notably changes agent self-identification from "CLI tool" to "interactive agent"

---

## REPL Integration

### Proactive State Subscription

**What it does:** The REPL component subscribes to proactive state changes and uses the active/inactive state to control tool filtering and UI behavior.

**How it works:**
1. On mount, reads `uE6?.isProactiveActive()` to initialize state
2. Sets up subscription via `uE6.subscribeToProactiveChanges()`
3. Tool list is re-computed via `tD(B)` (getFilteredTools) when proactive mode toggles
4. The proactive controller is a module-level singleton initialized to `null`

**Key insight:** Five separate module-level references (`uE6`, `P9z`, `M8z`, `ajz`, `sGq`) to the proactive controller exist across different chunks due to code splitting.

---

## UI Adaptations

### Terminal Progress Bar Disabled

**What it does:** The terminal progress bar is disabled when proactive mode is active.

**How it works:**
1. In the message display component: `terminalProgressBarEnabled && !isProactiveActive`
2. When proactive mode is active, `M8z?.isProactiveActive()` returns `true`, causing progress bar to be `false`

### Prompt Suggestion Suppressed

**What it does:** The input prompt suggestion is suppressed when proactive mode is active.

**How it works:**
1. The placeholder text logic checks: `turnCount < 1 && promptSuggestionEnabled && !proactiveController?.isProactiveActive()`
2. If proactive mode is active, the prompt suggestion returns `undefined`

### Status Bar: Next Tick Indicator

**What it does:** The status bar shows whether a proactive tick is scheduled.

**How it works:**
1. Uses React's `useSyncExternalStore` to subscribe to the proactive controller's state
2. Reads `sGq?.getNextTickAt` to determine if a next proactive tick is scheduled
3. If non-null, shows that a tick is pending

---

## Behavioral Differences Summary

| Aspect | Standard Mode | Proactive Mode |
|--------|--------------|----------------|
| **System Prompt** | Full (12+ sections) | Simplified (6 sections) |
| **Self-identification** | "CLI tool" | "interactive agent" |
| **Environment Info** | XML tags with background | Bullet-point list |
| **Task Management** | Detailed todo examples | Omitted |
| **Tool Policy** | Verbose with examples | Simplified routing only |
| **Progress Bar** | Enabled | Disabled |
| **Prompt Suggestions** | Shown on first turn | Suppressed |

---

## Trade-offs

**Token efficiency vs instruction completeness:** The simplified prompt drops ~50% of instructions, reducing latency and cost for autonomous turns, but with less guidance for complex tasks.

**Graceful degradation:** Every proactive controller reference uses optional chaining (`?.`) and null-coalescing (`??`). If the controller is never initialized, all proactive-dependent behaviors silently default to standard mode.

**Single controller, multiple references:** The proactive controller is referenced as 5 different identifiers across chunks, all initialized to `null`. This is a side-effect of code splitting.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and symbols in this document:
- `buildSystemPrompt` (dZ) - Main system prompt entry point
- `buildSimplifiedSystemPrompt` (hOq) - Simplified prompt builder for proactive mode
- `getFeatureFlag` (x8) - GrowthBook feature flag reader
- `getClientDataPromptVariant` (COq) - Reads system_prompt_variant from client data
- Proactive controller references: `uE6`, `P9z`, `M8z`, `ajz`, `sGq` across chunks
