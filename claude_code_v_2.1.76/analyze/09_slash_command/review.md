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
    name, description, progressMessage,
    pluginName, pluginCommand,
    getPromptWhileMarketplaceIsPrivate
}) {
    return {
        type: "prompt",
        name, description, progressMessage,
        contentLength: 0,
        isEnabled: () => true,
        isHidden: false,
        userFacingName() { return name },
        source: "builtin",
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

**Why this factory exists:** The `bZ1()` function enforces a consistent structure for commands designed to be replaced by marketplace plugins. The `pluginName`/`pluginCommand` fields are not consumed by `bZ1()` itself — they are metadata reserved for the marketplace loading system.

**Key insight:** `bZ1()` does NOT create the command with any `context: "fork"` property, `allowedTools`, or hook mechanism. This means every command built with it uses the default inline execution path (`handlePromptCommand`/Wb4), runs in the main agent loop, and inherits the user's current tool permission settings.

---

## Part 2: `/review` Command Definition

```javascript
// ============================================
// HuA - /review command lazy initializer
// Location: chunks.161.mjs:2577-2615
// ============================================

// READABLE (for understanding):
registerReviewCommand = once(() => {
    initBashToolModule();   // loads BashTool (qq), sets qq.name = "Bash"
    initBaseUtils();
    reviewCommandDefinition = builtinPromptCommandFactory({
        name: "review",
        description: "Review a pull request",
        progressMessage: "reviewing pull request",
        pluginName: "code-review",
        pluginCommand: "code-review",
        async getPromptWhileMarketplaceIsPrivate(args) {
            trackUISection("review");
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
//          u8→trackUISection, qq→BashTool (qq.name = "Bash" = h4)
```

### Key Design Decisions

**`${qq.name}` instead of hardcoded `"Bash"`:**
The prompt references the Bash tool by `qq.name` (evaluated at function call time, not at definition time). This ensures that if the tool name changes (e.g., `SandboxedBash` in sandboxed environments), the prompt dynamically uses the correct tool name.

**No args validation:**
The prompt simply appends `PR number: ${A}`. If the user passes `/review 42`, the LLM sees `PR number: 42`. If the user passes `/review` with no args, the LLM handles the empty case by running `gh pr list`.

**Why no `allowedTools` restriction:**
Unlike `/security-review` which explicitly specifies `allowed-tools:` in its frontmatter, `/review` imposes no tool restrictions. All Bash commands the LLM attempts will go through the user's normal permission settings.

---

## Part 3: Prompt Architecture — `/review` vs `/security-review`

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

`/security-review` uses frontmatter parsing and template execution:
1. Parse YAML frontmatter from the embedded skill text (allowed-tools: Bash(git diff:*), ...)
2. Expand the allowed-tools list
3. Process template expressions: execute `` !`command` `` patterns to pre-fetch git data
4. Return processed content with git data embedded in the prompt

The LLM receives pre-fetched data and explicitly instructs: "Use a sub-task to identify vulnerabilities" — triggering parallel subagents via the Task tool.

**Why `/review` doesn't use this approach:**
`/review` needs the PR number first, which comes from user args. The shell execution pattern runs at prompt-generation time. `/security-review` can pre-run git commands without user input (it always reviews the current branch). `/review` needs a dynamic PR lookup.

---

## Part 4: Execution Flow

### Complete Step-by-Step Path

```
User types: /review 42
    │
    ▼
[1] REPL onSubmit → handleSlashInput (Mb4)
    - parseSlashCommand("/review 42") → { commandName: "review", args: "42" }
    │
    ▼
[2] executeCommand (ifY):
    - findCommand("review") → reviewCommandDefinition (NN6)
    - command.type === "prompt" → handlePromptCommand (Wb4)
    │
    ▼
[3] handlePromptCommand (Wb4):
    - promptContent = await command.getPromptForCommand("42", toolUseContext)
      → Returns [{type:"text", text:"You are an expert code reviewer. ...PR number: 42"}]
    - metadataString = '<command-message>review</command-message>...'
    - allowedTools = [] (no restriction)
    - Returns { messages: D, shouldQuery: true, allowedTools: [] }
    │
    ▼
[4] Main agent loop (ZR):
    - Sends messages + system prompt to LLM API
    - LLM decides to use Bash("gh pr view 42") → permission check
    - LLM executes Bash("gh pr diff 42") → gets diff
    - LLM produces structured code review response
```

---

## Part 5: Subagent Analysis

**Answer: NO.** `/review` does NOT trigger subagents.

**Evidence:**
1. No `context: "fork"`: Takes the `Wb4` path, not `cfY`
2. Prompt text makes no mention of sub-tasks or the Task tool
3. Only instructs LLM to use `Bash("gh pr list/view/diff")`

**Comparison:**

| Command | Structural Fork | LLM-Driven Subagents |
|---------|----------------|----------------------|
| `/review` | No | No |
| `/statusline` | Yes (`context: "fork"`) | Yes (spawns statusline-setup) |
| `/security-review` | No | Yes (prompt explicitly instructs parallel sub-tasks) |

---

## Part 6: The "Marketplace Placeholder" Pattern

The `getPromptWhileMarketplaceIsPrivate` naming reveals an explicit architectural intention: these built-in commands are **temporary fallbacks** until the corresponding marketplace plugins ship.

**Evidence:**
1. **Name**: "while the marketplace is private" = "until the marketplace goes public"
2. **`pluginName`/`pluginCommand` fields**: stored but not consumed, reserved for the future loading system
3. **Three parallel commands**: `/review`, `/pr-comments`, `/security-review` all follow the same pattern

**How marketplace override would work:**
When a plugin named `"code-review"` is installed, it creates a command with `name: "review"` and `pluginInfo` set. In `getAllCommands` (cZ), plugin commands appear before built-ins, so the plugin version is found first by `findCommand`, naturally bypassing the built-in fallback.

---

## Part 7: Related Symbols

> Symbol mappings are maintained in the central symbol index files:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)

Key functions in this document:
- `bZ1` (builtinPromptCommandFactory) - Factory creating builtin-prompt command objects
- `NN6` (reviewCommandDefinition) - The `/review` command object
- `HuA` (registerReviewCommand) - Lazy init for review command
- `wzq` (securityReviewCommandDefinition) - The `/security-review` command object
- `Hzq` (registerSecurityReviewCommand) - Lazy init for security-review command
- `y7z` (SECURITY_REVIEW_SKILL_TEXT) - Full YAML frontmatter + prompt for security-review
- `m5q` (prCommentsCommandDefinition) - The `/pr-comments` command object
- `Ma` (processTemplateExpressions) - Executes `` !`cmd` `` in skill text
