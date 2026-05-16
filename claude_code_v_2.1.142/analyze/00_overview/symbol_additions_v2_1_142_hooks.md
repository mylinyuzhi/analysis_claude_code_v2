# Symbol Additions — v2.1.142 Hooks Delta (Unit 05)

This file lists obfuscated→readable symbol mappings discovered while analyzing v2.1.113 → v2.1.142 hook subsystem changes. Symbols are NEW relative to the v2.1.112 baseline (where they existed in the v2.1.112 `symbol_index.md`), or have new location anchors in the v2.1.142 bundle (`cli_inner_pretty.js`).

All file:line references are to `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`.

## Module: Hooks — Schema (v2.1.139 args, v2.1.118 mcp_tool, v2.1.139 continueOnBlock, v2.1.141 terminalSequence, v2.1.121 updatedToolOutput)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Th9` | `buildHookTypeSchemas` (returns object of all hook-type schemas) | cli_inner_pretty.js:48728-48844 | function |
| `H` (inside Th9) | `BashCommandHookSchema` | cli_inner_pretty.js:48729-48771 | constant |
| `$` (inside Th9) | `PromptHookSchema` (now with `continueOnBlock`) | cli_inner_pretty.js:48772-48791 | constant |
| `q` (inside Th9) | `McpToolHookSchema` (new in v2.1.118) | cli_inner_pretty.js:48792-48806 | constant |
| `K` (inside Th9) | `HttpHookSchema` | cli_inner_pretty.js:48807-48826 | constant |
| `_` (inside Th9) | `AgentHookSchema` | cli_inner_pretty.js:48827-48842 | constant |
| `eMq` | `discriminatedHookSchema` (union of all 5 hook types) | cli_inner_pretty.js:48858-48867 | constant |
| `Hwq` | `hookMatcherEntrySchema` | cli_inner_pretty.js:48868-48873 | constant |
| `MR` | `hookConfigSchema` (partialRecord by event name) | cli_inner_pretty.js:48874 | constant |
| `lq$` | `hookIfSchema` (filter condition) | cli_inner_pretty.js:48850-48857 | function |
| `Lu5` | `hookSyncResponseSchema` (now with `terminalSequence`) | cli_inner_pretty.js:519022-519116 | constant |
| `Xu5` | `permissionDecisionEnum` (`["allow","deny","ask","defer"]`) | cli_inner_pretty.js:519020-519021 | constant |
| `VsH` | `hookResponseUnionSchema` (union of sync + async response) | cli_inner_pretty.js:519117-519121 | constant |

## Module: Hooks — Envelope Builder

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `M_` | `createBaseHookInput` (now adds `effort: { level }` when supported) | cli_inner_pretty.js:520506-520520 | function |

## Module: Hooks — Event Dispatchers (snake_case envelope builders)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$M$` | `sessionStartHook` | cli_inner_pretty.js:520032-520043 | function |
| `qM$` | `setupHook` | cli_inner_pretty.js:520044-520054 | function |
| `QL$` | `subagentStartHook` | cli_inner_pretty.js:520056 | function |
| `QNH` | `sessionEndHook` | cli_inner_pretty.js:520057-520072 | function |
| `zL$` | `postToolUseHook` (NEW v2.1.119: `duration_ms` parameter) | cli_inner_pretty.js:520182-520193 | function |
| `YL$` | `postToolUseFailureHook` (NEW v2.1.119: `duration_ms`) | cli_inner_pretty.js:520194-520211 | function |
| `FL$` | `postToolBatchHook` | cli_inner_pretty.js:520215-520221 | function |
| `kL$` | `permissionDeniedHook` | cli_inner_pretty.js:520224+ | function |

## Module: Hooks — Streaming Driver (`aP`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aP` | `dispatchHookOutputStream` (NEW v2.1.142 validation: prompt/agent + no toolUseContext) | cli_inner_pretty.js:521329-522181 | function |
| `PQ6` | `getMatchedHookEntries` (now de-dups `mcp_tool` and `command.args`) | cli_inner_pretty.js:521151-521304 | function |
| `Cu5` | `matchesHookMatcher` (regex/exact matcher) | cli_inner_pretty.js:521040-521058 | function |
| `bu5` | `buildToolPermissionRulePredicate` | cli_inner_pretty.js:521060-521080 | function |
| `Ah4` | `isInternalCallbackHook` | cli_inner_pretty.js:521082-521084 | function |
| `RG$` | `buildHookDeduplicationKey` | cli_inner_pretty.js:521086-521088 | function |
| `xu5` | `pluginIdHasMarketplaceSuffix` | cli_inner_pretty.js:521090-521096 | function |
| `LQ6` | `countPluginHooksByOrigin` | cli_inner_pretty.js:521098-521106 | function |
| `zh4` | `countHooksByType` | cli_inner_pretty.js:521128-521134 | function |
| `uu5` | `getMatchedHooks` (NEW v2.1.117: reads `kp()` for main-thread agent hooks) | cli_inner_pretty.js:521108-521126 | function |
| `tI` | `hasHookForEvent` (NEW v2.1.117: reads `kp()` early) | cli_inner_pretty.js:521135-521146 | function |
| `pu5` | `serializeHookDefinitionsForTelemetry` | (referenced at cli_inner_pretty.js:521392) | function |

## Module: Hooks — Output Parsing / Validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kh4` | `parseHookJSONOutput` (Zod validation + structured error) | cli_inner_pretty.js:520521-520554 | function |
| `VW8` | `parseHookStdoutPayload` (JSON-detect + fall back to plaintext) | cli_inner_pretty.js:520582-520600 | function |
| `_h4` | `parseHTTPHookResponse` (empty-body → empty JSON object handling) | cli_inner_pretty.js:520602-520618 | function |
| `TW8` | `applyHookJSONOutput` (NEW v2.1.141: routes `terminalSequence`; NEW v2.1.121: `updatedToolOutput`) | cli_inner_pretty.js:520611-520795 | function |
| `m$H` | `isAsyncHookResponse` | (used at cli_inner_pretty.js:520948, 522244) | function |
| `ZS` | `isPlainObject` | (utility) | function |
| `CG$` | `truncateOrPersistHookOutput` | cli_inner_pretty.js:520557-520580 | function |

## Module: Hooks — Per-type Executors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ey4` | `promptHook` (NEW v2.1.139: `continueOnBlock` consultation) | cli_inner_pretty.js:519169-519335 | function |
| `hy4` | `agentHook` | cli_inner_pretty.js:519378-519573 | function |
| `vW8` | `bashCommandHook` (NEW v2.1.139: `args` exec form, `detached: true`, `CLAUDE_EFFORT`) | cli_inner_pretty.js:520794-522029 | function |
| `XQ6` | `mcpToolHook` (NEW v2.1.118) | cli_inner_pretty.js:519817-519849 | function |
| `JQ6` | `httpHook` | (called at cli_inner_pretty.js:521517) | function |
| `hu5` | `interpolateMCPHookInput` (NEW v2.1.118: `${path}` substitution) | cli_inner_pretty.js:519791-519816 | function |
| `Bu5` | `callbackHook` | (called at cli_inner_pretty.js:521440) | function |
| `mu5` | `functionHook` | (called at cli_inner_pretty.js:521470) | function |
| `Wu5` | `countTokensInLastAssistantMessage` (transcript truncation helper for Stop prompt hooks) | cli_inner_pretty.js:519336-519345 | function |
| `Zu5` | `countTokensInMessages` (heuristic) | cli_inner_pretty.js:519346-519350 | function |
| `Gu5` | `truncateTranscriptForPromptHook` (Stop hooks get truncated history) | cli_inner_pretty.js:519351-519377 | function |

## Module: Hooks — Terminal Sequence (NEW v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Lm6` | `validateTerminalSequence` (allowlist parse + re-serialize) | cli_inner_pretty.js:467431-467435 | function |
| `Pm6` | `emitTerminalSequence` (push to topmost emitter on stack) | cli_inner_pretty.js:467447-467449 | function |
| `oM4` | `pushTerminalEmitter` | cli_inner_pretty.js:467436-467442 | function |
| `aM4` | `popTerminalEmitter` | cli_inner_pretty.js:467443-467446 | function |
| `ZW8` | `dispatchTerminalSequence` (side-channel emitter for YW/callback paths) | cli_inner_pretty.js:522183-522192 | function |
| `XZ5` | `parseEscapeTokens` (OSC/BEL byte-level parser with allowlist filter) | cli_inner_pretty.js:467390-467430 | function |
| `DZ5` | `terminalAllowlist` (`new Set([0, 1, 2, 9, 99, 777])`) | cli_inner_pretty.js:467456 | constant |
| `F2$` | `terminalEmitterStack` (LIFO stack of emit callbacks) | cli_inner_pretty.js:467457 | variable |
| `jZ5` | `MAX_TERMINAL_SEQUENCE_LENGTH` (=4096) | cli_inner_pretty.js:467451 | constant |
| `pj` | `formatOSCBody` (`<ps>;<payload>`) | (utility) | function |
| `EZ` | `encodeOSC` (`ESC ] ... ST/BEL`) | (utility) | function |
| `BT` | `BEL_BYTE` (`\x07`) | (utility) | constant |
| `JZ5` | `decodeOSCPayload` (escape unescape) | (utility) | function |

## Module: Hooks — Main-Thread Agent Hooks (NEW v2.1.117)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kp` | `getMainThreadAgentHooks` | cli_inner_pretty.js:3083-3086 | function |
| `dv$` | `setMainThreadAgentHooks` | cli_inner_pretty.js:3087-3091 | function |
| `pJH` | `applyMainThreadAgent` (admin-trust-gated installer) | cli_inner_pretty.js:564134-564137 | function |
| `SyH` | `resolveAgentSetting` (calls `pJH` on `--agent` resolution) | cli_inner_pretty.js:564206-564220 | function |
| `Kh` | `getMainThreadAgentType` | cli_inner_pretty.js:3075-3078 | function |
| `vp` | `setMainThreadAgentType` | cli_inner_pretty.js:3079-3082 | function |
| `B7H` | `isAdminTrustedSource` | (utility) | function |
| `DX` | `isFeatureLocked` (admin policy gate) | (utility) | function |
| `jv` | `getAsyncLocalStorageEntry` | (utility) | function |

## Module: Hooks — Aggregation State (delta from v2.1.112)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `h` (in `aP`) | `outcomeCounts` (`{success, blocking, non_blocking_error, cancelled}`) | cli_inner_pretty.js:522029 | variable |
| `C` (in `aP`) | `byteCounts` (`{additionalContextChars, systemMessageChars, ...}`) | cli_inner_pretty.js:522030 | variable |
| `B` (in `aP`) | `perPluginByteCounts` | cli_inner_pretty.js:522032 | variable |
| `R` (in `aP`) | `hookToPluginId` | cli_inner_pretty.js:522031 | variable |
| `x` (in `aP`) | `aggregatedPermissionBehavior` (deny > defer > ask > allow > passthrough) | cli_inner_pretty.js:522080-522110 | variable |
| `S` (in `aP`) | `yieldSequence` (yield counter) | cli_inner_pretty.js:522049 | variable |

## Module: Hooks — Stream Yield Routing (delta)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `G38` | `postToolUseAggregator` (NEW v2.1.121: translates `updatedMCPToolOutput` → `updatedToolOutput`) | cli_inner_pretty.js:378950-379015 | function |
| `Z38` | `generatePostToolUseFollowupMessage` | (called at cli_inner_pretty.js:388433) | function |
| `k0` | `isMcpTool` | (predicate) | function |
| `jW8` | `AGENT_HOOK_ID_PREFIX` (=`"hook-agent-"`) | cli_inner_pretty.js:519573 | constant |

## Module: Hooks — MCP CLAUDE_PROJECT_DIR (NEW v2.1.139)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bP$` | `MCPStdioTransport` (constructor; env now includes CLAUDE_PROJECT_DIR) | cli_inner_pretty.js:414308 | class |
| `R9` | `getProjectDir` (cwd of project root) | (utility) | function |

## Cross-references

- v2.1.112 baseline symbols: `claude_code_v_2.1.112/analyze/00_overview/symbol_additions_unit_09.md`
- Bundle layout (cli_inner_pretty.js vs chunks.XX.mjs): v2.1.142 uses a single `cli_inner_pretty.js` file (~611K lines) instead of v2.1.112's chunked layout. All locations in this file refer to `cli_inner_pretty.js` line numbers.

## Notes on Naming Choices

- **`bashCommandHook`** (vW8) — covers both shell-form (bash/pwsh) and exec-form (no shell). Named for the most common case; the exec-form gating is internal.
- **`dispatchHookOutputStream`** (aP) — async generator that yields control signals (preventContinuation, terminalSequence, updatedToolOutput, etc.) from the inner per-hook executors to the outer event consumer. Both "dispatcher" and "stream" emphasized.
- **`createBaseHookInput`** (M_) — kept matching the v2.1.112 readable name; just extends the return type with `effort`.
- **`applyMainThreadAgent`** (pJH) — orchestrates type+hooks installation. Not `setMainThreadAgent` because it has the admin-trust gate.
