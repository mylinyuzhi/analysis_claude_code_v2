# Symbol index: core execution (2.1.227)

Only symbols re-derived directly from the 2.1.227 bundle appear here. Do not merge mangled identifiers
from the 2.1.220 index without re-verification.

## Module: LLM Core and Agent Loop

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `u6d` | createTurnAccumulator | `cli_inner_pretty.js:366600-366625` | function |
| `ftb` | finalizeToolEndedTurn | `cli_inner_pretty.js:367193-367256` | function |
| `c8d` | interleaveModelStreamWithToolDrain | `cli_inner_pretty.js:360649-360670` | function |
| `A7s` | isFailedTurnReason | `cli_inner_pretty.js:366658-366685` | function |
| `jfe` | queryEntrypoint | `cli_inner_pretty.js:367298-367312` | function |
| `ytb` | queryWithObserverTap | `cli_inner_pretty.js:367313-367362` | function |
| `K6d` | runQueryTurns | `cli_inner_pretty.js:367363-369400` | function |
| `s6d` | runNormalStopHooks | `cli_inner_pretty.js:366243-366559` | function |
| `nAt` | runToolUse | `cli_inner_pretty.js:344990-345116` | function |
| `TYs` | StreamingToolExecutor | `cli_inner_pretty.js:360329-360637` | class |

## Module: Tool Registry and Deferred Loading

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `Ri` | decorateToolDefinition | `cli_inner_pretty.js:123749-123750` | function |
| `yu` | findToolByNameOrAlias | `cli_inner_pretty.js:123734-123744` | function |
| `wHn` | isToolSearchEnabled | `cli_inner_pretty.js:380696-380762` | function |
| `Rti` | isEndConversationToolEnabled | `cli_inner_pretty.js:527322-527329` | function |
| `zse` | isDeferredTool | `cli_inner_pretty.js:207762-207775` | function |
| `Ra` | matchesToolNameOrAlias | `cli_inner_pretty.js:123715-123717` | function |
| `q3p` | modelMeetsEndConversationFloor | `cli_inner_pretty.js:527303-527305` | function |
| `K3p` | parseEndConversationFlagValue | `cli_inner_pretty.js:527314-527320` | function |
| `j7d` | searchDeferredTools | `cli_inner_pretty.js:378105-378173` | function |
| `SHn` | ToolSearchTool | `cli_inner_pretty.js:378231-378477` | object |

## Module: Subagent Execution and Handoff

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `hni` | agentTool | `cli_inner_pretty.js:550824-551760` | object |
| `Mfa` | finalizeSubagentResult | `cli_inner_pretty.js:483346-483421` | function |
| `nk` | getAgentDepth | `cli_inner_pretty.js:109718-109721` | function |
| `I6d` | recordSubagentOutputFindings | `cli_inner_pretty.js:366875-366885` | function |
| `KWe` | registerBackgroundAgentTask | `cli_inner_pretty.js:353241-353292` | function |
| `OWd` | registerForegroundAgentTask | `cli_inner_pretty.js:353314-353378` | function |
| `DDr` | reviewSubagentHandoff | `cli_inner_pretty.js:483486-483575` | function |
| `$5` | runSubagentStream | `cli_inner_pretty.js:481876-483055` | function |
| `k6d` | sanitizeSubagentContent | `cli_inner_pretty.js:366843-366859` | function |
| `dkr` | sanitizeSubagentText | `cli_inner_pretty.js:366831-366842` | function |

## Module: Agent Reachability and Listing

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `lya` | buildListAgentsContext | `cli_inner_pretty.js:523703-523707` | function |
| `bIs` | buildListAgentsDescription | `cli_inner_pretty.js:206412-206414` | function |
| `uJb` | formatPeerSessionRowsForModel | `cli_inner_pretty.js:523765-523795` | function |
| `lJb` | formatReachableAgentsForModel | `cli_inner_pretty.js:523708-523728` | function |
| `cJb` | formatSubagentRowsForModel | `cli_inner_pretty.js:523755-523764` | function |
| `Dxn` | isCloudSessionRepresentedLocally | `cli_inner_pretty.js:519160-519163` | function |
| `$S` | isCrossSessionMessagingEnabled | `cli_inner_pretty.js:207238-207241` | function |
| `B7u` | LIST_AGENTS_TOOL_ALIAS | `cli_inner_pretty.js:206416` | constant |
| `$y` | LIST_AGENTS_TOOL_NAME | `cli_inner_pretty.js:206415` | constant |
| `ufS` | listAgentsTool | `cli_inner_pretty.js:577423-577472` | object |
| `aya` | listAllReachableAgents | `cli_inner_pretty.js:523680-523702` | function |
| `mti` | listBridgeRows | `cli_inner_pretty.js:523300-523334` | function |
| `SKt` | listCloudSessions | `cli_inner_pretty.js:523416-523418` | function |
| `XGp` | listInProcessSubagents | `cli_inner_pretty.js:523729-523746` | function |
| `iya` | listLiveUdsSessions | `cli_inner_pretty.js:523622-523634` | function |
| `Kxn` | reconcileBridgeRows | `cli_inner_pretty.js:523378-523385` | function |

## Module: Agent Team Runtime

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `CVp` | claimNextOpenTask | `cli_inner_pretty.js:549135-549154` | function |
| `eK_` | cleanupSessionTeams | `cli_inner_pretty.js:342491-342501` | function |
| `h7v` | initializeSessionTeam | `cli_inner_pretty.js:923131-923193` | function |
| `W8s` | partitionValidMailboxEntries | `cli_inner_pretty.js:340674-340688` | function |
| `Yrt` | readMailbox | `cli_inner_pretty.js:340776-340805` | function |
| `fni` | reserveTeammateIdentity | `cli_inner_pretty.js:550036-550113` | function |
| `xVp` | runInProcessTeammate | `cli_inner_pretty.js:549273-549677` | function |
| `PVp` | spawnInProcessHandler | `cli_inner_pretty.js:550437-550553` | function |
| `PnS` | spawnTeammateByBackend | `cli_inner_pretty.js:550554-550586` | function |
| `k1e` | updateTeamFile | `cli_inner_pretty.js:342225-342254` | function |
| `xnS` | waitForNextTeammateInput | `cli_inner_pretty.js:549220-549272` | function |
| `GD` | writeToMailbox | `cli_inner_pretty.js:340811-340877` | function |

## Module: Session Identity and Usage

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `$i` | getMainAgentId | `cli_inner_pretty.js:3176-3180` | function |
| `Uw` | getOutputTokenCount | `cli_inner_pretty.js:3413-3415` | function |
| `Pt` | getSessionId | `cli_inner_pretty.js:3173-3175` | function |

## Module: System Prompt and Reminder Transport

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `C5p` | buildPerTurnEffortSystemMessage | `cli_inner_pretty.js:528657-528676` | function |
| `H5` | buildSystemPrompt | `cli_inner_pretty.js:527648-527707` | function |
| `HSo` | isExplicitHumanOrigin | `cli_inner_pretty.js:121639-121640` | function |
| `Ohr` | isGenuineHumanMessage | `cli_inner_pretty.js:121667-121669` | function |
| `Ej` | normalizeMessagesForApi | `cli_inner_pretty.js:581766-582006` | function |
| `b5p` | placeCacheBreakpoints | `cli_inner_pretty.js:528550-528598` | function |

## Module: Performance Runtime

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `WFd` | EditFileReadCache | `cli_inner_pretty.js:325469-325506` | class |
| `Kc_` | streamLinesFromFile | `cli_inner_pretty.js:210021-210053` | function |
| `U0e` | readFileWithLineRange | `cli_inner_pretty.js:209834-209858` | function |
| `rto` | registerPreExitFlush | `cli_inner_pretty.js:4796-4798` | function |
| `nto` | drainPreExitFlush | `cli_inner_pretty.js:4799-4801` | function |
| `RmS` | repairApiSystemPlacement | `cli_inner_pretty.js:582107-582133` | function |
| `S8e` | runModelRequestWithFallbacks | `cli_inner_pretty.js:529062-531926` | function |
| `OZb` | serializeMessagesForApi | `cli_inner_pretty.js:531932-531966` | function |
| `Wya` | splitSystemPromptForCaching | `cli_inner_pretty.js:528178-528252` | function |
| `FxS` | supportsMidConversationSystem | `cli_inner_pretty.js:612828-612848` | function |
| `Z3p` | usesNativeMidConversationFraming | `cli_inner_pretty.js:528049-528053` | function |
| `VH` | wrapInSystemReminder | `cli_inner_pretty.js:582731-582735` | function |

## Module: Cross-session Messaging

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| `Ioi` | classifyPinnedIdentity | `cli_inner_pretty.js:564761-564767` | function |
| `vJp` | findCandidateByReference | `cli_inner_pretty.js:564852-564856` | function |
| `BJp` | gateInboundPeerMessage | `cli_inner_pretty.js:565236-565274` | function |
| `ORn` | mapReachableCandidateToSendTarget | `cli_inner_pretty.js:564911-564935` | function |
| `HcS` | MAX_HELD_PEER_MESSAGES | `cli_inner_pretty.js:565400` | constant |
| `RJp` | rehydrateSendMessagePins | `cli_inner_pretty.js:565061-565066` | function |
| `$Jp` | resolveExplicitCrossSessionPolicy | `cli_inner_pretty.js:565145-565166` | function |
| `MJp` | resolveInboundPeerPolicy | `cli_inner_pretty.js:565181-565201` | function |
| `kJp` | resolvePinnedCandidate | `cli_inner_pretty.js:564944-564987` | function |
| `NRn` | resolveSendMessageRecipient | `cli_inner_pretty.js:564572-564844` | function |
| `yva` | settleHeldMessagesOnShutdown | `cli_inner_pretty.js:565124-565135` | function |

## Coverage note

This is a curated index of symbols used by the 2.1.227 reports, not an export dump. The 2.1.220 index
remains useful for conceptual comparison, but none of its obfuscated identifiers are valid in this
build without independent re-derivation.
