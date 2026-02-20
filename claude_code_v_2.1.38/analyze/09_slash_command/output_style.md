# Slash Command & Skill Output Style (Claude Code 2.1.38)

## Overview

The output style layer describes how slash command invocations and skill executions are visually rendered in the terminal UI. This is a separate concern from the execution pipeline — the execution layer produces XML-tagged message content, and the output style layer transforms that content into styled Ink/React terminal components.

The pipeline has two orthogonal axes:

```
Axis 1: Message content type
  <command-message>  →  command invocation bubble (iI4)
  <local-command-stdout>  →  output block with ⎿ prefix (Ox4)

Axis 2: Skill tool state during execution
  pending/running  →  HP6 (progress list, last 3 items)
  result           →  bu4 ("Successfully loaded skill" or "Done")
  rejected         →  Bu4 (progress list + ✗ indicator)
  error            →  mu4 (progress list + error block)
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash Commands, UI Components

Key functions in this document:
- `commandMessageRenderer` (iI4) - Renders the `<command-message>` invocation bubble (chunks.127.mjs:422)
- `localCommandResultRenderer` (_x4) - Parses and renders `<local-command-stdout>/<local-command-stderr>` (chunks.129.mjs:274)
- `CommandOutputLine` (Ox4) - Single output line with `⎿` indent prefix (chunks.129.mjs:308)
- `extractXmlTag` (C4) - Extracts content from `<tag>...</tag>` in message text (chunks.129.mjs)
- `skillRenderToolUseMessage` (uu4) - Skill name label in tool-use header (chunks.132.mjs:589)
- `skillRenderToolUseProgressMessage` (HP6) - Scrollable progress list during execution (chunks.132.mjs:598)
- `skillRenderToolResultMessage` (bu4) - "Successfully loaded skill" result block (chunks.132.mjs:574)
- `skillRenderToolUseRejectedMessage` (Bu4) - Progress + rejection indicator (chunks.132.mjs:634)
- `skillRenderToolUseErrorMessage` (mu4) - Progress + error block (chunks.132.mjs:640)
- `extractChatTitle` (I2z) - Extracts conversation title, skips command output (chunks.174.mjs:60)
- `SKIP_TITLE_REGEX` (fJq) - Regex: patterns skipped in title extraction (chunks.174.mjs:273)
- `COMMAND_NAME_TAG` (SG) - Constant `"command-name"` (chunks.9.mjs:1239)
- `COMMAND_MESSAGE_TAG` (pP) - Constant `"command-message"` (chunks.9.mjs:1241)

---

## Part 1: The Command Invocation Bubble

### commandMessageRenderer (iI4) — `<command-message>` Rendering

**What it does:** Renders the user's slash command input as a styled "bubble" in the conversation transcript. This is the visual element shown when a user types `/commit fix auth bug` or when the LLM invokes a skill.

**Two visual variants** based on the `<skill-format>true</skill-format>` flag injected by `buildForkedSkillMetadata(evA)`:

```
User-invoked skill (userInvocable = true):
  ▶  /commit fix auth bug

LLM-invoked skill (userInvocable = false, skill-format = true):
  ▶  Skill(commit)
```

```javascript
// ============================================
// commandMessageRenderer - Render slash command invocation bubble
// Location: chunks.127.mjs:422-~480
// ============================================

// ORIGINAL (for source lookup):
function iI4(A) {
    let { param: Y } = A,
        H = C4(z, pP),            // <command-message> content = command name
        O = C4(z, "command-args"), // <command-args> content
        _ = C4(z, "skill-format") === "true";  // model-invoked skill?
    if (!H) return null;
    if (_) {
        // skill format: LLM invocation via Skill tool
        return QA.createElement(HA, null,
            QA.createElement(V, { backgroundColor: userMessageBg }, ` ▶  Skill(${H}) `)
        )
    } else {
        let X = `/${[H, O].filter(Boolean).join(" ")}`;
        // user format: user-typed slash command
        return QA.createElement(HA, null,
            QA.createElement(V, { backgroundColor: userMessageBg }, ` ▶  ${X} `)
        )
    }
}

// READABLE (for understanding):
function commandMessageRenderer({ param, addMargin }) {
    let rawText = param.text;
    let commandName = extractXmlTag(rawText, "command-message");   // C4(text, pP)
    let commandArgs = extractXmlTag(rawText, "command-args");
    let isSkillFormat = extractXmlTag(rawText, "skill-format") === "true";

    if (!commandName) return null;

    if (isSkillFormat) {
        // LLM-invoked via Skill tool: no slash prefix
        return <Box><Text backgroundColor={userMessageBg}> ▶  Skill({commandName}) </Text></Box>;
    } else {
        // User-typed slash command
        let displayText = `/${[commandName, commandArgs].filter(Boolean).join(" ")}`;
        return <Box><Text backgroundColor={userMessageBg}> ▶  {displayText} </Text></Box>;
    }
}

// Mapping: iI4→commandMessageRenderer, C4→extractXmlTag, pP→COMMAND_MESSAGE_TAG("command-message"),
//          SG→COMMAND_NAME_TAG("command-name"), _→isSkillFormat
```

**How the renderer is triggered** (chunks.129.mjs:2236):

```javascript
// Inside the universal message text renderer
if (Y.text.includes(`<${pP}>`)) {     // pP = "command-message"
    return createElement(iI4, { addMargin: K, param: Y })
}
```

The message renderer checks if a user message's text content contains the `<command-message>` tag — if so, it hands off entirely to `iI4`. This means the entire raw metadata string from `buildUserFacingMetadata(jb4)` or `buildForkedSkillMetadata(evA)` becomes one styled invocation bubble.

**What gets displayed vs. what's in the message:**

The message content in the conversation history looks like:
```
<command-message>commit</command-message>
<command-name>/commit</command-name>
<command-args>fix auth bug</command-args>
```

The renderer extracts only `command-message` (the name) and `command-args` (the args) to build the display. The `<command-name>` tag is used elsewhere (chat title extraction) but not displayed directly.

---

## Part 2: The Output Block Renderer

### localCommandResultRenderer (_x4) — `<local-command-stdout>/<local-command-stderr>` Rendering

**What it does:** Renders the output block of a completed slash command. The output is wrapped in XML tags by `executeCommand(ifY)` and `executeForkSlashCommand(cfY)` and stored as a user message. This component extracts and visually presents that output.

```javascript
// ============================================
// localCommandResultRenderer - Render <local-command-stdout>/<local-command-stderr>
// Location: chunks.129.mjs:274-307
// ============================================

// ORIGINAL (for source lookup):
function _x4(A) {
    let q = e(4), { content: K } = A, Y, z;
    if (q[0] !== K) {
        z = Symbol.for("react.early_return_sentinel");
        A: {
            let w = C4(K, "local-command-stdout"),
                H = C4(K, "local-command-stderr");
            if (!w && !H) {
                let $;
                if (q[3] === Symbol.for("react.memo_cache_sentinel"))
                    $ = zP.createElement(HA, null, zP.createElement(V, { dimColor: true }, iv)),
                    q[3] = $;
                else $ = q[3];
                z = $; break A
            }
            if (w?.trim()) Y.push(zP.createElement(Ox4, { key: "stdout" }, w.trim()));
            if (H?.trim()) Y.push(zP.createElement(Ox4, { key: "stderr", isError: true }, H.trim()));
        }
        q[0] = K, q[1] = Y, q[2] = z
    } else Y = q[1], z = q[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    return Y
}

// READABLE (for understanding):
function localCommandResultRenderer({ content }) {
    let stdout = extractXmlTag(content, "local-command-stdout");   // C4
    let stderr = extractXmlTag(content, "local-command-stderr");   // C4

    if (!stdout && !stderr) {
        // Empty output: render dimmed placeholder
        return <Box><Text dimColor>{EMPTY_PLACEHOLDER}</Text></Box>;  // iv = placeholder
    }

    let parts = [];
    if (stdout?.trim()) parts.push(<CommandOutputLine key="stdout">{stdout.trim()}</CommandOutputLine>);
    if (stderr?.trim()) parts.push(<CommandOutputLine key="stderr" isError>{stderr.trim()}</CommandOutputLine>);
    return parts;
}

// Mapping: _x4→localCommandResultRenderer, C4→extractXmlTag, Ox4→CommandOutputLine,
//          iv→EMPTY_PLACEHOLDER, w→stdout, H→stderr
```

### CommandOutputLine (Ox4) — The `⎿` Prefix Indicator

**What it does:** Renders a single output line (or multi-line text block) with the distinctive `  ⎿  ` indent prefix that visually identifies it as command output distinct from conversation messages.

```javascript
// ============================================
// CommandOutputLine - Output line with ⎿ visual prefix
// Location: chunks.129.mjs:308-333
// ============================================

// ORIGINAL (for source lookup):
function Ox4(A) {
    let { children: K, isError: Y } = A,
        z = Y ? "error" : "text";
    return zP.createElement(I, { flexDirection: "row" },
        zP.createElement(V, { color: z }, "  ⎿  "),
        zP.createElement(I, { flexDirection: "column", flexGrow: 1 },
            zP.createElement(TJ, null, K)   // TJ = AnsiText (handles ANSI color codes)
        )
    )
}

// READABLE (for understanding):
function CommandOutputLine({ children, isError }) {
    let color = isError ? "error" : "text";   // error = red, text = default/white
    return (
        <Box flexDirection="row">
            <Text color={color}>{"  ⎿  "}</Text>      // left-aligned prefix
            <Box flexDirection="column" flexGrow={1}>
                <AnsiText>{children}</AnsiText>          // TJ = preserves ANSI escape codes
            </Box>
        </Box>
    );
}

// Mapping: Ox4→CommandOutputLine, K→children, Y→isError, z→color, TJ→AnsiText
```

**Visual result:**
```
  ⎿  [1m[32mInitialized git repository[0m     ← stdout (ANSI colors preserved)
  ⎿  fatal: not a git repository              ← stderr (in red "error" color)
```

**Key design choices:**

1. **`⎿` character**: This is Unicode U+23BF (⎿ BOTTOM LEFT CORNER). It visually separates command output from conversational text, creating a clear hierarchical indent suggesting "output of the above command".

2. **`AnsiText` (TJ)**: Command output often contains ANSI color codes (from tools like `git`, `npm`, `pytest`). `TJ` preserves these escape sequences rather than stripping them, so colored terminal output renders correctly.

3. **stderr in red**: When `isError: true`, the `⎿` prefix uses the "error" color (red). The actual content still uses `AnsiText` so any terminal colors in the stderr stream are also preserved.

### Empty Output Handling

When `<local-command-stdout>` is present but empty (e.g., a command that produces no output), `iv` (`EMPTY_PLACEHOLDER`) renders a dimmed placeholder text. This prevents the UI from showing a blank space where output was expected.

The `[Done]` fallback in `executeCommand(ifY)` for `local-jsx` commands also addresses this:
```javascript
// From executeCommand (ifY) - local-jsx onDone path:
userMessage({
    content: `<local-command-stdout>${
        outputText || "[Done]"     // explicit fallback when no output
    }</local-command-stdout>`
})
```

---

## Part 3: Skill Tool Execution States

The Skill tool has five distinct visual states during its lifecycle, each rendered by a dedicated function in `chunks.132.mjs`.

### State 1: In Progress — skillRenderToolUseProgressMessage (HP6)

**What it does:** Shows a scrollable list of the most recent tool-use messages while the skill is executing. This gives the user visibility into what the skill is doing without flooding the terminal.

```javascript
// ============================================
// skillRenderToolUseProgressMessage - Scrollable progress list during skill execution
// Location: chunks.132.mjs:598-630
// ============================================

// ORIGINAL (for source lookup):
function HP6(A, { tools: q, verbose: K }) {
    if (!A.length) return T5.createElement(HA, { height: 1 },
        T5.createElement(V, { dimColor: true }, zNY)   // "Initializing…"
    );
    let Y = K ? A : A.slice(-YNY),   // YNY=3, limit to last 3 unless verbose
        z = A.length - Y.length;
    return T5.createElement(HA, null,
        T5.createElement(I, { flexDirection: "column" },
            T5.createElement(mx1, null,
                Y.map((w) => T5.createElement(I, { key: w.uuid, height: 1, overflow: "hidden" },
                    T5.createElement(pR, {
                        message: w.data.message, style: "condensed",
                        isStatic: true, shouldAnimate: false, ...
                    })
                ))
            )
        ),
        z > 0 && T5.createElement(V, { dimColor: true }, "+", z, " more tool ", z===1 ? "use" : "uses")
    )
}

// READABLE (for understanding):
function skillRenderToolUseProgressMessage(progressMessages, { tools, verbose }) {
    if (!progressMessages.length) {
        return <Box height={1}><Text dimColor>Initializing…</Text></Box>;  // zNY
    }

    let visible = verbose ? progressMessages : progressMessages.slice(-3);   // YNY = 3
    let hiddenCount = progressMessages.length - visible.length;

    return (
        <Box>
            <Box flexDirection="column">
                <ScrollContainer>   {/* mx1 — provides isInsideScrollContext */}
                    {visible.map(msg => (
                        <Box key={msg.uuid} height={1} overflow="hidden">
                            <MessageRenderer
                                message={msg.data.message}
                                style="condensed"
                                isStatic={true}
                                shouldAnimate={false}
                            />
                        </Box>
                    ))}
                </ScrollContainer>
            </Box>
            {hiddenCount > 0 && (
                <Text dimColor>+{hiddenCount} more tool {hiddenCount === 1 ? "use" : "uses"}</Text>
            )}
        </Box>
    );
}

// Mapping: HP6→skillRenderToolUseProgressMessage, A→progressMessages, K→verbose,
//          Y→visible, z→hiddenCount, YNY→3 (max visible), zNY→"Initializing…",
//          mx1→ScrollContainer, pR→MessageRenderer
```

**Visual output:**
```
  ✔  Read(src/auth.ts)
  ✔  Write(src/auth.ts)
  ●  Bash(git add -A)
+4 more tool uses
```

**Key design choices:**

1. **Last 3 items (YNY = 3)**: Shows only the three most recent tool-use events. Older events are collapsed into `"+N more tool uses"`. This keeps the progress display compact even for long-running skills.

2. **`style: "condensed"`**: Each progress message is rendered with condensed formatting — single-line, no decorations. This is essential to maintain the `height: 1` constraint per row.

3. **`ScrollContainer` (mx1)**: Wraps the progress items in a scroll context. When the user presses Ctrl+O to expand the transcript, this container enables scrolling through the full history.

4. **`"Initializing…"** when empty**: Before any tool-use messages arrive (skill just started), shows a single dimmed "Initializing…" line. This prevents a jarring empty space.

### State 2: Tool-Use Label — skillRenderToolUseMessage (uu4)

**What it does:** Returns the text label shown in the tool-use header (e.g., in `"Skill(commit)"` or the tool-use block title).

```javascript
// ============================================
// skillRenderToolUseMessage - Tool-use header label for skill
// Location: chunks.132.mjs:589-597
// ============================================

// ORIGINAL (for source lookup):
function uu4({ skill: A }, { commands: q }) {
    if (!A) return null;
    return q?.find((z) => z.name === A)?.loadedFrom === "commands_DEPRECATED" ? `/${A}` : A
}

// READABLE (for understanding):
function skillRenderToolUseMessage({ skill: skillName }, { commands }) {
    if (!skillName) return null;
    // Legacy .claude/commands/ skills: display with slash prefix for backward compat
    let isLegacy = commands?.find(cmd => cmd.name === skillName)?.loadedFrom === "commands_DEPRECATED";
    return isLegacy ? `/${skillName}` : skillName;
}

// Mapping: uu4→skillRenderToolUseMessage, A→skillName, q→commands, z→cmd
```

**Display difference:**
- Modern skill from `.claude/skills/commit/`: shows `commit`
- Legacy command from `.claude/commands/commit`: shows `/commit`

This preserves the expectation users had when the commands directory was the primary mechanism.

### State 3: Result — skillRenderToolResultMessage (bu4)

**What it does:** Shows what happened after a skill completes. Has two branches depending on whether the skill ran inline or as a forked agent.

```javascript
// ============================================
// skillRenderToolResultMessage - Post-execution result display for skill
// Location: chunks.132.mjs:574-588
// ============================================

// ORIGINAL (for source lookup):
function bu4(A) {
    if ("status" in A && A.status === "forked")
        return T5.createElement(HA, { height: 1 }, T5.createElement(V, null,
            T5.createElement(oA, null, ["Done"])
        ));
    let q = ["Successfully loaded skill"];
    if ("allowedTools" in A && A.allowedTools && A.allowedTools.length > 0) {
        let K = A.allowedTools.length;
        q.push(`${K} tool${K===1?"":"s"} allowed`)
    }
    if ("model" in A && A.model) q.push(A.model);
    return T5.createElement(HA, { height: 1 }, T5.createElement(V, null,
        T5.createElement(oA, null, q)   // oA = DimText (dimmed/gray color)
    ))
}

// READABLE (for understanding):
function skillRenderToolResultMessage(result) {
    // Forked skills (context: "fork") complete differently — their output is
    // already in <local-command-stdout>, so just show "Done"
    if ("status" in result && result.status === "forked") {
        return <Box height={1}><Text><DimText>Done</DimText></Text></Box>;
    }

    // Inline skills: show loaded status with metadata
    let parts = ["Successfully loaded skill"];
    if (result.allowedTools?.length > 0) {
        let count = result.allowedTools.length;
        parts.push(`${count} tool${count === 1 ? "" : "s"} allowed`);
    }
    if (result.model) parts.push(result.model);  // e.g., "claude-opus-4-5"

    return (
        <Box height={1}>
            <Text><DimText>{parts.join(" · ")}</DimText></Text>
        </Box>
    );
}

// Mapping: bu4→skillRenderToolResultMessage, A→result, q→parts, K→count, oA→DimText
```

**Visual output examples:**
```
// Forked skill (ran as sub-agent):
  ✔  Skill(review) · Done

// Inline skill with tool restrictions:
  ✔  Skill(commit) · Successfully loaded skill · 3 tools allowed

// Inline skill with model override:
  ✔  Skill(analyze) · Successfully loaded skill · claude-opus-4-5
```

**Why "Successfully loaded skill" vs "Done":**
- **Forked skills** (`context: "fork"`) run their own agent loop and produce output in `<local-command-stdout>`. The result is already visible below. Showing "Done" is sufficient.
- **Inline skills** inject their prompt into the main conversation — the LLM then runs with those instructions. The result block clarifies that the skill was loaded and shows which tools the LLM can use during execution.

### State 4: Rejected — skillRenderToolUseRejectedMessage (Bu4)

**What it does:** Shows the progress list plus a rejection indicator when the user declines the Skill tool use (e.g., denied the permission).

```javascript
// ============================================
// skillRenderToolUseRejectedMessage - Progress + rejection for denied Skill tool
// Location: chunks.132.mjs:634-638
// ============================================

// ORIGINAL (for source lookup):
function Bu4(A, { progressMessagesForMessage: q, tools: K, verbose: Y }) {
    return T5.createElement(T5.Fragment, null,
        HP6(q, { tools: K, verbose: Y }),   // show accumulated progress
        T5.createElement(Y9, null)           // Y9 = RejectedResult component
    )
}

// READABLE:
function skillRenderToolUseRejectedMessage(result, { progressMessagesForMessage, tools, verbose }) {
    return <>
        {skillRenderToolUseProgressMessage(progressMessagesForMessage, { tools, verbose })}
        <RejectedResult />   {/* Y9: shows "✘ Rejected" indicator */}
    </>;
}
```

### State 5: Error — skillRenderToolUseErrorMessage (mu4)

**What it does:** Shows the progress list plus an error block when the Skill tool call fails (e.g., skill not found, execution error).

```javascript
// ============================================
// skillRenderToolUseErrorMessage - Progress + error for failed Skill tool
// Location: chunks.132.mjs:640-650
// ============================================

// ORIGINAL (for source lookup):
function mu4(A, { progressMessagesForMessage: q, tools: K, verbose: Y }) {
    return T5.createElement(T5.Fragment, null,
        HP6(q, { tools: K, verbose: Y }),
        T5.createElement(z5, { result: A, verbose: Y })  // z5 = ErrorResult
    )
}

// READABLE:
function skillRenderToolUseErrorMessage(result, { progressMessagesForMessage, tools, verbose }) {
    return <>
        {skillRenderToolUseProgressMessage(progressMessagesForMessage, { tools, verbose })}
        <ErrorResult result={result} verbose={verbose} />  {/* z5 */}
    </>;
}
```

### State Summary Table

| State | Function | Visual Output |
|-------|----------|--------------|
| No messages yet | HP6 (initial) | `Initializing…` (dimmed) |
| Running | HP6 (normal) | Last 3 tool-use events + `+N more` |
| Tool-use label | uu4 | `commit` (or `/commit` for legacy) |
| Completed inline | bu4 | `Successfully loaded skill · N tools allowed` |
| Completed forked | bu4 | `Done` |
| Rejected | Bu4 | HP6 output + `✘ Rejected` |
| Error | mu4 | HP6 output + error details |

---

## Part 4: Forked Command Progress Display

For commands with `context: "fork"` (running as an isolated sub-agent), the forked executor (`executeForkSlashCommand`, cfY) shows a **real-time streaming progress panel** via `setJSXOutput`.

### The Progress Update Loop

```javascript
// ============================================
// executeForkSlashCommand progress display loop
// Location: chunks.130.mjs:1411-~1508
// ============================================

// READABLE:
async function executeForkSlashCommand(command, args, toolUseContext, ..., setJSXOutput, ...) {
    let progressMessages = [];

    // Helper: update the JSX display with current progress
    let updateUI = () => {
        setJSXOutput({
            jsx: buildProgressJSX(progressMessages, { tools: toolUseContext.options.tools, verbose: false }),
            shouldHidePromptInput: false,   // input box remains visible
            shouldContinueAnimation: true,  // spinner keeps spinning
            showSpinner: true               // show loading spinner
        });
    };

    updateUI();  // immediate: show "Initializing…" before first message

    // Consume agent loop events, updating display on each message
    for await (let event of runAgentLoop({ ... })) {
        if (event.type === "assistant" || event.type === "user") {
            progressMessages.push(buildProgressEvent(event));
            updateUI();   // re-render on every message
        }
    }

    setJSXOutput(null);  // clear progress display when done
    // ...return messages with <local-command-stdout> wrapping
}
```

### The Compact "In Progress…" Fallback

When the terminal is too small (fewer rows than required by the full progress display), a single-line compact summary is shown instead:

```javascript
// ============================================
// compactProgressLine - Single-line progress for small terminals
// Location: chunks.130.mjs:1060-1090
// ============================================

// READABLE:
function compactProgressLine({ toolUseCount, tokens, terminalRows, requiredRows }) {
    let isTerminalTooSmall = terminalRows && terminalRows < requiredRows;
    if (isTerminalTooSmall) {
        return (
            <Box height={1}>
                <Text dimColor>
                    {"In progress… · "}
                    <Text bold>{toolUseCount}</Text>
                    {" tool"} {toolUseCount === 1 ? "use" : "uses"}
                    {tokens && ` · ${formatTokenCount(tokens)} tokens`}
                    {" · "}
                    <KeybindingHint action="app:toggleTranscript" fallback="ctrl+o" description="expand" />
                </Text>
            </Box>
        );
    }
    // else: render full HP6 progress list
}
```

**Visual output:**
```
In progress… · 7 tool uses · 2.3k tokens · ctrl+o (expand)
```

---

## Part 5: Chat Title Extraction — Skipping Command Output

When building the session list and computing conversation titles, the title extractor `extractChatTitle` (I2z) in `chunks.174.mjs` must skip over injected command content to find the actual user intent.

### The Title Extraction Algorithm (I2z)

```javascript
// ============================================
// extractChatTitle - Compute display title from conversation log
// Location: chunks.174.mjs:60-103
// ============================================

// READABLE:
function extractChatTitle(rawJsonlLog) {
    for each user message (non-tool_result, non-isMeta):
        let text = extractTextContent(message);

        // 1. Check for <command-name> tag → use as title
        let commandName = extractXmlTag(text, "command-name");   // SG = "command-name"
        if (commandName) {
            let cleanName = commandName.replace(/^\//, "");       // strip leading slash
            let commandArgs = extractXmlTag(text, "command-args")?.trim() || "";

            // Built-in commands (like /help, /clear) with no args → skip for now, use as fallback
            if (isBuiltinCommand(cleanName) || !commandArgs) {
                if (!fallbackTitle) fallbackTitle = commandName;
                continue;
            }
            // Skill commands with args → use as primary title: "/commit fix auth bug"
            return commandArgs ? `${commandName} ${commandArgs}` : commandName;
        }

        // 2. Check for system-injected content → skip
        if (SKIP_TITLE_REGEX.test(text)) continue;    // fJq

        // 3. Plain user text → truncate and use as title
        if (text.length > 200) text = text.slice(0, 200).trim() + "…";
        return text;

    return fallbackTitle || "";
}
```

### The Skip Regex (fJq)

```javascript
// ============================================
// SKIP_TITLE_REGEX - Patterns excluded from title extraction
// Location: chunks.174.mjs:273
// ============================================

fJq = new RegExp(
    `^(?:` +
    `<local-command-stdout>|` +               // slash command output
    `<session-start-hook>|` +                  // session start hook output
    `<${JC}>|` +                              // JC = "tick" tag
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +  // IDE file events
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +       // IDE selection events
    `)`
)
```

**Why this matters:** Without `fJq`, a conversation where the user's first visible message is a `/compact` command that produced lots of output would show `[output of compact command]` as the session title. Instead:
- If the conversation contains `/commit fix auth bug`: title = `"/commit fix auth bug"`
- If only `/compact` with no args: title = `/compact` (fallback)
- If user typed "help me refactor this class": title = "help me refactor this class"
- If first user message is `<local-command-stdout>...`: skip → look for next meaningful text

### `<command-name>` as Title Source

The `<command-name>` XML tag (produced by both `buildUserFacingMetadata(jb4)` and `buildForkedSkillMetadata(evA)`) is specifically checked **before** the skip regex. This means:

```
/commit fix auth bug
  → <command-name>/commit</command-name>
  → <command-args>fix auth bug</command-args>
  → title: "/commit fix auth bug"

/help (no args)
  → <command-name>/help</command-name>
  → no command-args
  → title: "/help" (stored as fallback, not primary)
```

---

## Part 6: The `onDone` Display Mode System

For `local-jsx` commands, the `onDone` callback (returned by `executeCommand(ifY)`) supports three **display modes** that control how command results enter the conversation history:

```javascript
// onDone(outputText, options) — called by local-jsx command when it finishes

// Mode 1: skip — no messages added, command is invisible
onDone(null, { display: "skip" })
// Result: messages = [], shouldQuery = false
// Use: /status, /fast (commands that just toggle state with no output)

// Mode 2: system — injected as system-level messages (not visible in normal view)
onDone(outputText, { display: "system" })
// Result: systemMessage(<command-name>) + systemMessage(<local-command-stdout>...)
// Use: commands that inject context invisibly (e.g., /add-dir adding context)

// Mode 3: default (user) — visible user messages
onDone(outputText)   // or onDone(outputText, { display: undefined })
// Result: userMessage(<command-name>) + userMessage(<local-command-stdout>...)
// Use: /compact, /clear, /vim — commands whose output should be visible

// Additional options:
onDone(outputText, {
    shouldQuery: true,     // trigger LLM to process the output
    nextInput: "...",      // pre-populate the next input box value
    submitNextInput: true, // auto-submit nextInput
    metaMessages: [...]    // additional meta messages to append
})
```

**The `metaMessages` option:** Commands like `/compact` use `metaMessages` to inject additional invisible context (e.g., compaction boundary markers) alongside their visible output. These are tagged `isMeta: true` so they survive compaction but are hidden from the default UI view.

---

## Part 7: The XML Tag Extraction Utility

### extractXmlTag (C4)

Used throughout the rendering pipeline to extract content from XML tags in message text:

```javascript
// ============================================
// extractXmlTag - Extract content between XML tags from text
// Location: chunks.129.mjs (utility, multiple call sites)
// ============================================

// READABLE:
function extractXmlTag(text, tagName) {
    let pattern = new RegExp(`<${tagName}>([\s\S]*?)<\/${tagName}>`);
    let match = text.match(pattern);
    return match ? match[1] : null;
}

// Usage examples:
C4("<command-message>commit</command-message>", "command-message")
→ "commit"

C4("<local-command-stdout>\nDone.\n</local-command-stdout>", "local-command-stdout")
→ "\nDone.\n"

C4("<skill-format>true</skill-format>", "skill-format")
→ "true"
```

---

## Complete Output Style Pipeline: From Execution to Display

```
EXECUTION PRODUCES                     RENDERING DISPLAYS

1. handlePromptCommand(Wb4)
   messages[0]: userMessage {
     content: "<command-message>commit</command-message>
               <command-name>/commit</command-name>
               <command-args>fix auth</command-args>"
   }
                                    → chunks.129.mjs:2236: detects <command-message>
                                    → iI4: renders "▶  /commit fix auth"
                                         (with userMessageBg background color)

2a. For local commands (executeCommand ifY):
   messages[1]: userMessage {
     content: "<local-command-stdout>Created commit abc1234\n</local-command-stdout>"
   }
                                    → chunks.129.mjs: _x4 renders output block
                                    → Ox4: "  ⎿  Created commit abc1234"
                                         (with AnsiText for color preservation)

2b. For Skill tool (LLM invokes):
   tool_use { name: "Skill", input: { skill: "commit" } }
                                    → uu4: label "commit" (or "/commit" if legacy)
                                    → HP6: scrollable progress list (last 3 tool uses)

   tool_result { ... }
                                    → bu4: "Successfully loaded skill · 3 tools allowed"
                                           OR "Done" (if forked)

3. For forked commands (cfY):
   During execution:
   setJSXOutput({ jsx: HP6(...), showSpinner: true })
                                    → Terminal too small → "In progress… · N tool uses · ctrl+o"
                                    → Terminal adequate → scrollable progress list

   After completion:
   setJSXOutput(null)
   messages[1]: userMessage {
     content: "<local-command-stdout>[skill output]</local-command-stdout>"
   }
                                    → _x4 + Ox4: "  ⎿  [skill output]"

4. Chat title (session list):
   extractChatTitle(I2z):
     finds <command-name>/commit</command-name> → title "/commit fix auth"
     encounters <local-command-stdout> → SKIP (fJq regex)
```

---

## Symbol Cross-Reference

All output style symbols not yet in the main symbol indexes:

| Obfuscated | Readable | File:Line | Category |
|------------|----------|-----------|----------|
| iI4 | commandMessageRenderer | chunks.127.mjs:422 | `<command-message>` bubble renderer |
| _x4 | localCommandResultRenderer | chunks.129.mjs:274 | `<local-command-stdout>` block renderer |
| Ox4 | CommandOutputLine | chunks.129.mjs:308 | Single output line with `⎿` prefix |
| C4 | extractXmlTag | chunks.129.mjs | XML tag content extractor utility |
| bu4 | skillRenderToolResultMessage | chunks.132.mjs:574 | Skill tool result ("Successfully loaded") |
| uu4 | skillRenderToolUseMessage | chunks.132.mjs:589 | Skill tool-use label (name with/without /) |
| HP6 | skillRenderToolUseProgressMessage | chunks.132.mjs:598 | Scrollable progress list (last 3) |
| Bu4 | skillRenderToolUseRejectedMessage | chunks.132.mjs:634 | Progress + rejection indicator |
| mu4 | skillRenderToolUseErrorMessage | chunks.132.mjs:640 | Progress + error block |
| YNY | MAX_SKILL_PROGRESS_VISIBLE | chunks.132.mjs:661 | constant (3) |
| zNY | SKILL_INITIALIZING_TEXT | chunks.132.mjs | constant ("Initializing…") |
| mx1 | ScrollContainer | chunks.76.mjs:524 | scroll context provider for progress list |
| I2z | extractChatTitle | chunks.174.mjs:60 | Chat title from conversation log |
| fJq | SKIP_TITLE_REGEX | chunks.174.mjs:273 | Patterns excluded from title extraction |
| SG | COMMAND_NAME_TAG | chunks.9.mjs:1239 | constant ("command-name") |
| pP | COMMAND_MESSAGE_TAG | chunks.9.mjs:1241 | constant ("command-message") |
| Pw1 | LOCAL_COMMAND_STDOUT_TAG | chunks.9.mjs:1247 | constant ("local-command-stdout") |
| ao1 | LOCAL_COMMAND_STDERR_TAG | chunks.9.mjs:1249 | constant ("local-command-stderr") |
| oA | DimText | chunks.132.mjs | component (dimmed/gray text) |
| TJ | AnsiText | chunks.129.mjs | component (ANSI escape code renderer) |
| Y9 | RejectedResult | chunks.132.mjs | component (✘ rejection indicator) |
| z5 | ErrorResult | chunks.132.mjs | component (error detail block) |
