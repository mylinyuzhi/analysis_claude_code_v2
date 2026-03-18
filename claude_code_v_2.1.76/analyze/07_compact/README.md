# Context Compaction Module (07_compact)

## Overview

**Context Compaction** is a critical subsystem in Claude Code v2.1.76 that manages the LLM's finite context window. It ensures conversations can continue indefinitely by intelligently summarizing older parts of the conversation while preserving essential state (files, tasks, plans, skills, todos).

The system implements a **three-tier compaction architecture**:

1. **Microcompaction** - Lightweight, pre-compaction optimization (no LLM call)
2. **Session Memory Compaction** - Uses pre-built session notes as summary (no LLM summarization)
3. **Standard Compaction** - LLM-based conversation summarization (universal fallback)

## Key Characteristics

- **State Anchoring** - Critical context survives compaction via attachment messages
- **Circuit Breaker** - 3 consecutive failures disable auto-compaction
- **Threshold-Based Triggers** - Multi-level thresholds (warning, error, auto-compact, blocking)
- **Hook Integration** - PreCompact and SessionStart hooks for customization
- **Token Budgeting** - Strict limits prevent unbounded growth

## Module Structure

| Document | Purpose |
|----------|---------|
| [implementation.md](./implementation.md) | High-level architecture and compaction lifecycle |
| [trigger_mechanism.md](./trigger_mechanism.md) | Threshold calculations and trigger logic |
| [microcompaction.md](./microcompaction.md) | Lightweight token optimization without LLM |
| [session_memory_compaction.md](./session_memory_compaction.md) | Session notes-based compaction path |
| [standard_compaction.md](./standard_compaction.md) | Full LLM-based summarization |
| [state_preservation.md](./state_preservation.md) | Collectors for files, tasks, plans, skills, todos |
| [hooks_system.md](./hooks_system.md) | PreCompact and SessionStart hook execution |
| [slash_command.md](./slash_command.md) | `/compact` command implementation |
| [reminder_and_boundary.md](./reminder_and_boundary.md) | Compaction reminder and boundary markers |
| [query_pipeline_integration.md](./query_pipeline_integration.md) | Integration with agent query loop |
| [file_read_tracking.md](./file_read_tracking.md) | LRU-based file state tracking |
| [file_tracker.md](./file_tracker.md) | File preservation during compaction |
| [message_selection.md](./message_selection.md) | Message selection algorithms |
| [edge_cases_and_failures.md](./edge_cases_and_failures.md) | Error handling and edge cases |
| [configuration_and_telemetry.md](./configuration_and_telemetry.md) | Configuration options and telemetry events |

## Architecture: Three-Tier Compaction

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Agent Main Loop                                     │
│              (After each assistant response)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TIER 1: Microcompaction (gm)                              │
│                                                                              │
│  • Replace large tool results with file references                           │
│  • Replace orphaned images with "[image]" placeholder                        │
│  • No LLM call - purely mechanical optimization                             │
│  • Saves 20-50% tokens in tool-heavy conversations                          │
│                                                                              │
│  Trigger: Always runs before full compaction check                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  shouldTriggerAutoCompaction  │
                    │         (CmY)                 │
                    │                               │
                    │  • Auto-compact enabled?      │
                    │  • tokens >= threshold?       │
                    │  • Special session type?      │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                 No Trigger                      Trigger
                    │                               │
                    ▼                               ▼
            Continue Loop    ┌─────────────────────────────────────┐
                             │    autocompactDispatcher (sqq)      │
                             │                                      │
                             │    Circuit Breaker Check             │
                             │    (>= 3 failures? → skip)          │
                             └─────────────────────────────────────┘
                                                │
                    ┌───────────────────────────┴───────────────────────────┐
                    │                                                       │
                    ▼                                                       ▼
┌───────────────────────────────────────────┐    ┌───────────────────────────────────────────┐
│   TIER 2: Session Memory Compaction       │    │   TIER 3: Standard Compaction             │
│              (lE1)                        │    │              (mf6)                        │
│                                           │    │                                           │
│  • Use existing session notes file        │    │  • LLM-based summarization                │
│  • No LLM summarization call              │    │  • Streaming API call                     │
│  • Faster and cheaper                     │    │  • Higher cost but always available       │
│  • Feature flags required:                │    │  • Universal fallback                     │
│    - tengu_session_memory                 │    │                                           │
│    - tengu_sm_compact                     │    │                                           │
│                                           │    │                                           │
│  Falls through to Tier 3 if:              │    │  Used when:                               │
│  • Feature disabled                       │    │  • Session memory unavailable             │
│  • No session notes                       │    │  • Session memory fails                   │
│  • Threshold exceeded                     │    │  • Feature flags disabled                 │
└───────────────────────────────────────────┘    └───────────────────────────────────────────┘
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────────┐
                        │       State Preservation            │
                        │                                     │
                        │  collectFilesToKeep   (fqq)         │
                        │  collectTasksToKeep   (Nqq)         │
                        │  collectPlanToKeep    (mE1)         │
                        │  collectSkillsToKeep  (Tqq)         │
                        │  collectPlanModeAttachment (vqq)    │
                        └─────────────────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────────┐
                        │     Boundary Marker Creation        │
                        │          (Ri6)                      │
                        │                                     │
                        │  type: "system"                     │
                        │  subtype: "compact_boundary"        │
                        │  compactMetadata: {...}             │
                        └─────────────────────────────────────┘
                                        │
                                        ▼
                            Return to main loop
                          with compacted context
```

## Key Algorithms

### 1. Threshold Calculation

```
Model's Maximum Context (e.g., 200,000 for Claude Opus 4)
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Effective Context Window                                       │
│  = maxContext - min(maxOutputTokens, MAX_COMPACT_BUFFER)        │
│  = 200,000 - min(64000, 20000) = 180,000                        │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Auto-Compact Threshold                                         │
│  = EffectiveWindow - AUTO_COMPACT_BUFFER_OFFSET                 │
│  = 180,000 - 13,000 = 167,000                                   │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Warning/Error Thresholds                                        │
│  = AutoCompactThreshold - 20,000 = 147,000                      │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Blocking Limit                                                 │
│  = modelMaxContext - 3,000 = 197,000                            │
└────────────────────────────────────────────────────────────────┘
```

### 2. Microcompaction Greedy Selection

```javascript
// Greedy, recency-preserving selection
eligibleToolResults = getAllToolResults(messages);
recentResults = eligibleToolResults.slice(-3);  // Always keep last 3
candidates = eligibleToolResults.slice(0, -3);   // Older results

tokensSaved = 0;
compactedSet = new Set();

for (toolResult of candidates) {  // Oldest first
    if (totalTokens - tokensSaved > threshold) {
        compactedSet.add(toolResult.id);
        tokensSaved += toolResult.tokens;
    }
}
```

### 3. State Anchoring

```javascript
// All collectors run during state preservation phase
attachments = [
    ...await collectFilesToKeep(readFileState, context, 5),  // Max 5 files, 50k tokens
    ...await collectTasksToKeep(context),                     // Completed/failed tasks
    collectTodosToKeep(agentId),                              // Active todos
    collectPlanToKeep(agentId),                               // Plan file
    collectSkillsToKeep()                                     // Invoked skills
].filter(Boolean);

// Attachments injected as system reminder messages after summary
```

## Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_COMPACT_BUFFER` | 20,000 | Reserved buffer for system prompts + response |
| `AUTO_COMPACT_BUFFER_OFFSET` | 13,000 | Tokens below threshold to trigger |
| `TOKEN_WARNING_THRESHOLD` | 20,000 | Warning threshold offset |
| `TOKEN_ERROR_THRESHOLD` | 20,000 | Error threshold offset |
| `BLOCKING_LIMIT_OFFSET` | 3,000 | Hard stop before model max |
| `MAX_AUTO_COMPACT_FAILURES` | 3 | Circuit breaker threshold |
| `MAX_FILES_TO_KEEP` | 5 | Maximum files preserved |
| `MAX_FILE_RESTORE_TOKENS` | 50,000 | Total token budget for files |
| `MAX_TOKENS_PER_FILE` | 5,000 | Per-file token limit |
| `KEEP_RECENT_TOOL_RESULTS` | 3 | Tool results preserved in microcompact |

## Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `DISABLE_COMPACT` | boolean | Disable all compaction |
| `DISABLE_AUTO_COMPACT` | boolean | Disable auto-compact only |
| `DISABLE_MICROCOMPACT` | boolean | Disable microcompaction |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | number (1-100) | Trigger at % of effective window |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | number | Override blocking limit in tokens |
| `ENABLE_CLAUDE_CODE_SM_COMPACT` | boolean | Enable session memory compaction |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Compact section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions:
- `autocompactDispatcher` (sqq) - Main entry point for auto-compaction
- `shouldTriggerAutoCompaction` (CmY) - Threshold check for auto-trigger
- `getCompactionStatus` (mz6) - Calculates usage percentages and threshold status
- `isAutoCompactEnabled` (Xh) - Checks if auto-compact is globally enabled
- `getAutoCompactThreshold` (oc6) - Computes the auto-compact trigger threshold
- `getEffectiveContextWindow` (OF) - Effective context window calculation
- `performFullCompaction` (mf6) - LLM-based full summarization (8-step lifecycle)
- `trySessionMemoryQuickPath` (lE1) - Session notes-based compaction attempt
- `collectFilesToKeep` (fqq) - File state preservation
- `collectTasksToKeep` (Nqq) - Task state preservation
- `collectPlanToKeep` (mE1) - Plan file preservation
- `collectSkillsToKeep` (Tqq) - Skills preservation
- `createCompactBoundaryMessage` (Ri6) - Boundary marker creation

## Integration Points

### Agent Loop Integration

Compaction runs after each assistant response in the agent main loop:

1. **Microcompaction** - Always runs first (lightweight)
2. **Token count** - Recomputed after microcompact
3. **Auto-compact check** - `shouldTriggerAutoCompaction`
4. **Full compaction** - If triggered, runs session memory or standard path
5. **State preservation** - Collect and attach preserved state
6. **Boundary marker** - Create and insert marker message

### Hook Integration

- **PreCompact hooks** - Run before LLM summarization, can inject custom instructions
- **SessionStart hooks** - Run after compaction, can add additional context

### Tool Integration

- **Read tool** - Tracks file reads in `readFileState` for preservation
- **Task system** - Tracks task completion for `collectTasksToKeep`
- **Plan mode** - Tracks plan file for `collectPlanToKeep`

## Design Insights

### State Anchoring Pattern

State anchoring ensures critical context survives compaction by explicitly re-injecting it as attachment messages. Without anchoring, the LLM would "forget" file contents, task results, and plans after compaction.

### Circuit Breaker Pattern

After 3 consecutive compaction failures, auto-compaction is disabled for the session. This prevents infinite retry loops and signals the user to take action (manual compact or new session).

### Greedy Recency Preservation

Microcompaction uses greedy selection with recency preservation - always keeping the last 3 tool results while optimizing for maximum token savings on older results.

### Two-Path Summarization

Session memory compaction and standard compaction represent two different approaches:
- **Session memory**: Reuses existing, curated context (faster, cheaper)
- **Standard**: Generates fresh summary via LLM (more expensive, always available)

This dual-path architecture optimizes for both cost and availability.