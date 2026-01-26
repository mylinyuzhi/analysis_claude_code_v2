# Compact System Documentation (v2.1.7)

This directory contains comprehensive analysis of Claude Code's context management and compaction system.

## Document Index

| File | Description |
|------|-------------|
| [implementation.md](./implementation.md) | Main implementation details: dispatcher, thresholds, full compact |
| [memory_architecture.md](./memory_architecture.md) | Memory management: token counting, threshold states, context restoration |
| [session_memory_extraction.md](./session_memory_extraction.md) | **NEW** Deep dive into the background extraction agent and two-phase system |

## Quick Architecture Summary

### Two Separate Systems

Claude Code uses **TWO SEPARATE SYSTEMS** for context management:

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  SYSTEM 1: Micro-Compact (Pre-API Processing)                                ║
║  ────────────────────────────────────────────────────────────────────────────║
║  When: BEFORE each API call                                                  ║
║  What: Clears old tool results (keeps last 3)                                ║
║  LLM: NO                                                                     ║
║  Location: chunks.132.mjs (lc function)                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  SYSTEM 2: Auto-Compact (Post-Response, Two-Tier Cascade)                    ║
║  ────────────────────────────────────────────────────────────────────────────║
║  When: AFTER response when threshold exceeded                                ║
║                                                                              ║
║  TIER 1: Session Memory Compact (sF1) - FAST                                 ║
║  • Uses cached summary from background extraction                            ║
║  • NO LLM call at compact time                                               ║
║  • Keeps messages after lastSummarizedId                                     ║
║                                                                              ║
║  TIER 2: Full Compact (cF1) - SLOW (fallback)                               ║
║  • Generates new summary via LLM streaming                                   ║
║  • Restores context (files, todos, plans)                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  BACKGROUND: Session Memory Extraction Agent (nF7)                           ║
║  ────────────────────────────────────────────────────────────────────────────║
║  When: Periodically during normal conversation                               ║
║  Trigger: 5000 tokens + 10 tool calls since last extraction                  ║
║  What: Spawns forked agent to update ~/.claude/<session>/summary.md          ║
║  LLM: YES (but amortized across conversation, not at compact time)           ║
║  Location: chunks.144.mjs (nF7 function)                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Threshold Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `uL0` | 13,000 | Auto-compact trigger buffer |
| `c97` | 20,000 | Warning threshold offset |
| `p97` | 20,000 | Error threshold offset |
| `mL0` | 3,000 | Blocking limit offset |
| `T97` | 20,000 | Micro-compact minimum savings |
| `S97` | 3 | Recent tool results to keep |

### Environment Variables

| Variable | Effect |
|----------|--------|
| `DISABLE_COMPACT` | Disable all compaction |
| `DISABLE_AUTO_COMPACT` | Disable only auto-compact |
| `DISABLE_MICROCOMPACT` | Disable micro-compact |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Custom threshold percentage |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | Custom blocking limit |

## Key Insight

**Session Memory is a TWO-PHASE system:**

1. **Phase 1 (Background)**: During normal conversation, a forked agent periodically extracts summaries and writes to `summary.md`. This USES LLM calls but happens asynchronously.

2. **Phase 2 (Compact Time)**: When auto-compact threshold is exceeded, Session Memory Compact reads the pre-computed summary. NO LLM call needed - instant compaction.

This design **amortizes the cost of summarization** across the conversation, making the critical compaction path instant.

## Source Code Locations

| Component | Obfuscated Source | Readable Source |
|-----------|-------------------|-----------------|
| Auto-Compact Dispatcher | `chunks.132.mjs:ys2` | `packages/features/src/compact/dispatcher.ts` |
| Threshold Calculation | `chunks.132.mjs:ic` | `packages/features/src/compact/thresholds.ts` |
| Session Memory Compact | `chunks.132.mjs:sF1` | `packages/features/src/compact/dispatcher.ts` |
| Full Compact | `chunks.132.mjs:cF1` | `packages/features/src/compact/full-compact.ts` |
| Micro-Compact | `chunks.132.mjs:lc` | `packages/features/src/compact/micro-compact.ts` |
| Background Extraction | `chunks.144.mjs:nF7` | (feature module) |
