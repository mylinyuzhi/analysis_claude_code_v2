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

## Module: LLM API

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lOq | llmRequestGenerator | chunks.169.mjs:739 | function (generator) |
| V26 | withApiRetry | chunks.169.mjs:120 | function |
| US | createLlmClient | chunks.169.mjs:100 | function |

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

---

## Module: State Management

> Full analysis: [15_state_management/](../15_state_management/)

### Store Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gG1 | initialAppState | chunks.151.mjs:419 | function |
| Gf6 | createStore | chunks.151.mjs:398 | function |
| u_ | AppStateProvider | chunks.151.mjs:522 | component |
| v6 | useAppState | chunks.151.mjs:576 | hook |
| L7 | useSetAppState | chunks.151.mjs:591 | hook |
| jA | updateGlobalConfig | chunks.174.mjs:1460 | function |
| f6 | getGlobalConfig | chunks.174.mjs:1539 | function |
| bZ | registerTaskInState | chunks.142.mjs:1676 | function |
| o6 | internalStateObject | chunks.1.mjs:3052 | object |
| dcA | createInternalState | chunks.1.mjs:2351 | function |
