# Symbol Additions — v2.1.142 Tools Unit (Part C: utility / cron / mcp / web / remote)

> Symbol mappings for utility/cron/mcp/web/remote tool deep dives discovered in v2.1.112 → v2.1.142.
> Place: this file maps the utility-class tool implementations for the v2.1.142 unit.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged into:
>   - `symbol_index_core_features.md` — ScheduleWakeup, Cron*, Brief alias
>   - `symbol_index_infra_platform.md` — McpAuth, McpResource*, WaitForMcpServers, RemoteTrigger, PushNotification
>   - `symbol_index_core_execution.md` — SendUserMessage, SendUserFile, SendMessage, StructuredOutput, WebFetch, WebSearch, TeamCreate, TeamDelete, TestingPermission, ShareOnboardingGuide, mcp generic

---

## Module: Tools — Scheduling (ScheduleWakeup + Cron + RemoteTrigger)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nf | SCHEDULE_WAKEUP_TOOL_NAME | cli_inner_pretty.js:211359 | constant |
| Et_ | scheduleWakeupInputSchema | cli_inner_pretty.js:380610-380624 | function |
| yt_ | scheduleWakeupOutputSchema | cli_inner_pretty.js:380625-380631 | function |
| xc7 | ScheduleWakeupTool | cli_inner_pretty.js:380632-380682 | function |
| SlK | SCHEDULE_WAKEUP_PROMPT | cli_inner_pretty.js:211366-211390 | variable |
| RlK | SCHEDULE_WAKEUP_DESCRIPTION | cli_inner_pretty.js:211363-211364 | variable |
| vFH | AUTONOMOUS_LOOP_SENTINEL | cli_inner_pretty.js:211360 | constant |
| F3H | AUTONOMOUS_LOOP_DYNAMIC_SENTINEL | cli_inner_pretty.js:211361 | constant |
| IlK | scheduleWakeupRuntimeImpl | cli_inner_pretty.js:(scheduler impl) | function |
| U3H | isScheduleWakeupEnabled | cli_inner_pretty.js:(loop dynamic gate) | function |
| MX | CRON_CREATE_TOOL_NAME | cli_inner_pretty.js:211654 | constant |
| qV | CRON_DELETE_TOOL_NAME | cli_inner_pretty.js:211655 | constant |
| y0H | CRON_LIST_TOOL_NAME | cli_inner_pretty.js:211656 | constant |
| pe_ | cronCreateInputSchema | cli_inner_pretty.js:385034-385049 | function |
| Ue_ | cronCreateOutputSchema | cli_inner_pretty.js:385050-385052 | function |
| Fe_ | CronCreateTool | cli_inner_pretty.js:385053-385121 | function |
| ge_ | cronDeleteInputSchema | cli_inner_pretty.js:385133 | function |
| Qe_ | cronDeleteOutputSchema | cli_inner_pretty.js:385134 | function |
| de_ | CronDeleteTool | cli_inner_pretty.js:385135-385177 | function |
| ce_ | cronListInputSchema | cli_inner_pretty.js:385191 | function |
| le_ | cronListOutputSchema | cli_inner_pretty.js:385192-385205 | function |
| ne_ | CronListTool | cli_inner_pretty.js:385206-385264 | function |
| sY6 | buildCronCreateDescription | cli_inner_pretty.js:211593-211597 | function |
| tY6 | buildCronCreatePrompt | cli_inner_pretty.js:211598-211641 | function |
| Hf6 | buildCronDeletePrompt | cli_inner_pretty.js:211642-211646 | function |
| qf6 | buildCronListPrompt | cli_inner_pretty.js:211647-211651 | function |
| $V | isKairosCronEnabled | cli_inner_pretty.js:211587-211589 | function |
| G7H | isDurableCronEnabled | cli_inner_pretty.js:211590-211592 | function |
| _m | CRON_RECURRING_MAX_AGE_DAYS | cli_inner_pretty.js:211652 | variable |
| Bn7 | CRON_MAX_JOBS | cli_inner_pretty.js:385020 | constant |
| TFH | scheduleCronJob | cli_inner_pretty.js:(scheduler add) | function |
| ht | listCronJobs | cli_inner_pretty.js:(scheduler list) | function |
| yt | deleteCronJobs | cli_inner_pretty.js:(scheduler delete) | function |
| vk | isValidCronExpression | cli_inner_pretty.js:(cron validator) | function |
| ZFH | computeNextCronFireTime | cli_inner_pretty.js:(next fire time) | function |
| eT | humanizeCronExpression | cli_inner_pretty.js:(humanize cron) | function |
| QkH | REMOTE_TRIGGER_TOOL_NAME | cli_inner_pretty.js:385266 | constant |
| ie_ | remoteTriggerInputSchema | cli_inner_pretty.js:385351-385361 | function |
| re_ | remoteTriggerOutputSchema | cli_inner_pretty.js:385362 | function |
| on7 | remoteTriggerResponseSchema | cli_inner_pretty.js:385363-385374 | function |
| ae_ | RemoteTriggerTool | cli_inner_pretty.js:385375-385493 | function |
| an7 | buildRemoteTriggerScheduleSummary | cli_inner_pretty.js:385311-385329 | function |
| cn7 | REMOTE_TRIGGER_DESCRIPTION | cli_inner_pretty.js:385267-385268 | variable |
| ln7 | REMOTE_TRIGGER_PROMPT | cli_inner_pretty.js:385269-385278 | variable |
| oe_ | REMOTE_TRIGGER_BETA_HEADER | cli_inner_pretty.js:385332 | constant |

---

## Module: Tools — Notification / User Channel (Push + SendUser*)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| It | PUSH_NOTIFICATION_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| OH5 | pushNotificationInputSchema | cli_inner_pretty.js:385982-385987 | function |
| MH5 | pushNotificationOutputSchema | cli_inner_pretty.js:385988-386003 | function |
| DH5 | PushNotificationTool | cli_inner_pretty.js:386004-386094 | function |
| plK | PUSH_NOTIFICATION_DESCRIPTION | cli_inner_pretty.js:(short text) | variable |
| UlK | PUSH_NOTIFICATION_PROMPT | cli_inner_pretty.js:211460-211500 | variable |
| Nv$ | PUSH_USER_PRESENT_THRESHOLD_MS | cli_inner_pretty.js:(idle threshold) | constant |
| xV8 | isUserPresent | cli_inner_pretty.js:(idle detector) | function |
| fT | getLastUserKeystroke | cli_inner_pretty.js:(timestamp) | function |
| yXH | getTerminalFocus | cli_inner_pretty.js:(focus state) | function |
| P7H | SEND_USER_MESSAGE_TOOL_NAME | cli_inner_pretty.js:211402 | constant |
| dY6 | LEGACY_BRIEF_TOOL_NAME | cli_inner_pretty.js:211403 | constant |
| cY6 | SEND_USER_MESSAGE_DESCRIPTION | cli_inner_pretty.js:211405 | variable |
| lY6 | SEND_USER_MESSAGE_PROMPT | cli_inner_pretty.js:211406-211407 | variable |
| y$_ | BRIEF_PROACTIVE_SECTION | cli_inner_pretty.js:211410-211420 | variable |
| E$_ | BRIEF_ENFORCE_SENTINEL | cli_inner_pretty.js:211404 | constant |
| us_ | sendUserMessageInputSchema | cli_inner_pretty.js:378423-378438 | function |
| ms_ | sendUserMessageOutputSchema | cli_inner_pretty.js:378439-378455 | function |
| xs_ | preuploadedFileSchema | cli_inner_pretty.js:378416-378422 | function |
| rd7 | SendUserMessageTool | cli_inner_pretty.js:378456-378510 | function |
| KL$ | isSendUserMessageEnabled | cli_inner_pretty.js:(kairos brief gate) | function |
| NH8 | SEND_USER_FILE_TOOL_NAME | cli_inner_pretty.js:211424 | constant |
| nY6 | SEND_USER_FILE_DESCRIPTION | cli_inner_pretty.js:211425 | variable |
| iY6 | SEND_USER_FILE_PROMPT | cli_inner_pretty.js:211426-211427 | variable |
| zH5 | sendUserFileInputSchema | cli_inner_pretty.js:385793-385803 | function |
| YH5 | sendUserFileOutputSchema | cli_inner_pretty.js:385804-385813 | function |
| fH5 | SendUserFileTool | cli_inner_pretty.js:385814-385877 | function |
| j38 | validateAttachmentPaths | cli_inner_pretty.js:(path validator) | function |
| J38 | resolveAttachments | cli_inner_pretty.js:(attachment resolver) | function |

---

## Module: Tools — Team / Swarm (TeamCreate + TeamDelete + SendMessage)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Am | TEAM_CREATE_TOOL_NAME | cli_inner_pretty.js:211705 | constant |
| St | TEAM_DELETE_TOOL_NAME | cli_inner_pretty.js:211706 | constant |
| jH5 | teamCreateInputSchema | cli_inner_pretty.js:386231-386241 | function |
| JH5 | TeamCreateTool | cli_inner_pretty.js:386243-386345 | function |
| XH5 | teamDeleteInputSchema | cli_inner_pretty.js:386386 | function |
| LH5 | TeamDeleteTool | cli_inner_pretty.js:386387-386446 | function |
| mZ | SEND_MESSAGE_TOOL_NAME | cli_inner_pretty.js:211565 | constant |
| TH5 | swarmProtocolMessageSchema | cli_inner_pretty.js:387015-387031 | function |
| VH5 | sendMessageInputSchema | cli_inner_pretty.js:387032-387041 | function |
| SH5 | SendMessageTool | cli_inner_pretty.js:387042-387268 | function |
| uiH | resumeSubagent | cli_inner_pretty.js:386626-386740 | function |
| Gi7 | buildTeamCreatePrompt | cli_inner_pretty.js:(team prompt) | function |
| ki7 | buildTeamDeletePrompt | cli_inner_pretty.js:386347-386362 | function |
| eK | isSwarmEnabled | cli_inner_pretty.js:(swarm gate) | function |
| az | LEAD_TEAMMATE_NAME | cli_inner_pretty.js:(swarm constant) | constant |
| In | teamFilePath | cli_inner_pretty.js:(path builder) | function |
| Ci | teamFileLocation | cli_inner_pretty.js:(team file resolver) | function |

---

## Module: Tools — Onboarding (ShareOnboardingGuide)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WL$ | SHARE_ONBOARDING_GUIDE_TOOL_NAME | cli_inner_pretty.js:(name constant) | constant |
| ZL$ | ONBOARDING_FILENAME | cli_inner_pretty.js:387269 | constant |
| qO8 | ONBOARDING_MAX_BYTES | cli_inner_pretty.js:387270 | constant |
| CH5 | shareOnboardingInputSchema | cli_inner_pretty.js:387280-387296 | function |
| bH5 | shareOnboardingOutputSchema | cli_inner_pretty.js:387297-387304 | function |
| xH5 | ShareOnboardingGuideTool | cli_inner_pretty.js:387305-387409 | function |
| hE6 | SHARE_ONBOARDING_PROMPT | cli_inner_pretty.js:(prompt text) | variable |
| HO8 | isShareOnboardingEnabled | cli_inner_pretty.js:(feature gate) | function |
| IE6 | findMostRecentOrgGuide | cli_inner_pretty.js:(guide lookup) | function |
| EE6 | listOrgGuides | cli_inner_pretty.js:(guide list) | function |
| NE6 | updateOrgGuide | cli_inner_pretty.js:(guide updater) | function |
| li7 | deleteOrgGuide | cli_inner_pretty.js:(guide deleter) | function |
| ci7 | createOrgGuide | cli_inner_pretty.js:(guide creator) | function |
| SE6 | formatOnboardingResult | cli_inner_pretty.js:(result builder) | function |
| ikH | onboardingErrorResult | cli_inner_pretty.js:(error helper) | function |

---

## Module: Tools — Structured Output (StructuredOutput / SyntheticOutput)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| J0 | STRUCTURED_OUTPUT_TOOL_NAME | cli_inner_pretty.js:207570 | constant |
| qH_ | structuredOutputInputSchema | cli_inner_pretty.js:207579 | function |
| KH_ | structuredOutputOutputSchema | cli_inner_pretty.js:207580 | function |
| $Y6 | StructuredOutputTool | cli_inner_pretty.js:207581-207637 | function |
| sdK | structuredOutputSchemaCache | cli_inner_pretty.js:207572, 207638 | variable |
| ce$ | getOrCreateStructuredOutputTool | cli_inner_pretty.js:207536-207541 | function |
| _H_ | buildStructuredOutputTool | cli_inner_pretty.js:207542-207566 | function |
| tdK | ajvLibrary | cli_inner_pretty.js:207578 | variable |
| fh | TelemetrySafeError | cli_inner_pretty.js:(error class) | class |

---

## Module: Tools — MCP (ListMcpResources + ReadMcpResource + WaitForMcpServers + McpAuth + generic mcp)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Q3H | LIST_MCP_RESOURCES_TOOL_NAME | cli_inner_pretty.js:(name) | constant |
| O$_ | listMcpResourcesInputSchema | cli_inner_pretty.js:(schema) | function |
| Q3H_Tool | ListMcpResourcesTool | cli_inner_pretty.js:(tool decl) | function |
| Gz | READ_MCP_RESOURCE_TOOL_NAME | cli_inner_pretty.js:(name) | constant |
| Xe_ | readMcpResourceInputSchema | cli_inner_pretty.js:(schema) | function |
| Gz_Tool | ReadMcpResourceTool | cli_inner_pretty.js:(tool decl) | function |
| l3H | WAIT_FOR_MCP_SERVERS_TOOL_NAME | cli_inner_pretty.js:211681 | constant |
| rL_ | waitForMcpServersInputSchema | cli_inner_pretty.js:271553-271555 | function |
| oL_ | waitForMcpServersOutputSchema | cli_inner_pretty.js:271556-271566 | function |
| BO7 | WaitForMcpServersTool | cli_inner_pretty.js:271567-271678 | function |
| iL_ | WAIT_FOR_MCP_TIMEOUT_MS | cli_inner_pretty.js:271541 | constant |
| Kf6 | buildWaitForMcpServersPrompt | cli_inner_pretty.js:271665-271679 | function |
| UJ6 | isWaitForMcpServersEnabled | cli_inner_pretty.js:(model gate) | function |
| mO7 | pendingMcpServerNames | cli_inner_pretty.js:(pending listing) | function |
| $_ | normalizeMcpServerName | cli_inner_pretty.js:(name normalizer) | function |
| F95 | mcpToolInputSchema | cli_inner_pretty.js:(generic mcp tool schema) | function |
| McpAuthTool | createMcpAuthTool | cli_inner_pretty.js:(MCP OAuth pseudo-tool) | function |
| performMCPOAuthFlow | performMcpOAuthFlow | cli_inner_pretty.js:(OAuth runner) | function |
| Gc9 | OAUTH_REDIRECT_URI_KEY | cli_inner_pretty.js:72499 | constant |
| Chq | OAUTH_REDIRECT_URI_KEY_SIGNIN | cli_inner_pretty.js:75996 | constant |
| mcpAuthenticate | sdkMcpAuthenticate | cli_inner_pretty.js:499132-499134 | function |

---

## Module: Tools — Web (WebFetch + WebSearch)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| FD | WEB_FETCH_TOOL_NAME | cli_inner_pretty.js:197731 | constant |
| Ys_ | webFetchInputSchema | cli_inner_pretty.js:377318-377323 | function |
| fs_ | webFetchOutputSchema | cli_inner_pretty.js:377324-377333 | function |
| eI | WebFetchTool | cli_inner_pretty.js:377334-377475 | function |
| GN6 | getURLMarkdownContent | cli_inner_pretty.js:377123-377187 | function |
| TN6 | applyPromptToMarkdown | cli_inner_pretty.js:377188-377216 | function |
| ZN6 | fetchURL | cli_inner_pretty.js:377090-377116 | function |
| ta_ | initTurndown | cli_inner_pretty.js:377029-377036 | function |
| WN6 | isMarkdownPreserveURL | cli_inner_pretty.js:377037-377044 | function |
| _d7 | isValidURL | cli_inner_pretty.js:377045-377056 | function |
| Ad7 | checkDomainAllowed | cli_inner_pretty.js:377057-377074 | function |
| zd7 | isSameOriginRedirect | cli_inner_pretty.js:377075-377089 | function |
| vN6 | httpStatusText | cli_inner_pretty.js:377278-377280 | function |
| zs_ | httpErrorMessage | cli_inner_pretty.js:377281-377290 | function |
| Os_ | webFetchPermissionKey | cli_inner_pretty.js:377291-377300 | function |
| fd7 | webFetchAllowSuggestions | cli_inner_pretty.js:377301-377305 | function |
| oX$ | WEB_FETCH_MARKDOWN_TRUNCATE_LIMIT | cli_inner_pretty.js:377230 | constant |
| qd7 | WEB_FETCH_HTML_TRUNCATE_LIMIT | cli_inner_pretty.js:377231 | constant |
| ra_ | WEB_FETCH_CACHE_TTL_MS | cli_inner_pretty.js:377220 | constant |
| oa_ | WEB_FETCH_CACHE_MAX_SIZE | cli_inner_pretty.js:377221 | constant |
| LN6 | webFetchCache | cli_inner_pretty.js:377222 | variable |
| PN6 | webFetchDomainCheckCache | cli_inner_pretty.js:377223 | variable |
| Hs_ | WEB_FETCH_MAX_CONTENT_LENGTH | cli_inner_pretty.js:377226 | constant |
| $s_ | WEB_FETCH_REQUEST_TIMEOUT_MS | cli_inner_pretty.js:377227 | constant |
| qs_ | WEB_FETCH_DOMAIN_CHECK_TIMEOUT_MS | cli_inner_pretty.js:377228 | constant |
| $d7 | WEB_FETCH_MAX_REDIRECTS | cli_inner_pretty.js:377229 | constant |
| ea_ | WEB_FETCH_MAX_URL_LENGTH | cli_inner_pretty.js:377225 | constant |
| Ks_ | WEB_FETCH_REDIRECT_STATUSES | cli_inner_pretty.js:377276 | variable |
| JN6 | DomainBlockedError | cli_inner_pretty.js:377247-377252 | class |
| XN6 | DomainCheckFailedError | cli_inner_pretty.js:377253-377260 | class |
| Kd7 | EgressBlockedError | cli_inner_pretty.js:377261-377274 | class |
| aa_ | clearWebFetchCache | cli_inner_pretty.js:(cache cleaner) | function |
| ff8 | isMarkdownPreserveHost | cli_inner_pretty.js:(preapproved host check) | function |
| BU7 | isPersistableContentType | cli_inner_pretty.js:(content-type filter) | function |
| qiH | persistBinaryContent | cli_inner_pretty.js:(binary saver) | function |
| GgK | buildWebFetchSystemPrompt | cli_inner_pretty.js:(prompt builder) | function |
| ZgK | buildWebFetchPrompt | cli_inner_pretty.js:(model-specific prompt) | function |
| VI | WEB_SEARCH_TOOL_NAME | cli_inner_pretty.js:211558 | constant |
| bt_ | webSearchInputSchema | cli_inner_pretty.js:381229-381235 | function |
| xt_ | webSearchResultItemSchema | cli_inner_pretty.js:381236-381245 | function |
| ut_ | webSearchOutputSchema | cli_inner_pretty.js:381246-381253 | function |
| C38 | WebSearchTool | cli_inner_pretty.js:381254-381453 | function |
| Bt_ | extractWebSearchResults | cli_inner_pretty.js:381186-381215 | function |
| mt_ | buildWebSearchToolSchema | cli_inner_pretty.js:381177-381185 | function |
| Fc7 | renderWebSearchResultMessage | cli_inner_pretty.js:381153-381165 | function |
| HE6 | getWebSearchToolUseSummary | cli_inner_pretty.js:381166-381169 | function |
| Ct_ | countWebSearchResults | cli_inner_pretty.js:(result counter) | function |
| FlK | buildWebSearchPrompt | cli_inner_pretty.js:211522-211557 | function |
| WcK | getCurrentMonth | cli_inner_pretty.js:(month helper) | function |

---

## Module: Tools — Testing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| it_ | testingPermissionInputSchema | cli_inner_pretty.js:(schema) | function |
| TestingPermissionTool | TestingPermissionTool | cli_inner_pretty.js:(end-to-end test tool) | function |

---

## Module: Tools — Inactive Legacy (Sleep, Brief alias, Config, SyntheticOutput class)

These tools exist in the 2.1.88 TypeScript source but in v2.1.142 are either: removed (Sleep), replaced (BriefTool → SendUserMessage with `aliases: [LEGACY_BRIEF_TOOL_NAME]`), or absorbed into another flow (ConfigTool → `/config` slash command; SyntheticOutputTool → StructuredOutput).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (none) | SleepTool | (removed in v2.1.142; see 2.1.88 src/tools/SleepTool/prompt.ts) | (removed) |
| rd7 (with aliases) | BriefTool aliased to SendUserMessageTool | cli_inner_pretty.js:378458 (alias) | function |
| (none) | ConfigTool | (absorbed into `/config` slash command in v2.1.142) | (removed) |
| $Y6 + _H_ | StructuredOutputTool (replaces SyntheticOutputTool) | cli_inner_pretty.js:207542-207637 | function |

---

## Notes

- **2.1.136 CronList qualifier fix**: `CronList` output now includes `humanSchedule` (humanized cron expression) and the scheduled `prompt` text — both fields are populated by `ne_.call()` at cli_inner_pretty.js:385237-385245.
- **2.1.117 WebFetch HTML truncation fix**: `GN6` truncates raw HTML at `qd7 = 1048576` (1 MB) before turndown, preventing hangs on very large pages.
- **2.1.105 WebFetch style/script stripping**: `ta_()` configures turndown with `q.remove(["style", "script", "noscript", "iframe"])` at line 377034 so these tags are dropped before HTML-to-markdown.
- **2.1.141 WebSearch "Did 0 searches" fix**: `Bt_` returns `searchCount: Math.max(z, Y)` where `z` counts `server_tool_use` events and `Y` counts `web_search_tool_result` events — even on errors the search attempt is reflected in the count.
- **2.1.118 SendMessage cwd-restore fix**: `uiH` (`resumeSubagent`) restores cwd via `M?.cwd ?? j` where `M` is the persisted launch metadata — explicit cwd from spawn time is honored, with worktree path as fallback.
- **2.1.121 McpAuth redirectUri**: SDK `mcpAuthenticate(serverName, redirectUri)` passes the optional `redirectUri` to the OAuth flow; the receiver (`performMCPOAuthFlow`) falls back to localhost if AS rejects the custom URI.
- **2.1.101 RemoteTrigger run empty-body fix**: For `action: "run"`, `ae_.call` destructures `{ trigger_id: J, ...X } = f ?? {}` so `X` is always defined (empty object) even when body is omitted — fixing a TypeError when no body was sent.
- **2.1.89 StructuredOutput schema cache**: `sdK` (WeakMap from input schema object → compiled validator) lets workflow scripts that call `agent({schema: BUGS_SCHEMA})` 30-80× per run reuse the compiled Ajv validator — reduces 80-call overhead from ~110 ms to ~4 ms.
- **2.1.142 SendUserFile**: New tool added in this release; `fH5` registered alongside SendUserMessage.
- **Per-decl files**: All functions above with single-letter or short obfuscated names also have corresponding `.js` files under `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/decls/functions/<name>.js` for cleaner per-decl reading.
