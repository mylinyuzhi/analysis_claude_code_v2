# Python SDK Usage Guide

> Analysis of claude-agent-sdk-python interfaces and their Claude Code handling.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key classes in this document:
- `StdioSDKTransport` (aSA) - Claude Code's stdin/stdout transport
- `validateSDKMessage` (gf5) - Message validation in Claude Code

---

## SDK Overview

The Claude Agent SDK for Python (`claude-agent-sdk`) provides two main interfaces for interacting with Claude Code:

| Interface | Use Case | Communication |
|-----------|----------|---------------|
| `query()` | One-shot queries | Unidirectional stream |
| `ClaudeSDKClient` | Interactive sessions | Bidirectional stream |

Both interfaces spawn Claude Code as a subprocess and communicate via JSON-lines protocol over stdin/stdout.

---

## Two Interaction Models

### 1. One-Shot Query Interface: `query()`

**Purpose:** Simple, stateless interface for single request-response interactions.

**Signature:**
```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None,
    transport: Transport | None = None,
) -> AsyncIterator[Message]:
```

**How it works:**
1. Creates subprocess with `CLAUDE_CODE_ENTRYPOINT=sdk-py`
2. Sends prompt as JSON-lines to stdin
3. Yields messages from stdout until result received
4. Closes connection automatically

**Use cases:**
- Simple one-off questions
- Batch processing of independent prompts
- CI/CD automation scripts

**Example:**
```python
from claude_agent_sdk import query, AssistantMessage, TextBlock

async def main():
    async for message in query(prompt="What is 2 + 2?"):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(f"Claude: {block.text}")
```

---

### 2. Bidirectional Streaming: `ClaudeSDKClient`

**Purpose:** Stateful client for multi-turn conversations with control flow.

**Key Features:**
- Persistent connection for multiple queries
- Mid-conversation control (interrupts, permission changes)
- Model switching during session
- File checkpointing and rewind

**Core Methods:**

| Method | Purpose |
|--------|---------|
| `connect()` | Establish connection |
| `disconnect()` | Close connection |
| `query(prompt)` | Send user message |
| `receive_messages()` | Async iterator for all messages |
| `receive_response()` | Async iterator until ResultMessage |
| `interrupt()` | Stop current execution |
| `set_permission_mode()` | Change permission level |
| `set_model()` | Switch models mid-conversation |
| `rewind_files()` | Restore file state to checkpoint |

**Example:**
```python
from claude_agent_sdk import ClaudeSDKClient, AssistantMessage, TextBlock

async def main():
    async with ClaudeSDKClient() as client:
        # First turn
        await client.query("Explain quantum computing")
        async for msg in client.receive_response():
            if isinstance(msg, AssistantMessage):
                print_message(msg)

        # Follow-up turn (maintains context)
        await client.query("Give me a simpler explanation")
        async for msg in client.receive_response():
            if isinstance(msg, AssistantMessage):
                print_message(msg)
```

---

## Message Types

The SDK defines strongly-typed message classes for all communication:

### Content Blocks

```python
@dataclass
class TextBlock:
    text: str

@dataclass
class ThinkingBlock:
    thinking: str
    signature: str

@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]

@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict] | None = None
    is_error: bool | None = None
```

### Message Classes

| Class | Description | Key Fields |
|-------|-------------|------------|
| `UserMessage` | User input | `content`, `uuid`, `parent_tool_use_id` |
| `AssistantMessage` | Claude response | `content`, `model`, `error` |
| `SystemMessage` | System notifications | `subtype`, `data` |
| `ResultMessage` | Final result | `duration_ms`, `total_cost_usd`, `usage` |
| `StreamEvent` | Raw API events | `uuid`, `session_id`, `event` |

---

## Configuration: ClaudeAgentOptions

The main configuration dataclass controls SDK behavior:

```python
@dataclass
class ClaudeAgentOptions:
    # Tool Configuration
    tools: list[str] | ToolsPreset | None = None
    allowed_tools: list[str] = field(default_factory=list)
    disallowed_tools: list[str] = field(default_factory=list)

    # Prompt & Model
    system_prompt: str | SystemPromptPreset | None = None
    model: str | None = None
    fallback_model: str | None = None

    # MCP Servers
    mcp_servers: dict[str, McpServerConfig] | str | Path = field(default_factory=dict)

    # Permissions & Safety
    permission_mode: PermissionMode | None = None  # 'default'|'acceptEdits'|'plan'|'bypassPermissions'
    can_use_tool: CanUseTool | None = None  # Custom permission callback

    # Execution Control
    max_turns: int | None = None
    max_budget_usd: float | None = None
    continue_conversation: bool = False

    # Hooks
    hooks: dict[HookEvent, list[HookMatcher]] | None = None

    # Environment
    cwd: str | Path | None = None
    env: dict[str, str] = field(default_factory=dict)
    cli_path: str | Path | None = None

    # Advanced
    sandbox: SandboxSettings | None = None
    enable_file_checkpointing: bool = False
    max_thinking_tokens: int | None = None
    output_format: dict[str, Any] | None = None
```

### Permission Modes

| Mode | Description |
|------|-------------|
| `default` | Prompt for dangerous operations |
| `acceptEdits` | Auto-accept file edits |
| `plan` | Planning mode only |
| `bypassPermissions` | Skip all permission checks |

---

## Hook System

### Supported Hook Events

| Event | Trigger Point |
|-------|---------------|
| `PreToolUse` | Before tool execution |
| `PostToolUse` | After tool execution |
| `UserPromptSubmit` | Before user prompt processing |
| `Stop` | When stop button pressed |
| `SubagentStop` | When subagent stops |
| `PreCompact` | Before context compaction |

### Hook Callback Signature

```python
async def hook_callback(
    input_data: HookInput,
    tool_use_id: str | None,
    context: HookContext
) -> SyncHookJSONOutput:
```

### Hook Response Format

```python
class SyncHookJSONOutput(TypedDict):
    continue_: NotRequired[bool]  # Maps to "continue" in CLI
    suppressOutput: NotRequired[bool]
    stopReason: NotRequired[str]
    decision: NotRequired[Literal["block"]]
    systemMessage: NotRequired[str]
    reason: NotRequired[str]
    hookSpecificOutput: NotRequired[HookSpecificOutput]
```

### Example: PreToolUse Hook

```python
async def check_bash_command(input_data, tool_use_id, context):
    if input_data["tool_name"] != "Bash":
        return {}

    command = input_data["tool_input"].get("command", "")
    if "rm -rf" in command:
        return {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": "Dangerous command blocked",
            }
        }
    return {}

options = ClaudeAgentOptions(
    allowed_tools=["Bash"],
    hooks={
        "PreToolUse": [
            HookMatcher(matcher="Bash", hooks=[check_bash_command]),
        ],
    }
)
```

---

## In-Process MCP Servers

### Custom Tool Registration

The SDK allows defining Python functions as MCP tools:

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions

# Define tool with decorator
@tool("add", "Add two numbers", {"a": float, "b": float})
async def add_numbers(args: dict[str, Any]) -> dict[str, Any]:
    result = args["a"] + args["b"]
    return {
        "content": [{"type": "text", "text": f"{args['a']} + {args['b']} = {result}"}]
    }

# Create MCP server
calculator = create_sdk_mcp_server(
    name="calculator",
    version="2.0.0",
    tools=[add_numbers]
)

# Configure options
options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__add"]
)
```

### Benefits Over External MCP Servers

| Aspect | In-Process | External Process |
|--------|------------|------------------|
| Startup | Immediate | Process spawn delay |
| IPC overhead | None | JSON serialization |
| Debugging | Same process | Multi-process debugging |
| Deployment | Single binary | Multiple processes |

---

## Claude Code Handling

### How Claude Code Processes SDK Requests

When Claude Code receives SDK messages, it processes them through the transport layer:

```
SDK Client                    Transport Layer                  Agent Loop
    │                              │                               │
    │ JSON message via stdin       │                               │
    │─────────────────────────────>│                               │
    │                              │                               │
    │                              │ read() async generator        │
    │                              │ processLine()                 │
    │                              │ validateSDKMessage (gf5)      │
    │                              │─────────────────────────────>│
    │                              │                               │
    │                              │                               │ Execute tools
    │                              │                               │ Call LLM API
    │                              │                               │
    │                              │<─────────────────────────────│
    │                              │ stream_event messages         │
    │<─────────────────────────────│ write() to stdout            │
    │                              │                               │
```

### Environment Variables Set by SDK

| Variable | Value | Purpose |
|----------|-------|---------|
| `CLAUDE_CODE_ENTRYPOINT` | `sdk-py` | Identifies Python SDK |
| `ANTHROPIC_API_KEY` | (from SDK) | API authentication |

---

## Error Handling

### SDK Exception Hierarchy

```
ClaudeSDKError                    # Base exception
├── CLIConnectionError            # Connection failed
│   └── CLINotFoundError         # Claude Code not installed
├── ProcessError                  # CLI process failed
├── CLIJSONDecodeError           # JSON parsing error
└── MessageParseError            # Message parsing error
```

### Example Error Handling

```python
from claude_agent_sdk import query, CLINotFoundError, ProcessError

try:
    async for message in query(prompt="Hello"):
        pass
except CLINotFoundError:
    print("Install Claude Code: curl -fsSL https://claude.ai/install.sh | bash")
except ProcessError as e:
    print(f"Process failed with exit code {e.exit_code}")
    print(f"Error output: {e.stderr}")
```

---

## Transport Layer

### SubprocessCLITransport

The default transport spawns Claude Code as a subprocess:

```python
class Transport(ABC):
    @abstractmethod
    async def connect(self) -> None: ...

    @abstractmethod
    async def write(self, data: str) -> None: ...

    @abstractmethod
    def read_messages(self) -> AsyncIterator[dict[str, Any]]: ...

    @abstractmethod
    async def close(self) -> None: ...
```

**Implementation Details:**
- Spawns `claude` CLI with appropriate flags
- Writes JSON + newline to stdin
- Reads JSON-lines from stdout
- Handles process lifecycle and cleanup

---

## Advanced Features

### File Checkpointing

```python
options = ClaudeAgentOptions(
    enable_file_checkpointing=True,
)

async with ClaudeSDKClient(options) as client:
    await client.query("Make some file changes")

    async for msg in client.receive_response():
        if isinstance(msg, UserMessage) and msg.uuid:
            checkpoint_id = msg.uuid  # Save for later

    # Later: restore file state
    await client.rewind_files(checkpoint_id)
```

### Extended Thinking

```python
options = ClaudeAgentOptions(
    max_thinking_tokens=8000  # Enable extended thinking
)

async for msg in query(prompt="Complex problem...", options=options):
    if isinstance(msg, AssistantMessage):
        for block in msg.content:
            if isinstance(block, ThinkingBlock):
                print(f"Thinking: {block.thinking}")
```

### Structured Output

```python
options = ClaudeAgentOptions(
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "answer": {"type": "string"},
                "confidence": {"type": "number"}
            },
            "required": ["answer", "confidence"]
        }
    }
)
```

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [message_protocol.md](./message_protocol.md) - Message format details
- [control_protocol.md](./control_protocol.md) - Control request/response
- [integration_patterns.md](./integration_patterns.md) - Best practices
