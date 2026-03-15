
// @from(Ln 472829, Col 4)
ILq = `# Streaming — Python

## Quick Start

\`\`\`python
with client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a story"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

### Async

\`\`\`python
async with async_client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a story"}]
) as stream:
    async for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

---

## Handling Different Content Types

Claude may return text, thinking blocks, or tool use. Handle each appropriately:

> **Opus 4.6:** Use \`thinking: {type: "adaptive"}\`. On older models, use \`thinking: {type: "enabled", budget_tokens: N}\` instead.

\`\`\`python
with client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content": "Analyze this problem"}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("\\n[Thinking...]")
            elif event.content_block.type == "text":
                print("\\n[Response:]")

        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
\`\`\`

---

## Streaming with Tool Use

The Python tool runner currently returns complete messages. Use streaming for individual API calls within a manual loop if you need per-token streaming with tools:

\`\`\`python
with client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=4096,
    tools=tools,
    messages=messages
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

    response = stream.get_final_message()
    # Continue with tool execution if response.stop_reason == "tool_use"
\`\`\`

---

## Getting the Final Message

\`\`\`python
with client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

    # Get full message after streaming
    final_message = stream.get_final_message()
    print(f"\\n\\nTokens used: {final_message.usage.output_tokens}")
\`\`\`

---

## Streaming with Progress Updates

\`\`\`python
def stream_with_progress(client, **kwargs):
    """Stream a response with progress updates."""
    total_tokens = 0
    content_parts = []

    with client.messages.stream(**kwargs) as stream:
        for event in stream:
            if event.type == "content_block_delta":
                if event.delta.type == "text_delta":
                    text = event.delta.text
                    content_parts.append(text)
                    print(text, end="", flush=True)

            elif event.type == "message_delta":
                if event.usage and event.usage.output_tokens is not None:
                    total_tokens = event.usage.output_tokens

        final_message = stream.get_final_message()

    print(f"\\n\\n[Tokens used: {total_tokens}]")
    return "".join(content_parts)
\`\`\`

---

## Error Handling in Streams

\`\`\`python
try:
    with client.messages.stream(
        model="{{OPUS_ID}}",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Write a story"}]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
except anthropic.APIConnectionError:
    print("\\nConnection lost. Please retry.")
except anthropic.RateLimitError:
    print("\\nRate limited. Please wait and retry.")
except anthropic.APIStatusError as e:
    print(f"\\nAPI error: {e.status_code}")
\`\`\`

---

## Stream Event Types

| Event Type            | Description                 | When it fires                     |
| --------------------- | --------------------------- | --------------------------------- |
| \`message_start\`       | Contains message metadata   | Once at the beginning             |
| \`content_block_start\` | New content block beginning | When a text/tool_use block starts |
| \`content_block_delta\` | Incremental content update  | For each token/chunk              |
| \`content_block_stop\`  | Content block complete      | When a block finishes             |
| \`message_delta\`       | Message-level updates       | Contains \`stop_reason\`, usage     |
| \`message_stop\`        | Message complete            | Once at the end                   |

## Best Practices

1. **Always flush output** — Use \`flush=True\` to show tokens immediately
2. **Handle partial responses** — If the stream is interrupted, you may have incomplete content
3. **Track token usage** — The \`message_delta\` event contains usage information
4. **Use timeouts** — Set appropriate timeouts for your application
5. **Default to streaming** — Use \`.get_final_message()\` to get the complete response even when streaming, giving you timeout protection without needing to handle individual events
`
// @from(Ln 472992, Col 4)
CLq = () => {}
// @from(Ln 472993, Col 4)
xLq = `# Tool Use — Python

For conceptual overview (tool definitions, tool choice, tips), see [shared/tool-use-concepts.md](../../shared/tool-use-concepts.md).

## Tool Runner (Recommended)

**Beta:** The tool runner is in beta in the Python SDK.

Use the \`@beta_tool\` decorator to define tools as typed functions, then pass them to \`client.beta.messages.tool_runner()\`:

\`\`\`python
import anthropic
from anthropic import beta_tool

client = anthropic.Anthropic()

@beta_tool
def get_weather(location: str, unit: str = "celsius") -> str:
    """Get current weather for a location.

    Args:
        location: City and state, e.g., San Francisco, CA.
        unit: Temperature unit, either "celsius" or "fahrenheit".
    """
    # Your implementation here
    return f"72°F and sunny in {location}"

# The tool runner handles the agentic loop automatically
runner = client.beta.messages.tool_runner(
    model="{{OPUS_ID}}",
    max_tokens=4096,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
)

# Each iteration yields a BetaMessage; iteration stops when Claude is done
for message in runner:
    print(message)
\`\`\`

For async usage, use \`@beta_async_tool\` with \`async def\` functions.

**Key benefits of the tool runner:**

- No manual loop — the SDK handles calling tools and feeding results back
- Type-safe tool inputs via decorators
- Tool schemas are generated automatically from function signatures
- Iteration stops automatically when Claude has no more tool calls

---

## MCP Tool Conversion Helpers

**Beta.** Convert [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) tools, prompts, and resources to Anthropic API types for use with the tool runner. Requires \`pip install anthropic[mcp]\` (Python 3.10+).

> **Note:** The Claude API also supports an \`mcp_servers\` parameter that lets Claude connect directly to remote MCP servers. Use these helpers instead when you need local MCP servers, prompts, resources, or more control over the MCP connection.

### MCP Tools with Tool Runner

\`\`\`python
from anthropic import AsyncAnthropic
from anthropic.lib.tools.mcp import async_mcp_tool
from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters

client = AsyncAnthropic()

async with stdio_client(StdioServerParameters(command="mcp-server")) as (read, write):
    async with ClientSession(read, write) as mcp_client:
        await mcp_client.initialize()

        tools_result = await mcp_client.list_tools()
        # tool_runner is sync — returns the runner, not a coroutine
        runner = client.beta.messages.tool_runner(
            model="{{OPUS_ID}}",
            max_tokens=1024,
            messages=[{"role": "user", "content": "Use the available tools"}],
            tools=[async_mcp_tool(t, mcp_client) for t in tools_result.tools],
        )
        async for message in runner:
            print(message)
\`\`\`

For sync usage, use \`mcp_tool\` instead of \`async_mcp_tool\`.

### MCP Prompts

\`\`\`python
from anthropic.lib.tools.mcp import mcp_message

prompt = await mcp_client.get_prompt(name="my-prompt")
response = await client.beta.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[mcp_message(m) for m in prompt.messages],
)
\`\`\`

### MCP Resources as Content

\`\`\`python
from anthropic.lib.tools.mcp import mcp_resource_to_content

resource = await mcp_client.read_resource(uri="file:///path/to/doc.txt")
response = await client.beta.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            mcp_resource_to_content(resource),
            {"type": "text", "text": "Summarize this document"},
        ],
    }],
)
\`\`\`

### Upload MCP Resources as Files

\`\`\`python
from anthropic.lib.tools.mcp import mcp_resource_to_file

resource = await mcp_client.read_resource(uri="file:///path/to/data.json")
uploaded = await client.beta.files.upload(file=mcp_resource_to_file(resource))
\`\`\`

Conversion functions raise \`UnsupportedMCPValueError\` if an MCP value cannot be converted (e.g., unsupported content types like audio, unsupported MIME types).

---

## Manual Agentic Loop

Use this when you need fine-grained control over the loop (e.g., custom logging, conditional tool execution, human-in-the-loop approval):

\`\`\`python
import anthropic

client = anthropic.Anthropic()
tools = [...]  # Your tool definitions
messages = [{"role": "user", "content": user_input}]

# Agentic loop: keep going until Claude stops calling tools
while True:
    response = client.messages.create(
        model="{{OPUS_ID}}",
        max_tokens=4096,
        tools=tools,
        messages=messages
    )

    # If Claude is done (no more tool calls), break
    if response.stop_reason == "end_turn":
        break

    # Server-side tool hit iteration limit; re-send to continue
    if response.stop_reason == "pause_turn":
        messages = [
            {"role": "user", "content": user_input},
            {"role": "assistant", "content": response.content},
        ]
        continue

    # Extract tool use blocks from the response
    tool_use_blocks = [b for b in response.content if b.type == "tool_use"]

    # Append assistant's response (including tool_use blocks)
    messages.append({"role": "assistant", "content": response.content})

    # Execute each tool and collect results
    tool_results = []
    for tool in tool_use_blocks:
        result = execute_tool(tool.name, tool.input)  # Your implementation
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": tool.id,  # Must match the tool_use block's id
            "content": result
        })

    # Append tool results as a user message
    messages.append({"role": "user", "content": tool_results})

# Final response text
final_text = next(b.text for b in response.content if b.type == "text")
\`\`\`

---

## Handling Tool Results

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Paris?"}]
)

for block in response.content:
    if block.type == "tool_use":
        tool_name = block.name
        tool_input = block.input
        tool_use_id = block.id

        result = execute_tool(tool_name, tool_input)

        followup = client.messages.create(
            model="{{OPUS_ID}}",
            max_tokens=1024,
            tools=tools,
            messages=[
                {"role": "user", "content": "What's the weather in Paris?"},
                {"role": "assistant", "content": response.content},
                {
                    "role": "user",
                    "content": [{
                        "type": "tool_result",
                        "tool_use_id": tool_use_id,
                        "content": result
                    }]
                }
            ]
        )
\`\`\`

---

## Multiple Tool Calls

\`\`\`python
tool_results = []

for block in response.content:
    if block.type == "tool_use":
        result = execute_tool(block.name, block.input)
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": result
        })

# Send all results back at once
if tool_results:
    followup = client.messages.create(
        model="{{OPUS_ID}}",
        max_tokens=1024,
        tools=tools,
        messages=[
            *previous_messages,
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": tool_results}
        ]
    )
\`\`\`

---

## Error Handling in Tool Results

\`\`\`python
tool_result = {
    "type": "tool_result",
    "tool_use_id": tool_use_id,
    "content": "Error: Location 'xyz' not found. Please provide a valid city name.",
    "is_error": True
}
\`\`\`

---

## Tool Choice

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "get_weather"},  # Force specific tool
    messages=[{"role": "user", "content": "What's the weather in Paris?"}]
)
\`\`\`

---

## Code Execution

### Basic Usage

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20260120",
        "name": "code_execution"
    }]
)

for block in response.content:
    if block.type == "text":
        print(block.text)
    elif block.type == "bash_code_execution_tool_result":
        print(f"stdout: {block.content.stdout}")
\`\`\`

### Upload Files for Analysis

\`\`\`python
# 1. Upload a file
uploaded = client.beta.files.upload(file=open("sales_data.csv", "rb"))

# 2. Pass to code execution via container_upload block
# Code execution is GA; Files API is still beta (pass via extra_headers)
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=4096,
    extra_headers={"anthropic-beta": "files-api-2025-04-14"},
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this sales data. Show trends and create a visualization."},
            {"type": "container_upload", "file_id": uploaded.id}
        ]
    }],
    tools=[{"type": "code_execution_20260120", "name": "code_execution"}]
)
\`\`\`

### Retrieve Generated Files

\`\`\`python
import os

OUTPUT_DIR = "./claude_outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

for block in response.content:
    if block.type == "bash_code_execution_tool_result":
        result = block.content
        if result.type == "bash_code_execution_result" and result.content:
            for file_ref in result.content:
                if file_ref.type == "bash_code_execution_output":
                    metadata = client.beta.files.retrieve_metadata(file_ref.file_id)
                    file_content = client.beta.files.download(file_ref.file_id)
                    # Use basename to prevent path traversal; validate result
                    safe_name = os.path.basename(metadata.filename)
                    if not safe_name or safe_name in (".", ".."):
                        print(f"Skipping invalid filename: {metadata.filename}")
                        continue
                    output_path = os.path.join(OUTPUT_DIR, safe_name)
                    file_content.write_to_file(output_path)
                    print(f"Saved: {output_path}")
\`\`\`

### Container Reuse

\`\`\`python
# First request: set up environment
response1 = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Install tabulate and create data.json with sample data"}],
    tools=[{"type": "code_execution_20260120", "name": "code_execution"}]
)

# Get container ID from response
container_id = response1.container.id

# Second request: reuse the same container
response2 = client.messages.create(
    container=container_id,
    model="{{OPUS_ID}}",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Read data.json and display as a formatted table"}],
    tools=[{"type": "code_execution_20260120", "name": "code_execution"}]
)
\`\`\`

### Response Structure

\`\`\`python
for block in response.content:
    if block.type == "text":
        print(block.text)  # Claude's explanation
    elif block.type == "server_tool_use":
        print(f"Running: {block.name} - {block.input}")  # What Claude is doing
    elif block.type == "bash_code_execution_tool_result":
        result = block.content
        if result.type == "bash_code_execution_result":
            if result.return_code == 0:
                print(f"Output: {result.stdout}")
            else:
                print(f"Error: {result.stderr}")
        else:
            print(f"Tool error: {result.error_code}")
    elif block.type == "text_editor_code_execution_tool_result":
        print(f"File operation: {block.content}")
\`\`\`

---

## Memory Tool

### Basic Usage

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=2048,
    messages=[{"role": "user", "content": "Remember that my preferred language is Python."}],
    tools=[{"type": "memory_20250818", "name": "memory"}],
)
\`\`\`

### SDK Memory Helper

Subclass \`BetaAbstractMemoryTool\`:

\`\`\`python
from anthropic.lib.tools import BetaAbstractMemoryTool

class MyMemoryTool(BetaAbstractMemoryTool):
    def view(self, command): ...
    def create(self, command): ...
    def str_replace(self, command): ...
    def insert(self, command): ...
    def delete(self, command): ...
    def rename(self, command): ...

memory = MyMemoryTool()

# Use with tool runner
runner = client.beta.messages.tool_runner(
    model="{{OPUS_ID}}",
    max_tokens=2048,
    tools=[memory],
    messages=[{"role": "user", "content": "Remember my preferences"}],
)

for message in runner:
    print(message)
\`\`\`

For full implementation examples, use WebFetch:

- \`https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py\`

---

## Structured Outputs

### JSON Outputs (Pydantic — Recommended)

\`\`\`python
from pydantic import BaseModel
from typing import List
import anthropic

class ContactInfo(BaseModel):
    name: str
    email: str
    plan: str
    interests: List[str]
    demo_requested: bool

client = anthropic.Anthropic()

response = client.messages.parse(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Extract: Jane Doe (jane@co.com) wants Enterprise, interested in API and SDKs, wants a demo."
    }],
    output_format=ContactInfo,
)

# response.parsed_output is a validated ContactInfo instance
contact = response.parsed_output
print(contact.name)           # "Jane Doe"
print(contact.interests)      # ["API", "SDKs"]
\`\`\`

### Raw Schema

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Extract info: John Smith (john@example.com) wants the Enterprise plan."
    }],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "email": {"type": "string"},
                    "plan": {"type": "string"},
                    "demo_requested": {"type": "boolean"}
                },
                "required": ["name", "email", "plan", "demo_requested"],
                "additionalProperties": False
            }
        }
    }
)

import json
# output_config.format guarantees the first block is text with valid JSON
text = next(b.text for b in response.content if b.type == "text")
data = json.loads(text)
\`\`\`

### Strict Tool Use

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Book a flight to Tokyo for 2 passengers on March 15"}],
    tools=[{
        "name": "book_flight",
        "description": "Book a flight to a destination",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "date": {"type": "string", "format": "date"},
                "passengers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6, 7, 8]}
            },
            "required": ["destination", "date", "passengers"],
            "additionalProperties": False
        }
    }]
)
\`\`\`

### Using Both Together

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Plan a trip to Paris next month"}],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string"},
                    "next_steps": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["summary", "next_steps"],
                "additionalProperties": False
            }
        }
    },
    tools=[{
        "name": "search_flights",
        "description": "Search for available flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "date": {"type": "string", "format": "date"}
            },
            "required": ["destination", "date"],
            "additionalProperties": False
        }
    }]
)
\`\`\`
`
// @from(Ln 473584, Col 4)
bLq = () => {}
// @from(Ln 473585, Col 4)
mLq = `# Claude API — Ruby

> **Note:** The Ruby SDK supports the Claude API. A tool runner is available in beta via \`client.beta.messages.tool_runner()\`. Agent SDK is not yet available for Ruby.

## Installation

\`\`\`bash
gem install anthropic
\`\`\`

## Client Initialization

\`\`\`ruby
require "anthropic"

# Default (uses ANTHROPIC_API_KEY env var)
client = Anthropic::Client.new

# Explicit API key
client = Anthropic::Client.new(api_key: "your-api-key")
\`\`\`

---

## Basic Message Request

\`\`\`ruby
message = client.messages.create(
  model: :"{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "What is the capital of France?" }
  ]
)
# content is an array of polymorphic block objects (TextBlock, ThinkingBlock,
# ToolUseBlock, ...). .type is a Symbol — compare with :text, not "text".
# .text raises NoMethodError on non-TextBlock entries.
message.content.each do |block|
  puts block.text if block.type == :text
end
\`\`\`

---

## Streaming

\`\`\`ruby
stream = client.messages.stream(
  model: :"{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku" }]
)

stream.text.each { |text| print(text) }
\`\`\`

---

## Tool Use

The Ruby SDK supports tool use via raw JSON schema definitions and also provides a beta tool runner for automatic tool execution.

### Tool Runner (Beta)

\`\`\`ruby
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "City and state, e.g. San Francisco, CA"
end

class GetWeather < Anthropic::BaseTool
  doc "Get the current weather for a location"

  input_schema GetWeatherInput

  def call(input)
    "The weather in #{input.location} is sunny and 72°F."
  end
end

client.beta.messages.tool_runner(
  model: :"{{OPUS_ID}}",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }]
).each_message do |message|
  puts message.content
end
\`\`\`

### Manual Loop

See the [shared tool use concepts](../shared/tool-use-concepts.md) for the tool definition format and agentic loop pattern.
`
// @from(Ln 473678, Col 4)
uLq = () => {}
// @from(Ln 473679, Col 4)
gLq = "# HTTP Error Codes Reference\n\nThis file documents HTTP error codes returned by the Claude API, their common causes, and how to handle them. For language-specific error handling examples, see the `python/` or `typescript/` folders.\n\n## Error Code Summary\n\n| Code | Error Type              | Retryable | Common Cause                         |\n| ---- | ----------------------- | --------- | ------------------------------------ |\n| 400  | `invalid_request_error` | No        | Invalid request format or parameters |\n| 401  | `authentication_error`  | No        | Invalid or missing API key           |\n| 403  | `permission_error`      | No        | API key lacks permission             |\n| 404  | `not_found_error`       | No        | Invalid endpoint or model ID         |\n| 413  | `request_too_large`     | No        | Request exceeds size limits          |\n| 429  | `rate_limit_error`      | Yes       | Too many requests                    |\n| 500  | `api_error`             | Yes       | Anthropic service issue              |\n| 529  | `overloaded_error`      | Yes       | API is temporarily overloaded        |\n\n## Detailed Error Information\n\n### 400 Bad Request\n\n**Causes:**\n\n- Malformed JSON in request body\n- Missing required parameters (`model`, `max_tokens`, `messages`)\n- Invalid parameter types (e.g., string where integer expected)\n- Empty messages array\n- Messages not alternating user/assistant\n\n**Example error:**\n\n```json\n{\n  \"type\": \"error\",\n  \"error\": {\n    \"type\": \"invalid_request_error\",\n    \"message\": \"messages: roles must alternate between \\\"user\\\" and \\\"assistant\\\"\"\n  },\n  \"request_id\": \"req_011CSHoEeqs5C35K2UUqR7Fy\"\n}\n```\n\n**Fix:** Validate request structure before sending. Check that:\n\n- `model` is a valid model ID\n- `max_tokens` is a positive integer\n- `messages` array is non-empty and alternates correctly\n\n---\n\n### 401 Unauthorized\n\n**Causes:**\n\n- Missing `x-api-key` header or `Authorization` header\n- Invalid API key format\n- Revoked or deleted API key\n\n**Fix:** Ensure `ANTHROPIC_API_KEY` environment variable is set correctly.\n\n---\n\n### 403 Forbidden\n\n**Causes:**\n\n- API key doesn't have access to the requested model\n- Organization-level restrictions\n- Attempting to access beta features without beta access\n\n**Fix:** Check your API key permissions in the Console. You may need a different API key or to request access to specific features.\n\n---\n\n### 404 Not Found\n\n**Causes:**\n\n- Typo in model ID (e.g., `claude-sonnet-4.6` instead of `claude-sonnet-4-6`)\n- Using deprecated model ID\n- Invalid API endpoint\n\n**Fix:** Use exact model IDs from the models documentation. You can use aliases (e.g., `{{OPUS_ID}}`).\n\n---\n\n### 413 Request Too Large\n\n**Causes:**\n\n- Request body exceeds maximum size\n- Too many tokens in input\n- Image data too large\n\n**Fix:** Reduce input size — truncate conversation history, compress/resize images, or split large documents into chunks.\n\n---\n\n### 400 Validation Errors\n\nSome 400 errors are specifically related to parameter validation:\n\n- `max_tokens` exceeds model's limit\n- Invalid `temperature` value (must be 0.0-1.0)\n- `budget_tokens` >= `max_tokens` in extended thinking\n- Invalid tool definition schema\n\n**Common mistake with extended thinking:**\n\n```\n# Wrong: budget_tokens must be < max_tokens\nthinking: budget_tokens=10000, max_tokens=1000  → Error!\n\n# Correct\nthinking: budget_tokens=10000, max_tokens=16000\n```\n\n---\n\n### 429 Rate Limited\n\n**Causes:**\n\n- Exceeded requests per minute (RPM)\n- Exceeded tokens per minute (TPM)\n- Exceeded tokens per day (TPD)\n\n**Headers to check:**\n\n- `retry-after`: Seconds to wait before retrying\n- `x-ratelimit-limit-*`: Your limits\n- `x-ratelimit-remaining-*`: Remaining quota\n\n**Fix:** The Anthropic SDKs automatically retry 429 and 5xx errors with exponential backoff (default: `max_retries=2`). For custom retry behavior, see the language-specific error handling examples.\n\n---\n\n### 500 Internal Server Error\n\n**Causes:**\n\n- Temporary Anthropic service issue\n- Bug in API processing\n\n**Fix:** Retry with exponential backoff. If persistent, check [status.anthropic.com](https://status.anthropic.com).\n\n---\n\n### 529 Overloaded\n\n**Causes:**\n\n- High API demand\n- Service capacity reached\n\n**Fix:** Retry with exponential backoff. Consider using a different model (Haiku is often less loaded), spreading requests over time, or implementing request queuing.\n\n---\n\n## Common Mistakes and Fixes\n\n| Mistake                         | Error            | Fix                                                     |\n| ------------------------------- | ---------------- | ------------------------------------------------------- |\n| `budget_tokens` >= `max_tokens` | 400              | Ensure `budget_tokens` < `max_tokens`                   |\n| Typo in model ID                | 404              | Use valid model ID like `{{OPUS_ID}}`               |\n| First message is `assistant`    | 400              | First message must be `user`                            |\n| Consecutive same-role messages  | 400              | Alternate `user` and `assistant`                        |\n| API key in code                 | 401 (leaked key) | Use environment variable                                |\n| Custom retry needs              | 429/5xx          | SDK retries automatically; customize with `max_retries` |\n\n## Typed Exceptions in SDKs\n\n**Always use the SDK's typed exception classes** instead of checking error messages with string matching. Each HTTP error code maps to a specific exception class:\n\n| HTTP Code | TypeScript Class                  | Python Class                      |\n| --------- | --------------------------------- | --------------------------------- |\n| 400       | `Anthropic.BadRequestError`       | `anthropic.BadRequestError`       |\n| 401       | `Anthropic.AuthenticationError`   | `anthropic.AuthenticationError`   |\n| 403       | `Anthropic.PermissionDeniedError` | `anthropic.PermissionDeniedError` |\n| 404       | `Anthropic.NotFoundError`         | `anthropic.NotFoundError`         |\n| 429       | `Anthropic.RateLimitError`        | `anthropic.RateLimitError`        |\n| 500+      | `Anthropic.InternalServerError`   | `anthropic.InternalServerError`   |\n| Any       | `Anthropic.APIError`              | `anthropic.APIError`              |\n\n```typescript\n// ✅ Correct: use typed exceptions\ntry {\n  const response = await client.messages.create({...});\n} catch (error) {\n  if (error instanceof Anthropic.RateLimitError) {\n    // Handle rate limiting\n  } else if (error instanceof Anthropic.APIError) {\n    console.error(`API error ${error.status}:`, error.message);\n  }\n}\n\n// ❌ Wrong: don't check error messages with string matching\ntry {\n  const response = await client.messages.create({...});\n} catch (error) {\n  const msg = error instanceof Error ? error.message : String(error);\n  if (msg.includes(\"429\") || msg.includes(\"rate_limit\")) { ... }\n}\n```\n\nAll exception classes extend `Anthropic.APIError`, which has a `status` property. Use `instanceof` checks from most specific to least specific (e.g., check `RateLimitError` before `APIError`).\n"
// @from(Ln 473680, Col 4)
BLq = () => {}
// @from(Ln 473681, Col 4)
pLq = `# Live Documentation Sources

This file contains WebFetch URLs for fetching current information from platform.claude.com and Agent SDK repositories. Use these when users need the latest data that may have changed since the cached content was last updated.

## When to Use WebFetch

- User explicitly asks for "latest" or "current" information
- Cached data seems incorrect
- User asks about features not covered in cached content
- User needs specific API details or examples

## Claude API Documentation URLs

### Models & Pricing

| Topic           | URL                                                                   | Extraction Prompt                                                               |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Models Overview | \`https://platform.claude.com/docs/en/about-claude/models/overview.md\` | "Extract current model IDs, context windows, and pricing for all Claude models" |
| Pricing         | \`https://platform.claude.com/docs/en/pricing.md\`                      | "Extract current pricing per million tokens for input and output"               |

### Core Features

| Topic             | URL                                                                          | Extraction Prompt                                                                      |
| ----------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Extended Thinking | \`https://platform.claude.com/docs/en/build-with-claude/extended-thinking.md\` | "Extract extended thinking parameters, budget_tokens requirements, and usage examples" |
| Adaptive Thinking | \`https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking.md\` | "Extract adaptive thinking setup, effort levels, and {{OPUS_NAME}} usage examples"         |
| Effort Parameter  | \`https://platform.claude.com/docs/en/build-with-claude/effort.md\`            | "Extract effort levels, cost-quality tradeoffs, and interaction with thinking"        |
| Tool Use          | \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview.md\`  | "Extract tool definition schema, tool_choice options, and handling tool results"       |
| Streaming         | \`https://platform.claude.com/docs/en/build-with-claude/streaming.md\`         | "Extract streaming event types, SDK examples, and best practices"                      |
| Prompt Caching    | \`https://platform.claude.com/docs/en/build-with-claude/prompt-caching.md\`    | "Extract cache_control usage, pricing benefits, and implementation examples"           |

### Media & Files

| Topic       | URL                                                                    | Extraction Prompt                                                 |
| ----------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Vision      | \`https://platform.claude.com/docs/en/build-with-claude/vision.md\`      | "Extract supported image formats, size limits, and code examples" |
| PDF Support | \`https://platform.claude.com/docs/en/build-with-claude/pdf-support.md\` | "Extract PDF handling capabilities, limits, and examples"         |

### API Operations

| Topic            | URL                                                                         | Extraction Prompt                                                                                       |
| ---------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Batch Processing | \`https://platform.claude.com/docs/en/build-with-claude/batch-processing.md\` | "Extract batch API endpoints, request format, and polling for results"                                  |
| Files API        | \`https://platform.claude.com/docs/en/build-with-claude/files.md\`            | "Extract file upload, download, and referencing in messages, including supported types and beta header" |
| Token Counting   | \`https://platform.claude.com/docs/en/build-with-claude/token-counting.md\`   | "Extract token counting API usage and examples"                                                         |
| Rate Limits      | \`https://platform.claude.com/docs/en/api/rate-limits.md\`                    | "Extract current rate limits by tier and model"                                                         |
| Errors           | \`https://platform.claude.com/docs/en/api/errors.md\`                         | "Extract HTTP error codes, meanings, and retry guidance"                                                |

### Tools

| Topic          | URL                                                                                    | Extraction Prompt                                                                        |
| -------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Code Execution | \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool.md\` | "Extract code execution tool setup, file upload, container reuse, and response handling" |
| Computer Use   | \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use.md\`        | "Extract computer use tool setup, capabilities, and implementation examples"             |

### Advanced Features

| Topic              | URL                                                                           | Extraction Prompt                                   |
| ------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| Structured Outputs | \`https://platform.claude.com/docs/en/build-with-claude/structured-outputs.md\` | "Extract output_config.format usage and schema enforcement"                           |
| Compaction         | \`https://platform.claude.com/docs/en/build-with-claude/compaction.md\`         | "Extract compaction setup, trigger config, and streaming with compaction"             |
| Citations          | \`https://platform.claude.com/docs/en/build-with-claude/citations.md\`          | "Extract citation format and implementation"        |
| Context Windows    | \`https://platform.claude.com/docs/en/build-with-claude/context-windows.md\`    | "Extract context window sizes and token management" |

---

## Claude API SDK Repositories

| SDK        | URL                                                       | Description                    |
| ---------- | --------------------------------------------------------- | ------------------------------ |
| Python     | \`https://github.com/anthropics/anthropic-sdk-python\`     | \`anthropic\` pip package source |
| TypeScript | \`https://github.com/anthropics/anthropic-sdk-typescript\` | \`@anthropic-ai/sdk\` npm source |
| Java       | \`https://github.com/anthropics/anthropic-sdk-java\`       | \`anthropic-java\` Maven source  |
| Go         | \`https://github.com/anthropics/anthropic-sdk-go\`         | Go module source               |
| Ruby       | \`https://github.com/anthropics/anthropic-sdk-ruby\`       | \`anthropic\` gem source         |
| C#         | \`https://github.com/anthropics/anthropic-sdk-csharp\`     | NuGet package source           |
| PHP        | \`https://github.com/anthropics/anthropic-sdk-php\`        | Composer package source        |

---

## Agent SDK Documentation URLs

### Core Documentation

| Topic                | URL                                                         | Extraction Prompt                                               |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| Agent SDK Overview   | \`https://platform.claude.com/docs/en/agent-sdk.md\`          | "Extract the Agent SDK overview, key features, and use cases"   |
| Agent SDK Python     | \`https://github.com/anthropics/claude-agent-sdk-python\`     | "Extract Python SDK installation, imports, and basic usage"     |
| Agent SDK TypeScript | \`https://github.com/anthropics/claude-agent-sdk-typescript\` | "Extract TypeScript SDK installation, imports, and basic usage" |

### SDK Reference (GitHub READMEs)

| Topic          | URL                                                                                       | Extraction Prompt                                            |
| -------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Python SDK     | \`https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/README.md\`     | "Extract Python SDK API reference, classes, and methods"     |
| TypeScript SDK | \`https://raw.githubusercontent.com/anthropics/claude-agent-sdk-typescript/main/README.md\` | "Extract TypeScript SDK API reference, types, and functions" |

### npm/PyPI Packages

| Package                             | URL                                                            | Description               |
| ----------------------------------- | -------------------------------------------------------------- | ------------------------- |
| claude-agent-sdk (Python)           | \`https://pypi.org/project/claude-agent-sdk/\`                   | Python package on PyPI    |
| @anthropic-ai/claude-agent-sdk (TS) | \`https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk\` | TypeScript package on npm |

### GitHub Repositories

| Resource       | URL                                                         | Description                         |
| -------------- | ----------------------------------------------------------- | ----------------------------------- |
| Python SDK     | \`https://github.com/anthropics/claude-agent-sdk-python\`     | Python package source               |
| TypeScript SDK | \`https://github.com/anthropics/claude-agent-sdk-typescript\` | TypeScript/Node.js package source   |
| MCP Servers    | \`https://github.com/modelcontextprotocol\`                   | Official MCP server implementations |

---

## Fallback Strategy

If WebFetch fails (network issues, URL changed):

1. Use cached content from the language-specific files (note the cache date)
2. Inform user the data may be outdated
3. Suggest they check platform.claude.com or the GitHub repos directly
`
// @from(Ln 473803, Col 4)
FLq = () => {}
// @from(Ln 473804, Col 4)
ULq = `# Claude Model Catalog

**Only use exact model IDs listed in this file.** Never guess or construct model IDs — incorrect IDs will cause API errors. Use aliases wherever available. For the latest information, WebFetch the Models Overview URL in \`shared/live-sources.md\`.

## Current Models (recommended)

| Friendly Name     | Alias (use this)    | Full ID                       | Context        | Max Output | Status |
|-------------------|---------------------|-------------------------------|----------------|------------|--------|
| Claude Opus 4.6   | \`claude-opus-4-6\`   | —                             | 200K (1M beta) | 128K       | Active |
| Claude Sonnet 4.6 | \`claude-sonnet-4-6\` | -                             | 200K (1M beta) | 64K        | Active |
| Claude Haiku 4.5  | \`claude-haiku-4-5\`  | \`claude-haiku-4-5-20251001\`   | 200K           | 64K        | Active |

### Model Descriptions

- **Claude Opus 4.6** — Our most intelligent model for building agents and coding. Supports adaptive thinking (recommended), 128K max output tokens (requires streaming for large outputs). 1M context window available in beta via \`context-1m-2025-08-07\` header.
- **Claude Sonnet 4.6** — Our best combination of speed and intelligence. Supports adaptive thinking (recommended). 1M context window available in beta via \`context-1m-2025-08-07\` header. 64K max output tokens.
- **Claude Haiku 4.5** — Fastest and most cost-effective model for simple tasks.

## Legacy Models (still active)

| Friendly Name     | Alias (use this)    | Full ID                       | Status |
|-------------------|---------------------|-------------------------------|--------|
| Claude Opus 4.5   | \`claude-opus-4-5\`   | \`claude-opus-4-5-20251101\`    | Active |
| Claude Opus 4.1   | \`claude-opus-4-1\`   | \`claude-opus-4-1-20250805\`    | Active |
| Claude Sonnet 4.5 | \`claude-sonnet-4-5\` | \`claude-sonnet-4-5-20250929\`  | Active |
| Claude Sonnet 4   | \`claude-sonnet-4-0\` | \`claude-sonnet-4-20250514\`    | Active |
| Claude Opus 4     | \`claude-opus-4-0\`   | \`claude-opus-4-20250514\`      | Active |

## Deprecated Models (retiring soon)

| Friendly Name     | Alias (use this)    | Full ID                       | Status     | Retires      |
|-------------------|---------------------|-------------------------------|------------|--------------|
| Claude Haiku 3    | —                   | \`claude-3-haiku-20240307\`     | Deprecated | Apr 19, 2026 |

## Retired Models (no longer available)

| Friendly Name     | Full ID                       | Retired     |
|-------------------|-------------------------------|-------------|
| Claude Sonnet 3.7 | \`claude-3-7-sonnet-20250219\`  | Feb 19, 2026 |
| Claude Haiku 3.5  | \`claude-3-5-haiku-20241022\`   | Feb 19, 2026 |
| Claude Opus 3     | \`claude-3-opus-20240229\`      | Jan 5, 2026 |
| Claude Sonnet 3.5 | \`claude-3-5-sonnet-20241022\`  | Oct 28, 2025 |
| Claude Sonnet 3.5 | \`claude-3-5-sonnet-20240620\`  | Oct 28, 2025 |
| Claude Sonnet 3   | \`claude-3-sonnet-20240229\`    | Jul 21, 2025 |
| Claude 2.1        | \`claude-2.1\`                  | Jul 21, 2025 |
| Claude 2.0        | \`claude-2.0\`                  | Jul 21, 2025 |

## Resolving User Requests

When a user asks for a model by name, use this table to find the correct model ID:

| User says...                              | Use this model ID              |
|-------------------------------------------|--------------------------------|
| "opus", "most powerful"                   | \`claude-opus-4-6\`              |
| "opus 4.6"                                | \`claude-opus-4-6\`              |
| "opus 4.5"                                | \`claude-opus-4-5\`              |
| "opus 4.1"                                | \`claude-opus-4-1\`              |
| "opus 4", "opus 4.0"                      | \`claude-opus-4-0\`              |
| "sonnet", "balanced"                      | \`claude-sonnet-4-6\`            |
| "sonnet 4.6"                              | \`claude-sonnet-4-6\`            |
| "sonnet 4.5"                              | \`claude-sonnet-4-5\`            |
| "sonnet 4", "sonnet 4.0"                  | \`claude-sonnet-4-0\`            |
| "sonnet 3.7"                              | Retired — suggest \`claude-sonnet-4-5\` |
| "sonnet 3.5"                              | Retired — suggest \`claude-sonnet-4-5\` |
| "haiku", "fast", "cheap"                  | \`claude-haiku-4-5\`             |
| "haiku 4.5"                               | \`claude-haiku-4-5\`             |
| "haiku 3.5"                               | Retired — suggest \`claude-haiku-4-5\` |
| "haiku 3"                                 | Deprecated — suggest \`claude-haiku-4-5\` |
`
// @from(Ln 473873, Col 4)
QLq = () => {}
// @from(Ln 473874, Col 4)
cLq = `# Tool Use Concepts

This file covers the conceptual foundations of tool use with the Claude API. For language-specific code examples, see the \`python/\`, \`typescript/\`, or other language folders.

## User-Defined Tools

### Tool Definition Structure

> **Note:** When using the Tool Runner (beta), tool schemas are generated automatically from your function signatures (Python), Zod schemas (TypeScript), annotated classes (Java), \`jsonschema\` struct tags (Go), or \`BaseTool\` subclasses (Ruby). The raw JSON schema format below is for the manual approach or SDKs without tool runner support.

Each tool requires a name, description, and JSON Schema for its inputs:

\`\`\`json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and state, e.g., San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit"
      }
    },
    "required": ["location"]
  }
}
\`\`\`

**Best practices for tool definitions:**

- Use clear, descriptive names (e.g., \`get_weather\`, \`search_database\`, \`send_email\`)
- Write detailed descriptions — Claude uses these to decide when to use the tool
- Include descriptions for each property
- Use \`enum\` for parameters with a fixed set of values
- Mark truly required parameters in \`required\`; make others optional with defaults

---

### Tool Choice Options

Control when Claude uses tools:

| Value                             | Behavior                                      |
| --------------------------------- | --------------------------------------------- |
| \`{"type": "auto"}\`                | Claude decides whether to use tools (default) |
| \`{"type": "any"}\`                 | Claude must use at least one tool             |
| \`{"type": "tool", "name": "..."}\` | Claude must use the specified tool            |
| \`{"type": "none"}\`                | Claude cannot use tools                       |

Any \`tool_choice\` value can also include \`"disable_parallel_tool_use": true\` to force Claude to use at most one tool per response. By default, Claude may request multiple tool calls in a single response.

---

### Tool Runner vs Manual Loop

**Tool Runner (Recommended):** The SDK's tool runner handles the agentic loop automatically — it calls the API, detects tool use requests, executes your tool functions, feeds results back to Claude, and repeats until Claude stops calling tools. Available in Python, TypeScript, Java, Go, and Ruby SDKs (beta). The Python SDK also provides MCP conversion helpers (\`anthropic.lib.tools.mcp\`) to convert MCP tools, prompts, and resources for use with the tool runner — see \`python/claude-api/tool-use.md\` for details.

**Manual Agentic Loop:** Use when you need fine-grained control over the loop (e.g., custom logging, conditional tool execution, human-in-the-loop approval). Loop until \`stop_reason == "end_turn"\`, always append the full \`response.content\` to preserve tool_use blocks, and ensure each \`tool_result\` includes the matching \`tool_use_id\`.

**Stop reasons for server-side tools:** When using server-side tools (code execution, web search, etc.), the API runs a server-side sampling loop. If this loop reaches its default limit of 10 iterations, the response will have \`stop_reason: "pause_turn"\`. To continue, re-send the user message and assistant response and make another API request — the server will resume where it left off. Do NOT add an extra user message like "Continue." — the API detects the trailing \`server_tool_use\` block and knows to resume automatically.

\`\`\`python
# Handle pause_turn in your agentic loop
if response.stop_reason == "pause_turn":
    messages = [
        {"role": "user", "content": user_query},
        {"role": "assistant", "content": response.content},
    ]
    # Make another API request — server resumes automatically
    response = client.messages.create(
        model="{{OPUS_ID}}", messages=messages, tools=tools
    )
\`\`\`

Set a \`max_continuations\` limit (e.g., 5) to prevent infinite loops. For the full guide, see: \`https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons\`

> **Security:** The tool runner executes your tool functions automatically whenever Claude requests them. For tools with side effects (sending emails, modifying databases, financial transactions), validate inputs within your tool functions and consider requiring confirmation for destructive operations. Use the manual agentic loop if you need human-in-the-loop approval before each tool execution.

---

### Handling Tool Results

When Claude uses a tool, the response contains a \`tool_use\` block. You must:

1. Execute the tool with the provided input
2. Send the result back in a \`tool_result\` message
3. Continue the conversation

**Error handling in tool results:** When a tool execution fails, set \`"is_error": true\` and provide an informative error message. Claude will typically acknowledge the error and either try a different approach or ask for clarification.

**Multiple tool calls:** Claude can request multiple tools in a single response. Handle them all before continuing — send all results back in a single \`user\` message.

---

## Server-Side Tools: Code Execution

The code execution tool lets Claude run code in a secure, sandboxed container. Unlike user-defined tools, server-side tools run on Anthropic's infrastructure — you don't execute anything client-side. Just include the tool definition and Claude handles the rest.

### Key Facts

- Runs in an isolated container (1 CPU, 5 GiB RAM, 5 GiB disk)
- No internet access (fully sandboxed)
- Python 3.11 with data science libraries pre-installed
- Containers persist for 30 days and can be reused across requests
- Free when used with web search/web fetch tools; otherwise $0.05/hour after 1,550 free hours/month per organization

### Tool Definition

The tool requires no schema — just declare it in the \`tools\` array:

\`\`\`json
{
  "type": "code_execution_20260120",
  "name": "code_execution"
}
\`\`\`

Claude automatically gains access to \`bash_code_execution\` (run shell commands) and \`text_editor_code_execution\` (create/view/edit files).

### Pre-installed Python Libraries

- **Data science**: pandas, numpy, scipy, scikit-learn, statsmodels
- **Visualization**: matplotlib, seaborn
- **File processing**: openpyxl, xlsxwriter, pillow, pypdf, pdfplumber, python-docx, python-pptx
- **Math**: sympy, mpmath
- **Utilities**: tqdm, python-dateutil, pytz, sqlite3

Additional packages can be installed at runtime via \`pip install\`.

### Supported File Types for Upload

| Type   | Extensions                         |
| ------ | ---------------------------------- |
| Data   | CSV, Excel (.xlsx/.xls), JSON, XML |
| Images | JPEG, PNG, GIF, WebP               |
| Text   | .txt, .md, .py, .js, etc.          |

### Container Reuse

Reuse containers across requests to maintain state (files, installed packages, variables). Extract the \`container_id\` from the first response and pass it to subsequent requests.

### Response Structure

The response contains interleaved text and tool result blocks:

- \`text\` — Claude's explanation
- \`server_tool_use\` — What Claude is doing
- \`bash_code_execution_tool_result\` — Code execution output (check \`return_code\` for success/failure)
- \`text_editor_code_execution_tool_result\` — File operation results

> **Security:** Always sanitize filenames with \`os.path.basename()\` / \`path.basename()\` before writing downloaded files to disk to prevent path traversal attacks. Write files to a dedicated output directory.

---

## Server-Side Tools: Web Search and Web Fetch

Web search and web fetch let Claude search the web and retrieve page content. They run server-side — just include the tool definitions and Claude handles queries, fetching, and result processing automatically.

### Tool Definitions

\`\`\`json
[
  { "type": "web_search_20260209", "name": "web_search" },
  { "type": "web_fetch_20260209", "name": "web_fetch" }
]
\`\`\`

### Dynamic Filtering (Opus 4.6 / Sonnet 4.6)

The \`web_search_20260209\` and \`web_fetch_20260209\` versions support **dynamic filtering** — Claude writes and executes code to filter search results before they reach the context window, improving accuracy and token efficiency. Dynamic filtering is built into these tool versions and activates automatically; you do not need to separately declare the \`code_execution\` tool or pass any beta header.

\`\`\`json
{
  "tools": [
    { "type": "web_search_20260209", "name": "web_search" },
    { "type": "web_fetch_20260209", "name": "web_fetch" }
  ]
}
\`\`\`

Without dynamic filtering, the previous \`web_search_20250305\` version is also available.

> **Note:** Only include the standalone \`code_execution\` tool when your application needs code execution for its own purposes (data analysis, file processing, visualization) independent of web search. Including it alongside \`_20260209\` web tools creates a second execution environment that can confuse the model.

---

## Server-Side Tools: Programmatic Tool Calling

Programmatic tool calling lets Claude execute complex multi-tool workflows in code, keeping intermediate results out of the context window. Claude writes code that calls your tools directly, reducing token usage for multi-step operations.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling\`

---

## Server-Side Tools: Tool Search

The tool search tool lets Claude dynamically discover tools from large libraries without loading all definitions into the context window. Useful when you have many tools but only a few are relevant to any given query.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool\`

---

## Tool Use Examples

You can provide sample tool calls directly in your tool definitions to demonstrate usage patterns and reduce parameter errors. This helps Claude understand how to correctly format tool inputs, especially for tools with complex schemas.

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use\`

---

## Server-Side Tools: Computer Use

Computer use lets Claude interact with a desktop environment (screenshots, mouse, keyboard). It can be Anthropic-hosted (server-side, like code execution) or self-hosted (you provide the environment and execute actions client-side).

For full documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/computer-use/overview\`

---

## Client-Side Tools: Memory

The memory tool enables Claude to store and retrieve information across conversations through a memory file directory. Claude can create, read, update, and delete files that persist between sessions.

### Key Facts

- Client-side tool — you control storage via your implementation
- Supports commands: \`view\`, \`create\`, \`str_replace\`, \`insert\`, \`delete\`, \`rename\`
- Operates on files in a \`/memories\` directory
- The SDKs provide helper classes/functions for implementing the memory backend

> **Security:** Never store API keys, passwords, tokens, or other secrets in memory files. Be cautious with personally identifiable information (PII) — check data privacy regulations (GDPR, CCPA) before persisting user data. The reference implementations have no built-in access control; in multi-user systems, implement per-user memory directories and authentication in your tool handlers.

For full implementation examples, use WebFetch:

- Docs: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool.md\`

---

## Structured Outputs

Structured outputs constrain Claude's responses to follow a specific JSON schema, guaranteeing valid, parseable output. This is not a separate tool — it enhances the Messages API response format and/or tool parameter validation.

Two features are available:

- **JSON outputs** (\`output_config.format\`): Control Claude's response format
- **Strict tool use** (\`strict: true\`): Guarantee valid tool parameter schemas

**Supported models:** {{OPUS_NAME}}, {{SONNET_NAME}}, and {{HAIKU_NAME}}. Legacy models (Claude Opus 4.5, Claude Opus 4.1) also support structured outputs.

> **Recommended:** Use \`client.messages.parse()\` which automatically validates responses against your schema. When using \`messages.create()\` directly, use \`output_config: {format: {...}}\`. The \`output_format\` convenience parameter is also accepted by some SDK methods (e.g., \`.parse()\`), but \`output_config.format\` is the canonical API-level parameter.

### JSON Schema Limitations

**Supported:**

- Basic types: object, array, string, integer, number, boolean, null
- \`enum\`, \`const\`, \`anyOf\`, \`allOf\`, \`$ref\`/\`$def\`
- String formats: \`date-time\`, \`time\`, \`date\`, \`duration\`, \`email\`, \`hostname\`, \`uri\`, \`ipv4\`, \`ipv6\`, \`uuid\`
- \`additionalProperties: false\` (required for all objects)

**Not supported:**

- Recursive schemas
- Numerical constraints (\`minimum\`, \`maximum\`, \`multipleOf\`)
- String constraints (\`minLength\`, \`maxLength\`)
- Complex array constraints
- \`additionalProperties\` set to anything other than \`false\`

The Python and TypeScript SDKs automatically handle unsupported constraints by removing them from the schema sent to the API and validating them client-side.

### Important Notes

- **First request latency**: New schemas incur a one-time compilation cost. Subsequent requests with the same schema use a 24-hour cache.
- **Refusals**: If Claude refuses for safety reasons (\`stop_reason: "refusal"\`), the output may not match your schema.
- **Token limits**: If \`stop_reason: "max_tokens"\`, output may be incomplete. Increase \`max_tokens\`.
- **Incompatible with**: Citations (returns 400 error), message prefilling.
- **Works with**: Batches API, streaming, token counting, extended thinking.

---

## Tips for Effective Tool Use

1. **Provide detailed descriptions**: Claude relies heavily on descriptions to understand when and how to use tools
2. **Use specific tool names**: \`get_current_weather\` is better than \`weather\`
3. **Validate inputs**: Always validate tool inputs before execution
4. **Handle errors gracefully**: Return informative error messages so Claude can adapt
5. **Limit tool count**: Too many tools can confuse the model — keep the set focused
6. **Test tool interactions**: Verify Claude uses tools correctly in various scenarios

For detailed tool use documentation, use WebFetch:

- URL: \`https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview\`
`
// @from(Ln 474180, Col 4)
dLq = () => {}
// @from(Ln 474181, Col 4)
iLq = `# Agent SDK — TypeScript

The Claude Agent SDK provides a higher-level interface for building AI agents with built-in tools, safety features, and agentic capabilities.

## Installation

\`\`\`bash
npm install @anthropic-ai/claude-agent-sdk
\`\`\`

---

## Quick Start

\`\`\`typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Explain this codebase",
  options: { allowedTools: ["Read", "Glob", "Grep"] },
})) {
  if ("result" in message) {
    console.log(message.result);
  }
}
\`\`\`

---

## Built-in Tools

| Tool      | Description                          |
| --------- | ------------------------------------ |
| Read      | Read files in the workspace          |
| Write     | Create new files                     |
| Edit      | Make precise edits to existing files |
| Bash      | Execute shell commands               |
| Glob      | Find files by pattern                |
| Grep      | Search files by content              |
| WebSearch | Search the web for information       |
| WebFetch        | Fetch and analyze web pages          |
| AskUserQuestion | Ask user clarifying questions         |
| Agent           | Spawn subagents                      |

---

## Permission System

\`\`\`typescript
for await (const message of query({
  prompt: "Refactor the authentication module",
  options: {
    allowedTools: ["Read", "Edit", "Write"],
    permissionMode: "acceptEdits",
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

Permission modes:

- \`"default"\`: Prompt for dangerous operations
- \`"plan"\`: Planning only, no execution
- \`"acceptEdits"\`: Auto-accept file edits
- \`"dontAsk"\`: Don't prompt — **denies** anything not pre-approved (not an auto-approve mode)
- \`"bypassPermissions"\`: Skip all prompts (requires \`allowDangerouslySkipPermissions: true\` in options)

---

## MCP (Model Context Protocol) Support

\`\`\`typescript
for await (const message of query({
  prompt: "Open example.com and describe what you see",
  options: {
    mcpServers: {
      playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
    },
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

### In-Process MCP Tools

You can define custom tools that run in-process using \`tool()\` and \`createSdkMcpServer\`:

\`\`\`typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const myTool = tool("my-tool", "Description", { input: z.string() }, async (args) => {
  return { content: [{ type: "text", text: "result" }] };
});

const server = createSdkMcpServer({ name: "my-server", tools: [myTool] });

// Pass to query
for await (const message of query({
  prompt: "Use my-tool to do something",
  options: { mcpServers: { myServer: server } },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

---

## Hooks

\`\`\`typescript
import { query, HookCallback } from "@anthropic-ai/claude-agent-sdk";
import { appendFileSync } from "fs";

const logFileChange: HookCallback = async (input) => {
  const filePath = (input as any).tool_input?.file_path ?? "unknown";
  appendFileSync(
    "./audit.log",
    \`\${new Date().toISOString()}: modified \${filePath}\\n\`,
  );
  return {};
};

for await (const message of query({
  prompt: "Refactor utils.py to improve readability",
  options: {
    allowedTools: ["Read", "Edit", "Write"],
    permissionMode: "acceptEdits",
    hooks: {
      PostToolUse: [{ matcher: "Edit|Write", hooks: [logFileChange] }],
    },
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

Hook event inputs for tool-lifecycle events (\`PreToolUse\`, \`PostToolUse\`, \`PostToolUseFailure\`) include \`agent_id\` and \`agent_type\` fields, allowing hooks to identify which agent (main or subagent) triggered the tool call.

Available hook events: \`PreToolUse\`, \`PostToolUse\`, \`PostToolUseFailure\`, \`Notification\`, \`UserPromptSubmit\`, \`SessionStart\`, \`SessionEnd\`, \`Stop\`, \`SubagentStart\`, \`SubagentStop\`, \`PreCompact\`, \`PermissionRequest\`, \`Setup\`, \`TeammateIdle\`, \`TaskCompleted\`, \`ConfigChange\`, \`Elicitation\`, \`ElicitationResult\`, \`WorktreeCreate\`, \`WorktreeRemove\`, \`InstructionsLoaded\`

---

## Common Options

\`query()\` takes a top-level \`prompt\` (string) and an \`options\` object:

\`\`\`typescript
query({ prompt: "...", options: { ... } })
\`\`\`

| Option                              | Type   | Description                                                                |
| ----------------------------------- | ------ | -------------------------------------------------------------------------- |
| \`cwd\`                               | string | Working directory for file operations                                      |
| \`allowedTools\`                      | array  | Tools the agent can use (e.g., \`["Read", "Edit", "Bash"]\`)                |
| \`tools\`                             | array \\| preset | Built-in tools to make available (\`string[]\` or \`{type:'preset', preset:'claude_code'}\`) |
| \`disallowedTools\`                   | array  | Tools to explicitly disallow                                               |
| \`permissionMode\`                    | string | How to handle permission prompts                                           |
| \`allowDangerouslySkipPermissions\`   | bool   | Must be \`true\` to use \`permissionMode: "bypassPermissions"\`                |
| \`mcpServers\`                        | object | MCP servers to connect to                                                  |
| \`hooks\`                             | object | Hooks for customizing behavior                                             |
| \`systemPrompt\`                      | string \\| preset | Custom system prompt (\`string\` or \`{type:'preset', preset:'claude_code', append?:string}\`) |
| \`maxTurns\`                          | number | Maximum agent turns before stopping                                        |
| \`maxBudgetUsd\`                      | number | Maximum budget in USD for the query                                        |
| \`model\`                             | string | Model ID (default: determined by CLI)                                      |
| \`agents\`                            | object | Subagent definitions (\`Record<string, AgentDefinition>\`)                   |
| \`outputFormat\`                      | object | Structured output schema                                                   |
| \`thinking\`                          | object | Thinking/reasoning control                                                 |
| \`betas\`                             | array  | Beta features to enable (e.g., \`["context-1m-2025-08-07"]\`)               |
| \`settingSources\`                    | array  | Settings to load (e.g., \`["project"]\`). Default: none (no CLAUDE.md files) |
| \`env\`                               | object | Environment variables to set for the session                               |

---

## Subagents

\`\`\`typescript
for await (const message of query({
  prompt: "Use the code-reviewer agent to review this codebase",
  options: {
    allowedTools: ["Read", "Glob", "Grep", "Agent"],
    agents: {
      "code-reviewer": {
        description: "Expert code reviewer for quality and security reviews.",
        prompt: "Analyze code quality and suggest improvements.",
        tools: ["Read", "Glob", "Grep"],
      },
    },
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

---

## Message Types

\`\`\`typescript
for await (const message of query({
  prompt: "Find TODO comments",
  options: { allowedTools: ["Read", "Glob", "Grep"] },
})) {
  if ("result" in message) {
    console.log(message.result);
    console.log(\`Stop reason: \${message.stop_reason}\`); // e.g., "end_turn", "tool_use", "max_tokens"
  } else if (message.type === "system" && message.subtype === "init") {
    const sessionId = message.session_id; // Capture for resuming later
  }
}
\`\`\`

Task-related system messages are also emitted for subagent operations:
- \`task_started\` — emitted when a subagent task is registered
- \`task_progress\` — real-time progress updates with cumulative usage metrics, tool counts, and duration
- \`task_notification\` — task completion notifications (includes \`tool_use_id\` for correlating with originating tool calls)

---

## Session History

Retrieve past session data:

\`\`\`typescript
import { listSessions, getSessionMessages } from "@anthropic-ai/claude-agent-sdk";

// List all past sessions
const sessions = await listSessions();
for (const session of sessions) {
  console.log(\`\${session.sessionId}: \${session.cwd}\`);
}

// Get messages from a specific session (supports pagination via limit/offset)
const messages = await getSessionMessages(sessionId, { limit: 50, offset: 0 });
for (const msg of messages) {
  console.log(msg);
}
\`\`\`

---

## MCP Server Management

Manage MCP servers at runtime on a running query:

\`\`\`typescript
// Reconnect a disconnected MCP server
await queryHandle.reconnectMcpServer("my-server");

// Toggle an MCP server on/off
await queryHandle.toggleMcpServer("my-server", false);  // (name, enabled) — both required

// Get status of ALL configured MCP servers — returns an ARRAY
const statuses: McpServerStatus[] = await queryHandle.mcpServerStatus();
for (const s of statuses) {
  console.log(s.name, s.scope, s.tools.length, s.error);
}
\`\`\`

---

## Best Practices

1. **Always specify allowedTools** — Explicitly list which tools the agent can use
2. **Set working directory** — Always specify \`cwd\` for file operations
3. **Use appropriate permission modes** — Start with \`"default"\` and only escalate when needed
4. **Handle all message types** — Check for \`result\` property to get agent output
5. **Limit maxTurns** — Prevent runaway agents with reasonable limits
`
// @from(Ln 474452, Col 4)
lLq = () => {}
// @from(Ln 474453, Col 4)
rLq = `# Agent SDK Patterns — TypeScript

## Basic Agent

\`\`\`typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  for await (const message of query({
    prompt: "Explain what this repository does",
    options: {
      cwd: "/path/to/project",
      allowedTools: ["Read", "Glob", "Grep"],
    },
  })) {
    if ("result" in message) {
      console.log(message.result);
    }
  }
}

main();
\`\`\`

---

## Hooks

### After Tool Use Hook

\`\`\`typescript
import { query, HookCallback } from "@anthropic-ai/claude-agent-sdk";
import { appendFileSync } from "fs";

const logFileChange: HookCallback = async (input) => {
  const filePath = (input as any).tool_input?.file_path ?? "unknown";
  appendFileSync(
    "./audit.log",
    \`\${new Date().toISOString()}: modified \${filePath}\\n\`,
  );
  return {};
};

for await (const message of query({
  prompt: "Refactor utils.py to improve readability",
  options: {
    allowedTools: ["Read", "Edit", "Write"],
    permissionMode: "acceptEdits",
    hooks: {
      PostToolUse: [{ matcher: "Edit|Write", hooks: [logFileChange] }],
    },
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

---

## Subagents

\`\`\`typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Use the code-reviewer agent to review this codebase",
  options: {
    allowedTools: ["Read", "Glob", "Grep", "Agent"],
    agents: {
      "code-reviewer": {
        description: "Expert code reviewer for quality and security reviews.",
        prompt: "Analyze code quality and suggest improvements.",
        tools: ["Read", "Glob", "Grep"],
      },
    },
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

---

## MCP Server Integration

### Browser Automation (Playwright)

\`\`\`typescript
for await (const message of query({
  prompt: "Open example.com and describe what you see",
  options: {
    mcpServers: {
      playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
    },
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

---

## Session Resumption

\`\`\`typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

let sessionId: string | undefined;

// First query: capture the session ID
for await (const message of query({
  prompt: "Read the authentication module",
  options: { allowedTools: ["Read", "Glob"] },
})) {
  if (message.type === "system" && message.subtype === "init") {
    sessionId = message.session_id;
  }
}

// Resume with full context from the first query
for await (const message of query({
  prompt: "Now find all places that call it",
  options: { resume: sessionId },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`

---

## Session History

\`\`\`typescript
import { listSessions, getSessionMessages } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  // List past sessions
  const sessions = await listSessions();
  for (const session of sessions) {
    console.log(\`Session \${session.sessionId} in \${session.cwd}\`);
  }

  // Retrieve messages from the most recent session
  if (sessions.length > 0) {
    const messages = await getSessionMessages(sessions[0].sessionId, { limit: 50 });
    for (const msg of messages) {
      console.log(msg);
    }
  }
}

main();
\`\`\`

---

## Custom System Prompt

\`\`\`typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Review this code",
  options: {
    allowedTools: ["Read", "Glob", "Grep"],
    systemPrompt: \`You are a senior code reviewer focused on:
1. Security vulnerabilities
2. Performance issues
3. Code maintainability

Always provide specific line numbers and suggestions for improvement.\`,
  },
})) {
  if ("result" in message) console.log(message.result);
}
\`\`\`
`
// @from(Ln 474630, Col 4)
nLq = () => {}
// @from(Ln 474631, Col 4)
aLq = `# Claude API — TypeScript

## Installation

\`\`\`bash
npm install @anthropic-ai/sdk
\`\`\`

## Client Initialization

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

// Default (uses ANTHROPIC_API_KEY env var)
const client = new Anthropic();

// Explicit API key
const client = new Anthropic({ apiKey: "your-api-key" });
\`\`\`

---

## Basic Message Request

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "What is the capital of France?" }],
});
// response.content is ContentBlock[] — a discriminated union. Narrow by .type
// before accessing .text (TypeScript will error on content[0].text without this).
for (const block of response.content) {
  if (block.type === "text") {
    console.log(block.text);
  }
}
\`\`\`

---

## System Prompts

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  system:
    "You are a helpful coding assistant. Always provide examples in Python.",
  messages: [{ role: "user", content: "How do I read a JSON file?" }],
});
\`\`\`

---

## Vision (Images)

### URL

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "url", url: "https://example.com/image.png" },
        },
        { type: "text", text: "Describe this image" },
      ],
    },
  ],
});
\`\`\`

### Base64

\`\`\`typescript
import fs from "fs";

const imageData = fs.readFileSync("image.png").toString("base64");

const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/png", data: imageData },
        },
        { type: "text", text: "What's in this image?" },
      ],
    },
  ],
});
\`\`\`

---

## Prompt Caching

### Automatic Caching (Recommended)

Use top-level \`cache_control\` to automatically cache the last cacheable block in the request:

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  cache_control: { type: "ephemeral" }, // auto-caches the last cacheable block
  system: "You are an expert on this large document...",
  messages: [{ role: "user", content: "Summarize the key points" }],
});
\`\`\`

### Manual Cache Control

For fine-grained control, add \`cache_control\` to specific content blocks:

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an expert on this large document...",
      cache_control: { type: "ephemeral" }, // default TTL is 5 minutes
    },
  ],
  messages: [{ role: "user", content: "Summarize the key points" }],
});

// With explicit TTL (time-to-live)
const response2 = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an expert on this large document...",
      cache_control: { type: "ephemeral", ttl: "1h" }, // 1 hour TTL
    },
  ],
  messages: [{ role: "user", content: "Summarize the key points" }],
});
\`\`\`

---

## Extended Thinking

> **Opus 4.6 and Sonnet 4.6:** Use adaptive thinking. \`budget_tokens\` is deprecated on both Opus 4.6 and Sonnet 4.6.
> **Older models:** Use \`thinking: {type: "enabled", budget_tokens: N}\` (must be < \`max_tokens\`, min 1024).

\`\`\`typescript
// Opus 4.6: adaptive thinking (recommended)
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 16000,
  thinking: { type: "adaptive" },
  output_config: { effort: "high" }, // low | medium | high | max
  messages: [
    { role: "user", content: "Solve this math problem step by step..." },
  ],
});

for (const block of response.content) {
  if (block.type === "thinking") {
    console.log("Thinking:", block.thinking);
  } else if (block.type === "text") {
    console.log("Response:", block.text);
  }
}
\`\`\`

---

## Error Handling

Use the SDK's typed exception classes — never check error messages with string matching:

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

try {
  const response = await client.messages.create({...});
} catch (error) {
  if (error instanceof Anthropic.BadRequestError) {
    console.error("Bad request:", error.message);
  } else if (error instanceof Anthropic.AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof Anthropic.RateLimitError) {
    console.error("Rate limited - retry later");
  } else if (error instanceof Anthropic.APIError) {
    console.error(\`API error \${error.status}:\`, error.message);
  }
}
\`\`\`

All classes extend \`Anthropic.APIError\` with a typed \`status\` field. Check from most specific to least specific. See [shared/error-codes.md](../../shared/error-codes.md) for the full error code reference.

---

## Multi-Turn Conversations

The API is stateless — send the full conversation history each time. Use \`Anthropic.MessageParam[]\` to type the messages array:

\`\`\`typescript
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "My name is Alice." },
  { role: "assistant", content: "Hello Alice! Nice to meet you." },
  { role: "user", content: "What's my name?" },
];

const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: messages,
});
\`\`\`

**Rules:**

- Consecutive same-role messages are allowed — the API combines them into a single turn
- First message must be \`user\`
- Use SDK types (\`Anthropic.MessageParam\`, \`Anthropic.Message\`, \`Anthropic.Tool\`, etc.) for all API data structures — don't redefine equivalent interfaces

---

### Compaction (long conversations)

> **Beta, Opus 4.6 and Sonnet 4.6.** When conversations approach the 200K context window, compaction automatically summarizes earlier context server-side. The API returns a \`compaction\` block; you must pass it back on subsequent requests — append \`response.content\`, not just the text.

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const messages: Anthropic.Beta.BetaMessageParam[] = [];

async function chat(userMessage: string): Promise<string> {
  messages.push({ role: "user", content: userMessage });

  const response = await client.beta.messages.create({
    betas: ["compact-2026-01-12"],
    model: "{{OPUS_ID}}",
    max_tokens: 4096,
    messages,
    context_management: {
      edits: [{ type: "compact_20260112" }],
    },
  });

  // Append full content — compaction blocks must be preserved
  messages.push({ role: "assistant", content: response.content });

  const textBlock = response.content.find(
    (b): b is Anthropic.Beta.BetaTextBlock => b.type === "text",
  );
  return textBlock?.text ?? "";
}

// Compaction triggers automatically when context grows large
console.log(await chat("Help me build a Python web scraper"));
console.log(await chat("Add support for JavaScript-rendered pages"));
console.log(await chat("Now add rate limiting and error handling"));
\`\`\`

---

## Stop Reasons

The \`stop_reason\` field in the response indicates why the model stopped generating:

| Value           | Meaning                                                         |
| --------------- | --------------------------------------------------------------- |
| \`end_turn\`      | Claude finished its response naturally                          |
| \`max_tokens\`    | Hit the \`max_tokens\` limit — increase it or use streaming       |
| \`stop_sequence\` | Hit a custom stop sequence                                      |
| \`tool_use\`      | Claude wants to call a tool — execute it and continue           |
| \`pause_turn\`    | Model paused and can be resumed (agentic flows)                 |
| \`refusal\`       | Claude refused for safety reasons — output may not match schema |

---

## Cost Optimization Strategies

### 1. Use Prompt Caching for Repeated Context

\`\`\`typescript
// Automatic caching (simplest — caches the last cacheable block)
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  cache_control: { type: "ephemeral" },
  system: largeDocumentText, // e.g., 50KB of context
  messages: [{ role: "user", content: "Summarize the key points" }],
});

// First request: full cost
// Subsequent requests: ~90% cheaper for cached portion
\`\`\`

### 2. Use Token Counting Before Requests

\`\`\`typescript
const countResponse = await client.messages.countTokens({
  model: "{{OPUS_ID}}",
  messages: messages,
  system: system,
});

const estimatedInputCost = countResponse.input_tokens * 0.000005; // $5/1M tokens
console.log(\`Estimated input cost: $\${estimatedInputCost.toFixed(4)}\`);
\`\`\`
`
// @from(Ln 474953, Col 4)
oLq = () => {}
// @from(Ln 474954, Col 4)
tLq = `# Message Batches API — TypeScript

The Batches API (\`POST /v1/messages/batches\`) processes Messages API requests asynchronously at 50% of standard prices.

## Key Facts

- Up to 100,000 requests or 256 MB per batch
- Most batches complete within 1 hour; maximum 24 hours
- Results available for 29 days after creation
- 50% cost reduction on all token usage
- All Messages API features supported (vision, tools, caching, etc.)

---

## Create a Batch

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const messageBatch = await client.messages.batches.create({
  requests: [
    {
      custom_id: "request-1",
      params: {
        model: "{{OPUS_ID}}",
        max_tokens: 1024,
        messages: [
          { role: "user", content: "Summarize climate change impacts" },
        ],
      },
    },
    {
      custom_id: "request-2",
      params: {
        model: "{{OPUS_ID}}",
        max_tokens: 1024,
        messages: [
          { role: "user", content: "Explain quantum computing basics" },
        ],
      },
    },
  ],
});

console.log(\`Batch ID: \${messageBatch.id}\`);
console.log(\`Status: \${messageBatch.processing_status}\`);
\`\`\`

---

## Poll for Completion

\`\`\`typescript
let batch;
while (true) {
  batch = await client.messages.batches.retrieve(messageBatch.id);
  if (batch.processing_status === "ended") break;
  console.log(
    \`Status: \${batch.processing_status}, processing: \${batch.request_counts.processing}\`,
  );
  await new Promise((resolve) => setTimeout(resolve, 60_000));
}

console.log("Batch complete!");
console.log(\`Succeeded: \${batch.request_counts.succeeded}\`);
console.log(\`Errored: \${batch.request_counts.errored}\`);
\`\`\`

---

## Retrieve Results

\`\`\`typescript
for await (const result of await client.messages.batches.results(
  messageBatch.id,
)) {
  switch (result.result.type) {
    case "succeeded":
      console.log(
        \`[\${result.custom_id}] \${result.result.message.content[0].text.slice(0, 100)}\`,
      );
      break;
    case "errored":
      if (result.result.error.type === "invalid_request") {
        console.log(\`[\${result.custom_id}] Validation error - fix and retry\`);
      } else {
        console.log(\`[\${result.custom_id}] Server error - safe to retry\`);
      }
      break;
    case "expired":
      console.log(\`[\${result.custom_id}] Expired - resubmit\`);
      break;
  }
}
\`\`\`

---

## Cancel a Batch

\`\`\`typescript
const cancelled = await client.messages.batches.cancel(messageBatch.id);
console.log(\`Status: \${cancelled.processing_status}\`); // "canceling"
\`\`\`
`
// @from(Ln 475061, Col 4)
sLq = () => {}
// @from(Ln 475062, Col 4)
ARq = `# Files API — TypeScript

The Files API uploads files for use in Messages API requests. Reference files via \`file_id\` in content blocks, avoiding re-uploads across multiple API calls.

**Beta:** Pass \`betas: ["files-api-2025-04-14"]\` in your API calls (the SDK sets the required header automatically).

## Key Facts

- Maximum file size: 500 MB
- Total storage: 100 GB per organization
- Files persist until deleted
- File operations (upload, list, delete) are free; content used in messages is billed as input tokens
- Not available on Amazon Bedrock or Google Vertex AI

---

## Upload a File

\`\`\`typescript
import Anthropic, { toFile } from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic();

const uploaded = await client.beta.files.upload({
  file: await toFile(fs.createReadStream("report.pdf"), undefined, {
    type: "application/pdf",
  }),
  betas: ["files-api-2025-04-14"],
});

console.log(\`File ID: \${uploaded.id}\`);
console.log(\`Size: \${uploaded.size_bytes} bytes\`);
\`\`\`

---

## Use a File in Messages

### PDF / Text Document

\`\`\`typescript
const response = await client.beta.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Summarize the key findings in this report." },
        {
          type: "document",
          source: { type: "file", file_id: uploaded.id },
          title: "Q4 Report",
          citations: { enabled: true },
        },
      ],
    },
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response.content[0].text);
\`\`\`

---

## Manage Files

### List Files

\`\`\`typescript
const files = await client.beta.files.list({
  betas: ["files-api-2025-04-14"],
});
for (const f of files.data) {
  console.log(\`\${f.id}: \${f.filename} (\${f.size_bytes} bytes)\`);
}
\`\`\`

### Delete a File

\`\`\`typescript
await client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w", {
  betas: ["files-api-2025-04-14"],
});
\`\`\`

### Download a File

\`\`\`typescript
const response = await client.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ["files-api-2025-04-14"] },
);
const content = Buffer.from(await response.arrayBuffer());
await fs.promises.writeFile("output.txt", content);
\`\`\`
`
// @from(Ln 475161, Col 4)
eLq = () => {}
// @from(Ln 475162, Col 4)
KRq = `# Streaming — TypeScript

## Quick Start

\`\`\`typescript
const stream = client.messages.stream({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a story" }],
});

for await (const event of stream) {
  if (
    event.type === "content_block_delta" &&
    event.delta.type === "text_delta"
  ) {
    process.stdout.write(event.delta.text);
  }
}
\`\`\`

---

## Handling Different Content Types

> **Opus 4.6:** Use \`thinking: {type: "adaptive"}\`. On older models, use \`thinking: {type: "enabled", budget_tokens: N}\` instead.

\`\`\`typescript
const stream = client.messages.stream({
  model: "{{OPUS_ID}}",
  max_tokens: 16000,
  thinking: { type: "adaptive" },
  messages: [{ role: "user", content: "Analyze this problem" }],
});

for await (const event of stream) {
  switch (event.type) {
    case "content_block_start":
      switch (event.content_block.type) {
        case "thinking":
          console.log("\\n[Thinking...]");
          break;
        case "text":
          console.log("\\n[Response:]");
          break;
      }
      break;
    case "content_block_delta":
      switch (event.delta.type) {
        case "thinking_delta":
          process.stdout.write(event.delta.thinking);
          break;
        case "text_delta":
          process.stdout.write(event.delta.text);
          break;
      }
      break;
  }
}
\`\`\`

---

## Streaming with Tool Use (Tool Runner)

Use the tool runner with \`stream: true\`. The outer loop iterates over tool runner iterations (messages), the inner loop processes stream events:

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const client = new Anthropic();

const getWeather = betaZodTool({
  name: "get_weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City and state, e.g., San Francisco, CA"),
  }),
  run: async ({ location }) => \`72°F and sunny in \${location}\`,
});

const runner = client.beta.messages.toolRunner({
  model: "{{OPUS_ID}}",
  max_tokens: 4096,
  tools: [getWeather],
  messages: [
    { role: "user", content: "What's the weather in Paris and London?" },
  ],
  stream: true,
});

// Outer loop: each tool runner iteration
for await (const messageStream of runner) {
  // Inner loop: stream events for this iteration
  for await (const event of messageStream) {
    switch (event.type) {
      case "content_block_delta":
        switch (event.delta.type) {
          case "text_delta":
            process.stdout.write(event.delta.text);
            break;
          case "input_json_delta":
            // Tool input being streamed
            break;
        }
        break;
    }
  }
}
\`\`\`

---

## Getting the Final Message

\`\`\`typescript
const stream = client.messages.stream({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});

for await (const event of stream) {
  // Process events...
}

const finalMessage = await stream.finalMessage();
console.log(\`Tokens used: \${finalMessage.usage.output_tokens}\`);
\`\`\`

---

## Stream Event Types

| Event Type            | Description                 | When it fires                     |
| --------------------- | --------------------------- | --------------------------------- |
| \`message_start\`       | Contains message metadata   | Once at the beginning             |
| \`content_block_start\` | New content block beginning | When a text/tool_use block starts |
| \`content_block_delta\` | Incremental content update  | For each token/chunk              |
| \`content_block_stop\`  | Content block complete      | When a block finishes             |
| \`message_delta\`       | Message-level updates       | Contains \`stop_reason\`, usage     |
| \`message_stop\`        | Message complete            | Once at the end                   |

## Best Practices

1. **Always flush output** — Use \`process.stdout.write()\` for immediate display
2. **Handle partial responses** — If the stream is interrupted, you may have incomplete content
3. **Track token usage** — The \`message_delta\` event contains usage information
4. **Use \`finalMessage()\`** — Get the complete \`Anthropic.Message\` object even when streaming. Don't wrap \`.on()\` events in \`new Promise()\` — \`finalMessage()\` handles all completion/error/abort states internally
5. **Buffer for web UIs** — Consider buffering a few tokens before rendering to avoid excessive DOM updates
6. **Use \`stream.on("text", ...)\` for deltas** — The \`text\` event provides just the delta string, simpler than manually filtering \`content_block_delta\` events
7. **For agentic loops with streaming** — See the [Streaming Manual Loop](./tool-use.md#streaming-manual-loop) section in tool-use.md for combining \`stream()\` + \`finalMessage()\` with a tool-use loop

## Raw SSE Format

If using raw HTTP (not SDKs), the stream returns Server-Sent Events:

\`\`\`
event: message_start
data: {"type":"message_start","message":{"id":"msg_...","type":"message",...}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":12}}

event: message_stop
data: {"type":"message_stop"}
\`\`\`
`
// @from(Ln 475341, Col 4)
qRq = () => {}