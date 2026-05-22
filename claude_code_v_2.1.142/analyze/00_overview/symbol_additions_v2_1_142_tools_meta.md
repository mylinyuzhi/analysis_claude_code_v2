# Symbol Additions — v2.1.142 Tools Meta Unit (Part B)

> Tools subsystem symbol mappings for the v2.1.142 unit, Part B (meta/agent/plan/worktree).
> Place: maps the **Tools** subsystem additions for `agent.md`, `skill.md`, `task_*.md`, `enter_plan_mode.md`, `exit_plan_mode.md`, `enter_worktree.md`, `exit_worktree.md`, `tool_search.md`, `ask_user_question.md`.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged:
> - `symbol_index_core_execution.md` (Agent/Tools)
> - `symbol_index_core_features.md` (Skills, Plan Mode, Tasks)
> - `symbol_index_infra_platform.md` (Worktree, MCP)
> - `symbol_index_infra_integration.md` (UI, popup)

---

## Module: Tools — Agent Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Gu7 | agentTool | cli_inner_pretty.js:351269-351600 | object |
| Cc_ | agentBaseInputSchema | cli_inner_pretty.js:351205-351221 | function |
| bc_ | agentFullInputSchema | cli_inner_pretty.js:351222-351249 | function |
| XV6 | agentExportedInputSchema | cli_inner_pretty.js:351250-351253 | function |
| xc_ | agentOutputSchema | cli_inner_pretty.js:351254-351268 | function |
| Zu7 | normalizeAgentType | cli_inner_pretty.js:351139-351143 | function |
| uc_ | resolveTeamName | cli_inner_pretty.js:351135-351138 | function |
| at | GENERAL_PURPOSE_AGENT | cli_inner_pretty.js:(import) | object |
| vI | FORK_AGENT | cli_inner_pretty.js:(import) | object |
| W0 | isForkSubagentEnabled | cli_inner_pretty.js:(env-or-gate check) | function |
| ZnH | isBackgroundTasksDisabled | cli_inner_pretty.js:351204 | variable |
| D7 | AGENT_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| hu | LEGACY_AGENT_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| BOH | setAgentColor | cli_inner_pretty.js:(import) | function |
| GnH | filterDeniedAgents | cli_inner_pretty.js:(permissions helper) | function |
| WV6 | getDenyRuleForAgent | cli_inner_pretty.js:(permissions helper) | function |
| zf6 | isInForkChild | cli_inner_pretty.js:(message-scan helper) | function |
| c88 | hasRequiredMcpServers | cli_inner_pretty.js:(MCP requirement check) | function |
| kwH | resolveAgentModel | cli_inner_pretty.js:(model resolver) | function |
| n7H | getMcpServerName | cli_inner_pretty.js:(mcp__-prefix extractor) | function |
| g7H | isPluginAgent | cli_inner_pretty.js:(plugin agent detector) | function |
| rj | isBuiltInAgent | cli_inner_pretty.js:(built-in agent detector) | function |
| F7H | getAgentTypeColor | cli_inner_pretty.js:231351 | function |

---

## Module: Tools — Skill Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SnH | skillTool | cli_inner_pretty.js:353527-353795 | object |
| Kl_ | skillInputSchema | cli_inner_pretty.js:353504-353509 | function |
| _l_ | skillOutputSchema | cli_inner_pretty.js:353510-353526 | function |
| fX | SKILL_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| Am7 | wasUserTypedSlash | cli_inner_pretty.js:353362-353374 | function |
| Vx | escapeRegex | cli_inner_pretty.js:9491-9493 | function |
| Wb | extractText | cli_inner_pretty.js:(text extractor) | function |
| pG | SYSTEM_REMINDER_TAG | cli_inner_pretty.js:(constant) | constant |
| yV6 | getCommandsIncludingMcpPrompts | cli_inner_pretty.js:353356-353361 | function |
| Xy | findCommandByName | cli_inner_pretty.js:(command lookup) | function |
| VnH | suggestNearestCommand | cli_inner_pretty.js:(Levenshtein typo suggester) | function |
| m_ | getCommandName | cli_inner_pretty.js:(name accessor) | function |
| Q7H | filterByAllowedSkills | cli_inner_pretty.js:(allowlist filter) | function |
| Np | getSessionAllowedSkills | cli_inner_pretty.js:(session allowlist accessor) | function |
| st | getSkillOverride | cli_inner_pretty.js:(skillOverrides accessor) | function |
| zl_ | isBundledOrBuiltInSkill | cli_inner_pretty.js:(built-in skill detector) | function |
| ql_ | executeForkedSkill | cli_inner_pretty.js:(fork-context skill executor) | function |
| YM$ | withAllowedTools | cli_inner_pretty.js:(allowlist wrapper) | function |
| E4$ | withModelOverride | cli_inner_pretty.js:(model overrider) | function |
| J68 | logSkillInvoked | cli_inner_pretty.js:(analytics helper) | function |
| Su7 | wrapMessages | cli_inner_pretty.js:(message wrapper) | function |
| Ru7 | generateToolUseId | cli_inner_pretty.js:(uuid generator) | function |
| Al_ | SKILL_RUNTIME_FIELDS | cli_inner_pretty.js:353761-353795 | constant |

---

## Module: Tools — TaskCreate

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Xn7 | taskCreateTool | cli_inner_pretty.js:384379-384439 | object |
| Se_ | taskCreateInputSchema | cli_inner_pretty.js:384367-384377 | function |
| Re_ | taskCreateOutputSchema | cli_inner_pretty.js:384378 | function |
| Dn7 | TASK_CREATE_DESCRIPTION | cli_inner_pretty.js:384355 | constant |
| jn7 | taskCreatePrompt | cli_inner_pretty.js:384309-384353 | function |
| tE | getTaskRegistry | cli_inner_pretty.js:(registry accessor) | function |
| T67 | persistNewTask | cli_inner_pretty.js:(task store inserter) | function |
| jL$ | runTaskCreateHooks | cli_inner_pretty.js:(hook validator iterator) | function |
| jE6 | formatBlockingError | cli_inner_pretty.js:(error formatter) | function |
| a88 | deleteTask | cli_inner_pretty.js:(task delete) | function |
| vA | getMyAgentName | cli_inner_pretty.js:(agent name accessor) | function |
| q5 | getSessionId | cli_inner_pretty.js:(session id accessor) | function |
| OX | TASK_CREATE_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| nw | isTaskListEnabled | cli_inner_pretty.js:(feature gate) | function |
| TTH | taskStatusEnum | cli_inner_pretty.js:(pending/in_progress/completed) | function |

---

## Module: Tools — TaskGet

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Zn7 | taskGetTool | cli_inner_pretty.js:384484-384549 | object |
| Ce_ | taskGetInputSchema | cli_inner_pretty.js:384469 | function |
| be_ | taskGetOutputSchema | cli_inner_pretty.js:384470-384483 | function |
| Pn7 | TASK_GET_DESCRIPTION | cli_inner_pretty.js:384441 | constant |
| Wn7 | TASK_GET_PROMPT | cli_inner_pretty.js:384442-384463 | constant |
| Tn | getTask | cli_inner_pretty.js:(single-task fetch) | function |
| Kg | TASK_GET_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — TaskList

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hn7 | taskListTool | cli_inner_pretty.js:384882-384945 | object |
| me_ | taskListInputSchema | cli_inner_pretty.js:384868 | function |
| Be_ | taskListOutputSchema | cli_inner_pretty.js:384869-384881 | function |
| Nn7 | TASK_LIST_DESCRIPTION | cli_inner_pretty.js:384858 | constant |
| En7 | taskListPrompt | cli_inner_pretty.js:384816-384857 | function |
| Ik | listAllTasks | cli_inner_pretty.js:(enumeration, sorted by ID since v2.1.119) | function |
| BZ | TASK_LIST_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — TaskUpdate

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vn7 | taskUpdateTool | cli_inner_pretty.js:384666-384814 | object |
| xe_ | taskUpdateInputSchema | cli_inner_pretty.js:384637-384656 | function |
| ue_ | taskUpdateOutputSchema | cli_inner_pretty.js:384657-384665 | function |
| Tn7 | TASK_UPDATE_DESCRIPTION | cli_inner_pretty.js:384551 | constant |
| Vn7 | TASK_UPDATE_PROMPT | cli_inner_pretty.js:384552-384625 | constant |
| d7H | applyPatch | cli_inner_pretty.js:(atomic patch write) | function |
| gkH | runTaskCompletionHooks | cli_inner_pretty.js:(completion validator iterator) | function |
| JL$ | formatCompletionBlockingError | cli_inner_pretty.js:(completion error formatter) | function |
| Hw6 | addDependencyEdge | cli_inner_pretty.js:(blocks/blockedBy edge) | function |
| cA | sendMessage | cli_inner_pretty.js:(team SendMessage) | function |
| JL | getMyColor | cli_inner_pretty.js:(agent color accessor) | function |
| eK | isAgentSwarmsEnabled | cli_inner_pretty.js:(team gate) | function |
| tG | hasOutstandingTasks | cli_inner_pretty.js:(task pending check) | function |
| P0 | TASK_UPDATE_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — TaskOutput

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R38 | taskOutputTool | cli_inner_pretty.js:380973-381113 | object |
| It_ | taskOutputInputSchema | cli_inner_pretty.js:380966-380972 | function |
| P2 | preprocessBoolean | cli_inner_pretty.js:(string-to-bool preprocessor) | function |
| St_ | waitForTaskCompletion | cli_inner_pretty.js:(polling wait) | function |
| S38 | formatTaskForOutput | cli_inner_pretty.js:(task shape projection) | function |
| mc7 | truncateOutput | cli_inner_pretty.js:(output truncator) | function |
| Rt_ | TaskOutputResultComponent | cli_inner_pretty.js:(Ink component) | function |
| sD | TaskOutputErrorComponent | cli_inner_pretty.js:(Ink error component) | function |
| eH | KeybindingComponent | cli_inner_pretty.js:(escape-hint component) | function |
| $n | TASK_OUTPUT_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — TaskStop

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| w38 | taskStopTool | cli_inner_pretty.js:378044-378097 | object |
| Vs_ | taskStopInputSchema | cli_inner_pretty.js:378030-378035 | function |
| vs_ | taskStopOutputSchema | cli_inner_pretty.js:378036-378043 | function |
| M38 | stopTask | cli_inner_pretty.js:(type-dispatched stop handler) | function |
| K38 | getCallerAgentId | cli_inner_pretty.js:(audit-trail accessor) | function |
| bd7 | renderTaskStopUseMessage | cli_inner_pretty.js:(use-message renderer) | function |
| xd7 | renderTaskStopResultMessage | cli_inner_pretty.js:(result-message renderer) | function |
| mlK | TASK_STOP_PROMPT | cli_inner_pretty.js:(constant) | constant |
| Km | TASK_STOP_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — EnterPlanMode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Q38 | enterPlanModeTool | cli_inner_pretty.js:383798-383866 | object |
| ve_ | enterPlanModeInputSchema | cli_inner_pretty.js:383796 | function |
| ke_ | enterPlanModeOutputSchema | cli_inner_pretty.js:383797 | function |
| Q3H | ENTER_PLAN_MODE_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| Oo | logModeTransition | cli_inner_pretty.js:(mode-change telemetry) | function |
| Qz | applyPermissionRuleChange | cli_inner_pretty.js:(permission context mutator) | function |
| UkH | captureRevertState | cli_inner_pretty.js:(prePlanMode capture) | function |
| bf | isInterviewPhase | cli_inner_pretty.js:383636-383641 | function |
| il7 | renderEnterPlanModeUseMessage | cli_inner_pretty.js:(plan mode UI renderer) | function |
| rl7 | renderEnterPlanModeResultMessage | cli_inner_pretty.js:(result renderer) | function |
| ol7 | renderEnterPlanModeRejectedMessage | cli_inner_pretty.js:(rejected renderer) | function |
| ll7 | enterPlanModePrompt | cli_inner_pretty.js:383739-383741 | function |
| Te_ | planModeWorkflowText | cli_inner_pretty.js:383647-383658 | function |
| Ve_ | planModePromptBody | cli_inner_pretty.js:383660-383737 | function |

---

## Module: Tools — ExitPlanMode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| V2 | exitPlanModeTool | cli_inner_pretty.js:381649-381825 | object |
| sc7 | exitPlanModeInputSchema | cli_inner_pretty.js:381612-381623 | function |
| N53 | exitPlanModeNormalizedSchema | cli_inner_pretty.js:381624-381629 | function |
| nt_ | exitPlanModeOutputSchema | cli_inner_pretty.js:381630-381648 | function |
| lt_ | promptPermissionSchema | cli_inner_pretty.js:381606-381611 | function |
| dc7 | EXIT_PLAN_MODE_PROMPT | cli_inner_pretty.js:(constant) | constant |
| NZ | EXIT_PLAN_MODE_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| v2 | getPlanFilePath | cli_inner_pretty.js:(plan-file path accessor) | function |
| HW | readPlanFromDiskCache | cli_inner_pretty.js:(plan disk cache reader) | function |
| u38 | invalidatePlanCache | cli_inner_pretty.js:(plan cache invalidator) | function |
| h4$ | isPlanApprovalRequired | cli_inner_pretty.js:(team-mode gate) | function |
| HH$ | hasExitedPlanModeInSessionEver | cli_inner_pretty.js:(session-state accessor) | function |
| b38 | findMyAgentRecord | cli_inner_pretty.js:(agent record lookup) | function |
| qE6 | markAgentAwaitingApproval | cli_inner_pretty.js:(agent state mutator) | function |
| OT | markPlanModeExited | cli_inner_pretty.js:(session-state mutator) | function |
| qh | markPlanWasApproved | cli_inner_pretty.js:(session-state mutator) | function |
| MT | flushAutoModeBuffer | cli_inner_pretty.js:(auto-mode cleanup) | function |
| vC | logPlanModeTransition | cli_inner_pretty.js:(transition telemetry) | function |
| AQH | generateApprovalId | cli_inner_pretty.js:(unique id generator) | function |
| In | buildIdNamespace | cli_inner_pretty.js:(id namespace builder) | function |
| G1 | isToolNamed | cli_inner_pretty.js:(tool name matcher) | function |
| cc7 | renderExitPlanModeUseMessage | cli_inner_pretty.js:(plan UI renderer) | function |
| lc7 | renderExitPlanModeResultMessage | cli_inner_pretty.js:(approved renderer) | function |
| nc7 | renderExitPlanModeRejectedMessage | cli_inner_pretty.js:(declined renderer) | function |

---

## Module: Tools — EnterWorktree

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qn7 | enterWorktreeTool | cli_inner_pretty.js:383991-384062 | object |
| Ee_ | enterWorktreeInputSchema | cli_inner_pretty.js:383963-383987 | function |
| ye_ | enterWorktreeOutputSchema | cli_inner_pretty.js:383988-383990 | function |
| SiH | validateWorktreeSlug | cli_inner_pretty.js:522700 | function |
| DE6 | enterExistingWorktree | cli_inner_pretty.js:523107-523141 | function |
| DL$ | createNewWorktree | cli_inner_pretty.js:(new-worktree creator) | function |
| PDH | generateRandomWorktreeName | cli_inner_pretty.js:(random slug generator) | function |
| NP8 | listRepoWorktrees | cli_inner_pretty.js:(git worktree list reader) | function |
| BY | getRepoRoot | cli_inner_pretty.js:(repo-root walker) | function |
| oz | isInWorktreeSession | cli_inner_pretty.js:(active-session check) / getActiveWorktreeSession | function |
| xRH | hasCwdOverrideInSubagent | cli_inner_pretty.js:(subagent context check) | function |
| $JH | saveWorktreeSession | cli_inner_pretty.js:(session record persistence) | function |
| Ib | setWorktreeSession | cli_inner_pretty.js:(session record mutator) | function |
| RN | registerWorktreeOldCwd | cli_inner_pretty.js:(pre-chdir cwd capture) | function |
| KD | updateCwd | cli_inner_pretty.js:(cwd cache updater) | function |
| we | resetMemoryCache | cli_inner_pretty.js:(memory cache invalidator) | function |
| G0 | resetPlansDirCache | cli_inner_pretty.js:(plans dir cache invalidator) | function |
| SO | sessionReadCache | cli_inner_pretty.js:(read cache namespace) | object |
| CV | getActiveSession | cli_inner_pretty.js:383871-383873 | function |
| v$ | getSessionId | cli_inner_pretty.js:(session id accessor) | function |
| I$ | getCwd | cli_inner_pretty.js:(cwd accessor) | function |
| Hn7 | renderEnterWorktreeResult | cli_inner_pretty.js:383921-383938 | function |
| el7 | renderEnterWorktreeUseMessage | cli_inner_pretty.js:383918-383920 | function |
| tl7 | enterWorktreePromptBody | cli_inner_pretty.js:383882-383917 | function |
| kFH | ENTER_WORKTREE_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — ExitWorktree

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Mn7 | exitWorktreeTool | cli_inner_pretty.js:384192-384307 | object |
| he_ | exitWorktreeInputSchema | cli_inner_pretty.js:384167-384178 | function |
| Ie_ | exitWorktreeOutputSchema | cli_inner_pretty.js:384180-384191 | function |
| _n7 | exitWorktreePromptBody | cli_inner_pretty.js:384064-384094 | function |
| An7 | renderExitWorktreeUseMessage | cli_inner_pretty.js:384096-384098 | function |
| zn7 | renderExitWorktreeResult | cli_inner_pretty.js:384099-384125 | function |
| fn7 | detectWorktreeChanges | cli_inner_pretty.js:384132-384145 | function |
| On7 | restoreCwdAndCaches | cli_inner_pretty.js:384146-384149 | function |
| FkH | keepWorktreeAndExit | cli_inner_pretty.js:523142-523154 | function |
| CiH | deleteWorktreeAndExit | cli_inner_pretty.js:523155-523187 | function |
| RiH | killTmuxSession | cli_inner_pretty.js:(tmux kill) | function |
| X8 | runShell | cli_inner_pretty.js:(shell exec) | function |
| H6 | countNonEmptyLines | cli_inner_pretty.js:(non-empty filter+count) | function |
| k8H | resetReadHistory | cli_inner_pretty.js:(recent-files reset) | function |
| eOH | additionalCacheReset | cli_inner_pretty.js:(extra cache invalidator) | function |
| yH8 | EXIT_WORKTREE_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — ToolSearch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wL$ | toolSearchTool | cli_inner_pretty.js:383397-383616 | object |
| Fl7 | toolSearchInputSchema | cli_inner_pretty.js:383360-383368 | function |
| gl7 | toolSearchOutputSchema | cli_inner_pretty.js:383370-383377 | function |
| Bl7 | warmDeferredCache | cli_inner_pretty.js:(deferred-tool index warmer) | function |
| Ul7 | keywordSearch | cli_inner_pretty.js:(keyword-search ranker) | function |
| i4 | findTool | cli_inner_pretty.js:(exact-name lookup) | function |
| zm | isDeferredTool | cli_inner_pretty.js:(shouldDefer predicate) | function |
| IiH | buildResult | cli_inner_pretty.js:(output object builder) | function |
| UI | isToolSearchEnabled | cli_inner_pretty.js:(growthbook gate) | function |
| Pe_ | MCP_WAIT_BUDGET_MS | cli_inner_pretty.js:(wait budget constant) | constant |
| $_ | stripPrefix | cli_inner_pretty.js:(mcp__ prefix stripper) | function |
| xHH | MAX_DISPLAYED_PENDING | cli_inner_pretty.js:(pending-list cap) | constant |
| F38 | toolSearchPromptBuilder | cli_inner_pretty.js:383378-383396 | function |
| SH8 | toolSearchDescription | cli_inner_pretty.js:(tool description text) | function |
| L8 | memoizeWithKey | cli_inner_pretty.js:(memoize helper) | function |
| cY | TOOL_SEARCH_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |
| a8 | sleep | cli_inner_pretty.js:(promise-sleep) | function |

---

## Module: Tools — AskUserQuestion

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yiH | askUserQuestionTool | cli_inner_pretty.js:382084-382200 | object |
| st_ | askUserQuestionInputSchema | cli_inner_pretty.js:382065-382072 | function |
| tt_ | askUserQuestionOutputSchema | cli_inner_pretty.js:382073-382083 | function |
| rt_ | optionSchema | cli_inner_pretty.js:381973-381992 | function |
| ql7 | questionSchema | cli_inner_pretty.js:381993-382019 | function |
| Kl7 | annotationsSchema | cli_inner_pretty.js:382020-382034 | function |
| Hl7 | uniquenessCheck | cli_inner_pretty.js:382035-382046 | object |
| ot_ | answerCoercion | cli_inner_pretty.js:382047-382049 | function |
| at_ | answerCoercionPartial | cli_inner_pretty.js:382050-382064 | function |
| et_ | AskUserQuestionResultComponent | cli_inner_pretty.js:(Ink result component) | function |
| $e_ | validateHtmlPreview | cli_inner_pretty.js:(HTML validator for CCR web) | function |
| Cv$ | getClientUiMode | cli_inner_pretty.js:(html/tui mode detector) | function |
| _E6 | NOTES_ONLY_SENTINEL | cli_inner_pretty.js:381959 | constant |
| ClK | MAX_HEADER_LENGTH | cli_inner_pretty.js:(question header cap) | constant |
| blK | ASK_USER_QUESTION_DESCRIPTION | cli_inner_pretty.js:(constant) | constant |
| rY6 | askUserQuestionPromptBase | cli_inner_pretty.js:(constant prompt) | constant |
| ulK | askUserQuestionPromptExtra | cli_inner_pretty.js:(model-dependent extra) | constant |
| xlK | askUserQuestionPromptByMode | cli_inner_pretty.js:(client-mode extra) | object |
| LY | shouldShowModelExtra | cli_inner_pretty.js:(model-gate predicate) | function |
| Gz | ASK_USER_QUESTION_TOOL_NAME | cli_inner_pretty.js:(constant) | constant |

---

## Module: Tools — Cross-Cutting (Used by Multiple Tools)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yH | lazySchema | cli_inner_pretty.js:(lazy schema initializer) | function |
| XK | buildTool | cli_inner_pretty.js:(tool definition wrapper) | function |
| y | zod | cli_inner_pretty.js:(zod imported as y) | namespace |
| AA | isTeammate | cli_inner_pretty.js:(teammate context check) | function |
| DZ | isInProcessTeammate | cli_inner_pretty.js:(in-process teammate check) | function |
| jj | getOpenInteractivePrompts | cli_inner_pretty.js:(active prompts accessor) | function |
| T6 | isInteractiveTtyEnvironment | cli_inner_pretty.js:(TTY env check) | function |
| GQ | getRulesForTool | cli_inner_pretty.js:(permission rule getter) | function |
| RH | finishTelemetrySpan | cli_inner_pretty.js:(telemetry helper) | function |
| uH | finishErrorTelemetry | cli_inner_pretty.js:(error telemetry helper) | function |
| d | logEvent | cli_inner_pretty.js:(analytics event logger) | function |
| N | log | cli_inner_pretty.js:(logger) | function |
| ZH | extractErrorMessage | cli_inner_pretty.js:(error message extractor) | function |
| SH | serialize | cli_inner_pretty.js:(message serializer) | function |
| R9 | getProjectDir | cli_inner_pretty.js:(project cwd accessor) | function |
| HG | getCommandsForDir | cli_inner_pretty.js:(directory commands loader) | function |
| jH | inkBaseModule | cli_inner_pretty.js:(Ink renderer module) | namespace |
| rH | reactModule | cli_inner_pretty.js:(React module) | namespace |
| k | Text | cli_inner_pretty.js:(Ink Text component) | function |
| p | Box | cli_inner_pretty.js:(Ink Box component) | function |
| T8 | UIWrapper | cli_inner_pretty.js:(UI wrapper component) | function |
| g9 | declineGlyph | cli_inner_pretty.js:(Ink decline glyph) | constant |
| Cv | getThemeColor | cli_inner_pretty.js:(theme color accessor) | function |

---

## Notes on Naming

- **Tool definition pattern**: All tools follow the same shape — a Zod input schema, optional output schema, and a definition object with `name`, `description`, `prompt`, `inputSchema`, `outputSchema`, `call`, and various render methods. The definition object is wrapped via `XK()` (`buildTool`).

- **Schema lazy pattern**: All schemas are wrapped in `yH(() => ...)` (`lazySchema`). This defers schema construction to first access, breaking module-load-time circular dependencies.

- **Obfuscated naming conventions**:
  - Two-letter caps + suffix (e.g., `Kl_`, `Se_`, `Ce_`): Zod schema function
  - Three-letter caps (e.g., `Xn7`, `Zn7`, `hn7`): Tool definition object
  - Capital + digit + lowercase (e.g., `Q38`, `R38`, `w38`): Tool definition for newer tools
  - All-caps two letters (e.g., `D7`, `BZ`, `Kg`, `P0`, `OX`): Wire-name constants

- **Per-decl files**: Many of the symbols above have corresponding `.js` files under `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/decls/functions/<name>.js`. The single-letter or short obfuscated names not in that directory are typically lexical-scope variables that exist only in the bundle's outer module closure.

- **Tool wire-names vs JS variable names**: The wire-name (`"Agent"`, `"Skill"`, `"TaskCreate"`, etc.) is exposed via `tool.name`, while the JS variable holds the tool definition (`Gu7`, `SnH`, `Xn7`). The wire-name is what permission rules and analytics use; the JS variable is the internal handle. The constants `D7`/`fX`/`OX`/etc. hold the wire-names.

- **`feature('PROACTIVE')`, `feature('KAIROS')`, etc.**: Build-time feature flags from `bun:bundle`. Code gated by these is included or stripped at bundle time. The bundle here may have some flags inlined (e.g., the comment-only condition `feature('KAIROS')` may resolve to `true` or `false` depending on build).

---

**Status**: Consolidated into symbol_index_core_execution.md as of v2.1.142 deobfuscation work.
