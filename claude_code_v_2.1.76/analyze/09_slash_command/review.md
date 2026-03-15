# `/review` Command — Deep Reverse Engineering Analysis

## Overview

`/review` is a `prompt`-type built-in slash command that performs a pull request code review by instructing the LLM to use the `Bash` tool to invoke `gh` CLI commands. It is architecturally simple compared to `/statusline` or `/security-review` — it runs **inline in the main agent loop** (no subagent, no forked context), delegates all work to the LLM + Bash tool, and represents a "marketplace placeholder" pattern: the binary ships a fallback implementation while a proper plugin version is planned.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, CLI)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent Loop, Tools
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `HuA` (lazy initializer) - Registers `/review` command definition object (chunks.161.mjs:2577)
- `NN6` - The `/review` command definition object (chunks.161.mjs:2580)
- `bZ1` - Factory function creating builtin-prompt command objects (chunks.160.mjs:1289)
- `Wb4` (`handlePromptCommand`) - Executes prompt-type commands (chunks.130.mjs:1826)
- `qq` - The Bash tool object, referenced as `qq.name` = `"Bash"` (chunks.170.mjs:619)
- `h4` - `"Bash"` string constant (chunks.44.mjs:62)
- `Ma` (`processTemplateExpressions`) - executes `!`cmd`` and ` ```!\ncmd\n``` ` patterns in skill prompt text (chunks.81.mjs:601)
- `yD` - `parseFrontmatter`: parses YAML frontmatter from skill text (chunks.87.mjs area)
- `Hzq` (lazy initializer) - Registers `/security-review` command (chunks.162.mjs:1814)
- `wzq` - The `/security-review` command definition object (chunks.162.mjs:1819)

---

## Part 1: Command Definition — The `bZ1()` Factory

`/review` is created via the `bZ1()` helper function in `chunks.160.mjs:1289`, which is a **factory** shared by several builtin-prompt commands.

```javascript
// ============================================
// builtinPromptCommandFactory (bZ1) - Creates builtin-prompt command objects
// Location: chunks.160.mjs:1289-1313
// ============================================

// ORIGINAL (for source lookup):
function bZ1({
    name: A,
    description: q,
    progressMessage: K,
    pluginName: Y,
    pluginCommand: z,
    getPromptWhileMarketplaceIsPrivate: w
}) {
    return {
        type: "prompt",
        name: A,
        description: q,
        progressMessage: K,
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        userFacingName() { return A },
        source: "builtin",
        async getPromptForCommand(H, $) {
            return w(H, $)
        }
    }
}

// READABLE (for understanding):
function builtinPromptCommandFactory({
    name,
    description,
    progressMessage,
    pluginName,          // reserved: future marketplace plugin name
    pluginCommand,       // reserved: future marketplace command name
    getPromptWhileMarketplaceIsPrivate  // current fallback prompt generator
}) {
    return {
        type: "prompt",                     // injects into LLM conversation
        name,
        description,
        progressMessage,
        contentLength: 0,                   // no pre-loaded prompt content
        isEnabled: () => true,
        isHidden: false,
        userFacingName() { return name },
        source: "builtin",                  // hardcoded in binary, not from disk
        async getPromptForCommand(args, toolUseContext) {
            return getPromptWhileMarketplaceIsPrivate(args, toolUseContext)
        }
    }
}

// Mapping: bZ1→builtinPromptCommandFactory, A→name, q→description, K→progressMessage,
//          Y→pluginName, z→pluginCommand, w→getPromptWhileMarketplaceIsPrivate,
//          H→args, $→toolUseContext
```

**Commands using `bZ1()`:**

| Command | `pluginName` | `progressMessage` | Source chunk |
|---------|-------------|-------------------|-------------|
| `/review` | `"code-review"` | `"reviewing pull request"` | chunks.161.mjs:2580 |
| `/pr-comments` | `"pr-comments"` | `"fetching PR comments"` | chunks.160.mjs:1319 |
| `/security-review` | `"security-review"` | `"analyzing code changes for security risks"` | chunks.162.mjs:1819 |

**Why this factory exists:**

The `bZ1()` function enforces a consistent structure for commands designed to be replaced by marketplace plugins. The `pluginName`/`pluginCommand` fields are not consumed by `bZ1()` itself — they are metadata reserved for the marketplace loading system, which would substitute the plugin version once available. The `getPromptWhileMarketplaceIsPrivate` name is explicit: "this function runs only while the marketplace is not yet public."

**Key insight:** `bZ1()` does NOT create the command with any `context: "fork"` property, `allowedTools`, or hook mechanism. This means every command built with it uses the default inline execution path (`handlePromptCommand`/Wb4), runs in the main agent loop, and inherits the user's current tool permission settings.

---

## Part 2: `/review` Command Lazy Registration

The `/review` command definition is created by the `HuA` lazy initializer:

```javascript
// ============================================
// HuA - /review command lazy initializer
// Location: chunks.161.mjs:2577-2615
// ============================================

// ORIGINAL (for source lookup):
HuA = v(() => {
    i0();   // init BashTool module (sets qq = BashTool object)
    v3();   // init base utilities
    NN6 = bZ1({
        name: "review",
        description: "Review a pull request",
        progressMessage: "reviewing pull request",
        pluginName: "code-review",
        pluginCommand: "code-review",
        async getPromptWhileMarketplaceIsPrivate(A) {
            return u8("review"), [{
                type: "text",
                text: `
      You are an expert code reviewer. Follow these steps:

      1. If no PR number is provided in the args, use ${qq.name}("gh pr list") to show open PRs
      2. If a PR number is provided, use ${qq.name}("gh pr view <number>") to get PR details
      3. Use ${qq.name}("gh pr diff <number>") to get the diff
      4. Analyze the changes and provide a thorough code review that includes:
         - Overview of what the PR does
         - Analysis of code quality and style
         - Specific suggestions for improvements
         - Any potential issues or risks

      Keep your review concise but thorough. Focus on:
      - Code correctness
      - Following project conventions
      - Performance implications
      - Test coverage
      - Security considerations

      Format your review with clear sections and bullet points.

      PR number: ${A}
    `
            }]
        }
    })
})

// READABLE (for understanding):
registerReviewCommand = once(() => {
    initBashToolModule();   // i0(): loads BashTool (qq), sets qq.name = "Bash"
    initBaseUtils();        // v3()
    reviewCommandDefinition = builtinPromptCommandFactory({
        name: "review",
        description: "Review a pull request",
        progressMessage: "reviewing pull request",
        pluginName: "code-review",         // future marketplace plugin
        pluginCommand: "code-review",      // future marketplace command
        async getPromptWhileMarketplaceIsPrivate(args) {
            trackUISection("review");      // u8: telemetry for UI section
            return [{
                type: "text",
                text: `
      You are an expert code reviewer. Follow these steps:

      1. If no PR number is provided in the args, use Bash("gh pr list") to show open PRs
      2. If a PR number is provided, use Bash("gh pr view <number>") to get PR details
      3. Use Bash("gh pr diff <number>") to get the diff
      4. Analyze the changes and provide a thorough code review that includes:
         - Overview of what the PR does
         - Analysis of code quality and style
         - Specific suggestions for improvements
         - Any potential issues or risks

      Keep your review concise but thorough. Focus on:
      - Code correctness
      - Following project conventions
      - Performance implications
      - Test coverage
      - Security considerations

      Format your review with clear sections and bullet points.

      PR number: ${args}
    `
            }]
        }
    })
})

// Mapping: HuA→registerReviewCommand, NN6→reviewCommandDefinition, v→once,
//          i0→initBashToolModule, v3→initBaseUtils, bZ1→builtinPromptCommandFactory,
//          u8→trackUISection, qq→BashTool (qq.name = "Bash" = h4),
//          A→args
```

### Key Design Decisions

**`${qq.name}` instead of hardcoded `"Bash"`:**
The prompt references the Bash tool by `qq.name` (evaluated at function call time, not at definition time). This ensures that if the tool name changes (e.g., `SandboxedBash` in sandboxed environments), the prompt dynamically uses the correct tool name. The LLM sees the actual tool name available in its context.

**`u8("review")` fires inside `getPromptWhileMarketplaceIsPrivate`:**
`trackUISection("review")` is called when the prompt is *generated* (during `getPromptForCommand`), not at command dispatch. This is unlike most slash commands where tracking happens at the dispatch level. The effect: if `getPromptWhileMarketplaceIsPrivate` is called multiple times in the same session (e.g., if the command is invoked twice), the telemetry fires each time.

**No args validation:**
The prompt simply appends `PR number: ${A}` (where A is the raw args string). If the user passes `/review 42`, the LLM sees `PR number: 42`. If the user passes `/review` with no args, the LLM sees `PR number: ` (empty). The LLM is instructed to handle the empty case by running `gh pr list`.

**Why no `allowedTools` restriction:**
Unlike `/security-review` which explicitly specifies `allowed-tools: Bash(git diff:*), ...` in its frontmatter, `/review` imposes no tool restrictions. All Bash commands the LLM attempts will go through the user's normal permission settings.

---

## Part 3: Prompt Architecture — `/review` vs `/security-review`

Understanding `/review` requires contrasting it with `/security-review`, which uses the same `bZ1()` factory but follows a fundamentally different prompt architecture.

### `/review` Prompt Architecture (Simple)

```
getPromptWhileMarketplaceIsPrivate(args, toolUseContext):
  └─ Returns: [{ type: "text", text: "<hardcoded instruction string with args interpolated>" }]

NO shell execution at prompt generation time.
NO tool restriction.
NO sub-tasks.
LLM uses Bash tool during execution to fetch PR data.
```

### `/security-review` Prompt Architecture (Advanced)

```javascript
// ============================================
// securityReviewPromptGenerator - Advanced prompt with frontmatter + template execution
// Location: chunks.162.mjs:1825-1849
// ============================================

// ORIGINAL (for source lookup):
async getPromptWhileMarketplaceIsPrivate(A, q) {
    u8("security-review");
    let K = yD(y7z), Y = Vh(K.frontmatter["allowed-tools"]);
    return [{ type: "text", text: await Ma(K.content, { ...q,
        async getAppState() {
            let w = await q.getAppState();
            return { ...w, toolPermissionContext: { ...w.toolPermissionContext,
                alwaysAllowRules: { ...w.toolPermissionContext.alwaysAllowRules, command: Y } } }
        } }, "security-review") }]
}

// READABLE (for understanding):
async getPromptWhileMarketplaceIsPrivate(args, toolUseContext) {
    trackUISection("security-review");

    // 1. Parse YAML frontmatter from the embedded skill text
    let parsed = parseFrontmatter(SECURITY_REVIEW_SKILL_TEXT);    // yD
    // frontmatter includes: allowed-tools: Bash(git diff:*), Bash(git status:*), ...

    // 2. Expand the allowed-tools list
    let allowedCommands = expandToolList(parsed.frontmatter["allowed-tools"]);  // Vh

    // 3. Process template expressions: execute !`shell command` patterns
    //    The skill text contains:
    //    - !`git status`
    //    - !`git diff --name-only origin/HEAD...`
    //    - !`git log --no-decorate origin/HEAD...`
    //    - !`git diff --merge-base origin/HEAD`
    let processedContent = await processTemplateExpressions(     // Ma
        parsed.content,
        {
            ...toolUseContext,
            async getAppState() {
                let appState = await toolUseContext.getAppState();
                return {
                    ...appState,
                    toolPermissionContext: {
                        ...appState.toolPermissionContext,
                        alwaysAllowRules: {
                            ...appState.toolPermissionContext.alwaysAllowRules,
                            command: allowedCommands    // auto-allow git commands
                        }
                    }
                };
            }
        },
        "security-review"
    );

    return [{ type: "text", text: processedContent }];
}

// Mapping: A→args, q→toolUseContext, K→parsedFrontmatter, Y→allowedCommands,
//          yD→parseFrontmatter, y7z→SECURITY_REVIEW_SKILL_TEXT, Vh→expandToolList,
//          Ma→processTemplateExpressions, u8→trackUISection
```

**`processTemplateExpressions` (Ma) — Shell execution during prompt generation:**

The `Ma()` function executes shell commands embedded in the skill text using two patterns:
- `` !`command` `` — inline backtick execution
- ` ```!\ncommand\n``` ` — fenced code block execution

These run BEFORE the prompt is sent to the LLM. The output is embedded directly in the prompt text. So when `/security-review` runs, the LLM receives:
```
GIT STATUS:
```
M  src/auth.py
M  src/utils.py
```
FILES MODIFIED:
src/auth.py
src/utils.py
DIFF CONTENT:
diff --git a/src/auth.py ...
[full diff here]
```

The LLM sees pre-fetched data, no need to use Bash tool for git commands.

**Why `/review` doesn't use this approach:**
`/review` needs the PR number first, which comes from user args. The shell execution pattern (`!`command``) runs at prompt-generation time, before the LLM sees args. To use it, `/security-review` pre-runs git commands without needing user input (it always reviews the current branch). `/review` needs to look up a specific PR by number, which requires a dynamic Bash call.

**Sub-tasks in `/security-review` prompt text:**

The `/security-review` prompt explicitly instructs the LLM to use sub-tasks:
```
1. Use a sub-task to identify vulnerabilities.
2. Then for each vulnerability identified by the above sub-task, create a new sub-task to filter out false-positives. Launch these sub-tasks as parallel sub-tasks.
3. Filter out any vulnerabilities where the sub-task reported a confidence less than 8.
```

This means `/security-review` **DOES trigger subagents** (via the Task tool) — but at the LLM's initiative during execution, not as a structural fork. The subagent spawning is driven by the LLM following prompt instructions.

**`/review` does NOT trigger subagents** — its prompt makes no mention of sub-tasks.

---

## Part 4: Execution Flow

### Complete Step-by-Step Path

```
User types: /review 42
    │
    ▼
[1] REPL onSubmit handler (handleSubmitCommand / PE6, chunks.185.mjs:3105)
    - Input starts with "/" → check for immediate commands
    - "review" is NOT in the immediate command set → continue to pipeline
    - Call cMz(input, ...) → call fJz(input, ...)
    │
    ▼
[2] fJz (chunks.178.mjs:2209): input starts with "/"
    - Calls handleSlashInput(Mb4)("/review 42", ..., toolUseContext, ...)
    │
    ▼
[3] handleSlashInput (Mb4, chunks.130.mjs:1506):
    - parseSlashCommand("/review 42") → { commandName: "review", args: "42", isMcp: false }
    - isCommandAvailable("review", commands) → true
    - setLoading(true)   [w(!0)] → triggers spinner in REPL UI
    - trackUISection("slash-commands")  [u8("slash-commands")]
    - executeCommand("review", "42", setJSX, toolUseContext, ...)
    │
    ▼
[4] executeCommand (ifY, chunks.130.mjs:1627):
    - findCommand("review", ...) → reviewCommandDefinition (NN6)
    - command.type === "prompt" && command.userInvocable !== false → trackSkillUsage("review")
    - switch(command.type): case "prompt":
      - command.context === undefined (not "fork") → handlePromptCommand(Wb4)
    │
    ▼
[5] handlePromptCommand (Wb4, chunks.130.mjs:1826):
    - promptContent = await command.getPromptForCommand("42", toolUseContext)
      - Calls getPromptWhileMarketplaceIsPrivate("42")
      - Calls trackUISection("review")  [u8("review")]   ← telemetry fires here
      - Returns [{type:"text", text:"You are an expert code reviewer. ...PR number: 42"}]
    - No hooks registered (command.hooks is undefined)
    - metadataString = buildSkillMetadata(command, "42")
      = buildUserFacingMetadata("review", "42")   [jb4("review", "42")]
      = '<command-message>review</command-message>\n<command-name>/review</command-name>\n<command-args>42</command-args>'
    - allowedTools = expandToolList([])  [hd([])]  = []  (no restriction)
    - thinkingTokenAttachments = await computeThinkingAllocation(...)
    - Build message array D = [
        Message 1: userMessage({ content: metadataString })
        Message 2: userMessage({ content: promptContent, isMeta: true })
        ...thinkingTokenAttachments
        Message N: attachmentMessage({ type: "command_permissions", allowedTools: [], model: undefined })
      ]
    - Returns { messages: D, shouldQuery: true, allowedTools: [], model: undefined, command }
    │
    ▼
[6] Back in handleSlashInput:
    - Emits telemetry "tengu_input_command" (no pluginInfo → no plugin fields)
    - Returns { messages: D, shouldQuery: true, ... }
    │
    ▼
[7] Back in cMz / Vv6:
    - G.shouldQuery === true → run UserPromptSubmit hooks (HyA)
    - Returns { messages: D, shouldQuery: true, allowedTools: [] }
    │
    ▼
[8] cMz calls onQuery (P/ff, chunks.188.mjs:589):
    - X6((messages) => [...messages, ...D])  → adds command messages to conversation state
    - Calls oc(updatedMessages, D, abortController, true, [], model, ...)
    │
    ▼
[9] oc (main query callback, chunks.188.mjs:550):
    - shouldQuery === true → Fd.handleQueryStart(...)
    - J0(messages, ..., allowedTools=[], ...) → creates toolUseContext
      - getAppState() sets alwaysAllowRules.command = [] (no auto-allow for Bash)
    - Build system prompt (ot)
    - Calls ZR(messages, systemPrompt, toolUseContext, ...) → main agent loop
    │
    ▼
[10] Main agent loop (ZR):
    - Sends messages + system prompt to LLM API
    - LLM reads the "/review 42" prompt
    - LLM decides to use Bash("gh pr view 42") → tool permission check → user approval / auto-allow
    - LLM executes Bash("gh pr diff 42") → gets diff
    - LLM analyzes the diff and produces structured code review response
    │
    ▼
[11] LLM response streams to UI:
    - Agent loop emits assistant messages with text and tool_use blocks
    - UI renders streaming code review output
    - setLoading(false) when complete
```

---

## Part 5: Message Array Construction

When the user runs `/review 42`, `handlePromptCommand` (Wb4) builds this message array:

```
Message 1 — Command Identity (user message, visible in history):
  Content: '<command-message>review</command-message>
            <command-name>/review</command-name>
            <command-args>42</command-args>'

Message 2 — Skill Prompt (user message, isMeta:true, hidden from compaction):
  Content: [{ type:"text", text: "You are an expert code reviewer. Follow these steps:..." }]
  Note: isMeta:true means compaction will NOT include this in summary;
        only Message 1 (the command invocation) is preserved across compaction boundaries.

Message 3+ — Thinking Budget (0 or 1 messages, attachment type "thinking_budget"):
  Present only if thinking mode is enabled and content warrants a budget.

Message N — Command Permissions (attachment, invisible to LLM):
  { type: "command_permissions", allowedTools: [], model: undefined }
  Note: This is normalized to [] for the API (chunks.173.mjs:1119) — NOT sent to LLM.
        Used internally by getAppState() to set alwaysAllowRules.command = [].
```

**Why `isMeta: true` on the prompt content?**

The review prompt text is large (several hundred tokens). If every compaction summary included the full prompt text, the context would quickly fill with repeated skill prompts. Tagging as `isMeta: true` tells the compaction system to exclude it — only the `<command-name>/review</command-name>` line is preserved in summaries, indicating that a review was run.

**Why `allowedTools: []` (empty)?**

`bZ1()` doesn't accept or set `allowedTools` in the command definition. The `/review` command does not specify which Bash commands to pre-approve. This means:
- In **default mode**: User will see permission prompts for each `gh` command the LLM uses
- In **acceptEdits mode**: Commands matching `alwaysAllowRules` are auto-approved
- In **bypassPermissions mode**: All tools auto-approved

Contrast with `/security-review`: its `getPromptWhileMarketplaceIsPrivate` manually calls `Ma()` with a modified `toolPermissionContext` where `alwaysAllowRules.command` = the git command whitelist from frontmatter. This gives `/security-review` fine-grained, session-scoped auto-approval for specific git commands.

---

## Part 6: UI Loading State

When `/review` runs, the loading state machine:

```
User presses Enter
         │
         ▼
setLoading(true)  [w(!0) in Mb4, chunks.130.mjs:1559]
  → _4 (isLoading) = true in REPL state

         │
         ▼
PG (showProgress) condition evaluates (chunks.188.mjs:231):
  PG = (!vK || vK.showSpinner === !0)   // not in local-jsx mode
     && F7.length === 0                  // no pending permission prompts
     && (_4 || Wz || L9 || xp7() > 0)   // _4=true → PG=true
     && !q1                              // not waiting for worker
     && !MG                              // not all tools are display-only

         │
         ▼
GR4 component (LoadingIndicator) renders (chunks.188.mjs:1142):
  <LoadingIndicator
    mode={O7}                     // current mode (streaming/thinking/etc.)
    spinnerTip={N1}               // from appState.spinnerTip (null initially)
    responseLengthRef={Qj}        // tracks response token count
    overrideMessage={gj}          // override text (null for /review)
    spinnerSuffix={Hx}            // suffix appended to spinner
    verbose={S}                   // verbose mode flag
    hasActiveTools={ow.size > 0}  // true when LLM is using tools
  />

         │
         ▼ LLM calls Bash("gh pr view 42")
Tool use blocks render in conversation as "Running gh pr view 42" progress indicators
         │
         ▼ LLM streams final review text
Loading indicator disappears, review renders in conversation

         │
         ▼
LLM loop ends → setLoading(false) via YK() in oc()
```

**Why `progressMessage: "reviewing pull request"` is not shown in the spinner:**

For user-invocable `prompt`-type commands (like `/review`), the `progressMessage` field is stored on the command object but NOT used as the spinner label. The spinner message is driven by:
1. `spinnerTip` from app state (controlled by the agent loop's activity state)
2. `overrideMessage` prop (null for `/review`)

The `progressMessage` field IS used when a command is invoked as a model-only skill via the Skill tool — it appears in `evA(skillName, progressMessage)` as `<skill-format>true</skill-format>` metadata. But for user-invoked `/review`, the standard loading spinner applies.

---

## Part 7: The "Marketplace Placeholder" Pattern

The `getPromptWhileMarketplaceIsPrivate` naming reveals an explicit architectural intention: these built-in commands are **temporary fallbacks** until the corresponding marketplace plugins ship.

**Evidence:**

1. **Name**: `getPromptWhileMarketplaceIsPrivate` — "while the marketplace is private" = "until the marketplace goes public"
2. **`pluginName`/`pluginCommand` fields**: `bZ1()` stores these but doesn't use them. They're metadata for the future loading system.
3. **Three parallel commands**: `/review` (code-review), `/pr-comments` (pr-comments), `/security-review` (security-review) all follow the same pattern.
4. **`contentLength: 0`**: Unlike disk-loaded skills that track content size, built-in commands set `contentLength: 0`. This marks them as "not loaded from file content."

**How the marketplace loading would work (inferred):**

When a marketplace plugin named `"code-review"` is installed:
```
1. Plugin is loaded via loadPluginSkills (B0A)
2. Plugin creates a command with name: "review" and pluginInfo set
3. In getAllCommands (cZ), the plugin's "review" command appears BEFORE the built-in "review"
4. findCommand("review", ...) finds the plugin version first
5. Built-in fallback is bypassed
```

This explains why `getAllCommands` (cZ) puts bundled skills BEFORE built-in commands in the merged list:
```javascript
[...bundledSkills, ...skillDirCommands, ...mcpCommands, ...pluginSkills, ...externalCommands, ...getBuiltinCommands()]
```

Plugin commands (from `pluginSkills`) appear before `getBuiltinCommands()`, so marketplace plugins naturally override the built-in fallbacks.

---

## Part 8: Subagent Analysis — Does `/review` Trigger a Subagent?

**Answer: NO.** `/review` does NOT trigger subagents.

**Evidence:**

1. **No `context: "fork"`**: The `bZ1()` factory does not set `context: "fork"`. Only commands with `context: "fork"` trigger `handleForkedCommand (cfY)`, which spawns a dedicated sub-agent loop.

2. **`handlePromptCommand` path**: `/review` takes the `Wb4` path in `executeCommand` (ifY). This returns `shouldQuery: true`, causing the main agent loop to process the prompt inline.

3. **Prompt text analysis**: The review prompt contains NO instructions to use the Task tool or spawn sub-tasks. It only instructs the LLM to use `Bash("gh pr list/view/diff")`.

4. **Contrast with `/statusline`**: `/statusline` uses `context: "fork"` to spawn a `statusline-setup` subagent with isolated state. This is the subagent pattern.

5. **Contrast with `/security-review`**: The security review prompt *explicitly* tells the LLM to "Use a sub-task to identify vulnerabilities" and "create new sub-tasks as parallel sub-tasks." This triggers Task tool calls (subagents) at LLM execution time. But this is **LLM-driven** subagent spawning, not structural forking.

**Subagent involvement comparison:**

| Command | Structural Fork | LLM-Driven Subagents | Notes |
|---------|----------------|----------------------|-------|
| `/review` | ❌ None | ❌ Prompt doesn't instruct sub-tasks | Inline main loop, Bash tool only |
| `/statusline` | ✅ `context: "fork"` → `handleForkedCommand` | ✅ Spawns `statusline-setup` subagent | Full structural fork |
| `/security-review` | ❌ None | ✅ Prompt explicitly instructs parallel sub-tasks | LLM-driven via Task tool |

---

## Part 9: Complete UI Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ User types: /review 42 [Enter]                                      │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────────┐
│ REPL Input Area                                                      │
│ ▶  /review 42   [Enter]                                              │
│ → Not immediate command → goes to pipeline                          │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼ setLoading(true)
┌──────────────────────────────────────────────────────────────────────┐
│ REPL shows LoadingIndicator (GR4):                                   │
│                                                                      │
│  ⠸ Thinking…                                                         │
│                                                                      │
│ (isLoading=true triggers PG=true → GR4 renders)                     │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼ Messages added to conversation history:
          │   [Message 1: /review metadata - visible]
          │   [Message 2: review prompt - invisible isMeta:true]
          │   [Message N: command_permissions attachment]
          │
          ▼ LLM API call begins streaming
┌──────────────────────────────────────────────────────────────────────┐
│ REPL Conversation Area:                                              │
│                                                                      │
│  ▶  /review 42                                                       │
│  ⎿  [Streaming]                                                      │
│                                                                      │
│  ⠸  Running Bash("gh pr view 42")              ← tool progress      │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼ User sees tool permission prompt (if not auto-allowed)
┌──────────────────────────────────────────────────────────────────────┐
│ Permission Dialog (tool-permission):                                 │
│                                                                      │
│  Allow Bash to run: gh pr view 42?                                   │
│  [Yes, this time] [Yes, don't ask again] [No]                       │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼ User approves → LLM continues
┌──────────────────────────────────────────────────────────────────────┐
│ REPL Conversation Area:                                              │
│                                                                      │
│  ▶  /review 42                                                       │
│  ⎿  ⠸ Running Bash("gh pr diff 42")            ← tool progress      │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼ LLM produces final review → streams to UI
┌──────────────────────────────────────────────────────────────────────┐
│ REPL Conversation Area (final):                                      │
│                                                                      │
│  ▶  /review 42                                                       │
│  ⎿  ## Code Review: PR #42                                           │
│     ### Overview                                                     │
│     This PR adds authentication middleware...                        │
│     ### Code Quality                                                 │
│     - ✓ Follows project conventions                                  │
│     - ⚠ Missing input validation on line 42                         │
│     ...                                                              │
└──────────────────────────────────────────────────────────────────────┘
          │
          ▼ setLoading(false) → spinner disappears → REPL input restored
```

---

## Part 10: Comparison with Related Commands

### `/review` vs `/pr-comments` vs `/security-review`

All three use `bZ1()` but have different prompt strategies:

| Aspect | `/review` | `/pr-comments` | `/security-review` |
|--------|-----------|----------------|-------------------|
| Prompt type | Instruction string | Instruction string | Frontmatter YAML + template |
| Pre-execution | None | None | `Ma()` runs git commands to prefetch data |
| Tool restrictions | None (allowedTools: []) | None | Frontmatter `allowed-tools:` → git commands auto-allowed |
| Sub-tasks | No | No | Yes (LLM-driven, not structural) |
| Args handling | PR number passed to LLM | Optional user context | No args (current branch) |
| Context needed | GitHub PR | GitHub PR | Local git repo |

### `/review` vs `/statusline`

| Aspect | `/review` | `/statusline` |
|--------|-----------|---------------|
| Command type | `"prompt"` | `"prompt"` |
| Execution path | `handlePromptCommand` (Wb4) | `handleForkedCommand` (cfY) |
| Context | None (inline) | `context: "fork"` |
| Subagent | No | Yes: `statusline-setup` agent via Task tool |
| Progress display | Standard spinner | Streaming JSX progress from forked agent |
| Result | LLM streams directly to conversation | Forked agent result wrapped in `<local-command-stdout>` |

---

## Part 11: Related Symbols

> Symbol mappings are maintained in the central symbol index files:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Builtin Prompt Command Factory section, Skill Execution Helpers section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agent Loop, Tools

Key functions in this document:
- `bZ1` (builtinPromptCommandFactory) - Factory creating builtin-prompt command objects
- `NN6` (reviewCommandDefinition) - The `/review` command object
- `HuA` (registerReviewCommand) - Lazy init for review command
- `wzq` (securityReviewCommandDefinition) - The `/security-review` command object
- `Hzq` (registerSecurityReviewCommand) - Lazy init for security-review command
- `y7z` (SECURITY_REVIEW_SKILL_TEXT) - Full YAML frontmatter + prompt for security-review
- `m5q` (prCommentsCommandDefinition) - The `/pr-comments` command object
- `Ma` (processTemplateExpressions) - Executes `!`cmd`` / ` ```!\ncmd\n``` ` in skill text
- `q09` (TEMPLATE_CODE_BLOCK_REGEX) - Pattern for fenced code block shell expansion
- `K09` (TEMPLATE_INLINE_REGEX) - Pattern for inline backtick shell expansion

---

## Part 12: Telemetry Events

| Event | When | Source |
|-------|------|--------|
| `tengu_input_command` | When `/review` command messages are returned | `handleSlashInput` (Mb4) |
| No `plugin_name`/`plugin_repository` fields | `/review` has no `pluginInfo` property | `bZ1()` doesn't set `pluginInfo` |
| `trackUISection("slash-commands")` | When executeCommand starts | `handleSlashInput` line 1559 |
| `trackUISection("review")` | When prompt is generated | `getPromptWhileMarketplaceIsPrivate` |
| `trackSkillUsage("review")` | When command executes (usage tracking for scoring) | `executeCommand` (ifY) line 1629 |
