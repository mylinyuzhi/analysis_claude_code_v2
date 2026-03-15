
// @from(Ln 467914, Col 0)
function rjz(A, q) {
    let K = 0,
        Y = q === null || q === void 0;
    for (let z of A) {
        if (!Y) {
            if (z.uuid === q) Y = !0;
            continue
        }
        if (z.type === "assistant") {
            let w = z.message.content;
            if (Array.isArray(w)) K += w.filter((O) => O.type === "tool_use").length
        }
    }
    return K
}
// @from(Ln 467930, Col 0)
function ojz(A) {
    let q = eW(A);
    if (!xqq()) {
        if (!mqq(q)) return !1;
        uqq()
    }
    let K = Bqq(q),
        z = rjz(A, Syq) >= gqq(),
        _ = ri6(A);
    if (K && z || K && !_) {
        let O = A[A.length - 1];
        if (O?.uuid) Syq = O.uuid;
        return !0
    }
    return !1
}
// @from(Ln 467946, Col 0)
async function ajz(A) {
    let q = $1(),
        K = nS1();
    await q.mkdir(K, {
        mode: 448
    });
    let Y = Av6();
    try {
        await hyq(Y, "", {
            encoding: "utf-8",
            mode: 384,
            flag: "wx"
        });
        let O = await _p8();
        await hyq(Y, O, {
            encoding: "utf-8",
            mode: 384
        })
    } catch (O) {
        if (O.code !== "EEXIST") throw O
    }
    let z = await L9.call({
            file_path: Y
        }, A),
        _ = "",
        w = z.data;
    if (w.type === "text") _ = w.file.content;
    return d("tengu_session_memory_file_read", {
        content_length: _.length
    }), {
        memoryPath: Y,
        currentMemory: _
    }
}
// @from(Ln 467981, Col 0)
function Cyq() {
    if (t4()) return;
    if (!Xh()) return;
    wKq(tjz)
}
// @from(Ln 467987, Col 0)
function ejz(A) {
    return async (q, K) => {
        if (q.name === R4 && typeof K === "object" && K !== null && "file_path" in K) {
            let Y = K.file_path;
            if (typeof Y === "string" && Y === A) return {
                behavior: "allow",
                updatedInput: K
            }
        }
        return {
            behavior: "deny",
            message: `only ${R4} on ${A} is allowed`,
            decisionReason: {
                type: "other",
                reason: `only ${R4} on ${A} is allowed`
            }
        }
    }
}
// @from(Ln 468007, Col 0)
function AJz(A) {
    if (!ri6(A)) {
        let q = A[A.length - 1];
        if (q?.uuid) K16(q.uuid)
    }
}
// @from(Ln 468013, Col 4)
Syq
// @from(Ln 468013, Col 9)
sjz
// @from(Ln 468013, Col 14)
tjz
// @from(Ln 468014, Col 4)
Iyq = E(() => {
    T1();
    RY();
    U4();
    SA();
    RI();
    wp8();
    gR();
    xi6();
    V1();
    Xl();
    JA();
    eT6();
    AZ();
    jE();
    bv();
    HA();
    s8();
    sjz = e1(() => {
        let A = njz(),
            q = {
                minimumMessageTokensToInit: A.minimumMessageTokensToInit && A.minimumMessageTokensToInit > 0 ? A.minimumMessageTokensToInit : hi6.minimumMessageTokensToInit,
                minimumTokensBetweenUpdate: A.minimumTokensBetweenUpdate && A.minimumTokensBetweenUpdate > 0 ? A.minimumTokensBetweenUpdate : hi6.minimumTokensBetweenUpdate,
                toolCallsBetweenUpdates: A.toolCallsBetweenUpdates && A.toolCallsBetweenUpdates > 0 ? A.toolCallsBetweenUpdates : hi6.toolCallsBetweenUpdates
            };
        Cqq(q)
    }), tjz = Bu(async function(A) {
        let {
            messages: q,
            toolUseContext: K,
            querySource: Y
        } = A;
        if (Y !== "repl_main_thread") return;
        if (!ijz()) return;
        if (sjz(), !ojz(q)) return;
        Rqq();
        let z = Bc6(K),
            {
                memoryPath: _,
                currentMemory: w
            } = await ajz(z),
            O = await iqq(w, _);
        await av({
            promptMessages: [p1({
                content: O
            })],
            cacheSafeParams: Fb(A),
            canUseTool: ejz(_),
            querySource: "session_memory",
            forkLabel: "session_memory",
            overrides: {
                readFileState: z.readFileState
            }
        });
        let $ = q[q.length - 1],
            H = $ ? Rd($) : void 0,
            j = Iqq();
        d("tengu_session_memory_extraction", {
            input_tokens: H?.input_tokens,
            output_tokens: H?.output_tokens,
            cache_read_input_tokens: H?.cache_read_input_tokens ?? void 0,
            cache_creation_input_tokens: H?.cache_creation_input_tokens ?? void 0,
            config_min_message_tokens_to_init: j.minimumMessageTokensToInit,
            config_min_tokens_between_update: j.minimumTokensBetweenUpdate,
            config_tool_calls_between_updates: j.toolCallsBetweenUpdates
        }), bqq(eW(q)), AJz(q), hqq()
    })
})
// @from(Ln 468083, Col 0)
function byq() {
    rw({
        name: "claude-in-chrome",
        description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
        whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
        allowedTools: qJz,
        userInvocable: !0,
        isEnabled: () => kN6(),
        async getPromptForCommand(A) {
            let q = `${l4q}
${KJz}`;
            if (A) q += `
## Task

${A}`;
            return [{
                type: "text",
                text: q
            }]
        }
    })
}
// @from(Ln 468105, Col 4)
qJz
// @from(Ln 468105, Col 9)
KJz = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`
// @from(Ln 468110, Col 4)
xyq = E(() => {
    nf();
    wL6();
    R_6();
    qJz = Sp.map((A) => `mcp__claude-in-chrome__${A.name}`)
})
// @from(Ln 468117, Col 0)
function YJz() {
    let A = Np(oD(), {
        io: "input"
    });
    return B6(A, null, 2)
}
// @from(Ln 468124, Col 0)
function uyq() {
    return
}
// @from(Ln 468127, Col 4)
zJz = `## Settings File Locations

Choose the appropriate file based on scope:

| File | Scope | Git | Use For |
|------|-------|-----|---------|
| \`~/.claude/settings.json\` | Global | N/A | Personal preferences for all projects |
| \`.claude/settings.json\` | Project | Commit | Team-wide hooks, permissions, plugins |
| \`.claude/settings.local.json\` | Project | Gitignore | Personal overrides for this project |

Settings load in order: user → project → local (later overrides earlier).

## Settings Schema Reference

### Permissions
\`\`\`json
{
  "permissions": {
    "allow": ["Bash(npm:*)", "Edit(.claude)", "Read"],
    "deny": ["Bash(rm -rf:*)"],
    "ask": ["Write(/etc/*)"],
    "defaultMode": "default" | "plan" | "acceptEdits" | "dontAsk",
    "additionalDirectories": ["/extra/dir"]
  }
}
\`\`\`

**Permission Rule Syntax:**
- Exact match: \`"Bash(npm run test)"\`
- Prefix wildcard: \`"Bash(git:*)"\` - matches \`git status\`, \`git commit\`, etc.
- Tool only: \`"Read"\` - allows all Read operations

### Environment Variables
\`\`\`json
{
  "env": {
    "DEBUG": "true",
    "MY_API_KEY": "value"
  }
}
\`\`\`

### Model & Agent
\`\`\`json
{
  "model": "sonnet",  // or "opus", "haiku", full model ID
  "agent": "agent-name",
  "alwaysThinkingEnabled": true
}
\`\`\`

### Attribution (Commits & PRs)
\`\`\`json
{
  "attribution": {
    "commit": "Custom commit trailer text",
    "pr": "Custom PR description text"
  }
}
\`\`\`
Set \`commit\` or \`pr\` to empty string \`""\` to hide that attribution.

### MCP Server Management
\`\`\`json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["server1", "server2"],
  "disabledMcpjsonServers": ["blocked-server"]
}
\`\`\`

### Plugins
\`\`\`json
{
  "enabledPlugins": {
    "formatter@anthropic-tools": true
  }
}
\`\`\`
Plugin syntax: \`plugin-name@source\` where source is \`claude-code-marketplace\`, \`claude-plugins-official\`, or \`builtin\`.

### Other Settings
- \`language\`: Preferred response language (e.g., "japanese")
- \`cleanupPeriodDays\`: Days to keep transcripts (default: 30; 0 disables persistence entirely)
- \`respectGitignore\`: Whether to respect .gitignore (default: true)
- \`spinnerTipsEnabled\`: Show tips in spinner
- \`spinnerVerbs\`: Customize spinner verbs (\`{ "mode": "append" | "replace", "verbs": [...] }\`)
- \`spinnerTipsOverride\`: Override spinner tips (\`{ "excludeDefault": true, "tips": ["Custom tip"] }\`)
- \`syntaxHighlightingDisabled\`: Disable diff highlighting
`
// @from(Ln 468217, Col 4)
_Jz = `## Hooks Configuration

Hooks run commands at specific points in Claude Code's lifecycle.

### Hook Structure
\`\`\`json
{
  "hooks": {
    "EVENT_NAME": [
      {
        "matcher": "ToolName|OtherTool",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here",
            "timeout": 60,
            "statusMessage": "Running..."
          }
        ]
      }
    ]
  }
}
\`\`\`

### Hook Events

| Event | Matcher | Purpose |
|-------|---------|---------|
| PermissionRequest | Tool name | Run before permission prompt |
| PreToolUse | Tool name | Run before tool, can block |
| PostToolUse | Tool name | Run after successful tool |
| PostToolUseFailure | Tool name | Run after tool fails |
| Notification | Notification type | Run on notifications |
| Stop | - | Run when Claude stops (including clear, resume, compact) |
| PreCompact | "manual"/"auto" | Before compaction |
| PostCompact | "manual"/"auto" | After compaction (receives summary) |
| UserPromptSubmit | - | When user submits |
| SessionStart | - | When session starts |

**Common tool matchers:** \`Bash\`, \`Write\`, \`Edit\`, \`Read\`, \`Glob\`, \`Grep\`

### Hook Types

**1. Command Hook** - Runs a shell command:
\`\`\`json
{ "type": "command", "command": "prettier --write $FILE", "timeout": 30 }
\`\`\`

**2. Prompt Hook** - Evaluates a condition with LLM:
\`\`\`json
{ "type": "prompt", "prompt": "Is this safe? $ARGUMENTS" }
\`\`\`
Only available for tool events: PreToolUse, PostToolUse, PermissionRequest.

**3. Agent Hook** - Runs an agent with tools:
\`\`\`json
{ "type": "agent", "prompt": "Verify tests pass: $ARGUMENTS" }
\`\`\`
Only available for tool events: PreToolUse, PostToolUse, PermissionRequest.

### Hook Input (stdin JSON)
\`\`\`json
{
  "session_id": "abc123",
  "tool_name": "Write",
  "tool_input": { "file_path": "/path/to/file.txt", "content": "..." },
  "tool_response": { "success": true }  // PostToolUse only
}
\`\`\`

### Hook JSON Output

Hooks can return JSON to control behavior:

\`\`\`json
{
  "systemMessage": "Warning shown to user in UI",
  "continue": false,
  "stopReason": "Message shown when blocking",
  "suppressOutput": false,
  "decision": "block",
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Context injected back to model"
  }
}
\`\`\`

**Fields:**
- \`systemMessage\` - Display a message to the user (all hooks)
- \`continue\` - Set to \`false\` to block/stop (default: true)
- \`stopReason\` - Message shown when \`continue\` is false
- \`suppressOutput\` - Hide stdout from transcript (default: false)
- \`decision\` - "block" for PostToolUse/Stop/UserPromptSubmit hooks (deprecated for PreToolUse, use hookSpecificOutput.permissionDecision instead)
- \`reason\` - Explanation for decision
- \`hookSpecificOutput\` - Event-specific output (must include \`hookEventName\`):
  - \`additionalContext\` - Text injected into model context
  - \`permissionDecision\` - "allow", "deny", or "ask" (PreToolUse only)
  - \`permissionDecisionReason\` - Reason for the permission decision (PreToolUse only)
  - \`updatedInput\` - Modified tool input (PreToolUse only)

### Common Patterns

**Auto-format after writes:**
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | xargs prettier --write 2>/dev/null || true"
      }]
    }]
  }
}
\`\`\`

**Log all bash commands:**
\`\`\`json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' >> ~/.claude/bash-log.txt"
      }]
    }]
  }
}
\`\`\`

**Stop hook that displays message to user:**

Command must output JSON with \`systemMessage\` field:
\`\`\`bash
# Example command that outputs: {"systemMessage": "Session complete!"}
echo '{"systemMessage": "Session complete!"}'
\`\`\`

**Run tests after code changes:**
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path // .tool_response.filePath' | grep -E '\\\\.(ts|js)$' && npm test || true"
      }]
    }]
  }
}
\`\`\`
`
// @from(Ln 468375, Col 4)
wJz
// @from(Ln 468376, Col 4)
myq = E(() => {
    K7();
    nf();
    jC();
    g1();
    wJz = `# Update Config Skill

Modify Claude Code configuration by updating settings.json files.

## When Hooks Are Required (Not Memory)

If the user wants something to happen automatically in response to an EVENT, they need a **hook** configured in settings.json. Memory/preferences cannot trigger automated actions.

**These require hooks:**
- "Before compacting, ask me what to preserve" → PreCompact hook
- "After writing files, run prettier" → PostToolUse hook with Write|Edit matcher
- "When I run bash commands, log them" → PreToolUse hook with Bash matcher
- "Always run tests after code changes" → PostToolUse hook

**Hook events:** PreToolUse, PostToolUse, PreCompact, PostCompact, Stop, Notification, SessionStart

## CRITICAL: Read Before Write

**Always read the existing settings file before making changes.** Merge new settings with existing ones - never replace the entire file.

## CRITICAL: Use AskUserQuestion for Ambiguity

When the user's request is ambiguous, use AskUserQuestion to clarify:
- Which settings file to modify (user/project/local)
- Whether to add to existing arrays or replace them
- Specific values when multiple options exist

## Decision: Config Tool vs Direct Edit

**Use the Config tool** for these simple settings:
- \`theme\`, \`editorMode\`, \`verbose\`, \`model\`
- \`language\`, \`alwaysThinkingEnabled\`
- \`permissions.defaultMode\`

**Edit settings.json directly** for:
- Hooks (PreToolUse, PostToolUse, etc.)
- Complex permission rules (allow/deny arrays)
- Environment variables
- MCP server configuration
- Plugin configuration

## Workflow

1. **Clarify intent** - Ask if the request is ambiguous
2. **Read existing file** - Use Read tool on the target settings file
3. **Merge carefully** - Preserve existing settings, especially arrays
4. **Edit file** - Use Edit tool (if file doesn't exist, ask user to create it first)
5. **Confirm** - Tell user what was changed

## Merging Arrays (Important!)

When adding to permission arrays or hook arrays, **merge with existing**, don't replace:

**WRONG** (replaces existing permissions):
\`\`\`json
{ "permissions": { "allow": ["Bash(npm:*)"] } }
\`\`\`

**RIGHT** (preserves existing + adds new):
\`\`\`json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",      // existing
      "Edit(.claude)",    // existing
      "Bash(npm:*)"       // new
    ]
  }
}
\`\`\`

${zJz}

${_Jz}

## Example Workflows

### Adding a Hook

User: "Format my code after Claude writes it"

1. **Clarify**: Which formatter? (prettier, gofmt, etc.)
2. **Read**: \`.claude/settings.json\` (or create if missing)
3. **Merge**: Add to existing hooks, don't replace
4. **Result**:
\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | xargs prettier --write 2>/dev/null || true"
      }]
    }]
  }
}
\`\`\`

### Adding Permissions

User: "Allow npm commands without prompting"

1. **Read**: Existing permissions
2. **Merge**: Add \`Bash(npm:*)\` to allow array
3. **Result**: Combined with existing allows

### Environment Variables

User: "Set DEBUG=true"

1. **Decide**: User settings (global) or project settings?
2. **Read**: Target file
3. **Merge**: Add to env object
\`\`\`json
{ "env": { "DEBUG": "true" } }
\`\`\`

## Common Mistakes to Avoid

1. **Replacing instead of merging** - Always preserve existing settings
2. **Wrong file** - Ask user if scope is unclear
3. **Invalid JSON** - Validate syntax after changes
4. **Forgetting to read first** - Always read before write

## Troubleshooting Hooks

If a hook isn't running:
1. **Check the settings file** - Read ~/.claude/settings.json or .claude/settings.json
2. **Verify JSON syntax** - Invalid JSON silently fails
3. **Check the matcher** - Does it match the tool name? (e.g., "Bash", "Write", "Edit")
4. **Check hook type** - Is it "command", "prompt", or "agent"?
5. **Test the command** - Run the hook command manually to see if it works
6. **Use --debug** - Run \`claude --debug\` to see hook execution logs
`
})
// @from(Ln 468517, Col 4)
ua8
// @from(Ln 468517, Col 9)
Byq
// @from(Ln 468517, Col 14)
ma8
// @from(Ln 468517, Col 19)
OJz
// @from(Ln 468517, Col 24)
QR$
// @from(Ln 468518, Col 4)
gyq = E(() => {
    K7();
    ua8 = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings", "Tabs", "Attachments", "Footer", "MessageSelector", "DiffDialog", "ModelPicker", "Select", "Plugin"], Byq = {
        Global: "Active everywhere, regardless of focus",
        Chat: "When the chat input is focused",
        Autocomplete: "When autocomplete menu is visible",
        Confirmation: "When a confirmation/permission dialog is shown",
        Help: "When the help overlay is open",
        Transcript: "When viewing the transcript",
        HistorySearch: "When searching command history (ctrl+r)",
        Task: "When a task/agent is running in the foreground",
        ThemePicker: "When the theme picker is open",
        Settings: "When the settings menu is open",
        Tabs: "When tab navigation is active",
        Attachments: "When the attachment bar is focused",
        Footer: "When footer indicators are focused",
        MessageSelector: "When the message selector (rewind) is open",
        DiffDialog: "When the diff dialog is open",
        ModelPicker: "When the model picker is open",
        Select: "When a select/list component is focused",
        Plugin: "When the plugin dialog is open"
    }, ma8 = ["app:interrupt", "app:exit", "app:toggleTodos", "app:toggleTranscript", "app:toggleBrief", "app:toggleTeammatePreview", "app:toggleTerminal", "app:globalSearch", "app:quickOpen", "history:search", "history:previous", "history:next", "chat:cancel", "chat:cycleMode", "chat:modelPicker", "chat:thinkingToggle", "chat:submit", "chat:newline", "chat:undo", "chat:externalEditor", "chat:stash", "chat:imagePaste", "autocomplete:accept", "autocomplete:dismiss", "autocomplete:previous", "autocomplete:next", "confirm:yes", "confirm:no", "confirm:previous", "confirm:next", "confirm:nextField", "confirm:previousField", "confirm:cycleMode", "confirm:toggle", "confirm:toggleExplanation", "tabs:next", "tabs:previous", "transcript:toggleShowAll", "transcript:exit", "historySearch:next", "historySearch:accept", "historySearch:cancel", "historySearch:execute", "task:background", "theme:toggleSyntaxHighlighting", "help:dismiss", "attachments:next", "attachments:previous", "attachments:remove", "attachments:exit", "footer:next", "footer:previous", "footer:openSelected", "footer:clearSelection", "messageSelector:up", "messageSelector:down", "messageSelector:top", "messageSelector:bottom", "messageSelector:select", "diff:dismiss", "diff:previousSource", "diff:nextSource", "diff:back", "diff:viewDetails", "diff:previousFile", "diff:nextFile", "modelPicker:decreaseEffort", "modelPicker:increaseEffort", "select:next", "select:previous", "select:accept", "select:cancel", "plugin:toggle", "plugin:install", "permission:toggleDebug", "settings:search", "settings:retry", "settings:close", "voice:pushToTalk"], OJz = F6(() => C.object({
        context: C.enum(ua8).describe("UI context where these bindings apply. Global bindings work everywhere."),
        bindings: C.record(C.string().describe('Keystroke pattern (e.g., "ctrl+k", "shift+tab")'), C.union([C.enum(ma8), C.string().regex(/^command:[a-zA-Z0-9:\-_]+$/).describe('Command binding (e.g., "command:help", "command:compact"). Executes the slash command as if typed.'), C.null().describe("Set to null to unbind a default shortcut")]).describe("Action to trigger, command to invoke, or null to unbind")).describe("Map of keystroke patterns to actions")
    }).describe("A block of keybindings for a specific context")), QR$ = F6(() => C.object({
        $schema: C.string().optional().describe("JSON Schema URL for editor validation"),
        $docs: C.string().optional().describe("Documentation URL"),
        bindings: C.array(OJz()).describe("Array of keybinding blocks by context")
    }).describe("Claude Code keybindings configuration. Customize keyboard shortcuts by context."))
})
// @from(Ln 468549, Col 0)
function $Jz() {
    return Ba8(["Context", "Description"], ua8.map((A) => [`\`${A}\``, Byq[A]]))
}
// @from(Ln 468553, Col 0)
function HJz() {
    let A = {};
    for (let q of XW6)
        for (let [K, Y] of Object.entries(q.bindings))
            if (Y) {
                if (!A[Y]) A[Y] = {
                    keys: [],
                    context: q.context
                };
                A[Y].keys.push(K)
            } return Ba8(["Action", "Default Key(s)", "Context"], ma8.map((q) => {
        let K = A[q],
            Y = K ? K.keys.map((_) => `\`${_}\``).join(", ") : "(none)",
            z = K ? K.context : jJz(q);
        return [`\`${q}\``, Y, z]
    }))
}
// @from(Ln 468571, Col 0)
function jJz(A) {
    let q = A.split(":")[0];
    return {
        app: "Global",
        history: "Global or Chat",
        chat: "Chat",
        autocomplete: "Autocomplete",
        confirm: "Confirmation",
        tabs: "Tabs",
        transcript: "Transcript",
        historySearch: "HistorySearch",
        task: "Task",
        theme: "ThemePicker",
        help: "Help",
        attachments: "Attachments",
        footer: "Footer",
        messageSelector: "MessageSelector",
        diff: "DiffDialog",
        modelPicker: "ModelPicker",
        select: "Select",
        permission: "Confirmation"
    } [q ?? ""] ?? "Unknown"
}
// @from(Ln 468595, Col 0)
function JJz() {
    let A = [];
    A.push("### Non-rebindable (errors)");
    for (let q of wp6) A.push(`- \`${q.key}\` — ${q.reason}`);
    A.push(""), A.push("### Terminal reserved (errors/warnings)");
    for (let q of cN8) A.push(`- \`${q.key}\` — ${q.reason} (${q.severity==="error"?"will not work":"may conflict"})`);
    A.push(""), A.push("### macOS reserved (errors)");
    for (let q of lN8) A.push(`- \`${q.key}\` — ${q.reason}`);
    return A.join(`
`)
}
// @from(Ln 468607, Col 0)
function Fyq() {
    rw({
        name: "keybindings-help",
        description: 'Use when the user wants to customize keyboard shortcuts, rebind keys, add chord bindings, or modify ~/.claude/keybindings.json. Examples: "rebind ctrl+s", "add a chord shortcut", "change the submit key", "customize keybindings".',
        allowedTools: ["Read"],
        userInvocable: !1,
        isEnabled: pk,
        async getPromptForCommand(A) {
            let q = $Jz(),
                K = HJz(),
                Y = JJz(),
                z = [WJz, ZJz, GJz, fJz, TJz, vJz, NJz, VJz, `## Reserved Shortcuts

${Y}`, `## Available Contexts

${q}`, `## Available Actions

${K}`];
            if (A) z.push(`## User Request

${A}`);
            return [{
                type: "text",
                text: z.join(`

`)
            }]
        }
    })
}
// @from(Ln 468638, Col 0)
function Ba8(A, q) {
    let K = A.map(() => "---");
    return [`| ${A.join(" | ")} |`, `| ${K.join(" | ")} |`, ...q.map((Y) => `| ${Y.join(" | ")} |`)].join(`
`)
}
// @from(Ln 468643, Col 4)
MJz
// @from(Ln 468643, Col 9)
DJz
// @from(Ln 468643, Col 14)
XJz
// @from(Ln 468643, Col 19)
PJz
// @from(Ln 468643, Col 24)
WJz
// @from(Ln 468643, Col 29)
ZJz
// @from(Ln 468643, Col 34)
GJz
// @from(Ln 468643, Col 39)
fJz
// @from(Ln 468643, Col 44)
TJz
// @from(Ln 468643, Col 49)
vJz
// @from(Ln 468643, Col 54)
NJz
// @from(Ln 468643, Col 59)
VJz
// @from(Ln 468644, Col 4)
pyq = E(() => {
    nf();
    gyq();
    fP1();
    TP1();
    cd();
    g1();
    MJz = {
        $schema: "https://www.schemastore.org/claude-code-keybindings.json",
        $docs: "https://code.claude.com/docs/en/keybindings",
        bindings: [{
            context: "Chat",
            bindings: {
                "ctrl+e": "chat:externalEditor"
            }
        }]
    }, DJz = {
        context: "Chat",
        bindings: {
            "ctrl+s": null
        }
    }, XJz = {
        context: "Chat",
        bindings: {
            "ctrl+g": null,
            "ctrl+e": "chat:externalEditor"
        }
    }, PJz = {
        context: "Global",
        bindings: {
            "ctrl+k ctrl+t": "app:toggleTodos"
        }
    }, WJz = ["# Keybindings Skill", "", "Create or modify `~/.claude/keybindings.json` to customize keyboard shortcuts.", "", "## CRITICAL: Read Before Write", "", "**Always read `~/.claude/keybindings.json` first** (it may not exist yet). Merge changes with existing bindings — never replace the entire file.", "", "- Use **Edit** tool for modifications to existing files", "- Use **Write** tool only if the file does not exist yet"].join(`
`), ZJz = ["## File Format", "", "```json", B6(MJz, null, 2), "```", "", "Always include the `$schema` and `$docs` fields."].join(`
`), GJz = ["## Keystroke Syntax", "", "**Modifiers** (combine with `+`):", "- `ctrl` (alias: `control`)", "- `alt` (aliases: `opt`, `option`) — note: `alt` and `meta` are identical in terminals", "- `shift`", "- `meta` (aliases: `cmd`, `command`)", "", "**Special keys**: `escape`/`esc`, `enter`/`return`, `tab`, `space`, `backspace`, `delete`, `up`, `down`, `left`, `right`", "", "**Chords**: Space-separated keystrokes, e.g. `ctrl+k ctrl+s` (1-second timeout between keystrokes)", "", "**Examples**: `ctrl+shift+p`, `alt+enter`, `ctrl+k ctrl+n`"].join(`
`), fJz = ["## Unbinding Default Shortcuts", "", "Set a key to `null` to remove its default binding:", "", "```json", B6(DJz, null, 2), "```"].join(`
`), TJz = ["## How User Bindings Interact with Defaults", "", "- User bindings are **additive** — they are appended after the default bindings", "- To **move** a binding to a different key: unbind the old key (`null`) AND add the new binding", "- A context only needs to appear in the user's file if they want to change something in that context"].join(`
`), vJz = ["## Common Patterns", "", "### Rebind a key", "To change the external editor shortcut from `ctrl+g` to `ctrl+e`:", "```json", B6(XJz, null, 2), "```", "", "### Add a chord binding", "```json", B6(PJz, null, 2), "```"].join(`
`), NJz = ["## Behavioral Rules", "", "1. Only include contexts the user wants to change (minimal overrides)", "2. Validate that actions and contexts are from the known lists below", "3. Warn the user proactively if they choose a key that conflicts with reserved shortcuts or common tools like tmux (`ctrl+b`) and screen (`ctrl+a`)", "4. When adding a new binding for an existing action, the new binding is additive (existing default still works unless explicitly unbound)", "5. To fully replace a default binding, unbind the old key AND add the new one"].join(`
`), VJz = ["## Validation with /doctor", "", 'The `/doctor` command includes a "Keybinding Configuration Issues" section that validates `~/.claude/keybindings.json`.', "", "### Common Issues and Fixes", "", Ba8(["Issue", "Cause", "Fix"], [
        ['`keybindings.json must have a "bindings" array`', "Missing wrapper object", 'Wrap bindings in `{ "bindings": [...] }`'],
        ['`"bindings" must be an array`', "`bindings` is not an array", 'Set `"bindings"` to an array: `[{ context: ..., bindings: ... }]`'],
        ['`Unknown context "X"`', "Typo or invalid context name", "Use exact context names from the Available Contexts table"],
        ['`Duplicate key "X" in Y bindings`', "Same key defined twice in one context", "Remove the duplicate; JSON uses only the last value"],
        ['`"X" may not work: ...`', "Key conflicts with terminal/OS reserved shortcut", "Choose a different key (see Reserved Shortcuts section)"],
        ['`Could not parse keystroke "X"`', "Invalid key syntax", "Check syntax: use `+` between modifiers, valid key names"],
        ['`Invalid action for "X"`', "Action value is not a string or null", 'Actions must be strings like `"app:help"` or `null` to unbind']
    ]), "", "### Example /doctor Output", "", "```", "Keybinding Configuration Issues", "Location: ~/.claude/keybindings.json", '  └ [Error] Unknown context "chat"', "    → Valid contexts: Global, Chat, Autocomplete, ...", '  └ [Warning] "ctrl+c" may not work: Terminal interrupt (SIGINT)', "```", "", "**Errors** prevent bindings from working and must be fixed. **Warnings** indicate potential conflicts but the binding may still work."].join(`
`)
})
// @from(Ln 468695, Col 0)
function Qyq() {
    return
}
// @from(Ln 468698, Col 4)
kJz = `The skill enables you to be a verification specialist for Claude Code. Your primary goal is to verify that code changes actually work and fix what they're supposed to fix. You provide detailed failure reports that enable immediate issue resolution.

## Your Mission

**Main Goal: Verify functionality works correctly.** You will be given information about what needs to be verified. Your job is to:
1. Understand what was changed (from the prompt or by checking git)
2. Discover available verifier skills in the project
3. Create a verification plan and write it to a plan file
4. Trigger the appropriate verifier skill(s) to execute the plan — multiple verifiers may run if changes span different areas
5. Report results

If a previous verification plan exists and the changes/objective are the same, pass the plan in your prompt to reuse it.

## Phase 1: Discover Verifier Skills

Check your available skills (listed in the Skill tool's "Available skills" section) for any with "verifier" in the name (case-insensitive). These are your verifier skills (e.g., \`verifier-playwright\`, \`my-verifier\`, \`unit-test-verifier\`). No file system scanning needed — use the skills already loaded and available to you.

### How to Choose a Verifier

1. Run \`git status\` or use provided context to identify changed files
2. From the loaded skills with "verifier" in the name, read their descriptions to understand what each covers
3. Match changed files to the appropriate verifier based on what it describes (e.g., a playwright verifier for UI files, an API verifier for backend files)

**If no verifier skills are found:**
- Suggest running \`/init-verifiers\` to create one
- Do not proceed with verification until a verifier skill is configured

## Phase 2: Analyze Changes

If no context is provided, check git:
- Run \`git status\` to see modified files
- Run \`git diff\` to see the actual changes
- Infer what functionality needs verification

## Phase 3: Choose Verifier(s)

Based on the changed files and available verifiers:
1. Match each file to the most appropriate verifier based on the verifier's description
2. If multiple verifiers could apply, choose based on change type:
   - UI changes → prefer playwright/e2e verifiers
   - API changes → prefer http/api verifiers
   - CLI changes → prefer cli/tmux verifiers
3. Group files by verifier for batch execution

## Phase 4: Generate Verification Plan

**If a plan was passed in your prompt**, compare its "Files Being Verified" and "Change Summary" against the current git diff. If they still match, reuse the plan as-is (skip to Phase 5). If the changes have diverged, create a fresh plan below.

**If no plan was provided**, create a structured, deterministic plan that can be executed exactly.

Write the plan to a plan file:
- Plans are stored in \`~/.claude/plans/<slug>.md\`
- Use the Write tool to create the plan file
- Include the verifier skill to use in the metadata

### Plan Format

\`\`\`markdown
# Verification Plan

## Metadata
- **Verifier Skills**: <list of verifier skills to use>
- **Project Type**: <e.g., React web app, Express API, CLI tool, Python library>
- **Created**: <timestamp>
- **Change Summary**: <brief description>

## Files Being Verified
<Map each changed file to the appropriate verifier. In multi-project repos, verifiers are named verifier-<project>-<type>.>

Example (single project):
- src/components/Button.tsx → verifier-playwright
- src/pages/Home.tsx → verifier-playwright

Example (multi-project):
- frontend/src/components/Button.tsx → verifier-frontend-playwright
- backend/src/routes/users.ts → verifier-backend-api

## Preconditions
- <any setup requirements>

## Setup Steps
1. **<description>**
   - Command: \`<command>\`
   - Wait for: "<text indicating ready>"
   - Timeout: <ms>

## Verification Steps

### Step 1: <description>
- **Action**: <action type>
- **Details**: <specifics>
- **Expected**: <what success looks like>
- **Success Criteria**: <how to determine pass/fail>

### Step 2: ...

## Cleanup Steps
1. <cleanup actions>

## Success Criteria
- All verification steps pass
- <additional criteria>

## Execution Rules

**CRITICAL: Execute the plan EXACTLY as written.**

You MUST:
1. Read this verification plan in full before starting
2. Execute each step in order
3. Report PASS or FAIL for each step
4. Stop immediately on first FAIL

You MUST NOT:
- Skip steps
- Modify steps
- Add steps not in the plan
- Interpret ambiguous instructions (mark as FAIL instead)
- Round up "almost working" to "working"

## Reporting Format

Report results inline in your response:

### Verification Results

#### Step 1: <description> - PASS/FAIL
Command: \`<command>\`
Expected: <what was expected>
Actual: <what happened>

#### Step 2: ...
\`\`\`

## Phase 5: Trigger Verifier Skill(s)

After writing the plan, trigger each applicable verifier. If files map to multiple verifiers, run them sequentially:

1. For each verifier group (from Phase 3):
   a. Use the Skill tool to invoke that verifier skill
   b. Pass the plan file path and the subset of files in the prompt
   c. Collect results before moving to the next verifier
2. Aggregate results across all verifiers into a single report

Example (single project, single verifier):
\`\`\`
Use the Skill tool with:
- skill: "verifier-playwright"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md"
\`\`\`

Example (single project, multiple verifiers):
\`\`\`
# First: run playwright verifier for UI changes
Use the Skill tool with:
- skill: "verifier-playwright"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: src/components/Button.tsx"

# Then: run API verifier for backend changes
Use the Skill tool with:
- skill: "verifier-api"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: src/routes/users.ts"
\`\`\`

Example (multi-project repo):
\`\`\`
# Run frontend playwright verifier
Use the Skill tool with:
- skill: "verifier-frontend-playwright"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: frontend/src/components/Button.tsx"

# Run backend API verifier
Use the Skill tool with:
- skill: "verifier-backend-api"
- args: "Execute the verification plan at ~/.claude/plans/<slug>.md for files: backend/src/routes/users.ts"
\`\`\`

## Handling Different Scenarios

### Scenario 1: Verifier Skills Exist
1. Discover verifiers as described above
2. Create plan and write to plan file (listing all applicable verifiers)
3. Trigger each verifier skill sequentially with plan path and its file subset
4. Aggregate results and report inline

### Scenario 2: No Verifier Skills Found
1. Inform the user: "No verifier skills found. Run \`/init-verifiers\` to create one."
2. Do not proceed with verification until a verifier skill is configured.

### Scenario 3: Pre-existing Plan Provided
1. Parse the provided plan
2. Compare the plan's "Files Being Verified" and "Change Summary" against the current git diff
3. If the changes match (same files, same objective) → reuse the plan as-is
4. If the changes are different (new files, different objective, or significant code differences) → create a fresh plan
5. Write plan to plan file if not already there
6. Trigger verifier skill

## Reporting Results

Results are reported inline in the response (no separate file).

Report format:
\`\`\`
## Verification Results

**Verifiers Used**: <list of verifiers triggered>
**Plan File**: ~/.claude/plans/<slug>.md

### Summary
- Total Steps: X
- PASSED: Y
- FAILED: Z

### <verifier-name> Results
(e.g., "verifier-playwright Results" or "verifier-frontend-playwright Results")

#### Step 1: <description> - PASS
- Command: \`<command>\`
- Expected: <expected>
- Actual: <actual>

#### Step 2: <description> - FAIL
- Command: \`<command>\`
- Expected: <expected>
- Actual: <actual>
- **Error**: <error details>

### Overall: PASS/FAIL

### Recommended Fixes (if any failures)
1. <fix suggestion>
\`\`\`

## Critical Guidelines

1. **Discover verifiers first** - Always check for project-specific verifier skills
2. **Require verifier skills** - Do not proceed without a configured verifier; suggest \`/init-verifiers\` if none found
3. **Write plans to files** - Plans must be written to plan files so they can be re-executed
4. **Delegate to verifiers** - Use the Skill tool to trigger verifier skills rather than executing directly; run multiple verifiers sequentially if changes span different areas
5. **Report inline** - Results go in the response, not to a separate file
6. **Match by description** - Choose the verifier whose description best matches the changed files
7. **Focus on WHAT to verify, not HOW.** - Describe what was changed and the expected behavior.

## Verifier Skill Maintenance

If a verifier fails because its own instructions are outdated (wrong dev command, changed build path, missing tool) — not because the feature under test is broken — distinguish this from a feature FAIL in your report. After confirming with the user via AskUserQuestion, Edit \`.claude/skills/<verifier-name>/SKILL.md\` with a minimal fix, or suggest \`/init-verifiers\` to regenerate.

`
// @from(Ln 468946, Col 4)
Uyq = E(() => {
    nf()
})
// @from(Ln 468954, Col 0)
function dyq() {
    rw({
        name: "debug",
        description: "Enable debug logging for this session and help diagnose issues",
        allowedTools: ["Read", "Grep", "Glob"],
        argumentHint: "[issue description]",
        disableModelInvocation: !0,
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = lAA(),
                K = $A6(),
                Y;
            try {
                let w = await EJz(K),
                    O = Math.min(w.size, LJz),
                    $ = w.size - O,
                    H = await yJz(K, "r");
                try {
                    let {
                        buffer: j,
                        bytesRead: J
                    } = await H.read({
                        buffer: Buffer.alloc(O),
                        position: $
                    }), M = j.toString("utf-8", 0, J).split(`
`).slice(-dC1).join(`
`);
                    Y = `Log size: ${xq(w.size)}

### Last ${dC1} lines

\`\`\`
${M}
\`\`\``
                } finally {
                    await H.close()
                }
            } catch (w) {
                Y = w.code === "ENOENT" ? "No debug log exists yet — logging was just enabled." : `Failed to read last ${dC1} lines of debug log: ${_1(w)}`
            }
            return [{
                type: "text",
                text: `# Debug Skill

Help the user debug an issue they're encountering in this current Claude Code session.
${q?"":`
## Debug Logging Just Enabled

Debug logging was OFF for this session until now. Nothing prior to this /debug invocation was captured.

Tell the user that debug logging is now active at \`${K}\`, ask them to reproduce the issue, then re-read the log. If they can't reproduce, they can also restart with \`claude --debug\` to capture logs from startup.
`}
## Session Debug Log

The debug log for the current session is at: \`${K}\`

${Y}

For additional context, grep for [ERROR] and [WARN] lines across the full file.

## Issue Description

${A||"The user did not describe a specific issue. Read the debug log and summarize any errors, warnings, or notable issues."}

## Settings

Remember that settings are in:
* user - ${F_("userSettings")}
* project - ${F_("projectSettings")}
* local - ${F_("localSettings")}

## Instructions

1. Review the user's issue description
2. The last ${dC1} lines show the debug file format. Look for [ERROR] and [WARN] entries, stack traces, and failure patterns across the file
3. Consider launching the ${Wk8} subagent to understand the relevant Claude Code features
4. Explain what you found in plain language
5. Suggest concrete fixes or next steps
`
            }]
        }
    })
}
// @from(Ln 469037, Col 4)
dC1 = 20
// @from(Ln 469038, Col 4)
LJz = 65536
// @from(Ln 469039, Col 4)
cyq = E(() => {
    nf();
    H1();
    Zk8();
    i8();
    s8();
    Z7()
})
// @from(Ln 469048, Col 0)
function iyq(A) {
    let q = 0,
        K = "";
    while (q < A) {
        let Y = 10 + Math.floor(Math.random() * 11),
            z = 0;
        for (let _ = 0; _ < Y && q < A; _++) {
            let w = lyq[Math.floor(Math.random() * lyq.length)];
            if (K += w, q++, z++, _ === Y - 1 || q >= A) K += ". ";
            else K += " "
        }
        if (z > 0 && Math.random() < 0.2 && q < A) K += `

`
    }
    return K.trim()
}
// @from(Ln 469066, Col 0)
function nyq() {
    return
}
// @from(Ln 469069, Col 4)
lyq
// @from(Ln 469070, Col 4)
ryq = E(() => {
    nf();
    lyq = ["the", "a", "an", "I", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "this", "that", "what", "who", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "make", "made", "get", "got", "go", "went", "come", "came", "see", "saw", "know", "take", "think", "look", "want", "use", "find", "give", "tell", "work", "call", "try", "ask", "need", "feel", "seem", "leave", "put", "time", "year", "day", "way", "man", "thing", "life", "hand", "part", "place", "case", "point", "fact", "good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "small", "large", "next", "early", "young", "few", "public", "bad", "same", "able", "in", "on", "at", "to", "for", "of", "with", "from", "by", "about", "like", "through", "over", "before", "between", "under", "since", "without", "and", "or", "but", "if", "than", "because", "as", "until", "while", "so", "though", "both", "each", "when", "where", "why", "how", "not", "now", "just", "more", "also", "here", "there", "then", "only", "very", "well", "back", "still", "even", "much", "too", "such", "never", "again", "most", "once", "off", "away", "down", "out", "up", "test", "code", "data", "file", "line", "text", "word", "number", "system", "program", "set", "run", "value", "name", "type", "state", "end", "start"]
})
// @from(Ln 469075, Col 0)
function RJz(A) {
    return A.filter((q) => q.type === "user").map((q) => {
        let K = q.message.content;
        if (typeof K === "string") return K;
        return K.filter((Y) => Y.type === "text").map((Y) => Y.text).join(`
`)
    }).filter((q) => q.trim().length > 0)
}
// @from(Ln 469084, Col 0)
function oyq() {
    return
}
// @from(Ln 469087, Col 4)
hJz = `# Skillify {{userDescriptionBlock}}

You are capturing this session's repeatable process as a reusable skill.

## Your Session Context

Here is the session memory summary:
<session_memory>
{{sessionMemory}}
</session_memory>

Here are the user's messages during this session. Pay attention to how they steered the process, to help capture their detailed preferences in the skill:
<user_messages>
{{userMessages}}
</user_messages>

## Your Task

### Step 1: Analyze the Session

Before asking any questions, analyze the session to identify:
- What repeatable process was performed
- What the inputs/parameters were
- The distinct steps (in order)
- The success artifacts/criteria (e.g. not just "writing code," but "an open PR with CI fully passing") for each step
- Where the user corrected or steered you
- What tools and permissions were needed
- What agents were used
- What the goals and success artifacts were

### Step 2: Interview the User

You will use the AskUserQuestion to understand what the user wants to automate. Important notes:
- Use AskUserQuestion for ALL questions! Never ask questions via plain text.
- For each round, iterate as much as needed until the user is happy.
- The user always has a freeform "Other" option to type edits or feedback -- do NOT add your own "Needs tweaking" or "I'll provide edits" option. Just offer the substantive choices.

**Round 1: High level confirmation**
- Suggest a name and description for the skill based on your analysis. Ask the user to confirm or rename.
- Suggest high-level goal(s) and specific success criteria for the skill.

**Round 2: More details**
- Present the high-level steps you identified as a numbered list. Tell the user you will dig into the detail in the next round.
- If you think the skill will require arguments, suggest arguments based on what you observed. Make sure you understand what someone would need to provide.
- If it's not clear, ask if this skill should run inline (in the current conversation) or forked (as a sub-agent with its own context). Forked is better for self-contained tasks that don't need mid-process user input; inline is better when the user wants to steer mid-process.
- Ask where the skill should be saved. Suggest a default based on context (repo-specific workflows → repo, cross-repo personal workflows → user). Options:
  - **This repo** (\`.claude/skills/<name>/SKILL.md\`) — for workflows specific to this project
  - **Personal** (\`~/.claude/skills/<name>/SKILL.md\`) — follows you across all repos

**Round 3: Breaking down each step**
For each major step, if it's not glaringly obvious, ask:
- What does this step produce that later steps need? (data, artifacts, IDs)
- What proves that this step succeeded, and that we can move on?
- Should the user be asked to confirm before proceeding? (especially for irreversible actions like merging, sending messages, or destructive operations)
- Are any steps independent and could run in parallel? (e.g., posting to Slack and monitoring CI at the same time)
- How should the skill be executed? (e.g. always use a Task agent to conduct code review, or invoke an agent team for a set of concurrent steps)
- What are the hard constraints or hard preferences? Things that must or must not happen?

You may do multiple rounds of AskUserQuestion here, one round per step, especially if there are more than 3 steps or many clarification questions. Iterate as much as needed.

IMPORTANT: Pay special attention to places where the user corrected you during the session, to help inform your design.

**Round 4: Final questions**
- Confirm when this skill should be invoked, and suggest/confirm trigger phrases too. (e.g. For a cherrypick workflow you could say: Use when the user wants to cherry-pick a PR to a release branch. Examples: 'cherry-pick to release', 'CP this PR', 'hotfix.')
- You can also ask for any other gotchas or things to watch out for, if it's still unclear.

Stop interviewing once you have enough information. IMPORTANT: Don't over-ask for simple processes!

### Step 3: Write the SKILL.md

Create the skill directory and file at the location the user chose in Round 2.

Use this format:

\`\`\`markdown
---
name: {{skill-name}}
description: {{one-line description}}
allowed-tools:
  {{list of tool permission patterns observed during session}}
when_to_use: {{detailed description of when Claude should automatically invoke this skill, including trigger phrases and example user messages}}
argument-hint: "{{hint showing argument placeholders}}"
arguments:
  {{list of argument names}}
context: {{inline or fork -- omit for inline}}
---

# {{Skill Title}}
Description of skill

## Inputs
- \`$arg_name\`: Description of this input

## Goal
Clearly stated goal for this workflow. Best if you have clearly defined artifacts or criteria for completion.

## Steps

### 1. Step Name
What to do in this step. Be specific and actionable. Include commands when appropriate.

**Success criteria**: ALWAYS include this! This shows that the step is done and we can move on. Can be a list.

IMPORTANT: see the next section below for the per-step annotations you can optionally include for each step.

...
\`\`\`

**Per-step annotations**:
- **Success criteria** is REQUIRED on every step. This helps the model understand what the user expects from their workflow, and when it should have the confidence to move on.
- **Execution**: \`Direct\` (default), \`Task agent\` (straightforward subagents), \`Teammate\` (agent with true parallelism and inter-agent communication), or \`[human]\` (user does it). Only needs specifying if not Direct.
- **Artifacts**: Data this step produces that later steps need (e.g., PR number, commit SHA). Only include if later steps depend on it.
- **Human checkpoint**: When to pause and ask the user before proceeding. Include for irreversible actions (merging, sending messages), error judgment (merge conflicts), or output review.
- **Rules**: Hard rules for the workflow. User corrections during the reference session can be especially useful here.

**Step structure tips:**
- Steps that can run concurrently use sub-numbers: 3a, 3b
- Steps requiring the user to act get \`[human]\` in the title
- Keep simple skills simple -- a 2-step skill doesn't need annotations on every step

**Frontmatter rules:**
- \`allowed-tools\`: Minimum permissions needed (use patterns like \`Bash(gh:*)\` not \`Bash\`)
- \`context\`: Only set \`context: fork\` for self-contained skills that don't need mid-process user input.
- \`when_to_use\` is CRITICAL -- tells the model when to auto-invoke. Start with "Use when..." and include trigger phrases. Example: "Use when the user wants to cherry-pick a PR to a release branch. Examples: 'cherry-pick to release', 'CP this PR', 'hotfix'."
- \`arguments\` and \`argument-hint\`: Only include if the skill takes parameters. Use \`$name\` in the body for substitution.

### Step 4: Confirm and Save

Before writing the file, output the complete SKILL.md content as a yaml code block in your response so the user can review it with proper syntax highlighting. Then ask for confirmation using AskUserQuestion with a simple question like "Does this SKILL.md look good to save?" — do NOT use the body field, keep the question concise.

After writing, tell the user:
- Where the skill was saved
- How to invoke it: \`/{{skill-name}} [arguments]\`
- That they can edit the SKILL.md directly to refine it
`
// @from(Ln 469222, Col 4)
ayq = E(() => {
    nf();
    eT6()
})
// @from(Ln 469227, Col 0)
function syq() {
    return
}
// @from(Ln 469230, Col 4)
tyq = E(() => {
    nf();
    mH()
})
// @from(Ln 469235, Col 0)
function eyq() {
    rw({
        name: "simplify",
        description: "Review changed code for reuse, quality, and efficiency, then fix any issues found.",
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = SJz;
            if (A) q += `

## Additional Focus

${A}`;
            return [{
                type: "text",
                text: q
            }]
        }
    })
}
// @from(Ln 469254, Col 4)
SJz
// @from(Ln 469255, Col 4)
ALq = E(() => {
    nf();
    SJz = `# Simplify: Code Review and Cleanup

Review all changed files for reuse, quality, and efficiency. Fix any issues found.

## Phase 1: Identify Changes

Run \`git diff\` (or \`git diff HEAD\` if there are staged changes) to see what changed. If there are no git changes, review the most recently modified files that the user mentioned or that you edited earlier in this conversation.

## Phase 2: Launch Three Review Agents in Parallel

Use the ${r4} tool to launch all three agents concurrently in a single message. Pass each agent the full diff so it has the complete context.

### Agent 1: Code Reuse Review

For each change:

1. **Search for existing utilities and helpers** that could replace newly written code. Look for similar patterns elsewhere in the codebase — common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Suggest the existing function to use instead.
3. **Flag any inline logic that could use an existing utility** — hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.

### Agent 2: Code Quality Review

Review the same changes for hacky patterns:

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls
2. **Parameter sprawl**: adding new parameters to a function instead of generalizing or restructuring existing ones
3. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction
4. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries
5. **Stringly-typed code**: using raw strings where constants, enums (string unions), or branded types already exist in the codebase
6. **Unnecessary JSX nesting**: wrapper Boxes/elements that add no layout value — check if inner component props (flexShrink, alignItems, etc.) already provide the needed behavior

### Agent 3: Efficiency Review

Review the same changes for efficiency:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Recurring no-op updates**: state/store updates inside polling loops, intervals, or event handlers that fire unconditionally — add a change-detection guard so downstream consumers aren't notified when nothing changed. Also: if a wrapper function takes an updater/reducer callback, verify it honors same-reference returns (or whatever the "no change" signal is) — otherwise callers' early-return no-ops are silently defeated
5. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern) — operate directly and handle the error
6. **Memory**: unbounded data structures, missing cleanup, event listener leaks
7. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one

## Phase 3: Fix Issues

Wait for all three agents to complete. Aggregate their findings and fix each issue directly. If a finding is a false positive or not worth addressing, note it and move on — do not argue with the finding, just skip it.

When done, briefly summarize what was fixed (or confirm the code was already clean).
`
})
// @from(Ln 469308, Col 0)
function IJz(A) {
    return `# Batch: Parallel Work Orchestration

You are orchestrating a large, parallelizable change across this codebase.

## User Instruction

${A}

## Phase 1: Research and Plan (Plan Mode)

Call the \`${dt}\` tool now to enter plan mode, then:

1. **Understand the scope.** Launch one or more Explore agents (in the foreground — you need their results) to deeply research what this instruction touches. Find all the files, patterns, and call sites that need to change. Understand the existing conventions so the migration is consistent.

2. **Decompose into independent units.** Break the work into ${qLq}–${KLq} self-contained units. Each unit must:
   - Be independently implementable in an isolated git worktree (no shared state with sibling units)
   - Be mergeable on its own without depending on another unit's PR landing first
   - Be roughly uniform in size (split large units, merge trivial ones)

   Scale the count to the actual work: few files → closer to ${qLq}; hundreds of files → closer to ${KLq}. Prefer per-directory or per-module slicing over arbitrary file lists.

3. **Determine the e2e test recipe.** Figure out how a worker can verify its change actually works end-to-end — not just that unit tests pass. Look for:
   - A \`claude-in-chrome\` skill or browser-automation tool (for UI changes: click through the affected flow, screenshot the result)
   - A \`tmux\` or CLI-verifier skill (for CLI changes: launch the app interactively, exercise the changed behavior)
   - A dev-server + curl pattern (for API changes: start the server, hit the affected endpoints)
   - An existing e2e/integration test suite the worker can run

   If you cannot find a concrete e2e path, use the \`${Fw}\` tool to ask the user how to verify this change end-to-end. Offer 2–3 specific options based on what you found (e.g., "Screenshot via chrome extension", "Run \`bun run dev\` and curl the endpoint", "No e2e — unit tests are sufficient"). Do not skip this — the workers cannot ask the user themselves.

   Write the recipe as a short, concrete set of steps that a worker can execute autonomously. Include any setup (start a dev server, build first) and the exact command/interaction to verify.

4. **Write the plan.** In your plan file, include:
   - A summary of what you found during research
   - A numbered list of work units — for each: a short title, the list of files/directories it covers, and a one-line description of the change
   - The e2e test recipe (or "skip e2e because …" if the user chose that)
   - The exact worker instructions you will give each agent (the shared template)

5. Call \`${Uk}\` to present the plan for approval.

## Phase 2: Spawn Workers (After Plan Approval)

Once the plan is approved, spawn one background agent per work unit using the \`${r4}\` tool. **All agents must use \`isolation: "worktree"\` and \`run_in_background: true\`.** Launch them all in a single message block so they run in parallel.

For each agent, the prompt must be fully self-contained. Include:
- The overall goal (the user's instruction)
- This unit's specific task (title, file list, change description — copied verbatim from your plan)
- Any codebase conventions you discovered that the worker needs to follow
- The e2e test recipe from your plan (or "skip e2e because …")
- The worker instructions below, copied verbatim:

\`\`\`
${CJz}
\`\`\`

Use \`subagent_type: "general-purpose"\` unless a more specific agent type fits.

## Phase 3: Track Progress

After launching all workers, render an initial status table:

| # | Unit | Status | PR |
|---|------|--------|----|
| 1 | <title> | running | — |
| 2 | <title> | running | — |

As background-agent completion notifications arrive, parse the \`PR: <url>\` line from each agent's result and re-render the table with updated status (\`done\` / \`failed\`) and PR links. Keep a brief failure note for any agent that did not produce a PR.

When all agents have reported, render the final table and a one-line summary (e.g., "22/24 units landed as PRs").
`
}
// @from(Ln 469380, Col 0)
function YLq() {
    rw({
        name: "batch",
        description: "Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.",
        whenToUse: "Use when the user wants to make a sweeping, mechanical change across many files (migrations, refactors, bulk renames) that can be decomposed into independent parallel units.",
        argumentHint: "<instruction>",
        userInvocable: !0,
        disableModelInvocation: !0,
        async getPromptForCommand(A) {
            let q = A.trim();
            if (!q) return [{
                type: "text",
                text: xJz
            }];
            if (!await IH()) return [{
                type: "text",
                text: bJz
            }];
            return [{
                type: "text",
                text: IJz(q)
            }]
        }
    })
}
// @from(Ln 469405, Col 4)
qLq = 5
// @from(Ln 469406, Col 4)
KLq = 30
// @from(Ln 469407, Col 4)
CJz
// @from(Ln 469407, Col 9)
bJz = "This is not a git repository. The `/batch` command requires a git repo because it spawns agents in isolated git worktrees and creates PRs from each. Initialize a repo first, or run this from inside an existing one."
// @from(Ln 469408, Col 4)
xJz = `Provide an instruction describing the batch change you want to make.

Examples:
  /batch migrate from react to vue
  /batch replace all uses of lodash with native equivalents
  /batch add type annotations to all untyped function parameters`
// @from(Ln 469414, Col 4)
zLq = E(() => {
    nf();
    ct();
    $5();
    CJz = `After you finish implementing the change:
1. **Simplify** — Invoke the \`${oH}\` tool with \`skill: "simplify"\` to review and clean up your changes.
2. **Run unit tests** — Run the project's test suite (check for package.json scripts, Makefile targets, or common commands like \`npm test\`, \`bun test\`, \`pytest\`, \`go test\`). If tests fail, fix them.
3. **Test end-to-end** — Follow the e2e test recipe from the coordinator's prompt (below). If the recipe says to skip e2e for this unit, skip it.
4. **Commit and push** — Commit all changes with a clear message, push the branch, and create a PR with \`gh pr create\`. Use a descriptive title. If \`gh\` is not available or the push fails, note it in your final message.
5. **Report** — End with a single line: \`PR: <url>\` so the coordinator can track it. If no PR was created, end with \`PR: none — <reason>\`.`
})
// @from(Ln 469426, Col 0)
function _Lq() {
    return
}
// @from(Ln 469429, Col 4)
uJz = "# /stuck — diagnose frozen/slow Claude Code sessions\n\nThe user thinks another Claude Code session on this machine is frozen, stuck, or very slow. Investigate and post a report to #claude-code-feedback.\n\n## What to look for\n\nScan for other Claude Code processes (excluding the current one — PID is in `process.pid` but for shell commands just exclude the PID you see running this prompt). Process names are typically `claude` (installed) or `cli` (native dev build).\n\nSigns of a stuck session:\n- **High CPU (≥90%) sustained** — likely an infinite loop. Sample twice, 1-2s apart, to confirm it's not a transient spike.\n- **Process state `D` (uninterruptible sleep)** — often an I/O hang. The `state` column in `ps` output; first character matters (ignore modifiers like `+`, `s`, `<`).\n- **Process state `T` (stopped)** — user probably hit Ctrl+Z by accident.\n- **Process state `Z` (zombie)** — parent isn't reaping.\n- **Very high RSS (≥4GB)** — possible memory leak making the session sluggish.\n- **Stuck child process** — a hung `git`, `node`, or shell subprocess can freeze the parent. Check `pgrep -lP <pid>` for each session.\n\n## Investigation steps\n\n1. **List all Claude Code processes** (macOS/Linux):\n   ```\n   ps -axo pid=,pcpu=,rss=,etime=,state=,comm=,command= | grep -E '(claude|cli)' | grep -v grep\n   ```\n   Filter to rows where `comm` is `claude` or (`cli` AND the command path contains \"claude\").\n\n2. **For anything suspicious**, gather more context:\n   - Child processes: `pgrep -lP <pid>`\n   - If high CPU: sample again after 1-2s to confirm it's sustained\n   - If a child looks hung (e.g., a git command), note its full command line with `ps -p <child_pid> -o command=`\n   - Check the session's debug log if you can infer the session ID: `~/.claude/debug/<session-id>.txt` (the last few hundred lines often show what it was doing before hanging)\n\n3. **Consider a stack dump** for a truly frozen process (advanced, optional):\n   - macOS: `sample <pid> 3` gives a 3-second native stack sample\n   - This is big — only grab it if the process is clearly hung and you want to know *why*\n\n## Report\n\nPost a summary to **#claude-code-feedback** (channel ID: `C07VBSHV7EV`) using the Slack MCP tool. Use ToolSearch to find `slack_send_message` if it's not already loaded.\n\nThe report should include:\n- Hostname, Claude Code version, how many sessions total, how many look stuck\n- For each flagged session: PID, CPU%, RSS, state, uptime, command line, child processes, and your diagnosis of what's likely wrong\n- If nothing is flagged, still post a brief all-clear with the session count — the user ran /stuck for a reason, so confirming \"everything looks fine from the outside\" is useful\n\nIf Slack MCP isn't available, format the report as a message the user can copy-paste into #claude-code-feedback.\n\n## Notes\n- Don't kill or signal any processes — this is diagnostic only.\n- Be brief in the Slack message; details can go in a code block.\n- If the user gave an argument (e.g., a specific PID or symptom), focus there first.\n"
// @from(Ln 469430, Col 4)
wLq = E(() => {
    nf()
})
// @from(Ln 469433, Col 4)
OLq = {}
// @from(Ln 469438, Col 0)
function BJz(A) {
    return `# /loop — schedule a recurring prompt

Parse the input below into \`[interval] <prompt…>\` and schedule it with ${ER}.

## Parsing (in priority order)

1. **Leading token**: if the first whitespace-delimited token matches \`^\\d+[smhd]$\` (e.g. \`5m\`, \`2h\`), that's the interval; the rest is the prompt.
2. **Trailing "every" clause**: otherwise, if the input ends with \`every <N><unit>\` or \`every <N> <unit-word>\` (e.g. \`every 20m\`, \`every 5 minutes\`, \`every 2 hours\`), extract that as the interval and strip it from the prompt. Only match when what follows "every" is a time expression — \`check every PR\` has no interval.
3. **Default**: otherwise, interval is \`${no6}\` and the entire input is the prompt.

If the resulting prompt is empty, show usage \`/loop [interval] <prompt>\` and stop — do not call ${ER}.

Examples:
- \`5m /babysit-prs\` → interval \`5m\`, prompt \`/babysit-prs\` (rule 1)
- \`check the deploy every 20m\` → interval \`20m\`, prompt \`check the deploy\` (rule 2)
- \`run tests every 5 minutes\` → interval \`5m\`, prompt \`run tests\` (rule 2)
- \`check the deploy\` → interval \`${no6}\`, prompt \`check the deploy\` (rule 3)
- \`check every PR\` → interval \`${no6}\`, prompt \`check every PR\` (rule 3 — "every" not followed by time)
- \`5m\` → empty prompt → show usage

## Interval → cron

Supported suffixes: \`s\` (seconds, rounded up to nearest minute, min 1), \`m\` (minutes), \`h\` (hours), \`d\` (days). Convert:

| Interval pattern      | Cron expression     | Notes                                    |
|-----------------------|---------------------|------------------------------------------|
| \`Nm\` where N ≤ 59   | \`*/N * * * *\`     | every N minutes                          |
| \`Nm\` where N ≥ 60   | \`0 */H * * *\`     | round to hours (H = N/60, must divide 24)|
| \`Nh\` where N ≤ 23   | \`0 */N * * *\`     | every N hours                            |
| \`Nd\`                | \`0 0 */N * *\`     | every N days at midnight local           |
| \`Ns\`                | treat as \`ceil(N/60)m\` | cron minimum granularity is 1 minute  |

**If the interval doesn't cleanly divide its unit** (e.g. \`7m\` → \`*/7 * * * *\` gives uneven gaps at :56→:00; \`90m\` → 1.5h which cron can't express), pick the nearest clean interval and tell the user what you rounded to before scheduling.

## Action

Call ${ER} with:
- \`cron\`: the expression from the table above
- \`prompt\`: the parsed prompt from above, verbatim (slash commands are passed through unchanged)
- \`recurring\`: \`true\`

Then confirm to the user: what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after 3 days, and that they can cancel sooner with ${ed} (include the job ID).

## Input

${A}`
}
// @from(Ln 469487, Col 0)
function gJz() {
    rw({
        name: "loop",
        description: "Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo, defaults to 10m)",
        whenToUse: 'When the user wants to set up a recurring task, poll for status, or run something repeatedly on an interval (e.g. "check the deploy every 5 minutes", "keep running /babysit-prs"). Do NOT invoke for one-off tasks.',
        argumentHint: "[interval] <prompt>",
        userInvocable: !0,
        isEnabled: kR,
        async getPromptForCommand(A) {
            let q = A.trim();
            if (!q) return [{
                type: "text",
                text: mJz
            }];
            return [{
                type: "text",
                text: BJz(q)
            }]
        }
    })
}
// @from(Ln 469508, Col 4)
no6 = "10m"
// @from(Ln 469509, Col 4)
mJz
// @from(Ln 469510, Col 4)
$Lq = E(() => {
    nf();
    nt();
    mJz = `Usage: /loop [interval] <prompt>

Run a prompt or slash command on a recurring interval.

Intervals: Ns, Nm, Nh, Nd (e.g. 5m, 30m, 2h, 1d). Minimum granularity is 1 minute.
If no interval is specified, defaults to ${no6}.

Examples:
  /loop 5m /babysit-prs
  /loop 30m check the deploy
  /loop 1h /standup 1
  /loop check the deploy          (defaults to ${no6})
  /loop check the deploy every 20m`
})
// @from(Ln 469527, Col 4)
jLq = `# Building LLM-Powered Applications with Claude

This skill helps you build LLM-powered applications with Claude. Choose the right surface based on your needs, detect the project language, then read the relevant language-specific documentation.

## Defaults

Unless the user requests otherwise:

For the Claude model version, please use {{OPUS_NAME}}, which you can access via the exact model string \`{{OPUS_ID}}\`. Please default to using adaptive thinking (\`thinking: {type: "adaptive"}\`) for anything remotely complicated. And finally, please default to streaming for any request that may involve long input, long output, or high \`max_tokens\` — it prevents hitting request timeouts. Use the SDK's \`.get_final_message()\` / \`.finalMessage()\` helper to get the complete response if you don't need to handle individual stream events

---

## Language Detection

Before reading code examples, determine which language the user is working in:

1. **Look at project files** to infer the language:

   - \`*.py\`, \`requirements.txt\`, \`pyproject.toml\`, \`setup.py\`, \`Pipfile\` → **Python** — read from \`python/\`
   - \`*.ts\`, \`*.tsx\`, \`package.json\`, \`tsconfig.json\` → **TypeScript** — read from \`typescript/\`
   - \`*.js\`, \`*.jsx\` (no \`.ts\` files present) → **TypeScript** — JS uses the same SDK, read from \`typescript/\`
   - \`*.java\`, \`pom.xml\`, \`build.gradle\` → **Java** — read from \`java/\`
   - \`*.kt\`, \`*.kts\`, \`build.gradle.kts\` → **Java** — Kotlin uses the Java SDK, read from \`java/\`
   - \`*.scala\`, \`build.sbt\` → **Java** — Scala uses the Java SDK, read from \`java/\`
   - \`*.go\`, \`go.mod\` → **Go** — read from \`go/\`
   - \`*.rb\`, \`Gemfile\` → **Ruby** — read from \`ruby/\`
   - \`*.cs\`, \`*.csproj\` → **C#** — read from \`csharp/\`
   - \`*.php\`, \`composer.json\` → **PHP** — read from \`php/\`

2. **If multiple languages detected** (e.g., both Python and TypeScript files):

   - Check which language the user's current file or question relates to
   - If still ambiguous, ask: "I detected both Python and TypeScript files. Which language are you using for the Claude API integration?"

3. **If language can't be inferred** (empty project, no source files, or unsupported language):

   - Use AskUserQuestion with options: Python, TypeScript, Java, Go, Ruby, cURL/raw HTTP, C#, PHP
   - If AskUserQuestion is unavailable, default to Python examples and note: "Showing Python examples. Let me know if you need a different language."

4. **If unsupported language detected** (Rust, Swift, C++, Elixir, etc.):

   - Suggest cURL/raw HTTP examples from \`curl/\` and note that community SDKs may exist
   - Offer to show Python or TypeScript examples as reference implementations

5. **If user needs cURL/raw HTTP examples**, read from \`curl/\`.

### Language-Specific Feature Support

| Language   | Tool Runner | Agent SDK | Notes                                 |
| ---------- | ----------- | --------- | ------------------------------------- |
| Python     | Yes (beta)  | Yes       | Full support — \`@beta_tool\` decorator |
| TypeScript | Yes (beta)  | Yes       | Full support — \`betaZodTool\` + Zod    |
| Java       | Yes (beta)  | No        | Beta tool use with annotated classes  |
| Go         | Yes (beta)  | No        | \`BetaToolRunner\` in \`toolrunner\` pkg  |
| Ruby       | Yes (beta)  | No        | \`BaseTool\` + \`tool_runner\` in beta    |
| cURL       | N/A         | N/A       | Raw HTTP, no SDK features             |
| C#         | No          | No        | Official SDK                          |
| PHP        | No          | No        | Official SDK                          |

---

## Which Surface Should I Use?

> **Start simple.** Default to the simplest tier that meets your needs. Single API calls and workflows handle most use cases — only reach for agents when the task genuinely requires open-ended, model-driven exploration.

| Use Case                                        | Tier            | Recommended Surface       | Why                                     |
| ----------------------------------------------- | --------------- | ------------------------- | --------------------------------------- |
| Classification, summarization, extraction, Q&A  | Single LLM call | **Claude API**            | One request, one response               |
| Batch processing or embeddings                  | Single LLM call | **Claude API**            | Specialized endpoints                   |
| Multi-step pipelines with code-controlled logic | Workflow        | **Claude API + tool use** | You orchestrate the loop                |
| Custom agent with your own tools                | Agent           | **Claude API + tool use** | Maximum flexibility                     |
| AI agent with file/web/terminal access          | Agent           | **Agent SDK**             | Built-in tools, safety, and MCP support |
| Agentic coding assistant                        | Agent           | **Agent SDK**             | Designed for this use case              |
| Want built-in permissions and guardrails        | Agent           | **Agent SDK**             | Safety features included                |

> **Note:** The Agent SDK is for when you want built-in file/web/terminal tools, permissions, and MCP out of the box. If you want to build an agent with your own tools, Claude API is the right choice — use the tool runner for automatic loop handling, or the manual loop for fine-grained control (approval gates, custom logging, conditional execution).

### Decision Tree

\`\`\`
What does your application need?

1. Single LLM call (classification, summarization, extraction, Q&A)
   └── Claude API — one request, one response

2. Does Claude need to read/write files, browse the web, or run shell commands
   as part of its work? (Not: does your app read a file and hand it to Claude —
   does Claude itself need to discover and access files/web/shell?)
   └── Yes → Agent SDK — built-in tools, don't reimplement them
       Examples: "scan a codebase for bugs", "summarize every file in a directory",
                 "find bugs using subagents", "research a topic via web search"

3. Workflow (multi-step, code-orchestrated, with your own tools)
   └── Claude API with tool use — you control the loop

4. Open-ended agent (model decides its own trajectory, your own tools)
   └── Claude API agentic loop (maximum flexibility)
\`\`\`

### Should I Build an Agent?

Before choosing the agent tier, check all four criteria:

- **Complexity** — Is the task multi-step and hard to fully specify in advance? (e.g., "turn this design doc into a PR" vs. "extract the title from this PDF")
- **Value** — Does the outcome justify higher cost and latency?
- **Viability** — Is Claude capable at this task type?
- **Cost of error** — Can errors be caught and recovered from? (tests, review, rollback)

If the answer is "no" to any of these, stay at a simpler tier (single call or workflow).

---

## Architecture

Everything goes through \`POST /v1/messages\`. Tools and output constraints are features of this single endpoint — not separate APIs.

**User-defined tools** — You define tools (via decorators, Zod schemas, or raw JSON), and the SDK's tool runner handles calling the API, executing your functions, and looping until Claude is done. For full control, you can write the loop manually.

**Server-side tools** — Anthropic-hosted tools that run on Anthropic's infrastructure. Code execution is fully server-side (declare it in \`tools\`, Claude runs code automatically). Computer use can be server-hosted or self-hosted.

**Structured outputs** — Constrains the Messages API response format (\`output_config.format\`) and/or tool parameter validation (\`strict: true\`). The recommended approach is \`client.messages.parse()\` which validates responses against your schema automatically. Note: the old \`output_format\` parameter is deprecated; use \`output_config: {format: {...}}\` on \`messages.create()\`.

**Supporting endpoints** — Batches (\`POST /v1/messages/batches\`), Files (\`POST /v1/files\`), and Token Counting feed into or support Messages API requests.

---

## Current Models (cached: 2026-02-17)

| Model             | Model ID            | Context        | Input $/1M | Output $/1M |
| ----------------- | ------------------- | -------------- | ---------- | ----------- |
| Claude Opus 4.6   | \`claude-opus-4-6\`   | 200K (1M beta) | $5.00      | $25.00      |
| Claude Sonnet 4.6 | \`claude-sonnet-4-6\` | 200K (1M beta) | $3.00      | $15.00      |
| Claude Haiku 4.5  | \`claude-haiku-4-5\`  | 200K           | $1.00      | $5.00       |

**ALWAYS use \`{{OPUS_ID}}\` unless the user explicitly names a different model.** This is non-negotiable. Do not use \`{{SONNET_ID}}\`, \`{{PREV_SONNET_ID}}\`, or any other model unless the user literally says "use sonnet" or "use haiku". Never downgrade for cost — that's the user's decision, not yours.

**CRITICAL: Use only the exact model ID strings from the table above — they are complete as-is. Do not append date suffixes.** For example, use \`claude-sonnet-4-5\`, never \`claude-sonnet-4-5-20250514\` or any other date-suffixed variant you might recall from training data. If the user requests an older model not in the table (e.g., "opus 4.5", "sonnet 3.7"), read \`shared/models.md\` for the exact ID — do not construct one yourself.

A note: if any of the model strings above look unfamiliar to you, that's to be expected — that just means they were released after your training data cutoff. Rest assured they are real models; we wouldn't mess with you like that.

---

## Thinking & Effort (Quick Reference)

**Opus 4.6 — Adaptive thinking (recommended):** Use \`thinking: {type: "adaptive"}\`. Claude dynamically decides when and how much to think. No \`budget_tokens\` needed — \`budget_tokens\` is deprecated on Opus 4.6 and Sonnet 4.6 and must not be used. Adaptive thinking also automatically enables interleaved thinking (no beta header needed). **When the user asks for "extended thinking", a "thinking budget", or \`budget_tokens\`: always use Opus 4.6 with \`thinking: {type: "adaptive"}\`. The concept of a fixed token budget for thinking is deprecated — adaptive thinking replaces it. Do NOT use \`budget_tokens\` and do NOT switch to an older model.**

**Effort parameter (GA, no beta header):** Controls thinking depth and overall token spend via \`output_config: {effort: "low"|"medium"|"high"|"max"}\` (inside \`output_config\`, not top-level). Default is \`high\` (equivalent to omitting it). \`max\` is Opus 4.6 only. Works on Opus 4.5, Opus 4.6, and Sonnet 4.6. Will error on Sonnet 4.5 / Haiku 4.5. Combine with adaptive thinking for the best cost-quality tradeoffs. Use \`low\` for subagents or simple tasks; \`max\` for the deepest reasoning.

**Sonnet 4.6:** Supports adaptive thinking (\`thinking: {type: "adaptive"}\`). \`budget_tokens\` is deprecated on Sonnet 4.6 — use adaptive thinking instead.

**Older models (only if explicitly requested):** If the user specifically asks for Sonnet 4.5 or another older model, use \`thinking: {type: "enabled", budget_tokens: N}\`. \`budget_tokens\` must be less than \`max_tokens\` (minimum 1024). Never choose an older model just because the user mentions \`budget_tokens\` — use Opus 4.6 with adaptive thinking instead.

---

## Compaction (Quick Reference)

**Beta, Opus 4.6 and Sonnet 4.6.** For long-running conversations that may exceed the 200K context window, enable server-side compaction. The API automatically summarizes earlier context when it approaches the trigger threshold (default: 150K tokens). Requires beta header \`compact-2026-01-12\`.

**Critical:** Append \`response.content\` (not just the text) back to your messages on every turn. Compaction blocks in the response must be preserved — the API uses them to replace the compacted history on the next request. Extracting only the text string and appending that will silently lose the compaction state.

See \`{lang}/claude-api/README.md\` (Compaction section) for code examples. Full docs via WebFetch in \`shared/live-sources.md\`.

---

## Reading Guide

After detecting the language, read the relevant files based on what the user needs:

### Quick Task Reference

**Single text classification/summarization/extraction/Q&A:**
→ Read only \`{lang}/claude-api/README.md\`

**Chat UI or real-time response display:**
→ Read \`{lang}/claude-api/README.md\` + \`{lang}/claude-api/streaming.md\`

**Long-running conversations (may exceed context window):**
→ Read \`{lang}/claude-api/README.md\` — see Compaction section

**Function calling / tool use / agents:**
→ Read \`{lang}/claude-api/README.md\` + \`shared/tool-use-concepts.md\` + \`{lang}/claude-api/tool-use.md\`

**Batch processing (non-latency-sensitive):**
→ Read \`{lang}/claude-api/README.md\` + \`{lang}/claude-api/batches.md\`

**File uploads across multiple requests:**
→ Read \`{lang}/claude-api/README.md\` + \`{lang}/claude-api/files-api.md\`

**Agent with built-in tools (file/web/terminal):**
→ Read \`{lang}/agent-sdk/README.md\` + \`{lang}/agent-sdk/patterns.md\`

### Claude API (Full File Reference)

Read the **language-specific Claude API folder** (\`{language}/claude-api/\`):

1. **\`{language}/claude-api/README.md\`** — **Read this first.** Installation, quick start, common patterns, error handling.
2. **\`shared/tool-use-concepts.md\`** — Read when the user needs function calling, code execution, memory, or structured outputs. Covers conceptual foundations.
3. **\`{language}/claude-api/tool-use.md\`** — Read for language-specific tool use code examples (tool runner, manual loop, code execution, memory, structured outputs).
4. **\`{language}/claude-api/streaming.md\`** — Read when building chat UIs or interfaces that display responses incrementally.
5. **\`{language}/claude-api/batches.md\`** — Read when processing many requests offline (not latency-sensitive). Runs asynchronously at 50% cost.
6. **\`{language}/claude-api/files-api.md\`** — Read when sending the same file across multiple requests without re-uploading.
7. **\`shared/error-codes.md\`** — Read when debugging HTTP errors or implementing error handling.
8. **\`shared/live-sources.md\`** — WebFetch URLs for fetching the latest official documentation.

> **Note:** For Java, Go, Ruby, C#, PHP, and cURL — these have a single file each covering all basics. Read that file plus \`shared/tool-use-concepts.md\` and \`shared/error-codes.md\` as needed.

### Agent SDK

Read the **language-specific Agent SDK folder** (\`{language}/agent-sdk/\`). Agent SDK is available for **Python and TypeScript only**.

1. **\`{language}/agent-sdk/README.md\`** — Installation, quick start, built-in tools, permissions, MCP, hooks.
2. **\`{language}/agent-sdk/patterns.md\`** — Custom tools, hooks, subagents, MCP integration, session resumption.
3. **\`shared/live-sources.md\`** — WebFetch URLs for current Agent SDK docs.

---

## When to Use WebFetch

Use WebFetch to get the latest documentation when:

- User asks for "latest" or "current" information
- Cached data seems incorrect
- User asks about features not covered here

Live documentation URLs are in \`shared/live-sources.md\`.

## Common Pitfalls

- Don't truncate inputs when passing files or content to the API. If the content is too long to fit in the context window, notify the user and discuss options (chunking, summarization, etc.) rather than silently truncating.
- **Opus 4.6 / Sonnet 4.6 thinking:** Use \`thinking: {type: "adaptive"}\` — do NOT use \`budget_tokens\` (deprecated on both Opus 4.6 and Sonnet 4.6). For older models, \`budget_tokens\` must be less than \`max_tokens\` (minimum 1024). This will throw an error if you get it wrong.
- **Opus 4.6 prefill removed:** Assistant message prefills (last-assistant-turn prefills) return a 400 error on Opus 4.6. Use structured outputs (\`output_config.format\`) or system prompt instructions to control response format instead.
- **128K output tokens:** Opus 4.6 supports up to 128K \`max_tokens\`, but the SDKs require streaming for large \`max_tokens\` to avoid HTTP timeouts. Use \`.stream()\` with \`.get_final_message()\` / \`.finalMessage()\`.
- **Tool call JSON parsing (Opus 4.6):** Opus 4.6 may produce different JSON string escaping in tool call \`input\` fields (e.g., Unicode or forward-slash escaping). Always parse tool inputs with \`json.loads()\` / \`JSON.parse()\` — never do raw string matching on the serialized input.
- **Structured outputs (all models):** Use \`output_config: {format: {...}}\` instead of the deprecated \`output_format\` parameter on \`messages.create()\`. This is a general API change, not 4.6-specific.
- **Don't reimplement SDK functionality:** The SDK provides high-level helpers — use them instead of building from scratch. Specifically: use \`stream.finalMessage()\` instead of wrapping \`.on()\` events in \`new Promise()\`; use typed exception classes (\`Anthropic.RateLimitError\`, etc.) instead of string-matching error messages; use SDK types (\`Anthropic.MessageParam\`, \`Anthropic.Tool\`, \`Anthropic.Message\`, etc.) instead of redefining equivalent interfaces.
- **Don't define custom types for SDK data structures:** The SDK exports types for all API objects. Use \`Anthropic.MessageParam\` for messages, \`Anthropic.Tool\` for tool definitions, \`Anthropic.ToolUseBlock\` / \`Anthropic.ToolResultBlockParam\` for tool results, \`Anthropic.Message\` for responses. Defining your own \`interface ChatMessage { role: string; content: unknown }\` duplicates what the SDK already provides and loses type safety.
- **Report and document output:** For tasks that produce reports, documents, or visualizations, the code execution sandbox has \`python-docx\`, \`python-pptx\`, \`matplotlib\`, \`pillow\`, and \`pypdf\` pre-installed. Claude can generate formatted files (DOCX, PDF, charts) and return them via the Files API — consider this for "report" or "document" type requests instead of plain stdout text.
`
// @from(Ln 469765, Col 4)
HLq = () => {}