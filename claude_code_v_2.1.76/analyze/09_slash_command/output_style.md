# Slash Command & Skill Output Style (Claude Code v2.1.76)

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
        return QA.createElement(HA, null,
            QA.createElement(V, { backgroundColor: userMessageBg }, ` ▶  Skill(${H}) `)
        )
    } else {
        let X = `/${[H, O].filter(Boolean).join(" ")}`;
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
        return <Box><Text backgroundColor={userMessageBg}> ▶  Skill({commandName}) </Text></Box>;
    } else {
        let displayText = `/${[commandName, commandArgs].filter(Boolean).join(" ")}`;
        return <Box><Text backgroundColor={userMessageBg}> ▶  {displayText} </Text></Box>;
    }
}

// Mapping: iI4→commandMessageRenderer, C4→extractXmlTag, pP→COMMAND_MESSAGE_TAG("command-message"),
//          SG→COMMAND_NAME_TAG("command-name"), _→isSkillFormat
```

---

## Part 2: The Output Block Renderer

### localCommandResultRenderer (_x4) — `<local-command-stdout>/<local-command-stderr>` Rendering

**What it does:** Renders the output block of a completed slash command.

```javascript
// ============================================
// localCommandResultRenderer - Render <local-command-stdout>/<local-command-stderr>
// Location: chunks.129.mjs:274-307
// ============================================

// READABLE (for understanding):
function localCommandResultRenderer({ content }) {
    let stdout = extractXmlTag(content, "local-command-stdout");   // C4
    let stderr = extractXmlTag(content, "local-command-stderr");   // C4

    if (!stdout && !stderr) {
        return <Box><Text dimColor>{EMPTY_PLACEHOLDER}</Text></Box>;
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

**What it does:** Renders a single output line with the distinctive `  ⎿  ` indent prefix.

```javascript
// ============================================
// CommandOutputLine - Output line with ⎿ visual prefix
// Location: chunks.129.mjs:308-333
// ============================================

// READABLE (for understanding):
function CommandOutputLine({ children, isError }) {
    let color = isError ? "error" : "text";
    return (
        <Box flexDirection="row">
            <Text color={color}>{"  ⎿  "}</Text>
            <Box flexDirection="column" flexGrow={1}>
                <AnsiText>{children}</AnsiText>
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
1. **`⎿` character**: Unicode U+23BF. Visually separates command output from conversational text.
2. **`AnsiText` (TJ)**: Command output often contains ANSI color codes from tools like `git`, `npm`, `pytest`. `TJ` preserves these.
3. **stderr in red**: When `isError: true`, the `⎿` prefix uses the "error" color.

---

## Part 3: Skill Tool Execution States

The Skill tool has five distinct visual states during its lifecycle.

### State 1: In Progress — skillRenderToolUseProgressMessage (HP6)

**What it does:** Shows a scrollable list of the most recent tool-use messages while the skill is executing.

```javascript
// ============================================
// skillRenderToolUseProgressMessage - Scrollable progress list during skill execution
// Location: chunks.132.mjs:598-630
// ============================================

// READABLE (for understanding):
function skillRenderToolUseProgressMessage(progressMessages, { tools, verbose }) {
    if (!progressMessages.length) {
        return <Box height={1}><Text dimColor>Initializing…</Text></Box>;
    }

    let visible = verbose ? progressMessages : progressMessages.slice(-3);   // last 3
    let hiddenCount = progressMessages.length - visible.length;

    return (
        <Box>
            <Box flexDirection="column">
                <ScrollContainer>
                    {visible.map(msg => (
                        <Box key={msg.uuid} height={1} overflow="hidden">
                            <MessageRenderer message={msg.data.message} style="condensed"
                                isStatic={true} shouldAnimate={false} />
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

### State 2: Tool-Use Label — skillRenderToolUseMessage (uu4)

Returns the text label shown in the tool-use header.

```javascript
// ============================================
// skillRenderToolUseMessage - Tool-use header label for skill
// Location: chunks.132.mjs:589-597
// ============================================

// READABLE (for understanding):
function skillRenderToolUseMessage({ skill: skillName }, { commands }) {
    if (!skillName) return null;
    let isLegacy = commands?.find(cmd => cmd.name === skillName)?.loadedFrom === "commands_DEPRECATED";
    return isLegacy ? `/${skillName}` : skillName;
}

// Mapping: uu4→skillRenderToolUseMessage, A→skillName, q→commands, z→cmd
```

**Display difference:**
- Modern skill from `.claude/skills/commit/`: shows `commit`
- Legacy command from `.claude/commands/commit`: shows `/commit`

### State 3: Result — skillRenderToolResultMessage (bu4)

**What it does:** Shows what happened after a skill completes.

```javascript
// ============================================
// skillRenderToolResultMessage - Post-execution result display for skill
// Location: chunks.132.mjs:574-588
// ============================================

// READABLE (for understanding):
function skillRenderToolResultMessage(result) {
    if ("status" in result && result.status === "forked") {
        return <Box height={1}><Text><DimText>Done</DimText></Text></Box>;
    }

    let parts = ["Successfully loaded skill"];
    if (result.allowedTools?.length > 0) {
        let count = result.allowedTools.length;
        parts.push(`${count} tool${count === 1 ? "" : "s"} allowed`);
    }
    if (result.model) parts.push(result.model);

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

### State 4: Rejected — skillRenderToolUseRejectedMessage (Bu4)

Shows the progress list plus a rejection indicator when the user declines.

### State 5: Error — skillRenderToolUseErrorMessage (mu4)

Shows the progress list plus an error block when the Skill tool call fails.

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

For commands with `context: "fork"`, the forked executor (`executeForkSlashCommand`, cfY) shows a real-time streaming progress panel via `setJSXOutput`.

The compact "In Progress…" fallback when the terminal is too small:

```
In progress… · 7 tool uses · 2.3k tokens · ctrl+o (expand)
```

---

## Part 5: Chat Title Extraction — Skipping Command Output

When building the session list, the title extractor `extractChatTitle` (I2z) must skip over injected command content to find the actual user intent.

### The Skip Regex (fJq)

```javascript
fJq = new RegExp(
    `^(?:` +
    `<local-command-stdout>|` +
    `<session-start-hook>|` +
    `\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|` +
    `\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$` +
    `)`
)
```

**Why this matters:** Without `fJq`, a conversation's first visible message might be slash command output, producing an uninformative session title. The regex ensures that:
- If the conversation contains `/commit fix auth bug`: title = `"/commit fix auth bug"`
- If only `/compact` with no args: title = `/compact` (fallback)
- If first user message is `<local-command-stdout>...`: skip → look for next meaningful text

---

## Part 6: The `onDone` Display Mode System

For `local-jsx` commands, the `onDone` callback supports three display modes:

```javascript
// Mode 1: skip — no messages added, command is invisible
onDone(null, { display: "skip" })
// Use: /color, /fast (commands that just toggle state with no visible output)

// Mode 2: system — injected as system-level messages (not visible in normal view)
onDone(outputText, { display: "system" })
// Use: /effort (sets effort level, shows minimal confirmation)

// Mode 3: default (user) — visible user messages
onDone(outputText)
// Use: /compact, /clear, /vim — commands whose output should be visible
```

---

## Part 7: The XML Tag Extraction Utility

### extractXmlTag (C4)

```javascript
// READABLE:
function extractXmlTag(text, tagName) {
    let pattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
    let match = text.match(pattern);
    return match ? match[1] : null;
}
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

2a. For local commands (executeCommand ifY):
   messages[1]: userMessage {
     content: "<local-command-stdout>Created commit abc1234\n</local-command-stdout>"
   }
                                    → _x4 renders output block
                                    → Ox4: "  ⎿  Created commit abc1234"

2b. For Skill tool (LLM invokes):
   tool_use { name: "Skill", input: { skill: "commit" } }
                                    → uu4: label "commit"
                                    → HP6: scrollable progress list (last 3 tool uses)

   tool_result { ... }
                                    → bu4: "Successfully loaded skill · 3 tools allowed"
```
