# SDK Integration Patterns

> Practical patterns, best practices, and error handling for SDK integration.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

---

## Pattern 1: Simple One-Shot Query

### Use Case
- Single question-answer interaction
- Batch processing of independent prompts
- CI/CD automation scripts

### Implementation

```python
from claude_agent_sdk import query, AssistantMessage, TextBlock

async def simple_query(prompt: str) -> str:
    """Execute a simple one-shot query."""
    result = []

    async for message in query(prompt=prompt):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    result.append(block.text)

    return "".join(result)

# Usage
answer = await simple_query("What is the capital of France?")
print(answer)
```

### Claude Code Handling

```
SDK Client                    Claude Code
    │                              │
    │ spawn process                │
    │ CLAUDE_CODE_ENTRYPOINT=sdk-py│
    │─────────────────────────────>│
    │                              │
    │ {"type": "user", ...}        │
    │─────────────────────────────>│
    │                              │ validateSDKMessage
    │                              │ Agent loop execution
    │                              │
    │ {"type": "stream_event"} × N │
    │<─────────────────────────────│
    │                              │
    │ {"type": "result", ...}      │
    │<─────────────────────────────│
    │                              │
    │ close stdin                  │
    │─────────────────────────────>│
    │                              │ process exit
```

---

## Pattern 2: Interactive Streaming Session

### Use Case
- Multi-turn conversations
- Context-dependent follow-ups
- Interactive applications

### Implementation

```python
from claude_agent_sdk import ClaudeSDKClient, AssistantMessage, TextBlock

async def interactive_session():
    """Run an interactive session with multiple turns."""
    async with ClaudeSDKClient() as client:
        # First turn
        await client.query("Explain Python decorators")
        async for msg in client.receive_response():
            if isinstance(msg, AssistantMessage):
                print_message(msg)

        # Follow-up (context preserved)
        await client.query("Show me a practical example")
        async for msg in client.receive_response():
            if isinstance(msg, AssistantMessage):
                print_message(msg)

        # Another follow-up
        await client.query("How about caching with decorators?")
        async for msg in client.receive_response():
            if isinstance(msg, AssistantMessage):
                print_message(msg)

def print_message(msg: AssistantMessage):
    for block in msg.content:
        if isinstance(block, TextBlock):
            print(block.text)
```

### Key Behaviors

| Aspect | Behavior |
|--------|----------|
| Context | Preserved across queries |
| Session | Single subprocess lifetime |
| Interruption | `await client.interrupt()` |
| Model switch | `await client.set_model("opus")` |

---

## Pattern 3: Custom Tool Registration

### Use Case
- Extend Claude with custom capabilities
- Domain-specific tools
- External API integration

### Implementation

```python
from claude_agent_sdk import (
    tool, create_sdk_mcp_server, query, ClaudeAgentOptions
)

# Define custom tools
@tool("fetch_weather", "Get current weather for a city", {"city": str})
async def fetch_weather(args: dict) -> dict:
    city = args["city"]
    # Call weather API...
    weather = await get_weather_api(city)
    return {
        "content": [{"type": "text", "text": f"Weather in {city}: {weather}"}]
    }

@tool("calculate", "Evaluate a math expression", {"expression": str})
async def calculate(args: dict) -> dict:
    expr = args["expression"]
    result = eval(expr)  # Be careful with eval in production!
    return {
        "content": [{"type": "text", "text": f"Result: {result}"}]
    }

# Create MCP server
custom_server = create_sdk_mcp_server(
    name="custom_tools",
    version="1.0.0",
    tools=[fetch_weather, calculate]
)

# Configure options
options = ClaudeAgentOptions(
    mcp_servers={"custom": custom_server},
    allowed_tools=[
        "mcp__custom__fetch_weather",
        "mcp__custom__calculate"
    ]
)

# Use with query
async for msg in query(
    prompt="What's the weather in Tokyo and what is 25 * 4?",
    options=options
):
    print(msg)
```

### Claude Code Handling

```
SDK Client                    Claude Code                    MCP Server
    │                              │                              │
    │ mcp_servers config           │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │                              │ Register in-process server   │
    │                              │──────────────────────────────>│
    │                              │                              │
    │ Query requiring tool         │                              │
    │─────────────────────────────>│                              │
    │                              │                              │
    │                              │ tools/list                   │
    │                              │──────────────────────────────>│
    │                              │                              │
    │                              │ tools/call fetch_weather     │
    │                              │──────────────────────────────>│
    │                              │                              │
    │                              │ tool result                  │
    │                              │<──────────────────────────────│
    │                              │                              │
```

---

## Pattern 4: Hook Integration

### Use Case
- Pre-execution validation
- Audit logging
- Custom permission logic
- Tool result modification

### Implementation

```python
from claude_agent_sdk import (
    query, ClaudeAgentOptions, HookMatcher
)

# PreToolUse hook - validate before execution
async def validate_bash_command(input_data, tool_use_id, context):
    if input_data["tool_name"] != "Bash":
        return {}

    command = input_data["tool_input"].get("command", "")

    # Block dangerous commands
    dangerous_patterns = ["rm -rf /", "sudo rm", "mkfs", "> /dev"]
    for pattern in dangerous_patterns:
        if pattern in command:
            return {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"Blocked: contains '{pattern}'"
                }
            }

    # Allow safe commands
    return {}

# PostToolUse hook - log execution
async def log_tool_execution(input_data, tool_use_id, context):
    tool_name = input_data["tool_name"]
    tool_input = input_data["tool_input"]
    tool_response = input_data.get("tool_response")

    print(f"[AUDIT] Tool: {tool_name}")
    print(f"[AUDIT] Input: {tool_input}")
    print(f"[AUDIT] Response: {tool_response}")

    return {}  # Don't modify behavior

# Configure hooks
options = ClaudeAgentOptions(
    allowed_tools=["Bash", "Read", "Write"],
    hooks={
        "PreToolUse": [
            HookMatcher(matcher="Bash", hooks=[validate_bash_command]),
        ],
        "PostToolUse": [
            HookMatcher(hooks=[log_tool_execution]),  # All tools
        ],
    }
)

# Use with query
async for msg in query(prompt="List files in current directory", options=options):
    print(msg)
```

### Hook Event Flow

```
Claude Code                                 SDK Client
    │                                           │
    │ Tool use decision                         │
    │                                           │
    │ control_request {PreToolUse}              │
    │──────────────────────────────────────────>│
    │                                           │
    │               ┌───────────────────────────┤
    │               │ validate_bash_command()   │
    │               └───────────────────────────┤
    │                                           │
    │ control_response {allow/deny}             │
    │<──────────────────────────────────────────│
    │                                           │
    │ Execute tool (if allowed)                 │
    │                                           │
    │ control_request {PostToolUse}             │
    │──────────────────────────────────────────>│
    │                                           │
    │               ┌───────────────────────────┤
    │               │ log_tool_execution()      │
    │               └───────────────────────────┤
    │                                           │
    │ control_response                          │
    │<──────────────────────────────────────────│
    │                                           │
```

---

## Error Handling Best Practices

### Connection Errors

```python
from claude_agent_sdk import (
    query, CLINotFoundError, CLIConnectionError, ProcessError
)

async def safe_query(prompt: str) -> str:
    try:
        result = []
        async for message in query(prompt=prompt):
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        result.append(block.text)
        return "".join(result)

    except CLINotFoundError:
        # Claude Code not installed
        return "Error: Claude Code not found. Install with: curl -fsSL https://claude.ai/install.sh | bash"

    except CLIConnectionError as e:
        # Connection issue
        return f"Error: Failed to connect to Claude Code: {e}"

    except ProcessError as e:
        # CLI process failed
        return f"Error: Process failed (exit code {e.exit_code}): {e.stderr}"

    except Exception as e:
        # Unexpected error
        return f"Error: Unexpected error: {e}"
```

### Timeout Handling

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient

async def query_with_timeout(prompt: str, timeout: float = 60.0):
    """Query with timeout protection."""
    async with ClaudeSDKClient() as client:
        await client.query(prompt)

        try:
            messages = []
            async for msg in asyncio.wait_for(
                collect_response(client),
                timeout=timeout
            ):
                messages.append(msg)
            return messages
        except asyncio.TimeoutError:
            await client.interrupt()
            raise TimeoutError(f"Query timed out after {timeout}s")

async def collect_response(client):
    """Collect all response messages."""
    async for msg in client.receive_response():
        yield msg
```

### Graceful Interruption

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient

async def interruptible_query(prompt: str):
    """Query that can be interrupted by user."""
    async with ClaudeSDKClient() as client:
        await client.query(prompt)

        # Run receiver and keyboard monitor concurrently
        async def receive():
            async for msg in client.receive_response():
                yield msg

        async def monitor_keyboard():
            # Platform-specific keyboard monitoring
            while True:
                if check_ctrl_c():
                    await client.interrupt()
                    break
                await asyncio.sleep(0.1)

        # Race between completion and interruption
        receiver = receive()
        monitor = asyncio.create_task(monitor_keyboard())

        try:
            async for msg in receiver:
                print_message(msg)
        finally:
            monitor.cancel()
```

---

## Performance Considerations

### Message Batching

For high-throughput scenarios, batch messages to reduce IPC overhead:

```python
async def batch_process(prompts: list[str]) -> list[str]:
    """Process multiple prompts in sequence."""
    results = []

    async with ClaudeSDKClient() as client:
        for prompt in prompts:
            await client.query(prompt)
            result = []
            async for msg in client.receive_response():
                if isinstance(msg, AssistantMessage):
                    for block in msg.content:
                        if isinstance(block, TextBlock):
                            result.append(block.text)
            results.append("".join(result))

    return results
```

### Buffer Management

For long-running sessions, be mindful of WebSocket buffer size (1000 messages):

```python
# For sessions exceeding buffer capacity,
# consider periodic checkpointing

options = ClaudeAgentOptions(
    enable_file_checkpointing=True,
)

async with ClaudeSDKClient(options) as client:
    checkpoints = []

    for i, task in enumerate(tasks):
        await client.query(task)

        async for msg in client.receive_response():
            if isinstance(msg, UserMessage) and msg.uuid:
                # Save checkpoint every 100 tasks
                if i % 100 == 0:
                    checkpoints.append(msg.uuid)
```

---

## Security Considerations

### Permission Mode Selection

| Mode | Risk Level | Use Case |
|------|------------|----------|
| `default` | Low | Interactive applications |
| `acceptEdits` | Medium | Trusted automation |
| `bypassPermissions` | High | Fully trusted environments only |

### Input Validation

```python
# Validate SDK inputs before sending to Claude Code
def validate_prompt(prompt: str) -> bool:
    if len(prompt) > 100000:
        raise ValueError("Prompt too long")
    if contains_injection_pattern(prompt):
        raise ValueError("Potential injection detected")
    return True

async def safe_query(prompt: str):
    validate_prompt(prompt)
    async for msg in query(prompt=prompt):
        yield msg
```

### Sandbox Configuration

```python
# Enable sandboxing for untrusted environments
options = ClaudeAgentOptions(
    sandbox={
        "enabled": True,
        "allow_network": False,
        "allow_filesystem": "read",
    },
    permission_mode="default"
)
```

---

## Testing Patterns

### Mock Transport

```python
class MockTransport:
    """Mock transport for testing."""

    def __init__(self, responses: list[dict]):
        self.responses = responses
        self.sent = []

    async def connect(self):
        pass

    async def write(self, data: str):
        self.sent.append(data)

    async def read_messages(self):
        for response in self.responses:
            yield response

    async def close(self):
        pass

# Usage in tests
async def test_simple_query():
    mock_transport = MockTransport([
        {"type": "assistant", "content": [{"type": "text", "text": "Paris"}]},
        {"type": "result", "is_error": False}
    ])

    async for msg in query(
        prompt="Capital of France?",
        transport=mock_transport
    ):
        assert "Paris" in str(msg)
```

---

## Summary

| Pattern | Use Case | Key Considerations |
|---------|----------|-------------------|
| One-shot query | Simple Q&A | Subprocess lifecycle |
| Interactive session | Multi-turn | Context preservation |
| Custom tools | Extension | MCP server setup |
| Hook integration | Control | Permission flow |

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [python_sdk_usage.md](./python_sdk_usage.md) - Python SDK interface
- [control_protocol.md](./control_protocol.md) - Control messages
- [websocket_resilience.md](./websocket_resilience.md) - Connection patterns
