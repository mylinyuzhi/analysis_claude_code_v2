# Symbol Index - Core Execution (Claude Code 2.1.38)

> Symbol mapping table Part 1: Core execution flow modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [State Management](#module-state-management)
- [Agent Loop](#module-agent-loop)
- [LLM API](#module-llm-api)
- [Tools](#module-tools)
- [Agents](#module-agents)
- [Subagent Execution](#module-subagent-execution)
- [Thinking Mode](#module-thinking-mode)

---

## Module: Tools

> Full analysis: [05_tools/](../05_tools/)

### Team/Swarm Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tc4 | TeamCreateTool | chunks.141.mjs:377 | tool |
| YhY | SendMessageTool | chunks.141.mjs:1373 | tool |

---

## Module: Agent Loop

> Full analysis: [03_llm_core/](../03_llm_core/)

### Loop Entry & Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QL4 | bootstrapTelemetry | chunks.cli.mjs (referenced) | function |

---

## Module: Thinking Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| interleaved-thinking-2025-05-14 | THINKING_BETA_1 | chunks.1.mjs:2249 | beta header |
| adaptive-thinking-2026-01-28 | THINKING_BETA_2 | chunks.1.mjs:2267 | beta header |
| maxThinkingTokens | maxThinkingTokens | chunks.130.mjs:1564 | state key |
| thinkingEnabled | thinkingEnabled | chunks.154.mjs:120 | state key |

---

## Module: Subagent Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| run_in_background | run_in_background | chunks.132.mjs:43 | parameter |
| background-task-output | BACKGROUND_TASK_OUTPUT_MARKER | chunks.129.mjs:2194 | constant |
| backgroundTasks | backgroundTasks | chunks.151.mjs:2590 | state key |
