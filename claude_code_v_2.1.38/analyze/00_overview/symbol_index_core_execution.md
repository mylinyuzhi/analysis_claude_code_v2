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

### Core Tools

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| i5 | FileReadTool | chunks.146.mjs:1754 | tool object |
| vj | FileWriteTool | chunks.146.mjs:436 | tool object |
| tS | GrepTool | chunks.76.mjs:1129 | tool object |
| WB | GlobTool | chunks.76.mjs:1495 | tool object |
| BYq | BashOutputComponent | chunks.162.mjs:417249 | component |

### Tool Execution Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $E | isMcpTool | chunks.149.mjs:420 | function |
| b1q | executePostToolHooksIterator | chunks.149.mjs:3 | function (generator) |
| B1q | executePreToolHooksIterator | chunks.149.mjs:161 | function (generator) |
| bU1 | toolDispatcher | chunks.149.mjs:343 | function (generator) |
| c6 | createUserMessage | chunks.149.mjs:340 | function |
| g1q | bashPreFlightCheck | chunks.149.mjs:460 | function |
| kq | createHookMessage | chunks.149.mjs:80 | function |
| kt | getDynamicToolSet | chunks.149.mjs:350 | function |
| NdY | toolExecutionPipeline | chunks.149.mjs:490 | function |
| Tv | findTool | chunks.149.mjs:345 | function |
| u1q | executePostToolFailureHooksIterator | chunks.149.mjs:90 | function (generator) |
| VdY | toolExecutionOrchestrator | chunks.149.mjs:448 | function |
| W74 | markAsLongRunning | chunks.149.mjs:470 | function |
| x1q | formatValidationError | chunks.149.mjs:500 | function |

### Team/Swarm Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tc4 | TeamCreateTool | chunks.141.mjs:377 | tool |
| YhY | SendMessageTool | chunks.141.mjs:1373 | tool |

---

## Module: LLM API

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Af6 | accumulateUsage | chunks.169.mjs:1365 | function |
| bq6 | calculateCost | chunks.169.mjs:1370 | function |
| dOq | nonStreamingFallback | chunks.169.mjs:710 | function (generator) |
| e51 | mergeUsage | chunks.169.mjs:1343 | function |
| g9z | capMaxTokens | chunks.169.mjs:1481 | function |
| JT6 | processContentBlocks | chunks.169.mjs:1100 | function |
| lOq | llmRequestGenerator | chunks.169.mjs:739 | function (generator) |
| LN | initialUsageObject | chunks.169.mjs:1340 | constant |
| m9z | buildCacheControlMessages | chunks.169.mjs:580 | function |
| mp | completeQuery | chunks.169.mjs:1500 | function |
| pY | createErrorMessage | chunks.169.mjs:1130 | function |
| Q9z | NON_STREAMING_MAX_TOKENS | chunks.169.mjs:1479 | constant |
| Sq6 | trackCumulativeCost | chunks.169.mjs:1375 | function |
| US | createLlmClient | chunks.169.mjs:100 | function |
| UW1 | streamingQuery | chunks.169.mjs:1510 | function |
| V26 | withApiRetry | chunks.169.mjs:120 | function |
| WJ | normalizeMessages | chunks.169.mjs:600 | function |
| x9z | applyEffortToRequest | chunks.169.mjs:566 | function |
| yd1 | abortStream | chunks.169.mjs:1520 | function |

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
| C59 | modelSupportsThinking | chunks.75.mjs:1770 | function |
| es1 | getModelBetas | chunks.47.mjs:2010 | function |
| fw6 | getInitialThinkingEnabled | chunks.75.mjs:1759 | function |
| Hn1 | INTERLEAVED_THINKING_BETA | chunks.1.mjs:2249 | constant ("interleaved-thinking-2025-05-14") |
| $L6 | ADAPTIVE_THINKING_BETA | chunks.1.mjs:2267 | constant ("adaptive-thinking-2026-01-28") |
| HL6 | EFFORT_BETA | chunks.1.mjs:2270 | constant ("effort-2025-11-24") |
| Jbq | DEFAULT_THINKING_BUDGET | chunks.1.mjs:2317 | constant (31999) |
| maxThinkingTokens | maxThinkingTokens | chunks.130.mjs:1564 | state key |
| ok7 | isOpus46Model | chunks.75.mjs:1755 | function |
| p17 | getDefaultEffortForModel | chunks.47.mjs:2018 | function |
| qPA | getEffortFromSettings | chunks.90.mjs:3080 | function |
| rz1 | getDefaultThinkingBudget | chunks.1.mjs:2319 | function |
| Sn7 | getEffortFromEnv | chunks.90.mjs:3085 | function |
| thinkingEnabled | thinkingEnabled | chunks.154.mjs:120 | state key |
| uK1 | parseEffortValue | chunks.90.mjs:3072 | function |
| VB1 | isOpus46Model | chunks.90.mjs:3068 | function |
| WJ6 | EFFORT_LEVELS | chunks.90.mjs:3070 | constant (Array) |
| xcA | CLAUDE_CODE_BETA | chunks.1.mjs:2245 | constant ("claude-code-20250219") |

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
| bZ | registerTaskInState | chunks.142.mjs:1676 | function |
| dcA | createInternalState | chunks.1.mjs:2351 | function |
| E81 | getSettingsState | chunks.75.mjs:1757 | function |
| f6 | getGlobalConfig | chunks.174.mjs:1539 | function |
| Gf6 | createStore | chunks.151.mjs:398 | function |
| gG1 | initialAppState | chunks.151.mjs:419 | function |
| jA | updateGlobalConfig | chunks.174.mjs:1460 | function |
| l4 | getUserSettings | chunks.151.mjs:410 | function |
| L7 | useSetAppState | chunks.151.mjs:591 | hook |
| o6 | internalStateObject | chunks.1.mjs:3052 | object |
| pcA | generateSessionId | chunks.1.mjs:2340 | function |
| QD | getDefaultPermissionContext | chunks.151.mjs:400 | function |
| u_ | AppStateProvider | chunks.151.mjs:522 | component |
| v6 | useAppState | chunks.151.mjs:576 | hook |
| Wf6 | getInitialPromptSuggestionEnabled | chunks.151.mjs:415 | function |
| yhA | useStoreContext | chunks.151.mjs:574 | hook |
| yt | resumeSession | chunks.151.mjs:530 | function |
| Zw6 | initialAttributionState | chunks.151.mjs:412 | function |
