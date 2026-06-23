# Symbol Additions — Tools Subsystem (v2.1.183)

> **What this indexes:** Every obfuscated→readable symbol mapping anchored in the
> v2.1.183 reconstructed Tools-subsystem sources — the tool **framework** (`Tool.ts`),
> the **registry/assembly** pipeline (`tools.ts`), the wire **schema serialization**
> (`toolSchema.ts`), the **deferral / ToolSearch** machine (`deferredTools.ts`,
> `ToolSearchTool.ts`), and **every built-in tool at contract level** (the per-tool
> files under `04_tools/reconstructed_source/tools/`). Harvested from the inline
> `// 2.1.183: <readable> = <obf> @cli_inner_pretty.js:NNN` anchor comments and the
> file-header obf lists in those reconstructed `.ts` files, deduped by obfuscated id.
>
> **Unique symbols:** 441
>
> **Cross-validated against:** the v2.1.183 obfuscated bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines). `File:Line` columns cite that bundle (the reconstructed `.ts` file
> is named in each `## Module:` heading parenthetical).
>
> **Scope note:** This is the canonical per-module symbol table for the Tools subsystem
> in the 2.1.183 tree. Pure call-site location anchors with no established readable name
> (opaque internal helpers referenced only by `@line` in `WorktreeTools.ts`/`CronTools.ts`),
> and bare tool-property keys that are not separately obfuscated (`call`, `checkPermissions`,
> `validateInput`, `isEnabled`, `isReadOnly`, …), are intentionally excluded — they are
> location notes, not obf→readable mappings.

> Per project `CLAUDE.md`, the global indexes for these live in
> [`symbol_index_core_execution.md`](symbol_index_core_execution.md) (Tools/Agents/State)
> and [`symbol_index_core_features.md`](symbol_index_core_features.md) (Skills/Todo/Plan/Cron).

---

## Module: Tool Framework (Tool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BAi` | `toolNameMapCache` | cli_inner_pretty.js:150011 | function |
| `Ci` | `toolFrameworkCacheThunk` | cli_inner_pretty.js:150011-150022 | function |
| `jAi` | `registerBaseToolsProvider` | cli_inner_pretty.js:149968-149970 | function |
| `jJu` | `TOOL_DEFAULTS` | cli_inner_pretty.js:150010 | const |
| `kO` | `getEmptyToolPermissionContext` | cli_inner_pretty.js:149998-150006 | function |
| `pi` | `buildTool` | cli_inner_pretty.js:149995-149997 | function |
| `Rc` | `toolMatchesName` | cli_inner_pretty.js:149965-149967 | function |
| `STe` | `filterToolProgressMessages` | cli_inner_pretty.js:149962-149964 | function |
| `u_n` | `getBaseTools` | cli_inner_pretty.js:149971-149973 | function |
| `UJu` | `buildToolNameMap` | cli_inner_pretty.js:149974-149983 | function |
| `vl` | `findToolByName` | cli_inner_pretty.js:149984-149994 | function |

## Module: Tool Registry & Assembly (tools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cfo` | `getSendMessageTool` | cli_inner_pretty.js:436602 | function |
| `f3n` | `AgentTool` | cli_inner_pretty.js:149939 | object |
| `Fce` | `filterToolsByDenyRules` | cli_inner_pretty.js:436578-436580 | function |
| `iqe` | `getMergedTools` | cli_inner_pretty.js:539937-539945 | function |
| `kfo` | `getToolsForDefaultPreset` | cli_inner_pretty.js:436512-436516 | function |
| `L$p` | `TOOL_PRESETS` | cli_inner_pretty.js:436621 | const |
| `LW` | `getAllBaseTools` | cli_inner_pretty.js:436517-436577 | function |
| `m6n` | `useMergedTools` | cli_inner_pretty.js:539962-539973 | function |
| `xfo` | `parseToolPreset` | cli_inner_pretty.js:436507-436511 | function |
| `YY` | `assembleToolPool` | cli_inner_pretty.js:436581-436588 | function |
| `zR` | `getTools` | cli_inner_pretty.js:436622-436652 | function |

## Module: Tool Schema Serialization (toolSchema.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d1i` | `ASK_USER_QUESTION_DESCRIPTION (AskUserQuestion-local alias: DESCRIPTION)` | cli_inner_pretty.js:221317-221318 | const |
| `Dg` | `isLeanSystemPrompt` | cli_inner_pretty.js:134268-134273 | function |
| `DLe` | `zodToJsonSchema` | cli_inner_pretty.js:462188-462193 | function |
| `Dti` | `getToolSchemaCache` | cli_inner_pretty.js:134775-134777 | function |
| `Ed` | `MODEL_CAPS` | cli_inner_pretty.js:95158-95173 | const |
| `f1i` | `ASK_USER_QUESTION_RESERVATION_PROMPT` | cli_inner_pretty.js:221321-221323 | const |
| `f5r` | `ASK_USER_QUESTION_BASE_PROMPT` | cli_inner_pretty.js:221346-221354 | const |
| `G_f` | `getModelCaps` | cli_inner_pretty.js:581273-581275 | function |
| `GNe` | `modelSupportsStructuredOutputs` | cli_inner_pretty.js:134521-134527 | function |
| `Ir` | `getAPIProvider` | cli_inner_pretty.js:95194-95206 | function |
| `jNe` | `experimentalBetasDisabled` | cli_inner_pretty.js:134594-134596 | function |
| `K_f` | `warnBetasStrippedOnce` | cli_inner_pretty.js:581357-581360 | function |
| `n0o` | `simpleSystemPromptMode` | cli_inner_pretty.js:580858-580860 | function |
| `p1i` | `ASK_USER_QUESTION_PREVIEW_NOTES (AskUserQuestion-local alias: PREVIEW_FEATURE_PROMPT)` | cli_inner_pretty.js:221325-221345 | const |
| `Pu` | `isFirstPartyAnthropicBaseUrl` | cli_inner_pretty.js:95241-95244 | function |
| `Sl` | `agentTeamsEnabled` | cli_inner_pretty.js:293831-293835 | function |
| `st` | `parseBoolTrue` | cli_inner_pretty.js:163-168 | function |
| `sut` | `askUserQuestionTool` | cli_inner_pretty.js:391450- | object |
| `V7e` | `firstPartyBaseUrlIsAnthropic` | cli_inner_pretty.js:95250-95257 | function |
| `V_f` | `stripAgentTeamProps` | cli_inner_pretty.js:581284-581286 | function |
| `W_f` | `AGENT_TEAM_STRIP_TABLE` | cli_inner_pretty.js:581683 | const |
| `Y_f` | `hashInputJSONSchema` | cli_inner_pretty.js:581361-581365 | function |
| `yl` | `parseBoolFalse` | cli_inner_pretty.js:169-174 | function |
| `z_f` | `resolveToolDescription` | cli_inner_pretty.js:581287-581299 | function |

## Module: Deferred Tools & ToolSearch Reminder (deferredTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_7n` | `AMBIENT_CONTEXT_NOTE` | cli_inner_pretty.js:590353-590354 | const |
| `B1r` | `getToolSearchReminderConfig` | cli_inner_pretty.js:147785 | function |
| `DA` | `TOOL_SEARCH_TOOL_NAME` | cli_inner_pretty.js:221267 | const |
| `k5r` | `formatDeferredToolLine` | cli_inner_pretty.js:222322-222324 | function |
| `qmi` | `toolSearchFetchRuleEnabled` | cli_inner_pretty.js:147794-147796 | function |
| `Sae` | `DEFERRED_DELTA_LIST_CAP` | cli_inner_pretty.js:462436 | const |

## Module: ToolSearch Tool (ToolSearchTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A3p` | `checkAutoThreshold` | cli_inner_pretty.js:462415-462434 | function |
| `c1i` | `getNonDeferrableBuiltins` | cli_inner_pretty.js:221201-221217 | function |
| `cCr` | `ADVANCED_TOOL_USE_BETA` | cli_inner_pretty.js:101569 | const |
| `cUi` | `maybeInvalidateCache` | cli_inner_pretty.js:230263-230266 | function |
| `dUi` | `searchToolsWithKeywords` | cli_inner_pretty.js:230294-230362 | function |
| `Dvd` | `PROMPT_TAIL` | cli_inner_pretty.js:222335-222342 | const |
| `eId` | `getDeferredToolsCacheKey` | cli_inner_pretty.js:230257-230262 | function |
| `f7` | `modelSupportsToolReference` | cli_inner_pretty.js:221218-221223 | function |
| `fR` | `isToolSearchEnabledOptimistic` | cli_inner_pretty.js:221224-221252 | function |
| `fUi` | `outputSchema` | cli_inner_pretty.js:230389-230396 | object |
| `G2` | `isDeferredTool` | cli_inner_pretty.js:222307-222321 | object |
| `gLe` | `isToolSearchToolAvailable` | cli_inner_pretty.js:462232 | function |
| `gnt` | `buildSearchResult` | cli_inner_pretty.js:230270-230272 | function |
| `IMt` | `ToolSearchTool` | cli_inner_pretty.js:230417-230637 | object |
| `J4t` | `isToolSearchEnabled` | cli_inner_pretty.js:462248-462303 | function |
| `JTt` | `TOOL_SEARCH_TOOL_BETA` | cli_inner_pretty.js:101570 | const |
| `kvd` | `PROMPT_MID_LEGACY` | cli_inner_pretty.js:222333 | const |
| `nId` | `compileTermPatterns` | cli_inner_pretty.js:230289-230293 | function |
| `oCn` | `getToolDescriptionMemoized` | cli_inner_pretty.js:230397-230416 | function |
| `ovd` | `getUnsupportedModelsList` | cli_inner_pretty.js:221194-221200 | function |
| `own` | `getPrompt` | cli_inner_pretty.js:222325-222327 | function |
| `PPt` | `getToolSearchMode` | cli_inner_pretty.js:221183-221193 | function |
| `pUi` | `inputSchema` | cli_inner_pretty.js:230381-230388 | object |
| `tId` | `clearToolSearchDescriptionCache` | cli_inner_pretty.js:230267-230269 | function |
| `uUi` | `parseToolName` | cli_inner_pretty.js:230273-230288 | function |
| `wti` | `getToolSearchBeta` | cli_inner_pretty.js:134585 | function |
| `xvd` | `PROMPT_HEAD` | cli_inner_pretty.js:222330-222332 | const |
| `ZCd` | `MCP_WAIT_BUDGET_MS` | cli_inner_pretty.js:230365 | const |

## Module: Agent / Subagent Tool (AgentTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_7` | `FORK_SUBAGENT_TYPE` | cli_inner_pretty.js:222272 | const |
| `Aqa` | `buildAgentPrompt` | cli_inner_pretty.js:423136-423318 | function |
| `Br` | `getToolPermissionContext` | — | function |
| `c9` | `LEGACY_AGENT_TOOL_NAME` | cli_inner_pretty.js:149940 | const |
| `CDp` | `agentBaseParamSchema` | cli_inner_pretty.js:423431-423445 | object |
| `cqa` | `spawnTeammate` | cli_inner_pretty.js:423053-423055 | function |
| `em` | `isTeammate` | cli_inner_pretty.js:103466 | function |
| `gqa` | `isForkAvailable` | cli_inner_pretty.js:423337-423342 | function |
| `HDp` | `spawnTeammateImpl` | — | function |
| `IDp` | `agentMergedParamSchema` | cli_inner_pretty.js:423446-423477 | object |
| `j2` | `forkAgentDefinition` | — | function |
| `LY` | `RESERVED_MAIN_ADDRESS` | cli_inner_pretty.js:362512 | const |
| `n3t` | `isRemoteAgentAvailable` | — | function |
| `nye` | `defaultAgentDefinition` | cli_inner_pretty.js:384836-384847 | function |
| `o3t` | `BACKGROUND_TASKS_DISABLED` | cli_inner_pretty.js:423430 | const |
| `pDa` | `agentNameRegex` | cli_inner_pretty.js:423448-423457 | function |
| `qao` | `userFacingName` | cli_inner_pretty.js:385346-385352 | function |
| `r3t` | `AgentTypeError` | — | class |
| `sa` | `getSubscriptionType` | — | function |
| `TDp` | `SYNC_BACKGROUND_HINT_MS` | cli_inner_pretty.js:423347 | const |
| `UN` | `isInProcessTeammate` | cli_inner_pretty.js:103400-103402 | function |
| `Vao` | `userFacingNameBackgroundColor` | cli_inner_pretty.js:385353-385356 | function |
| `vs` | `AGENT_TOOL_NAME` | cli_inner_pretty.js:149939 | const |
| `Ws` | `READ_TOOL_NAME` | cli_inner_pretty.js:152217 | const |
| `xDp` | `agentOutputSchema` | cli_inner_pretty.js:423482-423504 | object |
| `y7` | `isForkSubagentEnabled` | cli_inner_pretty.js:222225-222227 | function |
| `Yut` | `normalizeAgentType` | — | function |
| `zao` | `agentWireSchema` | cli_inner_pretty.js:423478-423481 | object |
| `zts` | `permissionModeEnum` | — | object |

## Module: AskUserQuestion Tool (AskUserQuestionTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$wp` | `inputSchema` | cli_inner_pretty.js:391425-391436 | object |
| `bUa` | `questionSchema` | cli_inner_pretty.js:391361-391382 | object |
| `Ff` | `ASK_USER_QUESTION_TOOL_NAME` | cli_inner_pretty.js:221315 | const |
| `Fwp` | `validateHtmlPreviewFragment` | cli_inner_pretty.js:391310-391319 | function |
| `Mwp` | `answerValueSchema` | cli_inner_pretty.js:391409-391411 | object |
| `Owp` | `outputSchema` | cli_inner_pretty.js:391438-391448 | object |
| `Pwp` | `questionOptionSchema` | cli_inner_pretty.js:391346-391359 | object |
| `Rwp` | `commonFields` | cli_inner_pretty.js:391412-391423 | function |
| `SUa` | `annotationsSchema` | cli_inner_pretty.js:391384-391396 | object |
| `u1i` | `ASK_USER_QUESTION_TOOL_CHIP_WIDTH` | cli_inner_pretty.js:221316 | const |
| `yUa` | `UNIQUENESS_REFINE` | cli_inner_pretty.js:391397-391408 | const |

## Module: Bash Tool (BashTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `FFp` | `BACKGROUND_ALLOWLIST_COMMAND_NAMES` | cli_inner_pretty.js:450582-450605 | const |
| `mJa` | `bashInputSchemaBase` | cli_inner_pretty.js:450554-450577 | object |
| `ns` | `BASH_TOOL_NAME` | cli_inner_pretty.js:145275 | const |
| `qFp` | `LINT_FORMAT_WRITE_REGEX` | cli_inner_pretty.js:450646-450668 | const |
| `UFp` | `bashOutputSchema` | cli_inner_pretty.js:450606-450645 | object |

## Module: Cron Tools Family (CronTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_5r` | `buildCronDeletePrompt` | cli_inner_pretty.js:221658-221662 | function |
| `b1i` | `CRON_GATE_CACHE_TTL_MS` | cli_inner_pretty.js:221668 | const |
| `b5r` | `CRON_LIST_DESCRIPTION` | cli_inner_pretty.js:221674 | const |
| `eRp` | `CronDeleteTool` | cli_inner_pretty.js:431230-431272 | object |
| `g5r` | `buildCronCreateDescription` | cli_inner_pretty.js:221599-221603 | function |
| `IB` | `isKairosCronEnabled` | cli_inner_pretty.js:221593-221595 | function |
| `JMp` | `CronCreateTool` | cli_inner_pretty.js:431148-431216 | object |
| `nRp` | `cronListOutputSchema` | cli_inner_pretty.js:431287-431299 | object |
| `OPt` | `CRON_LIST_TOOL_NAME` | cli_inner_pretty.js:221672 | const |
| `qAe` | `isDurableCronEnabled` | cli_inner_pretty.js:221596-221598 | function |
| `QMp` | `cronDeleteInputSchema` | cli_inner_pretty.js:431228 | object |
| `rI` | `CRON_CREATE_TOOL_NAME` | cli_inner_pretty.js:221670 | const |
| `rRp` | `CronListTool` | cli_inner_pretty.js:431301-431358 | object |
| `S5r` | `buildCronListPrompt` | cli_inner_pretty.js:221663-221667 | function |
| `tRp` | `cronListInputSchema` | cli_inner_pretty.js:431286 | object |
| `U2` | `CRON_DELETE_TOOL_NAME` | cli_inner_pretty.js:221671 | const |
| `XMp` | `cronCreateOutputSchema` | cli_inner_pretty.js:431145-431147 | object |
| `xVa` | `MAX_JOBS` | cli_inner_pretty.js:431117 | const |
| `y5r` | `CRON_DELETE_DESCRIPTION` | cli_inner_pretty.js:221673 | const |
| `YMp` | `cronCreateInputSchema` | cli_inner_pretty.js:431131-431144 | object |
| `ZMp` | `cronDeleteOutputSchema` | cli_inner_pretty.js:431229 | object |

## Module: Edit Tool (EditTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EYa` | `MAX_EDITABLE_FILE_SIZE` | — | const |
| `Fa` | `EDIT_TOOL_NAME` | cli_inner_pretty.js:152083 | const |
| `kze` | `PERFORCE_READONLY_MESSAGE` | cli_inner_pretty.js:48727 | const |
| `T_n` | `NOT_READ_MESSAGE` | cli_inner_pretty.js:152086 | const |

## Module: Glob Tool (GlobTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$bp` | `globOutputSchema` | cli_inner_pretty.js:371064-371071 | object |
| `_u` | `GLOB_TOOL_NAME` | cli_inner_pretty.js:152243 | const |
| `bN` | `FILE_NOT_FOUND_CWD_NOTE` | — | const |
| `Ds` | `resolveToCwd` | cli_inner_pretty.js:48185 | function |
| `Fgi` | `getGlobPrompt` | cli_inner_pretty.js:152238-152242 | function |
| `hj` | `GlobTool` | cli_inner_pretty.js:371072-371166 | object |
| `Pn` | `isENOENT` | cli_inner_pretty.js:430112 | function |
| `Pt` | `getCwd` | cli_inner_pretty.js:429929 | function |
| `QMa` | `globEngine` | cli_inner_pretty.js:371163 | function |
| `Rbp` | `inputSchema` | cli_inner_pretty.js:371054-371063 | object |
| `t8` | `globPatternMatcher` | — | function |
| `uoe` | `findSimilarFile` | cli_inner_pretty.js:371122 | function |
| `Ut` | `getFsImplementation` | — | function |
| `WNr` | `GLOB_DESCRIPTION` | cli_inner_pretty.js:152244-152248 | const |

## Module: Grep Tool (GrepTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dbp` | `VCS_DIRECTORIES_TO_EXCLUDE` | cli_inner_pretty.js:370724 | const |
| `GB` | `coerceNumericString` | cli_inner_pretty.js:292825 | function |
| `iio` | `formatLimitInfo` | cli_inner_pretty.js:370647-370653 | function |
| `Jlt` | `getProjectIgnoreSet` | cli_inner_pretty.js:370433 | function |
| `Lbp` | `grepInputSchema` | cli_inner_pretty.js:370676-370723 | object |
| `m5r` | `getGrepDescription` | cli_inner_pretty.js:221399-221418 | function |
| `Mbp` | `grepOutputSchema` | cli_inner_pretty.js:370727-370738 | object |
| `OR` | `GrepTool` | cli_inner_pretty.js:370736-370920 | object |
| `Pbp` | `DEFAULT_HEAD_LIMIT` | cli_inner_pretty.js:370655 | const |
| `sio` | `applyHeadLimit` | cli_inner_pretty.js:370640-370646 | function |
| `Uc` | `GREP_TOOL_NAME` | cli_inner_pretty.js:221419 | const |

## Module: LSP Tool (LSPTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$po` | `extname (path)` | — | function |
| `bMp` | `MAX_LSP_FILE_SIZE_BYTES` | cli_inner_pretty.js:429524 | const |
| `csa` | `lspCallSite` | cli_inner_pretty.js:429654 | function |
| `Dot` | `lspDiagnosticsCallSite` | cli_inner_pretty.js:429654 | function |
| `EMp` | `lspOutputSchema` | cli_inner_pretty.js:429569-429590 | object |
| `HMp` | `getMethodAndParams` | cli_inner_pretty.js:429367-429392 | function |
| `M8a` | `pathToFileURL` | — | function |
| `Opo` | `LSPTool` | cli_inner_pretty.js:429593-429765 | object |
| `P8a` | `nodeFsOpen` | — | function |
| `pxe` | `lspCallSite2` | cli_inner_pretty.js:429655 | function |
| `qso` | `LSP_DESCRIPTION` | cli_inner_pretty.js:368923-368945 | const |
| `SMp` | `lspInputSchema` | cli_inner_pretty.js:429547-429568 | object |
| `Vlt` | `LSP_TOOL_NAME` | cli_inner_pretty.js:368922 | const |

## Module: MCP Resource Tools (McpResourceTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_G` | `ListMcpResourcesTool` | cli_inner_pretty.js:236164-236237 | object |
| `CXr` | `isWaitForMcpServersEnabled` | cli_inner_pretty.js:298065-298068 | function |
| `D2d` | `readMcpResourceOutputSchema` | cli_inner_pretty.js:275605-275628 | object |
| `E$d` | `mcpToolInputSchema` | cli_inner_pretty.js:261830 | object |
| `E5r` | `waitForMcpServersText` | cli_inner_pretty.js:221682-221697 | function |
| `eZi` | `renderReadUseMessage` | cli_inner_pretty.js:275531-275534 | function |
| `H$d` | `mcpToolOutputSchema` | cli_inner_pretty.js:261831-261835 | object |
| `Hae` | `LIST_MCP_RESOURCES_TOOL_NAME` | cli_inner_pretty.js:235977 | const |
| `jji` | `renderListUseMessage` | cli_inner_pretty.js:236123-236125 | function |
| `Jrt` | `READ_MCP_RESOURCE_TOOL_NAME` | cli_inner_pretty.js:275509 | const |
| `k2d` | `readMcpResourceInputSchema` | cli_inner_pretty.js:275598-275603 | object |
| `K9r` | `MCP_RESULT_SIZE_CEILING` | cli_inner_pretty.js:233595 | const |
| `kCe` | `WAIT_FOR_MCP_SERVERS_TOOL_NAME` | cli_inner_pretty.js:221698 | const |
| `kG` | `ReadMcpResourceTool` | cli_inner_pretty.js:275629-275745 | object |
| `kji` | `LIST_MCP_RESOURCES_DESCRIPTION` | cli_inner_pretty.js:235978-235985 | const |
| `kk` | `parseMcpToolName` | cli_inner_pretty.js:55428 | function |
| `L2d` | `RESOURCE_NOT_FOUND_CODES` | cli_inner_pretty.js:275604 | const |
| `Lji` | `LIST_MCP_RESOURCES_PROMPT` | cli_inner_pretty.js:235986-235994 | const |
| `M9d` | `waitForMcpServersInputSchema` | cli_inner_pretty.js:298081-298083 | object |
| `mVr` | `MCP_TOOL_BASE_TEMPLATE` | cli_inner_pretty.js:261836-261874 | const |
| `oc` | `normalizeServerName` | cli_inner_pretty.js:55423 | function |
| `ola` | `pendingMcpServerNames` | cli_inner_pretty.js:298062-298063 | function |
| `oxe` | `MCP_PROMPT_MAX_CHARS` | cli_inner_pretty.js:284376 | const |
| `P9d` | `WAIT_FOR_MCP_SERVERS_POLL_TIMEOUT_MS` | cli_inner_pretty.js:298069 | const |
| `q3` | `mcpToolNamePrefix` | cli_inner_pretty.js:55435 | function |
| `QQi` | `READ_MCP_RESOURCE_DESCRIPTION` | cli_inner_pretty.js:275510-275517 | const |
| `qxd` | `listMcpResourcesInputSchema` | cli_inner_pretty.js:236150-236152 | object |
| `R9d` | `waitForMcpServersOutputSchema` | cli_inner_pretty.js:298084-298093 | object |
| `sla` | `WaitForMcpServers` | cli_inner_pretty.js:298095-298206 | object |
| `V3` | `mcpToolName` | cli_inner_pretty.js:55438 | function |
| `Vxd` | `listMcpResourcesOutputSchema` | cli_inner_pretty.js:236153-236163 | object |
| `ZQi` | `READ_MCP_RESOURCE_PROMPT` | cli_inner_pretty.js:275521-275529 | const |
| `zrt` | `DIRECTORY_MIME_TYPE` | cli_inner_pretty.js:274900 | const |

## Module: NotebookEdit Tool (NotebookEditTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `oUa` | `DESCRIPTION` | cli_inner_pretty.js:390868 | const |
| `sUa` | `PROMPT` | cli_inner_pretty.js:390872-390879 | const |
| `xL` | `NOTEBOOK_EDIT_TOOL_NAME` | cli_inner_pretty.js:221448 | const |

## Module: Onboarding & Misc Tools (OnboardingMiscTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_$p` | `ShareOnboardingGuideTool` | cli_inner_pretty.js:435413-435462+ | object |
| `A$p` | `artifactOutputSchema` | cli_inner_pretty.js:435037-435045 | object |
| `A3n` | `SHOW_ONBOARDING_ROLE_PICKER_TOOL_NAME` | cli_inner_pretty.js:424336 | const |
| `aRp` | `sendUserFileInputSchema` | cli_inner_pretty.js:431621-431631 | object |
| `bqa` | `showOnboardingRolePickerDescription` | cli_inner_pretty.js:424337-424338 | function |
| `BRp` | `projectsInputSchema` | cli_inner_pretty.js:433576-433607 | object |
| `bza` | `ArtifactTool` | cli_inner_pretty.js:435046-435234 | object |
| `c5r` | `sendUserMessagePromptFull` | cli_inner_pretty.js:221282 | function |
| `cRp` | `SendUserFileTool` | cli_inner_pretty.js:431646-431710 | object |
| `d5r` | `sendUserFileDescription` | cli_inner_pretty.js:221303 | function |
| `Eqa` | `ShowOnboardingRolePickerTool` | cli_inner_pretty.js:424358-424412 | object |
| `FMf` | `explainCommandToolDef` | cli_inner_pretty.js:633098-633118 | function |
| `gfo` | `shareOnboardingGuidePrompt` | cli_inner_pretty.js:435354-435356 | function |
| `h$p` | `shareOnboardingGuideInputSchema` | cli_inner_pretty.js:435390-435404 | object |
| `hza` | `artifactPrompt` | cli_inner_pretty.js:434986-435004 | function |
| `ivd` | `turnWithoutSendSentinel` | cli_inner_pretty.js:221280 | function |
| `kDp` | `rolePickerInputSchema` | cli_inner_pretty.js:424356 | object |
| `KO` | `SEND_USER_MESSAGE_TOOL_NAME` | cli_inner_pretty.js:221278 | const |
| `l5r` | `sendUserMessageDescription` | cli_inner_pretty.js:221281 | function |
| `lRp` | `sendUserFileOutputSchema` | cli_inner_pretty.js:431632-431645 | object |
| `M3t` | `SHARE_ONBOARDING_GUIDE_TOOL_NAME` | cli_inner_pretty.js:435353 | const |
| `MPt` | `SEND_USER_MESSAGE_ALIAS` | cli_inner_pretty.js:221279 | const |
| `nfo` | `projectsPrompt` | cli_inner_pretty.js:433249 | function |
| `o9a` | `SendUserMessageTool` | cli_inner_pretty.js:425381-425441 | object |
| `p5r` | `sendUserFilePrompt` | cli_inner_pretty.js:221304-221312 | function |
| `pPp` | `makeRegisteredEvalTool` | cli_inner_pretty.js:425569-425632 | object |
| `R3t` | `ONBOARDING_FILE` | cli_inner_pretty.js:435379 | const |
| `R6a` | `PROJECTS_TOOL_NAME` | cli_inner_pretty.js:433248 | const |
| `r9a` | `messageFieldDescription` | cli_inner_pretty.js:425320 | function |
| `RPt` | `SEND_USER_FILE_TOOL_NAME` | cli_inner_pretty.js:221302 | const |
| `RRp` | `DesignSyncTool` | cli_inner_pretty.js:433025-433201 | object |
| `Sqa` | `showOnboardingRolePickerPrompt` | cli_inner_pretty.js:424339-424343 | function |
| `u5r` | `sendUserMessagePromptBrief` | cli_inner_pretty.js:221284 | function |
| `UMf` | `explainCommandResultSchema` | cli_inner_pretty.js:633119-633126 | object |
| `VAe` | `ARTIFACT_TOOL_NAME` | cli_inner_pretty.js:221750 | const |
| `VRp` | `ProjectsTool` | cli_inner_pretty.js:433677-433711+ | object |
| `wRp` | `designSyncInputSchema` | cli_inner_pretty.js:432872-432953 | object |
| `wXr` | `designSyncPrompt` | cli_inner_pretty.js:298053 | function |
| `XOt` | `DESIGN_SYNC_TOOL_NAME` | cli_inner_pretty.js:298052 | const |
| `yza` | `artifactInputSchema` | cli_inner_pretty.js:435005-435036 | object |

## Module: Plan Mode Tools (PlanModeTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a2n` | `EnterPlanModeTool` | cli_inner_pretty.js:392329-392392 | object |
| `A7` | `ENTER_PLAN_MODE_TOOL_NAME` | cli_inner_pretty.js:221314 | const |
| `Ij` | `ExitPlanModeTool` | cli_inner_pretty.js:392608-392807 | object |
| `qwp` | `enterPlanModeOutputSchema` | cli_inner_pretty.js:392328 | object |
| `tCp` | `exitPlanModeOutputSchema` | cli_inner_pretty.js:392591-392606 | object |
| `VUa` | `EXIT_PLAN_MODE_PROMPT` | cli_inner_pretty.js:392403-392426 | const |
| `Wwp` | `enterPlanModeInputSchema` | cli_inner_pretty.js:392327 | object |
| `yx` | `EXIT_PLAN_MODE_TOOL_NAME` | cli_inner_pretty.js:152252-152253 | const |
| `ZUa` | `exitPlanModeInputSchema` | cli_inner_pretty.js:392576-392583 | object |

## Module: PowerShell Tool (PowerShellTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$7a` | `powershellPermissionResolver` | cli_inner_pretty.js:442124-442290+ | function |
| `Ddt` | `BACKGROUND_TASKS_DISABLED` | cli_inner_pretty.js:443049 | const |
| `j1p` | `classifyPowershellSearchRead` | cli_inner_pretty.js:442763-442785 | function |
| `K1p` | `POWERSHELL_ALLOWLISTED_EXES` | cli_inner_pretty.js:443088-443111 | const |
| `k4n` | `powershellIsReadOnly` | cli_inner_pretty.js:439748-439759 | function |
| `Mdo` | `validateInput` | cli_inner_pretty.js:443180 | function |
| `N7a` | `buildPowershellPrompt` | cli_inner_pretty.js:442562-442665 | function |
| `Q7a` | `powershellSleepGuard` | cli_inner_pretty.js:442792-442807 | function |
| `V1p` | `powershellInputSchema` | cli_inner_pretty.js:443050-443062 | object |
| `W1p` | `SLEEP_COMMAND_NAMES` | cli_inner_pretty.js:443048 | const |
| `Xs` | `POWERSHELL_TOOL_NAME` | cli_inner_pretty.js:221424 | const |
| `Y7a` | `powershellUnavailablePolicy` | cli_inner_pretty.js:442808-442815 | function |
| `z1p` | `powershellOutputSchema` | cli_inner_pretty.js:443064-443087 | object |

## Module: PushNotification Tool (PushNotificationTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dRp` | `outputSchema` | cli_inner_pretty.js:431821-431834 | object |
| `fRp` | `PushNotificationTool` | cli_inner_pretty.js:431836-431929 | object |
| `G9` | `PUSH_NOTIFICATION_TOOL_NAME` | cli_inner_pretty.js:220751 | const |
| `KOi` | `prompt()` | cli_inner_pretty.js:220761-220763 | function |
| `uRp` | `inputSchema` | cli_inner_pretty.js:431815-431818 | object |
| `VOi` | `BASE_PROMPT` | cli_inner_pretty.js:220767-220773 | const |
| `zOi` | `DESCRIPTION` | cli_inner_pretty.js:220765-220766 | const |

## Module: REPL Tool (REPLTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `a9a` | `buildReplDescription` | cli_inner_pretty.js:425538-425542 | function |
| `FPp` | `replInputSchema` | cli_inner_pretty.js:427520-427531 | object |
| `G3n` | `HARD_WALL_CLOCK_LIMIT_MS` | cli_inner_pretty.js:427489 | const |
| `GPp` | `replBlockBearingFields` | cli_inner_pretty.js:427547 | function |
| `i9a` | `buildReplPrompt` | cli_inner_pretty.js:425443-425537 | function |
| `jPp` | `DEFAULT_TIMEOUT_MS` | cli_inner_pretty.js:427488 | const |
| `nI` | `isReplEnabled` | cli_inner_pretty.js:221558-221564 | function |
| `PA` | `REPL_TOOL_NAME` | cli_inner_pretty.js:221566 | const |
| `q9a` | `maxResultSizeChars` | cli_inner_pretty.js:427408-427411 | function |
| `tMp` | `code pre-validate` | cli_inner_pretty.js:427481-427483 | function |
| `TUe` | `DEFAULT_AGENT_ID` | cli_inner_pretty.js:221567 | const |
| `UPp` | `replOutputSchema` | cli_inner_pretty.js:427531-427546 | object |
| `wpo` | `REPLTool` | cli_inner_pretty.js:427548 | object |

## Module: Read Tool (ReadTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Dgi` | `REREAD_NUDGE` | cli_inner_pretty.js:152218 | const |
| `GNr` | `CAT_N_NUDGE` | cli_inner_pretty.js:152227 | const |
| `KUp` | `SMALL_FILE_BYTE_CAP` | cli_inner_pretty.js:454748 | const |
| `Lel` | `ensureUnderTokenCap` | cli_inner_pretty.js:463117-463125 | function |
| `M3p` | `readOutputSchema` | cli_inner_pretty.js:463456-463518 | object |
| `Ngi` | `TARGETED_RANGE_NUDGE` | cli_inner_pretty.js:152231 | const |
| `o0t` | `PARTIAL_VIEW_PREFIX` | cli_inner_pretty.js:152224 | const |
| `Oae` | `TokenCapExceeded` | cli_inner_pretty.js:274924 | object |
| `Ogi` | `OFFSET_LIMIT_NUDGE` | cli_inner_pretty.js:152229 | const |
| `OQe` | `DEFAULT_LINE_LIMIT` | cli_inner_pretty.js:152225 | const |
| `R3p` | `selectCatNudge` | cli_inner_pretty.js:463106 | function |
| `Rgi` | `SHORT_DESCRIPTION` | cli_inner_pretty.js:152226 | const |
| `xie` | `MAX_PDF_PAGES_PER_REQUEST` | — | const |

## Module: RemoteTrigger Tool (RemoteTriggerTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dWe` | `REMOTE_TRIGGER_TOOL_NAME` | cli_inner_pretty.js:431370 | const |
| `Gpo` | `TRIGGERS_BETA` | cli_inner_pretty.js:431366 | const |
| `iRp` | `RemoteTriggerTool` | cli_inner_pretty.js:431471-431580 | object |
| `jVa` | `triggerResponseSchema` | cli_inner_pretty.js:431461-431470 | object |
| `NVa` | `PROMPT` | cli_inner_pretty.js:431373-431382 | const |
| `oRp` | `inputSchema` | cli_inner_pretty.js:431450-431459 | object |
| `OVa` | `DESCRIPTION` | cli_inner_pretty.js:431371-431372 | const |
| `sRp` | `outputSchema` | cli_inner_pretty.js:431460 | object |

## Module: ScheduleWakeup Tool (ScheduleWakeupTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$g` | `SCHEDULE_WAKEUP_TOOL_NAME` | cli_inner_pretty.js:220800 | const |
| `i1i` | `scheduleLoopWakeup` | cli_inner_pretty.js:221042-221044 | function |
| `jAe` | `isKairosLoopDynamicEnabled` | cli_inner_pretty.js:221035-221037 | function |
| `nMp` | `input schema` | cli_inner_pretty.js:427810-427819 | object |
| `Ott` | `logLoopEnded` | cli_inner_pretty.js:221032-221034 | function |
| `rMp` | `output schema` | cli_inner_pretty.js:427821-427827 | object |
| `Rtt` | `AUTONOMOUS_LOOP_SENTINEL` | cli_inner_pretty.js:220801 | const |
| `wCe` | `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` | cli_inner_pretty.js:220802 | const |
| `XOi` | `description` | cli_inner_pretty.js:220804-220805 | function |
| `Y9a` | `ScheduleWakeupTool` | cli_inner_pretty.js:427828-427879 | object |

## Module: SendMessage Tool (SendMessageTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gtt` | `LIST_AGENTS_TOOL_NAME` | cli_inner_pretty.js:221577 | const |
| `lza` | `REQUEST_ID_REGEX` | cli_inner_pretty.js:434539 | const |
| `np` | `TEAM_LEAD_ADDRESS` | cli_inner_pretty.js:362636 | const |
| `nza` | `DESCRIPTION` | cli_inner_pretty.js:434314 | const |
| `o$p` | `inputSchema` | cli_inner_pretty.js:434558-434567 | object |
| `p$p` | `SendMessageTool` | cli_inner_pretty.js:434568-434694+ | object |
| `zh` | `SEND_MESSAGE_TOOL_NAME` | cli_inner_pretty.js:221450 | const |

## Module: Skill Tool (SkillTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aCp` | `outputSchema` | cli_inner_pretty.js:393134-393150 | object |
| `iCp` | `inputSchema` | cli_inner_pretty.js:393128-393133 | object |
| `LU` | `SKILL_REMINDER_TAG` | cli_inner_pretty.js:45647 | const |
| `lut` | `SkillTool` | cli_inner_pretty.js:393151-393367 | object |
| `mH` | `SKILL_TOOL_NAME` | cli_inner_pretty.js:221449 | const |

## Module: StructuredOutput Tool (StructuredOutputTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B9t` | `conditionCheckerInputSchema` | cli_inner_pretty.js:575813 | object |
| `cvd` | `outputSchema` | cli_inner_pretty.js:221499 | object |
| `Em` | `STRUCTURED_OUTPUT_TOOL_NAME` | cli_inner_pretty.js:221489 | const |
| `lvd` | `inputSchema` | cli_inner_pretty.js:221498 | object |

## Module: Task Tools Family (TaskTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_H` | `taskToolsEnabled` | cli_inner_pretty.js:299032-299035 | function |
| `AVa` | `TaskUpdateTool` | cli_inner_pretty.js:430761-430911 | object |
| `aVa` | `TaskCreateTool` | cli_inner_pretty.js:430475-430537 | object |
| `bVa` | `TaskListTool` | cli_inner_pretty.js:430979-431042 | object |
| `cVa` | `taskGetDescription` | cli_inner_pretty.js:430539 | function |
| `dP` | `TASK_UPDATE_TOOL_NAME` | cli_inner_pretty.js:221453 | const |
| `dVa` | `TaskGetTool` | cli_inner_pretty.js:430580-430645 | object |
| `edt` | `TaskStopTool` | cli_inner_pretty.js:424867-424920 | object |
| `fVa` | `taskUpdateDescription` | cli_inner_pretty.js:430647 | function |
| `g7` | `TASK_GET_TOOL_NAME` | cli_inner_pretty.js:221452 | const |
| `GMp` | `taskGetInputSchema` | cli_inner_pretty.js:430567 | object |
| `hVa` | `taskListDescription` | cli_inner_pretty.js:430955 | function |
| `IL` | `TASK_LIST_TOOL_NAME` | cli_inner_pretty.js:220833 | const |
| `jMp` | `taskCreateOutputSchema` | cli_inner_pretty.js:430474 | object |
| `JOi` | `taskStopPrompt` | cli_inner_pretty.js:220835-220840 | function |
| `KMp` | `taskListOutputSchema` | cli_inner_pretty.js:430966-430978 | object |
| `mVa` | `taskUpdatePrompt` | cli_inner_pretty.js:430648-430722 | function |
| `nVa` | `taskCreateValidationErrorSteer` | cli_inner_pretty.js:430374-430382 | function |
| `oVa` | `taskCreateDescription` | cli_inner_pretty.js:430451 | function |
| `q3n` | `TaskOutputTool` | cli_inner_pretty.js:428170- | object |
| `qDp` | `taskStopOutputSchema` | cli_inner_pretty.js:424859-424865 | object |
| `qMp` | `taskUpdateInputSchema` | cli_inner_pretty.js:430734-430751 | object |
| `sMp` | `taskOutputInputSchema` | cli_inner_pretty.js:428163-428169 | object |
| `sVa` | `getTaskCreatePrompt` | cli_inner_pretty.js:430405-430450 | function |
| `t1t` | `coerceTaskUpdateInput` | cli_inner_pretty.js:298989-299005 | function |
| `tVa` | `coerceTaskCreateInput` | cli_inner_pretty.js:430342-430373 | function |
| `UMp` | `taskCreateInputSchema` | cli_inner_pretty.js:430464-430473 | object |
| `uP` | `TASK_STOP_TOOL_NAME` | cli_inner_pretty.js:220834 | const |
| `uVa` | `taskGetPrompt` | cli_inner_pretty.js:430540-430561 | function |
| `vje` | `taskStatusEnum` | cli_inner_pretty.js:299290 | object |
| `VMp` | `taskUpdateOutputSchema` | cli_inner_pretty.js:430752-430760 | object |
| `Vw` | `TASK_CREATE_TOOL_NAME` | cli_inner_pretty.js:221451 | const |
| `W9` | `TASK_OUTPUT_TOOL_NAME` | cli_inner_pretty.js:221313 | const |
| `WDp` | `taskStopInputSchema` | cli_inner_pretty.js:424853-424857 | object |
| `WMp` | `taskGetOutputSchema` | cli_inner_pretty.js:430568-430579 | object |
| `yVa` | `getTaskListPrompt` | cli_inner_pretty.js:430913-430954 | function |
| `zMp` | `taskListInputSchema` | cli_inner_pretty.js:430965 | object |

## Module: TestingPermission Tool (TestingPermissionTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gMp` | `inputSchema` | cli_inner_pretty.js:428778 | object |
| `i8a` | `TESTING_PERMISSION_TOOL_NAME` | cli_inner_pretty.js:428772 | const |
| `xky` | `TestingPermissionTool` | cli_inner_pretty.js:428779-428830 | object |

## Module: TodoWrite Tool (TodoWriteTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `C8d` | `SHORT_PROMPT` | cli_inner_pretty.js:299322-299323 | const |
| `Dxe` | `TodoWriteTool` | cli_inner_pretty.js:299525-299576 | object |
| `I8d` | `LONG_PROMPT` | cli_inner_pretty.js:299330-299508 | const |
| `jla` | `DESCRIPTION` | cli_inner_pretty.js:299325-299326 | const |
| `k8d` | `outputSchema` | cli_inner_pretty.js:299519-299524 | object |
| `mR` | `TODO_WRITE_TOOL_NAME` | cli_inner_pretty.js:221398 | const |
| `mst` | `todoListSchema` | cli_inner_pretty.js:299317 | object |
| `T8d` | `todoStatusSchema` | cli_inner_pretty.js:299309 | object |
| `w8d` | `todoItemSchema` | cli_inner_pretty.js:299310-299315 | object |
| `x8d` | `inputSchema` | cli_inner_pretty.js:299518 | object |

## Module: WebFetch Tool (WebFetchTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DSd` | `WEB_FETCH_VERBOSE_USAGE_NOTES` | cli_inner_pretty.js:211028-211046 | const |
| `gF` | `WebFetchTool` | cli_inner_pretty.js:409283-409518 | object |
| `nE` | `WEB_FETCH_TOOL_NAME` | cli_inner_pretty.js:210992 | const |
| `tjn` | `isPreapprovedUrl` | cli_inner_pretty.js:408554-408561 | function |
| `Xkp` | `outputSchema` | cli_inner_pretty.js:409272-409282 | object |
| `Ykp` | `inputSchema` | cli_inner_pretty.js:409266-409271 | object |

## Module: WebSearch Tool (WebSearchTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `dMp` | `inputSchema` | cli_inner_pretty.js:428532-428537 | object |
| `fMp` | `outputSchema` | cli_inner_pretty.js:428549-428555 | object |
| `pMp` | `searchResultSchema` | cli_inner_pretty.js:428539-428548 | object |
| `rG` | `WEB_SEARCH_TOOL_NAME` | cli_inner_pretty.js:221393 | const |
| `V3n` | `WebSearchTool` | cli_inner_pretty.js:428557-428770 | object |

## Module: Worktree Tools Family (WorktreeTools.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aLe` | `randomWorktreeName` | cli_inner_pretty.js:429983 | function |
| `B8a` | `renderToolUseMessage` | cli_inner_pretty.js:429831-429833 | function |
| `DMp` | `enterWorktreeOutputSchema` | cli_inner_pretty.js:429900-429902 | object |
| `F8a` | `renderToolResultMessage` | cli_inner_pretty.js:429834-429852 | function |
| `G8a` | `EnterWorktreeTool` | cli_inner_pretty.js:429903-430018 | object |
| `HS` | `getShellState` | cli_inner_pretty.js:430003 | function |
| `Ib` | `globCacheHandle` | cli_inner_pretty.js:430001 | variable |
| `J8a` | `nodeFsRealpath` | cli_inner_pretty.js:430110 | function |
| `j8a` | `pathSep` | cli_inner_pretty.js:429935 | function |
| `LMp` | `enterWorktreeInputSchema` | cli_inner_pretty.js:429879-429899 | object |
| `MMp` | `exitWorktreeOutputSchema` | cli_inner_pretty.js:430179-430190 | object |
| `N8a` | `getEnterWorktreeToolPrompt` | cli_inner_pretty.js:429793-429830 | function |
| `Nm` | `getMainRepoRoot` | cli_inner_pretty.js:429930 | function |
| `PMp` | `exitWorktreeInputSchema` | cli_inner_pretty.js:430167-430177 | object |
| `Q8a` | `osHomedir` | cli_inner_pretty.js:430116 | function |
| `q8a` | `getExitWorktreeToolPrompt` | cli_inner_pretty.js:430020-430051 | function |
| `Upo` | `buildCwdRestoreNote` | cli_inner_pretty.js:430138-430142 | function |
| `V8a` | `renderToolUseMessage` | cli_inner_pretty.js:430052-430054 | function |
| `WAe` | `ENTER_WORKTREE_TOOL_NAME` | cli_inner_pretty.js:221266 | const |
| `Wn` | `countArrayLength` | cli_inner_pretty.js:430091 | function |
| `X8a` | `restoreSessionToOriginalCwd` | cli_inner_pretty.js:430102-430137 | function |
| `Y8a` | `countWorktreeChanges` | cli_inner_pretty.js:430088-430101 | function |
| `Z8a` | `ExitWorktreeTool` | cli_inner_pretty.js:430191-430320 | object |
| `z8a` | `renderToolResultMessage` | cli_inner_pretty.js:430055-430081 | function |
| `ZTn` | `EXIT_WORKTREE_TOOL_NAME` | cli_inner_pretty.js:221547 | const |

## Module: Write Tool (WriteTool.ts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kc` | `WRITE_TOOL_NAME` | cli_inner_pretty.js:193030 | const |
| `w_n` | `IN_LOCK_STALE_MESSAGE` | cli_inner_pretty.js:152087 | const |

