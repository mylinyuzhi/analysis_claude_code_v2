# Built-in Slash Commands

## Overview

Claude Code v2.0.59 provides a comprehensive set of built-in slash commands for configuration, debugging, context visualization, and more. This document lists all built-in commands with their syntax, options, and use cases.

---

## Command Categories

- [Help and Documentation](#help-and-documentation)
- [Configuration](#configuration)
- [Context and Usage](#context-and-usage)
- [Session Management](#session-management)
- [IDE Integration](#ide-integration)
- [Initialization](#initialization)
- [Memory and Files](#memory-and-files)
- [Diagnostics](#diagnostics)

---

## Help and Documentation

### /help

**Type:** `local-jsx`

**Description:** Show help and available commands

**Syntax:**
```
/help
```

**Features:**
- Lists all available commands (built-in, custom, plugin)
- Shows command descriptions
- Displays command aliases
- Interactive UI component
- Filterable command list

**Example Output:**
```
Available Commands:
  /help          - Show this help
  /config        - Open config panel
  /context       - Visualize context usage
  /cost          - Show session cost
  ...
```

**Aliases:** None

---

## Configuration

### /config

**Type:** `local-jsx`

**Description:** Open configuration panel

**Syntax:**
```
/config
```

**Features:**
- Interactive configuration UI
- Tabs for different settings:
  - **Config:** General settings
  - **Usage:** Rate limits and usage data
- Edit settings visually
- View current configuration
- Warning indicators for issues

**Configuration Options:**
- Model selection
- Permission settings
- MCP server configuration
- Hook configuration
- Plugin management
- Theme settings
- Environment variables

**Aliases:** `theme`, `settings`

**Example:**
```
/config          → Open config panel
/theme           → Same as /config (alias)
/settings        → Same as /config (alias)
```

---

## Context and Usage

### /context

**Type:** `local-jsx`

**Description:** Visualize current context usage as a colored grid

**Syntax:**
```
/context
```

**Features:**
- Visual grid representation of token usage
- Color-coded blocks:
  - **Blue:** User messages
  - **Green:** Assistant messages
  - **Yellow:** Tool calls
  - **Red:** Tool results
  - **Purple:** Attachments
- Shows percentage of context used
- Helps identify context-heavy operations
- Supports non-interactive mode (text output)

**Example Output:**
```
Context Usage: 45,234 / 200,000 tokens (22.6%)

■■■■■■■■■■□□□□□□□□□□
■■■■■■■■■■□□□□□□□□□□

Legend:
■ Used tokens
□ Available tokens
```

**Aliases:** None

---

### /cost

**Type:** `local`

**Description:** Show the total cost and duration of the current session

**Syntax:**
```
/cost
```

**Features:**
- Shows API costs (if applicable)
- Session duration
- Token usage statistics
- Model usage breakdown
- Subscription vs overage usage (for Pro/Max users)

**Example Output:**
```
Session Cost: $0.42
Duration: 15 minutes 32 seconds
Tokens Used: 45,234

Model Usage:
- claude-sonnet-4-5: 38,500 tokens
- claude-haiku-3-5: 6,734 tokens
```

**Note:** Hidden for subscription users (shows subscription message instead)

**Aliases:** None

---

### /usage

**Type:** `local-jsx`

**Description:** Show usage limits and rate limit information

**Syntax:**
```
/usage
```

**Features:**
- Visual usage bars for rate limits
- Three time windows:
  - Current session (5 hour window)
  - Current week (all models)
  - Current week (Sonnet only)
- Reset time countdowns
- Utilization percentages
- Interactive refresh (press 'r')

**Example Output:**
```
Current session
████████████░░░░░░░░ 62% used
Resets in 3 hours 24 minutes

Current week (all models)
██████░░░░░░░░░░░░░░ 31% used
Resets in 4 days

Current week (Sonnet only)
████░░░░░░░░░░░░░░░░ 18% used
Resets in 4 days
```

**Note:** Only available for subscription plans

**Aliases:** None

---

## Session Management

### /clear

**Type:** `local`

**Description:** Clear the conversation history

**Syntax:**
```
/clear
```

**Features:**
- Clears all conversation messages
- Resets context to initial state
- Keeps configuration settings
- Cannot be undone

**Example:**
```
/clear

Conversation cleared.
```

**Aliases:** None

---

### /compact

**Type:** `local`

**Description:** Manually trigger context compaction

**Syntax:**
```
/compact [custom instructions]
```

**Arguments:**
- `custom instructions` (optional): Additional instructions for summarization

**Features:**
- Summarizes conversation to reduce tokens
- Preserves important context
- Runs PreCompact hooks
- Adds boundary marker
- Can add custom compaction instructions

**Example:**
```
/compact

Compacting conversation...
Reduced from 45,000 to 8,500 tokens.
```

**Aliases:** None

---

## IDE Integration

### /ide

**Type:** `local-jsx`

**Description:** Select and connect to an IDE

**Syntax:**
```
/ide
```

**Features:**
- Lists available IDEs
- Shows workspace folders for each IDE
- Auto-connect option
- Support for multiple IDEs:
  - VS Code
  - Cursor
  - JetBrains IDEs (IntelliJ, PyCharm, etc.)
  - Zed
- Displays unavailable IDEs with workspace info

**Example Output:**
```
Select IDE

Available:
  • VS Code (Port 49152)
    workspace: /Users/user/project

  • Cursor (Port 49153)
    workspace: /Users/user/another-project

  • None

Press Enter to confirm · Esc to exit
```

**Aliases:** None

---

## Initialization

### /init

**Type:** `local`

**Description:** Initialize Claude Code configuration for current project

**Syntax:**
```
/init
```

**Features:**
- Creates `.claude/` directory
- Generates initial `settings.json`
- Sets up project configuration
- Interactive setup wizard (if applicable)

**Example:**
```
/init

Initializing Claude Code for this project...
Created .claude/settings.json
✓ Configuration initialized
```

**Aliases:** None

---

## Memory and Files

### /memory

**Type:** `local-jsx`

**Description:** Manage conversation memory and CLAUDE.md files

**Syntax:**
```
/memory
```

**Features:**
- View CLAUDE.md files in context
- Shows memory file locations:
  - User: `~/.claude/CLAUDE.md`
  - Project: `./.claude/CLAUDE.md`
  - Local: `./CLAUDE.md`
- Token counts for each file
- Edit memory files
- Memory hierarchy visualization

**Example Output:**
```
Memory Files:

User Memory (~/.claude/CLAUDE.md)
  1,234 tokens

Project Memory (./.claude/CLAUDE.md)
  567 tokens

Local Memory (./CLAUDE.md)
  Not found
```

**Aliases:** None

---

## Diagnostics

### /doctor

**Type:** `local-jsx`

**Description:** Run diagnostics and show system health

**Syntax:**
```
/doctor
```

**Features:**
- System health checks
- Configuration validation
- MCP server diagnostics
- Environment variable validation
- Large file warnings
- Agent description size checks
- MCP tool token usage
- Detailed error messages
- Fix suggestions

**Diagnostic Categories:**

#### 1. MCP Configuration
- Parsing errors in `.mcp.json`
- Server connection issues
- Invalid server configurations
- Severity: Error/Warning

#### 2. Environment Variables
- Missing required variables
- Invalid values
- Configuration issues
- Validation status

#### 3. CLAUDE.md Files
- Large file warnings (> 25,000 chars)
- Multiple large files
- File locations and sizes
- Severity: Warning

#### 4. Agent Descriptions
- Large agent description warnings
- Token usage per agent
- Total agent token count
- Threshold: 5,000 tokens
- Severity: Warning

#### 5. MCP Tool Tokens
- Large MCP tool definition warnings
- Token usage per server
- Top servers by token usage
- Threshold: 10,000 tokens
- Severity: Warning

**Example Output:**
```
System Diagnostics

✓ All checks passed

MCP Servers: 3 configured, 3 running
Environment: All variables valid
CLAUDE.md: 1,234 tokens
Agents: 2 configured, 567 tokens
```

**With Issues:**
```
System Diagnostics

⚠ 2 warnings, 1 error

ERROR: MCP Configuration
  Server 'filesystem' failed to connect
  → Check server command and permissions

WARNING: Large CLAUDE.md
  ./.claude/CLAUDE.md: 32,450 chars (> 25,000)
  → Consider splitting into smaller files

WARNING: MCP Tool Tokens
  ~12,340 tokens from MCP tools (> 10,000)
  Top servers:
    - filesystem: ~5,600 tokens
    - database: ~4,200 tokens
    - api-server: ~2,540 tokens
```

**Aliases:** None

---

## Hidden/Experimental Commands

### /feedback

**Type:** `local`

**Description:** Submit feedback about Claude Code

**Syntax:**
```
/feedback [message]
```

**Arguments:**
- `message` (optional): Feedback message

**Features:**
- Opens feedback form
- Sends feedback to Anthropic
- Can include session context

**Note:** May be hidden or available only in certain builds

---

### /code

**Type:** `prompt`

**Description:** Special code-focused prompt command

**Features:**
- Optimized for coding tasks
- May include code-specific tools
- Specific prompting strategies

**Note:** Availability varies by version/build

---

## Plugin Management Commands

Claude Code supports plugin management through slash commands. The exact commands may vary based on plugin system version:

### /plugin

**Type:** `local` or `local-jsx`

**Description:** Manage plugins (install, enable, disable, validate)

**Possible Subcommands:**
```
/plugin install <plugin-id>
/plugin enable <plugin-id>
/plugin disable <plugin-id>
/plugin validate <plugin-id>
/plugin manage
/plugin uninstall <plugin-id>
```

**Features:**
- Install plugins from marketplaces
- Enable/disable plugins
- Validate plugin configurations
- Manage plugin settings
- Uninstall plugins

**Note:** Exact syntax may vary based on version

---

### /marketplace

**Type:** `local-jsx`

**Description:** Browse and manage plugin marketplaces

**Syntax:**
```
/marketplace
/marketplace list
/marketplace add <source>
```

**Features:**
- List available marketplaces
- Browse plugins
- Add marketplace sources
- View marketplace manifests

**Marketplace Sources:**
- GitHub repositories
- Local directories
- HTTP/HTTPS URLs
- Git repositories

---

## MCP Tool Commands

MCP (Model Context Protocol) servers provide tools that can be invoked as commands:

**Syntax:**
```
/mcp:server_name::tool_name [args]
```

**Example:**
```
/mcp:filesystem::read_file /path/to/file.txt
/mcp:database::query SELECT * FROM users
/mcp:api-server::fetch https://api.example.com/data
```

**Features:**
- Direct tool invocation
- Bypasses normal tool approval workflow
- Uses MCP server's tool implementation
- Arguments passed as command args

**Note:** Requires MCP server to be configured and running

---

## Command Aliases

Some commands have convenient aliases:

| Command | Aliases |
|---------|---------|
| `/config` | `/theme`, `/settings` |

---

## Special Input Formats

### Bash Commands

Prefix with `!` to execute bash commands directly:

```
!npm install
!git status
!ls -la
```

**Features:**
- Direct bash execution
- Shows stdout and stderr
- Inline progress display
- Supports interruption (Ctrl+C)

### File Paths

Absolute paths starting with `/` are treated as regular input (not commands):

```
/var/log/app.log      → Treated as text
/tmp/test.txt         → Treated as text
/Users/name/file.txt  → Treated as text
```

---

## Command Options and Flags

Some commands support options (syntax may vary):

```
/config --tab=usage
/context --format=text
/doctor --verbose
```

**Note:** Specific option support depends on command implementation

---

## Common Command Patterns

### Query vs No Query

Commands set `shouldQuery` flag:

**shouldQuery: false**
- Command handles output directly
- No LLM invocation
- Examples: `/help`, `/config`, `/cost`, `/clear`

**shouldQuery: true**
- Command generates prompt for LLM
- LLM processes and responds
- Examples: Prompt-type commands, custom commands

### Display Options

Commands can control display:

```typescript
{
  display: "skip"     // Don't show in conversation
  display: "system"   // Show as system message
  display: undefined  // Normal display (default)
}
```

### Tool Restrictions

Commands can restrict available tools:

```typescript
{
  allowedTools: ["Read", "Grep", "Glob"]
}
```

### Model Override

Commands can specify model:

```typescript
{
  model: "claude-sonnet-4-5-20250929"
}
// or
{
  useSmallFastModel: true
}
```

---

## Command Lifecycle

1. **User Input:** `/command [args]`
2. **Parsing:** Extract command name and arguments
3. **Validation:** Check if command exists
4. **Execution:** Call command handler
5. **Result Processing:** Handle command output
6. **Display:** Show result to user
7. **History:** Save to history (unless `skipHistory: true`)

---

## Error Handling

### Unknown Command

```
/unknown-cmd

Unknown slash command: unknown-cmd
```

### Invalid Arguments

```
/config invalid-option

Error: Invalid option 'invalid-option'
```

### Execution Error

```
/cost

Error: Failed to fetch usage data
```

---

## Best Practices

### 1. Use Tab Completion

Most terminals support tab completion for command names

### 2. Check /help

Use `/help` to discover available commands and their descriptions

### 3. Use Aliases

Shorter aliases save typing (e.g., `/theme` instead of `/config`)

### 4. Combine with Tools

Commands can work with tools for powerful workflows

### 5. Non-Interactive Mode

Some commands support non-interactive mode for scripting

---

## Command Implementation Types

### local-jsx

Interactive UI components using React/Ink:
- `/help`
- `/config`
- `/context`
- `/usage`
- `/ide`
- `/memory`
- `/doctor`

### local

Synchronous text output:
- `/cost`
- `/clear`
- `/init`

### prompt

LLM-invoked commands:
- Custom commands
- Plugin commands
- Special prompt commands

---

## Customization

### Custom Commands

Create `.claude/commands/my-command.json`:

```json
{
  "name": "my-command",
  "description": "My custom command",
  "type": "prompt",
  "prompt": "Execute this task: $ARGS"
}
```

Usage: `/my-command argument`

### Plugin Commands

Install plugins that provide commands:

```
/plugin install code-review@anthropic-tools
```

Then use:
```
/code-review
```

---

## Telemetry

Commands emit telemetry events:

```typescript
telemetry("tengu_input_command", {
  input: commandType,
  plugin_repository?: string,
  plugin_name?: string,
  plugin_version?: string
});
```

---

## Debugging Commands

### Verbose Output

Some commands support verbose mode:

```
/doctor --verbose
/context --verbose
```

### Hidden Commands

Some commands are hidden from `/help` but still functional:

- Internal debugging commands
- Experimental features
- Admin commands

---

## Summary Table

| Command | Type | Interactive | Hidden | Description |
|---------|------|-------------|--------|-------------|
| `/help` | local-jsx | Yes | No | Show available commands |
| `/config` | local-jsx | Yes | No | Open config panel |
| `/context` | local-jsx | Yes | No | Visualize context usage |
| `/cost` | local | No | Conditional | Show session cost |
| `/usage` | local-jsx | Yes | Conditional | Show usage limits |
| `/clear` | local | No | No | Clear conversation |
| `/compact` | local | No | No | Trigger compaction |
| `/ide` | local-jsx | Yes | No | Select IDE |
| `/init` | local | No | No | Initialize project config |
| `/memory` | local-jsx | Yes | No | Manage memory files |
| `/doctor` | local-jsx | Yes | No | Run diagnostics |

---

## See Also

- [Command Parsing](./parsing.md) - Parsing logic and registration
- [Plugin System](../10_skill/overview.md) - Plugin commands
- [MCP Integration](../06_mcp/overview.md) - MCP tool commands
- [Context Management](../07_compact/overview.md) - Compaction and context
