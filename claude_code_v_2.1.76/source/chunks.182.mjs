
// @from(Ln 469766, Col 4)
MLq = `# Claude API — C#

> **Note:** The C# SDK is the official Anthropic SDK for C#. Tool use is supported via the Messages API. A class-annotation-based tool runner is not available; use raw tool definitions with JSON schema. The SDK also supports Microsoft.Extensions.AI IChatClient integration with function invocation.

## Installation

\`\`\`bash
dotnet add package Anthropic
\`\`\`

## Client Initialization

\`\`\`csharp
using Anthropic;

// Default (uses ANTHROPIC_API_KEY env var)
AnthropicClient client = new();

// Explicit API key (use environment variables — never hardcode keys)
AnthropicClient client = new() {
    ApiKey = Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY")
};
\`\`\`

---

## Basic Message Request

\`\`\`csharp
using Anthropic.Models.Messages;

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 1024,
    Messages = [new() { Role = Role.User, Content = "What is the capital of France?" }]
};
var response = await client.Messages.Create(parameters);

// ContentBlock is a union wrapper. .Value unwraps to the variant object,
// then OfType<T> filters to the type you want. Or use the TryPick* idiom
// shown in the Thinking section below.
foreach (var text in response.Content.Select(b => b.Value).OfType<TextBlock>())
{
    Console.WriteLine(text.Text);
}
\`\`\`

---

## Streaming

\`\`\`csharp
using Anthropic.Models.Messages;

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 1024,
    Messages = [new() { Role = Role.User, Content = "Write a haiku" }]
};

await foreach (RawMessageStreamEvent streamEvent in client.Messages.CreateStreaming(parameters))
{
    if (streamEvent.TryPickContentBlockDelta(out var delta) &&
        delta.Delta.TryPickText(out var text))
    {
        Console.Write(text.Text);
    }
}
\`\`\`

**\`RawMessageStreamEvent\` TryPick methods** (naming drops the \`Message\`/\`Raw\` prefix): \`TryPickStart\`, \`TryPickDelta\`, \`TryPickStop\`, \`TryPickContentBlockStart\`, \`TryPickContentBlockDelta\`, \`TryPickContentBlockStop\`. There is no \`TryPickMessageStop\` — use \`TryPickStop\`.

---

## Thinking

**Adaptive thinking is the recommended mode for Claude 4.6+ models.** Claude decides dynamically when and how much to think.

\`\`\`csharp
using Anthropic.Models.Messages;

var response = await client.Messages.Create(new MessageCreateParams
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 16000,
    // ThinkingConfigParam? implicitly converts from the concrete variant classes —
    // no wrapper needed.
    Thinking = new ThinkingConfigAdaptive(),
    Messages =
    [
        new() { Role = Role.User, Content = "Solve: 27 * 453" },
    ],
});

// ThinkingBlock(s) precede TextBlock in Content. TryPick* narrows the union.
foreach (var block in response.Content)
{
    if (block.TryPickThinking(out ThinkingBlock? t))
    {
        Console.WriteLine($"[thinking] {t.Thinking}");
    }
    else if (block.TryPickText(out TextBlock? text))
    {
        Console.WriteLine(text.Text);
    }
}
\`\`\`

> **Deprecated:** \`new ThinkingConfigEnabled { BudgetTokens = N }\` (fixed-budget extended thinking) still works on Claude 4.6 but is deprecated. Use adaptive thinking above.

Alternative to \`TryPick*\`: \`.Select(b => b.Value).OfType<ThinkingBlock>()\` (same LINQ pattern as the Basic Message example).

---

## Tool Use

### Defining a tool

\`Tool\` (NOT \`ToolParam\`) with an \`InputSchema\` record. \`InputSchema.Type\` is auto-set to \`"object"\` by the constructor — don't set it. \`ToolUnion\` has an implicit conversion from \`Tool\`, triggered by the collection expression \`[...]\`.

\`\`\`csharp
using System.Text.Json;
using Anthropic.Models.Messages;

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeSonnet4_6,
    MaxTokens = 1024,
    Tools = [
        new Tool {
            Name = "get_weather",
            Description = "Get the current weather in a given location",
            InputSchema = new() {
                Properties = new Dictionary<string, JsonElement> {
                    ["location"] = JsonSerializer.SerializeToElement(
                        new { type = "string", description = "City name" }),
                },
                Required = ["location"],
            },
        },
    ],
    Messages = [new() { Role = Role.User, Content = "Weather in Paris?" }],
};
\`\`\`

Derived from \`anthropic-sdk-csharp/src/Anthropic/Models/Messages/Tool.cs\` and \`ToolUnion.cs:799\` (implicit conversion).

See [shared tool use concepts](../shared/tool-use-concepts.md) for the loop pattern.
### Converting response content to the follow-up assistant message

When echoing Claude's response back in the assistant turn, **there is no \`.ToParam()\` helper** — manually reconstruct each \`ContentBlock\` variant as its \`*Param\` counterpart. Do NOT use \`new ContentBlockParam(block.Json)\`: it compiles and serializes, but \`.Value\` stays \`null\` so \`TryPick*\`/\`Validate()\` fail (degraded JSON pass-through, not the typed path).

\`\`\`csharp
using Anthropic.Models.Messages;

Message response = await client.Messages.Create(parameters);

// No .ToParam() — reconstruct per variant. Implicit conversions from each
// *Param type to ContentBlockParam mean no explicit wrapper.
List<ContentBlockParam> assistantContent = [];
List<ContentBlockParam> toolResults = [];
foreach (ContentBlock block in response.Content)
{
    if (block.TryPickText(out TextBlock? text))
    {
        assistantContent.Add(new TextBlockParam { Text = text.Text });
    }
    else if (block.TryPickThinking(out ThinkingBlock? thinking))
    {
        // Signature MUST be preserved — the API rejects tampering
        assistantContent.Add(new ThinkingBlockParam
        {
            Thinking = thinking.Thinking,
            Signature = thinking.Signature,
        });
    }
    else if (block.TryPickRedactedThinking(out RedactedThinkingBlock? redacted))
    {
        assistantContent.Add(new RedactedThinkingBlockParam { Data = redacted.Data });
    }
    else if (block.TryPickToolUse(out ToolUseBlock? toolUse))
    {
        // ToolUseBlock has required Caller; ToolUseBlockParam.Caller is optional — don't copy it
        assistantContent.Add(new ToolUseBlockParam
        {
            ID = toolUse.ID,
            Name = toolUse.Name,
            Input = toolUse.Input,
        });
        // Execute the tool; collect ONE result per tool_use block — the API
        // rejects the follow-up if any tool_use ID lacks a matching tool_result.
        string result = ExecuteYourTool(toolUse.Name, toolUse.Input);
        toolResults.Add(new ToolResultBlockParam
        {
            ToolUseID = toolUse.ID,
            Content = result,
        });
    }
}

// Follow-up: prior messages + assistant echo + user tool_result(s)
List<MessageParam> followUpMessages =
[
    .. parameters.Messages,
    new() { Role = Role.Assistant, Content = assistantContent },
    new() { Role = Role.User, Content = toolResults },
];
\`\`\`

\`ToolResultBlockParam\` has no tuple constructor — use the object initializer. \`Content\` is a string-or-list union; a plain \`string\` implicitly converts.

---

## Context Editing / Compaction (Beta)

**Beta-namespace prefix is inconsistent** (source-verified against \`src/Anthropic/Models/Beta/Messages/*.cs\` @ 12.8.0). No prefix: \`MessageCreateParams\`, \`MessageCountTokensParams\`, \`Role\`. **Everything else has the \`Beta\` prefix**: \`BetaMessageParam\`, \`BetaMessage\`, \`BetaContentBlock\`, \`BetaToolUseBlock\`, all block param types. The unprefixed \`Role\` WILL collide with \`Anthropic.Models.Messages.Role\` if you import both namespaces (CS0104). Safest: import only Beta; if mixing, alias the beta \`Role\`:

\`\`\`csharp
using Anthropic.Models.Beta.Messages;
using NonBeta = Anthropic.Models.Messages;  // only if you also need non-beta types
// Now: MessageCreateParams, BetaMessageParam, Role (beta's), NonBeta.Role (if needed)
\`\`\`


\`BetaMessage.Content\` is \`IReadOnlyList<BetaContentBlock>\` — a 15-variant discriminated union. Narrow with \`TryPick*\`. **Response \`BetaContentBlock\` is NOT assignable to param \`BetaContentBlockParam\`** — there's no \`.ToParam()\` in C#. Round-trip by converting each block:

\`\`\`csharp
using Anthropic.Models.Beta.Messages;

var betaParams = new MessageCreateParams   // no Beta prefix — one of only 2 unprefixed
{
    Model = Model.ClaudeOpus4_6,
    MaxTokens = 1024,
    Betas = ["compact-2026-01-12"],
    ContextManagement = new BetaContextManagementConfig
    {
        Edits = [new BetaCompact20260112Edit()],
    },
    Messages = messages,
};
BetaMessage resp = await client.Beta.Messages.Create(betaParams);

foreach (BetaContentBlock block in resp.Content)
{
    if (block.TryPickCompaction(out BetaCompactionBlock? compaction))
    {
        // Content is nullable — compaction can fail server-side
        Console.WriteLine($"compaction summary: {compaction.Content}");
    }
}

// Context-edit metadata lives on a separate nullable field
if (resp.ContextManagement is { } ctx)
{
    foreach (var edit in ctx.AppliedEdits)
        Console.WriteLine($"cleared {edit.ClearedInputTokens} tokens");
}

// ROUND-TRIP: BetaMessageParam.Content is BetaMessageParamContent (a string|list
// union). It implicit-converts from List<BetaContentBlockParam>, NOT from the
// response's IReadOnlyList<BetaContentBlock>. Convert each block:
List<BetaContentBlockParam> paramBlocks = [];
foreach (var b in resp.Content)
{
    if (b.TryPickText(out var t)) paramBlocks.Add(new BetaTextBlockParam { Text = t.Text });
    else if (b.TryPickCompaction(out var c)) paramBlocks.Add(new BetaCompactionBlockParam { Content = c.Content });
    // ... other variants as needed
}
messages.Add(new BetaMessageParam { Role = Role.Assistant, Content = paramBlocks });
\`\`\`

All 15 \`BetaContentBlock.TryPick*\` variants: \`Text\`, \`Thinking\`, \`RedactedThinking\`, \`ToolUse\`, \`ServerToolUse\`, \`WebSearchToolResult\`, \`WebFetchToolResult\`, \`CodeExecutionToolResult\`, \`BashCodeExecutionToolResult\`, \`TextEditorCodeExecutionToolResult\`, \`ToolSearchToolResult\`, \`McpToolUse\`, \`McpToolResult\`, \`ContainerUpload\`, \`Compaction\`.

**\`BetaToolUseBlock.Input\` is \`IReadOnlyDictionary<string, JsonElement>\`** — index by key then call the \`JsonElement\` extractor:

\`\`\`csharp
if (block.TryPickToolUse(out BetaToolUseBlock? tu))
{
    int a = tu.Input["a"].GetInt32();
    string s = tu.Input["name"].GetString()!;
}
\`\`\`

---

## Effort Parameter

Effort is nested under \`OutputConfig\`, NOT a top-level property. \`ApiEnum<string, Effort>\` has an implicit conversion from the enum, so assign \`Effort.High\` directly.

\`\`\`csharp
OutputConfig = new OutputConfig { Effort = Effort.High },
\`\`\`

Values: \`Effort.Low\`, \`Effort.Medium\`, \`Effort.High\`, \`Effort.Max\`. Combine with \`Thinking = new ThinkingConfigAdaptive()\` for cost-quality control.

---

## Prompt Caching

\`System\` takes \`MessageCreateParamsSystem?\` — a union of \`string\` or \`List<TextBlockParam>\`. There is no \`SystemTextBlockParam\`; use plain \`TextBlockParam\`. The implicit conversion needs the concrete \`List<TextBlockParam>\` type (array literals won't convert).

\`\`\`csharp
System = new List<TextBlockParam> {
    new() {
        Text = longSystemPrompt,
        CacheControl = new CacheControlEphemeral(),  // auto-sets Type = "ephemeral"
    },
},
\`\`\`

Optional \`Ttl\` on \`CacheControlEphemeral\`: \`new() { Ttl = Ttl.Ttl1h }\` or \`Ttl.Ttl5m\`. \`CacheControl\` also exists on \`Tool.CacheControl\` and top-level \`MessageCreateParams.CacheControl\`.

---

## Token Counting

\`\`\`csharp
MessageTokensCount result = await client.Messages.CountTokens(new MessageCountTokensParams {
    Model = Model.ClaudeOpus4_6,
    Messages = [new() { Role = Role.User, Content = "Hello" }],
});
long tokens = result.InputTokens;
\`\`\`

\`MessageCountTokensParams.Tools\` uses a different union type (\`MessageCountTokensTool\`) than \`MessageCreateParams.Tools\` (\`ToolUnion\`) — if you're passing tools, the compiler will tell you when it matters.

---

## Structured Output

\`\`\`csharp
OutputConfig = new OutputConfig {
    Format = new JsonOutputFormat {
        Schema = new Dictionary<string, JsonElement> {
            ["type"] = JsonSerializer.SerializeToElement("object"),
            ["properties"] = JsonSerializer.SerializeToElement(
                new { name = new { type = "string" } }),
            ["required"] = JsonSerializer.SerializeToElement(new[] { "name" }),
        },
    },
},
\`\`\`

\`JsonOutputFormat.Type\` is auto-set to \`"json_schema"\` by the constructor. \`Schema\` is \`required\`.

---

## PDF / Document Input

\`DocumentBlockParam\` takes a \`DocumentBlockParamSource\` union: \`Base64PdfSource\` / \`UrlPdfSource\` / \`PlainTextSource\` / \`ContentBlockSource\`. \`Base64PdfSource\` auto-sets \`MediaType = "application/pdf"\` and \`Type = "base64"\`.

\`\`\`csharp
new MessageParam {
    Role = Role.User,
    Content = new List<ContentBlockParam> {
        new DocumentBlockParam { Source = new Base64PdfSource { Data = base64String } },
        new TextBlockParam { Text = "Summarize this PDF" },
    },
}
\`\`\`

---

## Server-Side Tools

Web search, bash, text editor, and code execution are built-in server tools. Type names are version-suffixed; constructors auto-set \`name\`/\`type\`. All implicit-convert to \`ToolUnion\`.

\`\`\`csharp
Tools = [
    new WebSearchTool20260209(),
    new ToolBash20250124(),
    new ToolTextEditor20250728(),
    new CodeExecutionTool20260120(),
],
\`\`\`

Also available: \`WebFetchTool20260209\`, \`MemoryTool20250818\`. \`WebSearchTool20260209\` optionals: \`AllowedDomains\`, \`BlockedDomains\`, \`MaxUses\`, \`UserLocation\`.

---

## Files API (Beta)

Files live under \`client.Beta.Files\` (namespace \`Anthropic.Models.Beta.Files\`). \`BinaryContent\` implicit-converts from \`Stream\` and \`byte[]\`.

\`\`\`csharp
using Anthropic.Models.Beta.Files;
using Anthropic.Models.Beta.Messages;

FileMetadata meta = await client.Beta.Files.Upload(
    new FileUploadParams { File = File.OpenRead("doc.pdf") });

// Referencing the uploaded file requires Beta message types:
new BetaRequestDocumentBlock {
    Source = new BetaFileDocumentSource { FileID = meta.ID },
}
\`\`\`

The non-beta \`DocumentBlockParamSource\` union has no file-ID variant — file references need \`client.Beta.Messages.Create()\`.
`
// @from(Ln 470167, Col 4)
JLq = () => {}
// @from(Ln 470168, Col 4)
XLq = `# Claude API — cURL / Raw HTTP

Use these examples when the user needs raw HTTP requests or is working in a language without an official SDK.

## Setup

\`\`\`bash
export ANTHROPIC_API_KEY="your-api-key"
\`\`\`

---

## Basic Message Request

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'
\`\`\`

### Parsing the response

Use \`jq\` to extract fields from the JSON response. Do not use \`grep\`/\`sed\` —
JSON strings can contain any character and regex parsing will break on quotes,
escapes, or multi-line content.

\`\`\`bash
# Capture the response, then extract fields
response=$(curl -s https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{"model":"{{OPUS_ID}}","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}')

# Print the first text block (-r strips the JSON quotes)
echo "$response" | jq -r '.content[0].text'

# Read usage fields
input_tokens=$(echo "$response" | jq -r '.usage.input_tokens')
output_tokens=$(echo "$response" | jq -r '.usage.output_tokens')

# Read stop reason (for tool-use loops)
stop_reason=$(echo "$response" | jq -r '.stop_reason')

# Extract all text blocks (content is an array; filter to type=="text")
echo "$response" | jq -r '.content[] | select(.type == "text") | .text'
\`\`\`


---

## Streaming (SSE)

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 1024,
    "stream": true,
    "messages": [{"role": "user", "content": "Write a haiku"}]
  }'
\`\`\`

The response is a stream of Server-Sent Events:

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

---

## Tool Use

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 1024,
    "tools": [{
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {"type": "string", "description": "City name"}
        },
        "required": ["location"]
      }
    }],
    "messages": [{"role": "user", "content": "What is the weather in Paris?"}]
  }'
\`\`\`

When Claude responds with a \`tool_use\` block, send the result back:

\`\`\`bash
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 1024,
    "tools": [{
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {"type": "string", "description": "City name"}
        },
        "required": ["location"]
      }
    }],
    "messages": [
      {"role": "user", "content": "What is the weather in Paris?"},
      {"role": "assistant", "content": [
        {"type": "text", "text": "Let me check the weather."},
        {"type": "tool_use", "id": "toolu_abc123", "name": "get_weather", "input": {"location": "Paris"}}
      ]},
      {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "toolu_abc123", "content": "72°F and sunny"}
      ]}
    ]
  }'
\`\`\`

---

## Extended Thinking

> **Opus 4.6 and Sonnet 4.6:** Use adaptive thinking. \`budget_tokens\` is deprecated on both Opus 4.6 and Sonnet 4.6.
> **Older models:** Use \`"type": "enabled"\` with \`"budget_tokens": N\` (must be < \`max_tokens\`, min 1024).

\`\`\`bash
# Opus 4.6: adaptive thinking (recommended)
curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "{{OPUS_ID}}",
    "max_tokens": 16000,
    "thinking": {
      "type": "adaptive"
    },
    "output_config": {
      "effort": "high"
    },
    "messages": [{"role": "user", "content": "Solve this step by step..."}]
  }'
\`\`\`

---

## Required Headers

| Header              | Value              | Description                |
| ------------------- | ------------------ | -------------------------- |
| \`Content-Type\`      | \`application/json\` | Required                   |
| \`x-api-key\`         | Your API key       | Authentication             |
| \`anthropic-version\` | \`2023-06-01\`       | API version                |
| \`anthropic-beta\`    | Beta feature IDs   | Required for beta features |
`
// @from(Ln 470362, Col 4)
DLq = () => {}
// @from(Ln 470363, Col 4)
WLq = `# Claude API — Go

> **Note:** The Go SDK supports the Claude API and beta tool use with \`BetaToolRunner\`. Agent SDK is not yet available for Go.

## Installation

\`\`\`bash
go get github.com/anthropics/anthropic-sdk-go
\`\`\`

## Client Initialization

\`\`\`go
import (
    "github.com/anthropics/anthropic-sdk-go"
    "github.com/anthropics/anthropic-sdk-go/option"
)

// Default (uses ANTHROPIC_API_KEY env var)
client := anthropic.NewClient()

// Explicit API key
client := anthropic.NewClient(
    option.WithAPIKey("your-api-key"),
)
\`\`\`

---

## Basic Message Request

\`\`\`go
response, err := client.Messages.New(context.Background(), anthropic.MessageNewParams{
    Model:     anthropic.ModelClaudeOpus4_6,
    MaxTokens: 1024,
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(anthropic.NewTextBlock("What is the capital of France?")),
    },
})
if err != nil {
    log.Fatal(err)
}
for _, block := range response.Content {
    switch variant := block.AsAny().(type) {
    case anthropic.TextBlock:
        fmt.Println(variant.Text)
    }
}
\`\`\`

---

## Streaming

\`\`\`go
stream := client.Messages.NewStreaming(context.Background(), anthropic.MessageNewParams{
    Model:     anthropic.ModelClaudeOpus4_6,
    MaxTokens: 1024,
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(anthropic.NewTextBlock("Write a haiku")),
    },
})

for stream.Next() {
    event := stream.Current()
    switch eventVariant := event.AsAny().(type) {
    case anthropic.ContentBlockDeltaEvent:
        switch deltaVariant := eventVariant.Delta.AsAny().(type) {
        case anthropic.TextDelta:
            fmt.Print(deltaVariant.Text)
        }
    }
}
if err := stream.Err(); err != nil {
    log.Fatal(err)
}
\`\`\`

**Accumulating the final message** (there is no \`GetFinalMessage()\` on the stream):

\`\`\`go
stream := client.Messages.NewStreaming(ctx, params)
message := anthropic.Message{}
for stream.Next() {
    message.Accumulate(stream.Current())
}
if err := stream.Err(); err != nil { log.Fatal(err) }
// message.Content now has the complete response
\`\`\`


---

## Tool Use

### Tool Runner (Beta — Recommended)

**Beta:** The Go SDK provides \`BetaToolRunner\` for automatic tool use loops via the \`toolrunner\` package.

\`\`\`go
import (
    "context"
    "fmt"
    "log"

    "github.com/anthropics/anthropic-sdk-go"
    "github.com/anthropics/anthropic-sdk-go/toolrunner"
)

// Define tool input with jsonschema tags for automatic schema generation
type GetWeatherInput struct {
    City string \`json:"city" jsonschema:"required,description=The city name"\`
}

// Create a tool with automatic schema generation from struct tags
weatherTool, err := toolrunner.NewBetaToolFromJSONSchema(
    "get_weather",
    "Get current weather for a city",
    func(ctx context.Context, input GetWeatherInput) (anthropic.BetaToolResultBlockParamContentUnion, error) {
        return anthropic.BetaToolResultBlockParamContentUnion{
            OfText: &anthropic.BetaTextBlockParam{
                Text: fmt.Sprintf("The weather in %s is sunny, 72°F", input.City),
            },
        }, nil
    },
)
if err != nil {
    log.Fatal(err)
}

// Create a tool runner that handles the conversation loop automatically
runner := client.Beta.Messages.NewToolRunner(
    []anthropic.BetaTool{weatherTool},
    anthropic.BetaToolRunnerParams{
        BetaMessageNewParams: anthropic.BetaMessageNewParams{
            Model:     anthropic.ModelClaudeOpus4_6,
            MaxTokens: 1024,
            Messages: []anthropic.BetaMessageParam{
                anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("What's the weather in Paris?")),
            },
        },
        MaxIterations: 5,
    },
)

// Run until Claude produces a final response
message, err := runner.RunToCompletion(context.Background())
if err != nil {
    log.Fatal(err)
}

// RunToCompletion returns *BetaMessage; content is []BetaContentBlockUnion.
// Narrow via AsAny() switch — note the Beta-namespace types (BetaTextBlock,
// not TextBlock):
for _, block := range message.Content {
    switch block := block.AsAny().(type) {
    case anthropic.BetaTextBlock:
        fmt.Println(block.Text)
    }
}
\`\`\`

**Key features of the Go tool runner:**

- Automatic schema generation from Go structs via \`jsonschema\` tags
- \`RunToCompletion()\` for simple one-shot usage
- \`All()\` iterator for processing each message in the conversation
- \`NextMessage()\` for step-by-step iteration
- Streaming variant via \`NewToolRunnerStreaming()\` with \`AllStreaming()\`

### Manual Loop

For fine-grained control over the agentic loop, define tools with \`ToolParam\`, check \`StopReason\`, execute tools yourself, and feed \`tool_result\` blocks back. This is the pattern when you need to intercept, validate, or log tool calls.

Derived from \`anthropic-sdk-go/examples/tools/main.go\`.

\`\`\`go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"

    "github.com/anthropics/anthropic-sdk-go"
)

func main() {
    client := anthropic.NewClient()

    // 1. Define tools. ToolParam.InputSchema uses a map, no struct tags needed.
    addTool := anthropic.ToolParam{
        Name:        "add",
        Description: anthropic.String("Add two integers"),
        InputSchema: anthropic.ToolInputSchemaParam{
            Properties: map[string]any{
                "a": map[string]any{"type": "integer"},
                "b": map[string]any{"type": "integer"},
            },
        },
    }
    // ToolParam must be wrapped in ToolUnionParam for the Tools slice
    tools := []anthropic.ToolUnionParam{{OfTool: &addTool}}

    messages := []anthropic.MessageParam{
        anthropic.NewUserMessage(anthropic.NewTextBlock("What is 2 + 3?")),
    }

    for {
        resp, err := client.Messages.New(context.Background(), anthropic.MessageNewParams{
            Model:     anthropic.ModelClaudeSonnet4_6,
            MaxTokens: 1024,
            Messages:  messages,
            Tools:     tools,
        })
        if err != nil {
            log.Fatal(err)
        }

        // 2. Append the assistant response to history BEFORE processing tool calls.
        //    resp.ToParam() converts Message → MessageParam in one call.
        messages = append(messages, resp.ToParam())

        // 3. Walk content blocks. ContentBlockUnion is a flattened struct;
        //    use block.AsAny().(type) to switch on the actual variant.
        toolResults := []anthropic.ContentBlockParamUnion{}
        for _, block := range resp.Content {
            switch variant := block.AsAny().(type) {
            case anthropic.TextBlock:
                fmt.Println(variant.Text)
            case anthropic.ToolUseBlock:
                // 4. Parse the tool input. Use variant.JSON.Input.Raw() to get the
                //    raw JSON — block.Input is json.RawMessage, not the parsed value.
                var in struct {
                    A int \`json:"a"\`
                    B int \`json:"b"\`
                }
                if err := json.Unmarshal([]byte(variant.JSON.Input.Raw()), &in); err != nil {
                    log.Fatal(err)
                }
                result := fmt.Sprintf("%d", in.A+in.B)
                // 5. NewToolResultBlock(toolUseID, content, isError) builds the
                //    ContentBlockParamUnion for you. block.ID is the tool_use_id.
                toolResults = append(toolResults,
                    anthropic.NewToolResultBlock(block.ID, result, false))
            }
        }

        // 6. Exit when Claude stops asking for tools
        if resp.StopReason != anthropic.StopReasonToolUse {
            break
        }

        // 7. Tool results go in a user message (variadic: all results in one turn)
        messages = append(messages, anthropic.NewUserMessage(toolResults...))
    }
}
\`\`\`

**Key API surface:**

| Symbol | Purpose |
|---|---|
| \`resp.ToParam()\` | Convert \`Message\` response → \`MessageParam\` for history |
| \`block.AsAny().(type)\` | Type-switch on \`ContentBlockUnion\` variants |
| \`variant.JSON.Input.Raw()\` | Raw JSON string of tool input (for \`json.Unmarshal\`) |
| \`anthropic.NewToolResultBlock(id, content, isError)\` | Build \`tool_result\` block |
| \`anthropic.NewUserMessage(blocks...)\` | Wrap tool results as a user turn |
| \`anthropic.StopReasonToolUse\` | \`StopReason\` constant to check loop termination |
| \`anthropic.ToolUnionParam{OfTool: &t}\` | Wrap \`ToolParam\` in the union for \`Tools:\` |

---

## Thinking

Enable Claude's internal reasoning by setting \`Thinking\` in \`MessageNewParams\`. The response will contain \`ThinkingBlock\` content before the final \`TextBlock\`.

**Adaptive thinking is the recommended mode for Claude 4.6+ models.** Claude decides dynamically when and how much to think. Combine with the \`effort\` parameter for cost-quality control.

Derived from \`anthropic-sdk-go/message.go\` (\`ThinkingConfigParamUnion\`, \`NewThinkingConfigAdaptiveParam\`).

\`\`\`go
// There is no ThinkingConfigParamOfAdaptive helper — construct the union
// struct-literal directly and take the address of the variant.
adaptive := anthropic.NewThinkingConfigAdaptiveParam()
params := anthropic.MessageNewParams{
    Model:     anthropic.ModelClaudeSonnet4_6,
    MaxTokens: 16000,
    Thinking:  anthropic.ThinkingConfigParamUnion{OfAdaptive: &adaptive},
    Messages: []anthropic.MessageParam{
        anthropic.NewUserMessage(anthropic.NewTextBlock("How many r's in strawberry?")),
    },
}

resp, err := client.Messages.New(context.Background(), params)
if err != nil {
    log.Fatal(err)
}

// ThinkingBlock(s) precede TextBlock in content
for _, block := range resp.Content {
    switch b := block.AsAny().(type) {
    case anthropic.ThinkingBlock:
        fmt.Println("[thinking]", b.Thinking)
    case anthropic.TextBlock:
        fmt.Println(b.Text)
    }
}
\`\`\`

> **Deprecated:** \`ThinkingConfigParamOfEnabled(budgetTokens)\` (fixed-budget extended thinking) still works on Claude 4.6 but is deprecated. Use adaptive thinking above.

To disable: \`anthropic.ThinkingConfigParamUnion{OfDisabled: &anthropic.ThinkingConfigDisabledParam{}}\`.

---

## Server-Side Tools

Version-suffixed struct names with \`Param\` suffix. \`Name\`/\`Type\` are \`constant.*\` types — zero value marshals correctly, so \`{}\` works. Wrap in \`ToolUnionParam\` with the matching \`Of*\` field.

\`\`\`go
Tools: []anthropic.ToolUnionParam{
    {OfWebSearchTool20260209: &anthropic.WebSearchTool20260209Param{}},
    {OfBashTool20250124: &anthropic.ToolBash20250124Param{}},
    {OfTextEditor20250728: &anthropic.ToolTextEditor20250728Param{}},
    {OfCodeExecutionTool20260120: &anthropic.CodeExecutionTool20260120Param{}},
},
\`\`\`

Also available: \`WebFetchTool20260209Param\`, \`MemoryTool20250818Param\`, \`ToolSearchToolBm25_20251119Param\`, \`ToolSearchToolRegex20251119Param\`.

---

## PDF / Document Input

\`NewDocumentBlock\` generic helper accepts any source type. \`MediaType\`/\`Type\` are auto-set.

\`\`\`go
b64 := base64.StdEncoding.EncodeToString(pdfBytes)

msg := anthropic.NewUserMessage(
    anthropic.NewDocumentBlock(anthropic.Base64PDFSourceParam{Data: b64}),
    anthropic.NewTextBlock("Summarize this document"),
)
\`\`\`

Other sources: \`URLPDFSourceParam{URL: "https://..."}\`, \`PlainTextSourceParam{Data: "..."}\`.

---

## Files API (Beta)

Under \`client.Beta.Files\`. Method is **\`Upload\`** (NOT \`New\`/\`Create\`), params struct is \`BetaFileUploadParams\`. The \`File\` field takes an \`io.Reader\`; use \`anthropic.File()\` to attach a filename + content-type for the multipart encoding.

\`\`\`go
f, _ := os.Open("./upload_me.txt")
defer f.Close()

meta, err := client.Beta.Files.Upload(ctx, anthropic.BetaFileUploadParams{
    File:  anthropic.File(f, "upload_me.txt", "text/plain"),
    Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaFilesAPI2025_04_14},
})
// meta.ID is the file_id to reference in subsequent message requests
\`\`\`

Other \`Beta.Files\` methods: \`List\`, \`Delete\`, \`Download\`, \`GetMetadata\`.

---

## Context Editing / Compaction (Beta)

Use \`Beta.Messages.New\` with \`ContextManagement\` on \`BetaMessageNewParams\`. There is no \`NewBetaAssistantMessage\` — use \`.ToParam()\` for the round-trip.

\`\`\`go
params := anthropic.BetaMessageNewParams{
    Model:     anthropic.ModelClaudeOpus4_6,  // also supported: ModelClaudeSonnet4_6
    MaxTokens: 1024,
    Betas:     []anthropic.AnthropicBeta{"compact-2026-01-12"},
    ContextManagement: anthropic.BetaContextManagementConfigParam{
        Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
            {OfCompact20260112: &anthropic.BetaCompact20260112EditParam{}},
        },
    },
    Messages: []anthropic.BetaMessageParam{ /* ... */ },
}

resp, err := client.Beta.Messages.New(ctx, params)
if err != nil {
    log.Fatal(err)
}

// Round-trip: append response to history via .ToParam()
params.Messages = append(params.Messages, resp.ToParam())

// Read compaction blocks from the response
for _, block := range resp.Content {
    if c, ok := block.AsAny().(anthropic.BetaCompactionBlock); ok {
        fmt.Println("compaction summary:", c.Content)
    }
}
\`\`\`

Other edit types: \`BetaClearToolUses20250919EditParam\`, \`BetaClearThinking20251015EditParam\`.
`
// @from(Ln 470768, Col 4)
PLq = () => {}
// @from(Ln 470769, Col 4)
GLq = `# Claude API — Java

> **Note:** The Java SDK supports the Claude API and beta tool use with annotated classes. Agent SDK is not yet available for Java.

## Installation

Maven:

\`\`\`xml
<dependency>
    <groupId>com.anthropic</groupId>
    <artifactId>anthropic-java</artifactId>
    <version>2.15.0</version>
</dependency>
\`\`\`

Gradle:

\`\`\`groovy
implementation("com.anthropic:anthropic-java:2.15.0")
\`\`\`

## Client Initialization

\`\`\`java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;

// Default (reads ANTHROPIC_API_KEY from environment)
AnthropicClient client = AnthropicOkHttpClient.fromEnv();

// Explicit API key
AnthropicClient client = AnthropicOkHttpClient.builder()
    .apiKey("your-api-key")
    .build();
\`\`\`

---

## Basic Message Request

\`\`\`java
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.Model;

MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_OPUS_4_6)
    .maxTokens(1024L)
    .addUserMessage("What is the capital of France?")
    .build();

Message response = client.messages().create(params);
response.content().stream()
    .flatMap(block -> block.text().stream())
    .forEach(textBlock -> System.out.println(textBlock.text()));
\`\`\`

---

## Streaming

\`\`\`java
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.RawMessageStreamEvent;

MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_OPUS_4_6)
    .maxTokens(1024L)
    .addUserMessage("Write a haiku")
    .build();

try (StreamResponse<RawMessageStreamEvent> streamResponse = client.messages().createStreaming(params)) {
    streamResponse.stream()
        .flatMap(event -> event.contentBlockDelta().stream())
        .flatMap(deltaEvent -> deltaEvent.delta().text().stream())
        .forEach(textDelta -> System.out.print(textDelta.text()));
}
\`\`\`

---

## Thinking

**Adaptive thinking is the recommended mode for Claude 4.6+ models.** Claude decides dynamically when and how much to think. The builder has a direct \`.thinking(ThinkingConfigAdaptive)\` overload — no manual union wrapping.

\`\`\`java
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ThinkingConfigAdaptive;

MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_SONNET_4_6)
    .maxTokens(16000L)
    .thinking(ThinkingConfigAdaptive.builder().build())
    .addUserMessage("Solve this step by step: 27 * 453")
    .build();

for (ContentBlock block : client.messages().create(params).content()) {
    block.thinking().ifPresent(t -> System.out.println("[thinking] " + t.thinking()));
    block.text().ifPresent(t -> System.out.println(t.text()));
}
\`\`\`

> **Deprecated:** \`ThinkingConfigEnabled.builder().budgetTokens(N)\` (and the \`.enabledThinking(N)\` shortcut) still works on Claude 4.6 but is deprecated. Use adaptive thinking above.

\`ContentBlock\` narrowing: \`.thinking()\` / \`.text()\` return \`Optional<T>\` — use \`.ifPresent(...)\` or \`.stream().flatMap(...)\`. Alternative: \`isThinking()\` / \`asThinking()\` boolean+unwrap pairs (throws on wrong variant).

---

## Tool Use (Beta)

The Java SDK supports beta tool use with annotated classes. Tool classes implement \`Supplier<String>\` for automatic execution via \`BetaToolRunner\`.

### Tool Runner (automatic loop)

\`\`\`java
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.helpers.BetaToolRunner;
import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import java.util.function.Supplier;

@JsonClassDescription("Get the weather in a given location")
static class GetWeather implements Supplier<String> {
    @JsonPropertyDescription("The city and state, e.g. San Francisco, CA")
    public String location;

    @Override
    public String get() {
        return "The weather in " + location + " is sunny and 72°F";
    }
}

BetaToolRunner toolRunner = client.beta().messages().toolRunner(
    MessageCreateParams.builder()
        .model("{{OPUS_ID}}")
        .maxTokens(1024L)
        .putAdditionalHeader("anthropic-beta", "structured-outputs-2025-11-13")
        .addTool(GetWeather.class)
        .addUserMessage("What's the weather in San Francisco?")
        .build());

for (BetaMessage message : toolRunner) {
    System.out.println(message);
}
\`\`\`

### Non-Beta Tool Declaration (manual JSON schema)

\`Tool.InputSchema.Properties\` is a freeform \`Map<String, JsonValue>\` wrapper — build property schemas via \`putAdditionalProperty\`. \`type: "object"\` is the default. The builder has a direct \`.addTool(Tool)\` overload that wraps in \`ToolUnion\` automatically.

\`\`\`java
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Tool;

Tool tool = Tool.builder()
    .name("get_weather")
    .description("Get the current weather in a given location")
    .inputSchema(Tool.InputSchema.builder()
        .properties(Tool.InputSchema.Properties.builder()
            .putAdditionalProperty("location", JsonValue.from(Map.of("type", "string")))
            .build())
        .required(List.of("location"))
        .build())
    .build();

MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_SONNET_4_6)
    .maxTokens(1024L)
    .addTool(tool)
    .addUserMessage("Weather in Paris?")
    .build();
\`\`\`

For manual tool loops, handle \`tool_use\` blocks in the response, send \`tool_result\` back, loop until \`stop_reason\` is \`"end_turn"\`. See [shared tool use concepts](../shared/tool-use-concepts.md).

### Building \`MessageParam\` with Content Blocks (Tool Result Round-Trip)

\`MessageParam.Content\` is an inner union class (string | list). Use the builder's \`.contentOfBlockParams(List<ContentBlockParam>)\` alias — there is NO separate \`MessageParamContent\` class with a static \`ofBlockParams\`:

\`\`\`java
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.ToolResultBlockParam;

List<ContentBlockParam> results = List.of(
    ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
        .toolUseId(toolUseBlock.id())
        .content(yourResultString)
        .build())
);

MessageParam toolResultMsg = MessageParam.builder()
    .role(MessageParam.Role.USER)
    .contentOfBlockParams(results)   // builder alias for Content.ofBlockParams(...)
    .build();
\`\`\`

---

## Effort Parameter

Effort is nested inside \`OutputConfig\` — there is NO \`.effort()\` directly on \`MessageCreateParams.Builder\`.

\`\`\`java
import com.anthropic.models.messages.OutputConfig;

.outputConfig(OutputConfig.builder()
    .effort(OutputConfig.Effort.HIGH)  // or LOW, MEDIUM, MAX
    .build())
\`\`\`

Combine with \`Thinking = ThinkingConfigAdaptive\` for cost-quality control.

---

## Prompt Caching

System message as a list of \`TextBlockParam\` with \`CacheControlEphemeral\`. Use \`.systemOfTextBlockParams(...)\` — the plain \`.system(String)\` overload can't carry cache control.

\`\`\`java
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.CacheControlEphemeral;

.systemOfTextBlockParams(List.of(
    TextBlockParam.builder()
        .text(longSystemPrompt)
        .cacheControl(CacheControlEphemeral.builder()
            .ttl(CacheControlEphemeral.Ttl.TTL_1H)  // optional; also TTL_5M
            .build())
        .build()))
\`\`\`

There's also a top-level \`.cacheControl(CacheControlEphemeral)\` on \`MessageCreateParams.Builder\` and on \`Tool.builder()\`.

---

## Token Counting

\`\`\`java
import com.anthropic.models.messages.MessageCountTokensParams;

long tokens = client.messages().countTokens(
    MessageCountTokensParams.builder()
        .model(Model.CLAUDE_SONNET_4_6)
        .addUserMessage("Hello")
        .build()
).inputTokens();
\`\`\`

---

## Structured Output

The class-based overload auto-derives the JSON schema from your POJO and gives you a typed \`.text()\` return — no manual schema, no manual parsing.

\`\`\`java
import com.anthropic.models.messages.StructuredMessageCreateParams;

record Book(String title, String author) {}
record BookList(List<Book> books) {}

StructuredMessageCreateParams<BookList> params = MessageCreateParams.builder()
    .model(Model.CLAUDE_SONNET_4_6)
    .maxTokens(2048L)
    .outputConfig(BookList.class)  // returns a typed builder
    .addUserMessage("List 3 classic novels")
    .build();

client.messages().create(params).content().stream()
    .flatMap(cb -> cb.text().stream())
    .forEach(typed -> {
        // typed.text() returns BookList, not String
        for (Book b : typed.text().books()) System.out.println(b.title());
    });
\`\`\`

Supports Jackson annotations: \`@JsonPropertyDescription\`, \`@JsonIgnore\`, \`@ArraySchema(minItems=...)\`. Manual schema path: \`OutputConfig.builder().format(JsonOutputFormat.builder().schema(...).build())\`.

---

## PDF / Document Input

\`DocumentBlockParam\` builder has source shortcuts. Wrap in \`ContentBlockParam.ofDocument()\` and pass via \`.addUserMessageOfBlockParams()\`.

\`\`\`java
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.TextBlockParam;

DocumentBlockParam doc = DocumentBlockParam.builder()
    .base64Source(base64String)  // or .urlSource("https://...") or .textSource("...")
    .title("My Document")        // optional
    .build();

.addUserMessageOfBlockParams(List.of(
    ContentBlockParam.ofDocument(doc),
    ContentBlockParam.ofText(TextBlockParam.builder().text("Summarize this").build())))
\`\`\`

---

## Server-Side Tools

Version-suffixed types; \`name\`/\`type\` auto-set by builder. Direct \`.addTool()\` overloads exist for every type — no manual \`ToolUnion\` wrapping.

\`\`\`java
import com.anthropic.models.messages.WebSearchTool20260209;
import com.anthropic.models.messages.ToolBash20250124;
import com.anthropic.models.messages.ToolTextEditor20250728;
import com.anthropic.models.messages.CodeExecutionTool20260120;

.addTool(WebSearchTool20260209.builder()
    .maxUses(5L)                              // optional
    .allowedDomains(List.of("example.com"))   // optional
    .build())
.addTool(ToolBash20250124.builder().build())
.addTool(ToolTextEditor20250728.builder().build())
.addTool(CodeExecutionTool20260120.builder().build())
\`\`\`

Also available: \`WebFetchTool20260209\`, \`MemoryTool20250818\`, \`ToolSearchToolBm25_20251119\`.

### Beta namespace (MCP, compaction)

For beta-only features use \`com.anthropic.models.beta.messages.*\` — class names have a \`Beta\` prefix AND live in the beta package. The beta \`MessageCreateParams.Builder\` has direct \`.addTool(BetaToolBash20250124)\` overloads AND \`.addMcpServer()\`:

\`\`\`java
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20260120;
import com.anthropic.models.beta.messages.BetaRequestMcpServerUrlDefinition;

MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_OPUS_4_6)
    .maxTokens(1024L)
    .addBeta("mcp-client-2025-11-20")
    .addTool(BetaToolBash20250124.builder().build())
    .addTool(BetaCodeExecutionTool20260120.builder().build())
    .addMcpServer(BetaRequestMcpServerUrlDefinition.builder()
        .name("my-server")
        .url("https://example.com/mcp")
        .build())
    .addUserMessage("...")
    .build();

client.beta().messages().create(params);
\`\`\`

\`BetaTool*\` types are NOT interchangeable with non-beta \`Tool*\` — pick one namespace per request.

**Reading server-tool blocks in the response:** \`ServerToolUseBlock\` has \`.id()\`, \`.name()\` (enum), and \`._input()\` returning raw \`JsonValue\` — there is NO typed \`.input()\`. For code execution results, unwrap two levels:

\`\`\`java
for (ContentBlock block : response.content()) {
    block.serverToolUse().ifPresent(stu -> {
        System.out.println("tool: " + stu.name() + " input: " + stu._input());
    });
    block.codeExecutionToolResult().ifPresent(r -> {
        r.content().resultBlock().ifPresent(result -> {
            System.out.println("stdout: " + result.stdout());
            System.out.println("stderr: " + result.stderr());
            System.out.println("exit: " + result.returnCode());
        });
    });
}
\`\`\`

---

## Files API (Beta)

Under \`client.beta().files()\`. File references in messages need the beta message types (non-beta \`DocumentBlockParam.Source\` has no file-ID variant).

\`\`\`java
import com.anthropic.models.beta.files.FileUploadParams;
import com.anthropic.models.beta.files.FileMetadata;
import com.anthropic.models.beta.messages.BetaRequestDocumentBlock;
import java.nio.file.Paths;

FileMetadata meta = client.beta().files().upload(
    FileUploadParams.builder()
        .file(Paths.get("/path/to/doc.pdf"))  // or .file(InputStream) or .file(byte[])
        .build());

// Reference in a beta message:
BetaRequestDocumentBlock doc = BetaRequestDocumentBlock.builder()
    .fileSource(meta.id())
    .build();
\`\`\`

Other methods: \`.list()\`, \`.delete(String fileId)\`, \`.download(String fileId)\`, \`.retrieveMetadata(String fileId)\`.
`
// @from(Ln 471165, Col 4)
ZLq = () => {}
// @from(Ln 471166, Col 4)
TLq = `# Claude API — PHP

> **Note:** The PHP SDK is the official Anthropic SDK for PHP. Tool runner and Agent SDK are not available. Bedrock, Vertex AI, and Foundry clients are supported.

## Installation

\`\`\`bash
composer require "anthropic-ai/sdk"
\`\`\`

## Client Initialization

\`\`\`php
use Anthropic\\Client;

// Using API key from environment variable
$client = new Client(apiKey: getenv("ANTHROPIC_API_KEY"));
\`\`\`

### Amazon Bedrock

\`\`\`php
use Anthropic\\Bedrock;

// Constructor is private — use the static factory. Reads AWS credentials from env.
$client = Bedrock\\Client::fromEnvironment(region: 'us-east-1');
\`\`\`

### Google Vertex AI

\`\`\`php
use Anthropic\\Vertex;

// Constructor is private. Parameter is \`location\`, not \`region\`.
$client = Vertex\\Client::fromEnvironment(
    location: 'us-east5',
    projectId: 'my-project-id',
);
\`\`\`

### Anthropic Foundry

\`\`\`php
use Anthropic\\Foundry;

// Constructor is private. baseUrl or resource is required.
$client = Foundry\\Client::withCredentials(
    authToken: getenv('ANTHROPIC_FOUNDRY_AUTH_TOKEN'),
    baseUrl: 'https://<resource>.services.ai.azure.com/anthropic',
);
\`\`\`

---

## Basic Message Request

\`\`\`php
$message = $client->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 1024,
    messages: [
        ['role' => 'user', 'content' => 'What is the capital of France?'],
    ],
);

// content is an array of polymorphic blocks (TextBlock, ToolUseBlock,
// ThinkingBlock). Accessing ->text on content[0] without checking the block
// type will throw if the first block is not a TextBlock (e.g., when extended
// thinking is enabled and a ThinkingBlock comes first). Always guard:
foreach ($message->content as $block) {
    if ($block->type === 'text') {
        echo $block->text;
    }
}
\`\`\`

If you only want the first text block:

\`\`\`php
foreach ($message->content as $block) {
    if ($block->type === 'text') {
        echo $block->text;
        break;
    }
}
\`\`\`

---

## Streaming

> **Requires SDK v0.5.0+.** v0.4.0 and earlier used a single \`$params\` array; calling with named parameters throws \`Unknown named parameter $model\`. Upgrade: \`composer require "anthropic-ai/sdk:^0.6"\`

\`\`\`php
use Anthropic\\Messages\\RawContentBlockDeltaEvent;
use Anthropic\\Messages\\TextDelta;

$stream = $client->messages->createStream(
    model: '{{OPUS_ID}}',
    maxTokens: 1024,
    messages: [
        ['role' => 'user', 'content' => 'Write a haiku'],
    ],
);

foreach ($stream as $event) {
    if ($event instanceof RawContentBlockDeltaEvent && $event->delta instanceof TextDelta) {
        echo $event->delta->text;
    }
}
\`\`\`

---

## Tool Use (Manual Loop)

Tools are passed as arrays. **The SDK uses camelCase keys** (\`inputSchema\`, \`toolUseID\`, \`stopReason\`) and auto-maps to the API's snake_case on the wire — since v0.5.0. See [shared tool use concepts](../shared/tool-use-concepts.md) for the loop pattern.

\`\`\`php
use Anthropic\\Messages\\ToolUseBlock;

$tools = [
    [
        'name' => 'get_weather',
        'description' => 'Get the current weather in a given location',
        'inputSchema' => [  // camelCase, not input_schema
            'type' => 'object',
            'properties' => [
                'location' => ['type' => 'string', 'description' => 'City and state'],
            ],
            'required' => ['location'],
        ],
    ],
];

$messages = [['role' => 'user', 'content' => 'What is the weather in SF?']];

$response = $client->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 1024,
    tools: $tools,
    messages: $messages,
);

while ($response->stopReason === 'tool_use') {  // camelCase property
    $toolResults = [];
    foreach ($response->content as $block) {
        if ($block instanceof ToolUseBlock) {
            // $block->name  : string               — tool name to dispatch on
            // $block->input : array<string,mixed>  — parsed JSON input
            // $block->id    : string               — pass back as toolUseID
            $result = executeYourTool($block->name, $block->input);
            $toolResults[] = [
                'type' => 'tool_result',
                'toolUseID' => $block->id,  // camelCase, not tool_use_id
                'content' => $result,
            ];
        }
    }

    // Append assistant turn + user turn with tool results
    $messages[] = ['role' => 'assistant', 'content' => $response->content];
    $messages[] = ['role' => 'user', 'content' => $toolResults];

    $response = $client->messages->create(
        model: '{{OPUS_ID}}',
        maxTokens: 1024,
        tools: $tools,
        messages: $messages,
    );
}

// Final text response
foreach ($response->content as $block) {
    if ($block->type === 'text') {
        echo $block->text;
    }
}
\`\`\`

\`$block->type === 'tool_use'\` also works; \`instanceof ToolUseBlock\` narrows for PHPStan.


---

## Extended Thinking

**Adaptive thinking is the recommended mode for Claude 4.6+ models.** Claude decides dynamically when and how much to think.

\`\`\`php
use Anthropic\\Messages\\ThinkingBlock;

$message = $client->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 16000,
    thinking: ['type' => 'adaptive'],
    messages: [
        ['role' => 'user', 'content' => 'Solve: 27 * 453'],
    ],
);

// ThinkingBlock(s) precede TextBlock in content
foreach ($message->content as $block) {
    if ($block instanceof ThinkingBlock) {
        echo "Thinking:\\n{$block->thinking}\\n\\n";
        // $block->signature is an opaque string — preserve verbatim if
        // passing thinking blocks back in multi-turn conversations
    } elseif ($block->type === 'text') {
        echo "Answer: {$block->text}\\n";
    }
}
\`\`\`

> **Deprecated:** \`['type' => 'enabled', 'budgetTokens' => N]\` (fixed-budget extended thinking) still works on Claude 4.6 but is deprecated. Use adaptive thinking above.

\`$block->type === 'thinking'\` also works for the check; \`instanceof\` narrows for PHPStan.

---

## Beta Features & Server-Side Tools

**\`betas:\` is NOT a param on \`$client->messages->create()\`** — it only exists on the beta namespace. Use it for features that need an explicit opt-in header:

\`\`\`php
use Anthropic\\Beta\\Messages\\BetaRequestMCPServerURLDefinition;

$response = $client->beta->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 1024,
    mcpServers: [
        BetaRequestMCPServerURLDefinition::with(
            name: 'my-server',
            url: 'https://example.com/mcp',
        ),
    ],
    betas: ['mcp-client-2025-11-20'],  // only valid on ->beta->messages
    messages: [['role' => 'user', 'content' => 'Use the MCP tools']],
);
\`\`\`

**Server-side tools** (bash, web_search, text_editor, code_execution) are GA and work on both paths — \`Anthropic\\Messages\\ToolBash20250124\` / \`WebSearchTool20260209\` / \`ToolTextEditor20250728\` / \`CodeExecutionTool20260120\` for non-beta, \`Anthropic\\Beta\\Messages\\BetaToolBash20250124\` / \`BetaWebSearchTool20260209\` / \`BetaToolTextEditor20250728\` / \`BetaCodeExecutionTool20260120\` for beta. No \`betas:\` header needed for these.
`
// @from(Ln 471408, Col 4)
fLq = () => {}
// @from(Ln 471409, Col 4)
NLq = `# Agent SDK — Python

The Claude Agent SDK provides a higher-level interface for building AI agents with built-in tools, safety features, and agentic capabilities.

## Installation

\`\`\`bash
pip install claude-agent-sdk
\`\`\`

---

## Quick Start

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    async for message in query(
        prompt="Explain this codebase",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
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

## Primary Interfaces

### \`query()\` — Simple One-Shot Usage

The \`query()\` function is the simplest way to run an agent. It returns an async iterator of messages.

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async for message in query(
    prompt="Explain this codebase",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
):
    if isinstance(message, ResultMessage):
        print(message.result)
\`\`\`

### \`ClaudeSDKClient\` — Full Control

\`ClaudeSDKClient\` provides full control over the agent lifecycle. Use it when you need custom tools, hooks, streaming, or the ability to interrupt execution.

\`\`\`python
import anyio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock

async def main():
    options = ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
    async with ClaudeSDKClient(options=options) as client:
        await client.query("Explain this codebase")
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text)

anyio.run(main)
\`\`\`

\`ClaudeSDKClient\` supports:

- **Context manager** (\`async with\`) for automatic resource cleanup
- **\`client.query(prompt)\`** to send a prompt to the agent
- **\`receive_response()\`** for streaming messages until completion
- **\`interrupt()\`** to stop agent execution mid-task
- **Required for custom tools** (via SDK MCP servers)

---

## Permission System

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async for message in query(
    prompt="Refactor the authentication module",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Write"],
        permission_mode="acceptEdits"  # Auto-accept file edits
    )
):
    if isinstance(message, ResultMessage):
        print(message.result)
\`\`\`

Permission modes:

- \`"default"\`: Prompt for dangerous operations
- \`"plan"\`: Planning only, no execution
- \`"acceptEdits"\`: Auto-accept file edits
- \`"bypassPermissions"\`: Skip all prompts (use with caution)

---

## MCP (Model Context Protocol) Support

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async for message in query(
    prompt="Open example.com and describe what you see",
    options=ClaudeAgentOptions(
        mcp_servers={
            "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
        }
    )
):
    if isinstance(message, ResultMessage):
        print(message.result)
\`\`\`

---

## Hooks

Customize agent behavior with hooks using callback functions:

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, ResultMessage

async def log_file_change(input_data, tool_use_id, context):
    file_path = input_data.get('tool_input', {}).get('file_path', 'unknown')
    print(f"Modified: {file_path}")
    return {}

async for message in query(
    prompt="Refactor utils.py",
    options=ClaudeAgentOptions(
        permission_mode="acceptEdits",
        hooks={
            "PostToolUse": [HookMatcher(matcher="Edit|Write", hooks=[log_file_change])]
        }
    )
):
    if isinstance(message, ResultMessage):
        print(message.result)
\`\`\`

Hook callback inputs for tool-lifecycle events (\`PreToolUse\`, \`PostToolUse\`, \`PostToolUseFailure\`) include \`agent_id\` and \`agent_type\` fields, allowing hooks to identify which agent (main or subagent) triggered the tool call.

Available hook events: \`PreToolUse\`, \`PostToolUse\`, \`PostToolUseFailure\`, \`UserPromptSubmit\`, \`Stop\`, \`SubagentStop\`, \`PreCompact\`, \`Notification\`, \`SubagentStart\`, \`PermissionRequest\`

---

## Common Options

\`query()\` takes a top-level \`prompt\` (string) and an \`options\` object (\`ClaudeAgentOptions\`):

\`\`\`python
async for message in query(prompt="...", options=ClaudeAgentOptions(...)):
\`\`\`

| Option                              | Type   | Description                                                                |
| ----------------------------------- | ------ | -------------------------------------------------------------------------- |
| \`cwd\`                               | string | Working directory for file operations                                      |
| \`allowed_tools\`                     | list   | Tools the agent can use (e.g., \`["Read", "Edit", "Bash"]\`)                |
| \`tools\`                             | list   | Built-in tools to make available (restricts the default set)               |
| \`disallowed_tools\`                  | list   | Tools to explicitly disallow                                               |
| \`permission_mode\`                   | string | How to handle permission prompts                                           |
| \`mcp_servers\`                       | dict   | MCP servers to connect to                                                  |
| \`hooks\`                             | dict   | Hooks for customizing behavior                                             |
| \`system_prompt\`                     | string | Custom system prompt                                                       |
| \`max_turns\`                         | int    | Maximum agent turns before stopping                                        |
| \`max_budget_usd\`                    | float  | Maximum budget in USD for the query                                        |
| \`model\`                             | string | Model ID (default: determined by CLI)                                      |
| \`agents\`                            | dict   | Subagent definitions (\`dict[str, AgentDefinition]\`)                        |
| \`output_format\`                     | dict   | Structured output schema                                                   |
| \`thinking\`                          | dict   | Thinking/reasoning control                                                 |
| \`betas\`                             | list   | Beta features to enable (e.g., \`["context-1m-2025-08-07"]\`)               |
| \`setting_sources\`                   | list   | Settings to load (e.g., \`["project"]\`). Default: none (no CLAUDE.md files) |
| \`env\`                               | dict   | Environment variables to set for the session                               |

---

## Message Types

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, SystemMessage

async for message in query(
    prompt="Find TODO comments",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
):
    if isinstance(message, ResultMessage):
        print(message.result)
        print(f"Stop reason: {message.stop_reason}")  # e.g., "end_turn", "max_turns"
    elif isinstance(message, SystemMessage) and message.subtype == "init":
        session_id = message.data.get("session_id")  # Capture for resuming later
\`\`\`

Typed task message subclasses are available for better type safety when handling subagent task events:
- \`TaskStartedMessage\` — emitted when a subagent task is registered
- \`TaskProgressMessage\` — real-time progress updates with cumulative usage metrics
- \`TaskNotificationMessage\` — task completion notifications

---

## Subagents

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition, ResultMessage

async for message in query(
    prompt="Use the code-reviewer agent to review this codebase",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep", "Agent"],
        agents={
            "code-reviewer": AgentDefinition(
                description="Expert code reviewer for quality and security reviews.",
                prompt="Analyze code quality and suggest improvements.",
                tools=["Read", "Glob", "Grep"]
            )
        }
    )
):
    if isinstance(message, ResultMessage):
        print(message.result)
\`\`\`

---

## Error Handling

\`\`\`python
from claude_agent_sdk import query, ClaudeAgentOptions, CLINotFoundError, CLIConnectionError, ResultMessage

try:
    async for message in query(
        prompt="...",
        options=ClaudeAgentOptions(allowed_tools=["Read"])
    ):
        if isinstance(message, ResultMessage):
            print(message.result)
except CLINotFoundError:
    print("Claude Code CLI not found. Install with: pip install claude-agent-sdk")
except CLIConnectionError as e:
    print(f"Connection error: {e}")
\`\`\`

---

## Session History

Retrieve past session data with top-level functions:

\`\`\`python
from claude_agent_sdk import list_sessions, get_session_messages

# List all past sessions (sync function — no await)
sessions = list_sessions()
for session in sessions:
    print(f"{session.session_id}: {session.cwd}")

# Get messages from a specific session (sync function — no await)
messages = get_session_messages(session_id="...")
for msg in messages:
    print(msg)
\`\`\`

---

## MCP Server Management

Manage MCP servers at runtime using \`ClaudeSDKClient\`:

\`\`\`python
async with ClaudeSDKClient(options=options) as client:
    # Reconnect a disconnected MCP server
    await client.reconnect_mcp_server("my-server")

    # Toggle an MCP server on/off
    await client.toggle_mcp_server("my-server", enabled=False)

    # Get status of all MCP servers
    status = await client.get_mcp_status()  # returns McpStatusResponse
\`\`\`

---

## Best Practices

1. **Always specify allowed_tools** — Explicitly list which tools the agent can use
2. **Set working directory** — Always specify \`cwd\` for file operations
3. **Use appropriate permission modes** — Start with \`"default"\` and only escalate when needed
4. **Handle all message types** — Check for \`ResultMessage\` to get agent output
5. **Limit max_turns** — Prevent runaway agents with reasonable limits
`
// @from(Ln 471723, Col 4)
vLq = () => {}
// @from(Ln 471724, Col 4)
kLq = `# Agent SDK Patterns — Python

## Basic Agent

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    async for message in query(
        prompt="Explain what this repository does",
        options=ClaudeAgentOptions(
            cwd="/path/to/project",
            allowed_tools=["Read", "Glob", "Grep"]
        )
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`

---

## Custom Tools

Custom tools require an MCP server. Use \`ClaudeSDKClient\` for full control (custom SDK MCP tools require \`ClaudeSDKClient\` — \`query()\` only supports external stdio/http MCP servers).

\`\`\`python
import anyio
from claude_agent_sdk import (
    tool,
    create_sdk_mcp_server,
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    TextBlock,
)

@tool("get_weather", "Get the current weather for a location", {"location": str})
async def get_weather(args):
    location = args["location"]
    return {"content": [{"type": "text", "text": f"The weather in {location} is sunny and 72°F."}]}

server = create_sdk_mcp_server("weather-tools", tools=[get_weather])

async def main():
    options = ClaudeAgentOptions(mcp_servers={"weather": server})
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's the weather in Paris?")
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text)

anyio.run(main)
\`\`\`

---

## Hooks

### After Tool Use Hook

Log file changes after any edit:

\`\`\`python
import anyio
from datetime import datetime
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, ResultMessage

async def log_file_change(input_data, tool_use_id, context):
    file_path = input_data.get('tool_input', {}).get('file_path', 'unknown')
    with open('./audit.log', 'a') as f:
        f.write(f"{datetime.now()}: modified {file_path}\\n")
    return {}

async def main():
    async for message in query(
        prompt="Refactor utils.py to improve readability",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Write"],
            permission_mode="acceptEdits",
            hooks={
                "PostToolUse": [HookMatcher(matcher="Edit|Write", hooks=[log_file_change])]
            }
        )
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`

---

## Subagents

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition, ResultMessage

async def main():
    async for message in query(
        prompt="Use the code-reviewer agent to review this codebase",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Glob", "Grep", "Agent"],
            agents={
                "code-reviewer": AgentDefinition(
                    description="Expert code reviewer for quality and security reviews.",
                    prompt="Analyze code quality and suggest improvements.",
                    tools=["Read", "Glob", "Grep"]
                )
            }
        )
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`

---

## MCP Server Integration

### Browser Automation (Playwright)

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    async for message in query(
        prompt="Open example.com and describe what you see",
        options=ClaudeAgentOptions(
            mcp_servers={
                "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
            }
        )
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`

### Database Access (PostgreSQL)

\`\`\`python
import os
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    async for message in query(
        prompt="Show me the top 10 users by order count",
        options=ClaudeAgentOptions(
            mcp_servers={
                "postgres": {
                    "command": "npx",
                    "args": ["-y", "@modelcontextprotocol/server-postgres"],
                    "env": {"DATABASE_URL": os.environ["DATABASE_URL"]}
                }
            }
        )
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`

---

## Permission Modes

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    # Default: prompt for dangerous operations
    async for message in query(
        prompt="Delete all test files",
        options=ClaudeAgentOptions(
            allowed_tools=["Bash"],
            permission_mode="default"  # Will prompt before deleting
        )
    ):
        pass

    # Plan: agent creates a plan before making changes
    async for message in query(
        prompt="Refactor the auth system",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit"],
            permission_mode="plan"
        )
    ):
        pass

    # Accept edits: auto-accept file edits
    async for message in query(
        prompt="Refactor this module",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit"],
            permission_mode="acceptEdits"
        )
    ):
        pass

    # Bypass: skip all prompts (use with caution)
    async for message in query(
        prompt="Set up the development environment",
        options=ClaudeAgentOptions(
            allowed_tools=["Bash", "Write"],
            permission_mode="bypassPermissions"
        )
    ):
        pass

anyio.run(main)
\`\`\`

---

## Error Recovery

\`\`\`python
import anyio
from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    CLINotFoundError,
    CLIConnectionError,
    ProcessError,
    ResultMessage,
)

async def run_with_recovery():
    try:
        async for message in query(
            prompt="Fix the failing tests",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Edit", "Bash"],
                max_turns=10
            )
        ):
            if isinstance(message, ResultMessage):
                print(message.result)
    except CLINotFoundError:
        print("Claude Code CLI not found. Install with: pip install claude-agent-sdk")
    except CLIConnectionError as e:
        print(f"Connection error: {e}")
    except ProcessError as e:
        print(f"Process error: {e}")

anyio.run(run_with_recovery)
\`\`\`

---

## Session Resumption

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, SystemMessage

async def main():
    session_id = None

    # First query: capture the session ID
    async for message in query(
        prompt="Read the authentication module",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
    ):
        if isinstance(message, SystemMessage) and message.subtype == "init":
            session_id = message.data.get("session_id")

    # Resume with full context from the first query
    async for message in query(
        prompt="Now find all places that call it",  # "it" = auth module
        options=ClaudeAgentOptions(resume=session_id)
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`

---

## Session History

\`\`\`python
from claude_agent_sdk import list_sessions, get_session_messages

# List past sessions (sync function — no await)
sessions = list_sessions()
for session in sessions:
    print(f"Session {session.session_id} in {session.cwd}")

# Retrieve messages from the most recent session (sync function — no await)
if sessions:
    messages = get_session_messages(session_id=sessions[0].session_id)
    for msg in messages:
        print(msg)
\`\`\`

---

## Custom System Prompt

\`\`\`python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    async for message in query(
        prompt="Review this code",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Glob", "Grep"],
            system_prompt="""You are a senior code reviewer focused on:
1. Security vulnerabilities
2. Performance issues
3. Code maintainability

Always provide specific line numbers and suggestions for improvement."""
        )
    ):
        if isinstance(message, ResultMessage):
            print(message.result)

anyio.run(main)
\`\`\`
`
// @from(Ln 472062, Col 4)
VLq = () => {}
// @from(Ln 472063, Col 4)
yLq = `# Claude API — Python

## Installation

\`\`\`bash
pip install anthropic
\`\`\`

## Client Initialization

\`\`\`python
import anthropic

# Default (uses ANTHROPIC_API_KEY env var)
client = anthropic.Anthropic()

# Explicit API key
client = anthropic.Anthropic(api_key="your-api-key")

# Async client
async_client = anthropic.AsyncAnthropic()
\`\`\`

---

## Basic Message Request

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
# response.content is a list of content block objects (TextBlock, ThinkingBlock,
# ToolUseBlock, ...). Check .type before accessing .text.
for block in response.content:
    if block.type == "text":
        print(block.text)
\`\`\`

---

## System Prompts

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    system="You are a helpful coding assistant. Always provide examples in Python.",
    messages=[{"role": "user", "content": "How do I read a JSON file?"}]
)
\`\`\`

---

## Vision (Images)

### Base64

\`\`\`python
import base64

with open("image.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": image_data
                }
            },
            {"type": "text", "text": "What's in this image?"}
        ]
    }]
)
\`\`\`

### URL

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "url",
                    "url": "https://example.com/image.png"
                }
            },
            {"type": "text", "text": "Describe this image"}
        ]
    }]
)
\`\`\`

---

## Prompt Caching

Cache large context to reduce costs (up to 90% savings).

### Automatic Caching (Recommended)

Use top-level \`cache_control\` to automatically cache the last cacheable block in the request — no need to annotate individual content blocks:

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    cache_control={"type": "ephemeral"},  # auto-caches the last cacheable block
    system="You are an expert on this large document...",
    messages=[{"role": "user", "content": "Summarize the key points"}]
)
\`\`\`

### Manual Cache Control

For fine-grained control, add \`cache_control\` to specific content blocks:

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "You are an expert on this large document...",
        "cache_control": {"type": "ephemeral"}  # default TTL is 5 minutes
    }],
    messages=[{"role": "user", "content": "Summarize the key points"}]
)

# With explicit TTL (time-to-live)
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "You are an expert on this large document...",
        "cache_control": {"type": "ephemeral", "ttl": "1h"}  # 1 hour TTL
    }],
    messages=[{"role": "user", "content": "Summarize the key points"}]
)
\`\`\`

---

## Extended Thinking

> **Opus 4.6 and Sonnet 4.6:** Use adaptive thinking. \`budget_tokens\` is deprecated on both Opus 4.6 and Sonnet 4.6.
> **Older models:** Use \`thinking: {type: "enabled", budget_tokens: N}\` (must be < \`max_tokens\`, min 1024).

\`\`\`python
# Opus 4.6: adaptive thinking (recommended)
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # low | medium | high | max
    messages=[{"role": "user", "content": "Solve this step by step..."}]
)

# Access thinking and response
for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking}")
    elif block.type == "text":
        print(f"Response: {block.text}")
\`\`\`

---

## Error Handling

\`\`\`python
import anthropic

try:
    response = client.messages.create(...)
except anthropic.BadRequestError as e:
    print(f"Bad request: {e.message}")
except anthropic.AuthenticationError:
    print("Invalid API key")
except anthropic.PermissionDeniedError:
    print("API key lacks required permissions")
except anthropic.NotFoundError:
    print("Invalid model or endpoint")
except anthropic.RateLimitError as e:
    retry_after = int(e.response.headers.get("retry-after", "60"))
    print(f"Rate limited. Retry after {retry_after}s.")
except anthropic.APIStatusError as e:
    if e.status_code >= 500:
        print(f"Server error ({e.status_code}). Retry later.")
    else:
        print(f"API error: {e.message}")
except anthropic.APIConnectionError:
    print("Network error. Check internet connection.")
\`\`\`

---

## Multi-Turn Conversations

The API is stateless — send the full conversation history each time.

\`\`\`python
class ConversationManager:
    """Manage multi-turn conversations with the Claude API."""

    def __init__(self, client: anthropic.Anthropic, model: str, system: str = None):
        self.client = client
        self.model = model
        self.system = system
        self.messages = []

    def send(self, user_message: str, **kwargs) -> str:
        """Send a message and get a response."""
        self.messages.append({"role": "user", "content": user_message})

        response = self.client.messages.create(
            model=self.model,
            max_tokens=kwargs.get("max_tokens", 1024),
            system=self.system,
            messages=self.messages,
            **kwargs
        )

        assistant_message = next(
            (b.text for b in response.content if b.type == "text"), ""
        )
        self.messages.append({"role": "assistant", "content": assistant_message})

        return assistant_message

# Usage
conversation = ConversationManager(
    client=anthropic.Anthropic(),
    model="{{OPUS_ID}}",
    system="You are a helpful assistant."
)

response1 = conversation.send("My name is Alice.")
response2 = conversation.send("What's my name?")  # Claude remembers "Alice"
\`\`\`

**Rules:**

- Messages must alternate between \`user\` and \`assistant\`
- First message must be \`user\`

---

### Compaction (long conversations)

> **Beta, Opus 4.6 and Sonnet 4.6.** When conversations approach the 200K context window, compaction automatically summarizes earlier context server-side. The API returns a \`compaction\` block; you must pass it back on subsequent requests — append \`response.content\`, not just the text.

\`\`\`python
import anthropic

client = anthropic.Anthropic()
messages = []

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})

    response = client.beta.messages.create(
        betas=["compact-2026-01-12"],
        model="{{OPUS_ID}}",
        max_tokens=4096,
        messages=messages,
        context_management={
            "edits": [{"type": "compact_20260112"}]
        }
    )

    # Append full content — compaction blocks must be preserved
    messages.append({"role": "assistant", "content": response.content})

    return next(block.text for block in response.content if block.type == "text")

# Compaction triggers automatically when context grows large
print(chat("Help me build a Python web scraper"))
print(chat("Add support for JavaScript-rendered pages"))
print(chat("Now add rate limiting and error handling"))
\`\`\`

---

## Stop Reasons

The \`stop_reason\` field in the response indicates why the model stopped generating:

| Value | Meaning |
|-------|---------|
| \`end_turn\` | Claude finished its response naturally |
| \`max_tokens\` | Hit the \`max_tokens\` limit — increase it or use streaming |
| \`stop_sequence\` | Hit a custom stop sequence |
| \`tool_use\` | Claude wants to call a tool — execute it and continue |
| \`pause_turn\` | Model paused and can be resumed (agentic flows) |
| \`refusal\` | Claude refused for safety reasons — output may not match your schema |

---

## Cost Optimization Strategies

### 1. Use Prompt Caching for Repeated Context

\`\`\`python
# Automatic caching (simplest — caches the last cacheable block)
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    cache_control={"type": "ephemeral"},
    system=large_document_text,  # e.g., 50KB of context
    messages=[{"role": "user", "content": "Summarize the key points"}]
)

# First request: full cost
# Subsequent requests: ~90% cheaper for cached portion
\`\`\`

### 2. Choose the Right Model

\`\`\`python
# Default to Opus for most tasks
response = client.messages.create(
    model="{{OPUS_ID}}",  # $5.00/$25.00 per 1M tokens
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)

# Use Sonnet for high-volume production workloads
standard_response = client.messages.create(
    model="{{SONNET_ID}}",  # $3.00/$15.00 per 1M tokens
    max_tokens=1024,
    messages=[{"role": "user", "content": "Summarize this document"}]
)

# Use Haiku only for simple, speed-critical tasks
simple_response = client.messages.create(
    model="{{HAIKU_ID}}",  # $1.00/$5.00 per 1M tokens
    max_tokens=256,
    messages=[{"role": "user", "content": "Classify this as positive or negative"}]
)
\`\`\`

### 3. Use Token Counting Before Requests

\`\`\`python
count_response = client.messages.count_tokens(
    model="{{OPUS_ID}}",
    messages=messages,
    system=system
)

estimated_input_cost = count_response.input_tokens * 0.000005  # $5/1M tokens
print(f"Estimated input cost: \${estimated_input_cost:.4f}")
\`\`\`

---

## Retry with Exponential Backoff

> **Note:** The Anthropic SDK automatically retries rate limit (429) and server errors (5xx) with exponential backoff. You can configure this with \`max_retries\` (default: 2). Only implement custom retry logic if you need behavior beyond what the SDK provides.

\`\`\`python
import time
import random
import anthropic

def call_with_retry(
    client: anthropic.Anthropic,
    max_retries: int = 5,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    **kwargs
):
    """Call the API with exponential backoff retry."""
    last_exception = None

    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except anthropic.RateLimitError as e:
            last_exception = e
        except anthropic.APIStatusError as e:
            if e.status_code >= 500:
                last_exception = e
            else:
                raise  # Client errors (4xx except 429) should not be retried

        delay = min(base_delay * (2 ** attempt) + random.uniform(0, 1), max_delay)
        print(f"Retry {attempt + 1}/{max_retries} after {delay:.1f}s")
        time.sleep(delay)

    raise last_exception
\`\`\`
`
// @from(Ln 472474, Col 4)
ELq = () => {}
// @from(Ln 472475, Col 4)
RLq = `# Message Batches API — Python

The Batches API (\`POST /v1/messages/batches\`) processes Messages API requests asynchronously at 50% of standard prices.

## Key Facts

- Up to 100,000 requests or 256 MB per batch
- Most batches complete within 1 hour; maximum 24 hours
- Results available for 29 days after creation
- 50% cost reduction on all token usage
- All Messages API features supported (vision, tools, caching, etc.)

---

## Create a Batch

\`\`\`python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="request-1",
            params=MessageCreateParamsNonStreaming(
                model="{{OPUS_ID}}",
                max_tokens=1024,
                messages=[{"role": "user", "content": "Summarize climate change impacts"}]
            )
        ),
        Request(
            custom_id="request-2",
            params=MessageCreateParamsNonStreaming(
                model="{{OPUS_ID}}",
                max_tokens=1024,
                messages=[{"role": "user", "content": "Explain quantum computing basics"}]
            )
        ),
    ]
)

print(f"Batch ID: {message_batch.id}")
print(f"Status: {message_batch.processing_status}")
\`\`\`

---

## Poll for Completion

\`\`\`python
import time

while True:
    batch = client.messages.batches.retrieve(message_batch.id)
    if batch.processing_status == "ended":
        break
    print(f"Status: {batch.processing_status}, processing: {batch.request_counts.processing}")
    time.sleep(60)

print("Batch complete!")
print(f"Succeeded: {batch.request_counts.succeeded}")
print(f"Errored: {batch.request_counts.errored}")
\`\`\`

---

## Retrieve Results

> **Note:** Examples below use \`match/case\` syntax, requiring Python 3.10+. For earlier versions, use \`if/elif\` chains instead.

\`\`\`python
for result in client.messages.batches.results(message_batch.id):
    match result.result.type:
        case "succeeded":
            msg = result.result.message
            text = next((b.text for b in msg.content if b.type == "text"), "")
            print(f"[{result.custom_id}] {text[:100]}")
        case "errored":
            if result.result.error.type == "invalid_request":
                print(f"[{result.custom_id}] Validation error - fix request and retry")
            else:
                print(f"[{result.custom_id}] Server error - safe to retry")
        case "canceled":
            print(f"[{result.custom_id}] Canceled")
        case "expired":
            print(f"[{result.custom_id}] Expired - resubmit")
\`\`\`

---

## Cancel a Batch

\`\`\`python
cancelled = client.messages.batches.cancel(message_batch.id)
print(f"Status: {cancelled.processing_status}")  # "canceling"
\`\`\`

---

## Batch with Prompt Caching

\`\`\`python
shared_system = [
    {"type": "text", "text": "You are a literary analyst."},
    {
        "type": "text",
        "text": large_document_text,  # Shared across all requests
        "cache_control": {"type": "ephemeral"}
    }
]

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id=f"analysis-{i}",
            params=MessageCreateParamsNonStreaming(
                model="{{OPUS_ID}}",
                max_tokens=1024,
                system=shared_system,
                messages=[{"role": "user", "content": question}]
            )
        )
        for i, question in enumerate(questions)
    ]
)
\`\`\`

---

## Full End-to-End Example

\`\`\`python
import anthropic
import time
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

# 1. Prepare requests
items_to_classify = [
    "The product quality is excellent!",
    "Terrible customer service, never again.",
    "It's okay, nothing special.",
]

requests = [
    Request(
        custom_id=f"classify-{i}",
        params=MessageCreateParamsNonStreaming(
            model="{{HAIKU_ID}}",
            max_tokens=50,
            messages=[{
                "role": "user",
                "content": f"Classify as positive/negative/neutral (one word): {text}"
            }]
        )
    )
    for i, text in enumerate(items_to_classify)
]

# 2. Create batch
batch = client.messages.batches.create(requests=requests)
print(f"Created batch: {batch.id}")

# 3. Wait for completion
while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(10)

# 4. Collect results
results = {}
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        msg = result.result.message
        results[result.custom_id] = next((b.text for b in msg.content if b.type == "text"), "")

for custom_id, classification in sorted(results.items()):
    print(f"{custom_id}: {classification}")
\`\`\`
`
// @from(Ln 472661, Col 4)
LLq = () => {}
// @from(Ln 472662, Col 4)
SLq = `# Files API — Python

The Files API uploads files for use in Messages API requests. Reference files via \`file_id\` in content blocks, avoiding re-uploads across multiple API calls.

**Beta:** Pass \`betas=["files-api-2025-04-14"]\` in your API calls (the SDK sets the required header automatically).

## Key Facts

- Maximum file size: 500 MB
- Total storage: 100 GB per organization
- Files persist until deleted
- File operations (upload, list, delete) are free; content used in messages is billed as input tokens
- Not available on Amazon Bedrock or Google Vertex AI

---

## Upload a File

\`\`\`python
import anthropic

client = anthropic.Anthropic()

uploaded = client.beta.files.upload(
    file=("report.pdf", open("report.pdf", "rb"), "application/pdf"),
)
print(f"File ID: {uploaded.id}")
print(f"Size: {uploaded.size_bytes} bytes")
\`\`\`

---

## Use a File in Messages

### PDF / Text Document

\`\`\`python
response = client.beta.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Summarize the key findings in this report."},
            {
                "type": "document",
                "source": {"type": "file", "file_id": uploaded.id},
                "title": "Q4 Report",           # optional
                "citations": {"enabled": True}   # optional, enables citations
            }
        ]
    }],
    betas=["files-api-2025-04-14"],
)
for block in response.content:
    if block.type == "text":
        print(block.text)
\`\`\`

### Image

\`\`\`python
image_file = client.beta.files.upload(
    file=("photo.png", open("photo.png", "rb"), "image/png"),
)

response = client.beta.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {
                "type": "image",
                "source": {"type": "file", "file_id": image_file.id}
            }
        ]
    }],
    betas=["files-api-2025-04-14"],
)
\`\`\`

---

## Manage Files

### List Files

\`\`\`python
files = client.beta.files.list()
for f in files.data:
    print(f"{f.id}: {f.filename} ({f.size_bytes} bytes)")
\`\`\`

### Get File Metadata

\`\`\`python
file_info = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
print(f"Filename: {file_info.filename}")
print(f"MIME type: {file_info.mime_type}")
\`\`\`

### Delete a File

\`\`\`python
client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
\`\`\`

### Download a File

Only files created by the code execution tool or skills can be downloaded (not user-uploaded files).

\`\`\`python
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")
file_content.write_to_file("output.txt")
\`\`\`

---

## Full End-to-End Example

Upload a document once, ask multiple questions about it:

\`\`\`python
import anthropic

client = anthropic.Anthropic()

# 1. Upload once
uploaded = client.beta.files.upload(
    file=("contract.pdf", open("contract.pdf", "rb"), "application/pdf"),
)
print(f"Uploaded: {uploaded.id}")

# 2. Ask multiple questions using the same file_id
questions = [
    "What are the key terms and conditions?",
    "What is the termination clause?",
    "Summarize the payment schedule.",
]

for question in questions:
    response = client.beta.messages.create(
        model="{{OPUS_ID}}",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": question},
                {
                    "type": "document",
                    "source": {"type": "file", "file_id": uploaded.id}
                }
            ]
        }],
        betas=["files-api-2025-04-14"],
    )
    print(f"\\nQ: {question}")
    text = next((b.text for b in response.content if b.type == "text"), "")
    print(f"A: {text[:200]}")

# 3. Clean up when done
client.beta.files.delete(uploaded.id)
\`\`\`
`
// @from(Ln 472828, Col 4)
hLq = () => {}